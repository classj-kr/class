const { chromium } = require('C:/Users/A/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve('.');
const out = path.join(root, '.tmp/respiration-review');
fs.mkdirSync(out, { recursive: true });
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp' };
const server = http.createServer((req, res) => {
  let file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
 await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
 const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/A/.cache/puppeteer/chrome/win64-150.0.7871.24/chrome-win64/chrome.exe' });
 try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://127.0.0.1:' + server.address().port + '/learning/inquiry/human-body/respiration/');
  await page.locator('[data-scene="breath"]').click();
  await page.waitForTimeout(250);
  await page.locator('#playPauseBtn').click();
  await page.evaluate(() => window.RespirationBreathing.setPosition(0));
  await page.waitForTimeout(100);
  await page.screenshot({ path: path.join(out, 'desktop-exhale.png') });
  await page.evaluate(() => window.RespirationBreathing.setPosition(100));
  await page.waitForTimeout(100);
  await page.screenshot({ path: path.join(out, 'desktop-inhale.png') });
  console.log(JSON.stringify({ errors, state: await page.evaluate(() => window.RespirationBreathing.getState()), size: await page.locator('.breath-layer').evaluate(e => ({ width: e.clientWidth, scrollWidth: e.scrollWidth, height:e.clientHeight, scrollHeight:e.scrollHeight })) }));
 } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });

