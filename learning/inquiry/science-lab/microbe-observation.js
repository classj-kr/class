document.addEventListener('DOMContentLoaded',()=>{'use strict';
 const $=id=>document.getElementById(id),host=$('mbLab');if(!host)return;
 const specimens=[{id:'mushroom',name:'표고버섯',views:[{id:'mushroom-gills',title:'갓의 주름',magnification:20,detail:'갓 아래에서 나란히 이어지는 주름을 살펴보세요.'},{id:'mushroom-hyphae',title:'균사',magnification:40,detail:'실처럼 가늘고 긴 구조가 여러 방향으로 얽혀 있습니다.'}]},{id:'mold',name:'빵곰팡이',views:[{id:'mold',title:'균사와 둥근 끝 부분',magnification:20,detail:'가느다란 구조와 그 끝에 달린 둥근 부분을 구별해 보세요.'}]},{id:'algae',name:'해캄',views:[{id:'spirogyra',title:'영구표본',magnification:150,detail:'가늘고 긴 몸에서 이어지는 마디와 그 안의 모습을 살펴보세요.'}]},{id:'paramecium',name:'짚신벌레',views:[{id:'paramecium',title:'영구표본',magnification:100,detail:'몸의 윤곽이 길쭉하고 끝이 둥급니다. 염색한 영구표본의 색은 살아 있는 생물과 다를 수 있습니다.'}]}];
 const create=()=>({sample:'mushroom',view:0,mounted:false,lamp:false,focus:2,brightness:75,zoom:1,pan:{x:0,y:0},observed:{},attempts:[]});let s=create(),drag=null;
 const sample=()=>specimens.find(r=>r.id===s.sample),view=()=>sample().views[s.view],ready=()=>s.mounted&&s.lamp&&Math.abs(s.focus-6)<=1&&$('mbImage').complete&&$('mbImage').naturalWidth>0;
 const asset=id=>'../assets/microbe-observation/'+id+'.webp';
 $('mbSamples').innerHTML=specimens.map(r=>`<button data-mb-sample="${r.id}" aria-pressed="false">${r.name}</button>`).join('');
 function render(){
  const row=sample(),v=view(),lit=s.mounted&&s.lamp,img=$('mbImage');$('mbViewer').style.touchAction=s.zoom>1?'none':'pan-y';
  for(const b of host.querySelectorAll('[data-mb-sample]'))b.setAttribute('aria-pressed',String(b.dataset.mbSample===s.sample));
  $('mbViews').innerHTML=row.views.map((r,i)=>`<button data-mb-view="${i}" aria-pressed="${i===s.view}">${r.title}</button>`).join('');$('mbName').textContent=row.name+' · '+v.title;
  if(img.dataset.specimen!==v.id){img.dataset.specimen=v.id;img.src=asset(v.id);}img.alt=row.name+' '+v.title+' 표본 사진';
  img.style.visibility=lit?'visible':'hidden';img.style.filter=`blur(${Math.abs(s.focus-6)*1.2}px) brightness(${.35+s.brightness*.0087})`;
  img.style.transform=`translate(${s.pan.x}px,${s.pan.y}px) scale(${s.zoom})`;$('mbEmpty').hidden=lit;$('mbEmpty').textContent=!s.mounted?'관찰할 표본을 올리세요.':'조명을 켜세요.';
  $('mbCaption').textContent=s.mounted?`${v.magnification}배로 관찰한 표본 사진`:'표본 준비 전';$('mbLamp').setAttribute('aria-pressed',String(s.lamp));$('mbLamp').textContent=s.lamp?'조명 끄기':'조명 켜기';$('mbPlace').disabled=s.mounted;$('mbPlace').textContent=s.mounted?'표본을 올렸습니다':'표본 올리기';
  $('mbFocus').value=s.focus;$('mbBrightness').value=s.brightness;$('mbZoom').value=s.zoom;$('mbZoomValue').textContent=s.zoom.toFixed(1)+'배';$('mbViewer').setAttribute('aria-label',row.name+' 표본 사진. 확대한 뒤 끌거나 방향키로 이동할 수 있습니다.');
  $('mbGuide').textContent=!s.mounted?'표본을 올리고 조명과 초점을 조절하세요.':!s.lamp?'조명을 켜서 표본을 밝히세요.':!ready()?'초점을 천천히 움직여 윤곽이 선명한 곳을 찾으세요.':v.detail;
  const completed=Object.keys(s.observed);$('mbComparisons').hidden=!completed.length;$('mbComparisonGrid').innerHTML=specimens.flatMap(r=>r.views.filter(v=>s.observed[v.id]).map(v=>`<figure><img src="${asset(v.id)}" alt="${r.name} ${v.title}"><figcaption><strong>${r.name} · ${v.title}</strong><span>${v.magnification}배</span></figcaption></figure>`)).join('');
  $('mbComparisonNote').textContent='사진마다 관찰 배율이 다릅니다. 화면에 보이는 크기만으로 생물의 실제 크기를 비교하지 마세요.';
 }
 function resetView(){s.mounted=false;s.focus=2;s.zoom=1;s.pan={x:0,y:0};$('mbStatus').textContent='';render();}
 host.addEventListener('click',e=>{const b=e.target.closest('[data-mb-sample]'),v=e.target.closest('[data-mb-view]');if(b){s.sample=b.dataset.mbSample;s.view=0;resetView();}if(v){s.view=+v.dataset.mbView;resetView();}});
 $('mbPlace').onclick=()=>{s.mounted=true;$('mbStatus').textContent='표본을 올렸습니다. 조명과 초점을 조절해 관찰하세요.';render();};$('mbLamp').onclick=()=>{s.lamp=!s.lamp;render();};
 for(const[id,key]of [['mbFocus','focus'],['mbBrightness','brightness'],['mbZoom','zoom']])$(id).addEventListener('input',e=>{s[key]=Number(e.target.value);if(key==='zoom'){s.pan={x:0,y:0};}render();});
 $('mbObserve').onclick=()=>{const ok=ready(),id=view().id;s.attempts.push({id,ok,mounted:s.mounted,lamp:s.lamp,focus:s.focus});if(ok)s.observed[id]=true;$('mbStatus').textContent=ok?'아래에 관찰한 표본이 나란히 놓였습니다. 다른 표본의 생김새와 비교하세요.':!s.mounted?'표본을 먼저 올리세요.':!s.lamp?'조명을 켜야 표본을 볼 수 있습니다.':!$('mbImage').complete||!$('mbImage').naturalWidth?'표본 사진을 불러온 뒤 관찰할 수 있습니다.':'아직 윤곽이 흐립니다. 초점을 맞춘 뒤 비교하세요.';render();};
 function pan(dx,dy){const b=$('mbViewer').getBoundingClientRect(),maxX=b.width*(s.zoom-1)/2,maxY=b.height*(s.zoom-1)/2;s.pan.x=Math.min(maxX,Math.max(-maxX,s.pan.x+dx));s.pan.y=Math.min(maxY,Math.max(-maxY,s.pan.y+dy));render();}
 const frame=$('mbViewer');frame.addEventListener('pointerdown',e=>{if(s.zoom===1||!s.mounted||!s.lamp)return;drag={x:e.clientX,y:e.clientY};frame.setPointerCapture(e.pointerId);});frame.addEventListener('pointermove',e=>{if(!drag)return;pan(e.clientX-drag.x,e.clientY-drag.y);drag={x:e.clientX,y:e.clientY};});for(const type of ['pointerup','pointercancel','lostpointercapture'])frame.addEventListener(type,()=>drag=null);
 frame.addEventListener('keydown',e=>{const delta={ArrowLeft:[18,0],ArrowRight:[-18,0],ArrowUp:[0,18],ArrowDown:[0,-18]}[e.key];if(delta){e.preventDefault();pan(...delta);}if(e.key==='Home'){e.preventDefault();s.pan={x:0,y:0};render();}});
 $('mbWhole').onclick=()=>{s.zoom=1;s.pan={x:0,y:0};render();};$('mbReset').onclick=()=>{s=create();$('mbStatus').textContent='';render();};
 $('mbImage').onload=()=>render();$('mbImage').onerror=()=>{$('mbStatus').textContent='표본 사진을 불러오지 못했습니다. 다시 열어 주세요.';};
 window.__microbeObservation={getState:()=>JSON.parse(JSON.stringify(s)),specimens,ready,render};render();
});
