'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('../game-hub-server/node_modules/playwright');

const root = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', ({ '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.ogg': 'audio/ogg' })[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
    const page = await browser.newPage();
    const errors = [], soundResponses = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.url().includes('/assets/sound/sfx/boards/')) soundResponses.push(response.url());
    });
    for (const [game, initialStones] of [['omok', 0], ['reversi', 4]]) {
      await page.goto(`http://127.0.0.1:${server.address().port}/learning/games/board-coach/coach.html?game=${game}`);
      await page.waitForFunction(() => !!window.ClassGameSfx);
      await page.evaluate(() => {
        window.stoneSounds = [];
        const play = ClassGameSfx.play;
        ClassGameSfx.play = name => {
          const result = play(name);
          if (name === 'stone' || name === 'capture') stoneSounds.push(result);
          return result;
        };
      });
      await page.locator('#startLearning').click();
      assert.deepEqual(await page.evaluate(() => stoneSounds), [], `${game}: starting the game is silent`);
      await page.locator('#board button:not(:disabled)').first().click();
      await page.waitForFunction(() => stoneSounds.length === 2);
      await page.waitForFunction(count => document.querySelectorAll('#board .stone').length === count, initialStones + 2);
      assert.deepEqual(await page.evaluate(() => stoneSounds), [true, true], `${game}: human and AI moves play one stone sound each`);
      const action = game === 'reversi' ? 'capture' : 'stone';
      assert.ok(soundResponses.some(url => url.includes(`/${game}-${action}.ogg?v=20261116-reversi-contact`)),
        `${game}: its versioned sound file loads`);
      await page.evaluate(() => ClassGameSfx.setMuted(true));
      await page.locator('#board button:not(:disabled)').first().click();
      await page.waitForFunction(() => stoneSounds.length === 4);
      await page.waitForFunction(count => document.querySelectorAll('#board .stone').length === count, initialStones + 4);
      assert.deepEqual(await page.evaluate(() => stoneSounds), [true, true, false, false], `${game}: mute applies to both moves`);
    }
    await page.goto(`http://127.0.0.1:${server.address().port}/learning/games/board-coach/coach.html?game=janggi`);
    await page.waitForFunction(() => !!window.ClassGameSfx);
    const janggi = await page.evaluate(() => {
      const sources = [];
      HTMLMediaElement.prototype.play = function () { sources.push(this.src); return Promise.resolve(); };
      ClassGameSfx.setMuted(false);
      ClassGameSfx.setVolume(.65);
      ClassGameSfx.play('stone');
      return { sources, capture: ClassGameSfx.play('capture') };
    });
    assert.equal(janggi.sources.length, 1, 'Janggi capture uses the original Web Audio sound');
    assert.ok(janggi.sources[0].endsWith('/assets/sound/sfx/stone.ogg'), 'Janggi placement uses the original recording');
    assert.equal(janggi.capture, true);
    assert.deepEqual(errors, []);
    console.log('omok and reversi AI placement sound: human, AI, asset, and mute passed');
  } finally {
    await browser?.close();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
