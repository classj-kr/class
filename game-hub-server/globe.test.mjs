import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../learning/inquiry/globe/', import.meta.url);
const read = (path) => fs.readFileSync(new URL(path, root), 'utf8');
const html = read('index.html');
const app = read('app.js');

// 바깥 서버에 기대지 않는다: 페이지·스크립트·스타일 어디에도 바깥 주소가 없어야 한다.
for (const [name, source] of [['index.html', html], ['app.js', app], ['styles.css', read('styles.css')]]) {
  assert.doesNotMatch(source, /https?:\/\//, `${name} must not load anything from another server.`);
}
assert.doesNotMatch(app, /glyphs\s*:/, 'Labels must be drawn with local fonts, not downloaded glyphs.');

// 로컬 스크립트·스타일은 버전 물음표가 있어야 옛 파일과 섞이지 않는다(외부 라이브러리 폴더는 이름에 판 번호가 있다).
for (const [, path] of html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))(?:\?[^"]*)?"/g)) {
  if (path.startsWith('vendor/')) continue;
  assert.match(html, new RegExp(`${path.replace('.', '\\.')}\\?v=`), `${path} needs a ?v= version.`);
}
for (const file of ['maplibre-gl.mjs', 'maplibre-gl-shared.mjs', 'maplibre-gl-worker.mjs', 'maplibre-gl.css', 'LICENSE.txt']) {
  assert.ok(fs.existsSync(new URL(`vendor/maplibre-gl-6.10.0/${file}`, root)), `Missing vendored ${file}.`);
}

// 남북이 뒤집히거나 화면이 눕지 않는다.
assert.match(app, /maxPitch:\s*0/);
assert.match(app, /dragRotate:\s*false/);
assert.match(app, /touchPitch:\s*false/);
assert.match(app, /touchZoomRotate\.disableRotation\(\)/);
assert.match(app, /keyboard\.disableRotation\(\)/);

// 지도 조각은 0~5단이 빠짐없이 있어야 한다.
for (let z = 0; z <= 5; z += 1) {
  for (let x = 0; x < 2 ** z; x += 1) {
    for (let y = 0; y < 2 ** z; y += 1) {
      assert.ok(fs.existsSync(new URL(`tiles/${z}/${x}/${y}.webp`, root)), `Missing tile ${z}/${x}/${y}.`);
    }
  }
}

const context = { window: {} };
vm.runInNewContext(read('data/globe-data.js'), context);
const { labels, borders } = context.window.GLOBE_DATA;
assert.ok(borders.features.length > 100, 'Country borders must be present.');
const kinds = new Set(['mountain', 'plateau', 'plain', 'basin', 'desert', 'peninsula', 'other', 'peak', 'sea', 'country']);
const names = new Set();
for (const feature of labels.features) {
  const { name, kind, tier } = feature.properties;
  const [lng, lat] = feature.geometry.coordinates;
  assert.ok(kinds.has(kind), `${name}: unknown kind ${kind}`);
  assert.ok([1, 2, 3, 4].includes(tier), `${name}: bad tier`);
  assert.ok(Math.abs(lng) <= 180 && Math.abs(lat) <= 85, `${name}: position must be drawable on the globe.`);
  // Natural Earth의 소리만 옮긴 이름이 새어 들어오지 않았는지 본다.
  assert.doesNotMatch(name, /(^|\s)(플래투|마운틴스?|레인지|로우랜드|플레인|업랜드|데저트|페닌슐라|코디렐라|디프레션|하이랜즈?|힐스)/, `${name}: transliterated English name.`);
  if (kind !== 'sea') {
    assert.ok(!names.has(`${kind}:${name}`), `${name}: duplicated label.`);
    names.add(`${kind}:${name}`);
  }
}
for (const name of ['히말라야산맥', '티베트고원', '한반도', '태백산맥', '소백산맥', '동해', '황해', '대한민국']) {
  assert.ok(labels.features.some((f) => f.properties.name === name), `Missing label ${name}.`);
}

console.log('Globe contract passed.');
