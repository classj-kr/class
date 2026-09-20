'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const Motion=require('../public/js/view-motion');
const near=(a,b,tolerance=1e-7)=>assert.ok(Math.abs(a-b)<tolerance,a+' != '+b);
// A correction is absorbed gradually without changing the simulation.
const target={x:100,y:200},view=Motion.create(10000);view.update(target,0,'sea');target.x=150;
const first=view.update(target,1/60,'sea');assert.ok(first.x>100&&first.x<150);assert.equal(target.x,150);
for(let i=0;i<60;i++)view.update(target,1/60,'sea');near(view.position.x,150,.001);
function settle(hz){const t={x:100,y:200},v=Motion.create(10000);v.update(t,0,'sea');t.x=200;for(let i=0;i<hz/5;i++)v.update(t,1/hz,'sea');return v.position.x}
near(settle(30),settle(60));near(settle(60),settle(120));
// Cross the date line along the short path, and snap on travel/mode changes.
const wrapped={x:9995,y:10},seam=Motion.create(10000);seam.update(wrapped,0,'sea');wrapped.x=5;
const crossing=seam.update(wrapped,1/60,'sea');assert.ok(crossing.x>9995||crossing.x<5);
wrapped.x=5000;near(seam.update(wrapped,1/60,'sea').x,5000);
wrapped.x=5050;near(seam.update(wrapped,1/60,'land').x,5050);
wrapped.x=5100;near(seam.update(wrapped,.5,'land').x,5100);
near(seam.update({x:5120,y:10},1/60,'land').x,5120);
// Exercise the actual scheduler with a deferred map render, as MapLibre does.
const html=fs.readFileSync(path.join(__dirname,'../public/index.html'),'utf8');
const loop=html.slice(html.indexOf('function paintScene(){'),html.indexOf('requestAnimationFrame(loop);\nsetInterval',html.indexOf('function paintScene(){')));
const calls=[],events={},state={assetsReady:true,joined:true,self:{x:100,y:200},mode:'sea',last:0,dpr:1,innerWidth:800,innerHeight:600,keys:{left:true},serverSelf:{moving:true},remote:new Map(),viewMotion:Motion.create(10000),choice:false,globeReady:true,
 ctx:{setTransform(){}},drawMap(){calls.push('overlay')},drawPlayers(){calls.push('players')},movePrediction(){calls.push('prediction')},dxWrap:(a,b)=>a-b,choiceModalActive(){return state.choice},requestAnimationFrame(){},syncGlobeCamera(){calls.push('camera')},globeMap:{on(event,handler){events[event]=handler},triggerRepaint(){calls.push('queued map')}}};
state.viewPosition=()=>state.viewMotion.position||state.self;
vm.createContext(state);vm.runInContext(loop,state);
const renderListener=html.match(/globeMap\.on\('render',\(\)=>\{if\(globeReady\)paintScene\(\)\}\);/);assert.ok(renderListener);
vm.runInContext(renderListener[0],state);state.loop(16.67);
assert.deepEqual(calls,['prediction','camera','queued map'],'overlay must wait until the map has rendered');
events.render();assert.deepEqual(calls.slice(-2),['overlay','players']);
calls.length=0;state.loop(33.34);assert.ok(calls.includes('queued map'),'movement must not skip every other display frame');
state.choice=true;calls.length=0;state.loop(50);assert.deepEqual(calls,['prediction'],'choice menu keeps its inexpensive cadence');
state.choice=false;state.globeReady=false;calls.length=0;state.loop(66.68);assert.deepEqual(calls,['prediction','camera','overlay','players'],'fallback map still renders without WebGL');
console.log(JSON.stringify({ok:true,smoothCorrections:true,refreshRateIndependent:true,dateLine:true,teleportAndModeSnap:true,overlayAfterRaster:true,fullTravelFrames:true,fallback:true}));
