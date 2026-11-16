/* Apparatus drawings: apparatus, observation and explanatory models stay distinct.
 * Every renderer takes (state, view, anim). anim={k:0..1, prev, prevView} draws an in-between
 * frame of the physical process; without anim (k=1) the settled picture is returned. */
(function(root){
 'use strict';
 const ink='#243d50',muted='#52697a',blue='#287a9c',orange='#bd6337';
 const txt=(x,y,s,size=18,fill=ink,anchor='middle',extra='')=>`<text x="${x}" y="${y}" font-family="system-ui,Malgun Gothic,sans-serif" font-size="${size}" font-weight="500" text-anchor="${anchor}" fill="${fill}" ${extra}>${s}</text>`;
 const path=(d,stroke=ink,width=2,extra='')=>`<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
 const rect=(x,y,w,h,fill,rx=6,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
 const ellipse=(x,y,rx,ry,fill,extra='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
 const circle=(x,y,r,fill,extra='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra}/>`;
 const arrow=(x,y,u,v,color=orange,width=3,extra='')=>{const a=Math.atan2(v-y,u-x),d=9;return `<g ${extra}>`+path(`M${x} ${y}L${u} ${v}`,color,width)+path(`M${u-d*Math.cos(a-.5)} ${v-d*Math.sin(a-.5)}L${u} ${v}L${u-d*Math.cos(a+.5)} ${v-d*Math.sin(a+.5)}`,color,width)+'</g>';};
 // Motion helpers.
 const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
 const seg=(k,a,b)=>clamp((k-a)/(b-a));
 const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
 const easeOut=t=>1-Math.pow(1-t,3);
 const lerp=(a,b,t)=>a+(b-a)*t;
 const r2=x=>Math.round(x*100)/100;
 const rnd=i=>{const x=Math.sin(i*12.9898+78.233)*43758.5453;return x-Math.floor(x);};
 const rgb=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));
 const mix=(a,b,t)=>{const A=rgb(a),B=rgb(b);return '#'+A.map((x,i)=>Math.round(x+(B[i]-x)*clamp(t)).toString(16).padStart(2,'0')).join('');};
 const prog=a=>a&&a.k<1?a.k:1;
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
 const grain=(x,y,s=1)=>`<path d="M${r2(x)} ${r2(y)}l${r2(6*s)} ${r2(-4*s)} ${r2(5*s)} ${r2(4*s)} ${r2(-2*s)} ${r2(6*s)} ${r2(-7*s)} ${r2(s)}Z" fill="#fff" stroke="#b5b7b3" stroke-width=".7"/>`;
 const cube=(x,y,sc=1)=>{const d=r2(5.5*sc),e=r2(2.4*sc);return sc<=.05?'':`<g transform="translate(${r2(x)} ${r2(y)})"><path d="M0 ${e}L${e} 0H${r2(d+e)}V${d}L${d} ${r2(d+e)}H0Z" fill="#e3e8ea"/><rect x="0" y="${e}" width="${d}" height="${d}" fill="#fdfefe" stroke="#a3aeb3" stroke-width=".7"/><path d="M0 ${e}L${e} 0H${r2(d+e)}L${d} ${e}Z" fill="#f4f7f8" stroke="#a3aeb3" stroke-width=".6"/></g>`;};
 const grains=(x,y,n=22,w=95,h=18)=>Array.from({length:n},(_,i)=>{const a=i*2.399963229728653,d=Math.sqrt((i+.5)/n);return grain(x+w/2+Math.cos(a)*w/2*d,y+h/2+Math.sin(a)*h/2*d);}).join('');
 const leaf=(x,y,flip=1,color='#548f61')=>`<g transform="translate(${x},${y}) scale(${flip},1)"><path d="M0 0Q-39 -51 -63 -26Q-60 8 0 0Z" fill="${color}" stroke="#35684b" stroke-width="1.5"/>${path('M0 0L-47 -24 M-22 -11l-11 -20 M-34 -17l-17 3','#b4d8b4',1)}</g>`;
 const bubble=(x,y,r)=>circle(r2(x),r2(y),r2(r),'#fcfeff','stroke="#7ba9bd" stroke-width="1" fill-opacity=".85"');
 const flameShape=(x,y,h=1,w=1,c1='#f2a93b',c2='#fde49a')=>`<path d="M${x} ${y}C${r2(x-13*w)} ${r2(y-14*h)} ${r2(x-10*w)} ${r2(y-34*h)} ${x} ${r2(y-56*h)}C${r2(x+10*w)} ${r2(y-34*h)} ${r2(x+13*w)} ${r2(y-14*h)} ${x} ${y}Z" fill="${c1}" opacity=".95"/><path d="M${x} ${y-2}C${r2(x-6*w)} ${r2(y-10*h)} ${r2(x-5*w)} ${r2(y-22*h)} ${x} ${r2(y-34*h)}C${r2(x+5*w)} ${r2(y-22*h)} ${r2(x+6*w)} ${r2(y-10*h)} ${x} ${y-2}Z" fill="${c2}"/>`;
 const legend=items=>'<ul class="apparatus-legend">'+items.map(([name,meaning])=>`<li><strong>${name}</strong><span>${meaning}</span></li>`).join('')+'</ul>';
 function frame(id,svg,caption,items=[],detail=''){return{svg:defs(id)+svg,viewBox:'0 0 460 390',caption,detail:detail||legend(items)};}
 function conductivity(s,v,a){
  const id='conductivity',sample=s.sample,liquid=!sample.endsWith('solid'),salt=sample.startsWith('salt'),water=sample==='water',on=v.metrics.conducts,k=prog(a),P=a&&a.prev;
  const name={'water':'증류수','salt-solid':'고체 염화 나트륨','salt-solution':'염화 나트륨 수용액','sugar-solid':'고체 설탕','sugar-solution':'설탕 수용액'}[sample];
  const dyOf=st=>st.probe==='immersed'?(st.sample.endsWith('solid')?14:0):-42,target=dyOf(s);
  // The electrodes lift out, are moved to the next well, then go down again.
  let dy=target,well=sample;
  if(P&&k<1){const from=dyOf(P);
   if(P.sample!==sample){if(k<.4)dy=lerp(from,Math.min(from,-42),ease(k/.4));else if(k<.55)dy=Math.min(from,-42);else dy=lerp(Math.min(from,-42),target,ease((k-.55)/.45));if(k<.47)well=P.sample;}
   else dy=lerp(from,target,ease(k));
  }
  const wLiquid=!well.endsWith('solid'),lit=on&&Math.abs(dy-target)<.01;
  let svg=defs(id)+ellipse(230,377,162,12,'#224b63','opacity=".08"');
  // A close view of one well; the complete six-well plate is shown separately.
  svg+=`<path d="M82 284L91 343Q99 368 230 368Q361 368 369 343L378 284" fill="url(#${id}-glass)" stroke="#93b3c0" stroke-width="2"/>`+ellipse(230,285,148,47,'#f2f8fb','stroke="#9bbcc9" stroke-width="2"');
  if(wLiquid)svg+=ellipse(230,309,135,36,'#d8eef5','opacity=".65"')+path('M96 308Q230 377 364 308','#95c6d6',1.5);
  else svg+=ellipse(230,332,118,23,'#eeeae0')+grains(115,313,44,220,34);
  if(P&&k<1&&wLiquid&&s.probe==='immersed'&&dy>-12){const q=clamp((dy+12)/12);svg+=ellipse(230,309,r2(26+46*q),r2(7+12*q),'none',`stroke="#6fa9bf" stroke-width="2" opacity="${r2(1-q*.8)}"`);}
  svg+=`<g data-conductivity-detector transform="translate(0 ${r2(dy)})">`;
  svg+=rect(211,173,7,146,`url(#${id}-metal)`,3,'data-electrode="left"')+rect(243,173,7,146,`url(#${id}-metal)`,3,'data-electrode="right"');
  svg+=rect(166,48,128,147,'#192f40',15)+rect(175,56,110,130,'#304b5d',10)+path('M182 66H277','#6d8a9c',1.5);
  svg+=txt(230,88,'전도성',20,'#e4eff4')+txt(230,112,'측정기',20,'#e4eff4')+rect(184,127,92,37,'#10252d',5);
  if(lit)svg+=circle(204,145,16,'#8ef0be','opacity=".16"');
  svg+=circle(204,145,7,lit?'#91f1b0':'#526169','data-conductivity-indicator="'+(on?'on':'off')+'"')+txt(244,151,lit?'ON':'OFF',18,lit?'#9eeeb9':'#a4b6c0');
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
  return{svg,viewBox:'0 0 460 435',caption:name+' · '+(s.probe!=='immersed'?'전극을 올린 상태':on?'전도 표시 켜짐':'전도 표시 꺼짐'),detail,legend:legend([['① 전기 전도성 측정기','내장 전지로 작동합니다. 표시등은 전도 여부만 비교합니다.'],['② 두 전극','서로 닿지 않게 같은 시료에 넣습니다. 시료를 바꿀 때는 증류수로 헹군 전극을 사용합니다.'],['③ 선택한 홈','무색 용액의 경계를 구분하려 옅은 파랑으로 표현했습니다.']])};
 }
 const springExtension=st=>(+st.mass/1000*9.8)/+st.stiffness*100;
 function spring(s,v,a){
  const id='spring',scale=5.5,top=82,baseline=top+55,k=prog(a);
  let ext=v.metrics.extension;
  // The weight is hung and bobs a little before it comes to rest.
  if(a&&k<1){const from=springExtension(a.prev);ext=clamp(ext+(from-ext)*Math.exp(-3.2*k)*Math.cos(2.6*Math.PI*k)*(1-k),0,31);}
  const bottom=r2(baseline+ext*scale);
  let svg=bench()+stand(id)+path('M230 55v24','#4d626f',3),coil='M230 82';
  for(let i=0;i<=18;i++)coil+=`L${i===0||i===18?230:i%2?216:244} ${r2(top+(bottom-top)*i/18)}`;
  svg+=path(coil,'#506d7e',4)+path(`M230 ${bottom}v12q17 9 0 17q-10 -2 -5 -7`,'#5e727f',3);
  if(+s.mass)svg+=rect(207,bottom+27,46,31,'#ad8d59',5,'stroke="#826940" stroke-width="2"')+rect(201,bottom+43,58,8,'#d0b380',2)+txt(230,bottom+49,s.mass+' g',14,'#fff');
  svg+=rect(305,73,41,240,'#f1ead7',3,'stroke="#b1a68c"');
  for(let cm=0;cm<=40;cm+=2){const y=top+cm*scale;svg+=path(`M306 ${y}h${cm%10?11:20}`,'#77715e',1);if(cm%10===0)svg+=txt(336,y+5,cm,14);}
  svg+=txt(326,334,'cm',16)+path(`M200 ${baseline}H353`,'#8da7b4',1.5,'stroke-dasharray="5 5"')+txt(127,baseline+6,'처음 끝',18,muted)+path(`M246 ${bottom}H301`,orange,2);
  if(+s.mass&&k>=1)svg+=arrow(377,baseline,377,bottom,orange,2)+txt(385,(baseline+bottom)/2+6,'Δℓ',19,orange,'start');
  return frame(id,svg,'추를 매단 용수철과 눈금자',[['고정된 위쪽 끝','스탠드에 매달고, 추의 무게만 바꿉니다.'],['점선 · 처음 끝','추가 없을 때의 길이 10 cm입니다.'],['주황 표시 · 늘어난 길이','현재 길이에서 처음 길이를 뺍니다. 눈금 간격은 모든 조건에서 같습니다.']]);
 }
 function buoyancy(s,v,a){
  const id='buoyancy',level=235,h=58,k=prog(a),P=a&&a.prev;
  // The object is lowered (or raised) slowly; the sensor reading follows the submerged part.
  let imm=+s.immersed,vol=+s.volume;
  if(P&&k<1){imm=lerp(+P.immersed,imm,ease(k));vol=lerp(+P.volume,vol,ease(k));}
  const w=r2(36+vol*.16),lift=15*(1-Math.min(1,imm/.15)),top=r2(level-h*(1-imm)-lift),reading=k<1?1.96-vol*imm*.0098:v.metrics.reading;
  let svg=bench()+stand(id)+path('M230 55v19','#6c808b',3)+rect(200,75,60,68,'#c6d5de',10,'stroke="#5b7686" stroke-width="2"')+rect(207,84,46,27,'#edf5dd',4)+txt(230,103,reading.toFixed(2),15)+txt(230,127,'N',14);
  svg+=beaker(id,123,181,214,164,(345-level)/164)+path(`M230 143V${top}`,'#526573',2)+rect(r2(230-w/2),top,w,h,'#9cabb4',5,'stroke="#566b79" stroke-width="2"')+path(`M${r2(230-w/2+5)} ${r2(top+5)}v${h-10}`,'#d5e0e5',3);
  if(imm>0)svg+=rect(r2(230-w/2),r2(Math.max(top,level)),w,r2(Math.min(h,top+h-level)),'#73b5cf',2,'opacity=".18"');
  if(P&&k<1&&top+h>level-2&&top<level+2){const q=(k*3)%1;svg+=ellipse(230,level+1,r2(w/2+8+30*q),r2(3+5*q),'none',`stroke="#5d9fba" stroke-width="1.6" opacity="${r2(1-q)}"`);}
  if(+s.immersed&&k>=1)svg+=arrow(297,top+h/2+30,297,top+h/2-16,blue,3);
  svg+=txt(359,106,'힘 센서',19)+path('M337 111H266','#97aab4',1.5)+txt(365,256,'수면',18,blue)+path('M340 249H317','#7ab0c2',1.5);
  return frame(id,svg,'같은 물체를 물에 잠기는 정도만 바꾸어 비교',[['힘 센서','물체를 당기는 줄의 장력을 읽습니다.'],['물체 · 200 g','줄에 매달려 있고, 바닥이나 벽에 닿지 않습니다.'],['파랑 화살표 · 부력','방향을 나타냅니다. 화살표 길이가 힘의 크기 비율은 아닙니다.']]);
 }
 function mixing(s,v,a){
  const id='mixing',after=+s.step>0,vinegar=s.mixture==='vinegar',k=prog(a),sy=219;
  let svg=bench()+beaker(id,135,132,190,208,.58)+txt(230,98,vinegar?'식초':'물',24);
  // Salt is drawn as small white cubes, baking soda as a fine white powder.
  const solid=(x,y,sc=1)=>vinegar?circle(r2(x+3),r2(y),r2(2.6*sc),'#fbfcfa','stroke="#c4c8c2" stroke-width=".6"'):cube(x,y,sc);
  const load=n=>Array.from({length:n},(_,i)=>solid(168+(i%4)*7+(Math.floor(i/4)%2)*3,124-Math.floor(i/4)*5)).join('');
  const spoon=(tilt,amount)=>`<g transform="rotate(${r2(tilt)} 182 131)">`+path('M89 159L177 132','#879aa6',10)+ellipse(182,131,29,10,'#a8bac4','transform="rotate(-16 182 131)"')+(amount>0?load(Math.round(10*amount)):'')+'</g>';
  if(!after){svg+=spoon(0,1);}
  else if(k<1){
   // 1) the spoon tips and the powder falls in, 2) bubbles rise or the stirring rod dissolves the salt.
   const tip=seg(k,0,.18),fall=seg(k,.08,.34);
   if(k<.4)svg+=`<g opacity="${r2(1-seg(k,.3,.4))}">`+spoon(28*ease(tip),1-fall)+'</g>';
   for(let i=0;i<10;i++){const t=seg(k,.1+i*.02,.3+i*.02);if(t<=0)continue;const x=186+(rnd(i)-.5)*30,y0=138,y1=vinegar?sy+6+rnd(i+20)*10:sy+8+t*0;
    if(vinegar){if(t<1)svg+=solid(x-4,lerp(y0,y1,t*t));}
    else{const sink=seg(k,.3,.55),dissolve=seg(k,.45,.95),yy=t<1?lerp(y0,sy,t*t):lerp(sy,318-rnd(i+5)*8,sink);if(dissolve<1)svg+=solid(x-4+(rnd(i+9)-.5)*40*sink,yy,1-dissolve);}
   }
   if(vinegar){const b=seg(k,.28,1);
    for(let i=0;i<26;i++){const ph=(b*1.6+rnd(i))%1,x=158+rnd(i+40)*144+Math.sin(ph*9+i)*4,y=lerp(330,sy+6,ph);if(b>rnd(i+70)*.4)svg+=bubble(x,y,2.5+rnd(i+3)*3);}
    const foam=ease(seg(b,.2,1));if(foam>.1)for(let i=0;i<14;i++)svg+=bubble(152+i*11.5,sy-2-rnd(i+80)*6*foam,r2(5*foam));
   }else if(k>=.28){const st=seg(k,.3,.9),ang=Math.sin(st*Math.PI*6)*14*(1-seg(k,.86,.9)),dip=easeOut(seg(k,.28,.36)),rest=ease(seg(k,.9,1));
    // The rod is lowered, stirs, then is left leaning in the beaker.
    const a1=ang*Math.PI/180,top=[220+Math.sin(a1)*150,300-Math.cos(a1)*150-(1-dip)*120],bot=[220-Math.sin(a1)*18,318-(1-dip)*120],x1=r2(lerp(top[0],174,rest)),y1=r2(lerp(top[1],159,rest)),x2=r2(lerp(bot[0],266,rest)),y2=r2(lerp(bot[1],319,rest));
    svg+=`<g opacity="${r2(dip)}">`+path(`M${x1} ${y1}L${x2} ${y2}`,'#9bb8c5',6)+path(`M${x1} ${y1}L${x2} ${y2}`,'#e9f5fa',2)+'</g>';
    if(st>0&&st<1)for(let i=0;i<3;i++)svg+=path(`M${170+i*10} ${300-i*24}q${30-i*5} 14 ${100-i*20} 0`,'#8fc0d2',1.5,`opacity="${r2(.6*Math.sin(st*Math.PI))}"`);
   }
  }else{
   if(vinegar){for(let i=0;i<24;i++){const x=162+(i*31)%136,y=211+(i*23)%111;svg+=circle(x,y,3+(i%4),'#fcfeff','stroke="#7ba9bd" stroke-width="1"');}for(let i=0;i<14;i++)svg+=bubble(152+i*11.5,sy-2-rnd(i+80)*6,5);}
   else svg+=path('M174 159L266 319','#9bb8c5',6)+path('M174 159L266 319','#e9f5fa',2);
  }
  if(vinegar&&after&&k>=1)svg+=arrow(333,285,333,198,blue,2)+txt(383,245,'기포',19,blue);
  return frame(id,svg,after?'섞은 뒤 관찰':'섞기 전 준비',[['액체',vinegar?'식초를 준비했습니다.':'물을 준비했습니다.'],['넣는 물질',vinegar?'탄산수소 나트륨':'소금'],['관찰할 변화',after?(vinegar?'액체 속에서 기포가 발생합니다.':'소금 알갱이가 녹아 보이지 않습니다.'):'약숟가락에 담긴 고체와 액체의 처음 모습을 비교합니다.']]);
 }
 function groupDesign(s,v,a){
  const id='group',observe=s.stage==='observe',same=s.pair==='same',controlled=s.conditions==='controlled',k=prog(a);let svg=bench();
  for(const[x,name,reacts]of [[34,same?'리튬':'나트륨',true],[260,same?'나트륨':'마그네슘',same]]){
   svg+=beaker(id,x,125,168,213,.6)+txt(x+84,80,name,25)+txt(x+84,106,'찬물',17,muted);
   // Before the demonstration the piece is held above the water with tweezers; then it is dropped in.
   const rest=!same&&x===260?324:215,held=150,drop=observe?(k<1?easeOut(seg(k,0,.3)):1):0,y=r2(lerp(held,rest,drop));
   if(drop<.15)svg+=path(`M${x+96} 118L${x+86} ${r2(y+2)}M${x+104} 118L${x+90} ${r2(y+3)}`,'#7c8d96',3);
   svg+=`<path d="M${x+73} ${y}l20 -4 8 10 -23 7Z" fill="#879aa5" stroke="#526978"/>`;
   if(observe&&reacts){const b=k<1?seg(k,.28,1):1;
    for(let i=0;i<14;i++){const ph=(b*2.2+rnd(i+x))%1;if(b>rnd(i+3)*.3)svg+=bubble(x+70+rnd(i+7)*34+Math.sin(ph*8+i)*3,lerp(y+18,y-2,ph),r2(1.5+(i%3)*.8));}
   }
  }
  if(!controlled)svg+=rect(36,24,388,31,'#fff0dc',5)+txt(230,46,'비교 조건이 다름',17,'#925225');
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
 function dew(s,v,a){
  const id='dew',forms=v.metrics.forms,cold=s.cool==='yes',k=prog(a),P=a&&a.prev,wasCold=P&&P.kind===s.kind&&P.cool==='yes';let svg=bench();
  const grow=k<1?seg(k,.35,1):1;
  if(s.kind==='dew'){
   svg+=beaker(id,134,94,192,244,.64);
   // Ice is dropped into the cup, then droplets slowly appear on the outer surface.
   if(cold)[[172,195],[234,182],[205,220]].forEach(([x,y],i)=>{const t=k<1&&!wasCold?easeOut(seg(k,i*.06,.25+i*.06)):1,yy=r2(lerp(80,y,t));svg+=rect(x,yy,31,29,'#e4f7fc',5,'stroke="#7bb2c9" stroke-width="2" transform="rotate(12 '+x+' '+yy+')"');});
   if(cold&&k<1&&!wasCold){const q=seg(k,.18,.5);if(q>0&&q<1)svg+=ellipse(230,251,r2(30+60*q),r2(4+5*q),'none',`stroke="#6fa9bf" stroke-width="1.6" opacity="${r2(1-q)}"`);}
   if(forms)for(let i=0;i<16;i++){const x=153+(i*43)%153,y=176+(i*29)%132,g=clamp(grow*1.6-rnd(i)*.6);if(g<=0)continue;const sc=r2(.3+.7*g),slide=k<1?0:0;svg+=`<path transform="translate(${x} ${y+slide}) scale(${sc}) translate(${-x} ${-y})" d="M${x} ${y}q-9 13 0 13q9 0 0 -13" fill="#7cb9d4" fill-opacity=".85" stroke="#4a91b0" stroke-width=".8"/>`;}
   svg+=txt(230,59,cold?'차가운 컵':'냉각 전 컵',25)+path('M326 221H377V245','#87a9ba',1.5)+txt(377,270,'겉면',20,blue);
  }else{
   svg+=rect(79,84,302,255,'#455f72',14)+rect(79,84,302,255,`url(#${id}-glass)`,14,'stroke="#8cabb9" stroke-width="2"')+rect(91,65,278,23,cold?mix('#d5dfe4','#bed9e8',k<1&&!wasCold?seg(k,0,.3):1):'#d5dfe4',5)+txt(230,53,cold?'주변을 냉각':'냉각 전',24);
   if(forms)for(let i=0;i<90;i++){const g=clamp(grow*1.5-rnd(i)*.5);if(g<=0)continue;const drift=k<1?Math.sin(k*6+i)*3:0;svg+=circle(r2(96+(i*47)%270+drift),106+(i*31)%213,r2((2+(i%3))*(.5+.5*g)),'#fff',`opacity="${r2(.8*g)}"`);}
   svg+=txt(230,364,forms&&k>=1?'공기 중 작은 물방울':forms?'':'눈에 보이지 않는 수증기',19);
  }
  return frame(id,svg,s.kind==='dew'?'컵 겉면의 응결 관찰':'습한 공기의 응결 모형',[['수증기','기체 상태의 물은 눈에 보이지 않습니다.'],['물방울',s.kind==='dew'?'공기 속 수증기가 차가운 컵의 바깥 표면에서 응결합니다.':'작은 물방울을 보기 위해 어두운 배경을 둔 확대 모형입니다.'],['조건',forms?'수증기가 있고 충분히 냉각된 상태입니다.':'수증기와 냉각 조건을 바꾸어 비교하세요.']]);
 }
 function wind(s,v,a){
  const id='wind',warm=s.left==='warm',same=s.left==='same',active=!!v.metrics.direction,k=prog(a);
  let svg=bench()+rect(34,84,392,250,`url(#${id}-glass)`,12,'stroke="#799aaa" stroke-width="2.5"')+path('M230 111V277','#bdd0d8',2,'stroke-dasharray="6 5"');
  for(const[x,hot]of [[75,warm&&!same],[280,!warm&&!same]]){
   svg+=rect(x,278,105,42,hot?'#dca383':'#adccdf',7,'stroke="#819ba9"')+txt(x+52,305,same?'같은 온도':hot?'따뜻한 쪽':'차가운 쪽',15);
   if(hot&&!same)for(let i=0;i<3;i++)svg+=path(`M${x+22+i*30} 270q-6 -8 0 -16q6 -8 0 -16`,'#d88a5f',2,'opacity=".7"');
   if(!hot&&!same)for(let i=0;i<3;i++)svg+=rect(x+22+i*24,264,16,14,'#eef8fc',3,'stroke="#8fb4c6"');
  }
  if(active){
   const points=warm?[[326,248,134,248],[126,230,126,144],[143,132,315,132],[330,145,330,228]]:[[134,248,326,248],[330,230,330,144],[315,132,143,132],[126,145,126,228]];
   const show=k<1?seg(k,.45,1):1;
   if(show>0)svg+=points.map(([x,y,u,z])=>arrow(x,y,u,z,blue,4,`opacity="${r2(show)}"`)).join('');
   // Smoke markers travel around the loop to show the moving air.
   const loop=warm?[[330,248],[126,248],[126,132],[330,132]]:[[126,248],[330,248],[330,132],[126,132]],lens=[204,116,204,116],total=640;
   for(let i=0;i<12;i++){let d=((k*1.1+i/12)%1)*total,j=0;while(d>lens[j]){d-=lens[j];j++;}const [x1,y1]=loop[j],[x2,y2]=loop[(j+1)%4],t=d/lens[j];svg+=circle(r2(lerp(x1,x2,t)),r2(lerp(y1,y2,t)+Math.sin(i*2.3+k*9)*3),r2(5+rnd(i)*3),'#8a9aa3',`opacity="${r2(k<1?.32:.22)}"`);}
  }
  svg+=txt(230,54,'두 구역의 공기 흐름',25);
  return frame(id,svg,active?'온도 차이가 있는 두 구역의 대류':'흐름을 비교하기 전',[['아래쪽 흐름','차가운 쪽에서 따뜻한 쪽으로 이동합니다.'],['위아래 순환','따뜻한 쪽에서 상승하고 차가운 쪽에서 하강합니다.'],['회색 연기 점','공기가 움직이는 길을 보여 줍니다. 점선은 벽이 아닙니다.']]);
 }
 function photosynthesis(s,v,a){
  const id='photo',after=+s.step>0,k=prog(a),P=a&&a.prev;let svg=bench();
  if(!after){
   svg+=`<path d="M86 327V106Q86 74 118 74H342Q374 74 374 106V327Z" fill="url(#${id}-glass)" stroke="#8caab5" stroke-width="2"/>`+rect(135,312,190,18,'#9f8770',6)+`<path d="M189 281H271L260 315H200Z" fill="#b88b67"/>`+path('M230 282V130','#4c7653',5)+leaf(230,176)+leaf(230,219,-1)+leaf(230,141,-1);
   if(s.light==='off'){const drop=k<1&&P&&P.light!=='off'?easeOut(k):1;svg+=`<g transform="translate(0 ${r2(-300*(1-drop))})">`+rect(82,67,296,271,'#43525c',9,'opacity=".83"')+txt(230,183,'차광 덮개',24,'#fff')+'</g>';}
   else{const ray=k<1&&P&&P.light==='off'?seg(k,.1,.9):1;svg+=circle(34,58,20,'#f6cf63','stroke="#e1a93a" stroke-width="2"');
    for(const [x,y,u,z]of [[52,80,88,139],[56,104,91,183]]){const t=ease(ray);if(t>.05)svg+=arrow(x,y,r2(lerp(x,u,t)),r2(lerp(y,z,t)),'#c79232',3);}
    svg+=txt(70,40,'빛',22,orange);}
   svg+=txt(230,45,s.co2==='present'?'이산화 탄소 공급':'이산화 탄소 제거',23);
  }else{
   // Iodine drops fall from the dropper, then the colour spreads through the leaf.
   const fresh=P&&!(+P.step>0)&&k<1,stain=fresh?seg(k,.4,1):1,final=v.metrics.starch?'#354a70':'#b99966';
   svg+=ellipse(230,259,164,78,'#ebf4f7','stroke="#8da7b3" stroke-width="3"')+ellipse(230,254,145,61,'#fbfdfe','stroke="#bdcfd7"')+`<g transform="translate(274 280) scale(1.7)">${leaf(0,0,1,mix('#e4dcae',final,stain))}</g>`;
   svg+=path('M283 76L251 160','#6a8999',9)+path('M283 76L251 160','#c1d1db',3)+ellipse(248,181,4,7,'#926743');
   if(fresh)for(let i=0;i<3;i++){const t=seg(k,i*.12,.18+i*.12);if(t>0&&t<1)svg+=ellipse(248,r2(lerp(186,242,t*t)),3.5,5.5,'#926743');else if(t>=1&&stain<1)svg+=ellipse(r2(226+i*14),245,r2(6+16*stain),r2(3+6*stain),'#7a5a3a',`opacity="${r2(.5*(1-stain))}"`);}
   svg+=txt(340,110,'아이오딘',19)+txt(340,136,'용액',19)+txt(230,50,'처리한 잎의 색 반응',24);
  }
  return frame(id,svg,after?'잎을 꺼내 전처리한 뒤 녹말 검사':'빛과 이산화 탄소 조건 비교',[['실험 전','처음 남아 있던 녹말을 없앤 같은 식물을 준비합니다.'],['녹말 검사','관찰 뒤 잎을 탈색하는 전처리를 거쳐 아이오딘 반응을 확인합니다.'],['색이 나타나는 곳','검사한 잎입니다. 살아 있는 식물 전체가 청람색으로 변하는 것이 아닙니다.']]);
 }
 function heating(s,v,a){
  const id='heating',k=prog(a);let svg=bench();
  const temp=a&&k<1?lerp(a.prevView?.metrics?.temp??20,v.metrics.temp,ease(seg(k,.15,1))):v.metrics.temp;
  if(s.insulation==='yes')svg+=rect(98,88,264,263,'#d8ddcc',16,'stroke="#9ca58c" stroke-width="2"');
  svg+=beaker(id,119,119,222,123,.65)+rect(105,245,250,12,'#8397a2',5)+beaker(id,128,264,204,79,.55)+path('M111 108V331M349 108V331','#a0b0b9',5);
  svg+=rect(261,37,48,56,'#beced6',8)+rect(267,45,36,22,'#f2f5df',3)+txt(285,61,temp.toFixed(0),14)+path('M285 93V212','#738b96',4)+txt(359,55,'℃',21);
  if(v.metrics.heat){
   if(k<1){// The reaction fizzes and warm water rises in the upper container.
    for(let i=0;i<10;i++){const ph=(k*2.2+rnd(i))%1;svg+=bubble(150+rnd(i+4)*160,lerp(338,302,ph),1.5+rnd(i+9)*2);}
    for(const x of [175,226]){const t=(k*1.6+x/400)%1;svg+=`<g opacity="${r2(Math.sin(t*Math.PI))}">`+arrow(x,r2(300-t*40),x,r2(250-t*40),orange,4)+'</g>';}
    for(let i=0;i<4;i++){const t=(k*1.3+i/4)%1;svg+=path(`M${160+i*40} ${r2(226-t*60)}q-6 -8 0 -16q6 -8 0 -16`,'#d98a5c',2,`opacity="${r2(.6*Math.sin(t*Math.PI)*seg(k,.2,.5))}"`);}
   }else for(const x of [175,226])svg+=arrow(x,292,x,204,orange,4);
  }
  return frame(id,svg,'반응부와 물 용기를 분리한 단면 모형',[['위쪽 용기','음식 대신 물을 담고 온도 변화를 비교합니다.'],['아래쪽 반응부',s.reaction==='calcium'?'산화 칼슘과 물의 반응을 나타냅니다.':'물만 있는 대조군입니다.'],['분리 구조','반응물은 위쪽 물과 섞이지 않으며 반응부는 밀폐하지 않습니다.']]);
 }
 const thermalTemps=(material,tau)=>Array.from({length:8},(_,i)=>20+60*(1-Math.exp(-tau*(material==='metal'?1.2:.3)))*Math.exp(-i/(material==='metal'?3:1)));
 const heatColor=temp=>`hsl(${r2(210-(temp-20)/60*210)} 65% 61%)`;
 function thermal(s,v,a){
  const id='thermal',k=prog(a),metal=s.material==='metal',x0=62,cw=42;
  let temps=v.metrics.temps,tau=+s.time;
  if(a&&k<1){const P=a.prev,from=P&&P.material===s.material&&+P.time<+s.time?+P.time:0;tau=lerp(from,+s.time,k);temps=thermalTemps(s.material,tau);}
  let svg=bench()+txt(230,38,'위치별 온도 (℃)',22);
  // Clamp stand at the far end holds the rod; an alcohol lamp heats the near end.
  svg+=rect(400,342,56,10,'#687c8a',5)+rect(424,58,8,288,`url(#${id}-metal)`,3);
  svg+=rect(52,56,356,64,'#f7fafb',9,'stroke="#cfdae0" stroke-width="1.5"');
  temps.forEach((temp,i)=>{svg+=rect(x0+i*cw,62,cw,52,heatColor(temp),i===0?5:i===7?5:0,'stroke="#fff" stroke-width="1"')+txt(x0+cw/2+i*cw,148,temp.toFixed(0),17)+path(`M${x0+cw/2+i*cw} 156V170`,'#c3d1d8',1.2,'stroke-dasharray="3 3"');});
  svg+=metal?rect(x0,172,336,16,`url(#${id}-metal)`,4,'stroke="#66777f" stroke-width="1.5"'):rect(x0,172,336,16,'#e4d6b6',4,'stroke="#a8946c" stroke-width="1.5"');
  for(let i=0;i<8;i++)svg+=path(`M${x0+cw/2+i*cw} 188v6`,'#7d939e',1.5);
  svg+=rect(392,165,40,30,'#5f7480',5);
  // Alcohol lamp.
  svg+=`<path d="M58 346Q50 306 70 290H96Q116 306 108 346Z" fill="#dcedf3" stroke="#8eaab6" stroke-width="2"/>`+`<path d="M56 326H110L108 346H58Z" fill="#bfe0ea" opacity=".8"/>`+rect(75,276,16,16,'#b9c7cf',3)+rect(81,266,4,12,'#6b5a45',1);
  if(+s.time>0||(a&&k<1)){const f=k<1?1+Math.sin(k*47)*.08:1,w=k<1?1+Math.sin(k*31+1)*.1:1;svg+=flameShape(83,268,r2(1.45*f),w)+ellipse(83,262,6,4,'#7fb2e0','opacity=".75"');}
  svg+=txt(104,242,'가열',18,orange,'start');
  svg+=txt(270,250,'색 눈금',16,muted);
  for(let i=0;i<30;i++)svg+=rect(r2(150+i*8),262,8.4,14,heatColor(20+i/29*60),0);
  svg+=rect(150,262,240,14,'none',2,'stroke="#9fb3bd" stroke-width="1"')+txt(150,302,'20 ℃',17)+txt(390,302,'80 ℃',17);
  return frame(id,svg,(metal?'금속 막대':'열이 잘 전달되지 않는 막대')+'를 한쪽 끝에서 가열',[['고정된 색상 척도','20~80 ℃를 모든 재료·시점에 똑같이 적용합니다.'],['색상의 의미','막대 위 띠는 모형 온도를 나타내는 가상 열화상입니다. 막대 자체가 이 색으로 변하는 것은 아닙니다.'],['수치의 의미','위치별 비교용 계산값이며 실제 카메라 측정값이 아닙니다.']]);
 }
 function erosion(s,v,a){
  const id='erosion',after=+s.step>0,steep=s.slope==='steep',top=steep?140:191,k=after?prog(a):1,big=s.water==='large';
  let svg=bench()+rect(30,305,400,38,'#b8cbd4',8)+path('M33 307H427','#ebf3f6',4);
  svg+=`<path d="M44 ${top}H143L306 298H418V326H44Z" fill="#c8aa84" stroke="#a58965" stroke-width="2"/>`;
  svg+=`<path d="M44 ${top}H143L306 298H418" fill="none" stroke="#e6d1ad" stroke-width="8"/>`;
  const remaining=v.metrics.remaining,moved=v.metrics.moved,stream=after?(k<1?seg(k,.12,.45):1):0;
  if(stream>0)svg+=`<path d="M92 ${top-3}H139Q207 ${top+55} 303 294Q346 304 412 297" fill="none" stroke="#83b9cc" stroke-width="${big?12:6}" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${r2(1-stream)}"/>`;
  if(after&&k<1&&stream>.6)for(let i=0;i<6;i++){const t=(k*3+i/6)%1;svg+=path(`M${r2(lerp(150,300,t))} ${r2(lerp(top+10,292,t))}l10 ${r2((298-top)/16)}`,'#e7f4f8',2,`opacity="${r2(.8*Math.sin(t*Math.PI))}"`);}
  // Soil grains are carried down the slope one after another and settle at the bottom.
  const hill=j=>[63+(j%6)*13,top+14+Math.floor(j/6)*10],low=i=>[316+(i%7)*12,294-Math.floor(i/7)*6];
  for(let j=0;j<20;j++){
   if(j<remaining){const[x,y]=hill(j);svg+=circle(x,y,2.5,'#94724a');continue;}
   const m=j-remaining,[ex,ey]=low(m);
   if(k>=1){svg+=circle(ex,ey,3,'#93724e');continue;}
   const st=.32+.42*m/Math.max(1,moved),t=easeOut(seg(k,st,st+.24)),[sx,sy]=hill(j),cx=224,cy=(top+298)/2-6;
   const x=(1-t)*(1-t)*sx+2*(1-t)*t*cx+t*t*ex,y=(1-t)*(1-t)*sy+2*(1-t)*t*cy+t*t*ey;svg+=circle(r2(x),r2(y),r2(2.5+.5*t),'#94724a');
  }
  const tilt=after&&k<1?40*ease(seg(k,0,.12))*(1-seg(k,.85,1)):0;
  svg+=`<g transform="translate(50 ${top-85}) rotate(${r2(tilt)} 24 10)"><path d="M0 0H48L41 49H7Z" fill="url(#erosion-glass)" stroke="#7394a5" stroke-width="2"/>${path('M10 17H39','#8bbbc9',3)}</g>`;
  if(tilt>8)for(let i=0;i<4;i++){const t=(k*5+i/4)%1;svg+=circle(r2(82+t*6),r2(lerp(top-38,top-4,t)),big?3.4:2.4,'#83b9cc');}
  svg+=txt(94,top-100,'물을 붓는 곳',19)+txt(226,top+14,'침식',18,muted)+txt(353,275,'퇴적',18,muted);
  return frame(id,svg,after?'물을 흘린 뒤의 흙받이':'같은 흙을 담은 투명한 받침',[['흙 언덕','경사와 물의 양을 한 가지씩 바꾸어 비교합니다.'],['흙 알갱이','옮겨진 알갱이는 아래쪽에 모입니다. 전체 모형 알갱이 수는 같습니다.'],['물의 흐름','언덕의 높은 곳에서 낮은 곳으로 흐릅니다. 표시한 굵기는 물의 양을 구별하는 기호입니다.']]);
 }
 function seaLevel(s,v){
  const id='sea',after=+s.step>0,land=s.ice==='land',level=251-v.metrics.rise;
  let svg=bench()+beaker(id,32,83,396,259,0);
  svg+=`<path d="M251 335V188H312L329 247H378L407 335Z" fill="#c2ad8c" stroke="#9e8b6d" stroke-width="2"/>`;
  svg+=rect(333,209,37,38,'#e6c99e',3,'data-sea-house=""')+`<path d="M326 210L351 188L377 210Z" fill="#a87854"/>`+rect(345,225,11,22,'#657b80',1);
  svg+=`<path d="M43 ${level}H417V325Q417 335 407 335H53Q43 335 43 325Z" fill="#a7d1e2" fill-opacity=".6" data-sea-water="" data-level="${level}"/>`+path(`M44 ${level}H416`,blue,2);
  svg+=path('M44 251H411','#7596a3',1.5,'stroke-dasharray="5 5"');
  if(!after){const x=land?261:129,y=land?148:229;svg+=`<path d="M${x} ${y+5}l20 -5 32 8 -4 30 -44 -1Z" fill="#e6f6fc" stroke="#87b8cd" stroke-width="2"/>`+path(`M${x+20} ${y}l7 30`, '#afcfde',1);}
  svg+=txt(129,77,land?'육지 위 얼음':'떠 있는 얼음',22)+txt(121,301,'처음 수면',17,muted)+path('M121 281V254',muted,1.5);
  return frame(id,svg,after?'얼음이 녹은 뒤 처음 수면과 비교':'얼음이 녹기 전의 수면 표시',[['점선','처음 수면입니다. 모든 조건에서 같은 기준을 사용합니다.'],['물에 더해진 물',land?'육지 위에 있던 얼음이 녹아 물에 합쳐집니다.':'떠 있는 얼음은 처음부터 물을 밀어내고 있었습니다.'],['해안 모형','처음 수면 표시와 낮은 해안의 위치를 비교합니다. 실제 침수 규모를 나타내지 않습니다.']]);
 }
 function house(s,v,a){
  const id='house',k=prog(a);let svg=bench();
  let tau=+s.time;
  if(a&&k<1){const P=a.prev,from=P&&P.wall===s.wall&&P.window===s.window&&+P.time<+s.time?+P.time:0;tau=lerp(from,+s.time,k);}
  for(const [x,label,kc,final,insulated,open]of [[29,'기준 집',.065,v.metrics.reference,false,false],[249,'선택한 집',v.metrics.k,v.metrics.temp,s.wall==='insulated',s.window==='open']]){
   const temp=k<1?10+25*Math.exp(-kc*tau):final,room=mix('#dce8ee','#f7d5bb',(temp-10)/25);
   svg+=txt(x+91,49,label,23)+`<path d="M${x} 145L${x+91} 85L${x+182} 145" fill="#7e939d" stroke="#4d6978" stroke-width="3"/>`+rect(x+10,146,162,182,room,4,'stroke="#a7a395" stroke-width="2"');
   if(insulated)svg+=path(`M${x+16} 321V151H${x+166}V321`,'#afc6aa',9);
   svg+=rect(x+39,175,104,70,'#f6f9f9',3,'stroke="#7897a5" stroke-width="3"')+rect(x+44,180,94,60,'#d4e8ed',1);
   svg+=path(`M${x+91} 177V245 M${x+40} 210H${x+143}`,'#8faab5',2);
   // Heat leaves through the walls; wavy marks drift outward while time passes.
   if(k<1&&tau>0){const n=insulated?1:3,width=insulated?1.5:2.5;for(const side of [-1,1])for(let i=0;i<n;i++){const t=(k*2.4+i/n)%1,bx=side<0?x+8:x+174,y=268+i*18,dx=side*(4+t*14);svg+=path(`M${r2(bx+dx)} ${y}q${side*4} -5 ${side*8} 0q${side*4} 5 ${side*8} 0`,'#d9864f',width,`opacity="${r2(Math.sin(t*Math.PI)*.9)}"`);}}
   if(open)svg+=`<path d="M${x+93} 178l35 11v39l-35 16Z" fill="#fff" fill-opacity=".9" stroke="#718e9d" stroke-width="2"/>`+(k<1?`<g opacity="${r2(.4+.6*Math.abs(Math.sin(k*9)))}">`+arrow(x+102,216,x+176,200,orange,2)+'</g>':arrow(x+102,216,x+176,200,orange,2));
   svg+=rect(x+42,265,98,39,'#fff',5,'stroke="#d1dce0"')+txt(x+91,292,temp.toFixed(1)+' ℃',21);
  }
  return frame(id,svg,'같은 크기·같은 처음 온도의 두 모형 집',[['기준 집','단열재 없이 창문을 닫았습니다.'],['연두색 벽 단면','선택한 집의 단열재입니다. 단열재는 열의 이동을 늦춥니다.'],['방 안 색과 온도','따뜻할수록 방 안이 주황빛입니다. 같은 시간이 지난 뒤의 모형값이며, 창문을 열면 공기를 통한 열 교환도 커집니다.']]);
 }
 function combustionProducts(s,v,a){
  // Preserve the independently checked reagent scene and its observation markers; motion is laid on top.
  const k=prog(a),P=a&&a.prev;let over='';
  if(k<1&&P){
   const stage=+s.step,fuelColor=s.fuel==='alcohol'?['#609bcc','#cfe6f7']:['#edaa47','#fde49a'];
   const fx=s.test==='common'?230:s.test==='cobalt'?175:105,fy=s.test==='common'?178:139;
   const burning=s.test==='common'?stage>0:stage===1;
   if(burning){const f=1+Math.sin(k*41)*.12,grow=+P.step===0?easeOut(seg(k,0,.3)):1;over+=circle(fx,fy-24,r2(34*grow),'#ffe7a8',`opacity="${r2(.25*grow)}"`)+flameShape(fx,fy,r2(.9*f*grow),r2(1+Math.sin(k*29)*.1),fuelColor[0],fuelColor[1]);
    for(let i=0;i<5;i++){const t=(k*1.8+i/5)%1;over+=path(`M${r2(fx-6+i*3+Math.sin(t*7+i)*5)} ${r2(fy-56-t*44)}q-5 -6 0 -12`,'#9fb0b8',2,`opacity="${r2(.55*Math.sin(t*Math.PI))}"`);}}
   if(stage===2&&s.test==='cobalt')over+=`<rect x="142" y="100" width="15" height="32" fill="${mix('#8aa5df','#d980a4',seg(k,.25,1))}"/>`;
   if(stage===2&&s.test==='lime'){const q=seg(k,.2,1);over+=`<g transform="translate(${r2(Math.sin(k*40)*2*(1-q))} 0)"><rect x="302" y="159" width="76" height="30" fill="${mix('#bfe2ec','#eeeede',q)}"/></g>`;}
  }
  return frame('combustion',`<g transform="translate(0 35) scale(1 1.08)">${v.svg}${over}</g>`,'연소 전 · 중 · 후에 같은 검출 도구 비교',[
   ['연소 장치',s.fuel==='candle'?'양초의 연소를 비교합니다.':'알코올의 연소를 비교합니다.'],
   ['검출 도구',s.test==='cobalt'?'염화 코발트 종이로 물을 확인합니다.':s.test==='lime'?'석회수의 혼탁으로 이산화 탄소를 확인합니다.':'빛과 열이 나오는 공통 현상을 관찰합니다.'],
   ['판독 시점','연소 중의 현상과 연소 뒤 검출 결과를 구별합니다.']]);
 }
 function pushCompare(s,v,a){
  const id='push',k=prog(a),moved=v.metrics.moved,end=moved?278:112,heavy=s.load==='heavy',strong=s.push==='large';
  // The hand-arrow reaches the box, then the box slides and slows down on the floor (or stays put).
  let x=end,reach=1,jig=0;
  if(a&&k<1){reach=ease(seg(k,0,.3));x=moved?lerp(112,278,easeOut(seg(k,.25,1))):112;if(!moved)jig=Math.sin(seg(k,.25,.8)*Math.PI*6)*1.6*(1-seg(k,.25,.8));}
  x=r2(x+jig);
  let svg=bench()+rect(26,293,408,43,'#e2dbcf',7)+path('M32 295H428','#b2a690',2)+rect(112,197,90,94,'none',3,'stroke="#b2c4cb" stroke-width="2" stroke-dasharray="6 5"');
  svg+='<g>'+rect(x,199,90,94,heavy?'#a9875a':'#c6a477',4,'stroke="#957650" stroke-width="2"')+`<path d="M${x} 199l17 -16h90l-17 16Z" fill="#dfc9a7" stroke="#a88a64"/>`+`<path d="M${r2(x+90)} 199l17 -16v92l-17 18Z" fill="#ac8b60" stroke="#957650"/>`+rect(r2(x+34),201,22,90,'#e0c7a5',0)+'</g>';
  const ax=r2(x-10-(1-reach)*60);svg+=arrow(r2(ax-66),245,ax,245,orange,strong?7:3);
  if(a&&k<1&&moved&&k>.3)for(let i=0;i<3;i++)svg+=path(`M${r2(x-14-i*10)} ${284-i*4}h-${12+i*4}`,'#b9ab92',2,`opacity="${r2(.7*(1-seg(k,.3,1)))}"`);
  svg+=txt(159,156,'처음 위치',20,muted)+txt(230,86,heavy?'무거운 상자':'가벼운 상자',25)+txt(230,122,strong?'세게 밀기':'약하게 밀기',19,orange);
  return frame(id,svg,moved?'같은 바닥 위에서 상자가 움직임':'이 조건에서는 상자가 아직 움직이지 않음',[['점선 상자','움직이기 전의 위치입니다.'],['주황 화살표','같은 방향으로 미는 힘입니다. 두께로 약하게·세게를 구별합니다.'],['비교 조건','상자의 모양과 바닥은 같습니다. 이동 거리는 정량적인 측정값이 아닙니다.']]);
 }
 function altitude(s,v,a){
  const id='altitude',base=92,y=293,scale=100,k=prog(a),P=a&&a.prev;
  let deg=+s.angle,height=+s.height;
  if(P&&k<1){deg=lerp(+P.angle,deg,ease(k));height=lerp(+P.height,height,ease(k));}
  const a1=deg*Math.PI/180,shadow=k<1?height/Math.tan(a1):v.metrics.shadow,h=r2(height*scale),end=r2(base+shadow*scale);
  let svg=bench()+rect(26,y,408,36,'#ece6d8',4)+path(`M26 ${y}H434`,'#a9a28e',2)+path(`M${base} ${y}H${end}`,'#7c817a',7)+path(`M${base} ${y}V${y-h}`,'#6e8591',6)+circle(base,y-h,3,'#aec3cc');
  const sx=r2(base-40),sy=r2(y-h-40*Math.tan(a1));
  svg+=circle(Math.max(22,sx-10),Math.max(22,sy-10),13,'#f6cf63','stroke="#e1a93a" stroke-width="2" opacity=".9"');
  svg+=path(`M${end} ${y}L${sx} ${sy}`,'#d3a14a',2)+arrow(base-20,r2(y-h-20*Math.tan(a1)),base+24,r2(y-h+24*Math.tan(a1)),'#d3a14a',2);
  const radius=Math.min(35,(end-base)*.65),narrow=end-base<70;
  svg+=path(`M${r2(end-radius)} ${y}A${r2(radius)} ${r2(radius)} 0 0 1 ${r2(end-radius*Math.cos(a1))} ${r2(y-radius*Math.sin(a1))}`,orange,2)+txt(r2(narrow?end+35:end-54*Math.cos(a1/2)),r2(narrow?y-25:y-54*Math.sin(a1/2)-5),Math.round(deg)+'°',18,orange);
  svg+=path(`M${base+13} ${y}v-13h-13`,'#859496',1.5)+txt(52,r2(y-h/2),r2(height)+' m',16,muted)+txt(r2((base+end)/2),y+30,shadow.toFixed(2)+' m',17)+txt(230,49,'막대와 그림자로 만든 직각삼각형',22);
  return frame(id,svg,'평평한 바닥에 세운 수직 막대와 그림자',[['회색 막대','높이를 고정한 수직 막대입니다.'],['바닥 위 진한 선','태양 반대쪽에 생긴 그림자입니다.'],['고도 각도','그림자 끝에서 막대 끝을 이은 선과 바닥이 이루는 각입니다. 그림의 가로·세로 배율이 같습니다.']]);
 }
 function dna(s,v,a){
  const colors={A:'#d6a354',T:'#568fa6',G:'#a17daf',C:'#599b85'},pair={A:'T',T:'A',G:'C',C:'G'},k=prog(a);let svg='';
  svg+=path('M107 72V316 M353 72V316','#91a9b5',6);
  for(let i=0;i<4;i++){const y=102+i*61,ch=s.sequence[i],b=s.partner[i],ok=pair[ch]===b,t=k<1?ease(seg(k,i*.13,i*.13+.45)):1,dx=r2((1-t)*92);
   svg+=circle(107,y,9,'#e6edf0','stroke="#809ba8" stroke-width="2"')+circle(353,y,9,'#e6edf0','stroke="#809ba8" stroke-width="2"')+rect(124,y-18,88,36,colors[ch],6)+txt(168,y+6,ch,21,'#fff');
   svg+=`<g transform="translate(${dx} 0)">`+rect(248,y-18,88,36,colors[b],6)+txt(292,y+6,b,21,'#fff')+'</g>';
   if(t>=1){if(ok)for(let n=0;n<(ch==='A'||ch==='T'?2:3);n++)svg+=path(`M218 ${y-5+n*5}H242`,'#78919c',1.5,'stroke-dasharray="3 3"');else svg+=txt(230,y+7,'×',25,'#a95243');}
  }
  svg+=txt(107,42,'첫째 가닥',21)+txt(353,42,'짝 가닥',21)+txt(230,355,'당·인산 골격과 염기쌍',20,muted);
  return frame('dna',svg,'염기쌍을 비교하기 위해 펼친 DNA 일부',[['바깥쪽 두 줄','당과 인산이 이어진 골격을 단순화했습니다.'],['가운데 염기쌍','A–T, G–C가 상보적으로 짝을 이룹니다. 점선은 수소 결합을 나타냅니다.'],['갈색 × 표시','고른 두 염기가 상보적인 짝이 아닙니다. 실제로 안정하게 결합한 모양이 아닙니다.']]);
 }
 function diagnostic(s,v,a){
  // Redrawn from the model: the sample front runs along the strip, or the reaction curve is traced.
  const k=prog(a),valid=v.metrics.valid,detected=v.metrics.detected;let g='';
  if(s.method==='protein'){
   const front=k<1?lerp(128,392,ease(seg(k,.05,.8))):392;
   g+=rect(60,95,340,105,'#e8eff2',8,'stroke="#c3d2da" stroke-width="1.5"')+rect(70,104,320,87,'#f8fbfc',4)+txt(190,80,'C',18)+txt(280,80,'T',18)+circle(110,149,18,'#c6d3da','stroke="#9fb3bd" stroke-width="1.5"');
   if(front>128)g+=rect(128,104,r2(front-128),87,'#cfe2ec',2,'opacity=".55"');
   const band=(x,show)=>{if(!show)return '';const o=k<1?seg(front,x,x+40):1;return o>0?`<path d="M${x} 120V175" stroke="#b66a86" stroke-width="6" stroke-linecap="round" opacity="${r2(o)}"/>`:'';};
   g+=band(190,valid)+band(280,s.target==='present');
   if(k<1)g+=circle(110,149,r2(6+8*Math.abs(Math.sin(k*8))),'#9cc3d6','opacity=".5"');
  }else{
   const curve=detected?'M60 235 L160 230 Q200 80 280 80 L400 80':'M60 235 L400 235',drawn=k<1?seg(k,.05,.9):1;
   g+=path('M55 245H410',ink,2)+path('M55 65V245',ink,2)+txt(110,45,'검출 신호',17)+txt(230,278,'반응 진행',17);
   g+=`<path d="${curve}" fill="none" stroke="#467e9b" stroke-width="4" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${r2(1-drawn)}"/>`;
   if(k>=1||drawn>=1)g+=txt(285,190,valid?'작동 대조 정상':'작동 대조 실패',17);
  }
  return frame('diagnostic',`<g transform="translate(0 38)">${g}</g>`,s.method==='nucleic'?'유전 물질 검출의 반응 신호 모형':'항원 검출의 작동 대조와 표적 신호',[['작동 대조','검사가 정상적으로 작동했는지 먼저 확인합니다.'],['표적 신호','표적이 충분한 가상 시료와 없는 시료를 비교합니다.'],['현재 판독',!valid?'작동 대조 실패 · 결과 무효':detected?'모형 시료에서 표적 검출':'모형 시료에서 표적 미검출']]);
 }
 function energyBudget(s,v,a){
  const m=v.metrics,k=prog(a),pm=a&&a.prevView?.metrics;
  const out=k<1&&pm?lerp(pm.outgoing,m.outgoing,ease(k)):m.outgoing,net=k<1&&pm?lerp(pm.net,m.net,ease(k)):m.net,warm=(st=>st.warmed?.2:st.net>0?.08:0);
  const glow=k<1&&pm?lerp(warm(pm),warm(m),ease(k)):warm(m);
  let svg=rect(24,33,412,286,'#f3f7fa',15)+ellipse(230,255,178,59,'#a9cedf')+(glow>0?ellipse(230,255,178,59,'#e9a46e',`opacity="${r2(glow)}"`):'')+`<path d="M83 253q45 -27 66 2t68 -4q47 -19 101 8l-20 25q-73 38-159 1Z" fill="#8db6a6"/>`+path('M53 222Q230 112 407 222','#a9c2d1',6);
  svg+=arrow(112,61,112,223,'#bc883a',8)+arrow(129,124,192,62,'#c6a86b',4)+arrow(321,232,321,65,'#b87765',r2(out/10));
  if(k<1){// Energy packets travel along each arrow.
   for(let i=0;i<5;i++){const t=(k*2+i/5)%1;svg+=circle(112,r2(lerp(64,216,t)),5,'#e0a440','opacity=".85"');}
   for(let i=0;i<2;i++){const t=(k*2+i/2)%1;svg+=circle(r2(lerp(132,188,t)),r2(lerp(120,66,t)),4,'#d6b97a','opacity=".85"');}
   const n=Math.round(out/14);for(let i=0;i<n;i++){const t=(k*2+i/n)%1;svg+=circle(321,r2(lerp(226,72,t)),4.5,'#c98a77','opacity=".85"');}
  }
  svg+=txt(113,45,'100',23,'#926725')+txt(207,92,'반사 30',16,'#9a773c')+txt(338,47,String(Math.round(out)),23,'#9e5a4c')+txt(88,294,'흡수 70',17)+txt(230,356,'순 유입 '+Math.round(net)+' 단위',23);
  return frame('energy',svg,'대기권 밖에서 비교하는 지구 전체의 에너지 출입',[['들어오는 에너지','입사 에너지 100 중 30을 반사하고 70을 흡수합니다.'],['우주로 방출하는 에너지','온실효과가 강해진 직후와 온도가 오른 뒤의 새 평형을 구별합니다.'],['그림의 경계','지표와 대기의 내부 교환은 생략했습니다. 화살표는 정규화한 에너지 출입이며 실제 관측값이 아닙니다.']]);
 }
 function population(s,v,a){
  const m=v.metrics,x=i=>60+i*28,y=n=>r2(306-n*2.5),k=prog(a);let svg='';
  for(let n=0;n<=80;n+=20)svg+=path(`M60 ${y(n)}H396`,'#dfe8ec',1)+txt(41,y(n)+5,n,14,muted);
  svg+=path('M60 88V306H399','#78919e',2)+txt(60,63,'개체 수',18,muted)+txt(230,366,'시간 (모형 시점)',18,muted);
  for(let i=0;i<=12;i+=3)svg+=txt(x(i),332,i,16,muted);
  let limit='M60 '+y(m.capacities[0]);for(let i=1;i<m.capacities.length;i++)limit+=`H${x(i)}V${y(m.capacities[i])}`;
  svg+=path(limit,'#b29168',2,'stroke-dasharray="5 5"');
  // The curve is traced point by point, as the population is counted over time.
  const reach=k<1?ease(k)*12:12,last=Math.floor(reach),frac=reach-last;
  let d=m.values.slice(0,last+1).map((n,i)=>(i?'L':'M')+x(i)+' '+y(n)).join(' ');
  if(last<12)d+=` L${r2(lerp(x(last),x(last+1),frac))} ${r2(lerp(y(m.values[last]),y(m.values[last+1]),frac))}`;
  svg+=path(d,blue,3);
  m.values.forEach((n,i)=>{if(i<=last)svg+=circle(x(i),y(n),3.3,'#fff','stroke="'+blue+'" stroke-width="2"');});
  return frame('population',svg,'처음 개체 수와 환경 조건에 따른 변화',[['파란 선과 점','시간이 지날 때의 모형 개체 수입니다.'],['갈색 점선','먹이와 공간에 따른 환경 수용 한계입니다.'],['중간 환경 변화',s.event==='loss'?'5시점부터 서식 공간이 줄어듭니다.':'같은 먹이·공간 조건을 유지합니다.']]);
 }
 function emission(s,v,a){
  const m=v.metrics,x=n=>r2(47+(n-450)/250*366),color=n=>n<500?'#71c9e5':n<600?'#efc06c':'#f18c79',k=prog(a),P=a&&a.prev;let svg='';
  for(const [title,top,lines,changed]of [['관찰 광원',77,m.lines,!P||P.sample!==s.sample],['비교 기준',218,m.reference,!P||P.reference!==s.reference]]){
   const g=k<1&&changed?ease(k):1,half=r2(22.5*g),mid=top+29.5;
   svg+=txt(45,top-20,title,21,ink,'start')+rect(33,top,393,59,'#142b3b',7);
   for(const n of lines)if(g>0)svg+=path(`M${x(n)} ${r2(mid-half)}V${r2(mid+half)}`,color(n),4)+path(`M${x(n)} ${r2(mid-half+1)}V${r2(mid+half-1)}`,color(n),10,`opacity="${r2(.1*g)}"`);
  }
  for(let n=450;n<=700;n+=50){svg+=path(`M${x(n)} 281v7`,'#8ea5b0',1)+txt(x(n),311,n,16,muted);}
  svg+=txt(230,351,'파장 (nm)',19,muted);
  return frame('emission',svg,'같은 파장 눈금에 나란히 놓은 두 스펙트럼',[['세로로 밝은 선','선이 나타나는 파장 위치를 비교합니다.'],['혼합 광원','수소와 헬륨의 선택된 선이 함께 나타납니다.'],['표시 범위','450~700 nm에서 각 원소의 두 선만 골랐습니다. 선의 상대적인 밝기와 전체 선 목록은 생략했습니다.']]);
 }
 function planets(s,v,a){
  const names=v.metrics.names,k=prog(a),prev=a&&a.prev?(a.prev.inner+','+a.prev.outer).split(','):names,colors={'수성':'#aaa69d','금성':'#d8b37d','지구':'#619db6','화성':'#c68165','목성':'#bd9f82','토성':'#ceba83','천왕성':'#88bdc6','해왕성':'#6088b7'};let svg=txt(230,40,'태양에서 가까운 순서',23)+circle(39,86,16,'#deb360')+arrow(70,86,416,86,'#9daeb7',2);
  const slot=i=>[70+i%4*107,158+Math.floor(i/4)*144];
  names.forEach((name,i)=>{const[x1,y1]=slot(i),j=prev.indexOf(name),[x0,y0]=slot(j<0?i:j),t=k<1?ease(k):1,lift=k<1&&j!==i?Math.sin(t*Math.PI)*26*(x1>=x0?1:-1):0,x=r2(lerp(x0,x1,t)),y=r2(lerp(y0,y1,t)-lift),r=['목성','토성'].includes(name)?25:19;
   svg+=circle(x,y,r,colors[name],'stroke="#fff" stroke-width="1.5"')+ellipse(r2(x-6),r2(y-6),r2(r*.4),r2(r*.7),'#fff','opacity=".12" transform="rotate(30 '+x+' '+y+')"');
   if(name==='지구')svg+=`<path d="M${r2(x-10)} ${r2(y-12)}l12 5 -6 8 -9 -2 7 -5 M${r2(x+2)} ${r2(y+2)}l10 2 -4 9 -7 -3Z" fill="#a1c6a8"/>`;
   if(name==='목성')svg+=path(`M${r2(x-22)} ${r2(y-8)}q22 7 44 0 M${r2(x-22)} ${r2(y+9)}q22 -4 44 0`,'#d9bea1',5);
   if(name==='토성')svg+=ellipse(x,y,39,10,'none','stroke="#aa996e" stroke-width="4" transform="rotate(-18 '+x+' '+y+')"');
   svg+=txt(x1,y1+52,(i+1)+'. '+name,18,ink,'middle',k<1&&j!==i?`opacity="${r2(seg(k,.7,1))}"`:'');
  });
  return frame('planets',svg,'가까운 네 행성 다음에 바깥쪽 네 행성',[['읽는 순서','윗줄 왼쪽부터 1~4번, 아랫줄 왼쪽부터 5~8번입니다.'],['표면의 특징','지구의 바다와 육지, 목성의 띠, 토성의 고리를 구별했습니다.'],['모형의 비율','크기·거리·색은 비교를 돕는 표현입니다. 실제 비율이나 현재 행성 위치가 아닙니다.']]);
 }
 function plantGeom(st,perennial){
  const next=st.stage==='next',winter=st.stage==='winter',annualAlive=st.stage==='first',stem=!next||perennial;
  return{live:perennial||annualAlive,stem:stem?1:0,top:winter?144:next?134:93,leaves:stem&&!winter?1:0,flower:!perennial&&annualAlive?1:0,green:(annualAlive||perennial&&!winter)?1:0,sprout:!perennial&&next&&st.seed==='present'?1:0};
 }
 function plantTypes(s,v,a){
  // Same layout as the comparison model; stems grow or wither between seasons.
  const k=prog(a),P=a&&a.prev,t=k<1?ease(k):1,ink2='#173f50';let g='';
  const T=(str,x,y,size)=>txt(x,y,str,size,ink2);
  for(const [x,perennial]of [[120,false],[340,true]]){
   const A=plantGeom(s,perennial),B=P&&k<1?plantGeom(P,perennial):A,L=key=>lerp(B[key],A[key],t);
   g+=T(perennial?'여러해살이 풀':'한해살이 풀',x,25,17)+rect(x-84,187,168,55,'#eadcc6',4)+path(`M${x-84} 187H${x+84}`,'#9b8568',2);
   const rootColor=mix('#b0a092','#759554',L('live')),stemColor=mix('#aa9680','#64894c',L('green'));
   g+=`<path d="M${x} 183 v40 m0-25 l-20 20 m20-13 20 21 m-20-16 -8 23" fill="none" stroke="${rootColor}" stroke-width="3" data-root-alive="${A.live}"/>`;
   const stem=L('stem'),top=r2(B.stem&&A.stem?L('top'):A.stem?A.top:B.top);
   if(stem>0){const shown=r2(lerp(187,top,A.stem?1:clamp(stem*1.2)));g+=`<g opacity="${r2(clamp(stem*1.5))}">`+path(`M${x} 187V${shown}`,stemColor,4);
    const lv=L('leaves');if(lv>0)g+=`<g transform="translate(${x} ${r2(top+24)}) scale(${r2(lv)}) translate(${-x} ${r2(-top-24)})"><path d="M${x} ${top+33} q-38-34-38-9 q5 19 38 9 M${x} ${top+15} q38-30 38-5 q-9 16-38 5" fill="#8faf68" stroke="#6a8e4e"/></g>`;
    const fl=L('flower');if(fl>0)g+=`<g opacity="${r2(fl)}">`+circle(x,top,10,'#dbbc66')+circle(x,top,4,'#a68540')+'</g>';
    g+='</g>';}
   const sp=L('sprout');if(sp>0){const h=r2(39*sp);g+=circle(x+39,204,5,'#be9b65')+path(`M${x+39} 204V${r2(204-h)}`,'#739951',3)+`<g transform="translate(${x+39} ${r2(204-h+12)}) scale(${r2(sp)})"><path d="M0 0 q-20-22-24-9 q4 12 24 9 m0-7 q20-18 24-5 q-4 10-24 5" fill="#9ab876"/></g>`;if(A.sprout)g+=txt(x+42,148,'새 개체',14,ink2,'middle',sp<1?`opacity="${r2(sp)}"`:'');}
   g+=T(A.live?'같은 개체가 살아 있음':'처음 개체의 한살이 끝',x,268,14);
  }
  return frame('plant-types',`<g transform="translate(0 38) scale(1 1.12)">${g}</g>`,'같은 개체를 첫해부터 다음 해까지 관찰',[['한해살이의 처음 개체',v.metrics.annualAlive?'같은 개체가 자라고 있습니다.':'처음 개체의 한살이가 끝났습니다.'],['여러해살이의 처음 개체','살아남은 땅속 부분을 통해 같은 개체가 이어집니다.'],['새 씨앗과 새 개체',v.metrics.newAnnual?'씨앗에서 난 새 개체입니다. 처음 개체가 되살아난 것이 아닙니다.':'새 씨앗에서 난 개체는 아직 없습니다.']]);
 }
 const renderers={'compound-conductivity':conductivity,spring,buoyancy,'mix-change':mixing,'group-design':groupDesign,'tuning-fork':tuningFork,'dew-fog':dew,'wind-chamber':wind,'photosynthesis-co2':photosynthesis,'heating-device':heating,'thermal-image':thermal,erosion,'sea-level':seaLevel,'efficient-house':house,'combustion-products':combustionProducts,'push-compare':pushCompare,'altitude-meter':altitude,'dna-model':dna,'diagnostic-principle':diagnostic,'energy-budget':energyBudget,'population-change':population,'emission-spectrum':emission,'planet-model':planets,'plant-life-types':plantTypes};
 // How long (ms) the change from one state to the next plays; 0 = just redraw.
 const differs=(p,s,keys)=>(keys||Object.keys(s)).some(key=>String(p[key])!==String(s[key]));
 const motions={
  'compound-conductivity':(p,s)=>differs(p,s)?1500:0,
  spring:(p,s)=>differs(p,s)?1800:0,
  buoyancy:(p,s)=>differs(p,s)?1600:0,
  'mix-change':(p,s)=>+s.step>0&&differs(p,s)?2800:0,
  'group-design':(p,s)=>s.stage==='observe'&&differs(p,s,['stage','pair'])?2400:0,
  'dew-fog':(p,s)=>s.cool==='yes'&&differs(p,s)?2400:0,
  'wind-chamber':(p,s)=>+s.step>0&&s.left!=='same'&&differs(p,s)?3000:0,
  'photosynthesis-co2':(p,s)=>+s.step>0&&!(+p.step>0)?2600:!(+s.step>0)&&p.light!==s.light&&!(+p.step>0)?1200:0,
  // neutralization-common/heat-views.js repaints this figure with its own animated drawing.
  'heating-device':()=>0,
  'thermal-image':(p,s)=>{const t=+s.time;if(!t)return 0;const from=p.material===s.material&&+p.time<t?+p.time:p.material!==s.material?0:-1;return from<0?0:Math.min(2700,Math.max(900,(t-from)*900));},
  erosion:(p,s)=>+s.step>0&&differs(p,s)?3200:0,
  'efficient-house':(p,s)=>{const t=+s.time;if(!t)return 0;const same=p.wall===s.wall&&p.window===s.window,from=same&&+p.time<t?+p.time:same?-1:0;return from<0?0:Math.min(2400,Math.max(900,(t-from)*110));},
  'combustion-products':(p,s)=>+s.step>+p.step||(+s.step>0&&differs(p,s,['fuel','test']))?2000:0,
  'push-compare':(p,s)=>differs(p,s)?1600:0,
  'altitude-meter':(p,s)=>differs(p,s)?1200:0,
  'dna-model':(p,s)=>differs(p,s)?1300:0,
  'diagnostic-principle':(p,s)=>differs(p,s)?2200:0,
  'energy-budget':(p,s)=>differs(p,s)?2200:0,
  'population-change':(p,s)=>differs(p,s)?2000:0,
  'emission-spectrum':(p,s)=>differs(p,s)?900:0,
  'planet-model':(p,s)=>differs(p,s)?1200:0,
  'plant-life-types':(p,s)=>differs(p,s)?1800:0
 };
 const api={render:(id,s,v,anim)=>renderers[id]?.(s,v,anim),motion:(id,prev,s)=>prev&&motions[id]?motions[id](prev,s):0,ids:Object.keys(renderers)};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.scienceApparatusScenes=api;
})(typeof window==='undefined'?null:window);
