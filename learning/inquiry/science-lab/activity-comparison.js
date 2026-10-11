/* Activities whose student task is comparison, pairing or analysis of collected data. */
(() => {
 'use strict';
 const api=typeof module!=='undefined'?require('./activity-projects.js'):window.scienceActivityExtensions;
 const {add,choice,num,text,area,label,svg,chart,parseTable,f,esc}=api;

 // Deliberately simplified matching symbols, not clinical chromosome ideograms.
 const lengths=[100,96,80,76,72,68,64,61,59,57,56,55,48,47,46,43,41,39,35,34,29,31,63,30];
 const centers=[.48,.39,.46,.29,.30,.40,.39,.32,.39,.32,.40,.29,.20,.20,.20,.45,.34,.27,.46,.44,.20,.20,.38,.23];
 const order=[13,4,19,8,1,22,11,6,17,2,21,10,15,0,7,20,3,16,9,18,5,14,12];
 const letters=order.map((_,i)=>String.fromCharCode(65+i));
 function chromosome(type,x,y,scale=1){
  const h=lengths[type]*scale,w=8*scale,cy=y+h*centers[type];let b='';
  for(const side of [-1,1]){
   const px=x+side*w*.8;
   b+=`<path d="M${px} ${y} L${x+side*w*.25} ${cy} L${px} ${y+h}" fill="none" stroke="#43899d" stroke-width="${w}" stroke-linecap="round"/>`;
   for(let i=0;i<6;i++)if(((type+1)>>i)&1){const yy=y+h*(.12+i*.14),t=yy<=cy?(yy-y)/(cy-y):(y+h-yy)/(y+h-cy),xx=px-side*w*.55*t;b+=`<path d="M${xx-w*.4} ${yy} H${xx+w*.4}" stroke="#143c55" stroke-width="${Math.max(2,3*scale)}"/>`;}
  }
  return b+`<ellipse cx="${x}" cy="${cy}" rx="${w*.55}" ry="${w*.4}" fill="#e6ba68"/>`;
 }
 const pairControls=[choice('sample','비교할 세포 모형','I',[['I','세포 I'],['II','세포 II']]),...Array.from({length:23},(_,i)=>choice('pair'+i,(i===22?'성염색체 X 기준':`${i+1}번 상염색체 기준`)+' · 짝 카드','',[['','아직 선택하지 않음'],...letters.map(a=>[a,'카드 '+a])]))];
 const typeFor=(card,sample)=>{const i=letters.indexOf(card);return i<0?null:order[i]===22&&sample==='II'?23:order[i];};
 function pairing(state){
  const assigned=Array.from({length:23},(_,i)=>state['pair'+i]||''),used=assigned.filter(Boolean),counts=new Map();
  for(const a of used)counts.set(a,(counts.get(a)||0)+1);
  const duplicate=[...counts].filter(([,n])=>n>1).map(([a])=>a);
  const correct=assigned.filter((a,i)=>a&&order[letters.indexOf(a)]===i&&counts.get(a)===1).length;
  return {assigned,duplicate,correct,placed:used.length,complete:correct===23&&duplicate.length===0};
 }
 add('karyotype',pairControls,[
  '두 염색분체가 연결된 그림 하나를 염색체 한 개로 셉니다. 카드의 길이·줄무늬·동원체 위치를 비교하세요.',
  '각 기준 염색체의 짝을 A~W 카드에서 골라 배치합니다. 같은 카드는 한 번만 사용할 수 있습니다.',
  '세포 I과 II의 상염색체 짝과 성염색체 구성을 비교하고, 관찰 근거와 모형의 한계를 기록합니다.'
 ],s=>{
  const p=pairing(s);let body=label(22,28,'비교할 염색체 카드 · 크기와 줄무늬는 짝짓기를 위한 단순화 모형');
  order.forEach((_,i)=>{const x=50+(i%8)*91,y=65+Math.floor(i/8)*132,type=typeFor(letters[i],s.sample);body+=label(x-7,y-12,letters[i])+chromosome(type,x,y,.92);});
  const diagram=svg(body).replace('0 0 760 340','0 0 760 470');
  const message=p.duplicate.length?`카드 ${p.duplicate.join(', ')}를 중복 사용했습니다. 각 카드의 자리를 하나씩 정하세요.`:p.complete?`23개 짝을 비교했습니다. 상염색체 44개와 성염색체 2개, 총 46개입니다. 이 모형의 성염색체 구성은 ${s.sample==='I'?'XX':'XY'}입니다.`:`23칸 중 ${p.placed}칸에 배치했고, 기준 특징과 맞는 짝은 ${p.correct}개입니다. X와 Y는 크기·형태가 같지 않을 수 있습니다.`;
  return{svg:diagram,summary:message,headers:['기준 자리','선택 카드','현재 비교'],rows:p.assigned.map((a,i)=>[i===22?'성염색체':i+1,a||'선택 전',!a?'비교 전':p.duplicate.includes(a)?'중복 카드':order[letters.indexOf(a)]===i?'짝의 특징 확인':'다시 비교']),note:'두 세포의 가상 카드 모형입니다. 사람의 실제 G-분염 사진이나 임상 판독용 표가 아니며, 줄무늬와 길이는 단순화했습니다. 이 예의 XX·XY 구성만으로 모든 사람의 특성이나 건강을 판정하지 않습니다. 염색체 수 46개와 염색분체 수 92개를 구별하세요.',...p,chromosomes:46,chromatids:92};
 });
 api.specs.karyotype.sceneFirst=true;
 api.specs.karyotype.controlFigure=(c,s)=>{
  if(!/^pair\d+$/.test(c.key))return '';
  const i=Number(c.key.slice(4)),selected=typeFor(s[c.key],s.sample);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 150" role="img" aria-label="${esc(c.label)} 비교"><text x="25" y="18" font-size="13">기준</text><text x="130" y="18" font-size="13">선택한 카드</text>${chromosome(i,48,33,.95)}${selected===null?'<text x="145" y="85" font-size="22">?</text>':chromosome(selected,155,33,.95)}</svg>`;
 };
 api.karyotype={pairing,typeFor,order,letters};

 const planetDemo='수성,0.4,없음\n금성,0.9,없음\n지구,1,없음\n화성,0.5,없음\n목성,11.2,있음\n토성,9.5,있음\n천왕성,4.0,있음\n해왕성,3.9,있음';
 function planetRows(raw){
  const lines=String(raw).trim().split(/\r?\n/).filter(l=>l.trim());if(lines.length<2||lines.length>30)throw Error('천체 자료를 2~30행 입력하세요.');
  const seen=new Set();return lines.map((line,i)=>{const a=line.split(/[,\t;]/).map(x=>x.trim());if(a.length!==3||!a[0]||a[0].length>20||!a[1]||!Number.isFinite(Number(a[1]))||Number(a[1])<=0||Number(a[1])>100||!['있음','없음'].includes(a[2]))throw Error(`${i+1}행은 이름,반지름(지구=1),고리(있음/없음) 순서로 입력하세요. 반지름 범위는 0 초과~100입니다.`);if(seen.has(a[0]))throw Error('천체 이름이 중복되어 있습니다.');seen.add(a[0]);return{name:a[0],radius:Number(a[1]),ring:a[2]==='있음'};});
 }
 add('planet-classification',[area('data','천체 이름,반지름(지구=1),고리(있음/없음)',planetDemo),choice('criterion','내가 정한 두 집단의 분류 기준','radius',[['radius','반지름 경곗값'],['ring','고리의 유무']]),num('threshold','반지름 경곗값 (지구=1)',2,.1,20,.1),text('provenance','자료 출처·확인 날짜','천재교과서 2022 과학1(임성숙) PDF 232~233쪽의 반올림값'),area('reason','분류한 두 집단의 공통점과 다른 기준으로 비교한 결과')],[
  '천체의 특징을 조사하고 반지름·고리 자료와 출처를 입력합니다. 반지름은 지구를 1로 한 같은 단위를 사용합니다.',
  '분류 기준과 경곗값을 직접 정해 두 집단을 만들고, 기준을 바꾸었을 때 소속이 달라지는 천체를 찾습니다.',
  '두 집단의 공통점과 구성 물질·질량 등 추가 자료를 비교하여, 이 분류가 지구형·목성형 구분과 같은지 설명합니다.'
 ],s=>{
  const data=planetRows(s.data),group=r=>s.criterion==='ring'?(r.ring?'B':'A'):(r.radius>=s.threshold?'B':'A'),max=Math.max(...data.map(r=>r.radius));let b=label(25,25,'입력 반지름의 비교 · 막대 길이는 같은 비율');
  data.forEach((r,i)=>{const y=55+i*34; b+=label(15,y+6,r.name)+`<rect x="100" y="${y-12}" width="${r.radius/max*440}" height="22" fill="${group(r)==='A'?'#287f93':'#ae7334'}"/>`+label(555,y+5,`${f(r.radius,2)} · 집단 ${group(r)}`);});
  const groups=['A','B'].map(g=>data.filter(r=>group(r)===g).map(r=>r.name)),rule=s.criterion==='ring'?'A: 고리 없음 / B: 고리 있음':`A: 반지름 ${f(s.threshold)} 미만 / B: ${f(s.threshold)} 이상`;
  return{svg:svg(b).replace('0 0 760 340',`0 0 760 ${Math.max(340,90+data.length*34)}`),summary:`${rule}. A ${groups[0].length}개, B ${groups[1].length}개.${groups.some(g=>!g.length)?' 한 집단이 비어 있습니다. 두 집단을 비교할 수 있도록 기준을 재검토하세요.':''}`,headers:['천체','반지름 (지구=1)','고리','집단'],rows:data.map(r=>[r.name,r.radius,r.ring?'있음':'없음',group(r)]),note:'기본값은 교과서의 반올림된 반지름과 고리 자료입니다. 위성 수와 현재 관측 현상은 제공하지 않습니다. 반지름 경곗값만으로 모든 천체의 구성 물질을 판정할 수는 없습니다. 선택한 분류 기준을 근거와 함께 설명하세요.',groups,rule};
 });
 api.planetRows=planetRows;

 add('ride-acceleration',[area('data','시간(s),x,y,z 가속도(m/s²)','0,0,0,9.8\n1,1,0,10.8\n2,0,0,12.8\n3,-1,0,10.8\n4,0,0,9.8'),choice('sensor','가져온 자료의 종류','raw',[['raw','중력 포함 센서 값'],['linear','기기에서 중력 성분을 제거한 값']]),choice('axis','비교할 값','z',[['x','기기 x축'],['y','기기 y축'],['z','기기 z축'],['magnitude','세 축 벡터의 크기']]),num('start','구간 시작 시각 (s)',0,0,86400,.1),num('end','구간 끝 시각 (s)',4,0,86400,.1),text('setup','놀이 기구·기기 고정 위치·축 방향·측정 구간','예시: 같은 방향으로 고정한 기기, 0~4 s (가상자료)'),text('provenance','자료 출처·측정 날짜','연습용 가상자료')],[
  '놀이 기구·고정 위치·측정할 축을 정하고, 센서 앱의 중력 포함 여부를 확인하여 자료와 출처를 입력합니다.',
  '높은 곳·낮은 곳 등 운동 장면의 시각을 기록해 구간을 정합니다. 기기가 회전했다면 각 축의 방향 변화도 검토합니다.',
  '축별 값과 벡터 크기, 구간의 최댓값·최솟값을 비교하고 예측과 다른 결과의 원인을 설명합니다.'
 ],s=>{
  const data=parseTable(s.data,4);if(data.some((r,i)=>r[0]<0||r[0]>86400||r.slice(1).some(a=>Math.abs(a)>1000)||(i&&r[0]<=data[i-1][0])))throw Error('시간은 0~86,400 s 안에서 중복 없이 증가해야 하며 각 가속도는 ±1,000 m/s² 이내여야 합니다.');
  if(s.start>s.end)throw Error('구간 시작 시각은 끝 시각보다 늦을 수 없습니다.');
  const value=r=>s.axis==='magnitude'?Math.hypot(...r.slice(1)):r[{x:1,y:2,z:3}[s.axis]],selected=data.filter(r=>r[0]>=s.start&&r[0]<=s.end);if(selected.length<2)throw Error('선택한 구간에 두 개 이상의 측정값이 필요합니다. 시각 범위를 확인하세요.');
  const values=selected.map(value),min=Math.min(...values),max=Math.max(...values);
  // Mean is integrated over time; an ordinary sample mean biases irregularly sampled records.
  const duration=selected.at(-1)[0]-selected[0][0],integral=selected.slice(1).reduce((sum,r,i)=>sum+(value(selected[i])+value(r))*.5*(r[0]-selected[i][0]),0),mean=integral/duration;
  return{svg:chart([{name:'전체 측정',points:data.map(r=>[r[0],value(r)]),color:'#8ba2ab'},{name:'선택 구간',points:selected.map(r=>[r[0],value(r)]),color:'#176e83'}],'시간 (s)','가속도 (m/s²)'),summary:`${selected.length}개 측정, 실제 포함 구간 ${f(selected[0][0])}~${f(selected.at(-1)[0])} s. 최솟값 ${f(min)}, 최댓값 ${f(max)}, 시간 가중 평균 ${f(mean)} m/s².`,headers:['시각 (s)','x','y','z','벡터 크기 (m/s²)'],rows:selected.map(r=>[...r.map(x=>f(x)),f(Math.hypot(...r.slice(1)))]),note:(s.sensor==='raw'?'중력 포함 센서 값을 그대로 표시합니다. 이 값을 그대로 운동의 가속도나 알짜힘으로 해석하지 않습니다. ':'기기가 계산한 중력 제거 값을 표시합니다. 필터·보정과 측정 오차를 확인하세요. ')+'기기가 회전하면 기기 축도 변하므로 한 축의 값만으로 운동 방향을 단정하지 않습니다. 벡터 크기에는 방향 정보가 없습니다. 구간 양끝 사이의 측정값만 사용하고 경계 바깥을 추정하지 않습니다. 평균은 측정 사이를 직선으로 이은 시간 가중값입니다.',min,max,mean,selected:s.axis,count:selected.length};
 });
 if(typeof module!=='undefined')module.exports=api;
})();
