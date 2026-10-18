(() => {
 if(window.scienceAppContext?.school!=='high-elective'||window.scienceAppContext.slug!=='ohms-law')return;
 document.querySelector('.method-steps')?.remove();document.querySelector('.meaning-panel')?.remove();
 const old=document.querySelector('.experiment-layout'),template=document.querySelector('#circuitCourseStage');old.replaceWith(template.content.cloneNode(true));template.remove();
 const M=window.scienceCircuitMeasurement,$=id=>document.getElementById(id),scope=document.querySelector('.circuit-measurement');
 document.querySelector('h1').textContent='직렬·병렬 회로의 전압·전류 측정';
 let state=M.defaults(),book=M.create();
 const targetLabel={r1:'R₁',r2:'R₂',whole:'전체'},format=(value,meter)=>value==null?'—':meter==='current'?(value*1000).toFixed(1)+' mA':value.toFixed(2)+' V';
 const text=(s,x,y,fill='#244c5b')=>`<text x="${x}" y="${y}" text-anchor="middle" fill="${fill}" font-size="15">${s}</text>`;
 const line=(d,color='#328192',width=4)=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
 function scene(){
  const series=state.wiring==='series',inSeries=state.connection==='series',active=state.closed&&M.connection(state)==='ready';
  const y1=88,y2=215,left=145,right=480;
  const positions=series?{r1:[265,y1],r2:[410,y1]}:{r1:[350,y1],r2:[350,y2]};
  let svg=`<defs><linearGradient id="cmResistor" x2="0" y2="1"><stop stop-color="#fff3d5"/><stop offset=".4" stop-color="#fffcf2"/><stop offset="1" stop-color="#cfaa70"/></linearGradient><linearGradient id="cmSupply" x2="1" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#d4e1e8"/></linearGradient></defs>`;
  const wire=`M65 120 V88 H86 M120 88 H145 H480 V270 H65 V218`+(series?'':` M145 88 V215 H480`);
  svg+=line(wire);if(active)svg+=`<path d="${wire}" fill="none" stroke="#89cbbb" stroke-width="3" class="cm-flow"/>`;
  svg+=line(`M86 88 L120 ${active?88:68}`,'#698693',3)+text(active?'닫힘':'열림',102,51);
  svg+=`<rect x="26" y="120" width="78" height="98" rx="12" fill="url(#cmSupply)" stroke="#90a7b3"/><rect x="35" y="146" width="60" height="29" rx="5" fill="#153f44"/>`+text('DC 전원',65,138)+text(state.volts.toFixed(1)+' V',65,166,'#b5edce')+text('+',65,115,'#b94835')+text('−',65,237)+`<circle cx="64" cy="192" r="11" fill="#f7fafb" stroke="#7f99a5"/><path d="M64 192 l5 -6" stroke="#376475" stroke-width="3"/>`;
  for(const t of ['r1','r2']){const[x,y]=positions[t];svg+=`<rect x="${x-36}" y="${y-12}" width="72" height="24" rx="7" fill="url(#cmResistor)" stroke="#ac8857"/><path d="M${x-32} ${y-10} v20 M${x+32} ${y-10} v20" stroke="#a4afb1" stroke-width="5"/>`+text(targetLabel[t]+' · '+state[t]+' Ω',x,y-25);if(state.target===t)svg+=`<rect x="${x-41}" y="${y-17}" width="82" height="34" rx="9" fill="none" stroke="#c37a39" stroke-width="2"/>`;}
  let mx,my,probes;
  if(inSeries){
   [mx,my]=state.target==='whole'?[300,270]:series?[state.target==='r1'?185:335,88]:[210,positions[state.target][1]];
   // A meter in series replaces a wire segment. The base conductor is masked
   // under the symbol so it never visually bypasses the inserted instrument.
   svg+=line(`M${mx-22} ${my} H${mx+22}`,'#f0f7f8',10);
   probes=`M${mx-28} ${my} H${mx-17} M${mx+17} ${my} H${mx+28}`;
  }else{
   let a,b,y;if(series&&state.target!=='whole'){const[x,py]=positions[state.target];[a,b,y]=[x-45,x+45,py];}else{[a,b,y]=[145,480,series||state.target!=='r2'?88:215];}
   mx=(a+b)/2;my=series?169:state.target==='r1'?150:309;
   probes=`M${a} ${y} V${my} H${mx-17} M${mx+17} ${my} H${b} V${y}`;
   svg+=`<circle cx="${a}" cy="${y}" r="4" fill="#c37a39"/><circle cx="${b}" cy="${y}" r="4" fill="#c37a39"/>`;
  }
  svg+=line(probes,'#c37a39',3)+`<circle cx="${mx}" cy="${my}" r="17" fill="#fff8e9" stroke="#ae7136" stroke-width="2"/>`+text(state.meter==='current'?'A':'V',mx,my+5,'#81501b');
  svg+=text((series?'직렬':'병렬')+' · '+targetLabel[state.target]+' 측정',295,27);
  window.scienceScene.render($('cmScene'),svg);
 }
 function render(message){
  $('cmVoltsValue').textContent=state.volts.toFixed(1)+' V';$('cmVolts').value=state.volts;$('cmR1').value=state.r1;$('cmR2').value=state.r2;
  for(const key of ['wiring','meter','target','connection'])for(const b of scope.querySelectorAll('[data-cm-'+key+']'))b.setAttribute('aria-pressed',String(b.dataset['cm'+key[0].toUpperCase()+key.slice(1)]===state[key]));
  const r=M.reading(state);$('cmReading').textContent=format(r.value,state.meter);$('cmReadingLabel').textContent=targetLabel[state.target]+' · '+(state.meter==='current'?'전류':'전압');
  $('cmSwitch').textContent=state.closed?'회로 열기':'회로 닫기';$('cmSwitch').setAttribute('aria-pressed',String(state.closed));$('cmRead').disabled=r.status!=='measured';
  $('cmStatus').textContent=message||({short:'전류계가 저항을 우회합니다. 회로를 열어 두었으니 계기를 직렬로 옮기세요.',open:'전압계를 직렬로 넣으면 전류가 거의 흐르지 않습니다. 측정할 부분의 양 끝에 병렬로 연결하세요.',off:'회로를 닫고 계기의 값을 읽으세요.',measured:'계기에 표시된 값을 읽고 다른 부분으로 옮겨 비교하세요.'}[r.status]);
  const rows=book.conditions===M.conditionKey(state)?book[state.wiring]:{};
  $('cmTableTitle').textContent=(state.wiring==='series'?'직렬':'병렬')+' 측정 · '+state.volts.toFixed(1)+' V';
  $('cmTable').innerHTML=['r1','r2','whole'].map(t=>`<tr><th scope="row">${targetLabel[t]}</th><td>${rows[t+'-voltage']===undefined?'—':rows[t+'-voltage'].toFixed(2)}</td><td>${rows[t+'-current']===undefined?'—':(rows[t+'-current']*1000).toFixed(1)}</td></tr>`).join('');
  let conclusion='각 부분에서 전압과 전류를 한 번씩 읽어 비교하세요.';
  if(M.complete(rows))conclusion=state.wiring==='series'?`전압의 합 ${(rows['r1-voltage']+rows['r2-voltage']).toFixed(2)} V = 전체 전압 ${rows['whole-voltage'].toFixed(2)} V. 세 위치의 전류는 모두 ${(rows['whole-current']*1000).toFixed(1)} mA입니다.`:`가지 전류의 합 ${((rows['r1-current']+rows['r2-current'])*1000).toFixed(1)} mA = 전체 전류 ${(rows['whole-current']*1000).toFixed(1)} mA. 각 저항의 전압은 전체 전압과 같습니다.`;
  if(book.conditions===M.conditionKey(state)&&M.complete(book.series)&&M.complete(book.parallel))conclusion+=` 같은 전원·저항에서 전체 전류는 직렬 ${(book.series['whole-current']*1000).toFixed(1)} mA, 병렬 ${(book.parallel['whole-current']*1000).toFixed(1)} mA입니다.`;
  $('cmConclusion').textContent=conclusion;scene();
 }
 for(const key of ['wiring','meter','target','connection'])for(const b of scope.querySelectorAll('[data-cm-'+key+']'))b.onclick=()=>{state[key]=b.dataset['cm'+key[0].toUpperCase()+key.slice(1)];state.closed=false;render();};
 for(const[id,key]of [['cmVolts','volts'],['cmR1','r1'],['cmR2','r2']])$(id).addEventListener(id==='cmVolts'?'input':'change',()=>{state[key]=Number($(id).value);state.closed=false;book=M.create();render('전원·저항 조건이 달라져 측정값을 비웠습니다. 같은 조건에서 두 연결을 비교하세요.');});
 $('cmSwitch').onclick=()=>{state.closed=M.connection(state)==='ready'&&!state.closed;render();};
 $('cmRead').onclick=()=>{if(M.capture(book,state))render(targetLabel[state.target]+'의 '+(state.meter==='current'?'전류':'전압')+'를 읽었습니다. 측정 위치나 계기를 바꾸어 비교하세요.');};
 $('cmReset').onclick=()=>{state=M.defaults();book=M.create();render();};
 window.__circuitMeasurement={getState:()=>({...state}),getBook:()=>structuredClone(book)};render();
})();
