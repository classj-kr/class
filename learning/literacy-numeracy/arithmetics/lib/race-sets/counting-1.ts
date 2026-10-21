// counting-1 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type CountingSet = {
  seed: number;
  counts: number[];
  countSymbols: string[];
  drawSymbols: string[];
};

export type Answers = {
  numbers: string[];
  words: string[];
  drawings: number[];
};

export const NUMBER_WORDS = ["", "한", "두", "세", "네", "다섯", "여섯", "일곱", "여덟", "아홉"];

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

export function createCountingSet(seed: number): CountingSet {
  const next = random(seed);
  return {
    seed,
    counts: shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], next),
    countSymbols: shuffle(["☆", "♡", "♧"], next),
    drawSymbols: shuffle(["○", "△", "□"], next),
  };
}

export function emptyAnswers(): Answers {
  return {
    numbers: ["", "", ""],
    words: ["", "", ""],
    drawings: [0, 0, 0],
  };
}
