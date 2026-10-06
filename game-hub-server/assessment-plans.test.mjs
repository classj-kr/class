import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { createAssessmentPlans, cleanItems, planKey, LEVEL_LABELS } = require("./assessment-plans.js");

class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

// 교사 1·2는 같은 학교(10), 교사 3은 다른 학교(20), 교사 4는 학교 등록이 없다.
const TEACHERS = { 1: { school_id: 10, school_name: "가 초등학교", teacher_name: "교사 하나" }, 2: { school_id: 10, school_name: "가 초등학교", teacher_name: "교사 둘" }, 3: { school_id: 20, school_name: "나 초등학교", teacher_name: "교사 셋" }, 4: null };

async function startServer() {
  const { PGlite } = await import("@electric-sql/pglite");
  const db = new PGlite();
  await db.exec(`
    CREATE TABLE classroom_schools (id BIGINT PRIMARY KEY);
    INSERT INTO classroom_schools VALUES (10), (20);
    CREATE TABLE classroom_users (id BIGINT PRIMARY KEY, display_name TEXT);
    INSERT INTO classroom_users VALUES (1, '교사 하나'), (2, '교사 둘'), (3, '교사 셋'), (4, '교사 넷');
  `);
  const pool = { query: (sql, params) => db.query(sql, params) };
  const plans = createAssessmentPlans({
    pool, requireDatabase() {}, HttpError, asyncRoute,
    async requireTeacher(req) {
      const who = req.get("x-test-user") || "";
      if (TEACHERS[who] !== undefined) return { id: Number(who) };
      throw new HttpError(401, "AUTH_REQUIRED", "로그인");
    },
    async teacherRegistration(user) { return TEACHERS[user.id]; }
  });
  await plans.initialize();
  await plans.initialize(); // 다시 띄워도 괜찮아야 한다
  const app = express();
  app.use(express.json({ limit: "512kb" }));
  app.use("/api/teacher/assessment-plans", plans.router);
  app.use((error, _req, res, _next) => res.status(error.status || 500).json({ error: error.code || "ERROR", message: error.message }));
  const server = await new Promise((resolve) => { const s = app.listen(0, "127.0.0.1", () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}/api/teacher/assessment-plans`;
  const call = async (method, path, who, body) => {
    const response = await fetch(base + path, {
      method, headers: { "content-type": "application/json", ...(who ? { "x-test-user": who } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    return { status: response.status, body: await response.json() };
  };
  return { call, close: async () => { server.close(); await db.close(); } };
}

const KEY = { year: 2026, grade: 5, semester: 1, subject: "국어" };
const query = (key) => "?" + new URLSearchParams(key);

test("cleanItems: 단계 수에 맞춰 단계 이름을 채우고, 길이와 개수를 자른다", () => {
  const [item] = cleanItems([{ domain: " 문학 ", standards: ["6국05-01", { code: "6국05-02", text: "글 " }, { code: "", text: "" }], element: "인물과 면담하기\r\n", levels: 4, criteria: [{ label: "", text: "잘 함" }, { text: "보통" }] }]);
  assert.deepEqual(item, {
    domain: "문학", standards: [{ code: "6국05-01", text: "" }, { code: "6국05-02", text: "글" }], element: "인물과 면담하기", levels: 4,
    criteria: [{ label: "매우잘함", text: "잘 함" }, { label: "잘함", text: "보통" }, { label: "보통", text: "" }, { label: "노력요함", text: "" }]
  });
  assert.equal(cleanItems([{ levels: 9 }])[0].levels, 5);
  assert.equal(cleanItems([{ levels: 1 }])[0].levels, 2);
  assert.equal(cleanItems([{}])[0].criteria.length, 3);
  assert.deepEqual(cleanItems([{ criteria: [{ label: "A" }, { label: "B" }, { label: "C" }] }])[0].criteria.map((c) => c.label), ["A", "B", "C"]);
  assert.equal(cleanItems(Array.from({ length: 80 }, () => ({}))).length, 60);
  assert.equal(cleanItems("x").length, 0);
  assert.deepEqual(LEVEL_LABELS[2], ["잘함", "노력요함"]);
});

test("planKey: 학년도·학년·학기·교과가 다 맞아야 한다", () => {
  assert.deepEqual(planKey({ year: "2026", grade: "3", semester: "2", subject: " 수학 " }), { year: 2026, grade: 3, semester: 2, subject: "수학" });
  for (const bad of [{ ...KEY, year: 1999 }, { ...KEY, grade: 0 }, { ...KEY, grade: 10 }, { ...KEY, semester: 3 }, { ...KEY, subject: "" }, {}]) assert.equal(planKey(bad), null);
});

test("같은 학교 교사는 계획을 함께 보고 고치고, 다른 학교·미등록 교사·손님은 못 본다", async () => {
  const s = await startServer();
  try {
    const empty = await s.call("GET", query(KEY), "1");
    assert.equal(empty.status, 200);
    assert.deepEqual(empty.body, { key: KEY, schoolName: "가 초등학교", items: [], updatedAt: null, updatedByName: "" });

    const items = [{ domain: "문학", standards: [{ code: "6국05-05", text: "자신의 경험을 시, 소설, 극, 수필 등 적절한 갈래로 표현한다." }], element: "경험을 시로 표현하기", levels: 3, criteria: [{ label: "잘함", text: "경험을 시로 생생하게 표현할 수 있다." }, { label: "보통", text: "경험을 시로 표현할 수 있다." }, { label: "노력요함", text: "도움을 받아 경험을 시로 표현할 수 있다." }] }];
    const saved = await s.call("PUT", "", "1", { ...KEY, items });
    assert.equal(saved.status, 200, JSON.stringify(saved.body));
    assert.deepEqual(saved.body.items, items);
    assert.ok(saved.body.updatedAt);

    // 옆 반 교사(같은 학교)가 읽고 고친다.
    const colleague = await s.call("GET", query(KEY), "2");
    assert.deepEqual(colleague.body.items, items);
    assert.equal(colleague.body.updatedByName, "교사 하나");
    const changed = [...items, { domain: "읽기", standards: [], element: "글의 짜임 파악하기", levels: 2, criteria: [{ label: "잘함", text: "" }, { label: "노력요함", text: "" }] }];
    assert.equal((await s.call("PUT", "", "2", { ...KEY, items: changed })).status, 200);
    const again = await s.call("GET", query(KEY), "1");
    assert.equal(again.body.items.length, 2);
    assert.equal(again.body.updatedByName, "교사 둘");

    // 다른 학기·교과는 따로 둔다. 요약은 학년도·학년 안의 교과별 유무.
    assert.equal((await s.call("PUT", "", "1", { ...KEY, semester: 2, subject: "수학", items: [{ element: "분수의 덧셈" }] })).status, 200);
    assert.deepEqual((await s.call("GET", query({ ...KEY, subject: "수학" }), "1")).body.items, []);
    const summary = (await s.call("GET", "/summary?year=2026&grade=5", "2")).body.plans;
    assert.deepEqual(summary.map((p) => [p.semester, p.subject, p.count]), [[1, "국어", 2], [2, "수학", 1]]);

    // 다른 학교에는 보이지 않고, 미등록 교사는 403, 손님은 401.
    assert.deepEqual((await s.call("GET", query(KEY), "3")).body.items, []);
    assert.deepEqual((await s.call("GET", "/summary?year=2026&grade=5", "3")).body.plans, []);
    assert.equal((await s.call("GET", query(KEY), "4")).status, 403);
    assert.equal((await s.call("PUT", "", "4", { ...KEY, items })).status, 403);
    assert.equal((await s.call("GET", query(KEY), "")).status, 401);

    // 열쇠가 틀리면 400.
    assert.equal((await s.call("GET", query({ ...KEY, semester: 3 }), "1")).body.error, "PLAN_KEY_INVALID");
    assert.equal((await s.call("PUT", "", "1", { ...KEY, grade: 0, items })).body.error, "PLAN_KEY_INVALID");
    assert.equal((await s.call("GET", "/summary?year=abc&grade=5", "1")).body.error, "PLAN_KEY_INVALID");
  } finally { await s.close(); }
});
