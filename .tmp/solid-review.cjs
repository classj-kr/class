require('node:util').inspect.defaultOptions.depth = null;
const { chromium } = require('../game-hub-server/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
  const { createElementaryGeometryMeasurementSet } = await import('../learning/literacy-numeracy/arithmetics/lib/elementary-geometry-measurement.ts');
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  try {
    const page = await browser.newPage({ viewport: { width: 1150, height: 1400 }, deviceScaleFactor: 1 });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://localhost:6180/arithmetic/grade-6-box-measurement', { waitUntil: 'networkidle' });
    const questions = page.locator('.worksheet-stage article');
    const fields = page.locator('.worksheet-stage input');
    const counter = () => page.locator('.counting-progress').innerText();
    assert.equal(await questions.count(), 4);
    assert.match(await counter(), /0\/4문제 정답/);
    const problems = createElementaryGeometryMeasurementSet('solid', 20260823);
    await fields.nth(0).fill(String(problems[0].first));
    await page.getByRole('button', { name: '전체 채점' }).click();
    assert.match(await counter(), /0\/4문제 정답/, 'one correct field is not a completed problem');
    await fields.nth(1).fill(String(problems[0].second));
    await page.getByRole('button', { name: '전체 채점' }).click();
    assert.match(await counter(), /1\/4문제 정답/);
    for (let i = 0; i < problems.length; i++) {
      await fields.nth(i * 2).fill(String(problems[i].first));
      await fields.nth(i * 2 + 1).fill(String(problems[i].second));
    }
    await page.getByRole('button', { name: '전체 채점' }).click();
    assert.match(await counter(), /4\/4문제 정답/);
    assert.equal(await page.locator('.worksheet-stage article.is-correct').count(), 4);
    await fields.nth(0).fill('0');
    assert.match(await counter(), /3\/4문제 정답/);
    await page.getByRole('button', { name: '다시 풀기' }).click();
    assert.match(await counter(), /0\/4문제 정답/);
    const bounds = await page.locator('.worksheet-stage').evaluate(stage => {
      const sheet = stage.querySelector('.a4-sheet').getBoundingClientRect();
      return Array.from(stage.querySelectorAll('article')).every(article => {
        const rect = article.getBoundingClientRect();
        return rect.top >= sheet.top && rect.bottom <= sheet.bottom;
      }) && Array.from(stage.querySelectorAll('.solid-dimension text')).every(text => {
        const a = text.getBoundingClientRect(), b = text.ownerSVGElement.getBoundingClientRect();
        return a.left >= b.left && a.right <= b.right && a.top >= b.top && a.bottom <= b.bottom;
      });
    });
    if (!bounds) console.log(await page.locator('.worksheet-stage').evaluate(stage => ({ sheet: stage.querySelector('.a4-sheet').getBoundingClientRect().toJSON(), rows: [...stage.querySelectorAll('article')].map(el => el.getBoundingClientRect().toJSON()), labels: [...stage.querySelectorAll('.solid-dimension text')].map(el => ({text: el.textContent, box: el.getBoundingClientRect().toJSON(), svg: el.ownerSVGElement.getBoundingClientRect().toJSON()})) })));
    assert.equal(bounds, true, 'all four rows and measurement labels stay within their containers');
    await page.screenshot({ path: '.tmp/solid-measurement-desktop.png', fullPage: true });
    await page.emulateMedia({ media: 'print' });
    await page.evaluate(() => document.documentElement.dataset.printMode = 'both');
    assert.equal(await page.locator('.answer-stage .circle-static-answer:visible').count(), 8);
    assert.equal(await page.locator('.worksheet-stage article:visible').count(), 4);
    assert.deepEqual(await page.locator('.answer-stage .circle-static-answer').allTextContents(), problems.flatMap(p => [String(p.first), String(p.second)]));
    await page.emulateMedia({ media: 'screen' });
    await page.evaluate(() => delete document.documentElement.dataset.printMode);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(150);
    assert.equal(await questions.count(), 4);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.screenshot({ path: '.tmp/solid-measurement-mobile.png', fullPage: true });
    await page.getByRole('button', { name: '새 문제', exact: true }).click();
    assert.equal(await questions.count(), 4);
    assert.match(await counter(), /0\/4문제 정답/);
    assert.ok((await fields.allTextContents()).every(v => !v));
    await page.setViewportSize({ width: 1150, height: 1400 });
    await page.goto('http://localhost:6180/arithmetic/grade-5-polygon-measurement', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.worksheet-stage article').count(), 4);
    assert.match(await counter(), /0\/4문제 정답/);
    assert.deepEqual(errors, []);
    console.log('PASS: 4 problem rows; 0/4 → 1/4 → 4/4 → 3/4 grading; reset; all dimensions inside SVG; print answers; mobile width; fresh set; plane worksheet; no browser errors.');
  } finally { await browser.close(); }
})();