'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const net=require('node:net');
const {spawn}=require('node:child_process');
const {io}=require('socket.io-client');
const Ships=require('../public/js/ship-designs');
const profiles=require('../data/catalog/ship-origins.json').ports;
const delay=ms=>new Promise(r=>setTimeout(r,ms));
const ack=(s,event,payload={})=>new Promise((resolve,reject)=>s.timeout(7000).emit(event,payload,(error,value)=>error?reject(error):resolve(value)));
function once(s,event,predicate=()=>true){return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{s.off(event,listener);reject(Error('timeout '+event))},8000);function listener(value){if(!predicate(value))return;clearTimeout(timer);s.off(event,listener);resolve(value)}s.on(event,listener)})}
(async()=>{
  const project=path.join(__dirname,'..');
  const scratch=path.resolve(project,'../../../.tmp/ship-design-review');fs.mkdirSync(scratch,{recursive:true});
  const dataDir=fs.mkdtempSync(path.join(scratch,'race-'));
  const port=await new Promise(resolve=>{const probe=net.createServer();probe.listen(0,'127.0.0.1',()=>{const p=probe.address().port;probe.close(()=>resolve(p))})});
  const url='http://127.0.0.1:'+port;let server,log='';const sockets=[];
  async function start(){
    server=spawn(process.execPath,['server.js'],{cwd:project,env:{...process.env,PORT:String(port),DATA_DIR:dataDir},windowsHide:true,stdio:['ignore','pipe','pipe']});
    server.stdout.on('data',d=>log+=d);server.stderr.on('data',d=>log+=d);
    for(let n=0;n<100;n++){if(server.exitCode!==null)throw Error(log);try{if((await fetch(url+'/health')).ok)return}catch{}await delay(100)}throw Error('server timeout '+log);
  }
  async function stop(){if(!server||server.exitCode!==null)return;const gone=new Promise(r=>server.once('exit',r));server.kill();await gone}
  async function connect(){const s=io(url,{transports:['websocket'],forceNew:true,reconnection:false});sockets.push(s);await once(s,'connect');return s}
  async function choose(s,id){const r=await ack(s,'chooseStartCity',{optionId:id,shipType:'galleon'});assert.equal(r.ok,true,r.error);assert.equal(r.self.shipType,profiles[id].shipType);assert.equal(r.self.shipOriginId,id);assert.equal(r.self.speedBoostMultiplier,1);return r}
  try{
    await start();const host=await connect();const room=await ack(host,'createRoom',{roomType:'race'});assert.equal(room.ok,true);
    const students=[];for(let i=0;i<4;i++){const s=await connect();const r=await ack(s,'joinClass',{roomCode:room.roomCode,name:'선박검증'+i});assert.equal(r.ok,true);assert.equal(r.self.shipType,null);students.push(s)}
    const ids=['lisbon','original_city_099','original_city_035','original_city_005'];
    let pub=await ack(host,'teacherPublishArrivalRace',{targetPlaceId:'crimea_peninsula',startPlaceIds:ids});assert.equal(pub.ok,true,pub.error);
    for(let i=0;i<4;i++)await choose(students[i],ids[i]);
    const monitor=await once(host,'teacherSnapshot',s=>s.players?.length===4&&s.players.every(p=>p.shipType));
    assert.equal(new Set(monitor.players.map(p=>p.shipType)).size,4,'Other viewers must receive distinct ships');
    const observer=await connect();assert.equal((await ack(observer,'joinClass',{roomCode:room.roomCode,name:'선박관찰자'})).ok,true);await choose(observer,'lisbon');
    const near=await once(observer,'snapshot',s=>s.nearby?.some(p=>p.name==='선박검증0'));
    assert.equal(near.nearby.find(p=>p.name==='선박검증0').shipType,'galleon');
    observer.disconnect();await delay(120);
    const started=await ack(host,'teacherStartArrivalRace');assert.equal(started.ok,true,started.error);
    students[1].emit('input',{right:true});await delay(200);students[1].emit('input',{right:false});
    const moved=await once(students[1],'snapshot');assert.equal(moved.you.shipType,'dhow');assert.equal(moved.you.shipOriginId,ids[1]);
    students[1].disconnect();await delay(120);students[1]=await connect();
    const rejoin=await ack(students[1],'joinClass',{roomCode:room.roomCode,name:'선박검증1'});assert.equal(rejoin.self.shipType,'dhow');assert.equal(rejoin.self.shipOriginId,ids[1]);
    const next=['original_city_223','original_city_215','nagasaki','original_city_020'];
    pub=await ack(host,'teacherPublishArrivalRace',{targetPlaceId:'crimea_peninsula',startPlaceIds:next});assert.equal(pub.ok,true,pub.error);
    const reset=await once(students[0],'snapshot',s=>s.mission?.id===pub.mission.id);assert.equal(reset.you.shipType,null,'New race must await a fresh choice');
    for(let i=0;i<4;i++)await choose(students[i],next[i]);
    const freeHost=await connect();const free=await ack(freeHost,'createRoom',{roomType:'free'});
    const freeJoin=await ack(freeHost,'joinClass',{roomCode:free.roomCode,name:'자유항해검증',hostToken:free.hostToken});assert.equal(freeJoin.ok,true);assert.equal(freeJoin.self.shipType,null);
    await delay(700);sockets.forEach(s=>s.disconnect());await stop();await start();
    const restored=await connect();const loaded=await ack(restored,'joinClass',{roomCode:room.roomCode,name:'선박검증2'});
    assert.equal(loaded.ok,true,loaded.error);assert.equal(loaded.self.shipType,'wasen');assert.equal(loaded.self.shipOriginId,'nagasaki');
    console.log(JSON.stringify({ok:true,choiceChangesShip:true,nearbySynchronized:true,reconnectRestores:true,serverRestartRestores:true,newRaceResets:true,freeModeUnchanged:true}));
  }finally{sockets.forEach(s=>s.disconnect());await stop()}
})().catch(e=>{console.error(e);process.exitCode=1});
