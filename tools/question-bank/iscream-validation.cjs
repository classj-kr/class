'use strict';
// 문항 제작 코드와 별개로 조합·최적화·경계 조건을 전수 탐색한다. 유사 문제 생성에도 같은 검사를 쓴다.
const assert = require('node:assert/strict');
const sum = a => a.reduce((x, y) => x + y, 0);
const combinations = (a, k) => {
  const out = [];
  const visit = (i, selected) => { if (selected.length === k) { out.push(selected); return; } for (let j = i; j < a.length; j++) visit(j + 1, selected.concat([a[j]])); };
  visit(0, []); return out;
};
const subsets = a => Array.from({ length: 2 ** a.length }, (_, mask) => a.filter((_, i) => mask & (1 << i)));
function expected(f, item) {
  switch (f.kind) {
    case 'avatar-budget': return [Math.min(...f.costs.map(x => f.budget - sum(f.chosen) - x).filter(x => x >= 0))];
    case 'cones-gap': return [sum(Array.from({ length: f.n - 1 }, () => f.gap))];
    case 'trip-schedule': {
      let seconds = f.start * 3600;
      for (const t of f.times) seconds += t + f.move * 60;
      seconds += f.move * 60;
      return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60];
    }
    case 'nested-parts': {
      const cells = f.pieces.flat(), keys = new Set(cells.map(([x, y]) => x + ',' + y)), side = 2 ** (f.depth + 1);
      assert.equal(keys.size, cells.length); assert.equal(f.pieces.length, 4 ** f.depth);
      for (let x = 0; x < side; x++) for (let y = 0; y < side; y++) assert.equal(keys.has(x + ',' + y), x < side / 2 || y < side / 2);
      for (const piece of f.pieces) { assert.equal(piece.length, 3); assert.equal(Math.max(...piece.map(p => p[0])) - Math.min(...piece.map(p => p[0])), 1); assert.equal(Math.max(...piece.map(p => p[1])) - Math.min(...piece.map(p => p[1])), 1); }
      assert.equal([...item.figure.matchAll(/fill="#93c5fd"/g)].length, f.colored * 3);
      return [f.colored / f.pieces.length];
    }
    case 'robot-route': case 'robot-correct': {
      let rest = f.a, down = 0; while (rest >= f.divisor) { rest -= f.divisor; down++; }
      if (f.kind === 'robot-correct') { assert.ok(f.proposed[1] >= f.divisor); assert.equal(f.proposed[0] * f.divisor + f.proposed[1], f.a); }
      const x = f.start[0] - rest, y = f.start[1] + down;
      assert.ok(x >= 1 && x <= f.width && y >= 1 && y <= 8); return [(y - 1) * f.width + x];
    }
    case 'circle-band': return [f.distances.filter(x => x * x > f.inner * f.inner && x * x < f.outer * f.outer).length];
    case 'circle-meeting': {
      const valid = f.points.map((p, i) => f.centers.every((c, j) => Math.hypot(p[0] - c[0], p[1] - c[1]) < f.radii[j]) ? i + 1 : null).filter(Boolean);
      assert.equal(valid.length, 1); return valid;
    }
    case 'game-gems': {
      const costs = f.fractions.map(([a, b]) => f.total / b * a), valid = combinations(costs, 3).filter(a => sum(a) < f.total);
      assert.equal(valid.length, 1, '체력을 남기는 세 보석의 조합이 하나여야 한다'); return [sum(valid[0])];
    }
    case 'game-refill': {
      const valid = combinations(f.amounts, 2).filter(a => sum(a) + f.current === f.total);
      assert.equal(valid.length, 1); return [Math.max(...valid[0])];
    }
    case 'donation-transfer': {
      const valid = subsets(f.weights).map(sum).filter(x => f.a - x <= f.cap && f.b + x <= f.cap);
      assert.equal(valid.length, 1, '옮길 물건의 조합이 하나여야 한다'); const weight = f.a - valid[0];
      return [Math.floor(weight / 1000), weight % 1000];
    }
    case 'map-turn': {
      const solutions = []; for (let a = 1; a < 90; a++) if ((f.left - f.right + a) % 360 === 90) solutions.push(a);
      assert.equal(solutions.length, 1); return solutions;
    }
    case 'footprint-choice': return [Math.min(...f.rows.map(r => sum(r) * f.serving))];
    case 'saving-series': { let saved = 0, amount = f.first; for (let i = 0; i < f.days; i++) { saved += amount; amount += f.step; } return [saved]; }
    case 'orders-rest': case 'orders-short': {
      let stock = f.stock; for (let n = 0; n < f.count; n++) stock -= f.per / f.den;
      return [f.shortage ? f.per / f.den - stock : stock];
    }
    case 'nutrition-limit': return [(f.values[0] + f.values[1] + f.values[2] - f.limits[0]) / 10, (f.values[3] + f.values[4] + f.values[2] - f.limits[1]) / 10];
    case 'fire-rope': return [(sum(f.heights) + f.door) / 10];
    case 'pipe-turns': return [sum(f.current.map((x, i) => { let turns = 0; while (x !== f.targets[i]) { x = (x + 1) % 4; turns++; } return turns; }))];
    case 'survival-weight': return [f.cap - sum(f.totals.map((x, i) => sum(Array.from({ length: f.counts[i] }, () => x / f.packs[i]))))];
    case 'parade-rows': return [f.classes * f.each, f.girls].map(total => { let ways = 0; for (let rows = 1; rows <= total; rows++) if (Number.isInteger(total / rows)) ways++; return ways; });
    case 'dotted-note': return [1.5 / f.den];
    case 'measure-fill': return [f.beats - (4 + f.quarters) / 4];
    case 'park-min-perimeter': {
      let best = Infinity;
      for (let w = f.step; w <= f.area; w += f.step) for (let h = f.step; h * w <= f.area; h += f.step) if (w * h === f.area) best = Math.min(best, w + h + w + h);
      assert.ok(Number.isFinite(best)); return [best];
    }
    case 'park-max-area': {
      let best = 0;
      for (let w = f.step; w < f.perimeter / 2; w += f.step) for (let h = f.step; h < f.perimeter / 2; h += f.step) if (w + h + w + h === f.perimeter) best = Math.max(best, w * h);
      return [best];
    }
    case 'parcel-two-rules': return [sum(f.rows.map(([weight, ...dims]) => {
      const size = sum(dims), allowed = f.fees.filter((_, i) => weight <= f.weights[i] && size <= f.sizes[i]);
      assert.ok(allowed.length); return Math.min(...allowed);
    }))];
    case 'vote-minimum': {
      const possible = [];
      for (let attendance = 0; attendance <= f.members; attendance++) if (attendance * 2 > f.members) for (let votes = 0; votes <= attendance; votes++) if (votes * 3 > attendance * 2) possible.push(votes);
      return [Math.min(...possible)];
    }
    case 'meal-energy': return [f.target - sum(f.energy.map((e, i) => e * f.amount[i]))];
    case 'tare-fraction': return [(f.gross - f.tare * f.boxes) / (f.den * f.boxes * f.each)];
    case 'exercise-rate': {
      let best = 0;
      for (let i = 1; i < f.times.length; i++) if ((f.totals[i] * f.times[best] > f.totals[best] * f.times[i]) === f.max) best = i;
      return [f.totals[best] / f.times[best]];
    }
    case 'energy-saving': return [sum(f.saved) * 100 / f.previous];
    case 'package-surface': {
      const [a, b, c] = f.dims, one = 2 * (a * b + b * c + c * a);
      const surfaces = f.configs.map(([x, y, z]) => one * x * y * z - 2 * ((x - 1) * y * z * b * c + x * (y - 1) * z * a * c + x * y * (z - 1) * a * b));
      return [Math.abs(surfaces[0] - surfaces[1])];
    }
    case 'fuel-saving': return [f.distance100 / 10 * (f.rates10[1] - f.rates10[0]) / (f.rates10[0] * f.rates10[1])];
    case 'blocks-add': {
      let possible = new Set([JSON.stringify(f.base)]);
      for (let n = 0; n < f.addCount; n++) {
        const next = new Set();
        for (const shape of possible) for (let cell = 0; cell < 4; cell++) { const h = JSON.parse(shape); h[Math.floor(cell / 2)][cell % 2]++; next.add(JSON.stringify(h)); }
        possible = next;
      }
      return [f.targets.filter(h => possible.has(JSON.stringify(h))).length];
    }
    case 'recipe-scale-share': return [f.staple / f.original * f.servings, f.vegetable * f.servings * f.ratio[0] / (f.original * sum(f.ratio)), f.vegetable * f.servings * f.ratio[1] / (f.original * sum(f.ratio))];
    case 'pizza-area': return [Math.abs(sum(f.diameters.map((d, i) => (i ? -1 : 1) * d * d * f.counts[i] * f.pi100 / 400)))];
    case 'solid-view-circles': return [sum(f.counts.map((n, i) => Array.from({ length: n }, () => i === 2 ? ['원', '원', '원'] : ['원', i ? '삼각형' : '직사각형', i ? '삼각형' : '직사각형']).flat().filter(x => x === '원').length))];
    default: throw new Error('독립 검사가 없는 유형: ' + f.kind);
  }
}
function validate(item) {
  const f = item.facts?.iscream;
  if (!f) return;
  assert.ok(!item.choice && item.inputs?.length, '새 문항은 단답형이다');
  const raw = item.inputs.map(x => x.answer), actual = item.fraction ? [(item.mixed ? raw[0] : 0) + raw.at(-2) / raw.at(-1)] : raw, want = expected(f, item);
  assert.equal(actual.length, want.length, f.kind);
  actual.forEach((n, i) => assert.ok(Number.isFinite(n) && Math.abs(n - want[i]) < 1e-7, `${f.kind}: 답 ${actual}, 독립 계산 ${want}`));
}
module.exports = { validate, expected };
