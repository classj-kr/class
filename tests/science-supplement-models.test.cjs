const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const {test}=require('node:test');
const base='learning/inquiry/science-lab/';
function models(){
 const ctx={window:{},location:{pathname:'/none/'}};
 vm.createContext(ctx);vm.runInContext(fs.readFileSync(base+'supplement-extra.js','utf8'),ctx);
 vm.runInContext(fs.readFileSync(base+'supplement-core.js','utf8'),ctx);
 // Expose the pure model registry in a test-only VM; production stays unmodified.
 const source=fs.readFileSync(base+'supplement-labs.js','utf8').replace(' const path=location.pathname',' window.testSpecs=specs; const path=location.pathname');
 vm.runInContext(source,ctx);return ctx.window.testSpecs;
}
const specs=models();
test('all supplement choices return finite, curriculum-referenced observations',()=>{
 assert.equal(Object.keys(specs).length,36);
 const curriculum=fs.readFileSync('references/moe/2022-revised-curriculum/extracted/09-science.txt','utf8');
 for(const [slug,spec]of Object.entries(specs)){
  for(const code of spec.codes)assert(curriculum.includes('['+code+']'),slug+': '+code);
  const seen=new Set(),pending=[{...spec.initial}];
  while(pending.length){const state=pending.pop(),fields=typeof spec.fields==='function'?spec.fields(state):spec.fields;
   for(const f of fields)if(!f.items.some(x=>x.value===state[f.key]))state[f.key]=f.items[0].value;
   const key=JSON.stringify(state);if(seen.has(key))continue;seen.add(key);
   const result=spec.view(state);assert((result.svg||result.media?.items.length)&&result.text&&typeof result.note==='string',slug);assert(!/NaN|undefined/.test(JSON.stringify(result)),slug+': '+key);
   for(const f of fields)for(const choice of f.items)pending.push({...state,[f.key]:choice.value});
  }
  assert(seen.size>1,slug);console.log(slug+': '+seen.size+' valid states');
 }
});
test('ABO both-reagent truth table and student judgement',()=>{
 const spec=specs.immune;
 for(const [sample,type]of Object.entries({가:'A',나:'O',다:'AB',라:'B'})){
  const r=spec.view({sample,stage:'after',answer:type});assert.match(r.text,/판정이 맞았습니다/);
  assert.equal((r.svg.match(/응집 있음/g)||[]).length,type==='AB'?2:type==='O'?0:1);
  for(const answer of ['A','B','AB','O'].filter(a=>a!==type))assert.match(spec.view({sample,stage:'after',answer}).text,/다시 확인/);
  assert.doesNotMatch(spec.view({sample,stage:'before',answer:type}).text,/판정이 맞았습니다/);
 }
});
test('freezing mass, gas mass, heat contact, separation and starch',()=>{
 const water=specs['state-change'];for(const phase of ['water','ice','again'])assert.match(water.view({phase}).svg,/100 g/);
 assert.match(water.view({phase:'ice'}).text,/부피가 늘어/);assert.match(water.view({phase:'again'}).text,/처음 물의 부피/);
 for(const [air,mass]of Object.entries({same:500,more:501,less:499}))assert(specs.gases.view({air}).svg.includes(mass+' g'));
 for(const hot of ['60','80'])for(const cold of ['20','40']){const r=specs['heat-transfer'].view({kind:'contact',stage:'after',hot,cold});assert.equal((r.svg.match(new RegExp((+hot+ +cold)/2+' ℃','g'))||[]).length,2);assert.doesNotMatch(r.svg,/열 이동 →/);}
 const mixture=specs['mixture-separation'];assert.match(mixture.view({kind:'salt',stage:'filter'}).text,/회수가 끝난 것이 아닙니다/);assert.match(mixture.view({kind:'salt',stage:'evaporate'}).text,/소금이 남습니다/);
 for(const light of ['all','half','none']){const r=specs.photosynthesis.view({light,stage:'after'});assert.equal((r.svg.match(/#293e68/g)||[]).length,{all:2,half:1,none:0}[light]);}
});
