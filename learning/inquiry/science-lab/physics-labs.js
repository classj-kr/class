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
 function svg(body,label,height=340){window.scienceScene.render(scene,`<svg viewBox="0 0 640 ${height}" role="img" aria-label="${label}"><defs><linearGradient id="speakerPaper" x2="0" y2="1"><stop stop-color="#f7ead3"/><stop offset=".5" stop-color="#fffbef"/><stop offset="1" stop-color="#d8bd92"/></linearGradient><linearGradient id="speakerCone"><stop stop-color="#dce9eb"/><stop offset=".55" stop-color="#f2faf9"/><stop offset="1" stop-color="#9ebfc5"/></linearGradient><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#22798b"/></marker></defs>${body}</svg>`);}
 const metric=(label,value)=>`<div><span>${label}</span><strong>${value}</strong></div>`;
 function setStatus(value){if(status.textContent!==value)status.textContent=value;}
 function pressed(id,on,onLabel,offLabel){const b=$(id);if(!b)return;if(b.getAttribute('aria-pressed')!==String(on))b.setAttribute('aria-pressed',String(on));const label=on?onLabel:offLabel;if(onLabel&&b.textContent!==label)b.textContent=label;}
 function curve(fn,x,y,w,h,color){let d='';for(let i=0;i<=180;i++){const t=i/180;d+=(i?'L':'M')+(x+w*t).toFixed(2)+' '+(y-h*fn(t)).toFixed(2)+' ';}return path(d,color,2.5);}
 function stopSound(){if(oscillator){oscillator.stop();oscillator.disconnect();oscillator=null;}clearTimeout(audioTimer);pressed('referenceSound',false,'참고음 끄기','참고음 듣기');}
 async function sound(){if(oscillator){stopSound();return;}if(!M.speaker(state).connected){setStatus('스피커를 조립하고 신호를 먼저 보내세요.');return;}try{audio||=new(window.AudioContext||window.webkitAudioContext)();await audio.resume();oscillator=audio.createOscillator();gain=audio.createGain();gain.gain.value=.035;oscillator.frequency.value=state.frequency;oscillator.connect(gain).connect(audio.destination);oscillator.start();pressed('referenceSound',true,'참고음 끄기','참고음 듣기');audioTimer=setTimeout(stopSound,5000);}catch{setStatus('이 브라우저에서는 참고음을 재생할 수 없습니다. 진동은 화면에서 관찰할 수 있습니다.');}}
 // Short tweens for discrete changes (magnet in, polarizer in, film dipped, clamp opened)
 // and a brief awake window for travelling light. Nothing keeps running once settled.
 const reduced=!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 let fx={},fxFrame=0,awakeUntil=0,clock=0;
 const ease=k=>k<.5?2*k*k:1-(-2*k+2)**2/2,f2=v=>(+v).toFixed(2);
 function fxv(name,fallback=0){const f=fx[name];if(!f)return fallback;if(!f.dur)return f.to;const k=Math.min(1,(performance.now()-f.t0)/f.dur);return f.from+(f.to-f.from)*ease(k);}
 function fxDone(name){const f=fx[name];return !f||!f.dur||performance.now()-f.t0>=f.dur;}
 function tween(name,to,seconds){const from=fxv(name,to);fx[name]={from,to,t0:performance.now(),dur:reduced?0:seconds*1000};kick();}
 function setfx(name,v){fx[name]={from:v,to:v,t0:0,dur:0};}
 function fxBusy(){const now=performance.now();return now<awakeUntil||Object.values(fx).some(f=>f.dur&&now-f.t0<f.dur);}
 function wake(seconds){if(reduced)return;awakeUntil=Math.max(awakeUntil,performance.now()+seconds*1000);kick();}
 function kick(){if(!fxFrame)fxFrame=requestAnimationFrame(fxTick);}
 function fxTick(now){fxFrame=0;clock=now/1000;const more=fxBusy();if(!running)draw();if(more)fxFrame=requestAnimationFrame(fxTick);}
 const label=(x,y,s,anchor='middle',fill='#24434f')=>`<text x="${x}" y="${y}" fill="${fill}" font-size="15" text-anchor="${anchor}">${s}</text>`;
 const lead=(x1,y1,x2,y2)=>line(x1,y1,x2,y2,'#7d97a3',1.2);
 // A cross-section paper wall: tan edge with a lighter core.
 const wall=(x1,y1,x2,y2)=>line(x1,y1,x2,y2,'#b8945e',6,'stroke-linecap="round"')+line(x1,y1,x2,y2,'#f7ecd6',2.4,'stroke-linecap="round"');
 function drawSpeaker(){
  const r=M.speaker(state,elapsed*5*state.frequency/220),k=fxv('magnet',state.magnet?1:0),seated=k>.97?1:0;
  const lift=45*Math.sin(Math.PI*Math.min(1,Math.max(0,k)))*(fxDone('magnet')?0:1),vib=r.displacement*.38*seated,dy=-lift+vib;
  const cols=Math.max(1,Math.round(state.turns/10));
  // Vibrating cup: upright, its recessed bottom carries the coil above the magnet.
  let coil='';for(let c=0;c<cols;c++)for(const y of [182.2,186.8])for(const s of [-1,1])coil+=`<circle cx="${230+s*(27+c*4.4)}" cy="${y}" r="2.1" fill="#c47a39" stroke="#7d4a22" stroke-width=".6"/>`;
  let b=`<rect x="0" y="312" width="640" height="28" fill="#e3ecef"/>`+line(0,312,640,312,'#b9cbd2',2);
  b+=`<g transform="translate(0 ${f2(dy)})"><path d="M175 190L145 60L315 60L285 190Z" fill="#fffaf0" opacity=".85"/>${wall(175,190,145,60)}${wall(285,190,315,60)}${line(172.2,178,287.8,178,'#b8945e',4)}<circle cx="145" cy="60" r="4" fill="#efe0c2" stroke="#b8945e" stroke-width="1.5"/><circle cx="315" cy="60" r="4" fill="#efe0c2" stroke="#b8945e" stroke-width="1.5"/>${coil}</g>`;
  // Fixed cup: upside down on the table, the magnet resting on its bottom.
  b+=`<path d="M150 312L175 190L285 190L310 312Z" fill="#fffaf0" opacity=".85"/>${wall(150,312,175,190)}${wall(310,312,285,190)}${line(172.5,202,287.5,202,'#b8945e',4)}<circle cx="150" cy="309" r="4" fill="#efe0c2" stroke="#b8945e" stroke-width="1.5"/><circle cx="310" cy="309" r="4" fill="#efe0c2" stroke="#b8945e" stroke-width="1.5"/>`;
  b+=rect(165,183,12,15,'#a9d0e0','opacity=".8" rx="2"')+rect(283,183,12,15,'#a9d0e0','opacity=".8" rx="2"');
  // Magnet: lies on the table until attached, then rides in while the top cup lifts.
  const u=Math.max(0,Math.min(1,k)),mx=(1-u)**2*75+2*u*(1-u)*130+u*u*230,my=(1-u)**2*306+2*u*(1-u)*110+u*u*196;
  b+=`<g data-magnet>${rect(mx-25,my-6,50,6,'#d8604f','rx="1.5"')}${rect(mx-25,my,50,6,'#4d8cc0','rx="1.5"')}${rect(mx-25,my-6,50,12,'none','stroke="#55606a" stroke-width="1" rx="2"')}</g>`;
  // Signal generator with a live trace.
  const cycles=state.frequency/110,trace=Array.from({length:61},(_,i)=>`${i?'L':'M'}${(454+i*1.6).toFixed(1)} ${(250-(state.playing?11*Math.sin(i/60*cycles*2*Math.PI-elapsed*6):0)).toFixed(1)}`).join('');
  b+=rect(440,222,160,90,'#e8eef0','rx="8" stroke="#8ea4ae" stroke-width="2"')+rect(452,232,100,38,state.playing?'#dff4e7':'#e4ebe8','rx="4" stroke="#9fb5ad"')+path(trace,state.playing?'#1e8a5a':'#9fb5ad',2);
  b+=`<circle cx="577" cy="251" r="13" fill="#cfd9dd" stroke="#7c919b" stroke-width="2"/>`+line(577,251,577,241,'#4f6670',2.5);
  b+=`<circle cx="462" cy="290" r="7" fill="#d6534a" stroke="#8d2c26" stroke-width="2"/><circle cx="488" cy="290" r="7" fill="#3b4a52" stroke="#1d272c" stroke-width="2"/>`;
  // Enamelled coil leads to the signal generator.
  const ends=state.connected?[[462,290],[488,290]]:[[408,306],[420,309]],bare=state.stripped?'#e7a65d':'#8c3d24';
  [0,1].forEach(i=>{const y0=184+i*3+dy,[ex,ey]=ends[i],tx=state.connected?ex-9:ex-11,ty=state.connected?ey+5:ey;
   b+=path(`M${262+cols*4.4} ${f2(y0)}C285 ${f2(y0)} 300 ${189+i*2} 330 ${190+i*3}C350 ${192+i*3} 352 ${230} 352 ${296+i*4}C352 ${305+i*4} 370 ${305+i*4} 392 ${305+i*4}L${tx} ${ty}`,'#9a4a2b',2.6,'stroke-linecap="round"');
   b+=line(tx,ty,ex,ey,bare,3,'stroke-linecap="round"');});
  // Sound spreading from the open mouth of the vibrating cup.
  if(r.connected&&seated)for(let i=0;i<3;i++){const ph=(elapsed*.55*state.frequency/220+i/3)%1,rr=26+ph*96;b+=path(`M${(230-rr).toFixed(1)} ${f2(56+dy)}A${rr.toFixed(1)} ${(rr*.45).toFixed(1)} 0 0 1 ${(230+rr).toFixed(1)} ${f2(56+dy)}`,'#e0972c',2.5,`stroke-opacity="${((1-ph)*.75).toFixed(2)}"`);}
  b+=label(78,112,'울림 컵')+label(78,250,'받침 컵')+label(78,170,'코일')+lead(100,174,190,183)+label(520,212,'신호 발생기');
  b+=k>.5?label(78,204,'자석')+lead(100,200,203,196):label(75,290,'자석');
  svg(b,'두 종이컵의 바닥을 맞댄 스피커 단면: 위 컵 바닥의 코일, 아래 컵 바닥의 자석, 신호 발생기');
  window.scienceScene.render(readout,metric('전류 경로',state.stripped&&state.connected?'연결됨':'끊어짐')+metric('신호 주파수',state.frequency+' Hz')+metric('진동판',r.connected?'왕복 진동':'정지'));
  setStatus(!state.playing?'장치를 조립하고 신호를 보내 보세요.':r.connected?'전류 방향이 바뀌며 코일과 진동판이 앞뒤로 움직입니다.':!state.magnet?'자석이 없는 상태입니다. 자석을 붙이고 변화를 비교하세요.':!state.stripped?'전선 끝의 피복 때문에 전기적 접촉이 되지 않았습니다.':'오디오 출력과 코일을 연결하세요.');
  ['magnet','stripped','connected'].forEach((id,i)=>pressed(id,state[id],[ '① 자석 떼기','② 전선 끝 절연하기','③ 연결 끊기'][i],['① 자석 붙이기','② 전선 끝 피복 벗기기','③ 오디오 출력 연결'][i]));
  pressed('playSignal',state.playing,'신호 멈추기','신호 보내기');
 }
 // Side view of a helical coil: back half-turns pale, front half-turns copper.
 function helix(x0,len,cy,R,turns,rx){let back='',front='';const p=len/turns;
  for(let i=0;i<turns;i++){const x=x0+i*p;
   front+=`M${f2(x)} ${f2(cy-R)}C${f2(x+rx+p*.25)} ${f2(cy-R*.55)} ${f2(x+rx+p*.25)} ${f2(cy+R*.55)} ${f2(x+p/2)} ${f2(cy+R)}`;
   back+=`M${f2(x+p/2)} ${f2(cy+R)}C${f2(x+p/2-rx+p*.25)} ${f2(cy+R*.55)} ${f2(x+p-rx-p*.25)} ${f2(cy-R*.55)} ${f2(x+p)} ${f2(cy-R)}`;}
  return {back:path(back,'#dcb48c',2.4),front:path(front,'#b0622b',3.6,'stroke-linecap="round"')};}
 function drawWireless(){
  const r=M.wireless(state,elapsed*5),cy=140,txL=200,txR=256,gap=state.distance*24,a=state.angle*Math.PI/180,cos=Math.cos(a),sin=Math.sin(a);
  const rxLen=36*cos+2,rxC=txR+gap+20,rxL=rxC-rxLen/2,rxR=rxC+rxLen/2,ledX=Math.max(rxR,rxC+30)+64;
  const ac=state.signal==='ac',phase=elapsed*5,swing=state.power?(ac?Math.cos(phase):1):0,mag=Math.abs(swing);
  let b=`<rect x="0" y="236" width="640" height="104" fill="#f2f7f8"/>`;
  // Power supply with its own trace.
  const tr=Array.from({length:41},(_,i)=>`${i?'L':'M'}${(30+i*1.9).toFixed(1)} ${(128-(state.power?(ac?10*Math.cos(i/40*4*Math.PI-phase):-8):0)).toFixed(1)}`).join('');
  b+=rect(20,98,96,84,'#e8eef0','rx="8" stroke="#8ea4ae" stroke-width="2"')+rect(28,108,80,38,state.power?'#dff4e7':'#e4ebe8','rx="4" stroke="#9fb5ad"')+path(tr,state.power?'#1e8a5a':'#9fb5ad',2);
  b+=`<circle cx="48" cy="164" r="6" fill="#d6534a" stroke="#8d2c26" stroke-width="1.5"/><circle cx="88" cy="164" r="6" fill="#3b4a52" stroke="#1d272c" stroke-width="1.5"/>`;
  b+=path(`M48 164V202H${txL}V${cy+58}`,'#9a4a2b',2.4)+path(`M88 164V186H128V64H${txR}V${cy-58}`,'#9a4a2b',2.4);
  const tx=helix(txL,txR-txL,cy,58,7,7),rxk=helix(rxL,rxLen,cy,46,5,7+39*sin);
  b+=tx.back+rxk.back;
  // Field lines: closed loops through the transmitter that swell and fade with the current.
  if(state.power){const s=ac?.3+.7*mag:1,op=(ac?.18+.72*mag:.8).toFixed(2),dir=swing>=0?1:-1,mid=(txL+txR)/2;
   [[10,250,96],[24,150,84],[40,70,70]].forEach(([h,reach,H])=>{const R=reach*s,HH=h+(H-h)*s;
    for(const sg of [-1,1]){const y=cy+sg*h,Y=cy+sg*HH;
     b+=path(`M${txL} ${y}L${txR} ${y}C${f2(txR+R)} ${y} ${f2(txR+R)} ${f2(Y)} ${mid} ${f2(Y)}C${f2(txL-R*.36)} ${f2(Y)} ${f2(txL-R*.36)} ${y} ${txL} ${y}`,'#2b8fa4',2,`opacity="${op}"`);
     b+=path(`M${mid-5*dir} ${y-5}L${mid+5*dir} ${y}L${mid-5*dir} ${y+5}`,'#1d6f80',2,`stroke-opacity="${op}"`);}
   });}
  b+=tx.front+rxk.front;
  // Receiver leads to a real LED (dome, flange, two legs).
  const lit=r.led,ly=132;
  b+=path(`M${f2(rxL)} ${cy-46}V70H${f2(ledX+34)}V196H${f2(ledX+4)}V${ly+40}`,'#9a4a2b',2.4)+path(`M${f2(rxR)} ${cy+46}V210H${f2(ledX-4)}V${ly+34}`,'#9a4a2b',2.4);
  b+=`<circle cx="${f2(ledX)}" cy="${ly}" r="34" fill="#ffd84d" opacity="${lit?.28:0}"/><circle cx="${f2(ledX)}" cy="${ly}" r="20" fill="#ffd84d" opacity="${lit?.35:0}"/>`;
  b+=line(ledX+4,ly+14,ledX+4,ly+40,'#8b979d',2.2)+line(ledX-4,ly+14,ledX-4,ly+34,'#8b979d',2.2)+rect(ledX-12,ly+10,24,5,lit?'#f3c53a':'#e9e4c8','rx="1.5" stroke="#a89d6c"');
  b+=`<path d="M${f2(ledX-10)} ${ly+10}V${ly-6}A10 10 0 0 1 ${f2(ledX+10)} ${ly-6}V${ly+10}Z" fill="${lit?'#ffd23f':'#f4f1df'}" stroke="#a89d6c" stroke-width="1.5"/>`;
  b+=label(228,226,'송신 코일')+label(f2(rxC),226,'수신 코일')+label(f2(ledX),ly-28,'LED')+label(68,88,ac?'교류 전원':'직류 전원');
  // Receiver voltage trace that flows while the current alternates.
  const amp=r.peak/3.8*24;
  b+=rect(20,246,600,84,'#ffffff','rx="6" stroke="#c8d9df"')+line(110,288,610,288,'#c3d4da',1)+label(64,293,'수신 전압')+curve(t=>Math.cos(t*Math.PI*6-phase)*amp/26,110,288,500,26,'#176878');
  svg(b,'옆에서 본 송신 코일과 수신 코일, 두 코일을 꿰는 자기력선, 발광 다이오드와 수신 전압 파형');
  window.scienceScene.render(readout,metric('수신 전압 진폭',r.peak.toFixed(3)+' V')+metric('발광 다이오드',r.led?'켜짐':'꺼짐')+metric('거리 / 각도',`${state.distance} cm / ${state.angle}°`));
  setStatus(!state.power?'전원을 켜고 두 코일 사이의 거리와 방향을 바꾸어 보세요.':state.signal==='dc'?'일정한 직류를 유지하는 동안에는 수신 파형이 평평합니다. 켜고 끄는 순간의 유도는 이 화면에 포함하지 않습니다.':r.led?'수신 코일의 전압으로 발광 다이오드가 켜졌습니다. 거리와 방향을 바꾸어 비교하세요.':'교류를 보내고 있습니다. 발광 여부와 수신 전압 값을 함께 확인하세요.');
  pressed('power',state.power,'전원 끄기','전원 켜기');
 }
 function drawBrake(){
  const gamma=state.plate==='copper'?12:0,a=M.fall(elapsed,{height:state.height,gamma}),b=M.fall(elapsed,{height:state.height}),copper=state.plate==='copper',jaw=fxv('jaw',state.started?1:0);
  const plateFill=copper?'#c98a5a':'#e6eef1',plateFace=copper?'#e0aa7a':'#f3f8fa',plateLine=copper?'#8a5530':'#9fb6c0',vterm=9.81/12;
  let out=`<rect x="0" y="330" width="640" height="30" fill="#e3ecef"/>`+line(0,330,640,330,'#b9cbd2',2);
  [a,b].forEach((v,i)=>{const cx=170+i*300,y=82+v.y/state.height*212,y0=62,y1=318;
   out+=label(cx,26,i?'알루미늄 조각':'자석');
   out+=rect(cx-118,318,236,12,'#c9b38d','rx="2" stroke="#9c8358"');
   // Stand and clamp holding the object above the gap.
   out+=rect(cx+92,40,8,278,'#9fb2bc','stroke="#6d838f"')+rect(cx-6,40,104,8,'#9fb2bc','stroke="#6d838f"')+rect(cx-8,44,16,20,'#7f949f','rx="2"');
   // Inner faces of both plates recede toward the middle; front edges stand out.
   for(const s of [-1,1]){out+=`<path d="M${cx+s*44} ${y0}L${cx+s*32} ${y0-12}L${cx+s*32} ${y1-12}L${cx+s*44} ${y1}Z" fill="${plateFace}" stroke="${plateLine}" stroke-width="1.2"/>`;}
   // Eddy currents swirl in the plate faces just above and below the moving magnet.
   if(!i&&copper&&state.started&&!v.landed){const op=Math.min(1,v.v/vterm)*.9;
    for(const s of [-1,1])for(const [dyy,cw] of [[-30,1],[30,-1]]){const ex=cx+s*38,ey=y+dyy;if(ey<y0||ey>y1-14)continue;const turn=cw*s;
     out+=`<ellipse cx="${ex}" cy="${f2(ey)}" rx="4.5" ry="13" fill="none" stroke="#1f7f95" stroke-width="2" stroke-opacity="${f2(op)}"/>`+path(`M${ex-4} ${f2(ey-turn*6)}L${ex+(turn>0?.5:-.5)} ${f2(ey-turn*13)}L${ex+5} ${f2(ey-turn*6)}`,'#1f7f95',2,`stroke-opacity="${f2(op)}"`);}}
   // Falling object.
   if(i)out+=rect(cx-26,y-11,52,22,'#c9d3d9','rx="3" stroke="#7d8d96" stroke-width="1.5"')+rect(cx-24,y-9,48,5,'#eef3f5','rx="2"');
   else out+=rect(cx-26,y-11,52,11,'#d8604f','rx="2"')+rect(cx-26,y,52,11,'#4d8cc0','rx="2"')+rect(cx-26,y-11,52,22,'none','rx="3" stroke="#55606a" stroke-width="1.2"')+text(cx-12,y-1.5,'N','#ffffff',12)+text(cx-12,y+9.5,'S','#ffffff',12);
   if(!i&&gamma&&state.started&&v.v>0&&!v.landed)out+=line(cx+14,y-14,cx+14,y-46,'#22798b',3,'marker-end="url(#arrow)"');
   // Clamp jaws open on release.
   const j=4+jaw*10;out+=rect(cx-27-j+4,58,6,30,'#6f8590','rx="2"')+rect(cx+21+j-4,58,6,30,'#6f8590','rx="2"')+line(cx-24-j+4,58,cx+24+j-4,58,'#6f8590',4);
   for(const s of [-1,1])out+=rect(s<0?cx-56:cx+44,y0,12,y1-y0,plateFill,`stroke="${plateLine}" stroke-width="1.2"`);
   out+=rect(cx-34,306,68,12,'#d9e6c8','rx="3" stroke="#9db487"');
   out+=label(cx-82,190,copper?'구리판':'절연판','end');
  });
  svg(out,'스탠드 집게에 매단 자석과 알루미늄 조각을 두 판 사이로 동시에 놓는 장면',360);
  window.scienceScene.render(readout,metric('경과 시간',elapsed.toFixed(2)+' s')+metric('자석 도착',a.landed?M.fallTime(state.height,gamma).toFixed(2)+' s':'—')+metric('알루미늄 도착',b.landed?M.fallTime(state.height,0).toFixed(2)+' s':'—'));
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
  window.scienceScene.render(readout,metric('입력 진폭',active?state.amplitude.toFixed(2)+' V':'0 V')+metric('출력 진폭',active?(amp&&state.power?Math.min(state.amplitude*10,r.limit):amp?0:state.amplitude).toFixed(2)+' V':'0 V')+metric('파형',active&&r.clipped?'위아래가 잘림':active?'관찰 중':'정지'));
  setStatus(!active?'신호를 보내고 직접 연결과 증폭 회로를 비교하세요.':amp&&!state.power?'증폭 회로에 전원이 공급되지 않았습니다.':r.clipped?'출력의 위아래가 평평해졌습니다. 입력 진폭을 줄여 변화를 확인하세요.':amp?'전지의 에너지를 사용하여 같은 주파수의 입력 신호를 더 큰 출력으로 바꿉니다.':'같은 신호를 스피커에 직접 연결한 상태입니다.');
  pressed('power',state.power,'증폭 회로 전원 끄기','증폭 회로 전원 켜기');pressed('playSignal',state.playing,'신호 멈추기','신호 보내기');
 }
 function drawFilm(){
  const fr=state.sample/100,d=M.filmThickness(fr,elapsed),ys=70+fr*210,k=fxv('dip',1),dipping=!fxDone('dip');
  const down=dipping?(k<.45?ease(k/.45):k<.55?1:1-ease((k-.55)/.45)):0,off=down*58,surface=304;
  const hasFilm=state.formed&&!(dipping&&k<.5),settled=state.formed&&!dipping;
  let b=`<defs><clipPath id="filmClip"><circle cx="168" cy="175" r="103"/></clipPath><clipPath id="filmLift"><rect x="40" y="0" width="260" height="${f2(surface-off)}"/></clipPath>`;
  for(const [id,c] of [['arrowGold','#c98a17'],['arrowRed','#c4533f'],['arrowRose','#a8456f']])b+=`<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="3.4" markerHeight="3.4" orient="auto"><path d="M0 0L10 5L0 10Z" fill="${c}"/></marker>`;
  b+='</defs>';
  b+=rect(36,298,264,38,'#e4eef2','rx="6" stroke="#9fb9c4" stroke-width="2"');
  // Ring frame on a stem; while dipping it sinks into the soapy water and the film forms as it rises.
  b+=`<g transform="translate(0 ${f2(off)})">`;
  if(hasFilm){b+=`<g clip-path="url(#filmClip)"><g clip-path="url(#filmLift)">`;for(let i=0;i<106;i++)b+=rect(60,70+i*2,216,2.3,M.filmColor(M.filmThickness(i/105,elapsed),state.light));b+='</g></g>';}
  b+=`<circle cx="168" cy="175" r="105" fill="none" stroke="#c4904e" stroke-width="7"/>`+line(168,68,168,26,'#c4904e',7)+rect(160,6,16,24,'#a8773e','rx="4"')+'</g>';
  b+=rect(40,surface,256,28,'#bfe0ec','opacity=".8" rx="3"')+line(40,surface,296,surface,'#7fb6c9',2)+label(168,326,'비눗물');
  if(settled)b+=line(52,ys,600,ys,'#ffffff',3.2,'stroke-opacity=".7"')+line(52,ys,600,ys,'#26495a',1.6,'stroke-dasharray="7 5"');
  if(hasFilm){
   // Side section of the same film: a wedge, thin at the top and thick at the bottom (thickness enlarged).
   let front='',back='';for(let i=0;i<=40;i++){const y=70+i/40*210,w=2+M.filmThickness(i/40,elapsed)/1100*46;front+=`${i?'L':'M'}455 ${f2(y)}`;back=`L${f2(455+w)} ${f2(y)}`+back;}
   b+=`<path d="${front}${back}Z" fill="#cfe8f1" stroke="#5f97ad" stroke-width="1.5"/>`+label(525,58,'비누막')+lead(510,62,466,76)+label(470,316,'옆 단면 · 두께 확대');
  }
  if(settled){const w=2+d/1100*46;
   b+=path(`M372 ${f2(ys-42)}L455 ${f2(ys)}`,'#d9a132',2.5,'marker-end="url(#arrowGold)"');
   b+=path(`M455 ${f2(ys)}L372 ${f2(ys+42)}`,'#c4533f',2.5,'marker-end="url(#arrowRed)"');
   b+=path(`M455 ${f2(ys)}L${f2(455+w)} ${f2(ys+7)}L455 ${f2(ys+14)}L372 ${f2(ys+56)}`,'#a8456f',2.5,'marker-end="url(#arrowRose)"');
   b+=label(364,Math.max(22,ys-36),'입사광','end')+label(364,Math.min(312,ys+46),'앞면 반사','end')+label(364,Math.min(334,ys+68),'뒷면 반사','end')+label(Math.max(540,470+w+30),ys-10,'공기','start');
  }
  svg(b,'링에 세운 비누막의 반사 무늬와, 같은 막의 쐐기 모양 단면에서 앞면·뒷면으로 반사되는 두 빛');
  window.scienceScene.render(readout,metric('경과 시간',elapsed.toFixed(1)+' s')+metric('선택 높이의 두께',state.formed?Math.round(d)+' nm':'막 없음')+metric('반사 상대 세기',state.formed&&state.light!=='white'?Math.round(100*M.filmIntensity(d,{red:650,green:530,blue:460}[state.light]))+'%':'색과 무늬 비교'));
  setStatus(!state.formed?'틀을 비눗물에 담갔다 세워 막을 만드세요.':'점선 높이의 두께와 반사 무늬를 비교하세요. 관찰 위치 또는 빛의 색을 바꾸면 두 반사광의 간섭 조건이 달라집니다.');
  $('drain').disabled=$('stepFilm').disabled=!state.formed;pressed('drain',running,'시간 멈추기','시간 보내기');
 }
 function drawPolarization(){
  const value=M.polarization(state.source,state.angle,state.filter),k=fxv('filter',state.filter?1:0),inBeam=state.filter&&k>.95,th=state.angle*Math.PI/180,cy=124,px=318,sx=488;
  const travel=(clock*70)%30,out=inBeam?value:100,ox=(1-k)*190;
  let b=rect(0,248,640,32,'#e3ecef')+line(0,248,640,248,'#b9cbd2',2);
  // Lamp housing with a lens, on a stand.
  b+=line(62,160,62,248,'#8ea2ac',6)+rect(36,240,52,8,'#9fb2bc','rx="2"');
  b+=rect(20,94,86,66,'#dde6ea','rx="10" stroke="#7c919b" stroke-width="2"')+line(34,108,34,146,'#b4c4cb',3)+line(44,108,44,146,'#b4c4cb',3)+line(54,108,54,146,'#b4c4cb',3);
  b+=`<ellipse cx="106" cy="${cy+3}" rx="9" ry="30" fill="#fff4c4" stroke="#8a9ea8" stroke-width="2.5"/>`;
  // Beam before the polarizer: same for every source (its state is what we investigate).
  const beam=(x0,x1,h,op)=>{let s=rect(x0,cy-h/2+3,x1-x0,h,'#ffd56a',`opacity="${f2(op)}"`);for(let x=x0+travel;x<x1-8;x+=30)s+=line(x,cy+3,Math.min(x1,x+10),cy+3,'#e8a52a',2,`stroke-opacity="${f2(op)}"`);return s;};
  b+=beam(114,inBeam?px:sx,26,.75);
  if(inBeam&&out>.5){const f=out/100;b+=beam(px+10,sx,6+20*f,.12+.68*f);
   // Transmitted light vibrates only along the polarizer axis; its amplitude follows √I.
   const A=17*Math.sqrt(f);let w='';for(let x=px+12;x<=sx-6;x+=3){const dsp=A*Math.sin(2*Math.PI*(x-clock*70)/36);w+=`${w?'L':'M'}${f2(x+dsp*Math.sin(th)*.32)} ${f2(cy+3-dsp*Math.cos(th))}`;}
   b+=path(w,'#c46f10',2.2,`stroke-opacity="${f2(.35+.65*f)}"`);}
  // Polarizer disc in a ring holder, seen obliquely; lines show the transmission axis.
  if(k>.01){const V=72,D=24,P=(vv,dd)=>[px+dd*D,cy+3-vv*V],ax=[Math.cos(th),Math.sin(th)],pe=[-Math.sin(th),Math.cos(th)];
   let g=`<g transform="translate(0 ${f2(ox)})">`+line(px,cy+75,px,248,'#8ea2ac',6)+rect(px-26,240,52,8,'#9fb2bc','rx="2"');
   g+=`<ellipse cx="${px}" cy="${cy+3}" rx="${D}" ry="${V}" fill="#6f7f86" fill-opacity=".38" stroke="#4f6670" stroke-width="6"/>`;
   for(const o of [-.66,-.33,0,.33,.66]){const L=Math.sqrt(1-o*o)*.94,[x1,y1]=P(o*pe[0]-L*ax[0],o*pe[1]-L*ax[1]),[x2,y2]=P(o*pe[0]+L*ax[0],o*pe[1]+L*ax[1]);g+=line(f2(x1),f2(y1),f2(x2),f2(y2),'#34474f',1.6);}
   b+=g+'</g>';}
  // Light sensor probe on a stand, cabled to a meter.
  b+=line(sx+22,cy+20,sx+22,248,'#8ea2ac',6)+rect(sx-4,240,52,8,'#9fb2bc','rx="2"');
  b+=rect(sx,cy-13,46,32,'#b8c7ce','rx="6" stroke="#6f8590" stroke-width="2"')+`<ellipse cx="${sx}" cy="${cy+3}" rx="5" ry="12" fill="#33434a"/>`;
  b+=path(`M${sx+46} ${cy+3}C${sx+70} ${cy+3} ${sx+64} 176 ${sx+80} 176`,'#4f6670',2.5)+rect(568,148,62,58,'#eef3f5','rx="6" stroke="#8ea4ae" stroke-width="2"')+rect(574,156,50,28,'#e2f2e8','rx="3" stroke="#9fb5ad"')+text(599,176,value.toFixed(1),'#1d3d33',15);
  b+=label(62,270,'광원 '+state.source)+(k>.95?label(px,270,'편광판 '+state.angle+'°'):'')+label(sx+22,270,'센서');
  svg(b,'광원, 회전하는 편광판과 같은 위치의 빛 센서',280);
  window.scienceScene.render(readout,metric('편광판 없음', '100')+metric('현재 상대 세기',value.toFixed(1))+metric('편광판',state.filter?state.angle+'°':'제거됨'));
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
  window.scienceScene.render(readout,metric('누적 검출',hits.length+'개')+metric('통과 경로',state.pathKnown?'측정함':'측정하지 않음')+metric('방출',running?'한 개씩 연속':'대기'));
  setStatus(hits.length===0?'한 전자를 보내 점 하나를 확인하고, 더 많은 전자를 누적해 보세요.':hits.length<30?'점 하나는 전자 하나의 도착입니다. 아직 전체 분포를 판단하기에는 점이 적습니다.':state.pathKnown?'경로를 측정한 조건입니다. 측정하지 않은 조건과 새 검출판에서 비교하세요.':'같은 조건에서 도착 점을 계속 누적하고 있습니다. 띠 사이와 띠 안의 도착 횟수를 비교하세요.');
  pressed('runElectrons',running,'연속 방출 멈추기','한 개씩 연속 보내기');
  $('singleElectron').disabled=$('manyElectrons').disabled=hits.length>=10000;$('spacing').disabled=state.slits==='one';
 }
 const draws={'speaker-lab':drawSpeaker,'wireless-power':drawWireless,'magnetic-brake':drawBrake,'transistor-speaker':drawAmplifier,'soap-film':drawFilm,polarization:drawPolarization,'electron-slits':drawElectrons};
 function draw(){draws[slug]();}
 function stop(){running=false;cancelAnimationFrame(frame);frame=0;last=0;}
 function start(){if(running)return;
  // Reduced motion: show the settled state instead of animating it.
  if(reduced&&slug!=='electron-slits'&&slug!=='transistor-speaker'){
   if(slug==='magnetic-brake')elapsed=Math.max(M.fallTime(state.height,state.plate==='copper'?12:0),M.fallTime(state.height,0))+.01;
   else if(slug==='soap-film')elapsed=60;
   else elapsed=slug==='speaker-lab'?Math.PI/10:0;
   draw();return;}
  running=true;last=0;frame=requestAnimationFrame(tick);}
 function tick(now){if(!running)return;const dt=last?Math.min(.06,(now-last)/1000):0;last=now;clock=now/1000;
  if(slug==='electron-slits'){const old=Math.floor(elapsed*12);elapsed+=dt;for(let i=old;i<Math.floor(elapsed*12);i++)addHits(1);if(hits.length>=10000)stop();}
  else elapsed=slug==='soap-film'?Math.min(60,elapsed+dt):elapsed+dt;
  draw();if(elapsed>=60&&slug==='soap-film'){stop();draw();}if(running)frame=requestAnimationFrame(tick);
 }
 function addHits(n){for(let i=0;i<n&&hits.length<10000;i++)hits.push(M.electronHit(rng,state));}
 function clearHits(){hits=[];rng=M.random(8123);elapsed=0;}
 function bind(id,fn){$(id)?.addEventListener('click',()=>{fn();draw();});}
 function reset(){stop();stopSound();state={...defaults[slug]};elapsed=0;clearHits();fx={};awakeUntil=0;setfx('magnet',0);setfx('filter',0);setfx('jaw',0);setfx('dip',1);root.querySelectorAll('select,input[type=range]').forEach(e=>{e.value=String(state[e.id]);if($(e.id+'Value'))$(e.id+'Value').textContent=e.value+e.dataset.unit;});draw();}
 root.querySelectorAll('select,input[type=range]').forEach(e=>e.addEventListener('input',()=>{
  state[e.id]=e.id==='pathKnown'?e.value==='true':e.type==='range'||e.id==='supply'?Number(e.value):e.value;
  if($(e.id+'Value'))$(e.id+'Value').textContent=e.value+e.dataset.unit;
  if(slug==='magnetic-brake'){stop();elapsed=0;state.started=false;setfx('jaw',0);}
  if(slug==='polarization')wake(2.5);
  if(slug==='electron-slits')clearHits();
  if(e.id==='frequency'&&oscillator)oscillator.frequency.value=state.frequency;
  draw();
 }));
 ['magnet','stripped','connected','power','filter'].forEach(id=>bind(id,()=>{state[id]=!state[id];if(id==='magnet')tween('magnet',state.magnet?1:0,1.1);if(id==='filter'){tween('filter',state.filter?1:0,.7);wake(3.5);}if(slug==='speaker-lab'&&!M.speaker(state).connected)stopSound();if(slug==='wireless-power'){if(state.power)start();else stop();}}));
 bind('playSignal',()=>{state.playing=!state.playing;if(state.playing)start();else{stop();stopSound();}});bind('referenceSound',sound);
 bind('drop',()=>{stop();elapsed=0;state.started=true;setfx('jaw',0);tween('jaw',1,.2);start();});bind('pauseDrop',()=>running?stop():start());
 bind('dip',()=>{stop();state.formed=true;elapsed=0;setfx('dip',0);tween('dip',1,1.6);});bind('drain',()=>running?stop():start());bind('stepFilm',()=>{stop();elapsed=Math.min(60,elapsed+5);});
 bind('singleElectron',()=>addHits(1));bind('manyElectrons',()=>addHits(100));bind('runElectrons',()=>running?stop():start());bind('clearScreen',()=>{stop();clearHits();});bind('resetExperiment',reset);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();stopSound();if('playing'in state)state.playing=false;draw();}});
 window.addEventListener('pagehide',()=>{stop();stopSound();audio?.close();});
 window.__physicsLab={snapshot:()=>({slug,state:{...state},elapsed,running,hits:hits.map(p=>({...p}))})};
 reset();
})();
