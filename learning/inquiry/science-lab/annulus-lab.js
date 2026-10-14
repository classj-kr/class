(() => {
 'use strict';
 const api=window.scienceAnnulus,$=id=>document.getElementById(id);
 if(!$('annulusCanvas'))return;
 let state=api.initial(),view='top',frameId=0,last=0;
 const tau=2*Math.PI;
 function circle(c,x,y,r,fill,stroke,width=1){c.beginPath();c.arc(x,y,r,0,tau);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
 function label(c,text,x,y,size=13,color='#3a596c'){const pixels=Math.max(14,Math.min(16,size)),box=c.canvas.getBoundingClientRect(),scale=Math.min(box.width/500,box.height/460);c.font=`${pixels/(scale||1)}px system-ui, "Malgun Gothic", sans-serif`;c.textAlign='center';c.fillStyle=color;c.fillText(text,x,y);}
 function arrow(c,x1,y1,x2,y2,color='#3b8b9b',width=2){const a=Math.atan2(y2-y1,x2-x1);c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.strokeStyle=color;c.lineWidth=width;c.stroke();c.beginPath();c.moveTo(x2,y2);c.lineTo(x2-8*Math.cos(a-.45),y2-8*Math.sin(a-.45));c.lineTo(x2-8*Math.cos(a+.45),y2-8*Math.sin(a+.45));c.closePath();c.fillStyle=color;c.fill();}
 function ice(c,x,y,scale=1){for(const [dx,dy,a]of [[-14,-10,-.2],[12,-6,.3],[-3,14,.1]]){c.save();c.translate(x+dx*scale,y+dy*scale);c.rotate(a);c.fillStyle='#d6f2fa';c.strokeStyle='#fff';c.lineWidth=1.6;c.beginPath();c.roundRect(-10*scale,-9*scale,20*scale,18*scale,3);c.fill();c.stroke();c.restore();}}
 function top(c,s){
  const cx=250,cy=220,r=168,kind=api.condition(s),contrast=kind!=='dry'&&kind!=='uniform';
  c.save();c.shadowColor='#a6b8c6';c.shadowBlur=15;c.shadowOffsetY=10;circle(c,cx,cy+4,185,'#d1dce3');c.restore();
  const rim=c.createLinearGradient(65,70,430,360);rim.addColorStop(0,'#fdfefe');rim.addColorStop(.45,'#b5c6d0');rim.addColorStop(.7,'#f7fcff');rim.addColorStop(1,'#8fa4b2');
  circle(c,cx,cy,183,rim,'#a5b9c7',1);circle(c,cx,cy,174,s.filled?(s.heat?'#ecd3b4':'#c8e5ed'):'#eaf1f4','#fafdff',2);
  const water=c.createRadialGradient(cx-35,cy-55,15,cx,cy,145);water.addColorStop(0,s.filled?'#d5f1f4':'#f8fafb');water.addColorStop(1,s.filled?'#90b9cb':'#d9e6eb');
  circle(c,cx,cy,143,water,'#6f9bad',2);circle(c,cx,cy,147,null,'#fff9',3);
  circle(c,cx,cy,45,s.filled?(s.ice?'#74b3d0':'#c8e5ed'):'#edf2f5','#5c8c9f',2);circle(c,cx,cy,48,null,'#f7fdff',3);
  if(s.ice&&s.filled)ice(c,cx,cy,.93);
  if(s.heat&&s.filled){c.strokeStyle='#b77553';c.lineWidth=2;for(let i=0;i<14;i++){const a=i*tau/14;c.beginPath();c.arc(cx,cy,159,a,a+.18);c.stroke();}}
  if(s.tracer&&s.filled){
   const count=s.material==='ink'?90:140;
   for(let i=0;i<count;i++){
    c.beginPath();for(let j=10;j>=0;j--){const p=api.xy(api.point(s,i,Math.max(0,s.time-j*.5)));const x=cx+p.x*r,y=cy+p.y*r;if(j===10)c.moveTo(x,y);else c.lineTo(x,y);}
    c.strokeStyle=s.material==='ink'?'#2467a58a':'#97722655';c.lineWidth=s.material==='ink'?2.3:1.2;c.stroke();
    const p=api.xy(api.point(s,i));circle(c,cx+p.x*r,cy+p.y*r,s.material==='ink'?1.7:1.9,s.material==='ink'?'#205782':'#8f6b14',s.material==='ink'?null:'#fff0ba',.6);
   }
  }
  c.beginPath();c.arc(cx,cy,178,-2.8,-1.8);c.strokeStyle='#fff';c.lineWidth=3;c.stroke();
  label(c,s.ice?'얼음물':s.filled?'물':'안쪽',cx,s.ice?cy+33:cy+8,16,'#173e57');
  label(c,'중간 원통 · 관찰 영역',cx,407,17,'#244b61');
  
  if(s.rotation!=='off'){
   c.beginPath();c.arc(cx,cy,196,-.3,-1.05,true);c.strokeStyle='#468096';c.lineWidth=2.5;c.stroke();
   const a=-1.05,x=cx+196*Math.cos(a),y=cy+196*Math.sin(a);arrow(c,x-4*Math.sin(a),y+4*Math.cos(a),x,y,'#468096',2.5);
   label(c,'반시계 방향',cx,28,17);
  }else label(c,'수조 정지',cx,28,12);
  label(c,contrast?'안팎 온도차 있음':'안팎 온도차 없음',cx,435,17,'#294f66');
 }
 function side(c,s){
  const kind=api.condition(s),contrast=!['dry','uniform'].includes(kind);
  label(c,'반지름 방향의 단면 · 물 순환 모식도',250,36,18);
  c.fillStyle='#d6e1e8';c.beginPath();c.roundRect(42,365,416,18,8);c.fill();
  const cells=[[60,74,'안쪽',s.ice,'#85bed7'],[139,238,'중간 원통',false,'#a3d1df'],[382,62,'바깥쪽',s.heat,'#edc1a0']];
  for(const [x,w,name,on,color]of cells){
   c.fillStyle='#f8fdff';c.fillRect(x,115,w,249);
   if(s.filled){const g=c.createLinearGradient(x,220,x+w,350);g.addColorStop(0,on?color:'#bddde9');g.addColorStop(1,on?color:'#d2eaf2');c.fillStyle=g;c.fillRect(x+2,231,w-4,132);}
   c.strokeStyle='#628a9e';c.lineWidth=2;c.beginPath();c.moveTo(x,108);c.lineTo(x,364);c.lineTo(x+w,364);c.lineTo(x+w,108);c.stroke();
   c.strokeStyle='#fff';c.beginPath();c.moveTo(x+4,114);c.lineTo(x+4,357);c.stroke();label(c,name,x+w/2,95,18);
  }
  if(s.ice&&s.filled)ice(c,98,252,.82);
  if(s.heat&&s.filled){c.strokeStyle='#c77b49';c.lineWidth=3;c.beginPath();for(let x=388;x<440;x+=5){if(x===388)c.moveTo(x,351);else c.lineTo(x,x%2?347:355);}c.stroke();}
  if(contrast){
   c.setLineDash([3,5]);c.beginPath();c.ellipse(258,295,95,46,0,0,tau);c.strokeStyle='#6597b18a';c.lineWidth=1.5;c.stroke();c.setLineDash([]);
   arrow(c,286,249,229,249);arrow(c,163,277,163,314);arrow(c,226,341,286,341);arrow(c,353,315,353,276);
   for(let i=0;i<10;i++){const a=i*tau/10+s.time*.12;circle(c,258+95*Math.cos(a),295-46*Math.sin(a),3.2,'#3588a6');}
   label(c,'차가움',98,326,16,'#24658a');label(c,'따뜻함',412,326,16,'#a35437');
  }
  if(s.tracer&&s.filled&&s.material==='pollen')for(let i=0;i<32;i++){const p=api.point({...s,rotation:'off'},i),x=149+(p.r-.26)/.59*219;circle(c,x,230,1.9,'#927321');}
  label(c,contrast?'차가운 쪽 하강 · 따뜻한 쪽 상승':'안팎 온도차가 없는 비교 조건',250,421,18,'#294f66');
 }
 function paint(canvas,s){const c=canvas.getContext('2d');c.setTransform(2,0,0,2,0,0);c.clearRect(0,0,500,460);if(view==='top')top(c,s);else side(c,s);canvas.dataset.condition=api.condition(s);}
 function draw(){paint($('annulusCanvas'),state);if(state.compare)paint($('annulusBaseline'),{...state,rotation:'off'});}
 function render(message=''){
  for(const [id,key]of [['annulusFill','filled'],['annulusIce','ice'],['annulusHeat','heat'],['annulusTracer','tracer']])$(id).setAttribute('aria-pressed',String(state[key]));
  $('annulusFill').textContent=state.filled?'물 채움 완료':'세 원통에 물 채우기';
  $('annulusIce').textContent=state.ice?'안쪽 얼음 빼기':'안쪽에 얼음 넣기';$('annulusHeat').textContent=state.heat?'바깥쪽 가열 끄기':'바깥쪽 가열하기';
  $('annulusTracer').textContent=state.tracer?'관찰 표지 제거':'중간 원통에 표지 넣기';$('annulusMaterial').value=state.material;$('annulusRotation').value=state.rotation;$('annulusCompare').checked=state.compare;
  $('annulusRun').textContent=state.running?'관찰 멈춤':'관찰 시작';$('annulusRun').setAttribute('aria-pressed',String(state.running));
  $('annulusComparison').hidden=!state.compare||view!=='top';$('annulusCompare').disabled=view!=='top';document.querySelector('.annulus-scenes').classList.toggle('comparing',state.compare&&view==='top');
  document.querySelector('.annulus-legend .trace').style.background=state.material==='ink'?'#2467a5':'#93701d';
  for(const b of document.querySelectorAll('[data-annulus-view]'))b.setAttribute('aria-pressed',String(b.dataset.annulusView===view));
  const kind=api.condition(state);$('annulusCaption').textContent=view==='top'?'표지의 위쪽 모습 · '+api.rotations[state.rotation]:'온도차가 만든 기본적인 연직 순환';
  $('annulusStatus').textContent=message||(view==='side'&&kind!=='dry'&&kind!=='uniform'?'옆면은 냉각 쪽 하강·가열 쪽 상승의 기본 방향을 설명합니다. 회전에 따른 수평 흐름 차이는 ‘위에서 보기’에서 비교하세요.':state.filled&&!state.tracer&&view==='top'?'관찰 표지를 넣으면 흐름을 볼 수 있습니다.':api.descriptions[kind]);draw();
 }
 function frame(now){
  if(!state.running)return;const dt=last?Math.min((now-last)/1000,.06):0;last=now;if(!document.hidden){state.time+=dt;draw();}frameId=requestAnimationFrame(frame);
 }
 function schedule(){cancelAnimationFrame(frameId);last=0;if(state.running)frameId=requestAnimationFrame(frame);}
 function set(key,value){const r=api.change(state,key,value);state=r.state;render(r.message);schedule();}
 $('annulusFill').onclick=()=>{if(!state.filled)set('filled',true);};
 for(const [id,key]of [['annulusIce','ice'],['annulusHeat','heat'],['annulusTracer','tracer']])$(id).onclick=()=>set(key,!state[key]);
 $('annulusMaterial').onchange=e=>set('material',e.target.value);$('annulusRotation').onchange=e=>set('rotation',e.target.value);$('annulusCompare').onchange=e=>set('compare',e.target.checked);
 $('annulusRun').onclick=()=>set('running',!state.running);
 $('annulusStep').onclick=()=>{if(!state.filled){render('물을 채운 뒤 관찰하세요.');return;}state.running=false;state.time+=1;render();schedule();};
 for(const b of document.querySelectorAll('[data-annulus-view]'))b.onclick=()=>{view=b.dataset.annulusView;render();};
 $('resetExperiment').onclick=()=>{state=api.initial();view='top';render();schedule();};
 new ResizeObserver(()=>requestAnimationFrame(draw)).observe(document.querySelector('.annulus-scenes'));
 window.__annulus={getState:()=>({...state}),getCondition:()=>api.condition(state)};render();
})();
