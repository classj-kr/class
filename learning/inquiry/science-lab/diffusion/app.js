document.addEventListener('DOMContentLoaded',()=>{
 'use strict';const M=window.DiffusionModel,$=s=>document.querySelector(s),canvas=$('#dfCanvas'),ctx=canvas.getContext('2d');
 let mode='ink',position='centre',substance='vinegar',view='observation',progress=0,running=false,raf=0,last=0,free=[],freeTick=0;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),off=document.createElement('canvas');off.width=off.height=M.N;const oc=off.getContext('2d');
 const mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
 function ellipse(x,y,rx,ry,fill,stroke,line=2){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=line;ctx.stroke();}}
 function path(points,stroke,width){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.lineJoin='round';ctx.stroke();}
 function beaker(){
  ctx.save();ctx.beginPath();ctx.roundRect(105,106,330,252,[0,0,16,16]);ctx.clip();ctx.fillStyle='#e6f3f7';ctx.fillRect(105,106,330,252);
  if(view==='observation'){
   const values=M.ink(progress,position),img=oc.createImageData(M.N,M.N);values.forEach((v,i)=>{const c=mix([230,243,247],[32,58,133],1-Math.exp(-v*5));img.data.set([...c,255],i*4);});oc.putImageData(img,0,0);ctx.imageSmoothingEnabled=true;ctx.drawImage(off,105,106,330,252);
  }else{const points=progress>=1&&free.length?free:M.particles('ink',progress,position);for(const p of points)ellipse(109+p.x*322,110+p.y*244,2.5,2.5,'#294d99');}
  ctx.restore();ellipse(270,106,165,10,null,'#8fbaca',1.5);
  path([[99,72],[100,350],[105,365],[435,365],[440,350],[440,72]],'#658894',3);
  path([[99,72],[83,63],[114,63],[119,72]],'#658894',3);path([[119,72],[440,72]],'#95b0ba',2);
  for(let y=140;y<330;y+=42)path([[415,y],[432,y]],'#7195a4',1.4);
  const sx=105+({left:.25,centre:.5,right:.75}[position])*330;
  if(progress===0){const g=ctx.createLinearGradient(sx-6,0,sx+6,0);g.addColorStop(0,'#d6e7ea');g.addColorStop(.5,'#fff');g.addColorStop(1,'#94b3c0');ctx.fillStyle=g;ctx.fillRect(sx-5,40,10,277);path([[sx-5,40],[sx-5,317],[sx,332],[sx+5,317],[sx+5,40]],'#6c8d9c',1.5);ellipse(sx,37,14,26,'#264f65');}
  const shine=ctx.createLinearGradient(100,0,140,0);shine.addColorStop(0,'rgba(255,255,255,.7)');shine.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=shine;ctx.fillRect(108,118,25,230);
 }
 function dish(){
  const cx=270,cy=211,r=175;ellipse(cx,cy+8,r+6,r+6,'#d8e8ed');ellipse(cx,cy,r,r,'#fbfcf5','#8baab8',2.5);
  for(const d of M.btb(progress,substance)){const x=cx+d.x*69,y=cy+d.y*69,c=mix([74,146,107],[231,193,48],d.yellow);ellipse(x,y+3,12,9,'rgba(65,90,100,.14)');const g=ctx.createRadialGradient(x-4,y-4,1,x,y,12);g.addColorStop(0,'#eff4cb');g.addColorStop(.35,'rgb('+c.join(',')+')');g.addColorStop(1,'rgb('+c.map(v=>Math.round(v*.8)).join(',')+')');ellipse(x,y,12,10,g,'#587b68',.7);}
  ellipse(cx,cy+2,14,11,'#b6dce4','#6f9fac',1.3);ellipse(cx-4,cy-3,4,2,'#f5fcff');
  if(view==='particles'&&substance==='vinegar'){const points=progress>=1&&free.length?free:M.particles('btb',progress);for(const p of points)ellipse(cx+(p.x-.5)*330,cy+(p.y-.5)*330,2.3,2.3,'#82499a');}
  ellipse(cx,cy,r-8,r-8,null,'rgba(158,189,198,.6)',1);ctx.beginPath();ctx.arc(cx,cy,r-4,Math.PI*1.15,Math.PI*1.7);ctx.lineWidth=6;ctx.strokeStyle='rgba(255,255,255,.7)';ctx.stroke();
 }
 function draw(){const width=Math.max(1,canvas.getBoundingClientRect().width),dpr=devicePixelRatio||1,height=width*420/540;
  if(canvas.width!==Math.round(width*dpr)||canvas.height!==Math.round(height*dpr)){canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);}
  ctx.setTransform(canvas.width/540,0,0,canvas.height/420,0,0);ctx.clearRect(0,0,540,420);mode==='ink'?beaker():dish();
 }
 function render(){
  const ink=mode==='ink';document.querySelectorAll('[data-df-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.dfMode===mode));document.querySelectorAll('[data-df-view]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.dfView===view));
  $('#dfInkControls').hidden=!ink;$('#dfBtbControls').hidden=ink;$('#dfDropGroups').hidden=ink;
  $('#dfMethod').textContent=ink?'스포이트 끝을 물속 바닥 가까이 대고 잉크를 천천히 넣습니다. 물을 젓지 않고 변화를 관찰하세요.':'BTB 방울을 일정한 간격으로 떨어뜨리고, 가운데에 '+(substance==='vinegar'?'식초':'물')+'를 1~2방울 놓은 뒤 뚜껑을 덮습니다. 액체 방울은 서로 닿지 않습니다.';
  $('#dfSceneTitle').textContent=ink?'물속 잉크의 확산':'덮개를 덮은 페트리 접시';
  canvas.setAttribute('aria-label',(ink?'바닥에 넣은 잉크가 물속으로 퍼지는 모습':'중앙의 '+(substance==='vinegar'?'식초':'물')+'와 떨어져 있는 BTB 방울의 색 변화')+(view==='particles'?' — 입자 모형':''));
  $('#dfKey').textContent=view==='observation'?(ink?'파란색: 물속의 잉크':'중앙: '+(substance==='vinegar'?'식초':'물')+' · 주변: BTB 용액 · '+(substance==='vinegar'?'초록색 → 노란색':'초록색 유지')):(ink?'파란 점: 잉크 입자 · 물 입자는 생략':substance==='vinegar'?'보라색 점: 증발한 아세트산 입자 · 공기 입자는 생략':'아세트산 없음 · 물과 공기 입자는 생략');
  $('#dfProgress').value=String(Math.round(progress*100));$('#dfStage').textContent=progress===0?'처음':progress<.33?'퍼지기 시작':progress<.75?'퍼지는 중':'충분히 지난 뒤';
  $('#playBtn').textContent=running?'잠시 멈추기':progress>=1&&view==='particles'?'입자 운동 계속 보기':progress>=1?'다시 관찰':'관찰 시작';
  $('#dfObservation').textContent=ink?(progress===0?'잉크가 바닥 가까운 곳에 모여 있습니다.':progress<.35?'잉크를 넣은 곳에서 주변으로 색이 퍼집니다.':progress<.8?'잉크가 퍼지면서 진한 곳과 연한 곳의 차이가 줄어듭니다.':'물이 거의 고른 색을 띱니다. 잉크 입자는 여전히 여러 방향으로 움직입니다.'):(substance==='water'?'중앙에 물을 놓으면 이 조건에서 BTB의 초록색이 유지됩니다.':progress<.26?'서로 떨어진 BTB 방울의 색을 비교하세요.':progress<.43?'식초에 가까운 BTB 방울부터 노랗게 변합니다.':progress<.76?'더 먼 방울에도 색 변화가 나타납니다.':'아세트산이 퍼지면서 먼 방울도 노랗게 변합니다.');
  if(!ink){const ds=M.btb(progress,substance);for(const group of ['near','middle','far']){const t=ds.find(d=>d.group===group).yellow,label=t===0?'초록색':t>=1?'노란색':'변하는 중',el=$('#df-'+group);el.querySelector('strong').textContent=label;el.querySelector('.df-swatch').style.backgroundColor='rgb('+mix([74,146,107],[231,193,48],t).join(',')+')';}}
  draw();
 }
 function pause(){running=false;cancelAnimationFrame(raf);last=0;}
 function reset(){pause();progress=0;free=[];freeTick=0;render();}
 function drift(){if(!free.length)free=M.particles(mode,1,position).map(p=>({...p}));freeTick++;
  for(const p of free){const angle=(Math.sin((p.id+1)*127.1+freeTick*311.7)*43758.5453%1)*Math.PI*2,step=.005,nx=p.x+Math.cos(angle)*step,ny=p.y+Math.sin(angle)*step;if(mode==='ink'){p.x=M.reflect(nx);p.y=M.reflect(ny);}else if(Math.hypot(nx-.5,ny-.5)<.48){p.x=nx;p.y=ny;}}
 }
 function tick(time){if(!running)return;const dt=last?Math.min(80,time-last):0;last=time;
  if(progress<1){progress=Math.min(1,progress+dt/16000);render();}else if(view==='particles'){drift();draw();}else{pause();render();return;}raf=requestAnimationFrame(tick);
 }
 function play(){if(running){pause();render();return;}if(progress>=1&&view==='observation'){progress=0;free=[];}if(reduced.matches){progress=1;render();return;}running=true;last=0;render();raf=requestAnimationFrame(tick);}
 document.querySelectorAll('[data-df-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.dfMode;reset();}));document.querySelectorAll('[data-df-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.dfView;render();}));
 $('#dfPosition').addEventListener('change',e=>{position=e.target.value;reset();});$('#dfSubstance').addEventListener('change',e=>{substance=e.target.value;reset();});
 $('#dfProgress').addEventListener('input',e=>{pause();progress=+e.target.value/100;free=[];render();});$('#playBtn').addEventListener('click',play);$('#resetBtn').addEventListener('click',reset);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){pause();render();}});new ResizeObserver(draw).observe(canvas);reduced.addEventListener('change',()=>{if(reduced.matches){pause();render();}});
 window.__diffusionModel={...M,state:()=>({mode,position,substance,view,progress,running,free:free.map(p=>({...p})),drops:M.btb(progress,substance)}),setMode(v){mode=v;reset();},setPosition(v){position=v;$('#dfPosition').value=v;reset();},setSubstance(v){substance=v;$('#dfSubstance').value=v;reset();},setView(v){view=v;render();},setProgress(v){pause();progress=M.clamp(v);free=[];render();}};
 render();
});
