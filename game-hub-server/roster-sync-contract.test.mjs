import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const serverSource = await readFile(new URL("./classroom-platform.js", import.meta.url), "utf8");
const dashboardSource = await readFile(new URL("../classtools/dashboard.html", import.meta.url), "utf8");
const seatingSource = await readFile(new URL("../classtools/seating.html", import.meta.url), "utf8");
const indexSource = await readFile(new URL("../classtools/index.html", import.meta.url), "utf8");
const adminIndexSource = await readFile(new URL("../admin/index.html", import.meta.url), "utf8");
const recordAiSource = await readFile(new URL("../classtools/record-ai.html", import.meta.url), "utf8");

function handlerBody(source, routeSignature) {
  const start = source.indexOf(routeSignature);
  assert.ok(start !== -1, `Route not found: ${routeSignature}`);
  const end = source.indexOf("\n  }));", start);
  assert.ok(end !== -1, `Route handler close not found for: ${routeSignature}`);
  return source.slice(start, end);
}

test("GET /teacher/class auto-provisions the homeroom class from classroom_teachers instead of requiring a manual roster save first", () => {
  const body = handlerBody(serverSource, `router.get("/teacher/class"`);
  assert.match(body, /await userClassId\(teacher\)/);
});

test("GET /teacher/available-classes auto-provisions the requesting teacher's own class and counts school_students", () => {
  const body = handlerBody(serverSource, `router.get("/teacher/available-classes"`);
  assert.match(body, /await userClassId\(teacher\)/);
  assert.match(body, /FROM school_students ss/);
});

test("the teacher/class roster query never shows a student twice when they exist in both school_students and classroom_students", () => {
  const body = handlerBody(serverSource, `router.get("/teacher/class"`);
  assert.match(body, /FROM classroom_students s\s+WHERE s\.class_id = \$5\s+AND s\.roster_active = TRUE\s+AND NOT EXISTS/);
});

test("userClassId provisions classroom_classes with the teacher's real name, not a placeholder label", () => {
  assert.match(serverSource, /teacher_name = EXCLUDED\.teacher_name/);
  assert.match(serverSource, /t\.teacher_name \|\| `\$\{t\.grade\}학년 \$\{t\.class_number\}반`/);
});

test("PUT /school/teachers clears stale classroom_classes links when a teacher's grade/class assignment changes", () => {
  const body = handlerBody(serverSource, `router.put("/school/teachers"`);
  assert.match(body, /SET teacher_user_id = NULL/);
});

test("teacher-facing pages no longer fall back to the hardcoded sample roster when the real class can't be loaded", () => {
  for (const source of [dashboardSource, seatingSource, indexSource]) {
    assert.doesNotMatch(source, /김민준/);
    assert.doesNotMatch(source, /송화초등학교/);
  }
});

test("the four unreachable admin teacher-assignment routes were removed, leaving only the live master-email route", () => {
  assert.doesNotMatch(serverSource, /router\.put\("\/admin\/schools\/:schoolId\/teachers\/roster"/);
  assert.doesNotMatch(serverSource, /router\.post\("\/admin\/schools\/:schoolId\/teachers"/);
  assert.doesNotMatch(serverSource, /router\.patch\("\/admin\/teachers\/:teacherId"/);
  assert.doesNotMatch(serverSource, /router\.delete\("\/admin\/teachers\/:teacherId"/);
  assert.doesNotMatch(serverSource, /router\.post\("\/admin\/teachers\/:teacherId\/unlink"/);
  assert.match(serverSource, /router\.put\("\/admin\/schools\/:schoolId\/master-email"/);
});

test("admin/index.html no longer references the deleted roster textarea fields, which used to throw on load and block the school switcher", () => {
  assert.doesNotMatch(adminIndexSource, /rosterType|rosterName|rosterEmail|saveRosterButton/);
  assert.match(adminIndexSource, /schoolSelect\.addEventListener\("change"/);
});

test("record-ai.html reads the roster from the classroom object it actually gets back, and tells the teacher when it couldn't load", () => {
  // GET /teacher/class answers { classroom: { students } }. Only the club route
  // answers a top-level { students }, so that read is allowed in the club branch alone.
  const classResponse = handlerBody(serverSource, `router.get("/teacher/class"`);
  assert.match(classResponse, /return res\.json\(\{\s*classroom: \{[\s\S]*?\n\s*students: studentsResult\.rows\.map/);
  const clubResponse = handlerBody(serverSource, `router.get("/teacher/groups/:groupId/students"`);
  assert.match(clubResponse, /res\.json\(\{\s*group: \{[^}]*\},\s*students: studentsResult\.rows\.map/);

  assert.match(
    recordAiSource,
    /const list = \(scope && scope\.kind === 'club'\) \? \(body\.students \|\| \[\]\) : \(\(body\.classroom \|\| \{\}\)\.students \|\| \[\]\);/
  );
  // No other read of `.students` may creep back in (the old bug read it off the class response).
  assert.equal((recordAiSource.match(/\.students\b/g) || []).length, 2);
  assert.match(recordAiSource, /rosterStatus\.textContent = '명단을 불러오지 못했습니다\. 인원수를 직접 적어 주세요\.';/);
});
