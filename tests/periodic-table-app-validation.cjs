const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const http=require('node:http');const puppeteer=require('puppeteer-core');
const root=path.resolve(__dirname,'..'), route='/learning/inquiry/periodic-table/';
const dir=path.join(root,'tmp/periodic-app-validation');fs.mkdirSync(dir,{recursive:true});
const report={passed:[],failed:[],errors:[],badResources:[],viewports:[],controlCases:0};
async function check(name,fn){try{await fn();report.passed.push(name);}catch(e){report.failed.push({name,message:e.message});}}
const answers={states:1,phase:2,gas:0,atom:1,orbital:2,config:0,bond:1,classify:1,reaction:2,solution:0,equilibrium:1,acid:0,redox:1};
const server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');fs.readFile(file,(err,data)=>{res.writeHead(err?404:200,{'Content-Type':{'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.woff2':'font/woff2'}[path.extname(file)]||'application/octet-stream'});res.end(err?'Not found':data);});});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;try{
 browser=await puppeteer.launch({headless:true,executablePath:process.env.SCIENCE_BROWSER||'C:/Program Files/Google/Chrome/Application/chrome.exe'});const page=await browser.newPage();await page.setViewport({width:1440,height:1000});
 await page.setRequestInterception(true);page.on('request',r=>new URL(r.url()).hostname==='127.0.0.1'?r.continue():r.abort());page.on('pageerror',e=>report.errors.push(e.message));page.on('response',r=>{if(r.status()>=400)report.badResources.push({url:r.url(),status:r.status()});});
 await page.goto(`http://127.0.0.1:${server.address().port}${route}`,{waitUntil:'networkidle0'});await page.evaluate(()=>document.fonts.ready);
 await check('No banners, slogans or defensive footnotes',async()=>{assert.equal(await page.$$eval('.matter-intro,.model-heading,.model-note,.model-references',a=>a.length),0);});
 await check('18px exam font is downloaded and applied',async()=>{const values=await page.evaluate(()=>({loaded:[...document.fonts].some(f=>f.family==='KoPubWorld Batang'&&f.status==='loaded'),styles:['#modelKey','#modelQuestion','.model-answers button'].map(s=>({size:getComputedStyle(document.querySelector(s)).fontSize,family:getComputedStyle(document.querySelector(s)).fontFamily}))}));assert.ok(values.loaded);for(const s of values.styles){assert.equal(s.size,'18px');assert.match(s.family,/KoPubWorld Batang/);}});
 for(const id of Object.keys(answers)){
  await page.click(`[data-model="${id}"]`);
  const controls=await page.$$eval('#modelControls [data-key]',els=>els.map(e=>({id:e.id,tag:e.tagName,min:e.min,max:e.max,options:e.tagName==='SELECT'?[...e.options].map(o=>o.value):[]})));
  await check(`${id}: all control choices and range ends`,async()=>{for(const c of controls){if(c.tag==='SELECT'){for(const v of c.options){if(await page.$eval('#'+c.id,e=>e.disabled))continue;await page.select('#'+c.id,v);report.controlCases++;}}else{await page.focus('#'+c.id);await page.keyboard.press('Home');assert.equal(await page.$eval('#'+c.id,e=>e.value),c.min);await page.keyboard.press('End');assert.equal(await page.$eval('#'+c.id,e=>e.value),c.max);report.controlCases+=2;}assert.doesNotMatch(await page.$eval('#modelFacts',e=>e.textContent),/NaN|undefined/);} });
  await page.click('#modelReset');
  await check(`${id}: wrong-answer retry and correct feedback`,async()=>{const correct=answers[id],wrong=(correct+1)%3;await page.click(`[data-answer="${wrong}"]`);assert.equal(await page.$eval(`[data-answer="${wrong}"]`,e=>e.disabled),true);assert.match(await page.$eval('#modelFeedback',e=>e.textContent),/다시/);await page.click(`[data-answer="${correct}"]`);assert.equal(await page.$$eval('#modelAnswers button',els=>els.every(e=>e.disabled)),true);assert.match(await page.$eval('#modelFeedback',e=>e.textContent),/정답입니다/);});
 }
 for(const width of [320,390,768,1024,1440,1920]){
  await page.setViewport({width,height:900});
  for(const id of Object.keys(answers)){
   await page.$eval(`[data-model="${id}"]`,e=>e.click());
   await check(`${width}px ${id}: page and controls fit`,async()=>{const size=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:innerWidth,controls:[...document.querySelectorAll('#modelControls label')].map(e=>({w:e.clientWidth,scroll:e.scrollWidth})),texts:[...document.querySelectorAll('#modelStage svg text')].map(e=>{const b=e.getBBox();return {text:e.textContent,left:b.x,right:b.x+b.width};}).filter(b=>b.left<0||b.right>801)}));assert.ok(size.page<=width+1,`${size.page} > ${width}`);assert.ok(size.controls.every(c=>c.scroll<=c.w+1),'control label clipped');assert.deepEqual(size.texts,[],'SVG label outside viewBox');});
  }
  if(width<=800){
   await check(`${width}px answer choices stay compact`,async()=>{const heights=await page.$$eval('#modelAnswers button',els=>els.map(e=>e.getBoundingClientRect().height));assert.ok(heights.every(h=>h<=160),JSON.stringify(heights));});
   await page.$eval('[data-model="orbital"]',e=>e.click());
   await check(`${width}px orbital fits without horizontal scrolling`,async()=>{const bounds=await page.evaluate(()=>{const stage=document.querySelector('#modelStage'),canvas=stage.querySelector('canvas');return {viewport:stage.clientWidth,width:canvas.getBoundingClientRect().width,scroll:stage.scrollWidth};});assert.ok(bounds.width<=bounds.viewport+1);assert.ok(bounds.scroll<=bounds.viewport+1);});
  }
  report.viewports.push(width);
  if(width===390||width===1440){await page.$eval('[data-model="states"]',e=>e.click());await page.screenshot({path:path.join(dir,`states-${width}.png`),fullPage:true});await page.$eval('[data-model="orbital"]',e=>e.click());await page.screenshot({path:path.join(dir,`orbital-${width}.png`),fullPage:true});}
 }
 await page.setViewport({width:1440,height:1000});await page.click('#tabExploreBtn');
 await check('Both periodic table scopes and filters',async()=>{assert.equal(await page.$$eval('.element-cell',els=>els.length),20);await page.click('[data-table-mode="full"]');assert.equal(await page.$$eval('.element-cell',els=>els.length),118);await page.click('[data-table-mode="exam"]');await page.type('#searchInput','헬륨');assert.equal(await page.$$eval('.element-cell:not(.filtered-out)',els=>els.length),1);await page.$eval('#searchInput',e=>{e.value='';e.dispatchEvent(new Event('input',{bubbles:true}));});});
 await page.focus('.element-cell[data-number="2"]');await page.keyboard.press('Enter');
 await check('Element dialog exposes content and receives keyboard focus',async()=>{assert.equal(await page.$eval('#modalOverlay',e=>e.getAttribute('aria-hidden')),'false');assert.equal(await page.$eval('.element-modal',e=>e.getAttribute('role')),'dialog');assert.equal(await page.evaluate(()=>document.activeElement.id),'closeModalBtn');});
 await check('Tab and Shift+Tab remain inside dialog',async()=>{await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>document.querySelector('.element-modal').contains(document.activeElement)));await page.keyboard.down('Shift');await page.keyboard.press('Tab');await page.keyboard.up('Shift');assert.ok(await page.evaluate(()=>document.querySelector('.element-modal').contains(document.activeElement)));});
 await page.keyboard.press('Escape');
 await check('Closing dialog restores focus to the element',async()=>{assert.equal(await page.$eval('#modalOverlay',e=>e.getAttribute('aria-hidden')),'true');assert.equal(await page.evaluate(()=>document.activeElement.dataset.number),'2');});
 await page.click('#tabMoleculeBtn');const count=await page.$$eval('.compound-card',els=>els.length);
 await check('All molecule cards load and reset',async()=>{assert.ok(count>=10);for(let i=0;i<count;i++){const cards=await page.$$('.compound-card');await cards[i].click();assert.equal(await page.$$eval('.compound-card.active',els=>els.length),1);assert.ok(await page.$eval('#labSelectionSummary',e=>e.textContent.trim().length>0));}await page.click('#resetLabBtn');assert.equal(await page.$$eval('.compound-card.active',els=>els.length),0);});
 await page.click('#tabModelsBtn');await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await page.reload({waitUntil:'networkidle0'});
 await check('Reduced motion starts paused',async()=>{assert.equal(await page.$eval('#modelPause',e=>e.getAttribute('aria-pressed')),'true');const before=await page.$eval('#modelStage canvas',e=>e.toDataURL());await new Promise(r=>setTimeout(r,150));assert.equal(await page.$eval('#modelStage canvas',e=>e.toDataURL()),before);});
 await check('No application errors or missing local resources',async()=>{assert.deepEqual(report.errors,[]);assert.deepEqual(report.badResources,[]);});
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));fs.writeFileSync(path.join(dir,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed.length,failed:report.failed,controlCases:report.controlCases,viewports:report.viewports,errors:report.errors,resources:report.badResources},null,2));if(report.failed.length)process.exitCode=1;}})().catch(e=>{console.error(e);process.exitCode=1;});
