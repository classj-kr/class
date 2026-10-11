const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const M=require('../learning/inquiry/science-lab/inquiry-models.js'),rows=require('../scripts/science-inquiry-experiments.cjs');
test('heat transfer: approach ambient from either side, with volume and thickness controlled',()=>{
 for(const initial of [5,70])for(const minutes of [0,1,10,60]){
  const r=M.insulation({initial,minutes});for(const s of r)assert(s.temperature>=Math.min(initial,20)&&s.temperature<=Math.max(initial,20));
  if(minutes)assert(Math.abs(r[0].temperature-20)>Math.abs(r[1].temperature-20));else assert(r.every(s=>s.temperature===initial));
 }
 assert(M.insulation({minutes:10,volume:100})[0].temperature>M.insulation({minutes:10,volume:50})[0].temperature);
 assert(M.insulation({minutes:10,thickness:4})[0].temperature>M.insulation({minutes:10,thickness:2})[0].temperature);
});
test('moving source: wavelength times observed frequency remains the medium sound speed',()=>{
 for(const direction of ['toward','away','still'])for(const speed of [0,10,40])for(const frequency of [200,440,1000]){const r=M.doppler({direction,speed,frequency});assert(Math.abs(r.observed*r.wavelength-343)<1e-10);assert(Math.abs(r.observed*r.period-1)<1e-10);}
 assert(M.doppler().observed>440);assert(M.doppler({direction:'away'}).observed<440);
});
test('motion acceleration agrees with finite differences and sensor support',()=>{
 for(const time of [.5,1.5,3,7,10.5,11.5])for(const motion of ['circle','straight','elevator']){
  const dt=.00001,a=M.acceleration({motion,time:time-dt}),b=M.acceleration({motion,time:time+dt}),r=M.acceleration({motion,time});
  assert(Math.abs((b.vx-a.vx)/(2*dt)-r.ax)<1e-7);assert(Math.abs((b.vy-a.vy)/(2*dt)-(motion==='elevator'?r.az:r.ay))<1e-7);
  assert(Math.abs((b.x-a.x)/(2*dt)-r.vx)<1e-7);assert(Math.abs((b.y-a.y)/(2*dt)-r.vy)<1e-7);
 }
 assert.equal(M.acceleration({motion:'straight'}).sensor,9.8);assert(M.acceleration({motion:'elevator',time:11}).sensor<9.8);
 assert.equal(M.acceleration({motion:'elevator',time:12}).speed,0);
});
test('DNA construction preserves templates, antiparallel synthesis, primers and ligation order',()=>{
 let s=M.dnaStart();const original=s.template;s=M.dnaAction(s,'leading','A');assert(s.leading.every(x=>x===null));
 for(let block=0;block<3;block++){
  s=M.dnaAction(s,'open');const fork=s.fork;s=M.dnaAction(s,'open');assert.equal(s.fork,fork);s=M.dnaAction(s,'prime');
  const leadingRNA=s.leading.filter(x=>x?.rna).length;assert.equal(leadingRNA,2);assert.equal(s.lagging.filter(x=>x?.rna).length,(block+1)*2);
  for(const name of ['leading','lagging'])while(s[name].slice(0,s.fork).some(x=>!x)){
   const indices=Array.from({length:s.fork},(_,i)=>i);if(name==='lagging')indices.reverse();const i=indices.find(i=>!s[name][i]),base=name==='leading'?M.complement(s.template[i]):s.template[i];
   const wrong=M.dnaAction(s,name,base==='A'?'T':'A');assert.deepEqual(wrong[name],s[name]);s=M.dnaAction(s,name,base);
  }
 }
 assert.equal(s.template,original);s=M.dnaAction(s,'join');assert.equal(s.joined,false);s=M.dnaAction(s,'replace');s=M.dnaAction(s,'join');assert.equal(s.joined,true);
 assert.equal(s.leading.map(x=>x.base).join(''),M.complement(original));assert.equal(s.lagging.map(x=>x.base).join(''),original);
 assert(s.leading.concat(s.lagging).every(x=>!x.rna));
});
test('translation: reading frame, synonymous substitution, termination, cell-free exception',()=>{
 assert.equal(Object.keys(M.codons).length,64);assert.deepEqual(Object.keys(M.codons).filter(k=>M.codons[k]==='*').sort(),['UAA','UAG','UGA']);
 assert.deepEqual(M.translate('AUGUUUGGCUAA').protein,['M','F','G']);assert.deepEqual(M.translate('AUGUUCGGCUAA').protein,['M','F','G']);
 assert.deepEqual(M.translate('AUGUAAGGCUAA').protein,['M']);assert.deepEqual(M.translate('AUGCUUUGGCUAA').reads.map(r=>r.codon),['AUG','CUU','UGG','CUA']);
 assert.equal(M.translate('UUUUUU').reads.length,0);assert.deepEqual(M.translate('UUUUUU',Infinity,{cellFree:true}).protein,['F','F']);assert(M.translate('ATG').error);
});
test('pedigree: X inheritance and conditioning are independent of child order',()=>{
 const a=M.cross('Rr','RY');assert.equal(a.affected,.25);assert.equal(a.sonsAffected,.5);assert.equal(a.daughtersAffected,0);
 const b=M.cross('RR','rY');assert(b.children.filter(c=>c.male).every(c=>!c.affected));assert(b.children.filter(c=>!c.male).every(c=>c.carrier));
 assert.equal(M.cross('Rr','rY').affected,.5);assert(M.pedigreeCheck(Object.fromEntries(M.family.map(p=>[p.id,p.answer]))).every(r=>r.ok));
});
test('karyotype: all cards conserved when moving, X/Y pairing, extra autosome is retained',()=>{
 assert(M.karyotypeStart().cards.filter(c=>Number(c.id.slice(1))+1!==Number(c.kind)).length>18,'card label order must not reveal answers');
 for(const sample of ['XX','XY','trisomy']){let s=M.karyotypeStart(sample);const first=s.cards[0];s=M.placeChromosome(s,first.id,'X');s=M.placeChromosome(s,first.id,'1');assert.equal(Object.values(s.slots).flat().length,1);
  for(const c of s.cards)s=M.placeChromosome(s,c.id,c.kind==='Y'?'X':c.kind);const r=M.karyotypeCheck(s);assert(r.complete);assert.equal(r.total,sample==='trisomy'?47:46);assert.equal(s.slots['21'].length,sample==='trisomy'?2:1);
 }
});
test('disc assay: control stays zero, geometry detects overlap, preincubation shows no inhibition',()=>{
 for(const dose of [.5,1,2])for(const sampleSet of [0,1,2]){
  assert(M.antibiotic({time:0,dose,sampleSet}).discs.every(d=>d.width===0));
  const r=M.antibiotic({time:24,dose,sampleSet});assert.equal(r.discs[0].width,0);assert.equal(r.overlap,false);
  assert.equal(M.antibiotic({time:24,dose,spacing:'close',sampleSet}).overlap,true);
 }
});
async function serve(){const base=path.resolve(__dirname,'../learning/inquiry/science-lab'),s=http.createServer((req,res)=>{let f=path.resolve(base,'.'+new URL(req.url,'http://local').pathname);if(!f.startsWith(base+path.sep))return res.writeHead(403).end();if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');fs.readFile(f,(e,d)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',({'.js':'text/javascript','.html':'text/html; charset=utf-8','.css':'text/css'})[path.extname(f)]||'application/octet-stream');res.end(d);});});await new Promise(r=>s.listen(0,'127.0.0.1',r));return{s,url:'http://127.0.0.1:'+s.address().port};}
test('water waves: dispersion limits, bottom boundary and closed linear particle orbits',()=>{
 const deep=M.waterWave({length:20,depth:100}),shallow=M.waterWave({length:200,depth:1});assert(Math.abs(deep.speed-Math.sqrt(9.81*20/(2*Math.PI)))<1e-8);assert(Math.abs(shallow.speed-Math.sqrt(9.81))<.001);
 for(const depth of [1,10,100]){const a=M.waterWave({depth,time:.3}),b=M.waterWave({depth,time:.3+a.period});assert(Math.abs(a.dx-b.dx)<1e-10);assert(Math.abs(a.dy-b.dy)<1e-10);assert.equal(M.waterWave({depth,z:-depth}).ry,0);assert(Math.abs(a.speed*a.period-a.L)<1e-10);}
 assert(M.waterWave({length:100,depth:10}).type==='전이파');assert(M.waterWave({length:200,depth:1}).type==='천해파');
});
test('silver mirror: precipitation is distinct from metal reduction, with a water control',()=>{
 for(const sample of ['glucose','water']){let s=M.silverStart(sample);s=M.silverAction(s,'roll');assert.equal(s.turns,0);s=M.silverAction(s,'silver');s=M.silverAction(s,'ammonia');assert.equal(s.stage,2);assert.equal(s.turns,0);for(const a of ['ammonia','sample','base','roll'])s=M.silverAction(s,a);assert.equal(s.stage,5);assert.equal(s.turns,1);assert.match(s.message,sample==='glucose'?/은이 석출/:/관찰되지/);}
});
test('interfacial polymer model: alternating functional groups conserve chain ends and HCl',()=>{
 assert.equal(M.condensation(['amine','amine']).valid,false);for(let n=1;n<=8;n++){const c=Array.from({length:n},(_,i)=>i%2?'chloride':'amine'),r=M.condensation(c);assert.equal(r.bonds,n-1);assert.equal(r.hcl,n-1);assert.equal(r.amineEnds+r.chlorideEnds,2);}
 let s=M.nylonStart();s=M.nylonAction(s,'pull');assert.equal(s.pulled,0);s=M.nylonAction(s,'layer');s=M.nylonAction(s,'pull','steady');assert.equal(s.pulled,1);s=M.nylonAction(s,'pull','fast');assert(s.broken);assert.equal(s.film,0);s=M.nylonAction(s,'wait');assert.equal(s.film,1);assert.equal(s.broken,false);
});
for(const engine of ['chromium','webkit'])test(engine+': source-backed actions, wrong choices, reset, diagnosis and mobile',{timeout:240000},async()=>{
 const {s,url}=await serve();let browser;const out=path.resolve('docs/science-lab-audit-2026-10-11/inquiry-implementation');fs.mkdirSync(out,{recursive:true});
 try{browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});const p=await browser.newPage({viewport:{width:1100,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  const snapshot=()=>p.evaluate(()=>window.__inquiryLab.snapshot());
  async function shot(name){for(const width of [1100,390]){await p.setViewportSize({width,height:900});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,name+' overflow');await require('./science-screenshot.cjs')(p.locator('.experiment-layout'),path.join(out,`${name}-${engine}-${width}.webp`));}await p.setViewportSize({width:1100,height:900});}
  for(const row of rows){await p.goto(url+'/'+row.slug+'/');await p.waitForSelector('[data-assessment-ready]',{state:'attached'});
   if(row.slug==='water-wave-tank'){await p.locator('#depth').fill('1');await p.locator('#length').fill('100');assert.match(await p.locator('#inquiryReadout').textContent(),/천해파/);await p.locator('#playWave').click();assert((await snapshot()).running);await p.locator('#playWave').click();await p.locator('#time').fill('7');await shot('waves-shallow');await p.locator('#depth').fill('100');assert.match(await p.locator('#inquiryReadout').textContent(),/심해파/);}
   if(row.slug==='silver-mirror'){await p.locator('#rollVial').click();assert.equal((await snapshot()).state.silver.turns,0);for(const id of ['silverReagent','ammoniaReagent'])await p.locator('#'+id).click();await shot('silver-precipitate');for(const id of ['ammoniaReagent','testSample','baseReagent','rollVial','rollVial','rollVial','rollVial'])await p.locator('#'+id).click();assert.match(await p.locator('#inquiryReadout').textContent(),/은거울 형성/);await shot('silver-positive');await p.locator('#sample').selectOption('water');for(const id of ['silverReagent','ammoniaReagent','ammoniaReagent','testSample','baseReagent','rollVial'])await p.locator('#'+id).click();assert.match(await p.locator('#inquiryStatus').textContent(),/관찰되지/);}
   if(row.slug==='nylon-interface'){await p.locator('#makeLayers').click();await p.locator('#pullNylon').click();assert.equal((await snapshot()).state.nylon.pulled,1);await p.locator('#pullSpeed').selectOption('fast');await p.locator('#pullNylon').click();assert((await snapshot()).state.nylon.broken);await p.locator('#waitFilm').click();await p.locator('#addAmine').click();await p.locator('#addAmine').click();assert.equal((await snapshot()).state.chain.length,1);for(const id of ['addChloride','addAmine','addChloride','addAmine','addChloride'])await p.locator('#'+id).click();assert.match(await p.locator('#inquiryReadout').textContent(),/HCl5개/);}
   if(row.slug==='insulation-lab'){await p.locator('#time').fill('20');assert.match(await p.locator('#inquiryStatus').textContent(),/20분/);await shot('insulation-hot');await p.locator('#mode').selectOption('cold');assert.match(await p.locator('#inquiryReadout').textContent(),/℃/);}
   if(row.slug==='doppler-lab'){await p.locator('#speed').fill('40');assert.match(await p.locator('#inquiryReadout').textContent(),/498.1/);await shot('doppler-toward');await p.locator('#direction').selectOption('away');assert.match(await p.locator('#inquiryReadout').textContent(),/394.0/);}
   if(row.slug==='ride-acceleration'){await p.locator('#time').fill('3');await shot('circle');await p.locator('#motion').selectOption('elevator');await p.locator('#time').fill('11');assert.match(await p.locator('#inquiryReadout').textContent(),/7.80 m\/s²/);await p.locator('#play').click();assert((await snapshot()).running);await p.locator('#play').click();}
   if(row.slug==='dna-replication'){
    await p.locator('[data-base=A]').click();assert.equal((await snapshot()).state.dna.leading.filter(Boolean).length,0);
    for(let block=0;block<3;block++){await p.locator('#openFork').click();await p.locator('#primer').click();for(const strand of ['leading','lagging']){await p.locator('#strand').selectOption(strand);let d=(await snapshot()).state.dna;while(d[strand].slice(0,d.fork).some(v=>!v)){const indices=Array.from({length:d.fork},(_,i)=>i);if(strand==='lagging')indices.reverse();const i=indices.find(i=>!d[strand][i]),base=strand==='leading'?M.complement(d.template[i]):d.template[i];await p.locator('[data-base='+base+']').click();d=(await snapshot()).state.dna;}}if(block===1)await shot('dna-fragments');}
    await p.locator('#join').click();assert.equal((await snapshot()).state.dna.joined,false);await p.locator('#replace').click();await p.locator('#join').click();assert((await snapshot()).state.dna.joined);
   }
   if(row.slug==='protein-synthesis'){
    assert(await p.locator('#attach').isDisabled());await p.locator('#transcribe').click();await p.locator('#attach').click();assert.equal((await snapshot()).state.steps,0);
    for(const codon of ['AUG','UUU','GGC','UAA']){const anti=M.complement(codon.replaceAll('U','T')).replaceAll('T','U');await p.locator('#amino').selectOption(M.codons[codon]);if(M.codons[codon]!=='*')for(let i=0;i<3;i++)await p.locator('#anti'+i).selectOption(anti[i]);await p.locator('#attach').click();}
    assert.equal((await snapshot()).state.steps,4);assert(await p.locator('#attach').isDisabled());await shot('protein-release');await p.locator('#sequence').selectOption('insertion');assert.equal((await snapshot()).state.steps,0);await p.locator('#transcribe').click();
   }
   if(row.slug==='pedigree-lab'){await p.locator('[data-person="I-2"]').selectOption('RR');await p.locator('#checkFamily').click();assert.match(await p.locator('#familyFeedback').textContent(),/아들의 X/);for(const person of M.family)await p.locator('[data-person="'+person.id+'"]').selectOption(person.answer);await p.locator('#checkFamily').click();assert.match(await p.locator('#inquiryStatus').textContent(),/7명 중 7명/);await p.locator('#father').selectOption('rY');assert.match(await p.locator('#inquiryReadout').textContent(),/50%/);}
   if(row.slug==='karyotype-lab'){await p.locator('#sample').selectOption('trisomy');for(const c of (await snapshot()).state.karyo.cards){await p.locator('[data-card='+c.id+']').click();await p.locator('[data-slot="'+(c.kind==='Y'?'X':c.kind)+'"]').click();}await p.locator('#checkPairs').click();assert.match(await p.locator('#inquiryStatus').textContent(),/전체 47개/);}
   if(row.slug==='antibiotic-disc'){assert(await p.locator('#measure').isDisabled());await p.locator('#incubate').click();await p.locator('#disc').selectOption('2');await p.locator('#ruler').fill('5');await p.locator('#measure').click();assert.match(await p.locator('#inquiryStatus').textContent(),/5.0 mm/);await shot('disc-separated');await p.locator('#spacing').selectOption('close');assert.equal((await snapshot()).state.time,0);await p.locator('#incubate').click();assert(await p.locator('#measure').isDisabled());assert.match(await p.locator('#inquiryStatus').textContent(),/겹쳤/);}
   await shot(row.slug);assert.equal(await p.locator('textarea,[data-export],[data-records]').count(),0);
   await p.locator('.quiz-section summary').click();const c=p.locator('.quiz-card').first(),q=row.questions[0];await c.locator('input[value='+'abcd'[(q.answer+1)%4]+']').check();await c.locator('.answer-button').click();assert(await c.locator('.answer-explanation').isHidden());await c.locator('input[value='+'abcd'[q.answer]+']').check();await c.locator('.answer-button').click();assert.match(await c.locator('.answer-result').textContent(),/처음 선택을 돌아보면/);
   await p.locator('#resetExperiment').click();assert.equal((await snapshot()).running,false);
  }
  assert.deepEqual(errors,[]);
 }finally{await browser?.close();await new Promise(r=>s.close(r));}
});
