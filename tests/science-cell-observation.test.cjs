const{test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const out=path.resolve('docs/science-lab-audit-2026-10-12/course-practices/cell-observation');fs.mkdirSync(out,{recursive:true});
test('three original cell micrographs retain identity and optical magnification',async()=>{
 const record=require('../docs/science-lab-audit-2026-10-12/course-practices/cell-image-provenance.json');
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync(record.sourcePath)).digest('hex'),record.sourceSha256);
 assert.deepEqual(record.specimens.map(r=>r.id),['cheek-stained','leaf-unstained','leaf-stained']);
 for(const r of record.specimens){assert.equal(r.sourceMagnification,400);assert(r.lossless&&r.decodedPixelsIdentical);const bytes=fs.readFileSync(r.file),meta=await require('sharp')(bytes).metadata();assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),r.sha256);assert.equal(meta.width,r.width);assert.equal(meta.height,r.height);assert(meta.hasAlpha);}
});
for(const engine of ['chromium','webkit'])test(engine+': cell preparation, observation, touch navigation and retained diagnosis',{timeout:160000},async()=>{
 const browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});
 try{const p=await browser.newPage({...(engine==='webkit'?require('playwright').devices['iPad (gen 7)']:{deviceScaleFactor:1.25}),viewport:{width:768,height:1024},hasTouch:true}),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto('http://127.0.0.1:18765/learning/inquiry/science-lab/cell-structure/');await p.waitForFunction(()=>!!window.__cellObservation);await p.waitForSelector('[data-assessment-ready]',{state:'attached'});
  const tap=id=>p.locator('#'+id).tap(),set=(id,v)=>p.locator('#'+id).evaluate((e,v)=>{e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));},v),loaded=()=>p.waitForFunction(()=>document.querySelector('#mbImage').complete&&document.querySelector('#mbImage').naturalWidth>0);
  assert.equal(await p.locator('.curriculum-supplement').count(),0);assert.equal(await p.locator('#mbPlace').isDisabled(),true);await p.locator('[data-mb-step="3"]').tap();assert.deepEqual(await p.evaluate(()=>__cellObservation.getState().preparation),[]);assert.match(await p.locator('#mbStatus').innerText(),/부터 진행/);
  await tap('mbObserve');assert.equal(await p.evaluate(()=>Object.keys(__cellObservation.getState().observed).length),0);
  for(const sample of ['cheek','leaf','leaf-stained']){
   await p.locator('[data-mb-sample="'+sample+'"]').tap();await loaded();const n=sample==='leaf'?4:5;assert.equal(await p.locator('[data-mb-step]').count(),n);
   for(let i=0;i<n;i++)await p.locator('[data-mb-step="'+i+'"]').tap();assert.equal(await p.locator('#mbPlace').isEnabled(),true);await tap('mbPlace');
   if(await p.evaluate(()=>__cellObservation.getState().lamp))await tap('mbLamp');await tap('mbObserve');assert.match(await p.locator('#mbStatus').innerText(),/조명을 켜야/);await tap('mbLamp');await tap('mbObserve');assert.match(await p.locator('#mbStatus').innerText(),/초점을 맞춘/);await set('mbFocus',6);await tap('mbObserve');assert.equal(await p.evaluate(()=>__cellObservation.ready()),true);assert.match(await p.locator('#mbCaption').innerText(),/400배/);
  }
  assert.equal(await p.locator('#mbComparisonGrid figure').count(),3);await set('mbZoom',1.8);await p.locator('#mbViewer').focus();await p.keyboard.press('ArrowRight');assert.notEqual(await p.evaluate(()=>__cellObservation.getState().pan.x),0);
  const box=await p.locator('#mbViewer').boundingBox();await p.mouse.move(box.x+box.width/2,box.y+box.height/2);await p.mouse.down();await p.mouse.move(box.x+box.width/2+24,box.y+box.height/2);await p.mouse.up();
  await tap('mbWhole');assert.equal(await p.evaluate(()=>__cellObservation.getState().zoom),1);assert.match(await p.locator('#mbCaption').innerText(),/400배/);
  for(const width of [1366,1180,1024,820,768,390]){await p.setViewportSize({width,height:width===820?1180:1024});await p.evaluate(()=>document.fonts.ready);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);if([1366,768,390].includes(width))await require('./science-screenshot.cjs')(p.locator('#mbLab'),path.join(out,engine+'-complete-'+width+'.webp'));}
  await p.setViewportSize({width:768,height:1024});await p.locator('.quiz-section>summary').tap();for(const card of await p.locator('.quiz-card').all()){const a=await card.getAttribute('data-answer');await card.locator('input[value="'+(a==='a'?'b':'a')+'"]').check();await card.locator('.answer-button').tap();await card.locator('input[value="'+a+'"]').check();await card.locator('.answer-button').tap();assert.match(await card.innerText(),/첫 응답은 오답/);}
  await tap('mbReset');await p.reload();await p.waitForSelector('[data-assessment-ready]',{state:'attached'});await p.locator('.quiz-section>summary').tap();for(const card of await p.locator('.quiz-card').all())assert.match(await card.innerText(),/첫 응답은 오답/);
  await p.waitForFunction(()=>!!document.querySelector('.exam-widget')?.examController);assert.deepEqual(await p.locator('.exam-widget').evaluate(w=>w.examController.ids()),['cell-structure@onion','cell-structure@field']);
  await p.route('**/assets/cell-observation/*',r=>r.abort());await p.reload();await p.waitForFunction(()=>!!window.__cellObservation);for(let i=0;i<5;i++)await p.locator('[data-mb-step="'+i+'"]').tap();await tap('mbPlace');await tap('mbLamp');await set('mbFocus',6);await tap('mbObserve');assert.equal(await p.evaluate(()=>Object.keys(__cellObservation.getState().observed).length),0);assert.match(await p.locator('#mbStatus').innerText(),/사진을 불러/);assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
