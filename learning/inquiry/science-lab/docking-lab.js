(()=>{
 'use strict';const $=id=>document.getElementById(id),meta=window.DockingData;if(!$('dockCanvas')||!meta)return;
 const canvas=$('dockCanvas'),ctx=canvas.getContext('2d'),cache=new Map(),tested={1:[],5:[],8:[]};
 let target=1,candidate=6,pose=19,loaded=null,generation=0,angle=.35,tilt=-.3,zoom=false,spin=!matchMedia('(prefers-reduced-motion: reduce)').matches,last=0,drag=null;
 const colors={C:'#e8c270',N:'#6eaaf9',O:'#f0808d',H:'#e7f0f9',F:'#8adeb2',S:'#f5d365',Cl:'#98dba5'};
 const current=()=>loaded?.poses[String(candidate)]?.[pose],isTested=()=>tested[target].includes(candidate),minimum=id=>Math.min(...loaded.poses[String(id)].map(p=>p.score));
 function transform(p,center,scale){const x=p[0]-center[0],y=p[1]-center[1],z=p[2]-center[2],u=x*Math.cos(angle)+z*Math.sin(angle),w=-x*Math.sin(angle)+z*Math.cos(angle),v=y*Math.cos(tilt)-w*Math.sin(tilt),depth=y*Math.sin(tilt)+w*Math.cos(tilt);return{x:500+u*scale,y:405-v*scale,z:depth};}
 function draw(){
  ctx.clearRect(0,0,1000,850);if(!loaded)return;
  const mol=current(),show=isTested(),atoms=mol.atoms,chains=Object.values(loaded.chains).flat(),all=chains.flat(),center=show&&zoom?[0,1,2].map(i=>atoms.reduce((sum,a)=>sum+a[i+1],0)/atoms.length):[0,1,2].map(i=>(Math.min(...all.map(p=>p[i]))+Math.max(...all.map(p=>p[i])))/2);
  const radius=show&&zoom?18:Math.max(...all.map(p=>Math.hypot(...p.map((v,i)=>v-center[i])))),scale=340/radius,segments=[];
  chains.forEach((chain,ci)=>{for(let i=1;i<chain.length;i++){const p=chain[i-1],q=chain[i];if(show&&zoom&&Math.min(Math.hypot(...p.map((v,j)=>v-center[j])),Math.hypot(...q.map((v,j)=>v-center[j])))>22)continue;const a=transform(p,center,scale),b=transform(q,center,scale);segments.push({a,b,z:(a.z+b.z)/2,chain:ci});}});
  segments.sort((a,b)=>a.z-b.z);ctx.lineCap='round';
  for(const s of segments){const light=Math.max(.15,Math.min(1,.52+s.z/(radius*2))),hue=s.chain%2?211:187;ctx.strokeStyle=`hsla(${hue},55%,${27+light*45}%,${show&&zoom?.5:.85})`;ctx.lineWidth=Math.max(2.1,scale*.48);ctx.beginPath();ctx.moveTo(s.a.x,s.a.y);ctx.lineTo(s.b.x,s.b.y);ctx.stroke();}
  if(show){
   const projected=atoms.map(a=>transform(a.slice(1),center,scale)),objects=[];
   for(const [a,b,type]of mol.bonds)objects.push({kind:'bond',a,b,type,z:(projected[a].z+projected[b].z)/2});atoms.forEach((a,i)=>objects.push({kind:'atom',i,z:projected[i].z}));objects.sort((a,b)=>a.z-b.z);
   for(const item of objects){if(item.kind==='bond'){const a=projected[item.a],b=projected[item.b];ctx.strokeStyle='#dacfb1';ctx.lineWidth=Math.max(2,scale*.17);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();if(item.type>1){ctx.lineWidth=Math.max(1,scale*.07);ctx.beginPath();ctx.moveTo(a.x+3,a.y+3);ctx.lineTo(b.x+3,b.y+3);ctx.stroke();}}else{const p=projected[item.i],element=atoms[item.i][0],r=Math.max(2.9,scale*(element==='H'?.22:.37));const gradient=ctx.createRadialGradient(p.x-r*.3,p.y-r*.4,r*.08,p.x,p.y,r);gradient.addColorStop(0,'#fff5d9');gradient.addColorStop(.35,colors[element]||'#bbd2db');gradient.addColorStop(1,'#3f4553');ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(p.x,p.y,r,0,2*Math.PI);ctx.fill();}}
   const c=transform(center,center,scale);if(zoom){ctx.strokeStyle='#9bb5ce22';ctx.lineWidth=1;ctx.beginPath();ctx.arc(c.x,c.y,320,0,Math.PI*2);ctx.stroke();}
  }
 }
 function plot(){const c=$('dockPlot'),W=Math.max(250,c.clientWidth),H=150;c.width=Math.round(W*2);c.height=H*2;c.style.aspectRatio=W+'/'+H;const g=c.getContext('2d');g.scale(2,2);if(!loaded||!isTested())return;const values=loaded.poses[String(candidate)].map(p=>p.score),lo=Math.floor(Math.min(...values))-1,hi=Math.ceil(Math.max(...values))+1,left=44,right=W-18,top=22,bottom=118;
  g.font='14px system-ui';g.fillStyle='#405d6e';g.strokeStyle='#dfe6ef';for(let n=0;n<=2;n++){const y=top+(bottom-top)*n/2,v=hi-(hi-lo)*n/2;g.fillText(v.toFixed(1),3,y+4);g.beginPath();g.moveTo(left,y);g.lineTo(right,y);g.stroke();}g.fillText('배치 1',left,140);g.textAlign='right';g.fillText('배치 20',right,140);values.forEach((v,i)=>{const x=left+(right-left)*i/19,y=bottom-(v-lo)/(hi-lo)*(bottom-top);g.fillStyle=i===pose?'#dd8e33':'#4c72a8';g.beginPath();g.arc(x,y,i===pose?5:3,0,Math.PI*2);g.fill();});
 }
 function render(){
  const t=meta.targets.find(t=>t.id===target);$('dockTargetName').textContent=t.name;$('dockRole').textContent=t.role;$('dockContext').textContent=t.context;$('dockTarget').value=target;
  $('dockSpin').textContent=spin?'회전 멈추기':'천천히 회전';$('dockSpin').setAttribute('aria-pressed',String(spin));$('dockZoom').setAttribute('aria-pressed',String(zoom));$('dockZoom').disabled=!loaded||!isTested();$('dockTest').disabled=!loaded;
  $('dockCompounds').innerHTML=meta.compounds.map(c=>`<button data-dock-candidate="${c.id}" aria-pressed="${c.id===candidate}"><strong>${c.name}</strong><span>${c.formula}</span></button>`).join('');
  $('dockPoseControls').hidden=!loaded||!isTested();$('dockPose').value=pose;$('dockPoseValue').textContent=(pose+1)+' / 20';$('dockEnergy').textContent=loaded&&isTested()?current().score.toFixed(1):'—';
  const best=loaded&&tested[target].length?Math.min(...tested[target].map(minimum)):null;
  $('dockResults').innerHTML=meta.compounds.map(c=>{const done=loaded&&tested[target].includes(c.id),v=done?minimum(c.id):null;return`<tr data-best="${done&&v===best}"><th>${c.name}</th><td>${done?v.toFixed(1):'—'}</td><td>${done?(tested[target].length>1&&v===best?'시험한 후보 중 가장 낮음':'비교 완료'):'아직 시험하지 않음'}</td></tr>`;}).join('');plot();draw();
 }
 async function load(id){const request=++generation;loaded=null;target=id;zoom=false;pose=19;render();$('dockStatus').textContent='단백질 구조를 불러오는 중입니다.';try{if(!cache.has(id)){const response=await fetch('data/'+id+'.json');if(!response.ok)throw new Error('load');cache.set(id,await response.json());}if(request!==generation)return;loaded=cache.get(id);render();$('dockStatus').textContent='후보를 골라 시험하고 결합 배치를 비교하세요.';}catch{if(request===generation)$('dockStatus').textContent='구조를 불러오지 못했습니다. 표적을 다시 선택해 주세요.';}}
 $('dockTarget').innerHTML=meta.targets.map(t=>`<option value="${t.id}">${t.name}</option>`).join('');$('dockTarget').onchange=e=>load(+e.target.value);
 $('dockCompounds').onclick=e=>{const b=e.target.closest('[data-dock-candidate]');if(!b)return;candidate=+b.dataset.dockCandidate;pose=19;zoom=isTested();render();$('dockStatus').textContent=isTested()?'결합 배치를 바꾸거나 다른 후보와 비교하세요.':'선택한 후보를 시험해 에너지를 확인하세요.';};
 $('dockTest').onclick=()=>{if(!loaded)return;if(!isTested())tested[target].push(candidate);pose=loaded.poses[String(candidate)].findIndex(p=>p.score===minimum(candidate));zoom=true;render();$('dockStatus').textContent=meta.compounds.find(c=>c.id===candidate).name+'의 결합 배치 20개를 비교합니다.';};
 $('dockPose').oninput=e=>{pose=+e.target.value;render();};$('dockBest').onclick=()=>{pose=loaded.poses[String(candidate)].findIndex(p=>p.score===minimum(candidate));render();};
 $('dockSpin').onclick=()=>{spin=!spin;render();};$('dockZoom').onclick=()=>{zoom=!zoom;render();};$('dockViewReset').onclick=()=>{angle=.35;tilt=-.3;draw();};
 canvas.onpointerdown=e=>{drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);spin=false;render();};canvas.onpointermove=e=>{if(!drag)return;angle+=(e.clientX-drag.x)*.008;tilt=Math.max(-1.5,Math.min(1.5,tilt+(e.clientY-drag.y)*.008));drag={x:e.clientX,y:e.clientY};draw();};canvas.onpointerup=canvas.onpointercancel=()=>{drag=null;};canvas.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();spin=false;if(e.key==='ArrowLeft')angle-=.1;if(e.key==='ArrowRight')angle+=.1;if(e.key==='ArrowUp')tilt-=.1;if(e.key==='ArrowDown')tilt+=.1;render();};
 $('resetExperiment').onclick=()=>{for(const id of Object.keys(tested))tested[id]=[];candidate=6;pose=19;angle=.35;tilt=-.3;zoom=false;load(1);};
 let previousWidth=0;new ResizeObserver(entries=>{const w=entries[0].contentRect.width;if(previousWidth===w)return;previousWidth=w;requestAnimationFrame(plot);}).observe(document.querySelector('.docking-lab'));
 function tick(now){if(spin&&loaded&&!document.hidden){angle+=Math.min(.06,(now-last)/1000)*.13;draw();}last=now;requestAnimationFrame(tick);}requestAnimationFrame(tick);
 window.__docking={getState:()=>({target,candidate,pose,ready:!!loaded,spin,angle,zoom,tested:JSON.parse(JSON.stringify(tested))}),getScore:()=>loaded&&isTested()?current().score:null};load(1);
})();
