const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),vm=require('node:vm');
const puppeteer=require('puppeteer-core');
const root=path.resolve(__dirname,'../learning/inquiry/korea-map'),out=path.resolve(__dirname,'../outputs/korea-map-bronze');
const serveRoot=path.resolve(__dirname,'..');
const context={window:{}};
for(const file of ['history-data.js','history-bronze.js'])vm.runInNewContext(fs.readFileSync(path.join(root,'data',file),'utf8'),context);
const data=context.window.KOREA_HISTORY_BRONZE,scene=context.window.KOREA_HISTORY.scenes[0];
assert.equal(scene.id,'gojoseon-distribution');assert.equal(scene.distribution,true);assert.equal(scene.overlay,undefined);
assert.equal(data.artifacts.length,2);assert.equal(data.questions.length,3);
for(const a of data.artifacts){assert.ok(fs.existsSync(path.join(root,a.photo)));assert.ok(a.points.length>10);for(const [x,y] of a.points)assert.ok(x>=scene.bounds[0]&&x<=scene.bounds[2]&&y>=scene.bounds[1]&&y<=scene.bounds[3]);}
for(const q of data.questions){assert.equal(q.options.length,5);assert.equal(new Set(q.options).size,5);assert.ok(q.answer>=0&&q.answer<5);assert.equal(q.distractors.length,5);}
const server=http.createServer((req,res)=>{
 let file=path.resolve(serveRoot,'.'+new URL(req.url,'http://localhost').pathname);
 if(!file.startsWith(serveRoot+path.sep))return res.writeHead(403).end();
 fs.readFile(file,(error,buffer)=>{if(error)return res.writeHead(404).end();res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.svg':'image/svg+xml','.jpg':'image/jpeg','.webp':'image/webp','.json':'application/json','.woff2':'font/woff2'}[path.extname(file)]||'application/octet-stream');res.end(buffer);});
});
(async()=>{
 fs.mkdirSync(out,{recursive:true});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
 try{
  browser=await puppeteer.launch({headless:true,executablePath:process.env.MAP_TEST_BROWSER||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-first-run','--disable-background-networking']});
  const page=await browser.newPage(),errors=[],report=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&/history|heritage\/p0[23]/.test(r.url()))errors.push(r.url());});
  for(const width of [1440,820,390]){
   const mobile=width===390;await page.setViewport({width,height:900,isMobile:mobile,hasTouch:mobile,deviceScaleFactor:mobile?2:1});
   await page.goto(`http://127.0.0.1:${server.address().port}/learning/inquiry/korea-map/index.html#history`,{waitUntil:'networkidle0'});
   await page.waitForFunction(()=>[...document.querySelectorAll('.bronze-artifacts img')].length===2&&[...document.querySelectorAll('.bronze-artifacts img')].every(i=>i.complete&&i.naturalWidth>0));
   await page.evaluate(()=>document.fonts.ready);
   assert.ok(await page.evaluate(()=>document.fonts.check('15px "Korea KoPubWorld Batang"')),'The actual KoPub font must load, not just a fallback');
   const typography=await page.evaluate(()=>{
    const title=getComputedStyle(document.querySelector('.history-scene-heading h3'));
    const header=document.querySelector('.history-scene-heading');
    const body=[...document.querySelectorAll('.bronze-artifacts figcaption,.bronze-artifacts p,.bronze-prompt,.bronze-choice')].map(n=>{const s=getComputedStyle(n);return {size:s.fontSize,weight:s.fontWeight,font:s.fontFamily};});
    return {title:title.fontSize,weight:title.fontWeight,height:header.getBoundingClientRect().height,background:getComputedStyle(header).backgroundColor,body};
   });
   assert.equal(typography.title,'16px');assert.equal(typography.weight,'600');assert.ok(typography.height<=64);
   assert.equal(typography.background,'rgba(0, 0, 0, 0)');
   assert.ok(typography.body.every(s=>s.size==='15px'&&s.weight==='400'&&s.font.includes('Batang')));
   assert.equal(await page.$eval('#historyScene',n=>n.value),scene.id);
   assert.equal(await page.$$eval('.bronze-marker',ns=>ns.length),data.artifacts.reduce((sum,a)=>sum+a.points.length,0));
   assert.equal(await page.$$eval('.leaflet-image-layer',ns=>ns.length),0,'No invented territorial fill for a distribution map');
   assert.equal(await page.$$eval('.bronze-key',ns=>ns.length),2);
   assert.equal(await page.$$eval('.bronze-choices button',ns=>ns.length),5);
   assert.equal(await page.$('.bronze-feedback'),null);
   assert.doesNotMatch(await page.$eval('.history-scene-heading',n=>n.textContent),/고조선/);
   assert.match(await page.$eval('.bronze-choice',n=>getComputedStyle(n).fontFamily),/Batang/);
   assert.equal(await page.$eval('.history-content',n=>n.querySelectorAll('details, summary').length),0);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);assert.ok(overflow<=1);
   await (await page.$('.map-stage')).screenshot({path:path.join(out,`map-${width}.png`)});
   await (await page.$('.history-content')).screenshot({path:path.join(out,`quiz-${width}.png`)});
   async function click(selector){const element=await page.waitForSelector(selector,{visible:true});await element.scrollIntoView();if(mobile)await element.tap();else await element.click();}
   for(const [i,answer] of [0,3,4].entries()){
    await click(`.bronze-choice:nth-child(${answer+1})`);await page.waitForSelector('.bronze-feedback');
    assert.equal(await page.$$eval('.bronze-choice:disabled',ns=>ns.length),5);
    assert.equal(await page.$$eval('.bronze-choice.is-correct',ns=>ns.length),1);
    assert.equal(await page.$$eval('.bronze-choice.is-wrong',ns=>ns.length),answer===data.questions[i].answer?0:1);
    assert.ok((await page.$eval('.bronze-feedback',n=>n.textContent)).includes(data.questions[i].explanation));
    if(i<2){await click('.bronze-next');await page.waitForFunction(n=>document.querySelector('.bronze-progress').textContent===`${n} / 3`,{},i+2);}
   }
   assert.match(await page.$eval('.bronze-score',n=>n.textContent),/1문제 정답/);
   await click('[data-theme="terrain"]');assert.equal(await page.$('.bronze-marker'),null);assert.equal(await page.$('.bronze-study'),null);
   await click('[data-theme="history"]');assert.match(await page.$eval('.bronze-score',n=>n.textContent),/1문제 정답/);
   await click('.bronze-next');await page.waitForFunction(()=>document.querySelector('.bronze-progress').textContent==='1 / 3');
   assert.equal(await page.$('.bronze-feedback'),null);
   for(let i=0;i<data.questions.length;i++){
    const correct=await page.$(`.bronze-choice:nth-child(${data.questions[i].answer+1})`);await correct.focus();await page.keyboard.press('Space');
    await page.waitForSelector('.bronze-feedback');if(i<2){await click('.bronze-next');await page.waitForFunction(n=>document.querySelector('.bronze-progress').textContent===`${n} / 3`,{},i+2);}
   }
   assert.match(await page.$eval('.bronze-score',n=>n.textContent),/3문제 정답/);
   await click('#historyNext');assert.equal(await page.$eval('#historyScene',n=>n.value),'early-states');assert.equal(await page.$('.bronze-marker'),null);
   await click('#historyPrevious');assert.equal(await page.$eval('#historyScene',n=>n.value),scene.id);
   assert.equal(await page.$$eval('.bronze-key',ns=>ns.length),2);
   report.push({width,titleSize:typography.title,bodySize:'15px',bodyWeight:'400',titleHeight:typography.height,koPubLoaded:true,symbols:data.artifacts.reduce((sum,a)=>sum+a.points.length,0),photos:2,questions:3,wrongFeedback:true,retryAndKeyboard:true,overflow});
  }
  assert.deepEqual(errors,[]);console.log(JSON.stringify({report,errors},null,2));
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;});
