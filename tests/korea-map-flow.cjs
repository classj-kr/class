const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const vm = require('node:vm');
const puppeteer = require('puppeteer-core');
const root = path.resolve(__dirname, '..'), base = path.join(root,'learning/inquiry/korea-map');
const output = path.join(root,'outputs/korea-map-flow');
const context = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(base,'data/flow-data.js'),'utf8'),context);
const source = JSON.parse(fs.readFileSync(path.join(base,'data/major-rivers.geojson'),'utf8'));
const original = JSON.stringify(source), data = context.window.KoreaFlowData;
const tracks = data.riverTracks(source);
assert.equal(tracks.length,13); assert.equal(new Set(tracks.map(t=>t.name)).size,12);
for(const [name,definition] of Object.entries(data.rivers)) {
  assert.equal(JSON.stringify(tracks.find(t=>t.name===name).coordinates.at(-1)),JSON.stringify(definition.downstream),name+' downstream');
}
assert.equal(JSON.stringify(source),original,'do not mutate source linework');
const hanStart = tracks.find(t=>t.name==='한강').coordinates[0];
for(const name of ['남한강','북한강']) assert.equal(JSON.stringify(tracks.find(t=>t.name===name).coordinates.at(-1)),JSON.stringify(hanStart),name+' confluence');
for(const season of ['summer','winter']) for(const track of data.windTracks(season)) {
  const first=track.coordinates[0],last=track.coordinates.at(-1);
  assert.ok(last[0]>first[0]); assert.ok(season==='summer'?last[1]>first[1]:last[1]<first[1]);
}
const server = http.createServer((req,res)=>{
  const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
  if(!file.startsWith(root+path.sep)) return res.writeHead(403).end();
  fs.readFile(file,(error,buffer)=>{
    if(error) return res.writeHead(404).end();
    if(file.endsWith(path.join('leaflet','leaflet.js'))) buffer=Buffer.concat([buffer,Buffer.from('\nwindow.testMaps={};L.Map.addInitHook(function(){window.testMaps[this.getContainer().id]=this;});')]);
    res.setHeader('Content-Type',{'.js':'text/javascript; charset=utf-8','.css':'text/css','.html':'text/html; charset=utf-8','.woff2':'font/woff2'}[path.extname(file)]||'application/octet-stream');
    res.end(buffer);
  });
});
const delay = ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function snapshot(page) {
  return page.evaluate(()=>{
    const canvas=document.querySelector('.geography-flow-canvas');
    const pixels=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
    let hash=0,alphaHash=0,painted=0;
    for(let i=0;i<pixels.length;i+=4) {
      if(pixels[i+3])painted++;
      alphaHash=(Math.imul(alphaHash,31)+pixels[i+3])|0;
      for(let channel=0;channel<4;channel++) hash=(Math.imul(hash,31)+pixels[i+channel])|0;
    }
    return {...canvas.dataset,hidden:canvas.hidden,hash,alphaHash,painted};
  });
}
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  let browser;
  try {
    browser=await puppeteer.launch({headless:true,executablePath:process.env.MAP_TEST_BROWSER||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-first-run','--disable-background-networking']});
    fs.mkdirSync(output,{recursive:true});
    const page=await browser.newPage(), errors=[], report={directionTracks:13,rivers:12};
    page.on('pageerror',error=>errors.push(error.message));
    await page.setRequestInterception(true);
    let failRivers=false;
    page.on('request',request=>{
      if(failRivers&&request.url().includes('major-rivers.geojson')) return request.respond({status:503,body:'unavailable'});
      return request.url().startsWith('http://127.0.0.1:')||request.url().startsWith('data:')?request.continue():request.abort();
    });
    const url='http://127.0.0.1:'+server.address().port+'/learning/inquiry/korea-map/index.html';
    await page.setViewport({width:1440,height:1000});
    await page.goto(url+'#terrain',{waitUntil:'networkidle0'});
    await page.waitForFunction(()=>document.querySelector('.geography-flow-canvas')?.dataset.tracks==='13');
    const first=await snapshot(page); await delay(450); const next=await snapshot(page);
    assert.ok(Number(next.phase)>Number(first.phase)); assert.notEqual(next.hash,first.hash); assert.ok(next.painted>500);
    assert.equal(next.alphaHash,first.alphaHash,'only water colour moves; the river silhouette must stay fixed');
    assert.equal(next.riverStyle,'continuous-water');
    assert.equal(next.particles,'0','no moving capsule/arrow particles on rivers');
    assert.ok(Number(next.waterSamples)>0);
    report.movement={first,next};
    await page.screenshot({path:path.join(output,'terrain-flow.png')});
    if(process.env.KOREA_FLOW_RECORD==='1') {
      const crop=await page.$eval('#map',el=>{const box=el.getBoundingClientRect();return {x:Math.ceil(box.x),y:Math.ceil(box.y),width:Math.floor(box.width),height:Math.floor(box.height)};});
      const recorder=await page.screencast({path:path.join(output,'continuous-water.webm'),crop,fps:20,quality:18,ffmpegPath:process.env.KOREA_FFMPEG||'ffmpeg'});
      await delay(6500);await recorder.stop();
    }
    await page.click('#scenePause'); const paused=await snapshot(page); await delay(350);
    assert.equal((await snapshot(page)).hash,paused.hash); assert.equal((await snapshot(page)).phase,paused.phase);
    await page.click('#scenePause');
    await page.select('#sceneRiver','한강');
    assert.equal((await snapshot(page)).tracks,'4');
    assert.ok((await page.$eval('#sceneInsight',el=>el.textContent)).includes('두물머리'));
    await page.screenshot({path:path.join(output,'han-network.png')});
    // Real canvas hit testing must still select a river under the passive flow layer.
    await page.select('#sceneRiver','all');
    await delay(150); // Leaflet's base Canvas redraw is scheduled for the next frame.
    const point=await page.evaluate(()=>{
      const map=testMaps.map;
      let target;map.eachLayer(layer=>{if(layer.tracks&&layer.canvas) target=layer;});
      const track=target.tracks.find(t=>t.name==='낙동강');
      const [lng,lat]=track.coordinates[Math.floor(track.coordinates.length*.4)];
      const p=map.latLngToContainerPoint([lat,lng]),rect=map.getContainer().getBoundingClientRect();
      return {x:p.x+rect.left,y:p.y+rect.top,lat,lng,center:map.getCenter(),zoom:map.getZoom()};
    });
    await page.mouse.click(point.x,point.y);
    await delay(100);
    assert.equal(await page.$eval('#sceneRiver',el=>el.value),'낙동강');
    const aligned=await page.evaluate(()=>{
      const map=testMaps.map; map.panBy([65,-40],{animate:false});map.setZoom(map.getZoom()+1,{animate:false});
      let flow;map.eachLayer(layer=>{if(layer.tracks&&layer.canvas)flow=layer;});
      const track=flow.projected[0], [lng,lat]=flow.tracks[0].coordinates[0], expected=map.latLngToContainerPoint([lat,lng]);
      const canvas=flow.canvas.getBoundingClientRect(),rect=map.getContainer().getBoundingClientRect();
      return Math.abs(canvas.left-rect.left)<1&&Math.abs(canvas.top-rect.top)<1&&track.points[0].distanceTo(expected)<1;
    });
    assert.ok(aligned,'flow aligns after pan + zoom');
    await page.click('#quickPractice'); await delay(100);
    const inDialog=await snapshot(page); assert.ok(inDialog.hidden); await delay(200); assert.equal((await snapshot(page)).phase,inDialog.phase);
    assert.equal(await page.$$eval('#questionMap .geography-flow-canvas',nodes=>nodes.length),0,'no answer overlays in quiz');
    await page.click('#closePractice'); await delay(150); assert.ok(!(await snapshot(page)).hidden);
    await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]); await delay(100);
    const reduced=await snapshot(page); await delay(250); assert.equal((await snapshot(page)).phase,reduced.phase); assert.ok(reduced.painted>0);
    assert.ok(await page.$eval('#scenePause',el=>el.disabled));
    await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
    const foreground = await browser.newPage(); await foreground.bringToFront(); await delay(100);
    assert.ok(await page.evaluate(()=>document.hidden));
    const background = await snapshot(page); await delay(200); assert.equal((await snapshot(page)).phase,background.phase);
    await foreground.close(); await page.bringToFront();
    await page.click('[data-theme="climate"]');
    assert.equal((await snapshot(page)).tracks,'5');
    assert.ok((await page.$eval('#sceneInsight',el=>el.textContent)).includes('841.0'));
    await page.click('[data-season="winter"]');
    assert.ok((await page.$eval('#sceneInsight',el=>el.textContent)).includes('−') || (await page.$eval('#sceneInsight',el=>el.textContent)).includes('-2.3'));
    assert.ok((await page.$eval('#sceneInsight',el=>el.textContent)).includes('69.3'));
    await page.screenshot({path:path.join(output,'winter-comparison.png')});
    await page.click('[data-pair="1"]');
    assert.ok((await page.$eval('#sceneInsight',el=>el.textContent)).includes('-5.3'));
    await page.click('[data-study-level="basic"]');
    assert.equal(await page.$$eval('#sceneInsight',nodes=>nodes.length),1);
    assert.ok((await page.$eval('#sceneInsight',el=>el.textContent)).includes('-5.3'));
    await page.click('[data-theme="heritage"]');
    assert.ok(await page.$eval('.scene-toolbar',el=>el.hidden)); assert.ok((await snapshot(page)).hidden);
    await page.click('[data-theme="travel"]'); assert.ok((await snapshot(page)).hidden);
    for(const width of [1051,820,390]) {
      await page.setViewport({width,height:1000});
      await page.goto(url+'?viewport='+width+'#climate',{waitUntil:'networkidle0'});
      assert.ok(await page.evaluate(()=>{let count=0;testMaps.map.eachLayer(layer=>{if(layer.options?.className==='major-river-path')count++;});return count>0;}),'cold #climate loads base rivers');
      const layout=await page.evaluate(()=>{
        const panel=document.querySelector('.scene-toolbar').getBoundingClientRect(),map=document.querySelector('#map').getBoundingClientRect();
        return {width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,inside:panel.left>=map.left&&panel.right<=map.right&&panel.top>=map.top&&panel.bottom<=map.bottom,particles:document.querySelector('.geography-flow-canvas').dataset.particles};
      });
      assert.ok(!layout.overflow&&layout.inside,JSON.stringify(layout));
      await page.click('[data-season="winter"]');await delay(100);
      await page.screenshot({path:path.join(output,'climate-'+width+'.png')});
      await page.click('#sceneCompare');
      assert.ok((await page.$eval('#sceneInsight',el=>getComputedStyle(el).fontFamily)).includes('Korea KoPubWorld Batang'));
      report['layout'+width]=layout;
    }
    failRivers=true;
    await page.setCacheEnabled(false);
    await page.goto(url+'?failed-rivers=1#terrain',{waitUntil:'networkidle0'});
    await page.waitForFunction(()=>document.querySelector('.scene-caption')?.textContent.includes('불러오지 못했습니다'));
    assert.ok(await page.$eval('#sceneRiver',el=>el.disabled));
    assert.ok(await page.$('#quickPractice'));
    assert.deepEqual(errors,[]);
    report.errors=errors;report.verified=['moving pixels','pause/resume','reduced motion','background tab pause','quiz isolation','downstream anchors','confluences','actual river click','season switch','comparison values','pan/zoom alignment','mobile fit','data failure'];
    fs.writeFileSync(path.join(output,'verification.json'),JSON.stringify(report,null,2));
    console.log(JSON.stringify(report,null,2));
  } finally {
    if(browser) { const fallback=setTimeout(()=>browser.process()?.kill(),5000);await browser.close().catch(()=>{});clearTimeout(fallback); }
    server.closeAllConnections();await new Promise(resolve=>server.close(resolve));
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
