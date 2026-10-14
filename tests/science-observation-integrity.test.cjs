const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const screenshotWebp = require('./science-screenshot.cjs');
const root = path.resolve(__dirname, '../learning/inquiry/science-lab');
const output = path.resolve(process.env.SCIENCE_TEST_ARTIFACTS || path.resolve(__dirname, '../docs/science-lab-audit-2026-09-21'), 'observation-fixes');

for (const engine of ['chromium', 'webkit']) test(engine + ': microscope optics, five source micrographs and 27 lens combinations', {timeout:120000}, async () => {
  fs.mkdirSync(output, {recursive:true});
  const server = http.createServer((req,res) => {
    let file = path.resolve(root, '.' + new URL(req.url,'http://localhost').pathname);
    if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file,'index.html');
    fs.readFile(file,(e,b) => {if(e)return res.writeHead(404).end();res.setHeader('Content-Type', {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css'}[path.extname(file)]||'application/octet-stream');res.end(b);});
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  let browser;
  try {
    browser = await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});
    const page = await browser.newPage({viewport:{width:1024,height:768},hasTouch:true});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error'&&/<(?:path|rect|circle|ellipse|line|g|svg)>|SVG|attribute (?:d|transform)/i.test(m.text()))errors.push(m.text());});
    await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
    const go=slug=>page.goto('http://127.0.0.1:'+server.address().port+'/'+slug+'/');
    const shot=async(name,selector)=>screenshotWebp(page.locator(selector),path.join(output,engine+'-'+name+'.webp'));
    await go('microscope');
    await page.waitForFunction(()=>!!window.__scopeModel);
    const lensCases=await page.evaluate(()=>{
      const m=window.__scopeModel,rows=[];
      for(const spec of ['onion','stoma'])for(const eye of [10,15])for(const obj of [4,10,40]){
        m.setSpec(spec);m.setEye(eye);m.setObj(obj);m.check();
        const active=document.querySelector('[data-objective].on');
        rows.push({spec,eye,obj,mag:m.analyse().mag,field:m.analyse().field,x:Number(active.getAttribute('x'))});
      }return rows;
    });
    assert.equal(lensCases.length,12);
    for(const row of lensCases){assert.equal(row.mag,row.eye*row.obj);assert.equal(row.field,(row.eye===10?18:12)/row.obj);assert.equal(row.x,94,'active objective stays on the optical axis');}
    await page.locator('[data-spec="stoma"]').tap();
    const pair=page.locator('[data-specimen="stoma"]').first();
    assert.equal(await pair.locator('path.guard-cell').count(),2);
    assert.equal(await pair.locator('.pore').count(),1);
    assert.equal(await pair.locator('.chloroplast').count(),8);
    assert.match(await page.locator('#graphGroup').textContent(),/시야 너비 ÷ 표본 한 개의 크기/);
    assert.doesNotMatch(await page.locator('#dataNote').textContent(),/이 세포|세포 크기/);
    assert.match(await page.locator('#dataNote').textContent(),/빈틈없이 나란히/);
    await shot('guard-cells','.experiment-layout');
    for(const width of [768,820,1024,1366]){
      await page.setViewportSize({width,height:900});
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no horizontal overflow at '+width);
    }
    await page.setViewportSize({width:1024,height:768});
    await go('microbes');await page.waitForFunction(()=>!!window.__microbeObservation);
    const observations=[];
    for(const [sample,view]of [['mushroom',0],['mushroom',1],['mold',0],['algae',0],['paramecium',0]]){
      await page.locator('[data-mb-sample="'+sample+'"]').tap();
      if(view)await page.locator('[data-mb-view="'+view+'"]').tap();
      await page.locator('#mbPlace').tap();
      if(!await page.evaluate(()=>__microbeObservation.getState().lamp))await page.locator('#mbLamp').tap();
      await page.locator('#mbFocus').evaluate(e=>{e.value='6';e.dispatchEvent(new Event('input'));});
      await page.waitForFunction(()=>document.querySelector('#mbImage').complete&&document.querySelector('#mbImage').naturalWidth>300);
      await page.locator('#mbObserve').tap();
      observations.push({sample,view,src:await page.locator('#mbImage').getAttribute('src'),caption:await page.locator('#mbCaption').textContent()});
      await shot('sample-'+sample+'-'+view,'#mbLab');
    }
    assert.equal(await page.locator('#mbComparisonGrid figure').count(),5);
    assert.equal(new Set(observations.map(r=>r.src)).size,5);
    assert.deepEqual(errors,[]);
    fs.writeFileSync(path.join(output,engine+'-checks.json'),JSON.stringify({lensCases,observations,errors},null,2));
  } finally {await browser?.close();await new Promise(r=>server.close(r));}
});
