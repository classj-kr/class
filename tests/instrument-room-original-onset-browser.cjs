// Compare real production playback with the decoded recording from its first
// sample, across every pitched bank and every visible acoustic/electronic pad.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const puppeteer = require('puppeteer-core');
const root = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
  let file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  fs.readFile(file, (error, bytes) => {
    if (error) return res.writeHead(404).end();
    if (file.endsWith('instrument-room' + path.sep + 'app.js')) bytes = bytes.toString().replace(
      'document.addEventListener("DOMContentLoaded", init);',
      'window.onsetAudit={state,KEYBOARD_SAMPLE_SETS,DRUM_SAMPLE_SETS,KOREAN_PERCUSSION_SAMPLE_SETS,STATION_SAMPLE_SETS,activeDrums,concertGrandAnchor,loadConcertGrandSample,startConcertGrandSample,loadDrumSample,playSampledDrum,ensureAudio};cacheElements();');
    res.writeHead(200, { 'Content-Type': ({ '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.ogg': 'audio/ogg', '.flac': 'audio/flac' })[path.extname(file)] || 'application/octet-stream' }).end(bytes);
  });
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:' + server.address().port + '/learning/arts/instrument-room/');
    const rows = await page.evaluate(async () => {
      const a = onsetAudit, Native = window.AudioContext;
      const decoder = new OfflineAudioContext(2, 4800, 48000), rows = [];
      decoder.resume = () => Promise.resolve();
      function context() {
        const ctx = new OfflineAudioContext(2, 4800, 48000);
        ctx.resume = () => Promise.resolve();
        window.AudioContext = function () { return ctx; };
        a.state.audioContext = null;
        a.state.pianoVoices.clear();
        a.state.pianoReleaseVoices.clear();
        a.ensureAudio();
        window.AudioContext = Native;
        return ctx;
      }
      async function compare(ctx, buffer, gain, offset, rate, id) {
        const ref = new OfflineAudioContext(2, 4800, 48000), source = ref.createBufferSource(), level = ref.createGain();
        source.buffer = buffer;
        source.playbackRate.value = rate;
        level.gain.value = gain;
        source.connect(level).connect(ref.destination);
        source.start(0, offset);
        const [actual, original] = await Promise.all([ctx.startRendering(), ref.startRendering()]);
        let energy = 0, error = 0, peak = 0;
        for (let channel = 0; channel < 2; channel++) for (let i = 0; i < 4800; i++) {
          const x = original.getChannelData(channel)[i], y = actual.getChannelData(channel)[i];
          energy += x * x; error += (x - y) ** 2; peak = Math.max(peak, Math.abs(y));
        }
        rows.push({ id, relativeError: Math.sqrt(error / Math.max(energy, 1e-30)), peak });
      }
      for (const config of Object.values(a.KEYBOARD_SAMPLE_SETS)) {
        a.state.audioContext = decoder;
        a.state.articulation = 'pluck';
        a.state.currentModel = { id: config.id };
        const midi = a.concertGrandAnchor(Math.round((config.min + config.max) / 2), config);
        const sample = await a.loadConcertGrandSample(midi);
        const ctx = context();
        const voice = a.startConcertGrandSample(midi, .65, sample.anchor, sample.buffer, config.id);
        // Capture the actual source offset without assuming silence trimming.
        // The configured starts are exact; all other banks use the same cached
        // detected onset that production calculated when starting this voice.
        const offset = Number.isFinite(config.startOffset) ? config.startOffset : a.state.sampleStartOffsets.get(sample.buffer) || 0;
        await compare(ctx, sample.buffer, voice.recordedGain, Math.min(offset, sample.buffer.duration - .01), voice.source.playbackRate.value, config.id);
      }
      const configs = { ...a.DRUM_SAMPLE_SETS, ...a.KOREAN_PERCUSSION_SAMPLE_SETS, ...a.STATION_SAMPLE_SETS };
      for (const [model, config] of Object.entries(configs)) {
        a.state.currentModel = { id: model };
        for (const pad of a.activeDrums().filter(pad => !pad.openModelId)) {
          const id = pad.sound || pad.id;
          if (config.available && !config.available.includes(id)) continue;
          a.state.audioContext = decoder;
          const sample = await a.loadDrumSample(id);
          const ctx = context();
          const create = ctx.createBufferSource.bind(ctx);
          let captured;
          ctx.createBufferSource = () => {
            const source = create(), connect = source.connect.bind(source), start = source.start.bind(source);
            source.connect = target => { captured = { source, gain: target }; return connect(target); };
            source.start = (when, offset = 0) => { captured.offset = offset; return start(when, offset); };
            return source;
          };
          a.playSampledDrum(id, .65);
          for (let tick = 0; tick < 8; tick++) await Promise.resolve();
          if (!captured) throw new Error(model + '/' + id + ': missing original sample playback');
          await compare(ctx, sample.buffer, captured.gain.gain.value, captured.offset, 1, model + '/' + id);
        }
      }
      return rows;
    });
    fs.mkdirSync(path.join(root, 'outputs/instrument-demo-review'), { recursive: true });
    fs.writeFileSync(path.join(root, 'outputs/instrument-demo-review/original-onsets.json'), JSON.stringify(rows, null, 2));
    for (const row of rows) {
      assert.ok(row.relativeError < .0001, row.id + ': altered first 100 ms: ' + row.relativeError);
      assert.ok(row.peak <= .981, row.id + ': unprotected peak');
    }
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ passed: true, banksAndPads: rows.length, maximumRelativeError: Math.max(...rows.map(row => row.relativeError)) }));
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
