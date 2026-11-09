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
 function drawGas(){
  const r=M.gas(state.sample,state.head),surface=205,inside=state.collected?surface-state.head*3:70;
  let b=rect(39,229,140,44,'#294e60','rx="8"')+rect(52,238,114,24,'#d7efdf')+text(110,256,state.after?r.after.toFixed(3)+' g':state.before?'150.000 g':'—',18);
  b+=rect(72,98,77,127,'#afc6ce','rx="12"')+rect(81,87,58,18,'#548194','rx="4"')+text(110,172,'기체 '+state.sample,16);
  b+=rect(291,surface,312,81,'#9dcce2')+path('M285 136V286H610V136')+path('M405 274V59Q405 48 418 48H495Q509 48 509 59V274');
  b+=rect(408,inside,98,275-inside,'#b5dcec')+line(408,inside,506,inside,'#276885',2)+path('M111 90V67H230V264H454V239','#657883',5);
  for(let i=0;i<6;i++)b+=line(409,80+i*27,420+(i%2?0:5),80+i*27,'#537a8a',1.5);
  if(state.collected)b+=text(460,105,'기체',18)+text(460,132,'+ 수증기',16);
  b+=text(121,304,'기체통과 저울',17)+text(453,317,'물 위에 모은 기체',17)+text(346,192,'바깥 수면',14);
  svg(b,'전자저울 위 기체통과 물속에 거꾸로 세운 눈금실린더');
  window.scienceScene.render(readout,metric('기체 질량',state.after?r.mass.toFixed(3)+' g':'전후 질량 필요')+metric('모은 기체 부피',state.read?(r.volume*1000).toFixed(1)+' mL':'아직 읽지 않음')+metric('건조 기체 압력',state.read?r.pressure.toFixed(2)+' kPa':'수면·수증기 확인')+(state.read&&state.after?metric('계산한 몰 질량',r.molar.toFixed(1)+' g/mol'):''));
  $('collectGas').disabled=!state.before||state.collected;$('weighAfter').disabled=!state.collected;$('equalize').disabled=$('readGas').disabled=!state.collected;
  $('head').disabled=!state.collected;$('headValue').textContent=state.head+' cm';
  note(!state.before?'기체를 모으기 전에 통의 질량을 먼저 측정하세요.':!state.collected?'통의 처음 질량을 확인했습니다. 기체를 물 위에 모으세요.':!state.after?'기체를 모았습니다. 같은 통의 질량을 다시 재어 감소량을 확인하세요.':!state.read?'안팎 수면 높이를 확인하고 부피·온도·압력을 읽으세요.':`25 ℃ = 298.15 K. 건조 기체 압력 = 101.3 − 3.17 − ${(.0980665*state.head).toFixed(2)} kPa. M=mRT/(PV)로 후보의 몰 질량과 비교하세요.`);
 }
 function graph(x,y,w,h,maxT,fn,color){let d='';for(let t=0;t<=state.time;t+=5){const v=fn(t),xx=x+w*t/maxT,yy=y+h-(v+5)/115*h;d+=(d?'L':'M')+xx.toFixed(1)+' '+yy.toFixed(1);}return path(d,color,2.5);}
 function drawSugar(){
  const a=M.sugar(0,state.mode,state.time),b=M.sugar(state.molality,state.mode,state.time),names={liquid:'액체',boiling:'끓는 중',freezing:'얼기 시작함'};
  let out='';[a,b].forEach((r,i)=>{const x=160+320*i;out+=beaker(x,80,i?'설탕물':'물',r.phase==='freezing'?'#d2e7f5':'#acd7e4',85,-15);out+=thermometer(x+28,45,r.temperature)+text(x,35,(state.prepared?r.temperature:20).toFixed(2)+' ℃',23);
   out+=rect(x-80,220,160,30,state.mode==='heat'?'#b16b43':'#6ea2c2','rx="5"')+text(x,241,state.mode==='heat'?'가열판':'얼음 + 소금',16,'white');
   if(state.prepared&&r.phase==='boiling')for(let k=0;k<7;k++)out+=`<circle cx="${x-42+(k*19)%87}" cy="${102+(k*23)%90}" r="${3+k%4}" fill="none" stroke="white" stroke-width="2"/>`;
   if(state.prepared&&r.phase==='freezing')out+=path(`M${x-30} 145l20 -10 18 16 20 -8 12 20`,'white',8);
  });
  out+=text(90,277,'온도 / ℃',15)+text(588,416,'시간 / s',15)+line(70,405,585,405,'#8ba7b5',1)+line(70,290,70,405,'#8ba7b5',1)+text(54,306,'100',13)+text(54,402,'0',13)+text(75,425,'0',13)+text(567,435,'500',13);
  if(state.prepared)out+=graph(70,290,500,110,500,t=>M.sugar(0,state.mode,t).temperature,'#298b9c')+graph(70,290,500,110,500,t=>M.sugar(state.molality,state.mode,t).temperature,'#c67636');
  svg(out,'물과 설탕물의 온도 센서 및 시간별 온도 곡선, 파랑은 물 주황은 설탕물',445);
  window.scienceScene.render(readout,metric('필요한 설탕',b.mass.toFixed(1)+' g')+metric('경과 시간',state.time+' s')+metric('물 / 설탕물',state.prepared?names[a.phase]+' / '+names[b.phase]:'용액 준비 전'));
  $('dissolveSugar').disabled=state.prepared;$('startTemperature').disabled=$('stepTemperature').disabled=!state.prepared||state.time>=500;$('startTemperature').textContent=running?'일시 정지':state.mode==='heat'?'가열 시작':'냉각 시작';
  note(!state.prepared?'선택한 농도에 필요한 설탕을 물 500 g에 모두 녹이세요.':state.time===0?'용액을 준비했습니다. 두 시료를 함께 가열하거나 냉각하세요.':`파랑: 물, 주황: 설탕물. ${state.mode==='heat'?'끓기':'얼기'} 시작하는 두 온도를 비교하세요. 상변화가 진행되는 설탕물의 온도가 순수한 물처럼 계속 일정하지는 않습니다.`);
 }
 function drawHess(){
  const dissolve=M.hess('dissolve'),neutral=M.hess('neutralize'),direct=M.hess('direct'),ta=state.step===1?dissolve.temperature:state.step===3?neutral.temperature:25,tb=state.direct?direct.temperature:25;
  let b=beaker(166,90,'A · 두 단계',undefined,state.step===3?95:55)+beaker(472,90,'B · 직접 반응',undefined,95)+thermometer(180,40,ta)+thermometer(486,40,tb)+text(166,30,ta.toFixed(2)+' ℃',23)+text(472,30,tb.toFixed(2)+' ℃',23);
  b+=text(166,280,['물 100 mL','NaOH 수용액 · 뜨거움','NaOH 수용액 · 식힘','NaCl 수용액'][state.step],16)+text(472,280,state.direct?'NaCl 수용액':'물 100 mL + 염산 100 mL',16);
  b+=text(166,314,state.step===0?'NaOH(s) 4.0 g 준비':state.step===1?'먼저 실온으로 식히세요':state.step===2?'염산 100 mL 첨가 가능':'두 번째 반응 끝',16)+text(472,314,state.direct?'직접 반응 끝':'NaOH(s) 4.0 g 준비',16);
  svg(b,'두 단계 경로와 직접 경로의 열량계 및 온도계');
  $('dissolveNaOH').disabled=state.step!==0;$('coolSolution').disabled=state.step!==1;$('neutralize').disabled=state.step!==2;$('directReaction').disabled=state.direct;
  window.scienceScene.render(readout,metric('A① 용해 · 방출 열',state.step>0?dissolve.q.toFixed(2)+' kJ':'아직 반응 전')+metric('A③ 중화 · 방출 열',state.step===3?neutral.q.toFixed(2)+' kJ':'아직 반응 전')+metric('B 직접 · 방출 열',state.direct?direct.q.toFixed(2)+' kJ':'아직 반응 전'));
  note(state.step===3&&state.direct?'4.45 + 5.73 = 10.18 kJ. 같은 0.10 mol을 반응시키면 두 단계의 합과 직접 경로의 방출 열이 같습니다. 용액 질량이 다르므로 온도 상승 자체를 더하지 않습니다.':state.step===1?'용해열로 온도가 올라갔습니다. 이 용액을 실온으로 식힌 뒤 같은 온도의 염산을 섞어 다음 반응의 온도 변화를 확인하세요.':'각 단계에서 반응 전후 온도를 비교합니다. A의 중화는 용해시킨 용액을 식힌 뒤에 진행합니다.');
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
 function drawBeans(){
  const mode=state.mode,r=M.beans(mode,state.time),time=mode==='heat'?(state.time/25).toFixed(1)+'분':Math.round(state.time)+'초';let b='';
  if(mode==='respirometer'){
   ['발아 콩 + 물','발아 콩 + KOH','마른 콩 + KOH'].forEach((label,i)=>{const y=75+i*95,f=[r.water,r.koh,r.dry][i];b+=rect(40,y-34,174,62,'#dcebef','rx="25" stroke="#698f9e"')+beanDots(102,y-17,i<2)+rect(181,y-26,11,46,i===0?'#b0d4df':'#ddb95f')+rect(211,y-33,17,60,'#54717e')+rect(228,y-5,337,10,'#d9e6eb','stroke="#698f9e"')+rect(532-165*f,y-7,10,14,'#394c90')+text(135,y+51,label,15);});
   b+=text(444,32,'잉크가 왼쪽으로 이동하면 내부 기체량 감소',15);svg(b,'세 호흡계의 물 또는 KOH와 잉크 방울 이동',355);
   window.scienceScene.render(readout,metric('경과 시간',time)+metric('발아 콩 + KOH',r.koh>0?'콩 쪽으로 이동':'초기 위치')+metric('발아 콩 + 물',r.water===0?'거의 이동 없음':'이동'));
  }else{
   const temps=mode==='sensors'?[r.dry.temperature,r.germinating.temperature]:[r.living,r.boiled],labels=mode==='sensors'?['마른 콩','발아 중인 콩']:['발아 중인 콩','삶은 콩'];
   labels.forEach((label,i)=>{const x=160+320*i;b+=beaker(x,90,label,'#e9f1f0',95)+beanDots(x,175,mode==='sensors'?i===1:i===0)+rect(x-72,108,12,106,'#d5dfdf')+rect(x+60,108,12,106,'#d5dfdf')+thermometer(x+25,53,temps[i])+text(x,35,temps[i].toFixed(2)+' ℃',23);if(mode==='sensors')b+=text(x,283,(i?r.germinating.co2:r.dry.co2).toFixed(0)+' ppm CO₂',20);});
   const trace=(x,w,fn,min,max,color)=>{let d='';for(let t=0;t<=state.time;t+=5)d+=(d?'L':'M')+(x+w*t/500).toFixed(1)+' '+(425-(fn(t)-min)/(max-min)*90).toFixed(1);return path(d,color,2.5);};
   const co2=mode==='sensors',plotWidth=co2?225:540;b+=text(co2?164:320,320,co2?'CO₂ / ppm':'온도 / ℃',16);
   for(const x of co2?[50,365]:[50])b+=line(x,335,x,425,'#8ba7b5',1)+line(x,425,x+plotWidth,425,'#8ba7b5',1)+text(x+plotWidth/2,449,co2?'0 → 500초':'0 → 20분',14);
   b+=text(28,342,co2?'1300':'27',13)+text(28,425,co2?'400':'25',13);
   b+=trace(50,plotWidth,t=>co2?M.beans(mode,t).dry.co2:M.beans(mode,t).living,co2?400:25,co2?1300:27,'#298b9c')+trace(50,plotWidth,t=>co2?M.beans(mode,t).germinating.co2:M.beans(mode,t).boiled,co2?400:25,co2?1300:27,'#c67636');
   if(co2)b+=text(475,320,'온도 / ℃',16)+text(340,342,'27',13)+text(340,425,'25',13)+trace(365,225,t=>M.beans(mode,t).dry.temperature,25,27,'#298b9c')+trace(365,225,t=>M.beans(mode,t).germinating.temperature,25,27,'#c67636');
   b+=text(320,475,`파랑: ${labels[0]} · 주황: ${labels[1]}`,16);
   svg(b,'같은 양의 콩을 담은 단열 용기와 센서의 시간별 변화',495);window.scienceScene.render(readout,metric('경과 시간',time)+metric(labels[0],temps[0].toFixed(2)+' ℃')+metric(labels[1],temps[1].toFixed(2)+' ℃'));
  }
  $('startBeans').disabled=$('stepBeans').disabled=state.time>=500;$('startBeans').textContent=running?'일시 정지':'관찰 시작';
  note(state.time===0?'같은 양의 시료와 같은 초기 조건입니다. 관찰을 시작하세요.':mode==='respirometer'?'KOH가 CO₂를 흡수하는 조건과 흡수하지 않는 조건을 함께 비교하세요. 잉크 변화가 작다고 호흡이 없다고 단정할 수는 없습니다.':'각 시료의 상태를 비교하고, 기체와 열의 변화를 세포 호흡과 연결해 보세요. 표시 수치는 변화 방향을 관찰하는 모형값입니다.');
 }
 const draws={'gas-identification':drawGas,'sugar-phase':drawSugar,'hess-calorimetry':drawHess,'buffer-solution':drawPH,'salt-hydrolysis':drawPH,'bean-respiration':drawBeans};
 function draw(){draws[slug]();}
 function bind(id,fn){$(id)?.addEventListener('click',()=>{fn();draw();});}
 function reset(){stop();if(ph)cancelAnimationFrame(phRaf);phRaf=0;ph=null;state=JSON.parse(JSON.stringify(defaults[slug]));actions.replaceChildren();root.querySelectorAll('select,input[type=range]').forEach(e=>e.value=String(state[e.id]));draw();}
 root.querySelectorAll('select,input[type=range]').forEach(e=>e.addEventListener('input',()=>{
  const value=e.id==='sample'||e.id==='mode'?e.value:Number(e.value);
  if(e.id==='head'){state.head=value;state.read=false;draw();return;}
  stop(); // A new condition always starts with new samples.
  const selected=Array.from(root.querySelectorAll('select'),s=>[s.id,s.value]);reset();for(const[id,v]of selected){state[id]=['concentration','molality'].includes(id)?Number(v):v;$(id).value=v;}draw();
 }));
 bind('weighBefore',()=>state.before=true);bind('collectGas',()=>state.collected=true);bind('weighAfter',()=>state.after=true);bind('equalize',()=>{state.head=0;state.read=false;$('head').value='0';});bind('readGas',()=>state.read=true);
 bind('dissolveSugar',()=>state.prepared=true);bind('startTemperature',()=>run(5,500,250));bind('stepTemperature',()=>{stop();state.time=Math.min(500,state.time+50);});
 bind('dissolveNaOH',()=>state.step=1);bind('coolSolution',()=>state.step=2);bind('neutralize',()=>state.step=3);bind('directReaction',()=>state.direct=true);
 bind('rinseProbe',()=>{state.clean=true;state.well=null;rinses++;});
 bind('addAcid',()=>{state.acid++;delete state.measured.B;delete state.measured.E;state.well=null;});bind('addBase',()=>{state.base++;delete state.measured.C;delete state.measured.F;state.well=null;});
 bind('startBeans',()=>{state.started=true;run(5,500,100);});bind('stepBeans',()=>{stop();state.started=true;state.time=Math.min(500,state.time+100);});bind('resetExperiment',reset);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();draw();}});window.addEventListener('pagehide',stop);
 window.__chemistryLab={snapshot:()=>({slug,state:JSON.parse(JSON.stringify(state)),running})};reset();
})();
