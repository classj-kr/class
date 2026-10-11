(function(){
 'use strict';
 const root=document.querySelector('[data-physics]');if(!root)return;
 const slug=root.dataset.physics,M=window.sciencePhysics,$=id=>document.getElementById(id),scene=$('physicsScene'),readout=$('physicsReadout'),status=$('physicsStatus');
 let state={},running=false,elapsed=0,last=0,frame=0,audio=null,oscillator=null,gain=null,audioTimer=0,hits=[],rng=M.random(8123);
 const defaults={
  'speaker-lab':{magnet:false,stripped:false,connected:false,playing:false,turns:30,frequency:220},
  'wireless-power':{signal:'ac',distance:1,angle:0,power:false},
  'magnetic-brake':{plate:'copper',height:1,started:false},
  'transistor-speaker':{mode:'direct',amplitude:.08,supply:3,power:false,playing:false},
  'soap-film':{light:'white',sample:50,formed:false},
  polarization:{source:'A',angle:0,filter:false},
  'electron-slits':{slits:'two',spacing:2,pathKnown:false}
 };
 const text=(x,y,s,fill='#143541',size=18)=>`<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" text-anchor="middle">${s}</text>`;
 const line=(x1,y1,x2,y2,color='#537785',width=3,extra='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" ${extra}/>`;
 const path=(d,color,width=3,extra='')=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" ${extra}/>`;
 const rect=(x,y,w,h,fill,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
 function svg(body,label,height=340){scene.innerHTML=`<svg viewBox="0 0 640 ${height}" role="img" aria-label="${label}"><defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#22798b"/></marker></defs>${body}</svg>`;}
 const metric=(label,value)=>`<div><span>${label}</span><strong>${value}</strong></div>`;
 function setStatus(value){if(status.textContent!==value)status.textContent=value;}
 function pressed(id,on,onLabel,offLabel){const b=$(id);if(!b)return;b.setAttribute('aria-pressed',String(on));if(onLabel)b.textContent=on?onLabel:offLabel;}
 function curve(fn,x,y,w,h,color){let d='';for(let i=0;i<=180;i++){const t=i/180;d+=(i?'L':'M')+(x+w*t).toFixed(2)+' '+(y-h*fn(t)).toFixed(2)+' ';}return path(d,color,2.5);}
 function stopSound(){if(oscillator){oscillator.stop();oscillator.disconnect();oscillator=null;}clearTimeout(audioTimer);pressed('referenceSound',false,'참고음 끄기','참고음 듣기');}
 async function sound(){if(oscillator){stopSound();return;}if(!M.speaker(state).connected){setStatus('스피커를 조립하고 신호를 먼저 보내세요.');return;}try{audio||=new(window.AudioContext||window.webkitAudioContext)();await audio.resume();oscillator=audio.createOscillator();gain=audio.createGain();gain.gain.value=.035;oscillator.frequency.value=state.frequency;oscillator.connect(gain).connect(audio.destination);oscillator.start();pressed('referenceSound',true,'참고음 끄기','참고음 듣기');audioTimer=setTimeout(stopSound,5000);}catch{setStatus('이 브라우저에서는 참고음을 재생할 수 없습니다. 진동은 화면에서 관찰할 수 있습니다.');}}
 function drawSpeaker(){
  const r=M.speaker(state,elapsed*5*state.frequency/220),dx=r.displacement;
  let b=text(135,45,'종이컵 · 고정')+text(450,45,'종이컵 · 진동판');
  b+=path('M120 110L270 80L270 250L120 220Z','#6593a2',5)+path(`M270 80L${450+dx} 110L${450+dx} 220L270 250Z`,'#6593a2',5);
  if(state.magnet)b+=rect(115,137,70,28,'#c85b51')+rect(115,165,70,28,'#467cab')+text(148,158,'N','white',18)+text(148,187,'S','white',18);
  b+=`<g transform="translate(${dx} 0)">`+path('M430 125L410 140L430 151L410 163L430 175L410 186L430 202','#b27030',7)+line(448,109,448,222,'#176878',7)+'</g>';
  b+=path(`M420 198L420 280L530 280L530 237M420 129L490 129L490 280L560 280L560 237`,state.stripped?'#bb7434':'#727b83',3,state.connected?'':'stroke-dasharray="7 7"');
  b+=rect(500,183,85,58,'#284653','rx="8"')+text(542,206,'音','white',21)+text(542,227,state.playing?'ON':'OFF','white',14);
  if(r.connected)b+=path(`M${465+dx} 135Q${495+dx} 164 ${465+dx} 197`,'#df9b30',3)+path(`M${477+dx} 120Q${520+dx} 163 ${477+dx} 212`,'#df9b30',2);
  b+=text(145,310,state.magnet?'자석 부착됨':'자석 없음')+text(400,310,`${state.turns}회 감은 코일`);
  svg(b,'자석과 코일이 붙은 두 종이컵의 단면 및 오디오 연결');
  readout.innerHTML=metric('전류 경로',state.stripped&&state.connected?'연결됨':'끊어짐')+metric('신호 주파수',state.frequency+' Hz')+metric('진동판',r.connected?'왕복 진동':'정지');
  setStatus(!state.playing?'장치를 조립하고 신호를 보내 보세요.':r.connected?'전류 방향이 바뀌며 코일과 진동판이 앞뒤로 움직입니다.':!state.magnet?'자석이 없는 상태입니다. 자석을 붙이고 변화를 비교하세요.':!state.stripped?'전선 끝의 피복 때문에 전기적 접촉이 되지 않았습니다.':'오디오 출력과 코일을 연결하세요.');
  ['magnet','stripped','connected'].forEach((id,i)=>pressed(id,state[id],[ '① 자석 떼기','② 전선 끝 절연하기','③ 연결 끊기'][i],['① 자석 붙이기','② 전선 끝 피복 벗기기','③ 오디오 출력 연결'][i]));
  pressed('playSignal',state.playing,'신호 멈추기','신호 보내기');
 }
 function drawWireless(){
  const r=M.wireless(state,elapsed*5),rx=300+state.distance*22,cos=Math.cos(state.angle*Math.PI/180);
  let b=rect(35,120,105,65,'#234f5f','rx="10"')+text(88,150,state.signal==='ac'?'교류 ~':'직류 ⎓','white',21)+text(88,174,state.power?'ON':'OFF','white',16);
  b+=path('M140 137H212V75M140 169H212V229','#b57334',4);
  for(let i=0;i<7;i++)b+=`<ellipse cx="${205+i*3}" cy="152" rx="27" ry="${62-i*3}" fill="none" stroke="#b57334" stroke-width="3"/>`;
  if(state.power)for(let i=-2;i<=2;i++)b+=path(`M228 ${151+i*12}Q${(228+rx)/2} ${70+i*34} ${rx} ${151+i*12}`,'#2c9aad',2,`opacity="${state.signal==='ac'?.35+.6*Math.abs(Math.sin(elapsed*5)):.7}"`);
  for(let i=0;i<6;i++)b+=`<ellipse cx="${rx+i*2}" cy="152" rx="${10+45*(1-cos)}" ry="${55-i*3}" fill="none" stroke="#176878" stroke-width="3"/>`;
  b+=path(`M${rx} 96V70H590V213H${rx}V207`,'#176878',3)+`<circle cx="590" cy="146" r="17" fill="${r.led?'#ffda55':'#9dacb3'}" stroke="#59747f" stroke-width="3"/>`;
  b+=text(214,253,'송신 코일')+text(rx,253,'수신 코일')+text(568,45,'LED',undefined,18);
  b+=line(50,302,590,302,'#aac1cd',1)+curve(t=>state.power&&state.signal==='ac'?Math.cos(t*Math.PI*6)*r.peak/3.8:0,50,302,540,22,'#176878');
  svg(b,'분리된 송신 회로와 수신 코일·발광 다이오드, 수신 전압 파형');
  readout.innerHTML=metric('수신 전압 진폭',r.peak.toFixed(3)+' V')+metric('발광 다이오드',r.led?'켜짐':'꺼짐')+metric('거리 / 각도',`${state.distance} cm / ${state.angle}°`);
  setStatus(!state.power?'전원을 켜고 두 코일 사이의 거리와 방향을 바꾸어 보세요.':state.signal==='dc'?'일정한 직류를 유지하는 동안에는 수신 파형이 평평합니다. 켜고 끄는 순간의 유도는 이 화면에 포함하지 않습니다.':r.led?'수신 코일의 전압으로 발광 다이오드가 켜졌습니다. 거리와 방향을 바꾸어 비교하세요.':'교류를 보내고 있습니다. 발광 여부와 수신 전압 값을 함께 확인하세요.');
  pressed('power',state.power,'전원 끄기','전원 켜기');
 }
 function drawBrake(){
  const gamma=state.plate==='copper'?12:0,a=M.fall(elapsed,{height:state.height,gamma}),b=M.fall(elapsed,{height:state.height});
  let out='';[a,b].forEach((v,i)=>{const x=180+i*280,y=80+v.y/state.height*200;out+=text(x,34,i?'알루미늄 조각':'네오디뮴 자석');out+=rect(x-65,58,20,235,state.plate==='copper'?'#bc865d':'#d2dbe0')+rect(x+45,58,20,235,state.plate==='copper'?'#bc865d':'#d2dbe0');out+=rect(x-28,y-12,56,24,i?'#a8b9c1':'#bb524b','rx="3"');if(!i)out+=text(x,y+6,'N  S','white',16);out+=rect(x-75,299,150,12,'#8b9caa');if(!i&&gamma&&v.v>0)out+=line(x+12,y-18,x+12,y-51,'#22798b',3,'marker-end="url(#arrow)"');out+=text(x,337,v.landed?'도착':state.started?'낙하 중':'대기');});
  svg(out,'나란히 세운 판 사이에서 자석과 알루미늄 조각의 동시 낙하',360);
  readout.innerHTML=metric('경과 시간',elapsed.toFixed(2)+' s')+metric('자석 도착',a.landed?M.fallTime(state.height,gamma).toFixed(2)+' s':'—')+metric('알루미늄 도착',b.landed?M.fallTime(state.height,0).toFixed(2)+' s':'—');
  setStatus(!state.started?'두 물체는 같은 높이에서 정지한 상태입니다.':a.landed&&b.landed?'두 물체가 도착했습니다. 판의 재질을 바꾸어 다시 비교하세요.':state.plate==='copper'?'움직이는 자석 옆 구리판에는 유도 전류가 생겨 낙하를 방해합니다.':'절연판 조건에서는 이 모형의 자기 제동이 작용하지 않습니다.');
  $('drop').textContent=state.started?'다시 떨어뜨리기':'두 물체 놓기';$('pauseDrop').disabled=!state.started||(a.landed&&b.landed);$('pauseDrop').textContent=running?'일시 정지':'계속 관찰';
  if(a.landed&&b.landed)stop();
 }
 function drawAmplifier(){
  const r=M.amplifier(state,elapsed*5),active=state.playing,amp=state.mode==='amplified';
  let b=rect(30,53,110,70,'#e0ebee','rx="8"')+text(85,84,'입력 신호')+text(85,108,'220 Hz',undefined,16);
  b+=line(140,88,233,88,'#248795',3,'marker-end="url(#arrow)"');
  if(amp)b+=rect(233,40,170,100,'#d9eee9','rx="8"')+text(318,75,'트랜지스터')+text(318,106,'증폭 회로')+rect(258,155,120,40,state.power?'#f4d27d':'#d8e0e3','rx="5"')+text(318,182,`${state.supply} V ${state.power?'ON':'OFF'}`,undefined,18)+line(318,140,318,155);
  else b+=line(233,88,403,88,'#248795',3)+text(318,126,'직접 연결');
  b+=line(403,88,498,88,'#248795',3,'marker-end="url(#arrow)"')+path(`M508 72H527L${567+(active?r.output*8:0)} 48V132L527 108H508Z`,'#176878',4)+text(545,162,'스피커');
  b+=text(130,222,'입력 · 파랑',undefined,16)+text(463,222,'출력 · 주황',undefined,16);
  [40,355].forEach(x=>{b+=rect(x,235,245,92,'#f8fbfc','stroke="#c4d5db"')+line(x,281,x+245,281,'#aac1cd',1);});
  b+=curve(t=>active?M.amplifier(state,t*Math.PI*4+elapsed*5).input:0,40,281,245,14,'#248795')+curve(t=>active?M.amplifier(state,t*Math.PI*4+elapsed*5).output:0,355,281,245,14,'#bb6b31');
  svg(b,'입력 신호와 증폭 회로의 전원, 스피커 및 같은 전압 눈금의 입력·출력 파형');
  readout.innerHTML=metric('입력 진폭',active?state.amplitude.toFixed(2)+' V':'0 V')+metric('출력 진폭',active?(amp&&state.power?Math.min(state.amplitude*10,r.limit):amp?0:state.amplitude).toFixed(2)+' V':'0 V')+metric('파형',active&&r.clipped?'위아래가 잘림':active?'관찰 중':'정지');
  setStatus(!active?'신호를 보내고 직접 연결과 증폭 회로를 비교하세요.':amp&&!state.power?'증폭 회로에 전원이 공급되지 않았습니다.':r.clipped?'출력의 위아래가 평평해졌습니다. 입력 진폭을 줄여 변화를 확인하세요.':amp?'전지의 에너지를 사용하여 같은 주파수의 입력 신호를 더 큰 출력으로 바꿉니다.':'같은 신호를 스피커에 직접 연결한 상태입니다.');
  pressed('power',state.power,'증폭 회로 전원 끄기','증폭 회로 전원 켜기');pressed('playSignal',state.playing,'신호 멈추기','신호 보내기');
 }
 function drawFilm(){
  const d=M.filmThickness(state.sample/100,elapsed),y=58+state.sample*2.2;
  let b='<defs><clipPath id="filmClip"><circle cx="168" cy="169" r="110"/></clipPath></defs>';
  b+='<g clip-path="url(#filmClip)">';for(let i=0;i<110;i++)b+=rect(57,59+i*2,223,2.3,state.formed?M.filmColor(M.filmThickness(i/109,elapsed),state.light):'#d7e5eb');b+='</g>';
  b+=`<circle cx="168" cy="169" r="112" fill="none" stroke="#c4904e" stroke-width="7"/>`+line(168,283,168,323,'#c4904e',9)+line(48,y,287,y,'white',2,'stroke-dasharray="5 5"')+text(168,34,'수직으로 세운 막');
  b+=text(462,34,'두 반사광의 경로')+rect(451,75,39,165,'#b1d7e7')+line(451,75,451,240,'#4485a0',2)+line(490,75,490,240,'#4485a0',2);
  if(state.formed){b+=path('M350 90L451 150L350 210','#d9a132',3,'marker-end="url(#arrow)"')+path('M451 150L490 166.4L451 182.8L350 242.8','#ca6854',3,'marker-end="url(#arrow)"');}
  b+=text(372,76,'입사광',undefined,16)+text(359,230,'앞면 반사',undefined,16)+text(385,266,'뒷면 반사',undefined,16)+text(540,132,'공기',undefined,16)+text(469,305,'빛길을 벌려 표시',undefined,16);
  svg(b,'수직 비누막의 반사 무늬와 앞면·뒷면에서 반사되는 두 빛');
  readout.innerHTML=metric('경과 시간',elapsed.toFixed(1)+' s')+metric('선택 높이의 두께',state.formed?Math.round(d)+' nm':'막 없음')+metric('반사 상대 세기',state.formed&&state.light!=='white'?Math.round(100*M.filmIntensity(d,{red:650,green:530,blue:460}[state.light]))+'%':'색과 무늬 비교');
  setStatus(!state.formed?'틀을 비눗물에 담갔다 세워 막을 만드세요.':'점선 높이의 두께와 반사 무늬를 비교하세요. 관찰 위치 또는 빛의 색을 바꾸면 두 반사광의 간섭 조건이 달라집니다.');
  $('drain').disabled=$('stepFilm').disabled=!state.formed;pressed('drain',running,'시간 멈추기','시간 보내기');
 }
 function drawPolarization(){
  const value=M.polarization(state.source,state.angle,state.filter),axis=state.angle*Math.PI/180;
  let b=rect(25,70,150,160,'#304e60','rx="10"')+rect(36,82,128,121,'#e6f5fb')+text(100,218,'광원 '+state.source,'white',18);
  b+=path('M177 137H251M177 164H251','#daa448',8);
  if(state.filter){b+=`<ellipse cx="317" cy="151" rx="48" ry="84" fill="#7298ad" fill-opacity=".45" stroke="#31586b" stroke-width="5"/>`;
   for(let i=-2;i<=2;i++)b+=line(317+Math.sin(axis)*i*8-Math.cos(axis)*29,151-Math.cos(axis)*i*8-Math.sin(axis)*55,317+Math.sin(axis)*i*8+Math.cos(axis)*29,151-Math.cos(axis)*i*8+Math.sin(axis)*55,'#31586b',2);
   b+=text(317,276,`${state.angle}°`);
  }else b+=rect(276,62,82,180,'none','stroke="#9bb8c5" stroke-dasharray="6 6"');
  b+=path('M374 137H453M374 164H453','#daa448',8,`opacity="${value/100}"`)+rect(463,82,150,148,'#294957','rx="10"')+rect(477,100,122,71,'#e3f1ee','rx="5"')+text(538,144,value.toFixed(1),undefined,30)+text(538,205,'센서','white',18)+text(318,315,'광원과 센서의 거리 유지',undefined,18);
  svg(b,'광원, 회전하는 편광판과 같은 위치의 빛 센서');
  readout.innerHTML=metric('편광판 없음', '100')+metric('현재 상대 세기',value.toFixed(1))+metric('편광판',state.filter?state.angle+'°':'제거됨');
  setStatus(state.filter?'편광판을 0°부터 180°까지 돌려 가장 밝고 어두운 방향을 찾아 보세요. 광원을 바꾸어 같은 방식으로 비교할 수 있습니다.':'편광판 없는 기준 세기는 100입니다. 편광판을 넣고 각도를 바꾸어 보세요.');
  pressed('filter',state.filter,'편광판 빼기','편광판 넣기');
 }
 function drawElectrons(){
  let b=rect(32,81,82,60,'#426b7c','rx="8"')+text(73,118,'전자총','white',18)+line(124,110,260,110,'#83a1b2',2,'stroke-dasharray="5 5"');
  b+=rect(265,34,14,162,'#577a8b')+rect(262,105-(state.slits==='two'?state.spacing*13:0),20,11,'#edf6fa');if(state.slits==='two')b+=rect(262,105+state.spacing*13,20,11,'#edf6fa');
  b+=text(270,228,state.slits==='two'?'두 슬릿':'한 슬릿',undefined,18)+text(456,37,'검출판 · 정면 확대',undefined,18);
  b+=rect(332,51,286,176,'#102d3d','rx="5"');
  for(const p of hits)b+=`<circle cx="${475+p.x*27}" cy="${59+p.y*160}" r="1.3" fill="#78e6cc"/>`;
  if(state.pathKnown)b+=rect(246,153,51,28,'#efc570','rx="4"')+text(271,173,'측정',undefined,15);
  const bins=Array(70).fill(0);for(const p of hits)bins[Math.min(69,Math.floor((p.x+5)/10*70))]++;
  const max=Math.max(1,...bins);b+=text(169,286,'위치별 도착 횟수',undefined,17);bins.forEach((n,i)=>b+=rect(334+i*4,324-n/max*62,3.2,n/max*62,'#176878'));b+=line(332,324,618,324,'#8bacbb',1);
  svg(b,'전자총과 슬릿, 도착 사건을 누적한 검출판과 위치별 도착 횟수');
  readout.innerHTML=metric('누적 검출',hits.length+'개')+metric('통과 경로',state.pathKnown?'측정함':'측정하지 않음')+metric('방출',running?'한 개씩 연속':'대기');
  setStatus(hits.length===0?'한 전자를 보내 점 하나를 확인하고, 더 많은 전자를 누적해 보세요.':hits.length<30?'점 하나는 전자 하나의 도착입니다. 아직 전체 분포를 판단하기에는 점이 적습니다.':state.pathKnown?'경로를 측정한 조건입니다. 측정하지 않은 조건과 새 검출판에서 비교하세요.':'같은 조건에서 도착 점을 계속 누적하고 있습니다. 띠 사이와 띠 안의 도착 횟수를 비교하세요.');
  pressed('runElectrons',running,'연속 방출 멈추기','한 개씩 연속 보내기');
  $('singleElectron').disabled=$('manyElectrons').disabled=hits.length>=10000;$('spacing').disabled=state.slits==='one';
 }
 const draws={'speaker-lab':drawSpeaker,'wireless-power':drawWireless,'magnetic-brake':drawBrake,'transistor-speaker':drawAmplifier,'soap-film':drawFilm,polarization:drawPolarization,'electron-slits':drawElectrons};
 function draw(){draws[slug]();}
 function stop(){running=false;cancelAnimationFrame(frame);frame=0;last=0;}
 function start(){if(running)return;running=true;last=0;frame=requestAnimationFrame(tick);}
 function tick(now){if(!running)return;const dt=last?Math.min(.06,(now-last)/1000):0;last=now;
  if(slug==='electron-slits'){const old=Math.floor(elapsed*12);elapsed+=dt;for(let i=old;i<Math.floor(elapsed*12);i++)addHits(1);if(hits.length>=10000)stop();}
  else elapsed=slug==='soap-film'?Math.min(60,elapsed+dt):elapsed+dt;
  draw();if(elapsed>=60&&slug==='soap-film'){stop();draw();}if(running)frame=requestAnimationFrame(tick);
 }
 function addHits(n){for(let i=0;i<n&&hits.length<10000;i++)hits.push(M.electronHit(rng,state));}
 function clearHits(){hits=[];rng=M.random(8123);elapsed=0;}
 function bind(id,fn){$(id)?.addEventListener('click',()=>{fn();draw();});}
 function reset(){stop();stopSound();state={...defaults[slug]};elapsed=0;clearHits();root.querySelectorAll('select,input[type=range]').forEach(e=>{e.value=String(state[e.id]);if($(e.id+'Value'))$(e.id+'Value').textContent=e.value+e.dataset.unit;});draw();}
 root.querySelectorAll('select,input[type=range]').forEach(e=>e.addEventListener('input',()=>{
  state[e.id]=e.id==='pathKnown'?e.value==='true':e.type==='range'||e.id==='supply'?Number(e.value):e.value;
  if($(e.id+'Value'))$(e.id+'Value').textContent=e.value+e.dataset.unit;
  if(slug==='magnetic-brake'){stop();elapsed=0;state.started=false;}
  if(slug==='electron-slits')clearHits();
  if(e.id==='frequency'&&oscillator)oscillator.frequency.value=state.frequency;
  draw();
 }));
 ['magnet','stripped','connected','power','filter'].forEach(id=>bind(id,()=>{state[id]=!state[id];if(slug==='speaker-lab'&&!M.speaker(state).connected)stopSound();if(slug==='wireless-power'){if(state.power)start();else stop();}}));
 bind('playSignal',()=>{state.playing=!state.playing;if(state.playing)start();else{stop();stopSound();}});bind('referenceSound',sound);
 bind('drop',()=>{stop();elapsed=0;state.started=true;start();});bind('pauseDrop',()=>running?stop():start());
 bind('dip',()=>{stop();state.formed=true;elapsed=0;});bind('drain',()=>running?stop():start());bind('stepFilm',()=>{stop();elapsed=Math.min(60,elapsed+5);});
 bind('singleElectron',()=>addHits(1));bind('manyElectrons',()=>addHits(100));bind('runElectrons',()=>running?stop():start());bind('clearScreen',()=>{stop();clearHits();});bind('resetExperiment',reset);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();stopSound();if('playing'in state)state.playing=false;draw();}});
 window.addEventListener('pagehide',()=>{stop();stopSound();audio?.close();});
 window.__physicsLab={snapshot:()=>({slug,state:{...state},elapsed,running,hits:hits.map(p=>({...p}))})};
 reset();
})();
