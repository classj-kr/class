'use strict';
const fs = require('node:fs'), path = require('node:path'), http = require('node:http'), assert = require('node:assert/strict');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const games = [
  ['janggi', '장기', 'janggi-coach', 90], ['chess', '체스', 'chess-coach', 64],
  ['omok', '오목', 'coach', 225], ['reversi', '리버시', 'coach', 64]
];
async function main() {
  const server = http.createServer((req, res) => {
    const file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
    fs.readFile(file, (error, data) => {
      if (error) { res.writeHead(404); res.end(); return; }
      res.setHeader('Content-Type', ({ '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.webp': 'image/webp' })[path.extname(file)] || 'application/octet-stream');
      res.end(data);
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/learning/games/board-coach/coach.html`, errors = [];
  const output = path.join(root, 'tmp/coach-loading');
  let browser;
  async function ready(page) {
    await page.waitForFunction(() => document.documentElement.dataset.coachState === 'ready' && document.querySelector('#setup')?.open);
    assert.equal(await page.locator('#coachLoading').isVisible(), false);
    assert.equal(await page.locator('#setup').isVisible(), true);
    assert.equal(await page.evaluate(() => document.querySelector('#setup').contains(document.activeElement)), true, 'focus enters the visible setup');
  }
  try {
    browser = await chromium.launch({ headless: true, channel: 'msedge' });
    fs.mkdirSync(output, { recursive: true });
    for (const width of [390, 1280]) {
      for (const [game, name, controller, count] of games) {
        const page = await browser.newPage({ viewport: { width, height: 850 } });
        page.on('pageerror', e => errors.push(`${game}: ${e.message}`));
        let release;
        const held = new Promise(resolve => { release = resolve; });
        await page.route(`**/${controller}.js?*`, async route => { await held; await route.continue(); });
        await page.goto(`${url}?game=${game}`, { waitUntil: 'commit' });
        await page.waitForFunction(() => document.querySelector('#title') && document.documentElement.dataset.coachGame);
        assert.equal(await page.title(), `${name} · AI와 배우기`);
        assert.equal(await page.locator('#coachLoadingTitle').innerText(), `${name} AI 대전`);
        assert.equal(await page.locator('#coachLoading').isVisible(), true);
        assert.equal(await page.locator('#coachBack').getAttribute('href'), `../${game}/${game}`);
        // Sample actual animation frames while the controller download is stalled.
        const frames = await page.evaluate(async () => {
          const samples = [];
          for (let i = 0; i < 6; i++) {
            await new Promise(requestAnimationFrame);
            samples.push(['#title', '#board', '#newGame', '#startLearning'].some(selector => document.querySelector(selector).checkVisibility({ visibilityProperty: true })));
          }
          return samples;
        });
        assert.deepEqual(frames, Array(6).fill(false), 'uninitialized game never appears in a painted frame');
        if (game === 'janggi') await page.screenshot({ path: path.join(output, `janggi-loading-${width}.png`) });
        release();
        await ready(page);
        assert.equal(await page.locator('#title').textContent(), name);
        assert.equal(await page.locator('#board [data-index], #board [data-square]').count(), count);
        await page.locator('#startLearning').click();
        assert.equal(await page.locator('#board').isVisible(), true);
        assert.equal(await page.locator('#setup').isVisible(), false);
        if (game === 'janggi') await page.screenshot({ path: path.join(output, `janggi-ready-${width}.png`) });
        console.log(`${game} ${width}px: stalled download hides shared shell, correct board and setup appear together PASS`);
        await page.close();
      }
    }
    const retry = await browser.newPage();
    let fail = true;
    await retry.route('**/janggi-coach.js?*', route => fail ? route.abort() : route.continue());
    await retry.goto(`${url}?game=janggi`);
    assert.equal(await retry.locator('html').getAttribute('data-coach-state'), 'error');
    assert.equal(await retry.locator('#coachLoadingTitle').innerText(), '장기 AI 대전');
    assert.match(await retry.locator('#coachLoadingMessage').innerText(), /불러오지 못했어요/);
    assert.equal(await retry.locator('#coachReload').isVisible(), true);
    assert.equal(await retry.locator('#board').isVisible(), false);
    fail = false;
    await retry.locator('#coachReload').click();
    await ready(retry);
    assert.equal(await retry.locator('#title').innerText(), '장기');
    await retry.close();
    console.log('Failed download: actionable error and retry preserve selected game PASS');

    const dependency = await browser.newPage();
    await dependency.route('**/janggi-ai.js?*', route => route.abort());
    await dependency.goto(`${url}?game=janggi`);
    assert.equal(await dependency.locator('html').getAttribute('data-coach-state'), 'error');
    assert.equal(await dependency.locator('#coachReload').isVisible(), true);
    assert.equal(await dependency.locator('#board').isVisible(), false);
    await dependency.close();
    console.log('Failed initialization: shared shell remains hidden with recovery controls PASS');

    for (const query of ['', '?game=unknown', '?game=__proto__']) {
      const fallback = await browser.newPage();
      fallback.on('pageerror', e => errors.push(e.message));
      await fallback.goto(url + query);
      await ready(fallback);
      assert.equal(await fallback.locator('#title').innerText(), '리버시');
      await fallback.close();
    }
    const noScript = await browser.newPage({ javaScriptEnabled: false });
    await noScript.goto(`${url}?game=janggi`);
    assert.match(await noScript.locator('#coachLoading').innerText(), /자바스크립트를 켜/);
    assert.equal(await noScript.locator('#board').isVisible(), false);
    assert.equal(await noScript.locator('#coachBack').isVisible(), true);
    await noScript.close();
    assert.deepEqual(errors, []);
    console.log('Default URL, invalid game and JavaScript-disabled fallback PASS');
  } finally {
    await browser?.close(); server.closeAllConnections(); await new Promise(resolve => server.close(resolve));
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
