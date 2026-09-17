'use strict';
const {io}=require('socket.io-client');
const assert=require('node:assert/strict');
const BASE=process.env.TEST_URL||'http://127.0.0.1:3000';
function connect(){return io(BASE,{transports:['websocket'],forceNew:true,reconnection:false});}
function once(socket,event,predicate=()=>true,timeout=12000){return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{socket.off(event,onEvent);reject(new Error(`timeout:${event}`));},timeout);function onEvent(data){if(!predicate(data))return;clearTimeout(timer);socket.off(event,onEvent);resolve(data)}socket.on(event,onEvent)})}
function ack(socket,event,payload={}){return new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error(`ack:${event}`)),8000);socket.emit(event,payload,result=>{clearTimeout(timer);resolve(result)})})}
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
(async()=>{
  const host=connect(),guest=connect();
  await Promise.all([once(host,'connect'),once(guest,'connect')]);

  // 자유 항해 방 만들기
  const room=await ack(host,'createRoom',{roomType:'free'});
  assert.equal(room.ok,true,room.error);
  assert.match(room.roomCode,/^\d{4}$/);
  assert.equal(room.roomType,'free');
  assert.ok(room.hostToken,'방장 표가 와야 한다');
  assert.equal(room.settings.started,false);

  // 방장이 방장 표를 들고 입장
  const hostJoin=await ack(host,'joinClass',{roomCode:room.roomCode,name:'방장항해사',hostToken:room.hostToken});
  assert.equal(hostJoin.ok,true,hostJoin.error);
  assert.equal(hostJoin.isHost,true);
  assert.equal(hostJoin.roomType,'free');

  // 두 번째 사람은 틀린 표로 들어와도 방장이 아니다
  const guestJoin=await ack(guest,'joinClass',{roomCode:room.roomCode,name:'손님항해사',hostToken:'wrong-token'});
  assert.equal(guestJoin.ok,true,guestJoin.error);
  assert.equal(guestJoin.isHost,false);
  const gap=Math.hypot(guestJoin.self.x-hostJoin.self.x,guestJoin.self.y-hostJoin.self.y);
  assert.ok(gap>0&&gap<200,`두 번째 배는 리스본 항구 곁에 조금 비켜 나와야 한다: ${gap}`);

  // 손님은 출발시킬 수 없고, 옛 교사 비밀번호로 현황판을 열 수도 없다
  const guestStart=await ack(guest,'hostStartFree',{});
  assert.equal(guestStart.ok,false);
  const pinJoin=await ack(guest,'teacherJoin',{roomCode:room.roomCode,pin:'2468'});
  assert.equal(pinJoin.ok,false);

  // 출발 전: 시계가 멈춰 있고 배도 움직이지 않는다
  const before1=await once(host,'snapshot');
  assert.equal(before1.roomType,'free');
  assert.equal(before1.portInteraction?.placeId,'lisbon');
  host.emit('input',{left:true});
  await sleep(700);
  const before2=await once(host,'snapshot');
  host.emit('input',{left:false});
  assert.equal(before2.classGameMinutes,before1.classGameMinutes,'출발 전에는 게임 시계가 흐르면 안 된다');
  assert.ok(Math.hypot(before2.you.x-before1.you.x,before2.you.y-before1.you.y)<1,'출발 전에는 배가 움직이면 안 된다');

  // 방장이 출발시키면 손님도 출발 신호를 받는다
  const started=once(guest,'classControl',settings=>settings?.started===true);
  const go=await ack(host,'hostStartFree',{});
  assert.equal(go.ok,true,go.error);
  assert.equal(go.settings.started,true);
  await started;

  // 출발 뒤: 시계가 흐른다
  const after1=await once(host,'snapshot');
  await sleep(700);
  const after2=await once(host,'snapshot');
  assert.ok(after2.classGameMinutes>after1.classGameMinutes,'출발 뒤에는 게임 시계가 흘러야 한다');

  console.log(JSON.stringify({ok:true,roomCode:room.roomCode,hostIsHost:true,guestIsHost:false,guestCannotStart:true,pinRejected:true,clockFrozenBeforeStart:true,clockAdvancedAfterStart:Math.round(after2.classGameMinutes-after1.classGameMinutes)}));
  host.disconnect();guest.disconnect();
})().catch(error=>{console.error(error);process.exit(1)});
