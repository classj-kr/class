// Browser/viewport coverage, not a substitute for testing physical ChromeOS/iOS devices.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const {chromium, webkit} = require('playwright');
const root = path.resolve(__dirname, '..');
const output = path.join(root, "outputs/qa/ear-training-devices");
fs.mkdirSync(output, {recursive:true});
const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (pathname.startsWith('/api/me/storage/')) return res.writeHead(200, {'Content-Type':'application/json'}).end('{"items":{}}');
  let file = path.resolve(root, '.' + pathname);
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  fs.readFile(file, (error, data) => {
    if (error) return res.writeHead(404).end();
    const type = {'.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.ogg':'audio/ogg', '.webp':'image/webp', '.png':'image/png'}[path.extname(file)];
    res.writeHead(200, {'Content-Type':type || 'application/octet-stream'}).end(data);
  });
});
const profiles = [
  {name:'chrome-desktop', engine:'chromium', width:1920, height:1080},
  {name:'chrome-1366-short', engine:'chromium', width:1366, height:620},
  {name:'chrome-125-percent', engine:'chromium', width:1093, height:496, scale:1.25},
  {name:'chrome-1024-touch', engine:'chromium', width:1024, height:600, touch:true},
  {name:'chrome-tablet', engine:'chromium', width:1280, height:800, scale:2, touch:true},
  {name:'chrome-phone', engine:'chromium', width:390, height:844, scale:3, touch:true, mobile:true},
  {name:'chrome-phone-landscape', engine:'chromium', width:844, height:390, scale:3, touch:true, mobile:true},
  {name:'webkit-tablet', engine:'webkit', width:1024, height:768, scale:2, touch:true},
  {name:'webkit-tablet-portrait', engine:'webkit', width:768, height:1024, scale:2, touch:true},
  {name:'webkit-phone', engine:'webkit', width:390, height:844, scale:3, touch:true, mobile:true}
];
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browsers = {}, report = [];
  try {
    browsers.chromium = await chromium.launch({executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless:true});
    browsers.webkit = await webkit.launch({headless:true});
    for (const profile of profiles) {
      if (process.env.DEVICE_PROFILE && profile.name !== process.env.DEVICE_PROFILE) continue;
      const context = await browsers[profile.engine].newContext({
        viewport:{width:profile.width, height:profile.height}, deviceScaleFactor:profile.scale || 1,
        hasTouch:!!profile.touch, isMobile:!!profile.mobile
      });
      // Simulate an environment with no usable music font or font downloads.
      await context.route('**/*', route => route.request().resourceType() === 'font' ? route.abort() : route.continue());
      await context.addInitScript(() => {
        const measure = CanvasRenderingContext2D.prototype.measureText;
        CanvasRenderingContext2D.prototype.measureText = function (text) {
          if (/[\u{1D100}-\u{1D1FF}♯♭♮]/u.test(text)) throw new Error('Music font metrics unavailable');
          return measure.call(this, text);
        };
      });
      const page = await context.newPage(), errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('response', response => { if (response.status() >= 400) errors.push(response.status() + ' ' + response.url()); });
      await page.goto('http://127.0.0.1:' + server.address().port + '/learning/arts/music-theory/ear-training/', {waitUntil:'networkidle'});
      await page.locator('#courseList button').first().click();
      assert.ok(await page.locator('.row-act.is-read path[data-glyph="1d11e"]').count(), 'Read icons need vector clefs');
      await page.locator('.row-act.is-keys').first().click();
      await page.locator('#staff .sheet').waitFor();
      const layout = await page.evaluate(() => {
        const rect = selector => { const r = document.querySelector(selector).getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}; };
        return {viewport:[innerWidth,innerHeight],pageWidth:document.documentElement.scrollWidth, staff:rect('#staff'), sheet:rect('#staff .sheet'), keyboard:rect('#pianoKeys'), replay:rect('#replayButton'), clef:rect('#staff .sheet-clef')};
      });
      assert.ok(layout.pageWidth <= layout.viewport[0] + 1, profile.name + ': page overflow');
      if (layout.viewport[0] !== profile.width) console.log(await page.evaluate(width => [...document.querySelectorAll('body *')].filter(el => {const r=el.getBoundingClientRect();return r.width && r.right > width && getComputedStyle(el).display !== 'none';}).map(el => ({tag:el.tagName,id:el.id,cls:el.getAttribute('class'),right:el.getBoundingClientRect().right})), profile.width));
      assert.equal(layout.viewport[0], profile.width, profile.name + ': mobile viewport expanded by overflow');
      assert.ok(layout.clef.width > 10 && layout.clef.height > 40, profile.name + ': invisible clef');
      assert.ok(layout.sheet.width <= layout.staff.width, profile.name + ': clipped staff');
      assert.ok(layout.replay.height >= 44, profile.name + ': replay touch target');
      assert.ok(layout.keyboard.bottom <= layout.viewport[1], profile.name + ': keyboard below viewport');
      await page.screenshot({path:path.join(output,profile.name + '-drill.png'),fullPage:true});
      // Trigger a playable answer through the actual input surface.
      await page.evaluate(() => {
        window.directNotes = []; window.notesBeforeRelease = 0;
        const play = PianoEngine.playMidi;
        PianoEngine.playMidi = function(midi,options) { directNotes.push(midi); return play.call(this,midi,options); };
        document.addEventListener('pointerup', () => { window.notesBeforeRelease = directNotes.length; }, {capture:true,once:true});
      });
      const given = page.locator('#pianoKeys .is-given').first();
      await given.focus();
      await page.keyboard.press('Enter');
      await page.keyboard.press('Space');
      assert.equal(await page.evaluate(() => directNotes.length),2,profile.name + ': focused keys retain Enter / Space');
      await page.evaluate(() => { directNotes.length = 0; });
      const key = page.locator('#pianoKeys button').first();
      await key.scrollIntoViewIfNeeded();
      if (profile.touch) await key.tap(); else await key.click();
      assert.deepEqual(await page.evaluate(() => ({count:directNotes.length,beforeRelease:notesBeforeRelease})),{count:1,beforeRelease:1},profile.name + ': direct note exactly once, before release');

      const shapes = await page.evaluate(() => {
        const N = window.Notation, host = document.createElement('section');
        host.id = 'notation-device-gallery';
        host.style.cssText = 'background:#f8f6f0;color:#1b2029;padding:20px;display:grid;gap:20px;position:relative;z-index:100';
        const notes = [-2,-1,0,1,2].map((accidental,i) => ({notes:[N.spell(30+i,accidental)]}));
        host.append(N.render(notes, {keySignature:{count:3,sharp:true}}));
        host.append(N.render([{notes:[N.natural(21),N.natural(28),N.spell(30,1),N.natural(32)]}], {grand:true,keySignature:{count:3,sharp:false}}));
        for (const value of ['w','h','q','e','s']) host.append(window.RhythmNotation.render([{v:value,rest:true}], {}));
        document.body.append(host);
        const nodes = [...host.querySelectorAll('[data-glyph]')];
        return nodes.map(node => { const r=node.getBoundingClientRect(); return {tag:node.tagName,glyph:node.dataset.glyph,width:r.width,height:r.height}; });
      });
      for (const glyph of ['1d11e','1d122','266f','266d','266e','1d12a','1d13b','1d13c','1d13d','1d13e','1d13f']) {
        assert.ok(shapes.some(shape => shape.glyph === glyph && shape.tag === 'path' && shape.width > 0 && shape.height > 0), profile.name + ': missing ' + glyph);
      }
      await page.locator('#notation-device-gallery').screenshot({path:path.join(output,profile.name + '-notation.png')});
      assert.deepEqual(errors, [], profile.name);
      report.push({profile:profile.name,layout,glyphs:shapes.length,errors});
      console.log(profile.name, 'passed', JSON.stringify(layout));
      await context.close();
    }
    fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));
  } finally {
    for (const browser of Object.values(browsers)) await browser.close();
    server.close();
  }
})().catch(error => {console.error(error);process.exitCode=1;});
