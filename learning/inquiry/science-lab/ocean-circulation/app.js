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

const num = (v, d) => v.toFixed(d);   // 좌표에는 보통 빼기표를 쓴다
const SEA = { x: 10, y: 26, w: 238, h: 190 };
const SEA_C = { x: SEA.x + 130, y: SEA.y + 94 };
const INERTIAL_R = 56;
const COL = { cx: 374, top: 64, gap: 22, rx: 72, ry: 17, layers: 7 };

// 비스듬히 내려다본 층: 동쪽 성분은 그대로, 북쪽 성분은 납작하게(안쪽으로 들어감)
const proj = (cx, cy, bearing, len) => ({ x: cx + dx(bearing) * len, y: cy + dy(bearing) * len * (COL.ry / COL.rx) });
function flatArrow(g, cx, cy, bearing, len, color, width) {
    const e = proj(cx, cy, bearing, len);
    const ang = Math.atan2(e.y - cy, e.x - cx), back = 8, wide = 4.5;
    const bx = e.x - Math.cos(ang) * back, by = e.y - Math.sin(ang) * back;
    g.appendChild(el('line', { x1: cx, y1: cy, x2: num(bx, 1), y2: num(by, 1), style: `stroke:${color};stroke-width:${width};stroke-linecap:round` }));
    g.appendChild(el('polygon', { points: `${num(e.x, 1)},${num(e.y, 1)} ${num(bx - Math.sin(ang) * wide, 1)},${num(by + Math.cos(ang) * wide, 1)} ${num(bx + Math.sin(ang) * wide, 1)},${num(by - Math.cos(ang) * wide, 1)}`, style: `fill:${color}` }));
}

function drawSea(g) {
    const a = analyse();

    /* ---- 왼쪽: 위에서 내려다본 바다와 물덩이 ---- */
    g.appendChild(el('text', { x: SEA.x, y: 17, class: 'small-label' }, '위에서 본 바다'));
    const defs = el('defs', {});
    const grad = el('linearGradient', { id: 'ocSea', x1: '0', y1: '0', x2: '0', y2: '1' });
    grad.appendChild(el('stop', { offset: '0', 'stop-color': '#5fa8d3' }));
    grad.appendChild(el('stop', { offset: '1', 'stop-color': '#3b82b8' }));
    defs.appendChild(grad);
    const clip = el('clipPath', { id: 'ocSeaClip' });
    clip.appendChild(el('rect', { x: SEA.x, y: SEA.y, width: SEA.w, height: SEA.h, rx: 8 }));
    defs.appendChild(clip);
    g.appendChild(defs);
    g.appendChild(el('rect', { x: SEA.x, y: SEA.y, width: SEA.w, height: SEA.h, rx: 8, fill: 'url(#ocSea)' }));
    const sea = el('g', { 'clip-path': 'url(#ocSeaClip)' });
    g.appendChild(sea);
    // 잔물결
    for (let j = 0; j < 8; j += 1) for (let i = 0; i < 6; i += 1) {
        const x = SEA.x + ((i * 46 + j * 19) % (SEA.w + 30)) - 14, y = SEA.y + 14 + j * 24;
        sea.appendChild(el('path', { d: `M${x},${y} q5,-3 10,0 q5,3 10,0`, class: 'sea-ripple' }));
    }
    // 바람: 바다 위를 스치는 줄무늬가 바람 방향으로 흘러간다
    const flow = (state.phase * 22) % 40;   // 한 칸(60)마다 되풀이
    for (let k = -3; k <= 3; k += 1) {
        const ox = SEA_C.x + dx(a.belt.bearing + 90) * k * 40, oy = SEA_C.y + dy(a.belt.bearing + 90) * k * 40;
        for (let m = -2; m <= 2; m += 1) {
            const s = m * 60 + flow * 1.5 - 30 + (k % 2) * 28;
            const x1 = ox + dx(a.belt.bearing) * s, y1 = oy + dy(a.belt.bearing) * s;
            sea.appendChild(el('line', { x1: num(x1, 1), y1: num(y1, 1), x2: num(x1 + dx(a.belt.bearing) * 16, 1), y2: num(y1 + dy(a.belt.bearing) * 16, 1), class: 'wind-streak' }));
        }
    }
    // 물덩이: 표층 해류 방향으로 출발해 관성 원을 그린다
    const turn = a.turn, r = INERTIAL_R;
    const start = (a.surfBearing - turn * 90 + 360) % 360;    // 원 중심에서 본 출발점의 방위
    const at = ang => ({ x: SEA_C.x + dx(ang) * r, y: SEA_C.y + dy(ang) * r });
    const span = (state.running || state.checked) ? Math.min(1, state.t) * 360 : 0;
    if (span > 0) {
        let d = '';
        for (let k = 0; k <= 120; k += 1) { const p = at(start + turn * span * k / 120); d += `${k ? 'L' : 'M'} ${num(p.x, 1)} ${num(p.y, 1)} `; }
        sea.appendChild(el('path', { d, class: 'inertial-path' }));
    }
    const s0 = at(start);
    sea.appendChild(el('circle', { cx: num(s0.x, 1), cy: num(s0.y, 1), r: 3, class: 'start-dot' }));
    const head = at(start + turn * span);
    const heading = (start + turn * span + turn * 90 + 360) % 360;   // 원을 따라가는 방향
    const blob = el('g', { transform: `translate(${num(head.x, 1)} ${num(head.y, 1)}) rotate(${num(heading, 1)})` });
    blob.appendChild(el('ellipse', { cx: 0, cy: 3, rx: 9, ry: 12, class: 'parcel-halo' }));
    blob.appendChild(el('ellipse', { cx: 0, cy: 1, rx: 6, ry: 8, class: 'parcel-dot' }));
    blob.appendChild(el('path', { d: 'M0,-14 L4,-8 L-4,-8 Z', class: 'parcel-head' }));
    sea.appendChild(blob);
    g.appendChild(el('rect', { x: SEA.x, y: SEA.y, width: SEA.w, height: SEA.h, rx: 8, fill: 'none', stroke: '#2b6d99', 'stroke-width': 1.4 }));
    // 나침반
    const nx = SEA.x + SEA.w - 20, ny = SEA.y + SEA.h - 34;
    g.appendChild(el('path', { d: `M${nx},${ny - 16} L${nx + 6},${ny} L${nx - 6},${ny} Z`, class: 'compass-needle' }));
    g.appendChild(el('text', { x: nx, y: ny + 15, 'text-anchor': 'middle', class: 'sea-chip-text' }, '북'));
    // 지난 시간
    g.appendChild(el('rect', { x: SEA.x + 8, y: SEA.y + 8, width: 112, height: 22, rx: 6, class: 'sea-chip' }));
    const hoursNow = a.hours * Math.min(1, state.t);
    g.appendChild(el('text', { x: SEA.x + 64, y: SEA.y + 24, 'text-anchor': 'middle', class: 'small-label' },
        span > 0 ? (state.t >= 1 ? `한 바퀴 ${num(a.hours, 1)}시간` : `${num(hoursNow, 1)}시간 지남`) : '물덩이 놓기 전'));
    g.appendChild(el('rect', { x: SEA.x + 8, y: SEA.y + SEA.h - 30, width: 96, height: 22, rx: 6, class: 'sea-chip' }));
    g.appendChild(el('text', { x: SEA.x + 56, y: SEA.y + SEA.h - 14, 'text-anchor': 'middle', class: 'small-label' }, `${a.belt.wind} ${a.wind} m/s`));

    /* ---- 오른쪽: 층을 비스듬히 펼친 에크만 나선 ---- */
    g.appendChild(el('text', { x: 262, y: 17, class: 'small-label' }, '깊이에 따른 해류'));
    const yOf = i => COL.top + i * COL.gap;
    // 공기층의 바람
    const airY = COL.top - 28;
    g.appendChild(el('ellipse', { cx: COL.cx, cy: airY, rx: COL.rx, ry: COL.ry * 0.8, class: 'air-plane' }));
    flatArrow(g, COL.cx, airY, a.belt.bearing, 64, '#d97706', 3);
    // 깊은 층부터 그려 위층이 아래층을 덮게 한다
    for (let i = COL.layers - 1; i >= 0; i -= 1) {
        const frac = i / (COL.layers - 1), y = yOf(i);
        g.appendChild(el('ellipse', { cx: COL.cx, cy: y, rx: COL.rx, ry: COL.ry, class: 'layer-plane', style: `fill-opacity:${num(0.5 - frac * 0.25, 2)}` }));
        // 깊은 층은 아주 약하지만, 방향이 보이도록 화살표 길이에 바닥을 둔다
        const len = Math.max(16, COL.rx * 0.86 * Math.exp(-Math.PI * frac));
        const bearing = (a.surfBearing + turn * 180 * frac + 360) % 360;
        const tint = `hsl(${200 - frac * 25}, 75%, ${40 + frac * 22}%)`;
        if (len > 5) flatArrow(g, COL.cx, y, bearing, len, tint, i === 0 ? 3 : 2.4);
        else g.appendChild(el('circle', { cx: COL.cx, cy: y, r: 2, style: `fill:${tint}` }));
    }
    flatArrow(g, COL.cx, yOf(0), a.netBearing, COL.rx * 0.95, '#059669', 3);
    // 깊이 눈금
    const sx = COL.cx - COL.rx - 12;
    g.appendChild(el('line', { x1: sx, y1: yOf(0), x2: sx, y2: yOf(COL.layers - 1), class: 'depth-axis' }));
    g.appendChild(el('text', { x: sx - 4, y: yOf(0) + 4, 'text-anchor': 'end', class: 'tiny-label' }, '0 m'));
    g.appendChild(el('text', { x: sx - 4, y: yOf(COL.layers - 1) + 4, 'text-anchor': 'end', class: 'tiny-label' }, `${Math.round(a.depth)} m`));
    // 범례
    [['바람', '#d97706', 262], ['표층 해류', '#0369a1', 312], ['전체 수송', '#059669', 386]].forEach(([t, c, x]) => {
        g.appendChild(el('text', { x, y: 236, class: 'tiny-label', style: `fill:${c}` }, t));
    });
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
    window.scienceScene.draw([$('mainGroup'), $('graphGroup')], ([m, gr]) => {
    drawSea(m); drawGraph(gr);
    });
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
    $('predictionResult').hidden = !state.prediction;

    const side = a.turn > 0 ? '오른' : '왼';
    let s = `물덩이는 ${side}쪽으로 휘어 원을 그리며, 한 바퀴에 ${fmt(a.hours, 1)}시간이 걸립니다. 이 시간은 ${fmt(HALF_DAY_H, 2)}시간(지구가 별을 기준으로 반 바퀴 도는 시간)을 sin ${a.lat}°로 나눈 값이라, 위도 30°에서는 ${fmt(inertialHours(30), 1)}시간이고 위도가 낮을수록 길어집니다.\n\n`;
    s += `${a.belt.name}의 바람이 ${a.belt.from}에서 ${a.wind} m/s로 불면 표층은 바람의 ${side}쪽 45°로 ${fmt(a.surf * 100, 1)} cm/s로 흐릅니다. 깊어질수록 더 휘어 ${Math.round(a.depth)} m에서는 표층과 반대가 되고, 층을 모두 더한 수송은 바람의 ${side}쪽 90°입니다.\n\n`;

    if (a.lat < 30) {
        s += `무역풍대의 수송은 극 쪽을 향해, 적도 쪽으로 미는 편서풍대의 물과 30° 부근에서 마주쳐 쌓입니다. 볼록해진 해수면이 아열대 환류를 돌립니다.`;
    } else if (a.lat < 60) {
        s += `편서풍대의 수송은 적도 쪽을 향해 30° 부근에 물을 쌓고, 60° 부근에서는 극동풍대와 서로 반대로 밀어 물이 갈라지며 찬물이 솟아오릅니다.`;
    } else {
        s += `극동풍대의 수송은 극 쪽을 향합니다. 60° 부근에서는 편서풍대와 서로 반대로 밀어 표층이 갈라지고, 깊은 곳의 찬물이 솟아오릅니다.`;
    }
    if (a.lat <= 10) {
        s += ` 적도 가까이에서는 전향력이 0에 가까워 계산한 수송이 지나치게 커집니다. 여기서는 에크만 이론을 그대로 쓸 수 없습니다.`;
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

let last = 0, looping = false;
function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    tick(dt);
    render();
    if (state.running) requestAnimationFrame(frame); else looping = false;
}
function startLoop() {
    if (looping) return;
    looping = true; last = performance.now();
    requestAnimationFrame(frame);
}
const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// --- wiring -----------------------------------------------------------------
function markSelected(sel, attr, value) {
    document.querySelectorAll(sel).forEach(b => b.classList.toggle('selected', b.dataset[attr] === String(value)));
}

document.querySelectorAll('[data-hemi]').forEach(b => b.addEventListener('click', () => {
    state.hemi = b.dataset.hemi; if (!state.running) state.t = 0; markSelected('[data-hemi]', 'hemi', state.hemi);
    $('latOutput').textContent = `${state.lat}°${state.hemi}`;
    render();
}));
document.querySelectorAll('[data-prediction]').forEach(b => b.addEventListener('click', () => {
    state.prediction = b.dataset.prediction; state.checked = false; window.scienceInvalidatePrediction?.(); markSelected('[data-prediction]', 'prediction', state.prediction);
}));
$('latRange').addEventListener('input', e => {
    state.lat = Number(e.target.value);
    if (!state.running) state.t = 0;
    $('latOutput').textContent = `${state.lat}°${state.hemi}`;
    render();
});
$('windRange').addEventListener('input', e => {
    state.wind = Number(e.target.value);
    if (!state.running) state.t = 0;
    $('windOutput').textContent = `${state.wind} m/s`;
    render();
});
$('runBtn').addEventListener('click', () => {
    if (state.running) { state.running = false; $('runBtn').textContent = '물덩이 놓아 보기'; return; }
    state.t = 0; state.running = true; state.checked = true;
    $('runBtn').textContent = '멈추기';
    if (reduceMotion()) { state.t = 1; state.running = false; $('runBtn').textContent = '물덩이 놓아 보기'; render(); return; }
    render();
    startLoop();
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
