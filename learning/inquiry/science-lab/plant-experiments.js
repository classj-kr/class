/* Qualitative observations from the collected 2022 grade-6 textbooks.
 * Heights and droplets illustrate reported differences, not measured amounts. */
(function(root){
 'use strict';
 const text=(x,y,value,size=18)=>`<text x="${x}" y="${y}" text-anchor="middle" font-family="system-ui,Malgun Gothic,sans-serif" font-size="${size}" fill="#264553">${value}</text>`;
 const path=(d,color='#72919b',width=2,extra='')=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" ${extra}/>`;
 function foliage(x,y,leaves=true){let svg=path(`M${x} ${y+95}Q${x+4} ${y+30} ${x} ${y}`,'#538556',5);
  for(let i=0;i<4;i++){const yy=y+i*21,side=i%2?1:-1;svg+=path(`M${x} ${yy+16}l${side*14} -10`,'#538556',2);if(leaves)svg+=`<g transform="translate(${x+side*8} ${yy+11}) scale(${side},1)"><path d="M0 0Q15 -32 43 -24Q38 6 0 0Z" fill="#659c69" stroke="#477b51" stroke-width="1.5"/>${path('M2 -1L34 -19','#c4deaa',1)}</g>`;}return svg;
 }
 function roots(x,y,onion=false){let out='';for(let i=0;i<9;i++){const dx=(i-4)*4,start=x+(onion?dx:dx/3),end=x+dx*1.2;out+=path(`M${start} ${y}Q${x-dx} ${y+26} ${end} ${y+77-Math.abs(dx)}`,'#b9955f',1.7);if(!onion)out+=path(`M${x+dx*.3} ${y+33}l${dx} 16 M${x+dx*.7} ${y+51}l${-dx*.4} 11`,'#c0a273',1);}return out;}
 const defs='<defs><linearGradient id="plant-glass"><stop stop-color="#dceef2" stop-opacity=".8"/><stop offset=".3" stop-color="#fff" stop-opacity=".12"/><stop offset=".8" stop-color="#eff7fa" stop-opacity=".3"/><stop offset="1" stop-color="#b3d0db" stop-opacity=".7"/></linearGradient><radialGradient id="plant-bulb"><stop stop-color="#f5f1ce"/><stop offset=".65" stop-color="#d9dfac"/><stop offset="1" stop-color="#a8b77c"/></radialGradient></defs>';
 const legend=items=>'<ul class="apparatus-legend">'+items.map(([a,b])=>`<li><strong>${a}</strong><span>${b}</span></li>`).join('')+'</ul>';
 function rootFigure(s,m){let svg=defs;const onion=s.plant==='onion';
  for(const [i,key]of ['a','b'].entries()){
   const x=135+i*310,left=x-50,w=100,y=onion?216:180,bottom=410,initial=m.initial[key],surface=m.surface[key],intact=s[key]==='intact';
   svg+=text(x,48,(i?'B':'A')+' · '+(intact?'그대로':'자름'));
   svg+=`<ellipse cx="${x}" cy="423" rx="72" ry="9" fill="#264553" opacity=".09"/>`;
   svg+=`<path d="M${left} ${y}V${bottom-9}Q${left} ${bottom} ${left+10} ${bottom}H${left+w-10}Q${left+w} ${bottom} ${left+w} ${bottom-9}V${y}" fill="url(#plant-glass)" stroke="#72919b" stroke-width="2.5"/>`;
   svg+=`<path data-water="${key}" data-surface="${surface}" class="plant-water" style="--plant-drop:${surface-initial}px" d="M${left+3} ${surface}Q${x} ${surface+5} ${left+w-3} ${surface}V${bottom-10}Q${left+w-3} ${bottom-3} ${left+w-12} ${bottom-3}H${left+12}Q${left+3} ${bottom-3} ${left+3} ${bottom-10}Z" fill="#a4d4e3" fill-opacity=".6"/>`;
   svg+=path(`M${left+3} ${surface}Q${x} ${surface+5} ${left+w-3} ${surface}`,'#347f9d',2);
   if(onion){svg+=foliage(x,72,false)+`<ellipse cx="${x}" cy="197" rx="48" ry="36" fill="url(#plant-bulb)" stroke="#8e9d66" stroke-width="2"/>`;for(let n=-2;n<=2;n++)svg+=path(`M${x+n*5} 165Q${x+n*24} 199 ${x+n*5} 231`,'#afb981',1);}
   else{svg+=foliage(x,70)+path(`M${x} 163V310`,'#649166',5);svg+=`<path d="M${left+3} 182Q${left+14} 171 ${left+29} 179Q${x} 172 ${left+w-3} 181V199Q${x} 191 ${left+3} 200Z" fill="#f3f0e7" stroke="#c4c9be"/>`;for(let j=0;j<8;j++)svg+=path(`M${left+8+j*11} 183l5 10`,'#d4d7cc',1);}
   const rootY=onion?229:310;
   if(intact)svg+=`<g data-roots="${key}">${roots(x,rootY,onion)}</g>`;
   else svg+=path(`M${x-6} ${rootY}h12`,'#a88354',3);
   // A fixed initial mark remains in place when the water surface changes.
   svg+=path(`M${left-8} ${initial}H${left+w+8}`,'#bd6845',2,'stroke-dasharray="5 5"');
   svg+=text(x,456,'수면 비교',15);
  }
  svg+=text(290,495,s.stage==='before'?'처음 · 물 높이 표시':'3일 뒤 · 같은 시간 비교',19);
  return{svg,viewBox:'0 0 580 520',caption:'고정된 처음 표시와 두 용기의 수면을 비교하세요.',detail:legend([['주황 점선','실험을 시작할 때의 물 높이'],['파란 수면','선택한 시점의 물 높이'],[onion?'같은 크기의 양파':'같은 크기·잎 수의 고추 모종',onion?'같은 비커와 같은 장소에서 비교합니다.':'두 눈금실린더 입구를 탈지면으로 막고 같은 장소에 둡니다.']])};
 }
 function transpirationFigure(s,m){let svg=defs;
  for(const [i,key]of ['a','b'].entries()){
   const x=135+i*310,hasLeaves=s[key]==='present';
   svg+=text(x,48,(i?'B':'A')+' · '+(hasLeaves?'잎 있음':'잎 제거'));
   svg+=`<ellipse cx="${x}" cy="423" rx="83" ry="9" fill="#264553" opacity=".08"/>`;
   svg+=`<path d="M${x-22} 270V310L${x-69} 393Q${x-77} 414 ${x-55} 414H${x+55}Q${x+77} 414 ${x+69} 393L${x+22} 310V270Z" fill="url(#plant-glass)" stroke="#72919b" stroke-width="2.5"/>`;
   svg+=`<path d="M${x-52} 364L${x-68} 395Q${x-73} 410 ${x-53} 410H${x+53}Q${x+73} 410 ${x+68} 395L${x+52} 364Z" fill="#a4d4e3" fill-opacity=".6"/>`;
   svg+=path(`M${x} 193V368`,'#638c5b',5)+foliage(x,106,hasLeaves);
   svg+=`<path d="M${x-75} 86Q${x-81} 158 ${x-66} 228Q${x-53} 254 ${x-9} 263H${x+9}Q${x+53} 254 ${x+66} 228Q${x+81} 158 ${x+75} 86Z" fill="#e8f5f7" fill-opacity=".2" stroke="#8eb3bf" stroke-width="1.7"/>`+path(`M${x-70} 93H${x+70} M${x-64} 111Q${x-72} 172 ${x-54} 222`,'#c8e0e7',2);
   if(m.droplets[key])for(let n=0;n<16;n++){const dx=(n%4)*35-52,yy=112+Math.floor(n/4)*34;svg+=`<path data-droplet="${key}" d="M${x+dx} ${yy}q-8 10 0 11q8 -1 0 -11" fill="#85bfd4" fill-opacity=".85" stroke="#66a5bf" stroke-width=".6"/>`;}
   svg+=path(`M${x-11} 258h22 M${x-7} 261l-14 9 M${x+7} 261l14 9`,'#ad8d65',2);
   svg+=`<ellipse cx="${x}" cy="277" rx="21" ry="9" fill="#f0efe6" stroke="#c4c9be"/>`;
   svg+=text(x,454,m.droplets[key]?'물방울 있음':'거의 없음',17);
  }
  svg+=text(290,495,s.stage==='before'?'처음 · 마른 봉지':'1~2일 뒤 · 같은 시간 비교',19);
  return{svg,viewBox:'0 0 580 520',caption:'두 봉지 안쪽의 변화를 같은 시점에서 비교하세요.',detail:legend([['봉지 안쪽','처음에는 물기가 없는 봉지를 씌웁니다.'],['용기 입구','탈지면으로 막고 봉지는 줄기 쪽에 묶습니다.'],['같게 맞춘 조건','식물의 종류·크기, 물의 양, 봉지 크기, 빛, 관찰 시간을 같게 합니다.']])};
 }
 function stemFigure(s,m){let svg=defs;
  for(const [i,key] of ['a','b'].entries()){
   const x=150+i*310,dyed=m.stained[key],water=s[key]==='dye';
   svg+=text(x,48,(i?'B':'A')+' · '+(water?'색소 물':'맹물'),18);
   svg+=`<ellipse cx="${x}" cy="427" rx="91" ry="10" fill="#264553" opacity=".09"/>`;
   // The pigment is confined to narrow transport strands; the whole stem never turns red.
   svg+=`<path d="M${x-9} 156Q${x-11} 231 ${x-9} 347H${x+9}Q${x+11} 230 ${x+9} 156Z" fill="#c8d69d" stroke="#71915b" stroke-width="2"/>`;
   for(const dx of [-5,0,5])svg+=path(`M${x+dx} 170Q${x+dx-2} 250 ${x+dx} 345`,dyed?'#c75a60':'#95b889',dyed?2.2:1.3);
   svg+=path(`M${x-19} ${s.location==='lower'?305:190}H${x+19}`,'#6b5860',2,'stroke-dasharray="3 3" data-cut-location="'+s.location+'"');
   for(const side of [-1,1]){
    const cx=x+side*37;svg+=`<path d="M${x+side*3} 166Q${x+side*18} 139 ${cx} 116Q${x+side*72} 123 ${cx} 151Q${x+side*25} 175 ${x+side*3} 166Z" fill="${dyed?'#f4d0d3':'#f7f4e8'}" stroke="#c9b9ad" stroke-width="1.5"/>`;
    svg+=path(`M${x+side*4} 164Q${cx} 146 ${cx} 126`,dyed?'#d78387':'#d7d6b9',1.4);
   }
   svg+=`<ellipse cx="${x}" cy="114" rx="27" ry="31" fill="${dyed?'#efc2c9':'#f9f5e8'}" stroke="#c9b9ad" stroke-width="1.5"/><circle cx="${x}" cy="114" r="8" fill="#e3b25e"/>`;
   svg+=`<path d="M${x-56} 316L${x-75} 404Q${x-76} 418 ${x-60} 418H${x+60}Q${x+76} 418 ${x+75} 404L${x+56} 316Z" fill="url(#plant-glass)" stroke="#72919b" stroke-width="2.4"/>`;
   svg+=`<path d="M${x-66} 362L${x-73} 404Q${x-74} 416 ${x-59} 416H${x+59}Q${x+74} 416 ${x+73} 404L${x+66} 362Z" fill="${water?'#e9aab0':'#a9d8e3'}" fill-opacity=".68"/>`;
   svg+=text(x,456,dyed?'일부 붉어짐':'색 유지',16);
  }
  svg+=`<rect x="174" y="207" width="272" height="93" rx="13" fill="#fff" stroke="#c9dce0" stroke-width="2"/>`;
  svg+=text(310,231,(s.location==='lower'?'아래쪽':'위쪽')+' 줄기 · '+(s.cut==='cross'?'가로 단면':'세로 단면'),16);
  for(const [i,key] of ['a','b'].entries()){
   const x=245+i*130,dyed=m.stained[key];
   if(s.cut==='cross'){
    svg+=`<ellipse cx="${x}" cy="267" rx="35" ry="21" fill="#e4e9ce" stroke="#8da07b" stroke-width="2"/>`;
    for(const [dx,dy] of [[-20,-5],[-8,8],[8,-9],[21,4],[0,0]])svg+=`<ellipse cx="${x+dx}" cy="${267+dy}" rx="3.2" ry="2.5" fill="${dyed?'#bf5963':'#fbfff0'}" stroke="${dyed?'#a84150':'#b5c3a0'}"/>`;
   }else{
    svg+=`<rect x="${x-34}" y="252" width="68" height="28" rx="8" fill="#e4e9ce" stroke="#8da07b" stroke-width="2"/>`;
    for(const dy of [-7,0,7])svg+=path(`M${x-26} ${266+dy}H${x+26}`,dyed?'#bf5963':'#fbfff0',2);
   }
  }
  svg+=text(310,491,s.stage==='before'?'처음 · 두 줄기 색 기록':'약 4시간 뒤 · 같은 위치 단면 비교',18);
  return{svg,viewBox:'0 0 620 510',caption:'두 백합을 같은 시간 동안 두고 꽃과 줄기 단면을 비교하세요.',detail:legend([['A와 B','한쪽은 맹물, 다른 쪽은 붉은 색소 물에 꽂아 비교합니다.'],['줄기 단면','가로 단면의 점과 세로 단면의 선은 물이 이동한 부분을 나타냅니다.'],['관찰 위치','위·아래 단면을 각각 살펴보며 줄기 전체가 붉게 물드는 것으로 해석하지 않습니다.']])};
 }
 function registerModels({add,f,q}){
  add('microscope',{id:'leaf-water-indicator',title:'잎에서 나온 물 검출',codes:['6과11-02'],activity:'6과11#3',source:{id:'89316af3de563d4c',pages:[14]},initial:{paper:'dry',stage:'before'},fields:[f('paper','종이의 처음 상태',[['dry','푸른색 · 마른 종이'],['wet','이미 붉어진 종이']]),f('stage','관찰 시점',[['before','잎 뒷면에 붙인 처음'],['after','1~2일 뒤']])],view(s){
   const after=s.stage==='after',red=after||s.paper==='wet',valid=s.paper==='dry';
   let svg=defs+`<path d="M79 63H381L393 304Q393 326 370 326H90Q67 326 67 304Z" fill="#edf6f8" fill-opacity=".45" stroke="#90b5c3" stroke-width="2"/>`+path('M81 78H379 M84 83H376','#79a5b7',3);
   svg+=`<path d="M108 272Q90 144 295 107Q370 235 108 272Z" fill="#88b67f" stroke="#517d54" stroke-width="2"/>`+path('M110 269Q216 207 293 110 M152 245L157 176 M184 224L224 138 M215 205L310 188 M248 170L313 150','#c1d6a4',2)+path('M113 269L43 311','#668b55',7);
   svg+=`<rect data-indicator="${red?'red':'blue'}" x="189" y="180" width="96" height="58" rx="3" fill="${red?'#d68a9b':'#6597cd'}" stroke="${red?'#a95470':'#356b9f'}" stroke-width="2"/><path d="M177 175H202V244H177Z M273 175H297V244H273Z" fill="#f6f6de" fill-opacity=".62" stroke="#d5d7bd"/>`;
   if(after)for(const [x,y]of [[96,114],[355,118],[368,262],[88,288],[315,298]])svg+=`<path d="M${x} ${y}q-7 11 0 12q7 -1 0 -12" fill="#87bdd1"/>`;
   svg+=text(230,32,'잎 뒷면과 지퍼 백 확대',20)+text(230,363,'염화코발트 종이 · '+(red?'붉은색':'푸른색'),20);
   const figure={svg,viewBox:'0 0 460 390',caption:'잎 뒷면에 붙인 종이의 처음 색과 나중 색을 비교하세요.',detail:legend([['검출 원리','마른 푸른색 염화코발트 종이는 물이 닿으면 붉어집니다.'],['장치','종이를 잎 뒷면에 붙이고 지퍼 백 입구를 닫아 같은 장소에 둡니다.'],['처음 상태 확인','이미 붉어진 종이는 실험 전후의 변화를 판별하는 데 쓸 수 없습니다.']])};
   return{svg,figure,metrics:{red,valid,detected:valid&&after},readings:[['처음 색',valid?'푸른색':'붉은색'],['현재 색',red?'붉은색':'푸른색']],text:!valid?'처음부터 붉은 종이입니다. 나중에도 붉다는 사실만으로 잎에서 나온 물을 검출했다고 판단할 수 없습니다.':after?'종이가 푸른색에서 붉은색으로 변했습니다. 잎을 통해 빠져나온 물을 검출한 결과입니다.':'푸른색 종이를 잎 뒷면에 붙였습니다. 같은 장치에서 시간이 지난 뒤의 색과 비교하세요.',note:'시약은 교사의 지도에 따라 다룹니다. 종이 색으로 물의 양을 비교하지 않습니다.',check:q('종이가 처음부터 붉었고 2일 뒤에도 붉었다. 이 결과를 해석하는 방법은?',['잎에서 물이 나왔음을 색 변화로 확인했다','잎에서 물이 나오지 않음을 색으로 확인했다','처음부터 붉어 전후 색으로 판단하기 어렵다'],2,'검출은 처음 상태와 비교해야 합니다. 마른 푸른색 종이로 시작해야 물에 의한 색 변화를 확인할 수 있습니다.')};
  }});
  add('microscope',{id:'root-uptake',title:'뿌리의 물 흡수 비교',codes:['6과11-02'],textbookActivity:'root-uptake',source:{id:'89316af3de563d4c',pages:[7]},initial:{plant:'pepper',a:'intact',b:'cut',level:'same',stage:'before'},fields:[f('plant','실험 재료',[['pepper','고추 모종 · 눈금실린더'],['onion','양파 · 비커']]),f('a','A의 뿌리',[['intact','그대로 두기'],['cut','자른 것']]),f('b','B의 뿌리',[['intact','그대로 두기'],['cut','자른 것']]),f('level','처음 물 높이',[['same','두 용기를 같게 맞춤'],['different','B가 더 낮음']]),f('stage','관찰 시점',[['before','처음'],['after','3일 뒤']])],view(s){
   const after=s.stage==='after',initial={a:s.plant==='onion'?234:270,b:(s.plant==='onion'?234:270)+(s.level==='same'?0:25)},surface={a:initial.a+(after?(s.a==='intact'?(s.plant==='onion'?42:65):4):0),b:initial.b+(after?(s.b==='intact'?(s.plant==='onion'?42:65):4):0)},comparable=s.a!==s.b&&s.level==='same',metrics={initial,surface,comparable,changed:after};
   const observation=!after?'두 용기의 처음 물 높이를 표시했습니다. 뿌리 조건을 정하고 3일 뒤의 수면을 비교하세요.':s.a===s.b?'두 식물의 뿌리 조건이 같습니다. 이 한 쌍만으로는 뿌리 유무의 영향을 구별하기 어렵습니다.':s.level!=='same'?'처음 물 높이가 달라 마지막 수면만 비교하면 잘못 판단할 수 있습니다. 처음 높이를 같게 맞춘 뒤 다시 비교하세요.':`${s.a==='intact'?'A':'B'}에서 물이 더 많이 줄었습니다. 같은 조건에서 뿌리를 그대로 둔 식물이 물을 더 많이 흡수한 결과와 연결할 수 있습니다.`;
   const figure=rootFigure(s,metrics);return{svg:figure.svg,figure,metrics,readings:[['A의 변화',!after?'관찰 전':s.a==='intact'?'물이 많이 줄어듦':'물이 거의 줄지 않음'],['B의 변화',!after?'관찰 전':s.b==='intact'?'물이 많이 줄어듦':'물이 거의 줄지 않음']],text:observation,note:'처음 표시에서 수면이 얼마나 낮아졌는지 비교하세요. 물이 거의 줄지 않았다고 흡수가 전혀 없다고 단정하지 않습니다.',check:s.level!=='same'?q('A와 B의 처음 물 높이가 달랐다. 뿌리의 유무를 비교하기 위해 다시 맞출 조건은?',['마지막 물 높이','처음 물 높이','뿌리를 자른 위치'],1,'처음 물 높이를 같게 하고 나머지 조건도 통제한 뒤 물의 감소를 비교합니다.'):q('A와 B에서 뿌리 유무의 영향만 비교하려 한다. 바꾸어야 할 조건은?',['뿌리를 남기는지 여부','햇빛을 받는 양','처음 넣는 물의 양'],0,'뿌리 유무를 다르게 하고 식물의 크기·잎 수, 물의 양, 빛, 관찰 시간은 같게 합니다.')};
  }});
  add('microscope',{id:'leaf-transpiration',title:'잎 유무와 증산 작용',codes:['6과11-02'],activity:'6과11#3',source:{id:'d544b624a4fe52c2',pages:[10]},initial:{a:'present',b:'removed',stage:'before'},fields:[f('a','A의 잎',[['present','그대로 두기'],['removed','모두 제거한 것']]),f('b','B의 잎',[['present','그대로 두기'],['removed','모두 제거한 것']]),f('stage','관찰 시점',[['before','처음'],['after','1~2일 뒤']])],view(s){const after=s.stage==='after',droplets={a:after&&s.a==='present',b:after&&s.b==='present'},metrics={droplets,comparable:s.a!==s.b},figure=transpirationFigure(s,metrics);return{svg:figure.svg,figure,metrics,readings:[['A 봉지 안쪽',droplets.a?'물방울 관찰':'뚜렷한 물방울 없음'],['B 봉지 안쪽',droplets.b?'물방울 관찰':'뚜렷한 물방울 없음']],text:!after?'같은 크기의 고추 모종과 마른 봉지를 준비했습니다. 잎 유무만 달리하고 같은 시간이 지난 뒤를 비교하세요.':s.a===s.b?'잎 조건이 같은 두 식물입니다. 잎의 역할을 알아보려면 한쪽의 잎 유무를 바꿔 비교해야 합니다.':'잎을 그대로 둔 쪽의 봉지에 물방울이 나타납니다. 잎을 통해 빠져나온 수증기가 봉지 안쪽에서 물방울로 변한 결과입니다.',note:'물방울의 유무를 비교하세요. 그림 속 물방울 개수로 증산량을 계산하지 않습니다.',check:q('잎이 있는 쪽의 마른 봉지에서만 물방울이 관찰되었다. 물의 이동과 상태 변화로 알맞은 것은?',['잎 → 액체 방울 배출 → 봉지에 붙음','잎 → 수증기 배출 → 봉지에서 응결','봉지 → 물 생성 → 잎으로 이동'],1,'잎에서 물이 수증기 상태로 빠져나온 뒤 봉지 안쪽에서 응결해 눈에 보이는 물방울이 됩니다.')};}});
  add('microscope',{id:'stem-dye-transport',title:'백합 줄기의 물 이동',codes:['6과11-02'],textbookActivity:'stem-dye-transport',source:{id:'89316af3de563d4c',pages:[9]},initial:{a:'plain',b:'dye',stage:'before',cut:'cross',location:'lower'},fields:[f('a','A의 물',[['plain','맹물'],['dye','붉은 색소 물']]),f('b','B의 물',[['plain','맹물'],['dye','붉은 색소 물']]),f('stage','관찰 시점',[['before','처음'],['after','약 4시간 뒤']]),f('cut','줄기 자르는 방향',[['cross','가로 단면'],['length','세로 단면']]),f('location','관찰 위치',[['lower','줄기 아래쪽'],['upper','줄기 위쪽']])],view(s){
   const after=s.stage==='after',stained={a:after&&s.a==='dye',b:after&&s.b==='dye'},metrics={stained,comparable:s.a!==s.b,after},figure=stemFigure(s,metrics);
   const section=s.cut==='cross'?'붉은 점':'붉은 선';
   return{svg:figure.svg,figure,metrics,readings:[['A의 '+(s.cut==='cross'?'가로':'세로')+' 단면',stained.a?section+' 관찰':'붉은 부분 없음'],['B의 '+(s.cut==='cross'?'가로':'세로')+' 단면',stained.b?section+' 관찰':'붉은 부분 없음']],text:!after?'같은 크기의 백합 두 송이를 준비해 한쪽은 맹물, 다른 쪽은 붉은 색소 물에 꽂습니다. 처음 꽃과 줄기 색을 확인하세요.':s.a===s.b?'두 백합에 같은 물을 넣었습니다. 색소의 영향을 알아보려면 맹물과 색소 물을 같은 시간 동안 비교해야 합니다.':`색소 물에 꽂은 백합의 꽃과 줄기 ${s.location==='lower'?'아래쪽':'위쪽'} ${s.cut==='cross'?'가로':'세로'} 단면에서 ${section}이 보입니다. 줄기 안의 특정 통로를 따라 물이 이동한 증거입니다.`,note:'붉게 변한 부분을 찾아보세요. 줄기 전체가 고르게 물드는지, 특정 통로를 따라 변하는지 비교합니다.',check:q('붉은 물에 둔 백합의 줄기를 가로로 잘랐더니 붉은 점이 여러 곳에 나타났다. 가장 타당한 해석은?',['줄기 안의 일부 통로를 따라 붉은 물이 이동했다','줄기 전체가 고르게 붉은 물로 바뀌었다','꽃의 색이 먼저 변해 물이 아래로 내려왔다'],0,'단면의 붉은 점과 세로 단면의 붉은 선은 물이 이동한 줄기 속 부분을 보여 줍니다.')};
  }});
 }
 const api={registerModels};if(typeof module!=='undefined')module.exports=api;else root.sciencePlantExperiments=api;
})(typeof window==='undefined'?globalThis:window);
