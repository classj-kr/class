(function (root) {
  'use strict';
  const Font = typeof module === 'object' && module.exports ? require('./font-source') : root.HandwritingFont;
  const Reference =
    typeof module === 'object' && module.exports ? require('./pen-reference') : root.HandwritingReference;
  const { CHO, JUNG, JONG } = Font;
  const model = Reference.model;
  const chars = (text) =>
    Array.from(
      String(text || '')
        .normalize('NFC')
        .replace(/\s/g, ''),
    ).slice(0, 48);
  const supported = (text) => chars(text).length > 0 && chars(text).every((c) => Reference.has(c));
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
    let correct = 0;
    expected.forEach((s, i) => {
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
    const shape = Reference.shape(char, actual);
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
