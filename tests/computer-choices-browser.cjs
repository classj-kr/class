const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {chromium}=require('../game-hub-server/node_modules/playwright');
const {startHarness}=require('./site-storage-harness.cjs');
const screenshotWebp=require('./screenshot-webp.cjs');
const base='learning/inquiry/information-computing/computer-fundamentals/';
const data={};
for(const g of ['abc','de','fg','h','ij']){const c={window:{}};vm.runInNewContext(fs.readFileSync(base+'textbook/edition-'+g+'.js','utf8'),c);Object.assign(data,c.window.COMPUTER_EDITION_DATA);}
const questions=d=>[d.labCheck,...d.apply.fields,...d.checks];
(async()=>{
 const h=await startHarness();let browser;
 const out='outputs/computer-choices-20261011';fs.mkdirSync(out,{recursive:true});
 const report={lessons:[],questions:0,choices:0,layouts:0,errors:[]};
 try{
  browser=await chromium.launch({headless:true,channel:'msedge'});
  const context=await browser.newContext({viewport:{width:1366,height:1000}});
  await context.addCookies([{name:'test_user',value:'1',url:h.base}]);
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
  const open=async id=>{await page.goto(h.base+'/'+base+'lessons/?lesson='+id);await page.waitForSelector('#edition');};
  const view=async name=>{await page.locator('.edition-nav [data-page="'+name+'"]').click();await page.waitForSelector('#edition-'+name+':not([hidden])');};
  const saved=async predicate=>{for(let i=0;i<70;i++){if(predicate(await h.items('computer-literacy')))return;await new Promise(r=>setTimeout(r,100));}assert.fail('Storage did not settle');};
  for(const [id,d]of Object.entries(data)){
   await open(id);const qs=questions(d);
   for(let i=0;i<qs.length;i++){
    const q=qs[i],form=page.locator('[data-question="'+i+'"]');
    assert.equal(q.options.length,3);assert.equal(new Set(q.options.map(o=>o[0])).size,3);assert.ok(q.options.every(o=>o[0]&&o[1]));
    await view(i===0?'lab':i<3?'apply':'check');
    assert.equal(await form.locator('legend').textContent(),(i===0?'실습 확인':i<3?'적용 '+i:'문제 '+(i-2))+q.text);
    const order=q.options.map((_,n)=>n).filter(n=>n!==q.answer).concat(q.answer);
    for(const n of order){
     await form.locator('input[value="'+n+'"]').check();
     await form.locator('.edition-submit').click();
     const feedback=form.locator('.edition-feedback');
     assert.equal(await feedback.getAttribute('data-correct'),String(n===q.answer));
     assert.equal(await feedback.textContent(),(n===q.answer?'맞습니다. ':'다시 판단해 보세요. ')+q.options[n][1]);
     report.choices++;
    }
    report.questions++;
   }
   assert.equal(await page.locator('#editionProgress').textContent(),'3 / 3');
   await saved(items=>items['classj:textbook:'+id+':v1']?.completed===true);
   await page.reload();await page.waitForSelector('#editionProgress');assert.equal(await page.locator('#editionProgress').textContent(),'3 / 3');
   for(const width of [1366,390]){
    await page.setViewportSize({width,height:1000});
    for(const name of ['lab','apply','check']){
     await view(name);
     assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),id+' '+name+' '+width);
     const clipped=await page.locator('#edition-'+name+' .edition-option').evaluateAll(nodes=>nodes.some(n=>n.scrollWidth>n.clientWidth+1));
     assert.equal(clipped,false,id+' option text overflow');report.layouts++;
     if(id==='b02'&&name==='apply')await screenshotWebp(page,{path:out+'/b02-apply-'+width+'.webp',fullPage:true});
    }
   }
   report.lessons.push(id);console.log('PASS '+id);
  }
  // A revision from the immediately preceding edition is archived even if an older archive already exists.
  await page.goto(h.base+'/'+base);
  const id='b02',key='classj:textbook:b02:v1',qs=questions(data[id]);
  const legacy={version:1,completed:true,answers:qs.map((q,i)=>({revision:i===2?1:q.revision||1,selected:0,attempts:2,solved:true,firstCorrect:false}))};
  const older={version:1,note:'older archive'};
  await page.evaluate(async({key,legacy,older})=>{for(const [item,value]of [[key,legacy],[key+':before-review-20261010',older]]){const r=await fetch('/api/me/storage/computer-literacy/'+item,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value})});if(!r.ok)throw Error('Seed failed');}},{key,legacy,older});
  await open(id);
  for(let i=0;i<5;i++)assert.equal(await page.locator('[data-question="'+i+'"]').getAttribute('data-solved'),String(i!==2));
  await saved(items=>items[key+':before-choice-review-20261011']!==undefined);
  const items=await h.items('computer-literacy');assert.deepEqual(items[key+':before-choice-review-20261011'],legacy);assert.deepEqual(items[key+':before-review-20261010'],older);
  await view('apply');await page.locator('[data-question="2"] input[value="0"]').check();await page.locator('[data-question="2"] .edition-submit').click();
  await saved(items=>items[key]?.completed===true);await page.reload();await page.waitForSelector('#editionProgress');assert.equal(await page.locator('#editionProgress').textContent(),'3 / 3');
  assert.deepEqual((await h.items('computer-literacy'))[key+':before-choice-review-20261011'],legacy);
  assert.deepEqual(report.errors,[]);report.storageChecks=true;fs.writeFileSync(out+'/verification.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify({lessons:report.lessons.length,questions:report.questions,choices:report.choices,layouts:report.layouts,storageChecks:true}));
 }finally{await browser?.close();await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
