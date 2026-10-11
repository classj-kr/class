const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),http=require('node:http');
const M=require('../learning/inquiry/science-lab/physics-models.js'),rows=require('../scripts/science-physics-experiments.cjs');
test('magnetic braking: Newton limit, terminal velocity, ground and force direction',()=>{
 assert(Math.abs(M.fall(.2).y-.1962)<1e-10);assert.equal(M.fall(2).y,1);assert.equal(M.fall(2).v,0);
 const v=M.fall(1,{height:100,gamma:12}).v;assert(Math.abs(v-9.81/12)<.00001);
 assert(M.fallTime(1,12)>M.fallTime(1,0));assert(Math.abs(M.fallTime(1,0)-Math.sqrt(2/9.81))<1e-10);
});
test('speaker, induction and amplification: missing connections, DC, orientation and finite power',()=>{
 const s={magnet:true,stripped:true,connected:true,playing:true,turns:30,frequency:220};assert(M.speaker(s,Math.PI/2).force>0);assert(M.speaker(s,3*Math.PI/2).force<0);
 for(const key of ['magnet','stripped','connected','playing'])assert.equal(M.speaker({...s,[key]:false}).peak,0);
 const w={power:true,signal:'ac',distance:1,angle:0};assert(M.wireless(w).peak>1.8);assert(M.wireless({...w,angle:90}).peak<1e-12);assert.equal(M.wireless({...w,signal:'dc'}).peak,0);assert(M.wireless({...w,distance:8}).peak<M.wireless(w).peak);
 const a={mode:'amplified',power:true,supply:3,amplitude:.4};assert.equal(M.amplifier(a,Math.PI/2).output,-1.3);assert.equal(M.amplifier({...a,power:false},Math.PI/2).output,0);assert.equal(M.amplifier({...a,mode:'direct'},Math.PI/2).output,.4);
});
test('optical boundaries: reflection phase, Malus law and indistinguishable states',()=>{
 assert.equal(M.filmIntensity(0,530),0);assert(Math.abs(M.filmIntensity(530/(4*1.33),530)-1)<1e-12);assert(M.filmIntensity(530/(2*1.33),530)<1e-20);
 assert(M.filmThickness(1,0)>M.filmThickness(0,0));assert(M.filmThickness(.5,20)<M.filmThickness(.5,0));
 assert(Math.abs(M.polarization('A',60,true)-25)<1e-10);assert(M.polarization('A',90,true)<1e-20);
 for(let a=0;a<=180;a+=5){assert.equal(M.polarization('C',a,true),50);assert.equal(M.polarization('D',a,true),50);assert.equal(M.polarization('A',a,false),100);}
});
test('electron interference: nodes, loss of cross term and stable event accumulation',()=>{
 assert(M.electronDensity(.25,{spacing:2})<1e-25);assert(M.electronDensity(.25,{spacing:2,pathKnown:true})>.9);
 const rng=M.random(123),points=Array.from({length:5000},()=>M.electronHit(rng,{spacing:2}));assert(points.every(p=>p.x>=-5&&p.x<=5&&p.y>=0&&p.y<=1));
 const center=points.filter(p=>Math.abs(p.x)<.035).length,node=points.filter(p=>Math.abs(p.x-.25)<.035).length;assert(center>node*8);
 const a=M.random(99),b=M.random(99);for(let i=0;i<30;i++)assert.deepEqual(M.electronHit(a,{}),M.electronHit(b,{}));
});
async function server(){const base=path.resolve(__dirname,'../learning/inquiry/science-lab'),s=http.createServer((req,res)=>{let file=path.resolve(base,'.'+new URL(req.url,'http://local').pathname);if(!file.startsWith(base+path.sep))return res.writeHead(403).end();if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');fs.readFile(file,(err,data)=>{if(err)return res.writeHead(404).end();res.setHeader('Content-Type',({'.js':'text/javascript','.html':'text/html; charset=utf-8','.css':'text/css'})[path.extname(file)]||'application/octet-stream');res.end(data);});});await new Promise(r=>s.listen(0,'127.0.0.1',r));return{s,url:'http://127.0.0.1:'+s.address().port};}
for(const engine of ['chromium','webkit'])test(engine+': apparatus operations, clearing, mobile and diagnostics',{timeout:180000},async()=>{
 const {s,url}=await server();let browser;const out=path.resolve(process.env.SCIENCE_PHYSICS_CAPTURE_DIR||'docs/science-lab-audit-2026-10-11/physics-implementation');fs.mkdirSync(out,{recursive:true});
 try{browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});const page=await browser.newPage({viewport:{width:1100,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 const shot=async name=>{for(const width of [1100,390]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);await require('./science-screenshot.cjs')(page.locator('.experiment-layout'),path.join(out,`${name}-${engine}-${width}.webp`));}await page.setViewportSize({width:1100,height:900});};
 for(const row of rows){await page.goto(url+'/'+row.slug+'/');await page.waitForSelector('[data-assessment-ready]',{state:'attached'});
  if(row.slug==='speaker-lab'){await page.locator('#playSignal').click();assert.match(await page.locator('#physicsReadout').textContent(),/정지/);for(const id of ['magnet','stripped','connected'])await page.locator('#'+id).click();assert.match(await page.locator('#physicsReadout').textContent(),/왕복/);await page.locator('#frequency').fill('880');assert.match(await page.locator('#physicsReadout').textContent(),/880 Hz/);}
  if(row.slug==='wireless-power'){await page.locator('#power').click();assert.match(await page.locator('#physicsReadout').textContent(),/켜짐/);await page.locator('#signal').selectOption('dc');assert.match(await page.locator('#physicsReadout').textContent(),/0.000 V/);await page.locator('#signal').selectOption('ac');await page.locator('#angle').fill('90');assert.match(await page.locator('#physicsReadout').textContent(),/0.000 V/);await page.locator('#angle').fill('0');}
  if(row.slug==='magnetic-brake'){await page.locator('#drop').click();await page.waitForFunction(()=>document.querySelector('#physicsReadout').textContent.includes('1.31 s'));assert.match(await page.locator('#physicsReadout').textContent(),/0.45 s/);await page.locator('#plate').selectOption('insulator');assert.equal(await page.evaluate(()=>window.__physicsLab.snapshot().elapsed),0);await page.locator('#drop').click();await page.waitForFunction(()=>document.querySelector('#physicsStatus').textContent.includes('도착했습니다'));}
  if(row.slug==='transistor-speaker'){await page.locator('#mode').selectOption('amplified');await page.locator('#playSignal').click();assert.match(await page.locator('#physicsStatus').textContent(),/전원/);await page.locator('#power').click();await page.locator('#amplitude').fill('0.4');assert.match(await page.locator('#physicsReadout').textContent(),/잘림/);}
  if(row.slug==='soap-film'){assert(await page.locator('#stepFilm').isDisabled());await page.locator('#dip').click();await page.locator('#stepFilm').click();await page.locator('#light').selectOption('green');assert.match(await page.locator('#physicsReadout').textContent(),/5.0 s/);}
  if(row.slug==='polarization'){await page.locator('#filter').click();await page.locator('#angle').fill('90');assert.match(await page.locator('#physicsReadout').textContent(),/0.0/);await page.locator('#source').selectOption('C');assert.match(await page.locator('#physicsReadout').textContent(),/50.0/);}
  if(row.slug==='electron-slits'){await page.locator('#singleElectron').click();const first=await page.evaluate(()=>window.__physicsLab.snapshot().hits[0]);await page.locator('#manyElectrons').click();assert.equal(await page.evaluate(()=>window.__physicsLab.snapshot().hits.length),101);assert.deepEqual(await page.evaluate(()=>window.__physicsLab.snapshot().hits[0]),first);await page.locator('#pathKnown').selectOption('true');assert.equal(await page.evaluate(()=>window.__physicsLab.snapshot().hits.length),0);for(let i=0;i<10;i++)await page.locator('#manyElectrons').click();}
  await shot(row.slug);assert.equal(await page.locator('textarea,[data-export],[data-records]').count(),0);
  await page.locator('.quiz-section summary').click();const c=page.locator('.quiz-card').first(),q=row.questions[0];await c.locator('input[value='+'abc'[(q.answer+1)%3]+']').check();await c.locator('.answer-button').click();assert.equal(await c.locator('.answer-result').textContent(),'다시 생각하고 다른 답을 골라보세요.');assert(await c.locator('.answer-explanation').isHidden());await c.locator('input[value='+'abc'[q.answer]+']').check();await c.locator('.answer-button').click();assert.match(await c.locator('.answer-result').textContent(),/처음 선택을 돌아보면/);await page.reload();await page.waitForSelector('[data-assessment-ready]',{state:'attached'});assert.equal(await page.locator('.quiz-section').evaluate(e=>e.scienceAssessment.store.summary().corrected),1);
  await page.locator('#resetExperiment').click();assert.equal(await page.evaluate(()=>window.__physicsLab.snapshot().running),false);
 }
 assert.deepEqual(errors,[]);
 }finally{await browser?.close();await new Promise(r=>s.close(r));}
});
