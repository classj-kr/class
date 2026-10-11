const {test}=require('node:test'),assert=require('node:assert/strict');
const scenes=require('../learning/inquiry/science-lab/observation-scenes.js');
const required=require('../learning/inquiry/science-lab/required-experiments.js').requiredExperimentModels();
test('combustion separates collection and reagent observation, with a relevant common-phenomenon question',()=>{
 const model=required['burning-conditions'].find(x=>x.id==='combustion-products');
 for(const fuel of ['candle','alcohol'])for(const reagent of ['cobalt','lime']){
  for(const step of ['0','1']){const result=model.view({fuel,test:reagent,step});assert.equal(result.metrics.waterDetected,false);assert.equal(result.metrics.carbonDioxideDetected,false);assert.doesNotMatch(result.readings[0][1],/붉은색|뿌옇게/);}
  const result=model.view({fuel,test:reagent,step:'2'});assert.equal(result.metrics.water,true);assert.equal(result.metrics[reagent==='cobalt'?'waterDetected':'carbonDioxideDetected'],true);assert.match(result.svg,reagent==='cobalt'?/통 안쪽에 붙인 종이/:/입구를 막아 세움/);assert.match(result.readings[0][1],reagent==='cobalt'?/붉은색/:/뿌옇게/);
 }
 const common=model.view({fuel:'candle',test:'common',step:'2'});assert.match(common.check.choices[common.check.answer],/빛과 열/);
});
test('insulation preserves the initial condition and approaches ambient more slowly',()=>{
 let prev={wrapped:80,bare:80};
 for(const minutes of [0,5,15,30]){
  const r=scenes.insulation({stage:minutes?'after':'before',minutes:String(minutes)}),m=r.metrics;
  assert(m.wrapped<=prev.wrapped&&m.bare<=prev.bare);assert(m.wrapped>=m.bare&&m.bare>20);
  if(!minutes)assert.equal(m.wrapped,80);else assert(m.wrapped>m.bare);
  assert.match(r.note,/실제 측정값이 아니/);prev=m;
 }
});
test('sound conditions change amplitude with unchanged pitch; galaxy contains observable bar and arms',()=>{
 const v=(kind,condition)=>scenes.sound({kind,condition}).audio;
 assert(v('string','on').amplitude>v('string','off').amplitude);
 assert(v('noise','on').amplitude<v('noise','off').amplitude);
 for(const kind of ['string','noise'])assert.equal(v(kind,'on').frequency,v(kind,'off').frequency);
 const svg=scenes.galaxy();assert.equal((svg.match(/data-spiral-arm/g)||[]).length,2);assert.match(svg,/data-galactic-bar/);assert.match(svg,/data-solar-location/);
});
