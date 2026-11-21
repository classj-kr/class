// Signature excerpts must use the selected instrument's real recorded pitches,
// complete normally, and leave no sounding/key state when interrupted.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const puppeteer = require('puppeteer-core');
const root = path.resolve(__dirname, '..');
const room = '/learning/arts/instrument-room/';
const output = path.join(root, 'outputs/instrument-demo-review');
const server = http.createServer((req, res) => {
  let file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  fs.readFile(file, (error, bytes) => {
    if (error) return res.writeHead(404).end();
    if (file.endsWith('instrument-room' + path.sep + 'app.js')) {
      bytes = bytes.toString().replace('document.addEventListener("DOMContentLoaded", init);',
        'window.signatureTest={state,selectModel,KEYBOARD_SAMPLE_SETS,BASS_DEMOS};window.signatureHits=[];document.addEventListener("DOMContentLoaded", init);');
      bytes = bytes.replace('function startConcertGrandSample(midi, velocity, anchor, buffer, sampleSet, when) {',
        'function startConcertGrandSample(midi, velocity, anchor, buffer, sampleSet, when) { window.signatureHits.push({midi,anchor,sampleSet,when});');
    }
    const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.ogg': 'audio/ogg', '.flac': 'audio/flac', '.webp': 'image/webp', '.woff2': 'font/woff2' };
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' }).end(bytes);
  });
});

async function shot(page, name) {
  const result = spawnSync('python', ['-c',
    'import io,sys;from PIL import Image;im=Image.open(io.BytesIO(sys.stdin.buffer.read())).convert("RGBA");im.save(sys.argv[1],format="WEBP",lossless=True,exact=True);out=Image.open(sys.argv[1]).convert("RGBA");assert im.size==out.size and im.tobytes()==out.tobytes()',
    path.join(output, name + '.webp')], { input: await page.screenshot() });
  assert.equal(result.status, 0, String(result.stderr));
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
    await Promise.all([1366, 390].flatMap(width => ['pipe-organ', 'slap'].map(async kind => {
      const page = await browser.newPage();
      await page.setViewport({ width, height: width < 500 ? 844 : 900, isMobile: width < 500, hasTouch: width < 500 });
      const errors = [];
      async function press(selector) {
        await page.$eval(selector, button => button.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'instant' }));
        if (width < 500) await page.tap(selector);
        else await page.click(selector);
      }
      page.on('pageerror', error => errors.push(error.message));
      await page.goto('http://127.0.0.1:' + server.address().port + room, { waitUntil: 'networkidle0' });
      const organ = kind === 'pipe-organ';
      await press(organ ? '[data-family="keyboard"]' : '[data-family="bass"]');
      if (organ) await page.evaluate(() => signatureTest.selectModel('pipe-organ'));
      else await page.evaluate(() => signatureTest.selectModel('p-bass'));
      assert.equal(await page.evaluate(() => signatureTest.state.currentModel.id), organ ? 'pipe-organ' : 'p-bass', kind + '/' + width + ': selected model');
      const selector = organ ? '#melodyDemoButtons button' : '[data-bass-demo="slap"]';
      await page.waitForSelector(selector, { visible: true });
      await page.$eval(selector, button => button.scrollIntoView({ block: 'center', inline: 'center' }));
      assert.match(await page.$eval(selector, button => button.textContent), organ ? /토카타.*BWV 565/ : /Can't Stop/);
      if (!organ) await page.evaluate(() => {
        const a = signatureTest;
        for (const id of ['p-bass', 'j-bass', 'active-bass', 'fretless-bass']) {
          const config = a.KEYBOARD_SAMPLE_SETS[id + '-slap'];
          for (const bar of a.BASS_DEMOS.slap.bars) for (const [, midi] of bar) {
            if (midi < config.min || midi > config.max) throw new Error(id + ': demo outside recorded range');
          }
        }
      });
      await page.evaluate(() => { window.signatureHits = []; });
      await press(selector);
      await page.waitForFunction(selector => document.querySelector(selector).getAttribute('aria-pressed') === 'true', {}, selector);
      await page.waitForFunction(() => signatureHits.length > 0 && document.querySelector('.key.demo-hit'));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await shot(page, kind + '-' + width);
      await page.waitForFunction(selector => document.querySelector(selector).getAttribute('aria-pressed') === 'false', { timeout: 35000 }, selector);
      const hits = await page.evaluate(() => signatureHits);
      assert.ok(hits.every(hit => hit.midi === hit.anchor && (organ ? hit.sampleSet === 'pipe-organ' : hit.sampleSet.endsWith('-slap'))), JSON.stringify({ kind, width, unexpected: hits.filter(hit => hit.midi !== hit.anchor || (organ ? hit.sampleSet !== 'pipe-organ' : !hit.sampleSet.endsWith('-slap'))) }));
      assert.deepEqual(hits.slice(0, organ ? 6 : 3).map(hit => hit.midi), organ ? [69,81,67,79,69,81] : [40,50,52]);
      if (organ) { assert.equal(hits.filter(hit=>hit.midi===38&&hit.when-hits[0].when>=18-1e-8).length,1); assert.deepEqual(hits.slice(-3).map(hit => hit.midi), [50,57,62]); }
      else { assert.equal(hits.length, 47); assert.equal(hits.at(-1).midi, 40); }
      assert.equal(await page.$$('.key.demo-hit').then(keys => keys.length), 0);
      // A second click stops; selecting another family must also stop a run.
      await press(selector);
      await page.waitForFunction(() => document.querySelector('.key.demo-hit'));
      await press(selector);
      assert.equal(await page.$$('.key.demo-hit').then(keys => keys.length), 0);
      await press(selector);
      await page.waitForFunction(() => document.querySelector('.key.demo-hit'));
      await press('[data-family="guitar"]');
      assert.equal(await page.$$('.key.demo-hit').then(keys => keys.length), 0);
      assert.equal(await page.evaluate(() => signatureTest.state.activeNotes.size), 0);
      assert.deepEqual(errors, []);
      console.log(JSON.stringify({ kind, width, notes: hits.length, passed: true }));
      await page.close();
    })));
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
