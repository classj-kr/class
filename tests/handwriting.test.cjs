const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../learning/literacy-numeracy/handwriting/core');
const perfect = (c) => C.model(c).map((p) => ({ points: C.sample(p, 50), width: 1.5 }));
test('all modern Hangul syllables compose finite, ordered stroke paths', () => {
  for (let n = 0; n < 11172; n++) {
    const paths = C.model(String.fromCodePoint(0xac00 + n));
    assert.ok(paths.length > 1 && paths.length <= 30);
    assert.ok(paths.flat().every((p) => p.length === 2 && p.every(Number.isFinite)));
  }
  assert.deepEqual(
    Array.from('ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ').map((c) => C.model(c).length),
    [1, 1, 2, 3, 3, 4, 2, 1, 2, 3, 2, 3, 4, 3],
  );
  assert.deepEqual(
    Array.from('ㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ').map((c) => C.model(c).length),
    [2, 3, 2, 3, 2, 3, 2, 3, 1, 1],
  );
  assert.equal(C.model('A'), null);
});
test('matching shape does not pass a reversed direction, swapped order, missing or extra stroke', () => {
  for (const c of ['ㄹ', 'ㅂ', 'ㅓ', '한', '꽃', '과', '읽']) {
    const strokes = perfect(c),
      r = C.judge(c, strokes);
    assert.equal(r.order, true, c);
    assert.ok(r.shape >= 98, c);
  }
  const reversed = perfect('ㄱ').map((s) => ({ points: [...s.points].reverse() }));
  assert.equal(C.judge('ㄱ', reversed).order, false);
  assert.ok(C.judge('ㄱ', reversed).shape >= 98);
  const swapped = perfect('가').reverse();
  assert.equal(C.judge('가', swapped).order, false);
  assert.ok(C.judge('가', swapped).shape >= 98);
  assert.equal(C.judge('가', perfect('가').slice(1)).order, false);
  assert.equal(C.judge('가', [...perfect('가'), ...perfect('가')]).order, false);
  assert.equal(C.judge('가', []).shape, 0);
  assert.equal(
    C.judge('ㄱ', [
      {
        points: [
          [20, 22],
          [20, 22],
        ],
      },
    ]).order,
    false,
  );
});
test('bounded coordinate validation rejects forged geometry and combines independent letter results', () => {
  assert.equal(C.judgeText('한 글', [perfect('한'), perfect('글')]).order, true);
  assert.throws(() => C.judgeText('가', []));
  assert.throws(() => C.judgeText('가', [[{ points: [[NaN, 5]] }]]));
  assert.throws(() => C.judgeText('가', [[{ points: [[999, 5]] }]]));
  assert.throws(() => C.judgeText('가', [[{ points: Array(300).fill([0, 0]) }]]));
  const r = C.judgeText('가나', [perfect('가'), []]);
  assert.equal(r.passed, 1);
  assert.equal(r.order, false);
  assert.ok(r.shape >= 49 && r.shape <= 50);
});
