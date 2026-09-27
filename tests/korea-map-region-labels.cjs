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
    browser = await puppeteer.launch({headless:true, executablePath:process.env.MAP_TEST_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe', args:['--no-first-run','--disable-background-networking']});
    const page = await browser.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewport({width:1440,height:1000});
    await page.goto('http://127.0.0.1:' + server.address().port + '/#travel', {waitUntil:'networkidle0'});
    const visible = () => page.$$eval('#map .city-label', nodes => nodes.filter(n => getComputedStyle(n).visibility !== 'hidden').map(n => n.textContent));
    const move = async (point, zoom) => {
      await page.evaluate(({point,zoom}) => window.testMaps.map.setView(point,zoom,{animate:false}), {point,zoom});
      await new Promise(resolve => setTimeout(resolve,200));
    };
    assert.equal(await page.$eval('#labelToggle', n => n.getAttribute('aria-pressed')), 'true');
    await move([35.6,127.7],7);
    let names = await visible();
    for (const name of ['광주','대구','부산']) assert.ok(names.includes(name), name + ' must be shown');
    assert.equal(await page.$$('#map .county-label').then(nodes => nodes.length),0);
    await move([35.9,127.1],9);
    names = await visible();
    for (const name of ['완주군','전주시','진안군']) assert.ok(names.includes(name), name + ' must be shown');
    assert.equal(names.filter(name => name === '전주시').length,1);
    // Distinguish Gwangju Metropolitan City from Gwangju-si in Gyeonggi.
    assert.ok(names.includes('광주'));
    assert.ok(names.includes('광주시'));
    const expectedCount = await page.evaluate(() => window.KOREA_REGIONS.counties.length);
    await move([36.2,127.5],12);
    const mounted = await page.$$eval('#map .city-label',nodes => nodes.map(n => n.textContent));
    const missing = await page.evaluate(() => {
      const names = new Set([...document.querySelectorAll('#map .city-label')].map(n => n.textContent));
      return window.KOREA_REGIONS.counties.map(row => row[0]).filter(name => !names.has(name));
    });
    assert.deepEqual(missing,[],'Every bundled city/county is available when zoomed in');
    await page.click('#labelToggle');
    assert.equal((await visible()).length,0);
    await page.click('[data-theme="heritage"]');
    assert.equal(await page.$eval('#labelToggle',n => n.getAttribute('aria-pressed')),'true');
    await move([35.9,127.1],9);
    assert.ok((await visible()).includes('완주군'));
    await page.click('[data-theme="history"]');
    assert.equal((await visible()).length,0,'Modern city labels stay out of historical maps');
    await page.click('[data-theme="travel"]');
    await move([35.9,127.1],9);
    // Place markers remain clickable through the passive label pane.
    await page.evaluate(() => document.querySelector('#map .travel-pin').click());
    assert.ok(await page.$eval('#placeDialog',n => n.open));
    await page.click('#placeClose');
    await page.setViewport({width:390,height:844});
    await move([35.87,128.60],9);
    assert.ok((await visible()).includes('대구'));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    // A cold administrative-map load and every lesson must retain the full names.
    await page.setViewport({width:1440,height:1000});
    await page.goto('http://127.0.0.1:' + server.address().port + '/#region', {waitUntil:'networkidle0'});
    const provinces = () => page.$$eval('#map .geo-annotation--province', nodes => nodes.filter(n => getComputedStyle(n).visibility !== 'hidden').map(n => n.textContent));
    assert.ok((await provinces()).includes('경상북도'),'Administrative names appear without opening any control');
    assert.ok(await page.$eval('#labelToggle',n => n.hidden));
    for (const lesson of ['regions','division','north']) {
      await page.select('#lessonSelect',lesson);
      assert.equal(await page.$$eval('#map .geo-annotation--province',nodes => nodes.length),28,'Province layer survives lesson ' + lesson);
      await move([36.2,127.5],9);
      const names = await provinces();
      for (const name of ['경기도','충청북도','전북특별자치도','광주광역시','대구광역시']) assert.ok(names.includes(name), lesson + ': ' + name);
      assert.equal(await page.$$eval('#map .geo-annotation--county',nodes => nodes.length),expectedCount);
      assert.ok(await page.$$eval('#map .geo-annotation--county',nodes => nodes.some(n => n.textContent.includes('완주군') && getComputedStyle(n).visibility !== 'hidden')));
    }
    await page.click('[data-theme="travel"]');
    await page.click('[data-theme="region"]');
    assert.equal(await page.$$eval('#map .geo-annotation--province',nodes => nodes.length),28,'Returning to the tab preserves names');
    await page.setViewport({width:390,height:844});
    await move([35.87,128.60],9);
    assert.ok((await provinces()).includes('대구광역시'));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(errors,[]);
    console.log('Region labels passed: major cities, ' + expectedCount + ' city/county names, zoom levels, toggle, theme changes, clickable places, and mobile.');
  } finally {
    if (browser) await browser.close();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => {console.error(error);process.exitCode=1;});
