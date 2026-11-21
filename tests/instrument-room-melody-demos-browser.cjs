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
        'window.demoTest = { state, selectModel }; document.addEventListener("DOMContentLoaded", init);');
      data = data.replace('function startConcertGrandSample(midi, velocity, anchor, buffer, sampleSet, when) {',
        'function startConcertGrandSample(midi, velocity, anchor, buffer, sampleSet, when) { window.demoHits.push({midi, anchor, sampleSet, time:performance.now()});');
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
      await page.evaluate(() => {
        document.querySelector('[data-family="percussion"]').click();
        demoTest.selectModel('glockenspiel');
      });
      const layout = await page.evaluate(() => {
        const controls = document.querySelector('#melodyDemoControls');
        const button = document.querySelector('#melodyDemoButton').getBoundingClientRect();
        const toolbar = controls.parentElement.getBoundingClientRect();
        const select = document.querySelector('#melodyDemoSelect').getBoundingClientRect();
        return { left: button.left - toolbar.left, fits: select.right <= toolbar.right, text: controls.textContent };
      });
      assert.ok(layout.left >= 0 && layout.left < 20);
      assert.ok(layout.fits);
      assert.doesNotMatch(layout.text, /BPM/);
      assert.deepEqual(await page.$$eval('#melodyDemoSelect option', options => options.map(option => option.textContent)), ['사탕요정의 춤', '마술피리 · 마법의 종']);
      for (const song of ['0', '1']) {
        await page.select('#melodyDemoSelect', song);
        await page.evaluate(() => { window.demoHits = []; document.querySelector('#melodyDemoButton').click(); });
        await page.waitForFunction(() => document.querySelector('.key.demo-hit'));
        await page.waitForFunction(() => document.querySelector('#melodyDemoButton').getAttribute('aria-pressed') === 'false');
        const hits = await page.evaluate(() => demoHits);
        assert.ok(hits.every(hit => hit.sampleSet === 'glockenspiel' && hit.midi === hit.anchor && hit.midi >= 79 && hit.midi <= 95));
        assert.equal(hits[0].midi, song === '0' ? 91 : 84);
        assert.equal(hits.at(-1).midi, song === '0' ? 88 : 89);
        assert.equal(hits.length, song === '0' ? 21 : 24);
        assert.equal(await page.$$('.key.demo-hit').then(keys => keys.length), 0);
      }
      await page.evaluate(() => document.querySelector('#melodyDemoButton').click());
      await page.waitForFunction(() => document.querySelector('.key.demo-hit'));
      await page.select('#melodyDemoSelect', '0');
      assert.equal(await page.$eval('#melodyDemoButton', button => button.getAttribute('aria-pressed')), 'false');
      assert.equal(await page.$$('.key.demo-hit').then(keys => keys.length), 0);
      await page.evaluate(() => document.querySelector('#melodyDemoButton').click());
      await page.waitForFunction(() => document.querySelector('.key.demo-hit'));
      await page.evaluate(() => document.querySelector('[data-family="keyboard"]').click());
      assert.equal(await page.$eval('#melodyDemoControls', controls => controls.classList.contains('hidden')), true);
      assert.equal(await page.$$('.key.demo-hit').then(keys => keys.length), 0);
      for (const [model, title, firstNote, lastNote, count, length] of [
        ['cello', '백조', 67, 55, 20, 24 * 60000 / 80],
        ['violin', 'G선상의 아리아', 64, 60, 28, 16 * 60000 / 64]
      ]) {
        await page.evaluate(id => {
          document.querySelector('[data-family="strings"]').click();
          demoTest.selectModel(id);
          [...document.querySelectorAll('#classicalArticulationButtons button')]
            .find(button => button.textContent === '피치카토').click();
          window.demoHits = [];
        }, model);
        assert.equal(await page.$eval('#melodyDemoSelect option', option => option.textContent), title);
        await page.evaluate(() => document.querySelector('#melodyDemoButton').click());
        await page.waitForFunction(midi => document.querySelector('.key[data-midi="' + midi + '"].demo-hit'), {}, firstNote);
        assert.equal(await page.$eval('#classicalArticulationButtons [aria-pressed="true"]', button => button.textContent), '활긋기');
        assert.equal(await page.evaluate(() => demoHits[0].sampleSet), model);
        await new Promise(resolve => setTimeout(resolve, 1400));
        const sustained = await page.evaluate(id => {
          const voice = [...demoTest.state.pianoVoices.values()].find(voice => voice.sampleSet === id && !voice.released);
          return Boolean(voice && voice.source.loop && document.querySelector('.key.demo-hit'));
        }, model);
        assert.ok(sustained, title + ' holds a recorded bowed note');
        if (width > 500) {
          await page.waitForFunction(() => document.querySelector('#melodyDemoButton').getAttribute('aria-pressed') === 'false');
          const hits = await page.evaluate(() => demoHits);
          assert.equal(hits.length, count);
          assert.equal(hits.at(-1).midi, lastNote);
          assert.ok(hits.every(hit => hit.sampleSet === model && hit.anchor === hit.midi));
          assert.ok(Math.abs(hits.at(-1).time - hits[0].time - length) < 250);
        } else {
          await page.evaluate(() => document.querySelector('#melodyDemoButton').click());
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
