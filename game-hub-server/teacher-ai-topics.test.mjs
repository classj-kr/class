import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import zlib from "node:zlib";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { createTeacherAi } = require("./teacher-ai.js");
const { readPlanDocument, xmlToText } = require("./plan-document.js");

class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
const VALID_KEY = "AIzaSyTEST-valid-key-0000000000009999";

// 가짜 구글: 키 검사와 "활동·특성 목록" 요청만 안다. 글이 함께 오면 글에서 찾았다고 표시한다.
function fakeGoogle() {
  const seen = [];
  const fetchImpl = async (url, options = {}) => {
    const key = options.headers?.["x-goog-api-key"] || "";
    const body = options.body ? JSON.parse(options.body) : null;
    seen.push({ url: String(url), key, body });
    const json = (status, data) => ({ ok: status < 400, status, json: async () => data });
    if (key !== VALID_KEY) return json(403, { error: { message: "API key not valid" } });
    if (String(url).endsWith("/models")) return json(200, { models: [{ name: "models/gemini-2.5-flash" }] });
    const parts = body?.contents?.[0]?.parts || [];
    const fromFile = parts.find((p) => p.inline_data);
    const text = parts.map((p) => p.text || "").join("");
    const subject = /과목\(영역\): ([^,.\n]+)/.exec(text)?.[1] || "수학";
    const answer = {
      subject, semester: "1학기",
      topics: [
        { title: "분수의 덧셈과 뺄셈 계산하기", detail: fromFile ? fromFile.inline_data.mime_type : (/분수/.test(text) ? "문서에서 찾음" : "") },
        { title: "  직사각형과   삼각형의 넓이 구하기 ", detail: "5단원" },
        "실생활 문제를 식으로 나타내고 해결하기",
        { title: "" }
      ],
      note: ""
    };
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
    const response = await fetch(base + "/extract-topics" + query, {
      method: "POST", body: buffer,
      headers: { "content-type": "application/octet-stream", "x-file-name": encodeURIComponent(fileName), ...(who ? { "x-test-user": who } : {}) }
    });
    return { status: response.status, body: await response.json() };
  };
  return { registerKey, upload, close: async () => { server.close(); await db.close(); } };
}

// zip 흉내(hwpx·docx): 항목 몇 개를 deflate 로 넣는다.
function makeZip(entries) {
  const parts = [], dir = []; let offset = 0;
  for (const [name, content] of entries) {
    const data = zlib.deflateRawSync(Buffer.from(content, "utf8")), n = Buffer.from(name);
    const local = Buffer.alloc(30); local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(8, 8); local.writeUInt32LE(data.length, 18); local.writeUInt32LE(Buffer.byteLength(content), 22); local.writeUInt16LE(n.length, 26);
    const central = Buffer.alloc(46); central.writeUInt32LE(0x02014b50, 0); central.writeUInt16LE(8, 10); central.writeUInt32LE(data.length, 20); central.writeUInt32LE(Buffer.byteLength(content), 24); central.writeUInt16LE(n.length, 28); central.writeUInt32LE(offset, 42);
    parts.push(local, n, data); dir.push(central, n); offset += local.length + n.length + data.length;
  }
  const dirBuffer = Buffer.concat(dir), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10); end.writeUInt32LE(dirBuffer.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...parts, dirBuffer, end]);
}

test("plan documents: hwpx/docx text comes out of the zip, pdf/images are passed through, hwp is refused", () => {
  const hwpx = makeZip([["Contents/section0.xml", "<hp:p><hp:run><hp:t>수행평가 계획</hp:t></hp:run></hp:p><hp:tbl><hp:tr><hp:tc><hp:p><hp:t>단원</hp:t></hp:p></hp:tc><hp:tc><hp:p><hp:t>분수의 덧셈 &amp; 뺄셈</hp:t></hp:p></hp:tc></hp:tr></hp:tbl>"]]);
  assert.deepEqual(readPlanDocument(hwpx, "계획.hwpx"), { kind: "text", text: "수행평가 계획\n단원\n\t분수의 덧셈 & 뺄셈" });
  const docx = makeZip([["word/document.xml", "<w:body><w:p><w:r><w:t>1학기 수행평가</w:t></w:r></w:p><w:p><w:r><w:t>넓이 구하기</w:t></w:r></w:p></w:body>"]]);
  assert.deepEqual(readPlanDocument(docx, "plan.docx"), { kind: "text", text: "1학기 수행평가\n넓이 구하기" });
  assert.equal(readPlanDocument(Buffer.from("%PDF-1.7 x"), "plan.pdf").mime, "application/pdf");
  assert.equal(readPlanDocument(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0, 0, 0, 0, 0]), "scan.png").mime, "image/png");
  assert.equal(readPlanDocument(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0]), "scan.jpg").mime, "image/jpeg");
  assert.equal(readPlanDocument(Buffer.from([1, 2, 3]), "plan.hwp").kind, "unsupported");
  assert.equal(readPlanDocument(Buffer.from("한글 글"), "plan.txt").text, "한글 글");
  assert.equal(xmlToText("<a>x&lt;y&gt;</a>"), "x<y>");
});

test("a plan document becomes one topic per line, by text or as a file, only for teachers with a key", async () => {
  const google = fakeGoogle();
  const s = await startServer(google.fetchImpl);
  try {
    assert.equal((await s.registerKey("1")).status, 200);
    const query = "?area=subject&subject=" + encodeURIComponent("수학") + "&semester=" + encodeURIComponent("1학기") + "&grade=5";
    const asText = await s.upload("1", "수행평가계획.txt", Buffer.from("5학년 수학 1학기 수행평가\n1. 분수의 덧셈과 뺄셈\n2. 다각형의 넓이", "utf8"), query);
    assert.equal(asText.status, 200, JSON.stringify(asText.body));
    assert.deepEqual(asText.body.topics.map((t) => t.title), ["분수의 덧셈과 뺄셈 계산하기", "직사각형과 삼각형의 넓이 구하기", "실생활 문제를 식으로 나타내고 해결하기"]);
    assert.equal(asText.body.topics[0].detail, "문서에서 찾음");
    assert.deepEqual([asText.body.subject, asText.body.semester, asText.body.source], ["수학", "1학기", "text"]);
    const sent = google.seen.at(-1);
    assert.equal(sent.key, VALID_KEY);
    const sentText = sent.body.contents[0].parts.map((p) => p.text || "").join("");
    assert.match(sentText, /과목\(영역\): 수학, 학기: 1학기/);
    assert.match(sentText, /다각형의 넓이/);

    const asPdf = await s.upload("1", "plan.pdf", Buffer.from("%PDF-1.4 fake"), "?area=subject");
    assert.equal(asPdf.status, 200, JSON.stringify(asPdf.body));
    assert.equal(asPdf.body.source, "application/pdf");
    assert.equal(asPdf.body.topics[0].detail, "application/pdf");
    assert.equal(google.seen.at(-1).body.contents[0].parts[0].inline_data.mime_type, "application/pdf");
    assert.equal(google.seen.at(-1).body.contents[0].parts[0].inline_data.data, Buffer.from("%PDF-1.4 fake").toString("base64"));

    assert.equal((await s.upload("1", "plan.hwp", Buffer.from([1, 2, 3]))).status, 415);
    assert.equal((await s.upload("1", "plan.txt", Buffer.from("   "))).status, 422);
    assert.equal((await s.upload("", "plan.txt", Buffer.from("x"))).status, 401);
    assert.equal((await s.upload("2", "plan.txt", Buffer.from("x"))).body.error, "AI_KEY_REQUIRED");
  } finally { await s.close(); }
});
