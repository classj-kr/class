const{test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const clipping=require('./science-svg-clipping.cjs'),capture=require('./science-screenshot.cjs');
const out=path.resolve(process.env.SCIENCE_TEST_ARTIFACTS||'docs/science-lab-audit-2026-10-12/course-practices/periodic-consistency');
fs.mkdirSync(out,{recursive:true});
for(const engine of ['chromium','webkit'])test(engine+': helium exception, phase-change axes and chart contrast remain consistent',{timeout:120000},async()=>{
 const browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});
 try{
  const page=await browser.newPage({viewport:{width:768,height:1024},hasTouch:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  await page.goto('http://127.0.0.1:18765/learning/inquiry/science-lab/periodic-bonding/');await page.waitForFunction(()=>!!window.__bondingModel);
  const contrast=()=>page.evaluate(()=>{
   const issues=[],luminance=rgb=>rgb.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
   for(const e of document.querySelectorAll('#graphGroup .trace,#graphGroup .bar,#graphGroup text')){
    const s=getComputedStyle(e),text=e.tagName.toLowerCase()==='text',rgba=(e.classList.contains('trace')?s.stroke:s.fill).match(/[\d.]+/g)?.map(Number);if(!rgba)continue;
    let alpha=(rgba[3]??1)*Number(e.classList.contains('trace')?s.strokeOpacity:s.fillOpacity);for(let p=e;p;p=p.parentElement)alpha*=Number(getComputedStyle(p).opacity);
    const value=1.05/(luminance(rgba.slice(0,3).map(v=>v*alpha+255*(1-alpha)))+.05);
    if(value<(text?4.45:3))issues.push({text:e.textContent,tag:e.tagName,class:e.getAttribute('class'),contrast:value});
   }return issues;
  });
  for(const period of ['1','2','3']){
   await page.evaluate(period=>{__bondingModel.setMode('elements');__bondingModel.set('period',period);__bondingModel.set('group','18');__bondingModel.runToEnd();},period);
   assert.match(await page.locator('#dataNote').innerText(),/헬륨 2개, 네온·아르곤 8개/);
   assert.doesNotMatch(await page.locator('#dataNote').innerText(),/모두 바깥 전자/);
   assert.match(await page.locator('#elementaryExplanation').innerText(),/헬륨의 바깥 전자는 2개, 네온과 아르곤은 8개/);
   assert.match(await page.locator('.burn-stage').textContent(),/He 2개 · Ne·Ar 8개|He는 2개, Ne·Ar은 8개/);
   assert.deepEqual(await contrast(),[]);
  }
  for(const width of [1366,1180,1024,820,768]){
   await page.setViewportSize({width,height:width===820?1180:1024});await page.evaluate(()=>{__bondingModel.setMode('elements');__bondingModel.set('period','1');__bondingModel.set('group','18');__bondingModel.runToEnd();});await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));assert.deepEqual(await page.evaluate(clipping),[]);
   if(width===768)await capture(page.locator('.burn-stage'),path.join(out,engine+'-helium-768.webp'));
   await page.evaluate(()=>{__bondingModel.setMode('bonds');__bondingModel.set('pair','nacl');__bondingModel.runToEnd();});await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const chart=await page.evaluate(()=>{const axis=document.querySelector('#graphGroup .axis'),zero=+axis.getAttribute('y1');return{zero,bars:[...document.querySelectorAll('#graphGroup .bar')].map(b=>({id:b.dataset.compound,type:b.dataset.transition,y:+b.getAttribute('y'),height:+b.getAttribute('height'),value:__bondingModel.PAIRS[b.dataset.compound].melt}))};});
   assert.deepEqual(chart.bars.map(b=>b.id).sort(),['nacl','na2o','mgo','cacl2','h2','o2','n2','h2o','co2'].sort());const scale=(122-36)/3000;
   for(const bar of chart.bars){assert(Math.abs(bar.y-Math.min(chart.zero,chart.zero-bar.value*scale))<.06,bar.id);assert(Math.abs(bar.height-Math.abs(bar.value*scale))<.06,bar.id);assert.equal(bar.type,bar.id==='co2'?'sublimation':'melting');}
   assert.equal(await page.locator('[data-zero-temperature]').count(),1);
   assert.match(await page.locator('.burn-stage').textContent(),/CO₂는 승화, 나머지는 녹는점/,'The CO2 note must also remain visible when a different compound is selected');
   assert.doesNotMatch(await page.locator('.figure-notes').allTextContents().then(a=>a.join('\n')),/가로축:/,'A condition or legend must not be relabeled as an axis');
   assert.deepEqual(await contrast(),[]);assert.deepEqual(await page.evaluate(clipping),[]);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
   if(width===768)await capture(page.locator('.burn-stage'),path.join(out,engine+'-phase-comparison-768.webp'));
  }
  await page.evaluate(()=>{__bondingModel.set('pair','co2');__bondingModel.runToEnd();});
  assert.match(await page.locator('#mainGroup').textContent(),/승화점: −78.5/);
  assert.doesNotMatch(await page.locator('#mainGroup').textContent(),/녹는점:/);
  assert.match(await page.locator('#dataNote').textContent(),/승화점 −78.5/);
  assert.match(await page.locator('#elementaryExplanation').textContent(),/액체를 거치지 않고 기체로 승화/);
  assert.doesNotMatch(await page.locator('#elementaryExplanation').textContent(),/녹는점이.*상온/);
  for(const [period,group,outer]of [['1','1',1],['2','13',3]]){
   await page.evaluate(({period,group})=>{__bondingModel.setMode('elements');__bondingModel.set('period',period);__bondingModel.set('group',group);__bondingModel.runToEnd();},{period,group});
   assert.match(await page.locator('#mainGroup').textContent(),new RegExp('바깥 전자 '+outer+'개'));
   assert.doesNotMatch(await page.locator('#mainGroup').textContent(),/4개를 잃기도/);
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
