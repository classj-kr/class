'use strict';
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), { spawnSync } = require('node:child_process');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { harness } = require('./learning-records-integration.cjs');
const { loadBank } = require('../tools/question-bank/twin-capacity.cjs');
const B = loadBank(), plan = [];
for (const unit of B.units()) for (const group of unit.groups) {
  if (!group.types.some(t => t.id.startsWith('ic-'))) continue;
  for (let round = 1; round <= B.roundCount(unit, group.id, '실력'); round++) {
    const items = B.makeRound(unit, group.id, '실력', round).filter(i => i.typeId.startsWith('ic-'));
    if (items.length) plan.push({ unit: unit.id, group: group.id, round, items: JSON.parse(JSON.stringify(items)) });
  }
}
const out = path.resolve(__dirname, '../outputs/math-bank-iscream');
const webp = 'import sys,io;from PIL import Image;im=Image.open(io.BytesIO(sys.stdin.buffer.read())).convert("RGBA");im.save(sys.argv[1],format="WEBP",lossless=True);saved=Image.open(sys.argv[1]).convert("RGBA");assert im.size==saved.size and im.tobytes()==saved.tobytes()';
(async () => {
  const h = await harness(); let browser;
  const errors = [], shots = new Set(); let rendered = 0, solved = 0;
  fs.mkdirSync(out, { recursive: true });
  try {
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
    for (const width of [360, 1100]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, extraHTTPHeaders: { 'x-test-user': width === 360 ? '1' : '2' } });
      await context.route('https://**', route => route.abort());
      const page = await context.newPage(); page.on('pageerror', e => errors.push(e.message));
      for (const p of plan) {
        const record = `${p.unit}:${p.group}:실력:${p.round}`;
        await page.goto(h.base + '/learning/literacy-numeracy/math-bank/?record=' + encodeURIComponent(record));
        await page.waitForFunction(() => document.querySelector('.mb-item') && !document.getElementById('main').inert);
        for (const item of p.items) {
          const card = page.locator(`.mb-item[data-key="${item.key}"]`); await card.scrollIntoViewIfNeeded();
          assert.equal(await card.locator('.mb-choice').count(), 0);
          assert.equal(await card.locator('.mb-field input').count(), item.inputs.length);
          const layout = await card.evaluate(card => {
            const bad = [...card.querySelectorAll('*')].filter(e => { const r = e.getBoundingClientRect(); return r.right > innerWidth + 1 || r.left < -1; });
            const clipped = [];
            for (const svg of card.querySelectorAll('svg:not(.mb-inline)')) {
              const vb = svg.viewBox.baseVal;
              for (const t of svg.querySelectorAll('text')) { const r = t.getBBox(); if (r.x < vb.x - 1 || r.y < vb.y - 1 || r.x + r.width > vb.x + vb.width + 1 || r.y + r.height > vb.y + vb.height + 1) clipped.push(t.textContent); }
            }
            return { bad: bad.map(e => e.tagName + '.' + (e.className.baseVal || e.className)).slice(0, 4), clipped };
          });
          assert.deepEqual(layout, { bad: [], clipped: [] }, `${width}px ${p.unit} ${item.key}`);
          if (width === 360 && ['ic-nested-parts', 'ic-circle-meeting', 'ic-fire-rope', 'ic-pipe-turns', 'ic-parcel-two-rules', 'ic-survival-weight', 'ic-fuel-saving'].includes(item.key)) {
            const result = spawnSync('python', ['-c', webp, path.join(out, item.key + '.webp')], { input: await card.screenshot() });
            assert.equal(result.status, 0, String(result.stderr)); shots.add(item.key);
          }
          rendered++;
          // 원문제의 실제 입력·채점을 확인한다. 각 폭에서 별도 학생 계정으로 푼다.
          for (let i = 0; i < item.inputs.length; i++) await card.locator('.mb-field input').nth(i).fill(String(item.inputs[i].answer));
          await card.locator('.mb-primary').click();
          await page.waitForFunction(() => !document.getElementById('main').inert);
          assert.equal(await card.evaluate(c => c.classList.contains('is-right')), true, item.key);
          solved++;
          const twins = await page.evaluate(async ({ unitId, key }) => {
            const B = window.MathBank, u = B.findUnit(unitId), g = B.findGroup(u, 'hard'), original = B.bankOf(u, 'hard', '실력').find(i => i.key === key);
            try { return (await window.MathBankTwins.forItem(B, u, g, original)).map(i => ({ key: i.key, inputs: i.inputs?.length || 0, choice: Boolean(i.choice) })); }
            catch (error) { throw new Error(unitId + ':' + key + ': ' + error.message); }
          }, { unitId: p.unit, key: item.key });
          assert.equal(twins.length, 3); assert.ok(twins.every(t => t.inputs > 0 && !t.choice));
        }
      }
      await context.close();
    }
    assert.equal(rendered, 74); assert.equal(solved, 74); assert.equal(shots.size, 7); assert.deepEqual(errors, []);
    console.log(JSON.stringify({ ok: true, rendered, solved, twinChecks: rendered * 3, screenshots: shots.size }));
  } finally { await browser?.close(); await h.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
