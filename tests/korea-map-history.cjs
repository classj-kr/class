const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const vm = require('node:vm');
const puppeteer = require('puppeteer-core');
const root = path.resolve(__dirname, '..');
const app = path.join(root, 'learning/inquiry/korea-map');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(app, 'data/history-data.js'), 'utf8'), context);
const scenes = context.window.KOREA_HISTORY.scenes;
const boundaryData = JSON.parse(fs.readFileSync(path.join(app,'history/boundaries.json'),'utf8'));
for (const scene of scenes.filter(s => s.overlay)) {
  const geometry = boundaryData.scenes[scene.id];
  assert.ok(geometry.controls.length >= 8);
  assert.ok(scene.mapSource[1].includes('jihak.co.kr'));
  assert.equal(scene.areas.length,0,'Old hand-picked polygons must not return');
  for (const area of geometry.areas) {
    assert.deepEqual(area.ring[0],area.ring.at(-1));
    assert.ok(area.ring.length >= 25);
    if(area.name==='가야') assert.ok(area.ring.every(p=>p[1]<36.5),'Northern campaign arrows are not Gaya');
    for (const [x,y] of area.ring) {
      assert.ok(Number.isFinite(x) && Number.isFinite(y));
      assert.ok(x >= scene.overlayBounds[0] && x <= scene.overlayBounds[2] && y >= scene.overlayBounds[1] && y <= scene.overlayBounds[3],`${scene.id} overlay must not clip its geometry: ${x},${y}`);
    }
  }
}
assert.ok(boundaryData.scenes['silla-sixth'].areas.some(a=>a.pattern==='hatch'));
assert.equal(new Set(scenes.map(s => s.id)).size, scenes.length);
scenes.forEach((scene, i) => {
  assert.ok(scene.startYear <= scene.endYear);
  assert.ok(i === 0 || scenes[i - 1].startYear <= scene.startYear);
  assert.ok(scene.source.startsWith('https://'));
  assert.ok(scene.note && scene.cues.length && scene.trap);
  scene.marks.forEach(mark => {
    assert.ok(mark.xy[0] >= scene.bounds[0] && mark.xy[0] <= scene.bounds[2], `${scene.id}: longitude`);
    assert.ok(mark.xy[1] >= scene.bounds[1] && mark.xy[1] <= scene.bounds[3], `${scene.id}: latitude`);
  });
  if (scene.overlay) assert.ok(fs.existsSync(path.join(app, scene.overlay.split('?')[0])));
});
const server = http.createServer((req, res) => {
  let file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  if (file.endsWith(path.sep)) file = path.join(file, 'index.html');
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404).end(); return; }
    if (file.endsWith(path.join('leaflet', 'leaflet.js'))) data = Buffer.concat([data, Buffer.from('\nwindow.testMaps={};L.Map.addInitHook(function(){window.testMaps[this.getContainer().id]=this;});')]);
    res.setHeader('Content-Type', { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css', '.json':'application/json', '.geojson':'application/json', '.svg':'image/svg+xml', '.webp':'image/webp', '.woff2':'font/woff2' }[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await puppeteer.launch({ headless:true, executablePath:process.env.MAP_TEST_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe', args:['--no-first-run','--disable-background-networking'] });
    const page = await browser.newPage();
    const errors = [];
    const missing = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', res => { if (res.status() >= 400 && /history/.test(res.url())) missing.push(res.url()); });
    const url = `http://127.0.0.1:${server.address().port}/learning/inquiry/korea-map/`;
    await page.setViewport({ width:1440, height:1000 });
    await page.goto(url + '#history', { waitUntil:'networkidle0' });
    await page.waitForSelector('#historyScene');
    assert.equal(await page.$eval('.history-panel', n => n.firstElementChild.className), 'history-eras');
    assert.equal(await page.$eval('#historyScene', n => n.getAttribute('aria-label')), '역사 지도 선택');
    assert.equal(await page.$eval('.history-panel', n => /한국사 · 지도 읽기|시대순으로 보는 역사|지도 주제 · 시작 연대순/.test(n.innerText)), false);
    assert.deepEqual(await page.$$eval('.theme-tab', nodes => nodes.map(n => n.dataset.theme).slice(-3)), ['heritage','history','travel']);
    assert.equal(await page.$eval('#historyPrevious', n => n.disabled), true);
    assert.equal(await page.$eval('#labelToggle', n => n.hidden), true);
    assert.equal(await page.evaluate(() => testMaps.map.getPane('borderLines').hidden), true);
    const out = path.join(root, 'outputs/korea-map-history');
    fs.mkdirSync(out, { recursive:true });
    for (const scene of scenes) {
      await page.select('#historyScene', scene.id);
      const state = await page.evaluate(() => {
        const map = testMaps.map;
        const id = document.querySelector('#historyScene').value;
        const scene = KOREA_HISTORY.scenes.find(s => s.id === id);
        return {
          title:document.querySelector('.history-scene-heading h3').textContent,
          count:document.querySelectorAll('.history-point').length,
          labels:document.querySelectorAll('.history-map-label').length,
          allInView:scene.marks.every(m => map.getBounds().contains([m.xy[1],m.xy[0]])),
          handlers:(map._events.moveend || []).length
        };
      });
      assert.equal(state.title, scene.title);
      assert.equal(state.count, scene.marks.length, scene.id);
      assert.equal(state.labels, scene.marks.length, scene.id);
      assert.ok(state.allInView, `${scene.id}: out of view`);
      assert.ok(state.handlers < 20, `${scene.id}: event handlers leaked`);
    }
    assert.equal(await page.$eval('#historyNext', n => n.disabled), true);
    await page.click('#historyPrevious');
    assert.equal(await page.$eval('#historyScene', n => n.value), 'liberation-army');
    await page.select('#historyScene', 'silla-sixth');
    await page.waitForNetworkIdle({idleTime:600});
    await page.screenshot({ path:path.join(out, 'history-desktop.png'), fullPage:true });
    for (const id of ['baekje-fourth','goguryeo-fifth','baekje-capitals']) {
      await page.select('#historyScene', id);
      await page.waitForNetworkIdle({idleTime:600});
      if (id === 'baekje-capitals') assert.ok(await page.evaluate(()=>testMaps.map.getZoom()>8));
      await page.screenshot({path:path.join(out, `${id}-desktop.png`),fullPage:true});
    }
    await page.select('#historyScene', 'silla-sixth');
    let before;
    for (let i=0; i<5; i++) {
      await page.click('[data-theme="terrain"]');
      assert.equal(await page.$$eval('.history-point,.history-map-label', ns => ns.length), 0);
      assert.equal(await page.evaluate(() => testMaps.map.getPane('borderLines').hidden), false);
      assert.equal(await page.$eval('#historyMapCaption', n => n.hidden), true);
      await page.click('[data-theme="history"]');
      assert.equal(await page.$eval('#historyScene', n => n.value), 'silla-sixth');
      const handlers = await page.evaluate(() => (testMaps.map._events.moveend || []).length);
      if (i === 0) before = handlers; // Terrain lazily installs its first flow listener.
      else assert.equal(handlers, before);
    }
    assert.equal(await page.evaluate(() => (testMaps.map._events.moveend || []).length), before);
    for (const width of [390, 768]) {
      await page.setViewport({ width, height:844 });
      await page.evaluate(() => testMaps.map.invalidateSize({ animate:false }));
      for (const id of scenes.map(s => s.id)) {
        await page.select('#historyScene', id);
        const state = await page.evaluate(() => ({
          id:document.querySelector('#historyScene').value,
          allInView:KOREA_HISTORY.scenes.find(s => s.id === document.querySelector('#historyScene').value).marks.every(m => testMaps.map.getBounds().contains([m.xy[1],m.xy[0]])),
          mapSize:testMaps.map.getSize(), zoom:testMaps.map.getZoom(), bounds:testMaps.map.getBounds(),
          overflow:document.documentElement.scrollWidth > innerWidth,
          labels:[...document.querySelectorAll('.history-map-label')].map(n => {
            const r = n.getBoundingClientRect(); const m = document.querySelector('#map').getBoundingClientRect();
            return { x:r.x-m.x, y:r.y-m.y, right:r.right-m.x, bottom:r.bottom-m.y, w:m.width, h:m.height };
          })
        }));
        assert.equal(state.overflow, false, `${width} ${id}: horizontal overflow`);
        assert.ok(state.allInView, `${width} ${id}: map cropped`);
        if (!state.labels.length) await page.screenshot({ path:path.join(out, 'failure-mobile.png'), fullPage:true });
        assert.ok(state.labels.length > 0, `${width} ${id}: ${JSON.stringify(state)}`);
        for (const r of state.labels) assert.ok(r.x >= 0 && r.y >= 0 && r.right <= r.w+1 && r.bottom <= r.h+1, `${width} ${id}: label clipped ${JSON.stringify(r)}`);
      }
      await page.select('#historyScene', 'silla-sixth');
      await page.evaluate(() => scrollTo(0,0));
      await page.waitForNetworkIdle({idleTime:600});
      await page.screenshot({ path:path.join(out, `history-${width}.png`), fullPage:true });
    }
    await page.setViewport({ width:1440, height:1000 });
    for (const theme of ['heritage','travel','climate','terrain']) {
      await page.click(`[data-theme="${theme}"]`);
      assert.equal(await page.$$eval('.history-map-label,.history-point', ns => ns.length), 0);
      assert.equal(await page.evaluate(() => testMaps.map.getPane('borderLines').hidden), false);
      assert.equal(await page.$eval('.theme-tab.is-active', n => n.dataset.theme), theme);
    }
    assert.deepEqual(errors, []);
    assert.deepEqual(missing, []);
    await page.goto(url+'?historyScene=silla-sixth#history',{waitUntil:'networkidle0'});
    assert.equal(await page.$eval('#historyScene',n=>n.value),'silla-sixth');
    const pins = await page.$$eval('.history-point',ns=>ns.slice(0,2).map(n=>{const r=n.getBoundingClientRect();return [r.x,r.y]}));
    assert.ok(Math.hypot(pins[0][0]-pins[1][0],pins[0][1]-pins[1][1])>=25,'Seoul and Bukhansan pins must be distinct');
    await page.screenshot({path:path.join(out,'silla-direct.png'),fullPage:true});
    console.log(`History passed: ${scenes.length} chronological maps, labels, bounds, sources, assets, navigation, cleanup, desktop/tablet/mobile, neighboring tabs.`);
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(e => { console.error(e); process.exitCode=1; });
