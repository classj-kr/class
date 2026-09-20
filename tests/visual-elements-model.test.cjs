const test=require('node:test');
const assert=require('node:assert/strict');
const M=require('../learning/arts/art-theory/visual-elements/model.js');
function measuredArea(g){
 const a=g.attrs;
 if(g.tag==='circle')return Math.PI*a.r*a.r;
 if(g.tag==='rect')return a.width*a.height;
 const points=a.points.split(' ').map(pair=>pair.split(',').map(Number));
 return Math.abs(points.reduce((sum,[x,y],i)=>{const [u,v]=points[(i+1)%points.length];return sum+x*v-u*y;},0))/2;
}
test('shape changes preserve area and centroid at every offered size',()=>{
 for(let size=65;size<=120;size++){
  const areas=['circle','square','triangle'].map(shape=>measuredArea(M.geometry(shape,size)));
  for(const area of areas)assert.ok(Math.abs(area-76*76*(size/100)**2)<1e-8);
  const triangle=M.geometry('triangle',size).attrs.points.split(' ').map(pair=>pair.split(',').map(Number));
  assert.ok(Math.abs(triangle.reduce((sum,p)=>sum+p[0],0))<1e-10);
  assert.ok(Math.abs(triangle.reduce((sum,p)=>sum+p[1],0))<1e-10);
 }
});
test('one control cannot modify any other property or the reference',()=>{
 const reference={angle:31,width:9,shape:'square',size:87,texture:'grain'},before={...reference};
 for(const [axis,spec] of Object.entries(M.axes)){
  const values=spec.choices?spec.choices.map(([key])=>key):[-100,spec.min,spec.max,1000];
  for(const value of values){const result=M.change(reference,axis,value);for(const key of Object.keys(reference))if(key!==axis)assert.equal(result[key],reference[key]);if(!spec.choices)assert.ok(result[axis]>=spec.min&&result[axis]<=spec.max);}
 }
 assert.deepEqual(reference,before);
 assert.throws(()=>M.change(reference,'shape','unknown'),RangeError);
 assert.throws(()=>M.change(reference,'width',NaN),RangeError);
});
test('doubling length quadruples area instead of treating size as area percentage',()=>{
 for(const shape of ['circle','square','triangle'])assert.ok(Math.abs(measuredArea(M.geometry(shape,120))/measuredArea(M.geometry(shape,60))-4)<1e-10);
});
