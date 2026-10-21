// grade-4-number-reading 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type Direction = "to-korean" | "to-number";
export type Problem = { id: string; direction: Direction; number: string; reading: string };
export type ProblemSet = { seed: number; problems: Problem[] };

export const DIGITS = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
export const SMALL_UNITS = ["천", "백", "십", ""];
export const LARGE_UNITS = ["조", "억", "만", ""];
export const FIRST_DIGITS = ["1", "1", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
export const OTHER_DIGITS = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "1", "1", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
export const WRITE_LENGTH_GROUPS = [[15, 16], [13, 14], [10, 11, 12], [7, 8, 9]] as const;
export const READ_LENGTH_GROUPS = [[15, 16], [13, 14], [10, 11, 12], [7, 8, 9], [5, 6]] as const;

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

export function pick<T>(values: readonly T[], next: () => number) {
  return values[Math.floor(next() * values.length)];
}

export function randomNumber(length: number, next: () => number) {
  let value = pick(FIRST_DIGITS, next);
  for (let index = 1; index < length; index += 1) value += pick(OTHER_DIGITS, next);
  return value;
}

export function readFourDigits(value: string) {
  return value.padStart(4, "0").split("").map((character, index) => {
    const digit = Number(character);
    if (digit === 0) return "";
    const digitName = digit === 1 && index < 3 ? "" : DIGITS[digit];
    return `${digitName}${SMALL_UNITS[index]}`;
  }).join("");
}

export function koreanNumberReading(number: string) {
  const padded = number.padStart(Math.ceil(number.length / 4) * 4, "0");
  const groupCount = padded.length / 4;
  const parts: string[] = [];
  for (let index = 0; index < groupCount; index += 1) {
    const group = readFourDigits(padded.slice(index * 4, index * 4 + 4));
    if (!group) continue;
    parts.push(`${group}${LARGE_UNITS[4 - groupCount + index]}`);
  }
  return parts.join(" ");
}

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  const writeNumbers = WRITE_LENGTH_GROUPS.map((lengths) => randomNumber(pick(lengths, next), next));
  const specialLength = 9 + Math.floor(next() * 8);
  writeNumbers.push(`${pick(FIRST_DIGITS, next)}${"0".repeat(specialLength - 1)}`);
  const readNumbers = READ_LENGTH_GROUPS.map((lengths) => randomNumber(pick(lengths, next), next));
  const problems = [
    ...writeNumbers.map((number, index): Problem => ({
      id: `grade-four-number-write-${index}`,
      direction: "to-korean",
      number,
      reading: koreanNumberReading(number),
    })),
    ...readNumbers.map((number, index): Problem => ({
      id: `grade-four-number-read-${index}`,
      direction: "to-number",
      number,
      reading: koreanNumberReading(number),
    })),
  ];
  return { seed, problems };
}

export function normalizeKorean(value: string) {
  return value.normalize("NFC").replace(/\s+/g, "");
}

export function normalizeNumber(value: string) {
  return value.replace(/[\s,]+/g, "");
}
