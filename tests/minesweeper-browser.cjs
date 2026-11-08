'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const passed = [], errors = [];
const server = http.createServer((req, res) => {
  let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(pathname.includes('storage') ? { items: {} } : { records: [] }));
  }
  // Keep the audit local, including score writes and identity/network services.
  if (pathname === '/assets/network/game-network.js') {
    res.setHeader('Content-Type', 'text/javascript');
    return res.end('window.ClassroomNetwork = { HTTP_URL: location.origin };');
  }
  if (pathname.endsWith('/')) pathname += 'index.html';
  const file = path.resolve(root, '.' + pathname);
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  fs.readFile(file, (error, bytes) => {
    if (error) return res.writeHead(404).end();
    res.setHeader('Content-Type', ({ '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.ogg': 'audio/ogg', '.webp': 'image/webp' })[path.extname(file)] || 'application/octet-stream');
    res.end(bytes);
  });
});

async function main() {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const origin = `http://127.0.0.1:${server.address().port}`;
  const reset = page => page.evaluate(() => { soundProbe.calls = []; soundProbe.playing = []; soundProbe.oscillators = 0; });
  const cell = (page, i) => page.locator(`.mb-cell[data-i="${i}"]`);
  const snapshot = page => page.evaluate(() => ({
    opened: [...document.querySelectorAll('.mb-cell')].filter(c => c.classList.contains('open')).map(c => Number(c.dataset.i)),
    flagged: [...document.querySelectorAll('.mb-cell.flagged')].map(c => Number(c.dataset.i)),
    mines: lastBoard.mines, counts: lastBoard.counts,
    table: MineLogic.makeNeighborTable(8, 8)
  }));

  async function check(page, label, expected, { files = expected, oscillators = 0 } = {}) {
    if (files.length) await page.waitForFunction(names => names.every(name => soundProbe.playing.includes(name + '.ogg')), files);
    await page.waitForTimeout(100);
    const actual = await page.evaluate(() => soundProbe);
    assert.deepEqual(actual.calls, expected, `${label}: exactly one cue per effective action`);
    assert.deepEqual(actual.playing, files.map(name => name + '.ogg'), `${label}: real audio playing events`);
    assert.equal(actual.oscillators, oscillators, `${label}: no stray synthesized clicks`);
    passed.push(label);
  }

  try {
    for (const touch of [false, true]) {
      const input = touch ? 'touch' : 'mouse';
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, hasTouch: touch });
      page.on('pageerror', error => errors.push(`${input}: ${error.message}`));
      await page.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
      await page.addInitScript(() => {
        Object.defineProperty(window, 'CLASS_PLAYER_NAME', { get: () => '검증가람', set() {} });
        localStorage.setItem('classMusicMuted', 'true');
        localStorage.setItem('classSfxMuted', '0');
        localStorage.setItem('classSfxVolumeValue', '.65');
        window.soundProbe = { calls: [], playing: [], oscillators: 0 };
        const play = HTMLMediaElement.prototype.play;
        HTMLMediaElement.prototype.play = function () {
          const playing = soundProbe.playing;
          if (this.src.includes('/sfx/')) this.addEventListener('playing', () => playing.push(this.src.split('/').pop()), { once: true });
          return play.call(this);
        };
        const oscillator = BaseAudioContext.prototype.createOscillator;
        BaseAudioContext.prototype.createOscillator = function () {
          soundProbe.oscillators++;
          return oscillator.call(this);
        };
      });
      await page.goto(origin + '/learning/games/minesweeper/');
      await page.waitForFunction(() => window.ClassGameSfx && !document.getElementById('startButton').disabled);
      await page.evaluate(() => {
        const play = ClassGameSfx.play;
        ClassGameSfx.play = name => { soundProbe.calls.push(name); return play(name); };
        const generate = MineLogic.generate;
        MineLogic.generate = (...args) => {
          let seed = 83;
          const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 0x100000000; };
          window.lastBoard = generate(...args, { random });
          return lastBoard;
        };
      });
      const click = locator => touch ? locator.tap() : locator.click();
      await click(page.locator('#startButton'));
      await reset(page);
      await click(cell(page, 27));
      await check(page, `${input}: flood reveal`, ['card']);

      let state = await snapshot(page);
      const single = state.mines.findIndex((mine, i) => !mine && state.counts[i] > 0 && !state.opened.includes(i));
      assert.ok(single >= 0);
      await reset(page);
      await click(cell(page, single));
      await check(page, `${input}: single cell`, ['stone']);

      state = await snapshot(page);
      const mine = state.mines.indexOf(true);
      if (touch) {
        // Real touch input for long-press, including the follow-up click suppression.
        const session = await page.context().newCDPSession(page);
        async function longPress() {
          const box = await cell(page, mine).boundingBox();
          await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x + box.width / 2, y: box.y + box.height / 2 }] });
          await page.waitForTimeout(500);
          await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        }
        await reset(page); await longPress();
        await check(page, 'touch: long-press flag once', ['select']);
        assert.equal(await cell(page, mine).getAttribute('class').then(c => c.includes('flagged')), true);
        await reset(page); await longPress();
        await check(page, 'touch: long-press unflag once', ['back']);
        await session.detach();
      } else {
        await reset(page); await cell(page, mine).click({ button: 'right' });
        await check(page, 'mouse: right-click flag', ['select']);
        await reset(page); await cell(page, mine).click({ button: 'right' });
        await check(page, 'mouse: right-click unflag', ['back']);
      }

      await cell(page, mine).focus();
      await reset(page); await page.keyboard.press('f');
      await check(page, `${input}: keyboard flag`, ['select']);
      await reset(page); await page.keyboard.press('f');
      await check(page, `${input}: keyboard unflag`, ['back']);

      await click(page.locator('#toolFlagButton'));
      await reset(page); await click(cell(page, mine));
      await check(page, `${input}: flag tool`, ['select']);
      await click(page.locator('#toolOpenButton'));
      await reset(page); await click(cell(page, mine));
      await check(page, `${input}: flagged cell stays closed and silent`, []);
      await cell(page, mine).focus(); await page.keyboard.press('f');

      state = await snapshot(page);
      const chord = state.opened.find(i => state.counts[i] > 0 && state.table[i].some(j => !state.opened.includes(j) && !state.mines[j]));
      assert.notEqual(chord, undefined);
      await reset(page); await click(cell(page, chord));
      await check(page, `${input}: incomplete chord`, ['tick']);
      for (const j of state.table[chord].filter(i => state.mines[i])) {
        await cell(page, j).focus(); await page.keyboard.press('f');
      }
      const safeCount = state.table[chord].filter(j => !state.mines[j] && !state.opened.includes(j)).length;
      await reset(page); await click(cell(page, chord));
      const newly = (await snapshot(page)).opened.length - state.opened.length;
      assert.ok(newly >= safeCount && newly > 0);
      await check(page, `${input}: successful chord`, [newly > 1 ? 'card' : 'stone']);
      await reset(page); await click(cell(page, chord));
      await check(page, `${input}: completed chord silent`, []);

      // Check the actual settings controls, preserving their shared mute contract.
      await click(page.locator('.unified-audio-menu-toggle'));
      await click(page.locator('#sfxMuteBtn'));
      await click(page.locator('.unified-audio-menu-toggle'));
      state = await snapshot(page);
      const mutedCell = state.mines.findIndex((_, i) => !state.opened.includes(i) && !state.flagged.includes(i));
      await cell(page, mutedCell).focus();
      await reset(page); await page.keyboard.press('f');
      await check(page, `${input}: mute suppresses flag audio`, ['select'], { files: [] });
      await page.keyboard.press('f');
      await click(page.locator('.unified-audio-menu-toggle'));
      await click(page.locator('#sfxMuteBtn'));
      await click(page.locator('.unified-audio-menu-toggle'));
      state = await snapshot(page);
      const hit = state.mines.findIndex((isMine, i) => isMine && !state.flagged.includes(i));
      assert.ok(hit >= 0);
      await reset(page); await click(cell(page, hit));
      await check(page, `${input}: mine explosion without generic click`, ['explosion']);
      await page.waitForTimeout(750);
      await reset(page); await click(cell(page, hit));
      await check(page, `${input}: finished board silent`, []);

      await click(page.locator('#retryButton'));
      assert.equal(await page.locator('.mb-cell.hit').count(), 0);
      assert.equal(await page.locator('.mb-cell.flagged').count(), 0);
      state = await snapshot(page);
      assert.ok(state.opened.includes(27), 'retry reopens the same safe starting area');
      await page.evaluate(() => { ClassGameSfx.setVolume(0); });
      await cell(page, mine).focus(); await reset(page); await page.keyboard.press('f');
      await check(page, `${input}: zero volume suppresses audio`, ['select'], { files: [] });
      await page.keyboard.press('f');
      await page.evaluate(() => { ClassGameSfx.setVolume(.65); });

      // A wrong flag must still lose, with just the explosion (no reveal cue).
      state = await snapshot(page);
      const wrongChord = state.opened.find(i => state.counts[i] > 0 &&
        state.table[i].some(j => !state.opened.includes(j) && !state.mines[j]));
      assert.notEqual(wrongChord, undefined);
      const wrongFlag = state.table[wrongChord].find(j => !state.opened.includes(j) && !state.mines[j]);
      const correctFlags = state.table[wrongChord].filter(j => state.mines[j]).slice(1);
      for (const j of [wrongFlag, ...correctFlags]) {
        await cell(page, j).focus(); await page.keyboard.press('f');
      }
      await reset(page); await click(cell(page, wrongChord));
      await check(page, `${input}: wrong chord explodes once`, ['explosion']);
      assert.equal(await page.locator('.mb-cell.hit').count(), 1);
      assert.ok((await cell(page, wrongFlag).getAttribute('class')).includes('wrong'));
      await click(page.locator('#retryButton'));
      await page.waitForTimeout(800);
      assert.equal(await page.locator('.mb-cell.mine').count(), 0, 'retry cancels delayed mine reveals');
      state = await snapshot(page);

      // Win through normal UI events; count every emitted victory cue.
      await reset(page);
      for (let i = 0; i < state.mines.length; i++) {
        if (!state.mines[i] && !(await cell(page, i).getAttribute('class')).split(' ').includes('open')) await click(cell(page, i));
      }
      await page.locator('#celebration:not([hidden])').waitFor();
      await page.waitForFunction(() => soundProbe.playing.includes('success.ogg'));
      assert.equal(await page.evaluate(() => soundProbe.calls.filter(n => n === 'success').length), 1);
      assert.equal(await page.evaluate(() => soundProbe.playing.filter(n => n === 'success.ogg').length), 1);
      passed.push(`${input}: victory plays once`);
      assert.equal(await page.locator('#minesLeft').innerText(), '0');

      await click(page.locator('#playAgainButton'));
      await page.evaluate(() => { window.generateBeforeFailure = MineLogic.generate; MineLogic.generate = () => null; });
      await reset(page); await click(cell(page, 27));
      await check(page, `${input}: exhausted generator gives retryable feedback`, ['error']);
      assert.equal(await page.locator('.mb-cell.open').count(), 0, 'never show an unverified fallback');
      assert.match(await page.locator('#status').innerText(), /다시 눌러/);
      await page.evaluate(() => { MineLogic.generate = generateBeforeFailure; });
      await reset(page); await click(cell(page, 27));
      await check(page, `${input}: generation can recover`, ['card']);
      assert.ok(await page.locator('.mb-cell.open').count() > 0);
      assert.equal(await page.locator('#status').innerText(), '', 'successful retry clears generation error');
      await page.close();
    }
    assert.deepEqual(errors, [], 'no uncaught browser errors');
    console.log(JSON.stringify({ passed: passed.length, checks: passed, errors }, null, 2));
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
