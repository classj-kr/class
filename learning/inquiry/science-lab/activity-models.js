/* Activity models are pure: the workbench owns controls, records and persistence. */
(() => {
 'use strict';
 const svg=body=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 330" role="img" aria-label="현재 조건의 실험 장치와 관찰 결과"><style>text{font:15px sans-serif;fill:#17313c}.small{font-size:12px}.glass{fill:#e2f1f6;stroke:#387386;stroke-width:2}.ray{fill:none;stroke-width:3}</style>${body}</svg>`;
 const elements=[
  ['B','붕소',10.8,'B₂O₃',0],['C','탄소',12,'CO₂',1],['N','질소',14,'N₂O₅',2],
  ['Al','알루미늄',27,'Al₂O₃',3],['Si','규소',28.1,'SiO₂',4],['P','인',31,'P₂O₅',5],
  ['As','비소',74.9,'As₂O₅',8],['In','인듐',114.8,'In₂O₃',9],['Sn','주석',118.7,'SnO₂',10],['Sb','안티모니',121.8,'Sb₂O₅',11]
 ].map(([symbol,name,mass,oxide,slot])=>({symbol,name,mass,oxide,slot}));
 function periodic(slots){
  const used=slots.filter(Boolean),unique=new Set(used);
  const correct=elements.filter(e=>slots[e.slot]===e.symbol).length;
  return{correct,complete:correct===elements.length&&unique.size===elements.length,duplicate:unique.size!==used.length,
   message:`${elements.length}장의 카드 중 질량 순서와 산화물 성질에 맞는 위치는 ${correct}곳입니다. 빈칸 2개는 아직 발견되지 않은 원소를 예측하는 자리입니다.`};
 }
 function broth(neck,boiled,day){return{air:neck!=='sealed',dust:neck==='cut'||neck==='tilt',growth:day>0&&(!boiled||neck==='cut'||neck==='tilt')};}
 function flask(x,label,neck,boiled,day){
  const a=broth(neck,boiled,day),color=a.growth?'#aa9f63':'#f1d789';
  const neckPath=neck==='swan'||neck==='tilt'?'M110 116 V66 Q110 26 142 44 Q163 54 161 82 Q160 110 184 106 Q209 101 211 68':'M110 116 V58';
  let body=`<g transform="translate(${x} 10)"><text x="120" y="16" text-anchor="middle">${label}</text><path class="glass" d="M96 118 L64 214 Q57 238 85 242 H147 Q175 238 168 214 L126 118 Z"/><path d="M78 186 L68 217 Q63 234 86 236 H145 Q166 235 160 216 L146 186 Z" fill="${color}"/><path d="${neckPath}" fill="none" stroke="#387386" stroke-width="14"/><path d="${neckPath}" fill="none" stroke="#e2f1f6" stroke-width="9"/>`;
  if(neck==='sealed')body+='<rect x="98" y="47" width="24" height="13" rx="3" fill="#976c49"/>';
  if(neck==='swan'||neck==='tilt')body+='<circle cx="178" cy="106" r="4" fill="#835a42"/><circle cx="188" cy="105" r="3" fill="#835a42"/>';
  if(neck==='tilt')body+='<path d="M175 101 Q145 85 118 143" fill="none" stroke="#835a42" stroke-dasharray="4 4"/><text class="small" x="205" y="136">먼지 접촉 뒤</text><text class="small" x="205" y="152">다시 세운 상태</text>';
  if(a.growth)for(let i=0;i<19;i++)body+=`<circle cx="${82+(i*29)%68}" cy="${196+(i*13)%32}" r="2.5" fill="#526731"/>`;
  body+=`<text x="120" y="270" text-anchor="middle">${a.growth?'미생물 증식 모형':'혼탁 변화 없음'}</text><text class="small" x="120" y="291" text-anchor="middle">공기 ${a.air?'통과':'차단'} · ${boiled?'가열 처리':'미가열'} · ${day}일</text></g>`;
  return body;
 }
 function pasteur(s){
  const test=broth(s.neck,s.boiled==='yes',+s.day),control=broth('swan',true,+s.day);
  return{values:{control,test},summary:`${s.day}일째 가상 관찰: 대조 플라스크는 혼탁 변화가 없고, 비교 플라스크는 ${test.growth?'미생물이 증식합니다.':'혼탁 변화가 없습니다.'} 대조 조건에서는 공기가 통하고 먼지는 굽은 목에 머뭅니다. 비교 조건: ${test.air?'공기가 통합니다.':'공기가 차단됩니다.'} ${s.boiled==='no'?'가열하지 않아 기존 미생물의 영향이 남습니다.':test.dust?'먼지의 미생물이 배양액에 닿을 수 있습니다.':'외부 미생물이 배양액에 닿지 않는 조건입니다.'}`,svg:svg(flask(25,'대조: 가열한 백조목','swan',true,+s.day)+flask(395,'비교 조건',s.neck,s.boiled==='yes',+s.day)),
   note:'증식 여부와 경과일은 원리를 보여 주는 가상 결과입니다. 가열 처리는 초기 미생물을 제거한 이상적인 조건이며 실제 가열의 멸균 효과를 보증하지 않습니다. 실제 실험의 배양·관찰·폐기는 교사 지도 아래 수행합니다.'};
 }
 const colors=[{name:'빨강',hex:'#d43b36',n:1.51},{name:'초록',hex:'#248950',n:1.52},{name:'파랑',hex:'#326aca',n:1.53}];
 function prism(s){
  const rays=colors.map((c,i)=>({...c,delta:2*Math.asin(c.n*.5)*180/Math.PI-60,y:130+i*34}));
  const combine=s.stage==='combine',single=s.stage==='single',offset=+s.screen;
  const selected=rays[+s.color],atFocus=combine&&offset===0;
  const result=single?[selected.name]:atFocus?['흰빛']:rays.map(r=>r.name);
  let b='<rect x="20" y="120" width="50" height="35" rx="7" fill="#d3a451"/><text x="22" y="106">흰빛 광원</text><path class="glass" d="M155 210 L205 65 L255 210 Z"/><path d="M70 137 H180" stroke="#aa9e73" stroke-width="8"/><text x="160" y="238">첫 프리즘</text>';
  for(const r of rays)b+=`<path class="ray" stroke="${r.hex}" d="M180 137 L${205+(r.y-65)*50/145} ${r.y} L390 ${r.y}"/>`;
  if(single){
   b+='<rect x="387" y="95" width="14" height="146" fill="#253843"/>';
   b+=`<rect x="386" y="${selected.y-5}" width="16" height="10" fill="#fff"/><text x="351" y="270">한 색만 통과</text><path class="glass" d="M450 235 L498 72 L546 235 Z"/><text x="451" y="264">둘째 프리즘</text><path class="ray" stroke="${selected.hex}" d="M401 ${selected.y} L491 ${selected.y} L680 ${selected.y+35}"/><rect x="676" y="${selected.y+28}" width="13" height="14" fill="${selected.hex}"/>`;
  }else if(combine){
   b+='<ellipse class="glass" cx="410" cy="165" rx="13" ry="94"/><text x="355" y="283">빛을 모으는 광학계</text>';
   for(const r of rays){const end=165+(r.y-165)*offset/45;b+=`<path class="ray" stroke="${r.hex}" d="M390 ${r.y} L410 ${r.y} L680 ${end}"/>`;
    if(!atFocus)b+=`<rect x="676" y="${end-5}" width="14" height="10" fill="${r.hex}"/>`;}
   if(atFocus)b+='<rect x="673" y="156" width="21" height="18" fill="white" stroke="#52616b"/>';
  }else for(const r of rays)b+=`<path class="ray" stroke="${r.hex}" d="M390 ${r.y} L680 ${r.y}"/><rect x="676" y="${r.y-7}" width="14" height="14" fill="${r.hex}"/>`;
  b+='<path d="M700 75 V260" stroke="#66818c" stroke-width="3"/><text x="674" y="289">스크린</text>';
  return{values:{rays:rays.map(({name,n,delta})=>({name,n,delta})),result,atFocus},svg:svg(b),summary:single?'슬릿으로 고른 단색광은 둘째 프리즘에서 방향이 바뀌어도 여러 색으로 다시 분리되지 않습니다.':atFocus?'여러 색의 빛이 같은 위치에 겹쳐 흰빛이 보입니다.':'색에 따라 굴절 정도가 달라 다른 위치에 도달합니다.',note:'장치는 경로 비교용 모식도입니다. 그림의 각도·간격은 실제 치수가 아닙니다. 굴절률 1.51·1.52·1.53은 설명용 가정이며, 표의 최소 편향각은 꼭지각 60°인 프리즘을 각 색에 대해 최소 편향으로 맞춘 계산값입니다. 흰빛에는 그림의 세 색 사이 파장도 연속적으로 포함됩니다.'};
 }
 const api={elements,periodic,broth,pasteur,prism};
 if(typeof module!=='undefined')module.exports=api;else window.scienceActivityModels=api;
})();
