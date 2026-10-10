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
  const record=()=>page.click('#studyCapture');
  const check=async expected=>{await page.check('[data-question="0"] input[value="0"]');await page.click('[data-question="0"] .edition-submit');assert.equal(await page.locator('[data-question="0"]').getAttribute('data-solved'),String(expected));};
  const sample=async raw=>{await page.locator('[data-a04-slider]').fill(raw);await page.click('[data-a04-capture]');await record();};
  await open('a04');await sample('2011');await sample('2074');await check(false);await sample('2011');await sample('2014');await check(true);
  await open('a05');await page.click('[data-a05-record]');await page.click('[data-a05-save=a]');await record();
  await page.click('[data-a05-rate="8"]');await page.click('[data-a05-record]');await page.click('[data-a05-save=b]');await record();await check(false);
  await page.click('[data-a05-bits="3"]');await page.click('[data-a05-record]');await page.click('[data-a05-save=a]');await record();await check(true);
  await open('b01');await record();assert.equal(await page.locator('#studyRecords li').count(),0);
  await page.click('[data-study-action=memory-open]');await page.fill('#studyMemoryEditor','봄, 여름');await record();
  await page.click('[data-study-action=memory-power]');await page.click('[data-study-action=memory-open]');await record();assert.equal(await page.inputValue('#studyMemoryEditor'),'봄');await check(false);
  await page.fill('#studyMemoryEditor','봄, 여름');await page.click('[data-study-action=memory-save]');await page.click('[data-study-action=memory-power]');await page.click('[data-study-action=memory-open]');await record();assert.equal(await page.inputValue('#studyMemoryEditor'),'봄, 여름');await check(true);
  await open('h03');await page.click('[data-browser-suggestion=도서관]');await record();assert.equal(await page.locator('#studyRecords li').count(),0);
  await page.click('[data-result-card=libraryArchive]>button');await record();await check(false);
  await page.click('[data-browser-new-tab]');await page.click('[data-browser-suggestion=혜성]');await page.click('[data-result-card=comet]>button');await record();await check(false);
  await page.click('[data-browser-new-tab]');await page.click('[data-browser-suggestion=도서관]');await page.click('[data-result-card=libraryCurrent]>button');await record();await check(true);
  await open('i01');await page.fill('[data-account-name]','student01');await page.fill('[data-account-secret]','cedar27');await page.click('[data-account-next]');await page.fill('[data-account-code]','482169');await page.click('[data-account-next]');await record();assert.equal(await page.locator('#studyRecords li').count(),0);
  await page.click('[data-permission-attempt=assignment]');await record();await page.click('[data-permission-attempt=grades]');await record();await check(false);
  await page.click('[data-permission-attempt=edit]');await record();await check(true);
  await open('j03');await page.click('[data-debug-run]');await record();await page.fill('[data-debug-code]','/pictures/');await page.click('[data-debug-run]');await record();await check(false);
  await page.click('[data-debug-case=dog]');await page.click('[data-debug-case=missing]');await record();await check(true);
  // A question revision preserves the existing course record, including observations.
  const key='classj:textbook:i01:v1',legacy={version:1,labUsed:true,completed:true,investigation:{revision:2,records:['이전 관찰 A','이전 관찰 B'],passed:true},answers:Array.from({length:5},()=>({revision:2,selected:0,attempts:1,solved:true,firstCorrect:true}))};
  await page.evaluate(async({key,legacy})=>{const r=await fetch('/api/me/storage/computer-literacy/'+key,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:legacy})});if(!r.ok)throw Error('seed failed');},{key,legacy});
  await open('i01');await check(false);
  for(let i=0;i<50;i++){if((await h.items('computer-literacy',2))[key+':before-review-20261010'])break;await new Promise(resolve=>setTimeout(resolve,100));}
  assert.deepEqual((await h.items('computer-literacy',2))[key+':before-review-20261010'],legacy);
  await page.reload();await page.waitForSelector('#studyCapture');assert.deepEqual((await h.items('computer-literacy',2))[key+':before-review-20261010'],legacy);
  assert.deepEqual(errors,[]);console.log('PASS: six lesson tasks reject incomplete evidence; revision archive survives reload.');
 }finally{await browser?.close();await h.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
