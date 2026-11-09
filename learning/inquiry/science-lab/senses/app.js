'use strict';

/* A dropped ruler is a stopwatch you can read with your fingers. It falls
   d = ½gt², so catching it at a mark tells you how long you took. That also
   sets the method's limit: a 30 cm ruler runs out at 0.247 s, which is why
   touch and hearing can be measured this way and smell and taste cannot. */

const G = 9.8;
const RULER_CM = 30;

const SENSES = {
    skin: { name: '피부', mover: '손등을 톡 건드립니다', base: 0.20, organ: '피부', why: '살갗의 신경이 곧바로 느낍니다' },
    ear: { name: '귀', mover: '소리를 냅니다', base: 0.20, organ: '귀', why: '소리가 고막을 바로 흔듭니다' },
    eye: { name: '눈', mover: '자를 놓는 것을 봅니다', base: 0.20, organ: '눈', why: '본 것을 알아보는 데 시간이 조금 더 걸립니다' },
    nose: { name: '코', mover: '냄새를 풍깁니다', base: 0.20, organ: '코', why: '냄새 알갱이가 코 속까지 퍼져야 합니다' },
    tongue: { name: '혀', mover: '맛을 봅니다', base: 0.20, organ: '혀', why: '맛 물질이 침에 녹아야 느낄 수 있습니다' },
};
const CONDS = {
    fresh: { name: '잘 잤을 때', mult: 1.0 },
    sleepy: { name: '졸릴 때', mult: 1.3 },
    busy: { name: '딴생각할 때', mult: 1.6 },
};

const state = {
    sense: 'eye', cond: 'fresh',
    prediction: null, checked: false,
    running: false, done: false, t: 0, phase: 0,
};

const $ = id => document.getElementById(id);
const svgNS = 'http://www.w3.org/2000/svg';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = (v, d) => v.toFixed(d).replace('-', '−');
// 눈으로, 귀로 — 으로 after a final consonant, except ㄹ which takes로.
function ro(w) {
    const c = w.charCodeAt(w.length - 1);
    if (c < 0xac00 || c > 0xd7a3) return `${w}로`;
    const jong = (c - 0xac00) % 28;
    return w + (jong === 0 || jong === 8 ? '로' : '으로');
}

function reaction(sense, cond) { return SENSES[sense].base * CONDS[cond].mult; }
// Free fall: how far the ruler has gone, in centimetres.
function fallCm(t) { return 0.5 * G * t * t * 100; }
// And the inverse, which is how the mark you catch becomes a time.
function timeFor(cm) { return Math.sqrt(2 * (cm / 100) / G); }
const RULER_T = timeFor(RULER_CM);

function verdictFor(sense, cond) {
    const d = fallCm(reaction(sense, cond));
    return d <= 25 ? 'p1' : (d <= RULER_CM ? 'p2' : 'p3');
}

function analyse() {
    const s = SENSES[state.sense], c = CONDS[state.cond];
    const t = reaction(state.sense, state.cond);
    const d = fallCm(t);
    return {
        sense: s, cond: c, t, d, caught: d <= RULER_CM,
        freshT: s.base, freshD: fallCm(s.base),
        verdict: verdictFor(state.sense, state.cond),
    };
}

function el(tag, attrs, text) {
    const n = document.createElementNS(svgNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text !== undefined) n.textContent = text;
    return n;
}

const PX_CM = 4.4;               // screen pixels per centimetre of ruler
const HAND_Y = 160, RULER_X = 78, RULER_W = 28;
// Timeline of one drop, in screen seconds. The fall itself is shown four times slower.
const WAIT = 0.6, SLOW = 4, HOLD = 0.6, MISS_T = 0.42;
const reducedMotion = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
function totalTime(a) { return WAIT + SLOW * (a.caught ? a.t : Math.max(a.t, MISS_T)) + HOLD; }
// Real seconds since the ruler was let go (negative while it is still held).
function fallClock(a) {
    if (state.done) return a.caught ? a.t : Math.max(a.t, MISS_T);
    if (!state.running) return -1;
    return (state.t * totalTime(a) - WAIT) / SLOW;
}

const SKIN = '#f2c9a6', SKIN_LINE = '#b07f5e';
function finger(g, x1, y1, x2, y2) {
    g.appendChild(el('line', { x1, y1, x2, y2, stroke: SKIN_LINE, 'stroke-width': 10, 'stroke-linecap': 'round' }));
    g.appendChild(el('line', { x1, y1, x2, y2, stroke: SKIN, 'stroke-width': 7.6, 'stroke-linecap': 'round' }));
}
// A hand seen from the side: palm, folded fingers and the pinching thumb/index pair.
function palm(g, x, y, dir) {
    const w = 46, h = 30, x0 = dir > 0 ? x : x - w;
    g.appendChild(el('rect', { x: x0, y: y - h / 2, width: w, height: h, rx: 13, fill: SKIN, stroke: SKIN_LINE, 'stroke-width': 1.4 }));
    for (let i = 0; i < 3; i++) g.appendChild(el('path', { d: `M ${x0 + (dir > 0 ? 8 + i * 9 : w - 8 - i * 9)} ${y + h / 2 - 1} q ${dir * 4} 6 ${dir * 8} 0`, fill: 'none', stroke: SKIN_LINE, 'stroke-width': 1.2 }));
    // A sleeve so the hand belongs to an arm.
    g.appendChild(el('rect', { x: dir > 0 ? x + w - 2 : x - w - 30, y: y - h / 2 - 2, width: 32, height: h + 4, rx: 5, fill: '#9cc3d5', stroke: '#6f97aa', 'stroke-width': 1.2 }));
}

const ORGAN_SPOT = { eye: [224, 96], ear: [268, 112], nose: [212, 112], tongue: [222, 134] };
function head(g, sense, on) {
    // Side view of a head looking left at the ruler.
    g.appendChild(el('path', { d: 'M 236 54 C 270 46 300 66 302 102 C 304 132 292 152 276 162 L 276 196 L 246 196 L 246 168 C 236 166 230 158 226 150 C 220 148 216 144 218 138 C 214 134 214 130 218 128 C 212 124 210 118 214 114 L 205 108 L 214 100 C 214 76 220 60 236 54 Z', fill: SKIN, stroke: SKIN_LINE, 'stroke-width': 1.6 }));
    g.appendChild(el('path', { d: 'M 236 54 C 262 44 296 58 302 96 C 290 80 270 72 246 74 C 236 70 232 62 236 54 Z', fill: '#5b4636' }));
    const hot = '#d97706', base = SKIN_LINE;
    g.appendChild(el('path', { d: 'M 262 104 C 262 94 274 94 275 106 C 276 118 268 124 264 120', fill: on && sense === 'ear' ? '#fcd34d' : SKIN, stroke: on && sense === 'ear' ? hot : base, 'stroke-width': on && sense === 'ear' ? 2.4 : 1.6 }));
    g.appendChild(el('ellipse', { cx: 225, cy: 96, rx: 5.5, ry: 3.4, fill: '#ffffff', stroke: on && sense === 'eye' ? hot : '#6b4f3a', 'stroke-width': on && sense === 'eye' ? 2.4 : 1.2 }));
    g.appendChild(el('circle', { cx: 222.5, cy: 96, r: 2.1, fill: '#3a2a20' }));
    g.appendChild(el('path', { d: 'M 214 100 L 205 108 L 214 114', fill: on && sense === 'nose' ? '#fcd34d' : 'none', stroke: on && sense === 'nose' ? hot : base, 'stroke-width': on && sense === 'nose' ? 2.4 : 1.2 }));
    g.appendChild(el('path', { d: 'M 218 128 Q 223 131 228 128', fill: 'none', stroke: '#a3554a', 'stroke-width': 1.6 }));
    if (sense === 'tongue') g.appendChild(el('path', { d: 'M 218 129 Q 213 133 219 135 Q 223 133 222 130 Z', fill: on ? '#f87171' : '#e8a3a3', stroke: on ? hot : '#a3554a', 'stroke-width': 1.2 }));
}

function drawRuler(g) {
    const a = analyse();
    const tau = fallClock(a);                       // real seconds since release
    const caughtNow = tau >= a.t;                   // the fingers have closed
    const fallen = tau <= 0 ? 0 : a.caught ? fallCm(Math.min(tau, a.t)) : fallCm(tau);
    const top = HAND_Y - RULER_CM * PX_CM + fallen * PX_CM;
    const close = tau < a.t ? 0 : Math.min(1, (tau - a.t) / 0.03);
    const released = tau >= 0;

    // Thumbs sit behind the ruler, so they are drawn first.
    const gapC = 12 - 9 * close;
    finger(g, 124, HAND_Y + gapC, 72, HAND_Y + gapC);
    finger(g, 34, 44 + (released ? 9 : 4), 110, 44 + (released ? 9 : 4));

    const fall = el('g', { 'clip-path': 'url(#stageClip)' });
    fall.appendChild(el('rect', { x: RULER_X, y: top, width: RULER_W, height: RULER_CM * PX_CM, rx: 3, class: 'ruler' }));
    for (let cm = 0; cm <= RULER_CM; cm += 1) {
        const y = top + (RULER_CM - cm) * PX_CM, major = cm % 5 === 0;
        fall.appendChild(el('line', { x1: RULER_X, y1: y, x2: RULER_X + (major ? 10 : 5), y2: y, class: 'ruler-tick' }));
        if (major && cm > 0 && y > 10 && y < 294) fall.appendChild(el('text', { x: RULER_X + 12, y: y + 4.5, class: 'ruler-num' }, String(cm)));
    }
    g.appendChild(fall);

    // Index fingers cross in front of the ruler.
    finger(g, 120, HAND_Y - gapC, 70, HAND_Y - gapC);
    finger(g, 34, 44 - (released ? 9 : 4), 112, 44 - (released ? 9 : 4));
    // Fingernails mark which end is the fingertip.
    g.appendChild(el('ellipse', { cx: 73, cy: HAND_Y - gapC - 1.2, rx: 3.2, ry: 2, fill: '#fbe3d3', stroke: SKIN_LINE, 'stroke-width': 0.8 }));
    g.appendChild(el('ellipse', { cx: 109, cy: 44 - (released ? 9 : 4) - 1.2, rx: 3.2, ry: 2, fill: '#fbe3d3', stroke: SKIN_LINE, 'stroke-width': 0.8 }));
    palm(g, 118, HAND_Y, 1);
    palm(g, 62, 44, -1);
    g.appendChild(el('line', { x1: 60, y1: HAND_Y, x2: 116, y2: HAND_Y, class: 'catch-line' }));

    // The stimulus, from the moment of release until the catch.
    const cue = released && !caughtNow && state.running;
    head(g, state.sense, cue || (state.running && released));
    if (cue) {
        if (state.sense === 'eye') g.appendChild(el('line', { x1: 218, y1: 96, x2: 110, y2: 60, stroke: '#d97706', 'stroke-width': 1.8, 'stroke-dasharray': '5 4' }));
        if (state.sense === 'ear') for (let i = 0; i < 3; i++) g.appendChild(el('path', { d: `M ${150 + i * 14} ${72 + i * 9} q 8 10 0 22`, fill: 'none', stroke: '#d97706', 'stroke-width': 2 }));
        if (state.sense === 'nose') for (let i = 0; i < 3; i++) g.appendChild(el('path', { d: `M ${150 + i * 14} 128 q 6 -6 0 -12 q -6 -6 0 -12`, fill: 'none', stroke: '#d97706', 'stroke-width': 2 }));
        if (state.sense === 'tongue') g.appendChild(el('circle', { cx: 212, cy: 140, r: 4, fill: '#f59e0b' }));
        if (state.sense === 'skin') g.appendChild(el('path', { d: `M 150 ${HAND_Y - 22} l 4 8 l 8 -3 l -4 8 l 7 5 l -9 1 l 0 8 l -6 -6 l -6 6 l 0 -8 l -9 -1 l 7 -5 l -4 -8 l 8 3 z`, fill: '#fcd34d', stroke: '#d97706', 'stroke-width': 1.4 }));
    }

    // The road a signal travels, lit in order during the reaction time.
    const steps = ['자극', a.sense.organ, '감각 신경', '뇌', '운동 신경', '근육'];
    const lit = state.done ? steps.length : tau < 0 ? -1 : Math.min(steps.length - 1, Math.floor(tau / a.t * steps.length));
    steps.forEach((n, i) => {
        const y = 32 + i * 42, on = i === lit, past = i < lit;
        g.appendChild(el('rect', { x: 336, y: y - 13, width: 104, height: 26, rx: 7, class: `step-box${on ? ' lit' : ''}`, style: past ? 'fill:#fff7e6;stroke:#f0b45b' : '' }));
        g.appendChild(el('text', { x: 388, y: y + 5, 'text-anchor': 'middle', class: 'step-name', style: `fill:${on ? '#b45309' : '#0f172a'}` }, n));
        if (i < steps.length - 1) {
            g.appendChild(el('line', { x1: 388, y1: y + 14, x2: 388, y2: y + 24, class: 'arrow-line' }));
            g.appendChild(el('path', { d: `M 388 ${y + 29} l -4 -6 l 8 0 z`, class: 'arrow-head' }));
        }
    });

    // The reading belongs to the finished drop only.
    if (state.done) {
        if (a.caught) {
            g.appendChild(el('text', { x: 12, y: 214, class: 'big-read' }, `${fmt(a.t, 2)}초`));
            g.appendChild(el('text', { x: 12, y: 236, class: 'small-label' }, `${fmt(a.d, 1)} cm`));
        } else {
            g.appendChild(el('text', { x: 130, y: 214, class: 'missed' }, '놓쳤습니다'));
        }
    }
}

function drawGraph(g) {
    ['감각 기관 → 감각 신경','중추 신경계에서 정보 처리','운동 신경 → 근육의 반응'].forEach((text,i)=>g.appendChild(el('text',{x:20,y:40+i*50,fill:'#334155','font-size':16},text)));
}

function render() {
    window.scienceScene.draw([$('mainGroup'), $('graphGroup')], ([m, gr]) => {
    drawRuler(m); drawGraph(gr);
    });
    updateReadout();
}

const WORDS = { p1: '잴 수 있다', p2: '아슬아슬하다', p3: '너무 느려 못 잰다' };

function updateReadout() {
    const a=analyse();$('stageBadge').textContent=a.sense.name+' · 가상 관찰 자료';
    $('valueA').textContent='예시 '+fmt(a.t,2)+'초';$('valueB').textContent=a.caught?fmt(a.d,1)+' cm':'모형 자의 범위를 넘음';
    $('dataNote').innerHTML='<p>감각 기관 → 감각 신경 → 중추 신경계 → 운동 신경 → 근육</p><p>화면의 시간과 상태별 차이는 임의로 정한 예시입니다. 실제 사람의 측정값이나 감각별 순위가 아닙니다.</p>';
    if(state.checked)explain(a);
}

function explain(a) {
    $('resultEmpty').hidden=true;$('resultContent').hidden=false;
    $('predictionResult').textContent=state.prediction?(state.prediction===a.verdict?'모형의 예상이 맞았습니다.':'모형의 예상과 다른 결과입니다.'):'';
    $('elementaryExplanation').textContent='자극을 '+a.sense.name+'에서 받아들이고 감각 신경을 거쳐 중추 신경계로 전달합니다. 의식적인 반응에서는 대뇌의 판단 뒤 운동 신경을 거쳐 근육이 반응합니다. 화면의 시간은 예시이며 실제 반응 시간은 반복 실험으로 확인해야 합니다.';
}

// --- animation --------------------------------------------------------------
// Runs only while a drop is in progress; the last frame stays on screen.
function finish() {
    state.running = false; state.t = 1; state.done = true; state.checked = true;
    $('runBtn').textContent = '자 떨어뜨리기';
}
function tick(dt) {
    state.phase += dt;
    if (!state.running) return false;
    state.t = Math.min(1, state.t + dt / totalTime(analyse()));
    if (state.t >= 1) { finish(); return true; }
    return false;
}

let last = 0;
function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    tick(dt);
    render();
    if (state.running) requestAnimationFrame(frame); else last = 0;
}
function clearRun() {
    state.running = false; state.done = false; state.checked = false; state.t = 0;
    $('runBtn').textContent = '자 떨어뜨리기';
    $('resultEmpty').hidden = false; $('resultContent').hidden = true;
}

// --- wiring -----------------------------------------------------------------
function markSelected(sel, attr, value) {
    document.querySelectorAll(sel).forEach(b => b.classList.toggle('selected', b.dataset[attr] === String(value)));
}

document.querySelectorAll('[data-sense]').forEach(b => b.addEventListener('click', () => {
    state.sense = b.dataset.sense; clearRun(); markSelected('[data-sense]', 'sense', state.sense); render();
}));
document.querySelectorAll('[data-cond]').forEach(b => b.addEventListener('click', () => {
    state.cond = b.dataset.cond; clearRun(); markSelected('[data-cond]', 'cond', state.cond); render();
}));
document.querySelectorAll('[data-prediction]').forEach(b => b.addEventListener('click', () => {
    state.prediction = b.dataset.prediction; state.checked = false; window.scienceInvalidatePrediction?.(); markSelected('[data-prediction]', 'prediction', state.prediction);
}));
$('runBtn').addEventListener('click', () => {
    if (state.running) { finish(); render(); return; }
    clearRun(); state.running = true;
    $('runBtn').textContent = '멈추기';
    if (reducedMotion) finish();
    render();
    if (state.running) { last = 0; requestAnimationFrame(frame); }
});
$('resetBtn').addEventListener('click', () => {
    state.sense = 'eye'; state.cond = 'fresh';
    state.prediction = null; clearRun();
    document.querySelectorAll('[data-prediction]').forEach(x => x.classList.remove('selected'));
    $('resultEmpty').hidden = false; $('resultContent').hidden = true;
    markSelected('[data-sense]', 'sense', 'eye'); markSelected('[data-cond]', 'cond', 'fresh');
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

markSelected('[data-sense]', 'sense', state.sense);
markSelected('[data-cond]', 'cond', state.cond);
render();

window.__senseModel = {
    state, analyse, tick, render, reaction, fallCm, timeFor, verdictFor,
    SENSES, CONDS, G, RULER_CM, RULER_T,
    setSense(v) { document.querySelector(`[data-sense="${v}"]`).click(); },
    setCond(v) { document.querySelector(`[data-cond="${v}"]`).click(); },
    check() { state.checked = true; explain(analyse()); },
    runToEnd(dt = 1 / 30) {
        $('runBtn').click();
        let steps = 0;
        while (state.running && steps < 20000) { tick(dt); steps += 1; }
        render();
        return { steps, t: state.t };
    },
};

/* 그림 속 문장을 HTML로 내린다. 액자를 벗어나거나 서로 겹치는 글자만 옮기므로
   조건이 바뀌어도 스스로 맞는다. 그림에는 짧은 이름표만 남는다. */
(function () {
    const stageVerdict = document.getElementById('stageVerdict');
    const stageReadout = document.getElementById('stageReadout');
    const stageNote = document.getElementById('stageNote');
    if (!stageReadout) return;
    const pairs = [['mainGroup', '.main-svg'], ['graphGroup', '.graph-svg']]
        .map(([id, sel]) => [document.getElementById(id), document.querySelector(sel)])
        .filter(([g, s]) => g && s);
    if (!pairs.length) return;

    // 그림에서 쓰던 색이 흰 바탕에서는 너무 흐린 경우가 있어, 그런 색은 버리고 기본색을 쓴다.
    function readableOnWhite(c) {
        let r, g, b;
        if (c[0] === '#') {
            let h = c.slice(1);
            if (h.length === 3) h = h.split('').map(x => x + x).join('');
            if (h.length !== 6) return false;
            r = parseInt(h.slice(0, 2), 16); g = parseInt(h.slice(2, 4), 16); b = parseInt(h.slice(4, 6), 16);
        } else {
            const m = c.match(/[\d.]+/g);
            if (!m || m.length < 3) return false;
            r = +m[0]; g = +m[1]; b = +m[2];
            const a = m.length > 3 ? +m[3] : 1;
            r = a * r + (1 - a) * 255; g = a * g + (1 - a) * 255; b = a * b + (1 - a) * 255;
        }
        const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
        const L = 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
        return 1.05 / (L + 0.05) >= 3.5;
    }

    function liftProse() {
        const rows = [], notes = [], verdicts = [];
        const takeOut = t => {
            const cls = t.getAttribute('class') || '';let txt = t.textContent.trim();
            if(t.matches('.stat-value')){
                const label=t.previousElementSibling;
                if(label?.matches('.stat-name')&&label.getAttribute('y')===t.getAttribute('y')){txt=label.textContent.trim()+': '+txt;label.remove();}
            }
            if (txt) {
                if (/verdict-text/.test(cls)) verdicts.push(txt);
                else if (/note-text/.test(cls)) notes.push(txt);
                else rows.push({ txt, fill: t.style.fill || '' });
            }
            t.remove();
        };
        pairs.forEach(([g, svg]) => {
            const vb = svg.viewBox.baseVal, W = vb.width, H = vb.height;
            const outside = b => b.x < -0.5 || b.x + b.width > W + 0.5 || b.y + b.height > H + 0.5 || b.y < -0.5;
            [...g.querySelectorAll('text')].forEach(t => {
                const cls = t.getAttribute('class') || '';
                const must = /verdict-text|note-text|prose/.test(cls);
                let b; try { b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); } catch (e) { return; }
                // 눈금 같은 짧은 이름표는 밖으로 내보내면 뜻을 잃는다. 액자 안으로 밀어 넣어 본다.
                if (!must && outside(b) && b.width < W * 0.6 && !t.getAttribute('transform')) {
                    const x = parseFloat(t.getAttribute('x')), y = parseFloat(t.getAttribute('y'));
                    if (!Number.isNaN(x)) {
                        const dx = b.x + b.width > W - 2 ? (W - 2) - (b.x + b.width) : (b.x < 2 ? 2 - b.x : 0);
                        if (dx) { t.setAttribute('x', (x + dx).toFixed(1)); b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); }
                    }
                    if (!Number.isNaN(y)) {
                        const dy = b.y + b.height > H - 1 ? (H - 1) - (b.y + b.height) : (b.y < 1 ? 1 - b.y : 0);
                        if (dy) { t.setAttribute('y', (y + dy).toFixed(1)); b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); }
                    }
                }
                if (must || outside(b)) takeOut(t);
            });
            const items = [...g.querySelectorAll('text')].map(t => {
                let b; try { b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); } catch (e) { b = null; }
                return { t, b, len: t.textContent.trim().length };
            }).filter(o => o.b);
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
        // A new drawing may contain no lifted prose. Clear the previous
        // drawing's copy too; takeRecords below already consumes our own edits.
        if (stageVerdict) stageVerdict.textContent = verdicts.join(' ');
        stageReadout.textContent = '';
        rows.forEach(r => {
            const s = document.createElement('span');
            s.textContent = r.txt;
            if (r.fill && readableOnWhite(r.fill)) s.style.color = r.fill;
            stageReadout.appendChild(s);
        });
        if (stageNote) stageNote.textContent = notes.join(' ');
    }

    // 화면이 다시 그려지면 곧바로 돈다. 옮기는 동안 스스로를 깨우지 않도록 잠근다.
    let busy = false, obs;
    // 글자를 옮기는 것도 화면 변경이라 감시기가 다시 불린다. 그때는 기록이 비어 있으므로
    // 그냥 돌아가야 한다. 그러지 않으면 두 번째 실행이 방금 옮긴 결과를 지운다.
    const run = recs => {
        if (busy || (recs && recs.length === 0)) return;
        busy = true;
        try { liftProse(); } finally { obs.takeRecords(); busy = false; }
    };
    obs = new MutationObserver(run);
    pairs.forEach(([g]) => obs.observe(g, { childList: true, subtree: true }));
    run();
    // The observer sees the app's DOMContentLoaded render; do not run twice.
})();
