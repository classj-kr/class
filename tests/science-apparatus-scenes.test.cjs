const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'../learning/inquiry/science-lab');
const models=require(path.join(root,'required-experiments.js')).requiredExperimentModels();
const apparatus=require(path.join(root,'apparatus-scenes.js'));
const specs=Object.entries(models).flatMap(([slug,rows])=>rows.map(spec=>({slug,...spec})));
const observationStates={
 'compound-conductivity':Object.fromEntries(['water','salt-solid','sugar-solid','sugar-solution'].map(sample=>[sample,{sample,probe:'immersed'}])),
 spring:{'maximum-extension':{mass:'300',stiffness:'10'}},
 buoyancy:{'half-immersed':{volume:'100',immersed:'0.5'}},
 'mix-change':{bubbles:{mixture:'vinegar',step:'1'}},
 'group-design':{'same-group':{pair:'same',conditions:'controlled',stage:'observe'}},
 'tuning-fork':{'water-splash':{vibration:'struck',contact:'water'}},
 'dew-fog':{dew:{kind:'dew',cool:'yes',moisture:'moist'},fog:{kind:'fog',cool:'yes',moisture:'moist'}},
 'wind-chamber':{'left-warm':{left:'warm',step:'1'},'right-warm':{left:'cold',step:'1'}},
 'photosynthesis-co2':{starch:{co2:'present',light:'on',step:'1'}},
 'heating-device':{heating:{reaction:'calcium',insulation:'yes',step:'1'}},
 'thermal-image':{conduction:{material:'metal',time:'3'}},
 'sea-level':{'land-melted':{ice:'land',step:'1'},'floating-melted':{ice:'floating',step:'1'}}
};
test('conductivity compares the five textbook samples and distinguishes a lifted probe from a negative result',()=>{
 const spec=specs.find(s=>s.id==='compound-conductivity');
 assert.equal(spec.fields[0].items.length,5);
 for(const sample of spec.fields[0].items.map(o=>o.value))for(const probe of ['raised','immersed']){
  const v=spec.view({sample,probe});assert.equal(v.metrics.conducts,sample==='salt-solution'&&probe==='immersed');assert.equal(v.metrics.measured,probe==='immersed');
  assert.equal((v.figure.detail.match(/data-well=/g)||[]).length,6);assert.equal((v.figure.detail.match(/data-selected="true"/g)||[]).length,1);
  assert.equal((v.svg.match(/data-electrode=/g)||[]).length,2);
  if(probe==='raised')assert.match(v.text,/판단하지/);
 }
});
for(const engine of ['chromium','webkit'])test(engine+': apparatus states, labels, fallback panels and responsive drawings',{timeout:180000},async()=>{
 const server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!file.startsWith(root+path.sep))return res.writeHead(403).end();if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');fs.readFile(file,(e,b)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css'}[path.extname(file)]||'application/octet-stream');res.end(b);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const out=path.resolve(process.env.SCIENCE_APPARATUS_CAPTURE_DIR||'docs/science-lab-audit-2026-10-11/apparatus-visual-review');fs.mkdirSync(out,{recursive:true});
 const shots=[];
 try{
  browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});
  const page=await browser.newPage({viewport:{width:1100,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  let slug;
  for(const spec of specs){
   if(slug!==spec.slug){slug=spec.slug;await page.goto('http://127.0.0.1:'+server.address().port+'/'+slug+'/');await page.waitForFunction(()=>!!window.__requiredExperiments);}
   await page.locator('[data-experiment="'+spec.id+'"]').click();
   const changed=Object.fromEntries(spec.fields.map(f=>[f.key,f.items.at(-1).value]));
   for(const [variant,state]of [['initial',spec.initial],['changed',changed],...Object.entries(observationStates[spec.id]||{})]){
    await page.evaluate(state=>{for(const[k,v]of Object.entries(state)){const e=document.querySelector('[data-required-field="'+k+'"]');e.value=v;e.dispatchEvent(new Event('change',{bubbles:true}));}},state);
    const expected=spec.view(state);
    assert.equal(await page.locator('.required-observation').textContent(),expected.text);
    assert.equal(await page.locator('.apparatus-explanation').isVisible(),!!expected.figure);
    assert.equal(await page.locator('[data-record],.required-history').count(),0);
    if(spec.id==='sea-level'){
     const flooded=await page.evaluate(()=>{
      const house=document.querySelector('[data-sea-house]'),water=document.querySelector('[data-sea-water]');
      return Number(water.dataset.level)<Number(house.getAttribute('y'))+Number(house.getAttribute('height'));
     });
     assert.equal(flooded,state.ice==='land'&&Number(state.step)>0,'coastal house is dry initially and floods only when land ice melts');
    }
    for(const width of [320,390,1100]){
     await page.setViewportSize({width,height:900});
     await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
     const layout=await page.locator('.required-experiments').evaluate(p=>{
      const bad=[];
      for(const svg of p.querySelectorAll('svg')){const box=svg.getBoundingClientRect();for(const t of svg.querySelectorAll('text')){const b=t.getBoundingClientRect();if(b.left<box.left-2||b.right>box.right+2||b.top<box.top-2||b.bottom>box.bottom+2)bad.push(t.textContent);}}
      return{bad,overflow:document.documentElement.scrollWidth>innerWidth+1};
     });
     assert.deepEqual(layout,{bad:[],overflow:false},spec.id+' '+variant+' '+width);
     if(engine==='chromium'&&apparatus.ids.includes(spec.id)&&width!==320){
      const file=spec.id+'-'+variant+'-'+width+'.webp';await require('./science-screenshot.cjs')(page.locator('.required-visuals'),path.join(out,file));shots.push({id:spec.id,variant,width,file});
     }
    }
   }
   await page.locator('[data-reset]').click();assert.deepEqual(await page.evaluate(()=>window.__requiredExperiments.getState()),spec.initial);
  }
  await page.goto('http://127.0.0.1:'+server.address().port+'/periodic-bonding/');await page.waitForFunction(()=>!!window.__requiredExperiments);
  for(const sample of ['water','salt-solid','sugar-solid','salt-solution','sugar-solution']){
   await page.locator('[data-required-field="sample"]').selectOption(sample);
   assert.equal(await page.locator('[data-conductivity-indicator]').getAttribute('data-conductivity-indicator'),sample==='salt-solution'?'on':'off');
   assert.equal(await page.locator('[data-well="'+sample+'"]').getAttribute('data-selected'),'true');
  }
  assert.deepEqual(errors,[]);
  if(engine==='chromium')fs.writeFileSync(path.join(out,'screenshots.json'),JSON.stringify(shots,null,2)+'\n');
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
});
