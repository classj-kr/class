(function (root) {
  'use strict';
  const Font = typeof module === 'object' && module.exports ? require('./font-source') : root.HandwritingFont;
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
    if (!cache.has(char)) {
      const paths = Font.model(char);
      if (cache.size >= 256) cache.delete(cache.keys().next().value);
      cache.set(char, {
        layout: [100, 0, 80],
        paths,
        contours: paths.flatMap(Font.outlines),
        points: cloud(paths),
      });
    }
    return cache.get(char);
  }
  function shape(char, strokes) {
    const target = glyph(char)?.points;
    if (!target || !strokes.length) return 0;
    const actual = cloud(strokes);
    const near = (p, points) => {
      let d = Infinity;
      for (const q of points) {
        const v = (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2;
        if (v < d) d = v;
      }
      return Math.sqrt(d);
    };
    const score = (d) => Math.max(0, Math.min(1, 1 - (d - 2.8) / 10));
    const precision = actual.reduce((n, p) => n + score(near(p, target)), 0) / actual.length;
    const coverage = target.reduce((n, p) => n + score(near(p, actual)), 0) / target.length;
    return Math.round(100 * (precision * 0.45 + coverage * 0.55));
  }
  const api = {
    glyph,
    has: supported,
    model: Font.model,
    shape,
    layout: (char) => (supported(char) ? [100, 0, 80] : null),
    sample,
    FAMILY: Font.FAMILY,
    VERSION: Font.VERSION,
  };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.HandwritingReference = Object.freeze(api);
})(typeof window === 'object' ? window : globalThis);
