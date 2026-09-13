import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { highSchoolWorksheetCatalog, middleSchoolWorksheetCatalog } from "../lib/arithmetic-worksheets.ts";
import { createExponentialLogFunctionProblems } from "../lib/exponential-log-function-workouts.ts";
import { createFunctionTransformationWorksheetSet } from "../lib/function-transformation-workouts.ts";
import { createMiddleCurriculumProblemSet } from "../lib/middle-curriculum-workouts.ts";
import { createLogicProblemSet } from "../lib/sets-propositions-workouts.ts";

const forbiddenRecallKinds = new Set([
  "quadrant",
  "point-on-axis",
  "set-law",
  "truth-value",
  "quantifier-negation",
  "contrapositive",
  "condition-relation",
  "function-correspondence",
  "one-to-one",
  "inverse-existence",
  "domain-range-restriction",
  "composition-domain",
  "inverse-graph-symmetry",
  "exponential-monotonicity",
  "exponential-asymptote",
  "logarithmic-domain",
  "logarithmic-asymptote",
  "inverse-functions",
  "rational-asymptotes",
  "radical-endpoint",
]);

test("노출된 연산 세트에는 OX로 분리한 단순 회상 유형이 없다", () => {
  const kinds = [
    ...createMiddleCurriculumProblemSet("coordinate-proportion", 20260912).problems.map(({ kind }) => kind),
    ...createLogicProblemSet(20260912).problems.map(({ kind }) => kind),
    ...createFunctionTransformationWorksheetSet(20260912).problems.map(({ kind }) => kind),
    ...createExponentialLogFunctionProblems(20260912).map(({ kind }) => kind),
  ];

  assert.deepEqual(kinds.filter((kind) => forbiddenRecallKinds.has(kind)), []);
});

test("개념 전용 작도·합동은 연산 목차에서 제외하고 집합 학습지 이름은 계산 범위를 밝힌다", () => {
  const routes = [...middleSchoolWorksheetCatalog, ...highSchoolWorksheetCatalog].map(({ route }) => route);
  assert.ok(!routes.includes("/arithmetic/middle-school/curriculum-calculations?kind=construction-congruence"));
  assert.ok(highSchoolWorksheetCatalog.some(({ title }) => title === "집합의 연산과 원소 개수"));
  assert.ok(!highSchoolWorksheetCatalog.some(({ title }) => title === "집합과 명제"));
});

test("기하 학습지는 첫 화면부터 정적 개념 세트가 아닌 계산 생성기를 쓴다", () => {
  const pageRoot = path.join(process.cwd(), "app", "arithmetic", "high-school");
  for (const directory of [
    "conic-sections",
    "conic-transformations-tangents",
    "plane-vectors",
    "vector-projections",
    "vector-geometry",
    "space-coordinates",
  ]) {
    const source = fs.readFileSync(path.join(pageRoot, directory, "page.tsx"), "utf8");
    assert.match(source, /geometry-generated-workouts/);
    assert.doesNotMatch(source, /from "\.\.\/\.\.\/\.\.\/\.\.\/lib\/geometry-workouts"/);
  }
});
