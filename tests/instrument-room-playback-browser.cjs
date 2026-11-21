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
  balancedDrumGain, volumeOnlyGain, decodedBufferPeak, decodedBufferBodyRms, selectModel,
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
      data = data.replace('function playSampledDrum(id, velocity) {', 'function playSampledDrum(id, velocity) { (window.sampledDrumInputs ||= []).push({id, velocity, time:performance.now()});');
      data = data.replace('function startConcertGrandSample(midi, velocity, anchor, buffer, sampleSet, when) {',
        'function startConcertGrandSample(midi, velocity, anchor, buffer, sampleSet, when) { if (window.bassDemoHits) window.bassDemoHits.push({midi, velocity, sampleSet, when, time:Number.isFinite(when) ? when * 1000 : performance.now()});');
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
        const requested = .8 * Math.pow(10, config.gainDb / 20);
        const gain = a.balancedDrumGain(buffer, requested, .8, piece, config.id);
        const context = new OfflineAudioContext(2, buffer.length, buffer.sampleRate);
        const source = context.createBufferSource(), output = context.createGain();
        source.buffer = buffer; output.gain.value = gain;
        source.connect(output).connect(context.destination); source.start();
        const audio = await context.startRendering();
        results.push({kit,piece,rms:a.decodedBufferBodyRms(audio),peak:a.decodedBufferPeak(audio),boostDb:20*Math.log10(gain/requested)});
        const soft = a.balancedDrumGain(buffer, requested * .5, .4, piece, config.id);
        if (!(soft < gain)) throw new Error('Soft articulation lost: ' + kit);
      }
      return results;
    });
    for (const row of rendered) {
      // Timekeeping cymbals now sit below the backbeat; still reject silence.
      const minimumRms = row.kit && !['hat', 'pedalhat'].includes(row.piece) ? .025 : .015;
      assert.ok(row.rms > minimumRms, JSON.stringify(row));
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
      assert.equal(await page.$eval('#keySizeModal', modal => modal.classList.contains('hidden')), true);
      const check = async (name, action) => {
        await pause(200);
        await page.evaluate(() => { audioAudit.sfx = 0; audioAudit.instrument = 0; window.sampledDrumInputs = []; });
        await action();
        await page.waitForFunction(() => audioAudit.instrument > 0);
        await pause(200);
        const audit = await page.evaluate(() => ({...audioAudit,drumInputs:window.sampledDrumInputs}));
        assert.equal(audit.sfx, 0, name);
        console.log(`${touch ? 'touch' : 'desktop'} ${name}: instrument=${audit.instrument}, shared effects=${audit.sfx}`);
        return audit;
      };
      await press('[data-family="drums"]');
      const demoToolbar = await page.evaluate(() => {
        const toolbar = document.querySelector('.play-toolbar');
        const button = document.querySelector('#drumDemoButton');
        return { left: button.getBoundingClientRect().left - toolbar.getBoundingClientRect().left, text: toolbar.textContent };
      });
      assert.ok(demoToolbar.left >= 0 && demoToolbar.left < 20, 'Demo button stays at the left edge');
      assert.doesNotMatch(demoToolbar.text, /BPM/);
      const pointerHit = await check('drum kick', () => press('[data-drum="kick"]'));
      const keyHit = await check('computer keyboard', () => page.keyboard.press('a'));
      assert.equal(pointerHit.drumInputs[0].velocity,keyHit.drumInputs[0].velocity,'Mouse/touch pads must not be quieter than keyboard hits');
      for (const piece of ['snare','ride','crash']) {
        const hit = await check('drum '+piece, () => press('[data-drum="'+piece+'"]'));
        assert.equal(hit.drumInputs[0].velocity,keyHit.drumInputs[0].velocity,'Consistent tap strength across pads');
      }
      if (!touch) {
        await page.evaluate(() => {
          [...document.querySelectorAll('#modelChooser button b')].find(label => label.textContent === 'Funk Kit').closest('button').click();
          window.sampledDrumInputs = [];
        });
        await press('#drumDemoButton');
        await page.waitForFunction(() => document.querySelector('[data-drum="crash"]').classList.contains('demo-hit'));
        const hits = await page.evaluate(() => window.sampledDrumInputs);
        assert.deepEqual(hits.slice(0, 2).map(hit => hit.id), ['kick', 'hat']);
        assert.ok(hits.filter(hit => hit.id === 'ghost' && hit.velocity < .5).length >= 12);
        assert.deepEqual(hits.slice(-4).map(hit => hit.id), ['kick', 'pedalhat', 'kick', 'crash']);
        assert.ok(Math.abs(hits.at(-1).time - hits[0].time - 16 * 60000 / 104) < 250);
        await page.waitForFunction(() => document.querySelector('#drumDemoLabel').textContent === '시범 연주');
        assert.equal(await page.$$('.demo-hit').then(pads => pads.length), 0);
        await press('#drumDemoButton');
        await press('[data-family="korean"]');
        const stoppedAt = await page.evaluate(() => window.sampledDrumInputs.length);
        await pause(700);
        assert.equal(await page.evaluate(() => window.sampledDrumInputs.length), stoppedAt);
        assert.equal(await page.$eval('#drumDemoButton', button => button.classList.contains('hidden')), true);
      }
      await press('[data-family="korean"]');
      await press('[data-korean-room="folk"]');
      await check('Korean percussion', () => press('#drumPads button'));
      const janggu = touch ? 'janggu-samul' : 'janggu-sanjo';
      await page.evaluate(id => window.playbackTest.selectModel(id), janggu);
      assert.equal(await page.$('#jangguDemoSelect'), null);
      const jangguDemoSelector = touch ? '[data-janggu-demo="1"]' : '[data-janggu-demo="2"]';
      await page.evaluate(() => { window.sampledDrumInputs = []; });
      if (touch) await press(jangguDemoSelector);
      else {
        await page.focus(jangguDemoSelector);
        await page.keyboard.press('Space');
      }
      await page.waitForFunction(() => document.querySelector('#jangguDemoCue').textContent === '덩'
        && document.querySelector('.drum-pad.demo-hit'));
      const firstJangguHit = await page.evaluate(() => window.sampledDrumInputs[0].id);
      assert.equal(firstJangguHit, touch ? 'compound' : 'low-high-open');
      if (touch) {
        await press('[data-janggu-demo="0"]');
        assert.equal(await page.$eval(jangguDemoSelector, button => button.getAttribute('aria-pressed')), 'false');
        await press('[data-janggu-demo="0"]');
        assert.equal(await page.$eval('#jangguDemoCue', element => element.textContent), '');
      } else {
        await page.waitForFunction(() => document.querySelector('#drumDemoLabel').textContent === '시범 연주');
        const strokes = await page.evaluate(() => window.sampledDrumInputs.map(hit => hit.id));
        assert.equal(strokes.length, 16);
        assert.equal(strokes.filter(id => id === 'low-high-bounce').length, 4);
        assert.deepEqual(strokes.slice(-2), ['low-open', 'low-high-bounce']);
      }
      await press('[data-family="guitar"]');
      await press('[data-guitar-mode="chords"]');
      await page.evaluate(() => { window.bassDemoHits = []; });
      await check('guitar chord', () => press('#chordPads button'));
      assert.deepEqual(await page.evaluate(() => window.bassDemoHits.map(hit => hit.midi)), [48,55,60]);
      await check('guitar strum', () => press('[data-strum="down"]'));
      await page.select('#guitarKeySelect', 'major:D');
      assert.deepEqual(await page.$$eval('#chordPads button b', labels => labels.map(label => label.textContent)), ['D5','E5','F♯5','G5','A5','B5']);
      await press('#guitarPadPlay');
      await page.evaluate(() => { audioAudit.instrument = 0; });
      await press('#chordPads button:nth-child(3)');
      assert.equal(await page.$eval('#guitarSelectedChord', label => label.textContent), 'F♯5');
      assert.equal(await page.evaluate(() => audioAudit.instrument), 0);
      await check('selected chord strum', () => press('[data-strum="up"]'));
      if (!touch) {
        await page.focus('#chordPads button:nth-child(3)');
        await page.keyboard.press('5');
        assert.equal(await page.$eval('#guitarSelectedChord', label => label.textContent), 'A5');
        await check('keyboard strum', () => page.keyboard.press('ArrowDown'));
        const zone = await page.$('#guitarStrumZone');
        await zone.evaluate(element => element.scrollIntoView({block:'center'}));
        const box = await zone.boundingBox();
        await check('upward swipe strum', async () => {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height - 7);
          await page.mouse.down();
          await page.mouse.move(box.x + box.width / 2, box.y + 7, {steps: 12});
          await page.mouse.up();
        });
        assert.match(await page.$eval('#noteReadout', label => label.textContent), /A5 · 업/);
      }
      await page.evaluate(() => { window.bassDemoHits = []; });
      await press('#guitarDemoButton');
      await page.waitForFunction(() => [50,55].every(midi => document.querySelector('.key[data-midi="' + midi + '"].demo-hit')));
      assert.equal(await page.$('#soundPresetButtons'), null);
      assert.equal(await page.$eval('#keyboardViewport', viewport => viewport.classList.contains('hidden')), false);
      const firstDyad = await page.evaluate(() => window.bassDemoHits.slice(0, 2));
      assert.deepEqual(firstDyad.map(hit => hit.midi), [50,55]);
      assert.ok(firstDyad.every(hit => hit.sampleSet === 'guitar-cubase-sc'));
      assert.ok(Number.isFinite(firstDyad[0].when));
      assert.equal(firstDyad[0].when, firstDyad[1].when);
      if (touch) {
        await press('#guitarDemoButton');
        assert.equal(await page.$eval('#guitarDemoButton', button => button.getAttribute('aria-pressed')), 'false');
      } else {
        await page.waitForFunction(() => document.querySelector('#guitarDemoButton').getAttribute('aria-pressed') === 'false');
        const dyads = await page.evaluate(() => window.bassDemoHits.map(hit => hit.midi));
        assert.equal(dyads.length, 24);
        assert.deepEqual(dyads.slice(-2), [50,55]);
      }
      await page.evaluate(() => window.playbackTest.selectModel('metal-seven'));
      await press('[data-guitar-mode="chords"]');
      await page.select('#guitarKeySelect', 'minor:B');
      assert.equal(await page.$eval('#guitarSelectedChord', label => label.textContent), 'B5');
      await page.evaluate(() => { window.bassDemoHits = []; });
      await check('seven-string B5', () => press('[data-strum="down"]'));
      assert.deepEqual(await page.evaluate(() => window.bassDemoHits.map(hit => hit.midi)), [35,42,47]);
      assert.equal(await page.$eval('#guitarDemoTitle', label => label.textContent), 'Enter Sandman');
      await page.evaluate(() => { window.bassDemoHits = []; });
      await press('#guitarDemoButton');
      await page.waitForFunction(() => [40,47].every(midi => document.querySelector('.key[data-midi="' + midi + '"].demo-hit')));
      const opening = await page.evaluate(() => window.bassDemoHits.slice(0, 2));
      assert.deepEqual(opening.map(hit => hit.midi), [40,47]);
      assert.ok(opening.every(hit => hit.sampleSet === 'guitar-cubase-hellrazer'));
      assert.equal(opening[0].when, opening[1].when);
      if (!touch) {
        await page.waitForFunction(() => document.querySelector('#guitarDemoButton').getAttribute('aria-pressed') === 'false');
        const mainRiff = await page.evaluate(() => window.bassDemoHits);
        assert.equal(mainRiff.length, 38);
        assert.deepEqual(mainRiff.slice(-2).map(hit => hit.midi), [40,47]);
        assert.ok(Math.abs(mainRiff.at(-1).time - mainRiff[0].time - 15.5 * 60000 / 123) < 250);
      }
      await page.evaluate(() => window.playbackTest.selectModel('hollow-jazz'));
      assert.equal(await page.$eval('#guitarDemoTitle', label => label.textContent), 'Autumn Leaves');
      await page.evaluate(() => { window.bassDemoHits = []; });
      await press('#guitarDemoButton');
      await page.waitForFunction(() => document.querySelector('.key[data-midi="59"].demo-hit'));
      assert.equal(await page.evaluate(() => window.bassDemoHits[0].sampleSet), 'guitar-cubase-sh');
      if (!touch) {
        await page.waitForFunction(() => document.querySelector('#guitarDemoButton').getAttribute('aria-pressed') === 'false');
        const theme = await page.evaluate(() => window.bassDemoHits);
        assert.deepEqual(theme.slice(0,7).map(hit => hit.midi), [59,61,62,67,45,55,60]);
        assert.deepEqual(theme.slice(-4).map(hit => hit.midi), [59,40,55,62]);
        assert.ok(Math.abs(theme.at(-1).time - theme[0].time - 27 * 60000 / 112) < 250);
      }
      await page.evaluate(() => window.playbackTest.selectModel('dreadnought'));
      assert.equal(await page.$eval('#guitarDemoTitle', label => label.textContent), 'Hotel California');
      assert.equal(await page.$$('#chordPads button').then(pads => pads.length), 7);
      await page.evaluate(() => { window.bassDemoHits = []; });
      await press('#guitarDemoButton');
      await page.waitForFunction(() => window.bassDemoHits.length >= 3 && document.querySelector('.key[data-midi="59"].demo-hit'));
      const pickup = await page.evaluate(() => window.bassDemoHits.slice(0, 3));
      assert.deepEqual(pickup.map(hit => hit.midi), [47,54,59]);
      assert.ok(pickup.every(hit => hit.sampleSet === 'guitar-cubase-t'));
      if (!touch) {
        await page.waitForFunction(() => document.querySelector('#guitarDemoButton').getAttribute('aria-pressed') === 'false');
        const acoustic = await page.evaluate(() => window.bassDemoHits);
        assert.deepEqual(acoustic.slice(4, 8).map(hit => hit.midi), [66,62,59,54]);
        assert.ok(acoustic[4].time < acoustic[7].time);
        assert.equal(acoustic.length,64);
        assert.equal(acoustic.at(-1).midi,49);
      }
      await page.evaluate(() => window.playbackTest.selectModel('classical-guitar'));
      assert.equal(await page.$eval('#guitarDemoTitle', label => label.textContent), 'Shape of My Heart · 레옹');
      await page.evaluate(() => { window.bassDemoHits = []; });
      await press('#guitarDemoButton');
      await page.waitForFunction(() => document.querySelector('.key[data-midi="69"].demo-hit'));
      assert.equal(await page.evaluate(() => window.bassDemoHits[0].sampleSet), 'guitar-cubase-l');
      await press('#guitarDemoButton');
      assert.equal(await page.$$('.key.demo-hit').then(keys => keys.length), 0);
      await press('[data-family="bass"]');
      await page.evaluate(() => { window.bassDemoHits = []; });
      assert.equal(await page.$eval('[data-bass-demo="slap"] b', label => label.textContent), "Can't Stop");
      await press('[data-bass-demo="slap"]');
      await page.waitForFunction(() => document.querySelector('.key[data-midi="40"].demo-hit'));
      assert.equal(await page.$eval('#articulationButtons [aria-pressed="true"]', button => button.textContent), '슬랩');
      if (!touch) {
        await page.waitForFunction(() => document.querySelector('[data-bass-demo="slap"]').getAttribute('aria-pressed') === 'false');
        const slap = await page.evaluate(() => window.bassDemoHits);
        assert.equal(slap.length, 47);
        assert.deepEqual(slap.slice(0, 3).map(hit => hit.midi), [40, 50, 52]);
        assert.deepEqual([0, 12, 24, 35, 46].map(index => slap[index].midi), [40, 38, 35, 36, 40]);
        assert.ok(Math.abs(slap.at(-1).time - slap[0].time - 16 * 60000 / 91) < 250);
        assert.ok(slap.every(hit => hit.midi >= 33 && hit.midi <= 52));
        assert.ok(slap.every(hit => hit.sampleSet.endsWith('-slap')));
      }
      await page.evaluate(() => { window.bassDemoHits = []; });
      await press('[data-bass-demo="finger"]');
      await page.waitForFunction(() => document.querySelector('.key[data-midi="42"].demo-hit'));
      const finger = await page.evaluate(() => window.bassDemoHits.find(hit => hit.sampleSet.endsWith('-finger')));
      assert.equal(finger.midi, 42);
      await press('[data-family="keyboard"]');
      assert.equal(await page.$eval('#bassDemoControls', controls => controls.classList.contains('hidden')), true);
      assert.equal(await page.$$('.key.demo-hit').then(keys => keys.length), 0);
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
