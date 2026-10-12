(function(){
 'use strict';
 const host=document.querySelector('[data-inquiry]');if(!host)return;
 const M=window.scienceInquiryModels,slug=host.dataset.inquiry,$=id=>document.getElementById(id);
 const scene=$('inquiryScene'),readout=$('inquiryReadout'),extra=$('inquiryExtra'),status=$('inquiryStatus');
 const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
 const val=id=>$(id).value,num=id=>Number(val(id));
 const fmt=(n,d=1)=>Number(n).toFixed(d);
 const text=(x,y,t,attrs='')=>`<text x="${x}" y="${y}" ${attrs}>${esc(t)}</text>`;
 let svgSerial=0;
 const svg=(body,label,w=540,h=310)=>{const scopedId="inquiry-arrow-"+(++svgSerial);return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}"><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#b65d20"/></marker></defs>${body}</svg>` .replaceAll('id="arrow"','id="'+scopedId+'"').replaceAll('url(#arrow)','url(#'+scopedId+')');};
 const line=(x1,y1,x2,y2,color='#527785',other='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2" ${other}/>`;
 const metrics=items=>readout.innerHTML=items.map(([label,value])=>`<div><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join('');
 const colors=['#1a7581','#ac5626','#7254ad'];
 let state={},timer=null;
 function stop(){if(timer)clearInterval(timer);timer=null;if($('play'))$('play').textContent='움직임 재생';if($('playWave'))$('playWave').textContent='발생판으로 파 만들기';}
 function labels(){host.querySelectorAll('input[type=range]').forEach(el=>{$(el.id+'Value').textContent=el.value+' '+el.dataset.unit;});}
 function chart(series,{xmin=0,xmax=60,ymin=0,ymax=80,xlabel='시간 (분)',ylabel='온도 (℃)'}={}){
  const px=x=>55+(x-xmin)/(xmax-xmin)*435,py=y=>225-(y-ymin)/(ymax-ymin)*170;
  let body='';for(let i=0;i<=4;i++){const y=ymin+(ymax-ymin)*i/4;body+=line(55,py(y),490,py(y),'#d3e2e8')+text(47,py(y)+5,fmt(y,0),'text-anchor="end"');const x=xmin+(xmax-xmin)*i/4;body+=text(px(x),248,fmt(x,0),'text-anchor="middle"');}
  body+=line(55,55,55,225)+line(55,225,490,225)+text(12,25,ylabel)+text(280,279,xlabel,'text-anchor="middle"');
  for(const [i,s]of series.entries()){body+=`<polyline points="${s.points.map(([x,y])=>px(x)+','+py(y)).join(' ')}" fill="none" stroke="${colors[i]}" stroke-width="3"/>`+text(85+i*150,305,s.name,`style="fill:${colors[i]}"`);}
  return svg(body,'시간에 따른 값의 변화 그래프',540,325);
 }
 function insulation(){
  const options={initial:val('mode')==='hot'?70:5,minutes:num('time'),thickness:num('thickness'),volume:num('volume')},rows=M.insulation(options);
  let body='';rows.forEach((r,i)=>{const x=45+i*170,top=178-(r.temperature/80)*122;body+=`<rect x="${x}" y="45" width="130" height="155" rx="8" fill="${['#e8ecef','#e4d8bd','#d6b77e'][i]}"/><rect x="${x+32}" y="55" width="65" height="145" fill="#eef7fb" stroke="#628899"/><rect x="${x+34}" y="105" width="61" height="92" fill="#b5dfea"/><rect x="${x+59}" y="35" width="10" height="150" rx="5" fill="white" stroke="#607481"/><rect x="${x+62}" y="${top}" width="4" height="${185-top}" fill="#c35b29"/>`+text(x+65,230,r.name,'text-anchor="middle"')+text(x+65,255,fmt(r.temperature)+' ℃','text-anchor="middle"');});
  scene.innerHTML=svg(body,'같은 조건의 단열재 세 종류와 물의 온도',540,275);
  metrics(rows.map(r=>[r.name,fmt(r.temperature)+' ℃']));
  extra.innerHTML=chart(rows.map((r,i)=>({name:r.name,points:Array.from({length:num('time')+1},(_,t)=>[t,M.insulation({...options,minutes:t})[i].temperature])})));
  status.textContent=`${num('time')}분 · 실온 20 ℃ · 물 ${num('volume')} mL · 세 장치의 단열층 두께 ${num('thickness')} cm. 조건을 바꾸면 같은 시각의 다른 실험을 비교합니다.`;
 }
 function doppler(){
  const r=M.doppler({frequency:num('frequency'),speed:num('speed'),direction:val('direction')}),spacing=42*440/r.source;
  let body='';for(let k=1;k<=7;k++){const radius=k*spacing,cx=175-r.velocity/343*radius;body+=`<circle cx="${cx}" cy="145" r="${radius}" fill="none" stroke="#5e9da6" stroke-width="2"/>`;}
  body+=`<rect x="148" y="120" width="52" height="50" rx="8" fill="#246f82"/><path d="M195 124L217 109V181L195 167Z" fill="#246f82"/><rect x="452" y="123" width="32" height="53" rx="5" fill="#355067"/>`+text(175,215,'음원','text-anchor="middle"')+text(466,215,'정지 수신기','text-anchor="middle"');
  if(r.velocity)body+=line(160,79,160+(r.velocity>0?65:-65),79,'#b65d20','marker-end="url(#arrow)"');
  body+=text(270,263,'대표 파면: 음원 앞뒤의 간격을 비교하세요.','text-anchor="middle"');scene.innerHTML=svg(body,'이동하는 음원에서 퍼져 나가는 대표 파면',540,285);
  metrics([['음원 설정',fmt(r.source,0)+' Hz'],['수신 진동수',fmt(r.observed)+' Hz'],['수신 쪽 파장',fmt(r.wavelength,3)+' m']]);
  status.textContent=`공기의 음속 343 m/s · 수신기 정지. 수신 진동수는 음원 설정의 ${fmt(r.observed/r.source,3)}배입니다.`;
 }
 function acceleration(){
  const options={motion:val('motion'),speed:num('speed'),radius:num('radius'),time:num('time')},r=M.acceleration(options),cx=270,cy=140;
  $('radius').disabled=options.motion!=='circle';let body='',px,py;
  if(options.motion==='circle'){px=cx+r.x*10;py=cy-r.y*10;body+=`<circle cx="${cx}" cy="${cy}" r="${options.radius*10}" fill="none" stroke="#a6c3cd" stroke-width="3"/>`+text(cx,cy+5,'중심','text-anchor="middle"');}
  else if(options.motion==='elevator'){px=270;py=250-r.y/(10*options.speed)*205;body+=`<rect x="230" y="25" width="80" height="245" fill="none" stroke="#a6c3cd"/>`+text(340,45,'상승 후 정지');}
  else {px=45+r.x/(12*options.speed)*445;py=140;body+=line(40,py,500,py,'#a6c3cd');}
  body+=`<rect x="${px-12}" y="${py-18}" width="24" height="36" rx="5" fill="#246f82"/>`;
  const ax=r.ax,ay=options.motion==='elevator'?r.az:r.ay;
  if(r.a>0)body+=line(px,py,px+ax/r.a*55,py-ay/r.a*55,'#b65d20','marker-end="url(#arrow)"');
  body+=text(22,302,'주황 화살표: 운동 가속도의 방향 (길이는 확대 표시)');scene.innerHTML=svg(body,'운동 위치와 가속도 방향',540,325);
  metrics([['운동 속력',fmt(r.speed,2)+' m/s'],['운동 가속도 크기',fmt(r.a,2)+' m/s²'],['원시 센서 크기',fmt(r.sensor,2)+' m/s²']]);
  const keys=options.motion==='circle'?['ax','ay']:['az'];
  extra.innerHTML=chart(keys.map(k=>({name:k==='az'?'수직 가속도':k==='ax'?'x 가속도':'y 가속도',points:Array.from({length:121},(_,i)=>[i/10,M.acceleration({...options,time:i/10})[k]])})),{xmax:12,ymin:-Math.max(5,r.a+1),ymax:Math.max(5,r.a+1),xlabel:'시간 (초)',ylabel:'운동 가속도 (m/s²)'});
  status.textContent=`시각 ${fmt(options.time)}초. ${options.motion==='elevator'?'0~2초 가속, 2~10초 일정 속력, 10~12초 감속합니다.':'속도 벡터의 방향까지 비교하세요.'} 원시 센서와 중력 영향을 제외한 운동 가속도는 다른 값입니다.`;
 }
 function dna(){
  const s=state.dna;let body='';const x=i=>90+i*44,cell=(i,y,base,color)=>`<rect x="${x(i)}" y="${y}" width="37" height="32" rx="5" fill="${color}"/>`+text(x(i)+18,y+22,base,'text-anchor="middle" style="font-weight:bold"');
  body+=text(25,30,'부모 주형 1 · 3′→5′')+text(25,185,'부모 주형 2 · 5′→3′');
  for(let i=0;i<12;i++){
   body+=cell(i,42,s.template[i],'#c4d7e1')+cell(i,195,M.complement(s.template[i]),'#c4d7e1');
   for(const [name,y]of [['leading',85],['lagging',238]]){const v=s[name][i];body+=cell(i,y,v?.base||'·',v?(v.rna?'#cdb8eb':'#a9dfcf'):i<s.fork?'#e5f1f3':'#edf0f2');}
  }
  body+=text(58,63,'3′')+text(624,63,'5′')+text(58,105,'5′')+text(624,105,'3′')+text(58,218,'5′')+text(624,218,'3′')+text(58,262,'3′')+text(624,262,'5′');
  body+=line(95,137,600,137,'#b65d20','marker-end="url(#arrow)"')+text(285,160,' 선도 가닥 · 5′→3′');
  if(s.joined)body+=line(600,290,95,290,'#b65d20','marker-end="url(#arrow)"');else for(let i=0;i<s.fork/4;i++)body+=line(x(i*4+3)+35,290,x(i*4),290,'#b65d20','marker-end="url(#arrow)"');
  body+=text(250,319,'지연 가닥 · 각 조각도 5′→3′')+line(x(s.fork)-4,20,x(s.fork)-4,300,'#af7926','stroke-dasharray="5 5"');
  scene.innerHTML='<p class="scroll-hint">작은 화면에서는 가닥을 좌우로 밀어 전체를 확인하세요.</p><div class="sequence-scroll" tabindex="0" role="region" aria-label="DNA 가닥 전체, 좌우로 이동 가능">'+svg(body,'부모 두 주형과 새 DNA의 상보적 염기 및 역평행 방향',680,335)+'</div><div class="dna-legend"><span style="border-color:#a4bfce">부모 DNA</span><span style="border-color:#a9dfcf">새 DNA</span><span style="border-color:#cdb8eb">RNA 프라이머</span></div>';
  metrics([['열린 주형',s.fork+' / 12 쌍'],['채운 새 가닥',s.leading.filter(Boolean).length+s.lagging.filter(Boolean).length+' / 24'],['연결 상태',s.joined?'두 딸 DNA 완성':s.replaced?'조각 연결 전':'합성 중']]);status.textContent=s.message;
 }
 const sequences={normal:'AUGUUUGGCUAA',synonymous:'AUGUUCGGCUAA',stop:'AUGUAAGGCUAA',insertion:'AUGCUUUGGCUAA',polyU:'UUUUUUUUUUUU',polyA:'AAAAAAAAAAAA',polyC:'CCCCCCCCCCCC'};
 function protein(){
  const key=val('sequence'),rna=sequences[key],cellFree=key.startsWith('poly'),r=M.translate(rna,state.steps,{cellFree}),all=M.translate(rna,Infinity,{cellFree});
  $('transcribe').textContent=cellFree?'준비된 반복 RNA 넣기':'DNA에서 mRNA 전사';$('transcribe').disabled=state.transcribed;
  for(const i of [0,1,2])$('anti'+i).disabled=val('amino')==='*';
  $('attach').disabled=!state.transcribed||r.stopped||state.steps>=all.reads.length;
  const chunks=rna.match(/.{1,3}/g);let body='';body+=text(22,32,cellFree?'무세포 번역: 개시 조건을 갖춘 반복 RNA':'DNA 주형 · 3′→5′');
  if(!cellFree)body+=text(28,61,M.complement(rna.replaceAll('U','T')), 'style="font:20px monospace;letter-spacing:7px"');
  body+=text(22,100,'mRNA · 5′→3′');
  if(state.transcribed){chunks.forEach((c,i)=>{const x=40+i*116,active=i===state.steps;body+=`<rect x="${x}" y="114" width="99" height="45" rx="7" fill="${active?'#cce7ee':'#e7eef2'}" stroke="${active?'#28778b':'#bdcfd7'}"/>`+text(x+49,144,c,'text-anchor="middle" style="font:22px monospace"');if(active)body+=text(x+49,187,state.steps===0&&!cellFree?'P 자리 · 개시':'A 자리 · 다음 코돈','text-anchor="middle" style="font-size:12px"');});
   const next=all.reads[state.steps];body+=text(25,224,r.stopped?'종결: 사슬 방출':next?`현재 코돈 ${next.codon} · ${next.amino==='*'?'방출 인자가 들어갈 자리':'맞는 아미노산을 운반할 tRNA를 선택하세요'}`:'제시한 RNA 끝: 종결코돈 없음');
  }else body+=text(30,145,cellFree?'RNA를 넣으면 코돈을 읽을 수 있습니다.':'전사하면 상보적인 mRNA가 만들어집니다.');
  scene.innerHTML=svg(body,'전사한 RNA의 코돈과 번역 위치',540,250)+`<div class="protein-chain" aria-label="합성한 아미노산 사슬">${r.protein.length?r.protein.map(a=>'<span>'+M.aaNames[a]+'</span>').join(' → '):'아직 연결된 아미노산이 없습니다.'}</div>`;
  metrics([['읽은 코돈',r.reads.length+'개'],['아미노산',r.protein.length+'개'],['펩타이드 결합',Math.max(0,r.protein.length-1)+'개']]);
  status.textContent=state.message||(state.transcribed?r.message:'전사한 뒤 유전부호 표에서 현재 코돈에 맞는 아미노산을 찾으세요.');
 }
 const genes={RR:'XᴿXᴿ',Rr:'XᴿXʳ',rr:'XʳXʳ',RY:'XᴿY',rY:'XʳY'};
 function pedigree(){
  const xy={'I-1':[130,48],'I-2':[250,48],'II-1':[110,150],'II-2':[300,150],'II-3':[430,150],'III-1':[300,257],'III-2':[430,257]};
  let body=line(130,48,250,48)+line(190,48,190,102)+line(110,102,300,102)+line(110,102,110,150)+line(300,102,300,150)+line(300,150,430,150)+line(365,150,365,210)+line(300,210,430,210)+line(300,210,300,257)+line(430,210,430,257);
  for(const p of M.family){const [x,y]=xy[p.id],attrs=`fill="${p.affected?'#276d7b':'white'}" stroke="#1c5265" stroke-width="2"`;body+=p.sex==='M'?`<rect x="${x-17}" y="${y-17}" width="34" height="34" ${attrs}/>`:`<circle cx="${x}" cy="${y}" r="17" ${attrs}/>`;body+=text(x,y+37,p.id,'text-anchor="middle"');}
  scene.innerHTML=svg(body,'3세대 가계도: I-1과 I-2의 자녀 II-1, II-2. II-2와 II-3의 자녀 III-1, III-2. 형질이 있는 사람은 II-1, II-3, III-1.',540,312);
  extra.innerHTML=`<div class="person-genotypes">${M.family.map(p=>`<label>${p.id} · ${p.sex==='M'?'남':'여'} · 형질 ${p.affected?'있음':'없음'}<select data-person="${p.id}"><option value="">유전자형 선택</option>${(p.sex==='M'?['RY','rY']:['RR','Rr','rr']).map(g=>`<option value="${g}">${genes[g]}</option>`).join('')}</select></label>`).join('')}</div><button id="checkFamily">가계도 추론 확인</button><div id="familyFeedback" class="pedigree-result" aria-live="polite"></div><section class="cross-controls"><h3>부모 조합을 바꾸어 예측하기</h3><div class="toolbar"><label>어머니 <select id="mother">${['Rr','RR','rr'].map(g=>`<option value="${g}">${genes[g]}</option>`).join('')}</select></label><label>아버지 <select id="father">${['RY','rY'].map(g=>`<option value="${g}">${genes[g]}</option>`).join('')}</select></label></div><div id="crossResult"></div></section>`;
  extra.querySelectorAll('[data-person]').forEach(el=>el.onchange=()=>{state.answers[el.dataset.person]=el.value;});
  $('checkFamily').onclick=()=>{const result=M.pedigreeCheck(state.answers);$('familyFeedback').innerHTML=result.map(r=>`<p>${r.id}: ${r.ok?'관계와 표현형에 맞습니다.':r.reason}</p>`).join('');status.textContent=`7명 중 ${result.filter(r=>r.ok).length}명의 추론이 가계도의 조건과 일치합니다.`;};
  for(const id of ['mother','father'])$(id).onchange=punnett;
  punnett();status.textContent='부모의 어느 성염색체가 자녀에게 전달되는지 먼저 추적하세요.';
 }
 function punnett(){const r=M.cross(val('mother'),val('father'));$('crossResult').innerHTML=`<table><caption>가능한 네 수정 조합 · 각 1/4</caption><thead><tr><th>조합</th><th>자녀</th><th>유전자형</th><th>형질</th></tr></thead><tbody>${r.children.map((c,i)=>`<tr><td>${i+1}</td><td>${c.male?'아들':'딸'}</td><td>${genes[c.genes]}</td><td>${c.affected?'있음':'없음'}</td></tr>`).join('')}</tbody></table>`;metrics([['전체 자녀 중 형질',r.affected*100+'%'],['아들 중 형질',r.sonsAffected*100+'%'],['딸 중 형질',r.daughtersAffected*100+'%']]);}
 function chromosomeDrawing(c){const len=c.length,top=96-len,cent=top+len*c.centromere;return `<svg viewBox="0 0 28 102" aria-hidden="true"><path d="M8 ${top}Q4 ${top} 5 ${top+8}L10 ${cent}L5 92Q4 98 9 98L14 ${cent+4}L19 98Q24 98 23 92L18 ${cent}L23 ${top+8}Q24 ${top} 20 ${top}L14 ${cent-4}Z" fill="#b2c5cf" stroke="#4b6779"/>${c.bands.map(f=>{const y=top+len*f;return `<path d="M6 ${y}H11M17 ${y}H22" stroke="#526879" stroke-width="3"/>`;}).join('')}<circle cx="14" cy="${cent}" r="2.5" fill="#273d4d"/></svg>`;}
 function karyotype(){
  const s=state.karyo,placed=Object.values(s.slots).flat(),selected=s.cards.find(c=>c.id===state.selected);
  const letter=id=>String.fromCharCode(65+Number(id.slice(1))),scroll=scene.querySelector('.karyo-pool')?.scrollLeft||0;
  scene.classList.add('karyo-scene');
  scene.innerHTML=`<div class="karyo-picker"><p class="selected-card">${selected?'선택: 카드 '+letter(selected.id):'카드 목록을 좌우로 밀어 고르세요.'}</p><div class="karyo-pool" aria-label="염색체 카드">${s.cards.map(c=>`<button class="karyo-card" data-card="${c.id}" aria-pressed="${state.selected===c.id}" aria-label="카드 ${letter(c.id)}${placed.includes(c.id)?', 배치됨':''}">${chromosomeDrawing(c)}<span>${letter(c.id)}${placed.includes(c.id)?' ✓':''}</span></button>`).join('')}</div></div><div class="karyo-board" aria-label="핵형 배열판">${Object.entries(s.slots).map(([kind,ids])=>`<button class="karyo-slot" data-slot="${kind}" aria-label="${kind==='X'?'성염색체':kind+'번'} 칸, 기준 1개와 배치 ${ids.length}개"><b>${kind==='X'?'성염색체':kind+'번'}</b>${chromosomeDrawing(M.chromosome(kind))}${ids.map(id=>chromosomeDrawing(s.cards.find(c=>c.id===id))).join('')}<b>기준 1 + ${ids.length}</b></button>`).join('')}</div>`;
  extra.innerHTML='';scene.querySelector('.karyo-pool').scrollLeft=scroll;
  scene.querySelectorAll('[data-card]').forEach(b=>b.onclick=()=>{state.selected=b.dataset.card;karyotype();scene.querySelector(`[data-card="${state.selected}"]`).focus({preventScroll:true});});
  scene.querySelectorAll('[data-slot]').forEach(b=>b.onclick=()=>{if(!state.selected){status.textContent='먼저 카드 하나를 고르세요.';return;}const slot=b.dataset.slot;state.karyo=M.placeChromosome(s,state.selected,slot);state.selected=null;karyotype();scene.querySelector(`[data-slot="${slot}"]`).focus();});
  metrics([['기준 염색체',23+'개'],['짝지을 카드',s.cards.length+'개'],['배치한 카드',placed.length+'개']]);if(!status.textContent)status.textContent='카드의 기호는 임의 표시입니다. 염색체의 형태를 비교해 짝을 고르세요.';
 }
 function antibiotic(){
  const r=M.antibiotic({time:state.time,dose:num('dose'),spacing:val('spacing'),sampleSet:num('sampleSet')}),selected=r.discs[num('disc')];
  let body=`<circle cx="160" cy="149" r="115" fill="${r.observed?'#a8c495':'#dfdfca'}" stroke="#6e8d83" stroke-width="6"/>`;
  for(const [i,d]of r.discs.entries()){const x=160+d.x,y=149+d.y;body+=`<circle cx="${x}" cy="${y}" r="${9+3*d.width}" fill="#f5f4df"/><circle cx="${x}" cy="${y}" r="9" fill="#fefefe" stroke="${i===num('disc')?'#c47824':'#9aa69f'}" stroke-width="${i===num('disc')?3:1}"/>`+text(x,y-14,d.label,'text-anchor="middle" style="font-size:13px"');}
  body+=text(160,290,r.observed?'24시간 후 · 가상 배양 결과':'배양 전','text-anchor="middle"');
  const plate=svg(body,'배양 접시: 물 대조군과 네 추출액의 생장 억제 구역',320,315);body='';
  const zx=35,baseY=170,scale=15,boundary=zx+selected.width*scale;
  body+=`<rect x="${zx}" y="70" width="190" height="100" fill="#a8c495"/><rect x="${zx}" y="70" width="${r.observed?selected.width*scale:190}" height="100" fill="#f5f4df"/>`+line(zx,70,zx,170,'#606c75')+text(30,50,'선택 디스크 바깥 · 확대');
  for(let i=0;i<=12;i++){body+=line(zx+i*scale,baseY,zx+i*scale,baseY+(i%2?8:13))+ (i%2?'':text(zx+i*scale,202,i,'text-anchor="middle" style="font-size:12px"'));}
  body+=line(zx,225,zx+num('ruler')*scale,225,'#b65d20','marker-end="url(#arrow)"')+text(30,256,'자 길이 '+fmt(num('ruler'))+' mm');
  if(r.observed)body+=line(boundary,70,boundary,170,'#768b71');scene.innerHTML='<div class="disc-scenes">'+plate+svg(body,'선택 디스크의 가장자리 0에서 바깥 경계까지 측정',260,285)+'</div>';
  metrics([['가상 시료',num('sampleSet')+1+'회'],['경과 시간',state.time+'시간'],['배치',r.overlap?'구역 겹침':'겹침 없음']]);
  $('incubate').disabled=state.time>=24;$('measure').disabled=!r.observed||r.overlap;
  status.textContent=state.message||(r.overlap?'억제 구역이 겹쳤습니다. 현재 경계로는 각 추출액의 폭을 독립적으로 잴 수 없습니다. 간격을 바꾸어 재실험하세요.':r.observed?'선택 디스크의 가장자리 0에서 바깥 경계까지 자를 늘려 측정하세요.':'배양 전에는 억제 결과를 판정하지 않습니다. A~D는 익명의 가상 자료입니다.');
 }
 function waterWaves(){
  const o={length:num('length'),depth:num('depth'),amplitude:num('amplitude'),time:num('time')},r=M.waterWave(o),scale=700;
  const surface=Array.from({length:201},(_,i)=>{const x=i/200*r.L*2,v=M.waterWave({...o,x});return [35+i/200*470,75-v.surface*scale];});
  let body=`<path d="M35 75${surface.map(([x,y])=>'L'+x+' '+y).join('')}L505 180H35Z" fill="#d6edf4"/><polyline points="${surface.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#317e94" stroke-width="3"/><rect x="25" y="${45-r.surface*scale}" width="10" height="70" rx="2" fill="#6f8491"/><circle cx="${270+r.dx/r.L*235}" cy="${75-r.dy*scale}" r="8" fill="#ecaa35"/>`+line(35,180,505,180,'#907e63')+line(420,24,485,24,'#b65d20','marker-end="url(#arrow)"')+text(300,28,'파의 전파 →')+text(25,208,`가로 범위 0~${r.L*2} m · 노란 부표의 운동`);
  const top=svg(body,'발생판과 오른쪽으로 전파되는 물결, 표면의 부표',540,230);
  // Orbits have one enlargement factor across depths; separate from the tank scale.
  const orbitScale=Math.min(65/r.rx,21/r.ry),cx=310;body='';
  for(let i=0;i<4;i++){const z=-r.h*i/3,p=M.waterWave({...o,z,x:0}),cy=42+i*59;body+=`<ellipse cx="${cx}" cy="${cy}" rx="${p.rx*orbitScale}" ry="${Math.max(.2,p.ry*orbitScale)}" fill="none" stroke="#899fb0" stroke-dasharray="3 3"/><circle cx="${cx+p.dx*orbitScale}" cy="${cy-p.dy*orbitScale}" r="5" fill="#b76329"/>`+text(30,cy+4,i===0?'수면':i===3?'바닥':'수심 '+fmt(-z,1)+' m');}
  scene.innerHTML=top+'<p class="scroll-hint">물 입자의 궤도 확대 · 모든 깊이에 같은 배율</p>'+svg(body,'깊이에 따른 입자 궤도 비교',540,247);
  metrics([['수심 / 파장',fmt(r.ratio,3)+' · '+r.type],['파의 속력',fmt(r.speed,2)+' m/s'],['주기',fmt(r.period,2)+' s'],['파고',fmt(r.a*200,1)+' cm']]);
  status.textContent=`${fmt(o.time)}초 · 파장의 변화와 입자의 왕복을 구별하세요. 이 선형 모형에서 입자는 한 주기 뒤 같은 위치로 돌아옵니다.`;
 }
 function silverMirror(){
  const s=state.silver,brown=s.stage===2,coating=s.sample==='glucose'?s.turns:0;
  let body=`<defs><linearGradient id="silverWall"><stop stop-color="#718693"/><stop offset=".35" stop-color="#f9fcff"/><stop offset=".7" stop-color="#9aaebc"/><stop offset="1" stop-color="#e6eff4"/></linearGradient></defs><rect x="185" y="62" width="170" height="200" rx="24" fill="#f8fbfc" stroke="#6b899a" stroke-width="3"/>`;
  if(s.stage)body+=`<path d="M189 143H351V238Q350 257 330 257H210Q190 257 189 238Z" fill="${brown?'#997047':'#d7e9ed'}"/>`;
  if(coating)body+=`<rect x="191" y="68" width="158" height="188" rx="19" fill="url(#silverWall)" opacity="${coating/4}"/>`;
  body+=`<rect x="212" y="44" width="116" height="26" rx="4" fill="#556b79"/>`+text(270,299,brown?'갈색 앙금':coating?'벽에 붙은 은':s.stage?'용액':'빈 바이알','text-anchor="middle"');
  scene.innerHTML=svg(body,'시약 첨가 단계와 바이알 벽의 은 석출',540,320);
  metrics([['시료',s.sample==='glucose'?'포도당':'물'],['준비 단계',Math.min(5,s.stage)+' / 5'],['관찰',coating?'은거울 형성':brown?'앙금 생성':'은거울 없음']]);
  extra.innerHTML=s.turns&&s.sample==='glucose'?'<p class="reaction-line">R–CHO → R–COO⁻ <b>산화</b><br>Ag⁺ + e⁻ → Ag <b>환원</b></p><p class="model-note">포도당은 열린 사슬 형태의 알데하이드 부분을 통해 반응합니다. 카복실산염 표기는 반응 용액이 염기성인 조건을 반영합니다.</p>':'';
  status.textContent=s.message;
 }
 function nylon(){
  const s=state.nylon,r=M.condensation(state.chain);let body=`<path d="M135 93V273H365V93" fill="#f8fbfc" stroke="#638798" stroke-width="3"/>`;
  if(s.layers){body+=`<path d="M138 180H362V270H138Z" fill="#d7e9ed"/><rect x="138" y="117" width="224" height="63" fill="#bde4c0"/>`+line(139,180,361,180,'#d08f22',`stroke-width="${2+s.film*4}"`)+text(150,152,'다이아민 수용액')+text(150,232,'산 염화물 유기 용액');
   if(s.pulled||s.broken){body+=`<path d="M250 180L${s.broken?250:280} ${s.broken?140:52}" stroke="#c18315" stroke-width="${val('pullSpeed')==='slow'?5:3}" fill="none"/>`;if(s.broken)body+=line(263,111,280,52,'#c18315');}
  }
  body+=line(210,45,350,45,'#77634c','stroke-width="9"');for(let i=0;i<s.pulled;i++)body+=line(280+i*7,36,280+i*7,54,'#c18315','stroke-width="3"');body+=text(245,310,'나일론이 만들어지는 경계','text-anchor="middle"');
  scene.innerHTML=svg(body,'두 층의 경계에서 생기는 막과 감아 올리는 나일론',540,330);
  extra.innerHTML=`<div class="protein-chain" aria-label="단위체 사슬">${state.chain.length?state.chain.map(u=>'<span>'+(u==='amine'?'다이아민':'산 염화물')+'</span>').join('–'):'단위체를 하나씩 연결해 보세요.'}</div><p>연결: –CO–NH– 아마이드 결합 · 빠져나온 작은 분자: HCl</p>`;
  metrics([['연결한 단위체',r.units+'개'],['아마이드 결합',r.bonds+'개'],['생성 HCl',r.hcl+'개']]);status.textContent=state.message||s.message;
 }
 function draw(){labels();({'insulation-lab':insulation,'doppler-lab':doppler,'ride-acceleration':acceleration,'dna-replication':dna,'protein-synthesis':protein,'pedigree-lab':pedigree,'karyotype-lab':karyotype,'antibiotic-disc':antibiotic,'water-wave-tank':waterWaves,'silver-mirror':silverMirror,'nylon-interface':nylon}[slug])();}
 function reset(){stop();for(const el of host.querySelectorAll('.control-panel input'))el.value=el.defaultValue;for(const el of host.querySelectorAll('.control-panel select'))el.selectedIndex=0;
  state={dna:M.dnaStart(),steps:0,transcribed:false,answers:{},karyo:M.karyotypeStart(),selected:null,time:0,message:'',silver:M.silverStart(),nylon:M.nylonStart(),chain:[]};extra.innerHTML='';readout.innerHTML='';status.textContent='';draw();}
 if(slug==='protein-synthesis'){$('amino').innerHTML=Object.entries(M.aaNames).map(([a,name])=>`<option value="${a}">${a==='*'?'방출 인자 (종결)':name}</option>`).join('');$('codonTable').innerHTML=Object.entries(M.codons).map(([codon,a])=>`<span><b>${codon}</b> ${M.aaNames[a]}</span>`).join('');}
 host.querySelectorAll('.control-panel input,.control-panel select').forEach(el=>el.addEventListener(el.type==='range'?'input':'change',()=>{
  if(slug==='protein-synthesis'&&el.id==='sequence'){state.steps=0;state.transcribed=false;state.message='';}
  if(slug==='karyotype-lab'&&el.id==='sample'){state.karyo=M.karyotypeStart(el.value);state.selected=null;status.textContent='새 시료의 염색체를 배열하세요.';}
  if(slug==='antibiotic-disc'){state.message='';if(['sampleSet','dose','spacing'].includes(el.id))state.time=0;}
  if(slug==='ride-acceleration'&&el.id!=='time'){stop();$('time').value=0;}
  if(slug==='silver-mirror'&&el.id==='sample')state.silver=M.silverStart(el.value);
  if(slug==='water-wave-tank'&&el.id!=='time'){stop();$('time').value=0;}
  draw();
 }));
 if($('step'))$('step').onclick=()=>{const el=$('time');el.value=Math.min(Number(el.max),Number(el.value)+(slug==='ride-acceleration'?.5:1));draw();};
 if($('play'))$('play').onclick=()=>{if(timer){stop();return;}if(num('time')>=12)$('time').value=0;$('play').textContent='일시 정지';timer=setInterval(()=>{$('time').value=Math.min(12,num('time')+.1);draw();if(num('time')>=12)stop();},100);};
 if(slug==='dna-replication'){
  for(const [id,action]of [['openFork','open'],['primer','prime'],['replace','replace'],['join','join']])$(id).onclick=()=>{state.dna=M.dnaAction(state.dna,action);draw();};
  host.querySelectorAll('[data-base]').forEach(b=>b.onclick=()=>{state.dna=M.dnaAction(state.dna,val('strand'),b.dataset.base);draw();});
 }
 if(slug==='protein-synthesis'){
  $('transcribe').onclick=()=>{state.transcribed=true;state.message='';draw();};
  $('attach').onclick=()=>{const all=M.translate(sequences[val('sequence')],Infinity,{cellFree:val('sequence').startsWith('poly')}),next=all.reads[state.steps];if(!next||!state.transcribed)return;
   const anti=M.complement(next.codon.replaceAll('U','T')).replaceAll('T','U');
   if(next.amino!=='*'&&[0,1,2].map(i=>val('anti'+i)).join('')!==anti){state.message='코돈과 안티코돈이 상보적으로 짝지어지지 않았습니다. 두 방향과 A–U, G–C 짝을 확인하세요.';draw();return;}
   if(val('amino')!==next.amino){state.message='현재 코돈과 선택한 운반체가 맞지 않습니다. 유전부호 표에서 코돈 전체를 확인하세요.';draw();return;}
   state.steps++;state.message=next.amino==='*'?'방출 인자가 결합해 번역이 끝났습니다. 종결코돈은 아미노산을 더하지 않습니다.':next.name+'을 연결했습니다. 라이보솜은 5′→3′으로 한 코돈 이동합니다.';draw();};
 }
 if(slug==='karyotype-lab'){
  $('checkPairs').onclick=()=>{const r=M.karyotypeCheck(state.karyo);status.textContent=r.complete?`배열 완료. 전체 ${r.total}개 = 상염색체 ${r.autosomes}개 + 성염색체 ${r.sex}.`:r.misplaced.length?`카드 ${r.misplaced.map(id=>String.fromCharCode(65+Number(id.slice(1)))).join(', ')}의 길이·동원체·띠를 다시 비교하세요.`:`현재 배치의 짝은 맞습니다. ${state.karyo.cards.length-r.placed}개를 더 배치하세요.`;};
  $('removeCard').onclick=()=>{if(!state.selected){status.textContent='꺼낼 카드를 먼저 고르세요.';return;}for(const key of Object.keys(state.karyo.slots))state.karyo.slots[key]=state.karyo.slots[key].filter(id=>id!==state.selected);karyotype();};
 }
 if(slug==='antibiotic-disc'){
  $('incubate').onclick=()=>{state.time=24;state.message='';draw();};
  $('measure').onclick=()=>{const r=M.antibiotic({time:state.time,dose:num('dose'),spacing:val('spacing'),sampleSet:num('sampleSet')}),d=r.discs[num('disc')];if(r.overlap||!r.observed)return;state.message=Math.abs(num('ruler')-d.width)<=.26?`${d.label}: 가장자리부터 ${fmt(d.width)} mm. 같은 자로 다른 디스크와 반복 시료를 비교하세요.`:'자의 0은 디스크 가장자리입니다. 바깥 구역 경계에 끝을 맞추세요.';draw();};
 }
 if(slug==='water-wave-tank'){
  $('stepWave').onclick=()=>{$('time').value=Math.min(60,num('time')+.5);draw();};
  $('playWave').onclick=()=>{if(timer){stop();return;}if(num('time')>=60)$('time').value=0;$('playWave').textContent='정지해 관찰';timer=setInterval(()=>{$('time').value=Math.min(60,num('time')+.1);draw();if(num('time')>=60)stop();},100);};
 }
 if(slug==='silver-mirror')for(const [id,action]of [['silverReagent','silver'],['ammoniaReagent','ammonia'],['testSample','sample'],['baseReagent','base'],['rollVial','roll']])$(id).onclick=()=>{state.silver=M.silverAction(state.silver,action);draw();};
 if(slug==='nylon-interface'){
  for(const [id,action]of [['makeLayers','layer'],['pullNylon','pull'],['waitFilm','wait']])$(id).onclick=()=>{state.message='';state.nylon=M.nylonAction(state.nylon,action,val('pullSpeed'));draw();};
  for(const [id,unit]of [['addAmine','amine'],['addChloride','chloride']])$(id).onclick=()=>{if(state.chain.length>=8){state.message='이 모형의 사슬은 8개 단위체까지 비교합니다.';}else if(state.chain.at(-1)===unit){state.message='같은 작용기끼리는 이 반응으로 연결되지 않습니다. 사슬 끝과 반응할 다른 단위체를 고르세요.';}else{state.chain.push(unit);state.message=state.chain.length===1?'첫 단위체입니다. 아직 단위체 사이 결합은 없습니다.':'사슬이 한 단위체만큼 늘고 HCl 하나가 생성되었습니다.';}draw();};
  $('clearChain').onclick=()=>{state.chain=[];state.message='';draw();};
 }
 $('resetExperiment').onclick=reset;window.addEventListener('pagehide',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 // Read-only snapshots support verification without exposing a state mutation API.
 window.__inquiryLab={snapshot:()=>JSON.parse(JSON.stringify({slug,state,running:!!timer}))};reset();
})();
