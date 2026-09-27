'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../public/index.html'),'utf8');
const restore=html.slice(html.indexOf('function restoreVoyagerConnection(){'),html.indexOf("socket.on('connect',()=>"));
const disconnect=html.split('\n').find(line=>line.startsWith("socket.on('disconnect',()=>"));
function fixture(){
  const requests=[],listeners={},finished=[],removed=[];let now=100;
  const socket={id:'first',connected:true,on(event,callback){listeners[event]=callback},timeout(){return this},emit(event,payload,callback){requests.push({event,payload,callback})}};
  const context=vm.createContext({socket,joined:true,resumeToken:'private-token',connectionReady:true,resumePending:false,resumeGeneration:0,lastSnapshotAt:0,performance:{now:()=>now},window:{VoyageStudyUI:{close(){},connectionLost(){},connectionRestored(){}}},net:{},join:{style:{display:'none'}},joinError:{textContent:''},keys:{left:true},missionPanel:{querySelectorAll:()=>[]},awaitingStartChoice:()=>false,sessionStorage:{removeItem:key=>removed.push(key)},showToast(){},finishJoin(result){finished.push(result);context.connectionReady=true;context.resumePending=false;context.resumeGeneration++}});
  vm.runInContext(restore+disconnect,context);
  return{context,socket,requests,finished,removed,restore:()=>context.restoreVoyagerConnection(),disconnect:()=>{socket.connected=false;listeners.disconnect()},advance:()=>++now};
}
{
  const f=fixture();f.restore();f.restore();assert.equal(f.requests.length,1,'only one restore in flight');
  f.requests[0].callback(Error('timeout'));assert.equal(f.context.joined,true,'timeout must keep the voyage');
  f.restore();assert.equal(f.requests.length,2);f.requests[1].callback(null,{ok:true});assert.equal(f.finished.length,1);
}
for(const staleResult of[{ok:false,error:'expired'},{ok:true,self:{x:-1}}]){
  const f=fixture();f.restore();const old=f.requests[0];f.disconnect();f.socket.connected=true;f.socket.id='second';f.restore();
  old.callback(null,staleResult);assert.equal(f.context.joined,true);assert.equal(f.context.resumePending,true,'old callback cannot unlock a new recovery');assert.equal(f.finished.length,0);
  f.requests[1].callback(null,{ok:true});assert.equal(f.finished.length,1);
}
{
  const f=fixture();f.restore();f.context.lastSnapshotAt=f.advance();f.context.connectionReady=true;
  f.requests[0].callback(null,{ok:false,error:'expired'});assert.equal(f.context.joined,true,'fresh snapshot supersedes old rejection');assert.equal(f.context.join.style.display,'none');
}
{
  const f=fixture();f.restore();f.context.resumeToken='new-room-token';f.requests[0].callback(null,{ok:false,error:'expired'});assert.equal(f.context.joined,true,'old room response cannot eject a new room');
}
{
  const f=fixture();f.restore();f.requests[0].callback(null,{ok:false,error:'expired'});assert.equal(f.context.joined,false);assert.equal(f.context.join.style.display,'grid');assert.equal(f.context.resumeToken,'');assert.deepEqual(f.removed,['uw3-resume-token']);
}
console.log('connection-recovery-ui: 6 cases passed');
