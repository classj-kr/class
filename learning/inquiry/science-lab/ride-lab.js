(function(){
 'use strict';
 const host=document.querySelector('[data-inquiry="ride-acceleration"]');if(!host)return;
 const M=window.scienceRideModels,$=id=>document.getElementById(id),num=id=>Number($(id).value),fmt=(n,d=2)=>{const value=n.toFixed(d);return Number(value)===0?(0).toFixed(d):value;};
 const text=(x,y,s,attr='')=>`<text x="${x}" y="${y}" ${attr}>${s}</text>`;
 const line=(x,y,u,v,color='#56798b',attrs='')=>`<line x1="${x}" y1="${y}" x2="${u}" y2="${v}" stroke="${color}" stroke-width="3" ${attrs}/>`;
 let svgSerial=0;const svgIds=new Map();
 const svg=(body,label,h=330)=>{if(!svgIds.has(label))svgIds.set(label,++svgSerial);const serial=svgIds.get(label),arrows=[['rideX','#137888'],['rideZ','#7757a4'],['rideAcceleration','#bf6426']];const defs=arrows.map(([id,color])=>`<marker id="${id}-${serial}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="${color}"/></marker>`).join('');for(const[id]of arrows)body=body.replaceAll('url(#'+id+')','url(#'+id+'-'+serial+')');return `<svg viewBox="0 0 540 ${h}" role="img" aria-label="${label}"><defs>${defs}</defs>${body}</svg>`;};
 let timer=null,measured=null,graphKey="",graphMap=null,lastReadout=0,diagramKey="";
 const options=()=>({motion:$('motion').value,speed:num('speed'),radius:num('radius'),length:num('length'),angle:num('angle'),position:num('position'),period:num('period'),slope:num('slope'),mount:$('motion').value==='circle'?0:num('mount'),axis:$('axis').value,sensorMode:$('sensorMode').value,time:num('time')});
 const motionNames={circle:'수평 원운동',straight:'등속 직선',elevator:'승강기',swing:'그네',seesaw:'시소',slide:'미끄럼틀'};
 const axisNames={x:'기기 x축',z:'기기 z축',magnitude:'3축 합성 크기'};
 function stop(){if(timer)cancelAnimationFrame(timer);timer=null;$('play').textContent='움직임 재생';}
 function moveApparatus(o,r){
  let px,py;const angle=o.motion==='circle'?0:r.deviceAngle;
  if(o.motion==='swing'){px=270+r.x*166/o.length;py=62-r.z*166/o.length;}
  else if(o.motion==='seesaw'){px=270+r.x*76;py=166-r.z*76;}
  else if(o.motion==='slide'){px=90+r.x*46;py=67-r.z*46;}
  else if(o.motion==='circle'){px=270+r.x*100/o.radius;py=166-r.y*100/o.radius;}
  else if(o.motion==='elevator'){px=270;py=250-r.z/(10*o.speed)*160;}
  else{px=62+r.x/(12*o.speed)*400;py=183;}
  const scene=$('inquiryScene'),rig=scene.querySelector('[data-ride-rig]');
  scene.querySelector('[data-ride-device]').setAttribute('transform',`translate(${px},${py}) rotate(${-angle*180/Math.PI})`);
  if(rig)rig.setAttribute('transform',o.motion==='swing'?`translate(270 62) rotate(${-r.theta*180/Math.PI})`:o.motion==='seesaw'?`translate(270 166) rotate(${-r.theta*180/Math.PI})`:o.motion==='circle'?`translate(270 166) rotate(${-Math.atan2(r.y,r.x)*180/Math.PI})`:`translate(${px} ${py})`);
  scene.querySelector('[data-ride-rope]')?.setAttribute('d',`M270 52V${py-32}`);
  const vector=(id,x,y)=>{const arrow=scene.querySelector('[data-ride-vector="'+id+'"]');if(!arrow)return;for(const[k,v]of Object.entries({x1:px,y1:py,x2:x,y2:y}))arrow.setAttribute(k,v);};
  if(o.motion!=='circle'){
   vector('x',px+52*Math.cos(angle),py-52*Math.sin(angle));vector('z',px-48*Math.sin(angle),py-48*Math.cos(angle));
   for(const[id,x,y]of [['x',px+58*Math.cos(angle),py-58*Math.sin(angle)],['z',px-56*Math.sin(angle),py-56*Math.cos(angle)]]){const t=scene.querySelector('[data-ride-axis="'+id+'"]');t.setAttribute('x',x);t.setAttribute('y',y);}
  }
  const vertical=o.motion==='circle'?r.ay:r.az,a=Math.hypot(r.ax,vertical),arrow=scene.querySelector('[data-ride-vector="a"]');arrow.style.display=a>1e-7?'':'none';if(a>1e-7)vector('a',px+55*r.ax/a,py-55*vertical/a);
 }
 function diagram(o,r){
  const key=JSON.stringify({...o,time:0});if(key===diagramKey){moveApparatus(o,r);return;}diagramKey=key;
  let body='',px,py,angle=r.deviceAngle;
  const steel='url(#rideMetal)',ground='<path d="M28 287H512" stroke="#c4d4da" stroke-width="2"/><path d="M36 295H504" stroke="#e2ebee" stroke-width="6" stroke-linecap="round"/>';
  body+='<defs><linearGradient id="rideMetal"><stop stop-color="#69848f"/><stop offset=".4" stop-color="#c7d7dd"/><stop offset=".6" stop-color="#91aab5"/><stop offset="1" stop-color="#58717e"/></linearGradient><linearGradient id="rideSeat" x2="0" y2="1"><stop stop-color="#64aaa9"/><stop offset="1" stop-color="#256e75"/></linearGradient><linearGradient id="rideTrack" x2="0" y2="1"><stop stop-color="#d5e5ea"/><stop offset="1" stop-color="#a5c0cb"/></linearGradient></defs>';
  if(o.motion==='swing'){
   const cx=270,cy=62,scale=166/o.length;px=cx+r.x*scale;py=cy-r.z*scale;
   body+=ground+`<path d="M139 285L208 58H332L401 285M208 58L230 285M332 58L310 285" fill="none" stroke="${steel}" stroke-width="8" stroke-linecap="round"/><rect x="193" y="51" width="154" height="16" rx="7" fill="${steel}"/>`;
   body+=`<path d="M${cx-166*Math.sin(o.angle*Math.PI/180)} ${cy+166*Math.cos(o.angle*Math.PI/180)} A166 166 0 0 0 ${cx+166*Math.sin(o.angle*Math.PI/180)} ${cy+166*Math.cos(o.angle*Math.PI/180)}" fill="none" stroke="#bed2d9" stroke-dasharray="3 6"/>`;
   body+=`<g data-ride-rig transform="translate(${cx} ${cy}) rotate(${-r.theta*180/Math.PI})"><path d="M-18 0V166M18 0V166" stroke="#617b85" stroke-width="2.5"/><path d="M-29 162H29V171Q0 180-29 171Z" fill="url(#rideSeat)"/><path d="M-29 162H29" stroke="#8cc7c4" stroke-width="3"/></g><circle cx="270" cy="62" r="5" fill="#405d6a"/>`;
   body+=text(22,28,'줄 길이 '+fmt(o.length,1)+' m')+text(22,320,'최대 기울기 '+fmt(o.angle,1)+'°');
  }else if(o.motion==='seesaw'){
   const cx=270,cy=166,scale=76;px=cx+r.x*scale;py=cy-r.z*scale;
   body+=ground+`<path d="M237 283L265 166H275L303 283Z" fill="${steel}"/><g data-ride-rig transform="translate(270 166) rotate(${-r.theta*180/Math.PI})"><rect x="-178" y="-6" width="356" height="15" rx="6" fill="url(#rideSeat)"/><rect x="-173" y="-12" width="48" height="8" rx="4" fill="#365c68"/><rect x="125" y="-12" width="48" height="8" rx="4" fill="#365c68"/><path d="M-133-10V-34h13M133-10V-34h-13" fill="none" stroke="#597e8e" stroke-width="4"/></g><circle cx="270" cy="166" r="9" fill="#e7b461" stroke="#976b36" stroke-width="2"/>`;
   body+=text(22,28,'회전축에서 센서까지 '+fmt(o.position,1)+' m');
  }else if(o.motion==='slide'){
   const slope=o.slope*Math.PI/180,scale=46,endX=90+6*Math.cos(slope)*scale,endY=67+6*Math.sin(slope)*scale;px=90+r.x*scale;py=67-r.z*scale;
   body+=ground+`<path d="M90 75V285M${endX} ${endY+7}V285" stroke="${steel}" stroke-width="8"/><path d="M52 285L80 69" stroke="#8da7b3" stroke-width="5"/>`;
   for(let i=0;i<5;i++)body+=line(56+i*5,250-i*35,90,250-i*35,'#8da7b3','stroke-width="3"');
   body+=`<path d="M90 67L${endX} ${endY}" stroke="url(#rideTrack)" stroke-width="17" stroke-linecap="round"/><path d="M90 60L${endX+4} ${endY-7}" stroke="#7799a9" stroke-width="3"/>`;
   body+=text(22,28,'마찰 없는 경사면 · 6 m')+text(22,320,'경사각 '+o.slope+'°');
  }else if(o.motion==='circle'){
   px=270+r.x*100/o.radius;py=166-r.y*100/o.radius;angle=0;
   body+=`<circle cx="270" cy="166" r="115" fill="#e7f0f2" stroke="#cbdee4"/><circle cx="270" cy="166" r="100" fill="none" stroke="#a1bcc7" stroke-width="2" stroke-dasharray="4 5"/><g data-ride-rig transform="translate(270 166) rotate(${-Math.atan2(r.y,r.x)*180/Math.PI})"><circle r="78" fill="url(#rideTrack)" stroke="#a4bdc7"/>`;
   for(let i=0;i<6;i++)body+=`<path d="M0 0H76" transform="rotate(${i*60})" stroke="#edf6f7" stroke-width="2"/>`;
   body+=`<path d="M0 0H100" stroke="#729aaa" stroke-width="4"/><rect x="84" y="-21" width="30" height="42" rx="9" fill="url(#rideSeat)" stroke="#2b6d72"/></g><circle cx="270" cy="166" r="9" fill="#6b8b98"/><circle cx="270" cy="166" r="4" fill="#e5eff2"/>`;
   body+=text(22,28,'위에서 본 수평 궤도')+text(22,320,'반지름 '+fmt(o.radius,1)+' m');
  }else if(o.motion==='elevator'){
   px=270;py=250-r.z/(10*o.speed)*160;
   body+=ground+`<rect x="211" y="48" width="118" height="233" rx="6" fill="#e6eff2" stroke="#bfd2da"/><path d="M225 54V278M315 54V278" stroke="${steel}" stroke-width="5"/><path data-ride-rope d="M270 52V${py-32}" stroke="#77929f" stroke-width="2"/><g data-ride-rig transform="translate(270 ${py})"><rect x="-39" y="-31" width="78" height="62" rx="5" fill="url(#rideTrack)" stroke="#7999a8"/><rect x="-30" y="-24" width="60" height="48" fill="#f6fbfc"/><path d="M0-24V24" stroke="#c2d7df"/><path d="M-39 31H39" stroke="#537785" stroke-width="4"/></g>`;
   for(let i=0;i<4;i++)body+=line(335,83+i*55,362,83+i*55,'#ccdce2');
   body+=text(22,28,'상승 · 가속 → 등속 → 감속');
  }else{
   px=62+r.x/(12*o.speed)*400;py=183;
   body+=ground+`<path d="M35 208H505" stroke="#87a7b5" stroke-width="4"/><path d="M35 214H505" stroke="#d0dfe5" stroke-width="3"/>`;
   for(let i=0;i<10;i++)body+=line(45+i*48,217,45+i*48,227,'#becfd6','stroke-width="1"');
   body+=`<g data-ride-rig transform="translate(${px} ${py})"><rect x="-29" y="-4" width="58" height="21" rx="6" fill="url(#rideSeat)"/><circle cx="-19" cy="20" r="7" fill="#526c79"/><circle cx="19" cy="20" r="7" fill="#526c79"/><circle cx="-19" cy="20" r="3" fill="#d1e2e8"/><circle cx="19" cy="20" r="3" fill="#d1e2e8"/></g>`;
   body+=text(22,28,'등속 직선 운동');
  }
  body+=`<g data-ride-device transform="translate(${px},${py}) rotate(${-angle*180/Math.PI})"><rect x="-21" y="-13" width="42" height="26" rx="6" fill="#203c49" stroke="#7895a2"/><rect x="-16" y="-9" width="28" height="18" rx="3" fill="#cce9e2"/><path d="M-13 3h5l3-7 4 10 3-5h6" fill="none" stroke="#4b958c" stroke-width="1.4"/><circle cx="17" cy="0" r="1.6" fill="#c4d9df"/></g>`;
  if(o.motion!=='circle'){
   body+=line(px,py,px+52*Math.cos(angle),py-52*Math.sin(angle),'#137888','data-ride-vector="x" marker-end="url(#rideX)"')+text(px+58*Math.cos(angle),py-58*Math.sin(angle),'x','data-ride-axis="x"');
   body+=line(px,py,px-48*Math.sin(angle),py-48*Math.cos(angle),'#7757a4','data-ride-vector="z" marker-end="url(#rideZ)"')+text(px-56*Math.sin(angle),py-56*Math.cos(angle),'z','data-ride-axis="z"');
  }
  const vertical=o.motion==='circle'?r.ay:r.az,a=Math.hypot(r.ax,vertical);
  body+=line(px,py,px+55*r.ax/(a||1),py-55*vertical/(a||1),'#bf6426','data-ride-vector="a" marker-end="url(#rideAcceleration)"'+(a>1e-7?'':' style="display:none"'));
  window.scienceScene.render($('inquiryScene'),svg(body,'놀이기구와 부착한 가상 센서, 기기 축과 운동 가속도 방향',340)+'<p class="ride-legend">주황 화살표: 운동 가속도 방향 · 화살표 길이는 확대 표시'+(o.motion==='circle'?' · z축은 화면에 수직인 위쪽':' · x·z: 센서의 양의 축 방향')+'</p>');
 }
 function graph(o,r){
  const key=JSON.stringify({...o,time:0,interval:num("interval"),measured:measured?.length||0});
  if(graphKey===key){const x=graphMap(r.time),cursor=$("rideCursor");cursor.setAttribute("x1",x);cursor.setAttribute("x2",x);return;}graphKey=key;
  const points=measured||M.samples(o,0,num('interval')),values=points.map(p=>p.reading),low=Math.min(0,...values),high=Math.max(0,...values),pad=Math.max(1,(high-low)*.12),min=low-pad,max=high+pad;
  const px=t=>65+t/r.duration*450,py=v=>225-(v-min)/(max-min)*165;
  graphMap=px;let body=text(20,24,(o.sensorMode==='raw'?'원시 센서':'중력 보정')+' · '+axisNames[o.axis]+' (m/s²)');
  for(let i=0;i<=4;i++){const y=min+(max-min)*i/4;body+=line(65,py(y),515,py(y),'#dce5e9','stroke-width="1"')+text(57,py(y)+5,fmt(y,1),'text-anchor="end"')+text(px(r.duration*i/4),247,fmt(r.duration*i/4,1),'text-anchor="middle"');}
  if(measured){body+=`<polyline points="${points.map(p=>px(p.time)+','+py(p.reading)).join(' ')}" fill="none" stroke="#167586" stroke-width="2"/>`+points.map(p=>`<circle cx="${px(p.time)}" cy="${py(p.reading)}" r="2.6" fill="#167586"/>`).join('');}
  body+=line(px(r.time),50,px(r.time),225,'#bf6426','id="rideCursor" stroke-dasharray="4 3"')+text(280,279,'시간 (초)','text-anchor="middle"');
  window.scienceScene.render($('inquiryExtra'),svg(body,'가상 센서 측정값의 시간 그래프',295));
  $('measurementSummary').textContent=measured?`${points.length}개 가상 측정값 · 간격 ${num('interval')}초 · 최솟값 ${fmt(Math.min(...values))}, 최댓값 ${fmt(Math.max(...values))} m/s². 주황 선은 선택한 시각입니다.`:'가상 측정을 누르면 일정한 간격으로 얻은 값이 표시됩니다.';
 }
 function draw(moving=false){
  const o=options();let r=M.model(o);$('time').max=fmt(r.duration,3);if(o.time>r.duration){$('time').value=0;o.time=0;r=M.model(o);}
  if(!moving)for(const el of host.querySelectorAll('[data-motions]'))el.hidden=!el.dataset.motions.split(' ').includes(o.motion);
  diagram(o,r);graph(o,r);
  const now=performance.now();if(moving&&now-lastReadout<100)return;lastReadout=now;
  for(const el of host.querySelectorAll('input[type=range]'))$(el.id+'Value').textContent=(el.id==='time'?fmt(num('time')):el.value)+' '+el.dataset.unit;
  const rows=[['운동 속력',fmt(r.speed)+' m/s'],['운동 가속도 크기',fmt(r.acceleration)+' m/s²'],['원시 센서 크기',fmt(r.sensor)+' m/s²'],[axisNames[o.axis]+' 선택값',fmt(r.reading)+' m/s²']];
  window.scienceScene.render($('inquiryReadout'),rows.map(([label,value])=>`<div><span>${label}</span><strong>${value}</strong></div>`).join(''));
  $('inquiryStatus').textContent=`${motionNames[o.motion]} · ${fmt(r.time)}초. ${o.motion==='seesaw'?'시소는 설정한 각도·주기로 왕복하도록 구동한 모형입니다.':o.motion==='slide'?'경사면 끝의 충돌·정지는 계산에 포함하지 않습니다.':o.motion==='swing'?'한쪽에서 가만히 놓은 그네입니다.':'원시 센서와 중력 보정값을 비교하세요.'}`;
 }
 function reset(){stop();measured=null;graphKey='';host.querySelectorAll('input').forEach(e=>e.value=e.defaultValue);host.querySelectorAll('select').forEach(e=>e.selectedIndex=0);$('motion').value=window.scienceAppContext?.defaultMotion||'circle';draw();}
 host.querySelectorAll('input,select').forEach(e=>e.addEventListener('input',()=>{stop();if(e.id!=='time'){measured=null;$('time').value=0;}draw();}));
 $('measureRide').onclick=()=>{stop();const o=options();measured=M.samples(o,M.model(o).duration,num('interval'));draw();};
 $('play').onclick=()=>{if(timer){stop();draw();return;}const max=Number($('time').max);if(num('time')>=max-.001)$('time').value=0;$('time').step='.001';let time=num('time'),last=0;$('play').textContent='일시 정지';function frame(now){if(last)time=Math.min(max,time+Math.min((now-last)/1000,.08));last=now;$('time').value=time;draw(true);if(time>=max){stop();draw();}else timer=requestAnimationFrame(frame);}timer=requestAnimationFrame(frame);};
 $('step').onclick=()=>{stop();$('time').value=Math.min(Number($('time').max),num('time')+.5);draw();};
 $('resetExperiment').onclick=reset;window.addEventListener('pagehide',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 window.__inquiryLab={snapshot:()=>({slug:'ride-acceleration',running:!!timer,state:{options:options(),model:M.model(options()),samples:measured}})};

 const controls=host.querySelector('.control-panel'),workbench=document.createElement('div'),stage=document.createElement('div'),playback=document.createElement('div');
 workbench.className='ride-workbench';stage.className='ride-stage';playback.className='ride-playback';
 const motion=$('motion').closest('label');motion.classList.add('ride-motion-choice');controls.before(motion,workbench);workbench.append(stage,controls);
 stage.append($('inquiryScene'));playback.append($('time').closest('label'),$('play'),$('step'));stage.append(playback,$('inquiryReadout'));
 $('inquiryExtra').before($('measurementSummary'));
 reset();
})();
