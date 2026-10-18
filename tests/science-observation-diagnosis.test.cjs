const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
fs.mkdirSync(path.resolve('docs/science-lab-audit-2026-10-12/course-practices/core-choice'),{recursive:true});
for(const engine of ['chromium','webkit'])test(engine+': observation errors survive apparatus changes, correction and reload; diagnosis returns to the relevant condition',{timeout:90000},async()=>{
 const browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});
 try{
  const p=await browser.newPage({viewport:{width:768,height:1024},hasTouch:true}),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  const base=process.env.SCIENCE_BASE_URL||'http://127.0.0.1:18765/learning/inquiry/science-lab/';
  const go=async slug=>{await p.goto(base+slug+'/');await p.waitForSelector('.supplement-check[data-question-id]');await p.waitForFunction(()=>!!document.querySelector('.quiz-section')?.scienceAssessment&&!!document.querySelector('.supplement-check button:not(:disabled)'));};
  const evidence=id=>p.locator('.quiz-section').evaluate((e,id)=>e.scienceAssessment.store.evidence(id),id);
  const question=()=>p.locator('.supplement-check').evaluate(e=>document.querySelector('.quiz-section').scienceAssessment.store.questions.get(e.dataset.questionId));
  const choose=async (q,answer)=>p.locator('.supplement-check [data-check-answer="'+answer+'"]').tap();
  await go('refraction');let q=await question(),wrong=q.choices.find(c=>c.id!==q.answer).id;await choose(q,wrong);
  await p.locator('[data-supplement-choice=optic][data-value=concaveMirror]').tap();assert.equal((await question()).id,q.id);assert.equal((await evidence(q.id)).first,wrong);
  assert(await p.locator('.supplement-check [data-check-answer="'+wrong+'"]').isDisabled());await p.locator('.supplement-reset').tap();assert.equal((await evidence(q.id)).first,wrong);
  await choose(q,q.answer);assert.equal((await evidence(q.id)).status,'corrected');const correctedFeedback=await p.locator('.supplement-check-feedback').textContent();assert.match(correctedFeedback,/정답입니다\./);assert(correctedFeedback.includes(q.feedback[wrong]),'Interpret the retained first choice, not just the latest answer');
  await p.reload();await p.waitForSelector('[data-assessment-ready]',{state:'attached'});await p.waitForSelector('.supplement-check[data-question-id]');assert.equal((await evidence(q.id)).first,wrong);assert.equal((await evidence(q.id)).status,'corrected');
  assert.equal(await p.locator('.supplement-check button:disabled').count(),q.choices.length);assert.equal(await p.locator('.supplement-check-feedback').textContent(),correctedFeedback,'Restore the same choice-specific interpretation on reload');
  await require('./science-screenshot.cjs')(p.locator('.curriculum-supplement'),path.resolve('docs/science-lab-audit-2026-10-12/course-practices/core-choice/'+engine+'-optics-correction-768.webp'));
  await go('seasons');const ids=[];
  for(const kind of ['annual','daynight']){
   await p.locator('[data-supplement-choice=kind][data-value='+kind+']').tap();q=await question();ids.push(q.id);wrong=q.choices.find(c=>c.id!==q.answer).id;await choose(q,wrong);await choose(q,q.answer);assert.equal((await evidence(q.id)).status,'corrected');
  }
  await p.reload();await p.waitForSelector('[data-assessment-ready]',{state:'attached'});await p.waitForSelector('.supplement-check[data-question-id]');
  for(const id of ids)assert.equal((await evidence(id)).status,'corrected','Restore also the non-default observation questions');
  await p.locator('.quiz-section summary').tap();
  const annual=await p.locator('.quiz-section').evaluate((e,id)=>e.scienceAssessment.store.questions.get(id).question,ids[0]);await p.locator('.science-diagnosis').getByRole('button',{name:annual,exact:true}).tap();assert.equal(await p.locator('[data-supplement-choice=kind][data-value=annual]').getAttribute('aria-pressed'),'true');assert.equal((await question()).id,ids[0]);
  await p.locator('.science-diagnosis').getByRole('button',{name:'새로 풀기',exact:true}).tap();assert.equal(await evidence(ids[0]),null);assert.equal(await evidence(ids[1]),null);assert.equal(await p.locator('.supplement-check button:not(:disabled)').count(),3);
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
