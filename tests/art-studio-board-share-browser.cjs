const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { createHarness } = require('./learning-boards-harness.cjs');

(async () => {
  const h = await createHarness();
  const errors = [];
  let browser;
  async function createBoard(layout) {
    const response = await fetch(h.base + '/api/boards/', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: 'test_teacher=1' },
      body: JSON.stringify({ title: layout, layout, columns: ['첫째 칸', '둘째 칸'] })
    });
    assert.equal(response.status, 201);
    return (await response.json()).board;
  }
  async function openStudio(cookie, title) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    if (cookie) await context.addCookies([{ name: cookie, value: cookie === 'test_student' ? '3' : '1', url: h.base }]);
    await context.addInitScript(() => {
      localStorage.setItem('artStudio.boardNumber', '99');
      window.CLASS_PLAYER_NAME = '오래된 표시 이름';
    });
    const page = await context.newPage(), joins = [], writes = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {
      if (request.url().endsWith('/api/boards/join')) joins.push(request.postDataJSON());
      if (request.method() === 'POST' && /\/api\/boards\/[^/]+\/(images|posts)$/.test(request.url())) writes.push(request.url());
    });
    await page.goto(h.base + '/learning/arts/art-studio/');
    await page.waitForFunction(() => Boolean(window.artStudio));
    await page.locator('#drawingTitle').fill(title);
    const box = await page.locator('#mainCanvas').boundingBox();
    await page.mouse.move(box.x + 20, box.y + 20);
    await page.mouse.down();
    await page.mouse.move(box.x + 70, box.y + 60, { steps: 5 });
    await page.mouse.up();
    await page.locator('#shareBtn').click();
    assert.equal(await page.locator('#shareNumber, #shareName, #shareIdentity').count(), 0);
    assert.equal(await page.locator('#shareColumnLabel').isVisible(), false);
    return { context, page, joins, writes };
  }
  async function submit(page, board) {
    await page.locator('#shareCode').fill(board.code);
    await page.locator('#shareSubmit').click();
    await page.locator('#shareDone').waitFor({ state: 'visible' });
    assert.equal(await page.locator('#shareSubmit').isVisible(), false);
  }
  async function readBoard(context, board) {
    const response = await context.request.get(h.base + '/api/boards/' + board.id);
    assert.equal(response.status(), 200);
    return response.json();
  }
  async function capture(page, name) {
    const directory = path.resolve(__dirname, '../outputs/art-studio-board-share');
    fs.mkdirSync(directory, { recursive: true });
    const conversion = spawnSync('python', ['-c',
      'import io,sys; from PIL import Image; src=Image.open(io.BytesIO(sys.stdin.buffer.read())).convert("RGBA"); src.save(sys.argv[1],format="WEBP",lossless=True); out=Image.open(sys.argv[1]).convert("RGBA"); assert out.size==src.size and out.tobytes()==src.tobytes()',
      path.join(directory, name)], { input: await page.screenshot() });
    assert.equal(conversion.status, 0, conversion.stderr?.toString());
  }
  try {
    const wall = await createBoard('wall'), columns = await createBoard('columns');
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
    const student = await openStudio('test_student', '학생 그림');
    await capture(student.page, 'share-desktop.webp');
    await student.page.setViewportSize({ width: 390, height: 844 });
    const dialogBox = await student.page.locator('#shareDialog').boundingBox();
    assert.ok(dialogBox.x >= 0 && dialogBox.x + dialogBox.width <= 390, 'dialog fits mobile width');
    assert.equal(await student.page.locator('#shareColumnLabel').isVisible(), false);
    await capture(student.page, 'share-mobile.webp');
    await submit(student.page, wall);
    let view = await readBoard(student.context, wall);
    assert.equal(view.me.name, '학생3');
    assert.equal(view.me.number, 7, 'server identity wins over old browser values');
    assert.equal(view.posts[0].content, '학생 그림');
    assert.equal(view.posts[0].author, '7번 학생3');
    assert.equal(view.posts[0].mine, true);
    const picture = await student.context.request.get(`${h.base}/api/boards/${wall.id}/images/${view.posts[0].image}`);
    assert.equal(picture.status(), 200);
    assert.match(picture.headers()['content-type'], /^image\/webp/);
    assert.deepEqual(student.joins, [{ code: wall.code }]);

    // A column must be selected before uploading, and changing rooms hides it again.
    await student.page.locator('#shareClose').click();
    await student.page.locator('#shareBtn').click();
    await student.page.locator('#shareCode').fill(columns.code);
    await student.page.locator('#shareSubmit').click();
    await student.page.locator('#shareColumnLabel').waitFor({ state: 'visible' });
    assert.equal(student.writes.length, 2, 'no premature column upload');
    await student.page.locator('#shareCode').fill(wall.code);
    assert.equal(await student.page.locator('#shareColumnLabel').isVisible(), false);
    await student.page.locator('#shareCode').fill(columns.code);
    await student.page.locator('#shareSubmit').click();
    await student.page.locator('#shareColumnLabel').waitFor({ state: 'visible' });
    await student.page.locator('#shareColumn').selectOption('1');
    await student.page.locator('#shareSubmit').click();
    await student.page.locator('#shareDone').waitFor({ state: 'visible' });
    view = await readBoard(student.context, columns);
    assert.equal(view.posts.length, 1);
    assert.equal(view.posts[0].column, 1);
    assert.ok(student.joins.every(body => Object.keys(body).join() === 'code'));

    // Exercise the actual GIF encoder and upload, retaining title-quiz options.
    await student.page.locator('#shareClose').click();
    await student.page.locator('#drawingTitle').fill('학생 플립북');
    await student.page.locator('#flipbookBtn').click();
    await student.page.locator('#dupFrameBtn').click();
    await student.page.locator('#shareBtn').click();
    await student.page.locator('#shareQuiz summary').click();
    for (const [i, value] of ['다른 제목 가', '다른 제목 나', '다른 제목 다'].entries()) {
      await student.page.locator('.share-decoy').nth(i).fill(value);
    }
    await submit(student.page, wall);
    view = await readBoard(student.context, wall);
    const flipbook = view.posts.find(post => post.content === '학생 플립북');
    assert.equal(flipbook.author, '7번 학생3');
    assert.equal(flipbook.decoys.length, 3);
    const animation = await student.context.request.get(`${h.base}/api/boards/${wall.id}/images/${flipbook.image}`);
    assert.equal(animation.status(), 200);
    assert.match(animation.headers()['content-type'], /^image\/gif/);
    assert.equal(view.members.length, 1, 'reopening the dialog does not create another student');
    await student.context.close();

    for (const [cookie, author] of [['test_teacher', '선생님'], ['test_guest', '1번 게스트']]) {
      const user = await openStudio(cookie, cookie);
      await submit(user.page, wall);
      view = await readBoard(user.context, wall);
      assert.equal(view.posts.find(post => post.content === cookie).author, author);
      assert.deepEqual(user.joins, [{ code: wall.code }]);
      await user.context.close();
    }

    // Missing sessions get a recovery message without asking for personal details
    // or discarding the drawing; retry succeeds after login in another tab.
    const expired = await openStudio(null, '로그인 후 다시 올리기');
    await expired.page.locator('#shareCode').fill(wall.code);
    await expired.page.locator('#shareSubmit').click();
    await expired.page.waitForFunction(() => document.getElementById('shareError').textContent.includes('다른 탭에서 로그인'));
    assert.equal(await expired.page.locator('#shareNumber, #shareName').count(), 0);
    assert.equal(expired.writes.length, 0);
    assert.equal(await expired.page.locator('#drawingTitle').inputValue(), '로그인 후 다시 올리기');
    await expired.context.addCookies([{ name: 'test_student', value: '4', url: h.base }]);
    await expired.page.locator('#shareSubmit').click();
    await expired.page.locator('#shareDone').waitFor({ state: 'visible' });
    view = await readBoard(expired.context, wall);
    assert.equal(view.me.name, '학생4');
    assert.ok(view.posts.find(post => post.content === '로그인 후 다시 올리기').mine);
    await expired.context.close();
    assert.deepEqual(errors, []);
    console.log('PASS: desktop/mobile share without identity inputs; account authorship, WebP/GIF uploads, columns, teacher/guest entry and login recovery.');
  } finally { await browser?.close(); await h.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
