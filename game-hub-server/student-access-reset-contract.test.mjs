import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const serverSource = await readFile(new URL("./classroom-platform.js", import.meta.url), "utf8");
const studentsPage = await readFile(new URL("../apps/classtools/students.html", import.meta.url), "utf8");

function handlerBody(source, routeSignature) {
  const start = source.indexOf(routeSignature);
  assert.ok(start !== -1, `Route not found: ${routeSignature}`);
  const end = source.indexOf("\n  }));", start);
  assert.ok(end !== -1, `Route handler close not found for: ${routeSignature}`);
  return source.slice(start, end);
}

test("student access reset is a teacher action (the homeroom teacher unlinking their own student), scoped and transactional", () => {
  const body = handlerBody(serverSource, `router.post("/teacher/students/:studentId/reset-access"`);
  assert.match(body, /await requireTeacher\(req\)/);
  assert.match(body, /WHERE s\.id = \$1 AND c\.teacher_user_id = \$2/);
  assert.match(body, /FOR UPDATE/);
  assert.match(body, /await client\.query\("BEGIN"\)/);
  assert.match(body, /await client\.query\("COMMIT"\)/);
});

test("reset revokes the session and unlinks the Google account, and never touches a password (there is none)", () => {
  const body = handlerBody(serverSource, `router.post("/teacher/students/:studentId/reset-access"`);
  assert.match(body, /DELETE FROM classroom_sessions WHERE user_id = \$1/);
  assert.match(body, /SET user_id = NULL, claimed_at = NULL/);
  assert.match(body, /birthday_mmdd = NULL, birthday_visible = FALSE/);
  assert.match(body, /INSERT INTO classroom_student_access_resets/);
  assert.doesNotMatch(body, /password/i);
});

test("the roster screen describes this as unlinking a Google account, not resetting a password", () => {
  assert.match(studentsPage, /Google 계정 연결 해제/);
  assert.doesNotMatch(studentsPage, /비밀번호/);
});
