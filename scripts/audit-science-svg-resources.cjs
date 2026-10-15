const engine=process.argv.includes('--webkit')?'webkit':'chromium';
const fs=require('node:fs'),map=require('../learning/inquiry/science-lab/curriculum-map.js');
const clipInspector=require('../tests/science-svg-clipping.cjs');
const selected=process.argv.find(a=>a.startsWith('--slugs='))?.slice(8).split(',');
const routes=Object.entries(map).filter(([slug])=>!selected||selected.includes(slug)).flatMap(([slug,r])=>r.courseContexts?Object.keys(r.courseContexts).map(school=>({slug,school})):[{slug}]);
const widths=[1366,1180,1024,820,768];
async function paint(p){await p.bringToFront();await p.evaluate(()=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('No visible animation frame')),10000);requestAnimationFrame(()=>requestAnimationFrame(()=>{clearTimeout(timer);resolve();}));}));}
(async()=>{
 const browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})}),findings=[],errors=[];
 let cursor=0,states=0;
 try{await Promise.all(Array.from({length:1},async()=>{
  const p=await browser.newPage();let current;
  p.on('pageerror',e=>errors.push({route:current,error:e.message}));
  await p.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  while(cursor<routes.length){
   const route=routes[cursor++];current=route;console.log(engine+': SVG '+route.slug+' '+(route.school||''));
   await p.bringToFront();await p.goto('http://127.0.0.1:18765/learning/inquiry/science-lab/'+route.slug+'/'+(route.school?'?school='+route.school:''));
   await p.waitForSelector('[data-assessment-ready]',{state:'attached'}).catch(e=>{throw Error(route.slug+': '+e.message+'; page errors: '+JSON.stringify(errors));});
   const selectors=await p.evaluate(()=>['button[data-mode]','[data-sc-mode]','[data-experiment]','[data-supplement-choice]','[data-rs-mode]','[data-rs-action]','[data-tf-mode]','[data-tf-contact]'].flatMap(sel=>[...document.querySelectorAll(sel)].map(e=>({selector:[...e.attributes].filter(a=>['data-mode','data-sc-mode','data-experiment','data-supplement-choice','data-value','data-rs-mode','data-rs-action','data-tf-mode','data-tf-contact'].includes(a.name)).map(a=>'['+a.name+'='+JSON.stringify(a.value)+']').join(''),name:e.textContent.trim().slice(0,50)}))));
   if(route.slug==='rate-equilibrium')selectors.push(...['exo','endo'].flatMap(heat=>['off','on'].map(cat=>({rate:{heat,cat}}))));
   if(route.slug==='refraction')selectors.push(...[['plane','convexMirror','concaveMirror','convexLens','concaveLens'].flatMap(o=>['near','middle','far'].map(d=>o+':'+d)),['water','glass'].flatMap(m=>['in','out'].flatMap(d=>(d==='in'?[0,1,30,60,85]:[0,1,20,30,40]).map(a=>'ray:'+m+':'+d+':'+a)))].flat().map(optics=>({optics})));
   if(route.slug==='catalyst-foam')selectors.push(...['ki','control','no-soap'].flatMap(m=>['bare','ready',0,.03,.3,.65,1].map(p=>m+':'+p)).map(catalystFoam=>({catalystFoam})));
   if(route.slug==='iodine-clock')selectors.push(...['concentration:bare','concentration:wrong','concentration:ready',...[14.9,15,20.9,21,27.9,28,46.9,47].map(t=>'concentration:'+t),'concentration:47:inverse','temperature:bare','temperature:ready',...[5.9,6,23.9,24,35.9,36].map(t=>'temperature:'+t),'temperature:36:inverse'].map(iodineClock=>({iodineClock})));
   if(route.slug==='acid-mixing')selectors.push(...['cabbage','phenol'].flatMap(mode=>['acid','base'].flatMap(start=>['opposite','water'].flatMap(titrant=>(mode==='cabbage'?[0,5,15,20,25,30]:[0,1,2,2.5,5]).map(v=>[mode,start,titrant,v].join(':'))))).map(acidMixing=>({acidMixing})));
   if(route.slug==='diffusion'){await p.waitForFunction(()=>!!window.__diffusionModel);selectors.push(...['ink:centre:0','ink:centre:0.15','ink:centre:0.5','ink:centre:1','ink:left:0.15','ink:right:0.15','ink:centre:0:particles','ink:centre:0.5:particles','ink:centre:1:particles','btb:vinegar:0','btb:vinegar:0.4','btb:vinegar:0.65','btb:vinegar:1','btb:water:1','btb:vinegar:0.5:particles','btb:water:1:particles'].map(diffusion=>({diffusion})));}
   if(route.slug==='reflex-nerve'){await p.waitForFunction(()=>!!window.__reflexModel);selectors.push(...['knee','leg','pupil','conscious'].flatMap(m=>['none:-1','none:1.5','none:2.5','none:3.5','none:5','sensory:5','motor:5'].map(s=>({reflex:m+':'+s}))));}
   if(route.slug==='cell-division'){await p.emulateMedia({reducedMotion:'reduce'});await p.waitForFunction(()=>!!window.__divModel);selectors.push(...["mitosis:0","mitosis:1","mitosis:2","mitosis:3","mitosis:4","mitosis:5","mitosis:6","mitosis:7","meiosis:0","meiosis:1","meiosis:2","meiosis:3","meiosis:4","meiosis:5","meiosis:6","meiosis:7","meiosis:8","meiosis:9","meiosis:10","meiosis:11","meiosis:11:8:1","meiosis:11:6:0:5","mitosis:5:4","meiosis:8:4"].map(division=>({division})));}
   if(route.slug==='phase-curves'){await p.waitForFunction(()=>!!window.__phaseCurves);selectors.push(...["initial","boil","boil-mid","melt","melt-mid","boil2","freeze","freeze-mid","freeze-zero","bottom","air","table","wrong","correct","lauric-ready","lauric-bath","lauric-mid","lauric-final","lauric-bottom","lauric-wrong","lauric-correct"].map(phaseCurves=>({phaseCurves})));}
   if(route.slug==='galactic-objects'){await p.waitForFunction(()=>!!window.__galacticObjects);selectors.push(...['initial','m5','crescent','witch','shark','compare','compare-nebula','zoom','classified','sky','sky-ground','sky-day','sky-plain','sky-jeju'].map(galactic=>({galactic})));}
   if(route.slug==='satellite-sea-temperature'){await p.waitForFunction(()=>window.__satelliteSST?.snapshot().ready);selectors.push(...['initial','difference','same','land','solomon','solomon-diff','sydney','sydney-diff','years','east'].map(sst=>({sst})));}
   if(route.slug==='argo-observation'){await p.waitForFunction(()=>window.__argoObservation?.snapshot().ready);selectors.push(...['initial','surface','deep','missing','ts','ts-deep','map','same','january-july'].map(argo=>({argo})));}
   if(route.slug==='plate-tectonics'){await p.waitForFunction(()=>window.__tectonicData?.snapshot().ready);selectors.push(...['world-quakes','world-all','japan','indonesia','andes','atlantic','hawaii','volcano-only','hidden','period','large','empty','selected','volcano-selected'].map(tectonic=>({tectonic})));}
   if(route.slug==='minerals-rocks')selectors.push(...['rock-A','rock-B','rock-C','rock-D','rock-E','rock-F','quartz:streak','feldspar:streak','biotite:streak','calcite:acid','magnetite:clip','scratch','igneous-dark','igneous-light'].map(middleRock=>({middleRock})));
   if(route.slug==='equilibrium-data')selectors.push(...['a','b'].flatMap(set=>['initial','eq'].flatMap(basis=>['simple','coefficient','square'].map(formula=>({eqData:[set,basis,formula].join(':')})))));
   if(route.slug==='seasonal-sky')selectors.push(...['spring:night','summer:night','autumn:night','winter:night','winter:compare','spring:day','summer:dawn','autumn:zoom'].map(sky=>({sky})));
   if(route.slug==='dna-structure')selectors.push(...['wrong','flat','sequence','0','45','90','180'].map(dna=>({dna})));
   if(route.slug==='star-elements')selectors.push(...['A','B','missing','hydrogen','large','fusion-he','star-small','star-large','origin'].map(element=>({element})));
   if(route.slug==='kepler-data')selectors.push(...['all','metric','linear','inner','outer','minor','earth','extreme'].map(kepler=>({kepler})));
   if(route.slug==='hr-diagram')selectors.push(...['all','top','bottom','long-name','reversed','different-types','data'].map(hr=>({hr})));
   if(route.slug==='video-motion')selectors.push(...['cart-data','cart-axis','projectile-energy','projectile-mass'].map(video=>({video})));
   for(const mode of [null,...selectors]){
    if(mode?.tectonic)await p.evaluate(require('../tests/science-tectonic-data-scenario.cjs'),mode.tectonic);
    if(mode?.optics)await p.evaluate(require('../tests/science-optics-scenario.cjs'),mode.optics);
    if(mode?.catalystFoam)await p.evaluate(require('../tests/science-catalyst-foam-scenario.cjs'),mode.catalystFoam);
    if(mode?.iodineClock)await p.evaluate(require('../tests/science-iodine-clock-scenario.cjs'),mode.iodineClock);
    if(mode?.acidMixing)await p.evaluate(require('../tests/science-acid-mixing-scenario.cjs'),mode.acidMixing);
    if(mode?.diffusion)await p.evaluate(require('../tests/science-diffusion-scenario.cjs'),mode.diffusion);
     if(mode?.reflex)await p.evaluate(require('../tests/science-reflex-scenario.cjs'),mode.reflex);
     if(mode?.division)await p.evaluate(require('../tests/science-cell-division-scenario.cjs'),mode.division);
    if(mode?.phaseCurves)await p.evaluate(require('../tests/science-phase-curves-scenario.cjs'),mode.phaseCurves);
    if(mode?.galactic)await p.evaluate(require('../tests/science-galactic-scenario.cjs'),mode.galactic);
    if(mode?.sst)await p.evaluate(require('../tests/science-sst-scenario.cjs'),mode.sst);
    if(mode?.argo)await p.evaluate(require('../tests/science-argo-scenario.cjs'),mode.argo);
    if(mode?.middleRock){await p.emulateMedia({reducedMotion:'reduce'});await p.evaluate(require('../tests/science-middle-rocks-scenario.cjs'),mode.middleRock);}
    if(mode?.eqData)await p.evaluate(require('../tests/science-equilibrium-data-scenario.cjs'),mode.eqData);
    if(mode?.sky)await p.evaluate(require('../tests/science-seasonal-sky-scenario.cjs'),mode.sky);
    if(mode?.dna)await p.evaluate(require('../tests/science-dna-scenario.cjs'),mode.dna);
    if(mode?.element)await p.evaluate(require('../tests/science-element-origin-scenario.cjs'),mode.element);
    if(mode?.kepler)await p.evaluate(require('../tests/science-kepler-data-scenario.cjs'),mode.kepler);
    if(mode?.hr)await p.evaluate(require('../tests/science-hr-diagram-scenario.cjs'),mode.hr);
    if(mode?.video)await p.evaluate(require('../tests/science-video-motion-scenario.cjs'),mode.video);
    if(mode?.selector){
     if(!await p.locator(mode.selector).count()){await p.reload();await p.waitForSelector('[data-assessment-ready]',{state:'attached'});}
     await p.evaluate(selector=>{
      if(selector.includes('data-supplement-choice')&&document.querySelector('#tfLab'))document.querySelector('[data-tf-mode=bars]').click();
      if(selector.includes('data-tf-contact')){document.querySelector('[data-tf-mode=fork]').click();document.querySelector('#tfHold').click();document.querySelector('[data-tf-contact=none]').click();document.querySelector('[data-tf-strike=strong]').click();}
      document.querySelector(selector).click();
     },mode.selector);
    }
    if(mode?.rate)await p.evaluate(({heat,cat})=>{document.querySelector('[data-mode=rate]').click();__rateModel.set('heat',heat);__rateModel.set('cat',cat);},mode.rate);
    for(const width of widths){
     await p.setViewportSize({width,height:1024});await paint(p);
     const duplicates=await p.evaluate(()=>{const m=new Map();for(const e of document.querySelectorAll('[id]')){if(!e.id)continue;const a=m.get(e.id)||[];a.push(e.tagName);m.set(e.id,a);}return[...m].filter(([,a])=>a.length>1).map(([id,tags])=>({id,tags}));});
     const brokenRefs=await p.evaluate(()=>{const rows=[];for(const e of document.querySelectorAll('svg *'))for(const a of [...e.attributes])for(const m of a.value.matchAll(/url\(#([^\)]+)\)/g)){const t=document.getElementById(m[1]);if(!t||t.ownerSVGElement!==e.ownerSVGElement)rows.push({tag:e.tagName,attribute:a.name,ref:m[1],reason:!t?'missing':'another-svg'});}return rows;});
     const clippedText=await p.evaluate(clipInspector);
     const titleFonts=await p.locator('main h1').evaluateAll(es=>es.filter(e=>e.getClientRects().length).map(e=>({text:e.textContent.trim(),px:parseFloat(getComputedStyle(e).fontSize)})).filter(r=>r.px<20||r.px>24.2));states++;
     if(duplicates.length||brokenRefs.length||clippedText.length||titleFonts.length)findings.push({...route,mode,width,duplicates,brokenRefs,clippedText,titleFonts});
    }
   }
  }
  await p.close();
 }));}finally{await browser.close();}
 const output=(process.env.SCIENCE_TEST_ARTIFACTS||'docs/science-lab-audit-2026-10-12/course-practices')+'/runtime-svg-resources-'+engine+(selected?'-selected':'')+'.json';
 fs.writeFileSync(output,JSON.stringify({checkedAt:new Date().toISOString(),engine,routes:routes.length,states,widths,scope:'Duplicate SVG IDs, cross-SVG URL references, definite clipping of text by ancestor clip paths and 20–24 px page headings. Arbitrary mask silhouettes require visual review.',findings,errors},null,2)+'\n');
 console.log(JSON.stringify({routes:routes.length,states,totalFindings:findings.length,findings:findings.slice(0,8),errors}));if(findings.length||errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
