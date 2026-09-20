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
    prediction: null, checked: false,
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
    return z <= c.lcl ? c.T0 - GD * z : c.tLcl - GM * (z - c.lcl);
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

function verdict() { return state.lapse < GM ? 'p1' : (state.lapse < GD ? 'p2' : 'p3'); }

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

function drawRidge(g) {
    const a = analyse();
    const peakY = zToY(a.H);
    const upX = y => LEFT_X + (BASE - y) * ((PEAK_X - LEFT_X) / (BASE - peakY));
    const downX = y => RIGHT_X - (BASE - y) * ((RIGHT_X - PEAK_X) / (BASE - peakY));

    g.appendChild(el('rect', { x: 0, y: BASE, width: 460, height: 214 - BASE, class: 'ground' }));
    g.appendChild(el('polygon', { points: `${LEFT_X},${BASE} ${PEAK_X},${peakY} ${RIGHT_X},${BASE}`, class: 'ridge' }));

    if (a.cloudy) {
        const yLcl = zToY(a.lcl);
        g.appendChild(el('line', { x1: 30, y1: yLcl, x2: 430, y2: yLcl, class: 'lcl-line' }));
        // A high condensation level puts this label into the readout column at
        // the top left, so it is only written on the canvas when the line sits
        // clear of it. The height is in the result box and the table regardless.
        if (yLcl > 108) {
            g.appendChild(el('text', { x: 34, y: yLcl - 5, class: 'tiny-label', style: 'fill:#0284c7' },
                `상승 응결 고도 ${Math.round(a.lcl * 1000)} m`));
        }
        // Cloud hugs the windward slope from the condensation level to the top.
        const steps = 7;
        for (let i = 0; i <= steps; i += 1) {
            const y = yLcl - (yLcl - peakY) * (i / steps);
            const x = upX(y);
            const r = 9 + Math.sin(state.phase * 0.9 + i) * 1.6;
            g.appendChild(el('circle', { cx: x + 6, cy: y - 9, r, class: 'cloud-puff' }));
            g.appendChild(el('circle', { cx: x + 20, cy: y - 14, r: r * 0.8, class: 'cloud-puff' }));
        }
        for (let i = 0; i < 7; i += 1) {
            const p = ((state.phase * 0.7) + i / 7) % 1;
            const y0 = yLcl - (yLcl - peakY) * (i / 7);
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
    g.appendChild(el('text', { x: 446, y: 60, 'text-anchor': 'end', class: a.warming > 0.05 ? 'warm-text' : 'read-text' }, `${fmt(a.tLee, 1)} ℃`));
    g.appendChild(el('text', { x: 446, y: 76, 'text-anchor': 'end', class: 'tiny-label' }, `이슬점 ${fmt(a.tdLee, 1)} ℃`));
    g.appendChild(el('text', { x: 446, y: 90, 'text-anchor': 'end', class: 'tiny-label' }, `습도 ${Math.round(a.rhLee)}%`));

    g.appendChild(el('text', { x: PEAK_X, y: peakY - 26, 'text-anchor': 'middle', class: 'small-label' }, `산꼭대기 ${state.height} m`));
    g.appendChild(el('text', { x: PEAK_X, y: peakY - 12, 'text-anchor': 'middle', class: 'read-text' }, `${fmt(a.tSummit, 1)} ℃`));

    g.appendChild(el('text', { x: 230, y: 208, 'text-anchor': 'middle', class: 'note-text' },
        a.cloudy
            ? `비를 ${fmt(a.rain, 2)} g/kg 버리고 넘어 ${fmt(a.warming, 1)} ℃ 더 따뜻해졌습니다`
            : '구름이 생기지 않아 기온이 그대로 돌아왔습니다'));

    // The parcel goes on last and takes precedence: it is the thing moving, so
    // a fixed label it happens to cross steps aside rather than the other way.
    if (!state.running) return;
    const statics = [...g.querySelectorAll('text')];
    const p = state.progress;
    const descending = p > 0.5;
    const z = descending ? a.H * (1 - (p - 0.5) * 2) : a.H * (p * 2);
    const y = zToY(z);
    const x = descending ? downX(y) : upX(y);
    const st = parcelAt(z, descending);
    g.appendChild(el('circle', { cx: x, cy: y - 22, r: 11, class: 'parcel' }));
    const hot = el('text', { x, y: y - 19, 'text-anchor': 'middle', class: 'tiny-label', style: 'fill:#2a2410;font-weight:900' }, `${fmt(st.t, 0)}°`);
    g.appendChild(hot);
    const caption = el('text', { x: clamp(x, 60, 400), y: y - 38, 'text-anchor': 'middle', class: 'small-label' },
        st.sat ? '구름 속 · 습윤 단열' : '맑음 · 건조 단열');
    g.appendChild(caption);

    const hits = (m, n) => {
        const r1 = m.getBBox(), r2 = n.getBBox();
        return Math.min(r1.x + r1.width, r2.x + r2.width) - Math.max(r1.x, r2.x) > 1
            && Math.min(r1.y + r1.height, r2.y + r2.height) - Math.max(r1.y, r2.y) > 1;
    };
    statics.forEach(s => { if (hits(s, hot)) s.remove(); });
    if (hits(caption, hot) || statics.some(s => s.isConnected && hits(caption, s))) caption.remove();
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

    // Wherever the lifted parcel is warmer than its surroundings it is buoyant.
    let band = '', hasBand = false;
    for (let i = 0; i <= 160; i += 1) {
        const z = (i / 160) * Z_TOP;
        if (liftedAt(z) > envAt(z)) { hasBand = true; break; }
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
    const lclZ = Math.min(a.lcl, Z_TOP);
    for (let i = 0; i <= 80; i += 1) {
        const z = (i / 80) * lclZ;
        dry += `${i ? 'L' : 'M'} ${fmt(X(a.T0 - GD * z), 2)} ${fmt(Y(z), 2)} `;
        dew += `${i ? 'L' : 'M'} ${fmt(X(a.Td0 - GDEW * z), 2)} ${fmt(Y(z), 2)} `;
    }
    if (a.lcl < Z_TOP) {
        for (let i = 0; i <= 80; i += 1) {
            const z = a.lcl + (i / 80) * (Z_TOP - a.lcl);
            moist += `${i ? 'L' : 'M'} ${fmt(X(liftedAt(z)), 2)} ${fmt(Y(z), 2)} `;
        }
    }
    g.appendChild(el('path', { d: env, class: 'env-line' }));
    g.appendChild(el('path', { d: dew, class: 'dew-line' }));
    g.appendChild(el('path', { d: dry, class: 'dry-line' }));
    if (moist) g.appendChild(el('path', { d: moist, class: 'moist-line' }));

    // When the parcel is already buoyant the moment it saturates, the two
    // levels are the same level and get one label between them.
    const merged = a.lfc !== null && state.lapse < GD && Math.abs(a.lfc - a.lcl) < 0.06;
    const placed = [];
    if (a.lcl < Z_TOP) {
        g.appendChild(el('circle', { cx: X(a.tLcl), cy: Y(a.lcl), r: 4.2, class: 'trace-dot', style: 'fill:#0284c7' }));
        const t = el('text', {
            x: X(a.tLcl) - 6, y: Y(a.lcl) - 6, 'text-anchor': 'end', class: 'axis-text',
            style: `fill:${merged ? '#ff8a8a' : '#0284c7'}`,
        }, merged ? '응결 = 자유 대류' : '응결');
        g.appendChild(t); placed.push(t);
    }
    if (a.H <= Z_TOP) {
        g.appendChild(el('line', { x1: x0, y1: Y(a.H), x2: x1, y2: Y(a.H), class: 'mark-line' }));
        const t = el('text', { x: x1 - 2, y: Y(a.H) - 5, 'text-anchor': 'end', class: 'axis-text' }, `산꼭대기 ${state.height} m`);
        g.appendChild(t); placed.push(t);
    }
    // Under absolute instability the parcel is buoyant from the ground up, so
    // there is no level at which it becomes free — marking one would be wrong.
    if (a.lfc !== null && a.lfc <= Z_TOP && state.lapse < GD && !merged) {
        const lx = X(liftedAt(a.lfc)), ly = Y(a.lfc);
        g.appendChild(el('circle', { cx: lx, cy: ly, r: 4.2, class: 'trace-dot', style: 'fill:#ff8a8a' }));
        // The dot always shows. The label is placed, measured against the
        // labels already on the diagram, and taken away again if it does not
        // fit — its height is spelled out in the table either way.
        const right = lx < x1 - 90;
        const t = el('text', {
            x: lx + (right ? 6 : -6), y: ly + 4, 'text-anchor': right ? 'start' : 'end',
            class: 'axis-text', style: 'fill:#ff8a8a',
        }, '자유 대류 고도');
        g.appendChild(t);
        const hits = (p, q) => {
            const r1 = p.getBBox(), r2 = q.getBBox();
            return Math.min(r1.x + r1.width, r2.x + r2.width) - Math.max(r1.x, r2.x) > 1
                && Math.min(r1.y + r1.height, r2.y + r2.height) - Math.max(r1.y, r2.y) > 1;
        };
        if (placed.some(p => hits(t, p))) t.remove();
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
    const m = $('mainGroup'), gr = $('graphGroup');
    m.textContent = ''; gr.textContent = '';
    drawRidge(m); drawGraph(gr);
    updateReadout();
}

const WORDS = { p1: '절대 안정', p2: '조건부 불안정', p3: '절대 불안정' };

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
        ['자유 대류 고도', state.lapse >= GD ? '지표부터 이미 떠오름'
            : (a.lfc === null ? '4 km 안에는 없음' : `${Math.round(a.lfc * 1000)} m`), false],
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

    let s = `지표 기온 ${fmt(a.T0, 1)} ℃에 습도가 ${Math.round(a.rh0)}%이므로 이슬점은 ${fmt(a.Td0, 1)} ℃이고, 둘의 차이는 ${fmt(a.T0 - a.Td0, 1)} ℃입니다. `;
    s += `올라가는 공기는 9.8 ℃/km로 식고 이슬점은 1.8 ℃/km로 낮아지니 그 차이가 1 km마다 8 ℃씩 좁혀져, ${Math.round(a.lcl * 1000)} m에서 둘이 만나 구름이 생기기 시작합니다. `;

    if (a.cloudy) {
        s += `산이 ${state.height} m이므로 공기는 ${Math.round(a.lcl * 1000)} m까지 건조 단열로 ${fmt(a.T0 - a.tLcl, 1)} ℃ 식고, 그 위로는 응결열을 받아 습윤 단열로 ${fmt(a.tLcl - a.tSummit, 1)} ℃만 더 식어 꼭대기에서 ${fmt(a.tSummit, 1)} ℃가 됩니다. `;
        s += `이 동안 수증기 ${fmt(a.rain, 2)} g/kg이 비가 되어 떨어졌습니다. `;
        s += `내려올 때는 물기를 버렸으니 처음부터 끝까지 건조 단열로 데워져, ${state.height} m를 내려오며 ${fmt(GD * a.H, 1)} ℃가 올라 ${fmt(a.tLee, 1)} ℃로 도착합니다. `;
        s += `결국 오를 때 덜 식고 내릴 때 다 데워진 만큼인 (9.8 − 5.0) × ${fmt(a.H - a.lcl, 2)} km = ${fmt(a.warming, 1)} ℃가 고스란히 남습니다. 습도는 ${Math.round(a.rh0)}%에서 ${Math.round(a.rhLee)}%로 떨어졌고, 이것이 푄 현상입니다. `;
    } else {
        s += `그런데 산이 ${state.height} m밖에 되지 않아 공기가 응결 고도까지 올라가지 못합니다. 구름도 비도 없이 그냥 넘어갑니다. `;
        s += `오를 때도 내릴 때도 똑같이 9.8 ℃/km이고 오른 높이와 내린 높이가 같으므로, 기온은 정확히 ${fmt(a.tLee, 1)} ℃로 제자리에 돌아옵니다. 푄 현상은 비를 버려야만 일어난다는 뜻입니다. `;
    }

    s += `한편 주위 공기의 기온은 1 km마다 ${fmt(state.lapse, 1)} ℃씩 낮아지고 있습니다. `;
    if (v === 'p1') {
        s += `이 값은 습윤 단열 감률 5.0보다도 작습니다. 구름이 생기든 안 생기든 올라간 공기는 주위보다 차가워져 다시 가라앉으므로, 어떤 공기도 스스로 오르지 못하는 절대 안정 상태입니다.`;
    } else if (v === 'p2') {
        s += `이 값은 습윤 단열 감률 5.0과 건조 단열 감률 9.8 사이에 있습니다. 마른 공기는 올라가도 주위보다 차가워져 제자리로 돌아오지만, 일단 구름이 생겨 습윤 단열로 바뀌면 주위보다 따뜻해져 스스로 오를 수 있습니다. 그래서 조건부 불안정이라고 합니다`;
        s += a.lfc !== null ? `. 실제로 ${Math.round(a.lfc * 1000)} m를 넘어서면 공기가 주위보다 따뜻해져 스스로 솟구칩니다.` : `. 다만 지금 조건에서는 4 km 안에서 주위보다 따뜻해지는 높이가 없어 아직 스스로 오르지는 못합니다.`;
    } else {
        s += `이 값은 건조 단열 감률 9.8보다도 큽니다. 마른 공기조차 올라가면 주위보다 따뜻해져 계속 솟구치므로 절대 불안정입니다. 이때는 지표에서부터 이미 떠오르고 있어 따로 자유 대류 고도를 따질 것이 없고, 이런 날에는 적란운이 크게 발달합니다.`;
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
        $('runBtn').textContent = '산 너머로 보내기';
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

document.querySelectorAll('[data-height]').forEach(b => b.addEventListener('click', () => {
    state.height = Number(b.dataset.height); markSelected('[data-height]', 'height', state.height); render();
}));
document.querySelectorAll('[data-rh]').forEach(b => b.addEventListener('click', () => {
    state.rh = Number(b.dataset.rh); markSelected('[data-rh]', 'rh', state.rh); render();
}));
document.querySelectorAll('[data-prediction]').forEach(b => b.addEventListener('click', () => {
    state.prediction = b.dataset.prediction; state.checked = false; window.scienceInvalidatePrediction?.(); markSelected('[data-prediction]', 'prediction', state.prediction);
}));
$('tempRange').addEventListener('input', e => {
    state.temp = Number(e.target.value);
    $('tempOutput').textContent = `${state.temp} ℃`;
    render();
});
$('lapseRange').addEventListener('input', e => {
    state.lapse = Number(e.target.value);
    $('lapseOutput').textContent = `${fmt(state.lapse, 1)} ℃/km`;
    render();
});
$('runBtn').addEventListener('click', () => {
    if (state.running) { state.running = false; $('runBtn').textContent = '산 너머로 보내기'; return; }
    state.progress = 0; state.running = true; state.checked = true;
    $('runBtn').textContent = '멈추기';
    render();
});
$('resetBtn').addEventListener('click', () => {
    state.height = 2000; state.rh = 60; state.temp = 20; state.lapse = 6.5;
    state.prediction = null; state.checked = false; state.running = false; state.progress = 0;
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
requestAnimationFrame(frame);

window.__airModel = {
    state, analyse, tick, render, crossing, parcelAt, envAt, liftedAt, freeConvection,
    esat, dewFrom, rhFrom, mixing, pressAt, GD, GM, GDEW, Z_TOP,
    setHeight(v) { document.querySelector(`[data-height="${v}"]`).click(); },
    setRh(v) { document.querySelector(`[data-rh="${v}"]`).click(); },
    setTemp(v) { const r = $('tempRange'); r.value = String(v); r.dispatchEvent(new Event('input')); },
    setLapse(v) { const r = $('lapseRange'); r.value = String(v); r.dispatchEvent(new Event('input')); },
    check() { state.checked = true; explain(analyse()); },
    runToEnd(dt = 1 / 30) {
        $('runBtn').click();
        let steps = 0;
        while (state.running && steps < 20000) { tick(dt); steps += 1; }
        render();
        return { steps, progress: state.progress };
    },
};
