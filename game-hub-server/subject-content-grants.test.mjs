import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { createRequire } from "node:module";

// 전담이 가르치는 반에 오늘 하루 열어 두는 홈 메뉴. 담임이 잠가 둔 메뉴도 전담이 열면 그 반에서는
// 열리고, 담임은 그것을 닫을 수 없다(연 사람만 닫는다). 그날 밤 자정(한국 시간)에 저절로 닫힌다.

const require = createRequire(import.meta.url);
const grants = require("./subject-content-grants.js");
const { canonicalMenuPath, individualMenuPaths, GAME_PAGE_ALIASES } = require("./home-content-paths.js");
const {
  SCHEMA_STATEMENTS, CLASS_CONTENT_OPEN_SQL, endOfTodayInSeoul, classLabel,
  subjectTeachingClasses, subjectGrantsForClass, subjectGrantedPathsForTeacher, setSubjectGrant
} = grants;

const source = await readFile(new URL("./classroom-platform.js", import.meta.url), "utf8");
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

function routeBody(signature) {
  const start = source.indexOf(signature);
  assert.ok(start !== -1, `Route not found: ${signature}`);
  return source.slice(source.indexOf("=> {", start) + 4, source.indexOf("\n  }));", start));
}
class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
const normalizeContentPath = (value) => {
  const path = String(value || "").trim();
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
};

const SCHEMA = `
  CREATE TABLE classroom_schools (id BIGSERIAL PRIMARY KEY, name TEXT, enabled BOOLEAN NOT NULL DEFAULT TRUE);
  CREATE TABLE classroom_users (id BIGSERIAL PRIMARY KEY, email TEXT, display_name TEXT, role TEXT);
  CREATE TABLE classroom_teachers (
    id BIGSERIAL PRIMARY KEY, school_id BIGINT NOT NULL, teacher_name TEXT NOT NULL, google_email TEXT,
    user_id BIGINT UNIQUE, active BOOLEAN NOT NULL DEFAULT TRUE, teacher_type TEXT NOT NULL DEFAULT 'homeroom',
    academic_year INTEGER, grade INTEGER, class_number INTEGER, teaching_scope JSONB
  );
  CREATE TABLE classroom_classes (
    id BIGSERIAL PRIMARY KEY, school_id BIGINT NOT NULL, teacher_user_id BIGINT, academic_year INTEGER NOT NULL,
    grade INTEGER NOT NULL, class_number INTEGER NOT NULL, teacher_name TEXT NOT NULL,
    UNIQUE (school_id, academic_year, grade, class_number)
  );
  CREATE TABLE school_students (
    id BIGSERIAL PRIMARY KEY, school_id BIGINT NOT NULL, academic_year INTEGER NOT NULL,
    grade INTEGER NOT NULL, class_number INTEGER NOT NULL, student_number TEXT NOT NULL, roster_name TEXT NOT NULL
  );
  CREATE TABLE school_master_timetable (
    id BIGSERIAL PRIMARY KEY, school_id BIGINT NOT NULL, academic_year INTEGER NOT NULL, grade INTEGER NOT NULL,
    class_number INTEGER NOT NULL DEFAULT 0, day_of_week INTEGER NOT NULL, period INTEGER NOT NULL,
    subject_name TEXT NOT NULL DEFAULT '', teacher_user_id BIGINT
  );
  CREATE TABLE classroom_content_enabled (
    class_id BIGINT NOT NULL, content_path TEXT NOT NULL, updated_by BIGINT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), PRIMARY KEY (class_id, content_path)
  );
  CREATE TABLE classroom_content_disabled (
    class_id BIGINT NOT NULL, content_path TEXT NOT NULL, updated_by BIGINT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), PRIMARY KEY (class_id, content_path)
  );
  CREATE TABLE site_content_disabled (
    content_path TEXT PRIMARY KEY, updated_by BIGINT, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`;

// 시험학교: 3-1(담임 가교사, user 2), 3-2(담임 나교사, user 3), 4-1(담임 없음). 음악 전담 다전담(user 4)은
// 3학년 담당이고, 시간표로는 4-1도 가르친다. 학생 철수(user 5)는 3-1.
async function withSchool(run) {
  const db = new PGlite();
  try {
    await db.exec(SCHEMA);
    for (const statement of SCHEMA_STATEMENTS) await db.exec(statement);
    await db.exec(`
      INSERT INTO classroom_schools (name) VALUES ('시험학교');
      INSERT INTO classroom_users (email, display_name, role) VALUES
        ('admin@school.test', '관리자', 'admin'), ('a@school.test', '가교사', 'teacher'), ('b@school.test', '나교사', 'teacher'),
        ('music@school.test', '다전담', 'teacher'), ('s3101@school.test', '철수', 'student');
      INSERT INTO classroom_teachers (school_id, teacher_name, google_email, user_id, teacher_type, academic_year, grade, class_number, teaching_scope) VALUES
        (1, '학교 관리자', 'admin@school.test', 1, '관리자', 2026, NULL, NULL, NULL),
        (1, '가교사', 'a@school.test', 2, '담임', 2026, 3, 1, NULL),
        (1, '나교사', 'b@school.test', 3, '담임', 2026, 3, 2, NULL),
        (1, '다전담', 'music@school.test', 4, '전담', 2026, NULL, NULL, '[{"grade":3,"subject":"음악"}]');
      INSERT INTO classroom_classes (school_id, teacher_user_id, academic_year, grade, class_number, teacher_name) VALUES
        (1, 2, 2026, 3, 1, '가교사'), (1, 3, 2026, 3, 2, '나교사'), (1, NULL, 2026, 4, 1, '4학년 1반');
      INSERT INTO school_students (school_id, academic_year, grade, class_number, student_number, roster_name) VALUES
        (1, 2026, 3, 1, '1', '철수'), (1, 2026, 3, 2, '1', '영희'), (1, 2026, 4, 1, '1', '민수'), (1, 2026, 5, 1, '1', '지우');
      INSERT INTO school_master_timetable (school_id, academic_year, grade, class_number, day_of_week, period, subject_name, teacher_user_id) VALUES
        (1, 2026, 4, 1, 1, 1, '음악', 4), (1, 2026, 4, 0, 1, 2, '학년 공통', 4);
      INSERT INTO classroom_content_enabled (class_id, content_path, updated_by) VALUES (2, '/learning/games', 3);
    `);
    const query = async (text, params) => {
      const result = await db.query(text, params);
      return { rows: result.rows, rowCount: result.rows.length || result.affectedRows || 0 };
    };
    const pool = { query, connect: async () => ({ query, release() {} }) };
    const musicTeacher = { schoolId: 1, teacherUserId: 4, academicYear: 2026, grades: [3] };
    const taught = () => subjectTeachingClasses(pool, musicTeacher);
    await run({ db, pool, query, musicTeacher, taught });
  } finally {
    await db.close();
  }
}

const isOpen = async (query, classId, path, root = "") =>
  (await query(CLASS_CONTENT_OPEN_SQL, [classId, path, root])).rows.length > 0;

// ─── 하루의 끝 ──────────────────────────────────────────────────────────

test("endOfTodayInSeoul is the next Korean midnight, whatever the UTC date is", () => {
  assert.equal(endOfTodayInSeoul(Date.parse("2026-10-06T07:00:00Z")).toISOString(), "2026-10-06T15:00:00.000Z");
  // UTC로는 아직 6일이지만 한국은 7일 01:00 → 8일 자정에 닫힌다.
  assert.equal(endOfTodayInSeoul(Date.parse("2026-10-06T16:00:00Z")).toISOString(), "2026-10-07T15:00:00.000Z");
  assert.equal(endOfTodayInSeoul(Date.parse("2026-10-06T14:59:59Z")).toISOString(), "2026-10-06T15:00:00.000Z");
});

// ─── 전담이 가르치는 반 ──────────────────────────────────────────────────

test("a subject teacher's classes are every class of their grades in the roster plus timetable classes, without grade-level rows", async () => {
  await withSchool(async ({ taught }) => {
    assert.deepEqual((await taught()).map(classLabel), ["3-1", "3-2", "4-1"]);
  });
});

// ─── 열기·닫기·학생 접근 ─────────────────────────────────────────────────

test("a subject teacher opens a menu for all their classes at once, even where the homeroom keeps it locked", async () => {
  await withSchool(async ({ pool, query, musicTeacher, taught }) => {
    assert.equal(await isOpen(query, 1, "/learning/arts/music"), false, "담임이 열지 않은 메뉴는 잠겨 있다");
    const classes = await taught();
    // 조회 SQL은 DB의 NOW()를 쓴다. 고정된 과거 날짜로 열면 시간이 지나면서 저절로 실패한다.
    const now = Date.now();
    const { expiresAt } = await setSubjectGrant(pool, { ...musicTeacher, classes, contentPath: "/learning/arts/music", enabled: true, now });
    assert.equal(expiresAt.toISOString(), endOfTodayInSeoul(now).toISOString());

    for (const classId of [1, 2, 3]) {
      assert.equal(await isOpen(query, classId, "/learning/arts/music"), true, `class ${classId} opened`);
      assert.equal(await isOpen(query, classId, "/learning/arts/music/piano"), true, "하위 경로도 열린다");
      assert.equal(await isOpen(query, classId, "/learning/arts/music/app.js", "/learning/arts/music"), true, "정적 자원도 뿌리 경로로 열린다");
    }
    assert.equal(await isOpen(query, 1, "/learning/arts"), false, "상위 경로는 열리지 않는다");
    assert.deepEqual(await subjectGrantedPathsForTeacher(pool, { ...musicTeacher, classes }), ["/learning/arts/music"]);

    const opened = await subjectGrantsForClass(pool, { schoolId: 1, academicYear: 2026, grade: 3, classNumber: 1 });
    assert.deepEqual([...opened.entries()], [["/learning/arts/music", ["다전담"]]]);
  });
});

test("the homeroom's own grants keep working alongside, and closing by the subject teacher removes only theirs", async () => {
  await withSchool(async ({ pool, query, musicTeacher, taught }) => {
    const classes = await taught();
    await setSubjectGrant(pool, { ...musicTeacher, classes, contentPath: "/learning/games", enabled: true });
    assert.equal(await isOpen(query, 1, "/learning/games"), true, "3-1은 전담이 열어 열린다");
    assert.equal(await isOpen(query, 2, "/learning/games"), true, "3-2는 담임도 열어 두었다");

    await setSubjectGrant(pool, { ...musicTeacher, classes, contentPath: "/learning/games", enabled: false });
    assert.equal(await isOpen(query, 1, "/learning/games"), false, "전담이 닫으면 3-1은 다시 잠긴다");
    assert.equal(await isOpen(query, 2, "/learning/games"), true, "담임이 연 3-2는 전담이 닫아도 그대로다");
    assert.equal((await query("SELECT 1 FROM classroom_content_enabled WHERE class_id = 2 AND content_path = '/learning/games'")).rows.length, 1);
  });
});

test("an existing math tool grant opens its catalog without unlocking sibling tools", async () => {
  await withSchool(async ({ pool, query, musicTeacher, taught }) => {
    const catalog = "/learning/literacy-numeracy/math-tools";
    assert.equal(await isOpen(query, 1, catalog), false);
    await query("INSERT INTO classroom_content_enabled (class_id, content_path) VALUES ($1, $2)", [1, `${catalog}/number-models`]);
    assert.equal(await isOpen(query, 1, catalog), true);
    assert.equal(await isOpen(query, 1, `${catalog}/index.html`), true);
    assert.equal(await isOpen(query, 1, `${catalog}/tools.css`, catalog), true);
    for (const asset of ['math.js', 'ui.js', 'ui.css', 'fonts/STIXTwoMath-Regular.woff2']) {
      assert.equal(await isOpen(query, 1, `${catalog}/assets/${asset}`, catalog), true,
        'one math tool grant also opens the shared manipulative assets');
    }
    assert.equal(await isOpen(query, 1, `${catalog}/number-models`), true);
    assert.equal(await isOpen(query, 1, `${catalog}/fraction-board`), false);
    assert.equal(await isOpen(query, 1, `${catalog}/fraction-board/style.css`, `${catalog}/fraction-board`), false);
    assert.equal(await isOpen(query, 2, catalog), false);

    const classes = await taught();
    await setSubjectGrant(pool, { ...musicTeacher, classes, contentPath: `${catalog}/graph-studio`, enabled: true });
    assert.equal(await isOpen(query, 2, catalog), true);
    assert.equal(await isOpen(query, 2, `${catalog}/graph-studio`), true);
    assert.equal(await isOpen(query, 2, `${catalog}/number-models`), false);
    assert.equal(await isOpen(query, 2, `${catalog}/assets/math.js`, catalog), true);
    assert.equal(await isOpen(query, 2, `${catalog}/solid-nets`), false, 'shared assets do not open another lesson');
  });
});

test("a subject teacher's grant lapses at the Korean midnight and is swept on the next write", async () => {
  await withSchool(async ({ pool, query, musicTeacher, taught }) => {
    const classes = await taught();
    await setSubjectGrant(pool, { ...musicTeacher, classes, contentPath: "/learning/arts/music", enabled: true });
    await query("UPDATE classroom_content_subject_grants SET expires_at = NOW() - INTERVAL '1 minute'");
    assert.equal(await isOpen(query, 1, "/learning/arts/music"), false, "지난 날의 공개는 효력이 없다");
    assert.deepEqual(await subjectGrantedPathsForTeacher(pool, { ...musicTeacher, classes }), []);
    assert.equal((await subjectGrantsForClass(pool, { schoolId: 1, academicYear: 2026, grade: 3, classNumber: 1 })).size, 0);

    await setSubjectGrant(pool, { ...musicTeacher, classes, contentPath: "/learning/games", enabled: true });
    const left = await query("SELECT DISTINCT content_path FROM classroom_content_subject_grants ORDER BY content_path");
    assert.deepEqual(left.rows.map((r) => r.content_path), ["/learning/games"], "지난 줄은 치워진다");
  });
});

// Exercise the current lock endpoints with real SQL and isolated identities.
const canManageClassContent = new Function(
  source.slice(source.indexOf("  function canManageClassContent("), source.indexOf("  async function requireTeacher("))
  + "\nreturn canManageClassContent;"
)();
const putAccess = new AsyncFunction(
  "req", "res", "requireUser", "canManageClassContent", "teacherRegistration", "userClassId",
  "HttpError", "canonicalMenuPath", "normalizeContentPath", "individualMenuPaths", "pool",
  routeBody('router.put("/teacher/home-content-access"')
);
const putGlobal = new AsyncFunction(
  "req", "res", "requireAdmin", "HttpError", "canonicalMenuPath", "normalizeContentPath",
  "individualMenuPaths", "pool", "GAME_PAGE_ALIASES", "invalidateGloballyDisabledContentPathsCache",
  routeBody('router.put("/admin/home-content-access"')
);
const getAccess = new AsyncFunction(
  "req", "res", "getSiteAccessMode", "getGloballyDisabledContentPaths", "sessionUser", "userClassId",
  "teacherRegistration", "canManageClassContent", "pool", routeBody('router.get("/home-content-access"')
);

function routeHelpers(pool) {
  const user = id => ({ id, role: id === 1 ? "admin" : id === 5 ? "student" : "teacher" });
  const teacherRegistration = async ({ id }) =>
    (await pool.query("SELECT teacher_type, grade, class_number FROM classroom_teachers WHERE user_id = $1", [id])).rows[0];
  const userClassId = async ({ id }) => ({ 2: 1, 3: 2, 5: 1 })[id] || null;
  const send = () => ({ json(value) { this.body = value; } });
  return {
    async put(id, path, disabled) {
      const res = send();
      await putAccess({ body: { path, disabled } }, res, async () => user(id), canManageClassContent,
        teacherRegistration, userClassId, HttpError, canonicalMenuPath, normalizeContentPath, individualMenuPaths, pool);
      return res.body;
    },
    async global(id, path, disabled) {
      const res = send();
      const requireAdmin = async () => {
        if (id !== 1) throw new HttpError(403, "ADMIN_REQUIRED", "admin only");
        return user(id);
      };
      await putGlobal({ body: { path, disabled } }, res, requireAdmin, HttpError, canonicalMenuPath, normalizeContentPath,
        individualMenuPaths, pool, GAME_PAGE_ALIASES, () => {});
      return res.body;
    },
    async get(id) {
      const res = send();
      await getAccess({}, res, async () => "restricted", async () => [], async () => user(id), userClassId,
        teacherRegistration, canManageClassContent, pool);
      return res.body;
    }
  };
}

test("students start with every menu available; only a homeroom can persist individual class locks", async () => {
  await withSchool(async ({ pool, query }) => {
    const { get, put } = routeHelpers(pool);
    const path = "/learning/games/spot-match";
    assert.deepEqual((await get(5)).classDisabledPaths, []);
    assert.equal((await get(5)).hasClassAccess, true);
    assert.equal((await get(2)).canManage, true);
    assert.equal((await get(4)).canManage, false);
    await assert.rejects(() => put(4, path, true), { code: "HOMEROOM_TEACHER_REQUIRED" });
    await assert.rejects(() => put(5, path, true), { code: "HOMEROOM_TEACHER_REQUIRED" });
    await assert.rejects(() => put(1, path, true), { code: "HOMEROOM_TEACHER_REQUIRED" });
    await assert.rejects(() => put(2, "/learning/games", true), { code: "INVALID_CONTENT_PATH" });
    await assert.rejects(() => put(2, "/room", true), { code: "INVALID_CONTENT_PATH" });
    await assert.rejects(() => put(2, path, undefined), { code: "INVALID_CONTENT_PATH" });
    assert.deepEqual(await put(2, path, true), { ok: true, path, disabled: true });
    assert.deepEqual((await get(2)).classDisabledPaths, [path]);
    assert.deepEqual((await get(5)).classDisabledPaths, [path]);
    assert.deepEqual((await get(3)).classDisabledPaths, []);
    assert.deepEqual((await query("SELECT updated_by FROM classroom_content_disabled WHERE content_path = $1", [path])).rows, [{ updated_by: 2 }]);
    await put(2, path, false);
    assert.deepEqual((await get(5)).classDisabledPaths, []);
  });
});

test("a site administrator can change individual global locks, including removing an older game alias", async () => {
  await withSchool(async ({ pool, query }) => {
    const { get, global } = routeHelpers(pool);
    const path = "/learning/games/spot-match";
    const legacy = "/learning/games/dobble/dobble";
    assert.equal((await get(1)).canManageGlobally, true);
    assert.equal((await get(1)).canManage, false);
    await assert.rejects(() => global(2, path, true), { code: "ADMIN_REQUIRED" });
    await assert.rejects(() => global(1, "/learning/games", true), { code: "INVALID_CONTENT_PATH" });
    await query("INSERT INTO site_content_disabled (content_path) VALUES ($1)", [legacy]);
    assert.deepEqual(await global(1, path, true), { ok: true, path, disabled: true });
    await global(1, path, false);
    assert.deepEqual((await query("SELECT content_path FROM site_content_disabled", [])).rows, []);
  });
});

test("an old grouped global stop becomes individual stops and does not return after unlocking one", async () => {
  const migration = source.match(/`(WITH previous AS \(\s+DELETE FROM site_content_disabled[\s\S]*?ON CONFLICT \(content_path\) DO NOTHING)`/)?.[1];
  assert.ok(migration);
  await withSchool(async ({ pool, query }) => {
    const group = "/learning/literacy-numeracy/story-books";
    const path = `${group}/korea-tales`;
    const { global } = routeHelpers(pool);
    await query("INSERT INTO site_content_disabled (content_path, updated_by) VALUES ($1, 1)", [group]);
    await query(migration, [[...individualMenuPaths]]);
    const saved = () => query("SELECT content_path FROM site_content_disabled ORDER BY content_path", []);
    const paths = [...individualMenuPaths].filter(value => value.startsWith(`${group}/`)).sort();
    assert.deepEqual((await saved()).rows.map(row => row.content_path), paths);
    await global(1, path, false);
    await query(migration, [[...individualMenuPaths]]);
    assert.deepEqual((await saved()).rows.map(row => row.content_path), paths.filter(value => value !== path));
  });
});
