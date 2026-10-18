const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const pw=require('playwright'),shot=require('./science-screenshot.cjs');
const base=process.env.SCIENCE_BASE_URL||'http://127.0.0.1:18765/learning/inquiry/science-lab/';
const output=path.resolve(process.env.SCIENCE_TEST_ARTIFACTS||'docs/science-lab-audit-2026-10-18/motion-controls');
const sizes=[[1366,768],[1180,820],[1024,768],[820,1180],[768,1024]];
function layout(){
 const visible=e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden'&&!e.closest('[hidden],defs,clipPath');
 const fonts=[],controls=[];for(const e of document.querySelectorAll('svg text')){if(!visible(e)||!e.textContent.trim())continue;const m=e.getScreenCTM();if(!m)continue;const px=parseFloat(getComputedStyle(e).fontSize)*Math.hypot(m.c,m.d);if(px<13.8||px>16.2)fonts.push({text:e.textContent,px});}
 for(const b of document.querySelectorAll('.lab-choice-group button'))if(visible(b)){const r=b.getBoundingClientRect();if(r.height<43.5||b.scrollWidth>b.clientWidth+2)controls.push(b.textContent);}
 return{overflow:document.documentElement.scrollWidth>innerWidth+2,fonts,controls};
}
// Count actual distinct geometry on animation frames, not just the rAF callback.
async function motion(page,selector,attribute,duration=1800){return page.evaluate(({selector,attribute,duration})=>new Promise(resolve=>{
 const node=document.querySelector(selector),svg=node.closest('svg');let frames=0,changes=0,last='',start=0,previous=0,gaps=[];
 function frame(now){if(!start)start=now;if(previous)gaps.push(now-previous);previous=now;frames++;const current=document.querySelector(selector)?.getAttribute(attribute);if(current!==last){changes++;last=current;}
  if(now-start<duration)requestAnimationFrame(frame);else{gaps.sort((a,b)=>a-b);resolve({frames,changes,seconds:(now-start)/1000,distinctPerSecond:changes/((now-start)/1000),p95FrameMs:gaps[Math.floor(gaps.length*.95)],sameSvg:svg===document.querySelector(selector)?.closest('svg'),sameNode:node===document.querySelector(selector)});}}
 requestAnimationFrame(frame);
}),{selector,attribute,duration});}
const experiments=[
 {slug:'water-wave-tank',scene:'#inquiryScene',start:['#playWave'],stop:'#playWave',node:'#inquiryScene polyline',attr:'points'},
 {slug:'speaker-lab',scene:'#physicsScene',start:['#magnet','#stripped','#connected','#playSignal'],stop:'#playSignal',node:'#physicsScene g',attr:'transform'},
 {slug:'wireless-power',scene:'#physicsScene',start:['#power'],stop:'#power',node:'#physicsScene path[opacity]',attr:'opacity'},
 {slug:'electroplating',scene:'#plScene',start:['#plClean','#plConnect','#plDip','#plPower'],stop:'#plPower',node:'[data-ion="0"]',attr:'transform'},
 {slug:'acoustic-resonance',scene:'#acScene',start:['#acPower'],stop:'#acPower',node:'.ac-particle',attr:'transform'},
 {slug:'sugar-phase',scene:'#chemistryScene',start:['#dissolveSugar','#startTemperature'],stop:'#startTemperature',node:'#chemistryScene rect[fill="#c45348"]',attr:'height'},
 {slug:'catalyst-foam',scene:'#cfBench',start:['#cfPrepare','#cfStart'],stop:'#cfPause',node:'[data-cf-card="1"] .cf-bubbles circle',attr:'cy'},
 {slug:'force-motion',scene:'.main-svg',prepare:async p=>p.locator('#forceRange').fill('20'),start:['#checkBtn'],stop:'#resetBtn',node:'#mainGroup .crate',attr:'x',duration:1200},
 {slug:'periodic-bonding',scene:'.main-svg',start:[],stop:'#orbitToggle',node:'[data-orbit-shell]',attr:'transform'},
];
for(const engine of ['chromium','webkit'])test(engine+': continuous apparatus motion and visible choices',{timeout:240000},async()=>{
 fs.mkdirSync(output,{recursive:true});const browser=await pw[engine].launch({headless:true,...engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{} }),rows=[],errors=[];
 try{
  const page=await browser.newPage({...engine==='webkit'?pw.devices['iPad (gen 7)']:{},viewport:{width:1024,height:768}});page.setDefaultTimeout(12000);page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  const click=async s=>engine==='webkit'?page.locator(s).tap():page.locator(s).click();
  const open=async slug=>{await page.goto(base+slug+'/');await page.bringToFront();await page.waitForSelector('[data-assessment-ready]',{state:'attached'});};
  await open('ride-acceleration');
  await page.evaluate(()=>{const target=document.createElement('div');target.id='scene-render-test';target.style.cssText='width:200px;position:absolute;left:0;top:0';document.querySelector('main').append(target);scienceScene.render(target,'<svg viewBox="0 0 100 60"><g transform="scale(2)"><text x="5" y="12" style="font-size:12px;fill:teal">검사</text><circle id="retained-dot" cx="10" cy="30" r="3"/></g></svg>');window.__retainedDot=document.querySelector('#retained-dot');});
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  await page.evaluate(()=>scienceScene.render(document.querySelector('#scene-render-test'),'<svg viewBox="0 0 100 60"><g><text x="5" y="12" style="font-size:12px;fill:navy">검사</text><circle id="retained-dot" cx="20" cy="30" r="3"/></g></svg>'));
  assert(await page.evaluate(()=>{const e=document.querySelector('#scene-render-test text'),m=e.getScreenCTM(),size=parseFloat(getComputedStyle(e).fontSize)*Math.hypot(m.c,m.d);return size>=13.8&&size<=16.2&&document.querySelector('#retained-dot')===window.__retainedDot;}),'retained text resizes after its scale is removed');
  await page.evaluate(()=>{const e=document.querySelector('#scene-render-test'),html='<select id="reset-select"><option value="a">A</option><option value="b">B</option></select>';scienceScene.render(e,html);e.querySelector('select').value='b';scienceScene.render(e,html);if(e.querySelector('select').value!=='a')throw Error('form reset retained a stale choice');e.remove();});
  for(const [name,value]of [['그네','swing'],['시소','seesaw'],['수평 등속 원운동','circle'],['등속 직선 운동','straight'],['승강기 상승·정지','elevator'],['미끄럼틀','slide']]){
   await page.getByRole('radio',{name,exact:true}).click();assert.equal(await page.locator('#motion').inputValue(),value);await click('#measureRide');await click('#play');
   await page.locator('#inquiryScene').scrollIntoViewIfNeeded();const result=await motion(page,'[data-ride-device]','transform',value==='slide'?800:1800);console.log(engine,value,JSON.stringify(result));if(await page.locator('#play').innerText()==='일시 정지')await click('#play');
   assert(result.sameSvg&&result.sameNode,value+' replaces the apparatus');assert(result.changes/result.frames>.8,value+' visibly skips animation frames');assert(result.distinctPerSecond>25,value+' insufficient visible updates');rows.push({slug:'ride-acceleration',mode:value,...result});
   const time=await page.locator('#time').inputValue();await page.waitForTimeout(100);assert.equal(await page.locator('#time').inputValue(),time,'pause drift');
   for(const [width,height]of sizes){await page.setViewportSize({width,height});await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));const result=await page.evaluate(layout);assert.deepEqual(result,{overflow:false,fonts:[],controls:[]},value+' '+width);}
   if(['swing','circle','slide'].includes(value))await shot(page.locator('[data-inquiry]'),path.join(output,engine+'-ride-'+value+'.webp'));
  }
  await click('#resetExperiment');const group=page.locator('[data-for="motion"]');await group.locator('[aria-checked="true"]').focus();await page.keyboard.press('End');assert.equal(await page.locator('#motion').inputValue(),'slide');await page.keyboard.press('Home');assert.equal(await page.locator('#motion').inputValue(),'circle');
  for(const item of experiments){await open(item.slug);await item.prepare?.(page);for(const id of item.start)await click(id);await page.locator(item.scene).scrollIntoViewIfNeeded();await page.locator(item.node).first().waitFor({state:'attached'});const result=await motion(page,item.node,item.attr,item.duration);console.log(engine,item.slug,JSON.stringify(result));assert(result.sameSvg&&result.sameNode,item.slug+' replaces SVG nodes');assert(result.changes/result.frames>.75,item.slug+' visible updates too sparse');assert(result.distinctPerSecond>25,item.slug+' visibly low cadence');await click(item.stop);rows.push({slug:item.slug,...result});await shot(page.locator(item.scene),path.join(output,engine+'-'+item.slug+'.webp'));}
  // A disabled source condition disables every corresponding visible choice.
  await open('electroplating');for(const id of ['#plConnect','#plDip'])await click(id);assert(await page.locator('[data-for="plWiring"] button').evaluateAll(bs=>bs.every(b=>b.disabled)));await click('#plReset');assert(await page.locator('[data-for="plWiring"] button').evaluateAll(bs=>bs.every(b=>!b.disabled)));
  assert.deepEqual(errors,[]);
 }finally{await browser.close();fs.writeFileSync(path.join(output,'motion-'+engine+'.json'),JSON.stringify({engine,physicalDeviceTested:false,rows,errors},null,2)+'\n');}
});
