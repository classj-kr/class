'use strict';

/* Two things a child can check by hand. A cube's weight is what one cubic
   centimetre of the stuff weighs, times how many of them fit inside — so
   doubling the edge makes it eight times heavier. And whether it floats does
   not depend on size at all: a floating block sinks until it has pushed aside
   its own weight of water, which happens at exactly the fraction of itself
   that the material is as heavy as water. */

const WATER = 1.0;   // g per cubic centimetre

const MATERIALS = {
    cork: { name: '코르크', per: 0.24, colour: '#c9a06a', hint: '병마개' },
    wood: { name: '나무', per: 0.5, colour: '#9a7247', hint: '나무토막' },
    plastic: { name: '플라스틱', per: 0.95, colour: '#6fb6c9', hint: '장난감 블록' },
    alu: { name: '알루미늄', per: 2.7, colour: '#b8c2c9', hint: '음료수 캔' },
    iron: { name: '철', per: 7.9, colour: '#7d8a95', hint: '못' },
};
const SIZES = [1, 2, 3, 4];
const REF = { mat: 'wood', size: 4 };

const state = {
    mat: 'wood', size: 2,
    prediction: null, checked: false,
    running: false, t: 0, phase: 0,
};

const $ = id => document.getElementById(id);
const svgNS = 'http://www.w3.org/2000/svg';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = (v, d) => v.toFixed(d).replace('-', '−');
function grams(w) { return w < 10 ? fmt(w, 2) : (w < 100 ? fmt(w, 1) : fmt(w, 0)); }
// 철은, 코르크는 — the particle follows the last letter's final consonant.
function eun(w) {
    const ch = w.charCodeAt(w.length - 1);
    const jong = ch >= 0xac00 && ch <= 0xd7a3 && (ch - 0xac00) % 28 !== 0;
    return w + (jong ? '은' : '는');
}

function weightOf(mat, size) { return MATERIALS[mat].per * size * size * size; }
function refWeight() { return weightOf(REF.mat, REF.size); }

// A floating block settles when the water it pushes aside weighs what it does,
// so the sunken fraction is just how heavy it is compared with water.
function sunkFraction(mat) { return clamp(MATERIALS[mat].per / WATER, 0, 1); }
function floats(mat) { return MATERIALS[mat].per < WATER; }

function verdict() {
    const p = MATERIALS[state.mat].per;
    return p < 0.9 ? 'p1' : (p <= 1.1 ? 'p2' : 'p3');
}

function analyse() {
    const m = MATERIALS[state.mat];
    const w = weightOf(state.mat, state.size);
    const r = refWeight();
    return {
        mat: m, size: state.size, volume: state.size ** 3, weight: w,
        ref: r, diff: w - r, sunk: sunkFraction(state.mat), floats: floats(state.mat),
        timesWood: w / weightOf('wood', state.size), verdict: verdict(),
    };
}

function el(tag, attrs, text) {
    const n = document.createElementNS(svgNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text !== undefined) n.textContent = text;
    return n;
}

const PX = 9;               // screen pixels per centimetre of edge
const PIVOT = { x: 120, y: 76 }, ARM = 62, DROP = 30, PAN_W = 46;

function cube(g, cx, bottomY, size, colour, dim) {
    const s = size * PX;
    g.appendChild(el('rect', {
        x: cx - s / 2, y: bottomY - s, width: s, height: s, rx: 2,
        class: 'block', style: `fill:${colour}${dim ? ';opacity:.55' : ''}`,
    }));
}

function drawScene(g) {
    const a = analyse();
    // The balance swings during the first half of a run, then holds.
    const settle = state.running ? clamp(state.t / 0.45, 0, 1) : 1;
    const share = (a.weight - a.ref) / (a.weight + a.ref);
    const ang = 15 * share * settle * Math.PI / 180;

    g.appendChild(el('rect', { x: 104, y: 186, width: 32, height: 8, rx: 2, class: 'stand' }));
    g.appendChild(el('rect', { x: 116, y: PIVOT.y, width: 8, height: 110, class: 'stand' }));
    const lx = PIVOT.x - ARM * Math.cos(ang), ly = PIVOT.y + ARM * Math.sin(ang);
    const rx = PIVOT.x + ARM * Math.cos(ang), ry = PIVOT.y - ARM * Math.sin(ang);
    g.appendChild(el('line', { x1: lx, y1: ly, x2: rx, y2: ry, class: 'beam' }));

    [[lx, ly, state.mat, state.size], [rx, ry, REF.mat, REF.size]].forEach(([px, py, mat, size]) => {
        g.appendChild(el('line', { x1: px, y1: py, x2: px, y2: py + DROP, class: 'hanger' }));
        g.appendChild(el('line', { x1: px - PAN_W / 2, y1: py + DROP, x2: px + PAN_W / 2, y2: py + DROP, class: 'pan-floor' }));
        cube(g, px, py + DROP - 1, size, MATERIALS[mat].colour, false);
    });
    g.appendChild(el('text', { x: PIVOT.x, y: 208, 'text-anchor': 'middle', class: 'small-label' },
        Math.abs(a.diff) < 0.005 ? '저울이 수평입니다' : (a.diff > 0 ? '왼쪽이 무겁습니다' : '오른쪽이 무겁습니다')));
    g.appendChild(el('text', { x: 16, y: 22, class: 'small-label' }, `${a.mat.name} ${a.size} cm`));
    g.appendChild(el('text', { x: 16, y: 40, class: 'big-read' }, `${grams(a.weight)} g`));
    g.appendChild(el('text', { x: 224, y: 22, 'text-anchor': 'end', class: 'small-label' }, '나무 4 cm'));
    g.appendChild(el('text', { x: 224, y: 38, 'text-anchor': 'end', class: 'read-text' }, `${grams(a.ref)} g`));

    // The tank. During a run the block drops in and then settles.
    const TANK = { x: 268, y: 72, w: 168, h: 120 }, TOP = 100;
    g.appendChild(el('rect', { x: TANK.x, y: TOP, width: TANK.w, height: TANK.y + TANK.h - TOP, class: 'water' }));
    g.appendChild(el('line', { x1: TANK.x, y1: TOP, x2: TANK.x + TANK.w, y2: TOP, class: 'water-top' }));
    g.appendChild(el('path', { d: `M ${TANK.x} ${TANK.y} L ${TANK.x} ${TANK.y + TANK.h} L ${TANK.x + TANK.w} ${TANK.y + TANK.h} L ${TANK.x + TANK.w} ${TANK.y}`, class: 'tank' }));

    const s = a.size * PX;
    const cx = TANK.x + TANK.w / 2;
    const restBottom = a.floats ? TOP + s * a.sunk : TANK.y + TANK.h - 2;
    const drop = state.running ? clamp((state.t - 0.5) / 0.45, 0, 1) : 1;
    const startBottom = TANK.y - 6;
    const bottomY = startBottom + (restBottom - startBottom) * drop;
    cube(g, cx, bottomY, a.size, a.mat.colour, false);
    if (drop > 0.75 && a.floats) {
        for (let i = 0; i < 3; i += 1) {
            const w = 8 + i * 7 + Math.sin(state.phase * 3 + i) * 2;
            g.appendChild(el('path', { d: `M ${cx - s / 2 - w} ${TOP - 4 - i * 3} q ${w / 2} -4 ${w} 0`, class: 'splash' }));
            g.appendChild(el('path', { d: `M ${cx + s / 2} ${TOP - 4 - i * 3} q ${w / 2} -4 ${w} 0`, class: 'splash' }));
        }
    }
    g.appendChild(el('text', { x: TANK.x + TANK.w / 2, y: 208, 'text-anchor': 'middle', class: 'small-label' },
        a.floats ? '물 위에 뜹니다' : '바닥까지 가라앉습니다'));
    g.appendChild(el('text', { x: 444, y: 22, 'text-anchor': 'end', class: 'small-label' }, '물에 넣어 보면'));
    g.appendChild(el('text', { x: 444, y: 40, 'text-anchor': 'end', class: 'read-text', style: a.floats ? '' : 'fill:#ea580c' },
        a.floats ? '뜬다' : '가라앉는다'));
}

function drawGraph(g) {
    const a = analyse();
    const x0 = 54, x1 = 440, yTop = 30, yBot = 146;
    const top = Math.max(weightOf(state.mat, 4), weightOf('wood', 4)) * 1.18;
    const Y = w => yBot - (w / top) * (yBot - yTop);
    const slot = (x1 - x0) / 4;

    for (let i = 0; i <= 4; i += 1) {
        const w = top * i / 4;
        g.appendChild(el('line', { x1: x0, y1: Y(w), x2: x1, y2: Y(w), class: 'grid-line' }));
        if (i > 0) g.appendChild(el('text', { x: x0 - 6, y: Y(w) + 3.5, 'text-anchor': 'end', class: 'axis-text' }, grams(w)));
    }
    g.appendChild(el('line', { x1: x0, y1: yBot, x2: x1, y2: yBot, class: 'axis' }));
    g.appendChild(el('line', { x1: x0, y1: yTop, x2: x0, y2: yBot, class: 'axis' }));

    const sameAsWood = state.mat === 'wood';
    SIZES.forEach((sz, i) => {
        const cx = x0 + slot * (i + 0.5);
        const w = weightOf(state.mat, sz), ww = weightOf('wood', sz);
        const bw = Math.min(38, slot * 0.34);
        const gap = sameAsWood ? 0 : bw * 0.62;
        g.appendChild(el('rect', {
            x: cx - gap - bw / 2, y: Y(w), width: bw, height: yBot - Y(w), rx: 2,
            class: 'bar', style: `fill:${a.mat.colour};opacity:${sz === state.size ? 1 : 0.5}`,
        }));
        if (!sameAsWood) {
            g.appendChild(el('rect', { x: cx + gap - bw / 2, y: Y(ww), width: bw, height: yBot - Y(ww), rx: 2, class: 'bar-ghost' }));
        }
        g.appendChild(el('text', {
            x: cx - gap, y: Y(w) - 5, 'text-anchor': 'middle', class: 'bar-text',
            style: `fill:${sz === state.size ? '#059669' : '#475569'}`,
        }, grams(w)));
        g.appendChild(el('text', { x: cx, y: yBot + 15, 'text-anchor': 'middle', class: 'axis-text' }, `${sz} cm`));
    });

    g.appendChild(el('rect', { x: x0 + 4, y: 168, width: 12, height: 8, rx: 2, class: 'bar', style: `fill:${a.mat.colour}` }));
    g.appendChild(el('text', { x: x0 + 22, y: 175.5, class: 'legend-text', style: `fill:${a.mat.colour}` }, a.mat.name));
    if (!sameAsWood) {
        g.appendChild(el('rect', { x: x0 + 92, y: 168, width: 12, height: 8, rx: 2, class: 'bar-ghost' }));
        g.appendChild(el('text', { x: x0 + 110, y: 175.5, class: 'legend-text', style: 'fill:#bed2e1' }, '같은 크기의 나무'));
    }
    g.appendChild(el('text', { x: x1 - 2, y: 175.5, 'text-anchor': 'end', class: 'legend-text', style: 'fill:#475569' },
        '같은 재료의 크기와 무게 비교'));
    g.appendChild(el('text', { x: (x0 + x1) / 2, y: 191, 'text-anchor': 'middle', class: 'axis-title' }, '덩어리 한 변의 길이 — 세로는 무게 (g)'));
}

function render() {
    const m = $('mainGroup'), gr = $('graphGroup');
    m.textContent = ''; gr.textContent = '';
    drawScene(m); drawGraph(gr);
    updateReadout();
}

const WORDS = { p1: '뜬다', p2: '아슬아슬하게 뜬다', p3: '가라앉는다' };

function updateReadout() {
    const a = analyse();
    $('stageBadge').textContent = `${a.mat.name} ${a.size} cm 덩어리`;
    $('valueA').textContent = `${grams(a.weight)} g`;
    $('valueB').textContent = `${grams(a.ref)} g`;
    const rows = [
        ['재료', a.mat.name, false],
        ['덩어리의 무게', grams(a.weight) + ' g', false],
        ['비교할 나무의 무게', grams(a.ref) + ' g', false],
        ['무게 비교', Math.abs(a.diff) < 0.005 ? '같음' : a.diff > 0 ? '나무보다 무거움' : '나무보다 가벼움', true],
        ['물에 넣은 결과', a.floats ? '뜸' : '가라앉음', false],
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

    const s = '같은 크기라도 재료에 따라 무게가 다릅니다. 같은 재료는 크기가 커질수록 무거워집니다. 저울의 표시를 비교하고 g 단위로 읽어 보세요.';
    $('elementaryExplanation').textContent = s;
}

// --- animation --------------------------------------------------------------
function tick(dt) {
    state.phase += dt;
    if (!state.running) return false;
    state.t = Math.min(1, state.t + dt / 5);
    if (state.t >= 1) {
        state.running = false;
        $('runBtn').textContent = '저울에 올리고 물에 넣기';
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

document.querySelectorAll('[data-mat]').forEach(b => b.addEventListener('click', () => {
    state.mat = b.dataset.mat; markSelected('[data-mat]', 'mat', state.mat); render();
}));
document.querySelectorAll('[data-size]').forEach(b => b.addEventListener('click', () => {
    state.size = Number(b.dataset.size); markSelected('[data-size]', 'size', state.size); render();
}));
document.querySelectorAll('[data-prediction]').forEach(b => b.addEventListener('click', () => {
    state.prediction = b.dataset.prediction; markSelected('[data-prediction]', 'prediction', state.prediction);
}));
$('runBtn').addEventListener('click', () => {
    if (state.running) { state.running = false; $('runBtn').textContent = '저울에 올리고 물에 넣기'; return; }
    state.t = 0; state.running = true; state.checked = true;
    $('runBtn').textContent = '멈추기';
    render();
});
$('resetBtn').addEventListener('click', () => {
    state.mat = 'wood'; state.size = 2;
    state.prediction = null; state.checked = false; state.running = false; state.t = 0;
    $('runBtn').textContent = '저울에 올리고 물에 넣기';
    document.querySelectorAll('[data-prediction]').forEach(x => x.classList.remove('selected'));
    $('resultEmpty').hidden = false; $('resultContent').hidden = true;
    markSelected('[data-mat]', 'mat', 'wood'); markSelected('[data-size]', 'size', 2);
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

markSelected('[data-mat]', 'mat', state.mat);
markSelected('[data-size]', 'size', state.size);
render();
requestAnimationFrame(frame);

window.__weightModel = {
    state, analyse, tick, render, weightOf, refWeight, sunkFraction, floats,
    MATERIALS, SIZES, REF, WATER,
    setMat(v) { document.querySelector(`[data-mat="${v}"]`).click(); },
    setSize(v) { document.querySelector(`[data-size="${v}"]`).click(); },
    check() { state.checked = true; explain(analyse()); },
    runToEnd(dt = 1 / 30) {
        $('runBtn').click();
        let steps = 0;
        while (state.running && steps < 20000) { tick(dt); steps += 1; }
        render();
        return { steps, t: state.t };
    },
};
