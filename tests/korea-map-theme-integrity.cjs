const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),puppeteer=require('puppeteer-core');
const root=path.resolve(__dirname,'..'),out=path.join(root,'outputs/korea-map-audit');
let releaseRiver;
const riverGate=new Promise(resolve=>releaseRiver=resolve);
const server=http.createServer((req,res)=>{
  let file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
  if(!file.startsWith(root+path.sep))return res.writeHead(403).end();
  fs.readFile(file,async(error,data)=>{
    if(error)return res.writeHead(404).end();
    if(file.endsWith('major-rivers.geojson'))await riverGate;
    if(file.endsWith(path.join('leaflet','leaflet.js')))data=Buffer.concat([data,Buffer.from('\nwindow.testMaps={};L.Map.addInitHook(function(){window.testMaps[this.getContainer().id]=this;});')]);
    res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.json':'application/json','.geojson':'application/geo+json','.woff2':'font/woff2'}[path.extname(file)]||'application/octet-stream');res.end(data);
  });
});
async function inventory(page){return page.evaluate(()=>{
  const colors={},tooltips=[];let population=0;
  testMaps.map.eachLayer(l=>{if(l.options?.pane==='themeLines'&&l.getLatLngs)colors[l.options.color]=(colors[l.options.color]||0)+1;if(l.options?.fillColor==='#5f7482')population++;if(l.getTooltip?.())tooltips.push(l.getTooltip().getContent());});
  return {colors,population,tooltips,legend:document.querySelector('#mapKey').textContent,labels:document.querySelectorAll('#map .geo-annotation,#map .place-label').length};
});}
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
  try{
    fs.mkdirSync(out,{recursive:true});browser=await puppeteer.launch({headless:true,executablePath:process.env.MAP_TEST_BROWSER||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-first-run','--disable-background-networking']});
    const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.setRequestInterception(true);page.on('request',r=>r.url().startsWith('http://127.0.0.1:')||r.url().startsWith('data:')?r.continue():r.abort());
    await page.setViewport({width:1440,height:950});const url='http://127.0.0.1:'+server.address().port+'/learning/inquiry/korea-map/index.html';
    await page.goto(url+'#transport',{waitUntil:'domcontentloaded'});await page.waitForSelector('#lessonSelect');
    const before=await inventory(page);assert.ok(before.colors['#e8740c']>100,'transport must render immediately with a lesson selected');
    releaseRiver();await page.waitForNetworkIdle();const after=await inventory(page);assert.deepEqual(after.colors,before.colors,'late river loading must not erase the road and rail network');
    const lessons=await page.evaluate(()=>KOREA_GEOGRAPHY.lessons.map(l=>({id:l.id,topic:l.topic}))),report=[];
    for(const lesson of lessons){
      await page.evaluate(l=>{document.querySelector(`[data-theme="${l.topic}"]`).click();const s=document.querySelector('#lessonSelect');s.value=l.id;s.dispatchEvent(new Event('change',{bubbles:true}));},lesson);
      if(['foehn','local-climate'].includes(lesson.id)){assert.equal(await page.$('#sceneInsight'),null,lesson.id+' unrelated seasonal comparison');assert.ok(await page.$eval('.scene-toolbar',e=>e.hidden));}
      const actual=await inventory(page);
      const expected=await page.evaluate(t=>{const x=KOREA_GEOGRAPHY.themes[t];return {legend:(x.legend||[]).map(l=>l.label).filter(Boolean),population:x.circles?.length,isolines:(x.isolines||[]).map(l=>l.name)};},lesson.topic);
      for(const label of expected.legend)assert.ok(actual.legend.includes(label),lesson.id+' missing legend '+label);
      for(const line of expected.isolines)assert.ok(actual.tooltips.includes(line),lesson.id+' missing isoline '+line);
      if(expected.population)assert.equal(actual.population,expected.population,lesson.id+' population circles');
      if(lesson.topic==='transport')for(const color of ['#e8740c','#c62828','#37474f'])assert.ok(actual.colors[color]>0,lesson.id+' missing route '+color);
      if(lesson.topic==='region')assert.ok(actual.labels>20,'administrative labels must remain visible');
      report.push({lesson:lesson.id,lines:actual.colors,population:actual.population});
    }
    // Every tab has a usable narrow and wide layout. Also retain screenshots for visual review.
    const themes=await page.evaluate(()=>[...document.querySelectorAll('[data-theme]')].map(e=>e.dataset.theme));
    for(const width of [390,820,1440]){
      await page.setViewport({width,height:950});
      for(const topic of themes){
        await page.evaluate(t=>{document.querySelector(`[data-theme="${t}"]`).click();scrollTo(0,0);const p=document.querySelector('.study-panel');p.scrollTop=0;},topic);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),topic+' overflow '+width);
        assert.ok(await page.$eval('#mapOverview',e=>e.getBoundingClientRect().width>=30));
        await page.screenshot({path:path.join(out,`${topic}-${width}.jpg`),type:'jpeg',quality:65,fullPage:width===390});
      }
    }
    await page.evaluate(()=>document.querySelector('[data-theme="transport"]').click());
    const closeZoom=await page.evaluate(()=>testMaps.map.getZoom());await page.click('#mapOverview');assert.ok(await page.evaluate(()=>testMaps.map.getZoom())<=closeZoom);
    await page.evaluate(()=>document.querySelector('[data-theme="history"]').click());
    const scene=await page.evaluate(()=>KOREA_HISTORY.scenes.find(s=>s.marks.some(m=>m.relicId==='s08')).id);
    await page.select('#historyScene',scene);await page.click('[data-history-relic="s08"]');
    await page.waitForFunction(()=>document.querySelector('#relicImage').complete&&document.querySelector('#relicImage').naturalWidth>0);
    assert.ok(await page.$eval('#relicDialog',e=>e.open));assert.match(await page.$eval('#relicTitle',e=>e.textContent),/순수비/);
    await page.click('#relicClose');
    await page.evaluate(()=>{let marker;testMaps.map.eachLayer(l=>{if(l.options?.title==='북한산 순수비')marker=l;});marker.fire('click');});
    assert.ok(await page.$eval('#relicDialog',e=>e.open));
    assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'theme-regression.json'),JSON.stringify({lessons:report,widths:[390,820,1440],themes,errors},null,2));
    console.log('PASS: delayed data, thematic layers and legends in all 28 lessons, 10 tabs at 3 widths, overview, stele photo from map and list.');
  }finally{releaseRiver();if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
