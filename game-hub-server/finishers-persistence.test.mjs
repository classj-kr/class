import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const serverSource = await readFile(new URL("./server.js", import.meta.url), "utf8");
const platformSource = await readFile(new URL("./classroom-platform.js", import.meta.url), "utf8");

test("finisher records are persisted in PostgreSQL instead of the local filesystem", () => {
  assert.match(platformSource, /CREATE TABLE IF NOT EXISTS game_finisher_records/);
  assert.match(platformSource, /PRIMARY KEY \(record_date, game_id, player_name\)/);
  assert.match(platformSource, /ON CONFLICT \(record_date, game_id, player_name\) DO UPDATE/);
  assert.match(platformSource, /WHERE EXCLUDED\.rank > game_finisher_records\.rank/);
  assert.doesNotMatch(serverSource, /FINISHERS_DATA_PATH|finishers\.json|persistFinisherStore/);
});

test("finisher API waits for database reads and writes", () => {
  assert.match(serverSource, /await classroomPlatform\.listFinisherRecords\(date, gameId, req\)/);
  assert.match(serverSource, /await classroomPlatform\.saveFinisherRecord\(/);
  assert.match(serverSource, /FINISHER_STORAGE_UNAVAILABLE/);
});

test("old records are retained for fourteen Korean calendar dates", () => {
  assert.match(platformSource, /record_date < \$1::date - 13/);
});
