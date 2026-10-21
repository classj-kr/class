// nineteen-times-table 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type Range = readonly [number, number];
export type Pattern = { left: Range; right: Range };
export type Problem = { id: string; left: number; right: number; product: number };
export type ProblemSet = { seed: number; columns: Problem[][] };

export const GROUPED_RIGHT_RANGES: Range[] = [[11, 13], [14, 16], [17, 19]];

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

export function shuffle<T>(values: T[], next: () => number) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(next() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function sourcePatterns(): Pattern[] {
  const elevenThroughEighteen = Array.from({ length: 8 }, (_, index) => index + 11)
    .flatMap((left) => GROUPED_RIGHT_RANGES.map((right) => ({ left: [left, left] as Range, right })));
  const nineteen = ([[11, 13], [14, 15], [16, 17], [18, 19]] as Range[])
    .map((right) => ({ left: [19, 19] as Range, right }));
  return [
    ...elevenThroughEighteen,
    ...nineteen,
    { left: [1, 2], right: [16, 20] },
    { left: [14, 19], right: [1, 2] },
  ];
}

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  const generated = sourcePatterns().map((pattern, index) => {
    let left = integer(next, pattern.left);
    let right = integer(next, pattern.right);
    if (index === 28) left *= 10;
    if (index === 29) right *= 10;
    return { id: `nineteen-times-${index}`, left, right, product: left * right };
  });
  const ordered = shuffle(generated, next);
  const columns = Array.from({ length: 3 }, (_, columnIndex) => ordered.slice(columnIndex * 10, columnIndex * 10 + 10));
  return { seed, columns };
}
