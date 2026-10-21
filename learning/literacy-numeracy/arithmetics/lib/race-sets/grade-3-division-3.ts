// grade-3-division-3 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type Fact = { dividend: number; divisor: number; quotient: number };
export type Problem = Fact & { id: string };
export type ProblemSet = { seed: number; columns: Problem[][] };

export function facts(divisor: number, dividends: number[]): Fact[] {
  return dividends.map((dividend) => ({ dividend, divisor, quotient: dividend / divisor }));
}

export const TWO_FACTS = facts(2, [98, 96, 94, 92, 90, 78, 76, 74, 72, 70, 58, 56, 54, 52, 50, 38, 36, 34, 32, 30]);
export const FOUR_FACTS = facts(4, [96, 92, 76, 72, 68, 64, 60, 56, 52]);
export const THREE_FACTS = facts(3, [87, 84, 81, 78, 75, 72, 57, 54, 51, 48, 45, 42]);
export const FIVE_FACTS = facts(5, [95, 90, 85, 80, 75, 70, 65, 60]);
export const SIX_FACTS = facts(6, [96, 90, 84, 78, 72]);
export const SEVEN_FACTS = facts(7, [98, 91, 84]);
export const EIGHT_FACTS = facts(8, [96]);
export const FIRST_GROUP = [...TWO_FACTS, ...FOUR_FACTS];
export const SECOND_GROUP = [...THREE_FACTS, ...FIVE_FACTS, ...SIX_FACTS, ...SEVEN_FACTS, ...EIGHT_FACTS];
export const SOURCE_FACTS = [...FIRST_GROUP, ...SECOND_GROUP];

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

export function shuffle<T>(values: T[], next: () => number) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(next() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function createProblems(prefix: string, values: Fact[]): Problem[] {
  return values.map((fact, index) => ({ ...fact, id: `${prefix}-${index}` }));
}

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  const review = shuffle(SOURCE_FACTS, next);
  return {
    seed,
    columns: [
      createProblems("division-three-first", FIRST_GROUP),
      createProblems("division-three-second", SECOND_GROUP),
      createProblems("division-three-review-a", review.slice(0, 29)),
      createProblems("division-three-review-b", review.slice(29)),
    ],
  };
}
