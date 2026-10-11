/* Apparatus drawings: apparatus, observation and explanatory models stay distinct. */
(function(root){
 'use strict';
 const ink='#243d50',muted='#52697a',blue='#287a9c',orange='#bd6337';
 const txt=(x,y,s,size=18,fill=ink,anchor='middle')=>`<text x="${x}" y="${y}" font-family="system-ui,Malgun Gothic,sans-serif" font-size="${size}" font-weight="500" text-anchor="${anchor}" fill="${fill}">${s}</text>`;
 const path=(d,stroke=ink,width=2,extra='')=>`<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
 const rect=(x,y,w,h,fill,rx=6,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
 const ellipse=(x,y,rx,ry,fill,extra='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
 const circle=(x,y,r,fill,extra='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra}/>`;
 const arrow=(x,y,u,v,color=orange,width=3)=>{const a=Math.atan2(v-y,u-x),d=9;return path(`M${x} ${y}L${u} ${v}`,color,width)+path(`M${u-d*Math.cos(a-.5)} ${v-d*Math.sin(a-.5)}L${u} ${v}L${u-d*Math.cos(a+.5)} ${v-d*Math.sin(a+.5)}`,color,width);};
 function defs(id){return `<defs><linearGradient id="${id}-metal"><stop stop-color="#687884"/><stop offset=".35" stop-color="#e3ebef"/><stop offset=".6" stop-color="#a4b4bf"/><stop offset="1" stop-color="#576a77"/></linearGradient><linearGradient id="${id}-glass"><stop stop-color="#d9eaf0" stop-opacity=".75"/><stop offset=".28" stop-color="#fff" stop-opacity=".12"/><stop offset=".8" stop-color="#f1f9fc" stop-opacity=".22"/><stop offset="1" stop-color="#accbd7" stop-opacity=".6"/></linearGradient></defs>`;}
 const bench=()=>ellipse(230,352,180,10,'#244455','opacity=".08"')+path('M20 365H440','#b4c5cd',2);
 const stand=(id,x=52)=>rect(x-29,340,95,12,'#687c8a',7)+rect(x,35,9,310,`url(#${id}-metal)`,3)+path(`M${x+4} 55H238`,'#718794',8)+rect(x-7,42,24,24,'#415969',5);
 function beaker(id,x,y,w,h,fill=.65){
  const sy=y+h*(1-fill),body=`M${x} ${y} Q${x+7} ${y+5} ${x+8} ${y+16} V${y+h-13}Q${x+8} ${y+h} ${x+22} ${y+h}H${x+w-22}Q${x+w-8} ${y+h} ${x+w-8} ${y+h-13}V${y+10}L${x+w} ${y}`;
  let out=`<path d="${body}" fill="url(#${id}-glass)" stroke="#7d9da9" stroke-width="2.5"/>`;
  if(fill>0)out+=`<path d="M${x+10} ${sy}Q${x+w/2} ${sy+9} ${x+w-10} ${sy}V${y+h-14}Q${x+w-10} ${y+h-2} ${x+w-23} ${y+h-2}H${x+23}Q${x+10} ${y+h-2} ${x+10} ${y+h-14}Z" fill="#b4dce9" fill-opacity=".5"/>`+path(`M${x+10} ${sy}Q${x+w/2} ${sy+9} ${x+w-10} ${sy}`,'#78b2c6',1.7);
  out+=path(`M${x+18} ${y+20}V${y+h-26}`,'#fff',4);
  for(let i=1;i<=4;i++)out+=path(`M${x+w-18} ${y+h-i*h/5}h-12`,'#7695a3',1.5);
  return out;
 }
 const grain=(x,y)=>`<path d="M${x} ${y}l6 -4 5 4 -2 6 -7 1Z" fill="#fff" stroke="#b5b7b3" stroke-width=".7"/>`;
 const grains=(x,y,n=22,w=95,h=18)=>Array.from({length:n},(_,i)=>{const a=i*2.399963229728653,d=Math.sqrt((i+.5)/n);return grain(x+w/2+Math.cos(a)*w/2*d,y+h/2+Math.sin(a)*h/2*d);}).join('');
 const leaf=(x,y,flip=1,color='#548f61')=>`<g transform="translate(${x},${y}) scale(${flip},1)"><path d="M0 0Q-39 -51 -63 -26Q-60 8 0 0Z" fill="${color}" stroke="#35684b" stroke-width="1.5"/>${path('M0 0L-47 -24 M-22 -11l-11 -20 M-34 -17l-17 3','#b4d8b4',1)}</g>`;
 const legend=items=>'<ul class="apparatus-legend">'+items.map(([name,meaning])=>`<li><strong>${name}</strong><span>${meaning}</span></li>`).join('')+'</ul>';
 function frame(id,svg,caption,items=[],detail=''){return{svg:defs(id)+svg,viewBox:'0 0 460 390',caption,detail:detail||legend(items)};}
 function conductivity(s,v){
  const id='conductivity',sample=s.sample,liquid=!sample.endsWith('solid'),salt=sample.startsWith('salt'),water=sample==='water',down=s.probe==='immersed',on=v.metrics.conducts;
  const name={'water':'증류수','salt-solid':'고체 염화 나트륨','salt-solution':'염화 나트륨 수용액','sugar-solid':'고체 설탕','sugar-solution':'설탕 수용액'}[sample];
  let svg=defs(id)+ellipse(230,377,162,12,'#224b63','opacity=".08"');
  // A close view of one well; the complete six-well plate is shown separately.
  svg+=`<path d="M82 284L91 343Q99 368 230 368Q361 368 369 343L378 284" fill="url(#${id}-glass)" stroke="#93b3c0" stroke-width="2"/>`+ellipse(230,285,148,47,'#f2f8fb','stroke="#9bbcc9" stroke-width="2"');
  if(liquid)svg+=ellipse(230,309,135,36,'#d8eef5','opacity=".65"')+path('M96 308Q230 377 364 308','#95c6d6',1.5);
  else svg+=ellipse(230,332,118,23,'#eeeae0')+grains(115,313,44,220,34);
  const dy=down?(liquid?0:14):-42;
  svg+=`<g data-conductivity-detector transform="translate(0 ${dy})">`;
  svg+=rect(211,173,7,146,`url(#${id}-metal)`,3,'data-electrode="left"')+rect(243,173,7,146,`url(#${id}-metal)`,3,'data-electrode="right"');
  svg+=rect(166,48,128,147,'#192f40',15)+rect(175,56,110,130,'#304b5d',10)+path('M182 66H277','#6d8a9c',1.5);
  svg+=txt(230,88,'전도성',20,'#e4eff4')+txt(230,112,'측정기',20,'#e4eff4')+rect(184,127,92,37,'#10252d',5);
  if(on)svg+=circle(204,145,16,'#8ef0be','opacity=".16"');
  svg+=circle(204,145,7,on?'#91f1b0':'#526169','data-conductivity-indicator="'+(on?'on':'off')+'"')+txt(244,151,on?'ON':'OFF',18,on?'#9eeeb9':'#a4b6c0');
  svg+=rect(209,179,44,14,'#132633',4)+'</g>';
  svg+=path('M298 94H364V116','#92a8b4',1.5)+txt(365,142,'①',25)+path('M251 241H364V231','#92a8b4',1.5)+txt(365,223,'②',25)+txt(230,409,'③ 선택한 홈 확대',21);
  let particles='';
  if(salt){
   const positions=[[43,37],[148,46],[254,32],[371,43],[62,95],[169,108],[279,91],[391,104],[38,155],[147,157],[262,149],[375,157]];
   for(let i=0;i<12;i++){const positive=liquid?i%2===0:(i%4+Math.floor(i/4))%2===0,x=liquid?positions[i][0]:84+(i%4)*88,y=liquid?positions[i][1]:40+Math.floor(i/4)*48;
    particles+=circle(x,y,17,positive?'#dce9ff':'#d9eee5','stroke="'+(positive?'#4b74a5':'#377e6a')+'" stroke-width="1.5"')+txt(x,y+6,positive?'+':'−',20);
    if(liquid)particles+=arrow(x+19,y,x+37,y+(i%3-1)*13,'#688b99',1.5);
   }
  }else if(!water){
   const positions=[[78,41],[230,54],[364,36],[60,137],[215,128],[373,132]];
   for(let i=0;i<6;i++){const x=liquid?positions[i][0]:90+(i%3)*110,y=liquid?positions[i][1]:50+Math.floor(i/3)*70;particles+=ellipse(x,y,29,17,'#eadfcb','stroke="#ab946e" stroke-width="1.5"')+txt(x,y+5,'분자',13);}
  }else particles=txt(230,83,'전류가 매우 작음',22)+txt(230,121,'이 모형의 표시 한계 아래',18,muted);
  let plate=rect(18,14,424,181,'#edf4f7',18,'stroke="#adc3ce" stroke-width="2"');
  const samples=['water','salt-solid','sugar-solid','salt-solution','sugar-solution','unused'];
  samples.forEach((value,i)=>{const x=90+(i%3)*140,y=60+Math.floor(i/3)*86,selected=value===sample;
   plate+=ellipse(x,y,52,29,'#fff','stroke="'+(selected?'#167c87':'#b3c8d3')+'" stroke-width="'+(selected?4:2)+'" data-well="'+value+'" data-selected="'+selected+'"');
   if(value.endsWith('solid'))plate+=grains(x-29,y-5,10,55);
   else if(value!=='unused')plate+=ellipse(x,y+2,43,20,'#e3f1f6');
   plate+=rect(x-48,y-26,22,25,'#fff',4)+txt(x-37,y-7,String.fromCharCode(65+i),20,selected?'#086d78':muted);
  });
  const particleCaption=salt?(liquid?'나트륨 이온과 염화 이온이 자유롭게 이동합니다.':'양이온·음이온은 있지만 제자리에서 벗어나 이동하기 어렵습니다.'):water?'증류수도 전류가 완전히 0인 것은 아닙니다.':'설탕은 분자 상태로 존재하며, 녹아도 이온으로 나뉘지 않습니다.';
  const detail='<section class="apparatus-detail"><h3>시료 안에서는</h3><svg viewBox="0 0 460 185" role="img" aria-label="'+name+'의 입자 모형">'+particles+'</svg><p>'+particleCaption+'</p><p class="apparatus-small">'+(salt?'파랑 +: 나트륨 이온 · 초록 −: 염화 이온. ':'')+'입자 크기·간격은 확대 모형이며 물 분자는 생략했습니다.</p></section><section class="apparatus-detail"><h3>6홈판의 비교 시료</h3><svg viewBox="0 0 460 210" role="img" aria-label="6홈판에서 현재 선택한 시료">'+plate+'</svg><p class="apparatus-small">A 증류수 · B 고체 소금 · C 고체 설탕<br>D 소금 수용액 · E 설탕 수용액 · F 빈 홈</p></section>';
  return{svg,viewBox:'0 0 460 435',caption:name+' · '+(!down?'전극을 올린 상태':on?'전도 표시 켜짐':'전도 표시 꺼짐'),detail,legend:legend([['① 전기 전도성 측정기','내장 전지로 작동합니다. 표시등은 전도 여부만 비교합니다.'],['② 두 전극','서로 닿지 않게 같은 시료에 넣습니다. 시료를 바꿀 때는 증류수로 헹군 전극을 사용합니다.'],['③ 선택한 홈','무색 용액의 경계를 구분하려 옅은 파랑으로 표현했습니다.']])};
 }
 function spring(s,v){
  const id='spring',scale=5.5,top=82,baseline=top+55,bottom=baseline+v.metrics.extension*scale;
  let svg=bench()+stand(id)+path('M230 55v24','#4d626f',3),coil='M230 82';
  for(let i=0;i<=18;i++)coil+=`L${i===0||i===18?230:i%2?216:244} ${top+(bottom-top)*i/18}`;
  svg+=path(coil,'#506d7e',4)+path(`M230 ${bottom}v12q17 9 0 17q-10 -2 -5 -7`,'#5e727f',3);
  if(+s.mass)svg+=rect(207,bottom+27,46,31,'#ad8d59',5,'stroke="#826940" stroke-width="2"')+rect(201,bottom+43,58,8,'#d0b380',2)+txt(230,bottom+49,s.mass+' g',13,'#fff');
  svg+=rect(305,73,41,240,'#f1ead7',3,'stroke="#b1a68c"');
  for(let cm=0;cm<=40;cm+=2){const y=top+cm*scale;svg+=path(`M306 ${y}h${cm%10?11:20}`,'#77715e',1);if(cm%10===0)svg+=txt(338,y+4,cm,10);}
  svg+=txt(326,334,'cm',16)+path(`M200 ${baseline}H353`,'#8da7b4',1.5,'stroke-dasharray="5 5"')+txt(127,baseline+6,'처음 끝',18,muted)+path(`M246 ${bottom}H301`,orange,2);
  if(+s.mass)svg+=arrow(377,baseline,377,bottom,orange,2)+txt(385,(baseline+bottom)/2+6,'Δℓ',19,orange,'start');
  return frame(id,svg,'추를 매단 용수철과 눈금자',[['고정된 위쪽 끝','스탠드에 매달고, 추의 무게만 바꿉니다.'],['점선 · 처음 끝','추가 없을 때의 길이 10 cm입니다.'],['주황 표시 · 늘어난 길이','현재 길이에서 처음 길이를 뺍니다. 눈금 간격은 모든 조건에서 같습니다.']]);
 }
 function buoyancy(s,v){
  const id='buoyancy',level=235,h=58,w=36+ +s.volume*.16,top=+s.immersed===0?level-h-15:level-h*(1-+s.immersed);
  let svg=bench()+stand(id)+path('M230 55v19','#6c808b',3)+rect(200,75,60,68,'#c6d5de',10,'stroke="#5b7686" stroke-width="2"')+rect(207,84,46,27,'#edf5dd',4)+txt(230,103,v.metrics.reading.toFixed(2),15)+txt(230,127,'N',14);
  svg+=beaker(id,123,181,214,164,(345-level)/164)+path(`M230 143V${top}`,'#526573',2)+rect(230-w/2,top,w,h,'#9cabb4',5,'stroke="#566b79" stroke-width="2"')+path(`M${230-w/2+5} ${top+5}v${h-10}`,'#d5e0e5',3);
  if(+s.immersed)svg+=rect(230-w/2,Math.max(top,level),w,Math.min(h,top+h-level),'#73b5cf',2,'opacity=".18"')+arrow(297,top+h/2+30,297,top+h/2-16,blue,3);
  svg+=txt(359,106,'힘 센서',19)+path('M337 111H266','#97aab4',1.5)+txt(365,256,'수면',18,blue)+path('M340 249H317','#7ab0c2',1.5);
  return frame(id,svg,'같은 물체를 물에 잠기는 정도만 바꾸어 비교',[['힘 센서','물체를 당기는 줄의 장력을 읽습니다.'],['물체 · 200 g','줄에 매달려 있고, 바닥이나 벽에 닿지 않습니다.'],['파랑 화살표 · 부력','방향을 나타냅니다. 화살표 길이가 힘의 크기 비율은 아닙니다.']]);
 }
 function mixing(s,v){
  const id='mixing',after=+s.step>0,vinegar=s.mixture==='vinegar';
  let svg=bench()+beaker(id,135,132,190,208,.58)+txt(230,98,vinegar?'식초':'물',24);
  if(after){if(vinegar)for(let i=0;i<24;i++){const x=162+(i*31)%136,y=211+(i*23)%111;svg+=circle(x,y,3+(i%4),'#fcfeff','stroke="#7ba9bd" stroke-width="1"');}else svg+=path('M174 159L266 319','#9bb8c5',6)+path('M174 159L266 319','#e9f5fa',2);}
  else{svg+=path('M89 159L177 132','#879aa6',10)+ellipse(182,131,29,10,'#a8bac4','transform="rotate(-16 182 131)"')+grains(167,120,8,28);}
  if(vinegar&&after)svg+=arrow(333,285,333,198,blue,2)+txt(383,245,'기포',19,blue);
  return frame(id,svg,after?'섞은 뒤 관찰':'섞기 전 준비',[['액체',vinegar?'식초를 준비했습니다.':'물을 준비했습니다.'],['넣는 물질',vinegar?'탄산수소 나트륨':'소금'],['관찰할 변화',after?(vinegar?'액체 속에서 기포가 발생합니다.':'소금 알갱이가 녹아 보이지 않습니다.'):'약숟가락에 담긴 고체와 액체의 처음 모습을 비교합니다.']]);
 }
 function groupDesign(s,v){
  const id='group',observe=s.stage==='observe',same=s.pair==='same',controlled=s.conditions==='controlled';let svg=bench();
  for(const[x,name,reacts]of [[34,same?'리튬':'나트륨',true],[260,same?'나트륨':'마그네슘',same]]){
   svg+=beaker(id,x,125,168,213,.6)+txt(x+84,80,name,25)+txt(x+84,106,'찬물',17,muted);
   const y=!same&&x===260?324:215;
   svg+=`<path d="M${x+73} ${y}l20 -4 8 10 -23 7Z" fill="#879aa5" stroke="#526978"/>`;
   if(observe&&reacts)for(let i=0;i<10;i++)svg+=circle(x+60+(i*17)%64,196-(i*13)%48,2+i%3,'#fafdff','stroke="#7fb2c7"');
  }
  if(!controlled)svg+=rect(36,24,388,31,'#fff0dc',5)+txt(230,46,'비교 조건이 다름 · 결과로 성질 판단 불가',17,'#925225');
  return frame(id,svg,!controlled?'조건을 맞추지 않은 비교':observe?'교사 시범의 정성 비교':'같은 조건으로 준비한 두 시료',[['비교 조건',controlled?'금속의 표면 상태·크기·물의 온도를 맞춥니다.':'표면 상태·크기·물의 온도를 맞추지 않았습니다. 이 그림의 기포로 원소의 성질 차이를 판단할 수 없습니다.'],['기포 관찰','생성 기체의 양·반응 속도를 정량 비교하는 그림은 아닙니다.'],[same?'같은 족의 금속':'찬물의 마그네슘',same?'두 금속 모두 물과 반응하지만, 반응 속도가 같다는 뜻은 아닙니다.':'같은 관찰 시간에 뚜렷한 기포가 거의 없는 모습입니다.']]);
 }
 function tuningFork(s,v){
  const id='fork',moving=v.metrics.vibrating,water=s.contact==='water';let svg=bench();
  // Prongs point downward so their tips, not the handle, touch the water.
  const fork='M230 61V139 M177 277V169Q177 133 230 133Q283 133 283 169V277';
  if(water)svg+=beaker(id,101,234,258,113,.64);
  if(moving)svg+=path(fork,'#c1d4dc',10,'transform="translate(-6 0)" opacity=".55"')+path(fork,'#c1d4dc',10,'transform="translate(6 0)" opacity=".55"');
  svg+=path(fork,'#546e7e',10)+path(fork,'#b6c8d1',3)+txt(230,34,'소리굽쇠',22);
  if(water&&moving)for(const[x,y]of [[163,250],[190,237],[278,242],[300,254]])svg+=ellipse(x,y,3,6,'#63aac5','transform="rotate(20 '+x+' '+y+')"');
  if(s.contact==='ball'){
   const x=moving?370:297;svg+=path('M333 45H424M402 45V351','#8ea3af',5)+path(`M351 48L${x} 267`,'#81939a',1.5)+circle(x,279,12,'#dbc199','stroke="#a4875f" stroke-width="2"');
   if(moving)svg+=arrow(306,281,344,281,orange,2)+circle(297,279,12,'none','stroke="#a3b2bb" stroke-dasharray="4 3"');
  }
  return frame(id,svg,water?'소리굽쇠의 끝을 물 표면에 댄 모습':s.contact==='ball'?'소리굽쇠의 한쪽 끝에 가벼운 공을 댄 모습':'치기 전과 친 뒤의 떨림 비교',[['손잡이와 두 갈래','손잡이를 잡고 갈래의 떨림을 관찰합니다.'],['관찰',moving?(water?'갈래 끝에서 물방울이 튑니다.':s.contact==='ball'?'가벼운 공이 튕겨 나갑니다.':'회색 겹선은 확대해서 표시한 떨림입니다.'):'치기 전에는 물이나 공의 변화가 없습니다.']]);
 }
 function dew(s,v){
  const id='dew',forms=v.metrics.forms,cold=s.cool==='yes';let svg=bench();
  if(s.kind==='dew'){
   svg+=beaker(id,134,94,192,244,.64);
   if(cold)for(const[x,y]of [[172,195],[234,182],[205,220]])svg+=rect(x,y,31,29,'#e4f7fc',5,'stroke="#7bb2c9" stroke-width="2" transform="rotate(12 '+x+' '+y+')"');
   if(forms)for(let i=0;i<16;i++){const x=153+(i*43)%153,y=176+(i*29)%132;svg+=`<path d="M${x} ${y}q-9 13 0 13q9 0 0 -13" fill="#7cb9d4" fill-opacity=".85" stroke="#4a91b0" stroke-width=".8"/>`;}
   svg+=txt(230,59,cold?'차가운 컵':'냉각 전 컵',25)+path('M326 221H377V245','#87a9ba',1.5)+txt(377,270,'겉면',20,blue);
  }else{
   svg+=rect(79,84,302,255,'#455f72',14)+rect(79,84,302,255,`url(#${id}-glass)`,14,'stroke="#8cabb9" stroke-width="2"')+rect(91,65,278,23,cold?'#bed9e8':'#d5dfe4',5)+txt(230,53,cold?'주변을 냉각':'냉각 전',24);
   if(forms)for(let i=0;i<90;i++)svg+=circle(96+(i*47)%270,106+(i*31)%213,2+(i%3),'#fff','opacity=".8"');
   svg+=txt(230,364,forms?'공기 중 작은 물방울':'눈에 보이지 않는 수증기',19);
  }
  return frame(id,svg,s.kind==='dew'?'컵 겉면의 응결 관찰':'습한 공기의 응결 모형',[['수증기','기체 상태의 물은 눈에 보이지 않습니다.'],['물방울',s.kind==='dew'?'공기 속 수증기가 차가운 컵의 바깥 표면에서 응결합니다.':'작은 물방울을 보기 위해 어두운 배경을 둔 확대 모형입니다.'],['조건',forms?'수증기가 있고 충분히 냉각된 상태입니다.':'수증기와 냉각 조건을 바꾸어 비교하세요.']]);
 }
 function wind(s,v){
  const id='wind',warm=s.left==='warm',same=s.left==='same',active=!!v.metrics.direction;
  let svg=bench()+rect(34,84,392,250,`url(#${id}-glass)`,12,'stroke="#799aaa" stroke-width="2.5"')+path('M230 111V277','#bdd0d8',2,'stroke-dasharray="6 5"');
  for(const[x,hot]of [[75,warm&&!same],[280,!warm&&!same]]){
   svg+=rect(x,278,105,42,hot?'#dca383':'#adccdf',7,'stroke="#819ba9"')+txt(x+52,305,same?'같은 온도':hot?'따뜻한 쪽':'차가운 쪽',15);
  }
  if(active){
   const points=warm?[[326,248,134,248],[126,230,126,144],[143,132,315,132],[330,145,330,228]]:[[134,248,326,248],[330,230,330,144],[315,132,143,132],[126,145,126,228]];
   svg+=points.map(([x,y,u,z])=>arrow(x,y,u,z,blue,4)).join('');
  }
  svg+=txt(230,54,'두 구역의 공기 흐름',25);
  return frame(id,svg,active?'온도 차이가 있는 두 구역의 대류':'흐름을 비교하기 전',[['아래쪽 흐름','차가운 쪽에서 따뜻한 쪽으로 이동합니다.'],['위아래 순환','따뜻한 쪽에서 상승하고 차가운 쪽에서 하강합니다.'],['투명 상자','두 구역을 구분한 설명 모형입니다. 점선은 벽이 아닙니다.']]);
 }
 function photosynthesis(s,v){
  const id='photo',after=+s.step>0;let svg=bench();
  if(!after){
   svg+=`<path d="M86 327V106Q86 74 118 74H342Q374 74 374 106V327Z" fill="url(#${id}-glass)" stroke="#8caab5" stroke-width="2"/>`+rect(135,312,190,18,'#9f8770',6)+`<path d="M189 281H271L260 315H200Z" fill="#b88b67"/>`+path('M230 282V130','#4c7653',5)+leaf(230,176)+leaf(230,219,-1)+leaf(230,141,-1);
   if(s.light==='off')svg+=rect(82,67,296,271,'#43525c',9,'opacity=".83"')+txt(230,183,'차광 덮개',24,'#fff');
   else svg+=arrow(36,106,88,139,'#c79232',3)+arrow(40,158,91,183,'#c79232',3)+txt(46,72,'빛',22,orange);
   svg+=txt(230,45,s.co2==='present'?'이산화 탄소 공급':'이산화 탄소 제거',23);
  }else{
   svg+=ellipse(230,259,164,78,'#ebf4f7','stroke="#8da7b3" stroke-width="3"')+ellipse(230,254,145,61,'#fbfdfe','stroke="#bdcfd7"')+`<g transform="translate(274 280) scale(1.7)">${leaf(0,0,1,v.metrics.starch?'#354a70':'#b99966')}</g>`;
   svg+=path('M283 76L251 160','#6a8999',9)+path('M283 76L251 160','#c1d1db',3)+ellipse(248,181,4,7,'#926743')+txt(340,110,'아이오딘',19)+txt(340,136,'용액',19)+txt(230,50,'처리한 잎의 색 반응',24);
  }
  return frame(id,svg,after?'잎을 꺼내 전처리한 뒤 녹말 검사':'빛과 이산화 탄소 조건 비교',[['실험 전','처음 남아 있던 녹말을 없앤 같은 식물을 준비합니다.'],['녹말 검사','관찰 뒤 잎을 탈색하는 전처리를 거쳐 아이오딘 반응을 확인합니다.'],['색이 나타나는 곳','검사한 잎입니다. 살아 있는 식물 전체가 청람색으로 변하는 것이 아닙니다.']]);
 }
 function heating(s,v){
  const id='heating';let svg=bench();
  if(s.insulation==='yes')svg+=rect(98,88,264,263,'#d8ddcc',16,'stroke="#9ca58c" stroke-width="2"');
  svg+=beaker(id,119,119,222,123,.65)+rect(105,245,250,12,'#8397a2',5)+beaker(id,128,264,204,79,.55)+path('M111 108V331M349 108V331','#a0b0b9',5);
  svg+=rect(261,37,48,56,'#beced6',8)+rect(267,45,36,22,'#f2f5df',3)+txt(285,61,v.metrics.temp.toFixed(0),14)+path('M285 93V212','#738b96',4)+txt(359,55,'℃',21);
  if(v.metrics.heat)for(const x of [175,226])svg+=arrow(x,292,x,204,orange,4);
  return frame(id,svg,'반응부와 물 용기를 분리한 단면 모형',[['위쪽 용기','음식 대신 물을 담고 온도 변화를 비교합니다.'],['아래쪽 반응부',s.reaction==='calcium'?'산화 칼슘과 물의 반응을 나타냅니다.':'물만 있는 대조군입니다.'],['분리 구조','반응물은 위쪽 물과 섞이지 않으며 반응부는 밀폐하지 않습니다.']]);
 }
 function thermal(s,v){
  const id='thermal';let svg=bench()+rect(40,109,380,100,'#243c4b',10)+txt(230,70,'위치별 온도 표시',24);
  v.metrics.temps.forEach((temp,i)=>{const color=`hsl(${210-(temp-20)/60*210} 65% 61%)`;svg+=rect(49+i*45,121,45,73,color,0)+txt(70+i*45,239,temp.toFixed(0),17);});
  svg+=rect(40,264,35,30,'#bd8b65',4)+arrow(15,156,42,156,orange,3)+txt(56,323,'가열부',18,orange)+path('M104 287H405','#8ca4b1',2);
  for(let i=0;i<30;i++)svg+=rect(113+i*9.5,281,10,14,`hsl(${210-i/29*210} 65% 61%)`,0);
  svg+=txt(112,323,'20 ℃',17)+txt(402,323,'80 ℃',17);
  return frame(id,svg,'같은 크기의 막대를 한쪽 끝에서 가열',[['고정된 색상 척도','20~80 ℃를 모든 재료·시점에 똑같이 적용합니다.'],['색상의 의미','모형 온도를 나타내는 가상 열화상입니다. 재료 자체가 이 색으로 변하는 것은 아닙니다.'],['수치의 의미','위치별 비교용 계산값이며 실제 카메라 측정값이 아닙니다.']]);
 }
 const renderers={'compound-conductivity':conductivity,spring,buoyancy,'mix-change':mixing,'group-design':groupDesign,'tuning-fork':tuningFork,'dew-fog':dew,'wind-chamber':wind,'photosynthesis-co2':photosynthesis,'heating-device':heating,'thermal-image':thermal};
 const api={render:(id,s,v)=>renderers[id]?.(s,v),ids:Object.keys(renderers)};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.scienceApparatusScenes=api;
})(typeof window==='undefined'?null:window);
