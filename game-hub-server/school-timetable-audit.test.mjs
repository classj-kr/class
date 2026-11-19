import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import test from 'node:test';
import { PGlite } from '@electric-sql/pglite';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const timetableRules = require('./school-timetable-rules.js');
const source = await readFile(new URL('./classroom-platform.js', import.meta.url), 'utf8');
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}

function handler(method, path, bindings) {
  const start = source.indexOf(`router.${method}("/school-admin/${path}"`);
  assert.ok(start >= 0, path);
  const body = source.slice(source.indexOf('=> {', start) + 4, source.indexOf('\n  }));', start));
  const fn = new AsyncFunction('req', 'res', ...Object.keys(bindings), body);
  return async (req = {}) => {
    let data;
    await fn({ query: {}, body: {}, ...req }, { json(value) { data = value; }, set() {} }, ...Object.values(bindings));
    return data;
  };
}

async function withSchool(run) {
  const db = new PGlite();
  try {
    await db.exec(`
      CREATE TABLE classroom_schools (id BIGINT PRIMARY KEY);
      CREATE TABLE classroom_users (id BIGINT PRIMARY KEY, email TEXT);
      CREATE TABLE classroom_teachers (
        id SERIAL PRIMARY KEY, teacher_name TEXT, school_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER,
        user_id BIGINT, google_email TEXT, teacher_type TEXT, active BOOLEAN DEFAULT TRUE
      );
      CREATE TABLE school_students (school_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER);
      CREATE TABLE classroom_classes (school_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER);
      CREATE TABLE school_vacation_settings (school_id BIGINT, academic_year INTEGER);
      CREATE TABLE school_annual_schedules (
        school_id BIGINT, academic_year INTEGER, event_date DATE, title TEXT, category TEXT,
        target_scope TEXT DEFAULT 'ALL', target_grades INTEGER[] DEFAULT '{}'
      );
      CREATE TABLE school_general_events (
        school_id BIGINT, event_date DATE, end_date DATE, title TEXT, event_time TEXT, period TEXT, location TEXT,
        target_scope TEXT DEFAULT 'ALL', target_grades INTEGER[] DEFAULT '{}'
      );
      CREATE TABLE school_curriculum_hours (
        id SERIAL, school_id BIGINT, academic_year INTEGER, grade INTEGER,
        subject_name TEXT, weekly_hours NUMERIC, annual_required_hours INTEGER, category TEXT
      );
      INSERT INTO school_curriculum_hours (school_id, academic_year, grade, subject_name, weekly_hours, annual_required_hours, category)
        VALUES (1, 2028, 3, '국어', 6, 204, 'SUBJECT'), (1, 2028, 3, '수학', 4, 136, 'SUBJECT');
      INSERT INTO classroom_schools VALUES (1);
      INSERT INTO classroom_users VALUES (101, 'home@example.invalid'), (102, 'subject@example.invalid'), (103, 'next@example.invalid'), (900, 'admin@example.invalid');
      INSERT INTO classroom_teachers (school_id, academic_year, grade, class_number, user_id, teacher_type) VALUES
        (1, 2028, 3, 1, 101, '담임'), (1, 2028, NULL, NULL, 102, '전담'),
        (1, 2028, 3, 2, NULL, '담임'), (1, 2028, 3, 3, NULL, '담임'), (1, 2028, 5, 7, NULL, '담임');
    `);
    for (const table of ['school_master_timetable', 'school_weekly_period_allocation', 'school_class_day_timetable', 'school_grade_heads']) {
      const start = source.indexOf(`CREATE TABLE IF NOT EXISTS ${table} (`);
      await db.exec(source.slice(start, source.indexOf('`', start)));
    }
    await db.exec(`
      ALTER TABLE school_master_timetable ADD COLUMN teacher_user_id BIGINT, ADD COLUMN room_name TEXT;
      CREATE UNIQUE INDEX teacher_slot ON school_master_timetable (school_id, academic_year, teacher_user_id, day_of_week, period) WHERE teacher_user_id IS NOT NULL;
      CREATE UNIQUE INDEX room_slot ON school_master_timetable (school_id, academic_year, room_name, day_of_week, period) WHERE room_name IS NOT NULL;
      INSERT INTO school_master_timetable (school_id, academic_year, grade, class_number, day_of_week, period, subject_name) VALUES
        (1, 2028, 3, 1, 1, 1, '국어'), (1, 2028, 3, 2, 1, 1, '수학'), (1, 2028, 3, 3, 1, 1, '과학');
      INSERT INTO school_weekly_period_allocation (school_id, academic_year, grade, day_of_week, period_count) VALUES
        (1, 2028, 3, 1, 5), (1, 2028, 3, 2, 5), (1, 2028, 3, 3, 5), (1, 2028, 3, 4, 6), (1, 2028, 3, 5, 5);
    `);
    const query = async (sql, params) => {
      const r = await db.query(sql, params);
      return { rows: r.rows, rowCount: r.affectedRows || r.rows.length };
    };
    const pool = { query, connect: async () => ({ query, release() {} }) };
    // 누가 요청하는지. 기본은 학교 관리자이고, 검사마다 담임·학년부장으로 바꾼다.
    const who = { user: { id: 900 }, profile: { school_id: 1, teacher_type: '관리자' }, registrations: [] };
    const teacherRegistrations = async () => who.registrations;
    const bindings = { pool, HttpError, timetableRules,
      requireSchoolCurriculum: async () => ({ user: who.user, profile: who.profile }),
      requireSchoolAdmin: async () => {
        if (!['관리자', '교장', '교감'].includes(who.profile.teacher_type)) throw new HttpError(403, 'SCHOOL_ADMIN_REQUIRED', 'admin');
        return { user: who.user, profile: who.profile };
      } };
    const canEditStart = source.indexOf('  async function canEditClassDays(');
    bindings.canEditClassDays = new Function('pool', 'teacherRegistrations',
      `${source.slice(canEditStart, source.indexOf('\n  }', canEditStart) + 4)}; return canEditClassDays;`)(pool, teacherRegistrations);
    const resolverStart = source.indexOf('  async function schoolTimetableTeacher(');
    bindings.schoolTimetableTeacher = new Function('pool', 'HttpError',
      `${source.slice(resolverStart, source.indexOf('\n  }', resolverStart) + 4)}; return schoolTimetableTeacher;`)(pool, HttpError);
    await run({
      db,
      who,
      day: handler('put', 'class-day-timetable', bindings),
      gradeHead: handler('put', 'grade-head', bindings),
      cell: async (grade, classNumber, day, period) => (await db.query(
        `SELECT subject_name, teacher_user_id, room_name FROM school_master_timetable
         WHERE school_id=1 AND academic_year=2028 AND grade=$1 AND class_number=$2 AND day_of_week=$3 AND period=$4`,
        [grade, classNumber, day, period])).rows[0],
      overview: handler('get', 'school-timetable', bindings),
      master: handler('get', 'master-timetable', bindings),
      save: handler('post', 'master-timetable', bindings),
      specialistGet: handler('get', 'specialist-timetable', bindings),
      specialist: handler('put', 'specialist-timetable', bindings),
      room: handler('put', 'room-timetable', bindings),
      allocation: handler('post', 'weekly-period-allocation', bindings),
      annual: handler('get', 'annual-timetable-34weeks', bindings)
    });
  } finally { await db.close(); }
}

const year = 2028;
const at = (dayOfWeek, period, subjectName) => ({ dayOfWeek, period, subjectName });

test('class saves reject a missing class or invalid cell and leave every cell untouched', () => withSchool(async ({ save, db, cell }) => {
  await assert.rejects(save({ body: { academicYear: year, grade: 3, cells: [at(1, 2, '국어')] } }), { status: 400 });
  await assert.rejects(save({ body: { academicYear: year, grade: 'x', classNumber: 1, cells: [at(1, 2, '국어')] } }), { status: 400 });
  await assert.rejects(save({ body: { academicYear: 'next', grade: 3, classNumber: 1, cells: [at(1, 2, '국어')] } }), { status: 400 });
  await assert.rejects(save({ body: { academicYear: year, grade: 3, classNumber: 1, cells: [at(1, 2, '수학'), at(6, 1, '국어')] } }), { status: 400 });
  assert.equal(await cell(3, 1, 1, 2), undefined, 'the valid cell in a rejected save must not be written');
  assert.equal((await db.query('SELECT COUNT(*)::int AS n FROM school_master_timetable WHERE class_number = 0')).rows[0].n, 0);
}));

test('saving blank cells neither creates rows nor turns an unregistered class into a real one', () => withSchool(async ({ save, overview, db }) => {
  const cells = [];
  for (let d = 1; d <= 5; d++) for (let p = 1; p <= 8; p++) cells.push(at(d, p, ''));
  await save({ body: { academicYear: year, grade: 4, classNumber: 5, cells } });
  assert.equal((await db.query('SELECT COUNT(*)::int AS n FROM school_master_timetable WHERE grade = 4')).rows[0].n, 0);
  assert.ok(!(await overview({ query: { academicYear: year } })).classes.some(c => c.grade === 4));
}));

test('a class save erases cleared lessons, ignores repeated cells and reports claimed cells it skipped', () => withSchool(async ({ save, specialist, cell }) => {
  await specialist({ body: { academicYear: year, teacherUserId: 102, cells: [{ grade: 3, classNumber: 2, dayOfWeek: 2, period: 1, subjectName: '음악' }] } });
  const result = await save({ body: { academicYear: year, grade: 3, classNumber: 2, cells: [at(1, 1, ''), at(1, 2, '사회'), at(1, 2, '도덕'), at(2, 1, '체육')] } });
  assert.equal((await cell(3, 2, 1, 1)).subject_name, '');
  assert.equal((await cell(3, 2, 1, 2)).subject_name, '도덕');
  assert.equal((await cell(3, 2, 2, 1)).subject_name, '음악');
  assert.equal(result.skippedLocked, 1);
}));

test('clearing a room claim from the class grid keeps the homeroom subject that was already there', () => withSchool(async ({ room, save, cell }) => {
  await room({ body: { academicYear: year, room: '과학실', cells: [{ grade: 3, classNumber: 1, dayOfWeek: 1, period: 1 }] } });
  await save({ body: { academicYear: year, grade: 3, classNumber: 1, cells: [{ dayOfWeek: 1, period: 1, clearSpecialist: true }] } });
  assert.deepEqual(await cell(3, 1, 1, 1), { subject_name: '국어', teacher_user_id: null, room_name: null });
}));

test('specialist writes validate cells, keep the subject when none is typed and warn about the homeroom class', () => withSchool(async ({ specialist, cell }) => {
  await assert.rejects(specialist({ body: { academicYear: year, teacherUserId: 102, cells: [{ grade: 3.5, classNumber: 1, dayOfWeek: 1, period: 1 }] } }), { status: 400, code: 'INVALID_CELL' });
  await specialist({ body: { academicYear: year, teacherUserId: 102, cells: [{ grade: 3, classNumber: 2, dayOfWeek: 1, period: 1, subjectName: '' }] } });
  assert.equal((await cell(3, 2, 1, 1)).subject_name, '수학');
  const result = await specialist({ body: { academicYear: year, teacherUserId: 101, cells: [{ grade: 3, classNumber: 3, dayOfWeek: 1, period: 1, subjectName: '체육' }] } });
  assert.equal(result.warnings.length, 1);
  assert.match(result.warnings[0], /3학년 1반/);
}));

test('a placeholder "-" is not a homeroom lesson', () => withSchool(async ({ db, specialistGet }) => {
  await db.exec(`UPDATE school_master_timetable SET subject_name = '-' WHERE grade = 3 AND class_number = 1`);
  assert.deepEqual((await specialistGet({ query: { academicYear: year, teacherUserId: 101 } })).timetable, []);
}));

test('weekly allocation stores whole periods instead of failing on a decimal value', () => withSchool(async ({ allocation, db }) => {
  await allocation({ body: { academicYear: year, allocations: [{ grade: 4, dayOfWeek: 1, periodCount: 4.6 }, { grade: 4, dayOfWeek: 2, periodCount: 'x' }] } });
  assert.deepEqual((await db.query('SELECT day_of_week, period_count FROM school_weekly_period_allocation WHERE grade = 4 ORDER BY 1')).rows,
    [{ day_of_week: 1, period_count: 5 }, { day_of_week: 2, period_count: 0 }]);
}));

test('annual hours count the lessons actually placed and never invent a timetable', () => withSchool(async ({ db, annual }) => {
  await db.exec(`INSERT INTO school_master_timetable (school_id, academic_year, grade, class_number, day_of_week, period, subject_name, teacher_user_id, room_name) VALUES
    (1, 2028, 3, 1, 1, 3, '수학', NULL, NULL), (1, 2028, 3, 1, 1, 6, '수업없음', NULL, NULL), (1, 2028, 3, 1, 1, 5, '-', NULL, NULL),
    (1, 2028, 3, 1, 2, 4, '', 102, NULL), (1, 2028, 3, 1, 3, 2, '', NULL, '과학실')`);
  const filled = await annual({ query: { academicYear: year, grade: 3, classNumber: 1 } });
  assert.deepEqual(filled.dailyPeriodsMap, { 1: 2, 2: 1, 3: 1, 4: 0, 5: 0 });
  assert.equal(filled.hasTimetable, true);
  const empty = await annual({ query: { academicYear: year, grade: 6, classNumber: 1 } });
  assert.deepEqual(empty.dailyPeriodsMap, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  assert.equal(empty.hasTimetable, false);
}));

test('only an administrator, the grade head and the homeroom teacher change a class day, and the master timetable stays as it was', () => withSchool(async ({ db, who, day, gradeHead, annual }) => {
  const asTeacher = (userId, registrations) => {
    who.user = { id: userId };
    who.profile = { school_id: 1, teacher_type: registrations[0]?.teacher_type || '담임', ...registrations[0] };
    who.registrations = registrations;
  };
  const change = (date, changes, classNumber = 1) => day({ body: { academicYear: year, grade: 3, classNumber, date, changes } });
  // 3학년 2반 담임(등록 3번)은 1반을 못 바꾼다.
  asTeacher(103, [{ id: 3, school_id: 1, academic_year: 2028, grade: 3, class_number: 2, teacher_type: '담임' }]);
  await assert.rejects(change('2028-05-09', [{ period: 1, subject: '창체(자율)' }]), { status: 403 });
  assert.equal((await annual({ query: { academicYear: year, grade: 3, classNumber: 1 } })).canEditDays, false);
  await assert.rejects(gradeHead({ body: { academicYear: year, grade: 3, teacherId: '3' } }), { status: 403 });
  // 관리자가 그를 3학년 부장으로 정하면 1반도 바꿀 수 있다.
  asTeacher(900, [{ teacher_type: '관리자' }]);
  assert.equal((await gradeHead({ body: { academicYear: year, grade: 3, teacherId: '3' } })).gradeHead.id, '3');
  await assert.rejects(gradeHead({ body: { academicYear: year, grade: 3, teacherId: '999' } }), { status: 400 });
  asTeacher(103, [{ id: 3, school_id: 1, academic_year: 2028, grade: 3, class_number: 2, teacher_type: '담임' }]);
  const head = await annual({ query: { academicYear: year, grade: 3, classNumber: 1 } });
  assert.equal(head.canEditDays, true);
  assert.equal(head.gradeHead.id, '3');
  await change('2028-05-09', [{ period: 1, subject: '창체(자율)' }, { period: 2, subject: '' }]);
  // 4학년 부장은 아니다.
  assert.equal((await annual({ query: { academicYear: year, grade: 4, classNumber: 1 } })).canEditDays, false);
  // 1반 담임(등록 1번)은 자기 반을 바꾸고, 기초시간표대로 되돌릴 수도 있다.
  asTeacher(101, [{ id: 1, school_id: 1, academic_year: 2028, grade: 3, class_number: 1, teacher_type: '담임' }]);
  const saved = await change('2028-05-09', [{ period: 2, subject: null }, { period: 5, subject: '체육' }]);
  assert.deepEqual(saved.changes.map(c => [c.period, c.subject]), [[1, '창체(자율)'], [5, '체육']]);
  const shown = await annual({ query: { academicYear: year, grade: 3, classNumber: 1 } });
  assert.deepEqual(shown.dayChanges, [{ date: '2028-05-09', period: 1, subject: '창체(자율)' }, { date: '2028-05-09', period: 5, subject: '체육' }]);
  assert.equal((await db.query(`SELECT subject_name FROM school_master_timetable WHERE grade = 3 AND class_number = 1 AND day_of_week = 1 AND period = 1`)).rows[0].subject_name, '국어');
  // 학년도 밖, 주말, 없는 날짜, 같은 교시 두 번, 9교시는 받지 않는다.
  for (const [date, changes] of [
    ['2029-03-02', [{ period: 1, subject: '국어' }]], ['2028-05-13', [{ period: 1, subject: '국어' }]],
    ['2028-02-30', [{ period: 1, subject: '국어' }]], ['2028-05-10', [{ period: 1, subject: '국어' }, { period: 1, subject: '수학' }]],
    ['2028-05-10', [{ period: 9, subject: '국어' }]], ['2028-05-10', []]
  ]) await assert.rejects(change(date, changes), { status: 400 }, date);
}));

async function openAdmin(browser, api, options = {}) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.clock.install({ time: new Date('2028-03-10T03:00:00Z') });
  const errors = [], posts = [], dialogs = [];
  const state = { failMaster: false, holdClass: null, release: null, held: null, acceptDialogs: true, annualDelay: 0, ...options };
  page.on('pageerror', e => errors.push(e.message));
  page.on('dialog', async dialog => {
    dialogs.push(dialog.message());
    if (state.acceptDialogs) await dialog.accept(); else await dialog.dismiss();
  });
  const base = 'http://timetable-audit.test';
  await page.route('**/*', async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin !== base) return route.abort();
    if (url.pathname.startsWith('/api/')) {
      const query = Object.fromEntries(url.searchParams);
      const name = url.pathname.split('/').pop();
      try {
        let data = {};
        if (name === 'master-timetable' && request.method() === 'POST') {
          const body = request.postDataJSON();
          posts.push(body);
          data = await api.save({ body });
        } else if (name === 'master-timetable') {
          if (state.failMaster) return route.fulfill({ status: 503, json: { message: '검증용 조회 실패' } });
          data = await api.master({ query });
          if (state.holdClass === query.classNumber) {
            state.held?.();
            await new Promise(resolve => { state.release = resolve; });
          }
        } else if (name === 'school-timetable') data = await api.overview({ query });
        else if (name === 'class-day-timetable') data = await api.day({ body: request.postDataJSON() });
        else if (name === 'annual-timetable-34weeks') {
          data = await api.annual({ query });
          const delay = state.annualDelay;
          state.annualDelay = 0;
          if (delay) await new Promise(resolve => setTimeout(resolve, delay));
        } else if (name === 'curriculum-access') data = { canEdit: true };
        else if (name === 'curriculum-hours-summary') data = { totals: [{ grade: 3, totalWeeklyHours: 26.5, totalAnnualHours: 986 }] };
        else if (name === 'curriculum-hours') data = { hours: [], previousYear: null };
        else if (name === 'weekly-period-allocation') {
          const rows = await api.db.query('SELECT grade, day_of_week, period_count FROM school_weekly_period_allocation');
          data = { allocations: rows.rows };
        } else if (name === 'bell-schedule') data = { schedules: [] };
        else if (name === 'vacation-settings') data = { settings: state.vacation || {} };
        else if (name === 'annual-schedules') data = { schedules: [] };
        else if (name === 'public-holidays') data = { holidays: query.year === '2028' ? [{ date: '2028-03-01', localName: '삼일절' }] : [], all: [] };
        return route.fulfill({ json: data });
      } catch (error) {
        return route.fulfill({ status: error.status || 500, json: { message: error.message } });
      }
    }
    const file = url.pathname === '/schooladmin/' ? 'index.html' : url.pathname.split('/').pop();
    if (!['index.html', 'app.js', 'style.css', 'textbooks.js'].includes(file)) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ body: await readFile(new URL(`../apps/schooladmin/${file}`, import.meta.url)),
      contentType: file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html' });
  });
  await page.goto(`${base}/schooladmin/`);
  await page.locator('[data-tab="timetable"]:not([disabled])').waitFor();
  return { page, errors, posts, dialogs, state };
}

const cellAt = (page, day, period) => page.locator(`#timetableMatrixBody [data-day="${day}"][data-period="${period}"]`);
async function openGrade3(page) {
  await page.locator('[data-tab="timetable"]').click();
  await page.locator('#timetableGradeSelect').selectOption('3');
  await cellAt(page, 1, 1).getByText('국어', { exact: true }).waitFor();
}

function withBrowser(run) {
  return withSchool(async api => {
    const browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
    try { await run(browser, api); } finally { await browser.close(); }
  });
}

test('browser: a grade whose national weekly hours end in .5 can be opened, and its audit is reachable', () => withBrowser(async (browser, api) => {
  const { page, errors } = await openAdmin(browser, api);
  await openGrade3(page);
  assert.equal(await page.locator('#timetableLockedBanner').isVisible(), false);
  assert.match(await page.locator('#timetableHoursAuditBar').innerText(), /국어: 1\//);
  assert.deepEqual(errors, []);
}));

test('browser: a slow answer for the previous class cannot replace the grid or be saved into the new class', () => withBrowser(async (browser, api) => {
  const { page, posts, state, errors } = await openAdmin(browser, api);
  await openGrade3(page);
  state.holdClass = '2';
  const held = new Promise(resolve => { state.held = resolve; });
  await page.locator('#timetableClassSelect').selectOption('2');
  await held;
  state.holdClass = null;
  await page.locator('#timetableClassSelect').selectOption('3');
  await cellAt(page, 1, 1).getByText('과학', { exact: true }).waitFor();
  const late = page.waitForResponse(r => r.url().includes('classNumber=2'));
  state.release();
  await late;
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  assert.match(await cellAt(page, 1, 1).innerText(), /과학/);
  await page.locator('#saveTimetableBtn').click();
  await page.waitForFunction(() => true);
  await assert.doesNotReject(async () => { for (let i = 0; i < 50 && !posts.length; i++) await page.waitForTimeout(20); });
  assert.equal(String(posts[0].classNumber), '3');
  assert.equal(posts[0].cells.find(c => c.dayOfWeek === 1 && c.period === 1).subjectName, '과학');
  assert.deepEqual(errors, []);
}));

test('browser: when a class cannot be loaded the grid is closed, so saving cannot blank the class', () => withBrowser(async (browser, api) => {
  const { page, posts, state } = await openAdmin(browser, api);
  await openGrade3(page);
  state.failMaster = true;
  await page.locator('#timetableClassSelect').selectOption('2');
  await page.getByText(/검증용 조회 실패/).waitFor();
  assert.equal(await page.locator('#saveTimetableBtn').isVisible(), false);
  assert.deepEqual(posts, []);
}));

test('browser: unsaved edits survive a cancelled class change and a tab visit; clicking the same subject erases it', () => withBrowser(async (browser, api) => {
  const { page, state, dialogs } = await openAdmin(browser, api);
  await openGrade3(page);
  await page.locator('#subjectPalette .palette-chip', { hasText: '수학' }).click();
  await cellAt(page, 1, 2).click();
  await cellAt(page, 1, 2).getByText('수학', { exact: true }).waitFor();
  state.acceptDialogs = false;
  await page.locator('#timetableClassSelect').selectOption('2');
  await page.waitForFunction(() => document.querySelector('#timetableClassSelect').value === '1');
  assert.equal(dialogs.length, 1);
  await cellAt(page, 1, 2).getByText('수학', { exact: true }).waitFor();
  await page.locator('[data-tab="schoolTimetable"]').click();
  await page.locator('#schoolTimetableBody .school-lesson').first().waitFor();
  await page.locator('[data-tab="timetable"]').click();
  await cellAt(page, 1, 2).getByText('수학', { exact: true }).waitFor();
  await cellAt(page, 1, 2).click();
  await page.waitForFunction(() => !document.querySelector('#timetableMatrixBody [data-day="1"][data-period="2"]').textContent.includes('수학'));
}));

test('browser: a lesson beyond the daily allocation can be removed and every registered class can be chosen', () => withBrowser(async (browser, api) => {
  await api.db.exec(`INSERT INTO school_master_timetable (school_id, academic_year, grade, class_number, day_of_week, period, subject_name)
    VALUES (1, 2028, 3, 1, 1, 7, '체육')`);
  const { page } = await openAdmin(browser, api);
  await openGrade3(page);
  await cellAt(page, 1, 7).click();
  await page.waitForFunction(() => !document.querySelector('#timetableMatrixBody [data-day="1"][data-period="7"]').textContent.includes('체육'));
  await page.locator('#timetableGradeSelect').selectOption('5');
  await page.waitForFunction(() => [...document.querySelector('#timetableClassSelect').options].some(o => o.value === '7'));
  await page.locator('[data-tab="annualTimetable"]').click();
  await page.waitForFunction(() => [...document.querySelector('#annualTimetableClassSelect').options].some(o => o.value === '7'));
}));

test('browser: a cell in the daily table can be changed for one date, the whole day at once, and set back', () => withBrowser(async (browser, api) => {
  const cells = [];
  for (let day = 1; day <= 5; day++) for (let period = 1; period <= 4; period++) cells.push(at(day, period, '국어'));
  await api.save({ body: { academicYear: year, grade: 3, classNumber: 1, cells } });
  const { page, errors } = await openAdmin(browser, api);
  await page.locator('[data-tab="annualTimetable"]').click();
  await page.locator('#annualTimetableGradeSelect').selectOption('3');
  const cell = (date, period) => page.locator(`.annual-cell-btn[data-date="${date}"][data-period="${period}"]`);
  await cell('2028-05-09', 2).waitFor();
  const korean = async () => Number((await page.locator('#annualSubjectTableBody tr', { hasText: '국어' }).first().locator('td').nth(14).innerText()));
  const before = await korean();
  // 하루 전체를 창체(자율)로.
  await cell('2028-05-09', 2).click();
  await page.locator('#annualCellEditorSubject').selectOption('창체(자율)');
  await page.locator('#annualCellEditorWholeDay').check();
  await page.locator('#annualCellEditorSave').click();
  await page.waitForFunction(() => document.querySelector('.annual-cell-btn[data-date="2028-05-09"][data-period="4"]')?.textContent === '자');
  assert.equal(await cell('2028-05-09', 1).innerText(), '자');
  assert.equal(await cell('2028-05-09', 1).getAttribute('data-subject'), '창체(자율)');
  assert.equal(await cell('2028-05-10', 1).innerText(), '국', 'the next day keeps the master timetable');
  assert.equal(await korean(), before - 4);
  assert.match(await cell('2028-05-09', 1).evaluate(b => b.parentElement.className), /annual-changed/);
  assert.equal(await cell('2028-05-09', 1).evaluate(b => b.parentElement.title), '창체(자율) · 기초시간표: 국어');
  assert.equal(await cell('2028-05-10', 1).evaluate(b => b.parentElement.title), '국어');
  const activity = page.locator('#annualSubjectTableBody tr', { hasText: '창체(자율)' });
  assert.equal(await activity.locator('td').nth(14).innerText(), '4');
  // 한 칸만 기초시간표대로 되돌린다.
  await cell('2028-05-09', 3).click();
  await page.locator('#annualCellEditorSubject').selectOption('__base__');
  await page.locator('#annualCellEditorSave').click();
  await page.waitForFunction(() => document.querySelector('.annual-cell-btn[data-date="2028-05-09"][data-period="3"]')?.textContent === '국');
  assert.equal(await korean(), before - 3);
  assert.equal(await page.locator('#annualCellEditor').isVisible(), false);
  assert.deepEqual(errors, []);
}));

test('browser: the annual table covers the real school year, removes days off and does not double its rows', () => withBrowser(async (browser, api) => {
  const cells = [];
  for (let day = 1; day <= 5; day++) for (let period = 1; period <= 4; period++) cells.push(at(day, period, '국어'));
  await api.save({ body: { academicYear: year, grade: 3, classNumber: 1, cells } });
  // 2028-05-08 is a Monday. The first listed event is ordinary; the second closes the school.
  await api.db.exec(`INSERT INTO school_annual_schedules (school_id, academic_year, event_date, title, category) VALUES
    (1, 2028, '2028-05-08', '학부모 상담', 'EVENT'), (1, 2028, '2028-05-08', '재량휴업', 'DISCRETIONARY')`);
  const { page, state, errors } = await openAdmin(browser, api, { annualDelay: 400, vacation: {
    is_integrated: false, summer_start: '2028-07-24', summer_end: '2028-08-18',
    winter_start: '2029-01-08', winter_end: '2029-02-04', spring_start: '2029-02-17', spring_end: '2029-02-25'
  } });
  await page.route('**/api/school-admin/annual-schedules*', async route => {
    const rows = await api.db.query(`SELECT event_date::TEXT AS event_date, title, category, target_scope, target_grades FROM school_annual_schedules`);
    return route.fulfill({ json: { schedules: rows.rows } });
  });
  await page.locator('[data-tab="annualTimetable"]').click();
  await page.locator('#annualTimetableGradeSelect').selectOption('3');
  await page.waitForFunction(() => document.querySelectorAll('#annualTimetableTableBody tr').length > 20);
  await page.waitForTimeout(700);
  const rows = await page.locator('#annualTimetableTableBody tr').evaluateAll(trs => trs.map(tr => ({
    week: tr.classList.contains('annual-week-start') ? tr.cells[0].textContent.trim() : null,
    cells: [...tr.cells].map(td => td.textContent.trim()).slice(tr.classList.contains('annual-week-start') ? 1 : 0),
    gap: tr.classList.contains('annual-gap-row')
  })));
  const weeks = rows.filter(r => r.week).map(r => r.week);
  assert.equal(new Set(weeks).size, weeks.length, 'each week appears once');
  const days = rows.filter(r => !r.gap);
  assert.deepEqual(days[0].cells.slice(0, 2), ['3.1', '수'], 'the year starts on March 1 even though the first Monday is March 6');
  assert.deepEqual(days.at(-1).cells.slice(0, 2), ['2.28', '수'], 'the last day is the end of February');
  // 날짜마다 그 요일의 과목이 교시 칸에 들어간다.
  const may9 = days.find(r => r.cells[0] === '5.9');
  assert.deepEqual(may9.cells.slice(2, 9), ['국', '국', '국', '국', '', '', '4'], 'a cell shows one letter');
  const may8 = days.find(r => r.cells[0] === '5.8');
  assert.equal(may8.cells[2], '재량휴업', 'a day off shows why instead of lessons');
  assert.ok(may8.cells.at(-1).includes('학부모 상담'));
  assert.ok(rows.some(r => r.gap && r.cells[0].startsWith('여름방학')), 'a vacation folds into one line');
  const total = days.reduce((sum, r) => sum + (Number(r.cells[2 + 6]) || 0), 0);
  assert.equal(Number((await page.locator('#annualTotalHoursVal').innerText()).replace(/\D/g, '')), total);
  // 교과별 시수: 국어는 수업일마다 4시간, 수학은 편성만 있고 시간표에 없다.
  const subjects = await page.locator('#annualSubjectTableBody tr').evaluateAll(trs => trs.map(tr => [...tr.cells].map(td => td.textContent.trim())));
  const korean = subjects.find(r => r[0] === '국어');
  assert.equal(Number(korean[15]), total);
  assert.equal(korean[16], '204');
  assert.equal(korean[17], String(total - 204 > 0 ? '+' + (total - 204) : total - 204));
  const math = subjects.find(r => r[0] === '수학');
  assert.deepEqual(math.slice(15), ['0', '136', '-136']);
  assert.equal(subjects.at(-1)[0], '계');
  assert.ok(!(await page.locator('#annualTimetableTableFoot').innerText()).includes('DB 실제 데이터 정산 충족'));
  assert.equal(state.annualDelay, 0);
  assert.deepEqual(errors, []);
}));
