'use strict';
const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path');
const { loadBank, dir } = require('../tools/question-bank/twin-capacity.cjs');
const { validate, expected } = require('../tools/question-bank/iscream-validation.cjs');
const B = loadBank(), coverage = require('../tools/question-bank/iscream-coverage.json');
test('생각을 더하다 48개 단원의 본·후속 활동에 기존 또는 추가 유형이 연결된다', () => {
  assert.equal(coverage.sections.length, 48);
  const added = new Set();
  for (const book of ['3-1', '3-2', '4-1', '4-2', '5-1', '5-2', '6-1', '6-2']) assert.deepEqual(coverage.sections.filter(s => s.book === book).map(s => s.chapter), [1, 2, 3, 4, 5, 6]);
  for (const s of coverage.sections) {
    const unit = B.findUnit(s.appUnit); assert.ok(unit, s.appUnit);
    const types = unit.groups.flatMap(g => g.types);
    assert.match(s.printedPages, /^\d+-\d+$/); assert.ok(s.adaptation.length > 10);
    assert.ok(s.existingTypes.length + s.addedTypes.length > 0);
    for (const id of s.existingTypes.concat(s.addedTypes)) assert.ok(types.some(t => t.id === id), `${s.book}/${s.chapter}: ${s.appUnit} ${id}`);
    for (const id of s.addedTypes) { assert.ok(!added.has(s.appUnit + ':' + id)); added.add(s.appUnit + ':' + id); }
  }
  const actual = B.units().flatMap(u => u.groups.flatMap(g => g.types.filter(t => t.id.startsWith('ic-')).map(t => u.id + ':' + t.id)));
  assert.deepEqual([...added].sort(), Array.from(actual).sort()); assert.equal(added.size, 37);
  const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
  for (const filename of fs.readdirSync(path.join(dir, 'units')).filter(x => /z\.js$/.test(x))) assert.ok(html.includes('units/' + filename), filename + ' 브라우저 등록 누락');
});
test('새 단답형 37문항과 각 유형의 60개 씨앗을 별도의 조합·최적화 계산으로 검사한다', () => {
  let originals = 0, variants = 0;
  for (const u of B.units()) for (const g of u.groups) for (const t of g.types.filter(x => x.id.startsWith('ic-'))) {
    for (const item of B.bankOf(u, g.id, t.level).filter(x => x.typeId === t.id)) { validate(item); originals++; }
    for (let n = 0; n < (t.count || 1); n++) for (let seed = 0; seed < 60; seed++) { validate(t.make(new B.Dice(seed * 7919 + 13), n)); variants++; }
  }
  assert.equal(originals, 37); assert.equal(variants, 37 * 60);
});
test('초과 경계와 조합 선택은 올림·단순 합으로 바뀌지 않는다', () => {
  assert.deepEqual(expected({ kind: 'vote-minimum', members: 57 }), [20]);
  assert.deepEqual(expected({ kind: 'vote-minimum', members: 63 }), [22]);
  assert.deepEqual(expected({ kind: 'vote-minimum', members: 58 }), [21]); // 참석 30명, 20표는 2/3과 같아 탈락
  assert.deepEqual(expected({ kind: 'fuel-saving', distance100: 33792, rates10: [96, 176] }), [16]);
  assert.deepEqual(expected({ kind: 'park-min-perimeter', step: 100, area: 120000 }), [1400]);
  assert.deepEqual(expected({ kind: 'park-max-area', step: 100, perimeter: 1600 }), [160000]);
  const box = { kind: 'parcel-two-rules', rows: [[5, 27, 24, 20], [12, 30, 32, 28]], weights: [2, 10, 20, 30], sizes: [60, 120, 140, 160], fees: [6000, 7000, 8000, 9000] };
  assert.deepEqual(expected(box), [15000]);
});
test('회귀 검사에서 발견한 기존 학기 종합의 정수·분수 답과 조사 오류가 재발하지 않는다', () => {
  const v = require('../tools/question-bank/twin-validation.cjs').createValidator(); let checked = 0;
  for (const unit of v.B.units().filter(u => u.semesterAdvanced)) for (const group of unit.groups) for (const type of group.types) for (let seed = 0; seed < 60; seed++) {
    const item = Object.assign({ key: type.id, standard: type.standard || group.standard }, type.make(new v.B.Dice(seed * 7919 + 13)));
    v.validate(item, { unit, group, level: type.level, seed }); checked++;
  }
  assert.equal(checked, 2400);
});
