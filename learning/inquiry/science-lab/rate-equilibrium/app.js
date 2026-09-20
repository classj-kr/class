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

    const R = 8.314, T_REF = 298.15;
    const EA_PLAIN = 50000, EA_CAT = 30000;      // joules per mole
    const DH = { exo: -80, endo: 40 };            // kilojoules per mole
    const K_REF = 216, DH_EQ = -57200;            // for 2NO2 = N2O4
    const N_TOTAL = 0.2;                          // moles of nitrogen, as NO2
    const GRAPH = { x0: 70, x1: 424, y0: 156, y1: 32 };

    const state = { mode: 'rate', heat: 'exo', cat: 'off', T: 25, Teq: 25, V: 1.0, prediction: null };

    /* ------------------------------------------------------------ models */
    // Arrhenius, expressed against the 25 degree uncatalysed reaction.
    function analyseRate(T = state.T, cat = state.cat, heat = state.heat) {
        const Ea = cat === 'on' ? EA_CAT : EA_PLAIN;
        const K = T + 273.15;
        const rel = Math.exp(EA_PLAIN / (R * T_REF) - Ea / (R * K));
        const verdict = rel > 1.5 ? 'faster' : rel < 1 / 1.5 ? 'slower' : 'similar';
        const dh = DH[heat];
        return { kind: 'rate', T, K, cat, heat, Ea: Ea / 1000, rel, verdict, dh,
                 peak: Ea / 1000, product: dh };
    }

    const Kof = T => K_REF * Math.exp((-DH_EQ / R) * (1 / (T + 273.15) - 1 / T_REF));

    // 2NO2 = N2O4 solves in closed form: 4Kx^2 - (4Kc+1)x + Kc^2 = 0.
    function analyseEq(T = state.Teq, V = state.V) {
        const K = Kof(T);
        const c0 = N_TOTAL / V;
        const x = ((4 * K * c0 + 1) - Math.sqrt(8 * K * c0 + 1)) / (8 * K);
        const no2 = c0 - 2 * x, n2o4 = x;
        const fracN2O4 = (2 * x) / c0;
        const ref = refEq();
        const ratio = no2 / ref.no2;
        const verdict = ratio > 1.15 ? 'darker' : ratio < 1 / 1.15 ? 'lighter' : 'same';
        return { kind: 'eq', T, V, K, c0, x, no2, n2o4, fracN2O4, ratio, verdict, ref };
    }

    function refEq() {
        const K = K_REF, c0 = N_TOTAL / 1.0;
        const x = ((4 * K * c0 + 1) - Math.sqrt(8 * K * c0 + 1)) / (8 * K);
        return { K, c0, x, no2: c0 - 2 * x, n2o4: x, fracN2O4: (2 * x) / c0 };
    }

    const analyse = () => (state.mode === 'rate' ? analyseRate() : analyseEq());

    /* ---------------------------------------------------------- controls */
    const slider = (id, label, min, max, step, value, scale) =>
        `<div class="range-heading"><label for="${id}">${label}</label><output id="${id}Out" for="${id}"></output></div>` +
        `<input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}">` +
        `<div class="range-scale" aria-hidden="true">${scale.map(s => `<span>${s}</span>`).join('')}</div>`;

    function buildControls() {
        controlArea.innerHTML = state.mode === 'rate'
            ? `<fieldset class="pick-field"><legend>반응의 종류</legend><div class="pick-buttons" data-pick="heat">` +
              `<button type="button" data-value="exo" class="${state.heat === 'exo' ? 'selected' : ''}">발열 반응<small>ΔH = −80 kJ</small></button>` +
              `<button type="button" data-value="endo" class="${state.heat === 'endo' ? 'selected' : ''}">흡열 반응<small>ΔH = +40 kJ</small></button>` +
              `</div></fieldset>` +
              `<fieldset class="pick-field"><legend>촉매</legend><div class="pick-buttons" data-pick="cat">` +
              `<button type="button" data-value="off" class="${state.cat === 'off' ? 'selected' : ''}">없음<small>Ea 50 kJ</small></button>` +
              `<button type="button" data-value="on" class="${state.cat === 'on' ? 'selected' : ''}">넣음<small>Ea 30 kJ</small></button>` +
              `</div></fieldset>` +
              slider('tRange', '온도', 0, 100, 5, state.T, ['0℃', '50℃', '100℃'])
            : slider('teRange', '온도', 0, 100, 5, state.Teq, ['0℃', '50℃', '100℃']) +
              slider('vRange', '용기의 부피', 0.5, 2, 0.1, state.V, ['0.5L', '1.25L', '2L']);
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                changed();
            }));
        });
        [['tRange', 'T'], ['teRange', 'Teq'], ['vRange', 'V']].forEach(([id, key]) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('input', () => { state[key] = Number(el.value); changed(); });
        });
    }

    const PRED_RATE = [{ v: 'faster', t: '빠르다' }, { v: 'similar', t: '비슷하다' }, { v: 'slower', t: '느리다' }];
    const PRED_EQ = [{ v: 'darker', t: '진해진다' }, { v: 'same', t: '비슷하다' }, { v: 'lighter', t: '옅어진다' }];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list = state.mode === 'rate' ? PRED_RATE : PRED_EQ;
        predictionLegend.textContent = state.mode === 'rate'
            ? '기준(25 ℃, 촉매 없음)보다 반응 속도가?' : '기준(25 ℃, 1 L)보다 갈색이?';
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.v}">${o.t}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    const E_LO = -90, E_HI = 60, E_TOP = 40, E_BOT = 182;
    const ey = e => E_BOT - ((e - E_LO) / (E_HI - E_LO)) * (E_BOT - E_TOP);

    function profilePath(peak, prod) {
        const yR = ey(0), yPk = ey(peak), yP = ey(prod);
        return `M60,${yR.toFixed(1)} L140,${yR.toFixed(1)} C180,${yR.toFixed(1)} 196,${yPk.toFixed(1)} 230,${yPk.toFixed(1)} ` +
               `C264,${yPk.toFixed(1)} 280,${yP.toFixed(1)} 320,${yP.toFixed(1)} L400,${yP.toFixed(1)}`;
    }

    function renderRate(a) {
        const yR = ey(0), yP = ey(a.product);
        let body = '';
        body += `<line class="energy-axis" x1="46" y1="${E_TOP}" x2="46" y2="${E_BOT}"/>`;
        body += `<line class="level-line" x1="60" y1="${yR.toFixed(1)}" x2="400" y2="${yR.toFixed(1)}"/>`;
        body += `<line class="level-line" x1="60" y1="${yP.toFixed(1)}" x2="400" y2="${yP.toFixed(1)}"/>`;
        // the uncatalysed hill is always drawn, so the catalyst's effect is visible
        body += `<path class="profile" opacity="${a.cat === 'on' ? 0.35 : 1}" d="${profilePath(EA_PLAIN / 1000, a.product)}"/>`;
        if (a.cat === 'on') body += `<path class="profile cat" d="${profilePath(EA_CAT / 1000, a.product)}"/>`;

        // activation energy, measured from the reactant level up to the peak
        const eaX = 176;
        body += `<line class="ea-arrow${a.cat === 'on' ? ' cat' : ''}" x1="${eaX}" y1="${yR.toFixed(1)}" x2="${eaX}" y2="${ey(a.peak).toFixed(1)}"/>`;
        body += `<path class="ea-arrow${a.cat === 'on' ? ' cat' : ''}" d="M${eaX - 4},${(ey(a.peak) + 6).toFixed(1)} L${eaX},${ey(a.peak).toFixed(1)} L${eaX + 4},${(ey(a.peak) + 6).toFixed(1)}"/>`;
        body += `<text class="ea-text${a.cat === 'on' ? ' cat' : ''}" x="${eaX - 6}" y="${((yR + ey(a.peak)) / 2).toFixed(1)}" text-anchor="end">Ea ${a.peak} kJ</text>`;
        // reaction heat, from reactant level to product level
        const dhX = 356;
        body += `<line class="dh-arrow" x1="${dhX}" y1="${yR.toFixed(1)}" x2="${dhX}" y2="${yP.toFixed(1)}"/>`;
        const dir = yP > yR ? 1 : -1;
        body += `<path class="dh-arrow" d="M${dhX - 4},${(yP - dir * 6).toFixed(1)} L${dhX},${yP.toFixed(1)} L${dhX + 4},${(yP - dir * 6).toFixed(1)}"/>`;
        body += `<text class="dh-text" x="${dhX + 6}" y="${((yR + yP) / 2).toFixed(1)}">ΔH ${a.dh > 0 ? '+' : ''}${a.dh} kJ</text>`;

        let out = `<g clip-path="url(#stageClip)">${body}</g>`;
        // left of the axis and below the title line, which runs across the top
        out += `<text class="small-label" x="42" y="${E_TOP + 6}" text-anchor="end">에너지</text>`;
        out += `<text class="small-label" x="100" y="${(yR - 8).toFixed(1)}" text-anchor="middle">반응물</text>`;
        out += `<text class="small-label" x="360" y="${(yP + (a.dh > 0 ? -8 : 16)).toFixed(1)}" text-anchor="middle">생성물</text>`;
        out += `<text class="part-label" x="20" y="24">${a.heat === 'exo' ? '발열' : '흡열'} 반응 · ${a.T} ℃ · 촉매 ${a.cat === 'on' ? '있음' : '없음'}</text>`;
        out += `<text class="read-text" x="20" y="200">기준보다 ${a.rel >= 1 ? `${fmtRate(a.rel)}배 빠릅니다` : `${fmtRate(1 / a.rel)}배 느립니다`}</text>`;
        mainGroup.innerHTML = out;
    }

    const fmtRate = r => (r >= 100 ? r.toFixed(0) : r >= 10 ? r.toFixed(1) : r.toFixed(2));

    function renderEq(a) {
        const CYL = { x0: 70, x1: 210, bottom: 186 };
        // a smaller volume means a shorter cylinder
        const height = 40 + ((a.V - 0.5) / 1.5) * 96;
        const top = CYL.bottom - height;
        let body = '';
        const brown = Math.min(0.85, (a.no2 / 0.15) * 0.85);
        body += `<rect class="gas" fill="#c8703c" opacity="${brown.toFixed(3)}" x="${CYL.x0 + 3}" y="${top.toFixed(1)}" ` +
                `width="${CYL.x1 - CYL.x0 - 6}" height="${(height - 3).toFixed(1)}"/>`;
        // molecules in the right proportion: singles are brown, pairs are colourless
        const rand = (i) => ((i * 9301 + 49297) % 233280) / 233280;
        const nNO2 = Math.round(20 * (a.no2 / a.c0) / Math.max(0.001, (a.no2 + a.n2o4) / a.c0));
        const nN2O4 = 20 - nNO2;
        for (let i = 0; i < 20; i += 1) {
            const x = CYL.x0 + 12 + rand(i * 3) * (CYL.x1 - CYL.x0 - 26);
            const y = top + 10 + rand(i * 7 + 1) * Math.max(6, height - 22);
            if (i < nNO2) body += `<circle class="mol-no2" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.6"/>`;
            else body += `<g><circle class="mol-n2o4" cx="${(x - 3).toFixed(1)}" cy="${y.toFixed(1)}" r="3.2"/>` +
                         `<circle class="mol-n2o4" cx="${(x + 3).toFixed(1)}" cy="${y.toFixed(1)}" r="3.2"/></g>`;
        }
        body += `<rect class="piston" x="${CYL.x0 - 4}" y="${(top - 9).toFixed(1)}" width="${CYL.x1 - CYL.x0 + 8}" height="9" rx="2"/>`;
        body += `<path class="flask" d="M${CYL.x0},${(top - 9).toFixed(1)} L${CYL.x0},${CYL.bottom} L${CYL.x1},${CYL.bottom} L${CYL.x1},${(top - 9).toFixed(1)}"/>`;

        let out = `<g clip-path="url(#stageClip)">${body}</g>`;
        // beside the cylinder: the closing note runs under it
        out += `<text class="small-label" x="${CYL.x1 + 8}" y="180">${a.V.toFixed(1)} L · ${a.T} ℃</text>`;
        out += `<text class="part-label" x="240" y="44">2NO₂ ⇌ N₂O₄ + 57 kJ</text>`;
        out += `<text class="note-text" x="240" y="64">평형 상수 K = ${a.K.toFixed(1)}</text>`;
        out += `<text class="note-text" x="240" y="82">[NO₂] = ${a.no2.toFixed(4)} M (갈색)</text>`;
        out += `<text class="note-text" x="240" y="100">[N₂O₄] = ${a.n2o4.toFixed(4)} M (무색)</text>`;
        out += `<text class="note-text" x="240" y="118">질소의 ${(a.fracN2O4 * 100).toFixed(1)}%가 N₂O₄ 로</text>`;
        out += `<text class="note-text" x="240" y="136">기준 [NO₂] = ${a.ref.no2.toFixed(4)} M</text>`;
        const tone = a.verdict === 'darker' ? '#c8703c' : a.verdict === 'lighter' ? '#0284c7' : '#059669';
        out += `<text class="verdict-text" fill="${tone}" x="240" y="162">기준의 ${a.ratio.toFixed(2)}배 — ${EQ_WORD[a.verdict]}</text>`;
        out += `<text class="note-text" x="20" y="206">K는 온도만이 바꿉니다. 부피를 바꾸면 K는 그대로이고 농도만 달라집니다.</text>`;
        mainGroup.innerHTML = out;
    }

    const EQ_WORD = { darker: '갈색이 진합니다', same: '기준과 비슷합니다', lighter: '갈색이 옅습니다' };

    /* ------------------------------------------------------------ graphs */
    function frame(xTicks, yTicks, xTitle, yTitle) {
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
        out += `<text class="axis-title" x="${((GRAPH.x0 + GRAPH.x1) / 2).toFixed(1)}" y="${GRAPH.y0 + 32}" text-anchor="middle">${xTitle}</text>`;
        out += `<text class="axis-title" x="22" y="20">${yTitle}</text>`;
        return out;
    }

    function graphRate(a) {
        const LO = -2, HI = 5;
        const gx = T => GRAPH.x0 + (T / 100) * (GRAPH.x1 - GRAPH.x0);
        const gy = l => GRAPH.y0 - ((l - LO) / (HI - LO)) * (GRAPH.y0 - GRAPH.y1);
        let out = frame([0, 25, 50, 75, 100].map(T => [T, gx(T)]),
                        [-2, 0, 2, 4].map(l => [l === 0 ? '1배' : `10${sup(l)}배`, gy(l)]),
                        '온도 (℃)', '기준 대비 반응 속도');
        out += `<line class="ref-line" x1="${GRAPH.x0}" y1="${gy(0).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(0).toFixed(1)}"/>`;
        out += `<text class="ref-text" x="${GRAPH.x0 + 6}" y="${(gy(0) - 5).toFixed(1)}">기준 (25 ℃, 촉매 없음)</text>`;
        [['off', 'trace', '촉매 없음'], ['on', 'trace cat', '촉매 있음']].forEach(([c, cls, tag]) => {
            const pts = [];
            for (let T = 0; T <= 100; T += 1) {
                const l = Math.log10(analyseRate(T, c, a.heat).rel);
                pts.push(`${gx(T).toFixed(1)},${gy(Math.max(LO, Math.min(HI, l))).toFixed(1)}`);
            }
            const on = c === a.cat;
            out += `<path class="${cls}" opacity="${on ? 1 : 0.32}" d="M${pts.join('L')}"/>`;
            const endL = Math.min(HI, Math.log10(analyseRate(100, c, a.heat).rel));
            out += `<text class="curve-tag" fill="${c === 'on' ? '#059669' : '#d97706'}" opacity="${on ? 1 : 0.5}" ` +
                   `x="${GRAPH.x1 - 4}" y="${(gy(endL) + 12).toFixed(1)}" text-anchor="end">${tag}</text>`;
        });
        const l = Math.max(LO, Math.min(HI, Math.log10(a.rel)));
        out += `<circle class="trace-dot" cx="${gx(a.T).toFixed(1)}" cy="${gy(l).toFixed(1)}" r="5" fill="#d97706"/>`;
        graphGroup.innerHTML = out;
    }

    const sup = n => String(n).replace('-', '⁻').replace(/[0-9]/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)]);

    function graphEq(a) {
        const gx = T => GRAPH.x0 + (T / 100) * (GRAPH.x1 - GRAPH.x0);
        const gy = f => GRAPH.y0 - f * (GRAPH.y0 - GRAPH.y1);
        let out = frame([0, 25, 50, 75, 100].map(T => [T, gx(T)]),
                        [0, 0.25, 0.5, 0.75, 1].map(f => [`${(f * 100).toFixed(0)}%`, gy(f)]),
                        '온도 (℃)', 'N₂O₄로 있는 질소의 비율');
        [[0.5, 'rgba(217, 119, 6, .3)'], [1.0, '#d97706'], [2.0, 'rgba(217, 119, 6, .3)']].forEach(([V, col]) => {
            const pts = [];
            for (let T = 0; T <= 100; T += 1) pts.push(`${gx(T).toFixed(1)},${gy(analyseEq(T, V).fracN2O4).toFixed(1)}`);
            out += `<path class="trace" style="stroke:${col}" d="M${pts.join('L')}"/>`;
            out += `<text class="curve-tag" fill="${col}" x="${GRAPH.x1 - 4}" y="${(gy(analyseEq(100, V).fracN2O4) - 6).toFixed(1)}" text-anchor="end">${V} L</text>`;
        });
        if (![0.5, 1.0, 2.0].some(v => Math.abs(v - a.V) < 1e-9)) {
            const pts = [];
            for (let T = 0; T <= 100; T += 1) pts.push(`${gx(T).toFixed(1)},${gy(analyseEq(T, a.V).fracN2O4).toFixed(1)}`);
            out += `<path class="trace cat" d="M${pts.join('L')}"/>`;
        }
        out += `<circle class="trace-dot" cx="${gx(a.T).toFixed(1)}" cy="${gy(a.fracN2O4).toFixed(1)}" r="5" fill="#059669"/>`;
        graphGroup.innerHTML = out;
    }

    /* ------------------------------------------------------------ render */
    function render() {
        const a = analyse();
        if (a.kind === 'rate') { renderRate(a); graphRate(a); } else { renderEq(a); graphEq(a); }
        [['tRangeOut', `${state.T} ℃`], ['teRangeOut', `${state.Teq} ℃`], ['vRangeOut', `${state.V.toFixed(1)} L`]]
            .forEach(([id, txt]) => { const el = document.getElementById(id); if (el) el.textContent = txt; });
        methodHint.textContent = state.mode === 'rate'
            ? '기준은 25 ℃, 촉매 없음입니다'
            : '기준은 25 ℃, 1 L 입니다 · 정반응은 발열';
        stageBadge.textContent = a.kind === 'rate'
            ? `${fmtRate(a.rel >= 1 ? a.rel : 1 / a.rel)}배 ${a.rel >= 1 ? '빠름' : '느림'}`
            : `K ${a.K.toFixed(1)} · ${EQ_WORD[a.verdict]}`;
        dataNote.innerHTML = a.kind === 'rate'
            ? `<div class="data-row"><span class="data-name">활성화 에너지</span><span class="data-val">${a.peak} kJ/mol ${a.cat === 'on' ? '(촉매가 50 → 30으로 낮춤)' : ''}</span></div>` +
              `<div class="data-row"><span class="data-name">반응열</span><span class="data-val">ΔH = ${a.dh > 0 ? '+' : ''}${a.dh} kJ/mol — 촉매를 넣어도 그대로</span></div>` +
              `<div class="data-row"><span class="data-name">온도</span><span class="data-val">${a.T} ℃ = ${a.K.toFixed(1)} K</span></div>` +
              `<div class="data-row"><span class="data-name">상대 속도</span><span class="data-val">exp(Ea₀/RT₀ − Ea/RT) = ${fmtRate(a.rel)}배</span></div>` +
              `<div class="data-row match"><span class="data-name">기준과 견주면</span><span class="data-val">${RATE_WORD[a.verdict]}</span></div>`
            : `<div class="data-row"><span class="data-name">평형 상수</span><span class="data-val">${a.T} ℃ 에서 K = ${a.K.toFixed(1)} (25 ℃ 에서는 ${K_REF})</span></div>` +
              `<div class="data-row"><span class="data-name">농도</span><span class="data-val">[NO₂] ${a.no2.toFixed(4)} M · [N₂O₄] ${a.n2o4.toFixed(4)} M</span></div>` +
              `<div class="data-row"><span class="data-name">K 확인</span><span class="data-val">${a.n2o4.toFixed(4)} ÷ ${a.no2.toFixed(4)}² = ${(a.n2o4 / (a.no2 * a.no2)).toFixed(1)}</span></div>` +
              `<div class="data-row"><span class="data-name">N₂O₄ 비율</span><span class="data-val">${(a.fracN2O4 * 100).toFixed(1)}% (기준 ${(a.ref.fracN2O4 * 100).toFixed(1)}%)</span></div>` +
              `<div class="data-row match"><span class="data-name">색</span><span class="data-val">기준의 ${a.ratio.toFixed(2)}배 — ${EQ_WORD[a.verdict]}</span></div>`;
        return a;
    }

    const RATE_WORD = { faster: '빠르다', similar: '비슷하다', slower: '느리다' };

    function check() {
        const a = render();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        if (a.kind === 'rate') {
            labelA.textContent = '상대 속도'; labelB.textContent = '반응열';
            valueA.textContent = `${fmtRate(a.rel)}배`;
            valueB.textContent = `${a.dh > 0 ? '+' : ''}${a.dh} kJ/mol`;
            predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
                : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
            const hotter = analyseRate(Math.min(100, a.T + 10), a.cat, a.heat);
            let s = `활성화 에너지가 ${a.peak} kJ/mol 이고 온도가 ${a.K.toFixed(1)} K 이므로, 기준보다 ${fmtRate(a.rel)}배 ` +
                    `${a.rel >= 1 ? '빠릅니다' : '느립니다'}. `;
            s += `여기서 온도만 10 ℃ 올리면 ${fmtRate(hotter.rel / a.rel)}배 더 빨라집니다. ` +
                 `온도가 활성화 에너지를 넘는 분자의 비율을 지수적으로 바꾸기 때문입니다. `;
            s += a.cat === 'on'
                ? `촉매가 언덕을 50 kJ 에서 30 kJ로 낮춰 ${fmtRate(analyseRate(a.T, 'on', a.heat).rel / analyseRate(a.T, 'off', a.heat).rel)}배 빨라졌습니다. `
                : `촉매를 넣으면 같은 온도에서 ${fmtRate(analyseRate(a.T, 'on', a.heat).rel / a.rel)}배 빨라집니다. `;
            s += `다만 촉매는 언덕의 높이만 낮출 뿐 반응물과 생성물의 에너지는 건드리지 않으므로, 반응열은 ${a.dh > 0 ? '+' : ''}${a.dh} kJ/mol 그대로입니다.`;
            explanation.textContent = s;
            return;
        }
        labelA.textContent = '[NO₂]'; labelB.textContent = 'N₂O₄ 비율';
        valueA.textContent = `${a.no2.toFixed(4)} M`;
        valueB.textContent = `${(a.fracN2O4 * 100).toFixed(1)}%`;
        predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        let s = `${a.T} ℃ 에서 평형 상수는 ${a.K.toFixed(1)} 입니다. `;
        s += a.T > 25 ? `정반응이 발열이므로 온도를 올리면 흡열인 역반응 쪽으로 밀려 K가 25 ℃ 의 ${K_REF}보다 작아졌습니다. `
            : a.T < 25 ? `정반응이 발열이므로 온도를 내리면 정반응 쪽으로 밀려 K가 25 ℃ 의 ${K_REF}보다 커졌습니다. `
            : `기준 온도이므로 K는 ${K_REF} 그대로입니다. `;
        s += `이 K로 풀면 [NO₂] = ${a.no2.toFixed(4)} M, [N₂O₄] = ${a.n2o4.toFixed(4)} M 이고 질소의 ${(a.fracN2O4 * 100).toFixed(1)}%가 N₂O₄로 있습니다. `;
        if (Math.abs(a.V - 1) > 1e-9) {
            const sameT = analyseEq(a.T, 1.0);
            s += `부피를 ${a.V.toFixed(1)} L로 바꾸면 기체 몰수가 적은 N₂O₄ 쪽 비율이 ${(sameT.fracN2O4 * 100).toFixed(1)}% 에서 ` +
                 `${(a.fracN2O4 * 100).toFixed(1)}%로 ${a.V < 1 ? '늘어납니다' : '줄어듭니다'}. `;
            if (a.V > 1) s += `그런데 색은 농도로 정해지므로, NO₂ 비율이 늘어도 전체가 묽어져 갈색은 오히려 옅어집니다. 이동 방향과 색이 반대로 가는 것이 이 실험의 함정입니다. `;
        }
        s += `색은 [NO₂] 로 정해지는데 기준의 ${a.ratio.toFixed(2)}배이므로 ${EQ_WORD[a.verdict]}.`;
        explanation.textContent = s;
    }

    function changed() {
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
        stageCaption.textContent = state.mode === 'rate'
            ? '촉매는 활성화 에너지만 낮출 뿐 반응열은 바꾸지 못합니다.'
            : '갈색 NO₂와 무색 N₂O₄ 의 비율이 조건에 따라 달라집니다.';
        changed();
    }));
    checkBtn.addEventListener('click', check);
    resetBtn.addEventListener('click', () => {
        Object.assign(state, { heat: 'exo', cat: 'off', T: 25, Teq: 25, V: 1.0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'rate').click();
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

    window.__rateModel = {
        R, T_REF, EA_PLAIN, EA_CAT, DH, K_REF, DH_EQ, N_TOTAL, state,
        analyseRate, analyseEq, refEq, Kof, analyse, render, check,
        setMode(m) { modeButtons.find(b => b.dataset.mode === m).click(); },
        set(key, value) { state[key] = value; buildControls(); changed(); },
    };

    resetBtn.click();
});
