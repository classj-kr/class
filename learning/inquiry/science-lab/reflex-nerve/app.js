document.addEventListener('DOMContentLoaded',()=>{
 'use strict';
 const M=window.ReflexModel,$=id=>document.getElementById(id),svg=$('rfScene');
 let selected='knee',block='none',progress=-1,running=false,frame=0,last=0,rendered='',lastStep=-2;
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const snap=()=>({...M.analyse(selected,progress,block),running});
 function stop(){running=false;cancelAnimationFrame(frame);$('rfPause').textContent='계속 관찰';$('rfPause').disabled=progress<0||snap().complete;}
 function scene(){
  const eye=selected==='pupil';
  svg.setAttribute('viewBox','0 0 540 430');svg.setAttribute('aria-label',eye?'밝은 빛에서 홍채가 동공을 좁히는 모습':'의자에 앉은 사람의 뇌, 척수와 근육 반응');
  svg.innerHTML=`<defs><linearGradient id="rfSkin" x2="1" y2="1"><stop stop-color="#f8dfcd"/><stop offset="1" stop-color="#e6b89b"/></linearGradient><linearGradient id="rfShirt" x2="1" y2="1"><stop stop-color="#e1edf2"/><stop offset="1" stop-color="#afcbd7"/></linearGradient><radialGradient id="rfIris"><stop stop-color="#acc7b7"/><stop offset=".65" stop-color="#729587"/><stop offset="1" stop-color="#365a51"/></radialGradient></defs>`+(eye?`
   <path id="rfLight" d="M40,190 L195,125 L195,255 Z" fill="#edbb4d" opacity=".12"/>
   <path d="M75,190 Q205,60 370,190 Q205,320 75,190Z" fill="#fff" stroke="#617b87" stroke-width="3"/>
   <circle cx="222" cy="190" r="69" fill="url(#rfIris)" stroke="#365a51" stroke-width="2"/>
   <g opacity=".28" stroke="#dbe9de">${Array.from({length:28},(_,i)=>{const a=i*Math.PI/14;return`<path d="M${222+Math.cos(a)*40},${190+Math.sin(a)*40} L${222+Math.cos(a)*66},${190+Math.sin(a)*66}"/>`;}).join('')}</g>
   <circle id="rfPupil" cx="222" cy="190" r="43" fill="#172b37"/><ellipse cx="203" cy="166" rx="9" ry="7" fill="#fff" opacity=".8"/>
   <rect x="20" y="164" width="39" height="52" rx="9" fill="#526d7a"/><path d="M22,176 H54 M22,204 H54" stroke="#d5e1e7" stroke-width="4"/>
   <g transform="translate(350 296)"><path class="rf-brain" d="M0,6 C-28,-5 -26,-30 -9,-36 C-6,-57 21,-61 35,-49 C57,-57 76,-38 69,-22 C83,-6 70,14 53,9 C43,25 17,22 12,10Z"/><path d="M3,-22 Q19,-36 25,-19 T52,-22 M15,-39 Q28,-34 34,-45 M18,2 Q24,-13 44,-3" class="rf-brain-fold"/><ellipse id="rfCentre" cx="45" cy="12" rx="10" ry="7" fill="#a37680"/></g>
   <path class="rf-signal-track" id="rfIn" d="M285,235 C332,250 345,266 395,308"/>
   <path class="rf-signal-track rf-output" id="rfOut" d="M395,308 C329,328 248,314 235,247"/>
   <circle id="rfPulse" r="6" fill="#216e8b" hidden/>
  `:`
   <ellipse cx="273" cy="403" rx="177" ry="12" fill="#dae5e9"/>
   <path d="M137,197 V272 H276 M149,273 V391 M261,274 L272,391" fill="none" stroke="#6d8791" stroke-width="12" stroke-linecap="round"/>
   <path d="M175,109 C154,126 157,164 151,192 L146,245 Q192,266 222,248 L210,158 Q207,119 190,108Z" fill="url(#rfShirt)" stroke="#708f9c" stroke-width="2"/>
   <path d="M171,103 L173,123 Q186,137 194,118 L190,99" fill="url(#rfSkin)" stroke="#ad8773" stroke-width="1.5"/>
   <path d="M150,61 C148,23 209,15 219,57 L224,77 L239,87 L225,94 L225,105 Q206,126 174,104 Q153,95 150,61Z" fill="url(#rfSkin)" stroke="#ad8773" stroke-width="2"/>
   <path d="M153,65 Q147,29 181,25 Q213,20 220,57 L208,54 Q202,37 178,43 L164,71Z" fill="#52646d"/>
   <circle cx="219" cy="76" r="3" fill="#293d49"/><path d="M211,71 L225,71" stroke="#4d5960" stroke-width="2"/>
   <path d="M155,240 Q179,263 211,267 L305,284 Q333,276 323,252 L217,229Z" fill="#6d859b" stroke="#485e72" stroke-width="2"/>
   <g id="rfLowerLeg"><path d="M300,267 Q326,261 330,283 L327,372 Q342,379 362,377 Q372,382 365,393 L310,393 Q298,390 303,373 L289,296Z" fill="url(#rfSkin)" stroke="#ad8773" stroke-width="2"/><path d="M305,371 L327,369 Q336,380 361,377 L366,391 Q339,400 306,391Z" fill="#f9fcfe" stroke="#667e8c" stroke-width="2"/></g>
   <path d="M190,136 Q199,130 210,145 L239,195 L222,207 L184,157Z" fill="url(#rfShirt)" stroke="#708f9c" stroke-width="2"/>
   <g id="rfForearm"><path d="M231,197 L278,221 Q294,215 300,228 Q301,239 286,242 L223,215Z" fill="url(#rfSkin)" stroke="#ad8773" stroke-width="2"/></g>
   ${selected==='conscious'?'<path id="rfMuscle" d="M196,149 Q216,153 228,192 Q209,189 196,149Z" fill="#c97578" stroke="#923f50" stroke-width="2"/>':'<path id="rfMuscle" d="M209,244 Q264,230 303,259 Q267,277 211,258Z" fill="#c97578" stroke="#923f50" stroke-width="2"/>'}
   <path d="M309,258 Q317,267 309,288" fill="none" stroke="#ede8d3" stroke-width="7"/>
   <g id="rfHammer"><path d="M387,300 L342,287" stroke="#917359" stroke-width="9" stroke-linecap="round"/><path d="M334,273 L348,275 L345,299 L331,296Z" fill="#475f6b"/></g>
   <g transform="translate(166 58)"><path class="rf-brain" d="M0,0 C-9,-18 15,-30 25,-17 C43,-17 47,5 32,12 C20,22 0,16 0,0Z"/><path class="rf-brain-fold" d="M2,-5 Q13,-17 20,-3 T33,-2 M9,8 Q15,0 23,7"/></g>
   <path d="M182,77 Q164,103 173,148 L167,229" fill="none" stroke="#b09eb6" stroke-width="12" stroke-linecap="round"/>
   <path id="rfIn" class="rf-signal-track" d="${selected==='conscious'?'M218,76 Q199,72 188,63':`M264,247 C238,220 191,219 163,225 ${selected==='leg'?'L159,145 Q155,92 184,62':''}`}"/>
   <path id="rfOut" class="rf-signal-track rf-output" d="${selected==='conscious'?'M188,63 Q173,105 179,145 Q210,158 228,198':selected==='leg'?'M188,63 Q174,97 179,145 L177,230 Q211,252 264,253':'M168,229 Q211,252 264,253'}"/>
   <circle id="rfCentre" cx="${selected==='knee'?167:188}" cy="${selected==='knee'?227:63}" r="9" fill="#967499"/>
   <circle id="rfPulse" r="6" fill="#216e8b" hidden/>
   ${selected==='conscious'?'<rect x="388" y="66" width="69" height="59" rx="12" fill="#526c79"/><circle id="rfLamp" cx="422" cy="96" r="18" fill="#a1b8ae"/>':'<path d="M211,72 L230,77" stroke="#506879" stroke-width="11"/>'}
  `);
  if(selected==='conscious')$('rfIn').setAttribute('d','M218,76 Q199,72 188,63');
 }
 function render(){
  const a=snap(),d=a.path,key=selected+':'+block;
  if(rendered!==key){rendered=key;scene();$('rfStimulus').textContent=d.stimulus;$('stageBadge').textContent=d.label;$('rfBlock').value=block;
   $('routeList').innerHTML=d.route.map((v,i)=>`<li data-route-step="${i}"><span class="rf-step-number">${i+1}</span><span>${v}</span></li>`).join('');
   for(const b of document.querySelectorAll('[data-path]'))b.setAttribute('aria-pressed',String(b.dataset.path===selected));
   $('rfSceneKey').textContent=selected==='pupil'?'눈의 앞면 · 홍채와 동공 / 아래쪽: 중간뇌':selected==='conscious'?'머리: 대뇌 · 등: 척수 · 팔의 근육':'머리: 대뇌 · 등: 척수 · 허벅지 앞쪽 근육';
  }
  for(const row of $('routeList').children){const i=+row.dataset.routeStep;row.classList.toggle('rf-past',a.step>=i);row.classList.toggle('rf-blocked',a.blocked&&a.step===i);if(a.step===i)row.setAttribute('aria-current','step');else row.removeAttribute('aria-current');}
  const caption=a.step<0?'자극을 주고 신호가 전달되는 방향을 관찰하세요.':a.blocked?(block==='sensory'?'감각 신호가 중추에 도달하지 못해 반응이 나타나지 않습니다.':'중추까지 신호가 도달했지만, 근육으로 가는 운동 신호가 막혔습니다.'):d.detail[a.step];
  if(lastStep!==a.step||$('stageCaption').textContent!==caption){$('stageCaption').textContent=caption;lastStep=a.step;}
  $('rfObservation').textContent=a.complete?(a.blocked?'이 경로로 근육 반응이 나타나지 않습니다.':d.result):'자극 전과 반응 뒤의 모습을 비교하세요.';
  $('rfCentreValue').textContent=a.centreReached?d.centre:'아직 도달하지 않음';$('rfMotorValue').textContent=a.motorReached?'반응 기관에 도달':a.blocked?'반응 기관에 미도달':'전달 전';
  $('rfProgress').value=String(Math.max(0,a.progress)*20);$('nextBtn').disabled=a.complete;$('rfPause').disabled=a.progress<0||a.complete;$('rfPause').textContent=running?'일시 정지':'계속 관찰';
  const t=reduced()?(a.response>0?1:0):a.response;
  if($('rfLowerLeg')){$('rfLowerLeg').setAttribute('transform',`rotate(${-44*t} 308 273)`);$('rfForearm').setAttribute('transform',`rotate(${selected==='conscious'?-93*t:0} 231 204)`);if(selected==='conscious')$('rfLowerLeg').removeAttribute('transform');$('rfMuscle').setAttribute('transform',selected==='conscious'?'':`translate(${t*23} ${t*-12}) scale(${1-t*.085} ${1+t*.05})`);$('rfHammer').setAttribute('transform',`translate(${a.progress>=0?-15:15} ${selected==='leg'?-33:0})`);$('rfHammer').style.display=selected==='conscious'||a.progress>1?'none':'';if($('rfLamp'))$('rfLamp').setAttribute('fill',a.progress>=0?'#eac566':'#a1b8ae');}
  if($('rfPupil')){$('rfPupil').setAttribute('r',String(43-24*t));$('rfLight').setAttribute('opacity',a.progress>=0?'.48':'.12');}
  $('rfCentre').setAttribute('fill',a.centreReached?'#845393':'#ae9fb3');
  const pulse=$('rfPulse'),travel=a.step===1?'rfIn':a.step===3?'rfOut':null;
  pulse.style.display=travel?'':'none';pulse.removeAttribute('hidden');
  for(const [id,stage]of [['rfIn',1],['rfOut',3]]){const p=$(id);p.style.opacity=a.progress>=stage?'1':'.3';p.setAttribute('stroke-dasharray',block===(stage===1?'sensory':'motor')?'7 7':'none');}
  if(travel){const path=$(travel),f=Math.max(0,Math.min(1,a.progress-a.step)),p=path.getPointAtLength(path.getTotalLength()*(reduced()?Math.ceil(f):f));pulse.setAttribute('cx',p.x);pulse.setAttribute('cy',p.y);pulse.setAttribute('fill',a.blocked?'#b33d36':a.step===1?'#216e8b':'#a84c2b');}
  return a;
 }
 function setProgress(p){stop();progress=M.analyse(selected,p,block).progress;return render();}
 function tick(t){if(!running)return;const dt=last?Math.min(80,t-last):0;last=t;progress=Math.min(snap().limit,Math.max(0,progress)+dt/1050);if(snap().complete)stop();render();if(running)frame=requestAnimationFrame(tick);}
 function play(){if(snap().complete||progress<0)progress=0;running=true;last=0;render();frame=requestAnimationFrame(tick);}
 function choose(mode){stop();selected=mode;progress=-1;render();}
 document.querySelectorAll('[data-path]').forEach(b=>b.onclick=()=>choose(b.dataset.path));$('rfBlock').onchange=e=>{stop();block=e.target.value;progress=-1;render();};
 $('checkBtn').onclick=()=>{stop();progress=0;play();};$('rfPause').onclick=()=>running?(stop(),render()):play();$('nextBtn').onclick=()=>setProgress(progress<0?0:Math.min(snap().limit,Math.floor(progress)+1));$('resetBtn').onclick=()=>setProgress(-1);$('rfProgress').oninput=e=>setProgress(+e.target.value/20);document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();render();}});
 window.__reflexModel={...M,state:snap,setMode:choose,setBlock(v){$('rfBlock').value=v;$('rfBlock').dispatchEvent(new Event('change'));},setProgress,runToEnd:()=>setProgress(5)};
 render();
});
