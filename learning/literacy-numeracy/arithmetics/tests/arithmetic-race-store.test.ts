import assert from "node:assert/strict";
import test from "node:test";
import { memoryRaceStore, type ParticipantRow, type RaceRow } from "../lib/arithmetic-race-store.ts";

function race(code: string, createdAt = Date.now()): RaceRow {
  return {
    room_code: code,
    teacher_token: `host-${code}`,
    worksheet_name: "초6 · 자연수÷자연수를 소수로 나타내기",
    worksheet_route: "/arithmetic/grade-six-decimal-one",
    seed: 20260720,
    status: "waiting",
    created_at: createdAt,
    started_at: null,
  };
}

function player(code: string, name: string, joinedAt = Date.now()): ParticipantRow {
  return {
    id: `${code}-${name}`,
    room_code: code,
    name,
    participant_token: `token-${name}`,
    joined_at: joinedAt,
    submitted_at: null,
    correct_count: null,
    total_count: null,
    mistake_count: 0,
  };
}

test("opens a room with its host and refuses a taken room code", async () => {
  const store = memoryRaceStore();
  assert.equal(await store.openRace(race("100001"), player("100001", "방장")), true);
  assert.equal(await store.openRace(race("100001"), player("100001", "다른방장")), false);

  const opened = await store.race("100001");
  assert.equal(opened?.worksheet_route, "/arithmetic/grade-six-decimal-one");
  assert.deepEqual((await store.participants("100001")).map((row) => row.name), ["방장"]);
});

test("refuses a second player with the same name", async () => {
  const store = memoryRaceStore();
  await store.openRace(race("100002"), player("100002", "방장"));
  assert.equal(await store.joinRace(player("100002", "친구")), true);
  assert.equal(await store.joinRace(player("100002", "친구")), false);
  assert.deepEqual((await store.participants("100002")).map((row) => row.name), ["방장", "친구"]);
});

test("starts only for the host and only while waiting", async () => {
  const store = memoryRaceStore();
  await store.openRace(race("100003"), player("100003", "방장"));
  assert.equal(await store.startRace("100003", "낯선토큰", 5000), false);
  assert.equal(await store.startRace("100003", "host-100003", 5000), true);
  assert.equal(await store.startRace("100003", "host-100003", 6000), false);

  const started = await store.race("100003");
  assert.equal(started?.status, "running");
  assert.equal(started?.started_at, 5000);
});

test("keeps the first attempt mistakes and arrives once every answer is right", async () => {
  const store = memoryRaceStore();
  await store.openRace(race("100004"), player("100004", "방장"));
  const attempt = {
    roomCode: "100004",
    participantId: "100004-방장",
    participantToken: "token-방장",
  };

  assert.equal(await store.recordAttempt({ ...attempt, correctCount: 8, totalCount: 10, wrongCount: 2, submittedAt: null }), true);
  assert.equal(await store.recordAttempt({ ...attempt, correctCount: 9, totalCount: 10, wrongCount: 1, submittedAt: null }), true);
  const trying = (await store.participants("100004"))[0];
  assert.equal(trying.mistake_count, 2);
  assert.equal(trying.submitted_at, null);

  assert.equal(await store.recordAttempt({ ...attempt, correctCount: 10, totalCount: 10, wrongCount: 0, submittedAt: 7000 }), true);
  const arrived = (await store.participants("100004"))[0];
  assert.equal(arrived.submitted_at, 7000);
  assert.equal(arrived.correct_count, 10);
  assert.equal(arrived.mistake_count, 2);

  assert.equal(await store.recordAttempt({ ...attempt, correctCount: 10, totalCount: 10, wrongCount: 0, submittedAt: 9000 }), false);
  assert.equal(await store.recordAttempt({ ...attempt, participantToken: "틀린토큰", correctCount: 10, totalCount: 10, wrongCount: 0, submittedAt: 9000 }), false);
});

test("arrives without mistakes when the first attempt is perfect", async () => {
  const store = memoryRaceStore();
  await store.openRace(race("100005"), player("100005", "방장"));
  await store.recordAttempt({
    roomCode: "100005",
    participantId: "100005-방장",
    participantToken: "token-방장",
    correctCount: 10,
    totalCount: 10,
    wrongCount: 0,
    submittedAt: 4000,
  });

  const arrived = (await store.participants("100005"))[0];
  assert.equal(arrived.mistake_count, 0);
  assert.equal(arrived.submitted_at, 4000);
});

test("closes a room only with the host token", async () => {
  const store = memoryRaceStore();
  await store.openRace(race("100006"), player("100006", "방장"));
  await store.closeRace("100006", "낯선토큰");
  assert.notEqual(await store.race("100006"), null);

  await store.closeRace("100006", "host-100006");
  assert.equal(await store.race("100006"), null);
  assert.deepEqual(await store.participants("100006"), []);
});

test("forgets rooms left behind from earlier lessons", async () => {
  let now = 1000;
  const store = memoryRaceStore(() => now);
  await store.openRace(race("100007", now), player("100007", "방장", now));

  now += 6 * 60 * 60 * 1000 + 1;
  await store.openRace(race("100008", now), player("100008", "방장", now));

  assert.equal(await store.race("100007"), null);
  assert.notEqual(await store.race("100008"), null);
});

test("hands back copies so callers cannot edit stored rooms", async () => {
  const store = memoryRaceStore();
  await store.openRace(race("100009"), player("100009", "방장"));
  const snapshot = await store.race("100009");
  snapshot!.status = "running";
  const rows = await store.participants("100009");
  rows[0].mistake_count = 9;

  assert.equal((await store.race("100009"))?.status, "waiting");
  assert.equal((await store.participants("100009"))[0].mistake_count, 0);
});
