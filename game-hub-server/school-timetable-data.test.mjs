import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import test from 'node:test';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { PGlite } from '@electric-sql/pglite';

const require = createRequire(import.meta.url);
const { normalizePairs, formatTeachingScope, parseTeachingScope } = require('./teaching-scope.js');
const { namesLookDifferent, pendingTeacherName, NAME_SOURCE_PENDING, NAME_SOURCE_GOOGLE } = require('./roster-names.js');
const source = await readFile(new URL('./classroom-platform.js', import.meta.url), 'utf8');
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}

function handler(method, path, bindings) {
  const start = source.indexOf(`router.${method}("${path}"`);
  assert.ok(start >= 0, path);
  const body = source.slice(source.indexOf('=> {', start) + 4, source.indexOf('\n  }));', start));
  const fn = new AsyncFunction('req', 'res', ...Object.keys(bindings), body);
  return async (req = {}) => {
    let result;
    await fn({ query: {}, body: {}, ...req }, { json(value) { result = value; } }, ...Object.values(bindings));
    return result;
  };
}

async function withSchool(run) {
  const db = new PGlite();
  try {
    await db.exec(`
      CREATE TABLE classroom_users (id BIGINT PRIMARY KEY, email TEXT, display_name TEXT);
      CREATE UNIQUE INDEX classroom_users_email_idx ON classroom_users (LOWER(email));
      CREATE TABLE classroom_teachers (
        id BIGSERIAL PRIMARY KEY, school_id BIGINT NOT NULL, teacher_name TEXT NOT NULL,
        google_email TEXT, user_id BIGINT UNIQUE REFERENCES classroom_users(id),
        active BOOLEAN NOT NULL DEFAULT TRUE, teacher_type TEXT NOT NULL,
        academic_year INTEGER, grade INTEGER, class_number INTEGER, subject_name TEXT,
        room_name TEXT, teaching_scope JSONB, name_source TEXT, updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE (school_id, teacher_name)
      );
      CREATE UNIQUE INDEX classroom_teachers_class_assignment_idx
        ON classroom_teachers (school_id, academic_year, grade, class_number)
        WHERE academic_year IS NOT NULL AND grade IS NOT NULL AND class_number IS NOT NULL;
      CREATE TABLE classroom_classes (
        school_id BIGINT, teacher_user_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER, updated_at TIMESTAMPTZ
      );
      CREATE TABLE school_master_timetable (
        id BIGSERIAL PRIMARY KEY, school_id BIGINT, academic_year INTEGER, grade INTEGER,
        class_number INTEGER, day_of_week INTEGER, period INTEGER, subject_name TEXT NOT NULL DEFAULT '',
        room_name TEXT, teacher_user_id BIGINT REFERENCES classroom_users(id), updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE (school_id, academic_year, grade, class_number, day_of_week, period)
      );
      CREATE UNIQUE INDEX school_master_timetable_teacher_slot_idx
        ON school_master_timetable (school_id, academic_year, teacher_user_id, day_of_week, period)
        WHERE teacher_user_id IS NOT NULL;
      INSERT INTO classroom_users VALUES
        (101, 'admin@example.invalid', '구글관리자'), (102, 'home@example.invalid', '구글담임'),
        (103, 'subject@example.invalid', '구글전담'), (104, 'email@example.invalid', '구글이름'),
        (105, 'inactive@example.invalid', '비활성'), (106, 'other@example.invalid', '타교사'),
        (107, 'staff@example.invalid', '행정직'), (108, 'principal@example.invalid', '교장');
      INSERT INTO classroom_teachers
        (school_id, teacher_name, google_email, user_id, teacher_type, academic_year, grade, class_number, subject_name, teaching_scope)
      VALUES
        (1, '가관리자', 'admin@example.invalid', 101, '관리자', 2026, 5, 1, NULL, NULL),
        (1, '나담임', 'home@example.invalid', 102, '담임', 2026, 6, 3, NULL, NULL),
        (1, '다음악', 'subject@example.invalid', 103, '전담', 2026, NULL, NULL, '음악', '[{"grade":3,"subject":"음악"},{"grade":4,"subject":"음악"}]'),
        (1, '라신규', 'new@example.invalid', NULL, '전담', 2026, NULL, NULL, '영어', NULL),
        (1, '마기존계정', 'EMAIL@example.invalid', NULL, '전담', 2026, NULL, NULL, '체육', NULL),
        (1, '바비활성', 'inactive@example.invalid', 105, '담임', 2026, 4, 1, NULL, NULL),
        (2, '사다른학교', 'other@example.invalid', 106, '담임', 2026, 4, 1, NULL, NULL),
        (1, '아일반직', 'staff@example.invalid', 107, '일반직', 2026, NULL, NULL, NULL, NULL),
        (1, '자교장', 'principal@example.invalid', 108, '교장', 2026, NULL, NULL, NULL, NULL);
      UPDATE classroom_teachers SET active = FALSE WHERE user_id = 105;
      INSERT INTO school_master_timetable
        (school_id, academic_year, grade, class_number, day_of_week, period, subject_name, teacher_user_id) VALUES
        (1, 2026, 6, 3, 1, 1, '국어', NULL), (1, 2026, 6, 3, 1, 2, '음악', 103),
        (1, 2026, 6, 3, 1, 3, '', NULL), (1, 2026, 6, 3, 1, 4, '수학', NULL),
        (1, 2026, 5, 2, 1, 4, '창체', 102), (1, 2026, 5, 1, 2, 1, '사회', NULL),
        (1, 2027, 6, 3, 1, 1, '다음학년도', NULL), (2, 2026, 6, 3, 1, 1, '다른학교', NULL);
    `);
    const query = async (sql, params) => {
      const r = await db.query(sql, params);
      return { rows: r.rows, rowCount: r.affectedRows ?? r.rows.length };
    };
    const pool = { query, connect: async () => ({ query, release() {} }) };
    const bindings = {
      pool, HttpError, normalizePairs, formatTeachingScope, parseTeachingScope, namesLookDifferent,
      pendingTeacherName, NAME_SOURCE_PENDING, NAME_SOURCE_GOOGLE,
      normalizeEmail: value => String(value || '').trim().toLowerCase(),
      requireSchoolAdmin: async () => ({ profile: { school_id: 1 }, user: { id: 101 } }),
      requireSchoolCurriculum: async () => ({ profile: { school_id: 1 }, user: { id: 101 }, canEdit: true }),
      requireTeacher: async () => ({ id: 101 }),
      teacherRegistration: async () => ({ school_id: 1, teacher_type: '관리자' })
    };
    // The real resolver is included when present; routes and SQL always come from production source.
    const resolverStart = source.indexOf('  async function schoolTimetableTeacher(');
    if (resolverStart >= 0) {
      const resolverEnd = source.indexOf('\n  }', resolverStart) + 4;
      bindings.schoolTimetableTeacher = new Function('pool', 'HttpError',
        `${source.slice(resolverStart, resolverEnd)}; return schoolTimetableTeacher;`)(pool, HttpError);
    }
    const list = handler('get', '/school-admin/specialist-teachers', bindings);
    const get = handler('get', '/school-admin/specialist-timetable', bindings);
    const put = handler('put', '/school-admin/specialist-timetable', bindings);
    const roster = handler('get', '/school/teachers', bindings);
    const save = handler('put', '/school/teachers', bindings);
    await run({ db, list, get, put, roster, save });
  } finally { await db.close(); }
}

test('teacher picker includes a teaching admin, new unlinked teacher, and email-linked account, using roster names', () => withSchool(async ({ list, roster }) => {
  const teachers = (await list()).teachers;
  assert.deepEqual(teachers.map(t => t.name).sort(), ['가관리자', '나담임', '다음악', '라신규', '마기존계정', '자교장'].sort());
  assert.equal(teachers.find(t => t.name === '나담임').id, '102', 'Use the account ID, not roster row ID 2');
  assert.equal(teachers.find(t => t.name === '라신규').id, null);
  assert.equal(teachers.find(t => t.name === '마기존계정').id, '104');
  assert.equal((await roster()).teachers.find(t => t.name === '마기존계정').linked, true);
  assert.deepEqual(teachers.find(t => t.name === '다음악').teachingScope, [{ grade: 3, subject: '음악' }, { grade: 4, subject: '음악' }]);
}));

test('homeroom timetable includes class lessons, excludes another teacher and respects explicit assignments, school and year', () => withSchool(async ({ get }) => {
  const rows = (await get({ query: { academicYear: 2026, teacherUserId: 102 } })).timetable;
  assert.deepEqual(rows.map(r => r.subject_name).sort(), ['국어', '창체']);
  assert.equal(rows.find(r => r.subject_name === '국어').inherited, true);
  assert.equal(rows.find(r => r.subject_name === '창체').inherited, false);
  assert.deepEqual((await get({ query: { academicYear: 2027, teacherUserId: 102 } })).timetable, []);
  assert.deepEqual((await get({ query: { academicYear: 2026, teacherUserId: 101 } })).timetable.map(r => r.subject_name), ['사회']);
}));

test('saving roster name, homeroom and subjects is immediately reflected by teacher picker and timetable', () => withSchool(async ({ roster, save, list, get }) => {
  const teachers = (await roster()).teachers.filter(t => !['바비활성'].includes(t.name));
  const home = teachers.find(t => t.name === '나담임');
  Object.assign(home, { name: '나변경', grade: 5, classNumber: 3 });
  Object.assign(teachers.find(t => t.name === '다음악'), { grade: '5,6', subjectName: '영어' });
  await save({ body: { year: 2026, teachers } });
  const updated = (await list()).teachers;
  assert.equal(updated.find(t => t.id === '102').name, '나변경');
  assert.equal(updated.find(t => t.id === '102').homeroomClassNumber, 3);
  assert.deepEqual(updated.find(t => t.id === '103').teachingScope, [{ grade: 5, subject: '영어' }, { grade: 6, subject: '영어' }]);
  assert.deepEqual((await get({ query: { academicYear: 2026, teacherUserId: 102 } })).timetable.map(r => r.subject_name), ['창체']);
}));

test('time assignment rejects inactive, foreign-school and staff accounts for both reads and writes', () => withSchool(async ({ get, put, db }) => {
  for (const teacherUserId of [105, 106, 107, 999]) {
    await assert.rejects(get({ query: { academicYear: 2026, teacherUserId } }), e => e.code === 'INVALID_TEACHER');
    await assert.rejects(put({ body: { academicYear: 2026, teacherUserId, cells: [{ grade: 3, classNumber: 1, dayOfWeek: 5, period: 8, subjectName: '오배정' }] } }), e => e.code === 'INVALID_TEACHER');
  }
  assert.equal((await db.query("SELECT COUNT(*)::integer AS n FROM school_master_timetable WHERE subject_name = '오배정'")).rows[0].n, 0);
}));

test('an email-linked account can save/read/clear a lesson, and double bookings still fail', () => withSchool(async ({ get, put }) => {
  const cell = { grade: 3, classNumber: 1, dayOfWeek: 3, period: 2, subjectName: '체육' };
  await put({ body: { academicYear: 2026, teacherUserId: 104, cells: [cell] } });
  assert.equal((await get({ query: { academicYear: 2026, teacherUserId: 104 } })).timetable[0].subject_name, '체육');
  await assert.rejects(put({ body: { academicYear: 2026, teacherUserId: 104, cells: [{ ...cell, classNumber: 2 }] } }), e => e.code === 'TEACHER_ALREADY_BOOKED');
  await assert.rejects(put({ body: { academicYear: 2026, teacherUserId: 103, cells: [cell] } }), e => e.code === 'SLOT_ALREADY_TAKEN');
  await put({ body: { academicYear: 2026, teacherUserId: 104, cells: [{ ...cell, clear: true }] } });
  assert.deepEqual((await get({ query: { academicYear: 2026, teacherUserId: 104 } })).timetable, []);
}));

test('school administration uses the same resolved registration as the roster and still denies non-admins', async () => {
  const start = source.indexOf('  async function requireSchoolAdmin(');
  const end = source.indexOf('\n  }', start) + 4;
  const makeGate = new Function('requireTeacher', 'teacherRegistration', 'HttpError',
    `${source.slice(start, end)}; return requireSchoolAdmin;`);
  const user = { id: 104, email: 'email@example.invalid' };
  for (const type of ['관리자', '교장', '교감']) {
    const profile = { school_id: 1, teacher_type: type, user_id: null };
    const gate = makeGate(async () => user, async actual => { assert.equal(actual, user); return profile; }, HttpError);
    assert.deepEqual(await gate({}), { user, profile });
  }
  for (const profile of [null, { school_id: 1, teacher_type: '담임' }]) {
    await assert.rejects(makeGate(async () => user, async () => profile, HttpError)({}), e => e.status === 403);
  }
});

test('browser renders real API/database results, unlinked guidance, roster changes and homeroom lessons', () => withSchool(async ({ list, get, roster, save }) => {
  const { chromium } = require('playwright');
  const browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
  const errors = [], requests = [];
  let failList = false, delayHome = false, releaseHome, homeStarted;
  const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
  page.on('pageerror', e => errors.push(e.message));
  const base = 'http://school-timetable.test';
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin !== base) return route.abort();
    if (url.pathname.startsWith('/api/')) {
      requests.push(url.pathname + url.search);
      let data = {};
      if (url.pathname.endsWith('/specialist-teachers')) {
        if (failList) return route.fulfill({ status: 503, json: { message: '검증용 목록 조회 실패' } });
        data = await list();
      } else if (url.pathname.endsWith('/specialist-timetable')) {
        if (delayHome && url.searchParams.get('teacherUserId') === '102') {
          const held = new Promise(resolve => { releaseHome = resolve; });
          homeStarted();
          await held;
        }
        data = await get({ query: Object.fromEntries(url.searchParams) });
      }
      else if (url.pathname.endsWith('/curriculum-access')) data = { canEdit: true };
      else if (url.pathname.endsWith('/vacation-settings')) data = { settings: {} };
      else if (url.pathname.endsWith('/annual-schedules')) data = { schedules: [] };
      else if (url.pathname.endsWith('/public-holidays')) data = { holidays: [], all: [] };
      else throw new Error(`Unexpected API: ${url.pathname}`);
      return route.fulfill({ json: data });
    }
    const file = { '/schooladmin/': 'index.html', '/schooladmin/app.js': 'app.js', '/schooladmin/style.css': 'style.css' }[url.pathname];
    if (!file) return route.fulfill({ status: 404 });
    return route.fulfill({ body: await readFile(new URL(`../apps/schooladmin/${file}`, import.meta.url)), contentType: file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html' });
  });
  try {
    await page.goto(`${base}/schooladmin/`);
    await page.locator('[data-tab="specialistTimetable"]').click();
    await page.waitForFunction(() => document.querySelectorAll('#specialistTeacherSelect option').length > 1);
    const labels = await page.locator('#specialistTeacherSelect option').allTextContents();
    assert.ok(labels.some(t => t.includes('가관리자') && t.includes('5-1')));
    assert.ok(labels.some(t => t.includes('다음악') && t.includes('3·4학년 음악')));
    assert.ok(labels.some(t => t.includes('자교장 (교장)')));
    assert.ok(labels.some(t => t.includes('라신규') && t.includes('로그인 대기')));
    await page.locator('#specialistTeacherSelect').selectOption({ label: labels.find(t => t.includes('라신규')) });
    await page.waitForFunction(() => document.querySelector('#specialistTimetableEmpty').textContent.includes('로그인'));
    assert.ok(await page.locator('#specialistTimetableContent').isHidden());
    assert.ok(!requests.some(r => /teacherUserId=(null|unlinked|roster)/.test(r)));
    await page.locator('#specialistTeacherSelect').selectOption('102');
    await page.waitForFunction(() => document.querySelector('#specialistTimetableMatrixBody').textContent.includes('국어'));
    const grid = await page.locator('#specialistTimetableMatrixBody').textContent();
    assert.ok(grid.includes('담임 수업'));
    assert.ok(!grid.includes('음악'));
    const output = new URL('../outputs/school-timetable-data-2026-10-07/', import.meta.url);
    await mkdir(output, { recursive: true });
    await page.screenshot({ path: fileURLToPath(new URL('homeroom.png', output)) });
    const inheritedDialog = page.waitForEvent('dialog').then(async dialog => {
      assert.ok(dialog.message().includes('학급별 기초시간표'));
      await dialog.accept();
    });
    await page.locator('#specialistTimetableMatrixBody [data-day="1"][data-period="1"]').click();
    await inheritedDialog;
    const teachers = (await roster()).teachers.filter(t => t.name !== '바비활성');
    teachers.find(t => t.name === '나담임').name = '나수정';
    await save({ body: { year: 2026, teachers } });
    await page.locator('[data-tab="specialistTimetable"]').click();
    await page.waitForFunction(() => document.querySelector('#specialistTeacherSelect').selectedOptions[0].textContent.includes('나수정'));
    // The slower response for an old selection must never paint the new teacher's grid.
    delayHome = true;
    const pendingHome = new Promise(resolve => { homeStarted = resolve; });
    await page.locator('#specialistTeacherSelect').selectOption('103');
    await page.waitForFunction(() => document.querySelector('#specialistTimetableMatrixBody').textContent.includes('음악'));
    await page.locator('#specialistTeacherSelect').selectOption('102');
    await pendingHome;
    await page.locator('#specialistTeacherSelect').selectOption('103');
    await page.waitForFunction(() => !document.querySelector('#specialistTimetableContent').hidden);
    const homeFinished = page.waitForResponse(response => response.url().includes('teacherUserId=102'));
    releaseHome();
    await homeFinished;
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert.ok((await page.locator('#specialistTimetableMatrixBody').textContent()).includes('음악'));
    assert.ok(!(await page.locator('#specialistTimetableMatrixBody').textContent()).includes('국어'));
    delayHome = false;
    await page.screenshot({ path: fileURLToPath(new URL('specialist.png', output)) });
    failList = true;
    await page.locator('[data-tab="specialistTimetable"]').click();
    await page.waitForFunction(() => document.querySelector('#specialistTimetableEmpty').textContent === '검증용 목록 조회 실패');
    assert.ok(await page.locator('#specialistTimetableContent').isHidden());
    assert.equal(await page.locator('#specialistTeacherSelect option').count(), 1);
    assert.deepEqual(errors, []);
  } finally { releaseHome?.(); await browser.close(); }
}));
