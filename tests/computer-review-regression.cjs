const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const {startHarness}=require('./site-storage-harness.cjs');
const {chromium}=require('../game-hub-server/node_modules/playwright');
const course='/learning/inquiry/information-computing/computer-fundamentals/lessons/';
(async()=>{
 const h=await startHarness();let browser;
 try{
  browser=await chromium.launch({headless:true,channel:'msedge'});
  const context=await browser.newContext();await context.addCookies([{name:'test_user',value:'2',url:h.base}]);
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const open=async id=>{await page.goto(h.base+course+'?lesson='+id+'#lab');await page.waitForSelector('#edition-lab:not([hidden])');};
  const feedback=page.locator('[data-question="0"] .edition-feedback');
  const submit=()=>page.click('[data-question="0"] .edition-submit');
  const saved=async predicate=>{for(let i=0;i<60;i++){if(predicate(await h.items('computer-literacy',2)))return;await new Promise(resolve=>setTimeout(resolve,100));}assert.fail('account storage did not reach the expected state');};
  // The reported memory lesson must explain an answer before any model activity.
  await open('b01');
  assert.equal(await page.locator('#studyCapture,#studyClear,#studyPrediction,#studyExplanation,.study-notebook').count(),0);
  await submit();assert.equal(await feedback.textContent(),'답을 하나 선택하세요.');
  await page.check('[data-question="0"] input[value="1"]');await submit();
  assert.equal(await feedback.getAttribute('data-correct'),'false');assert.match(await feedback.textContent(),/다시 판단/);
  await page.check('[data-question="0"] input[value="0"]');await page.locator('[data-question="0"] .edition-submit').press('Enter');
  assert.equal(await feedback.getAttribute('data-correct'),'true');assert.match(await feedback.textContent(),/^맞습니다\./);
  assert.equal(await page.locator('#editionProgress').textContent(),'1 / 3');
  // Actual RAM/SSD editing still works after removing generic free-response fields.
  await page.click('[data-study-action=memory-open]');await page.fill('#studyMemoryEditor','봄, 여름');
  await page.click('[data-study-action=memory-power]');await page.click('[data-study-action=memory-open]');
  assert.equal(await page.inputValue('#studyMemoryEditor'),'봄');
  await page.fill('#studyMemoryEditor','봄, 여름');await page.click('[data-study-action=memory-save]');
  await page.click('[data-study-action=memory-power]');await page.click('[data-study-action=memory-open]');
  assert.equal(await page.inputValue('#studyMemoryEditor'),'봄, 여름');
  const out='outputs/computer-simple-practice-20261010';fs.mkdirSync(out,{recursive:true});
  await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:out+'/b01-lab-1440.png',fullPage:true});
  await page.setViewportSize({width:390,height:900});await page.screenshot({path:out+'/b01-lab-390.png',fullPage:true});
  await saved(items=>items['classj:textbook:b01:v1']?.answers[0].solved===true);
  await page.reload();await page.waitForSelector('#editionProgress');assert.equal(await page.locator('#editionProgress').textContent(),'1 / 3');
  assert.match(await feedback.textContent(),/이전에 해결한/);
  // Preserve completed answers and prior student writing, without rendering a notebook.
  const source={window:{}};vm.runInNewContext(fs.readFileSync('learning/inquiry/information-computing/computer-fundamentals/textbook/edition-ij.js','utf8'),source);
  const data=source.window.COMPUTER_EDITION_DATA.i01,questions=[data.labCheck,...data.apply.fields,...data.checks];
  const key='classj:textbook:i01:v1';
  const legacy={version:1,labUsed:true,completed:true,investigation:{revision:3,prediction:'이전 예상',explanation:'이전 설명',records:['이전 관찰 A','이전 관찰 B'],passed:true},answers:questions.map(q=>({revision:q.revision||1,selected:0,attempts:1,solved:true,firstCorrect:true}))};
  const seed=async value=>page.evaluate(async({key,value})=>{const r=await fetch('/api/me/storage/computer-literacy/'+key,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value})});if(!r.ok)throw Error('seed failed');},{key,value});
  await seed(legacy);await open('i01');assert.equal(await page.locator('#editionProgress').textContent(),'3 / 3');
  await page.check('[data-question="0"] input[value="1"]');await submit();
  await saved(items=>items[key]?.answers[0].attempts===2);
  assert.deepEqual((await h.items('computer-literacy',2))[key].investigation,legacy.investigation);
  await page.reload();await page.waitForSelector('#editionProgress');assert.equal(await page.locator('#editionProgress').textContent(),'3 / 3');
  // Changed question revisions still archive the original record.
  await page.goto(h.base+course+'../');
  legacy.answers.forEach(a=>a.revision=2);
  await seed(legacy);await open('i01');
  assert.equal(await page.locator('[data-question="0"]').getAttribute('data-solved'),'false');
  await page.check('[data-question="0"] input[value="0"]');await submit();assert.equal(await feedback.getAttribute('data-correct'),'true');
  await saved(items=>items[key+':before-review-20261010']!==undefined);
  assert.deepEqual((await h.items('computer-literacy',2))[key+':before-review-20261010'],legacy);
  await page.reload();await page.waitForSelector('#edition');assert.deepEqual((await h.items('computer-literacy',2))[key+':before-review-20261010'],legacy);
  assert.deepEqual(errors,[]);console.log('PASS: immediate feedback, keyboard submission, memory model, saved completion, preserved writing and revision archive.');
 }finally{await browser?.close();await h.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
