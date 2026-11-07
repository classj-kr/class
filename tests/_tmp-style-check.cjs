const path = require('node:path');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { startHarness } = require('./site-storage-harness.cjs');
const { createHandwriting } = require('../game-hub-server/handwriting'),
  { createRoomCodes } = require('../game-hub-server/room-codes'),
  { createRoomEntry } = require('../game-hub-server/room-entry');
const route = '/learning/literacy-numeracy/handwriting/';
(async () => {
  const h = await startHarness({
    me: (user) => ({ signedIn: true, user: { id: user.id, name: '검수교사', role: 'teacher' } }),
    extraRoutes(app) {
      const codes = createRoomCodes({ isActive: async () => false }),
        platform = { roomCodes: codes, configuration: () => ({ enabled: true }), isTeacherRequest: async () => true, isContentGloballyDisabled: async () => false, canBypassGlobalContentLock: async () => false, displayNameFor: async () => ({ name: '검수교사' }) };
      const feature = createHandwriting({ platform });
      app.use('/api/handwriting', feature.router);
      app.use('/api/room-entry', createRoomEntry({ roomCodes: codes, handwritingExists: () => false }));
      app.get('/api/site/access', (_, res) => res.json({ mode: 'open' }));
    },
  });
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const out = process.argv[2];
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  await context.addCookies([{ name: 'test_user', value: '1', url: h.base }]);
  const page = await context.newPage();
  const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('response', (r) => r.status() >= 400 && errors.push(r.status() + ' ' + r.url()));
  await page.goto(h.base + route);
  await page.waitForFunction(() => /계정에 자동 저장/.test(document.querySelector('#saveStatus')?.textContent || ''));
  await page.locator('#lessonSelect').selectOption('nature');
  await page.waitForTimeout(500);
  await page.screenshot({ path: out + '/style-gyeongpil.png' });
  await page.locator('#styleSelect').selectOption('badasseugi');
  await page.waitForTimeout(800);
  console.log(JSON.stringify(await page.evaluate(() => ({ style: HandwritingFont.style(), pen: document.querySelector('#penWidth').value, strokes: document.querySelector('#strokeCount').textContent }))));
  await page.screenshot({ path: out + '/style-badasseugi.png' });
  await page.locator('#demoButton').click();
  await page.waitForTimeout(1900);
  await page.locator('#modelCanvas').screenshot({ path: out + '/style-demo.png' });
  await page.reload();
  await page.waitForFunction(() => /계정에 자동 저장/.test(document.querySelector('#saveStatus')?.textContent || ''));
  console.log('after reload', await page.evaluate(() => HandwritingFont.style() + ' ' + document.querySelector('#styleSelect').value));
  console.log('errors', JSON.stringify(errors));
  await browser.close(); await h.close();
})().catch((e) => { console.error(e); process.exit(1); });
