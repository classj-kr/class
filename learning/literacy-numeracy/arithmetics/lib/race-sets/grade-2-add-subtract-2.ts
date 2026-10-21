// grade-2-add-subtract-2 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type DigitField = "topTens" | "topOnes" | "bottomTens" | "bottomOnes" | "resultHundreds" | "resultTens" | "resultOnes";
export type DigitProblem = {
  id: string;
  top: number;
  operator: "+" | "−";
  bottom: number;
  result: number;
  hidden: DigitField[];
};
export type ProblemSet = { seed: number; problems: DigitProblem[] };

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
    topTens: String(Math.floor(problem.top / 10)),
    topOnes: String(problem.top % 10),
    bottomTens: String(Math.floor(problem.bottom / 10)),
    bottomOnes: String(problem.bottom % 10),
    resultHundreds: problem.result >= 100 ? String(Math.floor(problem.result / 100)) : "",
    resultTens: problem.result >= 10 ? String(Math.floor(problem.result / 10) % 10) : "",
    resultOnes: String(problem.result % 10),
  };
}

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  const problems: DigitProblem[] = [];

  function additionGroup(group: number) {
    const topSpecs = [[1, 9, 0, 8], [1, 9, 0, 9], [1, 5, 0, 9]] as const;
    const bottomSpecs = [[1, 5, 0, 9], [1, 9, 0, 9], [1, 9, 0, 9]] as const;
    const hidden: DigitField[][] = [
      ["bottomOnes", "resultTens"],
      ["topTens", "resultOnes"],
      ["topOnes", "bottomTens"],
    ];
    const tops = topSpecs.map(([tensMin, tensMax, onesMin, onesMax]) =>
      integer(next, tensMin, tensMax) * 10 + integer(next, onesMin, onesMax),
    );
    const bottoms = bottomSpecs.map(([tensMin, tensMax, onesMin, onesMax]) =>
      integer(next, tensMin, tensMax) * 10 + integer(next, onesMin, onesMax),
    );
    tops.forEach((top, index) => {
      const bottom = bottoms[index];
      problems.push({ id: `digit-${group}-${index}`, top, operator: "+", bottom, result: top + bottom, hidden: hidden[index] });
    });
  }

  function subtractionGroup(group: number) {
    const tops = Array.from({ length: 3 }, () => ({
      tens: integer(next, 4, 9),
      ones: integer(next, 0, 8),
    }));
    const hidden: DigitField[][] = [
      ["bottomTens", "resultOnes"],
      ["topOnes", "resultTens"],
      ["topTens", "bottomOnes"],
    ];
    tops.forEach(({ tens, ones }, index) => {
      const bottomTensMaximum = index === 1 ? tens - 2 : tens - 1;
      const bottom = integer(next, 1, bottomTensMaximum) * 10 + integer(next, ones + 1, 9);
      const top = tens * 10 + ones;
      problems.push({ id: `digit-${group}-${index}`, top, operator: "−", bottom, result: top - bottom, hidden: hidden[index] });
    });
  }

  additionGroup(0);
  subtractionGroup(1);
  additionGroup(2);
  subtractionGroup(3);
  return { seed, problems };
}

export function answerId(problem: DigitProblem, field: DigitField) {
  return `${problem.id}-${field}`;
}
