const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const api=require('../learning/inquiry/science-lab/science-assessment.js'),bank=require('../learning/inquiry/science-lab/exam-bank.js'),map=require('../learning/inquiry/science-lab/curriculum-map.js'),content=require('../learning/inquiry/science-lab/assessment-content.js');
const q={id:'q',question:'입사각 30°',choices:[{id:'a',text:'30°'},{id:'b',text:'60°'}],answer:'a',why:'두 각은 법선을 기준으로 같다.'};
test('first answer survives correction, duplicate submissions, reload and shuffled choices',()=>{
 const values=new Map(),storage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
 const s=api.session('test',[q],storage);assert.equal(s.submit('q','missing'),null);assert.equal(s.summary().answered,0);
 s.submit('q','b');s.submit('q','b');s.submit('q','a');assert.equal(s.summary().firstCorrect,0);assert.equal(s.summary().corrected,1);assert.equal(s.evidence('q').attempts.length,2);
 const restored=api.session('test',[{...q,choices:[...q.choices].reverse()}],storage);assert.equal(restored.evidence('q').first,'b');assert.equal(restored.evidence('q').last,'a');
 const changed=api.session('test',[{...q,answer:'b'}],storage);assert.equal(changed.summary().answered,0,'changed key invalidates stale grading');
 assert.equal(api.session('test',[{...q,data:{rows:[[1,2]]}}],storage).summary().answered,0,'changed observation data invalidates stale grading');
 restored.reset();assert.equal(restored.summary().answered,0);assert.equal(api.session('test',[q],storage).summary().answered,0);
});
test('missing/corrupt/denied storage and repeated guesses cannot turn first error into mastery',()=>{
 for(const storage of [null,{getItem:()=>'{bad',setItem:()=>{}},{getItem:()=>{throw Error('denied');},setItem:()=>{throw Error('denied');}}]){
  const s=api.session('test',[q],storage);for(let i=0;i<100;i++)s.submit('q',i%2?'a':'b');assert.equal(s.evidence('q').first,'b');assert(s.evidence('q').attempts.length<=20);assert.equal(s.summary().firstCorrect,0);
 }
});
test('fresh transfer answer is distinguished from correcting the same item',()=>{
 const follow={...q,id:'transfer',checks:['q']},s=api.session('transfer',[q,follow]);s.submit('q','b');s.submit('q','a');assert.equal(s.summary().responses[0].transferVerified,false);
 s.submit('transfer','a');assert.equal(s.summary().responses[0].transferVerified,true);
 s.submit('transfer','b');assert.equal(s.summary().responses[0].transferVerified,false);
});
test('all supplied existing questions and new transfer items have valid assessment feedback',()=>{
 const reviewed=require('../scripts/review-science-questions.cjs').read();assert.equal(reviewed.length,Object.keys(map).length*4+bank.questions.length);
 for(const q of reviewed){const s=api.session(q.id,[q]);for(const c of q.choices){const r=s.submit(q.id,c.id);assert.equal(r.correct,String(c.id)===String(q.answer));const text=api.feedback(q,r);if(r.correct)assert(text.includes(q.why));else assert.equal(text,'다시 생각하고 다른 답을 골라보세요.','wrong answers must not reveal the key or explanation');}}
 for(const [slug,items]of Object.entries(content.followups)){assert(map[slug]);for(const item of items){assert(item.id);assert.equal(new Set(item.choices).size,item.choices.length);assert(item.answer>=0&&item.answer<item.choices.length);assert(item.why.length>20);}}
 assert.equal(content.followups.refraction[0].choices[content.followups.refraction[0].answer],'70°');
 assert(!bank.forApp('refraction',map).some(q=>q.code==='9과10-04'),'sound items must not leak in through a shared unit host');
 for(const [slug,m]of Object.entries(map))for(const q of bank.forApp(slug,map))assert(m.codes.includes(q.code)&&m.grades.includes(q.grade));
});
for(const engine of ['chromium','webkit'])test(engine+': all registered apps preserve first responses and integrate diagnostics',{timeout:300000},async()=>{
 const root=path.resolve(__dirname,'../learning/inquiry/science-lab');
 const server=http.createServer((req,res)=>{let p=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(p!==root&&!p.startsWith(root+path.sep))return res.writeHead(403).end();if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,'index.html');fs.readFile(p,(e,b)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css'}[path.extname(p)]||'application/octet-stream');res.end(b);});});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});const origin='http://127.0.0.1:'+server.address().port,slugs=Object.keys(map),errors=[];let cursor=0,count=0;
 await Promise.all(Array.from({length:3},async()=>{const page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 await page.route('**/lab-ui.js*',async r=>{if(new URL(page.url()).pathname==='/refraction/')await new Promise(resolve=>setTimeout(resolve,200));await r.continue();});
 while(cursor<slugs.length){const slug=slugs[cursor++];await page.goto(origin+'/'+slug+'/');await page.waitForSelector('[data-assessment-ready]',{state:'attached'});
  if(['measurement','wave-transfer'].includes(slug))await page.waitForFunction(()=>!!window.__digitalInquiry);
  assert.equal(await page.locator('textarea,#hypothesis,#conclusion,[data-export],[data-records],a[href*="activity-workbench"],a[href*="exam-review.html"]').count(),0,slug+' must lead from experiment to questions without worksheets or detours');
  const result=await page.evaluate(()=>{const section=document.querySelector('.quiz-section'),a=section.scienceAssessment,issues=[];for(const card of section.querySelectorAll('.quiz-card')){
   const button=card.querySelector('.answer-button'),inputs=[...card.querySelectorAll('input[type=radio]')],wrong=inputs.find(i=>i.value!==card.dataset.answer),right=inputs.find(i=>i.value===card.dataset.answer);
   wrong.click();if(a.store.evidence(card.dataset.questionId))issues.push('selection graded before submit');button.click();if(!wrong.checked||!wrong.disabled||right.disabled)issues.push('wrong answer must leave the other options available');
   if(card.querySelector('.answer-result').textContent!=='다시 생각하고 다른 답을 골라보세요.'||!card.querySelector('.answer-explanation').hidden)issues.push('wrong answer leaked feedback');right.click();button.click();
   const r=a.store.evidence(card.dataset.questionId);if(r.first!==wrong.value||!r.correct||r.firstCorrect)issues.push('first error overwritten');
  }return{issues,summary:a.store.summary()};});
  assert.deepEqual(result.issues,[],slug);assert.equal(result.summary.answered,4,slug);assert.equal(result.summary.corrected,4,slug);assert.equal(result.summary.firstCorrect,0,slug);count+=4;
  await page.reload();await page.waitForSelector('[data-assessment-ready]',{state:'attached'});assert.equal(await page.locator('.quiz-section').evaluate(e=>e.scienceAssessment.store.summary().corrected),4,slug+' reload');
  if(['refraction','lens-image'].includes(slug)){
   await page.locator('.quiz-section summary').click();await page.waitForFunction(()=>!!document.querySelector('.exam-widget')?.examController);
   const ids=await page.locator('.exam-widget').evaluate(e=>e.examController.ids());assert(!ids.includes('9과10-04'));assert(ids.includes(slug==='refraction'?'refraction@normal-transfer':'lens-image@screen-transfer'));assert.equal(await page.locator('.exam-local').count(),0);assert.equal(await page.locator('.quiz-section').evaluate(e=>e.scienceAssessment.store.summary().total),4+ids.length,'bank joins the same session even when loaded before DOMContentLoaded');
   const initialQuestion=bank.questions.find(q=>q.id===ids[0])||content.followups[slug][0],initialWrong=(initialQuestion.answer+1)%initialQuestion.choices.length;await page.locator('[data-exam-answer="'+initialWrong+'"]').click();assert.equal(await page.locator('.exam-feedback').textContent(),'');await page.locator('.exam-submit').click();assert.doesNotMatch(await page.locator('.exam-feedback').textContent(),/정답[:은]|정답입니다/);
   for(const [i,id]of ids.entries()){const q=bank.questions.find(q=>q.id===id)||content.followups[slug].find(q=>q.id===id);await page.locator('[data-exam-answer="'+q.answer+'"]').click();await page.locator('.exam-submit').click();assert.equal(await page.locator('.exam-feedback').getAttribute('data-correct'),'true',id);if(i<ids.length-1)await page.locator('[data-exam-next]').click();}
   if(slug==='lens-image')assert.equal(await page.locator('.quiz-section').evaluate(e=>e.scienceAssessment.store.summary().responses.filter(r=>r.id.includes('#q')&&r.transferVerified).length),2,'corrected transfer item is not counted as a fresh first-answer success');
   for(const width of [390,1024]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);const out=path.resolve(process.env.SCIENCE_ASSESSMENT_CAPTURE_DIR||'docs/science-lab-audit-2026-10-11/assessment-repair');fs.mkdirSync(out,{recursive:true});await require('./science-screenshot.cjs')(page.locator('.science-diagnosis'),path.join(out,`${slug}-diagnosis-${engine}-${width}.webp`));await require('./science-screenshot.cjs')(page.locator('.quiz-card').first(),path.join(out,`${slug}-question-${engine}-${width}.webp`));}
   await page.locator('.science-diagnosis>button').filter({hasText:'새로 풀기'}).click();assert.equal(await page.locator('.quiz-section').evaluate(e=>e.scienceAssessment.store.summary().answered),0);assert.equal(await page.locator('.exam-feedback').textContent(),'');
  }
 }
 await page.close();}));
 const page=await browser.newPage();await page.goto(origin+'/');assert.equal(await page.locator('a[href*="exam-review"],a[href*="activity-workbench"]').count(),0);
 await page.goto(origin+'/activity-workbench.html?activity=4%EA%B3%BC08%231');await page.waitForURL(origin+'/');assert.equal(await page.locator('#hypothesis,#conclusion,#record,#records').count(),0);await page.close();assert.equal(count,slugs.length*4);assert.deepEqual(errors,[]);console.log(engine+': '+slugs.length+' apps / '+count+' first errors retained through correction and reload');
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
});
