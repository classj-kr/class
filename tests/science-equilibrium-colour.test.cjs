const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const M=require('../learning/inquiry/science-lab/equilibrium-colour/model.js');
test('equilibrium procedures require preparation, preserve independent samples and permit reversible thermal observations',()=>{
 const s=M.initial();assert.equal(M.request(s,'add'),false);assert.equal(M.request(s,'bath','hot'),false);assert.equal(M.request(s,'chloride'),false);
 for(const reagent of ['acid','base'])for(let i=0;i<4;i++){
  const state=M.initial();M.request(state,'prepare');M.request(state,'select',i);M.request(state,'reagent',reagent);assert(M.request(state,'add'));
  assert.equal(M.request(state,'select',(i+1)%4),false,'Cannot change the target of an in-progress addition');assert.equal(state.tubes.filter(Boolean).length,0,'No observation before completion');
  M.finish(state);assert.deepEqual(state.tubes[i],{reagent,colour:reagent==='acid'?'orange':'yellow'});assert.equal(state.tubes.filter(Boolean).length,1);assert.equal(M.request(state,'add'),false,'Fresh aliquot needed for a new comparison');
 }
 assert(M.request(s,'fill'));assert.equal(s.cobalt,'pink');assert(M.request(s,'chloride'));assert(!s.seen.prepared);M.finish(s);assert.equal(s.cobalt,'purple');
 for(const bath of ['hot','cold','hot','cold']){assert(M.request(s,'bath',bath));assert(!M.request(s,'bath',bath));M.finish(s);assert.equal(s.cobalt,bath==='hot'?'blue':'pink');assert(!M.request(s,'bath',bath));}
  assert.deepEqual(s.seen,{prepared:'purple',hot:'blue',cold:'pink'});
 assert.equal(M.request(s,'equilibrate'),false);assert(M.request(s,'compress'));M.finish(s);assert.equal(s.pressure,'compressed');assert(M.request(s,'equilibrate'));M.finish(s);assert.equal(s.pressure,'equilibrated');
 const gases=['initial','compressed','equilibrated'].map(M.pressureData);
 for(const g of gases)assert.equal(g.no2+2*g.n2o4,24,'Conserve nitrogen and oxygen through compression and reaction');
 assert.deepEqual(gases.map(g=>g.cNO2),[1,2,1.5]);assert.deepEqual(gases.map(g=>g.qOverK),[1,.5,1]);
 assert.deepEqual(gases.map(g=>g.relativePressure),[1,2,1.875]);assert.deepEqual(s.pressureSeen,['initial','compressed','equilibrated']);
});
for(const engine of ['chromium','webkit'])test(engine+': touch procedures, tablet layouts, first-error diagnosis and transfer questions',{timeout:120000},async()=>{
 const root=path.resolve(__dirname,'../learning/inquiry/science-lab');
 const server=http.createServer((req,res)=>{let f=path.resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!f.startsWith(root+path.sep))return res.writeHead(403).end();if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');fs.readFile(f,(e,b)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css'}[path.extname(f)]||'application/octet-stream');res.end(b);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});
  const p=await browser.newPage({hasTouch:true,viewport:{width:768,height:1024},reducedMotion:'reduce'}),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  await p.goto('http://127.0.0.1:'+server.address().port+'/equilibrium-colour/');await p.waitForSelector('[data-assessment-ready]',{state:'attached'});
  const state=()=>p.evaluate(()=>__equilibriumColour.getState()),tap=sel=>p.locator(sel).tap(),settled=()=>p.waitForFunction(()=>!__equilibriumColour.getState().pending);
  assert(await p.locator('#ecAdd').isDisabled());await tap('#ecPrepare');
  for(let i=0;i<4;i++){await tap('[data-ec-tube="'+i+'"]');await tap('[data-ec-reagent="'+(i<2?'acid':'base')+'"]');await tap('#ecAdd');await settled();}
  assert.deepEqual((await state()).tubes.map(t=>t.colour),['orange','orange','yellow','yellow']);assert(await p.locator('#ecAdd').isDisabled());
  const out=path.resolve('docs/science-lab-audit-2026-10-12/course-practices/equilibrium-colour');fs.mkdirSync(out,{recursive:true});
  const layout=async mode=>{for(const [width,height]of [[1366,768],[1180,820],[1024,768],[820,1180],[768,1024]]){
   await p.setViewportSize({width,height});await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,mode+' overflow '+width);
   const reading=await p.locator('.ec-lab').evaluate(root=>[...root.querySelectorAll('button,span,p,h2,b')].filter(e=>e.getBoundingClientRect().width>0).flatMap(e=>{const r=e.getBoundingClientRect(),n=parseFloat(getComputedStyle(e).fontSize);return (e.tagName==='BUTTON'&&r.height<43.5)||n<13.9||n>24.2?[e.textContent,n,r.height]:[];}));assert.deepEqual(reading,[],mode+' reading '+width);
   if(width===768||width===1366)await require('./science-screenshot.cjs')(p.locator('.ec-lab'),path.join(out,engine+'-'+mode+'-'+width+'.webp'));
  }};
  await layout('concentration');await tap('[data-mode=pressure]');assert(await p.locator('#ecEquilibrate').isDisabled());
  assert.equal(await p.locator('#ecDensity').textContent(),'1.00');assert.equal(await p.locator('.ec-molecule i').count(),24);
  await tap('#ecCompress');await settled();assert.equal(await p.locator('#ecDensity').textContent(),'2.00');assert.equal(await p.locator('.ec-molecule i').count(),24);assert.equal(await p.locator('.ec-molecule').count(),16);await layout('compressed');
  await tap('#ecEquilibrate');await settled();assert.equal(await p.locator('#ecDensity').textContent(),'1.50');assert.equal(await p.locator('.ec-molecule i').count(),24);assert.equal(await p.locator('.ec-molecule').count(),15);await layout('equilibrated');
  await tap('[data-mode=temperature]');assert(await p.locator('[data-ec-bath=hot]').isDisabled());
  await tap('#ecFill');assert.equal((await state()).cobalt,'pink');await tap('#ecChloride');await settled();
  for(const bath of ['hot','cold','hot']){await tap('[data-ec-bath='+bath+']');await settled();assert.equal((await state()).cobalt,bath==='hot'?'blue':'pink');}
  await layout('temperature');await tap('#ecReset');assert.deepEqual((await state()).seen,{});assert.equal((await state()).cobalt,'empty');
  // Reset also cancels the pending timer rather than producing a late observation.
  await p.emulateMedia({reducedMotion:'no-preference'});await tap('#ecFill');await tap('#ecChloride');await tap('#ecReset');await p.waitForTimeout(1900);assert.equal((await state()).cobalt,'empty');
  await tap('.quiz-section summary');const cards=await p.locator('.quiz-card').all();assert.equal(cards.length,4);
  for(const c of cards){const answer=await c.getAttribute('data-answer'),wrong='abcd'.split('').find(a=>a!==answer);await c.locator('input[value='+wrong+']').check();await c.locator('.answer-button').tap();await c.locator('input[value='+answer+']').check();await c.locator('.answer-button').tap();}
  assert.equal(await p.locator('.quiz-section').evaluate(e=>e.scienceAssessment.store.summary().firstCorrect),0,'Correction must not overwrite the diagnostic first response');
  await p.reload();await p.waitForSelector('[data-assessment-ready]',{state:'attached'});assert.equal(await p.locator('.quiz-section').evaluate(e=>e.scienceAssessment.store.summary().firstCorrect),0);
  const registry=require('../scripts/science-equilibrium-colour-experiment.cjs');if(!await p.locator('.quiz-section').getAttribute('open'))await tap('.quiz-section summary');await p.waitForSelector('.exam-question');
  for(let i=0;i<registry.followups.length;i++){await tap('[data-exam-answer="'+registry.followups[i].answer+'"]');await tap('.exam-submit');assert.equal(await p.locator('.exam-feedback').getAttribute('data-correct'),'true');if(i+1<registry.followups.length)await tap('[data-exam-next]');}
  assert.deepEqual(errors,[]);
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
});
