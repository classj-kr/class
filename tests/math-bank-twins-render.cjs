'use strict';
// 실제 쌍둥이 전부를 두 너비에서 배치한다. 그림 글자 잘림·겹침과 화면 넘침을 찾는다.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const express = require('../game-hub-server/node_modules/express');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { loadBank, dir } = require('../tools/question-bank/twin-capacity.cjs');
const T = require('../learning/literacy-numeracy/math-bank/twins.js');
const B = loadBank(), out = path.resolve(__dirname, '../outputs/math-twins');
const app = express(); app.use(express.static(path.resolve(__dirname, '..')));
app.get('/_twin-audit', (req, res) => res.send('<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="/learning/literacy-numeracy/math-bank/styles.css"><div class="mb-page"><ol id="audit" class="mb-items is-review"></ol></div>'));
function html(item) {
  const strip = value => String(value || '').replace(/<[^>]*>/g, '');
  return '<li class="mb-item"><p class="mb-text">' + item.text + '</p>' + (item.figure ? '<div class="mb-figure">' + item.figure + '</div>' : '') + (item.choice
    ? '<div class="mb-choices' + (item.choice.options.some(value => strip(value).length > 12) ? ' is-long' : '') + '">' + item.choice.options.map(value => '<button class="mb-choice">' + value + '</button>').join('') + '</div>'
    : item.template ? '<span class="mb-tpl">' + item.template.replace(/\{(\d+)\}/g, (_, at) => '<label class="mb-field is-slot">' + (item.inputs[at].signed ? '<button class="mb-sign">+</button>' : '') + (item.inputs[at].rel ? '<select class="mb-rel"><option>□</option></select>' : '<input type="text">') + '</label>') + '</span>' : '') + '</li>';
}
(async () => {
  const server = await new Promise(resolve => { const server = app.listen(0, '127.0.0.1', () => resolve(server)); });
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const page = await browser.newPage(), issues = [], baselines = {}, summary = { originals: 0, twins: 0, layouts: 0, baselineIssues: 0 };
  try {
    await page.goto('http://127.0.0.1:' + server.address().port + '/_twin-audit');
    const selectedUnits = process.argv.find(arg => arg.startsWith('--units='))?.slice(8).split(',');
    for (const unit of B.units().filter(unit => !selectedUnits || selectedUnits.includes(unit.id))) {
      const plan = JSON.parse(fs.readFileSync(path.join(dir, 'twins', unit.grade + '-' + unit.semester + '.json'), 'utf8')), rows = [];
      for (const group of unit.groups) for (const level of B.LEVELS) for (const original of B.bankOf(unit, group.id, level)) {
        const entry = plan.items[unit.id + ':' + original.key];
        rows.push({ unit: unit.id, key: original.key, base: true, html: html(original) }); summary.originals++;
        entry.variants.forEach((spec, i) => { rows.push({ unit: unit.id, key: original.key, spec, html: html(T.construct(B, unit, group, original, entry, spec, i)) }); summary.twins++; });
      }
      for (const width of [360, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        for (let from = 0; from < rows.length; from += 64) {
          const batch = rows.slice(from, from + 64);
          await page.locator('#audit').evaluate((node, html) => { node.innerHTML = html; }, batch.map(row => row.html).join(''));
          await page.evaluate(() => document.fonts.ready);
          const measurements = await page.evaluate(() => [...document.querySelectorAll('.mb-item')].map(card => {
            const box = card.getBoundingClientRect(); let clipped = 0, overlap = 0, invalid = 0;
            const overflow = [...card.querySelectorAll('.mb-figure, .mb-expr, .mb-choice, .mb-tpl, svg:not(.mb-inline), table')].some(node => { const rect = node.getBoundingClientRect(); return rect.right > innerWidth + 1 || rect.left < -1; });
            for (const svg of card.querySelectorAll('svg:not(.mb-inline)')) {
              const vb = svg.viewBox.baseVal, rect = svg.getBoundingClientRect();
              if (!vb.width || !vb.height || !rect.width || !rect.height) { invalid++; continue; }
              const inverse = svg.getCTM()?.inverse(), texts = [];
              for (const text of svg.querySelectorAll('text')) {
                if (!text.textContent.trim() || !inverse || !text.getCTM()) continue;
                const b = text.getBBox(), matrix = inverse.multiply(text.getCTM());
                const p = new DOMPoint(b.x, b.y).matrixTransform(matrix), q = new DOMPoint(b.x + b.width, b.y + b.height).matrixTransform(matrix);
                const t = { x0: Math.min(p.x, q.x), y0: Math.min(p.y, q.y), x1: Math.max(p.x, q.x), y1: Math.max(p.y, q.y) };
                if (t.x0 < vb.x - 1.5 || t.y0 < vb.y - 1.5 || t.x1 > vb.x + vb.width + 1.5 || t.y1 > vb.y + vb.height + 1.5) clipped++;
                texts.push(t);
              }
              for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
                const a = texts[i], b = texts[j], w = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0), h = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
                const smaller = Math.min((a.x1 - a.x0) * (a.y1 - a.y0), (b.x1 - b.x0) * (b.y1 - b.y0));
                if (w > 0 && h > 0 && smaller > 0 && w * h / smaller > 0.3) overlap++;
              }
            }
            return { overflow, clipped, overlap, invalid };
          }));
          measurements.forEach((measurement, i) => {
            const row = batch[i], id = row.unit + ':' + row.key + ':' + width; summary.layouts++;
            if (row.base) { baselines[id] = measurement; if (measurement.overflow || measurement.clipped || measurement.overlap || measurement.invalid) summary.baselineIssues++; }
            else {
              const base = baselines[id];
              if (measurement.overflow || measurement.invalid || measurement.clipped || measurement.overlap) issues.push({ unit: row.unit, key: row.key, width, spec: row.spec, measurement, base });
            }
          });
        }
      }
      console.log(unit.id + ': ' + summary.layouts + ' layouts, ' + issues.length + ' issues');
    }
    fs.mkdirSync(out, { recursive: true }); fs.writeFileSync(path.join(out, selectedUnits ? 'render-validation-sample.json' : 'render-validation.json'), JSON.stringify({ ...summary, issues }, null, 2));
    console.log(JSON.stringify({ ...summary, issues: issues.length }));
    assert.equal(issues.length, 0, '쌍둥이의 그림 잘림·겹침 또는 화면 넘침');
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
