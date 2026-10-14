import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { PGlite } from '@electric-sql/pglite';

const require = createRequire(import.meta.url);
const names = require('./roster-names.js');
const source = await readFile(new URL('./classroom-platform.js', import.meta.url), 'utf8');
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
let GROUP_VISIBLE_SQL = 'TRUE';
try { ({ GROUP_VISIBLE_SQL } = require('./teacher-group-visibility.js')); } catch (e) { if (e.code !== 'MODULE_NOT_FOUND') throw e; }
class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
function declaration(name) {
  const start = source.indexOf(`  async function ${name}(`);
  assert.ok(start >= 0, name);
  return source.slice(start, source.indexOf('\n  }', start) + 4);
}
function route(method, path, bindings) {
  const start = source.indexOf(`router.${method}("${path}"`);
  assert.ok(start >= 0, path);
  const body = source.slice(source.indexOf('=> {', start) + 4, source.indexOf('\n  }));', start));
  const fn = new AsyncFunction('req', 'res', ...Object.keys(bindings), body);
  return async (req = {}) => {
    let value;
    await fn({ query: {}, body: {}, params: {}, ...req }, { json(result) { value = result; } }, ...Object.values(bindings));
    return value;
  };
}

async function withSchool(run) {
  const db = new PGlite();
  const year = new Date().getFullYear();
  try {
    await db.exec(`
      CREATE TABLE classroom_schools (id BIGINT PRIMARY KEY, name TEXT, enabled BOOLEAN, school_code TEXT, office_code TEXT, location_name TEXT);
      CREATE TABLE classroom_users (id BIGINT PRIMARY KEY, email TEXT, display_name TEXT);
      CREATE TABLE classroom_teachers (
        id BIGSERIAL PRIMARY KEY, school_id BIGINT, user_id BIGINT UNIQUE, google_email TEXT,
        teacher_name TEXT, teacher_type TEXT, academic_year INTEGER, grade INTEGER, class_number INTEGER,
        subject_name TEXT, room_name TEXT, active BOOLEAN DEFAULT TRUE, updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE classroom_classes (
        id BIGSERIAL PRIMARY KEY, school_id BIGINT, teacher_user_id BIGINT UNIQUE,
        academic_year INTEGER, grade INTEGER, class_number INTEGER, teacher_name TEXT, join_code TEXT UNIQUE,
        updated_at TIMESTAMPTZ DEFAULT NOW(), UNIQUE (school_id, academic_year, grade, class_number)
      );
      CREATE TABLE school_students (
        id BIGSERIAL PRIMARY KEY, school_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER,
        student_number TEXT, roster_name TEXT, name_source TEXT, gender TEXT, avatar_key TEXT,
        student_email TEXT, guardian1_email TEXT, guardian2_email TEXT, user_id BIGINT,
        custom_fields JSONB DEFAULT '{}'::jsonb
      );
      CREATE TABLE classroom_students (
        id BIGSERIAL PRIMARY KEY, class_id BIGINT REFERENCES classroom_classes(id), student_number TEXT,
        roster_name TEXT, name_source TEXT, gender TEXT, avatar_key TEXT, student_email TEXT,
        guardian1_email TEXT, guardian2_email TEXT, user_id BIGINT, birthday_mmdd TEXT, birthday_visible BOOLEAN,
        roster_active BOOLEAN NOT NULL DEFAULT TRUE
      );
      CREATE TABLE teacher_groups (
        id BIGSERIAL PRIMARY KEY, school_id BIGINT, teacher_user_id BIGINT, academic_year INTEGER,
        group_name TEXT, group_type TEXT, grade INTEGER, class_number INTEGER, sort_order INTEGER DEFAULT 0,
        auto_homeroom BOOLEAN DEFAULT FALSE, updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE teacher_group_students (group_id BIGINT REFERENCES teacher_groups(id) ON DELETE CASCADE, student_id BIGINT);
      CREATE TABLE school_master_timetable (school_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER, teacher_user_id BIGINT, subject_name TEXT);
      CREATE TABLE preserved_class_posts (class_id BIGINT REFERENCES classroom_classes(id), body TEXT);
      INSERT INTO classroom_schools VALUES (1, '이전학교', FALSE, 'OLD', '', ''), (2, '현재학교', TRUE, 'NEW', '', '');
      INSERT INTO classroom_users VALUES (10, 'teacher@example.invalid', '검증교사');
      INSERT INTO classroom_teachers (school_id, user_id, google_email, teacher_name, teacher_type, academic_year, grade, class_number)
        VALUES (1, 10, 'teacher@example.invalid', '이전교사', '담임', ${year - 1}, 4, 1),
               (2, NULL, 'teacher@example.invalid', '현재교사', '담임', ${year}, 6, 3);
      INSERT INTO classroom_classes (school_id, teacher_user_id, academic_year, grade, class_number, teacher_name, join_code)
        VALUES (1, 10, ${year - 1}, 4, 1, '이전교사', 'OLD1'),
               (2, NULL, ${year}, 6, 3, '현재교사', 'NEW1'),
               (2, NULL, ${year - 1}, 6, 3, '지난해', 'OLD2'),
               (2, NULL, ${year}, 6, 4, '지운반', 'OLD3');
      INSERT INTO school_students (school_id, academic_year, grade, class_number, student_number, roster_name, gender)
        VALUES (2, ${year}, 6, 3, '1', '가학생', '남'), (2, ${year}, 6, 4, '1', '나학생', '여');
      INSERT INTO classroom_students (class_id, student_number, roster_name) VALUES (2, '1', '옛이름'), (4, '1', '옛학생');
      INSERT INTO preserved_class_posts VALUES (1, '지난 기록'), (4, '남길 기록');
      INSERT INTO teacher_groups (school_id, teacher_user_id, academic_year, group_name, group_type, grade, class_number, auto_homeroom)
        VALUES (1, 10, ${year}, '4-1', 'homeroom', 4, 1, FALSE),
               (2, 10, ${year}, '6-4', 'homeroom', 6, 4, FALSE),
               (2, 10, ${year - 1}, '6-3', 'homeroom', 6, 3, TRUE);
      INSERT INTO school_master_timetable VALUES (2, ${year - 1}, 6, 3, 10, '과학');
    `);
    // Execute the actual new migration, if present, rather than duplicating its schema.
    const dismissalSchema = source.match(/`CREATE TABLE IF NOT EXISTS teacher_group_dismissals[\s\S]*?`/);
    if (dismissalSchema) await db.exec(dismissalSchema[0].slice(1, -1));
    const query = async (sql, params) => {
      const r = await db.query(sql, params);
      return { rows: r.rows, rowCount: r.rows.length || r.affectedRows || 0 };
    };
    const pool = { query, connect: async () => ({ query, release() {} }) };
    const user = { id: 10, email: 'teacher@example.invalid', role: 'teacher' };
    let nextCode = 0;
    const bindings = {
      pool, databaseReady: true, HttpError, GROUP_VISIBLE_SQL,
      normalizeEmail: value => String(value || '').toLowerCase().trim(),
      makeJoinCode: () => `TEST${++nextCode}`, requireUser: async () => user,
      normalizeAvatarKey: value => value || '', avatarUrl: () => '',
      readRosterColumns: async () => [], ...names,
      avatarCapacity: () => 10, pickRandomAvailableAvatar: () => 'test.webp'
    };
    const functions = ['teacherRegistrations', 'teacherRegistration', 'requireTeacher', 'userClassId', 'rosterGroupName'];
    Object.assign(bindings, new Function(...Object.keys(bindings),
      `${functions.map(declaration).join('\n')}\nreturn { ${functions.join(',')} };`)(...Object.values(bindings)));
    const api = {
      profile: route('get', '/teacher/profile', bindings),
      classes: route('get', '/teacher/available-classes', bindings),
      classroom: route('get', '/teacher/class', bindings),
      groups: route('get', '/teacher/groups', bindings),
      deleteGroup: route('delete', '/teacher/groups/:groupId', bindings),
      createGroup: route('post', '/teacher/groups', bindings),
      saveStudents: route('put', '/school/students', bindings)
    };
    await run({ db, api, year, user, bindings });
  } finally { await db.close(); }
}

test('disabled old registration does not replace the active profile, class or current-year class options', () => withSchool(async ({ api, year, db }) => {
  assert.equal((await api.profile()).profile.schoolName, '현재학교');
  const classroom = (await api.classroom()).classroom;
  assert.equal(classroom.schoolName, '현재학교');
  assert.equal(classroom.grade, 6);
  assert.equal(classroom.academicYear, year);
  assert.deepEqual((await api.classes()).classes.map(c => Number(c.id)), [2, 4]);
  assert.equal((await db.query('SELECT teacher_user_id FROM classroom_classes WHERE id = 1')).rows[0].teacher_user_id, null);
  assert.equal((await db.query('SELECT COUNT(*)::int AS n FROM preserved_class_posts')).rows[0].n, 2);
}));

test('clearing homeroom stops old ownership and arbitrary fallback; old class URLs cannot reopen it', () => withSchool(async ({ api, db }) => {
  await db.exec("UPDATE classroom_teachers SET grade = NULL, class_number = NULL, teacher_type = '전담' WHERE school_id = 2");
  await db.exec('DELETE FROM school_students WHERE class_number = 4');
  assert.equal((await api.classroom()).classroom, null);
  assert.deepEqual((await api.classes()).classes, []);
  await assert.rejects(api.classroom({ query: { classId: 4 } }), e => e.status === 404);
}));

test('imported class cards disappear when source roster is removed; other schools and stale automatic cards stay out', () => withSchool(async ({ api, db, year }) => {
  let groups = (await api.groups({ query: { year } })).groups;
  assert.deepEqual(groups.map(g => g.group_name).sort(), ['6-3', '6-4']);
  await db.exec('DELETE FROM school_students WHERE school_id = 2 AND class_number = 4');
  groups = (await api.groups({ query: { year } })).groups;
  assert.deepEqual(groups.map(g => g.group_name), ['6-3']);
  await db.exec('UPDATE classroom_teachers SET class_number = 2 WHERE school_id = 2');
  assert.deepEqual((await api.groups({ query: { year } })).groups.map(g => g.group_name), ['6-2']);
}));

test('deleting an automatically created card stays deleted on repeated loads and can be explicitly imported again', () => withSchool(async ({ api, year }) => {
  const own = (await api.groups({ query: { year } })).groups.find(g => g.group_name === '6-3');
  await api.deleteGroup({ params: { groupId: own.id } });
  for (let i = 0; i < 2; i++) assert.ok(!(await api.groups({ query: { year } })).groups.some(g => g.group_name === '6-3'));
  await api.createGroup({ body: { year, groupName: '6-3', groupType: 'homeroom', grade: 6, classNumber: 3 } });
  assert.ok((await api.groups({ query: { year } })).groups.some(g => g.group_name === '6-3'));
}));

test('opening another year does not create a current homeroom group in that year', () => withSchool(async ({ api, year, db }) => {
  await api.groups({ query: { year: year + 1 } });
  assert.equal((await db.query('SELECT COUNT(*)::int AS n FROM teacher_groups WHERE academic_year = $1', [year + 1])).rows[0].n, 0);
}));

test('restarting legacy initialization cannot refill an intentionally cleared homeroom from old class data', () => withSchool(async ({ db }) => {
  await db.exec('UPDATE classroom_teachers SET grade = NULL, class_number = NULL WHERE user_id = 10');
  const backfill = source.match(/`UPDATE classroom_teachers t\s+SET academic_year = c\.academic_year[\s\S]*?`/);
  if (backfill) { await db.exec(backfill[0].slice(1, -1)); await db.exec(backfill[0].slice(1, -1)); }
  const row = (await db.query('SELECT grade, class_number FROM classroom_teachers WHERE user_id = 10')).rows[0];
  assert.deepEqual(row, { grade: null, class_number: null });
}));

test('saving an empty school roster hides old student copies while preserving their rows and class history', () => withSchool(async ({ api, db, year }) => {
  await db.exec("UPDATE classroom_teachers SET teacher_type = '관리자' WHERE school_id = 2");
  await api.saveStudents({ body: { year, students: [] } });
  assert.equal((await db.query('SELECT COUNT(*)::int AS n FROM classroom_students WHERE roster_active')).rows[0].n, 0);
  assert.equal((await db.query('SELECT COUNT(*)::int AS n FROM classroom_students')).rows[0].n, 2);
  assert.deepEqual((await api.classroom()).classroom.students, []);
  assert.equal((await db.query('SELECT COUNT(*)::int AS n FROM preserved_class_posts')).rows[0].n, 2);
}));

test('real portal clears removed cards and saved selection; dashboard state clears the previous class and schedules', () => withSchool(async ({ api, db }) => {
  const { chromium } = require('playwright');
  const browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
  const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin !== 'http://lifecycle.test') return route.abort();
    const req = { query: Object.fromEntries(url.searchParams) };
    const routes = {
      '/api/auth/me': async () => ({ signedIn: true, isTeacher: true, user: { role: 'teacher' } }),
      '/api/teacher/profile': api.profile,
      '/api/teacher/class': api.classroom,
      '/api/teacher/groups': api.groups
    };
    if (routes[url.pathname]) return route.fulfill({ json: await routes[url.pathname](req) });
    if (url.pathname === '/classtools/') return route.fulfill({ contentType: 'text/html', body: await readFile(new URL('../apps/classtools/index.html', import.meta.url), 'utf8') });
    if (url.pathname === '/assets/device-game.css') return route.fulfill({ contentType: 'text/css', body: await readFile(new URL('../assets/device-game.css', import.meta.url), 'utf8') });
    return route.fulfill({ status: 404 });
  });
  try {
    await page.goto('http://lifecycle.test/classtools/');
    await page.locator('.group-card').first().waitFor();
    assert.deepEqual((await page.locator('.group-card .tool-name').allTextContents()).sort(), ['6학년 3반', '6학년 4반']);
    await page.evaluate(() => sessionStorage.setItem('active_group_id', '2'));
    await db.exec('DELETE FROM school_students WHERE school_id = 2 AND class_number = 4');
    await page.reload();
    await page.locator('.group-card').first().waitFor();
    assert.deepEqual(await page.locator('.group-card .tool-name').allTextContents(), ['6학년 3반']);
    assert.equal(await page.evaluate(() => sessionStorage.getItem('active_group_id')), null);
    const output = new URL('../outputs/classroom-lifecycle-2026-10-07/', import.meta.url);
    await mkdir(output, { recursive: true });
    await page.screenshot({ path: fileURLToPath(new URL('portal-after.png', output)) });

    // Exercise the actual dashboard loader against its real DOM, without unrelated weather/audio startup.
    const dashboard = await readFile(new URL('../apps/classtools/dashboard.html', import.meta.url), 'utf8');
    await page.setContent(dashboard.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ''));
    const rosterLoader = dashboard.slice(dashboard.indexOf('async function fetchRosterAndRenderChecklist('), dashboard.indexOf('const classSwitcherSelectEl'));
    const scheduleLoader = dashboard.slice(dashboard.indexOf('async function loadSchedules('), dashboard.indexOf('// 예전에 브라우저에 두던 일정을 서버로 옮긴다.'));
    await page.evaluate(({ rosterLoader, scheduleLoader }) => {
      window.loadFixture = new Function('data', `
        let rosterLoadVersion = 0, scheduleLoadVersion = 0;
        let rosterStudents = ['old'], activeRosterClass = { id: 99 }, activeScheduleClassId = 99, canEditSchedules = true;
        let rosterLoadMessage = '', schedules = ['old'], schoolSchedules = ['old'], schedulesLoading = false, scheduleLoadErrors = [];
        const calls = [];
        const noop = () => {};
        const fetchRealtimeWeatherAndAirQuality = noop, loadMeals = noop, loadTodayEvents = noop,
          fetchQuickAlertsForDashboard = noop, loadCalendarData = noop, renderSchedules = noop, renderCalendar = noop;
        const attendanceLive = { selectClass: noop }, scheduleEditor = { hidden: false };
        const fetch = async url => ({ ok: true, json: async () => url.includes('available-classes') ? data.available : data.classData });
        const scheduleApi = async url => { calls.push(url); return { classId: 99, schedules: ['wrong'] }; };
        const loadUpcomingSchoolSchedules = async () => ({ items: [], errors: [] });
        const migrateLocalSchedules = noop;
        ${scheduleLoader}
        ${rosterLoader}
        return fetchRosterAndRenderChecklist().then(() => ({ activeRosterClass, activeScheduleClassId, canEditSchedules, schedules, calls }));
      `);
    }, { rosterLoader, scheduleLoader });
    await page.locator('#classSwitcherSelect').evaluate(select => { select.innerHTML = '<option value="99">옛 학급</option>'; select.hidden = false; });
    const state = await page.evaluate(() => window.loadFixture({ available: { classes: [] }, classData: { classroom: null } }));
    assert.equal(state.activeRosterClass, null);
    assert.equal(state.activeScheduleClassId, null);
    assert.equal(state.canEditSchedules, false);
    assert.deepEqual(state.schedules, []);
    assert.deepEqual(state.calls, []);
    assert.equal(await page.locator('#classSwitcherSelect option').count(), 0);
    assert.ok(await page.locator('#classSwitcherSelect').isHidden());
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
}));
