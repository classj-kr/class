import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const serverSource = fs.readFileSync(new URL("./classroom-platform.js", import.meta.url), "utf8");
const museumSource = fs.readFileSync(new URL("../learning/arts/art-appreciation/museum/museum.js", import.meta.url), "utf8");

test("museum completions are stored by date, class, room, and student", () => {
  assert.match(serverSource, /CREATE TABLE IF NOT EXISTS museum_completion_records/);
  assert.match(serverSource, /PRIMARY KEY \(record_date, class_id, room_id, user_id\)/);
  assert.match(serverSource, /router\.get\("\/museum\/completions"/);
  assert.match(serverSource, /router\.post\("\/museum\/completions"/);
  assert.match(serverSource, /WHERE record_date = \$1::date AND class_id = \$2 AND room_id = \$3/);
});

test("the server derives completer identity from the authenticated class roster", () => {
  const postRoute = serverSource.slice(
    serverSource.indexOf('router.post("/museum/completions"'),
    serverSource.indexOf('router.get("/site/access"')
  );
  assert.match(postRoute, /const user = await requireUser\(req\)/);
  assert.match(postRoute, /studentMembership\(user\.id\)/);
  assert.match(postRoute, /userClassId\(user\)/);
  assert.match(postRoute, /membership\.name/);
  assert.doesNotMatch(postRoute, /req\.body\?\.name/);
  assert.match(postRoute, /ON CONFLICT \(record_date, class_id, room_id, user_id\) DO NOTHING/);
});

test("the museum wall renders and refreshes only its class completion feed", () => {
  assert.match(museumSource, /오늘의 우리 반 완료/);
  assert.match(museumSource, /fetch\(`\/api\/museum\/completions\?roomId=/);
  assert.match(museumSource, /fetch\('\/api\/museum\/completions'/);
  assert.match(museumSource, /if\(newlyCompleted\)void registerMuseumCompletion\(room\)/);
  assert.doesNotMatch(museumSource, /\/api\/finishers/);
});
