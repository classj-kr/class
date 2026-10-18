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
 function scene(body,height=420){window.scienceScene.render($('cpScene'),`<svg viewBox="0 0 600 ${height}" data-fit role="img" aria-label="${host.querySelector('h2').textContent}">${defs}${body}</svg>`);font();}
 const on=(id,fn,event='click')=>$(id).addEventListener(event,fn);
 function bindRange(id,fn){on(id,()=>{fn(Number($(id).value));render();},'input');}
 function value(id,v,suffix=''){$(id).value=v;const out=$(id+'Value');if(out)out.textContent=v+suffix;}
 function steps(id,items){$(id).innerHTML=items.map(([t,done])=>`<span class="${done?'done':''}">${done?'✓ ':''}${t}</span>`).join('');}
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
  render=()=>{
   const cell=s.slide==='cell',scale=4.8,unit=model.unit(s.magnification),[l,r]=model.edges(s.magnification);
   let b='<defs><clipPath id="miField"><circle cx="300" cy="230" r="220"/></clipPath><radialGradient id="miLight"><stop stop-color="#f8f7d8"/><stop offset=".85" stop-color="#e7ecc3"/><stop offset="1" stop-color="#81998e"/></radialGradient></defs><circle cx="300" cy="230" r="224" fill="#1c3547"/><g clip-path="url(#miField)"><circle cx="300" cy="230" r="220" fill="'+(cell?'url(#miLight)':'#f9fcfd')+'"/>';
   if(cell&&s.prepared){const width=(r-l)*scale,ht=width*.34;for(let row=-6;row<7;row++)for(let col=-6;col<7;col++){const x=60+l*scale+col*width+(row%2?width*.35:0),y=210+row*ht;b+=`<g opacity=".8"${s.focus<8?' filter="url(#soft)"':''}><path d="M${x} ${y+2}Q${x+width*.45} ${y-4} ${x+width} ${y+1}L${x+width-3} ${y+ht-2}Q${x+width*.4} ${y+ht+4} ${x+1} ${y+ht}Z" fill="${row===0&&col===0?'#f6f3ac':'#e8e9b5'}" stroke="${row===0&&col===0?'#647948':'#91a575'}" stroke-width="2"/><ellipse cx="${x+width*.73}" cy="${y+ht*.67}" rx="${Math.max(2,width*.033)}" ry="${Math.max(2,ht*.10)}" fill="#909d6b" opacity=".7"/></g>`;}}
   else if(!cell){b+=`<g transform="translate(${s.offset*scale} 0) rotate(${s.angle} 300 230)"${s.focus<8?' filter="url(#soft)"':''}><path d="M45 250H555" stroke="#32748b"/>`;for(let n=0;n<110;n++){const x=60+n*10/unit*scale;if(x>560)break;b+=`<path d="M${x} 245V${n%5===0?282:269}" stroke="#32748b" stroke-width="1.5"/>`;if(n%10===0)b+=txt(x,309,n,'middle','#286276');}b+='</g>';}
   b+='<path d="M45 190H555" stroke="#273f47"/>';for(let n=0;n<=100;n++){const x=60+n*scale;b+=`<path d="M${x} 190V${n%10===0?217:202}" stroke="#273f47"/>`;if(n%10===0&&n>0&&n<100)b+=txt(x,175,n);}
   if(cell&&s.prepared)for(const [n,c]of [[s.left,'#af7043'],[s.right,'#236d8b']])b+=`<path d="M${60+n*scale} 200V345" stroke="${c}" stroke-width="2.5" stroke-dasharray="5 3"/>`;
   b+='</g>';scene(b,470);
   value('miMag',s.magnification);value('miSlide',s.slide);for(const [id,key]of [['miFocus','focus'],['miAngle','angle'],['miOffset','offset'],['miLeft','left'],['miRight','right']])value(id,s[key]);
   $('miCalibration').hidden=cell;$('miMeasurement').hidden=!cell;$('miAngle').disabled=cell;$('miOffset').disabled=cell;$('miPrepare').disabled=s.prepared;
   $('miKey').textContent=cell?'갈색·파랑 표시선: 측정 구간':'파랑: 대물 눈금';read(s.calibrated?fmt(s.unit,2)+' µm':'보정 전',model.length(s)===null?'—':fmt(model.length(s),1)+' µm');
  };
  reset=()=>{s=model.create();value('miOcular',20);value('miStage',10);say('초점을 맞추고 두 눈금을 평행하게 놓으세요. 겹치는 두 선 사이의 칸 수로 보정합니다.');render();};
  on('miMag',()=>{s.magnification=Number($('miMag').value);s.calibrated=false;s.unit=null;s.slide='calibration';say('배율이 바뀌었습니다. 대물마이크로미터로 눈금 한 칸의 길이를 다시 구하세요.');render();},'change');
  on('miSlide',()=>{s.slide=$('miSlide').value;say(s.slide==='cell'?(s.prepared?'색이 진한 가운데 세포의 양쪽 세포벽을 읽으세요.':'양파 표피에 물 한 방울을 떨어뜨리고 덮개 유리를 덮으세요.'):'겹치는 두 눈금 사이의 칸 수를 세세요.');render();},'change');
  bindRange('miFocus',v=>s.focus=v);bindRange('miAngle',v=>{s.angle=v;s.calibrated=false;s.unit=null;});bindRange('miOffset',v=>{s.offset=v;s.calibrated=false;s.unit=null;});bindRange('miLeft',v=>s.left=v);bindRange('miRight',v=>s.right=v);
  on('miPrepare',()=>{s.prepared=true;say('받침 유리에 양파 표피와 물을 놓고 덮개 유리를 덮었습니다. 세포 표본으로 바꾸세요.');render();});
  on('miCalibrate',()=>{const good=model.calibrate(s,$('miOcular').value,$('miStage').value);say(good?'보정했습니다. 세포 표본으로 바꿔 두 세포벽 사이의 길이를 측정하세요.':'초점·평행·시작 눈금의 일치를 확인하고, 같은 구간의 칸 수를 다시 세세요.');render();});
 }
 if(slug==='leaf-pigments'){
  model=M.pigments;
  render=()=>{
   const front=model.front(s),originY=320,unit=36;let b=s.removed?'':'<ellipse cx="295" cy="419" rx="150" ry="14" fill="#9dbac6" opacity=".2"/><path d="M145 37V398Q145 415 165 415H405Q425 415 425 398V37" fill="url(#glass)" stroke="#91aaba" stroke-width="3"/>';
   if(s.closed&&!s.removed)b+='<rect x="138" y="26" width="294" height="25" rx="7" fill="#334f5c"/><path d="M151 31H412" stroke="#8099a4"/>';
   b+=`<rect x="211" y="48" width="145" height="${originY+2*unit-48}" fill="#faf7e9" stroke="#c2c8ad"/>`;
   if(s.progress>0){b+=`<rect x="213" y="${originY-front*unit}" width="141" height="${front*unit+15}" fill="#e9e9d3"/><path d="M213 ${originY-front*unit}H354" stroke="#7395a2" stroke-width="2"${s.marked?'':' stroke-dasharray="5 4"'}/>`;
    model.distances(s).forEach((d,i)=>{b+=`<ellipse cx="283" cy="${originY-d*unit}" rx="${38+i*3}" ry="${s.spots<5?3:6}" fill="${model.colors[i]}" opacity="${s.spots<5?.3:.78}" filter="url(#soft)"/>`;});
   }else if(s.spots)b+=`<ellipse cx="283" cy="${originY}" rx="${s.wet?19:12}" ry="${s.wet?8:5}" fill="#327a4d" opacity=".85"/>`;
   b+=`<path d="M208 ${originY}H360" stroke="#748778" stroke-dasharray="4 3"/>`+txt(385,originY+5,'0','start');
   for(let n=1;n<=6;n++){const y=originY-n*unit;b+=`<path d="M363 ${y}h13" stroke="#7f969c"/>`+txt(385,y+5,n,'start');}b+=txt(390,70,'cm');
   if(!s.removed)b+=`<path d="M150 ${originY+2*unit-s.level*unit}H420V398Q420 410 406 410H166Q150 410 150 398Z" fill="url(#water)" opacity=".6"/>`;
   b+=txt(92,originY+4,'출발선')+`<path d="M124 ${originY}H204" stroke="#8fa6b0"/>`;
   if(front>0)b+=txt(92,originY-front*unit-9,'용매 전선')+`<path d="M124 ${originY-front*unit}H206" stroke="#8fa6b0"/>`;
   scene(b,450);steps('pgSteps',[['추출',s.extracted],['농축',s.spots>=5&&!s.wet],['전개',s.progress>0],['전선 표시',s.marked]]);read(s.spots+(s.wet?'회 · 마르기 전':'회 · 건조'),s.removed&&s.marked?fmt(front,1)+' cm':'자로 관찰');
   $('pgLegend').innerHTML=model.names.map((n,i)=>`<span><i class="cp-key" style="background:${model.colors[i]}"></i>${n}</span>`).join('');
   const began=s.progress>0||s.running;for(const id of ['pgLevel','pgCap'])$(id).disabled=began;$('pgExtract').disabled=s.extracted;$('pgSpot').disabled=!s.extracted||s.wet||began;$('pgDry').disabled=!s.wet||began;$('pgStart').disabled=began;$('pgRemove').disabled=!began||s.removed;$('pgMark').disabled=!s.removed||s.marked;value('pgLevel',s.level);value('pgCap',s.closed?'closed':'open');
  };
  reset=()=>{s=model.create();value('pgDistance',0);value('pgFront',0);value('pgBand',2);$('pgResult').textContent='전개가 끝나면 거리를 측정하세요.';say('시금치 가루를 아세톤에 넣어 뚜껑을 닫고 흔든 뒤 색소를 추출하세요.');render();};
  on('pgExtract',()=>{s.extracted=true;say('10분 뒤 초록색 추출액을 얻었습니다. 출발점에 찍고 말리는 과정을 5회 이상 반복하세요.');render();});
  on('pgSpot',()=>{s.spots++;s.wet=true;say('출발점이 젖었습니다. 말린 뒤 다시 찍어 작은 점에 색소를 모으세요.');render();});on('pgDry',()=>{s.wet=false;say(s.spots>=5?'충분히 농축했습니다. 출발선보다 낮게 전개액을 넣고 마개를 닫으세요.':'출발점이 말랐습니다. 찍고 말리기를 계속하세요.');render();});
  on('pgLevel',()=>{s.level=Number($('pgLevel').value);render();},'change');on('pgCap',()=>{s.closed=$('pgCap').value==='closed';render();},'change');
  on('pgStart',()=>{if(!model.valid(s)){say(s.level>=2?'출발점이 전개액에 잠겨 색소가 용액으로 풀립니다. 전개액을 출발선보다 낮추세요.':!s.closed?'전개 용기를 닫아 용매 조성의 변화를 줄이세요.':s.wet?'출발점이 마르지 않았습니다. 먼저 말리세요.':'추출액을 찍고 말리는 과정을 5회 이상 반복하세요.');return;}s.running=true;say('용매가 올라가며 색소가 분리됩니다. 위쪽 표시 근처에 오면 판을 꺼내세요.');render();});
  on('pgRemove',()=>{s.running=false;s.removed=true;say('판을 꺼냈습니다. 용매가 증발하기 전에 전선의 위치를 표시하세요.');render();});on('pgMark',()=>{s.marked=true;say('용매 전선을 표시했습니다. 출발선부터 색 띠의 중심과 용매 전선까지 거리를 읽으세요.');render();});
  on('pgCalculate',()=>{const d=Number($('pgDistance').value),f=Number($('pgFront').value),v=model.rf(s,d,f),n=Number($('pgBand').value);$('pgResult').textContent=v===null?'판을 꺼내 전선을 표시한 뒤, 0보다 큰 용매 거리와 그 이하의 색소 거리를 입력하세요.':Math.abs(f-model.front(s))>.12||Math.abs(d-model.distances(s)[n])>.12?'입력한 거리가 표시선과 맞는지 다시 읽으세요. 두 거리 모두 출발선이 기준입니다.':model.names[n]+'의 전개율 = '+fmt(d,1)+' ÷ '+fmt(f,1)+' = '+fmt(v,2);});
  advance=dt=>{if(s.running){model.advance(s,dt/15);if(!s.running)say('용매가 위쪽 표시까지 왔습니다. 판을 꺼내 전선을 표시하세요.');render();}};
 }
 if(slug==='digestive-enzymes'){
  model=M.digestion;
  render=()=>{
   steps('diSteps',[['튜브 준비',s.prepared],['37 °C · 30분',s.incubated],['바깥 용액 채취',s.sampled],['시약·가열',s.heated]]);
   window.scienceScene.render($('diScene'),model.results(s).map((r,i)=>{const color=r.inside==='empty'?'#eef6f8':r.inside==='blue'?'#354a90':'#c49856',test={empty:'#eef6f8',clear:'#c5e5eb',cyan:'#65b7d0',orange:'#ce792e'}[r.test];return `<article class="cp-sample"><h3>${'ABC'[i]} · ${['침 용액','소화제 용액','증류수'][i]}</h3><svg viewBox="0 0 170 300" role="img" aria-label="${'ABC'[i]}의 튜브와 바깥 용액 검출 시험관"><defs><linearGradient id="diGlass${i}"><stop stop-color="#a8cddb" stop-opacity=".5"/><stop offset=".3" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#81b1c5" stop-opacity=".5"/></linearGradient></defs><ellipse cx="85" cy="175" rx="65" ry="9" fill="#b3cbd5" opacity=".3"/><path d="M23 20V158Q23 173 40 173H130Q147 173 147 158V20" fill="url(#diGlass${i})" stroke="#7d9fac" stroke-width="2"/><path d="M26 66H144V157Q144 168 130 168H40Q26 168 26 157Z" fill="#b5dce7" opacity=".6"/><path d="M60 29Q48 52 53 90L59 145Q85 159 111 145L117 90Q120 50 109 29Z" fill="${color}" stroke="#8c9dad" stroke-width="2"/><path d="M55 30H115M57 146H113" stroke="#536f80" stroke-width="7"/><path d="M70 205V275Q70 291 85 291Q100 291 100 275V205" fill="url(#diGlass${i})" stroke="#7399ab" stroke-width="2"/><path d="M73 240H97V275Q97 287 85 287Q73 287 73 275Z" fill="${test}"/><path d="M77 244V270" stroke="#fff" stroke-opacity=".4" stroke-width="3"/></svg><p>튜브 안: ${!s.prepared?'준비 전':r.digested?'연한 갈색':'청람색'}</p><p>바깥 용액 검사: ${!s.sampled?'채취 전':!s.reagent?'시약 넣기 전':!s.heated?'푸른색 · 가열 전':r.test==='orange'?'황적색':'푸른색'}</p></article>`;}).join(''));
   value('diEnzyme',s.enzyme);value('diMembrane',s.membrane);for(const id of ['diEnzyme','diMembrane'])$(id).disabled=s.prepared;$('diPrepare').disabled=s.prepared;$('diIncubate').disabled=!s.prepared||s.incubated;$('diSample').disabled=!s.incubated||s.sampled;$('diReagent').disabled=!s.sampled||s.reagent;$('diHeat').disabled=!s.reagent||s.heated;
  };
  reset=()=>{s=model.create();say('세 튜브에 같은 녹말·아이오딘 혼합액과 각각의 비교 용액을 넣으세요.');render();};
  on('diEnzyme',()=>{s.enzyme=$('diEnzyme').value;render();},'change');on('diMembrane',()=>{s.membrane=$('diMembrane').value;render();},'change');
  for(const [id,key,message]of [['diPrepare','prepared','세 튜브를 막고 같은 양의 증류수에 넣었습니다. 같은 온도와 시간으로 반응시키세요.'],['diIncubate','incubated','30분 뒤 튜브 안의 색을 비교하세요. 다음으로 바깥 용액에서 환원당을 검출합니다.'],['diSample','sampled','튜브 안이 아니라 바깥 비커의 용액을 각각 2 mL 옮겼습니다.'],['diReagent','reagent','베네딕트 용액을 넣었습니다. 푸른색만으로 음성 판정하지 말고 가열하세요.'],['diHeat','heated','가열한 세 시험관을 비교하세요. 효소의 작용과 막의 통과 여부가 각각 어떤 결과에 영향을 주었나요?']])on(id,()=>{s[key]=true;say(message);render();});
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
  render=()=>{
   const y=325-s.level*25,flooded=model.flooded(s);let b='<ellipse cx="300" cy="380" rx="265" ry="15" fill="#7d9da9" opacity=".15"/><path d="M28 104V349Q28 366 48 366H553Q572 366 572 349V104" fill="url(#glass)" stroke="#8aabba" stroke-width="3"/>';
   if(s.built){b+='<defs><clipPath id="coWaterSpace"><path d="M33 104H567V200H390V250H261V300H155V361H33Z"/></clipPath></defs><path d="M155 360V300H261V250H390V200H567V360Z" fill="#cbb787" stroke="#a18b63" stroke-width="2"/><path d="M157 300H260M263 250H389M392 200H565" stroke="#7e9c64" stroke-width="5"/>';
    for(const [k,place]of Object.entries(s.places)){const x={low:204,middle:323,high:466}[place],ground=325-model.heights[place]*25;
     if(k==='field'){b+=`<rect x="${x-35}" y="${ground-9}" width="70" height="9" rx="3" fill="#ad7951"/>`;for(let n=0;n<5;n++)b+=`<path d="M${x-24+n*12} ${ground-7}v-17m0 8l-6 -6m6 9l6 -8" fill="none" stroke="#628a51" stroke-width="2"/>`;}
     else{b+=`<rect x="${x-25}" y="${ground-40}" width="50" height="40" rx="3" fill="${k==='home'?'#e5c39b':'#d9dec2'}" stroke="#957f63"/><path d="M${x-31} ${ground-39}L${x} ${ground-62}L${x+31} ${ground-39}Z" fill="${k==='home'?'#b27655':'#607e88'}"/><rect x="${x-5}" y="${ground-20}" width="10" height="20" fill="#65818a"/>`;for(const a of [-16,11])b+=`<rect x="${x+a}" y="${ground-32}" width="7" height="9" fill="#eff5e7"/>`;}
     b+=`<path d="M${x+34} ${ground}V${ground-102}" stroke="#8b795c" stroke-width="2"/><path d="M${x+35} ${ground-102}h35l-7 10 7 10h-35Z" fill="#f1dfaa" stroke="#b9a16b"/>`+txt(x,ground-79,names[k]);
    }
   }
   b+=`<g${s.built?' clip-path="url(#coWaterSpace)"':''}><path d="M33 ${y}H567V349Q567 361 550 361H50Q33 361 33 349Z" fill="url(#water)" opacity=".58" data-coast-water="${s.level}"/>`;
   // Transparent water overlays submerged building portions; the level line stays horizontal.
   b+=`<path d="M33 ${y}H567" stroke="#4b9bb7" stroke-width="2"/></g>`;
   if(s.marked)b+='<path d="M34 325H151" stroke="#af713c" stroke-width="2" stroke-dasharray="5 4"/>'+txt(92,346,'처음 수면');
   if(s.running)b+='<path d="M65 70H108L102 105H72Z" fill="url(#glass)" stroke="#7398a9"/><path d="M92 106Q90 145 86 178" stroke="#70b5d0" stroke-width="5" stroke-dasharray="8 4"/>';
   scene(b,410);read(s.level.toFixed(1)+' 눈금',flooded.length+'곳');
   for(const[k,v]of Object.entries(s.places)){value('co'+k,v);$('co'+k).disabled=s.level>0;}
   $('coBuild').disabled=s.built;$('coMark').disabled=!s.built||s.marked;$('coPour').disabled=!s.built||!s.marked||s.running||s.target>=6;$('coDrain').disabled=s.level===0;
   window.scienceScene.render($('coPlaces'),Object.entries(s.places).map(([k,p])=>`<span>${names[k]} · ${places[p]} · ${!s.built?'배치 전':flooded.includes(k)?'물에 잠김':Math.abs(s.level-model.heights[p])<1e-6?'물이 바닥에 닿음':'마른 땅'}</span>`).join(''));
  };
  reset=()=>{s=model.create();say('깃발을 놓을 높이를 정하고 점토 마을을 만드세요.');render();};
  for(const k of Object.keys(names))on('co'+k,()=>{model.place(s,k,$('co'+k).value);say('선택한 장소의 깃발을 바꿨습니다. 건물의 종류와 놓인 땅의 높이를 구별하세요.');render();},'change');
  on('coBuild',()=>{s.built=true;say('세 높이의 점토 마을에 깃발을 놓았습니다. 물을 붓기 전에 처음 수면을 표시하세요.');render();});on('coMark',()=>{s.marked=true;say('처음 수면을 표시했습니다. 앞쪽 바다에 물을 조금씩 부으며 어느 곳부터 잠기는지 관찰하세요.');render();});
  on('coPour',()=>{s.target=Math.min(6,s.target+1);s.running=true;say('물을 조금 더 붓고 있습니다. 처음 표시와 지금 수면을 비교하세요.');render();});on('coDrain',()=>{s.level=0;s.target=0;s.running=false;say('물을 처음 높이로 되돌렸습니다. 깃발 위치를 바꾸어 다시 비교할 수 있습니다.');render();});
  advance=dt=>{if(s.running){model.advance(s,dt);if(!s.running){const wet=model.flooded(s);say(wet.length?wet.map(k=>names[k]).join('·')+'의 바닥에 물이 들어왔습니다. 같은 높이까지 물을 부었을 때 다른 배치도 비교해 보세요.':'아직 건물이나 밭의 바닥 위로 물이 들어오지 않았습니다. 다음 높이도 관찰하세요.');}render();}};
 }
 if(slug==='sea-level-causes'){
  model=M.seaLevel;
  render=()=>{
   window.scienceScene.render($('slScene'),s.tanks.map((t,i)=>{const label=['A · 가열 없음','B · 가열만','C · 가열 + 육상 얼음'][i],delta=(model.height(t)-7.5)*10;let b='';
    if(s.view==='zoom'){
     b+='<rect x="76" y="32" width="166" height="246" rx="8" fill="url(#glass)" stroke="#99b7c4"/>';
     if(s.prepared)b+=`<path d="M79 ${260-delta*20}H239V273H79Z" fill="url(#water)"/><path d="M79 ${260-delta*20}H239" stroke="#3a859b" stroke-width="2"/>`;
     for(let n=0;n<=10;n+=2)b+=`<path d="M61 ${260-n*20}H77" stroke="#7f9da9"/>`+txt(47,265-n*20,n);
     if(s.marked)b+='<path d="M77 260H242" stroke="#b5743c" stroke-dasharray="5 3" stroke-width="2"/>';
     b+=txt(156,306,'상승량 (mm)');
    }else{
     b='<ellipse cx="146" cy="298" rx="114" ry="8" fill="#7c9dad" opacity=".15"/><path d="M28 99V278Q28 291 42 291H240Q254 291 254 278V99" fill="url(#glass)" stroke="#84a6b5" stroke-width="3"/>';
     if(s.prepared){const waterY=280-model.height(t)*15;
      b+='<path d="M104 280L112 140H177L185 280" fill="#d8e3e7" opacity=".7" stroke="#89a6b1" stroke-width="2"/><path d="M112 140H177" stroke="#a8bec8" stroke-width="5"/>';
      b+=`<path d="M31 ${waterY}H251V276Q251 286 240 286H42Q31 286 31 276Z" fill="url(#water)"/><path d="M31 ${waterY}H251" stroke="#75aaba" stroke-width="2"/>`;
      if(i===2&&t.ice>.01){const a=Math.cbrt(t.ice/60);b+=`<g transform="translate(145 137) scale(${a})"><path d="M-24 0L-28 -30L-8 -46L24 -34L27 -4Z" fill="#dff4fa" stroke="#70a6bb" stroke-width="2"/><path d="M-28 -30L0 -20L24 -34M0 -20V-2" fill="none" stroke="#b0d3e0"/></g>`;if(s.running)b+=`<path d="M187 ${148+(s.time%4)*5}q8 10 0 14q-8-4 0-14" fill="#6faec4"/>`;}
      b+='<rect x="211" y="89" width="18" height="38" rx="4" fill="#294856"/><path d="M220 127V247" stroke="#577783" stroke-width="3"/><rect x="215" y="96" width="10" height="23" rx="2" fill="#bce3d4"/>';
      if(s.marked)b+='<path d="M32 167.5H249" stroke="#b5743c" stroke-width="2" stroke-dasharray="5 4"/>';
     }
     if(i){if(s.running)b+='<path d="M59 74L28 212M88 67L166 217M76 78L98 212" stroke="#d98645" opacity=".25" stroke-width="6"/>';b+='<path d="M16 38H71L99 63L48 88Z" fill="#c3d0d5" stroke="#708c99" stroke-width="2"/><path d="M48 88L99 63" stroke="'+(s.running?'#e29b51':'#8299a5')+'" stroke-width="7"/><path d="M17 40V23H254V285H274" fill="none" stroke="#697f8b" stroke-width="3"/>';}
    }
    return `<article class="cp-sample"><h3>${label}</h3><svg viewBox="0 0 280 330" data-fit role="img" aria-label="${label}, ${s.view==='zoom'?'수면 확대':'수조 장치'}">${scopedTank(defs+b,i)}</svg><div class="cp-tank-values"><span>온도 <strong>${s.prepared?fmt(t.temperature,1)+' °C':'—'}</strong></span><span>수면 상승 <strong>${s.marked?fmt(delta,2)+' mm':'—'}</strong></span>${i===2?`<span>남은 얼음 <strong>${s.prepared?fmt(t.ice,1)+' g':'—'}</strong></span>`:''}</div></article>`;
   }).join(''));font();read(Math.floor(s.time/60)+'분 '+String(Math.floor(s.time%60)).padStart(2,'0')+'초',s.marked?'20.0 °C':'—');
   $('slPrepare').disabled=s.prepared;$('slMark').disabled=!s.prepared||s.marked;$('slPlay').disabled=!s.marked||s.time>=600;$('slPlay').textContent=s.running?'일시 정지':s.time>0?'가열 이어 하기':'가열 시작';$('slMinute').disabled=!s.marked||s.time>=600;value('slView',s.view);
  };
  reset=()=>{s=model.create();say('세 수조에 같은 양의 물과 같은 받침을 준비하세요.');render();};
  const completed=()=>say('10분 관찰을 마쳤습니다. A·B의 차이와 B·C의 차이를 비교하세요. B와 C의 온도도 함께 확인하세요.');
  on('slPrepare',()=>{s.prepared=true;say('A는 가열하지 않습니다. B·C는 같은 가열 장치를 쓰고 C에만 물 위 받침에 얼음을 놓았습니다.');render();});
  on('slMark',()=>{s.marked=true;say('세 수조의 처음 수면과 20.0 °C를 표시했습니다. 같은 시간 동안 가열하며 변화를 비교하세요.');render();});
  on('slPlay',()=>{s.running=!s.running;say(s.running?'B·C를 가열하고 있습니다. 확대 보기로 처음 수면에서 얼마나 달라졌는지 읽으세요.':'현재 시각에서 멈췄습니다. 온도와 수면 상승량을 비교하세요.');render();});
  on('slMinute',()=>{const playing=s.running;s.running=true;model.advance(s,60);s.running=playing&&s.time<600;if(s.time>=600)completed();else say('세 수조를 같은 시각에서 비교하고 있습니다. 처음 수면과 현재 수면의 차이를 읽으세요.');render();});
  on('slView',()=>{s.view=$('slView').value;render();},'change');
  advance=dt=>{if(s.running){model.advance(s,dt*30);if(!s.running)completed();render();}};
 }
 if(!model)return;
 on('cpReset',()=>reset());reset();new ResizeObserver(font).observe(host);
 let last=performance.now();function frame(now){const dt=Math.min(.08,(now-last)/1000);last=now;if(!document.hidden)advance(dt);requestAnimationFrame(frame);}requestAnimationFrame(frame);
 window.__coursePractice={getState:()=>JSON.parse(JSON.stringify(s)),slug};
})();
