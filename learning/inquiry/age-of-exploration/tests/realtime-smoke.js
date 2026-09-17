'use strict';
const { io } = require('socket.io-client');
const assert = require('node:assert/strict');

const url = process.env.TEST_URL || 'http://127.0.0.1:3000';
function connect() {
  return io(url, { transports: ['websocket'], forceNew: true, reconnection: false });
}
function once(socket, event, timeout=4000) {
  return new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(new Error(`timeout: ${event}`)),timeout);
    socket.once(event,(data)=>{clearTimeout(timer);resolve(data)});
  });
}
function emitAck(socket,event,payload){
  return new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(new Error(`ack timeout: ${event}`)),4000);
    socket.emit(event,payload,(data)=>{clearTimeout(timer);resolve(data)});
  });
}
(async()=>{
  const a=connect(), b=connect(), teacher=connect();
  await Promise.all([once(a,'connect'),once(b,'connect'),once(teacher,'connect')]);
  // 미션 없이 실시간으로 움직이고 서로 보는 검사라 자유 항해 방을 쓴다. 방장(teacher)은 방만 열고 출발시킨다.
  const tr=await emitAck(teacher,'createRoom',{roomType:'free'});
  assert.equal(tr.ok,true,tr.error);
  const go=await emitAck(teacher,'hostStartFree',{});
  assert.equal(go.ok,true,go.error);
  const [ar,br]=await Promise.all([
    emitAck(a,'joinClass',{roomCode:tr.roomCode,name:'하늘'}),
    emitAck(b,'joinClass',{roomCode:tr.roomCode,name:'바다'})
  ]);
  assert.equal(ar.ok,true,ar.error);assert.equal(br.ok,true,br.error);
  const as=await once(a,'snapshot');
  assert.equal(as.online,2);assert.ok(as.nearby.some(p=>p.name==='바다'));
  const before=as.you.x;
  a.emit('input',{right:true});
  await new Promise(r=>setTimeout(r,350));
  const after=await once(a,'snapshot');
  assert.ok(after.you.x>before,'player should move right');
  const ts=await once(teacher,'teacherSnapshot');
  assert.equal(ts.players.length,2);
  assert.ok(ts.players.some(p=>p.name==='하늘'));
  console.log(JSON.stringify({ok:true,online:after.online,nearby:after.nearby.length,moved:after.you.x-before,teacherPlayers:ts.players.length}));
  a.disconnect();b.disconnect();teacher.disconnect();
})().catch(err=>{console.error(err);process.exitCode=1});
