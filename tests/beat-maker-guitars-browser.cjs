const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const puppeteer = require('puppeteer-core');

const root = path.resolve(__dirname, '..');
const game = '/learning/arts/beat-maker/';
const types = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.ogg': 'audio/ogg' };
const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const file = path.resolve(root, '.' + pathname + (pathname.endsWith('/') ? 'index.html' : ''));
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  fs.readFile(file, (error, data) => {
    if (error) return res.writeHead(404).end();
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream' }).end(data);
  });
});

(async () => {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.evaluateOnNewDocument(() => {
      const AudioContext = window.AudioContext;
      window.AudioContext = class extends AudioContext {
        constructor(options) { super({ ...options, sampleRate: 48000 }); }
      };
    });
    await page.goto(`http://127.0.0.1:${server.address().port}${game}`, { waitUntil: 'networkidle0' });
    const actual = await page.$$eval('#tracks .inst optgroup[label="기타"] option', (options) => options.slice(0, 5).map((o) => o.textContent));
    assert.deepEqual(actual, ['Rock', 'Metal', 'Jazz', 'Acoustic Steel', 'Classic Nylon']);
    for (const width of [1366, 390, 320]) {
      await page.setViewport({ width, height: 900 });
      await page.select('#tracks .track:first-child .inst', 'guitar/s-style');
      await page.waitForFunction(() => document.querySelector('#tracks .track:first-child .track-icon use')?.getAttribute('href').endsWith('#guitar'));
      await page.waitForFunction(() => [...document.querySelectorAll('#tracks .track-icon use')].every((icon) => icon.getBBox().width > 0));
      assert.equal(await page.$eval('#tracks .track:first-child .art', () => true).catch(() => false), false);
      assert.equal(await page.$eval('#tracks', (tracks) => tracks.querySelectorAll('.track-icon').length), 4);
      const clipped = await page.$$eval('#tracks .track', (rows) => rows.flatMap((row) => {
        const bounds = row.getBoundingClientRect();
        return [...row.querySelector('.track-controls').children]
          .filter((control) => {
            if (!control.getClientRects().length) return false;
            const rect = control.getBoundingClientRect();
            return rect.width === 0 || rect.left < bounds.left || rect.right > bounds.right;
          })
          .map((control) => control.getAttribute('aria-label') ?? control.className);
      }));
      assert.deepEqual(clipped, [], `Track controls clipped at ${width}px`);
    }
    const results = await page.evaluate(async () => {
      const decoder = new OfflineAudioContext(2, 1, 48000);
      const results = [];
      for (const model of GuitarSamples.models) {
        const track = BeatCore.track('g1', 'guitar/' + model.id, '', [{ step: 0, pitch: 55, len: 4 }]);
        track.volume = 1;
        const snd = BeatCore.sound(track);
        const original = await decoder.decodeAudioData(await (await fetch(BeatCore.sampleUrl(snd, 55))).arrayBuffer());
        const rendered = await BeatEngine.render({ ...BeatCore.initial, bars: 1, tracks: [track] }, 48000, 2);
        let peak = .0001, error = 0, energy = 0;
        for (let c = 0; c < original.numberOfChannels; c++) {
          for (const value of original.getChannelData(c)) peak = Math.max(peak, Math.abs(value));
        }
        const gain = Math.min(.92 / peak, Math.pow(.8, .9) * 1.22 / model.captureGain);
        for (let c = 0; c < original.numberOfChannels; c++) {
          const ref = original.getChannelData(c), output = rendered.getChannelData(c);
          for (let frame = 0; frame < 28800; frame++) {
            const expected = ref[frame] * gain;
            error += (expected - output[2400 + frame]) ** 2;
            energy += expected ** 2;
          }
        }
        results.push({ name: model.name, error: Math.sqrt(error / energy), bank: snd.dir, min: snd.min, max: snd.max });
      }
      return results;
    });
    assert.equal(results.length, 5);
    for (const result of results) assert.ok(result.error < .00002, JSON.stringify(result));
    assert.deepEqual(errors, []);
    console.log(JSON.stringify(results));
  } finally {
    await browser?.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
