// 판 구조론 표시 자료를 만든다: 판·해령·해구·변환 단층·열점·조산대 이름표와 누르면 켜질 선, 지진·화산 분포.
//
//   node tools/build_tectonics.mjs
//
// 쓰는 자료(저장소 밖 references/geography/tectonics/, 받는 곳은 data/TECTONICS-SOURCES.md):
//   usgs-m6-1970-2025.csv   미국 지질조사국 지진 목록(규모 6 이상, 1970~2025년)
//   noaa-volcanolocs.json   미국 해양대기청 화산 위치 자료
// 판 경계선은 이미 있는 data/atlas-plates.json(USGS)을 쓴다.
//
// 만드는 파일:
//   data/tectonics-labels.js   이름표와 선 모양. app.js보다 먼저 읽혀 GLOBE_DATA.labels에 이름표를 보탠다.
//   data/tectonics-points.json 지진·화산 점. 단추를 처음 켤 때 받는다.
//
// 수능(지구과학Ⅰ·통합과학·세계지리)에서 이름으로 묻는 것만 싣는다. 표에 없는 것은 싣지 않는다.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.resolve(ROOT, "../../../references/geography/tectonics");
const boundaries = JSON.parse(fs.readFileSync(path.join(ROOT, "data/atlas-plates.json"), "utf8")).features;

// 진원 깊이 구분(지구과학Ⅰ): 천발 70km 미만, 중발 70~300km, 심발 300km 이상
const DEPTH_CLASS = (km) => (km < 70 ? 0 : km < 300 ? 1 : 2);

// 판 이름표: [이름, 경도, 위도, tier]
const PLATES = [
  ["유라시아판", 85, 52, 1],
  ["북아메리카판", -98, 52, 1],
  ["남아메리카판", -52, -12, 1],
  ["아프리카판", 18, 4, 1],
  ["태평양판", -150, -5, 1],
  ["인도·오스트레일리아판", 98, -24, 1],
  ["남극판", 70, -76, 1],
  ["필리핀판", 133, 18, 2],
  ["나스카판", -95, -18, 2],
  ["아라비아판", 46.5, 24, 2],
  ["코코스판", -96, 9, 3],
  ["카리브판", -74, 15, 3],
  ["후안데푸카판", -128.6, 46.2, 3],
];

// 열점: [이름, 경도, 위도, tier]
const HOTSPOTS = [
  ["하와이 열점", -155.3, 19.4, 2],
  ["옐로스톤 열점", -110.5, 44.5, 3],
  ["아이슬란드 열점", -17.5, 64.6, 3],
];

// 선으로 된 것: 판 경계 자료에서 골라 잇는다.
//   pick: [경계 종류의 앞 네 글자들, 판 이름 짝들, 범위(서, 남, 동, 북; 없으면 전부)]을 여럿
//   at: 이름표를 둘 자리에 가까운 [경도, 위도] — 선 위의 가장 가까운 점에 놓는다
const all = null;
const LINES = [
  ["ridge", "대서양 중앙 해령", 1, [-36, 30], [
    [["Dive", "Tran"], ["Eurasian:North American"], [-45, 39, 5, 80]],
    [["Dive", "Tran"], ["North American:African", "African:South American"], all],
  ]],
  ["ridge", "동태평양 해령", 2, [-112, -18], [
    [["Dive", "Tran"], ["Pacific:Nazca", "Pacific:Cocos", "Nazca"], all],
    [["Dive", "Tran"], ["Pacific:Antarctic"], [-170, -70, -100, -30]],
  ]],
  ["ridge", "인도양 해령", 2, [68, -12], [
    [["Dive", "Tran"], ["African:Indian", "African:Australian", "African:Antarctic"], all],
    [["Dive", "Tran"], ["Australian:Antarctic"], [65, -70, 120, -20]],
  ]],
  ["trench", "마리아나 해구", 2, [147.5, 14], [[["Conv"], ["Pacific:Philippine"], [138, 9, 149, 24.5]]]],
  ["trench", "일본 해구", 2, [144.2, 38.5], [[["Conv"], ["North American:Pacific"], [139, 34, 146.5, 41.6]]]],
  ["trench", "알류샨 해구", 3, [-170, 51], [
    [["Conv"], ["North American:Pacific"], [163, 48, 180, 58]],
    [["Conv"], ["North American:Pacific"], [-180, 48, -144, 60]],
  ]],
  ["trench", "필리핀 해구", 3, [127.3, 9.5], [[["Conv"], ["Eurasian:Philippine"], [124.5, 1.5, 130, 15.5]]]],
  ["trench", "통가 해구", 3, [-173, -21], [[["Conv"], ["Pacific:Australian"], [-180, -26.5, -169, -14]]]],
  ["trench", "페루·칠레 해구", 2, [-72.5, -25], [[["Conv"], ["South American:Nazca"], [-83, -41, -69, -4]]]],
  ["trench", "순다 해구", 3, [105, -9.3], [[["Conv"], ["Australian:Sunda"], [91, -12, 121, 6.5]]]],
  ["fault", "산안드레아스 단층", 3, [-120.6, 36], [[["Tran"], ["North American:Pacific"], [-125.5, 31.5, -114.5, 40.6]]]],
  ["orogen", "환태평양 조산대", 1, [-150, 57], [
    [["Conv", "Tran", "Othe"], ["South American:Nazca", "Antarctica:South American", "Cocos:Caribbean", "North American:Cocos",
      "North America:Juan de Fuca", "North American:Pacific", "Pacific:Philippine", "Eurasian:Philippine", "Philippine:Sunda",
      "Pacific:Australia", "Australia:Pacific", "Pacific:Australian", "North American:Philippine"], all],
  ]],
  ["orogen", "알프스·히말라야 조산대", 1, [58, 31], [
    [["Conv", "Tran", "Othe"], ["Africa:Eurasia", "Eurasia", "Eurasian:Arabian", "Eurasian:Indian", "Eurasia:Anatolia Block", "Australian:Sunda"], all],
    [["Conv"], ["Eurasian:African"], all],
  ]],
];

const round = (value) => Math.round(value * 100) / 100;

// 경도 180도를 넘는 선분에서 끊는다(안 끊으면 지구를 가로지르는 선이 생긴다).
function splitAtDateLine(line) {
  const parts = [[]];
  for (const point of line) {
    const part = parts.at(-1);
    if (part.length && Math.abs(point[0] - part.at(-1)[0]) > 180) parts.push([]);
    parts.at(-1).push([round(point[0]), round(point[1])]);
  }
  return parts.filter((part) => part.length > 1);
}

function linesOf(picks) {
  const lines = [];
  for (const [kinds, names, box] of picks) {
    for (const feature of boundaries) {
      const kind = (feature.properties.LABEL || "").slice(0, 4);
      if (!kinds.includes(kind) || !names.includes(feature.properties.NAME)) continue;
      const geometry = feature.geometry;
      for (const line of geometry.type === "MultiLineString" ? geometry.coordinates : [geometry.coordinates]) {
        const inside = !box || line.some(([lng, lat]) => lng >= box[0] && lng <= box[2] && lat >= box[1] && lat <= box[3]);
        if (!inside) continue;
        const kept = box ? line.filter(([lng, lat]) => lng >= box[0] - 0.5 && lng <= box[2] + 0.5 && lat >= box[1] - 0.5 && lat <= box[3] + 0.5) : line;
        lines.push(...splitAtDateLine(kept));
      }
    }
  }
  return lines;
}

function nearest(lines, [lng, lat]) {
  let best = null;
  for (const line of lines) {
    for (const point of line) {
      const distance = ((point[0] - lng) * Math.cos((lat * Math.PI) / 180)) ** 2 + (point[1] - lat) ** 2;
      if (!best || distance < best.distance) best = { point, distance };
    }
  }
  return best.point;
}

const label = (kind, name, tier, [lng, lat]) => ({
  type: "Feature",
  properties: { name, kind, tier, key: `${kind}:${name}` },
  geometry: { type: "Point", coordinates: [round(lng), round(lat)] },
});

const labels = [
  ...PLATES.map(([name, lng, lat, tier]) => label("plate", name, tier, [lng, lat])),
  ...HOTSPOTS.map(([name, lng, lat, tier]) => label("hotspot", name, tier, [lng, lat])),
];
const shapes = {};
for (const [kind, name, tier, at, picks] of LINES) {
  const lines = linesOf(picks);
  if (!lines.length) throw new Error(`${name}: 판 경계 자료에서 선을 찾지 못함`);
  shapes[`${kind}:${name}`] = { type: "MultiLineString", coordinates: lines };
  // 조산대는 넓은 띠라 이름표를 선 위가 아니라 적어 둔 자리에 둔다.
  labels.push(label(kind, name, tier, kind === "orogen" ? at : nearest(lines, at)));
}

// 지진: 얕은 것부터 그려 깊은 지진이 위에 보이게 한다.
const quakes = fs.readFileSync(path.join(SOURCE, "usgs-m6-1970-2025.csv"), "utf8").trim().split("\n").slice(1)
  .map((row) => row.split(",", 5))
  .filter(([, lat, lng, depth]) => lat !== "" && lng !== "" && depth !== "")
  .map(([, lat, lng, depth]) => [round(Number(lng)), round(Number(lat)), DEPTH_CLASS(Math.max(0, Number(depth)))])
  .sort((a, b) => a[2] - b[2]);
const volcanoes = JSON.parse(fs.readFileSync(path.join(SOURCE, "noaa-volcanolocs.json"), "utf8"))
  .filter((v) => Number.isFinite(v.latitude) && Number.isFinite(v.longitude))
  .map((v) => [round(v.longitude), round(v.latitude)]);

fs.writeFileSync(path.join(ROOT, "data/tectonics-labels.js"),
  "// tools/build_tectonics.mjs 로 만든 파일. 직접 고치지 말 것.\n"
  + `window.GLOBE_DATA.labels.features.push(...${JSON.stringify(labels)});\n`
  + `window.GLOBE_TECTONICS = ${JSON.stringify({ shapes })};\n`);
fs.writeFileSync(path.join(ROOT, "data/tectonics-points.json"), JSON.stringify({ quakes, volcanoes }));

const count = (c) => quakes.filter((q) => q[2] === c).length;
console.log(`이름표 ${labels.length}개, 선 ${Object.keys(shapes).length}개, 지진 ${quakes.length}건(천발 ${count(0)}·중발 ${count(1)}·심발 ${count(2)}), 화산 ${volcanoes.length}곳`);
for (const feature of labels.filter((f) => ["ridge", "trench", "fault"].includes(f.properties.kind))) {
  console.log(`  ${feature.properties.name} → ${feature.geometry.coordinates.join(", ")}`);
}
