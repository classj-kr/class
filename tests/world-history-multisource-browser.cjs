const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),cp=require('node:child_process');
const express=require('../game-hub-server/node_modules/express');
const {chromium}=require('../game-hub-server/node_modules/playwright');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'outputs/qa/world-history-multisource');fs.mkdirSync(out,{recursive:true});
const save=async(page,name)=>cp.execFileSync('python',['-c','import sys,io; from PIL import Image; Image.open(io.BytesIO(sys.stdin.buffer.read())).save(sys.argv[1], "WEBP", lossless=True)',path.join(out,name+'.webp')],{input:await page.screenshot(),windowsHide:true});
(async()=>{
 const {PHOTOS}=await import('../learning/inquiry/globe/history/photos.mjs');
 const {SCENES}=await import('../learning/inquiry/globe/history/content.mjs');
 const specs=JSON.parse(fs.readFileSync(path.join(root,'scripts/world-history-photos.json')));
 const added=PHOTOS.filter(p=>specs.find(s=>s.id===p.id).sourceId!=='source-00');
 const app=express();app.use(express.static(root));const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
 const browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-unsafe-swiftshader']});
 const base=`http://127.0.0.1:${server.address().port}/learning/inquiry/globe/history/`,result={viewports:[],clicks:0,materials:0,topics:0,errors:[]};
 try{
 for(const width of [1366,768,390]){
  const page=await browser.newPage({viewport:{width,height:768}});page.on('pageerror',e=>result.errors.push(e.message));
  await page.goto(base+'?topic=frank');await page.waitForFunction(()=>document.querySelectorAll('.map-place').length>0&&document.querySelector('#mapStatus').textContent==='');
  for(const material of added){
   await page.locator('#openTopics').click();await page.locator(`[data-topic="${Object.keys(material.bindings)[0]}"]`).click();
   await page.locator('#openExplanation').click();await page.locator(`#explanationBody [data-photo="${material.id}"]`).click();
   const body=await page.locator('#photoBody').innerText();assert.ok(body.includes(material.observe),material.id);assert.ok(body.includes(material.connection),material.id);
   assert.ok(!/미래엔|천재교육|동아출판|출처|자료에서 살펴보기|지도와 연결하기/.test(body),material.id);
   if(material.src){await page.locator('#photoBody img').evaluate(img=>img.decode());assert.equal(await page.locator('#photoBody img').evaluate(img=>img.naturalWidth>0&&img.getBoundingClientRect().width<=img.naturalWidth+1),true,material.id);}
   if(width>650&&material.src){const bounds=await page.locator('.photo-view').evaluate(el=>({image:el.querySelector('img').getBoundingClientRect().right,text:el.querySelector('.photo-reading').getBoundingClientRect().left}));assert.ok(bounds.image<=bounds.text,material.id+' image overlaps text');}
   assert.equal(await page.locator('#photoDialog').evaluate(el=>el.scrollWidth<=el.clientWidth+1),true,material.id);
   if(['aachen-cathedral','ashoka-pillar','ashoka-edict','bandung-conference'].includes(material.id))await save(page,`${width}-${material.id}`);
   if((material.compareWith||[]).length){await page.locator('#photoBody [data-photo]').first().click();await page.locator('#photoBody img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));}
   await page.locator('[data-close="photoDialog"]').click();await page.locator('[data-close="explanationDialog"]').click();result.materials++;
  }
  const topics=width===1366?SCENES:SCENES.filter(s=>['frank','ming','tang','cold-war'].includes(s.id));
  for(const scene of topics){
   await page.locator('#openTopics').click();await page.locator(`[data-topic="${scene.id}"]`).click();
   await page.waitForFunction(()=>document.querySelector('#mapStatus').textContent==='');
   const steps=Math.max(scene.steps?.length||0,1);
   for(let step=0;step<steps;step++){
    if(scene.steps?.length){await page.locator(`[data-step="${step}"]`).click();await page.waitForFunction(()=>document.querySelector('#mapStatus').textContent==='');}
    const places=scene.steps?.[step].places||scene.places;
    for(const place of places){
     await page.getByRole('button',{name:place.label+' 설명',exact:true}).click();
     assert.equal(await page.locator('#placeDetail strong').textContent(),place.label);result.clicks++;
    }
   }
   if(['frank','ming','tang','cold-war'].includes(scene.id)){await page.locator('#hideCard').click();await save(page,`${width}-map-${scene.id}`);await page.locator('#showCard').click();}
   result.topics++;
  }
  await page.locator('#quizMode').click();await page.locator('#revealAnswer').click();await page.locator('#nextQuestion').click();await page.locator('#revealAnswer').click();await page.locator('#nextQuestion').click();await page.locator('#exitQuiz').click();
  assert.equal(await page.locator('.question-mark').count(),0);
  result.viewports.push(width);console.log(JSON.stringify({width,materials:result.materials,clicks:result.clicks,topics:result.topics}));await page.close();
 }
 assert.deepEqual(result.errors,[]);fs.writeFileSync(path.join(out,'browser-results.json'),JSON.stringify(result,null,2));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1)});
