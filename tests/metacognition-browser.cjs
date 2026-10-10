const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const express = require('../game-hub-server/node_modules/express');
const root = path.resolve(__dirname, '..');
const area = '/learning/literacy-numeracy/metacognition/';
const output = path.join(root, 'outputs', 'metacognition-review-20260930');
const sets = [
  { page: 'index.html', items: require('..' + area + 'items.js').METACOG_ITEMS, version: 'metacog-v3' },
  ...Array.from({ length: 7 }, (_, i) => {
    const grade = i + 3;
    return { page: 'grade' + grade + '.html', items: require('..' + area + 'items-grade' + grade + '.js')['METACOG_ITEMS_G' + grade], version: 'metacog-g' + grade + '-v2' };
  })
];

async function verify({ mode = 'all' } = {}) {
  fs.mkdirSync(output, { recursive: true });
  const app = express();
  app.use('/api', (_req, res) => res.status(401).json({ error: 'LOGIN_REQUIRED' }));
  app.use(express.static(root));
  const server = await new Promise(resolve => { const instance = app.listen(0, '127.0.0.1', () => resolve(instance)); });
  const base = 'http://127.0.0.1:' + server.address().port + area;
  let browser;
  const errors = [];
  try {
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
    async function exercise(set, scenario, mobile = false, exportFile = false) {
      const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1024, height: 768 }, acceptDownloads: true });
      try {
        const page = await context.newPage();
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(base + set.page);
        if (set.page === 'index.html') {
          assert.equal(await page.locator('.grade-picker-links a').count(), 7);
          assert.equal(await page.locator('#startBtn').isVisible(), false, 'grade choice comes before common quiz');
          await page.screenshot({ path: path.join(output, mobile ? 'entry-mobile.png' : 'entry.png'), fullPage: true });
          await page.locator('#commonSet summary').click();
        }
        await page.locator('#startBtn').click();
        const seen = [];
        const answers = [];
        const orders = {};
        for (let display = 0; display < set.items.length; display++) {
          const prompt = await page.locator('#qPrompt').textContent();
          const item = set.items.find(row => row.prompt === prompt);
          assert.ok(item, 'visible prompt belongs to this level');
          assert.ok(!seen.includes(item.id), 'no repeated question');
          seen.push(item.id);
          const texts = await page.locator('.choice-btn').evaluateAll(nodes => nodes.map(node => node.lastChild.textContent));
          assert.deepEqual(texts.slice().sort(), item.choices.slice().sort());
          orders[item.id] = texts;
          const unknown = scenario === 'unknown' || scenario === 'with-unknown' && display % 3 === 0;
          const correct = scenario === 'correct' || (scenario === 'mixed' && display % 2 === 0) || (scenario === 'guess' && display % 4 === 0) || (scenario === 'with-unknown' && display % 3 === 1);
          const choice = unknown ? -1 : correct ? item.answer : (item.answer + 1) % 4;
          const confidence = unknown ? null : scenario === 'guess' ? 25 : (scenario === 'mixed' && correct ? 50 : 100);
          if (unknown) {
            await page.locator('#unknownBtn').click();
            assert.equal(await page.locator('#confidenceBlock').isVisible(), false);
            assert.equal(await page.locator('#nextBtn').isEnabled(), true);
            if (display === 0) {
              await page.locator('.choice-btn').first().click();
              assert.equal(await page.locator('#confidenceBlock').isVisible(), true);
              assert.equal(await page.locator('#nextBtn').isDisabled(), true, 'a real answer requires its own confidence');
              await page.locator('.conf-btn').first().click();
              await page.locator('#unknownBtn').click();
              assert.equal(await page.locator('#confidenceBlock').isVisible(), false);
              await page.screenshot({ path: path.join(output, 'unknown-quiz.png'), fullPage: true });
            }
          } else {
            await page.locator('.choice-btn').nth(texts.indexOf(item.choices[choice])).click();
            await page.locator('.conf-btn').nth([25, 50, 75, 100].indexOf(confidence)).click();
          }
          if (scenario === 'mixed' && display === 0) {
            // Answer changes must ask for confidence again.
            const other = (choice + 1) % 4;
            await page.locator('.choice-btn').nth(texts.indexOf(item.choices[other])).click();
            assert.equal(await page.locator('#nextBtn').isDisabled(), true);
            await page.locator('.choice-btn').nth(texts.indexOf(item.choices[choice])).click();
            await page.locator('.conf-btn').nth(1).click();
          }
          answers.push({ id: item.id, choice, confidence, correct, unknown });
          if (display === 2 || display === set.items.length - 1) {
            // Preserve order and answers on both partial and fully-answered-but-unsubmitted reloads.
            await page.reload();
            await page.locator('#startBtn').click();
            assert.equal(await page.locator('#qPrompt').textContent(), prompt);
            assert.deepEqual(await page.locator('.choice-btn').evaluateAll(nodes => nodes.map(node => node.lastChild.textContent)), texts);
            assert.equal(await page.locator('#nextBtn').isEnabled(), true);
          }
          await page.locator('#nextBtn').click();
        }
        await page.locator('#reportView').waitFor({ state: 'visible' });
        await page.waitForFunction(() => document.getElementById('saveStatus').dataset.state === 'local');
        const expected = Math.round(answers.filter(row => row.correct).length / answers.length * 100) + '%';
        assert.equal(await page.locator('.stat-value').first().textContent(), expected);
        assert.equal(await page.locator('#profileName').textContent(), '이번 풀이 돌아보기');
        const report = await page.locator('#reportView').innerText();
        assert.doesNotMatch(report, /브레이크 없는|흐릿한 형|가려내지 못합니다|자기 점검이 잘 작동|과소평가|다섯 번/);
        if (scenario === 'correct') {
          assert.match(report, /모두 맞혔어요/);
          assert.match(report, /해당 문항 없음/);
        }
        if (scenario === 'wrong') assert.match(report, /맞힌 문항이 없어요/);
        if (scenario === 'guess') assert.match(report, /우연히 맞혔을 수도/);
        const unknownCount = answers.filter(row => row.unknown).length;
        assert.equal(await page.locator('.stat-value').nth(2).textContent(), unknownCount + '개');
        assert.doesNotMatch(report, /NaN|undefined|null%/);
        if (scenario === 'unknown') {
          assert.match(report, /모든 문항에 ‘모르겠어요’/);
          assert.equal(await page.locator('.stat-value').nth(1).textContent(), '0개');
        }
        assert.deepEqual(await page.locator('.review-item').evaluateAll(nodes => nodes.map(node => node.dataset.itemId)), seen);
        await page.locator('.review-item summary').first().click();
        const first = answers[0];
        const item = set.items.find(row => row.id === first.id);
        const review = await page.locator('.review-item').first().textContent();
        assert.ok(review.includes(item.prompt));
        assert.ok(review.includes('내 답: ' + (first.unknown ? '모르겠어요' : item.choices[first.choice])));
        assert.ok(review.includes('정답: ' + item.choices[item.answer]));
        assert.ok(review.includes(item.explain));
        const hce = answers.filter(row => !row.correct && row.confidence >= 75).length;
        await page.locator('[data-filter="confident-wrong"]').click();
        assert.equal(await page.locator('.review-item:visible').count(), hce);
        assert.equal(await page.locator('.review-empty').isVisible(), hce === 0);
        await page.locator('[data-filter="all"]').click();
        await page.locator('[data-filter="unknown"]').click();
        assert.equal(await page.locator('.review-item:visible').count(), unknownCount);
        await page.locator('[data-filter="wrong"]').click();
        assert.equal(await page.locator('.review-item:visible').count(), answers.filter(row => !row.unknown && !row.correct).length);
        await page.locator('[data-filter="all"]').click();
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
        assert.equal(overflow, false, 'no horizontal overflow');
        if (set.page === 'grade3.html' || exportFile) {
          await page.screenshot({ path: path.join(output, (mobile ? 'mobile-' : '') + scenario + '-report.png'), fullPage: true });
        }
        if (exportFile) {
          await page.locator('[data-filter="confident-wrong"]').click();
          await page.locator('#toggleTableBtn').click();
          async function download(selector) {
            const [file] = await Promise.all([page.waitForEvent('download'), page.locator(selector).click()]);
            const dest = path.join(output, file.suggestedFilename());
            await file.saveAs(dest); return dest;
          }
          const htmlPath = await download('#downloadBtn');
          const jsonPath = await download('#rawBtn');
          const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
          assert.equal(raw.itemSetVersion, set.version);
          assert.equal(raw.summary.profileKey, 'reflection-v1');
          assert.equal(raw.summary.unknownCount, unknownCount);
          assert.equal(raw.summary.answeredCount, set.items.length - unknownCount);
          for (const row of answers) {
            const saved = raw.responses.find(entry => entry.id === row.id);
            assert.equal(saved.choice, row.choice);
            assert.equal(saved.confidence, row.confidence);
          }
          const html = fs.readFileSync(htmlPath, 'utf8');
          assert.doesNotMatch(html, /id="reviewFilters"|id="toggleTableBtn"|id="retryBtn"/);
          const viewer = await context.newPage();
          viewer.on('pageerror', error => errors.push(error.message));
          await viewer.goto(pathToFileURL(htmlPath).href);
          assert.equal(await viewer.locator('.review-item[open]:visible').count(), set.items.length, 'export includes all questions even when filtered/collapsed');
          assert.equal(await viewer.locator('.chart-holder svg').count(), scenario === 'unknown' ? 1 : 2);
          await viewer.emulateMedia({ media: 'print' });
          const faint = await viewer.evaluate(() => [...document.querySelectorAll('body *')].filter(node => {
            if (node.children.length || !node.textContent.trim() || !node.getClientRects().length) return false;
            const color = node.namespaceURI.includes('svg') ? getComputedStyle(node).fill : getComputedStyle(node).color;
            const rgb = color.match(/[\d.]+/g)?.map(Number);
            return rgb?.length >= 3 && (rgb[3] ?? 1) > 0 && (rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722) / 255 > .75;
          }).map(node => node.textContent.slice(0, 30)));
          assert.deepEqual(faint, [], 'print text stays readable');
          await viewer.screenshot({ path: path.join(output, 'export-print.png'), fullPage: true });
        }
        console.log('PASS browser ' + set.page + ' / ' + scenario + (mobile ? ' / mobile' : '') + (exportFile ? ' / export + print' : ''));
        return orders;
      } finally { await context.close(); }
    }
    if (mode !== 'export') {
      for (let i = 0; i < sets.length; i += 2) await Promise.all(sets.slice(i, i + 2).map(set => exercise(set, 'correct')));
      await exercise(sets[1], 'wrong', true);
      await exercise(sets[7], 'guess', true);
    }
    if (mode !== 'shuffle') {
      await exercise(sets[0], 'mixed', true, true);
      await exercise(sets[1], 'unknown', true, true);
      await exercise(sets[7], 'with-unknown', true, true);
    }
    assert.deepEqual(errors, []);
    console.log('PASS no browser exceptions');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}
module.exports = { verify };
if (require.main === module) verify().catch(error => { console.error(error); process.exitCode = 1; });
