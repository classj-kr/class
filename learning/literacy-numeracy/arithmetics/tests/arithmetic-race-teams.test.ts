import assert from "node:assert/strict";
import test from "node:test";
import { memoryRaceStore, type ParticipantRow } from "../lib/arithmetic-race-store.ts";
import { fillRaceTeams, RACE_TEAMS, raceDuration, raceTeamBoard, raceTeamCount, shuffleRaceTeams } from "../lib/arithmetic-race-teams.ts";

function person(id: string, team: number | null = null, score = 0): ParticipantRow {
  return { id, room_code: "1234", name: id, participant_token: `t-${id}`, joined_at: 1, submitted_at: null, correct_count: score, total_count: null, mistake_count: 0, score, team };
}

test("team scores are the sum of members, ties share a rank", () => {
  const board = raceTeamBoard([person("a", 0, 3), person("b", 0, 2), person("c", 1, 5), person("d", 2, 1), person("e", null, 9)], 3);
  assert.deepEqual(board.map((team) => [team.name, team.score, team.size, team.rank]), [["더하기팀", 5, 2, 1], ["빼기팀", 5, 1, 1], ["곱하기팀", 1, 1, 3]]);
  assert.deepEqual(board[0].memberIds, ["a", "b"]);
});

test("unpicked players go to the smallest team; shuffle balances everyone", () => {
  const rows = [person("a", 0), person("b", 0), person("c"), person("d"), person("e", 3)];
  assert.deepEqual(fillRaceTeams(rows, 2), [{ id: "c", team: 1 }, { id: "d", team: 1 }, { id: "e", team: 0 }]);
  const shuffled = shuffleRaceTeams(rows, 3, () => 0.5);
  assert.deepEqual([0, 1, 2].map((team) => shuffled.filter((row) => row.team === team).length), [2, 2, 1]);
  assert.equal(raceTeamCount(4), 4);
  assert.equal(raceTeamCount(8), 8);
  assert.equal(raceTeamCount(1), null);
  assert.equal(raceTeamCount(9), null);
});

test("eight teams have their own names, symbols and colors", () => {
  assert.equal(RACE_TEAMS.length, 8);
  assert.equal(new Set(RACE_TEAMS.map((team) => team.name)).size, 8);
  assert.equal(new Set(RACE_TEAMS.map((team) => team.symbol)).size, 8);
  const hues = RACE_TEAMS.map((team) => team.hue);
  for (const [index, hue] of hues.entries()) {
    for (const other of hues.slice(index + 1)) assert.ok(Math.min(Math.abs(hue - other), 360 - Math.abs(hue - other)) >= 18, `${hue} vs ${other}`);
  }
  const rows = Array.from({ length: 17 }, (_, index) => person(`p${index}`));
  const filled = fillRaceTeams(rows, 8);
  assert.deepEqual(Array.from({ length: 8 }, (_, team) => filled.filter((row) => row.team === team).length), [3, 2, 2, 2, 2, 2, 2, 2]);
  assert.deepEqual(raceTeamBoard([person("a", 7, 4)], 8).map((team) => team.name).slice(4), ["같다팀", "크다팀", "작다팀", "퍼센트팀"]);
});

test("duration changes only while waiting, only by the host, only in card races", async () => {
  assert.equal(raceDuration(120), 120);
  assert.equal(raceDuration(90), null);
  const store = memoryRaceStore();
  const now = Date.now();
  const race = { room_code: "1234", teacher_token: "host", worksheet_name: "w", worksheet_route: "/arithmetic/add-subtract-1", seed: 1, status: "waiting", created_at: now, started_at: null, duration_seconds: 180 };
  await store.openRace(race, person("a"));
  assert.equal(await store.setDuration("1234", "wrong", 60), false);
  assert.equal(await store.setDuration("1234", "host", 60), true);
  assert.equal((await store.race("1234"))?.duration_seconds, 60);
  await store.startRace("1234", "host", now);
  assert.equal(await store.setDuration("1234", "host", 120), false);
  assert.equal((await store.race("1234"))?.duration_seconds, 60);
  await store.openRace({ ...race, room_code: "5678", duration_seconds: null }, person("b"));
  assert.equal(await store.setDuration("5678", "host", 60), false, "a worksheet race stays a worksheet race");
});

test("team count changes only while waiting and frees players from removed teams", async () => {
  const store = memoryRaceStore();
  const race = { room_code: "1234", teacher_token: "host", worksheet_name: "w", worksheet_route: "/arithmetic/add-subtract-1", seed: 1, status: "waiting", created_at: Date.now(), started_at: null, duration_seconds: 60 };
  await store.openRace(race, person("a"));
  await store.joinRace(person("b"));
  assert.equal(await store.setTeamCount("1234", "wrong", 3), false);
  assert.equal(await store.setTeamCount("1234", "host", 3), true);
  await store.setTeams("1234", [{ id: "a", team: 2 }, { id: "b", team: 0 }]);
  await store.setTeamCount("1234", "host", 2);
  assert.deepEqual((await store.participants("1234")).map((row) => row.team), [null, 0]);
  await store.startRace("1234", "host", Date.now());
  assert.equal(await store.setTeamCount("1234", "host", 4), false);
});
