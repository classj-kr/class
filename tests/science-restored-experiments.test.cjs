const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const base=path.resolve(__dirname,'../learning/inquiry/science-lab'),out=process.env.SCIENCE_RESTORED_CAPTURE_DIR||path.resolve(__dirname,'../docs/science-lab-audit-2026-10-11/restored-experiments');
const pasteur=require(path.join(base,'pasteur/model.js')),prism=require(path.join(base,'newton-prism/model.js')),infection=require(path.join(base,'infection-prevention/model.js'));
const registry=require('../scripts/science-restored-experiments.cjs');
const elements=require(path.join(base,'mendeleev/model.js'));
const arrangement=['Na','L','M','Si','A','D','Cl','K','Q',null,null,'E','G','Br','Rb','R','T','X','Z','J','I'];
test('Mendeleev: textbook 19-card set, mass order and chemical grouping are independent constraints',()=>{
 assert.equal(elements.cards.length,19);assert.equal(new Set(elements.cards.map(c=>c.id)).size,19);
 assert.deepEqual(elements.cards.find(c=>c.id==='X').compounds,['XO₂','XH₄']);
 assert.equal(elements.evaluate(arrangement).complete,true);assert.deepEqual(elements.evaluate(arrangement).empty,[9,10]);
 const swapped=elements.place(arrangement,'Na',1);assert.equal(swapped[0],'L');assert.equal(swapped[1],'Na');assert.equal(elements.evaluate(swapped).complete,false);assert(elements.evaluate(swapped).familyConflicts.length);
 const vertical=elements.place(arrangement,'Na',7);assert.equal(elements.evaluate(vertical).familyConflicts.length,0);assert(elements.evaluate(vertical).orderConflicts.length>0);
 const partial=Array(21).fill(null);partial[0]='Na';assert.equal(elements.evaluate(partial).complete,false);
 const duplicate=arrangement.slice();duplicate[9]='Na';assert.throws(()=>elements.evaluate(duplicate),/duplicated/);
});
test('Pasteur: air alone does not cause growth; heating, dust contact and existing contamination remain distinct',()=>{
 for(const heated of [false,true])for(const neck of ['swan','cut','tilt','sealed']){
  assert.equal(pasteur.result({heated,neck,stage:0}).growth,false,'visible growth needs time');
  const r=pasteur.result({heated,neck,stage:1});assert.equal(r.growth,!heated||['cut','tilt'].includes(neck));assert.equal(r.air,neck!=='sealed');
 }
 assert.equal(pasteur.result({heated:true,neck:'swan',stage:1}).air,true);
 assert.equal(pasteur.result({heated:false,neck:'sealed',stage:1}).growth,true);
});
test('Prism: independent Snell and triangle-boundary checks; single colors persist and only overlap gives white',()=>{
 const angle=(x,y)=>Math.atan2(y,x);let previous=0;
 for(let i=0;i<7;i++){
  const p=prism.ray(i);assert(Math.abs(p.entry.x-(230-(p.entry.y-90)*38/134))<1e-8);assert(Math.abs(p.exit.x-(230+(p.exit.y-90)*40/134))<1e-8);
  const inside=angle(p.exit.x-p.entry.x,p.exit.y-p.entry.y),leftNormal=Math.atan(38/134),rightNormal=-Math.atan(40/134);
  assert(Math.abs(Math.sin(leftNormal)-p.n*Math.sin(leftNormal-inside))<1e-9);
  assert(Math.abs(p.n*Math.sin(inside-rightNormal)-Math.sin(p.angle-rightNormal))<1e-9);
  assert(p.angle>previous);previous=p.angle;assert(p.at(660)>150&&p.at(660)<338);
  assert.deepEqual(prism.result({mode:'single',color:i}).colors,[i]);assert.equal(prism.result({mode:'single',color:i}).white,false);
 }
 for(const screen of [40,45,69,70,71,100]){assert.equal(prism.result({mode:'combine',screen}).white,screen===70);assert.equal(prism.result({mode:'combine',screen,light:false}).white,false);}
 assert.deepEqual(prism.result({source:'rgb'}).colors,[0,3,4]);
 assert.deepEqual(prism.result({source:'rgb',mode:'single',color:6}).colors,[],'a slit cannot create a missing source color');
 for(const collector of ['glass','lens','cup'])for(const source of ['incandescent','rgb']){
  const focus=prism.collectors[collector].focus;
  assert.equal(prism.result({mode:'combine',collector,source,screen:focus}).white,true);
  assert.equal(prism.result({mode:'combine',collector,source,screen:focus+10}).white,false);
  assert.equal(prism.result({mode:'combine',collector,source,screen:focus,light:false}).colors.length,0);
 }
});
test('fixed-path prism comparison keeps incidence equal and separates red/blue by refraction',()=>{
 const red=prism.fixedRay(0),blue=prism.fixedRay(4);
 assert.deepEqual(red.entry,blue.entry);assert(blue.n>red.n);assert(blue.angle>red.angle);assert(blue.screenY>red.screenY);
 for(const color of [0,4]){const first=prism.fixedFirstRay(color);assert(Math.abs(first.angle-155)<1e-9);assert.equal(first.exit[1],194);assert(first.at(136)>215.5&&first.at(136)<223.5);assert(first.entry[0]<first.exit[0]);}
 for(const color of [0,4]){const r=prism.result({mode:'fixed',color});assert.deepEqual(r.colors,[color]);assert.equal(r.white,false);assert.equal(r.fixed.screenY,prism.fixedRay(color).screenY);assert.deepEqual(prism.result({mode:'fixed',color,light:false}).colors,[]);}
 const variant=registry.find(r=>r.slug==='newton-prism').procedures.find(p=>p[0]==='fixed');assert.deepEqual(variant.slice(2),[[46],'764c91a83f8bf462']);
});
test('Contact and fluorescence: no spontaneous label, no same-round chain, no diagnostic numeric result',()=>{
 assert.deepEqual(infection.contact([0],[[2,3]]),[0]);assert.deepEqual(infection.contact([0],[[0,1],[1,2]]),[0,1]);assert.deepEqual(infection.contact([0,1],[[1,2]]),[0,1,2]);
 const n=o=>infection.lotion({applied:true,uv:true,...o});assert.equal(n({uv:false}),0);assert(n({washed:true,soap:true})<n({washed:true,soap:false}));assert(n({washed:true,soap:false})<n({washed:false}));
 const close=infection.droplets(50).filter(d=>d.hit).length,far=infection.droplets(300).filter(d=>d.hit).length;assert(close>far);assert.deepEqual(infection.droplets(100),infection.droplets(100),'distance trials reuse identical spray conditions');
});
async function server(){const s=http.createServer((req,res)=>{let file=path.resolve(base,'.'+new URL(req.url,'http://localhost').pathname);if(file!==base&&!file.startsWith(base+path.sep))return res.writeHead(403).end();if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');fs.readFile(file,(err,data)=>{if(err)return res.writeHead(404).end();res.setHeader('Content-Type',{'.js':'text/javascript','.css':'text/css','.html':'text/html; charset=utf-8'}[path.extname(file)]||'application/octet-stream');res.end(data);});});await new Promise(r=>s.listen(0,'127.0.0.1',r));return {s,url:'http://127.0.0.1:'+s.address().port};}
for(const engine of ['chromium','webkit'])test(engine+': source-specific controls, full question flow and mobile scenes',{timeout:420000},async()=>{
 const {s,url}=await server();let browser;fs.mkdirSync(out,{recursive:true});
 try{
  browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});const page=await browser.newPage({viewport:{width:1100,height:850}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  async function shot(name){for(const width of [1100,390]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,name);await require('./science-screenshot.cjs')(page.locator('.experiment-layout:visible'),path.join(out,`${name}-${engine}-${width}.webp`));}await page.setViewportSize({width:1100,height:850});}
  await page.goto(url+'/pasteur/');await page.locator('#heat').click();await page.locator('#observe').click();assert.match(await page.locator('#observationA').textContent(),/맑게/);assert.match(await page.locator('#observationB').textContent(),/맑게/);await shot('pasteur-intact');
  for(const neck of ['cut','tilt','sealed']){await page.locator('[data-neck='+neck+']').click();assert.match(await page.locator('#observationB').textContent(),/아직/);await page.locator('#observe').click();assert.match(await page.locator('#observationA').textContent(),/맑게/);assert.match(await page.locator('#observationB').textContent(),neck==='sealed'?/맑게/:/증식/);await shot('pasteur-'+neck);}
  await page.locator('#resetExperiment').click();await page.locator('[data-neck=sealed]').click();await page.locator('#observe').click();assert.match(await page.locator('#observationB').textContent(),/증식/);
  await page.goto(url+'/newton-prism/');await page.locator('#lamp').click();assert.match(await page.locator('#observation').textContent(),/여러 색/);await shot('prism-dispersion');await page.locator('[data-mode=single]').click();for(const [i,[name]] of prism.colors.entries()){await page.locator('#selectedColor').selectOption(String(i));assert.match(await page.locator('#observation').textContent(),new RegExp(name+' 빛'));}await shot('prism-single');await page.locator('[data-mode=combine]').click();assert.match(await page.locator('#observation').textContent(),/아직/);await page.locator('#screenPosition').fill('70');assert.match(await page.locator('#observation').textContent(),/백색광/);await shot('prism-combine');await page.locator('#screenPosition').fill('90');assert.match(await page.locator('#observation').textContent(),/아직/);await page.locator('#lamp').click();assert.match(await page.locator('#observation').textContent(),/켜서/);
  await page.locator('#lamp').click();await page.locator('[data-mode=dispersion]').click();await page.locator('#lightSource').selectOption('rgb');assert.match(await page.locator('#observation').textContent(),/세 색의 띠/);await shot('prism-rgb');
  await page.locator('[data-mode=single]').click();assert.equal(await page.locator('#selectedColor').inputValue(),'0');assert.equal(await page.locator('#selectedColor option[value="6"]').evaluate(o=>o.disabled),true);
  for(const c of [0,3,4]){await page.locator('#selectedColor').selectOption(String(c));assert.match(await page.locator('#observation').textContent(),new RegExp(prism.colors[c][0]+' 빛'));}
  await page.locator('[data-mode=fixed]').click();
  const fixed=[];
  for(const color of [0,4]){await page.locator('#selectedColor').selectOption(String(color));fixed.push(await page.evaluate(()=>({prism:document.querySelector('[data-fixed-prism]').outerHTML,slits:[...document.querySelectorAll('[data-fixed-slit]')].map(e=>e.outerHTML),rotation:document.querySelector('[data-first-prism]').getAttribute('transform'),screen:Number(document.getElementById('screenSwatch').dataset.screenY)})));assert.match(await page.locator('#observation').textContent(),/같은 경로/);await shot('prism-fixed-'+color);}
  assert.equal(fixed[0].prism,fixed[1].prism);assert.deepEqual(fixed[0].slits,fixed[1].slits);assert.notEqual(fixed[0].rotation,fixed[1].rotation);assert(fixed[1].screen>fixed[0].screen);
  await page.locator('[data-mode=combine]').click();
  for(const source of ['incandescent','rgb'])for(const collector of ['glass','lens','cup']){
   await page.locator('#lightSource').selectOption(source);await page.locator('#collector').selectOption(collector);const focus=prism.collectors[collector].focus;
   assert.equal(await page.locator('#opticsScene [data-collector]').getAttribute('data-collector'),collector);
   await page.locator('#screenPosition').fill(String(focus-10));assert.match(await page.locator('#observation').textContent(),/아직/);await page.locator('#screenPosition').fill(String(focus));assert.match(await page.locator('#observation').textContent(),/백색광/);await shot('prism-'+source+'-'+collector);
  }
  await page.locator('#resetExperiment').click();assert.equal(await page.locator('#lightSource').inputValue(),'incandescent');assert.equal(await page.locator('#collector').inputValue(),'glass');assert.equal(await page.locator('#screenSwatch span').count(),0);
  await page.goto(url+'/infection-prevention/');await page.locator('#spray').click();assert(await page.locator('#spray').isDisabled());await shot('infection-spray');await page.locator('#distance').fill('300');assert(!(await page.locator('#spray').isDisabled()));assert.match(await page.locator('#sprayObservation').textContent(),/새 색/);await page.locator('#spray').click();assert.match(await page.locator('#sprayObservation').textContent(),/닿지/);await shot('infection-distance');
  await page.locator('[data-activity=contact]').click();await page.locator('#people button').nth(0).click();await page.locator('#people button').nth(1).click();await page.locator('#nextRound').click();assert.equal(await page.locator('.person.marked').count(),2);await page.locator('#people button').nth(1).click();await page.locator('#people button').nth(2).click();await page.locator('#nextRound').click();assert.equal(await page.locator('.person.marked').count(),3);await shot('infection-contact');await page.locator('#nextRound').click();await page.locator('#nextRound').click();assert(await page.locator('#nextRound').isDisabled());
  await page.locator('[data-activity=wash]').click();assert(await page.locator('#wash').isDisabled());await page.locator('#applyLotion').click();await page.locator('#uv').click();await shot('infection-before-wash');await page.locator('#wash').click();assert((await page.locator('#soapHand circle').count())<(await page.locator('#waterHand circle').count()));await shot('infection-after-wash');await page.locator('#resetHands').click();assert.equal(await page.locator('#soapHand circle').count(),0);
  await page.goto(url+'/mendeleev/');await page.locator('[data-card=Na]').click();assert.match(await page.locator('#selectedElement').textContent(),/Na₂O/);await page.locator('[data-slot="0"]').click();await page.locator('[data-card=Br]').click();await page.locator('[data-slot="7"]').click();await page.locator('#checkArrangement').click();assert.match(await page.locator('#arrangementStatus').textContent(),/1번째 세로줄/);await shot('mendeleev-comparing');await page.locator('#resetExperiment').click();
  for(const [i,id] of arrangement.entries())if(id){await page.locator('[data-card='+id+']').click();await page.locator('[data-slot="'+i+'"]').click();}
  await page.locator('#checkArrangement').click();assert.equal(await page.locator('#arrangementStatus').getAttribute('data-complete'),'true');assert.equal(await page.locator('#elementPool button').count(),0);await shot('mendeleev-complete');
  await page.locator('[data-slot="0"]').click();await page.locator('[data-slot="1"]').click();await page.locator('#checkArrangement').click();assert.equal(await page.locator('#arrangementStatus').getAttribute('data-complete'),'false');await page.locator('[data-slot="0"]').click();await page.locator('#removeElement').click();assert.equal(await page.locator('#elementPool button').count(),1);await page.locator('#resetExperiment').click();assert.equal(await page.locator('#elementPool button').count(),19);
  for(const [rowIndex,row] of registry.entries()){
   await page.goto(url+'/'+row.slug+'/');await page.waitForSelector('[data-assessment-ready]',{state:'attached'});await page.locator('.quiz-section summary').click();await page.waitForFunction(()=>!!document.querySelector('.exam-widget')?.examController);
   const cards=await page.locator('.quiz-card').all();
   for(const card of cards){
    const id=await card.getAttribute('data-question-id'),q=row.questions[Number(id.split('#q')[1])-1];assert(q,id);
    const wrong='abcd'[(q.answer+1)%q.choices.length];await card.locator('input[value='+wrong+']').check();await card.locator('.answer-button').click();assert.equal(await card.locator('.answer-result').textContent(),'다시 생각하고 다른 답을 골라보세요.');await card.locator('input[value='+'abcd'[q.answer]+']').check();await card.locator('.answer-button').click();assert.match(await card.locator('.answer-result').textContent(),/처음 선택을 돌아보면/,id);
   }
   const ids=await page.locator('.exam-widget').evaluate(e=>e.examController.ids());for(const [i,id] of ids.entries()){const q=row.followups.find(q=>q.id===id)||require('../learning/inquiry/science-lab/exam-bank.js').questions.find(q=>q.id===id);assert(q,id);await page.locator('[data-exam-answer="'+q.answer+'"]').click();await page.locator('.exam-submit').click();assert.equal(await page.locator('.exam-feedback').getAttribute('data-correct'),'true');if(i<ids.length-1)await page.locator('[data-exam-next]').click();}
   const state=await page.locator('.quiz-section').evaluate(e=>e.scienceAssessment.store.summary());assert.equal(state.corrected,cards.length);const activeIds=state.responses.map(r=>r.id);if(row.followups.some(q=>ids.includes(q.id)&&q.checks?.some(id=>activeIds.includes(id))))assert(state.responses.some(r=>r.transferVerified));await page.reload();await page.waitForSelector('[data-assessment-ready]',{state:'attached'});assert.equal(await page.locator('.quiz-section').evaluate(e=>e.scienceAssessment.store.summary().corrected),cards.length);
   if((rowIndex+1)%10===0)console.log(engine+': '+(rowIndex+1)+'/'+registry.length+' assessment routes verified');
  }
  assert.deepEqual(errors,[]);
 }finally{await browser?.close();await new Promise(r=>s.close(r));}
});
