import assert from "node:assert/strict";
import test from "node:test";
import { cardFields, hasRaceCards, isRaceAnswerCorrect, raceCard, type RaceCard } from "../lib/race-cards.ts";
import { rankCardParticipants } from "../lib/arithmetic-race-ranking.ts";
import { memoryRaceStore, raceCardScore } from "../lib/arithmetic-race-store.ts";
import { raceReadyWorksheets } from "../lib/arithmetic-worksheets.ts";

const cardRoutes = raceReadyWorksheets.map((worksheet) => worksheet.route).filter(hasRaceCards);

// 카드에 적힌 첫 번째 정답들을 그대로 넣은 답.
export function firstAnswers(card: RaceCard) {
  if (card.choices) return { choice: card.answers.choice[0] };
  return Object.fromEntries(cardFields(card).map((field) => [field.blank, ` ${card.answers[field.blank][0]} `]));
}

test("every card worksheet gives the same endless, gradable cards for the same seed", () => {
  assert.ok(cardRoutes.length >= 15);
  for (const route of cardRoutes) {
    for (const index of [0, 7, 59, 160, 400]) {
      const card = raceCard(route, 20260720, index);
      assert.ok(card, `${route} #${index}`);
      assert.deepEqual(raceCard(route, 20260720, index), card);
      const ids = card.choices ? ["choice"] : cardFields(card).map((field) => field.blank);
      assert.ok(ids.length > 0, `${route} #${index} has no answer field`);
      assert.equal(new Set(ids).size, ids.length, `${route} #${index} repeats a field id`);
      for (const id of ids) assert.ok(card.answers[id]?.length, `${route} #${index} has no answer for ${id}`);
      if (card.choices) assert.ok(card.choices.includes(card.answers.choice[0]), `${route} #${index} answer is not a choice`);
      assert.ok(isRaceAnswerCorrect(card, firstAnswers(card)), `${route} #${index}`);
      assert.ok(!isRaceAnswerCorrect(card, {}), `${route} #${index}`);
    }
  }
});

test("unknown worksheets have no cards", () => {
  assert.equal(hasRaceCards("/arithmetic/unknown"), false);
  assert.equal(raceCard("/arithmetic/unknown", 1, 0), null);
});

test("card scores: correct +1, wrong -1 on the same card, give up -2, each card counted once", async () => {
  const store = memoryRaceStore();
  const now = Date.now();
  await store.openRace({ room_code: "4321", teacher_token: "h", worksheet_name: "", worksheet_route: "/arithmetic/multiplication-5", seed: 1, status: "waiting", created_at: now, started_at: null, duration_seconds: 60 },
    { id: "a", room_code: "4321", name: "가", participant_token: "t", joined_at: now, submitted_at: null, correct_count: null, total_count: null, mistake_count: 0 });
  const base = { roomCode: "4321", participantId: "a", participantToken: "t", at: now };
  assert.equal(await store.recordCard({ ...base, cardIndex: 0, outcome: "correct" }), true);
  assert.equal(await store.recordCard({ ...base, cardIndex: 0, outcome: "correct" }), false);
  assert.equal(await store.recordCard({ ...base, cardIndex: 1, outcome: "wrong" }), true);
  assert.equal(await store.recordCard({ ...base, cardIndex: 1, outcome: "wrong" }), true);
  assert.equal(await store.recordCard({ ...base, cardIndex: 1, outcome: "correct" }), true);
  assert.equal(await store.recordCard({ ...base, cardIndex: 2, outcome: "skip" }), true);
  const [row] = await store.participants("4321");
  // +1 −1 −1 +1 −2 = −2
  assert.deepEqual([row.score, row.correct_count, row.mistake_count, row.skip_count, row.card_index], [-2, 2, 2, 1, 3]);
});

test("combo bonus: the 5th straight correct answer earns +2, the 10th +3, a miss resets it", async () => {
  const store = memoryRaceStore();
  const now = Date.now();
  await store.openRace({ room_code: "5555", teacher_token: "h", worksheet_name: "", worksheet_route: "/arithmetic/multiplication-5", seed: 1, status: "waiting", created_at: now, started_at: null, duration_seconds: 60 },
    { id: "a", room_code: "5555", name: "가", participant_token: "t", joined_at: now, submitted_at: null, correct_count: null, total_count: null, mistake_count: 0 });
  const base = { roomCode: "5555", participantId: "a", participantToken: "t", at: now };
  let card = 0;
  for (let i = 0; i < 10; i += 1) await store.recordCard({ ...base, cardIndex: card++, outcome: "correct" });
  let [row] = await store.participants("5555");
  // 1·1·1·1·2·2·2·2·2·3
  assert.deepEqual([row.score, row.combo], [17, 10]);
  await store.recordCard({ ...base, cardIndex: card, outcome: "wrong" });
  await store.recordCard({ ...base, cardIndex: card++, outcome: "correct" });
  [row] = await store.participants("5555");
  assert.deepEqual([row.score, row.combo], [17, 1], "a miss drops the bonus back to +1");
  assert.equal(raceCardScore("correct", 4), 2);
  assert.equal(raceCardScore("skip", 9), -2);
});

test("card ranking: score, then correct answers, then who got there first", () => {
  const ranked = rankCardParticipants([
    { name: "가", score: 3, correct_count: 3, scored_at: 30 },
    { name: "나", score: 5, correct_count: 6, scored_at: 50 },
    { name: "다", score: 3, correct_count: 4, scored_at: 40 },
    { name: "라", score: 3, correct_count: 3, scored_at: 20 },
  ]);
  assert.deepEqual(ranked.map((row) => row.name), ["나", "다", "라", "가"]);
});
