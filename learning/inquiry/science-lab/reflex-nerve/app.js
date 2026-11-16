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
   <clipPath id="rfHeadClip"><path d="M151,64 C147,26 205,14 220,52 Q223,63 226,73 L238,87 Q236,92 228,93 Q230,98 226,101 Q229,106 224,110 Q206,124 180,110 Q155,100 151,64Z"/></clipPath>
   <ellipse cx="273" cy="403" rx="177" ry="12" fill="#dae5e9"/>
   <path d="M137,197 V272 H276 M149,273 V391 M261,274 L272,391" fill="none" stroke="#6d8791" stroke-width="12" stroke-linecap="round"/>
   <path d="M175,109 C154,126 157,164 151,192 L146,245 Q192,266 222,248 L210,158 Q207,119 190,108Z" fill="url(#rfShirt)" stroke="#708f9c" stroke-width="2"/>
   <path d="M171,103 L173,123 Q186,137 194,118 L190,99" fill="url(#rfSkin)" stroke="#ad8773" stroke-width="1.5"/>
   <path d="M151,64 C147,26 205,14 220,52 Q223,63 226,73 L238,87 Q236,92 228,93 Q230,98 226,101 Q229,106 224,110 Q206,124 180,110 Q155,100 151,64Z" fill="url(#rfSkin)" stroke="#ad8773" stroke-width="2"/>
   <path d="M150,68 Q143,26 184,21 Q218,19 223,54 Q212,42 196,42 Q178,43 172,60 Q168,72 160,76 Q153,74 150,68Z" fill="#5b4a42"/>
   <ellipse cx="174" cy="77" rx="6" ry="9" fill="url(#rfSkin)" stroke="#ad8773" stroke-width="1.5"/>
   <path d="M205,60 Q212,56 220,59" fill="none" stroke="#4b3c34" stroke-width="2.2" stroke-linecap="round"/>
   <path d="M206,68 Q212,63 219,68 Q212,72 206,68Z" fill="#fff" stroke="#6b5a50" stroke-width="1.2"/><circle cx="213.5" cy="67.8" r="2.6" fill="#4a6b78"/><circle cx="213.8" cy="67.8" r="1.2" fill="#18262e"/>
   <path d="M221,103 Q225,104 228,101" fill="none" stroke="#a46e60" stroke-width="1.6" stroke-linecap="round"/>
   ${selected==='leg'?'<path d="M150,59 Q188,52 226,59 L227,73 Q188,67 151,74Z" fill="#47606f"/><path d="M152,64 L139,71 M152,69 L141,81" stroke="#47606f" stroke-width="4" stroke-linecap="round"/>':''}
   <path d="M155,240 Q179,263 211,267 L305,284 Q333,276 323,252 L217,229Z" fill="#6d859b" stroke="#485e72" stroke-width="2"/>
   <g id="rfLowerLeg"><path d="M300,267 Q326,261 330,283 L327,372 Q342,379 362,377 Q372,382 365,393 L310,393 Q298,390 303,373 L289,296Z" fill="url(#rfSkin)" stroke="#ad8773" stroke-width="2"/><path d="M305,371 L327,369 Q336,380 361,377 L366,391 Q339,400 306,391Z" fill="#f9fcfe" stroke="#667e8c" stroke-width="2"/></g>
   <path d="M190,136 Q199,130 210,145 L239,195 L222,207 L184,157Z" fill="url(#rfShirt)" stroke="#708f9c" stroke-width="2"/>
   <g id="rfForearm"><path d="M231,197 L278,221 Q294,215 300,228 Q301,239 286,242 L223,215Z" fill="url(#rfSkin)" stroke="#ad8773" stroke-width="2"/></g>
   ${selected==='conscious'?'<path id="rfMuscle" d="M196,149 Q216,153 228,192 Q209,189 196,149Z" fill="#c97578" stroke="#923f50" stroke-width="2"/>':'<path id="rfMuscle" d="M209,244 Q264,230 303,259 Q267,277 211,258Z" fill="#c97578" stroke="#923f50" stroke-width="2"/>'}
   <path d="M311,259 Q319,268 312,286" fill="none" stroke="#ede8d3" stroke-width="7" stroke-linecap="round"/>
   <path d="M182,86 Q180,100 179,114 Q168,136 165,172 L162,236" fill="none" stroke="#e1d6ea" stroke-width="13" stroke-linecap="round" opacity=".6"/>
   <path d="M182,86 Q180,100 179,114 Q168,136 165,172 L162,236" fill="none" stroke="#8f74ad" stroke-width="5" stroke-linecap="round" opacity=".62"/>
   <g clip-path="url(#rfHeadClip)" opacity=".82"><path class="rf-brain" d="M158,60 C152,42 166,29 183,31 C197,25 214,34 213,50 C218,60 207,68 196,65 C186,71 166,70 158,60Z"/><path class="rf-brain-fold" d="M166,50 Q175,40 184,49 T202,46 M175,60 Q184,54 193,60 M190,36 Q196,42 205,38"/><path d="M186,64 Q184,76 182,90" fill="none" stroke="#b39cc4" stroke-width="6" stroke-linecap="round"/></g>
   <path id="rfIn" class="rf-signal-track" d="${selected==='conscious'?'M210,66 Q201,58 190,52':selected==='leg'?'M305,250 C252,238 200,232 162,226 L165,172 Q168,136 179,114 Q181,98 186,62':'M290,252 C246,242 200,236 162,228'}"/>
   <path id="rfOut" class="rf-signal-track rf-output" d="${selected==='conscious'?'M190,52 Q186,84 184,114 Q174,134 172,150 Q192,156 212,172':selected==='leg'?'M190,52 Q186,84 184,114 Q173,136 170,172 L167,234 Q210,256 286,262':'M162,232 C200,252 244,258 286,262'}"/>
   <circle id="rfCentre" cx="${selected==='knee'?162:188}" cy="${selected==='knee'?229:51}" r="8" fill="#967499"/>
   <circle id="rfPulse" r="6" fill="#216e8b" hidden/>
   <circle id="rfTap" cx="${selected==='leg'?306:332}" cy="${selected==='leg'?252:291}" r="9" fill="none" stroke="#d58a2c" stroke-width="3" opacity="0"/>
   ${selected==='knee'?`<g id="rfExaminer"><path d="M398,240 L545,214 L545,264 L404,274Z" fill="#eef3f6" stroke="#9fb2bd" stroke-width="2"/><path d="M404,242 L408,272" stroke="#9fb2bd" stroke-width="2"/>
   <g id="rfHammer"><path d="M382,262 L346,283" stroke="#7d8c96" stroke-width="5" stroke-linecap="round"/><rect x="-6" y="-15" width="12" height="30" rx="5" transform="translate(341 286) rotate(-29.7)" fill="#c0503c" stroke="#8c3427" stroke-width="1.5"/><path d="M384,250 Q394,242 404,248 L406,268 Q396,276 384,270 Q378,260 384,250Z" fill="url(#rfSkin)" stroke="#ad8773" stroke-width="1.8"/><path d="M387,252 Q380,258 385,265 M392,258 L401,257 M392,264 L401,264" fill="none" stroke="#ad8773" stroke-width="1.5" stroke-linecap="round"/></g></g>`
   :selected==='leg'?`<g transform="translate(12 6)"><path d="M334,176 L470,118 L490,160 L348,206Z" fill="#eef3f6" stroke="#9fb2bd" stroke-width="2"/>
   <g id="rfHammer"><path d="M322,204 L297,237" stroke="#cdb48a" stroke-width="4" stroke-linecap="round"/><ellipse cx="295" cy="240" rx="5.5" ry="4.5" fill="#fbfaf5" stroke="#b9b1a0" stroke-width="1.5"/><path d="M322,186 Q334,178 344,186 L344,204 Q334,212 322,206 Q316,196 322,186Z" fill="url(#rfSkin)" stroke="#ad8773" stroke-width="1.8"/></g></g>`
   :`<path d="M440,128 V398" stroke="#7d929c" stroke-width="7" stroke-linecap="round"/><rect x="408" y="62" width="64" height="70" rx="12" fill="#4f6976"/><circle id="rfLamp" cx="440" cy="97" r="20" fill="#a1b8ae"/>`}
  `);
 }
 function toolPose(a){
  const h=$('rfHammer'),tap=$('rfTap');if(!h)return;
  const sign=selected==='leg'?1:-1,p=a.progress,ease=x=>x*x*(3-2*x);let ang=15,ring=0;
  if(p>=0&&p<1&&!reduced()){
   if(p<.3)ang=15+20*ease(p/.3);else if(p<.42)ang=35*(1-ease((p-.3)/.12));else if(p<.8)ang=15*ease((p-.42)/.38);
   if(p>=.4&&p<.75)ring=1-(p-.4)/.35;
  }else if(reduced()&&p>=0&&p<1)ring=1;
  h.setAttribute('transform',selected==='knee'?`rotate(${sign*ang} 402 256)`:`rotate(${sign*ang} 338 186)`);
  const ex=$('rfExaminer');if(ex){const k=reduced()?(p>=1?1:0):p<.8?0:ease(Math.min(1,(p-.8)/.8));ex.setAttribute('transform',`translate(${(80*k).toFixed(1)} 0)`);}
  if(tap){tap.setAttribute('opacity',ring.toFixed(2));tap.setAttribute('r',String(9+8*(1-ring)));}
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
  if($('rfLowerLeg')){$('rfLowerLeg').setAttribute('transform',`rotate(${-44*t} 308 273)`);$('rfForearm').setAttribute('transform',`rotate(${selected==='conscious'?-93*t:0} 231 204)`);if(selected==='conscious')$('rfLowerLeg').removeAttribute('transform');$('rfMuscle').setAttribute('transform',selected==='conscious'?'':`translate(${t*23} ${t*-12}) scale(${1-t*.085} ${1+t*.05})`);toolPose(a);if($('rfLamp'))$('rfLamp').setAttribute('fill',a.progress>=0?'#eac566':'#a1b8ae');}
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
