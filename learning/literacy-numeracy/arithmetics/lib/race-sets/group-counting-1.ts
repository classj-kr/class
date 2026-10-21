// group-counting-1 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type GroupProblem = { id: string; symbol: string; columns: number; rows: number; answer: number };
export type ProblemSet = { seed: number; problems: GroupProblem[] };

export const SYMBOLS = ["♧", "♤", "☆", "♡", "♪", "◈"] as const;
export const NUMBERS = ["①", "②", "③", "④", "⑤", "⑥"] as const;

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
  const columns = shuffle([3, 4, 5, 6, 7, 8], next);
  const rows = shuffle([4, 5, 6, 7, 8, 9], next);
  return {
    seed,
    problems: SYMBOLS.map((symbol, index) => ({
      id: `group-${index}`,
      symbol,
      columns: columns[index],
      rows: rows[index],
      answer: columns[index] * rows[index],
    })),
  };
}
