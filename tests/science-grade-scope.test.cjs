// Local browser regression tests. Requires Playwright (or NODE_PATH to its bundled install).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { test } = require('node:test');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '../learning/inquiry/science-lab');
const apps = ['lever-balance', 'reflex-nerve', 'solubility', 'acid-base', 'ohms-law', 'seasons'];

test('six grade-aligned lessons: interactions, 24 quizzes, boundaries and mobile layout', { timeout: 120000 }, async () => {
  const server = http.createServer((req, res) => {
    let file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
    if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404); res.end(); return; }
      res.setHeader('Content-Type', { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' }[path.extname(file)] || 'application/octet-stream');
      res.end(data);
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ headless: true, executablePath: process.env.SCIENCE_BROWSER || chromium.executablePath() });
    const page = await browser.newPage({ viewport: { width: 1365, height: 980 } });
    // No third-party requests or user browser state are needed to test these local lessons.
    await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const base = `http://127.0.0.1:${server.address().port}`;
    const shotDir = process.env.SCIENCE_SCREENSHOT_DIR;
    if (shotDir) fs.mkdirSync(shotDir, { recursive: true });
    const click = selector => page.locator(selector).click();
    const text = selector => page.locator(selector).evaluate(el => el.innerText ?? el.textContent);
    async function range(id, value) {
      await page.locator('#' + id).evaluate((el, v) => { el.value = String(v); el.dispatchEvent(new Event('input', { bubbles: true })); }, value);
    }
    for (const app of apps) {
      await page.setViewportSize({ width: 1365, height: 980 });
      await page.goto(`${base}/${app}/`, { waitUntil: 'networkidle' });
      if (app === 'lever-balance') {
        await click('[data-prediction="no"]'); await click('#checkBtn');
        assert.match(await text('#predictionResult'), /맞았습니다/);
        assert.equal(await page.evaluate(() => window.__leverModel.lifted()), false);
        await click('[data-method="lever"]'); await click('[data-prediction="yes"]'); await click('#checkBtn');
        assert.equal(await page.evaluate(() => window.__leverModel.lifted()), true);
        assert.match(await text('#predictionResult'), /맞았습니다/);
        await click('[data-method="direct"]'); await click('[data-force="enough"]'); await click('#checkBtn');
        assert.equal(await page.evaluate(() => window.__leverModel.lifted()), true);
        assert.doesNotMatch(await text('main'), /무게\s*[×*]|정비례|심화|기본 모드/);
      }
      if (app === 'reflex-nerve') {
        for (const [kind, centre, prediction] of [['conscious', '대뇌', 'yes'], ['pupil', '중간뇌', 'no'], ['knee', '척수', 'no']]) {
          await click(`[data-path="${kind}"]`);
          const route = await text('#routeList');
          assert.match(route, new RegExp(centre));
          if (kind === 'pupil') assert.doesNotMatch(route, /척수|연수/);
          await click(`[data-prediction="${prediction}"]`); await click('#checkBtn');
          for (let i = 0; i < 4; i++) await click('#nextBtn');
          assert.equal(await page.locator('#nextBtn').isDisabled(), true);
          assert.match(await text('#predictionResult'), /맞았습니다/);
          assert.match(await text('#elementaryExplanation'), new RegExp(centre));
        }
        assert.doesNotMatch(await text('main'), /m\/s|자유 낙하|0\.1초|말이집|심화/);
      }
      if (app === 'solubility') {
        for (const [temperature, amount, dissolved, remaining] of [[20, 33, '33 g', '0 g'], [20, 39, '36 g', '3 g'], [0, 39, '35.7 g', '3.3 g'], [100, 43, '39.8 g', '3.2 g']]) {
          await range('temperatureRange', temperature); await range('amountRange', amount);
          assert.match(await text('#dataNote'), new RegExp(`${amount} g`));
          await click('#runExperimentBtn');
          assert.equal(await text('#dissolvedValue'), dissolved); assert.equal(await text('#remainingValue'), remaining);
          assert.equal(await text('#massBefore'), `${100 + amount} g`); assert.equal(await text('#massAfter'), `${100 + amount} g`);
        }
        await range('temperatureRange', 20); await range('amountRange', 33); await click('#runExperimentBtn');
        await page.waitForTimeout(2400);
        assert.equal(await page.locator('#sedimentGroup rect').count(), 0);
        assert.doesNotMatch(await text('main'), /이온|입자|용해도|Na⁺|Cl⁻/);
        await range('amountRange', 39); await click('#runExperimentBtn'); await range('amountRange', 33);
        await page.waitForTimeout(2400);
        assert.equal(await page.locator('#sedimentGroup rect').count(), 0, 'changed controls cancel old dissolve timers');
        assert.equal(await page.locator('#resultContent').isVisible(), false);
      }
      if (app === 'acid-base') {
        assert.equal(await page.locator('[data-solution]').count(), 4);
        await click('#dipButton'); assert.match(await text('#stageCaption'), /먼저/);
        for (const [solution, type, red, blue] of [['vinegar', 'acid', '그대로', '붉게 변함'], ['lemon', 'acid', '그대로', '붉게 변함'], ['soap', 'base', '푸르게 변함', '그대로'], ['cleaner', 'base', '푸르게 변함', '그대로']]) {
          await click(`[data-solution="${solution}"]`); await click(`[data-prediction="${type}"]`); await click('#dipButton');
          await page.waitForFunction(() => !document.getElementById('resultContent').hidden);
          assert.equal(await text('#redResult'), red); assert.equal(await text('#blueResult'), blue);
          assert.match(await text('#predictionResult'), /맞았습니다/);
        }
        assert.doesNotMatch(await text('main'), /중성|중화|pH/);
        await click('[data-solution="vinegar"]'); await click('#dipButton'); await click('[data-solution="soap"]');
        await page.waitForTimeout(850);
        assert.equal(await page.locator('#resultContent').isVisible(), false, 'selecting a new liquid cancels stale result');
      }
      if (app === 'ohms-law') {
        for (const [wiring, value] of [['series', 'R₁보다 큼'], ['parallel', 'R₁보다 작음']]) {
          await click(`[data-wiring="${wiring}"]`); await click('#checkBtn');
          assert.equal(await text('#resultR'), value);
          assert.doesNotMatch(await text('#stageCaption'), /\d(?:\.\d+)?\s*Ω| = /);
          assert.doesNotMatch(await text('#graphGroup'), /합성 R:|기울기/);
        }
        for (const [v, r] of [[1.5, 5], [12, 50]]) {
          await range('voltRange', v); await range('r1Range', r); await range('r2Range', r);
          const a = await page.evaluate(() => window.__ohmModel.analyse());
          assert.ok(Math.abs(a.I - 2 * v / r) < 1e-10);
          assert.ok(Number.isFinite(a.I));
        }
        assert.match(await text('#stageCaption'), /조건을 정하고/);
      }
      if (app === 'seasons') {
        const results = await page.evaluate(() => {
          const m = window.__seasonModel;
          const result = {};
          for (const season of ['summer', 'winter', 'spring']) { m.set('season', season); result[season] = m.analysePath(); }
          m.set('season', 'winter');
          let progress = 0;
          for (let p = .51; p < 1; p += .001) { const altitude = m.sunAt(4 + 16 * p, m.SEASONS.winter.dec).alt; if (altitude > 9.9 && altitude < 10.1) { progress = p; break; } }
          m.setProgress(progress);
          return { result, progress, alt: m.sunAt(4 + 16 * progress, m.SEASONS.winter.dec).alt, tilts: m.TILTS };
        });
        assert.ok(results.result.summer.noon > results.result.winter.noon);
        assert.ok(results.result.summer.len > results.result.winter.len);
        assert.ok(results.result.summer.shadow < results.result.winter.shadow);
        assert.deepEqual(results.tilts, [0, 23.44]);
        assert.ok(results.progress > .5);
        const expected = (1 / Math.tan(results.alt * Math.PI / 180)).toFixed(1);
        assert.match(await text('#mainGroup'), new RegExp(`그림자 ${expected}배`));
        assert.doesNotMatch(await text('#dataNote'), /90°|위도/);
        for (const p of [0, .5, 1]) {
          await page.evaluate(p => window.__seasonModel.setProgress(p), p);
          assert.doesNotMatch(await page.locator('#mainGroup').innerHTML(), /NaN|Infinity/);
        }
        const orbit = await page.evaluate(() => {
          const m = window.__seasonModel;
          m.setMode('orbit'); m.set('tilt', 0); const flat = m.analyseOrbit();
          m.set('tilt', 23.44); const tilted = m.analyseOrbit();
          m.setMode('path');
          return { flat, tilted };
        });
        assert.equal(orbit.flat.noon, orbit.flat.other);
        assert.equal(orbit.flat.len, orbit.flat.otherLen);
        assert.notEqual(orbit.tilted.noon, orbit.tilted.other);
      }
      await click('.quiz-heading');
      for (const card of await page.locator('.quiz-card').all()) {
        await card.locator('.answer-button').click();
        assert.match(await card.locator('.answer-result').innerText(), /먼저/);
        const answer = await card.getAttribute('data-answer');
        const wrong = card.locator(`input:not([value="${answer}"])`).first();
        await wrong.check(); await card.locator('.answer-button').click();
        assert.equal(await card.getAttribute('data-state'), 'incorrect');
        assert.equal(await wrong.isDisabled(), true);
        assert.equal(await card.locator('.answer-explanation').isVisible(), false);
        await card.locator(`input[value="${answer}"]`).check(); await card.locator('.answer-button').click();
        assert.equal(await card.getAttribute('data-state'), 'correct');
        assert.equal(await card.locator('.answer-explanation').isVisible(), true);
      }
      if (['lever-balance', 'reflex-nerve'].includes(app)) {
        await click('#resetBtn');
        if (app === 'lever-balance') {
          assert.deepEqual(await page.evaluate(() => window.__leverModel.state()), { method: 'direct', force: 'small', prediction: null, ran: false });
          assert.equal(await page.locator('[data-force="small"]').getAttribute('aria-pressed'), 'true');
        } else {
          assert.deepEqual(await page.evaluate(() => window.__reflexModel.state()), { selected: 'conscious', prediction: null, step: -1 });
        }
        assert.equal(await page.locator('.quiz-card[data-state]').count(), 0);
        assert.equal(await page.locator('.quiz-card input:disabled').count(), 0);
        assert.equal(await page.locator('#resultContent').isVisible(), false);
      }
      await click('.quiz-heading');
      if (app === 'lever-balance') { await click('[data-method="lever"]'); await click('#checkBtn'); }
      if (app === 'reflex-nerve') { await click('[data-path="pupil"]'); await click('#checkBtn'); for (let i = 0; i < 4; i++) await click('#nextBtn'); }
      if (shotDir) await page.screenshot({ path: path.join(shotDir, `${app}-desktop.png`), fullPage: true });
      await page.setViewportSize({ width: 390, height: 844 });
      const geometry = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, width: window.innerWidth }));
      assert.ok(geometry.scroll <= geometry.width + 1, `${app} mobile overflow: ${JSON.stringify(geometry)}`);
      if (shotDir) await page.screenshot({ path: path.join(shotDir, `${app}-mobile.png`), fullPage: true });
      console.log(`${app}: interactions, four quizzes, 390px layout passed`);
    }
    assert.deepEqual(errors, [], 'browser runtime errors');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
});
