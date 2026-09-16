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
  assert.match(platformSource, /requestPath === "\/room" \|\| requestPath\.startsWith\("\/room\/"\)/);
  assert.match(platformSource, /requestPath === "\/vote" \|\| requestPath\.startsWith\("\/vote\/"\)/);
  assert.match(platformSource, /requestPath === "\/learning\/class-race" \|\| requestPath\.startsWith\("\/learning\/class-race\/"\)/);
});

test("ballots require student membership and enforce one vote per position", () => {
  assert.match(votingSource, /STUDENT_REQUIRED/);
  assert.match(votingSource, /CLASS_MISMATCH/);
  assert.match(votingSource, /UNIQUE \(room_id, position_id, voter_key\)/);
  assert.match(votingSource, /ALREADY_VOTED/);
  assert.match(votingSource, /INCOMPLETE_BALLOT/);
  assert.match(votingSource, /ROOM_CODE_LENGTH = 4/);
  assert.match(votingSource, /hasQuizRaceCode/);
  assert.match(votingSource, /router\.delete\("\/rooms\/:roomId"/);
  assert.match(votingSource, /DELETE FROM vote_rooms/);
  assert.match(votingSource, /creator_user_id=\$2/);
});

test("results preserve candidate-number order and show only rank and vote totals", () => {
  assert.match(voteAppSource, /for \(const \[index, candidate\] of position\.candidates\.entries\(\)\)/);
  assert.match(voteAppSource, /기호 \$\{index \+ 1\}번/);
  assert.match(voteAppSource, /\$\{rank\}위 · \$\{candidate\.votes \|\| 0\}표/);
  assert.doesNotMatch(voteAppSource, /당선/);
  assert.match(votingSource, /COUNT\(DISTINCT voter_key\)::INTEGER AS voter_count/);
  assert.match(voteAppSource, /현재 \$\{room\.voterCount\}명 투표/);
  assert.match(voteAppSource, /투표 마감하고 결과 보기/);
  assert.match(voteAppSource, /우리 반 \$\{room\.voterTotal\}명 중 \$\{room\.voterCount\}명/);
  assert.match(voteAppSource, /setTimeout\(\(\) => openTeacherRoom\(code\), 2000\)/);
  assert.match(votingSource, /async function classParticipants/);
  assert.match(votingSource, /participants = isOwner \? await classParticipants\(room\) : null/);
  assert.match(votingSource, /localeCompare[\s\S]*numeric: true/);
  assert.match(votingSource, /CREATE TABLE IF NOT EXISTS vote_room_participants/);
  assert.match(votingSource, /ON CONFLICT \(room_id, voter_key\) DO UPDATE SET updated_at=NOW\(\)/);
  assert.match(votingSource, /const guest = guestAccess\(req\)/);
  assert.match(votingSource, /async function guestScope/);
  assert.match(voteAppSource, /title:"투표 완료"/);
  assert.match(voteAppSource, /title:"준비"/);
  assert.match(voteAppSource, /title:"미참여"/);
});
