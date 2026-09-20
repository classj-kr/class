const {test}=require('node:test'),assert=require('node:assert/strict');
const models=Object.values(require('../learning/inquiry/science-lab/required-experiments.js').requiredExperimentModels()).flat();
const view=(id,s={})=>{const spec=models.find(x=>x.id===id);return spec.view({...spec.initial,...s});};
test('final comparisons: spectral evidence, controlled design, ecology, validity and thermal scale',()=>{
 assert.deepEqual(view('emission-spectrum').metrics.lines,[486.1,656.3]);assert.equal(view('emission-spectrum',{sample:'hydrogen',reference:'helium'}).metrics.matches,false);assert.equal(view('emission-spectrum',{sample:'mixture',reference:'helium'}).metrics.matches,true);
 const a=view('population-change').metrics,b=view('population-change',{capacity:'40'}).metrics,c=view('population-change',{event:'loss'}).metrics;assert(a.last>b.last);assert(c.last<a.last);assert(a.values.every(x=>x>=0&&x<=80));assert(c.values[6]<c.values[5]);
 for(const method of ['protein','nucleic']){assert.equal(view('diagnostic-principle',{method,control:'invalid',target:'present'}).metrics.detected,false);assert.equal(view('diagnostic-principle',{method,target:'absent'}).metrics.detected,false);assert.equal(view('diagnostic-principle',{method}).metrics.detected,true);}
 assert.equal(view('group-design',{conditions:'mixed',stage:'observe'}).metrics.inference,false);assert.equal(view('group-design',{stage:'observe'}).metrics.inference,true);
 assert(view('thermal-image',{material:'metal',time:'3'}).metrics.temps[7]>view('thermal-image',{material:'insulator',time:'3'}).metrics.temps[7]);assert(view('thermal-image').metrics.temps.every(t=>t===20));
});
