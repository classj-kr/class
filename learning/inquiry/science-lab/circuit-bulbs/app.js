document.addEventListener('DOMContentLoaded', () => {
    const modeButtons = [...document.querySelectorAll('[data-mode]')];
    const circuitButtons = [...document.querySelectorAll('[data-circuit]')];
    const directionButtons = [...document.querySelectorAll('[data-direction]')];
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const circuitControls = document.getElementById('circuitControls');
    const magnetControls = document.getElementById('magnetControls');
    const circuitBatteryRange = document.getElementById('circuitBatteryRange');
    const circuitBatteryOutput = document.getElementById('circuitBatteryOutput');
    const magnetBatteryRange = document.getElementById('magnetBatteryRange');
    const magnetBatteryOutput = document.getElementById('magnetBatteryOutput');
    const coilRange = document.getElementById('coilRange');
    const coilOutput = document.getElementById('coilOutput');
    const powerBtn = document.getElementById('powerBtn');
    const compareBtn = document.getElementById('compareBtn');
    const checkBtn = document.getElementById('checkBtn');
    const resultEmpty = document.getElementById('resultEmpty');
    const resultContent = document.getElementById('resultContent');
    const resultA = document.getElementById('resultA');
    const resultB = document.getElementById('resultB');
    const resultLabelA = document.getElementById('resultLabelA');
    const resultLabelB = document.getElementById('resultLabelB');
    const predictionResult = document.getElementById('predictionResult');
    const explanation = document.getElementById('elementaryExplanation');
    const stageCaption = document.getElementById('stageCaption');
    const stageBadge = document.getElementById('stageBadge');
    const circuitGroup = document.getElementById('circuitGroup');

    let mode = 'circuit';
    let circuitClosed = true;
    let magnetDirection = 'forward';
    let magnetPower = true;
    let comparePermanent = false;
    let prediction = null;
    const predictionLegend = document.getElementById('predictionLegend');
    function resetPrediction(){prediction=null;predictionButtons.forEach(b=>{b.classList.remove('selected');b.setAttribute('aria-pressed','false');});}

    function circuitState() {
        const batteries = Number(circuitBatteryRange.value);
        return {
            batteries,
            closed: circuitClosed,
            lit: circuitClosed,
            brightness: circuitClosed ? batteries : 0,
            comparison: !circuitClosed ? '꺼짐' : batteries === 1 ? '기준' : '더 밝음',
        };
    }

    function magnetState() {
        const batteries = Number(magnetBatteryRange.value);
        const turns = Number(coilRange.value);
        const strength = magnetPower ? (batteries * turns) / 50 : 0;
        const leftPole = !magnetPower ? '—' : magnetDirection === 'forward' ? 'S' : 'N';
        const rightPole = !magnetPower ? '—' : magnetDirection === 'forward' ? 'N' : 'S';
        return {
            batteries, turns, power: magnetPower, direction: magnetDirection,
            strength, clips: Math.min(12, Math.round(strength)), leftPole, rightPole,
        };
    }

    const bulbSVG = (x, y, on, brightness) => {
        const visualBrightness = Math.min(1.65, brightness);
        const glow = on
            ? `<circle cx="${x}" cy="${y}" r="${(25 + 22 * visualBrightness).toFixed(1)}" fill="url(#bulbGlow)" opacity="${(0.5 + 0.25 * visualBrightness).toFixed(2)}"/>`
            : '';
        return glow +
            `<circle class="bulb-glass" cx="${x}" cy="${y}" r="18" fill="${on ? `rgba(255,225,150,${(0.28 + 0.35 * visualBrightness).toFixed(2)})` : 'rgba(150,165,172,.18)'}"/>` +
            `<path class="bulb-filament${on ? '' : ' off'}" d="M${x - 7},${y + 3} L${x - 2},${y - 5} L${x + 2},${y + 5} L${x + 7},${y - 3}"/>` +
            `<rect class="bulb-base" x="${x - 8}" y="${y + 17}" width="16" height="8" rx="2"/>`;
    };

    // A horizontal series pack. Each cell's negative terminal joins the next positive terminal.
    const batterySVG = (cx, y, count = 1, direction = 'forward') => {
        const width = count * 46 + (count - 1) * 14, start = cx - width / 2;
        let svg = '';
        for (let i = 0; i < count; i += 1) {
            const x = start + i * 60, positiveLeft = direction === 'forward';
            if (i) svg += `<path class="wire battery-jumper" d="M${x-14},${y} H${x-5}"/>`;
            svg += `<g class="battery-cell" data-positive="${positiveLeft?'left':'right'}"><rect class="cell-shell" x="${x}" y="${y-15}" width="46" height="30" rx="5"/><rect class="cell-positive-end" x="${positiveLeft?x:x+31}" y="${y-15}" width="15" height="30" rx="4"/><path class="cell-terminal" d="M${x-5},${y} H${x} M${x+46},${y} H${x+51}"/><text class="cell-sign" x="${x+10}" y="${y+5}" text-anchor="middle">${positiveLeft?'+':'−'}</text><text class="cell-sign" x="${x+36}" y="${y+5}" text-anchor="middle">${positiveLeft?'−':'+'}</text></g>`;
        }
        return {svg,left:start-5,right:start+width+5};
    };

    // 초6 교과서 실물 회로: 전구 끼우개에 끼운 전구, 전지 끼우개, 전선, 칼날 스위치.
    let circuitShown=false,circuitAnim=null,circuitRaf=0;
    const easeIO=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
    const mixHex=(a,c,f)=>'#'+a.match(/../g).map((v,i)=>Math.round(parseInt(v,16)+(parseInt(c.match(/../g)[i],16)-parseInt(v,16))*f).toString(16).padStart(2,'0')).join('');
    function realBulb(cx,glow){
        const b=Math.max(0,glow),hot=b>0.02,f=Math.min(1,b/2);
        const glass=hot?mixHex('e9eff2','ffe39a',Math.min(1,.35+f*.65)):'#e9eff2';
        let s='';
        if(hot)s+=`<circle cx="${cx}" cy="56" r="${(36+26*f).toFixed(1)}" fill="url(#cbHalo)" opacity="${Math.min(1,b*.6).toFixed(2)}"/>`;
        s+=`<path class="bulb-glass" d="M${cx-13} 92 C${cx-14} 82 ${cx-30} 74 ${cx-30} 54 A30 30 0 1 1 ${cx+30} 54 C${cx+30} 74 ${cx+14} 82 ${cx+13} 92 Z" fill="${glass}" stroke="#8aa3ae" stroke-width="1.8"/>`;
        s+=`<path d="M${cx-19} 40 A20 20 0 0 1 ${cx-4} 28" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".85"/>`;
        s+=`<path d="M${cx-6} 92 L${cx-8} 62 M${cx+6} 92 L${cx+8} 62" stroke="#8b989e" stroke-width="1.4" fill="none"/>`;
        const fil=hot?mixHex('ff9a1f','fff3c0',f):'#6b7479';
        s+=`<path class="bulb-filament${hot?'':' off'}" style="stroke:${fil};filter:none;stroke-width:2.2" d="M${cx-8} 62 q2 -5 4 0 q2 5 4 0 q2 -5 4 0 q2 5 4 0"/>`;
        // 꼭지쇠(나사 모양)와 전구 끼우개
        s+=`<rect class="bulb-base" x="${cx-14}" y="90" width="28" height="18" rx="2" style="fill:#c9ced1;stroke:#7e8a90"/>`;
        for(let i=0;i<3;i++)s+=`<path d="M${cx-14} ${95+i*5} H${cx+14}" stroke="#8e999e" stroke-width="2"/>`;
        s+=`<rect x="${cx-46}" y="110" width="92" height="22" rx="4" fill="#d9b98c" stroke="#9c7a4d" stroke-width="1.5"/><rect x="${cx-19}" y="104" width="38" height="9" rx="2" fill="#4f5d64"/>`;
        s+=`<circle cx="${cx-34}" cy="122" r="5" fill="#c9ced1" stroke="#6e7b81"/><circle cx="${cx+34}" cy="122" r="5" fill="#c9ced1" stroke="#6e7b81"/>`;
        return s;
    }
    // 전지 끼우개: 원통형 건전지가 같은 방향으로 놓이고, 칸 사이는 금속판(battery-jumper)으로 이어진다.
    function batteryHolder(cx,y,count){
        const cw=78,gap=10,w=count*cw+(count-1)*gap+20,x0=cx-w/2;
        let s=`<rect x="${x0}" y="${y-22}" width="${w}" height="44" rx="6" fill="#56656d" stroke="#33414a" stroke-width="1.5"/>`;
        for(let i=0;i<count;i++){
            const x=x0+10+i*(cw+gap);
            if(i)s+=`<path class="battery-jumper" d="M${x-gap-1} ${y} H${x+1}" stroke="#c9ced1" stroke-width="5"/>`;
            s+=`<g class="battery-cell" data-positive="right"><rect x="${x}" y="${y-14}" width="${cw-6}" height="28" rx="4" fill="url(#cbCell)" stroke="#2c3a40" stroke-width="1.2"/><rect x="${x+cw-30}" y="${y-14}" width="24" height="28" rx="3" fill="#d8a73c" stroke="#2c3a40" stroke-width="1.2"/><rect x="${x+cw-6}" y="${y-5}" width="5" height="10" rx="1.5" fill="#c9ced1" stroke="#6e7b81"/><text class="cell-sign" x="${x+12}" y="${y+5}" text-anchor="middle" style="fill:#ffffff;font-size:15px">−</text><text class="cell-sign" x="${x+cw-18}" y="${y+5}" text-anchor="middle" style="fill:#2a2208;font-size:15px">+</text></g>`;
        }
        s+=`<circle cx="${x0-2}" cy="${y}" r="5" fill="#c9ced1" stroke="#6e7b81"/><circle cx="${x0+w+2}" cy="${y}" r="5" fill="#c9ced1" stroke="#6e7b81"/>`;
        return {svg:s,left:x0-2,right:x0+w+2};
    }
    // 칼날 스위치: 왼쪽 축에 달린 날이 내려와 오른쪽 집게에 끼워진다.
    function knifeSwitch(x1,x2,y,t){
        const ang=-42*(1-t),len=x2-x1+4,rad=ang*Math.PI/180,ex=x1+len*Math.cos(rad),ey=y+len*Math.sin(rad);
        const hx=ex+12*Math.cos(rad-1.1),hy=ey+12*Math.sin(rad-1.1);
        return `<rect x="${x1-16}" y="${y+5}" width="${len+30}" height="15" rx="3" fill="#d9b98c" stroke="#9c7a4d" stroke-width="1.5"/>`+
            `<rect x="${x1-5}" y="${y-6}" width="10" height="12" rx="2" fill="#9aa5ab" stroke="#5e6b71"/><path d="M${x2-4} ${y+5} V${y-8} M${x2+6} ${y+5} V${y-8}" stroke="#8e999e" stroke-width="3"/>`+
            `<path class="switch-blade${t>=1?' closed':''}" d="M${x1} ${y} L${ex.toFixed(1)} ${ey.toFixed(1)}" style="stroke:#a9b4ba;stroke-width:5"/>`+
            `<path d="M${ex.toFixed(1)} ${ey.toFixed(1)} L${hx.toFixed(1)} ${hy.toFixed(1)}" stroke="#2f3b41" stroke-width="8" stroke-linecap="round"/>`+
            `<circle class="switch-contact" cx="${x1}" cy="${y}" r="3.5"/>`;
    }
    function renderCircuit() {
        const state = circuitState(), pack = batteryHolder(190,238,state.batteries);
        circuitGroup.ownerSVGElement.setAttribute('viewBox','0 0 460 300');
        // 전지 1개 기준 회로는 처음부터 켜 둔다. 그 밖의 조건은 결과 확인하기를 눌러야 스위치가 닫힌다.
        const baseline = state.closed && state.batteries === 1;
        const a = circuitAnim || (circuitShown || baseline ? {sw:1,glow:1} : {sw:0,glow:0});
        const flowing = state.closed && a.sw >= 1;
        const glow = state.closed ? state.brightness * a.glow : 0;
        const sx1=330,sx2=376,y=238;
        const leftWire = state.closed ? `M${pack.left},${y} H52 V122 H196` : `M${pack.left},${y} H52 V198 M52,160 V122 H196`;
        const loop = `${leftWire} M264,122 H410 V${y} H${sx2} M${sx1},${y} H${pack.right}`;
        let out = `<defs><radialGradient id="cbHalo"><stop offset="0" stop-color="#fff2c2" stop-opacity=".9"/><stop offset=".55" stop-color="#ffe08a" stop-opacity=".3"/><stop offset="1" stop-color="#ffe08a" stop-opacity="0"/></radialGradient><linearGradient id="cbCell" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a7c85"/><stop offset=".35" stop-color="#3a4a52"/><stop offset="1" stop-color="#222d33"/></linearGradient></defs>`;
        out += `<path class="wire" d="${loop}" style="stroke:#c2502f;stroke-width:4.5"/>`;
        if(!state.closed) out += '<path d="M52,198 v-8 M52,160 v8" stroke="#c98a3c" stroke-width="3" stroke-linecap="round"/><circle cx="52" cy="190" r="1.8" fill="#8a5a1f"/><circle cx="52" cy="168" r="1.8" fill="#8a5a1f"/><text class="stage-label" x="64" y="184">끊어진 곳</text>';
        // 경로는 전지의 (−)쪽(왼쪽)에서 시작한다. 전류는 (+)극에서 나와 (−)극으로 들어가므로 거꾸로 흐르게 한다.
        if(flowing) out += `<path class="current" style="animation-direction:reverse" d="${loop}"/>`;
        out += knifeSwitch(sx1,sx2,y,a.sw);
        out += pack.svg + realBulb(230,glow);
        out += `<text class="stage-label" x="353" y="284" text-anchor="middle">${a.sw>=1?'스위치 닫힘':'스위치 열림'}</text><text class="battery-label" x="190" y="284" text-anchor="middle">전지 ${state.batteries}개${state.batteries===2?' · 같은 방향 직렬':''}</text>`;
        if((circuitShown||baseline)&&!circuitAnim) out += `<text class="stage-label verdict-text" x="290" y="60">${state.lit?state.comparison:'꺼짐'}</text>`;
        circuitGroup.innerHTML = out;
    }
    function playCircuit(){
        cancelAnimationFrame(circuitRaf);circuitShown=true;
        if(matchMedia('(prefers-reduced-motion: reduce)').matches){circuitAnim=null;renderCircuit();return;}
        const t0=performance.now();
        const step=now=>{const t=Math.min(1,(now-t0)/1500);circuitAnim={sw:easeIO(Math.min(1,t/.35)),glow:easeIO(Math.max(0,Math.min(1,(t-.38)/.5)))};
            if(t>=1)circuitAnim=null;renderCircuit();if(t<1)circuitRaf=requestAnimationFrame(step);};
        circuitAnim={sw:0,glow:0};renderCircuit();
        circuitRaf=requestAnimationFrame(step);
    }

    function poleLabel(x, y, pole, active) {
        const className = !active ? 'pole-label off' : pole === 'N' ? 'pole-label north' : 'pole-label south';
        return `<g><circle class="${className}" cx="${x}" cy="${y}" r="15"/><text class="pole-text" x="${x}" y="${y + 5}" text-anchor="middle">${pole}</text></g>`;
    }

    function renderMagnet() {
        const state = magnetState(), pack = batterySVG(230,242,state.batteries,state.direction);
        circuitGroup.ownerSVGElement.setAttribute('viewBox',comparePermanent?'0 0 460 410':'0 0 460 300');
        const turns=Math.round(state.turns/16),start=154,pitch=144/turns,end=298;
        const leads=`M${pack.left},242 H58 V124 H${start} M${end},124 H310 V150 H418 V242 H354 M316,242 H${pack.right}`;
        let out=`<path class="wire${state.power?'':' dead'}" d="${leads}"/>`;
        if(state.power)out+=`<path class="current" style="animation-direction:${state.direction==='forward'?'normal':'reverse'}" d="${leads}"/>`;
        out+=state.power?'<path class="switch-blade closed" d="M316,242 H354"/>':'<path class="switch-blade" d="M316,242 L348,218"/>';
        out+='<circle class="switch-contact" cx="316" cy="242" r="3"/><circle class="switch-contact" cx="354" cy="242" r="3"/>';
        let back='',front='';
        for(let i=0;i<turns;i++){const x=start+i*pitch,top=x+pitch/2,next=x+pitch;
            back+=`<path class="coil-back" d="M${x},124 C${x-8},124 ${x-8},76 ${top},76"/>`;
            front+=`<path class="coil-front" d="M${top},76 C${next+8},76 ${next+8},124 ${next},124"/>`;
        }
        out+=back+'<rect class="iron-head" x="136" y="82" width="9" height="36" rx="2"/><path class="iron-core" d="M145,91 H305 L322,100 L305,109 H145 Z"/>'+front;
        out+=poleLabel(116,100,state.leftPole,state.power)+poleLabel(344,60,state.rightPole,state.power);
        out+='<text class="stage-label" x="230" y="32" text-anchor="middle">철심에 에나멜선을 감은 전자석</text>';
        out+=`<text class="stage-label" x="230" y="59" text-anchor="middle">코일 ${state.turns}번 · 감은 모습은 축약</text>`;
        const number=Math.min(12,Math.round(state.batteries*state.turns/50));
        for(let i=0;i<number;i++){const x=state.power?320+i*7:337+(i%4)*12,y=state.power?98+(i%2)*2:166+Math.floor(i/4)*11;out+=`<rect class="apparatus-clip ${state.power?'attracted':'fallen'}" x="${x}" y="${y}" width="8" height="5" rx="2"/>`;}
        out+=`<text class="stage-label" x="371" y="209" text-anchor="middle">${state.power?'붙은 클립 '+state.clips+'개':'클립이 떨어짐'}</text>`;
        out+=pack.svg+`<text class="battery-label" x="230" y="280" text-anchor="middle">전지 ${state.batteries}개 · ${state.power?'전원 켜짐':'전원 꺼짐'}</text>`;
        if(comparePermanent){out+='<text class="stage-label" x="230" y="321" text-anchor="middle">영구자석 · 전원 없이도 자성 유지</text><rect class="bar-north" x="150" y="344" width="80" height="28" rx="3"/><rect class="bar-south" x="230" y="344" width="80" height="28" rx="3"/><text class="bar-pole" x="166" y="364">N</text><text class="bar-pole" x="285" y="364">S</text>';
            for(let i=0;i<6;i++)out+=`<rect class="apparatus-clip permanent-clip" x="${321+(i%3)*12}" y="${349+Math.floor(i/3)*11}" width="8" height="5" rx="2"/>`;
            out+='<text class="stage-label" x="230" y="395" text-anchor="middle">세기·클립 수는 비교용 모형</text>';
        }
        circuitGroup.innerHTML=out;
    }

    function render() {
        if (mode === 'circuit') {
            const state = circuitState();
            renderCircuit();
            predictionLegend.textContent=state.closed?'이어진 회로에서 전지를 1개에서 2개로 늘리면?':'전지 1개의 이어진 회로와 비교하면, 끊어진 회로의 밝기는?';
            if(!circuitShown)stageCaption.textContent=!state.closed?'전선 한 곳이 끊어진 회로입니다. 밝기를 예상한 뒤 결과 확인하기를 누르세요.':state.batteries===1?'전지 1개가 비교 기준입니다. 예상한 뒤 전지를 2개로 바꾸어 확인하세요.':'전지 두 개를 같은 방향으로 이었습니다. 밝기를 예상한 뒤 결과 확인하기를 누르세요.';
            stageBadge.textContent = `전지 ${state.batteries}개 · ${state.closed ? '이어짐' : '끊어짐'}`;
        } else {
            const state = magnetState();
            renderMagnet();
            stageCaption.textContent=state.power?'전지에서 이어진 에나멜선이 철심을 감고 다시 전지로 이어집니다. 극은 전류 방향에 따라 바뀝니다.':'스위치가 열려 전류가 흐르지 않습니다. 전자석은 클립을 끌어당기지 못합니다.';
            stageBadge.textContent = `${state.power ? `${state.leftPole}극–${state.rightPole}극` : '전원 꺼짐'} · 전지 ${state.batteries}개`;
        }
    }

    function clearResult() {
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        if(circuitShown||circuitAnim){cancelAnimationFrame(circuitRaf);circuitShown=false;circuitAnim=null;if(mode==='circuit')render();}
        predictionResult.textContent="";delete predictionResult.dataset.correct;
    }

    function check() {
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        if (mode === 'magnet') {
            const state = magnetState();
            resultLabelA.textContent = '붙은 클립';
            resultLabelB.textContent = '양 끝의 극';
            resultA.textContent = `${state.clips}개`;
            resultB.textContent = state.power ? `${state.leftPole} · ${state.rightPole}` : '없음';
            predictionResult.textContent = state.power
                ? '전지 방향을 바꾸면 세기는 그대로이고 두 극이 서로 바뀝니다.'
                : '전원을 끄자 전자석의 자성이 거의 사라졌습니다.';
            explanation.textContent = state.power
                ? `전지 ${state.batteries}개, 코일 ${state.turns}번에서 클립 ${state.clips}개가 붙습니다. 전지를 늘리면 더 세지고, 전지 방향을 바꾸면 ${state.leftPole}극과 ${state.rightPole}극의 위치가 바뀝니다.`
                : `전류가 흐르지 않아 클립이 붙지 않습니다.${comparePermanent ? ' 아래 영구자석은 전원 없이도 클립을 계속 끌어당깁니다.' : ' 영구자석과 비교 버튼을 눌러 차이를 확인해 보세요.'}`;
            stageCaption.textContent = state.power
                ? `전자석의 왼쪽은 ${state.leftPole}극, 오른쪽은 ${state.rightPole}극이고 클립 ${state.clips}개가 붙었습니다.`
                : '전원을 끄자 전자석에서 클립이 떨어졌습니다.';
            return;
        }
        const state = circuitState();
        playCircuit();
        resultLabelA.textContent = '회로 상태';
        resultLabelB.textContent = '전구 밝기';
        resultA.textContent = state.closed ? '이어짐' : '끊어짐';
        resultB.textContent = state.comparison;
        const baseline = state.closed && state.batteries === 1;
        const actual = state.closed ? 'brighter' : 'dimmer';
        delete predictionResult.dataset.correct;
        predictionResult.textContent=baseline?'전지 1개는 비교 기준입니다. 2개로 바꾼 뒤 예상을 확인하세요.':!prediction?'결과를 먼저 예상한 뒤 확인해 보세요.':prediction===actual?'예상이 맞았습니다.':'예상과 다른 결과입니다.';
        if(!baseline&&prediction)predictionResult.dataset.correct=String(prediction===actual);
        if (!state.closed) {
            explanation.textContent = '전선이 한 곳이라도 끊어지면 전류가 한 바퀴 돌아 전지로 되돌아갈 수 없어 전구가 켜지지 않습니다.';
            stageCaption.textContent = '전선 한 곳이 끊어져 있어 스위치를 닫아도 전구가 켜지지 않았습니다.';
        } else if (state.batteries === 1) {
            explanation.textContent = '전지, 전선, 전구가 끊어진 곳 없이 이어져 전구가 켜졌습니다. 이 밝기를 비교의 기준으로 삼습니다.';
            stageCaption.textContent = '전지 한 개를 연결한 회로에서 전구가 기준 밝기로 켜졌습니다.';
        } else {
            explanation.textContent = '전지 두 개를 같은 방향으로 직렬연결하면 전기 작용이 더 커져 전지 한 개일 때보다 전구가 밝아집니다.';
            stageCaption.textContent = '전지 두 개를 직렬연결하자 전구가 더 밝아졌습니다.';
        }
    }

    modeButtons.forEach(button => button.addEventListener('click', () => {
        mode = button.dataset.mode;
        resetPrediction();
        modeButtons.forEach(item => item.classList.toggle('selected', item === button));
        circuitControls.hidden = mode !== 'circuit';
        magnetControls.hidden = mode !== 'magnet';
        clearResult();
        stageCaption.textContent = mode === 'circuit'
            ? '전지 한 개와 두 개를 직렬로 연결했을 때의 밝기를 비교해 보세요.'
            : '전지 수와 방향을 바꾸고 전원을 꺼 보며 전자석의 성질을 관찰하세요.';
        render();
    }));
    circuitButtons.forEach(button => button.addEventListener('click', () => {
        if(circuitClosed !== (button.dataset.circuit === 'closed'))resetPrediction();
        circuitClosed = button.dataset.circuit === 'closed';
        circuitButtons.forEach(item => item.classList.toggle('selected', item === button));
        render(); clearResult();
    }));
    directionButtons.forEach(button => button.addEventListener('click', () => {
        magnetDirection = button.dataset.direction;
        directionButtons.forEach(item => item.classList.toggle('selected', item === button));
        render(); clearResult();
    }));
    circuitBatteryRange.addEventListener('input', () => {
        circuitBatteryOutput.textContent = `${circuitBatteryRange.value}개`;
        render(); clearResult();
    });
    [magnetBatteryRange, coilRange].forEach(element => element.addEventListener('input', () => {
        magnetBatteryOutput.textContent = `${magnetBatteryRange.value}개`;
        coilOutput.textContent = `${coilRange.value}번`;
        render(); clearResult();
    }));
    powerBtn.addEventListener('click', () => {
        magnetPower = !magnetPower;
        powerBtn.classList.toggle('active', !magnetPower);
        powerBtn.textContent = magnetPower ? '전원 끄기' : '전원 켜기';
        render(); clearResult();
    });
    compareBtn.addEventListener('click', () => {
        comparePermanent = !comparePermanent;
        compareBtn.classList.toggle('selected', comparePermanent);
        compareBtn.textContent = comparePermanent ? '비교 끝내기' : '영구자석 비교';
        render(); clearResult();
    });
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        clearResult();
        prediction = button.dataset.prediction;
        predictionButtons.forEach(item => {item.classList.toggle('selected', item === button);item.setAttribute('aria-pressed',String(item===button));});
    }));
    checkBtn.addEventListener('click', check);

    function shuffleQuizOptions(card) {
        const optionGroup = card.querySelector('.quiz-options');
        const options = Array.from(optionGroup.children);
        for (let index = options.length - 1; index > 0; index -= 1) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [options[index], options[randomIndex]] = [options[randomIndex], options[index]];
        }
        optionGroup.append(...options);
    }
    document.querySelectorAll('.quiz-card').forEach(card => {
        shuffleQuizOptions(card);
        const answerButton = card.querySelector('.answer-button');
        const answerResult = card.querySelector('.answer-result');
        const answerExplanation = card.querySelector('.answer-explanation');
        answerButton.addEventListener('click', () => {
            const selected = card.querySelector('input:checked');
            if (!selected) {
                delete card.dataset.state;
                answerResult.textContent = '답을 먼저 선택하세요.';
                return;
            }
            const correct = selected.value === card.dataset.answer;
            card.dataset.state = correct ? 'correct' : 'incorrect';
            answerResult.textContent = correct ? '맞았습니다.' : '다시 생각하고 다른 답을 골라보세요.';
            answerExplanation.hidden = !correct;
            if (!correct) { selected.checked = false; selected.disabled = true; }
        });
    });

    // 「실험 결과의 의미」 해설은 결과를 확인한 뒤에만 펼친다.
    (()=>{const m=document.querySelector('.meaning-panel');if(!m)return;const sync=()=>{m.style.display=resultContent.hidden?'none':'';};new MutationObserver(sync).observe(resultContent,{attributes:true,attributeFilter:['hidden']});sync();})();

    window.__circuitModel = {
        circuitState, magnetState,
        setMode(nextMode) { document.querySelector(`[data-mode="${nextMode}"]`).click(); },
        setCircuit(batteries, closed = true) {
            circuitBatteryRange.value = String(batteries);
            circuitBatteryOutput.textContent = `${batteries}개`;
            document.querySelector(`[data-circuit="${closed ? 'closed' : 'open'}"]`).click();
        },
        setMagnet(batteries, turns, direction = 'forward', power = true) {
            magnetBatteryRange.value = String(batteries);
            coilRange.value = String(turns);
            magnetBatteryOutput.textContent = `${batteries}개`;
            coilOutput.textContent = `${turns}번`;
            magnetDirection = direction;
            magnetPower = power;
            directionButtons.forEach(item => item.classList.toggle('selected', item.dataset.direction === direction));
            powerBtn.classList.toggle('active', !power);
            powerBtn.textContent = power ? '전원 끄기' : '전원 켜기';
            render(); clearResult();
        },
        setPermanentComparison(visible) { if (comparePermanent !== visible) compareBtn.click(); },
        state: () => ({ mode, circuitClosed, magnetDirection, magnetPower, comparePermanent }),
    };

    render();
    clearResult();
});
