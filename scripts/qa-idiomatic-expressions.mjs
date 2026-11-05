import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const { chromium } = require('../game-hub-server/node_modules/playwright');
const bank = require('../learning/literacy-numeracy/idiomatic-expressions/idiomatic-expressions-data.js');
const output = path.join(root, 'outputs/idiom-audit-2026-11-05/browser');
fs.mkdirSync(output, { recursive: true });
const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.webp': 'image/webp', '.ogg': 'audio/ogg', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/learning-records/context') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ mode: 'preview' }));
    return;
  }
  let target = path.resolve(root, '.' + decodeURIComponent(url.pathname));
  if (!target.startsWith(root)) { res.writeHead(403); res.end(); return; }
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
  if (!fs.existsSync(target)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream' });
  fs.createReadStream(target).pipe(res);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const counts = { studyCards: 0, decodedImages: 0, redrawnImages: 0, questions: 0, wrongAnswerChecks: 0, completedLessons: 0 };
const viewports = [];
async function screenshot(name) {
  const result = spawnSync('python', ['-c', 'from PIL import Image; import io,sys; Image.open(io.BytesIO(sys.stdin.buffer.read())).save(sys.argv[1], "WEBP", lossless=True)', path.join(output, name + '.webp')], { input: await page.screenshot({ fullPage: true }), maxBuffer: 20 * 1024 * 1024 });
  assert.equal(result.status, 0, result.stderr?.toString());
}
async function checkLayout() {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), 'horizontal overflow');
  const image = await page.locator('#illustration').boundingBox();
  assert.ok(image.width > 0 && image.height > 0);
  assert.equal(await page.locator('#illustration').evaluate(el => getComputedStyle(el).objectFit), 'contain');
  assert.ok((await page.locator('#next').boundingBox()).height >= 48);
}
try {
  await page.goto(`http://127.0.0.1:${server.address().port}/learning/literacy-numeracy/idiomatic-expressions/`);
  await page.locator('.lesson-item').last().waitFor();
  assert.equal(await page.locator('.lesson-item').count(), 11);
  for (let lesson = 0; lesson < 11; lesson++) {
    await page.locator('.lesson-item').nth(lesson).click();
    for (const item of bank.filter(entry => entry.lesson === lesson)) {
      await page.waitForFunction(expression => document.querySelector('#expression').textContent === expression, item.expression);
      await page.locator('#illustration').evaluate(image => image.decode());
      assert.equal(await page.locator('#illustration').isVisible(), true);
      assert.equal(await page.locator('#meaning').textContent(), item.meaning);
      assert.equal(await page.locator('#example').textContent(), `예: ${item.example}`);
      const image = await page.locator('#illustration').evaluate(el => ({ width: el.naturalWidth, height: el.naturalHeight, src: el.currentSrc }));
      assert.ok(image.width > 0 && image.height > 0);
      counts.decodedImages++;
      if (item.illustrationVersion) {
        assert.deepEqual([image.width, image.height], [1024, 1024]);
        assert.ok(image.src.endsWith('?v=' + item.illustrationVersion));
        counts.redrawnImages++;
      }
      if (item.expression === '가면을 벗다') {
        for (const viewport of [{ width: 1365, height: 900 }, { width: 1024, height: 768 }, { width: 768, height: 1024 }, { width: 390, height: 844 }]) {
          await page.setViewportSize(viewport);
          await checkLayout();
          await screenshot(`mask-${viewport.width}`);
          viewports.push(viewport);
        }
        await page.setViewportSize({ width: 1365, height: 900 });
      }
      if (item.expression === '귀가 따갑다') await screenshot('ear-study');
      counts.studyCards++;
      await page.locator('#next').click();
    }
    await page.locator('#quizTitle').waitFor({ state: 'visible' });
    for (let index = 0; index < 10; index++) {
      await page.waitForFunction(expected => document.querySelector('#quizProgress').textContent === expected, `${index + 1} / 10`);
      const prompt = await page.locator('#question').textContent();
      const item = bank.find(entry => entry.question === prompt);
      assert.ok(item, prompt);
      assert.equal(item.lesson, lesson);
      const choices = await page.locator('#choices button').allTextContents();
      assert.deepEqual(choices.slice().sort(), [item.expression, ...item.distractors].sort());
      assert.equal(await page.locator('#nextQuestion').isDisabled(), true);
      await page.locator('#choices button').filter({ hasText: new RegExp('^' + item.distractors[0] + '$') }).click();
      await page.waitForFunction(() => document.querySelector('#feedback').textContent === '다시 생각하고 다른 답을 골라 보세요.');
      assert.equal(await page.locator('#choices .wrong').count(), 1);
      assert.equal(await page.locator('#nextQuestion').isDisabled(), true);
      counts.wrongAnswerChecks++;
      await page.locator('#choices button').filter({ hasText: new RegExp('^' + item.expression + '$') }).click();
      await page.waitForFunction(expected => document.querySelector('#feedback').textContent === expected, `정답! ${item.meaning}`);
      assert.equal(await page.locator('#choices .correct').textContent(), item.expression);
      assert.equal(await page.locator('#nextQuestion').isEnabled(), true);
      if (item.expression === '귀가 따갑다') await screenshot('ear-quiz');
      counts.questions++;
      await page.locator('#nextQuestion').click();
    }
    await page.getByRole('dialog').waitFor();
    assert.ok((await page.getByRole('dialog').textContent()).includes('10/10'));
    await page.getByRole('dialog').getByRole('button', { name: '닫기', exact: true }).click();
    assert.ok((await page.locator('.lesson-item').nth(lesson).textContent()).includes('완료'));
    counts.completedLessons++;
    console.log(`Verified lesson ${lesson + 1}/11`);
  }
  assert.equal(counts.studyCards, 110);
  assert.equal(counts.questions, 110);
  assert.equal(counts.redrawnImages, 45);
  assert.deepEqual(errors, []);
  const result = { mode: 'local Chrome with real app and LearningRecords in preview mode; no production database writes', counts, viewports, pageErrors: errors };
  fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result));
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
