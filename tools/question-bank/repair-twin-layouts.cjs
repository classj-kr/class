'use strict';
// 그림의 수치·선·면은 유지한다. 원래 그림의 자르기 영역은 clipPath로 보존하고 글자만 밖으로 안전하게 배치한다.
const fs = require('node:fs'), path = require('node:path');
const express = require('../../game-hub-server/node_modules/express');
const { chromium } = require('../../game-hub-server/node_modules/playwright');
const { loadBank, dir } = require('./twin-capacity.cjs');
const { createValidator } = require('./twin-validation.cjs');
const T = require('../../learning/literacy-numeracy/math-bank/twins.js');
const reportFile = process.argv.find(arg => arg.startsWith('--report='))?.slice(9) || path.resolve(__dirname, '../../outputs/math-twins/render-validation.json');
(async () => {
  const B = loadBank(), { validate } = createValidator(), reports = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
  const requests = [...new Map(reports.issues.map(row => [row.unit + ':' + row.key + ':' + row.spec.fingerprint, row])).values()];
  const plans = {}, changed = [];
  const app = express(); app.use(express.static(path.resolve(__dirname, '../..')));
  app.get('/_repair', (req, res) => res.send('<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="/learning/literacy-numeracy/math-bank/styles.css"><div class="mb-page"><div id="repair" class="mb-item"></div></div>'));
  const server = await new Promise(resolve => { const server = app.listen(0, '127.0.0.1', () => resolve(server)); });
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } }); await page.goto('http://127.0.0.1:' + server.address().port + '/_repair');
    for (const request of requests) {
      const unit = B.findUnit(request.unit), term = unit.grade + '-' + unit.semester;
      const plan = plans[term] ||= JSON.parse(fs.readFileSync(path.join(dir, 'twins', term + '.json'), 'utf8'));
      const entry = plan.items[unit.id + ':' + request.key], index = entry.variants.findIndex(spec => spec.fingerprint === request.spec.fingerprint);
      if (index < 0) continue;
      const spec = entry.variants[index], group = unit.groups.find(group => group.types.some(type => type.id === request.key.split('#')[0]));
      const original = B.bankOf(unit, group.id, group.types.find(type => type.id === request.key.split('#')[0]).level).find(item => item.key === request.key);
      const item = T.construct(B, unit, group, original, entry, spec, index), render = { ...(spec.render || {}) };
      const fields = { figure: item.figure, text: item.text, ...(item.choice ? Object.fromEntries(item.choice.options.map((value, i) => ['option' + i, value])) : {}) };
      for (const [field, value] of Object.entries(fields)) {
        if (!value || !/<svg/.test(value)) continue;
        await page.locator('#repair').evaluate((node, value) => { node.innerHTML = value; }, value); await page.evaluate(() => document.fonts.ready);
        const result = await page.evaluate(({ id }) => {
          const host = document.getElementById('repair'); let changed = false;
          const svgs = [...host.querySelectorAll('svg:not(.mb-inline)')].filter(svg => !svg.parentElement.closest('svg'));
          const boxOf = (text, inverse) => {
            const b = text.getBBox(), matrix = inverse.multiply(text.getCTM());
            const points = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].map(([x, y]) => new DOMPoint(x, y).matrixTransform(matrix));
            return { x0: Math.min(...points.map(p => p.x)), y0: Math.min(...points.map(p => p.y)), x1: Math.max(...points.map(p => p.x)), y1: Math.max(...points.map(p => p.y)), matrix };
          };
          const hit = (a, b) => {
            const w = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0), h = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
            return w > 0 && h > 0 && w * h > Math.min((a.x1 - a.x0) * (a.y1 - a.y0), (b.x1 - b.x0) * (b.y1 - b.y0)) * 0.2;
          };
          for (let si = 0; si < svgs.length; si++) {
            const svg = svgs[si], vb = svg.viewBox.baseVal, inverse = svg.getCTM()?.inverse();
            if (!inverse || !vb.width || !vb.height) continue;
            const bounds = { x: vb.x, y: vb.y, width: vb.width, height: vb.height }, textNodes = [...svg.querySelectorAll('text')].filter(text => text.textContent.trim());
            const boxes = textNodes.map(text => boxOf(text, inverse));
            if (!boxes.some((b, i) => b.x0 < vb.x - 1 || b.y0 < vb.y - 1 || b.x1 > vb.x + vb.width + 1 || b.y1 > vb.y + vb.height + 1 || boxes.slice(0, i).some(other => hit(b, other)))) continue;
            changed = true;
            const ns = 'http://www.w3.org/2000/svg', make = name => document.createElementNS(ns, name), placed = [], labels = [], leaders = [];
            textNodes.forEach((text, i) => {
              const b = boxes[i], clone = text.cloneNode(true), style = getComputedStyle(text);
              for (const property of ['font-family', 'font-size', 'font-style', 'font-weight', 'letter-spacing', 'text-anchor', 'dominant-baseline', 'fill', 'stroke', 'stroke-width', 'paint-order']) clone.style.setProperty(property, style.getPropertyValue(property));
              clone.style.removeProperty('transform');
              let dx = 0, dy = 0;
              if (placed.some(other => hit(b, other))) {
                search: for (let radius = 4; radius <= 160; radius += 4) for (const [x, y] of [[0, -radius], [0, radius], [radius, 0], [-radius, 0], [radius, -radius], [-radius, radius], [radius, radius], [-radius, -radius]]) {
                  const candidate = { x0: b.x0 + x, y0: b.y0 + y, x1: b.x1 + x, y1: b.y1 + y };
                  if (!placed.some(other => hit(candidate, other))) { dx = x; dy = y; break search; }
                }
              }
              const matrix = b.matrix; clone.setAttribute('transform', `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e + dx} ${matrix.f + dy})`);
              if (dx || dy) {
                const line = make('line'), x = (b.x0 + b.x1) / 2, y = (b.y0 + b.y1) / 2;
                for (const [name, value] of Object.entries({ x1: x, y1: y, x2: x + dx, y2: y + dy, stroke: '#64748b', 'stroke-width': '0.7', 'stroke-dasharray': '2 2' })) line.setAttribute(name, value);
                leaders.push(line);
              }
              labels.push(clone); placed.push({ x0: b.x0 + dx, y0: b.y0 + dy, x1: b.x1 + dx, y1: b.y1 + dy });
            });
            const body = svg.cloneNode(true); body.querySelectorAll('text').forEach(text => text.remove());
            const clipId = 'mb-twin-clip-' + id + '-' + si, defs = make('defs'), clip = make('clipPath'), rect = make('rect'); clip.id = clipId; clip.setAttribute('clipPathUnits', 'userSpaceOnUse');
            for (const [name, value] of Object.entries(bounds)) rect.setAttribute(name, value);
            clip.append(rect); defs.append(clip); const graphics = make('g'); graphics.setAttribute('clip-path', 'url(#' + clipId + ')');
            while (body.firstChild) graphics.append(body.firstChild);
            svg.replaceChildren(defs, graphics, ...leaders, ...labels);
            const x0 = Math.min(bounds.x, ...placed.map(b => b.x0)) - 4, y0 = Math.min(bounds.y, ...placed.map(b => b.y0)) - 4;
            const x1 = Math.max(bounds.x + bounds.width, ...placed.map(b => b.x1)) + 4, y1 = Math.max(bounds.y + bounds.height, ...placed.map(b => b.y1)) + 4;
            svg.setAttribute('viewBox', [x0, y0, x1 - x0, y1 - y0].join(' ')); svg.removeAttribute('height'); svg.classList.add('mb-geo');
          }
          return changed ? host.innerHTML : null;
        }, { id: T.fingerprint(unit.id + ':' + request.key + ':' + index + ':' + field) });
        if (result !== null) {
          if (field.startsWith('option')) { render.options ||= item.choice.options.slice(); render.options[Number(field.slice(6))] = result; }
          else render[field] = result;
        }
      }
      if (Object.keys(render).length) {
        spec.render = render;
        const repaired = T.construct(B, unit, group, original, entry, spec, index);
        validate(repaired, { unit, group, level: original.level, seed: spec.seed || spec.mode });
        spec.fingerprint = T.fingerprint(repaired); changed.push({ unit: unit.id, key: request.key, twin: index + 1 });
      }
    }
    for (const [term, plan] of Object.entries(plans)) fs.writeFileSync(path.join(dir, 'twins', term + '.json'), JSON.stringify(plan));
    fs.writeFileSync(path.resolve(__dirname, '../../outputs/math-twins/layout-repairs.json'), JSON.stringify(changed, null, 2));
    console.log(JSON.stringify({ repaired: changed.length }));
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
