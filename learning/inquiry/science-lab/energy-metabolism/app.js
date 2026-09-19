'use strict';

/* A leaf's measurable gas exchange is the difference between two processes that
   never stop competing. Gross photosynthesis follows the non-rectangular
   hyperbola used for real light-response curves; respiration follows a plain
   Q10 rise. The compensation point, the limiting factor and the daily carbon
   balance are all read off those two curves rather than written in by hand. */

const PHI = 0.05;      // μmol CO2 fixed per μmol photons, while light is scarce
const PCAP = 30;       // μmol CO2 m-2 s-1, capacity when CO2 is not limiting
const KM_CO2 = 250;    // ppm, half-saturating CO2
const THETA = 0.7;     // curvature of the light response
const RREF = 1.6;      // μmol CO2 m-2 s-1, respiration at 25 ℃
const Q10 = 2;
const T_DENAT = 38;    // ℃, where the photosynthetic enzymes start to fail
const S_DENAT = 2.5;

const NADH_ATP = 2.5, FADH_ATP = 1.5;
const ATP_KJ = 30.5, GLUCOSE_KJ = 2870, LACTATE_KJ = 1361;

const DAY_SECONDS = 14;  // real seconds for one modelled day
const ATP_SECONDS = 9;

function fCO2(c) { return c / (c + KM_CO2); }
function fTemp(t) { return Math.pow(Q10, (t - 25) / 10) / (1 + Math.exp((t - T_DENAT) / S_DENAT)); }
function pmaxAt(c, t) { return PCAP * fCO2(c) * fTemp(t); }
function respAt(t) { return RREF * Math.pow(Q10, (t - 25) / 10); }

function grossAt(I, c, t) {
    const pm = pmaxAt(c, t);
    if (I <= 0 || pm <= 0) return 0;
    const b = PHI * I + pm;
    const disc = Math.max(0, b * b - 4 * THETA * PHI * I * pm);
    return (b - Math.sqrt(disc)) / (2 * THETA);
}
function netAt(I, c, t) { return grossAt(I, c, t) - respAt(t); }

// Slope of the light response at this light, against its slope in the dark.
// Near 1 the leaf is starved of light; near 0 something else holds it back.
function slopeShare(I, c, t) {
    const pm = pmaxAt(c, t);
    const P = grossAt(I, c, t);
    const den = 2 * THETA * P - (PHI * I + pm);
    if (den === 0) return 0;
    return ((P - pm) / den);
}

function bisect(f, lo, hi) {
    for (let i = 0; i < 60; i += 1) {
        const mid = (lo + hi) / 2;
        if (f(mid) > 0) hi = mid; else lo = mid;
    }
    return (lo + hi) / 2;
}
function compensationPoint(c, t) {
    if (netAt(20000, c, t) <= 0) return null;
    return bisect(I => netAt(I, c, t), 0, 20000);
}
function saturationPoint(c, t) {
    const target = 0.95 * pmaxAt(c, t);
    if (grossAt(60000, c, t) < target) return null;
    return bisect(I => grossAt(I, c, t) - target, 0, 60000);
}

// --- the ATP books ----------------------------------------------------------
function atpPlan(o2, shuttle) {
    if (!o2) {
        const stages = [
            { name: '해당 과정', short: '해당', where: '세포질', atp: 2, made: 'NADH 2', note: '포도당 1개가 피루브산 2개로 쪼개집니다' },
            { name: '젖산 발효', short: '젖산 발효', where: '세포질', atp: 0, made: 'NADH 2 소모', note: 'NADH로 피루브산을 젖산으로 되돌려 해당 과정을 계속 돌립니다' },
        ];
        return { stages, total: 2, sub: 2, etc: 0, cyto: 0, weights: [0.55, 0.45] };
    }
    const cyto = shuttle === 'malate' ? 2 * NADH_ATP : 2 * FADH_ATP;   // 5 or 3
    const etc = cyto + 8 * NADH_ATP + 2 * FADH_ATP;                    // 28 or 26
    const stages = [
        { name: '해당 과정', short: '해당', where: '세포질', atp: 2, made: 'NADH 2', note: '포도당 1개가 피루브산 2개로 쪼개집니다' },
        { name: '피루브산 산화', short: '피루브산', where: '미토콘드리아 기질', atp: 0, made: 'NADH 2', note: '피루브산이 아세틸 CoA가 되며 CO₂ 2개가 나옵니다' },
        { name: 'TCA 회로', short: 'TCA', where: '미토콘드리아 기질', atp: 2, made: 'NADH 6 · FADH₂ 2', note: '남은 탄소가 모두 CO₂ 4개로 빠져나갑니다' },
        { name: '산화적 인산화', short: '전자전달', where: '미토콘드리아 내막', atp: etc, made: '물 생성', note: '모아 둔 NADH와 FADH₂가 여기서 한꺼번에 ATP가 됩니다' },
    ];
    return { stages, total: 4 + etc, sub: 4, etc, cyto, weights: [0.24, 0.12, 0.29, 0.35] };
}

const state = {
    mode: 'leaf',
    light: 600, co2: 400, temp: 20,
    o2: true, shuttle: 'malate',
    prediction: null, checked: false,
    running: false, dayHour: 0, dayNet: 0, atpProgress: 0,
    peakLight: 600, phase: 0,
};

const $ = id => document.getElementById(id);
const svgNS = 'http://www.w3.org/2000/svg';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
// A leaf that is losing carbon shows a real minus sign, not a hyphen.
const fmt = (v, d) => v.toFixed(d).replace('-', '−');

function verdictLeaf() {
    const s = slopeShare(state.light, state.co2, state.temp);
    if (s >= 0.62) return 'p1';
    if (s >= 0.24) return 'p2';
    return 'p3';
}
function verdictAtp() {
    const total = atpPlan(state.o2, state.shuttle).total;
    return total === 32 ? 'p1' : (total === 30 ? 'p2' : 'p3');
}
function verdict() { return state.mode === 'leaf' ? verdictLeaf() : verdictAtp(); }

function analyse() {
    const { light: I, co2: c, temp: t } = state;
    const plan = atpPlan(state.o2, state.shuttle);
    const net = netAt(I, c, t);
    return {
        pmax: pmaxAt(c, t), resp: respAt(t),
        gross: grossAt(I, c, t), net,
        compensation: compensationPoint(c, t),
        saturation: saturationPoint(c, t),
        share: slopeShare(I, c, t),
        atpTotal: plan.total, atpStages: plan.stages,
        efficiency: plan.total * ATP_KJ / GLUCOSE_KJ,
        verdict: verdict(),
    };
}

// --- drawing helpers --------------------------------------------------------
function el(tag, attrs, text) {
    const n = document.createElementNS(svgNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text !== undefined) n.textContent = text;
    return n;
}
function mix(a, b, f) {
    return `rgb(${Math.round(a[0] + (b[0] - a[0]) * f)},${Math.round(a[1] + (b[1] - a[1]) * f)},${Math.round(a[2] + (b[2] - a[2]) * f)})`;
}

const NIGHT = [148, 163, 184], DAY = [186, 230, 253];

function drawLeaf(g) {
    const { light: I, co2: c, temp: t } = state;
    const net = netAt(I, c, t);
    const day = state.running ? (state.dayHour >= 6 && state.dayHour <= 18) : state.light > 0;
    const f = clamp(I / 2000, 0, 1);

    g.appendChild(el('rect', { x: 0, y: 0, width: 460, height: 200, class: 'sky', style: `fill:${mix(NIGHT, DAY, f)}` }));
    g.appendChild(el('path', { d: 'M 78 200 A 152 152 0 0 1 382 200', class: 'sun-track' }));
    g.appendChild(el('line', { x1: 8, y1: 200, x2: 452, y2: 200, class: 'horizon' }));

    // The sun sits at the height that would give this much light; during a day
    // run it swings across the whole arc instead.
    let ang;
    if (state.running) ang = Math.PI * clamp((state.dayHour - 6) / 12, 0, 1);
    else ang = Math.PI - Math.asin(clamp(Math.sqrt(f), 0, 1));
    if (day) {
        const sx = 230 - 152 * Math.cos(ang), sy = 200 - 152 * Math.sin(ang);
        for (let i = 0; i < 8; i += 1) {
            const a = i * Math.PI / 4;
            g.appendChild(el('line', {
                x1: sx + Math.cos(a) * 11, y1: sy + Math.sin(a) * 11,
                x2: sx + Math.cos(a) * (14 + 3 * Math.sin(state.phase * 2 + i)), y2: sy + Math.sin(a) * (14 + 3 * Math.sin(state.phase * 2 + i)),
                class: 'sun-ray',
            }));
        }
        g.appendChild(el('circle', { cx: sx, cy: sy, r: 9, class: 'sun-body' }));
    } else {
        g.appendChild(el('circle', { cx: 388, cy: 52, r: 8, style: 'fill:#cfe0ea' }));
        g.appendChild(el('circle', { cx: 384, cy: 49, r: 7, style: `fill:${mix(NIGHT, DAY, f)}` }));
    }

    g.appendChild(el('line', { x1: 230, y1: 200, x2: 230, y2: 170, class: 'stem' }));
    g.appendChild(el('path', { d: 'M 230 176 C 178 172 162 138 230 122 C 298 138 282 172 230 176 Z', class: 'leaf-blade' }));
    g.appendChild(el('path', { d: 'M 230 176 L 230 124 M 230 160 L 200 150 M 230 160 L 260 150 M 230 146 L 206 138 M 230 146 L 254 138', class: 'leaf-vein' }));

    // Gas streams. The left one always flows in, the right one always flows
    // out; which gas each carries flips when respiration wins.
    const inGas = net >= 0 ? 'co2' : 'o2';
    const outGas = net >= 0 ? 'o2' : 'co2';
    const nameOf = k => (k === 'co2' ? 'CO₂' : 'O₂');
    g.appendChild(el('path', { d: 'M 46 96 Q 118 104 190 140', class: 'flow-guide' }));
    g.appendChild(el('path', { d: 'M 270 140 Q 342 104 414 96', class: 'flow-guide' }));

    const mag = Math.abs(net);
    const dots = mag < 0.25 ? 0 : clamp(Math.round(mag * 0.7) + 1, 1, 8);
    const speed = clamp(0.1 + mag * 0.06, 0.1, 0.75);
    for (let i = 0; i < dots; i += 1) {
        const p = ((state.phase * speed) + i / dots) % 1;
        const q = 1 - p;
        const ax = q * q * 46 + 2 * q * p * 118 + p * p * 190;
        const ay = q * q * 96 + 2 * q * p * 104 + p * p * 140;
        const bx = q * q * 270 + 2 * q * p * 342 + p * p * 414;
        const by = q * q * 140 + 2 * q * p * 104 + p * p * 96;
        g.appendChild(el('circle', { cx: ax, cy: ay, r: 4, class: `gas-dot ${inGas}` }));
        g.appendChild(el('circle', { cx: bx, cy: by, r: 4, class: `gas-dot ${outGas}` }));
    }

    if (dots === 0) {
        g.appendChild(el('text', { x: 230, y: 100, 'text-anchor': 'middle', class: 'note-text' }, '드나드는 기체가 거의 없습니다'));
    } else {
        g.appendChild(el('text', { x: 40, y: 82, class: 'part-label' }, nameOf(inGas) + ' 들어감'));
        g.appendChild(el('text', { x: 420, y: 82, 'text-anchor': 'end', class: 'part-label' }, nameOf(outGas) + ' 나감'));
    }

    g.appendChild(el('text', { x: 22, y: 28, class: 'read-text' }, `빛 ${Math.round(I)}`));
    g.appendChild(el('text', { x: 22, y: 44, class: 'small-label' }, state.running ? `${String(Math.floor(state.dayHour)).padStart(2, '0')}시 · 하루를 ${DAY_SECONDS}초로` : 'μmol/m²/s'));
    g.appendChild(el('text', { x: 438, y: 28, 'text-anchor': 'end', class: 'read-text' }, `순광합성 ${fmt(net, 2)}`));
    g.appendChild(el('text', { x: 438, y: 44, 'text-anchor': 'end', class: 'small-label' }, `${state.temp} ℃ · CO₂ ${state.co2} ppm`));
    if (state.running || state.dayNet !== 0) {
        g.appendChild(el('text', { x: 230, y: 212, 'text-anchor': 'middle', class: 'note-text' }, `하루 수지 ${fmt(state.dayNet, 1)} mmol CO₂/m²`));
    }
}

function drawLeafGraph(g) {
    const { co2: c, temp: t } = state;
    const x0 = 54, x1 = 440, yTop = 26, yBot = 146;
    const pm = pmaxAt(c, t), R = respAt(t);
    const ymin = -(R + 0.8), ymax = pm * 1.12 + 0.6;
    const X = I => x0 + (I / 2000) * (x1 - x0);
    const Y = v => yBot - ((v - ymin) / (ymax - ymin)) * (yBot - yTop);

    for (let v = Math.ceil(ymin / 5) * 5; v <= ymax; v += 5) {
        g.appendChild(el('line', { x1: x0, y1: Y(v), x2: x1, y2: Y(v), class: 'grid-line' }));
        if (Y(v) < yBot - 8) g.appendChild(el('text', { x: x0 - 6, y: Y(v) + 3.5, 'text-anchor': 'end', class: 'axis-text' }, String(v)));
    }
    g.appendChild(el('line', { x1: x0, y1: yBot, x2: x1, y2: yBot, class: 'axis' }));
    g.appendChild(el('line', { x1: x0, y1: yTop, x2: x0, y2: yBot, class: 'axis' }));
    for (let I = 0; I <= 2000; I += 500) {
        g.appendChild(el('line', { x1: X(I), y1: yBot, x2: X(I), y2: yBot + 4, class: 'axis' }));
        g.appendChild(el('text', { x: X(I), y: yBot + 15, 'text-anchor': 'middle', class: 'axis-text' }, String(I)));
    }
    g.appendChild(el('line', { x1: x0, y1: Y(0), x2: x1, y2: Y(0), class: 'zero-line' }));
    g.appendChild(el('line', { x1: x0, y1: Y(-R), x2: x1, y2: Y(-R), class: 'resp-line' }));

    let dg = '', dn = '';
    for (let i = 0; i <= 160; i += 1) {
        const I = (i / 160) * 2000;
        dg += `${i ? 'L' : 'M'} ${fmt(X(I), 2)} ${fmt(Y(grossAt(I, c, t)), 2)} `;
        dn += `${i ? 'L' : 'M'} ${fmt(X(I), 2)} ${fmt(Y(netAt(I, c, t)), 2)} `;
    }
    g.appendChild(el('path', { d: dg, class: 'gross-line' }));
    g.appendChild(el('path', { d: dn, class: 'net-line' }));

    // The crossing sits so close to the axis that the label has to be lifted
    // into the empty corner above the curves and led back down to the mark.
    const ic = compensationPoint(c, t);
    if (ic !== null && ic <= 2000) {
        g.appendChild(el('line', { x1: X(ic), y1: Y(0) - 8, x2: X(ic), y2: Y(0) + 8, class: 'mark-line' }));
        g.appendChild(el('line', { x1: X(ic), y1: Y(0) - 8, x2: X(ic), y2: 46, class: 'mark-line', style: 'opacity:.4' }));
        g.appendChild(el('text', { x: X(ic) + 4, y: 42, class: 'axis-text' }, `광보상점 ${Math.round(ic)}`));
    }
    const sat = saturationPoint(c, t);
    if (sat !== null && sat <= 2000) {
        g.appendChild(el('line', { x1: X(sat), y1: yBot, x2: X(sat), y2: yBot - 12, class: 'mark-line' }));
        g.appendChild(el('text', { x: X(sat) - 4, y: yBot - 4, 'text-anchor': 'end', class: 'axis-text' }, `광포화점 ${Math.round(sat)}`));
    }
    g.appendChild(el('circle', { cx: X(state.light), cy: Y(netAt(state.light, c, t)), r: 5, class: 'trace-dot', style: 'fill:#059669' }));

    const keys = [['#d97706', '총광합성'], ['#059669', '순광합성 = 총광합성 − 호흡'], ['#ea580c', '호흡']];
    let lx = x0;
    keys.forEach(([col, label]) => {
        g.appendChild(el('line', { x1: lx, y1: 172, x2: lx + 15, y2: 172, style: `stroke:${col};stroke-width:3` }));
        g.appendChild(el('text', { x: lx + 20, y: 175.5, class: 'legend-text', style: `fill:${col}` }, label));
        lx += 26 + label.length * 8.4;
    });
    g.appendChild(el('text', { x: (x0 + x1) / 2, y: 191, 'text-anchor': 'middle', class: 'axis-title' }, '빛 세기 (μmol/m²/s) — 세로는 CO₂ 속도 (μmol/m²/s)'));
}

function atpStageAt() {
    const plan = atpPlan(state.o2, state.shuttle);
    if (!state.running) return { idx: plan.stages.length - 1, frac: 1, plan, done: plan.total };
    let acc = 0;
    for (let i = 0; i < plan.weights.length; i += 1) {
        if (state.atpProgress < acc + plan.weights[i] || i === plan.weights.length - 1) {
            const frac = clamp((state.atpProgress - acc) / plan.weights[i], 0, 1);
            let done = 0;
            for (let j = 0; j < i; j += 1) done += plan.stages[j].atp;
            return { idx: i, frac, plan, done: done + plan.stages[i].atp * frac };
        }
        acc += plan.weights[i];
    }
    return { idx: 0, frac: 0, plan, done: 0 };
}

function drawCell(g) {
    const { idx, frac, plan, done } = atpStageAt();
    const aer = state.o2;

    g.appendChild(el('rect', { x: 20, y: 16, width: 420, height: 182, rx: 18, class: 'cell-wall' }));
    g.appendChild(el('text', { x: 32, y: 34, class: 'small-label' }, '세포질'));

    g.appendChild(el('rect', { x: 222, y: 52, width: 206, height: 132, rx: 30, class: 'mito-wall', style: aer ? '' : 'opacity:.3' }));
    g.appendChild(el('path', { d: 'M 232 78 q 22 12 0 24 M 232 118 q 22 12 0 24 M 232 158 q 22 12 0 24', class: 'mito-inner', style: aer ? '' : 'opacity:.3' }));
    g.appendChild(el('text', { x: 325, y: 46, 'text-anchor': 'middle', class: 'small-label', style: aer ? '' : 'opacity:.45' }, '미토콘드리아'));

    const boxes = aer
        ? [[34, 60, 150, 44], [238, 66, 176, 34], [238, 106, 176, 34], [238, 146, 176, 34]]
        : [[34, 56, 150, 44], [34, 108, 150, 44]];

    plan.stages.forEach((s, i) => {
        const [bx, by, bw, bh] = boxes[i];
        const on = i === idx;
        g.appendChild(el('rect', { x: bx, y: by, width: bw, height: bh, rx: 10, class: `step-box${on ? ' on' : ''}` }));
        g.appendChild(el('text', { x: bx + bw / 2, y: by + (bh > 40 ? 20 : 16), 'text-anchor': 'middle', class: 'step-text', style: `fill:${on ? '#b45309' : '#0f172a'}` }, s.name));
        g.appendChild(el('text', { x: bx + bw / 2, y: by + (bh > 40 ? 34 : 28), 'text-anchor': 'middle', class: 'step-sub', style: `fill:${on ? '#92400e' : '#475569'}` }, `ATP ${s.atp} · ${s.made}`));
    });

    g.appendChild(el('text', { x: 109, y: 48, 'text-anchor': 'middle', class: 'part-label' }, '포도당 1분자'));

    if (aer) {
        g.appendChild(el('path', { d: 'M 186 82 L 232 82', class: 'arrow-line' }));
        g.appendChild(el('path', { d: 'M 232 82 l -7 -4 l 0 8 z', class: 'arrow-head' }));
        g.appendChild(el('text', { x: 209, y: 74, 'text-anchor': 'middle', class: 'small-label' }, '피루브산'));
        g.appendChild(el('path', { d: 'M 326 100 L 326 106 M 326 140 L 326 146', class: 'arrow-line' }));
        // Carriers made earlier stream to the membrane once the chain is running.
        if (idx === 3) {
            for (let i = 0; i < 6; i += 1) {
                const p = ((state.phase * 0.5) + i / 6) % 1;
                const sy = 92 + (i % 3) * 22;
                g.appendChild(el('circle', { cx: 250 + p * 150, cy: sy + (168 - sy) * p, r: 3.6, class: `carrier ${i % 4 === 3 ? 'fadh' : 'nadh'}` }));
            }
        }
    } else {
        g.appendChild(el('path', { d: 'M 109 106 L 109 112', class: 'arrow-line' }));
        g.appendChild(el('text', { x: 325, y: 124, 'text-anchor': 'middle', class: 'note-text', style: 'opacity:.75' }, '산소가 없어'));
        g.appendChild(el('text', { x: 325, y: 138, 'text-anchor': 'middle', class: 'note-text', style: 'opacity:.75' }, '쓰이지 못합니다'));
    }

    // ATP made so far, ticking up in step with the stages.
    const showing = state.running ? done : plan.total;
    g.appendChild(el('text', { x: 34, y: 166, class: 'small-label' }, state.running ? '지금까지 만든 ATP' : '포도당 1분자가 만드는 ATP'));
    g.appendChild(el('text', { x: 34, y: 194, class: 'big-count' }, `${state.running ? Math.floor(showing) : showing}개`));
    for (let i = 0; i < Math.min(12, Math.round(showing)); i += 1) {
        g.appendChild(el('circle', { cx: 110 + (i % 6) * 13, cy: 178 + Math.floor(i / 6) * 12, r: 4.2, class: 'atp-dot' }));
    }
    if (state.running) {
        g.appendChild(el('text', { x: 438, y: 210, 'text-anchor': 'end', class: 'note-text' }, `${plan.stages[idx].name} · ${Math.round(frac * 100)}%`));
    }
}

function drawCellGraph(g) {
    const { idx, frac, plan } = atpStageAt();
    const x0 = 54, x1 = 440, yTop = 30, yBot = 146;
    const ymax = 34;
    const Y = v => yBot - (v / ymax) * (yBot - yTop);
    const n = plan.stages.length;
    const slot = (x1 - x0) / n;

    for (let v = 0; v <= 30; v += 10) {
        g.appendChild(el('line', { x1: x0, y1: Y(v), x2: x1, y2: Y(v), class: 'grid-line' }));
        g.appendChild(el('text', { x: x0 - 6, y: Y(v) + 3.5, 'text-anchor': 'end', class: 'axis-text' }, String(v)));
    }
    g.appendChild(el('line', { x1: x0, y1: yBot, x2: x1, y2: yBot, class: 'axis' }));
    g.appendChild(el('line', { x1: x0, y1: yTop, x2: x0, y2: yBot, class: 'axis' }));

    let cum = 0;
    const pts = [];
    plan.stages.forEach((s, i) => {
        const cx = x0 + slot * (i + 0.5);
        const live = state.running ? (i < idx ? 1 : (i === idx ? frac : 0)) : 1;
        const h = s.atp * live;
        cum += h;
        pts.push([cx, Y(cum)]);
        const bw = Math.min(58, slot * 0.6);
        if (h > 0.02) g.appendChild(el('rect', { x: cx - bw / 2, y: Y(h), width: bw, height: yBot - Y(h), rx: 3, class: 'bar-body', style: 'fill:rgba(217, 119, 6, .5)' }));
        else g.appendChild(el('line', { x1: cx - bw / 2, y1: yBot - 1, x2: cx + bw / 2, y2: yBot - 1, style: 'stroke:rgba(217, 119, 6, .5);stroke-width:2' }));
        g.appendChild(el('text', { x: cx, y: Y(h) - 6, 'text-anchor': 'middle', class: 'bar-text', style: 'fill:#b45309' }, fmt(h, h % 1 ? 1 : 0)));
        g.appendChild(el('text', { x: cx, y: yBot + 15, 'text-anchor': 'middle', class: 'axis-text' }, s.short));
    });

    let d = '';
    pts.forEach(([px, py], i) => { d += `${i ? 'L' : 'M'} ${fmt(px, 2)} ${fmt(py, 2)} `; });
    g.appendChild(el('path', { d, style: 'fill:none;stroke:#059669;stroke-width:2.4' }));
    pts.forEach(([px, py]) => g.appendChild(el('circle', { cx: px, cy: py, r: 3.6, style: 'fill:#059669' })));

    g.appendChild(el('line', { x1: x0, y1: 172, x2: x0 + 15, y2: 172, style: 'stroke:#d97706;stroke-width:3' }));
    g.appendChild(el('text', { x: x0 + 20, y: 175.5, class: 'legend-text', style: 'fill:#d97706' }, '단계별 ATP'));
    g.appendChild(el('line', { x1: x0 + 132, y1: 172, x2: x0 + 147, y2: 172, style: 'stroke:#059669;stroke-width:3' }));
    g.appendChild(el('text', { x: x0 + 152, y: 175.5, class: 'legend-text', style: 'fill:#059669' }, '누적 ATP'));
    const eff = plan.total * ATP_KJ / GLUCOSE_KJ;
    g.appendChild(el('text', { x: (x0 + x1) / 2, y: 191, 'text-anchor': 'middle', class: 'axis-title' }, `포도당 2870 kJ · ATP 1개 30.5 kJ → 에너지의 ${fmt(eff * 100, 1)}%가 ATP로`));
}

function render() {
    const main = $('mainGroup'), graph = $('graphGroup');
    main.textContent = '';
    graph.textContent = '';
    if (state.mode === 'leaf') { drawLeaf(main); drawLeafGraph(graph); }
    else { drawCell(main); drawCellGraph(graph); }
    updateReadout();
}

function updateReadout() {
    const a = analyse();
    if (state.mode === 'leaf') {
        $('stageBadge').textContent = `${state.light} μmol · ${state.co2} ppm · ${state.temp} ℃`;
        $('labelA').textContent = '순광합성 속도';
        $('valueA').textContent = `${fmt(a.net, 2)} μmol/m²/s`;
        $('labelB').textContent = '광보상점';
        $('valueB').textContent = a.compensation === null ? '없음' : `${Math.round(a.compensation)} μmol/m²/s`;
        const rows = [
            ['총광합성', `${fmt(a.gross, 2)} μmol/m²/s`, false],
            ['호흡', `${fmt(a.resp, 2)} μmol/m²/s`, false],
            ['최대 광합성 속도', `${fmt(a.pmax, 2)} μmol/m²/s`, false],
            ['광포화점(95%)', a.saturation === null ? '없음' : `${Math.round(a.saturation)} μmol/m²/s${a.saturation > 2000 ? ' — 이 실험 범위 밖' : ''}`, false],
            ['빛이 붙잡는 정도', `${Math.round(a.share * 100)}%`, a.share >= 0.62],
            ['하루 수지', `${fmt(state.dayNet, 1)} mmol CO₂/m²`, state.dayNet > 0],
        ];
        $('dataNote').innerHTML = rows.map(([n, v, m]) =>
            `<div class="data-row${m ? ' match' : ''}"><span class="data-name">${n}</span><span class="data-val">${v}</span></div>`).join('');
    } else {
        const plan = atpPlan(state.o2, state.shuttle);
        $('stageBadge').textContent = state.o2 ? `산소 있음 · ${state.shuttle === 'malate' ? '말산 셔틀' : '글리세롤 인산 셔틀'}` : '산소 없음 · 젖산 발효';
        $('labelA').textContent = '포도당 1분자의 ATP';
        $('valueA').textContent = `${plan.total}개`;
        $('labelB').textContent = '에너지 효율';
        $('valueB').textContent = `${fmt(a.efficiency * 100, 1)}%`;
        const leftover = state.o2 ? 0 : 2 * LACTATE_KJ / GLUCOSE_KJ;
        const net = netAt(state.light, state.co2, state.temp);
        const rows = [
            ['기질 수준 인산화', `${plan.sub}개`, false],
            ['산화적 인산화', `${plan.etc}개`, plan.etc > 0],
            ['세포질 NADH 몫', state.o2 ? `${plan.cyto}개 (${state.shuttle === 'malate' ? 'NADH로 전달' : 'FADH₂로 전달'})` : '해당 과정 유지에 씀', false],
            ['젖산에 남은 에너지', state.o2 ? '없음 — 끝까지 분해함' : `${fmt(leftover * 100, 1)}%`, false],
            ['이 잎이 1시간에 벌어들이는 ATP', net > 0
                ? `${fmt(net * 3600 / 6 * plan.total / 1000, 1)} mmol/m²`
                : '순광합성이 0 이하라 남는 포도당이 없습니다', net > 0],
        ];
        $('dataNote').innerHTML = rows.map(([n, v, m]) =>
            `<div class="data-row${m ? ' match' : ''}"><span class="data-name">${n}</span><span class="data-val">${v}</span></div>`).join('');
    }
    if (state.checked) explain(a);
}

const LEAF_WORDS = { p1: '크게 는다', p2: '조금 는다', p3: '거의 그대로' };
const ATP_WORDS = { p1: '32개', p2: '30개', p3: '2개' };

function explain(a) {
    $('resultEmpty').hidden = true;
    $('resultContent').hidden = false;
    const words = state.mode === 'leaf' ? LEAF_WORDS : ATP_WORDS;
    const v = a.verdict;
    if (state.prediction) {
        const ok = state.prediction === v;
        $('predictionResult').textContent = ok
            ? `예상이 맞았습니다 — ${words[v]}.`
            : `예상은 ${words[state.prediction]}였지만 결과는 ${words[v]}입니다.`;
        $('predictionResult').className = `prediction-result ${ok ? 'correct' : 'wrong'}`;
    } else {
        $('predictionResult').textContent = '';
        $('predictionResult').className = 'prediction-result';
    }

    if (state.mode === 'leaf') {
        const ic = a.compensation;
        let s = `빛 ${state.light} μmol/m²/s에서 총광합성은 ${fmt(a.gross, 2)}, 호흡은 ${fmt(a.resp, 2)}이므로 겉으로 드러나는 순광합성은 ${fmt(a.net, 2)} μmol/m²/s입니다. `;
        s += a.net > 0.25 ? `잎은 이산화 탄소를 빨아들이고 산소를 내놓습니다. `
            : (a.net < -0.25 ? `광합성이 호흡을 따라가지 못해 오히려 이산화 탄소를 내놓습니다. `
                : `두 과정의 크기가 거의 같아 드나드는 기체가 없는 것처럼 보입니다. `);
        if (ic !== null) s += `이 온도와 이산화 탄소 농도에서 광보상점은 ${Math.round(ic)} μmol/m²/s입니다. `;
        s += `지금은 빛을 조금 더 주었을 때 광합성이 늘어나는 정도가 깜깜할 때의 ${Math.round(a.share * 100)}%입니다. `;
        s += v === 'p1' ? `빛이 가장 모자라므로 빛만 늘려도 크게 빨라집니다.`
            : (v === 'p2' ? `빛과 다른 조건이 함께 붙잡고 있어 조금 늘어나는 데 그칩니다.`
                : `빛은 이미 넉넉해서 더 비춰도 소용이 없고, 이제는 이산화 탄소 농도와 온도가 속도를 정합니다.`);
        if (state.dayNet !== 0) {
            s += ` 하루를 재현해 보니 이 잎은 하루에 ${fmt(state.dayNet, 1)} mmol CO₂/m²${state.dayNet > 0 ? '를 벌었습니다. 밤새 호흡으로 까먹는 몫을 낮에 메우고도 남았습니다.' : '를 잃었습니다. 낮에 번 것으로 밤의 호흡을 감당하지 못하면 식물은 결국 말라 죽습니다.'}`;
        }
        $('elementaryExplanation').textContent = s;
    } else {
        const plan = atpPlan(state.o2, state.shuttle);
        let s = '';
        if (state.o2) {
            s = `해당 과정과 TCA 회로에서 직접 만드는 ATP는 ${plan.sub}개뿐이고, 나머지 ${plan.etc}개는 모아 둔 NADH와 FADH₂가 전자전달계를 지나며 만들어집니다. NADH 하나는 2.5개, FADH₂ 하나는 1.5개 몫입니다. `;
            s += state.shuttle === 'malate'
                ? `세포질에서 만든 NADH 2개를 말산·아스파르트산 셔틀로 들여보내면 미토콘드리아 안에서도 NADH로 남아 5개 몫을 하므로 모두 32개가 됩니다.`
                : `세포질에서 만든 NADH 2개를 글리세롤 인산 셔틀로 들여보내면 FADH₂로 바뀌어 3개 몫밖에 못 하므로 모두 30개가 됩니다. 셔틀 하나 차이로 ATP 2개가 갈립니다.`;
            s += ` 포도당 1분자에 든 2870 kJ 가운데 ATP에 담기는 몫은 ${fmt(plan.total * ATP_KJ, 0)} kJ, 곧 ${fmt(plan.total * ATP_KJ / GLUCOSE_KJ * 100, 1)}%이고 나머지는 열로 흩어집니다.`;
        } else {
            s = `산소가 없으면 전자전달계가 멈춥니다. NADH의 산화가 막혀 NAD⁺가 부족해지면 해당 과정이 지속되지 못하므로, 세포는 피루브산을 젖산으로 바꾸면서 NADH를 산화하여 NAD⁺를 재생하고 해당 과정만 겨우 돌립니다. 그래서 남는 ATP는 ${plan.total}개뿐입니다. `;
            s += `포도당이 끝까지 분해되지 않았으므로 에너지가 사라진 것은 아닙니다. 2870 kJ 가운데 ${fmt(2 * LACTATE_KJ, 0)} kJ, 곧 ${fmt(2 * LACTATE_KJ / GLUCOSE_KJ * 100, 1)}%가 젖산 두 분자 속에 그대로 갇혀 있습니다.`;
        }
        $('elementaryExplanation').textContent = s;
    }
}

// --- animation --------------------------------------------------------------
function tick(dt) {
    state.phase += dt;
    if (!state.running) return false;
    if (state.mode === 'leaf') {
        const before = state.dayHour;
        state.dayHour = Math.min(24, state.dayHour + dt * 24 / DAY_SECONDS);
        const dh = state.dayHour - before;
        const I = state.dayHour >= 6 && state.dayHour <= 18
            ? state.peakLight * Math.sin(Math.PI * (state.dayHour - 6) / 12) : 0;
        state.light = Math.round(I);
        $('lightRange').value = String(clamp(Math.round(I / 25) * 25, 0, 2000));
        $('lightOutput').textContent = `${state.light} μmol/m²/s`;
        state.dayNet += netAt(I, state.co2, state.temp) * dh * 3600 / 1000;
        if (state.dayHour >= 24) {
            state.running = false;
            state.light = state.peakLight;
            $('lightRange').value = String(state.peakLight);
            $('lightOutput').textContent = `${state.peakLight} μmol/m²/s`;
            $('runBtn').textContent = '하루 재현';
            state.checked = true;
            return true;
        }
    } else {
        state.atpProgress = Math.min(1, state.atpProgress + dt / ATP_SECONDS);
        if (state.atpProgress >= 1) {
            state.running = false;
            $('runBtn').textContent = '포도당 따라가기';
            state.checked = true;
            return true;
        }
    }
    return false;
}

let last = 0;
function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    tick(dt);
    render();
    requestAnimationFrame(frame);
}

// --- wiring -----------------------------------------------------------------
function markSelected(sel, attr, value) {
    document.querySelectorAll(sel).forEach(b => b.classList.toggle('selected', b.dataset[attr] === String(value)));
}

function applyMode() {
    markSelected('[data-mode]', 'mode', state.mode);
    $('leafControls').hidden = state.mode !== 'leaf';
    $('atpControls').hidden = state.mode === 'leaf';
    const leaf = state.mode === 'leaf';
    $('predictionLegend').textContent = leaf ? '여기서 빛을 더 세게 하면 광합성은?' : '이 조건에서 포도당 1분자가 만드는 ATP는?';
    const words = leaf ? LEAF_WORDS : ATP_WORDS;
    document.querySelectorAll('[data-prediction]').forEach(b => { b.textContent = words[b.dataset.prediction]; });
    $('runBtn').textContent = leaf ? '하루 재현' : '포도당 따라가기';
    $('stageCaption').textContent = leaf
        ? '잎은 빛을 받는 동안에도 쉬지 않고 호흡합니다. 눈에 보이는 기체 출입은 둘의 차이입니다.'
        : '단계의 길이는 실제 걸리는 시간의 비율이 아닙니다. ATP 개수만 정확합니다.';
    state.running = false;
    state.atpProgress = 0;
    render();
}

document.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => {
    state.mode = b.dataset.mode; state.prediction = null; state.checked = false;
    document.querySelectorAll('[data-prediction]').forEach(x => x.classList.remove('selected'));
    $('resultEmpty').hidden = false; $('resultContent').hidden = true;
    applyMode();
}));
document.querySelectorAll('[data-co2]').forEach(b => b.addEventListener('click', () => {
    state.co2 = Number(b.dataset.co2); markSelected('[data-co2]', 'co2', state.co2); render();
}));
document.querySelectorAll('[data-temp]').forEach(b => b.addEventListener('click', () => {
    state.temp = Number(b.dataset.temp); markSelected('[data-temp]', 'temp', state.temp); render();
}));
document.querySelectorAll('[data-o2]').forEach(b => b.addEventListener('click', () => {
    state.o2 = b.dataset.o2 === 'yes'; markSelected('[data-o2]', 'o2', state.o2 ? 'yes' : 'no'); render();
}));
document.querySelectorAll('[data-shuttle]').forEach(b => b.addEventListener('click', () => {
    state.shuttle = b.dataset.shuttle; markSelected('[data-shuttle]', 'shuttle', state.shuttle); render();
}));
document.querySelectorAll('[data-prediction]').forEach(b => b.addEventListener('click', () => {
    state.prediction = b.dataset.prediction; markSelected('[data-prediction]', 'prediction', state.prediction);
}));
$('lightRange').addEventListener('input', e => {
    state.light = Number(e.target.value);
    state.peakLight = state.light;
    $('lightOutput').textContent = `${state.light} μmol/m²/s`;
    render();
});
$('runBtn').addEventListener('click', () => {
    if (state.running) { state.running = false; applyMode(); return; }
    state.checked = true;
    if (state.mode === 'leaf') {
        state.peakLight = state.light;
        state.dayHour = 0; state.dayNet = 0; state.running = true;
        $('runBtn').textContent = '멈추기';
    } else {
        state.atpProgress = 0; state.running = true;
        $('runBtn').textContent = '멈추기';
    }
    render();
});
$('resetBtn').addEventListener('click', () => {
    state.mode = 'leaf'; state.light = 600; state.peakLight = 600; state.co2 = 400; state.temp = 20;
    state.o2 = true; state.shuttle = 'malate';
    state.prediction = null; state.checked = false; state.running = false;
    state.dayHour = 0; state.dayNet = 0; state.atpProgress = 0;
    $('lightRange').value = '600'; $('lightOutput').textContent = '600 μmol/m²/s';
    document.querySelectorAll('[data-prediction]').forEach(x => x.classList.remove('selected'));
    $('resultEmpty').hidden = false; $('resultContent').hidden = true;
    markSelected('[data-co2]', 'co2', 400); markSelected('[data-temp]', 'temp', 20);
    markSelected('[data-o2]', 'o2', 'yes'); markSelected('[data-shuttle]', 'shuttle', 'malate');
    applyMode();
});

document.querySelectorAll('.quiz-card').forEach(card => {
    card.querySelector('.answer-button').addEventListener('click', () => {
        const picked = card.querySelector('input:checked');
        const result = card.querySelector('.answer-result');
        const why = card.querySelector('.answer-explanation');
        if (!picked) { result.textContent = '먼저 답을 골라 보세요.'; result.className = 'answer-result'; return; }
        const ok = picked.value === card.dataset.answer;
        result.textContent = ok ? '맞았습니다.' : '다시 생각해 볼까요?';
        result.className = `answer-result ${ok ? 'correct' : 'wrong'}`;
        why.hidden = false;
    });
});

markSelected('[data-co2]', 'co2', 400);
markSelected('[data-temp]', 'temp', 20);
markSelected('[data-o2]', 'o2', 'yes');
markSelected('[data-shuttle]', 'shuttle', 'malate');
applyMode();
requestAnimationFrame(frame);

window.__metabModel = {
    state, analyse, tick, render,
    grossAt, netAt, respAt, pmaxAt, slopeShare, compensationPoint, saturationPoint, atpPlan,
    setMode(m) { document.querySelector(`[data-mode="${m}"]`).click(); },
    setLight(v) { const r = $('lightRange'); r.value = String(v); r.dispatchEvent(new Event('input')); },
    setCO2(v) { document.querySelector(`[data-co2="${v}"]`).click(); },
    setTemp(v) { document.querySelector(`[data-temp="${v}"]`).click(); },
    setO2(v) { document.querySelector(`[data-o2="${v ? 'yes' : 'no'}"]`).click(); },
    setShuttle(v) { document.querySelector(`[data-shuttle="${v}"]`).click(); },
    check() { state.checked = true; explain(analyse()); },
    runToEnd(dt = 1 / 30) {
        $('runBtn').click();
        let steps = 0;
        while (state.running && steps < 20000) { tick(dt); steps += 1; }
        render();
        return { steps, dayNet: state.dayNet, dayHour: state.dayHour, atpProgress: state.atpProgress };
    },
};
