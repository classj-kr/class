'use strict';
// 동물 잡기 경주. 참가자마다 자기 동물이 따로 있고, 그 동물을 잡아야 최종 문제로 넘어간다.
const {io}=require('socket.io-client');
const assert=require('node:assert/strict');
const BASE=process.env.TEST_URL||'http://127.0.0.1:3000';
const { openRaceRoom }=require('./_rooms');
const animals=require('../data/catalog/sea-animals.json');
const discoveries=require('../data/catalog/discoveries.json');
const TILE=16,WORLD_W=2500,WORLD_H=1250;
function connect(){return io(BASE,{transports:['websocket'],forceNew:true,reconnection:false,timeout:8000});}
function once(s,e,p=()=>true,t=30000){return new Promise((r,j)=>{const x=setTimeout(()=>{s.off(e,on);j(new Error(`timeout:${e}`));},t);function on(d){if(!p(d))return;clearTimeout(x);s.off(e,on);r(d)}s.on(e,on)});}
function ack(s,e,p={}){return new Promise((r,j)=>{const x=setTimeout(()=>j(new Error(`ack:${e}`)),12000);s.emit(e,p,d=>{clearTimeout(x);r(d)})});}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

(async()=>{
  const hunt=animals.find(a=>a.id==='hunt-sea-turtle');
  const place=discoveries.find(d=>d.id===hunt.placeId);
  const teacher=connect(), a=connect(), b=connect();
  await Promise.all([once(teacher,'connect'),once(a,'connect'),once(b,'connect')]);
  const room=await openRaceRoom(ack,teacher);

  // 목적지는 동물이 사는 바다로 저절로 정해진다. 엉뚱한 지형을 넣어도 끌려가지 않는다.
  const wrong=await ack(teacher,'teacherPublishArrivalRace',{targetPlaceId:'gibraltar_strait',startPlaceIds:['havana','lisbon','london','amsterdam'],huntAnimalId:hunt.id});
  assert.equal(wrong.ok,true,wrong.error);
  assert.equal(wrong.mission.targetPlace.id,place.id,'목적지는 동물이 사는 바다여야 한다');

  const unknown=await ack(teacher,'teacherPublishArrivalRace',{targetPlaceId:place.id,startPlaceIds:['havana','lisbon','london','amsterdam'],huntAnimalId:'hunt-없는동물'});
  assert.equal(unknown.ok,false,'없는 동물은 거절해야 한다');

  const published=await ack(teacher,'teacherPublishArrivalRace',{targetPlaceId:place.id,startPlaceIds:['havana','lisbon','london','amsterdam'],huntAnimalId:hunt.id});
  assert.equal(published.ok,true,published.error);
  assert.equal(published.mission.hunt.animal,'바다거북');
  assert.match(published.mission.instructions,/바다거북/);

  const players=[];
  for (const [socket,name] of [[a,'사냥학생하나'],[b,'사냥학생둘']]) {
    const joined=await ack(socket,'joinClass',{roomCode:room.roomCode,name});
    assert.equal(joined.ok,true,joined.error);
    const option=joined.mission.startOptions.find(o=>o.startPlace.id==='havana');
    assert.equal((await ack(socket,'chooseStartCity',{optionId:option.id})).ok,true);
    players.push({socket,name});
  }
  assert.equal((await ack(teacher,'teacherStartArrivalRace',{})).ok,true);

  // 참가자마다 자기 동물이 따로 있다.
  const seen=[];
  for (const {socket} of players) {
    const snap=await once(socket,'snapshot',x=>x.huntInteraction);
    assert.equal(snap.huntInteraction.animal,'바다거북');
    assert.equal(snap.huntInteraction.caught,false);
    seen.push({x:snap.huntInteraction.x,y:snap.huntInteraction.y});
  }
  assert.ok(seen[0].x!==seen[1].x||seen[0].y!==seen[1].y,'참가자마다 동물이 따로 있어야 한다');

  // 동물이 사는 바다 안에서 어슬렁거린다.
  const homeX=((place.lon+180)/360)*WORLD_W*TILE, homeY=((90-place.lat)/180)*WORLD_H*TILE;
  const first=await once(players[0].socket,'snapshot',x=>x.huntInteraction);
  await sleep(3000);
  const second=await once(players[0].socket,'snapshot',x=>x.huntInteraction);
  assert.ok(first.huntInteraction.x!==second.huntInteraction.x||first.huntInteraction.y!==second.huntInteraction.y,'동물이 움직여야 한다');
  const away=Math.hypot(second.huntInteraction.x-homeX,second.huntInteraction.y-homeY)/TILE;
  assert.ok(away<=hunt.roamRadiusTiles+2,`동물이 사는 바다를 벗어나면 안 된다: ${Math.round(away)}칸`);

  // 멀리서는 못 잡는다.
  const tooFar=await ack(players[0].socket,'catchAnimal',{});
  assert.equal(tooFar.ok,false,'멀리서 잡히면 안 된다');
  assert.match(tooFar.error,/가까이/);

  // 동물 곁으로 가서 잡으면 최종 문제로 넘어간다.
  let caught=null;
  for (let i=0;i<70;i+=1) {
    const snap=await once(players[0].socket,'snapshot',x=>x.huntInteraction);
    if (snap.huntInteraction.withinReach) { caught=await ack(players[0].socket,'catchAnimal',{}); break; }
    // 학생이 이따금 동물 쪽을 다시 찍는 정도로만 쫓는다.
    players[0].socket.emit('setTarget',{x:snap.huntInteraction.x,y:snap.huntInteraction.y});
    await sleep(1200);
  }
  assert.ok(caught?.ok,'동물 곁에 닿으면 잡을 수 있어야 한다');
  assert.equal(caught.already,false);
  assert.equal(caught.animal.name,'바다거북');
  assert.ok(caught.animal.text.length>40,'잡으면 그 동물 설명이 나와야 한다');
  assert.match(caught.animal.image,/\/assets\/landmarks\/hunt-sea-turtle\.webp\?v=\d+$/,'그 지형이 아니라 동물 사진이 나와야 한다');
  assert.ok(caught.animal.imageCredit.startsWith('사진 '),'사진 출처를 함께 보여 줘야 한다');

  const quiz=await once(players[0].socket,'snapshot',x=>x.progress?.finalQuizStatus==='answering');
  assert.equal(quiz.progress.finalQuizStatus,'answering','잡으면 최종 문제가 열려야 한다');

  // 다른 참가자의 동물은 그대로 남아 있다.
  const other=await once(players[1].socket,'snapshot',x=>x.huntInteraction);
  assert.equal(other.huntInteraction.caught,false,'남의 동물까지 잡히면 안 된다');

  console.log(JSON.stringify({ok:true,animal:'바다거북',perPlayerAnimals:true,roams:true,farRejected:true,quizOpened:true}));
  teacher.disconnect();a.disconnect();b.disconnect();
})().catch(e=>{console.error(e);process.exit(1)});
