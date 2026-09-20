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
