const assert=require('node:assert/strict');
const {chromium}=require('../game-hub-server/node_modules/playwright');
const {harness}=require('./learning-records-integration.cjs');
async function main(){
 const h=await harness(), browser=await chromium.launch({channel:'msedge',headless:true});
 const ctx=await browser.newContext({extraHTTPHeaders:{'x-test-user':'1'}});await ctx.route('https://**',r=>r.abort());
 const p=await ctx.newPage(),errors=[];p.on('pageerror',e=>{errors.push(e.message);console.error('PAGE',e.message)});
 p.on('response',async r=>{if(r.url().includes('/api/learning-records')&&r.status()>=400)console.error('API',r.status(),await r.text())});
 const base=h.base+'/learning/literacy-numeracy/';
 const saved=async()=>{await p.waitForTimeout(150);await p.locator('learning-records .status').filter({hasText:'저장 완료'}).waitFor();await p.waitForFunction(()=>![...document.querySelectorAll('main,section')].some(n=>n.inert));};
 const detail=async activity=>{const list=await(await ctx.request.get(h.base+'/api/learning-records/sessions?activity='+activity)).json();return(await(await ctx.request.get(h.base+'/api/learning-records/sessions/'+list.sessions[0].id)).json()).session;};
 const resume=async(activity,url)=>{await saved();const s=await detail(activity);assert.ok(s.events.length);await p.goto(url+'?record='+encodeURIComponent(s.contentKey));await saved();return s;};
 try{
 console.log('Checking hanja lesson');
 let url=base+'hanja-meaning/v2/001/';await p.goto(url);await p.locator('#startQuiz').click();await saved();
 await p.locator('.question .choice').first().click();let s=await resume('hanja-meaning',url);assert.ok(await p.locator('.question .choice:disabled').count());
 console.log('Checking hanja stage');
 url=base+'hanja-meaning/v2/quiz/01/';await p.goto(url);await p.locator('#choices .choice').first().click();await resume('hanja-meaning',url);assert.ok(await p.locator('#choices .choice:disabled').count());
 console.log('Checking phonics');
 url=base+'phonics/';await p.goto(url);await p.locator('[data-lesson]').first().click();await saved();await p.locator('.sound-choice').first().click();await resume('phonics',url);assert.ok(await p.locator('.sound-choice:disabled').count());
 console.log('Checking classical idioms');
 url=base+'classical-chinese-idioms/';await p.goto(url);await p.locator('.lesson-card').first().click();await saved();await p.locator('#currentLessonQuiz').click();await p.locator('#startQuiz').click();await saved();await p.locator('.answer-option').first().click();await resume('classical-chinese-idioms',url);assert.ok(await p.locator('.answer-option:disabled').count());
 console.log('Checking vocabulary');
 url=base+'vocabulary/';await p.goto(url);await p.locator('#recommendedLessonButton').click();await saved();await p.locator('#knownButton').click();s=await resume('vocabulary',url);assert.equal(s.events[0].correct,null);assert.equal(s.summary.firstScored,0);
 await p.locator('#lessonQuizStartButton').click();await saved();const order=await p.locator('#lessonQuizChoices button').allTextContents();await p.locator('#lessonQuizChoices button[data-correct=false]').first().click();s=await resume('vocabulary',url);assert.equal(s.events[0].correct,false);assert.deepEqual(await p.locator('#lessonQuizChoices button').allTextContents(),order);
 await p.locator('#lessonQuizChoices button[data-correct=true]').click();await saved();s=await detail('vocabulary');assert.equal(s.summary.retryCount,1);assert.equal(s.summary.firstCorrect,0);
 await p.getByRole('button',{name:'이번 학습 마치기',exact:true}).click();await p.getByRole('heading',{name:'학습 결과',exact:true}).waitFor();await p.getByRole('button',{name:'닫기',exact:true}).click();
 await p.locator('#gameStartButton').click();await saved();await p.locator('#gameChoices button').first().click();await resume('vocabulary',url);assert.ok(await p.locator('#gameChoices button:disabled').count());
 await p.locator('#backFromGame').click();await p.locator('#spellingGameStartButton').click();await saved();const tiles=await p.locator('#spellingTileRack button').allTextContents();await p.locator('#spellingTileRack button').first().click();await saved();const typed=await p.locator('#spellingInput').inputValue();await p.reload();await saved();assert.equal(await p.locator('#spellingInput').inputValue(),typed);assert.deepEqual(await p.locator('#spellingTileRack button').allTextContents(),tiles);
 await p.locator('#spellingCheckButton').click();await saved();s=await detail('vocabulary');assert.ok(s.events.some(e=>e.response===typed));
 assert.deepEqual(await p.evaluate(()=>Object.keys(localStorage)),[]);assert.deepEqual(errors,[]);
 console.log('PASS hanja, phonics, classical idioms, vocabulary modes: raw answers, stable restore, retry semantics, no local storage.');
 }finally{await browser.close();await h.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1});
