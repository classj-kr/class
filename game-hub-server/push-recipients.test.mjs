import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

// 알림장 알림을 누구에게 돌려 볼지 좁히는 SQL 을 실제 소스에서 떼어 PGlite 에서 돌린다.
// 마지막 판정(그 게시판이 보이는가)은 classboardBoards 가 하고, 이 SQL 은 같은 학교의
// 학생·보호자로 좁히기만 한다. 좁히다 빠뜨리면 그 사람은 알림을 영영 못 받는다.

const source = await readFile(new URL("./classroom-platform.js", import.meta.url), "utf8");

function candidatesSql() {
  const match = /const PUSH_CANDIDATES_SQL = `([\s\S]*?)`;/.exec(source);
  assert.ok(match, "PUSH_CANDIDATES_SQL not found");
  return match[1];
}

function routeBody(signature) {
  const start = source.indexOf(signature);
  assert.ok(start !== -1, `Route not found: ${signature}`);
  return source.slice(start, source.indexOf("\n  }));", start));
}

const SCHEMA = `
  CREATE TABLE classroom_users (id BIGSERIAL PRIMARY KEY, email TEXT, display_name TEXT);
  CREATE TABLE classroom_teachers (
    id BIGSERIAL PRIMARY KEY, school_id BIGINT, user_id BIGINT, google_email TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE
  );
  CREATE TABLE classroom_classes (id BIGSERIAL PRIMARY KEY, school_id BIGINT NOT NULL);
  CREATE TABLE classroom_students (
    id BIGSERIAL PRIMARY KEY, class_id BIGINT NOT NULL, user_id BIGINT,
    student_email TEXT, guardian1_email TEXT, guardian2_email TEXT
  );
  CREATE TABLE school_students (
    id BIGSERIAL PRIMARY KEY, school_id BIGINT NOT NULL, user_id BIGINT,
    student_email TEXT, guardian1_email TEXT, guardian2_email TEXT
  );
  CREATE TABLE classroom_push_subscriptions (
    id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL, endpoint TEXT NOT NULL UNIQUE
  );
`;

// 학교 1 과 학교 2. 이름 대신 역할로 부른다.
const PEOPLE = {
  studentById: 1,        // school_students.user_id
  studentByEmail: 2,     // school_students.student_email (대소문자 섞임)
  guardian2: 3,          // school_students.guardian2_email
  oldRosterGuardian: 4,  // classroom_students(옛 명단) → 학교 1 학급
  teacherById: 5,        // 교사 등록 user_id — 자녀도 학교 1 에 있음
  teacherByEmail: 6,     // 교사 등록 google_email — 자녀도 학교 1 에 있음
  retiredTeacher: 7,     // 쉬는 교사 등록 — 자녀도 학교 1 에 있음
  otherSchoolParent: 8,  // 학교 2
  noDevice: 9,           // 학교 1 학생인데 알림을 켠 기기가 없음
  author: 10             // 학교 1 학생 명단에 있지만 이번 글을 쓴 사람
};

async function withSchools(run) {
  const db = new PGlite();
  try {
    await db.exec(SCHEMA);
    for (const [name, id] of Object.entries(PEOPLE)) {
      await db.query("INSERT INTO classroom_users (id, email) VALUES ($1, $2)", [id, `${name}@example.com`]);
      if (name !== "noDevice") {
        await db.query("INSERT INTO classroom_push_subscriptions (user_id, endpoint) VALUES ($1, $2)", [id, `https://fcm.googleapis.com/fcm/send/${name}`]);
      }
    }
    await db.exec(`
      INSERT INTO classroom_classes (id, school_id) VALUES (100, 1), (200, 2);
      INSERT INTO school_students (school_id, user_id) VALUES (1, 1), (1, 9), (1, 10);
      INSERT INTO school_students (school_id, student_email) VALUES (1, 'StudentByEmail@Example.com');
      INSERT INTO school_students (school_id, guardian1_email, guardian2_email)
        VALUES (1, 'someone-else@example.com', 'GUARDIAN2@example.com');
      INSERT INTO classroom_students (class_id, guardian1_email) VALUES (100, 'oldRosterGuardian@example.com');
      INSERT INTO school_students (school_id, guardian1_email) VALUES
        (1, 'teacherById@example.com'), (1, 'teacherByEmail@example.com'), (1, 'retiredTeacher@example.com');
      INSERT INTO classroom_teachers (school_id, user_id) VALUES (1, 5);
      INSERT INTO classroom_teachers (school_id, google_email) VALUES (2, 'TeacherByEmail@example.com');
      INSERT INTO classroom_teachers (school_id, user_id, active) VALUES (1, 7, FALSE);
      INSERT INTO school_students (school_id, guardian1_email) VALUES (2, 'otherSchoolParent@example.com');
    `);
    await run(db);
  } finally {
    await db.close();
  }
}

async function candidates(db, schoolId, excludeUserId) {
  const res = await db.query(candidatesSql(), [schoolId, excludeUserId]);
  return res.rows.map(r => Number(r.id)).sort((a, b) => a - b);
}

test("a school's students and guardians with a device are candidates; other schools and the author are not", async () => {
  await withSchools(async (db) => {
    // 교직원도 자기 아이가 이 학교에 있으면 후보다(학부모로서 받는다).
    assert.deepEqual(await candidates(db, 1, PEOPLE.author), [
      PEOPLE.studentById, PEOPLE.studentByEmail, PEOPLE.guardian2, PEOPLE.oldRosterGuardian,
      PEOPLE.teacherById, PEOPLE.teacherByEmail, PEOPLE.retiredTeacher
    ]);
  });
});

test("every staff registration, by id or email and even when inactive, is flagged so it is only read as a guardian", async () => {
  await withSchools(async (db) => {
    const res = await db.query(candidatesSql(), [1, null]);
    const flags = Object.fromEntries(res.rows.map(r => [Number(r.id), r.is_staff]));
    assert.equal(flags[PEOPLE.teacherById], true);
    assert.equal(flags[PEOPLE.teacherByEmail], true);
    assert.equal(flags[PEOPLE.retiredTeacher], true);
    assert.equal(flags[PEOPLE.studentById], false);
    assert.equal(flags[PEOPLE.guardian2], false);
  });
});

test("the other school only reaches its own families", async () => {
  await withSchools(async (db) => {
    assert.deepEqual(await candidates(db, 2, null), [PEOPLE.otherSchoolParent]);
  });
});

test("a notice with no school reaches everyone with a device", async () => {
  await withSchools(async (db) => {
    assert.deepEqual(await candidates(db, null, null), [1, 2, 3, 4, 5, 6, 7, 8, 10]);
  });
});

test("posting answers first and only then queues the notification", () => {
  const post = routeBody('router.post("/classboard/posts"');
  assert.ok(post.indexOf("res.json(") < post.indexOf("queuePush(() => notifyClassboardPost(target.key, user.id, content))"));
  const notice = routeBody('router.post("/teacher/notices"');
  assert.ok(notice.indexOf("res.status(201).json(") < notice.indexOf("queuePush(() => notifyNotice(noticeId, schoolId, teacher.id, title, needsReply))"));
});

test("who sees the board is decided by the same rule that builds the board list", () => {
  const visit = /async function forEachPushCandidate[\s\S]*?\r?\n  }\r?\n/.exec(source)[0];
  // 교직원은 아이가 없으면 건너뛰고, 있으면 학부모 범위로만 본다. 교사 범위로 보면
  // 학급 행을 고쳐 쓰는 일이 알림 보내는 길에서 돈다.
  assert.match(visit, /if \(staff && \(await getGuardianChildren\(user\)\)\.length === 0\) continue;/);
  assert.match(visit, /classboardBoards\(user, \{ asGuardian: staff \}\)/);
  assert.match(visit, /staff \? "&as=guardian" : ""/);
  const post = /async function notifyClassboardPost[\s\S]*?\r?\n  }\r?\n/.exec(source)[0];
  assert.match(post, /boards\.find\(b => b\.key === boardKey\)/);
  const notice = /async function notifyNotice[\s\S]*?\r?\n  }\r?\n/.exec(source)[0];
  assert.match(notice, /boards\.filter\(b => b\.kind === "notice"\)/);
  assert.match(notice, /NOTICE_TARGET_SQL/);
});

test("the guardian view is decided before any teacher lookup", () => {
  const scope = /async function classboardScope\(user, \{ asGuardian = false \} = \{\}\)[\s\S]*?const teacherRes/.exec(source);
  assert.ok(scope, "classboardScope must check asGuardian before looking up the teacher registration");
  assert.match(scope[0], /if \(children\.length > 0\) return guardianClassboardScope\(children\);/);
  assert.doesNotMatch(scope[0], /await userClassId\(/);
});

test("the board list and posts honour the guardian view", () => {
  for (const signature of ['router.get("/classboard/boards"', 'router.get("/classboard/posts"']) {
    assert.match(routeBody(signature), /classboardBoards\(user, \{ asGuardian: req\.query\.as === "guardian" \}\)/);
  }
});
