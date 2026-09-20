'use strict';

/* Everything here comes off the Coriolis parameter f = 2Ω sin φ. The inertial
   period is 2π/f, which is half a sidereal day divided by sin φ — 11.97 hours,
   not 12, because Ω is the sidereal rotation rate. Wind stress over ρf gives
   the Ekman transport, and the Ekman spiral puts the surface 45° off the wind
   while the whole layer adds up to exactly 90°. The subtropical gyre then
   falls out of where those transports meet. */

const OMEGA = 7.292e-5;   // rad/s, sidereal
const RHO_A = 1.22, RHO_W = 1025, CD = 1.3e-3, G = 9.8;
const AZ = 1e-2;          // m²/s, eddy viscosity in the surface layer
// Half a sidereal day: the inertial period at 90°, and the numerator of the
// 반일진자 rule. A solar day would give 12 h and be wrong by four minutes.
const HALF_DAY_H = Math.PI / OMEGA / 3600;

const state = {
    hemi: 'N', lat: 35, wind: 10,
    prediction: null, checked: false,
    running: false, t: 0, phase: 0,
};

const $ = id => document.getElementById(id);
const svgNS = 'http://www.w3.org/2000/svg';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = (v, d) => v.toFixed(d).replace('-', '−');
const rad = d => d * Math.PI / 180;

function coriolis(lat) { return 2 * OMEGA * Math.sin(rad(lat)); }
function stress(u) { return RHO_A * CD * u * u; }
function inertialHours(lat) { return 2 * Math.PI / coriolis(lat) / 3600; }

// Which belt this latitude sits in, and the compass bearing the wind blows
// toward. Bearings are measured clockwise from north.
function belt(lat, hemi) {
    const north = hemi === 'N';
    if (lat < 30) return { name: '무역풍대', wind: '무역풍', bearing: north ? 225 : 315, from: north ? '북동쪽' : '남동쪽' };
    if (lat < 60) return { name: '편서풍대', wind: '편서풍', bearing: north ? 45 : 135, from: north ? '남서쪽' : '북서쪽' };
    return { name: '극동풍대', wind: '극동풍', bearing: north ? 225 : 315, from: north ? '북동쪽' : '남동쪽' };
}

function analyse(lat = state.lat, hemi = state.hemi, wind = state.wind) {
    const f = coriolis(lat);
    const tau = stress(wind);
    const b = belt(lat, hemi);
    const turn = hemi === 'N' ? 1 : -1;
    const transport = tau / (RHO_W * f);              // m²/s, per metre of front
    const depth = Math.PI * Math.sqrt(2 * AZ / f);    // m
    const surf = tau / (RHO_W * Math.sqrt(AZ * f));   // m/s
    const surfBearing = (b.bearing + turn * 45 + 360) % 360;
    const netBearing = (b.bearing + turn * 90 + 360) % 360;
    // Poleward is north in the northern hemisphere and south in the southern.
    const poleward = turn * transport * Math.cos(rad(netBearing));
    const hours = inertialHours(lat);
    return {
        lat, hemi, wind, f, tau, belt: b, turn, transport, depth, surf,
        surfBearing, netBearing, poleward, hours,
        radius: surf / f,
        verdict: hours < 23 ? 'p1' : (hours <= 25 ? 'p2' : 'p3'),
    };
}

function el(tag, attrs, text) {
    const n = document.createElementNS(svgNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text !== undefined) n.textContent = text;
    return n;
}
// Bearing 0 points up the screen and increases clockwise.
const dx = b => Math.sin(rad(b));
const dy = b => -Math.cos(rad(b));

function arrow(g, cx, cy, bearing, len, cls, headCls, width) {
    const ex = cx + dx(bearing) * len, ey = cy + dy(bearing) * len;
    g.appendChild(el('line', { x1: cx, y1: cy, x2: ex, y2: ey, class: cls, style: width ? `stroke-width:${width}` : '' }));
    const a = rad(bearing);
    const back = 9, wide = 5;
    const bx = ex - Math.sin(a) * back, by = ey + Math.cos(a) * back;
    const px = Math.cos(a) * wide, py = Math.sin(a) * wide;
    g.appendChild(el('polygon', { points: `${fmt(ex, 1)},${fmt(ey, 1)} ${fmt(bx + px, 1)},${fmt(by + py, 1)} ${fmt(bx - px, 1)},${fmt(by - py, 1)}`, class: headCls }));
}

const SEA = { cx: 116, cy: 116, r: 70 };
const HODO = { cx: 344, cy: 114, r: 60 };

function drawSea(g) {
    const a = analyse();

    g.appendChild(el('circle', { cx: SEA.cx, cy: SEA.cy, r: SEA.r, class: 'sea-disc' }));
    g.appendChild(el('line', { x1: SEA.cx, y1: SEA.cy - SEA.r, x2: SEA.cx, y2: SEA.cy + SEA.r, class: 'compass-line' }));
    g.appendChild(el('line', { x1: SEA.cx - SEA.r, y1: SEA.cy, x2: SEA.cx + SEA.r, y2: SEA.cy, class: 'compass-line' }));
    g.appendChild(el('text', { x: SEA.cx, y: SEA.cy - SEA.r - 5, 'text-anchor': 'middle', class: 'tiny-label' }, '북'));
    g.appendChild(el('text', { x: SEA.cx + SEA.r + 4, y: SEA.cy + 3, class: 'tiny-label' }, '동'));

    arrow(g, SEA.cx, SEA.cy, a.belt.bearing, 60, 'wind-arrow', 'wind-head');
    arrow(g, SEA.cx, SEA.cy, a.surfBearing, 44, 'surf-arrow', 'surf-head');
    arrow(g, SEA.cx, SEA.cy, a.netBearing, 68, 'net-arrow', 'net-head');

    // A parcel let go with the surface current curves round an inertial circle.
    if (state.running) {
        const turn = a.turn;
        const r = 26;
        const centre = { x: SEA.cx + dx(a.surfBearing + turn * 90) * r, y: SEA.cy + dy(a.surfBearing + turn * 90) * r };
        const start = (a.surfBearing - turn * 90 + 360) % 360;
        let d = '';
        const span = Math.min(1, state.t) * 360;
        for (let k = 0; k <= 90; k += 1) {
            const ang = start + turn * (span * k / 90);
            const px = centre.x + dx(ang) * r, py = centre.y + dy(ang) * r;
            d += `${k ? 'L' : 'M'} ${fmt(px, 1)} ${fmt(py, 1)} `;
        }
        g.appendChild(el('path', { d, class: 'inertial-path' }));
        const ang = start + turn * span;
        g.appendChild(el('circle', { cx: centre.x + dx(ang) * r, cy: centre.y + dy(ang) * r, r: 5, class: 'parcel-dot' }));
        g.appendChild(el('text', { x: 14, y: 30, class: 'note-text' },
            `한 바퀴 ${fmt(a.hours, 1)}시간`));
    }

    g.appendChild(el('text', { x: 14, y: 16, class: 'small-label' }, `${a.belt.wind} · ${a.belt.from}에서 붑니다`));
    g.appendChild(el('text', { x: 14, y: 202, class: 'tiny-label', style: 'fill:#d97706' }, '바람'));
    g.appendChild(el('text', { x: 62, y: 202, class: 'tiny-label', style: 'fill:#0284c7' }, '표층 45°'));
    g.appendChild(el('text', { x: 130, y: 202, class: 'tiny-label', style: 'fill:#059669' }, '전체 수송 90°'));

    // The spiral, seen from above: each arrow is the current at one depth.
    g.appendChild(el('circle', { cx: HODO.cx, cy: HODO.cy, r: HODO.r, class: 'sea-disc' }));
    g.appendChild(el('text', { x: HODO.cx, y: HODO.cy - HODO.r - 6, 'text-anchor': 'middle', class: 'small-label' }, '깊이별 해류 (위에서 본 것)'));
    const layers = 9;
    for (let i = 0; i < layers; i += 1) {
        const frac = i / (layers - 1);
        const scale = Math.exp(-Math.PI * frac);
        const bearing = (a.surfBearing + a.turn * 180 * frac + 360) % 360;
        const len = HODO.r * 0.92 * scale;
        const tint = `hsl(${196 - frac * 40}, 70%, ${72 - frac * 26}%)`;
        if (len > 4) {
            arrow(g, HODO.cx, HODO.cy, bearing, len, 'spiral-arrow', 'spiral-head', 2.2);
            const last = g.lastElementChild, line = last.previousElementSibling;
            line.setAttribute('style', `stroke:${tint};stroke-width:2.2`);
            last.setAttribute('style', `fill:${tint}`);
        }
    }
    g.appendChild(el('text', { x: HODO.cx - HODO.r, y: HODO.cy + HODO.r + 14, class: 'tiny-label' }, '표층'));
    g.appendChild(el('text', { x: HODO.cx + HODO.r, y: HODO.cy + HODO.r + 36, 'text-anchor': 'end', class: 'tiny-label figure-caption' },
        `${Math.round(a.depth)} m에서 반대 방향`));

    g.appendChild(el('text', { x: 446, y: 22, 'text-anchor': 'end', class: 'read-text' }, `${a.lat}°${a.hemi === 'N' ? 'N' : 'S'}`));
    g.appendChild(el('text', { x: 446, y: 202, 'text-anchor': 'end', class: 'note-text' },
        `수송 ${fmt(a.transport, 2)} m²/s · 표층 ${fmt(a.surf * 100, 1)} cm/s`));
}

const LAT_LO = 5, LAT_HI = 75;

function drawGraph(g) {
    const a = analyse();
    const x0 = 54, x1 = 440, yTop = 26, yBot = 146;
    let peak = 0;
    for (let L = LAT_LO; L <= LAT_HI; L += 0.5) peak = Math.max(peak, Math.abs(analyse(L, state.hemi, state.wind).poleward));
    const top = peak * 1.15;
    const X = L => x0 + ((L - LAT_LO) / (LAT_HI - LAT_LO)) * (x1 - x0);
    const Y = v => yBot - ((v + top) / (2 * top)) * (yBot - yTop);

    [['belt-trade', LAT_LO, 30], ['belt-west', 30, 60], ['belt-polar', 60, LAT_HI]].forEach(([cls, lo, hi]) => {
        g.appendChild(el('rect', { x: X(lo), y: yTop, width: X(hi) - X(lo), height: yBot - yTop, class: `belt-band ${cls}` }));
    });
    g.appendChild(el('line', { x1: x0, y1: yBot, x2: x1, y2: yBot, class: 'axis' }));
    g.appendChild(el('line', { x1: x0, y1: yTop, x2: x0, y2: yBot, class: 'axis' }));
    for (let L = 10; L <= LAT_HI; L += 10) {
        g.appendChild(el('line', { x1: X(L), y1: yBot, x2: X(L), y2: yBot + 4, class: 'axis' }));
        g.appendChild(el('text', { x: X(L), y: yBot + 15, 'text-anchor': 'middle', class: 'axis-text' }, `${L}°`));
    }
    g.appendChild(el('line', { x1: x0, y1: Y(0), x2: x1, y2: Y(0), class: 'zero-line' }));
    g.appendChild(el('text', { x: x0 + 4, y: Y(0) - 5, class: 'axis-text' }, '극 쪽으로 ↑'));
    g.appendChild(el('text', { x: x0 + 4, y: Y(0) + 13, class: 'axis-text' }, '적도 쪽으로 ↓'));

    let d = '';
    for (let L = LAT_LO; L <= LAT_HI; L += 0.5) {
        const p = analyse(L, state.hemi, state.wind).poleward;
        d += `${d ? 'L' : 'M'} ${fmt(X(L), 2)} ${fmt(Y(p), 2)} `;
    }
    g.appendChild(el('path', { d, class: 'transport-line' }));

    [[30, '물이 쌓임'], [60, '물이 갈라짐']].forEach(([L, label]) => {
        g.appendChild(el('line', { x1: X(L), y1: yTop, x2: X(L), y2: yBot, class: 'mark-line' }));
        g.appendChild(el('text', { x: X(L), y: yTop - 4, 'text-anchor': 'middle', class: 'axis-text' }, `${L}° ${label}`));
    });
    g.appendChild(el('circle', { cx: X(a.lat), cy: Y(a.poleward), r: 5, class: 'trace-dot', style: 'fill:#059669' }));

    g.appendChild(el('text', { x: x0 + 4, y: 175.5, class: 'legend-text', style: 'fill:#d97706' }, '무역풍대'));
    g.appendChild(el('text', { x: x0 + 66, y: 175.5, class: 'legend-text', style: 'fill:#0284c7' }, '편서풍대'));
    g.appendChild(el('text', { x: x0 + 128, y: 175.5, class: 'legend-text', style: 'fill:#beaaeb' }, '극동풍대'));
    g.appendChild(el('text', { x: x1 - 2, y: 175.5, 'text-anchor': 'end', class: 'legend-text', style: 'fill:#475569' }, `풍속 ${state.wind} m/s일 때`));
    g.appendChild(el('text', { x: (x0 + x1) / 2, y: 191, 'text-anchor': 'middle', class: 'axis-title' }, '위도 — 세로는 에크만 수송의 남북 성분 (m²/s)'));
}

function render() {
    const m = $('mainGroup'), gr = $('graphGroup');
    m.textContent = ''; gr.textContent = '';
    drawSea(m); drawGraph(gr);
    updateReadout();
}

const WORDS = { p1: '하루보다 짧다', p2: '하루쯤', p3: '하루보다 길다' };

function updateReadout() {
    const a = analyse();
    $('stageBadge').textContent = `${a.lat}°${a.hemi} · ${a.belt.wind} · ${a.wind} m/s`;
    $('valueA').textContent = `${fmt(a.f * 1e4, 2)} × 10⁻⁴ /s`;
    $('valueB').textContent = `${fmt(a.hours, 1)}시간`;
    const rows = [
        ['이 위도의 바람대', `${a.belt.name} · ${a.belt.from}에서 붐`, false],
        ['바람이 미는 힘', `${fmt(a.tau, 3)} N/m²`, false],
        ['에크만 수송', `${fmt(a.transport, 2)} m²/s · ${a.poleward > 0 ? '극 쪽' : '적도 쪽'}`, a.poleward > 0],
        ['표층 해류', `${fmt(a.surf * 100, 1)} cm/s · 바람의 ${a.turn > 0 ? '오른' : '왼'}쪽 45°`, false],
        ['에크만 깊이', `${Math.round(a.depth)} m에서 표층과 반대 방향`, false],
        ['관성 원의 반지름', `${fmt(a.radius / 1000, 2)} km`, false],
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

    const side = a.turn > 0 ? '오른' : '왼';
    let s = `위도 ${a.lat}°에서 전향 매개 변수는 2 × 지구 자전 각속도 × sin ${a.lat}° = ${fmt(a.f * 1e4, 2)} × 10⁻⁴ /s입니다. `;
    s += `물덩이를 놓으면 이 값 때문에 ${side}쪽으로 휘어 원을 그리는데, 한 바퀴 도는 데 걸리는 시간은 2π를 이 값으로 나눈 ${fmt(a.hours, 1)}시간입니다. `;
    s += `이 값은 ${fmt(HALF_DAY_H, 2)}시간을 sin ${a.lat}°로 나눈 것과 정확히 같습니다. ${fmt(HALF_DAY_H, 2)}시간은 지구가 별을 기준으로 한 바퀴 도는 시간의 절반이라, 하루의 절반인 12시간보다 4분쯤 짧습니다. 그래서 위도 30°에서도 딱 24시간이 아니라 ${fmt(inertialHours(30), 1)}시간이 되고, 위도가 낮을수록 급격히 길어집니다. `;

    s += `여기는 ${a.belt.name}라 바람이 ${a.belt.from}에서 붑니다. ${a.wind} m/s로 불면 바닷물을 ${fmt(a.tau, 3)} N/m²의 힘으로 끌고, 표층은 바람의 ${side}쪽 45°인 ${fmt(a.surf * 100, 1)} cm/s로 흐릅니다. `;
    s += `깊이 들어갈수록 조금씩 더 휘어 ${Math.round(a.depth)} m에서는 표층과 정반대가 되고, 이 층들을 모두 더한 수송은 바람의 ${side}쪽 정확히 90° 방향으로 ${fmt(a.transport, 2)} m²/s입니다. `;

    if (a.lat < 30) {
        s += `무역풍대의 이 수송은 극 쪽을 향합니다. 한편 위도 30°를 넘으면 편서풍이 반대쪽으로 밀기 때문에, 두 흐름이 30° 부근에서 마주쳐 물이 쌓입니다. 그렇게 볼록해진 해수면이 아열대 환류를 돌립니다.`;
    } else if (a.lat < 60) {
        s += `편서풍대의 이 수송은 적도 쪽을 향합니다. 위도 30° 아래의 무역풍이 밀어 올린 물과 여기서 마주쳐 30° 부근에 물이 쌓이고, 위도 60° 쪽으로는 극동풍이 반대로 밀어내 물이 갈라지며 아래에서 찬물이 솟아오릅니다.`;
    } else {
        s += `극동풍대의 이 수송은 다시 극 쪽을 향합니다. 위도 60° 부근에서는 편서풍이 적도 쪽으로, 극동풍이 극 쪽으로 서로 반대로 밀어내므로 표층이 갈라지고, 그 빈자리를 메우러 깊은 곳의 찬물이 솟아오릅니다.`;
    }
    if (a.lat <= 10) {
        s += ` 다만 적도에 가까울수록 전향 매개 변수가 0에 가까워져 수송이 걷잡을 수 없이 커집니다. 이것은 계산이 커지는 것일 뿐 실제로 그렇게 흐른다는 뜻이 아니고, 적도 부근에서는 에크만 이론을 그대로 쓸 수 없다는 신호입니다.`;
    }
    $('elementaryExplanation').textContent = s;
}

// --- animation --------------------------------------------------------------
function tick(dt) {
    state.phase += dt;
    if (!state.running) return false;
    state.t = Math.min(1, state.t + dt / 8);
    if (state.t >= 1) {
        state.running = false;
        $('runBtn').textContent = '물덩이 놓아 보기';
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

document.querySelectorAll('[data-hemi]').forEach(b => b.addEventListener('click', () => {
    state.hemi = b.dataset.hemi; markSelected('[data-hemi]', 'hemi', state.hemi);
    $('latOutput').textContent = `${state.lat}°${state.hemi}`;
    render();
}));
document.querySelectorAll('[data-prediction]').forEach(b => b.addEventListener('click', () => {
    state.prediction = b.dataset.prediction; state.checked = false; window.scienceInvalidatePrediction?.(); markSelected('[data-prediction]', 'prediction', state.prediction);
}));
$('latRange').addEventListener('input', e => {
    state.lat = Number(e.target.value);
    $('latOutput').textContent = `${state.lat}°${state.hemi}`;
    render();
});
$('windRange').addEventListener('input', e => {
    state.wind = Number(e.target.value);
    $('windOutput').textContent = `${state.wind} m/s`;
    render();
});
$('runBtn').addEventListener('click', () => {
    if (state.running) { state.running = false; $('runBtn').textContent = '물덩이 놓아 보기'; return; }
    state.t = 0; state.running = true; state.checked = true;
    $('runBtn').textContent = '멈추기';
    render();
});
$('resetBtn').addEventListener('click', () => {
    state.hemi = 'N'; state.lat = 35; state.wind = 10;
    state.prediction = null; state.checked = false; state.running = false; state.t = 0;
    $('latRange').value = '35'; $('latOutput').textContent = '35°N';
    $('windRange').value = '10'; $('windOutput').textContent = '10 m/s';
    $('runBtn').textContent = '물덩이 놓아 보기';
    document.querySelectorAll('[data-prediction]').forEach(x => x.classList.remove('selected'));
    $('resultEmpty').hidden = false; $('resultContent').hidden = true;
    markSelected('[data-hemi]', 'hemi', 'N');
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

markSelected('[data-hemi]', 'hemi', state.hemi);
render();
requestAnimationFrame(frame);

window.__oceanModel = {
    state, analyse, tick, render, coriolis, stress, inertialHours, belt,
    OMEGA, RHO_A, RHO_W, CD, AZ, HALF_DAY_H,
    setHemi(v) { document.querySelector(`[data-hemi="${v}"]`).click(); },
    setLat(v) { const r = $('latRange'); r.value = String(v); r.dispatchEvent(new Event('input')); },
    setWind(v) { const r = $('windRange'); r.value = String(v); r.dispatchEvent(new Event('input')); },
    check() { state.checked = true; explain(analyse()); },
    runToEnd(dt = 1 / 30) {
        $('runBtn').click();
        let steps = 0;
        while (state.running && steps < 20000) { tick(dt); steps += 1; }
        render();
        return { steps, t: state.t };
    },
};
