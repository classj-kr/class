// Full catalogue visual/action audit. Run motion sampling without other browser
// jobs; screenshots are lossless WebP and the source tree stays frozen during it.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),pw=require('playwright'),sharp=require('sharp');
const inspect=require('./science-readability-inspect.cjs');
const root=path.resolve(__dirname,'../learning/inquiry/science-lab'),map=require(path.join(root,'curriculum-map.js'));
const engine=process.argv.includes('--webkit')?'webkit':'chromium',selected=process.env.SCIENCE_DEVICE_SLUGS?.split(','),out=path.resolve(process.env.SCIENCE_TEST_ARTIFACTS||'docs/science-lab-audit-2026-10-18/full-visual-review/runtime');fs.mkdirSync(out,{recursive:true});
const rows=[],errors=[],routes=Object.entries(map).filter(([s])=>!selected||selected.includes(s)).flatMap(([slug,r])=>r.courseContexts?Object.keys(r.courseContexts).map(school=>({slug,school})):[{slug}]);
const actions={
 'acoustic-resonance':['#acPower'], 'water-wave-tank':['#playWave'],
 'speaker-lab':['#magnet','#stripped','#connected','#playSignal'], 'wireless-power':['#power'],
 'transistor-speaker':['#power','#playSignal'], 'magnetic-brake':['#drop'], 'soap-film':['#dip','#drain'],
 'electron-slits':['#runElectrons'], 'sugar-phase':['#dissolveSugar','#startTemperature'],
 'bean-respiration':['#startBeans'], 'catalyst-foam':['#cfPrepare','#cfStart'],
 'electroplating':['#plClean','#plConnect','#plDip','#plPower'], 'galileo-incline':['#giPlay'],
 'reaction-pressure':['#rpAssemble','#rpConnect','#rpAcquire','#rpInject','#rpValve','#rpPlay'],
 'constellation-space':['#csRotate'], 'seasonal-sky':['#skyPlay'], 'kepler-data':['#kdPlay'],
 'video-motion':['#vmPlay'], 'rotating-annulus':['#annulusFill','#annulusIce','#annulusHeat','#annulusTracer','#annulusRun'],
 'rotating-disc':['#rdPrepare','#rdPlay'], 'cell-division':['#cdPlay'],
 'liquid-heat':['#lhPrepare','#lhConnect','#lhStart'],
 'temperature-clouding':['#tcPrepare','#tcMix'], 'yeast-fermentation':['#fmPrepare','#fmPlay'],
 'sea-level-causes':['#slPrepare','#slMark','#slPlay'], 'water-electrolysis':['#elFill','#elPower'],
 'spring-wave-speed':['#wvPlay'], 'phase-curves':['#hcPlay'], 'living-environment':['#pgPlay'],
 'dissolution-mass':['#dmZero','#dmBeaker','#dmPaper','#dmRod','#dmRead','#dmClear','#dmPour','#dmStir'], 'satellite-sea-temperature':['#sstPlay'],
 'diffusion':['#playBtn'], 'plate-tectonics':['#tdPlay'], 'ride-acceleration':['#measureRide','#play'],
 'sound-vibration':['#tfHold','[data-tf-strike="strong"]'],
 'polarized-thin-sections':['#tsMount','#tsPlay'],
 'dna-structure':['#dnaRotate'], 'iodine-clock':['#icStart'],
 'mixture-separation':['#waterBtn'], 'acid-base':['#dipButton'], 'newton-prism':['#lamp'],
 'infection-prevention':['#spray'], 'pasteur':['#heat'], 'polarization':['#filter'],
 'acid-mixing':['#amIndicator','#amPlay'], 'weather-analysis':['#waPlay'],
 'leaf-pigments':['#pgExtract','#pgSpot','#pgDry','#pgStart'],
 'digestive-enzymes':['#diPrepare','#diIncubate','#diSample','#diReagent','#diHeat'],
 'phase-mass':['#pmZero','#pmPrepare','#pmMark','#pmWeigh','#pmRemove','#pmCool'],
 'air-sampling':['[name="airInlet"][value="filter"]','#airZero','[name="airInlet"][value="open"]','#airMeasureA'],
 'light-interference':['#liSlit','#liPower'], 'gas-identification':['#weighBefore','#collectGas'],
 'silver-mirror':['#silverReagent','#ammoniaReagent','#testSample','#baseReagent','#rollVial'],
 'nylon-interface':['#makeLayers','#pullNylon'], 'antibiotic-disc':['#incubate'],
 'mcu-sampling':['#boardPower','#boardGround','#uploadProgram','#collectSensor'], 'insulation-lab':['#step'],
 'protein-synthesis':['#transcribe'], 'coastal-inundation':['#coBuild','#coMark','#coPour'],
};
const discrete=new Set(['living-environment','satellite-sea-temperature','sunspot-observation','phase-curves','plate-tectonics','yeast-fermentation','electron-slits','pea-genetics','land-sea','measurement','living-things','phylogeny','galaxy-hubble']);
const modeControls={
 'ride-acceleration':{select:'motion'},'transistor-speaker':{select:'mode'},'sugar-phase':{select:'mode'},'bean-respiration':{select:'mode'},'insulation-lab':{select:'mode'},'spring-wave-speed':{select:'wvMode'},'acoustic-resonance':{select:'acMode'},
 'body-organs':{attribute:'data-sys'},'cell-division':{attribute:'data-kind'},'senses':{attribute:'data-sense'},'magma':{attribute:'data-kind'},
 'temperature-clouding':{attribute:'data-tc-mode'},'iodine-clock':{attribute:'data-ic-mode'},'rotating-annulus':{attribute:'data-annulus-view'},'video-motion':{attribute:'data-vm-demo'},
 'reflex-nerve':{attribute:'data-path'},'life-cycle':{attribute:'data-animal'},'diffusion':{attribute:'data-df-mode'},'mcu-sampling':{select:'sensorMode'},
};
async function painted(page){
 await page.bringToFront();
 await page.evaluate(async()=>{let timer;try{await Promise.race([document.fonts.ready,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Fonts did not settle within 10 seconds')),10000);})]);}finally{clearTimeout(timer);}await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('No rendered frame within 10 seconds')),10000);requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{clearTimeout(timer);resolve();})));});});
}
async function prepare(page,slug){
 if(slug==='dna-structure')await page.evaluate(require('../tests/science-dna-scenario.cjs'),'0');
 if(slug==='iodine-clock'){const mode=await page.locator('[data-ic-mode][aria-pressed=true]').getAttribute('data-ic-mode');await page.evaluate(require('../tests/science-iodine-clock-scenario.cjs'),mode+':ready');}
 if(slug==='force-motion')await page.locator('#forceRange').fill('20');
 if(slug==='cell-division'){await page.evaluate(()=>window.__divModel.setStage(4));await page.waitForTimeout(900);}
 if(slug==='life-cycle')await page.locator('[data-life-step="1"]').click();
 if(slug==='diffusion')await page.evaluate(()=>{if(__diffusionModel.state().mode==='btb')__diffusionModel.setProgress(.25);});
 if(slug==='polarized-thin-sections')await page.locator('#tsFocus').fill('50');
 if(slug==='telescope-observation')await page.evaluate(()=>{for(const e of document.querySelectorAll('[data-part]'))e.click();const target=window.__telescope.getResult().target;for(const [id,value]of [['scopeBalance',0],['scopeFinder',0],['scopeX',target.x],['scopeY',target.y],['scopeFocus',0]]){const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('input'));}document.querySelector('[data-view="eyepiece"]').click();});
 if(['cell-structure','microbes'].includes(slug)){
  await page.evaluate(()=>{const click=id=>document.getElementById(id)?.click(),n=document.querySelectorAll('[data-mb-step]').length;for(let i=0;i<n;i++)document.querySelector('[data-mb-step="'+i+'"]').click();click('mbPlace');const lamp=document.getElementById('mbLamp');if(lamp?.getAttribute('aria-pressed')!=='true')lamp?.click();const e=document.getElementById('mbFocus');e.value=6;e.dispatchEvent(new Event('input'));});
  await page.waitForFunction(()=>document.getElementById('mbImage')?.complete&&document.getElementById('mbImage').naturalWidth>0);
 }
}
async function sample(page,duration){return page.evaluate(duration=>new Promise(resolve=>{
 const figures=[...document.querySelectorAll('main svg,main canvas')].filter(e=>e.getBoundingClientRect().width>150&&!e.closest('.quiz-section,[hidden]'));
 const initial=figures.flatMap(s=>[...s.querySelectorAll('path,circle,rect,ellipse,g')]),animated=[...document.querySelectorAll('animate,animateTransform')].map(e=>({target:e.parentElement,attribute:e.getAttribute('attributeName'),transform:e.localName==='animateTransform'}));
 let changed=false,frames=0,changes=0,geometryMutations=0,start=0,previous=0,lastCSS='',lastCanvas='',gaps=[],changedTimes=[];
 const changedNodes=new Set(),nodeFrames=new Map();
 const ob=new MutationObserver(ms=>{for(const m of ms){if(m.target.closest?.('text,defs,marker,clipPath,.quiz-section'))continue;if(m.type==='attributes'&&m.oldValue!==m.target.getAttribute(m.attributeName)&&['transform','x','y','cx','cy','r','rx','ry','width','height','d','points','opacity','fill','stroke-dashoffset','style'].includes(m.attributeName)){changed=true;geometryMutations++;changedNodes.add(m.target);}else if(m.type==='childList'&&[...m.addedNodes,...m.removedNodes].some(n=>n.nodeType===1&&n.matches('svg,g,path,circle,rect,ellipse'))){changed=true;geometryMutations++;}}});for(const el of figures)if(el.tagName.toLowerCase()==='svg')ob.observe(el,{attributes:true,attributeOldValue:true,childList:true,subtree:true});
 function frame(now){if(!start)start=now;if(previous)gaps.push(now-previous);previous=now;frames++;
  const css=[...document.getAnimations()].filter(a=>a.playState==='running').map(a=>a.effect?.target).filter(e=>e?.closest('main')&&!e.closest('.quiz-section'));
  const fingerprint=animated.map(({target:e,attribute,transform})=>{if(transform){const m=e.getCTM();return m?[m.a,m.b,m.c,m.d,m.e,m.f].join(','):'';}const value=e[attribute]?.animVal;return value?.valueAsString??value?.value??(typeof value==='number'?value:getComputedStyle(e).getPropertyValue(attribute));}).join('|')+'|'+css.map(e=>{const s=getComputedStyle(e);return [s.transform,s.translate,s.rotate,s.scale,s.opacity,s.strokeDashoffset,s.width,s.height,s.top,s.left,s.backgroundColor,s.filter].join(',');}).join('|');
  const pixels=figures.filter(e=>e.tagName.toLowerCase()==='canvas').map(e=>(e.__visualHash||0)+':'+getComputedStyle(e).transform).join('|');
  if(changed||fingerprint!==lastCSS||pixels!==lastCanvas){changes++;changedTimes.push(now-start);lastCSS=fingerprint;lastCanvas=pixels;}changed=false;
  for(const node of changedNodes)nodeFrames.set(node,(nodeFrames.get(node)||0)+1);changedNodes.clear();
  if(now-start<duration)requestAnimationFrame(frame);else{ob.disconnect();gaps.sort((a,b)=>a-b);const active=changedTimes.slice(1),activeMs=active.length>1?active.at(-1)-active[0]:0,runs=[];for(const time of active){if(!runs.length||time-runs.at(-1).at(-1)>80)runs.push([]);runs.at(-1).push(time);}const burst=runs.sort((a,b)=>b.length-a.length)[0]||[],burstMs=burst.length>1?burst.at(-1)-burst[0]:0;resolve({burstFrames:burst.length,burstDurationMs:burstMs,burstUpdatesPerSecond:burstMs?(burst.length-1)/(burstMs/1000):0,frames,changes,seconds:(now-start)/1000,distinctPerSecond:changes/((now-start)/1000),changedFrameRatio:changes/frames,p95FrameMs:gaps[Math.floor(gaps.length*.95)],activeUpdatesPerSecond:activeMs?(active.length-1)/(activeMs/1000):0,firstChangeMs:active[0]??null,lastChangeMs:active.at(-1)??null,maxChangeGapMs:active.length>1?Math.max(...active.slice(1).map((t,i)=>t-active[i])):null,geometryMutations,retained:initial.length?initial.filter(e=>e.isConnected).length/initial.length:null,sparseGeometry:[...nodeFrames].filter(([e,n])=>e.isConnected&&n>3&&n/frames<.65).slice(0,20).map(([e,n])=>({tag:e.localName,id:e.id,css:e.getAttribute('class'),updates:n,ratio:n/frames}))});}}
 requestAnimationFrame(frame);
}),duration);}
async function captures(page,prefix){const result=[];const stage=page.locator('#tsPlay[aria-pressed="true"]');if(await stage.count())await stage.click();await painted(page);const handles=await page.locator('main svg,main canvas,main img').elementHandles();for(const [i,e]of handles.entries()){
 const info=await e.evaluate(e=>{const b=e.getBoundingClientRect(),s=getComputedStyle(e);return {visible:e.isConnected&&b.width>=160&&b.height>=90&&!e.closest('.quiz-section,[hidden],defs')&&s.visibility!=='hidden'&&s.opacity!=='0'&&(!(e instanceof HTMLImageElement)||e.complete&&e.naturalWidth>0),width:b.width,height:b.height,id:e.id,tag:e.tagName};}).catch(()=>({visible:false}));if(!info.visible)continue;
 // Element handles survive insertions of supplementary figures above them.
 await e.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));await painted(page);if(!await e.isVisible())continue;const bytes=await e.screenshot({type:'png',timeout:5000}),file=prefix+'-'+i+'.webp';await sharp(bytes).webp({lossless:true,effort:3}).toFile(path.join(out,file));result.push({file,...info});}
 // Some preparation benches are HTML/CSS apparatus with no SVG or canvas.
 if(!result.length){const el=page.locator('.experiment-layout,[data-physics],[data-inquiry],[data-chemistry],main').first();const b=await el.boundingBox();await el.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await painted(page);const file=prefix+'-bench.webp';const bytes=await page.screenshot({type:'png'});await sharp(bytes).webp({lossless:true}).toFile(path.join(out,file));result.push({file,tag:'HTML',width:1024,height:768,benchHeight:b?.height});}
 return result;
}
(async()=>{const server=http.createServer((req,res)=>{let p=path.resolve(root,'.'+new URL(req.url,'http://local').pathname);if(p!==root&&!p.startsWith(root+path.sep))return res.writeHead(403).end();if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,'index.html');fs.readFile(p,(e,b)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp'}[path.extname(p)]||'application/octet-stream');res.end(b);});});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser,current;
try{browser=await pw[engine].launch({headless:true,...engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{} });const context=await browser.newContext({...engine==='webkit'?pw.devices['iPad (gen 7)']:{deviceScaleFactor:1.25},viewport:{width:1024,height:768},hasTouch:true});const page=await context.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push({...current,error:e.message}));
await page.addInitScript(()=>{
 const proto=CanvasRenderingContext2D.prototype;
 const addStop=CanvasGradient.prototype.addColorStop;CanvasGradient.prototype.addColorStop=function(offset,color){let hash=this.__visualHash||2166136261;for(const c of offset+':'+color)hash=Math.imul(hash^c.charCodeAt(0),16777619);this.__visualHash=hash;return addStop.call(this,offset,color);};
 for(const property of ['width','height']){const descriptor=Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,property);Object.defineProperty(HTMLCanvasElement.prototype,property,{...descriptor,set(value){this.__visualHash=0;descriptor.set.call(this,value);}});}
 for(const name of ['moveTo','lineTo','arc','ellipse','fillRect','strokeRect','drawImage','setTransform','translate','rotate','scale','transform','fill','stroke','putImageData']){const original=proto[name];proto[name]=function(...args){let hash=2166136261;const number=v=>{hash=Math.imul(hash^Math.round(v*1000),16777619);};for(const v of args){if(typeof v==='number')number(v);else if(v?.data instanceof Uint8ClampedArray){const data=v.data;for(let i=0;i<data.length;i+=Math.max(4,Math.floor(data.length/128/4)*4)){number(data[i]);number(data[i+1]);number(data[i+2]);}}else if(v?.__visualHash!==undefined)number(v.__visualHash);}
  for(const style of [this.fillStyle,this.strokeStyle]){if(style?.__visualHash!==undefined)number(style.__visualHash);else for(const c of String(style))hash=Math.imul(hash^c.charCodeAt(0),16777619);}number(this.globalAlpha);this.canvas.__visualHash=((this.canvas.__visualHash||0)+hash)|0;return original.apply(this,args);};}
 const clear=proto.clearRect;proto.clearRect=function(...a){this.canvas.__visualHash=0;return clear.apply(this,a);};
});
for(const route of routes){current=route;const url=`http://127.0.0.1:${server.address().port}/${route.slug}/${route.school?'?school='+route.school:''}`,row={...route,states:[]};try{
 await page.goto(url);await page.waitForSelector('[data-assessment-ready]',{state:'attached'});await page.waitForFunction(()=>window.scienceAppContext?.standaloneApparatus||document.querySelector('script[src*="supplement-labs.js"]'));await page.waitForLoadState('networkidle');await painted(page);
 const control=modeControls[route.slug]||{attribute:'data-mode'};
 const modes=route.slug==='polarized-thin-sections'?['ppl','xpl']:await page.evaluate(control=>control.select?[...document.querySelectorAll('#'+control.select+' option')].filter(e=>!e.disabled&&!e.hidden).map(e=>e.value):[...document.querySelectorAll('button['+control.attribute+']')].filter(e=>e.getBoundingClientRect().width).map(e=>e.getAttribute(control.attribute)),control);if(!modes.length)modes.push(null);
 for(const [mi,mode]of modes.entries()){
  await painted(page);if(mode!==null){if(route.slug==='polarized-thin-sections'){if(mode==='xpl')await page.locator('#tsAnalyzer').click();}else if(control.select)await page.locator('#'+control.select).selectOption(mode);else await page.locator('button['+control.attribute+'="'+mode+'"]').click();}await painted(page);
  await prepare(page,route.slug);
  const actionResults=[];let selectors=route.slug==='periodic-bonding'&&mode==='elements'?[]:actions[route.slug];if(!selectors){const available=await page.evaluate(()=>['checkBtn','runBtn','playBtn','heatBtn','growBtn','runExperimentBtn'].filter(id=>{const e=document.getElementById(id);return e&&!e.disabled&&e.getBoundingClientRect().width&&!e.closest('.quiz-section');}));selectors=available.slice(0,1).map(s=>'#'+s);}
  await page.evaluate(()=>[...document.querySelectorAll('main svg,main canvas')].find(e=>e.getBoundingClientRect().width>150)?.scrollIntoView({block:'center',behavior:'instant'}));await painted(page);
  for(const selector of selectors){const el=page.locator(selector);if(await el.count()&&await el.isVisible()&&await el.isEnabled()){await el.evaluate(e=>e.click());actionResults.push({selector,clicked:true});}else actionResults.push({selector,clicked:false});}
  // Observe the chromatid travel, after the authored reading pause between stages.
  if(route.slug==='cell-division')await page.waitForTimeout(1350);
  await page.waitForTimeout(process.argv.includes('--smoke')?Math.max(80,Number(process.env.SCIENCE_CAPTURE_DELAY_MS)||80):80);
  const readabilityStart=await page.evaluate(inspect);
  const sampleDuration=Math.max(1200,Number(process.env.SCIENCE_MOTION_SAMPLE_MS)||1200);
  let movement=process.argv.includes('--smoke')?{changes:0,distinctPerSecond:0,notMeasured:true}:await sample(page,route.slug==='cell-division'?650:sampleDuration);
  const movementWindows=[{phase:'opening',...movement}];
  // Some lessons deliberately hold the initial state before a transition.
  if(!movement.notMeasured&&movement.changes<6&&!discrete.has(route.slug)&&actionResults.some(a=>a.clicked)){await page.waitForTimeout(1200);const later=await sample(page,sampleDuration);movementWindows.push({phase:'after-initial-hold',...later});if(later.changes>movement.changes)movement=later;}
  const visualMode=discrete.has(route.slug)?'discrete-observations':movement.changes>5?'continuous-motion':'static-or-selected-condition';
  const state={mode:mode||'initial',actions:actionResults,visualMode,movement,movementWindows,readabilityStart,readability:await page.evaluate(inspect),captures:[]};
  if(movement.changes>5){await page.waitForTimeout(400);state.readabilityLater=await page.evaluate(inspect);}
  if(!process.argv.includes('--no-captures'))state.captures=await captures(page,engine+'-'+route.slug+(route.school?'-'+route.school:'')+'-'+mi);
  row.states.push(state);console.log(engine+' '+route.slug+' '+state.mode+' '+movement.distinctPerSecond.toFixed(1)+' updates/s '+state.captures.length+' figures');
  // Each mode starts from its own authored setup; no clock crosses modes.
  if(mi<modes.length-1){await page.goto(url);await page.waitForSelector('[data-assessment-ready]',{state:'attached'});await page.waitForLoadState('networkidle');}
 }
 row.fontFamilies=await page.evaluate(()=>[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family));
}catch(e){row.error=e.message;errors.push({...route,error:e.message});console.log('ERROR '+route.slug+' '+e.message);}rows.push(row);fs.writeFileSync(path.join(out,'visuals-'+engine+'.json'),JSON.stringify({engine,complete:rows.length===routes.length,physicalDeviceTested:false,routes:routes.length,rows,errors},null,2));}
}finally{await browser?.close();await new Promise(r=>server.close(r));}
console.log(JSON.stringify({engine,routes:rows.length,states:rows.reduce((n,r)=>n+r.states.length,0),errors}));if(errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
