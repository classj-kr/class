import assert from "node:assert/strict";
import test from "node:test";
import { memoryRaceStore, type ParticipantRow } from "../lib/arithmetic-race-store.ts";
import { fillRaceTeams, raceTeamBoard, raceTeamCount, shuffleRaceTeams } from "../lib/arithmetic-race-teams.ts";

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
  assert.equal(raceTeamCount(5), null);
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
