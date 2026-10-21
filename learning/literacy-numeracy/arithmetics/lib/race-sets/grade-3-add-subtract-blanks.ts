// grade-3-add-subtract-blanks 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type DigitField =
  | "topHundreds" | "topTens" | "topOnes"
  | "bottomHundreds" | "bottomTens" | "bottomOnes"
  | "resultThousands" | "resultHundreds" | "resultTens" | "resultOnes";
export type DigitProblem = {
  id: string;
  top: number;
  operator: "+" | "−";
  bottom: number;
  result: number;
  hidden: DigitField[];
};
export type ProblemSet = { seed: number; problems: DigitProblem[] };

export const ADDITION_HIDDEN: DigitField[][] = [
  ["topOnes", "bottomTens", "resultHundreds"],
  ["topHundreds", "bottomOnes", "resultTens"],
  ["topTens", "bottomHundreds", "resultOnes"],
];
export const SUBTRACTION_HIDDEN: DigitField[][] = [
  ["topOnes", "bottomHundreds", "resultTens"],
  ["topTens", "bottomOnes", "resultHundreds"],
  ["topHundreds", "bottomTens", "resultOnes"],
];

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

export function digits(problem: DigitProblem): Record<DigitField, string> {
  return {
    topHundreds: String(Math.floor(problem.top / 100)),
    topTens: String(Math.floor(problem.top / 10) % 10),
    topOnes: String(problem.top % 10),
    bottomHundreds: String(Math.floor(problem.bottom / 100)),
    bottomTens: String(Math.floor(problem.bottom / 10) % 10),
    bottomOnes: String(problem.bottom % 10),
    resultThousands: problem.result >= 1000 ? String(Math.floor(problem.result / 1000)) : "",
    resultHundreds: problem.result >= 100 ? String(Math.floor(problem.result / 100) % 10) : "",
    resultTens: String(Math.floor(problem.result / 10) % 10),
    resultOnes: String(problem.result % 10),
  };
}

export function threeDigit(hundreds: number, tens: number, ones: number) {
  return hundreds * 100 + tens * 10 + ones;
}

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  const problems: DigitProblem[] = [];

  function additionGroup(group: number) {
    const topSpecs = [[4, 9, 0, 8, 2, 7], [1, 9, 0, 9, 4, 9], [1, 9, 0, 9, 0, 9]] as const;
    const bottomSpecs = [[1, 9, 0, 9, 4, 9], [1, 9, 0, 9, 2, 9], [1, 9, 0, 9, 0, 9]] as const;
    topSpecs.forEach((topSpec, index) => {
      const [topHundredsMin, topHundredsMax, topTensMin, topTensMax, topOnesMin, topOnesMax] = topSpec;
      const [bottomHundredsMin, bottomHundredsMax, bottomTensMin, bottomTensMax, bottomOnesMin, bottomOnesMax] = bottomSpecs[index];
      const top = threeDigit(
        integer(next, topHundredsMin, topHundredsMax),
        integer(next, topTensMin, topTensMax),
        integer(next, topOnesMin, topOnesMax),
      );
      const bottom = threeDigit(
        integer(next, bottomHundredsMin, bottomHundredsMax),
        integer(next, bottomTensMin, bottomTensMax),
        integer(next, bottomOnesMin, bottomOnesMax),
      );
      problems.push({ id: `grade-three-blank-${group}-${index}`, top, operator: "+", bottom, result: top + bottom, hidden: ADDITION_HIDDEN[index] });
    });
  }

  function subtractionGroup(group: number, secondGroup: boolean) {
    Array.from({ length: 3 }, (_, index) => {
      const topHundreds = integer(next, 4, 9);
      const topTens = integer(next, 0, 8);
      const topOnes = integer(next, 0, 8);
      const bottomHundredsMaximum = index === 1 || (index === 2 && !secondGroup) ? topHundreds - 2 : topHundreds - 1;
      const bottomTensMinimum = index === 0 || (index === 2 && secondGroup) ? topTens : 0;
      const top = threeDigit(topHundreds, topTens, topOnes);
      const bottom = threeDigit(
        integer(next, 1, bottomHundredsMaximum),
        integer(next, bottomTensMinimum, 9),
        integer(next, topOnes + 1, 9),
      );
      problems.push({ id: `grade-three-blank-${group}-${index}`, top, operator: "−", bottom, result: top - bottom, hidden: SUBTRACTION_HIDDEN[index] });
    });
  }

  additionGroup(0);
  subtractionGroup(1, false);
  additionGroup(2);
  subtractionGroup(3, true);
  return { seed, problems };
}

export function answerId(problem: DigitProblem, field: DigitField) {
  return `${problem.id}-${field}`;
}
