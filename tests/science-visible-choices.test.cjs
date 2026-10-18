const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),pw=require('playwright');
const map=require('../learning/inquiry/science-lab/curriculum-map.js'),shot=require('./science-screenshot.cjs');
const out=path.resolve(process.env.SCIENCE_TEST_ARTIFACTS||'docs/science-lab-audit-2026-10-18/motion-controls');
const base=process.env.SCIENCE_BASE_URL||'http://127.0.0.1:18765/learning/inquiry/science-lab/';
const selected=process.env.SCIENCE_DEVICE_SLUGS?.split(',');
const routes=Object.entries(map).filter(([slug])=>!selected||selected.includes(slug)).flatMap(([slug,r])=>r.courseContexts?Object.keys(r.courseContexts).map(school=>({slug,school})):[{slug}]);
function inspect(){
 const visible=e=>!!e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden'&&!e.closest('[hidden],.sr-only,[aria-hidden=true]');
 const issues=[];if(document.documentElement.scrollWidth>innerWidth+2)issues.push('page overflow');
 for(const group of document.querySelectorAll('.lab-choice-group')){
  if(!visible(group))continue;const select=group.previousElementSibling?.matches('input')?group.previousElementSibling.previousElementSibling:group.previousElementSibling;
  if(!select?.matches('select')){issues.push('missing source select');continue;}
  for(const b of group.querySelectorAll('button')){if(!visible(b))continue;const box=b.getBoundingClientRect();if(box.height<43.5||box.width<43.5)issues.push('small target: '+b.textContent);if(b.scrollWidth>b.clientWidth+2)issues.push('clipped: '+b.textContent);if(select.disabled&&!b.disabled)issues.push('disabled source mismatch');}
  const checked=group.querySelector('[aria-checked=true]');if(select.selectedIndex>=0&&Number(checked?.dataset.option)!==select.selectedIndex)issues.push('selected value mismatch: '+select.id);
 }
 return issues;
}
for(const engine of ['chromium','webkit'])test(engine+': visible choices on every registered course route',{timeout:1200000},async()=>{
 fs.mkdirSync(out,{recursive:true});const browser=await pw[engine].launch({headless:true,...engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{}}),failures=[],errors=[],rows=[];
 try{const p=await browser.newPage({...engine==='webkit'?pw.devices['iPad (gen 7)']:{},viewport:{width:1366,height:768}});p.setDefaultTimeout(10000);let current;p.on('pageerror',e=>errors.push({current,error:e.message}));
  await p.route('**/*',r=>{const host=new URL(r.request().url()).hostname;return host==='127.0.0.1'||['fonts.googleapis.com','fonts.gstatic.com','cdn.jsdelivr.net'].includes(host)&&['font','stylesheet'].includes(r.request().resourceType())?r.continue():r.abort();});
  for(const route of routes){current=route.slug+(route.school?':'+route.school:'');try{
   await p.goto(base+route.slug+'/'+(route.school?'?school='+route.school:''));await p.waitForSelector('[data-assessment-ready]',{state:'attached'});await p.bringToFront();
   const groups=await p.locator('.lab-choice-group').count();let actions=0;
   if(route.slug==='protein-synthesis'){
    const search=p.locator('.lab-choice-search:visible').first();if(await search.count()){
     const group=search.locator('+ .lab-choice-group'),text=await group.locator('button').last().innerText();await search.fill(text);assert.equal(await group.locator('button:visible').count(),1);await search.fill('');
     const id=await group.getAttribute('data-for');await p.locator('#'+id).evaluate(s=>s.focus());assert.equal(await p.evaluate(()=>document.activeElement.getAttribute('role')),'radio');
    }
   }
   // Exercise each initially available condition using the actual visible button.
   const ids=await p.locator('.lab-choice-group').evaluateAll(gs=>gs.filter(g=>g.getClientRects().length).map(g=>g.dataset.for).filter(Boolean));
   for(const id of ids){const g=p.locator('.lab-choice-group[data-for="'+id+'"]');if(!await g.isVisible())continue;const b=g.locator('button:not(:disabled):not([hidden]):not([aria-checked=true])').first();if(!await b.count())continue;
    const index=Number(await b.getAttribute('data-option')),expected=await p.locator('#'+id).evaluate((s,i)=>s.options[i].value,index);
    if(engine==='webkit')await b.tap();else{await b.focus();await p.keyboard.press('Space');}
    const actual=await p.locator('#'+id).inputValue();if(actual!==expected)failures.push({route:current,id,expected,actual});actions++;
   }
   for(const [width,height]of [[1366,768],[1180,820],[1024,768],[820,1180],[768,1024],[512,768]]){await p.setViewportSize({width,height});await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));const issues=await p.evaluate(inspect);if(issues.length)failures.push({route:current,width,issues});}
   if(['protein-synthesis','electroplating','sugar-phase','ride-acceleration'].includes(route.slug)){
    await p.setViewportSize({width:1180,height:820});
    await p.evaluate(()=>{const panel=document.querySelector('.experiment-layout,.physics-lab,.structure-lab,.chemistry-lab');window.scrollTo(0,panel?panel.getBoundingClientRect().top+scrollY-12:0);});
    await p.evaluate(()=>document.fonts.ready);
    await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(r)))));
    const badFonts=await p.locator('svg text').evaluateAll(es=>es.filter(e=>e.getClientRects().length&&!e.closest('[hidden],defs,clipPath,mask')).flatMap(e=>{const m=e.getScreenCTM();if(!m||!e.textContent.trim())return[];const px=parseFloat(getComputedStyle(e).fontSize)*Math.hypot(m.c,m.d);return px<13.8||px>16.2?[{text:e.textContent,px}]:[];}));
    assert.deepEqual(badFonts,[],route.slug+' capture after resize');
    await shot(p,path.join(out,engine+'-choices-'+route.slug+'.webp'),{fullPage:false});
   }
   rows.push({...route,groups,actions});
  }catch(e){failures.push({route:current,error:e.message});}
  if(rows.length%20===0)console.log(engine,rows.length+'/'+routes.length,'routes;',failures.length,'findings');}
  assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
 }finally{await browser.close();fs.writeFileSync(path.join(out,'choices-'+engine+(selected?'-selected':'')+'.json'),JSON.stringify({engine,physicalDeviceTested:false,rows,failures,errors},null,2)+'\n');}
});
