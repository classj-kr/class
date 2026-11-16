'use strict';

/* The ground warms and cools; the sea barely moves. Everything on this page
   comes from that one difference. Two half-cosines carry the land through a
   day — bottoming at sunrise, peaking at two in the afternoon rather than at
   noon — and the wind simply blows from whichever surface is cooler, which
   makes it turn round twice a day on its own. */

const T_MIN_H = 5, T_MAX_H = 14;   // when the land is coldest and hottest
const T_MEAN = 21;                 // ℃, and the sea sits here all day
const AMP = 6;                     // ℃ either side of the mean, when clear
const CALM = 0.5;                  // ℃ difference below which nothing stirs

const SKIES = {
    clear: { name: '맑음', damp: 1.0, cover: 1, puffs: 1 },
    part: { name: '구름 조금', damp: 0.6, cover: 5, puffs: 3 },
    cloud: { name: '흐림', damp: 0.3, cover: 9, puffs: 6 },
};

const state = {
    sky: 'clear', hour: 14,
    prediction: null, checked: false,
    running: false, phase: 0,
};

const $ = id => document.getElementById(id);
const svgNS = 'http://www.w3.org/2000/svg';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = (v, d) => v.toFixed(d).replace('-', '−');
// The dial moves in half hours, so 9.5 has to read as 9시 30분, not 9시.
function koHour(h) {
    const whole = Math.floor(h + 1e-9);
    return h - whole >= 0.25 ? `${whole}시 30분` : `${whole}시`;
}

function amp(sky) { return AMP * SKIES[sky].damp; }
function tMax(sky) { return T_MEAN + amp(sky); }
function tMin(sky) { return T_MEAN - amp(sky); }

// Two half-cosines meeting with zero slope at both turning points, so the day
// rises over nine hours and falls over fifteen — which is why the peak is at
// two in the afternoon and not at noon.
function landTemp(h, sky = state.sky) {
    const lo = tMin(sky), hi = tMax(sky), span = hi - lo;
    let t = ((h % 24) + 24) % 24;
    if (t >= T_MIN_H && t <= T_MAX_H) {
        return lo + span * (1 - Math.cos(Math.PI * (t - T_MIN_H) / (T_MAX_H - T_MIN_H))) / 2;
    }
    // the long fall from the afternoon peak round to the next sunrise
    if (t < T_MIN_H) t += 24;
    const fall = 24 - (T_MAX_H - T_MIN_H);
    return hi - span * (1 - Math.cos(Math.PI * (t - T_MAX_H) / fall)) / 2;
}
function seaTemp() { return T_MEAN; }

function windAt(h, sky = state.sky) {
    const d = landTemp(h, sky) - seaTemp();
    if (Math.abs(d) < CALM) return { dir: 'calm', speed: 0, diff: d };
    return { dir: d > 0 ? 'sea' : 'land', speed: Math.min(6, 0.6 * Math.abs(d)), diff: d };
}

function verdictFor(h, sky = state.sky) {
    const w = windAt(h, sky);
    return w.dir === 'sea' ? 'p1' : (w.dir === 'land' ? 'p2' : 'p3');
}

function analyse() {
    const s = SKIES[state.sky];
    const w = windAt(state.hour);
    return {
        sky: s, hour: state.hour, land: landTemp(state.hour), sea: seaTemp(),
        wind: w, hi: tMax(state.sky), lo: tMin(state.sky), range: 2 * amp(state.sky),
        daylight: state.hour >= 6 && state.hour < 19,
        verdict: verdictFor(state.hour),
    };
}

function el(tag, attrs, text) {
    const n = document.createElementNS(svgNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text !== undefined) n.textContent = text;
    return n;
}
function mix(a, b, f) {
    return `rgb(${Math.round(a[0] + (b[0] - a[0]) * f)},${Math.round(a[1] + (b[1] - a[1]) * f)},${Math.round(a[2] + (b[2] - a[2]) * f)})`;
}
const NIGHT = [12, 22, 36], DAY = [24, 58, 84];

const GROUND_Y = 150, SHORE_X = 214;

// The wind is the answer to the question, so it stays out of the picture until
// the day has been watched (or the student has run it once and moves the dial).
const windShown = () => state.checked || state.running;
// A pale night sky keeps the page light; the shared scene paints night in deep navy.
const NIGHT_SWAP = [['#172b45', '#c3d0e2'], ['#263e59', '#eef3f9'], ['#edf6ff', '#1e3a5f'], ['#71869e', '#8a9bb0'], ['#70d4ee', '#0369a1'], ['#86d8f1', '#0284c7'], ['#ffb077', '#c2410c']];
function drawShore(g) {
    const a = analyse();
    const shown = windShown();
    let svg = window.ScienceScenes.weather(shown ? a : { ...a, wind: { dir: 'calm', speed: 0, diff: a.wind.diff } }, state.phase, koHour(state.hour));
    if (!shown) svg = svg.replace('>바람 멎음<', '>바람은 어느 쪽으로?<').replace('>온도 차이가 작음<', '><');
    if (!a.daylight) NIGHT_SWAP.forEach(([from, to]) => { svg = svg.split(from).join(to); });
    g.innerHTML = svg;
}

function drawGraph(g) {
    const a = analyse();
    const x0 = 54, x1 = 440, yTop = 30, yBot = 146;
    const lo = T_MEAN - AMP - 4, hi = T_MEAN + AMP + 2;
    const X = h => x0 + (h / 24) * (x1 - x0);
    const Y = t => yBot - ((clamp(t, lo, hi) - lo) / (hi - lo)) * (yBot - yTop);

    // When each breeze blows, shaded behind the curves.
    let runStart = 0, runDir = windAt(0).dir;
    for (let h = 0; windShown() && h <= 24.001; h += 0.25) {
        const d = h > 24 ? runDir : windAt(h).dir;
        if (d !== runDir || h >= 24) {
            if (runDir !== 'calm') {
                g.appendChild(el('rect', {
                    x: X(runStart), y: yTop, width: Math.max(1, X(Math.min(h, 24)) - X(runStart)), height: yBot - yTop,
                    class: `breeze-band ${runDir === 'sea' ? 'breeze-sea' : 'breeze-land'}`,
                }));
            }
            runStart = h; runDir = d;
        }
    }

    for (let t = lo + 1; t <= hi; t += 4) {
        g.appendChild(el('line', { x1: x0, y1: Y(t), x2: x1, y2: Y(t), class: 'grid-line' }));
        g.appendChild(el('text', { x: x0 - 6, y: Y(t) + 3.5, 'text-anchor': 'end', class: 'axis-text' }, `${t}℃`));
    }
    g.appendChild(el('line', { x1: x0, y1: yBot, x2: x1, y2: yBot, class: 'axis' }));
    g.appendChild(el('line', { x1: x0, y1: yTop, x2: x0, y2: yBot, class: 'axis' }));
    for (let h = 0; h <= 24; h += 6) {
        g.appendChild(el('line', { x1: X(h), y1: yBot, x2: X(h), y2: yBot + 4, class: 'axis' }));
        g.appendChild(el('text', { x: X(h), y: yBot + 15, 'text-anchor': 'middle', class: 'axis-text' }, `${h}시`));
    }

    g.appendChild(el('line', { x1: x0, y1: Y(seaTemp()), x2: x1, y2: Y(seaTemp()), class: 'sea-line' }));
    let d = '';
    for (let i = 0; i <= 192; i += 1) {
        const h = (i / 192) * 24;
        d += `${i ? 'L' : 'M'} ${fmt(X(h), 2)} ${fmt(Y(landTemp(h)), 2)} `;
    }
    g.appendChild(el('path', { d, class: 'land-line' }));

    [[T_MAX_H, a.hi, '가장 더울 때'], [T_MIN_H, a.lo, '가장 추울 때']].forEach(([h, t, label]) => {
        g.appendChild(el('line', { x1: X(h), y1: Y(t), x2: X(h), y2: yBot, class: 'mark-line' }));
        g.appendChild(el('text', { x: X(h) + 4, y: Y(t) + (h === T_MAX_H ? -6 : 14), class: 'axis-text' }, `${h}시 ${label}`));
    });
    g.appendChild(el('circle', { cx: X(a.hour), cy: Y(a.land), r: 5, class: 'trace-dot', style: 'fill:#ea580c' }));

    g.appendChild(el('line', { x1: x0 + 4, y1: 173, x2: x0 + 19, y2: 173, style: 'stroke:#ea580c;stroke-width:3' }));
    g.appendChild(el('text', { x: x0 + 24, y: 178, class: 'legend-text', style: 'fill:#c2410c' }, '육지'));
    g.appendChild(el('line', { x1: x0 + 66, y1: 173, x2: x0 + 81, y2: 173, style: 'stroke:#0284c7;stroke-width:3;stroke-dasharray:5 3' }));
    g.appendChild(el('text', { x: x0 + 86, y: 178, class: 'legend-text', style: 'fill:#0369a1' }, '바다'));
    // the breeze key is always drawn (stable nodes) but only seen once the day has been watched
    const vis = windShown() ? 'visible' : 'hidden';
    g.appendChild(el('rect', { x: x0 + 132, y: 167, width: 14, height: 11, class: 'breeze-band breeze-sea', style: 'stroke:#0284c7;stroke-width:.8', visibility: vis }));
    g.appendChild(el('text', { x: x0 + 151, y: 178, class: 'legend-text', style: 'fill:#0e7490', visibility: vis }, '해풍'));
    g.appendChild(el('rect', { x: x0 + 220, y: 167, width: 14, height: 11, class: 'breeze-band breeze-land', style: 'stroke:#7c3aed;stroke-width:.8', visibility: vis }));
    g.appendChild(el('text', { x: x0 + 239, y: 178, class: 'legend-text', style: 'fill:#6d28d9', visibility: vis }, '육풍'));
    g.appendChild(el('text', { x: x1 - 2, y: 178, 'text-anchor': 'end', class: 'legend-text', style: 'fill:#334155' }, `일교차 ${fmt(a.range, 1)}℃`));
    g.appendChild(el('text', { x: (x0 + x1) / 2, y: 191, 'text-anchor': 'middle', class: 'axis-title' }, '하루 동안의 기온 변화'));
}

function render() {
    window.scienceScene.draw([$('mainGroup'), $('graphGroup')], ([m, gr]) => {
    drawShore(m); drawGraph(gr);
    });
    updateReadout();
}

const WORDS = { p1: '바다에서 육지로', p2: '육지에서 바다로', p3: '거의 안 분다' };

function updateReadout() {
    const a = analyse();
    $('stageBadge').textContent = `${a.sky.name} · ${koHour(a.hour)}`;
    $('valueA').textContent = `${fmt(a.land, 1)} ℃`;
    $('valueB').textContent = a.wind.dir === 'sea' ? '해풍' : (a.wind.dir === 'land' ? '육풍' : '바람 멎음');
    const rows = [
        ['바다의 기온', `${fmt(a.sea, 1)} ℃ · 하루 내내 그대로`, false],
        ['땅과 바다의 차이', `${fmt(Math.abs(a.wind.diff), 1)} ℃ · 땅이 ${a.wind.diff > 0 ? '더 더움' : '더 추움'}`, false],
        ['오늘의 가장 높은 기온', `${fmt(a.hi, 1)} ℃ · ${T_MAX_H}시`, false],
        ['오늘의 가장 낮은 기온', `${fmt(a.lo, 1)} ℃ · ${T_MIN_H}시`, false],
        ['일교차', `${fmt(a.range, 1)} ℃`, a.range >= 10],
        ['재는 방법', '백엽상 안 · 땅에서 1.5 m · 그늘', false],
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
        $('predictionResult').hidden = false;
    } else {
        $('predictionResult').textContent = '';
        $('predictionResult').className = 'prediction-result';
        $('predictionResult').hidden = true;
    }

    let s = `${koHour(a.hour)}에 땅은 ${fmt(a.land, 1)} ℃, 바다는 ${fmt(a.sea, 1)} ℃입니다. `;
    if (a.wind.dir === 'sea') s += `땅이 더 더워 땅 위 공기가 올라가고, 그 자리로 바다 공기가 밀려와 바다에서 땅으로 해풍이 붑니다. `;
    else if (a.wind.dir === 'land') s += `밤새 땅이 더 빨리 식어 이번에는 바다 위 공기가 올라가고, 땅에서 바다로 육풍이 붑니다. `;
    else s += `땅과 바다의 온도가 거의 같아 바람이 거의 멎습니다. 바람 방향이 바뀌기 직전입니다. `;
    s += state.sky === 'clear' ? `맑은 날이라 일교차가 ${fmt(a.range, 1)} ℃로 큽니다.` : `${a.sky.name}이라 구름이 이불처럼 덮어 일교차가 ${fmt(a.range, 1)} ℃로 작습니다.`;
    $('elementaryExplanation').textContent = s;
}

// --- animation --------------------------------------------------------------
function tick(dt) {
    state.phase += dt;
    if (!state.running) return false;
    state.hour = state.hour + dt * 24 / 16;
    if (state.hour >= 24) {
        state.hour = state.target ?? 24;
        state.running = false;
        $('runBtn').textContent = '하루 지켜보기';
        state.checked = true;
    }
    $('timeRange').value = String(Math.round(state.hour * 2) / 2);
    $('timeOutput').textContent = koHour(state.hour);
    return !state.running;
}

let last = 0, loopId = 0;
function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    tick(dt);
    render();
    loopId = state.running ? requestAnimationFrame(frame) : 0;
}
function startLoop() { if (!loopId) { last = performance.now(); loopId = requestAnimationFrame(frame); } }

// --- wiring -----------------------------------------------------------------
function markSelected(sel, attr, value) {
    document.querySelectorAll(sel).forEach(b => b.classList.toggle('selected', b.dataset[attr] === String(value)));
}

document.querySelectorAll('[data-sky]').forEach(b => b.addEventListener('click', () => {
    state.sky = b.dataset.sky; markSelected('[data-sky]', 'sky', state.sky); render();
}));
document.querySelectorAll('[data-prediction]').forEach(b => b.addEventListener('click', () => {
    state.prediction = b.dataset.prediction; state.checked = false; state.running = false; $('runBtn').textContent = '하루 지켜보기'; window.scienceInvalidatePrediction?.(); markSelected('[data-prediction]', 'prediction', state.prediction); render();
}));
$('timeRange').addEventListener('input', e => {
    state.hour = Number(e.target.value);
    if (state.running) state.checked = true;
    state.running = false;
    $('runBtn').textContent = '하루 지켜보기';
    $('timeOutput').textContent = koHour(state.hour);
    render();
});
$('runBtn').addEventListener('click', () => {
    if (state.running) { state.running = false; state.checked = true; $('runBtn').textContent = '하루 지켜보기'; render(); return; }
    state.target = state.hour;
    // with reduced motion the day is not played out; the result appears at once
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { state.checked = true; render(); return; }
    state.hour = 0; state.running = true; state.checked = false;
    $('resultEmpty').hidden = false; $('resultContent').hidden = true;
    $('runBtn').textContent = '멈추기';
    render(); startLoop();
});
$('resetBtn').addEventListener('click', () => {
    state.sky = 'clear'; state.hour = 14;
    state.prediction = null; state.checked = false; state.running = false;
    $('timeRange').value = '14'; $('timeOutput').textContent = '14시';
    $('runBtn').textContent = '하루 지켜보기';
    document.querySelectorAll('[data-prediction]').forEach(x => x.classList.remove('selected'));
    $('resultEmpty').hidden = false; $('resultContent').hidden = true;
    markSelected('[data-sky]', 'sky', 'clear');
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

markSelected('[data-sky]', 'sky', state.sky);
render();

window.__weatherModel = {
    state, analyse, tick, render, landTemp, seaTemp, windAt, verdictFor, amp, tMax, tMin,
    SKIES, T_MIN_H, T_MAX_H, T_MEAN, AMP, CALM,
    setSky(v) { document.querySelector(`[data-sky="${v}"]`).click(); },
    // a helper for checking the scene at any hour: it counts as having watched the day
    setHour(v) { state.checked = true; const r = $('timeRange'); r.value = String(v); r.dispatchEvent(new Event('input')); },
    check() { state.checked = true; explain(analyse()); },
    runToEnd(dt = 1 / 30) {
        $('runBtn').click();
        let steps = 0;
        while (state.running && steps < 20000) { tick(dt); steps += 1; }
        render();
        return { steps, hour: state.hour };
    },
};
