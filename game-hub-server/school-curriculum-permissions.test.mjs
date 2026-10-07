import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createRequire } from 'node:module';
import { PGlite } from '@electric-sql/pglite';

const require = createRequire(import.meta.url);
const express = require('express');
const { chromium } = require('playwright');
const { normalizePairs } = require('./teaching-scope.js');
const baseline = process.env.CURRICULUM_BASELINE === '1';
const root = fileURLToPath(new URL('../', import.meta.url));
const readSource = path => baseline
  ? Promise.resolve(execFileSync('git', ['show', `HEAD:${path}`], { cwd: root, encoding: 'utf8', maxBuffer: 4000000 }))
  : readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const source = await readSource('game-hub-server/classroom-platform.js');
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
const tables = ['school_special_rooms', 'school_annual_schedules', 'school_general_events',
  'school_vacation_settings', 'school_public_holidays_cache', 'school_curriculum_hours',
  'school_bell_schedule', 'school_weekly_period_allocation', 'school_master_timetable'];
const reads = [
  ['annual-schedules', { academicYear: '2026' }], ['curriculum-access', {}],
  ['public-holidays', { year: '2026' }], ['curriculum-hours', { academicYear: '2026', grade: '5' }],
  ['curriculum-hours-summary', { academicYear: '2026' }], ['bell-schedule', { academicYear: '2026' }],
  ['weekly-period-allocation', { academicYear: '2026' }],
  ['master-timetable', { academicYear: '2026', grade: '5', classNumber: '1' }],
  ['specialist-teachers', {}], ['specialist-timetable', { academicYear: '2026', teacherUserId: '102' }],
  ['room-timetable', { academicYear: '2026', room: '검증음악실' }], ['rooms', {}],
  ['vacation-settings', { academicYear: '2026' }],
  ['annual-timetable-34weeks', { academicYear: '2026', grade: '5', classNumber: '1' }]
];
const writes = [
  ['post', 'annual-schedules'], ['delete', 'annual-schedules/:scheduleId'],
  ['post', 'public-holidays'], ['post', 'public-holidays/refresh'], ['delete', 'public-holidays/:holidayId'],
  ['post', 'curriculum-hours'], ['post', 'bell-schedule'], ['post', 'weekly-period-allocation'],
  ['post', 'master-timetable'], ['put', 'specialist-timetable'], ['put', 'room-timetable'], ['post', 'vacation-settings']
];

function actualFunction(name) {
  const start = source.search(new RegExp(`  (?:async )?function ${name}\\(`));
  if (baseline && name === 'requireSchoolCurriculum' && start < 0) return '';
  assert.ok(start >= 0, name);
  return source.slice(start, source.indexOf('\n  }', start) + 4);
}
async function withSchool(run) {
  const db = new PGlite();
  let server, browser;
  try {
    await db.exec(`
      CREATE TABLE classroom_schools (id BIGINT PRIMARY KEY, name TEXT, enabled BOOLEAN DEFAULT TRUE);
      CREATE TABLE classroom_users (id BIGINT PRIMARY KEY, email TEXT, display_name TEXT, role TEXT DEFAULT 'teacher');
      CREATE TABLE classroom_teachers (
        id BIGSERIAL PRIMARY KEY, school_id BIGINT, teacher_name TEXT, google_email TEXT, user_id BIGINT,
        teacher_type TEXT, active BOOLEAN DEFAULT TRUE, academic_year INTEGER, grade INTEGER, class_number INTEGER,
        subject_name TEXT, room_name TEXT, teaching_scope JSONB, name_source TEXT
      );
      INSERT INTO classroom_schools VALUES (1, '검증학교', TRUE), (2, '타교학교', TRUE);
      INSERT INTO classroom_users (id, email, display_name, role) VALUES
        (101, 'admin@example.invalid', '검증관리자', 'teacher'), (102, 'teacher@example.invalid', '검증교사', 'teacher'),
        (201, 'otheradmin@example.invalid', '타교관리자', 'teacher'), (202, 'other@example.invalid', '타교교사', 'teacher'),
        (301, 'student@example.invalid', '검증학생', 'student'), (302, 'parent@example.invalid', '검증보호자', 'guardian');
      INSERT INTO classroom_teachers (school_id, teacher_name, google_email, user_id, teacher_type, academic_year, grade, class_number)
        VALUES (1, '검증관리자', 'admin@example.invalid', 101, '관리자', 2026, NULL, NULL),
        (1, '검증교사', 'teacher@example.invalid', 102, '담임', 2026, 5, 1),
        (2, '타교관리자', 'otheradmin@example.invalid', 201, '관리자', 2026, NULL, NULL),
        (2, '타교교사', 'other@example.invalid', 202, '담임', 2026, 5, 1);
    `);
    for (const table of tables) {
      const start = source.indexOf(`CREATE TABLE IF NOT EXISTS ${table} (`);
      assert.ok(start >= 0, table);
      await db.exec(source.slice(start, source.indexOf('`', start)));
    }
    // Apply the production schema's additions, not a hand-maintained substitute.
    for (const match of source.matchAll(/`(ALTER TABLE (school_\w+)[\s\S]*?)`/g)) {
      if (tables.includes(match[2])) await db.exec(match[1]);
    }
    for (const school of [1, 2]) {
      const label = school === 1 ? '검증' : '타교';
      await db.exec(`
        INSERT INTO school_special_rooms (school_id, room_name) VALUES (${school}, '${label}음악실');
        INSERT INTO school_annual_schedules (school_id, academic_year, event_date, title, category, target_scope)
          VALUES (${school}, 2026, '2026-03-20', '${label}재량휴업', 'DISCRETIONARY', 'ALL');
        INSERT INTO school_general_events (school_id, event_date, title, organizer_name)
          VALUES (${school}, '2026-03-23', '${label}행사', '${label}교사');
        INSERT INTO school_vacation_settings (school_id, academic_year, summer_start, summer_end, entrance_ceremony_date)
          VALUES (${school}, 2026, '2026-07-20', '2026-08-20', '2026-03-03');
        INSERT INTO school_public_holidays_cache (school_id, year, holiday_date, name, source)
          VALUES (${school}, 2026, '2026-03-01', '${label}공휴일', 'MANUAL');
        INSERT INTO school_curriculum_hours (school_id, academic_year, grade, subject_name, weekly_hours, annual_required_hours)
          VALUES (${school}, 2026, 5, '국어', 1, 38);
        INSERT INTO school_bell_schedule (school_id, academic_year, grade, arrival_start, period_times)
          VALUES (${school}, 2026, 5, '08:40', '{"1":{"start":"09:00","end":"09:40"}}');
        INSERT INTO school_weekly_period_allocation (school_id, academic_year, grade, day_of_week, period_count)
          VALUES (${school}, 2026, 5, 1, 1);
        INSERT INTO school_master_timetable (school_id, academic_year, grade, class_number, day_of_week, period, subject_name, room_name)
          VALUES (${school}, 2026, 5, 1, 1, 1, '${label}국어', '${label}음악실');
      `);
    }
    let mutationCount = 0;
    const query = async (sql, params) => {
      if (/^\s*(INSERT|UPDATE|DELETE|BEGIN)\b/i.test(sql)) mutationCount++;
      const r = await db.query(sql, params);
      return { rows: r.rows, rowCount: r.rows.length || r.affectedRows || 0 };
    };
    const pool = { query };
    const bindings = { pool, databaseReady: true, HttpError, normalizePairs,
      normalizeEmail: value => String(value || '').trim().toLowerCase(),
      sessionUser: async req => req.user, getSiteAccessMode: async () => 'open',
      fetchNagerHolidays: async year => [{ date: `${year}-01-01`, name: '검증신정' }],
      CURRICULUM_CATEGORIES: new Set(['SUBJECT', 'CHANGTAE']) };
    const names = ['requireUser', 'teacherRegistrations', 'teacherRegistration', 'requireTeacher', 'requireSchoolAdmin',
      'requireSchoolCurriculum', 'schoolTimetableTeacher', 'parseCurriculumGrade', 'upsertApiHolidays'];
    Object.assign(bindings, new Function(...Object.keys(bindings), `${names.map(actualFunction).join('\n')}
      return { ${names.filter(n => !baseline || n !== 'requireSchoolCurriculum').join(', ')} };`)(...Object.values(bindings)));
    const routes = new Map();
    for (const match of source.matchAll(/router\.(get|post|put|delete)\("(\/school-admin\/[^"\n]+)"/g)) {
      const start = match.index;
      const body = source.slice(source.indexOf('=> {', start) + 4, source.indexOf('\n  }));', start));
      const fn = new AsyncFunction('req', 'res', ...Object.keys(bindings), body);
      routes.set(`${match[1]} ${match[2]}`, (req, res) => fn(req, res, ...Object.values(bindings)));
    }
    const actor = async id => id == null ? null : (await db.query('SELECT * FROM classroom_users WHERE id=$1', [id])).rows[0];
    const call = async (method, path, id = 102, args = {}) => {
      const fn = routes.get(`${method} /school-admin/${path}`);
      assert.ok(fn, `route ${method} ${path}`);
      let data, status = 200;
      const res = { json(value) { data = value; }, status(value) { status = value; return this; }, set() {} };
      await fn({ user: await actor(id), query: {}, body: {}, params: {}, ...args }, res);
      return { status, data };
    };
    const snapshot = async () => Object.fromEntries(await Promise.all(tables.map(async t => [t, (await db.query(`SELECT * FROM ${t} ORDER BY id`)).rows])));
    const openBrowser = async (id = 102) => {
      const state = { requests: [], errors: [], dialogs: [], actorId: id };
      const app = express();
      app.use(express.json());
      app.use('/api', async (req, res, next) => { req.user = await actor(state.actorId); state.requests.push({ method: req.method, path: req.path, query: req.query }); next(); });
      for (const [key, fn] of routes) {
        const [method, path] = key.split(' ');
        app[method](`/api${path}`, (req, res, next) => Promise.resolve(fn(req, res)).catch(next));
      }
      for (const file of ['index.html', 'app.js', 'style.css']) app.get(file === 'index.html' ? '/schooladmin/' : `/schooladmin/${file}`,
        async (_req, res) => res.type(file.endsWith('.js') ? 'js' : file.endsWith('.css') ? 'css' : 'html').send(await readSource(`schooladmin/${file}`)));
      app.use((error, _req, res, _next) => res.status(error.status || 500).json({ message: error.message, code: error.code }));
      server = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
      browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
      const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
      await page.clock.install({ time: new Date('2026-10-07T03:00:00Z') });
      await page.route('https://fonts.**/*', route => route.abort());
      page.on('pageerror', e => state.errors.push(e.message));
      page.on('dialog', async d => { state.dialogs.push(d.message()); await d.accept(); });
      await page.goto(`http://127.0.0.1:${server.address().port}/schooladmin/`);
      return { page, state };
    };
    await run({ db, call, snapshot, openBrowser, mutationCount: () => mutationCount });
  } finally {
    await browser?.close();
    if (server) await new Promise(resolve => server.close(resolve));
    await db.close();
  }
}

test('ordinary teachers read every curriculum endpoint within their own school without changing data', () => withSchool(async ({ call, snapshot, mutationCount }) => {
  const before = await snapshot();
  for (const [path, query] of reads) {
    const result = await call('get', path, 102, { query: { ...query, schoolId: '2' } });
    assert.equal(result.status, 200, path);
    assert.ok(!JSON.stringify(result.data).includes('타교'), path);
  }
  assert.equal((await call('get', 'curriculum-access')).data.canEdit, false);
  assert.equal((await call('get', 'annual-schedules', 102, { query: { academicYear: '2026' } })).data.schedules[0].title, '검증재량휴업');
  assert.equal(mutationCount(), 0);
  assert.deepEqual(await snapshot(), before);
  await assert.rejects(call('get', 'specialist-timetable', 102, { query: { academicYear: '2026', teacherUserId: '202' } }), { status: 400, code: 'INVALID_TEACHER' });
}));

test('ordinary teachers cannot write any curriculum endpoint or read administrator-only attendance and student APIs', () => withSchool(async ({ db, call, snapshot, mutationCount }) => {
  await db.exec("UPDATE classroom_users SET role='admin' WHERE id=102");
  const before = await snapshot();
  for (const [method, path] of writes) await assert.rejects(call(method, path, 102, { body: { canEdit: true, schoolId: 2 }, params: { scheduleId: 1, holidayId: 1 } }), { status: 403, code: 'SCHOOL_ADMIN_REQUIRED' });
  for (const path of ['dashboard', 'students']) await assert.rejects(call('get', path), { status: 403, code: 'SCHOOL_ADMIN_REQUIRED' });
  assert.deepEqual(await snapshot(), before);
  assert.equal(mutationCount(), 0);
}));

test('unauthenticated, unregistered, inactive and disabled-school accounts cannot read curriculum', () => withSchool(async ({ db, call }) => {
  for (const id of [null, 301, 302]) for (const [path, query] of reads)
    await assert.rejects(call('get', path, id, { query }), { status: id === null ? 401 : 403 });
  await db.exec('UPDATE classroom_teachers SET active=FALSE WHERE user_id=102');
  for (const [path, query] of reads) await assert.rejects(call('get', path, 102, { query }), { status: 403 });
  await db.exec('UPDATE classroom_teachers SET active=TRUE WHERE user_id=102; UPDATE classroom_schools SET enabled=FALSE WHERE id=1');
  for (const [path, query] of reads) await assert.rejects(call('get', path, 102, { query }), { status: 403 });
}));

test('school administrator, principal and vice principal retain saving, and teachers immediately see their saved values', () => withSchool(async ({ db, call, snapshot }) => {
  const otherBefore = Object.fromEntries(Object.entries(await snapshot()).map(([t, rows]) => [t, rows.filter(r => Number(r.school_id) === 2)]));
  for (const [i, role] of ['관리자', '교장', '교감'].entries()) {
    await db.query('UPDATE classroom_teachers SET teacher_type=$1 WHERE user_id=101', [role]);
    assert.equal((await call('get', 'curriculum-access', 101)).data.canEdit, true);
    await call('post', 'curriculum-hours', 101, { body: { academicYear: 2026, grade: 5, hours: [{ subjectName: '국어', weeklyHours: i + 2, annualRequiredHours: 76, category: 'SUBJECT' }] } });
    assert.equal(Number((await call('get', 'curriculum-hours', 102, { query: { academicYear: '2026', grade: '5' } })).data.hours[0].weekly_hours), i + 2);
  }
  const otherAfter = Object.fromEntries(Object.entries(await snapshot()).map(([t, rows]) => [t, rows.filter(r => Number(r.school_id) === 2)]));
  assert.deepEqual(otherAfter, otherBefore);
}));

test('teacher holiday lookup with an empty cache returns calendar data without writing school settings', () => withSchool(async ({ call, snapshot, mutationCount }) => {
  const before = await snapshot();
  const result = await call('get', 'public-holidays', 102, { query: { year: '2027' } });
  assert.equal(result.data.holidays[0].name, '검증신정');
  assert.equal(mutationCount(), 0);
  assert.deepEqual(await snapshot(), before);
}));

test('browser: ordinary teacher can browse all seven tabs, filter, read incomplete timetables and print without editing', () => withSchool(async ({ db, openBrowser, mutationCount }) => {
  // An incomplete allocation must not hide a previously saved timetable from a reader.
  await db.exec('DELETE FROM school_weekly_period_allocation WHERE school_id=1');
  const { page, state } = await openBrowser();
  await page.getByText('검증재량휴업', { exact: true }).first().waitFor();
  assert.match(await page.locator('#curriculumAccessStatus').innerText(), /조회 전용/);
  assert.equal(await page.locator('#addAnnualScheduleForm').isVisible(), false);
  assert.equal(await page.locator('.delete-schedule-btn, .delete-holiday-btn').count(), 0);
  await page.locator('#nextMonthBtn').click();
  assert.match(await page.locator('#calendarMonthTitle').innerText(), /4월/);
  for (const tab of ['curriculum', 'bellSchedule', 'timetable', 'specialistTimetable', 'roomTimetable', 'annualTimetable']) {
    await page.locator(`[data-tab="${tab}"]`).click();
    if (tab === 'curriculum') {
      await page.locator('#curriculumGradeSelect').selectOption('5');
      await page.waitForFunction(() => document.querySelector('#curriculumTableBody .weekly-input')?.value === '1');
      const displayedTotal = await page.locator('#curriculumTableFoot td').nth(1).innerText();
      const inputTotal = await page.locator('#curriculumTableBody .weekly-input').evaluateAll(inputs => inputs.reduce((sum, input) => sum + Number(input.value), 0));
      assert.equal(displayedTotal, `${inputTotal}시간/주`);
      assert.equal(await page.locator('#saveCurriculumBtn').isVisible(), false);
    } else if (tab === 'bellSchedule') {
      await page.locator('.load-bell-grade-btn[data-grade="5"]').click();
      assert.equal(await page.locator('#bellTableBody .bell-start').first().inputValue(), '08:40');
    } else if (tab === 'timetable') {
      await page.locator('#timetableMatrixBody').getByText('검증국어', { exact: true }).waitFor();
      await page.locator('#timetableMatrixBody [data-day="1"][data-period="1"]').click();
    } else if (tab === 'specialistTimetable') {
      await page.locator('#specialistTeacherSelect').selectOption('102');
      await page.locator('#specialistTimetableMatrixBody').getByText(/검증국어/).waitFor();
      await page.locator('#specialistTimetableMatrixBody [data-day="1"][data-period="1"]').click();
    } else if (tab === 'roomTimetable') {
      await page.locator('#roomTimetableMatrixBody').getByText(/검증국어/).waitFor();
      await page.locator('#roomTimetableMatrixBody [data-day="1"][data-period="1"]').click();
    } else {
      await page.waitForFunction(() => document.querySelectorAll('#annualTimetableTableBody tr').length > 0);
      await page.evaluate(() => { window.print = () => { window.printCalled = true; }; });
      await page.locator('#printOfficialDocBtn').click();
      assert.equal(await page.evaluate(() => window.printCalled), true);
      await page.emulateMedia({ media: 'print' });
      assert.equal(await page.locator('#annualTab').isVisible(), false);
      assert.equal(await page.locator('#annualTimetableTab').isVisible(), true);
      await page.emulateMedia({ media: 'screen' });
    }
    const editable = await page.locator('.app-main input:enabled, .app-main textarea:enabled').count();
    assert.equal(editable, 0, tab);
  }
  assert.equal(await page.evaluate(() => api('/api/school-admin/curriculum-hours', { method: 'POST', body: '{}' }).then(() => 200, e => e.status)), 403);
  assert.deepEqual(state.requests.filter(r => r.method !== 'GET'), []);
  assert.equal(mutationCount(), 0);
  assert.deepEqual(state.dialogs, []);
  assert.deepEqual(state.errors, []);
  const output = new URL('../outputs/school-curriculum-readonly-2026-10-07/', import.meta.url);
  await mkdir(output, { recursive: true });
  await page.screenshot({ path: fileURLToPath(new URL('teacher-annual.png', output)) });
}));

test('browser: administrator can save and edit a complete timetable; demotion closes editing on a rejected save', () => withSchool(async ({ db, openBrowser, call }) => {
  const { page, state } = await openBrowser(101);
  await page.locator('[data-tab="bellSchedule"]').click();
  await page.locator('.weekly-count-input[data-grade="5"]').first().waitFor();
  assert.equal(await page.locator('.weekly-count-input[data-grade="5"]').first().isEnabled(), true);
  assert.equal(await page.locator('.weekly-count-input[data-grade="1"]').first().isDisabled(), true, 'A grade without saved curriculum hours must stay locked even for administrators');
  await page.locator('[data-tab="timetable"]').click();
  await page.locator('#timetableMatrixBody').getByText('검증국어', { exact: true }).waitFor();
  assert.equal(await page.locator('#saveTimetableBtn').isVisible(), true);
  await page.locator('[data-tab="curriculum"]').click();
  await page.locator('#curriculumGradeSelect').selectOption('5');
  await page.waitForFunction(() => document.querySelector('#curriculumTableBody .weekly-input')?.value === '1');
  await page.locator('#curriculumTableBody .weekly-input').first().fill('2');
  const saved = page.waitForResponse(r => r.url().includes('/curriculum-hours') && r.request().method() === 'POST');
  await page.locator('#saveCurriculumBtn').click();
  assert.equal((await saved).status(), 200);
  assert.equal(Number((await call('get', 'curriculum-hours', 102, { query: { academicYear: '2026', grade: '5' } })).data.hours.find(h => h.subject_name === '국어').weekly_hours), 2);
  await db.exec("UPDATE classroom_teachers SET teacher_type='전담' WHERE user_id=101");
  assert.equal(await page.evaluate(() => api('/api/school-admin/curriculum-hours', { method: 'POST', body: '{}' }).then(() => 200, e => e.status)), 403);
  assert.equal(await page.locator('#saveCurriculumBtn').isVisible(), false);
  assert.equal(await page.locator('#curriculumTableBody input:enabled').count(), 0);
  assert.deepEqual(state.errors, []);
}));

test('browser: a failed access check leaves the page closed and does not redirect or issue curriculum requests', () => withSchool(async ({ openBrowser }) => {
  const { page, state } = await openBrowser(301);
  await page.waitForFunction(() => !document.getElementById('curriculumAccessStatus').textContent.includes('확인하는 중'));
  assert.equal(await page.locator('.app-main').isVisible(), false);
  assert.equal(await page.locator('.tab-button:enabled').count(), 0);
  assert.ok(page.url().endsWith('/schooladmin/'));
  assert.deepEqual(state.requests.map(r => r.path), ['/school-admin/curriculum-access']);
}));
