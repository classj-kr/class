const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname, '../learning/inquiry/science-lab');
const out = path.resolve(__dirname, '../docs/science-lab-audit-2026-09-20/life-anatomy-review');
const cases = [['butterfly', 0], ['butterfly', 1], ['butterfly', 3], ['mantis', 0], ['mantis', 1], ['mantis', 2], ['frog', 3]];

for (const engine of ['chromium', 'webkit']) test(engine + ': life anatomy, forward crawling and visible attachments', { timeout: 120000 }, async () => {
  fs.mkdirSync(out, { recursive: true });
  const server = http.createServer((req, res) => {
    let file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
    if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    fs.readFile(file, (error, bytes) => {
      if (error) return res.writeHead(404).end();
      res.setHeader('Content-Type', { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css' }[path.extname(file)] || 'application/octet-stream');
      res.end(bytes);
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await require('playwright')[engine].launch({ headless: true, ...(engine === 'chromium' ? { executablePath: process.env.SCIENCE_BROWSER } : {}) });
    const page = await browser.newPage({ viewport: { width: 1024, height: 768 }, hasTouch: true });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error' && /<path>|SVG|attribute d/.test(message.text())) errors.push(message.text()); });
    await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    await page.goto('http://127.0.0.1:' + server.address().port + '/life-cycle/');
    await page.waitForFunction(() => !!window.__lifeModel);
    const select = async (animal, step) => {
      await page.locator('[data-animal="' + animal + '"]').tap();
      await page.locator('[data-life-step="' + step + '"]').tap();
    };
    const seek = ms => page.evaluate(ms => {
      for (const element of document.querySelectorAll('#mainGroup [data-life-motion]')) {
        for (const animation of element.getAnimations()) { animation.pause(); animation.currentTime = ms; }
      }
    }, ms);

    for (const [animal, step] of cases) {
      await select(animal, step);
      await seek(0);
      // Every pigment reference resolves in its own SVG, including the selected thumbnail.
      const paint = await page.evaluate(() => {
        const ids = [...document.querySelectorAll('.life-specimen [id]')].map(e => e.id);
        const missing = [...document.querySelectorAll('.life-specimen [fill^="url("]')].filter(e => !e.ownerSVGElement.querySelector('[id="' + e.getAttribute('fill').slice(5, -1) + '"]')).length;
        return { unique: new Set(ids).size === ids.length, missing };
      });
      assert.deepEqual(paint, { unique: true, missing: 0 });
      const part = name => page.locator('#mainGroup [data-life-part="' + name + '"]');
      if ((animal === 'butterfly' && step === 3) || (animal === 'mantis' && step > 0)) {
        for (const name of ['head', 'thorax', 'abdomen']) assert.equal(await part(name).count(), 1);
        assert.equal(await part('leg').count(), 6);
        const adult = step === (animal === 'butterfly' ? 3 : 2);
        assert.equal(await part('forewing').count(), adult ? 2 : 0);
        assert.equal(await part('hindwing').count(), adult ? 2 : 0);
        // Verify actual drawn path roots, not merely a data attribute claiming attachment.
        const detached = await page.evaluate(() => {
          const thorax = document.querySelector('#mainGroup [data-life-part="thorax"]').getBoundingClientRect();
          return [...document.querySelectorAll('#mainGroup [data-attached-to="thorax"]')].filter(e => {
            const p = e.tagName === 'path' ? e : e.querySelector('path');
            const point = p.getPointAtLength(0), screen = new DOMPoint(point.x, point.y).matrixTransform(p.getScreenCTM());
            return screen.x < thorax.left - 2 || screen.x > thorax.right + 2 || screen.y < thorax.top - 2 || screen.y > thorax.bottom + 2;
          }).length;
        });
        assert.equal(detached, 0, animal + ': all legs and wing roots meet the thorax');
      }
      if (animal === 'butterfly' && step === 0) {
        assert.match(await part('egg-shell').getAttribute('d'), /Z$/);
        assert.equal(await part('egg-shell').getAttribute('clip-path'), null);
        const egg = await part('egg-shell').evaluate(e => { const b = e.getBBox(); return { x: b.x, y: b.y, right: b.x + b.width, bottom: b.y + b.height }; });
        assert(egg.x > 0 && egg.y > 0 && egg.right < 200 && egg.bottom < 200);
      }
      if (animal === 'butterfly' && step === 1) {
        assert.equal(await page.locator('#mainGroup [data-crawl-segment]').count(), 14, '13 body segments and a head');
        assert.equal(await part('thoracic-leg-pair').count(), 3);
        assert.equal(await part('proleg-pair').count(), 5);
        assert.deepEqual(await part('proleg-pair').evaluateAll(es => es.map(e => Number(e.parentElement.dataset.crawlSegment))), [0, 4, 5, 6, 7], 'anal pair and abdominal A3-A6');
        const positions = [];
        for (let ms = 0; ms <= 10400; ms += 200) {
          await seek(ms);
          positions.push(await page.locator('#mainGroup [data-crawl-segment]').evaluateAll(es => es.map(e => new DOMMatrix(getComputedStyle(e).transform).m41)));
        }
        for (let i = 1; i < positions.length; i++) for (let j = 0; j < positions[i].length; j++) assert(positions[i][j] >= positions[i - 1][j] - .001, 'a segment moved backwards');
        for (const x of positions.at(-1)) assert(Math.abs(x - 16) < .01, 'the animal stops at the leaf edge instead of jumping back');
        await page.locator('.life-focus').screenshot({ path: path.join(out, 'butterfly-1-end-' + engine + '.png') });
      }
      if (animal === 'frog') {
        assert.equal(await part('fore-leg').count(), 2);
        assert.equal(await part('hind-leg').count(), 2);
        assert.equal(await page.locator('#mainGroup [data-life-digit="finger"]').count(), 8);
        assert.equal(await page.locator('#mainGroup [data-life-digit="toe"]').count(), 10);
      }
      if (animal === 'butterfly' && step === 3) {
        for (let ms = 0; ms <= 1800; ms += 100) {
          await seek(ms);
          const widths = await page.locator('#mainGroup .life-wing').evaluateAll(es => es.map(e => new DOMMatrix(getComputedStyle(e).transform).m11));
          assert(widths.every(w => w >= .819), 'wings become too narrow to observe');
        }
        await seek(900);
        await page.locator('.life-focus').screenshot({ path: path.join(out, 'butterfly-3-narrow-' + engine + '.png') });
      }
      await seek(0);
      await page.locator('.life-focus').screenshot({ path: path.join(out, animal + '-' + step + '-' + engine + '.png') });
      await page.locator('.main-svg').screenshot({ path: path.join(out, animal + '-' + step + '-specimen-' + engine + '.png') });
      for (const width of [1366, 1024, 820, 768]) {
        await page.setViewportSize({ width, height: width >= 1024 ? 768 : 1024 });
        for (const time of [0, 900, 5200, 11000]) {
          await seek(time);
          const clipped = await page.evaluate(() => {
            const outer = document.querySelector('.main-svg').getBoundingClientRect();
            return [...document.querySelectorAll('#mainGroup [data-life-part],#mainGroup [data-crawl-segment]')].filter(e => {
              const r = e.getBoundingClientRect();
              return r.left < outer.left - 1 || r.right > outer.right + 1 || r.top < outer.top - 1 || r.bottom > outer.bottom + 1;
            }).map(e => e.dataset.lifePart || e.dataset.crawlSegment);
          });
          assert.deepEqual(clipped, [], `${animal} ${step} ${width} ${time}: clipped parts`);
        }
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2), false);
        assert.equal(await page.locator('.life-feature').evaluate(e => e.scrollWidth > e.clientWidth + 1), false);
      }
      await page.setViewportSize({ width: 1024, height: 768 });
    }
    // Human review remains necessary: DOM assertions do not certify the appearance.
    const sharp = require('sharp');
    const sheetCases = cases.filter(([animal, step]) => !(animal === 'mantis' && step === 1));
    const layers = await Promise.all(sheetCases.map(async ([animal, step], i) => ({
      input: await sharp(path.join(out, animal + '-' + step + '-specimen-' + engine + '.png')).resize(320, 320).png().toBuffer(),
      left: (i % 3) * 320, top: Math.floor(i / 3) * 320,
    })));
    await sharp({ create: { width: 960, height: 640, channels: 3, background: '#ffffff' } }).composite(layers).jpeg({ quality: 85 }).toFile(path.join(out, 'review-' + engine + '.jpg'));
    assert.deepEqual(errors, []);
    console.log(engine + ': 7 corrected stages; 28 layouts × 4 motion phases; anatomy anchors, digits, forward-only crawling and SVG paints passed');
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
});
