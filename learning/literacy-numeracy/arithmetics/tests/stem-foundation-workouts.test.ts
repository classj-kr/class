import assert from "node:assert/strict";
import test from "node:test";

import {
  createStemFoundationProblems,
  isStemBridgeKind,
  STEM_BRIDGE_KINDS,
  STEM_FOUNDATION_KINDS,
} from "../lib/stem-foundation-workouts.ts";

test("공개 이공계 기초 주소는 진학 준비 6개 유형만 허용한다", () => {
  for (const kind of STEM_BRIDGE_KINDS) assert.equal(isStemBridgeKind(kind), true, kind);
  for (const kind of STEM_FOUNDATION_KINDS) {
    assert.equal(isStemBridgeKind(kind), STEM_BRIDGE_KINDS.includes(kind as never), kind);
  }
  assert.equal(isStemBridgeKind("laplace-transforms"), false);
  assert.equal(isStemBridgeKind(null), false);
});

test("공개 이공계 기초 48문항의 기준 정답을 모두 검산한다", () => {
  const expectedAnswers: Record<(typeof STEM_BRIDGE_KINDS)[number], string[]> = {
    "complex-polar": [
      "|z|=3\\sqrt2,\\ \\arg z=\\frac\\pi4",
      "3+3\\sqrt3i",
      "10\\operatorname{cis}\\frac\\pi2",
      "4\\operatorname{cis}\\frac\\pi2",
      "-1",
      "z=3\\operatorname{cis}\\frac{2k\\pi}{3}\\ (k=0,1,2)",
      "0",
      "0",
    ],
    "matrix-systems": [
      "\\begin{pmatrix}-1&0\\\\1&9\\\\1&0\\end{pmatrix}",
      "\\begin{pmatrix}12&0\\\\0&-12\\end{pmatrix}",
      "36",
      "A^{-1}=\\begin{pmatrix}1&-1&1\\\\0&1&-1\\\\0&0&1\\end{pmatrix}",
      "(x,y,z)=(2,2,1)",
      "\\left[\\begin{array}{ccc|c}1&0&0&2\\\\0&1&0&1\\\\0&0&1&1\\end{array}\\right]",
      "a=-1:\\text{ 무수히 많음},\\quad a\\ne-1:\\text{ 유일해}",
      "X=\\begin{pmatrix}4&0\\\\0&2\\\\0&-1\\end{pmatrix}",
    ],
    "vector-spaces-rank": [
      "\\begin{pmatrix}3\\\\-1\\\\2\\end{pmatrix}",
      "(a,b)=(3,4)",
      "\\text{일차독립}",
      "\\dim W=2",
      "N(A)=\\operatorname{span}\\left\\{\\begin{pmatrix}-3\\\\1\\end{pmatrix}\\right\\}",
      "\\left\\{\\begin{pmatrix}1\\\\0\\end{pmatrix},\\begin{pmatrix}0\\\\1\\end{pmatrix}\\right\\}",
      "\\lambda=5,3",
      "\\operatorname{span}\\{(1,0)\\}",
    ],
    "partial-derivatives": [
      "f_x=3x^2+3y^2",
      "f_{xy}=9x^{2}y^{2}",
      "\\frac{dz}{dt}=2t+8t^{7}",
      "\\frac{dy}{dx}=-\\frac{x}{y}",
      "dz=(4x+y)dx+(x+4y)dy",
      "z-5=2(x-1)+4(y-2)",
      "\\nabla f(1,2)=(4,5)",
      "D_uf=15",
    ],
    "multiple-integrals": [
      "6",
      "0\\le y\\le4,\\quad0\\le x\\le y",
      "10",
      "4\\pi",
      "8\\pi",
      "\\frac{9}{2}",
      "\\left|\\frac{\\partial(x,y)}{\\partial(u,v)}\\right|=9",
      "2\\pi",
    ],
    "first-order-ode": [
      "y=e^{3x}",
      "y=5e^{-3x}",
      "y=\\frac1{4}e^{x}+Ce^{-3x}",
      "\\mu(x)=x^{2}",
      "x^2+xy+y^2=C",
      "y=\\frac1{1+Ce^{2x}}",
      "y=C_1e^{2x}+C_2e^{4x}",
      "y=\\sin 4x",
    ],
  };

  for (const kind of STEM_BRIDGE_KINDS) {
    assert.deepEqual(
      createStemFoundationProblems(kind, 20260910).map(({ correctLatex }) => correctLatex),
      expectedAnswers[kind],
      kind,
    );
  }
});

test("공개 이공계 기초 48문항은 구할 대상을 짧고 정확하게 묻는다", () => {
  const expectedPrompts: Record<(typeof STEM_BRIDGE_KINDS)[number], string[]> = {
    "complex-polar": [
      "$|z|$와 $\\arg z$는?",
      "직교형식은?",
      "곱의 극형식은?",
      "몫의 극형식은?",
      "거듭제곱 값은?",
      "모든 해 $z$는?",
      "복소지수식의 값은?",
      "합은?",
    ],
    "matrix-systems": [
      "$2A^{T}-3B$는?",
      "$AB-BA$는?",
      "행렬식은?",
      "역행렬 $A^{-1}$은?",
      "해 $(x,y,z)$는?",
      "기약행사다리꼴은?",
      "해의 개수는?",
      "$X$는?",
    ],
    "vector-spaces-rank": [
      "결과 벡터는?",
      "계수 $(a,b)$는?",
      "두 벡터는 일차독립인가?",
      "$\\dim W$는?",
      "$N(A)$의 기저는?",
      "$\\operatorname{Col}(A)$의 기저는?",
      "$A$의 고유값은?",
      "고유공간은?",
    ],
    "partial-derivatives": [
      "$f_x$는?",
      "$f_{xy}$는?",
      "$\\dfrac{dz}{dt}$는?",
      "$\\dfrac{dy}{dx}$는?",
      "전미분 $dz$는?",
      "접평면 방정식은?",
      "$\\nabla f$는?",
      "$D_u f$는?",
    ],
    "multiple-integrals": [
      "이중적분 값은?",
      "바꾼 적분 범위는?",
      "영역 $D$의 넓이는?",
      "극좌표 이중적분 값은?",
      "원판 위 이중적분 값은?",
      "삼각영역 위 이중적분 값은?",
      "야코비안 절댓값은?",
      "극좌표로 바꾼 이중적분 값은?",
    ],
    "first-order-ode": [
      "해 $y(x)$는?",
      "해 $y(x)$는?",
      "일반해 $y(x)$는?",
      "적분인자 $\\mu(x)$는?",
      "음함수형 일반해는?",
      "베르누이 방정식의 일반해 $y(x)$는?",
      "2계 방정식의 일반해 $y(x)$는?",
      "초기조건을 만족하는 2계 방정식의 해 $y(x)$는?",
    ],
  };

  for (const kind of STEM_BRIDGE_KINDS) {
    assert.deepEqual(
      createStemFoundationProblems(kind, 20260910).map(({ prompt }) => prompt),
      expectedPrompts[kind],
      kind,
    );
  }
});

test("공개 이공계 식은 계수 1과 약분 가능한 파이 분수를 남기지 않는다", () => {
  const forbiddenNotation = /e\^\{(?:-?1x)\}|\\(?:sin|cos) 1x|(?:^|[^0-9])1[xyi](?:\^|\b)|[xy]\^\{1\}/;
  const reduciblePiFraction = /\\frac\{(\d+)\\pi\}\{(\d+)\}/;

  for (const kind of STEM_BRIDGE_KINDS) {
    for (let seed = 1; seed <= 200; seed += 1) {
      for (const problem of createStemFoundationProblems(kind, seed)) {
        for (const latex of [problem.latex, problem.correctLatex, ...problem.choices.map(({ latex }) => latex)]) {
          assert.doesNotMatch(latex, forbiddenNotation, `${problem.id}: ${latex}`);
          const fraction = latex.match(reduciblePiFraction);
          if (fraction) {
            assert.equal(
              greatestCommonDivisorForTest(Number(fraction[1]), Number(fraction[2])),
              1,
              `${problem.id}: ${latex}`,
            );
          }
        }
      }
    }
  }
});

function greatestCommonDivisorForTest(left: number, right: number) {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

test("기존 주소를 위한 이공계 확장 문제은행 18종은 각각 8문제를 유지한다", () => {
  assert.equal(STEM_FOUNDATION_KINDS.length, 18);

  for (const kind of STEM_FOUNDATION_KINDS) {
    for (let seed = 1; seed <= 200; seed += 1) {
      const problems = createStemFoundationProblems(kind, seed);
      assert.equal(problems.length, 8, kind);
      assert.equal(
        new Set(problems.map(({ latex, correctLatex }) => `${latex}|${correctLatex}`)).size,
        8,
        `${kind}: 같은 문제가 한 장에서 반복됨`,
      );

      for (const problem of problems) {
        assert.equal(problem.choices.length, 4, problem.id);
        assert.equal(
          new Set(problem.choices.map(({ latex }) => latex)).size,
          4,
          `${problem.id}: 선택지 중복`,
        );
        assert.equal(
          problem.choices.filter(({ correct }) => correct).length,
          1,
          `${problem.id}: 정답 개수`,
        );
        assert.equal(
          problem.choices.find(({ correct }) => correct)?.latex,
          problem.correctLatex,
          `${problem.id}: 정답 불일치`,
        );
      }
    }
  }
});

test("이공계 확장 문제은행은 새 문제 버튼으로 실제 식이나 수가 바뀐다", () => {
  for (const kind of STEM_FOUNDATION_KINDS) {
    assert.notDeepEqual(
      createStemFoundationProblems(kind, 1),
      createStemFoundationProblems(kind, 2),
      kind,
    );
  }
});

test("공대 진학 전 6장에는 고등학교 반복과 대학 전공 심화 유형을 섞지 않는다", () => {
  const labels = STEM_BRIDGE_KINDS.flatMap((kind) => (
    createStemFoundationProblems(kind, 20260910).map(({ label }) => label)
  ));
  for (const excludedType of [
    "크래머",
    "최소제곱",
    "대각화",
    "삼중적분",
    "라플라스",
    "푸리에",
    "수치해석",
  ]) {
    assert.ok(!labels.some((label) => label.includes(excludedType)), excludedType);
  }
});

test("각 이공계 학습지는 기본 2·응용 3·고난도 3문제로 진행한다", () => {
  for (const kind of STEM_FOUNDATION_KINDS) {
    const problems = createStemFoundationProblems(kind, 20260910);
    assert.deepEqual(
      problems.reduce<Record<string, number>>((counts, problem) => {
        counts[problem.difficulty ?? "missing"] = (counts[problem.difficulty ?? "missing"] ?? 0) + 1;
        return counts;
      }, {}),
      { basic: 2, application: 3, advanced: 3 },
      kind,
    );
  }
});

test("공식 이름만 고르는 문항 대신 실제 계산 자료를 제시한다", () => {
  const labels = STEM_FOUNDATION_KINDS.flatMap((kind) => (
    createStemFoundationProblems(kind, 20260910).map(({ label }) => label)
  ));
  for (const removedRecallLabel of [
    "정규방정식",
    "직교행렬",
    "대각화",
    "그린 정리",
    "스토크스 정리",
    "발산정리",
    "이동정리",
    "계단함수",
    "뉴턴 방법",
    "오일러 방법",
    "오차 차수",
  ]) {
    assert.ok(!labels.includes(removedRecallLabel), removedRecallLabel);
  }
});

test("144문항 모두 무엇을 구할지 질문 또는 지시문에 명시한다", () => {
  const prompts = STEM_FOUNDATION_KINDS.flatMap((kind) => (
    createStemFoundationProblems(kind, 20260910).map(({ prompt }) => prompt)
  ));
  assert.equal(prompts.length, 144);
  assert.ok(prompts.every((prompt): prompt is string => typeof prompt === "string" && prompt.length >= 3));
  assert.ok(prompts.every((prompt) => !prompt.includes("값이나 식")));
  assert.ok(prompts.every((prompt) => /[?？]$/.test(prompt) || /구하세요|나타내세요|판정하세요|쓰세요/.test(prompt)));
});

test("이공계 질문의 수학 기호는 모두 수식 구간 안에서 표준 표기로 렌더링한다", () => {
  const prompts = STEM_FOUNDATION_KINDS.flatMap((kind) => (
    createStemFoundationProblems(kind, 20260910).map(({ prompt }) => prompt)
  ));
  for (const prompt of prompts) {
    assert.ok(prompt);
    const delimiters = prompt.match(/\$/g) ?? [];
    assert.equal(delimiters.length % 2, 0, prompt);
    const proseOnly = prompt.replace(/\$[^$]+\$/g, "");
    assert.doesNotMatch(proseOnly, /[A-Za-zλμκφω∇|]/, prompt);
  }
  assert.equal(
    createStemFoundationProblems("orthogonality-least-squares", 20260910)[6]?.prompt,
    "$A^{T}A$와 $A^{T}b$를 구하세요.",
  );
});

test("2계 미분방정식은 일반해·초기값해·특수해·론스키안을 구분한다", () => {
  const prompts = createStemFoundationProblems("second-order-ode", 20260910)
    .map(({ prompt }) => prompt);
  assert.deepEqual(prompts, [
    "특성방정식을 이용해 일반해 $y(x)$를 구하세요.",
    "중근을 이용해 일반해 $y(x)$를 구하세요.",
    "복소근을 이용해 일반해 $y(x)$를 구하세요.",
    "초기조건을 만족하는 해 $y(x)$를 구하세요.",
    "미정계수법으로 특수해 $y_p$를 구하세요.",
    "공진을 고려한 특수해 $y_p$를 구하세요.",
    "코시–오일러 방정식의 일반해 $y(x)$를 구하세요.",
    "두 해의 론스키안 $W(y_1,y_2)$를 구하세요.",
  ]);
});

test("통합 행렬 입문은 행렬식과 역행렬까지 한 장에서 훈련한다", () => {
  const problems = createStemFoundationProblems("matrix-systems", 20260910);
  assert.deepEqual(
    problems.map(({ label }) => label),
    [
      "전치행렬 포함 복합연산",
      "교환자 계산",
      "3×3 행렬식",
      "3×3 역행렬",
      "3원 연립방정식",
      "확대행렬의 기약행사다리꼴",
      "매개변수에 따른 해의 개수",
      "여러 우변의 동시 풀이",
    ],
  );
  for (const removedElementaryLabel of [
    "행렬의 덧셈",
    "행렬의 곱",
    "행렬과 벡터",
    "연립방정식",
    "기본 행연산",
  ]) {
    assert.ok(!problems.some(({ label }) => label === removedElementaryLabel));
  }
});

test("이공계 기초 새 문제는 유형 순서를 유지하면서 대부분의 식과 해를 실제로 바꾼다", () => {
  for (const kind of STEM_BRIDGE_KINDS) {
    const first = createStemFoundationProblems(kind, 1001);
    const second = createStemFoundationProblems(kind, 2002);

    assert.deepEqual(first.map(({ label }) => label), second.map(({ label }) => label), kind);
    assert.ok(
      first.filter((problem, index) => problem.latex !== second[index].latex).length >= 6,
      kind,
    );
    assert.ok([...first, ...second].every(({ latex }) => !/--|\+\-/.test(latex)), kind);
  }
});
