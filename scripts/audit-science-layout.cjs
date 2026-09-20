// Read-only app audit; screenshots are diagnostic artifacts, not source rewrites.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'../learning/inquiry/science-lab'),map=require(path.join(root,'curriculum-map.js'));
const picked=process.argv.find(a=>a.startsWith('--slugs='))?.slice(8).split(',');
const slugs=picked||Object.keys(map),capture=process.argv.includes('--capture');let scenarios=0;
(async()=>{
 const server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'}[path.extname(file)]||'application/octet-stream');res.end(data);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;const failures=[];
 try{browser=await chromium.launch({headless:true,executablePath:process.env.SCIENCE_BROWSER});
 for(const slug of slugs){const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 try{await page.goto(`http://127.0.0.1:${server.address().port}/${slug}/`);await page.evaluate(()=>document.fonts.ready);
 for(const width of [1366,1024,820,768]){await page.setViewportSize({width,height:width>=1024?768:1024});
 const modes=await page.locator('button[data-mode]').evaluateAll(nodes=>nodes.map(n=>n.dataset.mode));
 for(const mode of modes.length?modes:['initial']){scenarios++;
  await page.evaluate(mode=>{document.querySelector(`button[data-mode="${mode}"]`)?.click();for(const name of Object.keys(window).filter(k=>k.startsWith('__')&&k.endsWith('Model')))window[name]?.runToEnd?.();if(window.__magnetModel&&mode==='compass'){window.__magnetModel.set('place','below');window.__magnetModel.set('dist',3);window.__magnetModel.runToEnd?.();}if(window.__soundModel){document.querySelector('[data-bar="hido"]')?.click();document.getElementById('strikeBtn')?.click();}},mode);
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  const result=await page.evaluate(()=>{
   const visible=e=>e.getClientRects().length&&getComputedStyle(e).display!=='none'&&!e.closest('[hidden]');
   const typography=[...document.querySelectorAll('h1,h2,h3,p,legend,button,small,.result-numbers strong')].filter(visible).filter(e=>e.textContent.trim()&&!e.closest('svg')).map(e=>({text:e.textContent.trim().slice(0,45),px:parseFloat(getComputedStyle(e).fontSize)})).filter(e=>e.px<13||e.px>23);
   // Font boxes include line-leading that is not painted ink. Compare glyph bounds.
   const ctx=document.createElement('canvas').getContext('2d');
   const ink=t=>{const style=getComputedStyle(t);ctx.font=style.fontWeight+' '+style.fontSize+' '+style.fontFamily;const m=ctx.measureText(t.textContent),b=t.getBBox(),base=t.getStartPositionOfChar(0).y,ctm=t.getScreenCTM();const pts=[[b.x,base-m.actualBoundingBoxAscent],[b.x+b.width,base-m.actualBoundingBoxAscent],[b.x,base+m.actualBoundingBoxDescent],[b.x+b.width,base+m.actualBoundingBoxDescent]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(ctm));return{left:Math.min(...pts.map(p=>p.x)),right:Math.max(...pts.map(p=>p.x)),top:Math.min(...pts.map(p=>p.y)),bottom:Math.max(...pts.map(p=>p.y))};};
   const outside=[],overlaps=[];document.querySelectorAll('svg.main-svg,svg.graph-svg,svg.scope-svg').forEach(svg=>{if(!visible(svg))return;const box=svg.getBoundingClientRect();svg.querySelectorAll('text').forEach(t=>{if(!visible(t)||!t.textContent.trim())return;const b=t.getBoundingClientRect();if(b.left<box.left-3||b.right>box.right+3||b.top<box.top-3||b.bottom>box.bottom+3)outside.push(t.textContent.trim().slice(0,85));});const texts=[...svg.querySelectorAll('text')].filter(t=>visible(t)&&t.textContent.trim()&&Number(getComputedStyle(t).opacity)>.05);for(let i=0;i<texts.length;i++)for(let j=i+1;j<texts.length;j++){const a=ink(texts[i]),b=ink(texts[j]),w=Math.min(a.right,b.right)-Math.max(a.left,b.left),h=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);if(w>3&&h>3)overlaps.push([texts[i].textContent.trim().slice(0,45),texts[j].textContent.trim().slice(0,45)]);}});
   for(const pane of document.querySelectorAll('.figure-viewport'))if(visible(pane)&&pane.scrollWidth>pane.clientWidth+2)outside.push('도식 내부 가로 넘침: '+pane.scrollWidth+'/'+pane.clientWidth);
   return{overflow:document.documentElement.scrollWidth>innerWidth+1,typography,outside,overlaps};
  });
  if(result.overflow||result.typography.length||result.outside.length||result.overlaps.length)failures.push({slug,width,mode,...result});
  if(capture&&picked){
   const dir=path.resolve(root,'../../../docs/science-lab-audit-2026-09-20/visual-refresh');fs.mkdirSync(dir,{recursive:true});await page.locator('svg.main-svg,svg.graph-svg,svg.scope-svg').first().locator('xpath=ancestor::section[1]').screenshot({path:path.join(dir,slug+'-'+mode+'-'+width+'.png')});if(slug==='sound-vibration')await page.locator('.result-box').screenshot({path:path.join(dir,slug+'-result-'+width+'.png')});
  }
 }
 }
 if(errors.length)failures.push({slug,errors});
 }finally{await page.close();}}
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
 console.log(JSON.stringify({apps:slugs.length,scenarios,viewports:[1366,1024,820,768],failures:failures.filter(f=>f.overflow||f.typography?.length||f.outside?.length||f.errors),overlapReview:failures.filter(f=>f.overlaps?.length).map(f=>({slug:f.slug,width:f.width,mode:f.mode,pairs:f.overlaps}))},null,2));
 if(process.argv.includes('--check')&&failures.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
