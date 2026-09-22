// 자리 고르기 방의 흐름을 실제 라우터로 돌려 본다.
//
// Postgres 대신 seating.js 가 내는 문장만 알아듣는 가짜 풀을 쓴다. 담임이 조건을
// 들고 방을 열고, 학생들이 선착순으로 자리를 잡고, 한 번 잡은 자리는 못 바꾸고,
// 마감하면 더는 못 잡는지를 본다.
import assert from "node:assert/strict";
import http from "node:http";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const express = require("express");
const { createSeating } = require("./seating.js");

class HttpError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

// --- 세계 ------------------------------------------------------------------
const SCHOOL = 1;
const CLASS = { id: 11, school_id: SCHOOL, academic_year: 2026, grade: 6, class_number: 2 };
const OTHER_CLASS = { id: 12, school_id: SCHOOL, academic_year: 2026, grade: 6, class_number: 3 };
const ROSTER = [
  { id: 101, user_id: 21, student_number: "1", roster_name: "김하나", gender: "남", cls: CLASS, avatar_key: "animal-cat.webp" },
  { id: 102, user_id: 22, student_number: "2", roster_name: "이학생", gender: "여", cls: CLASS, avatar_key: null },
  { id: 103, user_id: 23, student_number: "3", roster_name: "박셋", gender: "남", cls: CLASS, avatar_key: null },
  { id: 104, user_id: 24, student_number: "4", roster_name: "최넷", gender: "여", cls: CLASS, avatar_key: null },
  { id: 105, user_id: 25, student_number: "5", roster_name: "박고정", gender: "남", cls: CLASS, avatar_key: null },
  { id: 201, user_id: 31, student_number: "1", roster_name: "옆반", gender: "여", cls: OTHER_CLASS, avatar_key: null }
];
const USERS = {
  7: { id: 7, email: "teacher@example.kr", display_name: "담임", role: "teacher", teacher: true },
  8: { id: 8, email: "other@example.kr", display_name: "다른교사", role: "teacher", teacher: true },
  21: { id: 21, email: "s1@example.kr", display_name: "김하나", role: "student" },
  22: { id: 22, email: "s2@example.kr", display_name: "이학생", role: "student" },
  23: { id: 23, email: "s3@example.kr", display_name: "박셋", role: "student" },
  24: { id: 24, email: "s4@example.kr", display_name: "최넷", role: "student" },
  25: { id: 25, email: "s5@example.kr", display_name: "박고정", role: "student" },
  31: { id: 31, email: "s31@example.kr", display_name: "옆반", role: "student" },
  99: { id: 99, email: "nobody@example.kr", display_name: "명단없음", role: "student" }
};

const scopeRow = (student) => ({
  school_id: student.cls.school_id,
  academic_year: student.cls.academic_year,
  grade: student.cls.grade,
  class_number: student.cls.class_number,
  student_number: student.student_number,
  roster_name: student.roster_name,
  gender: student.gender,
  student_key: `school:${student.id}`
});
const inClass = (student, [school, year, grade, classNumber]) => String(student.cls.school_id) === String(school)
  && Number(student.cls.academic_year) === Number(year)
  && Number(student.cls.grade) === Number(grade)
  && Number(student.cls.class_number) === Number(classNumber);

// --- 가짜 Postgres ----------------------------------------------------------
class FakePool {
  constructor() {
    this.rooms = [];
    this.picks = [];
    this.nextId = 1;
    this.statements = [];
  }

  async connect() {
    return { query: (sql, params) => this.query(sql, params), release() {} };
  }

  async query(sql, params = []) {
    const text = String(sql).replace(/\s+/g, " ").trim();
    this.statements.push(text);
    const rows = (list) => ({ rows: list, rowCount: list.length });
    if (/^(BEGIN|COMMIT|ROLLBACK|CREATE TABLE|CREATE INDEX)/.test(text)) return rows([]);
    if (text.startsWith("DELETE FROM seating_rooms WHERE created_at <")) return rows([]);

    if (text.includes("memberships ORDER BY priority")) {
      const student = ROSTER.find((entry) => String(entry.user_id) === String(params[0]));
      return rows(student ? [scopeRow(student)] : []);
    }
    if (text.includes("matches ORDER BY priority")) {
      const student = ROSTER.find((entry) => inClass(entry, params) && entry.roster_name === params[4]);
      return rows(student ? [scopeRow(student)] : []);
    }
    if (text.includes(") combined ORDER BY CASE WHEN student_number")) {
      return rows(ROSTER.filter((entry) => inClass(entry, params)).map((entry) => ({
        student_number: entry.student_number,
        roster_name: entry.roster_name,
        gender: entry.gender,
        avatar_key: entry.avatar_key,
        student_key: `school:${entry.id}`
      })));
    }
    if (text.startsWith("SELECT id, school_id, academic_year, grade, class_number FROM classroom_classes")) {
      const found = [CLASS, OTHER_CLASS].find((cls) => String(cls.id) === String(params[0]) && String(cls.school_id) === String(params[1]));
      return rows(found ? [found] : []);
    }
    if (text.startsWith("SELECT * FROM seating_rooms WHERE room_code = $1")) {
      return rows(this.rooms.filter((room) => room.room_code === params[0]));
    }
    if (text.startsWith("SELECT 1 FROM seating_rooms WHERE room_code = $1")) {
      return rows(this.rooms.filter((room) => room.room_code === params[0]).map(() => ({ ok: 1 })));
    }
    if (text.startsWith("SELECT * FROM seating_rooms WHERE id = $1 AND creator_user_id = $2")) {
      return rows(this.rooms.filter((room) => String(room.id) === String(params[0]) && String(room.creator_user_id) === String(params[1])));
    }
    if (text.startsWith("SELECT * FROM seating_rooms WHERE creator_user_id = $1 AND status = 'open'")) {
      const found = this.rooms
        .filter((room) => String(room.creator_user_id) === String(params[0]) && room.status === "open"
          && (params[1] == null || String(room.class_id) === String(params[1])))
        .sort((left, right) => right.created_at - left.created_at);
      return rows(found.slice(0, 1));
    }
    if (text.startsWith("UPDATE seating_rooms SET status = 'closed', closed_at = COALESCE(closed_at, NOW()) WHERE creator_user_id = $1 AND class_id = $2")) {
      const hits = this.rooms.filter((room) => String(room.creator_user_id) === String(params[0]) && String(room.class_id) === String(params[1]) && room.status === "open");
      hits.forEach((room) => { room.status = "closed"; room.closed_at = new Date(); });
      return rows(hits);
    }
    if (text.startsWith("INSERT INTO seating_rooms")) {
      const [code, school, classId, year, grade, classNumber, creator, layout] = params;
      if (this.rooms.some((room) => room.room_code === code)) return rows([]);
      const room = {
        id: this.nextId++, room_code: code, school_id: school, class_id: classId, academic_year: year, grade,
        class_number: classNumber, creator_user_id: creator, status: "open", layout: JSON.parse(layout),
        created_at: new Date(Date.now() + this.nextId), closed_at: null
      };
      this.rooms.push(room);
      return rows([room]);
    }
    if (text.startsWith("SELECT status, layout FROM seating_rooms WHERE id = $1 FOR UPDATE")) {
      return rows(this.rooms.filter((room) => String(room.id) === String(params[0])).map((room) => ({ status: room.status, layout: room.layout })));
    }
    if (text.includes("FROM seating_picks WHERE room_id = $1 ORDER BY picked_at")) {
      return rows(this.picks.filter((pick) => String(pick.room_id) === String(params[0])));
    }
    if (text.startsWith("INSERT INTO seating_picks")) {
      const [roomId, key, seatIndex, number, name, gender] = params;
      const conflict = this.picks.find((pick) => String(pick.room_id) === String(roomId) && (pick.student_key === key || pick.seat_index === seatIndex));
      if (conflict) {
        const error = new Error("duplicate key");
        error.code = "23505";
        error.constraint = conflict.seat_index === seatIndex ? "seating_picks_room_id_seat_index_key" : "seating_picks_pkey";
        throw error;
      }
      this.picks.push({ room_id: roomId, student_key: key, seat_index: seatIndex, student_number: number, student_name: name, gender, picked_at: new Date() });
      return rows([]);
    }
    if (text.startsWith("UPDATE seating_rooms SET status = 'closed', closed_at = COALESCE(closed_at, NOW()) WHERE id = $1 AND creator_user_id = $2")) {
      const hits = this.rooms.filter((room) => String(room.id) === String(params[0]) && String(room.creator_user_id) === String(params[1]));
      hits.forEach((room) => { room.status = "closed"; room.closed_at = room.closed_at || new Date(); });
      return rows(hits);
    }
    if (text.startsWith("DELETE FROM seating_rooms WHERE id = $1 AND creator_user_id = $2")) {
      const before = this.rooms.length;
      this.rooms = this.rooms.filter((room) => !(String(room.id) === String(params[0]) && String(room.creator_user_id) === String(params[1])));
      const removed = before - this.rooms.length;
      const remaining = new Set(this.rooms.map((room) => String(room.id)));
      this.picks = this.picks.filter((pick) => remaining.has(String(pick.room_id)));
      return { rows: [], rowCount: removed };
    }
    throw new Error(`가짜 풀이 모르는 문장: ${text.slice(0, 120)}`);
  }
}

// --- 서버 --------------------------------------------------------------------
const pool = new FakePool();
const userOf = (req) => USERS[req.get("x-user")] || null;
const seating = createSeating({
  pool,
  sessionUser: async (req) => userOf(req),
  // 헤더에는 한글을 못 실으므로 시험에서는 퍼센트 부호화해서 넘긴다.
  guestAccess: (req) => (req.get("x-guest") ? { name: decodeURIComponent(req.get("x-guest")) } : null),
  requireTeacher: async (req) => {
    const user = userOf(req);
    if (!user) throw new HttpError(401, "AUTH_REQUIRED", "sign in");
    if (!user.teacher) throw new HttpError(403, "TEACHER_REGISTRATION_REQUIRED", "teacher only");
    return user;
  },
  requireDatabase: () => {},
  teacherRegistration: async (user) => (user.teacher ? { school_id: SCHOOL } : null),
  avatarUrl: (key) => (key ? `/assets/avatars/${key}` : ""),
  isReservedCode: async (code) => code === "1234",
  HttpError,
  asyncRoute
});

const app = express();
app.use(express.json());
app.use("/api/seating", seating.router);
app.use((error, _req, res, _next) => {
  if (error instanceof HttpError) return res.status(error.status).json({ error: error.code, message: error.message });
  res.status(500).json({ error: "INTERNAL_ERROR", message: error.message });
});

let base = "";
const server = http.createServer(app);
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
base = `http://127.0.0.1:${server.address().port}`;
test.after(() => server.close());

async function call(method, path, { user, guest, body } = {}) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(user ? { "x-user": String(user) } : {}),
      ...(guest ? { "x-guest": encodeURIComponent(guest) } : {})
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  return { status: response.status, body: await response.json() };
}

await seating.initialize();

const LAYOUT = {
  unavailableSeats: [0, 99, "x"],
  genderLocks: { 0: "남", 1: "남", 2: "여" },
  studentLocks: { 3: "5", 4: "999" }
};

let room = null;

test("only a registered teacher opens a room, and only the homeroom conditions survive", async () => {
  assert.equal((await call("POST", "/api/seating/rooms", { user: 21, body: { classId: CLASS.id, layout: LAYOUT } })).status, 403);
  assert.equal((await call("POST", "/api/seating/rooms", { user: 7, body: { classId: 999, layout: LAYOUT } })).status, 404);
  assert.equal((await call("POST", "/api/seating/rooms", { user: 7, body: { layout: LAYOUT } })).status, 400);

  const created = await call("POST", "/api/seating/rooms", { user: 7, body: { classId: CLASS.id, layout: LAYOUT } });
  assert.equal(created.status, 201, JSON.stringify(created.body));
  room = created.body.room;
  assert.match(room.code, /^\d{4}$/);
  assert.notEqual(room.code, "1234", "예약된 방번호는 피해야 한다");
  assert.equal(room.status, "open");
  assert.deepEqual(room.layout.unavailableSeats, [0]);
  assert.deepEqual(room.layout.genderLocks, { 1: "남", 2: "여" });
  assert.deepEqual(room.layout.studentLocks, [{ seatIndex: 3, number: "5", name: "박고정", gender: "남", avatarUrl: "" }]);
  assert.equal(room.lockedCount, 1);
  assert.equal(room.pickedCount, 0);
  assert.equal(room.studentTotal, 5);
  assert.deepEqual(room.pending.map((student) => student.number), ["1", "2", "3", "4"]);
  assert.equal(room.me, null);
});

test("students see themselves in the room only when they belong to the class", async () => {
  assert.equal((await call("GET", `/api/seating/rooms/${room.code}`)).status, 401);
  assert.equal((await call("GET", `/api/seating/rooms/${room.code}`, { user: 99 })).body.error, "STUDENT_REQUIRED");
  assert.equal((await call("GET", `/api/seating/rooms/${room.code}`, { user: 31 })).body.error, "CLASS_MISMATCH");
  assert.equal((await call("GET", `/api/seating/rooms/${room.code}`, { guest: "아무개" })).body.error, "STUDENT_REQUIRED");
  assert.equal((await call("GET", "/api/seating/rooms/0000", { user: 21 })).status, 404);
  assert.equal((await call("GET", "/api/seating/rooms/12", { user: 21 })).status, 400);

  const view = await call("GET", `/api/seating/rooms/${room.code}`, { user: 21 });
  assert.equal(view.status, 200);
  assert.equal(view.body.isOwner, false);
  assert.deepEqual(view.body.room.me, { number: "1", name: "김하나", gender: "남", seatIndex: null, lockedSeatIndex: null });
  assert.equal(view.body.room.pending, undefined, "학생에게는 안 고른 학생 명단을 보내지 않는다");
  assert.deepEqual(view.body.room.picks, []);

  const fixed = await call("GET", `/api/seating/rooms/${room.code}`, { user: 25 });
  assert.equal(fixed.body.room.me.lockedSeatIndex, 3);
});

test("picks obey the conditions, go to the first student, and cannot be changed", async () => {
  const pick = (who, seatIndex) => call("POST", `/api/seating/rooms/${room.code}/pick`, { ...who, body: { seatIndex } });

  assert.equal((await pick({ user: 21 }, 0)).body.error, "SEAT_UNAVAILABLE");
  assert.equal((await pick({ user: 21 }, 2)).body.error, "GENDER_MISMATCH");
  assert.equal((await pick({ user: 21 }, 3)).body.error, "SEAT_LOCKED");
  assert.equal((await pick({ user: 21 }, 40)).body.error, "INVALID_SEAT");
  assert.equal((await pick({ user: 21 }, "nope")).status, 400);
  assert.equal((await pick({ user: 25 }, 8)).body.error, "SEAT_FIXED");
  assert.equal((await pick({ user: 31 }, 8)).body.error, "CLASS_MISMATCH");

  const first = await pick({ user: 21 }, 11);
  assert.equal(first.status, 201, JSON.stringify(first.body));
  assert.equal(first.body.seatIndex, 11);

  // 게스트(명단 이름으로 들어온 학생)가 같은 자리를 누르면 늦은 사람이 진다.
  const late = await pick({ guest: "이학생" }, 11);
  assert.equal(late.status, 409);
  assert.equal(late.body.error, "SEAT_TAKEN");
  assert.equal((await pick({ guest: "이학생" }, 7)).status, 201);
  // 남학생 고정 자리는 남학생이 고를 수 있다.
  assert.equal((await pick({ user: 23 }, 1)).status, 201);

  // 한 번 고른 자리는 이 방에서 바꿀 수 없다. 빈자리를 눌러도 마찬가지.
  const change = await pick({ user: 21 }, 8);
  assert.equal(change.status, 409);
  assert.equal(change.body.error, "ALREADY_PICKED");
  assert.equal((await pick({ guest: "이학생" }, 9)).body.error, "ALREADY_PICKED");
  assert.equal((await pick({ user: 23 }, 1)).body.error, "ALREADY_PICKED");

  const view = await call("GET", `/api/seating/rooms/${room.code}`, { user: 22 });
  assert.equal(view.body.room.me.seatIndex, 7);
  assert.deepEqual(
    view.body.room.picks.map((entry) => [entry.seatIndex, entry.number, entry.mine, entry.avatarUrl]),
    [[11, "1", false, "/assets/avatars/animal-cat.webp"], [7, "2", true, ""], [1, "3", false, ""]]
  );

  const owner = await call("GET", `/api/seating/rooms/active?classId=${CLASS.id}`, { user: 7 });
  assert.equal(owner.body.room.code, room.code);
  assert.equal(owner.body.room.pickedCount, 3);
  assert.deepEqual(owner.body.room.pending.map((student) => student.number), ["4"]);
  assert.equal((await call("GET", `/api/seating/rooms/active?classId=${CLASS.id}`, { user: 8 })).body.room, null);
});

test("closing freezes the room; a new room for the class closes the old one; cancel deletes", async () => {
  assert.equal((await call("POST", `/api/seating/rooms/${room.id}/close`, { user: 8 })).status, 404, "남의 방은 못 닫는다");
  const closed = await call("POST", `/api/seating/rooms/${room.id}/close`, { user: 7 });
  assert.equal(closed.status, 200);
  assert.equal(closed.body.room.status, "closed");
  assert.equal(closed.body.room.pickedCount, 3);

  const lateJoin = await call("POST", `/api/seating/rooms/${room.code}/pick`, { user: 24, body: { seatIndex: 9 } });
  assert.equal(lateJoin.body.error, "SEATING_ROOM_CLOSED");
  const after = await call("GET", `/api/seating/rooms/${room.code}`, { user: 22 });
  assert.equal(after.body.room.status, "closed");
  assert.equal(after.body.room.me.seatIndex, 7);
  assert.equal((await call("GET", `/api/seating/rooms/active?classId=${CLASS.id}`, { user: 7 })).body.room, null);

  const second = await call("POST", "/api/seating/rooms", { user: 7, body: { classId: CLASS.id, layout: {} } });
  assert.equal(second.status, 201);
  assert.notEqual(second.body.room.code, room.code);
  const third = await call("POST", "/api/seating/rooms", { user: 7, body: { classId: CLASS.id, layout: {} } });
  assert.equal(third.status, 201);
  const secondAgain = await call("GET", `/api/seating/rooms/${second.body.room.code}`, { user: 7 });
  assert.equal(secondAgain.body.room.status, "closed", "같은 반에 새 방을 열면 이전 방은 닫힌다");
  assert.equal((await call("GET", `/api/seating/rooms/active?classId=${CLASS.id}`, { user: 7 })).body.room.code, third.body.room.code);

  assert.equal((await call("DELETE", `/api/seating/rooms/${third.body.room.id}`, { user: 8 })).status, 404);
  assert.equal((await call("DELETE", `/api/seating/rooms/${third.body.room.id}`, { user: 7 })).status, 200);
  assert.equal((await call("GET", `/api/seating/rooms/${third.body.room.code}`, { user: 21 })).status, 404);
  assert.equal(await seating.hasRoomCode(room.code), true);
  assert.equal(await seating.hasRoomCode(third.body.room.code), false);
  assert.deepEqual(await seating.resolveCode(room.code), { type: "seating", href: `/room/seat?room=${room.code}` });
  assert.equal(await seating.resolveCode("0000"), null);
});
