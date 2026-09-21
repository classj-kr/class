const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const vm=require('node:vm');
const puppeteer=require('puppeteer-core');
const root=path.resolve(__dirname,'..'),output=path.join(root,'outputs/korea-map-mountain');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'learning/inquiry/korea-map/mountain-scene.js'),'utf8'),context);
const model=context.window.KoreaMountainScene;
assert.equal(JSON.stringify(model.coordinatesAt(0)),JSON.stringify(model.section.west.coordinates));
assert.equal(JSON.stringify(model.coordinatesAt(1)),JSON.stringify(model.section.east.coordinates));
assert.equal(model.sides('east').up,1);assert.equal(model.sides('west').up,0);
let failDEM=false;
const server=http.createServer((req,res)=>{
  const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
  if(!file.startsWith(root+path.sep))return res.writeHead(403).end();
  if(failDEM&&file.includes(path.sep+'dem'+path.sep))return res.writeHead(503).end();
  fs.readFile(file,(error,buffer)=>{
    if(error)return res.writeHead(404).end();
    if(file.endsWith(path.join('leaflet','leaflet.js')))buffer=Buffer.concat([buffer,Buffer.from('\nwindow.testMaps={};L.Map.addInitHook(function(){window.testMaps[this.getContainer().id]=this;});')]);
    res.setHeader('Content-Type',{'.js':'text/javascript; charset=utf-8','.css':'text/css','.html':'text/html; charset=utf-8','.woff2':'font/woff2','.webp':'image/webp'}[path.extname(file)]||'application/octet-stream');res.end(buffer);
  });
});
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const dash=page=>page.$eval('.mountain-air',el=>getComputedStyle(el).strokeDashoffset);
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
  try {
    fs.mkdirSync(output,{recursive:true});
    browser=await puppeteer.launch({headless:true,executablePath:process.env.MAP_TEST_BROWSER||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-first-run','--disable-background-networking']});
    const page=await browser.newPage(),errors=[],report={};
    page.on('pageerror',error=>errors.push(error.message));
    await page.setRequestInterception(true);
    page.on('request',request=>request.url().startsWith('http://127.0.0.1:')||request.url().startsWith('data:')?request.continue():request.abort());
    const url='http://127.0.0.1:'+server.address().port+'/learning/inquiry/korea-map/index.html';
    async function open(width,query='') {
      await page.setViewport({width,height:1000});
      await page.goto(url+'?mountain='+width+query+'#climate',{waitUntil:'networkidle0'});
      await page.select('#lessonSelect','foehn');
    }
    async function ready() {await page.waitForFunction(()=>document.querySelector('#lessonDiagram')?.dataset.status==='ready');}
    await open(1440);await ready();
    assert.equal(await page.$eval('#lessonDiagram',el=>getComputedStyle(el).display),'block','do not inherit the old two-column figure grid');
    const ground=await page.$eval('.mountain-ground',el=>el.getAttribute('points'));
    const firstPath=await page.$eval('.mountain-air',el=>el.getAttribute('d'));
    const meta=await page.$eval('#lessonDiagram',el=>({...el.dataset,font:getComputedStyle(el).fontFamily}));
    assert.equal(meta.samples,'241');assert.ok(Number(meta.peak)>600&&Number(meta.peak)<2000);assert.ok(meta.font.includes('KoPubWorld Batang'));
    assert.equal(await page.$('#sceneInsight'),null);assert.ok(await page.$eval('.scene-toolbar',el=>el.hidden));
    assert.ok(await page.$eval('.geography-flow-canvas',el=>el.hidden),'no national seasonal wind mixed into mountain case');
    let phase=await dash(page);await delay(200);assert.notEqual(await dash(page),phase);
    assert.ok((await page.$eval('.mountain-side.leeward',el=>el.textContent)).includes('진부'));
    await page.click('[data-mountain-wind="west"]');
    assert.equal(await page.$eval('.mountain-ground',el=>el.getAttribute('points')),ground,'reverse wind, never mirror the real terrain');
    assert.notEqual(await page.$eval('.mountain-air',el=>el.getAttribute('d')),firstPath);
    assert.ok((await page.$eval('.mountain-side.leeward',el=>el.textContent)).includes('강릉'));
    const windLines=await page.evaluate(()=>{const lines=[];testMaps.map.eachLayer(layer=>{if(layer.options?.className==='mountain-map-air')lines.push(layer.getLatLngs().map(p=>[p.lat,p.lng]));});return lines;});
    assert.equal(windLines.length,2);assert.ok(windLines.every(line=>line[0][1]<line.at(-1)[1]),'west wind map paths go east');
    // Decode the stored DEM independently at both endpoints, then check the plotted heights.
    const heightCheck=await page.evaluate(async()=>{
      const section=KoreaMountainScene.section;
      const heights=await Promise.all([section.west,section.east].map(async place=>{
        const [lat,lng]=place.coordinates,n=1024,r=lat*Math.PI/180;
        const fx=(lng+180)/360*n,fy=(1-Math.log(Math.tan(r)+1/Math.cos(r))/Math.PI)/2*n;
        const img=new Image();img.src=`dem/10/${Math.floor(fx)}/${Math.floor(fy)}.webp`;await img.decode();
        const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);
        const rgb=ctx.getImageData(Math.floor((fx%1)*256),Math.floor((fy%1)*256),1,1).data;return rgb[0]*256+rgb[1]+rgb[2]/256-32768;
      }));
      const polygon=document.querySelector('.mountain-ground').points,peak=Number(document.querySelector('#lessonDiagram').dataset.peak),maximum=Math.ceil((peak+400)/500)*500;
      return {heights,error:[polygon.getItem(1).y,polygon.getItem(polygon.numberOfItems-2).y].map((y,i)=>Math.abs(y-(222-heights[i]/maximum*157)))};
    });
    assert.ok(heightCheck.error.every(error=>error<.1),JSON.stringify(heightCheck));
    await page.click('#mountainMoisture');assert.equal(await page.$('.mountain-cloud-note'),null);
    assert.ok((await page.$eval('.mountain-explanation',el=>el.textContent)).includes('순가열'));
    await page.click('#mountainMoisture');
    await page.click('#maskConcept');assert.equal(await page.$('.mountain-cloud-note'),null);
    assert.ok(!(await page.$eval('.mountain-sides',el=>el.textContent)).includes('바람받이'));
    await page.click('#maskConcept');
    await page.click('#quickPractice');await delay(100);
    assert.equal(await page.$$eval('#practiceDialog .mountain-scene',els=>els.length),0);
    phase=await dash(page);await delay(150);assert.equal(await dash(page),phase,'pause background scene during quiz');
    await page.click('#closePractice');await delay(100);phase=await dash(page);await delay(150);assert.notEqual(await dash(page),phase);
    await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
    assert.equal(await page.$eval('.mountain-air',el=>getComputedStyle(el).animationName),'none');
    await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
    await page.click('[data-study-level="basic"]');await ready();
    assert.equal(await page.$eval('#lessonDiagram',el=>el.dataset.direction),'west','direction retained on study re-render');
    assert.equal(await page.$$eval('.mountain-scene',els=>els.length),1);
    await page.click('[data-theme="history"]');
    assert.ok(await page.$eval('.mountain-scene',el=>el.classList.contains('mountain-stopped')));
    assert.equal(await page.$eval('.leaflet-mountainWind-pane',el=>el.hidden),true);
    assert.equal(await page.$$eval('.mountain-map-air',els=>els.length),0,'no wind remains over history map');
    await page.click('[data-theme="climate"]');await ready();
    await page.screenshot({path:path.join(output,'mountain-1440.png')});
    report.dem={...meta,...heightCheck};
    for(const width of [820,390]) {
      await open(width);await ready();
      await page.$eval('#lessonDiagram',el=>el.scrollIntoView({block:'start',behavior:'instant'}));
      const layout=await page.evaluate(()=>{
        const chart=document.querySelector('.mountain-chart svg'),bounds=chart.viewBox.baseVal;
        return {overflow:document.documentElement.scrollWidth>innerWidth,svgClipping:[...chart.querySelectorAll('text')].filter(el=>{const r=el.getBBox();return r.x<0||r.x+r.width>bounds.width+1||r.y<0||r.y+r.height>bounds.height+1;}).map(el=>el.textContent)};
      });
      assert.equal(layout.overflow,false);assert.deepEqual(layout.svgClipping,[]);
      await page.click('[data-mountain-wind="west"]');
      await page.screenshot({path:path.join(output,'mountain-'+width+'.png')});
      report[width]=layout;
    }
    // No fabricated flat terrain when all DEM levels fail; retry must really refetch.
    failDEM=true;await open(390,'-failure');
    await page.waitForFunction(()=>document.querySelector('#lessonDiagram')?.dataset.status==='error');
    assert.equal(await page.$('.mountain-ground'),null);
    failDEM=false;await page.click('#mountainRetry');await ready();
    await page.select('#lessonSelect','monsoon');
    assert.equal(await page.$('.mountain-scene'),null);
    assert.equal(await page.$$eval('.mountain-map-air',els=>els.length),0);
    await page.goto(url+'?lesson=foehn#climate',{waitUntil:'networkidle0'});await ready();
    assert.equal(await page.$eval('#lessonSelect',el=>el.value),'foehn','direct link opens the new scene');
    const foreground=await browser.newPage();await foreground.bringToFront();await delay(100);
    phase=await dash(page);await delay(150);assert.equal(await dash(page),phase,'background tab pauses the model');
    await foreground.close();await page.bringToFront();
    assert.deepEqual(errors,[]);report.errors=errors;
    fs.writeFileSync(path.join(output,'verification.json'),JSON.stringify(report,null,2));
    console.log(JSON.stringify(report,null,2));
  } finally {
    if(browser){const fallback=setTimeout(()=>browser.process()?.kill(),5000);await browser.close().catch(()=>{});clearTimeout(fallback);}
    server.closeAllConnections();await new Promise(resolve=>server.close(resolve));
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
