// Screen-pixel typography, including transformed SVG and canvas text.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'../learning/inquiry/science-lab'),map=require(path.join(root,'curriculum-map.js'));
const engine=process.argv.includes('--webkit')?'webkit':'chromium',baseline=process.argv.includes('--baseline');
const selected=process.argv.find(a=>a.startsWith('--slugs='))?.slice(8).split(',');
const widths=process.argv.includes('--quick')?[1366]:[1366,1180,1024,820,768];
const extended=process.argv.includes('--extended'),catalog=process.argv.includes('--catalog');
const liveWebFonts=process.env.SCIENCE_LIVE_FONTS==='1',loadedFontFamilies=new Set();
const deviceProfile=process.env.SCIENCE_DEVICE||null;
const deviceOptions=deviceProfile==='ipad'?require('playwright').devices['iPad (gen 7)']:deviceProfile==='chromebook-scale'?{deviceScaleFactor:1.25}:{};
if(deviceProfile&&!['ipad','chromebook-scale'].includes(deviceProfile))throw Error('Unknown device profile');
if(deviceProfile==='ipad'&&engine!=='webkit')throw Error('iPad profile requires WebKit');
const output=path.resolve(process.env.SCIENCE_TEST_ARTIFACTS||'docs/science-lab-audit-2026-10-12/readability');fs.mkdirSync(output,{recursive:true});
const completedRoutes=[];
async function prepareEquilibriumColour(page,value){
 const click=s=>page.locator(s).click(),settle=()=>page.waitForFunction(()=>!__equilibriumColour.getState().pending);
 await page.emulateMedia({reducedMotion:'reduce'});await click('#ecReset');
 if(value.startsWith('pressure')){await click('[data-mode=pressure]');await click('#ecCompress');await settle();if(value==='pressure-final'){await click('#ecEquilibrate');await settle();}}
 else if(value.startsWith('cobalt')){await click('[data-mode=temperature]');await click('#ecFill');await click('#ecChloride');await settle();if(value!=='cobalt-prepared'){await click('[data-ec-bath=hot]');await settle();if(value==='cobalt-cold'){await click('[data-ec-bath=cold]');await settle();}}}
 else{await click('[data-mode=concentration]');await click('#ecPrepare');const indexes=value==='complete'?[0,1,2,3]:value==='prepared'?[]:[Number(value)];for(const i of indexes){await click('[data-ec-tube="'+i+'"]');await click('[data-ec-reagent="'+(i<2?'acid':'base')+'"]');await click('#ecAdd');await settle();}}
}
async function painted(page){
 await page.bringToFront();
 if(liveWebFonts)await page.evaluate(async()=>{document.body.getBoundingClientRect();let timer;try{await Promise.race([document.fonts.ready,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Newly displayed text fonts did not settle within 10 seconds')),10000);})]);}finally{clearTimeout(timer);}});
 await page.evaluate(()=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('No rendered frame within 10 seconds')),10000);requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{clearTimeout(timer);resolve();})));}));
}
function inspect(){
 const visible=e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden'&&!e.closest('[hidden],defs,clipPath,mask')&&e.getBoundingClientRect().width>0;
 const fonts=[],clipped=[],overlaps=[],canvas=[];
 const pictogram=s=>/^[\p{Extended_Pictographic}\uFE0F\u200D\s←→↑↓↔↕·•①②③④⑤⑥]+$/u.test(s);
 const add=(kind,e,px,text)=>{if(px<13.8||px>(kind==='svg'?16.2:24))fonts.push({kind,text:text.trim().slice(0,85),px:+px.toFixed(2),element:e.tagName,css:typeof e.className==='string'?e.className:e.className?.baseVal});};
 for(const e of document.querySelectorAll('main *')){if(!visible(e)||e.closest('svg')||e.matches('script,style,h1,option,sub,sup')||e.closest('.sr-only,[aria-hidden=true]'))continue;
  if([...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))add('html',e,parseFloat(getComputedStyle(e).fontSize),e.textContent);
  if(e.matches('button,p,th,td')&&e.clientWidth>0&&e.scrollWidth>e.clientWidth+2)clipped.push(e.textContent.trim().slice(0,75));
  if(e.matches('button,select')&&e.getBoundingClientRect().height<43.5)clipped.push('터치 높이: '+e.textContent.trim().slice(0,50));
 }
 for(const svg of document.querySelectorAll('svg')){if(!visible(svg))continue;const box=svg.getBoundingClientRect(),texts=[];
  for(const e of svg.querySelectorAll('text')){if(!visible(e)||!e.textContent.trim()||pictogram(e.textContent.trim()))continue;const m=e.getScreenCTM();if(!m)continue;const px=parseFloat(getComputedStyle(e).fontSize)*Math.hypot(m.c,m.d);add('svg',e,px,e.textContent);const ink=window.scienceTextInkBox?.(e);const points=ink?[[ink.x,ink.y],[ink.x+ink.width,ink.y],[ink.x,ink.y+ink.height],[ink.x+ink.width,ink.y+ink.height]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(m)):null;const b=points?{left:Math.min(...points.map(p=>p.x)),right:Math.max(...points.map(p=>p.x)),top:Math.min(...points.map(p=>p.y)),bottom:Math.max(...points.map(p=>p.y))}:e.getBoundingClientRect();
   if(b.left<box.left-3||b.right>box.right+3||b.top<box.top-3||b.bottom>box.bottom+3)clipped.push(e.textContent.trim().slice(0,75));
   texts.push({text:e.textContent.trim(),b});
  }
  for(let i=0;i<texts.length;i++)for(let j=i+1;j<texts.length;j++){const a=texts[i],b=texts[j],w=Math.min(a.b.right,b.b.right)-Math.max(a.b.left,b.b.left),h=Math.min(a.b.bottom,b.b.bottom)-Math.max(a.b.top,b.b.top);if(w>4&&h>5)overlaps.push([a.text.slice(0,45),b.text.slice(0,45)]);}
 }
 for(const c of document.querySelectorAll('canvas')){if(!visible(c))continue;const b=c.getBoundingClientRect(),scale=getComputedStyle(c).objectFit==='contain'?Math.min(b.width/c.width,b.height/c.height):b.height/c.height;for(const row of c.__textAudit?.values()||[]){const px=row.px*scale;if(px<13.8||px>16.2)canvas.push({id:c.id,text:row.text,px:+px.toFixed(2)});}}
 return{overflow:document.documentElement.scrollWidth>innerWidth+1,fonts,clipped,overlaps,canvas};
}
async function prepareMoleWeighing(page,mode){
 const click=id=>page.locator('#'+id).click(),stable=()=>page.waitForFunction(()=>__moleWeighing.getState().settled);
 await page.locator('[data-mode=weigh]').click();await click('mwReset');await click('mwPower');await click('mwLevel');
 const measure=async(id,mass,tare=true)=>{await page.locator('[data-mw-sample="'+id+'"]').click();await click('mwPlace');await stable();if(tare)await click('mwTare');await page.evaluate(mass=>{let cents=Math.round(mass*100);for(const step of [10,1,.1,.01]){document.querySelector('[data-mw-step="'+step+'"]').click();while(cents>=Math.round(step*100)){document.querySelector('#mwAdd').click();cents-=Math.round(step*100);}}},mass);await stable();await click('mwCheck');};
 if(mode==='complete'){for(const[id,mass]of [['carbon',6],['salt',29.25],['magnesium',12.15],['water',9],['ethanol',23],['copper',31.75],['glucose',90]])await measure(id,mass);return;}
 await measure(mode==='liquid'?'ethanol':'carbon',mode==='wrong'?5:mode==='liquid'?23:6,mode!=='untared');
 if(mode==='loaded-tare'){await click('mwTare');await click('mwCheck');}
 if(mode==='empty'){await click('mwTare');await click('mwEmpty');await stable();}
 if(['solid','liquid'].includes(mode))await click('mwShowCalculation');
}
async function prepareCells(page,value){
 await page.locator('#mbReset').click();
 const samples=value==='all'?['cheek','leaf','leaf-stained']:[value==='zoom'?'leaf-stained':value.split(':')[0]],stage=value.split(':')[1]||'ready';
 for(const sample of samples){
  await page.locator('[data-mb-sample="'+sample+'"]').click();
  if(stage==='before')continue;
  for(let i=0,n=await page.locator('[data-mb-step]').count();i<n;i++)await page.locator('[data-mb-step="'+i+'"]').click();
  if(stage==='prepared')continue;
  await page.locator('#mbPlace').click();if(stage==='dark')continue;
  if(await page.locator('#mbLamp').getAttribute('aria-pressed')==='false')await page.locator('#mbLamp').click();if(stage==='blur')continue;
  await page.locator('#mbFocus').evaluate(e=>{e.value=6;e.dispatchEvent(new Event('input'));});
  await page.waitForFunction(()=>document.querySelector('#mbImage').complete&&document.querySelector('#mbImage').naturalWidth>0);await page.locator('#mbObserve').click();
 }
 if(value==='zoom'){await page.locator('#mbZoom').evaluate(e=>{e.value=1.8;e.dispatchEvent(new Event('input'));});await page.locator('#mbViewer').focus();await page.keyboard.press('ArrowRight');}
}
async function preparePh(page,mode){
 const tap=id=>page.locator('#'+id).click(),select=id=>page.locator('[data-pc-liquid="'+id+'"]').click(),dip=async()=>{await tap('pcImmerse');await page.waitForFunction(()=>__phComparison.getState().settled);};
 await tap('pcReset');if(mode==='uncalibrated'){await select('hcl');await dip();await tap('pcMeasure');return;}
 for(const id of ['neutral','acid','base']){if(await page.locator('#pcLift').isEnabled())await tap('pcLift');await tap('pcRinse');await select(id);await dip();await tap('pcCalibrate');}
 if(mode==='calibrated')return;if(mode==='dirty'){await tap('pcLift');await select('hcl');await dip();await tap('pcMeasure');return;}
 for(const id of mode==='complete'?['hcl','acetic','naoh','ammonia']:[mode]){await tap('pcLift');await tap('pcRinse');await select(id);await dip();await tap('pcMeasure');}await tap('pcCalculate');
}
(async()=>{const server=http.createServer((req,res)=>{let p=path.resolve(root,'.'+new URL(req.url,'http://local').pathname);if(p!==root&&!p.startsWith(root+path.sep))return res.writeHead(403).end();if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,'index.html');fs.readFile(p,(e,b)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp'}[path.extname(p)]||'application/octet-stream');res.end(b);});});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser,cursor=0,scenarios=0;const issues=[],errors=[],routes=catalog?[{slug:''}]:Object.entries(map).filter(([s])=>!selected||selected.includes(s)).flatMap(([slug,r])=>r.courseContexts?Object.keys(r.courseContexts).map(school=>({slug,school})):[{slug}]);
 // WebKit can suspend rAF in the last background page after another worker
 // closes. One page keeps the real repaint waits valid instead of bypassing them.
 try{browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});await Promise.all(Array.from({length:engine==='webkit'?1:3},async()=>{const page=await browser.newPage({...deviceOptions,hasTouch:true});let current;
  page.on('pageerror',e=>errors.push({route:current,error:e.message}));await page.route('**/*',r=>{const host=new URL(r.request().url()).hostname,kind=r.request().resourceType();return host==='127.0.0.1'||liveWebFonts&&['stylesheet','font'].includes(kind)&&['fonts.googleapis.com','fonts.gstatic.com','cdn.jsdelivr.net'].includes(host)?r.continue():r.abort();});
  await page.addInitScript(()=>{const p=CanvasRenderingContext2D.prototype,fill=p.fillText,clear=p.clearRect,draw=p.drawImage;p.fillText=function(t,x,y,...rest){const m=this.getTransform(),c=this.canvas;c.__textAudit??=new Map();c.__textAudit.set(t+'|'+x+'|'+y,{text:String(t),px:parseFloat(this.font.match(/([\d.]+)px/)?.[1]||0)*Math.hypot(m.c,m.d)});return fill.call(this,t,x,y,...rest);};p.clearRect=function(...a){this.canvas.__textAudit?.clear();return clear.apply(this,a);};p.drawImage=function(...a){if(a.length===3&&a[1]===0&&a[2]===0&&a[0].width>=this.canvas.width&&a[0].height>=this.canvas.height||a.length===9&&a[5]===0&&a[6]===0&&a[7]===this.canvas.width&&a[8]===this.canvas.height)this.canvas.__textAudit?.clear();return draw.apply(this,a);};});
  while(cursor<routes.length){const route=routes[cursor++];current=route;let routeScenarios=0;console.log(engine+': opening '+route.slug);await page.bringToFront();await page.goto(`http://127.0.0.1:${server.address().port}/${route.slug?route.slug+'/':''}${route.school?'?school='+route.school:''}`);await page.waitForSelector(catalog?'.catalog':'[data-assessment-ready]',{state:'attached'});await page.evaluate(()=>{document.querySelector('.quiz-section')?.setAttribute('open','');});await page.waitForLoadState('networkidle');await page.evaluate(()=>document.fonts.ready);
   const modes=catalog?['all','elementary','middle','high-common','high-elective'].map(value=>({kind:'catalog',value})):await page.locator('button[data-mode]').evaluateAll(es=>es.map(e=>({kind:'mode',value:e.dataset.mode})));
   if(!modes.length)modes.push({kind:'initial'});
   if(route.slug==='cell-division')await page.waitForFunction(()=>!!window.__divModel);
   if(route.slug==='phase-curves')await page.waitForFunction(()=>!!window.__phaseCurves);
   if(route.slug==='galactic-objects')await page.waitForFunction(()=>!!window.__galacticObjects);
   if(route.slug==='argo-observation')await page.waitForFunction(()=>window.__argoObservation?.snapshot().ready);
   if(route.slug==='satellite-sea-temperature')await page.waitForFunction(()=>window.__satelliteSST?.snapshot().ready);
   if(route.slug==='plate-tectonics')await page.waitForFunction(()=>window.__tectonicData?.snapshot().ready);
   if(extended){modes.push(...await page.evaluate(()=>[
    ...[...document.querySelectorAll('[data-experiment]')].flatMap(e=>[false,true].map(last=>({kind:'required',value:e.dataset.experiment,last}))),
    ...[...document.querySelectorAll('[data-supplement-choice]')].map(e=>({kind:'supplement',key:e.dataset.supplementChoice,value:e.dataset.value})),
    ...[...document.querySelectorAll('#motion option')].map(e=>({kind:'ride',value:e.value})),
    ...(document.querySelector('[data-optics-part=device]')?[['plane','convexMirror','concaveMirror','convexLens','concaveLens'].flatMap(o=>['near','middle','far'].map(d=>o+':'+d)),['water','glass'].flatMap(m=>['in','out'].flatMap(d=>(d==='in'?[0,1,30,60,85]:[0,1,20,30,40]).map(a=>'ray:'+m+':'+d+':'+a)))].flat().map(value=>({kind:'optics',value})):[]),
    ...(document.querySelector('#amLab')?['cabbage','phenol'].flatMap(mode=>['acid','base'].flatMap(start=>['opposite','water'].flatMap(titrant=>(mode==='cabbage'?[0,5,15,20,25,30]:[0,1,2,2.5,5]).map(v=>[mode,start,titrant,v].join(':'))))).map(value=>({kind:'acid-mixing',value})):[]),
    ...(document.querySelector('#dfLab')?['ink:centre:0','ink:centre:0.15','ink:centre:0.5','ink:centre:1','ink:left:0.15','ink:right:0.15','ink:centre:0:particles','ink:centre:0.5:particles','ink:centre:1:particles','btb:vinegar:0','btb:vinegar:0.4','btb:vinegar:0.65','btb:vinegar:1','btb:water:1','btb:vinegar:0.5:particles','btb:water:1:particles'].map(value=>({kind:'diffusion',value})):[]),
      ...(document.querySelector('#rfLab')?['knee','leg','pupil','conscious'].flatMap(m=>['none:-1','none:1.5','none:2.5','none:3.5','none:5','sensory:5','motor:5'].map(s=>({kind:'reflex',value:m+':'+s}))):[]),
      ...(document.querySelector('#cdLab')?["mitosis:0","mitosis:1","mitosis:2","mitosis:3","mitosis:4","mitosis:5","mitosis:6","mitosis:7","meiosis:0","meiosis:1","meiosis:2","meiosis:3","meiosis:4","meiosis:5","meiosis:6","meiosis:7","meiosis:8","meiosis:9","meiosis:10","meiosis:11","meiosis:11:8:1","meiosis:11:6:0:5","mitosis:5:4","meiosis:8:4"].map(value=>({kind:'cell-division',value})):[]),
    ...(document.querySelector('#hcLab')?["initial","boil","boil-mid","melt","melt-mid","boil2","freeze","freeze-mid","freeze-zero","bottom","air","table","wrong","correct","lauric-ready","lauric-bath","lauric-mid","lauric-final","lauric-bottom","lauric-wrong","lauric-correct"].map(value=>({kind:'phase-curves',value})):[]),
    ...(document.querySelector('#goLab')?['initial','m5','crescent','witch','shark','compare','compare-nebula','zoom','classified','sky','sky-ground','sky-day','sky-plain','sky-jeju'].map(value=>({kind:'galactic',value})):[]),
    ...(document.querySelector('#sstLab')?['initial','difference','same','land','solomon','solomon-diff','sydney','sydney-diff','years','east'].map(value=>({kind:'sst',value})):[]),
    ...(document.querySelector('#aoLab')?['initial','surface','deep','missing','ts','ts-deep','map','same','january-july'].map(value=>({kind:'argo',value})):[]),
    ...(document.querySelector('#tdLab')?['world-quakes','world-all','japan','indonesia','andes','atlantic','hawaii','volcano-only','hidden','period','large','empty','selected','volcano-selected'].map(value=>({kind:'tectonic-data',value})):[]),
    ...(document.querySelector('#mrLab')?['rock-A','rock-B','rock-C','rock-D','rock-E','rock-F','quartz:streak','feldspar:streak','biotite:streak','calcite:acid','magnetite:clip','scratch','igneous-dark','igneous-light'].map(value=>({kind:'middle-rocks',value})):[]),
    ...(document.querySelector('#edLab')?['a','b'].flatMap(set=>['initial','eq'].flatMap(basis=>['simple','coefficient','square'].map(formula=>({kind:'equilibrium-data',value:[set,basis,formula].join(':')})))):[]),
    ...(document.querySelector('#skyLab')?['spring:night','summer:night','autumn:night','winter:night','winter:compare','spring:day','summer:dawn','autumn:zoom','winter:north','spring:jeju'].map(value=>({kind:'seasonal-sky',value})):[]),
    ...(document.querySelector('#dnaLab')?['wrong','flat','sequence','0','45','90','180'].map(value=>({kind:'dna-course',value})):[]),
    ...(document.querySelector('#elementComposition')?['A','B','missing','hydrogen','large','fusion-h','fusion-he','star-small','star-large','origin'].map(value=>({kind:'element-origin',value})):[]),
    ...(document.querySelector('#kdLab')?['wrong','all','metric','linear','inner','outer','minor','earth','extreme'].map(value=>({kind:'kepler-data',value})):[]),
    ...(document.querySelector('#hrLab')?['wrong','all','top','bottom','long-name','reversed','different-types','data'].map(value=>({kind:'hr-diagram',value})):[]),
    ...(document.querySelector('#vmLab')?['cart','projectile','cart-axis','cart-data','projectile-energy','projectile-mass'].map(value=>({kind:'video-motion',value})):[]),
    ...(document.querySelector('#ctLab')?['local','stations'].flatMap(value=>['initial','fit','correct','changed'].map(stage=>({kind:'crust-thickness',value,stage}))):[]),
    ...(document.querySelector('#tsLab')?['basalt-ppl','basalt-xpl','granite-ppl','granite-xpl','dark','blur','photos','classified','zoom'].map(value=>({kind:'thin-sections',value})):[]),
    ...(document.querySelector('#scLab')?['key','fossil'].flatMap(value=>['initial','wrong','linked','summary'].map(stage=>({kind:'strata-correlation',value,stage}))):[]),
    ...(document.querySelector('#annulusCanvas')?[{kind:'annulus',value:'top'},{kind:'annulus',value:'compare'},{kind:'annulus',value:'side'}]:[]),
    ...(document.querySelector('#sunCanvasA')?[{kind:'sunspot',value:'compare'},{kind:'sunspot',value:'sequence'},{kind:'sunspot',value:'overlay'}]:[]),
    ...(document.querySelector('#dockCanvas')?[{kind:'dock',value:'test'}]:[]),
    ...(document.querySelector('#cmScene')?['series','parallel'].flatMap(wiring=>['r1','r2','whole'].flatMap(target=>['voltage','current'].flatMap(meter=>['series','parallel'].map(connection=>({kind:'circuit',wiring,target,meter,connection}))))):[]),
    ...(document.querySelector('#airSite')?[{kind:'air',value:'pm25'},{kind:'air',value:'pm10'}]:[]),
    ...(document.querySelector('#bioArea')?Array.from({length:5},(_,value)=>['whole','leaf','flower'].map(view=>({kind:'bio',value,view}))).flat():[]),
    ...(document.querySelector('[data-practice]')?[0,1,2,3].map(value=>({kind:'course',slug:document.querySelector('[data-practice]').dataset.practice,value})):[]),
    ...(document.querySelector('.solution-lab[data-solution]')?[0,1,2,3].map(value=>({kind:'solution',slug:document.querySelector('.solution-lab[data-solution]').dataset.solution,value})):[]),
    ...(document.querySelector('.acoustic-lab')?['tube','microphone'].flatMap(value=>[false,true].map(measured=>({kind:'acoustic',value,measured}))):[]),
    ...(document.querySelector('.plating-lab')?['normal','dirty','reverse','touch','water','finished'].map(value=>({kind:'plating',value})):[]),
    ...(document.querySelector('.leaf-starch-lab')?['sun','water','ethanol','whole','half','none','retained','skip'].map(value=>({kind:'leaf-starch',value})):[]),
    ...(document.querySelector('.dissolution-lab')?['before','stir','after','missing','tare','sugar'].map(value=>({kind:'dissolution',value})):[]),
    ...(document.querySelector('.fw-lab')?['roles-wrong','roles-right','web-wrong','web-right','frog','sparrow','flow'].map(value=>({kind:'food-web',value})):[]),
    ...(document.querySelector('.pg-lab')?['water','light','both','same','larger','intermediate'].map(value=>({kind:'plant-growth',value})):[]),
    ...(document.querySelector('.fm-lab')?['before','observed','withdrawn','koh','water','air'].map(value=>({kind:'fermentation',value})):[]),
    ...(document.querySelector('.li-lab')?['bare','green','red','one','blocked','wide','tight','measured','edge'].map(value=>({kind:'light-interference',value})):[]),
    ...(document.querySelector('#mbLab')&&!window.__cellObservation?['mounted','dark','blur','gills','hyphae','mold','algae','paramecium','zoom','all'].map(value=>({kind:'microbe-observation',value})):[]),
    ...(window.__cellObservation?[...['cheek','leaf','leaf-stained'].flatMap(sample=>['before','prepared','dark','blur','ready'].map(stage=>sample+':'+stage)),'zoom','all'].map(value=>({kind:'cell-observation',value})):[]),
    ...(document.querySelector('#mwLab')?['untared','loaded-tare','solid','liquid','complete','empty','wrong'].map(value=>({kind:'mole-weighing',value})):[]),
    ...(document.querySelector('#rsLab')?['wrong','correct','A','B','C','D','E','F','A-detail','C-detail','D-detail','fossils','fossil-wrong','fossil-correct',...Array.from({length:8},(_,i)=>'cast-'+i),'layers','layers-full'].map(value=>({kind:'rock-specimens',value})):[]),
    ...(document.querySelector('#tfLab')?['held','paper-still','paper-moving','water-still','water-moving','hand-stop','comparison','bars','bars-moving'].map(value=>({kind:'tuning-fork',value})):[]),
    ...(window.__rateModel?[['exo','off',25],['exo','on',25],['endo','off',25],['endo','on',25],['endo','on',0],['endo','on',95],['endo','on',100]].map(value=>({kind:'rate-energy',value})):[]),
    ...(window.__rateModel?[[0,.5],[0,2],[25,.5],[25,2],[100,.5],[100,2]].map(value=>({kind:'rate-equilibrium',value})):[]),
    ...(document.querySelector('.ec-lab')?['prepared','0','1','2','3','complete','cobalt-prepared','cobalt-hot','cobalt-cold','pressure-compressed','pressure-final'].map(value=>({kind:'equilibrium-colour',value})):[]),
    ...(document.querySelector('.pc-lab')?['uncalibrated','calibrated','dirty','hcl','acetic','naoh','ammonia','complete'].map(value=>({kind:'ph-comparison',value})):[]),
    ...(document.querySelector('.qc-lab')?['selected','first','three','complete','empty','resample'].map(value=>({kind:'quadrat-community',value})):[]),
    ...(document.querySelector('.rd-lab')?['prepared','ccw-moving','still','ccw-slow','ccw-fast','cw-slow','cw-fast','all'].map(value=>({kind:'rotating-disc',value})):[]),
    ...(document.querySelector('.pm-lab')?['before','unzeroed','first','frozen','wet','wet-mass','wiped','complete'].map(value=>({kind:'phase-mass',value})):[]),
    ...(document.querySelector('.lh-lab')?['before','prepared','connected','moving','finished','mass','power','bottom','air'].map(value=>({kind:'liquid-heat',value})):[]),
    ...(document.querySelector('.ac-lab')?['before','partial','wrong','correct','legs','fins','magnified','moved'].map(value=>({kind:'animal-classification',value})):[]),
    ...(document.querySelector('.lc-lab')?['before','partial','wrong','correct','pointed','lobed','tip','edge'].map(value=>({kind:'leaf-classification',value})):[]),
    ...(document.querySelector('.om-lab')?['before','untared','ready','immersed','wet','blotted','complete'].map(value=>({kind:'osmosis-mass',value})):[]),
    ...(document.querySelector('.rp-lab')?['before','assembled','moving','complete','leak','range','disconnected','larger'].map(value=>({kind:'reaction-pressure',value})):[]),
    ...(document.querySelector('.gi-lab')?['before','moving','arrived','hollow','delay','same','steep'].map(value=>({kind:'galileo',value})):[])
   ]));if(route.slug==='protein-interaction')await page.waitForFunction(()=>window.__docking?.getState().ready);if(route.slug==='sunspot-observation')await page.waitForFunction(()=>window.__sunspot?.getState().ready);}
   for(const width of widths){await page.setViewportSize({width,height:({1366:768,1180:820,1024:768,820:1180,768:1024})[width]});for(const mode of modes){if(mode.kind==='optics')await page.evaluate(require('../tests/science-optics-scenario.cjs'),mode.value);if(mode.kind==='acid-mixing')await page.evaluate(require('../tests/science-acid-mixing-scenario.cjs'),mode.value);if(mode.kind==='diffusion')await page.evaluate(require('../tests/science-diffusion-scenario.cjs'),mode.value);if(mode.kind==='reflex')await page.evaluate(require('../tests/science-reflex-scenario.cjs'),mode.value);if(mode.kind==='cell-division'){await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(require('../tests/science-cell-division-scenario.cjs'),mode.value);}if(mode.kind==='phase-curves')await page.evaluate(require('../tests/science-phase-curves-scenario.cjs'),mode.value);if(mode.kind==='galactic')await page.evaluate(require('../tests/science-galactic-scenario.cjs'),mode.value);if(mode.kind==='sst')await page.evaluate(require('../tests/science-sst-scenario.cjs'),mode.value);if(mode.kind==='argo')await page.evaluate(require('../tests/science-argo-scenario.cjs'),mode.value);if(mode.kind==='tectonic-data')await page.evaluate(require('../tests/science-tectonic-data-scenario.cjs'),mode.value);if(mode.kind==='middle-rocks'){await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(require('../tests/science-middle-rocks-scenario.cjs'),mode.value);}if(mode.kind==='equilibrium-data')await page.evaluate(require('../tests/science-equilibrium-data-scenario.cjs'),mode.value);if(mode.kind==='seasonal-sky')await page.evaluate(require('../tests/science-seasonal-sky-scenario.cjs'),mode.value);if(mode.kind==='dna-course')await page.evaluate(require('../tests/science-dna-scenario.cjs'),mode.value);if(mode.kind==='element-origin')await page.evaluate(require('../tests/science-element-origin-scenario.cjs'),mode.value);if(mode.kind==='kepler-data')await page.evaluate(require('../tests/science-kepler-data-scenario.cjs'),mode.value);if(mode.kind==='hr-diagram')await page.evaluate(require('../tests/science-hr-diagram-scenario.cjs'),mode.value);if(mode.kind==='video-motion')await page.evaluate(require('../tests/science-video-motion-scenario.cjs'),mode.value);if(mode.kind==='cell-observation')await prepareCells(page,mode.value);if(route.slug==='cell-structure'&&mode.kind==='initial')await page.locator('#mbReset').click();if(route.slug==='equilibrium-colour'&&mode.kind==='mode')await page.locator('#ecReset').click();if(mode.kind==='equilibrium-colour')await prepareEquilibriumColour(page,mode.value);if(route.slug==='ph-comparison'&&mode.kind==='initial')await page.locator('#pcReset').click();if(mode.kind==='ph-comparison')await preparePh(page,mode.value);if(mode.kind==='mole-weighing')await prepareMoleWeighing(page,mode.value);if(route.slug==='mole'&&mode.kind==='mode'&&mode.value==='weigh')await page.locator('#mwReset').click();await page.evaluate(mode=>{
    const $=s=>document.querySelector(s);if(mode.kind==='initial'&&$('#rsLab')){$('[data-rs-mode=rocks]').click();$('#rsReset').click();}if(mode.kind==='catalog')$(`[data-school-filter="${mode.value}"]`).click();if(mode.kind==='mode')$(`button[data-mode="${mode.value}"]`)?.click();
    if(mode.kind==='required'){$(`[data-experiment="${mode.value}"]`).click();$('.required-experiments [data-reset]').click();if(mode.last)for(const key of [...document.querySelectorAll('[data-required-field]')].map(e=>e.dataset.requiredField)){const e=$(`[data-required-field="${key}"]`);e.selectedIndex=e.options.length-1;e.dispatchEvent(new Event('change',{bubbles:true}));}}
    if(mode.kind==='initial'&&$('#tfLab')){$('[data-tf-mode=fork]').click();$('#tfReset').click();}
    if(mode.kind==='supplement'){if($('#tfLab'))$('[data-tf-mode=bars]').click();$(`[data-supplement-choice="${mode.key}"][data-value="${mode.value}"]`)?.click();}
    if(mode.kind==='tuning-fork'){
     $('[data-tf-mode=fork]').click();$('#tfReset').click();$('#tfHold').click();
     const contact=v=>$('[data-tf-contact="'+v+'"]').click(),strike=()=>$('[data-tf-strike=strong]').click();
     if(mode.value==='comparison')for(const kind of ['paper','water','hand']){contact(kind);contact('none');strike();contact(kind);__tuningFork.advance(100);contact('none');}
     else if(mode.value.startsWith('bars')){$('[data-tf-mode=bars]').click();if(mode.value==='bars-moving')$('#strikeBtn').click();}
     else if(mode.value!=='held'){if(mode.value.endsWith('moving')||mode.value==='hand-stop')strike();contact(mode.value.split('-')[0]);}
    }
    if(mode.kind==='rate-energy'){__rateModel.setMode('rate');for(const [i,key]of ['heat','cat','T'].entries())__rateModel.set(key,mode.value[i]);__rateModel.check();}
    if(mode.kind==='rate-equilibrium'){__rateModel.setMode('eq');__rateModel.set('Teq',mode.value[0]);__rateModel.set('V',mode.value[1]);__rateModel.check();}
    if(mode.kind==='ride'){const e=$('#motion');e.value=mode.value;e.dispatchEvent(new Event('input',{bubbles:true}));$('#measureRide').click();}
    if(mode.kind==='annulus'){$('#resetExperiment').click();$('#annulusFill').click();$('#annulusIce').click();$('#annulusHeat').click();$('#annulusTracer').click();if(mode.value==='side')$('[data-annulus-view="side"]').click();if(mode.value==='compare')$('#annulusCompare').click();$('#annulusStep').click();}
    if(mode.kind==='dock')$('#dockTest').click();
    if(mode.kind==='food-web'){
     $('#fwReset').click();const M=window.scienceFoodWeb;
     if(mode.value.startsWith('roles')){for(const c of M.cards){const e=$('[data-fw-role="'+c.id+'"]');e.value=mode.value==='roles-right'?c.role:'consumer';e.dispatchEvent(new Event('change'));}$('#fwCheckRoles').click();}
     else{$('[data-fw-mode=web]').click();const edges=mode.value==='web-wrong'?['frog>grasshopper','rice>hawk']:M.edges;for(const edge of edges)for(const id of edge.split('>'))$('[data-fw-node="'+id+'"]').click();$('#fwCheckWeb').click();if(['frog','sparrow'].includes(mode.value)){const e=$('#fwMissing');e.value=mode.value;if(e.value!==mode.value)throw Error('Missing food-web option: '+mode.value);e.dispatchEvent(new Event('change'));if(window.__foodWeb.getState().removed!==mode.value)throw Error('Food-web removal did not apply');}if(mode.value==='flow')$('#fwFlow').click();}
    }
    if(mode.kind==='crust-thickness'){
     $('[data-ct-case='+mode.value+']').click();if(mode.stage!=='initial'){if(mode.stage==='changed'){const e=$('#ctSplit');e.value=2;e.dispatchEvent(new Event('change'));}$('#ctFit').click();if(mode.stage==='correct'){$('#ctDepth').value=__crustThickness.getState().result.thickness.toFixed(1);$('#ctCheck').click();}}
    }
    if(mode.kind==='thin-sections'){
     const set=(id,value)=>{const e=$('#'+id);e.value=value;e.dispatchEvent(new Event('input'));};$('#tsReset').click();
     if(['photos','classified','zoom'].includes(mode.value)){$('[data-ts-mode=photos]').click();if(mode.value==='classified'){for(const p of scienceThinSections.photos){const e=$('[data-ts-class='+p.id+']');e.value=p.texture;e.dispatchEvent(new Event('change',{bubbles:true}));}$('#tsCheckPhotos').click();}if(mode.value==='zoom'){$('[data-ts-photo=porphyritic]').click();set('tsPhotoZoom',2);}}
     else{$('[data-ts-sample='+ (mode.value.startsWith('granite')?'granite':'basalt') +']').click();$('#tsMount').click();set('tsFocus',mode.value==='blur'?20:50);set('tsLight',mode.value==='dark'?10:70);if(mode.value.endsWith('xpl'))$('#tsAnalyzer').click();set('tsAngle',45);$('#tsObserve').click();}
    }
    if(mode.kind==='strata-correlation'){
     $('[data-sc-mode="'+mode.value+'"]').click();
     if(mode.stage==='summary')$('#scReveal').click();
     if(mode.stage==='wrong'||mode.stage==='linked'){
      const pair=mode.value==='key'?['0:0',mode.stage==='wrong'?'1:4':'1:1']:['0:5',mode.stage==='wrong'?'1:2':'1:5'];
      for(const key of pair)$('[data-sc-layer="'+key+'"]').click();
     }
    }
    if(mode.kind==='microbe-observation'){
     const click=id=>$('#'+id).click(),set=(id,value)=>{const e=$('#'+id);e.value=value;e.dispatchEvent(new Event('input'));};click('mbReset');
     if(mode.value==='mounted')click('mbPlace');else if(mode.value==='dark'){click('mbPlace');click('mbObserve');}else if(mode.value==='blur'){click('mbPlace');click('mbLamp');click('mbObserve');}else{
      const values=mode.value==='all'?[['mushroom',0],['mushroom',1],['mold',0],['algae',0],['paramecium',0]]:[[mode.value==='hyphae'?'mushroom':mode.value==='gills'?'mushroom':mode.value==='zoom'?'paramecium':mode.value,mode.value==='hyphae'?1:0]];
      for(const[sample,view]of values){$('[data-mb-sample="'+sample+'"]').click();if(view)$('[data-mb-view="'+view+'"]').click();click('mbPlace');if(!__microbeObservation.getState().lamp)click('mbLamp');set('mbFocus',6);}
      if(mode.value==='zoom'){set('mbZoom',1.8);$('#mbViewer').dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));}
     }
    }
    if(mode.kind==='rock-specimens'){
     const click=id=>$('#'+id).click(),v=mode.value;click('rsReset');$('[data-rs-mode="'+(v.startsWith('cast')||v.startsWith('fossil')?'fossils':v.startsWith('layers')?'layers':'rocks')+'"]').click();
     if(['wrong','correct','fossil-wrong','fossil-correct'].includes(v)){const kind=v.startsWith('fossil')?'fossil':'rock',rows=kind==='rock'?RockSpecimenModel.rocks:RockSpecimenModel.fossils;for(const r of rows)$('[data-rs-kind="'+kind+'"][data-rs-id="'+r.id+'"][data-rs-answer="'+(v.includes('wrong')?(kind==='rock'?(r.type==='mud'?'sand':'mud'):(r.type==='body'?'trace':'body')):r.type)+'"]').click();click(kind==='rock'?'rsRockCheck':'rsFossilCheck');}
     if(/^[A-F]/.test(v)){$('[data-rs-inspect="'+v[0]+'"]').click();if(v.endsWith('detail'))click('rsDetail');const z=$('#rsZoom');z.value='1.8';z.dispatchEvent(new Event('input'));$('#rsViewport').dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight'}));}
     if(v.startsWith('cast'))for(const action of RockSpecimenModel.steps.slice(0,+v.split('-')[1]))$('[data-rs-action="'+action+'"]').click();
     if(v==='layers-full'){click('resetBtn');for(let i=0;i<6;i++)click('pourBtn');}
    }
    if(mode.kind==='quadrat-community'){
     const click=id=>$('#'+id).click();click('qcReset');const run=()=>{click('qcDraw');click('qcMeasure');};if(mode.value==='empty'){let i=0;while(window.__quadratCommunity.getState().order[0]!==6&&i++<100)click('qcReset');if(window.__quadratCommunity.getState().order[0]!==6)throw Error('No empty quadrat seed');run();}else if(mode.value==='selected')click('qcDraw');else{for(let i=0;i<({first:1,three:3,complete:5,resample:5}[mode.value]);i++)run();if(mode.value==='resample')click('qcReset');}
    }
    if(mode.kind==='rotating-disc'){
     const value=mode.value,click=id=>document.getElementById(id).click();click('rdReset');const run=id=>{document.querySelector('[data-rd-trial="'+id+'"]').click();click('rdPrepare');for(let i=0;i<4;i++)click('rdStep');};if(value==='all'){for(const id of ['still','ccw-slow','ccw-fast','cw-slow','cw-fast'])run(id);}else if(value==='prepared')click('rdPrepare');else if(value==='ccw-moving'){document.querySelector('[data-rd-trial="ccw-fast"]').click();click('rdPrepare');click('rdStep');click('rdStep');}else run(value);
    }
    if(mode.kind==='phase-mass'){
     const click=id=>$('#'+id).click();click('pmReset');if(mode.value!=='before'){if(mode.value!=='unzeroed')click('pmZero');click('pmPrepare');click('pmMark');click('pmWeigh');}if(!['before','unzeroed','first'].includes(mode.value)){click('pmRemove');click('pmCool');}if(['wet','wet-mass','wiped','complete'].includes(mode.value)){click('pmRetrieve');click('pmMark');}if(mode.value==='wet-mass')click('pmWeigh');if(['wiped','complete'].includes(mode.value))click('pmWipe');if(mode.value==='complete')click('pmWeigh');
    }
    if(mode.kind==='liquid-heat'){
     const click=id=>$('#'+id).click(),set=(id,value)=>{const e=$('#'+id);e.value=value;e.dispatchEvent(new Event('change'));};click('lhReset');if(mode.value==='mass')set('lhMass',200);if(mode.value==='power')set('lhPower',20);if(['bottom','air'].includes(mode.value))set('lhOilProbe',mode.value);
     if(mode.value!=='before')click('lhPrepare');if(!['before','prepared'].includes(mode.value))click('lhConnect');if(mode.value==='moving')click('lhStart');if(['finished','mass','power','bottom','air'].includes(mode.value))for(let i=0;i<5;i++)click('lhMinute');
    }
    if(mode.kind==='animal-classification'){
     const click=id=>$('#'+id).click(),set=(id,value,event='change')=>{const e=$('#'+id);e.value=value;e.dispatchEvent(new Event(event));};click('acReset');const yes={wings:['butterfly','sparrow'],legs:['butterfly','sparrow','rabbit','tiger'],fins:['seabream','carp']},ids=['butterfly','sparrow','rabbit','tiger','seabream','carp','earthworm','snake'],rule=['legs','fins'].includes(mode.value)?mode.value:'wings',answer=(id,on)=>$('[data-ac-id="'+id+'"][data-ac-answer="'+(+on)+'"]').click();set('acRule',rule);
     if(mode.value==='partial'){answer('butterfly',true);click('acCheck');}else if(!['before','magnified','moved'].includes(mode.value)){for(const id of ids)answer(id,['wrong','correct'].includes(mode.value)?!yes[rule].includes(id):yes[rule].includes(id));click('acCheck');if(mode.value==='correct'){for(const id of ids)answer(id,yes[rule].includes(id));click('acCheck');}}
     if(['magnified','moved'].includes(mode.value)){$('[data-ac-inspect="sparrow"]').click();set('acZoom','2','input');if(mode.value==='moved')$('#acSpecimen').dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));}
    }
    if(mode.kind==='leaf-classification'){
     const click=id=>$('#'+id).click(),set=(id,value,event='change')=>{const e=$('#'+id);e.value=value;e.dispatchEvent(new Event(event));};click('lcReset');const yes={long:['pine','grass'],pointed:['pine','grass','cherry','maple'],lobed:['maple']},ids=['pine','grass','cherry','maple','euonymus','clover'],rule=['pointed','lobed'].includes(mode.value)?mode.value:'long',answer=(id,on)=>$('[data-lc-id="'+id+'"][data-lc-answer="'+(+on)+'"]').click();set('lcRule',rule);
     if(mode.value==='partial'){answer('pine',true);click('lcCheck');}else if(!['before','tip','edge'].includes(mode.value)){for(const id of ids)answer(id,['wrong','correct'].includes(mode.value)?!yes[rule].includes(id):yes[rule].includes(id));click('lcCheck');if(mode.value==='correct'){for(const id of ids)answer(id,yes[rule].includes(id));click('lcCheck');}}
     if(['tip','edge'].includes(mode.value)){$('[data-lc-inspect="cherry"]').click();set('lcFocus',mode.value);set('lcZoom','2','input');}
    }
    if(mode.kind==='osmosis-mass'){
     const click=id=>$('#'+id).click(),choose=i=>$('[data-om-sample="'+i+'"]').click();click('omReset');if(mode.value==='untared'){choose(0);click('omWeigh');}else if(mode.value!=='before'){click('omTare');for(let i=0;i<3;i++){choose(i);click('omWeigh');}if(mode.value!=='ready'){click('omImmerse');if(mode.value!=='immersed'){click('omRemove');choose(0);if(mode.value==='wet')click('omWeigh');else for(let i=0;i<(mode.value==='complete'?3:1);i++){choose(i);click('omBlot');click('omWeigh');}}}}
    }
    if(mode.kind==='reaction-pressure'){
     const click=id=>$('#'+id).click(),set=(id,value)=>{const e=$('#'+id);e.value=value;e.dispatchEvent(new Event('change'));};click('rpReset');if(mode.value==='range')set('rpRange','120');if(mode.value==='larger')set('rpFlask','400');
     if(mode.value!=='before'){click('rpAssemble');click('rpConnect');if(mode.value!=='assembled'){click('rpAcquire');click('rpInject');if(mode.value!=='leak')click('rpValve');for(let i=0;i<(mode.value==='moving'?2:12);i++){if(mode.value==='disconnected'&&i===3)click('rpConnect');click('rpStep');}$('[data-rp-interval="0"]').click();}}
    }
    if(mode.kind==='galileo'){
     const click=id=>$('#'+id).click(),set=(id,value)=>{const e=$('#'+id);e.value=value;e.dispatchEvent(new Event('change'));};click('giReset');if(mode.value==='hollow')set('giShape','hollow');if(mode.value==='delay')set('giDelay','0.2');if(mode.value==='same')set('giMassB','20');if(mode.value==='steep')set('giAngle','15');if(mode.value!=='before')for(let i=0;i<(mode.value==='moving'?5:20);i++)click('giStep');
    }
    if(mode.kind==='light-interference'){
     const click=id=>$('#'+id).click(),set=(id,v,evt='change')=>{const e=$('#'+id);e.value=v;e.dispatchEvent(new Event(evt));};click('liReset');if(mode.value!=='bare')click('liSlit');if(mode.value==='red')set('liColor','650');if(['one','blocked'].includes(mode.value))set('liAlignment',mode.value);if(mode.value==='wide'){set('liColor','650');set('liSeparation','0.1');set('liDistance','2');set('liSpan','40');}if(mode.value==='tight'){set('liSeparation','0.3');set('liDistance','0.5');set('liSpan','10');}click('liPower');if(mode.value==='measured')click('liMeasure');if(mode.value==='edge'){set('liA','-20','input');set('liB','20','input');}if(!window.__lightInterference.getState().power)throw Error('Light did not switch on');
    }
    if(mode.kind==='fermentation'){
     const click=id=>$('#'+id).click(),set=(id,v)=>{const e=$('#'+id);e.value=v;e.dispatchEvent(new Event('change'));};click('fmReset');if(mode.value==='air')set('fmAir','trapped');if(mode.value==='water')set('fmReagent','water');click('fmPrepare');
     if(mode.value!=='before'){for(let i=0;i<4;i++)click('fmStep');click('fmOdour');}if(!['before','observed'].includes(mode.value)){click('fmWithdraw');if(mode.value!=='withdrawn'){click('fmAdd');click('fmTilt');}}
     const expected=mode.value==='withdrawn'?'withdrawn':['before','observed'].includes(mode.value)?'prepared':'tested';if(window.__fermentation.getState().phase!==expected)throw Error('Fermentation procedure did not apply');
    }
    if(mode.kind==='plant-growth'){
     $('#pgReset').click();const set=(id,value)=>{const e=$('#'+id);e.value=value;if(e.value!==value)throw Error('Missing plant condition '+value);e.dispatchEvent(new Event('change'));};
     if(mode.value==='light'||mode.value==='larger')set('pgObjective','light');
     if(mode.value==='both')set('pgLight','no');if(mode.value==='same')set('pgWater','yes');if(mode.value==='larger')set('pgInitial','larger');
     $('#pgDesign').click();const t=$('#pgTime');t.value=mode.value==='intermediate'?'2':'7';t.dispatchEvent(new Event('input'));if(window.__plantGrowth.getState().day!==+t.value)throw Error('Plant observation date did not apply');
    }
    if(mode.kind==='dissolution'){
     const click=id=>$('#'+id).click();click('dmReset');const e=$('#dmMaterial');e.value=mode.value==='sugar'?'sugar':'salt';e.dispatchEvent(new Event('change'));click('dmZero');for(const id of ['dmBeaker','dmPaper','dmRod','dmRead'])click(id);if(mode.value!=='before'){click('dmClear');click('dmPour');if(mode.value==='stir')click('dmStir');else{for(let i=0;i<4;i++)click('dmStep');for(const id of ['dmBeaker','dmPaper','dmRod'])click(id);if(mode.value==='missing')click('dmPaper');if(mode.value==='tare')click('dmZero');click('dmRead');}}
    }
    if(mode.kind==='leaf-starch'){
     const click=id=>$('#'+id).click(),set=(id,value)=>{const e=$('#'+id);e.value=value;e.dispatchEvent(new Event('change'));};click('lsReset');if(['half','none'].includes(mode.value))set('lsCover',mode.value);if(mode.value==='retained')set('lsInitial','retained');click('lsSun');if(mode.value!=='sun'){click('lsPluck');click('lsWater');if(mode.value!=='water'){click(mode.value==='skip'?'lsSkip':'lsEthanol');if(mode.value!=='ethanol'){click('lsRinse');click('lsIodine');}}}
    }
    if(mode.kind==='plating'){
     const click=id=>$('#'+id).click(),set=(id,value)=>{const e=$('#'+id);e.value=value;e.dispatchEvent(new Event('change'));};click('plReset');if(mode.value!=='dirty')click('plClean');if(mode.value==='reverse')set('plWiring','reverse');if(mode.value==='touch')set('plGap','touch');if(mode.value==='water')set('plSolution','water');click('plConnect');click('plDip');click('plPower');for(let i=0;i<6;i++)click('plStep');if(mode.value==='finished')for(const id of ['plPower','plRemove','plWash','plDry'])click(id);
    }
    if(mode.kind==='acoustic'){
     const click=id=>$('#'+id).click(),e=$('#acMode');e.value=mode.value;e.dispatchEvent(new Event('change'));click('acPower');click('acMeasure');
     if(mode.measured)for(const value of mode.value==='tube'?[80,251,423]:[263,188,114]){const p=$('#acPosition');p.value=value;p.dispatchEvent(new Event('input'));click('acRecord');}
    }
    if(mode.kind==='solution'){
     const click=id=>$('#'+id).click(),set=(id,value)=>{const e=$('#'+id);e.value=value;e.dispatchEvent(new Event('change',{bubbles:true}));};click('soReset');
     if(mode.slug==='standard-solution'){for(const id of ['stPan','stTare','stWeigh','stDissolve','stTransfer'])click(id);for(let i=0;i<(mode.value===3?1:3);i++)click('stRinse');click('stPremix');for(let i=0;i<[4,5,6,7][mode.value];i++)click('stWater');click('stMix');}
     if(mode.slug==='serial-dilution'){set('dlKind',mode.value%2?'base':'acid');for(const n of [686,4,918]){click('dlRinse');click('dlBuffer'+n);}for(let i=0;i<(mode.value>1?9:3);i++){if(i){click('dlPipette');click('dlFill');click('dlMix');}click('dlRinse');click('dlPortion');click('dlMeasure');}}
     if(mode.slug==='vinegar-titration'){set('viProtocol',mode.value%2?'diluted':'direct');for(const id of ['viPrepare','viIndicator','viFill','viTip'])click(id);set('viInitial',2);click('viMark');for(let i=0;i<(mode.value%2?18:27);i++)click('viAdd1');for(let i=0;i<(mode.value%2?10:15);i++)click('viDrop');if(mode.value===3)click('viAdd1');if(mode.value!==2)click('viMix');}
    }
    if(mode.kind==='course'){
     const click=id=>$('#'+id).click(),set=(id,value,event='change')=>{const e=$('#'+id);e.value=value;e.dispatchEvent(new Event(event,{bubbles:true}));};click('cpReset');
     if(mode.slug==='water-electrolysis'){set('elPolarity',mode.value%2?'reverse':'normal');set('elSolution',mode.value===3?'pure':'sulfate');click('elFill');click('elPower');for(let i=0;i<9;i++)click('elStep');click('elPower');}
     if(mode.slug==='cell-micrometry'){const mag=[100,200,400,400][mode.value];set('miMag',mag);set('miFocus',10,'input');set('miAngle',0,'input');set('miOffset',0,'input');set('miOcular',40,'input');set('miStage',4000/mag,'input');click('miCalibrate');if(mode.value!==3){click('miPrepare');set('miSlide','cell');set('miLeft',50-.08*mag,'input');set('miRight',50+.08*mag,'input');}}
     if(mode.slug==='leaf-pigments'){click('pgExtract');for(let i=0;i<5;i++){click('pgSpot');click('pgDry');}if(mode.value===1)set('pgLevel',3);if(mode.value===2)set('pgCap','open');click('pgStart');}
     if(mode.slug==='digestive-enzymes'){set('diEnzyme',mode.value===1?'inactive':'active');set('diMembrane',mode.value===2?'blocked':'selective');for(const id of ['diPrepare','diIncubate','diSample','diReagent'])click(id);if(mode.value!==3)click('diHeat');}
      if(mode.slug==='spring-wave-speed'){set('wvMode',mode.value%2?'longitudinal':'transverse');set('wvFrequency',mode.value>1?2:1);set('wvTime',mode.value%2?1.2:1.8,'input');set('wvX1',.5,'input');set('wvX2',2.5,'input');set('wvPeriod',1,'input');click('wvCalculate');}
      if(mode.slug==='coastal-inundation'){set('cohome',mode.value%2?'high':'low');click('coBuild');if(mode.value>0)click('coMark');if(mode.value>1)click('coPour');}
      if(mode.slug==='sea-level-causes'){click('slPrepare');click('slMark');set('slView',mode.value%2?'zoom':'apparatus');for(let i=0;i<(mode.value>1?10:3);i++)click('slMinute');}
    }
    if(mode.kind==='circuit'){for(const k of ['wiring','target','meter','connection'])$(`[data-cm-${k}="${mode[k]}"]`).click();$('#cmSwitch').click();$('#cmRead').click();}
    if(mode.kind==='air'){$('#resetExperiment').click();const p=$('#airPollutant');p.value=mode.value;p.dispatchEvent(new Event('change'));$('[name=airInlet][value=filter]').click();$('#airZero').click();$('[name=airInlet][value=open]').click();$('#airMeasureA').click();window.__airSampling.finish();const s=$('#airSite');s.value='garden';s.dispatchEvent(new Event('change'));$('#airMeasureB').click();window.__airSampling.finish();}
    if(mode.kind==='bio'){$(`[data-bio-specimen="${mode.value}"]`).click();$(`[data-bio-view="${mode.view}"]`).click();}
    if(mode.kind==='sunspot'){$(`[data-sun-view="${mode.value}"]`).click();if(mode.value==='compare')for(const [id,x,y]of [['sunCanvasA',510,421],['sunCanvasB',881,437]]){const c=$('#'+id),b=c.getBoundingClientRect();c.dispatchEvent(new MouseEvent('click',{clientX:b.left+x/1024*b.width,clientY:b.top+y/1024*b.height,bubbles:true}));}}
    for(const k of Object.keys(window).filter(k=>k.startsWith('__')&&k.endsWith('Model')))window[k]?.runToEnd?.();
   },mode);if(route.slug==='microbes'){await page.waitForFunction(()=>document.querySelector('#mbImage').complete&&document.querySelector('#mbImage').naturalWidth>0);if(mode.kind==='microbe-observation'&&!['mounted','dark','blur'].includes(mode.value)){if(mode.value==='all'){for(const[sample,view]of [['mushroom',0],['mushroom',1],['mold',0],['algae',0],['paramecium',0]]){await page.evaluate(({sample,view})=>{document.querySelector('[data-mb-sample="'+sample+'"]').click();if(view)document.querySelector('[data-mb-view="'+view+'"]').click();document.querySelector('#mbPlace').click();const e=document.querySelector('#mbFocus');e.value=6;e.dispatchEvent(new Event('input'));},{sample,view});await page.waitForFunction(()=>document.querySelector('#mbImage').complete&&document.querySelector('#mbImage').naturalWidth>0);await page.locator('#mbObserve').click();}}else await page.locator('#mbObserve').click();}if(mode.kind==='initial')await page.locator('#mbReset').click();}await painted(page);await page.evaluate(()=>{const checkpoint=document.querySelector('.supplement-check[data-question-id]'),controller=document.querySelector('.quiz-section')?.scienceAssessment;if(!checkpoint?.getBoundingClientRect().width||!controller)return;const q=controller.store.questions.get(checkpoint.dataset.questionId);if(!q||controller.store.evidence(q.id)?.correct)return;const wrong=q.choices.find(c=>c.id!==q.answer&&!checkpoint.querySelector('[data-check-answer="'+c.id+'"]').disabled);if(wrong)checkpoint.querySelector('[data-check-answer="'+wrong.id+'"]').click();checkpoint.querySelector('[data-check-answer="'+q.answer+'"]').click();});await painted(page);const result=await page.evaluate(inspect);scenarios++;routeScenarios++;if(result.overflow||result.fonts.length||result.clipped.length||result.overlaps.length||result.canvas.length)issues.push({...route,width,mode,...result});}}
   if(liveWebFonts)for(const family of await page.evaluate(()=>[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family)))loadedFontFamilies.add(family);
   completedRoutes.push({...route,scenarios:routeScenarios});
   fs.writeFileSync(path.join(output,'progress-'+engine+'.json'),JSON.stringify({checkedAt:new Date().toISOString(),engine,catalog,complete:completedRoutes.length===routes.length,completedRoutes,scenarios,issues,errors,liveWebFonts,loadedFontFamilies:[...loadedFontFamilies]},null,2));
   console.log(engine+': '+route.slug+(route.school?' ('+route.school+')':'')+' / '+scenarios+' screen states');
  }await page.close();}));
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
 if(liveWebFonts&&!loadedFontFamilies.size)errors.push({error:'Live-font run did not load any web font'});
 const report={engine,catalog,routes:routes.length,scenarios,widths,extended,supplementDiagnosisChecked:true,deviceProfile,emulationOnly:!!deviceProfile,deviceScaleFactor:deviceOptions.deviceScaleFactor||1,liveWebFonts,loadedFontFamilies:[...loadedFontFamilies].sort(),issues,errors};fs.writeFileSync(path.join(output,(catalog?'catalog-':'')+(baseline?'baseline-':'')+(extended?'extended-':'')+engine+'.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({engine,deviceProfile,routes:routes.length,scenarios,flagged:issues.length,fontFlags:issues.reduce((n,r)=>n+r.fonts.length,0),canvasFlags:issues.reduce((n,r)=>n+r.canvas.length,0),liveWebFonts,loadedFontFamilies:[...loadedFontFamilies].sort(),errors}));if(!baseline&&(issues.length||errors.length))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
