'use strict';

/* Vinegar and baking soda react one for one, so the foam stops growing the
   moment the smaller of the two runs out. That is the whole page: the curve
   climbs while soda is scarce and goes flat the instant the vinegar is spent,
   and the flat part is the bit worth noticing. */

const ACID_PER_ML = 0.05 / 60;   // 5% acetic acid, 60 g per mole
const SODA_PER_G = 1 / 84;       // baking soda, 84 g per mole
const LITRE_PER_MOL = 24;        // gas volume at room temperature
const NEAR = 0.3;                // g, close enough to call it an even match

const VINEGARS = [20, 50, 100];

const state = {
    vin: 50, soda: 3.5,
    prediction: null, checked: false,
    running: false, t: 0, phase: 0,
};

const $ = id => document.getElementById(id);
const svgNS = 'http://www.w3.org/2000/svg';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = (v, d) => v.toFixed(d).replace('-', '−');

function acidMol(ml) { return ml * ACID_PER_ML; }
function sodaMol(g) { return g * SODA_PER_G; }
// The soda that exactly uses up this much vinegar, and nothing more.
function matchGrams(ml) { return acidMol(ml) / SODA_PER_G; }
function gasLitres(ml, g) { return Math.min(acidMol(ml), sodaMol(g)) * LITRE_PER_MOL; }

function verdictFor(ml, g) {
    const m = matchGrams(ml);
    if (Math.abs(g - m) <= NEAR) return 'p3';
    return g > m ? 'p1' : 'p2';
}

function analyse() {
    const m = matchGrams(state.vin);
    const gas = gasLitres(state.vin, state.soda);
    const most = gasLitres(state.vin, 999);
    return {
        vin: state.vin, soda: state.soda, match: m, gas, most,
        leftSoda: Math.max(0, state.soda - m),
        leftVin: Math.max(0, (m - state.soda) / m) * state.vin,
        full: gas / most,
        verdict: verdictFor(state.vin, state.soda),
    };
}

function el(tag, attrs, text) {
    const n = document.createElementNS(svgNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text !== undefined) n.textContent = text;
    return n;
}

const BASE_Y = 214, PEAK_X = 150, RIM_Y = 92, FOOT_L = 22, FOOT_R = 278;
const smooth = (v) => (v <= 0 ? 0 : v >= 1 ? 1 : v * v * (3 - 2 * v));
const span = (v, a, b) => smooth((v - a) / (b - a));

// How far the reaction has gone on screen: 0 before soda goes in, 1 when it is over.
function progress() {
    if (state.running) return state.t;
    return state.checked ? 1 : 0;
}

function drawModel(g) {
    const a = analyse();
    const p = progress();
    const done = state.checked && !state.running;
    // More carbon dioxide pushes the foam higher and farther down the slope.
    const power = a.gas / gasLitres(100, 999);
    const rise = span(p, 0.08, 0.32) * (1 - 0.7 * span(p, 0.6, 1));
    const columnH = (16 + 54 * power) * rise;
    const flow = span(p, 0.22, 0.85) * Math.min(1, 0.22 + 0.9 * power);
    const wob = state.phase;

    g.appendChild(el('rect', { x: 8, y: BASE_Y, width: 290, height: 12, rx: 3, class: 'board' }));

    // Clay cone with an uneven outline, gullies and a crater opening.
    const cone = `M ${FOOT_L} ${BASE_Y} L 48 196 L 66 184 L 84 160 L 100 146 L 114 124 L 128 110 L ${PEAK_X - 20} ${RIM_Y + 2} ` +
        `L ${PEAK_X + 20} ${RIM_Y + 2} L 174 108 L 190 126 L 206 142 L 222 162 L 240 178 L 258 196 L ${FOOT_R} ${BASE_Y} Z`;
    g.appendChild(el('path', { d: cone, fill: 'url(#clayShade)', stroke: '#6d4a2c', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }));
    [[118, 128, 96, 196], [140, 104, 128, 205], [166, 106, 188, 200], [182, 124, 228, 204]].forEach(([x1, y1, x2, y2]) => {
        g.appendChild(el('path', { d: `M ${x1} ${y1} Q ${(x1 + x2) / 2 + 6} ${(y1 + y2) / 2} ${x2} ${y2}`, fill: 'none', stroke: 'rgba(90,58,32,.35)', 'stroke-width': 2 }));
    });
    [[92, 182, 7], [196, 170, 6], [120, 160, 5], [230, 196, 8], [64, 204, 6], [170, 150, 4]].forEach(([x, y, r]) => {
        g.appendChild(el('ellipse', { cx: x, cy: y, rx: r, ry: r * 0.55, fill: 'rgba(95,64,38,.28)' }));
    });
    g.appendChild(el('ellipse', { cx: PEAK_X, cy: RIM_Y + 3, rx: 19, ry: 5, fill: '#3e2a1b' }));

    // Soda poured in from a spoon at the start.
    if (state.running && p < 0.16) {
        const sp = span(p, 0, 0.06);
        g.appendChild(el('path', { d: `M ${PEAK_X + 58} ${30 - sp * 6} L ${PEAK_X + 16} ${46 + sp * 4}`, stroke: '#8a98a2', 'stroke-width': 4, 'stroke-linecap': 'round' }));
        g.appendChild(el('ellipse', { cx: PEAK_X + 12, cy: 48 + sp * 4, rx: 10, ry: 5, fill: '#c3ccd2', stroke: '#6f7c85' }));
        for (let i = 0; i < 9; i += 1) {
            const q = (p * 14 + i / 9) % 1;
            g.appendChild(el('circle', { cx: PEAK_X + 8 + (i % 3) * 3 - q * 6, cy: 52 + q * (RIM_Y - 52), r: 1.8, class: 'soda-grain' }));
        }
    }

    // Foam streams running down both slopes.
    if (flow > 0.01) {
        [[-1, FOOT_L + 12], [1, FOOT_R - 12]].forEach(([s, footX]) => {
            const x0 = PEAK_X + s * 14, y0 = RIM_Y + 4;
            const x1 = x0 + (footX - x0) * flow, y1 = y0 + (BASE_Y - 4 - y0) * flow;
            const pts = [];
            for (let i = 0; i <= 14; i += 1) {
                const u = i / 14, x = x0 + (x1 - x0) * u, y = y0 + (y1 - y0) * u + Math.sin(u * 9 + s) * 2.5;
                pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
            }
            const w = 7 + 9 * power;
            g.appendChild(el('path', { d: `M ${pts.join(' L ')}`, fill: 'none', stroke: '#d9783f', 'stroke-width': w + 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
            g.appendChild(el('path', { d: `M ${pts.join(' L ')}`, fill: 'none', class: 'foam-stream', 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
            for (let i = 1; i < 9; i += 1) {
                const u = i / 9;
                if (u > 0.98) continue;
                g.appendChild(el('circle', { cx: (x0 + (x1 - x0) * u + Math.sin(i * 3 + wob * 4) * 2).toFixed(1), cy: (y0 + (y1 - y0) * u - w * 0.25).toFixed(1), r: (1.5 + (i % 3)).toFixed(1), class: 'foam-bubble' }));
            }
        });
    }

    // The foam column pushed up out of the crater.
    if (columnH > 1) {
        const top = RIM_Y + 2 - columnH;
        const n = Math.max(3, Math.round(columnH / 9));
        for (let i = 0; i <= n; i += 1) {
            const u = i / n, y = RIM_Y + 2 - columnH * u;
            const r = (10 + 6 * power) * (0.8 + 0.45 * u) + Math.sin(wob * 6 + i * 1.7) * (state.running ? 1.6 : 0);
            const x = PEAK_X + Math.sin(i * 2.3 + wob * 3) * (3 + 5 * u) * (state.running ? 1 : 0.4);
            g.appendChild(el('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: r.toFixed(1), class: 'foam-blob' }));
        }
        const capR = (10 + 6 * power) * 1.1;
        [-1, 1].forEach(s => g.appendChild(el('circle', { cx: (PEAK_X + s * capR * 0.9).toFixed(1), cy: (top + capR * 0.35).toFixed(1), r: (capR * 0.8).toFixed(1), class: 'foam-blob' })));
        g.appendChild(el('circle', { cx: PEAK_X, cy: top.toFixed(1), r: capR.toFixed(1), class: 'foam-blob' }));
        g.appendChild(el('ellipse', { cx: PEAK_X - capR * 0.35, cy: (top - capR * 0.35).toFixed(1), rx: capR * 0.35, ry: capR * 0.18, fill: 'rgba(255,255,255,.75)' }));
        if (state.running) {
            for (let i = 0; i < 6; i += 1) {
                const q = (wob * 0.9 + i / 6) % 1;
                g.appendChild(el('circle', { cx: (PEAK_X + Math.sin(i * 2.1 + wob) * 14).toFixed(1), cy: (top - 4 - q * 26).toFixed(1), r: 2.6, class: 'gas-bubble', style: `opacity:${fmt(0.9 - q * 0.85, 2)}` }));
            }
        }
    }

    g.appendChild(el('text', { x: PEAK_X, y: BASE_Y + 26, 'text-anchor': 'middle', class: 'tiny-label' }, '찰흙으로 만든 화산 모형'));
    if (done) {
        g.appendChild(el('text', { x: 10, y: 22, class: 'big-read verdict-text' }, `${fmt(a.gas, 2)} L`));
        g.appendChild(el('text', { x: 10, y: 40, class: 'tiny-label verdict-text' }, '생긴 이산화 탄소'));
    }

    // The three things a real volcano throws out.
    g.appendChild(el('text', { x: 312, y: 40, class: 'small-label' }, '진짜 화산에서 나오는 것'));
    const kinds = [['기체', '화산 가스', 'gas-bubble'], ['액체', '용암', 'foam-stream-swatch'], ['고체', '화산재·암석 조각', 'ash-bit']];
    kinds.forEach(([stateName, name, cls], i) => {
        const y = 70 + i * 34;
        g.appendChild(el('circle', { cx: 322, cy: y - 5, r: 8, class: `${cls} swatch` }));
        g.appendChild(el('text', { x: 338, y, class: 'part-label' }, `${stateName} — ${name}`));
    });
}

function drawGraph(g) {
    const a = analyse();
    const x0 = 54, x1 = 440, yTop = 30, yBot = 146;
    const topG = 10, topL = gasLitres(100, 999) * 1.12;
    const X = s => x0 + (s / topG) * (x1 - x0);
    const Y = l => yBot - (l / topL) * (yBot - yTop);

    for (let i = 0; i <= 4; i += 1) {
        const l = topL * i / 4;
        g.appendChild(el('line', { x1: x0, y1: Y(l), x2: x1, y2: Y(l), class: 'grid-line' }));
        if (i > 0) g.appendChild(el('text', { x: x0 - 6, y: Y(l) + 3.5, 'text-anchor': 'end', class: 'axis-text' }, `${fmt(l, 1)} L`));
    }
    g.appendChild(el('line', { x1: x0, y1: yBot, x2: x1, y2: yBot, class: 'axis' }));
    g.appendChild(el('line', { x1: x0, y1: yTop, x2: x0, y2: yBot, class: 'axis' }));
    for (let s = 0; s <= topG; s += 2) {
        g.appendChild(el('line', { x1: X(s), y1: yBot, x2: X(s), y2: yBot + 4, class: 'axis' }));
        g.appendChild(el('text', { x: X(s), y: yBot + 15, 'text-anchor': 'middle', class: 'axis-text' }, `${s} g`));
    }

    g.appendChild(el('text', { x: (x0 + x1) / 2, y: 191, 'text-anchor': 'middle', class: 'axis-title' }, `식초 ${state.vin} mL에 소다를 넣을 때 생기는 거품`));
    if (!(state.checked && !state.running)) return;
    let d = '';
    for (let i = 0; i <= 160; i += 1) {
        const s = (i / 160) * topG;
        d += `${i ? 'L' : 'M'} ${fmt(X(s), 2)} ${fmt(Y(gasLitres(state.vin, s)), 2)} `;
    }
    g.appendChild(el('path', { d, class: 'yield-line' }));

    if (a.match <= topG) {
        g.appendChild(el('line', { x1: X(a.match), y1: Y(a.most), x2: X(a.match), y2: yBot, class: 'mark-line' }));
        g.appendChild(el('text', { x: X(a.match) + 5, y: yBot - 8, class: 'axis-text' }, `${fmt(a.match, 1)} g에서 딱 맞음`));
    }
    g.appendChild(el('circle', { cx: X(a.soda), cy: Y(a.gas), r: 6, class: 'trace-dot', style: 'fill:#ffb26b' }));

}

function render() {
    window.scienceScene.draw([$('mainGroup'), $('graphGroup')], ([m, gr]) => {
    drawModel(m); drawGraph(gr);
    });
    updateReadout();
}

const WORDS = { p1: '소다가 남는다', p2: '식초가 남는다', p3: '둘 다 딱 맞다' };

function updateReadout() {
    const a = analyse();
    $('stageBadge').textContent = `식초 ${a.vin} mL · 소다 ${fmt(a.soda, 1)} g`;
    $('valueA').textContent = `${fmt(a.gas, 2)} L`;
    $('valueB').textContent = WORDS[a.verdict];
    const rows = [
        ['딱 맞는 소다의 양', `${fmt(a.match, 1)} g`, a.verdict === 'p3'],
        ['남는 소다', a.leftSoda > 0.05 ? `${fmt(a.leftSoda, 1)} g` : '없음', a.leftSoda <= 0.05],
        ['남는 식초', a.leftVin > 0.5 ? `${fmt(a.leftVin, 0)} mL` : '없음', a.leftVin <= 0.5],
        ['이 식초로 낼 수 있는 최대', `${fmt(a.most, 2)} L`, false],
        ['지금 낸 거품', `최대의 ${Math.round(a.full * 100)}%`, a.full > 0.98],
        ['소다 1 g이 낼 수 있는 거품', `${fmt(SODA_PER_G * LITRE_PER_MOL, 2)} L`, false],
    ];
    if (!(state.checked && !state.running)) { $('dataNote').innerHTML = ''; return; }
    $('dataNote').innerHTML = rows.map(([n, v, m]) =>
        `<div class="data-row${m ? ' match' : ''}"><span class="data-name">${n}</span><span class="data-val">${v}</span></div>`).join('');
    if (state.checked) explain(a);
}

function explain(a) {
    $('resultEmpty').hidden = true;
    $('resultContent').hidden = false;
    const v = a.verdict;
    if (state.prediction) {
        const ok = state.prediction === v;
        $('predictionResult').textContent = ok ? `예상이 맞았습니다 — ${WORDS[v]}.`
            : `예상은 ${WORDS[state.prediction]}였지만 결과는 ${WORDS[v]}입니다.`;
        $('predictionResult').className = `prediction-result ${ok ? 'correct' : 'wrong'}`;
    } else {
        $('predictionResult').textContent = '';
        $('predictionResult').className = 'prediction-result';
    }

    let s = `식초 ${a.vin} mL와 소다 ${fmt(a.soda, 1)} g이 만나 이산화 탄소 ${fmt(a.gas, 2)} L가 생겼고, 이 기체가 거품을 밀어 올렸습니다. `;
    if (v === 'p2') s += `소다가 먼저 다 없어져서 식초가 ${fmt(a.leftVin, 0)} mL쯤 남았습니다. 소다를 더 넣으면 거품이 더 나옵니다. `;
    else if (v === 'p1') s += `식초가 먼저 다 없어져서 소다 ${fmt(a.leftSoda, 1)} g이 바닥에 남았습니다. 소다를 더 넣어도 거품은 더 나오지 않습니다. `;
    else s += `식초와 소다가 남김없이 다 없어졌고, 이 식초로 낼 수 있는 가장 많은 거품이 나왔습니다. `;
    s += `식초 ${a.vin} mL와 딱 맞는 소다는 ${fmt(a.match, 1)} g입니다.`;
    $('elementaryExplanation').textContent = s;
}

// --- animation --------------------------------------------------------------
function tick(dt) {
    state.phase += dt;
    if (!state.running) return false;
    state.t = Math.min(1, state.t + dt / 5);
    if (state.t >= 1) {
        state.running = false; state.phase = 0;
        $('runBtn').textContent = '소다 넣기';
        state.checked = true;
        return true;
    }
    return false;
}

let last = 0, frameId = 0;
const reduceMotion = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    const finished = tick(dt);
    render();
    frameId = state.running && !finished ? requestAnimationFrame(frame) : 0;
}
function startFrames() { if (frameId) cancelAnimationFrame(frameId); last = performance.now(); frameId = requestAnimationFrame(frame); }
function stopFrames() { if (frameId) cancelAnimationFrame(frameId); frameId = 0; }
// Changing the amounts starts a new, untried mixture: the old result is put away.
function freshMixture() {
    stopFrames(); state.running = false; state.checked = false; state.t = 0;
    $('runBtn').textContent = '소다 넣기';
    $('resultEmpty').hidden = false; $('resultContent').hidden = true;
}

// --- wiring -----------------------------------------------------------------
function markSelected(sel, attr, value) {
    document.querySelectorAll(sel).forEach(b => b.classList.toggle('selected', b.dataset[attr] === String(value)));
}

document.querySelectorAll('[data-vin]').forEach(b => b.addEventListener('click', () => {
    state.vin = Number(b.dataset.vin); markSelected('[data-vin]', 'vin', state.vin); freshMixture(); render();
}));
document.querySelectorAll('[data-prediction]').forEach(b => b.addEventListener('click', () => {
    state.prediction = b.dataset.prediction; state.checked = false; window.scienceInvalidatePrediction?.(); markSelected('[data-prediction]', 'prediction', state.prediction);
}));
$('sodaRange').addEventListener('input', e => {
    state.soda = Number(e.target.value);
    $('sodaOutput').textContent = `${fmt(state.soda, 1)} g`;
    freshMixture(); render();
});
$('runBtn').addEventListener('click', () => {
    if (state.running) { stopFrames(); state.running = false; state.t = 1; state.checked = true; $('runBtn').textContent = '소다 넣기'; render(); return; }
    state.t = 0; state.checked = false; state.running = true;
    $('resultEmpty').hidden = false; $('resultContent').hidden = true;
    if (reduceMotion()) { state.running = false; state.t = 1; state.checked = true; render(); return; }
    $('runBtn').textContent = '멈추기';
    render(); startFrames();
});
$('resetBtn').addEventListener('click', () => {
    state.vin = 50; state.soda = 3.5;
    stopFrames(); state.prediction = null; state.checked = false; state.running = false; state.t = 0;
    $('sodaRange').value = '3.5'; $('sodaOutput').textContent = '3.5 g';
    $('runBtn').textContent = '소다 넣기';
    document.querySelectorAll('[data-prediction]').forEach(x => x.classList.remove('selected'));
    $('resultEmpty').hidden = false; $('resultContent').hidden = true;
    markSelected('[data-vin]', 'vin', 50);
    render();
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

markSelected('[data-vin]', 'vin', state.vin);
render();

window.__volcanoModel = {
    state, analyse, tick, render, acidMol, sodaMol, matchGrams, gasLitres, verdictFor,
    VINEGARS, ACID_PER_ML, SODA_PER_G, LITRE_PER_MOL, NEAR,
    setVin(v) { document.querySelector(`[data-vin="${v}"]`).click(); },
    setSoda(v) { const r = $('sodaRange'); r.value = String(v); r.dispatchEvent(new Event('input')); },
    check() { state.checked = true; explain(analyse()); },
    runToEnd(dt = 1 / 30) {
        $('runBtn').click();
        let steps = 0;
        while (state.running && steps < 20000) { tick(dt); steps += 1; }
        render();
        return { steps, t: state.t };
    },
};
