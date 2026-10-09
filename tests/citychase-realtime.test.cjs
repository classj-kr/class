const test=require('node:test');
const assert=require('node:assert/strict');
const W=require('../learning/games/citychase/realtime-world');
const E=require('../learning/games/citychase/realtime-engine');
const Capture=require('../learning/games/citychase/realtime-capture');
const roster=n=>Array.from({length:n},(_,i)=>({id:String(i),name:'학생 '+i}));
const game=()=>E.create(roster(4),()=>.4);
function run(g,seconds){for(let i=0;i<Math.ceil(seconds*20);i++)E.tick(g,.05);}
function at(player,point){Object.assign(player,{x:point.x,y:point.y,path:[],task:null,steering:null});}

test('only four students can start, with one police and three thieves',()=>{
  const g=E.create(roster(4));assert.equal(g.players.filter(p=>p.team==='police').length,1);assert.equal(g.players.filter(p=>p.team==='thief').length,3);
  for(const n of [0,1,2,3,5,6,7,8,9])assert.throws(()=>E.create(roster(n)));
  assert.throws(()=>E.create(roster(4).map(p=>({...p,team:'thief'}))));
});
test('all streets and destinations are connected, with multiple loops and no phantom crossings',()=>{
  assert(W.edges.length-Object.keys(W.nodes).length+1>=20);
  for(const node of Object.values(W.nodes)){
    const path=W.path(W.nodes.hideout,node);assert(path.length>0);assert(W.distance(path.at(-1),node)<.01);
    for(let i=1;i<path.length;i++){
      const a=path[i-1],b=path[i];
      for(const t of [.1,.5,.9])assert(W.nearest({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t}).distance<.01);
    }
  }
  const cross=(a,b,c)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
  for(let i=0;i<W.edges.length;i++)for(let j=i+1;j<W.edges.length;j++){
    const e=W.edges[i],f=W.edges[j];if([e.a,e.b].some(id=>[f.a,f.b].includes(id)))continue;
    const[a,b,c,d]=[e.a,e.b,f.a,f.b].map(id=>W.nodes[id]);
    assert(!(cross(a,b,c)*cross(a,b,d)<-.001&&cross(c,d,a)*cross(c,d,b)<-.001),`${e.a}-${e.b} crosses ${f.a}-${f.b}`);
  }
});
test('movement follows roads, rejects malformed input and never teleports',()=>{
  const g=game(),p=g.players[0],start={...p};
  for(const invalid of [{x:NaN,y:2},{x:2,y:Infinity},{x:-1,y:100}]){g.elapsed+=.1;assert.equal(E.command(g,p.id,{type:'MOVE',...invalid}),false);}
  g.elapsed+=.1;assert(E.command(g,p.id,{type:'MOVE',x:900,y:180}));
  assert.equal(p.x,start.x);E.tick(g,20);assert(W.distance(p,start)<=12.8001);
  assert(W.nearest(p).distance<.01);assert.equal(E.command(g,'unknown',{type:'DASH'}),false);
});
test('two personal clues uniquely identify the shop; team clues and pings stay private',()=>{
  const g=game();
  for(let round=0;round<3;round++){
    g.score=round;const a=E.clues(g,g.players[0])[0],b=E.clues(g,g.players[2])[0];
    assert.deepEqual(a.candidates.filter(id=>b.candidates.includes(id)),[g.targets[round]]);
  }
  g.score=0;assert(E.command(g,'0',{type:'SHARE'}));assert.equal(E.command(g,'0',{type:'SHARE'}),false);
  E.command(g,'0',{type:'PING',x:400,y:200});
  const own=E.snapshot(g,'0'),enemy=E.snapshot(g,'1');
  assert.equal(own.shared.length,1);assert.equal(enemy.shared.length,0);assert.equal(enemy.pings.length,0);
  assert.equal(enemy.targets,undefined);assert.equal(enemy.players[0].clues,undefined);
});
test('searching, carrying and banking are distinct; three deposits win',()=>{
  const g=game(),p=g.players[0];g.players.forEach(p=>p.immuneUntil=1000);
  const wrong=W.shops.find(s=>s.id!==g.targets[0]);at(p,wrong.door);
  assert(E.command(g,'0',{type:'SEARCH'}));run(g,1.7);assert.equal(p.carrying,false);
  for(let round=0;round<3;round++){
    at(p,W.shops.find(s=>s.id===g.targets[round]).door);E.command(g,'0',{type:'SEARCH'});
    run(g,1);assert.equal(p.carrying,false);run(g,.7);assert(p.carrying);assert.equal(g.score,round);
    at(p,W.nodes.hideout);run(g,1.1);assert.equal(p.carrying,false);assert.equal(g.score,round+1);
  }
  assert.equal(g.winner,'thief');assert.equal(g.phase,'ended');assert.equal(g.shared.length,0);
});
test('capture drops the gem; rescue grants protection; prisoners can still share clues',()=>{
  const g=game(),[thief,cop,friend]=g.players;g.elapsed=6;
  at(thief,W.nodes.p0);at(cop,W.nodes.p0);thief.carrying=true;E.tick(g,.05);
  g.players.filter(p=>p.team==='police').forEach(p=>at(p,W.nodes.p0));
  assert(thief.jailedUntil>g.elapsed);assert.equal(thief.carrying,false);
  assert.equal(E.command(g,thief.id,{type:'MOVE',x:100,y:100}),false);assert(E.command(g,thief.id,{type:'SHARE'}));
  at(friend,W.nodes.jail);assert(E.command(g,friend.id,{type:'RESCUE'}));run(g,1.5);
  assert.equal(thief.jailedUntil,0);assert(thief.immuneUntil>g.elapsed);assert(thief.path.length>0);
});
test('automatic release, dash cooldown, paused clock and timeout work',()=>{
  const g=game(),p=g.players[0];p.jailedUntil=1;at(p,W.nodes.jail);
  g.players.filter(p=>p.team==='police').forEach(p=>at(p,W.nodes.a));run(g,1.1);assert.equal(p.jailedUntil,0);
  assert(E.command(g,p.id,{type:'DASH'}));assert.equal(E.command(g,p.id,{type:'DASH'}),false);
  const before=g.elapsed;g.paused=true;run(g,5);assert.equal(g.elapsed,before);g.paused=false;
  g.elapsed=179.95;E.tick(g,.1);assert.equal(g.winner,'police');
});
test('a full bot match advances to a result with finite on-road positions',()=>{
  const g=E.create(roster(4).map(p=>({...p,bot:true})),()=>.2);run(g,185);
  assert.equal(g.phase,'ended');assert(['police','thief'].includes(g.winner));
  for(const p of g.players){assert(Number.isFinite(p.x)&&Number.isFinite(p.y));assert(W.nearest(p).distance<.01);}
});

function captureFixture(){
  const g=game(),[thief,cop]=g.players;g.elapsed=6;
  at(thief,W.nodes.p0);at(cop,W.nodes.p0);thief.carrying=true;E.tick(g,.05);
  return{g,thief,cop,event:g.events.find(e=>e.type==='capture')};
}
test('capture events retain the original location, victim and captor for every client',()=>{
  const{g,thief,cop,event}=captureFixture();
  assert(event);assert.equal(event.thiefId,thief.id);assert.equal(event.policeId,cop.id);assert(event.droppedGem);
  assert.equal(event.x,W.nodes.p0.x);assert.equal(event.y,W.nodes.p0.y);
  assert.equal(thief.x,W.nodes.jail.x);assert.equal(thief.y,W.nodes.jail.y);
  assert.equal(thief.jailedUntil,g.elapsed+12,'presentation must not lengthen imprisonment');
  assert.deepEqual(E.snapshot(g,cop.id).events.find(e=>e.type==='capture'),event);
  assert.deepEqual(E.snapshot(g,thief.id).events.find(e=>e.type==='capture'),event);
});
test('capture presentation runs once, holds the scene, then finishes even when the round ends',()=>{
  const{g,thief,cop}=captureFixture();let now=0;
  const fx=Capture.create({clock:()=>now}),state=E.snapshot(g,thief.id);state.phase='ended';fx.observe(state);
  assert.equal(fx.actor(thief).phase,'caught');assert.equal(fx.actor(cop).phase,'salute');
  assert.deepEqual(fx.cameraTarget(thief),{x:W.nodes.p0.x,y:W.nodes.p0.y});
  now=600;fx.observe(state);assert.equal(fx.actor(thief).phase,'caught');
  now=1150;fx.observe(state);assert.equal(fx.actor(thief).phase,'arriving');assert.equal(fx.cameraTarget(thief),thief);
  now=Capture.DURATION+10;assert.equal(fx.busy(),false);fx.observe(state);assert.equal(fx.actor(thief).phase,'jailed');
  now+=100;fx.observe(state);assert.equal(fx.busy(),false,'repeated snapshots must not replay the capture');
});
test('rescue cancels the presentation immediately; stale events and reduced motion stay quiet',()=>{
  const{g,thief}=captureFixture();let now=0;
  const fx=Capture.create({clock:()=>now});fx.observe(E.snapshot(g,thief.id));
  thief.jailedUntil=0;fx.observe(E.snapshot(g,thief.id));assert.equal(fx.actor(thief),null);assert.equal(fx.busy(),false);
  const fresh=captureFixture(),quiet=Capture.create({clock:()=>now,reducedMotion:()=>true});quiet.observe(E.snapshot(fresh.g,fresh.thief.id));
  assert.deepEqual(quiet.actor(fresh.thief),{frame:2,phase:'jailed'});assert.equal(quiet.cameraTarget(fresh.thief),fresh.thief);
  const late=Capture.create();fresh.g.elapsed+=2;late.observe(E.snapshot(fresh.g,fresh.thief.id));assert.equal(late.busy(),false);
});

function steer(g,p,x,y,seconds=.1){
  for(let i=0;i<Math.ceil(seconds*20);i++){assert(E.command(g,p.id,{type:'STEER',x,y}));E.tick(g,.05);}
}
test('directional input is normalized, validated and remains on the road network',()=>{
  for(const input of [{x:1,y:0},{x:1,y:1}]){
    const g=game(),p=g.players[0];at(p,W.nodes.b);const start={...p};steer(g,p,input.x,input.y);
    assert(Math.abs(W.distance(p,start)-12.8)<.001,'diagonal input must not increase speed');
    for(const invalid of [{x:NaN,y:0},{x:Infinity,y:0},{x:2,y:0},{x:0,y:'1'}])assert.equal(E.command(g,p.id,{type:'STEER',...invalid}),false);
  }
  const g=game(),p=g.players[0];g.players.forEach(p=>p.immuneUntil=1000);
  for(const node of Object.values(W.nodes))for(const [x,y] of [[1,0],[0,1],[-1,0],[0,-1],[1,1],[-1,-1]]){
    at(p,node);g.elapsed=0;const before={...p};steer(g,p,x,y,.5);
    assert(W.nearest(p).distance<.001,`left road at ${node.id}`);assert(W.distance(p,before)<=64.001);
  }
});
test('opposite direction reverses between junctions; an early turn waits for the junction',()=>{
  const g=game(),p=g.players[0];at(p,{x:1000,y:450});steer(g,p,0,1);const down=p.y;
  steer(g,p,0,-1);assert(p.y<down-12);assert(Math.abs(p.x-1000)<.001);
  at(p,{x:815,y:W.nodes.b.y+(W.nodes.c.y-W.nodes.b.y)*(815-W.nodes.b.x)/(W.nodes.c.x-W.nodes.b.x)});
  steer(g,p,1,0,.05);assert(p.x<835);steer(g,p,0,1,.3);
  assert(Math.abs(p.x-W.nodes.c.x)<1,'turn onto c–p1, not through the building');assert(p.y>W.nodes.c.y+10);
  at(p,{x:825,y:W.nodes.b.y+(W.nodes.c.y-W.nodes.b.y)*(825-W.nodes.b.x)/(W.nodes.c.x-W.nodes.b.x)});
  E.command(g,p.id,{type:'STOP'});steer(g,p,0,1,.2);assert(p.y>W.nodes.c.y+10,'a brief key release must not lose an early turn');
});
test('release and stale input stop immediately; pause and round end discard steering',()=>{
  const g=game(),p=g.players[0];at(p,W.nodes.b);steer(g,p,1,0);E.command(g,p.id,{type:'STEER',x:0,y:0});
  let point={...p};run(g,.2);assert.equal(W.distance(p,point),0);
  E.command(g,p.id,{type:'STEER',x:1,y:0});run(g,.5);point={...p};run(g,1);assert.equal(W.distance(p,point),0);assert.equal(p.steering,null);
  E.command(g,p.id,{type:'STEER',x:1,y:0});g.paused=true;E.tick(g,.1);assert.equal(p.steering,null);g.paused=false;point={...p};run(g,.2);assert.equal(W.distance(p,point),0);
  E.command(g,p.id,{type:'STEER',x:1,y:0});g.phase='ended';E.tick(g,.1);assert.equal(p.steering,null);
  assert(E.command(g,p.id,{type:'STOP'}));assert.equal(E.command(g,p.id,{type:'STEER',x:1,y:0}),false);
});
test('directional control switches cleanly with destinations, search and dash',()=>{
  const g=game(),p=g.players[0];at(p,W.nodes.b);E.command(g,p.id,{type:'MOVE',...W.nodes.c});assert(p.path.length);
  steer(g,p,1,0);assert.equal(p.path.length,0);assert(p.steering);
  E.command(g,p.id,{type:'MOVE',...W.nodes.c});assert.equal(p.steering,null);assert(p.path.length);
  E.command(g,p.id,{type:'STOP'});assert.equal(p.path.length,0);
  at(p,W.nodes.b);const start={...p};E.command(g,p.id,{type:'DASH'});steer(g,p,1,0);assert(Math.abs(W.distance(p,start)-21.76)<.001);
  at(p,W.shops[0].door);E.command(g,p.id,{type:'STEER',x:1,y:0});assert(E.command(g,p.id,{type:'SEARCH'}));assert.equal(p.steering,null);assert.equal(p.task.type,'search');
});
test('capture clears held direction so a rescued thief does not resume stale movement',()=>{
  const g=game(),[thief,cop,friend]=g.players;g.elapsed=6;at(thief,W.nodes.p0);at(cop,W.nodes.p0);
  E.command(g,thief.id,{type:'STEER',x:1,y:0});E.tick(g,.05);assert(thief.jailedUntil>g.elapsed);assert.equal(thief.steering,null);
  assert.equal(E.command(g,thief.id,{type:'STEER',x:1,y:0}),false);
  at(cop,W.nodes.a);at(friend,W.nodes.jail);E.command(g,friend.id,{type:'RESCUE'});run(g,1.5);
  assert.equal(thief.jailedUntil,0);assert.equal(thief.steering,null);assert(thief.path.length,'only the explicit rescue exit route remains');
});

test('police standing inside the hideout cannot capture, block movement or stop a deposit',()=>{
  const g=game(),p=g.players[0],cop=g.players.find(p=>p.team==='police');g.elapsed=6;
  at(p,W.nodes.hideout);at(cop,W.nodes.hideout);p.carrying=true;p.immuneUntil=0;
  run(g,1.1);assert.equal(g.score,1);assert.equal(p.jailedUntil,0);
  E.command(g,p.id,{type:'MOVE',...W.nodes.i});run(g,.15);assert(W.distance(p,W.nodes.hideout)>1,'characters are not physical roadblocks');assert.equal(p.jailedUntil,0);
  at(p,{x:W.nodes.hideout.x+E.SAFE_RADIUS+1,y:W.nodes.hideout.y});at(cop,p);E.tick(g,.05);assert(p.jailedUntil>g.elapsed,'the protection ends at the displayed boundary');
});
test('a carrying bot uses another existing entrance when police camp at the hideout approach',()=>{
  const g=game(),p=g.players[0],cops=g.players.filter(p=>p.team==='police');g.elapsed=6;
  g.players.forEach(p=>{at(p,W.nodes.d);p.immuneUntil=1000;});at(p,W.nodes.s0);Object.assign(p,{bot:true,carrying:true,immuneUntil:0});at(cops[0],{x:320,y:858});
  let caught=false;for(let i=0;i<400&&!g.score;i++){E.tick(g,.05);caught ||= p.jailedUntil>g.elapsed;assert(W.nearest(p).distance<.001);}
  assert.equal(caught,false);assert.equal(g.score,1);assert(W.distance(p,W.nodes.hideout)<E.BANK_RADIUS);
});
test('the lone police player in a four-person game receives both clue pieces',()=>{
  const g=E.create(roster(4),()=>.4),cop=g.players.find(p=>p.team==='police'),pieces=E.clues(g,cop);
  assert.equal(pieces.length,2);assert.deepEqual(pieces[0].candidates.filter(id=>pieces[1].candidates.includes(id)),[g.targets[0]]);
  E.command(g,cop.id,{type:'SHARE'});assert.equal(E.snapshot(g,cop.id).shared.length,2);assert.equal(E.snapshot(g,g.players[0].id).shared.length,0);
});

test('bots and people use the same movement speeds, including carrying and dash',()=>{
  for(const team of ['police','thief'])for(const carrying of team==='thief'?[false,true]:[false])for(const dash of [false,true]){
    const distances=[];
    for(const bot of [false,true]){
      const g=game(),p=g.players.find(p=>p.team===team);g.botClock=Infinity;
      Object.assign(p,{bot,carrying});at(p,W.nodes.b);
      if(dash)E.command(g,p.id,{type:'DASH'});
      steer(g,p,1,0,.1);distances.push(W.distance(p,W.nodes.b));
    }
    assert.equal(distances[0],distances[1]);
    assert(Math.abs(distances[0]-(carrying?E.SPEED.carrying:E.SPEED[team])*(dash?1.7:1)*.1)<.001);
  }
});

test('five separate captures win, without double-counting jail time or ending at four',()=>{
  const g=game(),[thief,cop]=g.players;g.elapsed=6;
  g.players.forEach(p=>p.immuneUntil=1000);
  for(let n=1;n<=E.CAPTURE_GOAL;n++){
    at(thief,W.nodes.p0);at(cop,W.nodes.p0);thief.jailedUntil=0;thief.immuneUntil=0;
    E.tick(g,.05);assert.equal(g.captures,n);
    const state=E.snapshot(g,cop.id);assert.equal(state.captures,n);assert.equal(state.captureGoal,E.CAPTURE_GOAL);
    if(n<E.CAPTURE_GOAL){assert.equal(g.phase,'playing');run(g,.2);assert.equal(g.captures,n);}
  }
  assert.equal(g.winner,'police');assert.equal(g.endReason,'captures');
  run(g,1);assert.equal(g.captures,E.CAPTURE_GOAL);assert.equal(game().captures,0);
});

test('a bot can search past a stationary police player at the shop entrance',()=>{
  for(const shop of W.shops){
    const g=game(),[thief,cop]=g.players;g.elapsed=6;g.targets[0]=shop.id;
    g.players.forEach(p=>{at(p,W.nodes.hideout);p.immuneUntil=1000;});
    at(cop,shop.door);Object.assign(thief,{bot:true,immuneUntil:0});
    E.command(g,g.players[2].id,{type:'SHARE'});
    let found=false;
    for(let i=0;i<2000&&!found;i++){E.tick(g,.05);found=thief.carrying;}
    assert(found,shop.id+' search must use an approach within the actual search radius');
    assert.equal(thief.jailedUntil,0);assert.equal(g.captures,0);
  }
});

test('search requires a free thief at a door; movement cancels partial progress',()=>{
  const g=game(),[thief,cop]=g.players,shop=W.shops.find(s=>s.id===g.targets[0]);
  assert.equal(E.command(g,thief.id,{type:'SEARCH'}),false);
  at(cop,shop.door);assert.equal(E.command(g,cop.id,{type:'SEARCH'}),false);
  at(thief,shop.door);thief.jailedUntil=12;assert.equal(E.command(g,thief.id,{type:'SEARCH'}),false);thief.jailedUntil=0;
  for(const action of [{type:'MOVE',...W.nodes.b},{type:'STEER',x:1,y:0}]){
    at(thief,shop.door);assert(E.command(g,thief.id,{type:'SEARCH'}));run(g,.7);
    assert.equal(thief.carrying,false);assert(E.command(g,thief.id,action));assert.equal(thief.task,null);
    run(g,1.1);assert.equal(thief.carrying,false);assert.equal(g.score,0);
  }
});

test('simultaneous searches award exactly one gem and cannot duplicate it while carrying',()=>{
  const g=game(),[thief,,friend]=g.players,shop=W.shops.find(s=>s.id===g.targets[0]);
  for(const p of [thief,friend]){at(p,shop.door);assert(E.command(g,p.id,{type:'SEARCH'}));}
  run(g,1.7);assert.equal(g.players.filter(p=>p.carrying).length,1);assert.equal(g.score,0);
  const carrier=g.players.find(p=>p.carrying),other=carrier===thief?friend:thief;
  assert.equal(E.command(g,carrier.id,{type:'SEARCH'}),false);
  assert(E.command(g,other.id,{type:'SEARCH'}));run(g,1.7);assert.equal(other.carrying,false);
  assert.equal(g.players.filter(p=>p.carrying).length,1);assert.equal(g.score,0);
});

test('a captured gem can be searched again; interrupted banking never grants a point',()=>{
  const g=game(),[thief,cop,friend]=g.players,shop=W.shops.find(s=>s.id===g.targets[0]);
  at(thief,shop.door);E.command(g,thief.id,{type:'SEARCH'});run(g,1.7);assert(thief.carrying);
  g.elapsed=6;at(cop,thief);thief.immuneUntil=0;E.tick(g,.05);
  assert.equal(thief.carrying,false);assert.equal(g.score,0);assert.equal(g.targets[0],shop.id);
  at(cop,W.nodes.a);at(friend,shop.door);friend.immuneUntil=1000;
  assert(E.command(g,friend.id,{type:'SEARCH'}));run(g,1.7);assert(friend.carrying);
  at(friend,W.nodes.hideout);run(g,.45);assert.equal(g.score,0);
  E.command(g,friend.id,{type:'MOVE',...W.nodes.i});assert.equal(friend.task,null);run(g,1.1);assert.equal(g.score,0);
  at(friend,W.nodes.hideout);run(g,1.1);assert.equal(g.score,1);assert.equal(friend.carrying,false);
  run(g,1.5);assert.equal(g.score,1,'remaining still must not bank the same gem twice');
});
