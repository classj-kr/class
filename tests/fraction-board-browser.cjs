const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { startHarness } = require('./site-storage-harness.cjs');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const root = path.resolve(__dirname, '..'), output = path.join(root, 'outputs/fraction-board');
let h, browser, context, page, errors;
const url = '/learning/inquiry/math/fraction-board/';
const convert = "import io,sys;from PIL import Image;im=Image.open(io.BytesIO(sys.stdin.buffer.read())).convert('RGBA');im.save(sys.argv[1],format='WEBP',lossless=True,exact=True);out=Image.open(sys.argv[1]).convert('RGBA');assert im.size==out.size and im.tobytes()==out.tobytes()";
const shot = async name => {
  const result = spawnSync('python', ['-c', convert, path.join(output, name + '.webp')], { input: await page.screenshot({ fullPage: true }) });
  assert.equal(result.status, 0, String(result.stderr));
};
const input = async (id, value) => { await page.locator('#' + id).fill(String(value)); await page.locator('#' + id).press('Tab'); };
const shape = name => page.locator(`[data-shape="${name}"]`).click();
const active = () => page.locator('.fraction-card.selected');
const value = async () => Number(await page.locator('#numerator').inputValue());
const saved = () => h.items('fraction-board').then(items => items.board);
const settled = () => page.waitForFunction(() => document.getElementById('save-status').textContent === '계정에 자동 저장됨');

test.before(async () => {
  fs.mkdirSync(output, { recursive: true });
  h = await startHarness({
    me: user => ({ signedIn: true, user: { id: user.id, name: '검수교사', role: 'teacher' } }),
    extraRoutes(app) {
      app.get('/api/site/access', (_,res) => res.json({ mode: 'open' }));
      app.get('/api/teacher/profile', (_,res) => res.json({ profiles: [{ name: '검수교사', schoolName: '검수학교', teacherType: '담임', grade: 3, classNumber: 1 }] }));
      app.get('/api/home-content-access', (_,res) => res.json({ mode: 'open', enabledPaths: [], globallyDisabledPaths: [], hasClassAccess: false, canManage: false, canManageGlobally: false }));
    }
  });
  browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : process.platform === 'win32' ? { channel: 'msedge' } : {}) });
});
test.beforeEach(async () => {
  await h.db.query('DELETE FROM user_storage');
  context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
  await context.addCookies([{ name: 'test_user', value: '1', url: h.base }]);
  page = await context.newPage(); errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(h.base + url);
  await page.waitForFunction(() => document.getElementById('save-status').textContent === '계정에 자동 저장');
});
test.afterEach(async () => { try { assert.deepEqual(errors, []); } finally { await context?.close(); } });
test.after(async () => { await browser?.close(); await h?.close(); });

test('home math accordion opens the fraction board on desktop and phone', async () => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await page.goto(h.base + '/');
    await page.locator('#category-exploration-toggle').click();
    await page.locator('[data-access-group="mathematics"] > summary').click();
    await page.locator(`a[href="${url.slice(1)}"]`).click();
    await page.waitForURL('**' + url);
    await page.locator('.fraction-drawing').waitFor();
    assert.equal(await page.title(), '분수 그림판 · 수학 교구');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await shot(width === 390 ? 'phone-initial' : 'desktop-initial');
  }
});

test('all shapes color on click, including whole circles and the zero on a number line', async () => {
  await page.locator('#clear-shading').click();
  for (const type of ['bar', 'grid', 'circle']) {
    await shape(type);
    await active().locator('[data-cell="4"]').click();
    assert.equal(await value(), 1);
    await active().locator('[data-cell="4"]').click();
    assert.equal(await value(), 0);
  }
  await input('denominator', 1);
  await active().locator('[data-cell="0"]').click();
  assert.equal(await value(), 1);
  await input('denominator', 2);
  assert.equal(await active().locator('[data-cell]').count(), 2);
  await shape('line');
  await active().locator('[data-cell="2"]').click();
  assert.equal(await value(), 2);
  await active().locator('[data-cell="0"]').click();
  assert.equal(await value(), 0);
  await settled();
});

test('equivalent fractions, exactness errors, and common unit sizes across cards', async () => {
  await input('numerator', 1); await input('denominator', 2);
  await page.locator('#keep-amount').check();
  await active().locator('[data-action=duplicate]').click();
  await input('denominator', 4);
  assert.equal(await value(), 2);
  await active().locator('[data-action=duplicate]').click();
  await input('denominator', 8);
  assert.equal(await value(), 4);
  await input('denominator', 3);
  assert.equal(await page.locator('#denominator').inputValue(), '8');
  assert.equal(await value(), 4);
  assert.match(await page.locator('#edit-message').textContent(), /온전한 칸/);
  const boxes = await page.locator('.fraction-drawing').evaluateAll(svgs => svgs.map(s => s.getAttribute('viewBox')));
  assert.equal(new Set(boxes).size, 1);
  await shot('equivalent-fractions');
});

test('improper fractions, deletion, undo and keyboard painting preserve the scene', async () => {
  await input('denominator', 4); await input('numerator', 7);
  assert.equal(await page.locator('#units').inputValue(), '2');
  assert.match(await active().locator('.mixed-number').textContent(), /1과 3\/4/);
  await page.locator('#units').selectOption('1');
  assert.equal(await page.locator('#units').inputValue(), '2');
  await active().locator('[data-action=duplicate]').click();
  await active().locator('[data-action=remove]').click();
  assert.equal(await page.locator('.fraction-card').count(), 1);
  await page.locator('#undo').click();
  assert.equal(await page.locator('.fraction-card').count(), 2);
  await page.locator('#redo').click();
  assert.equal(await page.locator('.fraction-card').count(), 1);
  await page.locator('#clear-shading').click();
  await active().locator('[data-cell="0"]').focus();
  await page.keyboard.press('ArrowRight'); await page.keyboard.press('Space');
  assert.equal(await value(), 1);
  await page.keyboard.press('Control+z'); assert.equal(await value(), 0);
});

test('visibility controls and phone touch targets stay usable for all shapes', async () => {
  await context.close();
  context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await context.addCookies([{ name: 'test_user', value: '1', url: h.base }]);
  page = await context.newPage(); page.on('pageerror', e => errors.push(e.message));
  await page.goto(h.base + url);
  await page.waitForFunction(() => document.getElementById('save-status').textContent === '계정에 자동 저장');
  for (const type of ['bar', 'grid', 'circle', 'line']) {
    await shape(type);
    await page.locator('#show-labels').uncheck();
    assert.equal(await active().locator('.fraction-number').count(), 0);
    await page.locator('#show-labels').check();
    await page.locator('#show-shading').uncheck();
    assert.equal(await active().locator('.fraction-drawing [fill="#287f71"]').count(), 0);
    await page.locator('#show-shading').check();
    await page.locator('#show-lines').uncheck(); await page.locator('#show-lines').check();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  }
  await shape('circle'); await input('denominator', 4); await input('numerator', 7);
  await active().locator('[data-cell="7"]').tap(); assert.equal(await value(), 8);
  await active().locator('[data-cell="7"]').tap(); assert.equal(await value(), 7);
  await page.locator('#toggle-settings').tap();
  assert.equal(await page.locator('#inspector').isVisible(), false);
  await shot('phone-improper');
  await page.locator('#toggle-settings').tap();
  assert.equal(await page.locator('#inspector').isVisible(), true);
});

test('fullscreen and six-picture limit retain controls and undo', async () => {
  await page.locator('#fullscreen').click();
  await page.waitForFunction(() => !!document.fullscreenElement && document.getElementById('inspector').hidden);
  assert.equal(await page.locator('#inspector').isVisible(), false);
  await page.locator('#fullscreen').click();
  await page.waitForFunction(() => !document.fullscreenElement && !document.getElementById('inspector').hidden);
  assert.equal(await page.locator('#inspector').isVisible(), true);
  for (let i = 0; i < 5; i++) await page.locator('#add-card').click();
  assert.equal(await page.locator('.fraction-card').count(), 6);
  assert.equal(await page.locator('#add-card').isDisabled(), true);
  assert.equal(await active().locator('[data-action=duplicate]').isDisabled(), true);
  await page.locator('#undo').click();
  assert.equal(await page.locator('.fraction-card').count(), 5);
  assert.equal(await page.locator('#add-card').isDisabled(), false);
});

test('account save restores another context and guest edits do not persist', async () => {
  await shape('grid'); await input('numerator', 5); await settled();
  const stored = await saved(); assert.equal(stored.cards[0].cells.length, 5);
  const other = await browser.newContext();
  await other.addCookies([{ name: 'test_user', value: '1', url: h.base }]);
  const tab = await other.newPage(); await tab.goto(h.base + url);
  await tab.waitForFunction(() => document.getElementById('numerator').value === '5');
  assert.equal(await tab.locator('[data-shape=grid]').getAttribute('aria-pressed'), 'true');
  await other.close();
  await context.clearCookies(); await page.reload();
  await page.waitForFunction(() => document.getElementById('save-status').textContent === '이 탭에서 사용 중');
  await input('numerator', 6);
  assert.equal(await page.evaluate(() => Object.keys(localStorage).length), 0);
  await page.reload(); assert.equal(await value(), 3);
  assert.equal((await saved()).cards[0].cells.length, 5);
});

test('failed account save is visible and the drawing remains editable', async () => {
  await page.route('**/api/me/storage/fraction-board/board', route => route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'TEST_FAILURE' }) }));
  await input('numerator', 5);
  await page.waitForFunction(() => document.getElementById('save-status').dataset.error === 'true');
  assert.equal(await value(), 5);
  await active().locator('[data-cell="7"]').click();
  assert.equal(await value(), 6);
});

test('WebP export preserves dimensions, alpha, pixels and chosen scope', async () => {
  // Encode known RGBA bytes through the same worker, then compare decoded pixels.
  const sample = Array.from({ length: 64 }, (_, i) => (i * 37) % 256);
  sample[3] = 0; sample[7] = 255;
  const encoded = await page.evaluate(async rgba => {
    const worker = new Worker('export-worker.js', { type: 'module' });
    try {
      return await new Promise((resolve, reject) => {
        worker.onerror = reject;
        worker.onmessage = e => e.data.error ? reject(Error(e.data.error)) : resolve(Array.from(new Uint8Array(e.data.buffer)));
        worker.postMessage({ width: 4, height: 4, data: new Uint8ClampedArray(rgba).buffer });
      });
    } finally { worker.terminate(); }
  }, sample);
  fs.writeFileSync(path.join(output, 'lossless-sample.webp'), Buffer.from(encoded));
  const result = spawnSync('python', ['-c', "from PIL import Image;import json,sys;im=Image.open(sys.argv[1]).convert('RGBA');assert im.size==(4,4);assert list(im.tobytes())==json.loads(sys.argv[2])", path.join(output, 'lossless-sample.webp'), JSON.stringify(sample)]);
  assert.equal(result.status, 0, String(result.stderr));
  await active().locator('[data-action=duplicate]').click();
  await shape('circle');
  await page.locator('#export-open').click();
  for (const [scope, transparent, height] of [['all', true, 772], ['selected', false, 402]]) {
    await page.locator(`input[name=export-scope][value=${scope}]`).check();
    await page.locator('#transparent').setChecked(transparent);
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#export-webp').click();
    const download = await downloadPromise;
    assert.equal(download.suggestedFilename(), '분수-그림판.webp');
    const file = path.join(output, `export-${scope}.webp`); await download.saveAs(file);
    const buffer = fs.readFileSync(file); assert.equal(buffer.subarray(8,12).toString(), 'WEBP');
    const check = spawnSync('python', ['-c', "from PIL import Image;import sys;im=Image.open(sys.argv[1]).convert('RGBA');assert im.size==(1600,int(sys.argv[2]));assert im.getpixel((0,0))[3]==int(sys.argv[3]);assert len(im.getcolors(im.width*im.height))>10", file, String(height), transparent ? '0' : '255']);
    assert.equal(check.status, 0, String(check.stderr));
  }
});
