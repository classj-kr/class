document.addEventListener('DOMContentLoaded',()=>{
 const root=document.querySelector('#amLab'),$=id=>document.getElementById(id),M=window.AcidMixingModel;
 let state={mode:'cabbage',start:'acid',titrant:'opposite',volume:0,indicator:false},history=[],busy=false,automatic=false,epoch=0,timer,raf=0,anim=null,pendingFrom=null;
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches,n=v=>Number(v.toFixed(2)).toString();
 const name=k=>k==='acid'?'묽은 염산':k==='base'?'묽은 수산화 나트륨 용액':'물';
 const addedName=()=>state.titrant==='water'?name('water'):name(state.start==='acid'?'base':'acid');
 function save(){const r=M.solve(state);if(!history.some(h=>Math.abs(h.added-r.added)<1e-8))history.push(r);}
 const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,lerp=(a,b,t)=>a+(b-a)*t,clamp01=t=>Math.max(0,Math.min(1,t));
 // 플라스크 안 액체 높이(부피에 맞춘 원뿔대 근사)
 const flaskLevel=total=>{const area=24650*total/100,k=150/340;return 340-(220-Math.sqrt(220*220-4*k*area))/(2*k);};
 const wellLevel=total=>242-total/10*25;
 const REST={ind:{x:76,tip:314},tit:{x:446,tip:312}},LIFT=200;
 const COLOURLESS='#e6f1f3',WATERY='#d3e6ed',liq=h=>h===COLOURLESS?WATERY:h;
 function dropperSvg(tx,ty,squeeze,content){
  const sx=1-.3*squeeze,top=72+squeeze*24;
  return `<g transform="translate(${tx-260} ${ty-122})"><g transform="translate(260 24) scale(${sx} 1) translate(-260 -24)"><path d="M252 23 Q243 4 260 3 Q277 4 268 23 L268 43 H252 Z" fill="#3f6f80" stroke="#2c5361" stroke-width="1.5"/><path d="M255 11 Q257 7 262 7" fill="none" stroke="#9fc3cf" stroke-width="2" stroke-linecap="round"/></g><rect x="250" y="40" width="20" height="6" rx="2" fill="#2c5361"/><path d="M254 46 H266 V103 L261 122 H259 L254 103 Z" fill="#eef6f9" stroke="#6f8f9e" stroke-width="2"/><path d="M256 ${top} H264 V103 L260 116 L256 103 Z" fill="${content}" opacity=".85"/><path d="M256.5 50 V98" stroke="#fff" stroke-width="1.6" opacity=".8"/></g>`;
 }
 // 왼쪽: 스포이트가 꽂힌 지시약 병, 오른쪽: 조금씩 넣을 용액이 담긴 작은 비커
 function indicatorBottle(x,liquid){
  return `<g><path d="M${x-30} 262 Q${x-30} 252 ${x-20} 250 H${x-12} V238 H${x+12} V250 H${x+20} Q${x+30} 252 ${x+30} 262 V340 Q${x+30} 346 ${x+24} 346 H${x-24} Q${x-30} 346 ${x-30} 340 Z" fill="#f2f8fa" stroke="#6f8f9e" stroke-width="2.5"/><path d="M${x-27} 284 H${x+27} V338 Q${x+27} 343 ${x+22} 343 H${x-22} Q${x-27} 343 ${x-27} 338 Z" fill="${liquid}" opacity=".92"/><rect x="${x-14}" y="232" width="28" height="9" rx="2" fill="#5d7c89"/><rect x="${x-27}" y="318" width="54" height="23" rx="3" fill="#fffdf6" stroke="#b7a780"/><text x="${x}" y="334.5" text-anchor="middle" font-size="14" font-weight="700" fill="#4b3d1f">지시약</text><path d="M${x-22} 262 V290" stroke="#fff" stroke-width="3" opacity=".7" stroke-linecap="round"/></g>`;
 }
 function titrantBeaker(x,label){
  return `<g><path d="M${x-38} 256 H${x+38} L${x+34} 261 V340 Q${x+34} 346 ${x+28} 346 H${x-28} Q${x-34} 346 ${x-34} 340 V261 Z" fill="#f2f8fa" stroke="#6f8f9e" stroke-width="2.5"/><path d="M${x-31} 288 H${x+31} V338 Q${x+31} 343 ${x+26} 343 H${x-26} Q${x-31} 343 ${x-31} 338 Z" fill="${WATERY}"/><path d="M${x-31} 288 H${x+31}" stroke="#8fb0bd" stroke-width="1.5"/><path d="M${x+21} 272 H${x+31} M${x+24} 300 H${x+31} M${x+21} 316 H${x+31}" stroke="#7d98a4" stroke-width="1.4"/><text x="${x}" y="337" text-anchor="middle" font-size="14" font-weight="700" fill="#2f5361">${label}</text><path d="M${x-26} 266 V282" stroke="#fff" stroke-width="3" opacity=".7" stroke-linecap="round"/></g>`;
 }
 // a: 움직임 상태 {who, tx, ty, squeeze, drops, splash, fromHex, mix, total, tilt}
 function draw(r,a){
  const total=a?a.total:r.total,fromHex=a?a.fromHex:r.hex,mix=a?a.mix:1,toHex=r.hex,baseHex=mix>=1?toHex:fromHex,topHex=mix>.9?toHex:fromHex;
  const defs=`<defs><linearGradient id="amGlass" x1="0" x2="1"><stop stop-color="#eaf4f7" stop-opacity=".7"/><stop offset=".35" stop-color="#fff" stop-opacity=".15"/><stop offset="1" stop-color="#bcd4de" stop-opacity=".7"/></linearGradient><linearGradient id="amShade" x1="0" x2="1"><stop stop-color="#000" stop-opacity=".07"/><stop offset=".4" stop-color="#fff" stop-opacity=".14"/><stop offset="1" stop-color="#000" stop-opacity=".1"/></linearGradient></defs>`;
  // 새 색은 바닥 쪽부터 물결 모양으로 차오르며 번진다
  const mixLayer=(x0,w,yTop,yBot)=>{if(mix>=1||fromHex===toHex)return '';const y=yBot-(yBot-yTop+8)*ease(mix);let d=`M${x0} ${y}`;for(let i=0;i<9;i++)d+=` Q${x0+w*(i+.5)/9} ${y+(i%2?7:-7)} ${x0+w*(i+1)/9} ${y}`;return `<path d="${d} V${yBot+30} H${x0} Z" fill="${liq(toHex)}" opacity="${.6+.4*mix}"/>`;};
  let vessel='',surfaceY;
  if(state.mode==='cabbage'){
   const outline='M229 145 H291 V187 L369 314 Q382 344 357 347 H163 Q138 344 151 314 L229 187 Z',y=flaskLevel(total),h=340-y;surfaceY=y;
   vessel=`<defs><clipPath id="amInside"><path d="${outline}"/></clipPath></defs><ellipse cx="260" cy="355" rx="136" ry="15" fill="#aec7d0" opacity=".28"/><g class="am-vessel" transform="rotate(${a?a.tilt:0} 260 345)"><path d="${outline}" fill="url(#amGlass)" stroke="#7595a5" stroke-width="3"/><g clip-path="url(#amInside)"><rect x="138" y="${y}" width="244" height="140" fill="${liq(baseHex)}"/>${mixLayer(138,244,y,347)}<rect x="138" y="${y}" width="244" height="140" fill="url(#amShade)"/><ellipse cx="260" cy="${y}" rx="${110-h*150/340}" ry="6" fill="${liq(topHex)}" stroke="#7f9fac" stroke-opacity=".75" stroke-width="1.6"/></g><path d="M219 205 L165 312 Q154 332 179 334 M237 154 V183" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".8"/><path d="M303 222 H317 M315 252 H333 M327 282 H349" stroke="#7d98a4" stroke-width="1.5"/><path d="M229 145 H291" stroke="#4b7181" stroke-width="4"/><ellipse cx="260" cy="145" rx="31" ry="5" fill="#edf5f7" stroke="#7595a5" stroke-width="2"/></g>`;
  }else{
   const fillY=wellLevel(total);surfaceY=fillY;
   vessel='<ellipse cx="260" cy="356" rx="206" ry="17" fill="#aec7d0" opacity=".28"/><g class="am-vessel"><rect x="120" y="170" width="280" height="172" rx="20" fill="url(#amGlass)" stroke="#7595a5" stroke-width="3"/>';
   for(const cy of [214,293])for(const cx of [180,260,340]){const active=cx===260&&cy===214,rx=34;
    vessel+=`<path d="M${cx-rx} ${cy} V${cy+23} C${cx-rx} ${cy+48} ${cx+rx} ${cy+48} ${cx+rx} ${cy+23} V${cy}" fill="#f4f8fa" stroke="#9bb5c1" stroke-width="2"/>`;
    if(active)vessel+=`<defs><clipPath id="amWell"><path d="M${cx-rx+3} ${fillY} V${cy+24} C${cx-rx+3} ${cy+45} ${cx+rx-3} ${cy+45} ${cx+rx-3} ${cy+24} V${fillY} Z"/></clipPath></defs><g clip-path="url(#amWell)"><rect x="${cx-rx}" y="${fillY}" width="${rx*2}" height="80" fill="${liq(baseHex)}"/>${mixLayer(cx-rx,rx*2,fillY,cy+46)}</g><ellipse cx="${cx}" cy="${fillY}" rx="${rx-3}" ry="9" fill="${liq(topHex)}" stroke="#7f9fac" stroke-width="1.3"/>`;
    vessel+=`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="11" fill="none" stroke="${active?'#286b77':'#8faab6'}" stroke-width="${active?3.5:2}"/>`;}
   vessel+='</g>';
  }
  const indLiquid=state.mode==='cabbage'?'#7a4f9a':'#dfeaee',titLabel=state.titrant==='water'?'물':state.start==='acid'?'염기':'산';
  const who=a&&a.who;
  let scene=defs+vessel+indicatorBottle(REST.ind.x,indLiquid)+titrantBeaker(REST.tit.x,titLabel);
  if(who!=='ind')scene+=dropperSvg(REST.ind.x,REST.ind.tip,0,indLiquid);
  if(who!=='tit')scene+=dropperSvg(REST.tit.x,REST.tit.tip,0,'#cfe3ea');
  if(a){
   scene+=dropperSvg(a.tx,a.ty,a.squeeze,who==='ind'?indLiquid:'#cfe3ea');
   const dc=who==='ind'?(state.mode==='cabbage'?'#7a4f9a':'#c4dae2'):'#b9d6e0';
   for(const d of a.drops)scene+=`<path class="am-droplet" style="transform:translate(${(d.x-260).toFixed(1)}px,${(d.y-128).toFixed(1)}px)" d="M260 128 C252 139 252 146 260 146 C268 146 268 139 260 128 Z" fill="${dc}" stroke="#5f8796" stroke-width="1"/>`;
   if(a.splash>0)scene+=`<ellipse cx="260" cy="${surfaceY}" rx="${5+a.splash*24}" ry="${2+a.splash*4}" fill="none" stroke="#5f8796" stroke-width="1.6" opacity="${(1-a.splash).toFixed(2)}"/>`;
  }
  $('amDiagram').innerHTML=scene;$('amDiagram').setAttribute('aria-label',(state.mode==='cabbage'?'삼각 플라스크':'홈판')+'에 처음 시약 '+n(r.initial)+' mL, 더 넣은 용액 '+n(r.added)+' mL, '+r.name);
 }
 // 한 번 넣기: 병에서 스포이트를 들어 옮기고, 방울이 떨어진 뒤 색이 번지고, 스포이트는 병으로 돌아간다
 function pour(who,dropCount,from,to,ms,done){
  pendingFrom=from;const token=epoch,start=performance.now(),rest=REST[who],tipY=state.mode==='cabbage'?126:160;
  const level=t=>state.mode==='cabbage'?flaskLevel(t):wellLevel(t);
  const frame=now=>{
   if(token!==epoch)return;
   const t=clamp01((now-start)/ms);let tx,ty,squeeze=0;
   if(t<.16){tx=rest.x;ty=lerp(rest.tip,rest.tip-LIFT,ease(t/.16));}
   else if(t<.3){const u=ease((t-.16)/.14);tx=lerp(rest.x,260,u);ty=lerp(rest.tip-LIFT,tipY,u);}
   else if(t<.78){tx=260;ty=tipY;squeeze=Math.min(1,(t-.3)/.08);}
   else{const u=ease((t-.78)/.22);tx=lerp(260,rest.x,Math.min(1,u*1.6));ty=u<.6?lerp(tipY,rest.tip-LIFT,u/.6):lerp(rest.tip-LIFT,rest.tip,(u-.6)/.4);squeeze=Math.max(0,1-(t-.78)/.06);}
   const sY=level(from.total),drops=[];let splash=0;
   for(let i=0;i<dropCount;i++){const t0=.33+i*(.38/dropCount),dt=(t-t0)/.09;if(dt>=0&&dt<1)drops.push({x:260,y:tipY+4+(sY-tipY-16)*dt*dt});else if(dt>=1&&dt<1.7)splash=Math.max(splash,(dt-1)/.7);}
   const mix=clamp01((t-.4)/.52),total=lerp(from.total,to.total,clamp01((t-.35)/.42));
   anim={who,tx,ty,squeeze,drops,splash,fromHex:from.hex,mix,total,tilt:t>.5&&t<.94?Math.sin((t-.5)*30)*2.4:0};
   draw(to,anim);
   if(t<1)raf=requestAnimationFrame(frame);else{raf=0;anim=null;pendingFrom=null;done();}
  };
  raf=requestAnimationFrame(frame);
 }
 function cancelAnim(){if(raf)cancelAnimationFrame(raf);raf=0;anim=null;pendingFrom=null;}
 function render(){
  const r=M.solve(state);root.classList.toggle('am-mixing',busy);if(!anim)draw(r);
  root.querySelectorAll('[data-am-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.amMode===state.mode)));
  $('amStart').value=state.start;$('amTitrant').options[0].textContent=name(state.start==='acid'?'base':'acid');$('amTitrant').value=state.titrant;
  $('amVesselName').textContent=state.mode==='cabbage'?'삼각 플라스크':'6홈판';$('amPourLabel').textContent='넣는 용액 · '+addedName();
  $('amInitial').textContent=n(r.initial)+' mL';$('amAdded').textContent=n(r.added)+' mL';$('amColour').textContent=busy&&pendingFrom?pendingFrom.name:r.name;
  $('amIndicator').disabled=state.indicator||busy;$('amIndicator').textContent=state.indicator?'지시약을 넣었습니다':state.mode==='cabbage'?'양배추 지시약 10방울 넣기':'페놀프탈레인 3방울 넣기';
  $('amAdd').textContent=r.added>=r.max?'끝까지 넣었습니다':n(Math.min(Number($('amStep').value),r.max-r.added))+' mL 넣고 섞기';$('amAdd').disabled=!state.indicator||busy||automatic||r.added>=r.max;
  $('amPlay').disabled=!state.indicator||(!automatic&&r.added>=r.max);$('amPlay').textContent=automatic?'자동 넣기 멈추기':'끝까지 조금씩 넣기';$('amStep').disabled=busy||automatic;
  $('amStatus').textContent=busy?(r.added===0&&history.length<=1&&anim&&anim.who==='ind'?'지시약을 한 방울씩 떨어뜨리고 있습니다.':'용액을 넣고 골고루 섞고 있습니다.'):!state.indicator?'플라스크에는 '+name(state.start)+' '+n(r.initial)+' mL가 담겨 있습니다. 지시약을 넣고 처음 색을 관찰하세요.':r.added===0?'처음 색은 '+r.name+'입니다. 다른 용액을 조금씩 넣어 보세요.':addedName()+' '+n(r.added)+' mL를 더 넣었습니다. 골고루 섞인 용액은 '+r.name+'입니다.'+(state.mode==='phenol'&&r.name==='무색'?' 무색이라는 결과만으로 산성이 사라졌다고 판단하지 마세요.':'');
  if(state.mode==='phenol'&&!state.indicator)$('amStatus').textContent='홈에는 '+name(state.start)+' '+n(r.initial)+' mL가 담겨 있습니다. 지시약을 넣고 처음 색을 관찰하세요.';
  $('amHistoryEmpty').hidden=!!history.length;
  const interval=state.mode==='cabbage'?5:.5,shown=history,selected=shown.filter((h,i)=>i===0||i===shown.length-1||Math.abs(h.added/interval-Math.round(h.added/interval))<1e-6);
  $('amHistory').innerHTML=selected.map(h=>`<li><strong>${n(h.added)} mL</strong><span class="am-swatch" style="background:${h.hex}" aria-hidden="true"></span><span>${h.name}</span></li>`).join('');
 }
 function stop(){automatic=false;if(!busy)clearTimeout(timer);}
 function reset(){stop();epoch++;clearTimeout(timer);cancelAnim();busy=false;state.volume=0;state.indicator=false;history=[];render();}
 function setMode(mode){if(!['cabbage','phenol'].includes(mode))return;state.mode=mode;$('amStep').innerHTML=(mode==='cabbage'?[5,1]:[.5,.1]).map(v=>'<option value="'+v+'">'+v+' mL</option>').join('');reset();}
 function setStart(v){state.start=v==='base'?'base':'acid';reset();}
 function setTitrant(v){state.titrant=v==='water'?'water':'opposite';reset();}
 function indicator(){
  if(busy||state.indicator)return;
  const before=M.solve(state);state.indicator=true;
  if(reduced()){save();render();return;}
  // 지시약은 곧바로 넣은 것으로 치되(상태), 그림은 방울이 떨어지고 색이 번지는 과정을 보여 준 뒤 기록한다.
  busy=true;render();
  pour('ind',state.mode==='cabbage'?10:3,before,M.solve(state),2400,()=>{busy=false;save();render();});
 }
 function advance(){
  const r=M.solve(state);if(busy||!state.indicator||r.added>=r.max){if(r.added>=r.max){stop();render();}return;}
  busy=true;const token=epoch,next=Math.min(r.max,Number((r.added+Number($('amStep').value)).toFixed(2)));render();
  const finish=()=>{if(token!==epoch)return;state.volume=next;busy=false;save();if(next>=r.max)stop();render();if(automatic)timer=setTimeout(advance,300);};
  if(reduced()){timer=setTimeout(finish,0);return;}
  pour('tit',state.mode==='cabbage'?6:3,r,M.solve({...state,volume:next}),1500,finish);
 }
 root.querySelectorAll('[data-am-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.amMode)));
 $('amStart').addEventListener('change',e=>setStart(e.target.value));$('amTitrant').addEventListener('change',e=>setTitrant(e.target.value));$('amStep').addEventListener('change',render);
 $('amIndicator').addEventListener('click',indicator);$('amAdd').addEventListener('click',advance);$('amReset').addEventListener('click',reset);
 $('amPlay').addEventListener('click',()=>{if(automatic){stop();render();return;}automatic=true;advance();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){automatic=false;if(!busy)clearTimeout(timer);render();}});
 window.__acidMixing={state:()=>({...state,...M.solve(state),busy,automatic,history:history.map(h=>({...h}))}),setMode,setStart,setTitrant,indicator,reset,setVolume(v){stop();epoch++;clearTimeout(timer);cancelAnim();busy=false;state.volume=M.solve({...state,volume:v}).added;if(state.indicator)save();render();}};
 render();
});
