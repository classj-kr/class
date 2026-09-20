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
// 강: 줄기(선)마다 이름표(점)가 하나 이상 있어야 한다.
const { rivers } = context.window.GLOBE_DATA;
for (const river of rivers.features) {
  assert.ok(labels.features.some((f) => f.properties.kind === 'river' && f.properties.name === river.properties.name), `${river.properties.name} needs a name label.`);
}
const kinds = new Set(['mountain', 'plateau', 'plain', 'basin', 'desert', 'river', 'lake', 'peninsula', 'cape', 'island', 'other', 'peak', 'sea', 'strait', 'country', 'current', 'wind', 'belt']);
const names = new Set();
for (const feature of labels.features) {
  const { name, kind, tier, key } = feature.properties;
  assert.equal(key, `${kind}:${name}`, `${name}: every label needs its key for the info panel.`);
  const [lng, lat] = feature.geometry.coordinates;
  assert.ok(kinds.has(kind), `${name}: unknown kind ${kind}`);
  assert.ok([1, 2, 3, 4].includes(tier), `${name}: bad tier`);
  assert.ok(Math.abs(lng) <= 180 && Math.abs(lat) <= 85, `${name}: position must be drawable on the globe.`);
  // Natural Earth의 소리만 옮긴 이름이 새어 들어오지 않았는지 본다.
  assert.doesNotMatch(name, /(^|\s)(플래투|마운틴스?|레인지|로우랜드|플레인|업랜드|데저트|페닌슐라|코디렐라|디프레션|하이랜즈?|힐스)/, `${name}: transliterated English name.`);
  if (kind !== 'sea' && kind !== 'river' && kind !== 'current' && kind !== 'belt') {
    assert.ok(!names.has(`${kind}:${name}`), `${name}: duplicated label.`);
    names.add(`${kind}:${name}`);
  }
}
for (const name of ['히말라야산맥', '티베트고원', '한반도', '태백산맥', '소백산맥', '동해', '황해', '대한민국', '나일강', '창장강', '한강', '낙동강',
  '갈라파고스 제도', '바하마 제도', '카보베르데', '카보베르데 제도', '몰디브', '싱가포르', '독도', '울릉도', '제주도', '마젤란 해협', '티에라델푸에고섬',
  '호르무즈 해협', '베링 해협', '수에즈 운하', '바이칼호', '오대호', '희망봉', '혼곶', '쿠로시오 해류', '동한 난류', '북한 한류']) {
  assert.ok(labels.features.some((f) => f.properties.name === name), `Missing label ${name}.`);
}

// 나라 이름 앞 국기: 국기 코드가 있는 나라는 모두 묶음 그림에 자리가 있어야 하고, 분쟁지 등에는 국기를 달지 않는다.
const flags = JSON.parse(read('data/flags.json'));
assert.ok(fs.existsSync(new URL('data/flags.png', root)), 'Flag sheet image is missing.');
for (const feature of labels.features.filter((f) => f.properties.kind === 'country')) {
  const { name, flag } = feature.properties;
  if (['서사하라', '포클랜드 제도', '누벨칼레도니'].includes(name)) {
    assert.equal(flag, undefined, `${name} must not carry a flag.`);
    continue;
  }
  assert.ok(flag && flags[flag], `${name} needs a flag in the sheet.`);
}
assert.match(app, /flags\.png\?v=\$\{FLAG_VERSION\}/, 'The flag sheet needs a version so the year-long image cache does not keep an old one.');
// 설명 창의 큰 국기도 나라마다 있어야 한다.
for (const feature of labels.features.filter((f) => f.properties.flag)) {
  assert.ok(fs.existsSync(new URL(`data/flags/${feature.properties.flag}.webp`, root)), `${feature.properties.name} needs a big flag for the info panel.`);
}

// 날짜 변경선은 180도 경선 그대로가 아니라 꺾인 실제 선이어야 한다.
const { dateLine, currents } = context.window.GLOBE_DATA;
assert.ok(dateLine.geometry.coordinates.flat().some(([lng]) => Math.abs(lng) < 179), 'The date line must bend around islands, not follow 180° exactly.');

// 바람: 계절풍은 철이 정해져 있고, 늘 부는 바람은 always. 기압대는 저압·고압 띠다.
const { winds, belts } = context.window.GLOBE_DATA;
for (const wind of winds.features) {
  assert.ok(['always', 'summer', 'winter'].includes(wind.properties.season), `${wind.properties.name}: bad season`);
}
for (const belt of belts.features) {
  assert.ok(['low', 'high'].includes(belt.properties.air), `${belt.properties.name}: belt must be low or high`);
}
for (const name of ['무역풍', '편서풍', '극동풍', '여름 계절풍', '겨울 계절풍', '적도 저압대', '아열대 고압대']) {
  assert.ok(labels.features.some((f) => f.properties.name === name), `Missing label ${name}.`);
}

// 해류: 난류·한류가 정해져 있고, 날짜 변경선에서 끊겨 있어(지구를 가로지르는 선이 없어)야 한다.
for (const current of currents.features) {
  assert.equal(typeof current.properties.warm, 'boolean', `${current.properties.name} must be warm or cold.`);
  for (const part of current.geometry.coordinates) {
    for (let i = 1; i < part.length; i += 1) {
      assert.ok(Math.abs(part[i][0] - part[i - 1][0]) < 90, `${current.properties.name} must be split at the date line.`);
    }
  }
}

// 누르면 칠할 모양: 모양마다 그 이름표가 있어야 한다.
const shapes = JSON.parse(read('data/shapes.json'));
const labelKeys = new Set(labels.features.map((f) => f.properties.key));
for (const key of Object.keys(shapes)) assert.ok(labelKeys.has(key), `${key}: shape without a label.`);
for (const key of ['country:대한민국', 'peninsula:한반도', 'sea:태평양', 'island:갈라파고스 제도', 'lake:바이칼호', 'mountain:태백산맥']) {
  assert.ok(shapes[key], `${key} needs a shape to light up.`);
}

// 설명 창: 이름표마다 설명이 있고, 사진은 자유 이용 조건이며 파일과 찍은 이가 있어야 한다.
const info = JSON.parse(read('data/info.json'));
const infoKeys = new Set([...labelKeys, ...['적도', '북회귀선', '남회귀선', '북극권', '남극권', '본초 자오선', '날짜 변경선', '북극점', '남극점'].map((name) => `grid:${name}`)]);
const missingInfo = [...infoKeys].filter((key) => !info[key]);
assert.deepEqual(missingInfo, [], 'Every label needs an explanation.');
for (const [key, entry] of Object.entries(info)) {
  assert.ok(infoKeys.has(key), `${key}: explanation without a label.`);
  assert.ok(entry.where && entry.text?.length >= 2 && entry.exam?.length >= 2, `${key}: needs where, two paragraphs and exam points.`);
  for (const line of [entry.where, ...entry.text, ...entry.exam]) {
    assert.doesNotMatch(line, /알아봅시다|여러분/, `${key}: no voice outside the book.`);
  }
  if (!entry.photo) continue;
  assert.match(entry.photo.license, /^(CC0|CC BY|CC-BY|Public domain|PD|Attribution|FAL)/i, `${key}: photo must be freely licensed.`);
  assert.doesNotMatch(entry.photo.license, /\bN[CD]\b/, `${key}: no NC/ND photos.`);
  assert.ok(entry.photo.author && entry.photo.page, `${key}: photo needs its author and source page.`);
  assert.ok(fs.existsSync(new URL(entry.photo.src, root)), `${key}: photo file missing.`);
}

console.log('Globe contract passed.');
