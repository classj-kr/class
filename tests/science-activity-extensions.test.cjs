const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const ext=require('../learning/inquiry/science-lab/activity-comparison.js'),registry=require('../scripts/science-activity-tools.cjs'),shot=require('./science-screenshot.cjs');
const near=(a,b,tol=1e-7)=>assert(Math.abs(a-b)<tol,`${a} != ${b}`);
test('data parsing rejects missing cells; regression retains known slope and intercept',()=>{
 assert.throws(()=>ext.parseTable('1,,3\n2,3,4',3));assert.throws(()=>ext.parseTable('1,bad\n2,3'));assert.throws(()=>ext.parseTable('1,2\n1,3').length&&ext.regression([[1,2],[1,3]]));
 const r=ext.regression(ext.parseTable('시간,온도\n0,2\n1,5\n2,8'));near(r.slope,3);near(r.intercept,2);near(r.r2,1);
});
test('independent physical limiting cases and analytical results',()=>{
 const run=(id,patch={})=>ext.specs[id].run({...ext.defaults(id),...patch});
 near(run('gas-identity',{temperature:25,pressure:101.325,vapor:0,head:0,volume:100,mass:44*101.325*.1/(8.314462618*298.15)}).M,44);
 near(run('buffer',{added:0}).pure,7);assert(run('buffer',{added:0.1}).pure>run('buffer',{added:0.1}).pH);assert(run('buffer',{added:-0.1}).pure<run('buffer',{added:-0.1}).pH);
 const deep=run('water-waves',{depth:100,length:10});near(deep.speed,Math.sqrt(9.81*10/(2*Math.PI)),1e-6);
 const hz=run('habitable-zone',{temperature:5772,radius:1});near(hz.L,1);near(hz.inner,Math.sqrt(1/1.1));
 near(run('cluster-distance',{data:'0,1,6\n1,2,7',extinction:0}).distance,100);
 const solar=run('sunspots',{days:4,longitude:360*4/27});near(solar.syn,27);assert(solar.sid<solar.syn);
 const noPower=run('wireless',{supply:'dc'});assert.match(noPower.summary,/0 V/);
});
test('standard genetic code and biological model boundary cases',()=>{
 assert.equal(Object.keys(ext.codons).length,64);assert.equal(Object.values(ext.codons).filter(x=>x==='*').length,3);
 const run=(id,patch)=>ext.specs[id].run({...ext.defaults(id),...patch});
 assert.equal(run('translation',{sequence:'AUGGCUUUUUAA',step:20}).peptide,'MAF');assert(run('translation',{sequence:'AUGGCUUUUUAA',step:20}).stopped);
 assert.equal(run('translation',{sequence:'CCCGGG',step:20}).peptide,'');assert.throws(()=>run('translation',{sequence:'ATG'}));
 assert.equal((run('dna-replication',{progress:0}).svg.match(/fill="#f0c58e"/g)||[]).length,0);
 assert.equal((run('dna-replication',{progress:24}).svg.match(/fill="#f0c58e"/g)||[]).length,24);
});
test('new source-based analysis has correct units, limits and incomplete-work behavior',()=>{
 const run=(id,patch={})=>ext.specs[id].run({...ext.defaults(id),...patch});
 near(run('doppler',{speed:0,frequency:600}).expected,600);
 assert(run('doppler',{speed:10}).expected>600);assert(run('doppler',{speed:-10}).expected<600);
 near(run('salt-ph',{salt:'neutral'}).pH,7);
 near(run('salt-ph',{salt:'acetate',pk:4.75,concentration:.1}).pH,8.875,.002);
 near(run('salt-ph',{salt:'ammonium',pk:4.75,concentration:.1}).pH,5.125,.002);
 near(run('centrifuge',{rpm:0}).g,0);near(run('centrifuge',{massA:5,massB:5}).imbalance,0);
 near(run('centrifuge',{rpm:2000}).g,4*run('centrifuge',{rpm:1000}).g);
 near(run('fuel-energy').hydrogenPerGram,142.9);
 near(run('mass-luminosity',{data:'1,4.83\n10,-5.17'}).slope,4);
 near(run('cepheid-distance',{period:10,slope:-3,intercept:-1,apparent:1,extinction:0}).distance,100);
 near(run('calorimetry-balance').intake,1950);near(run('calorimetry-balance').expenditure,2000);
 assert.equal((run('pedigree',{mother:'affected',father:'affected'}).svg.match(/fill="#b788ba"/g)||[]).length,6);
 assert.match(run('nylon-interface',{phase:'separate'}).summary,/서로 다른 비커/);
 assert(!run('nylon-interface',{phase:'separate'}).svg.includes('stroke="#d29656"'));
 assert(run('nylon-interface',{phase:'contact'}).svg.includes('stroke="#d29656"'));
 for(const [id,spec]of Object.entries(ext.specs).filter(([,s])=>s.kind==='workbook')){
  assert.equal(run(id).recordable,false,id);const state=Object.fromEntries(spec.controls.map(c=>[c.key,'기록 검사용 내용']));assert.equal(run(id,state).recordable,true,id);
 }
});
test('chromosome pairing distinguishes homologues, duplicate cards and sex chromosome composition',()=>{
 const solution='NEJQBUHODSLGWAVMRITCPKF'.split(''),state={...ext.defaults('karyotype'),...Object.fromEntries(solution.map((a,i)=>['pair'+i,a]))};
 const a=ext.specs.karyotype.run(state),b=ext.specs.karyotype.run({...state,sample:'II'});
 assert.equal(a.complete,true);assert.equal(b.complete,true);assert.equal(a.correct,23);assert.equal(a.chromosomes,46);assert.equal(a.chromatids,92);
 assert.match(a.summary,/XX/);assert.match(b.summary,/XY/);assert.notEqual(a.svg,b.svg);
 assert.equal(ext.specs.karyotype.run({...state,pair1:'N'}).complete,false);
 assert.deepEqual(ext.specs.karyotype.run({...state,pair1:'N'}).duplicate,['N']);
 assert.equal(ext.specs.karyotype.run({...state,pair0:'E',pair1:'N'}).correct,21);
 assert.equal(ext.validate('karyotype',{pair0:'<script>'}).pair0,'');
});
test('planet groups follow the learner criterion, including the exact boundary and invalid data',()=>{
 const run=p=>ext.specs['planet-classification'].run({...ext.defaults('planet-classification'),...p});
 assert.deepEqual(run({}).groups,[['수성','금성','지구','화성'],['목성','토성','천왕성','해왕성']]);
 assert.deepEqual(run({criterion:'ring'}).groups,run({}).groups);
 assert.deepEqual(run({threshold:.5}).groups[0],['수성']);
 assert.throws(()=>run({data:'지구,,없음\n화성,0.5,없음'}));
 assert.throws(()=>run({data:'지구,1,없음\n지구,1,있음'}));
 assert.throws(()=>run({data:'지구,1,예\n화성,0.5,아니오'}));
});
test('three-axis acceleration uses vector magnitude and time weighting without guessing invalid intervals',()=>{
 const run=p=>ext.specs['ride-acceleration'].run({...ext.defaults('ride-acceleration'),...p});
 near(run({data:'0,0,0,0\n1,0,0,4\n4,0,0,4'}).mean,3.5);
 near(run({data:'0,3,4,0\n4,3,4,0',axis:'magnitude'}).mean,5);
 near(run({data:'0,3,4,0\n4,3,4,0',axis:'z'}).mean,0);
 assert.equal(run({start:1,end:3}).count,3);
 assert.throws(()=>run({start:4,end:0}),/시작 시각/);
 assert.throws(()=>run({start:10,end:11}),/두 개 이상/);
 assert.throws(()=>run({data:'0,1,2,3\n0,4,5,6'}),/중복 없이/);
 assert.throws(()=>run({data:'1,1,2,3\n0,4,5,6'}),/증가/);
 assert.match(run({sensor:'raw'}).note,/알짜힘으로 해석하지/);
});
test('every activity model supports declared numeric endpoints without non-finite output',()=>{
 for(const [id,spec]of Object.entries(ext.specs)){
  const states=[ext.defaults(id)];for(const c of spec.controls){if(c.type==='number'&&!(id==='ride-acceleration'&&['start','end'].includes(c.key)))for(const value of [c.min,c.max])states.push({...ext.defaults(id),[c.key]:value});if(c.type==='select')for(const [value]of c.options)states.push({...ext.defaults(id),[c.key]:value});}
  for(const state of states){const r=spec.run(state);assert.equal(typeof r.summary,'string',id);assert(!/NaN|Infinity|undefined/.test(r.svg),id);}
 }
 for(const entry of Object.values(registry))assert(['periodic','pasteur','prism'].includes(entry.tool)||ext.specs[entry.tool],entry.tool);
});
for(const engine of ['chromium','webkit'])test(engine+': internal draft-model harness, edit, persist and invalid data',{timeout:180000},async()=>{
 const root=path.resolve('learning/inquiry/science-lab'),out=path.resolve(process.env.SCIENCE_TEST_ARTIFACTS||'tmp/science-activity-extensions');fs.mkdirSync(out,{recursive:true});
 const server=http.createServer((req,res)=>{let p=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!p.startsWith(root+path.sep))return res.writeHead(403).end();fs.readFile(p.endsWith("__model-harness.html")?path.join(__dirname,"fixtures/activity-model-harness.html"):p,(e,b)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',p.endsWith('.html')?'text/html; charset=utf-8':p.endsWith('.js')?'text/javascript':'text/css');res.end(b);});});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});const page=await browser.newPage({viewport:{width:1024,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 for(const [id,entry]of Object.entries(registry).filter(([,r])=>ext.specs[r.tool])){
  await page.goto(`http://127.0.0.1:${server.address().port}/__model-harness.html?activity=${encodeURIComponent(id)}`);await page.waitForSelector('#observation');assert(await page.locator('#scene svg').count(),id);
  if(ext.specs[entry.tool].kind==='workbook'){assert(await page.locator('#record').isDisabled());for(const c of ext.specs[entry.tool].controls)await page.locator('[data-control="'+c.key+'"]').fill('입력·저장 검사용 자료: '+c.label);assert(!(await page.locator('#record').isDisabled()));}
  if(entry.tool==='karyotype'){
   const answer='NEJQBUHODSLGWAVMRITCPKF'.split('');
   for(const [i,a]of answer.entries())await page.locator('[data-control="pair'+i+'"]').selectOption(a);
   assert.match(await page.locator('#observation').textContent(),/총 46개/);
   await page.locator('[data-control="sample"]').selectOption('II');assert.match(await page.locator('#observation').textContent(),/XY/);
   assert.equal(await page.locator('[data-control-figure] svg').count(),23);
  }
  if(entry.tool==='planet-classification'){
   await page.locator('[data-control="threshold"]').fill('.5');assert.match(await page.locator('#observation').textContent(),/A 1개, B 7개/);
  }
  if(entry.tool==='ride-acceleration'){
   await page.locator('[data-control="start"]').fill('12');assert(await page.locator('#record').isDisabled());
   await page.locator('[data-control="start"]').fill('1');assert(!(await page.locator('#record').isDisabled()));
  }
  await page.locator('#record').click();assert.equal(await page.locator('#records tbody tr').count(),1);await page.locator('#save').click();await page.reload();assert.equal(await page.locator('#records tbody tr').count(),1);
  if(entry.tool==='karyotype')assert.match(await page.locator('#observation').textContent(),/XY/);
  for(const width of [390,1024]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,id+' overflow');await shot(page.locator('#workbench'),path.join(out,`${entry.tool}-${engine}-${width}.webp`));}
  await shot(page.locator('#scene'),path.join(out,`${entry.tool}-${engine}-scene.webp`));
  if(entry.tool==='climate'){await page.locator('[data-control="data"]').fill('1,,2\n2,3');assert(await page.locator('#record').isDisabled());await page.locator('[data-control="data"]').fill('0,2\n1,5\n2,8');assert.match(await page.locator('#observation').textContent(),/기울기 3/);assert(!(await page.locator('#record').isDisabled()));}
 }assert.deepEqual(errors,[]);
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
});
