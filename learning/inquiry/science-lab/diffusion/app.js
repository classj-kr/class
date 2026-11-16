document.addEventListener('DOMContentLoaded',()=>{
 'use strict';const M=window.DiffusionModel,$=s=>document.querySelector(s),canvas=$('#dfCanvas'),ctx=canvas.getContext('2d');
 let mode='ink',position='centre',substance='vinegar',view='observation',progress=0,running=false,raf=0,last=0,free=[],freeTick=0;
 // 잉크 넣기: injected=false면 잉크가 아직 스포이트 안에 있다. inject는 0..1(누르기 0~.5, 빼기 .5~1).
 let injected=false,inject=0;const INJECT_MS=1800;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),off=document.createElement('canvas');off.width=off.height=M.N;const oc=off.getContext('2d');
 const mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
 function ellipse(x,y,rx,ry,fill,stroke,line=2){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=line;ctx.stroke();}}
 function path(points,stroke,width){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.lineJoin='round';ctx.stroke();}
 // 스포이트: 고무 머리 + 유리관 + 가늘어지는 끝. 누를 때 머리가 납작해지고 관 속 잉크가 줄어든다.
 function dropper(sx){
  const squeeze=injected?Math.min(1,inject/.5):0,lift=injected?Math.max(0,(inject-.5)/.5):0;
  const ease=lift*lift*(3-2*lift),dy=-ease*330;
  ctx.save();ctx.translate(0,dy);
  const tipY=334,tubeTop=74,tubeBot=300,hw=7;
  // 유리관
  ctx.beginPath();ctx.moveTo(sx-hw,tubeTop);ctx.lineTo(sx-hw,tubeBot);ctx.lineTo(sx-2,tipY);ctx.lineTo(sx+2,tipY);ctx.lineTo(sx+hw,tubeBot);ctx.lineTo(sx+hw,tubeTop);ctx.closePath();
  ctx.fillStyle='rgba(235,246,250,.45)';ctx.fill();
  // 유리관 속 잉크(누르기 전에는 관 아래쪽이 파랗다)
  const inkTop=tubeBot-90+squeeze*120;
  if(inkTop<tipY-2){ctx.beginPath();ctx.moveTo(sx-hw+2,Math.min(inkTop,tubeBot));ctx.lineTo(sx-hw+2,tubeBot);ctx.lineTo(sx-1.5,tipY-2);ctx.lineTo(sx+1.5,tipY-2);ctx.lineTo(sx+hw-2,tubeBot);ctx.lineTo(sx+hw-2,Math.min(inkTop,tubeBot));ctx.closePath();ctx.fillStyle='#24418f';ctx.fill();}
  ctx.beginPath();ctx.moveTo(sx-hw,tubeTop);ctx.lineTo(sx-hw,tubeBot);ctx.lineTo(sx-2,tipY);ctx.lineTo(sx+2,tipY);ctx.lineTo(sx+hw,tubeBot);ctx.lineTo(sx+hw,tubeTop);ctx.strokeStyle='#6c8d9c';ctx.lineWidth=1.6;ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.75)';ctx.fillRect(sx-hw+2,tubeTop+6,2.2,tubeBot-tubeTop-12);
  // 고무 머리: 목(테두리) + 둥근 머리
  const bw=18-squeeze*6,bh=40+squeeze*4;
  ctx.fillStyle='#7a2f2f';ctx.beginPath();ctx.roundRect(sx-hw-3,tubeTop-8,hw*2+6,10,3);ctx.fill();
  const g=ctx.createLinearGradient(sx-bw,0,sx+bw,0);g.addColorStop(0,'#8e3434');g.addColorStop(.35,'#c25a4f');g.addColorStop(1,'#6e2626');
  ctx.beginPath();ctx.moveTo(sx-hw-1,tubeTop-8);ctx.bezierCurveTo(sx-bw-2,tubeTop-16,sx-bw,tubeTop-8-bh,sx,tubeTop-10-bh);ctx.bezierCurveTo(sx+bw,tubeTop-8-bh,sx+bw+2,tubeTop-16,sx+hw+1,tubeTop-8);ctx.closePath();ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='#5a1f1f';ctx.lineWidth=1.2;ctx.stroke();
  // 손가락 두 개가 머리를 누른다
  if(squeeze>0&&lift===0){const fx=bw+6;for(const sgn of[-1,1]){ctx.beginPath();ctx.ellipse(sx+sgn*fx,tubeTop-8-bh*.55,7,11,0,0,Math.PI*2);ctx.fillStyle='#f1c7a5';ctx.fill();ctx.strokeStyle='#c7926c';ctx.lineWidth=1;ctx.stroke();}}
  ctx.restore();
 }
 function beaker(){
  ctx.save();ctx.beginPath();ctx.roundRect(105,106,330,252,[0,0,16,16]);ctx.clip();ctx.fillStyle='#e6f3f7';ctx.fillRect(105,106,330,252);
  if(view==='observation'){
   const amount=injected?(inject<1?Math.min(1,inject/.5):1):0;
   if(amount>0){const values=M.ink(progress,position),img=oc.createImageData(M.N,M.N);values.forEach((v,i)=>{const c=mix([230,243,247],[32,58,133],1-Math.exp(-v*5*amount));img.data.set([...c,255],i*4);});oc.putImageData(img,0,0);ctx.imageSmoothingEnabled=true;ctx.drawImage(off,105,106,330,252);}
  }else if(injected&&inject>=.5||progress>0){const points=progress>=1&&free.length?free:M.particles('ink',progress,position);for(const p of points)ellipse(109+p.x*322,110+p.y*244,2.5,2.5,'#294d99');}
  ctx.restore();ellipse(270,106,165,10,null,'#8fbaca',1.5);
  path([[99,72],[100,350],[105,365],[435,365],[440,350],[440,72]],'#658894',3);
  path([[99,72],[83,63],[114,63],[119,72]],'#658894',3);path([[119,72],[440,72]],'#95b0ba',2);
  for(let y=140;y<330;y+=42)path([[415,y],[432,y]],'#7195a4',1.4);
  const sx=105+({left:.25,centre:.5,right:.75}[position])*330;
  if(progress===0&&(!injected||inject<1))dropper(sx);
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
  $('#dfObservation').textContent=ink?(progress===0&&!injected?'스포이트 안에 잉크가 들어 있습니다. 「관찰 시작」을 누르면 바닥에 잉크를 넣습니다.':progress===0?'잉크가 바닥 가까운 곳에 모여 있습니다.':progress<.35?'잉크를 넣은 곳에서 주변으로 색이 퍼집니다.':progress<.8?'잉크가 퍼지면서 진한 곳과 연한 곳의 차이가 줄어듭니다.':'물이 거의 고른 색을 띱니다. 잉크 입자는 여전히 여러 방향으로 움직입니다.'):(substance==='water'?'중앙에 물을 놓으면 이 조건에서 BTB의 초록색이 유지됩니다.':progress<.26?'서로 떨어진 BTB 방울의 색을 비교하세요.':progress<.43?'식초에 가까운 BTB 방울부터 노랗게 변합니다.':progress<.76?'더 먼 방울에도 색 변화가 나타납니다.':'아세트산이 퍼지면서 먼 방울도 노랗게 변합니다.');
  if(!ink){const ds=M.btb(progress,substance);for(const group of ['near','middle','far']){const t=ds.find(d=>d.group===group).yellow,label=t===0?'초록색':t>=1?'노란색':'변하는 중',el=$('#df-'+group);el.querySelector('strong').textContent=label;el.querySelector('.df-swatch').style.backgroundColor='rgb('+mix([74,146,107],[231,193,48],t).join(',')+')';}}
  draw();
 }
 function pause(){running=false;cancelAnimationFrame(raf);last=0;}
 function reset(){pause();progress=0;free=[];freeTick=0;injected=false;inject=0;render();}
 function drift(){if(!free.length)free=M.particles(mode,1,position).map(p=>({...p}));freeTick++;
  for(const p of free){const angle=(Math.sin((p.id+1)*127.1+freeTick*311.7)*43758.5453%1)*Math.PI*2,step=.005,nx=p.x+Math.cos(angle)*step,ny=p.y+Math.sin(angle)*step;if(mode==='ink'){p.x=M.reflect(nx);p.y=M.reflect(ny);}else if(Math.hypot(nx-.5,ny-.5)<.48){p.x=nx;p.y=ny;}}
 }
 function tick(time){if(!running)return;const dt=last?Math.min(80,time-last):0;last=time;
  if(mode==='ink'&&progress===0&&(!injected||inject<1)){injected=true;inject=Math.min(1,inject+dt/INJECT_MS);render();raf=requestAnimationFrame(tick);return;}
  if(progress<1){progress=Math.min(1,progress+dt/16000);render();}else if(view==='particles'){drift();draw();}else{pause();render();return;}raf=requestAnimationFrame(tick);
 }
 function play(){if(running){pause();render();return;}if(progress>=1&&view==='observation'){progress=0;free=[];}if(reduced.matches){injected=true;inject=1;progress=1;render();return;}running=true;last=0;render();raf=requestAnimationFrame(tick);}
 document.querySelectorAll('[data-df-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.dfMode;reset();}));document.querySelectorAll('[data-df-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.dfView;render();}));
 $('#dfPosition').addEventListener('change',e=>{position=e.target.value;reset();});$('#dfSubstance').addEventListener('change',e=>{substance=e.target.value;reset();});
 $('#dfProgress').addEventListener('input',e=>{pause();progress=+e.target.value/100;free=[];injected=true;inject=1;render();});$('#playBtn').addEventListener('click',play);$('#resetBtn').addEventListener('click',reset);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){pause();render();}});new ResizeObserver(draw).observe(canvas);reduced.addEventListener('change',()=>{if(reduced.matches){pause();render();}});
 window.__diffusionModel={...M,state:()=>({mode,position,substance,view,progress,running,free:free.map(p=>({...p})),drops:M.btb(progress,substance)}),setMode(v){mode=v;reset();},setPosition(v){position=v;$('#dfPosition').value=v;reset();},setSubstance(v){substance=v;$('#dfSubstance').value=v;reset();},setView(v){view=v;render();},setProgress(v){pause();progress=M.clamp(v);free=[];injected=true;inject=1;render();}};
 render();
});
