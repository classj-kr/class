import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { createUserStorage } = require("./user-storage.js");

class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

async function startServer() {
  const { PGlite } = await import("@electric-sql/pglite");
  const db = new PGlite();
  await db.exec("CREATE TABLE classroom_users (id BIGINT PRIMARY KEY); INSERT INTO classroom_users VALUES (1), (2);");
  const pool = { query: (sql, params) => db.query(sql, params) };
  const storage = createUserStorage({
    pool, requireDatabase() {}, HttpError, asyncRoute,
    async requireUser(req) {
      const who = req.get("x-test-user") || "";
      if (who === "1" || who === "2") return { id: Number(who) };
      throw new HttpError(401, "AUTH_REQUIRED", "로그인");
    }
  });
  await storage.initialize();
  await storage.initialize(); // 다시 띄워도 괜찮아야 한다
  const app = express();
  app.use(express.json({ limit: "1100kb" }));
  app.use("/api/me/storage", storage.router);
  app.use((error, _req, res, _next) => res.status(error.status || 500).json({ error: error.code || "ERROR", message: error.message }));
  const server = await new Promise((resolve) => { const s = app.listen(0, "127.0.0.1", () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}/api/me/storage/`;
  const call = async (method, path, who, body) => {
    const response = await fetch(base + path, {
      method, headers: { "content-type": "application/json", ...(who ? { "x-test-user": who } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    return { status: response.status, body: await response.json() };
  };
  return { call, close: async () => { server.close(); await db.close(); } };
}

test("items are kept per account and per app; guests get nothing", async () => {
  const s = await startServer();
  try {
    assert.deepEqual((await s.call("GET", "blackboard", "1")).body, { items: {} });
    assert.equal((await s.call("PUT", "blackboard/strokes", "1", { value: [{ tool: "pen", points: [{ x: 1, y: 2 }] }] })).status, 200);
    assert.equal((await s.call("PUT", "blackboard/tools", "1", { value: { pen: 10, correction: false } })).status, 200);
    assert.equal((await s.call("PUT", "record-ai/record_result:12:교과:1학기:국어", "1", { value: "{\"items\":[]}" })).status, 200);

    const mine = (await s.call("GET", "blackboard", "1")).body.items;
    assert.deepEqual(Object.keys(mine).sort(), ["strokes", "tools"]);
    assert.deepEqual(mine.tools, { pen: 10, correction: false });
    assert.deepEqual((await s.call("GET", encodeURIComponent("record-ai"), "1")).body.items, { "record_result:12:교과:1학기:국어": "{\"items\":[]}" });

    // 다른 계정에는 보이지 않고, 로그인 없이는 401.
    assert.deepEqual((await s.call("GET", "blackboard", "2")).body, { items: {} });
    assert.equal((await s.call("GET", "blackboard", "")).status, 401);
    assert.equal((await s.call("PUT", "blackboard/strokes", "", { value: 1 })).status, 401);

    // 덮어쓰기와 지우기.
    await s.call("PUT", "blackboard/tools", "1", { value: { pen: 4 } });
    assert.deepEqual((await s.call("GET", "blackboard", "1")).body.items.tools, { pen: 4 });
    assert.equal((await s.call("DELETE", "blackboard/strokes", "1")).status, 200);
    assert.deepEqual(Object.keys((await s.call("GET", "blackboard", "1")).body.items), ["tools"]);
    assert.equal((await s.call("DELETE", "blackboard", "1")).status, 200);
    assert.deepEqual((await s.call("GET", "blackboard", "1")).body, { items: {} });
  } finally { await s.close(); }
});

test("names and sizes are checked", async () => {
  const s = await startServer();
  try {
    assert.equal((await s.call("GET", encodeURIComponent("bad app"), "1")).body.error, "STORAGE_APP_INVALID");
    assert.equal((await s.call("PUT", "dashboard/" + encodeURIComponent("a/b"), "1", { value: 1 })).body.error, "STORAGE_ITEM_INVALID");
    assert.equal((await s.call("PUT", "dashboard/x", "1", {})).body.error, "STORAGE_VALUE_REQUIRED");
    assert.equal((await s.call("PUT", "dashboard/x", "1", { value: "가".repeat(400000) })).status, 413);
    assert.equal((await s.call("PUT", "dashboard/x", "1", { value: null })).status, 200);
    assert.deepEqual((await s.call("GET", "dashboard", "1")).body.items, { x: null });
  } finally { await s.close(); }
});
