'use strict';
const assert = require('node:assert/strict');
const {io} = require('socket.io-client');
const BASE = process.env.TEST_URL || 'http://127.0.0.1:3000';
const socketPath = process.env.TEST_SOCKET_PATH || '/socket.io';
const sockets = [];
function connect(){const s=io(BASE,{path:socketPath,transports:['websocket'],forceNew:true,reconnection:false});sockets.push(s);return new Promise((resolve,reject)=>{s.once('connect',()=>resolve(s));s.once('connect_error',reject);});}
function ack(s,event,payload={}){return new Promise((resolve,reject)=>{s.timeout(8000).emit(event,payload,(error,result)=>error?reject(error):resolve(result));});}
(async()=>{
 const host=await connect(),student=await connect();
 const room=await ack(host,'createRoom',{roomType:'race'});assert.equal(room.ok,true,room.error);
 const joined=await ack(student,'joinClass',{roomCode:room.roomCode,name:'출발지 검증'});assert.equal(joined.ok,true,joined.error);
 const catalog=await (await fetch(BASE+'/api/mission-catalog')).json();
 const starts=catalog.places.filter(p=>p.isOriginalCity&&p.canEnterFromSea===true&&p.id!=='lisbon').slice(0,5).map(p=>p.id);
 assert.equal(starts.length,5);
 const accepted=[];
 for(let count=1;count<=4;count++){
  const result=await ack(host,'teacherPublishArrivalRace',{studyTargets:['city:lisbon'],startPlaceIds:starts.slice(0,count)});
  assert.equal(result.ok,true,result.error);assert.equal(result.mission.startOptions.length,count);
  assert.deepEqual(result.mission.startOptions.map(o=>o.id),starts.slice(0,count));
  const tooSoon=await ack(host,'teacherStartArrivalRace');assert.equal(tooSoon.ok,false);assert.match(tooSoon.error,/고르지 않은 학생/);
  const outside=await ack(student,'chooseStartCity',{optionId:starts[4]});assert.equal(outside.ok,false);
  const selected=await ack(student,'chooseStartCity',{optionId:starts[count-1]});assert.equal(selected.ok,true,selected.error);
  assert.equal(selected.progress.selectedStartPlaceId,starts[count-1]);
  assert.equal((await ack(student,'chooseStartCity',{optionId:starts[0]})).ok,false,'선택 후 변경 금지');
  const started=await ack(host,'teacherStartArrivalRace');assert.equal(started.ok,true,started.error);assert.equal(started.mission.phase,'running');
  accepted.push(count);
 }
 for(const invalid of [[],starts,[starts[0],starts[0]]]){
  const result=await ack(host,'teacherPublishArrivalRace',{studyTargets:['city:lisbon'],startPlaceIds:invalid});
  assert.equal(result.ok,false,JSON.stringify(invalid));assert.match(result.error,/1~4곳|서로 다르게/);
 }
 const legacy=await ack(host,'teacherPublishArrivalRace',{targetPlaceId:'gibraltar_strait',startPlaceIds:[starts[0],'']});
 assert.equal(legacy.ok,true,legacy.error);assert.equal(legacy.mission.startOptions.length,1);
 console.log(JSON.stringify({ok:true,acceptedCounts:accepted,rejected:['zero','five','duplicate','unpublished city'],studentChoiceAndTeacherStart:true,legacyArrivalOneCity:true}));
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>sockets.forEach(s=>s.disconnect()));
