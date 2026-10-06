// Exercise the actual rhythm screen. These timings exclude physical output latency.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const base = '/learning/arts/music-theory/ear-training/';
const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const file = path.resolve(root, '.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname));
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  fs.readFile(file, (error, data) => {
    if (error) return res.writeHead(404).end();
    const type = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.ogg': 'audio/ogg' }[path.extname(file)];
    res.writeHead(200, { 'Content-Type': type || 'application/octet-stream' }).end(data);
  });
});
async function enterRhythm(page) {
  await page.getByRole('button', { name: '리듬 (Rhythm)', exact: true }).click();
  await page.locator('#lessonList .is-read').first().click();
  await page.locator('#replayButton').click();
}
function checkImmediate(starts, count, label) {
  assert.equal(starts.length, count, label + ': exactly one voice per contact');
  assert.ok(starts.every(s => s.leadMs <= 10 && s.dispatchMs < 100), label + ': no deferred sound: ' + JSON.stringify(starts));
}
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
    const context = await browser.newContext({ viewport: { width: 1024, height: 768 }, hasTouch: true });
    await context.addInitScript(() => {
      window.starts = []; window.decoded = 0; window.inputAt = 0;
      for (const event of ['pointerdown', 'keydown', 'click']) document.addEventListener(event, () => { window.inputAt = performance.now(); }, true);
      for (const [type, proto] of [['sample', AudioBufferSourceNode.prototype], ['synth', OscillatorNode.prototype]]) {
        const original = proto.start;
        proto.start = function(when, ...rest) {
          window.starts.push({ type, leadMs: (when - this.context.currentTime) * 1000, dispatchMs: performance.now() - window.inputAt });
          return original.call(this, when, ...rest);
        };
      }
      const decode = AudioContext.prototype.decodeAudioData;
      AudioContext.prototype.decodeAudioData = function(...args) {
        return decode.apply(this, args).then(buffer => { window.decoded++; return buffer; });
      };
    });
    const pending = [];
    await context.route('**/assets/piano/*.ogg', route => { pending.push(route); });
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:' + server.address().port + base);
    await enterRhythm(page);
    const pad = page.locator('#tapPad');
    const box = await pad.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.evaluate(() => { starts = []; });
    await page.mouse.down();
    const cold = await page.evaluate(() => ({ starts, count: document.querySelector('#tapCount').textContent }));
    console.log('cold rhythm contact:', JSON.stringify(cold));
    checkImmediate(cold.starts, 3, 'pending samples / held pointer');
    assert.equal(cold.count, '1 번');
    await page.mouse.up();
    assert.equal(await page.locator('#tapCount').textContent(), '1 번', 'release/click must not duplicate');

    await page.waitForFunction(() => decoded === 0);
    const c4 = pending.find(route => route.request().url().endsWith('/C4.ogg'));
    assert.ok(c4, 'C4 request should be pending');
    await c4.continue();
    await page.waitForFunction(() => decoded === 1);
    // Restart the short round to keep download speed out of the test deadline.
    await page.locator('#replayButton').click();
    await page.evaluate(() => { starts = []; });
    await pad.tap();
    const warm = await page.evaluate(() => starts);
    checkImmediate(warm, 1, 'touch / only C4 loaded');
    assert.equal(warm[0].type, 'sample');
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    for (let i = 0; i < 5; i++) {
      await page.mouse.down();
      await page.mouse.up();
    }
    checkImmediate(await page.evaluate(() => starts), 6, 'rapid contacts');
    assert.equal(await page.locator('#tapCount').textContent(), '6 번');

    await pad.focus();
    await page.keyboard.down('Space');
    assert.equal(await page.locator('#tapCount').textContent(), '7 번', 'Space must tap on keydown, not restart the count-in');
    await page.keyboard.down('Space');
    await page.keyboard.up('Space');
    assert.equal(await page.locator('#tapCount').textContent(), '7 번', 'holding/releasing Space must not add taps');
    checkImmediate(await page.evaluate(() => starts), 7, 'keyboard');
    await page.keyboard.down('Enter');
    assert.equal(await page.locator('#tapCount').textContent(), '8 번', 'focused pad must sound on Enter keydown');
    await page.keyboard.down('Enter');
    await page.keyboard.up('Enter');
    assert.equal(await page.locator('#tapCount').textContent(), '8 번', 'Enter repeat/release must not duplicate');
    checkImmediate(await page.evaluate(() => starts), 8, 'focused Enter');
    for (const route of pending.filter(route => route !== c4)) await route.continue();
    await page.waitForFunction(() => decoded === 9);
    assert.equal(await page.evaluate(() => starts.length), 8, 'downloads must not replay old contacts');

    await page.waitForFunction(() => document.querySelector('#tapPad').disabled);
    const countAfterJudging = await page.locator('#tapCount').textContent();
    await page.keyboard.press('Space');
    assert.equal(await page.evaluate(() => starts.length), 8, 'answered rounds cannot sound or restart');
    assert.equal(await page.locator('#tapCount').textContent(), countAfterJudging);
    await page.locator('#nextButton').click();
    await page.keyboard.press('Space');
    assert.equal(await pad.isEnabled(), true, 'Space starts a new unstarted rhythm round');
    assert.equal(await page.locator('#tapCount').textContent(), '0 번');

    // The same immediate feedback is used by rhythm dictation grid cells.
    await page.reload();
    await page.getByRole('button', { name: '리듬 (Rhythm)', exact: true }).click();
    await page.locator('#lessonList .is-listen').first().click();
    await page.evaluate(() => { starts = []; });
    await page.locator('#beatGrid button').first().click();
    checkImmediate(await page.evaluate(() => starts), 3, 'dictation grid / pending samples');
    assert.deepEqual(errors, []);
    console.log('PASS: full-app mouse, touch, rapid taps, Space, held-key suppression, sample loading, answered state, grid');
    console.log('warm rhythm contact:', JSON.stringify(warm));
    await context.close();
  } finally {
    if (browser) await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
