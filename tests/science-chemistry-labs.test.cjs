const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const M=require('../learning/inquiry/science-lab/chemistry-models.js'),rows=require('../scripts/science-chemistry-experiments.cjs');
test('wet gas collection: hydrostatic and vapor corrections conserve mass and moles',()=>{
 for(const [sample,mass]of Object.entries({A:32,B:44,C:58}))for(const head of [0,5,15]){const r=M.gas(sample,head);assert(Math.abs(r.before-r.after-r.mass)<1e-10);assert(Math.abs(r.pressure*r.volume/(M.R*r.T)-.01)<1e-10);assert(Math.abs(r.molar-mass)<1e-8);assert(r.pressure<r.air);}
 assert(M.gas('A',15).volume>M.gas('A',0).volume);assert(M.gas('A',15).pressure<M.gas('A',0).pressure);
});
test('colligative phase onset and changing solvent fraction, not a false solution plateau',()=>{
 assert.equal(M.sugar(.2,'heat',0).mass,34.2);assert(Math.abs(M.sugar(.6,'cool',0).bound+1.116)<1e-12);
 for(const m of [.2,.4,.6]){const h=M.sugar(m,'heat',500),c=M.sugar(m,'cool',500);assert(h.temperature>h.bound);assert(c.temperature<c.bound);assert.equal(h.phase,'boiling');assert.equal(c.phase,'freezing');}
 assert.equal(M.sugar(0,'heat',500).temperature,100);assert.equal(M.sugar(0,'cool',500).temperature,0);
});
test('calorimetry: reaction amounts, mass and heat sum independently agree',()=>{
 const d=M.hess('dissolve'),n=M.hess('neutralize'),a=M.hess('direct');assert(Math.abs(d.dh+n.dh-a.dh)<1e-12);assert(Math.abs(d.q+n.q-a.q)<1e-12);
 for(const r of[d,n,a])assert(Math.abs(r.mass*4.2*(r.temperature-25)/1000-r.q)<1e-12);
 assert(Math.abs(d.delta+n.delta-a.delta)>1,'temperature changes cannot be added as heats when masses differ');
});
test('buffer and hydrolysis: water equilibrium, electroneutrality and finite capacity',()=>{
 for(const well of'ABCDEF')assert(Math.abs(M.buffer(well,0)-7)<1e-10);
 assert(M.buffer('B',1)<3);assert(M.buffer('C',1)>11);assert(M.buffer('E',1)>6.8);assert(M.buffer('F',1)<7.2);
 assert(M.buffer('E',20)<2);assert(M.buffer('F',20)>12);assert.equal(M.buffer('A',20),7);assert.equal(M.buffer('D',20),7);
 const ka=10**(-7.21),v=.01005,c=.001/v,na=.001*ka/(ka+1e-7)/v,cl=.00005/v,h=10**-M.buffer('E',1);assert(Math.abs(h+na-cl-1e-14/h-c*ka/(ka+h))<1e-12);
 assert(M.salt('NH4Cl')<7);assert(M.salt('NaCN')>7);assert.equal(M.salt('NaCl'),7);assert(M.salt('NH4Cl',.001)>M.salt('NH4Cl',.1));assert(M.salt('NaCN',.001)<M.salt('NaCN',.1));
});
test('bean controls: equal starts, separate gas absorption and heat control',()=>{
 const a=M.beans('sensors',0),b=M.beans('sensors',500);assert.deepEqual(a.dry,a.germinating);assert(b.germinating.co2>b.dry.co2);assert(b.germinating.temperature>b.dry.temperature);
 const r=M.beans('respirometer',500);assert.equal(r.water,0);assert(r.koh>r.dry);assert.equal(M.beans('heat',500).boiled,25);
});
async function serve(){const base=path.resolve(__dirname,'../learning/inquiry/science-lab'),s=http.createServer((req,res)=>{let f=path.resolve(base,'.'+new URL(req.url,'http://local').pathname);if(!f.startsWith(base+path.sep))return res.writeHead(403).end();if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');fs.readFile(f,(e,d)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',({'.js':'text/javascript','.html':'text/html; charset=utf-8','.css':'text/css'})[path.extname(f)]||'application/octet-stream');res.end(d);});});await new Promise(r=>s.listen(0,'127.0.0.1',r));return{s,url:'http://127.0.0.1:'+s.address().port};}
for(const engine of ['chromium','webkit'])test(engine+': source procedure, control isolation, questions and mobile',{timeout:180000},async()=>{
 const{s,url}=await serve();let browser;const out=path.resolve(process.env.SCIENCE_CHEMISTRY_CAPTURE_DIR||'docs/science-lab-audit-2026-10-11/chemistry-implementation');fs.mkdirSync(out,{recursive:true});
 try{browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});const p=await browser.newPage({viewport:{width:1100,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 async function shot(name){for(const width of [1100,390]){await p.setViewportSize({width,height:900});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);await require('./science-screenshot.cjs')(p.locator('.experiment-layout'),path.join(out,`${name}-${engine}-${width}.webp`));}await p.setViewportSize({width:1100,height:900});}
 for(const row of rows){await p.goto(url+'/'+row.slug+'/');await p.waitForSelector('[data-assessment-ready]',{state:'attached'});
  if(row.slug==='gas-identification'){assert(await p.locator('#collectGas').isDisabled());await p.locator('#sample').selectOption('B');for(const id of ['weighBefore','collectGas','weighAfter','equalize','readGas'])await p.locator('#'+id).click();assert.match(await p.locator('#chemistryReadout').textContent(),/44.0 g\/mol/);await p.locator('#head').fill('15');assert.match(await p.locator('#chemistryReadout').textContent(),/아직 읽지/);await p.locator('#readGas').click();assert.match(await p.locator('#chemistryReadout').textContent(),/44.0 g\/mol/);}
  if(row.slug==='sugar-phase'){assert(await p.locator('#startTemperature').isDisabled());await p.locator('#molality').selectOption('0.6');await p.locator('#dissolveSugar').click();for(let i=0;i<8;i++)await p.locator('#stepTemperature').click();assert.match(await p.locator('#chemistryReadout').textContent(),/끓는 중/);await shot('sugar-boiling');await p.locator('#mode').selectOption('cool');assert.equal(await p.evaluate(()=>window.__chemistryLab.snapshot().state.time),0);assert.equal(await p.locator('#molality').inputValue(),'0.6');await p.locator('#dissolveSugar').click();for(let i=0;i<5;i++)await p.locator('#stepTemperature').click();assert.match(await p.locator('#chemistryReadout').textContent(),/얼기/);}
  if(row.slug==='hess-calorimetry'){assert(await p.locator('#neutralize').isDisabled());await p.locator('#dissolveNaOH').click();assert(await p.locator('#neutralize').isDisabled());await shot('hess-dissolved');await p.locator('#coolSolution').click();await p.locator('#neutralize').click();await p.locator('#directReaction').click();assert.match(await p.locator('#chemistryStatus').textContent(),/4.45 \+ 5.73 = 10.18/);}
  if(row.slug==='buffer-solution'){await p.locator('[data-measure=A]').click();await p.locator('[data-measure=D]').click();assert.match(await p.locator('#chemistryStatus').textContent(),/헹군 뒤/);assert.equal(await p.evaluate(()=>window.__chemistryLab.snapshot().state.well),'A');await p.locator('#addAcid').click();for(const well of ['B','E']){await p.locator('#rinseProbe').click();await p.locator('[data-measure='+well+']').click();}const s=await p.evaluate(()=>window.__chemistryLab.snapshot().state);assert(s.measured.B<3);assert(s.measured.E>6.8);assert.equal(s.measured.A,7);await p.locator('#addBase').click();await p.locator('#rinseProbe').click();await p.locator('[data-measure=F]').click();}
  if(row.slug==='salt-hydrolysis'){for(const well of ['NH4Cl','NaCN','NaCl']){await p.locator('#rinseProbe').click();await p.locator('[data-measure='+well+']').click();}const s=await p.evaluate(()=>window.__chemistryLab.snapshot().state);assert(s.measured.NH4Cl<7);assert(s.measured.NaCN>7);assert.equal(s.measured.NaCl,7);}
  if(row.slug==='bean-respiration'){for(const mode of ['sensors','respirometer','heat']){await p.locator('#mode').selectOption(mode);for(let i=0;i<5;i++)await p.locator('#stepBeans').click();assert(await p.locator('#stepBeans').isDisabled());await shot('beans-'+mode);}}
  await shot(row.slug);assert.equal(await p.locator('textarea,[data-export],[data-records]').count(),0);await p.locator('.quiz-section summary').click();const c=p.locator('.quiz-card').first(),q=row.questions[0];await c.locator('input[value='+'abc'[(q.answer+1)%3]+']').check();await c.locator('.answer-button').click();assert(await c.locator('.answer-explanation').isHidden());await c.locator('input[value='+'abc'[q.answer]+']').check();await c.locator('.answer-button').click();assert.match(await c.locator('.answer-result').textContent(),/처음 선택을 돌아보면/);
  await p.locator('#resetExperiment').click();assert.equal(await p.evaluate(()=>window.__chemistryLab.snapshot().running),false);
 }
 assert.deepEqual(errors,[]);
 }finally{await browser?.close();await new Promise(r=>s.close(r));}
});
