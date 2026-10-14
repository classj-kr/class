// Real browser input/layout checks. Viewports are not physical iPad/ChromeOS tests.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const {chromium, webkit} = require('playwright');
const root = path.resolve(__dirname, '..');
const output = path.join(root, "outputs/qa/instrument-pads");
fs.mkdirSync(output, {recursive:true});
const server = http.createServer((req, res) => {
  let file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  fs.readFile(file, (error, data) => {
    if (error) return res.writeHead(404).end();
    if (file.endsWith('instrument-room' + path.sep + 'app.js')) {
      data = data.toString().replace('document.addEventListener("DOMContentLoaded", init);',
        'window.padTest = {state, selectModel}; document.addEventListener("DOMContentLoaded", init);');
      data = data.replace('function triggerDrumV2(id, velocity) {',
        'function triggerDrumV2(id, velocity) { (window.padHits ||= []).push({id, velocity}); if (!window.AudioContext && !window.webkitAudioContext) return;');
    }
    const type = {'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.ogg':'audio/ogg','.webp':'image/webp'}[path.extname(file)];
    res.writeHead(200, {'Content-Type':type || 'application/octet-stream'}).end(data);
  });
});
const profiles = [
  {name:'pc-1920',width:1920,height:1080},
  {name:'pc-1366',width:1366,height:768},
  {name:'pc-125-percent',width:1093,height:614,scale:1.25},
  {name:'chromebook-1366-touch',width:1366,height:768,touch:true},
  {name:'chromebook-1024-touch',width:1024,height:600,touch:true},
  {name:'tablet-portrait',width:768,height:1024,touch:true},
  {name:'phone-390',width:390,height:844,touch:true,mobile:true},
  {name:'phone-320',width:320,height:640,touch:true,mobile:true},
  {name:'phone-landscape',width:844,height:390,touch:true,mobile:true},
  {name:'webkit-ipad-landscape',engine:'webkit',width:1024,height:768,touch:true,scale:2},
  {name:'webkit-ipad-portrait',engine:'webkit',width:768,height:1024,touch:true,scale:2},
  {name:'webkit-390',engine:'webkit',width:390,height:844,touch:true,mobile:true,scale:3}
];
(async () => {
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  const browsers = {}, report = [];
  try {
    browsers.chromium = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
    browsers.webkit = await webkit.launch({headless:true});
    for (const p of profiles) {
      if (process.env.DEVICE_PROFILE && process.env.DEVICE_PROFILE !== p.name) continue;
      const engine = p.engine || 'chromium';
      const context = await browsers[engine].newContext({viewport:{width:p.width,height:p.height},hasTouch:!!p.touch,isMobile:!!p.mobile,deviceScaleFactor:p.scale || 1});
      const page = await context.newPage(), errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.goto('http://127.0.0.1:' + server.address().port + '/learning/arts/instrument-room/',{waitUntil:'networkidle'});
      const close = page.locator('button[data-key-size-close]:not(.key-size-backdrop)');
      if (await close.isVisible()) await close.click();
      assert.equal(await page.evaluate(()=>padTest.state.modelId),'concert-grand');
      await page.locator('.instrument-tabs [data-family="korean"]').click();
      await page.locator('[data-korean-room="folk"]').click();
      for (const model of ['janggu-samul','janggu-sanjo','rock-kit']) {
        if (model === 'rock-kit') await page.locator('.instrument-tabs [data-family="drums"]').click();
        else await page.evaluate(id=>padTest.selectModel(id),model);
        const audit = await page.evaluate(() => {
          const box = el => { const r=el.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,w:r.width,h:r.height}; };
          return {width:innerWidth,groups:[...document.querySelectorAll('.pad-group')].map(el=>({id:el.dataset.padGroup,...box(el)})),
            pads:[...document.querySelectorAll('#drumPads button')].map(el=>({id:el.dataset.drum,code:el.dataset.code,group:el.closest('.pad-group').dataset.padGroup,
              ...box(el),icon:box(el.querySelector('svg')),text:box(el.querySelector('b')),tool:el.querySelector('.pad-tool').textContent,overflow:el.scrollWidth>el.clientWidth+1}))};
        });
        assert.equal(audit.pads.length,model==='janggu-samul'?13:15);
        assert.equal(new Set(audit.pads.map(x=>x.code)).size,audit.pads.length,'Unique keyboard shortcuts');
        for (const b of audit.pads) {
          assert.ok(b.x>=0 && b.right<=audit.width+1,`${p.name} ${model} ${b.id}: off screen`);
          assert.ok(b.w>=44 && b.h>=44,'Minimum touch target');
          assert.ok(!b.overflow,`${p.name} ${model} horizontal overflow: ${JSON.stringify(b)}`);
          assert.ok(b.text.bottom<=b.bottom && b.icon.bottom<=b.bottom,'Content fits pad');
        }
        if (model.startsWith('janggu')) {
          const left=audit.groups.find(x=>x.id==='left'),right=audit.groups.find(x=>x.id==='right');
          assert.ok(left.right<=right.x && Math.abs(left.y-right.y)<1,'Keep left/right at every width');
          assert.ok(audit.pads.filter(x=>x.group==='left').every(x=>['KeyA','KeyS','KeyD','KeyF','KeyQ','KeyW'].includes(x.code)));
          assert.ok(audit.pads.filter(x=>x.group==='right').every(x=>['KeyJ','KeyK','KeyL','Semicolon','KeyU','KeyI'].includes(x.code)));
          assert.equal(audit.pads.find(x=>x.id==='low-open').tool,model==='janggu-samul'?'궁채':'손');
          if(model==='janggu-samul') assert.equal(audit.pads.find(x=>x.id==='high-mallet').tool,'궁채');
          if(model==='janggu-sanjo') assert.ok(audit.pads.find(x=>x.id==='low-high-ornament').w>audit.groups.find(x=>x.id==='both').w*.4,'Both-side variations use the available width');
        } else {
          assert.ok(audit.groups.find(x=>x.id==='cymbals').y<audit.groups.find(x=>x.id==='toms').y);
          assert.ok(audit.groups.find(x=>x.id==='toms').y<audit.groups.find(x=>x.id==='core').y);
          assert.ok(audit.pads.find(x=>x.id==='kick').w>audit.pads.find(x=>x.id==='ride').w);
        }
        const first=page.locator('#drumPads button').first();
        await page.evaluate(()=>{window.padHits=[];});
        if(p.touch) await first.tap(); else await first.click();
        assert.equal(await page.evaluate(()=>padHits.length),1,'One strike per pointer gesture');
        await first.focus();
        await page.keyboard.press('Enter');
        await page.keyboard.press('Space');
        assert.equal(await page.evaluate(()=>padHits.length),3,'Accessible activation without duplicates');
        if(model.startsWith('janggu')) {
          await page.evaluate(()=>{window.padHits=[];});
          await page.keyboard.down('a'); await page.keyboard.down('j');
          await page.keyboard.up('a'); await page.keyboard.up('j');
          assert.deepEqual(await page.evaluate(()=>padHits.map(h=>h.id)),['low-open','high-rim']);
          if(p.touch && engine==='chromium') {
            await page.locator('[data-drum="low-open"]').scrollIntoViewIfNeeded();
            const l=await page.locator('[data-drum="low-open"]').boundingBox(),r=await page.locator('[data-drum="high-rim"]').boundingBox();
            const cdp=await context.newCDPSession(page);
            await page.evaluate(()=>{window.padHits=[];});
            await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:l.x+l.width/2,y:l.y+l.height/2,id:1},{x:r.x+r.width/2,y:r.y+r.height/2,id:2}]});
            await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
            assert.deepEqual(await page.evaluate(()=>padHits.map(h=>h.id).sort()),['high-rim','low-open'],'Two simultaneous hands');
            await cdp.detach();
          }
        }
        await page.waitForTimeout(200);
        assert.equal(await page.locator('#drumPads .active').count(),0,'Pads release after gesture');
        await page.locator('#drumPads').screenshot({path:path.join(output,p.name+'-'+model+'.png')});
        report.push({profile:p.name,model,pads:audit.pads.length,audioAvailable:await page.evaluate(()=>!!(window.AudioContext||window.webkitAudioContext))});
      }
      const audioAvailable = await page.evaluate(()=>!!(window.AudioContext||window.webkitAudioContext));
      // This Windows WebKit build has no Web Audio. Keep its known preloader
      // rejection separate from unexpected page errors; do not claim audio QA.
      assert.deepEqual(errors.filter(e=>audioAvailable || e!=='Error: AudioContext unavailable'),[],p.name);
      console.log(p.name+': layout, icons, keyboard, '+(p.touch?'touch':'mouse')+' passed'+(audioAvailable?'':' (Web Audio unavailable; input/layout only)'));
      await context.close();
    }
    fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));
  } finally { for(const browser of Object.values(browsers)) await browser.close();server.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
