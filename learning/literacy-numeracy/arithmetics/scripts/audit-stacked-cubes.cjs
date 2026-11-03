const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('../../../../game-hub-server/node_modules/playwright');
const sharp = require('sharp');

const base = process.env.ARITHMETIC_AUDIT_URL || 'http://127.0.0.1:6180';
const output = path.resolve('tmp/stacked-cubes-audit');
const group = 'arithmetic/grade-6-stacked-cubes/page';

async function screenshot(page, name) {
  const buffer = await page.screenshot({ fullPage: true });
  const original = await sharp(buffer).metadata();
  const file = path.join(output, `${name}.webp`);
  await sharp(buffer).webp({ lossless: true }).toFile(file);
  const converted = await sharp(file).metadata();
  assert.deepEqual([converted.format, converted.width, converted.height, converted.hasAlpha], ['webp', original.width, original.height, original.hasAlpha]);
  await sharp(file).stats();
}

async function checkLayout(page) {
  const clipped = await page.locator('.worksheet-stage .stack-problem-wrap').evaluateAll(cards => cards.flatMap((card, index) => {
    const bounds = card.getBoundingClientRect();
    return [...card.querySelectorAll('svg, input, .stack-view-grids, p')].filter(element => {
      const box = element.getBoundingClientRect();
      return box.left < bounds.left - 1 || box.right > bounds.right + 1 || box.bottom > bounds.bottom + 1;
    }).map(element => `${index + 1}: ${element.tagName}`);
  }));
  assert.deepEqual(clipped, []);
}

async function fillAnswers(page, problems) {
  const cards = page.locator('.worksheet-stage .stack-problem');
  for (let i = 0; i < problems.length; i += 1) {
    const problem = problems[i], card = cards.nth(i);
    if (problem.kind !== 'three-view') {
      await card.locator('input').fill(String(problem.total));
    } else {
      const grids = card.locator('.stack-view-grid');
      for (const [viewIndex, field] of ['top', 'front', 'side'].entries()) {
        const buttons = grids.nth(viewIndex).locator('button');
        for (const [index, filled] of problem.views[field].flat().entries()) {
          if ((await buttons.nth(index).getAttribute('aria-pressed') === 'true') !== filled) {
            await buttons.nth(index).press('Space');
            await page.waitForFunction(({ i, viewIndex, index, filled }) => {
              const grid = document.querySelectorAll('.worksheet-stage .stack-problem')[i].querySelectorAll('.stack-view-grid')[viewIndex];
              return grid.querySelectorAll('button')[index].getAttribute('aria-pressed') === String(filled);
            }, { i, viewIndex, index, filled });
          }
        }
        assert.deepEqual(await buttons.evaluateAll(items => items.map(button => button.getAttribute('aria-pressed') === 'true')), problem.views[field].flat(), `${i + 1}: ${field}`);
      }
    }
  }
  await page.getByRole('button', { name: '전체 채점', exact: true }).click();
  assert.match(await page.locator('.counting-progress').innerText(), /^10\/10/);
}

async function main() {
  const { createStackedCubesProblemSet, computeViews } = await import('../lib/stacked-cubes-workouts.ts');
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  try {
    for (const legacy of [false, true]) {
      const set = createStackedCubesProblemSet(20260807);
      const saved = {};
      if (legacy) {
        for (const index of [0, 2, 6]) {
          const heights = [[1, 3, 0], [3, 3, 0], [0, 0, 0]];
          set.problems[index] = { ...set.problems[index], heights, total: 10, views: computeViews(heights, 3) };
        }
        const flat = [[1, 1, 1], [1, 1, 0], [1, 0, 0]];
        const oldShape = { heights: flat, total: 6, views: computeViews(flat, 3) };
        set.problems[3] = { ...set.problems[3], ...oldShape }; // Answer already entered.
        const savedSet = structuredClone(set);
        savedSet.problems[4] = { ...savedSet.problems[4], ...oldShape }; // Untouched: upgrade on restore.
        saved[`${group}:questionSet`] = savedSet;
        saved[`${group}:counts`] = { 'stacked-cubes-2': '10', 'stacked-cubes-3': '6' };
        saved[`${group}:results`] = { 'stacked-cubes-2': true };
      }
      const page = await browser.newPage({ viewport: { width: 1280, height: 1250 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('dialog', dialog => dialog.accept());
      // Exercise the real record restore hooks without writing classroom records.
      await page.addInitScript(saved => {
        window.stackAuditSaves = [];
        window.LearningRecords = { create: () => ({
          start: async ({ checkpoint }) => ({ checkpoint: { values: { ...checkpoint.values, ...saved }, submitted: [] } }),
          save: async data => { window.stackAuditSaves.push(data); },
          addAction: () => document.createElement('button'),
          showResult: async () => {},
        }) };
      }, saved);
      await page.goto(`${base}/arithmetic/grade-6-stacked-cubes`, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => !document.querySelector('.stack-page')?.closest('[inert]'));
      assert.equal(await page.locator('.worksheet-stage .stack-problem').count(), 10);
      assert.equal(await page.locator('.worksheet-stage .stacked-cube-face-ground').count(), 90);
      assert.equal(await page.locator('.worksheet-stage [data-height-map]').count(), legacy ? 3 : 0);
      if (legacy) {
        assert.equal(await page.getByRole('textbox', { name: '3번 답', exact: true }).inputValue(), '10');
        assert.equal(await page.getByRole('textbox', { name: '4번 답', exact: true }).inputValue(), '6');
        assert.equal(await page.locator('.answer-stage .stack-count-static-answer').nth(2).textContent(), String(set.problems[4].total));
        assert.match(await page.locator('.counting-progress').innerText(), /^1\/10/);
        const diagrams = page.locator('.worksheet-stage [data-height-map]');
        for (let i = 0; i < 3; i += 1) assert.deepEqual(await diagrams.nth(i).locator('.stacked-cubes-map-number').allTextContents(), ['1', '3', '0', '3', '3', '0', '0', '0', '0']);
      }
      await checkLayout(page);
      await screenshot(page, legacy ? 'restored-desktop' : 'new-desktop');
      await fillAnswers(page, set.problems);
      await page.getByRole('textbox', { name: '3번 답', exact: true }).fill('99');
      await page.getByRole('button', { name: '전체 채점', exact: true }).click();
      assert.match(await page.locator('.counting-progress').innerText(), /^9\/10/);
      assert.deepEqual(await page.locator('.answer-stage .stack-count-static-answer').allTextContents(), set.problems.slice(2).map(problem => String(problem.total)));
      await page.emulateMedia({ media: 'print' });
      await page.evaluate(() => { document.documentElement.dataset.printMode = 'both'; });
      assert.equal(await page.locator('.answer-stage').isVisible(), true);
      assert.equal(await page.locator('.answer-stage [data-height-map]').count(), legacy ? 3 : 0);
      await checkLayout(page);
      await screenshot(page, legacy ? 'restored-print' : 'new-print');
      await page.emulateMedia({ media: 'screen' });
      await page.setViewportSize({ width: 390, height: 844 });
      await checkLayout(page);
      await screenshot(page, legacy ? 'restored-mobile' : 'new-mobile');
      await page.evaluate(() => { Date.now = () => 123456; Math.random = () => 0; });
      await page.getByRole('button', { name: '새 문제', exact: true }).click();
      assert.equal(await page.locator('.worksheet-stage [data-height-map]').count(), 0);
      assert.match(await page.locator('.counting-progress').innerText(), /^0\/10/);
      await fillAnswers(page, createStackedCubesProblemSet(123456).problems);
      assert.deepEqual(errors, []);
      console.log(`${legacy ? 'restored' : 'new'} worksheet: visible information, saved answers, grading, new set, desktop, mobile and print PASS`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
