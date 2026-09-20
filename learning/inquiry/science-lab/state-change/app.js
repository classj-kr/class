document.addEventListener('DOMContentLoaded', () => {
    const temperatureRange = document.getElementById('temperatureRange');
    const phaseRange = document.getElementById('phaseRange');
    const phaseControls = document.getElementById('phaseControls');
    const sample = () => window.SciencePhaseModel.sample(temperatureRange.value,phaseRange.value);
    const graphGroup = document.getElementById('graphGroup');
    const dataNote = document.getElementById('dataNote');
    const temperatureOutput = document.getElementById('temperatureOutput');
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const checkButton = document.getElementById('checkStateBtn');
    const resultEmpty = document.getElementById('resultEmpty');
    const resultContent = document.getElementById('resultContent');
    const resultTemp = document.getElementById('resultTemp');
    const resultState = document.getElementById('resultState');
    const predictionResult = document.getElementById('predictionResult');
    const explanation = document.getElementById('elementaryExplanation');
    const stageCaption = document.getElementById('stageCaption');
    const beaker = document.getElementById('beaker');
    const waterStopTop = document.getElementById('waterStopTop');
    const waterStopBottom = document.getElementById('waterStopBottom');
    const mercuryRect = document.getElementById('mercuryRect');
    const waterRect = document.getElementById('waterRect');
    const waterSurface = document.getElementById('waterSurface');
    const iceClipRect = document.getElementById('iceClipRect');
    const bubbleGroup = document.getElementById('bubbleGroup');

    let prediction = null;

    const STATE_LABEL = window.SciencePhaseModel.labels;
    function stateAt(temp) { return window.SciencePhaseModel.sample(temp,phaseRange.value).state; }

    function createBubbles() {
        const bounds = { xMin: 40, xMax: 200, yMin: 235, yMax: 292 };
        const count = 7;
        bubbleGroup.innerHTML = Array.from({ length: count }, () => {
            const cx = (bounds.xMin + Math.random() * (bounds.xMax - bounds.xMin)).toFixed(1);
            const cy = (bounds.yMin + Math.random() * (bounds.yMax - bounds.yMin)).toFixed(1);
            const r = (2 + Math.random() * 2.5).toFixed(1);
            const delay = (Math.random() * 1.6).toFixed(2);
            return `<circle cx="${cx}" cy="${cy}" r="${r}" style="--delay:${delay}s"></circle>`;
        }).join('');
    }

    function syncControls() {
        const temp = Number(temperatureRange.value);
        temperatureOutput.textContent = `${temp}℃`;

        // Mercury height maps across the slider's own -10..110 range, not a
        // fixed 0..100 assumption, so the column reflects relative position
        // even for the below-freezing and above-boiling ends.
        const span = 110 - -10;
        const mercuryHeight = 4 + ((temp - -10) / span) * 164;
        mercuryRect.setAttribute('y', String(180 - mercuryHeight));
        mercuryRect.setAttribute('height', String(mercuryHeight));

        const warmth = Math.max(0, Math.min(1, temp / 100));
        waterStopTop.setAttribute('stop-color', `rgb(${Math.round(110 + 70 * warmth)}, ${Math.round(200 - 15 * warmth)}, ${Math.round(235 - 25 * warmth)})`);
        waterStopBottom.setAttribute('stop-color', `rgb(${Math.round(60 + 50 * warmth)}, ${Math.round(150 - 15 * warmth)}, ${Math.round(195 - 35 * warmth)})`);

        const state = stateAt(temp);
        beaker.classList.remove('state-solid', 'state-liquid', 'state-gas', 'state-solid-liquid', 'state-liquid-gas');
        phaseControls.hidden = temp !== 0 && temp !== 100;
        document.getElementById('phaseLabel').textContent = temp === 0 ? '가열하여 녹인 비율' : '가열하여 기화시킨 비율';
        document.getElementById('phaseOutput').textContent = phaseRange.value + '%';
        beaker.classList.add(`state-${state}`);

        renderPhaseVisuals();
        renderHeatCurve(temp);
        renderData(temp, state);
    }

    /* ---------------------------------------------- 가열 곡선과 측정값 표 */
    /* 얼음 100 g을 일정한 세기(100 J/초)로 데울 때의 온도 변화입니다. 마디의
       길이는 실제 열량에서 그대로 나옵니다 — 녹는 데 33,400 J, 끓는 데
       226,000 J이 들기 때문에 끓는 구간이 압도적으로 길고, 그것이 이 그래프가
       보여 주려는 사실입니다. */
    const MASS_G = 100, POWER_W = 100;
    const C_ICE = 2.1, C_WATER = 4.2, C_STEAM = 2.0;   // J/(g·℃)
    const L_MELT = 334, L_BOIL = 2260;                 // J/g
    const T_LO = -10, T_HI = 110;
    const minutes = joules => joules / POWER_W / 60;
    const T1 = minutes(MASS_G * C_ICE * 10);
    const T2 = T1 + minutes(MASS_G * L_MELT);
    const T3 = T2 + minutes(MASS_G * C_WATER * 100);
    const T4 = T3 + minutes(MASS_G * L_BOIL);
    const T5 = T4 + minutes(MASS_G * C_STEAM * 10);

    // when a given temperature is first reached
    function timeAt(temp) { return window.SciencePhaseModel.sample(temp,phaseRange.value).time; }

    const G = { x0: 46, x1: 428, y0: 148, y1: 26 };
    const gx = t => G.x0 + (t / T5) * (G.x1 - G.x0);
    const gy = c => G.y0 - ((c - T_LO) / (T_HI - T_LO)) * (G.y0 - G.y1);

    function renderHeatCurve(temp) {
        let out = '';
        for (const c of [0, 50, 100]) {
            const y = gy(c);
            out += `<line class="grid-line" x1="${G.x0}" y1="${y.toFixed(1)}" x2="${G.x1}" y2="${y.toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${G.x0 - 6}" y="${(y + 3).toFixed(1)}" text-anchor="end">${c}</text>`;
        }
        for (const t of [0, 10, 20, 30, 40, 50]) {
            out += `<text class="axis-text" x="${gx(t).toFixed(1)}" y="${G.y0 + 15}" text-anchor="middle">${t}</text>`;
        }
        out += `<line class="axis" x1="${G.x0}" y1="${G.y0}" x2="${G.x1}" y2="${G.y0}"/>`;
        out += `<line class="axis" x1="${G.x0}" y1="${G.y0}" x2="${G.x0}" y2="${G.y1}"/>`;
        out += `<text class="axis-title" x="${(G.x0 + G.x1) / 2}" y="${G.y0 + 32}" text-anchor="middle">데운 시간 (분) — 얼음 100 g을 일정한 세기로</text>`;
        out += `<text class="axis-title" x="${G.x0}" y="${G.y1 - 8}">온도 (℃)</text>`;

        const pts = [[0, T_LO], [T1, 0], [T2, 0], [T3, 100], [T4, 100], [T5, T_HI]]
            .map(([t, c]) => `${gx(t).toFixed(1)},${gy(c).toFixed(1)}`);
        out += `<path class="heat-curve" d="M${pts.join('L')}"/>`;

        // the two places where heat goes in but the temperature does not move
        out += `<line class="flat-mark" x1="${gx(T1).toFixed(1)}" y1="${gy(0).toFixed(1)}" x2="${gx(T2).toFixed(1)}" y2="${gy(0).toFixed(1)}"/>`;
        out += `<line class="flat-mark" x1="${gx(T3).toFixed(1)}" y1="${gy(100).toFixed(1)}" x2="${gx(T4).toFixed(1)}" y2="${gy(100).toFixed(1)}"/>`;
        out += `<text class="flat-text" x="${gx((T1 + T2) / 2).toFixed(1)}" y="${(gy(0) - 15).toFixed(1)}" text-anchor="middle">얼음이 녹는 동안</text>`;
        out += `<text class="flat-text" x="${gx((T3 + T4) / 2).toFixed(1)}" y="${(gy(100) - 8).toFixed(1)}" text-anchor="middle">물이 끓는 동안 — 온도가 그대로입니다</text>`;

        const px = gx(timeAt(temp)), py = gy(temp);
        out += `<line class="op-guide" x1="${G.x0}" y1="${py.toFixed(1)}" x2="${px.toFixed(1)}" y2="${py.toFixed(1)}"/>`;
        out += `<circle class="op-point" cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="5"/>`;
        const flip = px > (G.x0 + G.x1) / 2;
        out += `<text class="op-text" x="${(px + (flip ? -9 : 9)).toFixed(1)}" y="${Math.max(G.y1 + 10, py - 9).toFixed(1)}"` +
               `${flip ? ' text-anchor="end"' : ''}>지금 ${temp}℃</text>`;
        graphGroup.innerHTML = out;
    }

    function renderData(temp, state) {
        const meltMin = T2 - T1, boilMin = T4 - T3;
        dataNote.innerHTML =
            `<div class="data-row"><span class="data-name">지금 온도</span><span class="data-val">${temp}℃</span></div>` +
            `<div class="data-row match"><span class="data-name">지금 상태</span><span class="data-val">${STATE_LABEL[state]}</span></div>` +
            `<div class="data-row"><span class="data-name">녹는점 · 어는점</span><span class="data-val">0℃ — 얼음과 물이 함께 있는 온도</span></div>` +
            `<div class="data-row"><span class="data-name">끓는점</span><span class="data-val">100℃ — 물과 수증기가 함께 있는 온도</span></div>` +
            `<div class="data-row"><span class="data-name">모형에서 녹는 시간</span><span class="data-val">${meltMin.toFixed(1)}분 (온도는 0℃ 그대로)</span></div>` +
            `<div class="data-row"><span class="data-name">모형에서 끓는 시간</span><span class="data-val">${boilMin.toFixed(1)}분 (온도는 100℃ 그대로)</span></div>` +
            `<div class="data-row"><span class="data-name">이 모형의 비교</span><span class="data-val">끓는 데 ${(boilMin / meltMin).toFixed(1)}배 더 오래 걸립니다</span></div>`;
    }

    function renderPhaseVisuals() {
        const a=sample(), bottom=300, scale=2.06;
        const liquidHeight=100*a.liquid*scale, iceHeight=100*a.ice/0.917*scale;
        const iceTop=bottom-liquidHeight-iceHeight;
        waterRect.setAttribute('y',String(bottom-liquidHeight));
        waterRect.setAttribute('height',String(liquidHeight));
        waterSurface.setAttribute('cy',String(bottom-liquidHeight));
        waterSurface.style.opacity=a.ice>0||a.liquid===0?'0':'1';
        iceClipRect.setAttribute('y',String(iceTop));
        iceClipRect.setAttribute('height',String(iceHeight));
        const ice=document.getElementById('iceRect');
        ice.setAttribute('y',String(iceTop));ice.setAttribute('height',String(iceHeight));
        document.getElementById('phaseSampleLabel').textContent=a.vapour===1?'수증기는 보이지 않음':a.label;
        beaker.dataset.phase=a.state;
    }

    function clearResult() {
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        stageCaption.textContent = '각 온도에서 별도 시료를 비교합니다. 0℃·100℃에서는 가열에 따른 변화 비율도 정하세요.';
    }

    function checkState() {
        const temp = Number(temperatureRange.value);
        const state = stateAt(temp);

        resultTemp.textContent = `${temp}℃`;
        resultState.textContent = STATE_LABEL[state];
        resultEmpty.hidden = true;
        resultContent.hidden = false;

        predictionResult.textContent = !prediction
            ? '다음에는 상태를 먼저 예상해 보세요.'
            : prediction === state ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';

        if (temp === 0) {
            stageCaption.textContent = '0℃는 물의 어는점(녹는점)입니다. 얼음과 물이 함께 있을 수 있는 온도입니다.';
            explanation.textContent = '녹는 동안에는 열을 받아도 온도가 0℃에 머무릅니다. 온도만으로 얼음과 물의 비율을 정할 수 없으며, 이 그림은 선택한 변화 비율을 나타냅니다.';
        } else if (temp === 100) {
            stageCaption.textContent = '100℃는 물의 끓는점입니다. 물이 기체(수증기)로 바뀌기 시작합니다.';
            explanation.textContent = '끓는 동안에는 열을 받아도 온도가 100℃에 머무릅니다. 물과 수증기가 함께 있을 수 있으며, 모두 기화한 뒤에 수증기의 온도가 더 올라갑니다. 비율은 온도만으로 결정되지 않습니다.';
        } else if (state === 'solid') {
            stageCaption.textContent = `${temp}℃에서 물은 고체인 얼음 상태입니다.`;
            explanation.textContent = '물은 얼어 단단한 얼음이 됩니다. 얼음은 액체인 물과 달리 담는 그릇에 따라 모양이 쉽게 달라지지 않습니다.';
        } else if (state === 'gas') {
            stageCaption.textContent = `${temp}℃에서 물은 기체인 수증기 상태입니다.`;
            explanation.textContent = '수증기는 눈에 보이지 않는 기체입니다. 끓는 물 위에서 보이는 흰 김은 작은 물방울입니다. 물은 끓지 않을 때에도 표면에서 수증기로 변할 수 있습니다.';
        } else {
            stageCaption.textContent = `${temp}℃에서 물은 액체 상태입니다.`;
            explanation.textContent = '0℃와 100℃ 사이에서 물은 흐르는 액체이며, 담는 그릇에 따라 모양이 바뀝니다.';
        }
    }

    temperatureRange.addEventListener('input', () => { phaseRange.value='50'; syncControls(); clearResult(); });
    phaseRange.addEventListener('input', () => { syncControls(); clearResult(); });
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    checkButton.addEventListener('click', checkState);

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
            answerResult.textContent = correct ? '맞았습니다.' : '다시 생각해 보세요.';
            answerExplanation.hidden = !correct;
            if (!correct) {
                selected.checked = false;
                selected.disabled = true;
                answerResult.textContent = '다시 생각하고 다른 답을 골라보세요.';
            }
        });
    });

    createBubbles();
    syncControls();
    clearResult();
    window.__phaseModel = {
        analyse:sample,check:checkState,render:syncControls,
        setTemperature(v){temperatureRange.value=String(v);temperatureRange.dispatchEvent(new Event('input'));},
        setProgress(v){phaseRange.value=String(v);phaseRange.dispatchEvent(new Event('input'));}
    };
});
