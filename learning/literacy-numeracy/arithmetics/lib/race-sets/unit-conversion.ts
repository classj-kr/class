// unit-conversion 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type DisplayPart = { value: string; unit: string };
export type AnswerPart = DisplayPart & { key: string };
export type ConversionProblem = { id: string; left: DisplayPart[]; answer: AnswerPart[] };
export type ProblemSet = { seed: number; problems: ConversionProblem[] };
export type DecimalValue = { units: number; places: number };

export const UNIT_EXPONENT: Record<string, number> = {
  km: 6,
  m: 3,
  cm: 1,
  mm: 0,
  kg: 6,
  g: 3,
  mg: 0,
  L: 3,
  mL: 0,
};

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

export function choose<T>(next: () => number, values: readonly T[]) {
  return values[integer(next, 0, values.length - 1)];
}

export function formatDecimal(units: number, places: number) {
  if (places <= 0) return String(units * 10 ** -places);
  const factor = 10 ** places;
  const whole = Math.floor(units / factor);
  const fraction = String(units % factor).padStart(places, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : String(whole);
}

export function converted(value: DecimalValue, sourceUnit: string, targetUnit: string) {
  const shiftedPlaces = value.places - (UNIT_EXPONENT[sourceUnit] - UNIT_EXPONENT[targetUnit]);
  return formatDecimal(value.units, shiftedPlaces);
}

export function simpleProblem(index: number, answer: DecimalValue, answerUnit: string, leftUnit: string): ConversionProblem {
  return {
    id: `unit-conversion-${index}`,
    left: [{ value: converted(answer, answerUnit, leftUnit), unit: leftUnit }],
    answer: [{ key: "value", value: formatDecimal(answer.units, answer.places), unit: answerUnit }],
  };
}

export function digitOrZero(next: () => number) {
  return integer(next, 0, 1) * integer(next, 1, 9);
}

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  const problems: ConversionProblem[] = [];

  // ① mm를 km, m, cm 중 하나로 바꾸어 제시
  problems.push(simpleProblem(0, { units: integer(next, 1, 19), places: 0 }, "mm", choose(next, ["km", "m", "cm"] as const)));

  // ② cm를 m 또는 mm로 바꾸어 제시
  problems.push(simpleProblem(1, { units: integer(next, 1, 99), places: integer(next, 0, 1) }, "cm", choose(next, ["m", "mm"] as const)));

  // ③⑤ m를 km, cm, mm 중 하나로 바꾸어 제시
  problems.push(simpleProblem(2, { units: integer(next, 1, 199), places: integer(next, 0, 2) }, "m", choose(next, ["km", "cm", "mm"] as const)));

  // ④ km를 m, cm, mm 중 하나로 바꾸어 제시
  problems.push(simpleProblem(3, { units: integer(next, 11, 99), places: integer(next, 1, 3) }, "km", choose(next, ["m", "cm", "mm"] as const)));

  problems.push(simpleProblem(4, { units: integer(next, 1, 99), places: integer(next, 0, 2) }, "m", choose(next, ["km", "cm", "mm"] as const)));

  // ⑥ g와 kg/mg 사이의 변환
  problems.push(simpleProblem(5, { units: integer(next, 11, 999), places: integer(next, 0, 2) }, choose(next, ["kg", "mg"] as const), "g"));

  // ⑦ kg와 g/mg 사이의 변환
  const massPlaces = integer(next, 0, 1);
  const massUnits = integer(next, 111, 999) + integer(next, 2, 500) * 10 ** massPlaces;
  problems.push(simpleProblem(6, { units: massUnits, places: massPlaces }, choose(next, ["g", "mg"] as const), "kg"));

  // ⑧ L와 mL 사이의 변환
  const volumeAnswerUnit = choose(next, ["L", "mL"] as const);
  problems.push(simpleProblem(7, { units: integer(next, 11, 1999), places: integer(next, 0, 3) }, volumeAnswerUnit, volumeAnswerUnit === "L" ? "mL" : "L"));

  // ⑨ 소수 km를 km, m, cm, mm로 나누어 쓰기
  const kilometers = integer(next, 0, 3);
  const meters = digitOrZero(next) + digitOrZero(next) * 10 + digitOrZero(next) * 100;
  const centimeters = digitOrZero(next) + digitOrZero(next) * 10;
  const millimeters = digitOrZero(next);
  problems.push({
    id: "unit-conversion-8",
    left: [{ value: formatDecimal(kilometers * 1_000_000 + meters * 1_000 + centimeters * 10 + millimeters, 6), unit: "km" }],
    answer: [
      { key: "km", value: String(kilometers), unit: "km" },
      { key: "m", value: String(meters), unit: "m" },
      { key: "cm", value: String(centimeters), unit: "cm" },
      { key: "mm", value: String(millimeters), unit: "mm" },
    ],
  });

  // ⑩ km와 m를 소수 km로 합쳐 쓰기
  const compositeKilometers = integer(next, 1, 3);
  const compositeMeters = integer(next, 1, 9) + digitOrZero(next) * 10;
  problems.push({
    id: "unit-conversion-9",
    left: [{ value: String(compositeKilometers), unit: "km" }, { value: String(compositeMeters), unit: "m" }],
    answer: [{ key: "km", value: formatDecimal(compositeKilometers * 1000 + compositeMeters, 3), unit: "km" }],
  });

  // ⑪ 소수 m를 m, cm, mm로 나누어 쓰기
  const wholeMeters = integer(next, 10, 11);
  const splitCentimeters = digitOrZero(next) + digitOrZero(next) * 10;
  const splitMillimeters = integer(next, 1, 9);
  problems.push({
    id: "unit-conversion-10",
    left: [{ value: formatDecimal(wholeMeters * 1000 + splitCentimeters * 10 + splitMillimeters, 3), unit: "m" }],
    answer: [
      { key: "m", value: String(wholeMeters), unit: "m" },
      { key: "cm", value: String(splitCentimeters), unit: "cm" },
      { key: "mm", value: String(splitMillimeters), unit: "mm" },
    ],
  });

  // ⑫ m와 cm/mm를 소수 m로 합쳐 쓰기
  const finalMeters = integer(next, 10, 11);
  const finalUnit = choose(next, ["cm", "mm"] as const);
  const finalSmallValue = integer(next, 1, 9);
  const finalMillimeters = finalMeters * 1000 + finalSmallValue * (finalUnit === "cm" ? 10 : 1);
  problems.push({
    id: "unit-conversion-11",
    left: [{ value: String(finalMeters), unit: "m" }, { value: String(finalSmallValue), unit: finalUnit }],
    answer: [{ key: "m", value: formatDecimal(finalMillimeters, 3), unit: "m" }],
  });

  return { seed, problems };
}

export function sanitizeDecimal(value: string) {
  const filtered = value.replace(/[^0-9.]/g, "");
  const decimalIndex = filtered.indexOf(".");
  if (decimalIndex === -1) return filtered.slice(0, 10);
  return `${filtered.slice(0, decimalIndex + 1)}${filtered.slice(decimalIndex + 1).replace(/\./g, "")}`.slice(0, 10);
}

export function matchesDecimal(value: string | undefined, expected: string) {
  if (!value || !/^\d+(?:\.\d+)?$/.test(value)) return false;
  return Number(value) === Number(expected);
}
