(() => {
 const $=id=>document.getElementById(id),{colors,sources,collectors,result,ray,fixedRay,fixedFirstRay}=window.prismModel;let mode='dispersion',color=0,screen=45,light=false,source='incandescent',collector='glass';
 const line=(x1,y1,x2,y2,c,width=3)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${width}"/>`;
 const marker=(x,y,n)=>`<circle cx="${x}" cy="${y}" r="15" fill="#eff8fa"/><text x="${x}" y="${y+7}" text-anchor="middle" fill="#183746" font-size="22">${n}</text>`;
 function drawScene(markup){const previous=$('opticsScene').querySelector('svg');if(previous){const template=document.createElement('template');template.innerHTML=markup;const next=template.content.querySelector('svg');for(const attribute of ['viewBox','role','aria-label'])previous.setAttribute(attribute,next.getAttribute(attribute));previous.innerHTML=next.innerHTML;}else window.scienceScene.render($('opticsScene'),markup);}
 function fixedScene(){
  const p=fixedRay(color),first=fixedFirstRay(color),red=fixedRay(0),inputY=p.entry.y,c=colors[color][1];
  const slit=(x,label)=>`<g data-fixed-slit="${label}"><path d="M${x} 151V${label===1?215.5:inputY-1}M${x} ${label===1?223.5:inputY+1}V270" stroke="#aebdc9" stroke-width="8"/>${marker(x,120,label)}</g>`;
  const beams=!light?'':line(80,first.at(80),first.entry[0],first.entry[1],'#fffbdc',4)+line(first.entry[0],first.entry[1],first.exit[0],first.exit[1],c,2)+line(first.exit[0],first.exit[1],p.entry.x,inputY,c,3)+line(p.entry.x,p.entry.y,p.exit.x,p.exit.y,c,3)+line(p.exit.x,p.exit.y,660,p.screenY,c,3);
  return `<svg class="main-svg" viewBox="0 0 720 390" role="img" aria-label="두 슬릿과 두 번째 프리즘을 고정하고 같은 입사 경로에서 빨강과 파랑 비교"><path d="M28 238L63 222L84 232L92 250L80 270L44 286Z" fill="#708b9e"/>${slit(136,1)}<g data-first-prism transform="rotate(${first.degrees} 235 ${inputY})"><path d="M230 90L270 224L192 224Z" fill="#81cee933" stroke="#b3dcdf" stroke-width="2"/></g>${slit(340,2)}${slit(410,3)}<path data-fixed-prism d="M505 150L545 284L467 284Z" fill="#81cee933" stroke="#b3dcdf" stroke-width="2"/><rect x="656" y="156" width="12" height="174" rx="3" fill="#adc4d0"/>${beams}${marker(236,94,'P1')}${marker(516,110,'P2')}${marker(660,112,'S')}<path d="M${red.entry.x} ${red.entry.y}h-26" stroke="#99b2c0" stroke-dasharray="3 4"/><text x="375" y="307" text-anchor="middle" fill="#dce8ef" font-size="19">고정된 두 슬릿 → 같은 입사 경로</text><text x="230" y="348" text-anchor="middle" fill="#dce8ef" font-size="18">첫 프리즘만 조정</text><text x="557" y="348" text-anchor="middle" fill="#dce8ef" font-size="18">두 번째 프리즘·스크린 고정</text></svg>`;
 }
 function render(){
  const r=result({mode,color,screen,light,source,collector}),sx=mode==='combine'?470+(screen-30)*3:660;let beams='';
  if(light){beams=line(84,134,ray(0).entry.x,134,'#fffbdc',7);for(const i of sources[source].colors){
   const c=colors[i][1],p=ray(i),sy=p.at(470);
   beams+=line(p.entry.x,p.entry.y,p.exit.x,p.exit.y,c,1);
   if(mode==='dispersion')beams+=line(p.exit.x,p.exit.y,660,p.at(660),c,2);
   if(mode==='single'){
    beams+=line(p.exit.x,p.exit.y,406,p.at(406),c,2);
    if(i===color){const outX=470+p.exit.x-p.entry.x,outY=sy+p.exit.y-p.entry.y;beams+=line(406,p.at(406),470,sy,c,3)+line(470,sy,outX,outY,c,3)+line(outX,outY,660,outY,c,3);}
   }
   if(mode==='combine'){
    beams+=line(p.exit.x,p.exit.y,470,sy,c,2);
    const target=ray(3).at(470),focusX=470+(r.focus-30)*3,screenY=sy+(target-sy)*(sx-470)/(focusX-470);
    beams+=line(470,sy,sx,screenY,c,3);
   }
  }}
  const p=ray(color),tx=470+p.exit.x,ty=p.at(470)+p.exit.y,slitY=p.at(406),focusY=ray(3).at(470);
  const collectorShape={glass:`<path d="M470 ${focusY-50}A50 50 0 0 1 470 ${focusY+50}Z"/>`,lens:`<path d="M470 ${focusY-55}Q502 ${focusY} 470 ${focusY+55}Q438 ${focusY} 470 ${focusY-55}Z"/>`,cup:`<rect x="448" y="${focusY-53}" width="44" height="106" rx="17"/><ellipse cx="470" cy="${focusY-42}" rx="21" ry="8"/><path d="M449 ${focusY-30}Q470 ${focusY-22} 491 ${focusY-30}"/>`}[collector];
  const second=mode==='single'?`<polygon points="${[[230,90],[270,224],[192,224]].map(([x,y])=>[tx-x,ty-y].join(',')).join(' ')}" fill="#6ab2d122" stroke="#b3dcdf" stroke-width="2"/><path d="M406 155V${slitY-2} M406 ${slitY+2}V295" stroke="#e5edf0" stroke-width="5"/>`:mode==='combine'?`<g data-collector="${collector}" fill="#6ab2d133" stroke="#b3dcdf" stroke-width="2">${collectorShape}</g>`:'';
  drawScene(`<svg class="main-svg" viewBox="0 0 720 390" role="img" aria-label="손전등, 슬릿, 프리즘과 스크린의 빛 경로"><rect x="${sx-4}" y="150" width="12" height="188" rx="3" fill="#adc4d0"/><path d="M230 90L270 224L192 224Z" fill="#81cee933" stroke="#b3dcdf" stroke-width="2"/>${second}<path d="M141 93V124 M141 144V178" stroke="#aebdc9" stroke-width="9"/><path d="M30 112H68L88 123V146L68 157H30Z" fill="#708b9e"/>${beams}${r.white?line(sx-4,focusY-6,sx-4,focusY+6,'white',8):''}${marker(55,73,1)}${marker(141,58,2)}${marker(237,54,3)}${marker(sx,110,mode==='dispersion'?4:6)}${mode!=='dispersion'?marker(416,110,4)+marker(490,78,5):''}</svg>`);
  $('opticsScene').querySelector('svg').setAttribute('aria-label',light?mode==='single'?colors[color][0]+' 빛이 두 번째 프리즘을 통과하는 경로':mode==='combine'?'여러 색 빛을 '+collectors[collector].label+'로 모으는 경로':sources[source].label+'의 백색광이 프리즘을 지나 색에 따라 갈라지는 경로':'손전등을 켜기 전 광학 장치');
  if(mode==='fixed')drawScene(fixedScene());
  $('singleControls').hidden=!['single','fixed'].includes(mode);$('screenControls').hidden=mode!=='combine';$('screenValue').textContent=String(screen);
  $('selectedColor').querySelectorAll('option').forEach(o=>o.disabled=!sources[source].colors.includes(+o.value)||(mode==='fixed'&&![0,4].includes(+o.value)));
  $('legend').innerHTML='<span><b>1</b> '+sources[source].label+'</span><span><b>2</b> 슬릿</span><span><b>3</b> '+(mode==='dispersion'?'프리즘':'첫 프리즘')+'</span>'+(mode==='dispersion'?'<span><b>4</b> 스크린</span>':'<span><b>4</b> '+(mode==='single'?'한 색을 통과시키는 슬릿':'분산된 빛')+'</span><span><b>5</b> '+(mode==='single'?'두 번째 프리즘':collectors[collector].label)+'</span><span><b>6</b> 스크린</span>');
  if(mode==='fixed')$('legend').innerHTML='<span><b>1·2·3</b> 고정된 슬릿</span><span><b>P1</b> 색을 바꾸는 첫 프리즘</span><span><b>P2</b> 고정된 두 번째 프리즘</span><span><b>S</b> 스크린</span>';
  $('lamp').textContent=light?'손전등 끄기':'손전등 켜기';$('lamp').setAttribute('aria-pressed',String(light));
  document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
  const band=$('screenSwatch');band.innerHTML='';if(light){
   const s=document.createElement('span');
   if(r.white){s.className='white';s.style.inset='26px 4px';}
   else if(mode==='single'){s.style.background=colors[color][1];s.style.inset='26px 4px';}
   else if(mode==='fixed'){const red=fixedRay(0).screenY,blue=fixedRay(4).screenY;s.style.background=colors[color][1];s.style.inset='auto 4px';s.style.height='5px';s.style.top=(22+27*(r.fixed.screenY-red)/(blue-red))+'px';band.dataset.screenY=String(r.fixed.screenY);}
   else{
    // Magnify the separation while keeping a continuous incandescent band and distinct LED bands.
    s.style.background=source==='rgb'?`linear-gradient(${colors[0][1]} 0% 18%,transparent 18% 39%,${colors[3][1]} 39% 57%,transparent 57% 78%,${colors[4][1]} 78% 100%)`:'linear-gradient('+colors.map(c=>c[1]).join(',')+')';
    if(mode==='combine'){const height=6+48*Math.min(1,r.spread/25);s.style.inset='auto 4px';s.style.height=height+'px';s.style.top='50%';s.style.transform='translateY(-50%)';if(screen>r.focus)s.style.transform+=' scaleY(-1)';}
   }
   band.append(s);
  }
  $('observation').textContent=!light?'손전등을 켜서 스크린을 관찰하세요.':mode==='dispersion'?source==='rgb'?'빨강·초록·파랑 세 색의 띠가 떨어져 나타납니다.':'스크린에 여러 색이 연속적으로 이어진 띠가 나타납니다.':mode==='single'?colors[color][0]+' 빛은 두 번째 프리즘에서도 같은 색으로 나옵니다.':r.white?'여러 색의 빛이 같은 위치에 겹쳐 백색광으로 보입니다.':'빛이 아직 한곳에 겹치지 않습니다. 스크린을 앞뒤로 움직여 보세요.';
  if(mode==='fixed')$('observation').textContent=light?colors[color][0]+' 빛이 같은 경로로 두 번째 프리즘에 들어갑니다. 파란빛은 빨간빛보다 더 크게 꺾여 다른 위치에 도달하지만, 색 자체는 그대로입니다.':'슬릿 세 개와 두 번째 프리즘을 고정했습니다. 손전등을 켜고 첫 프리즘으로 고르는 색을 빨강·파랑으로 바꾸어 비교하세요.';
  $('opticsNote').textContent=mode==='fixed'?'두 프리즘의 경계에서 색별 굴절률을 적용한 빛길 모형입니다. 첫 프리즘을 조정하면 같은 방향의 백색광에서 선택한 색이 고정된 두 슬릿을 지납니다. 모형 치수·굴절률은 실물 장치의 측정값이 아닙니다. 오른쪽은 같은 스크린의 위치 차이를 확대한 모습입니다.':'빛길과 대표 색을 나타낸 모식도입니다. 빛을 모으는 과정은 이상적으로 나타냈으며, 스크린 눈금은 실제 거리나 초점 거리 측정값이 아닙니다. 한 색 재통과에서는 선택한 빛에 맞추어 두 번째 프리즘의 위치도 바뀝니다.';
 }
 document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;if(mode==='fixed'&&![0,4].includes(color)){color=0;$('selectedColor').value='0';}render();});
 $('lamp').onclick=()=>{light=!light;render();};$('selectedColor').onchange=e=>{color=+e.target.value;render();};$('screenPosition').oninput=e=>{screen=+e.target.value;render();};
 $('lightSource').onchange=e=>{source=e.target.value;if(!sources[source].colors.includes(color)){color=0;$('selectedColor').value='0';}render();};
 $('collector').onchange=e=>{collector=e.target.value;render();};
 $('resetExperiment').onclick=()=>{mode='dispersion';color=0;screen=45;light=false;source='incandescent';collector='glass';$('selectedColor').value='0';$('screenPosition').value='45';$('lightSource').value=source;$('collector').value=collector;render();};render();
})();
