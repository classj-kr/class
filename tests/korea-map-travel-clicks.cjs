const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const root = path.resolve(__dirname, '..');
let routeStatus = 200;
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname.startsWith('/api/')) {
    const travel = url.pathname.startsWith('/api/travel/route');
    const body = travel ? routeStatus === 200 ? {
      route: { durationMinutes: 60, distanceKm: 80, coordinates: [[127.73, 37.88], [127.884, 37.951]] },
      school: { latitude: 37.88, longitude: 127.73 }
    } : { message: '학교 연결이 필요합니다.' } : { items: {} };
    return res.writeHead(travel ? routeStatus : 200, { 'content-type': 'application/json' }).end(JSON.stringify(body));
  }
  const pathname = url.pathname.endsWith('/') ? url.pathname + 'index.html' : url.pathname;
  const file = path.resolve(root, '.' + pathname);
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  fs.readFile(file, (error, data) => {
    if (error) return res.writeHead(404).end();
    if (pathname.endsWith('/leaflet.js')) {
      data = Buffer.concat([data, Buffer.from('\nwindow.testMaps={};L.Map.addInitHook(function(){testMaps[this.getContainer().id]=this;});')]);
    }
    res.setHeader('content-type', { '.html': 'text/html;charset=utf-8', '.js': 'text/javascript;charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.geojson': 'application/json', '.webp': 'image/webp' }[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
});

(async () => {
  let browser;
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    browser = await chromium.launch({ channel: process.env.MAP_TEST_CHANNEL || 'msedge', headless: true });
    for (const status of [200, 401]) {
      routeStatus = status;
      const page = await browser.newPage({ viewport: { width: 1262, height: 900 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.route('**/*', route => route.request().url().startsWith('http://127.0.0.1:') ? route.continue() : route.abort());
      await page.goto(`http://127.0.0.1:${server.address().port}/learning/inquiry/korea-map/#travel`);
      await page.waitForFunction(() => window.testMaps?.map);
      await page.evaluate(() => { testMaps.map.options.inertia = false; });
      for (let cycle = 0; cycle < 3; cycle++) {
        await page.evaluate(() => testMaps.map.setView([37.88, 127.73], 9, { animate: false }));
        await page.locator('.travel-pin-wrapper[title="알파카월드"]').click();
        await page.waitForFunction(() => /자동차로 약|학교 연결/.test(document.getElementById('routeStatus').textContent));
        await page.waitForTimeout(700); // Finish route fitBounds before closing the dialog.
        await page.locator('#placeClose').click();
        await page.evaluate(() => testMaps.map.setView([36.5, 127.73], 9, { animate: false }));
        // Keep the same zoom and drag north: marker layer coordinates can become negative.
        await page.mouse.move(700, 250);
        await page.mouse.down();
        await page.mouse.move(700, 650, { steps: 12 });
        await page.mouse.up();
        await page.waitForTimeout(700); // Allow Leaflet drag inertia to finish.
        const pin = page.locator('.travel-pin-wrapper[title="덕평공룡수목원"]');
        const hit = await pin.evaluate(el => {
          const box = el.getBoundingClientRect();
          const target = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
          return { reachesPin: el.contains(target), interceptedBy: target?.tagName };
        });
        assert.ok(hit.reachesPin, `Route ${status}, cycle ${cycle}: pin covered by ${hit.interceptedBy}`);
        await pin.click({ timeout: 3000 });
        assert.equal(await page.locator('#placeDialog').evaluate(el => el.open), true);
        assert.equal(await page.locator('#placeName').textContent(), '덕평공룡수목원');
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#placeDialog').evaluate(el => el.open), false);
        await page.locator('#map .leaflet-control-zoom-in').click();
        await page.locator('#map .leaflet-control-zoom-out').click();
      }
      for (const theme of ['heritage', 'travel']) {
        const tab = page.locator(`.theme-tab[data-theme="${theme}"]`);
        await tab.click();
        assert.equal(await tab.getAttribute('aria-pressed'), 'true');
      }
      await page.evaluate(() => testMaps.map.setView([37.88, 127.73], 9, { animate: false }));
      await page.locator('.travel-pin-wrapper[title="알파카월드"]').click();
      assert.equal(await page.locator('#placeDialog').evaluate(el => el.open), true);
      assert.deepEqual(errors, []);
      console.log(`PASS: route ${status}, 3 route/close/drag/place-click/Escape/zoom cycles, theme switch and reopen`);
      await page.close();
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
