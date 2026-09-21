'use strict';

/* Magnification and field width follow the stated eyepiece/lens model.
   Shading and specimen shapes are illustrative, not measured photomicrographs. */

const SPECIMENS = {
    onion: { name: '양파 표피', mm: 0.35, wide: 0.09, kind: 'brick', tint: 'rgba(214,226,190,.55)', back: 'rgba(60,72,52,.35)', note: '세포벽이 있어 벽돌처럼 반듯합니다' },
    cheek: { name: '입안 상피', mm: 0.06, wide: 0.06, kind: 'blob', tint: 'rgba(226,196,214,.5)', back: 'rgba(70,54,66,.35)', note: '세포벽이 없어 둥글고 제각각입니다' },
    stoma: { name: '잎의 기공', mm: 0.02, wide: 0.02, kind: 'stoma', tint: 'rgba(150,205,150,.5)', back: 'rgba(48,74,52,.4)', note: '콩팥 모양 공변세포 한 쌍 사이에 기공이 있습니다' },
    para: { name: '짚신벌레', mm: 0.2, wide: 0.09, kind: 'para', tint: 'rgba(200,220,225,.5)', back: 'rgba(46,66,74,.35)', note: '물속을 헤엄쳐 다니는 한 세포짜리 생물' },
};
// The field number belongs to the eyepiece: a stronger eyepiece also shows less.
const EYEPIECES = { 10: { fn: 18 }, 15: { fn: 12 } };
const OBJECTIVES = [4, 10, 40];

const state = {
    spec: 'onion', eye: 10, obj: 4,
    prediction: null, checked: false,
    running: false, focus: 1, phase: 0,
};

const $ = id => document.getElementById(id);
const svgNS = 'http://www.w3.org/2000/svg';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = (v, d) => v.toFixed(d).replace('-', '−');

function power(eye, obj) { return eye * obj; }
function fieldMm(eye, obj) { return EYEPIECES[eye].fn / obj; }
// Objective-dependent shading only; real brightness also depends on illumination.
function brightness(eye, obj) { return ({4:1,10:0.8,40:0.6})[obj]; } // Illustrative shading, not a photometric law.

function share(spec, eye, obj) { return SPECIMENS[spec].mm / fieldMm(eye, obj); }
function verdictFor(spec, eye, obj) {
    const r = share(spec, eye, obj);
    return r >= 0.06 ? 'p1' : (r >= 0.02 ? 'p2' : 'p3');
}

function analyse() {
    const s = SPECIMENS[state.spec];
    const mag = power(state.eye, state.obj);
    const field = fieldMm(state.eye, state.obj);
    return {
        spec: s, mag, field, share: share(state.spec, state.eye, state.obj),
        across: field / s.mm, apparent: s.mm * mag,
        bright: brightness(state.eye, state.obj),
        overflows: s.mm > field,
        verdict: verdictFor(state.spec, state.eye, state.obj),
    };
}

function el(tag, attrs, text) {
    const n = document.createElementNS(svgNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text !== undefined) n.textContent = text;
    return n;
}

const FIELD = { cx: 342, cy: 106, r: 76 };

function drawScope(g) {
    const a = analyse();

    g.appendChild(el('rect', { x: 44, y: 178, width: 116, height: 12, rx: 4, class: 'scope-body' }));
    g.appendChild(el('rect', { x: 132, y: 40, width: 16, height: 140, rx: 5, class: 'scope-body' }));
    g.appendChild(el('rect', { x: 82, y: 26, width: 22, height: 30, rx: 6, class: 'scope-tube' }));
    g.appendChild(el('rect', { x: 86, y: 20, width: 14, height: 10, rx: 3, class: 'lens-barrel on' }));
    g.appendChild(el('text', { x: 108, y: 28, class: 'tiny-label' }, `접안렌즈 ${state.eye}배`));
    g.appendChild(el('rect', { x: 88, y: 54, width: 46, height: 42, rx: 6, class: 'scope-tube' }));

    // The three objectives on their turret; the one in use swings under the
    // tube. Their labels share one line, because staggering them by barrel
    // length ran the numbers into each other.
    OBJECTIVES.forEach((o, i) => {
        const on = o === state.obj;
        const slot = (i - OBJECTIVES.indexOf(state.obj) + 4) % 3;
        const bx = 74 + slot * 20, len = 12 + i * 7;
        g.appendChild(el('rect', { x: bx, y: 96, width: 15, height: len, rx: 3, 'data-objective': o, class: `lens-barrel${on ? ' on' : ''}` }));
        g.appendChild(el('text', { x: bx + 7.5, y: 131, 'text-anchor': 'middle', class: 'tiny-label', style: on ? 'fill:#059669' : '' }, String(o)));
    });
    g.appendChild(el('text', { x: 66, y: 131, 'text-anchor': 'end', class: 'tiny-label' }, '대물'));

    g.appendChild(el('rect', { x: 52, y: 142, width: 96, height: 7, rx: 2, class: 'stage-plate' }));
    g.appendChild(el('rect', { x: 72, y: 138, width: 42, height: 5, rx: 1, class: 'slide-glass' }));
    g.appendChild(el('text', { x: 48, y: 148, 'text-anchor': 'end', class: 'tiny-label' }, '재물대'));

    // The focus knob turns while the run is finding focus.
    const kx = 152, ky = 160;
    const turn = state.running ? state.focus * 900 : 0;
    g.appendChild(el('circle', { cx: kx, cy: ky, r: 12, class: 'knob' }));
    g.appendChild(el('line', {
        x1: kx, y1: ky, x2: kx + Math.cos(turn * Math.PI / 180) * 9, y2: ky + Math.sin(turn * Math.PI / 180) * 9,
        class: 'knob-mark',
    }));
    g.appendChild(el('text', { x: kx + 16, y: ky + 3, class: 'tiny-label' }, '조절 나사'));

    g.appendChild(el('path', { d: 'M 88 190 q 12 -12 24 0', class: 'mirror' }));
    for (let i = 0; i < 3; i += 1) {
        g.appendChild(el('line', { x1: 92 + i * 8, y1: 186, x2: 92 + i * 8, y2: 149, class: 'light-ray' }));
    }

    g.appendChild(el('text', { x: 20, y: 22, class: 'small-label' }, '배율'));
    g.appendChild(el('text', { x: 20, y: 44, class: 'big-read' }, `${a.mag}배`));
    g.appendChild(el('text', { x: 20, y: 62, class: 'tiny-label' }, `${state.eye} × ${state.obj}`));
}

function drawField(g) {
    const a = analyse();
    const s = a.spec;
    const blur = state.running ? (1 - state.focus) * 7 : 0;
    $('blurNode').setAttribute('stdDeviation', fmt(blur, 2));

    g.appendChild(el('circle', { cx: FIELD.cx, cy: FIELD.cy, r: FIELD.r, class: 'field-back', style: `fill:${s.back}` }));

    const holder = el('g', { 'clip-path': 'url(#fieldClip)', filter: 'url(#blurFilter)' });
    const pxPerMm = (FIELD.r * 2) / a.field;
    const w = s.mm * pxPerMm, h = s.wide * pxPerMm;

    // Below a couple of pixels the cells are not separable — which is what a
    // real eyepiece shows too — so the field is an even wash rather than
    // thousands of specks nobody could tell apart.
    if (w < 2.5) {
        holder.appendChild(el('circle', { cx: FIELD.cx, cy: FIELD.cy, r: FIELD.r, style: `fill:${s.tint};opacity:.5` }));
        g.appendChild(holder);
        g.appendChild(el('circle', { cx: FIELD.cx, cy: FIELD.cy, r: FIELD.r, class: 'field-rim' }));
        g.appendChild(el('text', { x: FIELD.cx, y: FIELD.cy, 'text-anchor': 'middle', class: 'warn-text' }, '하나하나 구별되지 않습니다'));
        drawScaleAndLabels(g, a, pxPerMm);
        return;
    }

    if (s.kind === 'brick') {
        const cols = Math.ceil((FIELD.r * 2) / w) + 2, rows = Math.ceil((FIELD.r * 2) / h) + 2;
        for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) {
            const x = FIELD.cx - FIELD.r + c * w + (r % 2 ? w / 2 : 0) - w / 2;
            const y = FIELD.cy - FIELD.r + r * h - h / 2;
            holder.appendChild(el('rect', { x, y, width: w * 0.96, height: h * 0.9, rx: Math.min(4, w * 0.1), class: 'cell-wall', style: `fill:${s.tint}` }));
            if (w > 26 && h > 12) holder.appendChild(el('ellipse', { cx: x + w * 0.5, cy: y + h * 0.45, rx: Math.min(7, w * 0.11), ry: Math.min(6, h * 0.22), class: 'cell-nucleus', style: 'fill:rgba(90,70,120,.65)' }));
        }
    } else if (s.kind === 'blob') {
        const step = w * 1.6;
        const n = Math.ceil((FIELD.r * 2) / step) + 2;
        for (let r = 0; r < n; r += 1) for (let c = 0; c < n; c += 1) {
            const jx = ((r * 7 + c * 13) % 11) / 11 - 0.5, jy = ((r * 5 + c * 17) % 13) / 13 - 0.5;
            const x = FIELD.cx - FIELD.r + (c + jx * 0.6) * step, y = FIELD.cy - FIELD.r + (r + jy * 0.6) * step;
            holder.appendChild(el('ellipse', { cx: x, cy: y, rx: w * 0.5, ry: w * 0.42, class: 'cell-wall', style: `fill:${s.tint}` }));
            if (w > 22) holder.appendChild(el('circle', { cx: x, cy: y, r: Math.min(7, w * 0.16), class: 'cell-nucleus', style: 'fill:rgba(120,70,110,.7)' }));
        }
    } else if (s.kind === 'stoma') {
        const step = w * 3.2;
        const n = Math.ceil((FIELD.r * 2) / step) + 2;
        for (let r = 0; r < n; r += 1) for (let c = 0; c < n; c += 1) {
            const x = FIELD.cx - FIELD.r + (c + ((r % 2) ? 0.5 : 0)) * step, y = FIELD.cy - FIELD.r + r * step;
            const pair = el('g', { transform: `translate(${x} ${y}) scale(${w})`, 'data-specimen': 'stoma' });
            pair.appendChild(el('ellipse', { cx: 0, cy: 0, rx: .12, ry: .31, class: 'pore' }));
            for (const side of [-1, 1]) {
                const cell = el('g', { transform: `scale(${side} 1)` });
                cell.appendChild(el('path', { d: 'M0 -.47 C-.62 -.58 -.7 .56 0 .47 C-.30 .26 -.30 -.26 0 -.47Z', class: 'guard-cell', style: `fill:${s.tint};stroke-width:.055` }));
                if (w > 8) for (const [cx, cy] of [[-.24,-.32],[-.36,-.1],[-.36,.14],[-.24,.33]]) cell.appendChild(el('circle', {cx,cy,r:.045,fill:'#3e743f',class:'chloroplast'}));
                pair.appendChild(cell);
            }
            holder.appendChild(pair);
        }
    } else {
        const step = w * 1.5;
        const n = Math.ceil((FIELD.r * 2) / step) + 2;
        for (let r = 0; r < n; r += 1) for (let c = 0; c < n; c += 1) {
            const drift = Math.sin(state.phase * 0.8 + r * 2 + c) * Math.min(6, w * 0.08);
            const x = FIELD.cx - FIELD.r + c * step + drift, y = FIELD.cy - FIELD.r + r * step;
            const rot = ((r * 31 + c * 47) % 90) - 45;
            holder.appendChild(el('ellipse', {
                cx: x, cy: y, rx: w * 0.48, ry: h * 0.5, class: 'para-body', style: `fill:${s.tint}`,
                transform: `rotate(${rot} ${fmt(x, 1)} ${fmt(y, 1)})`,
            }));
        }
    }
    g.appendChild(holder);
    g.appendChild(el('circle', { cx: FIELD.cx, cy: FIELD.cy, r: FIELD.r, class: 'field-rim' }));
    drawScaleAndLabels(g, a, pxPerMm);
}

function drawScaleAndLabels(g, a, pxPerMm) {
    // A scale bar, so the size on screen can be read back as a real length.
    const barMm = a.field / 4;
    const barPx = barMm * pxPerMm;
    g.appendChild(el('line', { x1: FIELD.cx - barPx / 2, y1: FIELD.cy + FIELD.r - 12, x2: FIELD.cx + barPx / 2, y2: FIELD.cy + FIELD.r - 12, class: 'scale-bar' }));
    g.appendChild(el('text', { x: FIELD.cx, y: FIELD.cy + FIELD.r - 17, 'text-anchor': 'middle', class: 'tiny-label', style: 'fill:#d97706' },
        barMm >= 1 ? `${fmt(barMm, 2)} mm` : `${Math.round(barMm * 1000)} μm`));

    g.appendChild(el('text', { x: 444, y: 22, 'text-anchor': 'end', class: 'small-label' }, a.spec.name));
    g.appendChild(el('text', { x: 444, y: 206, 'text-anchor': 'end', class: 'read-text' },
        a.field >= 1 ? `보이는 너비 ${fmt(a.field, 2)} mm` : `보이는 너비 ${Math.round(a.field * 1000)} μm`));
    if (state.running && state.focus < 0.98) {
        g.appendChild(el('text', { x: FIELD.cx, y: 22, 'text-anchor': 'middle', class: 'warn-text' }, '초점을 맞추는 중'));
    }
}

function drawGraph(g) {
    const a = analyse();
    const x0 = 54, x1 = 440, yTop = 30, yBot = 146;
    const combos = [];
    [10, 15].forEach(e => OBJECTIVES.forEach(o => combos.push({ e, o })));
    const top = Math.max(...combos.map(c => fieldMm(c.e, c.o))) * 1.2;
    const Y = f => yBot - (f / top) * (yBot - yTop);
    const slot = (x1 - x0) / combos.length;

    for (let i = 0; i <= 4; i += 1) {
        const f = top * i / 4;
        g.appendChild(el('line', { x1: x0, y1: Y(f), x2: x1, y2: Y(f), class: 'grid-line' }));
        if (i > 0) g.appendChild(el('text', { x: x0 - 6, y: Y(f) + 3.5, 'text-anchor': 'end', class: 'axis-text' }, `${fmt(f, 1)}`));
    }
    g.appendChild(el('line', { x1: x0, y1: yBot, x2: x1, y2: yBot, class: 'axis' }));
    g.appendChild(el('line', { x1: x0, y1: yTop, x2: x0, y2: yBot, class: 'axis' }));

    combos.forEach((c, i) => {
        const cx = x0 + slot * (i + 0.5);
        const f = fieldMm(c.e, c.o), mag = power(c.e, c.o);
        const on = c.e === state.eye && c.o === state.obj;
        const bw = Math.min(44, slot * 0.6);
        g.appendChild(el('rect', {
            x: cx - bw / 2, y: Y(f), width: bw, height: yBot - Y(f), rx: 3, class: 'bar',
            style: `fill:${on ? 'rgba(84,230,193,.65)' : 'rgba(127,212,240,.32)'}`,
        }));
        g.appendChild(el('text', { x: cx, y: Y(f) - 5, 'text-anchor': 'middle', class: 'bar-text', style: `fill:${on ? '#059669' : '#475569'}` },
            `${Math.round(f / SPECIMENS[state.spec].mm)}개`));
        g.appendChild(el('text', { x: cx, y: yBot + 14, 'text-anchor': 'middle', class: 'axis-text', style: on ? 'fill:#059669' : '' }, `${mag}배`));
    });

    g.appendChild(el('text', { x: (x0 + x1) / 2, y: 172, 'text-anchor': 'middle', class: 'legend-text figure-caption', style: 'fill:#475569' },
        `막대 위의 숫자는 ${a.spec.name}가 가로로 몇 개 들어가는지입니다`));
    g.appendChild(el('text', { x: (x0 + x1) / 2, y: 191, 'text-anchor': 'middle', class: 'axis-title' }, '배율 — 세로는 한눈에 보이는 너비 (mm)'));
}

function render() {
    const m = $('mainGroup'), gr = $('graphGroup');
    m.textContent = ''; gr.textContent = '';
    drawScope(m); drawField(m); drawGraph(gr);
    updateReadout();
}

const WORDS = { p1: '잘 보인다', p2: '겨우 보인다', p3: '너무 작아 안 보인다' };

function updateReadout() {
    const a = analyse();
    $('stageBadge').textContent = `${a.spec.name} · ${a.mag}배`;
    $('valueA').textContent = `${a.mag}배`;
    $('valueB').textContent = a.field >= 1 ? `${fmt(a.field, 2)} mm` : `${Math.round(a.field * 1000)} μm`;
    const rows = [
        ['배율 계산', `접안 ${state.eye} × 대물 ${state.obj} = ${a.mag}배`, false],
        ['모형의 세포 크기', `${fmt(a.spec.mm, 2)} mm · ${Math.round(a.spec.mm * 1000)} μm`, false],
        ['배율로 환산한 길이', `${fmt(a.apparent, 1)} mm`, false],
        ['가로로 몇 개', a.overflows ? '한 개도 다 안 들어옵니다' : `${fmt(a.across, a.across < 10 ? 1 : 0)}개`, false],
        ['이 세포의 특징', a.spec.note, false],
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

    let s = `접안 ${state.eye}배 × 대물 ${state.obj}배 = ${a.mag}배입니다. `;
    s += `한눈에 보이는 너비는 ${a.field >= 1 ? `${fmt(a.field, 2)} mm` : `${Math.round(a.field * 1000)} μm`}입니다. `;
    s += '배율을 높이면 표본은 커 보이고 관찰 범위는 좁아집니다. 낮은 배율로 먼저 찾은 뒤 배율을 높입니다. ';
    s += a.spec.note + '.';
    $('elementaryExplanation').textContent = s;
}

// --- animation --------------------------------------------------------------
function tick(dt) {
    state.phase += dt;
    if (!state.running) return false;
    state.focus = Math.min(1, state.focus + dt / 3);
    if (state.focus >= 1) {
        state.running = false;
        $('runBtn').textContent = '초점 맞추기';
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

document.querySelectorAll('[data-spec]').forEach(b => b.addEventListener('click', () => {
    state.spec = b.dataset.spec; markSelected('[data-spec]', 'spec', state.spec); render();
}));
document.querySelectorAll('[data-eye]').forEach(b => b.addEventListener('click', () => {
    state.eye = Number(b.dataset.eye); markSelected('[data-eye]', 'eye', state.eye); render();
}));
document.querySelectorAll('[data-obj]').forEach(b => b.addEventListener('click', () => {
    state.obj = Number(b.dataset.obj); markSelected('[data-obj]', 'obj', state.obj); render();
}));
document.querySelectorAll('[data-prediction]').forEach(b => b.addEventListener('click', () => {
    state.prediction = b.dataset.prediction; state.checked = false; window.scienceInvalidatePrediction?.(); markSelected('[data-prediction]', 'prediction', state.prediction);
}));
$('runBtn').addEventListener('click', () => {
    if (state.running) { state.running = false; state.focus = 1; $('runBtn').textContent = '초점 맞추기'; return; }
    state.focus = 0; state.running = true; state.checked = true;
    $('runBtn').textContent = '멈추기';
    render();
});
$('resetBtn').addEventListener('click', () => {
    state.spec = 'onion'; state.eye = 10; state.obj = 4;
    state.prediction = null; state.checked = false; state.running = false; state.focus = 1;
    $('runBtn').textContent = '초점 맞추기';
    document.querySelectorAll('[data-prediction]').forEach(x => x.classList.remove('selected'));
    $('resultEmpty').hidden = false; $('resultContent').hidden = true;
    markSelected('[data-spec]', 'spec', 'onion'); markSelected('[data-eye]', 'eye', 10); markSelected('[data-obj]', 'obj', 4);
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

markSelected('[data-spec]', 'spec', state.spec);
markSelected('[data-eye]', 'eye', state.eye);
markSelected('[data-obj]', 'obj', state.obj);
render();
requestAnimationFrame(frame);

window.__scopeModel = {
    state, analyse, tick, render, power, fieldMm, brightness, share, verdictFor,
    SPECIMENS, EYEPIECES, OBJECTIVES,
    setSpec(v) { document.querySelector(`[data-spec="${v}"]`).click(); },
    setEye(v) { document.querySelector(`[data-eye="${v}"]`).click(); },
    setObj(v) { document.querySelector(`[data-obj="${v}"]`).click(); },
    check() { state.checked = true; explain(analyse()); },
    runToEnd(dt = 1 / 30) {
        $('runBtn').click();
        let steps = 0;
        while (state.running && steps < 20000) { tick(dt); steps += 1; }
        render();
        return { steps, focus: state.focus };
    },
};
