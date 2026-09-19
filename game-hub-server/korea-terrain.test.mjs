import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../learning/inquiry/korea-terrain/', import.meta.url);
const read = (path) => fs.readFileSync(new URL(path, root), 'utf8');
const html = read('index.html');
const app = read('app.js');

// 바깥 서버에 기대지 않는다(출처 표시 글자 속 주소도 두지 않는다).
for (const [name, source] of [['index.html', html], ['app.js', app], ['styles.css', read('styles.css')]]) {
  assert.doesNotMatch(source, /https?:\/\//, `${name} must not load anything from another server.`);
}
assert.doesNotMatch(app, /glyphs\s*:/, 'Labels must be drawn with local fonts.');
assert.ok(fs.existsSync(new URL('vendor/maplibre-gl-6.10.0/maplibre-gl.mjs', root)), 'MapLibre copy is missing.');

for (const [, path] of html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))(?:\?[^"]*)?"/g)) {
  if (path.startsWith('vendor/')) continue;
  assert.match(html, new RegExp(`${path.replace('.', '\\.')}\\?v=`), `${path} needs a ?v= version.`);
}

// 눕히기만 되고 북쪽은 늘 위.
assert.match(app, /dragRotate:\s*false/);
assert.match(app, /touchZoomRotate\.disableRotation\(\)/);
assert.match(app, /keyboard\.disableRotation\(\)/);
assert.match(app, /maxPitch:\s*60/);
assert.match(app, /bearing:\s*0/);

// 높이 조각: 둘레 3~6단(동경 90~180, 북위 0~66.5)과 자세한 8~11단이 빠짐없이 있어야 한다.
const tileX = (lon, z) => ((lon + 180) / 360) * 2 ** z;
const tileY = (lat, z) => {
  const r = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z;
};
const has = (z, x, y) => fs.existsSync(new URL(`tiles/${z}/${x}/${y}.webp`, root));
for (let z = 3; z <= 6; z += 1) {
  const k = 2 ** (z - 3);
  for (let x = 6 * k; x < 8 * k; x += 1) for (let y = 2 * k; y < 4 * k; y += 1) assert.ok(has(z, x, y), `Missing wide tile ${z}/${x}/${y}`);
}
const x0 = Math.ceil(tileX(123, 8));
const x1 = Math.floor(tileX(134, 8));
const y0 = Math.ceil(tileY(45, 8));
const y1 = Math.floor(tileY(31, 8));
for (let z = 8; z <= 9; z += 1) {
  const k = 2 ** (z - 8);
  for (let x = x0 * k; x < x1 * k; x += 1) for (let y = y0 * k; y < y1 * k; y += 1) assert.ok(has(z, x, y), `Missing detail tile ${z}/${x}/${y}`);
}
// 10~11단은 남북한 땅에만 있다. 한반도 곳곳의 칸이 빠지지 않았는지 본다.
for (const [name, lng, lat] of [['서울', 126.98, 37.57], ['부산', 129.08, 35.18], ['목포', 126.39, 34.81], ['제주', 126.53, 33.36],
  ['마라도', 126.267, 33.117], ['울릉도', 130.87, 37.5], ['독도', 131.865, 37.242], ['백령도', 124.67, 37.96], ['평양', 125.75, 39.03],
  ['신의주', 124.4, 40.1], ['백두산', 128.057, 42.006], ['온성', 129.99, 42.95], ['나선', 130.3, 42.25], ['동강', 128.57, 37.24]]) {
  for (const z of [10, 11]) assert.ok(has(z, Math.floor(tileX(lng, z)), Math.floor(tileY(lat, z))), `${name} is missing a level-${z} tile.`);
}
// 자세한 조각 범위가 한반도 끝(마라도 33.11, 독도 131.87, 온성 43.01, 마안도 124.2)을 모두 덮는지
const lonAt = (x, z) => (x / 2 ** z) * 360 - 180;
const latAt = (y, z) => (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / 2 ** z))) * 180) / Math.PI;
assert.ok(lonAt(x0, 8) < 124.2 && lonAt(x1, 8) > 131.87, 'Detail tiles must cover Korea east to west.');
assert.ok(latAt(y0, 8) > 43.01 && latAt(y1, 8) < 33.11, 'Detail tiles must cover Korea north to south.');

const context = { window: {} };
vm.runInNewContext(read('data/terrain-data.js'), context);
const { labels, rivers } = context.window.TERRAIN_DATA;
const names = new Set(labels.features.map((f) => f.properties.name));
for (const name of ['태백산맥', '소백산맥', '낭림산맥', '함경산맥', '개마고원', '대관령 고위 평탄면', '춘천 분지', '양구 해안 분지(펀치볼)',
  '호남평야', '동강 감입 곡류', '경포호', '성산 일출봉', '철원 용암 대지', '독도', '울릉도', '백두산', '한라산', '동해', '황해', '남해',
  '한강', '낙동강', '금강', '영산강', '섬진강', '압록강', '두만강', '대동강']) {
  assert.ok(names.has(name), `Missing label ${name}.`);
}
for (const feature of labels.features) {
  const { name, kind, note } = feature.properties;
  const [lng, lat] = feature.geometry.coordinates;
  assert.ok(lng > 123.5 && lng < 132.5 && lat > 32.8 && lat < 43.2, `${name} is outside Korea.`);
  if (!['peak', 'river', 'sea'].includes(kind)) assert.ok(note && note.length > 3, `${name} needs a short note.`);
}
for (const river of rivers.features) {
  assert.ok(labels.features.some((f) => f.properties.kind === 'river' && f.properties.name === river.properties.name), `${river.properties.name} needs a label.`);
}

console.log('Korea terrain contract passed.');
