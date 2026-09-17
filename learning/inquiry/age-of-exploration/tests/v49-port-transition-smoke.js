'use strict';
const { io }=require('socket.io-client');
const assert=require('node:assert/strict');
const { openRaceRoom }=require('./_rooms');
const BASE=process.env.TEST_URL||'http://127.0.0.1:3107';
function c(){return io(BASE,{transports:['websocket'],forceNew:true,reconnection:false});}
function once(s,e,p=()=>true,t=7000){return new Promise((res,rej)=>{const timer=setTimeout(()=>{s.off(e,on);rej(new Error('timeout:'+e));},t);function on(d){if(!p(d))return;clearTimeout(timer);s.off(e,on);res(d)}s.on(e,on)});}
function ack(s,e,p={}){return new Promise((res,rej)=>{const timer=setTimeout(()=>rej(new Error('ack:'+e)),7000);s.emit(e,p,d=>{clearTimeout(timer);res(d)})});}
(async()=>{
 const teacher=c(),student=c(); await Promise.all([once(teacher,'connect'),once(student,'connect')]);
 const created=await openRaceRoom(ack,teacher);
 const pub=await ack(teacher,'teacherPublishArrivalRace',{targetPlaceId:'crimea_peninsula',startPlaceIds:['lisbon','london','istanbul','original_city_195']}); assert.equal(pub.ok,true,pub.error);
 const joined=await ack(student,'joinClass',{roomCode:created.roomCode,name:'전환검사'}); assert.equal(joined.ok,true,joined.error);
 const chosen=await ack(student,'chooseStartCity',{optionId:'lisbon'}); assert.equal(chosen.ok,true,chosen.error);
 const started=await ack(teacher,'teacherStartArrivalRace',{}); assert.equal(started.ok,true,started.error);
 // heartbeat를 전혀 보내지 않아도 서버 시계와 전환이 진행되어야 한다.
 const ready=await once(student,'snapshot',s=>s.portInteraction?.placeId==='lisbon'&&s.you.mode==='sea');
 // 바다에서 항구를 누르면 도시 안으로 입항하고, 도시에서 출항하면 다시 바다로 나간다.
 const t0=Date.now(); const use=await ack(student,'useCatalogPort',{placeId:'lisbon'}); assert.equal(use.ok,true,use.error);
 await once(student,'snapshot',s=>s.you.mode==='city'&&!s.you.transition,4000);
 const elapsed1=Date.now()-t0; assert.ok(elapsed1<1800,`입항 ${elapsed1}ms`);
 const t1=Date.now(); const board=await ack(student,'departCity',{}); assert.equal(board.ok,true,board.error);
 await once(student,'snapshot',s=>s.you.mode==='sea'&&!s.you.transition,4000);
 const elapsed2=Date.now()-t1; assert.ok(elapsed2<1800,`출항 ${elapsed2}ms`);
 teacher.disconnect(); student.disconnect();
 console.log(JSON.stringify({ok:true,withoutHeartbeat:true,portEntryMs:elapsed1,departMs:elapsed2}));
})().catch(e=>{console.error(e);process.exit(1)});
