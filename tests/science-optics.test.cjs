const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),crypto=require('crypto'),path=require('path');
const model=require('../learning/inquiry/science-lab/optics-comparison.js'),course=require('../scripts/science-optics-course.cjs'),scenario=require('./science-optics-scenario.cjs'),clip=require('./science-svg-clipping.cjs'),shot=require('./science-screenshot.cjs');
const optics=['plane','convexMirror','concaveMirror','convexLens','concaveLens'],distances=['near','middle','far'];
const dir=path.resolve(process.env.SCIENCE_TEST_ARTIFACTS||'tmp/science-optics-tests');
test('optical source files, symmetric plane image and the three convergence regimes',()=>{
 const proof=require('../docs/science-lab-audit-2026-10-12/course-practices/optics/source-review.json');
 for(const s of proof.sources)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(s.path)).digest('hex'),s.sha256);
 for(const optic of optics)for(const distance of distances){
  const r=model(optic,distance),converging=['concaveMirror','convexLens'].includes(optic);
  assert.equal((r.svg.match(/data-ray-direction="light"/g)||[]).length,4);
  if(optic==='plane'){assert.equal(r.v,-r.u);assert.equal(r.m,1);}
  else assert(Math.abs(1/r.u+1/r.v-1/(converging?60:-60))<1e-12);
  assert.equal(r.m>0,!converging||distance==='near');
  assert.equal(Math.abs(r.m)>1,converging&&distance!=='far');
  assert.equal((r.svg.match(/data-ray="extension"/g)||[]).length,r.v<0?2:0);
 }
 for(const[i,q]of course.questions.entries())assert.deepEqual(require('../learning/inquiry/science-lab/assessment-content.js').misconceptions['refraction#q'+(i+1)].feedback,q.feedback);
});
for(const engine of ['chromium','webkit'])test(engine+': all optical conditions, direction arrows and twelve retained misconception responses',{timeout:240000},async()=>{
 const pw=require('playwright'),browser=await pw[engine].launch({headless:true,...engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{}}),errors=[];
 fs.mkdirSync(dir,{recursive:true});
 const open=async()=>{const context=await browser.newContext({...engine==='webkit'?pw.devices['iPad (gen 7)']:{deviceScaleFactor:1.25},viewport:{width:768,height:1024},hasTouch:true}),p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));await p.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());await p.goto('http://127.0.0.1:18765/learning/inquiry/science-lab/refraction/');await p.waitForSelector('[data-assessment-ready]',{state:'attached'});await p.waitForSelector('[data-optics-part=device]',{state:'attached'});return {context,p};};
 try{
  const {context,p}=await open();
  for(const width of [1366,1180,1024,820,768,390]){await p.setViewportSize({width,height:width===820?1180:1024});for(const optic of optics)for(const distance of distances){
   await p.evaluate(scenario,optic+':'+distance);await p.evaluate(()=>new Promise(r=>requestAnimationFrame(r)));
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,width+' '+optic+':'+distance);
   assert.deepEqual(await p.evaluate(clip),[]);assert.equal(await p.locator('[data-ray-direction=light]').count(),4);
   assert.deepEqual(await p.locator('[data-supplement-choice]').evaluateAll(es=>es.filter(e=>e.getBoundingClientRect().height<43.5||e.scrollWidth>e.clientWidth+2).map(e=>e.textContent)),[]);
   const expected=model(optic,distance);assert.equal(Number(await p.locator('[data-magnification]').getAttribute('data-magnification')),expected.m);
  }}
  for(const medium of ['water','glass'])for(const direction of ['in','out'])for(const angle of direction==='in'?[0,1,30,60,85]:[0,1,20,30,40]){
   await p.evaluate(scenario,'ray:'+medium+':'+direction+':'+angle);const r=await p.evaluate(()=>__rayModel.solve());
   assert.equal(r.theta1,angle);assert.equal(r.reflect,angle);assert.equal(r.total,false);
   assert(Math.abs(r.n1*Math.sin(r.theta1*Math.PI/180)-r.n2*Math.sin(r.theta2*Math.PI/180))<1e-12);
   assert.equal(await p.locator('#resultReflect').textContent(),angle+'°');assert.equal(await p.locator('#resultRefract').textContent(),angle===0?'꺾이지 않음':direction==='in'?'법선 쪽':'법선에서 멀어짐');
  }
  const check=p.locator('.supplement-check');await p.waitForFunction(()=>!!document.querySelector('.supplement-check button:not(:disabled)'));
  const q=await check.evaluate(e=>document.querySelector('.quiz-section').scienceAssessment.store.questions.get(e.dataset.questionId)),wrong=q.choices.find(c=>c.id!==q.answer).id;
  await check.locator('[data-check-answer="'+wrong+'"]').tap();await p.evaluate(scenario,'concaveMirror:middle');await p.locator('.supplement-reset').tap();await check.locator('[data-check-answer="'+q.answer+'"]').tap();assert((await check.innerText()).includes(q.feedback[wrong]));
  await p.reload();await p.waitForSelector('[data-assessment-ready]',{state:'attached'});await p.waitForFunction(()=>!!document.querySelector('.supplement-check[data-question-id]'));
  assert((await check.innerText()).includes(q.feedback[wrong]));await context.close();
  for(let wrongIndex=0;wrongIndex<3;wrongIndex++){
   const {context:c,p:qp}=await open();await qp.locator('.quiz-section>summary').tap();
   for(const[i,q]of course.questions.entries()){const card=qp.locator('.quiz-card').nth(i),wrong=Object.keys(q.feedback)[wrongIndex];await card.locator('input[value='+wrong+']').check();await card.locator('.answer-button').tap();await card.locator('input[value='+'abcd'[q.answer]+']').check();await card.locator('.answer-button').tap();assert((await card.innerText()).includes(q.feedback[wrong]));}
   await qp.locator('.supplement-reset').tap();assert.equal(await qp.locator('.quiz-card[data-state=correct]').count(),4);await qp.reload();await qp.waitForSelector('[data-assessment-ready]',{state:'attached'});await qp.locator('.quiz-section>summary').tap();
   for(const[i,q]of course.questions.entries())assert((await qp.locator('.quiz-card').nth(i).innerText()).includes(q.feedback[Object.keys(q.feedback)[wrongIndex]]));
   if(wrongIndex===0)await shot(qp.locator('.quiz-card').nth(3),path.join(dir,engine+'-interpretation.webp'));await c.close();
  }
  assert.deepEqual(errors,[]);console.log(engine+': 90 optical viewport states, 12 wrong options and observation error retained after correction, reset and reload');
 }finally{await browser.close();}
});
