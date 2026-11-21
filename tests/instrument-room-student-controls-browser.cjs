// Signature excerpts must use the selected instrument's real recorded pitches,
// complete normally, and leave no sounding/key state when interrupted.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const puppeteer = require('puppeteer-core');
const root = path.resolve(__dirname, '..');
const room = '/learning/arts/instrument-room/';
const output = path.join(root, 'outputs/instrument-demo-review');
const server = http.createServer((req, res) => {
  let file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  fs.readFile(file, (error, bytes) => {
    if (error) return res.writeHead(404).end();
    if (file.endsWith('instrument-room' + path.sep + 'app.js')) {
      bytes = bytes.toString().replace('document.addEventListener("DOMContentLoaded", init);',
        'window.signatureTest={state,selectModel,KEYBOARD_SAMPLE_SETS,BASS_DEMOS,DRUM_DEMOS,JANGGU_DEMOS};window.signatureHits=[];document.addEventListener("DOMContentLoaded", init);');
      bytes = bytes.replace('function triggerDrumV2(id, velocity) {', 'function triggerDrumV2(id, velocity) { (window.studentHits ||= []).push({id,time:performance.now()});');
      bytes = bytes.replace('function startConcertGrandSample(midi, velocity, anchor, buffer, sampleSet, when) {',
        'function startConcertGrandSample(midi, velocity, anchor, buffer, sampleSet, when) { window.signatureHits.push({midi,anchor,sampleSet});');
    }
    const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.ogg': 'audio/ogg', '.flac': 'audio/flac', '.webp': 'image/webp', '.woff2': 'font/woff2' };
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' }).end(bytes);
  });
});

async function shot(page, name) {
  const result = spawnSync('python', ['-c',
    'import io,sys;from PIL import Image;im=Image.open(io.BytesIO(sys.stdin.buffer.read())).convert("RGBA");im.save(sys.argv[1],format="WEBP",lossless=True,exact=True);out=Image.open(sys.argv[1]).convert("RGBA");assert im.size==out.size and im.tobytes()==out.tobytes()',
    path.join(output, name + '.webp')], { input: await page.screenshot() });
  assert.equal(result.status, 0, String(result.stderr));
}


(async()=>{
 fs.mkdirSync(output,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
 browser=await puppeteer.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 for(const width of [1366,390]){
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewport({width,height:width<500?844:900,isMobile:width<500,hasTouch:width<500});
  async function press(selector){await page.$eval(selector,b=>b.scrollIntoView({block:'nearest',inline:'center',behavior:'instant'}));if(width<500)await page.tap(selector);else await page.click(selector);}
  await page.goto('http://127.0.0.1:'+server.address().port+room,{waitUntil:'networkidle0'});
  assert.equal(await page.$eval('#keySizeModal',e=>e.classList.contains('hidden')),true);
  await press('[data-family="korean"]');await press('[data-korean-room="folk"]');await page.evaluate(()=>signatureTest.selectModel('janggu-sanjo'));
  assert.deepEqual(await page.$$eval('#drumPads .pad-gueum',x=>x.map(e=>e.textContent)),['덩','쿵','덕','기덕','더러러러']);
  const hands=await page.evaluate(()=>{const left=document.querySelector('[data-pad-group=left]'),right=document.querySelector('[data-pad-group=right]');return {leftX:left.getBoundingClientRect().x,rightX:right.getBoundingClientRect().x,left:[...left.querySelectorAll('.pad-gueum')].map(e=>e.textContent),right:[...right.querySelectorAll('.pad-gueum')].map(e=>e.textContent)}});
  assert.ok(hands.leftX<hands.rightX);assert.deepEqual(hands.left,['쿵']);assert.deepEqual(hands.right,['덕','기덕','더러러러']);
  assert.equal(await page.$('#jangguDemoSelect'),null);assert.equal(await page.$$('#jangguDemoChoices button').then(x=>x.length),3);
  assert.ok(await page.$eval('#drumPads .pad-gueum',e=>parseFloat(getComputedStyle(e).fontSize)>=18));
  await page.evaluate(()=>window.studentHits=[]);await press('[data-janggu-demo="2"]');
  await page.waitForFunction(()=>document.querySelector('[data-janggu-demo="2"]').getAttribute('aria-pressed')==='true');
  await page.waitForFunction(()=>studentHits.length>0);await shot(page,'student-janggu-'+width);
  await page.waitForFunction(()=>document.querySelector('[data-janggu-demo="2"]').getAttribute('aria-pressed')==='false',{timeout:12000});
  const hits=await page.evaluate(()=>studentHits),pattern=['low-high-open','high-flam-rim','low-open','low-high-bounce','low-open','high-flam-rim','low-open','low-high-bounce'];
  assert.deepEqual(hits.map(x=>x.id),[...pattern,...pattern]);
  const beats=[0,2/3,1,5/3,2,8/3,3,11/3,4,4+2/3,5,5+2/3,6,6+2/3,7,7+2/3];
  hits.forEach((hit,i)=>assert.ok(Math.abs(hit.time-hits[0].time-beats[i]*60000/72)<120,'굿거리 소박 '+i));
  const basics = {
   'buk-samul': ['북면 치기 · 둥','북통 치기 · 딱'],
   'buk-sori': ['손으로 북면 치기','채로 북면 치기','채로 테 치기'],
   sogo: ['북면 치기','테 치기'],
   kkwaenggwari: ['열어치기','막아치기'], jing: ['징 치기','울림 막기']
  };
  for (const [model,names] of Object.entries(basics)) {
   await page.evaluate(model=>signatureTest.selectModel(model),model);
   assert.deepEqual(await page.$$eval('#drumPads .pad-gueum',els=>els.map(e=>e.textContent)),names);
   const ids=await page.$$eval('#drumPads .drum-pad',els=>els.map(e=>e.dataset.drum));
   await page.evaluate(()=>window.studentHits=[]);
   for(const id of ids)await press('#drumPads [data-drum="'+id+'"]');
   assert.deepEqual(await page.evaluate(()=>studentHits.map(e=>e.id)),ids);
   if(model==='buk-sori'){
    const layout=await page.evaluate(()=>['left','right'].map(side=>{const e=document.querySelector('[data-pad-group='+side+']');return {x:e.getBoundingClientRect().x,ids:[...e.querySelectorAll('[data-drum]')].map(p=>p.dataset.drum),keys:[...e.querySelectorAll('[data-code]')].map(p=>p.dataset.code)}}));
    assert.ok(layout[0].x<layout[1].x);assert.deepEqual(layout[0].ids,['main-lh']);assert.deepEqual(layout[1].ids,['main-rh','rim']);
    assert.deepEqual(layout.map(e=>e.keys),[['KeyA'],['KeyJ','KeyK']]);
   }else assert.equal(await page.$('#drumPads [data-pad-group]'),null);
   if(model==='jing'||model==='kkwaenggwari'){
    const bank='korean-'+model;
    await press('#drumPads [data-drum="open"]');
    await page.waitForFunction(bank=>signatureTest.state.koreanMetalVoices.get(bank)?.size>0,{},bank);
    await press('#drumPads [data-drum="'+(model==='jing'?'mute':'muted')+'"]');
    assert.equal(await page.evaluate(bank=>signatureTest.state.koreanMetalVoices.get(bank).size,bank),0);
   }
   await shot(page,'student-'+model+'-'+width);
  }
  await press('[data-korean-room="ensemble"]');await page.evaluate(()=>signatureTest.selectModel('ritual-signals'));
  assert.deepEqual(await page.$$eval('#drumPads .drum-pad b',x=>x.map(e=>e.textContent)),['박','축','어']);
  assert.equal(await page.$('main #stationSource'),null);
  assert.equal(await page.evaluate(()=>document.querySelector('main').innerText.includes('공공누리')),false);
  await shot(page,'student-ritual-'+width);await press('#instrumentInfoButton');
  assert.match(await page.$eval('#detailArticle',e=>e.innerText),/국립국악원 국악기 디지털 음원/);await press('#detailClose');
  await press('[data-family="drums"]');
  const intervals={};
  for(const model of ['rock-kit','metal-kit']){
   await page.evaluate(model=>signatureTest.selectModel(model),model);assert.equal(await page.$$('#drumPads .drum-pad').then(x=>x.length),15);
   for(const id of ['openhat','pedalhat','ghost','rimshot','sidestick','rimclick'])assert.ok(await page.$('#drumPads [data-drum="'+id+'"]'),model+'/'+id);
   await page.evaluate(()=>window.studentHits=[]);await press('#drumDemoButton');await page.waitForFunction(()=>studentHits.length>=10);
   intervals[model]=await page.evaluate(()=>{const times=studentHits.map(x=>x.time).filter((time,index,all)=>index===0||time-all[index-1]>20);return times[1]-times[0]});
   await page.evaluate(()=>document.querySelector('[data-family="korean"]').click());await press('[data-family="drums"]');
  }
  assert.ok(intervals['metal-kit']<intervals['rock-kit']*.6,JSON.stringify(intervals));
  const plans=await page.evaluate(()=>Object.fromEntries(['rock-kit','metal-kit'].map(id=>[id,signatureTest.DRUM_DEMOS[id].groove.filter(x=>x[1].split(' ').includes('kick')).length])));
  assert.ok(plans['metal-kit']>=plans['rock-kit']*4);assert.deepEqual(errors,[]);
  assert.ok(await page.$eval('#drumPads .drum-pad b',e=>parseFloat(getComputedStyle(e).fontSize)>=16));
  await shot(page,'student-drums-'+width);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  console.log(JSON.stringify({width,jangguPads:5,jangdanButtons:3,gutgeoriHits:hits.length,ritualPads:3,drumPads:15,intervals,passed:true}));await page.close();
 }
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
