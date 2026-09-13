import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRationalRadicalProblemSet, createRationalRadicalReviewProblems, sameRationalRadicalAnswer } from "../lib/rational-radical-function-workouts.ts";
test("each set covers seven rational and radical function calculations", () => {
  for (let seed = 1; seed <= 100; seed += 1) {
    const problems = createRationalRadicalProblemSet(seed).problems;
    assert.deepEqual(problems.map(({ kind }) => kind), [
      "rational-asymptotes-from-general", "rational-coefficient", "rational-value", "rational-equation",
      "radical-value", "radical-coefficient", "radical-equation",
    ]);
    assert.ok(problems.every(({ answer }) => answer.every(Number.isInteger)));
  }
});

test("점근선과 시작점을 식에서 바로 읽는 단순 개념형은 출제하지 않는다", () => {
  const problems = createRationalRadicalProblemSet(20260912).problems;
  assert.ok(!problems.some(({ kind }) => kind === ("rational-asymptotes" as never) || kind === ("radical-endpoint" as never)));
  assert.match(problems[0].prompt, /분자를 분모로 나누어/);
  assert.equal(problems[4].kind, "radical-value");
});
test("answer checking and review selection are exact", () => {
  assert.equal(sameRationalRadicalAnswer(["-2", "3"], [-2, 3]), true);
  const kinds = createRationalRadicalProblemSet(1).problems.map(({ kind }) => kind);
  assert.deepEqual(createRationalRadicalReviewProblems([kinds[4], kinds[4], kinds[1]], 2).map(({ kind }) => kind), [kinds[4], kinds[1]]);
});
test("display formulas are anchored to the left edge", async () => {
  const css = await readFile(new URL("../app/arithmetic/high-school/high-school.css", import.meta.url), "utf8");
  assert.match(css, /\.polynomial-page\.rr-page \.rr-expression \.math-formula-display,[\s\S]*?justify-content: flex-start;/);
  assert.match(css, /\.polynomial-page\.rr-page \.rr-expression \.katex-display > \.katex[\s\S]*?text-align: left;/);
});
