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
test('approximate stroke guides stay close to actual font ink', () => {
  for (const c of ['ㄹ', 'ㅂ', 'ㅓ', '한', '꽃', '과', '읽']) {
    const strokes = perfect(c),
      r = C.judge(c, strokes);
    assert.equal(r.order, true, c);
    // Guides approximate the centreline; the shape target is the independent font mask.
    assert.ok(r.shape >= 90, c);
  }
});
test('matching shape does not pass a reversed direction, swapped order, missing or extra stroke', () => {
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
test('a manually traced font sample passes without following generated guide artefacts', () => {
  // Coordinates read from the rendered reference, independent of C.model().
  const strokes = [
    [
      [17.5, 29.5],
      [28, 29.3],
      [38, 28.5],
      [47, 28],
      [44, 38],
      [37, 48],
      [29, 57],
      [18, 67],
    ],
    [
      [69, 12.5],
      [69, 89],
    ],
    [
      [69, 44],
      [84, 43],
    ],
  ];
  const result = C.judge('가', strokes);
  assert.equal(result.order, true);
  assert.ok(result.shape >= 90);
  const shifted = strokes.map((s) => s.map(([x, y]) => [x + 23, y]));
  assert.ok(C.judge('가', shifted).shape < 60);
  assert.equal(C.judge('가', [strokes[0], strokes[1], [...strokes[2]].reverse()]).order, false);
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
