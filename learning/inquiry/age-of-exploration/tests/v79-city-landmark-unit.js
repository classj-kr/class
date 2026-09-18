'use strict';
const assert = require('node:assert/strict');
const catalog = require('../lib/mission-catalog.js');

const landmarks = catalog.CITY_LANDMARKS;
const cities = new Map(catalog.ORIGINAL_CITIES.map((city) => [city.id, city]));
const discoveryIds = new Set(catalog.DISCOVERIES.map((item) => item.id));

assert.ok(Array.isArray(landmarks) && landmarks.length >= 40, '도시 명소 목록이 비었음');
assert.equal(new Set(landmarks.map((item) => item.id)).size, landmarks.length, '명소 ID 중복');

const KINDS = new Set(['성·요새', '궁궐', '종교 건축', '종교 성지', '유적', '자연', '아직 없는 곳']);
for (const item of landmarks) {
  const city = cities.get(item.cityId);
  assert.ok(city, `${item.name} 도시 ID를 찾지 못함: ${item.cityId}`);
  assert.ok(!city.retired, `${item.name} 은 숨긴 도시에 붙어 있음`);
  assert.ok(KINDS.has(item.kind), `${item.name} 갈래 오류: ${item.kind}`);
  assert.ok(['standing', 'later'].includes(item.status), `${item.name} 상태 오류`);
  assert.ok(String(item.todayCountry || '').length >= 2, `${item.name} 오늘날 나라 누락`);
  if (item.discoveryId) assert.ok(discoveryIds.has(item.discoveryId), `${item.name} 이어 붙인 발견 지점이 없음`);
  for (const field of ['in1520', 'text']) {
    const value = String(item[field] || '');
    assert.ok(value.length >= 20, `${item.name} ${field} 가 너무 짧음`);
    assert.ok(value.endsWith('.'), `${item.name} ${field} 마지막 문장에 마침표 없음`);
    assert.ok(!/[A-Za-z]/.test(value), `${item.name} ${field} 에 로마자가 섞임`);
    assert.ok(!/[一-鿿]/.test(value), `${item.name} ${field} 에 한자가 섞임`);
  }
}

// 1520년에 아직 없던 건물은 도시 그림에 그리지 않는다. 대신 언제 세워지는지를 설명에 꼭 적는다.
const later = landmarks.filter((item) => item.status === 'later');
assert.ok(later.length >= 4, '뒤에 세워질 건물이 너무 적음');
for (const item of later) {
  assert.equal(item.kind, '아직 없는 곳', `${item.name} 갈래는 "아직 없는 곳"이어야 함`);
  assert.match(item.name, /설 자리$/, `${item.name} 이름은 "… 설 자리"로 끝나야 함`);
  assert.match(item.built, /^\d{4}/, `${item.name} 세운 해가 없음`);
  assert.match(item.text, /\d{4}년/, `${item.name} 설명에 세워지는 해가 없음`);
  assert.ok(Number(item.built.slice(0, 4)) > 1520, `${item.name} 은 1520년 뒤에 세워진 것이 아님`);
}

// 그림 요청문에 1520년 뒤 건물을 그리라고 시키는 곳이 없어야 한다.
const fs = require('node:fs');
const prompts = fs.readFileSync(require('node:path').join(__dirname, '..', 'CITY-ART-PROMPTS.md'), 'utf8');
for (const word of ['포탈라궁을', '타지마할을', '성 바실리 대성당을', '베르사유 궁전을']) {
  assert.ok(!prompts.includes(`건물 ${word}`), `그림 요청문이 ${word} 그리라고 시킴`);
}

const byCity = {};
for (const item of landmarks) byCity[item.cityId] = (byCity[item.cityId] || 0) + 1;
console.log(JSON.stringify({
  ok: true,
  landmarks: landmarks.length,
  standing: landmarks.length - later.length,
  later: later.length,
  cities: Object.keys(byCity).length,
  foundTotal: catalog.DISCOVERIES.length + landmarks.length
}));
