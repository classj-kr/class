// clock-1 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type ClockProblem = { id: string; hour: number; minute: number; reading: string };
export type ClockResponse = { hour?: string; minute?: string; reading?: string };
export type ProblemSet = { seed: number; problems: ClockProblem[] };

export const PROBLEM_COUNT = 6;
export const CLOCK_NUMBERS = Array.from({ length: 12 }, (_, index) => index + 1);
export const HOUR_WORDS = ["", "한", "두", "세", "네", "다섯", "여섯", "일곱", "여덟", "아홉", "열", "열한", "열두"];
export const NUMBER_WORDS = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
export const MINUTE_STEPS = Array.from({ length: 60 }, (_, index) => index);

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

export function minuteWord(minute: number) {
  if (minute < 10) return NUMBER_WORDS[minute];
  const tens = Math.floor(minute / 10);
  const ones = minute % 10;
  return `${tens === 1 ? "" : NUMBER_WORDS[tens]}십${NUMBER_WORDS[ones]}`;
}

export function clockReading(hour: number, minute: number) {
  return `${HOUR_WORDS[hour]} 시${minute === 0 ? "" : ` ${minuteWord(minute)} 분`}`;
}

export function createProblemSet(seed: number): ProblemSet {
  const candidates = Array.from({ length: 12 }, (_, hourIndex) => (
    MINUTE_STEPS.map((minute) => ({ hour: hourIndex + 1, minute }))
  )).flat();
  return {
    seed,
    problems: shuffle(candidates, random(seed)).slice(0, PROBLEM_COUNT).map((time, index) => ({
      id: `clock-${index + 1}`,
      ...time,
      reading: clockReading(time.hour, time.minute),
    })),
  };
}
