document.addEventListener('DOMContentLoaded',()=>{'use strict';
 const $=id=>document.getElementById(id),host=$('mbLab');if(!host)return;
 const specimens=[{id:'mushroom',name:'표고버섯',views:[{id:'mushroom-gills',title:'갓의 주름',magnification:20,detail:'갓 아래에서 나란히 이어지는 주름을 살펴보세요.'},{id:'mushroom-hyphae',title:'균사',magnification:40,detail:'실처럼 가늘고 긴 구조가 여러 방향으로 얽혀 있습니다.'}]},{id:'mold',name:'빵곰팡이',views:[{id:'mold',title:'균사와 둥근 끝 부분',magnification:20,detail:'가느다란 구조와 그 끝에 달린 둥근 부분을 구별해 보세요.'}]},{id:'algae',name:'해캄',views:[{id:'spirogyra',title:'영구표본',magnification:150,detail:'가늘고 긴 몸에서 이어지는 마디와 그 안의 모습을 살펴보세요.'}]},{id:'paramecium',name:'짚신벌레',views:[{id:'paramecium',title:'영구표본',magnification:100,detail:'몸의 윤곽이 길쭉하고 끝이 둥급니다. 염색한 영구표본의 색은 살아 있는 생물과 다를 수 있습니다.'}]}];
 const config=window.scienceSpecimenConfig;
 if(config?.specimens)specimens.splice(0,specimens.length,...config.specimens);
 const create=()=>({sample:specimens[0].id,view:0,mounted:false,lamp:false,focus:2,brightness:75,zoom:1,pan:{x:0,y:0},observed:{},attempts:[],preparation:[]});let s=create(),drag=null;
 const sample=()=>specimens.find(r=>r.id===s.sample),view=()=>sample().views[s.view],ready=()=>s.mounted&&s.lamp&&Math.abs(s.focus-6)<=1&&$('mbImage').complete&&$('mbImage').naturalWidth>0;
 const asset=id=>'../assets/'+(config?.assetDir||'microbe-observation')+'/'+id+'.webp';
 $('mbSamples').innerHTML=specimens.map(r=>`<button data-mb-sample="${r.id}" aria-pressed="false">${r.name}</button>`).join('');
 // Microscope drawing beside the controls (microbes page only) and a drawn, swimming paramecium.
 const scopeHost=$('mbScope'),liveHost=$('mbLive'),reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
 if(scopeHost)scopeHost.innerHTML=`<svg viewBox="0 0 260 250" role="img" aria-label="광학 현미경: 재물대 위 표본, 아래쪽 조명, 옆의 초점 조절 나사"><defs><linearGradient id="mbArm" x2="1"><stop stop-color="#e9eef1"/><stop offset=".5" stop-color="#fdfefe"/><stop offset="1" stop-color="#c9d4da"/></linearGradient></defs>
  <path d="M0 238H260" stroke="#cdd8de" stroke-width="2"/><path d="M58 236Q60 214 92 212H178Q204 214 206 236Z" fill="url(#mbArm)" stroke="#8ea2ad" stroke-width="2"/>
  <path d="M156 214C150 170 176 136 168 64L150 58C158 120 128 160 136 214Z" fill="url(#mbArm)" stroke="#8ea2ad" stroke-width="2"/>
  <g id="mbScopeLight"><ellipse cx="112" cy="198" rx="17" ry="5" fill="#9aa9b0"/><circle cx="112" cy="196" r="8" fill="#c3ccd1" stroke="#7f9099"/></g>
  <path id="mbScopeBeam" d="M104 192L120 192L116 150L108 150Z" fill="#f6d77a" opacity="0"/>
  <g id="mbScopeStage"><rect x="62" y="142" width="104" height="9" rx="2" fill="#56656d"/><rect x="74" y="137" width="14" height="5" rx="1" fill="#8b9aa2"/><rect x="138" y="137" width="14" height="5" rx="1" fill="#8b9aa2"/><g id="mbScopeSlide" style="transition:transform .9s ease-in-out"><rect x="80" y="135.5" width="64" height="5" rx="1" fill="#dceef2" stroke="#8fb0bd"/><rect x="104" y="135" width="16" height="5" rx="1" fill="#e2b9a6" opacity=".8"/></g></g>
  <g id="mbScopeHead" style="transition:transform .35s ease-out"><path d="M118 60H166L168 80H120Z" fill="url(#mbArm)" stroke="#8ea2ad" stroke-width="2"/><rect x="100" y="104" width="24" height="22" rx="3" fill="#c3ccd1" stroke="#7f9099"/><rect x="105" y="124" width="14" height="10" rx="2" fill="#6c7d86"/><path d="M98 104L104 50H122L126 104Z" fill="url(#mbArm)" stroke="#8ea2ad" stroke-width="2"/><path d="M102 50L86 18H106L118 50Z" fill="#dfe6ea" stroke="#8ea2ad" stroke-width="2"/><rect x="84" y="10" width="24" height="10" rx="3" fill="#41525b"/></g>
  <g transform="translate(166 160)"><circle r="17" fill="#c9d3d8" stroke="#7f9099" stroke-width="2"/><g id="mbScopeKnob" style="transition:transform .3s"><path d="M0 -15V15M-15 0H15M-10.6 -10.6L10.6 10.6M-10.6 10.6L10.6 -10.6" stroke="#8a9aa2" stroke-width="2"/><circle r="5" fill="#6c7d86"/></g></g>
  <text x="200" y="166" font-size="14" fill="#2f4c5e">초점</text><text x="20" y="150" font-size="14" fill="#2f4c5e">재물대</text><text x="18" y="200" font-size="14" fill="#2f4c5e">조명</text></svg>`;
 function scope(){if(!scopeHost)return;const lit=s.lamp,sl=$('mbScopeSlide');$('mbScopeBeam').setAttribute('opacity',lit?(.25+s.brightness*.006).toFixed(2):'0');$('mbScopeLight').querySelector('circle').setAttribute('fill',lit?'#f4cf5e':'#c3ccd1');
  sl.style.transform=s.mounted?'translateX(0)':'translateX(150px)';sl.style.opacity=s.mounted?'1':'0';$('mbScopeKnob').style.transform=`rotate(${s.focus*36}deg)`;$('mbScopeHead').style.transform=`translateY(${(s.focus-5)*1.4}px)`;
  if(reduceMotion.matches){sl.style.transition='none';$('mbScopeKnob').style.transition='none';$('mbScopeHead').style.transition='none';}}
 let liveFrame=0,liveT0=0;
 function cilia(){let p='';for(let i=0;i<22;i++){const a=i/22*Math.PI*2,x=Math.cos(a)*44,y=Math.sin(a)*17;p+=`<path class="mb-cil" data-a="${a.toFixed(3)}" d="M${x} ${y}l0 0" stroke="#6b8f6a" stroke-width="1.3"/>`;}return p;}
 if(liveHost)liveHost.innerHTML=`<svg viewBox="0 0 300 170" role="img" aria-label="살아 있는 짚신벌레가 섬모를 움직이며 헤엄치는 그림"><defs><clipPath id="mbLiveField"><circle cx="150" cy="85" r="80"/></clipPath><radialGradient id="mbLiveBg"><stop stop-color="#fbfdf6"/><stop offset="1" stop-color="#e7eedd"/></radialGradient></defs><circle cx="150" cy="85" r="82" fill="#cfd8d0"/><circle cx="150" cy="85" r="80" fill="url(#mbLiveBg)"/><g clip-path="url(#mbLiveField)"><circle cx="96" cy="48" r="3" fill="#b8c9a8"/><circle cx="205" cy="128" r="4" fill="#b8c9a8"/><circle cx="190" cy="40" r="2.5" fill="#c4d2b5"/><g id="mbPara"><g id="mbCilia">${cilia()}</g><path d="M-44 0C-44 -14 -22 -18 0 -16C24 -14 46 -12 46 0C46 13 22 17 0 16C-12 15 -20 8 -26 10C-36 13 -44 10 -44 0Z" fill="#dcead2" stroke="#6b8f6a" stroke-width="1.8"/><path d="M-6 -2C-12 6 -20 9 -26 10" fill="none" stroke="#83a37c" stroke-width="2"/><ellipse cx="4" cy="1" rx="11" ry="6" fill="#b9cfa8"/><circle cx="7" cy="1" r="3" fill="#9fb98f"/><circle id="mbVacA" cx="-26" cy="-4" r="4" fill="#eef7f0" stroke="#86a888"/><circle id="mbVacB" cx="30" cy="-3" r="4" fill="#eef7f0" stroke="#86a888"/><circle cx="-10" cy="-8" r="2" fill="#c6d9b6"/><circle cx="18" cy="7" r="2.2" fill="#c6d9b6"/></g></g></svg><figcaption>살아 있는 짚신벌레 (그림)</figcaption>`;
 function liveStep(now){if(!liveHost||liveHost.hidden){liveFrame=0;return;}const t=(now-liveT0)/1000,x=150+52*Math.sin(t*.45),y=85+26*Math.sin(t*.9),dx=52*.45*Math.cos(t*.45),dy=26*.9*Math.cos(t*.9),ang=Math.atan2(dy,dx)*180/Math.PI;
  $('mbPara').setAttribute('transform',`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
  for(const c of liveHost.querySelectorAll('.mb-cil')){const a=+c.dataset.a,bx=Math.cos(a)*44,by=Math.sin(a)*17,len=5,wave=Math.sin(t*14-a*4)*.9,nx=Math.cos(a)*len+Math.sin(a)*len*wave,ny=Math.sin(a)*len-Math.cos(a)*len*wave*.4;c.setAttribute('d',`M${bx.toFixed(1)} ${by.toFixed(1)}l${nx.toFixed(1)} ${ny.toFixed(1)}`);}
  const pulse=(Math.sin(t*2.4)+1)/2;$('mbVacA').setAttribute('r',(2.5+pulse*2.5).toFixed(2));$('mbVacB').setAttribute('r',(2.5+(1-pulse)*2.5).toFixed(2));
  liveFrame=reduceMotion.matches?0:requestAnimationFrame(liveStep);}
 function live(){if(!liveHost)return;const show=s.sample==='paramecium'&&s.mounted&&s.lamp;liveHost.hidden=!show;if(show&&!liveFrame){liveT0=performance.now();liveFrame=requestAnimationFrame(liveStep);}}
 function render(){
  const row=sample(),v=view(),lit=s.mounted&&s.lamp,img=$('mbImage');$('mbViewer').style.touchAction=s.zoom>1?'none':'pan-y';
  for(const b of host.querySelectorAll('[data-mb-sample]'))b.setAttribute('aria-pressed',String(b.dataset.mbSample===s.sample));
  $('mbViews').hidden=Boolean(config)&&row.views.length===1;$('mbViews').innerHTML=row.views.map((r,i)=>`<button data-mb-view="${i}" aria-pressed="${i===s.view}">${r.title}</button>`).join('');$('mbName').textContent=config?row.name:row.name+' · '+v.title;
  if($('mbPreparation')){
   const done=s.preparation.length,steps=row.steps||[];
   $('mbPreparation').innerHTML=steps.map((text,i)=>`<button data-mb-step="${i}" ${i<done?'disabled':''}>${i<done?'✓ ':''}${text}</button>`).join('');
   $('mbPreparationState').textContent=done===steps.length?'완료':`${done}/${steps.length}단계`;
  }
  if(img.dataset.specimen!==v.id){img.dataset.specimen=v.id;img.src=asset(v.id);}img.alt=row.name+' '+v.title+' 표본 사진';
  img.style.visibility=lit?'visible':'hidden';img.style.filter=`blur(${Math.abs(s.focus-6)*1.2}px) brightness(${.35+s.brightness*.0087})`;
  img.style.transform=`translate(${s.pan.x}px,${s.pan.y}px) scale(${s.zoom})`;$('mbEmpty').hidden=lit;$('mbEmpty').textContent=!s.mounted?'관찰할 표본을 올리세요.':'조명을 켜세요.';
  $('mbCaption').textContent=s.mounted?`${v.magnification}배로 관찰한 표본 사진`:'표본 준비 전';$('mbLamp').setAttribute('aria-pressed',String(s.lamp));$('mbLamp').textContent=s.lamp?'조명 끄기':'조명 켜기';$('mbPlace').disabled=s.mounted||s.preparation.length<(row.steps?.length||0);$('mbPlace').textContent=s.mounted?'표본을 올렸습니다':config?'현미경에 표본 올리기':'표본 올리기';
  $('mbFocus').value=s.focus;$('mbBrightness').value=s.brightness;$('mbZoom').value=s.zoom;$('mbZoomValue').textContent=s.zoom.toFixed(1)+'배';$('mbViewer').setAttribute('aria-label',row.name+' 표본 사진. 확대한 뒤 끌거나 방향키로 이동할 수 있습니다.');
  $('mbGuide').textContent=!s.mounted?'표본을 올리고 조명과 초점을 조절하세요.':!s.lamp?'조명을 켜서 표본을 밝히세요.':!ready()?'초점을 천천히 움직여 윤곽이 선명한 곳을 찾으세요.':v.detail;
  const completed=Object.keys(s.observed);$('mbComparisons').hidden=!completed.length;$('mbComparisonGrid').innerHTML=specimens.flatMap(r=>r.views.filter(v=>s.observed[v.id]).map(v=>`<figure><img src="${asset(v.id)}" alt="${r.name} ${v.title}"><figcaption><strong>${config?r.name:r.name+' · '+v.title}</strong><span>${v.magnification}배</span></figcaption></figure>`)).join('');
  $('mbComparisonNote').textContent=config?.comparisonNote||'사진마다 관찰 배율이 다릅니다. 화면에 보이는 크기만으로 생물의 실제 크기를 비교하지 마세요.';
  scope();live();
  window.cellPrep?.update(row,s.preparation.length,s);
 }
 function resetView(){s.mounted=false;s.preparation=[];s.focus=2;s.zoom=1;s.pan={x:0,y:0};$('mbStatus').textContent='';render();}
 host.addEventListener('click',e=>{const b=e.target.closest('[data-mb-sample]'),v=e.target.closest('[data-mb-view]');if(b){s.sample=b.dataset.mbSample;s.view=0;resetView();}if(v){s.view=+v.dataset.mbView;resetView();}});
 host.addEventListener('click',e=>{const b=e.target.closest('[data-mb-step]');if(!b||b.disabled)return;const step=+b.dataset.mbStep,steps=sample().steps||[],ok=step===s.preparation.length;s.attempts.push({sample:s.sample,step,ok});if(ok)s.preparation.push(step);$('mbStatus').textContent=ok?steps[step]+' 완료.':steps[s.preparation.length]+'부터 진행하세요.';render();if(ok)($('mbPreparation').querySelector('[data-mb-step="'+s.preparation.length+'"]')||$('mbPlace')).focus({preventScroll:true});});
 $('mbPlace').onclick=()=>{s.mounted=true;$('mbStatus').textContent='표본을 올렸습니다. 조명과 초점을 조절해 관찰하세요.';render();};$('mbLamp').onclick=()=>{s.lamp=!s.lamp;render();};
 for(const[id,key]of [['mbFocus','focus'],['mbBrightness','brightness'],['mbZoom','zoom']])$(id).addEventListener('input',e=>{s[key]=Number(e.target.value);if(key==='zoom'){s.pan={x:0,y:0};}render();});
 $('mbObserve').onclick=()=>{const ok=ready(),id=view().id;s.attempts.push({id,ok,mounted:s.mounted,lamp:s.lamp,focus:s.focus});if(ok)s.observed[id]=true;$('mbStatus').textContent=ok?'아래에 관찰한 표본이 나란히 놓였습니다. 다른 표본의 생김새와 비교하세요.':!s.mounted?'표본을 먼저 올리세요.':!s.lamp?'조명을 켜야 표본을 볼 수 있습니다.':!$('mbImage').complete||!$('mbImage').naturalWidth?'표본 사진을 불러온 뒤 관찰할 수 있습니다.':'아직 윤곽이 흐립니다. 초점을 맞춘 뒤 비교하세요.';render();};
 function pan(dx,dy){const b=$('mbViewer').getBoundingClientRect(),maxX=b.width*(s.zoom-1)/2,maxY=b.height*(s.zoom-1)/2;s.pan.x=Math.min(maxX,Math.max(-maxX,s.pan.x+dx));s.pan.y=Math.min(maxY,Math.max(-maxY,s.pan.y+dy));render();}
 const frame=$('mbViewer');frame.addEventListener('pointerdown',e=>{if(s.zoom===1||!s.mounted||!s.lamp)return;drag={x:e.clientX,y:e.clientY};frame.setPointerCapture(e.pointerId);});frame.addEventListener('pointermove',e=>{if(!drag)return;pan(e.clientX-drag.x,e.clientY-drag.y);drag={x:e.clientX,y:e.clientY};});for(const type of ['pointerup','pointercancel','lostpointercapture'])frame.addEventListener(type,()=>drag=null);
 frame.addEventListener('keydown',e=>{const delta={ArrowLeft:[18,0],ArrowRight:[-18,0],ArrowUp:[0,18],ArrowDown:[0,-18]}[e.key];if(delta){e.preventDefault();pan(...delta);}if(e.key==='Home'){e.preventDefault();s.pan={x:0,y:0};render();}});
 $('mbWhole').onclick=()=>{s.zoom=1;s.pan={x:0,y:0};render();};$('mbReset').onclick=()=>{s=create();$('mbStatus').textContent='';render();};
 $('mbImage').onload=()=>render();$('mbImage').onerror=()=>{$('mbStatus').textContent='표본 사진을 불러오지 못했습니다. 다시 열어 주세요.';};
 window[config?.kind==='cells'?'__cellObservation':'__microbeObservation']={getState:()=>JSON.parse(JSON.stringify(s)),specimens,ready,render};render();
});
