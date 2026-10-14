const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const api=require('../learning/inquiry/science-lab/annulus-model.js'),row=require('../scripts/science-annulus-experiment.cjs');
test('tank setup, thermal contrast and rotation are independent experimental conditions',()=>{
 const dry=api.initial();for(const key of ['ice','heat','tracer','running'])assert.equal(api.change(dry,key,true).state,dry);
 const wet={...dry,filled:true};
 for(const rotation of Object.keys(api.rotations)){
  const uniform={...wet,rotation};assert.equal(api.condition(uniform),'uniform');assert.deepEqual(api.point(uniform,7,60),api.point(uniform,7,0),'uniform fluid in the co-rotating steady frame');
 }
 for(const ice of [false,true])for(const heat of [false,true])for(const rotation of Object.keys(api.rotations)){
  const s={...wet,ice,heat,rotation};
  if(ice||heat)assert.equal(api.condition(s),{off:'overturning',slow:'axisymmetric',wave:'wave',fast:'irregular'}[rotation]);
  for(let i=0;i<140;i++)for(const time of [0,1,10,60,600]){const p=api.point(s,i,time);assert(p.r>.26&&p.r<.85,'tracer must stay in the middle vessel');assert(Number.isFinite(p.a));}
 }
 const thermal={...wet,ice:true,heat:true};
 for(let i=0;i<140;i++)assert(api.point(thermal,i,20).r<api.point(thermal,i,0).r,'surface moves inward without rotation');
 for(const rotation of ['slow','wave','fast'])assert(api.point({...thermal,rotation},5,30).a>api.point({...thermal,rotation},5,0).a,'counter-clockwise upper-layer current');
 const running={...thermal,running:true,time:37};for(const [key,value]of [['rotation','wave'],['ice',false],['heat',false],['material','ink']]){const changed=api.change(running,key,value).state;assert.equal(changed.time,0);assert.equal(changed.running,false);}
});
test('source registry preserves variants, model limits and 2022 elective classification',()=>{
 assert.deepEqual(row.codes,['12지시03-06']);assert.deepEqual(row.activities,['12지시03#4']);assert.equal(row.publisherVariants.length,2);assert.match(row.boundary,/유체 방정식의 수치해가 아니며/);assert.equal(row.questions.length,4);assert.equal(row.followups.length,2);
 for(const q of row.questions){assert.equal(new Set(q.choices).size,4);assert.equal(Object.keys(q.feedback).length,3);}
});
for(const engine of ['chromium','webkit'])test(engine+': tank preparation, moving tracers, fair comparison, reset and diagnosis',{timeout:100000},async()=>{
 const root=path.resolve(__dirname,'../learning/inquiry/science-lab');
 const server=http.createServer((req,res)=>{let p=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!p.startsWith(root+path.sep))return res.writeHead(403).end();if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,'index.html');fs.readFile(p,(e,b)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css'}[path.extname(p)]||'application/octet-stream');res.end(b);});});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});
  const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  await page.goto(`http://127.0.0.1:${server.address().port}/rotating-annulus/`);await page.waitForFunction(()=>!!window.__annulus&&!!document.querySelector('.quiz-section').scienceAssessment);
  await page.locator('#annulusHeat').click();assert.equal(await page.evaluate(()=>window.__annulus.getState().heat),false);assert.match(await page.locator('#annulusStatus').textContent(),/먼저 물/);
  for(const id of ['annulusFill','annulusIce','annulusHeat','annulusTracer'])await page.locator('#'+id).click();
  assert.equal(await page.evaluate(()=>window.__annulus.getCondition()),'overturning');
  const before=await page.locator('#annulusCanvas').evaluate(c=>c.toDataURL());await page.locator('#annulusRun').click();await page.waitForFunction(()=>window.__annulus.getState().time>.25);await page.locator('#annulusRun').click();const paused=await page.evaluate(()=>window.__annulus.getState().time);assert.notEqual(await page.locator('#annulusCanvas').evaluate(c=>c.toDataURL()),before,'observed particles must actually move');await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>window.__annulus.getState().time),paused);
  await page.locator('#annulusStep').click();assert.equal(await page.evaluate(()=>window.__annulus.getState().time),paused+1);
  for(const [value,kind]of [['slow','axisymmetric'],['wave','wave'],['fast','irregular']]){await page.locator('#annulusRotation').selectOption(value);assert.equal(await page.locator('#annulusCanvas').getAttribute('data-condition'),kind);assert.equal(await page.evaluate(()=>window.__annulus.getState().time),0);}
  await page.locator('#annulusRotation').selectOption('wave');await page.locator('#annulusCompare').check();assert.equal(await page.locator('#annulusBaseline').getAttribute('data-condition'),'overturning');
  await page.locator('#annulusIce').click();await page.locator('#annulusHeat').click();assert.equal(await page.locator('#annulusCanvas').getAttribute('data-condition'),'uniform');assert.equal(await page.locator('#annulusBaseline').getAttribute('data-condition'),'uniform');
  await page.locator('#annulusIce').click();await page.locator('#annulusHeat').click();await page.locator('#annulusMaterial').selectOption('ink');assert.equal(await page.evaluate(()=>window.__annulus.getState().material),'ink');
  for(let i=0;i<16;i++)await page.locator('#annulusStep').click();
  for(const view of ['top','side']){
   await page.locator(`[data-annulus-view="${view}"]`).click();
   for(const width of [1280,820,390,320]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,view+' '+width);
    if(engine==='chromium'&&[1280,390].includes(width)){const dir=path.resolve(__dirname,'../docs/science-lab-audit-2026-10-12/annulus');fs.mkdirSync(dir,{recursive:true});await require('./science-screenshot.cjs')(page.locator('.annulus-lab'),path.join(dir,view+'-'+width+'.webp'));}
   }
  }
  await page.locator('#resetExperiment').click();assert.deepEqual(await page.evaluate(()=>window.__annulus.getState()),api.initial());assert.equal(await page.locator('#annulusComparison').isVisible(),false);
  await page.evaluate(()=>document.querySelector('.quiz-section').open=true);await page.waitForFunction(()=>!!document.querySelector('.exam-integrated')?.examController);
  assert.equal(await page.locator('.quiz-card').count(),4);assert.deepEqual((await page.locator('.exam-integrated').evaluate(e=>e.examController.ids())).sort(),row.followups.map(q=>q.id).sort());
  for(const [i,card]of(await page.locator('.quiz-card').all()).entries()){const q=row.questions[i];await card.locator(`input[value="${'abcd'[(q.answer+1)%4]}"]`).check();await card.locator('.answer-button').click();await card.locator(`input[value="${'abcd'[q.answer]}"]`).check();await card.locator('.answer-button').click();assert.match(await card.locator('.answer-result').textContent(),/첫 응답은 오답/);}
  for(let i=0;i<2;i++){const id=await page.locator('.exam-question').getAttribute('data-exam-id'),q=row.followups.find(q=>q.id===id);await page.locator(`[data-exam-answer="${(q.answer+1)%4}"]`).click();await page.locator('.exam-submit').click();assert.equal(await page.locator('.exam-feedback').getAttribute('data-correct'),'false');await page.locator(`[data-exam-answer="${q.answer}"]`).click();await page.locator('.exam-submit').click();assert.match(await page.locator('.exam-feedback').textContent(),/첫 응답은 오답/);if(i===0)await page.locator('[data-exam-next]').click();}
  await page.reload();await page.waitForFunction(()=>!!document.querySelector('.quiz-section').scienceAssessment);await page.evaluate(()=>document.querySelector('.quiz-section').open=true);await page.waitForFunction(()=>!!document.querySelector('.exam-integrated')?.examController);assert.equal(await page.locator('.quiz-section').evaluate(e=>e.scienceAssessment.store.summary().corrected),6);assert.equal(await page.locator('.quiz-section').evaluate(e=>e.scienceAssessment.store.summary().firstCorrect),0);assert.deepEqual(errors,[]);
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
});
