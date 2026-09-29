import assert from "node:assert/strict";
import test from "node:test";
import weather from "./kma-weather.js";

const { createKmaWeather, latLonToGrid, nowcastBase, forecastBase, toWeatherCode } = weather;

// KST 시각을 Date로 만든다.
const kst = (value) => new Date(value + "+09:00");

test("위경도를 기상청 격자로 바꾼다", () => {
  assert.deepEqual(latLonToGrid(37.5665, 126.978), { nx: 60, ny: 127 }); // 서울시청
  assert.deepEqual(latLonToGrid(37.663, 127.0678), { nx: 61, ny: 129 }); // 계상초(노원구 상계동)
});

test("초단기실황은 40분 전이면 한 시간 전 정시 자료를 쓴다", () => {
  assert.deepEqual(nowcastBase(kst("2026-09-29T10:39:00")), { baseDate: "20260929", baseTime: "0900" });
  assert.deepEqual(nowcastBase(kst("2026-09-29T10:40:00")), { baseDate: "20260929", baseTime: "1000" });
  assert.deepEqual(nowcastBase(kst("2026-09-29T00:10:00")), { baseDate: "20260928", baseTime: "2300" });
});

test("단기예보는 가장 최근에 제공된 발표 시각을 고른다", () => {
  assert.deepEqual(forecastBase(kst("2026-09-29T10:42:00")), { baseDate: "20260929", baseTime: "0800" });
  assert.deepEqual(forecastBase(kst("2026-09-29T11:09:00")), { baseDate: "20260929", baseTime: "0800" });
  assert.deepEqual(forecastBase(kst("2026-09-29T11:10:00")), { baseDate: "20260929", baseTime: "1100" });
  assert.deepEqual(forecastBase(kst("2026-09-29T02:05:00")), { baseDate: "20260928", baseTime: "2300" });
});

test("강수형태가 하늘상태보다 우선한다", () => {
  assert.deepEqual(toWeatherCode(0, 1), { code: 0, label: "맑음" });
  assert.deepEqual(toWeatherCode(0, 3), { code: 2, label: "구름많음" });
  assert.equal(toWeatherCode(1, 1).code, 61);
  assert.equal(toWeatherCode(3, 4).code, 71);
});

function kmaResponse(items) {
  return { text: async () => JSON.stringify({ response: { header: { resultCode: "00", resultMsg: "NORMAL_SERVICE" }, body: { items: { item: items } } } }) };
}

function forecastItems(baseTime, hours, temperature) {
  return hours.flatMap((hour) => {
    const fcstTime = String(hour).padStart(2, "0") + "00";
    return [
      { category: "TMP", fcstDate: "20260929", fcstTime, fcstValue: String(temperature(hour)), baseTime },
      { category: "REH", fcstDate: "20260929", fcstTime, fcstValue: "60", baseTime },
      { category: "POP", fcstDate: "20260929", fcstTime, fcstValue: "10", baseTime },
      { category: "SKY", fcstDate: "20260929", fcstTime, fcstValue: "1", baseTime },
      { category: "PTY", fcstDate: "20260929", fcstTime, fcstValue: "0", baseTime }
    ];
  });
}

test("실황과 예보를 합치고, 지난 시간대는 전날 밤 발표분으로 채운다", async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    const params = new URL(url).searchParams;
    calls.push(url.split("?")[0].split("/").pop() + " " + params.get("base_date") + params.get("base_time"));
    if (url.includes("getUltraSrtNcst")) {
      return kmaResponse([
        { category: "T1H", obsrValue: "21.6", baseDate: "20260929", baseTime: "1000" },
        { category: "REH", obsrValue: "56", baseDate: "20260929", baseTime: "1000" },
        { category: "PTY", obsrValue: "0", baseDate: "20260929", baseTime: "1000" }
      ]);
    }
    if (params.get("base_time") === "2300") return kmaResponse(forecastItems("2300", [...Array(24).keys()], () => 15));
    return kmaResponse(forecastItems("0800", [...Array(15).keys()].map((i) => i + 9), (hour) => hour + 10));
  };
  const service = createKmaWeather({ serviceKey: "test-key", fetchImpl, now: () => kst("2026-09-29T10:42:00") });
  const result = await service.getWeather(37.663, 127.0678);

  assert.equal(result.source, "kma");
  assert.deepEqual(result.current, { time: "2026-09-29T10:00", temperature: 21.6, humidity: 56, code: 0, label: "맑음", isDay: 1 });
  assert.equal(result.hourly.length, 24);
  assert.equal(result.hourly[0].temperature, 15); // 전날 23시 발표분
  assert.equal(result.hourly[14].temperature, 24); // 오늘 08시 발표분이 덮어씀
  assert.equal(result.hourly[0].isDay, 0);
  assert.equal(result.hourly[14].isDay, 1);

  await service.getWeather(37.663, 127.0678);
  assert.equal(calls.length, 3, "같은 격자는 캐시에서 다시 쓴다");
});

test("인증키가 없으면 503을 돌려 대시보드가 Open-Meteo로 넘어가게 한다", async () => {
  const service = createKmaWeather({ serviceKey: "" });
  let status, body;
  const res = { status(code) { status = code; return this; }, json(value) { body = value; return this; } };
  await service.handler({ query: { lat: "37.66", lon: "127.06" } }, res);
  assert.equal(status, 503);
  assert.equal(body.error, "KMA_NOT_CONFIGURED");
});

test("인증키 오류(XML 응답)는 502로 알린다", async () => {
  const fetchImpl = async () => ({ text: async () => "<OpenAPI_ServiceResponse><cmmMsgHeader><returnAuthMsg>SERVICE_KEY_IS_NOT_REGISTERED_ERROR</returnAuthMsg></cmmMsgHeader></OpenAPI_ServiceResponse>" });
  const service = createKmaWeather({ serviceKey: "bad", fetchImpl });
  let status;
  const res = { status(code) { status = code; return this; }, json() { return this; } };
  const originalError = console.error;
  console.error = () => {};
  try {
    await service.handler({ query: { lat: "37.66", lon: "127.06" } }, res);
  } finally {
    console.error = originalError;
  }
  assert.equal(status, 502);
});
