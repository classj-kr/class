import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { once } from "node:events";
import test from "node:test";

const require = createRequire(import.meta.url);
const express = require("express");
const { createVoting } = require("./voting.js");
class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
const room = { id: 1, room_code: "1234", title: "학급선거", creator_user_id: 10,
  school_id: 1, academic_year: 2026, grade: 6, class_number: 2, status: "open" };
const selections = [{ positionId: 11, candidateId: 111 }];

async function fixture(t) {
  const ballots = [];
  const participants = [];
  const queries = [];
  const rows = (items) => ({ rows: items, rowCount: items.length });
  const pool = {
    async query(sql, params = []) {
      const q = sql.replace(/\s+/g, " ").trim();
      queries.push(q);
      if (["BEGIN", "COMMIT", "ROLLBACK"].includes(q)) return rows([]);
      if (q.includes("memberships ORDER BY priority")) {
        const id = Number(params[0]);
        return rows([21, 22, 23].includes(id) ? [{ ...room,
          class_number: id === 22 ? 3 : 2, voter_key: `school:${id}` }] : []);
      }
      if (q.startsWith("SELECT 1 FROM vote_rooms")) return rows(params[0] === "1234" ? [{}] : []);
      if (q.includes("FROM multiplayer_room_snapshots")) return rows([]);
      if (q.startsWith("SELECT r.*, u.display_name")) return rows([room]);
      if (q.startsWith("INSERT INTO vote_room_participants")) { participants.push(params); return rows([]); }
      if (q.includes("AS roster_count")) return rows([{ roster_count: 2, legacy_count: 0 }]);
      if (q.includes("COUNT(DISTINCT voter_key)")) return rows([{ voter_count: ballots.length }]);
      if (q.startsWith("SELECT position_id, candidate_id FROM vote_ballots")) {
        return rows(ballots.filter((b) => b.voter_key === params[1]));
      }
      if (q.includes("FROM vote_positions p")) return rows([{ position_id: 11, position_title: "회장",
        candidate_id: 111, candidate_name: "후보", votes: ballots.length }]);
      if (q.startsWith("SELECT status FROM vote_rooms")) return rows([{ status: "open" }]);
      if (q.startsWith("SELECT 1 FROM vote_ballots")) return rows(ballots.filter((b) => b.voter_key === params[1]));
      if (q.startsWith("INSERT INTO vote_ballots")) {
        ballots.push({ position_id: params[1], candidate_id: params[2], voter_user_id: params[3], voter_key: params[4] });
        return rows([]);
      }
      throw new Error(`Unexpected SQL: ${q}`);
    },
    async connect() { return { query: this.query.bind(this), release() {} }; }
  };
  const sessionUser = async (req) => req.get("x-user")
    ? { id: Number(req.get("x-user")), email: "student@example.test", display_name: "학생" } : null;
  const requireUser = async (req) => {
    const user = await sessionUser(req);
    if (!user) throw new HttpError(401, "AUTH_REQUIRED", "로그인 필요");
    return user;
  };
  const voting = createVoting({ pool, sessionUser, requireUser,
    guestAccess: (req) => req.get("x-guest") ? { name: "학생" } : null,
    requireTeacher: async (req) => {
      const user = await requireUser(req);
      if (user.id !== 10) throw new HttpError(403, "TEACHER_REQUIRED", "교사 전용");
      return user;
    },
    requireDatabase() {}, teacherRegistration: async () => null,
    isLiveQuizRaceCode: (code) => code === "5678",
    resolveRoomCode: async (code) => code === "9012" ? { type: "seating", href: "/room/seat?room=9012" } : null,
    HttpError, asyncRoute: (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next)
  });
  const app = express();
  app.use(express.json());
  app.use("/api/vote", voting.router);
  app.use((error, _req, res, _next) => res.status(error.status || 500).json({ error: error.code, message: error.message }));
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const call = async (method, path, { user, guest = false, body } = {}) => {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/vote${path}`, {
      method, headers: { "Content-Type": "application/json", ...(user ? { "x-user": String(user) } : {}),
        ...(guest ? { "x-guest": "existing-guest-session" } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {})
    });
    return { status: response.status, body: await response.json() };
  };
  return { call, ballots, participants, queries };
}

test("anonymous and existing guest sessions cannot read or submit any election", async (t) => {
  const { call, queries, ballots, participants } = await fixture(t);
  for (const guest of [false, true]) {
    for (const [method, path] of [["GET", "/me"], ["GET", "/rooms/1234"],
      ["POST", "/rooms/1234/ballots"], ["GET", "/rooms/mine"], ["POST", "/rooms"],
      ["POST", "/rooms/1/close"], ["DELETE", "/rooms/1"]]) {
      const result = await call(method, path, { guest, body: method === "POST" ? { selections } : undefined });
      assert.equal(result.status, 401, `${method} ${path}, guest=${guest}`);
      assert.equal(result.body.error, "AUTH_REQUIRED");
    }
  }
  assert.deepEqual(queries, []);
  assert.deepEqual(ballots, []);
  assert.deepEqual(participants, []);
});

test("shared room entry blocks guest voting but preserves race and seating entry", async (t) => {
  const { call } = await fixture(t);
  assert.equal((await call("GET", "/resolve/1234", { guest: true })).status, 401);
  assert.equal((await call("GET", "/resolve/1234", { user: 21 })).body.type, "vote");
  assert.equal((await call("GET", "/resolve/5678", { guest: true })).body.type, "quizrace");
  assert.equal((await call("GET", "/resolve/9012", { guest: true })).body.type, "seating");
  assert.equal((await call("GET", "/resolve/5678")).status, 401);
});

test("registered students can vote once; a guest cookie never overrides their account", async (t) => {
  const { call, ballots, participants } = await fixture(t);
  const identity = { user: 21, guest: true };
  assert.equal((await call("GET", "/me", identity)).body.isStudent, true);
  assert.equal((await call("GET", "/rooms/1234", identity)).status, 200);
  assert.deepEqual(participants[0], [1, 21, "school:21"]);
  assert.equal((await call("POST", "/rooms/1234/ballots", { ...identity, body: { selections } })).status, 201);
  assert.equal(ballots[0].voter_user_id, 21);
  assert.equal(ballots[0].voter_key, "school:21");
  assert.equal((await call("POST", "/rooms/1234/ballots", { ...identity, body: { selections } })).body.error, "ALREADY_VOTED");
  // Historical guest ballots keep the same roster key when the student now signs in.
  ballots.push({ voter_key: "school:23", voter_user_id: null, position_id: 11, candidate_id: 111 });
  assert.equal((await call("POST", "/rooms/1234/ballots", { user: 23, body: { selections } })).body.error, "ALREADY_VOTED");
  assert.equal(ballots.length, 2);
});

test("guest names cannot bypass missing or different-class student membership", async (t) => {
  const { call, ballots, participants } = await fixture(t);
  for (const [user, code] of [[99, "STUDENT_REQUIRED"], [22, "CLASS_MISMATCH"]]) {
    for (const [method, path] of [["GET", "/rooms/1234"], ["POST", "/rooms/1234/ballots"]]) {
      const result = await call(method, path, { user, guest: true, body: method === "POST" ? { selections } : undefined });
      assert.equal(result.status, 403);
      assert.equal(result.body.error, code);
    }
  }
  assert.deepEqual(ballots, []);
  assert.deepEqual(participants, []);
});
