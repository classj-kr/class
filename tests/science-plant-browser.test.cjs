const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const lab=path.resolve(__dirname,'../learning/inquiry/science-lab'),models=require(path.join(lab,'required-experiments.js')).requiredExperimentModels().microscope;
const questions=require(path.join(lab,'assessment-content.js')).followups.microscope.filter(q=>/microscope@(root|leaf|stem)-/.test(q.id));
const screenshot=require('./science-screenshot.cjs');
for(const engine of ['chromium','webkit'])test(engine+': plant procedures, responsive figures and nine first-response diagnostics',{timeout:90000},async()=>{
 const server=http.createServer((req,res)=>{let file=path.resolve(lab,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(lab+path.sep))return res.writeHead(403).end();if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');fs.readFile(file,(error,data)=>{if(error)return res.writeHead(404).end();res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css'}[path.extname(file)]||'application/octet-stream');res.end(data);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;const errors=[],out=path.resolve(__dirname,'../docs/science-lab-audit-2026-10-11/textbook-procedure-review');fs.mkdirSync(out,{recursive:true});
 try{
  browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});const page=await browser.newPage({viewport:{width:1100,height:900}});page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  await page.goto('http://127.0.0.1:'+server.address().port+'/microscope/');await page.waitForFunction(()=>!!window.__requiredExperiments);
  for(const model of models){await page.locator(`[data-experiment="${model.id}"]`).click();await page.locator('[data-required-field="stage"]').selectOption('after');
   for(const width of [1100,820,390]){await page.setViewportSize({width,height:900});const layout=await page.locator('#required-experiments').evaluate(panel=>{const svg=panel.querySelector('svg'),rect=svg.getBoundingClientRect();return{overflow:document.documentElement.scrollWidth>innerWidth+1,clipped:[...svg.querySelectorAll('text')].filter(t=>{const r=t.getBoundingClientRect();return r.left<rect.left-1||r.right>rect.right+1||r.top<rect.top-1||r.bottom>rect.bottom+1;}).map(t=>t.textContent)};});assert.deepEqual(layout,{overflow:false,clipped:[]},model.id+' '+width);if(engine==='chromium'&&width!==820)await screenshot(page.locator('#required-experiments'),{path:path.join(out,model.id+'-'+(width===390?'mobile':'desktop')+'.webp')});}
  }
  await page.evaluate(()=>document.querySelector('.quiz-section').open=true);await page.waitForFunction(()=>!!document.querySelector('.exam-integrated')?.examController);
  async function go(id){for(let i=0;i<35;i++){if(await page.locator('.exam-question').getAttribute('data-exam-id')===id)return;await page.locator('[data-exam-next]').click();}throw Error('Missing question '+id);}
  for(const q of questions){await go(q.id);await page.locator(`[data-exam-answer="${(q.answer+1)%3}"]`).click();await page.locator('.exam-submit').click();assert.equal(await page.locator('.exam-feedback').getAttribute('data-correct'),'false');assert(!(await page.locator('.exam-feedback').textContent()).includes(q.why));await page.locator(`[data-exam-answer="${q.answer}"]`).click();await page.locator('.exam-submit').click();assert.match(await page.locator('.exam-feedback').textContent(),/첫 응답은 오답/);}
  const evidence=()=>page.evaluate(ids=>{const s=document.querySelector('.quiz-section').scienceAssessment.store;return ids.map(id=>s.evidence(id));},questions.map(q=>q.id));
  for(const e of await evidence()){assert.equal(e.firstCorrect,false);assert.equal(e.status,'corrected');}
  await page.reload();await page.waitForFunction(()=>!!document.querySelector('.quiz-section')?.scienceAssessment);await page.evaluate(()=>document.querySelector('.quiz-section').open=true);await page.waitForFunction(()=>!!document.querySelector('.exam-integrated')?.examController);
  for(const e of await evidence()){assert.equal(e.firstCorrect,false);assert.equal(e.status,'corrected');}
  assert.deepEqual(errors,[]);
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
});
