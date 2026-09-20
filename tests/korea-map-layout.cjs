const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const puppeteer = require('puppeteer-core');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'outputs/korea-map-layout');
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  fs.readFile(file, (error, data) => {
    if (error) return res.writeHead(404).end();
    if (file.endsWith(path.join('leaflet', 'leaflet.js'))) data = Buffer.concat([data, Buffer.from('\nwindow.testMaps={};L.Map.addInitHook(function(){window.testMaps[this.getContainer().id]=this;});')]);
    res.setHeader('Content-Type', { '.js': 'text/javascript; charset=utf-8', '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.woff2': 'font/woff2' }[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, executablePath: process.env.MAP_TEST_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--no-first-run', '--disable-background-networking'] });
    fs.mkdirSync(output, { recursive: true });
    const page = await browser.newPage(), errors = [], report = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setRequestInterception(true);
    page.on('request', request => request.url().startsWith('http://127.0.0.1:') || request.url().startsWith('data:') ? request.continue() : request.abort());
    for (const width of [1920, 1440, 1051, 820, 390]) {
      await page.setViewport({ width, height: 1000 });
      await page.goto('http://127.0.0.1:' + server.address().port + '/learning/inquiry/korea-map/index.html#terrain', { waitUntil: 'networkidle0' });
      await page.evaluate(() => document.fonts.ready);
      const metrics = await page.evaluate(() => {
        const panel = document.querySelector('.study-panel').getBoundingClientRect();
        const nav = document.querySelector('.theme-tabs').getBoundingClientRect();
        const diagram = document.querySelector('#lessonDiagram').getBoundingClientRect();
        const svg = document.querySelector('#lessonDiagram svg');
        const title = document.querySelector('#lessonTitle').getBoundingClientRect();
        const map = document.querySelector('#map');
        const mapSize = testMaps.map.getSize();
        return { panelTop: panel.top, panelLeft: panel.left, navRight: nav.right, diagramInset: diagram.top - panel.top, svgWidth: svg.getBoundingClientRect().width, renderedLabelSize: parseFloat(getComputedStyle(svg).fontSize) * svg.getScreenCTM().a, titleHeight: title.height, columns: getComputedStyle(document.querySelector('#lessonDiagram')).gridTemplateColumns, overflow: document.documentElement.scrollWidth > innerWidth, mapSizeCorrect: mapSize.x === map.clientWidth && mapSize.y === map.clientHeight, font: getComputedStyle(document.querySelector('.reading-steps')).fontFamily };
      });
      assert.ok(!metrics.overflow && metrics.svgWidth <= 521 && metrics.renderedLabelSize <= 17, JSON.stringify(metrics));
      assert.equal(metrics.titleHeight, 1);
      assert.ok(metrics.mapSizeCorrect, JSON.stringify(metrics));
      assert.ok(metrics.font.includes('Korea KoPubWorld Batang'));
      assert.ok(metrics.diagramInset <= 110, JSON.stringify(metrics));
      if (width > 1050) {
        assert.equal(metrics.panelTop, 0);
        assert.ok(metrics.navRight <= metrics.panelLeft + 1);
      }
      // All lessons retain usable diagrams and labels at every layout breakpoint.
      const lessons = await page.evaluate(() => KOREA_GEOGRAPHY.lessons.map(({ id, topic }) => ({ id, topic })));
      for (const lesson of lessons) {
        await page.evaluate(lesson => {
          document.querySelector('[data-theme="' + lesson.topic + '"]').click();
          const select = document.querySelector('#lessonSelect');
          select.value = lesson.id; select.dispatchEvent(new Event('change', { bubbles: true }));
        }, lesson);
        const overflow = await page.$$eval('#lessonDiagram svg text', nodes => nodes.filter(node => { const box = node.getBBox(); return box.x < -1 || box.x + box.width > 521 || box.y < -1 || box.y + box.height > 251; }).map(node => node.textContent));
        assert.deepEqual(overflow, [], lesson.id + ' / ' + width);
      }
      await page.evaluate(() => {
        document.querySelector('[data-theme="terrain"]').click();
        const select = document.querySelector('#lessonSelect'); select.selectedIndex = 0; select.dispatchEvent(new Event('change', { bubbles: true }));
        document.querySelector('.study-panel').scrollTop = 0;
        if (innerWidth <= 1050) document.querySelector('#studyWorkspace').scrollIntoView({ block: 'start' });
      });
      await page.screenshot({ path: path.join(output, 'layout-' + width + '.png') });
      if (width === 1920) await (await page.$('.study-panel')).screenshot({ path: path.join(output, 'study-panel.png') });
      await page.click('#maskConcept');
      assert.equal(await page.$eval('#maskConcept', el => el.getAttribute('aria-pressed')), 'true');
      await page.click('#quickPractice');
      assert.ok(await page.$eval('#practiceDialog', el => el.open));
      await page.$eval('#practiceDialog', el => el.close());
      // Exploration panels also start at the top and use the refreshed map size.
      for (const theme of ['heritage', 'travel']) {
        await page.evaluate(theme => document.querySelector('[data-theme="' + theme + '"]').click(), theme);
        assert.ok(await page.evaluate(() => {
          const map = testMaps.map, el = map.getContainer();
          return map.getSize().x === el.clientWidth && map.getSize().y === el.clientHeight &&
            (innerWidth <= 1050 || document.querySelector('.study-panel').getBoundingClientRect().top === 0);
        }));
      }
      report.push({ width, ...metrics, lessons: lessons.length });
    }
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(output, 'verification.json'), JSON.stringify({ report, errors }, null, 2));
    console.log(JSON.stringify({ report, errors }, null, 2));
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

