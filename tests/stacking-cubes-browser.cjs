const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const express = require('../game-hub-server/node_modules/express');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const activities = require('../learning/inquiry/math/stacking-cubes/activities.js');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'outputs/stacking-cubes-review');
const shots = process.argv.includes('--shots');
const onlyViewport = process.argv.find(arg => arg.startsWith('--viewport='))?.split('=')[1];
const convert = "import io,sys;from PIL import Image;im=Image.open(io.BytesIO(sys.stdin.buffer.read())).convert('RGBA');im.save(sys.argv[1],format='WEBP',lossless=True);out=Image.open(sys.argv[1]).convert('RGBA');assert im.size==out.size and im.tobytes()==out.tobytes()";

(async () => {
  const app = express();
  app.get('/api/site/access', (_, res) => res.json({ mode: 'open' }));
  app.get('/api/auth/me', (_, res) => res.json({ signedIn: true, user: { id: 1, name: '검수교사', role: 'teacher' } }));
  app.get('/api/teacher/profile', (_, res) => res.json({ profiles: [{ name: '검수교사', schoolName: '검수학교', teacherType: '담임', grade: 3, classNumber: 1 }] }));
  app.get('/api/home-content-access', (_, res) => res.json({ mode: 'open', enabledPaths: [], globallyDisabledPaths: [], hasClassAccess: false, canManage: false, canManageGlobally: false }));
  app.use('/api', (_, res) => res.json({}));
  app.use(express.static(path.join(root, 'apps')));
  app.use(express.static(root));
  const server = await new Promise(resolve => { const instance = app.listen(0, '127.0.0.1', () => resolve(instance)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
    if (shots) fs.mkdirSync(output, { recursive: true });
    for (const [name, width, height, touch] of [['desktop', 1440, 1000, false], ['tablet', 820, 1180, true], ['phone', 390, 844, true], ['landscape', 844, 390, true]]) {
      if (onlyViewport && onlyViewport !== name) continue;
      const context = await browser.newContext({ viewport: { width, height }, hasTouch: touch });
      await context.addInitScript(() => {
        const NativeAudioContext = window.AudioContext;
        window.audioContextCount = 0;
        window.AudioContext = class extends NativeAudioContext {
          constructor(...args) { super(...args); window.audioContextCount++; }
        };
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const activate = locator => touch ? locator.tap() : locator.click();
      const total = count => page.waitForFunction(expected => document.getElementById('total').textContent === `전체 ${expected}개`, count);
      const snap = async suffix => {
        if (!shots) return;
        await page.mouse.move(width - 8, 3);
        await page.waitForTimeout(80);
        const result = spawnSync('python', ['-c', convert, path.join(output, `${name}-${suffix}.webp`)], { input: await page.screenshot() });
        assert.equal(result.status, 0, String(result.stderr));
      };
      const openPanel = async () => { if (!(await page.locator('#view-panel').isVisible())) await activate(page.locator('#view-button')); };
      const setView = async view => { await openPanel(); await activate(page.locator(`[data-view="${view}"]`)); };
      const choose = async mode => { await activate(page.locator('#activity-button')); await activate(page.locator(`[data-mode="${mode}"]`)); };
      const fill = async heights => {
        await page.locator('#scene').focus();
        for (let i = 0; i < 5; i++) { await page.keyboard.press('ArrowUp'); await page.keyboard.press('ArrowLeft'); }
        let x = 0, z = 0;
        for (let i = 0; i < heights.length; i++) {
          if (!heights[i]) continue;
          const nextX = i % 5, nextZ = Math.floor(i / 5);
          while (x !== nextX) { await page.keyboard.press(x < nextX ? 'ArrowRight' : 'ArrowLeft'); x += x < nextX ? 1 : -1; }
          while (z !== nextZ) { await page.keyboard.press(z < nextZ ? 'ArrowDown' : 'ArrowUp'); z += z < nextZ ? 1 : -1; }
          for (let h = 0; h < heights[i]; h++) await page.keyboard.press('Enter');
        }
        await total(heights.reduce((sum, h) => sum + h, 0));
      };

      await page.goto(base + '/');
      await page.locator('#category-exploration-toggle').waitFor({ state: 'visible' });
      await activate(page.locator('#category-exploration-toggle'));
      await activate(page.locator('[data-access-group="mathematics"] > summary'));
      await activate(page.locator('a[href="learning/inquiry/math/stacking-cubes/"]'));
      await page.waitForURL('**/learning/inquiry/math/stacking-cubes/**');
      await page.locator('#scene .floor-cell').first().waitFor({ state: 'visible' });
      assert.equal(await page.evaluate(() => window.audioContextCount), 0, 'audio waits for an interaction');
      assert.equal(await page.locator('#total').isVisible(), false);
      assert.equal(await page.locator('#view-panel').isVisible(), false);
      assert.equal(await page.locator('#tools button:visible').count(), 3);
      await snap('empty');

      // Keyboard access and clear/undo do not require finding a tiny projected face.
      await page.locator('#scene').focus();
      await page.keyboard.press('Enter');
      await total(1);
      assert.equal(await page.evaluate(() => ClassGameSfx.getAudioBus().context.state), 'running', 'interaction unlocks audio');
      await page.keyboard.press('Delete');
      await total(0);
      await page.keyboard.press('Control+z');
      await total(1);
      await openPanel();
      await activate(page.locator('#clear-board'));
      await total(0);
      await activate(page.locator('#undo'));
      await total(1);
      await openPanel();
      await activate(page.locator('#clear-board'));
      await total(0);

      let count = 0;
      for (const [x, z, layers] of [[1, 1, 1], [2, 1, 2], [1, 2, 2], [2, 2, 3], [3, 2, 1], [2, 3, 2]]) {
        for (let level = 0; level < layers; level++) {
          await activate(page.locator(`[data-cell="${x},${z}"][data-surface="${level ? 'top' : 'floor'}"]`));
          await total(++count);
        }
      }
      assert.equal(count, 11);
      await snap('solid');
      await activate(page.locator('[data-tool="erase"]'));
      await activate(page.locator('[data-cell="2,2"][data-surface="top"]'));
      await total(10);
      await activate(page.locator('#undo'));
      await total(11);
      await activate(page.locator('[data-tool="add"]'));

      // A rotation and a two-finger pinch must never add a cube on release.
      const box = await page.locator('#scene').boundingBox();
      const x = box.x + box.width * .72, y = box.y + box.height * .7;
      if (touch) {
        const cdp = await context.newCDPSession(page);
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x - 90, y: y - 25, id: 1 }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x - 40, y, id: 1 }, { x: x + 10, y, id: 2 }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x - 60, y, id: 1 }, { x: x + 30, y, id: 2 }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await cdp.detach();
      } else {
        await page.mouse.move(x, y); await page.mouse.down();
        await page.mouse.move(x - 90, y - 25, { steps: 8 }); await page.mouse.up();
        await page.mouse.wheel(0, -120);
      }
      await total(11);
      await openPanel();
      await activate(page.locator('#reset-camera'));

      await setView('top');
      await page.waitForFunction(() => document.querySelectorAll('[data-filled="true"]').length === 6);
      assert.equal(await page.locator('.cell-number').count(), 0);
      assert.equal(await page.locator('#tools').isVisible(), false);
      await openPanel();
      await activate(page.locator('#show-heights'));
      await activate(page.locator('#show-total'));
      await activate(page.locator('#view-button'));
      await page.waitForFunction(() => document.querySelectorAll('.cell-number').length === 6);
      assert.deepEqual((await page.locator('.cell-number').allTextContents()).sort(), ['1', '1', '2', '2', '2', '3']);
      assert.equal(await page.locator('#total').isVisible(), true);
      await snap('top');
      await setView('front');
      await page.waitForFunction(() => document.querySelectorAll('[data-filled="true"]').length === 6);
      await setView('right');
      await page.waitForFunction(() => document.querySelectorAll('[data-filled="true"]').length === 7);
      await snap('right');
      await activate(page.locator('#return-solid'));
      await total(11);

      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.documentElement.scrollHeight <= innerHeight), true, 'workspace fits viewport');
      for (const button of await page.locator('#tools button, #view-button').all()) {
        const rect = await button.boundingBox();
        assert.ok(rect.width >= 44 && rect.height >= 44, 'controls retain touch target size');
      }

      await page.evaluate(() => {
        window.playedSounds = [];
        const play = StackingSounds.play;
        StackingSounds.play = (...args) => { window.playedSounds.push(args[0]); return play(...args); };
      });
      await choose('copy');
      await total(0);
      await activate(page.locator('#check-shape'));
      assert.match(await page.locator('#challenge-result').textContent(), /다시/);
      await fill(activities.questions('copy')[0]);
      await activate(page.locator('#check-shape'));
      assert.equal(await page.locator('#check-shape').textContent(), '다음 모양');
      await snap('copy-success');
      await activate(page.locator('#check-shape'));
      assert.match(await page.locator('#challenge-title').textContent(), /2\/6/);
      await total(0);
      // The rear column of the second copy task is occluded in its initial view.
      // Learners can inspect the goal itself without placing or erasing any cubes.
      const goal = page.locator('#target-scene');
      await page.waitForFunction(() => document.querySelector('#target-scene.is-rotatable .floor-cell'));
      const initialGoalPoints = await goal.locator('.floor-cell').first().getAttribute('points');
      const initialBoardPoints = await page.locator('#scene .floor-cell').first().getAttribute('points');
      await activate(goal);
      await total(0);
      const goalBox = await goal.boundingBox();
      const gx = goalBox.x + goalBox.width * .65, gy = goalBox.y + goalBox.height * .55;
      if (touch) {
        const cdp = await context.newCDPSession(page);
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: gx, y: gy, id: 1 }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: gx - 65, y: gy + 12, id: 1 }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await cdp.detach();
      } else {
        await page.mouse.move(gx, gy); await page.mouse.down();
        await page.mouse.move(gx - 65, gy + 12, { steps: 8 }); await page.mouse.up();
      }
      await page.waitForFunction(points => document.querySelector('#target-scene .floor-cell').getAttribute('points') !== points, initialGoalPoints);
      assert.notEqual(await page.locator('#scene .floor-cell').first().getAttribute('points'), initialBoardPoints, 'goal and board stay aligned');
      await total(0);
      assert.equal(await page.locator('#undo').isDisabled(), true, 'goal rotation never changes the construction');
      await goal.focus(); await page.keyboard.press('Home');
      await page.waitForFunction(points => document.querySelector('#target-scene .floor-cell').getAttribute('points') === points, initialGoalPoints);
      await page.keyboard.press('ArrowRight');
      await page.waitForFunction(points => document.querySelector('#target-scene .floor-cell').getAttribute('points') !== points, initialGoalPoints);
      await page.keyboard.press('Home');
      await openPanel(); await page.locator('#show-heights').uncheck(); await activate(page.locator('#view-button'));
      await activate(page.locator('[data-target-view="top"]'));
      await page.waitForFunction(() => document.querySelectorAll('#target-scene .cell-number').length === 4);
      assert.deepEqual(await goal.locator('.cell-number').allTextContents(), ['1', '2', '2', '1'], 'all goal heights are available, including the hidden rear cell');
      assert.equal(await goal.getAttribute('tabindex'), '-1');
      for (const number of await goal.locator('.cell-number').all()) assert.ok(await number.evaluate(node => parseFloat(getComputedStyle(node).fontSize)) >= 12, 'goal heights stay legible');
      for (const button of await page.locator('#target-views button:visible').all()) {
        const rect = await button.boundingBox(); assert.ok(rect.width >= 44 && rect.height >= 44, 'copy inspection touch targets');
      }
      await snap('copy-hidden-heights');
      await fill(activities.questions('copy')[1]);
      await activate(page.locator('#check-shape'));
      assert.match(await page.locator('#challenge-result').textContent(), /성공/);
      await activate(page.locator('[data-target-view="solid"]'));
      await page.waitForFunction(() => document.querySelector('#target-scene .block-face'));
      assert.equal(await goal.locator('.cell-number').count(), 0);
      await choose('free');
      await total(11);

      const target = activities.questions('many')[0];
      const alternative = target.map(h => h === 1 ? 2 : h);
      await page.evaluate(hash => { location.hash = hash; }, activities.encode(target, 'views'));
      await page.waitForFunction(() => document.getElementById('challenge-title').textContent === '그림 보고 쌓기 · 1/1');
      await total(0);
      for (const direction of ['front', 'right', 'top']) {
        await activate(page.locator(`[data-target-view="${direction}"]`));
        assert.equal(await page.locator('#target-scene .cell-number').count(), 0, 'target never reveals column heights');
      }
      await fill(alternative);
      await activate(page.locator('#check-shape'));
      assert.match(await page.locator('#challenge-result').textContent(), /성공/);
      await snap('views-success');

      await choose('many');
      await fill(target);
      await activate(page.locator('#check-shape'));
      assert.equal(await page.locator('#check-shape').textContent(), '다른 모양 만들기');
      await activate(page.locator('#check-shape'));
      await total(0);
      await activate(page.locator('#undo'));
      await total(7);
      await activate(page.locator('#check-shape'));
      assert.match(await page.locator('#challenge-result').textContent(), /이미 찾은/);
      await openPanel(); await activate(page.locator('#clear-board'));
      await fill(alternative);
      await activate(page.locator('#check-shape'));
      assert.match(await page.locator('#challenge-result').textContent(), /서로 다른 두/);
      await snap('many-success');
      assert.equal(await page.locator('#target-panel').evaluate(panel => panel.scrollHeight <= panel.clientHeight + 1), true, 'goal and success message fit without scrolling');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.documentElement.scrollHeight <= innerHeight), true, 'activity fits viewport');
      for (const button of await page.locator('#target-views button:visible, #check-shape').all()) {
        const rect = await button.boundingBox(); assert.ok(rect.width >= 44 && rect.height >= 44, 'activity touch targets');
      }
      await choose('free');
      await total(11);
      const played = await page.evaluate(() => window.playedSounds);
      assert.equal(new URL(page.url()).hash, '', 'switching activities clears the old shared challenge');
      for (const kind of ['add', 'retry', 'success', 'found', 'undo', 'clear', 'view']) assert.ok(played.includes(kind), `wired sound: ${kind}`);

      await activate(page.locator('#activity-button'));
      await activate(page.locator('#keep-options summary'));
      await page.locator('#shape-name').fill('<b>내 성</b>');
      await activate(page.locator('#save-shape'));
      assert.equal(await page.locator('.saved-open span').textContent(), '<b>내 성</b>');
      assert.equal(await page.locator('.saved-open b').count(), 0, 'saved labels are text, not HTML');
      await activate(page.locator('.saved-delete'));
      assert.equal(await page.locator('.saved-open').count(), 0);
      await activate(page.locator('#undo-saved-delete'));
      assert.equal(await page.locator('.saved-open').count(), 1);
      await snap('library');

      const downloaded = page.waitForEvent('download');
      await activate(page.locator('#export-shape'));
      const download = await downloaded;
      const chunks = []; for await (const chunk of await download.createReadStream()) chunks.push(chunk);
      const exported = activities.parseFile(Buffer.concat(chunks).toString());
      assert.equal(exported.reduce((sum, h) => sum + h, 0), 11);
      await page.locator('#shape-file').setInputFiles({ name: 'invalid.json', mimeType: 'application/json', buffer: Buffer.from('{}') });
      await page.waitForFunction(() => document.getElementById('library-status').textContent.includes('올바른'));
      await total(11);
      await page.locator('#shape-file').setInputFiles({ name: 'shape.json', mimeType: 'application/json', buffer: Buffer.from(activities.file(activities.questions('copy')[0])) });
      await total(4);
      await activate(page.locator('#undo'));
      await total(11);

      await activate(page.locator('#activity-button'));
      await page.locator('#share-mode').selectOption('views');
      await activate(page.locator('#share-shape'));
      const shared = await page.locator('#share-link').inputValue();
      assert.deepEqual(activities.decode(new URL(shared).hash), { mode: 'views', heights: exported });
      await activate(page.locator('#close-activities'));
      await openPanel();
      await page.locator('#sound-enabled').uncheck();
      assert.equal(await page.evaluate(() => StackingSounds.play('add', 1)), false);
      await page.evaluate(() => history.replaceState(null, '', location.pathname));
      await page.reload();
      await page.locator('#scene .floor-cell').first().waitFor();
      await openPanel();
      assert.equal(await page.locator('#sound-enabled').isChecked(), false, 'mute persists');
      await page.locator('#sound-enabled').check();
      await page.locator('#sound-volume').fill('35');
      await page.locator('#sound-volume').dispatchEvent('change');
      assert.equal(await page.evaluate(() => StackingSounds.volume()), .35);
      await activate(page.locator('#view-button'));
      await activate(page.locator('#activity-button'));
      await activate(page.locator('.saved-open'));
      await total(11);

      assert.deepEqual(errors, []);
      console.log(JSON.stringify({ name, width, height, touch, ok: true }));
      await context.close();
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
