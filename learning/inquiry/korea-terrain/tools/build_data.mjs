// 지형도의 이름표·강 자료(data/terrain-data.js)를 만든다.
//
//   node tools/build_data.mjs
//
// 강 줄기는 오픈스트리트맵(© OpenStreetMap 기여자, ODbL)에서 받아 이름별로 잇고 단순하게 줄인다.
// 이름표 자리는 오픈스트리트맵 지명 검색(Nominatim)으로 맞춰 본 좌표이고, 산맥은 높이 자료의 능선 위에 직접 찍었다.
//
// tier: 이름표가 나타나는 배율 단계. 1은 한반도 전체가 보일 때부터, 4는 가장 크게 확대했을 때.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = path.join(os.tmpdir(), "korea-dem");
const OVERPASS = "https://overpass-api.de/api/interpreter";

// [이름, 갈래, tier, 위도, 경도, 설명]
const FEATURES = [
  // 산맥: 1차 산맥은 경동성 요곡 운동으로 솟아 높고 이어져 있고, 2차 산맥은 낮고 끊기며 대체로 북동-남서로 뻗는다.
  ["함경산맥", "range", 1, 41.5, 129.15, "1차 산맥. 관북 지방 동쪽을 북동-남서로 뻗는다. 가장 높은 봉우리는 관모봉(2,540m)이다."],
  ["마천령산맥", "range", 2, 41.55, 128.45, "1차 산맥. 백두산에서 남동쪽으로 뻗어 동해안에 이른다."],
  ["낭림산맥", "range", 1, 40.3, 126.95, "1차 산맥. 한반도 북부를 남북으로 뻗어 관북 지방과 관서 지방을 가른다."],
  ["태백산맥", "range", 1, 37.75, 128.65, "1차 산맥. 동해안을 따라 뻗은 한반도의 등줄기다. 동쪽 사면은 급하고 서쪽 사면은 완만한 경동 지형을 이룬다."],
  ["강남산맥", "range", 2, 40.95, 125.95, "2차 산맥. 압록강 남쪽을 따라 북동-남서로 뻗는다."],
  ["적유령산맥", "range", 3, 40.45, 125.85, "2차 산맥. 강남산맥과 묘향산맥 사이를 북동-남서로 뻗는다."],
  ["묘향산맥", "range", 2, 39.95, 126.35, "2차 산맥. 낭림산맥에서 갈라져 남서쪽으로 뻗는다."],
  ["언진산맥", "range", 3, 38.95, 126.45, "2차 산맥. 대동강 남쪽을 북동-남서로 뻗는다."],
  ["멸악산맥", "range", 3, 38.3, 126.05, "2차 산맥. 황해도를 북동-남서로 가로지른다."],
  ["마식령산맥", "range", 3, 38.8, 126.95, "2차 산맥. 태백산맥 북쪽에서 갈라져 남서쪽으로 뻗는다."],
  ["광주산맥", "range", 2, 37.95, 127.4, "2차 산맥. 경기도 북동부를 북동-남서로 뻗는다."],
  ["차령산맥", "range", 2, 36.85, 127.3, "2차 산맥. 중부 지방을 북동-남서로 가로지른다."],
  ["소백산맥", "range", 1, 36.3, 127.95, "2차 산맥. 태백산맥에서 남서쪽으로 갈라져 영남 지방과 호남·충청 지방을 가른다."],
  ["노령산맥", "range", 2, 35.55, 126.95, "2차 산맥. 호남 지방을 북동-남서로 가로지른다."],

  // 고원·고위 평탄면
  ["개마고원", "plateau", 1, 40.85, 127.7, "한반도의 지붕이라 불리는 넓은 고원. 해발 고도가 높아 겨울이 매우 춥다."],
  ["대관령 고위 평탄면", "plateau", 2, 37.66, 128.7, "오래전 평탄하던 땅이 융기해 높은 곳에 남은 평탄면. 여름이 서늘해 고랭지 농업과 목축을 한다."],
  ["진안고원", "plateau", 3, 35.79, 127.42, "호남 지방의 지붕이라 불리는 고원."],

  // 분지
  ["춘천 분지", "basin", 2, 37.87, 127.73, "침식 분지. 가운데의 화강암이 둘레의 변성암보다 빨리 깎여 낮아졌다."],
  ["양구 해안 분지(펀치볼)", "basin", 3, 38.284, 128.135, "침식 분지. 둘레가 높은 산지로 둘러싸여 그릇 모양이라 펀치볼이라 부른다."],
  ["원주 분지", "basin", 3, 37.34, 127.93, "침식 분지."],
  ["대구 분지", "basin", 2, 35.87, 128.6, "산지로 둘러싸인 침식 분지. 여름에 매우 덥다."],
  ["거창 분지", "basin", 3, 35.69, 127.91, "침식 분지."],

  // 평야
  ["호남평야", "plain", 1, 35.83, 126.88, "김제·만경 일대의 넓은 평야. 우리나라에서 가장 큰 곡창 지대다."],
  ["김포평야", "plain", 2, 37.64, 126.66, "한강 하류의 충적 평야."],
  ["나주평야", "plain", 2, 35.02, 126.72, "영산강 유역의 충적 평야."],
  ["논산평야", "plain", 3, 36.17, 127.08, "금강 유역의 충적 평야."],
  ["김해평야", "plain", 2, 35.19, 128.88, "낙동강 하구의 충적 평야."],
  ["평양평야", "plain", 2, 39.0, 125.85, "대동강 유역의 충적 평야."],
  ["재령평야", "plain", 3, 38.45, 125.65, "재령강 유역의 충적 평야. 북한의 곡창 지대다."],
  ["안주평야", "plain", 3, 39.62, 125.65, "청천강 하류의 충적 평야."],

  // 하천 지형
  ["동강 감입 곡류", "riverform", 3, 37.24, 128.57, "땅이 솟는 동안 하천이 골짜기를 깊이 파며 굽이쳐 흐르는 감입 곡류. 강가에 하안 단구가 있다."],
  ["영월 한반도 지형", "riverform", 4, 37.212, 128.352, "서강(평창강)의 감입 곡류가 한반도 모양의 땅을 만들었다."],
  ["우포늪", "riverform", 3, 35.553, 128.415, "낙동강 가 범람원의 배후 습지."],
  ["낙동강 삼각주", "riverform", 3, 35.1, 128.94, "강이 실어 온 흙이 하구에 쌓여 생긴 삼각주(을숙도 일대)."],

  // 해안 지형
  ["경포호", "coast", 3, 37.797, 128.903, "석호. 모래 둑(사주)이 만의 입구를 막아 생긴 호수다."],
  ["화진포", "coast", 3, 38.469, 128.437, "석호. 모래 둑(사주)이 만의 입구를 막아 생긴 호수다."],
  ["정동진 해안 단구", "coast", 3, 37.692, 129.033, "파도에 깎인 평평한 땅이 융기해 바닷가의 계단 모양 언덕이 되었다."],
  ["신두리 해안 사구", "coast", 3, 36.843, 126.195, "모래사장의 모래가 바람에 날려 쌓인 해안 사구."],
  ["해운대 사빈", "coast", 3, 35.159, 129.159, "파도와 연안류가 실어 온 모래가 쌓인 모래사장(사빈)."],
  ["순천만 갯벌", "coast", 3, 34.87, 127.51, "밀물과 썰물의 차가 큰 곳에 진흙이 쌓인 갯벌."],
  ["가로림만 갯벌", "coast", 3, 36.88, 126.34, "서해안의 만에 넓게 펼쳐진 갯벌."],
  ["리아스 해안", "coast", 2, 34.72, 128.05, "골짜기가 바다에 잠겨 해안선이 복잡하고 섬이 많은 해안. 남해안과 서해안에 발달했다."],

  // 화산 지형
  ["천지", "volcano", 2, 42.005, 128.075, "화산 꼭대기가 무너져 생긴 칼데라에 물이 고인 칼데라호."],
  ["백록담", "volcano", 3, 33.362, 126.533, "한라산 꼭대기 화구에 물이 고인 화구호."],
  ["성산 일출봉", "volcano", 3, 33.459, 126.941, "얕은 바다에서 분출한 화산이 만든 응회구."],
  ["나리 분지", "volcano", 3, 37.52, 130.871, "울릉도 화산 꼭대기가 무너져 생긴 칼데라 분지."],
  ["독도", "volcano", 1, 37.242, 131.865, "화산섬. 동도와 서도, 둘레의 바위섬들로 이루어졌다."],
  ["울릉도", "volcano", 2, 37.49, 130.86, "화산섬. 섬 전체가 바다 위로 솟은 화산이다."],
  ["철원 용암 대지", "volcano", 2, 38.22, 127.22, "현무암 용암이 골짜기를 메워 생긴 평탄한 대지. 한탄강이 이를 깎아 주상 절리 협곡을 만들었다."],

  // 카르스트 지형
  ["단양 석회 동굴", "karst", 3, 36.99, 128.37, "석회암이 빗물에 녹아 생긴 카르스트 지형. 고수동굴과 돌리네가 있다."],
  ["삼척 환선굴", "karst", 3, 37.324, 129.008, "석회암 지대에 생긴 석회 동굴."],

  // 높은 산: [이름, "peak", tier, 위도, 경도, 높이]
  ["백두산", "peak", 1, 42.006, 128.057, 2744],
  ["관모봉", "peak", 2, 41.705, 129.241, 2540],
  ["한라산", "peak", 1, 33.362, 126.529, 1947],
  ["지리산", "peak", 2, 35.337, 127.731, 1915],
  ["설악산", "peak", 2, 38.119, 128.466, 1708],
  ["금강산", "peak", 3, 38.657, 128.105, 1638],
  ["덕유산", "peak", 3, 35.86, 127.747, 1614],
  ["태백산", "peak", 3, 37.099, 128.916, 1567],
  ["오대산", "peak", 3, 37.795, 128.543, 1563],
  ["소백산", "peak", 3, 36.958, 128.485, 1439],

  // 바다
  ["동해", "sea", 1, 37.8, 130.2, ""],
  ["황해", "sea", 1, 36.8, 124.9, ""],
  ["남해", "sea", 1, 34.1, 127.6, ""],
];

// 강: 오픈스트리트맵 이름(여러 표기) → [우리말 이름, tier]
const RIVERS = [
  [/^한강$/, "한강", 1], [/^낙동강$/, "낙동강", 1], [/^금강$/, "금강", 1], [/^영산강$/, "영산강", 1], [/^섬진강$/, "섬진강", 1],
  [/^대동강$/, "대동강", 1], [/^청천강$/, "청천강", 2], [/압록강|鸭绿江/, "압록강", 1], [/두만강|图们江/, "두만강", 1],
  [/^임진강$/, "임진강", 2], [/^북한강$/, "북한강", 2], [/^남한강$/, "남한강", 2], [/^한탄강$/, "한탄강", 3],
  [/^재령강$/, "재령강", 3], [/^만경강$/, "만경강", 3], [/^동진강$/, "동진강", 3], [/^형산강$/, "형산강", 3],
  [/^소양강$/, "소양강", 3], [/^동강$/, "동강", 3], [/^평창강$/, "평창강", 4],
];
const RIVER_QUERIES = {
  "osm-rivers": 'way["waterway"="river"]["name"~"^(한강|낙동강|금강|영산강|섬진강|임진강|북한강|남한강|대동강|청천강|한탄강|동강|만경강|동진강|형산강|재령강|소양강|평창강)$"](33,124,43.2,131.5)',
  "osm-border-rivers": 'way["waterway"="river"]["name"~"압록|鸭绿|두만|图们"](39.5,124,43.2,131)',
};

async function overpass(name, query) {
  const file = path.join(CACHE, `${name}.json`);
  if (!fs.existsSync(file)) {
    fs.mkdirSync(CACHE, { recursive: true });
    const body = new URLSearchParams({ data: `[out:json][timeout:270];${query};out geom;` });
    const response = await fetch(OVERPASS, { method: "POST", body, headers: { "User-Agent": "joyclass-build/1.0" } });
    if (!response.ok) throw new Error(`${name}: ${response.status}`);
    fs.writeFileSync(file, await response.text());
  }
  return JSON.parse(fs.readFileSync(file, "utf8")).elements;
}

const round = (value) => Math.round(value * 10000) / 10000;

function segDistSq(px, py, a, b) {
  let x = a[0]; let y = a[1];
  let dx = b[0] - x; let dy = b[1] - y;
  if (dx !== 0 || dy !== 0) {
    const t = ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) { x = b[0]; y = b[1]; } else if (t > 0) { x += dx * t; y += dy * t; }
  }
  dx = px - x; dy = py - y;
  return dx * dx + dy * dy;
}

// 더글러스-포이커. 0.0006도는 약 60m로 가장 크게 키운 화면의 한 칸 남짓이다.
function simplify(line, tolerance = 0.0006) {
  if (line.length < 3) return line;
  const keep = new Uint8Array(line.length);
  keep[0] = keep[line.length - 1] = 1;
  const stack = [[0, line.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let farthest = -1;
    let distance = tolerance * tolerance;
    for (let i = a + 1; i < b; i += 1) {
      const d = segDistSq(line[i][0], line[i][1], line[a], line[b]);
      if (d > distance) { distance = d; farthest = i; }
    }
    if (farthest >= 0) { keep[farthest] = 1; stack.push([a, farthest], [farthest, b]); }
  }
  return line.filter((_, i) => keep[i]);
}

function joinLines(lines) {
  const key = ([x, y]) => `${x},${y}`;
  const pool = lines.map((line) => line.slice());
  let merged = true;
  while (merged) {
    merged = false;
    for (let i = 0; i < pool.length && !merged; i += 1) {
      for (let j = 0; j < pool.length && !merged; j += 1) {
        if (i === j) continue;
        const a = pool[i];
        const b = pool[j];
        if (key(a[a.length - 1]) === key(b[0])) pool[i] = a.concat(b.slice(1));
        else if (key(a[0]) === key(b[b.length - 1])) pool[i] = b.concat(a.slice(1));
        else if (key(a[a.length - 1]) === key(b[b.length - 1])) pool[i] = a.concat(b.slice(0, -1).reverse());
        else if (key(a[0]) === key(b[0])) pool[i] = b.slice().reverse().concat(a.slice(1));
        else continue;
        pool.splice(j, 1);
        merged = true;
      }
    }
  }
  return pool;
}

const pathLength = (line) => line.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0] - line[i][0], p[1] - line[i][1]), 0);

function pointAlong(line, distance) {
  let left = distance;
  for (let i = 1; i < line.length; i += 1) {
    const step = Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]);
    if (step >= left) {
      const t = step ? left / step : 0;
      return [line[i - 1][0] + (line[i][0] - line[i - 1][0]) * t, line[i - 1][1] + (line[i][1] - line[i - 1][1]) * t];
    }
    left -= step;
  }
  return line[line.length - 1];
}

async function main() {
  const elements = [];
  for (const [name, query] of Object.entries(RIVER_QUERIES)) elements.push(...(await overpass(name, query)));
  const byName = new Map();
  for (const element of elements) {
    const osmName = element.tags?.name || "";
    const entry = RIVERS.find(([pattern]) => pattern.test(osmName));
    if (!entry || !element.geometry) continue;
    // 북한 황해도에도 "서강" 같은 같은 이름 강이 있어, 이름 표에 있는 것만 받는다.
    const [, name, tier] = entry;
    if (!byName.has(name)) byName.set(name, { tier, lines: [] });
    byName.get(name).lines.push(element.geometry.map(({ lon, lat }) => [round(lon), round(lat)]));
  }
  const missing = RIVERS.map(([, name]) => name).filter((name) => !byName.has(name));
  if (missing.length) throw new Error(`자료에 없는 강: ${missing.join(", ")}`);

  const rivers = [];
  const labels = [];
  for (const [name, { tier, lines }] of byName) {
    const joined = joinLines(lines).map((line) => simplify(line)).filter((line) => line.length > 1);
    rivers.push({ type: "Feature", properties: { name, tier }, geometry: { type: "MultiLineString", coordinates: joined } });
    const longest = joined.reduce((a, b) => (pathLength(b) > pathLength(a) ? b : a));
    const [lng, lat] = pointAlong(longest, pathLength(longest) / 2);
    labels.push({ type: "Feature", properties: { name, kind: "river", tier }, geometry: { type: "Point", coordinates: [round(lng), round(lat)] } });
  }
  for (const [name, kind, tier, lat, lng, note] of FEATURES) {
    const properties = { name, kind, tier };
    if (kind === "peak") properties.height = note;
    else if (note) properties.note = note;
    labels.push({ type: "Feature", properties, geometry: { type: "Point", coordinates: [lng, lat] } });
  }

  const data = {
    labels: { type: "FeatureCollection", features: labels },
    rivers: { type: "FeatureCollection", features: rivers },
  };
  const out = path.join(ROOT, "data/terrain-data.js");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, `// tools/build_data.mjs 로 만든 파일. 직접 고치지 말 것.\n// 강 줄기: © OpenStreetMap 기여자 (ODbL)\nwindow.TERRAIN_DATA = ${JSON.stringify(data)};\n`);
  const count = (kind) => labels.filter((f) => f.properties.kind === kind).length;
  console.log(`이름표 ${labels.length}개 (산맥 ${count("range")}, 고원 ${count("plateau")}, 분지 ${count("basin")}, 평야 ${count("plain")}, 하천 지형 ${count("riverform")}, 해안 ${count("coast")}, 화산 ${count("volcano")}, 카르스트 ${count("karst")}, 산 ${count("peak")}, 강 ${count("river")}, 바다 ${count("sea")})`);
  console.log(`강 ${rivers.length}개, ${(fs.statSync(out).size / 1024).toFixed(0)}KB`);
}

await main();
