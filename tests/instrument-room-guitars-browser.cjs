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
const guitarNames = ['Rock', 'Metal', 'Jazz', 'Acoustic Steel', 'Classic Nylon'];
assert.equal(manifest.totalNotes, 248);
assert.equal(manifest.instruments.reduce((n, item) => n + item.notes, 0), 248);
for (const item of manifest.instruments) {
  assert.equal(item.pitchShiftedNotes, 0);
  assert.equal(item.notes, item.maxMidi - item.minMidi + 1);
  assert.equal(item.holdSeconds + item.tailSeconds, 10);
  for (const row of item.rows) {
    assert.deepEqual(row.issues, [], item.model + '/' + row.midi);
    assert.ok(row.onsetMs < 27 && row.endingRms < .0001, JSON.stringify(row));
    assert.ok(row.quantizationError <= 2 ** -23, '24-bit lossless conversion');
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
        'window.guitarTest = {state, KEYBOARD_SAMPLE_SETS, selectModel, sampledPianoConfig, concertGrandAnchor, concertGrandSampleFile, loadConcertGrandSample, startConcertGrandSample, releasePianoVoice, pianoNoteOff, ensureAudio}; document.addEventListener("DOMContentLoaded", init);');
    }
    res.writeHead(200, {'Content-Type': {'.js':'text/javascript', '.html':'text/html; charset=utf-8', '.css':'text/css', '.ogg':'audio/ogg', '.flac':'audio/flac', '.webp':'image/webp'}[path.extname(file)] || 'application/octet-stream'}).end(data);
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
    assert.deepEqual(await page.$$eval('#modelChooser b', labels => labels.map(label => label.textContent)), guitarNames);
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
        const row = {model, decoded:0, renders:[], tapTailRatio:null};
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
          if (midi === 55) {
            const natural = new OfflineAudioContext(2, 96000, 48000);
            window.AudioContext = function () { return natural; };
            natural.resume = () => Promise.resolve();
            a.state.audioContext = null;
            a.state.pianoVoices.clear();
            a.state.pianoReleaseVoices.clear();
            a.ensureAudio();
            window.AudioContext = NativeContext;
            const voice = a.startConcertGrandSample(midi, .8, midi, buffer, config.id);
            const paused = natural.suspend(.25), playing = natural.startRendering();
            await paused;
            a.pianoNoteOff(midi);
            if (!voice.released) throw new Error(model + ': key-up left the guitar sustaining');
            if ([...a.state.pianoReleaseVoices].some(tail => tail.releaseTail)) throw new Error(model + ': spliced an unrelated release fragment');
            await OfflineAudioContext.prototype.resume.call(natural);
            const output = await playing;
            let actual = 0, reference = 0;
            for (let i=48000;i<72000;i++) {
              actual += output.getChannelData(0)[i] ** 2;
              reference += buffer.getChannelData(0)[i] ** 2;
            }
            row.tapTailRatio = Math.sqrt(actual / reference);

            async function renderShortTap(release, quick = false) {
              const ctx = new OfflineAudioContext(2, 72000, 48000);
              window.AudioContext = function () { return ctx; };
              ctx.resume = () => Promise.resolve();
              a.state.audioContext = null;
              a.state.pianoVoices.clear();
              a.state.pianoReleaseVoices.clear();
              a.ensureAudio();
              window.AudioContext = NativeContext;
              const note = a.startConcertGrandSample(55, .8, 55, buffer, config.id);
              if (note.source.loop) throw new Error(model + ': plucked sample loops');
              if (release == null) return ctx.startRendering();
              const suspended = ctx.suspend(release), rendering = ctx.startRendering();
              await suspended;
              if (quick) a.releasePianoVoice(note, true);
              else a.pianoNoteOff(55);
              await OfflineAudioContext.prototype.resume.call(ctx);
              return rendering;
            }
            const held = await renderShortTap(null);
            const short = await renderShortTap(.04);
            const muted = await renderShortTap(.04, true);
            let heldBody = 0, tapBody = 0, muteBody = 0, tail = 0;
            for (let i = 4800; i < 8640; i++) {
              heldBody += held.getChannelData(0)[i] ** 2;
              tapBody += short.getChannelData(0)[i] ** 2;
              muteBody += muted.getChannelData(0)[i] ** 2;
            }
            for (let i = 57600; i < 72000; i++) tail += short.getChannelData(0)[i] ** 2;
            row.shortTapBodyRatio = Math.sqrt(tapBody / heldBody);
            row.explicitMuteRatio = Math.sqrt(muteBody / heldBody);
            row.shortTapLateRms = Math.sqrt(tail / 14400);
          }
        }
        results.push(row);
      }
      return results;
    }, models);
    assert.equal(results.reduce((n,r) => n+r.decoded,0), 248);
    for (const row of results) for (const render of row.renders) {
      assert.ok(render.peak < .99 && render.rms > .001, JSON.stringify({model:row.model,...render}));
    }
    for (const row of results) assert.ok(row.tapTailRatio < .015, row.model + ': key-up damps the note after its short recorded release');
    for (const row of results) {
      assert.ok(row.shortTapBodyRatio > .98, row.model + ': quick key-up removed the original pluck body');
      assert.ok(row.explicitMuteRatio < .15, row.model + ': explicit damping must bypass the pluck body protection');
      assert.ok(row.shortTapLateRms < .00001, row.model + ': short taps must not hang like a sustain pedal');
    }
    assert.deepEqual(errors, []);
    // An unsupported lossless decoder must use the supplied Ogg fallback.
    const fallbackPage = await browser.newPage();
    await fallbackPage.evaluateOnNewDocument(() => {
      const decode = AudioContext.prototype.decodeAudioData;
      window.flacRejections = 0;
      AudioContext.prototype.decodeAudioData = function (data, ...args) {
        const bytes = new Uint8Array(data);
        if (bytes[0] === 102 && bytes[1] === 76 && bytes[2] === 97 && bytes[3] === 67) {
          window.flacRejections++;
          return Promise.reject(new Error('Simulated unsupported FLAC decoder'));
        }
        return decode.call(this, data, ...args);
      };
    });
    await fallbackPage.goto('http://127.0.0.1:' + server.address().port + room, {waitUntil:'networkidle0'});
    await fallbackPage.click('[data-family="guitar"]');
    const fallback = await fallbackPage.evaluate(async () => {
      const sample = await guitarTest.loadConcertGrandSample(40);
      return {rejections:flacRejections, id:sample.sampleSet, duration:sample.buffer.duration};
    });
    assert.equal(fallback.rejections, 0);
    assert.ok(fallback.duration > 4);
    assert.equal(fallback.id, 'guitar-cubase-sc');
    await fallbackPage.close();
    console.log(JSON.stringify({passed:true,decoded:248,models:results},null,2));
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => {console.error(error);process.exitCode=1;});
