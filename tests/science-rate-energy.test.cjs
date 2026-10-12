const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),http=require('node:http');
for(const engine of ['chromium','webkit'])test(engine+': reaction energy, equilibrium mass balance, conserved particle diagrams and temperature feedback',{timeout:90000},async()=>{
 const root=path.resolve(__dirname,'../learning/inquiry/science-lab');const server=http.createServer((req,res)=>{let f=path.resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!f.startsWith(root+path.sep))return res.writeHead(403).end();if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');fs.readFile(f,(e,b)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',f.endsWith('.html')?'text/html; charset=utf-8':f.endsWith('.js')?'text/javascript':'text/css');res.end(b);});});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});const page=await browser.newPage({viewport:{width:768,height:1024}});await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());await page.goto('http://127.0.0.1:'+server.address().port+'/rate-equilibrium/');await page.waitForFunction(()=>!!window.__rateModel);
  const rows=await page.evaluate(()=>{const M=__rateModel,result=[];for(const heat of ['exo','endo'])for(let T=0;T<=100;T+=5)for(const cat of ['off','on'])result.push(M.analyseRate(T,cat,heat));return result;});assert.equal(rows.length,84);
  for(const r of rows){assert(r.peak>0);const reverse=r.peak-r.product;assert(reverse>0,JSON.stringify(r));assert(Math.abs(r.peak-reverse-r.dh)<1e-10);assert(Number.isFinite(r.rel)&&r.rel>0);const other=rows.find(x=>x.T===r.T&&x.heat===r.heat&&x.cat!==r.cat);assert.equal(other.product,r.product);assert.equal(other.dh,r.dh);if(r.cat==='on'){assert(r.peak<other.peak);assert(r.rel>other.rel);}if(r.T<100)assert(rows.find(x=>x.T===r.T+5&&x.heat===r.heat&&x.cat===r.cat).rel>r.rel);}
  await page.evaluate(()=>{__rateModel.set('heat','endo');__rateModel.set('cat','on');});assert.match(await page.locator('[data-value=endo]').textContent(),/\+20/);const curve=await page.locator('.main-svg .profile.cat').getAttribute('d');assert(curve);const main=await page.locator('.main-svg').innerHTML();assert.match(main,/ΔH \+20/);assert.match(main,/Ea 30/);
  await page.evaluate(()=>document.fonts.ready);
  const inspectClip=require('./science-svg-clipping.cjs');
  // Reproduce the defect: the unit still fits the outer SVG, but crosses the
  // narrower stage clip. The new audit must fail that old placement.
  await page.locator('.dh-text').evaluate(e=>{e.setAttribute('x','362');e.removeAttribute('text-anchor');});
  assert((await page.evaluate(inspectClip)).some(r=>/kJ\/mol/.test(r.text)),'Clipping inspection must detect the original truncated unit');
  await page.evaluate(()=>__rateModel.set('cat','on'));
  assert.deepEqual(await page.evaluate(inspectClip),[],'Energy labels must fit inside the plot clip, not just the outer SVG');
  const out=path.resolve('docs/science-lab-audit-2026-10-12/course-practices/browser');await require('./science-screenshot.cjs')(page.locator('.experiment-layout'),path.join(out,engine+'-rate-energy-endothermic-768.webp'));
  const eq=await page.evaluate(()=>{const m=__rateModel,result=[];for(let T=0;T<=100;T+=5)for(let v=5;v<=20;v++)result.push(m.analyseEq(T,v/10));return{result,reference:m.K_REF,k350:m.Kof(76.85)};});
  assert.equal(eq.result.length,336);assert(Math.abs(eq.reference-167.01)<.01,'298.15 K concentration constant must agree with the JANAF formation free energies and 1 bar conversion');
  const k350=Math.exp(-4361/(8.314462618*350))*.08314462618*350;
  assert(Math.abs(eq.k350/k350-1)<.02,'Constant-enthalpy approximation checked against independent 350 K JANAF table values');
  for(const r of eq.result){assert(r.no2>0&&r.n2o4>0);assert(Math.abs((r.no2+2*r.n2o4)*r.V-.2)<1e-10);assert(Math.abs(r.n2o4/(r.no2*r.no2)/r.K-1)<1e-9);assert(r.fracN2O4>0&&r.fracN2O4<1);}
  const initial=eq.result.find(r=>r.T===25&&r.V===1),compressed=eq.result.find(r=>r.T===25&&r.V===.5);
  assert.equal(initial.K,compressed.K);assert(compressed.fracN2O4>initial.fracN2O4);assert(compressed.no2>initial.no2&&compressed.no2<2*initial.no2,'Final brown is lighter than immediately compressed, but darker than the original equilibrium');
  const pictures=await page.evaluate(()=>{const m=__rateModel,rows=[];m.setMode('eq');for(const [T,V]of [[0,.5],[0,2],[25,.5],[25,1],[100,.5],[100,1],[100,2]]){m.set('Teq',T);m.set('V',V);rows.push({T,V,dots:document.querySelectorAll('.mol-no2,.mol-n2o4').length,paired:document.querySelectorAll('.mol-n2o4').length});}return rows;});
  for(const p of pictures){assert.equal(p.dots,24);assert.equal(p.paired%2,0);}
  await page.evaluate(()=>{__rateModel.set('Teq',25);__rateModel.set('V',.5);});
  await require('./science-screenshot.cjs')(page.locator('.experiment-layout'),path.join(out,engine+'-rate-equilibrium-compressed-768.webp'));
  const wording=await page.evaluate(()=>{const m=__rateModel,result={};m.setMode('rate');m.set('cat','off');for(const t of [0,25,95,100]){m.set('T',t);m.check();result[t]=document.querySelector('#elementaryExplanation').textContent;}return result;});
  assert.doesNotMatch(wording[0],/기준보다 0\.[\d]+배 느/);assert.match(wording[25],/기준과 같은 속도/);assert.match(wording[95],/온도만 5 ℃/);assert.doesNotMatch(wording[100],/온도만 10 ℃/);
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
});
