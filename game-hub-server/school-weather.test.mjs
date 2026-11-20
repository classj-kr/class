import assert from "node:assert/strict";
import test from "node:test";
import schoolWeather from "./school-weather.js";

const { createSchoolWeather, inKorea } = schoolWeather;

const kmaResult = {
  source: "kma", grid: { nx: 61, ny: 129 },
  current: { temperature: 4, humidity: 31, code: 0, label: "맑음", isDay: 1 },
  hourly: [{ time: "2026-11-20T10:00", hour: 10, temperature: 4, humidity: 31, rain: 0, code: 0, label: "맑음", isDay: 1 }]
};

function fakeFetch(calls, { airFails = false, forecastFails = false } = {}) {
  return async (url) => {
    calls.push(String(url));
    if (String(url).includes("air-quality")) {
      if (airFails) return { ok: false, status: 500, json: async () => ({}) };
      return { ok: true, json: async () => ({ current: { pm10: 42.4, pm2_5: 8.6 } }) };
    }
    if (forecastFails) return { ok: false, status: 503, json: async () => ({}) };
    return {
      ok: true,
      json: async () => ({
        current: { temperature_2m: 3.2, relative_humidity_2m: 40, weather_code: 2, is_day: 1 },
        hourly: { time: ["2026-11-20T10:00", "2026-11-20T11:00"], temperature_2m: [3, 4], relative_humidity_2m: [40, 38], precipitation_probability: [0, 10], weather_code: [2, 3], is_day: [1, 1] }
      })
    };
  };
}

test("국내 좌표만 받는다", () => {
  assert.equal(inKorea(37.5, 127), true);
  assert.equal(inKorea(35.1, 129.0), true);
  assert.equal(inKorea(40.7, -74), false);
  assert.equal(inKorea(Number.NaN, 127), false);
});

test("기상청 예보에 미세먼지를 붙이고, 격자는 내보내지 않는다", async () => {
  const calls = [];
  const kma = { configured: true, getWeather: async () => structuredClone(kmaResult) };
  const service = createSchoolWeather({ kma, fetchImpl: fakeFetch(calls) });
  const result = await service.get(37.66, 127.06);
  assert.equal(result.source, "kma");
  assert.equal(result.grid, undefined);
  assert.deepEqual(result.air, { pm10: 42.4, pm25: 8.6 });
  assert.equal(result.hourly.length, 1);
  assert.equal(calls.filter((url) => url.includes("api.open-meteo.com/v1/forecast")).length, 0);
});

test("기상청이 안 되면 Open-Meteo 예보로 대신한다", async () => {
  const calls = [];
  const kma = { configured: true, getWeather: async () => { throw new Error("KMA down"); } };
  const service = createSchoolWeather({ kma, fetchImpl: fakeFetch(calls) });
  const result = await service.get(37.66, 127.06);
  assert.equal(result.source, "open-meteo");
  const { moon: currentMoon, ...current } = result.current;
  const { moon: hourMoon, ...hour } = result.hourly[1];
  const { isDay, ...rest } = current;
  assert.deepEqual(rest, { temperature: 3.2, humidity: 40, code: 2 });
  assert.ok(isDay === 0 || isDay === 1);
  assert.deepEqual(hour, { time: "2026-11-20T11:00", hour: 11, temperature: 4, humidity: 38, rain: 10, code: 3, isDay: 1 });
  assert.ok(currentMoon && hourMoon);
});

test("기상청 인증키가 없으면 기상청을 부르지 않는다", async () => {
  let kmaCalled = false;
  const kma = { configured: false, getWeather: async () => { kmaCalled = true; return kmaResult; } };
  const service = createSchoolWeather({ kma, fetchImpl: fakeFetch([]) });
  const result = await service.get(37.66, 127.06);
  assert.equal(kmaCalled, false);
  assert.equal(result.source, "open-meteo");
});

test("미세먼지만 실패하면 예보는 그대로 주고 미세먼지는 비운다", async () => {
  const kma = { configured: true, getWeather: async () => structuredClone(kmaResult) };
  const service = createSchoolWeather({ kma, fetchImpl: fakeFetch([], { airFails: true }) });
  const result = await service.get(37.66, 127.06);
  assert.equal(result.source, "kma");
  assert.equal(result.air, null);
});

test("예보가 모두 실패하면 오류를 낸다", async () => {
  const kma = { configured: true, getWeather: async () => { throw new Error("KMA down"); } };
  const service = createSchoolWeather({ kma, fetchImpl: fakeFetch([], { forecastFails: true }) });
  await assert.rejects(service.get(37.66, 127.06));
});

test("나라 밖 좌표는 바깥 서비스를 부르기 전에 막는다", async () => {
  const calls = [];
  const service = createSchoolWeather({ kma: { configured: false }, fetchImpl: fakeFetch(calls) });
  await assert.rejects(service.get(40.7, -74), /OUT_OF_RANGE/);
  assert.equal(calls.length, 0);
});

test("같은 동네(약 1km)는 30분 동안 다시 묻지 않는다", async () => {
  const calls = [];
  const service = createSchoolWeather({ kma: { configured: false }, fetchImpl: fakeFetch(calls) });
  await service.get(37.661, 127.061);
  await service.get(37.663, 127.064);
  assert.equal(calls.length, 2); // 예보 한 번 + 미세먼지 한 번
  await service.get(35.1, 129.0);
  assert.equal(calls.length, 4);
});

test("달 모양: 2026년 11월 삭·상현·보름·하현", () => {
  const { moonAt } = schoolWeather;
  const at = (iso) => moonAt(new Date(iso), 37.65, 127.06);
  assert.ok(at("2026-11-09T12:00+09:00").fraction < 0.03);
  const quarter = at("2026-11-17T20:00+09:00");
  assert.ok(Math.abs(quarter.phase - 0.25) < 0.02 && Math.abs(quarter.fraction - 0.5) < 0.05);
  assert.ok(at("2026-11-24T21:00+09:00").fraction > 0.97);
  assert.ok(Math.abs(at("2026-12-01T06:00+09:00").phase - 0.75) < 0.02);
});

test("달이 진 새벽은 떠 있지 않다고 알린다(11월 20일 달은 21일 새벽 3시 무렵 진다)", () => {
  const { moonAt } = schoolWeather;
  const at = (iso) => moonAt(new Date(iso), 37.65, 127.06);
  assert.equal(at("2026-11-20T21:30+09:00").up, true);
  assert.equal(at("2026-11-21T02:30+09:00").up, true);
  assert.equal(at("2026-11-21T04:30+09:00").up, false);
  assert.equal(at("2026-11-21T10:30+09:00").up, false);
});

test("예보 시간마다 달 정보를 붙이되 캐시한 예보는 고치지 않는다", async () => {
  const kma = { configured: true, getWeather: async () => structuredClone(kmaResult) };
  const service = createSchoolWeather({ kma, fetchImpl: fakeFetch([]) });
  const result = await service.get(37.66, 127.06);
  assert.equal(typeof result.hourly[0].moon.up, "boolean");
  assert.ok(Number.isFinite(result.hourly[0].moon.phase));
  assert.equal(typeof result.current.moon.up, "boolean");
});

test("지금 날씨 칸의 낮·밤은 받아 둔 예보가 아니라 부른 시각으로 가른다", async () => {
  const kma = { configured: true, getWeather: async () => ({ ...structuredClone(kmaResult), current: { ...kmaResult.current, isDay: 1 } }) };
  let now = new Date("2026-11-21T01:30:00+09:00");
  const service = createSchoolWeather({ kma, fetchImpl: fakeFetch([]), clock: () => now });
  assert.equal((await service.get(37.66, 127.06)).current.isDay, 0);
  now = new Date("2026-11-21T12:00:00+09:00");
  assert.equal((await service.get(37.66, 127.06)).current.isDay, 1);
  now = new Date("2026-11-21T07:00:00+09:00"); // 해 뜨기 전
  assert.equal((await service.get(37.66, 127.06)).current.isDay, 0);
  now = new Date("2026-11-21T07:40:00+09:00"); // 해 뜬 뒤
  assert.equal((await service.get(37.66, 127.06)).current.isDay, 1);
});
