const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { chromium } = require('../game-hub-server/node_modules/playwright');

const root = path.resolve(__dirname, '..');
const base = '/learning/literacy-numeracy/curriculum-vocabulary/';
const wordLessons = require('..' + base + 'word-lessons.js');
const weather = wordLessons['5-2'].과학['2'];
const output = path.join(root, 'output/curriculum-vocabulary-review');
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.webp': 'image/webp' };

async function screenshot(page, name) {
  fs.mkdirSync(output, { recursive: true });
  const png = await page.locator('#lesson').screenshot();
  execFileSync('python', ['-c', 'from PIL import Image; import io,sys; Image.open(io.BytesIO(sys.stdin.buffer.read())).save(sys.argv[1],"WEBP",lossless=True)', path.join(output, name + '.webp')], { input: png });
}

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
    assert.equal(await page.locator('.word-navigation button').count(), 8);
    assert.equal(await page.locator('.visual-lesson > h2').textContent(), '응결');
    assert.equal(await page.locator('.glossary').count(), 0);
    const client = await page.context().newCDPSession(page);
    await client.send('DOM.enable'); await client.send('CSS.enable');
    const { root: dom } = await client.send('DOM.getDocument');
    const fonts = {};
    for (const selector of ['.visual-lesson > h2', '.detail-part p', '.visual-check h3', '.scene-choices button']) {
      const { nodeId } = await client.send('DOM.querySelector', { nodeId: dom.nodeId, selector });
      fonts[selector] = (await client.send('CSS.getPlatformFontsForNode', { nodeId })).fonts.map(font => font.familyName);
    }
    for (const selector of ['.detail-part p', '.visual-check h3', '.scene-choices button']) assert.ok(fonts[selector].some(name => /KoPub|Batang/.test(name)), selector + ': ' + fonts[selector]);
    assert.ok(fonts['.visual-lesson > h2'].some(name => /Malgun|Gothic/i.test(name)), JSON.stringify(fonts));
    await screenshot(page, 'condensation-desktop');
    let checkedStates = 0;
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const [name, data] of Object.entries(weather)) {
        await page.locator('.word-navigation').getByRole('button', { name, exact: true }).click();
        assert.equal(await page.locator('.visual-lesson > h2').textContent(), name);
        assert.equal(await page.locator('.scene-details').isVisible(), true);
        assert.equal(await page.locator('.scene-details summary').count(), 0);
        assert.equal(await page.locator('.scene-details p').count() >= 4, true);
        for (let i = 0; i < data.states.length; i++) {
          await page.locator('.scene-controls button').nth(i).click();
          assert.equal(await page.locator('.scene-controls button').nth(i).getAttribute('aria-pressed'), 'true');
          assert.ok((await page.locator('.scene figcaption').textContent()).includes(data.states[i][1]));
          const imageChecks = await page.locator('.scene-image img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0));
          assert.ok(imageChecks);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, name + ' overflow at ' + width);
          checkedStates++;
        }
        const wrong = data.check.options.find(option => option !== data.check.answer);
        await page.getByRole('button', { name: wrong, exact: true }).click();
        assert.equal(await page.locator('.visual-feedback').textContent(), data.check.feedback[wrong]);
        await page.getByRole('button', { name: data.check.answer, exact: true }).click();
        assert.equal(await page.locator('.visual-feedback').textContent(), data.check.feedback[data.check.answer]);
      }
      if (width === 390) await screenshot(page, 'wind-mobile');
    }
    const targets = [['5-2', '국어', 'reading', '전자책'], ['5-2', '수학', '2', '대분수'], ['5-2', '사회', '1', '선사 시대'], ['6-2', '국어', '2', '면담']];
    await page.setViewportSize({ width: 1280, height: 960 });
    for (const [term, subject, unit, title] of targets) {
      await page.goto('http://curriculum.test' + base + '?' + new URLSearchParams({ term, subject, unit }));
      assert.equal(await page.locator('.visual-lesson > h2').first().textContent(), title);
      const controls = page.locator('.visual-lesson').first().locator('.scene-controls button');
      for (let i = 0; i < await controls.count(); i++) {
        await controls.nth(i).click();
        assert.equal(await controls.nth(i).getAttribute('aria-pressed'), 'true');
      }
      const text = await page.locator('#lesson').textContent();
      for (const phrase of ['뜻과 쓰임 자세히 보기', '물어볼 한 가지', '다른 곳에서도 찾아보기', '함께 구별하기', '같은 이야기를 무엇으로 읽을까?', '두 책의 이야기는 같아요. 무엇이 바뀌었을까요?']) assert.ok(!text.includes(phrase), phrase);
      if (title === '전자책') {
        assert.ok(text.includes('같은 내용으로 만든 종이책과 전자책은 서로 무엇이 다를까요?'));
        assert.ok(text.includes('종이책은 종이에서, 전자책은 화면에서 읽어요.'));
      }
      if (title === '면담') await screenshot(page, 'interview-desktop');
      if (title === '대분수') await screenshot(page, 'fraction-desktop');
    }
    assert.deepEqual(errors, []);
    assert.deepEqual(missing, []);
    console.log(JSON.stringify({ words: Object.keys(weather).length, checkedStates, fonts, screenshots: output, errors }, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
