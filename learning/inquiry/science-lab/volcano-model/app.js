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

const BASE_Y = 186, PEAK_X = 132, PEAK_Y = 62;

function drawModel(g) {
    const a = analyse();
    const go = state.running ? Math.min(1, state.t / 0.55) : 1;
    // How high the foam climbs, from how much gas this mixture can make.
    const rise = a.full * go;

    g.appendChild(el('rect', { x: 16, y: BASE_Y, width: 232, height: 12, rx: 3, class: 'tray' }));

    const clip = el('g', { 'clip-path': 'url(#coneClip)' });
    // Bottle inside the cone, with the vinegar it was given.
    const vinH = (a.vin / 100) * 30;
    clip.appendChild(el('rect', { x: PEAK_X - 15, y: 96, width: 30, height: 90, rx: 4, class: 'bottle' }));
    clip.appendChild(el('rect', { x: PEAK_X - 14, y: 185 - vinH, width: 28, height: vinH, rx: 3, class: 'vinegar' }));

    // Soda still sitting at the bottom because there was no vinegar left.
    if (a.leftSoda > 0.05 && go > 0.9) {
        const n = Math.min(9, Math.ceil(a.leftSoda));
        for (let i = 0; i < n; i += 1) {
            clip.appendChild(el('circle', { cx: PEAK_X - 10 + (i % 5) * 5, cy: 182 - Math.floor(i / 5) * 4, r: 1.8, class: 'soda-grain' }));
        }
    }

    // Foam climbing the neck, then spilling over both sides.
    const neckTop = PEAK_Y + 6;
    const foamTop = 96 - rise * (96 - neckTop);
    if (rise > 0.02) {
        clip.appendChild(el('rect', { x: PEAK_X - 13, y: foamTop, width: 26, height: 186 - foamTop, rx: 4, class: 'foam' }));
    }
    if (rise > 0.6) {
        const spill = (rise - 0.6) / 0.4;
        [-1, 1].forEach(s => {
            clip.appendChild(el('path', {
                d: `M ${PEAK_X + s * 12} ${neckTop + 4} q ${s * 24} ${20 + spill * 30} ${s * (26 + spill * 62)} ${BASE_Y - neckTop - 4}`,
                class: 'foam-flow', style: `fill:none;stroke:rgba(255,190,120,.85);stroke-width:${fmt(4 + spill * 6, 1)};stroke-linecap:round`,
            }));
        });
    }
    for (let i = 0; i < Math.round(rise * 7); i += 1) {
        const p = ((state.phase * 0.7) + i / 7) % 1;
        clip.appendChild(el('circle', {
            cx: PEAK_X + Math.sin(state.phase * 2 + i * 2) * 9, cy: neckTop - p * 40,
            r: 3.4, class: 'gas-bubble', style: `opacity:${fmt(0.85 - p * 0.8, 2)}`,
        }));
    }

    clip.appendChild(el('path', { d: `M 24 ${BASE_Y} L ${PEAK_X - 16} ${PEAK_Y} L ${PEAK_X + 16} ${PEAK_Y} L 240 ${BASE_Y} Z`, class: 'cone' }));
    g.appendChild(clip);
    g.appendChild(el('text', { x: PEAK_X, y: 204, 'text-anchor': 'middle', class: 'tiny-label' }, '찰흙으로 만든 화산 모형'));

    g.appendChild(el('text', { x: 16, y: 24, class: 'big-read' }, `${fmt(a.gas, 2)} L`));
    g.appendChild(el('text', { x: 16, y: 40, class: 'tiny-label' }, '생긴 이산화 탄소'));

    // The three things a real volcano throws out.
    g.appendChild(el('text', { x: 268, y: 24, class: 'small-label' }, '진짜 화산에서 나오는 것'));
    const kinds = [
        ['기체', '화산 가스', 'gas-bubble', '모형의 거품이 이것입니다'],
        ['액체', '용암', 'foam-flow', '매우 뜨겁고 위험합니다'],
        ['고체', '화산재와 암석 조각', 'ash-bit', '잘게 부서져 하늘로 날립니다'],
    ];
    kinds.forEach(([stateName, name, cls, note], i) => {
        const y = 54 + i * 46;
        g.appendChild(el('circle', { cx: 280, cy: y, r: 9, class: `${cls} swatch` }));
        g.appendChild(el('text', { x: 298, y: y - 4, class: 'part-label' }, `${stateName} — ${name}`));
        g.appendChild(el('text', { x: 298, y: y + 9, class: 'tiny-label' }, note));
    });
    g.appendChild(el('text', { x: 268, y: 200, class: 'note-text' }, '모형의 거품은 용암처럼 뜨겁지 않습니다'));
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

    g.appendChild(el('text', { x: x0 + 4, y: 172, class: 'legend-text', style: 'fill:#ffb26b' }, '올라가는 동안은 소다가 모자랍니다'));
    g.appendChild(el('text', { x: x1 - 2, y: 172, 'text-anchor': 'end', class: 'legend-text', style: 'fill:#475569' }, '평평해지면 식초가 다 떨어진 것입니다'));
    g.appendChild(el('text', { x: (x0 + x1) / 2, y: 191, 'text-anchor': 'middle', class: 'axis-title' }, `식초 ${state.vin} mL에 소다를 넣을 때 생기는 거품`));
}

function render() {
    const m = $('mainGroup'), gr = $('graphGroup');
    m.textContent = ''; gr.textContent = '';
    drawModel(m); drawGraph(gr);
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

    let s = `식초 ${a.vin} mL에 베이킹 소다 ${fmt(a.soda, 1)} g을 넣었습니다. 둘이 만나 이산화 탄소 ${fmt(a.gas, 2)} L가 생겼고, 그 기체가 거품을 밀어 올려 넘치게 했습니다. `;

    if (v === 'p2') {
        s += `소다가 먼저 다 없어졌습니다. 식초는 ${fmt(a.leftVin, 0)} mL쯤 그대로 남아 있습니다. 소다를 더 넣으면 거품이 더 나옵니다. `;
    } else if (v === 'p1') {
        s += `이번에는 식초가 먼저 다 없어졌습니다. 소다는 ${fmt(a.leftSoda, 1)} g이 만날 상대를 못 찾고 바닥에 그대로 남았습니다. `;
        s += `여기서 소다를 더 넣어도 거품은 한 방울도 더 나오지 않습니다. 그래프가 평평해진 것이 그 뜻입니다. `;
    } else {
        s += `식초와 소다가 딱 맞게 만났습니다. 둘 다 남김없이 다 없어졌고, 이 식초로 낼 수 있는 가장 많은 거품인 ${fmt(a.most, 2)} L가 나왔습니다. `;
    }
    s += `식초 ${a.vin} mL에 딱 맞는 소다는 ${fmt(a.match, 1)} g입니다. `;

    s += `진짜 화산에서는 세 가지가 한꺼번에 나옵니다. 기체인 화산 가스, 액체인 용암, 그리고 고체인 화산재와 암석 조각입니다. `;
    s += `모형의 거품은 그중 화산 가스와 용암을 흉내 낸 것입니다. 다만 이 거품은 용암처럼 뜨겁지 않고 진짜 용암은 매우 뜨겁습니다. 모형은 터지는 모습만 보여 줄 뿐입니다.`;
    $('elementaryExplanation').textContent = s;
}

// --- animation --------------------------------------------------------------
function tick(dt) {
    state.phase += dt;
    if (!state.running) return false;
    state.t = Math.min(1, state.t + dt / 5);
    if (state.t >= 1) {
        state.running = false;
        $('runBtn').textContent = '소다 넣기';
        state.checked = true;
        return true;
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

document.querySelectorAll('[data-vin]').forEach(b => b.addEventListener('click', () => {
    state.vin = Number(b.dataset.vin); markSelected('[data-vin]', 'vin', state.vin); render();
}));
document.querySelectorAll('[data-prediction]').forEach(b => b.addEventListener('click', () => {
    state.prediction = b.dataset.prediction; markSelected('[data-prediction]', 'prediction', state.prediction);
}));
$('sodaRange').addEventListener('input', e => {
    state.soda = Number(e.target.value);
    $('sodaOutput').textContent = `${fmt(state.soda, 1)} g`;
    render();
});
$('runBtn').addEventListener('click', () => {
    if (state.running) { state.running = false; state.t = 1; $('runBtn').textContent = '소다 넣기'; return; }
    state.t = 0; state.running = true; state.checked = true;
    $('runBtn').textContent = '멈추기';
    render();
});
$('resetBtn').addEventListener('click', () => {
    state.vin = 50; state.soda = 3.5;
    state.prediction = null; state.checked = false; state.running = false; state.t = 0;
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
requestAnimationFrame(frame);

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
