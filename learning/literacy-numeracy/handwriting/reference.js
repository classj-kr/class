(function (root) {
  'use strict';
  const server = typeof module === 'object' && module.exports;
  const data = server ? require('./reference-data') : root.HandwritingReferenceData;
  const topology = server ? require('./stroke-topology') : root.HandwritingStrokeTopology;
  const cache = new Map();
  function record(char) {
    const cp = char?.codePointAt(0);
    return cp >= 0xac00 && cp <= 0xd7a3
      ? data[cp - 0xac00]
      : cp >= 0x3131 && cp <= 0x3163
        ? data[11172 + cp - 0x3131]
        : null;
  }
  const has = (char) => Boolean(record(char));
  const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  function sample(p, n = 32) {
    const lengths = [0];
    for (let i = 1; i < p.length; i++) lengths.push(lengths.at(-1) + distance(p[i - 1], p[i]));
    const total = lengths.at(-1);
    if (!total) return Array.from({ length: n }, () => p[0]);
    let j = 1;
    return Array.from({ length: n }, (_, i) => {
      const d = (i / (n - 1)) * total;
      while (j < p.length - 1 && lengths[j] < d) j++;
      const t = (d - lengths[j - 1]) / (lengths[j] - lengths[j - 1] || 1);
      return [p[j - 1][0] + (p[j][0] - p[j - 1][0]) * t, p[j - 1][1] + (p[j][1] - p[j - 1][1]) * t];
    });
  }
  function centerline(guide, cloud, fallback) {
    if (cloud.length < 2) return guide;
    const a = guide[0],
      b = guide.at(-1),
      span = distance(a, b);
    if (span) {
      const u = [(b[0] - a[0]) / span, (b[1] - a[1]) / span],
        v = [-u[1], u[0]];
      const along = (p) => (p[0] - a[0]) * u[0] + (p[1] - a[1]) * u[1];
      const across = (p) => (p[0] - a[0]) * v[0] + (p[1] - a[1]) * v[1];
      // A crossing can assign part of the neighbouring stroke to a short line.
      // Fit its dominant axis instead of treating that overlap as a pen detour.
      const walk = fallback.slice(1).reduce((n, p, i) => n + distance(p, fallback[i]), 0);
      const chord = distance(fallback[0], fallback.at(-1));
      if (walk > chord * 1.3 && guide.every((p) => Math.abs(across(p)) < 1.5)) {
        const offsets = cloud.map(across).sort((x, y) => x - y),
          offset = offsets[Math.floor(offsets.length / 2)];
        const positions = cloud.filter((p) => Math.abs(across(p) - offset) <= 3.2).map(along);
        if (positions.length > 1) {
          return sample(
            [Math.min(...positions), Math.max(...positions)].map((t) => [
              a[0] + t * u[0] + offset * v[0],
              a[1] + t * u[1] + offset * v[1],
            ]),
          );
        }
      }
    }
    const smooth = fallback.map((p, i) =>
      i === 0 || i === fallback.length - 1
        ? p
        : [
            (fallback[i - 1][0] + 2 * p[0] + fallback[i + 1][0]) / 4,
            (fallback[i - 1][1] + 2 * p[1] + fallback[i + 1][1]) / 4,
          ],
    );
    return smooth.length > 1 ? sample(smooth) : guide;
  }
  function glyph(char) {
    if (cache.has(char)) return cache.get(char);
    const r = record(char);
    if (!r) return null;
    const bytes = server ? Buffer.from(r[3], 'base64') : Uint8Array.from(atob(r[3]), (c) => c.charCodeAt(0)),
      points = [];
    for (let i = 0; i < 1024; i++)
      if (bytes[i >> 3] & (128 >> (i & 7)))
        points.push([(((i % 32) + 0.5) * 100) / 32, ((Math.floor(i / 32) + 0.5) * 100) / 32]);
    const proto = topology.model(char),
      all = proto.flat();
    const left = Math.min(...all.map((p) => p[0])),
      top = Math.min(...all.map((p) => p[1])),
      right = Math.max(...all.map((p) => p[0])),
      bottom = Math.max(...all.map((p) => p[1]));
    const cloudLeft = Math.min(...points.map((p) => p[0])),
      cloudTop = Math.min(...points.map((p) => p[1])),
      cloudRight = Math.max(...points.map((p) => p[0])),
      cloudBottom = Math.max(...points.map((p) => p[1]));
    const aligned = proto.map((s) =>
      s.map((p) => [
        cloudLeft + ((p[0] - left) / (right - left || 1)) * (cloudRight - cloudLeft),
        cloudTop + ((p[1] - top) / (bottom - top || 1)) * (cloudBottom - cloudTop),
      ]),
    );
    const guides = aligned.map((s) => sample(s)),
      bins = guides.map(() => Array.from({ length: 32 }, () => []));
    for (const point of points) {
      let best = Infinity,
        stroke = 0,
        at = 0;
      guides.forEach((s, j) =>
        s.forEach((v, i) => {
          const d = (point[0] - v[0]) ** 2 + (point[1] - v[1]) ** 2;
          if (d < best) {
            best = d;
            stroke = j;
            at = i;
          }
        }),
      );
      bins[stroke][at].push(point);
    }
    const paths = bins.map((slots, j) => {
      const result = [];
      slots.forEach((items, i) => {
        if (items.length)
          result.push([
            items.reduce((n, p) => n + p[0], 0) / items.length,
            items.reduce((n, p) => n + p[1], 0) / items.length,
          ]);
      });
      return centerline(guides[j], slots.flat(), result);
    });
    const result = { layout: r.slice(0, 3), points, paths };
    if (cache.size >= 256) cache.delete(cache.keys().next().value);
    cache.set(char, result);
    return result;
  }
  function model(char) {
    return glyph(char)?.paths.map((s) => s.map((p) => [...p])) || null;
  }
  function shape(char, strokes) {
    const target = glyph(char)?.points;
    if (!target || !strokes.length) return 0;
    const actual = strokes.flatMap((s) => sample(s.points || s));
    if (!actual.length) return 0;
    const near = (p, cloud) => {
      let d = Infinity;
      for (const q of cloud) {
        const n = (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2;
        if (n < d) d = n;
      }
      return Math.sqrt(d);
    };
    const score = (d) => Math.max(0, Math.min(1, 1 - (d - 3) / 10));
    const precision = actual.reduce((n, p) => n + score(near(p, target)), 0) / actual.length;
    const coverage = target.reduce((n, p) => n + score(near(p, actual)), 0) / target.length;
    return Math.round(100 * (precision * 0.45 + coverage * 0.55));
  }
  const api = {
    glyph,
    has,
    model,
    shape,
    layout: (char) => record(char)?.slice(0, 3),
    sample,
    FAMILY: 'Hakgyoansim Badasseugi Light',
    VERSION: 3,
  };
  if (server) module.exports = api;
  else root.HandwritingReference = Object.freeze(api);
})(typeof window === 'object' ? window : globalThis);
