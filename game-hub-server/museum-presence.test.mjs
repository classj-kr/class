import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import vm from 'node:vm';
const require = createRequire(import.meta.url);
const { createMuseumPresence } = require('./museum-presence');
const { WebSocketServer, WebSocket } = require('ws');

test('same-school visibility switches at 31 and returns at 30 without exposing other schools', () => {
  const identities = new Map(), sockets = [];
  const p = createMuseumPresence({verifyTicket:k=>identities.get(k),normalizeAvatarKey:k=>k,send:(s,m)=>{s.last=m;}});
  function join(id,school,roomClass) {
    identities.set(id,{userId:id,name:id,schoolKey:school,classKey:school+'|'+roomClass,avatarKey:'animal-cat.webp'});
    const s={meta:{},close(){p.leave(this);}};sockets.push(s);p.handle(s,{type:'MUSEUM_JOIN',ticket:id});return s;
  }
  const a=join('a','school1','class1'), b=join('b','school1','class2'), outsider=join('other','school2','class1');
  for(let i=2;i<30;i++)join('student'+i,'school1',i%2?'class1':'class2');
  assert.equal(a.last.scope,'school');assert.equal(a.last.visitors.length,30);assert.ok(a.last.visitors.some(v=>v.userId==='b'));
  assert.equal(outsider.last.visitors.length,1);
  const extra=join('31st','school1','class1');
  assert.equal(a.last.scope,'class');assert.ok(!a.last.visitors.some(v=>v.userId==='b'));
  assert.equal(b.last.scope,'class');assert.ok(!b.last.visitors.some(v=>v.userId==='a'));
  p.handle(extra,{type:'MUSEUM_MOVE',room:'space',schoolKey:'school2',classKey:'school2|class1',x:0,z:0});
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
  const presence = createMuseumPresence({ verifyTicket:t=>identities[t], normalizeAvatarKey:k=>k, send:(s,m)=>s.send(JSON.stringify(m)) });
  const server = new WebSocketServer({port:0,host:'127.0.0.1'});
  await new Promise(r=>server.once('listening',r));
  server.on('connection',s=>{s.meta={};s.on('message',raw=>presence.handle(s,JSON.parse(raw)));s.on('close',()=>presence.leave(s));});
  const sockets=[];t.after(()=>{for(const s of sockets)s.terminate();for(const s of server.clients)s.terminate();server.close();});
  async function join(ticket) {
    const s=new WebSocket(`ws://127.0.0.1:${server.address().port}`);sockets.push(s);s.messages=[];
    s.on('message',raw=>s.messages.push(JSON.parse(raw)));await new Promise(r=>s.once('open',r));
    s.send(JSON.stringify({type:'MUSEUM_JOIN',ticket,avatarKey:'fake.webp'}));return s;
  }
  async function wait(s,predicate) {
    for(let n=0;n<100;n++){const m=s.messages.find(predicate);if(m)return m;await new Promise(r=>setTimeout(r,10));}
    assert.fail('Expected socket message: '+JSON.stringify(s.messages));
  }
  const a=await join('alice'),b=await join('bob'),o=await join('other');
  assert.equal((await wait(a,m=>m.type==='MUSEUM_JOINED')).avatarKey,'animal-cat.webp');
  const state=await wait(a,m=>m.type==='MUSEUM_STATE'&&m.visitors.length===2);
  assert.deepEqual(state.visitors.map(v=>v.avatarKey).sort(),['animal-cat.webp','food-ramen.webp']);
  assert.equal((await wait(o,m=>m.type==='MUSEUM_STATE')).visitors.length,1);
  b.send(JSON.stringify({type:'MUSEUM_MOVE',room:'shape',x:4.4,z:0,yaw:1.2,moving:true,avatarKey:'fake.webp',classKey:'classB'}));
  let changed=await wait(a,m=>m.type==='MUSEUM_STATE'&&m.visitors.some(v=>v.userId==='2'&&v.room==='shape'));
  let friend=changed.visitors.find(v=>v.userId==='2');assert.equal(friend.x,4.4);assert.equal(friend.z,0);assert.equal(friend.avatarKey,'food-ramen.webp');
  b.send(JSON.stringify({type:'MUSEUM_MOVE',room:'shape',x:4.2,z:-1,yaw:1.2,moving:true}));
  await wait(a,m=>m.type==='MUSEUM_STATE'&&m.visitors.some(v=>v.userId==='2'&&v.moving));
  b.send(JSON.stringify({type:'MUSEUM_MOVE',room:'shape',x:4.2,z:-1,yaw:1.2,moving:false}));
  await wait(a,m=>m.type==='MUSEUM_STATE'&&m.visitors.some(v=>v.userId==='2'&&v.z===-1&&!v.moving));
  a.messages=[];const replacement=await join('bob');await wait(replacement,m=>m.type==='MUSEUM_JOINED');
  await wait(a,m=>m.type==='MUSEUM_STATE'&&m.visitors.length===2&&m.visitors.find(v=>v.userId==='2').room==='portrait');
  await new Promise(r=>setTimeout(r,30));
  a.messages=[];replacement.close();await wait(a,m=>m.type==='MUSEUM_STATE'&&m.visitors.length===1);
  const invalid=await join('not-signed');await wait(invalid,m=>m.type==='MUSEUM_AUTH_REQUIRED');
});

test('ticket route reads the existing roster even with open access or a stale account role', async () => {
  const source=fs.readFileSync(new URL('./classroom-platform.js',import.meta.url),'utf8');
  const start=source.indexOf('router.get("/museum/presence-ticket", asyncRoute(')+'router.get("/museum/presence-ticket", asyncRoute('.length;
  const end=source.indexOf('\n  }));',start)+4;
  const route=source.slice(start,end);
  let signed,queries=0;
  const context={Date,normalizePersonName:x=>x,crypto:require('node:crypto'),
    getSiteAccessMode:async()=> 'open',sessionUser:async()=>({id:'42',role:'guardian'}),
    requireUser:async()=>{throw Error('should use existing session');},
    studentMembership:async()=>({name:'학생',schoolName:'학교',schoolId:'7',academicYear:2026,grade:3,classNumber:2,avatarKey:'animal-cat.webp'}),
    teacherRegistration:async()=>{throw Error('student membership takes priority');},
    pool:{query:async()=>{queries++;throw Error('no roster writes or reassignment');}},
    signMuseumPresence:p=>{signed=p;return 'signed';},normalizeAvatarKey:k=>k||'',HttpError:Error};
  const handler=vm.runInNewContext('('+route+')',context);
  let response;await handler({query:{avatarKey:'food-ramen.webp'}},{json:v=>response=v});
  assert.equal(signed.avatarKey,'animal-cat.webp');assert.equal(signed.classKey,'7|2026|3|2');assert.equal(response.scope,'school');assert.equal(queries,0);
  context.studentMembership=async()=>null;context.teacherRegistration=async()=>({teacher_name:'선생님',school_name:'학교',school_id:'7',academic_year:2026,grade:3,class_number:2});
  context.pool={query:async()=>({rows:[{avatar_key:'animal-bee.webp'}]})};
  await vm.runInNewContext('('+route+')',context)({query:{}},{json:v=>response=v});assert.equal(signed.avatarKey,'animal-bee.webp');
});
