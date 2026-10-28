(function (root) {
  'use strict';
  // Original centre-line models on a 100 × 100 square. One array = one pen-down.
  // Stroke divisions/directions: Sejong Korean 1 (2011), preliminary unit, pp.18–21.
  const line = (...p) => p;
  const circle = () =>
    Array.from({ length: 41 }, (_, i) => {
      const a = -Math.PI / 2 - (i * Math.PI) / 20;
      return [50 + 30 * Math.cos(a), 52 + 30 * Math.sin(a)];
    });
  const shapes = {
    ㄱ: [line([20, 22], [80, 22], [80, 80])],
    ㄴ: [line([20, 20], [20, 80], [80, 80])],
    ㄷ: [line([20, 22], [80, 22]), line([20, 22], [20, 80], [80, 80])],
    ㄹ: [line([20, 20], [80, 20], [80, 50]), line([20, 50], [80, 50]), line([20, 50], [20, 80], [80, 80])],
    ㅁ: [line([20, 22], [20, 80]), line([20, 22], [80, 22], [80, 80]), line([20, 80], [80, 80])],
    ㅂ: [
      line([20, 20], [20, 80]),
      line([80, 20], [80, 80]),
      line([20, 48], [80, 48]),
      line([20, 80], [80, 80]),
    ],
    ㅅ: [line([50, 22], [43, 49], [20, 80]), line([48, 39], [61, 60], [80, 80])],
    ㅇ: [circle()],
    ㅈ: [line([20, 22], [80, 22], [56, 52], [20, 80]), line([53, 48], [80, 80])],
    ㅊ: [line([40, 12], [60, 12]), line([20, 32], [80, 32], [56, 58], [20, 85]), line([53, 53], [80, 85])],
    ㅋ: [line([20, 22], [80, 22], [80, 80]), line([20, 50], [80, 50])],
    ㅌ: [line([20, 20], [80, 20]), line([20, 48], [80, 48]), line([20, 20], [20, 80], [80, 80])],
    ㅍ: [
      line([15, 22], [85, 22]),
      line([32, 22], [32, 80]),
      line([68, 22], [68, 80]),
      line([15, 80], [85, 80]),
    ],
    ㅎ: [
      line([40, 12], [60, 12]),
      line([18, 30], [82, 30]),
      circle().map(([x, y]) => [x, 42 + (y - 22) * 0.65]),
    ],
    ㅏ: [line([45, 15], [45, 85]), line([45, 48], [78, 48])],
    ㅑ: [line([45, 15], [45, 85]), line([45, 35], [78, 35]), line([45, 65], [78, 65])],
    ㅓ: [line([22, 48], [55, 48]), line([55, 15], [55, 85])],
    ㅕ: [line([22, 35], [55, 35]), line([22, 65], [55, 65]), line([55, 15], [55, 85])],
    ㅗ: [line([50, 22], [50, 65]), line([15, 65], [85, 65])],
    ㅛ: [line([35, 22], [35, 65]), line([65, 22], [65, 65]), line([15, 65], [85, 65])],
    ㅜ: [line([15, 35], [85, 35]), line([50, 35], [50, 80])],
    ㅠ: [line([15, 35], [85, 35]), line([35, 35], [35, 80]), line([65, 35], [65, 80])],
    ㅡ: [line([15, 50], [85, 50])],
    ㅣ: [line([50, 15], [50, 85])],
  };
  const transform = (s, box) =>
    s.map((p) => p.map(([x, y]) => [box[0] + (x * box[2]) / 100, box[1] + (y * box[3]) / 100]));
  const join = (...s) => s.flat();
  const pairs = {
    ㄲ: 'ㄱㄱ',
    ㄸ: 'ㄷㄷ',
    ㅃ: 'ㅂㅂ',
    ㅆ: 'ㅅㅅ',
    ㅉ: 'ㅈㅈ',
    ㄳ: 'ㄱㅅ',
    ㄵ: 'ㄴㅈ',
    ㄶ: 'ㄴㅎ',
    ㄺ: 'ㄹㄱ',
    ㄻ: 'ㄹㅁ',
    ㄼ: 'ㄹㅂ',
    ㄽ: 'ㄹㅅ',
    ㄾ: 'ㄹㅌ',
    ㄿ: 'ㄹㅍ',
    ㅀ: 'ㄹㅎ',
    ㅄ: 'ㅂㅅ',
  };
  for (const [c, p] of Object.entries(pairs))
    shapes[c] = join(transform(shapes[p[0]], [0, 0, 47, 100]), transform(shapes[p[1]], [53, 0, 47, 100]));
  for (const [c, p] of Object.entries({ ㅐ: 'ㅏ', ㅒ: 'ㅑ', ㅔ: 'ㅓ', ㅖ: 'ㅕ' })) {
    shapes[c] = join(transform(shapes[p], [0, 0, 75, 100]), [line([85, 15], [85, 85])]);
  }
  const compounds = {
    ㅘ: ['ㅗ', 'ㅏ'],
    ㅙ: ['ㅗ', 'ㅐ'],
    ㅚ: ['ㅗ', 'ㅣ'],
    ㅝ: ['ㅜ', 'ㅓ'],
    ㅞ: ['ㅜ', 'ㅔ'],
    ㅟ: ['ㅜ', 'ㅣ'],
    ㅢ: ['ㅡ', 'ㅣ'],
  };
  for (const [c, [a, b]] of Object.entries(compounds))
    shapes[c] = join(transform(shapes[a], [0, 28, 58, 72]), transform(shapes[b], [50, 0, 50, 100]));
  const CHO = Array.from('ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ');
  const JUNG = Array.from('ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ');
  const JONG = ['', ...Array.from('ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ')];
  function model(char) {
    if (shapes[char]) return transform(shapes[char], [0, 0, 100, 100]);
    const n = char?.codePointAt(0) - 0xac00;
    if (!Number.isInteger(n) || n < 0 || n >= 11172) return null;
    const a = CHO[Math.floor(n / 588)],
      b = JUNG[Math.floor(n / 28) % 21],
      c = JONG[n % 28];
    const h = c ? 65 : 100;
    let first, vowel;
    if ('ㅗㅛㅜㅠㅡ'.includes(b)) {
      first = [13, 0, 74, h * 0.56];
      vowel = [5, h * 0.52, 90, h * 0.48];
    } else if (compounds[b]) {
      first = [3, 0, 49, h * 0.57];
      vowel = [0, 0, 100, h];
    } else {
      first = [0, 0, 56, h];
      vowel = [51, 0, 49, h];
    }
    return join(
      transform(shapes[a], first),
      transform(shapes[b], vowel),
      c ? transform(shapes[c], [8, 67, 84, 33]) : [],
    );
  }
  const chars = (text) =>
    Array.from(
      String(text || '')
        .normalize('NFC')
        .replace(/\s/g, ''),
    ).slice(0, 48);
  const supported = (text) => chars(text).length > 0 && chars(text).every((c) => model(c));
  const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const length = (p) => p.slice(1).reduce((v, b, i) => v + distance(p[i], b), 0);
  function sample(p, n = 32) {
    if (!p?.length) return Array.from({ length: n }, () => [0, 0]);
    const total = length(p);
    if (!total) return Array.from({ length: n }, () => p[0]);
    const out = [p[0]];
    let at = 1,
      passed = 0;
    for (let i = 1; i < n; i++) {
      const want = (total * i) / (n - 1);
      while (at < p.length - 1 && passed + distance(p[at - 1], p[at]) < want) {
        passed += distance(p[at - 1], p[at]);
        at++;
      }
      const d = distance(p[at - 1], p[at]),
        t = d ? (want - passed) / d : 0;
      out.push([p[at - 1][0] + (p[at][0] - p[at - 1][0]) * t, p[at - 1][1] + (p[at][1] - p[at - 1][1]) * t]);
    }
    return out;
  }
  function strokeError(expected, actual) {
    const a = sample(expected),
      b = sample(actual);
    return a.reduce((sum, p, i) => sum + distance(p, b[i]), 0) / a.length;
  }
  function judge(char, strokes) {
    const expected = model(char);
    if (!expected)
      return {
        supported: false,
        score: 0,
        shape: 0,
        order: false,
        expected: 0,
        actual: strokes?.length || 0,
      };
    const actual = Array.isArray(strokes) ? strokes.map((s) => s.points || s) : [];
    const used = new Set();
    let geometry = 0,
      correct = 0;
    expected.forEach((s, i) => {
      let best = Infinity,
        bestIndex = -1;
      actual.forEach((p, j) => {
        if (used.has(j)) return;
        const e = Math.min(strokeError(s, p), strokeError(s, [...p].reverse()));
        if (e < best) {
          best = e;
          bestIndex = j;
        }
      });
      if (bestIndex >= 0) {
        used.add(bestIndex);
        const ratio =
          Math.min(length(s), length(actual[bestIndex])) / Math.max(1, length(s), length(actual[bestIndex]));
        geometry += Math.max(0, 1 - best / 25) * ratio;
      }
      const p = actual[i];
      if (!p) return;
      const forward = strokeError(s, p),
        reverse = strokeError(s, [...p].reverse());
      const alternative = Math.min(
        ...expected.filter((_, j) => j !== i).map((t) => strokeError(t, p)),
        Infinity,
      );
      // Count, indexed path, direction, coverage and endpoints all matter.
      if (
        forward <= 17 &&
        forward <= reverse + 1 &&
        forward <= alternative + 1.5 &&
        distance(s[0], p[0]) <= 22 &&
        distance(s[s.length - 1], p[p.length - 1]) <= 22 &&
        length(p) >= length(s) * 0.55 &&
        length(p) <= length(s) * 1.8
      )
        correct++;
    });
    const shape = Math.round((100 * geometry) / Math.max(expected.length, actual.length));
    const order = actual.length === expected.length && correct === expected.length;
    return {
      supported: true,
      shape,
      score: order ? shape : 0,
      order,
      correct,
      expected: expected.length,
      actual: actual.length,
    };
  }
  function validateCells(text, cells) {
    const letters = chars(text);
    if (!supported(text) || !Array.isArray(cells) || cells.length !== letters.length)
      throw Error('글자별 획 기록을 확인해 주세요.');
    let count = 0;
    for (const strokes of cells) {
      if (!Array.isArray(strokes) || strokes.length > 64) throw Error('획이 너무 많아요.');
      for (const s of strokes) {
        const p = s?.points || s;
        if (!Array.isArray(p) || p.length < 1 || p.length > 256) throw Error('획 기록이 올바르지 않아요.');
        count += p.length;
        if (count > 24000) throw Error('획 기록이 너무 커요.');
        if (
          p.some(
            (v) =>
              !Array.isArray(v) ||
              v.length !== 2 ||
              v.some((n) => typeof n !== 'number' || !Number.isFinite(n) || n < -30 || n > 130),
          )
        )
          throw Error('좌표가 올바르지 않아요.');
      }
    }
    return cells.map((strokes) =>
      strokes.map((s) => ({
        points: sample(s.points || s, Math.min(128, (s.points || s).length)),
        width: [1, 1.5, 2.2].includes(s.width) ? s.width : 1.5,
      })),
    );
  }
  function judgeText(text, cells) {
    const clean = validateCells(text, cells),
      results = chars(text).map((c, i) => judge(c, clean[i]));
    return {
      shape: Math.round(results.reduce((n, r) => n + r.shape, 0) / results.length),
      order: results.every((r) => r.order),
      passed: results.filter((r) => r.order).length,
      total: results.length,
    };
  }
  const api = {
    model,
    chars,
    supported,
    judge,
    judgeText,
    validateCells,
    sample,
    strokeError,
    CHO,
    JUNG,
    JONG,
  };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.HandwritingCore = Object.freeze(api);
})(typeof window === 'object' ? window : globalThis);
