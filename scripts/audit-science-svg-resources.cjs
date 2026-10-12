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
 try{await Promise.all(Array.from({length:engine==='webkit'?1:3},async()=>{
  const p=await browser.newPage();let current;
  p.on('pageerror',e=>errors.push({route:current,error:e.message}));
  await p.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  while(cursor<routes.length){
   const route=routes[cursor++];current=route;
   await p.bringToFront();await p.goto('http://127.0.0.1:18765/learning/inquiry/science-lab/'+route.slug+'/'+(route.school?'?school='+route.school:''));
   await p.waitForSelector('[data-assessment-ready]',{state:'attached'});
   const selectors=await p.evaluate(()=>['button[data-mode]','[data-sc-mode]','[data-experiment]','[data-supplement-choice]','[data-rs-mode]','[data-rs-action]','[data-tf-mode]','[data-tf-contact]'].flatMap(sel=>[...document.querySelectorAll(sel)].map(e=>({selector:[...e.attributes].filter(a=>['data-mode','data-sc-mode','data-experiment','data-supplement-choice','data-value','data-rs-mode','data-rs-action','data-tf-mode','data-tf-contact'].includes(a.name)).map(a=>'['+a.name+'='+JSON.stringify(a.value)+']').join(''),name:e.textContent.trim().slice(0,50)}))));
   if(route.slug==='rate-equilibrium')selectors.push(...['exo','endo'].flatMap(heat=>['off','on'].map(cat=>({rate:{heat,cat}}))));
   for(const mode of [null,...selectors]){
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
 const output='docs/science-lab-audit-2026-10-12/course-practices/runtime-svg-resources-'+engine+(selected?'-selected':'')+'.json';
 fs.writeFileSync(output,JSON.stringify({checkedAt:new Date().toISOString(),engine,routes:routes.length,states,widths,scope:'Duplicate SVG IDs, cross-SVG URL references, definite clipping of text by ancestor clip paths and 20–24 px page headings. Arbitrary mask silhouettes require visual review.',findings,errors},null,2)+'\n');
 console.log(JSON.stringify({routes:routes.length,states,totalFindings:findings.length,findings:findings.slice(0,8),errors}));if(findings.length||errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
