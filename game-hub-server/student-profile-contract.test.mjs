import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const serverSource = await readFile(new URL("./classroom-platform.js", import.meta.url), "utf8");
const pageSource = await readFile(new URL("../apps/classtools/profile.html", import.meta.url), "utf8");

// Comments in implementation code are not controls or copy shown to students.
function screenMarkup(source) {
  return source.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
}

test("student profile changes are scoped to the signed-in student", () => {
  assert.match(serverSource, /router\.patch\("\/student\/profile"/);
  assert.match(serverSource, /WHERE user_id = \$1/);
  assert.match(serverSource, /birthday_visible = \$3/);
});

test("the site has no student password login path -- Google account access only", () => {
  assert.doesNotMatch(serverSource, /router\.patch\("\/student\/password"/);
  assert.doesNotMatch(serverSource, /verifyStudentPassword/);
  assert.doesNotMatch(serverSource, /hashStudentPassword/);
});

test("student profile screen keeps the birthday sharing choice concise, with no password fields", () => {
  assert.match(pageSource, /id="birthdayVisible"/);
  assert.doesNotMatch(pageSource, /불이익/);
  assert.doesNotMatch(pageSource, /id="confirmPassword"/);
  assert.doesNotMatch(pageSource, /비밀번호/);
});

test("student profile screen offers birthday as month/day dropdowns instead of a single free-text field", () => {
  assert.match(pageSource, /id="birthdayMonth"/);
  assert.match(pageSource, /id="birthdayDay"/);
  assert.doesNotMatch(pageSource, /id="birthdayMmdd"/);
  assert.match(pageSource, /function currentMmdd\(\)/);
  assert.match(pageSource, /function populateDayOptions\(/);
});

test("teacher roster cannot overwrite the student's own birthday choice, and the roster screen has no password field to overwrite either", async () => {
  const rosterSource = await readFile(new URL("../apps/classtools/roster.html", import.meta.url), "utf8");
  assert.match(rosterSource, /id="birthdates" disabled/);
  assert.doesNotMatch(rosterSource, /id="passwords"/);
  assert.doesNotMatch(screenMarkup(rosterSource), /비밀번호|<input\b[^>]*type=["']password["']/i);
  assert.match(serverSource, /existingPassword\?\.birthdayMmdd \|\| null/);
  assert.doesNotMatch(serverSource, /student\.birthdayMmdd \|\| null, student\.birthdayVisible/);
});

test("teacher student deletion removes the full roster record and revokes linked access", async () => {
  const rosterSource = await readFile(new URL("../apps/classtools/roster.html", import.meta.url), "utf8");
  assert.match(serverSource, /router\.delete\("\/teacher\/class\/students\/:studentNumber"/);
  assert.match(serverSource, /DELETE FROM classroom_sessions WHERE user_id = \$1/);
  assert.match(serverSource, /UPDATE classroom_users\s+SET role = NULL/);
  assert.match(serverSource, /DELETE FROM classroom_students WHERE id = \$1/);
  assert.match(serverSource, /removedStudentsResult/);
  assert.match(rosterSource, /id="student-delete-select"/);
  assert.match(rosterSource, /계정 연결, 생일, 공개 설정가 함께 삭제/);
  assert.doesNotMatch(screenMarkup(rosterSource), /비밀번호|<input\b[^>]*type=["']password["']/i);
});
