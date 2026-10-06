'use strict';
// 책 끝 확인 문제에서 선지를 눌러도 스크롤이 맨 위로 돌아가지 않는지, 책 전권(동화·전래동화·소설)을 열어 본다.
// 선지를 누르면 기록을 저장하고 쪽을 통째로 다시 그리는데, 그때 스크롤 칸이 새로 만들어져 위로 돌아가던 흠을 막는 시험.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const express = require('../game-hub-server/node_modules/express');
const { chromium } = require('../game-hub-server/node_modules/playwright');

const VIEWPORTS = [{ width: 390, height: 844 }, { width: 1280, height: 720 }];

async function main() {
  const root = path.resolve(__dirname, '..'), books = [];
  (function discover(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) discover(file);
      else if (entry.name === 'index.html' && fs.readFileSync(file, 'utf8').includes('/assets/learning-book.js')) books.push('/' + path.relative(root, file).replaceAll('\\', '/'));
    }
  })(path.join(root, 'learning/literacy-numeracy/story-books'));
  assert.ok(books.length > 0);
  const app = express(); app.use(express.static(root));
  const server = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const tested = { scrolled: 0, fits: 0, noQuiz: 0 }, bad = [];
  let next = 0;
  try {
    const context = await browser.newContext();
    await context.route('https://**', route => route.abort());
    // 문제 쪽에는 그림·소리가 필요 없다. 막아야 책마다 빨리 열린다.
    await context.route(/\.(webp|png|jpe?g|gif|mp3|m4a|ogg|wav)(\?.*)?$/, route => route.abort());
    await context.route('**/api/learning-records/context', route => route.fulfill({ json: { mode: 'preview' } }));
    await Promise.all(Array.from({ length: 2 }, async () => {
      const page = await context.newPage(), errors = [];
      page.on('pageerror', error => errors.push(error.message));
      while (next < books.length) {
        const book = books[next++];
        for (const viewport of VIEWPORTS) {
          await page.setViewportSize(viewport);
          await page.goto(`http://127.0.0.1:${server.address().port}${book}`, { waitUntil: 'domcontentloaded', timeout: 90000 });
          await page.waitForFunction(() => window.LearningRecords && !document.getElementById('book').inert, null, { timeout: 90000 });
          const quizAt = await page.evaluate(() => PAGES.findIndex(p => p.kind === 'quiz'));
          if (quizAt < 0) { tested.noQuiz++; continue; }
          // 마지막 문제의 마지막 선지가 들어 있는 스크롤 칸(없으면 쪽 전체)을 맨 아래로 내린다.
          const before = await page.evaluate(i => {
            current = i; paint();
            const choice = [...document.querySelectorAll('.quiz-choice')].pop();
            const scrollable = el => { const o = getComputedStyle(el).overflowY; return /(auto|scroll)/.test(o) && el.scrollHeight > el.clientHeight + 2; };
            let box = choice; while (box && box !== document.body && !scrollable(box)) box = box.parentElement;
            const target = box && box !== document.body ? box : document.scrollingElement;
            target.scrollTop = target.scrollHeight;
            window.__quizBox = box && box !== document.body ? '.' + [...box.classList].join('.') : 'window';
            return { max: target.scrollHeight - target.clientHeight, top: target.scrollTop, box: window.__quizBox };
          }, quizAt);
          if (before.max < 40) { tested.fits++; continue; }
          await page.evaluate(() => [...document.querySelectorAll('.quiz-choice')].pop().click());
          await page.waitForTimeout(350);
          await page.waitForFunction(() => !document.getElementById('book').inert);
          const after = await page.evaluate(() => {
            const el = window.__quizBox === 'window' ? document.scrollingElement : document.querySelector(window.__quizBox);
            return { top: el ? el.scrollTop : null };
          });
          tested.scrolled++;
          if (after.top == null || Math.abs(after.top - before.top) > 4) bad.push(`${book} @${viewport.width}: ${before.box} ${before.top} -> ${after.top}`);
        }
        assert.deepEqual(errors, [], book + ' has no script errors');
      }
      await page.close();
    }));
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
  assert.ok(tested.scrolled > 0, 'no book had a scrolling quiz page — the test proved nothing');
  assert.deepEqual(bad, [], `quiz scroll jumped after answering in ${bad.length} case(s):\n  ` + bad.slice(0, 12).join('\n  '));
  console.log(`PASS ${books.length} books: answering a quiz choice keeps the scroll position (${tested.scrolled} scrolling quiz pages checked; ${tested.fits} fit without scrolling; ${tested.noQuiz} without a quiz).`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
