// grade-2-add-subtract-1 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type VerticalProblem = {
  id: string;
  left: number;
  operator: "+" | "−";
  right: number;
  result: number;
};
export type ProblemSet = { seed: number; problems: VerticalProblem[] };

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

export function rangedTwoDigit(next: () => number, tensMinimum: number, tensMaximum: number, onesMinimum = 2, onesMaximum = 9) {
  return integer(next, tensMinimum, tensMaximum) * 10 + integer(next, onesMinimum, onesMaximum);
}

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  const problems: VerticalProblem[] = [];

  function addition(tensMinimum: number, tensMaximum: number, rightTensMinimum: number, rightTensMaximum: number, leftOnesMinimum = 2, leftOnesMaximum = 9, rightOnesMinimum = 2, rightOnesMaximum = 9) {
    const left = rangedTwoDigit(next, tensMinimum, tensMaximum, leftOnesMinimum, leftOnesMaximum);
    const right = rangedTwoDigit(next, rightTensMinimum, rightTensMaximum, rightOnesMinimum, rightOnesMaximum);
    problems.push({ id: `vertical-${problems.length}`, left, operator: "+", right, result: left + right });
  }

  function subtraction() {
    const left = integer(next, 21, 99);
    const right = integer(next, 11, left - 1);
    problems.push({ id: `vertical-${problems.length}`, left, operator: "−", right, result: left - right });
  }

  addition(4, 9, 3, 9, 3, 7, 2, 7);
  subtraction();
  addition(1, 6, 1, 9);
  subtraction();

  subtraction();
  subtraction();
  addition(1, 9, 1, 9);
  subtraction();

  addition(1, 6, 1, 9);
  addition(1, 9, 1, 9);
  subtraction();
  addition(1, 5, 1, 6);

  subtraction();
  addition(1, 6, 1, 9);
  subtraction();
  addition(1, 6, 1, 9);

  return { seed, problems };
}
