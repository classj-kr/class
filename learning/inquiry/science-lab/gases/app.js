document.addEventListener('DOMContentLoaded', () => {
    const modeButtons = [...document.querySelectorAll('[data-mode]')];
    const controlArea = document.getElementById('controlArea');
    const predictionArea = document.getElementById('predictionArea');
    const predictionLegend = document.getElementById('predictionLegend');
    const methodHint = document.getElementById('methodHint');
    const checkBtn = document.getElementById('checkBtn');
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

    const GRAPH = { x0: 62, x1: 424, y0: 152, y1: 26 };
    const RUN_SECONDS = 8;

    const batchim = w => { const c = w.charCodeAt(w.length - 1); return c >= 0xAC00 && c <= 0xD7A3 ? (c - 0xAC00) % 28 !== 0 : false; };
    const eul = w => w + (batchim(w) ? '을' : '를');

    /* -------------------------------------------------------------- data */
    const GASES = {
        oxygen: { name: '산소', liquid: '묽은 과산화 수소수', solid: '이산화 망가니즈', liquidClass: 'liquid-h2o2', solidClass: 'powder-dark',
                  incense: 'flare', lime: 'none', uses: '숨쉬기·병원 산소통·물질이 타는 것을 도움' },
        co2: { name: '이산화 탄소', liquid: '진한 식초', solid: '탄산수소 나트륨', liquidClass: 'liquid-vinegar', solidClass: 'powder-white',
               incense: 'out', lime: 'cloudy', uses: '소화기·탄산음료·드라이아이스' },
    };
    const TESTS = {
        incense: { name: '향불 넣기' },
        lime: { name: '석회수 넣기' },
    };
    const BOTTLE_ML = 250, COLLECT_SECONDS = 40;   // the bottle fills in about 40 s of real experiment
    const COLLECT_PART = 0.6;                       // share of the run spent collecting; the rest is the test

    // A syringe of air: pressing adds pressure, warming raises temperature. Volume
    // follows P·V ∝ T. The piston face is 2 cm², so a 1 kg weight adds 49 kPa.
    const V0 = 40, P_AIR = 101, T0 = 293;           // mL, kPa, K (20 ℃)
    const PISTON_CM2 = 2;
    const WEIGHTS = [0, 1, 2];                      // kg
    const TEMPS = [0, 20, 60];                      // ℃
    const pressureOf = kg => P_AIR + (kg * 9.8) / (PISTON_CM2 * 1e-4) / 1000;
    const volumeOf = (kg, celsius) => V0 * (P_AIR / pressureOf(kg)) * ((celsius + 273) / T0);

    const state = {
        mode: 'make',
        gas: 'oxygen', test: 'incense',
        weight: 1, temp: 20,
        progress: 0, prediction: null,
    };
    let running = false, frameId = 0, lastStamp = 0;

    /* ------------------------------------------------------------ models */
    function analyseMake(s = state) {
        const gas = GASES[s.gas], test = TESTS[s.test];
        const verdict = s.test === 'incense' ? gas.incense : gas.lime;
        return { kind: 'make', gas, test, verdict };
    }
    const collectedAt = p => BOTTLE_ML * Math.min(1, p / COLLECT_PART);
    const testAt = p => Math.max(0, (p - COLLECT_PART) / (1 - COLLECT_PART));

    function analysePress(s = state) {
        const P = pressureOf(s.weight), V = volumeOf(s.weight, s.temp);
        const byPress = V0 * (P_AIR / P), byHeat = V0 * ((s.temp + 273) / T0);
        const verdict = V < V0 - 0.5 ? 'smaller' : V > V0 + 0.5 ? 'bigger' : 'same';
        return { kind: 'press', P, V, byPress, byHeat, verdict };
    }
    const volumeAt = (a, p) => V0 + (a.V - V0) * Math.min(1, p * 1.25);

    const analyse = () => (state.mode === 'make' ? analyseMake() : analysePress());

    /* ---------------------------------------------------------- controls */
    function pickRow(legend, name, options, current, cols) {
        return `<fieldset class="pick-field"><legend>${legend}</legend>` +
            `<div class="pick-buttons cols${cols}" data-pick="${name}">` +
            options.map(o => `<button type="button" data-value="${o.value}" class="${o.value === String(current) ? 'selected' : ''}">` +
                `${o.label}${o.hint ? `<small>${o.hint}</small>` : ''}</button>`).join('') +
            `</div></fieldset>`;
    }

    function buildControls() {
        if (state.mode === 'make') {
            controlArea.innerHTML =
                pickRow('만들 기체', 'gas', Object.entries(GASES).map(([k, v]) => ({ value: k, label: v.name, hint: `${v.liquid} + ${v.solid}` })), state.gas, 2) +
                pickRow('확인 방법', 'test', Object.entries(TESTS).map(([k, v]) => ({ value: k, label: v.name })), state.test, 2);
        } else {
            controlArea.innerHTML =
                pickRow('피스톤 위에 올릴 추', 'weight', WEIGHTS.map(w => ({ value: String(w), label: w ? `${w} kg` : '없음' })), state.weight, 3) +
                pickRow('주사기를 담근 물', 'temp', TEMPS.map(t => ({ value: String(t), label: `${t} ℃`, hint: t === 0 ? '얼음물' : t === 20 ? '실온 물' : '뜨거운 물' })), state.temp, 3);
        }
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                const v = button.dataset.value;
                state[group.dataset.pick] = ['weight', 'temp'].includes(group.dataset.pick) ? Number(v) : v;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                if (group.dataset.pick === 'test') buildPrediction();
                settingsChanged();
            }));
        });
    }

    const PRED_INCENSE = [{ value: 'flare', label: '불꽃이 활활 커진다' }, { value: 'out', label: '불이 꺼진다' }, { value: 'steady', label: '그대로 탄다' }];
    const PRED_LIME = [{ value: 'cloudy', label: '뿌옇게 흐려진다' }, { value: 'none', label: '변화가 없다' }, { value: 'red', label: '붉게 변한다' }];
    const PRED_PRESS = [{ value: 'smaller', label: '줄어든다' }, { value: 'bigger', label: '늘어난다' }, { value: 'same', label: '그대로다' }];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list = state.mode === 'make' ? (state.test === 'incense' ? PRED_INCENSE : PRED_LIME) : PRED_PRESS;
        predictionLegend.textContent = state.mode === 'make'
            ? (state.test === 'incense' ? '향불을 넣으면 어떻게 될까요?' : '석회수를 넣고 흔들면 어떻게 될까요?')
            : '주사기 속 공기의 부피는 어떻게 될까요?';
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    let finished = false;
    const seen = new Set();          // results the student has actually produced, shown in the table
    const VERD_MAKE = { flare: '불꽃이 활활 커진다', out: '불이 꺼진다', cloudy: '석회수가 뿌옇게 된다', none: '석회수는 그대로' };

    function renderMake(a, p) {
        const ml = collectedAt(p), tp = testAt(p);
        const making = running && p > 0.005 && p < COLLECT_PART;
        let out = '';
        const BENCH = 222;
        out += `<rect x="0" y="${BENCH}" width="460" height="18" fill="#eadfcd"/><line x1="0" y1="${BENCH}" x2="460" y2="${BENCH}" stroke="#c7b79c" stroke-width="2"/>`;

        // conical flask closed with a rubber stopper; the delivery tube passes through the stopper
        const FX = 70, NECK = 104, BASE = BENCH - 2;
        out += `<path d="M${FX - 34},${BASE - 34} L${FX - 37},${BASE - 6} Q${FX - 38},${BASE - 2} ${FX - 33},${BASE - 2} L${FX + 33},${BASE - 2} Q${FX + 38},${BASE - 2} ${FX + 37},${BASE - 6} L${FX + 34},${BASE - 34} Z" class="${a.gas.liquidClass}"/>`;
        out += `<ellipse class="${a.gas.solidClass}" cx="${FX}" cy="${BASE - 6}" rx="20" ry="3.5"/>`;
        if (making) {
            for (let i = 0; i < 10; i += 1) {
                const ph = (p * 14 + i * 0.29) % 1;
                out += `<circle cx="${(FX - 22 + ((i * 29) % 44)).toFixed(1)}" cy="${(BASE - 8 - ph * 26).toFixed(1)}" r="${(1.6 + (i % 3) * 0.7).toFixed(1)}" fill="#f8fafc" stroke="#64748b" stroke-width="1"/>`;
            }
            // froth on the surface
            out += `<path d="M${FX - 32},${BASE - 34} q8,-6 16,0 q8,-6 16,0 q8,-6 16,0 q8,-6 16,0" fill="none" stroke="#94a3b8" stroke-width="1.5"/>`;
        }
        out += `<path class="glass" d="M${FX - 11},${NECK} L${FX - 11},${NECK + 30} L${FX - 42},${BASE - 6} Q${FX - 44},${BASE} ${FX - 36},${BASE} L${FX + 36},${BASE} Q${FX + 44},${BASE} ${FX + 42},${BASE - 6} L${FX + 11},${NECK + 30} L${FX + 11},${NECK}"/>`;
        out += `<path d="M${FX - 14},${NECK - 12} H${FX + 14} L${FX + 12},${NECK + 8} H${FX - 12} Z" fill="#9a3f32" stroke="#6b2a20" stroke-width="1.4"/>`;

        // water trough with a shelf; the inverted bottle's mouth stays under water on the shelf
        const TX = 156, TW = 180, TTOP = 128, WATER = 146, TBOT = BENCH;
        const BX = 214, BW = 64, BT = 30, MOUTH = 192;
        out += `<rect x="${TX + 2}" y="${WATER}" width="${TW - 4}" height="${TBOT - WATER - 2}" fill="rgba(82,160,220,.28)"/>`;
        out += `<line x1="${TX + 2}" y1="${WATER}" x2="${TX + TW - 2}" y2="${WATER}" stroke="#4f97c4" stroke-width="1.5"/>`;
        // shelf (bottle stand) with a hole the tube points into
        out += `<path d="M${BX - 12},${MOUTH} H${BX + 18} M${BX + 46},${MOUTH} H${BX + BW + 12}" stroke="#7c8a93" stroke-width="5" stroke-linecap="round"/>`;
        out += `<path d="M${BX - 8},${MOUTH} V${TBOT - 2} M${BX + BW + 8},${MOUTH} V${TBOT - 2}" stroke="#7c8a93" stroke-width="3"/>`;

        const inTrough = tp <= 0;
        // delivery tube: up from the stopper, over the rim, down into the water and up under the bottle mouth
        const TUBE_END_X = BX + BW / 2, TUBE_END_Y = MOUTH + 4;
        out += `<path class="tube" d="M${FX},${NECK - 10} V${NECK - 40} Q${FX},${NECK - 52} ${FX + 12},${NECK - 52} H${TX - 4} Q${TX + 12},${NECK - 52} ${TX + 12},${NECK - 36} V${MOUTH + 14} Q${TX + 12},${MOUTH + 22} ${TX + 22},${MOUTH + 22} H${TUBE_END_X - 8} Q${TUBE_END_X},${MOUTH + 22} ${TUBE_END_X},${MOUTH + 14} V${TUBE_END_Y}"/>`;

        if (inTrough) {
            const neckL = BX + 14, neckR = BX + BW - 14;
            const bottlePath = `M${neckL},${MOUTH} L${neckL},${MOUTH - 10} Q${BX},${MOUTH - 18} ${BX},${MOUTH - 30} L${BX},${BT + 8} Q${BX},${BT} ${BX + 8},${BT} L${BX + BW - 8},${BT} Q${BX + BW},${BT} ${BX + BW},${BT + 8} L${BX + BW},${MOUTH - 30} Q${BX + BW},${MOUTH - 18} ${neckR},${MOUTH - 10} L${neckR},${MOUTH}`;
            // inside: gas on top, water below; the gas pushes the water down
            const fullH = (WATER - 2) - (BT + 2);
            const gasH = fullH * (ml / BOTTLE_ML);
            out += `<clipPath id="gasBottleClip"><path d="${bottlePath} Z"/></clipPath>`;
            out += `<g clip-path="url(#gasBottleClip)"><rect x="${BX}" y="${(BT + gasH).toFixed(1)}" width="${BW}" height="${(MOUTH - BT - gasH + 2).toFixed(1)}" fill="rgba(82,160,220,.36)"/>`;
            if (gasH > 0.5) out += `<line x1="${BX}" y1="${(BT + gasH).toFixed(1)}" x2="${BX + BW}" y2="${(BT + gasH).toFixed(1)}" stroke="#4f97c4" stroke-width="1.5"/>`;
            out += `</g>`;
            out += `<path class="glass" d="${bottlePath}" style="stroke:#6fa7bb;stroke-width:2.4"/>`;
            if (making) {
                for (let i = 0; i < 6; i += 1) {
                    const ph = (p * 16 + i * 0.17) % 1;
                    const top = BT + gasH + 4;
                    const by = TUBE_END_Y - 2 - ph * (TUBE_END_Y - 2 - top);
                    out += `<circle cx="${(TUBE_END_X - 6 + ((i * 7) % 13) + Math.sin(ph * 9 + i) * 3).toFixed(1)}" cy="${by.toFixed(1)}" r="${(2 + (i % 3) * 0.8).toFixed(1)}" fill="#f8fafc" stroke="#4f97c4" stroke-width="1"/>`;
                }
            }
            out += `<text class="read-text" x="${BX + BW + 10}" y="${BT + 18}">${Math.round(ml)} mL</text>`;
            out += `<text class="label-text" x="${BX + BW + 10}" y="${BT + 38}">집기병</text>`;
        }
        out += `<path class="glass" d="M${TX},${TTOP} V${TBOT} H${TX + TW} V${TTOP}" style="stroke:#6fa7bb;stroke-width:2.4"/>`;
        out += `<text class="label-text" x="${TX + TW - 6}" y="${TTOP - 6}" text-anchor="end">수조</text>`;
        out += `<text class="label-text" x="${FX}" y="${NECK - 60}" text-anchor="middle">고무관</text>`;

        // the test: the full bottle is lifted out, stood upright and tested
        const RX = 404;
        if (!inTrough) {
            out += `<path d="M${RX - 26},${BENCH - 2} V96 Q${RX - 26},88 ${RX - 18},88 H${RX + 18} Q${RX + 26},88 ${RX + 26},96 V${BENCH - 2} Z" fill="rgba(186,224,238,.25)" stroke="#6fa7bb" stroke-width="2.4"/>`;
            out += `<text class="label-text" x="${RX}" y="${BENCH + 16}" text-anchor="middle">모은 ${a.gas.name}</text>`;
            if (state.test === 'incense') {
                const dip = Math.min(1, tp * 2);
                const y0 = 50 + dip * 70;
                out += `<line class="incense" x1="${RX}" y1="${y0}" x2="${RX + 4}" y2="${y0 - 52}"/>`;
                const k = a.verdict === 'flare' ? Math.min(1, Math.max(0, (tp - 0.45) / 0.35)) : 0;
                const dying = a.verdict === 'out' ? Math.max(0, 1 - Math.max(0, (tp - 0.45) / 0.3)) : 1;
                out += `<circle class="ember" opacity="${dying.toFixed(2)}" cx="${RX}" cy="${y0 + 2}" r="${(3 + 3 * k).toFixed(1)}"/>`;
                if (k > 0.05) { const fl = 1 + 0.08 * Math.sin(p * 120); out += `<path class="flame" opacity="${k.toFixed(2)}" d="M${RX},${y0 + 2} C${RX - 10 * k},${y0 - 6 * k} ${RX - 8 * k},${y0 - 22 * k * fl} ${RX},${y0 - 30 * k * fl} C${RX + 8 * k},${y0 - 22 * k * fl} ${RX + 10 * k},${y0 - 6 * k} ${RX},${y0 + 2} Z"/>`; }
                if (a.verdict === 'out' && dying < 0.5) for (let i = 0; i < 3; i += 1) out += `<path d="M${RX + i * 4 - 4},${y0 - 6 - i * 9 - (1 - dying) * 8} q5,-6 0,-11" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>`;
                out += `<text class="label-text" x="${RX - 30}" y="${y0 - 34}" text-anchor="end">향불</text>`;
            } else {
                out += `<rect x="${RX - 22}" y="80" width="44" height="7" rx="2" fill="#94a3b8"/>`;
                const fill = Math.min(1, tp * 2.5);
                const h = 40 * fill;
                const shake = tp > 0.35 && tp < 0.8 ? Math.sin(p * 160) * 3 : 0;
                out += `<g transform="rotate(${shake.toFixed(1)} ${RX} ${BENCH})">`;
                out += `<rect x="${RX - 24}" y="${(BENCH - 4 - h).toFixed(1)}" width="48" height="${h.toFixed(1)}" fill="rgba(200,228,240,.7)"/>`;
                const cloud = a.verdict === 'cloudy' ? Math.min(1, Math.max(0, (tp - 0.45) / 0.4)) : 0;
                if (cloud > 0) out += `<rect x="${RX - 24}" y="${(BENCH - 4 - h).toFixed(1)}" width="48" height="${h.toFixed(1)}" fill="#e7ecef" opacity="${(0.92 * cloud).toFixed(2)}"/>`;
                out += `</g>`;
                out += `<text class="label-text" x="${RX - 30}" y="${BENCH - 20}" text-anchor="end">석회수</text>`;
            }
        }
        if (finished) out += `<text class="verdict-text" fill="#b45309" x="16" y="18">${a.gas.name} · ${a.test.name} → ${VERD_MAKE[a.verdict]}</text>`;
        else if (p > 0) out += `<text class="label-text" x="16" y="18">${p < COLLECT_PART ? `기체 모으는 중 · ${Math.round(p / COLLECT_PART * COLLECT_SECONDS)}초` : `${a.test.name}`}</text>`;
        return out;
    }

    function renderPress(a, p) {
        const V = volumeAt(a, p);
        const SX = 200, TOP = 50, BOT = 180, W = 44;          // barrel spans 0..60 mL over its height
        const mlToY = ml => BOT - (ml / 60) * (BOT - TOP);
        const cls = state.temp === 60 ? ' hot' : state.temp === 0 ? ' cold' : '';
        let out = `<rect class="bath${cls}" x="${SX - 110}" y="${TOP + 50}" width="220" height="${BOT + 10 - (TOP + 50)}" rx="6"/>`;
        out += `<text class="label-text" x="${SX - 100}" y="${BOT + 2}">${state.temp} ℃ 물</text>`;
        out += `<rect class="syringe" x="${SX - W / 2}" y="${TOP - 4}" width="${W}" height="${BOT - TOP + 8}" rx="4"/>`;
        out += `<rect class="syringe" x="${SX - 4}" y="${BOT + 4}" width="8" height="8"/>`;
        for (let ml = 0; ml <= 60; ml += 10) {
            out += `<line class="scale-tick" x1="${SX + W / 2}" y1="${mlToY(ml).toFixed(1)}" x2="${SX + W / 2 + (ml % 20 === 0 ? 10 : 6)}" y2="${mlToY(ml).toFixed(1)}"/>`;
            if (ml % 20 === 0) out += `<text class="axis-text" x="${SX + W / 2 + 14}" y="${(mlToY(ml) + 3).toFixed(1)}">${ml}</text>`;
        }
        out += `<text class="axis-text" x="${SX + W / 2 + 14}" y="${TOP - 10}">mL</text>`;
        // air inside, drawn as the same dots squeezed or spread
        const py = mlToY(V);
        const airH = BOT - py;
        for (let i = 0; i < 24; i += 1) {
            const fx = 0.12 + ((i * 37) % 76) / 100, fy = ((i * 53) % 100) / 100;
            out += `<circle class="air-dot" cx="${(SX - W / 2 + fx * W).toFixed(1)}" cy="${(py + 3 + fy * (airH - 6)).toFixed(1)}" r="2.2"/>`;
        }
        // piston and plunger, with the weight on top
        out += `<rect class="piston" x="${SX - W / 2 + 2}" y="${(py - 6).toFixed(1)}" width="${W - 4}" height="6"/>`;
        out += `<rect class="plunger" x="${SX - 4}" y="${(py - 40).toFixed(1)}" width="8" height="34"/>`;
        out += `<rect class="plunger" x="${SX - 22}" y="${(py - 46).toFixed(1)}" width="44" height="6" rx="2"/>`;
        if (state.weight > 0) {
            const wh = 10 + state.weight * 8;
            out += `<rect class="weight" x="${SX - 16}" y="${(py - 46 - wh).toFixed(1)}" width="32" height="${wh}" rx="3"/>`;
            out += `<text class="weight-text" x="${SX}" y="${(py - 46 - wh / 2 + 4).toFixed(1)}" text-anchor="middle">${state.weight} kg</text>`;
        }
        // the 40 mL start line
        out += `<line class="start-line" x1="${SX - W / 2 - 12}" y1="${mlToY(V0).toFixed(1)}" x2="${SX + W / 2}" y2="${mlToY(V0).toFixed(1)}"/>`;
        out += `<text class="axis-text" style="fill:#059669" x="${SX - W / 2 - 16}" y="${(mlToY(V0) + 3).toFixed(1)}" text-anchor="end">처음 40 mL</text>`;
        // readouts
        out += `<text class="part-label" x="330" y="70">공기의 부피</text>`;
        out += `<text class="read-text" x="330" y="90">${V.toFixed(1)} mL</text>`;
        out += `<text class="part-label" x="330" y="116">누르는 정도</text>`;
        out += `<text class="note-text" x="330" y="132">${state.weight ? `추 ${state.weight} kg` : '추 없음'} · ${Math.round(a.P)} kPa</text>`;
        out += `<text class="part-label" x="330" y="156">온도</text>`;
        out += `<text class="note-text" x="330" y="172">${state.temp} ℃ ${state.temp > 20 ? '(데움)' : state.temp < 20 ? '(식힘)' : '(실온)'}</text>`;
        const VERD = { smaller: '부피가 줄어든다', bigger: '부피가 늘어난다', same: '부피가 그대로다' };
        if (finished) out += `<text class="verdict-text" fill="#b45309" x="20" y="208">${state.weight ? `추 ${state.weight} kg` : '추 없음'} · ${state.temp} ℃ → ${VERD[a.verdict]}</text>`;
        return out;
    }

    function renderMain(a) {
        window.scienceScene.render(mainGroup,a.kind === 'make' ? renderMake(a, state.progress) : renderPress(a, state.progress));
    }

    /* ------------------------------------------------------------ graphs */
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

    // the table fills in only with results the student has produced
    function graphMake(a) {
        const rows = [
            { gas: 'oxygen', test: 'incense', text: '향불 → 불꽃이 활활 커짐' },
            { gas: 'oxygen', test: 'lime', text: '석회수 → 그대로 맑음' },
            { gas: 'co2', test: 'incense', text: '향불 → 불이 꺼짐' },
            { gas: 'co2', test: 'lime', text: '석회수 → 뿌옇게 흐려짐' },
        ];
        let out = `<text class="axis-title" x="${GRAPH.x0}" y="20">두 기체를 가려내는 표</text>`;
        out += `<text class="axis-text" x="${GRAPH.x0}" y="48">산소</text>`;
        out += `<text class="axis-text" x="${GRAPH.x0}" y="120">이산화 탄소</text>`;
        rows.forEach((r, i) => {
            const y = 44 + (i < 2 ? 0 : 72) + (i % 2) * 26 + 18;
            const key = `${r.gas}|${r.test}`, known = seen.has(key);
            const mine = r.gas === state.gas && r.test === state.test;
            out += `<rect class="bar" x="${GRAPH.x0 + 96}" y="${y - 14}" width="268" height="21" rx="4" fill="${known ? (mine ? '#fcd9a8' : '#e8eef1') : '#f8fafc'}" stroke="${mine ? '#d97706' : '#cbd5e1'}"/>`;
            out += `<text class="bar-text" fill="#0f172a" x="${GRAPH.x0 + 104}" y="${y + 2}">${known ? r.text : `${TESTS[r.test].name} → ?`}</text>`;
        });
        return out;
    }

    // volume under each weight at this temperature, and at each temperature under this weight
    function graphPress(a) {
        const vMax = 50;
        const gx = v => GRAPH.x0 + (v / vMax) * (GRAPH.x1 - GRAPH.x0);
        let out = graphFrame([0, 10, 20, 30, 40, 50].map(v => [`${v}`, gx(v)]), [], '공기의 부피 (mL)', '');
        const rows = [
            ...WEIGHTS.map(w => ({ label: `${w ? `추 ${w} kg` : '추 없음'} · ${state.temp} ℃`, v: volumeOf(w, state.temp), mine: w === state.weight, colour: '#ea580c' })),
            ...TEMPS.map(t => ({ label: `${state.weight ? `추 ${state.weight} kg` : '추 없음'} · ${t} ℃`, v: volumeOf(state.weight, t), mine: t === state.temp, colour: '#0284c7' })),
        ];
        rows.forEach((r, i) => {
            const y = GRAPH.y1 + 14 + i * 19 + (i >= 3 ? 8 : 0);
            const w = i < 3 ? WEIGHTS[i] : state.weight, t = i < 3 ? state.temp : TEMPS[i - 3];
            if (!seen.has(`press|${w}|${t}`)) { out += `<text class="bar-text" fill="#64748b" x="${GRAPH.x0 + 6}" y="${y + 4}">${r.label} → ?</text>`; return; }
            out += `<rect class="bar" x="${GRAPH.x0}" y="${y - 5}" width="${(gx(r.v) - GRAPH.x0).toFixed(1)}" height="11" rx="3" fill="${r.colour}" opacity="${r.mine ? '.95' : '.35'}"/>`;
            const inside = gx(r.v) > 300;
            out += `<text class="bar-text" fill="${inside ? '#10202a' : r.mine ? '#0f172a' : '#334155'}" font-weight="${r.mine ? '900' : '750'}" x="${(gx(r.v) + (inside ? -6 : 6)).toFixed(1)}" y="${y + 4}" text-anchor="${inside ? 'end' : 'start'}">${r.label} → ${r.v.toFixed(1)} mL</text>`;
        });
        out += `<line class="start-line" x1="${gx(V0).toFixed(1)}" y1="${GRAPH.y1 + 4}" x2="${gx(V0).toFixed(1)}" y2="${GRAPH.y0}"/>`;
        out += `<text class="axis-text" style="fill:#059669" x="${(gx(V0) - 4).toFixed(1)}" y="${GRAPH.y1 + 4}" text-anchor="end">처음 40 mL</text>`;
        return out;
    }

    function noteFor(a) {
        if (a.kind === 'make') {
            const p = state.progress;
            return `<div class="data-row"><span class="data-name">만드는 법</span><span class="data-val">${a.gas.liquid}에 ${eul(a.gas.solid)} 넣음</span></div>` +
                `<div class="data-row"><span class="data-name">모으는 법</span><span class="data-val">물이 가득 든 집기병을 뒤집어 물속에 두고 기체로 물을 밀어냄</span></div>` +
                `<div class="data-row"><span class="data-name">모인 기체</span><span class="data-val">${Math.round(collectedAt(p))} mL / ${BOTTLE_ML} mL</span></div>` +
                `<div class="data-row"><span class="data-name">색 · 냄새</span><span class="data-val">없음 · 없음 (두 기체 모두)</span></div>` +
                `<div class="data-row match"><span class="data-name">${a.test.name}</span><span class="data-val">${finished ? ({ flare: '불꽃이 활활 커짐', out: '불이 꺼짐', cloudy: '뿌옇게 흐려짐', none: '변화 없음' })[a.verdict] : '아직 확인 전'}</span></div>` +
                `<div class="data-row"><span class="data-name">쓰이는 곳</span><span class="data-val">${a.gas.uses}</span></div>`;
        }
        const V = volumeAt(a, state.progress);
        return `<div class="data-row"><span class="data-name">처음</span><span class="data-val">공기 ${V0} mL · 추 없음 · 20 ℃</span></div>` +
            `<div class="data-row"><span class="data-name">지금</span><span class="data-val">${V.toFixed(1)} mL</span></div>` +
            (finished ? `<div class="data-row"><span class="data-name">누르기만 하면</span><span class="data-val">${state.weight ? `추 ${state.weight} kg → ${a.byPress.toFixed(1)} mL` : '추가 없어 그대로 40 mL'}</span></div>` +
            `<div class="data-row"><span class="data-name">온도만 바꾸면</span><span class="data-val">${state.temp === 20 ? '실온 그대로 40 mL' : `${state.temp} ℃ → ${a.byHeat.toFixed(1)} mL`}</span></div>` +
            `<div class="data-row match"><span class="data-name">둘 다 하면</span><span class="data-val">${a.V.toFixed(1)} mL (${a.V < V0 ? `${(V0 - a.V).toFixed(1)} mL 줄어듦` : a.V > V0 ? `${(a.V - V0).toFixed(1)} mL 늘어남` : '그대로'})</span></div>` : '');
    }

    function render() {
        const a = analyse();
        renderMain(a);
        window.scienceScene.render(graphGroup,a.kind === 'make' ? graphMake(a) : graphPress(a));
        stageBadge.textContent = a.kind === 'make' ? `${a.gas.name} · ${a.test.name}` : `${state.weight ? `추 ${state.weight} kg` : '추 없음'} · ${state.temp} ℃`;
        methodHint.textContent = state.mode === 'make'
            ? '만든 기체를 물속 집기병에 모은 뒤 향불이나 석회수로 성질을 알아봅니다'
            : '추로 누르거나 물 온도를 바꾸며 공기의 부피를 재 봅니다';
        window.scienceScene.render(dataNote,noteFor(a));
        return a;
    }

    /* --------------------------------------------------------------- run */
    function tick(dt) {
        state.progress = Math.min(1, state.progress + dt / RUN_SECONDS);
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
        finished = false;
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) { state.progress = 1; finish(); return; }
        running = true;
        lastStamp = performance.now();
        render();
        frameId = requestAnimationFrame(frame);
    }

    function finish() {
        finished = true;
        { const a0 = analyse(); seen.add(a0.kind === 'make' ? `${state.gas}|${state.test}` : `press|${state.weight}|${state.temp}`); }
        const a = render();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        if (a.kind === 'make') {
            const RESULT = { flare: '불꽃이 활활 커짐', out: '불이 꺼짐', cloudy: '뿌옇게 흐려짐', none: '변화 없음' };
            labelA.textContent = a.test.name; labelB.textContent = '모인 기체';
            valueA.textContent = RESULT[a.verdict];
            valueB.textContent = `${a.gas.name} ${BOTTLE_ML} mL`;
            predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
                : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
            let s = `${a.gas.liquid}에 ${eul(a.gas.solid)} 넣자 거품이 일며 ${a.gas.name}가 생겨 고무관을 지나 집기병에 ${BOTTLE_ML} mL 모였습니다. `;
            if (a.verdict === 'flare') s += `향불을 넣으니 작은 불씨가 활활 타올랐습니다. 산소가 다른 물질이 타는 것을 돕기 때문입니다. 석회수를 넣었다면 아무 변화가 없었을 것입니다.`;
            else if (a.verdict === 'out') s += `향불을 넣으니 불이 꺼졌습니다. 이산화 탄소는 물질이 타는 것을 막기 때문에 소화기에 쓰입니다.`;
            else if (a.verdict === 'cloudy') s += `석회수를 넣고 흔드니 뿌옇게 흐려졌습니다. 이것이 이산화 탄소를 확인하는 방법입니다. 산소였다면 석회수가 그대로 맑았을 것입니다.`;
            else s += `석회수를 넣고 흔들어도 맑은 그대로였습니다. 석회수를 뿌옇게 하는 것은 이산화 탄소이고, 산소는 그렇게 하지 못합니다. 산소는 향불로 확인합니다.`;
            explanation.textContent = s;
            return;
        }
        labelA.textContent = '공기의 부피'; labelB.textContent = '처음';
        valueA.textContent = `${a.V.toFixed(1)} mL`;
        valueB.textContent = `${V0} mL`;
        predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        let s = '';
        if (state.weight && state.temp !== 20) {
            s = `추 ${state.weight} kg으로 누르면 공기가 ${a.byPress.toFixed(1)} mL로 줄고, ${state.temp} ℃ 물에 담그면 ${state.temp > 20 ? '데워져 늘어나' : '식어서 더 줄어'} 둘을 함께 하니 ${a.V.toFixed(1)} mL가 되었습니다. 기체는 누르는 힘과 온도에 따라 부피가 달라집니다.`;
        } else if (state.weight) {
            s = `추 ${state.weight} kg을 올리자 피스톤이 내려가 공기가 ${V0} mL에서 ${a.V.toFixed(1)} mL로 줄었습니다. 기체는 누르면 부피가 줄어들고, 추를 내리면 다시 ${V0} mL로 되돌아옵니다. 물이나 돌은 이렇게 눌리지 않습니다.`;
        } else if (state.temp > 20) {
            s = `뜨거운 ${state.temp} ℃ 물에 담그자 공기가 데워져 ${V0} mL에서 ${a.V.toFixed(1)} mL로 늘어나 피스톤이 밀려 올라갔습니다. 기체는 온도가 오르면 부피가 늘어납니다. 찌그러진 탁구공이 뜨거운 물에서 펴지는 까닭입니다.`;
        } else if (state.temp < 20) {
            s = `얼음물 ${state.temp} ℃에 담그자 공기가 식어 ${V0} mL에서 ${a.V.toFixed(1)} mL로 줄어 피스톤이 내려왔습니다. 기체는 온도가 내리면 부피가 줄어듭니다.`;
        } else {
            s = `추도 없고 실온 그대로여서 공기의 부피는 ${V0} mL로 변하지 않았습니다. 추를 올리거나 물 온도를 바꿔 보세요.`;
        }
        explanation.textContent = s;
    }

    function settingsChanged() {
        stopRun();
        state.progress = 0;
        finished = false;
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        render();
    }

    modeButtons.forEach(button => button.addEventListener('click', () => {
        state.mode = button.dataset.mode;
        state.prediction = null;
        modeButtons.forEach(item => item.classList.toggle('selected', item === button));
        buildControls();
        buildPrediction();
        stageCaption.textContent = state.mode === 'make'
            ? '플라스크에서 생긴 기체가 고무관을 지나 물속 집기병에 모입니다. 다 모이면 확인 도구를 넣습니다.'
            : '피스톤이 어디에서 멈추는지, 눈금으로 부피를 읽어 보세요. 초록 점선이 처음 40 mL입니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { gas: 'oxygen', test: 'incense', weight: 1, temp: 20, progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'make').click();
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

    window.__gasModel = {
        GASES, TESTS, WEIGHTS, TEMPS, V0, state,
        analyseMake, analysePress, analyse, volumeOf, pressureOf, collectedAt, testAt, render,
        runSeconds: () => RUN_SECONDS,
        setMode(m) { modeButtons.find(b => b.dataset.mode === m).click(); },
        set(key, value) { state[key] = value; buildControls(); buildPrediction(); settingsChanged(); },
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
