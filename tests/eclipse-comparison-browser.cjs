const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const puppeteer=require('puppeteer-core');
const root=path.resolve('.');const out=path.join(root,'tmp/space-topic-review');fs.mkdirSync(out,{recursive:true});
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.ogg':'audio/ogg'};
const server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}try{if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}});

(async()=>{
await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/learning/inquiry/space/earth-moon/?topic=eclipses#observe';
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
try{const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setRequestInterception(true);page.on('request',req=>req.url().startsWith('http://127.0.0.1:')||req.url().startsWith('data:')?req.continue():req.abort());
await page.setViewport({width:1532,height:865});await page.goto(url,{waitUntil:'networkidle0'});await page.waitForSelector('[data-eclipse-lunar-state="total"]');await new Promise(r=>setTimeout(r,400));
assert.equal(await page.$$eval('.ecl-comparison .ecl-observation',a=>a.length),2);
assert.ok(await page.$eval('.ecl-time-note',e=>e.textContent.includes('서로 다른 시점')));
const corona=await page.$eval('[data-ecl-view="solar"]',c=>Array.from(c.getContext('2d').getImageData(360,15,1,1).data));
const red=await page.$eval('[data-ecl-view="lunar"]',c=>Array.from(c.getContext('2d').getImageData(360,180,1,1).data));assert.ok(red[0]>red[1]*1.3,'total lunar eclipse is red');
await page.screenshot({path:path.join(out,'eclipse-comparison-desktop.png'),fullPage:true});
for(const mode of ['solar','lunar']){
 const cases=mode==='solar'?[[0,'total'],[25,'partial'],[86,'none']]:[[0,'total'],[65,'partial'],[125,'penumbral'],[215,'none']];
 for(const [value,type] of cases){await page.click('[data-ecl-preset="'+mode+'"][data-value="'+value+'"]');assert.equal(await page.$eval('[data-ecl-card="'+mode+'"]',e=>e.dataset.state),type);}
}
const plain=await page.$eval('[data-ecl-view="solar"]',c=>Array.from(c.getContext('2d').getImageData(360,15,1,1).data));assert.ok(corona[0]>plain[0]+10,'corona appears only at totality');
const white=await page.$eval('[data-ecl-view="lunar"]',c=>Array.from(c.getContext('2d').getImageData(360,180,1,1).data));assert.ok(white[1]>red[1]*2,'full moon is brighter than eclipsed moon');
await page.click('[data-ecl-preset="solar"][data-value="25"]');assert.equal(await page.$eval('[data-ecl-card="lunar"]',e=>e.dataset.state),'none','solar control preserves lunar state');
await page.click('[data-ecl-preset="lunar"][data-value="65"]');await page.screenshot({path:path.join(out,'eclipse-comparison-partial.png'),fullPage:true});
await page.click('[data-ecl-rays]');assert.equal(await page.$eval('.ecl-rays',e=>e.getAttribute('visibility')),'hidden');await page.click('[data-ecl-rays]');
await page.click('[data-ecl-labels]');assert.equal(await page.$('.ecl-labels'),null);await page.click('[data-ecl-labels]');
await page.click('[data-ecl-play="solar"]');await new Promise(r=>setTimeout(r,300));assert.ok(await page.$eval('[data-ecl-slider="solar"]',e=>+e.value>25));
await page.click('[data-topic-view="concept"]');assert.equal(await page.$eval('[data-ecl-play="solar"]',e=>e.getAttribute('aria-pressed')),'false');
await page.click('[data-topic-view="quiz"]');await page.$$eval('.quiz-topic-tab',tabs=>{const t=tabs.find(e=>e.dataset.value==='일식과 월식');if(t&&t.getAttribute('aria-pressed')!=='true')t.click();});assert.ok(await page.$('.ecl-quiz-figure svg'),'question figure preserved');
await page.click('[data-topic-view="observe"]');
for(const [width,height] of [[1532,865],[1366,768],[1920,1080],[900,700],[390,844]]){
 await page.setViewport({width,height});await new Promise(r=>setTimeout(r,400));
 const bounds=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,diagram:document.querySelector('.ecl-diagram').getBoundingClientRect().toJSON(),cards:Array.from(document.querySelectorAll('.ecl-observation')).map(e=>e.getBoundingClientRect().toJSON())}));
 assert.ok(bounds.scroll<=width,'no horizontal overflow at '+width);
 if(width>1150)assert.ok(bounds.cards.every(c=>c.bottom<=height),'both eclipse controls visible in viewport '+JSON.stringify(bounds));
 if(width>760)assert.ok(bounds.diagram.y<=46,'no extra top strip');
 await page.screenshot({path:path.join(out,'eclipse-comparison-'+width+'.png'),fullPage:true});console.log('PASS layout '+width+'x'+height);
}
assert.deepEqual(errors,[]);console.log('PASS both eclipse states, geometry-linked views, corona, lunar texture, independent controls, animation pause and question diagram');
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
