const assert=require('node:assert/strict');
const {chromium}=require('../game-hub-server/node_modules/playwright');
const {harness}=require('./learning-records-integration.cjs');
async function main(){
 const h=await harness(),browser=await chromium.launch({channel:'msedge',headless:true});
 const c=await browser.newContext({viewport:{width:1440,height:1000}});
 await c.route('**/api/learning-records/**',async r=>{const req=r.request(),res=await fetch(h.base+new URL(req.url()).pathname+new URL(req.url()).search,{method:req.method(),headers:{'x-test-user':'1','content-type':'application/json'},...(req.postData()?{body:req.postData()}: {})});await r.fulfill({status:res.status,contentType:'application/json',body:await res.text()});});
 await c.route('**/assets/learning-records.js*',async r=>r.fulfill({path:require('node:path').resolve(__dirname,'../assets/learning-records.js'),contentType:'application/javascript'}));
 const p=await c.newPage(),errors=[];p.on('pageerror',e=>{errors.push(e.message);console.error(e.message)});
 const saved=async()=>{await p.waitForTimeout(250);await p.locator('learning-records .status').filter({hasText:'저장 완료'}).waitFor({timeout:90000});};
 try{
 console.log('Checking arithmetic typed worksheet');
 await p.goto('http://localhost:4176/arithmetic/add-subtract-1',{timeout:90000});await saved();
 let input=p.locator('input:not([type=hidden])').first();await input.fill('9');await saved();
 await p.getByRole('button',{name:'전체 채점',exact:true}).click();await saved();
 const request=async route=>(await fetch(h.base+'/api/learning-records'+route,{headers:{'x-test-user':'1'}})).json();
 let list=await request('/sessions?activity=arithmetic'),s=(await request('/sessions/'+list.sessions[0].id)).session;
 assert.equal(s.events.length,1,'unanswered boxes do not become wrong answer records');assert.equal(s.events[0].correct,false);assert.ok(s.events[0].snapshot.problem);
 await p.reload();await saved();assert.equal(await p.locator('input:not([type=hidden])').first().inputValue(),'9');
 await p.locator('input:not([type=hidden])').first().fill('8');await p.getByRole('button',{name:'전체 채점',exact:true}).click();await saved();
 s=(await request('/sessions/'+s.id)).session;assert.equal(s.events.length,2);assert.equal(s.events[1].attemptNumber,2);
 await p.getByRole('button',{name:'이번 학습 마치기',exact:true}).click();await p.getByRole('heading',{name:'학습 결과',exact:true}).waitFor();
 assert.deepEqual(await p.evaluate(()=>Object.keys(localStorage)),[]);assert.deepEqual(errors,[]);
 await p.screenshot({path:'outputs/learning-records-review/arithmetic-records.png',fullPage:false});
 console.log('Checking fraction fields and Set restoration');
 await p.goto('http://localhost:4176/arithmetic/grade-3-fraction-2');await saved();
 await p.locator('input:not([type=hidden])').first().fill('2');await p.getByRole('button',{name:'전체 채점',exact:true}).click();await saved();
 list=await request('/sessions?activity=arithmetic');s=(await request('/sessions/'+list.sessions[0].id)).session;assert.ok(s.events.length>=1);assert.ok(s.events[0].response.text.includes('2'));
 await p.reload();await saved();assert.equal(await p.locator('input:not([type=hidden])').first().inputValue(),'2');
 await p.goto('http://localhost:4176/arithmetic/grade-5-prime-numbers');await saved();await p.getByRole('button',{name:'2, 선택 안 됨',exact:true}).click();await p.getByRole('button',{name:'전체 채점',exact:true}).click();await saved();await p.reload();await saved();assert.equal(await p.getByRole('button',{name:'2, 선택됨',exact:true}).count(),1);
 console.log('Checking choice and diagram worksheets');
 for(const route of ['high-school/logarithms','high-school/space-geometry-projections']){
   await p.goto('http://localhost:4176/arithmetic/'+route);await saved();await p.getByRole('button',{name:'답안 입력',exact:true}).click();
   await p.locator('.trig-derivative-choice').first().click();await p.getByRole('dialog').getByRole('button',{name:'전체 채점',exact:true}).click();await saved();
   list=await request('/sessions?activity=arithmetic');s=(await request('/sessions/'+list.sessions[0].id)).session;assert.equal(s.events.length,1);assert.ok(s.events[0].snapshot.problem.choices,route+' '+JSON.stringify(s.events[0].snapshot));
   await p.reload();await saved();await p.getByRole('button',{name:'답안 입력',exact:true}).click();assert.equal(await p.locator('.trig-derivative-choice.is-selected').count(),1);
 }
 console.log('Checking partial fields and query separation');
 await p.goto('http://localhost:4176/arithmetic/grade-5-polygon-measurement');await saved();await p.locator('input:not([type=hidden])').first().fill('999');await p.getByRole('button',{name:'전체 채점',exact:true}).click();await saved();
 list=await request('/sessions?activity=arithmetic');s=(await request('/sessions/'+list.sessions[0].id)).session;assert.equal(s.events.length,1,'only filled half of a two-field problem is recorded');
 const ids=[];
 for(const kind of ['plane-geometry','solid-geometry']){await p.goto('http://localhost:4176/arithmetic/middle-school/curriculum-calculations?kind='+kind);await saved();list=await request('/sessions?activity=arithmetic');const found=list.sessions.find(s=>s.contentKey.endsWith('kind='+kind));assert.ok(found);ids.push(found.id);}
 assert.notEqual(ids[0],ids[1]);
 assert.deepEqual(errors,[]);
 console.log('PASS arithmetic: raw answer, no blank grading events, refresh restore, retry, completion.');
 }finally{await browser.close();await h.close()}
}
main().catch(e=>{console.error(e);process.exitCode=1});
