(function (root) {
  'use strict';
  const Font = typeof module === 'object' && module.exports ? require('./font-engine') : root.HandwritingFont;
  const cache = new Map(),
    distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const sample = (p, n = 32) => Font.sample(p, n);
  const supported = (char) => {
    const cp = char?.codePointAt(0);
    return (cp >= 0xac00 && cp <= 0xd7a3) || (cp >= 0x3131 && cp <= 0x3163);
  };
  function cloud(strokes) {
    return strokes.flatMap((s) => {
      const p = s.points || s,
        length = p.slice(1).reduce((n, v, i) => n + distance(p[i], v), 0);
      return sample(p, Math.max(2, Math.min(220, Math.ceil(length) + 1)));
    });
  }
  function glyph(char) {
    if (!supported(char)) return null;
    const key = Font.style() + '|' + char;
    if (!cache.has(key)) {
      const paths = Font.model(char);
      if (cache.size >= 256) cache.delete(cache.keys().next().value);
      cache.set(key, {
        layout: [100, 0, 80],
        paths,
        contours: paths.flatMap(Font.outlines),
        points: cloud(paths),
      });
    }
    return cache.get(key);
  }
  // 중심과 퍼진 정도(제곱평균 반지름)
  function spread(points) {
    const c = [0, 0];
    for (const p of points) { c[0] += p[0]; c[1] += p[1]; }
    c[0] /= points.length; c[1] /= points.length;
    const r = Math.sqrt(points.reduce((n, p) => n + (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2, 0) / points.length);
    return { c, r: Math.max(r, 0.5) };
  }
  const SHIFT_FREE = 8, // 칸(100) 안에서 이만큼 비켜 써도 감점 없음
    SHIFT_ZERO = 20, // 그 뒤로 이만큼 더 비키면 자리 점수 0
    SCALE_FREE = Math.log(1.3), // 30% 크거나 작게 써도 감점 없음
    SCALE_ZERO = Math.log(2);
  // 모양 점수(0~100): 글자를 본보기 크기·자리에 맞춰 놓고 획이 얼마나 겹치는지(모양),
  // 그리고 칸 안에서 크기·자리가 너무 벗어나지 않았는지(자리)를 곱한다.
  // 예전에는 자리를 그대로 비교해서, 모양이 바른 글자도 조금 작거나 비켜 쓰면 크게 깎였다.
  function measure(char, strokes) {
    const target = glyph(char)?.points;
    if (!target || !strokes.length) return { shape: 0, form: 0, place: 0 };
    const raw = cloud(strokes);
    const a = spread(raw), t = spread(target);
    const scale = Math.min(2, Math.max(0.5, t.r / a.r));
    const actual = raw.map((p) => [(p[0] - a.c[0]) * scale + t.c[0], (p[1] - a.c[1]) * scale + t.c[1]]);
    const near = (p, points) => {
      let d = Infinity;
      for (const q of points) {
        const v = (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2;
        if (v < d) d = v;
      }
      return Math.sqrt(d);
    };
    // 획 굵기 안(2.8)은 만점, 8.8 넘게 떨어지면 0점. 크기를 맞춘 뒤라 예전보다 엄하게 본다.
    const score = (d) => Math.max(0, Math.min(1, 1 - (d - 2.8) / 6));
    const precision = actual.reduce((n, p) => n + score(near(p, target)), 0) / actual.length;
    const coverage = target.reduce((n, p) => n + score(near(p, actual)), 0) / target.length;
    const form = precision * 0.5 + coverage * 0.5;
    const shift = Math.hypot(a.c[0] - t.c[0], a.c[1] - t.c[1]);
    const sizeOff = Math.abs(Math.log(a.r / t.r));
    const place = Math.max(0, Math.min(1,
      1 - Math.max(0, shift - SHIFT_FREE) / SHIFT_ZERO - Math.max(0, sizeOff - SCALE_FREE) / (SCALE_ZERO - SCALE_FREE)));
    return { shape: Math.round(100 * form * place), form: Math.round(100 * form), place: Math.round(100 * place) };
  }
  const shape = (char, strokes) => measure(char, strokes).shape;
  const api = {
    glyph,
    has: supported,
    model: Font.model,
    shape,
    measure,
    layout: (char) => (supported(char) ? [100, 0, 80] : null),
    sample,
    FAMILY: Font.FAMILY,
    VERSION: Font.VERSION,
  };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.HandwritingReference = Object.freeze(api);
})(typeof window === 'object' ? window : globalThis);
