// Screen-pixel typography, including transformed SVG and canvas text.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'../learning/inquiry/science-lab'),map=require(path.join(root,'curriculum-map.js'));
const engine=process.argv.includes('--webkit')?'webkit':'chromium',baseline=process.argv.includes('--baseline');
const selected=process.argv.find(a=>a.startsWith('--slugs='))?.slice(8).split(',');
const widths=process.argv.includes('--quick')?[1366]:[1366,1180,1024,820,768];
const extended=process.argv.includes('--extended');
const output=path.resolve(process.env.SCIENCE_TEST_ARTIFACTS||'docs/science-lab-audit-2026-10-12/readability');fs.mkdirSync(output,{recursive:true});
function inspect(){
 const visible=e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden'&&!e.closest('[hidden],defs,clipPath,mask')&&e.getBoundingClientRect().width>0;
 const fonts=[],clipped=[],overlaps=[],canvas=[];
 const pictogram=s=>/^[\p{Extended_Pictographic}\uFE0F\u200D\s←→↑↓↔↕·•①②③④⑤⑥]+$/u.test(s);
 const add=(kind,e,px,text)=>{if(px<13.8||px>(kind==='svg'?20:24))fonts.push({kind,text:text.trim().slice(0,85),px:+px.toFixed(2),element:e.tagName,css:typeof e.className==='string'?e.className:e.className?.baseVal});};
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
 for(const c of document.querySelectorAll('canvas')){if(!visible(c))continue;const b=c.getBoundingClientRect(),scale=getComputedStyle(c).objectFit==='contain'?Math.min(b.width/c.width,b.height/c.height):b.height/c.height;for(const row of c.__textAudit?.values()||[]){const px=row.px*scale;if(px<13.8||px>20)canvas.push({id:c.id,text:row.text,px:+px.toFixed(2)});}}
 return{overflow:document.documentElement.scrollWidth>innerWidth+1,fonts,clipped,overlaps,canvas};
}
(async()=>{const server=http.createServer((req,res)=>{let p=path.resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!p.startsWith(root+path.sep))return res.writeHead(403).end();if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,'index.html');fs.readFile(p,(e,b)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp'}[path.extname(p)]||'application/octet-stream');res.end(b);});});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser,cursor=0,scenarios=0;const issues=[],errors=[],routes=Object.entries(map).filter(([s])=>!selected||selected.includes(s)).flatMap(([slug,r])=>r.courseContexts?Object.keys(r.courseContexts).map(school=>({slug,school})):[{slug}]);
 try{browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});await Promise.all(Array.from({length:3},async()=>{const page=await browser.newPage({hasTouch:true});let current;
  page.on('pageerror',e=>errors.push({route:current,error:e.message}));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  await page.addInitScript(()=>{const p=CanvasRenderingContext2D.prototype,fill=p.fillText,clear=p.clearRect,draw=p.drawImage;p.fillText=function(t,x,y,...rest){const m=this.getTransform(),c=this.canvas;c.__textAudit??=new Map();c.__textAudit.set(t+'|'+x+'|'+y,{text:String(t),px:parseFloat(this.font.match(/([\d.]+)px/)?.[1]||0)*Math.hypot(m.c,m.d)});return fill.call(this,t,x,y,...rest);};p.clearRect=function(...a){this.canvas.__textAudit?.clear();return clear.apply(this,a);};p.drawImage=function(...a){if(a.length===3&&a[1]===0&&a[2]===0&&a[0].width>=this.canvas.width&&a[0].height>=this.canvas.height||a.length===9&&a[5]===0&&a[6]===0&&a[7]===this.canvas.width&&a[8]===this.canvas.height)this.canvas.__textAudit?.clear();return draw.apply(this,a);};});
  while(cursor<routes.length){const route=routes[cursor++];current=route;await page.goto(`http://127.0.0.1:${server.address().port}/${route.slug}/${route.school?'?school='+route.school:''}`);await page.waitForSelector('[data-assessment-ready]',{state:'attached'});await page.evaluate(()=>{document.querySelector('.quiz-section')?.setAttribute('open','');});await page.evaluate(()=>document.fonts.ready);
   const modes=await page.locator('button[data-mode]').evaluateAll(es=>es.map(e=>({kind:'mode',value:e.dataset.mode})));
   if(!modes.length)modes.push({kind:'initial'});
   if(extended){modes.push(...await page.evaluate(()=>[
    ...[...document.querySelectorAll('[data-experiment]')].flatMap(e=>[false,true].map(last=>({kind:'required',value:e.dataset.experiment,last}))),
    ...[...document.querySelectorAll('[data-supplement-choice]')].map(e=>({kind:'supplement',key:e.dataset.supplementChoice,value:e.dataset.value})),
    ...[...document.querySelectorAll('#motion option')].map(e=>({kind:'ride',value:e.value})),
    ...(document.querySelector('#annulusCanvas')?[{kind:'annulus',value:'top'},{kind:'annulus',value:'compare'},{kind:'annulus',value:'side'}]:[]),
    ...(document.querySelector('#sunCanvasA')?[{kind:'sunspot',value:'compare'},{kind:'sunspot',value:'sequence'},{kind:'sunspot',value:'overlay'}]:[]),
    ...(document.querySelector('#dockCanvas')?[{kind:'dock',value:'test'}]:[])
   ]));if(route.slug==='protein-interaction')await page.waitForFunction(()=>window.__docking?.getState().ready);if(route.slug==='sunspot-observation')await page.waitForFunction(()=>window.__sunspot?.getState().ready);}
   for(const width of widths){await page.setViewportSize({width,height:({1366:768,1180:820,1024:768,820:1180,768:1024})[width]});for(const mode of modes){await page.evaluate(mode=>{
    const $=s=>document.querySelector(s);if(mode.kind==='mode')$(`button[data-mode="${mode.value}"]`)?.click();
    if(mode.kind==='required'){$(`[data-experiment="${mode.value}"]`).click();$('.required-experiments [data-reset]').click();if(mode.last)for(const key of [...document.querySelectorAll('[data-required-field]')].map(e=>e.dataset.requiredField)){const e=$(`[data-required-field="${key}"]`);e.selectedIndex=e.options.length-1;e.dispatchEvent(new Event('change',{bubbles:true}));}}
    if(mode.kind==='supplement')$(`[data-supplement-choice="${mode.key}"][data-value="${mode.value}"]`)?.click();
    if(mode.kind==='ride'){const e=$('#motion');e.value=mode.value;e.dispatchEvent(new Event('input',{bubbles:true}));$('#measureRide').click();}
    if(mode.kind==='annulus'){$('#resetExperiment').click();$('#annulusFill').click();$('#annulusIce').click();$('#annulusHeat').click();$('#annulusTracer').click();if(mode.value==='side')$('[data-annulus-view="side"]').click();if(mode.value==='compare')$('#annulusCompare').click();$('#annulusStep').click();}
    if(mode.kind==='dock')$('#dockTest').click();
    if(mode.kind==='sunspot'){$(`[data-sun-view="${mode.value}"]`).click();if(mode.value==='compare')for(const [id,x,y]of [['sunCanvasA',510,421],['sunCanvasB',881,437]]){const c=$('#'+id),b=c.getBoundingClientRect();c.dispatchEvent(new MouseEvent('click',{clientX:b.left+x/1024*b.width,clientY:b.top+y/1024*b.height,bubbles:true}));}}
    for(const k of Object.keys(window).filter(k=>k.startsWith('__')&&k.endsWith('Model')))window[k]?.runToEnd?.();
   },mode);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(r)))));const result=await page.evaluate(inspect);scenarios++;if(result.overflow||result.fonts.length||result.clipped.length||result.overlaps.length||result.canvas.length)issues.push({...route,width,mode,...result});}}
  }await page.close();}));
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
 const report={engine,routes:routes.length,scenarios,widths,extended,issues,errors};fs.writeFileSync(path.join(output,(baseline?'baseline-':'')+(extended?'extended-':'')+engine+'.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({engine,routes:routes.length,scenarios,flagged:issues.length,fontFlags:issues.reduce((n,r)=>n+r.fonts.length,0),canvasFlags:issues.reduce((n,r)=>n+r.canvas.length,0),errors}));if(!baseline&&(issues.length||errors.length))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
