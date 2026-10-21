// grade-4-division 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type Problem = { id: string; dividend: number; divisor: number; quotient: number; remainder: number };
export type ProblemSet = { seed: number; problems: Problem[] };

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

export function makeProblem(id: string, dividend: number, divisor: number): Problem {
  return { id, dividend, divisor, quotient: Math.floor(dividend / divisor), remainder: dividend % divisor };
}

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  const problems: Problem[] = [];

  function addProblem(dividend: number, divisor: number) {
    problems.push(makeProblem(`grade-four-division-${problems.length}`, dividend, divisor));
  }

  // XLSM의 B6:C6, E6:F6, H6:I6 수식 계열
  let dividend = integer(next, 555, 809);
  addProblem(dividend, integer(next, Number(String(dividend).slice(0, 2)) + 1, 99));
  addProblem(integer(next, 666, 999), integer(next, 14, 29));
  let divisor = integer(next, 11, 99);
  addProblem(integer(next, divisor, 999), divisor);

  // XLSM의 B15:C15, E15:F15, H15:I15 수식 계열
  divisor = integer(next, 11, 99);
  addProblem(integer(next, divisor * 10, 990) + integer(next, 0, 9), divisor);
  divisor = integer(next, 11, 99);
  addProblem(integer(next, divisor * 10, 990) + integer(next, 0, 9), divisor);
  dividend = integer(next, 555, 989);
  addProblem(dividend, integer(next, Number(String(dividend).slice(0, 2)) + 1, 99));

  // XLSM의 B24:C24, H24:I24 수식 계열
  divisor = integer(next, 11, 99);
  addProblem(integer(next, divisor, 999), divisor);

  // XLSM의 B32:C32, E32:F32, H32:I32 수식 계열
  dividend = integer(next, 333, 777);
  const leadingPair = Number(String(dividend).slice(0, 2));
  addProblem(dividend, integer(next, leadingPair + 1, leadingPair + 20));
  divisor = integer(next, 11, 59);
  addProblem(integer(next, divisor * 10, 990) + integer(next, 0, 9), divisor);
  divisor = integer(next, 11, 99);
  addProblem(integer(next, divisor, 999), divisor);

  return { seed, problems };
}
