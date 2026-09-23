import assert from "node:assert/strict";
import test from "node:test";
import { createElementaryGeometryMeasurementSet, createElementarySolidMeasurementBank } from "../lib/elementary-geometry-measurement.ts";
import { createSolidDiagram, fitSolidProjection, type Point3 } from "../lib/elementary-solid-diagrams.ts";

function area(points: Point3[]) {
  const normal = [0, 0, 0];
  points.forEach((a, i) => {
    const b = points[(i + 1) % points.length];
    normal[0] += (a[1] - b[1]) * (a[2] + b[2]);
    normal[1] += (a[2] - b[2]) * (a[0] + b[0]);
    normal[2] += (a[0] - b[0]) * (a[1] + b[1]);
  });
  return Math.hypot(...normal) / 2;
}

test("solid faces and dimension endpoints agree with the answer for varied sizes", () => {
  for (let seed = 0; seed < 100; seed++) {
    for (const problem of createElementaryGeometryMeasurementSet("solid", seed)) {
      const model = createSolidDiagram(problem);
      const visibleArea = model.faces.reduce((sum, face) => sum + area(face.points) - (face.holes ?? []).reduce((holes, points) => holes + area(points), 0), 0);
      // A closed solid has equally sized opposing faces in each axis, including the cut's new faces.
      assert.equal(visibleArea * (problem.kind === "open-box" ? 1 : 2), problem.first, `${seed}: ${problem.kind} surface`);
      const project = fitSolidProjection(model.faces);
      for (const face of model.faces) {
        assert.ok(area(face.points) > 0);
        face.points.forEach((point, i) => {
          const next = face.points[(i + 1) % face.points.length];
          assert.equal(point.filter((value, axis) => value !== next[axis]).length, 1, "edges follow a single spatial axis");
        });
      }
      for (const measure of model.measures) {
        assert.equal(Math.hypot(...measure.from.map((value, axis) => value - measure.to[axis])), measure.value);
        for (const point of [measure.from, measure.to]) {
          const [x, y] = project(point);
          assert.ok(x + measure.offset[0] >= 0 && x + measure.offset[0] <= 340);
          assert.ok(y + measure.offset[1] >= 0 && y + measure.offset[1] <= 200);
        }
      }
    }
  }
});

test("volume answers match an independent count of half-centimetre cells", () => {
  for (let seed = 0; seed < 16; seed++) {
    for (const problem of createElementaryGeometryMeasurementSet("solid", seed)) {
      const d = problem.dimensions;
      const points = createSolidDiagram(problem).faces.flatMap(face => face.points);
      const max = [0, 1, 2].map(axis => Math.max(...points.map(point => point[axis])));
      let cells = 0;
      for (let x = 0.25; x < max[0]; x += 0.5) for (let y = 0.25; y < max[1]; y += 0.5) for (let z = 0.25; z < max[2]; z += 0.5) {
        const inSolid = problem.cubes ? problem.cubes.some(([cx,cy,cz]) => x > cx*d.side && x < (cx+1)*d.side && y > cy*d.side && y < (cy+1)*d.side && z > cz*d.side && z < (cz+1)*d.side) : problem.kind === "corner-cut-cube"
          ? !(x > d.side - d.removedSide && y > d.side - d.removedSide && z > d.side - d.removedSide)
          : problem.kind === "stacked-prisms"
            ? z < d.baseHeight || (Math.abs(x - d.baseLength / 2) < d.topLength / 2 && Math.abs(y - d.baseWidth / 2) < d.topWidth / 2)
            : problem.kind === "l-stacked-cubes"
              ? x < d.side || z < d.side
              : true;
        if (inSolid) cells++;
      }
      assert.equal(cells / 8, problem.second, `${seed}: ${problem.kind} volume`);
    }
  }
});

test("stacked prisms expose six separate measurements and the cut exposes three new faces", () => {
  const problems = createElementarySolidMeasurementBank(20260823);
  assert.equal(createSolidDiagram(problems[2]).measures.length, 6);
  assert.equal(createSolidDiagram(problems[3]).faces.length, 6);
  assert.equal(createSolidDiagram(problems[1]).seams.length, 2);
});

test("three joined cubes have an L profile, not a single cuboid", () => {
  const problem = createElementarySolidMeasurementBank(20260823)[1];
  const model = createSolidDiagram(problem);
  const s = problem.dimensions.side;
  assert.equal(problem.kind, "l-stacked-cubes");
  const front = model.faces.find(face => face.points.every(([, y]) => y === s))!;
  assert.equal(front.points.length, 6, "front outline includes the step");
  assert.equal(area(front.points), 3 * s ** 2);
  assert.equal(problem.second, 3 * s ** 3);
  assert.notEqual(problem.second, 2 * s * s * 2 * s, "upper-right cube is absent");
  const sharedFaces = 2;
  assert.equal(problem.first, (3 * 6 - 2 * sharedFaces) * s ** 2);
});
