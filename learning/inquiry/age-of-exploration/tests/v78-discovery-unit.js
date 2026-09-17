'use strict';
const assert = require('node:assert/strict');
const catalog = require('../lib/mission-catalog.js');
const discoveries = catalog.DISCOVERIES;

assert.ok(Array.isArray(discoveries) && discoveries.length >= 200, '발견 지점 목록이 비었음');
assert.equal(new Set(discoveries.map((d) => d.id)).size, discoveries.length, '발견 지점 ID 중복');
assert.equal(new Set(discoveries.map((d) => d.name)).size, discoveries.length, '발견 지점 이름 중복');

const KINDS = new Set(['자연', '종교 성지', '유적', '기술·산업', '옛 도시터']);
const REACHES = new Set(['sea', 'land', 'any']);
// 지어낸 것(유니콘·인어 등)은 넣지 않는다. 실제로 있던 곳만 다룬다.
// '용'처럼 다른 낱말에 섞여 드는 글자는 넣지 않는다(소용돌이·이용 등).
const MADE_UP = ['유니콘', '인어', '요정', '괴물', '드래곤'];

for (const item of discoveries) {
  assert.ok(KINDS.has(item.kind), `${item.name} 갈래 오류: ${item.kind}`);
  assert.ok(REACHES.has(item.reach), `${item.name} 닿는 방법 오류: ${item.reach}`);
  assert.ok(Number.isFinite(item.lat) && item.lat >= -90 && item.lat <= 90, `${item.name} 위도 오류`);
  assert.ok(Number.isFinite(item.lon) && item.lon >= -180 && item.lon <= 180, `${item.name} 경도 오류`);
  // 시험 대비에 꼭 필요한 정보라 오늘날 어느 나라인지 빠짐없이 적는다.
  assert.ok(String(item.todayCountry || '').length >= 2, `${item.name} 오늘날 나라 누락`);
  assert.ok(!/[A-Za-z]/.test(item.todayCountry), `${item.name} 오늘날 나라에 로마자가 섞임`);
  for (const field of ['in1520', 'text']) {
    const value = String(item[field] || '');
    assert.ok(value.length >= 20, `${item.name} ${field} 설명이 너무 짧음`);
    assert.ok(value.endsWith('.'), `${item.name} ${field} 마지막 문장에 마침표 없음`);
    assert.ok(!/[A-Za-z]/.test(value), `${item.name} ${field} 에 로마자가 섞임`);
    assert.ok(!/[一-鿿]/.test(value), `${item.name} ${field} 에 한자가 섞임`);
    for (const word of MADE_UP) assert.ok(!value.includes(word), `${item.name} ${field} 에 지어낸 것(${word})이 들어감`);
  }
  for (const word of MADE_UP) assert.ok(!item.name.includes(word), `${item.name} 은 지어낸 곳`);
}

// 뭍에만 있는 유적을 바다 위에서 누르지 못하도록 갈래별로 닿는 방법이 갈려 있어야 한다.
const byReach = {};
for (const item of discoveries) byReach[item.reach] = (byReach[item.reach] || 0) + 1;
assert.ok(byReach.sea > 0 && byReach.land > 0, '바다에서만·뭍에서만 닿는 곳이 모두 있어야 함');

const countries = new Set(discoveries.map((d) => d.todayCountry));
console.log(JSON.stringify({ ok: true, discoveries: discoveries.length, byReach, todayCountries: countries.size }));
