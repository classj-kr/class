const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),http=require('node:http');
const model=require('../learning/inquiry/science-lab/telescope-model.js');
const registry=require('../scripts/science-telescope-experiment.cjs');
test('instrument assembly, field of view, focus and sky availability have independent causes',()=>{
 let s=model.initial();assert.equal(model.install(s,'tube').state,s);for(const part of model.order)s=model.install(s,part).state;
 assert.equal(model.observe(s).assembled,true);
 for(const target of Object.keys(model.targets)){
  const t=model.targets[target];const centered={...s,target,balance:0,x:t.x,y:t.y,focus:0,view:'eyepiece'};
  const low=model.observe(centered),high=model.observe({...centered,eyepiece:6});
  assert.equal(low.details,true);assert.equal(high.details,true);assert.equal(low.mag,30);assert.equal(high.mag,100);assert(Math.abs(low.fov/high.fov-10/3)<1e-10);
  assert.equal(model.observe({...centered,focus:4}).details,false);assert.equal(model.observe({...centered,balance:2}).visible,true);assert.equal(model.observe({...centered,balance:2}).details,false);
  for(const sky of ['cloud','roof','below'])for(const view of ['eye','finder','eyepiece'])assert.equal(model.observe({...centered,sky,view}).visible,false);
  assert.equal(model.observe({...centered,view:'eye',parts:[]}).visible,true);
  assert.equal(model.observe({...centered,parts:[]}).visible,false);
 }
 const t=model.targets.jupiter,off={...s,target:'jupiter',balance:0,x:t.x+.6,y:t.y,focus:0,view:'eyepiece'};
 assert.equal(model.observe(off).visible,true);assert.equal(model.observe({...off,eyepiece:6}).visible,false);
 assert.equal(model.observe({...off,eyepiece:6,view:'finder'}).visible,true);
 const misaligned={...off,x:t.x-.8,finderOffset:.8,eyepiece:6,view:'finder'};
 assert.equal(model.observe(misaligned).dx,0);assert.equal(model.observe({...misaligned,view:'eyepiece'}).visible,false);
 assert(Math.abs(model.observe({...misaligned,finderOffset:0,view:'finder'}).dx-.8)<1e-10);
});
test('course routes retain separate evidence and plausible answer lengths',()=>{
 for(const [school,c]of Object.entries(registry.courseContexts)){
  assert.equal(c.questionNumbers.length,4);assert.equal(c.followupIds.length,2);
  for(const n of c.questionNumbers){const q=registry.questions[n-1];assert(q.feedback&&Object.keys(q.feedback).length===3);assert(q.choices[q.answer].length<Math.max(...q.choices.filter((_,i)=>i!==q.answer).map(v=>v.length))*1.8,school+' '+n);}
 }
 assert.equal(registry.source.id,'81ce1d0e81902b80');assert.equal(registry.publisherVariants[0].sourceId,'35d817a99ea28582');
});
for(const engine of ['chromium','webkit'])test(engine+': complete telescope operation and course diagnosis',{timeout:100000},async()=>{
 const lab=path.resolve(__dirname,'../learning/inquiry/science-lab'),server=http.createServer((req,res)=>{let file=path.resolve(lab,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(lab+path.sep))return res.writeHead(403).end();if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');fs.readFile(file,(e,b)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css'}[path.extname(file)]||'application/octet-stream');res.end(b);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});
  for(const school of ['middle','high-elective']){
   const page=await browser.newPage({viewport:{width:1200,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
   const range=async(id,v)=>page.locator('#'+id).evaluate((e,v)=>{e.value=String(v);e.dispatchEvent(new Event('input',{bubbles:true}));},v);
   await page.goto(`http://127.0.0.1:${server.address().port}/telescope-observation/?school=${school}`);await page.waitForFunction(()=>!!window.__telescope&&!!document.querySelector('.quiz-section').scienceAssessment);
   assert.equal(await page.locator('.quiz-card').count(),4);assert.equal(await page.locator('#scopeTarget option[value="moon"]').count(),school==='middle'?1:0);
   await page.locator('[data-part="tube"]').click();assert.equal((await page.evaluate(()=>window.__telescope.getState())).parts.length,0);assert.match(await page.locator('#scopeStatus').textContent(),/삼각대/);
   for(const part of model.order)await page.locator(`[data-part="${part}"]`).click();await range('scopeBalance',0);
   await page.locator('#scopeTarget').selectOption('jupiter');await range('scopeX',1.2);await range('scopeY',-.8);await page.locator('[data-view="eyepiece"]').click();await range('scopeFocus',0);
   assert.equal(await page.locator('#scopeDetail').isVisible(),true);assert.equal(await page.locator('#scopeScene svg').getAttribute('data-detail'),'true');
   await range('scopeX',1.8);assert.equal(await page.evaluate(()=>window.__telescope.getResult().visible),true);await page.locator('#scopeEyepiece').selectOption('6');assert.equal(await page.evaluate(()=>window.__telescope.getResult().visible),false);
   await page.locator('[data-view="finder"]').click();assert.equal(await page.evaluate(()=>window.__telescope.getResult().visible),true);
   await range('scopeFinder',.8);await range('scopeX',.4);assert(Math.abs(await page.evaluate(()=>window.__telescope.getResult().dx))<1e-10);
   await page.locator('[data-view="eyepiece"]').click();assert.equal(await page.evaluate(()=>window.__telescope.getResult().visible),false,'finder centered with a mismatched axis must miss the eyepiece field');
   await range('scopeX',1.2);await range('scopeFinder',0);await page.locator('[data-view="finder"]').click();assert.equal(await page.evaluate(()=>window.__telescope.getResult().dx),0);await page.locator('[data-view="eyepiece"]').click();
   for(const sky of ['cloud','roof','below']){await page.locator('#scopeSky').selectOption(sky);assert.equal(await page.locator('#scopeDetail').isVisible(),false);}await page.locator('#scopeSky').selectOption('clear');
   const ids=await page.locator('svg [id]').evaluateAll(es=>es.map(e=>e.id));assert.equal(new Set(ids).size,ids.length,'unique SVG clips');
   for(const width of [1200,820,390,320]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,school+' '+width);const clipped=await page.locator('.telescope-lab svg').evaluateAll(es=>es.flatMap(svg=>{const b=svg.getBoundingClientRect();return[...svg.querySelectorAll('text')].filter(t=>{const a=t.getBoundingClientRect();return a.left<b.left-1||a.right>b.right+1;}).map(t=>t.textContent);}));assert.deepEqual(clipped,[]);
    if(engine==='chromium'&&[1200,390].includes(width)){const dir=path.resolve(__dirname,'../docs/science-lab-audit-2026-10-12/telescope');fs.mkdirSync(dir,{recursive:true});await require('./science-screenshot.cjs')(page.locator('.telescope-lab'),{path:path.join(dir,school+'-'+width+'.webp')});}
   }
   await page.locator('#resetExperiment').click();assert.deepEqual(await page.evaluate(()=>window.__telescope.getState()),model.initial(school));
   await page.evaluate(()=>document.querySelector('.quiz-section').open=true);await page.waitForFunction(()=>!!document.querySelector('.exam-integrated')?.examController);
   const context=registry.courseContexts[school],expected=[...context.questionNumbers.map(n=>'telescope-observation#q'+n),...context.followupIds];
   assert.deepEqual((await page.evaluate(()=>document.querySelector('.exam-integrated').examController.ids())).sort(),context.followupIds.slice().sort());
   for(const card of await page.locator('.quiz-card').all()){
    const id=await card.getAttribute('data-question-id'),q=registry.questions[Number(id.split('#q')[1])-1];
    await card.locator(`input[value="${'abcd'[(q.answer+1)%4]}"]`).check();await card.locator('.answer-button').click();assert.equal(await card.locator('.answer-result').textContent(),'다시 생각하고 다른 답을 골라보세요.');
    await card.locator(`input[value="${'abcd'[q.answer]}"]`).check();await card.locator('.answer-button').click();assert.match(await card.locator('.answer-result').textContent(),/첫 응답은 오답/);
   }
   for(let i=0;i<2;i++){
    const id=await page.locator('.exam-question').getAttribute('data-exam-id'),q=id.includes('#q')?registry.questions[Number(id.split('#q')[1])-1]:registry.followups.find(q=>q.id===id);
    await page.locator(`[data-exam-answer="${(q.answer+1)%4}"]`).click();await page.locator('.exam-submit').click();assert.equal(await page.locator('.exam-feedback').getAttribute('data-correct'),'false');assert(!(await page.locator('.exam-feedback').textContent()).includes(q.why));
    await page.locator(`[data-exam-answer="${q.answer}"]`).click();await page.locator('.exam-submit').click();assert.match(await page.locator('.exam-feedback').textContent(),/첫 응답은 오답/);if(i<1)await page.locator('[data-exam-next]').click();
   }
   await page.reload();await page.waitForFunction(()=>!!document.querySelector('.quiz-section').scienceAssessment);await page.evaluate(()=>document.querySelector('.quiz-section').open=true);await page.waitForFunction(()=>!!document.querySelector('.exam-integrated')?.examController);const evidence=await page.evaluate(ids=>ids.map(id=>document.querySelector('.quiz-section').scienceAssessment.store.evidence(id)),expected);assert(evidence.every(e=>e?.firstCorrect===false&&e.status==='corrected'));
   const other=school==='middle'?'high-elective':'middle';
   await page.goto(`http://127.0.0.1:${server.address().port}/telescope-observation/?school=${other}`);await page.waitForFunction(()=>!!document.querySelector('.quiz-section').scienceAssessment);
   assert.equal(await page.locator('.quiz-section').evaluate(e=>e.scienceAssessment.store.summary().answered),0,'other course must start with separate response evidence');
   await page.goto(`http://127.0.0.1:${server.address().port}/telescope-observation/?school=${school}`);await page.waitForFunction(()=>!!document.querySelector('.quiz-section').scienceAssessment);
   assert.equal(await page.locator('.quiz-section').evaluate(e=>e.scienceAssessment.store.summary().corrected),4,'original course keeps its base answers after visiting another course');
   assert.deepEqual(errors,[]);await page.close();
  }
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
});
