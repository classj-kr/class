(() => {
  'use strict';
  const W=window.ChaseWorld,E=window.ChaseEngine,$=id=>document.getElementById(id);
  const canvas=$('town'),ctx=canvas.getContext('2d'),map=new Image(),idle=new Image(),captureSprite=new Image(),sprites={police:new Image(),thief:new Image()};
  map.src='assets/realtime-town-final.png';idle.src='assets/realtime-idle.png';captureSprite.src='assets/realtime-capture.png';sprites.police.src='assets/realtime-police-run.png';sprites.thief.src='assets/realtime-thief-run.png';
  const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
  const captures=window.ChaseCapture.create({reducedMotion:()=>motionPreference.matches});
  const sounds=window.ChaseAudio.create({onEnabledChange(enabled){const button=$('soundBtn');button.textContent=enabled?'🔊':'🔇';button.setAttribute('aria-pressed',String(enabled));button.setAttribute('aria-label',enabled?'소리 끄기':'소리 켜기');}});
  let game=null,view=null,previousView=null,received=0,myId='me',lobby=null,online=false,host=false,chosenTeam='thief',overview=false,pingMode=false;
  let width=innerWidth,height=innerHeight,camera={x:800,y:500,scale:1},lastFrame=0,lastTick=0,lastPublish=0,lastEvent=0,clueSignature='',toastTimer,captureVisible=false;
  const poses=new Map(),labels=[],actorBounds=[],shopHitAreas=[];
  let placement=[];
  const lobbyTemplate=$('lobbyScreen').innerHTML;
  const controls=window.ChaseControls.create({pad:$('movePad'),enabled:()=>!!view&&view.phase==='playing'&&!view.paused&&me()?.jailedUntil<=view.elapsed&&$('cluePanel').classList.contains('hidden'),
    send,dash:()=>{if(!$('dashBtn').disabled)send({type:'DASH'});},interact});
  const profile={name:String(window.CLASS_PLAYER_NAME||'나')};
  function selectTeam(team){chosenTeam=team;document.querySelectorAll('.choices [data-team]').forEach(button=>{const selected=button.dataset.team===team;button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));});}
  function notice(text,kind='notice'){$('notice').textContent=text;$('notice').classList.toggle('captureNotice',kind==='capture');$('notice').classList.remove('hidden');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('notice').classList.add('hidden'),3800);}
  function me(){return view?.players.find(p=>p.id===myId);}
  function install(next){if(!next)return;previousView=view;view=next;received=performance.now();captures.observe(next,received);updateHud();}
  function publish(){
    if(!game)return;install(E.snapshot(game,myId));
    if(online&&host)for(const player of game.players)if(player.id!==myId)lobby.sendServer({type:'GAME_MESSAGE',recipientId:player.id,payload:{type:'CHASE_STATE',state:E.snapshot(game,player.id)}});
  }
  function send(message){
    if(!view||view.phase!=='playing'&&!(view.phase==='setup'&&message.type==='PLACE_GEMS'))return;
    if(!online||host){E.command(game,myId,message);publish();}
    else if(!lobby.send({type:'CHASE_INPUT',action:message}))notice('연결을 확인하고 다시 시도해 주세요.');
  }
  function startScreen(){
    $('welcome').classList.add('hidden');$('play').classList.remove('hidden');$('result').classList.add('hidden');$('cluePanel').classList.add('hidden');
    clearTimeout(toastTimer);$('notice').classList.add('hidden');
    overview=false;pingMode=false;placement=[];lastEvent=0;clueSignature='';captures.reset();sounds.reset();lastTick=performance.now();camera.x=me()?.x||800;camera.y=me()?.y||500;
    $('viewBtn').textContent='전체';$('viewBtn').setAttribute('aria-label','전체 지도 보기');$('pingBtn').setAttribute('aria-pressed','false');resize();
  }
  async function practice(){
    $('practiceBtn').disabled=true;online=false;host=true;myId='me';
    const count=4,roster=[{id:'me',name:profile.name,team:chosenTeam}];
    clearLobby();
    const sizes=E.teamSizes(),counts={thief:chosenTeam==='thief'?1:0,police:chosenTeam==='police'?1:0};
    for(let i=1;i<count;i++){const team=counts.thief<sizes.thief?'thief':'police';counts[team]++;roster.push({id:'bot-'+i,name:(team==='police'?'경찰':'도둑')+' '+counts[team],team,bot:true});}
    game=E.create(roster);view=E.snapshot(game,myId);previousView=null;startScreen();publish();$('practiceBtn').disabled=false;
  }
  function networkStart(snapshot){
    online=true;host=snapshot.role==='host';myId=String(snapshot.myId);
    if(host){const roster=Object.entries(snapshot.players).map(([id,p])=>({id,name:p.name,avatarKey:p.avatarKey}));game=E.create(roster);view=E.snapshot(game,myId);previousView=null;}
    else{game=null;view=null;previousView=null;}
    startScreen();if(host)publish();else lobby.send({type:'CHASE_READY'});
  }
  function mountLobby(){
    if(lobby)return;
    lobby=window.ClassroomMultiplayerLobby.create({gameId:'citychase-realtime',getPlayerName:()=>profile.name==='나'?'체험학생':profile.name,initialMode:'guest',allowedPlayerCounts:[4],maxPlayers:4,rulesButtonIds:['rulesBtnLobby'],preserveRulesUi:true,
      onStarted:networkStart,onNotice:notice,
      onGameMessage(sender,payload){
        if(!online||!payload)return;
        if(host&&game&&game.players.some(p=>p.id===sender)){
          if(payload.type==='CHASE_INPUT'){E.command(game,sender,payload.action);publish();}
          else if(payload.type==='CHASE_READY')publish();
        }else if(!host&&payload.type==='CHASE_STATE'){install(payload.state);}
      },
      onAbort({message}){notice(message);setTimeout(reset,1200);}
    });lobby.mount();
    const practiceSetup=$('practiceSetup');practiceSetup.classList.remove('mp-ui-extra');$('lobbyScreen').querySelector('.mp-ui-access').append(practiceSetup);selectTeam(chosenTeam);
  }
  function clearLobby(){
    if(lobby){lobby.destroy();lobby=null;}
    const root=$('lobbyScreen');root.innerHTML=lobbyTemplate;root.className='panel';root.removeAttribute('style');
  }
  function reset(){
    controls.stop(true);
    game=null;view=null;previousView=null;online=false;host=false;clearLobby();
    $('welcome').classList.remove('hidden');$('play').classList.add('hidden');poses.clear();captures.reset();sounds.reset();mountLobby();
  }
  function updateHud(){
    const player=me();if(!player)return;
    renderPlacement();
    $('teamLabel').textContent=(player.team==='thief'?'도둑팀':'경찰팀')+' · '+player.name;
    $('teamLabel').parentElement.dataset.team=player.team;
    const jailed=player.jailedUntil>view.elapsed;
    $('missionText').textContent=jailed?'탈출 '+Math.ceil(player.jailedUntil-view.elapsed)+'초':player.escapeProtected?'탈출 보호':player.escapeUntil>view.elapsed?'탈출 보호 '+Math.ceil(player.escapeUntil-view.elapsed)+'초':player.team==='police'&&W.distance(player,W.nodes.hideout)<=E.SAFE_RADIUS?'보호구역 · 체포 불가':player.carrying?'보석 운반 중':'';
    const left=Math.max(0,Math.ceil(view.roundSeconds-view.elapsed));$('clock').textContent=Math.floor(left/60)+':'+String(left%60).padStart(2,'0');$('clock').classList.toggle('urgent',left<=30);$('scoreText').textContent=view.score+' / '+view.goal;
    $('captureText').textContent=view.captures+' / '+view.captureGoal;
    const finished=view.phase!=='playing';
    $('clueBtn').disabled=finished;$('pingBtn').disabled=finished;
    $('dashBtn').disabled=finished||jailed||player.dashReady>view.elapsed||view.paused;$('dashBtn').textContent=player.dashReady>view.elapsed?'질주 '+Math.ceil(player.dashReady-view.elapsed)+'초':'질주';
    const shop=W.shops.find(s=>W.distance(player,s.door)<45),rescue=player.team==='thief'&&W.distance(player,W.nodes.jail)<65&&view.players.some(p=>p.team==='thief'&&p.jailedUntil>view.elapsed);
    const button=$('interactBtn');button.disabled=finished||jailed||view.paused||!!player.task||(!rescue&&(!shop||player.team!=='thief'||player.carrying));button.dataset.action=rescue?'RESCUE':'SEARCH';
    button.textContent=player.task?(player.task.type==='bank'?'보석 보관':player.task.type==='rescue'?'구출':'수색')+' '+Math.ceil((1-player.task.progress/player.task.duration)*100)+'%':rescue?'동료 구출':player.team==='police'?'자동 체포':'가게 수색';
    $('pauseNotice').classList.toggle('hidden',!view.paused);
    controls.refresh();
    const events=view.events.filter(e=>e.id>lastEvent);if(events.length){lastEvent=Math.max(...events.map(e=>e.id));const kind=events.some(e=>e.type==='capture')?'capture':'notice';notice(events.at(-1).text,kind);}
    sounds.observe(view,myId);
    const signature=JSON.stringify([view.score,view.clues,view.shared]);if(signature!==clueSignature){clueSignature=signature;renderClues();}
    if(view.phase==='ended'){
      $('result').classList.toggle('hidden',captures.busy());$('resultTitle').textContent=view.winner==='thief'?'도둑팀 승리':'경찰팀 승리';
      const reason={gems:'보석 모두 확보',captures:'누적 체포 달성',allCaught:'도둑 전원 체포',timeout:'시간 종료'}[view.endReason]||'';
      $('resultText').textContent=`${reason} · 보석 ${view.score}/${view.goal} · 체포 ${view.captures}/${view.captureGoal}`;
    }
  }
  function renderPlacement(){
    const setup=view?.phase==='setup',police=me()?.team==='police',wasHidden=$('placementPanel').classList.contains('hidden');
    $('play').classList.toggle('placing',setup);$('placement').classList.toggle('hidden',!setup);
    $('placementPanel').classList.toggle('hidden',!setup||!police);$('placementWaiting').classList.toggle('hidden',!setup||police);
    if(!setup)return;
    $('placementCount').textContent=`${placement.length} / ${E.GOAL}`;$('placementConfirm').disabled=placement.length!==E.GOAL||view.paused;
    for(const button of $('placementShops').children){
      const order=placement.indexOf(button.dataset.shop),selected=order>=0;
      button.setAttribute('aria-pressed',String(selected));button.querySelector('.placementNumber').textContent=selected?String(order+1):'';
      button.disabled=view.paused||!selected&&placement.length===E.GOAL;
    }
    if(police&&wasHidden)$('placementShops').firstElementChild?.focus({preventScroll:true});
  }
  function renderClues(){
    $('clueRound').textContent=Math.min(view.score+1,view.goal);$('clueCount').textContent='공유 '+view.shared.length+'개';
    for(const[id,items]of[['privateClues',view.clues],['sharedClues',view.shared]]){
      $(id).replaceChildren();if(!items.length){const p=document.createElement('p');p.className='small';p.textContent='공유 없음';$(id).append(p);}
      for(const item of items){
        const div=document.createElement('div');div.className='clue';
        if(item.by){const small=document.createElement('small');small.textContent=item.by+'의 단서';div.append(small);}
        const candidates=document.createElement('div');candidates.className='clueCandidates';
        for(const shopId of item.candidates){const shop=W.shops.find(s=>s.id===shopId),chip=document.createElement('span');chip.textContent=shop.name;chip.style.setProperty('--shop-color',shop.color);candidates.append(chip);}
        div.append(candidates);$(id).append(div);
      }
    }
    $('shareBtn').disabled=view.clues.every(c=>view.shared.some(s=>s.key===c.key));$('shareBtn').textContent=$('shareBtn').disabled?'공유 완료':'단서 공유';
  }
  function resize(){width=canvas.clientWidth||innerWidth;height=canvas.clientHeight||innerHeight;const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*d);canvas.height=Math.round(height*d);ctx.setTransform(d,0,0,d,0,0);}
  function rounded(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.5;ctx.stroke();}}
  function label(text,x,y,color='#294536',fill='#fff9e8',font=13,kind='place',shopId=null){labels.push({text,x,y,color,fill,font:font*camera.scale,kind,shopId});}
  function drawLabels(ox,oy,scale){
    // Place readable screen-sized tags after the sprites, without moving the players.
    ctx.save();ctx.translate(-ox/scale,-oy/scale);ctx.scale(1/scale,1/scale);
    shopHitAreas.length=0;const occupied=actorBounds.map(b=>({x:b.x*scale+ox-b.w/2,y:b.y*scale+oy-b.h,w:b.w,h:b.h}));
    const overlaps=(a,b)=>a.x<b.x+b.w+3&&a.x+a.w>b.x-3&&a.y<b.y+b.h+3&&a.y+a.h>b.y-3;
    const priority={self:0,actor:1,place:2};labels.sort((a,b)=>priority[a.kind]-priority[b.kind]);
    for(const tag of labels){
      const x=tag.x*scale+ox,y=tag.y*scale+oy;
      if(x<-30||x>width+30||y<-100||y>height+40||tag.kind==='place'&&(y<0||y>height))continue;
      ctx.font=`800 ${tag.font}px system-ui`;const w=ctx.measureText(tag.text).width+16,h=Math.ceil(tag.font)+10;
      const shifts=[[0,0],[0,-h-5],[0,h+5],[-w/2-12,0],[w/2+12,0],[0,-2*(h+5)],[0,2*(h+5)],[-w,0],[w,0],[0,3*(h+5)]];
      let box,best=Infinity;
      for(const[dx,dy]of shifts){
        const candidate={x:Math.max(6,Math.min(width-w-6,x-w/2+dx)),y:Math.max(76,Math.min(height-86-h,y-h/2+dy)),w,h};
        const collisions=occupied.filter(b=>overlaps(candidate,b)).length,cost=collisions*1000+Math.abs(candidate.x+w/2-x)+Math.abs(candidate.y+h/2-y);
        if(cost<best){best=cost;box=candidate;}if(!collisions&&dx===0&&dy===0)break;
      }
      occupied.push(box);
      if(tag.shopId)shopHitAreas.push({...box,shopId:tag.shopId});
      if(Math.abs(box.x+w/2-x)>w*.4){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(box.x+w/2,box.y+h/2);ctx.strokeStyle=tag.color+'99';ctx.lineWidth=1.5;ctx.stroke();}
      rounded(box.x,box.y,w,h,7,tag.fill,tag.color);ctx.fillStyle=tag.color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(tag.text,box.x+w/2,box.y+h/2+.5);
    }
    ctx.restore();
  }
  function draw(now){
    requestAnimationFrame(draw);if(!view||$('play').classList.contains('hidden'))return;
    const showingCapture=captures.busy(now);if(showingCapture!==captureVisible){captureVisible=showingCapture;$('play').classList.toggle('capturing',showingCapture);}
    const player=me(),focus=captures.cameraTarget(player,now),delta=Math.min(1,(now-lastFrame)/120);lastFrame=now;
    const scale=overview?Math.min(width/W.WIDTH,(height-64)/W.HEIGHT):Math.max(width/W.WIDTH,height/W.HEIGHT)*1.12;
    camera.scale=scale;
    const halfW=width/(2*scale),halfH=height/(2*scale);
    const aimX=overview?800:Math.max(halfW,Math.min(W.WIDTH-halfW,focus?.x||800));
    const aimY=overview?500:Math.max(halfH,Math.min(W.HEIGHT-halfH,(focus?.y||500)-20));
    camera.x+=(aimX-camera.x)*delta;camera.y+=(aimY-camera.y)*delta;
    // Clamp the interpolated position too: resizing or returning from the
    // overview must not reveal the canvas background beyond the map edges.
    if(!overview){camera.x=Math.max(halfW,Math.min(W.WIDTH-halfW,camera.x));camera.y=Math.max(halfH,Math.min(W.HEIGHT-halfH,camera.y));}
    const ox=width/2-camera.x*scale,oy=height/2-camera.y*scale;
    labels.length=0;actorBounds.length=0;
    ctx.clearRect(0,0,width,height);ctx.fillStyle='#d4dcb9';ctx.fillRect(0,0,width,height);ctx.save();ctx.translate(ox,oy);ctx.scale(scale,scale);
    if(map.complete&&map.naturalWidth)ctx.drawImage(map,0,0,W.WIDTH,W.HEIGHT);
    ctx.beginPath();ctx.arc(W.nodes.hideout.x,W.nodes.hideout.y,E.SAFE_RADIUS,0,Math.PI*2);ctx.fillStyle='#40976b28';ctx.fill();ctx.strokeStyle='#fff6cc';ctx.lineWidth=2/scale;ctx.setLineDash([6/scale,5/scale]);ctx.stroke();ctx.setLineDash([]);
    // Only the current walking route is overlaid; scenery never creates collision blockers.
    if(player?.path.length){ctx.beginPath();ctx.moveTo(player.x,player.y);for(const p of player.path)ctx.lineTo(p.x,p.y);ctx.strokeStyle=player.team==='police'?'#227ce0cc':'#d55a46cc';ctx.lineWidth=4/scale;ctx.setLineDash([8/scale,8/scale]);ctx.stroke();ctx.setLineDash([]);const end=player.path.at(-1);ctx.beginPath();ctx.arc(end.x,end.y,12/scale,0,Math.PI*2);ctx.stroke();}
    for(const shop of W.shops){label(shop.name,shop.x,shop.y+58,'#294536','#fff8e9f5',14/scale,'place',shop.id);}
    label('비밀기지 · 안전',W.nodes.hideout.x,W.nodes.hideout.y-25,'#32674b','#eff9dd',14/scale);label('구금 구역',W.nodes.jail.x,W.nodes.jail.y-25,'#2f639b','#eaf4ff',14/scale);
    for(const ping of view.pings){ctx.strokeStyle='#e9ae26';ctx.lineWidth=3/scale;ctx.beginPath();ctx.arc(ping.x,ping.y,(20+Math.sin(now/150)*4)/scale,0,Math.PI*2);ctx.stroke();label(ping.name+'의 표시',ping.x,ping.y-30/scale,'#755419','#fff0b8',12/scale);}
    const elapsed=Math.min(1,(now-received)/(host?50:100)),players=[...view.players].sort((a,b)=>(a.id===myId?1:b.id===myId?-1:a.y-b.y));
    for(const p of players){
      const old=previousView?.players.find(x=>x.id===p.id),jump=!old||W.distance(old,p)>80,reaction=captures.actor(p,now);
      let x=jump?p.x:old.x+(p.x-old.x)*elapsed,y=jump?p.y:old.y+(p.y-old.y)*elapsed;
      if(reaction?.phase==='caught'){x=reaction.x;y=reaction.y;}
      const pose=poses.get(p.id)||{x,y,row:0};const dx=x-pose.x,dy=y-pose.y,moving=!reaction&&Math.hypot(dx,dy)>.08&&p.jailedUntil<=view.elapsed;
      if(moving)pose.row=Math.abs(dx)>Math.abs(dy)?(dx<0?1:2):(dy<0?3:0);pose.x=x;pose.y=y;poses.set(p.id,pose);
      const crowd=view.players.filter(t=>W.distance(t,p)<16).sort((a,b)=>a.id.localeCompare(b.id));if(reaction?.phase!=='caught'&&crowd.length>1){const i=crowd.findIndex(t=>t.id===p.id);x+=(i-(crowd.length-1)/2)*24/scale;}
      x+=(reaction?.nudgeX||0)/scale;
      const color=p.team==='police'?'#277ed1':'#d55c47',mine=p.id===myId;
      ctx.beginPath();ctx.ellipse(x,y,19/scale,8/scale,0,0,Math.PI*2);ctx.fillStyle=color+'aa';ctx.fill();
      if(mine){ctx.strokeStyle='#fff';ctx.lineWidth=3/scale;ctx.stroke();}
      const escapeProtected=p.escapeProtected||p.escapeUntil>view.elapsed;
      if(escapeProtected){ctx.beginPath();ctx.ellipse(x,y,25/scale,11/scale,0,0,Math.PI*2);ctx.strokeStyle='#9ceff5';ctx.lineWidth=3/scale;ctx.stroke();}
      const illustratedReaction=reaction&&captureSprite.complete&&captureSprite.naturalWidth;
      const atlas=illustratedReaction?captureSprite:moving?sprites[p.team]:idle;
      const col=illustratedReaction?reaction.frame:moving?Math.floor(now/(p.dashUntil>view.elapsed?65:105))%4:(p.team==='police'?0:1),spritePixels=overview?Math.max(36,Math.min(68,scale*90)):reaction?.phase==='caught'?86:76,size=spritePixels/scale;
      actorBounds.push({x,y,w:spritePixels*.6,h:spritePixels*.95});
      if(atlas.complete&&atlas.naturalWidth){
        const sw=atlas.naturalWidth/(illustratedReaction?3:moving?4:2),sh=atlas.naturalHeight/(illustratedReaction?1:4),bob=moving?Math.sin(now/65)*1.2/scale:0;
        ctx.save();ctx.translate(x,y-(reaction?.jump||0)*(overview?.5:1)/scale);ctx.rotate(reaction?.rotation||0);ctx.scale(reaction?.sx??1,reaction?.sy??1);ctx.globalAlpha=reaction?.alpha??1;
        ctx.drawImage(atlas,col*sw,illustratedReaction?0:pose.row*sh,sw,sh,-size/2,-size*(illustratedReaction?.92:moving?.91:.98)+bob,size,size);ctx.restore();
      }
      else{ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y-24/scale,16/scale,0,Math.PI*2);ctx.fill();}
      if(!['caught','salute'].includes(reaction?.phase))label((mine&&p.name!=='나'?'나 · ':'')+p.name,x,y-(spritePixels+12)/scale,color,mine?'#fff2b6':'#fffdf4',12/scale,mine?'self':'actor');
      if(p.carrying)label('◆ 보석',x+28/scale,y-39/scale,'#087b9c','#e1fcff',12/scale,'actor');
      if(escapeProtected)label('탈출 보호',x,y+19/scale,'#19647b','#e1fcff',11/scale,'actor');
      if(p.jailedUntil>view.elapsed&&reaction?.phase!=='caught'){captures.bars(ctx,x,y,scale);label('구금 '+Math.ceil(p.jailedUntil-view.elapsed)+'초',x,y+19/scale,'#5c6472','#eef0f4',11/scale,'actor');}
      if(p.task){const w=45/scale;rounded(x-w/2,y+9/scale,w,6/scale,3/scale,'#fff');rounded(x-w/2,y+9/scale,w*Math.min(1,p.task.progress/p.task.duration),6/scale,3/scale,'#e3ac26');}
    }
    drawLabels(ox,oy,scale);captures.draw(ctx,scale,now,{ox,oy,width,height});ctx.restore();
    if(view.phase==='ended'&&!captures.busy(now)){$('result').classList.remove('hidden');sounds.finish(view,myId);}
  }
  function destination(event){return{x:(event.clientX-width/2)/camera.scale+camera.x,y:(event.clientY-height/2)/camera.scale+camera.y};}
  let press=null;
  canvas.addEventListener('pointerdown',event=>{press={x:event.clientX,y:event.clientY,id:event.pointerId};canvas.setPointerCapture(event.pointerId);});
  canvas.addEventListener('pointerup',event=>{
    if(!press||press.id!==event.pointerId)return;const travel=Math.hypot(event.clientX-press.x,event.clientY-press.y);press=null;if(travel>12)return;
    if(view?.phase!=='playing')return;
    let point=destination(event);const tag=shopHitAreas.find(b=>event.clientX>=b.x&&event.clientX<=b.x+b.w&&event.clientY>=b.y&&event.clientY<=b.y+b.h);
    const shop=tag?W.shops.find(s=>s.id===tag.shopId):W.shops.find(s=>Math.abs(point.x-s.x)<72&&Math.abs(point.y-s.y)<80);if(shop)point=shop.door;
    if(pingMode){send({type:'PING',...point});pingMode=false;$('pingBtn').setAttribute('aria-pressed','false');}
    else{controls.stop();send({type:'MOVE',...point});}
  });canvas.addEventListener('pointercancel',()=>{press=null;});
  $('lobbyScreen').addEventListener('click',event=>{if(event.target.closest('#lobbyBack'))reset();else if(event.target.closest('#practiceBtn'))practice();else{const button=event.target.closest('.choices [data-team]');if(button)selectTeam(button.dataset.team);}});
  $('exitBtn').addEventListener('click',()=>{if(confirm('추격전을 나갈까요?'))reset();});$('againBtn').addEventListener('click',reset);
  window.addEventListener('sitebackrequest',event=>{if(!online&&view){event.preventDefault();reset();}});
  $('rulesBtnGame').addEventListener('click',()=>controls.stop(true));$('soundBtn').addEventListener('click',()=>{sounds.setEnabled(!sounds.isEnabled());if(sounds.isEnabled())sounds.play('share');});
  for(const shop of W.shops){
    const button=document.createElement('button'),name=document.createElement('span'),number=document.createElement('span');
    button.dataset.shop=shop.id;button.setAttribute('aria-pressed','false');button.style.setProperty('--shop-color',shop.color);
    name.textContent=shop.name;number.className='placementNumber';number.setAttribute('aria-hidden','true');button.append(name,number);
    button.addEventListener('click',()=>{if(view?.phase!=='setup'||me()?.team!=='police')return;const index=placement.indexOf(shop.id);if(index>=0)placement.splice(index,1);else if(placement.length<E.GOAL)placement.push(shop.id);renderPlacement();});
    $('placementShops').append(button);
  }
  $('placementConfirm').addEventListener('click',()=>send({type:'PLACE_GEMS',shops:[...placement]}));
  $('viewBtn').addEventListener('click',()=>{overview=!overview;$('viewBtn').textContent=overview?'내 위치':'전체';$('viewBtn').setAttribute('aria-label',overview?'내 위치 보기':'전체 지도 보기');});
  function interact(){if($('interactBtn').disabled)return;controls.stop();send({type:$('interactBtn').dataset.action});}
  function actionButton(button,action){
    // Secondary touches do not consistently synthesize click while a thumb is
    // held on the pad. Start on pointerdown; retain keyboard/assistive clicks.
    button.addEventListener('pointerdown',event=>{if(event.button===0&&!button.disabled){event.preventDefault();action();}});
    button.addEventListener('click',event=>{if(event.detail===0&&!button.disabled)action();});
  }
  actionButton($('dashBtn'),()=>send({type:'DASH'}));actionButton($('interactBtn'),interact);
  $('shareBtn').addEventListener('click',()=>send({type:'SHARE'}));$('clueBtn').addEventListener('click',()=>{controls.stop(true);$('cluePanel').classList.toggle('hidden');controls.refresh();});$('closeClue').addEventListener('click',()=>{$('cluePanel').classList.add('hidden');controls.refresh();});
  $('pingBtn').addEventListener('click',()=>{controls.stop(true);pingMode=!pingMode;$('pingBtn').setAttribute('aria-pressed',String(pingMode));if(pingMode)notice('표시할 위치를 지도에서 선택하세요.');updateHud();});
  for(const shop of W.shops){const button=document.createElement('button');button.textContent=shop.name;button.addEventListener('click',()=>{controls.stop();send({type:'PING',...shop.door});send({type:'MOVE',...shop.door});$('cluePanel').classList.add('hidden');controls.refresh();});$('shopChoices').append(button);}
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){controls.stop(true);$('cluePanel').classList.add('hidden');controls.refresh();}});
  document.addEventListener('visibilitychange',()=>{if(game&&host){game.paused=document.hidden;if(game.paused)for(const p of game.players)E.command(game,p.id,{type:'STOP'});lastTick=performance.now();publish();}});
  setInterval(()=>{if(!game||!host)return;const now=performance.now(),dt=(now-lastTick)/1000;lastTick=now;E.tick(game,dt);if(now-lastPublish>=90){lastPublish=now;publish();}else install(E.snapshot(game,myId));},50);
  addEventListener('resize',resize);mountLobby();resize();requestAnimationFrame(draw);
})();
