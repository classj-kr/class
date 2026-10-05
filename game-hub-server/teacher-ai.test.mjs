import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { createTeacherAi, createCipher, chooseModel } = require("./teacher-ai.js");

class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

// 교사 계정 두 명과 교사 아닌 계정 하나를 머리말로 흉내 낸다.
async function requireTeacher(req) {
  const who = req.get("x-test-user") || "";
  if (who === "teacher-a") return { id: 1, email: "a@school.test" };
  if (who === "teacher-b") return { id: 2, email: "b@school.test" };
  if (who === "student") throw new HttpError(403, "TEACHER_REGISTRATION_REQUIRED", "교사만");
  throw new HttpError(401, "AUTH_REQUIRED", "로그인");
}

async function startServer(fetchImpl) {
  const { PGlite } = await import("@electric-sql/pglite");
  const db = new PGlite();
  await db.exec("CREATE TABLE classroom_users (id BIGINT PRIMARY KEY); INSERT INTO classroom_users VALUES (1), (2);");
  const pool = { query: (sql, params) => db.query(sql, params) };
  const warnings = [];
  const teacherAi = createTeacherAi({
    pool, requireTeacher, requireDatabase() {}, HttpError, asyncRoute, fetchImpl,
    secret: { value: "test-secret", derived: true }, warn: (message) => warnings.push(message)
  });
  await teacherAi.initialize();
  const app = express();
  app.use(express.json({ limit: "256kb" })); // server.js 와 같은 크기
  app.use("/api/teacher-ai", teacherAi.router);
  app.use((error, _req, res, _next) => res.status(error.status || 500).json({ error: error.code || "ERROR", message: error.message }));
  const server = await new Promise((resolve) => { const s = app.listen(0, "127.0.0.1", () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}/api/teacher-ai`;
  const call = async (method, path, who, body) => {
    const response = await fetch(base + path, {
      method, headers: { "content-type": "application/json", ...(who ? { "x-test-user": who } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    return { status: response.status, body: await response.json() };
  };
  return { call, db, warnings, close: async () => { server.close(); await db.close(); } };
}

// 구글 흉내: 키 하나만 받아 주고, 어떤 키로 왔는지 기록한다.
function fakeGoogle(validKey = "AIzaSyTEST-valid-key-0000000000001234") {
  const seen = [];
  const fetchImpl = async (url, options = {}) => {
    const key = options.headers?.["x-goog-api-key"] || "";
    seen.push({ url: String(url), key, body: options.body ? JSON.parse(options.body) : null });
    const json = (status, data) => ({ ok: status < 400, status, json: async () => data });
    if (key !== validKey) return json(403, { error: { message: "API key not valid" } });
    if (String(url).endsWith("/models")) return json(200, { models: [{ name: "models/gemini-2.5-flash" }, { name: "models/gemini-2.5-pro" }, { name: "models/gemini-embedding-001" }] });
    if (String(url).endsWith("/interactions")) return json(404, { error: { message: "no such endpoint" } });
    return json(200, { candidates: [{ content: { parts: [{ text: "생성된 글 " + seen.length }] } }] });
  };
  return { fetchImpl, seen, validKey };
}

test("the cipher round-trips and a different secret cannot open the key", () => {
  const sealed = createCipher("one").seal("AIza-secret");
  assert.equal(createCipher("one").open(sealed), "AIza-secret");
  assert.notEqual(sealed, "AIza-secret");
  assert.throws(() => createCipher("two").open(sealed));
});

test("a flash model without preview/thinking is preferred; media-only models are skipped", () => {
  assert.equal(chooseModel(["models/gemini-2.0-flash", "models/gemini-2.5-flash-preview", "models/gemini-2.5-pro", "models/imagen-3"]), "gemini-2.0-flash");
  assert.equal(chooseModel(["models/gemini-2.5-pro"]), "gemini-2.5-pro");
  assert.equal(chooseModel(["models/gemini-2.5-flash"], "gemini-2.5-flash"), null);
});

test("keys are checked with Google, stored sealed, shown only by their last four characters, and used server-side", async () => {
  const google = fakeGoogle();
  const s = await startServer(google.fetchImpl);
  try {
    assert.deepEqual((await s.call("GET", "/key", "teacher-a")).body, { registered: false, last4: "" });

    const bad = await s.call("PUT", "/key", "teacher-a", { key: "AIzaSyWRONG-key-000000000000000000" });
    assert.equal(bad.status, 400);
    assert.equal(bad.body.error, "AI_KEY_REJECTED");

    const saved = await s.call("PUT", "/key", "teacher-a", { key: google.validKey });
    assert.deepEqual(saved.body, { registered: true, last4: "1234" });
    const row = (await s.db.query("SELECT key_sealed, key_last4 FROM teacher_ai_keys WHERE user_id = 1")).rows[0];
    assert.ok(!row.key_sealed.includes(google.validKey), "key must not be stored in clear");
    assert.equal(row.key_last4, "1234");

    const generated = await s.call("POST", "/generate", "teacher-a", { prompt: "학생 활동을 정리해 줘" });
    assert.equal(generated.status, 200, JSON.stringify(generated.body));
    assert.match(generated.body.text, /^생성된 글/);
    assert.deepEqual(Object.keys(generated.body), ["text"]);
    const lastCall = google.seen.at(-1);
    assert.equal(lastCall.key, google.validKey, "the server sends the stored key to Google");
    assert.match(lastCall.url, /gemini-2\.5-flash:generateContent$/);
    assert.equal((await s.db.query("SELECT model FROM teacher_ai_keys WHERE user_id = 1")).rows[0].model, "gemini-2.5-flash");

    // 아무 응답에도 키 자체는 실리지 않는다.
    for (const [method, path] of [["GET", "/key"], ["POST", "/check"]]) {
      const r = await s.call(method, path, "teacher-a", method === "GET" ? undefined : {});
      assert.ok(!JSON.stringify(r.body).includes(google.validKey), `${method} ${path} leaked the key`);
    }

    // 다른 교사에게는 없는 키, 교사가 아니면 403, 로그인 없으면 401.
    assert.deepEqual((await s.call("GET", "/key", "teacher-b")).body, { registered: false, last4: "" });
    assert.equal((await s.call("POST", "/generate", "teacher-b", { prompt: "x" })).status, 409);
    assert.equal((await s.call("GET", "/key", "student")).status, 403);
    assert.equal((await s.call("GET", "/key", "")).status, 401);

    assert.deepEqual((await s.call("DELETE", "/key", "teacher-a")).body, { registered: false, last4: "" });
    assert.equal((await s.call("POST", "/generate", "teacher-a", { prompt: "x" })).status, 409);
    assert.equal(s.warnings.length, 1, "derived secret is warned about once");
  } finally { await s.close(); }
});

test("empty or oversized prompts are rejected before touching Google", async () => {
  const google = fakeGoogle();
  const s = await startServer(google.fetchImpl);
  try {
    await s.call("PUT", "/key", "teacher-a", { key: google.validKey });
    const calls = google.seen.length;
    assert.equal((await s.call("POST", "/generate", "teacher-a", { prompt: "   " })).body.error, "AI_PROMPT_REQUIRED");
    assert.equal((await s.call("POST", "/generate", "teacher-a", { prompt: "가".repeat(60001) })).body.error, "AI_PROMPT_TOO_LONG");
    assert.equal(google.seen.length, calls);
  } finally { await s.close(); }
});
