'use strict';
// 동물 만나기 자료. 사진은 자유 이용 되는 것만 쓰고 출처를 적어 둔다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const catalog = require('../lib/mission-catalog.js');

const animals = catalog.SEA_ANIMALS;
const discoveries = new Map(catalog.DISCOVERIES.map((d) => [d.id, d]));
const credits = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'catalog', 'photo-credits.json'), 'utf8'));
const photoDir = path.join(__dirname, '..', 'public', 'assets', 'landmarks');
const FREE_LICENSE = /^(CC0|CC BY|Public domain|KOGL|Attribution|FAL)/i;

assert.ok(animals.length >= 8, '동물이 너무 적음');
assert.equal(new Set(animals.map((a) => a.id)).size, animals.length, '동물 ID 중복');

for (const animal of animals) {
  const place = discoveries.get(animal.placeId);
  assert.ok(place, `${animal.animal}이 사는 지형을 찾지 못함: ${animal.placeId}`);
  // 섬을 아이콘으로 가리지 않도록 바다에서 잡는 것만 둔다.
  assert.equal(place.reach, 'sea', `${animal.animal}은 바다 지형이어야 함`);
  assert.ok(animal.roamRadiusTiles >= 20 && animal.roamRadiusTiles <= 90, `${animal.animal} 사는 범위가 이상함`);
  assert.ok(String(animal.text || '').length >= 60, `${animal.animal} 설명이 너무 짧음`);
  assert.ok(animal.text.endsWith('.'), `${animal.animal} 설명 마지막에 마침표 없음`);
  assert.ok(!/[A-Za-z]/.test(animal.text), `${animal.animal} 설명에 로마자가 섞임`);

  assert.ok(fs.existsSync(path.join(photoDir, `${animal.id}.webp`)), `${animal.animal} 사진이 없음`);
  const credit = credits[animal.id];
  assert.ok(credit, `${animal.animal} 사진 출처가 없음`);
  assert.ok(FREE_LICENSE.test(credit.license), `${animal.animal} 사진이 자유 이용이 아님: ${credit.license}`);
}

// 새 교사 미션은 지정한 장소만 사용한다. 기존 동물 자료는 유지한다.
const teacher = fs.readFileSync(path.join(__dirname, '..', 'public', 'teacher.html'), 'utf8');
assert.doesNotMatch(teacher, /id="missionKind"|id="huntNote"|payload\.hunt|바다 동물 만나기|게임이 알아서 고릅니다/, '별도 동물 모드와 자동 선택 안내를 제거해야 한다');
assert.match(teacher, /studyTargets:\[\.\.\.studySelection\]/, '교사가 선택한 장소를 미션으로 전달해야 한다');

console.log(JSON.stringify({ ok: true, animals: animals.length, regions: [...new Set(animals.map((a) => discoveries.get(a.placeId).name))].length }));
