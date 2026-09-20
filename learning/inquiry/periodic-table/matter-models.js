document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    const C = window.MatterCore;
    const root = document.getElementById('matterWorkbench');
    if (!root || !C) return;
    const modules = [
        { id:'states', group:'물질을 입자로 보기', name:'물질의 세 가지 상태', tag:'중학', icon:'◌', title:'같은 입자, 다른 움직임', sub:'입자의 크기는 그대로입니다. 배열·간격·운동을 나란히 비교하세요.', question:'고체를 가열할 때 입자 모형에서 먼저 달라지는 것은?', choices:['입자 자체의 크기','제자리 진동의 세기','원소의 종류'], answer:1, why:'고체 입자는 제자리에서 진동합니다. 온도가 오르면 평균 운동 에너지가 커지며, 입자 자체가 커지는 것은 아닙니다.' },
        { id:'phase', group:'물질을 입자로 보기', name:'상태 변화와 열에너지', tag:'중학', icon:'↗', title:'열을 받아도 온도가 그대로인 순간', sub:'순수한 물의 가열·냉각 곡선에서 수평 구간을 찾아보세요.', question:'1기압에서 순수한 물이 끓는 동안 공급한 열은 주로 어디에 쓰일까요?', choices:['입자 자체를 크게 만드는 데','물 분자를 원자로 분해하는 데','액체에서 기체로 상태를 바꾸는 데'], answer:2, why:'상태 변화 중 열은 입자 사이의 배치를 바꾸는 데 쓰입니다. 액체와 기체가 공존하는 동안 온도는 일정합니다.' },
        { id:'gas', group:'물질을 입자로 보기', name:'기체의 압력·부피·온도', tag:'고등', icon:'⇅', title:'벽에 부딪히는 입자가 만드는 압력', sub:'한 변인씩 바꾸고 PV = nRT의 관계를 확인하세요.', question:'기체의 양과 온도가 일정할 때 부피를 절반으로 줄이면?', choices:['압력이 2배가 된다','압력도 절반이 된다','입자 수가 2배가 된다'], answer:0, why:'보일 법칙에 따라 PV가 일정합니다. 입자 수와 평균 운동 에너지가 같아도 벽에 가하는 단위 면적당 힘이 커집니다.' },
        { id:'atom', group:'원자에서 전자까지', name:'원자·동위 원소·이온', tag:'중학 → 고등', icon:'⊕', title:'원소를 정하는 것은 양성자 수', sub:'동위 원소와 이온을 바꿔도 무엇이 보존되는지 비교하세요.', question:'Na 원자가 Na⁺ 이온이 될 때 변하는 것은?', choices:['양성자 1개를 얻는다','전자 1개를 잃는다','중성자 1개를 잃는다'], answer:1, why:'이온 형성에서는 전자 수가 변합니다. 양성자는 11개 그대로이므로 나트륨이라는 원소의 종류는 바뀌지 않습니다.' },
        { id:'orbital', group:'원자에서 전자까지', name:'오비탈과 확률 분포', tag:'고등 · 심화', icon:'✧', title:'전자는 궤도가 아닌 확률로', sub:'드래그해 시점을 돌리고, 마디와 공간적인 분포를 살펴보세요.', question:'오비탈 점구름에서 점이 조밀한 부분은?', choices:['전자가 반드시 지나는 궤도','양성자가 많이 모인 곳','전자를 발견할 확률 밀도가 큰 영역'], answer:2, why:'점구름은 같은 상태를 여러 번 측정한 위치의 분포를 나타냅니다. 여러 점이 동시에 존재하는 여러 전자를 뜻하지 않습니다.' },
        { id:'config', group:'원자에서 전자까지', name:'전자 배치와 세 가지 규칙', tag:'고등', icon:'⇅', title:'전자들은 어떤 순서로 채워질까?', sub:'쌓음 원리·파울리 배타 원리·훈트 규칙을 상자 모형으로 읽어보세요.', question:'질소의 바닥 상태 2p³ 전자 배치로 알맞은 것은?', choices:['세 오비탈에 같은 방향의 스핀으로 하나씩','한 오비탈에 전자 세 개','한 쌍을 먼저 만들고 나머지를 배치'], answer:0, why:'에너지가 같은 p 오비탈에는 홀전자가 같은 스핀 방향으로 먼저 하나씩 채워집니다. 한 오비탈에는 반대 스핀의 전자가 최대 두 개 들어갑니다.' },
        { id:'bond', group:'원자들이 만드는 물질', name:'결합·분자 구조·극성', tag:'고등', icon:'⌘', title:'결합의 방향이 물질의 성질로', sub:'공유 결합의 구조와 이온·금속 결합의 입자 모형을 비교하세요.', question:'CO₂에 극성 결합이 있어도 분자 전체가 무극성인 까닭은?', choices:['C와 O의 전기 음성도가 같아서','직선 구조에서 결합 쌍극자가 상쇄되어서','공유 전자쌍이 없어서'], answer:1, why:'CO₂는 직선형이고 양쪽 C=O 결합의 쌍극자 모멘트가 크기는 같고 방향이 반대여서 상쇄됩니다.' },
        { id:'classify', group:'원자들이 만드는 물질', name:'원소·화합물·혼합물', tag:'중학', icon:'⋮', title:'입자 그림만 보고 물질 분류하기', sub:'원소의 종류와 물질의 종류는 서로 다른 기준입니다.', question:'O₂와 O₃가 함께 있는 시료는?', choices:['원소가 한 종류이므로 순물질','산소와 오존으로 이루어진 혼합물','서로 다른 원소로 된 화합물'], answer:1, why:'산소와 오존은 같은 원소로 이루어져도 서로 다른 물질입니다. 함께 있으면 혼합물입니다.' },
        { id:'reaction', group:'양과 변화의 법칙', name:'반응식·몰비·질량 보존', tag:'중학 → 고등', icon:'→', title:'원자는 사라지지 않고 재배열됩니다', sub:'수소와 산소의 양을 바꾸고 생성물과 남는 반응물을 세어보세요.', question:'2H₂ + O₂ → 2H₂O에서 항상 보존되는 것은?', choices:['전체 분자 수','기체의 부피','각 원소의 원자 수'], answer:2, why:'계수비 2:1:2는 분자 수비이자 몰수비입니다. 반응 전후 원자 수와 총질량은 보존되지만 전체 분자 수는 달라질 수 있습니다.' },
        { id:'solution', group:'양과 변화의 법칙', name:'몰·농도·희석', tag:'고등', icon:'⌁', title:'용질의 양과 용액의 부피를 따로', sub:'물을 더하면 농도는 낮아져도 용질의 몰수는 그대로입니다.', question:'용질의 손실 없이 용액 부피를 2배로 희석하면?', choices:['몰 농도는 절반, 용질 몰수는 일정','몰 농도와 용질 몰수가 모두 절반','몰 농도는 일정, 몰수는 2배'], answer:0, why:'몰 농도 c = n/V이므로 같은 용질 몰수에서 부피가 2배가 되면 농도는 절반입니다. 희석 전후 c₁V₁ = c₂V₂입니다.' },
        { id:'equilibrium', group:'양과 변화의 법칙', name:'동적 평형과 반응 지수', tag:'고등', icon:'⇌', title:'멈춘 것처럼 보여도 반응은 계속', sub:'가상의 A ⇌ B 반응에서 농도와 정·역반응 속도를 비교하세요.', question:'동적 평형에 대한 올바른 설명은?', choices:['A와 B의 농도가 반드시 같다','정반응과 역반응 속도가 같다','입자 사이의 반응이 모두 멈춘다'], answer:1, why:'평형에서는 두 반응 속도가 같아 거시적 농도가 일정합니다. 농도가 같아야 하는 것은 아니며, 이 모형에서는 [B]/[A] = K입니다.' },
        { id:'acid', group:'양과 변화의 법칙', name:'산·염기와 중화', tag:'고등', icon:'±', title:'부피가 아닌 H⁺와 OH⁻의 양 비교', sub:'0.100 M 염산 25.0 mL에 0.100 M 수산화 나트륨 수용액을 넣습니다.', question:'이 모형의 당량점에서 중화 후에도 남는 이온은?', choices:['Na⁺와 Cl⁻','H⁺만 다량 남음','이온은 하나도 없음'], answer:0, why:'H⁺와 OH⁻가 반응해 물을 만들어도 구경꾼 이온인 Na⁺와 Cl⁻는 남습니다. 25 °C의 강산·강염기 당량점은 pH 7입니다.' },
        { id:'redox', group:'양과 변화의 법칙', name:'산화·환원과 전자 이동', tag:'고등', icon:'⇢', title:'잃은 전자 수와 얻은 전자 수는 같다', sub:'아연과 구리(Ⅱ) 이온의 반응을 두 반쪽 반응으로 나눠보세요.', question:'Zn + Cu²⁺ → Zn²⁺ + Cu에서 환원제는?', choices:['전자를 얻는 Cu²⁺','전자를 잃는 Zn','생성된 Zn²⁺'], answer:1, why:'Zn은 전자 2개를 잃어 산화되면서 Cu²⁺를 환원시키므로 환원제입니다. 산화제 Cu²⁺는 전자를 받아 환원됩니다.' }
    ];
    const defaults = {
        states:{ warmth:45, width:75 }, phase:{ progress:30, direction:'heat' }, gas:{ volume:2, temperature:300, amount:0.1 },
        atom:{ isotope:5, ion:'neutral' }, orbital:{ orbital:0, phase:'density', slice:'all' }, config:{ z:7 },
        bond:{ compound:'H2O', view:'shape' }, classify:{ sample:'mixture' }, reaction:{ hydrogen:6, oxygen:2, progress:100 },
        solution:{ moles:0.2, volume:1 }, equilibrium:{ a:8, b:2, k:3, time:0 }, acid:{ volume:0 }, redox:{ progress:0 }
    };
    let active = 'states', values = { ...defaults.states }, paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0, tick = 0, previousTime = 0, draw = null, yaw = 0.5, pitch = -0.25;
    const cloudCache = new Map();
    const $ = id => document.getElementById(id);
    const fmt = (n, places=1) => Number(n).toFixed(places);
    root.innerHTML = `<header class="matter-intro"><div><span class="matter-eyebrow">ELEMENTS & MATTER / INTERACTIVE ATLAS</span><h1>원소·물질 모형</h1><p>보이지 않는 입자를 보고, 움직이고, 설명하다.</p></div><div class="matter-intro-meta"><strong>13</strong><span>탐구 모형<br>중학 기초 → 고등 화학</span></div></header><div class="matter-layout"><nav class="matter-nav" aria-label="물질 모형 주제">${modules.map((m,i)=>`${i===0||modules[i-1].group!==m.group?`<h2>${m.group}</h2>`:''}<button type="button" data-model="${m.id}" aria-pressed="${m.id===active}"><span class="model-index">${String(i+1).padStart(2,'0')}</span><span>${m.name}</span></button>`).join('')}</nav><div class="matter-main"><header class="model-heading"><div><div class="model-kicker" id="modelKicker"></div><h2 id="modelTitle"></h2><p id="modelSubtitle"></p></div><button type="button" class="model-reset" id="modelReset">↺ 초기화</button></header><div class="model-layout"><section class="model-stage-panel"><div class="model-stage-top"><span id="modelViewLabel">입자 관찰</span><button type="button" id="modelPause" aria-pressed="false">Ⅱ 일시 정지</button></div><div id="modelStage" class="model-stage"></div><div id="modelLegend" class="model-legend"></div></section><aside class="model-inspector" aria-label="관찰 결과"><span class="inspector-label">관찰 → 해석</span><div id="modelFacts" aria-live="polite"></div><div class="model-key"><span>시험에서 구별하기</span><p id="modelKey"></p></div></aside></div><section class="model-controls" id="modelControls" aria-label="모형 조건 조절"></section><p class="model-note" id="modelNote"></p><section class="model-check"><div class="check-heading"><span>CHECK YOUR THINKING</span><h3 id="modelQuestion"></h3></div><div id="modelAnswers" class="model-answers"></div><p id="modelFeedback" aria-live="polite"></p></section><details class="model-references"><summary>모형의 범위와 학습 근거</summary><p>중학교 물질의 구성·상태 변화, 고등학교 화학의 물질의 양·결합·평형·산과 염기, 물질과 에너지의 기체, 고급 화학의 오비탈·전자 배치를 연결했습니다. 학교와 선택 과목에 따라 시험 범위는 다릅니다.</p><a href="https://www.acs.org/middleschoolchemistry/lessonplans.html" target="_blank" rel="noopener">ACS · 입자와 물질 학습 자료 ↗</a><a href="https://chem.libretexts.org/Bookshelves/General_Chemistry/Book%3A_General_Chemistry%3A_Principles_Patterns_and_Applications_%28Averill%29/06%3A_The_Structure_of_Atoms/6.05%3A_Atomic_Orbitals_and_Their_Energies" target="_blank" rel="noopener">오비탈의 분포와 에너지 ↗</a></details></div></div>`;
    const range = (key,label,min,max,step,unit='') => `<label class="model-control"><span>${label}<output id="read-${key}">${values[key]}${unit}</output></span><input type="range" data-key="${key}" id="control-${key}" min="${min}" max="${max}" step="${step}" value="${values[key]}" aria-label="${label}" data-unit="${unit}"></label>`;
    const select = (key,label,options) => `<label class="model-control"><span>${label}</span><select data-key="${key}" id="control-${key}">${options.map(([v,t])=>`<option value="${v}" ${String(values[key])===String(v)?'selected':''}>${t}</option>`).join('')}</select></label>`;
    function controls() {
        switch(active) {
            case 'states': return range('warmth','입자 운동 세기',10,90,1,'')+range('width','용기 너비',55,95,1,'%');
            case 'phase': return select('direction','열의 이동',[['heat','가열 · 열 흡수'],['cool','냉각 · 열 방출']])+range('progress','변화 진행',0,100,1,'%');
            case 'gas': return range('volume','부피 V',1,4,0.1,' L')+range('temperature','절대 온도 T',200,600,10,' K')+range('amount','기체의 양 n',0.05,0.3,0.01,' mol');
            case 'atom': return select('isotope','원자 선택',C.atoms.map((a,i)=>[i,a.label]))+select('ion','전하 상태',[['neutral','중성 원자'],['ion','대표 이온']]);
            case 'orbital': return select('orbital','오비탈',C.orbitals.map((o,i)=>[i,o.id]))+select('phase','점구름 색',[['density','확률 밀도'],['sign','파동 함수의 부호']])+select('slice','관찰 영역',[['all','전체 공간'],['slice','중앙 단면 (z ≈ 0)']]);
            case 'config': return select('z','중성 원자',window.ELEMENTS_DATA.filter(e=>e.number<=20||e.number===24||e.number===29).map(e=>[e.number,`${e.number} · ${e.symbol} ${e.name}`]));
            case 'bond': return select('compound','물질 선택',[['H2','H₂ · 수소'],['CO2','CO₂ · 이산화 탄소'],['H2O','H₂O · 물'],['NH3','NH₃ · 암모니아'],['CH4','CH₄ · 메테인'],['BF3','BF₃ · 삼플루오린화 붕소'],['NaCl','NaCl · 염화 나트륨'],['metal','금속 결합']])+select('view','표현 방식',[['shape','공간 구조'],['lewis','전자쌍 / 전하 표시']]);
            case 'classify': return select('sample','입자 시료',[['oxygen','O₂ · 산소'],['water','H₂O · 물'],['mixture','H₂ + O₂ · 혼합 기체'],['allotrope','O₂ + O₃ · 산소와 오존'],['salt','NaCl · 이온 결정']]);
            case 'reaction': return range('hydrogen','처음 H₂ 분자 수',0,12,1,'개')+range('oxygen','처음 O₂ 분자 수',0,6,1,'개')+range('progress','반응 진행',0,100,1,'%');
            case 'solution': return range('moles','용질의 양 n',0.05,0.5,0.05,' mol')+range('volume','용액의 부피 V',0.5,2,0.1,' L');
            case 'equilibrium': return range('a','처음 [A]',1,10,1,' mol/L')+range('b','처음 [B]',0,10,1,' mol/L')+select('k','평형 상수 K (각각 다른 조건)',[[0.5,'0.5'],[1,'1'],[3,'3'],[5,'5']])+range('time','반응 경과',0,60,1,'');
            case 'acid': return range('volume','넣은 NaOH 용액',0,50,0.5,' mL');
            case 'redox': return range('progress','반응 진행',0,100,1,'%');
        }
    }
    function info(facts, key, note, legend='') {
        $('modelFacts').innerHTML = facts.map(([label,value,detail])=>`<div class="model-fact"><span>${label}</span><strong>${value}</strong>${detail?`<small>${detail}</small>`:''}</div>`).join('');
        $('modelKey').textContent=key; $('modelNote').textContent=note; $('modelLegend').innerHTML=legend;
    }
    const swatch = (color,text) => `<span><i style="background:${color}"></i>${text}</span>`;
    const svg = (body, label='입자 모형', viewBox='0 0 800 440') => `<svg viewBox="${viewBox}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="atomBlue" cx="30%" cy="25%"><stop stop-color="#daf9ff"/><stop offset=".45" stop-color="#68d8eb"/><stop offset="1" stop-color="#248499"/></radialGradient><radialGradient id="atomRed" cx="30%" cy="25%"><stop stop-color="#ffe5d8"/><stop offset=".45" stop-color="#ff967e"/><stop offset="1" stop-color="#b75555"/></radialGradient><radialGradient id="atomWhite" cx="30%" cy="25%"><stop stop-color="#fff"/><stop offset="1" stop-color="#97afc1"/></radialGradient></defs>${body}</svg>`;
    const text = (x,y,content,size=18,color='#a8bacb',anchor='middle') => `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" text-anchor="${anchor}" font-family="Pretendard, sans-serif">${content}</text>`;
    const line = (x1,y1,x2,y2,color='#324957',width=2,dash='') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
    const sphere = (x,y,r,color='blue',label='') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color.startsWith('#')?color:`url(#atom${color[0].toUpperCase()+color.slice(1)})`}" stroke="#ffffff25"/>${label?text(x,y+6,label,18,'#092331'):''}`;
    function molecule(kind,x,y,scale=1) {
        let s='';
        if(kind==='H2') s=line(x-10*scale,y,x+10*scale,y,'#a3bcc9',5*scale)+sphere(x-10*scale,y,10*scale,'white')+sphere(x+10*scale,y,10*scale,'white');
        if(kind==='O2') s=line(x-12*scale,y,x+12*scale,y,'#f2b8a9',6*scale)+sphere(x-12*scale,y,13*scale,'red')+sphere(x+12*scale,y,13*scale,'red');
        if(kind==='H2O') s=line(x,y,x-17*scale,y+15*scale,'#a3bcc9',5*scale)+line(x,y,x+17*scale,y+15*scale,'#a3bcc9',5*scale)+sphere(x,y,13*scale,'red')+sphere(x-17*scale,y+15*scale,8*scale,'white')+sphere(x+17*scale,y+15*scale,8*scale,'white');
        if(kind==='O3') s=sphere(x-20*scale,y+12*scale,12*scale,'red')+sphere(x,y,12*scale,'red')+sphere(x+20*scale,y+12*scale,12*scale,'red');
        return s;
    }
    function stageSVG(body,label) { $('modelStage').innerHTML=svg(body,label); }
    function canvasStage(label) {
        $('modelStage').innerHTML=`<canvas width="1200" height="660" aria-label="${label}" role="img"></canvas>`;
        const canvas=$('modelStage').querySelector('canvas'), ctx=canvas.getContext('2d');
        ctx.scale(1.5,1.5);
        return {canvas,ctx};
    }
    function ball(ctx,x,y,r,color='#64d8e7') {
        const g=ctx.createRadialGradient(x-r*.35,y-r*.4,0,x,y,r);g.addColorStop(0,'#e4fcff');g.addColorStop(.35,color);g.addColorStop(1,color+'88');
        ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
    }
    function vessel(ctx,x,y,w,h) { ctx.strokeStyle='#7ba5b04d';ctx.lineWidth=2;ctx.fillStyle='#6cbcca08';ctx.fillRect(x,y,w,h);ctx.strokeRect(x,y,w,h); }
    function particleSystem(count,x,y,w,h,r=6) {
        const columns=Math.ceil(Math.sqrt(count*w/h)), rows=Math.ceil(count/columns);
        return Array.from({length:count},(_,i)=>({x:x+(i%columns+.5)*w/columns,y:y+(Math.floor(i/columns)+.5)*h/rows,vx:Math.cos(i*2.4)*38,vy:Math.sin(i*2.4)*38,homeX:x+(i%columns+.5)*w/columns,homeY:y+(Math.floor(i/columns)+.5)*h/rows,r}));
    }
    function moveParticles(particles,dt,bounds,speed) {
        const {x,y,w,h}=bounds;
        particles.forEach(p=>{p.x+=p.vx*dt*speed;p.y+=p.vy*dt*speed;if(p.x<x+p.r){p.x=x+p.r;p.vx=Math.abs(p.vx);}if(p.x>x+w-p.r){p.x=x+w-p.r;p.vx=-Math.abs(p.vx);}if(p.y<y+p.r){p.y=y+p.r;p.vy=Math.abs(p.vy);}if(p.y>y+h-p.r){p.y=y+h-p.r;p.vy=-Math.abs(p.vy);}});
        for(let i=0;i<particles.length;i++)for(let j=i+1;j<particles.length;j++) {const a=particles[i],b=particles[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),r=a.r+b.r;if(d>0&&d<r){const nx=dx/d,ny=dy/d,overlap=(r-d)/2;a.x-=nx*overlap;a.y-=ny*overlap;b.x+=nx*overlap;b.y+=ny*overlap;const relative=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny;if(relative>0){a.vx-=relative*nx;a.vy-=relative*ny;b.vx+=relative*nx;b.vy+=relative*ny;}}}
    }
    function drawStates() {
        const {ctx}=canvasStage('高체·액체·기체의 입자 배열과 운동 비교'.replace('高','고'));
        const labels=['고체','액체','기체'],w=values.width*2.2,liquidH=16000/w;
        const regions=labels.map((_,i)=>({x:27+i*260+(220-w)/2,y:80,w,h:280}));
        const particles=regions.map((b,i)=>particleSystem(36,i===0?b.x+w/2-52:b.x,i===0?b.y+b.h-114:i===1?b.y+b.h-liquidH:b.y,i===0?104:b.w,i===0?104:i===1?liquidH:b.h,6));
        draw=(dt,time)=>{ctx.clearRect(0,0,800,440);regions.forEach((b,i)=>{ctx.fillStyle='#e6f2f5';ctx.font='600 22px sans-serif';ctx.textAlign='center';ctx.fillText(labels[i],b.x+b.w/2,43);vessel(ctx,b.x,b.y,b.w,b.h);if(i===1){ctx.fillStyle='#5acaca12';ctx.fillRect(b.x,b.y+b.h-liquidH,b.w,liquidH);}const speed=Math.sqrt(values.warmth/45);if(i>0)moveParticles(particles[i],dt,i===1?{...b,y:b.y+b.h-liquidH,h:liquidH}:b,speed*(i===2?1.7:.55));particles[i].forEach((p,j)=>{const x=i===0?p.homeX+Math.sin(time*4+j)*values.warmth/35:p.x,y=i===0?p.homeY+Math.cos(time*4+j*2)*values.warmth/35:p.y;ball(ctx,x,y,6,['#76bfef','#62d7c4','#f4c481'][i]);});ctx.fillStyle='#9bb3c6';ctx.font='16px sans-serif';ctx.fillText(['제자리에서 진동','가까이서 자리 이동','공간 전체로 운동'][i],b.x+b.w/2,398);});};
        info([['입자 수','36개씩','세 모형에서 입자의 수·크기를 같게 표시'],['고체 / 액체','부피 일정','고체는 모양 유지 · 액체는 용기 모양에 맞춤'],['기체','용기 전체로','쉽게 압축 · 용기 모양과 부피를 따름']], '상태가 바뀌어도 입자의 종류와 크기는 유지됩니다. 고체에서도 입자는 운동합니다.', '배열·운동을 비교하는 2차원 개념 모형입니다. 실제 크기·속도·밀도 비율은 아니며, 액체·고체의 부피 변화는 작다고 가정합니다. 운동 세기 조절은 상태를 자동으로 바꾸지 않습니다.', swatch('#76bfef','고체')+swatch('#62d7c4','액체')+swatch('#f4c481','기체'));
    }
    function drawPhase() {
        const progress=values.direction==='heat'?values.progress:100-values.progress, h=C.heating(progress);
        const points=[[90,325],[214,285],[338,285],[462,85],[586,85],[710,45]];
        let s=''; for(let t=0;t<=100;t+=20)s+=line(90,285-t*2,710,285-t*2,'#243a47',1);
        s+=line(90,350,730,350)+line(90,350,90,30)+text(90,25,'온도 (°C)',16)+text(400,402,'가열 진행 →  /  냉각 진행 ←',18);
        s+=text(70,291,'0',16)+text(65,91,'100',16);
        s+=`<polyline points="${points.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#62d7c4" stroke-width="5" stroke-linejoin="round"/>`;
        const start=points[h.segment],end=points[h.segment+1],x=start[0]+(end[0]-start[0])*h.fraction,y=start[1]+(end[1]-start[1])*h.fraction;
        s+=`<circle cx="${x}" cy="${y}" r="17" fill="#62d7c422"/><circle cx="${x}" cy="${y}" r="7" fill="#f3c58c"/>`;
        ['얼음','융해 / 응고','물','기화 / 액화','수증기'].forEach((v,i)=>s+=text(152+i*124,375,v,15,i===h.segment?'#f3c58c':'#91aab9'));
        s+=text(400,190,`${fmt(h.temperature,0)} °C`,46,'#eef6f6')+text(400,226,h.phase,20,'#62d7c4');
        stageSVG(s,'순수한 물의 가열·냉각 곡선');
        info([['현재 상태',h.phase],['온도',`${fmt(h.temperature,0)} °C`,h.plateau?'두 상태가 공존하는 수평 구간':'한 상태에서 온도가 변하는 구간'],['에너지',values.direction==='heat'?'흡수':'방출',h.plateau?'입자 사이의 배치가 달라짐':'평균 운동 에너지가 달라짐']], '끓음은 분자의 분해가 아닙니다. 증발은 끓는점 아래에서도 표면에서 일어나며, 수증기 자체는 눈에 보이지 않습니다.', '1기압의 순수한 물을 가정합니다. 가로축 각 구간의 길이는 실제 소요 열량 비율이 아닌 개념도입니다. 승화(고체→기체)는 흡열, 역승화(기체→고체)는 발열입니다.', swatch('#62d7c4','가열·냉각 경로')+swatch('#f3c58c','현재 위치'));
    }
    function drawGas() {
        const {ctx}=canvasStage('피스톤 속 기체 입자의 운동'); const h=75+values.volume*62, b={x:170,y:370-h,w:440,h};
        const particles=particleSystem(Math.round(values.amount*200),b.x,b.y,b.w,b.h,5);
        draw=(dt)=>{ctx.clearRect(0,0,800,440);vessel(ctx,170,45,440,330);ctx.fillStyle='#97b9c4';ctx.fillRect(162,b.y-10,456,12);ctx.fillStyle='#7894a1';ctx.fillRect(385,20,12,Math.max(0,b.y-30));moveParticles(particles,dt,b,Math.sqrt(values.temperature/300));particles.forEach(p=>ball(ctx,p.x,p.y,5));ctx.fillStyle='#a3bcc9';ctx.font='18px sans-serif';ctx.textAlign='center';ctx.fillText(`V = ${fmt(values.volume)} L`,390,409);};
        const pressure=C.gasPressure(values.amount,values.temperature,values.volume);
        info([['압력 P',`${fmt(pressure)} kPa`],['절대 온도 T',`${values.temperature} K`,`${fmt(values.temperature-273.15)} °C`],['PV / nT', '8.314', 'kPa·L·mol⁻¹·K⁻¹']], '온도는 K로 계산합니다. 온도와 몰수를 고정하면 P ∝ 1/V, 부피와 몰수를 고정하면 P ∝ T입니다.', '이상 기체 근사입니다. 화면의 점 하나는 많은 분자를 대표하며, 실제 충돌로 압력을 계산하는 대신 PV = nRT로 수치를 구합니다. 입자 운동은 온도의 제곱근에 비례해 빨라집니다.',swatch('#64d8e7','같은 종류의 기체 입자'));
    }
    function drawAtom() {
        const a=C.atomCounts(Number(values.isotope),values.ion==='ion');
        const ionSelect=$('control-ion'); ionSelect.disabled=a.ion===null;
        if(a.ion===null&&values.ion!=='neutral'){values.ion='neutral';ionSelect.value='neutral';}
        let s='';const cx=365,cy=220;
        a.shells.forEach((count,i)=>{const r=83+i*42;s+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${['#76bfef','#ba9fea','#f4c481','#62d7c4'][i]}66" stroke-width="2"/>`;for(let j=0;j<count;j++){const angle=j/count*Math.PI*2-Math.PI/2;s+=sphere(cx+Math.cos(angle)*r,cy+Math.sin(angle)*r,6,['#76bfef','#ba9fea','#f4c481','#62d7c4'][i]);}});
        s+=sphere(cx,cy,49,'blue')+text(cx,cy+8,a.symbol,30,'#0b2736')+text(cx,cy+27,`${a.protons}p · ${a.neutrons}n`,12,'#0b2736');
        s+=text(650,135,`${a.a}`,29,'#d9e9ef')+text(650,177,`${a.z}`,29,'#8da8ba')+text(706,159,a.symbol,48,'#e4f5f5')+text(746,130,a.charge?`${Math.abs(a.charge)===1?'':Math.abs(a.charge)}${a.charge>0?'+':'−'}`:'',23,'#f3c58c');
        stageSVG(s,'원자핵과 전자껍질의 개념 모형');
        info([['양성자 / 중성자',`${a.protons} / ${a.neutrons}`,`질량수 A = ${a.a}`],['전자 수 / 전하',`${a.electrons}개 / ${a.charge>0?'+':''}${a.charge}`,`전하 = 양성자 수 − 전자 수`],['전자껍질별 전자 수',a.shells.join(' · ')||'전자 없음']], '동위 원소는 양성자 수가 같고 중성자 수가 다릅니다. 이온은 전자를 얻거나 잃으며, 원자핵은 바뀌지 않습니다.', '전자 수를 세기 위한 보어식 껍질 모형입니다. 원과 점의 위치는 실제 전자 궤도·크기 비율이 아닙니다. 공간적 확률 분포는 오비탈 모형에서 관찰하세요.',swatch('#76bfef','1껍질')+swatch('#ba9fea','2껍질')+swatch('#f4c481','3껍질'));
    }
    function drawOrbital() {
        const index=Number(values.orbital), o=C.orbitals[index];if(!cloudCache.has(index))cloudCache.set(index,C.sampleOrbital(index));
        const points=cloudCache.get(index), {canvas,ctx}=canvasStage(`${o.id} 오비탈 전자 확률 분포`);
        let drag=null;
        canvas.tabIndex=0; canvas.setAttribute('aria-label',`${o.id} 확률 분포. 드래그 또는 방향키로 시점을 회전합니다.`);
        canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);});
        canvas.addEventListener('pointermove',e=>{if(!drag)return;yaw+=(e.clientX-drag.x)*.008;pitch=C.clamp(pitch+(e.clientY-drag.y)*.008,-1.5,1.5);drag={x:e.clientX,y:e.clientY};paint();});
        canvas.addEventListener('pointerup',()=>drag=null);canvas.addEventListener('pointercancel',()=>drag=null);
        canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();yaw+=(e.key==='ArrowLeft'?-.12:e.key==='ArrowRight'?.12:0);pitch=C.clamp(pitch+(e.key==='ArrowUp'?-.12:e.key==='ArrowDown'?.12:0),-1.5,1.5);paint();});
        function project(x,y,z) {const a=x*Math.cos(yaw)+z*Math.sin(yaw),b=z*Math.cos(yaw)-x*Math.sin(yaw);return {x:400+a*scale,y:220+(y*Math.cos(pitch)-b*Math.sin(pitch))*scale,z:y*Math.sin(pitch)+b*Math.cos(pitch)};}
        const scale=175/(o.n*o.n*2.1);
        function paint(){ctx.clearRect(0,0,800,440);ctx.font='16px sans-serif';[['x',1,0,0],['y',0,1,0],['z',0,0,1]].forEach(([label,x,y,z])=>{const end=project(x*205/scale,y*205/scale,z*205/scale);ctx.strokeStyle='#50667466';ctx.beginPath();ctx.moveTo(400,220);ctx.lineTo(end.x,end.y);ctx.stroke();ctx.fillStyle='#8ba6b7';ctx.fillText(label,end.x+5,end.y);});const visible=points.filter(p=>values.slice==='all'||Math.abs(p.z)<o.n*o.n*.14).map(p=>({...project(p.x,p.y,p.z),positive:p.positive})).sort((a,b)=>a.z-b.z);visible.forEach(p=>{ctx.fillStyle=values.phase==='sign'&&!p.positive?'#f1b87a8c':'#68dce78c';ctx.beginPath();ctx.arc(p.x,p.y,1.55,0,Math.PI*2);ctx.fill();});ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(400,220,3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#90a9ba';ctx.textAlign='center';ctx.font='15px sans-serif';ctx.fillText('드래그 또는 방향키로 시점 회전',400,418);}
        draw=()=>paint();
        info([['오비탈',o.id,`n = ${o.n} · ℓ = ${o.l}`],['마디 수',`${o.n-1}개`,`방사형 ${o.n-o.l-1} · 각도 ${o.l}`],['한 오비탈의 정원','최대 2전자','서로 반대 방향의 스핀']], '점 하나는 한 번의 위치 측정 표본입니다. 색을 둘로 나눈 경우 +/−는 파동 함수의 부호이며 전하가 아닙니다.', '수소 원자의 파동 함수 |ψ|²에서 추출한 고정 표본입니다. 시점만 회전하며 전자가 궤도를 도는 장면이 아닙니다. 오비탈마다 화면 배율이 다릅니다. 단면은 고정 z ≈ 0 평면으로, 2pz의 마디에서는 거의 비어 보입니다.',swatch('#68dce7',values.phase==='sign'?'ψ 양의 부호':'위치 측정 표본')+(values.phase==='sign'?swatch('#f1b87a','ψ 음의 부호'):'')+swatch('#fff','원자핵'));
    }
    function drawConfig() {
        const z=Number(values.z), rows=C.configuration(z), el=window.ELEMENTS_DATA.find(e=>e.number===z);
        let s=text(95,38,'낮은 에너지부터 채우기 ↓',17,'#97b2c1','start');
        rows.forEach((r,i)=>{const y=75+i*48;s+=text(104,y+8,r.name,22,'#dceff3');r.occupancy.forEach((n,j)=>{const x=157+j*76;s+=`<rect x="${x}" y="${y-22}" width="62" height="36" rx="6" fill="${n?'#133e45':'#101f2b'}" stroke="${n?'#4dafa8':'#2d4351'}"/>`+text(x+31,y+5,n===2?'↑↓':n===1?'↑':'',24,'#87ead6');});s+=text(642,y+6,`${r.count} e⁻`,18,r.count?'#c9e8ed':'#647e90');});
        stageSVG(s,'전자 배치 상자 모형');
        const unpaired=rows.reduce((sum,r)=>sum+r.occupancy.filter(n=>n===1).length,0);
        info([['선택한 원자',`${el.symbol} · ${el.name}`,`총 ${z}개 전자`],['홀전자',`${unpaired}개`],['전자 배치',rows.filter(r=>r.count).map(r=>`${r.name}<sup>${r.count}</sup>`).join(' ')]], z===24||z===29?'Cr과 Cu의 바닥 상태는 단순 쌓음 순서의 예외입니다. Cr은 [Ar] 3d⁵4s¹, Cu는 [Ar] 3d¹⁰4s¹입니다.':'한 상자는 한 오비탈입니다. 같은 에너지의 오비탈에는 평행 스핀으로 하나씩 채운 뒤 짝을 이룹니다.', '중성 원자의 바닥 상태입니다. 화살표는 스핀 상태를 나타내며 전자의 공전 방향이 아닙니다. 세로 간격은 실제 에너지 간격이 아니고, 전이 금속 양이온은 일반적으로 4s 전자를 먼저 잃습니다.',swatch('#87ead6','↑·↓ 스핀 상태')+swatch('#133e45','한 상자 = 한 오비탈'));
    }
