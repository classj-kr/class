/* Original fixed micrographs; screen zoom does not change optical magnification. */
window.scienceSpecimenConfig={
 kind:'cells',assetDir:'cell-observation',
 specimens:[
  {id:'cheek',name:'입안 상피 · 염색',steps:['표본 펴 놓기','메틸렌 블루 떨어뜨리기','염색 기다리기','덮개 유리 비스듬히 덮기','여분 용액 제거'],views:[{id:'cheek-stained',title:'메틸렌 블루 염색',magnification:400,detail:'납작하고 불규칙한 세포의 경계와 더 진하게 염색된 핵을 찾아보세요.'}]},
  {id:'leaf',name:'검정말 · 물',steps:['잎 한 장 놓기','물 떨어뜨리기','덮개 유리 비스듬히 덮기','여분 용액 제거'],views:[{id:'leaf-unstained',title:'염색하지 않은 잎',magnification:400,detail:'각진 경계 안쪽에 작은 초록색 엽록체들이 보입니다. 핵이 뚜렷하지 않다는 것과 핵이 없다는 것은 다릅니다.'}]},
  {id:'leaf-stained',name:'검정말 · 염색',steps:['잎 한 장 놓기','아세트올세인 떨어뜨리기','염색 기다리기','덮개 유리 비스듬히 덮기','여분 용액 제거'],views:[{id:'leaf-stained',title:'아세트올세인 염색',magnification:400,detail:'염색한 잎의 핵과 세포벽을 찾아보세요. 염색 전 표본과 비교하되, 서로 다른 잎의 같은 위치라고 보지는 마세요.'}]}
 ],
 comparisonNote:'각 사진은 400배로 관찰한 서로 다른 표본입니다. 사진 확대는 화면의 일부를 크게 보여 주며, 실제 현미경 배율이나 세포 크기를 바꾸지 않습니다.'
};

/* Side view of the slide while the specimen is prepared, and the microscope beside the eyepiece view.
 * Each finished step replays once with requestAnimationFrame; earlier steps stay drawn. */
window.cellPrep=(()=>{
 'use strict';
 const reduce=()=>!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),ease=t=>t<.5?2*t*t:1-(-2*t+2)**2/2,seg=(f,a,b)=>cl((f-a)/(b-a));
 const mix=(a,b,f)=>'#'+[1,3,5].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-f)+parseInt(b.slice(i,i+2),16)*f).toString(16).padStart(2,'0')).join('');
 const kindOf=t=>/펴 놓기/.test(t)?'smear':/잎 한 장/.test(t)?'leaf':/떨어뜨리기/.test(t)?'drop':/기다리기/.test(t)?'wait':/덮개/.test(t)?'cover':/제거/.test(t)?'blot':'other';
 const dropColor=steps=>{const t=steps.join(' ');return /메틸렌/.test(t)?'#3f6fc4':/아세트올세인/.test(t)?'#a8336b':'#bfe0ee';};
 const DUR={smear:1700,leaf:1400,drop:1500,wait:1900,cover:2000,blot:1600,other:600};
 let prep={sample:null,done:0,anim:null},scope={mounted:false,anim:null,lamp:false,focus:2,brightness:75},raf=0,lastRow=null,lastState=null;
 function host(id,parent,before){let el=document.getElementById(id);if(!el&&parent){el=document.createElement('div');el.id=id;parent.insertBefore(el,before||null);}return el;}
 function loop(){if(raf)return;raf=requestAnimationFrame(now=>{raf=0;const busy=paint(now);if(busy)loop();});}
 function update(row,done,state){
  lastRow=row;lastState=state;const steps=row.steps||[];
  if(row.id!==prep.sample||done<prep.done||reduce()){prep={sample:row.id,done,anim:null};}
  else if(done>prep.done){prep.anim={kind:kindOf(steps[done-1]),step:done-1,start:performance.now(),dur:DUR[kindOf(steps[done-1])]};prep.done=done;}
  if(state.mounted&&!scope.mounted&&!reduce())scope.anim={start:performance.now(),dur:1000};if(!state.mounted)scope.anim=null;scope.mounted=state.mounted;
  if(paint(performance.now()))loop();
 }
 function prepSvg(now){
  const row=lastRow,steps=row.steps||[],kinds=steps.map(kindOf),done=prep.done,A=prep.anim,f=A?cl((now-A.start)/A.dur):1,cur=A&&f<1?A.kind:null,leaf=kinds.includes('leaf'),stain=dropColor(steps),has=k=>kinds.slice(0,done).includes(k);
  const Y=158,X=300,base=leaf?'#5c9a4a':'#e6c3b8';let b='<rect x="0" y="170" width="600" height="40" fill="#efe8dc"/><path d="M0 170H600" stroke="#cbbda5" stroke-width="2"/>';
  b+='<rect x="110" y="158" width="380" height="12" rx="1.5" fill="#e3f1f5" stroke="#8fb3c0" stroke-width="1.5"/><rect x="111" y="159" width="58" height="10" fill="#f3f5f6"/><path d="M170 159.5H488" stroke="#fff" stroke-width="1.5" opacity=".9"/>';
  // specimen layer
  const tint=kinds.includes('wait')?(has('wait')?(cur==='wait'?ease(f):1):0):0,specColor=mix(base,stain===`#bfe0ee`?base:stain,tint*.75);
  let specOpacity=has('smear')||has('leaf')?1:0;if(cur==='smear')specOpacity=ease(f);
  // liquid: dome before the cover glass, thin film afterwards
  const dropDone=has('drop'),coverDone=has('cover'),blotDone=has('blot');let dome=0;if(dropDone)dome=cur==='drop'?ease(seg(f,.55,.85)):1;
  let angle=0,film=0,excess=0;if(coverDone){angle=cur==='cover'?45*(1-ease(seg(f,.1,.9))):0;film=cur==='cover'?seg(f,.4,.95):1;excess=1;}if(blotDone){excess=cur==='blot'?1-ease(seg(f,.3,.85)):0;}
  const liquid=stain,alpha=stain==='#bfe0ee'?.5:.5;
  if(dome>0&&film<1){const h=(20*dome)*(1-film)+2*film,w=40+20*film;b+=`<path d="M${X-w} ${Y}Q${X} ${Y-h*2} ${X+w} ${Y}Z" fill="${liquid}" opacity="${alpha}"/>`;}
  if(film>0){b+=`<rect x="${X-48}" y="${Y-4}" width="96" height="4" fill="${liquid}" opacity="${(alpha*film).toFixed(2)}"/>`;if(excess>0)for(const s of [-1,1])b+=`<path d="M${X+s*48} ${Y-4}q${s*12*excess} 1 ${s*14*excess} 4H${X+s*48}Z" fill="${liquid}" opacity="${(alpha*film).toFixed(2)}"/>`;}
  if(specOpacity>0){if(leaf){let ly=Y-2;if(cur==='leaf')ly=Y-2-80*(1-ease(seg(f,0,.6)));b+=`<path d="M${X-34} ${ly}Q${X} ${ly-7} ${X+34} ${ly}Q${X} ${ly+3} ${X-34} ${ly}Z" fill="${specColor}" stroke="${mix(specColor,'#1f3d1a',.4)}" stroke-width="1"/><path d="M${X-30} ${ly}H${X+30}" stroke="${mix(specColor,'#1f3d1a',.3)}" stroke-width=".8"/>`;}
   else b+=`<ellipse cx="${X}" cy="${Y-1}" rx="36" ry="2.2" fill="${specColor}" opacity="${(specOpacity*.95).toFixed(2)}"/>`;}
  // cover glass (hinged on its left edge)
  if(coverDone){const ax=X-48,ay=Y-4,r=angle*Math.PI/180,ex=ax+96*Math.cos(r),ey=ay-96*Math.sin(r);b+=`<g transform="rotate(${(-angle).toFixed(1)} ${ax} ${ay})"><rect x="${ax}" y="${ay-3}" width="96" height="3" fill="#eaf6fa" stroke="#7fa4b2" stroke-width="1"/></g>`;if(cur==='cover'&&f<.95)b+=`<path d="M${ex.toFixed(1)} ${(ey-2).toFixed(1)}L${(ex+70).toFixed(1)} ${(ey-70).toFixed(1)}" stroke="#7b8a92" stroke-width="2.5" stroke-linecap="round"/><rect x="${(ex+66).toFixed(1)}" y="${(ey-96).toFixed(1)}" width="8" height="30" rx="3" fill="#b5835a" transform="rotate(45 ${(ex+70).toFixed(1)} ${(ey-81).toFixed(1)})"/>`;}
  // tools that come and go
  if(cur==='smear'){const k=f<.85?Math.sin(seg(f,.1,.85)*Math.PI*3):0,lift=f<.1?(1-f/.1)*40:f>.85?seg(f,.85,1)*50:0,tx=X+k*30,ty=Y-4-lift;b+=`<path d="M${tx+4} ${ty-4}L${tx+110} ${ty-96}" stroke="#e9dcc2" stroke-width="4" stroke-linecap="round"/><ellipse cx="${tx}" cy="${ty}" rx="9" ry="6" fill="#fbfbf7" stroke="#c9c4b4" transform="rotate(-40 ${tx} ${ty})"/>`;}
  if(cur==='leaf'){const down=ease(seg(f,0,.6)),up=seg(f,.7,1),ty=Y-6-80*(1-down)-60*up;b+=`<path d="M${X+30} ${ty}L${X+120} ${ty-60}M${X+34} ${ty+3}L${X+124} ${ty-56}" stroke="#8c9aa2" stroke-width="3" stroke-linecap="round"/>`;}
  if(cur==='drop'){const lower=ease(seg(f,0,.25)),raise=seg(f,.85,1),tip=Y-46-40*(1-lower)-60*raise,fall=seg(f,.3,.55);b+=`<ellipse cx="${X}" cy="${tip-82}" rx="10" ry="14" fill="${stain==='#bfe0ee'?'#5d87a3':'#7e5a9a'}"/><rect x="${X-5}" y="${tip-72}" width="10" height="7" rx="2" fill="#555"/><path d="M${X-4} ${tip-65}H${X+4}V${tip-24}L${X+1.5} ${tip}H${X-1.5}L${X-4} ${tip-24}Z" fill="#eef6f9" stroke="#7b9aa6" stroke-width="1.2"/><rect x="${X-3}" y="${tip-34}" width="6" height="12" fill="${liquid}" opacity=".8"/>`;if(fall>0&&fall<1){const yy=tip+2+fall*fall*(Y-tip-12);b+=`<path d="M${X} ${yy.toFixed(1)}c-4 6-4 10 0 10s4-4 0-10Z" fill="${liquid}"/>`;}}
  if(cur==='wait'){const a=f*Math.PI*2;b+=`<circle cx="${X}" cy="70" r="26" fill="#fff" stroke="#6b8794" stroke-width="3"/><path d="M${X} 70L${(X+20*Math.sin(a)).toFixed(1)} ${(70-20*Math.cos(a)).toFixed(1)}" stroke="#c4443a" stroke-width="3" stroke-linecap="round"/><circle cx="${X}" cy="70" r="3" fill="#33454f"/><rect x="${X-6}" y="38" width="12" height="7" rx="2" fill="#6b8794"/>`;}
  if(cur==='blot'){const inn=ease(seg(f,0,.3)),out=seg(f,.85,1),px=X+48+60*(1-inn)+80*out,soak=seg(f,.3,.85);b+=`<g transform="rotate(-8 ${px} ${Y-4})"><rect x="${px}" y="${Y-22}" width="70" height="20" rx="2" fill="#fbfbf8" stroke="#c9c7bd"/><path d="M${px} ${Y-6}q${(20*soak).toFixed(1)} -8 ${(34*soak).toFixed(1)} -2v4H${px}Z" fill="${liquid}" opacity=".55"/></g>`;}
  return `<svg viewBox="160 0 280 200" role="img" aria-label="받침 유리 위 표본 준비 과정(옆에서 본 모습)">${b}</svg>`;
 }
 function scopeSvg(now){
  const s=lastState,A=scope.anim,f=A?cl((now-A.start)/A.dur):1,lit=s.lamp,stageY=150-(s.focus-5)*1.6;let b='<rect x="0" y="292" width="260" height="18" fill="#efe8dc"/><path d="M0 292H260" stroke="#cbbda5" stroke-width="2"/>';
  b+='<path d="M60 292L72 262H190L202 292Z" fill="#5b7280"/><path d="M170 262V220Q170 120 150 80" fill="none" stroke="#5b7280" stroke-width="26" stroke-linecap="round"/>';
  if(lit){const k=.35+s.brightness*.006;b+=`<path d="M108 248L88 ${stageY}H140L120 248Z" fill="#f7e3a0" opacity="${(k*.55).toFixed(2)}"/>`;}
  b+=`<rect x="98" y="240" width="32" height="12" rx="3" fill="${lit?'#f3cf57':'#9aa7ae'}" stroke="#5b6b73"/>`;
  b+=`<rect x="44" y="${stageY}" width="140" height="10" rx="2" fill="#3f525c"/><rect x="104" y="${stageY+10}" width="20" height="14" fill="#55666f"/>`;
  if(s.mounted){const slideX=50+(1-ease(f))*150;b+=`<rect x="${slideX}" y="${stageY-4}" width="120" height="4" fill="#e3f1f5" stroke="#8fb3c0" stroke-width=".8"/><rect x="${slideX+52}" y="${stageY-6}" width="18" height="2" fill="#eaf6fa" stroke="#7fa4b2" stroke-width=".6"/>`;}
  b+=`<path d="M60 ${stageY-3}H86M144 ${stageY-3}H170" stroke="#9aa7ae" stroke-width="3" stroke-linecap="round"/>`;
  const top=94;b+=`<rect x="105" y="${top+18}" width="10" height="26" fill="#9aa7ae" stroke="#5b6b73"/><rect x="118" y="${top+14}" width="10" height="22" fill="#b9c4ca" stroke="#5b6b73" transform="rotate(18 123 ${top+14})"/><path d="M92 ${top+18}H140L132 ${top}H100Z" fill="#46606d"/><rect x="104" y="${top-62}" width="24" height="62" fill="#5b7280"/><rect x="124" y="${top-32}" width="40" height="18" rx="4" fill="#5b7280"/><rect x="100" y="${top-84}" width="32" height="24" rx="3" fill="#3f525c"/>`;
  const rot=s.focus*36;b+=`<g transform="translate(176 ${stageY+28}) rotate(${rot})"><circle r="17" fill="#3f525c" stroke="#24343c" stroke-width="2"/><path d="M0-15V15M-15 0H15M-11-11L11 11M11-11L-11 11" stroke="#7d8f99" stroke-width="2"/></g>`;
  return `<svg viewBox="0 0 260 310" role="img" aria-label="광학 현미경: 재물대, 조명, 초점 조절 나사">${b}</svg>`;
 }
 function paint(now){
  if(!lastRow||!window.scienceScene)return false;
  const prepBox=document.querySelector('.cell-preparation'),scene=host('cellPrepScene',prepBox,document.getElementById('mbPreparation'));if(scene){scene.className='cell-prep-scene';window.scienceScene.render(scene,prepSvg(now));}
  const controls=document.querySelector('.mb-controls'),scopeEl=host('cellScope',controls,controls?.firstChild);if(scopeEl){scopeEl.className='cell-scope';window.scienceScene.render(scopeEl,scopeSvg(now));}
  const busyPrep=prep.anim&&now-prep.anim.start<prep.anim.dur,busyScope=scope.anim&&now-scope.anim.start<scope.anim.dur;if(!busyPrep)prep.anim=null;if(!busyScope)scope.anim=null;
  return !!(busyPrep||busyScope);
 }
 return {update};
})();
