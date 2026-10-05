'use strict';
const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { harness } = require('./learning-records-integration.cjs');
async function main() {
  const h = await harness(), browser = await chromium.launch({ channel: 'msedge', headless: true });
  const errors = [];
  try {
    const context = await browser.newContext({ extraHTTPHeaders: { 'x-test-user': '1' }, viewport: { width: 1400, height: 1000 } });
    await context.route('https://**', r => r.abort());
    const page = await context.newPage(); page.on('response', async r => { if(r.url().includes('/api/learning-records') && r.status() !== 200) console.error(r.status(), await r.text()); }); page.on('pageerror', e => { errors.push(e.message); console.error(e.message); });
    const saved = async action => {
      const response = page.waitForResponse(r => /\/api\/learning-records\/sessions\/[^/]+\/changes$/.test(r.url()) && r.status() === 200);
      await action();
      return (await (await response).json()).session;
    };
    for (const book of ['world-tales/jack-beanstalk', 'world-novels/monte-cristo', 'korea-tales/heungbujeon', 'world-tales/red-hood', 'world-novels/anne-green-gables', 'world-novels/parables-tales']) {
      console.log('Checking book:', book);
      await saved(() => page.goto(h.base + '/learning/literacy-numeracy/story-books/' + book + '/'));
      await page.waitForFunction(() => !document.getElementById('book').inert);
      assert.equal(await page.locator('learning-records .strip').count(), 0, 'book has no record toolbar');
      assert.equal(await page.getByRole('button', { name: '이번 읽기 마치기', exact: true }).count(), 0);
      for (const viewport of [{ width: 1400, height: 1000 }, { width: 390, height: 844 }]) {
        await page.setViewportSize(viewport);
        const layout = await page.evaluate(() => {
          const measure = () => {
            const { x, y, width, height } = document.getElementById('book').getBoundingClientRect();
            return { x, y, width, height, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight };
          };
          const host = document.querySelector('learning-records'), before = measure();
          host.remove(); const original = measure(); document.body.append(host);
          return { before, original };
        });
        assert.deepEqual(layout.before, layout.original, book + ' keeps the original book layout at ' + viewport.width);
        assert.ok(Math.abs(layout.before.x + layout.before.width / 2 - viewport.width / 2) < 2, book + ' stays centered');
        if (book.includes('jack-beanstalk') || book.includes('monte-cristo')) {
          await page.screenshot({ path: path.resolve('output/learning-records-review', book.split('/')[1] + (viewport.width === 390 ? '-mobile.png' : '-desktop.png')) });
        }
      }
      await page.setViewportSize({ width: 1400, height: 1000 });
      await page.evaluate(() => goTo(PAGES.findIndex(p => p.kind === 'chapter' || p.kind === 'spread')));
      await page.waitForTimeout(550);
      await page.waitForFunction(() => !document.getElementById('book').inert);
      const marker = await page.evaluate(() => ({ kind: PAGES[current].kind, chapter: PAGES[current].chIndex ?? null, art: PAGES[current].beat?.art || null }));
      await saved(() => page.reload());
      assert.deepEqual(await page.evaluate(() => ({ kind: PAGES[current].kind, chapter: PAGES[current].chIndex ?? null, art: PAGES[current].beat?.art || null })), marker, book + ' resumes reading position');
      await page.evaluate(() => goTo(PAGES.findIndex(p => p.kind === 'quiz'))); await page.waitForTimeout(550);
      const choices = await page.locator('.quiz-item').first().locator('.quiz-choice').allTextContents();
      await page.locator('.quiz-choice').first().click(); await page.waitForFunction(() => !document.getElementById('book').inert);
      await saved(() => page.reload()); await page.locator('.quiz-item').first().waitFor();
      assert.deepEqual(await page.locator('.quiz-item').first().locator('.quiz-choice').allTextContents(), choices);
      assert.ok(await page.locator('.quiz-choice.correct, .quiz-choice.incorrect').count());
      assert.deepEqual(await page.evaluate(() => Object.keys(localStorage)), []);
      const completed = await saved(() => page.evaluate(() => goTo(PAGES.length - 1)));
      assert.equal(completed.status, 'completed', 'last page automatically completes the reading');
      assert.equal(await page.locator('learning-records dialog[open]').count(), 0, 'completion does not interrupt reading');
      await page.waitForFunction(() => !animating);
      const reviewed = await saved(() => page.evaluate(() => goTo(PAGES.findIndex(p => p.kind === 'quiz'))));
      assert.equal(reviewed.status, 'completed');
      assert.equal(reviewed.completedAt, completed.completedAt, 'reviewing keeps the original completion time');
      assert.ok(await page.locator('.quiz-choice.correct, .quiz-choice.incorrect').count(), 'answers remain available after completion');
      await page.waitForFunction(() => !animating);
      if (book.includes('monte-cristo')) {
        let offline = true;
        await page.route('**/api/learning-records/sessions/*/changes', route => offline ? route.abort() : route.continue());
        await page.evaluate(() => goTo(PAGES.findIndex(p => p.kind === 'chapter')));
        await page.getByRole('heading', { name: '기록 연결을 확인해 주세요' }).waitFor();
        offline = false;
        await saved(() => page.getByRole('button', { name: '다시 시도', exact: true }).click());
        await page.locator('learning-records dialog[open]').waitFor({ state: 'detached' });
        await page.unroute('**/api/learning-records/sessions/*/changes');
      }
    }
    assert.deepEqual(errors, []);
    console.log('PASS six books: original desktop/mobile layout, no toolbar, position/quiz/order restore, automatic completion, error recovery, no browser storage.');
  } finally { await browser.close(); await h.close(); }
}
main().catch(e => { console.error(e); process.exitCode = 1; });
