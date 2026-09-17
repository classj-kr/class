'use strict';
const {io}=require('socket.io-client');
const assert=require('node:assert/strict');
const BASE=process.env.TEST_URL||'http://127.0.0.1:3000';
const { joinFreeRoom }=require('./_rooms');
const discoveries=require('../data/catalog/discoveries.json');
const TILE=16,WORLD_W=2500,WORLD_H=1250;
function connect(){return io(BASE,{transports:['websocket'],forceNew:true,reconnection:false,timeout:7000});}
function once(s,e,p=()=>true,t=40000){return new Promise((r,j)=>{const x=setTimeout(()=>{s.off(e,on);j(new Error(`timeout:${e}`));},t);function on(d){if(!p(d))return;clearTimeout(x);s.off(e,on);r(d)}s.on(e,on)});}
function ack(s,e,p={}){return new Promise((r,j)=>{const x=setTimeout(()=>j(new Error(`ack:${e}`)),10000);s.emit(e,p,d=>{clearTimeout(x);r(d)})});}
const pixel=(d)=>({x:((d.lon+180)/360)*WORLD_W*TILE,y:((90-d.lat)/180)*WORLD_H*TILE});
(async()=>{
  const sailor=connect();
  await once(sailor,'connect');
  const room=await joinFreeRoom(ack,sailor,'발견학생');
  assert.equal(room.ok,true,room.error);

  // 리스본에서 출발한다. 아직 어떤 곳에도 닿지 않았으니 살펴볼 것이 없다.
  const start=await once(sailor,'snapshot',x=>x.you.mode==='sea');
  assert.equal(start.discoveryInteraction,null,'출발 지점에서는 살펴볼 곳이 없어야 한다');
  assert.deepEqual(start.you.discoveryIds,[],'처음에는 찾은 곳이 없어야 한다');
  assert.equal(start.you.discoveryTotal,discoveries.length,'발견 지점 수가 목록과 달라진다');

  // 멀리 있는 곳은 눌러도 열리지 않는다.
  const cape=discoveries.find(d=>d.id==='cape-st-vincent');
  const tooFar=await ack(sailor,'inspectDiscovery',{id:cape.id});
  assert.equal(tooFar.ok,false,'멀리서 눌러도 열리면 안 된다');
  assert.match(tooFar.error,/가까이/);

  // 배를 상비센트곶으로 보낸다. 지나가는 동안 스스로 열리지 않아야 한다.
  const goal=pixel(cape);
  sailor.emit('setTarget',goal);
  const arrived=await once(sailor,'snapshot',x=>x.discoveryInteraction?.id===cape.id);
  assert.equal(arrived.discoveryInteraction.name,cape.name);
  assert.equal(arrived.discoveryInteraction.found,false,'아직 누르기 전이므로 찾은 것이 아니다');
  assert.deepEqual(arrived.you.discoveryIds,[],'지나가기만 해서는 찾은 것으로 세지 않는다');

  // 눌러야 설명이 열리고, 그때 처음 찾은 것으로 센다.
  const opened=await ack(sailor,'inspectDiscovery',{id:cape.id});
  assert.equal(opened.ok,true,opened.error);
  assert.equal(opened.first,true,'처음 살펴본 것이어야 한다');
  assert.equal(opened.discovery.name,cape.name);
  assert.ok(opened.discovery.text.length>40,'설명이 와야 한다');
  assert.equal(opened.found,1);
  assert.equal(opened.total,discoveries.length);
  assert.deepEqual(opened.self.discoveryIds,[cape.id]);

  // 두 번째로 누르면 설명은 다시 열리되 새로 찾은 것으로 세지 않는다.
  const again=await ack(sailor,'inspectDiscovery',{id:cape.id});
  assert.equal(again.ok,true,again.error);
  assert.equal(again.first,false);
  assert.equal(again.found,1);

  console.log(JSON.stringify({ok:true,discovery:cape.name,noAutoPopup:true,farRejected:true,found:opened.found,total:opened.total}));
  sailor.disconnect();
})().catch(e=>{console.error(e);process.exit(1)});
