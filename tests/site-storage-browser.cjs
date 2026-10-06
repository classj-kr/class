// 계정별 서버 저장 공간을 실제 화면(칠판)으로 돌린다: 그린 획이 서버에 남고 브라우저에는 남지 않으며,
// 다른 브라우저(다른 컴퓨터)에서 같은 계정으로 열면 그대로 보이고, 예전에 브라우저에 두던 것은 옮겨진 뒤 지워진다.
// 게스트(로그인 없음)는 아무것도 저장하지 않는다.
const assert = require('node:assert/strict');
const path = require('node:path');
const express = require('../game-hub-server/node_modules/express');
const { PGlite } = require('../game-hub-server/node_modules/@electric-sql/pglite');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { createUserStorage } = require('../game-hub-server/user-storage');

class HttpError extends Error { constructor(status, code, message) { super(message); this.status = status; this.code = code; } }

async function startHarness() {
  const db = new PGlite();
  await db.exec('CREATE TABLE classroom_users(id BIGINT PRIMARY KEY); INSERT INTO classroom_users VALUES(1);');
  const pool = { query: (sql, args) => db.query(sql, args) };
  const requireUser = async (req) => {
    if (!/test_teacher=1/.test(req.headers.cookie || '')) throw new HttpError(401, 'AUTH_REQUIRED', '로그인');
    return { id: 1 };
  };
  const feature = createUserStorage({ pool, requireUser, requireDatabase() {}, HttpError,
    asyncRoute: (fn) => (req, res, next) => Promise.resolve(fn(req, res)).catch(next) });
  await feature.initialize();
  const app = express();
  app.use(express.json({ limit: '1100kb' }));
  app.use('/api/me/storage', feature.router);
  app.use('/api', (_req, res) => res.status(404).json({ error: 'NOT_IN_HARNESS' }));
  app.use((error, _req, res, _next) => res.status(error.status || 500).json({ error: error.code, message: error.message }));
  app.use(express.static(path.resolve(__dirname, '..')));
  const server = await new Promise((resolve) => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  return { db, base: `http://127.0.0.1:${server.address().port}`, async close() { await new Promise((r) => server.close(r)); await db.close(); } };
}

async function draw(page, from, to) {
  const box = await page.locator('#board').boundingBox();
  await page.mouse.move(box.x + from[0], box.y + from[1]);
  await page.mouse.down();
  for (let i = 1; i <= 8; i += 1) await page.mouse.move(box.x + from[0] + (to[0] - from[0]) * i / 8, box.y + from[1] + (to[1] - from[1]) * i / 8);
  await page.mouse.up();
}
const localKeys = (page) => page.evaluate(() => Object.keys(localStorage).filter((k) => /blackboard/.test(k)));
// waitForFunction 에 async 함수를 주면 Promise 자체가 참으로 잡혀 바로 끝나므로 직접 되풀이해 묻는다.
async function waitForItems(page, test, timeoutMs = 10000) {
  const until = Date.now() + timeoutMs;
  while (Date.now() < until) {
    const items = await page.evaluate(async () => (await (await fetch('/api/me/storage/blackboard', { cache: 'no-store' })).json()).items);
    if (test(items)) return items;
    await page.waitForTimeout(150);
  }
  throw new Error('서버 저장 공간이 기대한 상태가 되지 않았다');
}

(async () => {
  const h = await startHarness();
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
    const first = await browser.newContext({ viewport: { width: 1200, height: 800 } });
    await first.addCookies([{ name: 'test_teacher', value: '1', url: h.base }]);
    const page = await first.newPage();
    const errors = []; page.on('pageerror', (e) => errors.push(e.message));

    // 예전 화면이 남긴 획과 도구 설정을 브라우저에 둔 채 연다.
    await page.goto(h.base + '/classtools/blackboard.html');
    await page.evaluate(() => {
      localStorage.setItem('classj-blackboard-v1', JSON.stringify([{ tool: 'pen', width: 8, color: '#f4f5e9', points: [{ x: 10, y: 10 }, { x: 60, y: 60 }] }]));
      localStorage.setItem('classj-blackboard-tools-v1', JSON.stringify({ pen: 12, eraser: 64, correction: false }));
    });
    await page.reload();
    await page.waitForFunction(() => document.getElementById('undoBtn') && !document.getElementById('undoBtn').disabled, null, { timeout: 10000 });
    assert.deepEqual(await localKeys(page), [], '옮긴 뒤 브라우저에 남으면 안 된다');
    await waitForItems(page, (items) => items.strokes?.length === 1 && items.tools);
    const tools = (await h.db.query("SELECT value FROM user_storage WHERE user_id = 1 AND app = 'blackboard' AND item = 'tools'")).rows[0].value;
    assert.equal(tools.pen, 12);
    assert.equal(tools.correction, false);

    // 획을 하나 더 긋고 400ms 모아 보내는 것을 기다린다.
    await draw(page, [100, 100], [300, 200]);
    await waitForItems(page, (items) => items.strokes?.length === 2);
    assert.deepEqual(await localKeys(page), []);

    // 다른 브라우저(다른 컴퓨터)에서 같은 계정으로 열면 그대로 있다.
    const second = await browser.newContext({ viewport: { width: 1200, height: 800 } });
    await second.addCookies([{ name: 'test_teacher', value: '1', url: h.base }]);
    const other = await second.newPage();
    other.on('pageerror', (e) => errors.push(e.message));
    await other.goto(h.base + '/classtools/blackboard.html');
    await other.waitForFunction(() => document.getElementById('undoBtn') && !document.getElementById('undoBtn').disabled, null, { timeout: 10000 });
    // 획은 크기를 잰 뒤 다음 그리기 틀에서 칠해지므로 잠시 되풀이해 본다.
    const litPixels = () => other.evaluate(() => {
      const ctx = document.getElementById('board').getContext('2d');
      const data = ctx.getImageData(0, 0, document.getElementById('board').width, document.getElementById('board').height).data;
      let lit = 0; for (let i = 0; i < data.length; i += 4) if (data[i] > 200 && data[i + 1] > 200) lit += 1; return lit;
    });
    let drawn = 0;
    for (let attempt = 0; attempt < 30 && drawn <= 100; attempt += 1) { drawn = await litPixels(); if (drawn <= 100) await other.waitForTimeout(200); }
    assert.ok(drawn > 100, '다른 브라우저에서도 획이 그려져 있어야 한다');

    // 게스트: 아무것도 저장하지 않는다.
    const guest = await browser.newContext({ viewport: { width: 1200, height: 800 } });
    const guestPage = await guest.newPage();
    guestPage.on('pageerror', (e) => errors.push(e.message));
    await guestPage.goto(h.base + '/classtools/blackboard.html');
    await guestPage.waitForFunction(() => document.getElementById('undoBtn'), null, { timeout: 10000 });
    await draw(guestPage, [50, 50], [250, 150]);
    await guestPage.waitForTimeout(800);
    assert.deepEqual(await localKeys(guestPage), []);
    assert.equal((await h.db.query('SELECT COUNT(*)::int AS n FROM user_storage')).rows[0].n, 2, '게스트 쪽은 서버에도 없다');

    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ ok: true, teacherItems: 2 }));
  } finally {
    if (browser) await browser.close();
    await h.close();
  }
})().catch((error) => { console.error(error); process.exit(1); });
