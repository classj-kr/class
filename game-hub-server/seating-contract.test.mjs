import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { normalizeLayout, pickRejection, seatIndexOf, TOTAL_DESKS, SEAT_PAGE_PATH } = require("./seating.js");

const serverSource = await readFile(new URL("./server.js", import.meta.url), "utf8");
const platformSource = await readFile(new URL("./classroom-platform.js", import.meta.url), "utf8");
const votingSource = await readFile(new URL("./voting.js", import.meta.url), "utf8");
const seatingSource = await readFile(new URL("./seating.js", import.meta.url), "utf8");
const teacherPage = await readFile(new URL("../classtools/seating.html", import.meta.url), "utf8");
const studentPage = await readFile(new URL("../room/seat.html", import.meta.url), "utf8");
const studentApp = await readFile(new URL("../room/seat.js", import.meta.url), "utf8");

test("seating rooms are mounted, initialized, and reachable from the room-number entrance", () => {
  assert.match(platformSource, /createSeating/);
  assert.match(platformSource, /await seating\.initialize\(\)/);
  assert.match(platformSource, /router\.use\("\/seating", seating\.router\)/);
  assert.match(platformSource, /hasSeatingRoomCode: seating\.hasRoomCode/);
  // 세 활동(투표·자리 고르기·학급 순위전)이 같은 4자리 방번호를 나눠 쓴다.
  assert.match(platformSource, /isReservedCode: \(code\) => seating\.hasRoomCode\(code\)/);
  assert.match(platformSource, /resolveRoomCode: \(code\) => seating\.resolveCode\(code\)/);
  assert.match(platformSource, /await voting\.hasQuizRaceCode\(code\)\) \|\| \(await voting\.hasRoomCode\(code\)/);
  assert.match(votingSource, /isReservedCode\(code\)\) continue/);
  assert.match(votingSource, /resolveRoomCode\(code\)/);
  assert.match(serverSource, /hasVotingRoomCode\(roomCode\) \|\| await classroomPlatform\.hasSeatingRoomCode\(roomCode\)/);
  // 학생 화면은 /room 아래에 있어 학생 접근 예외(content=locked 우회)를 그대로 받는다.
  assert.equal(SEAT_PAGE_PATH, "/room/seat");
  assert.match(platformSource, /requestPath === "\/room" \|\| requestPath\.startsWith\("\/room\/"\)/);
  assert.match(seatingSource, /href: `\$\{SEAT_PAGE_PATH\}\?room=\$\{code\}`/);
});

test("a pick is first-come-first-served and final within the room", () => {
  assert.match(seatingSource, /UNIQUE \(room_id, seat_index\)/);
  assert.match(seatingSource, /PRIMARY KEY \(room_id, student_key\)/);
  assert.match(seatingSource, /FOR UPDATE/);
  assert.match(seatingSource, /ALREADY_PICKED/);
  assert.match(seatingSource, /SEAT_TAKEN/);
  assert.match(seatingSource, /SEATING_ROOM_CLOSED/);
  assert.doesNotMatch(seatingSource, /ON CONFLICT \(room_id, student_key\) DO UPDATE/);
  assert.doesNotMatch(seatingSource, /router\.delete\("\/rooms\/:code\/pick"/);
});

test("students only see the room after class membership is checked", () => {
  assert.match(seatingSource, /STUDENT_REQUIRED/);
  assert.match(seatingSource, /CLASS_MISMATCH/);
  assert.match(seatingSource, /const guest = guestAccess\(req\)/);
  assert.match(seatingSource, /async function guestScope/);
  assert.match(seatingSource, /roster_name = \$5/);
});

test("teacher page opens a room with only the homeroom conditions and applies picks on close", () => {
  assert.match(teacherPage, /id="live-open-btn"/);
  assert.match(teacherPage, /id="live-close-btn"/);
  assert.match(teacherPage, /id="live-cancel-btn"/);
  assert.match(teacherPage, /id="live-code"/);
  assert.match(teacherPage, /unavailableSeats: \[\.\.\.unavailableSeats\],\s*genderLocks: Object\.fromEntries\(genderLocks\),\s*studentLocks: Object\.fromEntries\(studentLocks\)/);
  assert.doesNotMatch(teacherPage, /manualAssignments: Object\.fromEntries\(manualAssignments\)\s*\}\s*;\s*\}\s*\n\s*\/\/ 서버가/);
  assert.match(teacherPage, /fetch\(path, \{\s*credentials: 'same-origin'/);
  assert.match(teacherPage, /\/api\/seating\/rooms\/active\?classId=/);
  assert.match(teacherPage, /if \(liveRoom\) return;/);
  assert.match(teacherPage, /function finalizeLiveRoom\(room\)/);
  assert.match(teacherPage, /setTimeout\(pollLiveRoom, LIVE_POLL_MS\)/);
  assert.match(teacherPage, /한 번 고른 자리는 이 방에서는 바꿀 수 없습니다/);
});

test("student page confirms before a final pick and never lets a seated student pick again", () => {
  assert.match(studentPage, /id="confirmDialog"/);
  assert.match(studentPage, /한 번 고르면 이 방에서는 자리를 바꿀 수 없어요/);
  assert.match(studentApp, /\/api\/seating\/rooms\/\$\{code\}\/pick/);
  assert.match(studentApp, /me\.seatIndex === null && me\.lockedSeatIndex === null/);
  assert.match(studentApp, /returnValue !== "confirm"/);
  assert.match(studentApp, /URLSearchParams\(location\.search\)/);
  assert.match(studentApp, /setTimeout\(load, POLL_MS\)/);
});

test("normalizeLayout keeps only valid homeroom conditions", () => {
  const roster = new Set(["1", "2", "5"]);
  const layout = normalizeLayout({
    unavailableSeats: [0, 0, "7", 36, -1, "abc", 2.5],
    genderLocks: { 0: "남", 1: "남", 2: "여", 3: "기타", 40: "여" },
    studentLocks: { 2: "5", 4: "999", 5: "1", 6: "1", 7: "", 0: "2" }
  }, roster);

  assert.deepEqual(layout.unavailableSeats, [0, 7]);
  // 사용 안 함(0)과 잘못된 값은 빠지고, 학생 고정(2)이 성별 고정을 이긴다.
  assert.deepEqual(layout.genderLocks, { 1: "남" });
  // 명단에 없는 999, 빈 번호, 같은 학생의 두 번째 자리(6), 사용 안 함 자리(0)는 빠진다.
  assert.deepEqual(layout.studentLocks, { 2: "5", 5: "1" });
  assert.deepEqual(normalizeLayout(null), { unavailableSeats: [], genderLocks: {}, studentLocks: {} });
  assert.deepEqual(normalizeLayout({ unavailableSeats: "3", genderLocks: [], studentLocks: "x" }), { unavailableSeats: [], genderLocks: {}, studentLocks: {} });
});

test("pickRejection enforces the homeroom conditions and first-come-first-served", () => {
  const layout = normalizeLayout({ unavailableSeats: [0], genderLocks: { 1: "남", 2: "여" }, studentLocks: { 3: "5" } });
  const boy = { key: "school:1", number: "1", name: "김하나", gender: "남" };
  const girl = { key: "school:2", number: "2", name: "이학생", gender: "여" };
  const fixed = { key: "school:5", number: "5", name: "박고정", gender: "남" };
  const picks = [{ key: "school:9", seatIndex: 10, number: "9" }];
  const reject = (student, seatIndex, existingPick = null) => pickRejection({ layout, student, seatIndex, picks, existingPick })?.code || null;

  assert.equal(reject(boy, 11), null);
  assert.equal(reject(boy, 1), null);
  assert.equal(reject(girl, 2), null);
  assert.equal(reject(boy, 0), "SEAT_UNAVAILABLE");
  assert.equal(reject(boy, 2), "GENDER_MISMATCH");
  assert.equal(reject(girl, 1), "GENDER_MISMATCH");
  assert.equal(reject(boy, 3), "SEAT_LOCKED");
  assert.equal(reject(boy, 10), "SEAT_TAKEN");
  assert.equal(reject(boy, null), "INVALID_SEAT");
  assert.equal(reject(fixed, 11), "SEAT_FIXED");
  // 이미 고른 학생은 빈자리를 눌러도 바꿀 수 없다.
  assert.equal(reject(boy, 11, { key: "school:1", seatIndex: 12 }), "ALREADY_PICKED");
  assert.equal(pickRejection({ layout, student: boy, seatIndex: 11, picks, existingPick: { seatIndex: 12 } }).status, 409);
});

test("seatIndexOf accepts only the 36 desk indexes", () => {
  assert.equal(TOTAL_DESKS, 36);
  assert.equal(seatIndexOf("0"), 0);
  assert.equal(seatIndexOf(35), 35);
  assert.equal(seatIndexOf(36), null);
  assert.equal(seatIndexOf(-1), null);
  assert.equal(seatIndexOf("3.5"), null);
  assert.equal(seatIndexOf(undefined), null);
  assert.equal(seatIndexOf(""), null);
});
