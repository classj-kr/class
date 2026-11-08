// 도식 확인용: 한 단원의 낱말마다 칸을 하나씩 열어 무대(.stage)를 찍는다.
// node tools/curriculum-vocabulary/shoot-figures.cjs 5-2 수학 1 <저장 폴더>
// 저장 폴더에 <낱말>-<칸>.png 가 생긴다. 끝에 페이지 오류를 찍는다.
const fs = require('fs');
const path = require('path');
const { chromium } = require('../../game-hub-server/node_modules/playwright');
const root = path.resolve(__dirname, '../..');
const [term = '5-2', subject = '수학', unit = '1', out = path.join(root, '..', 'curriculum-shots')] = process.argv.slice(2);
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.webp': 'image/webp' };
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.route('**/*', route => {
    const u = new URL(route.request().url());
    let file = path.join(root, decodeURIComponent(u.pathname));
    if (u.pathname.endsWith('/')) file = path.join(file, 'index.html');
    if (u.hostname !== 'shots.test' || !fs.existsSync(file)) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ contentType: mime[path.extname(file)] || 'application/octet-stream', body: fs.readFileSync(file) });
  });
  await page.goto(`http://shots.test/learning/literacy-numeracy/curriculum-vocabulary/?${new URLSearchParams({ term, subject, unit, preview: '1' })}`);
  await page.evaluate(() => document.fonts.ready);
  const words = await page.locator('.chips button:not(.practice-chip)').allTextContents();
  for (const word of words) {
    await page.locator('.chips button:not(.practice-chip)', { hasText: new RegExp('^' + word + '$') }).click();
    const dots = page.locator('.beats .dot');
    const count = await dots.count();
    if (!count) { console.log('도식 없음:', word); continue; }
    for (let i = 0; i < count; i++) {
      await dots.nth(i).click();
      await page.waitForTimeout(2200);
      await page.locator('.scene').screenshot({ path: path.join(out, `${word}-${i + 1}.png`) });
    }
  }
  console.log('찍음:', words.length, '낱말 →', out, errors.length ? '\n오류: ' + errors.join(' | ') : '');
  await browser.close();
})();
