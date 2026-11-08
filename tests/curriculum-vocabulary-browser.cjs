// 교과 단어: 모든 단원의 낱말 목록과 연습 한 판을 실제 브라우저로 끝까지 돌려 본다.
// node tests/curriculum-vocabulary-browser.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const base = '/learning/literacy-numeracy/curriculum-vocabulary/';
const books = require('..' + base + 'words-5-2.js');
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.webp': 'image/webp' };

// 화면에 뜬 문제에서 정답 낱말을 원고로 찾아낸다.
async function answerOf(page, words) {
  const meaning = await page.locator('.prompt.meaning').count();
  const text = (await page.locator('.prompt').textContent()).trim();
  const hit = words.find(word => meaning ? text === '뜻' + word.mean : word.blanks.some(blank => blank.replace('{}', '').trim() === text));
  assert.ok(hit, '정답을 찾지 못함: ' + text);
  return hit.w;
}

(async () => {
  const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' });
  const errors = [];
  let units = 0;
  try {
    for (const width of [1280, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      page.on('pageerror', error => errors.push(error.message));
      await page.route('**/*', route => {
        const uri = new URL(route.request().url());
        const file = path.resolve(root, '.' + decodeURIComponent(uri.pathname) + (uri.pathname.endsWith('/') ? 'index.html' : ''));
        if (uri.hostname !== 'curriculum.test' || !file.startsWith(root + path.sep) || !fs.existsSync(file)) return route.fulfill({ status: 404, body: '' });
        return route.fulfill({ contentType: mime[path.extname(file)] || 'application/octet-stream', body: fs.readFileSync(file) });
      });
      for (const [term, subjects] of Object.entries(books)) for (const [subject, book] of Object.entries(subjects)) for (const unit of book.units) {
        await page.goto('http://curriculum.test' + base + '?' + new URLSearchParams({ term, subject, unit: unit.id }));
        assert.equal(await page.locator('.word-card').count(), unit.words.length, unit.title);
        assert.deepEqual(await page.locator('.word-card h3').allTextContents(), unit.words.map(word => word.w));
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, unit.title + ' 가로 넘침 ' + width);

        await page.locator('.words-view .start').click();
        assert.equal(new URL(page.url()).searchParams.get('mode'), 'practice');
        let first = true, asked = 0;
        while (await page.locator('.question').count()) {
          const answer = await answerOf(page, unit.words);
          const choices = page.locator('.choices button');
          const names = await choices.allTextContents();
          assert.equal(new Set(names).size, names.length, '보기 겹침');
          assert.ok(names.includes(answer));
          if (first) {
            // 첫 문제는 일부러 틀려서 같은 낱말이 다시 나오는지 본다.
            await choices.filter({ hasNotText: answer }).first().click();
            assert.equal(await page.locator('.choices button.wrong').count(), 1);
            first = false;
          }
          await page.locator('.choices button', { hasText: new RegExp('^' + answer + '$') }).click();
          assert.equal(await page.locator('.choices button.right').textContent(), answer);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, unit.title + ' 문제 넘침 ' + width);
          await page.locator('.next').click();
          asked++;
          assert.ok(asked <= unit.words.length + 1, '문제가 끝나지 않음');
        }
        assert.equal(asked, unit.words.length + 1);
        assert.equal(await page.locator('.finish .score').textContent(), `처음에 맞힌 문제 ${unit.words.length - 1} / ${unit.words.length}`);
        assert.equal(await page.locator('.finish .word-card').count(), 1);
        units++;
      }
      await page.close();
    }
    assert.deepEqual(errors, []);
    console.log(`교과 단어: 단원 ${units / 2}개를 두 너비에서 확인`);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
