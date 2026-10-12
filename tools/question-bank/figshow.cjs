// 꼴 몇 개의 그림을 씨앗을 달리해 한 장에 그려 본다(휴대폰 문항 칸 너비 290px, 사이트 글꼴은 입히지 않음).
//   UNIT=7-2-4 [SEEDS=5] node tools/question-bank/figshow.cjs <나올 png> <꼴 이름 앞부분> [...]      꼴 이름 뒤에 #2 처럼 차례를 붙일 수 있다. 사본을 볼 때는 MATH_BANK_DIR 을 준다.
// 나온 png 는 보고 나서 지운다(저장소의 그림은 webp 로만 둔다).
const fs = require('fs'), path = require('path'), vm = require('vm');
const { chromium } = require(path.join(__dirname, '../../game-hub-server/node_modules/playwright'));
const dir = (process.env.MATH_BANK_DIR ? path.resolve(process.env.MATH_BANK_DIR) : path.join(__dirname, '../../learning/literacy-numeracy/math-bank')).split(path.sep).join('/'), UNIT = process.env.UNIT, SEEDS = Number(process.env.SEEDS || 5);
const c = { console }; c.globalThis = c; vm.createContext(c);
for (const f of ['engine.js', 'geometry.js', 'middle.js'].concat(fs.readdirSync(path.join(dir, 'units')).filter((f) => f.startsWith(UNIT)).sort().map((f) => 'units/' + f))) vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), c, { filename: f });
const B = c.MathBank, unit = B.findUnit(UNIT), out = process.argv[2], want = process.argv.slice(3);
const blocks = [];
for (const group of unit.groups) for (const type of group.types) for (let n = 0; n < (type.count || 1); n += 1) {
  const key = type.id + (type.count > 1 ? '#' + (n + 1) : '');
  if (!want.some((w) => (w.includes('#') ? key === w : type.id.startsWith(w)))) continue;
  for (let k = -1; k < SEEDS; k += 1) {
    const seed = k < 0 ? 'bank' : k * 7919 + 13 + n * 101;
    const item = k < 0 ? B.bankOf(unit, group.id, type.level).find((it) => it.key === key) : type.make(new B.Dice(seed), n);
    if (item && item.figure) blocks.push('<div class="fig"><b>' + key + ' ' + seed + '</b>' + item.figure + '</div>');
  }
}
const css = fs.readFileSync(path.join(dir, 'styles.css'), 'utf8').replace(/url\("fonts\//g, 'url("file:///' + dir + '/fonts/');
const html = '<!doctype html><meta charset="utf-8"><style>' + css + ' html{background:#fff} body::before{display:none} body{margin:0;background:#fff;display:flex;flex-wrap:wrap;align-items:flex-start} .fig{width:290px;margin:4px;border:1px solid #ddd} .fig b{display:block;font:11px sans-serif;color:#666}</style>' + blocks.join('');
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1210, height: 900 } });
  await page.setContent(html);
  await page.waitForTimeout(400);
  await page.screenshot({ path: out, fullPage: true });
  console.log('그림', blocks.length);
  await browser.close();
})();
