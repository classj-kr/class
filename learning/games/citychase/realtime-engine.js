(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./realtime-world'),require('./realtime-steering'));else root.ChaseEngine=factory(root.ChaseWorld,root.ChaseSteering);})(globalThis,function(W,S){
  'use strict';
  const ROUND_SECONDS=180,GOAL=3,CAPTURE_GOAL=5,SAFE_RADIUS=55,BANK_RADIUS=45;
  const SPEED=Object.freeze({police:132,thief:128,carrying:108});
  const teamSizes=()=>({police:1,thief:3});
  const safe=p=>W.distance(p,W.nodes.hideout)<=SAFE_RADIUS;
  const bankEntries=Object.values(W.nodes).filter(p=>W.distance(p,W.nodes.hideout)<BANK_RADIUS);
  function shuffle(values,random){const a=[...values];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function event(g,text,team=null,detail={}){g.events.push({id:++g.eventId,text,team,time:g.elapsed,...detail});g.events=g.events.slice(-20);}
  function create(roster,random=Math.random){
    if(roster.length!==4)throw new Error('4명이 모이면 시작할 수 있습니다.');
    const g={elapsed:0,phase:'playing',paused:false,score:0,captures:0,winner:null,endReason:null,players:[],targets:shuffle(W.shops.map(s=>s.id),random).slice(0,GOAL),shared:[],pings:[],events:[],eventId:0,botClock:0};
    g.players=roster.map((p,i)=>{const team=p.team||(i===1?'police':'thief'),base=W.nodes[team==='thief'?'hideout':'jail'];return{id:String(p.id),name:String(p.name||'참가자').slice(0,20),avatarKey:p.avatarKey||'',team,bot:!!p.bot,x:base.x,y:base.y,path:[],carrying:false,jailedUntil:0,immuneUntil:5,dashUntil:0,dashReady:0,task:null,lastCommand:-1};});
    const sizes=teamSizes();
    if(g.players.filter(p=>p.team==='thief').length!==sizes.thief||g.players.filter(p=>p.team==='police').length!==sizes.police)throw new Error(`경찰 ${sizes.police}명·도둑 ${sizes.thief}명으로 시작합니다.`);
    for(const team of ['thief','police']){
      const peers=g.players.filter(p=>p.team===team),base=W.nodes[team==='thief'?'hideout':'jail'],exit=W.nodes[team==='thief'?'s0':'g'];
      peers.forEach((p,i)=>{let remaining=i*58,from=base;for(const to of W.path(base,exit).slice(1)){const length=W.distance(from,to);if(remaining<=length){p.x=from.x+(to.x-from.x)*remaining/length;p.y=from.y+(to.y-from.y)*remaining/length;break;}remaining-=length;from=to;}});
    }
    event(g,'추격전 시작!');return g;
  }
  function clues(g,p){
    if(g.score>=GOAL)return[];
    const target=g.targets[g.score],others=W.shops.map(s=>s.id).filter(id=>id!==target),offset=g.score%others.length;
    const ordered=others.slice(offset).concat(others.slice(0,offset));
    const groups=[[target,...ordered.slice(0,2)],[target,...ordered.slice(2,4)]];
    const peers=g.players.filter(x=>x.team===p.team),index=peers.findIndex(x=>x.id===p.id);
    const parts=peers.length===1?[0,1]:[index%2];
    return parts.map(part=>({key:`${g.score}:${part}`,round:g.score+1,candidates:groups[part].sort(),text:groups[part].map(id=>W.shops.find(s=>s.id===id).name).sort().join(' · ')+' 중 한 곳에 보석이 있습니다.'}));
  }
  function move(g,p,destination,options){
    if(!Number.isFinite(destination?.x)||!Number.isFinite(destination?.y))return false;
    if(destination.x<0||destination.x>W.WIDTH||destination.y<0||destination.y>W.HEIGHT)return false;
    const points=W.path(p,destination,options);p.steering=null;p.path=points.slice(1);p.task=null;return true;
  }
  function stop(p){p.steering=null;p.path=[];}
  function command(g,id,message){
    const p=g.players.find(p=>p.id===id);if(!p||!message)return false;
    if(message.type==='STOP'){stop(p);return true;}
    if(g.phase!=='playing'||g.paused)return false;
    if(message.type==='SHARE'){
      let changed=false;for(const clue of clues(g,p))if(!g.shared.some(c=>c.key===clue.key&&c.team===p.team)){g.shared.push({...clue,team:p.team,by:p.name});changed=true;}
      if(changed)event(g,`${p.name}님이 단서를 공유했습니다.`,p.team);return changed;
    }
    if(p.jailedUntil>g.elapsed)return false;
    if(message.type==='STEER'){
      const {x,y}=message;if(!Number.isFinite(x)||!Number.isFinite(y)||Math.abs(x)>1||Math.abs(y)>1)return false;
      const length=Math.hypot(x,y);if(length<.01){stop(p);return true;}
      const nav=p.steering?.nav||S.create(p);p.steering={x:x/length,y:y/length,until:g.elapsed+.45,nav};p.path=[];p.task=null;return true;
    }
    if(message.type==='DASH'){
      if(g.elapsed<p.dashReady)return false;p.dashUntil=g.elapsed+1.15;p.dashReady=g.elapsed+8;return true;
    }
    if(message.type==='PING'){
      if(!Number.isFinite(message.x)||!Number.isFinite(message.y))return false;
      const point=W.nearest({x:Math.max(0,Math.min(W.WIDTH,message.x)),y:Math.max(0,Math.min(W.HEIGHT,message.y))});
      g.pings=g.pings.filter(x=>x.by!==id);g.pings.push({x:point.x,y:point.y,by:id,name:p.name,team:p.team,until:g.elapsed+6});return true;
    }
    if(message.type==='MOVE'){
      if(g.elapsed-p.lastCommand<.045)return false;p.lastCommand=g.elapsed;return move(g,p,message);
    }
    if(message.type==='SEARCH'&&p.team==='thief'&&!p.carrying){
      const shop=W.shops.find(s=>W.distance(p,s.door)<45);if(!shop)return false;
      stop(p);p.task={type:'search',id:shop.id,progress:0,duration:1.6};return true;
    }
    if(message.type==='RESCUE'&&p.team==='thief'&&W.distance(p,W.nodes.jail)<65&&g.players.some(x=>x.team==='thief'&&x.jailedUntil>g.elapsed)){
      stop(p);p.task={type:'rescue',progress:0,duration:1.4};return true;
    }
    return false;
  }
  function advancePlayer(g,p,dt){
    if(p.jailedUntil>g.elapsed)return;
    if(p.jailedUntil){p.jailedUntil=0;p.immuneUntil=g.elapsed+3;event(g,`${p.name}님이 구금 구역에서 탈출했습니다.`);}
    let budget=(p.carrying?SPEED.carrying:SPEED[p.team])*(g.elapsed<p.dashUntil?1.7:1)*dt;
    if(p.steering?.until<=g.elapsed)stop(p);
    if(p.steering){S.advance(p,p.steering.nav,p.steering,budget);budget=0;}
    while(budget>0&&p.path.length){const target=p.path[0],d=W.distance(p,target);if(d<=budget){p.x=target.x;p.y=target.y;p.path.shift();budget-=d;}else{p.x+=(target.x-p.x)*budget/d;p.y+=(target.y-p.y)*budget/d;budget=0;}}
    if(p.team==='thief'&&p.carrying&&!p.path.length&&!p.steering&&W.distance(p,W.nodes.hideout)<BANK_RADIUS&&!p.task)p.task={type:'bank',progress:0,duration:1};
    if(!p.task)return;p.task.progress+=dt;if(p.task.progress<p.task.duration)return;
    const task=p.task;p.task=null;
    if(task.type==='search'){
      if(task.id===g.targets[g.score]&&!g.players.some(x=>x.carrying)){p.carrying=true;event(g,`${p.name}님이 보석을 찾았습니다! 비밀기지로 운반하세요.`);}
      else event(g,`${W.shops.find(s=>s.id===task.id).name} 수색 완료 · 보석이 없습니다.`,p.team,{type:task.id!==g.targets[g.score]?'emptySearch':'search',shopId:task.id,round:g.score});
    }else if(task.type==='bank'&&p.carrying){p.carrying=false;g.score++;g.shared=[];event(g,`보석 ${g.score}/${GOAL}개 확보! ${g.score<GOAL?'새 단서를 나눠 받았습니다.':''}`);if(g.score===GOAL){g.phase='ended';g.winner='thief';g.endReason='gems';}}
    else if(task.type==='rescue'){
      for(const friend of g.players.filter(x=>x.team==='thief'&&x.jailedUntil>g.elapsed)){friend.jailedUntil=0;friend.immuneUntil=g.elapsed+5;move(g,friend,W.nodes.f);}
      event(g,`${p.name}님이 갇힌 동료를 구출했습니다!`);
    }
  }
  function knownShops(g,p){
    const evidence=[...clues(g,p),...g.shared.filter(c=>c.team===p.team)];
    const empty=g.events.filter(e=>e.type==='emptySearch'&&e.team===p.team&&e.round===g.score).map(e=>e.shopId);
    return W.shops.filter(s=>evidence.every(c=>c.candidates.includes(s.id))&&!empty.includes(s.id));
  }
  function avoidance(cops){
    const cache=new Map();
    return{cost(a,b){
      const key=[a.x,a.y,b.x,b.y].join(',');if(cache.has(key))return cache.get(key);
      let risk=0;
      for(const t of [.15,.5,.85]){
        const spot={x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};if(safe(spot))continue;
        const nearest=Math.min(...cops.map(c=>W.distance(c,spot)));
        risk+=Math.pow(Math.max(0,1-nearest/170),2)*14/3;
      }
      const cost=W.distance(a,b)*risk;cache.set(key,cost);return cost;
    }};
  }
  function routeCost(points,options){return points.slice(1).reduce((total,to,i)=>total+W.distance(points[i],to)+(options?.cost(points[i],to)||0),0);}
  function bestRoute(p,points,options){
    return points.map(target=>{const path=W.path(p,target,options);return{target,path,cost:routeCost(path,options)};}).sort((a,b)=>a.cost-b.cost)[0];
  }
  function searchEntries(shop){
    // Both approaches are within search range and on the painted road. A bot
    // need not walk into a stationary police player at the middle of the door.
    return W.edges.filter(e=>e.a===shop.id||e.b===shop.id).map(e=>{
      const node=W.nodes[e.a===shop.id?e.b:e.a],distance=W.distance(node,shop.door),ratio=distance?Math.min(37,distance)/distance:0;
      return{x:shop.door.x+(node.x-shop.door.x)*ratio,y:shop.door.y+(node.y-shop.door.y)*ratio};
    });
  }
  function bots(g){
    const bots=g.players.filter(p=>p.bot),cops=g.players.filter(p=>p.team==='police'),options=avoidance(cops);
    for(const p of bots)command(g,p.id,{type:'SHARE'});
    const thieves=g.players.filter(p=>p.team==='thief'),free=thieves.filter(p=>p.jailedUntil<=g.elapsed),prisoners=thieves.filter(p=>p.jailedUntil>g.elapsed);
    // A single available teammate tries a rescue only if there is time to finish.
    const rescuer=prisoners.length?free.filter(p=>!p.carrying).map(p=>({p,route:bestRoute(p,[W.nodes.jail],options)})).filter(({route})=>W.pathLength(route.path)/SPEED.thief+1.4<Math.max(...prisoners.map(t=>t.jailedUntil-g.elapsed))).sort((a,b)=>a.route.cost-b.route.cost)[0]?.p:null;
    for(const p of bots){
      if(p.jailedUntil>g.elapsed||p.task)continue;
      let target,path;
      const shops=knownShops(g,p);
      if(p.team==='thief'){
        const danger=Math.min(...cops.map(c=>W.distance(c,p))),searcher=free[0],carrier=free.find(x=>x.carrying);
        if(p.carrying){const route=bestRoute(p,bankEntries,options);target=route.target;path=route.path;}
        else if(p===rescuer&&cops.every(c=>W.distance(c,W.nodes.jail)>85)){
          target=W.nodes.jail;if(W.distance(p,target)<65){command(g,p.id,{type:'RESCUE'});continue;}
        }else if(p===searcher&&!carrier){
          const route=bestRoute(p,shops.flatMap(searchEntries),options);target=route?.target;path=route?.path;
          if(shops.some(s=>W.distance(p,s.door)<40)){command(g,p.id,{type:'SEARCH'});continue;}
        }else{
          // Judge the route as well as its endpoint, so fleeing never knowingly
          // chooses a short road straight through the pursuing police.
          const guarding=cops.find(c=>shops.some(s=>W.distance(c,s.door)<110));
          const decoy=guarding&&danger>180?Object.values(W.nodes).filter(n=>{const distance=W.distance(n,guarding);return distance>115&&distance<165&&!safe(n);}):[];
          const choices=(decoy.length?decoy:['n0','n3','p0','p4','e1','s0','s2','m2'].map(id=>W.nodes[id])).map(target=>{
            const path=W.path(p,target,options),clearance=Math.min(...cops.map(c=>W.distance(c,target)));
            return{target,path,value:(decoy.length?0:clearance*1.8)-routeCost(path,options)};
          }).sort((a,b)=>b.value-a.value);
          const choice=choices[0];target=choice.target;path=choice.path;
        }
      }else{
        const nearest=free.filter(t=>!safe(t)).sort((a,b)=>W.distance(a,p)-W.distance(b,p))[0];
        const carrier=free.find(t=>t.carrying&&!safe(t)&&W.distance(p,t)<400);
        target=carrier||nearest;
      }
      if(target){if(path){p.steering=null;p.path=path.slice(1);p.task=null;}else move(g,p,target,p.team==='thief'?options:undefined);}
      else stop(p);
      if(p.path.length&&g.elapsed>=p.dashReady&&(p.team==='police'||cops.some(x=>W.distance(x,p)<180)))command(g,p.id,{type:'DASH'});
    }
  }
  function tick(g,dt){
    if(g.phase!=='playing'||g.paused){for(const p of g.players)if(p.steering)stop(p);return;}dt=Math.max(0,Math.min(.1,dt));g.elapsed+=dt;
    g.pings=g.pings.filter(p=>p.until>g.elapsed);
    if(g.elapsed>=g.botClock){bots(g);g.botClock=g.elapsed+.85;}
    for(const p of g.players)advancePlayer(g,p,dt);
    if(g.phase==='ended')return;
    for(const thief of g.players.filter(p=>p.team==='thief'&&p.jailedUntil<=g.elapsed&&p.immuneUntil<=g.elapsed&&!safe(p))){
      const police=g.players.find(p=>p.team==='police'&&W.distance(p,thief)<30);
      if(police){
        const detail={type:'capture',thiefId:thief.id,policeId:police.id,x:thief.x,y:thief.y,droppedGem:thief.carrying};
        thief.carrying=false;thief.task=null;stop(thief);thief.x=W.nodes.jail.x;thief.y=W.nodes.jail.y;thief.jailedUntil=g.elapsed+12;
        g.captures++;
        event(g,`${police.name}님이 ${thief.name}님을 체포했습니다! 체포 ${g.captures}/${CAPTURE_GOAL}회`,null,detail);
        if(g.captures>=CAPTURE_GOAL)break;
      }
    }
    const allCaught=g.players.filter(p=>p.team==='thief').every(p=>p.jailedUntil>g.elapsed);
    if(g.captures>=CAPTURE_GOAL||allCaught||g.elapsed>=ROUND_SECONDS){
      g.phase='ended';g.winner='police';g.endReason=g.captures>=CAPTURE_GOAL?'captures':allCaught?'allCaught':'timeout';
      event(g,g.endReason==='captures'?`체포 ${CAPTURE_GOAL}회 달성! 경찰팀 승리!`:g.endReason==='allCaught'?'경찰이 도둑을 모두 체포했습니다.':'시간 종료! 경찰이 보석을 지켰습니다.');
    }
  }
  function snapshot(g,id){
    const me=g.players.find(p=>p.id===id);if(!me)return null;
    return{elapsed:g.elapsed,phase:g.phase,paused:g.paused,score:g.score,captures:g.captures,winner:g.winner,endReason:g.endReason,goal:GOAL,captureGoal:CAPTURE_GOAL,roundSeconds:ROUND_SECONDS,
      players:g.players.map(({id,name,avatarKey,team,bot,x,y,carrying,jailedUntil,immuneUntil,dashUntil,dashReady,task,path})=>({id,name,avatarKey,team,bot,x,y,carrying,jailedUntil,immuneUntil,dashUntil,dashReady,task:task?{...task}:null,path:team===me.team?path:[]})),
      clues:clues(g,me),shared:g.shared.filter(c=>c.team===me.team),pings:g.pings.filter(p=>p.team===me.team),events:g.events.filter(e=>!e.team||e.team===me.team)};
  }
  return{create,command,tick,snapshot,clues,teamSizes,ROUND_SECONDS,GOAL,CAPTURE_GOAL,SPEED,SAFE_RADIUS,BANK_RADIUS};
});
