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
    running: false, t: 0, phase: 0,
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

const PX_CM = 5;                 // screen pixels per centimetre of ruler
const HAND_Y = 176, RULER_X = 92, RULER_W = 30;

function drawRuler(g) {
    const a = analyse();
    // While running the ruler follows the same free-fall law the number uses.
    const elapsed = state.running ? state.t * Math.max(a.t, RULER_T) * 1.35 : a.t;
    const fallen = state.running ? Math.min(fallCm(elapsed), RULER_CM + 14) : Math.min(a.d, RULER_CM + 14);
    const top = HAND_Y - RULER_CM * PX_CM + fallen * PX_CM;

    // A ruler that is not caught keeps going past the bottom of the picture,
    // so the whole thing is drawn inside a clip the width of the canvas.
    const fall = el('g', { 'clip-path': 'url(#stageClip)' });
    fall.appendChild(el('rect', { x: RULER_X, y: top, width: RULER_W, height: RULER_CM * PX_CM, rx: 3, class: 'ruler' }));
    for (let cm = 0; cm <= RULER_CM; cm += 5) {
        const y = top + (RULER_CM - cm) * PX_CM;
        fall.appendChild(el('line', { x1: RULER_X, y1: y, x2: RULER_X + 9, y2: y, class: 'ruler-tick' }));
        if (cm > 0 && y > 12 && y < 208) fall.appendChild(el('text', { x: RULER_X + 12, y: y + 3, class: 'ruler-num' }, String(cm)));
    }
    g.appendChild(fall);

    g.appendChild(el('path', { d: `M ${RULER_X - 26} ${HAND_Y - 9} q 12 -5 24 0 l 0 16 q -12 5 -24 0 Z`, class: 'hand' }));
    g.appendChild(el('path', { d: `M ${RULER_X + RULER_W + 2} ${HAND_Y - 9} q 12 -5 24 0 l 0 16 q -12 5 -24 0 Z`, class: 'hand' }));
    g.appendChild(el('line', { x1: RULER_X - 30, y1: HAND_Y, x2: RULER_X + RULER_W + 30, y2: HAND_Y, class: 'catch-line' }));
    g.appendChild(el('text', { x: RULER_X + RULER_W + 34, y: HAND_Y + 3, class: 'tiny-label' }, '잡는 자리'));

    // Kept out of the ruler's column: the markings slide through that space.
    if (!a.caught) {
        g.appendChild(el('text', { x: 18, y: 86, class: 'missed' }, '놓쳤습니다'));
    }

    g.appendChild(el('text', { x: 18, y: 24, class: 'small-label' }, `${a.sense.name} · ${a.cond.name}`));
    g.appendChild(el('text', { x: 18, y: 48, class: 'big-read' }, `${fmt(a.t, 2)}초`));
    g.appendChild(el('text', { x: 18, y: 66, class: 'tiny-label' }, a.caught ? `자가 ${fmt(a.d, 1)} cm 떨어짐` : `${fmt(a.d, 0)} cm — 자보다 김`));

    const SENSE_PATHS = {
        '눈': 'M 10 50 C 26 26 74 26 90 50 C 74 74 26 74 10 50 Z M 50 34 C 59 34 66 41 66 50 C 66 59 59 66 50 66 C 41 66 34 59 34 50 C 34 41 41 34 50 34 Z M 50 43 C 54 43 57 46 57 50 C 57 54 54 57 50 57 C 46 57 43 54 43 50 C 43 46 46 43 50 43 Z',
        '귀': 'M 38 14 C 58 14 74 28 74 46 C 74 62 62 70 60 78 C 58 86 50 88 42 86 C 36 84 34 76 38 72 C 44 68 54 62 54 46 C 54 34 44 26 36 26 C 30 26 28 20 38 14 Z',
        '코': 'M 48 16 C 56 16 62 38 66 62 C 68 70 62 82 50 82 C 38 82 32 70 34 62 C 38 38 42 16 48 16 Z',
        '혀': 'M 30 20 C 42 18 58 18 70 20 C 78 36 80 58 76 74 C 70 86 58 90 50 90 C 42 90 30 86 24 74 C 20 58 22 36 30 20 M 50 24 L 50 72',
        '피부': 'M 10 24 L 90 24 L 90 86 L 10 86 Z M 10 40 L 90 40 M 10 60 L 90 60 M 34 24 C 34 14 42 14 42 24 M 64 24 C 64 10 74 10 74 24',
    };

    // The road a signal travels, lit up in order while the ruler falls.
    const steps = ['자극', a.sense.organ, '신경', '뇌', '신경', '근육'];
    const lit = state.running ? Math.min(steps.length - 1, Math.floor(state.t * steps.length)) : -1;
    steps.forEach((n, i) => {
        const y = 26 + i * 30;
        const on = i === lit;
        g.appendChild(el('rect', { x: 232, y: y - 12, width: 76, height: 22, rx: 6, class: `step-box${on ? ' lit' : ''}` }));
        g.appendChild(el('text', { x: 270, y: y + 3, 'text-anchor': 'middle', class: 'step-name', style: `fill:${on ? '#d97706' : '#0f172a'}` }, n));
        if (i === 1 && SENSE_PATHS[n]) {
            const sc = 0.18;
            g.appendChild(el('path', {
                d: SENSE_PATHS[n],
                fill: on ? '#d97706' : '#64748b',
                stroke: on ? '#d97706' : '#64748b',
                'stroke-width': '1.5',
                transform: `translate(${(196).toFixed(1)}, ${(y - 12).toFixed(1)}) scale(${sc})`,
            }));
        }
        if (i < steps.length - 1) {
            g.appendChild(el('line', { x1: 270, y1: y + 10, x2: 270, y2: y + 18, class: 'arrow-line' }));
            g.appendChild(el('path', { d: `M 270 ${y + 19} l -4 -6 l 8 0 z`, class: 'arrow-head' }));
        }
    });
    g.appendChild(el('text', { x: 322, y: 30, class: 'tiny-label' }, a.sense.mover));
    g.appendChild(el('text', { x: 322, y: 116, class: 'tiny-label' }, '여기서 판단합니다'));
    g.appendChild(el('text', { x: 322, y: 176, class: 'tiny-label' }, '손가락을 오므립니다'));
    g.appendChild(el('text', { x: 322, y: 200, class: 'note-text' }, `이 모두가 ${fmt(a.t, 2)}초 안에`));
}

function drawGraph(g) {
    ['감각 기관 → 감각 신경','중추 신경계에서 정보 처리','운동 신경 → 근육의 반응'].forEach((text,i)=>g.appendChild(el('text',{x:20,y:40+i*50,fill:'#334155','font-size':16},text)));
}

function render() {
    const m = $('mainGroup'), gr = $('graphGroup');
    m.textContent = ''; gr.textContent = '';
    drawRuler(m); drawGraph(gr);
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
function tick(dt) {
    state.phase += dt;
    if (!state.running) return false;
    state.t = Math.min(1, state.t + dt / 4);
    if (state.t >= 1) {
        state.running = false;
        $('runBtn').textContent = '자 떨어뜨리기';
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

document.querySelectorAll('[data-sense]').forEach(b => b.addEventListener('click', () => {
    state.sense = b.dataset.sense; markSelected('[data-sense]', 'sense', state.sense); render();
}));
document.querySelectorAll('[data-cond]').forEach(b => b.addEventListener('click', () => {
    state.cond = b.dataset.cond; markSelected('[data-cond]', 'cond', state.cond); render();
}));
document.querySelectorAll('[data-prediction]').forEach(b => b.addEventListener('click', () => {
    state.prediction = b.dataset.prediction; state.checked = false; window.scienceInvalidatePrediction?.(); markSelected('[data-prediction]', 'prediction', state.prediction);
}));
$('runBtn').addEventListener('click', () => {
    if (state.running) { state.running = false; state.t = 1; $('runBtn').textContent = '자 떨어뜨리기'; return; }
    state.t = 0; state.running = true; state.checked = true;
    $('runBtn').textContent = '멈추기';
    render();
});
$('resetBtn').addEventListener('click', () => {
    state.sense = 'eye'; state.cond = 'fresh';
    state.prediction = null; state.checked = false; state.running = false; state.t = 0;
    $('runBtn').textContent = '자 떨어뜨리기';
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
requestAnimationFrame(frame);

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
