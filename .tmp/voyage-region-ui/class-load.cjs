'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{fork}=require('node:child_process'),assert=require('node:assert/strict');
const project=path.resolve('learning/inquiry/age-of-exploration'),{io}=require(path.join(project,'node_modules/socket.io-client'));
const port=31559,base='http://127.0.0.1:'+port,runtime=fs.mkdtempSync(path.join(os.tmpdir(),'voyage-mission-class-'));
const server=fork(path.join(project,'tests/interaction-recovery-smoke.js'),['--fixture'],{cwd:project,env:{...process.env,PORT:String(port),DATA_DIR:runtime},silent:true,windowsHide:true});
let logs='',seq=0,maxAckMs=0;server.stdout.on('data',d=>logs+=d);server.stderr.on('data',d=>logs+=d);
const students=[],pause=ms=>new Promise(r=>setTimeout(r,ms));let teacher;
const connect=()=>new Promise((resolve,reject)=>{const s=io(base,{transports:['websocket'],reconnection:false});s.once('connect',()=>resolve(s));s.once('connect_error',reject);});
const ack=(s,event,data={})=>new Promise((resolve,reject)=>{const start=Date.now();s.timeout(8000).emit(event,data,(e,r)=>{maxAckMs=Math.max(maxAckMs,Date.now()-start);if(e)reject(e);else if(!r?.ok)reject(Error(event+': '+r?.error));else resolve(r);});});
const place=(s,data)=>new Promise((resolve,reject)=>{const request=++seq;const timer=setTimeout(()=>{server.off('message',listener);reject(Error('placement timeout'));},5000);function listener(m){if(m.request!==request)return;clearTimeout(timer);server.off('message',listener);m.error?reject(Error(m.error)):resolve(m);}server.on('message',listener);server.send({request,id:s.id,command:'place',...data});});
server.setMaxListeners(50);
(async()=>{try{
 let ready=false;for(let i=0;i<100;i++){try{ready=(await fetch(base+'/health')).ok;}catch{}if(ready)break;await pause(100);}assert.ok(ready,logs);
 teacher=await connect();const room=await ack(teacher,'createRoom',{roomType:'race'}),catalog=await(await fetch(base+'/api/mission-catalog')).json();
 const starts=catalog.places.filter(p=>p.isOriginalCity&&p.canEnterFromSea&&p.id!=='lisbon').slice(0,4).map(p=>p.id);
 const keys=['discovery:andes','discovery:alps','discovery:sahara'];
 const published=await ack(teacher,'teacherPublishArrivalRace',{startPlaceIds:starts,studyTargets:keys}),mid=published.mission.id;
 students.push(...await Promise.all(Array.from({length:33},connect)));
 await Promise.all(students.map(async(s,i)=>{await ack(s,'joinClass',{roomCode:room.roomCode,name:'학급검사'+String(i+1).padStart(2,'0')});await ack(s,'chooseStartCity',{optionId:starts[i%4]});}));
 await ack(teacher,'teacherStartArrivalRace');
 let completions=[];
 for(const [index,position] of [[0,{lat:-33,lon:-70}],[1,{lat:47,lon:13}],[2,{lat:26,lon:-5}]]){
  const key=keys[index],privateTarget=published.mission.studyTargets[index];
  completions=await Promise.all(students.map(async s=>{
   await place(s,position);if(position.city)await ack(s,'enterCity',{placeId:'lisbon'});
   await ack(s,'readStudyPlace',{key,missionId:mid});let r=await ack(s,'startStudyQuiz',{key,missionId:mid});
   for(let n=0;n<3;n++){const q=privateTarget.questions[r.study.streak],choice=r.study.question.choices.indexOf(q.answer);r=await ack(s,'answerStudyQuestion',{key,missionId:mid,token:r.study.question.token,choice});}
   assert.equal(r.study.phase,'completed');return r;
  }));
 }
 const board=await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('board timeout')),6000);const listen=s=>{if(s.progress.filter(p=>p.status==='completed').length!==33)return;clearTimeout(timer);teacher.off('teacherSnapshot',listen);resolve(s);};teacher.on('teacherSnapshot',listen);});
 assert.equal(board.players.length,33);assert.equal(completions.length,33);assert.ok(board.progress.every(p=>p.studyPlaces.length===3&&p.studyPlaces.every(t=>t.phase==='completed'&&t.streak===3)));
 assert.deepEqual(board.progress.map(p=>p.finishRank).sort((a,b)=>a-b),Array.from({length:33},(_,i)=>i+1));
 const result={ok:true,students:33,placesPerStudent:3,answers:297,completed:33,uniqueRanks:true,maxLocalAckMs:maxAckMs};fs.writeFileSync('.tmp/voyage-region-ui/class-result.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 }finally{students.forEach(s=>s.disconnect());teacher?.disconnect();server.kill();}})().catch(e=>{console.error(e);console.error(logs);process.exitCode=1;});
