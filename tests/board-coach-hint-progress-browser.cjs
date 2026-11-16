'use strict';
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), http = require('node:http');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  fs.readFile(file, (error, data) => {
    if (error) return res.writeHead(404).end();
    res.setHeader('Content-Type', ({ '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.ogg': 'audio/ogg', '.webp': 'image/webp' })[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const reports = [];
  try {
    for (const game of ['janggi', 'chess', 'omok', 'reversi', 'baduk']) {
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(() => {
        window.hintEvents = [];
        const Original = window.Worker;
        window.Worker = class extends Original {
          postMessage(data) {
            if (data.kind === 'hint') {
              window.hintState = data.state;
              const start = performance.now();
              this.addEventListener('message', ({ data: reply }) => hintEvents.push({ ...reply, ms: performance.now() - start }));
            }
            return super.postMessage(data);
          }
        };
      });
      const file = game === 'baduk' ? 'baduk.html' : 'coach.html';
      await page.goto(`http://127.0.0.1:${server.address().port}/learning/games/board-coach/${file}?game=${game}`);
      await page.locator('#startLearning').click();
      await page.locator('#hint').click();
      await page.waitForFunction(() => hintEvents.some(event => event.partial), { timeout: 10000 });
      await page.waitForFunction(() => document.querySelector('#reasonLabel').textContent.includes('임시 힌트'));
      await page.waitForFunction(() => hintEvents.some(event => !event.partial), { timeout: 30000 });
      const report = await page.evaluate(game => {
        const final = hintEvents.find(event => !event.partial);
        const answer = final.result;
        const expected = game === 'chess' ? (answer.claim ? '무승부 선언' : ChessCoachAI.label(answer.move))
          : game === 'janggi' ? JanggiCoachAI.label(answer.move)
          : game === 'baduk' ? BadukCoachRules.coord(answer.index, hintState.size)
          : BoardCoachRules.coord(answer.index, hintState.size);
        return { game, expected, displayed: document.querySelector('#moveLabel').textContent,
          label: document.querySelector('#reasonLabel').textContent, depth: answer.depth,
          firstMs: Math.round(hintEvents[0].ms), finalMs: Math.round(final.ms), stages: hintEvents.length };
      }, game);
      assert.equal(report.label, '힌트', game + ': final analysis replaces preview without a second click');
      assert.equal(report.displayed, report.expected, game + ': displayed move is the completed search result');
      assert.ok(report.depth >= 2, game + ': final result is deeper than preview');
      assert.deepEqual(errors, []);
      reports.push(report);
      console.log(JSON.stringify(report));
      await page.close();
    }
    fs.mkdirSync(path.join(root, 'outputs/qa/hint-audit'), { recursive: true });
    fs.writeFileSync(path.join(root, 'outputs/qa/hint-audit/progressive-browser.json'), JSON.stringify(reports, null, 2));
  } finally {
    await browser.close(); server.closeAllConnections(); await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
