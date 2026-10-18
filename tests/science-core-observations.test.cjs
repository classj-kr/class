const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const coverage=require('../docs/science-lab-audit-2026-10-18/core-results-full/coverage.json');
const {rows}=require('../scripts/science-outcome-inventory.cjs'),map=require('../learning/inquiry/science-lab/curriculum-map.js');
const root=path.resolve(__dirname,'../learning/inquiry/science-lab'),out=path.resolve(__dirname,'../docs/science-lab-audit-2026-10-18/core-results-full');
const cases=coverage.apps.map(a=>({...a,checks:[...new Map(a.outcomes.flatMap(o=>o.questions.filter(q=>['observation','required'].includes(q.location))).map(q=>[q.id,q])).values()]})).filter(a=>a.checks.length);
for(const engine of ['chromium','webkit'])test(engine+': every in-experiment question cited by the core-result review is reachable and gradable',{timeout:180000},async()=>{
 const server=http.createServer((req,res)=>{let p=path.resolve(root,'.'+new URL(req.url,'http://local').pathname);if(p!==root&&!p.startsWith(root+path.sep))return res.writeHead(403).end();if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,'index.html');fs.readFile(p,(e,b)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css'}[path.extname(p)]||'application/octet-stream');res.end(b);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;const evidence={engine,apps:[],checks:[],errors:[]};
 try{
  browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});const page=await browser.newPage({viewport:{width:820,height:1180},hasTouch:true,deviceScaleFactor:engine==='webkit'?2:1.25});page.on('pageerror',e=>evidence.errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  for(const a of cases){const route=rows.find(r=>r.slug===a.slug).routes.find(t=>!t.standalone);assert(route,a.slug);await page.goto(`http://127.0.0.1:${server.address().port}/${a.slug}/${route.school==='default'?'':'?school='+route.school}`);await page.waitForSelector('[data-assessment-ready]',{state:'attached'});
   for(const q of a.checks){if(q.location==='observation'){
     await page.waitForFunction(id=>document.querySelector('.quiz-section').scienceAssessment.store.questions.has(id),q.id);await page.evaluate(id=>document.querySelector('.quiz-section').dispatchEvent(new CustomEvent('science-review-question',{detail:id})),q.id);
     const panel=page.locator('.supplement-check');assert.equal(await panel.getAttribute('data-question-id'),q.id);assert.equal(await panel.locator('h3').textContent(),q.question);assert.deepEqual((await panel.locator('[data-check-answer]').allTextContents()).sort(),[...q.choices].sort());await panel.locator(`[data-check-answer="${q.answer}"]`).click();assert.equal(await panel.locator('.supplement-check-feedback').getAttribute('data-correct'),'true');
    }else{
     await page.waitForSelector(`[data-experiment="${q.experiment}"]`);await page.locator(`[data-experiment="${q.experiment}"]`).click();await page.evaluate(state=>{for(const [key,value]of Object.entries(state)){const select=document.querySelector(`[data-required-field="${key}"]`);if(select){select.value=value;select.dispatchEvent(new Event('change',{bubbles:true}));}}},q.state);
     assert.equal(await page.locator('.required-check h3').textContent(),q.question);assert.deepEqual(await page.locator('[data-required-answer]').allTextContents(),q.choices);await page.locator(`[data-required-answer="${q.answer}"]`).click();assert.equal(await page.locator('.required-check p').getAttribute('data-correct'),'true');assert.equal(await page.locator('.required-observation').textContent(),q.observed);
    }evidence.checks.push({slug:a.slug,id:q.id,question:q.question,answer:q.choices[q.answer]});
   }evidence.apps.push(a.slug);
  }
  assert.equal(evidence.apps.length,28);assert.equal(evidence.checks.length,41);assert.deepEqual(evidence.errors,[]);
 }finally{fs.writeFileSync(path.join(out,engine+'-observations.json'),JSON.stringify(evidence,null,2)+'\n');await browser?.close();await new Promise(r=>server.close(r));}
});
