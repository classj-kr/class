const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../learning/literacy-numeracy/handwriting/core');
const Font = require('../learning/literacy-numeracy/handwriting/font-source');
const fs = require('node:fs'),
  path = require('node:path'),
  crypto = require('node:crypto');
const perfect = (c) => C.model(c).map((p) => ({ points: C.sample(p, 50), width: 1.5 }));
test('the delivered font files match the current original design source', () => {
  const directory = path.join(__dirname, '../assets/fonts/classj-gyeongpil');
  const manifest = JSON.parse(fs.readFileSync(path.join(directory, 'font-manifest.json'), 'utf8'));
  const source = fs.readFileSync(require.resolve('../learning/literacy-numeracy/handwriting/font-source'));
  assert.equal(manifest.sourceSha256, crypto.createHash('sha256').update(source).digest('hex'));
  assert.equal(manifest.hangulSyllables, 11172);
  assert.equal(manifest.compatibilityJamo, 51);
  assert.equal(
    fs.readFileSync(path.join(directory, 'ClassJGyeongpilMyeongjo-Regular.woff2')).subarray(0, 4).toString(),
    'wOF2',
  );
});
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
test('the designed pen paths remain aligned with shape and order judging', () => {
  for (const c of ['ㄹ', 'ㅂ', 'ㅓ', '한', '꽃', '과', '읽']) {
    const strokes = perfect(c),
      r = C.judge(c, strokes);
    assert.equal(r.order, true, c);
    assert.ok(r.shape >= 98, c);
  }
});
test('optical final proportions retain open counters and separate from upper ink', () => {
  const bounds = (paths) => {
    const p = paths.flat();
    return [
      Math.min(...p.map((v) => v[0])),
      Math.min(...p.map((v) => v[1])),
      Math.max(...p.map((v) => v[0])),
      Math.max(...p.map((v) => v[1])),
    ];
  };
  for (const char of Array.from('각간갈감강꽃닭읽읊')) {
    const parts = Font.components(char),
      [l, t, r, b] = bounds(parts.find((p) => p.kind === 'final').paths);
    assert.ok(b - t >= 20 && b - t <= 37, char + ': final height');
    assert.ok(r - l >= 33 && r - l <= 82, char + ': final width');
    assert.ok(t >= 56 && b <= 95.5, char + ': final vertical placement');
    const final = parts.find((p) => p.kind === 'final').paths.flatMap((p) => Font.sample(p, 80));
    const upper = parts
      .filter((p) => p.kind !== 'final')
      .flatMap((p) => p.paths)
      .flatMap((p) => Font.sample(p, 80));
    const gap = Math.min(
      ...final.map((p) => Math.min(...upper.map((q) => Math.hypot(p[0] - q[0], p[1] - q[1])))),
    );
    assert.ok(gap > 4.8, char + ': final ink must stay separate');
  }
  const finalBounds = (c) => bounds(Font.components(c).find((p) => p.kind === 'final').paths);
  const [ol, ot, or, ob] = finalBounds('정');
  assert.ok((or - ol) / (ob - ot) < 1.5, 'final ㅇ must not be flattened into a wide oval');
  const [nl, , nr] = finalBounds('인');
  assert.ok(nr - nl < 52, 'final ㄴ stays compact instead of spanning the whole square');
  const [, rt, , rb] = finalBounds('열');
  assert.ok(rb - rt > 27, 'final ㄹ has enough height for three tiers');
  const [, ct, , cb] = finalBounds('꽃');
  assert.ok(cb - ct > 31, 'final ㅊ has room for its head, horizontal and diagonal strokes');
  for (const char of Array.from('오요와왜')) {
    const parts = Font.components(char),
      upper = bounds(parts[0].paths),
      lower = bounds(parts[1].paths);
    // In pen lettering the vowel stem can meet the bowl. The crossbar must
    // still sit below the full bowl rather than flattening both into one tier.
    assert.ok(lower[3] - upper[3] > 8, char + ': vowel crossbar stays below the bowl');
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
test('compound vowel construction keeps the lower arm and distinct upright stems', () => {
  const middleY = (path) => (path[0][1] + path.at(-1)[1]) / 2;
  for (const char of ['워', '웨']) {
    const parts = Font.components(char),
      horizontal = parts.find((p) => p.char === 'ㅜ').paths[0],
      arm = parts.find((p) => 'ㅓㅔ'.includes(p.char)).paths[0];
    assert.ok(middleY(arm) - middleY(horizontal) > 10, char + ': short arm sits below the long crossbar');
  }
  for (const char of ['애', '얘', '에', '예', '책']) {
    const vowel = Font.components(char).find((p) => p.kind === 'vowel'),
      stems = vowel.paths.filter((p) => p.at(-1)[1] - p[0][1] > 35),
      separation = Math.abs(stems[0][0][0] - stems[1][0][0]);
    assert.equal(stems.length, 2, char);
    assert.ok(separation >= 14 && separation <= 22, char + ': two stems fit within one vowel');
  }
  const parts = Font.components('교'),
    initial = parts[0].paths.flatMap((p) => Font.sample(p, 70)),
    stems = parts[1].paths.slice(0, 2).flatMap((p) => Font.sample(p, 40)),
    gap = Math.min(...initial.map((p) => Math.min(...stems.map((q) => Math.hypot(p[0] - q[0], p[1] - q[1])))));
  assert.ok(gap > 9, '교: ㄱ does not collide with either short vowel stem');
});
test('initial consonants stay clear of finals across every modern syllable', () => {
  for (let n = 0; n < 11172; n++) {
    if (n % 28 === 0) continue;
    const char = String.fromCodePoint(0xac00 + n),
      parts = Font.components(char),
      upper = parts.find((p) => p.kind === 'initial').paths.flatMap((p) => Font.sample(p, 32)),
      lower = parts.find((p) => p.kind === 'final').paths.flatMap((p) => Font.sample(p, 32));
    let gap = Infinity;
    for (const p of upper) for (const q of lower)
      gap = Math.min(gap, Math.hypot(p[0] - q[0], p[1] - q[1]));
    assert.ok(gap > 6, char + ': initial/final clearance ' + gap);
  }
});
test('descending vowels stop at the first final tier instead of crossing its counter', () => {
  for (const initial of Font.CHO) for (const vowel of ['ㅜ', 'ㅠ', 'ㅝ', 'ㅟ']) {
    for (const final of ['ㄱ', 'ㄷ', 'ㄹ', 'ㅌ']) {
      const char = String.fromCodePoint(0xac00 + Font.CHO.indexOf(initial) * 588 + Font.JUNG.indexOf(vowel) * 28 + Font.JONG.indexOf(final)),
        parts = Font.components(char),
        lower = parts.find((p) => p.kind === 'final').paths[0],
        crossbarBottom = Math.max(...lower.map((p) => p[1])),
        descending = parts.find((p) => p.char === 'ㅜ' || p.char === 'ㅠ').paths.slice(1);
      for (const path of descending)
        assert.ok(path.at(-1)[1] <= crossbarBottom + 1, char + ': vowel enters final body');
    }
  }
});
test('ㅝ and ㅞ keep the short arm below the crossbar and attached to the stem with every final', () => {
  for (const initial of Font.CHO) for (const vowel of ['ㅝ', 'ㅞ']) for (const final of Font.JONG) {
    const char = String.fromCodePoint(0xac00 + Font.CHO.indexOf(initial) * 588 + Font.JUNG.indexOf(vowel) * 28 + Font.JONG.indexOf(final)),
      parts = Font.components(char),
      longBar = parts.find((p) => p.char === 'ㅜ').paths[0],
      upright = parts.find((p) => p.char === 'ㅓ' || p.char === 'ㅔ').paths,
      arm = upright[0],
      stem = upright[1];
    assert.ok(arm.at(-1)[1] > Math.max(...longBar.map((p) => p[1])) + 3, char + ': short arm above long crossbar');
    assert.ok(arm.at(-1)[1] < stem.at(-1)[1], char + ': short arm hangs below stem');
  }
});
test('an independent pen trace of 워 agrees with the displayed compound vowel', () => {
  const strokes = [
    [[34.5, 13.5], [22, 17], [17, 28.5], [22, 40], [34.5, 43.5], [47, 39], [52, 28.5], [47, 17], [34.5, 13.5]],
    [[7, 55.5], [64, 53]],
    [[35.5, 54.5], [35, 63], [32, 78], [28.5, 90.5]],
    [[57.5, 66.5], [74.5, 66.5]],
    [[74.5, 8], [74, 94.5]],
  ];
  const result = C.judge('워', strokes);
  assert.equal(result.order, true);
  assert.ok(result.shape >= 94);
});
test('a manually traced font sample passes without following generated guide artefacts', () => {
  // Coordinates read from the rendered reference, independent of C.model().
  const strokes = [
    [
      [14, 29],
      [29, 28],
      [51, 28],
      [46, 42],
      [31, 56],
      [16, 64],
    ],
    [
      [69, 13],
      [69, 91],
    ],
    [
      [69, 48],
      [89, 47],
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
test('validating saved handwriting is idempotent and preserves small pen movements', () => {
  const cells = [
    [
      {
        points: [
          [12.34, 24.56],
          [13.5, 24.9],
          [14, 28],
          [17, 30],
        ],
        width: 1.5,
      },
    ],
  ];
  const clean = C.validateCells('가', cells);
  assert.deepEqual(clean, cells);
  assert.deepEqual(C.validateCells('가', clean), clean);
  clean[0][0].points[0][0] = 80;
  assert.equal(cells[0][0].points[0][0], 12.34, 'validated data must be a copy');
});
