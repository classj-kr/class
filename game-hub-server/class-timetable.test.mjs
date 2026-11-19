import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import test from 'node:test';
import { PGlite } from '@electric-sql/pglite';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const classTimetable = require('./class-timetable.js');
const timetableRules = require('./school-timetable-rules.js');
const source = await readFile(new URL('./classroom-platform.js', import.meta.url), 'utf8');
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
const routeBody = signature => {
  const start = source.indexOf(signature);
  assert.ok(start >= 0, signature);
  return source.slice(source.indexOf('=> {', start) + 4, source.indexOf('\n  }));', start));
};
const innerFunction = name => {
  const start = source.indexOf(`  async function ${name}(`);
  assert.ok(start >= 0, name);
  return source.slice(start, source.indexOf('\n  }', start) + 4);
};

const place = { schoolId: 1, year: 2028, grade: 3, classNumber: 1, legacyUserId: 101 };

async function withDb(run) {
  const db = new PGlite();
  try {
    await db.exec(`
      CREATE TABLE school_master_timetable (school_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER,
        day_of_week INTEGER, period INTEGER, subject_name TEXT NOT NULL DEFAULT '', teacher_user_id BIGINT, room_name TEXT);
      CREATE TABLE school_bell_schedule (school_id BIGINT, academic_year INTEGER, grade INTEGER, period_times JSONB);
      CREATE TABLE classroom_teacher_dashboard_settings (user_id BIGINT PRIMARY KEY, timetable JSONB NOT NULL DEFAULT '{}',
        slogan_text TEXT DEFAULT '', slogan_align TEXT DEFAULT 'center', slogan_font_size INTEGER DEFAULT 42,
        card_order JSONB DEFAULT '[]', updated_at TIMESTAMPTZ);
      CREATE TABLE classroom_class_timetable_overrides (school_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER,
        overrides JSONB NOT NULL DEFAULT '{}', updated_by BIGINT, updated_at TIMESTAMPTZ,
        PRIMARY KEY (school_id, academic_year, grade, class_number));
      CREATE TABLE classroom_classes (id BIGINT PRIMARY KEY, school_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER, teacher_user_id BIGINT);
      INSERT INTO classroom_classes VALUES (11, 1, 2028, 3, 1, 101), (12, 1, 2028, 3, 2, 102);
      INSERT INTO school_bell_schedule VALUES (1, 2028, 3, '{"1":{"start":"09:00","end":"09:40"},"2":{"start":"09:50","end":"10:30"},"3":{"start":"10:40","end":"11:20"}}');
      INSERT INTO classroom_teacher_dashboard_settings (user_id, timetable) VALUES
        (101, '{"월":[{"p":1,"sub":"예전 국어","place":"교실","s":"09:00","e":"09:40"}]}');
    `);
    const pool = { query: async (sql, params) => {
      const r = await db.query(sql, params);
      return { rows: r.rows, rowCount: r.affectedRows || r.rows.length };
    } };
    await run({ db, pool });
  } finally { await db.close(); }
}

const schoolLessons = db => db.exec(`INSERT INTO school_master_timetable VALUES
  (1, 2028, 3, 1, 1, 1, '국어', NULL, NULL), (1, 2028, 3, 1, 1, 2, '음악', 201, '음악실'),
  (1, 2028, 3, 1, 1, 3, '수업없음', NULL, NULL), (1, 2028, 3, 1, 2, 1, '-', NULL, NULL), (1, 2028, 3, 2, 1, 1, '다른 반', NULL, NULL)`);

test('without a school timetable the class keeps the homeroom timetable, and with nothing it is empty', () => withDb(async ({ db, pool }) => {
  assert.deepEqual(await classTimetable.loadClassTimetable(pool, place), {
    timetable: { 월: [{ p: 1, sub: '예전 국어', place: '교실', s: '09:00', e: '09:40' }] }, source: 'teacher'
  });
  assert.deepEqual(await classTimetable.loadClassTimetable(pool, { ...place, legacyUserId: 999 }), { timetable: {}, source: 'none' });
  await classTimetable.saveClassDay(pool, place, { day: '화', periods: [{ p: 2, sub: '수학', place: '', s: '09:50', e: '10:30' }], userId: 101 });
  assert.equal((await classTimetable.loadClassTimetable(pool, place)).timetable.화[0].sub, '수학');
  assert.equal((await db.query('SELECT COUNT(*)::int AS n FROM classroom_class_timetable_overrides')).rows[0].n, 0);
}));

test('the school timetable, bell times and special rooms form the class timetable; the old homeroom copy is ignored', () => withDb(async ({ db, pool }) => {
  await schoolLessons(db);
  assert.deepEqual(await classTimetable.loadClassTimetable(pool, place), {
    source: 'school',
    timetable: { 월: [
      { p: 1, sub: '국어', place: '', s: '09:00', e: '09:40' },
      { p: 2, sub: '음악', place: '음악실', s: '09:50', e: '10:30' }
    ] }
  });
}));

test('homeroom changes are stored as class exceptions, marked, removable and resettable without touching the school table', () => withDb(async ({ db, pool }) => {
  await schoolLessons(db);
  const monday = (await classTimetable.loadClassTimetable(pool, place)).timetable.월;
  await classTimetable.saveClassDay(pool, place, { day: '월', userId: 101, periods: [
    monday[0],
    { p: 3, sub: '체육', place: '강당', s: '10:40', e: '11:20' }
  ] });
  const changed = (await classTimetable.loadClassTimetable(pool, place)).timetable.월;
  assert.deepEqual(changed, [
    { p: 1, sub: '국어', place: '', s: '09:00', e: '09:40' },
    { p: 3, sub: '체육', place: '강당', s: '10:40', e: '11:20', changed: true }
  ]);
  const stored = (await db.query('SELECT overrides FROM classroom_class_timetable_overrides')).rows[0].overrides;
  assert.deepEqual(stored, { 월: { 2: { removed: true }, 3: { sub: '체육', place: '강당', s: '10:40', e: '11:20' } } });
  assert.equal((await db.query("SELECT COUNT(*)::int AS n FROM school_master_timetable WHERE subject_name = '체육'")).rows[0].n, 0);
  await classTimetable.saveClassDay(pool, place, { day: '월', reset: true, userId: 101 });
  assert.equal((await classTimetable.loadClassTimetable(pool, place)).timetable.월.length, 2);
  assert.deepEqual((await db.query('SELECT overrides FROM classroom_class_timetable_overrides')).rows[0].overrides, {});
}));

test('a teacher without a class sees the lessons assigned to them across classes', () => withDb(async ({ db, pool }) => {
  await schoolLessons(db);
  assert.deepEqual(await classTimetable.assignedLessons(pool, { schoolId: 1, year: 2028, userId: 201 }), {
    월: [{ p: 2, sub: '음악', place: '3학년 1반 · 음악실', s: '09:50', e: '10:30' }]
  });
}));

function routes(pool, teacherId, ownClassId) {
  const bindings = {
    pool, HttpError, classTimetable, timetableRules,
    findHomeroomTeacher: async (_db, _place, fallback) => fallback,
    requireTeacher: async () => ({ id: teacherId }),
    requireUser: async () => ({ id: teacherId }),
    teacherRegistration: async () => ({ school_id: 1, academic_year: 2028 }),
    userClassId: async () => ownClassId
  };
  for (const name of ['classTimetablePlace', 'personalTimetable']) {
    bindings[name] = new Function(...Object.keys(bindings), `${innerFunction(name)}; return ${name};`)(...Object.values(bindings));
  }
  const make = signature => {
    const fn = new AsyncFunction('req', 'res', ...Object.keys(bindings), routeBody(signature));
    return async body => {
      let data;
      await fn({ body, query: {} }, { json(value) { data = value; } }, ...Object.values(bindings));
      return data;
    };
  };
  return { save: make('router.put("/teacher/class-timetable"'), settings: make('router.put("/teacher/dashboard-settings"') };
}

test('only the homeroom teacher can change a class timetable; assigned lessons stay with the school screens', () => withDb(async ({ db, pool }) => {
  await schoolLessons(db);
  await assert.rejects(routes(pool, 102, 12).save({ classId: 11, day: '월', periods: [] }), { status: 403 });
  const saved = await routes(pool, 101, 11).save({ classId: 11, day: '월', periods: [{ p: 1, sub: '국어', s: '09:00', e: '09:40' }] });
  assert.equal(saved.timetableSource, 'school');
  assert.deepEqual(saved.timetable.월.map(item => item.p), [1]);
  await assert.rejects(routes(pool, 201, null).save({ day: '월', periods: [] }), { status: 409 });
  await assert.rejects(routes(pool, 101, 11).save({ classId: 11, day: '토', periods: [] }), { status: 400 });
}));

test('saving only the card order keeps the saved timetable and slogan', () => withDb(async ({ db, pool }) => {
  await db.exec("UPDATE classroom_teacher_dashboard_settings SET slogan_text = '함께 자라요' WHERE user_id = 101");
  await routes(pool, 101, 11).settings({ cardOrder: ['widget-info'] });
  const row = (await db.query('SELECT timetable, slogan_text, card_order FROM classroom_teacher_dashboard_settings WHERE user_id = 101')).rows[0];
  assert.equal(row.timetable.월[0].sub, '예전 국어');
  assert.equal(row.slogan_text, '함께 자라요');
  assert.deepEqual(row.card_order, ['widget-info']);
}));

async function openDashboard(classData, onSave) {
  const browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.clock.install({ time: new Date('2028-03-06T01:00:00Z') }); // 월요일 오전 10시(한국)
  const errors = [], puts = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('dialog', dialog => dialog.accept());
  const base = 'http://class-dashboard.test';
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin !== base) return route.abort();
    if (url.pathname === '/api/teacher/class') return route.fulfill({ json: classData });
    if (url.pathname === '/api/teacher/class-timetable') {
      const body = route.request().postDataJSON();
      puts.push(body);
      return route.fulfill({ json: onSave(body) });
    }
    if (url.pathname === '/api/teacher/dashboard-settings' && route.request().method() === 'PUT') {
      puts.push({ settings: route.request().postDataJSON() });
      return route.fulfill({ json: { ok: true } });
    }
    if (url.pathname.startsWith('/api/')) return route.fulfill({ json: {} });
    const local = url.pathname.startsWith('/assets/') ? `..${url.pathname}` : `../apps${url.pathname}`;
    try {
      const body = await readFile(new URL(local, import.meta.url));
      const type = local.endsWith('.js') ? 'text/javascript' : local.endsWith('.css') ? 'text/css' : 'text/html';
      return route.fulfill({ body, contentType: type });
    } catch { return route.fulfill({ status: 404, body: '' }); }
  });
  await page.goto(`${base}/classtools/dashboard.html`);
  return { browser, page, errors, puts };
}

const classroom = { id: 11, grade: 3, classNumber: 1, isReadOnly: false, students: [], schoolName: '' };

test('browser: the dashboard shows no example timetable when the class has none', async () => {
  const { browser, page, errors, puts } = await openDashboard({ classroom, timetable: {}, timetableSource: 'none', timetableEditable: true }, () => ({}));
  try {
    await page.locator('#timetableList .timetable-empty').waitFor();
    assert.equal(await page.locator('#timetableList .timetable-item').count(), 0);
    assert.equal(await page.locator('#editTimetableBtn').isVisible(), true);
    assert.ok(!puts.some(p => p.settings && 'timetable' in p.settings));
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});

test('browser: a homeroom edit is saved as the class timetable and shown with its change mark', async () => {
  const lesson = { p: 1, sub: '국어', place: '', s: '09:00', e: '09:40' };
  const days = Object.fromEntries(['월', '화', '수', '목', '금'].map(day => [day, [lesson]]));
  const { browser, page, errors, puts } = await openDashboard(
    { classroom, timetable: days, timetableSource: 'school', timetableEditable: true },
    body => ({ timetable: { ...days, [body.day]: [{ ...body.periods[0], changed: true }] }, timetableSource: 'school', timetableEditable: true }));
  try {
    await page.locator('#timetableList .timetable-item').first().waitFor();
    await page.locator('#editTimetableBtn').click();
    assert.equal(await page.locator('#resetTimetableDayBtn').isVisible(), true);
    const input = page.locator('#periodEditForm .period-sub-input[data-p="1"]');
    await input.fill('체육');
    await page.locator('#saveTimetableBtn').click();
    await page.locator('#timetableModal').waitFor({ state: 'hidden' });
    const save = puts.find(p => p.day);
    assert.equal(save.classId, 11);
    assert.equal(save.periods[0].sub, '체육');
    await page.locator('#timetableList').getByText('학급 변경').waitFor();
    assert.match(await page.locator('#timetableList').innerText(), /체육/);
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});

test('browser: a class the teacher only visits is read-only', async () => {
  const { browser, page, errors } = await openDashboard(
    { classroom: { ...classroom, isReadOnly: true }, timetable: {}, timetableSource: 'school', timetableEditable: false }, () => ({}));
  try {
    await page.locator('#timetableList .timetable-empty').waitFor();
    assert.equal(await page.locator('#editTimetableBtn').isVisible(), false);
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});
