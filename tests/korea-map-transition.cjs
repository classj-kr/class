const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const puppeteer=require('puppeteer-core');
const root=path.resolve(process.env.MAP_TEST_ROOT||path.resolve(__dirname,'..'));
const server=http.createServer((req,res)=>{
 const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
 if(!file.startsWith(root+path.sep))return res.writeHead(403).end();
 fs.readFile(file,(error,buffer)=>{
  if(error)return res.writeHead(404).end();
  if(file.endsWith(path.join('leaflet','leaflet.js')))buffer=Buffer.concat([buffer,Buffer.from('\nwindow.testMaps={};L.Map.addInitHook(function(){window.testMaps[this.getContainer().id]=this;});')]);
  res.setHeader('Content-Type',{'.js':'text/javascript','.css':'text/css','.html':'text/html; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2','.webp':'image/webp'}[path.extname(file)]||'application/octet-stream');res.end(buffer);
 });
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
 try{
  browser=await puppeteer.launch({headless:true,executablePath:process.env.MAP_TEST_BROWSER||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-first-run','--disable-background-networking']});
  const page=await browser.newPage(),errors=[],report=[];page.on('pageerror',e=>errors.push(e.message));
  for(const width of [390,820,1440]){
   await page.setViewport({width,height:844,isMobile:width===390,hasTouch:width===390});
   await page.goto('http://127.0.0.1:'+server.address().port+'/learning/inquiry/korea-map/index.html?lesson=river#terrain',{waitUntil:'networkidle0'});
   // Minimum zoom changes from the historical overview to the geography lesson.
   // Leaflet's implicit animated setZoom must not overwrite the later lesson fitBounds.
   for(let pass=0;pass<3;pass++){
    await page.click('[data-theme="history"]');await page.click('[data-theme="climate"]');
    if(await page.$eval('#lessonSelect',e=>e.value)!=='foehn')await page.select('#lessonSelect','foehn');
    await page.waitForFunction(()=>document.querySelector('#lessonDiagram')?.dataset.status==='ready');
    await new Promise(resolve=>setTimeout(resolve,600));
    const view=await page.evaluate(()=>{
     const map=testMaps.map,a=map.latLngToContainerPoint(KoreaMountainScene.section.west.coordinates),b=map.latLngToContainerPoint(KoreaMountainScene.section.east.coordinates),size=map.getSize();
     const box=map.getContainer().getBoundingClientRect();
     const labels=[...document.querySelectorAll('.scene-map-label')].filter(e=>/^[AB] (진부|강릉)/.test(e.textContent));
     const labelsInside=labels.length===2&&labels.every(e=>{const r=e.getBoundingClientRect();return r.left>=box.left&&r.right<=box.right&&r.top>=box.top&&r.bottom<=box.bottom;});
     return {zoom:map.getZoom(),minimum:map.getMinZoom(),separation:a.distanceTo(b),inside:[a,b].every(p=>p.x>0&&p.x<size.x&&p.y>0&&p.y<size.y),labelsInside};
    });
    assert.ok(view.zoom>=9,JSON.stringify({width,pass,...view}));assert.ok(view.separation>100);assert.ok(view.inside);assert.ok(view.labelsInside,JSON.stringify({width,pass,...view}));report.push({width,pass,...view});
   }
  }
  assert.deepEqual(errors,[]);console.log(JSON.stringify({report,errors},null,2));
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
