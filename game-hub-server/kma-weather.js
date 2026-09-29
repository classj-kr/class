// 기상청 단기예보 조회서비스(공공데이터포털) 프록시.
//
// 인증키는 서버 환경변수 KMA_API_KEY에만 두고, 대시보드는 /api/weather만
// 부른다. 같은 격자(약 5km)는 여러 학급이 함께 쓰므로 격자 단위로 캐시해
// 이용자 수와 관계없이 기상청 호출 수를 적게 유지한다.
const KMA_BASE_URL = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0";
const NOWCAST_TTL_MS = 10 * 60 * 1000;
const FORECAST_TTL_MS = 3 * 60 * 60 * 1000;
const MAX_CACHE_ENTRIES = 500;
const FORECAST_BASE_HOURS = [2, 5, 8, 11, 14, 17, 20, 23];

// 기상청 격자 변환(Lambert Conformal Conic). 기상청 공개 변환식 그대로.
function latLonToGrid(lat, lon) {
  const RE = 6371.00877, GRID = 5.0, SLAT1 = 30.0, SLAT2 = 60.0, OLON = 126.0, OLAT = 38.0, XO = 43, YO = 136;
  const DEGRAD = Math.PI / 180.0;
  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD, slat2 = SLAT2 * DEGRAD, olon = OLON * DEGRAD, olat = OLAT * DEGRAD;
  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = re * sf / Math.pow(ro, sn);
  let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
  ra = re * sf / Math.pow(ra, sn);
  let theta = lon * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;
  return {
    nx: Math.floor(ra * Math.sin(theta) + XO + 0.5),
    ny: Math.floor(ro - ra * Math.cos(theta) + YO + 0.5)
  };
}

// KST 기준 날짜·시각 조각. 서버(Render)는 UTC로 돌기 때문에 직접 9시간을 더한다.
function kstParts(date) {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const pad = (value) => String(value).padStart(2, "0");
  return {
    date: kst.getUTCFullYear() + pad(kst.getUTCMonth() + 1) + pad(kst.getUTCDate()),
    hour: kst.getUTCHours(),
    minute: kst.getUTCMinutes()
  };
}

function shiftHours(date, hours) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

// 초단기실황은 매시 정각 자료가 40분 무렵부터 제공된다.
function nowcastBase(now) {
  const target = kstParts(now).minute < 40 ? shiftHours(now, -1) : now;
  const parts = kstParts(target);
  return { baseDate: parts.date, baseTime: String(parts.hour).padStart(2, "0") + "00" };
}

// 단기예보는 02·05·…·23시 발표분이 10분 무렵부터 제공된다.
function forecastBase(now) {
  const { date, hour, minute } = kstParts(now);
  const ready = FORECAST_BASE_HOURS.filter((base) => hour > base || (hour === base && minute >= 10));
  if (ready.length) {
    return { baseDate: date, baseTime: String(ready[ready.length - 1]).padStart(2, "0") + "00" };
  }
  return { baseDate: kstParts(shiftHours(now, -24)).date, baseTime: "2300" };
}

// 전날 23시 발표분은 오늘 0시부터 담고 있어서, 최신 발표분에 없는 오늘의
// 지난 시간대를 채우는 데 쓴다.
function previousNightBase(now) {
  return { baseDate: kstParts(shiftHours(now, -24)).date, baseTime: "2300" };
}

// 대시보드는 Open-Meteo(WMO) 날씨 코드로 아이콘을 그리므로 같은 코드로 맞춘다.
// PTY(강수형태): 1 비, 2 비/눈, 3 눈, 4 소나기, 5 빗방울, 6 빗방울눈날림, 7 눈날림
// SKY(하늘상태): 1 맑음, 3 구름많음, 4 흐림
function toWeatherCode(pty, sky) {
  const precipitation = { 1: 61, 2: 66, 3: 71, 4: 80, 5: 51, 6: 56, 7: 71 }[Number(pty)];
  if (precipitation) return { code: precipitation, label: "" };
  if (Number(sky) === 1) return { code: 0, label: "맑음" };
  if (Number(sky) === 3) return { code: 2, label: "구름많음" };
  if (Number(sky) === 4) return { code: 3, label: "흐림" };
  return { code: null, label: "" };
}

// 태양 고도로 낮/밤을 가른다(아이콘의 해·달 구분용이라 대략값이면 충분).
function isDaytime(date, lat, lon) {
  const rad = Math.PI / 180;
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start) / 86400000);
  const declination = 23.44 * Math.sin(2 * Math.PI * (284 + dayOfYear) / 365) * rad;
  const solarHours = date.getUTCHours() + date.getUTCMinutes() / 60 + lon / 15;
  const hourAngle = 15 * (solarHours - 12) * rad;
  const elevation = Math.asin(Math.sin(lat * rad) * Math.sin(declination)
    + Math.cos(lat * rad) * Math.cos(declination) * Math.cos(hourAngle));
  return elevation > -0.833 * rad ? 1 : 0;
}

function normalizeServiceKey(key) {
  const trimmed = String(key || "").trim();
  // 포털의 "Encoding" 키를 넣어도 이중 인코딩되지 않게 한 번 풀어 둔다.
  if (!trimmed.includes("%")) return trimmed;
  try { return decodeURIComponent(trimmed); } catch (_) { return trimmed; }
}

function createKmaWeather({ serviceKey, fetchImpl = fetch, now = () => new Date() } = {}) {
  const key = normalizeServiceKey(serviceKey);
  const cache = new Map();

  async function cached(cacheKey, ttl, load) {
    const hit = cache.get(cacheKey);
    if (hit && hit.expiresAt > Date.now()) return hit.promise;
    const promise = load();
    cache.set(cacheKey, { promise, expiresAt: Date.now() + ttl });
    promise.catch(() => cache.delete(cacheKey));
    if (cache.size > MAX_CACHE_ENTRIES) {
      for (const [entryKey, entry] of cache) {
        if (entry.expiresAt <= Date.now() || cache.size > MAX_CACHE_ENTRIES) cache.delete(entryKey);
      }
    }
    return promise;
  }

  async function callKma(operation, { baseDate, baseTime }, { nx, ny }) {
    const query = new URLSearchParams({
      serviceKey: key, pageNo: "1", numOfRows: "1000", dataType: "JSON",
      base_date: baseDate, base_time: baseTime, nx: String(nx), ny: String(ny)
    });
    const response = await fetchImpl(`${KMA_BASE_URL}/${operation}?${query}`, { signal: AbortSignal.timeout(10000) });
    const text = await response.text();
    // 등록되지 않았거나 아직 승인 전인 키는 게이트웨이가 403으로 막는다.
    if (response.ok === false) throw new Error(`KMA ${operation}: HTTP ${response.status} ${text.slice(0, 200)}`);
    let data;
    try {
      data = JSON.parse(text);
    } catch (_) {
      // 인증키 오류 등은 dataType과 상관없이 XML로 온다.
      const reason = text.match(/<returnAuthMsg>([^<]+)</)?.[1] || text.match(/<resultMsg>([^<]+)</)?.[1] || "INVALID_RESPONSE";
      throw new Error(`KMA ${operation}: ${reason}`);
    }
    const header = data?.response?.header;
    if (header?.resultCode !== "00") throw new Error(`KMA ${operation}: ${header?.resultCode} ${header?.resultMsg}`);
    return data.response.body?.items?.item || [];
  }

  function nowcast(grid, at) {
    const base = nowcastBase(at);
    const load = async () => {
      try {
        return await callKma("getUltraSrtNcst", base, grid);
      } catch (error) {
        // 정시 자료가 늦게 올라오는 경우가 있어 한 시간 전 자료로 한 번 더 시도.
        return callKma("getUltraSrtNcst", nowcastBase(shiftHours(at, -1)), grid);
      }
    };
    return cached(`ncst:${grid.nx},${grid.ny}:${base.baseDate}${base.baseTime}`, NOWCAST_TTL_MS, load);
  }

  function forecast(grid, base) {
    return cached(`fcst:${grid.nx},${grid.ny}:${base.baseDate}${base.baseTime}`, FORECAST_TTL_MS,
      () => callKma("getVilageFcst", base, grid));
  }

  async function getWeather(lat, lon) {
    const at = now();
    const grid = latLonToGrid(lat, lon);
    const latest = forecastBase(at);
    const night = previousNightBase(at);
    const sameBase = latest.baseDate === night.baseDate && latest.baseTime === night.baseTime;
    const [ncstItems, latestItems, nightItems] = await Promise.all([
      nowcast(grid, at),
      forecast(grid, latest),
      sameBase ? Promise.resolve([]) : forecast(grid, night).catch(() => [])
    ]);

    const today = kstParts(at).date;
    const hours = new Map();
    // 전날 밤 발표분을 먼저 깔고 최신 발표분으로 덮어쓴다.
    for (const item of [...nightItems, ...latestItems]) {
      if (item.fcstDate !== today) continue;
      const hour = Number(String(item.fcstTime).slice(0, 2));
      if (!hours.has(hour)) hours.set(hour, {});
      hours.get(hour)[item.category] = item.fcstValue;
    }
    const isoDate = `${today.slice(0, 4)}-${today.slice(4, 6)}-${today.slice(6, 8)}`;
    const hourly = [...hours.entries()].sort((a, b) => a[0] - b[0]).map(([hour, values]) => {
      const time = `${isoDate}T${String(hour).padStart(2, "0")}:00`;
      const condition = toWeatherCode(values.PTY, values.SKY);
      return {
        time, hour,
        temperature: values.TMP === undefined ? null : Number(values.TMP),
        humidity: values.REH === undefined ? null : Number(values.REH),
        rain: values.POP === undefined ? null : Number(values.POP),
        code: condition.code, label: condition.label,
        isDay: isDaytime(new Date(`${time}:00+09:00`), lat, lon)
      };
    });

    const observed = Object.fromEntries(ncstItems.map((item) => [item.category, item.obsrValue]));
    const observedBase = ncstItems[0] ? `${ncstItems[0].baseDate}${ncstItems[0].baseTime}` : "";
    const currentHour = kstParts(at).hour;
    const nowSlot = hourly.find((item) => item.hour === currentHour) || hourly.find((item) => item.hour > currentHour);
    // 실황에는 하늘상태가 없어서, 비·눈이 없으면 이번 시간 예보의 하늘상태를 쓴다.
    const currentCondition = Number(observed.PTY) > 0 ? toWeatherCode(observed.PTY) : { code: nowSlot?.code ?? null, label: nowSlot?.label || "" };
    return {
      source: "kma",
      grid,
      current: {
        time: observedBase ? `${observedBase.slice(0, 4)}-${observedBase.slice(4, 6)}-${observedBase.slice(6, 8)}T${observedBase.slice(8, 10)}:${observedBase.slice(10, 12)}` : null,
        temperature: observed.T1H === undefined ? null : Number(observed.T1H),
        humidity: observed.REH === undefined ? null : Number(observed.REH),
        code: currentCondition.code, label: currentCondition.label,
        isDay: isDaytime(at, lat, lon)
      },
      hourly
    };
  }

  async function handler(req, res) {
    if (!key) return res.status(503).json({ error: "KMA_NOT_CONFIGURED", message: "기상청 인증키가 설정되지 않았습니다." });
    const lat = Number(req.query?.lat);
    const lon = Number(req.query?.lon);
    // 기상청 격자가 덮는 한반도 주변만 받는다.
    if (!(lat >= 32 && lat <= 39.5 && lon >= 124 && lon <= 132)) {
      return res.status(400).json({ error: "OUT_OF_RANGE", message: "국내 좌표만 조회할 수 있습니다." });
    }
    try {
      res.json(await getWeather(lat, lon));
    } catch (error) {
      console.error("KMA weather failed:", error.message);
      res.status(502).json({ error: "KMA_UNAVAILABLE", message: "기상청 날씨를 불러오지 못했습니다." });
    }
  }

  return { getWeather, handler };
}

module.exports = { createKmaWeather, latLonToGrid, nowcastBase, forecastBase, toWeatherCode, isDaytime };
