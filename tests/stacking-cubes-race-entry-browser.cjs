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
      assert.ok(await student.locator('#stacking-bgm').evaluate(a => a.paused && !a.hasAttribute('src')));
      await teacher.locator('#race-start').click();
      await student.locator('#race-panel').waitFor({ state: 'hidden' });
      await student.locator('#target-panel').waitFor();
      await student.locator('.unified-audio-menu-toggle').click();
      await student.waitForFunction(() => document.querySelector('#stacking-bgm').currentTime > 0);
      await teacher.waitForFunction(() => document.querySelector('#stacking-bgm').currentTime > 0);
      const music = student.locator('#stacking-bgm');
      assert.equal(await music.getAttribute('src'), await teacher.locator('#stacking-bgm').getAttribute('src'));
      await student.locator('#musicVolumeSlider').fill('0.18');
      assert.equal(await music.evaluate(a => a.volume), .18);
      await student.locator('#musicMuteBtn').click();
      assert.ok(await music.evaluate(a => a.paused && a.muted));
      assert.equal(await student.evaluate(() => StackingSounds.muted()), false);
      await student.locator('#musicMuteBtn').click();
      const firstTrack = await music.getAttribute('src');
      await music.evaluate(a => { a.currentTime = a.duration - .15; });
      await student.waitForFunction(src => {
        const a = document.querySelector('#stacking-bgm');
        return a.getAttribute('src') !== src && a.currentTime > 0;
      }, firstTrack);
      await student.locator('.unified-audio-menu-toggle').click();
      assert.equal(await student.locator('.workspace').evaluate(el => el.inert), false);
      await teacher.locator('#race-stop').click();
      await student.locator('#race-panel').waitFor();
      assert.ok(await music.evaluate(a => a.paused));
      await student.locator('#race-leave').click();
      await student.waitForURL(base + '/room/');
      await student.goto(base + race);
      await student.waitForURL(base + '/room/');
      await student.goto(base + race + '?room=invalid');
      await student.waitForURL(base + '/room/');
      await context.close();
    }

    // A real class grows towers, changes leader, celebrates once, and survives reload.
    const roster = [];
    async function request(path, body, token = '', studentName = '') {
      const response = await fetch(base + '/api/stacking-race/rooms/' + code + path, {
        method: body === undefined ? 'GET' : 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token, 'x-name': encodeURIComponent(studentName) },
        ...(body === undefined ? {} : { body: JSON.stringify(body) })
      });
      const data = await response.json(); assert.equal(response.status, 200, JSON.stringify(data)); return data;
    }
    for (const studentName of ['가람', '나래', '다온', '라온', '마루', '바다', '새봄', '아람', '여름', '지우', '하늘', '해솔', '도윤', '서연', '수빈', '민준', '예린', '지호', '유나', '은우', '소윤', '시우', '채원', '태민']) roster.push(await request('/join', {}, '', studentName));
    await teacher.waitForFunction(() => document.querySelectorAll('.race-tower-card').length === 24);
    await capture(teacher, 'teacher-class-lobby');
    await teacher.locator('#race-start').click(); await teacher.locator('#race-stop').waitFor();
    const hostToken = await teacher.evaluate(code => JSON.parse(localStorage.getItem('stacking-race-ticket-' + code)).token, code);
    const round = await request('', undefined, hostToken);
    const answer = (player, index) => request('/answer', { roundId: round.roundId, index, heights: round.questions[index] }, player.token);
    const firstCard = teacher.locator(`[data-player="${roster[0].state.me.id}"]`), winnerCard = teacher.locator(`[data-player="${roster[1].state.me.id}"]`);
    await answer(roster[0], 0);
    await teacher.waitForFunction(id => document.querySelector(`[data-player="${id}"] [aria-valuenow="1"]`), roster[0].state.me.id);
    await firstCard.evaluate(node => { window.firstTowerNode = node; });
    await answer(roster[1], 0); await answer(roster[1], 1);
    await teacher.waitForFunction(id => document.querySelector('.race-tower-card').dataset.player === id, roster[1].state.me.id);
    await teacher.waitForFunction(() => document.getElementById('race-banner').textContent.includes('1위로'));
    assert.equal(await firstCard.evaluate(node => node === window.firstTowerNode), true, 'polling reuses the same card so rank changes can animate');
    for (let i = 2; i < round.total; i++) await answer(roster[1], i);
    await teacher.waitForFunction(() => document.getElementById('race-banner').textContent.includes('나래 완주'));
    assert.equal(await winnerCard.locator('.tower-block').count(), round.total);
    assert.equal(await teacher.locator('.race-spark').count(), 28);
    for (let i = 2; i < roster.length; i++) for (let q = 0; q < i % round.total; q++) await answer(roster[i], q);
    await teacher.waitForFunction(total => [...document.querySelectorAll('.tower-progress')].reduce((sum, n) => sum + Number(n.getAttribute('aria-valuenow')), 0) === total,
      1 + round.total + roster.slice(2).reduce((sum, _, i) => sum + (i + 2) % round.total, 0));
    await teacher.waitForTimeout(800);
    await capture(teacher, 'teacher-tower-race');
    const stageLayout = await teacher.locator('.race-card').evaluate(node => ({ height: node.clientHeight, content: node.scrollHeight, columns: getComputedStyle(document.getElementById('race-ranks')).gridTemplateColumns, ranks: document.getElementById('race-ranks').clientHeight, row: document.querySelector('.race-tower-card').clientHeight }));
    assert.ok(stageLayout.content <= stageLayout.height + 1, '24 students and teacher controls fit the desktop scoreboard: ' + JSON.stringify(stageLayout));
    await teacher.locator('.unified-audio-menu-toggle').click(); await teacher.locator('#sfxMuteBtn').click(); assert.equal(await teacher.evaluate(() => StackingSounds.muted()), true);
    await teacher.reload(); await teacher.locator('.race-tower-card.is-complete').waitFor();
    assert.equal(await teacher.locator('.tower-drop,.race-spark').count(), 0, 'reloading does not replay old finish or progress effects');
    assert.equal(await teacher.locator('#sfxMuteBtn').getAttribute('aria-pressed'), 'true');
    await teacher.emulateMedia({ reducedMotion: 'reduce' });
    await answer(roster[0], 1);
    await teacher.waitForFunction(id => document.querySelector(`[data-player="${id}"] [aria-valuenow="2"]`), roster[0].state.me.id);
    assert.equal(await firstCard.locator('.tower-drop').count(), 0, 'reduced motion keeps the progress without drop animation');
    await teacher.locator('#race-stop').click(); await teacher.locator('#race-start').waitFor();
    await capture(teacher, 'teacher-results');
    await teacher.setViewportSize({ width: 390, height: 844 }); await capture(teacher, 'teacher-phone');
    assert.equal(await teacher.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await teacher.setViewportSize({ width: 1366, height: 900 });
    await teacher.locator('#race-start').click(); await teacher.locator('#race-stop').waitFor();
    assert.equal(await teacher.locator('.tower-block').count(), 0, 'a new race resets every tower');
    await teacher.locator('#race-stop').click(); await teacher.locator('#race-start').waitFor();

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
