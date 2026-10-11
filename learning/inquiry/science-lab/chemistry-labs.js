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
 function svg(body,label,h=340){scene.innerHTML=`<svg viewBox="0 0 640 ${h}" role="img" aria-label="${label}">${body}</svg>`;}
 function note(s){if(status.textContent!==s)status.textContent=s;}
 function stop(){clearInterval(timer);timer=0;running=false;}
 function run(step,max,dt=100){if(running){stop();draw();return;}running=true;timer=setInterval(()=>{state.time=Math.min(max,state.time+step);if(state.time>=max)stop();draw();},dt);}
 function beaker(x,y,label,liquid='#afd5e5',level=85){return rect(x-61,y+120-level,122,level,liquid)+path(`M${x-65} ${y}V${y+120}Q${x-65} ${y+130} ${x-55} ${y+130}H${x+55}Q${x+65} ${y+130} ${x+65} ${y+120}V${y}`)+text(x,y+160,label);}
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
  readout.innerHTML=metric('기체 질량',state.after?r.mass.toFixed(3)+' g':'전후 질량 필요')+metric('모은 기체 부피',state.read?(r.volume*1000).toFixed(1)+' mL':'아직 읽지 않음')+metric('건조 기체 압력',state.read?r.pressure.toFixed(2)+' kPa':'수면·수증기 확인')+(state.read&&state.after?metric('계산한 몰 질량',r.molar.toFixed(1)+' g/mol'):'');
  $('collectGas').disabled=!state.before||state.collected;$('weighAfter').disabled=!state.collected;$('equalize').disabled=$('readGas').disabled=!state.collected;
  $('head').disabled=!state.collected;$('headValue').textContent=state.head+' cm';
  note(!state.before?'기체를 모으기 전에 통의 질량을 먼저 측정하세요.':!state.collected?'통의 처음 질량을 확인했습니다. 기체를 물 위에 모으세요.':!state.after?'기체를 모았습니다. 같은 통의 질량을 다시 재어 감소량을 확인하세요.':!state.read?'안팎 수면 높이를 확인하고 부피·온도·압력을 읽으세요.':`25 ℃ = 298.15 K. 건조 기체 압력 = 101.3 − 3.17 − ${(.0980665*state.head).toFixed(2)} kPa. M=mRT/(PV)로 후보의 몰 질량과 비교하세요.`);
 }
 function graph(x,y,w,h,maxT,fn,color){let d='';for(let t=0;t<=state.time;t+=5){const v=fn(t),xx=x+w*t/maxT,yy=y+h-(v+5)/115*h;d+=(d?'L':'M')+xx.toFixed(1)+' '+yy.toFixed(1);}return path(d,color,2.5);}
 function drawSugar(){
  const a=M.sugar(0,state.mode,state.time),b=M.sugar(state.molality,state.mode,state.time),names={liquid:'액체',boiling:'끓는 중',freezing:'얼기 시작함'};
  let out='';[a,b].forEach((r,i)=>{const x=160+320*i;out+=beaker(x,80,i?'설탕물':'물',r.phase==='freezing'?'#d2e7f5':'#acd7e4');out+=thermometer(x+28,45,r.temperature)+text(x,35,(state.prepared?r.temperature:20).toFixed(2)+' ℃',23);
   out+=rect(x-80,220,160,30,state.mode==='heat'?'#b16b43':'#6ea2c2','rx="5"')+text(x,241,state.mode==='heat'?'가열판':'얼음 + 소금',16,'white');
   if(state.prepared&&r.phase==='boiling')for(let k=0;k<7;k++)out+=`<circle cx="${x-42+(k*19)%87}" cy="${102+(k*23)%90}" r="${3+k%4}" fill="none" stroke="white" stroke-width="2"/>`;
   if(state.prepared&&r.phase==='freezing')out+=path(`M${x-30} 145l20 -10 18 16 20 -8 12 20`,'white',8);
  });
  out+=text(90,303,'온도 / ℃',15)+text(588,416,'시간 / s',15)+line(70,405,585,405,'#8ba7b5',1)+line(70,290,70,405,'#8ba7b5',1)+text(54,306,'100',13)+text(54,402,'0',13)+text(75,425,'0',13)+text(567,435,'500',13);
  if(state.prepared)out+=graph(70,290,500,110,500,t=>M.sugar(0,state.mode,t).temperature,'#298b9c')+graph(70,290,500,110,500,t=>M.sugar(state.molality,state.mode,t).temperature,'#c67636');
  svg(out,'물과 설탕물의 온도 센서 및 시간별 온도 곡선, 파랑은 물 주황은 설탕물',445);
  readout.innerHTML=metric('필요한 설탕',b.mass.toFixed(1)+' g')+metric('경과 시간',state.time+' s')+metric('물 / 설탕물',state.prepared?names[a.phase]+' / '+names[b.phase]:'용액 준비 전');
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
  readout.innerHTML=metric('A① 용해 · 방출 열',state.step>0?dissolve.q.toFixed(2)+' kJ':'아직 반응 전')+metric('A③ 중화 · 방출 열',state.step===3?neutral.q.toFixed(2)+' kJ':'아직 반응 전')+metric('B 직접 · 방출 열',state.direct?direct.q.toFixed(2)+' kJ':'아직 반응 전');
  note(state.step===3&&state.direct?'4.45 + 5.73 = 10.18 kJ. 같은 0.10 mol을 반응시키면 두 단계의 합과 직접 경로의 방출 열이 같습니다. 용액 질량이 다르므로 온도 상승 자체를 더하지 않습니다.':state.step===1?'용해열로 온도가 올라갔습니다. 이 용액을 실온으로 식힌 뒤 같은 온도의 염산을 섞어 다음 반응의 온도 변화를 확인하세요.':'각 단계에서 반응 전후 온도를 비교합니다. A의 중화는 용해시킨 용액을 식힌 뒤에 진행합니다.');
 }
 function measure(name){if(!state.clean&&state.well!==name){note('이전 용액이 묻어 있습니다. 전극을 헹군 뒤 다른 시료를 측정하세요.');return;}
  const p=slug==='buffer-solution'?M.buffer(name,'BE'.includes(name)?state.acid:'CF'.includes(name)?state.base:0):M.salt(name,state.concentration);
  state.well=name;state.clean=false;state.measured[name]=p;draw();
 }
 function drawPH(){
  const buffer=slug==='buffer-solution',names=buffer?['A','B','C','D','E','F']:['NH4Cl','NaCN','NaCl'],labels=buffer?['A 물 · 기준','B 물 + 산','C 물 + 염기','D 완충액 · 기준','E 완충액 + 산','F 완충액 + 염기']:['NH₄Cl','NaCN','NaCl'];
  let b='';names.forEach((name,i)=>{const x=105+i%3*210,y=buffer?(i<3?85:235):140,p=state.measured[name];
   b+=`<ellipse cx="${x}" cy="${y}" rx="70" ry="43" fill="#b9dbe8" stroke="${state.well===name?'#176878':'#87acbd'}" stroke-width="${state.well===name?5:2}"/>`+text(x,y+7,p===undefined?'미측정':'pH '+p.toFixed(2),20)+text(x,y+68,labels[i],16);
   if(buffer)b+=text(x,y-56,i%3===0?'첨가 없음':(i%3===1?state.acid:state.base)+'방울',14);
  });svg(b,buffer?'물과 완충 용액의 기준·산 첨가·염기 첨가 6홈판':'세 염 수용액의 pH 비교',buffer?340:270);
  if(!actions.children.length)names.forEach((name,i)=>{const b=document.createElement('button');b.dataset.measure=name;b.textContent=labels[i]+' 측정';b.addEventListener('click',()=>measure(name));actions.append(b);});
  actions.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.measure===state.well)));
  readout.innerHTML=metric('전극 상태',state.clean?'헹굼 완료':'시료가 묻어 있음')+metric('현재 측정',state.well?labels[names.indexOf(state.well)]:'시료 선택')+metric('pH',state.well&&state.measured[state.well]!==undefined?state.measured[state.well].toFixed(2):'—');
  if(buffer){$('addAcid').disabled=state.acid>=20;$('addBase').disabled=state.base>=20;}
  note(state.clean?'헹군 전극으로 측정할 시료를 고르세요.':buffer?'같은 첨가량에서 물과 완충액을 비교하세요. A·D는 처음 상태를 유지합니다. 다른 홈으로 옮기기 전에 전극을 헹굽니다.':'짝산·짝염기가 물과 반응하는 정도를 비교하세요. 시료를 바꾸기 전에 전극을 헹굽니다.');
 }
 function beanDots(x,y,germinating){let b='';for(let i=0;i<12;i++){const xx=x-40+i%4*25,yy=y+Math.floor(i/4)*17;b+=`<ellipse cx="${xx}" cy="${yy}" rx="10" ry="6" fill="#b38b58"/>`;if(germinating)b+=path(`M${xx+8} ${yy}q10 -14 13 -6`,'#67994b',2);}return b;}
 function drawBeans(){
  const mode=state.mode,r=M.beans(mode,state.time),time=mode==='heat'?(state.time/25).toFixed(1)+'분':state.time+'초';let b='';
  if(mode==='respirometer'){
   ['발아 콩 + 물','발아 콩 + KOH','마른 콩 + KOH'].forEach((label,i)=>{const y=75+i*95,f=[r.water,r.koh,r.dry][i];b+=rect(40,y-34,174,62,'#dcebef','rx="25" stroke="#698f9e"')+beanDots(102,y-17,i<2)+rect(181,y-26,11,46,i===0?'#b0d4df':'#ddb95f')+rect(211,y-33,17,60,'#54717e')+rect(228,y-5,337,10,'#d9e6eb','stroke="#698f9e"')+rect(532-165*f,y-7,10,14,'#394c90')+text(135,y+51,label,15);});
   b+=text(444,32,'잉크가 왼쪽으로 이동하면 내부 기체량 감소',15);svg(b,'세 호흡계의 물 또는 KOH와 잉크 방울 이동',355);
   readout.innerHTML=metric('경과 시간',time)+metric('발아 콩 + KOH',r.koh>0?'콩 쪽으로 이동':'초기 위치')+metric('발아 콩 + 물',r.water===0?'거의 이동 없음':'이동');
  }else{
   const temps=mode==='sensors'?[r.dry.temperature,r.germinating.temperature]:[r.living,r.boiled],labels=mode==='sensors'?['마른 콩','발아 중인 콩']:['발아 중인 콩','삶은 콩'];
   labels.forEach((label,i)=>{const x=160+320*i;b+=beaker(x,90,label,'#e9f1f0',95)+beanDots(x,175,mode==='sensors'?i===1:i===0)+rect(x-72,108,12,106,'#d5dfdf')+rect(x+60,108,12,106,'#d5dfdf')+thermometer(x+25,53,temps[i])+text(x,35,temps[i].toFixed(2)+' ℃',23);if(mode==='sensors')b+=text(x,283,(i?r.germinating.co2:r.dry.co2).toFixed(0)+' ppm CO₂',20);});
   const trace=(x,w,fn,min,max,color)=>{let d='';for(let t=0;t<=state.time;t+=5)d+=(d?'L':'M')+(x+w*t/500).toFixed(1)+' '+(425-(fn(t)-min)/(max-min)*90).toFixed(1);return path(d,color,2.5);};
   const co2=mode==='sensors';b+=text(164,320,co2?'CO₂ / ppm':'온도 / ℃',16)+text(475,320,'온도 / ℃',16);
   for(const x of [50,365])b+=line(x,335,x,425,'#8ba7b5',1)+line(x,425,x+225,425,'#8ba7b5',1)+text(x+110,449,mode==='heat'?'0 → 20분':'0 → 500초',14);
   b+=text(28,342,co2?'1300':'27',13)+text(28,425,co2?'400':'25',13)+text(340,342,'27',13)+text(340,425,'25',13);
   b+=trace(50,225,t=>co2?M.beans(mode,t).dry.co2:M.beans(mode,t).living,co2?400:25,co2?1300:27,'#298b9c')+trace(50,225,t=>co2?M.beans(mode,t).germinating.co2:M.beans(mode,t).boiled,co2?400:25,co2?1300:27,'#c67636');
   b+=trace(365,225,t=>co2?M.beans(mode,t).dry.temperature:M.beans(mode,t).living,25,27,'#298b9c')+trace(365,225,t=>co2?M.beans(mode,t).germinating.temperature:M.beans(mode,t).boiled,25,27,'#c67636');
   b+=text(320,475,`파랑: ${labels[0]} · 주황: ${labels[1]}`,16);
   svg(b,'같은 양의 콩을 담은 단열 용기와 센서의 시간별 변화',495);readout.innerHTML=metric('경과 시간',time)+metric(labels[0],temps[0].toFixed(2)+' ℃')+metric(labels[1],temps[1].toFixed(2)+' ℃');
  }
  $('startBeans').disabled=$('stepBeans').disabled=state.time>=500;$('startBeans').textContent=running?'일시 정지':'관찰 시작';
  note(state.time===0?'같은 양의 시료와 같은 초기 조건입니다. 관찰을 시작하세요.':mode==='respirometer'?'KOH가 CO₂를 흡수하는 조건과 흡수하지 않는 조건을 함께 비교하세요. 잉크 변화가 작다고 호흡이 없다고 단정할 수는 없습니다.':'각 시료의 상태를 비교하고, 기체와 열의 변화를 세포 호흡과 연결해 보세요. 표시 수치는 변화 방향을 관찰하는 모형값입니다.');
 }
 const draws={'gas-identification':drawGas,'sugar-phase':drawSugar,'hess-calorimetry':drawHess,'buffer-solution':drawPH,'salt-hydrolysis':drawPH,'bean-respiration':drawBeans};
 function draw(){draws[slug]();}
 function bind(id,fn){$(id)?.addEventListener('click',()=>{fn();draw();});}
 function reset(){stop();state=JSON.parse(JSON.stringify(defaults[slug]));actions.replaceChildren();root.querySelectorAll('select,input[type=range]').forEach(e=>e.value=String(state[e.id]));draw();}
 root.querySelectorAll('select,input[type=range]').forEach(e=>e.addEventListener('input',()=>{
  const value=e.id==='sample'||e.id==='mode'?e.value:Number(e.value);
  if(e.id==='head'){state.head=value;state.read=false;draw();return;}
  stop(); // A new condition always starts with new samples.
  const selected=Array.from(root.querySelectorAll('select'),s=>[s.id,s.value]);reset();for(const[id,v]of selected){state[id]=['concentration','molality'].includes(id)?Number(v):v;$(id).value=v;}draw();
 }));
 bind('weighBefore',()=>state.before=true);bind('collectGas',()=>state.collected=true);bind('weighAfter',()=>state.after=true);bind('equalize',()=>{state.head=0;state.read=false;$('head').value='0';});bind('readGas',()=>state.read=true);
 bind('dissolveSugar',()=>state.prepared=true);bind('startTemperature',()=>run(5,500,250));bind('stepTemperature',()=>{stop();state.time=Math.min(500,state.time+50);});
 bind('dissolveNaOH',()=>state.step=1);bind('coolSolution',()=>state.step=2);bind('neutralize',()=>state.step=3);bind('directReaction',()=>state.direct=true);
 bind('rinseProbe',()=>{state.clean=true;state.well=null;});
 bind('addAcid',()=>{state.acid++;delete state.measured.B;delete state.measured.E;state.well=null;});bind('addBase',()=>{state.base++;delete state.measured.C;delete state.measured.F;state.well=null;});
 bind('startBeans',()=>{state.started=true;run(5,500,100);});bind('stepBeans',()=>{stop();state.started=true;state.time=Math.min(500,state.time+100);});bind('resetExperiment',reset);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();draw();}});window.addEventListener('pagehide',stop);
 window.__chemistryLab={snapshot:()=>({slug,state:JSON.parse(JSON.stringify(state)),running})};reset();
})();
