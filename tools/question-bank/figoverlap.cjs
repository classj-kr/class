// 그림 속 글이 선·호와 겹치거나 글끼리 겹치는 그림을 브라우저에서 찾아낸다(씨앗 여럿). 넘침 검사는 이런 겹침을 못 잡는다.
// 색만 칠한 path 도 선으로 세므로 헛짚음이 있다 — 걸린 꼴은 figshow.cjs 로 그려 눈으로 본다. 사본을 볼 때는 MATH_BANK_DIR 을 준다.
//   UNIT=7-2-4 node tools/question-bank/figoverlap.cjs [씨앗 수] [꼴 이름 앞부분]
const fs = require('fs'), path = require('path'), vm = require('vm');
const { chromium } = require(path.join(__dirname, '../../game-hub-server/node_modules/playwright'));
const dir = (process.env.MATH_BANK_DIR ? path.resolve(process.env.MATH_BANK_DIR) : path.join(__dirname, '../../learning/literacy-numeracy/math-bank')).split(path.sep).join('/'), UNIT = process.env.UNIT;
const c = { console }; c.globalThis = c; vm.createContext(c);
for (const f of ['engine.js', 'geometry.js', 'middle.js'].concat(fs.readdirSync(path.join(dir, 'units')).filter((f) => f.startsWith(UNIT)).sort().map((f) => 'units/' + f))) vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), c, { filename: f });
const B = c.MathBank, unit = B.findUnit(UNIT), count = Number(process.argv[2] || 24), only = process.argv[3] || '';
const blocks = [];
for (const group of unit.groups) for (const type of group.types) for (let n = 0; n < (type.count || 1); n += 1) {
  if (only && !type.id.startsWith(only)) continue;
  for (let k = -1; k < count; k += 1) {
    const key = type.id + (type.count > 1 ? '#' + (n + 1) : ''), seed = k < 0 ? 'bank' : k * 7919 + 13 + n * 101;
    const item = k < 0 ? B.bankOf(unit, group.id, type.level).find((it) => it.key === key) : type.make(new B.Dice(seed), n);
    if (item.figure && /<svg/.test(item.figure)) blocks.push('<div class="fig" data-key="' + key + ' ' + seed + '">' + item.figure + '</div>');
  }
}
const css = fs.readFileSync(path.join(dir, 'styles.css'), 'utf8').replace(/url\("fonts\//g, 'url("file:///' + dir.replace(/\\/g, '/') + '/fonts/');
const html = '<!doctype html><meta charset="utf-8"><style>' + css + ' body::before{display:none} body{margin:0;background:#fff} .fig{width:290px;margin:4px}</style>' + blocks.join('');
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  await page.setContent(html);
  await page.waitForTimeout(400);
  const found = await page.evaluate(() => {
    const out = [];
    for (const fig of document.querySelectorAll('.fig')) for (const svg of fig.querySelectorAll('svg')) {
      const texts = [...svg.querySelectorAll('text')].map((t) => { const b = t.getBBox(); return { x0: b.x + 1.2, y0: b.y + 2.6, x1: b.x + b.width - 1.2, y1: b.y + b.height - 2.6, s: t.textContent }; });
      const pts = [];
      const walk = (x0, y0, x1, y1) => { const L = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.ceil(L / 1.5)); for (let i = 0; i <= n; i += 1) pts.push([x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n]); };
      for (const l of svg.querySelectorAll('line')) walk(l.x1.baseVal.value, l.y1.baseVal.value, l.x2.baseVal.value, l.y2.baseVal.value);
      for (const p of svg.querySelectorAll('polygon')) { const list = [...p.points].map((q) => [q.x, q.y]); list.forEach((q, i) => { const r = list[(i + 1) % list.length]; walk(q[0], q[1], r[0], r[1]); }); }
      for (const p of svg.querySelectorAll('polyline')) { const list = [...p.points].map((q) => [q.x, q.y]); for (let i = 0; i + 1 < list.length; i += 1) walk(list[i][0], list[i][1], list[i + 1][0], list[i + 1][1]); }
      for (const p of svg.querySelectorAll('path')) { const L = p.getTotalLength(); for (let s = 0; s <= L; s += 1.5) { const q = p.getPointAtLength(s); pts.push([q.x, q.y]); } }
      for (const ci of svg.querySelectorAll('circle')) { const r = ci.r.baseVal.value; if (r < 4) continue; for (let a = 0; a < 360; a += 1) pts.push([ci.cx.baseVal.value + r * Math.cos(a * Math.PI / 180), ci.cy.baseVal.value + r * Math.sin(a * Math.PI / 180)]); }
      const hits = [];
      for (const t of texts) { const n = pts.filter(([x, y]) => x > t.x0 && x < t.x1 && y > t.y0 && y < t.y1).length; if (n > 2) hits.push(t.s + '×선' + n); }
      for (let i = 0; i < texts.length; i += 1) for (let j = i + 1; j < texts.length; j += 1) { const a = texts[i], b = texts[j]; if (a.x0 < b.x1 + 5 && b.x0 < a.x1 + 5 && a.y0 < b.y1 && b.y0 < a.y1) hits.push(a.s + '×' + b.s); }
      const r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
      for (const t of svg.querySelectorAll('text')) { const b = t.getBBox(); if (b.x < vb.x - 0.5 || b.y < vb.y - 0.5 || b.x + b.width > vb.x + vb.width + 0.5 || b.y + b.height > vb.y + vb.height + 0.5) hits.push(t.textContent + ' 잘림'); const fs = parseFloat(getComputedStyle(t).fontSize); if (fs * r.width / vb.width < 12) hits.push(t.textContent + ' 글씨 ' + (fs * r.width / vb.width).toFixed(1)); }
      if (r.width / vb.width < 0.97) hits.push('줄어듦 ' + Math.round(vb.width));
      if (hits.length) out.push(fig.dataset.key + ' : ' + hits.join(', '));
    }
    return out;
  });
  const byType = {};
  for (const line of found) { const key = line.split(' ')[0]; (byType[key] = byType[key] || []).push(line); }
  console.log('그림', blocks.length, '개, 겹친 그림', found.length, '개');
  for (const [key, list] of Object.entries(byType)) console.log(String(list.length).padStart(3), key, '|', list.slice(0, 3).map((s) => s.slice(key.length + 1)).join(' || '));
  await browser.close();
})();
