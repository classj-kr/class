'use strict';

/* Three lapse rates carry the whole page. A rising parcel cools at 9.8 ℃/km
   while its dew point falls at 1.8, so the gap closes at 8 ℃ per kilometre and
   the condensation level is just (T − Td)/8. Above it the parcel follows the
   moist rate, and on the way down it is dry again — which is the entire reason
   the far side of a ridge ends up warmer and drier than the near side. */

const GD = 9.8;     // ℃/km, dry adiabatic
const GM = 5.0;     // ℃/km, moist adiabatic, taken as an average value
const GDEW = 1.8;   // ℃/km, how fast the dew point of a rising parcel falls
const Z_TOP = 4;    // km, top of the diagram

const state = {
    height: 2000, rh: 60, temp: 20, lapse: 6.5,
    prediction: null, checked: false, done: false,
    running: false, progress: 0, phase: 0,
};

const $ = id => document.getElementById(id);
const svgNS = 'http://www.w3.org/2000/svg';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = (v, d) => v.toFixed(d).replace('-', '−');

// Magnus, the standard saturation vapour pressure fit.
function esat(T) { return 6.112 * Math.exp(17.67 * T / (T + 243.5)); }
function dewFrom(T, rh) {
    const l = Math.log((rh / 100) * esat(T) / 6.112);
    return 243.5 * l / (17.67 - l);
}
function rhFrom(T, td) { return clamp(esat(td) / esat(T) * 100, 0, 100); }
function pressAt(z) { return 1013 * Math.exp(-z / 8.4); }
function mixing(T, p) { const e = esat(T); return 622 * e / (p - e); }

function crossing() {
    const T0 = state.temp, Td0 = dewFrom(T0, state.rh), H = state.height / 1000;
    const lcl = (T0 - Td0) / (GD - GDEW);
    const cloudy = lcl < H;
    const tLcl = T0 - GD * Math.min(lcl, H);
    const tSummit = cloudy ? tLcl - GM * (H - lcl) : T0 - GD * H;
    const tdSummit = cloudy ? tSummit : Td0 - GDEW * H;
    const tLee = tSummit + GD * H;
    const tdLee = tdSummit + GDEW * H;
    const rain = cloudy ? mixing(tLcl, pressAt(lcl)) - mixing(tSummit, pressAt(H)) : 0;
    return {
        T0, Td0, H, lcl, cloudy, tLcl, tSummit, tdSummit, tLee, tdLee, rain,
        warming: tLee - T0, drying: Td0 - tdLee,
        rh0: state.rh, rhSummit: cloudy ? 100 : rhFrom(tSummit, tdSummit), rhLee: rhFrom(tLee, tdLee),
    };
}

// Where the parcel is on its way over, as a function of height and direction.
function parcelAt(z, descending) {
    const c = crossing();
    if (!descending) {
        if (z <= c.lcl) return { t: c.T0 - GD * z, td: c.Td0 - GDEW * z, sat: false };
        return { t: c.tLcl - GM * (z - c.lcl), td: c.tLcl - GM * (z - c.lcl), sat: true };
    }
    const drop = c.H - z;
    return { t: c.tSummit + GD * drop, td: c.tdSummit + GDEW * drop, sat: false };
}

function envAt(z) { return state.temp - state.lapse * z; }
// The lifted parcel, unbounded by the ridge, which is what the diagram plots.
function liftedAt(z) {
    const c = crossing();
    return z <= c.lcl ? c.T0 - GD * z : c.T0 - GD * c.lcl - GM * (z - c.lcl);
}
// Level of free convection: where a saturated parcel first becomes warmer than
// its surroundings and can keep going on its own.
function freeConvection() {
    const c = crossing();
    if (c.lcl >= Z_TOP) return null;
    for (let z = c.lcl; z <= Z_TOP; z += 0.005) {
        if (liftedAt(z) > envAt(z) + 1e-9) return z;
    }
    return null;
}

function verdict() { if(Math.abs(state.lapse-GM)<1e-9||Math.abs(state.lapse-GD)<1e-9)return 'p4'; return state.lapse < GM ? 'p1' : (state.lapse < GD ? 'p2' : 'p3'); }

function analyse() {
    const c = crossing();
    return { ...c, lfc: freeConvection(), verdict: verdict() };
}

function el(tag, attrs, text) {
    const n = document.createElementNS(svgNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text !== undefined) n.textContent = text;
    return n;
}

// --- the ridge --------------------------------------------------------------
const BASE = 190, PEAK_X = 230, LEFT_X = 70, RIGHT_X = 390;
const zToY = z => BASE - (clamp(z, 0, 3) / 3) * 120;

// 공기 덩어리가 지금 어디까지 왔는지: 0~0.5 오르막, 0.5~1 내리막. 다 넘으면 1
function journey() { return state.done ? 1 : (state.running || state.progress > 0 ? state.progress : 0); }

function drawRidge(g) {
    const a = analyse();
    const peakY = zToY(a.H);
    const upX = y => LEFT_X + (BASE - y) * ((PEAK_X - LEFT_X) / (BASE - peakY));
    const downX = y => RIGHT_X - (BASE - y) * ((RIGHT_X - PEAK_X) / (BASE - peakY));
    const J = journey();
    const zNow = J <= 0.5 ? a.H * J * 2 : a.H;                 // 지금까지 올라간 높이
    const passedLcl = a.cloudy && J > 0 && zNow >= a.lcl;

    g.appendChild(el('rect', { x: 0, y: BASE, width: 460, height: 214 - BASE, class: 'ground' }));
    // 산: 바람받이 사면은 밝게, 그늘 사면은 어둡게, 높으면 꼭대기에 눈
    const bump = (t, k) => Math.sin(t * Math.PI * k) * 4;
    let up = `${LEFT_X - 14},${BASE}`, down = '';
    for (let i = 1; i <= 10; i += 1) { const t = i / 10, y = BASE - (BASE - peakY) * t; up += ` ${(upX(y) + (i < 10 ? bump(t, 3) : 0)).toFixed(1)},${(y + (i < 10 ? 3 * Math.abs(bump(t, 2)) / 4 : 0)).toFixed(1)}`; }
    for (let i = 9; i >= 0; i -= 1) { const t = i / 10, y = BASE - (BASE - peakY) * t; down += ` ${(downX(y) + bump(t, 2.5)).toFixed(1)},${(y + 2 * Math.abs(bump(t, 3)) / 4).toFixed(1)}`; }
    g.appendChild(el('polygon', { points: `${up}${down} ${RIGHT_X + 14},${BASE}`, class: 'ridge' }));
    g.appendChild(el('polygon', { points: `${PEAK_X},${peakY}${down} ${RIGHT_X + 14},${BASE} ${PEAK_X + 18},${BASE}`, class: 'ridge-shade' }));
    if (a.H >= 2.5) {
        const sy = peakY + (BASE - peakY) * 0.16;
        g.appendChild(el('polygon', { points: `${PEAK_X},${peakY} ${upX(sy).toFixed(1)},${sy.toFixed(1)} ${(upX(sy) + 10).toFixed(1)},${(sy - 3).toFixed(1)} ${(PEAK_X + 2).toFixed(1)},${(sy + 4).toFixed(1)} ${(downX(sy) - 8).toFixed(1)},${(sy - 2).toFixed(1)} ${downX(sy).toFixed(1)},${sy.toFixed(1)}`, class: 'snow' }));
    }
    [LEFT_X - 4, LEFT_X + 12, RIGHT_X - 10, RIGHT_X + 6].forEach((x, i) => {
        g.appendChild(el('polygon', { points: `${x - 6},${BASE} ${x},${BASE - 16 - (i % 2) * 4} ${x + 6},${BASE}`, class: 'tree' }));
    });

    // 응결 고도에 닿은 뒤에야 구름과 비가 생긴다: 덩어리가 지나간 높이까지만 구름이 자란다
    if (passedLcl) {
        const yLcl = zToY(a.lcl), yTopCloud = zToY(Math.min(zNow, a.H));
        g.appendChild(el('line', { x1: 30, y1: yLcl, x2: 430, y2: yLcl, class: 'lcl-line' }));
        if (yLcl > 108) {
            g.appendChild(el('text', { x: 34, y: yLcl - 5, class: 'tiny-label', style: 'fill:#0284c7' },
                `상승 응결 고도 ${Math.round(a.lcl * 1000)} m`));
        }
        const steps = 7, wob = state.running ? state.phase : 0;
        for (let i = 0; i <= steps; i += 1) {
            const y = yLcl - (yLcl - peakY) * (i / steps);
            if (y < yTopCloud - 1) break;
            const x = upX(y);
            const r = 9 + Math.sin(wob * 0.9 + i) * 1.6;
            g.appendChild(el('circle', { cx: x + 6, cy: y - 9, r, class: 'cloud-puff' }));
            g.appendChild(el('circle', { cx: x + 20, cy: y - 14, r: r * 0.8, class: 'cloud-puff' }));
        }
        for (let i = 0; i < 7; i += 1) {
            const y0 = yLcl - (yLcl - peakY) * (i / 7);
            if (y0 < yTopCloud - 1) break;
            const p = ((wob * 0.7) + i / 7) % 1;
            const x = upX(y0) + 10;
            g.appendChild(el('line', {
                x1: x, y1: y0 + p * 16, x2: x - 2, y2: y0 + p * 16 + 7,
                class: 'rain-drop', style: `opacity:${fmt(0.8 - p * 0.6, 2)}`,
            }));
        }
    }

    g.appendChild(el('text', { x: 14, y: 40, class: 'small-label' }, '바람이 불어오는 쪽'));
    g.appendChild(el('text', { x: 14, y: 60, class: 'read-text' }, `${fmt(a.T0, 1)} ℃`));
    g.appendChild(el('text', { x: 14, y: 76, class: 'tiny-label' }, `이슬점 ${fmt(a.Td0, 1)} ℃`));
    g.appendChild(el('text', { x: 14, y: 90, class: 'tiny-label' }, `습도 ${Math.round(a.rh0)}%`));

    g.appendChild(el('text', { x: 446, y: 40, 'text-anchor': 'end', class: 'small-label' }, '산을 넘은 쪽'));
    if (J >= 1) {
        g.appendChild(el('text', { x: 446, y: 60, 'text-anchor': 'end', class: a.warming > 0.05 ? 'warm-text' : 'read-text' }, `${fmt(a.tLee, 1)} ℃`));
        g.appendChild(el('text', { x: 446, y: 76, 'text-anchor': 'end', class: 'tiny-label' }, `이슬점 ${fmt(a.tdLee, 1)} ℃`));
        g.appendChild(el('text', { x: 446, y: 90, 'text-anchor': 'end', class: 'tiny-label' }, `습도 ${Math.round(a.rhLee)}%`));
    } else {
        g.appendChild(el('text', { x: 446, y: 60, 'text-anchor': 'end', class: 'read-text' }, '? ℃'));
    }

    g.appendChild(el('text', { x: PEAK_X, y: peakY - 26, 'text-anchor': 'middle', class: 'small-label' }, `산꼭대기 ${state.height} m`));
    if (J >= 0.5) g.appendChild(el('text', { x: PEAK_X, y: peakY - 12, 'text-anchor': 'middle', class: 'read-text' }, `${fmt(a.tSummit, 1)} ℃`));

    // The parcel goes on last and takes precedence: it is the thing moving, so
    // a fixed label it happens to cross steps aside rather than the other way.
    if (!state.running) return;
    const p = state.progress;
    const descending = p > 0.5;
    const z = descending ? a.H * (1 - (p - 0.5) * 2) : a.H * (p * 2);
    const y = zToY(z);
    const x = descending ? downX(y) : upX(y);
    const st = parcelAt(z, descending);
    g.appendChild(el('circle', { cx: x, cy: y - 22, r: 11, class: 'parcel' }));
    const hot = el('text', { x, y: y - 19, 'text-anchor': 'middle', class: 'tiny-label', 'data-parcel-temperature': '', style: 'fill:#2a2410;font-weight:900' }, `${fmt(st.t, 0)}°`);
    g.appendChild(hot);
    const caption = el('text', { x: 230, y: 20, 'text-anchor': 'middle', class: 'small-label' },
        st.sat ? '구름 속 · 습윤 단열' : '맑음 · 건조 단열');
    g.appendChild(caption);
}

// --- the T-z diagram --------------------------------------------------------
function drawGraph(g) {
    const a = analyse();
    const x0 = 54, x1 = 440, yTop = 26, yBot = 146;
    const T_LO = -25, T_HI = 40;
    const X = t => x0 + ((clamp(t, T_LO, T_HI) - T_LO) / (T_HI - T_LO)) * (x1 - x0);
    const Y = z => yBot - (clamp(z, 0, Z_TOP) / Z_TOP) * (yBot - yTop);

    for (let z = 0; z <= Z_TOP; z += 1) {
        g.appendChild(el('line', { x1: x0, y1: Y(z), x2: x1, y2: Y(z), class: 'grid-line' }));
        if (z > 0) g.appendChild(el('text', { x: x0 - 6, y: Y(z) + 3.5, 'text-anchor': 'end', class: 'axis-text' }, `${z} km`));
    }
    g.appendChild(el('line', { x1: x0, y1: yBot, x2: x1, y2: yBot, class: 'axis' }));
    g.appendChild(el('line', { x1: x0, y1: yTop, x2: x0, y2: yBot, class: 'axis' }));
    for (let t = T_LO; t <= T_HI; t += 10) {
        g.appendChild(el('line', { x1: X(t), y1: yBot, x2: X(t), y2: yBot + 4, class: 'axis' }));
        g.appendChild(el('text', { x: X(t), y: yBot + 15, 'text-anchor': 'middle', class: 'axis-text' }, String(t)));
    }

    const J = journey(), full = J >= 1, zCap = full ? Z_TOP : (J <= 0.5 ? a.H * J * 2 : a.H);
    // Wherever the lifted parcel is warmer than its surroundings it is buoyant.
    let band = '', hasBand = false;
    for (let i = 0; i <= 160; i += 1) {
        const z = (i / 160) * Z_TOP;
        if (full && liftedAt(z) > envAt(z)) { hasBand = true; break; }
    }
    if (hasBand) {
        for (let i = 0; i <= 160; i += 1) {
            const z = (i / 160) * Z_TOP;
            band += `${i ? 'L' : 'M'} ${fmt(X(Math.max(envAt(z), liftedAt(z))), 2)} ${fmt(Y(z), 2)} `;
        }
        for (let i = 160; i >= 0; i -= 1) {
            const z = (i / 160) * Z_TOP;
            band += `L ${fmt(X(Math.min(envAt(z), liftedAt(z))), 2)} ${fmt(Y(z), 2)} `;
        }
        g.appendChild(el('path', { d: band + 'Z', class: 'buoyant-band' }));
    }

    let env = '', dry = '', moist = '', dew = '';
    for (let i = 0; i <= 160; i += 1) {
        const z = (i / 160) * Z_TOP;
        env += `${i ? 'L' : 'M'} ${fmt(X(envAt(z)), 2)} ${fmt(Y(z), 2)} `;
    }
    const lclZ = Math.min(a.lcl, Z_TOP, zCap);
    for (let i = 0; i <= 80 && zCap > 0; i += 1) {
        const z = (i / 80) * lclZ;
        dry += `${i ? 'L' : 'M'} ${fmt(X(a.T0 - GD * z), 2)} ${fmt(Y(z), 2)} `;
        dew += `${i ? 'L' : 'M'} ${fmt(X(a.Td0 - GDEW * z), 2)} ${fmt(Y(z), 2)} `;
    }
    if (a.lcl < zCap) {
        for (let i = 0; i <= 80; i += 1) {
            const z = a.lcl + (i / 80) * (zCap - a.lcl);
            moist += `${i ? 'L' : 'M'} ${fmt(X(liftedAt(z)), 2)} ${fmt(Y(z), 2)} `;
        }
    }
    g.appendChild(el('path', { d: env, class: 'env-line' }));
    if (dew) g.appendChild(el('path', { d: dew, class: 'dew-line' }));
    if (dry) g.appendChild(el('path', { d: dry, class: 'dry-line' }));
    if (moist) g.appendChild(el('path', { d: moist, class: 'moist-line' }));

    // When the parcel is already buoyant the moment it saturates, the two
    // levels are the same level and get one label between them.
    const merged = a.lfc !== null && state.lapse < GD && Math.abs(a.lfc - a.lcl) < 0.06;
    const placed = [];
    if (a.lcl < Z_TOP && a.lcl <= zCap) {
        g.appendChild(el('circle', { cx: X(a.tLcl), cy: Y(a.lcl), r: 4.2, class: 'trace-dot', style: 'fill:#0284c7' }));
        const t = el('text', {
            x: X(a.tLcl) - 8, y: Y(a.lcl) + 16, 'text-anchor': 'end', class: 'axis-text halo',
            style: `fill:${merged ? '#ff8a8a' : '#0284c7'}`,
        }, merged ? '응결 = 자유 대류' : '응결');
        g.appendChild(t); placed.push(t);
    }
    if (a.H <= Z_TOP) {
        g.appendChild(el('line', { x1: x0, y1: Y(a.H), x2: x1, y2: Y(a.H), class: 'mark-line' }));
        const t = el('text', { x: x1 - 2, y: Y(a.H) - 5, 'text-anchor': 'end', class: 'axis-text halo' }, `산꼭대기 ${state.height} m`);
        g.appendChild(t); placed.push(t);
    }
    // Under absolute instability the parcel is buoyant from the ground up, so
    // there is no level at which it becomes free — marking one would be wrong.
    if (full && a.lfc !== null && a.lfc <= Z_TOP && state.lapse < GD && !merged) {
        const lx = X(liftedAt(a.lfc)), ly = Y(a.lfc);
        g.appendChild(el('circle', { cx: lx, cy: ly, r: 4.2, class: 'trace-dot', style: 'fill:#ff8a8a' }));
        // The dot always shows. The label is placed, measured against the
        // labels already on the diagram, and taken away again if it does not
        // fit — its height is spelled out in the table either way.
        const right = lx < x1 - 90;
        const t = el('text', {
            x: lx + (right ? 6 : -6), y: ly + 4, 'text-anchor': right ? 'start' : 'end',
            class: 'axis-text halo', 'data-convection-label': '', style: 'fill:#e05252',
        }, '자유 대류 고도');
        g.appendChild(t);
    }

    const keys = [['#0f172a', '주위 공기'], ['#d97706', '건조 단열'], ['#059669', '습윤 단열'], ['#0284c7', '이슬점']];
    let lx = x0;
    keys.forEach(([col, label]) => {
        g.appendChild(el('line', { x1: lx, y1: 172, x2: lx + 14, y2: 172, style: `stroke:${col};stroke-width:3` }));
        g.appendChild(el('text', { x: lx + 19, y: 175.5, class: 'legend-text', style: `fill:${col}` }, label));
        lx += 25 + label.length * 10.5;
    });
    g.appendChild(el('text', { x: (x0 + x1) / 2, y: 191, 'text-anchor': 'middle', class: 'axis-title' }, '기온 (℃) — 세로는 높이'));
}

function render() {
    window.scienceScene.draw([$('mainGroup'), $('graphGroup')], ([m, gr]) => {
    drawRidge(m); drawGraph(gr);
    });
    // Measure the retained, visible labels after their screen font size is set.
    // Detached construction nodes have no useful text bounds.
    const main=$('mainGroup'),graph=$('graphGroup');
    for(const g of [main,graph])window.scienceNormalizeFigure?.(g.closest('svg'),true);
    const hits=(p,q)=>{const a=window.scienceTextInkBox?.(p)||p.getBBox(),b=window.scienceTextInkBox?.(q)||q.getBBox();return Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)>1&&Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)>1;};
    const hot=main.querySelector('[data-parcel-temperature]');
    if(hot)for(const label of main.querySelectorAll('text'))if(label!==hot&&hits(label,hot))label.remove();
    const convection=graph.querySelector('[data-convection-label]');
    if(convection&&[...graph.querySelectorAll('text')].some(t=>t!==convection&&hits(t,convection)))convection.remove();
    updateReadout();
}

const WORDS = { p1: '절대 안정', p2: '조건부 불안정', p3: '절대 불안정', p4: '단열감률과 같은 경계' };

function updateReadout() {
    const a = analyse();
    $('stageBadge').textContent = `${state.temp} ℃ · 습도 ${state.rh}% · 산 ${state.height} m`;
    $('valueA').textContent = a.lcl <= Z_TOP ? `${Math.round(a.lcl * 1000)} m` : '4 km보다 높음';
    $('valueB').textContent = `${fmt(a.tLee, 1)} ℃`;
    const rows = [
        ['지표의 이슬점', `${fmt(a.Td0, 1)} ℃ · 기온과 ${fmt(a.T0 - a.Td0, 1)} ℃ 차이`, false],
        ['산꼭대기', `${fmt(a.tSummit, 1)} ℃ · 습도 ${Math.round(a.rhSummit)}%`, a.cloudy],
        ['넘은 뒤 기온 변화', a.cloudy ? `${fmt(a.warming, 1)} ℃ 올라감` : '변화 없음', a.warming > 0.05],
        ['넘은 뒤 습도 변화', `${Math.round(a.rh0)}% → ${Math.round(a.rhLee)}%`, false],
        ['버린 물의 양', a.cloudy ? `${fmt(a.rain, 2)} g/kg` : '없음', false],
        ['대기 안정도', `${WORDS[a.verdict]} · 환경 감률 ${fmt(state.lapse, 1)} ℃/km`, a.verdict !== 'p3'],
        ['자유 대류 고도', state.lapse > GD ? '지표부터 이미 떠오름'
            : (a.lfc === null ? '4 km 안에는 없음' : `${Math.round(a.lfc * 1000)} m`), false],
    ];
    $('dataNote').innerHTML = !state.done ? '' : rows.map(([n, v, m]) =>
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

    let s = `기온과 이슬점의 차이 ${fmt(a.T0 - a.Td0, 1)} ℃가 1 km마다 8 ℃씩 좁혀져 ${Math.round(a.lcl * 1000)} m에서 구름이 생기기 시작합니다. `;

    if (a.cloudy) {
        s += `그 위로는 습윤 단열로 덜 식어 꼭대기에서 ${fmt(a.tSummit, 1)} ℃가 되고, 수증기 ${fmt(a.rain, 2)} g/kg이 비로 내립니다. `;
        s += `내려올 때는 건조 단열로 데워져 ${fmt(a.tLee, 1)} ℃로 도착하므로 (9.8 − 5.0) × ${fmt(a.H - a.lcl, 2)} km = ${fmt(a.warming, 1)} ℃ 따뜻해지고, 습도는 ${Math.round(a.rh0)}%에서 ${Math.round(a.rhLee)}%로 떨어집니다. 이것이 푄 현상입니다. `;
    } else {
        s += `그런데 산이 ${state.height} m라 응결 고도에 닿지 못해 구름 없이 넘어가고, 오를 때와 내릴 때 모두 9.8 ℃/km라 기온은 ${fmt(a.tLee, 1)} ℃로 돌아옵니다. 실제 푄은 강수 없이도 나타날 수 있습니다. `;
    }

    s += `한편 주위 공기의 기온은 1 km마다 ${fmt(state.lapse, 1)} ℃씩 낮아지고 있습니다. `;
    if (v === 'p1') {
        s += `이 값은 습윤 단열 감률 5.0보다도 작습니다. 구름이 생기든 안 생기든 올라간 공기는 주위보다 차가워져 다시 가라앉으므로, 어떤 공기도 스스로 오르지 못하는 절대 안정 상태입니다.`;
    } else if (v === 'p4') {
        s += Math.abs(state.lapse-GM)<1e-9 ? '환경 감률이 습윤 단열 감률과 같습니다. 포화 공기는 중립이고 불포화 공기는 안정합니다. 이 경계를 조건부 불안정으로 판정하지 않습니다.' : '환경 감률이 건조 단열 감률과 같습니다. 불포화 공기는 중립이고 포화 공기는 불안정합니다. 절대 불안정의 경계와 구별합니다.';
    } else if (v === 'p2') {
        s += `이 값은 습윤 단열 감률 5.0과 건조 단열 감률 9.8 사이라, 마른 공기는 제자리로 돌아오지만 포화된 공기는 주위보다 따뜻해지는 높이에 이르면 스스로 오릅니다. 그래서 조건부 불안정이라고 합니다`;
        s += a.lfc !== null ? `. 실제로 ${Math.round(a.lfc * 1000)} m를 넘어서면 공기가 주위보다 따뜻해져 스스로 솟구칩니다.` : `. 다만 지금 조건에서는 4 km 안에서 주위보다 따뜻해지는 높이가 없어 아직 스스로 오르지는 못합니다.`;
    } else {
        s += `이 값은 건조 단열 감률 9.8보다도 커서 마른 공기조차 계속 솟구치는 절대 불안정입니다. 이런 날에는 적란운이 크게 발달합니다.`;
    }
    $('elementaryExplanation').textContent = s;
}

// --- animation --------------------------------------------------------------
function tick(dt) {
    state.phase += dt;
    if (!state.running) return false;
    state.progress = Math.min(1, state.progress + dt / 9);
    if (state.progress >= 1) {
        state.running = false;
        state.done = true;
        $('runBtn').textContent = '산 너머로 보내기';
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
const reduceMotion = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
// 조건을 바꾸면 새 공기 덩어리로 다시 시작한다
function invalidate() { state.done = false; state.running = false; state.progress = 0; $('runBtn').textContent = '산 너머로 보내기'; }

// --- wiring -----------------------------------------------------------------
function markSelected(sel, attr, value) {
    document.querySelectorAll(sel).forEach(b => b.classList.toggle('selected', b.dataset[attr] === String(value)));
}

document.querySelectorAll('[data-height]').forEach(b => b.addEventListener('click', () => {
    state.height = Number(b.dataset.height); invalidate(); markSelected('[data-height]', 'height', state.height); render();
}));
document.querySelectorAll('[data-rh]').forEach(b => b.addEventListener('click', () => {
    state.rh = Number(b.dataset.rh); invalidate(); markSelected('[data-rh]', 'rh', state.rh); render();
}));
document.querySelectorAll('[data-prediction]').forEach(b => b.addEventListener('click', () => {
    state.prediction = b.dataset.prediction; state.checked = false; window.scienceInvalidatePrediction?.(); markSelected('[data-prediction]', 'prediction', state.prediction);
}));
$('tempRange').addEventListener('input', e => {
    state.temp = Number(e.target.value); invalidate();
    $('tempOutput').textContent = `${state.temp} ℃`;
    render();
});
$('lapseRange').addEventListener('input', e => {
    state.lapse = Number(e.target.value); invalidate();
    $('lapseOutput').textContent = `${fmt(state.lapse, 1)} ℃/km`;
    render();
});
$('runBtn').addEventListener('click', () => {
    if (state.running) { state.running = false; $('runBtn').textContent = '산 너머로 보내기'; return; }
    state.progress = 0; state.running = true; state.checked = false; state.done = false;
    $('resultEmpty').hidden = false; $('resultContent').hidden = true;
    $('runBtn').textContent = '멈추기';
    if (reduceMotion()) { state.running = false; state.progress = 1; state.done = true; $('runBtn').textContent = '산 너머로 보내기'; render(); return; }
    render();
    startLoop();
});
$('resetBtn').addEventListener('click', () => {
    state.height = 2000; state.rh = 60; state.temp = 20; state.lapse = 6.5;
    state.prediction = null; state.checked = false; state.running = false; state.progress = 0; state.done = false;
    $('tempRange').value = '20'; $('tempOutput').textContent = '20 ℃';
    $('lapseRange').value = '6.5'; $('lapseOutput').textContent = '6.5 ℃/km';
    $('runBtn').textContent = '산 너머로 보내기';
    document.querySelectorAll('[data-prediction]').forEach(x => x.classList.remove('selected'));
    $('resultEmpty').hidden = false; $('resultContent').hidden = true;
    markSelected('[data-height]', 'height', 2000); markSelected('[data-rh]', 'rh', 60);
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

markSelected('[data-height]', 'height', state.height);
markSelected('[data-rh]', 'rh', state.rh);
render();

window.__airModel = {
    state, analyse, tick, render, crossing, parcelAt, envAt, liftedAt, freeConvection,
    esat, dewFrom, rhFrom, mixing, pressAt, GD, GM, GDEW, Z_TOP,
    setHeight(v) { document.querySelector(`[data-height="${v}"]`).click(); },
    setRh(v) { document.querySelector(`[data-rh="${v}"]`).click(); },
    setTemp(v) { const r = $('tempRange'); r.value = String(v); r.dispatchEvent(new Event('input')); },
    setLapse(v) { const r = $('lapseRange'); r.value = String(v); r.dispatchEvent(new Event('input')); },
    check() { state.checked = true; state.done = true; render(); explain(analyse()); },
    runToEnd(dt = 1 / 30) {
        $('runBtn').click();
        let steps = 0;
        while (state.running && steps < 20000) { tick(dt); steps += 1; }
        render();
        return { steps, progress: state.progress };
    },
};
