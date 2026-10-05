'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const express = require('../game-hub-server/node_modules/express');
const { chromium } = require('../game-hub-server/node_modules/playwright');

async function main() {
  const root = path.resolve(__dirname, '..'), books = [];
  function discover(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) discover(file);
      else if (entry.name === 'index.html' && fs.readFileSync(file, 'utf8').includes('/assets/learning-book.js')) books.push('/' + path.relative(root, file).replaceAll('\\', '/'));
    }
  }
  discover(path.join(root, 'learning/literacy-numeracy/story-books'));
  assert.ok(books.length > 0);
  const app = express(); app.use(express.static(root));
  const server = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  let next = 0;
  try {
    const context = await browser.newContext();
    await context.route('https://**', route => route.abort());
    await context.route('**/api/learning-records/context', route => route.fulfill({ json: { mode: 'preview' } }));
    await Promise.all(Array.from({ length: 4 }, async () => {
      const page = await context.newPage(), errors = [];
      page.on('pageerror', error => errors.push(error.message));
      while (next < books.length) {
        const book = books[next++];
        await page.setViewportSize({ width: 1400, height: 1000 });
        await page.goto(`http://127.0.0.1:${server.address().port}${book}`);
        await page.waitForFunction(() => window.LearningRecords && !document.getElementById('book').inert);
        assert.equal(await page.locator('learning-records .strip, learning-records button').count(), 0, book + ' has no record controls');
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
          assert.deepEqual(layout.before, layout.original, book + ' preserves its layout at ' + viewport.width);
        }
        assert.deepEqual(errors, [], book + ' has no script errors');
      }
      await page.close();
    }));
    console.log(`PASS ${books.length} books: no record toolbar, original desktop/mobile geometry and scroll dimensions, no script errors.`);
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
