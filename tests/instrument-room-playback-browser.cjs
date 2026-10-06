// Real Ogg decoding and Web Audio output, plus mouse/touch/keyboard regression checks.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const puppeteer = require('puppeteer-core');
const root = path.resolve(__dirname, '..');
const room = '/learning/arts/instrument-room/';
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const hook = `window.playbackTest = {
  state, KEYBOARD_SAMPLE_SETS, DRUM_SAMPLE_SETS, concertGrandSampleFile,
  balancedDrumGain, volumeOnlyGain, decodedBufferPeak, decodedBufferBodyRms,
  decodedBufferStartOffset, startConcertGrandSample, releasePianoVoice, ensureAudio, cacheElements
};`;
const server = http.createServer((req, res) => {
  let file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  fs.readFile(file, (error, data) => {
    if (error) return res.writeHead(404).end();
    if (file.endsWith('instrument-room' + path.sep + 'app.js')) {
      const init = 'document.addEventListener("DOMContentLoaded", init);';
      data = data.toString().replace(init, hook + (req.headers.referer?.includes('render-test') ? 'cacheElements();' : init));
    }
    if (path.extname(file) === '.html') data = data.toString().replace('</head>', '<script src="/assets/sound/game-sfx.js" defer></script></head>');
    const type = {'.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.ogg':'audio/ogg', '.webp':'image/webp'}[path.extname(file)];
    res.writeHead(200, {'Content-Type': type || 'application/octet-stream'}).end(data);
  });
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true
    });
    const url = 'http://127.0.0.1:' + server.address().port + room;
    const renderPage = await browser.newPage();
    await renderPage.goto(url + '?render-test', {waitUntil:'load'});
    const rendered = await renderPage.evaluate(async () => {
      const a = window.playbackTest;
      const decoder = new OfflineAudioContext(2, 48000, 48000);
      const results = [];
      for (const id of ['recorder-alto', 'recorder-tenor']) {
        const config = a.KEYBOARD_SAMPLE_SETS[id];
        for (const midi of [config.min, Math.round((config.min + config.max) / 2), config.max]) {
          const buffer = await decoder.decodeAudioData(await (await fetch(config.root + a.concertGrandSampleFile(midi, config))).arrayBuffer());
          const context = new OfflineAudioContext(2, 24000, 48000);
          const NativeContext = window.AudioContext;
          // Build the production mixing graph using an offline destination.
          window.AudioContext = function () { return context; };
          context.resume = () => Promise.resolve();
          a.state.audioContext = null;
          a.state.pianoVoices.clear();
          a.ensureAudio();
          window.AudioContext = NativeContext;
          const voice = a.startConcertGrandSample(midi, .8, midi, buffer, id);
          const suspended = context.suspend(.15);
          const rendering = context.startRendering();
          await suspended;
          a.releasePianoVoice(voice, false);
          await OfflineAudioContext.prototype.resume.call(context);
          const output = await rendering;
          let energy = 0, peak = 0;
          const data = output.getChannelData(0);
          for (let i = 0; i < 7200; i++) { energy += data[i] * data[i]; peak = Math.max(peak, Math.abs(data[i])); }
          results.push({id, midi, rms:Math.sqrt(energy / 7200), peak, offset:a.decodedBufferStartOffset(buffer)});
        }
      }
      for (const [kit, piece] of [['jazz-kit','rimclick'], ['metal-kit','pedalhat'], ['pop-kit','pedalhat'], ['funk-kit','hat']]) {
        const config = a.DRUM_SAMPLE_SETS[kit];
        const buffer = await decoder.decodeAudioData(await (await fetch(config.root + piece + '.ogg')).arrayBuffer());
        const requested = .8 * Math.pow(10, (config.gainDb + (config.pieceBoostDb?.[piece] || 0)) / 20);
        const gain = a.balancedDrumGain(buffer, requested, .8, piece);
        const context = new OfflineAudioContext(2, buffer.length, buffer.sampleRate);
        const source = context.createBufferSource(), output = context.createGain();
        source.buffer = buffer; output.gain.value = gain;
        source.connect(output).connect(context.destination); source.start();
        const audio = await context.startRendering();
        results.push({kit,piece,rms:a.decodedBufferBodyRms(audio),peak:a.decodedBufferPeak(audio),boostDb:20*Math.log10(gain/requested)});
        const soft = a.balancedDrumGain(buffer, 0, .8, 'ghost');
        if (!(soft < gain)) throw new Error('Soft articulation lost: ' + kit);
      }
      return results;
    });
    for (const row of rendered) {
      assert.ok(row.rms > (row.kit ? .05 : .015), JSON.stringify(row));
      assert.ok(row.peak <= .921, JSON.stringify(row));
      if (row.id) assert.ok(row.offset > .8, JSON.stringify(row));
    }
    console.log('Real sample rendering:', JSON.stringify(rendered));
    await renderPage.close();

    for (const touch of [false, true]) {
      const page = await browser.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.setViewport({width:touch ? 390 : 1366, height:touch ? 844 : 768, isMobile:touch, hasTouch:touch});
      await page.evaluateOnNewDocument(() => {
        window.audioAudit = {sfx:0, instrument:0, inputs:0};
        for (const method of ['createOscillator', 'createBufferSource']) {
          const create = AudioContext.prototype[method];
          AudioContext.prototype[method] = function (...args) {
            const node = create.apply(this, args), start = node.start;
            const kind = new Error().stack.includes('game-sfx.js') ? 'sfx' : 'instrument';
            node.start = function (...values) { audioAudit[kind]++; return start.apply(this, values); };
            return node;
          };
        }
        const add = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function (type, ...args) {
          if (type === 'input') audioAudit.inputs++;
          return add.call(this, type, ...args);
        };
      });
      await page.goto(url, {waitUntil:'networkidle0'});
      const press = async selector => {
        const element = await page.$(selector);
        assert.ok(element, selector);
        await element.evaluate(el => el.scrollIntoView({block:'center', inline:'center', behavior:'instant'}));
        await pause(250);
        await (touch ? element.tap() : element.click());
      };
      if (touch) await press('button[data-key-size-close]:not(.key-size-backdrop)');
      const check = async (name, action) => {
        await pause(200);
        await page.evaluate(() => { audioAudit.sfx = 0; audioAudit.instrument = 0; });
        await action();
        await page.waitForFunction(() => audioAudit.instrument > 0);
        await pause(200);
        const audit = await page.evaluate(() => audioAudit);
        assert.equal(audit.sfx, 0, name);
        console.log(`${touch ? 'touch' : 'desktop'} ${name}: instrument=${audit.instrument}, shared effects=${audit.sfx}`);
      };
      await press('[data-family="drums"]');
      await check('drum', () => press('[data-drum="kick"]'));
      await check('computer keyboard', () => page.keyboard.press('a'));
      await press('[data-family="korean"]');
      await press('[data-korean-room="folk"]');
      await check('Korean percussion', () => press('#drumPads button'));
      await press('[data-family="guitar"]');
      await press('[data-guitar-mode="chords"]');
      await check('guitar chord', () => press('#chordPads button'));
      await check('guitar strum', () => press('[data-strum="down"]'));
      const inputs = await page.evaluate(() => audioAudit.inputs);
      await pause(500);
      assert.equal(await page.evaluate(() => audioAudit.inputs), inputs, 'Animation must not keep adding input listeners');
      assert.deepEqual(errors, []);
      await page.close();
    }
  } finally {
    if (browser) await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
