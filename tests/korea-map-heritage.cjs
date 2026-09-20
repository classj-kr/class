const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const puppeteer = require('puppeteer-core');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'outputs/korea-map-heritage');
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  fs.readFile(file, (error, data) => {
    if (error) return res.writeHead(404).end();
    if (file.endsWith(path.join('leaflet', 'leaflet.js'))) {
      data = Buffer.concat([data, Buffer.from('\nwindow.testMaps={};L.Map.addInitHook(function(){window.testMaps[this.getContainer().id]=this;});')]);
    }
    res.setHeader('Content-Type', { '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.html': 'text/html; charset=utf-8', '.woff2': 'font/woff2' }[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  const reports = [];
  try {
    browser = await puppeteer.launch({ headless: true, executablePath: process.env.MAP_TEST_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--no-first-run', '--disable-background-networking'] });
    fs.mkdirSync(output, { recursive: true });
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage(), errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.setRequestInterception(true);
      page.on('request', request => request.url().startsWith('http://127.0.0.1:') || request.url().startsWith('data:') ? request.continue() : request.abort());
      await page.setViewport(viewport);
      await page.goto('http://127.0.0.1:' + server.address().port + '/learning/inquiry/korea-map/index.html#heritage', { waitUntil: 'networkidle0' });
      const relics = await page.evaluate(() => KOREA_HERITAGE.map(({ id, title, lat, lng }) => ({ id, title, lat, lng })));
      assert.equal(relics.length, 68);
      let clicks = 0, clustered = 0;
      const clickedAtMaximum = new Set();
      for (const zoom of [6, 7, 8, 9, 10, 11, 12]) {
        for (const relic of relics) {
          await page.mouse.move(0, 0);
          const found = await page.evaluate(({ relic, zoom }) => {
            document.querySelector('#relicDialog').close();
            const map = testMaps.map;
            map.setView([relic.lat, relic.lng], zoom, { animate: false });
            const markers = [...document.querySelectorAll('#map .relic-pin-wrapper')];
            const boxes = markers.map(element => ({ title: element.title, box: element.getBoundingClientRect() }));
            for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
              const a = boxes[i].box, b = boxes[j].box;
              if (Math.abs(a.x + a.width / 2 - b.x - b.width / 2) < 53 &&
                  Math.abs(a.y + a.height / 2 - b.y - b.height / 2) < 53) {
                throw new Error('Overlapping pins: ' + boxes[i].title + ' / ' + boxes[j].title);
              }
            }
            const marker = Object.values(map._layers).find(layer => layer instanceof L.Marker && layer.options.title === relic.title);
            if (!marker) return false;
            // On a narrow screen a displaced marker may require a short pan to reach it.
            map.panTo(marker.getLatLng(), { animate: false });
            document.querySelector('#map').scrollIntoView({ block: 'center' });
            return true;
          }, { relic, zoom });
          if (!found) {
            assert.notEqual(zoom, 12, 'Hidden at maximum zoom: ' + relic.title);
            clustered++;
            continue;
          }
          await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
          const position = await page.evaluate(title => {
            const el = [...document.querySelectorAll('#map .relic-pin-wrapper')].find(el => el.title === title);
            const box = el.getBoundingClientRect(), x = box.x + box.width / 2, y = box.y + box.height / 2;
            return { x, y, hit: document.elementFromPoint(x, y)?.closest('.relic-pin-wrapper')?.title };
          }, relic.title);
          assert.equal(position.hit, relic.title, 'Hit target: ' + relic.title + ' at zoom ' + zoom);
          await page.mouse.click(position.x, position.y);
          const opened = await page.evaluate(() => ({ open: document.querySelector('#relicDialog').open, title: document.querySelector('#relicTitle').textContent, text: document.querySelector('#relicContext').textContent }));
          assert.ok(opened.open && opened.title === relic.title && opened.text, JSON.stringify({ relic, zoom, opened }));
          clicks++;
          if (zoom === 12) clickedAtMaximum.add(relic.id);
        }
      }
      assert.equal(clickedAtMaximum.size, 68);
      await page.evaluate(() => {
        document.querySelector('#relicDialog').close();
        testMaps.map.setView([37.55, 126.98], 7, { animate: false });
      });
      const cluster = await page.$('#map .relic-cluster');
      assert.ok(cluster);
      // Real cluster click must make progress toward individually reachable pins.
      await cluster.click();
      await page.waitForFunction(() => testMaps.map.getZoom() > 7 && !testMaps.map._animatingZoom);
      await page.evaluate(() => document.querySelector('#relicDialog').close());
      // Filter and theme redraws must keep the marker collection consistent.
      await page.evaluate(() => {
        document.querySelector('[data-theme="travel"]').click();
        document.querySelector('[data-theme="heritage"]').click();
        document.querySelectorAll('.era-chip')[1].click();
        document.querySelectorAll('.era-chip')[0].click();
        testMaps.map.setView([40.5, 126.4], 7, { animate: false });
        document.querySelector('#map').scrollIntoView({ block: 'center' });
      });
      await page.screenshot({ path: path.join(output, 'heritage-' + viewport.width + '.png') });
      // Ten identical locations must not become an unopenable cluster at maximum zoom.
      await page.evaluate(() => {
        KOREA_HERITAGE.slice(0, 10).forEach(relic => { relic.lat = 40; relic.lng = 127; });
        document.querySelectorAll('.era-chip')[1].click();
        document.querySelectorAll('.era-chip')[0].click();
        testMaps.map.setView([40, 127], 12, { animate: false });
      });
      assert.equal(await page.$$eval('#map .relic-cluster', els => els.length), 0);
      assert.equal(await page.$$eval('#map .relic-pin', els => els.length), 68);
      const target = await page.$('#map .relic-pin-wrapper[title="' + relics[0].title + '"]');
      await target.focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.$eval('#relicTitle', el => el.textContent), relics[0].title);
      assert.ok(await page.$eval('#relicDialog', el => el.open));
      await page.$eval('#relicDialog', el => el.close());
      await target.focus();
      await page.keyboard.press('Space');
      assert.equal(await page.$eval('#relicTitle', el => el.textContent), relics[0].title);
      assert.ok(await page.$eval('#relicDialog', el => el.open));
      assert.deepEqual(errors, []);
      reports.push({ viewport, clicks, clustered, individuallyReachableAtMaxZoom: clickedAtMaximum.size, errors });
      await page.close();
    }
    fs.writeFileSync(path.join(output, 'verification.json'), JSON.stringify(reports, null, 2));
    console.log(JSON.stringify(reports, null, 2));
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
