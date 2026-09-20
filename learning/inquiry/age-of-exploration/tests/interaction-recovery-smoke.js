'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {fork}=require('node:child_process');
const project=path.resolve(__dirname,'..');
if(process.argv.includes('--fixture')){
  // Test-only IPC edits server-owned positions. No testing endpoint is exposed in the game.
  const Module=require('node:module'),file=path.join(project,'server.js'),mod=new Module(file,module);
  mod.filename=file;mod.paths=Module._nodeModulePaths(project);
  mod._compile(fs.readFileSync(file,'utf8')+`
process.on('message',message=>{try{
    const p=[...rooms.values()].flatMap(room=>[...room.values()]).find(p=>p.id===message.id);
    if(!p)throw Error('missing player');
    if(message.command==='place'){
      stopPlayer(p);p.transition=null;p.mode='land';p.currentCityId=null;
      if(message.city){const city=[...RESOLVED_PLACES.values()].find(c=>c.name===message.city);Object.assign(p,city.landPoint);}
      else Object.assign(p,{x:(message.lon+180)/360*WORLD_PIXEL_W,y:(90-message.lat)/180*WORLD_PIXEL_H});
      if(message.anchor){p.shipAnchorX=p.x+8;p.shipAnchorY=p.y;p.shipLandingX=p.x+80;p.shipLandingY=p.y;p.shipAnchorDir=2;p.shipPortId=null;}
    }
    process.send({request:message.request,player:publicPlayer(p),state:activeMissionState(p.roomCode,p.name,p)});
  }catch(error){process.send({request:message.request,error:error.message})}});`,file);
}else{
 const {io}=require('socket.io-client');
 const port=Number(process.env.TEST_PORT||31507),base='http://127.0.0.1:'+port;
 const runtime=fs.mkdtempSync(path.join(require('node:os').tmpdir(),'voyage-recovery-'));
 const server=fork(__filename,['--fixture'],{env:{...process.env,PORT:String(port),DATA_DIR:runtime},silent:true});
 let logs='';server.stdout.on('data',d=>logs+=d);server.stderr.on('data',d=>logs+=d);
 const delay=ms=>new Promise(r=>setTimeout(r,ms));let socket,attacker;
 const ack=(s,event,payload={})=>new Promise((resolve,reject)=>s.timeout(7000).emit(event,payload,(e,r)=>e?reject(e):resolve(r)));
 const once=(s,event,predicate=()=>true)=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>{s.off(event,listener);reject(Error('timeout '+event))},10000);function listener(v){if(!predicate(v))return;clearTimeout(timer);s.off(event,listener);resolve(v)}s.on(event,listener)});
 let seq=0;const place=(payload)=>new Promise((resolve,reject)=>{const request=++seq;const timer=setTimeout(()=>reject(Error('fixture timeout')),5000);function listener(m){if(m.request!==request)return;server.off('message',listener);clearTimeout(timer);m.error?reject(Error(m.error)):resolve(m)}server.on('message',listener);server.send({request,id:socket.id,command:'place',...payload})});
 (async()=>{try{
   let ready=false;for(let n=0;n<120;n++){try{ready=(await fetch(base+'/health')).ok}catch{}if(ready)break;await delay(100)}assert.ok(ready,logs);
   socket=io(base,{autoConnect:false,transports:['websocket'],reconnection:false});const connected=once(socket,'connect');socket.connect();await connected;
   const room=await ack(socket,'createRoom',{roomType:'free'});const joined=await ack(socket,'joinClass',{roomCode:room.roomCode,name:'복구검사',hostToken:room.hostToken});assert.ok(joined.resumeToken);await ack(socket,'hostStartFree');
   await place({lat:-0.83,lon:-49.03});const amazon=await once(socket,'snapshot',s=>s.discoveryInteraction?.id==='amazon_mouth');assert.equal(amazon.discoveryInteraction.canUse,true);assert.equal((await ack(socket,'inspectDiscovery',{id:'amazon_mouth'})).ok,true);
   const anchor=await place({lat:-1.64,lon:-48.99,anchor:true});assert.equal(anchor.state.portInteraction?.kind,'shore','standing by the visible ship must permit reboarding even away from the original landing point');
   const before=anchor.player;socket.disconnect();await delay(150);const reconnected=once(socket,'connect');socket.connect();await reconnected;
   const rejected=await ack(socket,'resumeVoyager',{resumeToken:'wrong-token'});assert.equal(rejected.ok,false);
   const resumed=await ack(socket,'resumeVoyager',{resumeToken:joined.resumeToken});assert.equal(resumed.ok,true,resumed.error);assert.equal(resumed.isHost,true);for(const key of ['x','y','mode','shipAnchorX','shipAnchorY','shipAnchorDir'])assert.equal(resumed.self[key],before[key],key);
   const snapshot=await once(socket,'snapshot');assert.equal(snapshot.portInteraction?.kind,'shore');assert.equal(snapshot.you.resumeToken,undefined,'private recovery token must not appear in snapshots');
   const embark=await ack(socket,'useShoreTransfer');assert.equal(embark.ok,true,embark.error);const atSea=await once(socket,'snapshot',s=>s.you.mode==='sea'&&!s.you.transition);assert.ok(Math.abs(atSea.you.x-before.shipAnchorX)<0.1);assert.ok(Math.abs(atSea.you.y-before.shipAnchorY)<0.1);
   const city=await place({lat:-8.20,lon:-78.97});assert.equal(city.state.cityInteraction?.placeName,'찬찬');const entered=await ack(socket,'enterCity',{placeId:city.state.cityInteraction.placeId});assert.equal(entered.ok,true,entered.error);assert.equal(entered.self.mode,'city');
   socket.disconnect();await delay(100);const again=once(socket,'connect');socket.connect();await again;const resumedCity=await ack(socket,'resumeVoyager',{resumeToken:joined.resumeToken});assert.equal(resumedCity.self.currentCityId,entered.self.currentCityId);assert.equal(resumedCity.self.mode,'city');assert.equal((await ack(socket,'leaveCity')).ok,true);
   console.log(JSON.stringify({ok:true,amazonOnLand:true,reboardByShip:true,reconnectKeepsPositionAndShip:true,hostRestored:true,chanChanEntry:true,cityReconnect:true}));
 }finally{socket?.disconnect();attacker?.disconnect();server.kill()}})().catch(e=>{console.error(e);console.error(logs);process.exitCode=1});
}
