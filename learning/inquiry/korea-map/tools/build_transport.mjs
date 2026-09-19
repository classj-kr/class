// 교통 탭의 실제 노선(data/transport-lines.js)을 만든다.
//
//   node tools/build_transport.mjs
//
// 오픈스트리트맵(© OpenStreetMap 기여자, ODbL)에서 남한의 고속 국도 노선과 간선·고속 철도를 받아
// 이름별로 잇고, 한반도 전체를 보는 배율에 맞게 줄인다(약 200m). 받은 원자료는 %TEMP%/korea-dem 에 둔다.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = path.join(os.tmpdir(), "korea-dem");
const OVERPASS = "https://overpass-api.de/api/interpreter";
const SOUTH_KOREA = 'area["ISO3166-1"="KR"][admin_level=2]->.kr;';
const QUERIES = {
  "osm-expressways": `${SOUTH_KOREA}relation["type"="route"]["route"="road"]["network"~"^KR:expressway"](area.kr)`,
  "osm-railways": `${SOUTH_KOREA}way["railway"="rail"]["usage"="main"](area.kr)`,
  "osm-highspeed": `${SOUTH_KOREA}way["railway"="rail"]["highspeed"="yes"](area.kr)`,
};

async function overpass(name, query) {
  const file = path.join(CACHE, `${name}.json`);
  if (!fs.existsSync(file)) {
    fs.mkdirSync(CACHE, { recursive: true });
    const body = new URLSearchParams({ data: `[out:json][timeout:600];${query};out geom;` });
    // 오버패스는 한 번에 받을 수 있는 양을 제한한다. 막히면 1분 기다렸다가 다시 묻는다.
    for (let attempt = 1; ; attempt += 1) {
      const response = await fetch(OVERPASS, { method: "POST", body, headers: { "User-Agent": "classj-build/1.0" } });
      const text = await response.text();
      if (response.ok) { fs.writeFileSync(file, text); break; }
      if (attempt >= 6 || !/rate_limited|Too Many|timeout/i.test(text + response.status)) throw new Error(`${name}: ${response.status} ${text.slice(0, 300)}`);
      console.log(`${name}: 막혀서 1분 기다림(${attempt})`);
      await new Promise((resolve) => setTimeout(resolve, 60000));
    }
  }
  return JSON.parse(fs.readFileSync(file, "utf8")).elements;
}

// ───────────── 선 합치기 ─────────────
// 상행·하행 차로, 복선 철도처럼 나란히 붙은 선은 하나만 남긴다.
// 긴 선부터 받아들이고, 이미 받아들인 선의 칸(약 300m) 둘레를 지나는 부분은 버린다.
// 버린 곳과 이어지는 끝에는 한 점씩 더 붙여 갈림길에서 선이 끊기지 않게 한다.
const CELL = 0.003;
const cellIndex = ([lat, lng]) => [Math.round(lat / CELL), Math.round(lng / CELL)];

function densify(line, step = CELL / 2) {
  const out = [line[0]];
  for (let i = 1; i < line.length; i += 1) {
    const [a, b] = [line[i - 1], line[i]];
    const parts = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
    for (let k = 1; k <= parts; k += 1) out.push([a[0] + ((b[0] - a[0]) * k) / parts, a[1] + ((b[1] - a[1]) * k) / parts]);
  }
  return out;
}

function mergeLines(lines) {
  const covered = new Set();
  const near = (point) => {
    const [i, j] = cellIndex(point);
    for (let di = -1; di <= 1; di += 1) for (let dj = -1; dj <= 1; dj += 1) if (covered.has(`${i + di},${j + dj}`)) return true;
    return false;
  };
  const runs = [];
  for (const line of lines.filter((item) => item.length >= 2).map((item) => densify(item)).sort((a, b) => b.length - a.length)) {
    let run = [];
    const flush = () => { if (run.length >= 2) runs.push(run); run = []; };
    line.forEach((point, index) => {
      if (near(point)) {
        if (run.length) { run.push(point); flush(); }
        return;
      }
      if (!run.length && index > 0) run.push(line[index - 1]);
      run.push(point);
    });
    flush();
    for (const point of line) covered.add(cellIndex(point).join(","));
  }
  return runs.map((run) => simplify(run)).filter((line) => line.length >= 2 && lengthOf(line) >= 0.5);
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

// 더글러스-포이커. 0.002도는 약 200m로 10단 화면의 한두 칸이다.
function simplify(line, tolerance = 0.002) {
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

function lengthOf(line) {
  let total = 0;
  for (let i = 1; i < line.length; i += 1) total += Math.hypot(line[i][0] - line[i - 1][0], (line[i][1] - line[i - 1][1]) * 0.8);
  return total * 111;
}

const round = (line) => line.map(([lat, lng]) => [Math.round(lat * 10000) / 10000, Math.round(lng * 10000) / 10000]);
const wayLine = (geometry) => (geometry || []).map((point) => [point.lat, point.lon]);

// ───────────── 고속 국도 ─────────────
// 시험에 나오는 간선 고속 국도: 두껍게 그리고 이름표를 단다.
// 번호로 고르면 통영~대전(35)처럼 번호를 나눠 쓰는 노선이 섞이므로 이름으로 고른다.
const MAJOR_EXPRESSWAYS = new Set(["경부", "남해", "서해안", "호남", "중부", "영동", "중앙", "동해"].map((name) => `${name} 고속 국도`));

function expresswayName(name) {
  const base = String(name).replace(/^고속국도\s*/, "");
  const branch = base.endsWith("의 지선");
  const core = base.replace(/의 지선$/, "").replace(/선$/, "");
  return `${core} 고속 국도${branch ? " 지선" : ""}`;
}

// ───────────── 철도 ─────────────
// 고속 철도는 전용 고속선 셋만, 일반 철도는 도시끼리 잇는 간선만 그린다(수도권 전철 노선은 뺀다).
const HIGHSPEED = ["경부고속선", "호남고속선", "수서평택고속선"];
const MAIN_LINES = ["경부선", "호남선", "전라선", "경전선", "중앙선", "동해선", "장항선", "경강선", "경원선", "영동선", "서해선",
  "경춘선", "충북선", "태백선", "중부내륙선", "경의선", "경북선", "목포보성선", "삼척선"];
const RAIL_ALIASES = { "경부본선": "경부선", "호남본선": "호남선", "동해본선": "동해선", "태백본선": "태백선", "경의본선": "경의선", "경원본선": "경원선" };

async function build() {
  const expressways = new Map();
  for (const relation of await overpass("osm-expressways", QUERIES["osm-expressways"])) {
    const ref = String(relation.tags.ref || "");
    const name = expresswayName(relation.tags.name || "");
    const key = `${name}|${ref}`;
    if (!expressways.has(key)) expressways.set(key, { name, ref, major: MAJOR_EXPRESSWAYS.has(name), ways: [] });
    for (const member of relation.members || []) if (member.type === "way" && member.geometry) expressways.get(key).ways.push(wayLine(member.geometry));
  }

  const railways = new Map();
  const addRail = (way, kind) => {
    const raw = (way.tags && way.tags.name) || "";
    const name = RAIL_ALIASES[raw] || raw;
    if (!(kind === "highspeed" ? HIGHSPEED : MAIN_LINES).includes(name)) return;
    if (!railways.has(name)) railways.set(name, { name, kind, ways: [] });
    railways.get(name).ways.push(wayLine(way.geometry));
  };
  for (const way of await overpass("osm-highspeed", QUERIES["osm-highspeed"])) addRail(way, "highspeed");
  for (const way of await overpass("osm-railways", QUERIES["osm-railways"])) addRail(way, "main");

  const finish = (item) => {
    const lines = mergeLines(item.ways).map(round);
    const { ways, ...rest } = item;
    return { ...rest, lines };
  };
  const data = {
    expressways: [...expressways.values()].map(finish).filter((item) => item.lines.length)
      .sort((a, b) => Number(b.major) - Number(a.major) || Number(a.ref) - Number(b.ref)),
    railways: [...railways.values()].map(finish).filter((item) => item.lines.length)
      .sort((a, b) => (a.kind === b.kind ? a.name.localeCompare(b.name, "ko") : a.kind === "highspeed" ? -1 : 1)),
  };
  const out = path.join(ROOT, "data/transport-lines.js");
  const lines = [
    "// tools/build_transport.mjs 로 만든 파일. 직접 고치지 말 것.",
    "// 고속 국도·철도 노선: © OpenStreetMap 기여자 (ODbL). 좌표는 [위도, 경도], 약 200m로 줄였다.",
    "window.KOREA_TRANSPORT = {",
    "  expressways: [",
    data.expressways.map((item) => `    ${JSON.stringify(item)}`).join(",\n"),
    "  ],",
    "  railways: [",
    data.railways.map((item) => `    ${JSON.stringify(item)}`).join(",\n"),
    "  ]",
    "};",
    "",
  ];
  fs.writeFileSync(out, lines.join("\n"));
  const points = (items) => items.reduce((sum, item) => sum + item.lines.reduce((s, line) => s + line.length, 0), 0);
  console.log(`고속 국도 ${data.expressways.length}개(${points(data.expressways)}점), 철도 ${data.railways.length}개(${points(data.railways)}점) → ${out} ${(fs.statSync(out).size / 1024).toFixed(0)}KB`);
  console.log(data.railways.map((item) => `${item.name}(${item.kind === "highspeed" ? "고속" : "일반"}) ${item.lines.length}줄`).join(" · "));
}

if (!process.argv.includes("--summary")) await build();

if (process.argv.includes("--summary")) {
  for (const [name, query] of Object.entries(QUERIES)) {
    const elements = await overpass(name, query);
    const size = fs.statSync(path.join(CACHE, `${name}.json`)).size;
    const names = new Map();
    for (const element of elements) {
      const tags = element.tags || {};
      const label = `${tags.name || "(이름 없음)"}${tags.ref ? ` [${tags.ref}]` : ""}`;
      names.set(label, (names.get(label) || 0) + 1);
    }
    console.log(`\n${name}: ${elements.length}개, ${(size / 1e6).toFixed(1)}MB`);
    console.log([...names.entries()].sort((a, b) => b[1] - a[1]).slice(0, 60).map(([label, count]) => `${label}×${count}`).join(" · "));
  }
}
