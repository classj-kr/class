const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { test } = require('node:test');
const express = require('express');
const { PGlite } = require('@electric-sql/pglite');
const { chromium } = require('playwright');
const { createSeating, normalizeSeatSettings } = require('./seating.js');

const projectRoot = path.resolve(__dirname, '..');
const roster = Array.from({ length: 8 }, (_, index) => ({
  number: String(index + 1), name: `학생${index + 1}`, gender: index % 2 ? '여' : '남'
}));
const classes = [11, 12, 13].map((id) => ({ id, grade: 6, classNumber: id - 10, teacherName: '교사', students: roster }));
class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}

async function fixture() {
  const db = new PGlite();
  await db.exec(`
    CREATE TABLE classroom_schools (id BIGINT PRIMARY KEY);
    CREATE TABLE classroom_users (id BIGINT PRIMARY KEY);
    CREATE TABLE classroom_classes (id BIGINT PRIMARY KEY, school_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER);
    CREATE TABLE school_students (id BIGINT PRIMARY KEY, school_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER,
      student_number TEXT, roster_name TEXT, gender TEXT, avatar_key TEXT, user_id BIGINT, student_email TEXT);
    CREATE TABLE classroom_students (id BIGINT PRIMARY KEY, class_id BIGINT, student_number TEXT, roster_name TEXT, gender TEXT,
      avatar_key TEXT, user_id BIGINT, student_email TEXT);
    INSERT INTO classroom_schools VALUES (1), (2);
    INSERT INTO classroom_users VALUES (7), (8), (9), (21), (22), (23), (24), (25), (26), (27), (28);
    INSERT INTO classroom_classes VALUES (11, 1, 2026, 6, 1), (12, 1, 2026, 6, 2), (13, 1, 2026, 6, 3), (31, 2, 2026, 6, 1);
  `);
  for (const classroom of classes) {
    for (const student of roster) {
      await db.query('INSERT INTO school_students VALUES ($1, 1, 2026, 6, $2, $3, $4, $5, NULL, $6, NULL)',
        [classroom.id * 100 + Number(student.number), classroom.classNumber, student.number, student.name, student.gender,
          classroom.id === 11 ? 20 + Number(student.number) : null]);
    }
  }
  const query = async (sql, params) => {
    const result = await db.query(sql, params);
    return { ...result, rowCount: result.rows.length || result.affectedRows || 0 };
  };
  const pool = { query, connect: async () => ({ query, release() {} }) };
  const userOf = (req) => {
    const id = Number(req.get('x-user'));
    return [7, 8, 9, 21, 22, 23, 24, 25, 26, 27, 28].includes(id)
      ? { id, role: id < 10 ? 'teacher' : 'student', email: `user${id}@example.test` } : null;
  };
  const requireTeacher = async (req) => {
    const user = userOf(req);
    if (!user) throw new HttpError(401, 'AUTH_REQUIRED', '로그인이 필요합니다.');
    if (user.role !== 'teacher') throw new HttpError(403, 'TEACHER_REQUIRED', '교사만 접근할 수 있습니다.');
    return user;
  };
  const options = {
    pool, sessionUser: async (req) => userOf(req), guestAccess: () => null, requireTeacher,
    requireDatabase() {}, teacherRegistration: async (user) => ({ school_id: user.id === 9 ? 2 : 1 }),
    avatarUrl: () => '', HttpError,
    asyncRoute: (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
  };
  let seating = createSeating(options);
  await seating.initialize();
  const app = express();
  app.use(express.json());
  const faults = { get: false, put: false, delayPut: 0, writes: [] };
  app.use(async (req, res, next) => {
    if (/\/classes\/\d+\/settings$/.test(req.path)) {
      if (req.method === 'PUT') {
        faults.writes.push({ classId: req.path.split('/')[4], body: req.body });
        if (faults.delayPut) await new Promise((resolve) => setTimeout(resolve, faults.delayPut));
      }
      if ((req.method === 'GET' && faults.get) || (req.method === 'PUT' && faults.put)) {
        return res.status(503).json({ message: '저장 서버 연결 실패' });
      }
    }
    next();
  });
  app.use('/api/seating', (req, res, next) => seating.router(req, res, next));
  app.get('/api/auth/me', (req, res) => res.json({ signedIn: !!userOf(req), user: userOf(req) }));
  app.get('/api/teacher/available-classes', (_req, res) => res.json({ classes }));
  app.get('/api/teacher/class', (req, res) => res.json({ classroom: classes.find((entry) => entry.id === Number(req.query.classId || 11)) }));
  app.get('/blank', (_req, res) => res.send('<!doctype html><title>fixture</title>'));
  app.use(express.static(projectRoot));
  app.use((error, _req, res, _next) => res.status(error.status || 500).json({ error: error.code || 'INTERNAL_ERROR', message: error.message }));
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const call = async (method, route, { user = 7, body } = {}) => {
    const response = await fetch(origin + route, {
      method, headers: { 'Content-Type': 'application/json', ...(user ? { 'x-user': String(user) } : {}) },
      ...(body === undefined ? {} : { body: JSON.stringify(body) })
    });
    return { status: response.status, body: await response.json() };
  };
  const endpoint = (id = 11) => `/api/seating/classes/${id}/settings`;
  return {
    db, origin, call, endpoint, faults,
    read: async (id = 11, user = 7) => (await call('GET', endpoint(id), { user })).body.settings,
    save: async (settings, id = 11, user = 7) => call('PUT', endpoint(id), { user, body: { settings } }),
    restart: async () => { seating = createSeating(options); await seating.initialize(); },
    close: async () => { await new Promise((resolve) => server.close(resolve)); await db.close(); }
  };
}

test('seating settings persist in PostgreSQL and through teacher browser flows', { timeout: 120000 }, async (t) => {
  const f = await fixture();
  let browser;
  const pageErrors = [];
  try {
    await t.test('only registered teachers can read/write classes in their school', async () => {
      assert.equal((await f.call('GET', f.endpoint(), { user: null })).status, 401);
      for (const method of ['GET', 'PUT']) {
        assert.equal((await f.call(method, f.endpoint(), { user: 21, body: method === 'PUT' ? { settings: {} } : undefined })).status, 403);
        assert.equal((await f.call(method, f.endpoint(31), { body: method === 'PUT' ? { settings: {} } : undefined })).status, 404);
        assert.equal((await f.call(method, f.endpoint('invalid'), { body: method === 'PUT' ? { settings: {} } : undefined })).status, 400);
      }
      assert.equal(await f.read(), null);
      assert.equal((await f.call('PUT', f.endpoint(), { body: {} })).status, 400);
    });

    await t.test('settings survive module reinitialization, isolate teachers/classes, and protect migration', async () => {
      const wanted = normalizeSeatSettings({
        unavailableSeats: [35], genderLocks: { 10: '여' }, studentLocks: { 4: '5' },
        manualAssignments: { 8: '2' }, manualVacantSeats: [6], unassignedStudents: ['7'],
        studentOrder: ['8', '2', '5', '1', '3', '4', '6', '7'], teacherView: true
      }, new Set(roster.map((s) => s.number)));
      assert.equal((await f.save(wanted)).status, 200);
      await f.restart();
      assert.deepEqual(await f.read(), wanted);
      assert.equal(await f.read(11, 8), null);
      assert.equal(await f.read(12), null);
      await f.save({ teacherView: false }, 12);
      await f.save({ unavailableSeats: [0] }, 11, 8);
      const migrated = await f.call('PUT', f.endpoint(), { body: { settings: {}, ifMissing: true } });
      assert.deepEqual(migrated.body.settings, wanted);
      assert.deepEqual(await f.read(), wanted);
      assert.deepEqual((await f.read(11, 8)).unavailableSeats, [0]);
      assert.equal((await f.read(12)).teacherView, false);
      const stored = await f.db.query('SELECT settings FROM seating_settings WHERE creator_user_id = 7 AND class_id = 11');
      assert.deepEqual(stored.rows[0].settings, wanted);
    });

    await t.test('invalid seats, missing students and duplicate assignments are discarded', async () => {
      const response = await f.save({
        unavailableSeats: [35, -1, 36, null], genderLocks: { 35: '여', 3: '잘못됨' },
        studentLocks: { 0: '1', 1: '1', 2: '999' },
        manualAssignments: { 3: '1', 4: '2', 5: '2', 35: '3', 40: '4', 9: '999' },
        manualVacantSeats: [6, 35, -1], unassignedStudents: ['8', '999'],
        studentOrder: ['2', '2', '1', '999'], teacherView: 'true'
      }, 13);
      assert.equal(response.status, 200);
      assert.deepEqual(response.body.settings, {
        unavailableSeats: [35], genderLocks: {}, studentLocks: { 0: '1' }, manualAssignments: { 4: '2' },
        manualVacantSeats: [6], unassignedStudents: ['8'], studentOrder: ['2', '1'], teacherView: false
      });
    });

    const executablePath = process.env.SEATING_BROWSER || (process.platform === 'win32'
      ? ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(fs.existsSync)
      : undefined);
    browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
    const openTeacher = async ({ user = 7, legacy = null, blockedStorage = false } = {}) => {
      const context = await browser.newContext({ viewport: { width: 1366, height: 950 }, extraHTTPHeaders: { 'x-user': String(user) } });
      await context.route('**/*', (route) => new URL(route.request().url()).origin === f.origin ? route.continue() : route.abort());
      if (blockedStorage) await context.addInitScript(() => {
        Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('blocked', 'SecurityError'); } });
      });
      const page = await context.newPage();
      page.on('pageerror', (error) => pageErrors.push(error.message));
      page.on('dialog', (dialog) => dialog.accept());
      if (legacy) {
        await page.goto(f.origin + '/blank');
        await page.evaluate(({ key, settings }) => localStorage.setItem(key, JSON.stringify(settings)), legacy);
      }
      await page.goto(f.origin + '/classtools/seating.html');
      return { context, page };
    };
    const ready = (page) => page.waitForFunction(() => !document.querySelector('#shuffle-btn').disabled && document.querySelector('#save-status').textContent === '서버 저장 완료');
    const saved = (page) => page.waitForFunction(() => document.querySelector('#save-status').textContent === '서버 저장 완료');
    const layout = (page) => page.locator('.desk').evaluateAll((desks) => desks.map((desk) => ({
      coord: desk.querySelector('.desk-coord').textContent, name: desk.querySelector('.desk-name').textContent,
      unused: desk.classList.contains('is-unused'), male: desk.classList.contains('is-gender-male'), female: desk.classList.contains('is-gender-female')
    })));

    await t.test('legacy settings migrate once; independent browsers restore server data without localStorage', async () => {
      await f.db.query('DELETE FROM seating_settings WHERE creator_user_id = 7 AND class_id = 11');
      const { context, page } = await openTeacher({ legacy: {
        key: 'classroom-seating-unused-11-u7', settings: { unavailableSeats: [35], genderLocks: { 10: '여' }, studentLocks: { 4: '5' }, teacherView: true }
      } });
      await ready(page);
      const expected = await layout(page);
      assert.equal(await page.evaluate(() => localStorage.getItem('classroom-seating-unused-11-u7')), null);
      assert.equal((await f.read()).teacherView, true);
      await context.close();
      const other = await openTeacher({ blockedStorage: true });
      await ready(other.page);
      assert.deepEqual(await layout(other.page), expected);
      await other.context.close();
      const stale = await openTeacher({ legacy: { key: 'classroom-seating-unused-11-u7', settings: { unavailableSeats: [0] } } });
      await ready(stale.page);
      assert.deepEqual(await layout(stale.page), expected);
      await stale.context.close();
    });

    await t.test('clear all persists vacancies and keeps X/gender conditions; manual assignment still works', async () => {
      const { context, page } = await openTeacher();
      await ready(page);
      await page.locator('#clear-seats-btn').click();
      await saved(page);
      assert.equal(await page.locator('.desk.is-occupied').count(), 0);
      assert.equal(await page.locator('.desk.is-unused').count(), 1);
      assert.equal(await page.locator('.desk.is-gender-female').count(), 1);
      assert.deepEqual((await f.read()).studentLocks, {});
      assert.equal((await f.read()).manualVacantSeats.length, 35);
      await page.reload();
      await ready(page);
      assert.equal(await page.locator('.desk.is-occupied').count(), 0);
      await page.getByRole('button', { name: /^A1 좌석/ }).click();
      await page.locator('#student-picker-select').selectOption('1');
      await page.locator('#student-picker-confirm').click();
      await page.waitForFunction(() => document.querySelectorAll('.desk.is-occupied').length === 1);
      await saved(page);
      assert.equal(await page.locator('.desk.is-occupied').count(), 1);
      await page.locator('#student-lock-select').selectOption('2');
      await page.locator('#student-lock-btn').click();
      await page.getByRole('button', { name: /^B1 좌석/ }).click();
      await saved(page);
      assert.equal(await page.locator('.desk.is-occupied').count(), 2);
      assert.equal((await f.read()).studentLocks['1'], '2');
      await page.reload();
      await ready(page);
      assert.equal(await page.locator('.desk.is-occupied').count(), 2);
      if (process.env.SEATING_SCREENSHOT) await page.screenshot({ path: process.env.SEATING_SCREENSHOT, fullPage: true });
      await context.close();
    });

    await t.test('shuffle order and locked seats restore exactly in a fresh browser', async () => {
      const { context, page } = await openTeacher();
      await ready(page);
      await page.locator('#shuffle-btn').click();
      assert.equal(await page.locator('#clear-seats-btn').isDisabled(), true);
      assert.equal(await page.locator('#class-switcher-select').isDisabled(), true);
      await ready(page);
      const expected = await layout(page);
      assert.equal((await f.read()).studentOrder.length, 8);
      assert.equal(await page.locator('.desk.is-occupied').count(), 8);
      await context.close();
      const other = await openTeacher();
      await ready(other.page);
      assert.deepEqual(await layout(other.page), expected);
      await other.context.close();
    });

    await t.test('failed saves remain retryable and cannot leak into another class; queued saves preserve the newest edit', async () => {
      const { context, page } = await openTeacher();
      await ready(page);
      const previousClass12 = await f.read(12);
      f.faults.put = true;
      await page.locator('#clear-seats-btn').click();
      await page.locator('#save-retry-btn').waitFor({ state: 'visible' });
      await page.locator('#class-switcher-select').selectOption('12');
      await page.waitForFunction(() => document.querySelector('#class-switcher-select').value === '11' && !document.querySelector('#class-switcher-select').disabled);
      assert.deepEqual(await f.read(12), previousClass12);
      f.faults.put = false;
      await page.locator('#save-retry-btn').click();
      await saved(page);
      assert.equal((await f.read()).unassignedStudents.length, 8);
      const originalView = (await f.read()).teacherView;
      f.faults.delayPut = 120;
      await page.locator('#teacher-view-btn').click();
      await page.locator('#teacher-view-btn').click();
      await page.locator('#class-switcher-select').selectOption('12');
      await ready(page);
      assert.equal((await f.read()).teacherView, originalView);
      assert.equal(await page.locator('#class-switcher-select').inputValue(), '12');
      assert.equal(await page.locator('.desk.is-occupied').count(), 8);
      f.faults.delayPut = 0;
      await page.locator('#class-switcher-select').selectOption('11');
      await ready(page);
      assert.equal(await page.locator('.desk.is-occupied').count(), 0);
      await context.close();
    });

    await t.test('failed initial read disables editing and does not overwrite a saved layout', async () => {
      const expected = await f.read();
      const before = f.faults.writes.length;
      f.faults.get = true;
      const { context, page } = await openTeacher();
      await page.locator('#save-retry-btn').waitFor({ state: 'visible' });
      assert.equal(await page.locator('#clear-seats-btn').isDisabled(), true);
      assert.equal(await page.locator('#shuffle-btn').isDisabled(), true);
      assert.equal(f.faults.writes.length, before);
      f.faults.get = false;
      await page.locator('#save-retry-btn').click();
      await ready(page);
      assert.deepEqual(await f.read(), expected);
      await context.close();
    });

    await t.test('moving a manually assigned student into a locked seat preserves the layout after reload', async () => {
      await f.save({ manualAssignments: { 0: '1' }, studentOrder: roster.map((s) => s.number) });
      const { context, page } = await openTeacher();
      await ready(page);
      await page.locator('#student-lock-select').selectOption('1');
      await page.locator('#student-lock-btn').click();
      await page.getByRole('button', { name: /^C2 좌석/ }).click();
      await saved(page);
      const expected = await layout(page);
      assert.equal(await page.locator('.desk.is-occupied').count(), 8);
      await page.reload();
      await ready(page);
      assert.deepEqual(await layout(page), expected);
      await context.close();
    });

    await t.test('live selection preserves the original layout on cancel and saves the final layout on close', async () => {
      await f.save({ unavailableSeats: [35], studentOrder: roster.map((s) => s.number) });
      const { context, page } = await openTeacher();
      await ready(page);
      const before = await layout(page);
      const settingsBefore = await f.read();
      await page.locator('#live-open-btn').click();
      await page.locator('#live-panel').waitFor({ state: 'visible' });
      assert.equal(await page.locator('#clear-seats-btn').isDisabled(), true);
      assert.equal(await page.locator('.desk.is-occupied').count(), 0);
      await page.locator('#teacher-view-btn').click();
      await saved(page);
      assert.deepEqual((await f.read()).unassignedStudents, settingsBefore.unassignedStudents);
      await page.reload();
      await page.locator('#live-panel').waitFor({ state: 'visible' });
      await page.locator('#live-cancel-btn').click();
      await ready(page);
      assert.deepEqual((await layout(page)).slice().reverse(), before);
      await page.locator('#live-open-btn').click();
      await page.locator('#live-panel').waitFor({ state: 'visible' });
      const code = await page.locator('#live-code').textContent();
      assert.equal((await f.call('POST', `/api/seating/rooms/${code}/pick`, { user: 21, body: { seatIndex: 20 } })).status, 201);
      await page.locator('#live-close-btn').click();
      await ready(page);
      assert.equal((await f.read()).manualAssignments['20'], '1');
      const final = await layout(page);
      await context.close();
      const other = await openTeacher({ blockedStorage: true });
      await ready(other.page);
      assert.deepEqual(await layout(other.page), final);
      await other.context.close();
    });
    assert.deepEqual(pageErrors, []);
  } finally {
    if (browser) await browser.close();
    await f.close();
  }
});