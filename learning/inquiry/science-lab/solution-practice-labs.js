(function(){
 'use strict';const host=document.querySelector('[data-solution]');if(!host)return;
 const M=window.ScienceSolutionPractice,slug=host.dataset.solution,$=id=>document.getElementById(id),say=t=>$('soStatus').textContent=t;
 let s,model,render,reset;const on=(id,fn,event='click')=>$(id).addEventListener(event,fn),fmt=(v,n=2)=>Number(v).toFixed(n);
 const text=(x,y,t,anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}">${t}</text>`;
 const defs='<defs><linearGradient id="soGlass"><stop stop-color="#c6dfe7" stop-opacity=".5"/><stop offset=".25" stop-color="#fff" stop-opacity=".8"/><stop offset=".7" stop-color="#e6f0f5" stop-opacity=".1"/><stop offset="1" stop-color="#9abfcf" stop-opacity=".55"/></linearGradient><linearGradient id="soWater" x2="0" y2="1"><stop stop-color="#daeef4" stop-opacity=".5"/><stop offset="1" stop-color="#84b9c8" stop-opacity=".7"/></linearGradient><linearGradient id="soMetal"><stop stop-color="#516e7b"/><stop offset=".4" stop-color="#b8ccd4"/><stop offset="1" stop-color="#6b8793"/></linearGradient></defs>';
 function font(){if(window.scienceNormalizeFigure)return;for(const svg of host.querySelectorAll('svg')){const w=svg.getBoundingClientRect().width;if(w)for(const t of svg.querySelectorAll('text'))t.style.fontSize=(15*Number(svg.getAttribute('viewBox').split(' ')[2])/w)+'px';}}
 function scene(body,h=410){window.scienceScene.render($('soScene'),`<svg viewBox="0 0 600 ${h}" role="img" aria-label="${host.querySelector('h2').textContent}">${defs}${body}</svg>`);font();}
 function steps(items){$('soSteps').innerHTML=items.map(([t,done])=>`<span class="${done?'done':''}">${done?'✓ ':''}${t}</span>`).join('');}
 const setDisabled=(id,b)=>$(id).disabled=b;
 function table(caption,headers,rows){return `<table><caption>${caption}</caption><thead><tr>${headers.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table>`;}
 const superscript=n=>String(n).split('').map(c=>({'-':'⁻','+':'⁺','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'}[c])).join('');
 const scientific=c=>{const[a,b]=c.toExponential(2).split('e');return a+' × 10'+superscript(b);};
 if(slug==='standard-solution'){
  model=M.standard;
  render=()=>{steps([['질량',s.weighed],['용해',s.dissolved],['모두 옮김',s.rinses>=3],['정용·혼합',s.mixed]]);
   const y=185-(s.volume-100)*2,neck='M394 120V263C390 280 346 290 342 335Q340 360 363 364H457Q481 360 478 335C474 290 430 280 426 263V120Z';
   let b='<ellipse cx="160" cy="367" rx="106" ry="10" fill="#a1b4bd" opacity=".18"/><rect x="55" y="271" width="205" height="83" rx="13" fill="#c1d0d8" stroke="#8099a7"/><path d="M65 277H252L239 262H78Z" fill="url(#soMetal)"/><rect x="105" y="300" width="104" height="37" rx="5" fill="#e0efe3" stroke="#a1b6ae"/>'+text(157,325,fmt(model.display(s))+' g');
   if(s.pan){b+='<path d="M97 254Q153 281 219 254L210 265H107Z" fill="#eef3ee" stroke="#b1b8b0"/>';if(s.weighed&&!s.dissolved)for(let i=0;i<18;i++)b+=`<circle cx="${135+(i%6)*7}" cy="${251-Math.floor(i/6)*4}" r="2.5" fill="#fff" stroke="#bcccd0"/>`;}
   b+=text(154,392,s.tared?'영점 조정됨':'질량 접시 '+(s.pan?'포함':'없음'));
   b+='<path d="M69 105V217Q69 229 80 229H234Q245 229 245 217V105" fill="url(#soGlass)" stroke="#88aab9" stroke-width="2"/>';
   if(s.dissolved&&!s.transferred)b+='<path d="M72 165H242V216Q242 225 230 225H84Q72 225 72 216Z" fill="url(#soWater)"/>';
   if(s.transferred&&s.rinses<3)for(const[x,a]of[[77,177],[236,196],[95,218]])b+=`<path d="M${x} ${a}q8 10 0 14q-8-4 0-14" fill="#80b0c0" opacity="${.85-s.rinses*.2}"/>`;
   b+=text(156,86,s.transferred?(s.rinses>=3?'비커 세척 완료':`세척 ${s.rinses}회 · 남은 용액`):'NaCl과 적당량의 물');
   b+=`<defs><clipPath id="stFlask"><path d="${neck}"/></clipPath></defs><ellipse cx="410" cy="374" rx="91" ry="12" fill="#9ab5c2" opacity=".18"/><path d="${neck}" fill="url(#soGlass)" stroke="#87a5b5" stroke-width="2"/>`;
   if(s.transferred)b+=`<g clip-path="url(#stFlask)"><path d="M335 ${y-5}Q410 ${y+5} 485 ${y-5}V365H335Z" fill="url(#soWater)"/><path d="M393 ${y-5}Q410 ${y+5} 427 ${y-5}" fill="none" stroke="#558f9f" stroke-width="2"/></g>`;
   b+='<path d="M385 185H438" stroke="#ba7140" stroke-width="2"/>'+text(444,191,'100 mL','start');
   if(s.transferred){const ey=185+{above:-43,level:0,below:43}[s.eye];b+=`<path d="M540 ${ey}L427 ${y}" stroke="#8297a0" stroke-dasharray="5 5"/><path d="M535 ${ey}q14-12 29 0q-15 12-29 0" fill="#fff" stroke="#5e7c8b"/><circle cx="549" cy="${ey}" r="4" fill="#405c6e"/>`;}
   if(s.mixed)b+='<rect x="390" y="109" width="40" height="14" rx="3" fill="#4b6674"/>';
   b+=text(410,88,'부피 플라스크');scene(b);
   setDisabled('stPan',s.pan);setDisabled('stTare',!s.pan||s.weighed);setDisabled('stWeigh',!s.pan||s.weighed);setDisabled('stMass',s.weighed);setDisabled('stDissolve',!s.weighed||s.dissolved);setDisabled('stTransfer',!s.dissolved||s.transferred);setDisabled('stRinse',!s.transferred||s.mixed||s.rinses>=3||s.volume>85);setDisabled('stPremix',!s.transferred||s.premixed||s.mixed);setDisabled('stWater',!s.premixed||s.mixed||s.volume>105);setDisabled('stDrop',!s.premixed||s.mixed||s.volume>=110);setDisabled('stMix',!s.transferred||s.mixed);setDisabled('stEye',!s.transferred);
  };
  reset=()=>{s=model.create();$('stMass').value=5.85;$('stEye').value='level';$('stResult').textContent='용액을 모두 옮긴 뒤 수면 아래쪽을 표시선에 맞추세요.';say('빈 질량 접시를 올리고 영점을 맞추세요. 목표는 1.00 M·100 mL입니다.');render();};
  on('stPan',()=>{s.pan=true;say('빈 질량 접시의 무게도 저울에 포함됩니다. NaCl만 재려면 영점을 맞추세요.');render();});
  on('stTare',()=>{s.tared=true;say('빈 접시가 0.00 g이 되었습니다. 필요한 NaCl의 질량을 계산하여 담으세요.');render();});
  on('stWeigh',()=>{const mass=Number($('stMass').value);if(!(mass>0&&mass<=10))return say('NaCl을 0보다 크고 10 g 이하로 담으세요.');s.mass=mass;s.weighed=true;say(s.tared?'NaCl의 질량을 확인했습니다. 적은 양의 물에 완전히 녹이세요.':'저울 값에는 접시 2.00 g이 포함되어 있습니다. NaCl 질량과 구별하세요.');render();});
  on('stDissolve',()=>{s.dissolved=true;say('NaCl이 모두 녹았습니다. 깔때기로 용액을 옮기고 비커와 깔때기의 남은 용액도 함께 옮기세요.');render();});
  on('stTransfer',()=>{s.transferred=true;s.volume=60;say('용액을 옮겼지만 비커 벽에 일부 남아 있습니다. 증류수로 헹구어 함께 넣으세요.');render();});
  on('stRinse',()=>{model.rinse(s);say(s.rinses>=3?'세척한 물까지 함께 옮겼습니다. 수면이 표시선에 가까워지면 조금씩 채우세요.':'비커와 깔때기를 헹구어 함께 넣었습니다. 남은 용액을 다시 확인하세요.');render();});
  on('stPremix',()=>{s.premixed=true;say('마개를 닫고 먼저 섞었습니다. 마개를 열고 표시선까지 조금씩 채우세요.');render();});
  for(const[id,v]of[['stWater',5],['stDrop',.1]])on(id,()=>{model.add(s,v);say(s.volume>100.05?'수면이 표시선을 넘었습니다. 용액 일부를 덜어도 희석된 농도가 회복되지는 않습니다.':'오목한 수면 아래쪽과 표시선을 같은 눈높이에서 비교하세요.');render();});
  on('stEye',()=>{s.eye=$('stEye').value;render();},'change');
  on('stMix',()=>{if(s.eye!=='level')return say('눈높이를 표시선에 맞추고 수면을 다시 읽으세요.');s.mixed=true;render();const c=model.concentration(s);$('stResult').textContent=c===null?'비커에 남은 용액을 모두 옮기지 않아 처음 잰 NaCl의 양으로 정확한 농도를 계산할 수 없습니다.':`NaCl ${fmt(s.mass)} g ÷ 58.5 g/mol ÷ ${fmt(s.volume/1000,4)} L = ${fmt(c,3)} M. ${Math.abs(c-1)<.003?'목표 농도입니다.':'목표 1.00 M과 비교해 질량과 최종 부피를 확인하세요.'}`;say('마개를 닫고 고르게 섞었습니다. 처음 물의 양과 최종 용액 부피를 구별하세요.');});
 }
 if(slug==='serial-dilution'){
  model=M.dilution;
  const graph=()=>{const rows=Object.entries(s.readings).map(([i,p])=>({c:s.samples[i].c,p})),min=Math.min(-3,...rows.map(r=>Math.floor(Math.log10(r.c)))),x=c=>75+(Math.log10(c)-min)/(-1-min)*450,y=p=>260-p/14*210;let b='<path d="M75 40V260H530" fill="none" stroke="#8298a4"/>';
   for(let p=0;p<=14;p+=2)b+=`<path d="M75 ${y(p)}H530" stroke="#dbe5e9"/>`+text(57,y(p)+5,p);
   const step=Math.max(1,Math.ceil((-1-min)/5));for(let n=min;n<=-1;n+=step)b+=text(x(10**n),289,'10'+['⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹','¹⁰','¹¹','¹²'][Math.abs(n)].replace(/^/,'⁻'));
   b+=text(38,30,'pH')+text(304,326,'몰농도 (M)');const sorted=rows.sort((a,b)=>a.c-b.c);if(rows.length>1)b+=`<polyline points="${sorted.map(r=>x(r.c)+','+y(r.p)).join(' ')}" fill="none" stroke="#367b86" stroke-width="2"/>`;for(const r of rows)b+=`<circle cx="${x(r.c)}" cy="${y(r.p)}" r="4" fill="#247283"/>`;window.scienceScene.render($('dlGraph'),`<svg viewBox="0 0 600 355" role="img" aria-label="측정한 몰농도와 pH의 관계">${b}</svg>`);
  };
  render=()=>{steps([['세 점 교정',s.buffer686&&s.buffer4&&s.buffer918],['용액 '+s.samples.length+'개',s.samples.length>1],['pH '+Object.keys(s.readings).length+'개 측정',!!Object.keys(s.readings).length]]);const a=s.samples.at(-1),b=s.pending,measuring=!b&&s.portion!==null,shown=measuring?s.samples[s.portion]:a;let v=text(128,50,shown.name+(measuring?' · 측정 시료 30 mL':' 용액'))+text(429,50,b?'다음 용액 · 100 mL':'빈 부피 플라스크');
   v+='<path d="M65 93V255Q65 270 82 270H174Q190 270 190 255V93" fill="url(#soGlass)" stroke="#87a7b6" stroke-width="2"/><path d="M68 170H187V254Q187 267 174 267H82Q68 267 68 254Z" fill="url(#soWater)"/>'+text(128,300,scientific(shown.c)+' M');
   if(measuring)v+='<path d="M144 139V221" stroke="#557785" stroke-width="4"/><rect x="125" y="75" width="38" height="70" rx="7" fill="#d7b560" stroke="#9b803f"/><rect x="130" y="89" width="28" height="29" rx="3" fill="#dceadb"/>'+text(144,109,'pH');
   const f='M413 80V177Q412 205 374 230Q357 252 375 270H482Q500 252 483 230Q446 205 445 177V80Z';v+=`<defs><clipPath id="dlFlask"><path d="${f}"/></clipPath></defs><path d="${f}" fill="url(#soGlass)" stroke="#87a7b6" stroke-width="2"/>`;if(b)v+=`<path d="M360 ${b.filled?132:247}H496V274H360Z" fill="url(#soWater)" clip-path="url(#dlFlask)"/>`;v+='<path d="M404 132H454" stroke="#b67547" stroke-width="2"/>';
   if(b)v+='<path d="M226 108L229 80L247 74L259 85L250 112L237 116L217 222" fill="#b4d6e1" stroke="#6594a7" stroke-width="2"/><path d="M217 224Q303 259 423 176" fill="none" stroke="#7eafbf" stroke-width="3" stroke-dasharray="5 6"/>';
   s.samples.forEach((r,i)=>{const x=45+i*61;v+=`<path d="M${x-13} 337V376Q${x-13} 381 ${x-8} 381H${x+8}Q${x+13} 381 ${x+13} 376V337" fill="${i===s.selected?'#b9dce5':'#e9f1f4'}" stroke="#81a1ae"/>`+text(x,325,r.name);});scene(v,402);
   $('dlSample').innerHTML=s.samples.map((r,i)=>`<option value="${i}">${r.name} · ${scientific(r.c)} M</option>`).join('');$('dlSample').value=s.selected;
   $('dlData').innerHTML=table('측정한 용액',['용액','몰농도 (M)','pH'],s.samples.map((r,i)=>[r.name,scientific(r.c),s.readings[i]===undefined?'—':fmt(s.readings[i],3)]));graph();font();
   setDisabled('dlPipette',!!s.pending||s.samples.length>=9||a.remaining<s.aliquot);setDisabled('dlFill',!s.pending||s.pending.filled);setDisabled('dlMix',!s.pending?.filled);setDisabled('dlAliquot',!!s.pending);setDisabled('dlBuffer686',s.buffer686);setDisabled('dlBuffer4',!s.buffer686||s.buffer4);setDisabled('dlBuffer918',!s.buffer4||s.buffer918);setDisabled('dlPortion',s.portion===s.selected||s.samples[s.selected].remaining<30);setDisabled('dlMeasure',s.portion!==s.selected);
  };
  reset=()=>{s=model.create();$('dlKind').value='acid';$('dlAliquot').value='10';$('dlMeter').textContent='pH —';say('A는 0.1 M 염산입니다. A에서 피펫으로 일정량을 취해 다음 용액을 만드세요.');render();};
  on('dlKind',()=>{const kind=$('dlKind').value;s=model.create();s.kind=kind;$('dlAliquot').value='10';$('dlMeter').textContent='pH —';say('새 0.1 M '+(kind==='acid'?'염산':'NaOH 용액')+'으로 시작합니다. 기기를 교정하고 농도별 pH를 비교하세요.');render();},'change');
  on('dlAliquot',()=>{s.aliquot=Number($('dlAliquot').value);},'change');
  on('dlPipette',()=>{model.pipette(s);say('앞 용액 '+s.aliquot+' mL를 취했습니다. 물 100 mL를 더하는 것이 아니라 용액 전체를 100 mL에 맞추세요.');render();});
  on('dlFill',()=>{model.fill(s);say('용액 전체가 100 mL입니다. 마개를 닫고 고르게 섞으세요.');render();});
  on('dlMix',()=>{model.mix(s);say('새 용액 '+s.samples.at(-1).name+'을 만들었습니다. pH를 측정하거나 이 용액에서 다음 희석을 진행하세요.');render();});
  for(const [n,label] of [[686,'6.86'],[4,'4.00'],[918,'9.18']])on('dlBuffer'+n,()=>{if(!s.clean)return say('다른 완충액에 담그기 전에 전극을 증류수로 씻으세요.');s['buffer'+n]=true;s.clean=false;say('pH '+label+' 완충액의 교정을 마쳤습니다. 전극을 씻은 뒤 다음 용액을 사용하세요.');render();});
  on('dlRinse',()=>{s.clean=true;say('전극을 증류수로 씻었습니다. 새 시료를 측정할 수 있습니다.');});
  on('dlSample',()=>{s.selected=Number($('dlSample').value);s.portion=null;$('dlMeter').textContent='pH —';render();},'change');
  on('dlPortion',()=>{model.sample(s);say(s.samples[s.selected].name+' 용액 30 mL를 새 비커에 덜었습니다. 교정과 전극 세척을 확인하고 측정하세요.');render();});
  on('dlMeasure',()=>{const p=model.measure(s);if(p===null){say(!s.buffer686||!s.buffer4||!s.buffer918?'pH 6.86, 4.00, 9.18 완충액으로 교정을 마치세요.':'이전 용액이 남지 않도록 전극을 먼저 씻으세요.');return;}$('dlMeter').textContent='pH '+fmt(p,3);say('측정값을 농도와 함께 표시했습니다. 그래프에서 산과 염기의 희석 방향을 비교하세요.');render();});
 }
 if(slug==='vinegar-titration'){
  model=M.vinegar;
  const colorText={clear:'섞은 용액은 무색입니다.',local:'떨어진 곳에만 분홍색이 보입니다. 먼저 고르게 섞으세요.',faint:'섞은 뒤에도 옅은 분홍색이 남았습니다.',strong:'섞은 뒤 진한 분홍색입니다. 종말점을 지나쳤습니다.'};
  render=()=>{steps([['시료',s.prepared&&s.indicator],['뷰렛 끝 충전',s.tip],['처음 눈금',s.initial!==null],['적정 '+s.trials.length+'/3',s.trials.length===3]]);const read=model.reading(s),y=70+read*4.2,p=model.color(s),level=440-(model.sampleVolume(s)+s.delivered)*.8;
   let b='<rect x="25" y="444" width="259" height="13" rx="5" fill="#a8bdc6"/><path d="M52 444V52H161" fill="none" stroke="url(#soMetal)" stroke-width="7"/><path d="M157 68V288Q168 300 179 288V68" fill="url(#soGlass)" stroke="#88a9b7" stroke-width="2"/>'+text(169,38,'NaOH 0.100 M');
   if(s.filled)b+=`<path d="M160 ${y}Q168 ${y+3} 176 ${y}V287Q168 295 160 287Z" fill="url(#soWater)"/>`;
   for(let n=0;n<=50;n+=5){const yy=70+n*4.2;b+=`<path d="M180 ${yy}h${n%10?5:11}" stroke="#73919f"/>`;if(n%10===0)b+=text(207,yy+5,n);}
   b+='<path d="M168 299V328" stroke="#7296a7" stroke-width="4"/><rect x="144" y="298" width="49" height="7" rx="3" fill="#627f8e"/><path d="M148 299V290" stroke="#546d7c" stroke-width="4"/>';
   if(s.filled&&!s.tip)b+='<circle cx="168" cy="314" r="3" fill="white" stroke="#7496a6"/>';
   const flask='M150 345V372L105 428Q98 441 113 444H224Q239 441 232 428L187 372V345Z';b+=`<defs><clipPath id="viFlask"><path d="${flask}"/></clipPath></defs><path d="${flask}" fill="url(#soGlass)" stroke="#88a9b7" stroke-width="2"/>`;
   if(s.prepared){b+=`<path d="M98 ${level}Q165 ${level+4} 238 ${level}V445H98Z" fill="${p==='faint'?'#efb8d1':p==='strong'?'#d64a97':'url(#soWater)'}" opacity=".8" clip-path="url(#viFlask)"/>`;if(p==='local')b+=`<ellipse cx="168" cy="${level+5}" rx="13" ry="8" fill="#d75c9a" opacity=".8"/>`;}
   const start=Math.floor(read),zy=126+(read-start)*132;b+='<rect x="361" y="87" width="191" height="242" rx="12" fill="#f5fafb" stroke="#b9d0d9"/>'+text(456,68,'수면을 같은 눈높이에서 읽기');
   if(s.filled)b+=`<path d="M392 ${zy-4}Q421 ${zy+4} 450 ${zy-4}V312H392Z" fill="url(#soWater)"/>`;
   for(let n=0;n<=10;n++){const yy=126+n*13.2;b+=`<path d="M450 ${yy}h${n%5?8:15}" stroke="#6d8e9e"/>`;if(n%5===0)b+=text(480,yy+5,fmt(start+n/10,2),'start');}b+=text(454,352,'뷰렛 눈금 (mL)')+text(170,478,s.protocol==='direct'?'원액 3 mL 전량':'원액 2 mL에 해당');scene(b,500);
   $('viColor').textContent=s.prepared?colorText[p]:'시료와 뷰렛을 준비하세요.';$('viTrials').innerHTML=table('세 차례의 사용량',['회','처음 (mL)','나중 (mL)','사용량 (mL)'],s.trials.map((r,i)=>[i+1,fmt(r.initial),fmt(r.final),fmt(r.used)]));
   setDisabled('viProtocol',s.prepared||s.trials.length>0);setDisabled('viPrepare',s.prepared);setDisabled('viIndicator',!s.prepared||s.indicator);setDisabled('viFill',s.filled);setDisabled('viTip',!s.filled||s.tip);setDisabled('viMark',!s.tip||s.initial!==null);setDisabled('viInitial',s.initial!==null);for(const id of ['viAdd1','viDrop','viMix'])setDisabled(id,!s.prepared||!s.indicator||s.initial===null||s.recorded||s.delivered>=48);setDisabled('viRecord',s.initial===null||s.recorded);setDisabled('viNext',!s.recorded||s.trials.length>=3);setDisabled('viRetry',s.recorded||!s.prepared);setDisabled('viCalculate',s.trials.length!==3);
  };
  reset=()=>{s=model.create();$('viProtocol').value='direct';for(const id of ['viInitial','viFinal','viMolarity','viMass'])$(id).value=0;$('viResult').textContent='세 번의 사용량 평균으로 계산하세요. 아세트산 몰질량은 60.0 g/mol입니다.';say('시료 조제 방법을 정하세요. 증류수로 묽혀도 전량을 적정하면 아세트산의 양은 같습니다.');render();};
  on('viProtocol',()=>{s.protocol=$('viProtocol').value;render();},'change');
  on('viPrepare',()=>{s.prepared=true;say(s.protocol==='direct'?'원액 3 mL를 약 30 mL로 묽혀 전량 준비했습니다.':'원액 10 mL를 100 mL로 묽힌 뒤 20 mL를 취했습니다. 원액 2 mL에 해당합니다.');render();});
  on('viIndicator',()=>{s.indicator=true;say('페놀프탈레인 2방울을 넣었습니다. 원래 시료는 무색입니다.');render();});
  on('viFill',()=>{s.filled=true;say('뷰렛에 표준 용액을 채웠습니다. 꼭지 아래에도 용액을 채운 뒤 처음 눈금을 읽으세요.');render();});
  on('viTip',()=>{s.tip=true;say('끝의 공기를 빼고 흘린 용액은 따로 버렸습니다. 확대 눈금의 수면 아래쪽을 읽으세요.');render();});
  on('viMark',()=>{const n=Number($('viInitial').value);if(Math.abs(n-model.reading(s))>.025)return say('처음 눈금이 확대 수면 위치와 맞지 않습니다. 0이 아닌 시작 눈금을 다시 읽으세요.');s.initial=n;say('처음 눈금을 표시했습니다. 시료에 표준 용액을 넣고 고르게 섞어 색을 확인하세요.');render();});
  for(const[id,v]of[['viAdd1',1],['viDrop',.05]])on(id,()=>{model.add(s,v);say('표준 용액을 넣었습니다. 방울 주변의 색만 보고 멈추지 말고 플라스크를 흔들어 섞으세요.');render();});
  on('viMix',()=>{s.mixed=true;render();say(colorText[model.color(s)]);});
  on('viRecord',()=>{if(s.trials.length>=3)return;const n=Number($('viFinal').value);if(!model.record(s,n))return say(!s.mixed?'먼저 고르게 섞어 전체 시료의 색을 확인하세요.':model.color(s)==='strong'?'종말점을 지나친 시료입니다. 이번 시료를 다시 준비하고 끝에서는 한 방울씩 넣으세요.':model.color(s)!=='faint'?'섞은 뒤 옅은 분홍색이 남는 지점을 먼저 찾으세요.':'나중 눈금이 수면 위치와 맞지 않습니다. 확대 눈금을 다시 읽으세요.');s.recorded=true;say(s.trials.length===3?'세 차례의 사용량이 모였습니다. 평균 부피에서 원액의 농도를 계산하세요.':'이번 눈금을 사용했습니다. 새 시료로 다음 적정을 준비하세요.');render();});
  on('viNext',()=>{const {trials,protocol}=s;s=model.create();Object.assign(s,{trials,protocol});$('viInitial').value=0;$('viFinal').value=0;say('새 시료와 뷰렛으로 다음 적정을 준비하세요. 같은 조제법을 사용합니다.');render();});
  on('viRetry',()=>{const {trials,protocol}=s;s=model.create();Object.assign(s,{trials,protocol});$('viInitial').value=0;$('viFinal').value=0;say('이번 시료만 다시 준비합니다. 앞서 사용한 적정값은 유지됩니다.');render();});
  on('viCalculate',()=>{const c=model.concentration(s),g=c*6,mc=Number($('viMolarity').value),mg=Number($('viMass').value);$('viResult').textContent=Math.abs(mc-c)<.003&&Math.abs(mg-g)<.02?`원액 ${fmt(c,3)} M, 100 mL 속 아세트산 ${fmt(g)} g입니다. 사용량의 평균과 원액에 해당하는 시료 부피를 함께 적용했습니다.`:Math.abs(mc-c)>=.003?'NaOH 사용량은 나중−처음 눈금의 차입니다. 세 번의 평균과 원액에 해당하는 3 mL 또는 2 mL를 이용해 다시 계산하세요.':'100 mL는 0.100 L입니다. 원액 몰농도 × 0.100 L × 60.0 g/mol로 질량을 구하세요.';});
 }
 if(!model)return;on('soReset',()=>reset());reset();new ResizeObserver(font).observe(host);window.__solutionPractice={getState:()=>JSON.parse(JSON.stringify(s)),slug};
})();
