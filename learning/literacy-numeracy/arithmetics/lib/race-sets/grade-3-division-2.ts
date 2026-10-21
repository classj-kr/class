// grade-3-division-2 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type Problem = { id: string; dividend: number; divisor: number; quotient: number; remainder: number; large: boolean };
export type ProblemSet = { seed: number; columns: Problem[][] };
export type Answer = { quotient: string; remainder: string };

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

export function shuffle<T>(values: T[], next: () => number) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(next() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function makeProblem(id: string, dividend: number, divisor: number, large: boolean): Problem {
  return { id, dividend, divisor, quotient: Math.floor(dividend / divisor), remainder: dividend % divisor, large };
}

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  const smallProblems = Array.from({ length: 20 }, (_, index) => makeProblem(
    `division-remainder-small-${index}`,
    integer(next, 11, 99),
    integer(next, 2, 9),
    false,
  ));
  const largeDivisors = shuffle([2, 3, 4, 5, 6, 7, 8, 9], next).slice(0, 5);
  const largeProblems = largeDivisors.map((divisor, index) => makeProblem(
    `division-remainder-large-${index}`,
    integer(next, 101, 999),
    divisor,
    true,
  ));
  return { seed, columns: [smallProblems.slice(0, 10), smallProblems.slice(10, 20), largeProblems] };
}
