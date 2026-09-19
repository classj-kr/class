// 행정구역 자료(data/regions.js)를 만든다.
//
//   node tools/build_regions.mjs
//
// - 북한 도 경계: geoBoundaries(CC BY 4.0) PRK ADM1 간략본을 받아 약 300m로 줄인다(%TEMP%/korea-dem 에 둔다).
// - 남한 시·군 이름표: data/sigungu-centers.csv(통계청 SGIS 기반, EUC-KR)에서 시·군만 고른다.
//   구로 나뉜 시(수원시 팔달구, 안산시상록구처럼 붙여 쓴 것도)는 시 하나로 모으고, 특별시·광역시의 구는 뺀다(시·도 이름이 대신한다).

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = path.join(os.tmpdir(), "korea-dem");
const NORTH_URL = "https://github.com/wmgeolab/geoBoundaries/raw/main/releaseData/gbOpen/PRK/ADM1/geoBoundaries-PRK-ADM1_simplified.geojson";
const NORTH_NAMES = {
  Jagang: "자강도", Kangwon: "강원도(북)", Nampo: "남포특별시", "North Hamgyong": "함경북도", "North Hwanghae": "황해북도",
  "North Pyongan": "평안북도", Pyongyang: "평양직할시", Ryanggang: "양강도", "South Hamgyong": "함경남도",
  "South Hwanghae": "황해남도", "South Pyongan": "평안남도",
};
// 2017년 뒤 없어진 인천 구 코드(중구·동구·서구 개편 전)는 뺀다.
const RETIRED_CODES = new Set(["28110", "28140", "28260"]);

async function northGeojson() {
  const file = path.join(CACHE, "prk-adm1.geojson");
  if (!fs.existsSync(file)) {
    fs.mkdirSync(CACHE, { recursive: true });
    const response = await fetch(NORTH_URL);
    if (!response.ok) throw new Error(`북한 경계: ${response.status}`);
    fs.writeFileSync(file, await response.text());
  }
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

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

function simplify(ring, tolerance = 0.003) {
  if (ring.length < 4) return ring;
  const keep = new Uint8Array(ring.length);
  keep[0] = keep[ring.length - 1] = 1;
  const stack = [[0, ring.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let farthest = -1;
    let distance = tolerance * tolerance;
    for (let i = a + 1; i < b; i += 1) {
      const d = segDistSq(ring[i][0], ring[i][1], ring[a], ring[b]);
      if (d > distance) { distance = d; farthest = i; }
    }
    if (farthest >= 0) { keep[farthest] = 1; stack.push([a, farthest], [farthest, b]); }
  }
  return ring.filter((_, i) => keep[i]);
}

const toLatLng = (ring) => ring.map(([lng, lat]) => [Math.round(lat * 1000) / 1000, Math.round(lng * 1000) / 1000]);

// 도형의 넓이 중심(가장 큰 고리 기준). 이름표 자리로 쓴다.
function centerOf(rings) {
  const ring = rings.reduce((best, item) => (item.length > best.length ? item : best), rings[0]);
  let area = 0; let lat = 0; let lng = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const cross = ring[j][1] * ring[i][0] - ring[i][1] * ring[j][0];
    area += cross;
    lng += (ring[j][1] + ring[i][1]) * cross;
    lat += (ring[j][0] + ring[i][0]) * cross;
  }
  return [Math.round((lat / (3 * area)) * 100) / 100, Math.round((lng / (3 * area)) * 100) / 100];
}

function sigunguLabels() {
  const text = new TextDecoder("euc-kr").decode(fs.readFileSync(path.join(ROOT, "data/sigungu-centers.csv")));
  const groups = new Map();
  for (const columns of text.trim().split(/\r?\n/).slice(1).map((line) => line.split(","))) {
    if (columns.length < 5 || RETIRED_CODES.has(columns[2])) continue;
    const code = columns[2];
    const name = columns[columns.length - 1].trim();
    const lat = Number(columns[1]);
    const lng = Number(columns[0]);
    if (!name || !Number.isFinite(lat) || !Number.isFinite(lng)) continue;
    // 특별시(11)·광역시(26~31)·세종(36)의 구·군은 시·도 이름표가 대신한다. 대구로 넘어간 군위군(47720)은 군이라 남긴다.
    if (/^(11|26|27|28|29|30|31|36)/.test(code) && !name.endsWith("군")) continue;
    const city = name.match(/^(.+?시)\s*.+구$/u);
    const label = city ? city[1] : name;
    if (!/(시|군)$/u.test(label)) continue;
    const group = groups.get(label) || { lat: 0, lng: 0, count: 0 };
    group.lat += lat; group.lng += lng; group.count += 1;
    groups.set(label, group);
  }
  return [...groups.entries()].map(([name, group]) => [name, Math.round((group.lat / group.count) * 1000) / 1000, Math.round((group.lng / group.count) * 1000) / 1000]);
}

const north = (await northGeojson()).features.map((feature) => {
  const polygons = feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates;
  const rings = polygons.map((polygon) => simplify(toLatLng(polygon[0]))).filter((ring) => ring.length >= 4);
  const name = NORTH_NAMES[feature.properties.shapeName];
  if (!name) throw new Error(`이름 없음: ${feature.properties.shapeName}`);
  return { name, center: centerOf(rings), rings };
});
const counties = sigunguLabels();
const out = path.join(ROOT, "data/regions.js");
fs.writeFileSync(out, [
  "// tools/build_regions.mjs 로 만든 파일. 직접 고치지 말 것.",
  "// north: 북한 도 경계(geoBoundaries, CC BY 4.0), counties: 남한 시·군 이름표 [이름, 위도, 경도](통계청 SGIS 기반).",
  "window.KOREA_REGIONS = {",
  "  north: [",
  north.map((item) => `    ${JSON.stringify(item)}`).join(",\n"),
  "  ],",
  `  counties: ${JSON.stringify(counties)}`,
  "};",
  "",
].join("\n"));
console.log(`북한 ${north.length}곳(${north.reduce((sum, item) => sum + item.rings.reduce((s, ring) => s + ring.length, 0), 0)}점), 시·군 ${counties.length}곳 → ${(fs.statSync(out).size / 1024).toFixed(0)}KB`);
console.log(north.map((item) => `${item.name} ${item.center}`).join(" · "));
