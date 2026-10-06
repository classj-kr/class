// 학생 진도 셋(노노그램·슬라이딩 퍼즐 최고 기록, 그래프 칠판 현재 장면·보관함)이 브라우저가 아니라
// 계정별 서버 저장 공간에 남는지 실제 화면으로 확인한다. 로그인(쿠키 test_user=1)하면 서버에 남고
// 브라우저에는 옛 열쇠가 남지 않으며, 다른 브라우저에서 같은 계정으로 열면 그대로 보인다.
// 게스트(로그인 없음)는 어디에도 저장하지 않는다 -- 2026-10-06 결정.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { startHarness } = require('./site-storage-harness.cjs');
const { chromium } = require('../game-hub-server/node_modules/playwright');

const LEGACY = /^songhwaplay-(nonogram|sliding)-|^graph-board:/;
const legacyKeys = page => page.evaluate(pattern => Object.keys(localStorage).filter(k => new RegExp(pattern).test(k)), LEGACY.source);
const storedRows = h => h.db.query('SELECT COUNT(*)::int AS n FROM user_storage').then(r => r.rows[0].n);
// waitForFunction 에 async 함수를 주면 Promise 자체가 참으로 잡혀 바로 끝나므로 직접 되풀이해 묻는다.
async function waitUntil(fn, message, timeoutMs = 10000) {
  const until = Date.now() + timeoutMs;
  while (Date.now() < until) { const value = await fn(); if (value) return value; await new Promise(r => setTimeout(r, 150)); }
  throw new Error(message);
}

// 노노그램 5×5 문제은행은 app.js 안에 있다. 화면의 숫자 단서와 맞춰 어느 그림인지 알아낸 뒤 그 칸을 누른다.
const nonogramBank5 = [...fs.readFileSync(path.resolve(__dirname, '../learning/games/nonogram/app.js'), 'utf8').matchAll(/rows: \[((?:'[01]{5}',? ?){5})\]/g)].map(m => m[1].match(/[01]{5}/g));
const lineClues = line => { const runs = []; let count = 0; for (const ch of line) { if (ch === '1') count += 1; else if (count) { runs.push(count); count = 0; } } if (count) runs.push(count); return runs.length ? runs : [0]; };
const cluesOf = rows => JSON.stringify({ rows: rows.map(lineClues), cols: rows[0].split('').map((_, c) => lineClues(rows.map(r => r[c]).join(''))) });

// 8퍼즐은 너비 우선 탐색으로 가장 짧은 풀이를 찾는다(상태 18만 개 이하).
function solveSliding(tiles) {
  const size = 3, goal = '1,2,3,4,5,6,7,8,0', start = tiles.join(',');
  const parent = new Map([[start, null]]); const queue = [start];
  const neighbors = blank => { const r = Math.floor(blank / size), c = blank % size, out = []; if (r > 0) out.push(blank - size); if (r < size - 1) out.push(blank + size); if (c > 0) out.push(blank - 1); if (c < size - 1) out.push(blank + 1); return out; };
  while (queue.length) {
    const key = queue.shift(); if (key === goal) break;
    const values = key.split(',').map(Number), blank = values.indexOf(0);
    for (const next of neighbors(blank)) {
      const copy = values.slice(); [copy[blank], copy[next]] = [copy[next], copy[blank]]; const nextKey = copy.join(',');
      if (!parent.has(nextKey)) { parent.set(nextKey, { from: key, blank, tile: next }); queue.push(nextKey); }
    }
  }
  if (!parent.has(goal)) throw new Error('8퍼즐 풀이를 찾지 못했다');
  const keys = []; for (let key = goal; parent.get(key); key = parent.get(key).from) keys.unshift(parent.get(key));
  // 화살표는 빈칸 쪽으로 움직일 타일의 위치로 정한다(아래 타일을 올리면 ArrowUp).
  return keys.map(({ blank, tile }) => tile === blank + size ? 'ArrowUp' : tile === blank - size ? 'ArrowDown' : tile === blank + 1 ? 'ArrowLeft' : 'ArrowRight');
}

const LEGACY_GRAPH_STATE = { version: 1, title: '옛 수업', functions: [{ id: 1, expression: 'ax+b', kind: 'linear', params: { a: 1, b: 1, c: 0, h: 0, k: 0 }, visible: true }], activeId: 1, view: { x: 0, y: 0, range: 6 }, ghosts: [], trace: null, analysis: { mode: 'none', otherId: null, tangentX: 1, from: -2, to: 2 }, showCoordinates: true, showHandles: true };

(async () => {
  const h = await startHarness();
  let browser;
  const errors = [];
  async function open(url, { signedIn, legacy }) {
    const context = await browser.newContext({ viewport: { width: 1200, height: 900 } });
    if (signedIn) await context.addCookies([{ name: 'test_user', value: '1', url: h.base }]);
    const page = await context.newPage();
    page.on('pageerror', e => errors.push(`${url}: ${e.message}`));
    await page.goto(h.base + url);
    if (legacy) { // 예전 화면이 브라우저에 남긴 값을 둔 채 다시 연다.
      await page.evaluate(entries => { for (const [key, value] of entries) localStorage.setItem(key, JSON.stringify(value)); }, Object.entries(legacy));
      await page.reload();
    }
    return { context, page };
  }
  const puzzleReady = page => page.waitForFunction(() => document.getElementById('playerLine').textContent.length > 0, null, { timeout: 10000 });
  const graphReady = page => page.waitForFunction(() => document.getElementById('graphCanvas').width > 100, null, { timeout: 10000 });

  try {
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });

    // ── 노노그램: 5×5 한 판을 풀면 최고 기록이 서버에 남는다. 옛 10×10 기록은 옮겨지고 브라우저에서 지워진다.
    {
      const { context, page } = await open('/learning/games/nonogram/index.html', { signedIn: true, legacy: { 'songhwaplay-nonogram-10-best': { time: 77 } } });
      await puzzleReady(page);
      assert.deepEqual(await legacyKeys(page), [], '노노그램: 옮긴 뒤 브라우저에 남으면 안 된다');
      await waitUntil(async () => (await h.items('nonogram'))['best-10']?.time === 77, '노노그램: 옛 기록이 서버로 옮겨지지 않았다');
      await page.locator('#startButton').click();
      const clues = JSON.stringify(await page.evaluate(() => ({
        rows: [...document.querySelectorAll('#board .nb-row-clue')].map(el => [...el.children].map(s => Number(s.textContent))),
        cols: [...document.querySelectorAll('#board .nb-col-clue')].map(el => [...el.children].map(s => Number(s.textContent)))
      })));
      const rows = nonogramBank5.find(candidate => cluesOf(candidate) === clues);
      assert.ok(rows, '노노그램: 화면의 단서와 맞는 5×5 그림이 문제은행에 없다');
      for (let r = 0; r < 5; r += 1) for (let c = 0; c < 5; c += 1) if (rows[r][c] === '1') await page.locator(`#board .nb-cell[data-r="${r}"][data-c="${c}"]`).click();
      await page.waitForFunction(() => document.getElementById('status').textContent === 'PUZZLE COMPLETE!', null, { timeout: 5000 });
      const items = await waitUntil(async () => { const all = await h.items('nonogram'); return Number.isInteger(all['best-5']?.time) ? all : null; }, '노노그램: 최고 기록이 서버에 남지 않았다');
      assert.equal(items['best-10'].time, 77);
      assert.deepEqual(await legacyKeys(page), []);
      await context.close();
      // 다른 브라우저에서 같은 계정으로 열면 최고 기록이 보인다.
      const other = await open('/learning/games/nonogram/index.html', { signedIn: true });
      await puzzleReady(other.page);
      await other.page.locator('#startButton').click();
      assert.match(await other.page.locator('#bestScore').textContent(), /^\d\d:\d\d$/, '노노그램: 다른 브라우저에서 최고 기록이 보여야 한다');
      await other.context.close();
    }

    // ── 슬라이딩 퍼즐: 8퍼즐 한 판을 풀면 최고 기록이 서버에 남는다. 옛 4×4 기록은 옮겨진다.
    {
      const { context, page } = await open('/learning/games/sliding-puzzle/index.html', { signedIn: true, legacy: { 'songhwaplay-sliding-4-best': { moves: 50, time: 70 } } });
      await puzzleReady(page);
      assert.deepEqual(await legacyKeys(page), [], '슬라이딩 퍼즐: 옮긴 뒤 브라우저에 남으면 안 된다');
      await waitUntil(async () => (await h.items('sliding-puzzle'))['best-4']?.moves === 50, '슬라이딩 퍼즐: 옛 기록이 서버로 옮겨지지 않았다');
      await page.locator('#startButton').click();
      const tiles = await page.evaluate(() => [...document.querySelectorAll('#board > *')].map(el => el.classList.contains('empty') ? 0 : Number(el.textContent)));
      const keys = solveSliding(tiles);
      for (const key of keys) await page.keyboard.press(key);
      await page.waitForFunction(() => document.getElementById('status').textContent === 'PUZZLE COMPLETE!', null, { timeout: 5000 });
      const items = await waitUntil(async () => { const all = await h.items('sliding-puzzle'); return all['best-3']?.moves === keys.length ? all : null; }, '슬라이딩 퍼즐: 최고 기록이 서버에 남지 않았다');
      assert.equal(items['best-4'].moves, 50);
      assert.deepEqual(await legacyKeys(page), []);
      await context.close();
      const other = await open('/learning/games/sliding-puzzle/index.html', { signedIn: true });
      await puzzleReady(other.page);
      assert.equal(await other.page.locator('#bestScore').textContent(), `${keys.length}회`, '슬라이딩 퍼즐: 다른 브라우저에서 최고 기록이 보여야 한다');
      await other.context.close();
    }

    // ── 그래프 칠판: 옛 현재 장면은 옮겨지고, 수업을 보관하면 보관함과 현재 장면이 서버에 남는다.
    {
      const { context, page } = await open('/learning/literacy-numeracy/graph-studio/', { signedIn: true, legacy: { 'graph-board:current:v1': LEGACY_GRAPH_STATE } });
      await graphReady(page);
      assert.deepEqual(await legacyKeys(page), [], '그래프 칠판: 옮긴 뒤 브라우저에 남으면 안 된다');
      assert.equal(await page.locator('#lessonTitle').inputValue(), '옛 수업');
      await page.locator('#menuButton').click(); await page.locator('#scenesButton').click();
      await page.locator('#sceneName').fill('검증 수업');
      await page.getByRole('button', { name: '현재 수업 보관', exact: true }).click();
      await page.waitForFunction(() => document.getElementById('saveStatus').textContent === '계정에 자동 저장됨', null, { timeout: 10000 });
      const items = await h.items('graph-studio');
      assert.equal(items.scenes.length, 1); assert.equal(items.scenes[0].state.title, '검증 수업'); assert.equal(items.current.title, '검증 수업');
      assert.deepEqual(await legacyKeys(page), []);
      await context.close();
      const other = await open('/learning/literacy-numeracy/graph-studio/', { signedIn: true });
      await graphReady(other.page);
      assert.equal(await other.page.locator('#lessonTitle').inputValue(), '검증 수업', '그래프 칠판: 다른 브라우저에서 현재 장면이 이어져야 한다');
      await other.page.locator('#menuButton').click(); await other.page.locator('#scenesButton').click();
      assert.equal(await other.page.locator('#sceneList .scene-card strong').textContent(), '검증 수업', '그래프 칠판: 다른 브라우저에서 보관함이 보여야 한다');
      await other.context.close();
    }

    // ── 게스트: 옛 값은 브라우저에서 지워지되 서버로 가지 않고, 새로 한 일도 어디에도 남지 않는다.
    const rowsBefore = await storedRows(h);
    for (const [url, legacy] of [
      ['/learning/games/nonogram/index.html', { 'songhwaplay-nonogram-5-best': { time: 9 } }],
      ['/learning/games/sliding-puzzle/index.html', { 'songhwaplay-sliding-3-best': { moves: 9, time: 9 } }]
    ]) {
      const { context, page } = await open(url, { signedIn: false, legacy });
      await puzzleReady(page);
      assert.deepEqual(await legacyKeys(page), [], `${url}: 게스트의 옛 값도 브라우저에 남으면 안 된다`);
      assert.equal(await page.locator('#startButton').isDisabled(), true, `${url}: 게스트는 이름이 없어 시작하지 못한다`);
      assert.equal(await page.locator('#bestScore').textContent(), '—', `${url}: 게스트에게 옛 기록이 보이면 안 된다`);
      await context.close();
    }
    {
      const { context, page } = await open('/learning/literacy-numeracy/graph-studio/', { signedIn: false });
      await graphReady(page);
      assert.equal(await page.locator('#saveStatus').textContent(), '로그인하면 자동 저장돼요');
      await page.locator('#menuButton').click(); await page.locator('#scenesButton').click();
      await page.locator('#sceneName').fill('게스트 수업');
      await page.getByRole('button', { name: '현재 수업 보관', exact: true }).click();
      await page.waitForFunction(() => document.getElementById('toast').textContent.includes('이 탭에만'), null, { timeout: 5000 });
      await page.waitForTimeout(800);
      assert.equal(await page.locator('#sceneList .scene-card strong').textContent(), '게스트 수업');
      assert.deepEqual(await legacyKeys(page), []);
      assert.equal(await page.locator('#saveStatus').textContent(), '로그인하면 자동 저장돼요');
      await context.close();
    }
    assert.equal(await storedRows(h), rowsBefore, '게스트가 한 일은 서버에 남으면 안 된다');

    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ ok: true, storedRows: rowsBefore }));
  } finally {
    if (browser) await browser.close();
    await h.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
