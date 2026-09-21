const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium,webkit}=require('playwright');
const root=path.resolve(__dirname,'../learning/inquiry/science-lab');
const cases=[
 ...['cool','deposit','change','melt'].map(process=>['minerals-rocks',{process},'rock-process']),
 ...['mold','algae','mushroom'].flatMap(sample=>['whole','detail'].map(focus=>['microbes',{sample,focus},'photo'])),
 ...['mixed','dissolve','filter','evaporate'].map(stage=>['mixture-separation',{kind:'salt',stage},'salt-separation']),
 ...['before','after'].map(stage=>['microscope',{kind:'stem',stage},'stem-water']),
 ...['shell','leaf'].flatMap(fossil=>['whole','detail'].map(focus=>['rock-layers',{fossil,focus},'photo'])),
 ['weather-watch',{kind:'dew'},'dew'],
];

test('rebuilt observations: real media, apparatus, state changes and tablet layout',{timeout:240000},async()=>{
 const server=http.createServer((req,res)=>{
  let file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.jpg':'image/jpeg'}[path.extname(file)]||'application/octet-stream');res.end(data);});
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const screenshots=process.env.SCIENCE_REBUILD_CAPTURE;
 if(screenshots)fs.mkdirSync(screenshots,{recursive:true});
 try{for(const device of [
  {name:'chromebook',engine:chromium,width:1366,height:912},
  {name:'ipad-landscape',engine:webkit,width:1024,height:768,touch:true},
  {name:'ipad-portrait',engine:webkit,width:820,height:1180,touch:true},
 ]){
  const browser=await device.engine.launch({headless:true,...(device.engine===chromium&&process.env.SCIENCE_BROWSER?{executablePath:process.env.SCIENCE_BROWSER}:{})});
  try{
   const page=await browser.newPage({viewport:{width:device.width,height:device.height},hasTouch:!!device.touch,reducedMotion:'reduce'});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&/SVG|attribute (?:d|transform)|<(?:path|rect|circle|ellipse|line|g)>/i.test(m.text()))errors.push(m.text());});
   await page.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
   let currentSlug;const seen=new Map();
   for(const [slug,state,scene]of cases){
    if(slug!==currentSlug){await page.goto(`http://127.0.0.1:${server.address().port}/${slug}/`,{waitUntil:'load'});currentSlug=slug;}
    const panel=page.locator('.curriculum-supplement');await panel.waitFor();
    for(const [key,value]of Object.entries(state))await panel.locator(`[data-supplement-choice="${key}"][data-value="${value}"]`).click();
    if(scene==='photo'){
     await page.waitForFunction(()=>[...document.querySelectorAll('.supplement-photo-frame img')].every(i=>i.complete&&i.naturalWidth>=800));
     assert.equal(await panel.locator('.supplement-photo-frame img:visible').count(),1);
     assert.equal(await panel.locator('.supplement-photo-error:visible').count(),0);
     assert.equal(await panel.locator('.supplement-photo-frame').evaluate(f=>Math.abs(f.getBoundingClientRect().width-f.parentElement.clientWidth)<2),true,'photo frame fills card width');
     const credit=await panel.locator('.supplement-sources').textContent();
     assert.doesNotMatch(credit,/GeoDIL/);assert.match(credit,/CC0|CC BY-SA 3.0/);
     assert(await panel.locator('.supplement-photo-frame img').getAttribute('alt'));
    }else{
     assert.equal(await panel.locator(`[data-observation-scene="${scene}"]`).count(),1);
     const geometry=await panel.locator('.supplement-visual>svg').evaluate(svg=>{
      const boxes=[...svg.querySelectorAll('text')].map(t=>({text:t.textContent,...(()=>{const b=t.getBBox();return{x:b.x,y:b.y,w:b.width,h:b.height};})()}));
      return{outside:boxes.filter(b=>b.x<-.5||b.y<-.5||b.x+b.w>460.5||b.y+b.h>310.5),overlap:boxes.flatMap((a,i)=>boxes.slice(i+1).filter(b=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y).map(b=>[a.text,b.text]))};
     });
     assert.deepEqual(geometry.outside,[],slug+' label clipped');assert.deepEqual(geometry.overlap,[],slug+' labels overlap');
    }
    if(scene==='stem-water'){
     assert.equal(await panel.locator('[data-vessel]').count(),9);
     assert.equal(await panel.locator('[data-stain-track]').count(),state.stage==='after'?1:0);
    }
    if(scene==='salt-separation'&&state.stage==='filter'){
     for(const part of ['filter-paper','filtrate','filtrate-flow'])assert.equal(await panel.locator(`[data-${part}]`).count(),1);
     assert.equal(await panel.locator('[data-salt-crystal]').count(),0,'dissolved salt is not drawn as crystals');
     assert.match(await panel.locator('.supplement-observation').textContent(),/회수가 끝난 것이 아닙니다/);
    }
    if(scene==='dew')assert.equal(await panel.locator('[clip-path="url(#dewSurface)"] [data-surface-drop]').count(),10);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,device.name+' '+slug+' overflow');
    const visual=await panel.locator('.supplement-visual').innerHTML();
    const key=slug+':'+JSON.stringify(state);
    if(seen.has(slug))assert.notEqual(visual,seen.get(slug),key+' must change visibly');seen.set(slug,visual);
    if(screenshots){
     const filename=device.name+'-'+slug+'-'+Object.values(state).join('-');
     await panel.screenshot({path:path.join(screenshots,filename+'.png')});
     if(device.name==='chromebook')await panel.locator('.supplement-visual').screenshot({path:path.join(screenshots,filename+'-visual.png')});
    }
   }
   assert.deepEqual(errors,[],device.name);
   for(const slug of [...new Set(cases.map(c=>c[0]))]){
    await page.goto(`http://127.0.0.1:${server.address().port}/${slug}/`,{waitUntil:'load'});
    await page.locator('.curriculum-supplement').waitFor();
    const initial=await page.evaluate(()=>window.__scienceSupplement.getState());
    const other=page.locator('.curriculum-supplement [data-supplement-choice][aria-pressed="false"]').first();await other.click();
    await page.locator('.supplement-reset').click();
    assert.deepEqual(await page.evaluate(()=>window.__scienceSupplement.getState()),initial,slug+' reset');
   }
   console.log(device.name+': '+cases.length+' observation states, source credits, image loading, geometry and resets verified');
  }finally{await browser.close();}
 }}finally{await new Promise(resolve=>server.close(resolve));}
});
