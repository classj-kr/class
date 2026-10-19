const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { startHarness } = require('./site-storage-harness.cjs');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const url = '/learning/inquiry/math/number-models/';
const output = path.resolve(__dirname, '../outputs/number-models');
let h, browser, context, page, errors;
const total = () => page.locator('#total').textContent();
const counts = () => page.locator('.count b').allTextContents().then(values => values.map(Number));
const button = (i, action) => page.locator(`[data-index="${i}"] [data-action="${action}"]`);
const settled = () => page.waitForFunction(() => document.getElementById('save-status').textContent === '계정에 자동 저장됨');
const ready = () => page.waitForFunction(() => document.getElementById('save-status').textContent === '계정에 자동 저장');
const number = async value => { await page.locator('#number-input').fill(value); await page.locator('#number-form button').click(); };
const shot = async name => {
  const code = "import io,sys;from PIL import Image;im=Image.open(io.BytesIO(sys.stdin.buffer.read())).convert('RGBA');im.save(sys.argv[1],format='WEBP',lossless=True,exact=True);out=Image.open(sys.argv[1]).convert('RGBA');assert im.size==out.size and im.tobytes()==out.tobytes()";
  const result = spawnSync('python', ['-c', code, path.join(output, name + '.webp')], { input: await page.screenshot({ fullPage: true }) });
  assert.equal(result.status, 0, String(result.stderr));
};
test.before(async () => {
  fs.mkdirSync(output, { recursive: true });
  h = await startHarness({
    me: user => ({ signedIn: true, user: { id: user.id, name: '검수교사', role: 'teacher' } }),
    extraRoutes(app) {
      app.get('/api/site/access', (_, res) => res.json({ mode: 'open' }));
      app.get('/api/teacher/profile', (_, res) => res.json({ profiles: [{ name: '검수교사', schoolName: '검수학교', teacherType: '담임', grade: 3, classNumber: 1 }] }));
      app.get('/api/home-content-access', (_, res) => res.json({ mode: 'open', enabledPaths: [], globallyDisabledPaths: [], hasClassAccess: false, canManage: false, canManageGlobally: false }));
    }
  });
  browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
});
test.beforeEach(async () => {
  await h.db.query('DELETE FROM user_storage');
  context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.addCookies([{ name: 'test_user', value: '1', url: h.base }]);
  page = await context.newPage(); errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto(h.base + url); await ready();
});
test.afterEach(async () => { try { assert.deepEqual(errors, []); } finally { await context?.close(); } });
test.after(async () => { await browser?.close(); await h?.close(); });

test('home math accordion reaches the number model on desktop and phone', async () => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await page.goto(h.base + '/');
    await page.locator('#category-exploration-toggle').click();
    const group = page.locator('[data-access-group=mathematics]');
    assert.match(await group.locator('summary').getAttribute('data-content-paths'), /number-models/);
    await group.locator('summary').click();
    await group.locator(`a[href="${url.slice(1)}"]`).click();
    await page.waitForURL('**' + url); await ready();
    assert.equal(await page.title(), '수 모형 · 수학 교구');
    assert.equal(await total(), '123');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await shot(width === 390 ? 'phone' : 'desktop');
  }
});

test('5555 stays fully visible at classroom screen sizes with matching model scales', async () => {
  for (const [width, height] of [[1718, 855], [1366, 768], [1024, 768]]) {
    await page.setViewportSize({ width, height });
    await number('5555');
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const layout = await page.evaluate(() => {
      const clouds = [...document.querySelectorAll('.block-cloud')];
      return {
        overflow: document.documentElement.scrollWidth > innerWidth || document.documentElement.scrollHeight > innerHeight,
        clipped: clouds.map(cloud => [...cloud.querySelectorAll('.block')].some(block => {
          const box = block.getBoundingClientRect(), area = cloud.getBoundingClientRect();
          return box.top < area.top || box.bottom > area.bottom || box.left < area.left || box.right > area.right;
        })),
        scales: clouds.map(cloud => {
          const svg = cloud.querySelector('svg');
          return svg.getBoundingClientRect().width / Number(svg.getAttribute('width'));
        })
      };
    });
    assert.equal(layout.overflow, false, `${width}: page fits viewport`);
    assert.deepEqual(layout.clipped, [false, false, false, false], `${width}: all five models in each place are visible`);
    assert.ok(Math.max(...layout.scales) - Math.min(...layout.scales) < 0.002, 'all four shapes keep the same unit scale');
    if (width === 1718) await shot('desktop-5555');
    if (width === 1366) await shot('laptop-5555');
  }
});

test('carrying, borrowing, subtraction and keyboard undo show each step accurately', async () => {
  await page.locator('[data-example=whole-add]').click();
  assert.deepEqual(await counts(), [0, 0, 2, 15]);
  await button(3, 'bundle').click();
  await page.waitForFunction(() => document.querySelector('[data-index="3"] .count b').textContent === '5');
  assert.deepEqual(await counts(), [0, 0, 3, 5]); assert.equal(await total(), '35');
  assert.equal(await page.evaluate(() => document.activeElement.closest('[data-index]')?.dataset.index), '3');
  assert.match(await page.locator('#message').textContent(), /전체 값은 35 그대로/);
  await page.keyboard.press('Control+z'); assert.deepEqual(await counts(), [0, 0, 2, 15]);
  await page.keyboard.press('Control+Shift+z'); assert.deepEqual(await counts(), [0, 0, 3, 5]);
  await page.locator('[data-example=whole-subtract]').click();
  assert.equal(await page.locator('#subtract').isDisabled(), true);
  await button(2, 'split').click();
  await page.locator('#subtract:enabled').waitFor();
  assert.deepEqual(await counts(), [0, 0, 3, 12]); assert.equal(await total(), '42');
  await shot('borrowing');
  await page.locator('#subtract').click();
  assert.equal(await total(), '25'); assert.deepEqual(await counts(), [0, 0, 2, 5]);
  await page.locator('#undo').click(); assert.equal(await total(), '42');
});

test('decimal unit reference, exact carrying and borrowing, and separate mode scenes', async () => {
  await page.locator('[data-mode=decimal]').click();
  assert.equal(await total(), '1.23');
  assert.equal(await page.locator('#unit-label').textContent(), '큰 정육면체 1개 = 1');
  await page.locator('[data-example=decimal-add]').click();
  assert.equal(await total(), '1.3');
  await button(1, 'bundle').click();
  await page.waitForFunction(() => document.querySelector('[data-index="0"] .count b').textContent === '1');
  assert.deepEqual(await counts(), [1, 3, 0, 0]); assert.equal(await total(), '1.3');
  await page.locator('[data-example=decimal-subtract]').click();
  await button(0, 'split').click(); await page.locator('#subtract:enabled').waitFor();
  assert.deepEqual(await counts(), [0, 12, 0, 0]); assert.equal(await total(), '1.2');
  await page.locator('#subtract').click(); assert.equal(await total(), '0.7');
  await number('0.009'); await button(3, 'add').click(); assert.equal(await total(), '0.01');
  await button(3, 'bundle').click();
  await page.waitForFunction(() => document.querySelector('[data-index="2"] .count b').textContent === '1');
  assert.deepEqual(await counts(), [0, 0, 1, 0]);
  await number('1.234'); await shot('decimal');
  await page.locator('[data-mode=whole]').click(); assert.equal(await total(), '123');
  await page.locator('[data-mode=decimal]').click(); assert.equal(await total(), '1.234');
});

test('invalid numbers and hidden populated places are rejected; hide value and clear are reversible', async () => {
  await page.locator('#places').selectOption('2');
  assert.equal(await page.locator('#places').inputValue(), '4'); assert.equal(await total(), '123');
  assert.match(await page.locator('#message').textContent(), /範|범위|모형/);
  await number('42'); await page.locator('#places').selectOption('2');
  assert.equal(await page.locator('.place-column').count(), 2);
  await number('100'); assert.equal(await total(), '42');
  await page.locator('[data-mode=decimal]').click(); await number('0.0001');
  assert.equal(await total(), '1.23'); assert.match(await page.locator('#message').textContent(), /소수 셋째/);
  await page.locator('#show-total').uncheck(); assert.equal(await total(), '?');
  assert.equal(await page.locator('#number-input').isVisible(), false);
  await button(1, 'split').click();
  await page.waitForFunction(() => document.querySelector('[data-index="2"] .count b').textContent === '13');
  assert.doesNotMatch(await page.locator('#message').textContent(), /1\.23/);
  await page.locator('#show-total').check(); assert.equal(await total(), '1.23');
  await page.locator('#clear').click(); assert.equal(await total(), '0');
  await page.locator('#undo').click(); assert.equal(await total(), '1.23');
});

test('account data restores in another context and guest changes stay in memory', async () => {
  await number('2048'); await page.locator('[data-mode=decimal]').click(); await number('2.345'); await settled();
  const another = await browser.newContext();
  await another.addCookies([{ name: 'test_user', value: '1', url: h.base }]);
  const restored = await another.newPage(); await restored.goto(h.base + url);
  await restored.waitForFunction(() => document.getElementById('total').textContent === '2.345');
  await restored.locator('[data-mode=whole]').click(); assert.equal(await restored.locator('#total').textContent(), '2048');
  await another.close();
  const guest = await browser.newContext(); const gp = await guest.newPage(); await gp.goto(h.base + url);
  await gp.waitForFunction(() => document.getElementById('save-status').textContent === '이 탭에서 사용 중');
  await gp.locator('[data-index="3"] [data-action=add]').click(); assert.equal(await gp.locator('#total').textContent(), '124');
  assert.deepEqual(await gp.evaluate(() => Object.keys(localStorage)), []);
  await gp.reload(); assert.equal(await gp.locator('#total').textContent(), '123');
  await guest.close();
});

test('small phone touch and settings keep the board accessible', async () => {
  const phone = await browser.newContext({ viewport: { width: 320, height: 800 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const mobile = await phone.newPage(); await mobile.goto(h.base + url);
  await mobile.locator('#columns .place-column').first().waitFor();
  assert.equal(await mobile.locator('#settings').isVisible(), false);
  await mobile.locator('[data-example=whole-add]').tap();
  await mobile.locator('[data-index="3"] [data-action=bundle]').tap();
  assert.equal(await mobile.locator('#total').textContent(), '35');
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await mobile.locator('#toggle-settings').tap(); assert.equal(await mobile.locator('#settings').isVisible(), true);
  await mobile.locator('#number-input').fill('9999'); await mobile.locator('#number-form button').tap();
  await mobile.locator('#toggle-settings').tap(); assert.equal(await mobile.locator('#total').textContent(), '9999');
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await phone.close();
  await page.locator('#toggle-settings').click();
  assert.equal(await page.locator('#settings').isVisible(), false);
  await page.locator('#toggle-settings').click();
  assert.equal(await page.locator('#settings').isVisible(), true);
});

test('failed saves are visible while the model remains usable', async () => {
  await page.route('**/api/me/storage/number-models/board', route => route.fulfill({ status: 500, contentType: 'application/json', body: '{"error":"TEST_FAILURE"}' }));
  await button(3, 'add').click();
  await page.waitForFunction(() => document.getElementById('save-status').dataset.error === 'true');
  assert.equal(await total(), '124');
  await button(3, 'add').click(); assert.equal(await total(), '125');
});

test('multiple numbers align, edit independently, undo and restore from the account', async () => {
  await number('123');
  await page.locator('#add-number').click(); await number('234');
  await page.locator('#add-number').click(); await number('345');
  const values = () => page.locator('.row-total').allTextContents();
  assert.deepEqual(await values(), ['123', '234', '345']);
  await page.locator('[data-row="0"] [data-index="3"] [data-action=add]').click();
  assert.deepEqual(await values(), ['124', '234', '345']);
  await page.locator('#undo').click(); assert.deepEqual(await values(), ['123', '234', '345']);
  await page.locator('#redo').click(); assert.deepEqual(await values(), ['124', '234', '345']);
  await page.locator('[data-select-row="1"]').click();
  await page.locator('[data-row="2"] [data-index="2"] [data-action=split]').click();
  await page.waitForFunction(() => document.querySelector('[data-row="2"] [data-index="3"] .count b').textContent === '15');
  assert.deepEqual(await values(), ['124', '234', '345']);
  assert.equal(await page.locator('[data-row="0"] [data-index="3"] .count b').textContent(), '4');
  await page.locator('#undo').click();
  await page.locator('#places').selectOption('2');
  assert.equal(await page.locator('#places').inputValue(), '4');
  await page.locator('#show-total').uncheck(); assert.deepEqual(await values(), ['?', '?', '?']);
  await page.locator('#show-total').check();
  await page.locator('[data-remove-row="1"]').click(); assert.deepEqual(await values(), ['124', '345']);
  await page.locator('#undo').click(); assert.deepEqual(await values(), ['124', '234', '345']);
  await page.locator('[data-mode=decimal]').click();
  await number('0.8'); await page.locator('#add-number').click(); await number('0.75');
  assert.deepEqual(await values(), ['0.8', '0.75']);
  await settled(); await page.reload(); await ready();
  assert.deepEqual(await values(), ['0.8', '0.75']);
  await page.locator('[data-mode=whole]').click(); assert.deepEqual(await values(), ['124', '234', '345']);
  for (const [width, height] of [[1920,1080], [1366,768], [1024,768], [390,844], [320,800]]) {
    await page.setViewportSize({ width, height });
    const layout = await page.evaluate(() => {
      const rows = [...document.querySelectorAll('.model-row')];
      const scales = [...document.querySelectorAll('.block svg')].map(svg => svg.getBoundingClientRect().width / Number(svg.getAttribute('width')));
      const edges = rows.map(row => [...row.querySelectorAll('.place-column')].map(col => Math.round(col.getBoundingClientRect().left)));
      return { edges, scaleRange: Math.max(...scales)-Math.min(...scales), fits: document.documentElement.scrollWidth <= innerWidth,
        clipped: [...document.querySelectorAll('.block')].some(block => { const b = block.getBoundingClientRect(), c = block.closest('.block-cloud').getBoundingClientRect(); return b.left < c.left || b.right > c.right+1 || b.bottom > c.bottom+1; }) };
    });
    assert.equal(layout.fits, true, `${width}: no horizontal page overflow`);
    assert.equal(layout.clipped, false, `${width}: no clipped models`);
    assert.ok(layout.scaleRange < 0.002, `${width}: common model scale`);
    assert.deepEqual(layout.edges[0], layout.edges[1], `${width}: shared place columns`);
    if (width === 1366 || width === 390) await shot(`compare-${width}`);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (let i = 0; i < 3; i++) await page.locator('#add-number').click();
  assert.equal(await page.locator('.model-row').count(), 6);
  assert.equal(await page.locator('#add-number').isDisabled(), true);
  await page.locator('[data-remove-row="5"]').click(); assert.equal(await page.locator('#add-number').isDisabled(), false);
  while (await page.locator('.model-row').count() > 1) await page.locator('[data-remove-row]').last().click();
  assert.equal(await page.locator('body').evaluate(body => body.classList.contains('comparing')), false);
  assert.equal(await total(), '124');
});
