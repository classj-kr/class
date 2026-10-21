// 순위전 카드: 학습지의 문제 만들기를 그대로 써서 한 문제씩 끝없이 내놓는다.
// 같은 방 번호의 seed와 카드 번호면 서버와 학생 화면이 늘 같은 카드를 얻으므로 채점은 서버가 한다.
import type { RaceCard, RaceDeck } from "./race-card-model.ts";
import { decks as basic } from "./race-decks/basic.ts";
import { decks as early } from "./race-decks/early.ts";
import { decks as gradeThree } from "./race-decks/grade-three.ts";
import { decks as fractions } from "./race-decks/fractions.ts";
import { decks as gradeFour } from "./race-decks/grade-four.ts";
import { decks as upper } from "./race-decks/upper.ts";
import { decks as geometry } from "./race-decks/geometry.ts";

export { isRaceAnswerCorrect, raceAnswerText, cardFields, type RaceCard, type RacePart, type RaceField } from "./race-card-model.ts";

export const RACE_DURATIONS = [60, 180, 300] as const;

const decks: Record<string, RaceDeck> = { ...basic, ...early, ...gradeThree, ...fractions, ...gradeFour, ...upper, ...geometry };

export function hasRaceCards(route: string) {
  return Object.prototype.hasOwnProperty.call(decks, route);
}

function mix(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

const deckCache = new Map<string, RaceCard[]>();
function deck(route: string, seed: number, round: number) {
  const key = `${route}|${seed}|${round}`;
  let cards = deckCache.get(key);
  if (!cards) {
    // 한 장의 학습지를 한 묶음으로 쓰고, 묶음마다 seed를 바꾸고 순서도 섞는다.
    const roundSeed = (seed + Math.imul(round + 1, 0x9e3779b1)) >>> 0;
    const next = mix(roundSeed ^ 0x5bd1e995);
    cards = [...decks[route](roundSeed)];
    for (let index = cards.length - 1; index > 0; index -= 1) {
      const target = Math.floor(next() * (index + 1));
      [cards[index], cards[target]] = [cards[target], cards[index]];
    }
    if (deckCache.size > 200) deckCache.clear();
    deckCache.set(key, cards);
  }
  return cards;
}

export function raceCard(route: string, seed: number, index: number): RaceCard | null {
  if (!hasRaceCards(route) || !Number.isInteger(index) || index < 0 || index > 5000) return null;
  let offset = index;
  for (let round = 0; ; round += 1) {
    const cards = deck(route, seed, round);
    if (!cards.length) return null;
    if (offset < cards.length) return cards[offset];
    offset -= cards.length;
  }
}
