document.addEventListener('DOMContentLoaded', () => {
    const modeButtons = [...document.querySelectorAll('[data-mode]')];
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const heatControls = document.getElementById('heatControls');
    const expandControls = document.getElementById('expandControls');
    const massRange = document.getElementById('massRange');
    const timeRange = document.getElementById('timeRange');
    const deltaRange = document.getElementById('deltaRange');
    const massOutput = document.getElementById('massOutput');
    const timeOutput = document.getElementById('timeOutput');
    const deltaOutput = document.getElementById('deltaOutput');
    const playBtn = document.getElementById('playBtn');
    const resetBtn = document.getElementById('resetBtn');
    const resultEmpty = document.getElementById('resultEmpty');
    const resultContent = document.getElementById('resultContent');
    const labelA = document.getElementById('labelA');
    const labelB = document.getElementById('labelB');
    const valueA = document.getElementById('valueA');
    const valueB = document.getElementById('valueB');
    const predictionResult = document.getElementById('predictionResult');
    const explanation = document.getElementById('elementaryExplanation');
    const stageCaption = document.getElementById('stageCaption');
    const stageBadge = document.getElementById('stageBadge');
    const mainGroup = document.getElementById('mainGroup');
    const graphGroup = document.getElementById('graphGroup');
    const dataNote = document.getElementById('dataNote');

    // Real specific heats in J/(g·°C).
    // The boil cap is a guard only: within this experiment's ranges water needs
    // over 167 s to reach 100 °C while the slider stops at 60, so it is never
    // actually hit. The explanation below therefore does not promise boiling.
    const SUBS = [
        { id: 'water', name: '물',       c: 4.18, color: '#6ec8eb', boil: 100, solid: false },
        { id: 'oil',   name: '식용유',   c: 2.00, color: '#e8d07a', boil: null, solid: false },
        { id: 'alum',  name: '알루미늄', c: 0.90, color: '#cfd8dd', boil: null, solid: true },
        { id: 'iron',  name: '철',       c: 0.45, color: '#9aa4ab', boil: null, solid: true },
    ];
    // Real linear expansion coefficients, per °C.
    const METALS = [
        { id: 'alum',   name: '알루미늄', alpha: 23e-6, color: '#cfd8dd' },
        { id: 'copper', name: '구리',     alpha: 17e-6, color: '#d98a4a' },
        { id: 'iron',   name: '철',       alpha: 12e-6, color: '#9aa4ab' },
    ];

    const POWER = 200;          // W, the same burner under all four
    const T0 = 20;              // °C
    const MAX_TIME = 60;        // s
    const L0_MM = 1000;
    // 240 px stands for the 1000 mm rod. Sized so the metal names on the left
    // and the "+2.30 mm" readouts on the right both stay inside the canvas at
    // the maximum temperature rise.
    const PX_PER_MM = 0.24;
    const EXAGGERATION = 100;   // real ΔL is ~2 mm, invisible at true scale
    const SIM_PER_SEC = 10;     // simulated seconds per real second

    const GRAPH = { x0: 52, x1: 432, y0: 152, y1: 20 };
    const NICE = [60, 80, 100, 150, 200, 300, 400, 600];

    let mode = 'heat';
    let prediction = null;
    let playing = false;
    let animTime = null;        // float clock; the slider only reports it
    let rafId = null, lastT = null;

    const mass = () => Number(massRange.value);
    const elapsed = () => (animTime === null ? Number(timeRange.value) : animTime);
    const deltaT = () => Number(deltaRange.value);

    // Q = c m ΔT, so heating at constant power gives ΔT = P t / (c m). Water
    // stops at its boiling point because further heat goes into vaporising it
    // instead of raising the temperature.
    function tempOf(sub, t, m) {
        const rise = (POWER * t) / (sub.c * m);
        const raw = T0 + rise;
        return sub.boil !== null ? Math.min(sub.boil, raw) : raw;
    }
    const expansionMM = (metal, dT) => metal.alpha * L0_MM * dT;

    // A fixed scale for the whole run, taken from the hottest the fastest
    // substance can get, so the axis does not jump while time advances.
    function tempScaleMax() {
        const hottest = Math.max(...SUBS.map(s => tempOf(s, MAX_TIME, mass())));
        return NICE.find(n => n >= hottest * 1.02) ?? Math.ceil(hottest / 100) * 100;
    }

    const gx = (v, vMax) => GRAPH.x0 + (v / vMax) * (GRAPH.x1 - GRAPH.x0);
    const gy = (v, vMax) => GRAPH.y0 - (v / vMax) * (GRAPH.y0 - GRAPH.y1);

    function renderHeat() {
        const t = elapsed(), m = mass(), tMax = tempScaleMax();
        let out = '';
        const slotW = 104, x0 = 26;
        SUBS.forEach((s, i) => {
            const cx = x0 + i * slotW + slotW / 2;
            const temp = tempOf(s, t, m);
            const frac = Math.max(0, Math.min(1, (temp - 0) / tMax));
            // vessel
            out += `<path class="vessel" d="M${cx - 30},58 L${cx - 30},146 Q${cx - 30},166 ${cx - 10},166 L${cx + 10},166 Q${cx + 30},166 ${cx + 30},146 L${cx + 30},58" fill="none"/>`;
            if (s.solid) {
                // A metal is a block resting in the container, not something
                // that fills it to a level the way a liquid does.
                out += `<rect class="substance solid-block" x="${cx - 21}" y="118" width="42" height="44" rx="4" fill="${s.color}" opacity="0.85"/>`;
                out += `<line class="block-edge" x1="${cx - 21}" y1="128" x2="${cx + 21}" y2="128"/>`;
                out += `<line class="block-edge" x1="${cx - 21}" y1="146" x2="${cx + 21}" y2="146"/>`;
            } else {
                out += `<rect class="substance" x="${cx - 28}" y="96" width="56" height="68" rx="3" fill="${s.color}" opacity="0.55"/>`;
                out += `<ellipse class="liquid-surface" cx="${cx}" cy="96" rx="28" ry="4"/>`;
            }
            // thermometer standing in it
            out += `<rect class="therm-tube" x="${cx + 12}" y="40" width="10" height="104" rx="5"/>`;
            out += `<rect class="therm-fill" x="${cx + 14}" y="${(142 - 100 * frac).toFixed(1)}" width="6" height="${(100 * frac + 2).toFixed(1)}" rx="3"/>`;
            out += `<text class="temp-text" fill="${temp >= 99.5 && s.boil ? '#d97706' : '#dc2626'}" x="${cx - 8}" y="${34}" text-anchor="middle">${temp.toFixed(1)} ℃</text>`;
            out += `<text class="sub-name" x="${cx}" y="188" text-anchor="middle">${s.name}</text>`;
            out += `<text class="sub-c" x="${cx}" y="201" text-anchor="middle">비열 ${s.c.toFixed(2)}</text>`;
            if (s.boil && temp >= s.boil - 0.05) {
                out += `<text class="boil-mark" x="${cx}" y="214" text-anchor="middle">끓기 시작</text>`;
            }
        });
        // one burner under all four
        out += `<rect class="burner" x="34" y="222" width="392" height="10" rx="4"/>`;
        if (t > 0) {
            for (let i = 0; i < 4; i += 1) {
                const fx = x0 + i * slotW + slotW / 2;
                out += `<g class="flame"><path class="flame-outer" d="M${fx},220 C${fx - 12},208 ${fx - 9},198 ${fx},188 C${fx + 9},198 ${fx + 12},208 ${fx},220 Z"/>` +
                       `<path class="flame-inner" d="M${fx},216 C${fx - 6},207 ${fx - 4},200 ${fx},194 C${fx + 4},200 ${fx + 6},207 ${fx},216 Z"/></g>`;
            }
        }
        out += `<text class="sub-c" x="230" y="245" text-anchor="middle">가열기 ${POWER} W · 각 ${m} g · ${t.toFixed(1)} 초</text>`;
        mainGroup.innerHTML = out;

        // temperature against time, one line per substance
        let g = '';
        for (let k = 0; k <= 4; k += 1) {
            const y = GRAPH.y0 - (k / 4) * (GRAPH.y0 - GRAPH.y1);
            g += `<line class="grid-line" x1="${GRAPH.x0}" y1="${y}" x2="${GRAPH.x1}" y2="${y}"/>`;
            g += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${y + 3}" text-anchor="end">${Math.round((tMax * k) / 4)}</text>`;
        }
        for (let s = 0; s <= MAX_TIME; s += 15) {
            g += `<text class="axis-text" x="${gx(s, MAX_TIME)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${s}</text>`;
        }
        g += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        g += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        g += `<text class="axis-title" x="${(GRAPH.x0 + GRAPH.x1) / 2}" y="${GRAPH.y0 + 30}" text-anchor="middle">가열 시간 (초)</text>`;
        g += `<text class="axis-title" x="${GRAPH.x0}" y="${GRAPH.y1 - 4}">온도 (℃)</text>`;
        if (tMax > 100) {
            g += `<line class="boil-line" x1="${GRAPH.x0}" y1="${gy(100, tMax)}" x2="${GRAPH.x1}" y2="${gy(100, tMax)}"/>`;
            // label sits inside the plot: placed past x1 it ran off the canvas
            g += `<text class="axis-text" x="${GRAPH.x1 - 4}" y="${gy(100, tMax) - 5}" style="fill:#d97706" text-anchor="end">물의 끓는점 100℃</text>`;
        }
        SUBS.forEach(s => {
            const pts = [];
            for (let k = 0; k <= 60; k += 1) {
                const tt = (MAX_TIME * k) / 60;
                pts.push(`${gx(tt, MAX_TIME).toFixed(1)},${gy(tempOf(s, tt, m), tMax).toFixed(1)}`);
            }
            g += `<path class="t-line" style="stroke:${s.color}" d="M${pts.join('L')}"/>`;
            const cxp = gx(t, MAX_TIME), cyp = gy(tempOf(s, t, m), tMax);
            g += `<circle class="t-dot" cx="${cxp.toFixed(1)}" cy="${cyp.toFixed(1)}" r="4" fill="${s.color}"/>`;
        });
        graphGroup.innerHTML = g;

        dataNote.innerHTML =
            `<div class="data-row head"><span>물질</span><span>온도</span><span>비열 (J/g·℃)</span></div>` +
            SUBS.map(s => `<div class="data-row"><span class="data-name">${s.name}</span>` +
                `<span class="data-val">${tempOf(s, t, m).toFixed(1)} ℃</span>` +
                `<span class="data-extra">${s.c.toFixed(2)}</span></div>`).join('');

        stageBadge.textContent = `${t.toFixed(1)} 초`;
        timeOutput.textContent = `${t.toFixed(t % 1 ? 1 : 0)} 초`;
        massOutput.textContent = `${m} g`;
    }

    function renderExpand() {
        const dT = deltaT();
        let out = '';
        const rodLenPx = L0_MM * PX_PER_MM;
        const x0 = 76;              // leaves room for the right-aligned metal names
        METALS.forEach((mt, i) => {
            const y = 56 + i * 58;
            const dl = expansionMM(mt, dT);
            const extPx = dl * PX_PER_MM * EXAGGERATION;
            out += `<rect class="rod-base" x="${x0}" y="${y - 9}" width="${rodLenPx}" height="18" rx="4" fill="${mt.color}"/>`;
            out += `<rect class="rod-ext" x="${x0 + rodLenPx}" y="${y - 9}" width="${extPx.toFixed(2)}" height="18" rx="2"/>`;
            out += `<text class="rod-name" x="${x0 - 6}" y="${y + 4}" text-anchor="end">${mt.name}</text>`;
            out += `<text class="rod-value" x="${x0 + rodLenPx + extPx + 8}" y="${y + 4}">+${dl.toFixed(2)} mm</text>`;
        });
        // the wall the rods push against, marking the original 1000 mm end
        out += `<rect class="rod-wall" x="${x0 + rodLenPx}" y="30" width="3" height="${58 * METALS.length}" rx="1"/>`;
        out += `<text class="sub-c" x="${x0 + rodLenPx}" y="24" text-anchor="middle">원래 길이 1000 mm</text>`;
        out += `<text class="scale-badge" x="230" y="240" text-anchor="middle">늘어난 부분은 ${EXAGGERATION}배 확대해 그렸습니다 (실제로는 2 mm 남짓)</text>`;
        mainGroup.innerHTML = out;

        // ΔL against ΔT: a straight line per metal, slope α·L0
        const dlMax = Math.max(...METALS.map(mt => expansionMM(mt, 100))) * 1.1;
        let g = '';
        for (let k = 0; k <= 4; k += 1) {
            const y = GRAPH.y0 - (k / 4) * (GRAPH.y0 - GRAPH.y1);
            g += `<line class="grid-line" x1="${GRAPH.x0}" y1="${y}" x2="${GRAPH.x1}" y2="${y}"/>`;
            g += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${y + 3}" text-anchor="end">${((dlMax * k) / 4).toFixed(1)}</text>`;
        }
        for (let s = 0; s <= 100; s += 25) {
            g += `<text class="axis-text" x="${gx(s, 100)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${s}</text>`;
        }
        g += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        g += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        g += `<text class="axis-title" x="${(GRAPH.x0 + GRAPH.x1) / 2}" y="${GRAPH.y0 + 30}" text-anchor="middle">온도 상승 (℃)</text>`;
        g += `<text class="axis-title" x="${GRAPH.x0}" y="${GRAPH.y1 - 4}">늘어난 길이 (mm)</text>`;
        METALS.forEach(mt => {
            g += `<path class="t-line" style="stroke:${mt.color}" d="M${gx(0, 100)},${gy(0, dlMax)} L${gx(100, 100)},${gy(expansionMM(mt, 100), dlMax).toFixed(1)}"/>`;
            g += `<circle class="t-dot" cx="${gx(dT, 100).toFixed(1)}" cy="${gy(expansionMM(mt, dT), dlMax).toFixed(1)}" r="4" fill="${mt.color}"/>`;
        });
        graphGroup.innerHTML = g;

        dataNote.innerHTML =
            `<div class="data-row head"><span>금속</span><span>늘어난 길이</span><span>팽창 계수 (1/℃)</span></div>` +
            METALS.map(mt => `<div class="data-row"><span class="data-name">${mt.name}</span>` +
                `<span class="data-val">${expansionMM(mt, dT).toFixed(2)} mm</span>` +
                `<span class="data-extra">${(mt.alpha * 1e6).toFixed(0)} × 10⁻⁶</span></div>`).join('');

        stageBadge.textContent = `+${dT} ℃`;
        deltaOutput.textContent = `${dT} ℃`;
    }

    const render = () => (mode === 'heat' ? renderHeat() : renderExpand());

    function frame(now) {
        const t = now / 1000;
        const dt = lastT === null ? 1 / 60 : Math.min(1 / 20, t - lastT);
        lastT = t;
        if (playing) {
            animTime = Math.min(MAX_TIME, animTime + dt * SIM_PER_SEC);
            timeRange.value = String(Math.round(animTime));
            render();
            if (animTime >= MAX_TIME) { playing = false; playBtn.textContent = '가열 시작'; }
            rafId = playing ? requestAnimationFrame(frame) : null;
            if (!playing) lastT = null;
        } else { rafId = null; lastT = null; }
    }

    function showResult() {
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        if (mode === 'heat') {
            const t = elapsed(), m = mass();
            const ranked = [...SUBS].sort((a, b) => tempOf(b, t, m) - tempOf(a, t, m));
            labelA.textContent = '가장 뜨거운 물질';
            labelB.textContent = '가장 덜 오른 물질';
            valueA.textContent = `${ranked[0].name} ${tempOf(ranked[0], t, m).toFixed(1)} ℃`;
            valueB.textContent = `${ranked[ranked.length - 1].name} ${tempOf(ranked[ranked.length - 1], t, m).toFixed(1)} ℃`;
            const actual = ranked[0].id === 'water' ? 'water' : 'iron';
            predictionResult.textContent = !prediction
                ? '다음에는 결과를 먼저 예상해 보세요.'
                : prediction === actual ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
            const rise = (s) => (tempOf(s, t, m) - T0);
            explanation.textContent =
                `ΔT = Q / (c m) 이므로 같은 열을 주면 비열이 작은 물질의 온도가 많이 오릅니다. ` +
                `철(비열 0.45)은 물(비열 4.18)보다 비열이 약 ${(4.18 / 0.45).toFixed(1)}배 작아, 온도 상승도 정확히 그 배수만큼 큽니다` +
                (t > 0 ? ` — 지금 물은 ${rise(SUBS[0]).toFixed(1)} ℃, 철은 ${rise(SUBS[3]).toFixed(1)} ℃ 올랐습니다.` : `.`) +
                ` 질량을 2배로 하면 같은 열로도 온도 상승은 절반이 됩니다.`;
        } else {
            const dT = deltaT();
            const ranked = [...METALS].sort((a, b) => b.alpha - a.alpha);
            labelA.textContent = '가장 많이 늘어난 금속';
            labelB.textContent = '가장 적게 늘어난 금속';
            valueA.textContent = `${ranked[0].name} +${expansionMM(ranked[0], dT).toFixed(2)} mm`;
            valueB.textContent = `${ranked[2].name} +${expansionMM(ranked[2], dT).toFixed(2)} mm`;
            predictionResult.textContent = '팽창 계수가 큰 금속이 더 많이 늘어납니다.';
            explanation.textContent =
                `ΔL = α L₀ ΔT 이므로 늘어난 길이는 팽창 계수와 온도 상승에 함께 비례합니다. ` +
                `1000 mm 막대를 ${dT} ℃ 올리면 알루미늄은 ${expansionMM(METALS[0], dT).toFixed(2)} mm, 철은 ${expansionMM(METALS[2], dT).toFixed(2)} mm 늘어납니다. ` +
                `실제 변화는 몇 mm 정도라 화면에서는 ${EXAGGERATION}배 확대해 그렸습니다.`;
        }
    }

    playBtn.addEventListener('click', () => {
        if (mode === 'expand') { showResult(); return; }
        playing = !playing;
        playBtn.textContent = playing ? '가열 멈춤' : '가열 시작';
        if (playing) {
            animTime = Number(timeRange.value);
            if (animTime >= MAX_TIME) animTime = 0;
            showResult();
            stageCaption.textContent = '같은 열을 주는데도 비열이 작은 물질부터 빠르게 뜨거워집니다.';
            if (rafId === null) { lastT = null; rafId = requestAnimationFrame(frame); }
        } else {
            timeRange.value = String(Math.round(elapsed()));
            animTime = null;
            render();
        }
    });

    resetBtn.addEventListener('click', () => {
        playing = false;
        animTime = null;
        if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; lastT = null; }
        playBtn.textContent = mode === 'heat' ? '가열 시작' : '결과 확인하기';
        timeRange.value = '0';
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        stageCaption.textContent = mode === 'heat'
            ? '같은 열을 주어도 물질에 따라 온도가 다르게 오릅니다.'
            : '온도를 올리며 금속마다 늘어나는 길이를 비교해 보세요.';
        render();
    });

    modeButtons.forEach(button => button.addEventListener('click', () => {
        mode = button.dataset.mode;
        modeButtons.forEach(item => item.classList.toggle('selected', item === button));
        heatControls.hidden = mode !== 'heat';
        expandControls.hidden = mode !== 'expand';
        resetBtn.click();
    }));
    [massRange, timeRange].forEach(el => el.addEventListener('input', () => {
        animTime = null; render();
        if (!resultContent.hidden) showResult();
    }));
    deltaRange.addEventListener('input', () => {
        render();
        if (!resultContent.hidden) showResult();
    });
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));

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

    window.__heat2Model = {
        SUBS, METALS, POWER, T0, MAX_TIME, L0_MM, EXAGGERATION, PX_PER_MM,
        tempOf, expansionMM, tempScaleMax,
        setMode(m) { document.querySelector(`[data-mode="${m}"]`).click(); },
        setMass(v) { massRange.value = String(v); animTime = null; render(); },
        setTime(v) { animTime = null; timeRange.value = String(v); render(); },
        setDelta(v) { deltaRange.value = String(v); render(); },
        stepFrame(dt) { animTime = Math.min(MAX_TIME, (animTime ?? Number(timeRange.value)) + dt * SIM_PER_SEC); render(); },
        elapsed, mass, deltaT, render,
    };

    resetBtn.click();
});
