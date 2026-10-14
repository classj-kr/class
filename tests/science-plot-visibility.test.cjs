const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const clippedSvgText=require('./science-svg-clipping.cjs'),capture=require('./science-screenshot.cjs');
for(const engine of ['chromium','webkit'])test(engine+': height annotation and comparison-curve labels remain fully visible',{timeout:120000},async()=>{
 const browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});
 try{
  const page=await browser.newPage({viewport:{width:768,height:1024}});
  await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  for(const slug of ['energy-heat','wave-transfer','solubility-curve','photosynthesis','recrystallise']){
   await page.bringToFront();await page.goto('http://127.0.0.1:18765/learning/inquiry/science-lab/'+slug+'/');
   await page.waitForSelector('[data-assessment-ready]',{state:'attached'});await page.evaluate(()=>document.fonts.ready);
   await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   assert.deepEqual(await page.evaluate(clippedSvgText),[],slug);
   const labels=await page.locator('svg .curve-tag,svg .curve-name').evaluateAll(es=>es.filter(e=>e.getClientRects().length&&e.getBoundingClientRect().width).map(e=>{
    const style=getComputedStyle(e),color=style.fill.match(/[\d.]+/g).map(Number);let alpha=(color[3]??1)*Number(style.fillOpacity);
    for(let n=e;n;n=n.parentElement)alpha*=Number(getComputedStyle(n).opacity);
    const c=color.slice(0,3).map(v=>(v*alpha+255*(1-alpha))/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4),l=c.reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
    return{text:e.textContent.trim(),opacity:alpha,contrast:1.05/(l+.05)};
   }));
   if(slug!=='energy-heat')assert(labels.length>0,slug);
   for(const label of labels)assert(label.contrast>=4.45,slug+' '+JSON.stringify(label));
   const lines=await page.locator('svg path.curve,svg path.trace').evaluateAll(es=>es.filter(e=>e.getClientRects().length&&e.getBoundingClientRect().width).map(e=>{
    const s=getComputedStyle(e),rgba=s.stroke.match(/[\d.]+/g).map(Number);let a=(rgba[3]??1)*Number(s.strokeOpacity);
    for(let n=e;n;n=n.parentElement)a*=Number(getComputedStyle(n).opacity);
    const c=rgba.slice(0,3).map(v=>(v*a+255*(1-a))/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4),l=c.reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
    return{class:e.getAttribute('class'),contrast:1.05/(l+.05)};
   }));
   for(const line of lines)assert(line.contrast>=3,slug+' '+JSON.stringify(line));
   await capture(page.locator('.experiment-layout'),path.resolve('docs/science-lab-audit-2026-10-12/course-practices/browser/'+engine+'-plot-visibility-'+slug+'-768.webp'));
  }
 }finally{await browser.close();}
});
