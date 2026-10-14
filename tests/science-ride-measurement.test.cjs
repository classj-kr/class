const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const M=require('../learning/inquiry/science-lab/ride-models.js');
const near=(a,b,tolerance=1e-6)=>assert(Math.abs(a-b)<tolerance,`${a} != ${b}`);
test('course scopes partition authored questions and preserve scoped transfer evidence',()=>{
 const row=require('../scripts/science-restored-experiments.cjs').find(r=>r.slug==='ride-acceleration');
 const scopes=Object.values(row.courseContexts);
 assert.deepEqual(scopes.flatMap(c=>c.questionNumbers).sort((a,b)=>a-b),row.questions.map((_,i)=>i+1));
 assert.deepEqual(scopes.flatMap(c=>c.followupIds).sort(),row.followups.map(q=>q.id).sort());
 for(const c of scopes)for(const id of c.followupIds){const q=row.followups.find(q=>q.id===id);assert(q.checks.length);assert(q.checks.every(id=>c.questionNumbers.some(n=>id===row.slug+'#q'+n)));}
});
test('pendulum conserves energy and acceleration matches position and velocity derivatives',()=>{
 for(const length of [1,3,5])for(const angle of [5,30,60])for(const time of [.4,1.2,3.7,8.3,11.4]){
  const o={motion:'swing',length,angle,time},r=M.model(o),dt=1e-5,a=M.model({...o,time:time-dt}),b=M.model({...o,time:time+dt});
  near(.5*r.speed*r.speed+9.8*(r.z+length),9.8*length*(1-Math.cos(angle*Math.PI/180)),1e-6);
  near((b.x-a.x)/(2*dt),r.vx);near((b.z-a.z)/(2*dt),r.vz);
  near((b.vx-a.vx)/(2*dt),r.ax);near((b.vz-a.vz)/(2*dt),r.az);
  near(r.raw.x,0);near(r.raw.z,9.8*Math.cos(r.theta)+r.speed*r.speed/length);
 }
});
test('seesaw attachment distance scales linear acceleration but not gravity; axis rotation preserves magnitude',()=>{
 for(const motion of ['swing','seesaw','slide','circle','elevator','straight'])for(const time of [0,.5,1,3,7]){
  const r=M.model({motion,time}),rotated=M.model({motion,time,mount:180});
  near(r.sensor,rotated.sensor);near(r.raw.x,-rotated.raw.x);near(r.raw.z,-rotated.raw.z);
 }
 for(const time of [.4,1,1.7,3.8]){
  const a=M.model({motion:'seesaw',position:.5,time}),b=M.model({motion:'seesaw',position:1.5,time}),pivot=M.model({motion:'seesaw',position:0,time});
  near(b.acceleration,3*a.acceleration);near(pivot.acceleration,0);near(pivot.sensor,9.8);
  const dt=1e-5,l=M.model({motion:'seesaw',time:time-dt}),r=M.model({motion:'seesaw',time:time+dt}),c=M.model({motion:'seesaw',time});
  near((r.vx-l.vx)/(2*dt),c.ax);near((r.vz-l.vz)/(2*dt),c.az);
 }
});
test('frictionless slide distinguishes raw and corrected axes and ends at the end of the ramp',()=>{
 for(const slope of [10,30,45]){
  const o={motion:'slide',slope},r=M.model({...o,time:12}),theta=slope*Math.PI/180;
  near(r.raw.x,0);near(r.raw.z,9.8*Math.cos(theta));near(r.linear.x,9.8*Math.sin(theta));near(r.linear.z,0);
  near(Math.hypot(r.x,r.z),6);near(.5*r.speed*r.speed,9.8*6*Math.sin(theta));
  const samples=M.samples(o,12,.1);assert(samples.at(-1).time<=r.duration);assert(samples.every(p=>Number.isFinite(p.reading)));
 }
 near(M.model({motion:'slide',slope:30,sensorMode:'linear',axis:'x'}).reading,4.9);
 assert.equal(M.samples({motion:'swing'},12,.1).length,121);
 assert.equal(M.samples({motion:'swing'},12,1).length,13);
});
test('browser: apparatus, course routes, isolated diagnostics, reload and narrow screens',{timeout:120000},async()=>{
 const base=path.resolve(__dirname,'../learning/inquiry/science-lab');
 const server=http.createServer((req,res)=>{let file=path.resolve(base,'.'+new URL(req.url,'http://local').pathname);if(!file.startsWith(base+path.sep))return res.writeHead(403).end();if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');fs.readFile(file,(err,data)=>{if(err)return res.writeHead(404).end();res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css'})[path.extname(file)]||'application/octet-stream');res.end(data);});});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
 const out=path.resolve('docs/science-lab-audit-2026-10-11/ride-measurement');fs.mkdirSync(out,{recursive:true});
 try{
  browser=await require('playwright').chromium.launch({headless:true,executablePath:process.env.SCIENCE_BROWSER});
  const p=await browser.newPage({viewport:{width:1100,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
  await p.goto('http://127.0.0.1:'+server.address().port+'/ride-acceleration/');await p.waitForSelector('[data-assessment-ready]',{state:'attached'});
  const snapshot=()=>p.evaluate(()=>window.__inquiryLab.snapshot());
  for(const motion of ['circle','straight','elevator','swing','seesaw','slide']){
   await p.locator('#motion').selectOption(motion);await p.locator('#measureRide').click();let s=await snapshot();assert(s.state.samples.length>10,motion);
   for(const axis of ['x','z','magnitude']){await p.locator('#axis').selectOption(axis);assert.equal((await snapshot()).state.samples,null);await p.locator('#measureRide').click();assert((await snapshot()).state.samples.every(r=>Number.isFinite(r.reading)));}
   await p.locator('#time').fill('1');
   if(['swing','seesaw','slide'].includes(motion)){
    for(const width of [1100,390,320]){await p.setViewportSize({width,height:900});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,motion+width);await require('./science-screenshot.cjs')(p.locator('.experiment-layout'),path.join(out,motion+'-'+width+'.webp'));}
   }
  }
  await p.setViewportSize({width:1100,height:900});await p.locator('#motion').selectOption('seesaw');await p.locator('#position').fill('0');near((await snapshot()).state.model.acceleration,0);
  await p.locator('#motion').selectOption('slide');await p.locator('#axis').selectOption('x');await p.locator('#sensorMode').selectOption('linear');near((await snapshot()).state.model.reading,4.9);
  await p.locator('#mount').selectOption('180');near((await snapshot()).state.model.reading,-4.9);
  await p.locator('#play').click();assert((await snapshot()).running);await p.locator('#resetExperiment').click();assert(!(await snapshot()).running);assert.equal((await snapshot()).state.samples,null);assert.equal((await snapshot()).state.options.motion,'circle');
  const row=require('../scripts/science-restored-experiments.cjs').find(r=>r.slug==='ride-acceleration');
  for(const [school,context]of Object.entries(row.courseContexts)){
   await p.goto('http://127.0.0.1:'+server.address().port+'/ride-acceleration/?school='+school);await p.waitForSelector('[data-assessment-ready]',{state:'attached'});
   assert.equal((await snapshot()).state.options.motion,context.defaultMotion);
   assert.match(await p.locator('.grade-tags').textContent(),new RegExp(context.subjects[0]));
   assert.equal(await p.locator('.page-header a').getAttribute('href'),'../?school='+school);
   assert.equal(await p.locator('.quiz-section').evaluate(e=>e.scienceAssessment.store.summary().answered),0,'course starts with independent responses');
   await p.locator('.quiz-section summary').click();assert.equal(await p.locator('.quiz-card').count(),4);
   for(const width of [390,1100]){await p.setViewportSize({width,height:900});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);await require('./science-screenshot.cjs')(p.locator('.page-header'),path.join(out,school+'-entry-'+width+'.webp'));}
  for(const n of context.questionNumbers){const q=row.questions[n-1],card=p.locator('[data-question-id="ride-acceleration#q'+n+'"]');await card.locator('input[value='+'abcd'[(q.answer+1)%4]+']').check();await card.locator('.answer-button').click();assert(await card.locator('.answer-explanation').isHidden());await card.locator('input[value='+'abcd'[q.answer]+']').check();await card.locator('.answer-button').click();assert.match(await card.locator('.answer-result').textContent(),/처음 선택을 돌아보면/);}
  await p.waitForFunction(()=>!!document.querySelector('.exam-widget')?.examController);
  const ids=await p.locator('.exam-widget').evaluate(e=>e.examController.ids());assert.deepEqual(ids,context.followupIds);
  for(let i=0;i<ids.length;i++){const q=row.followups.find(q=>q.id===ids[i]);await p.locator('[data-exam-answer="'+q.answer+'"]').click();await p.locator('.exam-submit').click();assert.equal(await p.locator('.exam-feedback').getAttribute('data-correct'),'true');if(i<ids.length-1)await p.locator('[data-exam-next]').click();}
  const evidence=await p.locator('.quiz-section').evaluate(e=>e.scienceAssessment.store.summary().responses);
  assert(evidence.find(r=>r.id==='ride-acceleration#q'+(school==='high-elective'?5:8)).transferVerified);
  assert.equal(evidence.length,6);
  await p.reload();await p.waitForSelector('[data-assessment-ready]',{state:'attached'});
  assert.equal((await snapshot()).state.options.motion,context.defaultMotion);
  assert.equal(await p.locator('.quiz-section').evaluate(e=>e.scienceAssessment.store.summary().corrected),4);
  await p.locator('#motion').selectOption('straight');await p.locator('#resetExperiment').click();assert.equal((await snapshot()).state.options.motion,context.defaultMotion);
  }
  for(const suffix of ['', 'index.html?school=invalid','?school=__proto__']){
   await p.goto('http://127.0.0.1:'+server.address().port+'/ride-acceleration/'+suffix);await p.waitForSelector('[data-assessment-ready]',{state:'attached'});
   assert.equal((await snapshot()).state.options.motion,'circle');
   assert.equal(await p.locator('.quiz-section').evaluate(e=>e.scienceAssessment.store.summary().corrected),4,'default and legacy routes reuse common responses');
  }
  assert.equal(await p.locator('textarea').count(),0);assert.deepEqual(errors,[]);
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
});
