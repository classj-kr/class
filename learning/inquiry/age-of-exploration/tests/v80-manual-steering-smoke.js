'use strict';
// 손으로 모는 배를 자동 항로가 가로채면 안 된다. 단체 수업에서 배가 제멋대로 가던 문제.
const {io}=require('socket.io-client');
const assert=require('node:assert/strict');
const BASE=process.env.TEST_URL||'http://127.0.0.1:3000';
const { joinFreeRoom }=require('./_rooms');
const TILE=16,WORLD_W=2500,WORLD_H=1250;
function connect(){return io(BASE,{transports:['websocket'],forceNew:true,reconnection:false,timeout:7000});}
function once(s,e,p=()=>true,t=25000){return new Promise((r,j)=>{const x=setTimeout(()=>{s.off(e,on);j(new Error(`timeout:${e}`));},t);function on(d){if(!p(d))return;clearTimeout(x);s.off(e,on);r(d)}s.on(e,on)});}
function ack(s,e,p={}){return new Promise((r,j)=>{const x=setTimeout(()=>j(new Error(`ack:${e}`)),10000);s.emit(e,p,d=>{clearTimeout(x);r(d)})});}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const sailor=connect();
  await once(sailor,'connect');
  const room=await joinFreeRoom(ack,sailor,'조타학생');
  assert.equal(room.ok,true,room.error);
  const start=await once(sailor,'snapshot',x=>x.you.mode==='sea');

  // 먼 곳을 찍어 자동 항로를 만든다. 리스본에서 카나리아 제도 쪽.
  sailor.emit('setTarget',{x:((-15.6+180)/360)*WORLD_W*TILE,y:((90-28.3)/180)*WORLD_H*TILE});
  await sleep(1500);
  const sailing=await once(sailor,'snapshot');
  assert.ok(sailing.you.x!==start.you.x||sailing.you.y!==start.you.y,'자동 항로로 움직여야 한다');

  // 이제 손으로 북쪽으로 몬다. 자동 항로는 여기서 버려져야 한다.
  sailor.emit('input',{up:true});
  await sleep(2500);
  const a=await once(sailor,'snapshot');
  await sleep(2000);
  const b=await once(sailor,'snapshot');
  sailor.emit('input',{});

  // 북쪽으로 눌렀으니 y 가 줄어야 한다. 자동 항로가 남아 있으면 남쪽 목적지로 끌려간다.
  assert.ok(b.you.y<a.you.y,`방향키로 북쪽으로 몰면 북쪽으로 가야 한다: ${Math.round(a.you.y)} → ${Math.round(b.you.y)}`);

  // 다시 방향키를 놓아도 옛 목적지로 저절로 떠나면 안 된다.
  await sleep(2500);
  const c=await once(sailor,'snapshot');
  await sleep(2000);
  const d=await once(sailor,'snapshot');
  const drift=Math.hypot(d.you.x-c.you.x,d.you.y-c.you.y);
  assert.ok(drift<TILE*2,`손을 떼면 배가 멈춰야 한다(해류 빼고): ${Math.round(drift)}픽셀`);

  console.log(JSON.stringify({ok:true,manualSteerWins:true,northMoved:Math.round(a.you.y-b.you.y),driftAfterRelease:Math.round(drift)}));
  sailor.disconnect();
})().catch(e=>{console.error(e);process.exit(1)});
