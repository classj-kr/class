'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { GAME_PAGE_ALIASES } = require('../game-hub-server/home-content-paths');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.resolve(root, file), 'utf8');
const aliases = new Map(GAME_PAGE_ALIASES.map(([a, b]) => [a.slice(1), b.slice(1) + '.html']));
const pages = [...new Set([...read('index.html').matchAll(/href="(learning\/games\/[^"?#]+)/g)].map(m => aliases.get(m[1]) || (m[1].endsWith('/') ? m[1] + 'index.html' : m[1] + '.html')))];
const fixtures = pages.map(file => ({ file }));
for (const game of ['janggi', 'chess', 'omok', 'connect6', 'reversi']) {
  fixtures.push({ file: 'learning/games/board-coach/coach.html', body: `original-coach ${game}-surface ${game === 'janggi' ? 'janggi-coach' : ''}`, game });
}
fixtures.push({ file: 'learning/games/board-coach/baduk.html', body: 'baduk-learning', game: 'baduk' });
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const selected = process.env.CHAT_TEST_COACH_ONLY ? fixtures.filter(fixture => fixture.game) : fixtures;
    for (const fixture of selected) {
      console.log('Checking', fixture.game || fixture.file);
      if (!fs.existsSync(path.resolve(root, fixture.file))) throw Error('Missing fixture: ' + fixture.file);
      const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
      page.setDefaultTimeout(10000);
      await page.route('**/*', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><head></head><body></body></html>' }));
      await page.goto('http://chat-test.local/');
      const html = read(fixture.file);
      const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]);
      for (const m of html.matchAll(/<link[^>]+href="([^"]+\.css[^\"]*)"[^>]*>/g)) {
        const href = m[1].split('?')[0];
        if (/^https?:/.test(href)) continue;
        const file = href.startsWith('/') ? path.join(root, href) : path.resolve(root, path.dirname(fixture.file), href);
        if (fs.existsSync(file)) styles.push(fs.readFileSync(file, 'utf8'));
      }
      styles.push(read('assets/sound/music-control.css'));
      await page.setContent('<div id="classSiteSettings"><div id="unifiedSettingsPanel" class="unified-audio-panel"></div></div>');
      await page.evaluate(body => {
        document.body.className = body;
        document.documentElement.dataset.coachState = 'ready';
      }, fixture.body || html.match(/<body[^>]*class="([^"]*)"/)?.[1] || '');
      for (const content of styles) await page.addStyleTag({ content });
      await page.evaluate(() => {
        window.chatPreference = false;
        window.SiteStorage = { open: async () => ({ persistent: true, get: () => chatPreference, set: (_key, value) => { window.chatPreference = value; } }) };
        window.fetch = async () => ({ ok: true, json: async () => ({ me: { name: 'test', role: 'student' }, ticket: 'test' }) });
        window.WebSocket = class { static OPEN = 1; addEventListener() {} close() {} };
      });
      await page.addScriptTag({ content: read('assets/school-chat.js') });
      const button = page.getByRole('switch', { name: '채팅 사용' });
      await button.waitFor();
      for (const enabled of [false, true, false]) {
        if (await button.getAttribute('aria-checked') !== String(enabled)) await button.click();
        await page.waitForTimeout(180);
        const actual = await button.evaluate(el => {
          const css = getComputedStyle(el), rect = el.getBoundingClientRect(), thumb = el.firstElementChild.getBoundingClientRect();
          return { width: rect.width, height: rect.height, radius: css.borderRadius, color: css.backgroundColor, image: css.backgroundImage, x: thumb.left - rect.left, checked: el.getAttribute('aria-checked'), saved: window.chatPreference };
        });
        assert.deepEqual(actual, { width: 46, height: 26, radius: '13px', color: enabled ? 'rgb(46, 157, 98)' : 'rgb(74, 85, 104)', image: 'none', x: enabled ? 23 : 3, checked: String(enabled), saved: enabled }, fixture.game || fixture.file);
      }
      await page.keyboard.press('Tab');
      await page.keyboard.press('Shift+Tab');
      await button.focus();
      assert.notEqual(await button.evaluate(el => getComputedStyle(el).outlineStyle), 'none');
      if (fixture.game === 'janggi') {
        const target = path.join(root, 'outputs/chat-switch-fixed.webp');
        fs.mkdirSync(path.dirname(target), { recursive: true });
        execFileSync('python', ['-c', 'import sys,io;from PIL import Image;Image.open(io.BytesIO(sys.stdin.buffer.read())).save(sys.argv[1],"WEBP",lossless=True)', target], { input: await page.locator('#unifiedSettingsPanel').screenshot() });
      }
      await page.close();
    }
    console.log(`${selected.length} game style contexts: switch appearance, toggle, saved preference and keyboard focus passed`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
