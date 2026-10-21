// grade-4-decimals 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type Operator = "+" | "−";
export type DecimalProblem = { id: string; operator: Operator; left: string; right: string; answer: string };
export type ProblemSet = { seed: number; problems: DecimalProblem[] };

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

export function powerOfTen(places: number) {
  return 10 ** places;
}

export function formatDecimal(units: number, places: number) {
  if (places === 0) return String(units);
  const factor = powerOfTen(places);
  const whole = Math.floor(units / factor);
  const fraction = String(units % factor).padStart(places, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : String(whole);
}

export function makeProblem(
  index: number,
  operator: Operator,
  leftUnits: number,
  leftPlaces: number,
  rightUnits: number,
  rightPlaces: number,
): DecimalProblem {
  const places = Math.max(leftPlaces, rightPlaces);
  const alignedLeft = leftUnits * powerOfTen(places - leftPlaces);
  const alignedRight = rightUnits * powerOfTen(places - rightPlaces);
  const answerUnits = operator === "+" ? alignedLeft + alignedRight : alignedLeft - alignedRight;
  return {
    id: `grade-four-decimal-${index}`,
    operator,
    left: formatDecimal(leftUnits, leftPlaces),
    right: formatDecimal(rightUnits, rightPlaces),
    answer: formatDecimal(answerUnits, places),
  };
}

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  const problems: DecimalProblem[] = [];

  // ①② 소수 둘째 자리까지의 뺄셈
  for (let index = 0; index < 2; index += 1) {
    const left = integer(next, 2, 9999);
    problems.push(makeProblem(index, "−", left, 2, integer(next, 1, left - 1), 2));
  }

  // ③ 80, 90, 100에서 소수 둘째 자리 수 빼기
  const wholeTens = integer(next, 8, 10) * 10;
  problems.push(makeProblem(2, "−", wholeTens, 0, integer(next, 1, wholeTens * 100 - 1), 2));

  // ④ 소수 첫째 자리와 둘째 자리의 덧셈
  problems.push(makeProblem(3, "+", integer(next, 1, 999), 1, integer(next, 1, 9999), 2));

  // ⑤ 소수 첫째 자리와 셋째 자리의 덧셈
  problems.push(makeProblem(4, "+", integer(next, 1, 444), 1, integer(next, 1, 44444), 3));

  // ⑥ 자연수에서 소수 둘째 자리 수 빼기
  const whole = integer(next, 1, 12);
  problems.push(makeProblem(5, "−", whole, 0, integer(next, 1, whole * 100 - 1), 2));

  // ⑦ 소수 첫째 자리에서 소수 셋째 자리 수 빼기
  const tenths = integer(next, 1, 999);
  problems.push(makeProblem(6, "−", tenths, 1, integer(next, 1, tenths * 100 - 1), 3));

  // ⑧ 소수 둘째 자리까지의 덧셈
  problems.push(makeProblem(7, "+", integer(next, 1, 9999), 2, integer(next, 1, 9999), 2));

  return { seed, problems };
}

export function sanitizeDecimal(value: string) {
  const filtered = value.replace(/[^0-9.]/g, "");
  const decimalIndex = filtered.indexOf(".");
  if (decimalIndex === -1) return filtered.slice(0, 7);
  return `${filtered.slice(0, decimalIndex + 1)}${filtered.slice(decimalIndex + 1).replace(/\./g, "")}`.slice(0, 7);
}

export function matchesDecimal(value: string | undefined, expected: string) {
  if (!value || !/^\d+(?:\.\d+)?$/.test(value)) return false;
  return Number(value) === Number(expected);
}
