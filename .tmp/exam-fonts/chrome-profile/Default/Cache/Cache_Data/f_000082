/* Grade-specific observations. Numerical readings below are explicitly hypothetical,
   not imported measurements or a prediction of a particular real apparatus. */
(() => {
 const line=(x1,y1,x2,y2,color='#64748b',width=4)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
 const label=(text,x,y,color='#173f50',size=16)=>`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" text-anchor="middle">${text}</text>`;
 const rect=(x,y,w,h,fill)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${fill}"/>`;
 const jar=(x,height,color)=>rect(x,60,110,180,'#edf4f8')+rect(x+6,230-height,98,height,color)+line(x,55,x,235)+line(x,235,x+110,235)+line(x+110,235,x+110,55);
 const field=(key,title,items)=>({key,title,items:items.map(([value,text])=>({value,text}))});
 const steps=field('stage','관찰 시점',[['before','처음'],['after','변화 뒤']]);

 function saltSeparationScene(stage) {
  const text=(s,x,y)=>label(s,x,y,'#284651',14);
  const sand=(x,y,n=25)=>Array.from({length:n},(_,i)=>'<ellipse data-sand cx="'+(x+(i*19)%68)+'" cy="'+(y+(i*7)%16)+'" rx="'+(2+i%3)+'" ry="2" fill="'+['#a88455','#c4a479','#85765d'][i%3]+'"/>').join('');
  const salt=(x,y,n=12)=>Array.from({length:n},(_,i)=>'<path data-salt-crystal d="M'+(x+i%4*14)+' '+(y+Math.floor(i/4)*10)+' l7 -2 3 7 -8 2 Z" fill="#fffaf0" stroke="#b8b3a5" stroke-width=".8"/>').join('');
  const beaker=(x,y,w,h)=>'<path d="M'+x+' '+y+' v'+h+' q0 7 7 7 h'+(w-14)+' q7 0 7 -7 v-'+h+'" fill="#eef5f6" fill-opacity=".23" stroke="#7b9aa5" stroke-width="2"/>';
  let svg='';
  if(stage==='mixed')svg='<ellipse cx="230" cy="174" rx="143" ry="62" fill="#e5eaeb" stroke="#a2b4bb"/><ellipse cx="230" cy="165" rx="131" ry="50" fill="#fafbfa" stroke="#c4d0d4"/>'+sand(161,157,48)+salt(235,149,16)+text('모래 알갱이',144,77)+line(145,85,182,154,'#829aa1',1.5)+text('소금 알갱이',322,77)+line(314,85,273,149,'#829aa1',1.5)+text('물에 넣기 전 · 서로 다른 두 고체',230,269);
  if(stage==='dissolve')svg='<path d="M158 129 Q230 123 302 129 V244 H158 Z" fill="#c4e4eb" fill-opacity=".7"/>'+sand(192,229,34)+beaker(151,72,158,175)+'<path d="M248 47 L216 224" stroke="#8aabb5" stroke-width="5"/><path d="M245 48 L215 220" stroke="#e0ecef" stroke-width="2"/>'+text('물에 녹은 소금',353,111)+line(309,135,340,119,'#829aa1',1.5)+text('녹지 않은 모래',354,231)+line(266,241,320,236,'#829aa1',1.5)+text('저은 뒤 · 소금 알갱이는 보이지 않음',230,285);
  if(stage==='filter')svg=
   '<path d="M355 48 V277 M311 279 H398 M355 126 H301" fill="none" stroke="#81949b" stroke-width="6" stroke-linecap="round"/>'+
   '<g transform="rotate(25 108 56)">'+beaker(59,15,83,66)+'<path d="M65 68 L136 34 V78 H65 Z" fill="#b8dce7" opacity=".8"/>'+sand(68,65,15)+'</g>'+
   '<path d="M156 33 Q155 49 174 65 L220 126" fill="none" stroke="#acd5e2" stroke-width="5"/><path d="M163 49 L233 139" stroke="#7798a5" stroke-width="4"/><path d="M163 49 L233 139" stroke="#e1edf0" stroke-width="1.5"/>'+
   '<path d="M181 105 L240 173 V209 M299 105 L250 173 V209" fill="#e7f1f4" fill-opacity=".55" stroke="#7c9aa7" stroke-width="2"/>'+
   '<path data-filter-paper d="M187 103 L245 164 293 103 Q245 115 187 103 Z" fill="#fffcf0" stroke="#c6ba9f" stroke-width="1.4"/>'+
   '<path d="M215 133 L245 162 269 134 Q244 141 215 133" fill="#c6b697"/>'+sand(219,134,10)+
   '<ellipse cx="241" cy="106" rx="59" ry="9" fill="none" stroke="#8aa3ac" stroke-width="1.7"/>'+
   '<path data-filtrate d="M232 244 H314 V266 H232 Z" fill="#b8dfea" fill-opacity=".8"/>'+beaker(227,205,92,63)+
   '<path data-filtrate-flow d="M245 210 V239" fill="none" stroke="#71b2c9" stroke-width="3" stroke-dasharray="4 5"/>'+
   text('유리 막대',249,44)+line(226,49,190,82,'#829aa1',1.5)+
   text('거름종이',371,94)+line(326,97,285,111,'#829aa1',1.5)+
   text('남은 모래',104,161)+line(148,158,224,144,'#829aa1',1.5)+
   text('깔때기',117,204)+line(152,199,239,177,'#829aa1',1.5)+
   text('거른 소금물',274,299);
  if(stage==='evaporate')svg=
   '<rect x="137" y="210" width="186" height="49" rx="9" fill="#d6dfe1" stroke="#7c929a"/><rect x="151" y="201" width="158" height="13" rx="6" fill="#747f85"/><circle cx="292" cy="238" r="8" fill="#74878e"/><circle cx="164" cy="238" r="3" fill="#d97943"/>'+
   '<path d="M125 163 Q145 213 230 207 Q315 213 335 163" fill="#f0f1ed" stroke="#94a2a2" stroke-width="2"/><ellipse cx="230" cy="162" rx="105" ry="25" fill="#fffef5" stroke="#a6b1ad" stroke-width="2"/>'+salt(204,149,12)+
   '<path d="M174 119 v-42 m-5 6 5 -6 5 6 M231 104 V57 m-5 6 5 -6 5 6 M286 119 V77 m-5 6 5 -6 5 6" fill="none" stroke="#7398a5" stroke-width="2" stroke-dasharray="4 4"/>'+
   text('물이 수증기가 되어 나감',230,35)+text('증발 접시에 남은 소금',230,286);
  return '<g data-observation-scene="salt-separation" data-stage="'+stage+'">'+svg+'</g>';
 }

 const specs={
  'state-change':{
   title:'물이 얼고 다시 녹을 때',codes:['4과10-02'],initial:{phase:'water'},
   fields:[field('phase','물의 상태',[['water','물'],['ice','얼음'],['again','다시 녹인 물']])],
   view(s){const ice=s.phase==='ice';return{svg:jar(175,ice?145:130,ice?'#bfdaf3':'#69b9e4')+line(168,100,290,100,'#d97706',2)+label('처음 물기둥 높이',340,105,'#9b5411',13)+label(ice?'높이가 높아짐':'처음과 같은 높이',230,35)+label('전체 무게: 100 g (모형)',230,270),text:ice?'물이 얼면 물기둥의 높이가 높아져 부피가 늘어납니다. 밖으로 새거나 증발하지 않았다면 전체 무게는 같습니다.':s.phase==='water'?'처음 물의 부피와 전체 무게를 기록합니다. 얼린 뒤, 다시 녹인 뒤와 비교합니다.':'얼음이 녹으면 물기둥의 높이가 낮아져 부피가 줄어듭니다. 다시 녹인 뒤에는 처음 물의 부피로 돌아오며 전체 무게는 같습니다.',note:'물은 얼 때 팽창하므로 밀폐한 유리 용기를 얼리지 마세요.'};}
  },
  gases:{
   title:'같은 부피의 용기에서 공기의 무게 비교',codes:['4과15-01'],initial:{air:'same'},
   fields:[field('air','공기의 양',[['same','공기를 넣고 빼기 전'],['more','공기를 더 넣은 뒤'],['less','공기를 조금 뺀 뒤']])],
   view(s){const mass={same:500,more:501,less:499}[s.air];return{svg:rect(180,55,100,130,'#aacfe1')+rect(195,38,70,20,'#64748b')+rect(145,205,170,45,'#334155')+rect(179,214,102,26,'#d1fae5')+label(mass+' g',230,233)+label('용기의 부피는 같음',230,285),text:s.air==='same'?'용기와 공기를 함께 저울에 올려 처음 무게를 기록합니다.':s.air==='more'?'같은 부피의 용기에 공기를 더 넣으면 전체 무게가 늘어납니다. 공기도 무게가 있음을 알 수 있습니다.':'같은 부피의 용기에서 공기를 빼면 전체 무게가 줄어듭니다. 용기 자체의 무게와 부피는 변하지 않는 조건입니다.',note:''};}
  },
  'mixture-separation':{
   title:'액체 혼합물 분리와 소금 회수',codes:['6과05-01','6과05-02'],initial:{kind:'oil',stage:'mixed'},
   fields:s=>[field('kind','혼합물',[['oil','물과 기름'],['salt','소금과 모래']]),field('stage','분리 과정',s.kind==='oil'?[['mixed','흔든 직후'],['settle','가만히 두기'],['drain','아래층 물을 받아 분리']]:[['mixed','처음'],['dissolve','물에 넣기'],['filter','거르기'],['evaporate','거른 소금물의 물을 증발']])],
   view(s){if(s.kind==='oil'){const drained=s.stage==='drain',mixed=s.stage==='mixed';return{svg:jar(80,drained?50:130,drained?'#f8d16d':mixed?'#a3c5a8':'#72bce6')+(!mixed&&!drained?rect(86,100,98,50,'#f8d16d'):'')+(drained?jar(280,80,'#72bce6'):label('받을 용기',335,180))+label(mixed?'흔든 직후':'기름이 위, 물이 아래',135,35),text:mixed?'흔들면 물과 기름이 잠시 흩어져 섞여 보입니다. 가만히 두고 관찰합니다.':drained?'아래층 물을 먼저 받아 내고, 두 층의 경계에서 멈추면 물과 기름을 나눌 수 있습니다.':'가만히 두면 물과 기름이 골고루 섞이지 않고 두 층으로 나뉩니다. 이 성질을 이용해 분리합니다.',note:''};}
    const svg=saltSeparationScene(s.stage);
    return{svg,text:{mixed:'소금과 모래는 서로 섞여도 각각의 성질이 남아 있습니다.',dissolve:'소금은 물에 녹고 모래는 녹지 않습니다. 물에 녹는 성질의 차이를 이용합니다.',filter:'거름종이에는 모래가 남고 소금물은 통과합니다. 소금은 아직 물에 녹아 있으므로 소금 회수가 끝난 것이 아닙니다.',evaporate:'거른 소금물에서 물을 증발시키면 소금이 남습니다. 용해 → 거르기 → 증발 순서로 두 고체를 회수합니다.'}[s.stage]||'물에 녹는 성질의 차이를 이용합니다.',note:'증발과 가열 실험은 교사의 지도 아래 진행하세요.'};}
  },
  'heat-transfer':{
   title:'접촉·대류·복사와 단열',codes:['6과07-02','6과07-03','6과07-04'],initial:{kind:'contact',stage:'before',hot:'80',cold:'20'},
   fields:s=>[field('kind','관찰할 현상',[['contact','두 물체의 접촉'],['convection','물의 대류'],['radiation','빛에 의한 열 이동'],['insulation','단열 비교']]),steps,...(s.kind==='contact'?[field('hot','따뜻한 물의 처음 온도',[['60','60 ℃'],['80','80 ℃']]),field('cold','차가운 물의 처음 온도',[['20','20 ℃'],['40','40 ℃']])]:[])],
   view(s){const after=s.stage==='after';if(s.kind==='contact'){const mean=(+s.hot + +s.cold)/2;return{svg:jar(75,120,'#f7a78e')+jar(280,120,'#82bce4')+label((after?mean:s.hot)+' ℃',130,35)+label((after?mean:s.cold)+' ℃',335,35)+line(185,180,280,180,'#64748b',6)+label(after?'충분한 시간 뒤 같은 온도':'접촉하여 열이 이동',230,265),text:after?'따뜻한 물의 온도는 내려가고 차가운 물의 온도는 올라갑니다. 열이 온도가 높은 쪽에서 낮은 쪽으로 이동하기 때문입니다.':'온도가 다른 두 물체의 처음 온도를 기록한 뒤 접촉시킵니다.',note:'같은 양의 물과 같은 용기를 사용하며, 주변으로 열이 빠져나가지 않는 조건입니다.'};}
    if(s.kind==='convection')return{svg:jar(175,150,'#9bceeb')+rect(190,247,80,12,after?'#ef8b44':'#9ca3af')+(after?label('↑',205,150,'#c94d29',48)+label('↓',255,150,'#3577a2',48):label('가열 전',230,35)),text:after?'아래쪽에서 데워진 물이 올라가고 다른 쪽 물이 내려오며 물이 움직여 열을 옮깁니다. 이런 열 이동을 대류라고 합니다.':'물의 아래쪽을 가열하기 전과 후를 비교합니다. 색과 화살표는 물의 움직임을 보기 쉽게 한 표시입니다.',note:''};
    if(s.kind==='radiation')return{svg:'<circle cx="85" cy="130" r="35" fill="'+(after?'#fbbf24':'#cbd5e1')+'"/>'+rect(295,95,70,80,'#4b5563')+(after?[110,130,150].map(y=>line(128,y,282,y,'#d97706',3)).join(''):'')+label(after?'빛을 비춤':'빛을 비추기 전',100,215)+label(after?'온도가 올라감':'처음 온도',330,215),text:after?'빛을 받은 물체의 온도가 올라갈 수 있습니다. 빛을 통해 열이 이동하는 것을 복사라고 합니다.':'빛을 비추기 전의 물체 온도를 기록하고, 빛을 받은 뒤와 비교합니다.',note:'강한 광원을 직접 바라보지 마세요.'};
    return{svg:jar(75,110,'#f5b58f')+jar(280,110,'#f5b58f')+rect(65,170,130,65,'#c9b99d')+label('단열재로 감쌈',130,35)+label('감싸지 않음',335,35)+label(after?'더 따뜻하게 유지':'같은 처음 온도',130,275)+label(after?'더 빨리 식음':'같은 처음 온도',335,275),text:after?'다른 조건을 같게 하면 단열재로 감싼 용기는 주변과의 열 이동이 줄어 더 오래 따뜻하게 유지될 수 있습니다.':'같은 물의 양과 처음 온도, 같은 용기를 사용하고 단열재 유무만 다르게 합니다.',note:'단열재는 열 이동을 줄여 줍니다. 열 이동을 완전히 막지는 못합니다.'};}
  },
  'light-shadow':{
   title:'빛의 반사와 굴절 관찰',codes:['6과02-02'],initial:{kind:'mirror',setting:'one'},
   fields:s=>[field('kind','관찰 도구',[['mirror','거울'],['water','공기와 물']]),field('setting','조건',s.kind==='mirror'?[['one','거울 방향 1'],['two','거울 방향 2']]:[['one','물이 없음'],['two','물이 있음']])],
   view(s){if(s.kind==='mirror'){const up=s.setting==='one';return{svg:line(25,140,220,140,'#e49b14',5)+line(220,140,220,up?30:260,'#e49b14',5)+line(185,up?175:105,255,up?105:175,'#64748b',9)+label('거울',300,145)+label('빛 →',75,110),text:'빛이 거울에 부딪힌 뒤 방향을 바꾸어 나아갑니다. 거울의 방향을 바꾸면 반사된 빛이 나아가는 방향도 바뀝니다.',note:''};}
    const water=s.setting==='two';return{svg:rect(40,130,380,130,water?'#bfdef1':'#edf4f8')+line(90,30,220,130,'#e49b14',5)+line(220,130,water?260:389,260,'#e49b14',5)+label(water?'물':'공기',365,230),text:water?'빛이 공기에서 물로 들어갈 때 경계에서 꺾여 나아갑니다. 이런 현상을 굴절이라고 합니다.':'같은 공기 속에서는 빛이 곧게 나아갑니다. 물을 넣었을 때와 경로를 비교합니다.',note:''};}
  },
  photosynthesis:{
   title:'빛과 녹말 검출·광합성 산물의 이용',codes:['9과12-01','9과12-02','9과12-03'],initial:{light:'half',stage:'before'},
   fields:[field('light','빛을 받은 부분',[['all','잎 전체'],['half','잎 절반만'],['none','빛을 받지 않음']]),field('stage','아이오딘 반응 관찰',[['before','처리 전'],['after','준비된 잎의 반응 확인']])],
   view(s){const tested=s.stage==='after',left=tested?(s.light==='none'?'#c8a46e':'#293e68'):'#7dab64',right=tested?(s.light==='all'?'#293e68':'#c8a46e'):'#7dab64';return{svg:'<defs><clipPath id="starchLeaf"><ellipse cx="230" cy="145" rx="85" ry="110"/></clipPath></defs><g clip-path="url(#starchLeaf)">'+rect(135,25,95,240,left)+rect(230,25,95,240,right)+'</g>'+line(230,45,230,260,'#607550',3)+label(tested?'청람색 부분: 녹말 검출':'빛을 가린 부분과 받은 부분 비교',230,285),text:tested?'빛을 받아 녹말이 만들어진 부분은 아이오딘 용액과 반응하여 청람색을 띱니다. 가린 부분과 비교하여 빛의 필요성을 알아봅니다.':'먼저 잎에 남아 있던 녹말을 없앤 식물을 사용하며, 물·이산화 탄소를 충분히 공급하고 빛 이외의 조건은 같게 합니다. 필요한 전처리를 마친 잎의 반응을 비교하는 모형입니다.',note:'교사가 준비한 잎을 사용하고 알코올을 직접 가열하지 마세요. 식물은 낮과 밤 모두 호흡합니다.'};}
  },
  'living-environment':{
   title:'한 줄 먹이사슬을 먹이그물로 연결하기',codes:['4과14-02'],initial:{missing:'none'},
   fields:[field('missing','모형에서 줄어든 생물',[['none','모두 있음'],['rabbit','토끼가 줄어듦'],['mouse','쥐가 줄어듦']])],
   view(s){const nodes={grass:[70,240,'풀'],seed:[360,240,'씨앗'],rabbit:[65,135,'토끼'],mouse:[225,135,'쥐'],bird:[375,135,'새'],fox:[110,40,'여우'],hawk:[345,40,'매']};const links=[['grass','rabbit'],['grass','mouse'],['seed','mouse'],['seed','bird'],['rabbit','fox'],['mouse','fox'],['mouse','hawk'],['bird','hawk']];let svg='<defs><marker id="foodArrow" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#628174"/></marker></defs>';for(const [from,to]of links){if([from,to].includes(s.missing))continue;const a=nodes[from],b=nodes[to];svg+=`<line x1="${a[0]}" y1="${a[1]-15}" x2="${b[0]}" y2="${b[1]+18}" stroke="#628174" stroke-width="2" marker-end="url(#foodArrow)"/>`;}for(const [key,[x,y,name]]of Object.entries(nodes))svg+=rect(x-32,y-17,64,32,key===s.missing?'#e5e7eb':'#d6e8cf')+label(name,x,y+5,key===s.missing?'#9ca3af':'#173f50');return{svg,text:s.missing==='none'?'한 생물은 여러 먹이를 먹거나 여러 생물에게 먹힐 수 있습니다. 여러 먹이사슬이 서로 연결되면 먹이그물이 됩니다.':s.missing==='rabbit'?'토끼가 줄어도 여우는 쥐를 먹을 수 있습니다. 먹이 관계가 여러 갈래이면 다른 먹이를 이용할 가능성이 있습니다.':'쥐가 줄면 여우와 매의 먹이 관계에 영향을 줍니다. 여우에게는 토끼, 매에게는 새와의 관계가 남아 있습니다.',note:'화살표는 먹이가 되는 생물에서 먹는 생물로 향합니다.'};}
  },
  'acid-base':{
   title:'산성 용액과 염기성 용액을 섞을 때',codes:['6과09-02'],initial:{drops:'0'},
   fields:[field('drops','지시약을 넣은 산성 용액에 염기성 용액 더하기',[['0','더하기 전'],['2','조금 더함'],['4','더 더함'],['6','충분히 더함']])],
   view(s){const colors={'0':'#e6798d','2':'#c58cb9','4':'#a992ca','6':'#72a9cc'};return{svg:jar(175,110+(+s.drops)*5,colors[s.drops])+label('지시약의 색 관찰',230,35),text:'산성 용액에 염기성 용액을 더하면 지시약의 색이 달라질 수 있습니다. 섞기 전과 후의 색을 기록하여 용액의 성질이 변했음을 추리합니다.',note:'지시약의 색은 용액의 종류와 진하기에 따라 달라집니다. 용액을 맛보거나 손으로 만지지 마세요.'};}
  }
 };
 Object.assign(specs,window.scienceSupplementExtensions?.({line,label,rect,jar,field})||{});
 Object.assign(specs,window.scienceCoreExtensions?.({line,label,rect,jar,field},specs)||{});
 const path=location.pathname.split('/').filter(Boolean);const slug=path.at(-1)==='index.html'?path.at(-2):path.at(-1),spec=specs[slug];
 if(!spec)return;
 const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('supplement-labs.css?v=5',document.currentScript.src);document.head.append(css);
 const assetBase=new URL('.',document.currentScript.src);
 const section=document.createElement('section');section.className='panel curriculum-supplement';section.setAttribute('aria-label',spec.title);
 const h=document.createElement('h2');h.textContent=spec.title;const controls=document.createElement('div');controls.className='supplement-controls';
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 460 310');svg.setAttribute('role','img');svg.setAttribute('aria-label',spec.title+' 관찰 모형');
 const observation=document.createElement('p');observation.className='supplement-observation';observation.setAttribute('aria-live','polite');
 const note=document.createElement('p');note.className='supplement-guidance';
 const reset=document.createElement('button');reset.type='button';reset.className='supplement-reset';reset.textContent='이 탐구 처음으로';
 const checkpoint=document.createElement('div');checkpoint.className='supplement-check';checkpoint.setAttribute('aria-label','관찰 확인 문제');
 const body=document.createElement('div');body.className='supplement-body';
 const visual=document.createElement('div');visual.className='supplement-visual';visual.append(svg);
 const reading=document.createElement('div');reading.className='supplement-reading';
 const observationHeading=document.createElement('h3');observationHeading.textContent='관찰해 보세요';
 reading.append(observationHeading,observation,note,checkpoint);body.append(visual,reading);
 const sources=document.createElement('details');sources.className='supplement-sources';
 const sourceTitle=document.createElement('summary');sourceTitle.textContent='사진 정보';sources.append(sourceTitle);
 section.append(h,controls,body,sources,reset);const anchor=document.querySelector('.meaning-panel,.interpretation,.quiz-section');if(anchor)anchor.before(section);else document.querySelector('main').append(section);
 let state={...spec.initial};
 function render(){
  const fields=typeof spec.fields==='function'?spec.fields(state):spec.fields;
  for(const f of fields)if(!f.items.some(o=>o.value===state[f.key]))state[f.key]=f.items[0].value;
  controls.replaceChildren();for(const f of fields){const set=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent=f.title;set.append(legend);for(const o of f.items){const b=document.createElement('button');b.type='button';b.textContent=o.text;b.dataset.supplementChoice=f.key;b.dataset.value=o.value;b.setAttribute('aria-pressed',String(state[f.key]===o.value));b.addEventListener('click',()=>{state[f.key]=o.value;render();controls.querySelector(`[data-supplement-choice="${f.key}"][data-value="${o.value}"]`)?.focus({preventScroll:true});});set.append(b);}controls.append(set);}
  const result=spec.view(state);visual.replaceChildren();sources.replaceChildren(sourceTitle);sources.hidden=!result.media;
  section.classList.toggle('has-specimen-photos',Boolean(result.media));
  if(result.media){
   const gallery=document.createElement('div');gallery.className='supplement-specimens';gallery.dataset.count=String(result.media.items.length);
   for(const item of result.media.items){
    const figure=document.createElement('figure'),title=document.createElement('h3');title.textContent=item.name;
    const frame=document.createElement('div');frame.className='supplement-photo-frame';frame.classList.toggle('is-enlarged',result.media.enlarged);
    const img=document.createElement('img');img.src=new URL(item.src,assetBase);img.alt=item.alt;img.decoding='async';if(item.origin)img.style.transformOrigin=item.origin;if(result.media.zoom)img.style.setProperty('--specimen-zoom',String(result.media.zoom));frame.append(img);
    const failure=document.createElement('p');failure.className='supplement-photo-error';failure.textContent='사진을 불러오지 못했습니다. 잠시 후 다시 열어 주세요.';failure.hidden=true;frame.append(failure);
    img.addEventListener('error',()=>{img.hidden=true;failure.hidden=false;});
    const caption=document.createElement('figcaption');caption.textContent=item.caption;
    figure.append(title,frame,caption);gallery.append(figure);
    const credit=document.createElement('p'),link=document.createElement('a');link.href=item.source;link.target='_blank';link.rel='noopener';link.textContent=item.name+' · '+item.author+(item.collection===undefined?' / GeoDIL':item.collection?' / '+item.collection:'');
    const license=document.createElement('a');license.href=item.licenseUrl||'https://creativecommons.org/publicdomain/zero/1.0/';license.target='_blank';license.rel='noopener';license.textContent=item.license||'CC0';credit.append(link,' · ',license);sources.append(credit);
   }
   const mode=document.createElement('p');mode.className='supplement-photo-mode';mode.textContent=result.media.modeLabel||(result.media.enlarged?'실제 표본 사진 · 부분 확대':'실제 표본 사진 · 전체 보기');
   visual.append(gallery,mode);
   const photoInfo=document.createElement('p');photoInfo.textContent=result.media.info||'두 표본의 실제 크기 비율과 화면의 크기는 다릅니다. 확대는 사진의 일부를 크게 보여 줍니다. 숫자와 색칠한 부분은 표본 관리 표시입니다.';sources.append(photoInfo);
  }else{svg.innerHTML=result.svg;visual.append(svg);}
  observation.textContent=result.text;note.textContent=result.note;note.hidden=!result.note;
  checkpoint.replaceChildren();if(result.check){const q=result.check;const heading=document.createElement('h3');heading.textContent=q.question;const feedback=document.createElement('p');feedback.className='supplement-check-feedback';feedback.setAttribute('aria-live','polite');checkpoint.append(heading);q.choices.forEach((choice,i)=>{const button=document.createElement('button');button.type='button';button.dataset.checkAnswer=String(i);button.textContent=choice;button.setAttribute('aria-pressed','false');button.addEventListener('click',()=>{const correct=String(i)===q.answer;
    button.setAttribute('aria-pressed','true');button.dataset.correct=String(correct);button.disabled=true;
    if(correct){checkpoint.querySelectorAll('button').forEach(b=>{b.disabled=true;});feedback.textContent='정답입니다. '+q.why;}
    else{feedback.textContent='다시 관찰하고 다른 답을 골라 보세요.';}
    feedback.dataset.correct=String(correct);});checkpoint.append(button);});checkpoint.append(feedback);}
  checkpoint.hidden=!result.check;
 }
 reset.addEventListener('click',()=>{state={...spec.initial};render();});render();
 window.__scienceSupplement={slug,codes:spec.codes,getState:()=>({...state})};
})();
