// grade-3-division-1 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type DivisionKind = "quotative" | "partitive";
export type GroupOption = { groupSize: number; groupCount: number };
export type Card = { equation: string; option: GroupOption };
export type StoryProblem = {
  id: string;
  templateIndex: number;
  position: number;
  divisor: number;
  kind: DivisionKind;
  cards: [Card, Card, Card, Card];
  correctCard: 0 | 1 | 2 | 3;
};
export type ProblemSet = { seed: number; problems: StoryProblem[] };

export const CARD_ORDER: [Card, Card, Card, Card] = [
  { equation: "6÷2=3", option: { groupSize: 2, groupCount: 3 } },
  { equation: "6÷3=2", option: { groupSize: 3, groupCount: 2 } },
  { equation: "6÷2=3", option: { groupSize: 3, groupCount: 2 } },
  { equation: "6÷3=2", option: { groupSize: 2, groupCount: 3 } },
];
export const STORY_KINDS: DivisionKind[] = [
  "quotative",
  "partitive",
  "quotative",
  "partitive",
  "quotative",
  "partitive",
  "quotative",
  "partitive",
  "partitive",
  "quotative",
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

export function shuffledTemplateOrder(next: () => number) {
  const order = STORY_KINDS.map((_, templateIndex) => templateIndex);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  return {
    seed,
    problems: shuffledTemplateOrder(next).map((templateIndex, position) => {
      const kind = STORY_KINDS[templateIndex];
      const divisor = integer(next, 2, 3);
      const quotient = 6 / divisor;
      const groupSize = kind === "quotative" ? divisor : quotient;
      const groupCount = 6 / groupSize;
      const correctOption: GroupOption = { groupSize, groupCount };
      const correctEquation = `6÷${divisor}=${quotient}`;
      const correctCard = CARD_ORDER.findIndex((card) => card.equation === correctEquation && card.option.groupSize === correctOption.groupSize) as 0 | 1 | 2 | 3;
      return { id: `division-story-${position}`, templateIndex, position, divisor, kind, cards: CARD_ORDER, correctCard };
    }),
  };
}

// 문제 글. 학습지와 카드가 같은 문장을 쓴다.
export function story(problem: StoryProblem) {
  const value = problem.divisor;
  switch (problem.templateIndex) {
    case 0: return `선물 6개를 한 명당 ${value}개씩 주면 몇 명이 받을까요?`;
    case 1: return `선물 6개를 ${value}명이 똑같이 나누면 한 명당 몇 개일까요?`;
    case 2: return `계란 6개를 한 묶음에 ${value}개씩 담으면 몇 묶음이 될까요?`;
    case 3: return `계란 6개를 똑같이 나누어 ${value}묶음으로 만들면 한 묶음에 몇 개일까요?`;
    case 4: return `과일 6개를 하루에 ${value}개씩 먹으면 며칠 걸릴까요?`;
    case 5: return `과일 6개를 ${value}일 동안 똑같이 나누어 먹으면 하루에 몇 개일까요?`;
    case 6: return `학습지 6장을 하루에 ${value}장씩 풀면 며칠 걸릴까요?`;
    case 7: return `학습지 6장을 ${value}일 동안 똑같이 나누어 풀려면 하루에 몇 장씩 풀까요?`;
    case 8: return `친구 6명이 자동차 ${value}대에 똑같이 나누어 타면 한 차에 몇 명일까요?`;
    default: return `친구 6명이 한 차에 ${value}명씩 타면 차가 몇 대 필요할까요?`;
  }
}
