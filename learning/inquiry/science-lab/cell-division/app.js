document.addEventListener('DOMContentLoaded',()=>{
 'use strict';
 const M=window.DivisionModel,$=id=>document.getElementById(id),svg=$('cdScene'),graph=$('cdGraph');
 let kind='mitosis',twoN=4,index=0,orientation=1,crossover=false,playing=false,timer=0;
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
 function drawScene(a){
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
 const container=$('cdChromosomes'),active=new Set();
 for(const c of M.chromatids(a)){
 active.add(c.id);let el=container.querySelector(`[data-copy="${c.id}"]`);if(!el){el=document.createElementNS(ns,'g');el.classList.add('cd-chromatid');el.dataset.copy=c.id;container.append(el);}
 const [cx,cy]=centres[c.cell],pairs=a.pairs,rank=c.pair*2+c.origin;let x=cx,y=cy,length=31-c.pair*4;
 const separated=a.k==='mitosis'?a.i>=5:a.i>=9,offset=separated||a.i===0?0:(c.copy===0?-4.5:4.5);
 if(a.s.cells===1){
 if(inter||lay==='condense'){x=cx+(c.origin?1:-1)*rx*.27;y=cy+(c.pair-(pairs-1)/2)*50;length=22-c.pair*3;}
 else if(['pairs','equatorPairs'].includes(lay)){x=cx+(c.side?1:-1)*Math.min(24,rx*.2);y=cy+(c.pair-(pairs-1)/2)*59;length=26-c.pair*3;}
 else if(lay==='equator'){x=cx;y=cy+(rank-(twoN-1)/2)*(twoN===8?33:43);length=twoN===8?13-c.pair:18-c.pair*2;}
 else if(polar){const side=a.k==='mitosis'?c.copy:c.side;x=cx+(side?1:-1)*rx*.46;const row=a.k==='mitosis'?rank:c.pair,total=a.k==='mitosis'?twoN:pairs;y=cy+(row-(total-1)/2)*(total===8?31:total===6?40:56);length=total>4?12-c.pair:25-c.pair*3;}
 }else if(a.s.cells===2){
 if(kind==='mitosis'){x=cx+(c.origin?1:-1)*rx*.34;y=cy+(c.pair-(pairs-1)/2)*47;length=21-c.pair*2;}
 else{x=cx+(polar?(c.copy?1:-1)*rx*.46:0);y=cy+(c.pair-(pairs-1)/2)*52;length=23-c.pair*2;}
 }else{y=cy+7+(c.pair-(pairs-1)/2)*39;length=18-c.pair*2;}
 const tx=x+offset,ty=y,coiled=inter||tel||lay==='daughter'||lay==='four';el.style.transform=`translate(${tx}px, ${ty}px)`;el.dataset.cell=String(c.cell);el.dataset.chromosome=c.chromosome;el.dataset.pair=String(c.pair);el.dataset.origin=String(c.origin);el.dataset.distal=String(c.distal);
 const d=coiled?`M0,${-length} C-10,${-length*.65} 12,${-length*.3} 0,0 C-9,${length*.35} 10,${length*.7} 0,${length}`:`M${offset?Math.sign(offset)*4:0},${-length} Q${-Math.sign(offset)*1.5},0 0,0 Q${-Math.sign(offset)*1.5},0 ${offset?Math.sign(offset)*4:0},${length}`;
 el.innerHTML=`${offset&&c.copy===0?'<path d="M0,0 H9" stroke="#506068" stroke-width="3"/>':''}<path class="cd-strand${coiled?' cd-coiled':''}" d="${d}" stroke="${colours[c.origin]}"/>${c.exchanged?`<defs><clipPath id="cdExchange-${c.id}"><rect x="-20" y="${length*.4}" width="40" height="${length}"/></clipPath></defs><path class="cd-strand${coiled?' cd-coiled':''}" d="${d}" stroke="${colours[c.distal]}" clip-path="url(#cdExchange-${c.id})"/>`:''}<circle class="cd-centromere" r="2.8"/>`;
 if(!inter&&!tel&&!['daughter','four'].includes(lay)){const sides=polar?[a.k==='mitosis'||a.i>=9?c.copy:c.side]:a.k==='meiosis'&&a.i<=6?[c.side]:[c.copy];for(const side of sides){const poleX=cx+(side?1:-1)*rx*.9;threads+=`<path class="cd-spindle" data-target="${c.id}" data-pole="${side}" d="M${poleX},${cy} Q${(poleX+tx)/2},${ty} ${tx},${ty}"/>`;}}
 }
 for(const el of container.children)if(!active.has(el.dataset.copy))el.remove();$('cdShells').innerHTML=shells;$('cdThreads').innerHTML=threads;
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
 svg.innerHTML='<defs><radialGradient id="cdCellFill"><stop stop-color="#ffffff"/><stop offset="1" stop-color="#e5f1f4"/></radialGradient></defs><g id="cdShells"></g><g id="cdThreads"></g><g id="cdChromosomes"></g>';render();let resize=0;new ResizeObserver(()=>{cancelAnimationFrame(resize);resize=requestAnimationFrame(()=>{drawScene(analyse());drawGraph(analyse());});}).observe($('cdLab'));
 window.__divModel={...M,analyse,render,check:render,setKind(k){document.querySelector(`[data-kind=${k}]`).click();},setChrom(n){document.querySelector(`[data-chrom="${n}"]`).click();},setStage,getKind:()=>kind,getChrom:()=>twoN,idx:()=>index,list,runToEnd(){setStage(list().length-1);return{stage:index};},snapshot:()=>({...analyse(),playing,counts:M.counts(analyse())})};
});
