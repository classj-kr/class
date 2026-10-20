'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), vm = require('node:vm'), path = require('node:path');
const C = require('../learning/literacy-numeracy/math-bank/concept-ox.js');
const ROOT = path.resolve(__dirname, '..'), BANK = path.join(ROOT, 'learning/literacy-numeracy/math-bank');
const c = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(BANK, '../math-ox/data.js'), 'utf8'), c);
const questions = c.window.MATH_OX_DATA;
const bank = {}; bank.globalThis = bank; vm.createContext(bank);
for (const file of ['engine.js', 'geometry.js', 'middle.js', ...fs.readdirSync(path.join(BANK, 'units')).filter(f => f.endsWith('.js')).sort().map(f => 'units/' + f)]) vm.runInContext(fs.readFileSync(path.join(BANK, file), 'utf8'), bank);

test('기존 OX 737문항은 빠짐없이 한 통합 단원에 연결되고 원래 과목·단원을 유지한다', () => {
  const linked = [];
  for (const [subject, sourceUnit, unitId, ids] of C.links) {
    const unit = bank.MathBank.findUnit(unitId) || C.findUnit(unitId);
    assert.ok(unit, unitId); assert.ok(!unit.semesterAdvanced); assert.ok(unit.oxOnly || unit.grade >= 3);
    for (const id of ids) {
      const q = questions.find(q => q.id === id); assert.ok(q, id);
      assert.equal(q.subject, subject); assert.equal(q.unit, sourceUnit); linked.push(id);
    }
  }
  assert.equal(questions.length, 737); assert.equal(new Set(linked).size, linked.length);
  assert.deepEqual(linked.sort((a,b) => a-b), Array.from(questions, q => q.id).sort((a,b) => a-b));
});
test('두 학기의 범위가 다른 분수·소수 나눗셈과 중·고 세부 단원을 문항 내용대로 나눈다', () => {
  for (const [id, unit] of [[464,'6-1-1'],[31,'6-2-1'],[477,'6-1-3'],[473,'6-2-3'],[522,'7-1-3'],[48,'7-1-4'],[558,'8-1-2'],[598,'8-2-6'],[74,'10-1-6'],[268,'10-2-3'],[270,'10-2-7']]) assert.ok(C.idsFor(unit).includes(id), id + ': ' + unit);
});
test('고등 선택 네 과목의 12단원은 모두 OX만 있고, 원래 주소도 연결된다', () => {
  assert.equal(C.courses.length, 4); assert.equal(C.virtualUnits.length, 12);
  for (const unit of C.virtualUnits) { assert.equal(unit.oxOnly, true); assert.equal(unit.groups.length, 0); assert.ok(C.idsFor(unit.id).length > 0); }
  assert.equal(C.legacyTarget('미적1', '적분'), 'ox-calculus-3');
  assert.equal(C.legacyTarget('초4', '삼각형'), '4-1-4');
  assert.deepEqual(C.idsFor('1-1-1'), []);
});
