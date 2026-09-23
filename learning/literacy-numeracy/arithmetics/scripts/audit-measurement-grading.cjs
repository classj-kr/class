const assert=require('node:assert/strict');
const {chromium}=require('../../../../game-hub-server/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1280,height:1250}});
 page.on('dialog',dialog=>dialog.accept());
 const base=process.env.ARITHMETIC_AUDIT_URL||'http://localhost:6180';
 const grade=()=>page.getByRole('button',{name:'전체 채점',exact:true}).click();
 const score=()=>page.locator('.counting-progress').textContent();
 try {
  for(const [route,count] of [['grade-6-box-measurement',4],['grade-6-circle',3]]){
   await page.goto(base+'/arithmetic/'+route,{waitUntil:'networkidle'});
   const inputs=page.locator('.worksheet-stage input');
   assert.equal(await inputs.count(),count*2);
   const values=await page.locator('.answer-stage .circle-static-answer').allTextContents();
   await grade();assert.match(await score(),new RegExp('^0/'+count));
   await inputs.nth(0).fill(values[0]);await grade();assert.match(await score(),new RegExp('^0/'+count));
   await inputs.nth(1).fill(values[1]);await grade();assert.match(await score(),new RegExp('^1/'+count));
   for(let i=2;i<values.length;i++)await inputs.nth(i).fill(values[i]);
   await grade();assert.match(await score(),new RegExp('^'+count+'/'+count));
   await inputs.nth(0).fill('0');await grade();assert.match(await score(),new RegExp('^'+(count-1)+'/'+count));
   await page.getByRole('button',{name:'새 문제',exact:true}).click();assert.match(await score(),new RegExp('^0/'+count));
   assert.ok((await inputs.evaluateAll(nodes=>nodes.map(node=>node.value))).every(value=>value===''));
   if(route.includes('box')){
    const kinds=new Set();const batches=new Set();
    for(let seed=1;seed<=24;seed++){
     await page.evaluate(seed=>{Date.now=()=>seed;Math.random=()=>0;},seed);
     await page.getByRole('button',{name:'새 문제',exact:true}).click();
     const current=await page.locator('.worksheet-stage [data-geometry-kind]').evaluateAll(nodes=>nodes.map(node=>node.dataset.geometryKind));
     assert.equal(current.length,4);assert.equal(new Set(current).size,4);current.forEach(kind=>kinds.add(kind));batches.add(current.join(','));
    }
    assert.equal(kinds.size,8);assert.ok(batches.size>10);
   }
   console.log(route+': paired grading, correction, reset, question count PASS');
  }
  await page.goto(base+'/arithmetic/grade-5-prime-numbers',{waitUntil:'networkidle'});
  await grade();assert.equal(await score(),'0/25점');
  const {PRIME_NUMBERS_TO_100}=await import('../lib/prime-number-hundred-chart.ts');
  const buttons=page.locator('.worksheet-stage .prime-number-question');
  for(const n of PRIME_NUMBERS_TO_100)await buttons.nth(n-1).click();
  await grade();assert.equal(await score(),'25/25점');
  await buttons.nth(0).click();await grade();assert.equal(await score(),'24/25점');
  for(let n=2;n<=100;n++)if(!PRIME_NUMBERS_TO_100.includes(n))await buttons.nth(n-1).click();
  await grade();assert.equal(await score(),'0/25점');
  console.log('prime numbers: blank, all correct, wrong selection, select-all PASS');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
