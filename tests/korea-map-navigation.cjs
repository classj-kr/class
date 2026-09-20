const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const puppeteer = require('puppeteer-core');
const root = path.resolve(__dirname, '../learning/inquiry/korea-map');

// Run the production app and bundled Leaflet; expose map instances only in this test server.
const server = http.createServer((req, res) => {
  let file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  if (file === root) file = path.join(root, 'index.html');
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404).end(); return; }
    if (file.endsWith(path.join('leaflet', 'leaflet.js'))) {
      data = Buffer.concat([data, Buffer.from('\nwindow.testMaps = {}; L.Map.addInitHook(function () { window.testMaps[this.getContainer().id] = this; });')]);
    }
    res.setHeader('Content-Type', { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.geojson': 'application/json', '.webp': 'image/webp' }[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, executablePath: process.env.MAP_TEST_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--no-first-run', '--disable-background-networking'] });
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(`http://127.0.0.1:${server.address().port}/`, { waitUntil: 'networkidle0' });
    const checkBounds = async (id = 'map') => {
      const result = await page.evaluate(id => {
        const map = window.testMaps[id];
        const visible = map.getPixelBounds();
        const allowed = map.options.maxBounds;
        const nw = map.project(allowed.getNorthWest());
        const se = map.project(allowed.getSouthEast());
        return { fits: visible.min.x >= nw.x - 1 && visible.min.y >= nw.y - 1 && visible.max.x <= se.x + 1 && visible.max.y <= se.y + 1, zoom: map.getZoom(), minZoom: map.getMinZoom() };
      }, id);
      assert.ok(result.fits, `${id} escaped its regional bounds: ${JSON.stringify(result)}`);
      assert.ok(result.zoom >= result.minZoom);
    };
    await checkBounds();
    // Nearby countries and the full domestic territory remain reachable.
    for (const point of [[39.9, 116.4], [47.9, 106.9], [43.1, 131.9], [35.7, 139.7], [33.1, 131.87]]) {
      assert.ok(await page.evaluate(point => {
        const map = window.testMaps.map;
        map.setView(point, 8, { animate: false });
        return map.getBounds().contains(point);
      }, point));
      await checkBounds();
    }
    // Direct pan requests and extreme zoom-out cannot escape in any direction.
    for (const point of [[80, 127], [-30, 127], [38, -30], [38, 220]]) {
      await page.evaluate(point => window.testMaps.map.setView(point, 5, { animate: false }), point);
      await checkBounds();
    }
    // Drag while the pointer is held down must stop at the boundary, without a release-time bounce.
    await page.evaluate(() => window.testMaps.map.setView([60, 90], 5, { animate: false }));
    const box = await page.$eval('#map', el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; });
    await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.25);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.8, { steps: 15 });
    await checkBounds();
    await page.mouse.up();
    for (const viewport of [{ width: 390, height: 844 }, { width: 2560, height: 800 }, { width: 390, height: 1600 }]) {
      await page.setViewport(viewport);
      await page.evaluate(() => { const map = window.testMaps.map; map.invalidateSize({ animate: false }); map.setZoom(0, { animate: false }); });
      await checkBounds();
    }
    // The question map starts hidden and receives a usable lower limit when opened.
    await page.evaluate(() => {
      document.querySelector('#practiceDialog').showModal();
      const map = window.testMaps.questionMap;
      map.getContainer().style.height = '300px';
      map.getContainer().style.display = 'block';
      map.invalidateSize({ animate: false });
      map.setView([80, 0], 0, { animate: false });
    });
    await checkBounds('questionMap');
    assert.deepEqual(errors, []);
    console.log('Korea map navigation passed: nearby countries, edge drags, pan limits, zoom-out, desktop/mobile resize, hidden question map.');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
