const assert=require('node:assert/strict');
const {startHarness}=require('./site-storage-harness.cjs');
const {chromium}=require('../game-hub-server/node_modules/playwright');
const course='/learning/inquiry/information-computing/computer-fundamentals/lessons/';
(async()=>{
 const h=await startHarness();let browser;
 try{
  browser=await chromium.launch({headless:true,channel:'msedge'});
  const context=await browser.newContext();await context.addCookies([{name:'test_user',value:'2',url:h.base}]);
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const open=async id=>{await page.goto(h.base+course+'?lesson='+id+'#lab');await page.waitForSelector('#studyCapture');};
  const capture=()=>page.click('#studyCapture');
  const answer=async()=>{await page.check('[data-question="0"] input[value="0"]');await page.click('[data-question="0"] .edition-submit');};
  const solved=()=>page.locator('[data-question="0"]').getAttribute('data-solved');
  // Changing configuration without running is not an observation.
  for(const [id,selector] of [['a03','[data-a03-device=ipad]'],['a04','[data-a04-slider]'],['a05','[data-a05-rate="8"]'],['b03','[data-port-cable-choice=video]'],['c01','[data-relay-permission]'],['h05','#transfer-tab-deploy']]){
   await open(id);await capture();
   if(id==='a04')await page.locator(selector).fill('2014');else await page.click(selector);
   await capture();assert.equal(await page.locator('#studyRecords li').count(),0,id+': preparation must not count');
   await answer();assert.equal(await solved(),'false',id+': answer alone must not pass');
  }
  // Overwriting the original is a real failure even if the student has two observations.
  await open('e03');await page.fill('#studyFileEditor','원본을 덮어쓴 내용');await page.click('[data-study-action=save]');await capture();
  await page.click('[data-study-action=save-as]');await page.selectOption('#studyFileDestination','homework');await page.click('[data-study-action=move]');await capture();
  assert.equal(await page.locator('#studyRecords li').count(),2);await answer();assert.equal(await solved(),'false','overwritten original fails the task');
  await page.click('[data-study-action=reset]');await page.click('#studyClear');
  await page.fill('#studyFileEditor','수정한 관찰 기록');await page.click('[data-study-action=save-as]');await capture();
  await page.selectOption('#studyFileDestination','homework');await page.click('[data-study-action=move]');await capture();await answer();assert.equal(await solved(),'true');
  // A positive example does not validate an algorithm with the wrong initial value.
  await open('j01');await page.click('[data-study-action=run]');await capture();await page.click('[data-study-action=case-negative]');await page.click('[data-study-action=run]');await capture();await answer();assert.equal(await solved(),'false');
  await page.selectOption('#studyInitial','first');await page.selectOption('#studyEmpty','message');
  for(const key of ['positive','negative','equal','single','empty']){await page.click('[data-study-action=case-'+key+']');await page.click('[data-study-action=run]');}
  await capture();await answer();assert.equal(await solved(),'true');
  // Revised answers are reset without destroying the previous edition's record.
  const legacy={version:1,labUsed:true,completed:true,answers:Array.from({length:5},()=>({selected:0,attempts:2,solved:true,firstCorrect:false}))};
  const key='classj:textbook:e02:v1';
  await page.evaluate(async({key,value})=>{const r=await fetch('/api/me/storage/computer-literacy/'+key,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value})});if(!r.ok)throw Error('seed failed');},{key,value:legacy});
  await open('e02');
  for(let attempt=0;attempt<50;attempt++){
   if((await h.items('computer-literacy',2))[key+':before-teaching-20261009'])break;
   await new Promise(resolve=>setTimeout(resolve,100));
  }
  assert.deepEqual((await h.items('computer-literacy',2))[key+':before-teaching-20261009'],legacy);
  assert.equal(await solved(),'false');
  await page.reload();await page.waitForSelector('#studyCapture');
  assert.deepEqual((await h.items('computer-literacy',2))[key+':before-teaching-20261009'],legacy,'archive is immutable on later visits');
  assert.deepEqual(errors,[]);console.log('PASS: preparation blocked, task outcomes verified, algorithm counterexample, previous answers archived');
 }finally{await browser?.close();await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
