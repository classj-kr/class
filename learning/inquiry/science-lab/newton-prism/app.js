(() => {
 const $=id=>document.getElementById(id),{colors,result}=window.prismModel;let mode='dispersion',color=0,screen=45,light=false;
 const line=(x1,y1,x2,y2,c,width=3)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${width}"/>`;
 const marker=(x,y,n)=>`<circle cx="${x}" cy="${y}" r="15" fill="#eff8fa"/><text x="${x}" y="${y+7}" text-anchor="middle" fill="#183746" font-size="22">${n}</text>`;
 function render(){
  const r=result({mode,color,screen,light}),sx=mode==='combine'?470+(screen-30)*3:660;let beams='';
  if(light){beams=line(84,134,241,134,'#fffbdc',7);for(let i=0;i<7;i++){
   const c=colors[i][1],ey=157+i*5,sy=176+i*13;
   beams+=line(241,134,280,ey,c,2);
   if(mode==='dispersion')beams+=line(280,ey,660,218+i*13,c,4);
   if(mode==='single'){
    beams+=line(280,ey,406,sy,c,3);
    if(i===color)beams+=line(406,sy,473,sy+14,c,4)+line(473,sy+14,502,sy+24,c,4)+line(502,sy+24,660,sy+62,c,4);
   }
   if(mode==='combine'){
    beams+=line(280,ey,470,sy,c,3);
    const target=218,focusX=590,screenY=sy+(target-sy)*(sx-470)/(focusX-470);
    beams+=line(470,sy,sx,screenY,c,3);
   }
  }}
  const second=mode==='single'?`<path d="M440 ${142+color*13}L510 ${142+color*13}L485 ${222+color*13}Z" fill="#6ab2d122" stroke="#b3dcdf" stroke-width="2"/><path d="M406 155V${170+color*13} M406 ${182+color*13}V295" stroke="#e5edf0" stroke-width="8"/>`:mode==='combine'?'<path d="M470 156A70 70 0 0 1 470 296Z" fill="#6ab2d133" stroke="#b3dcdf" stroke-width="2"/>':'';
  $('opticsScene').innerHTML=`<svg viewBox="0 0 720 390" role="img" aria-label="手전등, 슬릿, 프리즘과 스크린의 빛 경로"><rect x="${sx-4}" y="150" width="12" height="188" rx="3" fill="#adc4d0"/><path d="M230 90L302 224L176 224Z" fill="#81cee933" stroke="#b3dcdf" stroke-width="2"/>${second}<path d="M141 93V124 M141 144V178" stroke="#aebdc9" stroke-width="9"/><path d="M30 112H68L88 123V146L68 157H30Z" fill="#708b9e"/>${beams}${r.white?line(sx-4,211,sx-4,225,'white',10):''}${marker(55,73,1)}${marker(141,58,2)}${marker(237,54,3)}${marker(sx,110,mode==='dispersion'?4:6)}${mode!=='dispersion'?marker(416,110,4)+marker(490,78,5):''}</svg>`;
  $('opticsScene').querySelector('svg').setAttribute('aria-label',light?mode==='single'?colors[color][0]+' 빛이 두 번째 프리즘을 통과하는 경로':mode==='combine'?'여러 색 빛을 반원 모양 유리로 모으는 경로':'백색광이 프리즘을 지나 색에 따라 갈라지는 경로':'손전등을 켜기 전 광학 장치');
  $('singleControls').hidden=mode!=='single';$('screenControls').hidden=mode!=='combine';$('screenValue').textContent=String(screen);
  $('legend').innerHTML=mode==='dispersion'?'<span><b>1</b> 손전등</span><span><b>2</b> 슬릿</span><span><b>3</b> 프리즘</span><span><b>4</b> 스크린</span>':'<span><b>1</b> 손전등</span><span><b>2</b> 슬릿</span><span><b>3</b> 첫 프리즘</span><span><b>4</b> '+(mode==='single'?'한 색을 통과시키는 슬릿':'분산된 빛')+'</span><span><b>5</b> '+(mode==='single'?'두 번째 프리즘':'반원 모양 유리')+'</span><span><b>6</b> 스크린</span>';
  $('lamp').textContent=light?'손전등 끄기':'손전등 켜기';$('lamp').setAttribute('aria-pressed',String(light));
  document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
  const band=$('screenSwatch');band.innerHTML='';if(light){const s=document.createElement('span');if(r.white)s.className='white';else if(mode==='single')s.style.background=colors[color][1];else s.style.background='linear-gradient('+colors.map(c=>c[1]).join(',')+')';band.append(s);}
  $('observation').textContent=!light?'손전등을 켜서 스크린을 관찰하세요.':mode==='dispersion'?'스크린에 여러 색의 띠가 나타납니다.':mode==='single'?colors[color][0]+' 빛은 두 번째 프리즘에서도 같은 색으로 나옵니다.':r.white?'여러 색의 빛이 같은 위치에 겹쳐 백색광으로 보입니다.':'빛이 아직 한곳에 겹치지 않습니다. 스크린을 앞뒤로 움직여 보세요.';
 }
 document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;render();});
 $('lamp').onclick=()=>{light=!light;render();};$('selectedColor').onchange=e=>{color=+e.target.value;render();};$('screenPosition').oninput=e=>{screen=+e.target.value;render();};
 $('resetExperiment').onclick=()=>{mode='dispersion';color=0;screen=45;light=false;$('selectedColor').value='0';$('screenPosition').value='45';render();};render();
})();
