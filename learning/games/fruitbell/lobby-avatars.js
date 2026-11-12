(() => {
  'use strict';
  const signatures = new WeakMap();
  let profilePromise;
  function loadAvatarKey() {
    return profilePromise ||= fetch('/api/auth/me', {credentials:'same-origin'})
      .then(r=>r.ok?r.json():null).then(async me=>{
        if(!me?.signedIn)return '';
        const route=me.isTeacher&&!me.membership?'/api/teacher/settings':'/api/student/profile';
        const response=await fetch(route,{credentials:'same-origin'});
        return response.ok?(await response.json()).profile?.avatar?.key||'':'';
      }).catch(()=> '');
  }
  function element(tag,className,text) {
    const node=document.createElement(tag);node.className=className;
    if(text)node.textContent=text;return node;
  }
  function seat(id,player,{myId,hostId,team,onTeamSelect,index}) {
    const mine=id===myId,empty=!player,interactive=Boolean(team&&(empty||mine));
    const node=element(interactive?'button':'div','avatar-seat'+(mine?' is-mine':'')+(empty?' is-empty':''));
    if(id)node.dataset.playerId=id;
    if(interactive){node.type='button';node.addEventListener('click',()=>onTeamSelect(team));}
    const name=player?.name||'빈 자리',label=element('div','avatar-seat-name',name);node.append(label);
    const badges=element('div','avatar-seat-badges');
    if(player&&id===hostId)badges.append(element('span','avatar-seat-host','방장'));
    if(player&&mine)badges.append(element('span','avatar-seat-me','나'));
    node.append(badges);
    const stage=element('div','avatar-seat-stage'),url=ClassroomMultiplayerLobby.avatarUrl(player?.avatarKey);
    if(url){const image=element('img','avatar-seat-image');image.alt='';image.src=url;image.decoding='async';image.style.animationDelay=(-index*.47)+'s';
      image.addEventListener('error',()=>{image.remove();stage.append(element('span','avatar-seat-fallback','아바타'));},{once:true});stage.append(image);
    }else stage.append(element('span','avatar-seat-fallback',empty?'+':'아바타 미설정'));
    node.append(stage);
    node.append(element('span','avatar-seat-hint',empty?(team?'팀 선택':'친구 기다리는 중'):mine&&team?'눌러서 선택 취소':'입장 완료'));
    if(interactive)node.setAttribute('aria-label',empty?`${team==='A'?'파랑':'빨강'}팀 빈 자리 선택`:`${name} · 나 · ${team==='A'?'파랑':'빨강'}팀 선택 취소`);
    return node;
  }
  function render(container,ids,players,options={}) {
    const signature=JSON.stringify([ids.map(id=>[id,players[id]?.name,players[id]?.avatarKey]),options.myId,options.hostId,options.team,options.slots]);
    if(signatures.get(container)===signature)return;
    signatures.set(container,signature);container.classList.add('avatar-seats');
    const nodes=ids.map((id,index)=>seat(id,players[id],{...options,index}));
    for(let i=nodes.length;i<(options.slots||0);i++)nodes.push(seat('',null,{...options,index:i}));
    container.replaceChildren(...nodes);
  }
  window.FruitBellLobbyAvatars={render,loadAvatarKey};
})();
