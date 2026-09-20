// Every app and mode, every categorical control, range boundaries/midpoints.
// This does not claim an exhaustive Cartesian product or independently prove every science fact.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'../learning/inquiry/science-lab'),slugs=Object.keys(require(path.join(root,'curriculum-map.js')));
const output=path.resolve(__dirname,'../docs/science-lab-audit-2026-09-20',process.argv.find(a=>a.startsWith('--output='))?.slice(9)||'full-inspection');fs.mkdirSync(output,{recursive:true});
const picked=process.argv.find(a=>a.startsWith('--slugs='))?.slice(8).split(',')||slugs;
const engine=process.argv.includes('--webkit')?'webkit':'chromium';
(async()=>{let browser;const reports=[];const server=http.createServer((req,res)=>{let f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!f.startsWith(root+path.sep)){res.writeHead(403).end();return;}if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');fs.readFile(f,(e,b)=>{if(e){res.writeHead(404).end();return;}res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'}[path.extname(f)]||'application/octet-stream');res.end(b);});});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 try{browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER||'C:/Program Files/Google/Chrome/Application/chrome.exe'}:{})});let cursor=0;
 await Promise.all(Array.from({length:3},async()=>{const page=await browser.newPage({viewport:{width:1024,height:768},hasTouch:true});await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());let active;page.on('pageerror',e=>active?.errors.push(e.message));
 while(cursor<picked.length){const slug=picked[cursor++],report={slug,engine,modes:[],cases:0,errors:[],issues:[],models:[],paint:[],grades:[]};active=report;reports.push(report);
 try{await page.goto('http://127.0.0.1:'+server.address().port+'/'+slug+'/');await page.evaluate(()=>document.fonts.ready);report.models=await page.evaluate(()=>Object.keys(window).filter(k=>k.startsWith('__')&&k.endsWith('Model')).map(k=>({key:k,methods:Object.keys(window[k])})));
 const modes=await page.locator('button[data-mode]').evaluateAll(es=>es.map(e=>e.dataset.mode));
 for(const mode of modes.length?modes:['initial']){
  await page.evaluate(m=>document.querySelector(`button[data-mode="${m}"]`)?.click(),mode);report.modes.push(mode);
  const stage=page.locator('.experiment-layout').first();if(await stage.count())await stage.screenshot({path:path.join(output,slug+'-'+mode+'-'+engine+'.png')});
  const readPaint=async()=>page.evaluate(()=>{
   const rules=[];function collect(list){for(const r of list){if(r.cssRules)collect(r.cssRules);if(r.selectorText&&r.style&&(r.style.fill||r.style.stroke))rules.push(r.selectorText);}}
   for(const sheet of document.styleSheets){try{collect(sheet.cssRules);}catch{}}
   const result=[];for(const e of document.querySelectorAll('svg path,svg rect,svg circle,svg ellipse,svg line,svg polyline,svg polygon')){
    if(e.closest('defs,clipPath')||e.closest('[hidden]')||!e.getClientRects().length)continue;
    const c=getComputedStyle(e);if(c.display==='none'||Number(c.opacity)===0)continue;
    const explicit=node=>node.hasAttribute('fill')||node.hasAttribute('stroke')||node.style.fill||node.style.stroke||rules.some(r=>{try{return node.matches(r);}catch{return false;}});
    let styled=false;for(let node=e;node instanceof SVGElement;node=node.parentElement){if(explicit(node)){styled=true;break;}}
    if(!styled)result.push({tag:e.tagName,cls:e.getAttribute('class'),fill:c.fill,stroke:c.stroke,html:e.outerHTML.slice(0,170)});
   }return [...new Map(result.map(r=>[r.tag+' '+r.cls,r])).values()];
  });const paint=await readPaint();if(paint.length)report.paint.push({mode,items:paint});
  const grade=await page.evaluate(()=>{
   const visible=e=>!!e?.getClientRects().length&&!e.closest('[hidden]'),models=Object.keys(window).filter(k=>k.startsWith('__')&&k.endsWith('Model')).map(k=>window[k]);
   const choices=[...document.querySelectorAll('[data-prediction]')].filter(visible).map(b=>b.dataset.prediction),results=[];
   for(const choice of choices){document.querySelector('[data-prediction="'+choice+'"]')?.click();let driven=false;for(const m of models){if(typeof m.runToEnd==='function'){m.runToEnd(.25);driven=true;}else if(typeof m.check==='function'){m.check();driven=true;}}
    if(!driven)document.querySelector('.control-panel .run-button')?.click();
    const f=document.getElementById('predictionResult');results.push({choice,visible:visible(f),text:f?.textContent||'',correct:f?.dataset.correct});
   }return results;
  });report.grades.push({mode,results:grade});
  const cases=await page.evaluate(()=>{const visible=e=>!!e.getClientRects().length&&!e.closest('[hidden]');const out=[{kind:'initial'}];
   for(const b of [...document.querySelectorAll('.control-panel button')].filter(visible)){if(b.matches('[data-prediction],[data-mode],.run-button,.reset-button,.answer-button')||!Object.keys(b.dataset).length)continue;out.push({kind:'button',attrs:[...b.attributes].filter(a=>a.name.startsWith('data-')).map(a=>[a.name,a.value]),group:b.closest('[data-pick]')?.dataset.pick});}
   for(const r of [...document.querySelectorAll('.control-panel input[type=range]')].filter(visible)){const min=Number(r.min||0),max=Number(r.max||100),step=Number(r.step)||1;for(const value of [...new Set([min,min+Math.round((max-min)/2/step)*step,max])])out.push({kind:'range',id:r.id,value});}
   for(const select of [...document.querySelectorAll('.control-panel select')].filter(visible))for(const option of select.options)out.push({kind:'select',id:select.id,value:option.value});
   return out;
  });
  for(const c of cases){report.cases++;const state=await page.evaluate(c=>{
   const visible=e=>!!e?.getClientRects().length&&!e.closest('[hidden]');
   if(c.kind==='button'){const b=[...document.querySelectorAll('.control-panel button')].find(b=>visible(b)&&c.attrs.every(([a,v])=>b.getAttribute(a)===v)&&b.closest('[data-pick]')?.dataset.pick===c.group);b?.click();}
   else if(c.id){const e=document.getElementById(c.id);if(e){e.value=String(c.value);e.dispatchEvent(new Event(c.kind==='select'?'change':'input',{bubbles:true}));}}
   const models=Object.keys(window).filter(k=>k.startsWith('__')&&k.endsWith('Model')).map(k=>window[k]);
   for(const m of models){if(typeof m.runToEnd==='function')m.runToEnd(.25);else if(typeof m.check==='function')m.check();}
   const invalid=[...document.querySelectorAll('svg [d],svg [x],svg [y],svg [cx],svg [cy],svg [width],svg [height],svg [transform]')].filter(e=>visible(e)&&[...e.attributes].some(a=>/\bNaN\b|\bInfinity\b|undefined/.test(a.value))).map(e=>e.outerHTML.slice(0,160));
   const issues=[];if(invalid.length)issues.push({kind:'invalid-geometry',values:invalid.slice(0,8)});
   if(/\bNaN\b|\bundefined\b/.test(document.body.innerText))issues.push({kind:'invalid-readout'});
   const choices=[...document.querySelectorAll('[data-prediction]')].filter(visible).map(e=>({key:e.dataset.prediction,text:e.textContent.trim()}));
   const values=[];for(const m of models){if(typeof m.analyse==='function'){try{const a=m.analyse();if(a&&typeof a==='object'){const flat=Object.fromEntries(Object.entries(a).filter(([k,v])=>v===null||['string','number','boolean'].includes(typeof v)));values.push(flat);if(flat.verdict&&choices.length&&!choices.some(x=>x.key===flat.verdict))issues.push({kind:'unanswerable-prediction',verdict:flat.verdict,choices});}}catch(e){issues.push({kind:'analysis-error',message:e.message});}}}
   return{issues,choices,values};
  },c);if(state.issues.length)report.issues.push({mode,condition:c,...state});
  const dynamicPaint=await readPaint();if(dynamicPaint.length)report.paint.push({mode,condition:c,items:dynamicPaint});
  }
  if(await stage.count())await stage.screenshot({path:path.join(output,slug+'-'+mode+'-end-'+engine+'.png')});
 }
 }catch(e){report.errors.push(e.message);}console.log(slug+': '+report.modes.length+' modes / '+report.cases+' cases / '+report.issues.length+' findings');fs.writeFileSync(path.join(output,slug+'-'+engine+'.json'),JSON.stringify(report,null,2));
 }
 await page.close();}));
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
 const summary={engine,apps:reports.length,modes:reports.reduce((s,r)=>s+r.modes.length,0),cases:reports.reduce((s,r)=>s+r.cases,0),reports};fs.writeFileSync(path.join(output,'summary-'+engine+'.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify({engine,apps:summary.apps,modes:summary.modes,cases:summary.cases,flagged:reports.filter(r=>r.issues.length||r.errors.length).map(r=>({slug:r.slug,issues:r.issues.length,errors:r.errors}))}));
})().catch(e=>{console.error(e);process.exitCode=1;});
