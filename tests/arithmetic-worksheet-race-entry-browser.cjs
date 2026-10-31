const {chromium}=require('../game-hub-server/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 for(const [route,width] of [['add-subtract-1',1366],['grade-3-division-1',390]]){
 const page=await browser.newPage({viewport:{width,height:900}});let submitted=null;
 await page.addInitScript(()=>{window.LearningRecords={create:()=>({start:async args=>({checkpoint:args.checkpoint}),addAction:()=>document.createElement('button'),save:async()=>{},showResult:async()=>{}})}});
 await page.route('**/api/**',async r=>{
 const path=new URL(r.request().url()).pathname;
 let data={};
 if(path==='/api/auth/me')data={user:{name:'교사'}};
 if(path==='/api/learning-records/context')data={student:{name:'학생'}};
 if(path==='/api/arithmetic-race'){
 if(r.request().method()==='POST')submitted=r.request().postDataJSON();
 data={roomCode:'123456',participantId:'p1',participantToken:'token1',hostToken:'host1',race:{worksheetName:'검사',worksheetRoute:'/arithmetic/'+route,status:'waiting'},participants:[]};
 }
 await r.fulfill({json:data});
 });
 await page.goto((process.env.ARITHMETIC_TEST_URL || 'http://127.0.0.1:8788')+'/arithmetic/'+route);
 await page.getByRole('button',{name:'순위전 만들기',exact:true}).click();
 const dialog=page.getByRole('dialog');await dialog.waitFor();
 assert.equal(await dialog.locator('select').count(),1,'only duration choice');
 await dialog.locator('select').selectOption('300');
 await dialog.getByRole('button',{name:'취소',exact:true}).click();
 assert.equal(await dialog.isVisible(),false);
 await page.getByRole('button',{name:'순위전 만들기',exact:true}).click();
 await dialog.getByRole('button',{name:'방 만들고 입장',exact:true}).click();
 await page.waitForURL(/\/arithmetic\/race\?room=123456/);
 assert.equal(submitted.worksheetRoute,'/arithmetic/'+route);assert.equal(submitted.durationSeconds,300);assert.equal(submitted.name,'학생');
 console.log('PASS',route,width,'direct create, duration, cancel, roster identity, waiting room redirect');
 await page.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

