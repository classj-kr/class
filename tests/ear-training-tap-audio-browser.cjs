// Render the real piano sample and mixer; this does not measure speaker/Bluetooth latency.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const dir = path.resolve(__dirname, '../learning/arts/music-theory/ear-training');
const source = fs.readFileSync(path.join(dir, 'piano-engine.js'), 'utf8');
const sampleNames = ['C2', 'Fs2', 'C3', 'Fs3', 'C4', 'Fs4', 'C5', 'Fs5', 'C6'];
const samples = Object.fromEntries(sampleNames.map(name => [name + '.ogg', fs.readFileSync(path.join(dir, 'assets/piano', name + '.ogg')).toString('base64')]));
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage();
    const results = await page.evaluate(async ({ source, samples }) => {
      const results = [];
      for (const rate of [44100, 48000]) for (const loaded of [false, true]) {
        const context = new OfflineAudioContext(1, rate, rate);
        context.resume = () => Promise.resolve();
        window.AudioContext = function() { return context; };
        window.fetch = async url => {
          if (!loaded) throw new Error('Samples offline');
          return { ok: true, arrayBuffer: async () => Uint8Array.from(atob(samples[url.split('/').pop()]), c => c.charCodeAt(0)).buffer };
        };
        (0, eval)(source);
        if (loaded) await PianoEngine.preload();
        PianoEngine.tapRhythm();
        const audio = (await context.startRendering()).getChannelData(0);
        const onset = audio.findIndex(v => Math.abs(v) > .002) / rate;
        const peak = Math.max(...audio.map(v => Math.abs(v)));
        results.push({ rate, loaded, onsetMs: onset * 1000, peak });
      }
      return results;
    }, { source, samples });
    for (const result of results) {
      assert.ok(result.onsetMs >= 0 && result.onsetMs < 40, 'Audible onset must be prompt: ' + JSON.stringify(result));
      assert.ok(result.peak > .015 && result.peak < .9, 'Audible, unclipped feedback');
    }
    console.log(JSON.stringify(results));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
