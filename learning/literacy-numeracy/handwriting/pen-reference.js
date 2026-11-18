(function (root) {
  'use strict';
  const Font = typeof module === 'object' && module.exports ? require('./font-engine') : root.HandwritingFont;
  const cache = new Map(),
    distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const sample = (p, n = 32) => Font.sample(p, n);
  const supported = (char) => Font.has(char);
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
  // 너그러움은 모두 글자 높이(모형 단위, 한글 약 91·알파벳 70)에 대한 비율이다. 손글씨는 본보기와 똑같을 수 없으므로
  // 사람 손처럼 흔들린 글자로 재서 맞췄다(바르게 쓴 글씨는 100점이 나오고, 흐트러진 글씨는 절반쯤).
  // near·far: 획이 본보기 경로에서 이만큼 안이면 만점, far를 넘으면 0점. full: 모양이 이만큼이면 100점.
  // shiftFree·shiftZero: 글자가 비켜도 감점 없는 거리, 그 뒤로 자리 점수가 0이 되기까지 더 비킬 거리.
  // scaleFree·scaleZero: 이 배율까지 크거나 작아도 그대로, 이 배율이면 자리 점수 0.
  // path·end·dir·alt·long: 획순 검사(core.js) — 경로 평균 거리, 시작·끝 거리, 방향 여유, 다른 획과 헷갈림 여유, 덧칠로 볼 만큼 더 긴 길이.
  const TOL = { near: 0.06, far: 0.15, full: 0.92, shiftFree: 0.22, shiftZero: 0.4, scaleFree: 1.4, scaleZero: 2.3, path: 0.32, end: 0.4, dir: 0.02, alt: 0.08, long: 0.2 };
  const glyphSize = () => (Font.style() === 'alphabet' ? 70 : 91);
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
    const G = glyphSize(),
      near0 = TOL.near * G,
      far = TOL.far * G;
    const score = (d) => Math.max(0, Math.min(1, 1 - (d - near0) / (far - near0)));
    const precision = actual.reduce((n, p) => n + score(near(p, target)), 0) / actual.length;
    const coverage = target.reduce((n, p) => n + score(near(p, actual)), 0) / target.length;
    const form = precision * 0.5 + coverage * 0.5;
    const shift = Math.hypot(a.c[0] - t.c[0], a.c[1] - t.c[1]);
    const sizeOff = Math.abs(Math.log(a.r / t.r));
    const scaleFree = Math.log(TOL.scaleFree),
      scaleZero = Math.log(TOL.scaleZero);
    const place = Math.max(0, Math.min(1,
      1 - Math.max(0, shift - TOL.shiftFree * G) / (TOL.shiftZero * G) - Math.max(0, sizeOff - scaleFree) / (scaleZero - scaleFree)));
    const shown = Math.min(1, form / TOL.full);
    return { shape: Math.round(100 * shown * place), form: Math.round(100 * shown), place: Math.round(100 * place) };
  }
  const shape = (char, strokes) => measure(char, strokes).shape;
  const api = {
    glyph,
    has: supported,
    model: Font.model,
    shape,
    measure,
    tolerance: TOL,
    glyphSize,
    layout: (char) => (supported(char) ? [100, 0, 80] : null),
    sample,
    FAMILY: Font.FAMILY,
    VERSION: Font.VERSION,
  };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.HandwritingReference = Object.freeze(api);
})(typeof window === 'object' ? window : globalThis);
