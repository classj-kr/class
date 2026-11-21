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
  fs.readFile(file, (error, data) => {
    if (error) return res.writeHead(404).end();
    if (file.endsWith('instrument-room' + path.sep + 'app.js')) {
      data = data.toString().replace('document.addEventListener("DOMContentLoaded", init);',
        'window.demoTest = { state, selectModel, loadConcertGrandSample }; document.addEventListener("DOMContentLoaded", init);');
      data = data.replace('function startConcertGrandSample(midi, velocity, anchor, buffer, sampleSet, when) {',
        'function startConcertGrandSample(midi, velocity, anchor, buffer, sampleSet, when) { window.demoHits.push({midi, anchor, sampleSet, time:(when ?? state.audioContext.currentTime)*1000});');
    }
    const type = { '.js': 'text/javascript', '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.ogg': 'audio/ogg', '.webp': 'image/webp' }[path.extname(file)];
    res.writeHead(200, { 'Content-Type': type || 'application/octet-stream' }).end(data);
  });
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
      headless: true
    });
    for (const width of [1366, 390]) {
      const page = await browser.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.setViewport({ width, height: 900, isMobile: width < 500, hasTouch: width < 500 });
      await page.evaluateOnNewDocument(() => { window.demoHits = []; });
      await page.goto('http://127.0.0.1:' + server.address().port + '/learning/arts/instrument-room/', { waitUntil: 'networkidle0' });
      if (width > 500) {
        // Check decoded audio, not only MIDI labels: mislabeled cello exports
        // previously passed all keyboard/demo assertions while sounding -12.
        const pitches = await page.evaluate(async () => {
          function fundamental(buffer) {
            const samples = buffer.getChannelData(0);
            const stride = Math.max(1, Math.floor(buffer.sampleRate / 12000));
            const rate = buffer.sampleRate / stride;
            const start = Math.floor(buffer.sampleRate * .45);
            const window = 2048;
            const limit = Math.ceil(rate / 50);
            const difference = new Float64Array(limit + 1);
            let sum = 0;
            for (let lag = 1; lag <= limit; lag++) {
              let square = 0;
              for (let i = 0; i < window; i++) {
                const delta = samples[start + i * stride] - samples[start + (i + lag) * stride];
                square += delta * delta;
              }
              sum += square;
              difference[lag] = sum ? square * lag / sum : 1;
            }
            for (let lag = Math.floor(rate / 1500); lag < limit; lag++) {
              if (difference[lag] >= .15) continue;
              while (lag + 1 < limit && difference[lag + 1] < difference[lag]) lag++;
              const left = difference[lag - 1], center = difference[lag], right = difference[lag + 1];
              const interpolated = lag + (left - right) / (2 * (left - 2 * center + right));
              return rate / interpolated;
            }
            throw new Error('No stable fundamental found');
          }
          document.querySelector('[data-family="strings"]').click();
          const results = [];
          for (const [model, articulation, midi] of [
            ['cello', 'sustain', 48], ['cello', 'sustain', 55],
            ['cello', 'sustain', 67], ['cello', 'sustain', 79],
            ['cello', 'pizzicato', 67], ['violin', 'sustain', 64]
          ]) {
            demoTest.selectModel(model);
            demoTest.state.articulation = articulation;
            const sample = await demoTest.loadConcertGrandSample(midi);
            results.push({ model, articulation, midi, hz: fundamental(sample.buffer) });
          }
          return results;
        });
        for (const pitch of pitches) {
          const expected = 440 * 2 ** ((pitch.midi - 69) / 12);
          const cents = 1200 * Math.log2(pitch.hz / expected);
          assert.ok(Math.abs(cents) < 45, JSON.stringify({ ...pitch, cents }));
        }
        console.log('Decoded cello, cello pizzicato and violin fundamentals match their keys');
      }
      await page.evaluate(() => {
        document.querySelector('[data-family="percussion"]').click();
        demoTest.selectModel('glockenspiel');
      });
      const layout = await page.evaluate(() => {
        const controls = document.querySelector('#melodyDemoControls');
        const button = document.querySelector('#melodyDemoButtons button').getBoundingClientRect();
        const toolbar = controls.parentElement.getBoundingClientRect();
        const buttons = [...document.querySelectorAll('#melodyDemoButtons button')].map(el => el.getBoundingClientRect());
        return { left: controls.getBoundingClientRect().left - toolbar.left, fits: buttons.every(rect => rect.right <= toolbar.right && rect.left >= toolbar.left), text: controls.textContent };
      });
      assert.ok(layout.left >= 0 && layout.left < 20);
      assert.ok(layout.fits);
      assert.doesNotMatch(layout.text, /BPM/);
      assert.deepEqual(await page.$$eval('#melodyDemoButtons button b', options => options.map(option => option.textContent)), ['사탕요정의 춤', '마술피리 · 마법의 종']);
      for (const song of ['0', '1']) {
        await page.evaluate(index => { window.demoHits = []; document.querySelector('[data-melody-demo="' + index + '"]').click(); }, song);
        await page.waitForFunction(() => document.querySelector('.key.demo-hit'));
        await page.waitForFunction(() => !document.querySelector('#melodyDemoButtons [aria-pressed="true"]'));
        const hits = await page.evaluate(() => demoHits);
        assert.ok(hits.every(hit => hit.sampleSet === 'glockenspiel' && hit.midi === hit.anchor && hit.midi >= 79 && hit.midi <= 95));
        assert.equal(hits[0].midi, song === '0' ? 91 : 84);
        assert.equal(hits.at(-1).midi, song === '0' ? 88 : 89);
        assert.equal(hits.length, song === '0' ? 21 : 24);
        assert.equal(await page.$$('.key.demo-hit').then(keys => keys.length), 0);
      }
      await page.evaluate(() => document.querySelector('#melodyDemoButtons button').click());
      await page.waitForFunction(() => document.querySelector('.key.demo-hit'));
      await page.evaluate(() => document.querySelector('[data-melody-demo="1"]').click());
      assert.equal(await page.$eval('[data-melody-demo="0"]', button => button.getAttribute('aria-pressed')), 'false');
      assert.equal(await page.$$eval('#melodyDemoButtons [aria-pressed="true"]', buttons => buttons.length), 1);
      await page.evaluate(() => document.querySelector('[data-melody-demo="1"]').click());
      assert.equal(await page.$$('.key.demo-hit').then(keys => keys.length), 0);
      await page.evaluate(() => document.querySelector('#melodyDemoButtons button').click());
      await page.waitForFunction(() => document.querySelector('.key.demo-hit'));
      await page.evaluate(() => document.querySelector('[data-family="bass"]').click());
      assert.equal(await page.$eval('#melodyDemoControls', controls => controls.classList.contains('hidden')), true);
      assert.equal(await page.$$('.key.demo-hit').then(keys => keys.length), 0);
      for (const [model, title, firstNote, lastNote, count, length] of [
        ['cello', '백조', 67, 67, 19, 18 * 60000 / 80],
        ['violin', '비발디 사계 · 봄', 76, 76, 98, 50.5 * 60000 / 110]
      ]) {
        await page.evaluate(id => {
          document.querySelector('[data-family="strings"]').click();
          demoTest.selectModel(id);
          [...document.querySelectorAll('#classicalArticulationButtons button')]
            .find(button => button.textContent === '피치카토').click();
          window.demoHits = [];
        }, model);
        assert.equal(await page.$eval('#melodyDemoButtons button b', option => option.textContent), title);
        await page.evaluate(() => document.querySelector('#melodyDemoButtons button').click());
        await page.waitForFunction(midi => document.querySelector('.key[data-midi="' + midi + '"].demo-hit'), {}, firstNote);
        assert.equal(await page.$eval('#classicalArticulationButtons [aria-pressed="true"]', button => button.textContent), '활긋기');
        assert.equal(await page.evaluate(() => demoHits[0].sampleSet), model);
        await new Promise(resolve => setTimeout(resolve, 1400));
        const sustained = await page.evaluate(id => {
          const voice = [...demoTest.state.pianoReleaseVoices].find(voice => voice.sampleSet === id && voice.heldTone);
          return Boolean(voice && voice.source.loop && voice.source.loopEnd <= 3.805 && voice.source.loopEnd > voice.source.loopStart + .25 && document.querySelector('.key.demo-hit'));
        }, model);
        assert.ok(sustained, title + ' holds a recorded bowed note');
        if (width > 500) {
          await page.waitForFunction(() => !document.querySelector('#melodyDemoButtons [aria-pressed="true"]'));
          const hits = await page.evaluate(() => demoHits);
          assert.equal(hits.length, count);
          assert.equal(hits.at(-1).midi, lastNote);
          assert.ok(hits.every(hit => hit.sampleSet === model && hit.anchor === hit.midi));
          assert.ok(Math.abs(hits.at(-1).time - hits[0].time - length) < 250);
          if (model === 'violin') {
            const score = require('./fixtures/instrument-classical-excerpts.json').violin;
            hits.forEach((hit, index) => assert.ok(Math.abs(hit.time - hits[0].time - score[index][0] * 60000 / 110) < 1));
          }
        } else {
          await page.evaluate(() => document.querySelector('#melodyDemoButtons button').click());
        }
        assert.equal(await page.$$('.key.demo-hit').then(keys => keys.length), 0);
      }
      assert.deepEqual(errors, []);
      console.log(width + 'px: glockenspiel and bowed melodies, recorded pitches, left alignment, switching and cleanup passed');
      await page.close();
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
