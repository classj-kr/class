// Real browser input and Web Audio scheduling checks; excludes hardware output latency.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium, webkit } = require('playwright');
const root = path.resolve(__dirname, '..');
const base = '/learning/arts/music-theory/ear-training/';
const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (pathname === '/fixture') return res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'}).end(`
    <meta name="viewport" content="width=device-width,initial-scale=1"><base href="${base}">
    <link rel="stylesheet" href="${base}styles.css">
    <main style="padding:12px;max-width:944px"><div id="keys"></div></main>
    <script src="${base}piano-engine.js"></script><script src="${base}keyboard.js"></script>
    <script>
      window.presses = []; window.atRelease = [];
      window.rebuild = function(low=60,high=83) {
        window.board = Keyboard.build(document.querySelector('#keys'),low,high,midi => {
          presses.push(midi); window.inputAt = performance.now();
          if (window.AudioContext || window.webkitAudioContext) PianoEngine.playMidi(midi,{volume:.13});
        });
      };
      document.addEventListener('pointerup',()=>atRelease.push(presses.length),true);
      rebuild();
    </script>`);
  const file = path.resolve(root, '.' + pathname);
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  fs.readFile(file, (error, data) => {
    if (error) return res.writeHead(404).end();
    const type = {'.js':'text/javascript','.css':'text/css','.ogg':'audio/ogg'}[path.extname(file)];
    res.writeHead(200, {'Content-Type': type || 'application/octet-stream'}).end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  const browsers = [];
  try {
    for (const engine of (process.env.EAR_TEST_BROWSERS || 'chromium,webkit').split(',')) {
      const browser = await (engine === 'chromium' ? chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}) : webkit.launch({headless:true}));
      browsers.push(browser);
      const context = await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
      await context.addInitScript(() => {
        window.starts = []; window.decoded = 0;
        if (!window.AudioContext || !window.AudioBufferSourceNode) return;
        for (const [type, proto] of [['sample',AudioBufferSourceNode.prototype],['synth',OscillatorNode.prototype]]) {
          const start = proto.start;
          proto.start = function(when,...rest) {
            window.starts.push({type,delayMs:performance.now()-window.inputAt,lead:when-this.context.currentTime});
            return start.call(this,when,...rest);
          };
        }
        const decode = AudioContext.prototype.decodeAudioData;
        AudioContext.prototype.decodeAudioData = function(...args) {
          return decode.apply(this,args).then(buffer => { window.decoded++; return buffer; });
        };
      });
      const pending = [];
      await context.route('**/assets/piano/*.ogg', route => { pending.push(route); });
      const page = await context.newPage(), errors = [];
      page.on('pageerror',error => errors.push(error.message));
      await page.goto('http://127.0.0.1:' + server.address().port + '/fixture');
      const hasAudio = await page.evaluate(() => !!window.AudioContext && !!window.AudioBufferSourceNode);
      const key = page.locator('[data-midi="60"]');
      const box = await key.boundingBox();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height - 16);
      await page.mouse.down();
      let status = await page.evaluate(() => ({presses,starts,pressed:document.querySelector('[data-midi="60"]').classList.contains('is-pressed')}));
      assert.deepEqual(status.presses,[60],engine + ': must play before pointerup');
      assert.equal(status.pressed,true);
      if (hasAudio) {
        assert.equal(status.starts.length,3,engine + ': fallback must start while samples are pending; errors=' + JSON.stringify(errors));
        assert.ok(status.starts.every(s => s.lead <= .01 && s.delayMs < 100),engine + ': no scheduling or download delay');
      }
      const coldDelay = hasAudio ? Math.max(...status.starts.map(s => s.delayMs)) : null;
      await page.mouse.up();
      assert.equal(await page.evaluate(() => presses.length),1,'click must not duplicate pointerdown');
      assert.equal(await key.evaluate(el => el.classList.contains('is-pressed')),false);

      // One ready sample must play even while the other eight downloads hang.
      if (hasAudio) {
        await page.waitForFunction(() => starts.length === 3);
        assert.equal(pending.length,9);
        await pending.find(route => route.request().url().endsWith('/C4.ogg')).continue();
        await page.waitForFunction(() => decoded === 1);
      }
      await key.tap();
      status = await page.evaluate(() => ({presses,starts,atRelease}));
      assert.deepEqual(status.presses,[60,60]);
      if (hasAudio) {
        assert.equal(status.starts.length,4);
        assert.equal(status.starts[3].type,'sample');
        assert.ok(status.starts[3].lead <= .01 && status.starts[3].delayMs < 50);
      }
      assert.deepEqual(status.atRelease,[1,2], 'touch note must be submitted before release');
      if (hasAudio) {
        for (const route of pending.filter(route => !route.request().url().endsWith('/C4.ogg'))) await route.continue();
        await page.waitForFunction(() => decoded === 9);
        assert.equal(await page.evaluate(() => starts.length),4,'downloads must not replay earlier presses');
      }

      await key.focus();
      await page.keyboard.press('Enter');
      await page.keyboard.press('Space');
      assert.equal(await page.evaluate(() => presses.length),4,'keyboard accessibility activation');
      await page.evaluate(() => { rebuild(); rebuild(); });
      await page.locator('[data-midi="61"]').tap();
      assert.deepEqual(await page.evaluate(() => presses),[60,60,60,60,61],'rebuilding must not duplicate handlers');
      await page.evaluate(() => board.setEnabled(false));
      await page.mouse.move(box.x + box.width/2, box.y + box.height - 16);
      await page.mouse.down(); await page.mouse.up();
      assert.equal(await page.evaluate(() => presses.length),5,'disabled keys cannot submit answers');

      // Wide ranges previously stretched white keys beyond their positioning row.
      for (const [low, high] of [[60,83],[48,83],[36,83],[62,81]]) {
        await page.evaluate(([low,high]) => rebuild(low,high),[low,high]);
        const geometry = await page.evaluate(() => {
          const white = [...document.querySelectorAll('.key-white')];
          return {
            minWhite:Math.min(...white.map(key=>key.getBoundingClientRect().width)),
            errors:[...document.querySelectorAll('.key-black')].map(key=>{
              const previous=white.filter(w=>Number(w.dataset.midi)<Number(key.dataset.midi)).pop();
              const r=key.getBoundingClientRect();
              return Math.abs(r.x+r.width/2-previous.getBoundingClientRect().right);
            }),
            navCount:document.querySelectorAll('.keyboard-navigation').length,
            overflow:document.documentElement.scrollWidth > innerWidth
          };
        });
        assert.ok(geometry.minWhite >= 41.9);
        assert.ok(geometry.errors.every(error=>error<1),engine + ': black keys must align with white boundaries');
        assert.equal(geometry.navCount,1);
        assert.equal(geometry.overflow,false);
      }
      const before = await page.evaluate(() => presses.length);
      await page.getByRole('button',{name:'높은 음 →'}).tap();
      assert.ok(await page.evaluate(() => document.querySelector('#keys').scrollLeft > 0));
      assert.equal(await page.evaluate(() => presses.length),before,'moving the range must not submit a note');
      assert.deepEqual(errors,[]);
      console.log(engine + ': ' + (hasAudio ? 'cold contact-to-schedule ' + coldDelay.toFixed(1) + 'ms; warm sample ' + status.starts[3].delayMs.toFixed(1) + 'ms' : 'Web Audio unavailable in this Windows WebKit build; audio checks skipped') + '; held input, touch, accessible keys, no duplicates, four ranges passed');
      await context.close();
    }
  } finally {
    for (const browser of browsers) await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode=1; });
