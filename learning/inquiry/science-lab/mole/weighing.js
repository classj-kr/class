document.addEventListener('DOMContentLoaded',()=>{'use strict';
 const M=window.MoleWeighingModel,$=id=>document.getElementById(id),host=$('mwLab');if(!host)return;let s=M.create(),timer;
 const format=x=>x.toFixed(2).replace('-','−'),message=t=>$('mwStatus').textContent=t;
 $('mwSamples').innerHTML=M.specimens.map(r=>`<button data-mw-sample="${r.id}" aria-pressed="false">${r.name}<small>${r.formula}</small></button>`).join('');
 $('mwGoals').innerHTML=M.goals.map(n=>`<button data-mw-goal="${n}" aria-pressed="false">${n} mol</button>`).join('');
 $('mwSteps').innerHTML=M.steps.map(n=>`<button data-mw-step="${n}" aria-pressed="false">${n} g</button>`).join('');
 const reasons={'container':'시료를 담을 빈 용기를 먼저 올리세요.','power':'저울 전원을 켜세요.','level':'수평계의 기포가 가운데에 오도록 수평을 맞추세요.','settle':'저울의 표시가 안정될 때까지 기다리세요.','empty':'현재 용기에 담긴 양보다 많이 덜어낼 수 없습니다.','capacity':'저울은 용기를 포함해 500 g까지 잴 수 있습니다.','container-mass':'표시에 용기의 질량이 포함되어 있습니다. 시료를 비운 뒤 빈 용기를 올리고 영점을 맞추세요.','loaded-tare':'시료가 있는 채 영점을 맞추면 그 뒤에 더 넣은 양만 표시됩니다. 시료를 비우고 빈 용기의 영점을 다시 맞추세요.'};

 // 시료를 덜어 넣는 손 도구: 고체는 약숟가락, 액체는 스포이트. 쓰지 않을 때는 왼쪽 시약병에 꽂혀 있다.
 const NS='http://www.w3.org/2000/svg',svg=host.querySelector('.mw-scene svg');
 let anim=null,visMass=null,raf=0;
 const tools=document.createElementNS(NS,'g');tools.id='mwTools';svg.appendChild(tools);
 const extra=document.createElementNS(NS,'g');extra.innerHTML='<g id="mwGrain"><circle cx="196" cy="214" r="1.1"/><circle cx="206" cy="210" r="1"/><circle cx="214" cy="215" r="1.2"/><circle cx="224" cy="208" r="1"/><circle cx="233" cy="213" r="1.1"/><circle cx="241" cy="209" r="1"/><circle cx="250" cy="214" r="1.2"/><circle cx="259" cy="211" r="1"/><circle cx="219" cy="219" r="1"/><circle cx="246" cy="219" r="1"/></g><g aria-hidden="true"><circle cx="412" cy="118" r="27" fill="#f7faf6" stroke="#8aa0ae" stroke-width="2"/><circle cx="412" cy="118" r="20" fill="#e7efc9" stroke="#9aaa86"/><circle cx="412" cy="118" r="9" fill="none" stroke="#6f8063" stroke-width="1.3"/><circle id="mwLevelBubble" cx="424" cy="118" r="6.5" fill="#d9c26a" stroke="#6b7d55"/><text x="412" y="164" text-anchor="middle" font-size="14" font-weight="600" fill="#35505e">수평계</text></g>';
 const vessel=$('mwVessel');vessel.querySelector('#mwDish').appendChild(extra.firstChild);svg.insertBefore(extra,tools);
 // 칭량 접시: 선 하나가 아니라 바닥과 테두리가 있는 넓은 접시로 다시 그린다(뒤쪽 안면 → 시료 → 앞면 순서).
 {const dish=$('mwDish'),back=dish.querySelector('path');back.setAttribute('d','M146 206Q230 196 314 206L296 226Q230 232 164 226Z');back.setAttribute('fill','#e8eef1');back.setAttribute('stroke','#8aa0ae');
  const front=document.createElementNS(NS,'path');front.setAttribute('d','M150 212Q230 220 310 212L296 226Q230 232 164 226Z');front.setAttribute('fill','#f4f8fa');front.setAttribute('fill-opacity','.6');front.setAttribute('stroke','#8aa0ae');front.setAttribute('stroke-width','2');dish.appendChild(front);
  const rim=document.createElementNS(NS,'path');rim.setAttribute('d','M153 213Q230 221 307 213');rim.setAttribute('fill','none');rim.setAttribute('stroke','#fff');rim.setAttribute('stroke-width','2');dish.appendChild(rim);}
 const BOTTLE_X=44,REST_Y=306,mix=(a,b,t)=>a+(b-a)*t,ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,clamp=t=>Math.max(0,Math.min(1,t));
 const rest=()=>({x:M.specimen(s).phase==='liquid'?BOTTLE_X:58,y:M.specimen(s).phase==='liquid'?312:REST_Y,ang:-72,loaded:false,grains:[],tilt:0});
 function bottleArt(r){
  const liquid=r.phase==='liquid',fill=liquid?(r.id==='ethanol'?'#e6f0f3':'#d4e8ef'):r.color||'#eef3f5';
  if(liquid)return `<path d="M22 266Q22 254 32 252H38V236H50V252H56Q66 254 66 266V318Q66 323 61 323H27Q22 323 22 318Z" fill="#f2f8fa" stroke="#6f8f9e" stroke-width="2"/><path d="M25 282H63V317Q63 320 60 320H28Q25 320 25 317Z" fill="${fill}"/><rect x="25" y="292" width="38" height="18" rx="2" fill="#fffdf6" stroke="#b7a780"/><text x="44" y="305.5" text-anchor="middle" font-size="12" font-weight="700" fill="#4b3d1f">${r.formula}</text>`;
  const grains=r.phase==='metal'?`<path d="M23 304l9-6 8 4-6 7Zm16 2 10-5 9 6-8 5Zm-12 10 8-5 9 3-7 5Zm22-1 9-4 7 5-8 4Z" fill="${r.color}" stroke="#5f727d" stroke-width=".8"/>`:`<path d="M20 322V300Q34 293 44 296Q56 292 68 300V322Z" fill="${fill}" stroke="${r.id==='carbon'?'#262d33':'#a7b4bb'}" stroke-width=".8"/>`;
  return `<path d="M16 262Q16 250 28 248H60Q72 250 72 262V318Q72 323 66 323H22Q16 323 16 318Z" fill="#eef5f7" fill-opacity=".85" stroke="#6f8f9e" stroke-width="2"/>${grains}<path d="M16 262Q16 250 28 248H60Q72 250 72 262" fill="none" stroke="#6f8f9e" stroke-width="2"/><rect x="21" y="268" width="46" height="20" rx="2" fill="#fffdf6" stroke="#b7a780"/><text x="44" y="282.5" text-anchor="middle" font-size="12" font-weight="700" fill="#4b3d1f">${r.formula}</text><path d="M22 300V314" stroke="#fff" stroke-width="2.5" opacity=".6" stroke-linecap="round"/>`;
 }
 function toolArt(st,r){
  if(r.phase==='liquid'){
   // 스포이트(위로 곧게 선 채 움직인다)
   return `<g transform="translate(${st.x.toFixed(1)} ${st.y.toFixed(1)}) scale(.55)"><path d="M-8 -122 Q-17 -142 0 -143 Q17 -142 8 -122 V-102 H-8 Z" fill="#3f6f80" transform="scale(${1-.25*(st.tilt||0)} 1)"/><rect x="-10" y="-104" width="20" height="6" rx="2" fill="#2c5361"/><path d="M-6 -98 H6 V-19 L1 0 H-1 L-6 -19 Z" fill="#eef6f9" stroke="#6f8f9e" stroke-width="2"/>${st.loaded?'<path d="M-4 -60 H4 V-19 L0 -6 L-4 -19 Z" fill="#b8d6e0"/>':''}</g>`;
  }
  const load=st.loaded?`<ellipse cx="-1" cy="-3" rx="9" ry="3.6" fill="${r.color||'#ccc'}" stroke="${r.id==='carbon'?'#262d33':'#9aa8b0'}" stroke-width=".7"/>`:'';
  return `<g transform="translate(${st.x.toFixed(1)} ${st.y.toFixed(1)}) rotate(${(st.ang+st.tilt).toFixed(1)})"><path d="M8 -1.6 H128 Q132 0 128 1.6 H8 Z" fill="#c4ccd1" stroke="#7d8a92" stroke-width="1"/><path d="M-12 0 Q-12 -6 0 -6 Q10 -6 12 -1.6 V1.6 Q10 6 0 6 Q-12 6 -12 0 Z" fill="#d9dfe3" stroke="#7d8a92" stroke-width="1.2"/></g>`+(st.loaded?`<g transform="translate(${st.x.toFixed(1)} ${st.y.toFixed(1)})">${load}</g>`:'');
 }
 function drawTools(st){
  const r=M.specimen(s);let out=bottleArt(r)+toolArt(st,r);
  const c=r.phase==='liquid'?'#9fc7d4':r.color||'#ccc',edge=r.id==='carbon'?'#262d33':'#8b9aa3';
  for(const g of st.grains)out+=r.phase==='liquid'?`<path d="M${g.x} ${g.y-6} C${g.x-4} ${g.y} ${g.x-4} ${g.y+3} ${g.x} ${g.y+3} C${g.x+4} ${g.y+3} ${g.x+4} ${g.y} ${g.x} ${g.y-6} Z" fill="${c}" stroke="#5f8796" stroke-width=".8"/>`:r.phase==='metal'?`<path d="M${g.x-4} ${g.y}l5-3 4 3-5 3Z" fill="${c}" stroke="#5f727d" stroke-width=".7"/>`:`<circle cx="${g.x.toFixed(1)}" cy="${g.y.toFixed(1)}" r="1.6" fill="${c}" stroke="${edge}" stroke-width=".5"/>`;
  tools.innerHTML=out;
 }
 function pileTop(mass){const r=M.specimen(s),liquid=r.phase==='liquid',a=Math.min(1,mass/(liquid?65:190));return liquid?215-Math.max(2,a*112):223-Math.max(2,Math.pow(a,.4)*70);}
 // 넣기(+)·덜기(−) 한 번을 1초 남짓 움직여 보이고, 끝나면 저울 표시가 안정되기를 기다린다.
 function animateChange(from,to,done){
  cancelAnimationFrame(raf);const r=M.specimen(s),liquid=r.phase==='liquid',adding=to>from,start=performance.now(),dur=1150,home=rest();
  const tx=liquid?232:228,top0=pileTop(from),top1=pileTop(to),ty=liquid?132:Math.min(top0,top1)-16,lift=liquid?150:168;
  const seeds=Array.from({length:liquid?3:16},(_,i)=>({dx:((i*37)%21)-10,t0:.47+i*(.24/(liquid?3:16))}));
  const frame=now=>{
   const t=clamp((now-start)/dur);let x,y,ang,tilt=0,loaded=adding;
   if(t<.22){const u=ease(t/.22);x=home.x;y=mix(home.y,lift,u);ang=home.ang;}
   else if(t<.42){const u=ease((t-.22)/.2);x=mix(home.x,tx,u);y=mix(lift,ty,u);ang=mix(home.ang,-150,u);}
   else if(t<.76){x=tx;y=ty+(adding?0:Math.sin((t-.42)/.34*Math.PI)*10);ang=-150;tilt=adding?Math.min(1,(t-.42)/.08)*26:0;loaded=adding?t<.7:t>.55;}
   else{const u=ease((t-.76)/.24);x=mix(tx,home.x,u);y=u<.5?mix(ty,lift,u*2):mix(lift,home.y,(u-.5)*2);ang=mix(-150,home.ang,u);loaded=!adding&&u<.8;}
   if(liquid){ang=0;tilt=t>.42&&t<.76?1:0;}
   const grains=[];if(adding)for(const g of seeds){const d=(t-g.t0)/.14;if(d>=0&&d<1)grains.push({x:tx-2+g.dx*(liquid?0:.6)*d,y:ty+4+(top0-ty-4)*d*d});}
   visMass=t<.5?from:t>.78?to:mix(from,to,(t-.5)/.28);
   anim={x,y,ang,tilt,loaded,grains};render();drawTools(anim);
   if(t<1)raf=requestAnimationFrame(frame);else{anim=null;visMass=null;render();done();}
  };
  anim=rest();raf=requestAnimationFrame(frame);
 }
 function stable(){clearTimeout(timer);render();timer=setTimeout(()=>{M.settle(s);render();},400);}
 function render(){
  const r=M.specimen(s),liquid=r.phase==='liquid',value=M.reading(s);host.dataset.sample=s.sample;host.dataset.power=String(s.power);host.dataset.level=String(s.level);
  for(const b of host.querySelectorAll('[data-mw-sample]'))b.setAttribute('aria-pressed',String(b.dataset.mwSample===s.sample));for(const b of host.querySelectorAll('[data-mw-goal]'))b.setAttribute('aria-pressed',String(+b.dataset.mwGoal===s.goal));for(const b of host.querySelectorAll('[data-mw-step]'))b.setAttribute('aria-pressed',String(+b.dataset.mwStep===s.step));
  $('mwTarget').textContent=`${r.name} ${s.goal} mol`; $('mwFormula').textContent=`${r.formula} · 원자량 ${r.atoms}`;$('mwShowCalculation').setAttribute('aria-expanded',String(s.calculation));$('mwCalculation').hidden=!s.calculation;$('mwCalculation').textContent=`몰질량 ${r.M.toFixed(1)} g/mol × ${s.goal} mol = ${format(M.target(s))} g`;
  $('mwDisplay').textContent=!s.power?'꺼짐':!s.level?'수평 조절':!s.settled?'···':format(value);$('mwUnit').hidden=!s.power||!s.level||!s.settled;
  $('mwPower').textContent=s.power?'전원 끄기':'전원 켜기';$('mwPower').setAttribute('aria-pressed',String(s.power));$('mwLevel').disabled=s.level;$('mwLevel').textContent=s.level?'수평 맞춤':'수평 맞추기';$('mwPlace').disabled=s.pan;$('mwPlace').textContent=liquid?'빈 비커 올리기':'빈 질량 접시 올리기';$('mwEmpty').disabled=!s.pan||!s.mass;
  $('mwContainer').textContent=liquid?'비커 · 42.00 g':'질량 접시 · 8.00 g';$('mwReadState').textContent=!s.power?'전원을 켜고 수평을 맞추세요.':!s.level?'수평계의 기포를 확인하세요.':!s.settled?'측정 중':'안정 · 최소 표시 0.01 g';
  $('mwBubble').setAttribute('cx',s.level?'84':'102');$('mwVessel').style.opacity=s.pan?'1':'0';$('mwBeaker').style.display=liquid?'':'none';$('mwDish').style.display=liquid?'none':'';
  const vm=visMass==null?s.mass:visMass,amount=Math.min(1,vm/(liquid?65:190)),height=liquid?Math.max(2,amount*112):Math.max(2,Math.pow(amount,.4)*70);
  $('mwLiquid').setAttribute('d',`M166 ${215-height}H294V220Q294 227 286 227H174Q166 227 166 220Z`);$('mwLiquid').style.opacity=vm&&liquid?'.65':'0';
  $('mwSolid').setAttribute('d',`M151 225Q168 ${223-height*.7} 184 ${223-height*.72}Q220 ${218-height} 238 ${222-height*.6}Q259 ${215-height*.7} 281 225Z`);$('mwSolid').setAttribute('fill',r.color||'#eef5f8');$('mwSolid').style.opacity=vm&&!liquid&&r.phase!=='metal'?'1':'0';$('mwSolid').setAttribute('stroke',r.id==='carbon'?'#262d33':'#a7b4bb');
  $('mwMetal').style.opacity=vm&&r.phase==='metal'?'1':'0';$('mwMetal').setAttribute('fill',r.color||'#a5b8c5');$('mwMetal').setAttribute('transform',`translate(0 ${-Math.min(12,vm/5)})`);$('mwGrain').style.opacity=vm&&!liquid&&r.phase!=='metal'?'1':'0';$('mwGrain').setAttribute('transform',`translate(0 ${(-height*.55+12).toFixed(1)})`);$('mwGrain').setAttribute('fill',r.id==='carbon'?'#1f262b':'#c3ced4');$('mwLevelBubble').setAttribute('cx',s.level?'412':'424');$('mwLevelBubble').setAttribute('fill',s.level?'#8cc28e':'#d9c26a');if(!anim)drawTools(rest());
  $('mwResults').hidden=!M.specimens.some(r=>s.results[r.id+'@'+s.goal]);
  $('mwRows').innerHTML=M.specimens.filter(r=>s.results[r.id+'@'+s.goal]).map(r=>{const a=s.results[r.id+'@'+s.goal];return`<tr><th scope="row">${r.name}<small>${r.formula}</small></th><td>${a?format(a.mass)+' g':'—'}</td><td>${a?s.goal+' mol':'—'}</td></tr>`;}).join('');$('mwTableCaption').textContent=`${s.goal} mol씩 덜어 잰 결과`;
 }
 host.addEventListener('click',e=>{const sample=e.target.closest('[data-mw-sample]'),goal=e.target.closest('[data-mw-goal]'),step=e.target.closest('[data-mw-step]');if(sample){clearTimeout(timer);cancelAnimationFrame(raf);anim=null;visMass=null;M.select(s,sample.dataset.mwSample);message('새 시료의 빈 용기를 올리고 영점을 맞추세요.');render();}if(goal){M.goal(s,+goal.dataset.mwGoal);message('목표 몰수가 바뀌었습니다. 같은 용기에서 시료의 양을 조절할 수 있습니다.');render();}if(step){s.step=+step.dataset.mwStep;render();}});
 $('mwPower').onclick=()=>{s.power=!s.power;render();};$('mwLevel').onclick=()=>{s.level=true;message('기포가 가운데에 왔습니다.');render();};$('mwPlace').onclick=()=>{if(M.place(s)){message('빈 용기를 올렸습니다. 표시가 안정되면 영점을 맞추세요.');stable();}};
 $('mwTare').onclick=()=>{const r=M.zero(s);message(r.ok?(s.mass?'현재 용기와 시료를 합한 질량을 0으로 맞췄습니다.':'현재 올려 둔 질량을 0으로 맞췄습니다.'):reasons[r.reason]);render();};
 for(const[id,sign]of [['mwAdd',1],['mwRemove',-1]])$(id).onclick=()=>{const before=s.mass,r=M.change(s,sign*s.step);if(r.ok){message(sign>0?(M.specimen(s).phase==='liquid'?'스포이트로 조금씩 떨어뜨렸습니다. 저울 표시를 보고 조절하세요.':'약숟가락으로 조금 덜어 넣었습니다. 저울 표시를 보고 조절하세요.'):(M.specimen(s).phase==='liquid'?'스포이트로 조금 빨아냈습니다. 저울 표시를 보고 조절하세요.':'약숟가락으로 조금 덜어냈습니다. 저울 표시를 보고 조절하세요.'));if(matchMedia('(prefers-reduced-motion: reduce)').matches||anim)stable();else{clearTimeout(timer);s.settled=false;animateChange(before,s.mass,stable);}}else message(reasons[r.reason]);};
 $('mwEmpty').onclick=()=>{s.mass=0;s.settled=false;message('용기만 남았습니다. 영점을 다시 맞출 수 있습니다.');stable();};$('mwShowCalculation').onclick=()=>{s.calculation=!s.calculation;render();};
 $('mwCheck').onclick=()=>{const r=M.check(s);message(r.ok?`${M.specimen(s).name} ${format(r.mass)} g은 ${s.goal} mol입니다. 다른 물질과 질량을 비교하세요.`:reasons[r.reason]||`${format(r.mass)} g ÷ ${M.specimen(s).M} g/mol = ${r.moles.toFixed(3)} mol입니다. 목표보다 ${r.reason==='too-little'?'적으므로 더 넣으세요.':'많으므로 덜어내세요.'}`);render();};
 function reset(){clearTimeout(timer);cancelAnimationFrame(raf);anim=null;visMass=null;s=M.create();message('흑연 0.5 mol의 질량을 구하고, 저울로 그 양을 맞춰 보세요.');render();}$('mwReset').onclick=reset;
 window.__moleWeighing={getState:()=>JSON.parse(JSON.stringify(s)),model:M,render};reset();
});
