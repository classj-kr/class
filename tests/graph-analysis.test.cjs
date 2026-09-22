const test = require('node:test');
const assert = require('node:assert/strict');
const A = require('../learning/literacy-numeracy/graph-studio/graph-analysis');
const C = require('../learning/literacy-numeracy/graph-studio/graph-core');
const near = (a,b,t=1e-6) => assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
test('tangent agrees with known derivatives and moves with its point',()=>{
  for(const [f,x,y,slope] of [[x=>x*x,2,4,4],[Math.sin,0,0,1],[Math.exp,1,Math.E,Math.E],[Math.log,1,0,1],[x=>3*x+2,-4,-10,3],[x=>x*x*x,0,0,0]]) {
    const r=A.tangent(f,x);assert.equal(r.ok,true);near(r.y,y);near(r.slope,slope);
  }
});
test('corners, jumps, undefined points and poles do not produce tangents',()=>{
  for(const [f,x] of [[Math.abs,0],[Math.floor,0],[Math.sqrt,0],[x=>1/x,0],[Math.tan,Math.PI/2],[Math.log,-1]]) assert.equal(A.tangent(f,x).ok,false,`${f} at ${x}`);
});
test('intersections include crossings and tangent contacts',()=>{
  let r=A.intersections(x=>x*x,x=>x,-2,3);assert.equal(r.points.length,2);near(r.points[0].x,0);near(r.points[1].x,1);
  r=A.intersections(x=>(x-.137)**2,()=>0,-2,3);assert.equal(r.points.length,1);near(r.points[0].x,.137);
  r=A.intersections(Math.sin,()=>0,-4,4);assert.equal(r.points.length,3);near(r.points[0].x,-Math.PI);near(r.points[2].x,Math.PI);
});
test('intersection search rejects poles, jumps and near misses; overlap is explicit',()=>{
  for(const f of [x=>1/(x-.13),x=>Math.floor(x)-.5,x=>(x-.137)**2+1e-10,()=>1e-12]) assert.equal(A.intersections(f,()=>0,-1,1).points.length,0);
  assert.equal(A.intersections(x=>x*x,x=>x*x,-3,3).overlap,true);
  assert.equal(A.intersections(Math.abs,x=>x,-2,2).overlap,true);
});
test('signed integral and geometric area differ below the axis',()=>{
  let r=A.integrate(x=>x,-1,1);assert.equal(r.ok,true);near(r.signed,0);near(r.area,1);
  r=A.integrate(x=>-x*x,-2,2);assert.equal(r.ok,true);near(r.signed,-16/3);near(r.area,16/3);
  r=A.integrate(x=>x*x,2,-2);assert.equal(r.ok,true);near(r.signed,-16/3);near(r.area,16/3);
  r=A.integrate(Math.sin,0,Math.PI);assert.equal(r.ok,true);near(r.signed,2);near(r.area,2);
  r=A.integrate(Math.sqrt,0,1);assert.equal(r.ok,true);near(r.signed,2/3);
  r=A.integrate(x=>x*x,2,2);assert.equal(r.ok,true);near(r.area,0);
});
test('improper integrals and unresolved oscillation cannot appear as valid zero areas',()=>{
  for(const [f,a,b] of [[x=>1/x,-1,1],[x=>1/(x-.12345),-1,1],[x=>1/((x-.13)**2),-1,1],[Math.log,0,1],[Math.sqrt,-1,1],[Math.tan,0,Math.PI]]) assert.equal(A.integrate(f,a,b).ok,false,`${f}`);
  const result=A.integrate(x=>Math.sin(960*Math.PI*x),0,1);assert.ok(!result.ok||Math.abs(result.area-2/Math.PI)<1e-5);
});
test('analysis settings survive lesson round trips and legacy lessons upgrade safely',()=>{
  const state=C.initialState();state.functions.push(C.newFunction('x',null,2));state.analysis={mode:'integral',otherId:2,tangentX:.13,from:2,to:-1};
  assert.deepEqual(C.validateState(JSON.parse(JSON.stringify(state))),state);
  delete state.analysis;assert.deepEqual(C.validateState(state).analysis,C.defaultAnalysis());
  for(const patch of [{mode:'eval'},{otherId:999},{from:Infinity},{tangentX:'1'}]) {const next=C.initialState();Object.assign(next.analysis,patch);assert.throws(()=>C.validateState(next));}
});
