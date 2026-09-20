const {edit,replace,apply}=require('./science-scope-patch.cjs');
edit('scripts/science-full-inspection.cjs',s=>{
 s=replace(s,"cases:0,errors:[],issues:[],models:[]","cases:0,errors:[],issues:[],models:[],paint:[],grades:[]");
 s=replace(s,"const cases=await page.evaluate",`const paint=await page.evaluate(()=>{
   const rules=[];function collect(list){for(const r of list){if(r.cssRules)collect(r.cssRules);if(r.selectorText&&r.style&&(r.style.fill||r.style.stroke))rules.push(r.selectorText);}}
   for(const sheet of document.styleSheets){try{collect(sheet.cssRules);}catch{}}
   const result=[];for(const e of document.querySelectorAll('svg path,svg rect,svg circle,svg ellipse,svg line,svg polyline,svg polygon')){
    if(e.closest('defs')||e.closest('[hidden]')||!e.getClientRects().length)continue;
    const c=getComputedStyle(e);if(c.display==='none'||Number(c.opacity)===0)continue;
    const explicit=node=>node.hasAttribute('fill')||node.hasAttribute('stroke')||node.style.fill||node.style.stroke||rules.some(r=>{try{return node.matches(r);}catch{return false;}});
    let styled=false;for(let node=e;node instanceof SVGElement;node=node.parentElement){if(explicit(node)){styled=true;break;}}
    if(!styled)result.push({tag:e.tagName,cls:e.getAttribute('class'),fill:c.fill,stroke:c.stroke,html:e.outerHTML.slice(0,170)});
   }return [...new Map(result.map(r=>[r.tag+' '+r.cls,r])).values()];
  });if(paint.length)report.paint.push({mode,items:paint});
  const grade=await page.evaluate(()=>{
   const visible=e=>!!e?.getClientRects().length&&!e.closest('[hidden]'),models=Object.keys(window).filter(k=>k.startsWith('__')&&k.endsWith('Model')).map(k=>window[k]);
   const choices=[...document.querySelectorAll('[data-prediction]')].filter(visible).map(b=>b.dataset.prediction),results=[];
   for(const choice of choices){document.querySelector('[data-prediction="'+choice+'"]')?.click();let driven=false;for(const m of models){if(typeof m.runToEnd==='function'){m.runToEnd(.25);driven=true;}else if(typeof m.check==='function'){m.check();driven=true;}}
    if(!driven)document.querySelector('.control-panel .run-button')?.click();
    const f=document.getElementById('predictionResult');results.push({choice,visible:visible(f),text:f?.textContent||'',correct:f?.dataset.correct});
   }return results;
  });report.grades.push({mode,results:grade});
  const cases=await page.evaluate`);
 return s;
});apply();
