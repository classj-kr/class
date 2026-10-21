// square-numbers 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type Fact = { left: number; right: number };
export type Problem = Fact & { id: string; product: number };
export type ProblemSet = { seed: number; columns: Problem[][] };

export const SQUARE_NUMBERS = Array.from({ length: 9 }, (_, index) => index + 11);
export const POWER_PRODUCTS: Fact[] = [
  { left: 8, right: 128 },
  { left: 16, right: 16 },
  { left: 32, right: 32 },
  { left: 8, right: 64 },
  { left: 25, right: 25 },
  { left: 5, right: 125 },
  { left: 16, right: 32 },
  { left: 8, right: 16 },
  { left: 4, right: 256 },
];
export const TWO_POWERS = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];
export const FIVE_POWERS = [5, 25, 125, 625];
export const MEMORY_VALUES = [
  ...TWO_POWERS.map((value, index) => ({ id: `square-memory-two-${index}`, value })),
  ...FIVE_POWERS.map((value, index) => ({ id: `square-memory-five-${index}`, value })),
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

export function shuffle<T>(values: T[], next: () => number) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(next() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  const firstSquares = shuffle(SQUARE_NUMBERS, next).map((number, index) => ({ id: `square-first-${index}`, left: number, right: number, product: number ** 2 }));
  const secondSquares = shuffle(SQUARE_NUMBERS, next).map((number, index) => ({ id: `square-second-${index}`, left: number, right: number, product: number ** 2 }));
  const powerProducts = shuffle(POWER_PRODUCTS, next).map((fact, index) => ({ id: `square-power-${index}`, ...fact, product: fact.left * fact.right }));
  return { seed, columns: [firstSquares, secondSquares, powerProducts] };
}
