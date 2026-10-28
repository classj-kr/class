const test = require('node:test'),
  assert = require('node:assert/strict'),
  path = require('node:path'),
  fs = require('node:fs');
const { spawnSync } = require('node:child_process');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { startHarness } = require('./site-storage-harness.cjs');
const { createHandwriting } = require('../game-hub-server/handwriting'),
  { createRoomCodes } = require('../game-hub-server/room-codes'),
  { createRoomEntry } = require('../game-hub-server/room-entry');
const C = require('../learning/literacy-numeracy/handwriting/core');
const root = path.resolve(__dirname, '..'),
  route = '/learning/literacy-numeracy/handwriting/',
  output = path.join(root, 'outputs', 'handwriting');
let h, browser, context, page, errors;
const ready = () =>
  page.waitForFunction(() =>
    /계정에 자동 저장/.test(document.querySelector('#saveStatus')?.textContent || ''),
  );
const saved = () =>
  page.waitForFunction(() => document.querySelector('#saveStatus').textContent === '계정에 자동 저장됨');
async function pointer(target, kind, points, { type = 'pen', id = 1, width = 1, cancel = false } = {}) {
  await target.evaluate(
    (el, { kind, points, type, id, width, cancel }) => {
      const r = el.getBoundingClientRect();
      const emit = (event, p, buttons) =>
        el.dispatchEvent(
          new PointerEvent(event, {
            bubbles: true,
            cancelable: true,
            pointerId: id,
            pointerType: type,
            isPrimary: true,
            button: 0,
            buttons,
            width,
            height: width,
            clientX: r.x + (p[0] / 100) * r.width,
            clientY: r.y + (p[1] / 100) * r.height,
          }),
        );
      if (kind === 'stroke') {
        emit('pointerdown', points[0], 1);
        for (const p of points.slice(1)) emit('pointermove', p, 1);
        emit(cancel ? 'pointercancel' : 'pointerup', points[points.length - 1], 0);
      } else emit(kind, points[0], kind === 'pointerup' ? 0 : 1);
    },
    { kind, points, type, id, width, cancel },
  );
}
async function drawLetter(p, char) {
  for (const s of C.model(char)) await pointer(p.locator('#writingCanvas'), 'stroke', C.sample(s, 35));
}
const count = () =>
  page.evaluate(
    () =>
      HandwritingApp.snapshot().cells[HandwritingApp.snapshot().phase][HandwritingApp.snapshot().index]
        .length,
  );
async function shot(name) {
  fs.mkdirSync(output, { recursive: true });
  const result = spawnSync(
    process.env.HANDWRITING_PYTHON || 'python',
    [
      '-c',
      "import io,sys;from PIL import Image;im=Image.open(io.BytesIO(sys.stdin.buffer.read())).convert('RGBA');im.save(sys.argv[1],format='WEBP',lossless=True,exact=True);out=Image.open(sys.argv[1]).convert('RGBA');assert im.size==out.size and im.tobytes()==out.tobytes()",
      path.join(output, name + '.webp'),
    ],
    { input: await page.screenshot({ fullPage: true }) },
  );
  assert.equal(result.status, 0, String(result.stderr));
}
test.before(async () => {
  h = await startHarness({
    me: (user) => ({
      signedIn: true,
      user: {
        id: user.id,
        name: user.id === 1 ? '검수교사' : '검수학생',
        role: user.id === 1 ? 'teacher' : 'student',
      },
      membership: user.id === 2 ? { studentName: '검수학생', grade: 3, classNumber: 1 } : undefined,
    }),
    extraRoutes(app, { userOf }) {
      const codes = createRoomCodes({ isActive: async (e) => feature.hasRoomCode(e.code) }),
        platform = {
          roomCodes: codes,
          configuration: () => ({ enabled: true }),
          isTeacherRequest: async (req) => userOf(req)?.id === 1,
          isContentGloballyDisabled: async () => false,
          canBypassGlobalContentLock: async () => false,
          displayNameFor: async (req) => ({
            name: userOf(req)?.id === 2 ? '검수학생' : userOf(req) ? '검수교사' : '',
          }),
        };
      const feature = createHandwriting({ platform });
      app.use('/api/handwriting', feature.router);
      app.use(
        '/api/room-entry',
        createRoomEntry({ roomCodes: codes, handwritingExists: (c) => feature.hasRoomCode(c) }),
      );
      app.get('/api/site/access', (_, res) => res.json({ mode: 'open' }));
      app.get('/api/teacher/profile', (_, res) => res.json({ profiles: [] }));
      app.get('/api/home-content-access', (_, res) =>
        res.json({
          mode: 'open',
          enabledPaths: [],
          globallyDisabledPaths: [],
          hasClassAccess: false,
          canManage: false,
        }),
      );
      app.get(route + 'race/', (_, res) => res.sendFile(path.join(root, route, 'index.html')));
      for (const f of ['styles.css', 'stroke-topology.js', 'core.js', 'app.js', 'race.js'])
        app.get(route + 'race/' + f, (_, res) => res.sendFile(path.join(root, route, f)));
    },
  });
  browser = await chromium.launch({
    headless: true,
    ...(process.platform === 'win32' ? { channel: 'msedge' } : {}),
  });
});
test.beforeEach(async () => {
  await h.db.query('DELETE FROM user_storage');
  context = await browser.newContext({ viewport: { width: 1366, height: 950 } });
  await context.addCookies([{ name: 'test_user', value: '1', url: h.base }]);
  page = await context.newPage();
  errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
});
test.afterEach(async () => {
  try {
    assert.deepEqual(errors, []);
  } finally {
    await context?.close();
  }
});
test.after(async () => {
  await browser?.close();
  await h?.close();
});
test('menu placement, independent phases, input priority, cancellation, undo and account restore', async () => {
  await context.addCookies([{ name: 'test_user', value: '2', url: h.base }]);
  await page.goto(h.base + '/');
  await page.locator('#category-literacy-toggle').click();
  const names = await page
    .locator('#category-literacy-panel > a, #category-literacy-panel > details > summary')
    .allTextContents();
  assert.match(names[0], /읽기/);
  assert.match(names[1], /글씨 쓰기/);
  assert.equal(await page.locator('#category-literacy-panel a[href*=metacognition]').count(), 0);
  assert.equal(await page.locator('#category-exploration-panel a[href*=metacognition]').count(), 1);
  assert.equal(await page.locator('#category-exploration-toggle .category-label').textContent(), '교과');
  assert.equal(await page.locator('#category-boardgame-toggle .category-label').textContent(), '게임');
  await page.locator('a[href="learning/literacy-numeracy/handwriting/"]').click();
  await page.waitForURL('**/handwriting/');
  await ready();
  const canvas = page.locator('#writingCanvas');
  assert.equal(await canvas.evaluate((el) => getComputedStyle(el).touchAction), 'none');
  await pointer(
    canvas,
    'stroke',
    [
      [10, 10],
      [90, 90],
    ],
    { type: 'touch' },
  );
  assert.equal(await count(), 0, 'palm touching first is ignored in pen mode');
  await pointer(canvas, 'pointerdown', [[20, 20]], { type: 'pen' });
  await pointer(
    canvas,
    'stroke',
    [
      [10, 10],
      [90, 90],
    ],
    { type: 'touch', id: 8, width: 70 },
  );
  await pointer(canvas, 'pointermove', [[80, 20]], { type: 'pen' });
  await pointer(canvas, 'pointerup', [[80, 80]], { type: 'pen' });
  assert.equal(await count(), 1);
  await pointer(
    canvas,
    'stroke',
    [
      [20, 20],
      [80, 20],
    ],
    { cancel: true },
  );
  assert.equal(await count(), 1, 'OS interruption discards an unfinished stroke');
  await page.locator('#undoButton').click();
  assert.equal(await count(), 0);
  await page.locator('#redoButton').click();
  assert.equal(await count(), 1);
  await page.locator('#clearButton').click();
  await drawLetter(page, '가');
  await page.locator('#checkButton').click();
  assert.match(await page.locator('#feedback').textContent(), /일치도 (?:9[8-9]|100)%.*획순/);
  await page.locator('[data-phase=solo]').click();
  assert.equal(await count(), 0);
  await page.locator('[data-phase=trace]').click();
  assert.equal(await count(), 3);
  const before = await page.evaluate(() => HandwritingApp.snapshot());
  await page.setViewportSize({ width: 390, height: 844 });
  assert.deepEqual(await page.evaluate(() => HandwritingApp.snapshot().cells), before.cells);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await saved();
  await shot('mobile');
  await page.reload();
  await ready();
  assert.equal(await count(), 3);
  assert.deepEqual(await page.evaluate(() => Object.keys(localStorage)), []);
  assert.equal(await page.locator('#saveFile, #openFile, #importFile').count(), 0);
  assert.ok((await canvas.boundingBox()).y < 140, 'the writing surface starts near the top on a phone');
  await page.evaluate(() => dispatchEvent(new Event('beforeprint')));
  assert.equal(await page.locator('#printSheet canvas').count(), 28);
  await page.emulateMedia({ media: 'print' });
  assert.equal(await page.locator('#printSheet').isVisible(), true);
  await page.emulateMedia({ media: 'screen' });
});
test('touch fallback admits one contact, rejects broad palms, and yields immediately to a detected pen', async () => {
  await page.goto(h.base + route);
  await ready();
  const canvas = page.locator('#writingCanvas');
  await page.locator('#settingsMenu > summary').click();
  await page.selectOption('#inputMode', 'touch');
  await pointer(
    canvas,
    'stroke',
    [
      [10, 10],
      [90, 90],
    ],
    { type: 'touch', width: 60 },
  );
  assert.equal(await count(), 0);
  await pointer(canvas, 'pointerdown', [[10, 10]], { type: 'touch', id: 5 });
  await pointer(
    canvas,
    'stroke',
    [
      [10, 10],
      [90, 90],
    ],
    { type: 'touch', id: 6 },
  );
  assert.equal(await count(), 0);
  await pointer(
    canvas,
    'stroke',
    [
      [20, 22],
      [80, 22],
      [80, 80],
    ],
    { type: 'pen', id: 9 },
  );
  assert.equal(await count(), 1, 'pen cancels provisional touch stroke');
  assert.equal(await page.locator('#inputMode').inputValue(), 'pen');
  await pointer(canvas, 'pointerup', [[80, 80]], { type: 'touch', id: 5 });
  assert.equal(await count(), 1);
  await page.locator('#settingsMenu > summary').click();
  await page.locator('#testInput').click();
  await pointer(
    page.locator('#testCanvas'),
    'stroke',
    [
      [10, 20],
      [80, 70],
    ],
    { type: 'pen' },
  );
  assert.match(await page.locator('#testResult').textContent(), /펜으로 인식/);
  await page.locator('#closeInput').click();
  await page.setViewportSize({ width: 1366, height: 950 });
  await shot('desktop');
});
test('teacher creates a room, student enters from the main entrance, submits, and sees server ranking', async () => {
  await page.goto(h.base + route + 'race/');
  await page.locator('#createRoom').waitFor({ state: 'visible' });
  await page.fill('#raceText', '가');
  await page.locator('#createRoom').click();
  await page.locator('#codeLabel').waitFor({ state: 'visible' });
  const code = await page.locator('#codeLabel').textContent();
  const students = await browser.newContext({ viewport: { width: 768, height: 1024 }, hasTouch: true });
  try {
    await students.addCookies([{ name: 'test_user', value: '2', url: h.base }]);
    const p = await students.newPage();
    p.on('pageerror', (e) => errors.push(e.message));
    await p.goto(h.base + '/room/');
    await p.fill('#roomCode', code);
    await p.locator('#roomForm button').click();
    await p.locator('#readyButton').waitFor({ state: 'visible' });
    await p.locator('#readyButton').click();
    await page.waitForFunction(() => document.querySelector('#rankList').textContent.includes('준비 완료'));
    await page.locator('#startRound').click();
    await p.locator('#submitRound').waitFor({ state: 'visible' });
    await drawLetter(p, '가');
    p.once('dialog', (d) => d.accept());
    await p.locator('#submitRound').click();
    await p.waitForFunction(() => document.querySelector('#rankList').textContent.includes('획순 통과'));
    assert.match(await p.locator('#rankList').textContent(), /1위.*(?:9[8-9]|100)%/);
    assert.equal(await p.locator('#writingCanvas').getAttribute('aria-disabled'), 'true');
    await p.reload();
    await p.waitForFunction(() => document.querySelector('#rankList').textContent.includes('획순 통과'));
    assert.equal(await p.evaluate(() => HandwritingApp.snapshot().cells.trace[0].length), 3);
    await page.waitForFunction(() => document.querySelector('#rankList').textContent.includes('획순 통과'));
    await shot('room-results');
    assert.equal(await page.locator('#raceText').isVisible(), true, 'teacher can choose the next text');
    await page.fill('#raceText', '나');
    await p.locator('#readyButton').click();
    await page.waitForFunction(() => document.querySelector('#rankList').textContent.includes('준비 완료'));
    await page.locator('#startRound').click();
    await p.waitForFunction(() => HandwritingApp.snapshot().text === '나');
    assert.equal(await p.locator('#writingCanvas').getAttribute('aria-disabled'), 'false');
  } finally {
    await students.close();
  }
});
test('custom text restores and guests do not persist a draft', async () => {
  await page.goto(h.base + route);
  await ready();
  await page.selectOption('#lessonSelect', 'custom');
  await page.fill('#customText', '한글');
  await page.locator('#customForm button').click();
  await saved();
  await page.reload();
  await ready();
  assert.equal(await page.locator('#customForm').isVisible(), true);
  assert.equal(await page.locator('#customText').inputValue(), '한글');
  const guests = await browser.newContext();
  try {
    const p = await guests.newPage();
    await p.goto(h.base + route);
    await p.waitForFunction(() => document.querySelector('#saveStatus').textContent.includes('게스트'));
    await drawLetter(p, '가');
    assert.equal(await p.evaluate(() => HandwritingApp.snapshot().cells.trace[0].length), 3);
    await p.reload();
    await p.waitForFunction(() => document.querySelector('#saveStatus').textContent.includes('게스트'));
    assert.equal(await p.evaluate(() => HandwritingApp.snapshot().cells.trace[0].length), 0);
    assert.deepEqual(await p.evaluate(() => Object.keys(localStorage)), []);
  } finally {
    await guests.close();
  }
});

test('the actual webfont matches the stroke source and the editor has no landing-page or file controls', async () => {
  await page.goto(h.base + route);
  await ready();
  assert.ok((await page.locator('#writingCanvas').boundingBox()).y < 80);
  assert.equal(
    await page.locator('.page-header, .practice-tip, input[type=file], #saveFile, #openFile').count(),
    0,
  );
  assert.equal(await page.locator('#settingsMenu').getAttribute('open'), null);
  const agreement = await page.evaluate(() => {
    const actual = document.createElement('canvas'),
      source = document.createElement('canvas');
    actual.width = actual.height = source.width = source.height = 600;
    const a = actual.getContext('2d'),
      b = source.getContext('2d'),
      result = {};
    for (const char of Array.from('가나다라마바사아자차카타파하한글과괜읽읊ㅏㅓㅇㅎ')) {
      a.resetTransform();
      a.clearRect(0, 0, 600, 600);
      a.scale(6, 6);
      a.font = '100px ClassJPen';
      a.fillText(char, 0, 90);
      b.resetTransform();
      b.clearRect(0, 0, 600, 600);
      b.scale(6, 6);
      for (const stroke of HandwritingFont.model(char)) {
        b.beginPath();
        for (const contour of HandwritingFont.outlines(stroke)) {
          b.moveTo(...contour[0]);
          for (const p of contour.slice(1)) b.lineTo(...p);
          b.closePath();
        }
        b.fill();
      }
      const x = a.getImageData(0, 0, 600, 600).data,
        y = b.getImageData(0, 0, 600, 600).data;
      let union = 0,
        same = 0;
      for (let i = 3; i < x.length; i += 4) {
        const p = x[i] >= 128,
          q = y[i] >= 128;
        if (p || q) union++;
        if (p && q) same++;
      }
      result[char] = same / union;
    }
    return result;
  });
  for (const [char, value] of Object.entries(agreement))
    assert.ok(value > 0.94, `${char}: font/source overlap ${value}`);
  await shot('compact-desktop');
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.ok((await page.locator('#writingCanvas').boundingBox()).y < 140);
  await shot('compact-mobile');
});
