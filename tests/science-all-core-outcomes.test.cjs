const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {rows}=require('../scripts/science-outcome-inventory.cjs'),added=require('../scripts/science-outcome-question-additions.cjs');
const root=path.resolve(__dirname,'../learning/inquiry/science-lab'),out=path.resolve(__dirname,'../docs/science-lab-audit-2026-10-18/core-results-full');
const widths=[[1366,768],[1180,820],[1024,768],[820,1180],[768,1024]];
for(const engine of ['chromium','webkit'])test(engine+': all 196 outcome routes, newly added answers and five reading sizes',{timeout:600000},async()=>{
 const server=http.createServer((req,res)=>{let p=path.resolve(root,'.'+new URL(req.url,'http://local').pathname);if(p!==root&&!p.startsWith(root+path.sep))return res.writeHead(403).end();if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,'index.html');fs.readFile(p,(e,b)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css'}[path.extname(p)]||'application/octet-stream');res.end(b);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser,cursor=0;const evidence={engine,emulationOnly:true,routes:[],newAnswers:[],layouts:[],captures:[],errors:[]},routes=rows.flatMap(app=>app.routes.map(route=>({app,route})));
 try{
  browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});
  await Promise.all(Array.from({length:engine==='webkit'?1:2},async()=>{
   const page=await browser.newPage({viewport:{width:1024,height:768},deviceScaleFactor:engine==='webkit'?2:1.25,hasTouch:true});
   page.on('pageerror',e=>evidence.errors.push({url:page.url(),message:e.message}));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
   while(cursor<routes.length){const {app,route}=routes[cursor++],label=app.slug+'/'+route.school,bank=route.questions.filter(q=>!q.id.includes('#q'));
    await page.goto(`http://127.0.0.1:${server.address().port}/${app.slug}/${route.school==='default'?'':'?school='+route.school}`);
    await page.waitForSelector('[data-assessment-ready]',{state:'attached'});if(await page.locator('.quiz-section summary').count())await page.locator('.quiz-section summary').click();
    if(bank.length)await page.waitForFunction(()=>!!document.querySelector('.exam-widget')?.examController);
    const live=await page.evaluate(()=>{const s=document.querySelector('.quiz-section').scienceAssessment.store;return{ids:document.querySelector('.exam-widget')?.examController.ids()||[],questions:[...s.questions.values()].map(q=>({id:q.id,question:q.question,answer:q.answer,choices:q.choices,why:q.why}))};});
    assert.deepEqual(live.ids,bank.map(q=>q.id),label+' actual bank order and course exclusions');
    for(const q of route.questions){const actual=live.questions.find(e=>e.id===q.id);assert(actual,label+' '+q.id);assert.equal(actual.question,q.question);assert.deepEqual(actual.choices.map(c=>c.text).sort(),[...q.choices].sort());assert.equal(actual.choices.find(c=>c.id===actual.answer)?.text,q.choices[q.answer]);assert.equal(actual.why,q.why);}
    evidence.routes.push({slug:app.slug,school:route.school,questions:route.questions.length,ids:route.questions.map(q=>q.id)});if(evidence.routes.length%40===0)console.log(engine+': '+evidence.routes.length+' routes');
    const newQs=(added[app.slug]||[]).filter(q=>live.ids.includes(q.id));
    for(const q of newQs){await page.evaluate(id=>{const e=document.querySelector('.exam-widget'),n=e.examController.ids().length;for(let i=0;i<n&&e.examController.current()!==id;i++)e.querySelector('[data-exam-next]').click();if(e.examController.current()!==id)throw Error('unreachable '+id);},q.id);
     assert.equal(await page.locator('.exam-question h2').textContent(),q.question);
     const wrong=(q.answer+1)%q.choices.length;await page.locator(`[data-exam-answer="${wrong}"]`).click();await page.locator('.exam-submit').click();assert.equal(await page.locator('.exam-feedback').getAttribute('data-correct'),'false');assert.equal(await page.locator('.exam-feedback').textContent(),'다시 생각하고 다른 답을 골라보세요.');
     await page.locator(`[data-exam-answer="${q.answer}"]`).click();await page.locator('.exam-submit').click();assert.equal(await page.locator('.exam-feedback').getAttribute('data-correct'),'true');const text=await page.locator('.exam-feedback').textContent();assert(text.startsWith('정답입니다. '));assert(text.includes(q.why));assert(!/첫 응답|오답으로 남|다시 풀어 맞/.test(text));
     const state=await page.evaluate(id=>document.querySelector('.quiz-section').scienceAssessment.store.evidence(id),q.id);assert.equal(state.first,String(wrong));assert.equal(state.last,String(q.answer));assert.equal(state.firstCorrect,false);evidence.newAnswers.push({slug:app.slug,school:route.school,id:q.id,firstWrongPreserved:true});
     for(const [width,height]of widths){await page.bringToFront();await page.setViewportSize({width,height});await page.evaluate(()=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Question layout did not paint within 10 seconds')),10000);requestAnimationFrame(()=>requestAnimationFrame(()=>{clearTimeout(timer);resolve();}));}));const result=await page.locator('.exam-widget').evaluate(e=>{const b=e.getBoundingClientRect(),els=[...e.querySelectorAll('h2,.exam-topic,.exam-answers button,.exam-submit,.exam-feedback')].filter(n=>n.getBoundingClientRect().height>0);return{overflow:document.documentElement.scrollWidth>innerWidth+1,clipped:els.filter(n=>{const r=n.getBoundingClientRect();return r.left<b.left-1||r.right>b.right+1||n.scrollWidth>n.clientWidth+2;}).map(n=>n.textContent),small:els.filter(n=>parseFloat(getComputedStyle(n).fontSize)<(n.classList.contains('exam-topic')?14:n.tagName==='H2'?16:15)||(n.tagName==='H2'&&parseFloat(getComputedStyle(n).fontSize)>24)).map(n=>n.textContent),touch:els.filter(n=>n.tagName==='BUTTON'&&n.getBoundingClientRect().height<43.5).map(n=>n.textContent)};});assert.deepEqual(result,{overflow:false,clipped:[],small:[],touch:[]},label+' '+q.id+' '+width);evidence.layouts.push({id:q.id,school:route.school,width,height});
      if(['solubility@outcome-sugar-density','interference@outcome-superposition','equilibrium-colour@outcome-compression-colour'].includes(q.id)&&[1366,768].includes(width)){const file=engine+'-'+app.slug+'-'+width+'.webp';await require('./science-screenshot.cjs')(page.locator('.exam-widget'),path.join(out,file));evidence.captures.push(file);}
     }
    }
   }
   await page.close();
  }));
  assert.equal(evidence.routes.length,201);for(const q of Object.values(added).flat())assert(evidence.newAnswers.some(x=>x.id===q.id),'not answered '+q.id);assert.deepEqual(evidence.errors,[]);
 }finally{fs.writeFileSync(path.join(out,engine+'-questions.json'),JSON.stringify(evidence,null,2)+'\n');await browser?.close();await new Promise(r=>server.close(r));}
});
