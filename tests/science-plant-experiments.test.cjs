const {test}=require('node:test'),assert=require('node:assert/strict');
const models=require('../learning/inquiry/science-lab/required-experiments.js').requiredExperimentModels().microscope;
const root=models.find(s=>s.id==='root-uptake'),leaf=models.find(s=>s.id==='leaf-transpiration');
const stem=models.find(s=>s.id==='stem-dye-transport');
const view=(spec,s)=>spec.view({...spec.initial,...s});
test('root comparison preserves initial marks, controls, symmetry and qualitative limits',()=>{
 for(const plant of ['pepper','onion'])for(const level of ['same','different'])for(const a of ['intact','cut'])for(const b of ['intact','cut']){
  const before=view(root,{plant,level,a,b}),after=view(root,{plant,level,a,b,stage:'after'});
  assert.deepEqual(before.metrics.initial,after.metrics.initial);
  for(const key of ['a','b'])assert.equal(before.metrics.surface[key],before.metrics.initial[key]);
  const drop=key=>after.metrics.surface[key]-after.metrics.initial[key];
  if(a===b)assert.equal(drop('a'),drop('b'));
  else assert.equal(drop('a')>drop('b'),a==='intact');
  assert.equal(after.metrics.comparable,a!==b&&level==='same');
  assert.match(after.note,/흡수가 전혀 없다고 단정하지/);
  assert(!after.svg.includes('NaN'));assert.equal((after.svg.match(/data-water=/g)||[]).length,2);
 }
 const forward=view(root,{stage:'after'}),reversed=view(root,{a:'cut',b:'intact',stage:'after'});
 assert.equal(forward.metrics.surface.a,reversed.metrics.surface.b);
 assert.match(view(root,{level:'different',stage:'after'}).text,/처음/);
 assert.match(view(root,{a:'cut',b:'cut',stage:'after'}).text,/구별하기 어렵/);
});
test('transpiration compares real control branches and never draws invisible vapor as droplets',()=>{
 for(const a of ['present','removed'])for(const b of ['present','removed'])for(const stage of ['before','after']){
  const r=view(leaf,{a,b,stage});assert.equal(r.metrics.droplets.a,stage==='after'&&a==='present');assert.equal(r.metrics.droplets.b,stage==='after'&&b==='present');
  for(const key of ['a','b'])assert.equal(r.svg.includes(`data-droplet="${key}"`),r.metrics.droplets[key]);
  assert.equal(r.metrics.comparable,a!==b);
 }
 assert.match(view(leaf,{stage:'after'}).text,/수증기/);
});
test('stem observations distinguish the water control, time and section directions',()=>{
 for(const a of ['plain','dye'])for(const b of ['plain','dye'])for(const stage of ['before','after'])for(const cut of ['cross','length'])for(const location of ['lower','upper']){
  const r=view(stem,{a,b,stage,cut,location});
  assert.deepEqual(r.metrics.stained,{a:stage==='after'&&a==='dye',b:stage==='after'&&b==='dye'});
  assert.equal(r.metrics.comparable,a!==b);
  assert.match(r.svg,cut==='cross'?/가로 단면/:/세로 단면/);
  assert.match(r.svg,location==='lower'?/아래쪽/:/위쪽/);
  assert.equal((r.svg.match(new RegExp('data-cut-location="'+location+'"','g'))||[]).length,2);
  assert(!r.svg.includes('NaN'));
 }
 const r=view(stem,{stage:'after'});
 assert.match(r.readings[0][1],/붉은 부분 없음/);
 assert.match(r.readings[1][1],/붉은 점/);
 assert.match(view(stem,{stage:'after',cut:'length'}).readings[1][1],/붉은 선/);
 assert.match(view(stem,{a:'dye',b:'dye',stage:'after'}).text,/같은 물/);
});
test('source-derived diagnostic items retain first mistakes and test transfer separately',()=>{
 const api=require('../learning/inquiry/science-lab/science-assessment.js'),qs=require('../learning/inquiry/science-lab/assessment-content.js').followups.microscope.filter(q=>q.id.startsWith('microscope@root-')||q.id.startsWith('microscope@leaf-')||q.id.startsWith('microscope@stem-'));
 assert.equal(qs.length,9);
 const store=api.session('plant-test',qs.map(q=>({...q,choices:q.choices.map((text,id)=>({text,id:String(id)})),answer:String(q.answer)})));
 for(const q of qs){store.submit(q.id,(q.answer+1)%3);const r=store.submit(q.id,q.answer);assert.equal(r.firstCorrect,false);assert.equal(r.status,'corrected');}
 assert.equal(store.summary().firstCorrect,0);assert.equal(store.summary().corrected,9);
});
test('wet indicator paper cannot produce a valid new positive result',()=>{
 const spec=models.find(s=>s.id==='leaf-water-indicator');
 assert.equal(view(spec,{}).metrics.red,false);assert.equal(view(spec,{stage:'after'}).metrics.detected,true);
 for(const stage of ['before','after']){const result=view(spec,{paper:'wet',stage});assert.equal(result.metrics.red,true);assert.equal(result.metrics.detected,false);assert.match(result.text,/判断|판단할 수 없/);}
});
