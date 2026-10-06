import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { createTeacherAi } = require("./teacher-ai.js");

class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
const VALID_KEY = "AIzaSyTEST-valid-key-0000000000009999";

// 가짜 구글: 계획서 읽기에는 진짜 코드 둘과 지어낸 코드 하나를, 문장 초안에는 단계 이름대로 답한다.
function fakeGoogle() {
  const seen = [];
  const fetchImpl = async (url, options = {}) => {
    const key = options.headers?.["x-goog-api-key"] || "";
    const body = options.body ? JSON.parse(options.body) : null;
    seen.push({ url: String(url), key, body });
    const json = (status, data) => ({ ok: status < 400, status, json: async () => data });
    if (key !== VALID_KEY) return json(403, { error: { message: "API key not valid" } });
    if (String(url).endsWith("/models")) return json(200, { models: [{ name: "models/gemini-2.5-flash" }] });
    const text = (body?.contents?.[0]?.parts || []).map((p) => p.text || "").join("");
    let answer;
    if (/단계별 평가결과」 문장을 쓴다/.test(text)) {
      const labels = [...text.matchAll(/\{"label":"([^"]+)","text":"…"\}/g)].map((m) => m[1]);
      answer = { criteria: labels.map((label, i) => ({ label, text: label + " 단계: 인물의 마음을 " + (i === 0 ? "깊이 " : "") + "헤아려  면담할 수 있다." })) };
    } else {
      answer = {
        items: [
          { domain: "", codes: ["6국05-05", "9국99-99"], element: "경험을 시로 표현하기", levels: 3, criteria: [{ label: "잘함", text: "생생하게 표현한다." }, { label: "보통", text: "표현한다." }, { label: "노력요함", text: "도움을 받아 표현한다." }] },
          { domain: "읽기", codes: ["6국02-01"], element: "글의 짜임 파악하기", levels: 2, criteria: [] },
          { domain: "", codes: ["없는코드"], element: "", levels: 3, criteria: [] }
        ],
        note: "1학기 항목만 옮겼습니다."
      };
    }
    return json(200, { candidates: [{ content: { parts: [{ text: "```json\n" + JSON.stringify(answer) + "\n```" }] } }] });
  };
  return { fetchImpl, seen };
}

async function startServer(fetchImpl) {
  const { PGlite } = await import("@electric-sql/pglite");
  const db = new PGlite();
  await db.exec("CREATE TABLE classroom_users (id BIGINT PRIMARY KEY); INSERT INTO classroom_users VALUES (1), (2);");
  const pool = { query: (sql, params) => db.query(sql, params) };
  const teacherAi = createTeacherAi({
    pool, requireDatabase() {}, HttpError, asyncRoute, fetchImpl, warn() {}, secret: { value: "test", derived: false },
    async requireTeacher(req) {
      const who = req.get("x-test-user") || "";
      if (who === "1" || who === "2") return { id: Number(who) };
      throw new HttpError(401, "AUTH_REQUIRED", "로그인");
    }
  });
  await teacherAi.initialize();
  const app = express();
  app.use(express.json({ limit: "256kb" }));
  app.use("/api/teacher-ai", teacherAi.router);
  app.use((error, _req, res, _next) => res.status(error.status || 500).json({ error: error.code || "ERROR", message: error.message }));
  const server = await new Promise((resolve) => { const s = app.listen(0, "127.0.0.1", () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}/api/teacher-ai`;
  const registerKey = (who) => fetch(base + "/key", { method: "PUT", headers: { "content-type": "application/json", "x-test-user": who }, body: JSON.stringify({ key: VALID_KEY }) });
  const upload = async (who, fileName, buffer, query = "") => {
    const response = await fetch(base + "/extract-plan" + query, {
      method: "POST", body: buffer,
      headers: { "content-type": "application/octet-stream", "x-file-name": encodeURIComponent(fileName), ...(who ? { "x-test-user": who } : {}) }
    });
    return { status: response.status, body: await response.json() };
  };
  const draft = async (who, body) => {
    const response = await fetch(base + "/draft-criteria", { method: "POST", body: JSON.stringify(body), headers: { "content-type": "application/json", ...(who ? { "x-test-user": who } : {}) } });
    return { status: response.status, body: await response.json() };
  };
  return { registerKey, upload, draft, close: async () => { server.close(); await db.close(); } };
}

test("계획서 파일은 나이스 틀의 항목이 되고, 성취기준 코드는 그 교과·학년군 목록에서만 받는다", async () => {
  const google = fakeGoogle();
  const s = await startServer(google.fetchImpl);
  try {
    assert.equal((await s.registerKey("1")).status, 200);
    const query = "?subject=" + encodeURIComponent("국어") + "&grade=5&semester=1&levels=3";
    const result = await s.upload("1", "계획.txt", Buffer.from("5학년 국어 1학기 수행평가\n문학: 경험을 시로 표현하기\n읽기: 글의 짜임 파악하기", "utf8"), query);
    assert.equal(result.status, 200, JSON.stringify(result.body));
    assert.equal(result.body.note, "1학기 항목만 옮겼습니다.");
    assert.ok(result.body.standardsKnown > 30, "5~6학년 국어 성취기준이 제미나이에 넘어가야 한다");
    // 지어낸 코드는 버리고, 빈 항목은 빼고, 영역명이 비었으면 성취기준의 영역을 쓴다.
    assert.equal(result.body.items.length, 2);
    const [first, second] = result.body.items;
    assert.deepEqual(first.standards.map((st) => st.code), ["6국05-05"]);
    assert.match(first.standards[0].text, /갈래/);
    assert.equal(first.domain, "문학");
    assert.equal(first.element, "경험을 시로 표현하기");
    assert.deepEqual(first.criteria.map((c) => c.label), ["잘함", "보통", "노력요함"]);
    assert.equal(first.criteria[2].text, "도움을 받아 표현한다.");
    assert.equal(second.domain, "읽기");
    assert.equal(second.levels, 2);
    assert.deepEqual(second.criteria, [{ label: "잘함", text: "" }, { label: "노력요함", text: "" }]);

    // 제미나이에 간 글: 조건, 성취기준 목록, 문서 내용이 들어 있어야 한다.
    const sentText = google.seen.at(-1).body.contents[0].parts.map((p) => p.text || "").join("");
    assert.match(sentText, /조건: 5학년, 교과 국어, 1학기/);
    assert.match(sentText, /6국05-05: 문학 \//);
    assert.match(sentText, /글의 짜임 파악하기/);

    // 교과·학년이 없으면 400, 키 없는 교사는 409, 손님은 401.
    assert.equal((await s.upload("1", "계획.txt", Buffer.from("x"), "?grade=5")).body.error, "PLAN_KEY_INVALID");
    assert.equal((await s.upload("2", "계획.txt", Buffer.from("x"), query)).status, 409);
    assert.equal((await s.upload("", "계획.txt", Buffer.from("x"), query)).status, 401);
  } finally { await s.close(); }
});

test("성취기준·평가요소로 단계별 평가결과 문장 초안을 받는다", async () => {
  const google = fakeGoogle();
  const s = await startServer(google.fetchImpl);
  try {
    await s.registerKey("1");
    const standards = [{ code: "6국05-05", text: "자신의 경험을 시, 소설, 극, 수필 등 적절한 갈래로 표현한다." }];
    const four = await s.draft("1", { subject: "국어", grade: 5, standards, element: "작품 속 인물과 면담하기", levels: 4, labels: ["매우잘함", "잘함", "보통", "노력요함"] });
    assert.equal(four.status, 200, JSON.stringify(four.body));
    assert.deepEqual(four.body.criteria.map((c) => c.label), ["매우잘함", "잘함", "보통", "노력요함"]);
    assert.equal(four.body.criteria[0].text, "매우잘함 단계: 인물의 마음을 깊이 헤아려 면담할 수 있다.");
    assert.equal(four.body.criteria[3].text, "노력요함 단계: 인물의 마음을 헤아려 면담할 수 있다.");
    const sentText = google.seen.at(-1).body.contents[0].parts[0].text;
    assert.match(sentText, /\[6국05-05\] 자신의 경험을/);
    assert.match(sentText, /평가요소: 작품 속 인물과 면담하기/);
    assert.match(sentText, /단계 4개\(매우잘함 \/ 잘함 \/ 보통 \/ 노력요함\)/);

    // 단계 이름을 안 보내면 기본 이름, 평가요소만 있어도 된다, 둘 다 없으면 400.
    const two = await s.draft("1", { standards: [], element: "분수의 덧셈", levels: 2 });
    assert.deepEqual(two.body.criteria.map((c) => c.label), ["잘함", "노력요함"]);
    assert.equal((await s.draft("1", { standards: [], element: "" })).body.error, "AI_PLAN_CONTEXT_REQUIRED");
    assert.equal((await s.draft("2", { standards, element: "x" })).status, 409);
    assert.equal((await s.draft("", { standards, element: "x" })).status, 401);
  } finally { await s.close(); }
});
