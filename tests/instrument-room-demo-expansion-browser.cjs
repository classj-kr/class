const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const puppeteer = require('puppeteer-core');
const screenshotWebp = require('./screenshot-webp.cjs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'outputs/qa/instrument-demos');
fs.mkdirSync(output, {recursive:true});
const server = http.createServer((req, res) => {
  let file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  fs.readFile(file, (error, data) => {
    if (error) return res.writeHead(404).end();
    if (file.endsWith('instrument-room' + path.sep + 'app.js')) {
      data = data.toString().replace('document.addEventListener("DOMContentLoaded", init);',
        'window.audit = {state, MODEL_LIBRARY, MELODY_DEMOS, selectFamily, selectModel, sampledPianoConfig}; document.addEventListener("DOMContentLoaded", init);');
      data = data.replace('function startConcertGrandSample(midi, velocity, anchor, buffer, sampleSet, when) {',
        'function startConcertGrandSample(midi, velocity, anchor, buffer, sampleSet, when) { window.hits.push({midi,anchor,sampleSet,time:performance.now()});');
    }
    res.writeHead(200, {'Content-Type':{'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.ogg':'audio/ogg','.flac':'audio/flac','.webp':'image/webp'}[path.extname(file)] || 'application/octet-stream'}).end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
    for (const width of [1366,390]) {
      const page = await browser.newPage(), errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.setViewport({width,height:900,isMobile:width===390,hasTouch:width===390});
      await page.evaluateOnNewDocument(() => {window.hits=[];});
      await page.goto('http://127.0.0.1:' + server.address().port + '/learning/arts/instrument-room/',{waitUntil:'networkidle0'});
      if (await page.$eval('#keySizeModal', modal => !modal.classList.contains('hidden'))) {
        await page.click('.key-size-close');
      }
      const cases = await page.evaluate(() => {
        const list = [];
        for (const [id,demos] of Object.entries(INSTRUMENT_MELODY_DEMOS)) {
          const family = Object.keys(audit.MODEL_LIBRARY).find(f => audit.MODEL_LIBRARY[f].some(m => m.id === id));
          audit.selectFamily(family); audit.selectModel(id);
          const config = audit.sampledPianoConfig();
          for (const [index,demo] of demos.entries()) {
            const closing = demo.notes.at(-1);
            if (closing[0] !== (id.includes('bassoon') ? 6 : index === 1 ? 12 : 16)) throw new Error(id + ': wrong closing beat');
            for (const [beat,midis,velocity,duration] of demo.notes) {
              if (beat < 0 || duration <= 0 || duration > demo.endBeat || velocity <= 0 || velocity > 1) throw new Error(id + ': invalid event');
              for (const midi of midis) if (midi < config.min || midi > config.max || !Number.isInteger(midi)) throw new Error(id + ': outside recorded range: ' + midi);
            }
            list.push({family,id,index,title:demo.title,count:demo.notes.length,first:demo.notes[0][1][0],last:closing[1][0],bpm:demo.bpm,closingBeat:closing[0]});
          }
        }
        return list;
      });
      assert.equal(cases.length,13);
      for (const row of cases) {
        await page.evaluate(({family,id}) => { audit.selectFamily(family);audit.selectModel(id);window.hits=[]; },row);
        const selector = '[data-melody-demo="' + row.index + '"]';
        assert.equal(await page.$eval(selector+' b',b=>b.textContent),row.title);
        await page.click(selector);
        await page.waitForFunction(() => hits.length > 0);
        const first = await page.evaluate(() => hits[0]);
        assert.equal(first.midi,row.first); assert.equal(first.anchor,row.first); assert.equal(first.sampleSet,row.id);
        if (width === 1366 && ['clavinet','oboe','english-horn','bassoon'].includes(row.id)) {
          await page.waitForFunction(() => !document.querySelector('#melodyDemoButtons [aria-pressed="true"]'),{timeout:30000});
          const hits = await page.evaluate(() => window.hits);
          assert.equal(hits.length,row.count,row.id);
          assert.equal(hits.at(-1).midi,row.last);
          assert.ok(hits.every(hit => hit.sampleSet === row.id && hit.anchor === hit.midi));
          assert.ok(Math.abs(hits.at(-1).time - hits[0].time - row.closingBeat*60000/row.bpm) < 200,row.id+': fifth-bar downbeat');
        } else await page.click(selector);
        assert.equal(await page.$$eval('.key.demo-hit',keys=>keys.length),0);
      }
      // All current sampled models must expose no disconnected sound sliders.
      const bad = await page.evaluate(() => {
        const bad=[];
        for (const family of Object.keys(audit.MODEL_LIBRARY)) {
          audit.selectFamily(family);
          for (const model of audit.MODEL_LIBRARY[family]) {
            if (family === 'korean') continue; // Korean subrooms select their own visible models.
            audit.selectModel(model.id);
            for (const slider of document.querySelectorAll('.control-panel input[type="range"]')) {
              if (slider.getClientRects().length) bad.push(model.id+'/'+slider.id);
            }
          }
        }
        return bad;
      });
      assert.deepEqual(bad,[]);
      await page.evaluate(() => {audit.selectFamily('percussion');audit.selectModel('timpani');});
      await screenshotWebp(page,{path:path.join(output,'timpani-controls-'+width+'.webp')});
      await page.evaluate(() => {audit.selectFamily('woodwind');audit.selectModel('recorder-soprano');});
      const fits=await page.$$eval('#melodyDemoButtons button',buttons=>buttons.every(b=>{const r=b.getBoundingClientRect();return r.left>=0 && r.right<=innerWidth;}));
      assert.ok(fits);
      assert.equal(await page.$$('#melodyDemoControls select').then(x=>x.length),0);
      await screenshotWebp(page,{path:path.join(output,'recorder-buttons-'+width+'.webp')});
      assert.deepEqual(errors,[]);
      console.log(width+'px: 13 added demos use native samples; four primary excerpts finish on bar five; inactive sound sliders removed');
      await page.close();
    }
  } finally {
    await browser?.close(); await new Promise(resolve => server.close(resolve));
  }
})().catch(e=>{console.error(e);process.exitCode=1;});
