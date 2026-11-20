// 학급 대시보드 날씨: 학생·교사 브라우저는 우리 서버만 부른다.
//
// 서버가 학교 좌표로 기상청 단기예보(kma-weather.js)를 받고, 기상청이 안 되면
// Open-Meteo 예보로 대신한다. 미세먼지는 Open-Meteo 대기질 자료를 서버가 받는다.
// 바깥 서비스는 모두 서버끼리 부르고, 좌표 둘레(약 1km)마다 캐시해 호출 수를 줄인다.
const { isDaytime } = require("./kma-weather");

const OPEN_METEO_FORECAST = "https://api.open-meteo.com/v1/forecast";
const OPEN_METEO_AIR = "https://air-quality-api.open-meteo.com/v1/air-quality";
const FORECAST_TTL_MS = 30 * 60 * 1000;
const AIR_TTL_MS = 30 * 60 * 1000;
const MAX_CACHE_ENTRIES = 500;

function inKorea(lat, lon) {
  return Number.isFinite(lat) && Number.isFinite(lon) && lat >= 32 && lat <= 39.5 && lon >= 124 && lon <= 132;
}

function finite(value) {
  const number = Number(value);
  return value === null || value === undefined || !Number.isFinite(number) ? null : number;
}

// 달: 그 시각 학교 자리에서 달이 떠 있는지와 모양. 대시보드가 맑은 밤에 그날 달(졌으면 별)을 그린다.
// 아이콘용이라 저정밀 공식(aa.quae.nl 의 천문 계산 안내, 오차 몇 분)으로 충분하다.
const RAD = Math.PI / 180;
const OBLIQUITY = RAD * 23.4397;
const SUN_DISTANCE_KM = 149598000;

function equatorial(longitude, latitude) {
  return {
    ra: Math.atan2(Math.sin(longitude) * Math.cos(OBLIQUITY) - Math.tan(latitude) * Math.sin(OBLIQUITY), Math.cos(longitude)),
    dec: Math.asin(Math.sin(latitude) * Math.cos(OBLIQUITY) + Math.cos(latitude) * Math.sin(OBLIQUITY) * Math.sin(longitude))
  };
}

function moonAt(date, lat, lon) {
  const d = date.getTime() / 86400000 - 10957.5; // 2000-01-01 12:00 UTC 부터 지난 날수
  const L = RAD * (218.316 + 13.176396 * d);
  const M = RAD * (134.963 + 13.064993 * d);
  const F = RAD * (93.272 + 13.22935 * d);
  const moon = { ...equatorial(L + RAD * 6.289 * Math.sin(M), RAD * 5.128 * Math.sin(F)), distance: 385001 - 20905 * Math.cos(M) };
  const hourAngle = RAD * (280.16 + 360.9856235 * d) + RAD * lon - moon.ra;
  const phi = RAD * lat;
  const altitude = Math.asin(Math.sin(phi) * Math.sin(moon.dec) + Math.cos(phi) * Math.cos(moon.dec) * Math.cos(hourAngle));
  const sunAnomaly = RAD * (357.5291 + 0.98560028 * d);
  const center = RAD * (1.9148 * Math.sin(sunAnomaly) + 0.02 * Math.sin(2 * sunAnomaly) + 0.0003 * Math.sin(3 * sunAnomaly));
  const sun = equatorial(sunAnomaly + center + RAD * 102.9372 + Math.PI, 0);
  const elongation = Math.acos(Math.sin(sun.dec) * Math.sin(moon.dec) + Math.cos(sun.dec) * Math.cos(moon.dec) * Math.cos(sun.ra - moon.ra));
  const inclination = Math.atan2(SUN_DISTANCE_KM * Math.sin(elongation), moon.distance - SUN_DISTANCE_KM * Math.cos(elongation));
  const side = Math.atan2(Math.cos(sun.dec) * Math.sin(sun.ra - moon.ra),
    Math.sin(sun.dec) * Math.cos(moon.dec) - Math.cos(sun.dec) * Math.sin(moon.dec) * Math.cos(sun.ra - moon.ra));
  return {
    // 지평선 기준은 달이 뜨고 지는 순간(시차·대기 굴절·달 크기를 더한 0.133°)
    up: altitude > RAD * 0.133,
    fraction: Math.round(((1 + Math.cos(inclination)) / 2) * 100) / 100, // 밝은 부분 비율
    phase: Math.round((0.5 + (0.5 * inclination * (side < 0 ? -1 : 1)) / Math.PI) * 1000) / 1000 // 0 삭·0.25 상현·0.5 보름·0.75 하현
  };
}

// 예보 시간 칸은 그 시간의 가운데(30분)로 본다. time 은 한국 시각 "2026-11-20T21:00".
// 지금 날씨 칸의 낮·밤은 예보를 받아 둔 시각(최대 30분 캐시)이 아니라 부를 때마다 새로 가른다.
// 그러지 않으면 해 뜰 무렵·질 무렵에 칸 색(하늘색·밤하늘색)과 해·달 아이콘이 늦게 바뀐다.
function withMoon(forecast, lat, lon, now = new Date()) {
  return {
    ...forecast,
    current: { ...forecast.current, isDay: isDaytime(now, lat, lon), moon: moonAt(now, lat, lon) },
    hourly: (forecast.hourly || []).map((item) => ({ ...item, moon: moonAt(new Date(`${String(item.time).slice(0, 13)}:30:00+09:00`), lat, lon) }))
  };
}

function createSchoolWeather({ kma, fetchImpl = fetch, clock = () => new Date() } = {}) {
  const cache = new Map();

  function cached(key, ttl, load) {
    const hit = cache.get(key);
    if (hit && hit.expiresAt > Date.now()) return hit.promise;
    const promise = load();
    cache.set(key, { promise, expiresAt: Date.now() + ttl });
    promise.catch(() => cache.delete(key));
    if (cache.size > MAX_CACHE_ENTRIES) {
      for (const [entryKey, entry] of cache) {
        if (entry.expiresAt <= Date.now() || cache.size > MAX_CACHE_ENTRIES) cache.delete(entryKey);
      }
    }
    return promise;
  }

  async function json(url) {
    const response = await fetchImpl(url, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  const place = (lat, lon) => `${lat.toFixed(2)},${lon.toFixed(2)}`;

  function openMeteoForecast(lat, lon) {
    return cached(`fcst:${place(lat, lon)}`, FORECAST_TTL_MS, async () => {
      const query = new URLSearchParams({
        latitude: String(lat), longitude: String(lon), timezone: "Asia/Seoul", forecast_days: "2",
        current: "temperature_2m,relative_humidity_2m,weather_code,is_day",
        hourly: "temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,is_day"
      });
      const data = await json(`${OPEN_METEO_FORECAST}?${query}`);
      const current = data.current || {};
      const hourly = data.hourly || {};
      return {
        source: "open-meteo",
        current: {
          temperature: finite(current.temperature_2m), humidity: finite(current.relative_humidity_2m),
          code: finite(current.weather_code), isDay: finite(current.is_day)
        },
        hourly: (hourly.time || []).map((time, index) => ({
          time, hour: Number(String(time).slice(11, 13)),
          temperature: finite(hourly.temperature_2m?.[index]), humidity: finite(hourly.relative_humidity_2m?.[index]),
          rain: finite(hourly.precipitation_probability?.[index]), code: finite(hourly.weather_code?.[index]),
          isDay: finite(hourly.is_day?.[index])
        }))
      };
    });
  }

  function air(lat, lon) {
    return cached(`air:${place(lat, lon)}`, AIR_TTL_MS, async () => {
      const query = new URLSearchParams({ latitude: String(lat), longitude: String(lon), current: "pm10,pm2_5" });
      const current = (await json(`${OPEN_METEO_AIR}?${query}`)).current || {};
      return { pm10: finite(current.pm10), pm25: finite(current.pm2_5) };
    });
  }

  async function get(lat, lon) {
    if (!inKorea(lat, lon)) throw new Error("OUT_OF_RANGE");
    const kmaForecast = kma?.configured
      ? kma.getWeather(lat, lon).then(({ grid, ...rest }) => rest)
      : Promise.reject(new Error("KMA_NOT_CONFIGURED"));
    const [forecast, airQuality] = await Promise.allSettled([
      kmaForecast.catch((error) => {
        if (kma?.configured) console.warn("KMA weather failed, using Open-Meteo:", error.message);
        return openMeteoForecast(lat, lon);
      }),
      air(lat, lon)
    ]);
    if (forecast.status !== "fulfilled") throw forecast.reason;
    if (airQuality.status !== "fulfilled") console.warn("Air quality failed:", airQuality.reason?.message);
    return { ...withMoon(forecast.value, lat, lon, clock()), air: airQuality.status === "fulfilled" ? airQuality.value : null };
  }

  return { get };
}

module.exports = { createSchoolWeather, inKorea, moonAt };
