(function(){
 'use strict';const root=document.querySelector('[data-chemistry]');if(!root)return;
 const slug=root.dataset.chemistry,M=window.scienceChemistry,$=id=>document.getElementById(id),scene=$('chemistryScene'),actions=$('chemistryActions'),readout=$('chemistryReadout'),status=$('chemistryStatus');
 let state={},timer=0,running=false;
 const defaults={'gas-identification':{sample:'A',head:10,before:false,collected:false,after:false,read:false},'sugar-phase':{molality:.2,mode:'heat',prepared:false,time:0},'hess-calorimetry':{step:0,direct:false},'buffer-solution':{acid:0,base:0,clean:true,well:null,measured:{}},'salt-hydrolysis':{concentration:.1,clean:true,well:null,measured:{}},'bean-respiration':{mode:'sensors',time:0,started:false}};
 const text=(x,y,s,size=18,color='#143541')=>`<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle" fill="${color}">${s}</text>`;
 const rect=(x,y,w,h,fill,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
 const line=(x1,y1,x2,y2,color='#527e8e',w=3)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${w}"/>`;
 const path=(d,color='#527e8e',w=3,extra='')=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" ${extra}/>`;
 const metric=(label,value)=>`<div><span>${label}</span><strong>${value}</strong></div>`;
 function svg(body,label,h=340,w=640){window.scienceScene.render(scene,`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">${body}</svg>`);}
 function note(s){if(status.textContent!==s)status.textContent=s;}
 function stop(){cancelAnimationFrame(timer);timer=0;running=false;}
 function run(step,max,dt=100){if(running){stop();draw();return;}running=true;let last=0;function frame(now){if(!running)return;if(last)state.time=Math.min(max,state.time+Math.min(now-last,80)*step/dt);last=now;if(state.time>=max)stop();draw();if(running)timer=requestAnimationFrame(frame);}timer=requestAnimationFrame(frame);}
 function beaker(x,y,label,liquid='#afd5e5',level=85,labelOffset=160){
  let b=`<ellipse cx="${x}" cy="${y+133}" rx="72" ry="7" fill="#537a8a" opacity=".1"/><path d="M${x-65} ${y}V${y+120}Q${x-65} ${y+130} ${x-55} ${y+130}H${x+55}Q${x+65} ${y+130} ${x+65} ${y+120}V${y}" fill="#edf6f8" fill-opacity=".4" stroke="#8baebb" stroke-width="2.5"/>`;
  b+=rect(x-62,y+120-level,124,level,liquid,'opacity=".75"')+`<ellipse cx="${x}" cy="${y+120-level}" rx="62" ry="5" fill="${liquid}" stroke="#80aeba" stroke-width="1"/><path d="M${x-54} ${y+12}V${y+116}" stroke="#fff" stroke-width="4" opacity=".65"/><path d="M${x+57} ${y+8}V${y+113}" stroke="#779daa" opacity=".35" stroke-width="2"/><ellipse cx="${x}" cy="${y}" rx="65" ry="6" fill="none" stroke="#8baebb" stroke-width="2"/>`;
  for(let i=0;i<4;i++)b+=line(x+36,y+28+i*22,x+50,y+28+i*22,'#6c94a3',1.2);
  return b+text(x,y+labelOffset,label);
 }
 function thermometer(x,y,t){const h=Math.max(3,Math.min(89,(t+5)/115*89));return rect(x-5,y,10,100,'#eef4f6','rx="5" stroke="#628392"')+rect(x-3,y+97-h,6,h,'#c45348')+`<circle cx="${x}" cy="${y+100}" r="9" fill="#c45348"/>`;}
 // Shared motion layer: the model changes at once, the picture replays the step.
 const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),seg=(f,a,b)=>clamp((f-a)/(b-a));
 let fx=null,fxRaf=0;
 function play(kind,dur,extra={}){if(reduceMotion()){fx=null;return;}fx={kind,dur,start:performance.now(),...extra};if(!fxRaf){const tick=()=>{fxRaf=0;draw();if(fx)fxRaf=requestAnimationFrame(tick);};fxRaf=requestAnimationFrame(tick);}}
 function fxNow(){if(!fx)return null;const f=(performance.now()-fx.start)/fx.dur;if(f>=1){fx=null;return null;}return {...fx,f};}
 function rnd(i){const s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s);}
 // Glass thermometer with its own reading range, so small changes move the column visibly.
 function thermo(x,top,bulb,t,lo,hi,yLo,yHi,ticks=[],labelSide=1){
  const yy=v=>yLo-clamp((v-lo)/(hi-lo))*(yLo-yHi),y=yy(t);
  let s=rect(x-5,top,10,bulb-top,'#f6fafb','rx="5" stroke="#6f8e9b" stroke-width="1.4"')+rect(x-2,y,4,bulb-y,'#c45348')+`<circle cx="${x}" cy="${bulb}" r="7" fill="#c45348" stroke="#9c3a31" stroke-width="1"/>`;
  for(let v=lo;v<=hi+1e-9;v+=(hi-lo)/10)s+=line(x-5,yy(v),x-1,yy(v),'#6a8592',1);
  for(const v of ticks)s+=line(x-5,yy(v),x+2,yy(v),'#46616d',1.4)+`<text x="${x+labelSide*10}" y="${yy(v)+5}" font-size="14" text-anchor="${labelSide>0?'start':'end'}" fill="#3d5662">${v}</text>`;
  return s;
 }
 function glassBeaker(x,top,bottom,w,levelY,liquid='#bcdde9'){
  const L=x-w/2,R=x+w/2;let s=`<path d="M${L} ${top}V${bottom-10}Q${L} ${bottom} ${L+10} ${bottom}H${R-10}Q${R} ${bottom} ${R} ${bottom-10}V${top}" fill="#f3f9fb" fill-opacity=".6" stroke="#86a9b7" stroke-width="2.4"/>`;
  if(levelY<bottom-2)s+=`<path d="M${L+2} ${levelY}H${R-2}V${bottom-10}Q${R-2} ${bottom-2} ${R-10} ${bottom-2}H${L+10}Q${L+2} ${bottom-2} ${L+2} ${bottom-10}Z" fill="${liquid}" opacity=".85"/><path d="M${L+2} ${levelY}H${R-2}" stroke="#6fa3b6" stroke-width="1.4"/>`;
  s+=`<path d="M${L-6} ${top-1}Q${L-3} ${top-5} ${L+2} ${top-1}" fill="none" stroke="#86a9b7" stroke-width="2"/><path d="M${L+8} ${top+10}V${bottom-12}" stroke="#fff" stroke-width="4" opacity=".7"/>`;
  for(let i=0;i<4;i++)s+=line(R-18,top+20+i*18,R-6,top+20+i*18,'#7d9ca8',1.2);
  return s;
 }
 // ---------- gas identification ----------
 const GS={surface:190,tl:290,tr:560,ttop:150,tbot:318,cx:430,cw:64,len:230,k:.44,scaleX:112,pan:279,benchX:224,bench:320,tip:278,rod:604};
 function canisterArt(cx,b,label,open){
  return `<path d="M${cx-26} ${b-4}V${b-98}Q${cx-26} ${b-116} ${cx-8} ${b-118}H${cx+8}Q${cx+26} ${b-116} ${cx+26} ${b-98}V${b-4}Q${cx+26} ${b} ${cx+22} ${b}H${cx-22}Q${cx-26} ${b} ${cx-26} ${b-4}Z" fill="url(#gasCan)" stroke="#5f7d8a" stroke-width="1.6"/>`
   +rect(cx-26,b-84,52,38,'#f4f7f8','stroke="#9fb3bc" stroke-width="1"')+text(cx,b-58,label,18,'#24414c')+rect(cx-26,b-10,52,4,'#7d96a1','opacity=".6"')
   +rect(cx-7,b-128,14,11,'#7b8f99','rx="2"')+rect(cx-12,b-137,24,10,'#4f6470','rx="3"')+rect(cx+11,b-135,13,5,'#4f6470','rx="1.5"')
   +`<path d="M${cx-6} ${b-137}l${open?-15:-4} ${open?-4:-13}" stroke="#c4553f" stroke-width="4" stroke-linecap="round"/>`;
 }
 function balanceArt(x,reading){
  return rect(x-80,286,160,34,'#e2e9ec','rx="7" stroke="#8aa2ad" stroke-width="1.6"')+rect(x-64,279,128,8,'#bccbd2','rx="2" stroke="#8aa2ad" stroke-width="1"')+rect(x-56,292,112,22,'#d5ecdc','rx="3" stroke="#86a796" stroke-width="1.2"')
   +`<text x="${x+50}" y="308" font-size="15" text-anchor="end" fill="#1f3d2c" font-family="Consolas,monospace">${reading}</text>`;
 }
 function drawGas(){
  const F=fxNow(),now=performance.now(),g=GS,r=M.gas(state.sample,state.head);
  const onScale=st=>st.before&&!(st.collected&&!st.after),at=on=>on?{x:g.scaleX,b:g.pan}:{x:g.benchX,b:g.bench};
  let pos=at(onScale(state)),connected=state.collected&&!state.after,collectF=state.collected?1:0,flow=false,settled=true;
  if(F&&F.kind==='gasMove'){const t=ease(seg(F.f,0,F.moveEnd)),a=at(F.from),c=at(F.to);pos={x:a.x+(c.x-a.x)*t,b:a.b+(c.b-a.b)*t-Math.sin(Math.PI*t)*44};connected=false;settled=t>=1;
   if(F.collect){collectF=0;if(F.f>F.moveEnd){connected=true;collectF=ease(seg(F.f,F.moveEnd+.06,.97));flow=collectF<1;}}}
  const head=F&&F.kind==='head'?F.from*(1-ease(F.f)):state.head,vol=M.gas(state.sample,head).volume*1000,inside=g.surface-head*3,top=inside-vol*g.k,bottom=top+g.len;
  const waterTop=top+5+(inside-(top+5))*collectF,cx=g.cx,L=cx-g.cw/2,R=cx+g.cw/2;
  let b='<defs><linearGradient id="gasCan"><stop stop-color="#8aa3ae"/><stop offset=".45" stop-color="#e3ecef"/><stop offset="1" stop-color="#93aab4"/></linearGradient></defs>';
  b+=rect(0,g.bench,640,40,'#efe8dc')+line(0,g.bench,640,g.bench,'#cbbda5',2);
  // stand and clamp holding the inverted cylinder
  b+=rect(g.rod-26,g.bench-8,52,8,'#6f7f88','rx="2"')+rect(g.rod-3,18,6,g.bench-26,'#9aa9b1','rx="2" stroke="#66767f" stroke-width="1"');
  // trough water and walls
  b+=rect(g.tl+2,g.surface,g.tr-g.tl-4,g.tbot-g.surface-2,'#a9d3e4','opacity=".8"')+line(g.tl+2,g.surface,g.tr-2,g.surface,'#5f9ab1',1.6);
  b+=`<path d="M${g.tl} ${g.ttop}V${g.tbot}H${g.tr}V${g.ttop}" fill="#eef6f9" fill-opacity=".25" stroke="#7fa3b2" stroke-width="3"/>`;
  // cylinder: gas above, water below
  b+=rect(L+3,top+5,g.cw-6,Math.max(0,waterTop-top-5),'#f7fbfc')+rect(L+3,waterTop,g.cw-6,Math.max(0,bottom-waterTop),'#b5dcec')+line(L+3,waterTop,R-3,waterTop,'#2f7591',2);
  b+=`<path d="M${L} ${bottom}V${top+10}Q${L} ${top} ${L+10} ${top}H${R-10}Q${R} ${top} ${R} ${top+10}V${bottom}" fill="none" stroke="#5c8596" stroke-width="2.6"/>`+rect(cx-40,top-8,80,8,'#c7d6dc','rx="2" stroke="#7d9aa6" stroke-width="1"');
  for(let ml=50;ml*g.k<g.len-24;ml+=50){const y=top+5+ml*g.k;b+=line(L+3,y,L+(ml%100?11:18),y,'#3f6576',1.3);if(ml%100===0&&ml<=400)b+=`<text x="${L-8}" y="${y+5}" font-size="14" text-anchor="end" fill="#33515d">${ml}</text>`;}
  b+=`<path d="M${g.tl+4} ${g.surface}H${g.tr-4}" stroke="#2f7591" stroke-width="1.2" stroke-dasharray="5 4" opacity=".7"/>`;
  b+=rect(R,top+44,g.rod-R,7,'#9aa9b1','rx="2" stroke="#66767f" stroke-width="1"')+rect(R-4,top+38,12,19,'#55666f','rx="3"')+rect(g.rod-8,top+40,16,15,'#55666f','rx="3"');
  if(collectF>.15&&waterTop-top>40)b+=text(cx,top+5+(waterTop-top-5)/2+5,'기체',15,'#24414c');
  // delivery tube
  const wallUp=`V${g.ttop-12}Q${g.tl-6} ${g.ttop-26} ${g.tl+8} ${g.ttop-26}Q${g.tl+22} ${g.ttop-26} ${g.tl+22} ${g.ttop-12}V${g.tbot-16}Q${g.tl+22} ${g.tbot-6} ${g.tl+34} ${g.tbot-6}H${cx-12}Q${cx} ${g.tbot-6} ${cx} ${g.tbot-18}V${g.tip}`;
  const ox=pos.x+24,oy=pos.b-132.5,tube=connected?`M${ox} ${oy}H${g.tl-18}Q${g.tl-6} ${oy} ${g.tl-6} ${oy-12}${wallUp}`:`M${g.tl-6} ${g.ttop+44}${wallUp}`;
  b+=`<path d="${tube}" fill="none" stroke="#6d7f88" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/><path d="${tube}" fill="none" stroke="#c9d4d9" stroke-width="2" stroke-linejoin="round" opacity=".8"/>`;
  if(flow){for(let i=0;i<8;i++){const q=(now/900+i/8)%1,y=g.tip-q*(g.tip-waterTop-4);if(y<g.tip-2)b+=`<circle cx="${(cx+Math.sin(now/180+i*2)*7).toFixed(1)}" cy="${y.toFixed(1)}" r="${2.5+i%3}" fill="#f4fbfd" stroke="#4f8ea6" stroke-width="1.2"/>`;}}
  // balance and canister
  const reading=pos.x===g.scaleX&&pos.b===g.pan&&settled?(state.after?r.after:150).toFixed(3)+' g':'0.000 g';
  b+=balanceArt(g.scaleX,reading)+canisterArt(pos.x,pos.b,state.sample,flow||connected&&collectF<1);
  b+=text(g.scaleX,g.bench+27,'전자저울',15)+text((g.tl+g.tr)/2,g.bench+27,'수조에 거꾸로 세운 눈금실린더',15);
  svg(b,'전자저울과 기체통, 관을 따라 수조 속 거꾸로 세운 눈금실린더에 모이는 기체',360);
  const busy=!!(F&&F.kind==='gasMove');
  window.scienceScene.render(readout,metric('기체 질량',state.after&&!busy?r.mass.toFixed(3)+' g':'전후 질량 필요')+metric('모은 기체 부피',state.read?(r.volume*1000).toFixed(1)+' mL':'아직 읽지 않음')+metric('건조 기체 압력',state.read?r.pressure.toFixed(2)+' kPa':'수면·수증기 확인')+(state.read&&state.after?metric('계산한 몰 질량',r.molar.toFixed(1)+' g/mol'):''));
  $('collectGas').disabled=!state.before||state.collected;$('weighAfter').disabled=!state.collected||state.after;$('equalize').disabled=$('readGas').disabled=!state.collected;$('weighBefore').disabled=state.before;
  $('head').disabled=!state.collected;$('headValue').textContent=state.head+' cm';
  note(busy&&F.collect?'관 끝에서 나온 기체 방울이 실린더 위로 모이며 물을 밀어 냅니다.':!state.before?'기체를 모으기 전에 통의 질량을 먼저 측정하세요.':!state.collected?'통의 처음 질량을 확인했습니다. 기체를 물 위에 모으세요.':!state.after?'기체를 모았습니다. 같은 통의 질량을 다시 재어 감소량을 확인하세요.':!state.read?'안팎 수면 높이를 확인하고 부피·온도·압력을 읽으세요.':`25 ℃ = 298.15 K. 건조 기체 압력 = 101.3 − 3.17 − ${(.0980665*state.head).toFixed(2)} kPa. M=mRT/(PV)로 후보의 몰 질량과 비교하세요.`);
 }
 // ---------- sugar solution ----------
 function hotplateArt(x,on){
  return rect(x-84,222,168,40,'#e6ecee','rx="8" stroke="#8a9ea8" stroke-width="1.6"')+rect(x-76,213,152,10,on?'#86605a':'#5d676d','rx="3"')+rect(x-30,233,60,16,'#d1dbdf','rx="3" stroke="#a5b6bd" stroke-width="1"')
   +`<circle cx="${x-58}" cy="242" r="10" fill="#f6f8f9" stroke="#6f8590" stroke-width="1.5"/><path d="M${x-58} 242l${on?7:-7} -6" stroke="#38505c" stroke-width="2.4" stroke-linecap="round"/><circle cx="${x+60}" cy="242" r="4.5" fill="${on?'#d4543b':'#b9c4c9'}"/>`;
 }
 function sugarGraph(x0,x1,y0,y1,lo,hi,fn,color){let d='';for(let t=0;t<=state.time;t+=5){const v=fn(t),xx=x0+(x1-x0)*t/500,yy=y1-clamp((v-lo)/(hi-lo))*(y1-y0);d+=(d?'L':'M')+xx.toFixed(1)+' '+yy.toFixed(1);}return d?path(d,color,2.6,'stroke-linejoin="round"'):'';}
 function drawSugar(){
  const F=fxNow(),now=performance.now(),heat=state.mode==='heat',a=M.sugar(0,state.mode,state.time),c=M.sugar(state.molality,state.mode,state.time),names={liquid:'액체',boiling:'끓는 중',freezing:'얼기 시작함'};
  const dissolving=F&&F.kind==='sugarDissolve'?F.f:null,ready=state.prepared&&dissolving===null;
  let out=rect(0,262,640,8,'#efe8dc','opacity=".9"')+line(0,262,640,262,'#cbbda5',1.6);
  [a,c].forEach((r,i)=>{const x=170+300*i,top=heat?96:134,bottom=heat?213:251,level=heat?128:166,frozen=ready&&r.phase==='freezing'?clamp(r.transformed/.2):0;
   if(heat)out+=hotplateArt(x,ready&&state.time>0);
   else{out+=`<path d="M${x-92} 150V250Q${x-92} 260 ${x-82} 260H${x+82}Q${x+92} 260 ${x+92} 250V150" fill="#eef6f9" fill-opacity=".5" stroke="#8fb1be" stroke-width="2.4"/>`+rect(x-90,172,180,86,'#cfe6ef','opacity=".85"');}
   out+=glassBeaker(x,top,bottom,128,level,r.phase==='freezing'&&ready?'#d4e8f3':'#bcdde9');
   if(!heat)for(let k=0;k<6;k++){const side=k%2?1:-1,yy=182+Math.floor(k/2)*24;out+=`<rect x="${x+side*78-9}" y="${yy}" width="18" height="16" rx="3" fill="#f5fbfd" stroke="#9ec3d1" stroke-width="1.2" transform="rotate(${(rnd(k+i*7)*30-15).toFixed(1)} ${x+side*78} ${yy+8})"/>`;}
   if(frozen>0){const w=4+16*frozen;for(const side of[-1,1]){const wx=side<0?x-62:x+62-w;out+=rect(wx,level+6,w,bottom-level-10,'#f3f9fc','rx="3" stroke="#a9cad7" stroke-width="1" opacity=".95"');for(let k=0;k<5;k++){const yy=level+16+k*((bottom-level-28)/4);out+=line(x+side*(62-w),yy,x+side*(62-w-6-8*frozen*rnd(k+side+5)),yy-4,'#a9cad7',1.4);}}out+=rect(x-60,bottom-6-8*frozen,120,6+8*frozen,'#f3f9fc','rx="3" opacity=".95"');}
   if(ready&&r.phase==='boiling'){for(let k=0;k<10;k++){const q=running?(now/1100+rnd(k+3))%1:rnd(k+11),yy=bottom-8-q*(bottom-8-level-4);out+=`<circle cx="${(x-50+rnd(k)*70).toFixed(1)}" cy="${yy.toFixed(1)}" r="${(2+q*4).toFixed(1)}" fill="#f2fafd" stroke="#5c9db4" stroke-width="1.2"/>`;}
    for(let k=0;k<3;k++){const w=running?Math.sin(now/400+k)*5:0;out+=`<path d="M${x-44+k*26} ${top-4}q${7+w} -10 0 -19q${-7-w} -9 0 -17" fill="none" stroke="#9bb8c4" stroke-width="2" opacity=".55"/>`;}}
   out+=thermo(x+34,heat?42:76,bottom-16,ready||!i?r.temperature:20,heat?0:-10,heat?110:30,bottom-34,heat?52:92,[]);
   out+=text(x-30,heat?56:96,(state.prepared?r.temperature:20).toFixed(2)+' ℃',20,'#143541');
   out+=text(x,288,i?'설탕물 '+state.molality+' m':'물',15);
  });
  if(dissolving!==null){const x=470,f=dissolving,lipX=x-58,lipY=heat?62:100,bottom=heat?213:251,level=heat?128:166,tilt=-38*ease(seg(f,0,.18))*(1-seg(f,.5,.62));
   if(f<.62)out+=`<g transform="rotate(${tilt.toFixed(1)} ${lipX+44} ${lipY})"><path d="M${lipX} ${lipY}L${lipX+70} ${lipY-6}L${lipX+78} ${lipY+6}L${lipX+6} ${lipY+12}Z" fill="#fbfbf7" stroke="#aebbc3" stroke-width="1.5"/>${f<.3?`<ellipse cx="${lipX+40}" cy="${lipY+1}" rx="${(20*(1-seg(f,.1,.3))).toFixed(1)}" ry="5" fill="#f7f1df" stroke="#d6ccb4"/>`:''}</g>`;
   for(let k=0;k<16;k++){const t0=.1+k*.014,q=(f-t0)/.16;if(q>0&&q<1){const yy=lipY+6+q*q*(bottom-12-lipY);out+=rect((lipX+2+rnd(k)*10).toFixed(1),yy.toFixed(1),3.5,3.5,'#fbf6e6','stroke="#cbbf9f" stroke-width=".6"');}}
   const heap=seg(f,.16,.42)*(1-seg(f,.5,.96));if(heap>0)out+=`<ellipse cx="${x-6}" cy="${bottom-6}" rx="${(30*heap).toFixed(1)}" ry="${(7*heap).toFixed(1)}" fill="#fbf6e6" stroke="#cbbf9f" stroke-width="1"/>`;
   if(f>.42){const ph=f*26;out+=`<path d="M${(x-10+Math.sin(ph)*22).toFixed(1)} ${bottom-10}L${(x-34+Math.sin(ph)*8).toFixed(1)} ${lipY-24}" stroke="#8fb3c2" stroke-width="5" stroke-linecap="round" opacity=".85"/>`;}
   if(f>.45&&f<.95)for(let k=0;k<3;k++)out+=`<path d="M${x-40+k*30} ${bottom-20}q10 -${10+k*4} 0 -${22+k*6}" fill="none" stroke="#e8e1c8" stroke-width="2" opacity="${(1-seg(f,.7,.95)).toFixed(2)}"/>`;
  }
  const x0=80,x1=590,y0=334,y1=458,lo=heat?0:-10,hi=heat?110:30,ticks=heat?[0,20,40,60,80,100]:[-10,0,10,20,30];
  for(const v of ticks){const yy=y1-(v-lo)/(hi-lo)*(y1-y0);out+=line(x0,yy,x1,yy,'#dbe5ea',1)+`<text x="${x0-8}" y="${(yy+5).toFixed(1)}" font-size="14" text-anchor="end" fill="#3d5662">${v}</text>`;}
  for(let t=0;t<=500;t+=100){const xx=x0+(x1-x0)*t/500;out+=line(xx,y1,xx,y1+5,'#8ba7b5',1)+`<text x="${xx}" y="${y1+22}" font-size="14" text-anchor="middle" fill="#3d5662">${t}</text>`;}
  out+=line(x0,y1,x1,y1,'#7f9aa8',1.4)+line(x0,y0-6,x0,y1,'#7f9aa8',1.4)+`<text x="${x0}" y="${y0-14}" font-size="15" fill="#143541">온도 (℃)</text><text x="${x1}" y="${y1+44}" font-size="15" text-anchor="end" fill="#143541">시간 (s)</text>`;
  out+=line(x1-150,y0-19,x1-126,y0-19,'#298b9c',3)+`<text x="${x1-120}" y="${y0-14}" font-size="14" fill="#143541">물</text>`+line(x1-80,y0-19,x1-56,y0-19,'#c67636',3)+`<text x="${x1-50}" y="${y0-14}" font-size="14" fill="#143541">설탕물</text>`;
  if(state.prepared)out+=sugarGraph(x0,x1,y0,y1,lo,hi,t=>M.sugar(0,state.mode,t).temperature,'#298b9c')+sugarGraph(x0,x1,y0,y1,lo,hi,t=>M.sugar(state.molality,state.mode,t).temperature,'#c67636');
  svg(out,'물과 설탕물을 '+(heat?'가열판 위에서 가열':'얼음과 소금 냉각조에서 냉각')+'하는 장치와 시간별 온도 그래프, 파랑은 물 주황은 설탕물',512);
  window.scienceScene.render(readout,metric('필요한 설탕',c.mass.toFixed(1)+' g')+metric('경과 시간',Math.round(state.time)+' s')+metric('물 / 설탕물',ready?names[a.phase]+' / '+names[c.phase]:dissolving!==null?'설탕을 녹이는 중':'용액 준비 전'));
  $('dissolveSugar').disabled=state.prepared;$('startTemperature').disabled=$('stepTemperature').disabled=!ready||state.time>=500;$('startTemperature').textContent=running?'일시 정지':heat?'가열 시작':'냉각 시작';
  note(dissolving!==null?'설탕을 물에 넣고 유리 막대로 저어 모두 녹이고 있습니다.':!state.prepared?'선택한 농도에 필요한 설탕을 물 500 g에 모두 녹이세요.':state.time===0?'용액을 준비했습니다. 두 시료를 함께 가열하거나 냉각하세요.':`파랑: 물, 주황: 설탕물. ${heat?'끓기':'얼기'} 시작하는 두 온도를 비교하세요. 상변화가 진행되는 설탕물의 온도가 순수한 물처럼 계속 일정하지는 않습니다.`);
 }
 // ---------- Hess's law: foam-cup calorimeters drawn in section ----------
 const CUP={top:112,bot:268,ti:62,bi:46,lid:92};
 const cupHalf=y=>CUP.ti+(CUP.bi-CUP.ti)*(y-CUP.top)/(CUP.bot-CUP.top),cupLevel=ml=>CUP.bot-ml*.6;
 function cupArt(cx,level,liquid='#c7e2ec'){
  let s=`<path d="M${cx-75} 104L${cx-57} 277H${cx+57}L${cx+75} 104Z" fill="#f1ecdf" stroke="#b6a989" stroke-width="1.6"/><path d="M${cx-62} ${CUP.top}L${cx-46} ${CUP.bot}H${cx+46}L${cx+62} ${CUP.top}Z" fill="#fafcfd" stroke="#b6a989" stroke-width="1.4"/><path d="M${cx-69} 104L${cx-52} 272H${cx+52}L${cx+69} 104" fill="none" stroke="#d3c8ad" stroke-width="1"/>`;
  for(let i=0;i<14;i++){const side=i%2?1:-1,y=116+(i>>1)*22;s+=`<circle cx="${(cx+side*(cupHalf(y)+6.5)).toFixed(1)}" cy="${y}" r="1.3" fill="#d6cbb0"/>`;}
  const h=cupHalf(level);s+=`<path d="M${(cx-h).toFixed(1)} ${level}L${cx-CUP.bi} ${CUP.bot}H${cx+CUP.bi}L${(cx+h).toFixed(1)} ${level}Z" fill="${liquid}" opacity=".9"/><path d="M${(cx-h).toFixed(1)} ${level}H${(cx+h).toFixed(1)}" stroke="#6fa3b6" stroke-width="1.4"/>`;
  return s;
 }
 function cupLid(cx){return rect(cx-82,CUP.lid,52,14,'#e9e2d0','rx="3" stroke="#b6a989" stroke-width="1.4"')+rect(cx-18,CUP.lid,26,14,'#e9e2d0','stroke="#b6a989" stroke-width="1.4"')+rect(cx+36,CUP.lid,46,14,'#e9e2d0','rx="3" stroke="#b6a989" stroke-width="1.4"');}
 function pelletBoat(x,y,tilt,n){let s=`<g transform="rotate(${tilt.toFixed(1)} ${x} ${y})"><path d="M${x-26} ${y-6}L${x+26} ${y-6}L${x+20} ${y+5}H${x-20}Z" fill="#fafaf7" stroke="#9fb0b8" stroke-width="1.4"/>`;for(let i=0;i<n;i++)s+=`<ellipse cx="${x-12+(i%4)*8}" cy="${y-8-Math.floor(i/4)*4}" rx="3.6" ry="2.6" fill="#fdfdfb" stroke="#a9b6bc" stroke-width=".9"/>`;return s+'</g>';}
 function pelletDrop(cx,f,level,s0=.1){let s='';for(let i=0;i<8;i++){const t0=s0+i*.022,q=clamp((f-t0)/.2);if(q<=0)continue;const sx=cx+22+(i%3-1)*3,y=72+q*q*(CUP.bot-10-72),under=y>level,px=under?cx+8+(i-4)*7:sx,shrink=1-seg(f,.38+i*.02,.9);if(shrink<=0)continue;
   s+=`<ellipse cx="${(q<1?sx+(px-sx)*seg(y,level,CUP.bot-10):px).toFixed(1)}" cy="${Math.min(y,CUP.bot-6).toFixed(1)}" rx="${(3.6*shrink+.4).toFixed(1)}" ry="${(2.6*shrink+.3).toFixed(1)}" fill="#fdfdfb" stroke="#a9b6bc" stroke-width=".9"/>`;
   if(q>=1&&shrink<1)s+=`<path d="M${cx+8+(i-4)*7} ${CUP.bot-10}q4 -10 0 -${16+i*2}" fill="none" stroke="#9fc4d2" stroke-width="1.4" opacity="${(shrink*.8).toFixed(2)}"/>`;}
  return s;}
 function drawHess(){
  const F=fxNow(),dissolve=M.hess('dissolve'),neutral=M.hess('neutralize'),direct=M.hess('direct'),A=166,B=474;
  const stepT=[25,dissolve.temperature,25,neutral.temperature];let ta=stepT[state.step],tb=state.direct?direct.temperature:25,volA=state.step===3?200:100,busyA=false,busyB=false;
  if(F&&F.kind==='hessA'){busyA=true;const from=stepT[F.from],to=stepT[state.step],k=F.mode==='cool'?ease(F.f):ease(seg(F.f,F.mode==='mix'?.3:.28,1));ta=from+(to-from)*k;if(F.mode==='mix')volA=100+100*ease(seg(F.f,.1,.75));}
  if(F&&F.kind==='hessB'){busyB=true;tb=25+(direct.temperature-25)*ease(seg(F.f,.28,1));}
  const lvA=cupLevel(volA),lvB=cupLevel(200);
  let b=rect(0,277,640,10,'#efe8dc')+line(0,277,640,277,'#cbbda5',1.6);
  b+=cupArt(A,lvA)+cupArt(B,lvB);
  if(F&&F.kind==='hessA'&&F.mode==='dissolve')b+=pelletDrop(A,F.f,lvA);
  if(F&&F.kind==='hessB')b+=pelletDrop(B,F.f,lvB);
  b+=cupLid(A)+cupLid(B);
  b+=thermo(A-24,22,246,ta,20,40,80,30,[20,30,40],1)+thermo(B-24,22,246,tb,20,40,80,30,[20,30,40],1);
  for(const[x,t]of[[A,ta],[B,tb]])b+=`<text x="${x-38}" y="46" font-size="20" text-anchor="end" fill="#143541">${t.toFixed(2)} ℃</text>`;
  // NaOH waiting beside each cup, and the acid cylinder for route A
  const boatA=F&&F.kind==='hessA'&&F.mode==='dissolve',boatB=F&&F.kind==='hessB';
  if(boatA)b+=pelletBoat(A+50,62,-40*ease(seg(F.f,0,.14))*(1-seg(F.f,.42,.5)),F.f<.12?8:0);else if(state.step===0)b+=pelletBoat(A+100,270,0,8);
  if(boatB)b+=pelletBoat(B+50,62,-40*ease(seg(F.f,0,.14))*(1-seg(F.f,.42,.5)),F.f<.12?8:0);else if(!state.direct)b+=pelletBoat(B+100,270,0,8);
  const pour=F&&F.kind==='hessA'&&F.mode==='mix'?F.f:null;
  if(state.step<3||pour!==null){const k=pour===null?0:ease(seg(pour,0,.12))*(1-seg(pour,.84,.97)),tx=A+150+(A+40-A-150)*k,ty=173+(70-173)*k,left=pour===null?1:1-ease(seg(pour,.12,.8));
   b+=`<g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) rotate(${(-110*k).toFixed(1)})">${rect(-12,0,24,92,'#f3f9fb','rx="3" fill-opacity=".7" stroke="#86a9b7" stroke-width="1.8"')}${rect(-10,k>.5?2:90-78*left,20,78*left,'#cfe7ef','opacity=".9"')}${rect(-18,92,36,5,'#9fb4bd','rx="2"')}${[20,40,60].map(y=>line(6,y+8,11,y+8,'#7d9ca8',1)).join('')}</g>`;
   if(pour!==null&&pour>.12&&pour<.8)b+=`<path d="M${A+38} 76Q${A+24} 90 ${A+22} ${lvA.toFixed(1)}" fill="none" stroke="#a9d0de" stroke-width="5" stroke-linecap="round" stroke-dasharray="9 5" stroke-dashoffset="${(-performance.now()/14%14).toFixed(1)}"/>`;}
  b+=(state.step<3?text(A+150,300,'염산',15,'#2f5562'):'')+text(A,300,'A · 두 단계',16)+text(B,300,'B · 직접 반응',16);
  b+=text(A,332,['물 100 mL','NaOH 수용액','식힌 NaOH 수용액','NaCl 수용액'][state.step],15,'#2f5562')+text(B,332,state.direct?'NaCl 수용액':'물·염산 200 mL',15,'#2f5562');
  svg(b,'두 개의 스티로폼 컵 열량계 단면, 뚜껑을 지나 용액에 잠긴 온도계와 넣는 고체 수산화 나트륨',346);
  $('dissolveNaOH').disabled=state.step!==0;$('coolSolution').disabled=state.step!==1||busyA;$('neutralize').disabled=state.step!==2||busyA;$('directReaction').disabled=state.direct;
  window.scienceScene.render(readout,metric('A① 용해 · 방출 열',state.step>0&&!(busyA&&F.mode==='dissolve')?dissolve.q.toFixed(2)+' kJ':busyA&&F.mode==='dissolve'?'측정 중…':'아직 반응 전')+metric('A③ 중화 · 방출 열',state.step===3&&!busyA?neutral.q.toFixed(2)+' kJ':busyA&&F.mode==='mix'?'측정 중…':'아직 반응 전')+metric('B 직접 · 방출 열',state.direct&&!busyB?direct.q.toFixed(2)+' kJ':busyB?'측정 중…':'아직 반응 전'));
  note(state.step===3&&state.direct?'4.45 + 5.73 = 10.18 kJ. 같은 0.10 mol을 반응시키면 두 단계의 합과 직접 경로의 방출 열이 같습니다. 용액 질량이 다르므로 온도 상승 자체를 더하지 않습니다.':busyA&&F.mode==='dissolve'?'고체 NaOH가 물에 녹으며 온도계 눈금이 올라갑니다.':busyA&&F.mode==='cool'?'용액을 실온 25 ℃까지 식히고 있습니다.':busyA?'염산을 부어 섞는 동안 온도 변화를 지켜보세요.':busyB?'고체 NaOH를 염산 혼합물에 넣었습니다. 온도계 눈금을 지켜보세요.':state.step===3&&state.direct?'4.45 + 5.73 = 10.18 kJ. 같은 0.10 mol을 반응시키면 두 단계의 합과 직접 경로의 방출 열이 같습니다. 용액 질량이 다르므로 온도 상승 자체를 더하지 않습니다.':state.step===1?'용해열로 온도가 올라갔습니다. 이 용액을 실온으로 식힌 뒤 같은 온도의 염산을 섞어 다음 반응의 온도 변화를 확인하세요.':'각 단계에서 반응 전후 온도를 비교합니다. A의 중화는 용해시킨 용액을 식힌 뒤에 진행합니다.');
 }
 function measure(name){if(!state.clean&&state.well!==name){note('이전 용액이 묻어 있습니다. 전극을 헹군 뒤 다른 시료를 측정하세요.');return;}
  const p=slug==='buffer-solution'?M.buffer(name,'BE'.includes(name)?state.acid:'CF'.includes(name)?state.base:0):M.salt(name,state.concentration);
  state.well=name;state.clean=false;state.measured[name]=p;draw();
 }
 // pH apparatus: the model state changes at once, the picture follows over time.
 const reduceMotion=()=>!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 const ease=t=>t<.5?2*t*t:1-(-2*t+2)**2/2;
 let ph=null,phRaf=0,rinses=0;
 function phGeo(){
  if(slug==='buffer-solution'){
   const pos={};'ABCDEF'.split('').forEach((n,i)=>{const back=i<3,cx=(back?122:96)+(i%3)*140,cy=back?160:296;pos[n]={x:cx,cy,surface:cy+16,dip:cy+44,top:cy-13};});
   return {pos,park:{x:585,tip:318},lift:140,beaker:{x:585,top:334,bottom:410},bottle:{x:660,y:410},meter:{x:530,y:14},stand:500,bench:410,w:700,h:470};
  }
  const pos={};['NH4Cl','NaCN','NaCl'].forEach((n,i)=>{const cx=95+i*150;pos[n]={x:cx,cy:220,surface:242,dip:300,top:205};});
  return {pos,park:{x:585,tip:268},lift:160,beaker:{x:585,top:284,bottom:360},bottle:{x:660,y:360},meter:{x:530,y:14},stand:500,bench:360,w:700,h:440};
 }
 function phReset(){cancelAnimationFrame(phRaf);phRaf=0;const g=phGeo();ph={probe:{...g.park},display:null,queue:[],task:null,seen:{acid:state.acid||0,base:state.base||0,well:state.well,rinses}};}
 function phTarget(){const g=phGeo();return state.well?{x:g.pos[state.well].x,tip:g.pos[state.well].dip}:{...g.park};}
 function phFinish(task){if(!task)return;if(task.kind==='move')ph.probe={...task.to};if(task.kind==='settle')ph.display=task.to;if(task.kind==='lift')ph.display=null;}
 function phBegin(task,now){task.start=now;if(task.kind==='lift')ph.display=null;if(task.kind==='settle')task.from=ph.display??7;return task;}
 function phSchedule(tasks){
  phFinish(ph.task);ph.queue.forEach(phFinish);ph.task=null;ph.queue=tasks;
  if(reduceMotion()){ph.queue.forEach(phFinish);ph.queue=[];paintPH();return;}
  paintPH();
  if(!phRaf){const frame=now=>{phRaf=0;if(!ph)return;
    if(!ph.task&&ph.queue.length)ph.task=phBegin(ph.queue.shift(),now);
    while(ph.task&&now-ph.task.start>=ph.task.dur){phFinish(ph.task);ph.task=ph.queue.length?phBegin(ph.queue.shift(),now):null;}
    paintPH(now);if(ph.task||ph.queue.length)phRaf=requestAnimationFrame(frame);};
   phRaf=requestAnimationFrame(frame);}
 }
 function phMove(from,to){const L=phGeo().lift,d=Math.abs(from.x-to.x)+Math.abs(from.tip-L)+Math.abs(to.tip-L);return {kind:'move',from:{...from},to:{...to},dur:Math.min(1600,450+d*1.7)};}
 function drawPH(){
  if(!ph)phReset();const s=ph.seen,g=phGeo(),tasks=[];
  let from={...ph.probe};for(const t of [ph.task,...ph.queue])if(t&&t.kind==='move')from={...t.to};
  if(slug==='buffer-solution'){
   if(state.acid>s.acid)tasks.push({kind:'drop',wells:['B','E'],acid:true,dur:1600});
   if(state.base>s.base)tasks.push({kind:'drop',wells:['C','F'],acid:false,dur:1600});
  }
  if(state.well!==s.well||rinses!==s.rinses){
   if(s.well&&state.well!==s.well)tasks.unshift({kind:'lift',dur:1});
   const target=phTarget();
   if(rinses!==s.rinses){if(from.x!==g.park.x||from.tip!==g.park.tip)tasks.push(phMove(from,g.park));tasks.push({kind:'squirt',dur:1600});}
   else if(target.x!==from.x||target.tip!==from.tip)tasks.push(phMove(from,target));
   if(state.well&&state.measured[state.well]!==undefined)tasks.push({kind:'settle',to:state.measured[state.well],dur:1100});
  }
  ph.seen={acid:state.acid||0,base:state.base||0,well:state.well,rinses};
  if(tasks.length)phSchedule(tasks);else paintPH();
 }
 const phBusy=()=>!!(ph&&(ph.task||ph.queue.length));
 function probeArt(x,tip,g){
  const top=tip-112,arm=top+20,mx=g.meter.x-6,my=g.meter.y+90;
  const cy=arm-13,cable=x>g.stand+20?`M${mx} ${my}C${mx-40} ${my} ${x} ${top-50} ${x} ${top}`:`M${mx} ${my}C${mx-40} ${my} ${g.stand+30} ${cy} ${g.stand} ${cy}H${x+14}Q${x} ${cy} ${x} ${top}`;let b=`<path d="${cable}" fill="none" stroke="#33454f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  b+=rect(Math.min(x,g.stand),arm-4,Math.max(1,Math.abs(g.stand-x)),8,'#9aa9b1','rx="3" stroke="#66767f" stroke-width="1"')+rect(g.stand-9,arm-8,18,16,'#55666f','rx="3"')+rect(x-11,arm-8,22,16,'#55666f','rx="3"');
  b+=rect(x-6,top,12,30,'#34464f','rx="3"')+`<path d="M${x-6} ${top+30}H${x+6}V${tip-20}L${x+4} ${tip-10}H${x-4}L${x-6} ${tip-20}Z" fill="#e4eff3" stroke="#6f8e9b" stroke-width="1.4"/><path d="M${x} ${top+34}V${tip-14}" stroke="#9fb9c3" stroke-width="1.5"/><circle cx="${x}" cy="${tip-6}" r="6" fill="#eaf5f9" stroke="#6f8e9b" stroke-width="1.4"/><path d="M${x-3} ${top+36}V${tip-24}" stroke="#fff" stroke-width="1.5" opacity=".8"/>`;
  return b;
 }
 function meterArt(g,value,live){
  const {x,y}=g.meter,shown=value===null||value===undefined?'--.--':value.toFixed(2);
  return rect(x,y,140,116,'#f4f7f8','rx="12" stroke="#6b8794" stroke-width="2"')+rect(x+12,y+12,116,50,'#d5e6d2','rx="5" stroke="#7f9a80" stroke-width="1.5"')+`<text x="${x+120}" y="${y+50}" font-size="27" text-anchor="end" fill="#22382a" font-family="Consolas,monospace">${shown}</text><text x="${x+18}" y="${y+30}" font-size="14" fill="#3f5a45">pH</text>`+(live?`<circle cx="${x+22}" cy="${y+50}" r="4" fill="#3f8a4f"/>`:'')+`<circle cx="${x+28}" cy="${y+88}" r="9" fill="#dfe8ec" stroke="#6b8794"/><circle cx="${x+54}" cy="${y+88}" r="9" fill="#dfe8ec" stroke="#6b8794"/>`+text(x+102,y+94,'pH 측정기',14,'#3d5662')+rect(x-8,y+84,8,12,'#33454f','rx="2"');
 }
 function standArt(g){return rect(g.stand-4,40,8,g.bench-46,'#9aa9b1','rx="3" stroke="#66767f" stroke-width="1"')+rect(g.stand-34,g.bench-9,68,10,'#6f7f88','rx="3"');}
 function wasteBeaker(g){const {x,top,bottom}=g.beaker;return `<path d="M${x-40} ${top}V${bottom-6}Q${x-40} ${bottom} ${x-34} ${bottom}H${x+34}Q${x+40} ${bottom} ${x+40} ${bottom-6}V${top}" fill="#f2f8fa" fill-opacity=".6" stroke="#8baebb" stroke-width="2.2"/>`+rect(x-38,bottom-22,76,20,'#d5eaf1','opacity=".85"')+`<ellipse cx="${x}" cy="${top}" rx="40" ry="4" fill="none" stroke="#8baebb" stroke-width="1.8"/>`+text(x,bottom+22,'헹군 물',14,'#3d5662');}
 function bottleArt(g,squeeze){
  const {x,y}=g.bottle,k=squeeze*4;
  return `<g transform="rotate(${(-squeeze*12).toFixed(2)} ${x} ${y})"><path d="M${x-20+k} ${y}H${x+20-k}Q${x+24-k} ${y-50} ${x+16} ${y-70}H${x-16}Q${x-24+k} ${y-50} ${x-20+k} ${y}Z" fill="#eef4f7" stroke="#6f8e9b" stroke-width="2"/>`+rect(x-19+k,y-30,38-2*k,26,'#d4e9f2','opacity=".8"')+rect(x-9,y-82,18,13,'#c7563e','rx="2"')+`<path d="M${x} ${y-82}V${y-96}Q${x} ${y-104} ${x-10} ${y-106}L${x-34} ${y-112}" fill="none" stroke="#b8cfd8" stroke-width="5" stroke-linecap="round"/><path d="M${x} ${y-82}V${y-96}Q${x} ${y-104} ${x-10} ${y-106}L${x-34} ${y-112}" fill="none" stroke="#eef6f8" stroke-width="2" stroke-linecap="round"/></g>`+text(x-4,y+22,'증류수',14,'#3d5662');
 }
 function dropperArt(x,tipY,acid){return `<ellipse cx="${x}" cy="${tipY-92}" rx="11" ry="16" fill="${acid?'#b8483a':'#4a6fa8'}"/>`+rect(x-6,tipY-80,12,8,acid?'#943a2f':'#3d5d8f','rx="2"')+`<path d="M${x-5} ${tipY-72}H${x+5}V${tipY-26}L${x+1.5} ${tipY}H${x-1.5}L${x-5} ${tipY-26}Z" fill="#eef6f9" stroke="#7b9aa6" stroke-width="1.3"/>`+rect(x-3.5,tipY-42,7,16,acid?'#f1d9d3':'#d9e1f1')+`<text x="${x+16}" y="${tipY-88}" font-size="14" fill="#3d5662">${acid?'1 M HCl':'1 M NaOH'}</text>`;}
 function phWellArt(name,g,label,line,active){
  const {x,cy}=g.pos[name],rx=44,ry=13,depth=46,buf='DEF'.includes(name);
  let b=`<path d="M${x-rx} ${cy}V${cy+depth}A${rx} ${ry} 0 0 0 ${x+rx} ${cy+depth}V${cy}" fill="#e8f2f6" fill-opacity=".55" stroke="#93b2be" stroke-width="1.6"/>`;
  b+=`<path d="M${x-rx+1} ${cy+16}V${cy+depth}A${rx-1} ${ry} 0 0 0 ${x+rx-1} ${cy+depth}V${cy+16}A${rx-1} ${ry} 0 0 1 ${x-rx+1} ${cy+16}Z" fill="${buf?'#cfe6dc':'#c6e2ee'}" opacity=".9"/><ellipse cx="${x}" cy="${cy+16}" rx="${rx-1}" ry="${ry}" fill="${buf?'#ddefe6':'#d9edf5'}" stroke="#86adbb" stroke-width="1"/>`;
  b+=`<ellipse cx="${x}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${active?'#176878':'#86a9b6'}" stroke-width="${active?3:1.8}"/><path d="M${x-rx+7} ${cy+8}V${cy+depth-4}" stroke="#fff" stroke-width="3" opacity=".7"/>`;
  return b+text(x,cy-22,label,15,'#143541')+text(x,cy+depth+30,line,14,'#2f5562');
 }
 function saltBeaker(x,g,active){
  const top=g.pos.NH4Cl.top,bottom=g.bench,s=g.pos.NH4Cl.surface;
  return `<path d="M${x-52} ${top}V${bottom-8}Q${x-52} ${bottom} ${x-44} ${bottom}H${x+44}Q${x+52} ${bottom} ${x+52} ${bottom-8}V${top}" fill="#f2f8fa" fill-opacity=".5" stroke="${active?'#176878':'#8baebb'}" stroke-width="${active?3:2.4}"/><path d="M${x-50} ${s}V${bottom-8}Q${x-50} ${bottom-2} ${x-44} ${bottom-2}H${x+44}Q${x+50} ${bottom-2} ${x+50} ${bottom-8}V${s}Z" fill="#d9edf5" opacity=".9"/><ellipse cx="${x}" cy="${s}" rx="50" ry="4" fill="#e6f3f8" stroke="#86adbb" stroke-width="1"/><ellipse cx="${x}" cy="${top}" rx="52" ry="5" fill="none" stroke="#8baebb" stroke-width="2"/><path d="M${x-58} ${top-2}Q${x-54} ${top-6} ${x-50} ${top-3}" fill="none" stroke="#8baebb" stroke-width="2"/><path d="M${x-42} ${top+12}V${bottom-12}" stroke="#fff" stroke-width="4" opacity=".65"/>`+[0,1,2,3].map(i=>line(x+30,top+30+i*24,x+44,top+30+i*24,'#6c94a3',1.2)).join('');
 }
 function paintPH(now=performance.now()){
  if(!ph)phReset();const narrow=scene.clientWidth>0&&scene.clientWidth<560;const g=phGeo(),buffer=slug==='buffer-solution',names=buffer?['A','B','C','D','E','F']:['NH4Cl','NaCN','NaCl'],labels=buffer?['A 물 · 기준','B 물 + 산','C 물 + 염기','D 완충액 · 기준','E 완충액 + 산','F 완충액 + 염기']:['NH₄Cl','NaCN','NaCl'];
  const task=ph.task,f=task?Math.min(1,Math.max(0,(now-task.start)/task.dur)):1;let probe={...ph.probe},display=ph.display,squirt=0;
  if(task?.kind==='move'){const a=task.from,c=task.to,L=g.lift,d1=Math.abs(a.tip-L),d2=Math.abs(a.x-c.x),d3=Math.abs(c.tip-L),tot=d1+d2+d3||1,s=ease(f)*tot;
   probe=s<d1?{x:a.x,tip:a.tip+(L-a.tip)*s/d1}:s<d1+d2?{x:a.x+(c.x-a.x)*(s-d1)/(d2||1),tip:L}:{x:c.x,tip:L+(c.tip-L)*Math.min(1,(s-d1-d2)/(d3||1))};}
  if(task?.kind==='settle')display=task.to+(task.from-task.to)*Math.exp(-4*f)*(1-f);
  if(task?.kind==='squirt')squirt=Math.min(1,Math.sin(f*Math.PI)*1.6);
  const live=task?.kind==='settle';
  let b=`<rect x="0" y="${g.bench}" width="${g.w}" height="${g.h-g.bench}" fill="#efe8dc"/><line x1="0" y1="${g.bench}" x2="${g.w}" y2="${g.bench}" stroke="#cbbda5" stroke-width="2"/>`;
  if(buffer){const top=112,front=360;b+=`<path d="M24 ${front}H${g.stand-62}L${g.stand-34} ${top}H52Z" fill="#eef5f8" fill-opacity=".8" stroke="#9ab6c2" stroke-width="2"/>`+rect(24,front,g.stand-86,g.bench-front,'#e1ecf0','stroke="#9ab6c2" stroke-width="2"')+`<path d="M${g.stand-62} ${front}L${g.stand-34} ${top}V${g.bench-28}L${g.stand-62} ${g.bench}Z" fill="#d4e3ea" stroke="#9ab6c2" stroke-width="2"/>`;}
  b+=standArt(g)+wasteBeaker(g)+bottleArt(g,squirt)+meterArt(g,display,live);if(narrow)b=b.replace(/<text[^>]*>(헹군 물|증류수|pH 측정기)<\/text>/g,'');
  names.forEach((name,i)=>{const p=state.measured[name],shown=p!==undefined&&!(phBusy()&&state.well===name);
   if(buffer){const add=i%3===0?'첨가 없음':(i%3===1?'산 '+state.acid:'염기 '+state.base)+'방울';b+=narrow?phWellArt(name,g,name,shown?p.toFixed(2):i%3===0?'':(i%3===1?state.acid:state.base)+'방울',state.well===name):phWellArt(name,g,labels[i],add+(shown?' · pH '+p.toFixed(2):''),state.well===name);}
   else{const x=g.pos[name].x;b+=saltBeaker(x,g,state.well===name)+text(x,g.bench+24,narrow?labels[i]:labels[i]+' '+state.concentration+' M',15)+(shown?text(x,g.bench+(narrow?62:46),'pH '+p.toFixed(2),15,'#2f5562'):'');}
  });
  if(task?.kind==='drop'){const half=f<.5?0:1,k=(f-half*.5)/.5,w=g.pos[task.wells[half]],tipY=w.top-34,fall=(k-.3)/.4,color=task.acid?'#e9b9ae':'#b9c9e9';
   b+=narrow?dropperArt(w.x,tipY,task.acid).replace(/<text[^>]*>[^<]*<\/text>/,''):dropperArt(w.x,tipY,task.acid);
   if(fall<=0)b+=`<path d="M${w.x} ${tipY}c-2.5 4-2.5 ${3+4*(k/.3)} 0 ${3+4*(k/.3)}s2.5-${3+4*(k/.3)} 0-${3+4*(k/.3)}Z" fill="${color}" stroke="#7b9aa6" stroke-width=".6"/>`;
   else if(fall<1){const yy=tipY+2+fall*fall*(w.surface-tipY-10);b+=`<path d="M${w.x} ${yy.toFixed(1)}c-4 6-4 10 0 10s4-4 0-10Z" fill="${color}" stroke="#7b9aa6" stroke-width=".8"/>`;}
   else{const r=Math.min(1,(k-.7)/.3);b+=`<ellipse cx="${w.x}" cy="${w.surface}" rx="${(5+r*32).toFixed(1)}" ry="${(1.5+r*8).toFixed(1)}" fill="none" stroke="#4f8ea3" stroke-width="1.6" opacity="${(1-r).toFixed(2)}"/>`;}}
  if(squirt>0){const bx=g.bottle.x,by=g.bottle.y,nx=bx-36,ny=by-110+squirt*8;b+=`<path d="M${nx} ${ny}Q${((nx+probe.x)/2).toFixed(1)} ${ny-26} ${probe.x+6} ${probe.tip-30}" fill="none" stroke="#7fbdd6" stroke-width="2.6" stroke-dasharray="8 5" stroke-dashoffset="${(-now/16%13).toFixed(1)}" opacity="${squirt.toFixed(2)}"/>`;
   for(let k=0;k<4;k++){const q=((now/520)+k/4)%1;b+=`<ellipse cx="${probe.x+(k%2?3:-3)}" cy="${(probe.tip+q*(g.beaker.bottom-26-probe.tip)).toFixed(1)}" rx="2" ry="3" fill="#7fbdd6" opacity="${(squirt*(1-q)).toFixed(2)}"/>`;}}
  b+=probeArt(probe.x,probe.tip,g);
  svg(b,buffer?'6홈판에 담긴 물과 완충 용액, 스포이트, pH 전극과 측정기':'세 염 수용액 비커와 pH 전극, 측정기',g.h,g.w);
  if(!actions.children.length)names.forEach((name,i)=>{const b=document.createElement('button');b.dataset.measure=name;b.textContent=labels[i]+' 측정';b.addEventListener('click',()=>measure(name));actions.append(b);});
  actions.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.measure===state.well)));
  const pending=phBusy()&&state.well;
  window.scienceScene.render(readout,metric('전극 상태',state.clean?'헹굼 완료':'시료가 묻어 있음')+metric('현재 측정',state.well?labels[names.indexOf(state.well)]:'시료 선택')+metric('pH',pending?'측정 중…':state.well&&state.measured[state.well]!==undefined?state.measured[state.well].toFixed(2):'—'));
  if(buffer){$('addAcid').disabled=state.acid>=20;$('addBase').disabled=state.base>=20;}
  note(state.clean?'헹군 전극으로 측정할 시료를 고르세요.':buffer?'같은 첨가량에서 물과 완충액을 비교하세요. A·D는 처음 상태를 유지합니다. 다른 홈으로 옮기기 전에 전극을 헹굽니다.':'짝산·짝염기가 물과 반응하는 정도를 비교하세요. 시료를 바꾸기 전에 전극을 헹굽니다.');
 }
 function beanDots(x,y,germinating){let b='';for(let i=0;i<12;i++){const xx=x-40+i%4*25,yy=y+Math.floor(i/4)*17;b+=`<ellipse cx="${xx}" cy="${yy}" rx="10" ry="6" fill="#b38b58"/>`;if(germinating)b+=path(`M${xx+8} ${yy}q10 -14 13 -6`,'#67994b',2);}return b;}
 function beanArt(x,y,rot,i,sprout,boiled){
  let s=`<g transform="rotate(${rot.toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"><ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${boiled?12:11}" ry="${boiled?8.5:7.5}" fill="${boiled?'#b98c55':'#d2ab6c'}" stroke="#9a7743" stroke-width="1"/><path d="M${(x-3).toFixed(1)} ${(y-6).toFixed(1)}q3 2 6 0" stroke="#7b5b31" stroke-width="1.3" fill="none"/>`;
  if(sprout){const len=8+rnd(i+5)*13,dir=rnd(i+9)>.5?1:-1,d=`M${(x+dir*9).toFixed(1)} ${y.toFixed(1)}q${(dir*len*.75).toFixed(1)} ${(-len*.1).toFixed(1)} ${(dir*len*.45).toFixed(1)} ${(-len*.8).toFixed(1)}`;s+=`<path d="${d}" fill="none" stroke="#a8956a" stroke-width="4.4" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#f6f0da" stroke-width="2.6" stroke-linecap="round"/>`;}
  return s+'</g>';
 }
 function beanPile(cx,bottom,perRow,sprouts,seed,boiled=false){let s='';const rows=[perRow,perRow-1,perRow-2];let i=0;rows.forEach((n,row)=>{for(let c=0;c<n;c++,i++){const x=cx-(n-1)*11.5+c*23+(rnd(i+seed)-.5)*6,y=bottom-10-row*13;s+=beanArt(x,y,(rnd(i*3+seed)-.5)*80,i+seed,sprouts&&rnd(i+seed+70)>.3,boiled);}});return s;}
 function jarArt(cx,f,germ){
  let s=`<path d="M${cx-62} 124Q${cx-74} 130 ${cx-74} 148V258Q${cx-74} 270 ${cx-62} 270H${cx+62}Q${cx+74} 270 ${cx+74} 258V148Q${cx+74} 130 ${cx+62} 124Z" fill="#f2f8fa" fill-opacity=".55" stroke="#86a9b7" stroke-width="2.4"/><path d="M${cx-64} 142V256" stroke="#fff" stroke-width="5" opacity=".7"/>`;
  s+=beanPile(cx,268,6,germ,germ?20:0);
  if(germ)for(let k=0;k<Math.round(26*f);k++){const side=rnd(k+40)>.5?1:-1,y=142+rnd(k+60)*78;s+=`<circle cx="${(cx+side*(58+rnd(k+80)*10)).toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.4+rnd(k+90)*1.8).toFixed(1)}" fill="#e6f3f7" stroke="#8fb7c6" stroke-width=".8"/>`;}
  s+=rect(cx-66,104,132,22,'#4f6672','rx="4"');for(let k=0;k<9;k++)s+=line(cx-56+k*14,107,cx-56+k*14,123,'#6c838e',1.2);
  return s;
 }
 function co2Probe(cx){let s=rect(cx-10,44,20,136,'#62747d','rx="5" stroke="#43555e" stroke-width="1.2"')+rect(cx-12,40,24,14,'#43555e','rx="4"');for(let k=0;k<4;k++)s+=rect(cx-7,148+k*7,14,3,'#a9bac2','rx="1"');return s;}
 function dewarArt(cx,live){
  let s=`<path d="M${cx-34} 100V112Q${cx-60} 118 ${cx-60} 142V258Q${cx-60} 272 ${cx-46} 272H${cx+46}Q${cx+60} 272 ${cx+60} 258V142Q${cx+60} 118 ${cx+34} 112V100Z" fill="url(#beanSteel)" stroke="#6b8290" stroke-width="1.8"/>`;
  s+=`<path d="M${cx-26} 102V122Q${cx-48} 126 ${cx-48} 146V252Q${cx-48} 262 ${cx-38} 262H${cx+38}Q${cx+48} 262 ${cx+48} 252V146Q${cx+48} 126 ${cx+26} 122V102Z" fill="#f7fafb" stroke="#9fb4bd" stroke-width="1.4"/><path d="M${cx-54} 146V254M${cx+54} 146V254" stroke="#dfe9ed" stroke-width="3" stroke-dasharray="2 5"/>`;
  s+=beanPile(cx,260,4,live,live?30:50,!live);
  s+=rect(cx-30,84,60,22,'#b88a5a','rx="4" stroke="#8b6338" stroke-width="1.2"');
  return s;
 }
 function drawBeans(){
  const mode=state.mode,r=M.beans(mode,state.time),f=clamp(state.time/500),time=mode==='heat'?(state.time/25).toFixed(1)+'분':Math.round(state.time)+'초';let b='';
  if(mode==='respirometer'){
   ['발아 콩 + 물','발아 콩 + KOH','마른 콩 + KOH'].forEach((label,i)=>{const y=75+i*95,f=[r.water,r.koh,r.dry][i];b+=rect(40,y-34,174,62,'#dcebef','rx="25" stroke="#698f9e"')+beanDots(102,y-17,i<2)+rect(181,y-26,11,46,i===0?'#b0d4df':'#ddb95f')+rect(211,y-33,17,60,'#54717e')+rect(228,y-5,337,10,'#d9e6eb','stroke="#698f9e"')+rect(532-165*f,y-7,10,14,'#394c90')+text(135,y+51,label,15);});
   b+=text(444,32,'잉크가 왼쪽으로 이동하면 내부 기체량 감소',15);svg(b,'세 호흡계의 물 또는 KOH와 잉크 방울 이동',355);
   window.scienceScene.render(readout,metric('경과 시간',time)+metric('발아 콩 + KOH',r.koh>0?'콩 쪽으로 이동':'초기 위치')+metric('발아 콩 + 물',r.water===0?'거의 이동 없음':'이동'));
  }else{
   const sensors=mode==='sensors',temps=sensors?[r.dry.temperature,r.germinating.temperature]:[r.living,r.boiled],labels=sensors?['마른 콩','발아 중인 콩']:['발아 중인 콩','삶은 콩'];
   b+='<defs><linearGradient id="beanSteel"><stop stop-color="#8fa4ae"/><stop offset=".4" stop-color="#eef3f5"/><stop offset="1" stop-color="#98adb6"/></linearGradient></defs>';
   b+=rect(0,272,640,8,'#efe8dc')+line(0,272,640,272,'#cbbda5',1.6);
   labels.forEach((label,i)=>{const x=160+320*i,live=sensors?i===1:i===0;
    if(sensors){b+=jarArt(x,f,live)+co2Probe(x+28)+thermo(x-26,30,240,temps[i],25,27,96,40,[25,26,27],1);
     b+=`<path d="M${x+28} 40C${x+28} 14 ${i?400:240} 22 ${i?378:262} 40" fill="none" stroke="#33454f" stroke-width="2.6"/>`;}
    else b+=dewarArt(x,live)+thermo(x-12,22,236,temps[i],25,28,78,30,[25,28],1);
    b+=`<text x="${x-(sensors?42:28)}" y="${sensors?70:60}" font-size="18" text-anchor="end" fill="#143541">${temps[i].toFixed(2)} ℃</text>`;
    b+=text(x,296,label,15);if(sensors)b+=text(x,320,(i?r.germinating.co2:r.dry.co2).toFixed(0)+' ppm CO₂',16,'#2f5562');
   });
   if(sensors)b+=rect(262,26,116,58,'#f4f7f8','rx="8" stroke="#6b8794" stroke-width="1.8"')+rect(272,34,96,26,'#d5e6d2','rx="3" stroke="#7f9a80"')+`<text x="362" y="53" font-size="15" text-anchor="end" fill="#22382a" font-family="Consolas,monospace">${Math.round(state.time)} s</text>`+(running?`<circle cx="282" cy="72" r="4" fill="#3f8a4f"/>`:'')+rect(300,68,60,6,'#c2ced3','rx="2"');
   const PT=362,PB=450,trace=(x,w,fn,min,max,color)=>{let d='';for(let t=0;t<=state.time;t+=5)d+=(d?'L':'M')+(x+w*t/500).toFixed(1)+' '+(PB-(fn(t)-min)/(max-min)*(PB-PT)).toFixed(1);return d?path(d,color,2.5,'stroke-linejoin="round"'):'';};
   const co2=sensors,plotWidth=co2?225:540;b+=text(co2?164:320,346,co2?'CO₂ / ppm':'온도 / ℃',16);
   for(const x of co2?[50,365]:[50])b+=line(x,PT,x,PB,'#8ba7b5',1)+line(x,PB,x+plotWidth,PB,'#8ba7b5',1)+text(x+plotWidth/2,PB+24,co2?'0 → 500초':'0 → 20분',14);
   b+=`<text x="44" y="${PT+5}" font-size="14" text-anchor="end" fill="#3d5662">${co2?'1300':'27'}</text><text x="44" y="${PB}" font-size="14" text-anchor="end" fill="#3d5662">${co2?'400':'25'}</text>`;
   b+=trace(50,plotWidth,t=>co2?M.beans(mode,t).dry.co2:M.beans(mode,t).living,co2?400:25,co2?1300:27,'#298b9c')+trace(50,plotWidth,t=>co2?M.beans(mode,t).germinating.co2:M.beans(mode,t).boiled,co2?400:25,co2?1300:27,'#c67636');
   if(co2)b+=text(475,346,'온도 / ℃',16)+`<text x="359" y="${PT+5}" font-size="14" text-anchor="end" fill="#3d5662">27</text><text x="359" y="${PB}" font-size="14" text-anchor="end" fill="#3d5662">25</text>`+trace(365,225,t=>M.beans(mode,t).dry.temperature,25,27,'#298b9c')+trace(365,225,t=>M.beans(mode,t).germinating.temperature,25,27,'#c67636');
   b+=text(320,PB+52,`파랑: ${labels[0]} · 주황: ${labels[1]}`,15);
   svg(b,sensors?'뚜껑을 닫은 두 병에 꽂은 CO₂ 센서와 온도계, 시간별 변화 그래프':'마개를 닫은 두 보온병 속 콩과 온도계, 시간별 온도 그래프',PB+64);window.scienceScene.render(readout,metric('경과 시간',time)+metric(labels[0],temps[0].toFixed(2)+' ℃')+metric(labels[1],temps[1].toFixed(2)+' ℃'));
  }
  $('startBeans').disabled=$('stepBeans').disabled=state.time>=500;$('startBeans').textContent=running?'일시 정지':'관찰 시작';
  note(state.time===0?'같은 양의 시료와 같은 초기 조건입니다. 관찰을 시작하세요.':mode==='respirometer'?'KOH가 CO₂를 흡수하는 조건과 흡수하지 않는 조건을 함께 비교하세요. 잉크 변화가 작다고 호흡이 없다고 단정할 수는 없습니다.':'각 시료의 상태를 비교하고, 기체와 열의 변화를 세포 호흡과 연결해 보세요. 표시 수치는 변화 방향을 관찰하는 모형값입니다.');
 }
 const draws={'gas-identification':drawGas,'sugar-phase':drawSugar,'hess-calorimetry':drawHess,'buffer-solution':drawPH,'salt-hydrolysis':drawPH,'bean-respiration':drawBeans};
 function draw(){draws[slug]();}
 function bind(id,fn){$(id)?.addEventListener('click',()=>{fn();draw();});}
 function reset(){stop();fx=null;cancelAnimationFrame(fxRaf);fxRaf=0;if(ph)cancelAnimationFrame(phRaf);phRaf=0;ph=null;state=JSON.parse(JSON.stringify(defaults[slug]));actions.replaceChildren();root.querySelectorAll('select,input[type=range]').forEach(e=>e.value=String(state[e.id]));draw();}
 root.querySelectorAll('select,input[type=range]').forEach(e=>e.addEventListener('input',()=>{
  const value=e.id==='sample'||e.id==='mode'?e.value:Number(e.value);
  if(e.id==='head'){state.head=value;state.read=false;draw();return;}
  stop(); // A new condition always starts with new samples.
  const selected=Array.from(root.querySelectorAll('select'),s=>[s.id,s.value]);reset();for(const[id,v]of selected){state[id]=['concentration','molality'].includes(id)?Number(v):v;$(id).value=v;}draw();
 }));
 bind('weighBefore',()=>{if(state.before)return;state.before=true;play('gasMove',1000,{from:false,to:true,moveEnd:1});});bind('collectGas',()=>{state.collected=true;play('gasMove',3800,{from:true,to:false,moveEnd:.24,collect:true});});bind('weighAfter',()=>{if(state.after)return;state.after=true;play('gasMove',1000,{from:false,to:true,moveEnd:1});});bind('equalize',()=>{if(state.head)play('head',1200,{from:state.head});state.head=0;state.read=false;$('head').value='0';});bind('readGas',()=>state.read=true);
 bind('dissolveSugar',()=>{if(state.prepared)return;state.prepared=true;play('sugarDissolve',2600);});bind('startTemperature',()=>run(5,500,250));bind('stepTemperature',()=>{stop();state.time=Math.min(500,state.time+50);});
 bind('dissolveNaOH',()=>{if(state.step!==0)return;state.step=1;play('hessA',2800,{mode:'dissolve',from:0});});bind('coolSolution',()=>{if(state.step!==1)return;state.step=2;play('hessA',1600,{mode:'cool',from:1});});bind('neutralize',()=>{if(state.step!==2)return;state.step=3;play('hessA',2800,{mode:'mix',from:2});});bind('directReaction',()=>{if(state.direct)return;state.direct=true;play('hessB',2800);});
 bind('rinseProbe',()=>{state.clean=true;state.well=null;rinses++;});
 bind('addAcid',()=>{state.acid++;delete state.measured.B;delete state.measured.E;state.well=null;});bind('addBase',()=>{state.base++;delete state.measured.C;delete state.measured.F;state.well=null;});
 bind('startBeans',()=>{state.started=true;run(5,500,100);});bind('stepBeans',()=>{stop();state.started=true;state.time=Math.min(500,state.time+100);});bind('resetExperiment',reset);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();draw();}});window.addEventListener('pagehide',stop);
 window.__chemistryLab={snapshot:()=>({slug,state:JSON.parse(JSON.stringify(state)),running})};reset();
})();
