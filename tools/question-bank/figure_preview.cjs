// 그림 도구를 손보면서 그림만 따로 그려 본다(서버 없이).
//   node tools/question-bank/figure_preview.cjs <그림을 돌려주는 js 파일> <나올 png>
// js 파일은 `module.exports = (B) => [['이름', 'html'], …]` 꼴이다. 앱의 styles.css로 휴대폰 너비(360px)에 그려 찍는다.
const fs = require('fs'), path = require('path'), vm = require('vm');
const { chromium } = require('../../game-hub-server/node_modules/playwright');
const dir = process.env.MATH_BANK_DIR || path.join(__dirname, '../../learning/literacy-numeracy/math-bank');
const c = { console }; c.globalThis = c; vm.createContext(c);
for (const f of ['engine.js', 'geometry.js']) vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), c, { filename: f });
const figures = require(path.resolve(process.argv[2]))(c.MathBank);
const css = fs.readFileSync(path.join(dir, 'styles.css'), 'utf8');
const html = '<!doctype html><meta charset="utf-8"><style>' + css + ' body{margin:0;padding:12px;background:#f1f5f9} .card{background:#fff;border-radius:14px;padding:14px;margin-bottom:12px;width:300px} h4{margin:0 0 8px;font:600 13px sans-serif;color:#1d4ed8}</style>'
  + '<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:flex-start">' + figures.map(([name, body]) => '<div class="card"><h4>' + name + '</h4><div class="mb-figure">' + body + '</div></div>').join('') + '</div>';
(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
  const page = await browser.newPage({ viewport: { width: Number(process.env.WIDTH || 1020), height: 800 } });
  await page.setContent(html);
  await page.screenshot({ path: process.argv[3], fullPage: true });
  const small = await page.evaluate(() => [...document.querySelectorAll('.mb-figure svg')].filter((el) => el.getBoundingClientRect().width > 300).length);
  console.log('그림', figures.length, '개, 300px 넘는 그림', small, '개 →', process.argv[3]);
  await browser.close();
})();
