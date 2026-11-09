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
    running: false, t: 0, phase: 0, done: false,
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
const PIVOT = { x: 124, y: 118 }, ARM = 70, POST = 20, PAN_W = 50;

function cube(g, cx, bottomY, size, colour, dim) {
    const s = size * PX;
    g.appendChild(el('rect', {
        x: cx - s / 2, y: bottomY - s, width: s, height: s, rx: 2,
        class: 'block', style: `fill:${colour}${dim ? ';opacity:.55' : ''}`,
    }));
    // a light top edge so the block reads as a solid lump
    g.appendChild(el('rect', { x: cx - s / 2 + 2, y: bottomY - s + 2, width: Math.max(1, s - 4), height: Math.max(1, s * 0.18), rx: 1, style: 'fill:#ffffff;opacity:.25' }));
}

const ease = u => u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
// phases of one run (t from 0 to 1, five seconds)
const P_PLACE = 0.16, P_TILT = 0.5, P_DROP = 0.72;

function drawScene(g) {
    const a = analyse();
    const t = state.running ? state.t : (state.done ? 1 : 0);
    const done = state.done && !state.running;
    // blocks come down onto the pans first
    const place = clamp(t / P_PLACE, 0, 1);
    // then the beam swings to its angle with a small dying wobble
    const share = (a.weight - a.ref) / (a.weight + a.ref);
    const target = 14 * share;
    const u = clamp((t - P_PLACE) / (P_TILT - P_PLACE), 0, 1);
    const wobble = u <= 0 ? 0 : ease(u) + Math.sin(u * Math.PI * 3) * (1 - u) * 0.25;
    const deg = target * wobble;
    const ang = deg * Math.PI / 180;

    // base, pillar and scale
    g.appendChild(el('path', { d: 'M 64 200 L 184 200 L 176 188 L 72 188 Z', class: 'stand' }));
    g.appendChild(el('rect', { x: PIVOT.x - 5, y: PIVOT.y, width: 10, height: 70, class: 'stand' }));
    g.appendChild(el('path', { d: `M ${PIVOT.x - 26} 172 A 30 30 0 0 0 ${PIVOT.x + 26} 172`, class: 'scale-arc' }));
    g.appendChild(el('line', { x1: PIVOT.x, y1: 168, x2: PIVOT.x, y2: 178, class: 'scale-mark' }));
    // pointer hangs from the pivot and swings with the beam
    const pl = 52;
    g.appendChild(el('line', { x1: PIVOT.x, y1: PIVOT.y, x2: PIVOT.x + pl * Math.sin(ang), y2: PIVOT.y + pl * Math.cos(ang), class: 'pointer' }));

    const lx = PIVOT.x - ARM * Math.cos(ang), ly = PIVOT.y + ARM * Math.sin(ang);
    const rx = PIVOT.x + ARM * Math.cos(ang), ry = PIVOT.y - ARM * Math.sin(ang);
    g.appendChild(el('line', { x1: lx, y1: ly, x2: rx, y2: ry, class: 'beam' }));
    g.appendChild(el('circle', { cx: PIVOT.x, cy: PIVOT.y, r: 5, class: 'pivot' }));

    [[lx, ly, state.mat, state.size], [rx, ry, REF.mat, REF.size]].forEach(([px, py, mat, size], k) => {
        // posts stay upright, so the pans on top stay level while the beam tilts
        g.appendChild(el('line', { x1: px, y1: py, x2: px, y2: py - POST, class: 'post' }));
        const panY = py - POST;
        g.appendChild(el('path', { d: `M ${px - PAN_W / 2} ${panY - 4} Q ${px} ${panY + 6} ${px + PAN_W / 2} ${panY - 4} Z`, class: 'pan-dish' }));
        if (place > 0) {
            const lift = (1 - ease(place)) * 60;
            cube(g, px, panY - 4 - lift, size, MATERIALS[mat].colour, false);
        }
        void k;
    });
    if (place >= 1) {
        g.appendChild(el('text', { x: 16, y: 22, class: 'small-label' }, `${a.mat.name} ${a.size} cm`));
        g.appendChild(el('text', { x: 16, y: 40, class: 'big-read' }, `${grams(a.weight)} g`));
        g.appendChild(el('text', { x: 236, y: 22, 'text-anchor': 'end', class: 'small-label' }, '나무 4 cm'));
        g.appendChild(el('text', { x: 236, y: 40, 'text-anchor': 'end', class: 'read-text' }, `${grams(a.ref)} g`));
    } else {
        g.appendChild(el('text', { x: 16, y: 22, class: 'small-label' }, `${a.mat.name} ${a.size} cm`));
        g.appendChild(el('text', { x: 236, y: 22, 'text-anchor': 'end', class: 'small-label' }, '나무 4 cm'));
    }
    if (done) g.appendChild(el('text', { x: PIVOT.x, y: 216, 'text-anchor': 'middle', class: 'small-label verdict-text' },
        Math.abs(a.diff) < 0.005 ? '수평' : (a.diff > 0 ? '왼쪽이 무거움' : '오른쪽이 무거움')));

    // the tank: a twin block is lowered in after weighing, then bobs to rest
    const TANK = { x: 272, y: 78, w: 164, h: 118 }, TOP = 104;
    g.appendChild(el('rect', { x: TANK.x + 2, y: TOP, width: TANK.w - 4, height: TANK.y + TANK.h - TOP - 2, class: 'water' }));
    g.appendChild(el('line', { x1: TANK.x + 2, y1: TOP, x2: TANK.x + TANK.w - 2, y2: TOP, class: 'water-top' }));

    const s = a.size * PX;
    const cx = TANK.x + TANK.w / 2;
    const restBottom = a.floats ? TOP + s * a.sunk : TANK.y + TANK.h - 3;
    const dv = clamp((t - P_TILT) / (P_DROP - P_TILT), 0, 1);
    if (dv > 0) {
        const startBottom = TANK.y - 30;
        const fall = dv * dv;
        let bottomY = startBottom + (restBottom - startBottom) * fall;
        // after it lands a floating block overshoots and bobs, a sinking one slows in the water
        const after = clamp((t - P_DROP) / (1 - P_DROP), 0, 1);
        if (dv >= 1 && a.floats) bottomY = restBottom + Math.sin(after * Math.PI * 4) * (1 - after) * Math.min(14, s * 0.4);
        if (!a.floats && dv < 1 && bottomY > TOP) bottomY = TOP + (bottomY - TOP) * 0.8;
        cube(g, cx, bottomY, a.size, a.mat.colour, false);
        const ring = clamp((t - P_DROP) / 0.2, 0, 1);
        if (ring > 0 && ring < 1) {
            for (let i = 0; i < 2; i += 1) {
                const w = s / 2 + 8 + ring * 30 + i * 10;
                g.appendChild(el('path', { d: `M ${cx - w} ${TOP - 2} q 6 -6 12 0 M ${cx + w - 12} ${TOP - 2} q 6 -6 12 0`, class: 'splash', style: `opacity:${(1 - ring).toFixed(2)}` }));
            }
        }
    }
    g.appendChild(el('path', { d: `M ${TANK.x - 4} ${TANK.y} L ${TANK.x} ${TANK.y + 4} L ${TANK.x} ${TANK.y + TANK.h} L ${TANK.x + TANK.w} ${TANK.y + TANK.h} L ${TANK.x + TANK.w} ${TANK.y + 4} L ${TANK.x + TANK.w + 4} ${TANK.y}`, class: 'tank' }));
    g.appendChild(el('text', { x: 444, y: 22, 'text-anchor': 'end', class: 'small-label' }, '물이 든 수조'));
    if (done) g.appendChild(el('text', { x: TANK.x + TANK.w / 2, y: 216, 'text-anchor': 'middle', class: 'small-label verdict-text', style: a.floats ? '' : 'fill:#c2410c' },
        a.floats ? '뜸' : '가라앉음'));
}

function niceStep(max) { for (const s of [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000]) if (max / s <= 5) return s; return 1000; }

function drawGraph(g) {
    const a = analyse();
    const x0 = 54, x1 = 440, yTop = 30, yBot = 146;
    const raw = Math.max(weightOf(state.mat, 4), weightOf('wood', 4)) * 1.12;
    const step = niceStep(raw), top = Math.ceil(raw / step) * step;
    const Y = w => yBot - (w / top) * (yBot - yTop);
    const slot = (x1 - x0) / 4;

    for (let w = 0; w <= top + 1e-9; w += step) {
        g.appendChild(el('line', { x1: x0, y1: Y(w), x2: x1, y2: Y(w), class: 'grid-line' }));
        if (w > 0) g.appendChild(el('text', { x: x0 - 6, y: Y(w) + 4, 'text-anchor': 'end', class: 'axis-text' }, String(w)));
    }
    g.appendChild(el('line', { x1: x0, y1: yBot, x2: x1, y2: yBot, class: 'axis' }));
    g.appendChild(el('line', { x1: x0, y1: yTop, x2: x0, y2: yBot, class: 'axis' }));
    g.appendChild(el('text', { x: x0 + 4, y: yTop - 10, class: 'axis-title' }, '무게 (g)'));

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
            style: `fill:${sz === state.size ? '#047857' : '#475569'}`,
        }, grams(w)));
        g.appendChild(el('text', { x: cx, y: yBot + 16, 'text-anchor': 'middle', class: 'axis-text' }, `${sz} cm`));
    });

    g.appendChild(el('rect', { x: x0 + 4, y: 170, width: 12, height: 9, rx: 2, class: 'bar', style: `fill:${a.mat.colour}` }));
    g.appendChild(el('text', { x: x0 + 22, y: 178.5, class: 'legend-text', style: 'fill:#1e293b' }, a.mat.name));
    if (!sameAsWood) {
        g.appendChild(el('rect', { x: x0 + 92, y: 170, width: 12, height: 9, rx: 2, class: 'bar-ghost' }));
        g.appendChild(el('text', { x: x0 + 110, y: 178.5, class: 'legend-text', style: 'fill:#475569' }, '같은 크기의 나무'));
    }
    g.appendChild(el('text', { x: x1, y: 178.5, 'text-anchor': 'end', class: 'legend-text', style: 'fill:#475569' }, '가로: 한 변의 길이'));
}

function render() {
    window.scienceScene.draw([$('mainGroup'), $('graphGroup')], ([m, gr]) => {
    drawScene(m); drawGraph(gr);
    });
    updateReadout();
}

const WORDS = { p1: '뜬다', p2: '아슬아슬하게 뜬다', p3: '가라앉는다' };

function updateReadout() {
    const a = analyse();
    const done = state.done && !state.running;
    $('stageBadge').textContent = `${a.mat.name} ${a.size} cm 덩어리`;
    $('valueA').textContent = `${grams(a.weight)} g`;
    $('valueB').textContent = `${grams(a.ref)} g`;
    const rows = [
        ['재료', a.mat.name, false],
        ['덩어리의 무게', done ? grams(a.weight) + ' g' : '저울에 올리면 잽니다', false],
        ['비교할 나무의 무게', grams(a.ref) + ' g', false],
    ];
    if (done) rows.push(
        ['무게 비교', Math.abs(a.diff) < 0.005 ? '같음' : a.diff > 0 ? '나무보다 무거움' : '나무보다 가벼움', true],
        ['물에 넣은 결과', a.floats ? '뜸' : '가라앉음', false]);
    $('dataNote').innerHTML = rows.map(([n, v, m]) =>
        `<div class="data-row${m ? ' match' : ''}"><span class="data-name">${n}</span><span class="data-val">${v}</span></div>`).join('');
    if (state.checked && done) explain(a);
}

function explain(a) {
    $('resultEmpty').hidden = true;
    $('resultContent').hidden = false;
    const v = a.verdict;
    $('predictionResult').hidden = !state.prediction;
    if (state.prediction) {
        const ok = state.prediction === v;
        $('predictionResult').textContent = ok ? `예상이 맞았습니다 — ${WORDS[v]}.`
            : `예상은 ${WORDS[state.prediction]}였지만 결과는 ${WORDS[v]}입니다.`;
        $('predictionResult').className = `prediction-result ${ok ? 'correct' : 'wrong'}`;
    } else {
        $('predictionResult').textContent = '';
        $('predictionResult').className = 'prediction-result';
    }

    const result = a.floats ? '뜹니다' : '가라앉습니다';
    const comparison = !a.floats && a.diff < 0
        ? '비교할 나무보다 가볍지만 가라앉습니다. '
        : a.floats && a.diff > 0 ? '비교할 나무보다 무겁지만 이 덩어리도 뜹니다. ' : '';
    const s = `${a.mat.name} 덩어리는 ${grams(a.weight)} g이고 물에 ${result}. ${comparison}같은 재료의 속이 찬 덩어리는 크기를 바꾸면 무게가 달라져도 같은 물에서 뜨고 가라앉는 결과는 같습니다.`;
    $('elementaryExplanation').textContent = s;
}

// --- animation --------------------------------------------------------------
function tick(dt) {
    state.phase += dt;
    if (!state.running) return false;
    state.t = Math.min(1, state.t + dt / 5);
    if (state.t >= 1) {
        state.running = false;
        state.done = true;
        $('runBtn').textContent = '저울에 올리고 물에 넣기';
        state.checked = true;
        return true;
    }
    return false;
}

let last = 0, looping = false;
function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    tick(dt);
    render();
    if (state.running) requestAnimationFrame(frame); else looping = false;
}
function startLoop() { if (looping) return; looping = true; last = performance.now(); requestAnimationFrame(frame); }
const reducedMotion = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
function clearRun() { state.running = false; state.done = false; state.t = 0; state.checked = false; $('runBtn').textContent = '저울에 올리고 물에 넣기'; $('resultEmpty').hidden = false; $('resultContent').hidden = true; }

// --- wiring -----------------------------------------------------------------
function markSelected(sel, attr, value) {
    document.querySelectorAll(sel).forEach(b => b.classList.toggle('selected', b.dataset[attr] === String(value)));
}

document.querySelectorAll('[data-mat]').forEach(b => b.addEventListener('click', () => {
    state.mat = b.dataset.mat; clearRun(); markSelected('[data-mat]', 'mat', state.mat); render();
}));
document.querySelectorAll('[data-size]').forEach(b => b.addEventListener('click', () => {
    state.size = Number(b.dataset.size); clearRun(); markSelected('[data-size]', 'size', state.size); render();
}));
document.querySelectorAll('[data-prediction]').forEach(b => b.addEventListener('click', () => {
    state.prediction = b.dataset.prediction; state.checked = false; window.scienceInvalidatePrediction?.(); markSelected('[data-prediction]', 'prediction', state.prediction);
}));
$('runBtn').addEventListener('click', () => {
    if (state.running) { clearRun(); render(); return; }
    state.t = 0; state.done = false; state.checked = true;
    $('resultEmpty').hidden = false; $('resultContent').hidden = true;
    if (reducedMotion()) { state.t = 1; state.done = true; render(); return; }
    state.running = true;
    $('runBtn').textContent = '멈추기';
    render();
    startLoop();
});
$('resetBtn').addEventListener('click', () => {
    state.mat = 'wood'; state.size = 2;
    state.prediction = null; state.checked = false; state.running = false; state.t = 0; state.done = false;
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
