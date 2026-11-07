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
      for (const f of ['styles.css', 'font-source.js', 'font-engine.js', 'style-badasseugi.js', 'pen-reference.js', 'core.js', 'app.js', 'race.js'])
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
  assert.match(names[1], /쓰기/);
  assert.equal(await page.locator('#category-literacy-panel a[href*=metacognition]').count(), 1);
  assert.equal(await page.locator('#category-exploration-panel a[href*=metacognition]').count(), 0);
  assert.equal(await page.locator('#category-exploration-toggle .category-label').textContent(), '교과');
  assert.equal(await page.locator('#category-boardgame-toggle .category-label').textContent(), '게임');
  await page.locator('[data-access-group="writing"] > summary').click();
  await page.locator('a[href="learning/literacy-numeracy/handwriting/"]').click();
  await page.waitForURL('**/handwriting/');
  await ready();
  const race = page.locator('a.race-link');
  assert.equal(await race.textContent(), '🏁 순위전');
  assert.equal(await page.locator('.topbar a[href="race/"]').count(), 0, 'no race link in the top row');
  const raceBox = await race.boundingBox(),
    view = page.viewportSize();
  assert.ok(view.width - (raceBox.x + raceBox.width) < 30 && view.height - (raceBox.y + raceBox.height) < 30, 'race entry sits in the bottom-right corner');
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
  // 한 글자를 다 쓰면 다음 빈 칸으로 넘어가므로, 첫 칸을 직접 센다.
  const firstCell = () => page.evaluate(() => HandwritingApp.snapshot().cells.trace[0].length);
  assert.equal(await firstCell(), 3);
  const before = await page.evaluate(() => HandwritingApp.snapshot());
  await page.setViewportSize({ width: 390, height: 844 });
  assert.deepEqual(await page.evaluate(() => HandwritingApp.snapshot().cells), before.cells);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await saved();
  await shot('mobile');
  await page.reload();
  await ready();
  assert.equal(await firstCell(), 3);
  assert.deepEqual(await page.evaluate(() => Object.keys(localStorage)), []);
  assert.equal(await page.locator('#saveFile, #openFile, #importFile').count(), 0);
  assert.ok((await page.locator('#modelCanvas').boundingBox()).y < 140, 'the sheet starts near the top on a phone');
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
test('teacher opens a room straight into the lobby; a student joins, writes after 3-2-1, and sees the ranking ceremony', async () => {
  const noScroll = (p) => p.evaluate(() => document.documentElement.scrollHeight <= innerHeight && document.documentElement.scrollWidth <= innerWidth);
  await page.setViewportSize({ width: 1852, height: 775 });
  await page.goto(h.base + route + 'race/');
  await page.locator('#createRoom').waitFor({ state: 'visible' });
  // 방 만들기 앞에는 설정 창이 없다. 글·모드·관전은 대기실에서 고른다.
  assert.equal(await page.locator('#raceText').isVisible(), false);
  await page.locator('#createRoom').click();
  await page.locator('#bigCode').waitFor({ state: 'visible' });
  const code = await page.locator('#bigCode').textContent();
  await page.fill('#raceText', '가');
  // 교사는 기본으로 함께 쓰므로, 이 시험에서는 대기실에서 관전으로 바꾼다.
  await page.locator('#spectateRow').waitFor({ state: 'visible' });
  await page.check('#spectateInput');
  await page.waitForFunction(() => document.body.classList.contains('spectator'));
  const students = await browser.newContext({ viewport: { width: 768, height: 1024 }, hasTouch: true });
  try {
    await students.addCookies([{ name: 'test_user', value: '2', url: h.base }]);
    const p = await students.newPage();
    p.on('pageerror', (e) => errors.push(e.message));
    await p.goto(h.base + '/room/');
    await p.fill('#roomCode', code);
    await p.locator('#roomForm button').click();
    await p.locator('#readyButton').waitFor({ state: 'visible' });
    // 대기실에 방장이 고른 글이 칸마다 보이고, 들어온 사람이 아바타 자리에 선다.
    await p.waitForFunction(() => document.querySelector('#textTiles').textContent === '가');
    await page.waitForFunction(() => document.querySelectorAll('#lobbyPlayers .chip').length === 1);
    await p.locator('#readyButton').click();
    await page.waitForFunction(() => document.querySelector('#lobbyPlayers .chip.ready'));
    assert.equal(await noScroll(page), true, 'lobby fits 1852x775');
    await shot('room-lobby');
    await page.locator('#startRound').click();
    // 3·2·1 동안은 쓰지 못하고, 시작과 함께 열린다.
    await p.locator('#countdown').waitFor({ state: 'visible' });
    assert.equal(await p.locator('#writingCanvas').getAttribute('aria-disabled'), 'true');
    await p.waitForFunction(() => document.querySelector('#writingCanvas')?.getAttribute('aria-disabled') === 'false');
    await p.setViewportSize({ width: 1366, height: 768 });
    await p.waitForTimeout(250);
    assert.equal(await noScroll(p), true, 'writing fits 1366x768');
    await drawLetter(p, '가');
    // 먹길: 채운 글자 수만 교사 화면으로 가고(획 좌표는 가지 않는다), 말이 끝까지 나아간다.
    await page.waitForFunction(() => document.querySelector('#trackTokens .token')?.dataset.shown === '1');
    await shot('room-track');
    p.once('dialog', (d) => d.accept());
    await p.locator('#submitRound').click();
    await p.waitForFunction(() => document.querySelector('#rankRows').textContent.includes('획순 통과'));
    assert.match(await p.locator('#rankRows').textContent(), /1위.*(?:9[8-9]|100)%/);
    assert.equal(await p.locator('#writingCanvas').getAttribute('aria-disabled'), 'true');
    // 시상식: 아래 순위부터 공개하고, 1등 단에 장원 낙관이 찍힌다. 내 글씨 카드에는 내가 쓴 칸이 그려진다.
    await p.waitForFunction(() => document.querySelector('.step.place-1.crowned .jangwon'), null, { timeout: 15000 });
    assert.equal(await p.locator('#myCard canvas').count(), 1);
    await p.reload();
    await p.waitForFunction(() => document.querySelector('#rankRows').textContent.includes('획순 통과'));
    assert.equal(await p.evaluate(() => HandwritingApp.snapshot().cells.trace[0].length), 3);
    await page.waitForFunction(() => document.querySelector('.step.place-1.crowned'), null, { timeout: 15000 });
    assert.equal(await noScroll(page), true, 'results fit 1852x775');
    await shot('room-results');
    assert.equal(await page.locator('#raceText').isVisible(), true, 'teacher can choose the next text');
    await page.fill('#raceText', '나');
    await p.locator('#readyButton').click();
    await page.waitForFunction(() => document.querySelector('#rankRows .rank-row.ready'));
    await page.locator('#startRound').click();
    await p.waitForFunction(() => HandwritingApp.snapshot().text === '나');
    await p.waitForFunction(() => document.querySelector('#writingCanvas')?.getAttribute('aria-disabled') === 'false');
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

test('older font drafts are preserved before opening a new handwriting sheet', async () => {
  await page.goto(h.base + route);
  await ready();
  await drawLetter(page, '가');
  await page.evaluate(async () => {
    const older = HandwritingApp.snapshot();
    older.version = 7;
    HandwritingApp.store.set('draft', older);
    await HandwritingApp.store.flush();
  });
  await page.reload();
  await ready();
  const state = await page.evaluate(() => ({
    current: HandwritingApp.snapshot(),
    older: HandwritingApp.store.get('legacy-draft-v7'),
  }));
  assert.equal(state.current.version, 8);
  assert.equal(state.current.cells.trace[0].length, 0);
  assert.equal(state.older.cells.trace[0].length, 3);
});
test('notebook cells stay bounded across phone, tablet, Chromebook and desktop, align with the model above, and preserve ink', async () => {
  await page.goto(h.base + route);
  await ready();
  await drawLetter(page, '가');
  const before = await page.evaluate(() => HandwritingApp.snapshot().cells.trace[0]);
  const views = [
    ['phone', 390, 844],
    ['tablet', 768, 1024],
    ['chromebook', 1366, 768],
    ['desktop', 1920, 1080],
    ['wide', 2560, 1440],
    ['landscape-phone', 844, 390],
  ];
  for (const [name, width, height] of views) {
    await page.setViewportSize({ width, height });
    const cell = await page.locator('#writingCanvas').boundingBox(),
      model = await page.locator('#modelCanvas').boundingBox();
    // 칸은 64~104px(테두리 1px씩 제외). 본보기 칸은 같은 크기로 바로 위에 붙는다.
    assert.ok(cell.width >= 61 && cell.width <= 103, name + ': bounded writing cell ' + cell.width);
    assert.ok(Math.abs(cell.width - model.width) < 1, name + ': model and writing use the same size');
    assert.ok(Math.abs(cell.x - model.x) < 1 && model.y < cell.y && cell.y - model.y < cell.height + 3, name + ': model sits right above the writing cell');
    assert.ok(Math.abs(cell.height - cell.width) < 1, name + ': square writing cell');
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      true,
      name + ': no horizontal overflow',
    );
    assert.deepEqual(
      await page.evaluate(() => HandwritingApp.snapshot().cells.trace[0]),
      before,
      name + ': ink survives viewport changes',
    );
    if (['phone', 'tablet', 'chromebook', 'desktop'].includes(name)) await shot('pencil-size-' + name);
  }
  await page.locator('#settingsMenu summary').click();
  await page.selectOption('#cellSize', 'small');
  assert.ok(Math.abs((await page.locator('#writingCanvas').boundingBox()).width - 62) < 1);
  await page.evaluate(() => HandwritingApp.store.flush());
  await page.reload();
  await ready();
  assert.equal(await page.locator('#cellSize').inputValue(), 'small');
  assert.deepEqual(await page.evaluate(() => HandwritingApp.snapshot().cells.trace[0]), before);
  await page.locator('#settingsMenu summary').click();
  await page.selectOption('#cellSize', 'large');
  assert.ok(Math.abs((await page.locator('#writingCanvas').boundingBox()).width - 118) < 1);
  await page.selectOption('#cellSize', 'auto');
  assert.ok((await page.locator('#writingCanvas').boundingBox()).width <= 103);
});
test('the original pen font matches the designed outlines and the editor remains compact', async () => {
  await page.goto(h.base + route);
  await ready();
  assert.equal(await page.locator('#styleSelect option:checked').textContent(), '경필체 M');
  assert.equal(await page.evaluate(() => HandwritingFont.FAMILY), 'ClassJ Pen M');
  assert.equal(await page.evaluate(() => document.fonts.check('500 100px PracticeReference', '를어푸')), true);
  assert.ok(await page.evaluate(() => performance.getEntriesByType('resource').some(r => r.name.includes('/classj-pen-m/ClassJPenM-Regular.woff2'))));
  // 첫 화면에서 바로 본보기와 쓰기 칸이 보인다.
  assert.ok((await page.locator('#modelCanvas').boundingBox()).y < 115);
  assert.ok((await page.locator('#writingCanvas').boundingBox()).y < 240);
  assert.equal(
    await page.locator('.page-header, .practice-tip, input[type=file], #saveFile, #openFile').count(),
    0,
  );
  assert.equal(await page.locator('#settingsMenu').getAttribute('open'), null);
  const agreement = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d'),
      result = {};
    for (const char of Array.from('가나다라마바사아자차카타파하한글과괜읽읊교책얘에예와왜외워웨위의까따빠싸짜무늘믿귤확활훤를어푸구쿠누부궈궤귀쵸죠갛갗럽립붓밟뻐뼈띠고코쿄초연영건겁굿땅때떄곰임음열쐐뿔좋랍괘괴곤모포환균굴숲괵갗갛꽃ㅏㅓㅇㅎ')) {
      const glyph = HandwritingReference.glyph(char),
        layout = glyph.layout;
      ctx.resetTransform();
      ctx.clearRect(0, 0, 256, 256);
      ctx.scale(2.56, 2.56);
      ctx.font = '500 ' + layout[0] + 'px PracticeReference';
      ctx.fillText(char, layout[1], layout[2]);
      const pixels = ctx.getImageData(0, 0, 256, 256).data;
      ctx.resetTransform();
      ctx.clearRect(0, 0, 256, 256);
      ctx.scale(2.56, 2.56);
      ctx.beginPath();
      for (const contour of glyph.contours) {
        ctx.moveTo(...contour[0]);
        for (const point of contour.slice(1)) ctx.lineTo(...point);
        ctx.closePath();
      }
      ctx.fill();
      const expected = ctx.getImageData(0, 0, 256, 256).data;
      let union = 0,
        same = 0,
        nearby = 0,
        total = 0;
      const near = (pixels, i) => {
        const pixel = (i - 3) / 4,
          x = pixel % 256,
          y = Math.floor(pixel / 256);
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx,
              ny = y + dy;
            if (nx >= 0 && nx < 256 && ny >= 0 && ny < 256 && pixels[(ny * 256 + nx) * 4 + 3] > 40)
              return true;
          }
        return false;
      };
      for (let i = 3; i < pixels.length; i += 4) {
        const actual = pixels[i] > 40,
          target = expected[i] > 40;
        if (actual || target) union++;
        if (actual && target) same++;
        if (actual) {
          total++;
          if (near(expected, i)) nearby++;
        }
        if (target) {
          total++;
          if (near(pixels, i)) nearby++;
        }
      }
      result[char] = { overlap: same / union, nearby: nearby / total };
    }
    return result;
  });
  await shot('gyeongpil-desktop');
  // Direct Canvas polygons and the OS font rasterizer quantize thin stems differently.
  // Require both strong raw overlap and 99% agreement within one output pixel.
  for (const [char, value] of Object.entries(agreement))
    assert.ok(
      value.overlap > 0.85 && value.nearby > 0.99,
      char + ': original outline agreement ' + JSON.stringify(value),
    );
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.ok((await page.locator('#modelCanvas').boundingBox()).y < 140);
  await shot('gyeongpil-mobile');
  await page.setViewportSize({ width: 1366, height: 950 });
  await page.selectOption('#lessonSelect', 'custom');
  await page.fill('#customText', '꽃한글값읽');
  await page.locator('#customForm button').click();
  await shot('gyeongpil-final-consonants');
  await page.selectOption('#lessonSelect', 'school');
  await page.locator('[data-phase=solo]').click();
  for (const char of ['교', '책']) {
    await page.locator(`.write-cell[aria-label*=" ${char} 쓰는 칸"]`).first().focus();
    await shot('gyeongpil-school-' + char);
  }
  await page.selectOption('#lessonSelect', 'double');
  for (const char of ['얘', '워', '웨', '위']) {
    await page.locator(`.write-cell[aria-label*=" ${char} 쓰는 칸"]`).first().focus();
    await shot('gyeongpil-compound-' + char);
  }
  await page.selectOption('#lessonSelect', 'custom');
  await page.fill('#customText', '무늘믿귤확활훤');
  await page.locator('#customForm button').click();
  for (const char of ['무', '늘', '믿', '귤', '확', '활', '훤']) {
    await page.locator(`.write-cell[aria-label*=" ${char} 쓰는 칸"]`).first().focus();
    await shot('gyeongpil-structure-' + char);
  }
  await page.fill('#customText', '를어푸 늘름거');
  await page.locator('#customForm button').click();
  const mediumPaths = await page.evaluate(() => HandwritingCore.model('푸'));
  await shot('pen-m-applied-desktop');
  await page.selectOption('#styleSelect', 'badasseugi');
  assert.equal(await page.evaluate(() => HandwritingFont.style()), 'badasseugi');
  assert.notDeepEqual(await page.evaluate(() => HandwritingCore.model('푸')), mediumPaths);
  await page.selectOption('#styleSelect', 'gyeongpil');
  assert.deepEqual(await page.evaluate(() => HandwritingCore.model('푸')), mediumPaths);
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await shot('pen-m-applied-mobile');
  await page.setViewportSize({ width: 1366, height: 950 });
  await page.fill('#customText', '구쿠누부 궈궤귀쵸');
  await page.locator('#customForm button').click();
  await shot('pen-m-1400-applied-desktop');
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await shot('pen-m-1400-applied-mobile');
  await page.setViewportSize({ width: 1366, height: 950 });
  await page.fill('#customText', '붓밟교워 연영띠뼈');
  await page.locator('#customForm button').click();
  await shot('pen-m-1500-applied-desktop');
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await shot('pen-m-1500-applied-mobile');
  await page.setViewportSize({ width: 1366, height: 950 });
  await page.fill('#customText', '띠따립무 곤과유뿔');
  await page.locator('#customForm button').click();
  await shot('pen-m-1600-applied-desktop');
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await shot('pen-m-1600-applied-mobile');
  await page.setViewportSize({ width: 1366, height: 950 });
  await page.fill('#customText', '모포균환 궤괵숲꽃');
  await page.locator('#customForm button').click();
  await shot('pen-m-1700-applied-desktop');
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await shot('pen-m-1700-applied-mobile');
});
