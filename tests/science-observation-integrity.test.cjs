const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname, '../learning/inquiry/science-lab');
const output = path.resolve(__dirname, '../docs/science-lab-audit-2026-09-21/observation-fixes');

for (const engine of ['chromium', 'webkit']) test(engine + ': specimen anatomy, growth wording and 27 parameter combinations', {timeout:120000}, async () => {
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
    const shot=async(name,selector)=>page.locator(selector).screenshot({path:path.join(output,engine+'-'+name+'.png')});
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
    await shot('guard-cells','.experiment-layout');
    for(const width of [768,820,1024,1366]){
      await page.setViewportSize({width,height:900});
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no horizontal overflow at '+width);
    }
    await page.setViewportSize({width:1024,height:768});
    await go('microbes');await page.waitForFunction(()=>!!window.__microbeModel);
    const growth=await page.evaluate(()=>{
      const m=window.__microbeModel,rows=[];
      for(const temp of ['cold','room','warm'])for(const moist of ['damp','dry']){
        m.setMode('mould');m.set('temp',temp);m.set('moist',moist);m.setProgress(1);m.finish();
        rows.push({kind:'mould',temp,moist,cover:m.analyse().finalCover,text:document.getElementById('mainGroup').textContent});
      }
      for(const gtemp of ['cold','room','warm'])for(const hours of [2,4,6]){
        m.setMode('germ');m.set('gtemp',gtemp);m.set('hours',hours);m.setProgress(1);m.finish();
        rows.push({kind:'germ',gtemp,hours,final:m.analyse().final,text:document.getElementById('mainGroup').textContent});
      }return rows;
    });
    assert.equal(growth.length,15);
    for(const r of growth){
      if(r.kind==='germ')assert.equal(r.final,2**Math.floor(r.hours*60/({cold:360,room:60,warm:20}[r.gtemp])));
      else {assert(r.cover>=0&&r.cover<=.9);assert.equal(r.text.includes('거의 다 덮였습니다'),r.cover>=.75);}
    }
    await page.evaluate(()=>{const m=window.__microbeModel;m.setMode('mould');m.set('temp','warm');m.set('moist','damp');m.setProgress(.45);});
    assert.match(await page.locator('#mainGroup').textContent(),/넓게 퍼졌습니다/);
    assert.equal(await page.locator('.mould-colonies').getAttribute('clip-path'),'url(#mouldBreadClip)');
    assert.equal(await page.locator('#mouldBreadClip path').getAttribute('d'),await page.locator('.bread').getAttribute('d'));
    await shot('mould-progress','.experiment-layout');
    await page.evaluate(()=>{const m=window.__microbeModel;m.setMode('germ');m.set('gtemp','cold');m.set('hours',2);m.setProgress(1);m.finish();});
    assert.match(await page.locator('#mainGroup').textContent(),/처음 수의 1~2배/);
    assert.match(await page.locator('#elementaryExplanation').innerText(),/가정했습니다/);
    assert.match(await page.locator('#graphGroup').textContent(),/아직 분열하지 않습니다/);
    assert.doesNotMatch(await page.locator('#graphGroup').textContent(),/늘어난 것이 거의 끝/);
    await shot('bacteria-cold','.experiment-layout');
    for(const sample of ['mushroom','mold','algae','paramecium','bacteria']){
      await page.locator('[data-supplement-choice="sample"][data-value="'+sample+'"]').tap();
      await page.locator('[data-supplement-choice="focus"][data-value="detail"]').tap();
      if(sample==='paramecium'){assert.equal(await page.locator('.sample-cilium').count(),36);assert.equal(await page.locator('.sample-oral-groove').count(),1);}
      if(sample==='algae'){
        assert.equal(await page.locator('[data-spiral="front"]').count(),4);assert.equal(await page.locator('[data-spiral="back"]').count(),4);
        const ribbons=await page.locator('[data-algal-cell]').evaluateAll(es=>es.map(e=>{const b=e.getBBox();return{cell:Number(e.dataset.algalCell),left:b.x,right:b.x+b.width};}));
        for(const ribbon of ribbons){assert(ribbon.left>62+ribbon.cell*84);assert(ribbon.right<62+(ribbon.cell+1)*84,'chloroplast stays within its own cell');}
        const bounds=await page.locator('[data-observation="spirogyra"]').evaluate(e=>{const b=e.getBBox();return{x:b.x,y:b.y,w:b.width,h:b.height};});
        assert(bounds.x>=0&&bounds.x+bounds.w<=460&&bounds.y>=0&&bounds.y+bounds.h<=300);
      }
      await shot('sample-'+sample,'.curriculum-supplement');
    }
    assert.deepEqual(errors,[]);
    fs.writeFileSync(path.join(output,engine+'-checks.json'),JSON.stringify({lensCases,growth,errors},null,2));
  } finally {await browser?.close();await new Promise(r=>server.close(r));}
});
