'use strict';

/* Four laws, and every number on the page comes from one of them.
   Parallax gives distance as d = 1/p. Wien puts the spectral peak at
   2.898e6/T nm. Stefan-Boltzmann gives L = 4πR²σT⁴, which in solar units is
   (R/R☉)²(T/T☉)⁴. The distance modulus m − M = 5 log(d/10) then turns the
   luminosity into the brightness we actually see. */

const T_SUN = 5772;        // K
const M_SUN = 4.83;        // absolute bolometric magnitude of the Sun
const WIEN_NM = 2.897771955e6;   // nm·K
const SIGMA = 5.670374419e-8, R_SUN_M = 6.957e8, L_SUN_W = 3.828e26;

// mv is the measured visual magnitude, kept only for comparison: everything
// this page computes is bolometric, over all wavelengths, and for very red or
// very blue stars the eye sees a good deal less than that.
const STARS = {
    sun: { name: '태양', t: 5772, r: 1, p: 206265, mv: -26.74, note: '연주시차를 잴 수 없을 만큼 가깝습니다' },
    proxima: { name: '프록시마', t: 3042, r: 0.154, p: 0.7687, mv: 11.13, note: '가장 가까운 별' },
    sirius: { name: '시리우스 A', t: 9940, r: 1.711, p: 0.3792, mv: -1.46, note: '밤하늘에서 가장 밝게 보이는 별' },
    siriusb: { name: '시리우스 B', t: 25000, r: 0.0084, p: 0.3792, mv: 8.44, note: '지구만 한 백색왜성' },
    aldebaran: { name: '알데바란', t: 3910, r: 45.1, p: 0.0489, mv: 0.86, note: '황소자리의 거성' },
    betelgeuse: { name: '베텔게우스', t: 3600, r: 764, p: 0.00546, mv: 0.42, note: '오리온자리의 초거성' },
};

const T_LO = 2000, T_HI = 40000;
const R_LO = 0.005, R_HI = 1000;

const state = {
    star: 'sun', temp: 5772, radius: 1, parallax: 206265,
    prediction: null, checked: false,
    running: false, year: 0, phase: 0,
};

const $ = id => document.getElementById(id);
const svgNS = 'http://www.w3.org/2000/svg';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = (v, d) => v.toFixed(d).replace('-', '−');
const L10 = Math.log10;

// Sliders move in equal ratios, which is the only sane way across these ranges.
const sliderToTemp = v => T_LO * Math.pow(T_HI / T_LO, v / 100);
const tempToSlider = t => 100 * L10(t / T_LO) / L10(T_HI / T_LO);
const sliderToRadius = v => R_LO * Math.pow(R_HI / R_LO, v / 100);
const radiusToSlider = r => 100 * L10(r / R_LO) / L10(R_HI / R_LO);

function luminosity(r, t) { return r * r * Math.pow(t / T_SUN, 4); }
function peakNm(t) { return WIEN_NM / t; }
function absMag(lum) { return M_SUN - 2.5 * L10(lum); }
function distancePc(p) { return 1 / p; }
function appMag(M, d) { return M + 5 * L10(d / 10); }

const CLASSES = [[30000, 'O'], [10000, 'B'], [7500, 'A'], [6000, 'F'], [5200, 'G'], [3700, 'K'], [0, 'M']];
function spectralClass(t) { return CLASSES.find(c => t >= c[0])[1]; }

function kind(r) { return r < 0.1 ? 'p3' : (r > 10 ? 'p2' : 'p1'); }

// True while the sliders still hold the catalogue values, so the measured
// magnitude is worth showing beside the computed one.
function untouched() {
    const s = STARS[state.star];
    return Math.abs(state.temp - s.t) < 0.5 && Math.abs(state.radius / s.r - 1) < 0.01;
}

// A rough blackbody colour, good enough to show that hot means blue.
function starColour(t) {
    const x = clamp((t - 2000) / 38000, 0, 1);
    const rr = Math.round(255 - 90 * Math.pow(x, 0.5));
    const gg = Math.round(160 + 80 * Math.pow(x, 0.35));
    const bb = Math.round(90 + 165 * Math.pow(x, 0.25));
    return `rgb(${clamp(rr, 0, 255)},${clamp(gg, 0, 255)},${clamp(bb, 0, 255)})`;
}

// Planck, normalised to its own peak so the shape is what shows.
function planck(nm, t) {
    const h = 6.62607015e-34, c = 2.99792458e8, k = 1.380649e-23;
    const lam = nm * 1e-9;
    return (2 * h * c * c / Math.pow(lam, 5)) / (Math.exp(h * c / (lam * k * t)) - 1);
}

function analyse() {
    const lum = luminosity(state.radius, state.temp);
    const M = absMag(lum);
    const d = distancePc(state.parallax);
    return {
        temp: state.temp, radius: state.radius, parallax: state.parallax,
        lum, M, d, m: appMag(M, d), ly: d * 3.26156,
        peak: peakNm(state.temp), cls: spectralClass(state.temp),
        colour: starColour(state.temp), verdict: kind(state.radius),
    };
}

function el(tag, attrs, text) {
    const n = document.createElementNS(svgNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text !== undefined) n.textContent = text;
    return n;
}

// --- parallax and spectrum --------------------------------------------------
const SKY = { x: 24, y: 20, w: 200, h: 74 };
const ORBIT = { cx: 124, cy: 168, rx: 62, ry: 20 };
const FAR = [[46, 38], [88, 30], [132, 52], [176, 34], [200, 66], [64, 74], [156, 78], [110, 84]];

function drawScene(g) {
    const a = analyse();
    const ang = state.running ? state.year * 2 * Math.PI : 0;
    const swing = Math.sin(ang);

    g.appendChild(el('rect', { x: SKY.x, y: SKY.y, width: SKY.w, height: SKY.h, rx: 5, class: 'sky-box' }));
    FAR.forEach(([fx, fy]) => g.appendChild(el('circle', { cx: fx, cy: fy, r: 1.6, class: 'far-star' })));
    g.appendChild(el('text', { x: SKY.x + 6, y: SKY.y + 14, class: 'tiny-label', style: 'fill:#cbd5e1' }, '먼 별들을 배경으로'));

    const nx = 124 + swing * 15, ny = 58;
    g.appendChild(el('line', { x1: 124 - 15, y1: ny + 12, x2: 124 + 15, y2: ny + 12, class: 'shift-mark' }));
    g.appendChild(el('line', { x1: 124 - 15, y1: ny + 8, x2: 124 - 15, y2: ny + 16, class: 'shift-mark' }));
    g.appendChild(el('line', { x1: 124 + 15, y1: ny + 8, x2: 124 + 15, y2: ny + 16, class: 'shift-mark' }));
    g.appendChild(el('circle', { cx: nx, cy: ny, r: 4.6, class: 'near-star', style: `fill:${a.colour}` }));

    g.appendChild(el('ellipse', { cx: ORBIT.cx, cy: ORBIT.cy, rx: ORBIT.rx, ry: ORBIT.ry, class: 'orbit' }));
    g.appendChild(el('circle', { cx: ORBIT.cx, cy: ORBIT.cy, r: 6, class: 'sun-dot' }));
    const ex = ORBIT.cx + Math.cos(ang) * ORBIT.rx, ey = ORBIT.cy + Math.sin(ang) * ORBIT.ry;
    g.appendChild(el('line', { x1: ex, y1: ey, x2: nx, y2: ny, class: 'sight-line' }));
    g.appendChild(el('circle', { cx: ex, cy: ey, r: 4, class: 'earth-dot' }));
    g.appendChild(el('text', { x: ORBIT.cx, y: ORBIT.cy + ORBIT.ry + 16, 'text-anchor': 'middle', class: 'tiny-label' },
        state.running ? `${Math.round(state.year * 12)}개월째` : '지구가 한 바퀴 도는 동안'));

    // Spectrum, with the visible band tinted in the star's own colour.
    const SP = { x: 262, y: 34, w: 186, h: 116 };
    const NM_LO = 100, NM_HI = 2000;
    const X = nm => SP.x + ((nm - NM_LO) / (NM_HI - NM_LO)) * SP.w;
    let peakVal = 0;
    for (let nm = NM_LO; nm <= NM_HI; nm += 2) peakVal = Math.max(peakVal, planck(nm, a.temp));
    const Y = v => SP.y + SP.h - (v / peakVal) * SP.h;

    g.appendChild(el('rect', { x: X(380), y: SP.y, width: X(750) - X(380), height: SP.h, class: 'visible-band', style: `fill:${a.colour};opacity:.14` }));
    g.appendChild(el('line', { x1: SP.x, y1: SP.y + SP.h, x2: SP.x + SP.w, y2: SP.y + SP.h, class: 'spec-axis' }));
    g.appendChild(el('line', { x1: SP.x, y1: SP.y, x2: SP.x, y2: SP.y + SP.h, class: 'spec-axis' }));
    let d = '';
    for (let i = 0; i <= 180; i += 1) {
        const nm = NM_LO + (i / 180) * (NM_HI - NM_LO);
        d += `${i ? 'L' : 'M'} ${fmt(X(nm), 2)} ${fmt(Y(planck(nm, a.temp)), 2)} `;
    }
    g.appendChild(el('path', { d, class: 'spec-curve', style: `stroke:${a.colour}` }));
    if (a.peak >= NM_LO && a.peak <= NM_HI) {
        g.appendChild(el('line', { x1: X(a.peak), y1: SP.y, x2: X(a.peak), y2: SP.y + SP.h, class: 'peak-line' }));
    }
    g.appendChild(el('text', { x: 262, y: 26, class: 'small-label' }, '스펙트럼'));
    g.appendChild(el('text', { x: 448, y: 26, 'text-anchor': 'end', class: 'read-text' },
        a.peak < 1e4 ? `봉우리 ${Math.round(a.peak)} nm` : '봉우리 아주 긺'));
    g.appendChild(el('text', { x: X(565), y: SP.y + SP.h + 12, 'text-anchor': 'middle', class: 'tiny-label' }, '눈에 보이는 빛'));
    g.appendChild(el('text', { x: SP.x, y: SP.y + SP.h + 24, class: 'tiny-label' }, '100 nm'));
    g.appendChild(el('text', { x: SP.x + SP.w, y: SP.y + SP.h + 24, 'text-anchor': 'end', class: 'tiny-label' }, '2000 nm'));

    g.appendChild(el('text', { x: 448, y: 206, 'text-anchor': 'end', class: 'note-text' },
        `${a.cls}형 · ${Math.round(a.temp).toLocaleString('ko-KR')} K · ${fmt(a.radius, a.radius < 1 ? 3 : 1)} R☉`));
}

// --- the HR diagram ---------------------------------------------------------
function drawGraph(g) {
    const a = analyse();
    const x0 = 54, x1 = 428, yTop = 26, yBot = 146;
    const TX_LO = 40000, TX_HI = 2200;   // hot on the left, as an HR diagram is drawn
    const LY_LO = -4.5, LY_HI = 6.2;
    const X = t => x0 + ((L10(TX_LO) - L10(clamp(t, TX_HI, TX_LO))) / (L10(TX_LO) - L10(TX_HI))) * (x1 - x0);
    const Y = l => yBot - ((clamp(L10(l), LY_LO, LY_HI) - LY_LO) / (LY_HI - LY_LO)) * (yBot - yTop);

    for (let e = -4; e <= 6; e += 2) {
        g.appendChild(el('line', { x1: x0, y1: Y(Math.pow(10, e)), x2: x1, y2: Y(Math.pow(10, e)), class: 'grid-line' }));
        g.appendChild(el('text', { x: x0 - 6, y: Y(Math.pow(10, e)) + 3.5, 'text-anchor': 'end', class: 'axis-text' }, `10${sup(e)}`));
    }
    g.appendChild(el('line', { x1: x0, y1: yBot, x2: x1, y2: yBot, class: 'axis' }));
    g.appendChild(el('line', { x1: x0, y1: yTop, x2: x0, y2: yBot, class: 'axis' }));
    [30000, 10000, 6000, 3000].forEach(t => {
        g.appendChild(el('line', { x1: X(t), y1: yBot, x2: X(t), y2: yBot + 4, class: 'axis' }));
        g.appendChild(el('text', { x: X(t), y: yBot + 15, 'text-anchor': 'middle', class: 'axis-text' }, `${t / 1000}천`));
    });

    // Lines of constant radius: log L = 2 log R + 4 log(T/T_sun).
    [[0.01, '0.01 R☉'], [1, '1 R☉'], [100, '100 R☉']].forEach(([r, label]) => {
        const a1 = luminosity(r, TX_LO), a2 = luminosity(r, TX_HI);
        g.appendChild(el('line', { x1: X(TX_LO), y1: Y(a1), x2: X(TX_HI), y2: Y(a2), class: 'radius-line' }));
        const ly = Y(a2);
        if (ly > yTop + 12 && ly < yBot - 6) g.appendChild(el('text', { x: x1 - 4, y: ly - 5, 'text-anchor': 'end', class: 'radius-text' }, label));
    });

    g.appendChild(el('rect', { x: X(5200), y: Y(3000), width: X(3200) - X(5200), height: Y(30) - Y(3000), class: 'zone zone-giant' }));
    g.appendChild(el('rect', { x: X(30000), y: Y(0.03), width: X(7000) - X(30000), height: Y(0.0005) - Y(0.03), class: 'zone zone-dwarf' }));

    const MS = [[40000, 1.2e5], [20000, 1.6e4], [10000, 60], [7500, 8], [6000, 1.5], [5200, 0.4], [4000, 0.07], [3000, 0.012], [2500, 0.003]];
    let ms = '';
    MS.forEach(([t, l], i) => { ms += `${i ? 'L' : 'M'} ${fmt(X(t), 2)} ${fmt(Y(l), 2)} `; });
    g.appendChild(el('path', { d: ms, class: 'main-seq' }));

    Object.entries(STARS).forEach(([k, s]) => {
        if (k === state.star) return;
        g.appendChild(el('circle', { cx: X(s.t), cy: Y(luminosity(s.r, s.t)), r: 3, class: 'other-dot' }));
    });
    g.appendChild(el('circle', { cx: X(a.temp), cy: Y(a.lum), r: 6, class: 'star-dot', style: `fill:${a.colour}` }));

    g.appendChild(el('text', { x: X(20000), y: yTop - 4, 'text-anchor': 'middle', class: 'legend-text', style: 'fill:#0284c7' }, '주계열'));
    g.appendChild(el('text', { x: X(4100), y: Y(3000) - 4, 'text-anchor': 'middle', class: 'legend-text', style: 'fill:#dc2626' }, '거성'));
    g.appendChild(el('text', { x: X(14000), y: Y(0.0005) + 10, 'text-anchor': 'middle', class: 'legend-text', style: 'fill:#2563eb' }, '백색왜성'));
    g.appendChild(el('text', { x: (x0 + x1) / 2, y: 175, 'text-anchor': 'middle', class: 'legend-text', style: 'fill:#475569' },
        '점선은 반지름이 같은 별들이 놓이는 자리입니다'));
    g.appendChild(el('text', { x: (x0 + x1) / 2, y: 191, 'text-anchor': 'middle', class: 'axis-title' }, '표면 온도 (K, 왼쪽이 뜨거움) — 세로는 광도 (태양 = 1)'));
}

const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
function sup(n) { return String(n).split('').map(c => SUP[c]).join(''); }

function render() {
    const m = $('mainGroup'), gr = $('graphGroup');
    m.textContent = ''; gr.textContent = '';
    drawScene(m); drawGraph(gr);
    updateReadout();
}

const WORDS = { p1: '주계열', p2: '거성', p3: '백색왜성' };

function koDistance(a) {
    if (a.d < 1e-4) return `${fmt(a.d * 206265, 2)} AU`;
    return `${fmt(a.d, a.d < 10 ? 2 : 1)} pc · ${fmt(a.ly, a.ly < 10 ? 2 : 1)} 광년`;
}

function updateReadout() {
    const a = analyse();
    const s = STARS[state.star];
    $('stageBadge').textContent = `${s.name} · ${a.cls}형 · ${Math.round(a.temp).toLocaleString('ko-KR')} K`;
    $('valueA').textContent = koDistance(a);
    $('valueB').textContent = a.lum >= 1000 || a.lum < 0.01
        ? `${a.lum.toExponential(2).replace('e+', ' × 10^').replace('e-', ' × 10^−')} L☉` : `${fmt(a.lum, 3)} L☉`;
    const rows = [
        ['연주시차', state.parallax > 1000 ? '잴 수 없음 — 너무 가까움' : `${fmt(state.parallax, 4)}″`, false],
        ['스펙트럼 봉우리', `${Math.round(a.peak).toLocaleString('ko-KR')} nm · ${a.peak < 380 ? '자외선' : (a.peak > 750 ? '적외선' : '눈에 보이는 빛')}`, a.peak >= 380 && a.peak <= 750],
        ['절대 등급 (전 파장)', `${fmt(a.M, 2)}등급`, false],
        ['겉보기 등급 (전 파장)', `${fmt(a.m, 2)}등급`, false],
        ['실제로 눈에 보이는 밝기', untouched()
            ? `${fmt(s.mv, 2)}등급 · 차이 ${fmt(Math.abs(s.mv - a.m), 2)}`
            : '값을 바꿔 만든 별이라 견줄 관측값이 없습니다', false],
        ['반지름', `${fmt(a.radius, a.radius < 1 ? 4 : 1)} R☉ · 지구의 ${fmt(a.radius * 109.2, a.radius < 0.1 ? 2 : 0)}배`, false],
        ['HR도에서의 자리', WORDS[a.verdict], false],
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

    const s = STARS[state.star];
    let out = '';
    if (state.parallax > 1000) {
        out += `${s.name}은 너무 가까워 연주시차를 재는 방법이 통하지 않습니다. 거리는 1 천문단위이고, 이 거리에서 계산한 겉보기 등급은 ${fmt(a.m, 1)}등급입니다. `;
    } else {
        out += `연주시차가 ${fmt(state.parallax, 4)}초이므로 거리는 그 역수인 ${fmt(a.d, 2)} 파섹, 곧 ${fmt(a.ly, 1)}광년입니다. `;
    }
    out += `스펙트럼의 봉우리는 ${Math.round(a.peak).toLocaleString('ko-KR')} nm에 있습니다. 봉우리 파장과 온도를 곱하면 어떤 별이든 같은 값이 나오므로, 이 봉우리만으로 표면 온도가 ${Math.round(a.temp).toLocaleString('ko-KR')} K임을 알 수 있고 분광형은 ${a.cls}형입니다. `;
    out += a.peak < 380 ? `봉우리가 눈에 보이는 빛보다 짧은 자외선 쪽에 있어 푸르게 보입니다. `
        : (a.peak > 750 ? `봉우리가 적외선 쪽에 있어 붉게 보입니다. ` : `봉우리가 눈에 보이는 빛의 한가운데에 있습니다. `);

    out += `광도는 표면적과 온도의 네제곱을 곱한 만큼이라, 반지름 ${fmt(a.radius, a.radius < 1 ? 4 : 1)}배와 온도비 ${fmt(a.temp / T_SUN, 2)}배를 넣으면 태양의 ${a.lum >= 1000 ? Math.round(a.lum).toLocaleString('ko-KR') : fmt(a.lum, a.lum < 0.01 ? 5 : 2)}배가 됩니다. `;

    if (untouched() && Math.abs(s.mv - a.m) > 0.5) {
        // Which end the eye misses is set by the temperature, not by whether
        // the peak has crossed 750 nm: a 3900 K giant peaks just inside the
        // visible band and still loses most of its light to the infrared.
        const lost = a.temp < T_SUN ? '적외선' : '자외선';
        out += `여기서 구한 등급은 모든 파장의 빛을 다 더한 값입니다. 실제로 관측한 ${s.name}의 밝기는 ${fmt(s.mv, 2)}등급이라 ${fmt(Math.abs(s.mv - a.m), 1)}등급만큼 차이가 나는데, 이 별은 빛의 상당 부분을 눈에 보이지 않는 ${lost}으로 내보내기 때문입니다. 눈은 그 몫을 보지 못합니다. `;
    }
    if (v === 'p1') {
        out += `온도에 걸맞은 광도라서 HR도의 주계열 띠 위에 놓입니다. 별의 대부분은 일생의 거의 전부를 여기서 보냅니다.`;
    } else if (v === 'p2') {
        out += `온도는 태양보다 낮은데 광도는 훨씬 큽니다. 온도만으로는 이렇게 밝을 수 없으니 남는 설명은 덩치뿐이고, 실제로 반지름이 태양의 ${fmt(a.radius, 0)}배나 됩니다. 그래서 주계열 위쪽 오른편, 거성 자리에 놓입니다.`;
    } else {
        out += `온도는 태양보다 훨씬 높은데도 광도는 오히려 작습니다. 뜨거운 만큼 단위 넓이에서는 세게 내뿜지만 반지름이 태양의 ${fmt(a.radius, 4)}배, 지구만 해서 내보낼 표면이 거의 없기 때문입니다. 그래서 HR도의 왼쪽 아래, 백색왜성 자리에 놓입니다.`;
    }
    $('elementaryExplanation').textContent = out;
}

// --- animation --------------------------------------------------------------
function tick(dt) {
    state.phase += dt;
    if (!state.running) return false;
    state.year = Math.min(1, state.year + dt / 8);
    if (state.year >= 1) {
        state.running = false;
        $('runBtn').textContent = '일 년 지켜보기';
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
function syncSliders() {
    $('tempRange').value = String(Math.round(tempToSlider(state.temp)));
    $('radiusRange').value = String(Math.round(radiusToSlider(state.radius)));
    $('tempOutput').textContent = `${Math.round(state.temp).toLocaleString('ko-KR')} K`;
    $('radiusOutput').textContent = `${fmt(state.radius, state.radius < 1 ? 3 : 1)} R☉`;
}

document.querySelectorAll('[data-star]').forEach(b => b.addEventListener('click', () => {
    const s = STARS[b.dataset.star];
    state.star = b.dataset.star; state.temp = s.t; state.radius = s.r; state.parallax = s.p;
    markSelected('[data-star]', 'star', state.star);
    syncSliders(); render();
}));
document.querySelectorAll('[data-prediction]').forEach(b => b.addEventListener('click', () => {
    state.prediction = b.dataset.prediction; state.checked = false; window.scienceInvalidatePrediction?.(); markSelected('[data-prediction]', 'prediction', state.prediction);
}));
$('tempRange').addEventListener('input', e => {
    state.temp = sliderToTemp(Number(e.target.value));
    $('tempOutput').textContent = `${Math.round(state.temp).toLocaleString('ko-KR')} K`;
    render();
});
$('radiusRange').addEventListener('input', e => {
    state.radius = sliderToRadius(Number(e.target.value));
    $('radiusOutput').textContent = `${fmt(state.radius, state.radius < 1 ? 3 : 1)} R☉`;
    render();
});
$('runBtn').addEventListener('click', () => {
    if (state.running) { state.running = false; $('runBtn').textContent = '일 년 지켜보기'; return; }
    state.year = 0; state.running = true; state.checked = true;
    $('runBtn').textContent = '멈추기';
    render();
});
$('resetBtn').addEventListener('click', () => {
    const s = STARS.sun;
    state.star = 'sun'; state.temp = s.t; state.radius = s.r; state.parallax = s.p;
    state.prediction = null; state.checked = false; state.running = false; state.year = 0;
    $('runBtn').textContent = '일 년 지켜보기';
    document.querySelectorAll('[data-prediction]').forEach(x => x.classList.remove('selected'));
    $('resultEmpty').hidden = false; $('resultContent').hidden = true;
    markSelected('[data-star]', 'star', 'sun');
    syncSliders(); render();
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

markSelected('[data-star]', 'star', state.star);
syncSliders();
render();
requestAnimationFrame(frame);

window.__starModel = {
    state, analyse, tick, render, luminosity, peakNm, absMag, distancePc, appMag,
    spectralClass, planck, sliderToTemp, sliderToRadius, tempToSlider, radiusToSlider,
    STARS, T_SUN, M_SUN, WIEN_NM, SIGMA, R_SUN_M, L_SUN_W,
    setStar(v) { document.querySelector(`[data-star="${v}"]`).click(); },
    setTemp(t) { const r = $('tempRange'); r.value = String(tempToSlider(t)); r.dispatchEvent(new Event('input')); },
    setRadius(x) { const r = $('radiusRange'); r.value = String(radiusToSlider(x)); r.dispatchEvent(new Event('input')); },
    check() { state.checked = true; explain(analyse()); },
    runToEnd(dt = 1 / 30) {
        $('runBtn').click();
        let steps = 0;
        while (state.running && steps < 20000) { tick(dt); steps += 1; }
        render();
        return { steps, year: state.year };
    },
};
