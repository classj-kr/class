import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { createRequire } from "node:module";

// 저장 코드가 전담의 담당 학년·과목을 짝으로 푸는 데 쓰는 진짜 함수.
const { parseTeachingScope } = createRequire(import.meta.url)("./teaching-scope.js");
// 성명을 비운 줄의 자리표시와 '구글에서 가져옴' 표시. 저장 코드가 이름 칸을 다룰 때 쓴다.
const { pendingTeacherName, NAME_SOURCE_PENDING, NAME_SOURCE_GOOGLE } = createRequire(import.meta.url)("./roster-names.js");

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
  "req", "res", "requireTeacher", "teacherRegistration", "HttpError", "normalizeEmail", "pool", "parseTeachingScope",
  "pendingTeacherName", "NAME_SOURCE_PENDING", "NAME_SOURCE_GOOGLE",
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
    teaching_scope JSONB,
    name_source TEXT,
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
    HttpError, normalizeEmail, pool, parseTeachingScope,
    pendingTeacherName, NAME_SOURCE_PENDING, NAME_SOURCE_GOOGLE
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

for (const kind of ["행정실장", "일반직"]) {
  test(`a ${kind} row keeps its 분류 across saves and cannot take a class`, async () => {
    await withSchool(async ({ pool, teachers }) => {
      const base = [row("학교 관리자", "admin@school.test"), row("가교사", "teacher-a@school.test", 6, 2), row("나교사", "teacher-b@school.test", 6, 3)];
      await save(pool, [...base, row("라직원", "staff@school.test", null, null, { type: kind })]);
      assert.equal((await teachers())[3].teacher_type, kind);
      const before = await teachers();
      await assert.rejects(
        save(pool, [...base, row("라직원", "staff@school.test", 6, 5, { type: kind })]),
        { code: "STAFF_NO_CLASS" }
      );
      assert.deepEqual(await teachers(), before);
    });
  });
}

test("교장·교감 rows keep their 분류 across saves, can change their account, and can be removed", async () => {
  await withSchool(async ({ pool, teachers }) => {
    const base = [row("학교 관리자", "admin@school.test"), row("가교사", "teacher-a@school.test", 6, 2), row("나교사", "teacher-b@school.test", 6, 3)];
    const heads = [row("바교장", "principal@school.test", null, null, { type: "교장" }), row("사교감", "vice@school.test", null, null, { type: "교감" })];
    await save(pool, [...base, ...heads]);
    await save(pool, [...base, row("바교장", "principal-new@school.test", null, null, { type: "교장" }), heads[1]]);
    const list = await teachers();
    assert.deepEqual(list.slice(3).map((t) => [t.teacher_name, t.teacher_type, t.google_email]), [
      ["바교장", "교장", "principal-new@school.test"],
      ["사교감", "교감", "vice@school.test"],
    ]);
    assert.equal(list[0].teacher_type, "관리자");

    await save(pool, [...base, heads[1]]);
    assert.deepEqual((await teachers()).map((t) => t.teacher_name), ["학교 관리자", "가교사", "나교사", "사교감"]);
  });
});

test("the school admin row still survives being left out of the list", async () => {
  await withSchool(async ({ pool, teachers }) => {
    await save(pool, [row("가교사", "teacher-a@school.test", 6, 2)]);
    assert.deepEqual((await teachers()).map((t) => t.teacher_name), ["학교 관리자", "가교사"]);
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

test("setting the master email never takes over the 교장's own row when the school has no admin row yet", async () => {
  await withSchool(async ({ db, pool, teachers }) => {
    await db.exec(`
      DELETE FROM classroom_teachers WHERE teacher_type = '관리자';
      INSERT INTO classroom_teachers (school_id, teacher_name, google_email, user_id, teacher_type)
        VALUES (1, '바교장', 'principal@school.test', 7, '교장');
    `);
    await setMaster(pool, "new-admin@school.test");
    const list = await teachers();
    const principal = list.find((t) => t.teacher_name === "바교장");
    assert.deepEqual([principal.teacher_type, principal.google_email, principal.user_id], ["교장", "principal@school.test", 7]);
    const admin = list.find((t) => t.teacher_type === "관리자");
    assert.deepEqual([admin.teacher_name, admin.google_email], ["학교 관리자", "new-admin@school.test"]);
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

test("전담 줄의 담당 학년·과목은 (학년, 교과) 짝으로 저장되고, 담임 줄도 괄호 학년이 있으면 짝을 얻는다", async () => {
  await withSchool(async ({ db, pool, teachers }) => {
    await save(pool, [
      row("가교사", "teacher-a@school.test", 6, 2, { subjectName: "영어(5)" }),
      { type: "전담", name: "라전담", email: "teacher-d@school.test", grade: "3,4,5,6", classNumber: null, subjectName: "음악, 영어(5,6)", roomName: "음악실" },
      { type: "전담", name: "마전담", email: "teacher-e@school.test", grade: "", classNumber: null, subjectName: "체육", roomName: null },
    ]);
    const rows = (await db.query("SELECT teacher_name, grade, class_number, subject_name, teaching_scope FROM classroom_teachers ORDER BY id")).rows;
    const byName = Object.fromEntries(rows.map((r) => [r.teacher_name, r]));
    // 담임: 학년·반은 그대로, 괄호에 적은 5학년 영어만 짝.
    assert.deepEqual([byName["가교사"].grade, byName["가교사"].class_number, byName["가교사"].subject_name], [6, 2, "영어"]);
    assert.deepEqual(byName["가교사"].teaching_scope, [{ grade: 5, subject: "영어" }]);
    // 전담: 학년 칸은 비우고(담임이 아니다) 짝만 남긴다. 괄호 없는 음악은 담당 학년 전부.
    assert.deepEqual([byName["라전담"].grade, byName["라전담"].class_number, byName["라전담"].subject_name], [null, null, "음악, 영어"]);
    assert.deepEqual(byName["라전담"].teaching_scope, [
      { grade: 3, subject: "음악" }, { grade: 4, subject: "음악" }, { grade: 5, subject: "음악" }, { grade: 6, subject: "음악" },
      { grade: 5, subject: "영어" }, { grade: 6, subject: "영어" },
    ]);
    // 학년 없이 과목만: 과목은 남고 짝은 없다.
    assert.deepEqual([byName["마전담"].subject_name, byName["마전담"].teaching_scope], ["체육", []]);

    // 반 없이 학년만 적고 과목이 없으면 무엇을 맡는지 모른다 → 거절. 반을 적었는데 학년이 여럿이어도 거절.
    await assert.rejects(save(pool, [{ type: "전담", name: "바전담", email: null, grade: "3,4", classNumber: null, subjectName: "", roomName: null }]), { code: "INVALID_GRADE_CLASS" });
    await assert.rejects(save(pool, [{ type: "담임", name: "사교사", email: null, grade: "3,4", classNumber: 1, subjectName: "", roomName: null }]), { code: "INVALID_GRADE_CLASS" });
    assert.equal((await teachers()).length, 4, "거절된 저장은 아무것도 바꾸지 않는다");
  });
});
