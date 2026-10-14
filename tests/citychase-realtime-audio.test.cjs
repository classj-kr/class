const test=require('node:test'),assert=require('node:assert/strict');
const Audio=require('../learning/games/citychase/realtime-audio');
const E=require('../learning/games/citychase/realtime-engine'),W=require('../learning/games/citychase/realtime-world');
function setup(saved){
  const nodes=[],values=new Map(saved),env=new EventTarget();env.document=new EventTarget();env.document.hidden=false;
  env.localStorage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};
  const param=()=>({value:1,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}});
  const context={state:'running',currentTime:0,resume:()=>Promise.resolve(),
    createOscillator(){const node={type:'',notes:[],stopped:0,disconnected:0,frequency:{setValueAtTime(hz){node.notes.push(hz);},exponentialRampToValueAtTime(){}},connect(){},disconnect(){this.disconnected++;},start(){},stop(){this.stopped++;}};nodes.push(node);return node;},
    createGain:()=>({gain:param(),connect(){},disconnect(){}})};
  let muted=['1','true'].includes(values.get('classSfxMuted'));
  env.ClassGameSfx={getAudioBus:()=>muted?null:{context,output:{}},isMuted:()=>muted,setMuted:v=>{muted=v;}};
  const sound=Audio.create({environment:env});
  return{sound,env,context,nodes,values,take(kind){assert.deepEqual(nodes.splice(0).map(n=>n.notes[0]),Audio.CUES[kind].map(n=>n[1]),kind);}};
}
const game=()=>{const g=E.create(Array.from({length:5},(_,i)=>({id:String(i),name:'학생 '+i})),()=>.4);E.command(g,'1',{type:'PLACE_GEMS',shops:W.shops.slice(0,3).map(s=>s.id)});return g;};
const tick=(g,seconds)=>{for(let i=0;i<seconds*20;i++)E.tick(g,.05);};
const place=(p,{x,y})=>Object.assign(p,{x,y,path:[],task:null,steering:null});

test('actual engine outcomes produce distinct cues; snapshots never replay them',()=>{
  const t=setup(),g=game(),p=g.players[0],observe=()=>t.sound.observe(E.snapshot(g,p.id),p.id);
  observe();t.take('start');observe();assert.equal(t.nodes.length,0);
  E.command(g,p.id,{type:'SHARE'});observe();t.take('share');observe();assert.equal(t.nodes.length,0);
  E.command(g,p.id,{type:'DASH'});observe();t.take('dash');observe();assert.equal(t.nodes.length,0);
  E.command(g,p.id,{type:'PING',x:400,y:200});observe();t.take('ping');observe();assert.equal(t.nodes.length,0);
  const wrong=W.shops.find(s=>s.id!==g.targets[0]);place(p,wrong.door);
  E.command(g,p.id,{type:'SEARCH'});observe();t.take('searchStart');tick(g,.3);observe();assert.equal(t.nodes.length,0);
  tick(g,1.4);observe();t.take('emptySearch');
  const target=W.shops.find(s=>s.id===g.targets[0]);place(p,target.door);
  E.command(g,p.id,{type:'SEARCH'});observe();t.take('searchStart');tick(g,1.7);observe();t.take('gemFound');
  place(p,W.nodes.hideout);tick(g,1.1);observe();t.take('bank');assert.equal(g.score,1);
  observe();assert.equal(t.nodes.length,0);t.sound.destroy();
});
test('capture, rescue and timed release are announced from authoritative events',()=>{
  const t=setup(),g=game(),p=g.players[0],cop=g.players[1],friend=g.players[2],observe=()=>t.sound.observe(E.snapshot(g,p.id),p.id);
  observe();t.take('start');g.elapsed=7;place(p,W.nodes.p0);place(cop,W.nodes.p0);tick(g,.05);observe();t.take('capture');
  place(cop,W.nodes.hideout);place(friend,W.nodes.jail);E.command(g,friend.id,{type:'RESCUE'});tick(g,1.5);observe();t.take('rescue');
  p.jailedUntil=g.elapsed+1;tick(g,1.1);observe();t.take('release');t.sound.destroy();
});
test('private clue, empty-search and ping sounds never leak to the other team',()=>{
  const t=setup(),g=game(),cop=g.players[1],observe=()=>t.sound.observe(E.snapshot(g,cop.id),cop.id);
  observe();t.take('start');E.command(g,'0',{type:'SHARE'});E.command(g,'0',{type:'PING',x:400,y:200});
  place(g.players[0],W.shops.find(s=>s.id!==g.targets[0]).door);E.command(g,'0',{type:'SEARCH'});tick(g,1.7);observe();assert.equal(t.nodes.length,0);t.sound.destroy();
});
test('mute stops scheduled tones, persists, and consumes events without a backlog',()=>{
  const t=setup(),g=game();t.sound.observe(E.snapshot(g,'0'),'0');const active=[...t.nodes];t.nodes.length=0;
  t.sound.setEnabled(false);assert(active.every(n=>n.stopped===2&&n.disconnected===1));assert.equal(t.values.get('classSfxMuted'),'1');
  E.command(g,'0',{type:'SHARE'});t.sound.observe(E.snapshot(g,'0'),'0');assert.equal(t.nodes.length,0);
  t.sound.setEnabled(true);t.sound.observe(E.snapshot(g,'0'),'0');assert.equal(t.nodes.length,0);assert.equal(t.values.get('classSfxMuted'),'0');
  const restored=setup([['classSfxMuted','1']]);assert.equal(restored.sound.isEnabled(),false);assert.equal(restored.sound.play('capture'),false);t.sound.destroy();restored.sound.destroy();
});
test('old events, hidden tabs, pauses and stale snapshots cannot produce a sound backlog',()=>{
  const t=setup(),g=game();g.elapsed=4;t.sound.observe(E.snapshot(g,'0'),'0');assert.equal(t.nodes.length,0);
  const old=E.snapshot(g,'0');t.env.document.hidden=true;E.command(g,'0',{type:'SHARE'});t.sound.observe(E.snapshot(g,'0'),'0');
  t.env.document.hidden=false;t.sound.observe(E.snapshot(g,'0'),'0');assert.equal(t.nodes.length,0);
  g.paused=true;g.events.push({id:++g.eventId,time:g.elapsed,type:'capture'});t.sound.observe(E.snapshot(g,'0'),'0');g.paused=false;t.sound.observe(E.snapshot(g,'0'),'0');assert.equal(t.nodes.length,0);
  g.elapsed=5;t.sound.observe(E.snapshot(g,'0'),'0');t.sound.observe(old,'0');assert.equal(t.nodes.length,0);t.sound.destroy();
});
test('victory or defeat is played once when the renderer reveals the result',()=>{
  const t=setup(),g=game();g.phase='ended';g.winner='police';t.sound.finish(E.snapshot(g,'0'),'0');t.take('defeat');t.sound.finish(E.snapshot(g,'0'),'0');assert.equal(t.nodes.length,0);
  t.sound.reset();t.sound.finish(E.snapshot(g,'1'),'1');t.take('victory');t.sound.destroy();
});
test('the final gem uses the result fanfare instead of overlapping two melodies',()=>{
  const t=setup(),g=game();t.sound.observe(E.snapshot(g,'0'),'0');t.take('start');
  g.elapsed=3;g.phase='ended';g.winner='thief';g.events.push({id:++g.eventId,time:3,type:'bank'});
  t.sound.observe(E.snapshot(g,'0'),'0');assert.equal(t.nodes.length,0);t.sound.finish(E.snapshot(g,'0'),'0');t.take('victory');t.sound.destroy();
});
test('gesture unlock resumes suspended audio; pending sound is canceled on mute',async()=>{
  const t=setup();let resolve,resumes=0;t.context.state='suspended';t.context.resume=()=>{resumes++;return new Promise(r=>{resolve=r;});};
  t.env.document.dispatchEvent(new Event('pointerdown'));assert.equal(resumes,1);
  t.sound.play('capture');assert.equal(resumes,2);t.sound.setEnabled(false);resolve();await Promise.resolve();assert.equal(t.nodes.length,0);
  t.context.resume=()=>Promise.reject(new Error('autoplay denied'));t.sound.setEnabled(true);t.sound.play('capture');await new Promise(r=>setImmediate(r));assert.equal(t.nodes.length,0);t.sound.destroy();
});
test('shared mute/zero volume is authoritative and never falls back to another audio context',()=>{
  const t=setup();t.env.ClassGameSfx.getAudioBus=()=>null;t.env.AudioContext=function(){assert.fail('must not bypass the shared bus');};assert.equal(t.sound.play('capture'),false);t.sound.destroy();
});
