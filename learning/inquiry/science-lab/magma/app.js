'use strict';

/* Viscosity is the hinge. It comes from an empirical fit that reproduces the
   textbook magnitudes (basalt 10^2, andesite 10^5, rhyolite 10^8 Pa·s), and
   the two things read off it are exact: Jeffreys' equation for a sheet of lava
   running down a slope, and Stokes' law for a bubble trying to rise through
   it. The eruption style then follows from how much gas cannot get out. */

const RHO = 2600;      // kg/m3, magma density
const G = 9.8;
const H_FLOW = 1.0;    // m, thickness of the lava sheet
const SLOPE = 3;       // degrees
const R_BUBBLE = 0.01; // m, a coalesced bubble

// Each magma only exists as a liquid over its own range; below tMin it has
// frozen solid, so the dial is limited to temperatures that are really magma.
const KINDS = {
    basalt: { name: '현무암질', si: 50, colour: '#0284c7', rock: '현무암', where: '하와이·아이슬란드', tMin: 1000, tMax: 1250 },
    andesite: { name: '안산암질', si: 60, colour: '#d97706', rock: '안산암', where: '일본·안데스', tMin: 900, tMax: 1150 },
    rhyolite: { name: '유문암질', si: 70, colour: '#ff8a8a', rock: '유문암', where: '옐로스톤·백두산', tMin: 700, tMax: 950 },
};

// Typical measured slopes, and how wide each edifice gets. The drawing is
// built from these numbers so its shape cannot disagree with its label.
const SHAPES = {
    shield: { name: '순상 화산', slope: 6, halfWidth: 190 },
    strato: { name: '성층 화산', slope: 28, halfWidth: 150 },
    dome: { name: '종상 화산', slope: 38, halfWidth: 80 },
};

const state = {
    kind: 'basalt', water: 0.5, temp: 1200,
    prediction: null, checked: false,
    running: false, phase: 0, blast: 0,
};

const $ = id => document.getElementById(id);
const svgNS = 'http://www.w3.org/2000/svg';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = (v, d) => v.toFixed(d).replace('-', '−');

function logEta(si, t, w) { return 0.12 * si - 0.0105 * t + 8.6 - 0.6 * w; }
function eta(si, t, w) { return Math.pow(10, logEta(si, t, w)); }
// Jeffreys: mean speed of a laminar sheet of depth h on a slope.
function flowSpeed(e) { return RHO * G * H_FLOW * H_FLOW * Math.sin(SLOPE * Math.PI / 180) / (3 * e); }
// Stokes: terminal rise speed of a bubble, which is how gas leaves the melt.
function bubbleSpeed(e) { return 2 * RHO * G * R_BUBBLE * R_BUBBLE / (9 * e); }

// The share of gas the melt hangs on to. Thin magma lets bubbles go; thick
// magma keeps them, and it is the kept gas that does the damage.
function retention(le) { return clamp((le - 1) / 6, 0, 1); }
function explosivity(si, t, w) { return w * retention(logEta(si, t, w)); }

function shapeOf(le) { return le < 3 ? 'shield' : (le < 7 ? 'strato' : 'dome'); }

function verdict() {
    const x = explosivity(KINDS[state.kind].si, state.temp, state.water);
    return x < 0.3 ? 'p1' : (x < 1.5 ? 'p2' : 'p3');
}

function analyse() {
    const k = KINDS[state.kind];
    const le = logEta(k.si, state.temp, state.water);
    const e = Math.pow(10, le);
    const v = flowSpeed(e), vb = bubbleSpeed(e);
    return {
        kind: k, logEta: le, eta: e, flow: v, bubble: vb,
        riseTime: 1 / vb, retention: retention(le),
        explosivity: explosivity(k.si, state.temp, state.water),
        shape: SHAPES[shapeOf(le)], verdict: verdict(),
    };
}

function koSpeed(v) {
    if (v >= 1) return `${fmt(v, 1)} m/s`;
    if (v >= 1 / 60) return `${fmt(v * 60, 1)} m/분`;
    if (v >= 1 / 3600) return `${fmt(v * 3600, 1)} m/시간`;
    if (v >= 1 / 86400) return `${fmt(v * 86400, 2)} m/일`;
    return `${fmt(v * 86400 * 365, 3)} m/년`;
}
// 로 after a vowel or ㄹ, 으로 after any other final consonant: m/일로 but
// m/분으로. The 's' in m/s is read 초, so it takes로 too.
function ro(s) {
    const last = s[s.length - 1];
    if (last === 's') return `${s}로`;
    const code = last.charCodeAt(0);
    if (code < 0xac00 || code > 0xd7a3) return `${s}로`;
    const jong = (code - 0xac00) % 28;
    return s + (jong === 0 || jong === 8 ? '로' : '으로');
}
function koTime(s) {
    if (s < 60) return `${fmt(s, 0)}초`;
    if (s < 3600) return `${fmt(s / 60, 1)}분`;
    if (s < 86400) return `${fmt(s / 3600, 1)}시간`;
    if (s < 86400 * 365) return `${fmt(s / 86400, 1)}일`;
    return `${fmt(s / (86400 * 365), 1)}년`;
}
function koEta(le) {
    const m = Math.floor(le), c = Math.pow(10, le - m);
    return `${fmt(c, 1)} × 10${sup(m)} Pa·s`;
}
const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
function sup(n) { return String(n).split('').map(c => SUP[c]).join(''); }

function el(tag, attrs, text) {
    const n = document.createElementNS(svgNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text !== undefined) n.textContent = text;
    return n;
}

const BASE = 180, APEX_X = 230;

function drawVolcano(g) {
    const a = analyse();
    const S = a.shape;
    const h = S.halfWidth * Math.tan(S.slope * Math.PI / 180);
    const apexY = BASE - h;
    const style = a.verdict;

    g.appendChild(el('rect', { x: 0, y: BASE, width: 460, height: 214 - BASE, class: 'ground' }));

    // An explosive column, drawn before the cone so the cone sits in front.
    if (style !== 'p1') {
        const power = style === 'p3' ? 1 : 0.45;
        const grow = state.running ? Math.min(1, state.blast) : 1;
        for (let i = 0; i < 14; i += 1) {
            const t = i / 13;
            const y = apexY - t * (apexY - 34) * grow;
            const spread = (8 + t * 42 * power) * grow;
            const wob = Math.sin(state.phase * 1.4 + i * 0.8) * 4 * power;
            g.appendChild(el('circle', {
                cx: APEX_X + wob, cy: y, r: Math.max(3, spread * 0.55),
                class: i % 3 ? 'ash' : 'ash-dark',
            }));
        }
    }

    g.appendChild(el('polygon', {
        points: `${APEX_X - S.halfWidth},${BASE} ${APEX_X - 12},${apexY} ${APEX_X + 12},${apexY} ${APEX_X + S.halfWidth},${BASE}`,
        class: 'cone',
    }));

    // Lava running down the flanks, faster when the melt is thinner.
    if (style !== 'p3') {
        const speed = clamp(0.08 + Math.log10(Math.max(a.flow, 1e-9)) * 0.12 + 1.1, 0.05, 0.9);
        for (let i = 0; i < 5; i += 1) {
            const p = ((state.phase * speed) + i / 5) % 1;
            [-1, 1].forEach(sgn => {
                const x = APEX_X + sgn * (12 + p * (S.halfWidth - 12));
                const y = apexY + p * h;
                g.appendChild(el('line', {
                    x1: x, y1: y, x2: x + sgn * 9, y2: y + 9 * h / (S.halfWidth - 12),
                    class: 'lava', style: `stroke-width:${fmt(3.4 - p * 1.4, 2)};opacity:${fmt(1 - p * 0.55, 2)}`,
                }));
            });
        }
    }

    g.appendChild(el('ellipse', { cx: APEX_X, cy: 202, rx: 58, ry: 11, class: 'chamber' }));
    g.appendChild(el('line', { x1: APEX_X, y1: 200, x2: APEX_X, y2: apexY, class: 'conduit', style: 'stroke-width:9' }));

    // Bubbles climbing the conduit. Drawn far faster than reality, which the
    // caption says outright; the true time is in the table.
    const bs = clamp(0.05 + (10 - a.logEta) * 0.055, 0.03, 0.6);
    for (let i = 0; i < 6; i += 1) {
        const p = ((state.phase * bs) + i / 6) % 1;
        g.appendChild(el('circle', {
            cx: APEX_X + Math.sin(p * 7 + i) * 2.2, cy: 200 - p * (200 - apexY),
            r: 2.6, class: 'bubble', style: `opacity:${fmt(0.35 + 0.65 * (1 - p), 2)}`,
        }));
    }

    // The slope angle, drawn as the arc it actually is.
    const ax = APEX_X + S.halfWidth;
    g.appendChild(el('path', {
        d: `M ${ax - 34} ${BASE} A 34 34 0 0 0 ${fmt(ax - 34 * Math.cos(S.slope * Math.PI / 180), 1)} ${fmt(BASE - 34 * Math.sin(S.slope * Math.PI / 180), 1)}`,
        class: 'slope-arc',
    }));
    g.appendChild(el('text', { x: ax - 40, y: BASE - 6, 'text-anchor': 'end', class: 'tiny-label' }, `${S.slope}°`));

    g.appendChild(el('text', { x: 22, y: 26, class: 'read-text' }, `점성 ${koEta(a.logEta)}`));
    g.appendChild(el('text', { x: 22, y: 42, class: 'small-label' }, `${a.kind.name} · ${state.temp} ℃ · 물 ${state.water}%`));
    g.appendChild(el('text', { x: 438, y: 26, 'text-anchor': 'end', class: 'hot-text' }, S.name));
    g.appendChild(el('text', { x: 438, y: 42, 'text-anchor': 'end', class: 'small-label' },
        style === 'p1' ? '조용히 흘러넘침' : (style === 'p2' ? '중간쯤 분출' : '크게 폭발')));
    g.appendChild(el('text', { x: 22, y: 206, class: 'small-label' }, '마그마 방'));
}

function drawGraph(g) {
    const a = analyse();
    const x0 = 54, x1 = 440, yTop = 26, yBot = 146;
    const LO = -3, HI = 11;
    const X = t => x0 + ((t - 700) / 600) * (x1 - x0);
    const Y = le => yBot - ((clamp(le, LO, HI) - LO) / (HI - LO)) * (yBot - yTop);

    for (let d = LO; d <= HI; d += 2) {
        g.appendChild(el('line', { x1: x0, y1: Y(d), x2: x1, y2: Y(d), class: 'grid-line' }));
        g.appendChild(el('text', { x: x0 - 6, y: Y(d) + 3.5, 'text-anchor': 'end', class: 'axis-text' }, `10${sup(d)}`));
    }
    g.appendChild(el('line', { x1: x0, y1: yBot, x2: x1, y2: yBot, class: 'axis' }));
    g.appendChild(el('line', { x1: x0, y1: yTop, x2: x0, y2: yBot, class: 'axis' }));
    for (let t = 700; t <= 1300; t += 100) {
        g.appendChild(el('line', { x1: X(t), y1: yBot, x2: X(t), y2: yBot + 4, class: 'axis' }));
        g.appendChild(el('text', { x: X(t), y: yBot + 15, 'text-anchor': 'middle', class: 'axis-text' }, String(t)));
    }

    // Everyday liquids, so the numbers mean something.
    [[1, '꿀'], [5, '아스팔트']].forEach(([le, label]) => {
        g.appendChild(el('line', { x1: x0, y1: Y(le), x2: x1, y2: Y(le), class: 'ref-line' }));
        g.appendChild(el('text', { x: x1 - 2, y: Y(le) - 4, 'text-anchor': 'end', class: 'tiny-label' }, `${label} 정도`));
    });

    // Each curve is drawn only over the range where that magma is still liquid,
    // so the picture never suggests a temperature the melt could not have.
    Object.entries(KINDS).forEach(([k, K]) => {
        let d = '';
        for (let i = 0; i <= 120; i += 1) {
            const t = K.tMin + (i / 120) * (K.tMax - K.tMin);
            d += `${i ? 'L' : 'M'} ${fmt(X(t), 2)} ${fmt(Y(logEta(K.si, t, state.water)), 2)} `;
        }
        g.appendChild(el('path', { d, class: `eta-line ${k}`, style: k === state.kind ? '' : 'opacity:.4' }));
    });
    g.appendChild(el('circle', { cx: X(state.temp), cy: Y(a.logEta), r: 5, class: 'trace-dot', style: `fill:${a.kind.colour}` }));

    let lx = x0;
    Object.entries(KINDS).forEach(([k, K]) => {
        g.appendChild(el('line', { x1: lx, y1: 172, x2: lx + 15, y2: 172, style: `stroke:${K.colour};stroke-width:3` }));
        g.appendChild(el('text', { x: lx + 20, y: 175.5, class: 'legend-text', style: `fill:${K.colour}` }, K.name));
        lx += 26 + K.name.length * 10.5;
    });
    g.appendChild(el('text', { x: x1 - 2, y: 175.5, 'text-anchor': 'end', class: 'legend-text', style: 'fill:#475569' }, `물 ${state.water}%일 때`));
    g.appendChild(el('text', { x: (x0 + x1) / 2, y: 191, 'text-anchor': 'middle', class: 'axis-title' }, '마그마의 온도 (℃) — 세로는 점성 (Pa·s, 로그 눈금)'));
}

function render() {
    const m = $('mainGroup'), gr = $('graphGroup');
    m.textContent = ''; gr.textContent = '';
    drawVolcano(m); drawGraph(gr);
    updateReadout();
}

function updateReadout() {
    const a = analyse();
    $('stageBadge').textContent = `${a.kind.name} · ${state.temp} ℃ · 물 ${state.water}%`;
    $('valueA').textContent = koEta(a.logEta);
    $('valueB').textContent = koSpeed(a.flow);
    const rows = [
        ['SiO₂ 함량', `${a.kind.si}%`, false],
        ['기포가 1 m 오르는 시간', koTime(a.riseTime), a.riseTime < 600],
        ['갇히는 가스의 몫', `${Math.round(a.retention * 100)}%`, a.retention < 0.2],
        ['폭발력 지수', `물 ${state.water}% × ${fmt(a.retention, 2)} = ${fmt(a.explosivity, 2)}`, false],
        ['화산의 모양', `${a.shape.name} · 비탈 ${a.shape.slope}°`, false],
        ['같은 마그마가 굳으면', `${a.kind.rock} · ${a.kind.where}`, false],
    ];
    $('dataNote').innerHTML = rows.map(([n, v, m]) =>
        `<div class="data-row${m ? ' match' : ''}"><span class="data-name">${n}</span><span class="data-val">${v}</span></div>`).join('');
    if (state.checked) explain(a);
}

const WORDS = { p1: '조용히 흘러넘친다', p2: '중간쯤', p3: '크게 폭발한다' };

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

    let s = `SiO₂ ${a.kind.si}%인 ${a.kind.name} 마그마가 ${state.temp} ℃이고 물이 ${state.water}% 녹아 있으면 점성은 ${koEta(a.logEta)}입니다. `;
    s += `이 값이면 두께 1 m짜리 용암이 3° 비탈을 ${ro(koSpeed(a.flow))} 흐릅니다. `;
    s += `같은 마그마에서 지름 2 cm짜리 기포가 1 m 떠오르는 데는 ${koTime(a.riseTime)}이 걸립니다. `;
    if (a.retention < 0.2) {
        s += `기포가 이렇게 쉽게 빠져나가므로 가스가 미처 쌓이지 못하고, 마그마는 터지지 않고 그대로 흘러넘칩니다. `;
    } else if (a.retention < 0.7) {
        s += `기포가 느리게 오르므로 가스의 ${Math.round(a.retention * 100)}%가 갇힙니다. 흘러나오기도 하고 터지기도 하는 중간쯤의 분출이 됩니다. `;
    } else {
        s += `기포가 사실상 움직이지 못해 가스의 ${Math.round(a.retention * 100)}%가 갇힙니다. 갇힌 가스는 압력을 키우다가 한계를 넘는 순간 마그마를 잘게 부수며 터져 나옵니다. `;
    }
    s += `여기에 녹아 있던 물 ${state.water}%가 더해져 폭발력은 ${fmt(a.explosivity, 2)}이고, 이 정도면 ${WORDS[v]}. `;
    s += `쌓이는 모양도 여기서 갈립니다. 용암이 멀리 흐르면 넓고 낮게 퍼지고 가까이서 굳으면 가파르게 쌓이므로, 이 마그마는 비탈이 ${a.shape.slope}°쯤인 ${a.shape.name}을 만듭니다.`;
    $('elementaryExplanation').textContent = s;
}

// --- animation --------------------------------------------------------------
function tick(dt) {
    state.phase += dt;
    if (!state.running) return false;
    state.blast = Math.min(1.35, state.blast + dt / 3.5);
    if (state.blast >= 1.35) {
        state.running = false;
        $('runBtn').textContent = '분출시키기';
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

function applyTempRange() {
    const K = KINDS[state.kind];
    const r = $('tempRange');
    r.min = String(K.tMin); r.max = String(K.tMax);
    state.temp = clamp(state.temp, K.tMin, K.tMax);
    r.value = String(state.temp);
    $('tempOutput').textContent = `${state.temp} ℃`;
    $('tempLo').textContent = `${K.tMin} ℃`;
    $('tempMid').textContent = `${(K.tMin + K.tMax) / 2} ℃`;
    $('tempHi').textContent = `${K.tMax} ℃`;
}

document.querySelectorAll('[data-kind]').forEach(b => b.addEventListener('click', () => {
    state.kind = b.dataset.kind; markSelected('[data-kind]', 'kind', state.kind);
    applyTempRange(); render();
}));
document.querySelectorAll('[data-water]').forEach(b => b.addEventListener('click', () => {
    state.water = Number(b.dataset.water); markSelected('[data-water]', 'water', state.water); render();
}));
document.querySelectorAll('[data-prediction]').forEach(b => b.addEventListener('click', () => {
    state.prediction = b.dataset.prediction; state.checked = false; window.scienceInvalidatePrediction?.(); markSelected('[data-prediction]', 'prediction', state.prediction);
}));
$('tempRange').addEventListener('input', e => {
    state.temp = Number(e.target.value);
    $('tempOutput').textContent = `${state.temp} ℃`;
    render();
});
$('runBtn').addEventListener('click', () => {
    if (state.running) { state.running = false; $('runBtn').textContent = '분출시키기'; return; }
    state.blast = 0; state.running = true; state.checked = true;
    $('runBtn').textContent = '멈추기';
    render();
});
$('resetBtn').addEventListener('click', () => {
    state.kind = 'basalt'; state.water = 0.5; state.temp = 1200;
    state.prediction = null; state.checked = false; state.running = false; state.blast = 0;
    $('runBtn').textContent = '분출시키기';
    document.querySelectorAll('[data-prediction]').forEach(x => x.classList.remove('selected'));
    $('resultEmpty').hidden = false; $('resultContent').hidden = true;
    markSelected('[data-kind]', 'kind', 'basalt'); markSelected('[data-water]', 'water', 0.5);
    applyTempRange();
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

markSelected('[data-kind]', 'kind', state.kind);
markSelected('[data-water]', 'water', state.water);
applyTempRange();
render();
requestAnimationFrame(frame);

window.__magmaModel = {
    state, analyse, tick, render, logEta, eta, flowSpeed, bubbleSpeed, retention, explosivity, shapeOf,
    KINDS, SHAPES, RHO, G, H_FLOW, SLOPE, R_BUBBLE,
    setKind(v) { document.querySelector(`[data-kind="${v}"]`).click(); },
    setWater(v) { document.querySelector(`[data-water="${v}"]`).click(); },
    setTemp(v) { const r = $('tempRange'); r.value = String(v); r.dispatchEvent(new Event('input')); },
    check() { state.checked = true; explain(analyse()); },
    runToEnd(dt = 1 / 30) {
        $('runBtn').click();
        let steps = 0;
        while (state.running && steps < 20000) { tick(dt); steps += 1; }
        render();
        return { steps, blast: state.blast };
    },
};
