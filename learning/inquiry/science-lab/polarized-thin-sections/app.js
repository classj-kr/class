(()=>{
 'use strict';const M=window.scienceThinSections,$=id=>document.getElementById(id),canvas=$('tsCanvas'),ctx=canvas.getContext('2d');
 const cache=Object.fromEntries(Object.keys(M.specimens).map(k=>[k,M.grains(k).filter(g=>{const xs=g.poly.map(p=>p[0]),ys=g.poly.map(p=>p[1]);const dx=Math.max(Math.min(...xs)-300,300-Math.max(...xs),0),dy=Math.max(Math.min(...ys)-300,300-Math.max(...ys),0);return dx*dx+dy*dy<=304*304;}).map(g=>{
  const path=new Path2D();g.poly.forEach((p,i)=>i?path.lineTo(...p):path.moveTo(...p));path.closePath();
  const cleavages=new Path2D();
  for(let x=-140;x<140;x+=8){cleavages.moveTo(x,-150);cleavages.lineTo(x+20,150);}
  return{...g,path,cleavages};
 })]));
 const fields=new Map(),littleEndian=new Uint8Array(new Uint32Array([0x01020304]).buffer)[0]===4;let drawKey='';
 let state,frame=0,last=0,photo='fine',zoom=1,pan={x:0,y:0},drag=null;
 const initial=()=>({sample:'basalt',mounted:false,focus:20,light:70,crossed:false,angle:0,playing:false,seen:{basalt:{ppl:false,xpl:false},granite:{ppl:false,xpl:false}},classifications:{},firstClassification:null,attempts:[]});
 function status(text){$('tsStatus').textContent=text;}
 function packedColour(css){const rgb=css[0]==='#'?[1,3,5].map(i=>parseInt(css.slice(i,i+2),16)):css.match(/\d+/g).map(Number),[r,g,b]=rgb.map(v=>Math.max(0,Math.min(255,v)));return littleEndian?(255<<24|b<<16|g<<8|r)>>>0:(r<<24|g<<16|b<<8|255)>>>0;}
 function field(){
  const W=canvas.width,key=state.sample+':'+W;if(fields.has(key))return fields.get(key);
  const scale=W/600,grains=cache[state.sample],ids=new Uint16Array(W*W),image=ctx.createImageData(W,W),palette=new Uint32Array(grains.length*2+1),overlays=[];
  // Rasterize grain membership once. Subsequent frames update its colour
  // palette, preserving the exact live optical model without redrawing hundreds
  // of clipped polygons and twin stripes on every frame.
  grains.forEach((g,i)=>{const poly=g.poly.map(([x,y])=>[x*scale,y*scale]),top=Math.max(0,Math.ceil(Math.min(...poly.map(p=>p[1]))-.5)),bottom=Math.min(W,Math.ceil(Math.max(...poly.map(p=>p[1]))-.5)),a=g.orientation*Math.PI/180,cos=Math.cos(a),sin=Math.sin(a),step=state.sample==='basalt'?6:16;
   for(let y=top;y<bottom;y++){const crossings=[],cy=y+.5;for(let n=0;n<poly.length;n++){const p=poly[n],q=poly[(n+1)%poly.length];if((p[1]>cy)!==(q[1]>cy))crossings.push(p[0]+(cy-p[1])*(q[0]-p[0])/(q[1]-p[1]));}crossings.sort((a,b)=>a-b);
    for(let n=0;n+1<crossings.length;n+=2)for(let x=Math.max(0,Math.ceil(crossings[n]-.5));x<Math.min(W,Math.ceil(crossings[n+1]-.5));x++){const dx=(x+.5)/scale-g.x,dy=cy/scale-g.y,u=dx*cos+dy*sin,v=-dx*sin+dy*cos,twin=g.kind==='feldspar'&&g.twin&&u>=-130&&u<130&&Math.abs(v)<160&&(u+130)%step<step*.35;ids[y*W+x]=1+i*2+(twin?1:0);}
   }
  });
  for(const crossed of [false,true]){const layer=document.createElement('canvas');layer.width=layer.height=W;const p=layer.getContext('2d');p.scale(scale,scale);for(const g of grains){p.strokeStyle=crossed?'#141b22':'#787b7160';p.lineWidth=.65;p.stroke(g.path);if(g.kind==='mica'&&g.cleavage){p.save();p.clip(g.path);p.translate(g.x,g.y);p.rotate(g.orientation*Math.PI/180);p.strokeStyle='#11191c70';p.lineWidth=.8;p.stroke(g.cleavages);p.restore();}}overlays.push(layer);}
  const painted=document.createElement('canvas');painted.width=painted.height=W;
  const result={ids,image,pixels:new Uint32Array(image.data.buffer),palette,overlays,grains,painted};fields.set(key,result);return result;
 }
 function draw(){
  const W=canvas.width,amount=Math.min(8,Math.abs(state.focus-50)*.2),blur=amount?'blur('+amount+'px)':'none';
  if(canvas.style.filter!==blur)canvas.style.filter=blur;
  const changingColour=state.crossed||cache[state.sample].some(g=>g.kind==='mica'),next=[state.sample,state.light,state.crossed,W,changingColour?state.angle:0].join(':');
  const f=field();if(next!==drawKey){drawKey=next;f.palette[0]=packedColour(state.crossed?'#060b10':'#e7e5d8');f.grains.forEach((g,i)=>{f.palette[1+i*2]=packedColour(M.color(g,state.angle,state.crossed,state.light));f.palette[2+i*2]=state.crossed&&g.kind==='feldspar'&&g.twin?packedColour(M.color({...g,orientation:g.orientation+24},state.angle,true,state.light)):f.palette[1+i*2];});
   for(let i=0;i<f.ids.length;i++)f.pixels[i]=f.palette[f.ids[i]];const p=f.painted.getContext('2d');p.putImageData(f.image,0,0);p.drawImage(f.overlays[Number(state.crossed)],0,0);
  }
  ctx.clearRect(0,0,W,W);ctx.save();ctx.translate(W/2,W/2);ctx.rotate(state.angle*Math.PI/180);ctx.drawImage(f.painted,-W/2,-W/2);ctx.restore();
 }
 function progress(){
  $('tsProgress').innerHTML=Object.entries(M.specimens).map(([key,s])=>'<div><strong>'+s.name+'</strong><span>개방 니콜 · '+(state.seen[key].ppl?'관찰함':'관찰 전')+'</span><span>직교 니콜 · '+(state.seen[key].xpl?'관찰함':'관찰 전')+'</span></div>').join('');
  $('tsComparison').hidden=!Object.values(state.seen).every(x=>x.ppl&&x.xpl);
 }
 function update(){
  for(const b of document.querySelectorAll('[data-ts-sample]'))b.setAttribute('aria-pressed',String(b.dataset.tsSample===state.sample));
  $('tsSpecimenName').textContent=M.specimens[state.sample].name;$('tsNicol').textContent=state.crossed?'직교 니콜':'개방 니콜';
  $('tsMount').disabled=state.mounted;$('tsMount').textContent=state.mounted?'박편 올림':'박편 올리기';
  $('tsAnalyzer').setAttribute('aria-pressed',String(state.crossed));$('tsAnalyzer').textContent=state.crossed?'상부 편광판 빼기':'상부 편광판 넣기';
  $('tsLightValue').textContent=state.light;$('tsFocusValue').textContent=Math.abs(state.focus-50)<=5?'선명함':'조절 중';
  $('tsAngleValue').textContent=Math.round(state.angle)+'°';$('tsAngle').value=state.angle;
  $('tsPlay').textContent=state.playing?'회전 멈추기':'천천히 회전';$('tsPlay').setAttribute('aria-pressed',String(state.playing));
  const blocked=!state.mounted||state.light<5;$('tsCover').hidden=!blocked;$('tsCover').textContent=!state.mounted?'박편을 재물대에 올리세요.':'조명을 밝게 조절하세요.';
  progress();draw();document.querySelector('.ts-scale i').style.width=(canvas.clientWidth/6)+'px';
 }
 function stop(){state.playing=false;cancelAnimationFrame(frame);frame=0;last=0;}
 function animate(now){if(!state.playing)return;if(last)state.angle=(state.angle+Math.min(now-last,80)*.012)%360;last=now;draw();const rounded=Math.round(state.angle),value=String(rounded),label=value+'°';if($('tsAngle').value!==value)$('tsAngle').value=value;if($('tsAngleValue').textContent!==label)$('tsAngleValue').textContent=label;frame=requestAnimationFrame(animate);}
 function mode(value){stop();for(const b of document.querySelectorAll('[data-ts-mode]'))b.setAttribute('aria-pressed',String(b.dataset.tsMode===value));$('tsScope').hidden=value!=='scope';$('tsPhotos').hidden=value!=='photos';update();}
 function selectSample(key){stop();state.sample=key;state.mounted=false;state.focus=20;state.angle=0;$('tsFocus').value=20;status(M.specimens[key].name+' 박편을 올리고 초점을 다시 맞추세요.');update();}
 function observe(){
  if(!M.ready(state)){status(!state.mounted?'먼저 박편을 재물대에 올리세요.':state.light<30?'조명이 어둡습니다. 입자 경계가 보이도록 밝기를 높이세요.':'입자 경계가 흐립니다. 초점을 맞춘 뒤 확인하세요.');return;}
  state.seen[state.sample][state.crossed?'xpl':'ppl']=true;
  status(M.specimens[state.sample].name+'의 '+(state.crossed?'직교':'개방')+' 니콜 조직을 확인했습니다. '+(state.sample==='basalt'?'작은 입자들이 촘촘하게 모여 있습니다.':'큰 입자들이 서로 맞물려 있습니다.'));progress();
 }
 const assets='../assets/thin-sections/',storageKey='science-thin-section-classification-v1';
 function scaleMarkup(p){return '<span class="ts-image-scale" style="width:'+p.scaleFraction*100+'%"><i></i><b>'+p.scaleMM+' mm</b></span>';}
 function buildPhotos(){
  $('tsPhotoGrid').innerHTML=M.photos.map(p=>'<figure class="ts-photo-card"><div class="ts-photo-frame"><img src="'+assets+p.file+'" alt="박편 '+p.label+' 관찰 사진">'+scaleMarkup(p)+'</div><figcaption><strong>박편 '+p.label+'</strong><button data-ts-photo="'+p.id+'">확대 보기</button></figcaption><label for="tsClass-'+p.id+'">관찰한 조직<select id="tsClass-'+p.id+'" data-ts-class="'+p.id+'"><option value="">고르기</option>'+['세립질 조직','조립질 조직','반상 조직','유리질 조직'].map(t=>'<option>'+t+'</option>').join('')+'</select></label><p class="ts-photo-feedback" id="tsFeedback-'+p.id+'"></p></figure>').join('');
 }
 function photoTransform(){
  const b=$('tsPhotoViewer').getBoundingClientRect(),maxX=b.width*(zoom-1)/2,maxY=b.height*(zoom-1)/2;pan.x=Math.max(-maxX,Math.min(maxX,pan.x));pan.y=Math.max(-maxY,Math.min(maxY,pan.y));$('tsPhotoSurface').style.transform='translate('+pan.x+'px,'+pan.y+'px) scale('+zoom+')';$('tsPhotoScale').style.width=(M.photos.find(p=>p.id===photo).scaleFraction*100*zoom)+'%';$('tsPhotoViewer').dataset.zoomed=String(zoom>1);$('tsPhotoZoomValue').textContent=zoom.toFixed(1)+'배';
 }
 function showPhoto(id){photo=id;zoom=1;pan={x:0,y:0};$('tsPhotoZoom').value=1;const p=M.photos.find(p=>p.id===id);$('tsPhotoDetail').hidden=false;$('tsPhotoTitle').textContent='박편 '+p.label+' 자세히 보기';$('tsPhotoImage').src=assets+p.file;$('tsPhotoImage').alt='박편 '+p.label+' 확대 사진';$('tsPhotoScale').style.width=p.scaleFraction*100+'%';$('tsPhotoScale').querySelector('b').textContent=p.scaleMM+' mm';photoTransform();$('tsPhotoDetail').scrollIntoView({block:'nearest'});}
 function checkPhotos(){
  if(M.photos.some(p=>!state.classifications[p.id])){$('tsPhotoStatus').textContent='네 박편의 조직을 모두 고른 뒤 확인하세요.';return;}
  const result=Object.fromEntries(M.photos.map(p=>[p.id,state.classifications[p.id]===p.texture]));state.firstClassification??={answers:{...state.classifications},result:{...result}};state.attempts.push({answers:{...state.classifications},result:{...result}});
  for(const p of M.photos){const right=result[p.id];$('tsFeedback-'+p.id).textContent=(right?'알맞게 분류했습니다. ':'다시 관찰하세요. ')+p.description+' '+(right?p.environment:'사진의 눈금과 큰 결정·작은 바탕의 관계를 함께 보세요.');}
  try{localStorage.setItem(storageKey,JSON.stringify({first:state.firstClassification.answers,last:state.classifications}));}catch{}
  const score=Object.values(result).filter(Boolean).length,first=Object.values(state.firstClassification.result).filter(Boolean).length;$('tsPhotoStatus').textContent='현재 '+score+'/4 · 첫 분류 '+first+'/4. '+(score===4?'입자 크기의 차이를 냉각 과정과 연결해 보세요.':'입자 크기와 크기 차이에 주목해 다시 골라 보세요.');
 }
 $('tsLab').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.tsMode)mode(b.dataset.tsMode);if(b.dataset.tsSample)selectSample(b.dataset.tsSample);if(b.dataset.tsPhoto)showPhoto(b.dataset.tsPhoto);});
 $('tsMount').onclick=()=>{state.mounted=true;status('입자 경계가 또렷해지도록 초점을 맞추세요.');update();};
 for(const [id,key]of [['tsLight','light'],['tsFocus','focus'],['tsAngle','angle']])$(id).oninput=()=>{if(key==='angle')stop();state[key]=Number($(id).value);update();};
 $('tsAnalyzer').onclick=()=>{state.crossed=!state.crossed;update();};$('tsTurn').onclick=()=>{stop();state.angle=(state.angle+15)%360;update();};
 $('tsPlay').onclick=()=>{if(state.playing)stop();else{state.playing=true;last=0;frame=requestAnimationFrame(animate);}update();};
 $('tsObserve').onclick=observe;$('tsToPhotos').onclick=()=>mode('photos');$('tsCheckPhotos').onclick=checkPhotos;
 $('tsPhotoGrid').onchange=e=>{if(e.target.dataset.tsClass){state.classifications[e.target.dataset.tsClass]=e.target.value;$('tsFeedback-'+e.target.dataset.tsClass).textContent='';}};
 $('tsPhotoZoom').oninput=()=>{zoom=Number($('tsPhotoZoom').value);photoTransform();};
 const viewer=$('tsPhotoViewer');viewer.onkeydown=e=>{const d={ArrowLeft:[24,0],ArrowRight:[-24,0],ArrowUp:[0,24],ArrowDown:[0,-24]}[e.key];if(d&&zoom>1){e.preventDefault();pan.x+=d[0];pan.y+=d[1];photoTransform();}};
 viewer.onpointerdown=e=>{if(zoom<=1)return;drag={x:e.clientX,y:e.clientY};viewer.setPointerCapture(e.pointerId);};viewer.onpointermove=e=>{if(!drag)return;pan.x+=e.clientX-drag.x;pan.y+=e.clientY-drag.y;drag={x:e.clientX,y:e.clientY};photoTransform();};viewer.onpointerup=viewer.onpointercancel=()=>drag=null;
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();update();}});window.addEventListener('resize',()=>{photoTransform();document.querySelector('.ts-scale i').style.width=(canvas.clientWidth/6)+'px';});
 function reset(){if(state)stop();state=initial();$('tsFocus').value=20;$('tsLight').value=70;$('tsPhotoDetail').hidden=true;$('tsPhotoStatus').textContent='';buildPhotos();mode('scope');status(' 초점을 맞추고 편광판을 넣고 빼며 같은 박편을 살펴보세요.');}
 $('tsReset').onclick=()=>{try{localStorage.removeItem(storageKey);}catch{}reset();};reset();
 try{const saved=JSON.parse(localStorage.getItem(storageKey)||'null'),valid=a=>a&&M.photos.every(p=>M.photos.some(t=>t.texture===a[p.id]));if(saved&&valid(saved.first)&&valid(saved.last)){state.firstClassification={answers:saved.first,result:Object.fromEntries(M.photos.map(p=>[p.id,saved.first[p.id]===p.texture]))};state.classifications=saved.last;for(const p of M.photos)$('tsClass-'+p.id).value=saved.last[p.id];checkPhotos();}}catch{}
window.__thinSections={getState:()=>JSON.parse(JSON.stringify({...state,photo,zoom,pan})),sample:selectSample};
})();
