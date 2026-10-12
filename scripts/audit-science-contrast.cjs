const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),map=require('../learning/inquiry/science-lab/curriculum-map.js');
const engine=process.argv.includes('--webkit')?'webkit':'chromium';
const baseURL=process.env.SCIENCE_BASE_URL||'http://127.0.0.1:18765/learning/inquiry/science-lab/';
function inspect(){
 const rgb=s=>{const a=s.match(/[\d.]+/g)?.map(Number);return a&&a.length>=3?[...a.slice(0,3),a[3]??1]:null;};
 const blend=(a,b)=>{const alpha=a[3]+b[3]*(1-a[3]);return alpha?[0,1,2].map(i=>(a[i]*a[3]+b[i]*b[3]*(1-a[3]))/alpha).concat(alpha):[0,0,0,0];};
 const lum=c=>c.slice(0,3).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((n,x,i)=>n+x*[.2126,.7152,.0722][i],0);
 const issues=[];let checked=0,gradientSkipped=0;
 for(const e of document.querySelectorAll('main *')){
  const text=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim();
  if(!text||/^[\p{Extended_Pictographic}\uFE0F\u200D\s←→↑↓↔↕·•①②③④⑤⑥]+$/u.test(text)||e.closest('svg,.sr-only,[aria-hidden=true],script,style,option,[hidden]')||!e.getClientRects().length)continue;
  const style=getComputedStyle(e);if(style.visibility==='hidden')continue;let background=[0,0,0,0],opacity=1,unknown=false;
  for(let p=e;p;p=p.parentElement){const s=getComputedStyle(p),c=rgb(s.backgroundColor);opacity*=Number(s.opacity);
   if(background[3]<.999&&s.backgroundImage!=='none'){unknown=true;break;}
   if(c)background=blend(background,c);if(background[3]>.999)break;
  }
  if(unknown){gradientSkipped++;continue;}
  background=blend(background,[255,255,255,1]);let color=rgb(style.color);if(!color)continue;color[3]*=opacity;color=blend(color,background);
  const a=lum(color),b=lum(background),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);if(!Number.isFinite(ratio))throw Error('Non-finite contrast: '+text);checked++;
  if(ratio<4.45)issues.push({text:text.slice(0,95),ratio:+ratio.toFixed(2),color:style.color,background:background.slice(0,3),opacity,tag:e.tagName,css:e.className});
 }
 return{checked,gradientSkipped,issues};
}
(async()=>{const browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});
 const reports=[],errors=[];let cursor=0;const routes=Object.entries(map).flatMap(([slug,r])=>r.courseContexts?Object.keys(r.courseContexts).map(school=>({slug,school})):[{slug}]);
 try{await Promise.all(Array.from({length:engine==='webkit'?1:2},async()=>{const page=await browser.newPage({viewport:{width:768,height:1024}});page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 while(cursor<routes.length){const r=routes[cursor++];await page.goto(baseURL+r.slug+'/'+(r.school?'?school='+r.school:''));await page.waitForSelector('[data-assessment-ready]',{state:'attached'});await page.evaluate(()=>{const section=document.querySelector('.quiz-section');if(!section)throw Error('Missing quiz section');section.open=true;section.setAttribute('open','');section.dispatchEvent(new Event('toggle'));});await page.waitForFunction(()=>!!window.scienceExamBank&&(!document.querySelector('.exam-integrated')||!!document.querySelector('.exam-widget')?.examController)).catch(e=>{e.message=r.slug+': '+e.message;throw e;});
  await page.evaluate(()=>{const section=document.querySelector('.quiz-section');for(const card of section.querySelectorAll('.quiz-card')){card.querySelector('input[value="'+card.dataset.answer+'"]').click();card.querySelector('.answer-button').click();}const w=document.querySelector('.exam-widget');if(w?.examController){const id=w.examController.current(),q=section.scienceAssessment.store.questions.get(id);w.querySelector('[data-exam-answer="'+q.answer+'"]').click();w.querySelector('.exam-submit').click();}});
  const result=await page.evaluate(inspect);reports.push({...r,...result});
  if(r.slug==='equilibrium-colour'){
   await page.emulateMedia({reducedMotion:'reduce'});
   const click=s=>page.locator(s).click(),settle=()=>page.waitForFunction(()=>!__equilibriumColour.getState().pending),record=async state=>reports.push({...r,state,...await page.evaluate(inspect)});
   await click('#ecPrepare');for(let i=0;i<4;i++){await click('[data-ec-tube="'+i+'"]');await click('[data-ec-reagent="'+(i<2?'acid':'base')+'"]');await click('#ecAdd');await settle();}await record('four-tubes-observed');
   await click('[data-mode=pressure]');await record('pressure-initial');await click('#ecCompress');await settle();await record('pressure-compressed');await click('#ecEquilibrate');await settle();await record('pressure-final');
   await click('[data-mode=temperature]');await click('#ecFill');await click('#ecChloride');await settle();await record('cobalt-prepared');for(const bath of ['hot','cold']){await click('[data-ec-bath='+bath+']');await settle();await record('cobalt-'+bath);}await page.emulateMedia({reducedMotion:'no-preference'});
  }
  if(r.slug==='cell-structure'){
   for(let i=0;i<5;i++)await page.locator('[data-mb-step="'+i+'"]').click();
   reports.push({...r,state:'all-preparation-steps-completed',...await page.evaluate(inspect)});
  }
  if(r.slug==='strata-correlation'){
   for(const mode of ['key','fossil']){await page.locator('[data-sc-mode="'+mode+'"]').click();await page.locator('#scReveal').click();reports.push({...r,state:mode+'-summary',...await page.evaluate(inspect)});}
  }
  if(r.slug==='rock-layers'||r.slug==='sound-vibration'){
   await page.evaluate(slug=>{if(slug==='rock-layers'){document.querySelector('[data-rs-mode=fossils]').click();for(const b of document.querySelectorAll('[data-rs-answer=body]'))b.click();document.querySelector('#rsFossilCheck').click();for(const a of ['clay','press','lift','mix','pour','set','separate'])document.querySelector('[data-rs-action="'+a+'"]').click();}else{document.querySelector('#tfHold').click();for(const c of ['paper','water','hand']){document.querySelector('[data-tf-contact="'+c+'"]').click();document.querySelector('[data-tf-contact=none]').click();document.querySelector('[data-tf-strike=strong]').click();document.querySelector('[data-tf-contact="'+c+'"]').click();__tuningFork.advance(100);document.querySelector('[data-tf-contact=none]').click();}}},r.slug);
   reports.push({...r,state:'observed-comparison',...await page.evaluate(inspect)});
  }
 }await page.close();}));
 }finally{await browser.close();}
 const result={engine,viewport:[768,1024],scope:'Visible HTML text, including disabled instructions and completed controls, in initial experiment state and opened/graded questions, plus completed rock/fossil, tuning-fork and concentration/pressure/temperature equilibrium comparisons. Gradient/image-backed text is explicitly skipped; this is not a full visual contrast certification.',routes:routes.length,checked:reports.reduce((n,r)=>n+r.checked,0),gradientSkipped:reports.reduce((n,r)=>n+r.gradientSkipped,0),errors,flagged:reports.filter(r=>r.issues.length)};
 const out=path.resolve(process.env.SCIENCE_TEST_ARTIFACTS||path.join(root,'docs/science-lab-audit-2026-10-12/course-practices'));fs.mkdirSync(out,{recursive:true});
 const file=path.join(out,'reading-contrast-'+engine+'.json');fs.writeFileSync(file,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({...result,flagged:result.flagged.map(r=>({slug:r.slug,issues:r.issues.length}))}));if(result.flagged.length||errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
