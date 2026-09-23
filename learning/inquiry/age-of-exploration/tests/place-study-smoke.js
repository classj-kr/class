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
const port = Number(process.env.TEST_PORT || 31549);
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
(async () => {
  try {
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      try { ready = (await fetch(base + '/health')).ok; } catch {}
      if (ready) break;
      await delay(100);
    }
    assert.ok(ready, logs);
    const catalog = await (await fetch(base + '/api/mission-catalog')).json();

    const connect=()=>new Promise(resolve=>{const s=io(base,{transports:['websocket'],reconnection:false});s.once('connect',()=>resolve(s));});
    teacher=await connect();socket=await connect();
    const teach=(event,payload={})=>new Promise((resolve,reject)=>teacher.timeout(7000).emit(event,payload,(e,r)=>e?reject(e):resolve(r)));
    const room=await teach('createRoom',{roomType:'race'}),starts=catalog.places.filter(p=>p.isOriginalCity&&p.canEnterFromSea&&p.id!=='lisbon').slice(0,4).map(p=>p.id);
    const targets=['city:lisbon','discovery:batur-caldera','discovery:milford-sound'];
    for(const bad of [[],[...targets,'discovery:lm-table-mountain'],[targets[0],targets[0]],['city:missing']]){
      assert.equal((await teach('teacherPublishArrivalRace',{startPlaceIds:starts,studyTargets:bad})).ok,false);
    }
    assert.equal((await ack('teacherPublishArrivalRace',{startPlaceIds:starts,studyTargets:targets})).ok,false,'student cannot publish');
    const published=await teach('teacherPublishArrivalRace',{startPlaceIds:starts,studyTargets:targets});
    assert.equal(published.ok,true,published.error);assert.equal(published.mission.studyTargets.length,3);assert.deepEqual(published.mission.studyTargets.map(t=>t.key),targets,'only teacher-selected places');assert.ok(!published.mission.hunt,'no automatic animal mission');
    const mid=published.mission.id,privateTargets=published.mission.studyTargets;
    const joined=await ack('joinClass',{roomCode:room.roomCode,name:'장소학습검사'});assert.equal(joined.ok,true);
    assert.ok(joined.mission.studyTargets.every(t=>!t.questions&&!t.reading),'answers not in student mission');
    assert.equal((await ack('chooseStartCity',{optionId:starts[0]})).ok,true);
    await place({lat:-8.24,lon:115.38});
    assert.equal((await ack('readStudyPlace',{key:targets[1],missionId:mid})).ok,false,'cannot read before class start');
    assert.equal((await teach('teacherStartArrivalRace')).ok,true);
    await place({lat:0,lon:0,mode:'sea'});
    assert.equal((await ack('readStudyPlace',{key:targets[1],missionId:mid})).ok,false,'remote read rejected');
    const batur=targets[1];await place({lat:-8.24,lon:115.38});
    assert.equal((await ack('submitFinalQuiz',{answers:[0,0,0]})).ok,false,'legacy final quiz cannot bypass');
    assert.equal((await ack('startStudyQuiz',{key:batur,missionId:mid})).ok,false,'reading must precede quiz');
    let r=await ack('inspectDiscovery',{id:'batur-caldera'});assert.equal(r.study.phase,'reading');assert.equal(r.found,undefined);
    assert.equal(r.progress.studyPlaces.filter(p=>p.phase==='completed').length,0,'inspection alone not completion');
    const step=(event,key,extra={})=>ack(event,{key,missionId:mid,...extra});
    const choice=(r)=>{const privateQ=privateTargets.find(t=>t.key===r.study.key).questions[r.study.streak];return r.study.question.choices.indexOf(privateQ.answer);};
    r=await step('startStudyQuiz',batur);assert.equal(r.study.question.answerIndex,undefined);
    const oldToken=r.study.question.token;
    r=await step('answerStudyQuestion',batur,{token:oldToken,choice:choice(r)});assert.equal(r.study.streak,1);
    assert.equal((await step('answerStudyQuestion',batur,{token:oldToken,choice:0})).ok,false,'duplicate answer rejected');
    r=await step('answerStudyQuestion',batur,{token:r.study.question.token,choice:choice(r)});assert.equal(r.study.streak,2);assert.equal(r.study.phase,'quiz');
    r=await step('answerStudyQuestion',batur,{token:r.study.question.token,choice:(choice(r)+1)%4});assert.equal(r.study.streak,0);assert.equal(r.study.phase,'reading');
    r=await step('startStudyQuiz',batur);r=await step('answerStudyQuestion',batur,{token:r.study.question.token,choice:choice(r)});assert.equal(r.study.streak,1);
    r=await step('answerStudyQuestion',batur,{token:r.study.question.token,choice:choice(r)});assert.equal(r.study.streak,2);assert.equal(r.study.phase,'quiz');
    const continuing=r;
    await place({lat:0,lon:0,mode:'sea'});
    assert.equal((await step('answerStudyQuestion',batur,{token:r.study.question.token,choice:choice(r)})).ok,false,'must still be at target');
    await place({lat:-8.24,lon:115.38});
    socket.disconnect();await delay(120);const recon=once('connect');socket.connect();await recon;
    const resumed=await ack('resumeVoyager',{resumeToken:joined.resumeToken});assert.equal(resumed.ok,true);assert.equal(resumed.progress.studyPlaces.find(p=>p.key===batur).streak,2);
    r=await step('readStudyPlace',batur);assert.equal(r.study.question.token,continuing.study.question.token);
    await teach('teacherSetPaused',{paused:true});
    assert.equal((await step('answerStudyQuestion',batur,{token:r.study.question.token,choice:choice(r)})).ok,false);
    await teach('teacherSetPaused',{paused:false});
    r=await step('answerStudyQuestion',batur,{token:r.study.question.token,choice:choice(r)});assert.equal(r.study.phase,'completed');assert.notEqual(r.progress.status,'completed');
    for(const [key,position] of [
      [targets[0],{city:'리스본'}],
      [targets[2],{lat:-44.62,lon:167.75,mode:'sea'}]
    ]){
      await place(position);
      if(position.city){assert.equal((await step('readStudyPlace',key)).ok,false);const entered=await ack('enterCity',{placeId:'lisbon'});assert.equal(entered.ok,true,entered.error);}
      r=await step('readStudyPlace',key);assert.equal(r.ok,true,r.error);r=await step('startStudyQuiz',key);
      for(let i=0;i<3;i++){r=await step('answerStudyQuestion',key,{token:r.study.question.token,choice:choice(r)});assert.equal(r.study.phase,i===2?'completed':'quiz');}
      assert.equal(r.study.phase,'completed');
    }
    assert.equal(r.progress.status,'completed');assert.equal(r.progress.finishRank,1);
    assert.equal(r.progress.studyPlaces.filter(p=>p.phase==='completed').length,3);
    const stamp=r.progress.completedAt;
    assert.equal((await step('answerStudyQuestion',targets[2],{token:'old',choice:0})).ok,false);
    r=await step('readStudyPlace',targets[2]);assert.equal(r.progress.completedAt,stamp);
    const board=await new Promise(resolve=>teacher.once('teacherSnapshot',resolve));
    assert.equal(board.progress[0].studyPlaces.filter(p=>p.phase==='completed').length,3);
    const replacement=await teach('teacherPublishArrivalRace',{startPlaceIds:starts,studyTargets:[targets[1]]});
    assert.equal(replacement.ok,true);
    assert.equal((await step('startStudyQuiz',batur)).ok,false,'stale mission rejected');
    // Geographic discoveries accept distant parts of the same region, not a single marker.
    const regionKeys=['discovery:andes','discovery:alps','discovery:sahara'];
    const regionMission=await teach('teacherPublishArrivalRace',{startPlaceIds:starts,studyTargets:regionKeys});
    assert.equal(regionMission.ok,true,regionMission.error);
    assert.equal((await ack('chooseStartCity',{optionId:starts[0]})).ok,true);
    assert.equal((await teach('teacherStartArrivalRace')).ok,true);
    const regionStep=(event,key,extra={})=>ack(event,{key,missionId:regionMission.mission.id,...extra});
    await place({lat:-20,lon:-55});
    assert.equal((await regionStep('readStudyPlace',regionKeys[0])).ok,false,'outside the Andes is rejected');
    await place({lat:-33,lon:-70,mode:'sea'});
    assert.equal((await regionStep('readStudyPlace',regionKeys[0])).ok,false,'an inland region requires landing');
    const overlapping=await place({lat:-13.1631,lon:-72.545});
    assert.equal(overlapping.state.discoveryInteraction.id,'andes','assigned region remains available beside a specific landmark');
    for(const[key,lat,lon]of[[regionKeys[0],-33,-70],[regionKeys[1],47,13],[regionKeys[2],26,-5]]){
      const placed=await place({lat,lon});assert.equal(placed.state.discoveryInteraction.id,key.split(':')[1]);
      r=await regionStep('readStudyPlace',key);assert.equal(r.ok,true,r.error);
      r=await regionStep('startStudyQuiz',key);
      for(let i=0;i<3;i++){
        const q=regionMission.mission.studyTargets.find(t=>t.key===key).questions[r.study.streak];
        r=await regionStep('answerStudyQuestion',key,{token:r.study.question.token,choice:r.study.question.choices.indexOf(q.answer)});
        assert.equal(r.ok,true,r.error);
      }
      assert.equal(r.study.phase,'completed');
      if(key===regionKeys[0]){
        const after=await place({lat:-13.1631,lon:-72.545});
        assert.equal(after.state.discoveryInteraction.id,'machu-picchu','completed wide region does not hide a nearby landmark');
      }
    }
    assert.equal(r.progress.status,'completed');assert.equal(r.progress.finishRank,1);
    console.log(JSON.stringify({ok:true,mixedTargets:3,unorderedVisits:true,consecutiveReset:true,replayRejected:true,reconnect:true,paused:true,cityRequiresEntry:true,teacherProgress:true,geographicRegions:3,nearbyLandmarkPriority:true}));
  } finally { socket?.disconnect(); teacher?.disconnect(); server.kill(); }
})().catch(error => { console.error(error); console.error(logs); process.exitCode = 1; });
