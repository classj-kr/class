// grade-4-fraction 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type Operator = "+" | "−";
export type FractionValue = { whole: number; numerator: number; denominator: number };
export type Problem = { id: string; operator: Operator; left: FractionValue; right: FractionValue; answer: FractionValue };
export type ProblemSet = { seed: number; problems: Problem[] };
export type Answer = { whole: string; numerator: string; denominator: string };

export function random(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

export function integer(next: () => number, minimum: number, maximum: number) {
  return minimum + Math.floor(next() * (maximum - minimum + 1));
}

export function value(whole: number, numerator: number, denominator: number): FractionValue {
  return { whole, numerator, denominator };
}

export function createProblem(id: number, operator: Operator, left: FractionValue, right: FractionValue): Problem {
  const denominator = left.denominator || right.denominator;
  const leftUnits = left.whole * denominator + left.numerator;
  const rightUnits = right.whole * denominator + right.numerator;
  const resultUnits = operator === "+" ? leftUnits + rightUnits : leftUnits - rightUnits;
  return {
    id: `grade-four-fraction-${id}`,
    operator,
    left,
    right,
    answer: value(Math.floor(resultUnits / denominator), resultUnits % denominator, denominator),
  };
}

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  const problems: Problem[] = [];

  // ① 대분수 + 자연수
  let denominator = integer(next, 3, 9);
  problems.push(createProblem(0, "+",
    value(integer(next, 2, 9), integer(next, 1, denominator - 1), denominator),
    value(integer(next, 2, 9), 0, denominator),
  ));

  // ② 자연수 + 대분수
  denominator = integer(next, 3, 9);
  problems.push(createProblem(1, "+",
    value(integer(next, 2, 9), 0, denominator),
    value(integer(next, 2, 9), integer(next, 1, denominator - 1), denominator),
  ));

  // ③ 분자끼리 더하면 분모보다 큰 대분수 덧셈
  denominator = integer(next, 3, 9);
  problems.push(createProblem(2, "+",
    value(integer(next, 2, 9), integer(next, 1, denominator - 1), denominator),
    value(integer(next, 2, 9), integer(next, 1, denominator - 1), denominator),
  ));

  // ④ 분수 부분의 합이 1인 대분수 덧셈
  denominator = integer(next, 3, 9);
  let numerator = integer(next, 1, denominator - 1);
  problems.push(createProblem(3, "+",
    value(integer(next, 2, 9), numerator, denominator),
    value(integer(next, 2, 9), denominator - numerator, denominator),
  ));

  // ⑤ 받아올림이 생기는 대분수 덧셈
  denominator = integer(next, 3, 9);
  numerator = integer(next, 1, denominator - 1);
  problems.push(createProblem(4, "+",
    value(integer(next, 2, 9), numerator, denominator),
    value(integer(next, 2, 9), integer(next, numerator, denominator - 1), denominator),
  ));

  // ⑥ 자연수 - 대분수
  denominator = integer(next, 3, 9);
  const whole = integer(next, 4, 9);
  problems.push(createProblem(5, "−",
    value(whole, 0, denominator),
    value(integer(next, 1, whole - 2), integer(next, 1, denominator - 1), denominator),
  ));

  // ⑦ 대분수 - 자연수
  denominator = integer(next, 3, 9);
  const leftWhole = integer(next, 2, 9);
  problems.push(createProblem(6, "−",
    value(leftWhole, integer(next, 1, denominator - 1), denominator),
    value(integer(next, 1, leftWhole - 1), 0, denominator),
  ));

  // ⑧ 받아내림이 없는 대분수 뺄셈
  denominator = integer(next, 3, 9);
  const leftNumerator = integer(next, 2, denominator - 1);
  const minuendWhole = integer(next, 2, 9);
  problems.push(createProblem(7, "−",
    value(minuendWhole, leftNumerator, denominator),
    value(integer(next, 1, minuendWhole - 1), integer(next, 1, leftNumerator - 1), denominator),
  ));

  // ⑨⑩ 받아내림이 있는 대분수 뺄셈
  for (let index = 8; index < 10; index += 1) {
    denominator = integer(next, 4, 9);
    const minuendWhole = integer(next, 4, 9);
    problems.push(createProblem(index, "−",
      value(minuendWhole, integer(next, 1, 2), denominator),
      value(integer(next, 1, minuendWhole - 2), integer(next, 3, denominator - 1), denominator),
    ));
  }

  return { seed, problems };
}
