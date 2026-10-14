const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('../game-hub-server/node_modules/playwright');

async function main() {
  const root = path.resolve(__dirname, '../learning/literacy-numeracy/phonics');
  const audioRoot = path.join(root, 'assets/sounds/phonemes');
  const files = fs.readdirSync(audioRoot).filter(file => file.endsWith('.ogg')).sort();
  assert.equal(files.length, 66);
  assert.equal(fs.readdirSync(audioRoot).some(file => /\.wav$/i.test(file)), false);
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  const start = app.indexOf('  function phonemeFile(');
  const end = app.indexOf('  function phonemePlan(', start);
  assert.ok(start >= 0 && end > start);
  const phonemeFile = new Function(app.slice(start, end) + '; return phonemeFile;')();
  for (const file of files) {
    const sound = file.slice(0, -4).replace(/^end-/, '-').replace(/([aiou])-e$/, '$1_e');
    assert.equal(phonemeFile(sound), 'assets/sounds/phonemes/' + file);
  }
  const allowed = new Set(files.map(file => '/assets/sounds/phonemes/' + file));
  const server = http.createServer((req, res) => {
    if (req.url === '/') {
      res.setHeader('Content-Type', 'text/html');
      return res.end('<!doctype html><title>Audio verification</title>');
    }
    if (!allowed.has(req.url)) { res.writeHead(404); return res.end(); }
    res.setHeader('Content-Type', 'audio/ogg');
    res.end(fs.readFileSync(path.join(audioRoot, path.basename(req.url))));
  });
  let browser;
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    const result = await page.evaluate(async names => {
      const context = new AudioContext();
      const rows = [];
      try {
        for (const name of names) {
          const url = 'assets/sounds/phonemes/' + name;
          const response = await fetch(url);
          if (!response.ok) throw new Error(name + ': HTTP ' + response.status);
          const buffer = await context.decodeAudioData(await response.arrayBuffer());
          const samples = buffer.getChannelData(0);
          let energy = 0;
          for (const sample of samples) energy += sample * sample;
          const audio = new Audio(url);
          await audio.play();
          audio.pause();
          audio.removeAttribute('src');
          audio.load();
          rows.push({ name, duration: buffer.duration, channels: buffer.numberOfChannels, rms: Math.sqrt(energy / samples.length) });
        }
      } finally { await context.close(); }
      return rows;
    }, files);
    for (const row of result) {
      assert.equal(row.channels, 1, row.name);
      assert.ok(row.duration > 1 && row.duration < 2, row.name + ': duration');
      assert.ok(row.rms > 0.001, row.name + ': audible samples');
    }
    console.log(`PASS: ${result.length} phoneme OGG paths, browser decoding and playback; no served WAV files.`);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
