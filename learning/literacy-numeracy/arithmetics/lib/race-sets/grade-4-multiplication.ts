// grade-4-multiplication 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type Layout = "horizontal" | "vertical";
export type Problem = { id: string; top: number; bottom: number; result: number; layout: Layout };
export type ProblemSet = { seed: number; problems: Problem[] };

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

export function tensMultiple(next: () => number, minimumDigit: number, maximumDigit: number, minimumPower: number, maximumPower: number) {
  return integer(next, minimumDigit, maximumDigit) * (10 ** integer(next, minimumPower, maximumPower));
}

export function problem(id: string, top: number, bottom: number, layout: Layout): Problem {
  return { id, top, bottom, result: top * bottom, layout };
}

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  const problems: Problem[] = [
    ...Array.from({ length: 2 }, (_, index) => problem(
      `grade-four-multiply-horizontal-${index}`,
      tensMultiple(next, 2, 6, 1, 3),
      tensMultiple(next, 2, 6, 2, 3),
      "horizontal",
    )),
    problem("grade-four-multiply-vertical-0", integer(next, 150, 999), integer(next, 15, 99), "vertical"),
    problem("grade-four-multiply-vertical-1", integer(next, 150, 999), tensMultiple(next, 5, 9, 1, 1), "vertical"),
    problem("grade-four-multiply-vertical-2", integer(next, 150, 999), integer(next, 15, 99), "vertical"),
    problem("grade-four-multiply-vertical-3", tensMultiple(next, 15, 99, 1, 1), tensMultiple(next, 5, 9, 1, 1), "vertical"),
    problem("grade-four-multiply-vertical-4", integer(next, 150, 999), tensMultiple(next, 5, 9, 1, 1), "vertical"),
    problem("grade-four-multiply-vertical-5", integer(next, 150, 999), integer(next, 15, 99), "vertical"),
    problem("grade-four-multiply-vertical-6", integer(next, 777, 999), integer(next, 77, 99), "vertical"),
    problem("grade-four-multiply-vertical-7", integer(next, 7777, 9999), integer(next, 77, 99), "vertical"),
    problem("grade-four-multiply-vertical-8", integer(next, 4444, 9999), tensMultiple(next, 3, 9, 2, 3), "vertical"),
  ];
  return { seed, problems };
}
