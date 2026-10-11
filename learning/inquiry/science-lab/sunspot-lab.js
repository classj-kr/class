(()=>{
 'use strict';
 const $=id=>document.getElementById(id),api=window.SunspotModel,data=window.SunspotData;
 if(!$('sunCanvasA')||!api||!data)return;
 const frames=data.frames,images=[],pixels=[],canvases=[$('sunCanvasA'),$('sunCanvasB')],colors=['#7be9ed','#ff9dd3','#a9f380','#c0b4ff','#fff'];
 let selected=0,view='compare',date=0,blend=.5,grid=true,playing=false,timer=null,ready=false,points=Array.from({length:5},()=>[null,null]),cursor=[{x:511,y:512},{x:511,y:512}];
 function stop(){playing=false;clearInterval(timer);timer=null;$('sunPlay').textContent='천천히 재생';$('sunPlay').setAttribute('aria-pressed','false');}
 const position=p=>p?`${p.lat<0?'남위':'북위'} ${Math.abs(p.lat).toFixed(1)}° · ${p.lon<0?'동경':'서경'} ${Math.abs(p.lon).toFixed(1)}°`:'흑점의 어두운 중심을 선택하세요.';
 function line(ctx,list){ctx.beginPath();let connected=false;for(const p of list){if(!p){connected=false;continue;}if(connected)ctx.lineTo(p.x,p.y);else ctx.moveTo(p.x,p.y);connected=true;}ctx.stroke();}
 function drawGrid(ctx,frame){
  ctx.save();ctx.strokeStyle='#d8e7ef66';ctx.lineWidth=1.4;
  for(let lat=-60;lat<=60;lat+=15)line(ctx,Array.from({length:181},(_,i)=>api.project(lat,i-90,frame)));
  for(let lon=-75;lon<=75;lon+=15)line(ctx,Array.from({length:181},(_,i)=>api.project(i-90,lon,frame)));
  ctx.strokeStyle='#e7f1f9b0';ctx.lineWidth=2;line(ctx,Array.from({length:181},(_,i)=>api.project(0,i-90,frame)));line(ctx,Array.from({length:181},(_,i)=>api.project(i-90,0,frame)));
  ctx.font=(14*1024/ctx.canvas.getBoundingClientRect().width)+'px system-ui';ctx.textAlign='center';ctx.fillStyle='#e8f4fa';ctx.shadowColor='#000';ctx.shadowBlur=5;
  for(const lat of [-60,-30,0,30,60]){const p=api.project(lat,0,frame);if(p)ctx.fillText((lat>0?'+':'')+lat+'°',p.x+25,p.y-7);}
  for(const lon of [-60,-30,30,60]){const p=api.project(0,lon,frame);if(p)ctx.fillText((lon<0?'동 ':'서 ')+Math.abs(lon)+'°',p.x,p.y+25);}
  ctx.restore();
 }
 function marker(ctx,p,label,color){ctx.save();ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=2.7;ctx.shadowBlur=5;ctx.shadowColor='#061018';ctx.beginPath();ctx.arc(p.x,p.y,13,0,Math.PI*2);ctx.moveTo(p.x-20,p.y);ctx.lineTo(p.x-6,p.y);ctx.moveTo(p.x+6,p.y);ctx.lineTo(p.x+20,p.y);ctx.moveTo(p.x,p.y-20);ctx.lineTo(p.x,p.y-6);ctx.moveTo(p.x,p.y+6);ctx.lineTo(p.x,p.y+20);ctx.stroke();ctx.font='bold '+(14*1024/ctx.canvas.getBoundingClientRect().width)+'px system-ui';ctx.fillText(label,p.x+23,p.y-15);ctx.restore();}
 function magnify(side){const c=$('sunMagnify'+(side?'B':'A')),ctx=c.getContext('2d'),p=points[selected][side]||cursor[side];ctx.fillStyle='#0c1823';ctx.fillRect(0,0,c.width,c.height);if(!ready)return;ctx.imageSmoothingEnabled=false;ctx.drawImage(images[side?2:0],p.x-100,p.y-40,200,80,0,0,600,240);ctx.strokeStyle=colors[selected];ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(300,120,9,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#fff';ctx.shadowColor='#000';ctx.shadowBlur=5;ctx.font=(14/Math.min(c.clientWidth/600,c.clientHeight/240))+'px system-ui';ctx.fillText('선택한 주변 · 3배',14,26);ctx.shadowBlur=0;}
 function draw(){
  if(!ready)return;
  canvases.forEach((canvas,side)=>{const ctx=canvas.getContext('2d'),idx=side?2:view==='sequence'?date:0;ctx.globalAlpha=1;ctx.drawImage(images[idx],0,0);
   if(view==='overlay'&&!side){const a=frames[0],b=frames[2],s=a.radius/b.radius;ctx.globalAlpha=blend;ctx.drawImage(images[2],a.cx-b.cx*s,a.cy-b.cy*s,1024*s,1024*s);ctx.globalAlpha=1;}
   if(grid&&view!=='overlay')drawGrid(ctx,frames[idx]);
   if(view==='compare'){points.forEach((pair,i)=>{if(pair[side])marker(ctx,pair[side],'ABCDE'[i],colors[i]);});if(document.activeElement===canvas)marker(ctx,cursor[side],'+','#fff');}
  });
  if(view==='compare'){magnify(0);magnify(1);}
 }
 function chart(){const c=$('sunChart'),W=Math.max(270,c.clientWidth),H=235;c.width=Math.round(W*2);c.height=H*2;c.style.aspectRatio=W+'/'+H;const ctx=c.getContext('2d'),results=points.map(pair=>api.compare(...pair,frames[0],frames[2]));ctx.scale(2,2);ctx.fillStyle='#405d6e';ctx.font='bold 14px system-ui';ctx.fillText('위도별 겉보기 주기',16,27);ctx.font='14px system-ui';ctx.fillText('주기(일)',16,48);ctx.strokeStyle='#d8e3eb';ctx.lineWidth=1;
  const max=Math.max(40,...results.filter(r=>r.valid).map(r=>Math.ceil(r.period/10)*10)),left=45,right=W-32,top=62,bottom=195;
  for(let i=0;i<=4;i++){const v=max*i/4,y=bottom-(bottom-top)*i/4;ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(right,y);ctx.stroke();ctx.fillText(v.toFixed(0),15,y+4);}
  ctx.textAlign='center';for(let l=-60;l<=60;l+=30){const x=left+(l+60)/120*(right-left);ctx.fillText(l===0?'적도':(l<0?'남 ':'북 ')+Math.abs(l)+'°',x,bottom+22);}ctx.textAlign='left';
  results.forEach((r,i)=>{if(!r.valid)return;const x=left+(r.lat+60)/120*(right-left),y=bottom-r.period/max*(bottom-top);ctx.fillStyle='#15566b';ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fill();ctx.font='bold 14px system-ui';ctx.fillText('ABCDE'[i],x+7,y-7);});
  if(!results.some(r=>r.valid)){ctx.fillStyle='#7d939f';ctx.font='14px system-ui';ctx.textAlign='center';ctx.fillText('두 날짜에서 흑점 위치를 선택하세요.',(left+right)/2,135);}
  c.setAttribute('aria-label',results.filter(r=>r.valid).length+'개 흑점의 위도와 겉보기 주기');
 }
 function readings(){
  $('sunFirstPosition').textContent=view==='compare'?position(points[selected][0]):view==='sequence'?`${date*2}일 경과 · 흑점의 이동과 모양을 비교하세요.`:'원반의 크기와 중심을 맞추어 겹쳤습니다.';
  $('sunLastPosition').textContent=position(points[selected][1]);
  $('sunMeasurements').innerHTML=points.map((p,i)=>{const r=api.compare(...p,frames[0],frames[2]);return `<tr data-active="${selected===i}"><th>${'ABCDE'[i]}</th>${r.valid?`<td>${r.lat<0?'남위':'북위'} ${Math.abs(r.lat).toFixed(1)}°</td><td>${r.angle.toFixed(1)}°</td><td>${r.days}일</td><td>약 ${r.period.toFixed(1)}일</td>`:'<td>—</td><td>—</td><td>4일</td><td>—</td>'}</tr>`;}).join('');chart();
 }
 function render(){
  document.querySelector('.sunspot-scenes').classList.toggle('single',view!=='compare');$('sunSecondFigure').hidden=view!=='compare';$('sunMeasurementControls').hidden=view!=='compare';$('sunSequenceControls').hidden=view!=='sequence';$('sunOverlayControls').hidden=view!=='overlay';$('sunMagnifyA').hidden=view!=='compare';$('sunResults').hidden=view!=='compare';$('sunGrid').disabled=view==='overlay';
  $('sunFirstTitle').textContent=view==='compare'?'5월 5일':view==='overlay'?'5월 5일 + 5월 9일':'5월 '+(5+date*2)+'일';$('sunDate').value=date;$('sunDateLabel').textContent='5월 '+(5+date*2)+'일';
  for(const b of document.querySelectorAll('[data-sun-view]'))b.setAttribute('aria-pressed',String(b.dataset.sunView===view));for(const b of document.querySelectorAll('[data-sun-track]'))b.setAttribute('aria-pressed',String(+b.dataset.sunTrack===selected));
  canvases[0].setAttribute('aria-label',view==='compare'?'5월 5일 태양 영상. 클릭 또는 방향키와 Enter로 흑점 위치 선택':$('sunFirstTitle').textContent+' 태양 영상');readings();draw();
 }
 function pick(side,x,y){
  if(!ready||view!=='compare')return;
  const idx=side?2:0,p=api.locate(x,y,frames[idx]);
  if(!p){$('sunStatus').textContent='태양 원반 안에 있는 흑점을 선택하세요.';return;}
  const pixel=pixels[idx].data,offset=(Math.round(y)*1024+Math.round(x))*4;
  if(pixel[offset]>205&&pixel[offset+1]>135){$('sunStatus').textContent='밝은 광구를 선택했습니다. 흑점의 어두운 중심을 짚으세요.';return;}
  points[selected][side]=p;cursor[side]={x,y};const result=api.compare(...points[selected],frames[0],frames[2]);render();$('sunStatus').textContent=result.valid?`${'ABCDE'[selected]}의 경도 차이 ${result.angle.toFixed(1)}°, 4일 동안의 이동입니다. ${result.warning||'다른 흑점도 같은 방법으로 비교하세요.'}`:result.reason;
 }
 canvases.forEach((c,side)=>{
  c.addEventListener('click',e=>{const b=c.getBoundingClientRect();pick(side,(e.clientX-b.left)/b.width*1024,(e.clientY-b.top)/b.height*1024);});
  c.addEventListener('keydown',e=>{if(view!=='compare')return;const moves={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};if(moves[e.key]){e.preventDefault();const d=moves[e.key],step=e.shiftKey?10:1;cursor[side].x=Math.max(0,Math.min(1023,cursor[side].x+d[0]*step));cursor[side].y=Math.max(0,Math.min(1023,cursor[side].y+d[1]*step));draw();}else if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(side,cursor[side].x,cursor[side].y);}});c.addEventListener('focus',draw);c.addEventListener('blur',draw);
 });
 for(const b of document.querySelectorAll('[data-sun-view]'))b.onclick=()=>{stop();view=b.dataset.sunView;render();$('sunStatus').textContent=view==='compare'?'양쪽 영상에서 같은 흑점의 중심을 선택하세요.':view==='sequence'?'2일 간격의 영상을 비교해 같은 흑점을 추적하세요.':'슬라이더를 움직여 두 날짜의 위치 변화를 비교하세요.';};
 for(const b of document.querySelectorAll('[data-sun-track]'))b.onclick=()=>{selected=+b.dataset.sunTrack;render();$('sunStatus').textContent='흑점 '+b.textContent+'의 위치를 두 날짜에서 선택하세요.';};
 $('sunDate').oninput=e=>{stop();date=+e.target.value;render();};$('sunBlend').oninput=e=>{blend=+e.target.value/100;$('sunBlendLabel').textContent=e.target.value+'%';draw();};$('sunGrid').onchange=e=>{grid=e.target.checked;draw();};
 $('sunPlay').onclick=()=>{if(playing){stop();return;}if(!ready)return;if(date>=2){date=0;render();}playing=true;$('sunPlay').textContent='일시 정지';$('sunPlay').setAttribute('aria-pressed','true');timer=setInterval(()=>{date++;if(date>=2)stop();render();},1600);};
 $('sunClear').onclick=()=>{points[selected]=[null,null];render();$('sunStatus').textContent='흑점 '+ 'ABCDE'[selected]+'의 선택을 지웠습니다.';};
 $('resetExperiment').onclick=()=>{stop();points=Array.from({length:5},()=>[null,null]);selected=0;date=0;view='compare';blend=.5;grid=true;cursor=[{x:511,y:512},{x:511,y:512}];$('sunBlend').value=50;$('sunBlendLabel').textContent='50%';$('sunGrid').checked=true;render();$('sunStatus').textContent='양쪽 영상에서 같은 흑점의 중심을 선택하세요.';};
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 let lastWidth=0;new ResizeObserver(entries=>{const width=entries[0].contentRect.width;if(width===lastWidth)return;lastWidth=width;requestAnimationFrame(()=>{chart();draw();});}).observe(document.querySelector('.sunspot-lab'));
 Promise.all(frames.map((f,i)=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{images[i]=im;const c=document.createElement('canvas');c.width=c.height=1024;const ctx=c.getContext('2d');ctx.drawImage(im,0,0);pixels[i]=ctx.getImageData(0,0,1024,1024);resolve();};im.onerror=reject;im.src='data/'+f.file;}))).then(()=>{ready=true;render();$('sunStatus').textContent='양쪽 영상에서 같은 흑점의 중심을 선택하세요.';}).catch(()=>{$('sunStatus').textContent='관측 영상을 불러오지 못했습니다. 페이지를 다시 열어 주세요.';});
 window.__sunspot={getState:()=>({ready,view,date,selected,playing,points:JSON.parse(JSON.stringify(points))}),getResults:()=>points.map(p=>api.compare(...p,frames[0],frames[2]))};
})();
