(() => {
 const $=id=>document.getElementById(id),{colors,sources,collectors,result,ray,fixedRay,fixedFirstRay}=window.prismModel;let mode='dispersion',color=0,screen=45,light=false,source='incandescent',collector='glass';
 const reduced=!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 const f=v=>(+v).toFixed(1),line=(x1,y1,x2,y2,c,width=3,extra='')=>`<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${c}" stroke-width="${width}" stroke-linecap="round" ${extra}/>`;
 const label=(x,y,s,anchor='middle')=>`<text x="${f(x)}" y="${f(y)}" text-anchor="${anchor}" fill="#24434f" font-size="15">${s}</text>`;
 // The fan after the prism is drawn wider than the model's angles so the colours can be told apart.
 const SPREAD=4,base=ray(3);
 function vis(i){const p=ray(i),angle=base.angle+(p.angle-base.angle)*SPREAD;return{...p,angle,at:x=>p.exit.y+Math.tan(angle)*(x-p.exit.x)};}
 // Light travels from the flashlight to the right; `reach` is how far it has got.
 let reach=1,beamFrame=0,beamStart=0;const BEAM_SECONDS=1.4;
 function shine(){if(reduced){reach=1;return;}reach=0;beamStart=performance.now();if(!beamFrame)beamFrame=requestAnimationFrame(step);}
 function step(now){beamFrame=0;reach=Math.min(1,(now-beamStart)/(BEAM_SECONDS*1000));render();if(reach<1)beamFrame=requestAnimationFrame(step);}
 const reachX=()=>60+reach*660;
 function flashlight(x,y,deg=0){
  return `<g transform="rotate(${f(deg)} ${f(x)} ${f(y)})"><rect x="${f(x-74)}" y="${f(y-12)}" width="52" height="24" rx="6" fill="#4d7c99" stroke="#2f5468" stroke-width="1.5"/>${[0,1,2].map(i=>`<line x1="${f(x-66+i*7)}" y1="${f(y-12)}" x2="${f(x-66+i*7)}" y2="${f(y+12)}" stroke="#3b6680" stroke-width="2"/>`).join('')}<rect x="${f(x-44)}" y="${f(y-16)}" width="10" height="5" rx="2" fill="#d6a23a"/><path d="M${f(x-24)} ${f(y-13)}L${f(x-2)} ${f(y-21)}L${f(x-2)} ${f(y+21)}L${f(x-24)} ${f(y+13)}Z" fill="#6f9bb6" stroke="#2f5468" stroke-width="1.5"/><ellipse cx="${f(x)}" cy="${f(y)}" rx="4" ry="21" fill="${light?'#fff4c2':'#e7eef1'}" stroke="#2f5468" stroke-width="1.5"/><line x1="${f(x-70)}" y1="${f(y-7)}" x2="${f(x-28)}" y2="${f(y-7)}" stroke="#8fb5cc" stroke-width="2"/></g>`;}
 const glass='fill="#cfeaf3" fill-opacity=".72" stroke="#5f9fb5" stroke-width="2" stroke-linejoin="round"';
 const slitCard=(x,top,bottom,open,gap=2.5)=>`<path d="M${x} ${top}V${f(open-gap)}M${x} ${f(open+gap)}V${bottom}" stroke="#56666e" stroke-width="7"/><path d="M${x-12} ${bottom+4}H${x+12}" stroke="#8a9aa2" stroke-width="5" stroke-linecap="round"/>`;
 const screenBoard=x=>`<rect x="${f(x-3)}" y="150" width="9" height="188" rx="2" fill="#fbfcfc" stroke="#8ea4ae" stroke-width="1.5"/><path d="M${f(x-14)} 342H${f(x+16)}" stroke="#8a9aa2" stroke-width="5" stroke-linecap="round"/>`;
 const whiteBeam=(x1,y1,x2,y2)=>line(x1,y1,x2,y2,'#f2cf5b',9,'stroke-opacity=".75"')+line(x1,y1,x2,y2,'#fffbe6',3.5);
 function drawScene(markup){const previous=$('opticsScene').querySelector('svg');if(previous){const template=document.createElement('template');template.innerHTML=markup;const next=template.content.querySelector('svg');for(const attribute of ['viewBox','role','aria-label'])previous.setAttribute(attribute,next.getAttribute(attribute));previous.innerHTML=next.innerHTML;}else window.scienceScene.render($('opticsScene'),markup);}
 const clip=()=>`<defs><clipPath id="beamReach"><rect x="0" y="0" width="${f(reachX())}" height="400"/></clipPath></defs>`;
 function fixedScene(){
  const p=fixedRay(color),first=fixedFirstRay(color),red=fixedRay(0),inputY=p.entry.y,c=colors[color][1];
  const slit=(x,n)=>`<g data-fixed-slit="${n}"><path d="M${x} 151V${n===1?215.5:inputY-1}M${x} ${n===1?223.5:inputY+1}V270" stroke="#56666e" stroke-width="7"/><path d="M${x-12} 274H${x+12}" stroke="#8a9aa2" stroke-width="5" stroke-linecap="round"/></g>`;
  const deg=Math.atan2(-first.incoming[1],-first.incoming[0])*180/Math.PI;
  const beams=!light?'':`<g clip-path="url(#beamReach)">${whiteBeam(80,first.at(80),first.entry[0],first.entry[1])}${line(first.entry[0],first.entry[1],first.exit[0],first.exit[1],c,2)}${line(first.exit[0],first.exit[1],p.entry.x,inputY,c,3.5)}${line(p.entry.x,p.entry.y,p.exit.x,p.exit.y,c,3)}${line(p.exit.x,p.exit.y,660,p.screenY,c,3.5)}<circle cx="657" cy="${f(p.screenY)}" r="4" fill="${c}"/></g>`;
  return `<svg class="main-svg" data-mobile-fit viewBox="0 60 720 290" role="img" aria-label="두 슬릿과 두 번째 프리즘을 고정하고 같은 입사 경로에서 빨강과 파랑 비교">${clip()}${flashlight(80,first.at(80),deg)}${slit(136,1)}<g data-first-prism transform="rotate(${first.degrees} 235 ${inputY})"><path d="M230 90L270 224L192 224Z" ${glass}/></g>${slit(340,2)}${slit(410,3)}<path data-fixed-prism d="M505 150L545 284L467 284Z" ${glass}/>${screenBoard(660)}${beams}<path d="M${red.entry.x} ${red.entry.y}h-26" stroke="#8aa4b2" stroke-dasharray="3 4"/>${label(285,262,'첫 프리즘')}${label(340,140,'슬릿')}${label(410,140,'슬릿')}${label(136,140,'슬릿')}${label(506,140,'두 번째 프리즘')}${label(660,140,'스크린')}</svg>`;
 }
 function render(){
  const r=result({mode,color,screen,light,source,collector}),sx=mode==='combine'?470+(screen-30)*3:660,on=sources[source].colors;let beams='';
  const focusY=vis(3).at(470),targetY=focusY;
  if(light){
   beams=whiteBeam(88,134,ray(0).entry.x,134);
   if(mode==='dispersion'&&source==='incandescent'){
    // A continuous fan: each colour fills the wedge between its neighbours.
    const ys=on.map(i=>vis(i).at(sx-3));
    on.forEach((i,k)=>{const p=vis(i),lo=k?(ys[k-1]+ys[k])/2:ys[k]-(ys[k+1]-ys[k])/2,hi=k<on.length-1?(ys[k]+ys[k+1])/2:ys[k]+(ys[k]-ys[k-1])/2;
     beams+=line(p.entry.x,p.entry.y,p.exit.x,p.exit.y,colors[i][1],1.2)+`<path d="M${f(p.exit.x)} ${f(p.exit.y)}L${f(sx-3)} ${f(lo)}L${f(sx-3)} ${f(hi)}Z" fill="${colors[i][1]}" fill-opacity=".85"/>`;});
    beams+=`<rect x="${f(sx-3)}" y="${f(ys[0]-(ys[1]-ys[0])/2)}" width="4" height="${f(ys.at(-1)-ys[0]+(ys[1]-ys[0]))}" fill="url(#spectrumBand)"/>`;
   }else for(const i of on){
    const c=colors[i][1],p=vis(i),sy=p.at(470);
    beams+=line(p.entry.x,p.entry.y,p.exit.x,p.exit.y,c,1.2);
    if(mode==='dispersion')beams+=line(p.exit.x,p.exit.y,660,p.at(660),c,3.5)+`<circle cx="657" cy="${f(p.at(660))}" r="3.5" fill="${c}"/>`;
    if(mode==='single'){
     beams+=line(p.exit.x,p.exit.y,406,p.at(406),c,2.5);
     if(i===color){const outX=470+p.exit.x-p.entry.x,outY=sy+p.exit.y-p.entry.y;beams+=line(406,p.at(406),470,sy,c,3.5)+line(470,sy,outX,outY,c,3.5)+line(outX,outY,660,outY,c,3.5)+`<circle cx="657" cy="${f(outY)}" r="4" fill="${c}"/>`;}
    }
    if(mode==='combine'){
     beams+=line(p.exit.x,p.exit.y,470,sy,c,2.5);
     const focusX=470+(r.focus-30)*3,screenY=sy+(targetY-sy)*(sx-470)/(focusX-470);
     beams+=line(470,sy,sx,screenY,c,3);
    }
   }
   beams=`<g clip-path="url(#beamReach)">${beams}${r.white?`<rect x="${f(sx-3)}" y="${f(focusY-5)}" width="5" height="10" fill="#ffffff" stroke="#c9b45c" stroke-width="1"/>`:''}</g>`;
  }
  const p=vis(color),tx=470+p.exit.x,ty=p.at(470)+p.exit.y,slitY=p.at(406);
  const collectorShape={glass:`<path d="M470 ${f(focusY-50)}A50 50 0 0 1 470 ${f(focusY+50)}Z"/>`,lens:`<path d="M470 ${f(focusY-55)}Q502 ${f(focusY)} 470 ${f(focusY+55)}Q438 ${f(focusY)} 470 ${f(focusY-55)}Z"/>`,cup:`<rect x="448" y="${f(focusY-53)}" width="44" height="106" rx="17"/><ellipse cx="470" cy="${f(focusY-42)}" rx="21" ry="8"/><path d="M449 ${f(focusY-30)}Q470 ${f(focusY-22)} 491 ${f(focusY-30)}"/>`}[collector];
  const secondPts=[[230,90],[270,224],[192,224]].map(([x,y])=>[tx-x,ty-y]);
  const second=mode==='single'?`<polygon points="${secondPts.map(q=>q.map(f).join(',')).join(' ')}" ${glass}/>`+slitCard(406,150,296,slitY)+label(406,140,'슬릿')+label(tx-231,Math.min(...secondPts.map(q=>q[1]))-10,'두 번째 프리즘'):mode==='combine'?`<g data-collector="${collector}" ${glass}>${collectorShape}</g>`+label(470,focusY-66,collectors[collector].label):'';
  const spectrumDef=`<linearGradient id="spectrumBand" x1="0" y1="0" x2="0" y2="1">${colors.map((c,i)=>`<stop offset="${i/6}" stop-color="${c[1]}"/>`).join('')}</linearGradient>`;
  drawScene(`<svg class="main-svg" data-mobile-fit viewBox="0 40 720 310" role="img" aria-label="손전등, 슬릿, 프리즘과 스크린의 빛 경로">${clip().replace('</defs>',spectrumDef+'</defs>')}${screenBoard(sx)}<path d="M230 90L270 224L192 224Z" ${glass}/><path d="M226 104L210 210" stroke="#ffffff" stroke-width="2" stroke-opacity=".7"/>${second}${slitCard(141,96,180,134,5)}${flashlight(88,134)}${beams}${label(48,100,source==='rgb'?'LED 광원':'손전등')}${label(141,86,'슬릿')}${label(231,80,mode==='dispersion'?'프리즘':'첫 프리즘')}${label(sx,140,'스크린')}</svg>`);
  $('opticsScene').querySelector('svg').setAttribute('aria-label',light?mode==='single'?colors[color][0]+' 빛이 두 번째 프리즘을 통과하는 경로':mode==='combine'?'여러 색 빛을 '+collectors[collector].label+'로 모으는 경로':sources[source].label+'의 백색광이 프리즘을 지나 색에 따라 갈라지는 경로':'손전등을 켜기 전 광학 장치');
  if(mode==='fixed')drawScene(fixedScene());
  $('singleControls').hidden=!['single','fixed'].includes(mode);$('screenControls').hidden=mode!=='combine';$('screenValue').textContent=String(screen);
  $('selectedColor').querySelectorAll('option').forEach(o=>o.disabled=!sources[source].colors.includes(+o.value)||(mode==='fixed'&&![0,4].includes(+o.value)));
  $('legend').textContent=mode==='fixed'?'두 슬릿과 두 번째 프리즘·스크린은 고정하고, 첫 프리즘만 돌려 같은 입사 경로로 고른 색을 보냅니다.':'';$('legend').hidden=mode!=='fixed';
  $('lamp').textContent=light?'손전등 끄기':'손전등 켜기';$('lamp').setAttribute('aria-pressed',String(light));
  document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
  const band=$('screenSwatch');band.innerHTML='';delete band.dataset.screenY;if(light){
   const s=document.createElement('span');s.style.opacity=reach>=1?'1':'0';s.style.transition='opacity .3s';
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
  $('opticsNote').textContent=mode==='fixed'?'두 프리즘의 경계에서 색별 굴절률을 적용한 빛길 모형입니다. 모형 치수·굴절률은 실물 장치의 측정값이 아닙니다.':'빛길과 대표 색을 나타낸 모식도입니다. 색이 갈라지는 각도는 알아보기 쉽게 넓혀 그렸고, 스크린 눈금은 실제 거리나 초점 거리가 아닙니다.';
 }
 const relight=()=>{if(light)shine();render();};
 document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;if(mode==='fixed'&&![0,4].includes(color)){color=0;$('selectedColor').value='0';}relight();});
 $('lamp').onclick=()=>{light=!light;relight();};$('selectedColor').onchange=e=>{color=+e.target.value;relight();};$('screenPosition').oninput=e=>{screen=+e.target.value;render();};
 $('lightSource').onchange=e=>{source=e.target.value;if(!sources[source].colors.includes(color)){color=0;$('selectedColor').value='0';}relight();};
 $('collector').onchange=e=>{collector=e.target.value;relight();};
 $('resetExperiment').onclick=()=>{mode='dispersion';color=0;screen=45;light=false;source='incandescent';collector='glass';$('selectedColor').value='0';$('screenPosition').value='45';$('lightSource').value=source;$('collector').value=collector;render();};render();
})();
