'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const Terrain=require('../public/js/terrain'),Floes=require('../public/js/ice-floes');
const root=path.join(__dirname,'..'),mask=fs.readFileSync(path.join(root,'data/world/NATURAL_EARTH_LAND_MASK.bin'));
const W=Terrain.WORLD_W,H=Terrain.WORLD_H,T=Terrain.TILE,span=W*T,height=H*T;
const sea=(x,y)=>{const cx=Math.floor(((x%span)+span)%span/T),cy=Math.floor(y/T);return cy>=0&&cy<H&&mask[cy*W+cx]===0};
function options(lat,lon,day=221){const x=(lon+180)/360*span,y=(90-lat)/180*height;return{terrain:Terrain,worldWidth:W,worldHeight:H,tile:T,day,isSea:sea,bounds:{left:x-600,right:x+600,top:y-250,bottom:y+250}}}
for(const [lat,lon] of [[78.97,33.22],[82,0],[-68,-40],[75,179.7],[75,-179.7]]){
  const opts=options(lat,lon),floes=Floes.build(opts);
  assert.ok(floes.length>10,`ice is visible at ${lat},${lon}`);
  for(const f of floes){assert.ok(f.points.every(v=>sea(v.x,v.y)),'ice cannot cover land');assert.ok(f.points.every(v=>Number.isFinite(v.x)&&Number.isFinite(v.y)));}
  assert.deepEqual(floes,Floes.build(opts),'ice shapes must stay fixed while the camera moves');
  const shifted=Floes.build({...opts,bounds:{...opts.bounds,left:opts.bounds.left+T,right:opts.bounds.right+T}});
  const shared=new Set(shifted.map(f=>JSON.stringify(f)));
  assert.ok(floes.filter(f=>shared.has(JSON.stringify(f))).length>floes.length*.8,'camera movement must not regenerate ice shapes');
}
assert.equal(Floes.build(options(38.7,-9.1)).length,0,'Lisbon must not have sea ice');
const winter=Floes.build(options(76,40,74)),summer=Floes.build(options(76,40,256));
assert.ok(winter.length>summer.length,'seasonal ice extent must change with the navigation rules');
const html=fs.readFileSync(path.join(root,'public/index.html'),'utf8'),server=fs.readFileSync(path.join(root,'server.js'),'utf8');
for(const source of [html,server]){assert.ok(source.includes('얼음 바다 - 항해가 어려움'));assert.doesNotMatch(source,/1520년의 배로는 갈 수 없음|1520년의 나무배로는 얼음을 뚫고|얼음이 녹는 여름을 기다리세요/);}
assert.ok(html.includes('VoyageIceFloes.build'));
console.log(JSON.stringify({ok:true,arctic:true,antarctic:true,dateLine:true,landExcluded:true,stableGeometry:true,seasonalExtent:true,conciseMessage:true}));
