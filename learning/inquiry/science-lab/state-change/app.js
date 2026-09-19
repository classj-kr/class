document.addEventListener('DOMContentLoaded', () => {
    const temperatureRange = document.getElementById('temperatureRange');
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

    const STATE_LABEL = { solid: '고체 (얼음)', liquid: '액체 (물)', gas: '기체 (수증기)' };

    function stateAt(temp) {
        if (temp < 0) return 'solid';
        if (temp > 100) return 'gas';
        return 'liquid';
    }

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
        beaker.classList.remove('state-solid', 'state-liquid', 'state-gas');
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
    function timeAt(temp) {
        if (temp <= 0) return minutes(MASS_G * C_ICE * (temp - T_LO));
        if (temp <= 100) return T2 + minutes(MASS_G * C_WATER * temp);
        return T4 + minutes(MASS_G * C_STEAM * (temp - 100));
    }

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

    // Temperature sets the *rate* of freezing/boiling, not how much has
    // happened — -1℃ and -10℃ both end up fully frozen given enough time,
    // -10℃ just gets there faster. Same for boiling: 101℃ and 110℃ both
    // fully boil away eventually, 110℃ just does it sooner. iceFraction and
    // boilFraction are persistent accumulators advanced over real elapsed
    // time by tickPhaseChange(), not recomputed from the slider value.
    const BEAKER_BOTTOM = 300;
    const FULL_HEIGHT = 206;
    let iceFraction = 0;
    let boilFraction = 0;
    let lastTickTime = Date.now();

    // Rate constants (fraction per second, at 1℃ past the threshold) — sqrt
    // of the distance past the threshold, so going from -1℃ to -10℃ (10x
    // the distance) only makes freezing ~3x faster, not 10x: fast enough to
    // clearly read as "quicker" without snapping shut instantly. At -1℃,
    // rate = .1 * sqrt(1) = .1/s → ~10s to fully freeze. At -10℃, rate = .1 *
    // sqrt(10) ≈ .316/s → ~3.2s. Boiling/condensing mirrors freezing/melting:
    // above 100℃ the water boils away (faster the hotter it gets), and back
    // below 100℃ it returns (faster the further below 100℃), the same way
    // ice above 0℃ melts back. This is a simplified idealization — a real
    // open beaker's steam wouldn't return — but the tool is for repeatedly
    // dragging the slider back and forth, and a beaker left permanently
    // empty after one trip past 100℃ makes it impossible to re-run at any
    // other temperature, which defeats the tool's purpose.
    const FREEZE_RATE_K = .1;
    const MELT_RATE_K = .1;
    const BOIL_RATE_K = .1;
    const CONDENSE_RATE_K = .1;

    // At exactly the melting point (0℃) or boiling point (100℃), the two
    // phases are in dynamic equilibrium — not a fixed 50/50 split, but
    // continuously trading back and forth (some ice forms while some melts,
    // some liquid boils while some vapor condenses). A slow sine wave gives
    // an oscillating target that the fraction smoothly chases at a bounded
    // rate — never snapping, never settling flat — so parking exactly at
    // 0℃ or 100℃ visibly keeps freezing and thawing rather than sitting
    // static at whatever ratio it happened to arrive with.
    const COEXIST_PERIOD_MS = 9000;
    const COEXIST_BASE = .45;
    const COEXIST_AMPLITUDE = .22;
    const COEXIST_CHASE_RATE = .3;
    function coexistTarget(now) {
        return COEXIST_BASE + COEXIST_AMPLITUDE * Math.sin((now / COEXIST_PERIOD_MS) * 2 * Math.PI);
    }
    function chaseTarget(current, target, dt) {
        const delta = target - current;
        const maxStep = COEXIST_CHASE_RATE * dt;
        return current + (Math.abs(delta) < maxStep ? delta : Math.sign(delta) * maxStep);
    }

    function renderPhaseVisuals() {
        const waterHeight = FULL_HEIGHT * (1 - boilFraction);
        const waterY = BEAKER_BOTTOM - waterHeight;
        waterRect.setAttribute('y', String(waterY));
        waterRect.setAttribute('height', String(waterHeight));
        waterSurface.setAttribute('cy', String(waterY));
        // Freezing starts at the surface and works down — the clip's top
        // edge stays fixed at the water surface while its height grows.
        iceClipRect.setAttribute('height', String(FULL_HEIGHT * iceFraction));
    }

    function tickPhaseChange() {
        const now = Date.now();
        // Cap dt so a backgrounded/throttled tab doesn't "catch up" with one
        // huge jump the moment it's foregrounded again.
        const dt = Math.min(1, (now - lastTickTime) / 1000);
        lastTickTime = now;
        const temp = Number(temperatureRange.value);

        if (temp < 0) {
            iceFraction = Math.min(1, iceFraction + FREEZE_RATE_K * Math.sqrt(-temp) * dt);
        } else if (temp === 0) {
            iceFraction = chaseTarget(iceFraction, coexistTarget(now), dt);
        } else if (iceFraction > 0) {
            iceFraction = Math.max(0, iceFraction - MELT_RATE_K * Math.sqrt(temp) * dt);
        }

        if (temp > 100) {
            boilFraction = Math.min(1, boilFraction + BOIL_RATE_K * Math.sqrt(temp - 100) * dt);
        } else if (temp === 100) {
            boilFraction = chaseTarget(boilFraction, coexistTarget(now), dt);
        } else if (boilFraction > 0) {
            boilFraction = Math.max(0, boilFraction - CONDENSE_RATE_K * Math.sqrt(100 - temp) * dt);
        }

        renderPhaseVisuals();
        setTimeout(tickPhaseChange, 150);
    }

    function clearResult() {
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        stageCaption.textContent = '온도를 정해 물의 상태를 관찰하세요.';
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
            explanation.textContent = '이 온도에서는 얼음이 녹아 물이 되거나, 물이 얼어 얼음이 됩니다. 다 바뀔 때까지 온도는 0℃에 머무릅니다.';
        } else if (temp === 100) {
            stageCaption.textContent = '100℃는 물의 끓는점입니다. 물이 기체(수증기)로 바뀌기 시작합니다.';
            explanation.textContent = '끓는 동안에는 계속 열을 가해도 온도가 100℃에 머무르고, 그 열은 물을 기체로 바꾸는 데 쓰입니다.';
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

    temperatureRange.addEventListener('input', () => { syncControls(); clearResult(); });
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction;
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
    lastTickTime = Date.now();
    setTimeout(tickPhaseChange, 150);
});
