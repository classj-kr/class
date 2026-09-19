'use strict';
// 도시 이야기(왜 여기에 도시가 생겼을까 · 1520년에는 · 지금은)와 오늘날 사진.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (file) => JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));
const cities = read('data/catalog/original-cities.json').filter((city) => !city.retired);
const stories = read('data/catalog/city-stories.json');
const credits = read('data/catalog/city-photo-credits.json');
const photoDir = path.join(ROOT, 'public', 'assets', 'city-today');

const byId = new Map(stories.map((item) => [item.cityId, item]));
assert.equal(byId.size, stories.length, '이야기 도시 ID 중복');
for (const city of cities) {
  const story = byId.get(city.id);
  assert.ok(story, `${city.name} 이야기가 없음`);
  for (const field of ['why', 'in1520', 'today']) {
    const value = String(story[field] || '');
    assert.ok(value.length >= 20, `${city.name} ${field} 가 너무 짧음`);
    assert.ok(value.endsWith('.'), `${city.name} ${field} 마지막 문장에 마침표 없음`);
    assert.ok(!/[A-Za-z]/.test(value), `${city.name} ${field} 에 로마자가 섞임`);
    assert.ok(!/[一-鿿]/.test(value), `${city.name} ${field} 에 한자가 섞임`);
  }
}
for (const id of byId.keys()) assert.ok(cities.some((city) => city.id === id), `없는 도시의 이야기: ${id}`);

// 사진은 마음대로 써도 되는 것만, 누가 찍었는지와 이용 조건을 붙여서.
const FREE = /^(cc0|cc[- ]by|public domain|pd|fal)/i;
const keys = new Set(cities.map((city) => city.artKey));
const photos = fs.readdirSync(photoDir).filter((file) => file.endsWith('.webp'));
assert.ok(photos.length >= 200, `오늘날 사진이 너무 적음: ${photos.length}`);
for (const file of photos) {
  const key = file.replace(/\.webp$/, '');
  assert.ok(keys.has(key), `도시 목록에 없는 사진: ${file}`);
  const credit = credits[key];
  assert.ok(credit, `${key} 사진 출처가 없음`);
  assert.match(credit.license, FREE, `${key} 자유 이용 조건이 아님: ${credit.license}`);
  assert.ok(credit.author && !/알 수 없음|https?:|<|No machine/.test(credit.author), `${key} 찍은 사람 이름이 이상함: ${credit.author}`);
  assert.ok(fs.statSync(path.join(photoDir, file)).size < 600 * 1024, `${key} 사진이 너무 큼`);
  if (credit.caption) {
    assert.ok(credit.caption.endsWith('.'), `${key} 사진 설명에 마침표 없음`);
    assert.ok(!/[A-Za-z]/.test(credit.caption), `${key} 사진 설명에 로마자가 섞임`);
  }
}
for (const key of Object.keys(credits)) assert.ok(photos.includes(`${key}.webp`), `사진 없이 출처만 있음: ${key}`);

// 1520년 뒤에 지은 명소가 도시의 얼굴이면 오늘날 사진이 그곳을 보여 주고, 언제 지었는지 적는다.
for (const [key, name] of [['lhasa', '포탈라궁'], ['moscow', '성 바실리'], ['istanbul', '블루 모스크'], ['delhi', '붉은 성']]) {
  assert.ok(credits[key]?.caption?.includes(name), `${key} 사진 설명에 ${name} 이 없음`);
  assert.match(credits[key].caption, /1520년에는 아직 없었습니다/, `${key} 사진 설명에 1520년에 없었다는 말이 없음`);
}

const server = fs.readFileSync(path.join(ROOT, 'server.js'), 'utf8');
assert.match(server, /caption: credit\?\.caption/, '서버가 사진 설명을 보내지 않음');
const page = fs.readFileSync(path.join(ROOT, 'public', 'index.html'), 'utf8');
assert.match(page, /storyCaption/, '화면이 사진 설명을 보여 주지 않음');
assert.match(page, /왜 여기에 도시가 생겼을까\?/, '이야기 첫 칸 제목이 없음');

console.log(`v83 city story unit ok · 이야기 ${stories.length} · 사진 ${photos.length} · 사진 설명 ${Object.values(credits).filter((c) => c.caption).length}`);
