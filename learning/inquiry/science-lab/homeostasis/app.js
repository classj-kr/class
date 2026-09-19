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

    /* --- 긴 설명은 그림 밖으로: 액자를 벗어나는 글자와 판정·주석은 HTML로 옮긴다 --- */
    const stageVerdict = document.getElementById('stageVerdict');
    const stageReadout = document.getElementById('stageReadout');
    const stageNote = document.getElementById('stageNote');
    const mainSvg = document.querySelector('.main-svg');
    const graphSvg = document.querySelector('.graph-svg');
    function liftProse() {
        const rows = [], notes = [], verdicts = [];
        const takeOut = t => {
            const cls = t.getAttribute('class') || '', txt = t.textContent.trim();
            if (txt) {
                if (/verdict-text/.test(cls)) verdicts.push(txt);
                else if (/note-text/.test(cls)) notes.push(txt);
                else rows.push({ txt, fill: t.style.fill || '' });
            }
            t.remove();
        };
        [[mainGroup, mainSvg], [graphGroup, graphSvg]].forEach(([g, svg]) => {
            if (!g || !svg) return;
            const vb = svg.viewBox.baseVal, W = vb.width, H = vb.height;
            [...g.querySelectorAll('text')].forEach(t => {
                const cls = t.getAttribute('class') || '';
                const must = /verdict-text|note-text/.test(cls) || /prose/.test(cls);
                let b; try { b = t.getBBox(); } catch (e) { return; }
                const out = b.x < -0.5 || b.x + b.width > W + 0.5 || b.y + b.height > H + 0.5 || b.y < -0.5;
                if (must || out) takeOut(t);
            });
            const items = [...g.querySelectorAll('text')].map(t => { let b; try { b = t.getBBox(); } catch (e) { b = null; } return { t, b, len: t.textContent.trim().length }; }).filter(o => o.b);
            const drop = new Set();
            for (let i = 0; i < items.length; i += 1) for (let j = i + 1; j < items.length; j += 1) {
                if (drop.has(i) || drop.has(j)) continue;
                const a = items[i].b, c = items[j].b;
                if (Math.min(a.x + a.width, c.x + c.width) - Math.max(a.x, c.x) <= 3) continue;
                if (Math.min(a.y + a.height, c.y + c.height) - Math.max(a.y, c.y) <= 1.5) continue;
                const k = items[i].len >= items[j].len ? i : j;
                if (items[k].len < 8) continue;
                drop.add(k);
            }
            [...drop].sort((x, y) => x - y).forEach(k => takeOut(items[k].t));
        });
        if (stageVerdict) stageVerdict.textContent = verdicts.join(' ');
        if (stageReadout) stageReadout.innerHTML = rows.map(r => `<span${r.fill ? ` style="color:${r.fill}"` : ''}>${r.txt}</span>`).join('');
        if (stageNote) stageNote.textContent = notes.join(' ');
    }

    /* -------------------------------------------------------------- data */
    // Blood sugar (mg/dL, minutes): sugar arrives from the gut, insulin drives it into cells,
    // and the liver pulls the level back toward 90 either way (glucagon when low).
    const MEALS = { meal: { label: '밥 한 끼', hint: '포도당 75 g, 천천히', tau: 35, cond: '먹으면', condEx: '먹고 운동하면', ja: '먹자' }, drink: { label: '단 음료', hint: '포도당 75 g, 빨리', tau: 22, cond: '마시면', condEx: '마시고 운동하면', ja: '마시자' } };
    const BODIES = {
        normal: { label: '정상', hint: '인슐린 잘 나오고 잘 듦', who: '정상 몸이', SI: 0.02, beta: 0.3, ex: 0 },
        t1: { label: '인슐린이 안 나옴', hint: '분비 감소 조건', who: '인슐린이 안 나오는 몸이', SI: 0.02, beta: 0, ex: 0 },
        t2: { label: '인슐린이 잘 안 듦', hint: '작용 감소 조건', who: '인슐린이 잘 안 듣는 몸이', SI: 0.004, beta: 0.09, ex: 0 },
        exercise: { label: '정상 + 식후 운동', hint: '근육이 스스로 포도당 씀', who: '정상 몸이', SI: 0.02, beta: 0.3, ex: 0.5 },
    };
    const G_BASE = 90, G_VOL = 150, P1 = 0.02, TAU_I = 10, G_END = 180, G_DOSE = 75;

    // Body heat (℃, seconds): 80 W at rest, a 245 kJ/K body, skin that opens or closes, sweat and shivering.
    const WEATHERS = {
        cold: { label: '추운 날 −10 ℃', hint: '젖은 옷, 바람', act: '1시간 서 있으면', env: -10, h: 10, ex: 0 },
        mild: { label: '보통 22 ℃', hint: '실내', act: '1시간 쉬면', env: 22, h: 6, ex: 0 },
        hot: { label: '더운 날 35 ℃', hint: '뙤약볕에서 운동', act: '1시간 운동하면', env: 35, h: 12, ex: 300 },
    };
    const STATES = {
        normal: { label: '정상', hint: '땀·떨림·혈관 모두 됨', who: '정상 몸이', adj: '정상 몸은', sweat: true, shiver: true },
        nosweat: { label: '땀 못 냄', hint: '심한 탈수', who: '땀을 못 내는 몸이', adj: '땀을 못 내는 몸은', sweat: false, shiver: true },
        noshiver: { label: '떨림 못 함', hint: '술에 취함·마취', who: '떨지 못하는 몸이', adj: '떨지 못하는 몸은', sweat: true, shiver: false },
    };
    const HEAT_C = 245000, BASAL_W = 80, T_HOURS = 1;

    // Body water (litres, minutes): 40 L holding 285 mOsm/kg; ADH decides how much water the kidney keeps.
    const INTAKES = {
        water: { label: '맹물 1 L', hint: '한 번에 마심', water: 1.0, salt: 0 },
        salt: { label: '짠 음식', hint: '소금 5 g', water: 0, salt: 171 },
        none: { label: '아무것도', hint: '그대로 둠', water: 0, salt: 0 },
    };
    const W_BODY = 40, OSM0 = 285, W_END = 180;

    const state = { mode: 'glucose', meal: 'meal', body: 'normal', weather: 'hot', bstate: 'normal', intake: 'water', progress: 0, prediction: null };
    let running = false, frameId = 0, lastStamp = 0;

    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const fmtN = n => Math.round(n).toLocaleString('ko-KR');

    /* ------------------------------------------------------------ models */
    const gCache = {};
    function glucoseRun(mealKey, bodyKey) {
        const key = `${mealKey}|${bodyKey}`;
        if (gCache[key]) return gCache[key];
        const m = MEALS[mealKey], b = BODIES[bodyKey], dt = 0.5;
        const out = { t: [], G: [], I: [], Ra: [] };
        let G = G_BASE, I = 0;
        for (let t = 0; t <= G_END + 1e-9; t += dt) {
            const Ra = G_DOSE * 1000 * (t / (m.tau * m.tau)) * Math.exp(-t / m.tau) / G_VOL;
            if (Math.round(t * 2) % 2 === 0) { out.t.push(t); out.G.push(G); out.I.push(I); out.Ra.push(Ra); }
            I += dt * (b.beta * Math.max(0, G - G_BASE) - I / TAU_I);
            G += dt * (Ra - P1 * (G - G_BASE) - b.SI * I * G / 100 - b.ex * G / 100);
        }
        out.peak = Math.max(...out.G); out.tPeak = out.t[out.G.indexOf(out.peak)];
        out.g120 = out.G[out.t.indexOf(120)];
        gCache[key] = out;
        return out;
    }

    const hCache = {};
    function heatRun(weatherKey, stateKey) {
        const key = `${weatherKey}|${stateKey}`;
        if (hCache[key]) return hCache[key];
        const w = WEATHERS[weatherKey], s = STATES[stateKey], dt = 5;
        const out = { t: [], T: [], sweat: [], shiver: [], h: [], loss: [], make: [] };
        let T = 37;
        for (let t = 0; t <= T_HOURS * 3600 + 1e-9; t += dt) {
            const dil = 1 / (1 + Math.exp(-(T - 37) / 0.15));
            const h = w.h * (0.5 + dil);
            const sweat = s.sweat ? clamp((T - 37) * 500, 0, 600) : 0;
            const shiver = s.shiver ? clamp((36.8 - T) * 400, 0, 350) : 0;
            const make = BASAL_W + w.ex + shiver, loss = h * (T - w.env) + sweat;
            if (Math.round(t) % 60 === 0) { out.t.push(t / 60); out.T.push(T); out.sweat.push(sweat); out.shiver.push(shiver); out.h.push(dil); out.loss.push(loss); out.make.push(make); }
            T += dt * (make - loss) / HEAT_C;
        }
        out.end = out.T[out.T.length - 1];
        hCache[key] = out;
        return out;
    }

    const wCache = {};
    function waterRun(intakeKey) {
        if (wCache[intakeKey]) return wCache[intakeKey];
        const it = INTAKES[intakeKey], dt = 0.5;
        const out = { t: [], osm: [], adh: [], flow: [], uosm: [], bladder: [], drank: [] };
        let W = W_BODY, S = OSM0 * W_BODY, bladder = 0, drank = 0, gutW = it.water, gutS = it.salt;
        for (let t = 0; t <= W_END + 1e-9; t += dt) {
            const osm = S / W;
            const adh = clamp((osm - 282) / 6, 0, 1);                 // half on at 285, full at 288
            const uosm = 60 + 1140 * adh ** 1.5;                       // mOsm/kg
            const solute = 0.6 + 0.05 * Math.max(0, osm - OSM0);      // mOsm/min the kidney must throw out
            const flow = solute * 1000 / uosm;                         // mL/min that carry it
            if (Math.round(t * 2) % 2 === 0) { out.t.push(t); out.osm.push(osm); out.adh.push(adh); out.flow.push(flow); out.uosm.push(uosm); out.bladder.push(bladder); out.drank.push(drank); }
            // what was eaten or drunk is absorbed over 20~30 minutes
            const absorbW = Math.min(gutW, it.water / 20 * dt), absorbS = Math.min(gutS, it.salt / 30 * dt);
            gutW -= absorbW; gutS -= absorbS; W += absorbW; S += absorbS;
            // thirst: a cup of water every half hour while the blood stays too salty
            if (osm > 288 && Math.round(t * 2) % 60 === 0 && t > 0) { W += 0.25; drank += 0.25; }
            S += 0.6 * dt;                                             // metabolic waste keeps coming
            W -= (flow + 0.4) * dt / 1000;                             // urine plus breath and skin
            S -= uosm * flow * dt / 1000; bladder += flow * dt;
        }
        wCache[intakeKey] = out;
        return out;
    }

    function analyse() {
        if (state.mode === 'glucose') {
            const run = glucoseRun(state.meal, state.body), g120 = Math.round(run.g120);
            return { kind: 'glucose', run, g120, verdict: g120 < 140 ? 'normal' : g120 < 200 ? 'elevated' : 'high' };
        }
        if (state.mode === 'temp') {
            const run = heatRun(state.weather, state.bstate);
            return { kind: 'temp', run, verdict: run.end >= 38 ? 'rise' : run.end <= 35.5 ? 'drop' : 'hold' };
        }
        const run = waterRun(state.intake), i60 = run.t.indexOf(60), flow60 = run.flow[i60];
        return { kind: 'water', run, flow60, uosm60: run.uosm[i60], verdict: flow60 >= 4 ? 'much' : flow60 <= 0.8 ? 'little' : 'usual' };
    }
    const runSeconds = () => 7;

    /* ---------------------------------------------------------- controls */
    function pickRow(legend, name, options, current, cols) {
        return `<fieldset class="pick-field"><legend>${legend}</legend>` +
            `<div class="pick-buttons cols${cols}" data-pick="${name}">` +
            options.map(o => `<button type="button" data-value="${o.value}" class="${o.value === String(current) ? 'selected' : ''}">` +
                `${o.label}${o.hint ? `<small>${o.hint}</small>` : ''}</button>`).join('') +
            `</div></fieldset>`;
    }
    const opts = table => Object.entries(table).map(([k, v]) => ({ value: k, label: v.label, hint: v.hint }));

    function buildControls() {
        if (state.mode === 'glucose') controlArea.innerHTML = pickRow('먹은 것', 'meal', opts(MEALS), state.meal, 2) + pickRow('몸 상태', 'body', opts(BODIES), state.body, 2);
        else if (state.mode === 'temp') controlArea.innerHTML = pickRow('날씨', 'weather', opts(WEATHERS), state.weather, 3) + pickRow('몸 상태', 'bstate', opts(STATES), state.bstate, 3);
        else controlArea.innerHTML = pickRow('마신 것·먹은 것', 'intake', opts(INTAKES), state.intake, 3);
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                buildPrediction();
                settingsChanged();
            }));
        });
    }

    const PRED_G = [{ value: 'normal', label: '140 미만 (모형 비교 구간)' }, { value: 'elevated', label: '140~199에 머묾' }, { value: 'high', label: '200 넘게 높음' }];
    const PRED_T = [{ value: 'hold', label: '36~37.5 ℃ 유지' }, { value: 'rise', label: '38 ℃ 넘게 오름' }, { value: 'drop', label: '35.5 ℃ 아래로 내림' }];
    const PRED_W = [{ value: 'much', label: '오줌이 많고 옅음' }, { value: 'little', label: '오줌이 적고 진함' }, { value: 'usual', label: '평소와 비슷' }];

    function buildPrediction() {
        const list = state.mode === 'glucose' ? PRED_G : state.mode === 'temp' ? PRED_T : PRED_W;
        predictionLegend.textContent = state.mode === 'glucose' ? `${BODIES[state.body].who} ${MEALS[state.meal].label}를 ${BODIES[state.body].ex ? MEALS[state.meal].condEx : MEALS[state.meal].cond} 2시간 뒤 혈당(mg/dL)은?`
            : state.mode === 'temp' ? `${WEATHERS[state.weather].label}에 ${STATES[state.bstate].who} ${WEATHERS[state.weather].act} 체온은?`
                : `${INTAKES[state.intake].label}${state.intake === 'salt' ? '을 먹고' : state.intake === 'water' ? '를 마시고' : ' 먹지 않고'} 1시간 뒤 오줌은?`;
        predictionArea.className = 'prediction-buttons three';
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction;
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    const at = (arr, tArr, t) => { let i = 0; while (i < tArr.length - 1 && tArr[i + 1] <= t) i += 1; return arr[i]; };

    function renderGlucose(a) {
        const t = state.progress * G_END;
        const { run } = a, b = BODIES[state.body];
        const G = at(run.G, run.t, t), I = at(run.I, run.t, t), Ra = at(run.Ra, run.t, t);
        let out = '';
        // the vessel across the middle, sugar dots as many as the level
        out += `<rect class="vessel" x="20" y="92" width="300" height="34" rx="17"/>`;
        const nDots = Math.round(G / 6);
        for (let k = 0; k < nDots; k += 1) { const x = 30 + ((k * 37 + Math.floor(t) * 3) % 280), y = 100 + ((k * 13) % 18); out += `<circle class="sugar" cx="${x}" cy="${y}" r="2.6"/>`; }
        out += `<text class="small-label" x="26" y="86">혈관 — 포도당 ${Math.round(G)} mg/dL</text>`;
        // organs: gut above, pancreas/liver/muscle below
        out += `<rect class="organ" x="30" y="30" width="90" height="34" rx="6"/><g transform="translate(32, 28) scale(0.38)"><path d="M 18 36 C 36 34 64 34 82 36 C 88 46 84 64 76 68 C 60 62 40 62 24 68 C 16 62 14 46 18 36 Z" fill="#d9b070" opacity="0.3"/></g><text class="organ-text" x="75" y="52" text-anchor="middle">소장</text><text class="small-label prose" x="0" y="0">소장 — ${Ra > 0.2 ? `흡수 중 ${Ra.toFixed(1)}/분` : '흡수 끝'}</text>`;
        if (Ra > 0.2) out += `<line class="flow-arrow" style="stroke:#d97706" x1="75" y1="66" x2="75" y2="88"/><polygon fill="#d97706" points="75,92 71,85 79,85"/>`;
        out += `<rect class="organ" x="130" y="30" width="110" height="34" rx="6"/><g transform="translate(132, 28) scale(0.38)"><path d="M 16 52 C 20 40 38 38 58 42 C 74 46 86 48 88 54 C 88 62 76 66 58 64 C 38 62 20 62 16 52 Z" fill="#059669" opacity="0.3"/></g><text class="organ-text" x="185" y="52" text-anchor="middle">이자</text>`;
        out += `<text class="small-label prose" style="fill:#059669" x="0" y="0">이자 — 인슐린 ${b.beta === 0 ? '없음' : I < 1 ? '조금' : I < 50 ? '나옴' : '많이'} · 글루카곤 ${G < 88 ? '나옴' : '조금'}</text>`;
        out += `<rect class="organ" x="30" y="150" width="120" height="36" rx="6"/><g transform="translate(32, 148) scale(0.38)"><path d="M 14 56 C 20 32 46 22 76 26 C 88 28 90 42 86 64 C 82 74 68 78 48 76 C 28 74 14 70 14 56 Z" fill="#dc2626" opacity="0.25"/></g><text class="organ-text" x="90" y="173" text-anchor="middle">간</text><text class="small-label prose" x="0" y="0">간 — ${G > 95 && I > 1 ? '포도당을 글리코젠으로 저장' : G < 88 ? '글리코젠에서 포도당을 꺼냄' : '들고 내기 균형'}</text>`;
        out += `<rect class="organ" x="170" y="150" width="130" height="36" rx="6"/><g transform="translate(172, 148) scale(0.38)"><path d="M 22 28 C 34 18 50 18 62 26 C 74 18 88 24 88 38 C 94 52 86 66 82 74 C 72 84 56 82 46 76 C 34 84 20 78 16 64 C 12 50 14 36 22 28 Z" fill="#7c3aed" opacity="0.25"/></g><text class="organ-text" x="235" y="173" text-anchor="middle">근육·지방 세포</text><text class="small-label prose" x="0" y="0">근육·지방 세포 — ${b.ex ? '운동으로 포도당 씀' : b.SI * I > 0.3 ? '인슐린 신호로 포도당 들임' : b.beta === 0 ? '인슐린이 없어 못 들임' : b.SI < 0.01 && I > 1 ? '인슐린이 잘 안 들림' : '평소대로'}</text>`;
        const upt = b.SI * I * G / 100 + b.ex * G / 100;
        if (upt > 0.3) out += `<line class="flow-arrow" style="stroke:#059669" x1="235" y1="128" x2="235" y2="146"/><polygon fill="#059669" points="235,150 231,143 239,143"/>`;
        if (G < 88) out += `<line class="flow-arrow" style="stroke:#dc2626" x1="90" y1="148" x2="90" y2="130"/><polygon fill="#dc2626" points="90,126 86,133 94,133"/>`;
        // the meter
        const MX = 340, MT = 40, MB = 180;
        const yOf = g => MB - clamp(g, 0, 350) / 350 * (MB - MT);
        out += `<rect class="organ" x="${MX}" y="${MT}" width="20" height="${MB - MT}" rx="3"/>`;
        out += `<rect class="band" x="${MX + 1}" y="${yOf(140).toFixed(1)}" width="18" height="${(yOf(70) - yOf(140)).toFixed(1)}"/>`;
        out += `<rect fill="#d97706" x="${MX + 4}" y="${yOf(G).toFixed(1)}" width="12" height="${(MB - yOf(G)).toFixed(1)}"/>`;
        [[70, '70'], [140, '140'], [200, '200'], [300, '300']].forEach(([g, lab]) => { out += `<line class="ref-line" x1="${MX - 3}" y1="${yOf(g).toFixed(1)}" x2="${MX + 23}" y2="${yOf(g).toFixed(1)}"/><text class="small-label" x="${MX + 27}" y="${(yOf(g) + 3).toFixed(1)}">${lab}</text>`; });
        out += `<text class="gen-text prose" x="0" y="0">혈당 ${Math.round(G)} mg/dL</text>`;
        out += `<text class="trait-text prose" x="0" y="0">먹은 뒤 ${Math.round(t)}분</text>`;
        out += `<text class="trait-text prose" style="fill:#059669" x="0" y="0">인슐린 ${Math.round(I)} (평소 0)</text>`;
        const VERD = { normal: '낮은 비교 구간', elevated: '중간 비교 구간', high: '높은 비교 구간' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${state.progress >= 1 ? `${MEALS[state.meal].label} · ${b.label}: 최고 ${Math.round(run.peak)} → 2시간 뒤 ${a.g120} — ${VERD[a.verdict]}` : `${MEALS[state.meal].label} · ${b.label} (${b.hint})`}</text>`;
        out += `<text class="note-text" x="20" y="208">가상 모형의 비교 구간이며 진단 기준으로 사용하지 않습니다</text>`;
        return out;
    }

    function graphGlucose(a) {
        const t = state.progress * G_END;
        const { run } = a;
        const X0 = 50, X1 = 430, Y0 = 150, Y1 = 40, GMAX = 350;
        const xOf = tt => X0 + tt / G_END * (X1 - X0), yOf = g => Y0 - clamp(g, 0, GMAX) / GMAX * (Y0 - Y1);
        let out = `<text class="axis-title" x="${X0}" y="18">혈당–시간 — 초록 띠는 모형의 비교 구간, 점선은 정상 몸이 밥을 먹었을 때</text>`;
        out += `<rect class="band" x="${X0}" y="${yOf(140).toFixed(1)}" width="${X1 - X0}" height="${(yOf(70) - yOf(140)).toFixed(1)}"/>`;
        [0, 100, 200, 300].forEach(g => { out += `<line class="grid-line" x1="${X0}" y1="${yOf(g).toFixed(1)}" x2="${X1}" y2="${yOf(g).toFixed(1)}"/><text class="axis-text" x="${X0 - 6}" y="${(yOf(g) + 3.5).toFixed(1)}" text-anchor="end">${g}</text>`; });
        out += `<line class="ref-line" style="stroke:#ff7a59" x1="${X0}" y1="${yOf(200).toFixed(1)}" x2="${X1}" y2="${yOf(200).toFixed(1)}"/>`;
        for (let tt = 0; tt <= G_END; tt += 30) out += `<text class="axis-text" x="${xOf(tt).toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${tt}</text>`;
        out += `<line class="ref-line" x1="${xOf(120).toFixed(1)}" y1="${Y1}" x2="${xOf(120).toFixed(1)}" y2="${Y0}"/><text class="small-label" x="${(xOf(120) + 3).toFixed(1)}" y="${Y1 + 10}">2시간</text>`;
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        const ref = glucoseRun('meal', 'normal');
        out += `<path class="trace faint" style="stroke:#475569" d="${ref.t.map((tt, i) => `${i ? 'L' : 'M'}${xOf(tt).toFixed(1)},${yOf(ref.G[i]).toFixed(1)}`).join(' ')}"/>`;
        let d = ''; run.t.forEach((tt, i) => { if (tt <= t) d += `${d ? 'L' : 'M'}${xOf(tt).toFixed(1)},${yOf(run.G[i]).toFixed(1)} `; });
        out += `<path class="trace" style="stroke:#d97706" d="${d}"/>`;
        let dI = ''; run.t.forEach((tt, i) => { if (tt <= t) dI += `${dI ? 'L' : 'M'}${xOf(tt).toFixed(1)},${yOf(run.I[i] * 0.5).toFixed(1)} `; });
        out += `<path class="trace" style="stroke:#059669;stroke-width:1.4" d="${dI}"/>`;
        out += `<text class="small-label prose" style="fill:#059669" x="0" y="0">초록 선은 인슐린 (상대값)</text>`;
        out += `<text class="axis-title" x="${((X0 + X1) / 2).toFixed(1)}" y="${Y0 + 30}" text-anchor="middle">먹은 뒤 시간 (분) — 혈당 (mg/dL)</text>`;
        return out;
    }

    function renderTemp(a) {
        const t = state.progress * T_HOURS * 60;
        const { run } = a, w = WEATHERS[state.weather], s = STATES[state.bstate];
        const T = at(run.T, run.t, t), sweat = at(run.sweat, run.t, t), shiver = at(run.shiver, run.t, t), dil = at(run.h, run.t, t), loss = at(run.loss, run.t, t), make = at(run.make, run.t, t);
        let out = `<rect class="env-box" x="16" y="24" width="220" height="176" rx="8"/>`;
        out += `<text class="trait-text" x="26" y="42">${w.label} · ${w.hint}</text>`;
        // the body: skin colour by blood flow, sweat drops, shiver marks
        const skin = `rgb(${Math.round(120 + 135 * dil)}, ${Math.round(140 - 40 * dil)}, ${Math.round(220 - 140 * dil)})`;
        out += `<circle class="body" cx="126" cy="76" r="16"/><rect class="body" x="100" y="94" width="52" height="66" rx="14"/><rect class="body" x="104" y="158" width="18" height="36" rx="6"/><rect class="body" x="130" y="158" width="18" height="36" rx="6"/>`;
        out += `<rect class="skin" style="stroke:${skin};opacity:.7" x="100" y="94" width="52" height="66" rx="14"/>`;
        for (let k = 0; k < Math.round(sweat / 60); k += 1) { const x = 98 + (k * 37) % 60, y = 100 + ((k * 23 + Math.floor(t * 4)) % 60); out += `<circle class="sweat" cx="${x}" cy="${y}" r="2.4"/>`; }
        if (shiver > 0) for (let k = 0; k < Math.round(shiver / 50); k += 1) { const x = 90 - k * 4, y0 = 100 + k * 8; out += `<polyline class="shiver" fill="none" points="${x},${y0} ${x - 4},${y0 + 4} ${x},${y0 + 8} ${x - 4},${y0 + 12}"/>`; }
        out += `<text class="small-label" x="126" y="207" text-anchor="middle">${dil > 0.6 ? '피부 혈관 넓어짐 — 붉음' : dil < 0.4 ? '피부 혈관 좁아짐 — 창백' : '피부 혈관 보통'}</text>`;
        out += `<text class="trait-text" x="164" y="110">${sweat > 0 ? `땀 ${Math.round(sweat)} W` : s.sweat ? '땀 없음' : '땀 못 냄'}</text>`;
        out += `<text class="trait-text" x="164" y="126">${shiver > 0 ? `떨림 +${Math.round(shiver)} W` : s.shiver ? '떨림 없음' : '떨림 못 함'}</text>`;
        out += `<text class="trait-text" x="164" y="142">${w.ex ? `운동 +${w.ex} W` : '쉬는 중 80 W'}</text>`;
        // thermometer and budget on the right
        const MX = 260, MT = 40, MB = 180;
        const yOf = tc => MB - (tc - 32) / 10 * (MB - MT);
        out += `<rect class="thermo" x="${MX}" y="${MT}" width="20" height="${MB - MT}" rx="3"/>`;
        out += `<rect class="band" x="${MX + 1}" y="${yOf(37.5).toFixed(1)}" width="18" height="${(yOf(36) - yOf(37.5)).toFixed(1)}"/>`;
        out += `<rect class="thermo-fill" x="${MX + 4}" y="${yOf(clamp(T, 32, 42)).toFixed(1)}" width="12" height="${(MB - yOf(clamp(T, 32, 42))).toFixed(1)}"/>`;
        [[42, '42'], [38, '38'], [36, '36'], [32, '32']].forEach(([tc, lab]) => { out += `<line class="ref-line" x1="${MX - 3}" y1="${yOf(tc).toFixed(1)}" x2="${MX + 23}" y2="${yOf(tc).toFixed(1)}"/><text class="small-label" x="${MX + 27}" y="${(yOf(tc) + 3).toFixed(1)}">${lab}</text>`; });
        out += `<text class="gen-text" x="${MX + 60}" y="56">${T.toFixed(1)} ℃</text>`;
        out += `<text class="trait-text" x="${MX + 60}" y="76">${Math.round(t)}분</text>`;
        out += `<text class="trait-text" style="fill:#dc2626" x="${MX + 60}" y="100">만드는 열 ${Math.round(make)} W</text>`;
        out += `<text class="trait-text" style="fill:#0284c7" x="${MX + 60}" y="116">내보내는 열 ${Math.round(loss)} W</text>`;
        out += `<text class="trait-text" style="fill:#d97706" x="${MX + 60}" y="136">${make - loss > 20 ? `+${Math.round(make - loss)} W → 오름` : loss - make > 20 ? `−${Math.round(loss - make)} W → 내림` : '거의 균형'}</text>`;
        out += `<text class="small-label" x="${MX + 60}" y="156">200 W가 어긋나면</text><text class="small-label" x="${MX + 60}" y="168">1시간에 3 ℃쯤</text>`;
        const VERD = { hold: '유지', rise: '오름 — 열사병 위험', drop: '내림 — 저체온증' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${state.progress >= 1 ? `${w.label} · ${s.label}: 1시간 뒤 ${run.end.toFixed(1)} ℃ → ${VERD[a.verdict]}` : `${w.label} · ${s.label}`}</text>`;
        return out;
    }

    function graphTemp(a) {
        const t = state.progress * T_HOURS * 60;
        const { run } = a;
        const X0 = 50, X1 = 430, Y0 = 150, Y1 = 40;
        const xOf = m => X0 + m / (T_HOURS * 60) * (X1 - X0), yOf = tc => Y0 - (clamp(tc, 32, 42) - 32) / 10 * (Y0 - Y1);
        let out = `<text class="axis-title" x="${X0}" y="18">체온–시간 — 초록 띠는 모형의 비교 구간, 점선은 정상 몸일 때</text>`;
        out += `<rect class="band" x="${X0}" y="${yOf(37.5).toFixed(1)}" width="${X1 - X0}" height="${(yOf(36) - yOf(37.5)).toFixed(1)}"/>`;
        [32, 34, 36, 38, 40, 42].forEach(tc => { out += `<line class="grid-line" x1="${X0}" y1="${yOf(tc).toFixed(1)}" x2="${X1}" y2="${yOf(tc).toFixed(1)}"/><text class="axis-text" x="${X0 - 6}" y="${(yOf(tc) + 3.5).toFixed(1)}" text-anchor="end">${tc}</text>`; });
        for (let m = 0; m <= 60; m += 10) out += `<text class="axis-text" x="${xOf(m).toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${m}</text>`;
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        const ref = heatRun(state.weather, 'normal');
        out += `<path class="trace faint" style="stroke:#475569" d="${ref.t.map((m, i) => `${i ? 'L' : 'M'}${xOf(m).toFixed(1)},${yOf(ref.T[i]).toFixed(1)}`).join(' ')}"/>`;
        let d = ''; run.t.forEach((m, i) => { if (m <= t) d += `${d ? 'L' : 'M'}${xOf(m).toFixed(1)},${yOf(run.T[i]).toFixed(1)} `; });
        out += `<path class="trace" style="stroke:#ff7a59" d="${d}"/>`;
        out += `<text class="axis-title" x="${((X0 + X1) / 2).toFixed(1)}" y="${Y0 + 30}" text-anchor="middle">시간 (분) — 몸속 온도 (℃)</text>`;
        return out;
    }

    function renderWater(a) {
        const t = state.progress * W_END;
        const { run } = a, it = INTAKES[state.intake];
        const osm = at(run.osm, run.t, t), adh = at(run.adh, run.t, t), flow = at(run.flow, run.t, t), uosm = at(run.uosm, run.t, t), bladder = at(run.bladder, run.t, t), drank = at(run.drank, run.t, t);
        let out = '';
        out += `<rect class="blood-box" x="20" y="36" width="150" height="60" rx="8"/><text class="organ-text" x="95" y="54" text-anchor="middle">몸속 물 (혈액)</text>`;
        out += `<text class="trait-text" x="95" y="72" text-anchor="middle">진하기 ${osm.toFixed(1)} mOsm/kg</text><text class="small-label" x="95" y="88" text-anchor="middle">${osm > 288 ? '너무 진함 → 목마름' : osm < 282 ? '너무 옅음' : '알맞음 (285)'}</text>`;
        out += `<rect class="organ" x="20" y="110" width="150" height="40" rx="6"/><text class="organ-text" x="95" y="126" text-anchor="middle">뇌하수체 — 항이뇨 호르몬</text>`;
        out += `<rect class="hormone-bar" fill="rgba(178,155,255,.3)" x="40" y="134" width="110" height="8" rx="4"/><rect fill="#7c3aed" x="40" y="134" width="${(110 * adh).toFixed(1)}" height="8" rx="4"/>`;
        out += `<line class="flow-arrow" style="stroke:#7c3aed" x1="170" y1="130" x2="200" y2="130"/><polygon fill="#7c3aed" points="204,130 197,126 197,134"/>`;
        // kidney and bladder
        out += `<path class="kidney" d="M230,96 C205,100 205,150 230,156 C250,160 262,140 258,126 C255,110 250,92 230,96 Z"/><text class="organ-text" x="232" y="130" text-anchor="middle">콩팥</text>`;
        out += `<text class="small-label" x="232" y="172" text-anchor="middle">물 다시 빨아들임 ${Math.round(adh * 100)} %</text>`;
        const BX = 300, BY = 90, BW = 60, BH = 90, fill = clamp(bladder / 700, 0, 1);
        out += `<rect class="bladder" x="${BX}" y="${BY}" width="${BW}" height="${BH}" rx="14"/>`;
        out += `<rect class="urine" style="opacity:${(0.35 + 0.65 * adh).toFixed(2)}" x="${BX + 2}" y="${(BY + 2 + (BH - 4) * (1 - fill)).toFixed(1)}" width="${BW - 4}" height="${((BH - 4) * fill).toFixed(1)}" rx="12"/>`;
        out += `<text class="small-label" x="${BX + BW / 2}" y="${BY - 6}" text-anchor="middle">모인 오줌 ${fmtN(bladder)} mL</text>`;
        out += `<text class="trait-text" x="${BX + BW + 12}" y="104">1분에 ${flow.toFixed(1)} mL</text>`;
        out += `<text class="trait-text prose" x="0" y="0">오줌 진하기 ${fmtN(uosm)} mOsm/kg</text>`;
        out += `<text class="trait-text" x="${BX + BW + 12}" y="156">${Math.round(t)}분</text>`;
        if (drank > 0) out += `<text class="trait-text" style="fill:#0284c7" x="${BX + BW + 12}" y="172">목말라 ${fmtN(drank * 1000)} mL 마심</text>`;
        out += `<text class="small-label" x="230" y="60" text-anchor="middle">${it.label} ${state.intake === 'salt' ? '먹음' : state.intake === 'water' ? '마심' : ''}</text>`;
        const VERD = { much: '많고 옅음', little: '적고 진함', usual: '평소와 비슷' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${state.progress >= 1 ? `${it.label}: 1시간 뒤 오줌 1분에 ${a.flow60.toFixed(1)} mL, ${fmtN(a.uosm60)} mOsm/kg → ${VERD[a.verdict]}` : `${it.label} (${it.hint})`}</text>`;
        out += `<text class="note-text" x="20" y="208">오줌은 1분에 0.5~10 mL, 진하기는 60~1,200 mOsm/kg 사이에서 바뀌어 몸속 물의 진하기를 지킵니다</text>`;
        return out;
    }

    function graphWater(a) {
        const t = state.progress * W_END;
        const { run } = a;
        const X0 = 50, X1 = 410, Y0 = 150, Y1 = 40;
        const xOf = tt => X0 + tt / W_END * (X1 - X0), yO = o => Y0 - (clamp(o, 276, 292) - 276) / 16 * (Y0 - Y1), yF = f => Y0 - clamp(f, 0, 12) / 12 * (Y0 - Y1);
        let out = `<text class="axis-title" x="${X0}" y="18">붉은 선: 몸속 물의 진하기 (왼쪽 눈금) · 노란 선: 오줌 양 (오른쪽 눈금)</text>`;
        [276, 280, 284, 288, 292].forEach(o => { out += `<line class="grid-line" x1="${X0}" y1="${yO(o).toFixed(1)}" x2="${X1}" y2="${yO(o).toFixed(1)}"/><text class="axis-text" x="${X0 - 6}" y="${(yO(o) + 3.5).toFixed(1)}" text-anchor="end">${o}</text>`; });
        [0, 4, 8, 12].forEach(f => { out += `<text class="axis-text" style="fill:#d97706" x="${X1 + 6}" y="${(yF(f) + (f ? 3.5 : -1)).toFixed(1)}">${f} mL</text>`; });
        for (let tt = 0; tt <= W_END; tt += 30) out += `<text class="axis-text" x="${xOf(tt).toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${tt}</text>`;
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        out += `<line class="ref-line" x1="${X0}" y1="${yO(285).toFixed(1)}" x2="${X1}" y2="${yO(285).toFixed(1)}"/>`;
        let dO = '', dF = '';
        run.t.forEach((tt, i) => { if (tt <= t) { dO += `${dO ? 'L' : 'M'}${xOf(tt).toFixed(1)},${yO(run.osm[i]).toFixed(1)} `; dF += `${dF ? 'L' : 'M'}${xOf(tt).toFixed(1)},${yF(run.flow[i]).toFixed(1)} `; } });
        out += `<path class="trace" style="stroke:#ff7a59" d="${dO}"/><path class="trace" style="stroke:#d97706" d="${dF}"/>`;
        out += `<text class="axis-title" x="${((X0 + X1) / 2).toFixed(1)}" y="${Y0 + 30}" text-anchor="middle">시간 (분) — 진하기 mOsm/kg · 오줌 mL/분</text>`;
        return out;
    }

    function noteFor(a) {
        return '<p>수치·시간·비교 구간은 학습을 위한 가상 설정입니다. 실제 검사값·진단·치료 지침이 아닙니다.</p><p>조건을 하나씩 바꾸어 혈당, 체온, 물의 양을 조절하는 음성 되먹임을 비교합니다. 인슐린·글루카곤·항이뇨 호르몬의 역할을 구별하세요.</p>';
    }

    function render() {
        const a = analyse();
        mainGroup.innerHTML = a.kind === 'glucose' ? renderGlucose(a) : a.kind === 'temp' ? renderTemp(a) : renderWater(a);
        graphGroup.innerHTML = a.kind === 'glucose' ? graphGlucose(a) : a.kind === 'temp' ? graphTemp(a) : graphWater(a);
        liftProse();
        stageBadge.textContent = a.kind === 'glucose' ? `${MEALS[state.meal].label} · ${BODIES[state.body].label}` : a.kind === 'temp' ? `${WEATHERS[state.weather].label} · ${STATES[state.bstate].label}` : INTAKES[state.intake].label;
        methodHint.textContent = a.kind === 'glucose' ? '혈당이 오르면 인슐린, 내리면 글루카곤이 되돌립니다'
            : a.kind === 'temp' ? '만드는 열과 내보내는 열이 같아야 체온이 머뭅니다'
                : '몸속 물이 진해지면 항이뇨 호르몬이 물을 아끕니다';
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
        const a=render();resultEmpty.hidden=true;resultContent.hidden=false;
        labelA.textContent='관찰';valueA.textContent=a.kind==='glucose'?'혈당 조절':a.kind==='temp'?'체온 조절':'몸속 조건 조절';
        labelB.textContent='핵심';valueB.textContent='음성 되먹임';
        predictionResult.textContent=!state.prediction?'다음에는 변화를 먼저 예상해 보세요.':state.prediction===a.verdict?'이 모형의 예상이 맞았습니다.':'이 모형의 결과와 다릅니다.';
        explanation.textContent='일정한 범위를 벗어나는 변화에 반대 방향의 조절 반응이 일어나 항상성 유지에 기여합니다. 조건에 따라 조절이 충분하지 않을 수도 있습니다. 곡선과 수치는 가상 모형이며 질병의 진단·유형 구별이나 치료 결정을 위해 사용하지 않습니다.';
    }

    function settingsChanged() {
        stopRun();
        state.progress = 0;
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
        checkBtn.textContent = state.mode === 'glucose' ? '3시간 흘려 보기' : state.mode === 'temp' ? '1시간 흘려 보기' : '3시간 흘려 보기';
        stageCaption.textContent = state.mode === 'glucose' ? '혈관 속 노란 점이 포도당입니다. 이자가 인슐린과 글루카곤을 내어 간·근육이 포도당을 넣고 꺼냅니다.'
            : state.mode === 'temp' ? '피부색이 혈관의 넓이, 파란 점이 땀, 왼쪽 물결이 떨림입니다. 오른쪽에 만드는 열과 내보내는 열이 있습니다.'
                : '몸속 물의 진하기를 뇌하수체가 재어 항이뇨 호르몬을 내면, 콩팥이 물을 얼마나 되돌릴지 정합니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { meal: 'meal', body: 'normal', weather: 'hot', bstate: 'normal', intake: 'water', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'glucose').click();
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

    window.__homeoModel = {
        MEALS, BODIES, WEATHERS, STATES, INTAKES, state,
        analyse, render, glucoseRun, heatRun, waterRun,
        runSeconds,
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
