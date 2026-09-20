const {edit,replace,apply}=require('./science-scope-patch.cjs');
edit('tests/science-prediction-lifecycle.test.cjs',s=>{
 s=replace(s,'const result=await page.evaluate(()=>{','const result=await page.evaluate(async(probeLift)=>{');
 s=replace(s,'  return{issues,p,q,r};',`  if(probeLift){
   const readout=document.getElementById('stageReadout'),note=document.getElementById('stageNote'),verdict=document.getElementById('stageVerdict');
   for(const e of [readout,note,verdict])if(e)e.textContent='obsolete-condition-sentinel';
   for(const id of ['mainGroup','graphGroup'])document.getElementById(id)?.replaceChildren(document.createElementNS('http://www.w3.org/2000/svg','g'));
   await Promise.resolve();await Promise.resolve();
   for(const e of [readout,note,verdict])if(e?.textContent.includes('obsolete-condition-sentinel'))issues.push('lifted SVG prose survives a new empty drawing');
  }
  return{issues,p,q,r};`);
 s=replace(s,' });predictions+=result.p;'," },fs.readFileSync(path.join(root,slug,'app.js'),'utf8').includes('function liftProse()'));predictions+=result.p;");
 return s;
});
apply();
