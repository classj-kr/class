import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {createParkPresence,safeParkPosition}=require('./park-presence');
const {WebSocketServer,WebSocket}=require('ws');
test('30 simultaneous movers share one broadcast and idle heartbeats produce none',()=>{
  const messages=[],sockets=[];
  const p=createParkPresence({verifyTicket:id=>({userId:id,name:id,schoolKey:'one',classKey:'one|1',avatarKey:'animal-cat.webp'}),normalizeAvatarKey:x=>x,send:(s,m)=>messages.push({s,m})});
  for(let i=0;i<30;i++){const s={meta:{},close(){}};sockets.push(s);p.handle(s,{type:'PARK_JOIN',ticket:String(i)});}
  messages.length=0;
  for(let i=0;i<30;i++)p.handle(sockets[i],{type:'PARK_MOVE',room:'park',x:i/10,z:-2,yaw:0,moving:true});
  assert.equal(messages.length,0);p.flush();assert.equal(messages.length,30);assert.ok(messages.every(({m})=>m.visitors.length===30));
  for(let i=0;i<30;i++)p.handle(sockets[i],{type:'PARK_MOVE',room:'park',x:i/10,z:-2,yaw:0,moving:false});p.flush();messages.length=0;
  for(let n=0;n<10;n++)for(let i=0;i<30;i++)p.handle(sockets[i],{type:'PARK_MOVE',room:'park',x:i/10,z:-2,yaw:0,moving:false});p.flush();assert.equal(messages.length,0);
});

test('same-school visibility switches at 31 and returns at 30 without exposing other schools', () => {
  const identities = new Map(), sockets = [];
  const p = createParkPresence({verifyTicket:k=>identities.get(k),normalizeAvatarKey:k=>k,send:(s,m)=>{s.last=m;}});
  function join(id,school,roomClass) {
    identities.set(id,{userId:id,name:id,schoolKey:school,classKey:school+'|'+roomClass,avatarKey:'animal-cat.webp'});
    const s={meta:{},close(){p.leave(this);}};sockets.push(s);p.handle(s,{type:'PARK_JOIN',ticket:id});return s;
  }
  const a=join('a','school1','class1'), b=join('b','school1','class2'), outsider=join('other','school2','class1');
  for(let i=2;i<30;i++)join('student'+i,'school1',i%2?'class1':'class2');
  assert.equal(a.last.scope,'school');assert.equal(a.last.visitors.length,30);assert.ok(a.last.visitors.some(v=>v.userId==='b'));
  assert.equal(outsider.last.visitors.length,1);
  const extra=join('31st','school1','class1');
  assert.equal(a.last.scope,'class');assert.ok(!a.last.visitors.some(v=>v.userId==='b'));
  assert.equal(b.last.scope,'class');assert.ok(!b.last.visitors.some(v=>v.userId==='a'));
  p.handle(extra,{type:'PARK_MOVE',room:'space',schoolKey:'school2',classKey:'school2|class1',x:0,z:0});
  assert.equal(outsider.last.visitors.length,1);
  p.leave(extra);assert.equal(a.last.scope,'school');assert.equal(a.last.visitors.length,30);assert.ok(a.last.visitors.some(v=>v.userId==='b'));
  const replacement=join('a','school1','class1');
  assert.equal(replacement.last.visitors.length,30,'same account in another tab counts once');
  p.leave(a);assert.equal(replacement.last.visitors.length,30,'old connection cannot remove replacement');
});

test('real sockets retain assigned identities, scope, movement, room changes, replacement and departure', async t => {
  const identities = {
    alice: { userId:'1', name:'시험고양이', classKey:'classA', avatarKey:'animal-cat.webp' },
    bob: { userId:'2', name:'시험라멘', classKey:'classA', avatarKey:'food-ramen.webp' },
    other: { userId:'3', name:'다른반', classKey:'classB', avatarKey:'animal-bee.webp' }
  };
  const presence = createParkPresence({ verifyTicket:t=>identities[t], normalizeAvatarKey:k=>k, send:(s,m)=>s.send(JSON.stringify(m)) });
  const server = new WebSocketServer({port:0,host:'127.0.0.1'});
  await new Promise(r=>server.once('listening',r));
  server.on('connection',s=>{s.meta={};s.on('message',raw=>presence.handle(s,JSON.parse(raw)));s.on('close',()=>presence.leave(s));});
  const sockets=[];t.after(()=>{for(const s of sockets)s.terminate();for(const s of server.clients)s.terminate();server.close();});
  async function join(ticket) {
    const s=new WebSocket(`ws://127.0.0.1:${server.address().port}`);sockets.push(s);s.messages=[];
    s.on('message',raw=>s.messages.push(JSON.parse(raw)));await new Promise(r=>s.once('open',r));
    s.send(JSON.stringify({type:'PARK_JOIN',ticket,avatarKey:'fake.webp'}));return s;
  }
  async function wait(s,predicate) {
    for(let n=0;n<100;n++){const m=s.messages.find(predicate);if(m)return m;await new Promise(r=>setTimeout(r,10));}
    assert.fail('Expected socket message: '+JSON.stringify(s.messages));
  }
  const a=await join('alice'),b=await join('bob'),o=await join('other');
  assert.equal((await wait(a,m=>m.type==='PARK_JOINED')).avatarKey,'animal-cat.webp');
  const state=await wait(a,m=>m.type==='PARK_STATE'&&m.visitors.length===2);
  assert.deepEqual(state.visitors.map(v=>v.avatarKey).sort(),['animal-cat.webp','food-ramen.webp']);
  assert.equal((await wait(o,m=>m.type==='PARK_STATE')).visitors.length,1);
  b.send(JSON.stringify({type:'PARK_MOVE',room:'park',x:4.4,z:0,yaw:1.2,moving:true,avatarKey:'fake.webp',classKey:'classB'}));
  let changed=await wait(a,m=>m.type==='PARK_STATE'&&m.visitors.some(v=>v.userId==='2'&&v.x===4.4));
  let friend=changed.visitors.find(v=>v.userId==='2');assert.equal(friend.x,4.4);assert.equal(friend.z,0);assert.equal(friend.avatarKey,'food-ramen.webp');
  b.send(JSON.stringify({type:'PARK_MOVE',room:'park',x:4.2,z:-1,yaw:1.2,moving:true}));
  await wait(a,m=>m.type==='PARK_STATE'&&m.visitors.some(v=>v.userId==='2'&&v.moving));
  b.send(JSON.stringify({type:'PARK_MOVE',room:'park',x:4.2,z:-1,yaw:1.2,moving:false}));
  await wait(a,m=>m.type==='PARK_STATE'&&m.visitors.some(v=>v.userId==='2'&&v.z===-1&&!v.moving));
  a.messages=[];const replacement=await join('bob');await wait(replacement,m=>m.type==='PARK_JOINED');
  await wait(a,m=>m.type==='PARK_STATE'&&m.visitors.length===2&&m.visitors.find(v=>v.userId==='2').room==='park');
  await new Promise(r=>setTimeout(r,30));
  a.messages=[];replacement.close();await wait(a,m=>m.type==='PARK_STATE'&&m.visitors.length===1);
  const invalid=await join('not-signed');await wait(invalid,m=>m.type==='PARK_AUTH_REQUIRED');
});


test('outdoor positions stay finite and sphinx access matches the visible footprint',()=>{
 for(const xy of [[Infinity,NaN],[1e300,-1e300],[0,14],[0,50]]){const p=safeParkPosition(...xy);assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.z));assert.ok(Math.hypot(p.x,p.z)<=85.001);}
 assert.deepEqual(safeParkPosition(13,50),{x:13,z:50});
});
