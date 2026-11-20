// 학급 대시보드 날씨: 학생·교사 브라우저는 우리 서버만 부른다.
//
// 서버가 학교 좌표로 기상청 단기예보(kma-weather.js)를 받고, 기상청이 안 되면
// Open-Meteo 예보로 대신한다. 미세먼지는 Open-Meteo 대기질 자료를 서버가 받는다.
// 바깥 서비스는 모두 서버끼리 부르고, 좌표 둘레(약 1km)마다 캐시해 호출 수를 줄인다.
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

function createSchoolWeather({ kma, fetchImpl = fetch } = {}) {
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
    return { ...forecast.value, air: airQuality.status === "fulfilled" ? airQuality.value : null };
  }

  return { get };
}

module.exports = { createSchoolWeather, inKorea };
