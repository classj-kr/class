const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const puppeteer = require('puppeteer-core');
const app = path.resolve(__dirname, '../learning/inquiry/korea-map');
const output = path.resolve(__dirname, '../outputs/korea-map-history');
const ctx = {window:{}};
for (const file of ['history-data.js','history-territories.js','history-war.js']) vm.runInNewContext(fs.readFileSync(path.join(app,'data',file),'utf8'),ctx);
const scenes = ctx.window.KOREA_HISTORY.scenes;
const territories = ctx.window.KOREA_HISTORY_TERRITORIES.scenes;
assert.equal(Object.keys(territories).length,scenes.length);
for (const scene of scenes) for (const state of territories[scene.id]) {
  assert.ok(state.date && state.sources.length && state.legend.length,scene.id);
  assert.ok(state.labels.length,`${scene.id}: country labels absent`);
  const svg = fs.readFileSync(path.join(app,state.overlay.split('?')[0]),'utf8');
  assert.ok(svg.includes('<path ') && !svg.includes('NaN'),scene.id);
  for(const {xy} of state.labels) assert.ok(xy[0]>=scene.bounds[0] && xy[0]<=scene.bounds[2] && xy[1]>=scene.bounds[1] && xy[1]<=scene.bounds[3],`${scene.id}: label outside scene`);
}
const names = id => territories[id].at(-1).legend.map(x=>x.label);
assert.ok(['발해','통일 신라','당','일본'].every(x=>names('balhae').includes(x)));
assert.ok(!names('nine-forts').some(x=>/금/.test(x)));
assert.ok(!names('bongo-cheongsan').some(x=>/소련/.test(x)));
assert.ok(names('allied-operations').includes('만주국 · 일본 괴뢰국'));
assert.notEqual(territories['korean-war'][0].overlay,territories['korean-war'][1].overlay);

(async()=>{
  const browser=await puppeteer.launch({headless:true,executablePath:process.env.MAP_TEST_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-first-run','--disable-background-networking']});
  try {
    const page=await browser.newPage();
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('response',r=>{if(r.status()>=400 && /territor/.test(r.url())) errors.push(r.url());});
    const base=process.env.MAP_TEST_URL || 'http://127.0.0.1:64604/learning/inquiry/korea-map/';
    for(const width of [1440,390]) {
      await page.setViewport({width,height:1000});
      for(const id of width===1440 ? scenes.map(s=>s.id) : ['balhae','later-three','gangdong','ssangseong','four-six','allied-operations','korean-war']) {
        await page.goto(`${base}?v=territories&historyScene=${id}#history`,{waitUntil:'networkidle0'});
        const result=await page.evaluate(()=>({
          overlays:[...document.querySelectorAll('.leaflet-image-layer')].filter(i=>/territories/.test(i.src)).map(i=>({loaded:i.complete && i.naturalWidth>0,src:i.src})),
          legend:document.querySelector('#mapKey').innerText,
          labels:[...document.querySelectorAll('.history-country')].map(n=>n.textContent),
          overflow:document.documentElement.scrollWidth>innerWidth
        }));
        assert.equal(result.overlays.length,1,`${id}: exactly one dated territory overlay`);
        assert.ok(result.overlays[0].loaded,`${id}: territory SVG failed to decode`);
        assert.ok(result.legend && result.labels.length);
        assert.equal(result.overflow,false);
        if(territories[id].length>1){
          for(const state of territories[id]){
            await page.click(`[data-territory="${state.id}"]`);
            await page.waitForFunction(()=>[...document.querySelectorAll('.leaflet-image-layer')].filter(n=>/territories/.test(n.src)).every(n=>n.complete && n.naturalWidth>0));
            assert.equal(await page.$eval('#historyMapCaption strong',n=>n.textContent),state.date);
            assert.equal(await page.$$eval('.leaflet-image-layer',ns=>ns.filter(n=>/territories/.test(n.src)).length),1);
          }
        }
        await page.screenshot({path:path.join(output,`territories-${id}-${width}.jpg`),type:'jpeg',quality:82,fullPage:true});
      }
    }
    assert.deepEqual(errors,[]);
    console.log(`Territories passed: ${scenes.length} scenes / ${Object.values(territories).flat().length} dated overlays; labels, legends, image decoding, chronology distinctions, state changes, desktop/mobile.`);
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
