const assert=require('node:assert/strict');
const {startHarness}=require('./site-storage-harness.cjs');
const {chromium}=require('../game-hub-server/node_modules/playwright');
const course='/learning/inquiry/information-computing/computer-fundamentals/lessons/';
(async()=>{
 const h=await startHarness();let browser;
 try{
  browser=await chromium.launch({headless:true,channel:'msedge'});
  const context=await browser.newContext();const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const open=async id=>{await page.goto(h.base+course+'?lesson='+id+'#lab');await page.waitForSelector('#edition-lab:not([hidden])');};
  // File editing remains part of the model.
  await open('e03');await page.fill('#studyFileEditor','원본을 덮어쓴 내용');await page.click('[data-study-action=save]');
  assert.match(await page.locator('[data-study-folder=documents]').textContent(),/원본을 덮어쓴 내용/);
  await page.click('[data-study-action=reset]');
  await page.fill('#studyFileEditor','수정한 내용');await page.click('[data-study-action=save-as]');
  await page.selectOption('#studyFileDestination','homework');await page.click('[data-study-action=move]');
  assert.match(await page.locator('[data-study-folder=documents]').textContent(),/봄 관찰 기록/);
  assert.match(await page.locator('[data-study-folder=homework]').textContent(),/수정한 내용/);
  // Wrong algorithms still execute and show the actual counterexample.
  await open('j01');await page.click('[data-study-action=run]');
  assert.match(await page.locator('.study-workbench .study-status').textContent(),/목표와 일치/);
  await page.click('[data-study-action=case-negative]');await page.click('[data-study-action=run]');
  assert.match(await page.locator('.study-workbench .study-status').textContent(),/목표와 다릅니다/);
  await page.selectOption('#studyInitial','first');await page.selectOption('#studyEmpty','message');
  for(const key of ['positive','negative','equal','single','empty']){
   await page.click('[data-study-action=case-'+key+']');await page.click('[data-study-action=run]');
   assert.match(await page.locator('.study-workbench .study-status').textContent(),/목표와 일치/);
  }
  // A guest can check an answer without model operations or account storage.
  await open('a02');
  for(const value of [1,0]){
   await page.check('[data-question="0"] input[value="'+value+'"]');await page.click('[data-question="0"] .edition-submit');
   assert.equal(await page.locator('[data-question="0"] .edition-feedback').getAttribute('data-correct'),String(value===0));
  }
  assert.equal(await page.locator('#editionProgress').textContent(),'1 / 3');
  assert.deepEqual(await h.items('computer-literacy'),{});
  assert.deepEqual(errors,[]);console.log('PASS: file operations, algorithm counterexamples, guest feedback without prerequisite.');
 }finally{await browser?.close();await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
