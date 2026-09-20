const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const puppeteer = require('puppeteer-core');
const app = path.resolve(__dirname, '../learning/inquiry/korea-map');
const output = path.resolve(__dirname, '../outputs/korea-map-history');
const ctx = {window:{}};
for (const file of ['history-data.js','history-territories.js','history-war.js']) vm.runInNewContext(fs.readFileSync(path.join(app,'data',file),'utf8'),ctx);
const variants = ctx.window.KOREA_HISTORY_TERRITORIES.scenes;
for (const [id,states] of Object.entries(variants)) for (const state of states) {
  const [w,s,e,n]=state.overlayBounds;
  assert.ok(w<90 && s<15 && e>155 && n>60,`${id}: paint must extend beyond the entire pan range, not scene fit bounds`);
}
const provenance=JSON.parse(fs.readFileSync(path.join(app,'history/territories/provenance.json'),'utf8'));
for (const key of ['baekje-fourth','goguryeo-fifth','silla-sixth']) {
  const audit=provenance.coastalRegistration[key];
  assert.ok(audit.coastalLandAddedMercatorKm2>0);
  assert.equal(audit.remainingEligibleMercatorKm2,0);
  assert.ok(audit.maximumMercatorMetres<=32000);
}
(async()=>{
  const browser=await puppeteer.launch({headless:true,executablePath:process.env.MAP_TEST_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-first-run','--disable-background-networking']});
  try {
    const page=await browser.newPage();
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.setRequestInterception(true);
    page.on('request',req=>{
      if(new URL(req.url()).pathname.endsWith('/vendor/leaflet/leaflet.js')) req.respond({status:200,contentType:'text/javascript',body:fs.readFileSync(path.join(app,'vendor/leaflet/leaflet.js'),'utf8')+'\nwindow.testMaps={};L.Map.addInitHook(function(){window.testMaps[this.getContainer().id]=this;});'});
      else req.continue();
    });
    const base=process.env.MAP_TEST_URL || 'http://127.0.0.1:64604/learning/inquiry/korea-map/';
    const decode=()=>page.waitForFunction(()=>[...document.querySelectorAll('.leaflet-image-layer')].every(n=>n.complete&&n.naturalWidth>0));
    await page.setViewport({width:1600,height:1000});
    await page.goto(`${base}?historyScene=baekje-fourth#history`,{waitUntil:'networkidle0'});
    fs.mkdirSync(output,{recursive:true});
    // The exact map families in the user's reports, including later war context.
    for (const id of ['baekje-fourth','goguryeo-fifth','baekje-capitals','silla-sixth','unification','balhae','silla-trade','later-three','gangdong','gwiju','nine-forts','ssangseong','korean-war']) {
      await page.select('#historyScene',id);
      for(const state of variants[id]) {
        if(variants[id].length>1) await page.click(`[data-territory="${state.id}"]`);
        await decode();
        await page.evaluate(()=>testMaps.map.setView([39.5,128],6,{animate:false}));
        await page.waitForNetworkIdle({idleTime:80});
        await (await page.$('.map-stage')).screenshot({path:path.join(output,`fill-${id}-${state.id}.jpg`),type:'jpeg',quality:80});
        await page.evaluate(()=>testMaps.map.setZoom(testMaps.map.getMinZoom(),{animate:false}));
        const contained=await page.evaluate(()=>{
          const map=testMaps.map;
          const overlay=Object.values(map._layers).find(layer=>layer instanceof L.ImageOverlay);
          return overlay.getBounds().contains(map.getBounds());
        });
        assert.ok(contained,`${id} ${state.id}: zoom-out exposes an image edge`);
      }
    }
    // Former hard cutoff points are now coloured, not transparent SVG pixels.
    const probes={
      'baekje-capitals':[[126,43]],
      'unification':[[119,42],[128,46]],
      'balhae':[[114,45],[130,52]],
      'silla-trade':[[118,44],[140,37]],
      'gangdong':[[118,42],[128,49]],
      'korean-war':[[118,40],[127,46]]
    };
    for(const [id,points] of Object.entries(probes)) {
      await page.select('#historyScene',id);
      await decode();
      const alphas=await page.evaluate(points=>{
        const scene=KOREA_HISTORY.scenes.find(s=>s.id===document.querySelector('#historyScene').value);
        const active=document.querySelector('[data-territory][aria-pressed="true"]')?.dataset.territory;
        const state=KOREA_HISTORY_TERRITORIES.scenes[scene.id].find(s=>s.id===active)||KOREA_HISTORY_TERRITORIES.scenes[scene.id].at(-1);
        const [w,s,e,n]=state.overlayBounds;
        const merc=lat=>Math.log(Math.tan(Math.PI/4+lat*Math.PI/360));
        const canvas=document.createElement('canvas');canvas.width=1800;canvas.height=1800;
        const context=canvas.getContext('2d');
        context.drawImage(document.querySelector('.leaflet-image-layer'),0,0,1800,1800);
        return points.map(([lon,lat])=>context.getImageData(Math.floor((lon-w)/(e-w)*1800),Math.floor((merc(n)-merc(lat))/(merc(n)-merc(s))*1800),1,1).data[3]);
      },points);
      assert.ok(alphas.every(a=>a>80),`${id}: formerly clipped land is still unpainted (${alphas})`);
    }
    for(const width of [390,2560]) {
      await page.setViewport({width,height:1000});
      await page.select('#historyScene','silla-trade');
      await decode();
      await page.evaluate(()=>{testMaps.map.invalidateSize({animate:false});testMaps.map.setZoom(testMaps.map.getMinZoom(),{animate:false});});
      assert.ok(await page.evaluate(()=>Object.values(testMaps.map._layers).find(layer=>layer instanceof L.ImageOverlay).getBounds().contains(testMaps.map.getBounds())));
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    }
    await page.setViewport({width:1600,height:1000});
    await page.select('#historyScene','baekje-fourth');
    await page.evaluate(()=>testMaps.map.setView([38.8,127.5],6,{animate:false}));
    await decode();
    await page.screenshot({path:path.join(output,'fill-final.jpg'),type:'jpeg',quality:78});
    assert.deepEqual(errors,[]);
    console.log('History fill passed: all 39 extents enclose pan limits; 13 reported scene families, minimum zoom, coloured land beyond old cutoffs, coastal audit, desktop/mobile/wide.');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
