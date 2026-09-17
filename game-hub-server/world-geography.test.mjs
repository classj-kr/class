import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = (path) => fs.readFileSync(new URL(path, root), 'utf8');
const html = read('learning/inquiry/world-geography/index.html');
const styles = read('learning/inquiry/world-geography/styles.css');
const app = read('learning/inquiry/world-geography/app.js');
const dataSource = read('learning/inquiry/world-geography/data.js');
const themeItemsSource = read('learning/inquiry/world-geography/theme-items.js');
const atlasHtml = read('learning/inquiry/world-geography/atlas/index.html');
const atlasStyles = read('learning/inquiry/world-geography/atlas/styles.css');
const atlasApp = read('learning/inquiry/world-geography/atlas/app.js');
const context = { window: {} };
vm.runInNewContext(dataSource, context, { filename: 'world-geography/data.js' });
vm.runInNewContext(themeItemsSource, context, { filename: 'world-geography/theme-items.js' });

const dataset = context.window.WORLD_GEOGRAPHY;
const expectedThemes = ['world', 'coordinates', 'terrain', 'climate', 'population', 'region', 'religion', 'resources'];
assert.ok(dataset, 'World geography data must be exposed for the learning surface.');
assert.deepEqual(Object.keys(dataset.themes), expectedThemes);

for (const themeId of expectedThemes) {
  const theme = dataset.themes[themeId];
  assert.ok(theme.title && theme.summary, `${themeId} needs concept copy.`);
  assert.ok(theme.features.length >= 6, `${themeId} needs at least six map features.`);
  const questions = dataset.questions.filter((question) => question.topic === themeId);
  assert.ok(questions.length >= 1, `${themeId} needs questions that cover its required concepts.`);
  for (const question of questions) {
    assert.ok(question.id && question.prompt && question.explanation);
    assert.ok(Array.isArray(question.options) && question.options.length === 4);
    assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length);
    assert.ok(Number.isFinite(question.focus?.lat) && Number.isFinite(question.focus?.lng));
  }
}

assert.match(html, /data-theme="coordinates"[^>]*>[\s\S]*?위도·경도/);
assert.match(html, /id="practiceDialog"/);
assert.match(html, /id="questionMap"/);
assert.doesNotMatch(html, /themeLayerControls|themeItemCard|theme-items\.js/);
assert.doesNotMatch(html, /mapHelp|지도 표식을 눌러/);
assert.doesNotMatch(html, /conceptKicker|핵심 지점/);
assert.doesNotMatch(html, /class="topbar"|누적 정답|<strong>세계지리<\/strong>/);
assert.doesNotMatch(html, /practice-launch|문제\s+\d+개\s+풀기/);
assert.match(html, /class="practice-button"[^>]*>문제 풀기<\/button>/);
assert.doesNotMatch(app, /문제\s+\$\{questionCount\}개\s+풀기/);
assert.match(html, /class="map-back"[\s\S]*?class="map-progress"/);
assert.match(dataSource, /본초 자오선/);
assert.match(dataSource, /날짜변경선/);
assert.match(dataSource, /북회귀선/);
assert.match(dataSource, /남회귀선/);
assert.match(app, /L\.imageOverlay\(MAP_IMAGE/);
assert.match(app, /localStorage\.setItem\(PROGRESS_KEY/);
assert.match(app, /reviewWrongQuestions/);
assert.match(styles, /min-height:\s*44px/);
assert.match(styles, /1024|860px/);

assert.match(atlasHtml, /id="themeLayerControls"[\s\S]*?id="themeItemCard"/);
assert.doesNotMatch(atlasHtml, /speakThemeItem|설명 듣기/);
assert.match(atlasHtml, /theme-items\.js\?v=20260903-3[\s\S]*?app\.js\?v=20260904-5/);
assert.match(atlasHtml, /styles\.css\?v=20260917-1/);
assert.match(atlasApp, /let activeCategory = "animal"/);
assert.match(atlasApp, /activeCategory = categoryId/);
assert.match(atlasApp, /setAttribute\("aria-pressed"/);
assert.match(atlasHtml, /class="atlas-theme-strip"[\s\S]*?id="themeLayerControls"/);
assert.doesNotMatch(atlasHtml, /atlasPrompt|테마 하나를 골라요|골라 보는 세계/);
assert.doesNotMatch(atlasHtml, /class="topbar"|지리 지도|<strong>테마도감<\/strong>/);
assert.match(atlasHtml, /class="map-back"/);
assert.match(atlasStyles, /\.atlas-theme-strip \.theme-layer-controls/);
assert.match(atlasStyles, /\.atlas-map-stage \.atlas-item-card/);
assert.match(atlasStyles, /\.atlas-layout[^}]*grid-template-rows:\s*minmax\(0,\s*1fr\)/);
assert.match(atlasStyles, /\.atlas-map-stage[^}]*height:\s*100%/);
assert.doesNotMatch(atlasStyles, /grid-template-rows:\s*62px\s+auto/);
assert.match(styles, /\.concept-card h1[^}]*font-size:\s*1\.08rem/);
assert.doesNotMatch(styles, /\.concept-card h1[^}]*font-family:\s*Georgia/);
assert.match(app, /renderBaseMapCopies/);
assert.match(app, /worldCopyIndex/);
assert.match(app, /Math\.log2\(size\.x \/ 360\)/);
assert.match(app, /\[-90, -1000000\]/);
assert.match(app, /L\.control\.zoom\(\{ position: "bottomright" \}\)/);
assert.match(atlasApp, /renderBaseMapCopies/);
assert.match(atlasApp, /worldCopyIndex/);
assert.match(atlasApp, /Math\.log2\(size\.x \/ 360\)/);
assert.match(atlasApp, /\[-90, -1000000\]/);
assert.match(atlasApp, /L\.control\.zoom\(\{ position: "bottomright" \}\)/);

const atlas = context.window.WORLD_THEME_ATLAS;
const expectedCategories = ['capital', 'flag', 'animal', 'landmark', 'food', 'nature', 'culture', 'dinosaur'];
assert.deepEqual(Array.from(atlas.categories, (category) => category.id), expectedCategories);
assert.equal(atlas.items.length, 144, 'The theme atlas should provide 144 tappable learning points.');
assert.equal(new Set(atlas.items.map((item) => item.id)).size, atlas.items.length, 'Theme item ids must be unique.');
for (const categoryId of expectedCategories) {
  assert.equal(atlas.items.filter((item) => item.category === categoryId).length, 18, `${categoryId} should have 18 balanced starter points.`);
}
for (const item of atlas.items) {
  assert.ok(item.name && item.place && item.description && item.icon && item.color, `${item.id} needs complete card content.`);
  assert.ok(Number.isFinite(item.lat) && item.lat >= -90 && item.lat <= 90, `${item.id} latitude is invalid.`);
  assert.ok(Number.isFinite(item.lng) && item.lng >= -180 && item.lng <= 180, `${item.id} longitude is invalid.`);
}

console.log('World geography learning contract passed.');
