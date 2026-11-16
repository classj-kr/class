document.addEventListener('DOMContentLoaded',()=>{
 'use strict';
 const M=window.DivisionModel,$=id=>document.getElementById(id),svg=$('cdScene'),graph=$('cdGraph');
 let kind='mitosis',twoN=4,index=0,orientation=1,crossover=false,playing=false,timer=0,animFrame=0;const chromState=new Map();
 const list=()=>kind==='mitosis'?M.MITOSIS:M.MEIOSIS,analyse=(k=kind,n=twoN,i=index)=>M.analyse(k,n,i,orientation,crossover);
 const fmt=x=>Number.isInteger(x)?String(x):x.toFixed(1),colours=['#b33e55','#216ea0'],ns='http://www.w3.org/2000/svg';
 function stop(){playing=false;clearTimeout(timer);$('cdPlay').textContent='자동 관찰';$('cdPlay').setAttribute('aria-pressed','false');}
 function geometry(a){
 const width=Math.max(260,Math.round(svg.clientWidth)),n=a.s.cells,stack=width<550;let height,centres,radius;
 if(n===1){height=360;centres=[[width/2,180]];radius=[Math.min(width/2-18,285),154];}
 else if(n===2){height=stack?600:340;centres=stack?[[width/2,150],[width/2,450]]:[[width*.25,170],[width*.75,170]];radius=[Math.min(stack?width*.43:width*.23,180),132];}
 else{height=stack?620:500;centres=[[width*.25,height*.25],[width*.25,height*.75],[width*.75,height*.25],[width*.75,height*.75]];radius=[Math.min(width*.22,160),stack?125:105];}
 return{width,height,centres,radius};
 }
 function drawScene(a,instant){
 const g=geometry(a),[rx,ry]=g.radius,{width,height,centres}=g,lay=a.s.lay;
 svg.setAttribute('viewBox',`0 0 ${width} ${height}`);svg.style.height=height+'px';svg.setAttribute('aria-label',`${kind==='mitosis'?'체세포 분열':'감수 분열'} ${a.s.name}. ${a.s.cells}개 세포, 세포 하나의 염색체 ${a.chromPer}개.`);
 const polar=/poles|telophase|Poles|Telophase/.test(lay),tel=/telophase|Telophase/.test(lay),inter=lay==='interphase';let shells='',threads='';
 centres.forEach(([cx,cy],cell)=>{
 shells+=`<ellipse class="cd-membrane" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>`;
 if(inter||lay==='daughter'||lay==='four')shells+=`<ellipse class="cd-nucleus" cx="${cx}" cy="${cy}" rx="${rx*.82}" ry="${ry*.78}"/>`;
 if(tel){for(const side of [-1,1])shells+=`<ellipse class="cd-nucleus" cx="${cx+side*rx*.46}" cy="${cy}" rx="${rx*.34}" ry="${ry*.8}"/>`;shells+=`<path class="cd-furrow" d="M${cx},${cy-ry} Q${cx-12},${cy-ry*.5} ${cx},${cy-ry*.45} M${cx},${cy+ry} Q${cx+12},${cy+ry*.5} ${cx},${cy+ry*.45}"/>`;}
 if(a.s.cells>1)shells+=`<text x="${cx}" y="${cy-ry+21}" text-anchor="middle" class="cd-cell-label">세포 ${cell+1}</text>`;
 if(!inter&&!tel&&!['daughter','four'].includes(lay))threads+=`<circle class="cd-pole" cx="${cx-rx*.9}" cy="${cy}" r="4"/><circle class="cd-pole" cx="${cx+rx*.9}" cy="${cy}" r="4"/>`;
 if(['equator','equatorPairs','secondEquator'].includes(lay))threads+=`<path class="cd-equator" d="M${cx},${cy-ry*.82} V${cy+ry*.82}"/>`;
 });
 const container=$('cdChromosomes'),active=new Set(),targets=[],spindles=[];
 const size=p=>[1,.74,.56,.44][p]||.4;
 // 크기가 다른 염색체를 겹치지 않게 위아래로 쌓는다(가운데 기준).
 const stackY=(cy,lens,gap)=>{const total=lens.reduce((s,l)=>s+2*l,0)+gap*(lens.length-1);let y=cy-total/2;return lens.map(l=>{const c=y+l;y+=2*l+gap;return c;});};
 const all=M.chromatids(a),separated=a.k==='mitosis'?a.i>=5:a.i>=9;
 for(const c of all){
 active.add(c.id);let el=container.querySelector(`[data-copy="${c.id}"]`);
 if(!el){el=document.createElementNS(ns,'g');el.classList.add('cd-chromatid');el.dataset.copy=c.id;container.append(el);
 // 복제로 새로 생긴 염색 분체는 짝(0번 사본) 자리에서 갈라져 나온다.
 const twin=chromState.get(c.id.replace(/-1$/,'-0'));if(twin)chromState.set(c.id,{...twin});}
 const [cx,cy]=centres[c.cell],pairs=a.pairs,f=size(c.pair);let x=cx,y=cy,length=30*f,coil=0,bend=0;
 const offset=separated||a.i===0?0:(c.copy===0?-1:1);
 if(a.s.cells===1){
 if(inter||lay==='condense'){
 // 풀어진 염색사는 핵 안에 가로로 흩어져 있다: 모계 1·2…번, 부계 1·2…번.
 const slot=c.origin*pairs+c.pair,span=rx*1.25,step=span/twoN;x=cx-span/2+step*(slot+.5);
 y=cy+[-14,12,-6,16,-12,8,-16,10][slot%8];length=(inter?Math.min(46,ry*.36):Math.min(34,ry*.27))*f;coil=inter?1:.45;
 }else if(['pairs','equatorPairs'].includes(lay)){
 const lens=Array.from({length:pairs},(_,p)=>(twoN===8?16:twoN===6?20:27)*size(p));x=cx+(c.side?1:-1)*(lay==='pairs'?13:Math.min(24,rx*.2));y=stackY(cy,lens,twoN===8?12:16)[c.pair];length=lens[c.pair];
 }else if(lay==='equator'){
 const order=[];for(let p=0;p<pairs;p++)for(let o=0;o<2;o++)order.push([p,o]);const lens=order.map(([p])=>(twoN===8?13:twoN===6?16:20)*size(p));
 x=cx;y=stackY(cy,lens,twoN===8?7:10)[c.pair*2+c.origin];length=lens[c.pair*2+c.origin];
 }else if(polar){
 const side=a.k==='mitosis'?c.copy:c.side;x=cx+(side?1:-1)*rx*.46;
 if(a.k==='mitosis'){const order=[];for(let p=0;p<pairs;p++)for(let o=0;o<2;o++)order.push(p);const lens=order.map(p=>(twoN===8?13:twoN===6?16:20)*size(p));y=stackY(cy,lens,twoN===8?9:16)[c.pair*2+c.origin];length=lens[c.pair*2+c.origin];}
 else{const lens=Array.from({length:pairs},(_,p)=>(twoN===8?16:twoN===6?20:26)*size(p));y=stackY(cy,lens,16)[c.pair];length=lens[c.pair];}
 if(tel){
 // 말기: 양극에 모인 염색체가 새 핵 안에서 다시 풀린다.
 const n=a.k==='mitosis'?twoN:pairs,slot=a.k==='mitosis'?c.origin*pairs+c.pair:c.pair,w=rx*.5,step=w/n;
 x=x-w/2+step*(slot+.5);y=cy+[-12,10,-5,13,-10,6,-13,8][slot%8];length=Math.min(30,ry*.42)*f;coil=.85;
 }else bend=(side?-1:1)*2.6;
 }
 }else if(a.s.cells===2){
 if(kind==='mitosis'){const slot=c.origin*pairs+c.pair,span=rx*1.2,step=span/twoN;x=cx-span/2+step*(slot+.5);y=cy+[-10,9,-5,12,-9,6,-12,8][slot%8];length=Math.min(34,ry*.27)*f;coil=1;}
 else{const lens=Array.from({length:pairs},(_,p)=>(twoN===8?13:twoN===6?16:21)*size(p));x=cx+(polar?(c.copy?1:-1)*rx*.46:0);y=stackY(cy,lens,10)[c.pair];length=lens[c.pair];if(/Telophase/.test(lay))coil=.55;}
 }else{const w=rx*1.05,step=w/pairs;x=cx-w/2+step*(c.pair+.5);y=cy+8+[-8,7,-4,9][c.pair%4];length=Math.min(28,ry*.3)*size(c.pair);coil=1;}
 const tx=x+offset*(coil?4:4.5),ty=y;
 el.dataset.cell=String(c.cell);el.dataset.chromosome=c.chromosome;el.dataset.pair=String(c.pair);el.dataset.origin=String(c.origin);el.dataset.distal=String(c.distal);
 targets.push({el,c,state:{x:tx,y:ty,L:length,coil,side:offset,bend}});
 if(!inter&&!tel&&!['daughter','four'].includes(lay)){const sides=polar?[a.k==='mitosis'||a.i>=9?c.copy:c.side]:a.k==='meiosis'&&a.i<=6?[c.side]:[c.copy];for(const side of sides)spindles.push({id:c.id,pole:side,px:cx+(side?1:-1)*rx*.9,py:cy});}
 }
 for(const el of [...container.children])if(!active.has(el.dataset.copy)){chromState.delete(el.dataset.copy);el.remove();}
 const shellG=$('cdShells');if(!instant&&shellG.dataset.cells&&shellG.dataset.cells!==String(a.s.cells)){shellG.classList.remove('cd-split');void shellG.getBBox();shellG.classList.add('cd-split');}shellG.dataset.cells=String(a.s.cells);shellG.innerHTML=shells;$('cdPoles').innerHTML=threads;
 animateTo(targets,spindles,instant);
 }
 // 염색 분체 하나의 모양: coil 1이면 실처럼 꼬불꼬불 풀린 염색사, 0이면 굵게 응축된 막대.
 function strandPath(L,coil,side,bend){
 const n=34,turns=Math.max(1.6,L/13);let d='';
 for(let k=0;k<=n;k++){const t=k/n,y=-L+2*L*t,u=y/L,x=coil*5.5*Math.sin(t*Math.PI*2*turns)+(1-coil)*(side*4+bend*4)*u*u+coil*side*1.5;d+=(k?'L':'M')+x.toFixed(2)+','+y.toFixed(2);}
 return d;
 }
 function paint(el,c,s){
 el.style.transform=`translate(${s.x}px, ${s.y}px)`;
 const d=strandPath(s.L,s.coil,s.side,s.bend||0),w=(3.3+(1-s.coil)*2.9).toFixed(2),style=`stroke-width:${w}px`;
 el.innerHTML=`${Math.abs(s.side)>.5&&c.copy===0&&s.coil<.5?`<path d="M0,0 H${(8*Math.abs(s.side)).toFixed(1)}" stroke="#506068" stroke-width="3"/>`:''}<path class="cd-strand" d="${d}" stroke="${colours[c.origin]}" style="${style}"/>${c.exchanged?`<defs><clipPath id="cdExchange-${c.id}"><rect x="-20" y="${(s.L*.4).toFixed(1)}" width="40" height="${s.L.toFixed(1)}"/></clipPath></defs><path class="cd-strand" d="${d}" stroke="${colours[c.distal]}" style="${style}" clip-path="url(#cdExchange-${c.id})"/>`:''}<circle class="cd-centromere" r="${(2+(1-s.coil)*1.2).toFixed(2)}"/>`;
 }
 function paintThreads(spindles,alpha){
 $('cdThreads').innerHTML=spindles.map(t=>{const s=chromState.get(t.id);return `<path class="cd-spindle" data-target="${t.id}" data-pole="${t.pole}" style="opacity:${alpha.toFixed(2)}" d="M${t.px.toFixed(1)},${t.py.toFixed(1)} Q${((t.px+s.x)/2).toFixed(1)},${s.y.toFixed(1)} ${s.x.toFixed(1)},${s.y.toFixed(1)}"/>`;}).join('');
 }
 function animateTo(targets,spindles,instant){
 cancelAnimationFrame(animFrame);
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,from=new Map();
 for(const t of targets)from.set(t.c.id,chromState.get(t.c.id)||t.state);
 const finish=()=>{for(const t of targets){chromState.set(t.c.id,t.state);paint(t.el,t.c,t.state);}paintThreads(spindles,1);};
 if(instant||reduce)return finish();
 const hadThreads=$('cdThreads').childElementCount>0,start=performance.now(),dur=850;
 const step=now=>{const k=Math.min(1,(now-start)/dur),e=(1-Math.cos(Math.PI*k))/2;
 for(const t of targets){const a0=from.get(t.c.id),b=t.state,s={};for(const key of ['x','y','L','coil','side','bend'])s[key]=(a0[key]??0)+((b[key]??0)-(a0[key]??0))*e;chromState.set(t.c.id,s);paint(t.el,t.c,s);}
 paintThreads(spindles,hadThreads?1:e);
 if(k<1)animFrame=requestAnimationFrame(step);else finish();};
 animFrame=requestAnimationFrame(step);
 }
 function drawGraph(a){
 const w=Math.max(260,Math.round(graph.clientWidth)),h=265,left=46,right=20,top=25,bottom=59;graph.setAttribute('viewBox',`0 0 ${w} ${h}`);
 const gx=i=>left+i*(w-left-right)/(a.L.length-1),gy=v=>h-bottom-v*(h-top-bottom)/2.2;let out='';
 for(const v of [0,.5,1,1.5,2])out+=`<path class="cd-grid" d="M${left},${gy(v)} H${w-right}"/><text x="${left-9}" y="${gy(v)+5}" text-anchor="end">${fmt(v)}</text>`;
 const step=w<430?3:w<650?2:1;
 for(let i=0;i<a.L.length;i++)if(i===a.L.length-1||i%step===0&&a.L.length-1-i>=step)out+=`<text x="${gx(i)}" y="${h-bottom+24+(i%2&&step===1?21:0)}" text-anchor="${i===a.L.length-1?'end':i===0?'start':'middle'}">${a.L[i].name}</text>`;
 const series=key=>a.L.map((s,i)=>`${i?'L':'M'}${gx(i)},${gy(s[key])}`).join('');
 out+=`<path class="cd-dna-curve" d="${series('dna')}"/><path class="cd-count-curve" d="${series('chrom')}"/>`;a.L.forEach((s,i)=>{out+=`<circle cx="${gx(i)}" cy="${gy(s.dna)}" r="3.5" fill="#fff" stroke="#a95619" stroke-width="1.5"/><circle cx="${gx(i)}" cy="${gy(s.chrom)}" r="2" fill="#216ea0"/>`;});out+=`<path class="cd-now" d="M${gx(a.i)},${top} V${h-bottom}"/><circle cx="${gx(a.i)}" cy="${gy(a.s.dna)}" r="5" fill="#a95619"/><circle cx="${gx(a.i)}" cy="${gy(a.s.chrom)}" r="3" fill="#216ea0"/>`;graph.innerHTML=out;
 }
 function render(){
 const a=analyse();$('cdStageName').textContent=a.s.name;$('cdWhy').textContent=a.s.why;$('cdCellCount').textContent=a.s.cells+'개';$('cdChromCount').textContent=a.chromPer+'개';$('cdDNA').textContent=fmt(a.s.dna);$('cdMolecules').textContent=a.dnaMoleculesPer+'개';
 $('cdTotal').textContent=`전체 DNA 상대량: ${fmt(a.s.dna)} × ${a.s.cells} = ${fmt(a.totalDNA)}`;$('cdTotalNote').textContent=a.i===0?'복제 전의 모세포입니다.':'DNA를 한 번 복제한 뒤에는 전체 DNA를 딸세포들이 나누어 가집니다.';
 $('stageRange').max=String(a.L.length-1);$('stageRange').value=String(index);$('stageOutput').textContent=a.s.name;$('cdNext').disabled=index===a.L.length-1;$('cdMeiosisControls').hidden=kind!=='meiosis';
 for(const b of document.querySelectorAll('[data-kind]'))b.setAttribute('aria-pressed',String(b.dataset.kind===kind));for(const b of document.querySelectorAll('[data-chrom]'))b.setAttribute('aria-pressed',String(Number(b.dataset.chrom)===twoN));
 for(const b of document.querySelectorAll('[data-cd-pair]')){const p=+b.dataset.cdPair;b.hidden=p>=a.pairs;b.textContent=`${p+1}번 쌍: ${orientation&(1<<p)?'부계 ← → 모계':'모계 ← → 부계'}`;}
 $('cdDesc').textContent=kind==='mitosis'?'자매 염색 분체가 나뉘어 두 딸세포가 같은 염색체 구성을 갖습니다.':'각 세포의 그림은 위에서부터 1번, 2번 쌍 순서입니다. 쌍마다 방향을 바꾸고 딸세포의 모계·부계 조합을 비교하세요.';
 $('cdProducts').hidden=index!==a.L.length-1;
 if(index===a.L.length-1){$('cdProductCells').innerHTML=M.counts(a).map(cell=>`<article><h3>세포 ${cell.cell+1}</h3><p>${cell.chromosomes}개 염색체 · DNA ${fmt(a.s.dna)}</p><p>${cell.chromatids.map(c=>`${c.pair+1}${c.origin?'부':'모'}${c.exchanged?'/'+(c.distal?'부':'모'):''}`).join(' · ')}</p></article>`).join('');$('cdDiversity').textContent=kind==='mitosis'?'두 딸세포의 염색체 구성이 같습니다.':crossover?'1번 쌍의 비자매 염색 분체 두 개에서 끝부분을 교환했습니다. /는 한 염색체 안에 두 기원의 부분이 있음을 나타냅니다.':`이 한 번의 분열에서는 서로 다른 염색체 조합 두 가지가 두 세포씩 나옵니다. 여러 분열에서 쌍의 방향이 달라지면 최대 ${a.combos}가지 조합이 가능합니다.`;}
 drawScene(a);drawGraph(a);return a;
 }
 function setStage(i){stop();index=Math.max(0,Math.min(list().length-1,Number(i)));return render();}
 function advance(){if(index>=list().length-1){stop();return;}index++;render();if(index===list().length-1)stop();else if(playing)timer=setTimeout(advance,1800);}
 $('cdPlay').onclick=()=>{if(playing)return stop();if(index===list().length-1){index=0;render();}playing=true;$('cdPlay').textContent='일시 정지';$('cdPlay').setAttribute('aria-pressed','true');timer=setTimeout(advance,1300);};
 $('cdNext').onclick=()=>{stop();advance();};$('cdReset').onclick=()=>setStage(0);$('stageRange').oninput=e=>setStage(e.target.value);
 document.querySelectorAll('[data-kind]').forEach(b=>b.onclick=()=>{stop();kind=b.dataset.kind;index=0;render();});document.querySelectorAll('[data-chrom]').forEach(b=>b.onclick=()=>{stop();twoN=+b.dataset.chrom;orientation&=(1<<(twoN/2))-1;index=0;render();});
 document.querySelectorAll('[data-cd-pair]').forEach(b=>b.onclick=()=>{stop();orientation^=1<<Number(b.dataset.cdPair);render();});$('cdCross').onchange=e=>{stop();crossover=e.target.checked;render();};document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 svg.innerHTML='<defs><radialGradient id="cdCellFill"><stop stop-color="#ffffff"/><stop offset="1" stop-color="#e5f1f4"/></radialGradient></defs><g id="cdShells"></g><g id="cdThreads"></g><g id="cdPoles"></g><g id="cdChromosomes"></g>';render();let resize=0;new ResizeObserver(()=>{cancelAnimationFrame(resize);resize=requestAnimationFrame(()=>{drawScene(analyse(),true);drawGraph(analyse());});}).observe($('cdLab'));
 window.__divModel={...M,analyse,render,check:render,setKind(k){document.querySelector(`[data-kind=${k}]`).click();},setChrom(n){document.querySelector(`[data-chrom="${n}"]`).click();},setStage,getKind:()=>kind,getChrom:()=>twoN,idx:()=>index,list,runToEnd(){setStage(list().length-1);return{stage:index};},snapshot:()=>({...analyse(),playing,counts:M.counts(analyse())})};
});
