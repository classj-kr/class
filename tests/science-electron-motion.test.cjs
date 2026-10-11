const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'../learning/inquiry/science-lab');
const capture=require('./science-screenshot.cjs');
for(const engine of ['chromium','webkit'])test(engine+': electrons rotate slowly without changing shells, transfer, labels or motion preferences',{timeout:90000},async()=>{
 const server=http.createServer((req,res)=>{let p=path.resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!p.startsWith(root+path.sep))return res.writeHead(403).end();if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,'index.html');fs.readFile(p,(e,b)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css'}[path.extname(p)]||'application/octet-stream');res.end(b);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'no-preference'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  const url='http://127.0.0.1:'+server.address().port+'/periodic-bonding/';
  await page.goto(url);await page.waitForFunction(()=>!!window.__bondingModel);
  const sample=()=>page.evaluate(()=>[...document.querySelectorAll('[data-orbit-shell]')].map(g=>{
   const m=g.transform.baseVal.consolidate().matrix;
   return{shell:+g.dataset.orbitShell,angle:Math.atan2(m.b,m.a)*180/Math.PI,points:[...g.querySelectorAll('circle')].map(c=>({x:m.a*c.cx.baseVal.value+m.c*c.cy.baseVal.value+m.e,y:m.b*c.cx.baseVal.value+m.d*c.cy.baseVal.value+m.f}))};
  }));
  const assertMoved=async()=>{const a=await sample();await page.waitForTimeout(650);const b=await sample();assert(a.length>0);assert(b[0].angle-a[0].angle>1&&b[0].angle-a[0].angle<20,'gentle movement is visible before pressing run');
   for(const shell of b)for(const p of shell.points)assert(Math.abs(Math.hypot(p.x-110,p.y-118)-[20,36,52,68][shell.shell])<.1,'rotation must not change shell radius');
  };
  const assertStill=async()=>{const a=await sample();await page.waitForTimeout(250);assert.deepEqual(await sample(),a);};
  assert.deepEqual((await sample()).map(s=>s.points.length),[2,8,1]);
  await page.evaluate(()=>window.originalElectron=document.querySelector('[data-orbit-shell] circle'));
  const label=await page.locator('#stageReadout').textContent();await assertMoved();
  assert.equal(await page.evaluate(()=>window.originalElectron===document.querySelector('[data-orbit-shell] circle')),true,'idle animation keeps DOM and prose intact');
  assert.equal(await page.locator('#stageReadout').textContent(),label);
  await page.locator('#orbitToggle').click();assert.equal(await page.locator('#orbitToggle').getAttribute('aria-pressed'),'true');await assertStill();
  await page.locator('#orbitToggle').click();await assertMoved();
  await page.locator('#checkBtn').click();await page.waitForFunction(()=>__bondingModel.state.progress>.55);await assertStill();
  await page.waitForFunction(()=>__bondingModel.state.progress===1,{},{timeout:12000});
  assert.deepEqual((await sample()).map(s=>s.points.length),[2,8,0]);await assertMoved();
  assert.equal(await page.locator('#valueB').textContent(),'Na⁺');
  // Every element keeps the correct bound electron count before and after ion formation.
  const elementErrors=await page.evaluate(()=>{const m=__bondingModel,issues=[];for(const e of m.ELEMENTS){m.set('period',String(e.period));m.set('group',String(e.group));
   if(document.querySelectorAll('[data-orbit-shell] circle').length!==e.z)issues.push(e.sym+' neutral');m.runToEnd();
   if(document.querySelectorAll('[data-orbit-shell] circle').length!==e.z-(e.ion?.q||0))issues.push(e.sym+' ion');
  }return issues;});assert.deepEqual(elementErrors,[]);
  await page.evaluate(()=>__bondingModel.setMode('bonds'));assert.equal(await page.locator('#orbitToggle').isVisible(),false);assert.equal((await sample()).length,0);
  await page.evaluate(()=>{for(const key of Object.keys(__bondingModel.PAIRS)){__bondingModel.set('pair',key);__bondingModel.runToEnd();}});
  await page.locator('#resetBtn').click();assert.deepEqual((await sample()).map(s=>s.points.length),[2,8,1]);await assertMoved();
  await page.emulateMedia({reducedMotion:'reduce'});await assertStill();assert.equal(await page.locator('#orbitToggle').getAttribute('aria-pressed'),'true');
  await page.reload();await page.waitForFunction(()=>!!window.__bondingModel);await assertStill();
  await page.locator('#orbitToggle').click();await assertMoved();
  const out=path.resolve('docs/science-lab-audit-2026-10-11/electron-motion');fs.mkdirSync(out,{recursive:true});
  for(const width of [390,1100]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);await capture(page.locator('.burn-stage'),path.join(out,'atom-'+engine+'-'+width+'.webp'));}
  assert.deepEqual(errors,[]);
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
});
