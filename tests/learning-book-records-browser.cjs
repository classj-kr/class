'use strict';
const assert = require('node:assert/strict');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { harness } = require('./learning-records-integration.cjs');
async function main() {
  const h = await harness(), browser = await chromium.launch({ channel: 'msedge', headless: true });
  const errors = [];
  try {
    const context = await browser.newContext({ extraHTTPHeaders: { 'x-test-user': '1' }, viewport: { width: 1400, height: 1000 } });
    await context.route('https://**', r => r.abort());
    const page = await context.newPage(); page.on('response', async r => { if(r.url().includes('/api/learning-records') && r.status() !== 200) console.error(r.status(), await r.text()); }); page.on('pageerror', e => { errors.push(e.message); console.error(e.message); });
    for (const book of ['korea-tales/heungbujeon', 'world-tales/red-hood', 'world-novels/anne-green-gables', 'world-novels/parables-tales']) {
      console.log('Checking book:', book);
      await page.goto(h.base + '/learning/literacy-numeracy/story-books/' + book + '/');
      await page.locator('learning-records .status').filter({ hasText: '저장 완료' }).waitFor().catch(async e => {console.error(await page.locator('learning-records').innerText()); await page.screenshot({path:'output/learning-records-review/book-failure.png'});throw e;});
      await page.evaluate(() => goTo(PAGES.findIndex(p => p.kind === 'chapter' || p.kind === 'spread')));
      await page.waitForTimeout(550);
      await page.waitForFunction(() => !document.getElementById('book').inert);
      const marker = await page.evaluate(() => ({ kind: PAGES[current].kind, chapter: PAGES[current].chIndex ?? null, art: PAGES[current].beat?.art || null }));
      await page.reload(); await page.locator('learning-records .status').filter({ hasText: '저장 완료' }).waitFor();
      assert.deepEqual(await page.evaluate(() => ({ kind: PAGES[current].kind, chapter: PAGES[current].chIndex ?? null, art: PAGES[current].beat?.art || null })), marker, book + ' resumes reading position');
      await page.evaluate(() => goTo(PAGES.findIndex(p => p.kind === 'quiz'))); await page.waitForTimeout(550);
      const choices = await page.locator('.quiz-item').first().locator('.quiz-choice').allTextContents();
      await page.locator('.quiz-choice').first().click(); await page.waitForFunction(() => !document.getElementById('book').inert);
      await page.reload(); await page.locator('.quiz-item').first().waitFor();
      assert.deepEqual(await page.locator('.quiz-item').first().locator('.quiz-choice').allTextContents(), choices);
      assert.ok(await page.locator('.quiz-choice.correct, .quiz-choice.incorrect').count());
      assert.deepEqual(await page.evaluate(() => Object.keys(localStorage)), []);
      await page.getByRole('button', { name: '이번 읽기 마치기', exact: true }).click();
      await page.getByRole('heading', { name: '학습 결과', exact: true }).waitFor();
    }
    assert.deepEqual(errors, []);
    console.log('PASS four book templates: position/quiz/order restore, server completion, no browser storage.');
  } finally { await browser.close(); await h.close(); }
}
main().catch(e => { console.error(e); process.exitCode = 1; });
