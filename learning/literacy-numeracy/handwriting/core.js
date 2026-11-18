(function (root) {
  'use strict';
  const Font = typeof module === 'object' && module.exports ? require('./font-engine') : root.HandwritingFont;
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
  // 획 위 점을 고르게 뽑아 중심과 퍼진 정도(제곱평균 반지름)를 잰다.
  function spread(paths) {
    const points = paths.flatMap((p) => sample(p, 24));
    if (!points.length) return null;
    const c = [0, 1].map((k) => points.reduce((n, p) => n + p[k], 0) / points.length);
    return { c, r: Math.max(0.5, Math.sqrt(points.reduce((n, p) => n + distance(p, c) ** 2, 0) / points.length)) };
  }
  function align(expected, written) {
    const t = spread(expected),
      a = spread(written);
    if (!t || !a) return written;
    const k = Math.min(2, Math.max(0.5, t.r / a.r));
    return written.map((p) => p.map(([x, y]) => [(x - a.c[0]) * k + t.c[0], (y - a.c[1]) * k + t.c[1]]));
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
    const written = Array.isArray(strokes) ? strokes.map((s) => s.points || s) : [];
    // 획순(순서·방향·길이)은 쓴 글자를 본보기 자리·크기에 맞춰 놓고 본다. 자리와 크기는 모양 점수의 '자리'가 따로 본다.
    // 맞추지 않으면 글자가 작은 줄 공책에서 조금만 비켜 써도 획순이 틀렸다고 나온다.
    const actual = align(expected, written);
    const T = Reference.tolerance,
      G = Reference.glyphSize();
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
      // Count, indexed path, direction, coverage and endpoints all matter. 거리는 글자 높이에 대한 비율(pen-reference.js의 TOL).
      if (
        forward <= T.path * G &&
        forward <= reverse + T.dir * G &&
        forward <= alternative + T.alt * G &&
        distance(s[0], p[0]) <= T.end * G &&
        distance(s[s.length - 1], p[p.length - 1]) <= T.end * G &&
        length(p) >= length(s) * 0.55 &&
        length(p) <= Math.max(length(s) * 2.2, length(s) + T.long * G) // 덧칠은 막되, 짧은 획(i·j의 점, 짧은 삐침)은 조금 끌어도 받는다
      )
        correct++;
    });
    const { shape, form, place } = Reference.measure(char, written);
    const order = actual.length === expected.length && correct === expected.length;
    // 글자 점수: 모양 점수에 획(순서·방향·개수) 점수를 곱한다. 획 하나 틀렸다고 0점이 되지는 않는다.
    // 맞은 획 비율로 40~100%, 획을 더 그었으면 그만큼 더 깎는다.
    const strokeRate = (0.4 + 0.6 * (correct / expected.length)) * Math.min(1, expected.length / Math.max(actual.length, 1));
    return {
      supported: true,
      shape,
      form,
      place,
      score: actual.length ? Math.round(shape * strokeRate) : 0,
      order,
      correct,
      expected: expected.length,
      actual: actual.length,
    };
  }
  // 화면에 보이는 본보기 획 굵기에 맞춘 세 단계. 예전 값(1·1.5·2.2)은 같은 단계로 옮긴다.
  // 줄 공책 한글(경필체 1.9·2.5·3.3, 받아쓰기체 1.5·2.1·2.8), 알파벳 2.4·3.3·4.4,
  // 네모 칸 시절 경필체 2.9·3.9·5.2와 예전 값 3.5·5.5·7.5.
  const PEN_WIDTHS = [1.9, 2.5, 3.3, 1.5, 2.1, 2.8, 2.4, 4.4, 2.9, 3.9, 5.2, 3.5, 5.5, 7.5],
    OLD_PEN_WIDTHS = { 1: 3.5, 1.5: 5.5, 2.2: 7.5 };
  function penWidth(w) {
    return PEN_WIDTHS.includes(w) ? w : OLD_PEN_WIDTHS[w] || 5.5;
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
        points:
          (s.points || s).length > 128 ? sample(s.points || s, 128) : (s.points || s).map((p) => [...p]),
        width: penWidth(s.width),
      })),
    );
  }
  function judgeText(text, cells) {
    const clean = validateCells(text, cells),
      results = chars(text).map((c, i) => judge(c, clean[i]));
    return {
      // 글 전체 점수: 글자 점수의 평균(안 쓴 글자는 0점). 순위전은 이 점수로 순위를 매긴다.
      score: Math.round(results.reduce((n, r) => n + r.score, 0) / results.length),
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
    penWidth,
    sample,
    strokeError,
    CHO,
    JUNG,
    JONG,
  };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.HandwritingCore = Object.freeze(api);
})(typeof window === 'object' ? window : globalThis);
