// grade-3-multiplication-3 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type Range = readonly [number, number];
export type ProblemPattern = { left: Range; right: Range };
export type Problem = { id: string; left: number; right: number; product: number };
export type ProblemSet = { seed: number; problems: Problem[] };

export const THREE_BY_ONE: ProblemPattern = { left: [666, 999], right: [6, 9] };
export const TWO_BY_TWO: ProblemPattern = { left: [15, 99], right: [15, 99] };
export const HIGH_TWO_BY_TWO: ProblemPattern = { left: [77, 99], right: [77, 99] };
export const PATTERNS: ProblemPattern[] = [
  ...Array.from({ length: 4 }, () => THREE_BY_ONE),
  ...Array.from({ length: 8 }, () => TWO_BY_TWO),
  ...Array.from({ length: 2 }, () => HIGH_TWO_BY_TWO),
  ...Array.from({ length: 2 }, () => THREE_BY_ONE),
];

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

export function integer(next: () => number, [minimum, maximum]: Range) {
  return minimum + Math.floor(next() * (maximum - minimum + 1));
}

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  return {
    seed,
    problems: PATTERNS.map((pattern, index) => {
      const left = integer(next, pattern.left);
      const right = integer(next, pattern.right);
      return { id: `grade-three-multiplication-three-${index}`, left, right, product: left * right };
    }),
  };
}
