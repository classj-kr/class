const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const lab=path.resolve(__dirname,'../learning/inquiry/science-lab'),models=require(path.join(lab,'required-experiments.js')).requiredExperimentModels(),map=require(path.join(lab,'curriculum-map.js'));
const all=Object.values(models).flat(),find=id=>all.find(s=>s.id===id),view=(id,s={})=>find(id).view({...find(id).initial,...s});
function states(spec){let out=[{}];for(const f of spec.fields)out=out.flatMap(s=>f.items.map(o=>({...s,[f.key]:o.value})));return out;}
test('required experiment source evidence, all valid choices and independent invariants',()=>{
 const source=fs.readFileSync(path.resolve(lab,'../../../references/moe/2022-revised-curriculum/extracted/09-science.txt'),'utf8');let n=0;
 assert.equal(all.length,11);
 for(const[slug,specs]of Object.entries(models))for(const spec of specs){for(const code of spec.codes){assert(source.includes('['+code+']'));assert(map[slug].codes.includes(code),slug+' '+code);}for(const s of states(spec)){const r=spec.view(s);assert(r.svg&&r.text&&r.note&&r.check);assert(!/NaN|undefined|Infinity/.test(JSON.stringify(r)));assert.equal(r.check.choices.length,3);assert(r.check.answer>=0&&r.check.answer<3);for(const v of Object.values(r.metrics))if(typeof v==='number')assert(Number.isFinite(v));n++;}}
 assert.equal(view('spring',{mass:'0'}).metrics.extension,0);
 assert.equal(view('spring',{mass:'200'}).metrics.extension,2*view('spring',{mass:'100'}).metrics.extension);
 assert.equal(view('spring',{stiffness:'40'}).metrics.extension,.5*view('spring',{stiffness:'20'}).metrics.extension);
 for(const s of states(find('buoyancy'))){const m=view('buoyancy',s).metrics;assert(Math.abs(m.reading+m.buoyancy-m.weight)<1e-10);assert(m.reading>=0);}
 for(const s of states(find('erosion'))){const m=view('erosion',s).metrics;assert.equal(m.moved+m.remaining,20);}
 assert(view('sea-level',{ice:'land',step:'1'}).metrics.rise>0);assert.equal(view('sea-level',{ice:'floating',step:'1'}).metrics.rise,0);
 assert(view('efficient-house',{wall:'insulated'}).metrics.temp>view('efficient-house',{wall:'plain'}).metrics.temp);
 assert(view('efficient-house',{window:'open'}).metrics.temp<view('efficient-house',{window:'closed'}).metrics.temp);
 assert.equal(view('altitude-meter',{angle:'45',height:'1'}).metrics.shadow.toFixed(5),'1.00000');
 assert(view('altitude-meter',{angle:'75'}).metrics.shadow<view('altitude-meter',{angle:'20'}).metrics.shadow);
 assert.equal(view('blind-spot',{seen:'visible'}).svg,view('blind-spot',{seen:'hidden'}).svg);
 assert(view('blind-spot',{eye:'right'}).metrics.dot>view('blind-spot',{eye:'right'}).metrics.cross);
 assert(view('blind-spot',{eye:'left'}).metrics.dot<view('blind-spot',{eye:'left'}).metrics.cross);
 for(const fuel of ['candle','alcohol']){assert(view('combustion-products',{fuel,step:'1'}).metrics.water);assert(view('combustion-products',{fuel,step:'1'}).metrics.carbonDioxide);}
 console.log(n+' new experiment conditions verified');
});
test('new experiments: controls, records, all answers, reset and Chromebook/iPad layout',{timeout:240000},async()=>{
 const {chromium}=require('playwright');const server=http.createServer((req,res)=>{let file=path.resolve(lab,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(lab+path.sep)){res.writeHead(403);res.end();return;}if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'}[path.extname(file)]||'application/octet-stream');res.end(data);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser,cases=0;const errors=[];
 try{browser=await chromium.launch({headless:true,executablePath:process.env.SCIENCE_BROWSER});
 for(const[slug,specs]of Object.entries(models)){const page=await browser.newPage({viewport:{width:1366,height:768}});page.on('pageerror',e=>errors.push(slug+': '+e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());await page.goto(`http://127.0.0.1:${server.address().port}/${slug}/`);await page.waitForFunction(()=>!!window.__requiredExperiments);await page.evaluate(()=>document.fonts.ready);
  for(const spec of specs){await page.locator(`[data-experiment="${spec.id}"]`).click();
   for(const state of states(spec)){
    await page.evaluate(state=>{for(const[k,v]of Object.entries(state)){const select=document.querySelector(`[data-required-field="${k}"]`);select.value=v;select.dispatchEvent(new Event('change',{bubbles:true}));}},state);
    assert.deepEqual(await page.evaluate(()=>window.__requiredExperiments.getState()),state);
    const expected=spec.view(state);assert.equal(await page.locator('.required-observation').textContent(),expected.text);
    for(let i=0;i<3;i++){await page.locator(`[data-required-answer="${i}"]`).click();assert.equal(await page.locator('.required-check [data-correct]').getAttribute('data-correct'),String(i===expected.check.answer));}
    await page.locator('[data-record]').click();assert((await page.evaluate(()=>window.__requiredExperiments.getRecords())).length>0);cases++;
   }
   await page.locator('[data-reset]').click();assert.deepEqual(await page.evaluate(()=>window.__requiredExperiments.getState()),spec.initial);assert.equal(await page.locator('.required-history tr').count(),0);
   for(const width of [1366,1024,820,768]){await page.setViewportSize({width,height:width>=1024?768:1024});const result=await page.locator('.required-experiments').evaluate(panel=>{const svg=panel.querySelector('svg'),b=svg.getBoundingClientRect(),bad=[...svg.querySelectorAll('text')].filter(t=>{const a=t.getBoundingClientRect();return a.left<b.left-2||a.right>b.right+2||a.top<b.top-2||a.bottom>b.bottom+2;}).map(t=>t.textContent);return{overflow:document.documentElement.scrollWidth>innerWidth+1,bad};});assert.deepEqual(result,{overflow:false,bad:[]},slug+' '+spec.id+' '+width);
    if(process.env.SCIENCE_CAPTURE&&width===1024){const dir=path.resolve(lab,'../../../docs/science-lab-audit-2026-09-20/required-gap-screenshots');fs.mkdirSync(dir,{recursive:true});await page.locator('.required-experiments').screenshot({path:path.join(dir,spec.id+'-1024.png')});}
   }
  }await page.close();
 }assert.deepEqual(errors,[]);console.log(cases+' browser conditions, '+cases*3+' answers checked');
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
});
