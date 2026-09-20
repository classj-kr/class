document.addEventListener('DOMContentLoaded', () => {
    const controlArea = document.getElementById('controlArea');
    const predictionArea = document.getElementById('predictionArea');
    const checkBtn = document.getElementById('checkBtn');
    const resetBtn = document.getElementById('resetBtn');
    const resultEmpty = document.getElementById('resultEmpty');
    const resultContent = document.getElementById('resultContent');
    const valueA = document.getElementById('valueA');
    const valueB = document.getElementById('valueB');
    const predictionResult = document.getElementById('predictionResult');
    const explanation = document.getElementById('elementaryExplanation');
    const stageBadge = document.getElementById('stageBadge');
    const mainGroup = document.getElementById('mainGroup');
    const graphGroup = document.getElementById('graphGroup');
    const dataNote = document.getElementById('dataNote');

    const GRAPH = { x0: 62, x1: 424, y0: 152, y1: 26 };

    // Iron gains oxygen; wood loses its carbon and hydrogen as gas.
    const MATERIALS = {
        steel: { label: '강철솜', hint: '철 + 산소', eq: '4Fe + 3O₂ → 2Fe₂O₃',
                 oxygenPerGram: 48 / 111.7, ashFrac: 1, burnsAway: false },
        wood: { label: '나무', hint: '탄소·수소가 기체로', eq: 'C₆H₁₀O₅ + 6O₂ → 6CO₂ + 5H₂O',
                oxygenPerCombustible: 192 / 162.14, ashFrac: 0.03, burnsAway: true },
    };

    const state = { material: 'steel', vessel: 'open', mass: 5, progress: 0, prediction: null };
    let running = false, frameId = 0, lastStamp = 0;

    /* ------------------------------------------------------------- model */
    function analyse(s = state) {
        const mat = MATERIALS[s.material];
        const m = s.mass;
        let oxygenTotal, solidEnd, gasEnd, combustible;
        if (mat.burnsAway) {
            combustible = m * (1 - mat.ashFrac);
            oxygenTotal = combustible * mat.oxygenPerCombustible;
            solidEnd = m - combustible;
            gasEnd = combustible + oxygenTotal;   // conservation, by construction
        } else {
            combustible = 0;
            oxygenTotal = m * mat.oxygenPerGram;
            solidEnd = m + oxygenTotal;
            gasEnd = 0;
        }
        const totalBefore = m + oxygenTotal;
        const totalAfter = solidEnd + gasEnd;
        const verdict = s.vessel === 'sealed' ? 'same' : mat.burnsAway ? 'down' : 'up';
        return { mat, m, combustible, oxygenTotal, solidEnd, gasEnd, totalBefore, totalAfter, verdict, runFor: 6 };
    }

    function step(p, a) {
        const oxygen = a.oxygenTotal * p;
        const solid = a.mat.burnsAway ? a.m - a.combustible * p : a.m + oxygen;
        const gas = a.mat.burnsAway ? (a.combustible + a.oxygenTotal) * p : 0;
        const measured = state.vessel === 'sealed' ? a.totalBefore : solid;
        return { oxygen, solid, gas, measured };
    }

    const runSeconds = () => analyse().runFor;

    /* ---------------------------------------------------------- controls */
    function pickRow(legend, name, options, current, cols) {
        return `<fieldset class="pick-field"><legend>${legend}</legend>` +
            `<div class="pick-buttons cols${cols}" data-pick="${name}">` +
            options.map(o => `<button type="button" data-value="${o.value}" class="${o.value === String(current) ? 'selected' : ''}">` +
                `${o.label}${o.hint ? `<small>${o.hint}</small>` : ''}</button>`).join('') +
            `</div></fieldset>`;
    }

    function sliderRow(id, legend, min, max, step, value, scale) {
        return `<div class="range-heading"><label for="${id}">${legend}</label>` +
            `<output id="${id}Out" for="${id}"></output></div>` +
            `<input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}">` +
            `<div class="range-scale" aria-hidden="true">${scale.map(s => `<span>${s}</span>`).join('')}</div>`;
    }

    function buildControls() {
        controlArea.innerHTML =
            pickRow('태울 물질', 'material', Object.entries(MATERIALS).map(([k, v]) => ({ value: k, label: v.label, hint: v.hint })), state.material, 2) +
            pickRow('용기', 'vessel', [{ value: 'open', label: '열린 그릇', hint: '기체가 드나듦' },
                                      { value: 'sealed', label: '밀폐 용기', hint: '기체가 갇힘' }], state.vessel, 2) +
            sliderRow('massRange', '처음 질량', 1, 10, 1, state.mass, ['1g', '5g', '10g']);
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                settingsChanged();
            }));
        });
        const massRange = document.getElementById('massRange');
        massRange.addEventListener('input', () => {
            state.mass = Number(massRange.value);
            settingsChanged();
        });
    }

    const predictionButtons = [...predictionArea.querySelectorAll('button')];
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        state.prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
        predictionButtons.forEach(b => b.classList.toggle('selected', b === button));
    }));
    const clearPrediction = () => {
        state.prediction = null;
        predictionButtons.forEach(b => b.classList.remove('selected'));
    };

    /* ----------------------------------------------------------- visuals */
    function flame(cx, baseY, s, dim = 1) {
        if (s <= 0.02) return '';
        return `<path class="flame" opacity="${dim.toFixed(2)}" d="M${cx},${baseY} C${(cx - 9 * s).toFixed(1)},${(baseY - 6 * s).toFixed(1)} ` +
               `${(cx - 7 * s).toFixed(1)},${(baseY - 20 * s).toFixed(1)} ${cx},${(baseY - 29 * s).toFixed(1)} ` +
               `C${(cx + 7 * s).toFixed(1)},${(baseY - 20 * s).toFixed(1)} ${(cx + 9 * s).toFixed(1)},${(baseY - 6 * s).toFixed(1)} ${cx},${baseY} Z"/>` +
               `<path class="flame inner" opacity="${dim.toFixed(2)}" d="M${cx},${baseY} C${(cx - 4 * s).toFixed(1)},${(baseY - 4 * s).toFixed(1)} ` +
               `${(cx - 3 * s).toFixed(1)},${(baseY - 11 * s).toFixed(1)} ${cx},${(baseY - 16 * s).toFixed(1)} ` +
               `C${(cx + 3 * s).toFixed(1)},${(baseY - 11 * s).toFixed(1)} ${(cx + 4 * s).toFixed(1)},${(baseY - 4 * s).toFixed(1)} ${cx},${baseY} Z"/>`;
    }

    const VERDICT = { up: '질량이 늘어난다', same: '질량이 그대로다', down: '질량이 줄어든다' };
    const TONE = { up: '#0284c7', same: '#059669', down: '#ea580c' };

    function renderMain(a) {
        const p = state.progress;
        const st = step(p, a);
        const CX = 214, PAN_Y = 150;
        let out = '';

        // the sample on the pan, changing as it burns
        if (state.material === 'steel') {
            const burnt = p > 0.05;
            for (let i = 0; i < 7; i += 1) {
                const x = CX - 30 + i * 10;
                out += `<path class="steel${burnt ? ' burnt' : ''}" d="M${x},${PAN_Y - 2} q6,-12 -2,-20 q-6,-8 4,-14"/>`;
            }
            if (p > 0 && p < 1) out += flame(CX, PAN_Y - 34, 0.7);
        } else {
            const left = 1 - 0.9 * p;
            out += `<rect class="wood${p > 0.6 ? ' ash' : ''}" x="${(CX - 26 * left).toFixed(1)}" y="${(PAN_Y - 22 * left).toFixed(1)}" ` +
                   `width="${(52 * left).toFixed(1)}" height="${(22 * left).toFixed(1)}" rx="3"/>`;
            if (p > 0 && p < 1) out += flame(CX, PAN_Y - 22 * left, 0.8);
        }

        // gases moving in or out, or trapped
        if (state.vessel === 'sealed') {
            out += `<path class="glass" d="M${CX - 62},${PAN_Y + 2} L${CX - 62},86 Q${CX - 62},74 ${CX - 50},74 L${CX + 50},74 Q${CX + 62},74 ${CX + 62},86 L${CX + 62},${PAN_Y + 2} Z"/>`;
            out += `<text class="small-label" x="${CX}" y="68" text-anchor="middle">밀폐 — 기체가 나가지 못합니다</text>`;
            if (p > 0.05) {
                for (let i = 0; i < 4; i += 1) {
                    const x = CX - 40 + i * 26;
                    out += `<circle fill="${state.material === 'steel' ? '#0284c7' : '#ea580c'}" opacity=".5" cx="${x}" cy="${(104 + (i % 2) * 14).toFixed(1)}" r="3.4"/>`;
                }
            }
        } else if (p > 0.05) {
            const inward = !a.mat.burnsAway;
            for (let i = 0; i < 3; i += 1) {
                const x = CX - 34 + i * 34;
                const y0 = inward ? 96 : PAN_Y - 34, y1 = inward ? PAN_Y - 34 : 96;
                out += `<line class="gas-arrow ${inward ? 'gas-in' : 'gas-out'}" x1="${x}" y1="${y0}" x2="${x}" y2="${y1}"/>`;
                const dir = inward ? 1 : -1;
                out += `<path class="gas-arrow ${inward ? 'gas-in' : 'gas-out'}" d="M${x - 5},${y1 - dir * 6} L${x},${y1} L${x + 5},${y1 - dir * 6}"/>`;
            }
            out += `<text class="small-label" style="fill:${inward ? '#0284c7' : '#ea580c'}" x="${CX}" y="88" text-anchor="middle">` +
                   `${inward ? '산소가 들어와 결합합니다' : '기체가 되어 날아갑니다'}</text>`;
        }

        // the balance underneath
        out += `<rect class="balance" x="${CX - 74}" y="${PAN_Y}" width="148" height="8" rx="2"/>`;
        out += `<rect class="balance" x="${CX - 60}" y="${PAN_Y + 8}" width="120" height="34" rx="5"/>`;
        out += `<rect class="balance-screen" x="${CX - 50}" y="${PAN_Y + 14}" width="100" height="22" rx="4"/>`;
        out += `<text class="balance-read" x="${CX}" y="${PAN_Y + 30}" text-anchor="middle">${st.measured.toFixed(2)} g</text>`;
        out += `<text class="small-label" x="${CX}" y="${PAN_Y + 54}" text-anchor="middle">전자저울</text>`;

        out += `<text class="note-text" x="316" y="112">처음 고체 ${a.m.toFixed(2)} g</text>`;
        out += `<text class="note-text" x="316" y="128">지금 고체 ${st.solid.toFixed(2)} g</text>`;
        out += `<text class="note-text" x="316" y="144">결합한 산소 ${st.oxygen.toFixed(2)} g</text>`;
        out += `<text class="note-text" x="316" y="160">날아간 기체 ${st.gas.toFixed(2)} g</text>`;
        // its own full-width line: the cellulose equation is too long for a column
        out += `<text class="part-label" x="20" y="204">${a.mat.eq}</text>`;

        const text = `${a.mat.label} · ${state.vessel === 'open' ? '열린 그릇' : '밀폐 용기'} → ${VERDICT[a.verdict]}`;
        out += `<text class="verdict-text" fill="${TONE[a.verdict]}" x="20" y="28">${text}</text>`;
        mainGroup.innerHTML = out;
    }

    /* ------------------------------------------------------------- graph */
    function graphFrame(xTicks, yTicks, xTitle, yTitle) {
        let out = '';
        yTicks.forEach(([v, y]) => {
            out += `<line class="grid-line" x1="${GRAPH.x0}" y1="${y.toFixed(1)}" x2="${GRAPH.x1}" y2="${y.toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(y + 3).toFixed(1)}" text-anchor="end">${v}</text>`;
        });
        xTicks.forEach(([v, x]) => {
            out += `<text class="axis-text" x="${x.toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${v}</text>`;
        });
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-title" x="${((GRAPH.x0 + GRAPH.x1) / 2).toFixed(1)}" y="${GRAPH.y0 + 30}" text-anchor="middle">${xTitle}</text>`;
        out += `<text class="axis-title" x="${GRAPH.x0 + 4}" y="${GRAPH.y1 - 8}">${yTitle}</text>`;
        return out;
    }

    function graph(a) {
        const st = step(state.progress, a);
        const rows = [
            ['반응 전 고체', a.m, '#b4d2dc'],
            ['반응 후 고체', a.solidEnd, a.mat.burnsAway ? '#ea580c' : '#0284c7'],
            ['반응 전 전체 (고체 + 산소)', a.totalBefore, '#059669'],
            ['반응 후 전체 (고체 + 기체)', a.totalAfter, '#059669'],
        ];
        const max = Math.max(...rows.map(r => r[1])) * 1.1;
        const gx = v => GRAPH.x0 + (v / max) * (GRAPH.x1 - GRAPH.x0);
        let out = graphFrame([0, 0.25, 0.5, 0.75, 1].map(f => [(f * max).toFixed(1), gx(f * max)]), [], '질량 (g)', '');
        rows.forEach(([name, value, colour], i) => {
            const y = GRAPH.y1 + 30 + i * 30;
            out += `<text class="bar-text" fill="${colour}" x="${GRAPH.x0}" y="${y - 10}">${name} ${value.toFixed(2)} g</text>`;
            out += `<rect class="bar" x="${GRAPH.x0}" y="${y - 4}" width="${Math.max(2, gx(value) - GRAPH.x0).toFixed(1)}" height="11" rx="3" fill="${colour}" opacity=".8"/>`;
        });
        out += `<text class="note-text figure-caption" x="${GRAPH.x0}" y="${GRAPH.y0 - 4}">지금 저울이 가리키는 값 ${st.measured.toFixed(2)} g</text>`;
        return out;
    }

    function noteFor(a) {
        const st = step(state.progress, a);
        return `<div class="data-row"><span class="data-name">반응식</span><span class="data-val">${a.mat.eq}</span></div>` +
            `<div class="data-row"><span class="data-name">고체</span><span class="data-val">${a.m.toFixed(2)} g → ${a.solidEnd.toFixed(2)} g</span></div>` +
            `<div class="data-row"><span class="data-name">주고받은 기체</span><span class="data-val">산소 ${a.oxygenTotal.toFixed(2)} g 결합 · 기체 ${a.gasEnd.toFixed(2)} g 생성</span></div>` +
            `<div class="data-row"><span class="data-name">저울 눈금</span><span class="data-val">${st.measured.toFixed(2)} g</span></div>` +
            `<div class="data-row match"><span class="data-name">전체 질량</span><span class="data-val">${a.totalBefore.toFixed(2)} g → ${a.totalAfter.toFixed(2)} g (변하지 않습니다)</span></div>`;
    }

    function render() {
        const a = analyse();
        renderMain(a);
        graphGroup.innerHTML = graph(a);
        const mOut = document.getElementById('massRangeOut');
        if (mOut) mOut.textContent = `${state.mass} g`;
        stageBadge.textContent = `${a.mat.label} · ${VERDICT[a.verdict]}`;
        dataNote.innerHTML = noteFor(a);
        return a;
    }

    /* --------------------------------------------------------------- run */
    function tick(dt) {
        state.progress = Math.min(1, state.progress + dt / runSeconds());
        render();
        return state.progress >= 1;
    }

    function stopRun() { running = false; if (frameId) cancelAnimationFrame(frameId); frameId = 0; }

    function frame(stamp) {
        if (!running) return;
        const dt = Math.min(0.05, (stamp - lastStamp) / 1000 || 0);
        lastStamp = stamp;
        if (tick(dt)) { stopRun(); finish(); } else frameId = requestAnimationFrame(frame);
    }

    function startRun() {
        stopRun();
        state.progress = 0;
        running = true;
        lastStamp = performance.now();
        render();
        frameId = requestAnimationFrame(frame);
    }

    function finish() {
        const a = render();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        // both readings must come from the same meter: in a sealed vessel the
        // starting reading already includes the trapped air.
        const st0 = step(0, a), st = step(1, a);
        valueA.textContent = `${st0.measured.toFixed(2)} g → ${st.measured.toFixed(2)} g`;
        valueB.textContent = `${a.totalBefore.toFixed(2)} g 그대로`;
        predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        let s = '';
        if (state.vessel === 'sealed') {
            s = `밀폐 용기에서는 드나드는 기체가 없어 저울 눈금이 ${a.totalBefore.toFixed(2)} g 그대로입니다. ` +
                (a.mat.burnsAway
                    ? `나무가 타서 생긴 기체 ${a.gasEnd.toFixed(2)} g이 용기 안에 그대로 남아 있기 때문입니다.`
                    : `강철솜이 결합한 산소 ${a.oxygenTotal.toFixed(2)} g도 원래 용기 안의 공기에서 온 것이기 때문입니다.`) +
                ` 반응 전 ${a.totalBefore.toFixed(2)} g, 반응 후 ${a.totalAfter.toFixed(2)} g으로 질량은 보존됩니다.`;
        } else if (a.mat.burnsAway) {
            s = `열린 그릇에서는 타서 생긴 기체 ${a.gasEnd.toFixed(2)} g이 날아가 버립니다. ` +
                `그래서 저울에는 재 ${a.solidEnd.toFixed(2)} g만 남아 줄어든 것처럼 보입니다. ` +
                `하지만 날아간 기체까지 세면 ${a.totalBefore.toFixed(2)} g 그대로입니다.`;
        } else {
            s = `열린 그릇에서는 공기 중의 산소 ${a.oxygenTotal.toFixed(2)} g이 철과 결합해 들어옵니다. ` +
                `그래서 ${a.m.toFixed(2)} g이던 강철솜이 ${a.solidEnd.toFixed(2)} g으로 늘어납니다. ` +
                `타면 가벼워질 것 같지만, 금속은 산소가 붙기 때문에 오히려 무거워집니다.`;
        }
        explanation.textContent = s;
    }

    function settingsChanged() {
        stopRun();
        state.progress = 0;
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        render();
    }

    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { material: 'steel', vessel: 'open', mass: 5, progress: 0 });
        clearPrediction();
        buildControls();
        settingsChanged();
    });

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

    window.__oxideModel = {
        MATERIALS, state,
        analyse, step, render, runSeconds,
        set(key, value) { state[key] = value; buildControls(); settingsChanged(); },
        setProgress(p) { stopRun(); state.progress = p; render(); },
        runToEnd(dt = 0.25, cap = 5000) {
            stopRun(); state.progress = 0;
            let steps = 0;
            while (!tick(dt) && steps < cap) steps += 1;
            finish();
            return { steps, progress: state.progress };
        },
        tick, finish,
    };

    resetBtn.click();
});
