import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const serverSource = await readFile(new URL("./classroom-platform.js", import.meta.url), "utf8");

function handlerBody(source, routeSignature) {
  const start = source.indexOf(routeSignature);
  assert.ok(start !== -1, `Route not found: ${routeSignature}`);
  const end = source.indexOf("\n  }));", start);
  assert.ok(end !== -1, `Route handler close not found for: ${routeSignature}`);
  return source.slice(start, end);
}

test("school_students gained the birthday and avatar columns classroom_students already had", () => {
  for (const column of [
    "avatar_key TEXT",
    "avatar_first_changed_year INTEGER",
    "avatar_second_changed_year INTEGER",
    "birthday_mmdd TEXT",
    "birthday_visible BOOLEAN NOT NULL DEFAULT FALSE",
  ]) {
    assert.match(serverSource, new RegExp(`ADD COLUMN IF NOT EXISTS ${column.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
  }
});

test("GET /student/profile resolves the student and cohort avatar usage from school_students as well as classroom_students", () => {
  const body = handlerBody(serverSource, `router.get("/student/profile"`);
  assert.match(body, /FROM school_students s/);
  assert.match(body, /FROM classroom_students s/);
  assert.match(body, /UNION ALL/);
});

test("PATCH /student/profile (birthday) writes to school_students first and falls back to classroom_students", () => {
  const body = handlerBody(serverSource, `router.patch("/student/profile"`);
  assert.match(body, /UPDATE school_students/);
  assert.match(body, /UPDATE classroom_students/);
  assert.match(body, /if \(!result\.rows\[0\]\)/);
});

test("PATCH /student/avatar resolves the student from either roster table and computes capacity across both", () => {
  const body = handlerBody(serverSource, `router.patch("/student/avatar"`);
  assert.match(body, /FROM school_students s/);
  assert.match(body, /FROM classroom_students s/);
  assert.match(body, /UPDATE \$\{table\}/);
});

test("PUT /school/students auto-assigns a per-grade avatar to new students and keeps existing ones stable", () => {
  const body = handlerBody(serverSource, `router.put("/school/students"`);
  assert.match(body, /pickRandomAvailableAvatar/);
  assert.match(body, /avatarCapacity\(gradeTotalCounts\.get\(s\.grade\)\)/);
  assert.match(body, /avatar_key = COALESCE\(school_students\.avatar_key, EXCLUDED\.avatar_key\)/);
});

test("requireSiteAccess always allows the student profile settings page in both its .html and clean-URL forms", () => {
  const body = handlerBody(serverSource, `const requireSiteAccess = asyncRoute`);
  assert.match(body, /requestPath === "\/classtools\/profile\.html"/);
  assert.match(body, /requestPath === "\/classtools\/profile"/);
});

test("GET /student/profile backfills a missing avatar instead of leaving the student permanently unassigned", () => {
  const body = handlerBody(serverSource, `router.get("/student/profile"`);
  assert.match(body, /if \(!row\.avatar_key\) \{/);
  assert.match(body, /pg_advisory_xact_lock/);
  assert.match(body, /pickRandomAvailableAvatar\(usageCounts, capacity\)/);
  assert.match(body, /UPDATE \$\{row\.source_table\} SET avatar_key = \$2/);
});


test("teacher roster preserves assigned avatars from both roster sources and prefers the school roster", async () => {
  const { PGlite } = await import("@electric-sql/pglite");
  const db = new PGlite();
  try {
    await db.exec([
      "CREATE TABLE classroom_users (email TEXT)",
      "CREATE TABLE school_students (school_id INTEGER, academic_year INTEGER, grade INTEGER, class_number INTEGER, student_number TEXT, roster_name TEXT, gender TEXT, avatar_key TEXT, student_email TEXT, guardian1_email TEXT, guardian2_email TEXT, user_id INTEGER)",
      "CREATE TABLE classroom_students (class_id INTEGER, student_number INTEGER, roster_name TEXT, gender TEXT, birthday_mmdd TEXT, birthday_visible BOOLEAN, avatar_key TEXT, student_email TEXT, guardian1_email TEXT, guardian2_email TEXT, user_id INTEGER)",
      "INSERT INTO school_students (school_id, academic_year, grade, class_number, student_number, roster_name, avatar_key) VALUES (1, 2026, 6, 2, '1', '학교명부학생', 'animal-cat.webp'), (1, 2026, 6, 3, '3', '다른반학생', 'animal-rabbit.webp')",
      "INSERT INTO classroom_students (class_id, student_number, roster_name, avatar_key) VALUES (10, 1, '중복학생', 'animal-dog.webp'), (10, 2, '학급명부학생', 'animal-tiger.webp')"
    ].join(";"));
    const body = handlerBody(serverSource, 'router.get("/teacher/class"');
    const queryStart = body.indexOf("const studentsResult = await pool.query(");
    const quote = String.fromCharCode(96);
    const sqlStart = body.indexOf(quote, queryStart) + 1;
    const sqlEnd = body.indexOf(quote, sqlStart);
    assert.ok(queryStart !== -1 && sqlStart > 0 && sqlEnd > sqlStart);
    const result = await db.query(body.slice(sqlStart, sqlEnd), [1, 2026, 6, 2, 10]);
    assert.deepEqual(result.rows.map(row => [row.student_number, row.avatar_key]), [
      ["1", "animal-cat.webp"],
      ["2", "animal-tiger.webp"]
    ]);
  } finally {
    await db.close();
  }
});
