import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const serverSource = await readFile(new URL("./classroom-platform.js", import.meta.url), "utf8");
const schoolRosterSource = await readFile(new URL("../apps/classtools/school-roster.html", import.meta.url), "utf8");
const schoolEventsSource = await readFile(new URL("../apps/classtools/school-events.html", import.meta.url), "utf8");

function handlerBody(source, routeSignature) {
  const start = source.indexOf(routeSignature);
  assert.ok(start !== -1, `Route not found: ${routeSignature}`);
  const end = source.indexOf("\n  }));", start);
  assert.ok(end !== -1, `Route handler close not found for: ${routeSignature}`);
  return source.slice(start, end);
}

test("GET /school/teachers returns each teacher's subject/room so the specialist-timetable picker has something to show", () => {
  const body = handlerBody(serverSource, `router.get("/school/teachers"`);
  assert.match(body, /t\.subject_name, t\.room_name,\s*t\.teaching_scope/);
  // 전담은 맡은 학년·과목 짝을 글로 되돌려 보여 주고, 짝이 없으면 적힌 과목 그대로.
  assert.match(body, /subjectName: shown \? shown\.subjectText : r\.subject_name/);
  assert.match(body, /roomName: r\.room_name/);
});

test("PUT /school/teachers persists subjectName/roomName on both the update and insert branches, admin rows included (a school admin may double as a teacher)", () => {
  const body = handlerBody(serverSource, `router.put("/school/teachers"`);
  // 담당 과목 칸은 짝(teaching_scope)으로 풀고, 과목 이름 자체도 남긴다.
  assert.match(body, /const scope = parseTeachingScope\(classNumber \? "" : gradeText, t\?\.subjectName\);/);
  assert.match(body, /subjectName: scope\.subjects\.length \? scope\.subjects\.join\(", "\)\.slice\(0, 50\) : \(t\?\.subjectName \? String\(t\.subjectName\)/);
  assert.match(body, /subject_name = \$6, room_name = \$7, academic_year = \$9, teaching_scope = \$10::jsonb/);
  assert.match(body, /t\.grade, t\.classNumber, t\.subjectName, t\.roomName, existing\.id, academicYear, JSON\.stringify\(t\.teachingScope\)/);
  assert.doesNotMatch(body, /isAdminRow \? null/);
  assert.match(body, /\(school_id, teacher_name, grade, class_number, teacher_type, google_email, subject_name, room_name, academic_year, teaching_scope, name_source\)/);
  assert.doesNotMatch(body, /OAUTH_ONLY/);
});

test("school-roster.html's teacher table lets an admin type each teacher's subject and default special room", () => {
  assert.match(schoolRosterSource, /담당 과목 \(교과\)/);
  assert.match(schoolRosterSource, /기본 특별실/);
  assert.match(schoolRosterSource, /updateTeacherField\(\$\{idx\}, 'subjectName', this\.value\)/);
  assert.match(schoolRosterSource, /updateTeacherField\(\$\{idx\}, 'roomName', this\.value\)/);
});

test("school-roster.html and school-events.html no longer call a hardcoded production host from the browser", () => {
  for (const [name, source] of [
    ["school-roster.html", schoolRosterSource],
    ["school-events.html", schoolEventsSource],
  ]) {
    assert.doesNotMatch(source, /onrender\.com|localhost:\d+/, `${name} should use relative fetch paths`);
  }
});
