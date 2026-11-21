// Decode every new recording, then exercise native-pitch playback and release
// through the production Web Audio graph, including overlapping same-note hits.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const puppeteer = require('puppeteer-core');
const root = path.resolve(__dirname, '..');
const room = '/learning/arts/instrument-room/';
const audioRoot = path.join(root, room, 'assets/audio');
const manifest = JSON.parse(fs.readFileSync(path.join(audioRoot, 'guitar-cubase-capture.json')));
const models = [['s-style','sc'], ['metal-seven','hellrazer'], ['hollow-jazz','sh'], ['dreadnought','t'], ['classical-guitar','l']];
assert.equal(manifest.totalNotes, 248);
assert.equal(manifest.instruments.reduce((n, item) => n + item.notes, 0), 248);
for (const item of manifest.instruments) {
  assert.equal(item.pitchShiftedNotes, 0);
  assert.equal(item.notes, item.maxMidi - item.minMidi + 1);
  assert.equal(item.holdSeconds + item.tailSeconds, 10);
  for (const row of item.rows) {
    assert.deepEqual(row.issues, [], item.model + '/' + row.midi);
    assert.ok(row.onsetMs < 27 && row.endingRms < .0001, JSON.stringify(row));
    const file = fs.readFileSync(path.join(audioRoot, 'guitar-cubase-' + item.model.toLowerCase(), row.file));
    assert.equal(crypto.createHash('sha256').update(file).digest('hex'), row.sha256);
  }
}
const server = http.createServer((req, res) => {
  let file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  fs.readFile(file, (error, data) => {
    if (error) return res.writeHead(404).end();
    if (file.endsWith('instrument-room' + path.sep + 'app.js')) {
      data = data.toString().replace('document.addEventListener("DOMContentLoaded", init);',
        'window.guitarTest = {state, KEYBOARD_SAMPLE_SETS, selectModel, sampledPianoConfig, concertGrandAnchor, concertGrandSampleFile, startConcertGrandSample, releasePianoVoice, ensureAudio}; document.addEventListener("DOMContentLoaded", init);');
    }
    res.writeHead(200, {'Content-Type': {'.js':'text/javascript', '.html':'text/html; charset=utf-8', '.css':'text/css', '.ogg':'audio/ogg', '.webp':'image/webp'}[path.extname(file)] || 'application/octet-stream'}).end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await puppeteer.launch({executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true});
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:' + server.address().port + room, {waitUntil:'networkidle0'});
    await page.click('[data-family="guitar"]');
    const results = await page.evaluate(async (models) => {
      const a = window.guitarTest;
      const decoder = new OfflineAudioContext(2, 48000, 48000);
      const results = [];
      for (const [model, suffix] of models) {
        a.selectModel(model);
        const config = a.sampledPianoConfig();
        if (config.id !== 'guitar-cubase-' + suffix) throw new Error('Wrong bank: ' + model);
        if (document.querySelector('#soundPresetButtons')) throw new Error('Legacy preset UI remains');
        if (a.state.currentModel.range[0] !== config.min || a.state.currentModel.range[1] !== config.max) throw new Error('Unrecorded range: ' + model);
        const row = {model, decoded:0, renders:[]};
        for (let midi = config.min; midi <= config.max; midi++) {
          const anchor = a.concertGrandAnchor(midi, config);
          if (anchor !== midi) throw new Error('Transposed substitute: ' + model + '/' + midi);
          const response = await fetch(config.root + a.concertGrandSampleFile(anchor, config));
          if (!response.ok) throw new Error('Missing note: ' + midi);
          const buffer = await decoder.decodeAudioData(await response.arrayBuffer());
          if (buffer.numberOfChannels !== 2 || buffer.duration < 4) throw new Error('Truncated note: ' + midi);
          row.decoded++;
          if (![config.min, 55, config.max].includes(midi)) continue;
          const context = new OfflineAudioContext(2, 48000, 48000);
          const NativeContext = window.AudioContext;
          window.AudioContext = function () { return context; };
          context.resume = () => Promise.resolve();
          a.state.audioContext = null;
          a.state.pianoVoices.clear();
          a.state.pianoReleaseVoices.clear();
          a.ensureAudio();
          window.AudioContext = NativeContext;
          const first = a.startConcertGrandSample(midi, .8, anchor, buffer, config.id);
          if (first.source.playbackRate.value !== 1) throw new Error('Native note pitch changed');
          const suspended = context.suspend(.2), rendering = context.startRendering();
          await suspended;
          const second = a.startConcertGrandSample(midi, .8, anchor, buffer, config.id);
          if (!first.released || !a.state.pianoReleaseVoices.has(first)) throw new Error('Retrigger erased release');
          a.releasePianoVoice(second, false);
          await OfflineAudioContext.prototype.resume.call(context);
          const output = await rendering;
          let peak = 0, energy = 0;
          const values = output.getChannelData(0);
          for (let i=0;i<values.length;i++) {
            if (!Number.isFinite(values[i])) throw new Error('Invalid output');
            peak = Math.max(peak, Math.abs(values[i]));
            if (i < 9600) energy += values[i] ** 2;
          }
          row.renders.push({midi,peak,rms:Math.sqrt(energy / 9600)});
        }
        results.push(row);
      }
      return results;
    }, models);
    assert.equal(results.reduce((n,r) => n+r.decoded,0), 248);
    for (const row of results) for (const render of row.renders) {
      assert.ok(render.peak < .99 && render.rms > .001, JSON.stringify({model:row.model,...render}));
    }
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({passed:true,decoded:248,models:results},null,2));
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => {console.error(error);process.exitCode=1;});
