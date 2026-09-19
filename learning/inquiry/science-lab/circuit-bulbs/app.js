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

    const batterySVG = (x, y, count = 1, direction = 'forward') => {
        let out = '';
        for (let index = 0; index < count; index += 1) {
            const bx = x + index * 34;
            out += `<rect class="battery-body" x="${bx - 13}" y="${y - 12}" width="26" height="24" rx="4"/>` +
                `<rect class="battery-cap" x="${bx - 3}" y="${y - 17}" width="6" height="5" rx="1"/>` +
                `<text class="battery-sign" x="${bx}" y="${y + 4}" text-anchor="middle">${direction === 'forward' ? '+' : '−'}</text>`;
        }
        return out;
    };

    function renderCircuit() {
        const state = circuitState();
        const left = 74, right = 390, top = 72, bottom = 226;
        const switchLeft = 175, switchRight = 225;
        const fullLoop = `M${left},138 L${left},${top} L${right},${top} L${right},${bottom} L${left},${bottom} L${left},162`;
        let out = `<path class="wire${state.closed ? '' : ' dead'}" d="${fullLoop}"/>`;
        if (state.closed) {
            out += `<path class="current" d="${fullLoop}" style="animation-duration:${state.batteries === 2 ? '.58s' : '1s'}"/>`;
            out += `<line class="switch-blade closed" x1="${switchLeft}" y1="${bottom}" x2="${switchRight}" y2="${bottom}"/>`;
        } else {
            out += `<rect class="stage-mask" x="${switchLeft - 6}" y="${bottom - 9}" width="${switchRight - switchLeft + 12}" height="18"/>`;
            out += `<circle class="switch-contact" cx="${switchLeft}" cy="${bottom}" r="4"/>`;
            out += `<circle class="switch-contact" cx="${switchRight}" cy="${bottom}" r="4"/>`;
            out += `<line class="switch-blade" x1="${switchLeft}" y1="${bottom - 3}" x2="${switchRight - 7}" y2="${bottom - 28}"/>`;
        }
        out += batterySVG(left, 150, state.batteries);
        out += `<text class="battery-label" x="${left + (state.batteries - 1) * 17}" y="190" text-anchor="middle">전지 ${state.batteries}개 직렬연결</text>`;
        out += bulbSVG(285, top, state.lit, state.brightness);
        out += `<text class="stage-label" x="285" y="120" text-anchor="middle">${state.lit ? state.comparison : '불이 켜지지 않음'}</text>`;
        out += `<text class="stage-label" x="230" y="266" text-anchor="middle">${state.closed ? '끊어진 곳 없이 이어진 회로' : '스위치가 열려 끊어진 회로'}</text>`;
        circuitGroup.innerHTML = out;
    }

    function poleLabel(x, y, pole, active) {
        const className = !active ? 'pole-label off' : pole === 'N' ? 'pole-label north' : 'pole-label south';
        return `<g><circle class="${className}" cx="${x}" cy="${y}" r="15"/><text class="pole-text" x="${x}" y="${y + 5}" text-anchor="middle">${pole}</text></g>`;
    }

    function renderMagnet() {
        const state = magnetState();
        const coreX = 170, coreY = comparePermanent ? 92 : 132, coreW = 155, coreH = 26;
        let out = batterySVG(55, 236, state.batteries, state.direction);
        out += `<text class="battery-label" x="${55 + (state.batteries - 1) * 17}" y="272" text-anchor="middle">${state.direction === 'forward' ? '＋ → −' : '− → ＋'}</text>`;
        const lead = `M55,219 L55,${coreY} L${coreX - 18},${coreY}`;
        const returnX = 55 + (state.batteries - 1) * 34;
        const ret = `M${returnX},248 L${returnX},286 L${coreX + coreW + 18},286 L${coreX + coreW + 18},${coreY + 18}`;
        out += `<path class="wire${state.power ? '' : ' dead'}" d="${lead}"/><path class="wire${state.power ? '' : ' dead'}" d="${ret}"/>`;
        if (state.power) {
            const duration = (1 / state.batteries).toFixed(2);
            out += `<path class="current" d="${lead}" style="animation-duration:${duration}s"/>`;
            out += `<path class="current" d="${ret}" style="animation-duration:${duration}s"/>`;
        }
        out += `<rect class="core${state.power ? '' : ' off'}" x="${coreX}" y="${coreY - coreH / 2}" width="${coreW}" height="${coreH}" rx="5"/>`;
        const loops = Math.round(state.turns / 16);
        for (let index = 0; index < loops; index += 1) {
            const x = coreX + 8 + (index * (coreW - 16)) / Math.max(1, loops - 1);
            out += `<path class="coil${state.power ? '' : ' off'}" d="M${x.toFixed(1)},${coreY - coreH / 2 - 7} Q${(x + 7).toFixed(1)},${coreY} ${x.toFixed(1)},${coreY + coreH / 2 + 7}"/>`;
        }
        out += poleLabel(coreX - 22, coreY, state.leftPole, state.power);
        out += poleLabel(coreX + coreW + 22, coreY, state.rightPole, state.power);
        out += `<text class="stage-label" x="${coreX + coreW / 2}" y="${coreY - 35}" text-anchor="middle">전자석 · 코일 ${state.turns}번</text>`;
        for (let index = 0; index < state.clips; index += 1) {
            const x = coreX + coreW + 45 + (index % 4) * 12;
            const y = coreY - 14 + Math.floor(index / 4) * 12;
            out += `<rect class="clip" x="${x}" y="${y}" width="8" height="5" rx="2"/>`;
        }
        out += `<text class="stage-label" x="390" y="${coreY + 50}" text-anchor="middle">클립 ${state.clips}개</text>`;
        if (comparePermanent) {
            const y = 205;
            out += `<text class="stage-label" x="${coreX + coreW / 2}" y="174" text-anchor="middle">영구자석 · 전원 없이도 자성 유지</text>`;
            out += `<rect class="permanent north" x="${coreX}" y="${y - 13}" width="${coreW / 2}" height="26" rx="5"/>`;
            out += `<rect class="permanent south" x="${coreX + coreW / 2}" y="${y - 13}" width="${coreW / 2}" height="26" rx="5"/>`;
            out += poleLabel(coreX - 22, y, 'N', true) + poleLabel(coreX + coreW + 22, y, 'S', true);
            for (let index = 0; index < 6; index += 1) {
                const x = coreX + coreW + 45 + (index % 3) * 12;
                const cy = y - 8 + Math.floor(index / 3) * 12;
                out += `<rect class="clip" x="${x}" y="${cy}" width="8" height="5" rx="2"/>`;
            }
        }
        circuitGroup.innerHTML = out;
    }

    function render() {
        if (mode === 'circuit') {
            const state = circuitState();
            renderCircuit();
            stageBadge.textContent = `전지 ${state.batteries}개 · ${state.closed ? '이어짐' : '끊어짐'}`;
        } else {
            const state = magnetState();
            renderMagnet();
            stageBadge.textContent = `${state.power ? `${state.leftPole}극–${state.rightPole}극` : '전원 꺼짐'} · 전지 ${state.batteries}개`;
        }
    }

    function clearResult() {
        resultEmpty.hidden = false;
        resultContent.hidden = true;
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
        const actual = state.batteries === 2 && state.closed ? 'brighter' : state.batteries === 1 && state.closed ? 'same' : 'dimmer';
        predictionResult.textContent = !prediction
            ? '다음에는 결과를 먼저 예상해 보세요.'
            : prediction === actual ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
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
        compareBtn.textContent = comparePermanent ? '영구자석 숨기기' : '영구자석과 비교';
        render(); clearResult();
    });
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction;
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
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
