import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { createRequire } from "node:module";

// 명단의 성명을 비워 두고 구글 계정만 적은 사람: 첫 로그인 때 구글 계정 이름이 들어온다.
// 저장 라우트 본문을 그대로 떼어 PGlite 위에서 돌리므로, 자리표시 이름이 실명으로
// 굳거나 구글에서 온 표시가 사라지는 회귀는 여기서 드러난다.

const require = createRequire(import.meta.url);
const { parseTeachingScope } = require("./teaching-scope.js");
const {
  NAME_SOURCE_PENDING, NAME_SOURCE_GOOGLE,
  pendingStudentName, pendingTeacherName, googleRosterName, fillPendingNamesFromGoogle, namesLookDifferent
} = require("./roster-names.js");

const source = await readFile(new URL("./classroom-platform.js", import.meta.url), "utf8");
const schoolRosterHtml = await readFile(new URL("../classtools/school-roster.html", import.meta.url), "utf8");
const classRosterHtml = await readFile(new URL("../classtools/roster.html", import.meta.url), "utf8");
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

function routeBody(signature) {
  const start = source.indexOf(signature);
  assert.ok(start !== -1, `Route not found: ${signature}`);
  return source.slice(source.indexOf("=> {", start) + 4, source.indexOf("\n  }));", start));
}
function handlerBody(signature) {
  const start = source.indexOf(signature);
  assert.ok(start !== -1, `Route not found: ${signature}`);
  return source.slice(start, source.indexOf("\n  }));", start));
}

class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

const saveStudents = new AsyncFunction(
  "req", "res", "requireTeacher", "teacherRegistration", "HttpError", "pool",
  "avatarCapacity", "pickRandomAvailableAvatar", "pendingStudentName", "NAME_SOURCE_PENDING",
  routeBody('router.put("/school/students"')
);
const saveTeachers = new AsyncFunction(
  "req", "res", "requireTeacher", "teacherRegistration", "HttpError", "normalizeEmail", "pool", "parseTeachingScope",
  "pendingTeacherName", "NAME_SOURCE_PENDING", "NAME_SOURCE_GOOGLE",
  routeBody('router.put("/school/teachers"')
);

// 운영 스키마의 고유 조건을 그대로 옮긴다(classroom-platform.js 의 CREATE 문).
const SCHEMA = `
  CREATE TABLE classroom_schools (id BIGSERIAL PRIMARY KEY, name TEXT, enabled BOOLEAN NOT NULL DEFAULT TRUE);
  CREATE TABLE classroom_users (id BIGSERIAL PRIMARY KEY, email TEXT, display_name TEXT);
  CREATE TABLE school_students (
    id BIGSERIAL PRIMARY KEY,
    school_id BIGINT NOT NULL, academic_year INTEGER NOT NULL,
    grade INTEGER NOT NULL, class_number INTEGER NOT NULL, student_number TEXT NOT NULL,
    roster_name TEXT NOT NULL, gender TEXT NOT NULL DEFAULT '남',
    student_email TEXT, guardian1_email TEXT, guardian2_email TEXT,
    user_id BIGINT UNIQUE, custom_fields JSONB NOT NULL DEFAULT '{}'::jsonb, avatar_key TEXT, name_source TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (school_id, academic_year, grade, class_number, student_number)
  );
  CREATE TABLE classroom_students (
    id BIGSERIAL PRIMARY KEY, class_id BIGINT NOT NULL, student_number TEXT NOT NULL,
    roster_name TEXT NOT NULL, student_email TEXT, name_source TEXT,
    roster_active BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (class_id, student_number)
  );
  CREATE TABLE classroom_teachers (
    id BIGSERIAL PRIMARY KEY, school_id BIGINT NOT NULL, teacher_name TEXT NOT NULL,
    google_email TEXT, user_id BIGINT UNIQUE, active BOOLEAN NOT NULL DEFAULT TRUE,
    teacher_type TEXT NOT NULL DEFAULT 'homeroom', academic_year INTEGER, grade INTEGER, class_number INTEGER,
    subject_name TEXT, room_name TEXT, teaching_scope JSONB, name_source TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (school_id, teacher_name)
  );
  CREATE UNIQUE INDEX classroom_teachers_class_assignment_idx
    ON classroom_teachers (school_id, academic_year, grade, class_number)
    WHERE academic_year IS NOT NULL AND grade IS NOT NULL AND class_number IS NOT NULL;
  CREATE TABLE classroom_classes (
    id BIGSERIAL PRIMARY KEY, school_id BIGINT, teacher_user_id BIGINT, academic_year INTEGER,
    grade INTEGER, class_number INTEGER, teacher_name TEXT, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`;

async function withDb(run) {
  const db = new PGlite();
  try {
    await db.exec(SCHEMA);
    await db.exec(`
      INSERT INTO classroom_schools (name) VALUES ('시험학교');
      INSERT INTO classroom_teachers (school_id, teacher_name, google_email, user_id, teacher_type)
        VALUES (1, '학교 관리자', 'admin@school.test', 1, '관리자');
    `);
    const query = async (text, params) => {
      const result = await db.query(text, params);
      return { rows: result.rows, rowCount: result.rows.length || result.affectedRows || 0 };
    };
    const pool = { query, connect: async () => ({ query, release() {} }) };
    const students = async () => (await db.query(
      "SELECT grade, class_number, student_number, roster_name, name_source, student_email FROM school_students ORDER BY grade, class_number, student_number"
    )).rows;
    const teachers = async () => (await db.query(
      "SELECT teacher_name, name_source, google_email, teacher_type FROM classroom_teachers ORDER BY id"
    )).rows;
    await run({ db, pool, students, teachers });
  } finally {
    await db.close();
  }
}

const res = () => ({ json(value) { this.body = value; } });
const asAdmin = [async () => ({ id: 1 }), async () => ({ school_id: 1, teacher_type: "관리자" })];

async function putStudents(pool, list) {
  const r = res();
  await saveStudents(
    { body: { students: list, year: 2026 } }, r, ...asAdmin, HttpError, pool,
    () => 10, () => "animal-cat.webp", pendingStudentName, NAME_SOURCE_PENDING
  );
  return r.body;
}
async function putTeachers(pool, list) {
  const r = res();
  await saveTeachers(
    { body: { teachers: list, year: 2026 } }, r, ...asAdmin, HttpError, normalizeEmail, pool, parseTeachingScope,
    pendingTeacherName, NAME_SOURCE_PENDING, NAME_SOURCE_GOOGLE
  );
  return r.body;
}
const student = (number, rosterName, studentEmail, extra = {}) =>
  ({ grade: 3, classNumber: 1, studentNumber: number, rosterName, gender: "남", studentEmail, ...extra });
const teacherRow = (name, email, grade = null, classNumber = null) =>
  ({ type: grade && classNumber ? "담임" : "전담", name, email, grade, classNumber, subjectName: grade && classNumber ? null : "음악", roomName: null });
const adminRow = () => teacherRow("학교 관리자", "admin@school.test");

// ─── 구글 프로필에서 이름 고르기 ──────────────────────────────────────────

test("googleRosterName joins Korean family and given names in Korean order, whatever order Google put in `name`", () => {
  assert.equal(googleRosterName({ name: "길동 홍", given_name: "길동", family_name: "홍" }), "홍길동");
  assert.equal(googleRosterName({ name: "홍 길동", given_name: "길동", family_name: "홍" }), "홍길동");
});

test("googleRosterName removes spaces from an all-Korean name and keeps other names as Google sent them", () => {
  assert.equal(googleRosterName({ name: "홍 길동" }), "홍길동");
  assert.equal(googleRosterName({ name: "Gildong  Hong", given_name: "Gildong", family_name: "Hong" }), "Gildong Hong");
  assert.equal(googleRosterName({ name: "3101 홍길동" }), "3101 홍길동");
  assert.equal(googleRosterName({ given_name: "Gildong", family_name: "Hong" }), "Gildong Hong");
});

test("googleRosterName gives an empty string when Google sent no name, strips control characters, and caps the length", () => {
  assert.equal(googleRosterName({}), "");
  assert.equal(googleRosterName(null), "");
  assert.equal(googleRosterName({ name: "홍길동\u0000​" }), "홍길동");
  assert.equal(googleRosterName({ name: "가".repeat(40) }).length, 30);
});

test("placeholder names: a student shows the account's local part, a teacher the whole account (unique per school)", () => {
  assert.equal(pendingStudentName("S3101@School.es.kr"), "s3101");
  assert.equal(pendingStudentName(""), "로그인대기");
  assert.equal(pendingTeacherName("Hong@School.es.kr"), "hong@school.es.kr");
});

test("namesLookDifferent flags a linked account whose Google name looks like another person, but not decorated or reordered forms of the same name", () => {
  for (const same of ["홍길동", "홍 길동", "길동 홍", "3101홍길동", "홍길동(6-3)", "6학년 3반 홍길동"]) {
    assert.equal(namesLookDifferent("홍길동", same), false, same);
  }
  assert.equal(namesLookDifferent("Gildong Hong", "gildong hong"), false);
  assert.equal(namesLookDifferent("홍길동", "김철수"), true);
  assert.equal(namesLookDifferent("홍길동", "Hong Gildong"), true, "로마자 이름은 사람이 확인하도록 표시한다");
  assert.equal(namesLookDifferent("홍길동", ""), false, "연동되지 않은 줄은 비교하지 않는다");
  assert.equal(namesLookDifferent("", "홍길동"), false);
});

// ─── 전교생 명단 저장 + 첫 로그인 ────────────────────────────────────────

test("PUT /school/students takes either a name or a Google account per row: name-only rows (no devices) save as before, account-only rows wait for sign-in", async () => {
  await withDb(async ({ pool, students }) => {
    const body = await putStudents(pool, [
      student("1", "", "S3101@school.test"),
      student("2", "김철수", "s3102@school.test"),
      student("3", "이영희", ""),
      student("", "번호없음", ""),
    ]);
    assert.equal(body.saved, 3, "a row without a number is still dropped");
    assert.deepEqual((await students()).map((r) => [r.student_number, r.roster_name, r.name_source, r.student_email]), [
      ["1", "s3101", "pending", "s3101@school.test"],
      ["2", "김철수", null, "s3102@school.test"],
      ["3", "이영희", null, null],
    ]);
  });
});

test("PUT /school/students refuses a row that has a class and number but neither a name nor a Google account", async () => {
  await withDb(async ({ pool, students }) => {
    await assert.rejects(
      () => putStudents(pool, [student("1", "김철수", ""), student("2", "", "")]),
      (error) => error.code === "STUDENT_NAME_OR_EMAIL_REQUIRED" && /3학년 1반 2번/.test(error.message)
    );
    assert.equal((await students()).length, 0, "nothing is saved when one row is refused");
  });
});

test("first sign-in fills a pending student row (in both roster tables) with the Google name, and never touches it again", async () => {
  await withDb(async ({ db, pool, students }) => {
    await putStudents(pool, [student("1", "", "s3101@school.test"), student("2", "김철수", "s3102@school.test")]);
    await db.exec(`INSERT INTO classroom_students (class_id, student_number, roster_name, student_email, name_source)
                   VALUES (10, '1', 's3101', 's3101@school.test', 'pending'), (10, '2', '김철수', 's3102@school.test', NULL)`);

    const filled = await fillPendingNamesFromGoogle(pool, {
      email: "S3101@school.test", payload: { name: "길동 홍", given_name: "길동", family_name: "홍" }, isStudent: true, isTeacher: false
    });
    assert.deepEqual(filled, { student: 2, teacher: 0, name: "홍길동" });
    assert.deepEqual((await students()).map((r) => [r.roster_name, r.name_source]), [["홍길동", "google"], ["김철수", null]]);
    const classRows = (await db.query("SELECT roster_name, name_source FROM classroom_students ORDER BY student_number")).rows;
    assert.deepEqual(classRows, [{ roster_name: "홍길동", name_source: "google" }, { roster_name: "김철수", name_source: null }]);

    // 두 번째 로그인에서 구글 이름이 바뀌어도 명단은 그대로다.
    const again = await fillPendingNamesFromGoogle(pool, { email: "s3101@school.test", payload: { name: "다른이름" }, isStudent: true, isTeacher: false });
    assert.equal(again.student, 0);
    assert.equal((await students())[0].roster_name, "홍길동");

    // 로그인한 학생의 구글 프로필에 이름이 없으면 자리표시를 그대로 두고 기다린다.
    await putStudents(pool, [student("1", "", "s3101@school.test"), student("2", "김철수", "s3102@school.test")]);
    const noName = await fillPendingNamesFromGoogle(pool, { email: "s3101@school.test", payload: {}, isStudent: true, isTeacher: false });
    assert.equal(noName.student, 0);
    assert.deepEqual((await students())[0], { grade: 3, class_number: 1, student_number: "1", roster_name: "s3101", name_source: "pending", student_email: "s3101@school.test" });
  });
});

test("re-saving the roster keeps the 'from Google' mark while the name is unchanged, clears it when the admin edits, and goes back to pending when cleared", async () => {
  await withDb(async ({ pool, students }) => {
    await putStudents(pool, [student("1", "", "s3101@school.test")]);
    await fillPendingNamesFromGoogle(pool, { email: "s3101@school.test", payload: { name: "홍길동" }, isStudent: true, isTeacher: false });

    await putStudents(pool, [student("1", "홍길동", "s3101@school.test")]);
    assert.deepEqual((await students()).map((r) => [r.roster_name, r.name_source]), [["홍길동", "google"]]);

    await putStudents(pool, [student("1", "홍길순", "s3101@school.test")]);
    assert.deepEqual((await students()).map((r) => [r.roster_name, r.name_source]), [["홍길순", null]]);

    await putStudents(pool, [student("1", "", "s3101@school.test")]);
    assert.deepEqual((await students()).map((r) => [r.roster_name, r.name_source]), [["s3101", "pending"]]);
  });
});

test("PUT /school/students refuses the same student Google account on two rows (case-insensitively), since one account can link to only one row", async () => {
  await withDb(async ({ pool, students }) => {
    await assert.rejects(
      () => putStudents(pool, [student("1", "김철수", "S3101@school.test"), student("2", "이영희", "s3101@school.test")]),
      (error) => error.code === "DUPLICATE_STUDENT_EMAIL" && /3학년 1반 1번, 3학년 1반 2번/.test(error.message)
    );
    assert.equal((await students()).length, 0, "nothing is saved when one row is refused");

    // 보호자 계정은 형제자매가 같이 쓰므로 겹쳐도 된다.
    const body = await putStudents(pool, [
      student("1", "김철수", "s3101@school.test", { guardian1Email: "parent@home.test" }),
      student("2", "김영희", "s3102@school.test", { guardian1Email: "parent@home.test" }),
    ]);
    assert.equal(body.saved, 2);
  });
});

// ─── 교직원 명단 저장 + 첫 로그인 ────────────────────────────────────────

test("PUT /school/teachers accepts a blank name with a Google account (placeholder = the account) and still drops a row with neither", async () => {
  await withDb(async ({ pool, teachers }) => {
    const body = await putTeachers(pool, [adminRow(), teacherRow("", "New@school.test", 3, 1), teacherRow("김교사", ""), teacherRow("", "", 3, 2)]);
    assert.equal(body.saved, 3);
    assert.deepEqual((await teachers()).map((t) => [t.teacher_name, t.name_source, t.google_email]), [
      ["학교 관리자", null, "admin@school.test"],
      ["new@school.test", "pending", "new@school.test"],
      ["김교사", null, null],
    ]);
  });
});

test("first sign-in fills a pending teacher row with the Google name; a re-save keeps the mark until the admin edits the name", async () => {
  await withDb(async ({ pool, teachers }) => {
    await putTeachers(pool, [adminRow(), teacherRow("", "new@school.test", 3, 1)]);
    const filled = await fillPendingNamesFromGoogle(pool, { email: "new@school.test", payload: { given_name: "영희", family_name: "이" }, isStudent: false, isTeacher: true });
    assert.equal(filled.teacher, 1);
    assert.deepEqual((await teachers())[1], { teacher_name: "이영희", name_source: "google", google_email: "new@school.test", teacher_type: "담임" });

    // 명단 화면은 채워진 이름을 그대로 돌려보낸다. 같은 이름이면 구글 표시를 지킨다.
    await putTeachers(pool, [adminRow(), teacherRow("이영희", "new@school.test", 3, 1)]);
    assert.deepEqual((await teachers()).slice(1).map((t) => [t.teacher_name, t.name_source]), [["이영희", "google"]]);

    await putTeachers(pool, [adminRow(), teacherRow("이영자", "new@school.test", 3, 1)]);
    assert.deepEqual((await teachers()).slice(1).map((t) => [t.teacher_name, t.name_source]), [["이영자", null]]);

    // 성명을 다시 비우면 자리표시로 돌아가 다음 로그인을 기다린다. 같은 줄이 지워지고 새로 생기지 않는다.
    await putTeachers(pool, [adminRow(), teacherRow("", "new@school.test", 3, 1)]);
    const rows = await teachers();
    assert.equal(rows.length, 2);
    assert.deepEqual([rows[1].teacher_name, rows[1].name_source], ["new@school.test", "pending"]);
  });
});

test("a Google name that collides with another teacher in the school leaves the placeholder in place instead of breaking sign-in", async () => {
  await withDb(async ({ pool, teachers }) => {
    await putTeachers(pool, [adminRow(), teacherRow("이영희", "lee@school.test", 3, 1), teacherRow("", "dup@school.test", 3, 2)]);
    const filled = await fillPendingNamesFromGoogle(pool, { email: "dup@school.test", payload: { name: "이영희" }, isStudent: false, isTeacher: true });
    assert.equal(filled.teacher, 0);
    assert.deepEqual((await teachers())[2], { teacher_name: "dup@school.test", name_source: "pending", google_email: "dup@school.test", teacher_type: "담임" });
  });
});

// ─── 소스 계약: 로그인·조회 라우트와 두 명단 화면 ───────────────────────────

test("every roster table gained name_source, and Google sign-in fills pending names after linking the account", () => {
  assert.equal((source.match(/ADD COLUMN IF NOT EXISTS name_source TEXT/g) || []).length, 3);
  const login = handlerBody('router.post("/auth/google"');
  const link = login.indexOf("UPDATE classroom_students SET user_id = $1");
  const fill = login.indexOf("await fillPendingNamesFromGoogle(pool, { email, payload, isStudent, isTeacher })");
  assert.ok(link !== -1 && fill > link, "pending names are filled after the roster rows are linked to the account");
});

test("the homeroom class roster route accepts a blank name only with a Google account and stores the placeholder as pending", () => {
  const body = handlerBody('router.put("/teacher/class"');
  assert.match(body, /DUPLICATE_STUDENT_EMAIL/);
  assert.match(body, /student\.name \? !\/\^\[가-힣\]\{2,6\}\$\/\.test\(student\.name\) : !student\.studentEmail/);
  assert.match(body, /const rosterName = student\.name \|\| pendingStudentName\(student\.studentEmail\)/);
  assert.match(body, /classroom_students\.name_source = 'google'/);
});

test("roster reads expose name_source so the editors can tell a placeholder from a real name, and compare linked Google names", () => {
  const studentsRead = handlerBody('router.get("/school/students"');
  assert.match(studentsRead, /s\.roster_name, s\.name_source,/);
  assert.match(studentsRead, /LEFT JOIN classroom_users u ON u\.id = s\.user_id/);
  assert.match(studentsRead, /name_mismatch: namesLookDifferent\(s\.roster_name, s\.google_name\)/);
  const teachersRead = handlerBody('router.get("/school/teachers"');
  assert.match(teachersRead, /nameSource: r\.name_source \|\| ""/);
  assert.match(teachersRead, /LEFT JOIN classroom_users u ON u\.id = t\.user_id/);
  assert.match(teachersRead, /nameMismatch: namesLookDifferent\(r\.teacher_name, r\.google_name\)/);
  const classRoster = handlerBody('router.get("/teacher/class"');
  assert.equal((classRoster.match(/s\.roster_name, s\.name_source,/g) || []).length, 2);
  assert.match(classRoster, /nameSource: student\.name_source \|\| ""/);
});

test("the school roster editor sends pending rows back with an empty name so the placeholder never becomes the real name", () => {
  assert.match(schoolRosterHtml, /rosterName: \(s\.name_source \|\| s\.nameSource\) === "pending" \? ""/);
  assert.match(schoolRosterHtml, /const nameless = rows\.filter\(s => !s\.rosterName && !s\.studentEmail\)/);
  assert.match(schoolRosterHtml, /const cleanName = t\.nameSource === "pending" \? ""/);
  assert.match(schoolRosterHtml, /\.filter\(t => t\.name \|\| t\.email\)/);
  // 붙여넣기: 성명 열이 없어도 학생구글계정 열이 있으면 받는다. 교직원은 계정부터 적은 줄을 받는다.
  assert.match(schoolRosterHtml, /\(nameI === -1 && seI === -1\)/);
  assert.match(schoolRosterHtml, /if \(parts\[0\]\.includes\("@"\)\) parts = \["", \.\.\.parts\]/);
  // 같은 학생구글계정이 두 줄에 있으면 저장을 막고 두 칸을 붉게 표시한다.
  assert.match(schoolRosterHtml, /const accountOwners = new Map\(\)/);
  assert.match(schoolRosterHtml, /function markDuplicateAccounts\(\)/);
  assert.match(schoolRosterHtml, /input\[data-field="student_email"\]/);
  assert.match(classRosterHtml, /duplicateEmails\.length === 0/);
  assert.match(schoolRosterHtml, /name-chip pending/);
  assert.match(schoolRosterHtml, /name-chip google/);
  // 연동된 구글 계정 이름이 적어 둔 성명과 다른 사람으로 보이면 학생·교직원 줄 모두에 표시한다.
  assert.equal((schoolRosterHtml.match(/name-chip mismatch/g) || []).length, 2);
});

test("the homeroom class roster editor shows pending names as blank lines and only accepts a blank name with a Google account", () => {
  assert.match(classRosterHtml, /student\.nameSource === "pending" \? "" : student\.name/);
  assert.match(classRosterHtml, /blankNamesWithoutAccount/);
  assert.match(classRosterHtml, /while \(names\.length < numbers\.length\) names\.push\(""\)/);
  // 성명 열의 앞쪽 빈 줄을 지우면 이름이 한 줄씩 밀린다.
  assert.match(classRosterHtml, /function splitNameLines/);
});
