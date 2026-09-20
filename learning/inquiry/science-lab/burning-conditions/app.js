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

    const O2_START = 21, O2_FLOOR = 16;   // a candle goes out near 16 % oxygen
    const O2_RATE = 4;                    // mL of oxygen burned each second
    const GRAPH = { x0: 62, x1: 424, y0: 152, y1: 26 };

    const batchim = w => {
        const c = w.charCodeAt(w.length - 1);
        return c >= 0xAC00 && c <= 0xD7A3 ? (c - 0xAC00) % 28 !== 0 : false;
    };
    const eun = w => w + (batchim(w) ? '은' : '는');

    // Both fuels are carbon and hydrogen, so both burn to carbon dioxide and water.
    const FUELS = {
        none: { label: '없음', hint: '탈 물질 없음', ignite: null },
        candle: { label: '양초', hint: '발화점 190 ℃', ignite: 190 },
        paper: { label: '종이', hint: '발화점 450 ℃', ignite: 450 },
    };
    const PRODUCTS = '이산화탄소와 물';

    const state = { fuel: 'candle', temp: 300, oxygen: 'open', jar: 500, progress: 0, prediction: null };
    let running = false, frameId = 0, lastStamp = 0;

    /* ------------------------------------------------------------- model */
    function analyse(s = state) {
        const fuel = FUELS[s.fuel];
        const hasFuel = fuel.ignite !== null;
        const hotEnough = hasFuel && s.temp >= fuel.ignite;
        let outcome, missing;
        if (!hasFuel) { outcome = 'none'; missing = 'fuel'; }
        else if (!hotEnough) { outcome = 'none'; missing = 'heat'; }
        else if (s.oxygen === 'closed') { outcome = 'out'; missing = 'oxygen'; }
        else { outcome = 'burn'; missing = null; }
        // How long the trapped oxygen lasts: the usable share above the floor,
        // divided by how fast the flame eats it.
        const outTime = ((O2_START - O2_FLOOR) / 100) * s.jar / O2_RATE;
        const runFor = outcome === 'out' ? outTime : outcome === 'burn' ? 8 : 3;
        return { fuel, hasFuel, hotEnough, outcome, missing, outTime, runFor };
    }

    function o2At(t, a, s = state) {
        if (s.oxygen === 'open' || a.outcome === 'none') return O2_START;
        return Math.max(O2_FLOOR, O2_START - ((O2_RATE * t) / s.jar) * 100);
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
            pickRow('탈 물질', 'fuel', Object.entries(FUELS).map(([k, v]) => ({ value: k, label: v.label, hint: v.hint })), state.fuel, 3) +
            sliderRow('tempRange', '가열 온도', 0, 500, 10, state.temp, ['0℃', '250℃', '500℃']) +
            pickRow('산소', 'oxygen', [{ value: 'open', label: '열어 둠', hint: '공기가 계속 들어옴' },
                                      { value: 'closed', label: '유리병으로 덮음', hint: '산소가 갇힘' }], state.oxygen, 2) +
            sliderRow('jarRange', '덮은 유리병의 크기', 250, 1000, 250, state.jar, ['250mL', '625mL', '1000mL']);
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                settingsChanged();
            }));
        });
        ['tempRange', 'jarRange'].forEach(id => {
            const el = document.getElementById(id);
            el.addEventListener('input', () => {
                if (id === 'tempRange') state.temp = Number(el.value);
                if (id === 'jarRange') state.jar = Number(el.value);
                settingsChanged();
            });
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

    const VERDICT = { burn: '계속 탄다', out: '타다가 꺼진다', none: '불이 붙지 않는다' };
    const TONE = { burn: '#d97706', out: '#ea580c', none: '#8fa8b0' };

    function renderMain(a) {
        const p = state.progress;
        const t = p * a.runFor;
        const o2 = o2At(t, a);
        const STAND_Y = 178, CX = 200;
        let out = '';

        // thermometer, with the fuel's ignition point marked on it
        const TX = 44, TOP = 56, BOT = 172;
        out += `<rect class="therm-tube" x="${TX}" y="${TOP}" width="9" height="${BOT - TOP}" rx="4.5"/>`;
        const tf = Math.min(1, state.temp / 500);
        out += `<rect class="therm-fill" x="${TX + 2}" y="${(BOT - 4 - (BOT - TOP - 8) * tf).toFixed(1)}" width="5" height="${((BOT - TOP - 8) * tf + 4).toFixed(1)}" rx="2.5"/>`;
        // below the bulb, so the ignition-point label can never land on it
        out += `<text class="read-text" x="${TX + 4}" y="190" text-anchor="middle">${state.temp} ℃</text>`;
        if (a.hasFuel) {
            const iy = BOT - 4 - (BOT - TOP - 8) * (a.fuel.ignite / 500);
            out += `<line class="ignite-line" x1="${TX - 8}" y1="${iy.toFixed(1)}" x2="${TX + 74}" y2="${iy.toFixed(1)}"/>`;
            out += `<text class="ignite-text" x="${TX + 15}" y="${(iy - 4).toFixed(1)}">발화점 ${a.fuel.ignite} ℃</text>`;
        }

        // the burning thing on its stand
        out += `<rect class="stand" x="${CX - 50}" y="${STAND_Y}" width="100" height="8" rx="2"/>`;
        let flameBase = STAND_Y;
        const burning = (a.outcome === 'burn') || (a.outcome === 'out' && o2 > O2_FLOOR + 0.001);
        if (state.fuel === 'candle') {
            const used = a.outcome === 'none' ? 0 : 14 * p;
            const top = 128 + used;
            out += `<rect class="candle" x="${CX - 9}" y="${top.toFixed(1)}" width="18" height="${(STAND_Y - top).toFixed(1)}" rx="2"/>`;
            out += `<line class="wick" x1="${CX}" y1="${top.toFixed(1)}" x2="${CX}" y2="${(top - 7).toFixed(1)}"/>`;
            flameBase = top - 6;
        } else if (state.fuel === 'paper') {
            const left = a.outcome === 'none' ? 1 : 1 - 0.75 * p;
            out += `<rect class="paper" x="${(CX - 24 * left).toFixed(1)}" y="158" width="${(48 * left).toFixed(1)}" height="20" rx="2"/>`;
            flameBase = 156;
        } else {
            out += `<text class="small-label" x="${CX}" y="${STAND_Y - 8}" text-anchor="middle">탈 물질이 없습니다</text>`;
        }

        if (burning && a.hasFuel) {
            // the flame shrinks as the trapped oxygen runs low
            const strength = state.oxygen === 'closed' ? 0.4 + 0.6 * ((o2 - O2_FLOOR) / (O2_START - O2_FLOOR)) : 1;
            out += flame(CX, flameBase, strength);
        } else if (a.outcome === 'out' && p > 0) {
            for (let i = 0; i < 3; i += 1) {
                out += `<path class="smoke" d="M${CX + i * 4 - 4},${flameBase - i * 9} q6,-7 0,-13"/>`;
            }
        }

        // the jar that traps the air; its inside mists over as the water forms
        if (state.oxygen === 'closed') {
            const half = 34 + (state.jar - 250) / 250 * 8;
            const mist = a.outcome === 'out' ? Math.min(1, p * 1.4) : 0;
            out += `<path class="glass" d="M${CX - half},${STAND_Y + 2} L${CX - half},${76} Q${CX - half},${64} ${CX - half + 12},${64} ` +
                   `L${CX + half - 12},${64} Q${CX + half},${64} ${CX + half},${76} L${CX + half},${STAND_Y + 2}"/>`;
            if (mist > 0) {
                out += `<path class="mist" opacity="${(0.55 * mist).toFixed(2)}" d="M${CX - half + 3},${STAND_Y} L${CX - half + 3},${80} Q${CX - half + 3},${68} ${CX - half + 14},${68} ` +
                       `L${CX + half - 14},${68} Q${CX + half - 3},${68} ${CX + half - 3},${80} L${CX + half - 3},${STAND_Y} Z"/>`;
                out += `<text class="note-text" x="${CX}" y="${STAND_Y + 20}" text-anchor="middle">병 안쪽이 물방울로 흐려집니다</text>`;
            }
            out += `<text class="part-label" x="${CX}" y="56" text-anchor="middle">${state.jar} mL 유리병</text>`;
        }

        out += `<text class="part-label" x="300" y="86">산소 농도</text>`;
        out += `<text class="read-text" x="300" y="106">${o2.toFixed(1)} %</text>`;
        out += `<text class="note-text" x="300" y="124">꺼지는 농도 ${O2_FLOOR} %</text>`;
        out += `<text class="part-label" x="300" y="148">지난 시간</text>`;
        out += `<text class="note-text" x="300" y="164">${t.toFixed(1)} 초</text>`;

        const text = `${a.fuel.label} · ${state.oxygen === 'open' ? '열어 둠' : '덮음'} · ${state.temp} ℃ → ${VERDICT[a.outcome]}`;
        out += `<text class="verdict-text" fill="${TONE[a.outcome]}" x="20" y="28">${text}</text>`;
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
        const total = a.runFor, t = state.progress * total;
        const gx = s => GRAPH.x0 + (s / total) * (GRAPH.x1 - GRAPH.x0);
        const gy = v => GRAPH.y0 - ((v - 14) / 8) * (GRAPH.y0 - GRAPH.y1);
        let out = graphFrame(
            [0, 0.25, 0.5, 0.75, 1].map(f => [(f * total).toFixed(1), gx(f * total)]),
            [16, 18, 20, 22].map(v => [v, gy(v)]),
            '시간 (초)', '산소 농도 (%)');
        out += `<line class="limit-line" x1="${GRAPH.x0}" y1="${gy(O2_FLOOR).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(O2_FLOOR).toFixed(1)}"/>`;
        out += `<text class="limit-text" x="${GRAPH.x1 - 4}" y="${(gy(O2_FLOOR) - 5).toFixed(1)}" text-anchor="end">${O2_FLOOR} % 아래로는 탈 수 없습니다</text>`;
        const line = (t1, cls) => {
            const pts = [];
            for (let i = 0; i <= 80; i += 1) {
                const s = (t1 * i) / 80;
                pts.push(`${gx(s).toFixed(1)},${gy(o2At(s, a)).toFixed(1)}`);
            }
            return `<path class="${cls}" d="M${pts.join('L')}"/>`;
        };
        out += line(total, 'trace-done');
        if (t > 0) out += line(t, 'trace');
        out += `<circle class="trace-dot" cx="${gx(t).toFixed(1)}" cy="${gy(o2At(t, a)).toFixed(1)}" r="5" fill="#0284c7"/>`;
        if (state.oxygen === 'open') {
            out += `<text class="note-text" x="${GRAPH.x0 + 8}" y="${(gy(O2_START) + 16).toFixed(1)}">공기가 계속 들어와 산소가 줄지 않습니다</text>`;
        } else if (a.outcome === 'none') {
            out += `<text class="note-text" x="${GRAPH.x0 + 8}" y="${(gy(O2_START) + 16).toFixed(1)}">타지 않으므로 산소도 줄지 않습니다</text>`;
        }
        return out;
    }

    function noteFor(a) {
        const t = state.progress * a.runFor;
        const burned = a.outcome !== 'none' && state.progress > 0;
        return `<div class="data-row"><span class="data-name">탈 물질</span><span class="data-val">${a.fuel.label}${a.hasFuel ? ` · 발화점 ${a.fuel.ignite} ℃` : ' — 없으면 탈 수 없습니다'}</span></div>` +
            `<div class="data-row"><span class="data-name">온도</span><span class="data-val">${state.temp} ℃ ${a.hasFuel ? (a.hotEnough ? '— 발화점 이상' : '— 발화점보다 낮음') : ''}</span></div>` +
            `<div class="data-row"><span class="data-name">산소</span><span class="data-val">${state.oxygen === 'open' ? '계속 들어옴 (21 %)' : `${state.jar} mL 안에 갇힘 · 지금 ${o2At(t, a).toFixed(1)} %`}</span></div>` +
            (state.oxygen === 'closed'
                ? `<div class="data-row"><span class="data-name">꺼지기까지</span><span class="data-val">쓸 수 있는 산소 ${(((O2_START - O2_FLOOR) / 100) * state.jar).toFixed(1)} mL ÷ 초당 ${O2_RATE} mL = ${a.outTime.toFixed(1)} 초</span></div>`
                : '') +
            `<div class="data-row"><span class="data-name">타서 생긴 것</span><span class="data-val">${burned ? PRODUCTS : '아직 없음'}</span></div>` +
            `<div class="data-row match"><span class="data-name">결과</span><span class="data-val">${VERDICT[a.outcome]}</span></div>`;
    }

    function render() {
        const a = analyse();
        renderMain(a);
        graphGroup.innerHTML = graph(a);
        const tOut = document.getElementById('tempRangeOut');
        if (tOut) tOut.textContent = `${state.temp} ℃`;
        const jOut = document.getElementById('jarRangeOut');
        if (jOut) jOut.textContent = `${state.jar} mL`;
        stageBadge.textContent = `${a.fuel.label} · ${VERDICT[a.outcome]}`;
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
        valueA.textContent = VERDICT[a.outcome];
        valueB.textContent = a.missing === 'fuel' ? '탈 물질' : a.missing === 'heat' ? '발화점 이상의 온도' : a.missing === 'oxygen' ? '산소' : '없음';
        predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : state.prediction === a.outcome ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        let s = '';
        if (a.missing === 'fuel') s = '탈 물질이 없으면 산소와 온도가 아무리 충분해도 탈 수 없습니다.';
        else if (a.missing === 'heat') s = `${eun(a.fuel.label)} 발화점이 ${a.fuel.ignite} ℃인데 ${state.temp} ℃까지만 올렸습니다. 발화점보다 낮으면 불이 붙지 않습니다.`;
        else if (a.missing === 'oxygen') {
            s = `${state.jar} mL 유리병 안에서 쓸 수 있는 산소는 ${(((O2_START - O2_FLOOR) / 100) * state.jar).toFixed(1)} mL입니다. ` +
                `초당 ${O2_RATE} mL씩 쓰므로 ${a.outTime.toFixed(1)}초 만에 산소가 ${O2_FLOOR} %까지 줄어 불이 꺼졌습니다. ` +
                `병이 클수록 산소가 많아 더 오래 탑니다. 타는 동안 생긴 물이 병 안쪽을 흐리게 했습니다.`;
        } else s = `탈 물질 ${a.fuel.label}, 산소, ${a.fuel.ignite} ℃ 이상의 온도가 모두 갖추어져 계속 탑니다. 셋 중 하나만 없애도 불은 꺼집니다. 타면서 ${PRODUCTS}이 생깁니다.`;
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
        Object.assign(state, { fuel: 'candle', temp: 300, oxygen: 'open', jar: 500, progress: 0 });
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

    window.__burnModel = {
        O2_START, O2_FLOOR, O2_RATE, FUELS, state,
        analyse, o2At, render, runSeconds,
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
