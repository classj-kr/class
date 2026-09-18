'use strict';
// 좁은 해협 통과. 실제 해안선 덮개를 씌운 뒤로 보스포루스·다르다넬스·지브롤터처럼
// 폭이 한두 칸인 물길이 생겼고, 그 안쪽에서 출발한 배가 갇혀 있었다(2026-09-18 수업에서 터짐).
const {io}=require('socket.io-client');
const assert=require('node:assert/strict');
const BASE=process.env.TEST_URL||'http://127.0.0.1:3000';
const { openRaceRoom }=require('./_rooms');
const TILE=16,WORLD_W=2500,WORLD_H=1250;
function connect(){return io(BASE,{transports:['websocket'],forceNew:true,reconnection:false,timeout:8000});}
function once(s,e,p=()=>true,t=30000){return new Promise((r,j)=>{const x=setTimeout(()=>{s.off(e,on);j(new Error(`timeout:${e}`));},t);function on(d){if(!p(d))return;clearTimeout(x);s.off(e,on);r(d)}s.on(e,on)});}
function ack(s,e,p={}){return new Promise((r,j)=>{const x=setTimeout(()=>j(new Error(`ack:${e}`)),12000);s.emit(e,p,d=>{clearTimeout(x);r(d)})});}
const pixel=(lat,lon)=>({x:((lon+180)/360)*WORLD_W*TILE,y:((90-lat)/180)*WORLD_H*TILE});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

// 안쪽 바다에 갇혀 있던 출발지들. 모두 좁은 해협을 지나야 대서양으로 나온다.
const TRAPPED=[
  { id:'istanbul', name:'이스탄불', straits:'보스포루스·다르다넬스' },
  { id:'original_city_195', name:'베네치아', straits:'오트란토·메시나' },
  { id:'amsterdam', name:'암스테르담', straits:'네덜란드 앞바다' }
];

(async()=>{
  const results=[];
  for (const start of TRAPPED) {
    const teacher=connect(), student=connect();
    await Promise.all([once(teacher,'connect'),once(student,'connect')]);
    const room=await openRaceRoom(ack,teacher);
    const startIds=[start.id,'lisbon','london','havana'].filter((v,i,a)=>a.indexOf(v)===i).slice(0,4);
    const published=await ack(teacher,'teacherPublishArrivalRace',{targetPlaceId:'gibraltar_strait',startPlaceIds:startIds});
    assert.equal(published.ok,true,published.error);
    const joined=await ack(student,'joinClass',{roomCode:room.roomCode,name:'해협학생'});
    assert.equal(joined.ok,true,joined.error);
    const option=joined.mission.startOptions.find(o=>o.startPlace.id===start.id);
    assert.ok(option,`${start.name} 출발 선택지가 필요하다`);
    assert.equal((await ack(student,'chooseStartCity',{optionId:option.id})).ok,true);
    assert.equal((await ack(teacher,'teacherStartArrivalRace',{})).ok,true);
    await once(student,'snapshot',x=>x.you.mode==='sea');

    student.emit('setTarget',pixel(35.96,-5.61));
    let arrivedSeconds=null;
    for (let i=0;i<32;i+=1) {
      await sleep(2500);
      const snap=await once(student,'snapshot');
      if (snap.progress?.finalQuizStatus==='answering') { arrivedSeconds=(i+1)*2.5; break; }
    }
    assert.ok(arrivedSeconds,`${start.name}에서 출발한 배가 ${start.straits}를 지나 지브롤터까지 가야 한다`);
    results.push({ city:start.name, seconds:arrivedSeconds });
    teacher.disconnect(); student.disconnect();
  }
  console.log(JSON.stringify({ ok:true, arrivals:results }));
})().catch(e=>{console.error(e);process.exit(1)});
