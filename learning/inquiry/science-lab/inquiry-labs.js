(function(){
 'use strict';
 const host=document.querySelector('[data-inquiry]');if(!host)return;
 const M=window.scienceInquiryModels,slug=host.dataset.inquiry,$=id=>document.getElementById(id);
 const scene=$('inquiryScene'),readout=$('inquiryReadout'),extra=$('inquiryExtra'),status=$('inquiryStatus');
 const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
 const val=id=>$(id).value,num=id=>Number(val(id));
 const fmt=(n,d=1)=>Number(n).toFixed(d);
 const text=(x,y,t,attrs='')=>`<text x="${x}" y="${y}" ${attrs}>${esc(t)}</text>`;
 let svgSerial=0;const svgIds=new Map();
 const svg=(body,label,w=540,h=310)=>{if(!svgIds.has(label))svgIds.set(label,++svgSerial);const scopedId="inquiry-arrow-"+svgIds.get(label);return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}"><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#b65d20"/></marker></defs>${body}</svg>` .replaceAll('id="arrow"','id="'+scopedId+'"').replaceAll('url(#arrow)','url(#'+scopedId+')');};
 const line=(x1,y1,x2,y2,color='#527785',other='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2" ${other}/>`;
 const metrics=items=>window.scienceScene.render(readout,items.map(([label,value])=>`<div><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join(''));
 const colors=['#1a7581','#ac5626','#7254ad'];
 let state={},timer=null;
 // Short visual animations (pour, drop, pull, translate…). They never change the model state;
 // the state is updated at once and the picture catches up over a second or two.
 const reduceMotion=()=>!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 let fx=null,fxId=0;
 function cancelFx(){if(fxId)cancelAnimationFrame(fxId);fxId=0;fx=null;}
 function animate(kind,dur,data={}){cancelFx();if(reduceMotion()){draw();return;}const t0=performance.now();fx={kind,k:0,...data};const f=now=>{if(!fx)return;fx.k=Math.min(1,(now-t0)/dur);if(fx.k>=1){fx=null;fxId=0;}else fxId=requestAnimationFrame(f);draw();};fxId=requestAnimationFrame(f);draw();}
 const fxk=kind=>fx&&fx.kind===kind?fx.k:null;
 const ease=t=>t<=0?0:t>=1?1:t*t*(3-2*t),seg=(k,a,b)=>ease((k-a)/(b-a)),lerp=(a,b,t)=>a+(b-a)*t;
 const fig=(body,label,w,h,cls='')=>`<div class="ix-fig ${cls}">${svg(body,label,w,h)}</div>`;
 function stop(){cancelFx();if(timer)cancelAnimationFrame(timer);timer=null;if($('play'))$('play').textContent='움직임 재생';if($('playWave'))$('playWave').textContent='발생판으로 파 만들기';}
 function labels(){host.querySelectorAll('input[type=range]').forEach(el=>{const value=(el.id==='time'?Number(el.value).toFixed(2):el.value)+' '+el.dataset.unit;if($(el.id+'Value').textContent!==value)$(el.id+'Value').textContent=value;});}
 function playTime(max,button,label){if(timer){stop();return;}if(num('time')>=max)$('time').value=0;$('time').step='.001';let time=num('time'),last=0;$(button).textContent=label;function frame(now){if(last)time=Math.min(max,time+Math.min((now-last)/1000,.08));last=now;$('time').value=time;draw();if(time>=max)stop();else timer=requestAnimationFrame(frame);}timer=requestAnimationFrame(frame);}
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
  window.scienceScene.render(scene,svg(body,'같은 조건의 단열재 세 종류와 물의 온도',540,275));
  metrics(rows.map(r=>[r.name,fmt(r.temperature)+' ℃']));
  window.scienceScene.render(extra,chart(rows.map((r,i)=>({name:r.name,points:Array.from({length:num('time')+1},(_,t)=>[t,M.insulation({...options,minutes:t})[i].temperature])}))));
  status.textContent=`${num('time')}분 · 실온 20 ℃ · 물 ${num('volume')} mL · 세 장치의 단열층 두께 ${num('thickness')} cm. 조건을 바꾸면 같은 시각의 다른 실험을 비교합니다.`;
 }
 // Doppler: the source really moves and every wavefront is a circle centred where the source was
 // when it was emitted. The source speed is drawn 4 times faster than true scale (stated in the figure).
 const DOP={T:7,c:90,exaggerate:4,y:132,ground:212,mic:478};
 function doppler(){
  const r=M.doppler({frequency:num('frequency'),speed:num('speed'),direction:val('direction')});
  const k=fxk('doppler'),t=k===null?DOP.T:k*DOP.T,vpx=DOP.exaggerate*r.velocity/343*DOP.c,period=.45*440/r.source;
  const x0=r.velocity>0?90:r.velocity<0?400:250,sx=x0+vpx*t;
  let waves='';
  for(let n=Math.floor(t/period);n>=0;n--){const te=n*period,rad=DOP.c*(t-te);if(rad<2)continue;if(rad>640)break;const cx=x0+vpx*te,o=Math.max(.25,1-rad/700);waves+=`<circle cx="${fmt(cx,1)}" cy="${DOP.y}" r="${fmt(rad,1)}" fill="none" stroke="#2e7d8c" stroke-width="2" opacity="${fmt(o,2)}"/>`;}
  const g=DOP.ground,m=DOP.mic;
  let body=`<defs><clipPath id="dopClip"><rect x="0" y="0" width="560" height="${g+18}"/></clipPath><linearGradient id="dopBox" x2="0" y2="1"><stop stop-color="#5b6f7c"/><stop offset="1" stop-color="#34454f"/></linearGradient><radialGradient id="dopCone" cx=".4" cy=".35"><stop stop-color="#c9d3d9"/><stop offset=".7" stop-color="#7d8d97"/><stop offset="1" stop-color="#46555e"/></radialGradient></defs>`;
  body+=`<rect x="0" y="0" width="560" height="${g+18}" fill="#f7fbfc"/><g clip-path="url(#dopClip)">${waves}</g>`;
  body+=`<rect x="0" y="${g+8}" width="560" height="10" fill="#d9cfbf"/><line x1="0" y1="${g+8}" x2="560" y2="${g+8}" stroke="#a8977c" stroke-width="2"/>`;
  // speaker on a small cart
  body+=`<g transform="translate(${fmt(sx,1)} 0)"><rect x="-27" y="${g-20}" width="54" height="16" rx="4" fill="#8a6d4b" stroke="#5e4930"/><circle cx="-15" cy="${g}" r="8" fill="#38444c"/><circle cx="15" cy="${g}" r="8" fill="#38444c"/><circle cx="-15" cy="${g}" r="3" fill="#b7c2c8"/><circle cx="15" cy="${g}" r="3" fill="#b7c2c8"/>`+
   `<rect x="-22" y="${DOP.y-26}" width="44" height="${g-20-DOP.y+26}" rx="5" fill="url(#dopBox)" stroke="#26333b"/><circle cx="0" cy="${DOP.y}" r="16" fill="url(#dopCone)" stroke="#26333b"/><circle cx="0" cy="${DOP.y}" r="5" fill="#2c3840"/><circle cx="0" cy="${g-36}" r="6" fill="#7d8d97" stroke="#26333b"/></g>`;
  // microphone on a stand
  body+=`<path d="M${m-18} ${g+8}L${m} ${g-6}L${m+18} ${g+8}" fill="none" stroke="#45525a" stroke-width="3"/><line x1="${m}" y1="${DOP.y+18}" x2="${m}" y2="${g-4}" stroke="#56636b" stroke-width="4"/><rect x="${m-6}" y="${DOP.y+10}" width="12" height="16" rx="3" fill="#2f3a41"/><rect x="${m-11}" y="${DOP.y-20}" width="22" height="34" rx="11" fill="#b9c4ca" stroke="#36434b" stroke-width="2"/>`;
  for(let i=0;i<4;i++)body+=line(m-9,DOP.y-12+i*7,m+9,DOP.y-12+i*7,'#6b7a83','stroke-width="1.2"');
  if(r.velocity){const dir=Math.sign(r.velocity);body+=line(sx-dir*18,DOP.y-44,sx+dir*30,DOP.y-44,'#b65d20','marker-end="url(#arrow)" stroke-width="3"');}
  body+=(sx>m-200?text(Math.min(sx+26,m-78),g+40,'스피커(음원)','text-anchor="end"'):text(sx,g+40,'스피커(음원)','text-anchor="middle"'))+text(m,g+40,'마이크(정지)','text-anchor="middle"');
  if(r.velocity)body+=text(16,g+62,'음원 속력은 4배로 크게 그림');
  window.scienceScene.render(scene,fig(body,'움직이는 스피커와 퍼져 나가는 파면, 정지한 마이크',560,g+72,'ix-dop'));
  metrics([['음원 설정',fmt(r.source,0)+' Hz'],['수신 진동수',fmt(r.observed)+' Hz'],['수신 쪽 파장',fmt(r.wavelength,3)+' m']]);
  status.textContent=`공기의 음속 343 m/s · 마이크 정지. 수신 진동수는 음원 설정의 ${fmt(r.observed/r.source,3)}배입니다.`;
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
  body+=text(22,302,'주황 화살표: 운동 가속도의 방향 (길이는 확대 표시)');window.scienceScene.render(scene,svg(body,'운동 위치와 가속도 방향',540,325));
  metrics([['운동 속력',fmt(r.speed,2)+' m/s'],['운동 가속도 크기',fmt(r.a,2)+' m/s²'],['원시 센서 크기',fmt(r.sensor,2)+' m/s²']]);
  const keys=options.motion==='circle'?['ax','ay']:['az'];
  window.scienceScene.render(extra,chart(keys.map(k=>({name:k==='az'?'수직 가속도':k==='ax'?'x 가속도':'y 가속도',points:Array.from({length:121},(_,i)=>[i/10,M.acceleration({...options,time:i/10})[k]])})),{xmax:12,ymin:-Math.max(5,r.a+1),ymax:Math.max(5,r.a+1),xlabel:'시간 (초)',ylabel:'운동 가속도 (m/s²)'}));
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
  window.scienceScene.render(scene,'<p class="scroll-hint">작은 화면에서는 가닥을 좌우로 밀어 전체를 확인하세요.</p><div class="sequence-scroll" tabindex="0" role="region" aria-label="DNA 가닥 전체, 좌우로 이동 가능">'+svg(body,'부모 두 주형과 새 DNA의 상보적 염기 및 역평행 방향',680,335)+'</div><div class="dna-legend"><span style="border-color:#a4bfce">부모 DNA</span><span style="border-color:#a9dfcf">새 DNA</span><span style="border-color:#cdb8eb">RNA 프라이머</span></div>');
  metrics([['열린 주형',s.fork+' / 12 쌍'],['채운 새 가닥',s.leading.filter(Boolean).length+s.lagging.filter(Boolean).length+' / 24'],['연결 상태',s.joined?'두 딸 DNA 완성':s.replaced?'조각 연결 전':'합성 중']]);status.textContent=s.message;
 }
 const sequences={normal:'AUGUUUGGCUAA',synonymous:'AUGUUCGGCUAA',stop:'AUGUAAGGCUAA',insertion:'AUGCUUUGGCUAA',polyU:'UUUUUUUUUUUU',polyA:'AAAAAAAAAAAA',polyC:'CCCCCCCCCCCC'};
 // Transcription (top band) and translation (bottom band). The mRNA is built base by base under the
 // template, then moves down to the ribosome; tRNAs enter the A site, the chain is handed over and
 // the ribosome slides one codon.
 const AA3={F:'Phe',L:'Leu',S:'Ser',Y:'Tyr',C:'Cys',W:'Trp',P:'Pro',H:'His',Q:'Gln',R:'Arg',I:'Ile',M:'Met',T:'Thr',N:'Asn',K:'Lys',V:'Val',A:'Ala',D:'Asp',E:'Glu',G:'Gly'};
 const BASE_FILL={A:'#ffd9a8',T:'#f6b8b8',U:'#e3cbf7',G:'#c4e6c0',C:'#c3d9f4'},AA_FILL=['#f3c58f','#9fd0c4','#d7b8ea','#f2a9a0','#b9d48f','#a9c2ec'];
 const baseTab=(x,y,b)=>`<rect x="${fmt(x-14,1)}" y="${fmt(y,1)}" width="28" height="22" rx="4" fill="${BASE_FILL[b]||'#eee'}" stroke="#5e7180" stroke-width="1"/>`+text(fmt(x,1),fmt(y+16,1),b,'text-anchor="middle" class="base-label"');
 function proteinFigure(rna,cellFree,r,all){
  const n=rna.length,BX=i=>50+i*36,kT=fxk('transcribe'),kA=fxk('attach'),DOWN=214,tmpl=M.complement(rna.replaceAll('U','T'));
  let body=`<rect x="6" y="6" width="548" height="114" rx="8" fill="#f1f6f8"/><rect x="6" y="128" width="548" height="222" rx="8" fill="#f8f5ef"/>`;
  body+=text(16,28,cellFree?'준비한 반복 RNA':'DNA 주형 가닥')+text(16,150,'mRNA와 리보솜');
  if(!cellFree){body+=line(BX(0)-18,42,BX(n-1)+18,42,'#4f6573','stroke-width="4"');for(let i=0;i<n;i++)body+=baseTab(BX(i),42,tmpl[i]);body+=text(BX(0)-22,47,'3′','text-anchor="end"')+text(BX(n-1)+22,47,'5′');}
  // where the mRNA is drawn
  let off=state.transcribed?DOWN:null,count=n,mo=1,poly=null,ribO=state.transcribed?1:0;
  if(kT!==null){ribO=seg(kT,.85,1);if(cellFree){mo=seg(kT,0,.3);off=DOWN*seg(kT,.35,.85);}else{const p=Math.min(1,kT/.68);count=Math.min(n,Math.floor(p*n)+1);if(p<1)poly=BX(Math.min(n-1,p*n));off=DOWN*seg(kT,.72,1);}}
  const start=Math.max(0,all.start||0),cX=i=>BX(start+3*i+1),s=state.steps,stopped=r.stopped,reads=all.reads||[];
  const mid=(a,b)=>(cX(a)+cX(b))/2,pos=(st,stp)=>stp?mid(st-2,st-1):st<=1?mid(0,1):mid(st-1,st);
  let isStop=false,ribX=pos(s,stopped);
  if(kA!==null&&s>=1){isStop=reads[s-1]?.amino==='*';if(!isStop&&s>=2)ribX=lerp(pos(s-1,false),pos(s,false),seg(kA,.6,1));}
  // ribosome subunits sit behind the mRNA
  if(ribO>0&&off===DOWN)body+=`<g opacity="${fmt(ribO,2)}"><ellipse cx="${fmt(ribX,1)}" cy="236" rx="112" ry="58" fill="#ead8bf" stroke="#b38f6c" stroke-width="1.5"/><ellipse cx="${fmt(ribX,1)}" cy="314" rx="106" ry="17" fill="#dcc3a3" stroke="#b38f6c" stroke-width="1.5"/></g>`;
  if(off!==null){const y=68+off;
   if(ribO>0&&off===DOWN&&!stopped&&reads[s]&&kA===null)body+=`<rect x="${BX(start+3*s)-17}" y="${y-3}" width="${36*2+34}" height="28" rx="6" fill="#fff0b8" stroke="#d6a21e" stroke-width="1.2"/>`;
   body+=`<g opacity="${fmt(mo,2)}">`+line(BX(0)-18,y+22,BX(count-1)+18,y+22,'#8456b0','stroke-width="4"');for(let i=0;i<count;i++)body+=baseTab(BX(i),y,rna[i]);
   if(off===DOWN){for(let i=0;start+3*i+2<n;i++)body+=`<path d="M${BX(start+3*i)-13} ${y+30}v5H${BX(start+3*i+2)+13}v-5" fill="none" stroke="#8a7d6c" stroke-width="1.5"/>`;}
   body+=text(BX(0)-22,y+27,'5′','text-anchor="end"')+(count===n?text(BX(n-1)+22,y+27,'3′'):'')+'</g>';
   if(!cellFree&&off<4)for(let i=0;i<count;i++)body+=line(BX(i)-4,64,BX(i)-4,68,'#7c8b94','stroke-width="1"')+line(BX(i)+4,64,BX(i)+4,68,'#7c8b94','stroke-width="1"');
  }
  if(poly!==null)body+=`<ellipse cx="${fmt(poly+10,1)}" cy="66" rx="40" ry="34" fill="#8fcf9f" fill-opacity=".5" stroke="#3f8c5a" stroke-width="1.5"/>`+text(fmt(poly+10,1),114,'RNA 중합 효소','text-anchor="middle"');
  if(ribO>0&&off===DOWN){
   const tRNA=(ci,dx,dy,o,aa)=>{const cx=cX(ci),codon=rna.slice(start+3*ci,start+3*ci+3),anti=M.complement(codon.replaceAll('U','T')).replaceAll('T','U');
    let g=`<g opacity="${fmt(o,2)}" transform="translate(${fmt(dx,1)} ${fmt(dy,1)})"><path d="M${cx-50} 258L${cx-12} 214H${cx+12}L${cx+50} 258Z" fill="#f6e3a1" stroke="#b39436" stroke-width="1.5"/><rect x="${cx-5}" y="200" width="10" height="16" fill="#e2c86f" stroke="#b39436"/>`;
    for(let j=0;j<3;j++)g+=`<rect x="${cx+(j-1)*36-14}" y="258" width="28" height="22" rx="4" fill="${BASE_FILL[anti[j]]||'#eee'}" stroke="#5e7180"/>`+text(cx+(j-1)*36,274,anti[j]||'','text-anchor="middle" class="base-label"');
    if(aa)g+=`<circle cx="${cx}" cy="188" r="17" fill="${AA_FILL['MFGLWKPSAYCHQRITNVDE'.indexOf(aa)%6]||'#ddd'}" stroke="#5b4a3a" stroke-width="1.2"/>`+text(cx,193,AA3[aa]||aa,'text-anchor="middle" class="aa-label"');
    return g+'</g>';};
   const rf=(ci,dy,o)=>{const cx=cX(ci);return `<g opacity="${fmt(o,2)}" transform="translate(0 ${fmt(dy,1)})"><rect x="${cx-48}" y="206" width="96" height="74" rx="16" fill="#cddcf2" stroke="#6b84ad" stroke-width="1.5"/>`+text(cx,248,'방출 인자','text-anchor="middle"')+'</g>';};
   const chainAt=(list,ax,ay)=>{let g='';const L=list.length;for(let j=L-1;j>=0;j--){const back=L-1-j,x=ax-34*back,y=ay-10*back;if(back>0)g+=line(x,y,x+34,y+10,'#5b4a3a','stroke-width="3"');}for(let j=0;j<L;j++){const back=L-1-j,x=ax-34*back,y=ay-10*back;g+=`<circle cx="${fmt(x,1)}" cy="${fmt(y,1)}" r="17" fill="${AA_FILL['MFGLWKPSAYCHQRITNVDE'.indexOf(list[j])%6]||'#ddd'}" stroke="#5b4a3a" stroke-width="1.2"/>`+text(fmt(x,1),fmt(y+5,1),AA3[list[j]]||list[j],'text-anchor="middle" class="aa-label"');}return g;};
   const freeChain=(list,cx,y,o)=>{let g=`<g opacity="${fmt(o,2)}">`;const L=list.length;list.forEach((a,m)=>{const x=cx-(L-1)*17+34*m;if(m)g+=line(x-34,y,x,y,'#5b4a3a','stroke-width="3"');});list.forEach((a,m)=>{const x=cx-(L-1)*17+34*m;g+=`<circle cx="${fmt(x,1)}" cy="${y}" r="17" fill="${AA_FILL['MFGLWKPSAYCHQRITNVDE'.indexOf(a)%6]||'#ddd'}" stroke="#5b4a3a" stroke-width="1.2"/>`+text(fmt(x,1),y+5,AA3[a]||a,'text-anchor="middle" class="aa-label"');});return g+'</g>';};
   let objs='',chain='',P=null;
   if(kA===null){
    if(!stopped&&s>=1){P=s-1;objs+=tRNA(s-1,0,0,1,null);chain=chainAt(r.protein,cX(s-1),188);}
    if(stopped){P=s-2;objs+=tRNA(s-2,0,0,1,null)+rf(s-1,0,1);chain=freeChain(r.protein,ribX,158,1);}
   }else{
    const enter=-110*(1-seg(kA,0,.4)),eo=seg(kA,0,.25),q=seg(kA,.6,1),prev=r.protein.slice(0,isStop?r.protein.length:-1);
    if(isStop){P=s-2;objs+=tRNA(s-2,0,0,1,null)+rf(s-1,enter,eo);const h=seg(kA,.55,1);chain=h<=0?chainAt(prev,cX(s-2),188):freeChain(prev,lerp(cX(s-2)-17*(prev.length-1),ribX,h),lerp(188,158,h),1);}
    else{P=s-1;if(s>=2)objs+=tRNA(s-2,-50*q,-70*q,1-q,null);
     if(kA<.5){objs+=tRNA(s-1,0,enter,eo,r.protein.at(-1));if(s>=2)chain=chainAt(prev,cX(s-2),188);}
     else{objs+=tRNA(s-1,0,0,1,null);chain=chainAt(r.protein,cX(s-1),188);}}
   }
   body+=objs+chain;
   const sp=P!==null&&P>=0?P:0;body+=text(cX(sp),331,'P 자리','text-anchor="middle" class="site-label"')+text(cX(sp+1),331,'A 자리','text-anchor="middle" class="site-label"');
   body+=text(fmt(ribX,1),346,'리보솜','text-anchor="middle"');
  }
  return fig(body,'DNA 주형에서 mRNA가 만들어지고, 리보솜에서 tRNA가 아미노산을 잇는 모습',560,356,'ix-protein');
 }
 function protein(){
  const key=val('sequence'),rna=sequences[key],cellFree=key.startsWith('poly'),r=M.translate(rna,state.steps,{cellFree}),all=M.translate(rna,Infinity,{cellFree});
  $('transcribe').textContent=cellFree?'준비된 반복 RNA 넣기':'DNA에서 mRNA 전사';$('transcribe').disabled=state.transcribed;
  for(const i of [0,1,2])$('anti'+i).disabled=val('amino')==='*';
  $('attach').disabled=!state.transcribed||r.stopped||state.steps>=all.reads.length;
  window.scienceScene.render(scene,proteinFigure(rna,cellFree,r,all)+`<div class="protein-chain" aria-label="합성한 아미노산 사슬">${r.protein.length?r.protein.map(a=>'<span>'+M.aaNames[a]+'</span>').join(' → '):'아직 연결된 아미노산이 없습니다.'}</div>`);
  metrics([['읽은 코돈',r.reads.length+'개'],['아미노산',r.protein.length+'개'],['펩타이드 결합',Math.max(0,r.protein.length-1)+'개']]);
  status.textContent=state.message||(state.transcribed?r.message:'전사한 뒤 유전부호 표에서 현재 코돈에 맞는 아미노산을 찾으세요.');
 }
 const genes={RR:'XᴿXᴿ',Rr:'XᴿXʳ',rr:'XʳXʳ',RY:'XᴿY',rY:'XʳY'};
 function pedigree(){
  const xy={'I-1':[130,48],'I-2':[250,48],'II-1':[110,150],'II-2':[300,150],'II-3':[430,150],'III-1':[300,257],'III-2':[430,257]};
  let body=line(130,48,250,48)+line(190,48,190,102)+line(110,102,300,102)+line(110,102,110,150)+line(300,102,300,150)+line(300,150,430,150)+line(365,150,365,210)+line(300,210,430,210)+line(300,210,300,257)+line(430,210,430,257);
  for(const p of M.family){const [x,y]=xy[p.id],attrs=`fill="${p.affected?'#276d7b':'white'}" stroke="#1c5265" stroke-width="2"`;body+=p.sex==='M'?`<rect x="${x-17}" y="${y-17}" width="34" height="34" ${attrs}/>`:`<circle cx="${x}" cy="${y}" r="17" ${attrs}/>`;body+=text(x,y+37,p.id,'text-anchor="middle"');}
  window.scienceScene.render(scene,svg(body,'3세대 가계도: I-1과 I-2의 자녀 II-1, II-2. II-2와 II-3의 자녀 III-1, III-2. 형질이 있는 사람은 II-1, II-3, III-1.',540,312));
  window.scienceScene.render(extra,`<div class="person-genotypes">${M.family.map(p=>`<label>${p.id} · ${p.sex==='M'?'남':'여'} · 형질 ${p.affected?'있음':'없음'}<select data-person="${p.id}"><option value="">유전자형 선택</option>${(p.sex==='M'?['RY','rY']:['RR','Rr','rr']).map(g=>`<option value="${g}">${genes[g]}</option>`).join('')}</select></label>`).join('')}</div><button id="checkFamily">가계도 추론 확인</button><div id="familyFeedback" class="pedigree-result" aria-live="polite"></div><section class="cross-controls"><h3>부모 조합을 바꾸어 예측하기</h3><div class="toolbar"><label>어머니 <select id="mother">${['Rr','RR','rr'].map(g=>`<option value="${g}">${genes[g]}</option>`).join('')}</select></label><label>아버지 <select id="father">${['RY','rY'].map(g=>`<option value="${g}">${genes[g]}</option>`).join('')}</select></label></div><div id="crossResult"></div></section>`);
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
  window.scienceScene.render(scene,`<div class="karyo-picker"><p class="selected-card">${selected?'선택: 카드 '+letter(selected.id):'카드 목록을 좌우로 밀어 고르세요.'}</p><div class="karyo-pool" aria-label="염색체 카드">${s.cards.map(c=>`<button class="karyo-card" data-card="${c.id}" aria-pressed="${state.selected===c.id}" aria-label="카드 ${letter(c.id)}${placed.includes(c.id)?', 배치됨':''}">${chromosomeDrawing(c)}<span>${letter(c.id)}${placed.includes(c.id)?' ✓':''}</span></button>`).join('')}</div></div><div class="karyo-board" aria-label="핵형 배열판">${Object.entries(s.slots).map(([kind,ids])=>`<button class="karyo-slot" data-slot="${kind}" aria-label="${kind==='X'?'성염색체':kind+'번'} 칸, 기준 1개와 배치 ${ids.length}개"><b>${kind==='X'?'성염색체':kind+'번'}</b>${chromosomeDrawing(M.chromosome(kind))}${ids.map(id=>chromosomeDrawing(s.cards.find(c=>c.id===id))).join('')}<b>기준 1 + ${ids.length}</b></button>`).join('')}</div>`);
  window.scienceScene.render(extra,'');scene.querySelector('.karyo-pool').scrollLeft=scroll;
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
  if(r.observed)body+=line(boundary,70,boundary,170,'#768b71');window.scienceScene.render(scene,'<div class="disc-scenes">'+plate+svg(body,'선택 디스크의 가장자리 0에서 바깥 경계까지 측정',260,285)+'</div>');
  metrics([['가상 시료',num('sampleSet')+1+'회'],['경과 시간',state.time+'시간'],['배치',r.overlap?'구역 겹침':'겹침 없음']]);
  $('incubate').disabled=state.time>=24;$('measure').disabled=!r.observed||r.overlap;
  status.textContent=state.message||(r.overlap?'억제 구역이 겹쳤습니다. 현재 경계로는 각 추출액의 폭을 독립적으로 잴 수 없습니다. 간격을 바꾸어 재실험하세요.':r.observed?'선택 디스크의 가장자리 0에서 바깥 경계까지 자를 늘려 측정하세요.':'배양 전에는 억제 결과를 판정하지 않습니다. A~D는 익명의 가상 자료입니다.');
 }
 function waterWaves(){
  const ks=fxk('wstep'),o={length:num('length'),depth:num('depth'),amplitude:num('amplitude'),time:ks===null?num('time'):lerp(fx.from,fx.to,ks)},r=M.waterWave(o);
  // Horizontal: two wavelengths across the tank. Vertical: wave height enlarged (stated in the figure).
  const X0=58,X1=516,W=X1-X0,MEAN=96,BOT=208,pxm=W/(r.L*2),scale=560,exag=scale/pxm;
  const surface=Array.from({length:181},(_,i)=>{const x=i/180*r.L*2,v=M.waterWave({...o,x});return [X0+i/180*W,MEAN-v.surface*scale];});
  const sAt=x=>MEAN-M.waterWave({...o,x}).surface*scale;
  let body=`<defs><linearGradient id="waveWater" x2="0" y2="1"><stop stop-color="#a9dde9"/><stop offset="1" stop-color="#5aa7bf"/></linearGradient><radialGradient id="waveBuoy" cx=".35" cy=".3"><stop stop-color="#ffe9a6"/><stop offset=".65" stop-color="#e8a83c"/><stop offset="1" stop-color="#b8741f"/></radialGradient></defs>`;
  body+=`<rect x="${X0-8}" y="40" width="${W+16}" height="${BOT-32}" rx="6" fill="#f2f8fa" stroke="#8fb3c1" stroke-width="2"/>`;
  body+=`<path d="M${X0} ${MEAN}${surface.map(([x,y])=>'L'+fmt(x,1)+' '+fmt(y,1)).join('')}L${X1} ${BOT}H${X0}Z" fill="url(#waveWater)"/><polyline points="${surface.map(([x,y])=>fmt(x,1)+','+fmt(y,1)).join(' ')}" fill="none" stroke="#24748b" stroke-width="2.5"/>`;
  body+=`<line x1="${X0}" y1="${MEAN}" x2="${X1}" y2="${MEAN}" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="6 6" opacity=".8"/>`;
  // water particles at three depths: each turns on its own small orbit (same enlargement as the surface)
  const hs=Math.min(scale,16/r.rx);
  for(const f of [.22,.5,.8]){const z=-r.h*f,y0=MEAN+(BOT-MEAN)*f;for(let i=1;i<=7;i++){const x=r.L*2*i/8,p=M.waterWave({...o,x,z});body+=`<circle cx="${fmt(X0+x*pxm+p.dx*hs,1)}" cy="${fmt(y0-p.dy*scale,1)}" r="3.6" fill="#1d5f74" opacity=".75"/>`;}}
  // crest markers travel; the buoy only circles
  for(let c=0;c<3;c++){const xc=((r.speed*o.time)%r.L)+c*r.L;if(xc>r.L*2)continue;const px=X0+xc*pxm;body+=`<path d="M${fmt(px,1)} ${fmt(sAt(xc)-6,1)}l-6 -10h12z" fill="#c2552d"/>`;}
  const bx=r.L,buoy=M.waterWave({...o,x:bx});
  body+=`<line x1="${fmt(X0+bx*pxm,1)}" y1="${MEAN-34}" x2="${fmt(X0+bx*pxm,1)}" y2="${MEAN+34}" stroke="#7d6a4c" stroke-width="1" stroke-dasharray="3 3"/><ellipse cx="${fmt(X0+bx*pxm+buoy.dx*hs,1)}" cy="${fmt(MEAN-buoy.dy*scale-2,1)}" rx="11" ry="8" fill="url(#waveBuoy)" stroke="#9a6420"/><line x1="${fmt(X0+bx*pxm+buoy.dx*hs,1)}" y1="${fmt(MEAN-buoy.dy*scale-10,1)}" x2="${fmt(X0+bx*pxm+buoy.dx*hs,1)}" y2="${fmt(MEAN-buoy.dy*scale-22,1)}" stroke="#9a6420" stroke-width="2"/>`;
  // flap-type wave maker hinged on the floor, pushed by a crank
  const ph=r.w*o.time,tip=8*Math.sin(ph),flapTop=MEAN-30;
  body+=`<path d="M${X0-4} ${BOT}L${fmt(X0+tip-4,1)} ${flapTop}H${fmt(X0+tip+4,1)}L${X0+4} ${BOT}Z" fill="#8a9aa4" stroke="#4d5c65" stroke-width="1.5"/><circle cx="${X0}" cy="${BOT}" r="4" fill="#4d5c65"/>`;
  const cx0=24,cy0=flapTop-6,crank=[cx0+9*Math.cos(ph),cy0+9*Math.sin(ph)];
  body+=`<rect x="6" y="${cy0-16}" width="36" height="32" rx="5" fill="#5d6f7a" stroke="#3a4850"/><circle cx="${cx0}" cy="${cy0}" r="11" fill="#c9d4da" stroke="#3a4850"/><line x1="${fmt(crank[0],1)}" y1="${fmt(crank[1],1)}" x2="${fmt(X0+tip,1)}" y2="${flapTop+4}" stroke="#3a4850" stroke-width="3" stroke-linecap="round"/><circle cx="${fmt(crank[0],1)}" cy="${fmt(crank[1],1)}" r="3" fill="#3a4850"/>`;
  body+=line(X1-118,28,X1-30,28,'#b65d20','marker-end="url(#arrow)" stroke-width="3"')+text(X1-124,33,'파의 진행','text-anchor="end"');
  body+=text(X0,BOT+30,'발생판')+text(X0+bx*pxm,BOT+30,'부표','text-anchor="middle"')+text(X1,BOT+30,`가로 0~${r.L*2} m · 물결 높이 약 ${Math.round(exag)}배 확대`,'text-anchor="end"');
  const top=fig(body,'발생판과 오른쪽으로 진행하는 물결, 표면의 부표와 물 입자',540,BOT+44);
  // Orbits have one enlargement factor across depths; separate from the tank scale.
  const orbitScale=Math.min(48/r.rx,20/Math.max(r.ry,1e-9)),cx=330;body=`<rect x="190" y="14" width="280" height="226" rx="6" fill="#e6f3f7" stroke="#a9cbd7"/>`;
  for(let i=0;i<4;i++){const z=-r.h*i/3,p=M.waterWave({...o,z,x:0}),cy=40+i*58;body+=`<ellipse cx="${cx}" cy="${cy}" rx="${fmt(p.rx*orbitScale,2)}" ry="${fmt(Math.max(.2,p.ry*orbitScale),2)}" fill="none" stroke="#5f8aa0" stroke-width="1.5" stroke-dasharray="4 3"/><circle cx="${fmt(cx+p.dx*orbitScale,2)}" cy="${fmt(cy-p.dy*orbitScale,2)}" r="5.5" fill="#b76329"/>`+text(176,cy+5,i===0?'수면':i===3?'바닥':'수심 '+fmt(-z,1)+' m','text-anchor="end"');}
  body+=line(190,240,470,240,'#907e63','stroke-width="3"');
  window.scienceScene.render(scene,top+'<p class="scroll-hint">물 입자의 궤도 확대 · 모든 깊이에 같은 배율</p>'+fig(body,'깊이에 따른 입자 궤도 비교',540,250));
  metrics([['수심 / 파장',fmt(r.ratio,3)+' · '+r.type],['파의 속력',fmt(r.speed,2)+' m/s'],['주기',fmt(r.period,2)+' s'],['파고',fmt(r.a*200,1)+' cm']]);
  status.textContent=`${fmt(o.time)}초 · 파장의 변화와 입자의 왕복을 구별하세요. 이 선형 모형에서 입자는 한 주기 뒤 같은 위치로 돌아옵니다.`;
 }
 // Two slim vials side by side: glucose and the water control. The active one receives the drops.
 const SV_LEVEL=[0,.3,.36,.44,.56,.64],SV_REAGENT={silver:'질산 은',ammonia:'암모니아수',sample:'시료',base:'NaOH'};
 const svGrains=Array.from({length:26},(_,i)=>({x:((i*37)%46)-23,y:(i*53)%17,r:2.2+(i*7)%3*.6,d:(i*29)%23/23}));
 function vial(cx,s,active,anim){
  const TOP=112,BOT=292,IN0=118,H=BOT-4-IN0,glucose=s.sample==='glucose';
  const lev=f=>BOT-4-f*H;
  let f=SV_LEVEL[Math.min(5,s.stage)],tilt=0,coat=glucose?s.turns/4:0,pptA=s.stage===2?1:0,pptFall=1,dissolve=0,drops='',pipette='';
  if(anim&&anim.kind==='sv-add'){const k=anim.k,from=SV_LEVEL[Math.min(5,s.stage-1)];f=lerp(from,f,seg(k,.2,.85));
   if(s.stage===2){pptA=seg(k,.25,.5);pptFall=seg(k,.35,1);}
   if(s.stage===3){pptA=1-seg(k,.3,.95);dissolve=k;}
   const tipY=TOP-14,surf=lev(f);pipette=`<g opacity="${fmt(1-seg(k,.85,1),2)}"><rect x="${cx-5}" y="${TOP-80}" width="10" height="62" rx="3" fill="#e9f3f6" stroke="#6b899a"/><path d="M${cx-5} ${TOP-20}L${cx} ${tipY}L${cx+5} ${TOP-20}Z" fill="#e9f3f6" stroke="#6b899a"/><rect x="${cx-8}" y="${TOP-108}" width="16" height="32" rx="8" fill="#9b4b3e" stroke="#6d3026"/></g>`;
   for(let d=0;d<3;d++){const p=(k-.12-d*.22)/.3;if(p>0&&p<1)drops+=`<ellipse cx="${cx}" cy="${fmt(lerp(tipY+4,surf,p*p),1)}" rx="3" ry="4" fill="#cfe6ee" stroke="#6b899a" stroke-width=".8"/>`;}
  }
  if(anim&&anim.kind==='sv-roll'){const k=anim.k;tilt=24*Math.sin(k*Math.PI*4)*(1-k*.3);if(glucose)coat=lerp((s.turns-1)/4,s.turns/4,seg(k,.1,.9));}
  const surf=lev(f),liquid=s.stage?(s.stage===2&&pptA>0?`rgba(196,160,118,${fmt(.25+.45*pptA*(1-pptFall*.6),2)})`:coat>0?`rgba(150,158,164,${fmt(.35+coat*.4,2)})`:'rgba(214,232,238,.75)'):'none';
  let g=`<ellipse cx="${cx}" cy="${BOT+6}" rx="34" ry="5" fill="#6d8896" opacity=".15"/>`;
  let inner='';
  if(s.stage)inner+=`<path d="M${cx-24} ${fmt(surf,1)}H${cx+24}V${BOT-14}Q${cx+24} ${BOT-4} ${cx+14} ${BOT-4}H${cx-14}Q${cx-24} ${BOT-4} ${cx-24} ${BOT-14}Z" fill="${liquid}"/><line x1="${cx-24}" y1="${fmt(surf,1)}" x2="${cx+24}" y2="${fmt(surf,1)}" stroke="#7fa4b3" stroke-width="1.2"/>`;
  if(pptA>0)for(const q of svGrains){const yTop=surf+8+q.y,yBot=BOT-9-q.y*.35,y=lerp(yTop,yBot,Math.min(1,pptFall*(1.15-q.d*.3)));inner+=`<circle cx="${cx+q.x*.9}" cy="${fmt(y,1)}" r="${fmt(q.r*(dissolve?1-dissolve*.8:1),2)}" fill="#7a4f2a" opacity="${fmt(pptA,2)}"/>`;}
  if(coat>0)inner+=`<path d="M${cx-24} ${fmt(surf-26,1)}V${BOT-14}Q${cx-24} ${BOT-4} ${cx-14} ${BOT-4}H${cx+14}Q${cx+24} ${BOT-4} ${cx+24} ${BOT-14}V${fmt(surf-26,1)}H${cx+18}V${BOT-14}Q${cx+18} ${BOT-10} ${cx+12} ${BOT-10}H${cx-12}Q${cx-18} ${BOT-10} ${cx-18} ${BOT-14}V${fmt(surf-26,1)}Z" fill="url(#silverWall)" opacity="${fmt(Math.min(1,coat*1.1),2)}"/>`;
  g+=`<g transform="rotate(${fmt(tilt,2)} ${cx} ${BOT})">${inner}<path d="M${cx-26} ${TOP}V${BOT-14}Q${cx-26} ${BOT} ${cx-12} ${BOT}H${cx+12}Q${cx+26} ${BOT} ${cx+26} ${BOT-14}V${TOP}" fill="url(#silverGlass)" stroke="#5f7f90" stroke-width="2"/><rect x="${cx-22}" y="${TOP-10}" width="44" height="12" rx="2" fill="#e3eef2" stroke="#5f7f90" stroke-width="1.5"/><path d="M${cx-19} ${TOP+12}V${BOT-22}" stroke="#ffffff" stroke-width="4" opacity=".75"/></g>`;
  g+=pipette+drops;
  if(anim&&anim.kind==='sv-add')g+=text(cx+16,TOP-88,SV_REAGENT[anim.action]||'');
  g+=text(cx,BOT+30,glucose?'포도당':'물(대조군)',`text-anchor="middle" style="font-weight:${active?800:400}"`);
  if(active)g+=`<path d="M${cx-8} ${BOT+42}h16l-8 9z" fill="#2c7a8a"/>`;
  return {g,label:pptA>.6&&!dissolve?'ppt':coat>.2?'mirror':''};
 }
 function silverMirror(){
  const s=state.silver,brown=s.stage===2,coating=s.sample==='glucose'?s.turns:0,other=s.sample==='glucose'?'water':'glucose';
  const os=state.silverSaved?.[other]||M.silverStart(other),anim=fx&&fx.kind.startsWith('sv-')?fx:null;
  const L=270-70,R=270+70,positions={glucose:L,water:R};
  const a=vial(positions[s.sample],s,true,anim),b=vial(positions[other],os,false,null);
  let body=`<defs><linearGradient id="silverWall"><stop stop-color="#55636c"/><stop offset=".28" stop-color="#f7fafb"/><stop offset=".5" stop-color="#808f99"/><stop offset=".75" stop-color="#e6ecef"/><stop offset="1" stop-color="#5e6c75"/></linearGradient><linearGradient id="silverGlass"><stop stop-color="#bcd0da" stop-opacity=".5"/><stop offset=".25" stop-color="#f4fafc" stop-opacity=".35"/><stop offset=".8" stop-color="#e3eff3" stop-opacity=".3"/><stop offset="1" stop-color="#a6c1cd" stop-opacity=".55"/></linearGradient></defs><rect x="120" y="296" width="300" height="10" rx="3" fill="#d8cdbb"/>`;
  body+=b.g+a.g;
  for(const [v,x] of [[a,positions[s.sample]],[b,positions[other]]]){const left=x<270,d=left?-1:1,wx=x+d*28,anchor=left?'end':'start';
   if(v.label==='ppt')body+=line(wx,280,wx+d*24,280,'#7a4f2a','stroke-width="1.5"')+text(wx+d*28,285,'갈색 앙금',`text-anchor="${anchor}"`);
   if(v.label==='mirror')body+=line(wx,214,wx+d*24,214,'#56656e','stroke-width="1.5"')+text(wx+d*28,219,'은거울',`text-anchor="${anchor}"`);}
  window.scienceScene.render(scene,fig(`<g transform="translate(-80 0)">${body}</g>`,'포도당 바이알과 물 대조군 바이알: 시약 첨가와 벽의 은 석출',380,350,'ix-silver'));
  metrics([['시료',s.sample==='glucose'?'포도당':'물'],['준비 단계',Math.min(5,s.stage)+' / 5'],['관찰',coating?'은거울 형성':brown?'앙금 생성':'은거울 없음']]);
  window.scienceScene.render(extra,s.turns&&s.sample==='glucose'?'<p class="reaction-line">R–CHO → R–COO⁻ <b>산화</b><br>Ag⁺ + e⁻ → Ag <b>환원</b></p><p class="model-note">포도당은 열린 사슬 형태의 알데하이드 부분을 통해 반응합니다. 카복실산염 표기는 반응 용액이 염기성인 조건을 반영합니다.</p>':'');
  status.textContent=s.message;
 }
 // Nylon rope: a glass rod held in a clamp on a stand, turned by a small crank. The film is pinched
 // at the interface, rises as a rope through the upper layer and winds onto the rod.
 function atom(x,y,sym,fill,r=10,stroke='#33434c'){return `<circle cx="${fmt(x,1)}" cy="${fmt(y,1)}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>`+text(fmt(x,1),fmt(y+4.5,1),sym,'text-anchor="middle" class="atom-label"');}
 function nylonChain(){
  const units=state.chain;if(!units.length)return '<p class="chain-empty">단위체를 하나씩 연결해 보세요.</p>';
  const kl=fxk('link'),W={amine:80,chloride:60},GAP=34,rowY=[64,158],pos=[];
  let x=52;units.forEach((u,i)=>{const row=i<4?0:1,w=W[u];if(i===4)x=pos[3].x1;if(row===0){pos.push({u,row,x0:x,x1:x+w,dir:1});x+=w+GAP;}else{pos.push({u,row,x0:x-w,x1:x,dir:-1});x-=w+GAP;}});
  const last=units.length-1;let body='',bonds='',hcl='';
  const endAt=(p,side)=>side==='start'?(p.dir>0?p.x0:p.x1):(p.dir>0?p.x1:p.x0);
  pos.forEach((p,i)=>{const y=rowY[p.row],slide=i===last&&kl!==null&&last>0?(1-seg(kl,0,.45))*40*p.dir:0,X0=p.x0+slide,X1=p.x1+slide,n=p.u==='amine'?6:4,step=(X1-X0)/(n+1);
   let zz=`M${X0} ${y}`;for(let j=1;j<=n;j++)zz+=`L${fmt(X0+j*step,1)} ${y+(j%2?-8:8)}`;zz+=`L${X1} ${y}`;
   body+=`<path d="${zz}" fill="none" stroke="#4b5a63" stroke-width="2.5" stroke-linejoin="round"/>`;
   for(let j=1;j<=n;j++)body+=`<circle cx="${fmt(X0+j*step,1)}" cy="${y+(j%2?-8:8)}" r="3" fill="#4b5a63"/>`;
   if(p.u==='amine')body+=atom(X0,y,'N','#bcd3f5')+atom(X1,y,'N','#bcd3f5');
   else for(const cx of [X0,X1])body+=line(cx-2.5,y,cx-2.5,y-24,'#4b5a63','stroke-width="2"')+line(cx+2.5,y,cx+2.5,y-24,'#4b5a63','stroke-width="2"')+atom(cx,y-26,'O','#f6c0b8')+atom(cx,y,'C','#dfe4e7');
   // free ends keep their H (amine) or Cl (acid chloride)
   const ends=[];if(i===0)ends.push('start');if(i===last)ends.push('end');
   for(const side of ends){const ex=endAt({...p,x0:X0,x1:X1},side),out=(side==='start'?-1:1)*p.dir,ax=ex+out*24;body+=line(ex+out*9,y,ax-out*9,y,'#4b5a63','stroke-width="2.5"')+(p.u==='amine'?atom(ax,y,'H','#ffffff',9):atom(ax,y,'Cl','#bfe3b5',12));}
  });
  for(let i=1;i<=last;i++){const a=pos[i-1],b=pos[i],y1=rowY[a.row],y2=rowY[b.row],fresh=i===last&&kl!==null,o=fresh?seg(kl,.35,.6):1;
   const ax=endAt(a,'end'),bx=endAt(b,'start')+(fresh?(1-seg(kl,0,.45))*40*b.dir:0);
   bonds+=`<g opacity="${fmt(o,2)}">${a.row===b.row?`<rect x="${fmt(Math.min(ax,bx)-2,1)}" y="${y1-9}" width="${fmt(Math.abs(bx-ax)+4,1)}" height="18" rx="9" fill="#ffe08a"/>`:`<rect x="${ax-9}" y="${y1-2}" width="18" height="${y2-y1+4}" rx="9" fill="#ffe08a"/>`}${line(ax,y1,bx,y2,'#4b5a63','stroke-width="2.5"')}</g>`;
   if(fresh){const q=seg(kl,.4,1),mx=(ax+bx)/2,my=(y1+y2)/2-q*48;hcl+=`<g opacity="${fmt(1-seg(kl,.75,1),2)}">${atom(mx-11,my-14,'H','#ffffff',9)}${atom(mx+11,my-14,'Cl','#bfe3b5',12)}</g>`;}
  }
  const h=last>=4?212:112;
  const label=last>=1?text((endAt(pos[0],'end')+endAt(pos[1],'start'))/2,rowY[0]+34,'–CO–NH–','text-anchor="middle"'):'';
  return fig(`<rect x="0" y="0" width="540" height="${h}" fill="#fbfdfd"/>`+bonds+body+label+hcl,'단위체가 아마이드 결합으로 이어진 사슬',540,h,'ix-chain');
 }
 function nylon(){
  const s=state.nylon,r=M.condensation(state.chain),speed=val('pullSpeed');
  const kL=fxk('ny-layer'),kP=fxk('ny-pull'),kB=fxk('ny-break'),kW=fxk('ny-wait');
  const BX0=170,BX1=370,TOP=118,BOT=300,IF=218,SURF=150,ROD=72,RX=272;
  let body=`<defs><linearGradient id="nylonGlass"><stop stop-color="#c1d8e2" stop-opacity=".55"/><stop offset=".3" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#adcbd8" stop-opacity=".5"/></linearGradient><linearGradient id="nylonRod" x2="0" y2="1"><stop stop-color="#f4fbfd"/><stop offset=".5" stop-color="#c7dde5"/><stop offset="1" stop-color="#93b3c0"/></linearGradient></defs>`;
  // stand, boss head and clamp holding the glass rod
  body+=`<rect x="36" y="306" width="150" height="14" rx="3" fill="#5d6c75"/><rect x="66" y="34" width="8" height="274" fill="url(#science-material-steel)" stroke="#5d6c75"/><rect x="60" y="${ROD-10}" width="22" height="20" rx="3" fill="#47555d"/><rect x="82" y="${ROD-4}" width="116" height="8" fill="url(#science-material-steel)" stroke="#5d6c75"/><rect x="194" y="${ROD-11}" width="16" height="22" rx="3" fill="#47555d"/>`;
  // beaker
  body+=`<ellipse cx="270" cy="${BOT+6}" rx="112" ry="7" fill="#5c7f90" opacity=".12"/>`;
  let lowerTop=IF,upperTop=SURF;
  if(kL!==null){lowerTop=lerp(BOT-6,IF,seg(kL,0,.48));upperTop=lerp(IF,SURF,seg(kL,.52,1));}
  if(s.layers){
   body+=`<path d="M${BX0+3} ${fmt(lowerTop,1)}H${BX1-3}V${BOT-14}Q${BX1-3} ${BOT-3} ${BX1-14} ${BOT-3}H${BX0+14}Q${BX0+3} ${BOT-3} ${BX0+3} ${BOT-14}Z" fill="#e8dfc0"/>`;
   if(kL===null||kL>.52)body+=`<rect x="${BX0+3}" y="${fmt(upperTop,1)}" width="${BX1-BX0-6}" height="${fmt(IF-upperTop,1)}" fill="#cfe9f1"/>`+line(BX0+3,upperTop,BX1-3,upperTop,'#86b3c3','stroke-width="1.5"');
   let film=kW!==null?lerp(.15,1,kW):kB!==null?lerp(1,.15,seg(kB,.35,.5)):s.film||.15;
   if(kL!==null)film=seg(kL,.7,1);
   if(film>0&&(kL===null||kL>.52))body+=`<rect x="${BX0+3}" y="${fmt(IF-1-film*2,1)}" width="${BX1-BX0-6}" height="${fmt(2+film*4,1)}" fill="#f3ead2" stroke="#b49a63" stroke-width="1"/>`;
  }
  // rod with crank and the wound nylon
  const turning=kP!==null?kP:kB!==null&&kB<.42?kB/.42:null,ang=(turning??0)*Math.PI*8;
  const wound=Math.min(14,(s.pulled-(kP!==null?1-kP:0))*3.2),spoolR=6+Math.max(0,wound);
  body+=`<rect x="208" y="${ROD-6}" width="150" height="12" rx="6" fill="url(#nylonRod)" stroke="#6f93a2"/>`;
  if(s.pulled>0||kP!==null)body+=`<rect x="${RX-18}" y="${fmt(ROD-spoolR,1)}" width="36" height="${fmt(spoolR*2,1)}" rx="5" fill="#f1e6c8" stroke="#a88d55"/>`+Array.from({length:5},(_,i)=>{const xx=RX-15+((i*8+ang*6)%36+36)%36*.85;return line(fmt(xx,1),ROD-spoolR+2,fmt(xx+5,1),ROD+spoolR-2,'#c2a874','stroke-width="1.2"');}).join('');
  const hx=364+10*Math.cos(ang),hy=ROD+10*Math.sin(ang);
  body+=`<circle cx="364" cy="${ROD}" r="12" fill="#d6e2e7" stroke="#5d6c75" stroke-width="2"/><line x1="364" y1="${ROD}" x2="${fmt(hx,1)}" y2="${fmt(hy,1)}" stroke="#5d6c75" stroke-width="3"/><circle cx="${fmt(hx,1)}" cy="${fmt(hy,1)}" r="5" fill="#8b5a3c"/>`;
  // the rope: pinched film (tent) at the interface, rope rising to the spool; dashes move upward while winding
  const ropeW=speed==='slow'?7:speed==='fast'?3:5,flow=(turning??0)*220;
  const rope=(y1,y2)=>`<line x1="${RX}" y1="${fmt(y1,1)}" x2="${RX}" y2="${fmt(y2,1)}" stroke="#9c834c" stroke-width="${ropeW+2}" stroke-linecap="round"/><line x1="${RX}" y1="${fmt(y1,1)}" x2="${RX}" y2="${fmt(y2,1)}" stroke="#f1e5c4" stroke-width="${ropeW}" stroke-linecap="round"/><line x1="${RX}" y1="${fmt(y1,1)}" x2="${RX}" y2="${fmt(y2,1)}" stroke="#c2a66a" stroke-width="${Math.max(1,ropeW-3)}" stroke-dasharray="3 6" stroke-dashoffset="${fmt(flow,1)}" opacity=".8"/>`;
  const tent=`<path d="M${RX-34} ${IF}Q${RX-6} ${IF-2} ${RX-3} ${IF-14}H${RX+3}Q${RX+6} ${IF-2} ${RX+34} ${IF}Z" fill="#f3ead2" stroke="#b49a63" stroke-width="1"/>`;
  if(s.layers&&kL===null){
   if(kB!==null){if(kB<.42)body+=tent+rope(IF-12,ROD+spoolR);else{const fall=seg(kB,.42,.8),swing=Math.sin(kB*18)*(1-kB)*10;body+=rope(IF-12,lerp(IF-60,IF-12,fall))+`<path d="M${RX} ${ROD+spoolR}q${fmt(swing,1)} 24 ${fmt(swing*.6,1)} 44" fill="none" stroke="#9c834c" stroke-width="${ropeW+2}" stroke-linecap="round"/><path d="M${RX} ${ROD+spoolR}q${fmt(swing,1)} 24 ${fmt(swing*.6,1)} 44" fill="none" stroke="#f1e5c4" stroke-width="${ropeW}" stroke-linecap="round"/>`;}}
   else if(kP!==null&&fx.first)body+=tent+rope(IF-12,lerp(IF-14,ROD+spoolR,seg(kP,0,.3)));
   else if(state.nyStub&&!state.nyRope)body+=`<path d="M${RX} ${ROD+spoolR}q2 24 1 44" fill="none" stroke="#9c834c" stroke-width="${ropeW+2}" stroke-linecap="round"/><path d="M${RX} ${ROD+spoolR}q2 24 1 44" fill="none" stroke="#f1e5c4" stroke-width="${ropeW}" stroke-linecap="round"/>`;
   else if(state.nyRope||kP!==null)body+=tent+rope(IF-12,ROD+spoolR);
  }
  body+=`<path d="M${BX0} ${TOP}V${BOT-14}Q${BX0} ${BOT} ${BX0+14} ${BOT}H${BX1-14}Q${BX1} ${BOT} ${BX1} ${BOT-14}V${TOP}" fill="url(#nylonGlass)" stroke="#5f8394" stroke-width="2"/><path d="M${BX0-6} ${TOP-4}Q${BX0} ${TOP} ${BX0} ${TOP+6}M${BX1+6} ${TOP-4}Q${BX1} ${TOP} ${BX1} ${TOP+6}" fill="none" stroke="#5f8394" stroke-width="2"/><path d="M${BX0+9} ${TOP+14}V${BOT-22}" stroke="#fff" stroke-width="4" opacity=".6"/>`;
  for(let k=0;k<5;k++)body+=line(BX1-18,TOP+30+k*30,BX1-6,TOP+30+k*30,'#7f9dab','stroke-width="1.2"');
  if(s.layers&&kL===null){body+=line(BX1+2,(SURF+IF)/2,BX1+22,(SURF+IF)/2,'#6c8490','stroke-width="1"')+text(BX1+26,(SURF+IF)/2+5,'다이아민 수용액')+line(BX1+2,IF,BX1+22,IF,'#8a6d36','stroke-width="1"')+text(BX1+26,IF+5,'나일론 막')+line(BX1+2,(IF+BOT)/2,BX1+22,(IF+BOT)/2,'#6c8490','stroke-width="1"')+text(BX1+26,(IF+BOT)/2+5,'산 염화물 용액');}
  body+=text(214,ROD-20,'감는 유리 막대')+text(364,ROD+34,'손잡이','text-anchor="middle"');
  window.scienceScene.render(scene,fig(body,'두 층의 경계에서 생기는 막과 감아 올리는 나일론',540,330));
  window.scienceScene.render(extra,nylonChain()+`<p>연결: –CO–NH– 아마이드 결합 · 빠져나온 작은 분자: HCl</p>`);
  metrics([['연결한 단위체',r.units+'개'],['아마이드 결합',r.bonds+'개'],['생성 HCl',r.hcl+'개']]);status.textContent=state.message||s.message;
 }
 function draw(){labels();({'insulation-lab':insulation,'doppler-lab':doppler,'ride-acceleration':acceleration,'dna-replication':dna,'protein-synthesis':protein,'pedigree-lab':pedigree,'karyotype-lab':karyotype,'antibiotic-disc':antibiotic,'water-wave-tank':waterWaves,'silver-mirror':silverMirror,'nylon-interface':nylon}[slug])();}
 function reset(){stop();for(const el of host.querySelectorAll('.control-panel input'))el.value=el.defaultValue;for(const el of host.querySelectorAll('.control-panel select'))el.selectedIndex=0;
  state={dna:M.dnaStart(),steps:0,transcribed:false,answers:{},karyo:M.karyotypeStart(),selected:null,time:0,message:'',silver:M.silverStart(),silverSaved:{},nylon:M.nylonStart(),nyRope:false,nyStub:false,chain:[]};window.scienceScene.render(extra,'');window.scienceScene.render(readout,'');status.textContent='';draw();if(slug==='doppler-lab')animate('doppler',DOP.T*1000);}
 if(slug==='protein-synthesis'){$('amino').innerHTML=Object.entries(M.aaNames).map(([a,name])=>`<option value="${a}">${a==='*'?'방출 인자 (종결)':name}</option>`).join('');$('codonTable').innerHTML=Object.entries(M.codons).map(([codon,a])=>`<span><b>${codon}</b> ${M.aaNames[a]}</span>`).join('');}
 host.querySelectorAll('.control-panel input,.control-panel select').forEach(el=>el.addEventListener(el.type==='range'?'input':'change',()=>{
  if(slug==='protein-synthesis'&&el.id==='sequence'){state.steps=0;state.transcribed=false;state.message='';}
  if(slug==='karyotype-lab'&&el.id==='sample'){state.karyo=M.karyotypeStart(el.value);state.selected=null;status.textContent='새 시료의 염색체를 배열하세요.';}
  if(slug==='antibiotic-disc'){state.message='';if(['sampleSet','dose','spacing'].includes(el.id))state.time=0;}
  if(slug==='ride-acceleration'&&el.id!=='time'){stop();$('time').value=0;}
  if(slug==='silver-mirror'&&el.id==='sample'){cancelFx();state.silverSaved[state.silver.sample]=state.silver;state.silver=M.silverStart(el.value);}
  if(slug==='water-wave-tank'&&el.id!=='time'){stop();$('time').value=0;}
  draw();
 }));
 if($('step'))$('step').onclick=()=>{const el=$('time');el.value=Math.min(Number(el.max),Number(el.value)+(slug==='ride-acceleration'?.5:1));draw();};
 if($('play'))$('play').onclick=()=>playTime(12,'play','일시 정지');
 if(slug==='dna-replication'){
  for(const [id,action]of [['openFork','open'],['primer','prime'],['replace','replace'],['join','join']])$(id).onclick=()=>{state.dna=M.dnaAction(state.dna,action);draw();};
  host.querySelectorAll('[data-base]').forEach(b=>b.onclick=()=>{state.dna=M.dnaAction(state.dna,val('strand'),b.dataset.base);draw();});
 }
 if(slug==='protein-synthesis'){
  $('transcribe').onclick=()=>{state.transcribed=true;state.message='';animate('transcribe',2600);};
  $('attach').onclick=()=>{const all=M.translate(sequences[val('sequence')],Infinity,{cellFree:val('sequence').startsWith('poly')}),next=all.reads[state.steps];if(!next||!state.transcribed)return;
   const anti=M.complement(next.codon.replaceAll('U','T')).replaceAll('T','U');
   if(next.amino!=='*'&&[0,1,2].map(i=>val('anti'+i)).join('')!==anti){state.message='코돈과 안티코돈이 상보적으로 짝지어지지 않았습니다. 두 방향과 A–U, G–C 짝을 확인하세요.';draw();return;}
   if(val('amino')!==next.amino){state.message='현재 코돈과 선택한 운반체가 맞지 않습니다. 유전부호 표에서 코돈 전체를 확인하세요.';draw();return;}
   state.steps++;state.message=next.amino==='*'?'방출 인자가 결합해 번역이 끝났습니다. 종결코돈은 아미노산을 더하지 않습니다.':next.name+'을 연결했습니다. 리보솜은 5′→3′으로 한 코돈 이동합니다.';animate('attach',1500);};
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
  $('stepWave').onclick=()=>{if(timer)stop();const from=num('time'),to=Math.min(60,from+.5);$('time').step='.001';$('time').value=to;animate('wstep',500,{from,to});};
  $('playWave').onclick=()=>playTime(60,'playWave','정지해 관찰');
 }
 if(slug==='silver-mirror')for(const [id,action]of [['silverReagent','silver'],['ammoniaReagent','ammonia'],['testSample','sample'],['baseReagent','base'],['rollVial','roll']])$(id).onclick=()=>{const before=state.silver;state.silver=M.silverAction(before,action);if(state.silver.turns!==before.turns)animate('sv-roll',2200,{action});else if(state.silver.stage!==before.stage)animate('sv-add',1700,{action});else draw();};
 if(slug==='nylon-interface'){
  for(const [id,action]of [['makeLayers','layer'],['pullNylon','pull'],['waitFilm','wait']])$(id).onclick=()=>{state.message='';const before=state.nylon;state.nylon=M.nylonAction(before,action,val('pullSpeed'));const now=state.nylon;
   if(action==='layer'&&!before.layers)animate('ny-layer',1800);
   else if(action==='pull'&&now.broken&&!before.broken){state.nyRope=false;state.nyStub=true;animate('ny-break',2200);}
   else if(action==='pull'&&now.pulled>before.pulled){const first=!state.nyRope;state.nyRope=true;state.nyStub=false;animate('ny-pull',2600,{first});}
   else if(action==='wait'&&before.layers){state.nyStub=false;animate('ny-wait',1300);}
   else draw();};
  for(const [id,unit]of [['addAmine','amine'],['addChloride','chloride']])$(id).onclick=()=>{if(state.chain.length>=8){state.message='이 모형의 사슬은 8개 단위체까지 비교합니다.';}else if(state.chain.at(-1)===unit){state.message='같은 작용기끼리는 이 반응으로 연결되지 않습니다. 사슬 끝과 반응할 다른 단위체를 고르세요.';}else{state.chain.push(unit);state.message=state.chain.length===1?'첫 단위체입니다. 아직 단위체 사이 결합은 없습니다.':'사슬이 한 단위체만큼 늘고 HCl 하나가 생성되었습니다.';if(state.chain.length>1){animate('link',1500);return;}}draw();};
  $('clearChain').onclick=()=>{state.chain=[];state.message='';draw();};
 }
 if(slug==='doppler-lab'){$('playDoppler').onclick=()=>animate('doppler',DOP.T*1000);$('direction').addEventListener('change',()=>animate('doppler',DOP.T*1000));}
 $('resetExperiment').onclick=reset;window.addEventListener('pagehide',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 // Read-only snapshots support verification without exposing a state mutation API.
 window.__inquiryLab={snapshot:()=>JSON.parse(JSON.stringify({slug,state,running:!!timer,animating:!!fxId}))};reset();
})();
