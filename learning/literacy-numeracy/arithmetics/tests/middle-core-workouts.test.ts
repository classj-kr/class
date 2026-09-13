import assert from "node:assert/strict";
import test from "node:test";
import {
  createFreshMiddleCoreProblemSet,
  createMiddleCoreProblemSet,
  createMiddleCoreReviewProblems,
  MIDDLE_CORE_KINDS,
  type MiddleCoreKind,
} from "../lib/middle-core-workouts.ts";
import { middleSchoolWorksheetCatalog } from "../lib/arithmetic-worksheets.ts";

test("학등 핵심 연산 23개 유형이 각각 8문제를 생성한다", () => {
  assert.equal(MIDDLE_CORE_KINDS.length, 23);
  for (const kind of MIDDLE_CORE_KINDS) {
    const set = createMiddleCoreProblemSet(kind, 20260803);
    assert.equal(set.problems.length, 8);
    assert.equal(set.kind, kind);
  }
});

test("모든 핵심 연산 문제는 서로 다른 네 선택지와 한 줄 핵심 풀이를 제공한다", () => {
  for (const kind of MIDDLE_CORE_KINDS) {
    for (let seed = 1; seed <= 100; seed += 1) {
      for (const problem of createMiddleCoreProblemSet(kind, seed).problems) {
        const choices = [problem.answerLatex, ...problem.distractors];
        assert.equal(choices.length, 4);
        assert.equal(new Set(choices).size, 4);
        assert.ok(problem.solutionHint.length >= 12);
        assert.doesNotMatch(
          `${problem.latex}${problem.answerLatex}${problem.distractors.join("")}`,
          /NaN|undefined|\+\-|\-\-/,
        );
      }
    }
  }
});

test("계수가 1 또는 -1이면 문자 앞의 숫자 1을 쓰지 않는다", () => {
  for (const kind of MIDDLE_CORE_KINDS) {
    for (let seed = 1; seed <= 100; seed += 1) {
      const text = createMiddleCoreProblemSet(kind, seed).problems
        .flatMap(({ latex, answerLatex, distractors }) => [latex, answerLatex, ...distractors])
        .join(" ");
      assert.doesNotMatch(text, /(?:^|[=+(\-])1x/);
      assert.doesNotMatch(text, /(?:^|[=+(])\-1x/);
    }
  }
});

test("각 학습지는 기본 2, 응용 3, 고난도 3문제로 구성된다", () => {
  for (const kind of MIDDLE_CORE_KINDS) {
    assert.deepEqual(
      createMiddleCoreProblemSet(kind, 29).problems.map(({ difficulty }) => difficulty),
      [
        "basic", "basic",
        "application", "application", "application",
        "advanced", "advanced", "advanced",
      ],
    );
  }
});

test("한 학습지 안에서 같은 문제와 정답 조합을 반복하지 않는다", () => {
  for (const kind of MIDDLE_CORE_KINDS) {
    for (let seed = 1; seed <= 100; seed += 1) {
      const signatures = createMiddleCoreProblemSet(kind, seed).problems
        .map(({ latex, answerLatex }) => `${latex}|${answerLatex}`);
      assert.equal(new Set(signatures).size, 8, `${kind}, seed ${seed}`);
    }
  }
});


test("종합 곱셈공식은 다항식의 곱셈, 완전제곱식, 합과 차를 순환한다", () => {
  const structures = createMiddleCoreProblemSet("formula-comprehensive", 31).problems
    .map(({ structure }) => structure);
  assert.ok(structures.some((structure) => structure === "monomial-binomial"));
  assert.ok(createMiddleCoreProblemSet("formula-comprehensive", 31).problems
    .some(({ kind }) => kind === "polynomial-divide"));
  assert.ok(structures.some((structure) => structure.endsWith("-square")));
  assert.ok(structures.some((structure) => structure.endsWith("-leading")));
});

test("통합 학습지는 쉬운 하위 유형을 한 문제지 안에서 순환한다", () => {
  assert.deepEqual(
    new Set(createMiddleCoreProblemSet("monomial-comprehensive", 31).problems.map(({ kind }) => kind)),
    new Set(["monomial-multiply", "monomial-divide"]),
  );
  assert.deepEqual(
    new Set(createMiddleCoreProblemSet("linear-system-comprehensive", 31).problems.map(({ kind }) => kind)),
    new Set([
      "simultaneous-substitution",
      "simultaneous-elimination",
      "simultaneous-application",
      "simultaneous-special",
    ]),
  );
});

test("일차부등식은 기본 6문제 뒤에 활용 2문제만 통합한다", () => {
  const problems = createMiddleCoreProblemSet("linear-inequality", 20260809).problems;
  assert.deepEqual(problems.map(({ kind }) => kind), [
    "linear-inequality", "linear-inequality", "linear-inequality",
    "linear-inequality", "linear-inequality", "linear-inequality",
    "linear-inequality-application", "linear-inequality-application",
  ]);
  assert.ok(problems.slice(6).every(({ structure }) => structure === "budget-maximum"));
});

test("연립방정식 한 장은 대입법·가감법·활용·해의 개수를 두 문제씩 섞는다", () => {
  const problems = createMiddleCoreProblemSet("linear-system-comprehensive", 20260809).problems;
  assert.deepEqual(problems.map(({ kind }) => kind), [
    "simultaneous-substitution",
    "simultaneous-elimination",
    "simultaneous-application",
    "simultaneous-special",
    "simultaneous-substitution",
    "simultaneous-elimination",
    "simultaneous-application",
    "simultaneous-special",
  ]);
  for (const kind of new Set(problems.map(({ kind }) => kind))) {
    assert.equal(problems.filter((problem) => problem.kind === kind).length, 2);
  }
});

test("연립방정식은 두 식이나 등식의 좌우만 바꾼 문제를 학복으로 세지 않는다", () => {
  const normalize = (latex: string) => {
    const compact = latex.replace(/\s+/g, "");
    const cases = /\\begin\{cases\}([\s\S]+)\\end\{cases\}/.exec(compact);
    if (!cases) return compact;
    return cases[1]
      .split("\\\\")
      .map((equation) => equation.split("=").sort().join("="))
      .sort()
      .join(";");
  };
  for (let seed = 1; seed <= 100; seed += 1) {
    const problems = createMiddleCoreProblemSet("linear-system-comprehensive", seed).problems;
    assert.equal(new Set(problems.map(({ latex }) => normalize(latex))).size, problems.length);
  }
});

test("새 문제는 직전 문제지와 동일한 문제를 두 개 이상 반복하지 않는다", () => {
  for (let seed = 1; seed <= 100; seed += 1) {
    const previous = createMiddleCoreProblemSet("linear-system-comprehensive", seed);
    const next = createFreshMiddleCoreProblemSet(
      "linear-system-comprehensive",
      seed + 1,
      previous.problems,
    );
    const previousSignatures = new Set(previous.problems.map(({ latex, answerLatex }) => `${latex}|${answerLatex}`));
    const overlap = next.problems.filter(
      ({ latex, answerLatex }) => previousSignatures.has(`${latex}|${answerLatex}`),
    ).length;
    assert.ok(overlap <= 1, `${seed}: ${overlap} repeated problems`);
  }
});

test("근호 계산은 학복 덧셈·뺄셈과 단순 대소 비교 없이 필수 계산 유형을 한 번씩 다룬다", () => {
  const problems = createMiddleCoreProblemSet("radical-calculation", 20260803).problems;
  assert.deepEqual(
    problems.map(({ structure }) => structure),
    [
      "perfect-square-root",
      "square-under-root",
      "simplify-radical",
      "like-radicals-combined",
      "radical-parentheses",
      "radical-multiply",
      "radical-divide",
      "rationalize-denominator",
    ],
  );
  assert.ok(!problems.some(({ structure }) => structure === "compare-radicals"));
  assert.equal(
    problems.filter(({ structure }) => structure.startsWith("like-radicals")).length,
    1,
  );
});

test("오답 보충은 서로 다른 유형에서 최대 두 문제만 만든다", () => {
  const kinds: MiddleCoreKind[] = [
    "linear-equation",
    "linear-equation",
    "linear-inequality",
    "radical-calculation",
  ];
  const reviews = createMiddleCoreReviewProblems(kinds, 123);
  assert.equal(reviews.length, 2);
  assert.deepEqual(reviews.map(({ kind }) => kind), ["linear-equation", "linear-inequality"]);
  assert.ok(reviews.every(({ difficulty }) => difficulty === "advanced"));
});

test("중학교 반복 연산 목록 39개는 쉬운 유형과 개념 전용 유형을 분리하고 모두 연결된다", () => {
  assert.equal(middleSchoolWorksheetCatalog.length, 39);
  assert.ok(middleSchoolWorksheetCatalog.every(({ route }) => route !== null));
  assert.equal(
    new Set(middleSchoolWorksheetCatalog.map(({ name }) => name)).size,
    middleSchoolWorksheetCatalog.length,
  );
  assert.equal(
    new Set(middleSchoolWorksheetCatalog.map(({ route }) => route)).size,
    middleSchoolWorksheetCatalog.length,
  );
});

test("통합된 쉬운 학등 학습지는 목록에서 별도 페이지로 학복 노출하지 않는다", () => {
  const routes = middleSchoolWorksheetCatalog.map(({ route }) => route);
  assert.ok(!routes.some((route) => route?.includes("linear-expression")));
  assert.ok(!routes.some((route) => route?.includes("linear-equation-application")));
  assert.ok(!routes.some((route) => route?.includes("kind=square-roots-real")));
  assert.ok(!routes.some((route) => route?.includes("kind=roots-and-squares")));
  assert.ok(!routes.some((route) => route?.includes("kind=vertex-and-axis")));
  assert.ok(!routes.some((route) => route?.includes("kind=special-angles")));
  assert.ok(!routes.some((route) => route?.includes("trigonometry?kind=comprehensive")));
  assert.ok(!routes.some((route) => route?.includes("kind=angle-applications")));
  assert.ok(!routes.some((route) => route?.includes("circle-properties?kind=comprehensive")));
  assert.ok(!routes.some((route) => route?.includes("kind=mean-applications")));
  assert.ok(!routes.some((route) => route?.includes("kind=monomial-comprehensive")));
});

test("gcd-lcm worksheets progress through middle-school prime factorization", () => {
  const problems = createMiddleCoreProblemSet("gcd-lcm", 29).problems;
  assert.deepEqual(
    problems.map(({ structure }) => structure),
    [
      "factored-two-both",
      "factored-three-gcd",
      "two-both",
      "three-gcd",
      "three-lcm",
      "product-relation",
      "missing-exponents",
      "gcd-lcm-condition",
    ],
  );
  assert.ok(problems.slice(5).every(({ structure }) => structure.includes("relation") || structure.includes("exponent") || structure.includes("condition")));
  assert.ok(problems.slice(0, 5).every(({ solutionHint }) => solutionHint.includes("소인수")));
});

test("prime factorization advances from exponent notation to middle-school applications", () => {
  const problems = createMiddleCoreProblemSet("prime-factorization", 29).problems;
  assert.deepEqual(
    problems.slice(5).map(({ structure }) => structure),
    ["make-perfect-square-product", "make-perfect-square-quotient", "divisor-count-exponent"],
  );
  assert.ok(problems.slice(0, 5).every(({ answerLatex }) => answerLatex.includes("^")));
  assert.ok(problems.slice(5).every(({ latex }) => /n|a/.test(latex)));
  assert.equal(problems[5].question, "가장 작은 자연수 n은?");
  assert.equal(problems[6].question, "가장 작은 자연수 n은?");
  assert.equal(problems[7].question, "a의 값은?");
  assert.ok(problems.every(({ latex }) => !latex.includes("?")));
  assert.doesNotMatch(problems.map(({ latex }) => latex).join(" "), /구하여라/);
});

test("최대공약수와 최소공배수 문제는 식 안의 학복 질문 없이 구할 대상을 한 번만 묻는다", () => {
  const expectedQuestions = [
    "최대공약수와 최소공배수는?",
    "최대공약수는?",
    "최대공약수와 최소공배수는?",
    "최대공약수는?",
    "최소공배수는?",
    "다른 한 수는?",
    "a+b의 값은?",
    "다른 한 수는?",
  ];
  for (let seed = 1; seed <= 100; seed += 1) {
    const problems = createMiddleCoreProblemSet("gcd-lcm", seed).problems;
    assert.deepEqual(problems.map(({ question }) => question), expectedQuestions);
    assert.ok(problems.every(({ latex }) => !latex.includes("?")));
    assert.doesNotMatch(problems.map(({ latex }) => latex).join(" "), /구하여라/);
  }
});

test("문자식 기본연산 종합은 쉬운 반복 대신 필수 연산을 한 번씩 순환한다", () => {
  const problems = createMiddleCoreProblemSet("polynomial-add-subtract", 29).problems;
  assert.deepEqual(
    problems.map(({ kind }) => kind),
    [
      "exponent-laws",
      "monomial-multiply",
      "monomial-divide",
      "polynomial-multiply",
      "polynomial-add-subtract",
      "polynomial-divide",
      "polynomial-add-subtract",
      "polynomial-add-subtract",
    ],
  );
  assert.deepEqual(
    problems.filter(({ kind }) => kind === "polynomial-add-subtract").map(({ structure }) => structure),
    ["two-variables", "nested-parentheses", "missing-polynomial"],
  );
});
