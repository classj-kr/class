// grade-3-time-2 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
import { calculateTimeResult, timeAnswerParts, type TimePart, type TimeValue } from "../time-calculation.ts";

export type Operator = "+" | "−";
export type TimeProblem = { id: string; operator: Operator; parts: TimePart[]; answerParts: TimePart[]; left: TimeValue; right: TimeValue; result: TimeValue };
export type ProblemSet = { seed: number; problems: TimeProblem[] };

export const UNIT_LABELS: Record<TimePart, string> = { hours: "시간", minutes: "분", seconds: "초" };

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

export function value(hours = 0, minutes = 0, seconds = 0): TimeValue {
  return { hours, minutes, seconds };
}

export function makeProblem(id: string, operator: Operator, parts: TimePart[], left: TimeValue, right: TimeValue): TimeProblem {
  return {
    id,
    operator,
    parts,
    answerParts: timeAnswerParts(parts, operator),
    left,
    right,
    result: calculateTimeResult(left, operator, right),
  };
}

export function hoursMinutesAddition(next: () => number, id: string) {
  return makeProblem(id, "+", ["hours", "minutes"], value(integer(next, 1, 12), integer(next, 1, 59)), value(integer(next, 1, 11), integer(next, 30, 59)));
}

export function minutesSecondsSubtraction(next: () => number, id: string, narrow = false) {
  const leftMinutes = narrow ? integer(next, 11, 16) : integer(next, 30, 59);
  return makeProblem(id, "−", ["minutes", "seconds"], value(0, leftMinutes, integer(next, 1, 40)), value(0, integer(next, narrow ? 9 : leftMinutes - 9, leftMinutes - 1), integer(next, 30, 59)));
}

export function hoursMinutesSubtraction(next: () => number, id: string) {
  const leftHours = integer(next, 4, 8);
  return makeProblem(id, "−", ["hours", "minutes"], value(leftHours, integer(next, 1, 40)), value(integer(next, 1, leftHours - 1), integer(next, 30, 59)));
}

export function minutesSecondsAddition(next: () => number, id: string) {
  return makeProblem(id, "+", ["minutes", "seconds"], value(0, integer(next, 1, 59), integer(next, 1, 59)), value(0, integer(next, 30, 59), integer(next, 30, 59)));
}

export function mixedSubtractions(next: () => number): TimeProblem[] {
  const firstLeftHours = integer(next, 4, 11);
  const firstLeftSeconds = integer(next, 1, 20);
  const secondLeftHours = integer(next, 4, 11);
  const secondLeftMinutes = integer(next, 1, 20);
  return [
    makeProblem("grade-three-time-two-mixed-0", "−", ["hours", "minutes", "seconds"], value(firstLeftHours, 0, firstLeftSeconds), value(integer(next, 1, firstLeftHours - 1), integer(next, firstLeftSeconds + 1, 59), 0)),
    makeProblem("grade-three-time-two-mixed-1", "−", ["hours", "minutes", "seconds"], value(secondLeftHours, secondLeftMinutes, 0), value(integer(next, 1, secondLeftHours), 0, integer(next, secondLeftMinutes + 1, 59))),
  ];
}

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  return {
    seed,
    problems: [
      hoursMinutesAddition(next, "grade-three-time-two-hm-add-0"),
      minutesSecondsSubtraction(next, "grade-three-time-two-ms-subtract-0"),
      hoursMinutesSubtraction(next, "grade-three-time-two-hm-subtract-0"),
      minutesSecondsAddition(next, "grade-three-time-two-ms-add-0"),
      hoursMinutesAddition(next, "grade-three-time-two-hm-add-1"),
      minutesSecondsSubtraction(next, "grade-three-time-two-ms-subtract-1", true),
      ...mixedSubtractions(next),
    ],
  };
}
