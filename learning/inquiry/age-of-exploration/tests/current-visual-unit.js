'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Current=require('../public/js/ocean-current.js');
const html=fs.readFileSync('public/index.html','utf8');
assert.doesNotMatch(html,/currentClouds|drawOriginalCurrentCloud/,'clouds are reserved for wind');
const sprite=html.slice(html.indexOf('function buildCurrentSprite('),html.indexOf('function seedCurrentVisuals('));
assert.doesNotMatch(sprite,/\.fill\(|\.closePath\(/,'water streaks have no filled arrowheads');
const seed=html.slice(html.indexOf('function seedCurrentVisuals('),html.indexOf('\nbuildCurrentSprite();'));
const renderer=html.slice(html.indexOf('function drawCurrentTracer('),html.indexOf('function choiceModalActive('))+
  html.slice(html.indexOf('function drawOceanCurrents('),html.indexOf('function drawWindClouds('));
const hash=html.match(/^function hashUnit\(.*$/m)[0];
let draws=[],sea=true,modal=false,flowOverride=null,view={x:0,y:0},position,angle,alpha;
const context={mode:'sea',zoom:1,SPAN:40000,MAP_H:20000,globeReady:false,viewSpanX:0,viewSpanY:0,currentFlowSprite:{},
  viewPosition:()=>view,wrapX:x=>(x%40000+40000)%40000,screenPointIsSea:()=>sea,choiceModalActive:()=>modal,
  flowScreenPoint:(p,left,top)=>({x:(p.x-left)*context.zoom,y:(p.y-top)*context.zoom}),
  CDS95Current:{currentAtPixel:(x,y)=>flowOverride||Current.currentAtPixel(x,y)},
  ctx:{save(){},restore(){},set globalAlpha(value){alpha=value},translate(x,y){position={x,y}},rotate(value){angle=value},drawImage(...args){draws.push({...position,angle,alpha,size:args[7]})}}};
vm.createContext(context);
vm.runInContext("const currentTracers=[];let currentVisualKey='';const CURRENT_FLOW_FRAME_W=96,CURRENT_FLOW_FRAME_H=30,CURRENT_FLOW_FRAME_COUNT=8;\n"+hash+'\n'+seed+'\n'+renderer,context);
function render(lon,lat,zoom,width,height,now=1000){
  view=Current.pixelFromLonLat(lon,lat);context.zoom=zoom;context.viewSpanX=width/zoom;context.viewSpanY=height/zoom;draws=[];
  context.drawOceanCurrents(width,height,view.x-context.viewSpanX/2,view.y-context.viewSpanY/2,now);
  return draws.filter(p=>p.x>=0&&p.x<=width&&p.y>=0&&p.y<=height);
}
for(const [lon,lat]of[[-48,46],[136,33],[-77,-24]])for(const zoom of[.55,1,3.6]){
  const desktop=render(lon,lat,zoom,1366,768).length;
  const phone=render(lon,lat,zoom,390,844).length;
  assert.ok(desktop>=3&&desktop<=18,`sparse desktop current marks at ${lon},${lat}, zoom ${zoom}: ${desktop}`);
  assert.ok(phone>=1&&phone<=7,`sparse phone current marks at ${lon},${lat}, zoom ${zoom}: ${phone}`);
}
const first=render(-48,46,1,1366,768),next=render(-48,46,1,1366,768,1100);
assert.ok(first.every(p=>p.alpha<=.59&&p.size<=68),'ripples stay subdued on the map');
const motions=first.map(a=>next.map(b=>Math.hypot(b.x-a.x,b.y-a.y)).find(d=>d>0&&d<3)).filter(Number.isFinite);
assert.ok(motions.length>=3,'ripples must move continuously along the current');
assert.ok(motions.every(d=>d/.1>=3&&d/.1<=7.1),'water ripples travel slowly');
assert.equal(render(-140,0,1,1366,768).length,0,'quiet ocean must not invent a current');
flowOverride={x:0,y:1,strength:.8};const south=render(-48,46,1,1366,768);
assert.ok(south.length>0&&south.every(p=>Math.abs(p.angle-Math.PI/2)<1e-6),'ripples must follow the local sailing current');
sea=false;assert.equal(render(-48,46,1,1366,768).length,0,'no markers on land');sea=true;
modal=true;assert.equal(render(-48,46,1,1366,768).length,0);modal=false;
context.mode='land';assert.equal(render(-48,46,1,1366,768).length,0);
console.log(JSON.stringify({ok:true,localCurrentCoverage:true,phoneAndZoomCoverage:true,visibleMotion:true,readableContrast:true,seaMask:true,quietOcean:true}));
