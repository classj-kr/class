"use strict";
const assert=require('node:assert/strict');
const THREE=require('../learning/arts/art-appreciation/museum/vendor/three.min.js');
const k=require('../apps/avatar-lab/model-kit.cjs')(THREE,'facing-regression');
// The first point lies at a concave crest. Its smoothed normal is not a
// reliable indication of whether the whole front surface faces outward.
const outline=[[285,99],[271,91],[260,80],[264,76],[278,80],[281,84],[280,67],[284,59],[294,63],[304,79],[304,87],[314,79],[324,79],[328,87],[321,100],[346,109],[371,129],[388,157],[399,191],[406,215],[417,245],[422,276],[416,303],[401,328],[377,348],[349,362],[319,369],[289,373],[259,369],[229,362],[201,348],[177,328],[162,303],[156,276],[161,245],[173,215],[180,191],[191,157],[208,129],[233,109],[259,102]];
k.volume('CrestedHood',outline,[289,246],[320,580],.70,.70,k.body,k.solid('Hood','#efb3b0'),{art:false,samples:128});
k.root.updateMatrixWorld(true);
for(const [x,y] of [[289,246],[340,350],[230,310]])for(const side of [-1,1]){
 const ray=new THREE.Raycaster(new THREE.Vector3((x-320)*.005,(580-y)*.005,side*5),new THREE.Vector3(0,0,-side));
 const hit=ray.intersectObject(k.root,true)[0];assert(hit,'closed hood must be visible from both sides');
 assert.equal(hit.object.name,side>0?'CrestedHoodSurface':'CrestedHoodBack');
 assert(hit.point.z*side>0,'front ray must not pass through to the far shell');
}
console.log('PASS concave crest: front and back rays hit their outward-facing surfaces.');
