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
      if (response.url().includes('/assets/sound/sfx/stone.ogg')) soundResponses.push(response.status());
    });
    for (const [game, initialStones] of [['omok', 0], ['reversi', 4]]) {
      await page.goto(`http://127.0.0.1:${server.address().port}/learning/games/board-coach/coach.html?game=${game}`);
      await page.waitForFunction(() => !!window.ClassGameSfx);
      await page.evaluate(() => {
        window.stoneSounds = [];
        const play = ClassGameSfx.play;
        ClassGameSfx.play = name => {
          const result = play(name);
          if (name === 'stone') stoneSounds.push(result);
          return result;
        };
      });
      await page.locator('#startLearning').click();
      assert.deepEqual(await page.evaluate(() => stoneSounds), [], `${game}: starting the game is silent`);
      await page.locator('#board button:not(:disabled)').first().click();
      await page.waitForFunction(() => stoneSounds.length === 2);
      await page.waitForFunction(count => document.querySelectorAll('#board .stone').length === count, initialStones + 2);
      assert.deepEqual(await page.evaluate(() => stoneSounds), [true, true], `${game}: human and AI moves play one stone sound each`);
      assert.ok(soundResponses.includes(200), `${game}: stone sound file loads`);
      await page.evaluate(() => ClassGameSfx.setMuted(true));
      await page.locator('#board button:not(:disabled)').first().click();
      await page.waitForFunction(() => stoneSounds.length === 4);
      await page.waitForFunction(count => document.querySelectorAll('#board .stone').length === count, initialStones + 4);
      assert.deepEqual(await page.evaluate(() => stoneSounds), [true, true, false, false], `${game}: mute applies to both moves`);
    }
    assert.deepEqual(errors, []);
    console.log('omok and reversi AI placement sound: human, AI, asset, and mute passed');
  } finally {
    await browser?.close();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
