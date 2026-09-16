import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const serverSource = await readFile(new URL("./server.js", import.meta.url), "utf8");
const platformSource = await readFile(new URL("./classroom-platform.js", import.meta.url), "utf8");
const votingSource = await readFile(new URL("./voting.js", import.meta.url), "utf8");
const homeSource = await readFile(new URL("../index.html", import.meta.url), "utf8");
const roomSource = await readFile(new URL("../room/app.js", import.meta.url), "utf8");
const raceSource = await readFile(new URL("../learning/class-race/app.js", import.meta.url), "utf8");
const voteAppSource = await readFile(new URL("../vote/app.js", import.meta.url), "utf8");

test("the home room-number entrance routes both class race and vote rooms", () => {
  assert.match(homeSource, /href="\/room\/"[^>]*>방번호 입력/);
  assert.match(roomSource, /code\.length !== 4/);
  assert.match(roomSource, /api\/vote\/resolve/);
  assert.match(raceSource, /URLSearchParams\(location\.search\).*get\("room"\)/s);
});

test("voting is mounted, initialized, and served behind site access", () => {
  assert.match(platformSource, /createVoting/);
  assert.match(platformSource, /await voting\.initialize\(\)/);
  assert.match(platformSource, /router\.use\("\/vote", voting\.router\)/);
  assert.match(serverSource, /"\/room", "\/vote"/);
  assert.match(serverSource, /"room", "vote"/);
});

test("ballots require student membership and enforce one vote per position", () => {
  assert.match(votingSource, /STUDENT_REQUIRED/);
  assert.match(votingSource, /SCHOOL_MISMATCH/);
  assert.match(votingSource, /UNIQUE \(room_id, position_id, voter_user_id\)/);
  assert.match(votingSource, /ALREADY_VOTED/);
  assert.match(votingSource, /INCOMPLETE_BALLOT/);
  assert.match(votingSource, /ROOM_CODE_LENGTH = 4/);
  assert.match(votingSource, /hasQuizRaceCode/);
});

test("results preserve candidate-number order and show only rank and vote totals", () => {
  assert.match(voteAppSource, /for \(const \[index, candidate\] of position\.candidates\.entries\(\)\)/);
  assert.match(voteAppSource, /기호 \$\{index \+ 1\}번/);
  assert.match(voteAppSource, /\$\{rank\}위 · \$\{candidate\.votes \|\| 0\}표/);
  assert.doesNotMatch(voteAppSource, /당선/);
});
