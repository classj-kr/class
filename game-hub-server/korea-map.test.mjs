import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

// 국내 지도: 지리·지형도(그리고 뒤이어 유물·유적·체험·관광)를 합친 사회과부도형 앱.
const root = new URL("../", import.meta.url);
const base = "learning/inquiry/korea-map/";
const read = (path) => fs.readFileSync(new URL(base + path, root), "utf8");
const exists = (path) => fs.existsSync(new URL(base + path, root));
const listTiles = (folder, z) => {
  const dir = new URL(`${base}${folder}/${z}/`, root);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).flatMap((x) => fs.readdirSync(new URL(`${x}/`, dir)).map((file) => `${x}/${file.replace(/\.webp$/, "")}`));
};

const html = read("index.html");
const styles = read("styles.css");
const app = read("app.js");
const sources = {
  terrain: read("data/terrain-data.js"),
  borders: read("data/borders.js"),
  tiles: read("data/relief-tiles.js"),
  geo: read("data/geo-data.js"),
  questions: read("data/questions.js"),
  principles: read("data/principles.js"),
};
const riverData = JSON.parse(read("data/major-rivers.geojson"));

// 화면: 주제 탭은 사회과부도 차례대로, 광고 같은 머리글(kicker) 없이.
const THEME_KEYS = ["territory", "terrain", "climate", "population", "industry", "transport", "region"];
const TAB_LABELS = ["국토", "지형", "기후", "인구·도시", "산업", "교통", "행정구역"];
const tabs = [...html.matchAll(/data-theme="([a-z]+)"[^>]*><span>[^<]*<\/span> ([^<]+)<\/button>/g)].map((match) => [match[1], match[2]]);
assert.deepEqual(tabs, THEME_KEYS.map((key, index) => [key, TAB_LABELS[index]]));
assert.match(html, /<title>국내 지도<\/title>/);
assert.match(html, /id="map"/);
assert.match(html, /id="profileButton"[^>]*hidden/);
assert.match(html, /id="profilePanel"[^>]*hidden/);
assert.match(html, /id="featureGuide"/);
assert.match(html, /id="principleGuide"/);
assert.match(html, /출제 기준·자료 출처/);
assert.match(html, /Copernicus DEM/);
assert.doesNotMatch(html, /conceptKicker|section-kicker/);
assert.doesNotMatch(styles, /\.section-kicker/);
assert.doesNotMatch(sources.geo, /kicker:/);
assert.doesNotMatch(html, /id="practiceTopic"|id="practiceDifficulty"|id="practiceCount"/);
// 로컬 js/css는 캐시를 넘도록 버전을 붙인다.
for (const match of html.matchAll(/(?:src|href)="((?:data\/|app|styles|climate-graph)[^"]*)"/g)) {
  assert.match(match[1], /\?v=\d{8}-\d+$/, `${match[1]}에 버전이 없습니다.`);
}

// 바탕: 우리 서버의 지형 조각만 쓴다. 바깥 지도 서버에 기대지 않는다.
assert.doesNotMatch(app + html, /cartocdn|basemaps\.|arcgisonline|tile\.openstreetmap|mapbox|googleapis|stamen/);
assert.doesNotMatch(app, /L\.imageOverlay/);
assert.match(app, /const RELIEF_URL = "relief\/\{z\}\/\{x\}\/\{y\}\.webp\?v=/);
assert.match(app, /minNativeZoom: 3, maxNativeZoom: 6/);
assert.match(app, /minZoom: 7, minNativeZoom: 7, maxNativeZoom: 9, bounds: DETAIL_BOUNDS/);
assert.match(app, /new SparseTileLayer\(RELIEF_URL, \{ minZoom: 10, minNativeZoom: 10, maxNativeZoom: 11/);
assert.match(app, /relief-muted/);
const counts = Object.fromEntries([3, 4, 5, 6, 7, 8, 9, 10, 11].map((z) => [z, listTiles("relief", z).length]));
for (const [z, count] of Object.entries(counts)) assert.ok(count > 0, `지형 바탕 ${z}단 조각이 없습니다.`);
assert.equal(counts[6], 256, "둘레(6단)는 동경 90~180·북위 0~66.5를 다 채워야 합니다.");

// 10~11단 칸 목록은 실제 파일과 같아야 한다(목록에 없는 칸은 부르지 않으므로).
const tileBox = { window: {} };
vm.runInNewContext(sources.tiles, tileBox);
for (const z of ["10", "11"]) {
  const listed = new Set();
  for (const [x, runs] of Object.entries(tileBox.window.RELIEF_TILES[z])) {
    for (const [from, to] of runs) for (let y = from; y <= to; y += 1) listed.add(`${x}/${y}`);
  }
  assert.deepEqual([...listed].sort(), listTiles("relief", z).sort(), `${z}단 칸 목록이 파일과 다릅니다.`);
}

// 단면도는 높이 조각(dem/ 6·8·9·10단)에서 높이를 읽는다. 10단은 지형 바탕 10단과 같은 칸이다.
assert.match(app, /const DEM_URL = "dem\/\{z\}\/\{x\}\/\{y\}\.webp\?v=/);
for (const z of [6, 8, 9, 10]) assert.ok(listTiles("dem", z).length > 0, `단면도 높이 조각 ${z}단이 없습니다.`);
assert.deepEqual(listTiles("dem", 10).sort(), listTiles("relief", 10).sort());
assert.match(app, /function drawProfile/);
assert.match(app, /tile\.data\[i\] \* 256 \+ tile\.data\[i \+ 1\] \+ tile\.data\[i \+ 2\] \/ 256 - 32768/);

// 사이트 뒤로 가기: 단면도·설명 풍선·초점 상자를 먼저 하나씩 닫는다.
assert.match(app, /addEventListener\("sitebackrequest"/);
assert.match(app, /if \(profile\.active\) \{ event\.preventDefault\(\); stopProfile\(\); return; \}/);

// 국경·휴전선
const borderBox = { window: {} };
vm.runInNewContext(sources.borders, borderBox);
const borders = borderBox.window.KOREA_BORDERS;
assert.ok(borders.mdl.length && borders.mdl[0].length > 20, "휴전선이 필요합니다.");
assert.ok(borders.national.length && borders.national[0].length > 200, "압록강·두만강 국경이 필요합니다.");

// 지도 표시 규칙(지리 앱에서 이어받음)
assert.match(app, /let mapDetailsVisible = false/);
assert.match(app, /map !== mainMap \|\| mapDetailsVisible/);
assert.match(app, /detailOnly: true/);
assert.match(app, /function declutter/);
assert.match(app, /major-rivers\.geojson/);
assert.match(app, /function riverWidthAt/);
assert.match(app, /43\.15, 131\.35/);
assert.match(app, /question\.topic === currentTheme/);
assert.match(app, /shuffle\(pool\)\.map\(shuffleQuestionOptions\)/);
assert.doesNotMatch(app, /shuffle\(pool\)\.slice\s*\(|questions\.slice\s*\(\s*0\s*,\s*\d+/);
assert.match(app, /answer: shuffled\.findIndex\(\(option\) => option\.correct\)/);
// 학생 기록이 이어지도록 지리 앱과 같은 저장 열쇠를 쓴다.
assert.match(app, /const PROGRESS_KEY = "joyclass-korea-geography-progress-v2"/);

assert.match(styles, /@media \(max-width: 1050px\)[\s\S]*?\.study-layout \{ display: flex; flex-direction: column; \}/);
assert.match(styles, /\.principle-button \{[^}]*min-height:\s*44px/s);

const sandbox = { window: {} };
for (const key of ["terrain", "geo", "questions", "principles"]) vm.runInNewContext(sources[key], sandbox);
const dataset = sandbox.window.KOREA_GEOGRAPHY;
assert.deepEqual(Object.keys(dataset.themes), THEME_KEYS);
assert.deepEqual(THEME_KEYS.map((key) => dataset.themes[key].label), TAB_LABELS);
assert.match(app, new RegExp(`const THEME_ORDER = ${JSON.stringify(THEME_KEYS).replace(/[[\]]/g, "\\$&").replace(/,/g, ", ")}`));

// 지형 탭: 지형도 이름표 전부(설명 달린 것은 누를 수 있다) + 작은 강 줄기 + 단면도
const terrain = dataset.themes.terrain;
assert.ok(terrain.profile && terrain.minorRivers && terrain.relief);
assert.ok(terrain.annotations.length >= 86, "지형 이름표가 빠졌습니다.");
const peak = terrain.annotations.find((item) => item.name === "백두산");
assert.equal(peak.kind, "peak");
assert.equal(peak.text, "백두산 2,744m");
for (const name of ["태백산맥", "개마고원", "호남평야", "철원 용암 대지", "경포호", "새만금 간척지", "시화호", "동해", "섬진강"]) {
  assert.ok(terrain.annotations.some((item) => item.name === name), `${name} 이름표가 없습니다.`);
}
assert.ok(terrain.annotations.filter((item) => item.note).length >= 53, "지형 설명이 빠졌습니다.");

assert.equal(riverData.features.length, 12, "한반도 주요 하천 중심선 자료가 완전해야 합니다.");

for (const [themeKey, theme] of Object.entries(dataset.themes)) {
  assert.ok(theme.title && theme.summary && Array.isArray(theme.points) && theme.points.length, `${themeKey} 개념 설명이 불완전합니다.`);
  assert.ok(Array.isArray(theme.features) && theme.features.length, `${themeKey} 필수 지점이 없습니다.`);
  assert.ok(Array.isArray(theme.principles) && theme.principles.length, `${themeKey} 핵심 원리가 없습니다.`);
  for (const principle of theme.principles) {
    assert.ok(principle.title && principle.explanation.length >= 40, `${themeKey} 원리 설명이 불완전합니다.`);
    assert.ok(Array.isArray(principle.steps) && principle.steps.length >= 2, `${principle.title}의 판단 과정이 부족합니다.`);
    assert.ok(principle.focus && Number.isFinite(principle.focus.lat) && Number.isFinite(principle.focus.lng), `${principle.title}에 지도 초점이 필요합니다.`);
  }
}

const ids = new Set();
const stimulusTypes = new Set();
for (const question of dataset.questions) {
  assert.ok(!ids.has(question.id), `중복 문항 ID: ${question.id}`);
  ids.add(question.id);
  assert.ok(THEME_KEYS.includes(question.topic), `${question.id}의 주제가 잘못되었습니다.`);
  assert.ok(["basic", "advanced"].includes(question.difficulty), `${question.id}의 난이도가 잘못되었습니다.`);
  assert.ok(question.prompt && question.hint, `${question.id}의 발문 또는 단서가 없습니다.`);
  assert.equal(question.options.length, 5, `${question.id}는 5지선다여야 합니다.`);
  assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length, `${question.id}의 정답 번호가 잘못되었습니다.`);
  assert.ok(question.explanation.length >= 30, `${question.id}에 충분한 해설이 필요합니다.`);
  assert.ok(question.focus && Number.isFinite(question.focus.lat) && Number.isFinite(question.focus.lng), `${question.id}에 지도 초점이 필요합니다.`);
  for (const station of question.graph ? [].concat(question.graph) : []) {
    assert.ok(dataset.stations[station], `${question.id}가 없는 기후 관측 지점 ${station}을 참조합니다.`);
  }
  if (question.stimulus) {
    assert.ok(["table", "bars", "pyramid"].includes(question.stimulus.type), `${question.id}의 자료 유형을 지원하지 않습니다.`);
    stimulusTypes.add(question.stimulus.type);
  }
}
for (const topic of THEME_KEYS) {
  assert.ok(dataset.questions.some((question) => question.topic === topic), `${topic}의 문항이 없습니다.`);
}
for (const type of ["table", "bars", "pyramid"]) assert.ok(stimulusTypes.has(type), `${type} 자료 해석 문항이 필요합니다.`);

const essentialCoverage = {
  territory: [/영해/, /배타적 경제 수역/, /독도/, /표준 경선|표준시/, /대동여지도/, /지리 정보|GIS/],
  terrain: [/하천/, /산맥|산지/, /해안/, /카르스트|석회암/, /화산/, /평야|범람원/],
  climate: [/계절풍/, /강수/, /연교차|기온/, /푄/, /태풍/],
  population: [/저출산/, /고령화/, /인구 이동/, /도시화/, /주간 인구|야간 인구/],
  industry: [/농업/, /공업/, /에너지|발전/, /서비스업/, /입지/],
  transport: [/도로/, /철도/, /해운/, /항공|공항/, /항만/, /고속 철도/, /빨대 효과/],
  region: [/수도권/, /강원|관동|영동/, /충청|호서/, /호남/, /영남/, /제주/, /북한|관서|관북|해서/]
};
for (const [topic, patterns] of Object.entries(essentialCoverage)) {
  const corpus = JSON.stringify({ theme: dataset.themes[topic], questions: dataset.questions.filter((question) => question.topic === topic) });
  for (const pattern of patterns) assert.match(corpus, pattern, `${topic} 필수 개념 ${pattern}이 빠졌습니다.`);
}

assert.ok(exists("tools/build_relief.py") && exists("tools/build_borders.py") && exists("tools/build_dem.py"), "자료를 다시 만드는 도구가 필요합니다.");

console.log(`Korea map contract passed (${THEME_KEYS.length} themes, ${dataset.questions.length} questions, ${Object.values(counts).reduce((a, b) => a + b, 0)} relief tiles).`);
