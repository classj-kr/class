(function(){
 'use strict';
 const host=document.querySelector('[data-inquiry="ride-acceleration"]');if(!host)return;
 const M=window.scienceRideModels,$=id=>document.getElementById(id),num=id=>Number($(id).value),fmt=(n,d=2)=>Math.abs(n)<.00001?(0).toFixed(d):n.toFixed(d);
 const text=(x,y,s,attr='')=>`<text x="${x}" y="${y}" ${attr}>${s}</text>`;
 const line=(x,y,u,v,color='#56798b',attrs='')=>`<line x1="${x}" y1="${y}" x2="${u}" y2="${v}" stroke="${color}" stroke-width="3" ${attrs}/>`;
 const svg=(body,label,h=330)=>`<svg viewBox="0 0 540 ${h}" role="img" aria-label="${label}"><defs><marker id="rideArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="context-stroke"/></marker></defs>${body}</svg>`;
 let timer=null,measured=null;
 const options=()=>({motion:$('motion').value,speed:num('speed'),radius:num('radius'),length:num('length'),angle:num('angle'),position:num('position'),period:num('period'),slope:num('slope'),mount:$('motion').value==='circle'?0:num('mount'),axis:$('axis').value,sensorMode:$('sensorMode').value,time:num('time')});
 const motionNames={circle:'수평 원운동',straight:'등속 직선',elevator:'승강기',swing:'그네',seesaw:'시소',slide:'미끄럼틀'};
 const axisNames={x:'기기 x축',z:'기기 z축',magnitude:'3축 합성 크기'};
 function stop(){if(timer)clearInterval(timer);timer=null;$('play').textContent='움직임 재생';}
 function diagram(o,r){
  let body='',px,py,scale=40,angle=r.deviceAngle;
  if(o.motion==='swing'){
   const cx=270,cy=45;scale=175/o.length;px=cx+r.x*scale;py=cy-r.z*scale;
   body+=line(145,cy,395,cy)+line(cx,cy,px,py)+`<path d="M${cx-185*Math.sin(o.angle*Math.PI/180)} ${cy+185*Math.cos(o.angle*Math.PI/180)} Q${cx} ${cy+210} ${cx+185*Math.sin(o.angle*Math.PI/180)} ${cy+185*Math.cos(o.angle*Math.PI/180)}" fill="none" stroke="#bfccd2" stroke-dasharray="4 5"/>`;
   body+=text(26,32,'줄 길이 '+fmt(o.length,1)+' m')+text(26,275,'수직선에서의 각도 '+fmt(r.theta*180/Math.PI,1)+'°');
  }else if(o.motion==='seesaw'){
   const cx=270,cy=160;scale=70;px=cx+r.x*scale;py=cy-r.z*scale;
   body+=`<path d="M250 210L270 160L290 210Z" fill="#c6d5dc" stroke="#527582"/>`+line(cx-2*Math.cos(r.theta)*scale,cy+2*Math.sin(r.theta)*scale,cx+2*Math.cos(r.theta)*scale,cy-2*Math.sin(r.theta)*scale,'#ad7447','stroke-width="9"');
   body+=text(22,32,'축에서 센서까지 '+fmt(o.position,1)+' m')+text(22,275,'같은 왕복 운동에서 부착 위치를 바꿔 보세요.');
  }else if(o.motion==='slide'){
   const slope=o.slope*Math.PI/180;scale=52;px=70+r.x*scale;py=70-r.z*scale;
   body+=`<path d="M70 70L${70+6*Math.cos(slope)*scale} ${70+6*Math.sin(slope)*scale}L70 ${70+6*Math.sin(slope)*scale}Z" fill="#dfebef" stroke="#70939e"/>`;
   body+=text(22,32,'마찰 없는 경사면 · 길이 6 m')+text(22,310,'경사면 끝에 도달하는 순간까지 관찰합니다.');
  }else if(o.motion==='circle'){
   scale=100/o.radius;px=270+r.x*scale;py=150-r.y*scale;angle=0;
   body+=`<circle cx="270" cy="150" r="100" fill="none" stroke="#b6ccd6" stroke-width="3"/>`+text(270,155,'중심','text-anchor="middle"')+text(22,32,'위에서 본 수평 궤도');
  }else if(o.motion==='elevator'){
   px=270;py=245-r.z/(10*o.speed)*190;
   body+=`<rect x="235" y="40" width="70" height="228" fill="#edf4f6" stroke="#a6c3cd"/>`+text(22,32,'상승 · 가속 → 등속 → 감속');
  }else{px=45+r.x/(12*o.speed)*445;py=155;body+=line(35,180,510,180,'#bfd2db')+text(22,32,'등속 직선 운동');}
  body+=`<g transform="translate(${px},${py}) rotate(${-angle*180/Math.PI})"><rect x="-20" y="-12" width="40" height="24" rx="5" fill="#195e71"/><rect x="-12" y="-8" width="22" height="16" rx="2" fill="#d9f1ed"/></g>`;
  if(o.motion!=='circle'){
   body+=line(px,py,px+52*Math.cos(angle),py-52*Math.sin(angle),'#137888','marker-end="url(#rideArrow)"')+text(px+58*Math.cos(angle),py-58*Math.sin(angle),'x');
   body+=line(px,py,px-48*Math.sin(angle),py-48*Math.cos(angle),'#7757a4','marker-end="url(#rideArrow)"')+text(px-56*Math.sin(angle),py-56*Math.cos(angle),'z');
  }
  const aVertical=o.motion==='circle'?r.ay:r.az,a=Math.hypot(r.ax,aVertical);
  if(a>1e-7)body+=line(px,py,px+55*r.ax/a,py-55*aVertical/a,'#bf6426','marker-end="url(#rideArrow)"');
  $('inquiryScene').innerHTML=svg(body,'놀이기구와 부착한 가상 센서, 기기 축과 운동 가속도 방향')+'<p class="ride-legend">주황 화살표: 운동 가속도 방향 · 화살표 길이는 확대 표시'+(o.motion==='circle'?' · z축은 화면에 수직인 위쪽':' · x·z: 센서의 양의 축 방향')+'</p>';
 }
 function graph(o,r){
  const points=measured||M.samples(o,0,num('interval')),values=points.map(p=>p.reading),low=Math.min(0,...values),high=Math.max(0,...values),pad=Math.max(1,(high-low)*.12),min=low-pad,max=high+pad;
  const px=t=>65+t/r.duration*450,py=v=>225-(v-min)/(max-min)*165;
  let body=text(20,24,(o.sensorMode==='raw'?'원시 센서':'중력 보정')+' · '+axisNames[o.axis]+' (m/s²)');
  for(let i=0;i<=4;i++){const y=min+(max-min)*i/4;body+=line(65,py(y),515,py(y),'#dce5e9','stroke-width="1"')+text(57,py(y)+5,fmt(y,1),'text-anchor="end"')+text(px(r.duration*i/4),247,fmt(r.duration*i/4,1),'text-anchor="middle"');}
  if(measured){body+=`<polyline points="${points.map(p=>px(p.time)+','+py(p.reading)).join(' ')}" fill="none" stroke="#167586" stroke-width="2"/>`+points.map(p=>`<circle cx="${px(p.time)}" cy="${py(p.reading)}" r="2.6" fill="#167586"/>`).join('');}
  body+=line(px(r.time),50,px(r.time),225,'#bf6426','stroke-dasharray="4 3"')+text(280,279,'시간 (초)','text-anchor="middle"');
  $('inquiryExtra').innerHTML=svg(body,'가상 센서 측정값의 시간 그래프',295);
  $('measurementSummary').textContent=measured?`${points.length}개 가상 측정값 · 간격 ${num('interval')}초 · 최솟값 ${fmt(Math.min(...values))}, 최댓값 ${fmt(Math.max(...values))} m/s². 주황 선은 선택한 시각입니다.`:'가상 측정을 누르면 일정한 간격으로 얻은 값이 표시됩니다.';
 }
 function draw(){
  const o=options();let r=M.model(o);$('time').max=fmt(r.duration,3);if(o.time>r.duration){$('time').value=0;o.time=0;r=M.model(o);}
  for(const el of host.querySelectorAll('[data-motions]'))el.hidden=!el.dataset.motions.split(' ').includes(o.motion);
  for(const el of host.querySelectorAll('input[type=range]'))$(el.id+'Value').textContent=el.value+' '+el.dataset.unit;
  diagram(o,r);graph(o,r);
  const rows=[['운동 속력',fmt(r.speed)+' m/s'],['운동 가속도 크기',fmt(r.acceleration)+' m/s²'],['원시 센서 크기',fmt(r.sensor)+' m/s²'],[axisNames[o.axis]+' 선택값',fmt(r.reading)+' m/s²']];
  $('inquiryReadout').innerHTML=rows.map(([label,value])=>`<div><span>${label}</span><strong>${value}</strong></div>`).join('');
  $('inquiryStatus').textContent=`${motionNames[o.motion]} · ${fmt(r.time)}초. ${o.motion==='seesaw'?'시소는 설정한 각도·주기로 왕복하도록 구동한 모형입니다.':o.motion==='slide'?'경사면 끝의 충돌·정지는 계산에 포함하지 않습니다.':o.motion==='swing'?'한쪽에서 가만히 놓은 그네입니다.':'원시 센서와 중력 보정값을 비교하세요.'}`;
 }
 function reset(){stop();measured=null;host.querySelectorAll('input').forEach(e=>e.value=e.defaultValue);host.querySelectorAll('select').forEach(e=>e.selectedIndex=0);$('motion').value=window.scienceAppContext?.defaultMotion||'circle';draw();}
 host.querySelectorAll('input,select').forEach(e=>e.addEventListener('input',()=>{stop();if(e.id!=='time'){measured=null;$('time').value=0;}draw();}));
 $('measureRide').onclick=()=>{stop();const o=options();measured=M.samples(o,M.model(o).duration,num('interval'));draw();};
 $('play').onclick=()=>{if(timer){stop();return;}if(num('time')>=Number($('time').max)-.01)$('time').value=0;$('play').textContent='일시 정지';timer=setInterval(()=>{const max=Number($('time').max);$('time').value=Math.min(max,num('time')+.05);draw();if(num('time')>=max-.01)stop();},50);};
 $('step').onclick=()=>{stop();$('time').value=Math.min(Number($('time').max),num('time')+.5);draw();};
 $('resetExperiment').onclick=reset;window.addEventListener('pagehide',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 window.__inquiryLab={snapshot:()=>({slug:'ride-acceleration',running:!!timer,state:{options:options(),model:M.model(options()),samples:measured}})};
 reset();
})();
