import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const serverSource = await readFile(new URL("./classroom-platform.js", import.meta.url), "utf8");
const dashboardSource = await readFile(new URL("../classtools/dashboard.html", import.meta.url), "utf8");
// The schoolwide attendance board used to be a tab inside schooladmin/app.js;
// it now lives in its own page, linked from classtools/index.html.
const attendanceDashboardSource = await readFile(new URL("../classtools/attendance-dashboard.html", import.meta.url), "utf8");
const noticeIndexSource = await readFile(new URL("../notice/index.html", import.meta.url), "utf8");

function handlerBody(source, routeSignature) {
  const start = source.indexOf(routeSignature);
  assert.ok(start !== -1, `Route not found: ${routeSignature}`);
  const end = source.indexOf("\n  }));", start);
  assert.ok(end !== -1, `Route handler close not found for: ${routeSignature}`);
  return source.slice(start, end);
}

test("teacher notice inboxes resolve the class from classroom_teachers directly, not from classroom_classes", () => {
  const routes = [
    `router.get("/teacher/quick-absences"`,
    `router.get("/teacher/absence-notes"`,
    `router.get("/teacher/experiential-apps"`,
  ];
  for (const route of routes) {
    const body = handlerBody(serverSource, route);
    assert.doesNotMatch(body, /classroom_classes/, `${route} should not depend on classroom_classes`);
    assert.match(body, /classroom_teachers/, `${route} should resolve directly from classroom_teachers`);
  }
});

test("GET /school-admin/dashboard counts approved experiential learning applications alongside absence notices", () => {
  const body = handlerBody(serverSource, `router.get("/school-admin/dashboard"`);
  assert.match(body, /FROM classroom_experiential_apps/);
  assert.match(body, /'결석', '체험학습'/);
});

test("the schoolwide attendance dashboard page folds experiential learning applications into the absence count", () => {
  assert.match(attendanceDashboardSource, /renderDashboard\(res\.students \|\| \[\], res\.events \|\| \[\]\)/);
  assert.match(attendanceDashboardSource, /const KIND_LIST = \{ "결석": "absent", "지각": "tardy", "조퇴": "early" \};/);
});

// 화면의 셈 함수를 그대로 떼어 돌린다.
function pageBuildBoard() {
  const start = attendanceDashboardSource.indexOf("const KIND_LIST");
  const end = attendanceDashboardSource.indexOf("function listOf(");
  assert.ok(start !== -1 && end > start, "buildBoard block not found");
  return new Function(`${attendanceDashboardSource.slice(start, end)}; return buildBoard;`)();
}

test("the schoolwide board counts each student once, keeps every source, and names who is present", () => {
  const buildBoard = pageBuildBoard();
  const students = [
    { grade: 6, classNumber: 2, number: "1", name: "가학생" },
    { grade: 6, classNumber: 2, number: "2", name: "나학생" },
    { grade: 6, classNumber: 2, number: "3", name: "다학생" },
  ];
  const events = [
    { grade: 6, classNumber: 2, number: "2", name: "나학생(알림)", kind: "결석", source: "출결 알림" },
    { grade: 6, classNumber: 2, number: "2", name: "나학생", kind: "결석", source: "결석계" },
    { grade: 6, classNumber: 2, number: "3", name: "다학생", kind: "지각", source: "결석계" },
    { grade: 6, classNumber: 4, number: "9", name: "명단밖", kind: "조퇴", source: "출결 알림" },
  ];
  const { classes, byKey } = buildBoard(students, events);
  const c = byKey.get("6-2");
  assert.equal(c.total.length, 3);
  assert.deepEqual(c.absent.map((s) => [s.number, s.name, s.sources]), [["2", "나학생", ["출결 알림", "결석계"]]]);
  assert.deepEqual(c.present.map((s) => s.number), ["1", "3"]);
  assert.deepEqual(c.tardy.map((s) => s.number), ["3"]);
  // 명단에 없는 학생의 알림도 버리지 않는다.
  assert.deepEqual(classes.map((x) => x.key), ["6-2", "6-4"]);
  assert.deepEqual(byKey.get("6-4").early.map((s) => s.name), ["명단밖"]);
});

test("GET /school-admin/dashboard lists this year's students once and each attendance record without reasons", async () => {
  const { PGlite } = await import("@electric-sql/pglite");
  const db = new PGlite();
  try {
    await db.exec(`
      CREATE TABLE school_students (school_id INTEGER, academic_year INTEGER, grade INTEGER, class_number INTEGER, student_number TEXT, roster_name TEXT);
      CREATE TABLE classroom_classes (id INTEGER, school_id INTEGER, academic_year INTEGER, grade INTEGER, class_number INTEGER);
      CREATE TABLE classroom_students (class_id INTEGER, student_number TEXT, roster_name TEXT);
      CREATE TABLE classroom_absence_notices (school_id INTEGER, grade INTEGER, class_number INTEGER, student_number TEXT, student_name TEXT, notice_type TEXT, expected_date DATE, reason TEXT);
      CREATE TABLE classroom_absence_notes (school_id INTEGER, grade INTEGER, class_number INTEGER, student_number TEXT, student_name TEXT, reason_type TEXT, reason_detail TEXT, status TEXT, start_date DATE, end_date DATE);
      CREATE TABLE classroom_experiential_apps (school_id INTEGER, grade INTEGER, class_number INTEGER, student_number TEXT, student_name TEXT, plan_detail TEXT, status TEXT, start_date DATE, end_date DATE);
      INSERT INTO school_students VALUES
        (1,2025,5,2,'1','작년학생'),
        (1,2026,6,2,'10','라학생'),(1,2026,6,2,'2','나학생'),(1,2026,6,2,'1','가학생'),
        (1,2026,6,3,'1','마학생'),
        (2,2026,6,2,'1','남의학교');
      INSERT INTO classroom_classes VALUES (11,1,2026,6,3),(12,1,2025,6,3);
      INSERT INTO classroom_students VALUES (11,'1','마학생(옛명단)'),(11,'2','바학생'),(12,'5','작년옛명단');
      INSERT INTO classroom_absence_notices VALUES
        (1,6,2,'2','나학생','결석','2026-09-28','감기'),
        (1,6,2,'1','가학생','결석','2026-09-27','지난날'),
        (1,6,2,'10','라학생','기타','2026-09-28','모름'),
        (2,6,2,'1','남의학교','결석','2026-09-28','남의학교');
      INSERT INTO classroom_absence_notes VALUES
        (1,6,2,'2','나학생','질병결석','병원','approved','2026-09-27','2026-09-29'),
        (1,6,2,'10','라학생','질병지각','병원','approved','2026-09-28','2026-09-28'),
        (1,6,2,'1','가학생','질병결석','병원','pending','2026-09-28','2026-09-28');
      INSERT INTO classroom_experiential_apps VALUES
        (1,6,3,'1','마학생','가족여행','approved','2026-09-28','2026-09-30'),
        (1,6,3,'2','바학생','가족여행','pending','2026-09-28','2026-09-30');
    `);
    const body = handlerBody(serverSource, 'router.get("/school-admin/dashboard"');
    const fn = new (Object.getPrototypeOf(async function(){}).constructor)(
      "req", "res", "requireSchoolAdmin", "pool", "HttpError", body.slice(body.indexOf("=> {") + 4)
    );
    class HttpError extends Error { constructor(status, code) { super(code); this.status = status; } }
    async function run(date) {
      let payload;
      await fn({ query: { date } }, { set() {}, json(value) { payload = value; } },
        async () => ({ profile: { school_id: 1 } }), db, HttpError);
      return payload;
    }

    const data = await run("2026-09-28");
    assert.deepEqual(data.students.map((s) => `${s.grade}-${s.classNumber}-${s.number} ${s.name}`), [
      "6-2-1 가학생", "6-2-2 나학생", "6-2-10 라학생",
      "6-3-1 마학생", "6-3-2 바학생",
    ]);
    assert.deepEqual(data.events.map((e) => `${e.grade}-${e.classNumber}-${e.number} ${e.kind} ${e.source}`), [
      "6-2-2 결석 결석계", "6-2-2 결석 출결 알림",
      "6-2-10 지각 결석계",
      "6-3-1 결석 체험학습",
    ]);
    for (const e of data.events) assert.deepEqual(Object.keys(e).sort(), ["classNumber", "grade", "kind", "name", "number", "source"]);

    // 새 학년도 명단을 아직 안 만들었으면 앞 해의 명단을 쓴다.
    assert.equal((await run("2027-03-02")).students.length, 5);
    await assert.rejects(run("2026-9-28"), { status: 400 });
    await assert.rejects(run("'; DROP TABLE x; --"), { status: 400 });
  } finally { await db.close(); }
});

test("the schoolwide attendance dashboard page calls the API with a relative path, not a hardcoded host", () => {
  assert.doesNotMatch(attendanceDashboardSource, /onrender\.com|localhost:\d+/);
  assert.match(attendanceDashboardSource, /fetch\(path,/);
});

test("the dashboard fetches today's attendance for the selected class", () => {
  assert.ok(dashboardSource.includes("/api/teacher/class-attendance?classId="));
  const body = handlerBody(serverSource, 'router.get("/teacher/class-attendance"');
  assert.match(body, /classroom_absence_notices/);
  assert.match(body, /classroom_absence_notes/);
  assert.match(body, /classroom_experiential_apps/);
  assert.match(body, /status = 'approved'/);
});

test("the parent-facing same-day attendance notice (출결 예고) covers all three notice types, and neither dashboard filters any of them out", () => {
  const formBody = noticeIndexSource.slice(
    noticeIndexSource.indexOf('id="tab-quick-absence"'),
    noticeIndexSource.indexOf('id="tab-absence-note"')
  );
  for (const type of ["지각", "결석", "조퇴"]) {
    assert.match(formBody, new RegExp(`<option value="${type}">${type}</option>`));
  }

  const body = handlerBody(serverSource, 'router.get("/teacher/class-attendance"');
  for (const type of ["결석", "지각", "조퇴"]) assert.ok(body.includes("'" + type + "'"));

  // The schoolwide attendance dashboard must bucket all three notice types, not just 결석.
  const schoolBody = handlerBody(serverSource, 'router.get("/school-admin/dashboard"');
  assert.match(schoolBody, /notice_type IN \('결석', '지각', '조퇴'\)/);
  for (const type of ["결석", "지각", "조퇴"]) {
    assert.match(attendanceDashboardSource, new RegExp(`"${type}": "`));
  }
});


test("today's class attendance is school-scoped, date-filtered, complete, and contains no private reasons", async () => {
  const { PGlite } = await import("@electric-sql/pglite");
  const db = new PGlite();
  try {
    await db.exec(`
      CREATE TABLE classroom_schools (id INTEGER, enabled BOOLEAN);
      CREATE TABLE classroom_teachers (school_id INTEGER, user_id INTEGER, active BOOLEAN);
      CREATE TABLE classroom_classes (id INTEGER, school_id INTEGER, grade INTEGER, class_number INTEGER);
      CREATE TABLE classroom_absence_notices (school_id INTEGER, grade INTEGER, class_number INTEGER, student_number INTEGER, notice_type TEXT, expected_date DATE);
      CREATE TABLE classroom_absence_notes (school_id INTEGER, grade INTEGER, class_number INTEGER, student_number INTEGER, reason_type TEXT, status TEXT, start_date DATE, end_date DATE);
      CREATE TABLE classroom_experiential_apps (school_id INTEGER, grade INTEGER, class_number INTEGER, student_number INTEGER, status TEXT, start_date DATE, end_date DATE);
      INSERT INTO classroom_schools VALUES (1,TRUE),(2,TRUE);
      INSERT INTO classroom_teachers VALUES (1,10,TRUE),(2,20,TRUE),(1,30,FALSE);
      INSERT INTO classroom_classes VALUES (11,1,6,2),(12,1,6,3),(21,2,6,2);
      INSERT INTO classroom_absence_notices
        SELECT 1,6,2,n,'결석',(NOW() AT TIME ZONE 'Asia/Seoul')::DATE FROM generate_series(1,105) n;
      INSERT INTO classroom_absence_notices VALUES
        (1,6,2,106,'지각',(NOW() AT TIME ZONE 'Asia/Seoul')::DATE),
        (1,6,2,106,'조퇴',(NOW() AT TIME ZONE 'Asia/Seoul')::DATE),
        (1,6,2,107,'결석',(NOW() AT TIME ZONE 'Asia/Seoul')::DATE - 1),
        (1,6,3,108,'결석',(NOW() AT TIME ZONE 'Asia/Seoul')::DATE),
        (2,6,2,109,'결석',(NOW() AT TIME ZONE 'Asia/Seoul')::DATE);
      INSERT INTO classroom_absence_notes VALUES
        (1,6,2,110,'질병결석','approved',(NOW() AT TIME ZONE 'Asia/Seoul')::DATE,(NOW() AT TIME ZONE 'Asia/Seoul')::DATE),
        (1,6,2,111,'질병결석','pending',(NOW() AT TIME ZONE 'Asia/Seoul')::DATE,(NOW() AT TIME ZONE 'Asia/Seoul')::DATE);
      INSERT INTO classroom_experiential_apps VALUES
        (1,6,2,112,'approved',(NOW() AT TIME ZONE 'Asia/Seoul')::DATE,(NOW() AT TIME ZONE 'Asia/Seoul')::DATE);
    `);
    const body = handlerBody(serverSource, 'router.get("/teacher/class-attendance"');
    const fn = new (Object.getPrototypeOf(async function(){}).constructor)(
      "req", "res", "requireTeacher", "pool", "HttpError", body.slice(body.indexOf("=> {") + 4)
    );
    class HttpError extends Error { constructor(status, code) { super(code); this.status = status; } }
    async function run(classId, userId = 10) {
      let payload;
      await fn({query:{classId}}, {set(){},json(value){payload=value;}},
        async () => ({id:userId}), db, HttpError);
      return payload;
    }
    const data = await run(11);
    assert.equal(data.alerts.length, 109, "today's records must not be truncated to 100 inbox items");
    assert.deepEqual(data.alerts.filter(a => a.studentNumber === "106").map(a => a.noticeType).sort(), ["조퇴","지각"]);
    assert.ok(data.alerts.some(a => a.studentNumber === "110" && a.noticeType === "결석"));
    assert.ok(data.alerts.some(a => a.studentNumber === "112" && a.noticeType === "체험학습"));
    for (const number of ["107","108","109","111"]) assert.ok(!data.alerts.some(a => a.studentNumber === number));
    for (const row of data.alerts) assert.deepEqual(Object.keys(row).sort(), ["noticeType","source","studentNumber"]);
    assert.deepEqual((await run(12)).alerts.map(a => a.studentNumber), ["108"]);
    await assert.rejects(run(21), {status:403});
    await assert.rejects(run(11,30), {status:403});
    await assert.rejects(run("invalid"), {status:400});
  } finally { await db.close(); }
});
