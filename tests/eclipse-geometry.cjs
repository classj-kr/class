const assert=require('node:assert/strict');
const G=require('../learning/inquiry/space/earth-moon/eclipse-geometry.js');
for(const body of [G.SOLAR_MOON,G.LUNAR_EARTH]) for(const inner of [false,true]) for(const sign of [-1,1]){
 const line=G.tangent(G.SUN,body,inner,sign);
 const distance=center=>Math.abs((line.b.y-line.a.y)*center.x-(line.b.x-line.a.x)*center.y+line.b.x*line.a.y-line.b.y*line.a.x)/Math.hypot(line.b.y-line.a.y,line.b.x-line.a.x);
 assert.ok(Math.abs(distance(G.SUN)-G.SUN.r)<1e-9,'ray tangent to Sun');
 assert.ok(Math.abs(distance(body)-body.r)<1e-9,'ray tangent to occulting body');
}
for(let offset=0;offset<=86;offset++){
 const result=G.solar(offset), boundary=G.shadow(G.SUN,G.SOLAR_MOON,result.observer.x);
 const region=offset<boundary.umbra?'total':offset<boundary.penumbra?'partial':'none';
 assert.equal(result.type,region,'angular disk overlap matches shadow region at observer '+offset);
 assert.equal(result.type,G.solar(-offset).type,'mirror symmetry');
}
const radii=G.lunar(0),r=G.LUNAR_MOON.r;
assert.equal(G.lunar(radii.umbra-r-0.001).type,'total');
assert.equal(G.lunar(radii.umbra-r+0.001).type,'partial');
assert.equal(G.lunar(radii.umbra+r-0.001).type,'partial');
assert.equal(G.lunar(radii.umbra+r+0.001).type,'penumbral');
assert.equal(G.lunar(radii.penumbra+r-0.001).type,'penumbral');
assert.equal(G.lunar(radii.penumbra+r+0.001).type,'none');
for(let offset=0;offset<=210;offset++) assert.equal(G.lunar(offset).type,G.lunar(-offset).type);
console.log('PASS eclipse tangent geometry, disk overlap, solar observer regions, lunar contacts and symmetry');

const C=G.COMPARISON;
for(const body of [C.newMoon,C.earth])for(const inner of [false,true])for(const sign of [-1,1]){
 const line=G.tangent(C.sun,body,inner,sign);
 const distance=center=>Math.abs((line.b.y-line.a.y)*center.x-(line.b.x-line.a.x)*center.y+line.b.x*line.a.y-line.b.y*line.a.x)/Math.hypot(line.b.y-line.a.y,line.b.x-line.a.x);
 assert.ok(Math.abs(distance(C.sun)-C.sun.r)<1e-8);
 assert.ok(Math.abs(distance(body)-body.r)<1e-8);
}
for(let offset=0;offset<=86;offset++){
 const result=G.comparisonSolar(offset),radii=G.shadow(C.sun,C.newMoon,result.observer.x);
 assert.equal(result.type,offset<radii.umbra?'total':offset<radii.penumbra?'partial':'none');
 assert.equal(result.type,G.comparisonSolar(-offset).type);
}
const cr=G.comparisonLunar(0),mr=C.fullMoon.r;
for(const [v,type] of [[cr.umbra-mr-.001,'total'],[cr.umbra-mr+.001,'partial'],[cr.umbra+mr+.001,'penumbral'],[cr.penumbra+mr+.001,'none']]) assert.equal(G.comparisonLunar(v).type,type);
assert.equal(G.comparisonLunar(215).type,'none');
console.log('PASS comparison model uses consistent tangents, observer regions and lunar contacts');
