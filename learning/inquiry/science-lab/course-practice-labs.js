(function(){
 'use strict';
 const host=document.querySelector('[data-practice]');if(!host)return;
 const M=window.ScienceCoursePractice,slug=host.dataset.practice,$=id=>document.getElementById(id),say=t=>$('cpStatus').textContent=t;
 const fmt=(n,p=2)=>Number(n).toFixed(p),read=(a,b)=>{$('cpReadA').textContent=a;$('cpReadB').textContent=b;};
 let render=()=>{},reset=()=>{},advance=()=>{},s,model;
 const txt=(x,y,t,anchor='middle',fill='')=>`<text x="${x}" y="${y}" text-anchor="${anchor}"${fill?` style="fill:${fill}"`:''}>${t}</text>`;
 const defs=`<defs><linearGradient id="glass"><stop stop-color="#e2f0f4" stop-opacity=".6"/><stop offset=".22" stop-color="#fff" stop-opacity=".7"/><stop offset=".5" stop-color="#c7e0e9" stop-opacity=".15"/><stop offset="1" stop-color="#a9cbd8" stop-opacity=".55"/></linearGradient><linearGradient id="water" x2="0" y2="1"><stop stop-color="#b9e2ed" stop-opacity=".75"/><stop offset="1" stop-color="#58a3bf" stop-opacity=".8"/></linearGradient><linearGradient id="metal"><stop stop-color="#516b78"/><stop offset=".3" stop-color="#d4e3e8"/><stop offset=".65" stop-color="#899ea8"/><stop offset="1" stop-color="#3d5967"/></linearGradient><filter id="soft"><feGaussianBlur stdDeviation="1.8"/></filter></defs>`;
 function scopedTank(markup,index){for(const id of ['glass','water','metal','soft'])markup=markup.replaceAll('id="'+id+'"','id="cp-tank-'+index+'-'+id+'"').replaceAll('url(#'+id+')','url(#cp-tank-'+index+'-'+id+')');return markup;}
 function font(){if(window.scienceNormalizeFigure)return;for(const svg of host.querySelectorAll('svg[data-fit]')){const w=svg.getBoundingClientRect().width;if(w)for(const t of svg.querySelectorAll('text'))t.style.fontSize=(15*Number(svg.getAttribute('viewBox').split(' ')[2])/w)+'px';}}
 function scene(body,height=420){window.scienceScene.render($('cpScene'),`<svg viewBox="0 0 600 ${height}" data-fit role="img" aria-label="${heading()}">${defs}${body}</svg>`);font();}
 const on=(id,fn,event='click')=>$(id).addEventListener(event,fn);
 function bindRange(id,fn){on(id,()=>{fn(Number($(id).value));render();},'input');}
 function value(id,v,suffix=''){$(id).value=v;const out=$(id+'Value');if(out)out.textContent=v+suffix;}
 function steps(id,items){$(id).innerHTML=items.map(([t,done])=>`<span class="${done?'done':''}">${done?'✓ ':''}${t}</span>`).join('');}
 // Short visual sequences: the state changes at once, only the picture is played over time.
 const reduced=()=>!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 let anim=null,animEnd=()=>{};
 function play(name,dur,data={}){anim={name,start:performance.now(),dur:reduced()?0:dur,data};render();}
 function phase(name){if(!anim||anim.name!==name)return null;return anim.dur?Math.min(1,(performance.now()-anim.start)/anim.dur):1;}
 const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,lerp=(a,b,t)=>a+(b-a)*t,seg=(t,a,b)=>Math.max(0,Math.min(1,(t-a)/(b-a)));
 function mix(a,b,t){const p=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)),x=p(a),y=p(b);return '#'+x.map((v,i)=>Math.round(lerp(v,y[i],t)).toString(16).padStart(2,'0')).join('');}
 const heading=()=>host.querySelector('h2')?.textContent||document.querySelector('h1')?.textContent||'';
 if(slug==='water-electrolysis'){
  model=M.electrolysis;
  render=()=>{
   const gases=model.gases(s),active=s.running&&s.solution==='sulfate';
   let b='<ellipse cx="280" cy="375" rx="220" ry="20" fill="#9bb7c3" opacity=".18"/><path d="M80 203V358Q80 370 94 370H444Q458 370 458 358V203" fill="url(#glass)" stroke="#789aaa" stroke-width="3"/><path d="M85 270H453V356Q453 365 440 365H98Q85 365 85 352Z" fill="url(#water)"/><path d="M85 270H453" stroke="#76b6c6" stroke-width="2"/>';
   gases.forEach((g,i)=>{const x=155+i*165,gasH=s.filled&&s.sealed?g.amount*6:0;b+=`<path d="M${x} 72V327M${x+52} 72V327" stroke="#789aab" stroke-width="2"/><rect x="${x+2}" y="74" width="48" height="253" fill="url(#glass)"/>`;if(s.filled)b+=`<rect x="${x+3}" y="${74+gasH}" width="46" height="${253-gasH}" fill="url(#water)"/><path d="M${x+3} ${74+gasH}Q${x+26} ${80+gasH} ${x+49} ${74+gasH}" fill="none" stroke="#6fa7b7"/>`;
    if(s.sealed)b+=`<rect x="${x-4}" y="57" width="60" height="20" rx="5" fill="#344b59"/><path d="M${x} 63H${x+51}" stroke="#7d919c"/>`;
    b+=`<rect x="${x+22.5}" y="300" width="7" height="38" rx="1" fill="url(#metal)" stroke="#617e8d"/><path d="M${x+26} 338${i?'V382H555V185H521V200':'V400H575V170H477V200'}" fill="none" stroke="${g.polarity==='+'?'#bc654a':'#344f68'}" stroke-width="4"/>`;
    for(let n=0;n<=24;n+=4){const y=74+n*6;b+=`<path d="M${x+54} ${y}h8" stroke="#7a9aa8"/>`+txt(x+78,y+5,n);}
    b+=txt(x+25,39,(i?'오른쪽':'왼쪽')+' '+g.polarity);
    if(active)for(let j=0;j<(g.name==='H₂'?8:4);j++)b+=`<circle cx="${x+15+(j%3)*11}" cy="${300-(s.charge*110+j*23)%Math.max(15,218-gasH)}" r="${2+j%3}" fill="#eaffff" stroke="#4399b1" opacity=".8"/>`;
   });
   b+='<rect x="459" y="210" width="82" height="105" rx="9" fill="#263f50"/><rect x="464" y="216" width="72" height="25" rx="5" fill="#e5b75f"/><rect x="470" y="199" width="14" height="12" rx="3" fill="url(#metal)"/><rect x="512" y="199" width="18" height="12" rx="3" fill="url(#metal)"/>'+txt(500,273,'전원','middle','#fff');
   scene(b);read(...gases.map(g=>s.filled?fmt(g.amount,1)+' 눈금':'관 미충전'));
   value('elSolution',s.solution);value('elSeal',s.sealed?'sealed':'open');value('elPolarity',s.reversed?'reverse':'normal');
   $('elPower').textContent=s.running?'전원 끄기':'전원 켜기';$('elStep').disabled=!s.running;$('elFill').disabled=s.running;for(const id of ['elSolution','elSeal','elPolarity'])$(id).disabled=s.running;
  };
  reset=()=>{s=model.create();say('두 관을 용액으로 가득 채워 공기를 빼고, 위쪽을 막아 기체를 모으세요.');render();};
  on('elFill',()=>{s.filled=true;s.charge=0;say('두 관의 공기를 빼고 뒤집었습니다. 전원을 켜서 기체가 모이는 모습을 관찰하세요.');render();});
  for(const id of ['elSolution','elSeal','elPolarity'])on(id,()=>{s.solution=$('elSolution').value;s.sealed=$('elSeal').value==='sealed';s.reversed=$('elPolarity').value==='reverse';s.filled=false;s.charge=0;say('조건을 바꿨습니다. 기체가 섞이지 않도록 두 관을 새 용액으로 다시 채우세요.');render();},'change');
  on('elPower',()=>{if(s.running)s.running=false;else if(!model.valid(s)){say(!s.filled?'관에 처음부터 공기가 남으면 생성 기체의 부피를 구별할 수 없습니다. 두 관을 먼저 채우세요.':'마개가 열려 있어 기체를 모을 수 없습니다. 위쪽을 막고 다시 준비하세요.');render();return;}else{s.running=true;say(s.solution==='pure'?'순수한 물에는 전류가 매우 적게 흐릅니다. 이 관찰 시간에는 모인 기체를 비교하기 어렵습니다.':'두 전극에서 생긴 기체가 관 위쪽에 모입니다. 같은 전하량에서 늘어나는 부피를 비교하세요.');}render();});
  on('elStep',()=>{model.advance(s,1);render();});advance=dt=>{if(s.running){model.advance(s,dt*.25);render();}};
 }
 if(slug==='cell-micrometry'){
  model=M.micrometry;
  // Side view of the wet mount: a drop on the onion epidermis, then the cover glass lowered at a slant.
  function bench(p){
   const done=p===null?0:p,drop=seg(done,.05,.32),cover=ease(seg(done,.42,.95)),spread=seg(done,.85,1);
   let b='<path d="M70 351H530" stroke="#b6c8cf" stroke-width="2.4"/><rect x="110" y="330" width="380" height="20" rx="3" fill="#e6f2f5" stroke="#88a9b6" stroke-width="2"/><rect x="110" y="330" width="62" height="20" rx="3" fill="#eef1ee" stroke="#a5b3b0"/><path d="M174 334H486" stroke="#fff" stroke-width="2" opacity=".8"/>';
   b+='<path d="M232 330Q300 322 368 330Z" fill="#efe7a6" stroke="#b9ad5f" stroke-width="1.5"/>';
   if(p!==null){const ry=lerp(0,15,drop)*(1-spread*.75),rx=lerp(0,30,drop)+spread*46;if(drop>0)b+=`<path d="M${300-rx} 329Q300 ${329-ry*2} ${300+rx} 329Z" fill="#bfe2ee" fill-opacity=".85" stroke="#6faac0" stroke-width="1.5"/>`;}
   if(p!==null&&done<.4){const y=lerp(150,268,ease(seg(done,0,.18)))-lerp(0,110,seg(done,.3,.4));b+=`<path d="M296 ${y-120}V${y-14}L299 ${y}H301L304 ${y-14}V${y-120}Z" fill="#f3fafc" stroke="#7d9fae" stroke-width="1.5"/><path d="M297 ${y-60}V${y-14}L299.5 ${y-2}H300.5L303 ${y-14}V${y-60}Z" fill="#bfe2ee"/><path d="M292 ${y-120}Q290 ${y-150} 300 ${y-152}Q310 ${y-150} 308 ${y-120}Z" fill="#c9584a" stroke="#8f3c33" stroke-width="1.5"/>`;const q=seg(done,.16,.3);if(q>0&&q<1)b+=`<ellipse cx="300" cy="${lerp(y+6,322,q*q)}" rx="4" ry="5.5" fill="#9fd0e2"/>`;}
   // Cover glass: pivot on its left edge beside the drop, the right edge held by a needle.
   if(p===null){b+='<rect x="398" y="325" width="78" height="5" rx="1.5" fill="#e6f4f8" stroke="#86a8b5" stroke-width="1.5"/>';}
   else{const ang=lerp(-38,0,cover),cx=244,cy=329,len=112,ex=cx+len*Math.cos(ang*Math.PI/180),ey=cy+len*Math.sin(ang*Math.PI/180);
    b+=`<g transform="rotate(${ang.toFixed(2)} ${cx} ${cy})"><rect x="${cx}" y="${cy-6}" width="${len}" height="6" rx="1.5" fill="#e6f4f8" fill-opacity=".9" stroke="#86a8b5" stroke-width="1.5"/></g>`;
    if(done<.97)b+=`<path d="M${ex+2} ${ey-3}L${ex+70} ${ey-80}" stroke="#7f8e96" stroke-width="3" stroke-linecap="round"/><path d="M${ex+64} ${ey-74}L${ex+104} ${ey-118}" stroke="#a7795a" stroke-width="10" stroke-linecap="round"/>`;}
   b=`<g transform="translate(-120 -150) scale(1.4)">${b}</g>`+txt(300,380,'받침 유리')+'<path d="M290 304L206 262" stroke="#8aa0a8"/>'+txt(170,256,'양파 표피');
   if(p===null)b+=txt(502,286,'덮개 유리');
   return b;
  }
  render=()=>{
   const cell=s.slide==='cell',scale=4.8,unit=model.unit(s.magnification),[l,r]=model.edges(s.magnification),pp=phase('prep');
   if(cell&&(!s.prepared||pp!==null)){scene(bench(s.prepared?pp:null),470);}
   else{
   let b='<defs><clipPath id="miField"><circle cx="300" cy="230" r="220"/></clipPath><radialGradient id="miLight"><stop stop-color="#f8f7d8"/><stop offset=".85" stop-color="#e7ecc3"/><stop offset="1" stop-color="#81998e"/></radialGradient></defs><circle cx="300" cy="230" r="224" fill="#1c3547"/><g clip-path="url(#miField)"><circle cx="300" cy="230" r="220" fill="'+(cell?'url(#miLight)':'#f9fcfd')+'"/>';
   if(cell&&s.prepared){const width=(r-l)*scale,ht=width*.34;for(let row=-6;row<7;row++)for(let col=-6;col<7;col++){const x=60+l*scale+col*width+(row%2?width*.35:0),y=210+row*ht;b+=`<g opacity=".8"${s.focus<8?' filter="url(#soft)"':''}><path d="M${x} ${y+2}Q${x+width*.45} ${y-4} ${x+width} ${y+1}L${x+width-3} ${y+ht-2}Q${x+width*.4} ${y+ht+4} ${x+1} ${y+ht}Z" fill="${row===0&&col===0?'#f6f3ac':'#e8e9b5'}" stroke="${row===0&&col===0?'#647948':'#91a575'}" stroke-width="2"/><ellipse cx="${x+width*.73}" cy="${y+ht*.67}" rx="${Math.max(2,width*.033)}" ry="${Math.max(2,ht*.10)}" fill="#909d6b" opacity=".7"/></g>`;}}
   else if(!cell){b+=`<g transform="translate(${s.offset*scale} 0) rotate(${s.angle} 300 230)"${s.focus<8?' filter="url(#soft)"':''}><path d="M45 250H555" stroke="#32748b"/>`;for(let n=0;n<110;n++){const x=60+n*10/unit*scale;if(x>560)break;b+=`<path d="M${x} 245V${n%5===0?282:269}" stroke="#32748b" stroke-width="1.5"/>`;if(n%10===0)b+=txt(x,309,n,'middle','#286276');}b+='</g>';}
   b+='<path d="M45 190H555" stroke="#273f47"/>';for(let n=0;n<=100;n++){const x=60+n*scale;b+=`<path d="M${x} 190V${n%10===0?217:202}" stroke="#273f47"/>`;if(n%10===0&&n>0&&n<100)b+=txt(x,175,n);}
   if(cell&&s.prepared)for(const [n,c]of [[s.left,'#af7043'],[s.right,'#236d8b']])b+=`<path d="M${60+n*scale} 200V345" stroke="${c}" stroke-width="2.5" stroke-dasharray="5 3"/>`;
   b+='</g>';scene(b,470);}
   value('miMag',s.magnification);value('miSlide',s.slide);for(const [id,key]of [['miFocus','focus'],['miAngle','angle'],['miOffset','offset'],['miLeft','left'],['miRight','right']])value(id,s[key]);
   $('miCalibration').hidden=cell;$('miMeasurement').hidden=!cell;$('miAngle').disabled=cell;$('miOffset').disabled=cell;$('miPrepare').disabled=s.prepared||!cell;
   $('miKey').textContent=cell?(s.prepared?'갈색·파랑 표시선: 측정 구간':'표본 만들기'):'파랑: 대물 눈금';read(s.calibrated?fmt(s.unit,2)+' µm':'보정 전',model.length(s)===null?'—':fmt(model.length(s),1)+' µm');
  };
  reset=()=>{s=model.create();value('miOcular',20);value('miStage',10);say('초점을 맞추고 두 눈금을 평행하게 놓으세요. 겹치는 두 선 사이의 칸 수로 보정합니다.');render();};
  on('miMag',()=>{s.magnification=Number($('miMag').value);s.calibrated=false;s.unit=null;s.slide='calibration';say('배율이 바뀌었습니다. 대물마이크로미터로 눈금 한 칸의 길이를 다시 구하세요.');render();},'change');
  on('miSlide',()=>{s.slide=$('miSlide').value;say(s.slide==='cell'?(s.prepared?'색이 진한 가운데 세포의 양쪽 세포벽을 읽으세요.':'양파 표피에 물 한 방울을 떨어뜨리고 덮개 유리를 덮으세요.'):'겹치는 두 눈금 사이의 칸 수를 세세요.');render();},'change');
  bindRange('miFocus',v=>s.focus=v);bindRange('miAngle',v=>{s.angle=v;s.calibrated=false;s.unit=null;});bindRange('miOffset',v=>{s.offset=v;s.calibrated=false;s.unit=null;});bindRange('miLeft',v=>s.left=v);bindRange('miRight',v=>s.right=v);
  on('miPrepare',()=>{if(s.slide!=='cell')return;s.prepared=true;say('받침 유리의 양파 표피에 물을 떨어뜨리고 덮개 유리를 비스듬히 덮었습니다. 재물대에 올려 세포를 관찰하세요.');play('prep',2600);});
  on('miCalibrate',()=>{const good=model.calibrate(s,$('miOcular').value,$('miStage').value);say(good?'보정했습니다. 세포 표본으로 바꿔 두 세포벽 사이의 길이를 측정하세요.':'초점·평행·시작 눈금의 일치를 확인하고, 같은 구간의 칸 수를 다시 세세요.');render();});
 }
 if(slug==='leaf-pigments'){
  model=M.pigments;
  const O=336,U=36,FLOOR=408,TOP=FLOOR-344,CX=210,BX=420,PW=120,juice='#2f7d45';
  const leaves=[[62,372,20],[92,366,-30],[118,376,60],[76,388,-70],[104,390,15],[132,368,-10]];
  function mortar(p){
   const t=p===null?(s.extracted?1:0):ease(p),liquid=mix('#e3ecd8',juice,t);let b='';
   b+='<path d="M18 362Q20 412 76 414Q132 412 134 362Z" fill="#e7e2d7" stroke="#a39b8b" stroke-width="2"/><path d="M28 368Q34 404 76 406Q118 404 124 368Z" fill="'+liquid+'" opacity=".9"/><ellipse cx="76" cy="362" rx="58" ry="9" fill="#f1ede5" stroke="#a39b8b" stroke-width="2"/><ellipse cx="76" cy="364" rx="47" ry="5.5" fill="'+liquid+'" opacity=".95"/>';
   if(t<1)for(const [x,y,a]of leaves){const k=1-t;b+=`<path d="M0 -9Q9 -3 0 9Q-9 -3 0 -9Z" fill="#4f9a3d" stroke="#2f6f2b" stroke-width="1" transform="translate(${x-12} ${y}) rotate(${a+(p===null?0:p*400)}) scale(${(k*1.1).toFixed(3)})"/>`;}
   const th=p===null?2.6:p*Math.PI*8,tx=76+26*Math.cos(th),ty=386+6*Math.sin(th),hx=tx-30+8*Math.cos(th),hy=ty-104;
   b+=`<path d="M${tx} ${ty}L${hx} ${hy}" stroke="#a39b8b" stroke-width="18" stroke-linecap="round"/><path d="M${tx} ${ty}L${hx} ${hy}" stroke="#ece6da" stroke-width="14" stroke-linecap="round"/>`;
   return b+txt(76,438,'막자사발');
  }
  function plate(px,dy){
   let b=`<g transform="translate(0 ${dy.toFixed(1)})"><rect x="${px}" y="${TOP}" width="${PW}" height="${FLOOR-TOP}" fill="#faf7e9" stroke="#c2c8ad"/>`;
   const front=model.front(s),mid=px+PW/2;
   if(s.progress>0){b+=`<rect x="${px+2}" y="${O-front*U}" width="${PW-4}" height="${front*U+(FLOOR-O)-2}" fill="#ecebd4"/><path d="M${px+2} ${O-front*U}H${px+PW-2}" stroke="#7395a2" stroke-width="2"${s.marked?'':' stroke-dasharray="5 4"'}/>`;
    model.distances(s).forEach((d,i)=>{b+=`<ellipse cx="${mid}" cy="${O-d*U}" rx="${30+i*3}" ry="${s.spots<5?3:6}" fill="${model.colors[i]}" opacity="${s.spots<5?.3:.78}" filter="url(#soft)"/>`;});}
   else if(s.spots){const pd=phase('dry'),w=s.wet?1:pd===null?0:1-pd;b+=`<ellipse cx="${mid}" cy="${O}" rx="${lerp(10,17,w)}" ry="${lerp(4.5,7.5,w)}" fill="${juice}" opacity="${.55+Math.min(s.spots,5)*.08}"/>`;}
   b+=`<path d="M${px-3} ${O}H${px+PW+3}" stroke="#748778" stroke-dasharray="4 3"/></g>`;return b;
  }
  render=()=>{
   const front=model.front(s),pIns=phase('insert'),pRem=phase('remove'),pExt=phase('extract'),pSpot=phase('spot'),inChamber=s.progress>0||s.running||pIns!==null;
   let b='<path d="M8 416H592" stroke="#bccdd3" stroke-width="3"/>';
   if(!inChamber&&!s.removed)b+=mortar(pExt);
   const chamberOpacity=s.removed?(pRem===null?0:1-pRem):1;
   if(chamberOpacity>0){b+=`<g opacity="${chamberOpacity.toFixed(2)}"><ellipse cx="270" cy="419" rx="128" ry="7" fill="#9dbac6" opacity=".25"/><path d="M150 50V396Q150 414 170 414H370Q390 414 390 396V50" fill="url(#glass)"/>`;
    b+=`<path d="M153 ${FLOOR-s.level*U}H387V396Q387 411 370 411H170Q153 411 153 396Z" fill="url(#water)" opacity=".42"/></g>`;}
   // Plate: standing on the bench beside the chamber until it is lowered in.
   if(inChamber||s.removed){let dy=0,px=CX;if(pIns!==null){const a=ease(seg(pIns,0,.42)),d=ease(seg(pIns,.42,1));if(pIns<.42){px=lerp(BX,CX,a);dy=lerp(0,-372,a);}else{dy=lerp(-372,0,d);}}b+=plate(px,dy);}
   else b+=plate(BX,0)+txt(480,438,'TLC 판')+txt(570,O+5,'출발선');
   if(chamberOpacity>0){b+=`<g opacity="${chamberOpacity.toFixed(2)}"><path d="M153 ${FLOOR-s.level*U}H387" stroke="#7fb3c4" stroke-width="2" opacity=".8"/><path d="M150 50V396Q150 414 170 414H370Q390 414 390 396V50" fill="none" stroke="#91aaba" stroke-width="3"/>`;
    const lidUp=pIns!==null&&pIns<.92?-46:pRem!==null?-46*pRem:0,lidX=pIns!==null&&pIns<.92?60:0;
    if(s.closed||pIns!==null&&pIns<.92)b+=`<g transform="translate(${lidX} ${lidUp})"><rect x="143" y="38" width="254" height="16" rx="6" fill="#bfd0d7" stroke="#7d97a3" stroke-width="2"/><rect x="250" y="30" width="40" height="10" rx="4" fill="#9fb4bd"/></g>`;
    b+='</g>'+(inChamber||s.removed?'':txt(270,438,'전개 용기'));}
   if(pSpot!==null){const tip=O-lerp(70,2,Math.sin(Math.PI*pSpot)),x=BX+PW/2;b+=`<path d="M${x-1.6} ${tip-120}V${tip}H${x+1.6}V${tip-120}Z" fill="#eef7f9" stroke="#7f9faa"/><path d="M${x-1} ${tip-16}V${tip}H${x+1}V${tip-16}Z" fill="${juice}"/>`;}
   if(inChamber||s.removed){const tx=CX+PW+4;b+=txt(368,O+5,'0');for(let n=1;n<=6;n++){const y=O-n*U;b+=`<path d="M${tx} ${y}h13" stroke="#7f969c"/>`+txt(368,y+5,n);}b+=txt(368,TOP+2,'cm');
    b+=txt(72,O+5,'출발선')+`<path d="M112 ${O}H${CX-4}" stroke="#8fa6b0"/>`;if(front>0)b+=txt(72,O-front*U-9+5,'용매 전선')+`<path d="M118 ${O-front*U}H${CX-4}" stroke="#8fa6b0"/>`;}
   scene(b,450);steps('pgSteps',[['추출',s.extracted],['농축',s.spots>=5&&!s.wet],['전개',s.progress>0],['전선 표시',s.marked]]);read(s.spots+(s.wet?'회 · 마르기 전':'회 · 건조'),s.removed&&s.marked?fmt(front,1)+' cm':'자로 관찰');
   $('pgLegend').innerHTML=model.names.map((n,i)=>`<span><i class="cp-key" style="background:${model.colors[i]}"></i>${n}</span>`).join('');
   const began=s.progress>0||s.running||pIns!==null,busy=!!anim;for(const id of ['pgLevel','pgCap'])$(id).disabled=began;$('pgExtract').disabled=s.extracted||busy;$('pgSpot').disabled=!s.extracted||s.wet||began||busy;$('pgDry').disabled=!s.wet||began||busy;$('pgStart').disabled=began||busy;$('pgRemove').disabled=!began||s.removed||busy;$('pgMark').disabled=!s.removed||s.marked||busy;value('pgLevel',s.level);value('pgCap',s.closed?'closed':'open');
  };
  animEnd=done=>{if(done.name==='insert'){s.running=true;}};
  reset=()=>{s=model.create();value('pgDistance',0);value('pgFront',0);value('pgBand',2);$('pgResult').textContent='전개가 끝나면 거리를 측정하세요.';say('시금치 잎을 막자사발에 넣고 아세톤을 부어 갈아서 색소를 추출하세요.');render();};
  on('pgExtract',()=>{s.extracted=true;say('잎을 아세톤과 함께 갈아 초록색 추출액을 얻었습니다. 출발점에 찍고 말리는 과정을 5회 이상 반복하세요.');play('extract',2400);});
  on('pgSpot',()=>{s.spots++;s.wet=true;say('출발점이 젖었습니다. 말린 뒤 다시 찍어 작은 점에 색소를 모으세요.');play('spot',700);});on('pgDry',()=>{s.wet=false;say(s.spots>=5?'충분히 농축했습니다. 출발선보다 낮게 전개액을 넣고 마개를 닫으세요.':'출발점이 말랐습니다. 찍고 말리기를 계속하세요.');play('dry',600);});
  on('pgLevel',()=>{s.level=Number($('pgLevel').value);render();},'change');on('pgCap',()=>{s.closed=$('pgCap').value==='closed';render();},'change');
  on('pgStart',()=>{if(!model.valid(s)){say(s.level>=2?'출발점이 전개액에 잠겨 색소가 용액으로 풀립니다. 전개액을 출발선보다 낮추세요.':!s.closed?'전개 용기를 닫아 용매 조성의 변화를 줄이세요.':s.wet?'출발점이 마르지 않았습니다. 먼저 말리세요.':'추출액을 찍고 말리는 과정을 5회 이상 반복하세요.');return;}say('판을 전개 용기에 넣고 마개를 닫았습니다. 용매가 올라가며 색소가 분리됩니다. 위쪽 표시 근처에 오면 판을 꺼내세요.');play('insert',1700);});
  on('pgRemove',()=>{s.running=false;s.removed=true;say('판을 꺼냈습니다. 용매가 증발하기 전에 전선의 위치를 표시하세요.');play('remove',800);});on('pgMark',()=>{s.marked=true;say('용매 전선을 표시했습니다. 출발선부터 색 띠의 중심과 용매 전선까지 거리를 읽으세요.');render();});
  on('pgCalculate',()=>{const d=Number($('pgDistance').value),f=Number($('pgFront').value),v=model.rf(s,d,f),n=Number($('pgBand').value);$('pgResult').textContent=v===null?'판을 꺼내 전선을 표시한 뒤, 0보다 큰 용매 거리와 그 이하의 색소 거리를 입력하세요.':Math.abs(f-model.front(s))>.12||Math.abs(d-model.distances(s)[n])>.12?'입력한 거리가 표시선과 맞는지 다시 읽으세요. 두 거리 모두 출발선이 기준입니다.':model.names[n]+'의 전개율 = '+fmt(d,1)+' ÷ '+fmt(f,1)+' = '+fmt(v,2);});
  advance=dt=>{if(s.running){model.advance(s,dt/15);if(!s.running)say('용매가 위쪽 표시까지 왔습니다. 판을 꺼내 전선을 표시하세요.');render();}};
 }
 if(slug==='digestive-enzymes'){
  model=M.digestion;
  const inside={empty:'#eef6f8',blue:'#354a90',brown:'#c49856'},tests={empty:'#eef6f8',clear:'#cfe8ee',cyan:'#65b7d0',orange:'#ce792e'};
  // A transfer pipette whose tip is at (x,y); fill 0–1 is the liquid drawn up inside.
  const pipette=(x,y,fill,color)=>`<g><path d="M${x-4} ${y-70}V${y-12}L${x-1.5} ${y}H${x+1.5}L${x+4} ${y-12}V${y-70}Z" fill="#f3fafc" fill-opacity=".85" stroke="#7d9fae" stroke-width="1.5"/>${fill>0?`<path d="M${x-3} ${y-12-46*fill}V${y-12}L${x-1} ${y-1}H${x+1}L${x+3} ${y-12}V${y-12-46*fill}Z" fill="${color}" opacity=".85"/>`:''}<path d="M${x-7} ${y-70}Q${x-9} ${y-94} ${x} ${y-96}Q${x+9} ${y-94} ${x+7} ${y-70}Z" fill="#c9584a" stroke="#8f3c33" stroke-width="1.5"/></g>`;
  function sample(r,i){
   const pp=phase('prep'),pi=phase('incubate'),ps=phase('sample'),pr=phase('reagent'),ph=phase('heat');
   let fillTop=s.prepared?78:null,color=inside[r.inside];
   if(pp!==null)fillTop=lerp(226,78,ease(pp));
   if(pi!==null&&r.inside==='brown')color=mix(inside.blue,inside.brown,ease(pi));
   let tube=s.sampled?222:null,test=tests[r.test];
   if(ps!==null){const t=seg(ps,.74,.94);tube=t>0?lerp(270,222,t):null;test=tests.clear;}
   if(pr!==null)test=mix(tests.clear,tests.cyan,ease(seg(pr,.3,1)));
   if(ph!==null)test=mix(tests.cyan,tests[r.test],ease(seg(ph,.25,1)));
   const hot=s.heated||ph!==null;
   let b=`<defs><linearGradient id="diGlass${i}"><stop stop-color="#a8cddb" stop-opacity=".45"/><stop offset=".3" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#81b1c5" stop-opacity=".45"/></linearGradient><clipPath id="diBag${i}"><path d="M56 48Q47 124 53 222Q78 238 103 222Q109 124 100 48Z"/></clipPath></defs>`;
   b+='<path d="M4 288H236" stroke="#b7c9d0" stroke-width="3"/><ellipse cx="77" cy="285" rx="68" ry="5" fill="#a9c1cb" opacity=".35"/>';
   // Beaker of distilled water with the cellophane bag hung from a glass rod.
   b+=`<path d="M12 42V268Q12 282 28 282H126Q142 282 142 268V42" fill="url(#diGlass${i})" stroke="#7d9fac" stroke-width="2"/><path d="M15 122H139V267Q139 279 126 279H28Q15 279 15 267Z" fill="#b5dce7" opacity=".55"/><path d="M15 122H139" stroke="#7fb5c6" stroke-width="1.5"/>`;
   b+='<rect x="2" y="30" width="150" height="7" rx="3.5" fill="#dfeef3" stroke="#86a8b5" stroke-width="1.5"/><path d="M78 37V48" stroke="#8a7a5c" stroke-width="2"/>';
   b+=`<path d="M56 48Q47 124 53 222Q78 238 103 222Q109 124 100 48Z" fill="#f2f7f9" fill-opacity=".55"/>`;
   if(fillTop!==null)b+=`<rect x="40" y="${fillTop}" width="80" height="170" fill="${color}" opacity=".9" clip-path="url(#diBag${i})"/><path d="M50 ${fillTop}H106" stroke="#fff" stroke-opacity=".35" stroke-width="2" clip-path="url(#diBag${i})"/>`;
   b+=`<path d="M56 48Q47 124 53 222Q78 238 103 222Q109 124 100 48Z" fill="none" stroke="#8c9dad" stroke-width="2"/><path d="M57 50H99" stroke="#6b5a40" stroke-width="5" stroke-linecap="round"/><path d="M60 226Q78 236 97 226" stroke="#6b5a40" stroke-width="5" fill="none" stroke-linecap="round"/>`;
   if(pp!==null&&pp<.95)b+=`<path d="M74 ${lerp(-10,20,seg(pp,0,.2))}V48" stroke="${inside.blue}" stroke-width="4" opacity=".75" stroke-dasharray="7 4" stroke-dashoffset="${-pp*90}"/>`;
   // Clock for the 30-minute reaction.
   if(s.incubated||pi!==null){const a=(pi===null?1:pi)*Math.PI*2;b+=`<circle cx="214" cy="40" r="15" fill="#fff" stroke="#7d97a2" stroke-width="2"/><path d="M214 40V29M214 40L${(214+10*Math.sin(a)).toFixed(1)} ${(40-10*Math.cos(a)).toFixed(1)}" stroke="#36535f" stroke-width="2" stroke-linecap="round"/>`;}
   // Test tube in a rack, later standing in a beaker of hot water.
   if(hot){b+=`<path d="M174 204V276Q174 284 182 284H220Q228 284 228 276V204" fill="url(#diGlass${i})" stroke="#7d9fac" stroke-width="2"/><path d="M176 214H226V275Q226 282 219 282H183Q176 282 176 275Z" fill="#cfe4ea" opacity=".75"/>`;}
   else b+='<rect x="166" y="190" width="70" height="9" rx="2" fill="#c9b18b" stroke="#9c8562"/><rect x="166" y="266" width="70" height="8" rx="2" fill="#c9b18b" stroke="#9c8562"/><path d="M171 199V286M231 199V286" stroke="#9c8562" stroke-width="5"/>';
   b+=`<path d="M187 148V256Q187 270 200 270Q213 270 213 256V148" fill="url(#diGlass${i})" stroke="#7399ab" stroke-width="2"/>`;
   if(tube!==null)b+=`<path d="M189 ${tube}H211V256Q211 268 200 268Q189 268 189 256Z" fill="${test}"/><path d="M193 ${tube+4}V260" stroke="#fff" stroke-opacity=".4" stroke-width="2"/>`;
   if(!hot)b+='<rect x="181" y="190" width="38" height="9" fill="#c9b18b"/><rect x="186" y="190" width="28" height="9" fill="#e9eef0" opacity=".9"/>';
   if(ph!==null&&ph<1)for(let k=0;k<6;k++){const q=(ph*2.4+k/6)%1;b+=`<circle cx="${180+k*8}" cy="${(280-q*62).toFixed(1)}" r="${1.6+k%2}" fill="none" stroke="#6ea7bb" opacity="${(1-q).toFixed(2)}"/>`;}
   if(ph!==null&&ph<1)b+=`<path d="M184 196q-5 -9 0 -18q5 -9 0 -18M218 196q-5 -9 0 -18q5 -9 0 -18" fill="none" stroke="#9fb8c2" stroke-width="2" opacity="${(.6*Math.sin(Math.PI*ph)).toFixed(2)}"/>`;
   // Moving the outside solution with a pipette, then adding Benedict's solution.
   if(ps!==null){let x,y,fill=0;const dn=seg(ps,0,.2),up=seg(ps,.35,.55),mv=seg(ps,.55,.74),rel=seg(ps,.74,.94);
    if(ps<.35){x=122;y=lerp(96,196,ease(dn));fill=seg(ps,.2,.35);}else if(ps<.55){x=122;y=lerp(196,96,ease(up));fill=1;}else if(ps<.74){x=lerp(122,200,ease(mv));y=96;fill=1;}else{x=200;y=lerp(96,140,ease(seg(rel,0,.25)));fill=1-seg(rel,.2,1);}
    b+=pipette(x,y,fill,'#b5dce7');}
   if(pr!==null){const y=126;b+=pipette(200,y,1-seg(pr,.1,.95),tests.cyan);for(let k=0;k<3;k++){const q=seg(pr,.12+k*.25,.37+k*.25);if(q>0&&q<1)b+=`<ellipse cx="200" cy="${lerp(y+4,tube||222,q*q).toFixed(1)}" rx="2.4" ry="3.2" fill="${tests.cyan}"/>`;}}
   return `<article class="cp-sample"><h3>${'ABC'[i]} · ${['침 용액','소화제 용액','증류수'][i]}</h3><svg viewBox="0 0 240 300" role="img" aria-label="${'ABC'[i]}의 셀로판 튜브 비커와 바깥 용액 검출 시험관">${b}</svg><p>튜브 안: ${!s.prepared?'준비 전':r.digested?'연한 갈색':'청람색'}</p><p>바깥 용액 검사: ${!s.sampled?'채취 전':!s.reagent?'시약 넣기 전':!s.heated?'푸른색 · 가열 전':r.test==='orange'?'황적색':'푸른색'}</p></article>`;
  }
  render=()=>{
   steps('diSteps',[['튜브 준비',s.prepared],['37 °C · 30분',s.incubated],['바깥 용액 채취',s.sampled],['시약·가열',s.heated]]);
   window.scienceScene.render($('diScene'),model.results(s).map(sample).join(''));
   const busy=!!anim;value('diEnzyme',s.enzyme);value('diMembrane',s.membrane);for(const id of ['diEnzyme','diMembrane'])$(id).disabled=s.prepared;$('diPrepare').disabled=s.prepared||busy;$('diIncubate').disabled=!s.prepared||s.incubated||busy;$('diSample').disabled=!s.incubated||s.sampled||busy;$('diReagent').disabled=!s.sampled||s.reagent||busy;$('diHeat').disabled=!s.reagent||s.heated||busy;
  };
  reset=()=>{s=model.create();say('세 튜브에 같은 녹말·아이오딘 혼합액과 각각의 비교 용액을 넣으세요.');render();};
  on('diEnzyme',()=>{s.enzyme=$('diEnzyme').value;render();},'change');on('diMembrane',()=>{s.membrane=$('diMembrane').value;render();},'change');
  for(const [id,key,message,name,dur]of [['diPrepare','prepared','세 튜브를 막고 같은 양의 증류수에 넣었습니다. 같은 온도와 시간으로 반응시키세요.','prep',1300],['diIncubate','incubated','30분 뒤 튜브 안의 색을 비교하세요. 다음으로 바깥 용액에서 환원당을 검출합니다.','incubate',2200],['diSample','sampled','튜브 안이 아니라 바깥 비커의 용액을 각각 2 mL 옮겼습니다.','sample',2400],['diReagent','reagent','베네딕트 용액을 넣었습니다. 푸른색만으로 음성 판정하지 말고 가열하세요.','reagent',1500],['diHeat','heated','가열한 세 시험관을 비교하세요. 효소의 작용과 막의 통과 여부가 각각 어떤 결과에 영향을 주었나요?','heat',2600]])on(id,()=>{s[key]=true;say(message);play(name,dur);});
 }
 if(slug==='spring-wave-speed'){
  model=M.wave;
  render=()=>{
   let b='<rect x="40" y="80" width="520" height="220" rx="12" fill="#f4f8f9"/><path d="M50 190H550" stroke="#a9bfc9" stroke-dasharray="4 5"/><rect x="548" y="146" width="15" height="88" rx="3" fill="url(#metal)"/>';
   const transverse=s.mode==='transverse',point=(x)=>{const d=model.displacement(s,x);return[50+125*x+(transverse?0:9*d),190+(transverse?-44*d:0)];};
   let path='';for(let n=0;n<=1600;n++){const x=4*n/1600,[px,py]=point(x),phase=n/1600*70*Math.PI*2;path+=(n?'L':'M')+(px+2.3*Math.cos(phase)).toFixed(2)+' '+(py+12*Math.sin(phase)).toFixed(2);}
   b+=`<path d="${path}" fill="none" stroke="#b4c5ca" stroke-width="3.8"/><path d="${path}" fill="none" stroke="#607f8c" stroke-width="1.7"/>`;
   const [rx,ry]=point(2),[hx,hy]=point(0);b+=`<circle cx="${hx}" cy="${hy}" r="7" fill="#c58132" stroke="#775a35"/><path d="M${rx-5} ${ry-17}L${rx+5} ${ry-17}L${rx+8} ${ry+25}L${rx} ${ry+20}L${rx-8} ${ry+25}Z" fill="#d18a39" stroke="#966733"/>`;
   const front=50+Math.min(4,model.speed(s)*s.time)*125;if(s.time>0)b+=`<path d="M${front} 110V274" stroke="#518eab" stroke-width="2" stroke-dasharray="5 5"/>`;
   b+='<path d="M50 312H550" stroke="#7f9aaa"/>';for(let n=0;n<=40;n++){const x=50+n*12.5;b+=`<path d="M${x} 312v${n%10===0?16:7}" stroke="#7f9aaa"/>`;if(n%10===0)b+=txt(x,353,n/10);}b+=txt(300,386,'위치 (m)');
   for(const [x,c]of [[s.x1,'#b47c38'],[s.x2,'#317591']])b+=`<path d="M${50+x*125} 90V306" stroke="${c}" stroke-width="2.4" stroke-dasharray="5 4"/>`;
   scene(b);value('wvMode',s.mode);value('wvFrequency',s.frequency);$('wvTime').max=model.duration(s);value('wvTime',s.time.toFixed(2));value('wvX1',s.x1);value('wvX2',s.x2);$('wvClock').textContent=fmt(s.time)+'초';$('wvPlay').textContent=s.running?'일시 정지':s.time>=model.duration(s)?'처음부터 다시 재생':'두 번 흔들기 · 재생';
   const v=model.measuredSpeed(4,s.t2-s.t1);read(fmt(s.t1)+' → '+fmt(s.t2)+'초',v===null?'—':fmt(v)+' m/s');
  };
  reset=()=>{s=model.create();value('wvPeriod',0);$('wvResult').textContent='위치와 주기를 읽어 입력하세요.';say('리본을 따라 눈으로 보고, 파동이 끝에 도달하는 시간을 표시하세요.');render();};
  for(const [id,key]of [['wvMode','mode'],['wvFrequency','frequency']])on(id,()=>{const mode=$('wvMode').value,frequency=Number($('wvFrequency').value);reset();s.mode=mode;s.frequency=frequency;say('조건을 바꿔 새 영상으로 시작합니다. 같은 파동 종류에서 진동수만 바꾸어 비교하세요.');render();},'change');
  on('wvPlay',()=>{if(s.time>=model.duration(s))s.time=0;s.running=!s.running;render();});on('wvFrame',()=>{s.running=false;s.time=Math.min(model.duration(s),s.time+.01);render();});bindRange('wvTime',v=>{s.running=false;s.time=M.clamp(v,0,model.duration(s));});bindRange('wvX1',v=>s.x1=v);bindRange('wvX2',v=>s.x2=v);
  on('wvStartTime',()=>{s.t1=s.time;say('4 m 전체를 이동하는 시간을 재려면 진동이 출발한 순간을 시작점으로 잡으세요.');render();});on('wvEndTime',()=>{s.t2=s.time;say(s.time>=model.duration(s)-.02&&s.t1<.02?'파동의 앞부분이 반대쪽 끝에 도달했습니다. 파장/주기로 구한 속력과 비교하세요.':'현재 시각을 표시했습니다. 4 m 전체 이동의 끝 시각은 파동 앞부분이 반대쪽 끝에 도달할 때입니다.');render();});
  on('wvCalculate',()=>{const lambda=Math.abs(s.x2-s.x1),T=Number($('wvPeriod').value),v=model.measuredSpeed(lambda,T);$('wvResult').textContent=v===null?'서로 다른 두 위치와 0보다 큰 주기를 입력하세요.':`선택 구간 ${fmt(lambda)} m ÷ ${fmt(T)}초 = ${fmt(v)} m/s. ${Math.abs(lambda-model.speed(s)/s.frequency)>.08?'두 위치가 이웃한 같은 위상인지 다시 확인하세요.':Math.abs(T-1/s.frequency)>.02?'같은 지점의 한 번 진동 시간을 다시 확인하세요.':'진행 시간으로 구한 속력과 비교하세요.'}`;});
  advance=dt=>{if(s.running){model.advance(s,dt*.35);if(!s.running)say('파동 앞부분이 반대쪽 끝에 도달한 프레임입니다. 시간을 읽고 끝점으로 표시하세요.');render();}};
 }
 if(slug==='coastal-inundation'){
  model=M.coast;const names={home:'집',school:'학교',field:'밭'},places={low:'낮은 땅',middle:'중간 땅',high:'높은 땅'};
  // A clay shore rising from the sea in three gentle steps; flats are where the flags stand.
  const X={low:216,middle:342,high:492},LAND='M130 362C142 340 152 312 170 302C178 299 186 300 196 300H262C276 300 282 268 296 254C302 250 310 250 318 250H386C400 250 408 216 422 204C428 200 436 200 446 200H568V362Z';
  const SKY='M33 104H568V200H446C436 200 428 200 422 204C408 216 400 250 386 250H318C310 250 302 250 296 254C282 268 276 300 262 300H196C186 300 178 299 170 302C152 312 142 340 130 362H33Z';
  let pourT=0,pouring=false;
  function building(k,place,ghost){const x=X[place],g=325-model.heights[place]*25;let b='';
   if(k==='field'){b+=`<path d="M${x-40} ${g}Q${x} ${g-11} ${x+40} ${g}Z" fill="#9c6b45"/>`;for(let n=0;n<6;n++){const px=x-30+n*12;b+=`<path d="M${px} ${g-4}v-16m0 7q-7 -5 -9 -10m9 13q7 -6 9 -11" fill="none" stroke="#5f8a4c" stroke-width="2.2" stroke-linecap="round"/>`;}}
   else{const w=k==='school'?60:46,h=k==='school'?40:36,c=k==='home'?'#efd2ad':'#e3e6cd',roof=k==='home'?'#b4694a':'#5f7f88';b+=`<rect x="${x-w/2}" y="${g-h}" width="${w}" height="${h}" rx="3" fill="${c}" stroke="#94785c" stroke-width="1.5"/><path d="M${x-w/2-6} ${g-h+1}L${x} ${g-h-22}L${x+w/2+6} ${g-h+1}Z" fill="${roof}" stroke="#7c5a45" stroke-width="1"/><rect x="${x-5}" y="${g-17}" width="10" height="17" fill="#6d8189"/>`;for(const a of k==='school'?[-24,-12,6,18]:[-16,9])b+=`<rect x="${x+a}" y="${g-h+8}" width="7" height="8" fill="#f4f8ec" stroke="#94785c" stroke-width=".8"/>`;}
   b+=`<path d="M${x+36} ${g}V${g-96}" stroke="#7d6a4f" stroke-width="2.5"/><path d="M${x+37} ${g-96}h36l-8 11 8 11h-36Z" fill="#f4e1a8" stroke="#b9a16b"/>`+txt(x,g-75,names[k]);
   return ghost?`<g opacity=".58">${b}</g>`:b;}
  function hand(){return '<path d="M-58 30Q-40 22 -16 22L-16 46Q-40 48 -58 44Z" fill="#7fa3c0" stroke="#5f84a0" stroke-width="1.5"/><path d="M-20 18Q-6 14 4 18L6 48Q-6 52 -20 48Z" fill="#e9bc98" stroke="#c48d6a" stroke-width="1.5"/>'+[22,31,40].map(y=>`<path d="M0 ${y}Q12 ${y-2} 14 ${y+3}" fill="none" stroke="#c48d6a" stroke-width="9" stroke-linecap="round"/><path d="M0 ${y}Q12 ${y-2} 14 ${y+3}" fill="none" stroke="#e9bc98" stroke-width="7" stroke-linecap="round"/>`).join('')+'<path d="M-4 16Q6 8 14 12" fill="none" stroke="#c48d6a" stroke-width="9" stroke-linecap="round"/><path d="M-4 16Q6 8 14 12" fill="none" stroke="#e9bc98" stroke-width="7" stroke-linecap="round"/>';}
  render=()=>{
   const pd=phase('drain'),pb=phase('build'),pe=phase('pourEnd'),lvl=pd===null?s.level:lerp(anim.data.from,0,ease(pd)),y=325-lvl*25,flooded=model.flooded(s);
   let b='<ellipse cx="300" cy="380" rx="265" ry="13" fill="#7d9da9" opacity=".15"/><path d="M28 104V349Q28 366 48 366H553Q572 366 572 349V104" fill="url(#glass)" stroke="#8aabba" stroke-width="3"/><defs><clipPath id="coWaterSpace"><path d="'+SKY+'"/></clipPath><linearGradient id="coClay" x2="0" y2="1"><stop stop-color="#d9ad7c"/><stop offset="1" stop-color="#b98455"/></linearGradient><clipPath id="coRise"><rect x="0" y="'+(pb===null?0:lerp(366,190,ease(pb)))+'" width="600" height="400"/></clipPath></defs>';
   if(s.built||pb!==null){b+=`<g clip-path="url(#coRise)"><path d="${LAND}" fill="url(#coClay)" stroke="#9a7048" stroke-width="2"/><path d="M196 300H262M318 250H386M446 200H566" stroke="#7fa462" stroke-width="5" stroke-linecap="round"/><path d="M172 312C200 318 240 316 262 310M300 264C330 270 360 268 384 262M426 214C470 222 520 220 564 214" fill="none" stroke="#c99a68" stroke-width="2" opacity=".7"/></g>`;
    const drop=pb===null?0:1-ease(seg(pb,.55,1));if(pb===null||pb>.55)b+=`<g transform="translate(0 ${(-24*drop).toFixed(1)})" opacity="${pb===null?1:seg(pb,.55,.8).toFixed(2)}">`+Object.entries(s.places).map(([k,p])=>building(k,p)).join('')+'</g>';}
   else b+=`<path d="${LAND}" fill="#efe4d3" fill-opacity=".55" stroke="#b9a27c" stroke-width="2" stroke-dasharray="7 6"/>`+Object.entries(s.places).map(([k,p])=>building(k,p,true)).join('');
   b+=`<g${s.built?' clip-path="url(#coWaterSpace)"':''}><path d="M33 ${y}H567V349Q567 361 550 361H50Q33 361 33 349Z" fill="url(#water)" opacity=".6" data-coast-water="${s.level}"/>`;
   // Transparent water overlays submerged building portions; the level line stays horizontal.
   b+=`<path d="M33 ${y}H567" stroke="#4b9bb7" stroke-width="2"/></g>`;
   if(s.marked)b+='<path d="M34 325H128" stroke="#af713c" stroke-width="2" stroke-dasharray="5 4"/>'+txt(80,346,'처음 수면');
   // Beaker held in a hand, tipping over the sea side of the tank.
   if(pouring||pe!==null){const tilt=pouring?Math.min(1,pourT/.35):lerp(1,0,ease(pe)),a=tilt*52,sx=112,sy=74,flow=pouring&&tilt>.85;
    const surf=lerp(30,4,tilt);
    let g=`<defs><clipPath id="coBeaker"><path d="M2 2V56Q2 62 8 62H40Q46 62 46 56V2Z"/></clipPath></defs><g clip-path="url(#coBeaker)"><rect transform="rotate(${(-a).toFixed(2)} 46 0)" x="-120" y="${surf.toFixed(1)}" width="300" height="200" fill="#8cc7dc" opacity=".85"/></g><path d="M0 0V56Q0 64 8 64H40Q48 64 48 56V0M48 0L53 -4" fill="url(#glass)" stroke="#6f95a6" stroke-width="2"/>${[16,30,44].map(v=>`<path d="M30 ${v}H44" stroke="#7d9aa6"/>`).join('')}${hand()}`;
    b+=`<g transform="translate(${sx} ${sy}) rotate(${a.toFixed(2)}) translate(-50 0)">${g}</g>`;
    if(flow){const t=performance.now()/1000,ix=sx+14,top=sy+6;b+=`<path d="M${sx+3} ${top}Q${sx+15} ${top+14} ${ix} ${y}" fill="none" stroke="#6fb4cf" stroke-width="7" stroke-linecap="round" opacity=".85"/><path d="M${sx+3} ${top}Q${sx+15} ${top+14} ${ix} ${y}" fill="none" stroke="#d8f1f8" stroke-width="2.5" stroke-dasharray="10 9" stroke-dashoffset="${(-t*140).toFixed(1)}"/>`;
     for(let k=0;k<2;k++){const q=(t*1.4+k/2)%1;b+=`<ellipse cx="${ix}" cy="${y}" rx="${(6+q*34).toFixed(1)}" ry="${(1.5+q*4).toFixed(1)}" fill="none" stroke="#4b9bb7" stroke-width="1.5" opacity="${(1-q).toFixed(2)}"/>`;}
     for(let k=0;k<6;k++){const q=(t*2.2+k/6)%1,dx=(k-2.5)*7*q,dy=-26*q+34*q*q;b+=`<circle cx="${(ix+dx).toFixed(1)}" cy="${(y+dy).toFixed(1)}" r="${k%2?1.8:2.4}" fill="#7cc0d8" opacity="${(1-q*.6).toFixed(2)}"/>`;}}}
   scene(b,410);read(s.level.toFixed(1)+' 눈금',flooded.length+'곳');
   for(const[k,v]of Object.entries(s.places)){value('co'+k,v);$('co'+k).disabled=s.level>0;}
   const busy=pb!==null||pd!==null;$('coBuild').disabled=s.built;$('coMark').disabled=!s.built||s.marked||busy;$('coPour').disabled=!s.built||!s.marked||s.running||s.target>=6||busy;$('coDrain').disabled=s.level===0||s.running;
   window.scienceScene.render($('coPlaces'),Object.entries(s.places).map(([k,p])=>`<span>${names[k]} · ${places[p]} · ${!s.built?'배치 전':flooded.includes(k)?'물에 잠김':Math.abs(s.level-model.heights[p])<1e-6?'물이 바닥에 닿음':'마른 땅'}</span>`).join(''));
  };
  reset=()=>{s=model.create();pouring=false;pourT=0;say('깃발을 놓을 높이를 정하고 점토 마을을 만드세요.');render();};
  for(const k of Object.keys(names))on('co'+k,()=>{model.place(s,k,$('co'+k).value);say('선택한 장소의 깃발을 바꿨습니다. 건물의 종류와 놓인 땅의 높이를 구별하세요.');render();},'change');
  on('coBuild',()=>{s.built=true;say('세 높이의 점토 마을에 깃발을 놓았습니다. 물을 붓기 전에 처음 수면을 표시하세요.');play('build',1200);});on('coMark',()=>{s.marked=true;say('처음 수면을 표시했습니다. 앞쪽 바다에 물을 조금씩 부으며 어느 곳부터 잠기는지 관찰하세요.');render();});
  on('coPour',()=>{if(anim?.name==='pourEnd')anim=null;s.target=Math.min(6,s.target+1);s.running=true;pouring=true;pourT=0;say('물을 조금 더 붓고 있습니다. 처음 표시와 지금 수면을 비교하세요.');render();});on('coDrain',()=>{const from=s.level;s.level=0;s.target=0;s.running=false;pouring=false;say('물을 처음 높이로 되돌렸습니다. 깃발 위치를 바꾸어 다시 비교할 수 있습니다.');play('drain',1100,{from});});
  // Hold the level still while the beaker tips, then let the water rise under the stream.
  advance=dt=>{if(s.running){pourT+=dt;if(pourT>.4||reduced())model.advance(s,dt);if(!s.running){pouring=false;if(!reduced())play('pourEnd',450);const wet=model.flooded(s);say(wet.length?wet.map(k=>names[k]).join('·')+'의 바닥에 물이 들어왔습니다. 같은 높이까지 물을 부었을 때 다른 배치도 비교해 보세요.':'아직 건물이나 밭의 바닥 위로 물이 들어오지 않았습니다. 다음 높이도 관찰하세요.');}render();}};
 }
 if(slug==='sea-level-causes'){
  model=M.seaLevel;
  // Desk lamp on its own stand: weighted base, pole, arm and a shade with the bulb inside.
  function lamp(on){let b='';
   if(on)b+='<path d="M124 96L176 96L232 282L70 282Z" fill="#ffd98a" opacity=".16"/>';
   b+='<ellipse cx="30" cy="294" rx="22" ry="5" fill="#5d7480"/><rect x="10" y="284" width="40" height="10" rx="4" fill="#6f8792" stroke="#4f6570"/><path d="M30 286V60Q30 44 46 44H140" fill="none" stroke="#6f8792" stroke-width="6" stroke-linecap="round"/><circle cx="30" cy="150" r="4" fill="#4f6570"/>';
   b+='<path d="M140 44V56" stroke="#4f6570" stroke-width="4"/><path d="M126 56H154L178 96H102Z" fill="#c8d4d9" stroke="#6b8590" stroke-width="2"/><path d="M106 92H174" stroke="#8ba0a9" stroke-width="2"/>';
   b+=`<ellipse cx="140" cy="97" rx="15" ry="8" fill="${on?'#ffe08f':'#eef2ef'}" stroke="${on?'#d9a640':'#a3b0b0'}" stroke-width="1.5"/>`;
   b+='<path d="M30 294Q22 304 4 304" fill="none" stroke="#5d7480" stroke-width="2"/>';return b;}
  render=()=>{
   window.scienceScene.render($('slScene'),s.tanks.map((t,i)=>{const label=['A · 가열 없음','B · 가열만','C · 가열 + 육상 얼음'][i],delta=(model.height(t)-7.5)*10,waterY=280-model.height(t)*15;
    let b='<path d="M2 298H338" stroke="#b9ccd3" stroke-width="3"/><ellipse cx="156" cy="296" rx="100" ry="5" fill="#7c9dad" opacity=".15"/><path d="M62 99V278Q62 291 76 291H236Q250 291 250 278V99" fill="url(#glass)" stroke="#84a6b5" stroke-width="3"/>';
    if(s.prepared){
     b+='<path d="M114 288L120 150H192L198 288" fill="#d8e3e7" opacity=".7" stroke="#89a6b1" stroke-width="2"/><path d="M120 150H192" stroke="#a8bec8" stroke-width="5"/>';
     b+=`<path d="M65 ${waterY}H247V278Q247 288 236 288H76Q65 288 65 278Z" fill="url(#water)"/><path d="M65 ${waterY}H247" stroke="#75aaba" stroke-width="2"/>`;
     if(i===2&&t.ice>.01){const a=Math.cbrt(t.ice/60);b+=`<g transform="translate(156 147) scale(${a.toFixed(3)})"><path d="M-24 0L-28 -30L-8 -46L24 -34L27 -4Z" fill="#dff4fa" stroke="#70a6bb" stroke-width="2"/><path d="M-28 -30L0 -20L24 -34M0 -20V-2" fill="none" stroke="#b0d3e0"/></g>`;if(s.running){const q=(performance.now()/700)%1;b+=`<path d="M190 ${(152+q*(waterY-160)).toFixed(1)}q6 8 0 11q-6 -3 0 -11" fill="#6faec4" opacity="${(1-q*.5).toFixed(2)}"/>`;}}
     b+='<rect x="221" y="86" width="18" height="38" rx="4" fill="#5b7884"/><path d="M230 124V250" stroke="#577783" stroke-width="3"/><rect x="225" y="93" width="10" height="23" rx="2" fill="#dff0e7"/>';
     if(s.marked)b+='<path d="M66 167.5H246" stroke="#b5743c" stroke-width="2" stroke-dasharray="5 4"/>';
    }
    if(i)b+=lamp(s.running);
    // Magnified window around the first water mark, always beside the tank.
    b+='<path d="M250 167.5L264 90M250 167.5L264 280" stroke="#9db4be" stroke-dasharray="3 3"/><rect x="264" y="70" width="70" height="220" rx="6" fill="#f7fbfc" stroke="#8eaab6" stroke-width="2"/>';
    if(s.prepared){const zy=Math.max(74,260-delta*20);b+=`<path d="M296 ${zy}H331V286H296Z" fill="url(#water)"/><path d="M296 ${zy}H331" stroke="#3a859b" stroke-width="2"/>`;}
    for(let n=0;n<=8;n+=2)b+=`<path d="M288 ${260-n*20}H296" stroke="#7f9da9"/>`+txt(278,265-n*20,n);
    if(s.marked)b+='<path d="M290 260H332" stroke="#b5743c" stroke-dasharray="5 3" stroke-width="2"/>';
    b+=txt(299,60,'mm');
    return `<article class="cp-sample"><h3>${label}</h3><svg viewBox="0 0 340 312" data-fit role="img" aria-label="${label}, 수조 장치와 처음 수면 주위 확대 눈금">${scopedTank(defs+b,i)}</svg><div class="cp-tank-values"><span>온도 <strong>${s.prepared?fmt(t.temperature,1)+' °C':'—'}</strong></span><span>수면 상승 <strong>${s.marked?fmt(delta,2)+' mm':'—'}</strong></span>${i===2?`<span>남은 얼음 <strong>${s.prepared?fmt(t.ice,1)+' g':'—'}</strong></span>`:''}</div></article>`;
   }).join(''));font();read(Math.floor(s.time/60)+'분 '+String(Math.floor(s.time%60)).padStart(2,'0')+'초',s.marked?'20.0 °C':'—');
   $('slPrepare').disabled=s.prepared;$('slMark').disabled=!s.prepared||s.marked;$('slPlay').disabled=!s.marked||s.time>=600;$('slPlay').textContent=s.running?'일시 정지':s.time>0?'가열 이어 하기':'가열 시작';$('slMinute').disabled=!s.marked||s.time>=600;
  };
  reset=()=>{s=model.create();say('세 수조에 같은 양의 물과 같은 받침을 준비하세요.');render();};
  const completed=()=>say('10분 관찰을 마쳤습니다. A·B의 차이와 B·C의 차이를 비교하세요. B와 C의 온도도 함께 확인하세요.');
  on('slPrepare',()=>{s.prepared=true;say('A는 가열하지 않습니다. B·C는 같은 스탠드 조명을 쓰고 C에만 물 위 받침에 얼음을 놓았습니다.');render();});
  on('slMark',()=>{s.marked=true;say('세 수조의 처음 수면과 20.0 °C를 표시했습니다. 같은 시간 동안 가열하며 변화를 비교하세요.');render();});
  on('slPlay',()=>{s.running=!s.running;say(s.running?'B·C를 가열하고 있습니다. 오른쪽 확대 눈금에서 처음 수면보다 얼마나 올라갔는지 읽으세요.':'현재 시각에서 멈췄습니다. 온도와 수면 상승량을 비교하세요.');render();});
  on('slMinute',()=>{const playing=s.running;s.running=true;model.advance(s,60);s.running=playing&&s.time<600;if(s.time>=600)completed();else say('세 수조를 같은 시각에서 비교하고 있습니다. 처음 수면과 현재 수면의 차이를 읽으세요.');render();});
  advance=dt=>{if(s.running){model.advance(s,dt*30);if(!s.running)completed();render();}};
 }
 if(!model)return;
 on('cpReset',()=>{anim=null;reset();});reset();new ResizeObserver(font).observe(host);
 let last=performance.now();function frame(now){const dt=Math.min(.08,(now-last)/1000);last=now;if(!document.hidden){advance(dt);if(anim){if(now-anim.start>=anim.dur){const done=anim;anim=null;animEnd(done);}render();}}requestAnimationFrame(frame);}requestAnimationFrame(frame);
 window.__coursePractice={getState:()=>JSON.parse(JSON.stringify(s)),slug};
})();
