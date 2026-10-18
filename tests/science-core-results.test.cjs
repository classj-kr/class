const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const authored=require('../scripts/science-core-result-questions.cjs');
const lab=path.resolve(__dirname,'../learning/inquiry/science-lab');
const out=path.resolve(__dirname,'../docs/science-lab-audit-2026-10-18/core-results');
const near=(actual,expected)=>assert(Math.abs(actual-expected)<1e-8,`${actual} != ${expected}`);

test('reviewed core-result questions reach the published assessment with specific distractor feedback',()=>{
 const questions=require('../scripts/review-science-questions.cjs').read();
 const content=require(path.join(lab,'assessment-content.js'));
 for(const e of authored){const q=questions.find(q=>q.id===e.id);assert(q);assert.equal(q.question,e.question);assert.equal(q.choices.find(c=>c.id===q.answer).text,e.correct);assert.equal(q.why,e.why);assert.equal(new Set(q.choices.map(c=>c.text)).size,q.choices.length);assert.equal(content.misconceptions[q.id].concept,e.concept);for(const c of q.choices)if(c.id!==q.answer)assert(e.misconceptions.includes(content.misconceptions[q.id].feedback[c.id]));}
 for(const [slug,qs]of Object.entries(authored.followups))for(const q of qs)assert.deepEqual(content.followups[slug].find(item=>item.id===q.id),q);
 const html=fs.readFileSync(path.join(lab,'weight-compare/index.html'),'utf8');assert.match(html,/같은 재료로 만든 속이 찬 덩어리/);assert.match(html,/같은 물에서 크기를 바꾸어도/);
 assert.doesNotMatch(fs.readFileSync(path.join(lab,'circuit-bulbs/index.html'),'utf8'),/전구 두 개가 직렬로/);
});

for(const engine of ['chromium','webkit'])test(engine+': outcomes reproduced by controls agree with the new questions',{timeout:240000},async()=>{
 const server=http.createServer((req,res)=>{let p=path.resolve(lab,'.'+new URL(req.url,'http://local').pathname);if(p!==lab&&!p.startsWith(lab+path.sep))return res.writeHead(403).end();if(fs.existsSync(p)&&fs.statSync(p).isDirectory())p=path.join(p,'index.html');fs.readFile(p,(e,b)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css'}[path.extname(p)]||'application/octet-stream');res.end(b);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;const evidence={engine,outcomes:{},quiz:[],followups:[],viewports:[]},errors=[];
 try{
  browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});
  const page=await browser.newPage({viewport:{width:1024,height:768},deviceScaleFactor:engine==='webkit'?2:1.25,hasTouch:engine==='webkit'});page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  const open=async slug=>{await page.goto(`http://127.0.0.1:${server.address().port}/${slug}/`);await page.waitForSelector('[data-assessment-ready]',{state:'attached'});};
  await open('weight-compare');
  evidence.outcomes.weight=await page.evaluate(()=>{const m=__weightModel,rows=[];for(const mat of Object.keys(m.MATERIALS))for(const size of m.SIZES){m.setMat(mat);m.setSize(size);m.runToEnd();const a=m.analyse();rows.push({mat,size,weight:a.weight,floats:a.floats,sunk:a.sunk,explanation:document.getElementById('elementaryExplanation').textContent});}m.setMat('wood');m.setSize(4);m.runToEnd();return rows;});
  const densities={cork:.24,wood:.5,plastic:.95,alu:2.7,iron:7.9};assert.equal(evidence.outcomes.weight.length,20);
  for(const r of evidence.outcomes.weight){near(r.weight,densities[r.mat]*r.size**3);assert.equal(r.floats,densities[r.mat]<1);}
  const wood=evidence.outcomes.weight.find(r=>r.mat==='wood'&&r.size===4),iron=evidence.outcomes.weight.find(r=>r.mat==='iron'&&r.size===1);near(wood.weight,32);near(iron.weight,7.9);assert(wood.weight>iron.weight&&wood.floats&&!iron.floats);assert.match(iron.explanation,/나무보다 가볍지만 가라앉습니다/);assert.equal(await page.locator('#predictionResult').isVisible(),false);
  fs.mkdirSync(out,{recursive:true});await require('./science-screenshot.cjs')(page.locator('.weight-stage'),path.join(out,`${engine}-large-wood.webp`));
  await open('force-motion');evidence.outcomes.force=await page.evaluate(()=>{const m=__forceModel;m.setFloor('ice');m.setStart(0);return [[2,7],[4,8]].map(([mass,force])=>{m.setMass(mass);m.setForce(force);return m.analyse();});});
  const [a,b]=evidence.outcomes.force;near(a.net,6);near(b.net,6);near(a.accel,3);near(b.accel,1.5);
  await open('circuit-bulbs');evidence.outcomes.magnet=await page.evaluate(()=>{const m=__circuitModel;m.setMode('magnet');return [1,2].map(n=>{m.setMagnet(n,100,'forward',true);return m.magnetState();});});
  const [one,two]=evidence.outcomes.magnet;assert(two.clips>one.clips);assert.deepEqual([one.leftPole,one.rightPole],[two.leftPole,two.rightPole]);
  await open('energy-conversion');evidence.outcomes.wind=await page.evaluate(()=>{const m=__energyModel;m.setMode('wind');return ['6','12'].map(v=>{m.set('wind',v);m.set('blade','20');return m.analyse();});});
  near(evidence.outcomes.wind[1].P/evidence.outcomes.wind[0].P,8);assert.deepEqual(evidence.outcomes.wind.map(r=>Math.round(r.P/1000)),[65,521]);
  await open('seed-germination');evidence.outcomes.seed=await page.evaluate(()=>{const m=__seedModel;return [{water:true,warm:true},{water:false,warm:true},{water:true,warm:false}].map(c=>{m.setConditions({...c,air:true});return {c,germinates:m.germinates()};});});assert.deepEqual(evidence.outcomes.seed.map(r=>r.germinates),[true,false,false]);
  await open('mixture-separation');await page.locator('#waterBtn').click();await page.waitForFunction(()=>!__mixtureModel.isActing());evidence.outcomes.mixture=await page.evaluate(()=>({separated:__mixtureModel.separated(),groups:__mixtureModel.groups(),remaining:__mixtureModel.remaining()}));
  assert(evidence.outcomes.mixture.separated.some(r=>r.id==='foam'));assert(!evidence.outcomes.mixture.separated.some(r=>r.id==='sand'));
  await open('nutrient-detection');evidence.outcomes.nutrients=await page.evaluate(()=>{const m=__nutrientModel;m.setMode('reagent');return ['biuret','sudan'].map(reagent=>{m.set('reagent',reagent);m.runToEnd();const a=m.analyse();return {reagent,colour:a.r.resultName,positive:a.results.filter(r=>r.reacts).map(r=>r.tube.key)};});});assert.deepEqual(evidence.outcomes.nutrients,[{reagent:'biuret',colour:'보라색',positive:['protein']},{reagent:'sudan',colour:'선홍색',positive:['fat']}]);
  await open('stars');evidence.outcomes.stars=await page.evaluate(()=>({ratio:__starModel.luminosity(10,6000)/__starModel.luminosity(.1,6000)}));near(evidence.outcomes.stars.ratio,10000);
  await open('wave-transfer');evidence.outcomes.wave=await page.evaluate(()=>{const m=__waveModel;m.setSpeed(20);return [1,2].map(f=>{m.setFreq(f);return m.analyse();});});assert.deepEqual(evidence.outcomes.wave.map(r=>[r.v,r.lambda]),[[20,20],[20,10]]);
  await open('pea-genetics');evidence.outcomes.pea=await page.evaluate(()=>{const m=__peaModel;const cross=Object.keys(m.CROSSES2).find(k=>m.CROSSES2[k].a==='RrYy'&&m.CROSSES2[k].b==='RrYy');return m.analyseTwo({...m.state,cross}).phenos.map(p=>({key:p.key,p:p.p}));});near(evidence.outcomes.pea.find(p=>p.key==='RY').p,9/16);

  await open('life-cycle');evidence.outcomes.life=await page.evaluate(()=>{const m=__lifeModel;m.setAnimal('butterfly');return [1,3].map(i=>{m.setStep(i);return m.ANIMALS.butterfly.stages[i].food;});});assert.deepEqual(evidence.outcomes.life,['배춧잎','꽃의 꿀']);
  const modelFollowups=Object.fromEntries(Object.entries(authored.followups).map(([slug,qs])=>[slug,qs.filter(q=>!q.id.includes('@outcome-'))]).filter(([,qs])=>qs.length));
  const slugs=[...new Set([...authored.map(q=>q.id.split('#')[0]),...Object.keys(modelFollowups)])];
  for(const slug of slugs){await open(slug);await page.locator('.quiz-section summary').click();
   for(const e of authored.filter(q=>q.id.startsWith(slug+'#'))){const card=page.locator(`[data-question-id="${e.id}"]`).first();const key=await card.getAttribute('data-answer');const wrong=await card.locator('input').evaluateAll((es,key)=>es.find(e=>e.value!==key).value,key);await card.locator(`input[value="${wrong}"]`).check();await card.locator('.answer-button').click();await card.locator(`input[value="${key}"]`).check();await card.locator('.answer-button').click();assert.equal(await card.getAttribute('data-state'),'correct');assert((await card.locator('.answer-result').textContent()).includes(e.why));evidence.quiz.push(e.id);}
   for(const q of modelFollowups[slug]||[]){await page.waitForFunction(()=>!!document.querySelector('.exam-widget')?.examController);const ids=await page.locator('.exam-widget').evaluate(e=>e.examController.ids());assert(ids.includes(q.id),q.id+' must be available in this app');const position=ids.indexOf(q.id);for(let n=0;n<position;n++)await page.locator('[data-exam-next]').click();await page.locator(`[data-exam-answer="${q.answer}"]`).click();await page.locator('.exam-submit').click();assert.equal(await page.locator('.exam-feedback').getAttribute('data-correct'),'true');assert((await page.locator('.exam-feedback').textContent()).includes(q.why));evidence.followups.push(q.id);}
   for(const [width,height]of [[1366,768],[1180,820],[1024,768],[820,1180],[768,1024]]){await page.setViewportSize({width,height});const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,small:[...document.querySelectorAll('.quiz-card h3,.quiz-card label,.quiz-card .answer-result,.exam-question,.exam-option')].filter(e=>e.getBoundingClientRect().width&&parseFloat(getComputedStyle(e).fontSize)<15).map(e=>e.textContent)}));assert.equal(layout.overflow,false,slug+' '+width);assert.deepEqual(layout.small,[],slug+' '+width);evidence.viewports.push({slug,width,height});if(slug==='weight-compare'&&[1366,768].includes(width))await require('./science-screenshot.cjs')(page.locator('.quiz-section'),path.join(out,`${engine}-weight-questions-${width}.webp`));}
  }
  assert.deepEqual(errors,[]);evidence.errors=errors;fs.writeFileSync(path.join(out,`${engine}-outcomes.json`),JSON.stringify(evidence,null,2)+'\n');
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
});
