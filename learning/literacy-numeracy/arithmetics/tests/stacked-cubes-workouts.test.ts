import assert from "node:assert/strict";
import test from "node:test";

import { computeViews, createStackedCubesProblemSet, sameViewGrids } from "../lib/stacked-cubes-workouts.ts";
import { isStackDiagramClear, stackDiagramFaces, type StackPoint } from "../lib/stacked-cubes-geometry.ts";

test("problem set always has 10 problems in a fixed kind order with positive totals matching their height grids", () => {
  for (let seed = 1; seed <= 30; seed += 1) {
    const set = createStackedCubesProblemSet(seed);
    assert.deepEqual(set.problems.map(({ kind }) => kind), [
      "three-view", "three-view",
      "count", "count", "count", "count",
      "count-map", "count-map", "count-map", "count-map",
    ]);
    for (const problem of set.problems) {
      const summed = problem.heights.reduce((sum, row) => sum + row.reduce((a, b) => a + b, 0), 0);
      assert.equal(problem.total, summed);
      assert.ok(problem.total > 0, `${problem.id}: total must be positive`);
      assert.equal(problem.heights.length, problem.size);
      assert.ok(problem.heights.every((row) => row.length === problem.size));
    }
  }
});

test("same seed produces the same problem set", () => {
  const a = createStackedCubesProblemSet(777);
  const b = createStackedCubesProblemSet(777);
  assert.deepEqual(a, b);
});

test("top view marks exactly the occupied footprint cells", () => {
  const heights = [
    [0, 2, 0],
    [1, 3, 1],
    [0, 1, 0],
  ];
  const views = computeViews(heights, 3);
  assert.deepEqual(views.top, [
    [false, true, false],
    [true, true, true],
    [false, true, false],
  ]);
});

test("front view collapses each column to its tallest cube, bottom-aligned", () => {
  const heights = [
    [0, 2, 0],
    [1, 3, 1],
    [0, 1, 0],
  ];
  const views = computeViews(heights, 3);
  // column heights: [1, 3, 1] -> bottom-aligned bars in a 3-row grid
  assert.deepEqual(views.front, [
    [false, true, false],
    [false, true, false],
    [true, true, true],
  ]);
});

test("side view collapses each row to its tallest cube, bottom-aligned", () => {
  const heights = [
    [0, 2, 0],
    [1, 3, 1],
    [0, 1, 0],
  ];
  const views = computeViews(heights, 3);
  // 오른쪽 옆에서 본 모습: 앞쪽(r=2, 높이 1), 가운데(r=1, 높이 3), 뒤쪽(r=0, 높이 2) -> [1, 3, 2]
  assert.deepEqual(views.side, [
    [false, true, false],
    [false, true, true],
    [true, true, true],
  ]);
});

test("sameViewGrids compares grids by value", () => {
  const a = [[true, false], [false, true]];
  const b = [[true, false], [false, true]];
  const c = [[true, true], [false, true]];
  assert.equal(sameViewGrids(a, b), true);
  assert.equal(sameViewGrids(a, c), false);
});

test("a footprint does not excuse a concealed column top", () => {
  const hiddenColumn = [[1, 3, 0], [3, 3, 0], [0, 0, 0]];
  assert.equal(isStackDiagramClear(hiddenColumn), false);
  assert.equal(isStackDiagramClear(hiddenColumn, true), false);
  // A nearly concealed top is also rejected: a tiny visible sliver is not
  // enough for children to read reliably on the printed worksheet.
  assert.equal(isStackDiagramClear([[2, 3, 0], [3, 3, 0], [0, 0, 0]], true), false);
});

test("hidden empty positions need a footprint even when every column top is visible", () => {
  const hiddenFloor = [[0, 3, 0], [3, 3, 0], [0, 0, 0]];
  assert.equal(isStackDiagramClear(hiddenFloor), false);
  assert.equal(isStackDiagramClear(hiddenFloor, true), true);
  const staircase = [[3, 2, 1], [2, 1, 0], [1, 0, 0]];
  assert.equal(isStackDiagramClear(staircase), true);
  assert.equal(isStackDiagramClear([[3, 3, 3], [3, 3, 3], [3, 3, 3]]), true);
});

// Independent point-in-polygon check of the painter's actual final surface.
// This exercises the visibility result without reusing its clipping algorithm.
function inside([x, y]: StackPoint, polygon: StackPoint[]) {
  let result = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i], [xj, yj] = polygon[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) result = !result;
  }
  return result;
}

test("10,000 generated problems expose every required column and empty position in the rendered projection", () => {
  const signatures = new Set<string>();
  for (let seed = 0; seed < 1000; seed += 1) {
    const { problems } = createStackedCubesProblemSet(seed);
    const layerCounts = problems.map(problem => Math.max(...problem.heights.flat()));
    assert.equal(layerCounts.filter(height => height === 2).length, 4);
    assert.equal(layerCounts.filter(height => height === 3).length, 6);
    for (const problem of problems) {
      const columns = problem.heights.flat().filter(height => height > 0);
      assert.ok(columns.filter(height => height >= 2).length >= 3, `seed ${seed}, ${problem.id}: several columns must rise above the base`);
      assert.ok(columns.includes(1) && columns.includes(2), `seed ${seed}, ${problem.id}: every layer must have a different outline`);
      signatures.add(JSON.stringify(problem.heights));
      const faces = stackDiagramFaces(problem.heights);
      const required = faces.filter((face) => face.kind === "top" || (problem.kind !== "count-map" && face.kind === "ground" && problem.heights[face.r][face.c] === 0));
      assert.equal(required.length, problem.kind === "count-map" ? problem.views.top.flat().filter(Boolean).length : 9);
      for (const face of required) {
        const center: StackPoint = [face.points.reduce((sum, point) => sum + point[0], 0) / 4, face.points.reduce((sum, point) => sum + point[1], 0) / 4];
        const samples = [center, ...face.points.map(([x, y]): StackPoint => [0.9 * x + 0.1 * center[0], 0.9 * y + 0.1 * center[1]])];
        for (const point of samples) {
          const visible = faces.findLast((candidate) => inside(point, candidate.points));
          assert.equal(visible, face, `seed ${seed}, ${problem.id}, ${face.kind} at ${face.r},${face.c} is concealed`);
        }
      }
    }
  }
  assert.ok(signatures.size > 1000, "visibility constraints should still allow varied shapes");
});
