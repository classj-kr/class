'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { fork } = require('node:child_process');
const { io } = require('socket.io-client');
const Terrain = require('../public/js/terrain.js');
const project = path.resolve(__dirname, '..');
const worldBuffer = fs.readFileSync(path.join(project, 'data/world/WORLD.CDS'));
const world = new Uint16Array(worldBuffer.buffer, worldBuffer.byteOffset, worldBuffer.length / 2);
Terrain.setNaturalEarthLandMask(fs.readFileSync(path.join(project, 'data/world/NATURAL_EARTH_LAND_MASK.bin')));
const port = Number(process.env.TEST_PORT || 31559);
const base = 'http://127.0.0.1:' + port;
const runtime = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'voyage-sites-'));
const server = fork(path.join(__dirname, 'interaction-recovery-smoke.js'), ['--fixture'], {
  env: { ...process.env, PORT: String(port), DATA_DIR: runtime }, silent: true, windowsHide: true
});
let logs = '', socket, teacher, sequence = 0;
server.stdout.on('data', data => logs += data);
server.stderr.on('data', data => logs += data);
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const ack = (event, payload = {}) => new Promise((resolve, reject) =>
  socket.timeout(7000).emit(event, payload, (error, result) => error ? reject(error) : resolve(result)));
const once = (event, predicate = () => true) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => { socket.off(event, listener); reject(Error('timeout ' + event)); }, 10000);
  function listener(value) { if (predicate(value)) { clearTimeout(timer); socket.off(event, listener); resolve(value); } }
  socket.on(event, listener);
});
const place = payload => new Promise((resolve, reject) => {
  const request = ++sequence;
  const timer = setTimeout(() => { server.off('message', listener); reject(Error('fixture timeout')); }, 5000);
  function listener(message) {
    if (message.request !== request) return;
    clearTimeout(timer); server.off('message', listener);
    message.error ? reject(Error(message.error)) : resolve(message);
  }
  server.on('message', listener); server.send({ command: 'place', request, id: socket.id, ...payload });
});
const sites=require('../data/catalog/textbook-sites.json');
const bank=require('../lib/study-question-bank');
const added=[...sites.discoveries,...sites.cityLandmarks];
function position(d,mode='land'){
  for(let ring=0;ring<=15;ring++)for(let a=0;a<24;a++){
    const lat=d.lat+ring*.02*Math.cos(a*Math.PI/12),lon=d.lon+ring*.02*Math.sin(a*Math.PI/12);
    const x=(lon+180)/360*Terrain.WORLD_PIXEL_W,y=(90-lat)/180*Terrain.WORLD_PIXEL_H;
    if((Terrain.terrainAtPixel(world,x,y).type==='sea')===(mode==='sea'))return {lat,lon,mode};
  }
  throw Error(d.id+' has no reachable '+mode+' position');
}
(async()=>{try{
  let ready=false;
  for(let i=0;i<100;i++){try{ready=(await fetch(base+'/health')).ok;}catch{}if(ready)break;await delay(100);}
  assert.ok(ready,logs);
  const catalog=await(await fetch(base+'/api/mission-catalog')).json();
  const connect=()=>new Promise(resolve=>{const s=io(base,{transports:['websocket'],reconnection:false});s.once('connect',()=>resolve(s));});
  socket=await connect();
  const room=await ack('createRoom',{roomType:'free'});
  assert.equal((await ack('joinClass',{roomCode:room.roomCode,name:'교과서자유탐험검사',hostToken:room.hostToken})).ok,true);
  assert.equal((await ack('hostStartFree')).ok,true);
  let count=0;
  for(const d of added){
    const image=await fetch(base+'/assets/landmarks/'+d.id+'.webp');assert.equal(image.status,200);
    assert.equal(Buffer.from(await image.arrayBuffer()).toString('ascii',8,12),'WEBP');
    const event=d.cityId?'inspectLandmark':'inspectDiscovery';
    if(d.cityId){
      const city=catalog.places.find(c=>c.id===d.cityId);assert.ok(city);
      await place({city:city.name});assert.equal((await ack('enterCity',{placeId:city.id})).ok,true);
    }else await place(position(d));
    const r=await ack(event,{id:d.id});assert.equal(r.ok,true,d.id+': '+r.error);assert.equal(r.first,true,d.id);
    if(!d.built)count++;
    assert.equal(r.found,count,d.id+' excludes later culture from collection count');
    assert.equal(r.total,271);
    const again=await ack(event,{id:d.id});assert.equal(again.first,false);assert.equal(again.found,count);
    if(d.cityId)await ack('leaveCity');
    else if(d.reach==='any'){
      await place(position(d,'sea'));assert.equal((await ack(event,{id:d.id})).ok,true,d.id+' usable from sea');
    }
    await place({lat:0,lon:0,mode:'sea'});assert.equal((await ack(event,{id:d.id})).ok,false,d.id+' remote rejected');
  }
  socket.disconnect();teacher=await connect();socket=await connect();
  const teach=(event,payload={})=>new Promise((resolve,reject)=>teacher.timeout(7000).emit(event,payload,(e,r)=>e?reject(e):resolve(r)));
  const race=await teach('createRoom',{roomType:'race'});
  const starts=catalog.places.filter(c=>c.isOriginalCity&&c.canEnterFromSea&&!added.some(d=>d.cityId===c.id)).slice(0,4).map(c=>c.id);
  assert.equal((await ack('joinClass',{roomCode:race.roomCode,name:'교과서문항검사'})).ok,true);
  let completed=0;
  for(let offset=0;offset<added.length;offset+=3){
    const batch=added.slice(offset,offset+3),keys=batch.map(d=>(d.cityId?'landmark:':'discovery:')+d.id);
    const published=await teach('teacherPublishArrivalRace',{startPlaceIds:starts,studyTargets:keys});
    assert.equal(published.ok,true,published.error);
    assert.equal((await ack('chooseStartCity',{optionId:starts[0]})).ok,true);
    assert.equal((await teach('teacherStartArrivalRace')).ok,true);
    for(const d of batch){
      const key=(d.cityId?'landmark:':'discovery:')+d.id,step=(event,extra={})=>ack(event,{key,missionId:published.mission.id,...extra});
      if(d.cityId){const city=catalog.places.find(c=>c.id===d.cityId);await place({city:city.name});assert.equal((await ack('enterCity',{placeId:city.id})).ok,true);}
      else {const placed=await place(position(d));assert.equal(placed.state.discoveryInteraction?.id,d.id,'assigned new site is available beside other markers');}
      let r=await step('readStudyPlace');assert.equal(r.ok,true,d.id+': '+r.error);assert.equal(r.study.phase,'reading');
      r=await step('startStudyQuiz');
      for(let i=0;i<3;i++){
        assert.equal(r.ok,true,d.id+': '+r.error);
        const q=published.mission.studyTargets.find(t=>t.key===key).questions[r.study.streak];
        assert.ok(bank[d.id].some(entry=>entry[1]===q.answer));
        r=await step('answerStudyQuestion',{token:r.study.question.token,choice:r.study.question.choices.indexOf(q.answer)});
      }
      assert.equal(r.study.phase,'completed');completed++;
      if(d.cityId)await ack('leaveCity');
      if(d===batch.at(-1)){assert.equal(r.progress.status,'completed');assert.equal(r.progress.finishRank,1);}
    }
  }
  console.log(JSON.stringify({ok:true,newSites:added.length,webpHttp:added.length,collectionCount:count,assignedPlaceQuizzesCompleted:completed,laterAssignable:true,remoteRejected:true,duplicateSafe:true}));
}finally{socket?.disconnect();teacher?.disconnect();server.kill();}})().catch(e=>{console.error(e);console.error(logs);process.exitCode=1;});
