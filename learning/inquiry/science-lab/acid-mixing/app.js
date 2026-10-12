document.addEventListener('DOMContentLoaded',()=>{
 const root=document.querySelector('#amLab'),$=id=>document.getElementById(id),M=window.AcidMixingModel;
 let state={mode:'cabbage',start:'acid',titrant:'opposite',volume:0,indicator:false},history=[],busy=false,automatic=false,epoch=0,timer;
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches,n=v=>Number(v.toFixed(2)).toString();
 const name=k=>k==='acid'?'묽은 염산':k==='base'?'묽은 수산화 나트륨 용액':'물';
 const addedName=()=>state.titrant==='water'?name('water'):name(state.start==='acid'?'base':'acid');
 function save(){const r=M.solve(state);if(!history.some(h=>Math.abs(h.added-r.added)<1e-8))history.push(r);}
 function draw(r){
  const defs=`<defs><linearGradient id="amGlass" x1="0" x2="1"><stop stop-color="#eaf4f7" stop-opacity=".7"/><stop offset=".35" stop-color="#fff" stop-opacity=".15"/><stop offset="1" stop-color="#bcd4de" stop-opacity=".7"/></linearGradient><linearGradient id="amLiquid" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${r.hex}" stop-opacity=".65"/><stop offset="1" stop-color="${r.hex}"/></linearGradient></defs>`;
  let vessel='';
  if(state.mode==='cabbage'){
   const outline='M229 145 H291 V187 L369 314 Q382 344 357 347 H163 Q138 344 151 314 L229 187 Z',area=24650*r.total/100,h=(220-Math.sqrt(220*220-4*(150/340)*area))/(2*(150/340)),y=340-h;
   root.style.setProperty('--am-fall',(y-143)+'px');
   vessel=`<defs><clipPath id="amInside"><path d="${outline}"/></clipPath></defs><ellipse cx="260" cy="355" rx="136" ry="15" fill="#aec7d0" opacity=".28"/><g class="am-vessel"><path d="${outline}" fill="url(#amGlass)" stroke="#7595a5" stroke-width="3"/><g clip-path="url(#amInside)"><rect x="138" y="${y}" width="244" height="130" fill="url(#amLiquid)"/><ellipse cx="260" cy="${y}" rx="${110-h*150/340}" ry="6" fill="${r.hex}" opacity=".78"/></g><path d="M219 205 L165 312 Q154 332 179 334 M237 154 V183" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".8"/><path d="M229 145 H291" stroke="#4b7181" stroke-width="4"/><ellipse cx="260" cy="145" rx="31" ry="5" fill="#edf5f7" stroke="#7595a5" stroke-width="2"/></g>`;
  }else{
   root.style.setProperty('--am-fall',(99-r.total/10*25)+'px');
   vessel='<ellipse cx="260" cy="356" rx="206" ry="17" fill="#aec7d0" opacity=".28"/><g class="am-vessel"><rect x="57" y="170" width="406" height="172" rx="20" fill="url(#amGlass)" stroke="#7595a5" stroke-width="3"/>';
   for(const cy of [214,293])for(const cx of [141,260,379]){const active=cx===260&&cy===214,fillY=cy+28-r.total/10*25;vessel+=`<path d="M${cx-46} ${cy} V${cy+23} C${cx-46} ${cy+52} ${cx+46} ${cy+52} ${cx+46} ${cy+23} V${cy}" fill="#f4f8fa" stroke="#9bb5c1" stroke-width="2"/>${active?`<path d="M${cx-43} ${fillY} V${cy+24} C${cx-43} ${cy+48} ${cx+43} ${cy+48} ${cx+43} ${cy+24} V${fillY}" fill="url(#amLiquid)"/><ellipse cx="${cx}" cy="${fillY}" rx="43" ry="12" fill="${r.hex}"/>`:''}<ellipse cx="${cx}" cy="${cy}" rx="46" ry="15" fill="none" stroke="${active?'#286b77':'#8faab6'}" stroke-width="${active?4:2}"/>`;}
   vessel+='</g>';
  }
  const dropper='<g><path d="M252 23 Q244 5 260 4 Q276 5 268 23 L268 43 H252 Z" fill="#437586"/><path d="M254 43 H266 V103 L261 122 H259 L254 103 Z" fill="#e8f4f8" stroke="#7595a5" stroke-width="2"/><path d="M257 61 V103 L260 114 L263 103 V61" fill="#b8d4df" opacity=".7"/><path class="am-droplet" d="M260 128 C243 151 277 151 260 128" fill="#91bdcd"/></g>';
  $('amDiagram').innerHTML=defs+vessel+dropper;$('amDiagram').setAttribute('aria-label',(state.mode==='cabbage'?'삼각 플라스크':'홈판')+'에 처음 시약 '+n(r.initial)+' mL, 더 넣은 용액 '+n(r.added)+' mL, '+r.name);
 }
 function render(){
  const r=M.solve(state);root.classList.toggle('am-mixing',busy);draw(r);
  root.querySelectorAll('[data-am-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.amMode===state.mode)));
  $('amStart').value=state.start;$('amTitrant').options[0].textContent=name(state.start==='acid'?'base':'acid');$('amTitrant').value=state.titrant;
  $('amVesselName').textContent=state.mode==='cabbage'?'삼각 플라스크':'6홈판';$('amPourLabel').textContent='넣는 용액 · '+addedName();
  $('amInitial').textContent=n(r.initial)+' mL';$('amAdded').textContent=n(r.added)+' mL';$('amColour').textContent=r.name;
  $('amIndicator').disabled=state.indicator||busy;$('amIndicator').textContent=state.indicator?'지시약을 넣었습니다':state.mode==='cabbage'?'양배추 지시약 10방울 넣기':'페놀프탈레인 3방울 넣기';
  $('amAdd').textContent=r.added>=r.max?'끝까지 넣었습니다':n(Math.min(Number($('amStep').value),r.max-r.added))+' mL 넣고 섞기';$('amAdd').disabled=!state.indicator||busy||automatic||r.added>=r.max;
  $('amPlay').disabled=!state.indicator||(!automatic&&r.added>=r.max);$('amPlay').textContent=automatic?'자동 넣기 멈추기':'끝까지 조금씩 넣기';$('amStep').disabled=busy||automatic;
  $('amStatus').textContent=busy?'용액을 넣고 골고루 섞고 있습니다.':!state.indicator?'지시약을 넣고 처음 색을 관찰하세요.':r.added===0?'처음 색은 '+r.name+'입니다. 다른 용액을 조금씩 넣어 보세요.':addedName()+' '+n(r.added)+' mL를 더 넣었습니다. 골고루 섞인 용액은 '+r.name+'입니다.'+(state.mode==='phenol'&&r.name==='무색'?' 무색이라는 결과만으로 산성이 사라졌다고 판단하지 마세요.':'');
  $('amHistoryEmpty').hidden=!!history.length;
  const interval=state.mode==='cabbage'?5:.5,selected=history.filter((h,i)=>i===0||i===history.length-1||Math.abs(h.added/interval-Math.round(h.added/interval))<1e-6);
  $('amHistory').innerHTML=selected.map(h=>`<li><strong>${n(h.added)} mL</strong><span class="am-swatch" style="background:${h.hex}" aria-hidden="true"></span><span>${h.name}</span></li>`).join('');
 }
 function stop(){automatic=false;if(!busy)clearTimeout(timer);}
 function reset(){stop();epoch++;clearTimeout(timer);busy=false;state.volume=0;state.indicator=false;history=[];render();}
 function setMode(mode){if(!['cabbage','phenol'].includes(mode))return;state.mode=mode;$('amStep').innerHTML=(mode==='cabbage'?[5,1]:[.5,.1]).map(v=>'<option value="'+v+'">'+v+' mL</option>').join('');reset();}
 function setStart(v){state.start=v==='base'?'base':'acid';reset();}
 function setTitrant(v){state.titrant=v==='water'?'water':'opposite';reset();}
 function indicator(){if(busy||state.indicator)return;state.indicator=true;save();render();}
 function advance(){
  const r=M.solve(state);if(busy||!state.indicator||r.added>=r.max){if(r.added>=r.max){stop();render();}return;}
  busy=true;const token=epoch,next=Math.min(r.max,Number((r.added+Number($('amStep').value)).toFixed(2)));render();
  timer=setTimeout(()=>{if(token!==epoch)return;state.volume=next;busy=false;save();if(next>=r.max)stop();render();if(automatic)timer=setTimeout(advance,420);},reduced()?0:700);
 }
 root.querySelectorAll('[data-am-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.amMode)));
 $('amStart').addEventListener('change',e=>setStart(e.target.value));$('amTitrant').addEventListener('change',e=>setTitrant(e.target.value));$('amStep').addEventListener('change',render);
 $('amIndicator').addEventListener('click',indicator);$('amAdd').addEventListener('click',advance);$('amReset').addEventListener('click',reset);
 $('amPlay').addEventListener('click',()=>{if(automatic){stop();render();return;}automatic=true;advance();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){automatic=false;if(!busy)clearTimeout(timer);render();}});
 window.__acidMixing={state:()=>({...state,...M.solve(state),busy,automatic,history:history.map(h=>({...h}))}),setMode,setStart,setTitrant,indicator,reset,setVolume(v){stop();epoch++;clearTimeout(timer);busy=false;state.volume=M.solve({...state,volume:v}).added;if(state.indicator)save();render();}};
 render();
});
