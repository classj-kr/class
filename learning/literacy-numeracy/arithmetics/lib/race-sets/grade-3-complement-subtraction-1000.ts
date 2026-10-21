// grade-3-complement-subtraction-1000 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
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

export function createColumn(next: () => number, side: "left" | "right") {
  return Array.from({ length: 10 }, (_, index) => {
    const left = 1000;
    const right = integer(next, 13, left - 11);
    return { id: `complement-thousand-${side}-${index}`, left, right, result: left - right };
  });
}

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  return { seed, leftColumn: createColumn(next, "left"), rightColumn: createColumn(next, "right") };
}
