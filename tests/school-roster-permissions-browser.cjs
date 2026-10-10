const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { test, before, after } = require('node:test');
const { chromium } = require('../game-hub-server/node_modules/playwright');

const output = path.resolve(__dirname, '../outputs/school-roster-permissions-2026-10-07');
const teachers = [
  { name: '가관리자', type: '관리자', email: 'admin@example.invalid', linked: true },
  { name: '나담임', type: '담임', email: 'teacher@example.invalid', grade: 6, classNumber: 3, linked: true },
  { name: '다전담', type: '전담', email: 'subject@example.invalid', grade: '3,4', subjectName: '음악', roomName: '음악실', linked: true },
  { name: 'pending@example.invalid', type: '전담', email: 'pending@example.invalid', nameSource: 'pending', linked: false },
  { name: '라교감', type: '교감', email: 'vice@example.invalid', linked: true },
];
let server, browser, origin;
before(async () => {
  fs.mkdirSync(output, { recursive: true });
  server = http.createServer((req, res) => {
    if (req.url === '/classtools/school-roster') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fs.readFileSync(path.resolve(__dirname, '../apps/classtools/school-roster.html')));
    } else res.writeHead(404).end();
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
});
after(async () => {
  await browser?.close();
  if (server) await new Promise(resolve => server.close(resolve));
});

async function fixture(t, isAdmin = false) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const state = { isAdmin, settingsAdmin: isAdmin, teachers: structuredClone(teachers), writes: [], errors: [], dialogs: [], get: null, saveStatus: 200 };
  page.on('pageerror', error => state.errors.push(error.message));
  page.on('dialog', async dialog => { state.dialogs.push(dialog.message()); await dialog.accept(); });
  await page.route('**/api/**', async route => {
    const url = new URL(route.request().url());
    const json = value => route.fulfill({ json: value });
    if (url.pathname === '/api/auth/me') return json({ signedIn: true, isTeacher: true, user: { role: 'teacher', name: '검증용 교사' } });
    if (url.pathname === '/api/school/settings') return json({ isAdmin: state.settingsAdmin, columns: [], specialRooms: [], approvalLines: {} });
    if (url.pathname === '/api/school/students') return json({ students: [] });
    if (url.pathname === '/api/school/teachers' && route.request().method() === 'GET') {
      if (state.get) return state.get(route);
      return json({ teachers: state.teachers, isAdmin: state.isAdmin });
    }
    if (url.pathname === '/api/school/teachers' && route.request().method() === 'PUT') {
      const payload = route.request().postDataJSON();
      state.writes.push(payload);
      if (state.saveStatus === 403) return route.fulfill({ status: 403, json: { message: '교직원 명단 편집 권한은 학교 관리자만 갖고 있습니다.' } });
      state.teachers = payload.teachers;
      return json({ saved: state.teachers.length });
    }
    throw new Error(`Unexpected request: ${route.request().method()} ${url.pathname}`);
  });
  t.after(async () => { await page.close(); assert.deepEqual(state.errors, []); });
  await Promise.all([page.waitForResponse('**/api/school/students?*'), page.goto(`${origin}/classtools/school-roster`)]);
  await page.locator('#rosterBody .no-data').waitFor();
  return { page, state };
}
async function load(page) {
  const response = page.waitForResponse(r => r.url().endsWith('/api/school/teachers') && r.request().method() === 'GET');
  await page.locator('#tab-teachers').click();
  await response;
  await page.waitForFunction(() => !document.getElementById('teacherRosterStatus').textContent.includes('불러오는 중'));
}
async function assertReadOnly(page) {
  assert.equal(await page.locator('#teacherAdminActions').isVisible(), false);
  assert.equal(await page.locator('#teacherPasteSection').isVisible(), false);
  assert.equal(await page.locator('#teacherRosterBody input, #teacherRosterBody select, #teacherRosterBody button, #teacherRosterBody [contenteditable=true]').count(), 0);
}

test('ordinary teacher sees a readable roster with no editable cells or delete buttons', async t => {
  const { page } = await fixture(t);
  await load(page);
  await page.screenshot({ path: path.join(output, process.env.ROSTER_BASELINE ? 'ordinary-before.png' : 'ordinary-after.png') });
  await assertReadOnly(page);
  const text = await page.locator('#teacherRosterBody').innerText();
  for (const value of ['가관리자', '나담임', '다전담', '3,4', '음악', '음악실', '교감', '로그인 때 채움']) assert.ok(text.includes(value), value);
});

test('ordinary teacher cannot mutate rows, import or send a save by calling window handlers', async t => {
  const { page, state } = await fixture(t);
  await load(page);
  const before = await page.locator('#teacherRosterBody').innerHTML();
  await page.evaluate(async () => {
    updateTeacherField(1, 'name', '변경시도');
    updateTeacherField(1, 'role', '교장');
    addTeacherRow();
    deleteTeacherRow(1);
    toggleTeacherPasteSection();
    document.getElementById('teacherPasteInput').value = '추가시도\tnew@example.invalid';
    parseTeacherPaste();
    await saveTeacherRoster();
  });
  assert.equal(await page.locator('#teacherRosterBody').innerHTML(), before);
  assert.deepEqual(state.writes, []);
  assert.deepEqual(state.dialogs, []);
  await assertReadOnly(page);
});

test('admin can edit, add, delete, import and save; protected admin account stays readonly', async t => {
  const { page, state } = await fixture(t, true);
  await load(page);
  assert.equal(await page.locator('#teacherAdminActions').isVisible(), true);
  assert.equal(await page.locator('#teacherRosterBody tr').first().locator('td').nth(1).locator('input').getAttribute('readonly'), '');
  assert.equal(await page.locator('#teacherRosterBody tr').first().locator('button').count(), 0);
  await page.locator('#addTeacherBtn').click();
  assert.equal(await page.locator('#teacherRosterBody tr').count(), 6);
  await page.locator('#teacherRosterBody tr').last().locator('button').click();
  assert.equal(await page.locator('#teacherRosterBody tr').count(), 5);
  const input = page.locator('#teacherRosterBody tr').nth(1).locator('td').first().locator('input');
  await input.fill('나변경');
  await input.press('Tab');
  await page.evaluate(() => saveTeacherRoster());
  assert.equal(state.writes.length, 1);
  assert.equal(state.writes[0].teachers[1].name, '나변경');
  await page.locator('#toggleTeacherPasteBtn').click();
  await page.locator('#teacherPasteInput').fill('마추가\tnew@example.invalid\t5\t2');
  await page.locator('#teacherPasteSection button').first().click();
  assert.equal(await page.locator('#teacherRosterBody tr').count(), 1);
  await page.evaluate(() => saveTeacherRoster());
  assert.equal(state.writes[1].teachers[0].name, '마추가');
  await page.screenshot({ path: path.join(output, 'admin-after.png') });
});

test('permissions start closed and are revoked on reload errors, missing flags and role changes', async t => {
  const { page, state } = await fixture(t, true);
  let release;
  state.get = async route => { await new Promise(resolve => { release = resolve; }); await route.fulfill({ json: { teachers, isAdmin: true } }); };
  await Promise.all([page.waitForRequest('**/api/school/teachers'), page.locator('#tab-teachers').click()]);
  assert.equal(await page.locator('#teacherAdminActions').isVisible(), false);
  release();
  await page.waitForFunction(() => document.getElementById('teacherAdminActions').style.display === 'flex');
  state.get = null;
  await page.locator('#toggleTeacherPasteBtn').click();
  assert.equal(await page.locator('#teacherPasteSection').isVisible(), true);
  state.get = route => route.fulfill({ status: 500, json: { message: '명단 조회 실패' } });
  await load(page);
  await assertReadOnly(page);
  assert.match(await page.locator('#teacherRosterStatus').innerText(), /명단 조회 실패/);
  for (const flag of [undefined, 'false', false]) {
    state.get = route => route.fulfill({ json: { teachers, isAdmin: flag } });
    await load(page);
    await assertReadOnly(page);
  }
  await Promise.all([page.waitForResponse('**/api/school/settings?*'), page.locator('#tab-settings').click()]);
  await page.evaluate(() => { addTeacherRow(); updateTeacherField(1, 'name', '설정권한혼입'); });
  assert.equal(await page.locator('#teacherRosterBody tr').count(), teachers.length);
  assert.equal(await page.locator('#teacherRosterBody input').count(), 0);
  assert.equal((await page.locator('#teacherRosterBody').innerText()).includes('설정권한혼입'), false);
});

test('older admin response cannot overwrite a newer ordinary-teacher response', async t => {
  const { page, state } = await fixture(t, true);
  let firstRoute, seenFirst;
  const firstSeen = new Promise(resolve => { seenFirst = resolve; });
  state.get = route => { firstRoute = route; seenFirst(); };
  await page.locator('#tab-teachers').click();
  await firstSeen;
  state.isAdmin = false;
  state.get = null;
  await load(page);
  await assertReadOnly(page);
  await firstRoute.fulfill({ json: { teachers, isAdmin: true } });
  await page.waitForLoadState('networkidle');
  await assertReadOnly(page);
});

test('a save rejected after demotion immediately closes editing and subsequent saves', async t => {
  const { page, state } = await fixture(t, true);
  await load(page);
  state.saveStatus = 403;
  await page.evaluate(() => saveTeacherRoster());
  await assertReadOnly(page);
  await page.evaluate(() => saveTeacherRoster());
  assert.equal(state.writes.length, 1);
});
