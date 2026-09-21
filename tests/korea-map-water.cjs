const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),vm=require('node:vm');
const puppeteer=require('puppeteer-core'),root=path.resolve(__dirname,'..'),app=path.join(root,'learning/inquiry/korea-map');
const deployedURL=process.env.MAP_TEST_URL;
const out=path.join(root,deployedURL?'outputs/korea-map-water-deployed':'outputs/korea-map-water');
const ctx={window:{}};
for(const file of ['data/flow-data.js','water-scene.js','coast-scene.js'])vm.runInNewContext(fs.readFileSync(path.join(app,file),'utf8'),ctx);
const collection=JSON.parse(fs.readFileSync(path.join(app,'data/watersheds.geojson'),'utf8'));
assert.equal(collection.features.length,10);assert.equal(Object.keys(collection.aliases).length,12);
assert.equal(collection.aliases['남한강'],collection.aliases['한강']);assert.equal(collection.aliases['북한강'],collection.aliases['한강']);
assert.notEqual(collection.aliases['임진강'],collection.aliases['한강']);
for(const f of collection.features){assert.ok(['Polygon','MultiPolygon'].includes(f.geometry.type));assert.ok(f.properties.sourceAreaKm2>1000);assert.ok(f.properties.memberIds.length);}
const tracks=ctx.window.KoreaFlowData.riverTracks(JSON.parse(fs.readFileSync(path.join(app,'data/major-rivers.geojson'),'utf8')));
for(const name of ['남한강','북한강']){
 const route=ctx.window.KoreaWaterScene.routeFor(tracks,name);assert.equal(route.length,1);
 assert.deepEqual(route[0][0],tracks.find(t=>t.name===name).coordinates[0]);
 assert.deepEqual(route[0].at(-1),tracks.find(t=>t.name==='한강').coordinates.at(-1));
 assert.ok(route[0].slice(1).every((p,i)=>ctx.window.KoreaWaterScene.km(route[0][i],p)<20),'no invented long joining line');
}
assert.equal(ctx.window.KoreaWaterScene.routeFor(tracks,'압록강').length,2,'disconnected river parts stay separate');
assert.equal(ctx.window.KoreaCoastScene.tideAt(0).level,0);assert.equal(ctx.window.KoreaCoastScene.tideAt(50).level,1);
assert.ok(ctx.window.KoreaCoastScene.tideAt(50).shore<ctx.window.KoreaCoastScene.tideAt(0).shore);
const globe={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'learning/inquiry/globe/data/globe-data.js'),'utf8'),globe);
for(const c of ctx.window.KoreaCoastScene.currents){const original=globe.window.GLOBE_DATA.currents.features.find(f=>f.properties.name===c.name);assert.equal(JSON.stringify(c.coordinates),JSON.stringify(original.geometry.coordinates[0]));}
let failBasins=false;
const server=http.createServer((req,res)=>{
 const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
 if(!file.startsWith(root+path.sep))return res.writeHead(403).end();
 if(failBasins&&file.endsWith('watersheds.geojson'))return res.writeHead(503).end();
 fs.readFile(file,(error,buffer)=>{
  if(error)return res.writeHead(404).end();
  if(file.endsWith(path.join('leaflet','leaflet.js')))buffer=Buffer.concat([buffer,Buffer.from('\nwindow.testMaps={};L.Map.addInitHook(function(){window.testMaps[this.getContainer().id]=this;});')]);
  res.setHeader('Content-Type',{'.js':'text/javascript; charset=utf-8','.css':'text/css','.html':'text/html; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2','.webp':'image/webp','.geojson':'application/geo+json','.pdf':'application/pdf'}[path.extname(file)]||'application/octet-stream');res.end(buffer);
 });
});
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
(async()=>{
 if(!deployedURL)await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
 try{
  fs.mkdirSync(out,{recursive:true});browser=await puppeteer.launch({headless:true,executablePath:process.env.MAP_TEST_BROWSER||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-first-run','--disable-background-networking']});
  const page=await browser.newPage(),errors=[],report={testedURL:deployedURL||'local fixture',physicalDevice:false};page.on('pageerror',e=>errors.push(e.message));
  const url=deployedURL||'http://127.0.0.1:'+server.address().port+'/learning/inquiry/korea-map/index.html';
  await page.setRequestInterception(true);page.on('request',r=>{
   if(failBasins&&r.url().includes('/watersheds.geojson'))return r.respond({status:503,body:'Test-only response failure'});
   return r.url().startsWith(new URL(url).origin+'/')||r.url().startsWith('data:')?r.continue():r.abort();
  });
  await page.setViewport({width:1440,height:1000});await page.goto(url+'?lesson=river#terrain',{waitUntil:'networkidle0'});
  await page.waitForFunction(()=>document.querySelector('#sceneInsight')?.dataset.basin==='한강');
  assert.equal(await page.$eval('#sceneRiver',e=>e.value),'남한강');
  assert.equal(await page.$eval('#sceneInsight',e=>e.dataset.routePieces),'1');
  let position=await page.$eval('#sceneInsight',e=>e.dataset.position);
  await page.$eval('#waterProgress',e=>{e.value=100;e.dispatchEvent(new Event('input',{bubbles:true}));});
  assert.notEqual(await page.$eval('#sceneInsight',e=>e.dataset.position),position);
  const last=await page.$eval('#sceneInsight',e=>e.dataset.position.split(',').map(Number));
  assert.ok(ctx.window.KoreaWaterScene.km(last,tracks.find(t=>t.name==='한강').coordinates.at(-1))<.01);
  await page.click('.water-life summary');await page.click('#waterPlaces');
  assert.ok(await page.$$eval('.water-place-pin',els=>els.length>=3));
  assert.ok(await page.$eval('.scene-insight',e=>getComputedStyle(e).fontFamily.includes('KoPubWorld Batang')));
  const openButtons=await page.$$eval('[data-water-open]',els=>els.map(e=>e.dataset.waterOpen));
  assert.ok(openButtons.length>=1);await page.click('[data-water-open="'+openButtons[0]+'"]');
  await page.waitForSelector('dialog[open]');await page.evaluate(()=>document.querySelector('dialog[open]').close());
  // Travel dialog may focus another map region; restore river before screenshot.
  await page.select('#sceneRiver','북한강');await page.select('#sceneRiver','남한강');
  await page.screenshot({path:path.join(out,'river-desktop.png'),fullPage:true});
  for(const name of Object.keys(collection.aliases)){
   await page.select('#sceneRiver',name);await page.waitForFunction(()=>!!document.querySelector('#sceneInsight')?.dataset.basin);
   assert.equal(await page.$eval('#waterProgress',e=>e.value),'0');
  }
  await page.select('#lessonSelect','coast');await page.waitForSelector('#coastInsight');
  assert.ok(await page.$eval('.scene-toolbar',e=>e.hidden));assert.ok(await page.$eval('.geography-flow-canvas',e=>e.hidden));
  assert.equal(await page.$('#sceneInsight'),null);
  assert.equal(await page.$$eval('.coast-current-line',els=>els.length),3);
  let dash=await page.$eval('.coast-current-line',e=>getComputedStyle(e).strokeDashoffset);await delay(180);assert.notEqual(await page.$eval('.coast-current-line',e=>getComputedStyle(e).strokeDashoffset),dash);
  await page.click('#coastFit');await page.screenshot({path:path.join(out,'coast-currents.png'),fullPage:true});
  await page.click('[data-coast-mode="tide"]');assert.equal(await page.$$('.coast-current-line').then(a=>a.length),0);
  const low=await page.$eval('#coastInsight',e=>e.dataset.shore);
  await page.$eval('#tidePhase',e=>{e.value=50;e.dispatchEvent(new Event('input',{bubbles:true}));});
  assert.equal(await page.$eval('#coastInsight',e=>e.dataset.tideLevel),'1.000');assert.ok(Number(await page.$eval('#coastInsight',e=>e.dataset.shore))<Number(low));
  await page.$eval('#tidePhase',e=>{e.value=75;e.dispatchEvent(new Event('input',{bubbles:true}));});assert.ok((await page.$eval('#tideStatus',e=>e.textContent)).includes('썰물'));
  await page.screenshot({path:path.join(out,'coast-tides.png'),fullPage:true});
  await page.click('[data-coast-mode="current"]');
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);dash=await page.$eval('.coast-current-line',e=>getComputedStyle(e).strokeDashoffset);await delay(160);assert.equal(await page.$eval('.coast-current-line',e=>getComputedStyle(e).strokeDashoffset),dash);
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
  await page.evaluate(()=>document.querySelector('#recordDialog').showModal());assert.ok(await page.$eval('.leaflet-coastWater-pane',e=>e.hidden));await page.evaluate(()=>document.querySelector('#recordDialog').close());
  await page.evaluate(()=>{location.hash='history';});await delay(250);assert.equal(await page.$('#coastInsight'),null);assert.equal(await page.$$('.coast-current-line').then(a=>a.length),0);assert.equal(await page.$$('.water-place-pin').then(a=>a.length),0);
  report.viewports=[];
  for(const width of [390,820,1440]){
   await page.setViewport({width,height:1000,deviceScaleFactor:width===390?3:1,isMobile:width===390,hasTouch:width===390});
   for(const lesson of ['river','coast']){
    await page.goto(url+'?lesson='+lesson+'#terrain',{waitUntil:'networkidle0'});
    if(lesson==='river'){await page.waitForFunction(()=>!!document.querySelector('#sceneInsight')?.dataset.basin);await page.click('.water-life summary');}
    else await page.click('[data-coast-mode="tide"]');
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);assert.ok(overflow<=1,`${width} ${lesson} ${overflow}`);
    report.viewports.push({width,lesson,overflow});await page.screenshot({path:path.join(out,`${lesson}-${width}.png`),fullPage:true});
   }
  }
  await page.setViewport({width:390,height:844,deviceScaleFactor:3,isMobile:true,hasTouch:true});
  const cdp=await page.createCDPSession();await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
  await page.goto(url+'#terrain',{waitUntil:'networkidle0'});await page.waitForSelector('.geography-flow-canvas');
  const before=await page.$eval('.geography-flow-canvas',e=>Number(e.dataset.frames));await delay(1500);const after=await page.$eval('.geography-flow-canvas',e=>Number(e.dataset.frames));
  report.mobileEmulation={width:390,dpr:3,cpuSlowdown:4,framesIn1500ms:after-before,physicalDevice:false};assert.ok(after-before>=10,JSON.stringify(report.mobileEmulation));
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:1});
  failBasins=true;await page.goto(url+'?lesson=river&failure=1#terrain',{waitUntil:'networkidle0'});
  await page.waitForFunction(()=>document.querySelector('.watershed-status')?.textContent.includes('불러오지 못'));
  assert.ok(await page.$('#waterProgress'));failBasins=false;await page.click('[data-water-retry]');await page.waitForFunction(()=>document.querySelector('#sceneInsight')?.dataset.basin==='한강');
  assert.deepEqual(errors,[]);report.errors=errors;fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{if(browser)await browser.close();if(server.listening)server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
