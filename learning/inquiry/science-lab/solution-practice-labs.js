(function(){
 'use strict';const host=document.querySelector('[data-solution]');if(!host)return;
 const M=window.ScienceSolutionPractice,slug=host.dataset.solution,$=id=>document.getElementById(id),say=t=>$('soStatus').textContent=t;
 let s,model,render,reset;const on=(id,fn,event='click')=>$(id).addEventListener(event,fn),fmt=(v,n=2)=>Number(v).toFixed(n);
 const text=(x,y,t,anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}">${t}</text>`;
 const defs='<defs><linearGradient id="soGlass"><stop stop-color="#c6dfe7" stop-opacity=".5"/><stop offset=".25" stop-color="#fff" stop-opacity=".8"/><stop offset=".7" stop-color="#e6f0f5" stop-opacity=".1"/><stop offset="1" stop-color="#9abfcf" stop-opacity=".55"/></linearGradient><linearGradient id="soWater" x2="0" y2="1"><stop stop-color="#daeef4" stop-opacity=".5"/><stop offset="1" stop-color="#84b9c8" stop-opacity=".7"/></linearGradient><linearGradient id="soMetal"><stop stop-color="#516e7b"/><stop offset=".4" stop-color="#b8ccd4"/><stop offset="1" stop-color="#6b8793"/></linearGradient></defs>';
 function font(){if(window.scienceNormalizeFigure)return;for(const svg of host.querySelectorAll('svg')){const w=svg.getBoundingClientRect().width;if(w)for(const t of svg.querySelectorAll('text'))t.style.fontSize=(15*Number(svg.getAttribute('viewBox').split(' ')[2])/w)+'px';}}
 function scene(body,h=410){window.scienceScene.render($('soScene'),`<svg viewBox="0 0 600 ${h}" role="img" aria-label="${host.querySelector('h2').textContent}">${defs}${body}</svg>`);font();}
 function steps(items){$('soSteps').innerHTML=items.map(([t,done])=>`<span class="${done?'done':''}">${done?'✓ ':''}${t}</span>`).join('');}
 const setDisabled=(id,b)=>$(id).disabled=b;
 function table(caption,headers,rows){return `<table><caption>${caption}</caption><thead><tr>${headers.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table>`;}
 const superscript=n=>String(n).split('').map(c=>({'-':'⁻','+':'⁺','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'}[c])).join('');
 const scientific=c=>{const[a,b]=c.toExponential(2).split('e');return a+' × 10'+superscript(b);};
 // Shared motion helpers for the apparatus drawings below.
 const soReduce=()=>!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,soEase=t=>t<.5?2*t*t:1-(-2*t+2)**2/2,soCl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),soSeg=(f,a,b)=>soCl((f-a)/(b-a));
 let soAnim=null,soRaf=0,soPaint=null;
 function soPlay(kind,dur,extra={}){if(soReduce()){soAnim=null;return;}soAnim={kind,dur,start:performance.now(),...extra};if(!soRaf){const tick=now=>{soRaf=0;if(soPaint)soPaint(now);if(soAnim)soRaf=requestAnimationFrame(tick);};soRaf=requestAnimationFrame(tick);}}
 function soFrame(now=performance.now()){if(!soAnim)return null;const f=(now-soAnim.start)/soAnim.dur;if(f>=1){soAnim=null;return null;}return {...soAnim,f};}
 function washBottle(x,y,angle,sq=0){return `<g transform="rotate(${angle.toFixed(1)} ${x} ${y})"><path d="M${x-20+sq*3} ${y}H${x+20-sq*3}Q${x+24} ${y-46} ${x+15} ${y-70}H${x-15}Q${x-24} ${y-46} ${x-20+sq*3} ${y}Z" fill="#eef4f7" stroke="#6f8e9b" stroke-width="2"/><rect x="${x-18}" y="${y-32}" width="36" height="26" fill="#d4e9f2" opacity=".85"/><rect x="${x-8}" y="${y-82}" width="16" height="12" rx="2" fill="#5d87a3"/><path d="M${x} ${y-82}V${y-96}Q${x} ${y-104} ${x-10} ${y-106}L${x-36} ${y-113}" fill="none" stroke="#b8cfd8" stroke-width="5" stroke-linecap="round"/></g>`;}
 // Nozzle tip of washBottle after rotation.
 function washTip(x,y,angle){const a=angle*Math.PI/180,dx=-36,dy=-113;return {x:x+dx*Math.cos(a)-dy*Math.sin(a),y:y+dx*Math.sin(a)+dy*Math.cos(a)};}
 const flowPath=(d,now,w=2.6)=>`<path d="${d}" fill="none" stroke="#7fbdd6" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="7 5" stroke-dashoffset="${(-now/16%12).toFixed(1)}"/>`;
 if(slug==='standard-solution'){
  model=M.standard;
  const BEN=372,FX=470,MARK=170,stFlask='M456 112V230C456 246 404 268 402 318Q400 370 424 372H516Q540 370 538 318C536 268 484 246 484 230V112Z';
  const stY=v=>v<=90?BEN-2-v/90*140:Math.max(114,232-(v-90)/10*62),bkY=ml=>BEN-3-ml*.9,pre=50;
  const cubes=(x,y,n,spread=20,k=0)=>{let g='';for(let i=0;i<n;i++)g+=`<rect x="${(x-spread/2+((i*7+k)%11)/10*spread).toFixed(1)}" y="${(y-Math.floor(i/6)*3.6-((i*5)%3)).toFixed(1)}" width="3.6" height="3.6" fill="#fdfdfb" stroke="#9fb0b8" stroke-width=".6"/>`;return g;};
  function stBeaker(ml,extra=''){const L=235,R=325,T=272;let g=`<path d="M${L} ${T}V${BEN-10}Q${L} ${BEN} ${L+10} ${BEN}H${R-10}Q${R} ${BEN} ${R} ${BEN-10}V${T}" fill="url(#soGlass)" stroke="#88aab9" stroke-width="2"/>`;
   if(ml>0)g+=`<path d="M${L+2} ${bkY(ml).toFixed(1)}H${R-2}V${BEN-10}Q${R-2} ${BEN-2} ${R-10} ${BEN-2}H${L+10}Q${L+2} ${BEN-2} ${L+2} ${BEN-10}Z" fill="url(#soWater)"/>`;
   return g+extra+`<path d="M${R+5} ${T-1}Q${R+2} ${T-5} ${R-2} ${T-1}" fill="none" stroke="#88aab9" stroke-width="2"/>`+[0,1,2].map(i=>`<path d="M${L+6} ${T+24+i*20}h10" stroke="#88aab9"/>`).join('');}
  function stDish(x,y,angle,n){return `<g transform="rotate(${angle.toFixed(1)} ${x} ${y})"><path d="M${x-34} ${y-6}Q${x} ${y+12} ${x+34} ${y-6}L${x+30} ${y+2}Q${x} ${y+14} ${x-30} ${y+2}Z" fill="#eef3ee" stroke="#9fb0a8" stroke-width="1.4"/>${n?cubes(x,y,n,26):''}</g>`;}
  function stScene(now=performance.now()){
   const A=soFrame(now),k=A?A.kind:null,f=A?A.f:1;
   let dish={x:110,y:316,a:0},dishN=s.pan&&s.weighed&&!s.dissolved?18:0,shown=model.display(s),bk={tx:0,ty:0,a:0},bkMl=s.transferred?0:pre,bkCubes=0,rod=null,vol=s.transferred?s.volume:0,stream='',bottle='',stopper=s.mixed,flaskRot=0,funnel=s.transferred&&!s.premixed;
   if(!s.pan)dish=null;
   if(k==='pan'){dish.y=316-60*(1-soEase(f));shown=0;}
   if(k==='weigh'){const g=soEase(soSeg(f,.15,.85));dishN=Math.round(18*g);shown=A.from+(model.display(s)-A.from)*g;}
   if(k==='dissolve'){const go=soEase(soSeg(f,0,.22)),back=soEase(soSeg(f,.6,.82)),tilt=soEase(soSeg(f,.22,.36))*(1-soSeg(f,.5,.6));const m=go*(1-back);dish={x:110+(258-110)*m,y:316+(232-316)*m,a:62*tilt};dishN=Math.round(18*(1-soSeg(f,.26,.5)));
    for(let i=0;i<14;i++){const t0=.27+i*.014,q=(f-t0)/.16;if(q>0&&q<1)stream+=`<rect x="${(282+((i*7)%9)).toFixed(1)}" y="${(246+q*q*(bkY(pre)-246)).toFixed(1)}" width="3.6" height="3.6" fill="#fdfdfb" stroke="#9fb0b8" stroke-width=".6"/>`;}
    bkCubes=Math.round(16*soSeg(f,.32,.52)*(1-soSeg(f,.58,.96)));if(f>.5)rod=f*28;}
   const pour=(a,b,move=.25,back=.8)=>{const m=soEase(soSeg(f,0,move))*(1-soEase(soSeg(f,back,1)));bk={tx:(446-325)*m,ty:(74-272)*m,a:45*m};return soSeg(f,move,back);};
   if(k==='transfer'){const p=pour();bkMl=pre*(1-p);vol=60*soEase(p);if(p>0&&p<1)stream+=flowPath(`M448 76Q462 86 466 98`,now)+flowPath(`M470 116V150L470 ${stY(vol).toFixed(1)}`,now,2);}
   if(k==='rinse'){const sq=soSeg(f,.02,.3),tip=washTip(370,330,-30);bottle=washBottle(370,330,-30*soSeg(f,0,.06)*(1-soSeg(f,.3,.36)),f<.3?1:0);if(f<.3)stream+=flowPath(`M${tip.x.toFixed(1)} ${tip.y.toFixed(1)}Q300 ${(tip.y-10).toFixed(1)} 290 ${bkY(8).toFixed(1)}`,now);
    const fq=soSeg(f,.36,1);if(fq>0){const m=soEase(soSeg(fq,0,.25))*(1-soEase(soSeg(fq,.8,1))),p=soSeg(fq,.25,.8);bk={tx:(446-325)*m,ty:(74-272)*m,a:45*m};bkMl=8*(1-p);vol=A.from+(s.volume-A.from)*soEase(p);if(p>0&&p<1)stream+=flowPath(`M448 76Q462 86 466 98`,now)+flowPath(`M470 116V150L470 ${stY(vol).toFixed(1)}`,now,2);}else{bkMl=8*sq;vol=A.from;}}
   if(k==='premix'){stopper=true;funnel=false;flaskRot=14*Math.sin(f*Math.PI*4)*(1-f);}
   if(k==='add'){const ang=-38*soSeg(f,0,.15)*(1-soSeg(f,.85,1)),tip=washTip(560,232,ang);bottle=washBottle(560,232,ang,f>.15&&f<.85?1:0);const p=soSeg(f,.18,.82);vol=A.from+(s.volume-A.from)*soEase(p);if(p>0&&p<1)stream=flowPath(`M${tip.x.toFixed(1)} ${tip.y.toFixed(1)}Q${FX+10} ${(tip.y-16).toFixed(1)} ${FX+2} 112`,now)+flowPath(`M${FX} 114V${stY(vol).toFixed(1)}`,now,1.6);}
   if(k==='mix'){stopper=true;flaskRot=180*(1-Math.cos(4*Math.PI*f))/2;}
   let b='<rect x="0" y="'+BEN+'" width="600" height="'+(410-BEN)+'" fill="#efe8dc"/><path d="M0 '+BEN+'H600" stroke="#cbbda5" stroke-width="2"/>';
   // electronic balance with a weighing dish
   b+='<rect x="30" y="330" width="160" height="42" rx="8" fill="#dbe5ea" stroke="#8099a7" stroke-width="1.6"/><rect x="48" y="322" width="124" height="8" rx="2" fill="url(#soMetal)" stroke="#8099a7"/><rect x="58" y="338" width="104" height="26" rx="4" fill="#e0efe3" stroke="#a1b6ae"/>'+`<text x="154" y="357" text-anchor="end" style="font-family:Consolas,monospace">${fmt(Math.max(0,shown))} g</text>`;
   if(k==='weigh'){const tap=Math.sin(f*40)*2;b+=`<path d="M190 ${262+tap}L124 ${296+tap}" stroke="#7d8c94" stroke-width="4" stroke-linecap="round"/><path d="M128 ${292+tap}l-12 6" stroke="#a9b6bc" stroke-width="8" stroke-linecap="round"/>`+(f<.85?cubes(120,296+tap,6,10):'');for(let i=0;i<8;i++){const q=((f*6)+i/8)%1;if(f>.12&&f<.86)b+=`<rect x="${(113+i%3*3).toFixed(1)}" y="${(300+q*14).toFixed(1)}" width="3.4" height="3.4" fill="#fdfdfb" stroke="#9fb0b8" stroke-width=".6"/>`;}}
   if(dish)b+=stDish(dish.x,dish.y,dish.a,dishN);
   // beaker (moves to pour through the funnel)
   const bkExtra=(bkCubes?cubes(281,BEN-6,bkCubes,30):'')+(rod!==null?`<path d="M${(272+Math.sin(rod)*20).toFixed(1)} ${BEN-8}L${(300+Math.sin(rod)*6).toFixed(1)} 236" stroke="#8fb3c2" stroke-width="5" stroke-linecap="round" opacity=".85"/>`:'')+(s.transferred&&s.rinses<3&&!k?[[240,320],[318,338],[252,356]].map(([x,y])=>`<path d="M${x} ${y}q5 7 0 10q-5-3 0-10" fill="#80b0c0" opacity="${.85-s.rinses*.2}"/>`).join(''):'');
   b+=bk.a?`<g transform="translate(${bk.tx.toFixed(1)} ${bk.ty.toFixed(1)}) rotate(${bk.a.toFixed(1)} 325 272)">${stBeaker(0,bkMl>0?`<rect x="${(323-30*Math.min(1,bkMl/pre+.2)).toFixed(1)}" y="276" width="${(30*Math.min(1,bkMl/pre+.2)).toFixed(1)}" height="${(10+80*Math.min(1,bkMl/pre)).toFixed(1)}" fill="url(#soWater)"/>`:'')}</g>`:stBeaker(bkMl,bkExtra);
   // volumetric flask
   b+=`<ellipse cx="${FX}" cy="${BEN+2}" rx="70" ry="6" fill="#9ab5c2" opacity=".18"/>`;
   let fl=`<defs><clipPath id="stFlask"><path d="${stFlask}"/></clipPath></defs><path d="${stFlask}" fill="url(#soGlass)" stroke="#87a5b5" stroke-width="2"/>`;
   if(vol>0){const y=stY(vol);fl+=`<g clip-path="url(#stFlask)"><path d="M396 ${y}H544V374H396Z" fill="url(#soWater)"/>${y<232?`<path d="M456 ${(y-4).toFixed(1)}Q${FX} ${(y+4).toFixed(1)} 484 ${(y-4).toFixed(1)}" fill="none" stroke="#3f7d91" stroke-width="2"/>`:''}</g>`;}
   fl+=`<path d="M450 ${MARK}H490" stroke="#ba7140" stroke-width="2"/>`;
   if(stopper)fl+=`<path d="M458 96H482L479 116H461Z" fill="#4b6674"/>`;
   b+=flaskRot?`<g transform="rotate(${flaskRot.toFixed(1)} ${FX} 242)">${fl}</g>`:fl;
   if(!flaskRot)b+=text(444,MARK+5,'100 mL','end');
   if(funnel)b+=`<path d="M440 78H500L474 112V150H466V112Z" fill="url(#soGlass)" stroke="#87a5b5" stroke-width="1.8"/>`;
   b+=stream+bottle;
   if(s.transferred&&!flaskRot){const y=stY(vol),ey=MARK+{above:-43,level:0,below:43}[s.eye];b+=`<path d="M566 ${ey}L486 ${y.toFixed(1)}" stroke="#8297a0" stroke-dasharray="5 5"/><path d="M560 ${ey}q14-12 29 0q-15 12-29 0" fill="#fff" stroke="#5e7c8b"/><circle cx="574" cy="${ey}" r="4" fill="#405c6e"/>`;}
   b+=text(110,BEN+26,'전자저울')+text(280,BEN+26,'비커')+text(FX,BEN+26,'부피 플라스크');
   scene(b,410);
  }
  soPaint=stScene;
  render=()=>{steps([['질량',s.weighed],['용해',s.dissolved],['모두 옮김',s.rinses>=3],['정용·혼합',s.mixed]]);stScene();
   setDisabled('stPan',s.pan);setDisabled('stTare',!s.pan||s.weighed);setDisabled('stWeigh',!s.pan||s.weighed);setDisabled('stMass',s.weighed);setDisabled('stDissolve',!s.weighed||s.dissolved);setDisabled('stTransfer',!s.dissolved||s.transferred);setDisabled('stRinse',!s.transferred||s.mixed||s.rinses>=3||s.volume>85);setDisabled('stPremix',!s.transferred||s.premixed||s.mixed);setDisabled('stWater',!s.premixed||s.mixed||s.volume>105);setDisabled('stDrop',!s.premixed||s.mixed||s.volume>=110);setDisabled('stMix',!s.transferred||s.mixed);setDisabled('stEye',!s.transferred);
  };
  reset=()=>{soAnim=null;s=model.create();$('stMass').value=5.85;$('stEye').value='level';$('stResult').textContent='용액을 모두 옮긴 뒤 수면 아래쪽을 표시선에 맞추세요.';say('빈 질량 접시를 올리고 영점을 맞추세요. 목표는 1.00 M·100 mL입니다.');render();};
  on('stPan',()=>{if(!s.pan)soPlay('pan',700);s.pan=true;say('빈 질량 접시의 무게도 저울에 포함됩니다. NaCl만 재려면 영점을 맞추세요.');render();});
  on('stTare',()=>{s.tared=true;say('빈 접시가 0.00 g이 되었습니다. 필요한 NaCl의 질량을 계산하여 담으세요.');render();});
  on('stWeigh',()=>{const mass=Number($('stMass').value);if(!(mass>0&&mass<=10))return say('NaCl을 0보다 크고 10 g 이하로 담으세요.');const from=model.display(s);s.mass=mass;s.weighed=true;soPlay('weigh',1600,{from});say(s.tared?'NaCl의 질량을 확인했습니다. 적은 양의 물에 완전히 녹이세요.':'저울 값에는 접시 2.00 g이 포함되어 있습니다. NaCl 질량과 구별하세요.');render();});
  on('stDissolve',()=>{s.dissolved=true;soPlay('dissolve',2800);say('NaCl이 모두 녹았습니다. 깔때기로 용액을 옮기고 비커와 깔때기의 남은 용액도 함께 옮기세요.');render();});
  on('stTransfer',()=>{s.transferred=true;s.volume=60;soPlay('transfer',2800);say('용액을 옮겼지만 비커 벽에 일부 남아 있습니다. 증류수로 헹구어 함께 넣으세요.');render();});
  on('stRinse',()=>{const from=s.volume;if(model.rinse(s))soPlay('rinse',2400,{from});say(s.rinses>=3?'세척한 물까지 함께 옮겼습니다. 수면이 표시선에 가까워지면 조금씩 채우세요.':'비커와 깔때기를 헹구어 함께 넣었습니다. 남은 용액을 다시 확인하세요.');render();});
  on('stPremix',()=>{s.premixed=true;soPlay('premix',1500);say('마개를 닫고 먼저 섞었습니다. 마개를 열고 표시선까지 조금씩 채우세요.');render();});
  for(const[id,v]of[['stWater',5],['stDrop',.1]])on(id,()=>{const from=s.volume;if(model.add(s,v))soPlay('add',v>1?1400:900,{from});say(s.volume>100.05?'수면이 표시선을 넘었습니다. 용액 일부를 덜어도 희석된 농도가 회복되지는 않습니다.':'오목한 수면 아래쪽과 표시선을 같은 눈높이에서 비교하세요.');render();});
  on('stEye',()=>{s.eye=$('stEye').value;render();},'change');
  on('stMix',()=>{if(s.eye!=='level')return say('눈높이를 표시선에 맞추고 수면을 다시 읽으세요.');s.mixed=true;soPlay('mix',1900);render();const c=model.concentration(s);$('stResult').textContent=c===null?'비커에 남은 용액을 모두 옮기지 않아 처음 잰 NaCl의 양으로 정확한 농도를 계산할 수 없습니다.':`NaCl ${fmt(s.mass)} g ÷ 58.5 g/mol ÷ ${fmt(s.volume/1000,4)} L = ${fmt(c,3)} M. ${Math.abs(c-1)<.003?'목표 농도입니다.':'목표 1.00 M과 비교해 질량과 최종 부피를 확인하세요.'}`;say('마개를 닫고 고르게 섞었습니다. 처음 물의 양과 최종 용액 부피를 구별하세요.');});
 }
 if(slug==='serial-dilution'){
  model=M.dilution;
  const graph=()=>{const rows=Object.entries(s.readings).map(([i,p])=>({c:s.samples[i].c,p})),min=Math.min(-3,...rows.map(r=>Math.floor(Math.log10(r.c)))),x=c=>75+(Math.log10(c)-min)/(-1-min)*450,y=p=>260-p/14*210;let b='<path d="M75 40V260H530" fill="none" stroke="#8298a4"/>';
   for(let p=0;p<=14;p+=2)b+=`<path d="M75 ${y(p)}H530" stroke="#dbe5e9"/>`+text(57,y(p)+5,p);
   const step=Math.max(1,Math.ceil((-1-min)/5));for(let n=min;n<=-1;n+=step)b+=text(x(10**n),289,'10'+['⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹','¹⁰','¹¹','¹²'][Math.abs(n)].replace(/^/,'⁻'));
   b+=text(38,30,'pH')+text(304,326,'몰농도 (M)');const sorted=rows.sort((a,b)=>a.c-b.c);if(rows.length>1)b+=`<polyline points="${sorted.map(r=>x(r.c)+','+y(r.p)).join(' ')}" fill="none" stroke="#367b86" stroke-width="2"/>`;for(const r of rows)b+=`<circle cx="${x(r.c)}" cy="${y(r.p)}" r="4" fill="#247283"/>`;window.scienceScene.render($('dlGraph'),`<svg viewBox="0 0 600 355" role="img" aria-label="측정한 몰농도와 pH의 관계">${b}</svg>`);
  };
  // Apparatus drawing. The model changes at once; the picture replays the step.
  let dlAnim=null,dlRaf=0;const reduce=()=>!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,ease=t=>t<.5?2*t*t:1-(-2*t+2)**2/2,cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),seg=(f,a,b)=>cl((f-a)/(b-a));
  const play=(kind,dur,extra={})=>{if(reduce()){dlAnim=null;return;}dlAnim={kind,dur,start:performance.now(),...extra};if(!dlRaf){const frame=now=>{dlRaf=0;dlScene(now);if(dlAnim)dlRaf=requestAnimationFrame(frame);};dlRaf=requestAnimationFrame(frame);}};
  const BENCH=410,STAND={x:300,tip:400},TRAVEL=222,BEAKER={x:120,tip:392},FLASK={x:451,tip:300};
  const flaskY=v=>v<=90?BENCH-2-(v/90)*96:BENCH-98-(v-90)/10*50;
  function path3(a,c,f){const d1=Math.abs(a.tip-TRAVEL),d2=Math.abs(a.x-c.x),d3=Math.abs(c.tip-TRAVEL),tot=d1+d2+d3||1,s=ease(f)*tot;return s<d1?{x:a.x,tip:a.tip+(TRAVEL-a.tip)*s/(d1||1)}:s<d1+d2?{x:a.x+(c.x-a.x)*(s-d1)/(d2||1),tip:TRAVEL}:{x:c.x,tip:TRAVEL+(c.tip-TRAVEL)*cl((s-d1-d2)/(d3||1))};}
  function pipetteArt(x,tip,fill,squeeze){
   const top=tip-170,bulb=tip-82,mark=tip-150,liq=fill>0?tip-fill*(tip-mark):tip;let g='';
   if(fill>0){g+=`<path d="M${x-2} ${Math.max(liq,bulb+22)}V${tip-4}L${x} ${tip}L${x+2} ${tip-4}V${Math.max(liq,bulb+22)}Z" fill="#9cc9d8"/>`;if(liq<bulb+22){const yy=Math.max(liq,bulb-22);g+=`<clipPath id="dlBulbClip"><ellipse cx="${x}" cy="${bulb}" rx="9" ry="22"/></clipPath><rect x="${x-9}" y="${yy}" width="18" height="${bulb+22-yy}" fill="#9cc9d8" clip-path="url(#dlBulbClip)"/>`;}if(liq<bulb-22)g+=`<rect x="${x-2}" y="${liq}" width="4" height="${bulb-22-liq}" fill="#9cc9d8"/>`;}
   g+=`<path d="M${x-3} ${top}V${bulb-20}M${x+3} ${top}V${bulb-20}M${x-3} ${bulb+20}V${tip-6}L${x-1} ${tip}M${x+3} ${bulb+20}V${tip-6}L${x+1} ${tip}" fill="none" stroke="#6f95a4" stroke-width="1.6"/><ellipse cx="${x}" cy="${bulb}" rx="10" ry="23" fill="#eef7fa" fill-opacity=".35" stroke="#6f95a4" stroke-width="1.6"/><path d="M${x-6} ${mark}H${x+6}" stroke="#b67547" stroke-width="2"/>`;
   const k=squeeze*3;g+=`<rect x="${x-4}" y="${top-14}" width="8" height="16" fill="#3b4b53"/><ellipse cx="${x}" cy="${top-36}" rx="${16-k}" ry="${22-k*.5}" fill="#c4443a" stroke="#8c2e27"/><circle cx="${x}" cy="${top-58}" r="5" fill="#8c2e27"/><circle cx="${x+15-k}" cy="${top-30}" r="4" fill="#8c2e27"/><circle cx="${x}" cy="${top-17}" r="4" fill="#8c2e27"/>`;
   return g;
  }
  function beakerArt(x,level,label,conc,narrow){const top=BENCH-122,bottom=BENCH-2,ly=bottom-level*1.05;return `<path d="M${x-62} ${top}V${bottom-12}Q${x-62} ${bottom} ${x-50} ${bottom}H${x+50}Q${x+62} ${bottom} ${x+62} ${bottom-12}V${top}" fill="url(#soGlass)" stroke="#87a7b6" stroke-width="2"/><path d="M${x-60} ${ly}H${x+60}V${bottom-12}Q${x+60} ${bottom-2} ${x+50} ${bottom-2}H${x-50}Q${x-60} ${bottom-2} ${x-60} ${bottom-12}Z" fill="url(#soWater)"/><path d="M${x-68} ${top-3}Q${x-64} ${top-7} ${x-60} ${top-3}" fill="none" stroke="#87a7b6" stroke-width="2"/>`+text(x,BENCH+24,label)+text(x,BENCH+(narrow?54:46),conc);}
  function flaskArt(level,stopper,angle,lift=0){const x=FLASK.x,b=`M${x-10} ${BENCH-180}V${BENCH-100}C${x-10} ${BENCH-88} ${x-56} ${BENCH-78} ${x-56} ${BENCH-38}Q${x-56} ${BENCH-2} ${x-20} ${BENCH-2}H${x+20}Q${x+56} ${BENCH-2} ${x+56} ${BENCH-38}C${x+56} ${BENCH-78} ${x+10} ${BENCH-88} ${x+10} ${BENCH-100}V${BENCH-180}Z`;let g=`<clipPath id="dlFlaskClip"><path d="${b}"/></clipPath><path d="${b}" fill="url(#soGlass)" stroke="#87a7b6" stroke-width="2"/>`;if(level>0){const y=flaskY(level);g+=`<rect x="${x-60}" y="${y}" width="120" height="${BENCH-y}" fill="url(#soWater)" clip-path="url(#dlFlaskClip)"/>`;}g+=`<path d="M${x-14} ${BENCH-148}H${x+14}" stroke="#b67547" stroke-width="2"/>`;if(stopper)g+=`<path d="M${x-12} ${BENCH-196}H${x+12}L${x+9} ${BENCH-176}H${x-9}Z" fill="#4b6674"/>`;return angle||lift?`<g transform="translate(0 ${(-lift).toFixed(1)}) rotate(${angle.toFixed(1)} ${x} ${BENCH-60})">${g}</g>`:g;}
  function bottleArt(sq){const x=560,y=BENCH;return `<g transform="rotate(${(-sq*16).toFixed(1)} ${x} ${y})"><path d="M${x-22} ${y}H${x+22}Q${x+26} ${y-50} ${x+17} ${y-76}H${x-17}Q${x-26} ${y-50} ${x-22} ${y}Z" fill="#eef4f7" stroke="#6f8e9b" stroke-width="2"/><rect x="${x-20}" y="${y-36}" width="40" height="30" fill="#d4e9f2" opacity=".8"/><rect x="${x-9}" y="${y-89}" width="18" height="13" rx="2" fill="#5d87a3"/><path d="M${x} ${y-89}V${y-104}Q${x} ${y-112} ${x-10} ${y-114}L${x-40} ${y-122}" fill="none" stroke="#b8cfd8" stroke-width="5" stroke-linecap="round"/></g>`+text(x+6,y+46,'증류수');}
  function standArt(){return `<rect x="${STAND.x-40}" y="${BENCH-8}" width="80" height="8" rx="2" fill="#6f7f88"/><rect x="${STAND.x+30}" y="150" width="6" height="${BENCH-158}" fill="#9aa9b1"/><rect x="${STAND.x+4}" y="${BENCH-126}" width="30" height="7" rx="2" fill="#7d8c94"/>`;}
  function dlScene(now=performance.now()){const narrow=$('soScene').clientWidth>0&&$('soScene').clientWidth<560;
   const a=s.samples.at(-1),b=s.pending,measuring=!b&&s.portion!==null,shown=measuring?s.samples[s.portion]:a,A=dlAnim,f=A?cl((now-A.start)/A.dur):1;if(A&&f>=1)dlAnim=null;const k=A&&f<1?A.kind:null;
   let lift=0,pip={...STAND},pf=0,sq=0,srcLevel=measuring?30:(shown.remaining??100),fl=b?b.volume:0,stopper=false,angle=0,bottle=0,stream='';
   if(k==='pipette'){const al=A.aliquot;if(f<.22)pip=path3(STAND,BEAKER,f/.22);else if(f<.42){pip={...BEAKER};pf=ease(seg(f,.22,.42));sq=1-pf;}else if(f<.66){pip=path3(BEAKER,FLASK,seg(f,.42,.66));pf=1;}else if(f<.86){pip={...FLASK};pf=1-ease(seg(f,.66,.86));}else pip=path3(FLASK,STAND,seg(f,.86,1));
    srcLevel=a.remaining+al*(1-(f<.22?0:ease(seg(f,.22,.42))));fl=al*(f<.66?0:ease(seg(f,.66,.86)));if(f<.22)sq=ease(f/.22);}
   if(k==='fill'){const g=ease(seg(f,.05,.92));fl=A.from+(100-A.from)*g;bottle=Math.sin(Math.min(1,f/.95)*Math.PI);const th=-16*bottle*Math.PI/180,nx=560+(-40*Math.cos(th)+122*Math.sin(th)),ny=BENCH+(-40*Math.sin(th)-122*Math.cos(th));if(bottle>.2)stream=`<path d="M${nx} ${ny+bottle*6}Q${FLASK.x+20} ${BENCH-226} ${FLASK.x+3} ${BENCH-182}" fill="none" stroke="#7fbdd6" stroke-width="2.4" stroke-dasharray="7 5" stroke-dashoffset="${(-now/16%12).toFixed(1)}" opacity="${bottle.toFixed(2)}"/>`;}
   if(k==='mix'){stopper=true;fl=100;angle=160*(1-Math.cos(4*Math.PI*f))/2;lift=110*Math.sin(Math.PI*f);}
   const showFlask=!!b||k==='mix';if(k==='mix'){srcLevel=A.prevRemaining;}
   let v=`<rect x="0" y="${BENCH}" width="600" height="${(narrow?560:520)-BENCH}" fill="#efe8dc"/><path d="M0 ${BENCH}H600" stroke="#cbbda5" stroke-width="2"/>`;
   const srcSample=k==='mix'?A.prev:shown;v+=beakerArt(BEAKER.x,srcLevel,srcSample.name+(narrow?(measuring&&k!=='mix'?' · 30 mL':''):(measuring&&k!=='mix'?' · 30 mL 덜어 냄':' 용액')),scientific(srcSample.c)+' M',narrow);
   v+=standArt()+(narrow?bottleArt(bottle).replace(/<text[^>]*>증류수<\/text>/,''):bottleArt(bottle))+stream;
   v+=flaskArt(showFlask?fl:0,stopper,angle,lift)+text(FLASK.x,BENCH+24,narrow?(showFlask?'100 mL':'플라스크'):showFlask?'다음 용액 · 100 mL':'빈 부피 플라스크');
   if(measuring&&k!=='mix'){const dipped=s.readings[s.portion]!==undefined,mf=k==='measure'?f:1,ty=dipped?BENCH-18-(1-ease(cl(mf/.4)))*100:BENCH-118,shownP=dipped?(k==='measure'&&mf<1?7+(s.readings[s.portion]-7)*(1-Math.exp(-5*cl((mf-.4)/.6)))*cl((mf-.4)/.6*1.6):s.readings[s.portion]):null;
    v+=`<rect x="0" y="${BENCH-8}" width="46" height="8" rx="2" fill="#6f7f88"/><rect x="18" y="${BENCH-246}" width="6" height="238" fill="#9aa9b1"/><rect x="18" y="${ty-102}" width="${BEAKER.x-18}" height="7" rx="2" fill="#9aa9b1"/><rect x="${BEAKER.x-9}" y="${ty-106}" width="18" height="15" rx="3" fill="#55666f"/><rect x="${BEAKER.x-5}" y="${ty-110}" width="10" height="26" rx="2" fill="#34464f"/><path d="M${BEAKER.x-5} ${ty-84}H${BEAKER.x+5}V${ty-14}L${BEAKER.x+3} ${ty-6}H${BEAKER.x-3}L${BEAKER.x-5} ${ty-14}Z" fill="#e4eff3" stroke="#6f8e9b" stroke-width="1.3"/><circle cx="${BEAKER.x}" cy="${ty-4}" r="5" fill="#eaf5f9" stroke="#6f8e9b" stroke-width="1.3"/>`;
    v+=`<path d="M${BEAKER.x} ${ty-110}C${BEAKER.x} ${ty-150} 230 ${BENCH-150} 236 ${BENCH-84}" fill="none" stroke="#33454f" stroke-width="2.5"/><rect x="200" y="${BENCH-84}" width="76" height="82" rx="8" fill="#f4f7f8" stroke="#6b8794" stroke-width="2"/><rect x="208" y="${BENCH-76}" width="60" height="30" rx="3" fill="#d5e6d2" stroke="#7f9a80"/>`+`<text x="262" y="${BENCH-55}" text-anchor="end" style="font-size:16px;fill:#22382a;font-family:Consolas,monospace">${shownP===null?'--.--':shownP.toFixed(2)}</text>`+text(238,BENCH-20,'pH');}
   v+=pipetteArt(pip.x,pip.tip,pf,sq);
   const Y0=BENCH+(narrow?76:62);v+=`<rect x="30" y="${Y0+34}" width="${s.samples.length*56+24}" height="10" rx="3" fill="#b99a6e" stroke="#8e7350"/>`;s.samples.forEach((r,i)=>{const x=54+i*56;v+=`<path d="M${x-13} ${Y0+6}V${Y0+36}H${x+13}V${Y0+6}" fill="${i===s.selected?'#b9dce5':'#e9f1f4'}" stroke="#81a1ae"/><rect x="${x-14}" y="${Y0}" width="28" height="8" rx="2" fill="#7d8c94"/>`+`<text x="${x}" y="${Y0+28}" text-anchor="middle" style="font-size:15px">${r.name}</text>`;});
   scene(v,narrow?560:520);
  }
  render=()=>{steps([['세 점 교정',s.buffer686&&s.buffer4&&s.buffer918],['용액 '+s.samples.length+'개',s.samples.length>1],['pH '+Object.keys(s.readings).length+'개 측정',!!Object.keys(s.readings).length]]);const a=s.samples.at(-1);dlScene();
   $('dlSample').innerHTML=s.samples.map((r,i)=>`<option value="${i}">${r.name} · ${scientific(r.c)} M</option>`).join('');$('dlSample').value=s.selected;
   $('dlData').innerHTML=table('측정한 용액',['용액','몰농도 (M)','pH'],s.samples.map((r,i)=>[r.name,scientific(r.c),s.readings[i]===undefined?'—':fmt(s.readings[i],3)]));graph();font();
   setDisabled('dlPipette',!!s.pending||s.samples.length>=9||a.remaining<s.aliquot);setDisabled('dlFill',!s.pending||s.pending.filled);setDisabled('dlMix',!s.pending?.filled);setDisabled('dlAliquot',!!s.pending);setDisabled('dlBuffer686',s.buffer686);setDisabled('dlBuffer4',!s.buffer686||s.buffer4);setDisabled('dlBuffer918',!s.buffer4||s.buffer918);setDisabled('dlPortion',s.portion===s.selected||s.samples[s.selected].remaining<30);setDisabled('dlMeasure',s.portion!==s.selected);
  };
  reset=()=>{dlAnim=null;s=model.create();$('dlKind').value='acid';$('dlAliquot').value='10';$('dlMeter').textContent='pH —';say('A는 0.1 M 염산입니다. A에서 피펫으로 일정량을 취해 다음 용액을 만드세요.');render();};
  on('dlKind',()=>{dlAnim=null;const kind=$('dlKind').value;s=model.create();s.kind=kind;$('dlAliquot').value='10';$('dlMeter').textContent='pH —';say('새 0.1 M '+(kind==='acid'?'염산':'NaOH 용액')+'으로 시작합니다. 기기를 교정하고 농도별 pH를 비교하세요.');render();},'change');
  on('dlAliquot',()=>{s.aliquot=Number($('dlAliquot').value);},'change');
  on('dlPipette',()=>{if(model.pipette(s))play('pipette',3800,{aliquot:s.aliquot});say('앞 용액 '+s.aliquot+' mL를 취했습니다. 물 100 mL를 더하는 것이 아니라 용액 전체를 100 mL에 맞추세요.');render();});
  on('dlFill',()=>{const from=s.pending?.volume;if(model.fill(s))play('fill',2400,{from});say('용액 전체가 100 mL입니다. 마개를 닫고 고르게 섞으세요.');render();});
  on('dlMix',()=>{const prev=s.samples.at(-1),prevRemaining=prev.remaining;if(model.mix(s))play('mix',1900,{prev:{...prev},prevRemaining});say('새 용액 '+s.samples.at(-1).name+'을 만들었습니다. pH를 측정하거나 이 용액에서 다음 희석을 진행하세요.');render();});
  for(const [n,label] of [[686,'6.86'],[4,'4.00'],[918,'9.18']])on('dlBuffer'+n,()=>{if(!s.clean)return say('다른 완충액에 담그기 전에 전극을 증류수로 씻으세요.');s['buffer'+n]=true;s.clean=false;say('pH '+label+' 완충액의 교정을 마쳤습니다. 전극을 씻은 뒤 다음 용액을 사용하세요.');render();});
  on('dlRinse',()=>{s.clean=true;say('전극을 증류수로 씻었습니다. 새 시료를 측정할 수 있습니다.');});
  on('dlSample',()=>{s.selected=Number($('dlSample').value);s.portion=null;$('dlMeter').textContent='pH —';render();},'change');
  on('dlPortion',()=>{model.sample(s);say(s.samples[s.selected].name+' 용액 30 mL를 새 비커에 덜었습니다. 교정과 전극 세척을 확인하고 측정하세요.');render();});
  on('dlMeasure',()=>{const p=model.measure(s);if(p===null){say(!s.buffer686||!s.buffer4||!s.buffer918?'pH 6.86, 4.00, 9.18 완충액으로 교정을 마치세요.':'이전 용액이 남지 않도록 전극을 먼저 씻으세요.');return;}$('dlMeter').textContent='pH '+fmt(p,3);play('measure',1700);say('측정값을 농도와 함께 표시했습니다. 그래프에서 산과 염기의 희석 방향을 비교하세요.');render();});
 }
 if(slug==='vinegar-titration'){
  model=M.vinegar;
  const colorText={clear:'섞은 용액은 무색입니다.',local:'떨어진 곳에만 분홍색이 보입니다. 먼저 고르게 섞으세요.',faint:'섞은 뒤에도 옅은 분홍색이 남았습니다.',strong:'섞은 뒤 진한 분홍색입니다. 종말점을 지나쳤습니다.'};
  const viFlask='M150 345V372L105 428Q98 441 113 444H224Q239 441 232 428L187 372V345Z',colorFill=p=>p==='faint'?'#efb8d1':p==='strong'?'#d64a97':'url(#soWater)';
  function viScene(now=performance.now()){
   const A=soFrame(now),k=A?A.kind:null,f=A?A.f:1,p=model.color(s);
   let read=model.reading(s),sample=s.prepared?model.sampleVolume(s):0,delivered=s.delivered,tipOpen=false,drops='',fillTop=null,spot=p==='local'?1:0,mixK=1,swirl=0,extra='';
   if(A&&A.fromRead!==undefined){const g=soEase(soSeg(f,.1,.9));read=A.fromRead+(read-A.fromRead)*g;delivered=A.fromDel+(s.delivered-A.fromDel)*g;}
   const level=440-(sample+delivered)*.8;
   if(k==='prepare'){sample=model.sampleVolume(s)*soEase(soSeg(f,.2,.85));}
   const lv=440-(sample+delivered)*.8,y=70+read*4.2;
   if(k==='add'){tipOpen=f<.9;const n=A.drops;for(let i=0;i<n;i++){const t0=.08+i*(.72/n),q=(f-t0)/.16;if(q>0&&q<1)drops+=`<path d="M168 ${(332+q*q*(lv-334)).toFixed(1)}c-3 5-3 8 0 8s3-3 0-8Z" fill="#cfe6ef" stroke="#7ea6b6" stroke-width=".8"/>`;}
    if(s.indicator)spot=soSeg(f,.25,.95);}
   if(k==='mix'){swirl=9*Math.sin(f*Math.PI*5)*(1-f);mixK=soEase(soSeg(f,.15,.9));spot=A.fromLocal?1-mixK:0;}
   if(k==='fill')fillTop=287-(287-y)*soEase(soSeg(f,.15,.9));
   if(k==='tip'){tipOpen=f>.15&&f<.75;for(let i=0;i<4;i++){const q=(f-.2-i*.12)/.2;if(q>0&&q<1)drops+=`<path d="M168 ${(332+q*q*30).toFixed(1)}c-3 5-3 8 0 8s3-3 0-8Z" fill="#cfe6ef" stroke="#7ea6b6" stroke-width=".8"/>`;}}
   let b='<rect x="0" y="457" width="600" height="43" fill="#efe8dc"/><path d="M0 457H600" stroke="#cbbda5" stroke-width="2"/>';
   // stand, clamp and burette
   b+='<rect x="22" y="444" width="140" height="13" rx="4" fill="#8fa2ab" stroke="#6f838d"/><rect x="48" y="40" width="8" height="406" rx="3" fill="url(#soMetal)" stroke="#6f838d" stroke-width="1"/>';
   const top=fillTop!==null?fillTop:y,bur=s.filled||k==='fill';
   b+='<path d="M157 64V288Q168 300 179 288V64" fill="url(#soGlass)" stroke="#88a9b7" stroke-width="2"/>'+text(232,40,'NaOH 0.100 M','start');
   if(bur)b+=`<path d="M160 ${top}Q168 ${top+3} 176 ${top}V287Q168 295 160 287Z" fill="url(#soWater)"/><path d="M159 ${(top-1).toFixed(1)}Q168 ${(top+4).toFixed(1)} 177 ${(top-1).toFixed(1)}" fill="none" stroke="#3f7d91" stroke-width="1.6"/>`;
   for(let n=0;n<=50;n+=5){const yy=70+n*4.2;b+=`<path d="M180 ${yy}h${n%10?5:11}" stroke="#73919f"/>`;if(n%10===0)b+=text(207,yy+5,n);}
   b+='<rect x="52" y="146" width="102" height="9" rx="3" fill="#8fa2ab" stroke="#6f838d"/><rect x="44" y="141" width="16" height="19" rx="3" fill="#55666f"/><rect x="150" y="138" width="10" height="24" rx="3" fill="#55666f"/><rect x="176" y="138" width="10" height="24" rx="3" fill="#55666f"/><path d="M160 140H176M160 160H176" stroke="#55666f" stroke-width="3"/>';
   b+=`<path d="M168 299V330" stroke="#7296a7" stroke-width="4"/><rect x="146" y="296" width="44" height="9" rx="3" fill="#dfe8ec" stroke="#627f8e"/><rect x="${tipOpen?163:142}" y="${tipOpen?286:297}" width="${tipOpen?10:52}" height="${tipOpen?28:7}" rx="3" fill="#627f8e"/>`;
   if(bur&&!s.tip&&k!=='fill')b+='<circle cx="168" cy="316" r="3" fill="white" stroke="#7496a6"/>';
   if(k==='fill')b+=`<path d="M146 22H190L172 46V62H164V46Z" fill="url(#soGlass)" stroke="#88a9b7" stroke-width="1.6"/>`+(f<.9?flowPath('M168 30V62',now)+flowPath(`M168 64V${top.toFixed(1)}`,now,2):'');
   // flask with sample
   let fl=`<defs><clipPath id="viFlask"><path d="${viFlask}"/></clipPath></defs><path d="${viFlask}" fill="url(#soGlass)" stroke="#88a9b7" stroke-width="2"/>`;
   if(sample>0){const finalFill=colorFill(p==='local'?'clear':p);fl+=`<path d="M98 ${lv.toFixed(1)}Q165 ${(lv+4).toFixed(1)} 238 ${lv.toFixed(1)}V445H98Z" fill="url(#soWater)" opacity=".85" clip-path="url(#viFlask)"/>`;
    if(p==='faint'||p==='strong')fl+=`<path d="M98 ${lv.toFixed(1)}Q165 ${(lv+4).toFixed(1)} 238 ${lv.toFixed(1)}V445H98Z" fill="${finalFill}" opacity="${(.85*mixK).toFixed(2)}" clip-path="url(#viFlask)"/>`;
    if(spot>0)fl+=`<ellipse cx="168" cy="${(lv+6).toFixed(1)}" rx="${(4+10*spot).toFixed(1)}" ry="${(3+6*spot).toFixed(1)}" fill="#d75c9a" opacity="${(.8*Math.min(1,spot*1.5)).toFixed(2)}" clip-path="url(#viFlask)"/>`;}
   b+=swirl?`<g transform="rotate(${swirl.toFixed(1)} 168 444)">${fl}</g>`:fl;
   b+=drops;
   if(k==='prepare'){const lift=40*(1-soEase(soSeg(f,0,.15)));b+=`<g transform="translate(0 ${(-lift).toFixed(1)}) rotate(24 182 352)"><path d="M182 352V200" stroke="#6f95a4" stroke-width="5" stroke-linecap="round"/><path d="M182 350V200" stroke="#eef7fa" stroke-width="2.5"/><ellipse cx="182" cy="262" rx="9" ry="22" fill="#eef7fa" stroke="#6f95a4" stroke-width="1.6"/><path d="M174 214H190" stroke="#b67547" stroke-width="2"/><ellipse cx="182" cy="182" rx="13" ry="18" fill="#c4443a" stroke="#8c2e27"/></g>`+(f>.2&&f<.85?flowPath(`M182 352V${lv.toFixed(1)}`,now,2):'');}
   if(k==='indicator'){b+=`<ellipse cx="200" cy="300" rx="10" ry="14" fill="#9a6fb0"/><path d="M195 312H205V336L201 346H199L195 336Z" fill="#eef6f9" stroke="#7b9aa6" stroke-width="1.2"/>`;for(let i=0;i<2;i++){const q=(f-.2-i*.3)/.25;if(q>0&&q<1)b+=`<path d="M200 ${(348+q*q*(lv-350)).toFixed(1)}c-3 5-3 8 0 8s3-3 0-8Z" fill="#f2f2f5" stroke="#8a8aa0" stroke-width=".8"/>`;}}
   // magnified scale near the meniscus
   const start=Math.floor(read),zy=140+(read-start)*200;
   b+=`<path d="M179 ${y.toFixed(1)}L330 112M179 ${y.toFixed(1)}L330 368" stroke="#b9d0d9" stroke-dasharray="5 5"/><rect x="330" y="100" width="230" height="280" rx="12" fill="#f5fafb" stroke="#b9d0d9"/>`+text(445,88,'눈금 확대');
   b+='<path d="M366 104V376M454 104V376" stroke="#88a9b7" stroke-width="2.4"/>';
   if(bur&&(k!=='fill'||f>.85))b+=`<path d="M368 ${(zy-9).toFixed(1)}Q410 ${(zy+7).toFixed(1)} 452 ${(zy-9).toFixed(1)}V376H368Z" fill="url(#soWater)"/><path d="M368 ${(zy-9).toFixed(1)}Q410 ${(zy+7).toFixed(1)} 452 ${(zy-9).toFixed(1)}" fill="none" stroke="#2f6f86" stroke-width="2.4"/>`;
   for(let n=0;n<=10;n++){const yy=140+n*20;b+=`<path d="M454 ${yy}h${n%5?10:18}" stroke="#4f7182" stroke-width="1.4"/>`;if(n%5===0)b+=text(480,yy+5,fmt(start+n/10,2),'start');}
   b+=text(445,404,'뷰렛 눈금 (mL)')+text(170,486,s.prepared||k==='prepare'?(s.protocol==='direct'?'원액 3 mL 전량':'원액 2 mL에 해당'):'빈 삼각 플라스크');
   scene(b,500);
  }
  soPaint=viScene;
  render=()=>{steps([['시료',s.prepared&&s.indicator],['뷰렛 끝 충전',s.tip],['처음 눈금',s.initial!==null],['적정 '+s.trials.length+'/3',s.trials.length===3]]);const p=model.color(s);viScene();
   $('viColor').textContent=s.prepared?colorText[p]:'시료와 뷰렛을 준비하세요.';$('viTrials').innerHTML=table('세 차례의 사용량',['회','처음 (mL)','나중 (mL)','사용량 (mL)'],s.trials.map((r,i)=>[i+1,fmt(r.initial),fmt(r.final),fmt(r.used)]));
   setDisabled('viProtocol',s.prepared||s.trials.length>0);setDisabled('viPrepare',s.prepared);setDisabled('viIndicator',!s.prepared||s.indicator);setDisabled('viFill',s.filled);setDisabled('viTip',!s.filled||s.tip);setDisabled('viMark',!s.tip||s.initial!==null);setDisabled('viInitial',s.initial!==null);for(const id of ['viAdd1','viDrop','viMix'])setDisabled(id,!s.prepared||!s.indicator||s.initial===null||s.recorded||s.delivered>=48);setDisabled('viRecord',s.initial===null||s.recorded);setDisabled('viNext',!s.recorded||s.trials.length>=3);setDisabled('viRetry',s.recorded||!s.prepared);setDisabled('viCalculate',s.trials.length!==3);
  };
  reset=()=>{soAnim=null;s=model.create();$('viProtocol').value='direct';for(const id of ['viInitial','viFinal','viMolarity','viMass'])$(id).value=0;$('viResult').textContent='세 번의 사용량 평균으로 계산하세요. 아세트산 몰질량은 60.0 g/mol입니다.';say('시료 조제 방법을 정하세요. 증류수로 묽혀도 전량을 적정하면 아세트산의 양은 같습니다.');render();};
  on('viProtocol',()=>{s.protocol=$('viProtocol').value;render();},'change');
  on('viPrepare',()=>{s.prepared=true;soPlay('prepare',1600);say(s.protocol==='direct'?'원액 3 mL를 약 30 mL로 묽혀 전량 준비했습니다.':'원액 10 mL를 100 mL로 묽힌 뒤 20 mL를 취했습니다. 원액 2 mL에 해당합니다.');render();});
  on('viIndicator',()=>{s.indicator=true;soPlay('indicator',1000);say('페놀프탈레인 2방울을 넣었습니다. 원래 시료는 무색입니다.');render();});
  on('viFill',()=>{s.filled=true;soPlay('fill',1500);say('뷰렛에 표준 용액을 채웠습니다. 꼭지 아래에도 용액을 채운 뒤 처음 눈금을 읽으세요.');render();});
  on('viTip',()=>{s.tip=true;soPlay('tip',1200);say('끝의 공기를 빼고 흘린 용액은 따로 버렸습니다. 확대 눈금의 수면 아래쪽을 읽으세요.');render();});
  on('viMark',()=>{const n=Number($('viInitial').value);if(Math.abs(n-model.reading(s))>.025)return say('처음 눈금이 확대 수면 위치와 맞지 않습니다. 0이 아닌 시작 눈금을 다시 읽으세요.');s.initial=n;say('처음 눈금을 표시했습니다. 시료에 표준 용액을 넣고 고르게 섞어 색을 확인하세요.');render();});
  for(const[id,v]of[['viAdd1',1],['viDrop',.05]])on(id,()=>{const fromRead=model.reading(s),fromDel=s.delivered;if(model.add(s,v))soPlay('add',v>=1?1300:800,{fromRead,fromDel,drops:v>=1?6:1});say('표준 용액을 넣었습니다. 방울 주변의 색만 보고 멈추지 말고 플라스크를 흔들어 섞으세요.');render();});
  on('viMix',()=>{const fromLocal=model.color(s)==='local';s.mixed=true;soPlay('mix',1400,{fromLocal});render();say(colorText[model.color(s)]);});
  on('viRecord',()=>{if(s.trials.length>=3)return;const n=Number($('viFinal').value);if(!model.record(s,n))return say(!s.mixed?'먼저 고르게 섞어 전체 시료의 색을 확인하세요.':model.color(s)==='strong'?'종말점을 지나친 시료입니다. 이번 시료를 다시 준비하고 끝에서는 한 방울씩 넣으세요.':model.color(s)!=='faint'?'섞은 뒤 옅은 분홍색이 남는 지점을 먼저 찾으세요.':'나중 눈금이 수면 위치와 맞지 않습니다. 확대 눈금을 다시 읽으세요.');s.recorded=true;say(s.trials.length===3?'세 차례의 사용량이 모였습니다. 평균 부피에서 원액의 농도를 계산하세요.':'이번 눈금을 사용했습니다. 새 시료로 다음 적정을 준비하세요.');render();});
  on('viNext',()=>{const {trials,protocol}=s;s=model.create();Object.assign(s,{trials,protocol});$('viInitial').value=0;$('viFinal').value=0;say('새 시료와 뷰렛으로 다음 적정을 준비하세요. 같은 조제법을 사용합니다.');render();});
  on('viRetry',()=>{const {trials,protocol}=s;s=model.create();Object.assign(s,{trials,protocol});$('viInitial').value=0;$('viFinal').value=0;say('이번 시료만 다시 준비합니다. 앞서 사용한 적정값은 유지됩니다.');render();});
  on('viCalculate',()=>{const c=model.concentration(s),g=c*6,mc=Number($('viMolarity').value),mg=Number($('viMass').value);$('viResult').textContent=Math.abs(mc-c)<.003&&Math.abs(mg-g)<.02?`원액 ${fmt(c,3)} M, 100 mL 속 아세트산 ${fmt(g)} g입니다. 사용량의 평균과 원액에 해당하는 시료 부피를 함께 적용했습니다.`:Math.abs(mc-c)>=.003?'NaOH 사용량은 나중−처음 눈금의 차입니다. 세 번의 평균과 원액에 해당하는 3 mL 또는 2 mL를 이용해 다시 계산하세요.':'100 mL는 0.100 L입니다. 원액 몰농도 × 0.100 L × 60.0 g/mol로 질량을 구하세요.';});
 }
 if(!model)return;on('soReset',()=>reset());reset();new ResizeObserver(font).observe(host);window.__solutionPractice={getState:()=>JSON.parse(JSON.stringify(s)),slug};
})();
