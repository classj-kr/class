const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const express = require('../game-hub-server/node_modules/express');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { createStackingCubes } = require('../game-hub-server/stacking-cubes');
const { createRoomCodes } = require('../game-hub-server/room-codes');
const { createRoomEntry } = require('../game-hub-server/room-entry');
const root = path.resolve(__dirname, '..');
const lesson = '/learning/inquiry/math/stacking-cubes';
const race = lesson + '/race/';
const shots = process.argv.includes('--shots');
const output = path.join(root, 'outputs/stacking-cubes-race-entry');
const convert = "import io,sys;from PIL import Image;im=Image.open(io.BytesIO(sys.stdin.buffer.read())).convert('RGBA');im.save(sys.argv[1],format='WEBP',lossless=True);out=Image.open(sys.argv[1]).convert('RGBA');assert im.size==out.size and im.tobytes()==out.tobytes()";

(async () => {
  // Exercise the actual race and common-entry APIs; only account identities are fixtures.
  const isTeacher = req => req.get('x-role') === 'teacher';
  const name = req => decodeURIComponent(req.get('x-name') || '검증 학생');
  const codes = createRoomCodes({ isActive: async entry => activity.hasRoomCode(entry.code) });
  const activity = createStackingCubes({ platform: {
    roomCodes: codes, configuration: () => ({ enabled: true }),
    isTeacherRequest: async req => isTeacher(req),
    isContentGloballyDisabled: async () => false, canBypassGlobalContentLock: async () => false,
    displayNameFor: async req => ({ name: name(req) })
  } });
  const app = express();
  app.use(express.json());
  app.use('/api/stacking-race', activity.router);
  app.use('/api/room-entry', createRoomEntry({ roomCodes: codes, stackingExists: code => activity.hasRoomCode(code) }));
  app.get('/api/site/access', (_, res) => res.json({ mode: 'open' }));
  app.get('/api/auth/me', (req, res) => res.json({ signedIn: true,
    user: { id: isTeacher(req) ? 1 : 2, name: name(req), role: isTeacher(req) ? 'teacher' : 'student' },
    membership: { studentName: name(req), grade: 3, classNumber: 1, studentNumber: '1' }
  }));
  app.get('/api/teacher/profile', (_, res) => res.json({ profiles: [{ name: '검증 교사', schoolName: '검증학교', teacherType: '담임', grade: 3, classNumber: 1 }] }));
  app.get('/api/home-content-access', (_, res) => res.json({ mode: 'open', enabledPaths: [], globallyDisabledPaths: [], hasClassAccess: false, canManage: false, canManageGlobally: false }));
  app.use('/api', (_, res) => res.json({}));
  app.get(race, (_, res) => res.type('html').send(fs.readFileSync(path.join(root, lesson, 'index.html'), 'utf8').replace('</head>', '<link rel="stylesheet" href="/assets/exam-typography.css"></head>')));
  app.use(race, express.static(path.join(root, lesson)));
  app.use(express.static(path.join(root, 'apps')));
  app.use(express.static(root));
  const server = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
    if (shots) fs.mkdirSync(output, { recursive: true });
    const errors = [];
    const teacherContext = await browser.newContext({ viewport: { width: 1366, height: 900 }, extraHTTPHeaders: { 'x-role': 'teacher', 'x-name': encodeURIComponent('검증 교사') } });
    const teacher = await teacherContext.newPage();
    teacher.on('pageerror', error => errors.push(error.message));
    const capture = async (page, suffix) => {
      if (!shots) return;
      await page.evaluate(() => document.fonts.ready);
      const result = spawnSync('python', ['-c', convert, path.join(output, suffix + '.webp')], { input: await page.screenshot() });
      assert.equal(result.status, 0, String(result.stderr));
    };
    await teacher.goto(base + race);
    await teacher.locator('#race-open').waitFor();
    assert.equal(await teacher.locator('#race-join, #race-code').count(), 0, 'the race has no duplicate number-entry form');
    await capture(teacher, 'teacher-create');
    await teacher.locator('#race-open').click();
    await teacher.locator('#race-room').waitFor();
    const code = await teacher.locator('#race-code-label').textContent();
    assert.match(code, /^\d{4}$/);
    await teacher.reload();
    await teacher.locator('#race-start').waitFor();
    assert.equal(await teacher.locator('#race-code-label').textContent(), code, 'host reload restores the same room');

    for (const width of [1366, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 844 }, extraHTTPHeaders: { 'x-name': encodeURIComponent('학생' + width) } });
      const student = await context.newPage();
      student.on('pageerror', error => errors.push(error.message));
      let joins = 0;
      student.on('request', req => { if (req.method() === 'POST' && new URL(req.url()).pathname.endsWith('/join')) joins++; });
      await student.goto(base + '/');
      await student.locator('.hub-title-link a[href="/room/"]').click();
      await student.waitForURL(base + '/room/');
      await student.locator('#roomCode').fill(code);
      await student.locator('#roomForm button').click();
      await student.waitForURL(base + race + '?room=' + code);
      await student.locator('#race-room').waitFor();
      assert.equal(await student.locator('#race-code-label').textContent(), code);
      assert.equal(await student.locator('#race-create').isVisible(), false);
      assert.equal(await student.locator('#race-start').isVisible(), false);
      assert.equal(joins, 1, 'one number submission joins immediately');
      await capture(student, 'student-lobby-' + width);
      await student.reload();
      await student.locator('#race-room').waitFor();
      assert.equal(joins, 1, 'reload restores the ticket without adding another participant');
      await teacher.locator('#race-start').click();
      await student.locator('#race-panel').waitFor({ state: 'hidden' });
      await student.locator('#target-panel').waitFor();
      assert.equal(await student.locator('.workspace').evaluate(el => el.inert), false);
      await teacher.locator('#race-stop').click();
      await student.locator('#race-panel').waitFor();
      await student.locator('#race-leave').click();
      await student.waitForURL(base + '/room/');
      await student.goto(base + race);
      await student.waitForURL(base + '/room/');
      await student.goto(base + race + '?room=invalid');
      await student.waitForURL(base + '/room/');
      await context.close();
    }

    // Expired invitations still expose the shared entry link, without a second form.
    teacher.once('dialog', dialog => dialog.accept());
    await teacher.locator('#race-leave').click();
    await teacher.locator('#race-open').waitFor();
    assert.equal(activity.hasRoomCode(code), false);
    const expired = await browser.newPage();
    expired.on('pageerror', error => errors.push(error.message));
    await expired.goto(base + race + '?room=' + code);
    await expired.waitForFunction(() => document.getElementById('race-status').textContent.includes('방번호'));
    await expired.locator('.race-heading a').click();
    await expired.waitForURL(base + '/room/');
    assert.deepEqual(errors, []);
    console.log('PASS: home entry → room code once → race auto-join, host/student reload, start/stop, leave, direct entry, and expired invitation; desktop and phone.');
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
