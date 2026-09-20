document.addEventListener('DOMContentLoaded', () => {
    const materialButtons = [...document.querySelectorAll('[data-material]')];
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const heatButton = document.getElementById('heatBtn');
    const resetButton = document.getElementById('resetBtn');
    const resultEmpty = document.getElementById('resultEmpty');
    const resultContent = document.getElementById('resultContent');
    const resultEndTemp = document.getElementById('resultEndTemp');
    const resultBeads = document.getElementById('resultBeads');
    const predictionResult = document.getElementById('predictionResult');
    const explanation = document.getElementById('elementaryExplanation');
    const stageCaption = document.getElementById('stageCaption');
    const materialBadge = document.getElementById('materialBadge');
    const rodGrad = document.getElementById('rodGrad');
    const probeGroup = document.getElementById('probeGroup');
    const beadGroup = document.getElementById('beadGroup');
    const flame = document.getElementById('flame');

    // Real thermal diffusivities in mm²/s. These are not tuned for looks — the
    // reason copper races ahead of iron and glass barely moves is the same
    // reason it happens on a real bench.
    const MATERIALS = {
        copper:   { label: '구리',     alpha: 111 },
        aluminum: { label: '알루미늄', alpha: 97 },
        iron:     { label: '철',       alpha: 23 },
        glass:    { label: '유리',     alpha: 0.34 },
    };
    const REFERENCE = 'iron';

    // "은/는" depends on whether the last syllable has a final consonant —
    // 구리는 vs 철은. The material name is interpolated into the sentences
    // below, so this can't be a fixed string.
    function topicParticle(word) {
        const code = word.charCodeAt(word.length - 1);
        if (code < 0xac00 || code > 0xd7a3) return '는';
        return (code - 0xac00) % 28 === 0 ? '는' : '은';
    }

    const ROD_CM = 30;
    const N = 61;                       // nodes, so 60 intervals over 30 cm
    const DX_MM = (ROD_CM * 10) / (N - 1);
    const T_AMBIENT = 20, T_FLAME = 100, BEAD_MELT = 60;
    const DT_SIM = 0.05;                // simulated seconds per solver step
    // One acceleration factor for every material, so the ratios between them
    // stay exactly physical even though the clock is sped up. Chosen so the
    // beads on copper fall about 0.25 s apart rather than all at once: the
    // order they fall in is the point of the experiment, and at 400x the whole
    // copper sequence finished inside 0.75 s with nothing to see.
    const SPEED = 100;
    const MAX_STEPS_PER_FRAME = 260;

    const ROD_X0 = 60, ROD_X1 = 420, ROD_TOP = 120, ROD_BOTTOM = 146;
    const BEAD_CM = [5, 12, 19, 26];
    const PROBE_CM = [5, 15, 25];
    const FALL_ACCEL = 571;             // units/s², shaped like free fall

    let material = 'iron';
    let prediction = null;
    let temps = new Float64Array(N).fill(T_AMBIENT);
    let heating = false;
    let simTime = 0;
    let displayTime = 0;
    let beadFallAt = BEAD_CM.map(() => null);   // display-time each bead released
    let rafId = null, lastT = null;

    const cmToX = cm => ROD_X0 + (cm / ROD_CM) * (ROD_X1 - ROD_X0);
    const cmToNode = cm => Math.round((cm / ROD_CM) * (N - 1));

    // Heat equation, explicit finite difference:
    //   T_i' = T_i + r (T_{i+1} - 2 T_i + T_{i-1}),  r = α Δt / Δx²
    // The heated end is held at the flame temperature; the far end is
    // insulated (mirror node), so heat can only arrive by travelling along
    // the rod rather than appearing there on its own.
    function solverStep() {
        const alpha = MATERIALS[material].alpha;
        const r = (alpha * DT_SIM) / (DX_MM * DX_MM);
        const next = new Float64Array(N);
        next[0] = heating ? T_FLAME : temps[0];
        for (let i = 1; i < N - 1; i += 1) {
            next[i] = temps[i] + r * (temps[i + 1] - 2 * temps[i] + temps[i - 1]);
        }
        next[N - 1] = temps[N - 1] + r * (2 * temps[N - 2] - 2 * temps[N - 1]);
        temps = next;
        simTime += DT_SIM;
    }

    function advanceSim(seconds) {
        const steps = Math.round(seconds / DT_SIM);
        for (let s = 0; s < steps; s += 1) solverStep();
        checkBeads();
    }

    function checkBeads() {
        BEAD_CM.forEach((cm, i) => {
            if (beadFallAt[i] === null && temps[cmToNode(cm)] >= BEAD_MELT) {
                beadFallAt[i] = displayTime;
            }
        });
    }

    const mixRamp = (t, cold, warm, hot) => {
        const clamp = Math.max(T_AMBIENT, Math.min(T_FLAME, t));
        const mix = (a, b, u) => a.map((v, i) => Math.round(v + (b[i] - v) * u));
        const rgb = clamp <= BEAD_MELT
            ? mix(cold, warm, (clamp - T_AMBIENT) / (BEAD_MELT - T_AMBIENT))
            : mix(warm, hot, (clamp - BEAD_MELT) / (T_FLAME - BEAD_MELT));
        return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
    };

    // Fill colour for the rod itself — a large block, so saturated tones read
    // clearly against the dark stage.
    const tempColor = t => mixRamp(t, [74, 127, 214], [255, 204, 102], [255, 90, 74]);

    // The probe labels are small 12 px text, where that same saturated blue
    // only reaches 4.14:1 against the panel — under the 4.5:1 minimum, and
    // cold is the default state every student sees first. This lighter ramp
    // clears the threshold across the whole temperature range.
    const tempTextColor = t => mixRamp(t, [140, 190, 255], [255, 214, 130], [255, 138, 122]);

    function buildStatics() {
        probeGroup.innerHTML = PROBE_CM.map(cm => {
            const x = cmToX(cm);
            return `<line class="probe-line" x1="${x}" y1="46" x2="${x}" y2="${ROD_TOP}"/>` +
                   `<text class="probe-temp" id="probe-${cm}" x="${x}" y="42" text-anchor="middle">20 ℃</text>`;
        }).join('');
        beadGroup.innerHTML = BEAD_CM.map((cm, i) => {
            const x = cmToX(cm);
            return `<g id="bead-${i}"><rect class="wax" x="${x - 5}" y="${ROD_BOTTOM}" width="10" height="6" rx="2"/>` +
                   `<circle class="bead" cx="${x}" cy="${ROD_BOTTOM + 12}" r="6"/></g>`;
        }).join('');
    }

    function render() {
        // 21 gradient stops sampled straight from the solved profile
        let stops = '';
        for (let s = 0; s <= 20; s += 1) {
            const i = Math.round((s / 20) * (N - 1));
            stops += `<stop offset="${(s * 5)}%" stop-color="${tempColor(temps[i])}"/>`;
        }
        rodGrad.innerHTML = stops;

        PROBE_CM.forEach(cm => {
            const el = document.getElementById(`probe-${cm}`);
            const t = temps[cmToNode(cm)];
            el.textContent = `${Math.round(t)} ℃`;
            el.setAttribute('fill', tempTextColor(t));
        });

        BEAD_CM.forEach((cm, i) => {
            const g = document.getElementById(`bead-${i}`);
            if (beadFallAt[i] === null) { g.setAttribute('transform', 'translate(0 0)'); return; }
            const dt = displayTime - beadFallAt[i];
            const drop = .5 * FALL_ACCEL * dt * dt;
            g.setAttribute('transform', `translate(0 ${drop.toFixed(1)})`);
            g.setAttribute('opacity', drop > 150 ? '0' : '1');
        });

        flame.hidden = !heating;
        const fallen = beadFallAt.filter(v => v !== null).length;
        resultEndTemp.textContent = `${Math.round(temps[N - 1])} ℃`;
        resultBeads.textContent = `${fallen}개`;
        materialBadge.textContent = `${MATERIALS[material].label} · ${heating ? '가열 중' : '가열 전'}`;
    }

    function frame(now) {
        const t = now / 1000;
        const dtReal = lastT === null ? 1 / 60 : Math.min(1 / 20, t - lastT);
        lastT = t;
        displayTime += dtReal;
        if (heating) {
            const steps = Math.min(MAX_STEPS_PER_FRAME, Math.round((dtReal * SPEED) / DT_SIM));
            for (let s = 0; s < steps; s += 1) solverStep();
            checkBeads();
        }
        render();
        const beadsAnimating = beadFallAt.some((v, i) => v !== null && displayTime - v < 1.2);
        if (heating || beadsAnimating) { rafId = requestAnimationFrame(frame); }
        else { rafId = null; lastT = null; }
    }

    function startLoop() {
        if (rafId === null) { lastT = null; rafId = requestAnimationFrame(frame); }
    }

    function resetSim() {
        heating = false;
        temps = new Float64Array(N).fill(T_AMBIENT);
        simTime = 0;
        beadFallAt = BEAD_CM.map(() => null);
        if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; lastT = null; }
        heatButton.textContent = '가열 시작';
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        stageCaption.textContent = '물질을 고르고 가열을 시작해 보세요.';
        render();
    }

    function evaluatePrediction() {
        const a = MATERIALS[material].alpha, ref = MATERIALS[REFERENCE].alpha;
        const actual = material === REFERENCE ? 'same' : a > ref ? 'faster' : 'slower';
        predictionResult.textContent = !prediction
            ? '다음에는 결과를 먼저 예상해 보세요.'
            : prediction === actual ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        if (material === REFERENCE) {
            explanation.textContent = '기준 물질인 철입니다. 금속이라 열이 비교적 빠르게 전달되어 구슬이 차례로 떨어집니다.';
        } else {
            const name = MATERIALS[material].label;
            const p = topicParticle(name);
            explanation.textContent = actual === 'faster'
                ? `${name}${p} 철보다 열을 더 잘 전달해서 구슬이 더 빨리 떨어집니다.`
                : `${name}${p} 철보다 열을 훨씬 못 전달해서, 가열한 곳만 뜨거워지고 먼 쪽은 오래 차갑습니다.`;
        }
    }

    heatButton.addEventListener('click', () => {
        heating = !heating;
        heatButton.textContent = heating ? '가열 멈춤' : '가열 시작';
        if (heating) {
            resultEmpty.hidden = true;
            resultContent.hidden = false;
            evaluatePrediction();
            stageCaption.textContent = `${MATERIALS[material].label} 막대의 왼쪽 끝을 가열하고 있습니다.`;
            startLoop();
        } else {
            stageCaption.textContent = '가열을 멈추었습니다. 열은 이미 전달된 만큼 막대에 남아 있습니다.';
        }
        render();
    });
    resetButton.addEventListener('click', resetSim);
    materialButtons.forEach(button => button.addEventListener('click', () => {
        material = button.dataset.material;
        materialButtons.forEach(item => item.classList.toggle('selected', item === button));
        resetSim();
    }));
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

    // Verification hook: advances the solver by an exact number of simulated
    // seconds without depending on animation frames, so the diffusion physics
    // can be checked numerically.
    window.__heatModel = {
        MATERIALS, N, DX_MM, DT_SIM, SPEED, T_AMBIENT, T_FLAME, BEAD_MELT, BEAD_CM, PROBE_CM, REFERENCE,
        setMaterial(m) { material = m; resetSim(); },
        startHeating() { heating = true; },
        stopHeating() { heating = false; },
        advanceSim,
        profile: () => Array.from(temps),
        tempAtCm: cm => temps[cmToNode(cm)],
        beadsFallen: () => beadFallAt.filter(v => v !== null).length,
        simTime: () => simTime,
        stability: () => (MATERIALS[material].alpha * DT_SIM) / (DX_MM * DX_MM),
        reset: resetSim,
        render,
    };

    buildStatics();
    resetSim();
});
