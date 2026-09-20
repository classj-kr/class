// Run with PLAYWRIGHT_MODULE and CHROME_PATH set, against the local atlas preview.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:950}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>localStorage.setItem('classj-globe-layers-v3',JSON.stringify(['current','wind','grid','sea'])));
  await page.route('**/globe/app.js?*',async route=>{const response=await route.fetch();await route.fulfill({response,body:await response.text()+'\nwindow.__startMap=map;'});});
  async function wait(){await page.waitForFunction(()=>window.__startMap?.getSource('atlas-spots'));}
  async function blank(){
   await wait();
   assert.equal(await page.locator('#lessonPractice').count(),0);
   assert.equal(await page.locator('#lessonPanel').isVisible(),false);
   assert.equal(await page.locator('#lessonReopen').isVisible(),false);
   assert.equal(await page.locator('[data-lesson][aria-current]').count(),0);
   assert.equal(await page.locator('#topicList details[open]').count(),0);
   assert.equal(await page.locator('[data-layer][aria-pressed="true"]').count(),0);
   assert.equal(await page.evaluate(()=>location.hash),'');
   const state=await page.evaluate(async()=>({spots:(await __startMap.getSource('atlas-spots').getData()).features.length,wind:__startMap.getLayoutProperty('wind-flow','visibility'),currents:__startMap.getLayoutProperty('currents-line-main','visibility'),grid:__startMap.getLayoutProperty('grid-special','visibility')}));
   assert.deepEqual(state,{spots:0,wind:'none',currents:'none',grid:'none'});
  }
  await page.goto('http://127.0.0.1:5179/learning/inquiry/globe/#currents');await blank();
  await page.waitForTimeout(900);await page.screenshot({path:'tmp/atlas-blank-desktop.png'});
  await page.locator('[data-lesson="currents"]').evaluate(b=>b.closest('details').open=true);
  await page.locator('[data-lesson="currents"]').click();
  await page.waitForFunction(()=>__startMap.getLayoutProperty('wind-flow','visibility')==='visible');
  assert.equal(await page.locator('#lessonPanel h1').textContent(),'북태평양 표층 순환');
  assert.equal(await page.locator('#lessonPractice').isVisible(),true);
  await page.reload();await blank();
  await page.setViewportSize({width:390,height:844});
  await page.reload();await blank();await page.waitForTimeout(500);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:'tmp/atlas-blank-mobile.png'});
  await page.getByRole('button',{name:'평면지도',exact:true}).click();
  await page.waitForTimeout(1200);assert.equal(await page.locator('#lessonPanel').isVisible(),false);
  assert.deepEqual(errors,[]);console.log('Blank entry, old hash, saved layers, selection, reload, mobile and projection checks passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
