import assert from "node:assert/strict";
import test from "node:test";
import { createElementaryGeometryMeasurementSet, normalizeGeometryMeasurementAnswer } from "../lib/elementary-geometry-measurement.ts";

test("plane measurement uses four composite figures", () => {
  const problems = createElementaryGeometryMeasurementSet("plane", 20260822);
  assert.equal(problems.length, 4);
  assert.deepEqual(new Set(problems.map((problem) => problem.kind)), new Set(["l-shape", "frame", "u-shape", "c-shape"]));
  assert.ok(problems.every((problem) => Object.values(problem.dimensions).every(Number.isFinite)));
  assert.ok(problems.every((problem) => problem.first > 0 && problem.second > 0));
});

test("solid measurement replaces elementary cylinder formula drills", () => {
  const problems = createElementaryGeometryMeasurementSet("solid", 20260823);
  assert.equal(problems.length, 4);
  assert.equal(new Set(problems.map(problem => problem.kind)).size, 4);
  const kinds = new Set(Array.from({length: 200}, (_, seed) => createElementaryGeometryMeasurementSet("solid", seed)).flat().map(problem => problem.kind));
  assert.equal(kinds.size, 8);
  assert.notDeepEqual(problems.map(problem => problem.kind), createElementaryGeometryMeasurementSet("solid", 20260824).map(problem => problem.kind));
  assert.ok(problems.every((problem) => problem.firstLabel === "겉넓이" && problem.secondLabel === "부피"));
});

test("answers accept commas but reject unit text", () => {
  assert.equal(normalizeGeometryMeasurementAnswer("1,250"), 1250);
  assert.ok(Number.isNaN(normalizeGeometryMeasurementAnswer("1250cm")));
});
