// give-and-take-1 학습지와 순위전 카드가 함께 쓰는 문제 만들기.
export type Friend = "토끼" | "거북이" | "호랑이";
export type Counts = Record<Friend, number>;
export type ProblemSet = {
  seed: number;
  initial: Counts;
  first: { toTurtle: number; toTiger: number; after: Counts };
  second: { toTiger: number; fromRabbit: number; after: Counts };
  third: { fromRabbit: number; toTurtle: number; after: Counts; asked: Friend };
};

export const FRIENDS: Friend[] = ["토끼", "거북이", "호랑이"];

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

export function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  const rabbitCards = integer(next, 7, 9);
  const initial: Counts = {
    토끼: rabbitCards,
    거북이: rabbitCards - integer(next, 3, 5),
    호랑이: integer(next, 1, 3),
  };

  const firstToSeulgi = integer(next, 1, 2);
  const firstToCourage = 1;
  const firstAfter: Counts = {
    토끼: initial.토끼 - firstToSeulgi - firstToCourage,
    거북이: initial.거북이 + firstToSeulgi,
    호랑이: initial.호랑이 + firstToCourage,
  };

  const secondToCourage = integer(next, 1, 2);
  const secondFromWisdom = integer(next, 1, 2);
  const secondAfter: Counts = {
    토끼: firstAfter.토끼 - secondFromWisdom,
    거북이: firstAfter.거북이 - secondToCourage + secondFromWisdom,
    호랑이: firstAfter.호랑이 + secondToCourage,
  };

  const thirdFromWisdom = integer(next, 1, 2);
  const thirdToSeulgi = integer(next, 1, 3);
  const thirdAfter: Counts = {
    토끼: secondAfter.토끼 - thirdFromWisdom,
    거북이: secondAfter.거북이 + thirdToSeulgi,
    호랑이: secondAfter.호랑이 + thirdFromWisdom - thirdToSeulgi,
  };

  return {
    seed,
    initial,
    first: { toTurtle: firstToSeulgi, toTiger: firstToCourage, after: firstAfter },
    second: { toTiger: secondToCourage, fromRabbit: secondFromWisdom, after: secondAfter },
    third: {
      fromRabbit: thirdFromWisdom,
      toTurtle: thirdToSeulgi,
      after: thirdAfter,
      asked: FRIENDS[integer(next, 0, 2)],
    },
  };
}

export function fieldId(question: number, friend?: Friend) {
  return friend ? `q${question}-${friend}` : `q${question}`;
}

export function emptyAnswers() {
  return Object.fromEntries([
    ...FRIENDS.map((friend) => fieldId(1, friend)),
    ...FRIENDS.map((friend) => fieldId(2, friend)),
    fieldId(3),
  ].map((id) => [id, ""]));
}
