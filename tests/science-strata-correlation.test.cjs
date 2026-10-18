const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const model=require('../learning/inquiry/science-lab/strata-correlation/model.js');
test('source correlation separates repeated rocks, key beds, fossils and hiatuses',()=>{
 assert.equal(model.cases.key.units.length,8);assert.equal(model.cases.fossil.units.length,11);
 assert.deepEqual(model.cases.key.regions.map(r=>r.gaps.length),[0,1,0]);assert.deepEqual(model.cases.fossil.regions.map(r=>r.gaps.length),[2,1,1]);
 assert.equal(model.compare('key',{region:0,index:0},{region:1,index:1}).correct,true);
 const wrongSand=model.compare('key',{region:0,index:0},{region:1,index:4});assert.equal(wrongSand.sameRock,true);assert.equal(wrongSand.correct,false);
 assert.equal(model.compare('key',{region:0,index:2},{region:2,index:0}).correct,true);
 assert.equal(model.compare('fossil',{region:0,index:5},{region:1,index:5}).correct,true);
 const wrongLime=model.compare('fossil',{region:0,index:5},{region:1,index:2});assert.equal(wrongLime.sameRock,true);assert.equal(wrongLime.correct,false);
 assert.equal(model.compare('key',{region:0,index:0},{region:0,index:0}).valid,false);assert.equal(model.layer('fossil',4,0),null);
});
for(const engine of ['chromium','webkit'])test(engine+': correlation, boundaries, touch controls and persisted question diagnosis',{timeout:160000},async()=>{
 const browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});
 const out=path.resolve(__dirname,'../docs/science-lab-audit-2026-10-12/course-practices/strata-correlation');fs.mkdirSync(out,{recursive:true});
 try{
  const p=await browser.newPage({...(engine==='webkit'?require('playwright').devices['iPad (gen 7)']:{deviceScaleFactor:1.25}),viewport:{width:768,height:1024},hasTouch:true}),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto('http://127.0.0.1:18765/learning/inquiry/science-lab/strata-correlation/');await p.waitForSelector('[data-assessment-ready]',{state:'attached'});
  assert.equal(await p.locator('#scClear').evaluate(e=>getComputedStyle(e).opacity),'1');
  const choose=key=>p.locator('[data-sc-layer="'+key+'"]').tap();
  await choose('0:0');assert.equal(await p.locator('[data-sc-layer="0:0"]').evaluate(e=>e===document.activeElement),true);await choose('1:4');assert.match(await p.locator('#scStatus').innerText(),/암석 이름은 같지만/);assert.equal(await p.evaluate(()=>__strataCorrelation.getState().links.length),0);
  await choose('0:0');await choose('1:1');assert.equal(await p.evaluate(()=>__strataCorrelation.getState().links.length),1);assert.deepEqual(await p.evaluate(()=>__strataCorrelation.getState().attempts.map(r=>r.correct)),[false,true]);
  await choose('0:0');await choose('1:1');assert.equal(await p.evaluate(()=>__strataCorrelation.getState().links.length),1);
  await p.locator('[data-sc-boundary="1:0"]').tap();assert.match(await p.locator('#scStatus').innerText(),/부정합면입니다/);assert.equal(await p.locator('#scStatus').evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=-1&&r.bottom<=innerHeight+1;}),true,'boundary explanation is brought into view without covering the section');
  await p.locator('#scReveal').tap();assert.equal(await p.locator('#scSequence li').count(),8);assert.match(await p.locator('#scConclusion').innerText(),/8개/);
  for(const mode of ['key','fossil']){
   await p.locator('[data-sc-mode="'+mode+'"]').tap();assert.equal(await p.locator('#scSummary').isVisible(),false);assert.equal(await p.locator('#scReveal').innerText(),'대비 정리 보기');
   await p.locator('#scReveal').tap();assert.equal(await p.locator('#scSequence li').count(),mode==='key'?8:11);
   for(const width of [1366,1180,1024,820,768,390]){
    await p.setViewportSize({width,height:width===820?1180:1024});await p.evaluate(()=>document.fonts.ready);
    await p.locator('[data-sc-layer="1:2"]').scrollIntoViewIfNeeded();
    assert.deepEqual(await p.locator('#scStatus').evaluate(status=>{const a=status.getBoundingClientRect();return [...document.querySelectorAll('.sc-layer')].filter(e=>{const b=e.getBoundingClientRect();return Math.min(a.right,b.right)-Math.max(a.left,b.left)>2&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>2;}).map(e=>e.dataset.scLayer);}),[],'feedback must not cover the diagram while scrolling');
    const bad=await p.locator('#scLab').evaluate(lab=>[...lab.querySelectorAll('button')].filter(e=>e.getClientRects().length&&(e.getBoundingClientRect().height<43.5||e.scrollWidth>e.clientWidth+1)).map(e=>e.textContent));assert.deepEqual(bad,[]);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    if([1366,768,390].includes(width))await require('./science-screenshot.cjs')(p.locator('#scLab'),path.join(out,engine+'-'+mode+'-'+width+'.webp'));
   }
  }
  await p.setViewportSize({width:768,height:1024});await p.locator('.quiz-section>summary').tap();for(const card of await p.locator('.quiz-card').all()){const correct=await card.getAttribute('data-answer');await card.locator('input[value="'+(correct==='a'?'b':'a')+'"]').check();await card.locator('.answer-button').tap();await card.locator('input[value="'+correct+'"]').check();await card.locator('.answer-button').tap();assert.match(await card.innerText(),/정답입니다\./);}
  await p.reload();await p.waitForSelector('[data-assessment-ready]',{state:'attached'});await p.locator('.quiz-section>summary').tap();for(const card of await p.locator('.quiz-card').all())assert.match(await card.innerText(),/정답입니다\./);assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
