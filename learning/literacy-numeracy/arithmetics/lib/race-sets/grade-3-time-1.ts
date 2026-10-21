// grade-3-time-1 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type TimeProblem = {
  id: string;
  major: number;
  minor: number;
  majorUnit: "시간" | "분";
  minorUnit: "분" | "초";
  answerUnit: "분" | "초";
  result: number;
};
export type ProblemSet = { seed: number; problems: TimeProblem[] };

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

export function shuffle<T>(values: T[], next: () => number) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(next() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function makeProblem(id: string, major: number, minor: number, kind: "hours" | "minutes"): TimeProblem {
  return kind === "hours"
    ? { id, major, minor, majorUnit: "시간", minorUnit: "분", answerUnit: "분", result: major * 60 + minor }
    : { id, major, minor, majorUnit: "분", minorUnit: "초", answerUnit: "초", result: major * 60 + minor };
}

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  const hours = shuffle(Array.from({ length: 8 }, (_, index) => index + 1), next).slice(0, 6);
  const minutes = shuffle(Array.from({ length: 8 }, (_, index) => index + 1), next).slice(0, 6);
  const problems = Array.from({ length: 6 }, (_, index) => {
    const minimum = index % 2 === 0 ? 1 : 11;
    return [
      makeProblem(`grade-three-time-hours-${index}`, hours[index], integer(next, minimum, 59), "hours"),
      makeProblem(`grade-three-time-minutes-${index}`, minutes[index], integer(next, minimum, 59), "minutes"),
    ];
  }).flat();
  return { seed, problems };
}
