// grade-3-add-subtract-2 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type Problem = { id: string; left: number; operator: "+" | "−"; right: number; result: number };
export type ProblemSet = { seed: number; additions: Problem[]; subtractions: Problem[] };

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

export function basicNumber(next: () => number) {
  return integer(next, 2, 5) * 100 + integer(next, 2, 8) * 10 + integer(next, 3, 9);
}

export function almostHundred(next: () => number) {
  return integer(next, 1, 8) * 100 + integer(next, 98, 99);
}

export function addition(id: string, left: number, right: number): Problem {
  return { id, left, operator: "+", right, result: left + right };
}

export function subtraction(id: string, left: number, right: number): Problem {
  return { id, left, operator: "−", right, result: left - right };
}

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  const linkedLeft = basicNumber(next);
  const linkedRight = integer(next, 2, 8) * 100;
  const additions: Problem[] = [
    addition("grade-three-two-add-0", linkedLeft, linkedRight),
    addition("grade-three-two-add-1", linkedLeft, linkedRight - integer(next, 1, 2)),
    addition("grade-three-two-add-2", basicNumber(next), almostHundred(next)),
    addition("grade-three-two-add-3", almostHundred(next), basicNumber(next)),
    addition("grade-three-two-add-4", almostHundred(next), basicNumber(next)),
    addition("grade-three-two-add-5", almostHundred(next), basicNumber(next)),
    addition("grade-three-two-add-6", basicNumber(next), almostHundred(next)),
    addition("grade-three-two-add-7", almostHundred(next), basicNumber(next)),
    addition("grade-three-two-add-8", basicNumber(next), almostHundred(next)),
    addition("grade-three-two-add-9", almostHundred(next), basicNumber(next)),
  ];

  const subtractions = Array.from({ length: 10 }, (_, index) => {
    if (index < 6) {
      const left = integer(next, 5, 9) * 100;
      return subtraction(`grade-three-two-subtract-${index}`, left, integer(next, 113, left - 11));
    }
    if (index === 6) {
      const left = integer(next, 5, 9) * 100 + 1;
      return subtraction(`grade-three-two-subtract-${index}`, left, integer(next, 113, left - 111));
    }
    const left = integer(next, 5, 10) * 100 + 1;
    return subtraction(`grade-three-two-subtract-${index}`, left, integer(next, 113, left - 11));
  });

  return { seed, additions, subtractions };
}
