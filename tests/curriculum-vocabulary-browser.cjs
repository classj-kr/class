const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const base = '/learning/literacy-numeracy/curriculum-vocabulary/';
const lessons = require('..' + base + 'word-lessons.js');
const books = require('..' + base + 'word-bank.js');
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.woff2': 'font/woff2' };

(async () => {
  const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 960 } });
    const errors = [], missing = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', async route => {
      const uri = new URL(route.request().url());
      const file = path.resolve(root, '.' + decodeURIComponent(uri.pathname) + (uri.pathname.endsWith('/') ? 'index.html' : ''));
      if (uri.hostname !== 'curriculum.test' || !file.startsWith(root + path.sep) || !fs.existsSync(file)) {
        missing.push(uri.pathname);
        return route.fulfill({ status: 404, body: '' });
      }
      return route.fulfill({ contentType: mime[path.extname(file)] || 'application/octet-stream', body: fs.readFileSync(file) });
    });
    await page.goto('http://curriculum.test' + base + '?term=5-2&subject=과학&unit=2&word=응결');
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.visual-lesson > h2').textContent(), '응결');
    const client = await page.context().newCDPSession(page);
    await client.send('DOM.enable'); await client.send('CSS.enable');
    const { root: dom } = await client.send('DOM.getDocument');
    const fonts = {};
    for (const selector of ['.visual-lesson > h2', '.word-navigation button', '.detail-part p', '.visual-check h3', '.scene-choices button']) {
      const { nodeId } = await client.send('DOM.querySelector', { nodeId: dom.nodeId, selector });
      fonts[selector] = (await client.send('CSS.getPlatformFontsForNode', { nodeId })).fonts.map(font => font.familyName);
    }
    for (const selector of ['.detail-part p', '.visual-check h3', '.scene-choices button']) assert.ok(fonts[selector].some(name => /KoPub|Batang/.test(name)), selector + ': ' + fonts[selector]);
    for (const selector of ['.visual-lesson > h2', '.word-navigation button']) assert.ok(fonts[selector].some(name => /Malgun|Gothic/i.test(name)), selector + ': ' + fonts[selector]);
    let checkedWords = 0, checkedUnits = 0;
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const [term, subjects] of Object.entries(lessons)) for (const [subject, units] of Object.entries(subjects)) for (const [unit, words] of Object.entries(units)) {
        const expected = books[term][subject].units.find(row => row.id === unit).words.map(row => row[0]);
        assert.deepEqual(Object.keys(words).sort(), expected.sort(), 'New content must cover every word in its unit.');
        await page.goto('http://curriculum.test' + base + '?' + new URLSearchParams({ term, subject, unit }));
        assert.equal(await page.locator('.word-navigation button').count(), expected.length);
        for (const [word, data] of Object.entries(words)) {
          await page.locator('.word-navigation').getByRole('button', { name: word, exact: true }).click();
          assert.equal(await page.locator('.visual-lesson > h2').textContent(), word);
          assert.equal(new URL(page.url()).searchParams.get('word'), word);
          assert.equal(await page.locator('.glossary, .scene-image, .scene-details summary').count(), 0);
          assert.equal(await page.locator('.scene-details').isVisible(), true);
          assert.ok(await page.locator('.scene-details p').count() >= 4, word);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, word + ' overflow at ' + width);
          const wrong = data.check.options.find(option => option !== data.check.answer);
          await page.locator('.scene-choices').getByRole('button', { name: wrong, exact: true }).click();
          assert.equal(await page.locator('.visual-feedback').textContent(), data.check.feedback[wrong]);
          await page.locator('.scene-choices').getByRole('button', { name: data.check.answer, exact: true }).click();
          assert.equal(await page.locator('.visual-feedback').textContent(), data.check.feedback[data.check.answer]);
          checkedWords++;
        }
        await page.locator('.word-paging button').first().click();
        assert.equal(await page.locator('.word-navigation button[aria-pressed="true"]').count(), 1);
        checkedUnits++;
      }
    }
    const body = fs.readFileSync(path.join(root, base, 'visual-lessons.js'), 'utf8') + fs.readFileSync(path.join(root, base, 'app.js'), 'utf8');
    for (const phrase of ['뜻과 쓰임 자세히 보기', '물어볼 한 가지', '다른 곳에서도 찾아보기', '함께 구별하기', '같은 이야기를 무엇으로 읽을까?', '두 책의 이야기는 같아요. 무엇이 바뀌었을까요?']) assert.ok(!body.includes(phrase), phrase);
    assert.deepEqual(errors, []);
    assert.deepEqual(missing, []);
    console.log(JSON.stringify({ wordChecks: checkedWords, unitChecks: checkedUnits, fonts, errors }, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
