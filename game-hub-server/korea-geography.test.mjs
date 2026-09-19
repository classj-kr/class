import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const read = (path) => fs.readFileSync(new URL(path, root), "utf8");

const html = read("learning/inquiry/korea-geography/index.html");
const styles = read("learning/inquiry/korea-geography/styles.css");
const app = read("learning/inquiry/korea-geography/app.js");
const dataSource = read("learning/inquiry/korea-geography/data.js");
const questionsSource = read("learning/inquiry/korea-geography/questions.js");
const principlesSource = read("learning/inquiry/korea-geography/principles.js");
const riverData = JSON.parse(read("learning/inquiry/korea-geography/data/major-rivers.geojson"));
const physicalRelief = fs.readFileSync(new URL("learning/inquiry/korea-geography/assets/korea-physical-relief.webp", root));
const regionalRelief = fs.readFileSync(new URL("learning/inquiry/korea-geography/assets/east-asia-physical-relief.webp", root));

// 화면 계약: 문항 수 선택이나 고정 문항 수 문구 없이, 필수 내용과 공식 출처를 바로 찾을 수 있어야 한다.
assert.match(html, /id="map"/);
assert.match(html, /id="startPractice"[^>]*>지형 문제 풀기/);
assert.match(html, /id="featureGuide"/);
assert.match(html, /id="principleGuide"/);
assert.match(html, /출제 기준·자료 출처/);
assert.match(html, /한국교육과정평가원 수능 출제 지침/);
assert.match(html, /국가교육과정정보센터 사회과 교육과정/);
assert.match(html, /기상청 1991~2020 기후평년값/);
assert.doesNotMatch(html, /id="practiceTopic"|id="practiceDifficulty"|id="practiceCount"/);
assert.doesNotMatch(html, /오늘의 5문제|문제 10개 풀기/);

assert.match(styles, /\.feature-guide, \.principle-guide, \.source-guide/);
assert.match(styles, /@media \(max-width: 1050px\)[\s\S]*?\.study-layout \{ display: flex; flex-direction: column; \}/);
assert.match(styles, /@media \(max-width: 820px\)[\s\S]*?\.question-body/);
assert.match(styles, /\.principle-button \{[^}]*min-height:\s*44px/s);

// 지도 계약: 기본 화면은 핵심 표지만, 세부 정보는 선택적으로 보여 준다.
assert.match(app, /voyager_nolabels/);
assert.match(app, /let mapDetailsVisible = false/);
assert.match(app, /세부 정보 보기/);
assert.match(app, /map !== mainMap \|\| mapDetailsVisible/);
assert.match(app, /detailOnly: true/);
assert.match(app, /activeTab\.offsetLeft/);
assert.doesNotMatch(app, /namesHidden|names-hidden/);
assert.match(app, /L\.imageOverlay\("assets\/east-asia-physical-relief\.webp/);
assert.match(app, /L\.imageOverlay\("assets\/korea-physical-relief\.webp/);
assert.match(app, /map\.getZoom\(\) >= 7/);
assert.match(app, /major-rivers\.geojson/);
assert.match(app, /function riverWidthAt/);
assert.match(app, /name === "한강" \? 3\.6/);
assert.match(app, /\["남한강", "북한강"\]\.includes\(name\) \? 2\.8/);
assert.match(app, /43\.15, 131\.35/);
assert.doesNotMatch(app, /World_Hillshade|World_Terrain_Base/);
assert.doesNotMatch(styles, /leaflet-relief-pane[^}]*mix-blend-mode:\s*multiply/s);
assert.ok(physicalRelief.byteLength > 600_000, "상세 지형 음영 자료가 없거나 비어 있습니다.");
assert.ok(regionalRelief.byteLength > 800_000, "동아시아 지형 음영 자료가 없거나 비어 있습니다.");

// 문제 풀이는 현재 범위의 문항 전체를 사용하며 임의의 목표 개수로 자르지 않는다.
assert.match(app, /question\.topic === currentTheme/);
assert.match(app, /shuffle\(pool\)\.map\(shuffleQuestionOptions\)/);
assert.doesNotMatch(app, /shuffle\(pool\)\.slice\s*\(|questions\.slice\s*\(\s*0\s*,\s*\d+/);
assert.match(app, /answer: shuffled\.findIndex\(\(option\) => option\.correct\)/);
assert.match(app, /function renderQuestionStimulus/);
assert.match(app, /stimulus\.type === "table"/);
assert.match(app, /stimulus\.type === "bars"/);
assert.match(app, /localStorage\.setItem\(PROGRESS_KEY/);

const sandbox = { window: {} };
vm.runInNewContext(dataSource, sandbox, { filename: "data.js" });
vm.runInNewContext(questionsSource, sandbox, { filename: "questions.js" });
vm.runInNewContext(principlesSource, sandbox, { filename: "principles.js" });
const dataset = sandbox.window.KOREA_GEOGRAPHY;
assert.ok(dataset, "한국지리 정적 자료가 노출되어야 합니다.");

const THEME_KEYS = ["territory", "terrain", "climate", "population", "industry", "region"];
assert.deepEqual(Object.keys(dataset.themes), THEME_KEYS);
assert.ok(Array.isArray(dataset.sources) && dataset.sources.length > 0, "공식 기준과 자료 출처가 필요합니다.");
for (const source of dataset.sources) {
  assert.ok(source.organization && source.label && /^https:\/\//.test(source.url), "출처 메타데이터가 불완전합니다.");
}

assert.equal(riverData.features.length, 12, "한반도 주요 하천 중심선 자료가 완전해야 합니다.");
const riverNames = new Set(riverData.features.map((feature) => feature.properties.name));
for (const name of ["압록강", "두만강", "대동강", "청천강", "북한강", "임진강"]) {
  assert.ok(riverNames.has(name), `${name} 자료가 필요합니다.`);
}
assert.ok(riverData.features.every((feature) => /LineString$/.test(feature.geometry.type)), "하천은 선 지형이어야 합니다.");
assert.match(dataSource, /relief: true/);
assert.match(dataSource, /featureMarkers: false/);
assert.match(dataSource, /name: "백두산"/);
assert.match(dataSource, /name: "개마고원"/);
assert.match(dataSource, /name: "섬진강", kind: "river"/);

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

assert.ok(Array.isArray(dataset.questions) && dataset.questions.length > 0, "문제은행이 비어 있습니다.");
const ids = new Set();
const stimulusTypes = new Set();
for (const question of dataset.questions) {
  assert.ok(!ids.has(question.id), `중복 문항 ID: ${question.id}`);
  ids.add(question.id);
  assert.ok(THEME_KEYS.includes(question.topic), `${question.id}의 주제가 잘못되었습니다.`);
  assert.ok(["basic", "advanced"].includes(question.difficulty), `${question.id}의 난이도가 잘못되었습니다.`);
  assert.ok(question.prompt && question.hint, `${question.id}의 발문 또는 단서가 없습니다.`);
  assert.equal(question.options.length, 5, `${question.id}는 수능형 5지선다여야 합니다.`);
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
  assert.ok(dataset.questions.some((question) => question.topic === topic), `${topic}의 필수 내용을 확인할 문항이 없습니다.`);
}
for (const type of ["table", "bars", "pyramid"]) {
  assert.ok(stimulusTypes.has(type), `${type} 자료 해석 문항이 필요합니다.`);
}

// 개수 대신 교육과정·평가원 출제 범위의 핵심 개념이 실제 자료 전체에 들어 있는지를 검증한다.
const essentialCoverage = {
  territory: [/영해/, /배타적 경제 수역/, /독도/, /표준 경선|표준시/, /대동여지도/, /지리 정보|GIS/],
  terrain: [/하천/, /산맥|산지/, /해안/, /카르스트|석회암/, /화산/, /평야|범람원/],
  climate: [/계절풍/, /강수/, /연교차|기온/, /푄/, /태풍/],
  population: [/저출산/, /고령화/, /인구 이동/, /도시화/, /주간 인구|야간 인구/],
  industry: [/농업/, /공업/, /에너지|발전/, /서비스업/, /교통/, /입지/],
  region: [/수도권/, /강원|관동|영동/, /충청|호서/, /호남/, /영남/, /제주/, /북한|관서|관북|해서/]
};
for (const [topic, patterns] of Object.entries(essentialCoverage)) {
  const corpus = JSON.stringify({ theme: dataset.themes[topic], questions: dataset.questions.filter((question) => question.topic === topic) });
  for (const pattern of patterns) assert.match(corpus, pattern, `${topic} 필수 개념 ${pattern}이 빠졌습니다.`);
}

console.log(`Korean Geography essential-content contract passed (${dataset.questions.length} dynamically loaded questions).`);
