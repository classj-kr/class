// grade-3-complement-subtraction-100 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type Problem = { id: string; left: number; right: number; result: number };
export type ProblemSet = { seed: number; leftColumn: Problem[]; rightColumn: Problem[] };

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

export function subtrahend(next: () => number) {
  return integer(next, 2, 7) * 10 + integer(next, 1, 9);
}

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  const leftColumn = Array.from({ length: 11 }, (_, index) => {
    const left = 100;
    const right = subtrahend(next);
    return { id: `complement-hundred-left-${index}`, left, right, result: left - right };
  });
  const rightColumn = Array.from({ length: 11 }, (_, index) => {
    const left = 100 + integer(next, 1, 3);
    const right = subtrahend(next);
    return { id: `complement-hundred-right-${index}`, left, right, result: left - right };
  });
  return { seed, leftColumn, rightColumn };
}
