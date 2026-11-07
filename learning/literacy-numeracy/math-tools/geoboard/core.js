(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Geoboard = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const SIZES = [5, 9];
  const COLORS = ['#287d71', '#ce6248', '#427bb5', '#9565ac', '#b48226'];
  const MAX_BANDS = 24;
  const copy = value => JSON.parse(JSON.stringify(value));
  const same = (a, b) => a.x === b.x && a.y === b.y;
  const cross = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  const on = (a, b, p) => cross(a, b, p) === 0 && p.x >= Math.min(a.x, b.x) && p.x <= Math.max(a.x, b.x) && p.y >= Math.min(a.y, b.y) && p.y <= Math.max(a.y, b.y);
  function intersects(a, b, c, d) {
    const abC = cross(a, b, c), abD = cross(a, b, d), cdA = cross(c, d, a), cdB = cross(c, d, b);
    return (abC * abD < 0 && cdA * cdB < 0) || on(a, b, c) || on(a, b, d) || on(c, d, a) || on(c, d, b);
  }
  function area(points) {
    return Math.abs(points.reduce((sum, a, i) => { const b = points[(i + 1) % points.length]; return sum + a.x * b.y - b.x * a.y; }, 0)) / 2;
  }
  function validPoints(points, size) {
    if (!SIZES.includes(size) || !Array.isArray(points) || points.length < 2 || points.length > size * size) return false;
    if (points.some(p => !p || !Number.isInteger(p.x) || !Number.isInteger(p.y) || p.x < 0 || p.x >= size || p.y < 0 || p.y >= size)) return false;
    if (new Set(points.map(p => `${p.x},${p.y}`)).size !== points.length) return false;
    if (points.length === 2) return true;
    if (!area(points)) return false;
    for (let i = 0; i < points.length; i++) {
      const a = points[i], b = points[(i + 1) % points.length], c = points[(i + 2) % points.length];
      // Collinear corners are fine unless the band doubles back along an edge.
      if (cross(a, b, c) === 0 && (on(a, b, c) || on(b, c, a))) return false;
      for (let j = i + 2; j < points.length; j++) {
        if (i === 0 && j === points.length - 1) continue;
        if (intersects(a, b, points[j], points[(j + 1) % points.length])) return false;
      }
    }
    return true;
  }
  function metrics(points) {
    let length = 0, exact = true;
    const edges = points.length === 2 ? 1 : points.length;
    for (let i = 0; i < edges; i++) {
      const a = points[i], b = points[(i + 1) % points.length];
      const part = Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
      length += part;
      exact = exact && Number.isInteger(part);
    }
    return { area: area(points), length, exact, closed: points.length > 2 };
  }
  function move(points, dx, dy, size) {
    const shiftX = Math.max(-Math.min(...points.map(p => p.x)), Math.min(dx, size - 1 - Math.max(...points.map(p => p.x))));
    const shiftY = Math.max(-Math.min(...points.map(p => p.y)), Math.min(dy, size - 1 - Math.max(...points.map(p => p.y))));
    return points.map(p => ({ x: p.x + shiftX, y: p.y + shiftY }));
  }
  function moveVertex(points, index, point) {
    const next = copy(points);
    if (points.length > 2 && [points[(index + 1) % points.length], points[(index + points.length - 1) % points.length]].some(p => same(p, point))) next.splice(index, 1);
    else next[index] = { ...point };
    return next;
  }
  function initial() {
    return { version: 1, size: 5, scenes: { 5: [], 9: [] }, color: COLORS[0], fill: true, grid: false, area: false, length: false };
  }
  function validate(value) {
    if (!value || value.version !== 1 || !SIZES.includes(value.size) || !COLORS.includes(value.color)) throw Error('저장한 판을 읽을 수 없어요.');
    const state = initial();
    state.size = value.size; state.color = value.color;
    for (const key of ['fill', 'grid', 'area', 'length']) {
      if (typeof value[key] !== 'boolean') throw Error('저장한 판을 읽을 수 없어요.');
      state[key] = value[key];
    }
    const ids = new Set();
    for (const size of SIZES) {
      const bands = value.scenes?.[size];
      if (!Array.isArray(bands) || bands.length > MAX_BANDS) throw Error('저장한 판을 읽을 수 없어요.');
      state.scenes[size] = bands.map(band => {
        if (!band || typeof band.id !== 'string' || !/^[a-z0-9-]{1,60}$/.test(band.id) || ids.has(band.id) || !COLORS.includes(band.color) || typeof band.fill !== 'boolean' || !validPoints(band.points, size)) throw Error('저장한 판을 읽을 수 없어요.');
        ids.add(band.id);
        return { id: band.id, color: band.color, fill: band.fill, points: band.points.map(p => ({ x: p.x, y: p.y })) };
      });
    }
    return state;
  }
  return Object.freeze({ SIZES, COLORS, MAX_BANDS, copy, same, area, metrics, validPoints, move, moveVertex, initial, validate });
});
