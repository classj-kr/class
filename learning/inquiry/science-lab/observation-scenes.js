/* Comparison drawings. Numeric/audio outputs are illustrative models, not measurements. */
(function(root){
 const text=(s,x,y,size=14,color='#284651')=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="${color}">${s}</text>`;
 const path=(d,color='#67818c',width=2,extra='')=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" ${extra}/>`;
 const flame=(x,y,fuel)=>`<path d="M${x} ${y} q-17 -20 0 -48 q23 32 0 48" fill="${fuel==='alcohol'?'#609bcc':'#edaa47'}"/>`;
 const fuel=(x,y,kind)=>kind==='alcohol'?`<ellipse cx="${x}" cy="${y+29}" rx="28" ry="21" fill="#c7dae2" stroke="#67818c"/><path d="M${x-7} ${y+11} v-13 h14 v13" fill="#8e9ca4"/>`:`<rect x="${x-12}" y="${y}" width="24" height="52" fill="#f1dfba"/>`;
 const jar=(x,y,up=false)=>`<path d="${up?`M${x} ${y} v108 h80 v-108`:`M${x} ${y+108} v-108 h80 v108`}" fill="#d9edf2" fill-opacity=".35" stroke="#789aa6" stroke-width="2"/>`;
 function combustion(s){
  const stage=+s.step,after=stage===2,common=s.test==='common',burning=stage===1;
  let svg=text((common?['연소 전','연소 중 관찰','연소 중 관찰한 현상 정리']:['연소 전','연소 중 · 모으기','연소 뒤 · 확인'])[stage],230,27,16);
  if(common){svg+=fuel(230,178,s.fuel)+(stage?flame(230,178,s.fuel):'')+text(stage?'빛과 열이 나타남':'불을 붙이기 전',230,275);}
  else if(s.test==='cobalt'){
   svg+=jar(135,83)+fuel(175,139,s.fuel)+(burning?flame(175,139,s.fuel):'')+
    `<rect data-reagent="cobalt" x="142" y="100" width="15" height="32" fill="${after?'#d980a4':'#8aa5df'}"/>`+
    path('M157 115 H278')+text('통 안쪽에 붙인 종이',338,107,13)+text(after?'푸른색 → 붉은색':'푸른색 염화 코발트 종이',338,135,12)+
    (after?[165,189,205].map((x,i)=>`<circle data-water-drop cx="${x}" cy="${94+i*7}" r="3" fill="#6fadd0"/>`).join(''):'')+
    text(stage===0?'종이를 붙인 통과 연료 준비':burning?'타는 연료를 통으로 덮음':'불꽃이 꺼진 뒤 종이 색 관찰',230,263);
  }else{
   svg+=jar(65,83)+fuel(105,139,s.fuel)+(stage?flame(105,139,s.fuel):'')+text('집기병으로 덮어 모음',105,260,12);
   if(after){
    svg+=path('M177 151 h53 m-8 -6 8 6 -8 6','#aa8148',3)+jar(300,83,true)+
     '<rect data-reagent="lime" x="302" y="159" width="76" height="30" fill="#eeeede"/>'+
     path('M295 80 H385','#6b8a96',4)+text('① 입구를 막아 세움',337,222,12)+text('② 석회수를 넣고 흔듦',337,244,12)+text('맑음 → 뿌옇게 됨',337,266,12);
    // Left drawing is the earlier collection step, not a flame burning inside a sealed test vessel.
    svg+=text('앞 단계',105,62,12);
   }else svg+=jar(300,83,true)+'<rect x="302" y="159" width="76" height="30" fill="#bfe2ec"/>'+text('따로 준비한 맑은 석회수',337,260,12);
  }
  return{svg:`<g data-observation-scene="combustion" data-stage="${stage}">${svg}</g>`,after,burning};
 }
 function insulation(s){
  const minutes=s.stage==='after'?Number(s.minutes||15):0,temperature=(t,k)=>20+60*Math.exp(-k*t);
  const wrapped=temperature(minutes,.018),bare=temperature(minutes,.07);
  let svg=text('같은 양의 물 · 처음 80 ℃ · 실내 20 ℃',230,22,14);
  for(const [x,value,name,color]of [[92,wrapped,'단열재 있음','#b0733c'],[342,bare,'단열재 없음','#3489a3']]){
   svg+=jar(x-30,44,true)+`<rect x="${x-28}" y="93" width="76" height="57" fill="#c0deea"/>`+
    (x===92?`<path d="M${x-35} 87 v69 h90 v-69" fill="none" stroke="#cabb9a" stroke-width="10"/>`:'')+
    path(`M${x+12} 56 V135`,'#91a7af',8)+path(`M${x+12} 135 V${135-(value-20)/60*73}`,color,5)+text(value.toFixed(1)+' ℃',x+10,175,17,color)+text(name,x+10,193,13,color);
  }
  const px=t=>65+t*10.5,py=t=>277-(t-20)*.8;
  svg+=path('M65 216 v61 h315')+text('80',45,233,11)+text('20',45,280,11)+text('0',65,296,11)+text('15',222,296,11)+text('30분',380,296,11)+text('℃',40,217,11);
  for(const [k,color]of [[.018,'#b0733c'],[.07,'#3489a3']]){const d=Array.from({length:31},(_,t)=>(t?'L':'M')+px(t)+' '+py(temperature(t,k))).join(' ');svg+=path(d,color,2)+`<circle cx="${px(minutes)}" cy="${py(temperature(minutes,k))}" r="4" fill="${color}"/>`;}
  return{svg:`<g data-observation-scene="insulation">${svg}</g>`,metrics:{minutes,wrapped,bare,room:20,initial:80},text:minutes===0?'처음에는 두 용기의 온도가 같습니다. 단열재 유무만 다르게 하고, 같은 시간이 지난 뒤 온도를 비교하세요.':minutes+'분 뒤 단열재로 감싼 물은 '+wrapped.toFixed(1)+' ℃, 감싸지 않은 물은 '+bare.toFixed(1)+' ℃입니다. 둘 다 식지만 단열재가 있으면 온도가 더 천천히 내려갑니다.',note:'수치와 곡선은 일정한 실내 온도에서 식는 모습을 설명하는 가상 모형입니다. 실제 측정값이 아니며, 용기·단열재에 따라 달라집니다. 단열은 열 이동을 줄이며 완전히 막지는 않습니다.'};
 }
 function sound(s){
  const string=s.kind==='string',on=s.condition==='on',amplitude=(string?on:!on)?1:.22;
  let svg=text('같은 소리 · 듣는 곳에서의 차이',230,27,15);
  if(string){svg+='<path d="M42 81 L95 96 V145 L42 160 Z M418 81 L365 96 V145 L418 160 Z" fill="#d8c6a8" stroke="#937e62" stroke-width="2"/>'+
   path(on?'M95 120 H365':'M95 120 Q230 239 365 120','#937e62',2)+text('말하기',67,65)+text('듣기',393,65)+text(on?'팽팽한 실':'느슨한 실',230,192);}
  else svg+='<path d="M52 105 h20 l28 -23 v76 l-28 -23 h-20 Z" fill="#76919e"/>'+
   (on?'<rect x="215" y="66" width="25" height="112" fill="#a4cada" stroke="#648998"/>':'<path d="M215 66 l45 -19 v112 l-45 19 Z" fill="#e1eef1" stroke="#648998"/>')+
   text(on?'닫힌 창문':'열린 창문',230,196)+text('듣는 곳',380,114);
  svg+=text('전달된 진동의 크기 비교',230,222,13)+path('M80 260 H380','#c1cdd1',1);
  const d=Array.from({length:181},(_,i)=>(i?'L':'M')+(80+i*300/180)+' '+(260-Math.sin(i*Math.PI/15)*22*amplitude)).join(' ');
  svg+=path(d,'#398c9b',2.5);
  return{svg:`<g data-observation-scene="sound" data-relative-amplitude="${amplitude}">${svg}</g>`,audio:{frequency:440,amplitude},text:string?(on?'실이 팽팽하면 컵의 진동이 실을 통해 더 잘 전달됩니다. 실을 느슨하게 한 경우와 비교해 보세요.':'실이 느슨하면 진동이 잘 전달되지 않아 듣는 소리가 약해질 수 있습니다. 컵·실과 말하는 소리의 크기를 같게 합니다.'):(on?'창문을 닫으면 소리의 전달을 줄일 수 있습니다. 창문을 열었을 때와 같은 듣는 위치에서 비교하세요.':'창문을 열면 바깥 소리가 더 잘 전달될 수 있습니다. 소리의 높낮이는 그대로 두고 전달되는 크기만 비교합니다.'),note:'버튼을 누르면 짧은 비교음을 듣습니다. 파형과 음량은 차이를 나타내는 모형이며 실제 실 전화기·창문의 측정값이 아닙니다. 소리는 공기를 통한 세로파이며 이 그림은 공기의 이동 경로가 아닙니다.'};
 }
 function galaxy(){
  let svg='<ellipse cx="190" cy="135" rx="116" ry="105" fill="#eef1f8"/>';
  for(const turn of [0,Math.PI]){
   const points=Array.from({length:90},(_,i)=>{const angle=turn+i/89*4,r=26+i/89*77;return(i?'L':'M')+(190+Math.cos(angle)*r)+' '+(135+Math.sin(angle)*r*.86);}).join(' ');
   svg+=path(points,'#829cc7',13,'stroke-linecap="round" opacity=".6" data-spiral-arm');
  }
  svg+='<ellipse cx="190" cy="135" rx="43" ry="16" fill="#d2bb87" transform="rotate(-22 190 135)" data-galactic-bar/>'+
   '<circle cx="190" cy="135" r="12" fill="#ead8ab"/><circle cx="262" cy="159" r="5" fill="#ba791c" data-solar-location/>'+
   path('M263 159 L335 181')+text('태양계',375,185,13)+path('M210 130 L330 85')+text('중심 막대',370,80,13)+path('M132 188 L64 218')+text('나선팔',48,237,13)+text('위에서 본 모습',190,22,15)+
   '<path d="M81 270 Q140 261 160 259 Q190 232 220 259 Q250 261 309 270 Q250 279 220 281 Q190 303 160 281 Q140 279 81 270" fill="#c5d1e5"/>'+
   text('옆모습',368,274,13);
  return `<g data-observation-scene="galaxy">${svg}</g>`;
 }
 const api={combustion,insulation,sound,galaxy};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.scienceObservationScenes=api;
})(typeof window==='undefined'?null:window);
