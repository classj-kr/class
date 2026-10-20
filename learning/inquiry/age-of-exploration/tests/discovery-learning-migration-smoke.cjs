'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {fork}=require('node:child_process'),Study=require('../lib/place-study');
const runtime=fs.mkdtempSync(path.join(os.tmpdir(),'voyage-learning-migration-'));
const key='landmark:lm-giza-from-cairo',id='saved-mission';
const records=['lm-giza-from-cairo','giza-pyramids','lm-versailles-later','nidaros-cathedral'];
const done={status:'completed',finishRank:2,completedAt:12345,placeStudy:{places:{[key]:{phase:'completed',streak:3,completedAt:12345}}}};
const working={status:'inProgress',placeStudy:{places:{[key]:{phase:'quiz',streak:2,token:'stale-token',order:[0,1,2,3]}}}};
const file=path.join(runtime,'classroom-state.json');
fs.writeFileSync(file,JSON.stringify({version:10,rooms:{'1234':{host:{tokenHash:'test',createdAt:Date.now()},activeMission:{id,kind:'arrivalRace',phase:'running',studyTargets:[{key,id:'lm-giza-from-cairo',type:'landmark',questions:[{answer:'만'}]}]},progress:{완료학생:{[id]:done},진행학생:{[id]:working}},discoveries:{완료학생:records}}}}));
const server=fork(path.join(__dirname,'voyage-classroom-browser.cjs'),['--fixture'],{env:{...process.env,PORT:'0',DATA_DIR:runtime},silent:true,windowsHide:true});
let logs='';server.stdout.on('data',d=>logs+=d);server.stderr.on('data',d=>logs+=d);
(async()=>{try{
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error(logs||'server timeout')),15000);server.on('message',m=>{if(m.port){clearTimeout(timer);resolve();}});server.on('exit',code=>{clearTimeout(timer);reject(Error('server exited '+code+': '+logs));});});
  let room;
  for(let i=0;i<50;i++){
    room=JSON.parse(fs.readFileSync(file,'utf8')).rooms['1234'];
    if(room.activeMission.studyTargets[0].questionsVersion===Study.QUESTIONS_VERSION)break;
    await new Promise(resolve=>setTimeout(resolve,100));
  }
  const target=room.activeMission.studyTargets[0];
  assert.equal(target.questionsVersion,Study.QUESTIONS_VERSION);assert.equal(target.key,key);
  assert.equal(target.id,'giza-pyramids');assert.equal(target.type,'discovery');
  assert.ok(target.questions.every(q=>q.prompt==='읽은 설명에 맞는 것은?'),'legacy aliases receive the reviewed canonical questions');
  assert.equal(room.progress.완료학생[id].status,'completed');assert.equal(room.progress.완료학생[id].finishRank,2);assert.equal(room.progress.완료학생[id].completedAt,12345);
  assert.equal(room.progress.완료학생[id].placeStudy.places[key].phase,'completed');assert.equal(room.progress.완료학생[id].placeStudy.places[key].streak,3);
  const state=room.progress.진행학생[id].placeStudy.places[key];
  assert.equal(state.phase,'reading');assert.equal(state.streak,2);assert.equal(state.token,null);assert.equal(state.order,null);
  assert.deepEqual(room.discoveries.완료학생,records,'raw old discoveries survive server restart');
  assert.ok(!logs.includes('저장 실패'),logs);
  console.log(JSON.stringify({ok:true,serverRestart:true,legacyAlias:true,reviewedQuestions:true,earnedAnswersPreserved:true,rankPreserved:true,rawRecordsPreserved:true}));
}finally{server.kill();}})().catch(e=>{console.error(e);process.exitCode=1;});
