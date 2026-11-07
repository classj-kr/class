const test = require("node:test"),
  assert = require("node:assert/strict");
const root = "../learning/literacy-numeracy/math-tools/";
const M = require(root + "assets/math.js"),
  N = require(root + "number-line/core.js"),
  K = require(root + "clock/core.js"),
  G = require(root + "geometry-tools/core.js"),
  P = require(root + "pattern-blocks/core.js"),
  A = require(root + "area-lab/core.js"),
  Q = require(root + "measure-lab/core.js"),
  D = require(root + "data-graphs/core.js"),
  R = require(root + "probability/core.js");
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} ≠ ${b}`);
test("number line stores rational ticks exactly, handles negative values and rejects off-grid fractions", () => {
  assert.equal(N.parse("3/4", 4), 3);
  assert.equal(N.parse("-1/2", 10), -5);
  assert.throws(() => N.parse("1/3", 4));
  assert.throws(() => N.parse("1/0", 4));
  const s = M.copy(N.initial);
  N.changeMode(s, "fraction");
  assert.equal(N.label(6, s), "3/2");
  N.validate(s);
  assert.throws(() => N.validate({ ...s, a: 1000 }));
});
test("clock hands remain linked across noon and midnight, including hour-hand fractions", () => {
  assert.deepEqual(K.angles(3 * 3600 + 30 * 60), {
    hour: 105,
    minute: 180,
    second: 0,
  });
  assert.equal(K.format(12 * 3600), "오후 12:00");
  assert.equal(K.format(0), "오전 12:00");
  assert.equal(K.elapsed(23 * 3600 + 55 * 60, 5 * 60), 600);
  assert.equal(K.delta(359, 1), 2);
  assert.equal(K.delta(1, 359), -2);
  assert.equal(K.parts(86460).m, 1);
});
test("ruler coordinate transforms preserve lengths and protractor endpoints show the requested angle", () => {
  const tool = { x: 300, y: 200, angle: 63 },
    p = { x: 70, y: 20 };
  const q = G.world(p, tool),
    r = G.local(q, tool);
  near(r.x, p.x);
  near(r.y, p.y);
  const ends = G.endpoints({ ...G.initial, mode: "ruler", length: 65 });
  near(M.distance(...ends), 325);
  const angle = G.endpoints({ ...G.initial, angle: 90 });
  near(
    (angle[1].x - angle[0].x) * (angle[2].x - angle[0].x) +
      (angle[1].y - angle[0].y) * (angle[2].y - angle[0].y),
    0,
  );
});
test("pattern blocks have correct area ratios; seven tangram pieces fill exactly one square", () => {
  const triangle = M.polygonArea(P.local(P.piece("a", "triangle", 0, 0)));
  for (const [type, ratio] of [
    ["rhombus", 2],
    ["trapezoid", 3],
    ["hexagon", 6],
  ])
    near(M.polygonArea(P.local(P.piece("a", type, 0, 0))) / triangle, ratio);
  assert.equal(
    P.tangram.reduce(
      (s, values) => s + M.polygonArea(values.map(([x, y]) => ({ x, y }))),
      0,
    ),
    16,
  );
  for (const p of P.initial.scenes.tangram) {
    near(
      M.polygonArea(P.points({ ...p, angle: 135, flip: true })),
      M.polygonArea(P.points(p)),
    );
  }
  const p = P.constrain({ ...P.piece("a", "hexagon", 999, 0), angle: 75 });
  assert.ok(
    P.points(p).every(
      (q) => q.x >= 7.99 && q.x <= 992.01 && q.y >= 7.99 && q.y <= 592.01,
    ),
  );
});
test("area rearrangements preserve each rigid piece and duplicate only triangle/trapezoid proofs", () => {
  for (const shape of ["parallelogram", "triangle", "trapezoid", "rhombus"]) {
    const s = { ...A.initial, shape },
      pieces = A.pieces(s),
      total = pieces.reduce((sum, p) => sum + M.polygonArea(p.points), 0);
    near(
      total,
      A.area(s) * (["triangle", "trapezoid"].includes(shape) ? 2 : 1),
    );
    for (const p of pieces)
      for (const t of [0, 0.2, 0.5, 0.8, 1])
        near(M.polygonArea(A.transformed(p, t)), M.polygonArea(p.points));
  }
  const s = { ...A.initial, shape: "triangle", offset: -3 };
  near(A.area(s), 12);
  near(
    A.pieces(s).reduce((n, p) => n + M.polygonArea(p.points), 0),
    24,
  );
  near(A.area({ ...A.initial, shape: "circle", radius: 3 }), Math.PI * 9);
  assert.equal(A.pieces({ ...A.initial, shape: "circle" }).length, 24);
});
test("mass equivalence levels the beam and pouring conserves water at empty/full limits", () => {
  assert.equal(Q.mass([10, 0, 0]), Q.mass([0, 0, 1]));
  assert.equal(Q.tilt([10, 0, 0], [0, 0, 1]), 0);
  assert.ok(Q.tilt([1, 0, 0], [2, 0, 0]) > 0);
  assert.deepEqual(Q.pour([750, 1900], 0, 500, 2000), [650, 2000]);
  assert.deepEqual(Q.pour([0, 500], 0, 100, 2000), [0, 500]);
  assert.deepEqual(Q.pour([50, 0], 0, 250, 2000), [0, 50]);
  assert.equal(Q.liters(1250), "1 L 250 mL");
  assert.equal(Q.grams(1000), "1 kg");
  assert.throws(() => Q.validate({ ...Q.initial, capacity: 1000 }));
});
test("graph totals, mean and shares handle zero data without invalid fractions", () => {
  const rows = D.initial.categories.rows;
  assert.equal(D.total(rows), 24);
  assert.equal(D.mean(rows), 6);
  near(
    D.shares(rows).reduce((a, b) => a + b),
    1,
  );
  assert.deepEqual(D.shares([{ value: 0 }, { value: 0 }]), [0, 0]);
  const axis = D.axis([{ value: 997 }]);
  assert.ok(axis.max >= 997 && axis.step > 0);
  assert.equal(D.data({ ...D.initial, mode: "line" }), D.initial.time);
  assert.throws(() =>
    D.validate({ ...D.initial, categories: { unit: "개", rows: [] } }),
  );
});
test("weighted random sampling uses rejection to avoid modulo bias and accumulates exact counts", () => {
  let source = [4294967295, 5];
  assert.equal(
    R.randomIndex([1, 1, 1, 1, 1, 1], () => source.shift()),
    5,
  );
  for (let ticket = 0; ticket < 8; ticket++)
    assert.equal(
      R.randomIndex([1, 2, 1, 4], () => ticket),
      [0, 1, 1, 2, 3, 3, 3, 3][ticket],
    );
  let n = 0;
  const result = R.sample(R.initial.scenes.coin, 100, () => n++);
  assert.deepEqual(result.counts, [50, 50]);
  assert.equal(R.initial.scenes.coin.counts[0], 0);
  assert.equal(R.midAngle([1, 1, 1, 1], 0), 45);
  assert.equal(R.midAngle([1, 1, 1, 1], 3), 315);
});

const S = require(root + "solid-nets/core.js");
const key = (p) => [p.x, p.y, p.z].map((x) => Math.round(x * 1e7)).join(",");
const faceArea = (f) =>
  f.points
    .slice(1, -1)
    .reduce(
      (sum, p, i) =>
        sum +
        S.length(
          S.cross(S.sub(p, f.points[0]), S.sub(f.points[i + 2], f.points[0])),
        ) /
          2,
      0,
    );
test("all 11 cube nets fold into the same six-face eight-vertex solid with rigid faces", () => {
  assert.equal(S.hexominoes().length, 35);
  assert.equal(S.NETS.length, 11);
  for (let net = 0; net < 11; net++) {
    const closed = S.mesh({ ...S.initial, net });
    assert.equal(closed.length, 6);
    assert.equal(new Set(closed.flatMap((f) => f.points).map(key)).size, 8);
    const edges = new Map();
    for (const f of closed)
      f.points.forEach((p, i) => {
        const edge = [key(p), key(f.points[(i + 1) % 4])].sort().join("|");
        edges.set(edge, (edges.get(edge) || 0) + 1);
      });
    assert.equal(edges.size, 12);
    assert.ok([...edges.values()].every((n) => n === 2));
    for (const fold of [0, 0.25, 0.5, 0.75, 1])
      for (const f of S.mesh({ ...S.initial, net, fold })) near(faceArea(f), 9);
  }
  const box = { ...S.initial, shape: "cuboid", width: 3, depth: 2, height: 4 };
  near(
    S.mesh(box).reduce((n, f) => n + faceArea(f), 0),
    52,
  );
  assert.equal(S.properties(box).volume, 24);
});
test("prism caps close exactly, cylinder circumference unwraps and every view stays finite", () => {
  for (const n of [3, 5, 6]) {
    const s = { ...S.initial, shape: "prism" + n },
      closed = S.mesh(s);
    assert.equal(closed.length, n + 2);
    assert.equal(new Set(closed.flatMap((f) => f.points).map(key)).size, 2 * n);
    for (const fold of [0, 0.3, 0.7, 1])
      S.mesh({ ...s, fold }).forEach((f, i) =>
        near(faceArea(f), faceArea(closed[i])),
      );
  }
  const cylinder = { ...S.initial, shape: "cylinder" },
    flat = S.mesh({ ...cylinder, fold: 0 }),
    closed = S.mesh(cylinder);
  assert.equal(new Set(closed.flatMap((f) => f.points).map(key)).size, 96);
  const sides = flat.slice(0, 48);
  near(
    Math.max(...sides.flatMap((f) => f.points.map((p) => p.x))) -
      Math.min(...sides.flatMap((f) => f.points.map((p) => p.x))),
    2 * Math.PI * cylinder.radius,
  );
  assert.ok(flat.every((f) => f.points.every((p) => Math.abs(p.z) < 1e-8)));
  for (const shape of [
    "cube",
    "cuboid",
    "prism3",
    "prism5",
    "prism6",
    "pyramid3",
    "pyramid4",
    "cylinder",
    "cone",
    "sphere",
  ])
    for (const fold of S.canUnfold(shape) ? [0, 0.1, 0.5, 1] : [1])
      for (const pitch of [-1.4, 0.45, 1.4])
        assert.ok(
          S.project(S.mesh({ ...S.initial, shape, fold }), 2.5, pitch).every(
            (f) =>
              f.points.every(
                (p) => Number.isFinite(p.x) && Number.isFinite(p.y),
              ),
          ),
        );
});
test("malformed saved state cannot introduce invalid values into a manipulative", () => {
  for (const c of [N, K, G, P, A, Q, D, R, S])
    assert.throws(() => c.validate({ ...c.initial, version: 99 }));
  assert.throws(() => S.validate({ ...S.initial, shape: "sphere", fold: 0.5 }));
  assert.throws(() =>
    R.validate({
      ...R.initial,
      scenes: {
        ...R.initial.scenes,
        coin: { weights: [1, 1], counts: [-1, 0], last: null },
      },
    }),
  );
});
