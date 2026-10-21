// grade-3-add-subtract 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type VerticalProblem = {
  id: string;
  left: number;
  operator: "+" | "−";
  right: number;
  result: number;
};
export type ProblemSet = { seed: number; problems: VerticalProblem[] };

export const OPERATOR_PATTERN = ["+", "−", "+", "−", "−", "−", "+", "−", "+", "+", "−", "+", "−", "+", "−", "+"] as const;

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

export function additionProblem(next: () => number, id: string): VerticalProblem {
  const left = integer(next, 0, 9) * 100 + integer(next, 4, 9) * 10 + integer(next, 3, 9);
  const right = integer(next, 0, 9) * 100 + integer(next, 3, 9) * 10 + integer(next, 4, 9);
  return { id, left, operator: "+", right, result: left + right };
}

export function subtractionProblem(next: () => number, id: string): VerticalProblem {
  const hundreds = integer(next, 6, 9);
  const left = hundreds * 100 + integer(next, 0, 4) * 10 + integer(next, 0, 4);
  const right = integer(next, 0, hundreds - 1) * 100 + integer(next, 4, 9) * 10 + integer(next, 3, 9);
  return { id, left, operator: "−", right, result: left - right };
}

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  return {
    seed,
    problems: OPERATOR_PATTERN.map((operator, index) => (
      operator === "+" ? additionProblem(next, `grade-three-${index}`) : subtractionProblem(next, `grade-three-${index}`)
    )),
  };
}
