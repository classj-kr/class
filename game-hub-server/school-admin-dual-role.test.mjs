import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

// 학교 관리자가 담임·교과를 겸하는 흐름을 실제 저장 코드로 돌려 본다.
// 라우트 본문을 그대로 떼어 PGlite 위에서 실행하므로, 순서가 틀려 고유 조건에
// 걸리는 일이나 조용히 지워지는 줄이 있으면 여기서 드러난다.

const source = await readFile(new URL("./classroom-platform.js", import.meta.url), "utf8");
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

function routeBody(signature) {
  const start = source.indexOf(signature);
  assert.ok(start !== -1, `Route not found: ${signature}`);
  return source.slice(source.indexOf("=> {", start) + 4, source.indexOf("\n  }));", start));
}

const saveTeachers = new AsyncFunction(
  "req", "res", "requireTeacher", "teacherRegistration", "HttpError", "normalizeEmail", "pool",
  routeBody('router.put("/school/teachers"')
);
const setMasterEmail = new AsyncFunction(
  "req", "res", "requireAdmin", "HttpError", "normalizeEmail", "pool",
  routeBody('router.put("/admin/schools/:schoolId/master-email"')
);

class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

// 운영 스키마의 고유 조건을 그대로 옮긴다(classroom-platform.js 의 CREATE 문).
const SCHEMA = `
  CREATE TABLE classroom_schools (id BIGSERIAL PRIMARY KEY, name TEXT, enabled BOOLEAN NOT NULL DEFAULT TRUE);
  CREATE TABLE classroom_teachers (
    id BIGSERIAL PRIMARY KEY,
    school_id BIGINT NOT NULL REFERENCES classroom_schools(id),
    teacher_name TEXT NOT NULL,
    google_email TEXT,
    user_id BIGINT UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    academic_year INTEGER,
    grade INTEGER,
    class_number INTEGER,
    teacher_type TEXT NOT NULL DEFAULT 'homeroom',
    subject_name TEXT,
    room_name TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (school_id, teacher_name)
  );
  CREATE UNIQUE INDEX classroom_teachers_class_assignment_idx
    ON classroom_teachers (school_id, academic_year, grade, class_number)
    WHERE academic_year IS NOT NULL AND grade IS NOT NULL AND class_number IS NOT NULL;
  CREATE UNIQUE INDEX classroom_teachers_email_idx
    ON classroom_teachers (LOWER(google_email)) WHERE google_email IS NOT NULL;
  CREATE TABLE classroom_classes (
    id BIGSERIAL PRIMARY KEY,
    school_id BIGINT NOT NULL,
    teacher_user_id BIGINT UNIQUE,
    academic_year INTEGER NOT NULL,
    grade INTEGER NOT NULL,
    class_number INTEGER NOT NULL,
    teacher_name TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`;

test("the source still declares the unique constraints this test copies", () => {
  assert.match(source, /UNIQUE \(school_id, teacher_name\)/);
  assert.match(source, /classroom_teachers_class_assignment_idx\s+ON classroom_teachers \(school_id, academic_year, grade, class_number\)/);
  assert.match(source, /classroom_teachers_email_idx\s+ON classroom_teachers \(LOWER\(google_email\)\)/);
  assert.match(source, /user_id BIGINT UNIQUE REFERENCES classroom_users/);
});

async function withSchool(run) {
  const db = new PGlite();
  try {
    await db.exec(SCHEMA);
    await db.exec(`
      INSERT INTO classroom_schools (name) VALUES ('시험학교');
      INSERT INTO classroom_teachers (school_id, teacher_name, google_email, user_id, teacher_type)
        VALUES (1, '학교 관리자', 'admin@school.test', 1, '관리자');
      INSERT INTO classroom_teachers (school_id, teacher_name, google_email, user_id, teacher_type, academic_year, grade, class_number)
        VALUES (1, '가교사', 'teacher-a@school.test', NULL, '담임', 2026, 6, 2),
               (1, '나교사', 'teacher-b@school.test', 3, '담임', 2026, 6, 3);
      INSERT INTO classroom_classes (school_id, teacher_user_id, academic_year, grade, class_number, teacher_name)
        VALUES (1, 3, 2026, 6, 3, '나교사');
    `);
    const query = async (text, params) => {
      const result = await db.query(text, params);
      return { rows: result.rows, rowCount: result.rows.length || result.affectedRows || 0 };
    };
    const pool = { query, connect: async () => ({ query, release() {} }) };
    const teachers = async () => (await db.query(
      "SELECT teacher_name, google_email, teacher_type, grade, class_number, subject_name, user_id FROM classroom_teachers ORDER BY id"
    )).rows.map((r) => ({ ...r, user_id: r.user_id === null ? null : Number(r.user_id) }));
    await run({ db, pool, teachers });
  } finally {
    await db.close();
  }
}

// 교사 명단 화면이 보내는 모양 그대로(성명 공백 제거, 학년·반이 있으면 '담임').
function row(name, email, grade = null, classNumber = null, extra = {}) {
  return { type: grade && classNumber ? "담임" : "전담", name: name.replace(/\s+/g, ""), email, grade, classNumber, subjectName: null, roomName: null, ...extra };
}

async function save(pool, list) {
  const res = { json(value) { this.body = value; } };
  await saveTeachers(
    { body: { teachers: list, year: 2026 } }, res,
    async () => ({ id: 1 }),
    async () => ({ school_id: 1, teacher_type: "관리자" }),
    HttpError, normalizeEmail, pool
  );
  return res.body;
}

test("admin takes over a teacher's class in one save: the teacher's old row is removed and the admin row keeps its account and role", async () => {
  await withSchool(async ({ pool, teachers }) => {
    await save(pool, [
      row("가교사", "admin@school.test", 6, 2, { subjectName: "음악" }),
      row("나교사", "teacher-b@school.test", 6, 3),
    ]);
    assert.deepEqual(await teachers(), [
      { teacher_name: "가교사", google_email: "admin@school.test", teacher_type: "관리자", grade: 6, class_number: 2, subject_name: "음악", user_id: 1 },
      { teacher_name: "나교사", google_email: "teacher-b@school.test", teacher_type: "담임", grade: 6, class_number: 3, subject_name: null, user_id: 3 },
    ]);
  });
});

test("moving a class onto the admin row while the old owner stays (cleared) no longer trips the one-homeroom-per-class index halfway through", async () => {
  await withSchool(async ({ pool, teachers }) => {
    await save(pool, [
      row("다교사", "admin@school.test", 6, 2),
      row("가교사", "teacher-a@school.test"),
      row("나교사", "teacher-b@school.test", 6, 3),
    ]);
    const list = await teachers();
    assert.equal(list[0].grade, 6);
    assert.equal(list[0].class_number, 2);
    assert.equal(list[1].grade, null);
    assert.equal(list[1].teacher_type, "전담");
  });
});

test("two teachers can swap classes in one save", async () => {
  await withSchool(async ({ pool, teachers }) => {
    await save(pool, [
      row("학교 관리자", "admin@school.test"),
      row("가교사", "teacher-a@school.test", 6, 3),
      row("나교사", "teacher-b@school.test", 6, 2),
    ]);
    const list = await teachers();
    assert.deepEqual([list[1].class_number, list[2].class_number], [3, 2]);
  });
});

test("writing the admin's account on another teacher's row is refused instead of silently deleting that teacher", async () => {
  await withSchool(async ({ pool, teachers }) => {
    const before = await teachers();
    await assert.rejects(
      save(pool, [
        row("학교 관리자", "admin@school.test"),
        row("가교사", "admin@school.test", 6, 2),
        row("나교사", "teacher-b@school.test", 6, 3),
      ]),
      { code: "DUPLICATE_TEACHER_EMAIL" }
    );
    assert.deepEqual(await teachers(), before);
  });
});

test("an admin row cannot take a class while its name is still the placeholder, and nothing is half-saved", async () => {
  await withSchool(async ({ pool, teachers }) => {
    const before = await teachers();
    await assert.rejects(
      save(pool, [row("학교 관리자", "admin@school.test", 6, 4), row("나교사", "teacher-b@school.test", 6, 3)]),
      { code: "ADMIN_HOMEROOM_NEEDS_NAME" }
    );
    assert.deepEqual(await teachers(), before);
  });
});

test("an untouched admin row keeps its original '학교 관리자' spelling", async () => {
  await withSchool(async ({ pool, teachers }) => {
    await save(pool, [
      row("학교 관리자", "admin@school.test"),
      row("가교사", "teacher-a@school.test", 6, 2),
      row("나교사", "teacher-b@school.test", 6, 3),
    ]);
    assert.equal((await teachers())[0].teacher_name, "학교 관리자");
  });
});

test("renaming the admin to a name another kept row uses gives a readable error and rolls back", async () => {
  await withSchool(async ({ pool, teachers }) => {
    const before = await teachers();
    await assert.rejects(
      save(pool, [
        row("나교사", "admin@school.test", 6, 4),
        row("가교사", "teacher-a@school.test", 6, 2),
        row("나교사", "teacher-b@school.test", 6, 3),
      ]),
      { code: "DUPLICATE_TEACHER_NAME" }
    );
    assert.deepEqual(await teachers(), before);
  });
});

async function setMaster(pool, email) {
  const res = { json(value) { this.body = value; } };
  await setMasterEmail({ params: { schoolId: "1" }, body: { email } }, res, async () => ({ id: 99 }), HttpError, normalizeEmail, pool);
  return res.body;
}

test("re-entering the same master email keeps the admin's dual-role name and class", async () => {
  await withSchool(async ({ pool, teachers }) => {
    await save(pool, [
      row("다교사", "admin@school.test", 6, 4),
      row("가교사", "teacher-a@school.test", 6, 2),
      row("나교사", "teacher-b@school.test", 6, 3),
    ]);
    await setMaster(pool, "Admin@School.test");
    const admin = (await teachers())[0];
    assert.equal(admin.teacher_name, "다교사");
    assert.equal(admin.grade, 6);
    assert.equal(admin.user_id, 1);
  });
});

test("handing the school admin to another account does not hand over the previous admin's class, name or login link", async () => {
  await withSchool(async ({ db, pool, teachers }) => {
    await save(pool, [
      row("다교사", "admin@school.test", 6, 4),
      row("가교사", "teacher-a@school.test", 6, 2),
      row("나교사", "teacher-b@school.test", 6, 3),
    ]);
    await db.exec("INSERT INTO classroom_classes (school_id, teacher_user_id, academic_year, grade, class_number, teacher_name) VALUES (1, 1, 2026, 6, 4, '다교사')");
    await setMaster(pool, "new-admin@school.test");
    const admin = (await teachers())[0];
    assert.deepEqual(admin, {
      teacher_name: "학교 관리자", google_email: "new-admin@school.test", teacher_type: "관리자",
      grade: null, class_number: null, subject_name: null, user_id: null,
    });
    const owners = (await db.query("SELECT grade, class_number, teacher_user_id FROM classroom_classes ORDER BY id")).rows
      .map((r) => [r.grade, r.class_number, r.teacher_user_id === null ? null : Number(r.teacher_user_id)]);
    assert.deepEqual(owners, [[6, 3, 3], [6, 4, null]]);
  });
});
