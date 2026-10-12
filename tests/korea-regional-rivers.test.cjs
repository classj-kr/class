const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../learning/inquiry/korea-map');
const w = {};
for (const file of ['data/regional-rivers.js', 'data/geo-data.js']) vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), { window: w });
const rivers = w.KOREA_REGIONAL_RIVERS.features;
const river = id => rivers.find(f => f.properties.id === id);
const points = id => river(id).geometry.coordinates.flat();
const near = (id, x, y, radius) => points(id).some(p => Math.hypot(p[0] - x, p[1] - y) < radius);

test('four requested rivers have distinct named paths and on-river explanation labels', () => {
  for (const id of ['huang', 'yangtze', 'songhua', 'liao']) {
    const r = river(id);
    assert.ok(r && points(id).length > 100, id);
    assert.ok(r.properties.note.length > 40, id);
    assert.ok(points(id).some(p => p[0] === r.properties.label[0] && p[1] === r.properties.label[1]), id);
    const label = w.KOREA_GEOGRAPHY.themes.terrain.annotations.find(a => a.name === r.properties.name);
    assert.ok(label?.note && label.minZoom <= 4, id);
    for (const line of r.geometry.coordinates) for (let i = 1; i < line.length; i++) {
      assert.ok(Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]) < 1, `${id}: spurious inter-segment bridge`);
    }
  }
  assert.equal(w.KOREA_GEOGRAPHY.themes.terrain.minZoom, 4);
});

test('river extents reach their actual receiving sea or river, including the wide Yangtze estuary', () => {
  assert.ok(near('huang', 119.03, 37.80, 0.06), 'Huang He: Bohai');
  assert.ok(near('yangtze', 122.0, 31.4, 0.35), 'Yangtze: East China Sea, not an inland cutoff');
  assert.ok(near('liao', 122.15, 40.70, 0.06), 'Liao: Liaodong Bay');
  assert.ok(near('songhua', 132.52, 47.71, 0.06), 'Songhua: Amur confluence');
  assert.ok(near('amur', 132.52, 47.71, 0.08), 'Amur receiving reach');
  assert.ok(near('ussuri', 135.04, 48.48, 0.06), 'Ussuri: Amur confluence');
  assert.ok(Math.min(...points('huang').map(p => p[0])) < 97, 'Huang He upper course');
  assert.ok(Math.min(...points('yangtze').map(p => p[0])) < 92, 'Yangtze upper course aliases');
  assert.ok(near('songhua', 127.38, 42.57, 0.06), 'Second Songhua upper reach');
});

test('regional rivers do not enter the domestic flow selector or other themes', () => {
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  assert.match(app, /theme === themes\.terrain && !opts\.baseOnly\) drawRegionalRivers/);
  const renderer = app.slice(app.indexOf('function drawRegionalRivers'), app.indexOf('// 교통 탭의 실제 노선'));
  assert.match(renderer, /showAnnotationNote/);
  assert.doesNotMatch(renderer, /scene\.selectRiver/);
  const korean = JSON.parse(fs.readFileSync(path.join(root, 'data/major-rivers.geojson'), 'utf8'));
  assert.ok(korean.features.every(f => !/황하|장강|송화|요하|흑룡|우수리/.test(f.properties.name)));
  for (const [key, theme] of Object.entries(w.KOREA_GEOGRAPHY.themes)) {
    if (key !== 'terrain') assert.ok(!(theme.annotations || []).some(a => rivers.some(r => r.properties.name === a.name)), key);
  }
});
