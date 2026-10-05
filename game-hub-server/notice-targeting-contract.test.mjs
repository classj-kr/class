import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const serverSource = (await readFile(new URL("./classroom-platform.js", import.meta.url), "utf8")).replace(/\r\n/g, "\n");

// Who can see which notice is an access boundary, so this runs the real
// predicate against a real (in-memory) Postgres rather than matching the
// source text. The filter used to be a JS callback on GET /notice/list; it is
// now the SQL fragment NOTICE_TARGET_SQL shared by every notice read.
// Parameters: $1 school_id, $2 grade, $3 class_number, $4 student_number.
function noticeTargetSql() {
  const match = serverSource.match(/const NOTICE_TARGET_SQL = `([\s\S]*?)`;/);
  assert.ok(match, "NOTICE_TARGET_SQL not found");
  return match[1];
}

const viewer = { schoolId: 1, grade: 6, classNumber: 2, studentNumber: "99" };

async function visibleTitles(seed, who = viewer) {
  const { PGlite } = await import("@electric-sql/pglite");
  const db = new PGlite();
  try {
    await db.exec(`
      CREATE TABLE classroom_notices (
        id BIGSERIAL PRIMARY KEY, school_id BIGINT, title TEXT NOT NULL, target_type TEXT NOT NULL,
        target_grade INTEGER, target_class_number INTEGER, target_student_numbers TEXT
      );
      CREATE TABLE classroom_notice_recipients (
        id BIGSERIAL PRIMARY KEY, notice_id BIGINT NOT NULL REFERENCES classroom_notices(id) ON DELETE CASCADE,
        school_id BIGINT, grade INTEGER NOT NULL, class_number INTEGER NOT NULL, student_number TEXT NOT NULL
      );
    `);
    for (const notice of seed) {
      const inserted = await db.query(
        `INSERT INTO classroom_notices (school_id, title, target_type, target_grade, target_class_number, target_student_numbers)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [notice.school_id ?? null, notice.title, notice.target_type, notice.target_grade ?? null,
          notice.target_class_number ?? null, notice.target_student_numbers ?? null]
      );
      for (const [grade, classNumber, studentNumber] of notice.recipients || []) {
        await db.query(
          `INSERT INTO classroom_notice_recipients (notice_id, school_id, grade, class_number, student_number)
           VALUES ($1, $2, $3, $4, $5)`,
          [inserted.rows[0].id, notice.school_id ?? null, grade, classNumber, studentNumber]
        );
      }
    }
    const result = await db.query(
      `SELECT n.title FROM classroom_notices n WHERE ${noticeTargetSql()} ORDER BY n.id`,
      [who.schoolId, who.grade, who.classNumber, who.studentNumber]
    );
    return result.rows.map((row) => row.title);
  } finally {
    await db.close();
  }
}

test("a notice targeted at a specific roster of students is hidden from a student not on that list", async () => {
  assert.deepEqual(await visibleTitles([
    { title: "picked others", school_id: 1, target_type: "students", recipients: [[6, 2, "3"], [6, 2, "4"], [6, 2, "5"]] },
    // Same student number in another class of the same school must not match.
    { title: "picked 99 in another class", school_id: 1, target_type: "students", recipients: [[6, 3, "99"]] },
    // Rows written before the recipients table existed carry the list as text.
    { title: "legacy list without me", school_id: 1, target_type: "students", target_grade: 6, target_class_number: 2, target_student_numbers: "3,4,5" },
    { title: "legacy list in another class", school_id: 1, target_type: "students", target_grade: 6, target_class_number: 3, target_student_numbers: "99" },
  ]), []);
});

test("a notice targeted at a different class is hidden even when the school matches", async () => {
  assert.deepEqual(await visibleTitles([
    { title: "1-1", school_id: 1, target_type: "class", target_grade: 1, target_class_number: 1 },
    { title: "6-3", school_id: 1, target_type: "class", target_grade: 6, target_class_number: 3 },
  ]), []);
});

test("a notice from a different school is hidden entirely", async () => {
  assert.deepEqual(await visibleTitles([
    { title: "other school, everyone", school_id: 2, target_type: "all" },
    { title: "other school, my grade", school_id: 2, target_type: "grade", target_grade: 6 },
    { title: "other school, my class", school_id: 2, target_type: "class", target_grade: 6, target_class_number: 2 },
    { title: "other school, my number", school_id: 2, target_type: "students", recipients: [[6, 2, "99"]] },
  ]), []);
});

test("a notice targeted at a different grade is hidden", async () => {
  assert.deepEqual(await visibleTitles([
    { title: "grade 5", school_id: 1, target_type: "grade", target_grade: 5 },
  ]), []);
});

test("whole-school, matching-grade, matching-class, and correctly-listed-student notices remain visible", async () => {
  assert.deepEqual(await visibleTitles([
    { title: "everyone", school_id: 1, target_type: "all" },
    { title: "grade 6", school_id: 1, target_type: "grade", target_grade: 6 },
    { title: "6-2", school_id: 1, target_type: "class", target_grade: 6, target_class_number: 2 },
    { title: "picked me", school_id: 1, target_type: "students", recipients: [[6, 2, "3"], [6, 2, "99"]] },
    { title: "legacy list with me", school_id: 1, target_type: "students", target_grade: 6, target_class_number: 2, target_student_numbers: "3, 99" },
  ]), ["everyone", "grade 6", "6-2", "picked me", "legacy list with me"]);
});

test("every route that reads notices for a viewer goes through the shared targeting predicate", () => {
  const start = serverSource.indexOf('router.get("/notice/list"');
  assert.ok(start !== -1, "GET /notice/list not found");
  const end = serverSource.indexOf("\n  }));", start);
  const body = serverSource.slice(start, end);
  assert.match(body, /WHERE \$\{NOTICE_TARGET_SQL\}/);
  assert.match(body, /\[target\.schoolId, target\.grade, target\.classNumber, target\.studentNumber\]/);
  // The viewer's school/grade/class/number come from the signed-in account's
  // roster entry, never from what the client sends.
  assert.match(body, /const targets = await noticeViewerTargets\(user\);/);
  assert.match(body, /if \(!target\) return res\.json\(\{ notices: \[\], children: \[\] \}\);/);
  // Reply, survey and push lookups reuse the same predicate instead of re-deriving it.
  assert.ok(serverSource.split("${NOTICE_TARGET_SQL}").length - 1 >= 4, "NOTICE_TARGET_SQL should guard every notice read");
});
