
/* Process drawings: features are explicit; textures are illustrative, not measurements. */
function scienceRockProcess(process) {
 const text=(s,x,y)=>'<text x="'+x+'" y="'+y+'" text-anchor="middle" fill="#284651" font-size="14">'+s+'</text>';
 const arrow=(x,y)=>'<path d="M'+x+' '+y+' h22 m-7 -5 7 5 -7 5" fill="none" stroke="#5f8189" stroke-width="2.5"/>';
 const shape='M8 34 L28 12 84 8 112 28 117 97 98 118 29 121 6 102 Z';
 const grains=Array.from({length:42},(_,i)=>{const x=(i%7)*19-8+(Math.floor(i/7)%2)*8,y=Math.floor(i/7)*23-2;
  return '<path d="M'+x+' '+y+' l18 -3 7 13 -10 14 -17 -6 Z" fill="'+['#d9c8b2','#a89e94','#eee6d8','#606969','#c6b2a0'][i%5]+'" stroke="#7b7b70" stroke-width=".7"/>';}).join('');
 const layers=Array.from({length:6},(_,i)=>'<path d="M0 '+(i*24)+' Q45 '+(i*24-15)+' 70 '+(i*24+1)+' T130 '+(i*24-4)+' v15 Q77 '+(i*24+27)+' 40 '+(i*24+10)+' T0 '+(i*24+15)+' Z" fill="'+['#d9d5c7','#696f70','#b8a294'][i%3]+'"/>').join('');
 const sand=Array.from({length:80},(_,i)=>'<ellipse cx="'+(8+(i*31)%112)+'" cy="'+(30+(i*47)%90)+'" rx="'+(2+i%3)+'" ry="2" fill="'+['#ac8460','#d4b98a','#89785d'][i%3]+'"/>').join('');
 const rock=(x,kind,id)=>'<g transform="translate('+x+' 78)'+(kind==='compacted'?' scale(1 .76)':'')+'"><defs><clipPath id="rockProcess'+id+'"><path d="'+shape+'"/></clipPath></defs><path d="'+shape+'" fill="#b9aa92"/><g clip-path="url(#rockProcess'+id+')">'+(kind==='bands'?layers:kind==='transition'?grains+'<g opacity=".55">'+layers+'</g>':kind==='compacted'?'<path d="M0 25 H130 M0 65 H130 M0 105 H130" stroke="#a88e70" stroke-width="18" opacity=".45"/>'+sand:kind==='sand'?sand:grains)+'</g><path d="'+shape+'" fill="none" stroke="#777c75" stroke-width="1.6"/></g>';
 const magma=x=>'<g transform="translate('+x+' 78)"><path d="'+shape+'" fill="url(#rockMagma)" stroke="#a84d36" stroke-width="1.5"/><path d="M18 78 Q28 30 68 62 T104 34 M24 101 Q65 75 101 94" fill="none" stroke="#ffd784" stroke-width="5" opacity=".7"/></g>';
 let svg='<defs><linearGradient id="rockMagma" x2=".6" y2="1"><stop stop-color="#ffcc6b"/><stop offset=".55" stop-color="#e88b49"/><stop offset="1" stop-color="#ba4f38"/></linearGradient></defs>'+text('처음',77,38)+text('변화 과정',230,38)+text('변화 뒤',383,38)+arrow(139,146)+arrow(294,146);
 if(process==='cool') svg+=magma(15)+magma(168)+'<g fill="#d9d0c0" stroke="#8b796e">'+[[195,122],[239,161],[262,112]].map(([x,y])=>'<path d="M'+x+' '+y+' l10 -7 9 12 -7 12 -13 -5 Z"/>').join('')+'</g>'+rock(321,'grain','cool')+text('마그마',77,231)+text('식으면서 결정이 생김',230,231)+text('굳은 화성암',383,231)+text('알갱이가 맞물린 내부를 확대한 모형',230,282);
 if(process==='deposit')svg+='<g transform="translate(15 78)"><path d="'+shape+'" fill="#e6f1f3"/>'+sand+'</g>'+rock(168,'sand','loose')+'<path d="M230 62 v27 m-5 -6 5 6 5 -6 M230 216 v-24 m-5 6 5 -6 5 6" fill="none" stroke="#876950" stroke-width="3"/>'+rock(321,'compacted','cement')+text('운반되어 쌓인 퇴적물',77,231)+text('눌리고 서로 붙음',230,231)+text('굳은 퇴적암',383,231)+text('알갱이 사이가 치밀해지고 굳는 과정',230,282);
 if(process==='change')svg+=rock(15,'grain','old')+rock(168,'transition','changing')+rock(321,'bands','changed')+'<g fill="none" stroke="#b66947" stroke-width="2.5"><path d="M230 57 v30 m-6 -7 6 7 6 -7 M230 218 v-23 m-6 7 6 -7 6 7"/></g>'+text('이미 있던 암석',77,231)+text('열과 압력 · 녹지 않음',230,231)+text('성질이 바뀐 변성암',383,231)+text('줄무늬가 나타나는 예 · 모든 변성암이 같지는 않음',230,282);
 if(process==='melt')svg+=rock(15,'grain','solid')+magma(168)+'<path d="M198 108 l38 -10 18 31 -35 28 -24 -16 Z" fill="#9a9589" stroke="#6c7370"/>'+magma(321)+text('고체 암석',77,231)+text('녹기 시작한 암석',230,231)+text('마그마',383,231)+text('녹음은 고체 상태의 변성과 다름',230,282);
 return '<g data-observation-scene="rock-process" data-process="'+process+'">'+svg+'</g>';
}

function scienceStemWater(after) {
 const label=(t,x,y)=>'<text x="'+x+'" y="'+y+'" text-anchor="middle" fill="#284651" font-size="14">'+t+'</text>';
 const vessels=Array.from({length:9},(_,i)=>{const a=i*Math.PI*2/9,x=332+44*Math.cos(a),y=139+42*Math.sin(a);return '<ellipse data-vessel cx="'+x+'" cy="'+y+'" rx="5" ry="7" fill="'+(after?'#c84d66':'#82a574')+'"/>';}).join('');
 return '<g data-observation-scene="stem-water" data-stained="'+after+'"><defs><linearGradient id="stemGreen"><stop stop-color="#75924f"/><stop offset=".45" stop-color="#d1df9c"/><stop offset="1" stop-color="#789a51"/></linearGradient></defs>'+
 '<path d="M119 238 Q115 169 123 57 L145 57 Q137 171 141 238 Z" fill="url(#stemGreen)" stroke="#6b8c51" stroke-width="1.5"/>'+
 '<path d="M128 110 Q73 109 68 70 Q110 65 129 101 M138 84 Q169 38 203 54 Q195 88 138 93" fill="#7faa62" stroke="#4e8154" stroke-width="1.5"/>'+
 '<path d="M126 106 L82 82 M139 86 L189 60" stroke="#d2dda0" fill="none" stroke-width="1.5"/>'+
 (after?'<path data-stain-track d="M126 232 Q122 164 130 68 M135 232 Q130 170 137 69" stroke="#c84d66" stroke-width="3" fill="none"/>':'')+
 '<path d="M78 182 Q131 177 182 182 V250 H78 Z" fill="#e9b5bf" fill-opacity=".65"/><path d="M72 151 V252 Q72 259 80 259 H180 Q188 259 188 252 V151 M72 158 h116" fill="none" stroke="#72909b" stroke-width="2"/>'+
 '<path d="M81 167 v72" stroke="white" stroke-width="4" opacity=".7"/>'+
 '<path d="M147 122 L245 90" stroke="#819ba3" stroke-dasharray="4 4" fill="none"/>'+
 '<ellipse cx="332" cy="139" rx="71" ry="67" fill="#e7edc4" stroke="#6d8d58" stroke-width="5"/><ellipse cx="332" cy="139" rx="56" ry="52" fill="#f5f5de" stroke="#b1c487"/>'+vessels+
 label('색소 물에 꽂은 줄기',130,286)+label('가로로 자른 면 · 확대',332,39)+label(after?'일부 통로만 붉게 물듦':'아직 붉게 물들지 않음',332,240)+
 '</g>';
}

function scienceDewScene() {
 const leaf='M61 217 Q101 55 383 65 Q386 254 129 260 Z';
 const drops=[[124,178,10],[161,133,7],[189,199,13],[231,119,9],[263,171,12],[316,116,11],[292,211,7],[154,228,6],[345,166,7],[204,157,5]];
 return '<g data-observation-scene="dew"><defs><linearGradient id="dewLeaf" x2=".8" y2="1"><stop stop-color="#b4ca78"/><stop offset=".55" stop-color="#739b50"/><stop offset="1" stop-color="#486e3b"/></linearGradient><radialGradient id="dewDrop" cx=".32" cy=".25" r=".8"><stop stop-color="#f7ffff" stop-opacity=".95"/><stop offset=".32" stop-color="#d6f3e5" stop-opacity=".75"/><stop offset=".8" stop-color="#749f87" stop-opacity=".35"/><stop offset="1" stop-color="#e4faf1" stop-opacity=".9"/></radialGradient><clipPath id="dewSurface"><path d="'+leaf+'"/></clipPath></defs>'+
 '<path d="'+leaf+'" fill="url(#dewLeaf)" stroke="#5a7d48" stroke-width="2"/><g clip-path="url(#dewSurface)"><path d="M46 270 L368 82 M133 229 L114 151 M180 199 L170 112 M232 161 L230 88 M281 128 L291 77 M150 217 L230 240 M205 181 L288 212 M258 145 L343 175" fill="none" stroke="#d6df9d" stroke-width="2" opacity=".7"/>'+
 drops.map(([x,y,r])=>'<g data-surface-drop><ellipse cx="'+(x+1)+'" cy="'+(y+4)+'" rx="'+r+'" ry="'+(r*.75)+'" fill="#284f38" opacity=".25"/><circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="url(#dewDrop)" stroke="#d5f3e7" stroke-width="1"/><ellipse cx="'+(x-r*.3)+'" cy="'+(y-r*.4)+'" rx="'+(r*.28)+'" ry="'+(r*.16)+'" fill="white" opacity=".95"/></g>').join('')+
 '</g><text x="230" y="28" text-anchor="middle" fill="#284651" font-size="14">차가워진 잎 표면에 맺힌 물방울</text><text x="230" y="299" text-anchor="middle" fill="#284651" font-size="14">공기 중에 떠 있거나 비처럼 떨어지는 물이 아님</text></g>';
}
/* Curriculum observations, not photographs, patient data, or real measurements. */
window.scienceSupplementExtensions=({line,label,rect,jar,field})=>({
 immune:{
  title:'항A·항B 시약으로 미지 혈액형 판정',codes:['12생과02-06'],initial:{sample:'가',stage:'before',answer:'unknown'},
  fields:[field('sample','가상 표본',[['가','표본 가'],['나','표본 나'],['다','표본 다'],['라','표본 라']]),field('stage','반응 관찰',[['before','시약 넣기 전'],['after','두 시약의 반응 확인']]),field('answer','나의 판정',[['unknown','아직 판정하지 않음'],['A','A형'],['B','B형'],['AB','AB형'],['O','O형']])],
  view(s){const type={가:'A',나:'O',다:'AB',라:'B'}[s.sample],after=s.stage==='after';let svg='';for(const [index,antigen]of ['A','B'].entries()){const x=125+index*210,clump=after&&type.includes(antigen);svg+='<circle cx="'+x+'" cy="150" r="83" fill="#fff0f0" stroke="#d4a3a3"/>'+label('항'+antigen+' 시약',x,40);for(let n=0;n<18;n++){const a=n*Math.PI*2/18,cx=clump?x+(n%3-1)*28+(Math.floor(n/3)%2)*7:x+Math.cos(a)*58,cy=clump?145+(Math.floor(n/3)-2)*10:150+Math.sin(a)*58;svg+='<circle cx="'+cx+'" cy="'+cy+'" r="7" fill="#bf454e"/>';}svg+=label(after?(clump?'응집 있음':'응집 없음'):'반응 전',x,265);}
   return{svg,text:!after?'응집 여부는 시약 반응 뒤 판정합니다. 각 표본에 항A·항B 시약을 각각 반응시켜 비교하세요.':s.answer==='unknown'?'항A에만 응집하면 A형, 항B에만 응집하면 B형, 모두 응집하면 AB형, 모두 응집하지 않으면 O형입니다. 관찰 결과로 판정해 보세요.':s.answer===type?'판정이 맞았습니다. 표본 '+s.sample+'는 '+type+'형입니다. 해당 항원과 항체 사이의 특이적 반응을 근거로 설명하세요.':'판정을 다시 확인하세요. 한 시약만 보지 말고 항A·항B의 응집 여부를 함께 비교합니다.',note:'실제 혈액은 취급하지 마세요. 수혈 가능 여부는 혈액형만으로 결정하지 않습니다.'};}
 },
 'stars-universe':{
  title:'연주 시차와 우리은하 관찰',codes:['9과15-01','9과15-02'],initial:{kind:'parallax',distance:'near',position:'left',object:'galaxy'},
  fields:s=>[field('kind','관찰 주제',[['parallax','연주 시차'],['galaxy','우리은하·성운·성단']]),...(s.kind==='parallax'?[field('distance','별까지 거리',[['near','가까운 별'],['far','더 먼 별']]),field('position','지구의 관측 위치',[['left','처음 위치'],['right','6개월 뒤 반대쪽']])]:[field('object','관찰 대상',[['galaxy','우리은하'],['nebula','성운'],['cluster','성단']])])],
  view(s){if(s.kind==='parallax'){const shift=s.distance==='near'?65:25,x=s.position==='left'?230-shift:230+shift;return{svg:rect(15,25,430,115,'#213751')+[50,115,230,340,410].map((x,i)=>label('·',x,65+(i%2)*30,'#fff',36)).join('')+label('★',x,109,'#ffd977',30)+label('먼 배경 별에 대한 겉보기 위치',230,165)+line(155,250,305,250)+label('지구  ●',s.position==='left'?155:305,230,'#287daa')+label('☀',230,235,'#c78a19',28),text:'지구가 공전하여 관측 위치가 달라지면 가까운 별은 먼 배경 별에 대해 위치가 달라 보입니다. 같은 관측 간격에서 가까운 별일수록 이 변화가 큽니다. 연주 시차는 6개월 간격 최대 각도 차이의 절반입니다.',note:'별이 움직여서가 아니라 지구의 관측 위치가 달라져 별의 위치가 달라 보입니다.'};}
   let svg='';if(s.object==='galaxy'){svg='<ellipse cx="230" cy="150" rx="195" ry="100" fill="#d6dfef"/><ellipse cx="230" cy="150" rx="60" ry="40" fill="#9dadd0"/>'+label('중심부',230,155)+label('● 태양계',337,180,'#a46b06')+label('위에서 본 원반 모형',230,285);}else if(s.object==='nebula'){svg='<path d="M80 155 Q65 30 205 75 Q335 20 378 145 Q430 245 270 220 Q110 285 80 155" fill="#bccde6" opacity=".8"/>'+label('기체와 티끌',230,155);}else{svg=Array.from({length:35},(_,i)=>label('·',230+Math.cos(i*2.4)*Math.sqrt(i)*18,150+Math.sin(i*2.4)*Math.sqrt(i)*14,'#536faa',28)).join('');}return{svg,text:s.object==='galaxy'?'우리은하는 중심부가 두드러진 원반 모양의 막대 나선 은하이며, 태양계는 중심에서 떨어진 원반에 있습니다. 원반의 지름은 대략 10만 광년 규모입니다.':s.object==='nebula'?'성운은 우주 공간에 있는 기체와 티끌이 모여 있는 것입니다. 별이 모인 성단과 구별합니다.':'성단은 별들이 무리를 이루고 있는 것입니다. 성운의 기체·티끌과 구별합니다.',note:''};}
 },
 microscope:{
  title:'식물 세포의 구조와 기관의 연결',codes:['6과11-01','6과11-02'],initial:{kind:'cell',part:'wall',stage:'before'},
  fields:s=>[field('kind','관찰 주제',[['cell','식물 세포'],['stem','줄기의 물 이동'],['leaf','잎에서 나가는 물'],['starch','잎에서 만들어진 양분']]),...(s.kind==='cell'?[field('part','구조 이름',[['wall','세포벽'],['membrane','세포막'],['nucleus','핵']])]:[field('stage','관찰 시점',[['before','처음'],['after','시간이 지난 뒤']])])],
  view(s){if(s.kind==='cell')return{svg:'<rect x="100" y="40" width="260" height="220" rx="8" fill="#eef3d7" stroke="'+(s.part==='wall'?'#c87124':'#769c60')+'" stroke-width="12"/><rect x="115" y="55" width="230" height="190" rx="8" fill="none" stroke="'+(s.part==='membrane'?'#c87124':'#86afa6')+'" stroke-width="4"/><ellipse cx="300" cy="175" rx="22" ry="27" fill="'+(s.part==='nucleus'?'#c87124':'#a99ac9')+'"/>'+label({wall:'세포벽',membrane:'세포막',nucleus:'핵'}[s.part],230,290),text:'식물은 세포로 이루어져 있습니다. 세포벽, 세포막, 핵의 위치와 이름을 구별합니다. 세포막은 세포벽 안쪽에 있습니다.',note:'실제 양파 표피의 세포막은 세포벽에 붙어 있어 따로 구별하기 어려울 수 있습니다.'};
   const after=s.stage==='after';if(s.kind==='starch')return{svg:'<ellipse cx="140" cy="150" rx="70" ry="100" fill="'+(after?'#293e68':'#82ac69')+'"/><ellipse cx="330" cy="150" rx="70" ry="100" fill="'+(after?'#b9a47b':'#82ac69')+'"/>'+label('빛을 받은 잎',140,35)+label('빛을 가린 잎',330,35),text:after?'준비된 잎에 아이오딘 용액을 떨어뜨리면 빛을 받은 잎에서 청람색 반응이 나타납니다. 잎에서 녹말이 만들어졌음을 알아봅니다.':'남아 있던 녹말을 없앤 식물에서 빛을 받은 잎과 가린 잎을 비교합니다. 물 등 빛 이외의 조건은 같게 합니다.',note:'교사가 준비한 잎을 사용하고 알코올을 직접 가열하지 마세요. 잎에서 만들어진 양분은 다른 기관으로 옮겨져 쓰이거나 저장됩니다.'};if(s.kind==='stem')return{svg:scienceStemWater(after),text:after?'색소 물에 꽂아 둔 줄기의 일부가 물들어 있습니다. 줄기가 물의 이동 통로임을 추리할 수 있습니다. 뿌리에서 흡수한 물은 줄기를 지나 잎으로 이동합니다.':'절단한 줄기를 색소 물에 꽂은 처음 모습과 시간이 지난 뒤의 모습을 비교합니다.',note:'줄기와 단면은 통로의 위치를 보여 주는 확대 모형입니다. 색소 물은 줄기 전체가 아니라 일부 통로를 물들입니다.'};
   let svg=line(230,265,230,95,'#729d5e',12)+'<ellipse cx="190" cy="140" rx="55" ry="22" fill="#83ae68"/><ellipse cx="273" cy="115" rx="55" ry="22" fill="#83ae68"/><rect x="110" y="55" width="240" height="175" rx="25" fill="#b9d6e2" fill-opacity=".25" stroke="#86aabd"/>';if(after)svg+=[130,175,220,280,325].map((x,i)=>'<circle cx="'+x+'" cy="'+(80+i%2*20)+'" r="5" fill="#71aed0"/>').join('');return{svg,text:after?'잎에서 수증기로 나간 물이 봉지 안쪽에 물방울로 맺힐 수 있습니다. 잎이 있는 가지와 없는 가지를 같은 조건에서 비교하면 잎의 역할을 추리하는 데 도움이 됩니다.':'마른 투명 봉지로 잎이 있는 가지를 감싼 처음 모습과 시간이 지난 뒤를 비교합니다.',note:'봉지는 처음에 말라 있어야 합니다. 흙에서 증발한 물이 들어가지 않도록 조건을 같게 하세요.'};}
 },
 'weather-watch':{
  title:'이슬·안개·구름과 기압에 따른 바람',codes:['6과06-02','6과06-03'],initial:{kind:'dew',direction:'right'},
  fields:s=>[field('kind','관찰 주제',[['dew','이슬'],['fog','안개'],['cloud','구름'],['wind','기압과 바람']]),...(s.kind==='wind'?[field('direction','고기압이 있는 쪽',[['right','왼쪽에 고기압'],['left','오른쪽에 고기압']])]:[])],
  view(s){if(s.kind==='wind'){const right=s.direction==='right';return{svg:label(right?'고기압':'저기압',90,135)+label(right?'저기압':'고기압',370,135)+label(right?'→':'←',230,145,'#34749b',65)+label('바람이 부는 방향',230,215),text:'이 학년에서는 공기가 고기압에서 저기압 쪽으로 이동하여 바람이 분다는 관계를 알아봅니다. 일반적으로 고기압 부근은 맑고, 저기압 부근은 구름과 비가 나타나기 쉽습니다.',note:'실제 바람은 지구의 자전과 지형에도 영향을 받습니다.'};}
   if(s.kind==='dew')return{svg:scienceDewScene(),text:'공기 중의 수증기가 차가워진 잎 표면에서 물방울로 변해 맺힌 모습입니다. 물방울은 잎 위에 붙어 있으며, 공기 중에 떠 있는 안개와 다릅니다.',note:'잎 표면과 물방울을 확대한 모형입니다.'}; const y=s.kind==='cloud'?70:205;return{svg:rect(0,255,460,45,'#c5d6b0')+(s.kind==='dew'?'<ellipse cx="230" cy="235" rx="100" ry="20" fill="#8dad74"/>':'')+Array.from({length:18},(_,i)=>'<circle cx="'+(90+i%6*55)+'" cy="'+(y+Math.floor(i/6)*14)+'" r="'+(s.kind==='dew'?4:7)+'" fill="#93bbd4"/>').join('')+label({dew:'물체 표면에 맺힘',fog:'지표 가까운 공기 중',cloud:'높은 공기 중'}[s.kind],230,35),text:'수증기가 작은 물방울로 변한 모습을 비교합니다. 이슬은 물체 표면에 맺히며, 안개는 지표 가까운 공기 중에, 구름은 높은 공기 중에 떠 있습니다. 구름에는 작은 얼음 알갱이가 포함되기도 합니다.',note:''};}
 },
 'land-sea':{
  title:'바닷물 높이의 변화와 갯벌',codes:['4과06-03'],initial:{water:'high'},
  fields:[field('water','같은 바닷가 관찰',[['high','바닷물이 높을 때'],['low','바닷물이 낮을 때']])],
  view(s){const high=s.water==='high';return{svg:rect(0,180,460,90,'#b9a081')+'<path d="M0 '+(high?'120':'210')+' H460 V270 H0 Z" fill="#86bad6" opacity=".8"/>'+line(60,80,60,270)+line(47,120,75,120)+line(47,210,75,210)+label('같은 기준 기둥',90,40)+(high?'':label('드러난 갯벌',265,180)),text:high?'밀물 때 바닷물이 들어와 높아지면 갯벌이 물에 잠깁니다. 같은 장소의 기준 기둥과 비교합니다.':'썰물 때 바닷물이 빠져나가 낮아지면 갯벌이 드러납니다. 갯벌은 여러 생물의 서식지이며 바닷가 생태계를 지키는 데 중요합니다.',note:'갯벌을 방문할 때는 물이 들어오는 시간과 현장 안전 안내를 확인하세요.'};}
 },
 'sound-vibration':{
  title:'소리의 전달과 소음 줄이기',codes:['4과07-03'],initial:{kind:'string',condition:'on'},
  fields:s=>[field('kind','관찰 상황',[['string','실 전화기'],['noise','같은 소리의 소음 줄이기']]),field('condition','비교 조건',s.kind==='string'?[['on','실을 팽팽하게'],['off','실을 느슨하게']]:[['on','창문을 닫음'],['off','창문을 열음']])],
  view(s){const on=s.condition==='on';let svg;if(s.kind==='string')svg=rect(40,110,50,70,'#cbbda9')+rect(370,110,50,70,'#cbbda9')+(on?line(90,145,370,145,'#957f65',2):'<path d="M90 145 Q230 280 370 145" fill="none" stroke="#957f65" stroke-width="2"/>')+label('말하기',65,70)+label('듣기',395,70);else svg=label('소리',85,145)+rect(205,65,25,185,on?'#a9c4d4':'#e8eef2')+label(on?'닫힌 창문':'열린 창문',230,285)+label('듣는 곳',365,145);return{svg,text:s.kind==='string'?(on?'실이 팽팽할 때 실을 통해 소리가 더 잘 전달되는 것을 관찰할 수 있습니다. 공기뿐 아니라 물체를 통해서도 소리가 전달됩니다.':'실을 느슨하게 하면 소리가 잘 전달되지 않을 수 있습니다. 말하는 크기와 컵·실의 종류를 같게 하고 비교합니다.'):(on?'창문을 닫으면 바깥 소음이 줄어들 수 있습니다. 소리의 크기 줄이기, 문 닫기, 소음원에서 멀어지기 등 상황에 맞는 방법을 고릅니다.':'같은 소리와 같은 듣는 위치에서 창문의 상태만 바꾸어 비교합니다.'),note:''};}
 },
 'rock-layers':{
  title:'화석의 특징으로 과거 환경 추리하기',codes:['6과01-03'],initial:{fossil:'shell',focus:'whole'},
  fields:[field('fossil','실제 화석 표본',[['shell','바다 조개 화석'],['leaf','나뭇잎 화석']]),field('focus','관찰 초점',[['whole','전체 보기'],['detail','특징 확대']])],

  view(s){const shell=s.fossil==='shell';const item=shell?{
   name:'바다 조개 화석',src:'assets/observations/shell-fossil.jpg',author:'Ghedoghedo',source:'https://commons.wikimedia.org/wiki/File:Amussiopecten_pasinii.JPG',alt:'암석에 남아 있는 부채 모양 조개와 방사상으로 뻗은 굴곡',caption:'사진 왼쪽의 부채 모양과 길게 뻗은 굴곡을 관찰하세요.',origin:'25% 42%'
  }:{
   name:'나뭇잎 화석',src:'assets/observations/leaf-fossil.jpg',author:'The Utahraptor (Raptor)',source:'https://commons.wikimedia.org/wiki/File:Leaf_Fossil.jpg',alt:'암석 표면에 남은 갈색 나뭇잎의 윤곽과 중앙에서 갈라지는 잎맥',caption:'잎의 윤곽 안에서 가운데 잎맥과 양옆으로 갈라지는 잎맥을 찾아보세요.',origin:'50% 48%'
  };
  Object.assign(item,{collection:'',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/'});
  return{media:{items:[item],enlarged:s.focus==='detail',zoom:1.8,info:'서로 다른 실제 화석 표본입니다. 표본의 실제 크기 비율과 화면의 크기는 다릅니다. 사진은 크기 조정·JPEG 압축을 했으며, 확대 시 화면에서 일부가 잘려 보입니다.'},text:shell?'껍데기 모양이 남은 바다 조개 화석은 이 지층이 만들어질 당시 바다 환경이었을 가능성을 뒷받침합니다. 화석이 옮겨져 쌓였을 가능성 등도 함께 살핍니다.':'잎의 모양과 잎맥이 남아 있습니다. 과거에 식물이 살았다는 증거이며, 어떤 식물인지와 다른 화석·지층 자료를 함께 보면 환경을 더 구체적으로 추리할 수 있습니다.',note:'화석 하나만으로 당시의 모든 환경을 알 수는 없습니다. 여러 자료를 함께 비교합니다.'};}
 },
 'minerals-rocks':{
  title:'암석의 생성 과정과 순환',codes:['9과09-03'],initial:{process:'cool'},
  fields:[field('process','어떤 과정이 일어났나요?',[['cool','마그마가 식음'],['deposit','퇴적물이 쌓여 굳음'],['change','높은 열과 압력을 받음'],['melt','암석이 녹음']])],
  view(s){const svg=scienceRockProcess(s.process);return{svg,text:{cool:'마그마가 식어 굳으면 화성암이 됩니다. 현무암·유문암·화강암·반려암을 생성 조건과 관련지어 비교합니다.',deposit:'퇴적물이 쌓이고 굳어 퇴적암이 됩니다. 이암·사암·역암·석회암을 관찰합니다. 지표의 암석이 부서지고 이동하여 퇴적물이 될 수 있습니다.',change:'암석이 녹지 않은 상태에서 높은 열과 압력으로 성질이 바뀌면 변성암이 됩니다. 편암·편마암·대리암·규암이 있습니다.',melt:'암석이 녹으면 마그마가 될 수 있습니다. 식음·퇴적·변성·녹음 등의 과정을 거치며 암석이 순환합니다. 반드시 정해진 한 순서만 따르는 것은 아닙니다.'}[s.process],note:'암석은 색과 무늬뿐 아니라 알갱이와 생성 과정도 함께 살펴 구분합니다.'};}
 }
});
