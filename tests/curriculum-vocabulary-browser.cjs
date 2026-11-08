// 교과 단어: 모든 단원의 낱말 목록과 연습 한 판을 실제 브라우저로 끝까지 돌려 본다.
// node tests/curriculum-vocabulary-browser.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const base = '/learning/literacy-numeracy/curriculum-vocabulary/';
// 앱에 내보낸 학기(terms.js)마다 낱말 파일을 읽는다.
const termsSrc = fs.readFileSync(path.join(root, base, 'terms.js'), 'utf8');
const sandbox = { window: {} };
require('node:vm').runInNewContext(termsSrc, sandbox);
const manifest = sandbox.window.CurriculumTerms;
for (const key of Object.keys(manifest)) require('..' + base + 'words-' + key + '.js');
const books = globalThis.CurriculumWords;
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.webp': 'image/webp' };

// 화면에 뜬 문제에서 정답(보기에 적힌 글)을 원고로 찾아낸다.
async function answerOf(page, words) {
  const text = (await page.locator('.prompt').textContent()).trim();
  if (await page.locator('.prompt.sense').count()) {
    // '이 문장에서 ○○의 뜻은?': 문장이 이 단원 예문이면 이 단원 뜻, 다른 뜻 예문이면 그 뜻
    for (const word of words) for (const row of [{ mean: word.mean, use: word.use }, ...(word.senses || [])]) if (row.use === text) return row.mean;
    assert.fail('뜻 문제의 문장을 찾지 못함: ' + text);
  }
  if (await page.locator('.prompt.rel').count()) {
    const word = words.find(row => row.w === text);
    const key = (await page.locator('.question h3').textContent()).includes('반대') ? 'ant' : 'syn';
    const names = await page.locator('.choices button').allTextContents();
    const hit = names.filter(name => word.rel[key].some(row => row.w === name));
    assert.equal(hit.length, 1, '관계어 정답이 하나가 아님: ' + text);
    return hit[0];
  }
  const meaning = await page.locator('.prompt.meaning').count();
  const hit = words.find(word => meaning ? text === '뜻' + word.mean : word.blanks.some(blank => blank.replace('{}', '').trim() === text));
  assert.ok(hit, '정답을 찾지 못함: ' + text);
  return hit.w;
}
const clickChoice = (page, label, right) => page.evaluate(([label, right]) => {
  const all = [...document.querySelectorAll('.choices button')];
  const target = all.find(node => right ? node.textContent === label : node.textContent !== label && !node.disabled);
  target.click();
}, [label, right]);

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
        await page.locator('.chips button').first().waitFor();
        assert.deepEqual(await page.locator('.chips button:not(.practice-chip)').allTextContents(), unit.words.map(word => word.w), unit.title);
        assert.equal(await page.locator('.word-title h3').textContent(), unit.words[0].w);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, unit.title + ' 가로 넘침 ' + width);

        await page.locator('.chips button:not(.practice-chip)').last().click();
        assert.equal(await page.locator('.word-title h3').textContent(), unit.words.at(-1).w);
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
            await clickChoice(page, answer, false);
            assert.equal(await page.locator('.choices button.wrong').count(), 1);
            first = false;
          }
          await clickChoice(page, answer, true);
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
