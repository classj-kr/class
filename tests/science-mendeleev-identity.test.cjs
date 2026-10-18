const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const lab=path.resolve(__dirname,'../learning/inquiry/science-lab'),model=require(path.join(lab,'mendeleev/identity-model.js'));
const correct=Array(28).fill(null);correct[0]='c1';for(let i=1;i<17;i++)correct[i+6]='c'+(i+1);
test('17-card source dataset and board keep identification, mass and families separate',()=>{
 assert.equal(model.cards.length,17);assert.deepEqual(model.active,[0,...Array.from({length:16},(_,i)=>i+7)]);
 assert.deepEqual(model.cards.find(c=>c.symbol==='Ca').compounds,['CaO','CaCl₂']);
 assert.equal(model.identify('c7','O'),true);assert.equal(model.identify('c7','C'),false);
 assert.equal(model.evaluate(correct).complete,true);
 let swapped=model.place(correct,'c2',14);assert.equal(model.evaluate(swapped).familyConflicts.length,0);assert(model.evaluate(swapped).orderConflicts.length);
 swapped=model.place(correct,'c3',9);assert.deepEqual(model.evaluate(swapped).familyConflicts,[1,2]);
 swapped=model.place(correct,'c1',7);assert(model.evaluate(swapped).hydrogenConflict);assert(model.evaluate(swapped).familyConflicts.includes(0));
 assert.throws(()=>model.place(correct,'c1',1),/Invalid/);
 const duplicate=correct.slice();duplicate[7]='c1';assert.throws(()=>model.evaluate(duplicate),/duplicated/);
 assert.equal(model.modern.length,20);assert.deepEqual(model.modern.map(c=>c.number),Array.from({length:20},(_,i)=>i+1));
 assert.deepEqual(model.modern.filter(c=>c.noble).map(c=>c.symbol),['He','Ne','Ar']);
});
for(const engine of ['chromium','webkit'])test(engine+': identify 17 cards, arrange, compare and preserve first quiz responses',{timeout:180000},async()=>{
 const server=http.createServer((req,res)=>{let file=path.resolve(lab,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(lab+path.sep))return res.writeHead(403).end();if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');fs.readFile(file,(error,data)=>{if(error)return res.writeHead(404).end();res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css'}[path.extname(file)]||'application/octet-stream');res.end(data);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;const errors=[],out=path.resolve(__dirname,'../docs/science-lab-audit-2026-10-11/textbook-procedure-review');fs.mkdirSync(out,{recursive:true});
 try{
  browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});const page=await browser.newPage({viewport:{width:1100,height:900}});page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  await page.goto('http://127.0.0.1:'+server.address().port+'/mendeleev/');
  await page.locator('[data-card=Na]').click();await page.locator('[data-slot="0"]').click();
  await page.locator('[data-deck=identity]').click();assert(await page.locator('#classicExperiment').isHidden());assert.equal(await page.locator('#identityPool button').count(),17);assert.equal(await page.locator('#identityBoard button').count(),17);
  await page.locator('[data-identity-card=c7]').click();await page.locator('[data-identity-slot="12"]').click();assert.match(await page.locator('#identityStatus').textContent(),/기호를 먼저/);assert.equal(await page.locator('#identityPool button').count(),17);
  await page.locator('#identitySymbol').selectOption('C');await page.locator('#identityForm button').click();assert.match(await page.locator('#identityStatus').textContent(),/아직 맞지/);assert(await page.locator('#identityForm').isVisible());
  for(const [index,id]of correct.entries())if(id){const c=model.cards.find(c=>c.id===id);await page.locator(`[data-identity-card=${id}]`).click();await page.locator('#identitySymbol').selectOption(c.symbol);await page.locator('#identityForm button').click();assert(await page.locator('#identityForm').isHidden());await page.locator(`[data-identity-slot="${index}"]`).click();}
  await page.locator('#identityCheck').click();assert.equal(await page.locator('#identityStatus').getAttribute('data-complete'),'true');assert.equal(await page.locator('#identityPool button').count(),0);
  await page.locator('#compareModern').click();assert.equal(await page.locator('.modern-element').count(),20);assert.equal(await page.locator('.modern-element.noble').count(),3);assert.match(await page.locator('#modernComparison').textContent(),/수소는 1족 위치에 표시하지만 알칼리 금속은 아닙니다/);
  for(const width of [1100,820,390]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'overflow '+width);const clipped=await page.locator('#identityExperiment').evaluate(root=>[...root.querySelectorAll('button,.modern-element')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.left<0||r.right>innerWidth+1);}).map(e=>e.textContent));assert.deepEqual(clipped,[]);if(width!==820)await require('./science-screenshot.cjs')(page.locator('#identityExperiment'),path.join(out,`mendeleev-17-${engine}-${width}.webp`));}
  await page.locator('[data-identity-slot="7"]').click();await page.locator('[data-identity-slot="14"]').click();await page.locator('#identityCheck').click();assert.equal(await page.locator('#identityStatus').getAttribute('data-complete'),'false');assert.match(await page.locator('#identityStatus').textContent(),/원자량이 작아/);
  await page.locator('[data-identity-slot="7"]').click();await page.locator('#identityRemove').click();assert.equal(await page.locator('#identityPool button').count(),1);
  await page.locator('[data-deck=classic]').click();assert.match(await page.locator('[data-slot="0"]').textContent(),/Na/);assert.equal(await page.locator('#elementPool button').count(),18);
  await page.locator('[data-deck=identity]').click();await page.locator('#identityReset').click();assert.equal(await page.locator('#identityPool button').count(),17);assert(await page.locator('#modernComparison').isHidden());assert.match(await page.locator('#identityCount').textContent(),/원소 확인 0\/17/);
  await page.evaluate(()=>document.querySelector('.quiz-section').open=true);await page.waitForFunction(()=>!!document.querySelector('.exam-integrated')?.examController);
  const questions=require(path.join(lab,'assessment-content.js')).followups.mendeleev.filter(q=>/mendeleev@(identify|hydrogen)-/.test(q.id));assert.equal(questions.length,2);
  for(const q of questions){for(let i=0;i<35&&await page.locator('.exam-question').getAttribute('data-exam-id')!==q.id;i++)await page.locator('[data-exam-next]').click();assert.equal(await page.locator('.exam-question').getAttribute('data-exam-id'),q.id);await page.locator(`[data-exam-answer="${(q.answer+1)%3}"]`).click();await page.locator('.exam-submit').click();assert.equal(await page.locator('.exam-feedback').getAttribute('data-correct'),'false');await page.locator(`[data-exam-answer="${q.answer}"]`).click();await page.locator('.exam-submit').click();assert.match(await page.locator('.exam-feedback').textContent(),/정답입니다\./);}
  await page.reload();await page.waitForFunction(()=>!!document.querySelector('.quiz-section')?.scienceAssessment);await page.evaluate(()=>document.querySelector('.quiz-section').open=true);await page.waitForFunction(()=>!!document.querySelector('.exam-integrated')?.examController);
  const evidence=await page.evaluate(ids=>ids.map(id=>document.querySelector('.quiz-section').scienceAssessment.store.evidence(id)),questions.map(q=>q.id));for(const item of evidence){assert.equal(item.firstCorrect,false);assert.equal(item.status,'corrected');}
  assert.deepEqual(errors,[]);
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
});
