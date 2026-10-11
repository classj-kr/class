const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const M=require('../learning/inquiry/science-lab/circuit-measurement-model.js');
test('meter topology, Kirchhoff relations and measurements keep their physical conditions',()=>{
 const near=(a,b)=>assert(Math.abs(a-b)<1e-9,`${a} != ${b}`);
 for(const volts of [0,1.5,6,12])for(const r1 of [100,200,400])for(const r2 of [100,300,400])for(const wiring of ['series','parallel']){
  const s={...M.defaults(),volts,r1,r2,wiring},a=M.analyse(s);
  if(wiring==='series'){near(a.r1.voltage+a.r2.voltage,volts);near(a.r1.current,a.r2.current);near(a.whole.current,volts/(r1+r2));}
  else{near(a.r1.voltage,volts);near(a.r2.voltage,volts);near(a.whole.current,a.r1.current+a.r2.current);near(a.whole.current,volts/r1+volts/r2);}
  near(a.whole.voltage*a.whole.current,a.r1.voltage*a.r1.current+a.r2.voltage*a.r2.current);
  for(const target of ['r1','r2','whole'])for(const meter of ['current','voltage']){
   const x={...s,target,meter,connection:meter==='current'?'series':'parallel'},book=M.create();
   assert.equal(M.reading(x).value,null);assert.equal(M.capture(book,x),false);assert(M.capture(book,{...x,closed:true}));near(M.reading({...x,closed:true}).value,a[target][meter]);
   const bad={...x,closed:true,connection:meter==='current'?'parallel':'series'};assert.equal(M.reading(bad).value,null);assert.equal(M.capture(book,bad),false);
  }
 }
 const a=M.analyse(M.defaults());assert.equal(a.r1.voltage,4);assert.equal(a.r2.voltage,2);assert.equal(a.whole.current,.02);
 const book=M.create();for(const wiring of ['series','parallel'])for(const target of ['r1','r2','whole'])for(const meter of ['current','voltage'])M.capture(book,{...M.defaults(),closed:true,wiring,target,meter,connection:meter==='current'?'series':'parallel'});
 assert(M.complete(book.series)&&M.complete(book.parallel));M.capture(book,{...M.defaults(),closed:true,volts:12});assert(!M.complete(book.series));assert.deepEqual(book.parallel,{});
});
for(const engine of ['chromium','webkit'])test(engine+': move meters, reject wrong connections, compare six readings and separate course diagnosis',async()=>{
 const root=path.resolve(__dirname,'../learning/inquiry/science-lab'),s=http.createServer((req,res)=>{let f=path.resolve(root,'.'+new URL(req.url,'http://local').pathname);if(f!==root&&!f.startsWith(root+path.sep))return res.writeHead(403).end();if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');fs.readFile(f,(e,b)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',{'.js':'text/javascript','.css':'text/css','.html':'text/html; charset=utf-8'}[path.extname(f)]||'application/octet-stream');res.end(b);});});
 await new Promise(r=>s.listen(0,'127.0.0.1',r));let browser;const out=path.resolve('docs/science-lab-audit-2026-10-12/final-quality/circuit');fs.mkdirSync(out,{recursive:true});
 try{browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});const p=await browser.newPage({hasTouch:true,viewport:{width:1366,height:768}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());const url='http://127.0.0.1:'+s.address().port;
  await p.goto(url+'/ohms-law/?school=high-elective');await p.waitForSelector('[data-assessment-ready]',{state:'attached'});assert.equal(await p.locator('.quiz-card').count(),4);assert.match(await p.locator('h1').textContent(),/電|전압/);assert.equal(await p.locator('.curriculum-supplement,#required-experiments').count(),0);
  await p.locator('[data-cm-meter=current]').tap();await p.locator('#cmSwitch').tap();assert.equal(await p.evaluate(()=>window.__circuitMeasurement.getState().closed),false);assert.match(await p.locator('#cmStatus').textContent(),/우회/);assert(await p.locator('#cmRead').isDisabled());
  await p.locator('[data-cm-connection=series]').tap();await p.locator('[data-cm-meter=voltage]').tap();await p.locator('#cmSwitch').tap();assert.match(await p.locator('#cmStatus').textContent(),/거의 흐르지/);assert.equal(await p.locator('#cmReading').textContent(),'—');
  for(const wiring of ['series','parallel']){await p.locator('[data-cm-wiring='+wiring+']').tap();for(const target of ['r1','r2','whole'])for(const meter of ['voltage','current']){
   await p.locator('[data-cm-target='+target+']').tap();await p.locator('[data-cm-meter='+meter+']').tap();await p.locator('[data-cm-connection='+(meter==='current'?'series':'parallel')+']').tap();await p.locator('#cmSwitch').tap();await p.locator('#cmRead').tap();
  }assert.equal(await p.locator('#cmTable td').evaluateAll(es=>es.filter(e=>e.textContent==='—').length),0);}
  assert.match(await p.locator('#cmConclusion').textContent(),/직렬 20.0 mA, 병렬 90.0 mA/);
  for(const[width,height]of [[1366,768],[1180,820],[1024,768],[820,1180],[768,1024]]){await p.setViewportSize({width,height});await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);assert(await p.evaluate(()=>{const a=document.querySelector('.cm-controls').getBoundingClientRect(),b=document.querySelector('.cm-observation').getBoundingClientRect();return Math.abs(a.top-b.top)<2&&b.left>a.right;}),'controls and circuit stay side by side on tablet');await require('./science-screenshot.cjs')(p.locator('.circuit-measurement'),path.join(out,engine+'-'+width+'.webp'));}
  await p.locator('#cmVolts').fill('9');assert.equal(await p.locator('#cmTable td').evaluateAll(es=>es.filter(e=>e.textContent!=='—').length),0);assert.equal(await p.evaluate(()=>window.__circuitMeasurement.getState().closed),false);await p.locator('#cmReset').tap();assert.deepEqual(await p.evaluate(()=>window.__circuitMeasurement.getState()),M.defaults());
  await p.locator('.quiz-section summary').tap();const card=p.locator('.quiz-card').first(),answer=await card.getAttribute('data-answer');assert.equal(await card.getAttribute('data-question-id'),'ohms-law#q5');await card.locator('input[value=a]').check();await card.locator('.answer-button').tap();await card.locator('input[value='+answer+']').check();await card.locator('.answer-button').tap();assert.equal(await p.locator('.quiz-section').evaluate(e=>e.scienceAssessment.store.summary().corrected),1);
  await p.waitForSelector('.exam-question');
  for(const [i,q]of require('../scripts/science-circuit-course.cjs').followups.entries()){
   assert.equal(await p.locator('.exam-question').getAttribute('data-exam-id'),q.id);await p.locator('[data-exam-answer="'+q.answer+'"]').tap();await p.locator('.exam-submit').tap();assert.equal(await p.locator('.exam-feedback').getAttribute('data-correct'),'true');if(i<2)await p.locator('[data-exam-next]').tap();
  }
  await p.reload();await p.waitForSelector('[data-assessment-ready]',{state:'attached'});assert.equal(await p.locator('.quiz-section').evaluate(e=>e.scienceAssessment.store.summary().corrected),1);
  await p.goto(url+'/ohms-law/?school=middle');await p.waitForSelector('[data-assessment-ready]',{state:'attached'});await p.waitForFunction(()=>!!window.__ohmModel);assert.equal(await p.locator('#cmScene').count(),0);assert.equal(await p.locator('.quiz-card').first().getAttribute('data-question-id'),'ohms-law#q1');assert.equal(await p.locator('.quiz-section').evaluate(e=>e.scienceAssessment.store.summary().corrected),0);assert.deepEqual(errors,[]);
 }finally{await browser?.close();await new Promise(r=>s.close(r));}
});
