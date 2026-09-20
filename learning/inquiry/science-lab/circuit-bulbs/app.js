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

    function renderCircuit() {
        const state = circuitState(), pack = batterySVG(230,210,state.batteries);
        circuitGroup.ownerSVGElement.setAttribute('viewBox','0 0 460 300');
        const path = `M${pack.left},210 H64 V64 H212 M248,64 H396 V210 H354 M316,210 H${pack.right}`;
        let out = `<path class="wire${state.closed?'':' dead'}" d="${path}"/>`;
        if(state.closed) out += `<path class="current" d="${path}"/><path class="switch-blade closed" d="M316,210 H354"/>`;
        else out += '<path class="switch-blade" d="M316,210 L348,184"/>';
        out += '<circle class="switch-contact" cx="316" cy="210" r="3"/><circle class="switch-contact" cx="354" cy="210" r="3"/>';
        out += pack.svg + bulbSVG(230,64,state.lit,state.brightness);
        out += '<path class="bulb-leads" d="M212,64 H221 L223,67 M237,61 L239,64 H248"/>';
        out += `<text class="stage-label" x="230" y="116" text-anchor="middle">${state.lit?state.comparison:'꺼짐'}</text><text class="stage-label" x="335" y="251" text-anchor="middle">${state.closed?'스위치 닫힘':'스위치 열림'}</text><text class="battery-label" x="230" y="280" text-anchor="middle">전지 ${state.batteries}개 · ${state.batteries===2?'같은 방향 직렬연결':'비교 기준'}</text>`;
        circuitGroup.innerHTML = out;
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
            stageCaption.textContent=!state.closed?'회로가 끊어져 전지 수와 관계없이 전구가 꺼집니다.':state.batteries===1?'전지 1개가 비교 기준입니다. 예상한 뒤 전지를 2개로 바꾸어 확인하세요.':'전지 두 개를 같은 방향으로 직렬연결한 결과입니다. 한 개일 때보다 밝습니다.';
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
            stageCaption.textContent = '스위치가 열려 회로가 끊어졌으므로 전구가 꺼졌습니다.';
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
