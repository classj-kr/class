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
    // Animation phases: idle → heat (lamp lit, plate warms) → run (model time) → tail (smoke drifts) → done.
    const HEAT_MS = 1600, TAIL_MS = 1200, ROOM = 20;
    let phase = 'idle', phaseStart = 0, clock = 0, finished = false, outAt = null;
    const reducedMotion = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

    function flame(cx, baseY, s, sway = 0, colors = ['#f59e0b', '#c2410c']) {
        if (s <= 0.02) return '';
        const tip = cx + sway;
        const f = (w, h, fill) => `<path fill="${fill}" d="M${cx},${baseY} C${(cx - w * s).toFixed(1)},${(baseY - 0.2 * h * s).toFixed(1)} ` +
            `${(cx - 0.8 * w * s + sway * 0.4).toFixed(1)},${(baseY - 0.7 * h * s).toFixed(1)} ${tip.toFixed(1)},${(baseY - h * s).toFixed(1)} ` +
            `C${(cx + 0.8 * w * s + sway * 0.4).toFixed(1)},${(baseY - 0.7 * h * s).toFixed(1)} ${(cx + w * s).toFixed(1)},${(baseY - 0.2 * h * s).toFixed(1)} ${cx},${baseY} Z"/>`;
        return f(9, 32, colors[0]) + f(4.5, 17, colors[1]);
    }

    const VERDICT = { burn: '계속 탄다', out: '타다가 꺼진다', none: '불이 붙지 않는다' };
    const TONE = { burn: '#b45309', out: '#c2410c', none: '#64748b' };

    // Temperature the thermometer shows right now (the plate warms up during the heat phase).
    function shownTemp() {
        if (phase === 'idle') return ROOM;
        if (phase === 'heat') { const u = Math.min(1, (clock - phaseStart) / HEAT_MS); return ROOM + (state.temp - ROOM) * (1 - Math.pow(1 - u, 2)); }
        return state.temp;
    }

    function renderMain(a) {
        const p = state.progress;
        const t = p * a.runFor;
        const o2 = o2At(t, a);
        const CX = 210, PLATE = 168, BENCH = 238;
        const temp = shownTemp(), heatFrac = Math.max(0, Math.min(1, (temp - ROOM) / 480));
        const lampLit = phase !== 'idle';
        const ignited = a.hasFuel && a.hotEnough && (phase === 'run' || phase === 'tail' || (phase === 'done' && a.outcome !== 'none') || (phase === 'heat' && temp >= a.fuel.ignite));
        const sinceIgnite = phase === 'heat' ? (clock - phaseStart) - HEAT_MS * (1 - Math.sqrt(Math.max(0, 1 - (a.fuel.ignite - ROOM) / Math.max(1, state.temp - ROOM)))) : 9999;
        let out = '';

        // bench, tripod (back leg first), alcohol lamp, then the iron plate
        out += `<rect x="0" y="${BENCH}" width="460" height="14" fill="#eadfcd"/><line x1="0" y1="${BENCH}" x2="460" y2="${BENCH}" stroke="#c7b79c" stroke-width="2"/>`;
        out += `<line x1="${CX}" y1="178" x2="${CX}" y2="${BENCH}" stroke="#9aa5ad" stroke-width="4"/>`;
        out += `<path d="M${CX - 22},${BENCH} Q${CX - 26},214 ${CX - 12},207 H${CX + 12} Q${CX + 26},214 ${CX + 22},${BENCH} Z" fill="#dcecf3" stroke="#6b8b99" stroke-width="2"/>`;
        out += `<path d="M${CX - 20},${BENCH - 2} Q${CX - 22},224 ${CX - 16},220 H${CX + 16} Q${CX + 22},224 ${CX + 20},${BENCH - 2} Z" fill="#bfe0ea"/>`;
        out += `<rect x="${CX - 8}" y="199" width="16" height="9" rx="2" fill="#7c8a93"/><line x1="${CX}" y1="199" x2="${CX}" y2="193" stroke="#3a2c1c" stroke-width="2.4"/>`;
        if (lampLit) out += flame(CX, 194, 0.48, Math.sin(clock / 70) * 1.2, ['#fbbf24', '#60a5fa']);
        out += `<text class="small-label" x="${CX - 92}" y="224" text-anchor="end">알코올램프</text><line x1="${CX - 90}" y1="220" x2="${CX - 24}" y2="220" stroke="#94a3b8" stroke-width="1"/>`;
        out += `<line x1="${CX - 66}" y1="178" x2="${CX - 82}" y2="${BENCH}" stroke="#6b7780" stroke-width="4.5" stroke-linecap="round"/>`;
        out += `<line x1="${CX + 66}" y1="178" x2="${CX + 82}" y2="${BENCH}" stroke="#6b7780" stroke-width="4.5" stroke-linecap="round"/>`;
        out += `<rect x="${CX - 72}" y="174" width="144" height="5" rx="2" fill="#6b7780"/>`;
        const plateFill = `rgb(${Math.round(138 + 70 * heatFrac)},${Math.round(150 - 40 * heatFrac)},${Math.round(160 - 70 * heatFrac)})`;
        out += `<rect x="${CX - 80}" y="${PLATE}" width="160" height="6" rx="1.5" fill="${plateFill}" stroke="#55606a" stroke-width="1.2"/>`;
        out += `<text class="small-label" x="${CX - 86}" y="${PLATE + 6}" text-anchor="end">철판</text>`;

        // the fuel on the plate
        let flameBase = PLATE;
        if (state.fuel === 'candle') {
            const used = ignited ? 12 * p : 0;
            const top = 118 + used;
            out += `<ellipse cx="${CX}" cy="${PLATE - 2}" rx="19" ry="4" fill="#a3adb5" stroke="#6b7780" stroke-width="1.2"/>`;
            out += `<rect x="${CX - 10}" y="${top.toFixed(1)}" width="20" height="${(PLATE - 3 - top).toFixed(1)}" rx="2" fill="#f4ead6" stroke="#c9b993" stroke-width="1.2"/>`;
            out += `<rect x="${CX - 6}" y="${(top + 4).toFixed(1)}" width="4" height="${(PLATE - 12 - top).toFixed(1)}" rx="2" fill="#fbf6ea"/>`;
            if (ignited) out += `<ellipse cx="${CX}" cy="${(top + 1).toFixed(1)}" rx="7" ry="2" fill="#e8d6b0"/>`;
            out += `<line x1="${CX}" y1="${top.toFixed(1)}" x2="${CX}" y2="${(top - 7).toFixed(1)}" stroke="${ignited ? '#1f160d' : '#3a2c1c'}" stroke-width="2.2" stroke-linecap="round"/>`;
            flameBase = top - 5;
        } else if (state.fuel === 'paper') {
            const left = ignited ? 1 - 0.75 * p : 1;
            const w = 26 * left;
            out += `<path d="M${(CX - w).toFixed(1)},${PLATE} L${(CX - w + 4).toFixed(1)},${PLATE - 9} L${(CX - w / 3).toFixed(1)},${PLATE - 5} L${CX},${PLATE - 13} L${(CX + w / 2).toFixed(1)},${PLATE - 6} L${(CX + w).toFixed(1)},${PLATE - 10} L${(CX + w).toFixed(1)},${PLATE} Z" fill="#efe8d8" stroke="#b9ad92" stroke-width="1.2"/>`;
            if (ignited && p > 0) out += `<path d="M${(CX - w).toFixed(1)},${PLATE} L${(CX + w).toFixed(1)},${PLATE}" stroke="#3b2f25" stroke-width="3"/>`;
            flameBase = PLATE - 8;
        } else {
            out += `<text class="small-label" x="${CX}" y="${PLATE - 10}" text-anchor="middle">빈 철판</text>`;
        }

        // flame: catches when the plate passes the ignition point, flickers, shrinks as the trapped oxygen runs low
        const alive = ignited && (a.outcome === 'burn' || (a.outcome === 'out' && (phase === 'heat' || o2 > O2_FLOOR + 0.001)));
        if (alive && a.hasFuel) {
            const grow = Math.min(1, sinceIgnite / 400);
            const strength = (state.oxygen === 'closed' ? 0.35 + 0.65 * ((o2 - O2_FLOOR) / (O2_START - O2_FLOOR)) : 1) * grow;
            const flick = phase === 'done' ? 1 : 1 + 0.07 * Math.sin(clock / 85) + 0.04 * Math.sin(clock / 37);
            const sway = phase === 'done' ? 0 : Math.sin(clock / 120) * 2.2 * strength;
            out += flame(CX, flameBase, strength * flick, sway);
        } else if (a.outcome === 'out' && ignited && (phase === 'tail' || phase === 'done' || p >= 1)) {
            const age = phase === 'tail' ? (clock - phaseStart) / TAIL_MS : 1;
            for (let i = 0; i < 4; i += 1) {
                const rise = (age * 34 + i * 9) % 40;
                const op = phase === 'done' ? 0.45 - i * 0.08 : Math.max(0, 0.7 - rise / 50);
                out += `<path d="M${CX + Math.sin(i * 2 + age * 6) * 3},${(flameBase - 2 - rise).toFixed(1)} q6,-6 0,-12 q-6,-6 0,-12" fill="none" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" opacity="${op.toFixed(2)}"/>`;
            }
        }

        // the jar sits on the plate and traps the air; its inside mists over as water forms
        if (state.oxygen === 'closed') {
            const half = 34 + (state.jar - 250) / 250 * 8;
            const mist = a.outcome === 'out' && ignited ? Math.min(1, p * 1.4) : 0;
            const jarPath = `M${CX - half},${PLATE} L${CX - half},76 Q${CX - half},62 ${CX - half + 12},62 L${CX + half - 12},62 Q${CX + half},62 ${CX + half},76 L${CX + half},${PLATE}`;
            out += `<path d="${jarPath} Z" fill="rgba(186,224,238,.18)"/>`;
            if (mist > 0) out += `<path d="M${CX - half + 3},${PLATE} L${CX - half + 3},78 Q${CX - half + 3},66 ${CX - half + 14},66 L${CX + half - 14},66 Q${CX + half - 3},66 ${CX + half - 3},78 L${CX + half - 3},${PLATE} Z" fill="#cfdde3" opacity="${(0.5 * mist).toFixed(2)}"/>`;
            out += `<path d="${jarPath}" fill="none" stroke="#6fa7bb" stroke-width="2.4"/>`;
            out += `<path d="M${CX - half + 6},80 V${PLATE - 10}" stroke="#ffffff" stroke-width="3" opacity=".7"/>`;
            out += `<text class="part-label" x="${CX}" y="54" text-anchor="middle">${state.jar} mL 유리병</text>`;
        }

        // digital thermometer whose probe touches the plate
        out += `<path d="M318,150 C300,150 300,172 ${CX + 78},171" fill="none" stroke="#475569" stroke-width="2"/>`;
        out += `<rect x="318" y="128" width="96" height="42" rx="7" fill="#e2e8f0" stroke="#64748b" stroke-width="1.6"/>`;
        out += `<rect x="325" y="134" width="82" height="30" rx="4" fill="#f8fafc" stroke="#94a3b8"/>`;
        out += `<text class="read-text" x="366" y="155" text-anchor="middle">${Math.round(temp)} ℃</text>`;
        out += `<text class="small-label" x="366" y="120" text-anchor="middle">온도계</text>`;
        if (a.hasFuel) out += `<text class="ignite-text" x="366" y="190" text-anchor="middle">발화점 ${a.fuel.ignite} ℃</text>`;

        out += `<text class="part-label" x="318" y="34">산소 농도</text>`;
        out += `<text class="read-text" x="318" y="52">${o2.toFixed(1)} %</text>`;
        out += `<text class="part-label" x="318" y="80">지난 시간</text>`;
        out += `<text class="read-text" x="318" y="98">${t.toFixed(1)} 초</text>`;

        if (finished) {
            const text = `${a.fuel.label} · ${state.oxygen === 'open' ? '열어 둠' : '덮음'} · ${state.temp} ℃ → ${VERDICT[a.outcome]}`;
            out += `<text class="verdict-text" fill="${TONE[a.outcome]}" x="14" y="24">${text}</text>`;
        }
        window.scienceScene.render(mainGroup,out);
    }

    /* ------------------------------------------------------------- graph */
    const AXIS_T = 14;   // fixed time axis so its length does not hint at the result
    function graphFrame(xTicks, yTicks, xTitle, yTitle) {
        let out = '';
        yTicks.forEach(([v, y]) => {
            out += `<line class="grid-line" x1="${GRAPH.x0}" y1="${y.toFixed(1)}" x2="${GRAPH.x1}" y2="${y.toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(y + 4).toFixed(1)}" text-anchor="end">${v}</text>`;
        });
        xTicks.forEach(([v, x]) => {
            out += `<text class="axis-text" x="${x.toFixed(1)}" y="${GRAPH.y0 + 16}" text-anchor="middle">${v}</text>`;
        });
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-name" x="${GRAPH.x1}" y="${GRAPH.y0 + 34}" text-anchor="end">${xTitle}</text>`;
        out += `<text class="axis-name" x="${GRAPH.x0 + 4}" y="${GRAPH.y1 - 8}">${yTitle}</text>`;
        return out;
    }

    function graph(a) {
        const total = a.runFor, t = state.progress * total;
        const gx = s => GRAPH.x0 + (s / AXIS_T) * (GRAPH.x1 - GRAPH.x0);
        const gy = v => GRAPH.y0 - ((v - 14) / 8) * (GRAPH.y0 - GRAPH.y1);
        let out = graphFrame(
            [0, 2, 4, 6, 8, 10, 12, 14].map(v => [v, gx(v)]),
            [16, 18, 20, 22].map(v => [v, gy(v)]),
            '시간 (초)', '산소 농도 (%)');
        out += `<line class="limit-line" x1="${GRAPH.x0}" y1="${gy(O2_FLOOR).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(O2_FLOOR).toFixed(1)}"/>`;
        out += `<text class="limit-text" x="${GRAPH.x1 - 4}" y="${(gy(O2_FLOOR) - 5).toFixed(1)}" text-anchor="end">꺼지는 농도 ${O2_FLOOR} %</text>`;
        if (phase === 'run' || phase === 'tail' || phase === 'done') {
            const pts = [];
            for (let i = 0; i <= 80; i += 1) { const s = (t * i) / 80; pts.push(`${gx(s).toFixed(1)},${gy(o2At(s, a)).toFixed(1)}`); }
            if (t > 0) out += `<path class="trace" d="M${pts.join('L')}"/>`;
            out += `<circle class="trace-dot" cx="${gx(t).toFixed(1)}" cy="${gy(o2At(t, a)).toFixed(1)}" r="5" fill="#0284c7"/>`;
        }
        return out;
    }

    function noteFor(a) {
        const t = state.progress * a.runFor;
        const burned = a.outcome !== 'none' && state.progress > 0;
        return `<div class="data-row"><span class="data-name">탈 물질</span><span class="data-val">${a.fuel.label}${a.hasFuel ? ` · 발화점 ${a.fuel.ignite} ℃` : ' — 없으면 탈 수 없습니다'}</span></div>` +
            `<div class="data-row"><span class="data-name">온도</span><span class="data-val">${state.temp} ℃ ${a.hasFuel ? (a.hotEnough ? '— 발화점 이상' : '— 발화점보다 낮음') : ''}</span></div>` +
            `<div class="data-row"><span class="data-name">산소</span><span class="data-val">${state.oxygen === 'open' ? '계속 들어옴 (21 %)' : `${state.jar} mL 안에 갇힘 · 지금 ${o2At(t, a).toFixed(1)} %`}</span></div>` +
            (state.oxygen === 'closed' && finished && a.outcome === 'out'
                ? `<div class="data-row"><span class="data-name">꺼지기까지</span><span class="data-val">쓸 수 있는 산소 ${(((O2_START - O2_FLOOR) / 100) * state.jar).toFixed(1)} mL ÷ 초당 ${O2_RATE} mL = ${a.outTime.toFixed(1)} 초</span></div>`
                : '') +
            `<div class="data-row"><span class="data-name">타서 생긴 것</span><span class="data-val">${burned ? PRODUCTS : '아직 없음'}</span></div>` +
            (finished ? `<div class="data-row match"><span class="data-name">결과</span><span class="data-val">${VERDICT[a.outcome]}</span></div>` : '');
    }

    function render() {
        const a = analyse();
        renderMain(a);
        window.scienceScene.render(graphGroup,graph(a));
        const tOut = document.getElementById('tempRangeOut');
        if (tOut) tOut.textContent = `${state.temp} ℃`;
        const jOut = document.getElementById('jarRangeOut');
        if (jOut) jOut.textContent = `${state.jar} mL`;
        stageBadge.textContent = finished ? `${a.fuel.label} · ${VERDICT[a.outcome]}` : phase === 'idle' ? `${a.fuel.label} · 준비` : `${a.fuel.label} · 실험 중`;
        window.scienceScene.render(dataNote,noteFor(a));
        return a;
    }

    /* --------------------------------------------------------------- run */
    function tick(dt) {
        if (phase === 'idle' || phase === 'heat') phase = 'run';
        state.progress = Math.min(1, state.progress + dt / runSeconds());
        render();
        return state.progress >= 1;
    }

    function stopRun() { running = false; if (frameId) cancelAnimationFrame(frameId); frameId = 0; }

    function frame(stamp) {
        if (!running) return;
        clock = stamp;
        if (phase === 'heat') {
            if (stamp - phaseStart >= HEAT_MS) { phase = 'run'; phaseStart = stamp; lastStamp = stamp; }
            render();
            frameId = requestAnimationFrame(frame); return;
        }
        if (phase === 'run') {
            const dt = Math.min(0.05, (stamp - lastStamp) / 1000 || 0);
            lastStamp = stamp;
            state.progress = Math.min(1, state.progress + dt / runSeconds());
            if (state.progress >= 1) {
                const a = analyse();
                if (a.outcome === 'out') { phase = 'tail'; phaseStart = stamp; }
                else { stopRun(); phase = 'done'; finish(); return; }
            }
            render();
            frameId = requestAnimationFrame(frame); return;
        }
        if (phase === 'tail') {
            if (stamp - phaseStart >= TAIL_MS) { stopRun(); phase = 'done'; finish(); return; }
            render();
            frameId = requestAnimationFrame(frame);
        }
    }

    function startRun() {
        stopRun();
        state.progress = 0;
        finished = false;
        hideResult();
        if (reducedMotion()) { phase = 'run'; state.progress = 1; phase = 'done'; finish(); return; }
        running = true;
        phase = 'heat';
        clock = phaseStart = lastStamp = performance.now();
        render();
        frameId = requestAnimationFrame(frame);
    }

    function hideResult() { resultEmpty.hidden = false; resultContent.hidden = true; }

    function finish() {
        finished = true;
        phase = 'done';
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
        phase = 'idle';
        finished = false;
        hideResult();
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
        setProgress(p) { stopRun(); phase = p > 0 ? 'run' : 'idle'; state.progress = p; render(); },
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
