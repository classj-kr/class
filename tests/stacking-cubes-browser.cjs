const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const express = require('../game-hub-server/node_modules/express');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'outputs/stacking-cubes-review');
const shots = process.argv.includes('--shots');
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
      const context = await browser.newContext({ viewport: { width, height }, hasTouch: touch });
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

      await page.goto(base + '/');
      await page.locator('#category-exploration-toggle').waitFor({ state: 'visible' });
      await activate(page.locator('#category-exploration-toggle'));
      await activate(page.locator('[data-access-group="mathematics"] > summary'));
      await activate(page.locator('a[href="learning/inquiry/math/stacking-cubes/"]'));
      await page.waitForURL('**/learning/inquiry/math/stacking-cubes/**');
      await page.locator('#scene .floor-cell').first().waitFor({ state: 'visible' });
      assert.equal(await page.locator('#total').isVisible(), false);
      assert.equal(await page.locator('#view-panel').isVisible(), false);
      assert.equal(await page.locator('#tools button:visible').count(), 3);
      await snap('empty');

      // Keyboard access and clear/undo do not require finding a tiny projected face.
      await page.locator('#scene').focus();
      await page.keyboard.press('Enter');
      await total(1);
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
      assert.deepEqual(errors, []);
      console.log(JSON.stringify({ name, width, height, touch, ok: true }));
      await context.close();
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
