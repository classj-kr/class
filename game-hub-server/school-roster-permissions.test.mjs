import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { createRequire } from 'node:module';
import { PGlite } from '@electric-sql/pglite';

const require = createRequire(import.meta.url);
const { normalizePairs, formatTeachingScope, parseTeachingScope } = require('./teaching-scope.js');
const { namesLookDifferent, pendingTeacherName, NAME_SOURCE_PENDING, NAME_SOURCE_GOOGLE } = require('./roster-names.js');
const source = await readFile(new URL('./classroom-platform.js', import.meta.url), 'utf8');
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
function actualFunction(name) {
  const start = source.indexOf(`  async function ${name}(`);
  assert.ok(start >= 0, name);
  return source.slice(start, source.indexOf('\n  }', start) + 4);
}
function handler(method, bindings) {
  const start = source.indexOf(`router.${method}("/school/teachers"`);
  assert.ok(start >= 0);
  const body = source.slice(source.indexOf('=> {', start) + 4, source.indexOf('\n  }));', start));
  const fn = new AsyncFunction('req', 'res', ...Object.keys(bindings), body);
  return async (req) => {
    let result;
    await fn(req, { json(value) { result = value; } }, ...Object.values(bindings));
    return result;
  };
}

// Session identity is synthetic. Registration, authorization, routes and SQL are
// the actual application code, executed against an isolated PostgreSQL fixture.
async function withSchool(run) {
  const db = new PGlite();
  try {
    await db.exec(`
      CREATE TABLE classroom_schools (id BIGINT PRIMARY KEY, name TEXT, enabled BOOLEAN NOT NULL DEFAULT TRUE);
      CREATE TABLE classroom_users (id BIGINT PRIMARY KEY, email TEXT, display_name TEXT, role TEXT DEFAULT 'teacher');
      CREATE TABLE classroom_teachers (
        id BIGSERIAL PRIMARY KEY, school_id BIGINT REFERENCES classroom_schools(id), teacher_name TEXT NOT NULL,
        google_email TEXT, user_id BIGINT UNIQUE REFERENCES classroom_users(id), teacher_type TEXT NOT NULL,
        active BOOLEAN NOT NULL DEFAULT TRUE, academic_year INTEGER, grade INTEGER, class_number INTEGER,
        subject_name TEXT, room_name TEXT, teaching_scope JSONB, name_source TEXT, updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE (school_id, teacher_name)
      );
      CREATE UNIQUE INDEX classroom_teachers_email_idx ON classroom_teachers (LOWER(google_email)) WHERE google_email IS NOT NULL;
      CREATE UNIQUE INDEX classroom_teachers_class_assignment_idx
        ON classroom_teachers (school_id, academic_year, grade, class_number)
        WHERE academic_year IS NOT NULL AND grade IS NOT NULL AND class_number IS NOT NULL;
      CREATE TABLE classroom_classes (
        school_id BIGINT, teacher_user_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER, updated_at TIMESTAMPTZ
      );
      INSERT INTO classroom_schools VALUES (1, '검증학교', TRUE), (2, '다른학교', TRUE);
      INSERT INTO classroom_users (id, email, display_name) VALUES
        (101, 'admin@example.invalid', '가관리자'), (102, 'teacher@example.invalid', '나담임'),
        (103, 'subject@example.invalid', '다전담'), (104, 'principal@example.invalid', '라교장'),
        (105, 'vice@example.invalid', '마교감'), (106, 'head@example.invalid', '바교무부장'),
        (107, 'staff@example.invalid', '사일반직'), (108, 'office@example.invalid', '아행정실장'),
        (109, 'unregistered@example.invalid', '미등록'), (110, 'other@example.invalid', '타교관리자');
      INSERT INTO classroom_teachers (school_id, teacher_name, google_email, user_id, teacher_type, academic_year)
      SELECT 1, display_name, email, id,
        CASE id WHEN 101 THEN '관리자' WHEN 102 THEN '담임' WHEN 103 THEN '전담'
          WHEN 104 THEN '교장' WHEN 105 THEN '교감' WHEN 106 THEN '교무부장' WHEN 107 THEN '일반직' ELSE '행정실장' END, 2026
      FROM classroom_users WHERE id BETWEEN 101 AND 108;
      INSERT INTO classroom_teachers (school_id, teacher_name, google_email, user_id, teacher_type, academic_year)
        VALUES (2, '타교관리자', 'other@example.invalid', 110, '관리자', 2026);
      UPDATE classroom_teachers SET grade = 6, class_number = 3 WHERE user_id = 102;
      INSERT INTO classroom_classes VALUES (1, 102, 2026, 6, 3, NOW());
    `);
    let writes = 0;
    const query = async (sql, params) => {
      if (/^\s*(INSERT|UPDATE|DELETE|BEGIN)\b/i.test(sql)) writes++;
      const result = await db.query(sql, params);
      return { rows: result.rows, rowCount: result.rows.length || result.affectedRows || 0 };
    };
    const pool = { query, connect: async () => ({ query, release() {} }) };
    const normalizeEmail = value => String(value || '').trim().toLowerCase();
    const auth = new Function('pool', 'databaseReady', 'normalizeEmail', 'HttpError', 'sessionUser', 'getSiteAccessMode',
      `${['requireUser', 'teacherRegistrations', 'teacherRegistration', 'requireTeacher'].map(actualFunction).join('\n')}
       return { requireTeacher, teacherRegistration };`
    )(pool, true, normalizeEmail, HttpError, async req => req.user, async () => 'open');
    const bindings = { pool, HttpError, normalizeEmail, ...auth, normalizePairs, formatTeachingScope, parseTeachingScope,
      namesLookDifferent, pendingTeacherName, NAME_SOURCE_PENDING, NAME_SOURCE_GOOGLE };
    const get = handler('get', bindings), put = handler('put', bindings);
    const user = async id => (await db.query('SELECT * FROM classroom_users WHERE id = $1', [id])).rows[0];
    const snapshot = async () => ({
      teachers: (await db.query('SELECT * FROM classroom_teachers ORDER BY id')).rows,
      classes: (await db.query('SELECT * FROM classroom_classes ORDER BY school_id')).rows
    });
    await run({ db, get, put, user, snapshot, writes: () => writes });
  } finally { await db.close(); }
}

test('ordinary school roles can read but cannot save, delete or promote themselves even with a global admin role', () => withSchool(async ({ get, put, user, snapshot, writes }) => {
  const before = await snapshot();
  for (const id of [102, 103, 106, 107, 108]) {
    const actor = { ...await user(id), role: 'admin' };
    const data = await get({ user: actor });
    assert.equal(data.isAdmin, false);
    assert.equal(data.teachers.length, 8, 'Read only the current school');
    for (const teachers of [[], [{ name: actor.display_name, email: actor.email, type: '교장' }]]) {
      await assert.rejects(put({ user: actor, body: { teachers, year: 2026, schoolId: 2, isAdmin: true } }), { status: 403, code: 'ADMIN_ONLY' });
    }
  }
  assert.equal(writes(), 0, 'Deny before starting any write transaction');
  assert.deepEqual(await snapshot(), before);
}));

test('school administrator, principal and vice principal can save their school only', () => withSchool(async ({ get, put, user, snapshot }) => {
  const otherSchool = (await snapshot()).teachers.filter(t => Number(t.school_id) === 2);
  for (const id of [101, 104, 105]) {
    const actor = await user(id);
    const data = await get({ user: actor });
    assert.equal(data.isAdmin, true);
    const target = data.teachers.find(t => t.email === 'teacher@example.invalid');
    target.name = `변경교사${id}`;
    const result = await put({ user: actor, body: { teachers: data.teachers, year: 2026, schoolId: 2 } });
    assert.equal(result.saved, 8);
    assert.equal((await get({ user: actor })).teachers.find(t => t.email === target.email).name, target.name);
    assert.deepEqual((await snapshot()).teachers.filter(t => Number(t.school_id) === 2), otherSchool);
  }
}));

test('no session, missing registration, inactive registration and disabled school cannot read or write roster', () => withSchool(async ({ db, get, put, user, snapshot, writes }) => {
  const before = await snapshot();
  for (const route of [get, put]) {
    await assert.rejects(route({ body: { teachers: [] } }), { status: 401, code: 'AUTH_REQUIRED' });
    await assert.rejects(route({ user: await user(109), body: { teachers: [] } }), { status: 403, code: 'TEACHER_REGISTRATION_REQUIRED' });
  }
  assert.deepEqual(await snapshot(), before);
  const admin = await user(101);
  await db.query('UPDATE classroom_teachers SET active = FALSE WHERE user_id = 101');
  const inactive = await snapshot();
  for (const route of [get, put]) await assert.rejects(route({ user: admin, body: { teachers: [] } }), { status: 403, code: 'TEACHER_REGISTRATION_REQUIRED' });
  assert.deepEqual(await snapshot(), inactive);
  await db.query('UPDATE classroom_teachers SET active = TRUE WHERE user_id = 101');
  await db.query('UPDATE classroom_schools SET enabled = FALSE WHERE id = 1');
  const disabled = await snapshot();
  for (const route of [get, put]) await assert.rejects(route({ user: admin, body: { teachers: [] } }), { status: 403, code: 'TEACHER_REGISTRATION_REQUIRED' });
  assert.deepEqual(await snapshot(), disabled);
  assert.equal(writes(), 0);
}));

test('email-only registration uses its actual school role, including revoked administrator access', () => withSchool(async ({ db, get, put, user, snapshot, writes }) => {
  const actor = await user(104);
  await db.query('UPDATE classroom_teachers SET user_id = NULL, google_email = UPPER(google_email) WHERE user_id = 104');
  assert.equal((await get({ user: actor })).isAdmin, true);
  await db.query("UPDATE classroom_teachers SET teacher_type = '전담' WHERE LOWER(google_email) = $1", [actor.email]);
  const before = await snapshot();
  assert.equal((await get({ user: actor })).isAdmin, false);
  await assert.rejects(put({ user: actor, body: { teachers: [] } }), { status: 403, code: 'ADMIN_ONLY' });
  assert.deepEqual(await snapshot(), before);
  assert.equal(writes(), 0);
}));
