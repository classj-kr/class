const assert=require('node:assert/strict');
const {chromium}=require('../game-hub-server/node_modules/playwright');
const {harness}=require('./learning-records-integration.cjs');
async function main(){const h=await harness(),b=await chromium.launch({channel:'msedge',headless:true});const c=await b.newContext({extraHTTPHeaders:{'x-test-user':'1'}});await c.route('https://**',r=>r.abort());const p=await c.newPage(),errors=[];p.on('pageerror',e=>{errors.push(e.message);console.error(e.message)});
 const saved=async()=>{await p.waitForTimeout(180);await p.locator('learning-records .status').filter({hasText:'저장 완료'}).waitFor();};
 const detail=async a=>{const list=await(await c.request.get(h.base+'/api/learning-records/sessions?activity='+a)).json();return(await(await c.request.get(h.base+'/api/learning-records/sessions/'+list.sessions[0].id)).json()).session;};
 try{
 console.log('Checking poetry');
 const savePoetry=async action=>{
   const response=p.waitForResponse(r=>/\/api\/learning-records\/sessions\/[^/]+\/changes$/.test(r.url())&&r.status()===200);
   await action();const session=(await(await response).json()).session;
   await p.waitForFunction(()=>!document.getElementById('bookScreen').inert);return session;
 };
 const originalLayout=async(selector,screenshot)=>{
   for(const viewport of [{width:1400,height:1000},{width:390,height:844}]){
     await p.setViewportSize(viewport);
     await p.waitForFunction(()=>!document.querySelector('#spread').getAnimations().some(a=>a.playState==='running'));
     const layout=await p.evaluate(selector=>{
       const measure=()=>{const{x,y,width,height}=document.querySelector(selector).getBoundingClientRect();return{x,y,width,height,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight};};
       const host=document.querySelector('learning-records'),before=measure();host.remove();const original=measure();document.body.append(host);return{before,original};
     },selector);
     assert.deepEqual(layout.before,layout.original,'poetry '+selector+' keeps its original layout at '+viewport.width);
     assert.equal(await p.locator('learning-records .strip, learning-records button').count(),0,'no record controls in poetry');
     if(screenshot)await p.screenshot({path:'output/learning-records-review/poetry-'+screenshot+(viewport.width===390?'-mobile.png':'-desktop.png')});
   }
   await p.setViewportSize({width:1400,height:1000});
 };
 let url=h.base+'/learning/literacy-numeracy/story-books/poetry/';await p.goto(url);
 await originalLayout('#shelfScreen','shelf');
 await savePoetry(()=>p.locator('[data-book-idx]').first().click());
 await originalLayout('#book');
 await savePoetry(()=>p.locator('[data-jump-spread]').first().click());
 await originalLayout('#book','reading');
 await savePoetry(()=>p.locator('#nextBtn').click());
 await originalLayout('#book');
 await savePoetry(()=>p.locator('.quiz-choice[data-correct="0"]').first().click());
 let s=await detail('poetry');assert.equal(s.events.filter(e=>e.kind==='answer')[0].correct,false);
 await savePoetry(()=>p.goto(url+'?record='+s.contentKey));
 assert.ok(await p.locator('.quiz-choice.incorrect').count());
 await savePoetry(()=>p.locator('.quiz-choice[data-correct="1"]').first().click());
 s=await detail('poetry');assert.equal(s.summary.firstCorrect,0);assert.equal(s.summary.retryCount,1);
 await savePoetry(()=>p.locator('#tocBtn').click());
 await savePoetry(()=>p.locator('[data-jump-spread]').last().click());
 await savePoetry(()=>p.locator('#nextBtn').click());
 const completed=await savePoetry(()=>p.locator('#nextBtn').click());
 assert.equal(completed.status,'completed','last explanation automatically completes the reading');
 assert.equal(await p.locator('learning-records dialog[open]').count(),0,'no completion popup');
 await originalLayout('#book');
 const reviewed=await savePoetry(()=>p.locator('#tocBtn').click());
 assert.equal(reviewed.status,'completed');assert.equal(reviewed.completedAt,completed.completedAt);
 await savePoetry(()=>p.locator('[data-jump-spread]').first().click());
 await savePoetry(()=>p.locator('#nextBtn').click());
 assert.ok(await p.locator('.quiz-choice.correct').count());assert.ok(await p.locator('.quiz-choice.incorrect').count());
 await p.getByRole('button',{name:'뒤로 가기',exact:true}).click();await p.locator('#shelfScreen').waitFor();
 const nextBook=await savePoetry(()=>p.locator('[data-book-idx]').nth(1).click());
 assert.equal(nextBook.status,'active','completion state does not leak into another collection');
 assert.notEqual(nextBook.id,completed.id);assert.deepEqual(await p.evaluate(()=>Object.keys(localStorage)),[]);
 console.log('Checking selfcheck');url=h.base+'/learning/literacy-numeracy/metacognition/grade4.html';await p.goto(url);await p.locator('#startBtn').click();await p.locator('#choiceGroup button').first().click();await p.locator('#confidenceGroup button').first().click();await saved();s=await detail('metacognition');assert.equal(s.events.length,0,'no live correctness during selfcheck');const question=await p.locator('#qPrompt').innerText(),choices=await p.locator('#choiceGroup button').allTextContents();await p.reload();await p.locator('#startBtn').click();assert.equal(await p.locator('#qPrompt').innerText(),question);assert.deepEqual(await p.locator('#choiceGroup button').allTextContents(),choices);assert.equal(await p.locator('#choiceGroup [aria-checked=true]').count(),1);
 const total=Number(await p.locator('#qTotal').innerText());for(let i=0;i<total;i++){if(i>0){await p.locator('#choiceGroup button').first().click();await p.locator('#confidenceGroup button').first().click();}await p.locator('#nextBtn').click();}
 await p.getByRole('heading',{name:'학습 결과',exact:true}).waitFor();s=await detail('metacognition');assert.equal(s.status,'completed');assert.equal(s.events.length,total);assert.ok(s.events.every(e=>e.snapshot.prompt));assert.deepEqual(await p.evaluate(()=>Object.keys(localStorage)),[]);assert.deepEqual(errors,[]);console.log('PASS poetry original desktop/mobile layout, no toolbar, restore, retries, automatic completion and review; selfcheck deferred scoring and results.');
 }finally{await b.close();await h.close();}}
 main().catch(e=>{console.error(e);process.exitCode=1});
