// number-reading-1 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type ReadingProblem = { id: string; number: number; answer: string };
export type ProblemSet = { seed: number; sinoKorean: ReadingProblem[]; nativeKorean: ReadingProblem[] };

export const SINO_DIGITS = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
export const NATIVE_TENS = ["", "열", "스물", "서른", "마흔", "쉰", "예순", "일흔", "여든", "아흔"];
export const NATIVE_ONES = ["", "하나", "둘", "셋", "넷", "다섯", "여섯", "일곱", "여덟", "아홉"];

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

export function sinoKoreanReading(number: number) {
  const tens = Math.floor(number / 10);
  const ones = number % 10;
  return `${tens === 1 ? "" : SINO_DIGITS[tens]}십${SINO_DIGITS[ones]}`;
}

export function nativeKoreanReading(number: number) {
  return `${NATIVE_TENS[Math.floor(number / 10)]}${NATIVE_ONES[number % 10]}`;
}

export function numberSequence(next: () => number) {
  const tens = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], next);
  const ones = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], next);
  return tens.map((ten, index) => ten * 10 + ones[index]);
}

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  const sinoKorean = numberSequence(next).map((number, index) => ({
    id: `sino-${index}`,
    number,
    answer: sinoKoreanReading(number),
  }));
  const nativeKorean = numberSequence(next).map((number, index) => ({
    id: `native-${index}`,
    number,
    answer: nativeKoreanReading(number),
  }));
  return { seed, sinoKorean, nativeKorean };
}

export function normalizeAnswer(value: string) {
  return value.normalize("NFC").replace(/\s+/g, "");
}
