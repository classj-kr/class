/* Bounded numerical analysis. Results are approximations, never symbolic proofs. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.GraphAnalysis = api;
})(typeof window === 'undefined' ? globalThis : window, function () {
  'use strict';
  const finite = Number.isFinite;
  function value(fn, x) { try { return fn(x); } catch { return NaN; } }
  function tangent(fn, x) {
    const y = value(fn, x);
    if (!finite(y)) return { ok: false, reason: '이 점에서 함수가 정의되지 않아요.' };
    const base = Math.max(1, Math.abs(x)) * .001;
    let previous = null, last = null;
    for (let i = 0; i < 6; i++) {
      const h = base / 4 ** i, left = value(fn, x - h), right = value(fn, x + h);
      if (![left, right].every(finite)) return { ok: false, reason: '양쪽의 변화율을 확인할 수 없어 접선을 표시하지 않아요.' };
      const l = (y - left) / h, r = (right - y) / h, slope = (l + r) / 2;
      if (![l, r, slope].every(finite)) break;
      if (previous) {
        const extrapolatedLeft = (4 * l - previous.l) / 3;
        const extrapolatedRight = (4 * r - previous.r) / 3;
        const tolerance = 2e-5 * Math.max(1, Math.abs(slope));
        last = { x, y, slope, ok: Math.abs(extrapolatedLeft - extrapolatedRight) < tolerance && Math.abs(slope - previous.slope) < tolerance };
      }
      previous = { l, r, slope };
    }
    return last?.ok ? last : { ok: false, reason: '이 점에서는 안정적인 미분계수를 확인할 수 없어요.' };
  }
  function intersections(first, second, min, max) {
    if (![min, max].every(finite) || max <= min) return { points: [], overlap: false, limited: false };
    const count = 1024, step = (max - min) / count;
    const diff = x => value(first, x) - value(second, x);
    const xs = Array.from({ length: count + 1 }, (_, i) => min + i * step), ys = xs.map(diff), points = [];
    let overlap = false, zeros = 0, limited = false;
    for (const y of ys) { zeros = y === 0 ? zeros + 1 : 0; if (zeros >= 5) overlap = true; }
    if (overlap) return { points: [], overlap: true, limited: false };
    function continuous(fn, x, center) {
      for (let i = 0; i < 4; i++) {
        const h = Math.max((max - min) * 1e-5 / 10 ** i, Number.EPSILON * Math.max(1, Math.abs(x)) * 8);
        const sides = [value(fn, x - h), value(fn, x + h)].filter(finite);
        if (sides.length && sides.every(y => Math.abs(y - center) <= .01 * Math.max(1, Math.abs(center), Math.abs(y)))) return true;
      }
      return false;
    }
    function accept(x) {
      const a = value(first, x), b = value(second, x);
      if (![a, b].every(finite) || Math.abs(a - b) > 32 * Number.EPSILON * Math.max(1, Math.abs(a), Math.abs(b))) return;
      if (!continuous(first, x, a) || !continuous(second, x, b)) return;
      if (points.some(p => Math.abs(p.x - x) < Math.max(1e-8, (max - min) * 1e-7))) return;
      if (points.length >= 64) { limited = true; return; }
      points.push({ x, y: (a + b) / 2 });
    }
    function bisect(left, right, fl) {
      for (let i = 0; i < 70; i++) {
        const mid = (left + right) / 2, fm = diff(mid);
        if (!finite(fm)) return;
        if (fm === 0 || mid === left || mid === right) { accept(mid); return; }
        if (Math.sign(fm) === Math.sign(fl)) { left = mid; fl = fm; } else right = mid;
      }
      accept((left + right) / 2);
    }
    function touching(left, right) {
      // Minimize |f-g| to include tangent contacts with no sign change.
      const ratio = (Math.sqrt(5) - 1) / 2;
      let a = right - ratio * (right - left), b = left + ratio * (right - left), fa = Math.abs(diff(a)), fb = Math.abs(diff(b));
      for (let i = 0; i < 75; i++) {
        if (![fa, fb].every(finite)) return;
        if (fa < fb) { right = b; b = a; fb = fa; a = right - ratio * (right - left); fa = Math.abs(diff(a)); }
        else { left = a; a = b; fa = fb; b = left + ratio * (right - left); fb = Math.abs(diff(b)); }
      }
      accept(fa < fb ? a : b);
    }
    for (let i = 0; i <= count; i++) {
      if (ys[i] === 0) accept(xs[i]);
      if (i && finite(ys[i - 1]) && finite(ys[i]) && ys[i - 1] !== 0 && ys[i] !== 0 && Math.sign(ys[i - 1]) !== Math.sign(ys[i])) bisect(xs[i - 1], xs[i], ys[i - 1]);
      if (i > 0 && i < count && finite(ys[i - 1]) && finite(ys[i]) && finite(ys[i + 1]) && Math.abs(ys[i]) < Math.abs(ys[i - 1]) && Math.abs(ys[i]) < Math.abs(ys[i + 1])) touching(xs[i - 1], xs[i + 1]);
      if (limited) break;
    }
    return { points: points.sort((a, b) => a.x - b.x), overlap, limited };
  }
  function integrate(fn, from, to) {
    const invalid = reason => ({ ok: false, reason });
    if (![from, to].every(finite)) return invalid('시작과 끝에 유한한 숫자를 입력하세요.');
    if (from === to) return finite(value(fn, from)) ? { ok: true, signed: 0, area: 0, estimatedError: 0 } : invalid('구간에서 함수가 정의되지 않아요.');
    const left = Math.min(from, to), right = Math.max(from, to), orientation = from <= to ? 1 : -1;
    let evaluations = 0, failed = false;
    const cache = new Map();
    function at(x) {
      if (cache.has(x)) return cache.get(x);
      if (++evaluations > 24000) { failed = true; return NaN; }
      const y = value(fn, x); if (!finite(y)) failed = true; cache.set(x, y); return y;
    }
    function simpson(a, b, fa, fm, fb) { const factor = (b - a) / 6; return [factor * (fa + 4 * fm + fb), factor * (Math.abs(fa) + 4 * Math.abs(fm) + Math.abs(fb))]; }
    function recurse(a, b, fa, fm, fb, whole, tolerance, depth) {
      if (failed) return [0, 0, 0];
      tolerance = Math.max(tolerance, 1e-12 / 24);
      const m = (a + b) / 2, fl = at((a + m) / 2), fr = at((m + b) / 2);
      if (failed) return [0, 0, 0];
      const l = simpson(a, m, fa, fl, fm), r = simpson(m, b, fm, fr, fb);
      const delta = [l[0] + r[0] - whole[0], l[1] + r[1] - whole[1]], error = Math.max(...delta.map(Math.abs)) / 15;
      if (error <= tolerance) {
        // A second, nonuniform quadrature rule avoids accepting aliased oscillations.
        const half = (b - a) / 2, offset = half * Math.sqrt(3 / 5), g0 = at(m - offset), g1 = at(m + offset);
        const gauss = [half * (5 * g0 + 8 * fm + 5 * g1) / 9, half * (5 * Math.abs(g0) + 8 * Math.abs(fm) + 5 * Math.abs(g1)) / 9];
        const corrected = [l[0] + r[0] + delta[0] / 15, l[1] + r[1] + delta[1] / 15];
        if (!failed && corrected.every((v, i) => Math.abs(v - gauss[i]) <= tolerance * 4 + Number.EPSILON * Math.abs(v) * 32)) return [...corrected, error];
      }
      if (depth >= 20 || m === a || m === b) { failed = true; return [0, 0, 0]; }
      const x = recurse(a, m, fa, fl, fm, l, tolerance / 2, depth + 1), y = recurse(m, b, fm, fr, fb, r, tolerance / 2, depth + 1);
      return x.map((v, i) => v + y[i]);
    }
    const panels = 24, width = (right - left) / panels;
    let signed = 0, area = 0, error = 0;
    for (let i = 0; i < panels; i++) {
      const a = left + i * width, b = i === panels - 1 ? right : left + (i + 1) * width, fa = at(a), fm = at((a + b) / 2), fb = at(b);
      // Off-grid probes catch undefined points without assuming endpoint samples suffice.
      at(a + (b - a) * .3819660112501051);
      if (failed) break;
      const whole = simpson(a, b, fa, fm, fb), result = recurse(a, b, fa, fm, fb, whole, 1e-8 / panels, 0);
      signed += result[0]; area += result[1]; error += result[2];
      if (failed) break;
    }
    if (failed || error > 2e-8 || ![signed, area, error].every(finite)) return invalid('정의되지 않는 점이 있거나 수렴을 확인할 수 없는 구간이에요. 구간을 나누어 살펴보세요.');
    return { ok: true, signed: orientation * signed, area: Math.max(0, area), estimatedError: error };
  }
  return { tangent, intersections, integrate };
});
