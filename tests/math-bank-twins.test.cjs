'use strict';
const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path');
const { loadBank, dir } = require('../tools/question-bank/twin-capacity.cjs');
const T = require('../learning/literacy-numeracy/math-bank/twins.js'), B = loadBank();
const plans = Object.fromEntries(fs.readdirSync(path.join(dir, 'twins')).filter(file => file.endsWith('.json')).map(file => [file.slice(0, -5), JSON.parse(fs.readFileSync(path.join(dir, 'twins', file), 'utf8'))]));

test('초·중·고1 1학기의 모든 원문제에 내용이 다른 검증 변형이 정확히 세 개 있다', () => {
  let originals = 0, twins = 0;
  for (const unit of B.units()) {
    assert.equal(T.eligible(unit), true);
    const plan = plans[unit.grade + '-' + unit.semester];
    for (const group of unit.groups) for (const level of B.LEVELS) for (const original of B.bankOf(unit, group.id, level)) {
      const entry = plan.items[unit.id + ':' + original.key];
      assert.equal(entry.original, T.fingerprint(original), unit.id + ' ' + original.key);
      assert.equal(entry.variants.length, 3);
      const seen = new Set([T.canonical(original)]);
      entry.variants.forEach((spec, i) => {
        const item = T.construct(B, unit, group, original, entry, spec, i);
        assert.equal(T.fingerprint(item), spec.fingerprint, unit.id + ' ' + item.key);
        const shape = T.canonical(T.construct(B, unit, group, original, entry, { ...spec, render: undefined }, i));
        assert.equal(seen.has(shape), false, '보기 순서나 라벨 여백만 다른 복제를 새 문제로 세지 않는다'); seen.add(shape);
        assert.equal(item.originKey, original.key); assert.equal(item.twinNo, i + 1); twins++;
        if (spec.render) {
          const raw = T.construct(B, unit, group, original, entry, { ...spec, render: undefined }, i);
          const labels = html => [...String(html || '').matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)].map(match => match[1].replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()).sort();
          assert.deepEqual(JSON.parse(JSON.stringify(item.facts)), JSON.parse(JSON.stringify(raw.facts)), '라벨 보정은 수학적 조건을 바꾸지 않는다');
          for (const field of ['text', 'figure']) assert.deepEqual(labels(item[field]), labels(raw[field]), '보정 전후 그림에 적힌 문자·숫자가 같다');
          if (item.choice) item.choice.options.forEach((option, i) => assert.deepEqual(labels(option), labels(raw.choice.options[i])));
        }
      });
      originals++;
    }
  }
  assert.equal(originals, 14010); assert.equal(twins, originals * 3);
  assert.equal(Object.keys(plans).length, 19); assert.equal(plans['10-2'], undefined);
});

test('고1 2학기는 복원이나 네트워크 요청 전에 거부한다', async () => {
  assert.equal(T.eligible({ grade: 10, semester: 2 }), false);
  assert.equal(T.eligible({ grade: 11, semester: 1 }), false);
  await assert.rejects(T.forItem(B, { grade: 10, semester: 2 }, {}, {}), /대상이 아닙니다/);
});

test('원문제나 검증된 변형이 달라지면 임의 생성으로 대체하지 않고 중단한다', async () => {
  const unit = B.findUnit('1-1-1'), group = unit.groups[0], original = B.bankOf(unit, group.id, '기본')[0], plan = plans['1-1'];
  const entry = plan.items[unit.id + ':' + original.key], previousFetch = global.fetch;
  global.fetch = async () => ({ ok: true, json: async () => plan });
  try {
    assert.equal((await T.forItem(B, unit, group, original)).length, 3);
    await assert.rejects(T.forItem(B, unit, group, { ...original, text: original.text + ' 변경' }), /다시 검증/);
    const saved = entry.variants[0].fingerprint; entry.variants[0].fingerprint = 'invalid';
    await assert.rejects(T.forItem(B, unit, group, original), /일치하지 않습니다/);
    entry.variants[0].fingerprint = saved;
  } finally { global.fetch = previousFetch; }
});
