const fs=require('node:fs');
fs.writeFileSync('learning/inquiry/age-of-exploration/tests/wind-visual-unit.js',String.raw`'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('public/index.html','utf8');
assert.ok(html.includes('/assets/weather/cloud-soft-atlas-v1.webp'));
assert.ok(fs.existsSync('public/assets/weather/cloud-soft-atlas-v1.webp'));
assert.doesNotMatch(html,/WIND_CLOUD_FRAME_MS|WIND_CLOUD_SEQUENCE_FRAMES|currentClouds|drawOriginalCurrentCloud/);
const renderer=html.slice(html.indexOf('function drawWindClouds('),html.indexOf('function drawHuntAnimal('));
const constants=html.match(/^const WIND_CLOUD_CELL_W=.*$/m)[0],hash=html.match(/^function hashUnit\(.*$/m)[0];
let draws=[],wind={x:1,y:0,strength:.8},modal=false;
const context={mode:'sea',choiceModalActive:()=>modal,windCloudAtlas:{complete:true,naturalWidth:1536},viewSpanX:1600,viewSpanY:900,SPAN:40000,MAP_H:20000,zoom:1,classGameMinutes:0,
  wrapX:x=>(x%40000+40000)%40000,flowScreenPoint:(p,left,top)=>({x:p.x-left,y:p.y-top}),CDS95Wind:{windAtPixel:()=>wind},
  ctx:{save(){},restore(){},drawImage(...args){draws.push({sx:args[1],sy:args[2],x:args[5],y:args[6],w:args[7]});}}};
vm.createContext(context);vm.runInContext(constants+'\n'+hash+'\n'+renderer,context);
const render=now=>{draws=[];context.drawWindClouds(1600,900,10000,7500,now);return new Map(draws.map(d=>[d.w,d]));};
function motion(strength,x,y){
  wind={strength,x,y};const before=render(1000),after=render(1050),distances=[];
  for(const [key,a]of before){const b=after.get(key);if(!b)continue;const dx=b.x-a.x,dy=b.y-a.y;if(Math.hypot(dx,dy)>20)continue;
    assert.ok(dx*x+dy*y>0,'clouds must travel downwind');assert.ok(Math.abs(dx*y-dy*x)<1e-6,'no drift across the sailing wind');
    assert.equal(a.sx,b.sx);assert.equal(a.sy,b.sy);distances.push(Math.hypot(dx,dy));
  }
  assert.ok(distances.length>0,'visible clouds must be drawn');
  assert.ok(distances.some(d=>Math.abs(d-Math.round(d))>.001),'motion must retain fractional pixels');
  return distances.reduce((a,b)=>a+b)/distances.length;
}
const weak=motion(.2,1,0),strong=motion(.85,1,0);assert.ok(strong>weak*2,'stronger winds must be visibly faster');
motion(.8,-1,0);motion(.8,0,1);motion(.8,0,-1);motion(.8,-Math.SQRT1_2,Math.SQRT1_2);
wind={x:1,y:0,strength:.05};assert.equal(render(1000).size,0,'calm areas must not suggest strong wind');
wind.strength=.8;modal=true;assert.equal(render(1000).size,0);modal=false;context.mode='land';assert.equal(render(1000).size,0);
const server=fs.readFileSync('server.js','utf8');
for(const token of ["require('./public/js/wind.js')",'windMultiplier','windAssistPercent','WIND_TAIL_FACTOR = 1.00','WIND_HEAD_FACTOR = 0.65'])assert.ok(server.includes(token),token);
console.log(JSON.stringify({ok:true,softCloudAtlas:true,windAlignedMotion:true,strongWindFaster:true,continuousMotion:true,calmAreas:true,serverMovementEffect:true}));
`);
