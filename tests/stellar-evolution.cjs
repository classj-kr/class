const assert=require('node:assert/strict');
const M=require('../learning/inquiry/space/constellations/stellar-evolution.js');
for(const mass of ['sun','massive'])for(const remnant of ['neutron','black-hole']){
 for(let i=0;i<=1000;i++){
  const state=M.sample(i/1000,mass,remnant);
  for(const key of ['radius','cloud','cloudSize','shell','burst','red'])assert.ok(Number.isFinite(state[key])&&state[key]>=0,key);
  assert.ok(state.stage.name&&state.stage.description);
 }
 for(const boundary of M.bounds.slice(1,-1))assert.ok(Math.abs(M.sample(boundary-1e-8,mass,remnant).radius-M.sample(boundary+1e-8,mass,remnant).radius)<.01,'continuous radius across phases');
 assert.equal(M.sample(0,mass,remnant).stage.id,'nebula');
 assert.equal(M.sample(1,mass,remnant).stage.name,mass==='sun'?'백색왜성':remnant==='black-hole'?'블랙홀':'중성자별');
}
assert.ok(!M.stages('sun','neutron').some(s=>s.name==='초신성'));
assert.equal(M.stages('massive','neutron')[1].name,'원시별');
assert.equal(M.stages('sun','neutron')[2].name,'주계열성');
console.log('PASS both stellar paths, intermediate protostar, finite animation states, continuous stage transitions and all three remnants');
