document.addEventListener('DOMContentLoaded', () => {
    const modeButtons = [...document.querySelectorAll('[data-mode]')];
    const controlArea = document.getElementById('controlArea');
    const predictionArea = document.getElementById('predictionArea');
    const predictionLegend = document.getElementById('predictionLegend');
    const methodHint = document.getElementById('methodHint');
    const checkBtn = document.getElementById('checkBtn');
    const resetBtn = document.getElementById('resetBtn');
    const resultEmpty = document.getElementById('resultEmpty');
    const resultContent = document.getElementById('resultContent');
    const labelA = document.getElementById('labelA');
    const labelB = document.getElementById('labelB');
    const valueA = document.getElementById('valueA');
    const valueB = document.getElementById('valueB');
    const predictionResult = document.getElementById('predictionResult');
    const explanation = document.getElementById('elementaryExplanation');
    const stageCaption = document.getElementById('stageCaption');
    const stageBadge = document.getElementById('stageBadge');
    const mainGroup = document.getElementById('mainGroup');
    const graphGroup = document.getElementById('graphGroup');
    const dataNote = document.getElementById('dataNote');

    const GRAPH = { x0: 62, x1: 424, y0: 152, y1: 26 };
    const RUN_SECONDS = 8;
    const G = 9.8;

    /* -------------------------------------------------------------- data */
    // A cart on a frictionless ramp, then a frictionless level run-out.
    const RAMP_M = 2.0, FLAT_M = 2.5;
    const ANGLES = [10, 20, 30];
    const FLASH = [0.1, 0.2, 0.5];

    // A frictionless hill track: down from the start slope, over a second hill
    // that is HILL2 high, then out along the level. Metres.
    const TOP = 3.2, HILL2 = 1.5, END = 7.0;
    const HEIGHTS = [1, 2, 3];
    const MASSES = [1, 2];
    const trackY = x => {
        if (x <= 2) return TOP * (1 + Math.cos(Math.PI * x / 2)) / 2;
        if (x <= 4) return HILL2 * (1 - Math.cos(Math.PI * (x - 2) / 2)) / 2;
        if (x <= 6) return 0.4 + (HILL2 - 0.4) * (1 + Math.cos(Math.PI * (x - 4) / 2)) / 2;
        return 0.4;
    };
    const trackSlope = x => (trackY(x + 1e-4) - trackY(x - 1e-4)) / 2e-4;
    // where on the first slope the ball has to be placed to start at height h
    const startX = h => (2 / Math.PI) * Math.acos(2 * h / TOP - 1);

    const state = {
        mode: 'incline',
        angle: 20, flash: 0.2,
        height: 2, mass: 1,
        progress: 0, prediction: null,
    };
    let running = false, frameId = 0, lastStamp = 0;

    /* ------------------------------------------------------------ models */
    function analyseIncline(s = state) {
        const th = s.angle * Math.PI / 180;
        const a = G * Math.sin(th);
        const tRamp = Math.sqrt(2 * RAMP_M / a);
        const vEnd = a * tRamp;
        const tFlat = FLAT_M / vEnd;
        const total = tRamp + tFlat;
        // where the cart is (metres along the track) and how fast, at time t
        const at = t => {
            if (t <= tRamp) return { s: 0.5 * a * t * t, v: a * t, onRamp: true };
            return { s: RAMP_M + vEnd * (t - tRamp), v: vEnd, onRamp: false };
        };
        const flashes = [];
        for (let t = 0; t <= total + 1e-9; t += s.flash) flashes.push({ t, ...at(t) });
        return { kind: 'incline', th, a, tRamp, vEnd, tFlat, total, at, flashes, verdict: 'widen' };
    }

    function analyseEnergy(s = state) {
        const h0 = s.height, m = s.mass;
        const eTotal = m * G * h0;
        const x0 = startX(h0);
        // march the ball along the track; speed comes from energy alone
        const DT = 0.002, T_MAX = 6;
        const path = [];
        let x = x0, dir = 1, t = 0, peakX = x0, reached = false;
        for (let i = 0; t <= T_MAX; i += 1, t += DT) {
            const y = trackY(x);
            const v = Math.sqrt(Math.max(0, 2 * G * (h0 - y)));
            if (i % 10 === 0) path.push({ t, x, y, v });
            const slope = trackSlope(x);
            let dx = dir * (v * DT) / Math.sqrt(1 + slope * slope);
            // nudge off a turning point so the ball does not stick where v = 0
            if (v < 0.02) dx = dir * 0.0015;
            const nx = x + dx;
            if (trackY(nx) > h0 + 1e-9) { dir = -dir; continue; }
            x = nx;
            if (x > peakX) peakX = x;
            if (x >= END) { reached = true; path.push({ t, x: END, y: trackY(END), v }); break; }
            if (x <= 0) { dir = 1; x = 0; }
        }
        const passes = h0 > HILL2 + 1e-9;
        const verdict = passes ? 'pass' : Math.abs(h0 - HILL2) < 1e-9 ? 'stop' : 'back';
        const duration = path[path.length - 1].t;
        const vBottom = Math.sqrt(2 * G * h0);
        return { kind: 'energy', h0, m, eTotal, x0, path, passes, verdict, duration, vBottom, peakX, reached };
    }

    const analyse = () => (state.mode === 'incline' ? analyseIncline() : analyseEnergy());

    // the drawn state at progress p
    function sampleEnergy(a, p) {
        const t = p * a.duration;
        let lo = 0, hi = a.path.length - 1;
        while (lo < hi) { const mid = (lo + hi) >> 1; if (a.path[mid].t < t) lo = mid + 1; else hi = mid; }
        const pt = a.path[Math.min(lo, a.path.length - 1)];
        const pe = a.m * G * pt.y, ke = Math.max(0, a.eTotal - pe);
        return { ...pt, pe, ke };
    }

    /* ---------------------------------------------------------- controls */
    function pickRow(legend, name, options, current, cols) {
        return `<fieldset class="pick-field"><legend>${legend}</legend>` +
            `<div class="pick-buttons cols${cols}" data-pick="${name}">` +
            options.map(o => `<button type="button" data-value="${o.value}" class="${o.value === String(current) ? 'selected' : ''}">` +
                `${o.label}${o.hint ? `<small>${o.hint}</small>` : ''}</button>`).join('') +
            `</div></fieldset>`;
    }

    function buildControls() {
        if (state.mode === 'incline') {
            controlArea.innerHTML =
                pickRow('빗면의 기울기', 'angle', ANGLES.map(d => ({ value: String(d), label: `${d}°` })), state.angle, 3) +
                pickRow('사진 찍는 간격', 'flash', FLASH.map(f => ({ value: String(f), label: `${f}초` })), state.flash, 3);
        } else {
            controlArea.innerHTML =
                pickRow('공을 놓는 높이', 'height', HEIGHTS.map(h => ({ value: String(h), label: `${h.toFixed(1)} m`, hint: h > HILL2 ? '언덕보다 높음' : '언덕보다 낮음' })), state.height, 3) +
                pickRow('공의 질량', 'mass', MASSES.map(m => ({ value: String(m), label: `${m} kg` })), state.mass, 2);
        }
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = Number(button.dataset.value);
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                settingsChanged();
            }));
        });
    }

    const PRED_INCLINE = [{ value: 'widen', label: '점점 벌어진다' }, { value: 'same', label: '간격이 같다' }, { value: 'narrow', label: '점점 좁아진다' }];
    const PRED_ENERGY = [{ value: 'pass', label: '언덕을 넘어간다' }, { value: 'stop', label: '꼭대기에서 멈춘다' }, { value: 'back', label: '되돌아온다' }];

    function buildPrediction() {
        const list = state.mode === 'incline' ? PRED_INCLINE : PRED_ENERGY;
        predictionLegend.textContent = state.mode === 'incline' ? '빗면에서 점 사이 간격은 어떻게 될까요?' : `공은 높이 ${HILL2} m 언덕을 넘을까요?`;
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction;
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    function renderIncline(a, p) {
        const t = p * a.total;
        const now = a.at(t);
        // true proportions: the drawing is scaled from the real lengths
        const horiz = RAMP_M * Math.cos(a.th) + FLAT_M;
        const ppm = 400 / horiz;
        const X0 = 30, GY = 176;                       // left edge, ground line
        const footX = X0 + RAMP_M * Math.cos(a.th) * ppm;
        const topY = GY - RAMP_M * Math.sin(a.th) * ppm;
        const pos = s => (s <= RAMP_M
            ? { x: X0 + s * Math.cos(a.th) * ppm, y: GY - (RAMP_M - s) * Math.sin(a.th) * ppm }
            : { x: footX + (s - RAMP_M) * ppm, y: GY });
        let out = '';
        out += `<path class="track-fill" d="M${X0},${topY.toFixed(1)} L${footX.toFixed(1)},${GY} L${X0},${GY} Z"/>`;
        out += `<path class="track" d="M${X0},${topY.toFixed(1)} L${footX.toFixed(1)},${GY} L${(X0 + horiz * ppm).toFixed(1)},${GY}"/>`;
        out += `<line class="ground" x1="10" y1="${GY + 1.5}" x2="450" y2="${GY + 1.5}"/>`;
        // the angle at the foot of the ramp
        const arcR = 26;
        out += `<path class="angle-arc" d="M${(footX - arcR).toFixed(1)},${GY} A${arcR},${arcR} 0 0 1 ${(footX - arcR * Math.cos(a.th)).toFixed(1)},${(GY - arcR * Math.sin(a.th)).toFixed(1)}"/>`;
        out += `<text class="angle-text" x="${(footX - arcR - 4).toFixed(1)}" y="${(GY - 6).toFixed(1)}" text-anchor="end">${state.angle}°</text>`;
        out += `<text class="small-label" x="${(footX + 8).toFixed(1)}" y="${GY + 14}">평평한 곳 ${FLAT_M} m · 마찰 없음</text>`;
        out += `<text class="small-label" x="${X0 + 46}" y="${GY - 4}">빗면 ${RAMP_M} m</text>`;

        // flashes so far, with the gap between neighbours written underneath
        const seen = a.flashes.filter(f => f.t <= t + 1e-9);
        seen.forEach((f, i) => {
            const q = pos(f.s);
            out += `<circle class="flash-dot" cx="${q.x.toFixed(1)}" cy="${(q.y - 6).toFixed(1)}" r="3.2"/>`;
            // a gap gets its length written only when there is room for the label
            if (i > 0 && f.onRamp && (f.s - seen[i - 1].s) * ppm >= 30) {
                const prev = seen[i - 1];
                const gap = f.s - prev.s;
                const mid = pos((f.s + prev.s) / 2);
                out += `<text class="flash-text" x="${(mid.x + 4).toFixed(1)}" y="${(mid.y - 14).toFixed(1)}" text-anchor="middle">${(gap * 100).toFixed(0)} cm</text>`;
            }
        });
        // gaps on the level
        const level = seen.filter(f => !f.onRamp);
        if (level.length >= 2) {
            const gap = level[1].s - level[0].s;
            const q1 = pos(level[0].s), q2 = pos(level[1].s);
            out += `<line class="gap-line" x1="${q1.x.toFixed(1)}" y1="${GY - 20}" x2="${q2.x.toFixed(1)}" y2="${GY - 20}"/>`;
            out += `<text class="gap-text" x="${((q1.x + q2.x) / 2).toFixed(1)}" y="${GY - 24}" text-anchor="middle">${(gap * 100).toFixed(0)} cm 씩 같음</text>`;
        }

        // the cart
        const c = pos(now.s);
        const ang = now.onRamp ? state.angle : 0;
        out += `<g transform="translate(${c.x.toFixed(1)} ${c.y.toFixed(1)}) rotate(${ang})">` +
            `<rect class="cart" x="-11" y="-13" width="22" height="9" rx="2"/>` +
            `<circle class="wheel" cx="-6" cy="-3" r="3"/><circle class="wheel" cx="6" cy="-3" r="3"/></g>`;

        // readouts
        out += `<text class="part-label" x="300" y="40">시간</text><text class="read-text" x="300" y="58">${t.toFixed(2)} 초</text>`;
        out += `<text class="part-label" x="300" y="84">속력</text><text class="read-text" x="300" y="102">${now.v.toFixed(2)} m/s</text>`;
        out += `<text class="note-text" x="380" y="102">${now.onRamp ? '속력 늘어남' : '속력 그대로'}</text>`;
        out += `<text class="verdict-text" fill="#0284c7" x="20" y="28">${state.angle}° 빗면 · ${state.flash}초마다 찍음 → ${now.onRamp ? '속력이 증가하는 운동' : '등속 운동'}</text>`;
        return out;
    }

    function renderEnergy(a, p) {
        const q = sampleEnergy(a, p);
        const X0 = 22, W = 290, GY = 186, ppm = W / END, ppmY = 130 / TOP;
        const px = x => X0 + x * ppm, py = y => GY - y * ppmY;
        let out = '';
        const pts = [];
        for (let x = 0; x <= END + 1e-9; x += 0.05) pts.push(`${px(x).toFixed(1)},${py(trackY(x)).toFixed(1)}`);
        out += `<path class="track-fill" d="M${pts.join('L')}L${px(END).toFixed(1)},${GY}L${X0},${GY}Z"/>`;
        out += `<path class="track" d="M${pts.join('L')}"/>`;
        out += `<line class="ground" x1="10" y1="${GY + 1.5}" x2="${(X0 + W + 10).toFixed(1)}" y2="${GY + 1.5}"/>`;
        // the start height and the hill height, to compare by eye
        out += `<line class="height-line" x1="${px(0)}" y1="${py(a.h0).toFixed(1)}" x2="${px(4.6).toFixed(1)}" y2="${py(a.h0).toFixed(1)}"/>`;
        out += `<text class="small-label" x="${px(2.2).toFixed(1)}" y="${(py(a.h0) - 4).toFixed(1)}">놓은 높이 ${a.h0.toFixed(1)} m</text>`;
        out += `<text class="small-label" x="${px(3).toFixed(1)}" y="${(py(HILL2) - 6).toFixed(1)}" text-anchor="middle">언덕 ${HILL2} m</text>`;
        // the ball
        out += `<circle class="ball" cx="${px(q.x).toFixed(1)}" cy="${(py(q.y) - 6).toFixed(1)}" r="6"/>`;
        out += `<text class="note-text" x="${px(q.x).toFixed(1)}" y="${(py(q.y) - 16).toFixed(1)}" text-anchor="middle">${q.v.toFixed(1)} m/s</text>`;

        // energy bars at the right
        const BX = 336, BW = 24, BH = 120, BY = 46;
        const scale = BH / a.eTotal;
        const bar = (x, val, cls, name) => {
            const h = val * scale;
            return `<rect class="ebar-frame" x="${x}" y="${BY}" width="${BW}" height="${BH}" rx="3"/>` +
                `<rect class="${cls}" x="${x + 2}" y="${(BY + BH - h).toFixed(1)}" width="${BW - 4}" height="${h.toFixed(1)}" rx="2"/>` +
                `<text class="ebar-text" fill="#0f172a" x="${x + BW / 2}" y="${BY + BH + 14}" text-anchor="middle">${name}</text>` +
                `<text class="ebar-text" fill="#0f172a" x="${x + BW / 2}" y="${BY - 6}" text-anchor="middle">${val.toFixed(1)}</text>`;
        };
        out += bar(BX, q.pe, 'ebar-pe', '위치');
        out += bar(BX + 40, q.ke, 'ebar-ke', '운동');
        // the total: both stacked
        out += `<rect class="ebar-frame" x="${BX + 80}" y="${BY}" width="${BW}" height="${BH}" rx="3"/>`;
        out += `<rect class="ebar-pe" x="${BX + 82}" y="${(BY + BH - q.pe * scale).toFixed(1)}" width="${BW - 4}" height="${(q.pe * scale).toFixed(1)}"/>`;
        out += `<rect class="ebar-ke" x="${BX + 82}" y="${BY}" width="${BW - 4}" height="${(q.ke * scale).toFixed(1)}"/>`;
        out += `<text class="ebar-text" fill="#059669" x="${BX + 80 + BW / 2}" y="${BY + BH + 14}" text-anchor="middle">합</text>`;
        out += `<text class="ebar-text" fill="#059669" x="${BX + 80 + BW / 2}" y="${BY - 6}" text-anchor="middle">${a.eTotal.toFixed(1)}</text>`;
        out += `<text class="small-label" x="${BX + 52}" y="${BY + BH + 28}" text-anchor="middle">에너지 (J)</text>`;

        const VERD = { pass: '언덕을 넘어간다', stop: '꼭대기에서 멈춘다', back: '되돌아온다' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="28">${a.h0.toFixed(1)} m에서 놓은 ${a.m} kg 공 → ${VERD[a.verdict]}</text>`;
        out += `<text class="part-label" x="20" y="208">시간 ${q.t.toFixed(2)} 초 · 높이 ${q.y.toFixed(2)} m · 속력 ${q.v.toFixed(2)} m/s</text>`;
        return out;
    }

    function renderMain(a) {
        mainGroup.innerHTML = a.kind === 'incline' ? renderIncline(a, state.progress) : renderEnergy(a, state.progress);
    }

    /* ------------------------------------------------------------ graphs */
    function graphFrame(xTicks, yTicks, xTitle, yTitle) {
        let out = '';
        yTicks.forEach(([v, y]) => {
            out += `<line class="grid-line" x1="${GRAPH.x0}" y1="${y.toFixed(1)}" x2="${GRAPH.x1}" y2="${y.toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(y + 3).toFixed(1)}" text-anchor="end">${v}</text>`;
        });
        xTicks.forEach(([v, x]) => {
            out += `<text class="axis-text" x="${x.toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${v}</text>`;
        });
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-title" x="${((GRAPH.x0 + GRAPH.x1) / 2).toFixed(1)}" y="${GRAPH.y0 + 30}" text-anchor="middle">${xTitle}</text>`;
        out += `<text class="axis-title" x="${GRAPH.x0 + 4}" y="${GRAPH.y1 - 8}">${yTitle}</text>`;
        return out;
    }

    // speed against time: a straight rise on the ramp, then level
    function graphIncline(a) {
        const t = state.progress * a.total;
        const tMax = Math.ceil(a.total * 2) / 2, vMax = 5;
        const gx = s => GRAPH.x0 + (s / tMax) * (GRAPH.x1 - GRAPH.x0);
        const gy = v => GRAPH.y0 - (v / vMax) * (GRAPH.y0 - GRAPH.y1);
        let out = graphFrame(
            [0, 0.5, 1, 1.5, 2, 2.5, 3].filter(s => s <= tMax).map(s => [s, gx(s)]),
            [0, 1, 2, 3, 4, 5].map(v => [v, gy(v)]),
            '시간 (초)', '속력 (m/s)');
        const path = [`${gx(0)},${gy(0)}`, `${gx(a.tRamp).toFixed(1)},${gy(a.vEnd).toFixed(1)}`, `${gx(a.total).toFixed(1)},${gy(a.vEnd).toFixed(1)}`];
        out += `<path class="trace-done" d="M${path.join('L')}"/>`;
        if (t > 0) {
            const live = [`${gx(0)},${gy(0)}`];
            if (t >= a.tRamp) live.push(`${gx(a.tRamp).toFixed(1)},${gy(a.vEnd).toFixed(1)}`);
            const now = a.at(t);
            live.push(`${gx(t).toFixed(1)},${gy(now.v).toFixed(1)}`);
            out += `<path class="trace" d="M${live.join('L')}"/>`;
        }
        a.flashes.filter(f => f.t <= t + 1e-9).forEach(f => {
            out += `<circle class="flash-dot" cx="${gx(f.t).toFixed(1)}" cy="${gy(f.v).toFixed(1)}" r="2.6"/>`;
        });
        out += `<text class="note-text" x="${gx((a.tRamp + a.total) / 2).toFixed(1)}" y="${(gy(a.vEnd) - 10).toFixed(1)}" text-anchor="middle">${a.vEnd.toFixed(2)} m/s 그대로</text>`;
        return out;
    }

    // the two energies against time; their sum is the flat line on top
    function graphEnergy(a) {
        const eMax = Math.ceil(a.eTotal / 10) * 10 + 10;
        const gx = t => GRAPH.x0 + (t / a.duration) * (GRAPH.x1 - GRAPH.x0);
        const gy = e => GRAPH.y0 - (e / eMax) * (GRAPH.y0 - GRAPH.y1);
        const ticks = [];
        for (let e = eMax / 4; e <= eMax; e += eMax / 4) ticks.push([Math.round(e), gy(e)]);   // no zero label: it would sit on the time axis's
        let out = graphFrame(
            [0, 0.25, 0.5, 0.75, 1].map(f => [(f * a.duration).toFixed(1), gx(f * a.duration)]),
            ticks, '시간 (초)', '에너지 (J)');
        const tNow = state.progress * a.duration;
        const pe = [], ke = [];
        a.path.forEach(pt => {
            if (pt.t > tNow) return;
            const e = a.m * G * pt.y;
            pe.push(`${gx(pt.t).toFixed(1)},${gy(e).toFixed(1)}`);
            ke.push(`${gx(pt.t).toFixed(1)},${gy(a.eTotal - e).toFixed(1)}`);
        });
        out += `<line class="expect-line" x1="${GRAPH.x0}" y1="${gy(a.eTotal).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(a.eTotal).toFixed(1)}"/>`;
        out += `<text class="axis-text" style="fill:#059669" x="${GRAPH.x1 - 4}" y="${(gy(a.eTotal) - 5).toFixed(1)}" text-anchor="end">합 ${a.eTotal.toFixed(1)} J — 언제나 같음</text>`;
        if (pe.length > 1) {
            out += `<path class="trace" style="stroke:#0284c7" d="M${pe.join('L')}"/>`;
            out += `<path class="trace" style="stroke:#ea580c" d="M${ke.join('L')}"/>`;
        }
        out += `<text class="bar-text" fill="#0284c7" x="${GRAPH.x0 + 8}" y="${GRAPH.y1 + 12}">위치 에너지</text>`;
        out += `<text class="bar-text" fill="#ea580c" x="${GRAPH.x0 + 78}" y="${GRAPH.y1 + 12}">운동 에너지</text>`;
        return out;
    }

    // the gaps between neighbouring flashes while still on the ramp, in cm
    const rampGaps = a => a.flashes.filter(f => f.onRamp).slice(1).map((f, i) => (f.s - a.flashes[i].s) * 100);
    const gapText = gaps => gaps.slice(0, 3).map(g => `${g.toFixed(1)} cm`).join(' → ');

    function noteFor(a) {
        if (a.kind === 'incline') {
            const gaps = rampGaps(a);
            return '<p>같은 시간 간격의 점 사이: ' + (gaps.length >= 2 ? gapText(gaps) : '기록 간격을 줄여 비교하세요') + '</p><p>빗면에서는 속력이 증가하고, 마찰 없는 평평한 곳에서는 속력이 일정합니다.</p>';
        }
        return `<div class="data-row"><span class="data-name">처음 위치 에너지</span><span class="data-val">9.8 × ${a.m} kg × ${a.h0.toFixed(1)} m = ${a.eTotal.toFixed(1)} J</span></div>` +
            `<div class="data-row"><span class="data-name">가장 낮은 곳</span><span class="data-val">운동 에너지 ${a.eTotal.toFixed(1)} J · 속력 ${a.vBottom.toFixed(2)} m/s</span></div>` +
            `<div class="data-row"><span class="data-name">언덕 꼭대기</span><span class="data-val">${a.passes ? `위치 ${(a.m * G * HILL2).toFixed(1)} J + 운동 ${(a.eTotal - a.m * G * HILL2).toFixed(1)} J` : `필요한 위치 에너지 ${(a.m * G * HILL2).toFixed(1)} J > 가진 에너지 ${a.eTotal.toFixed(1)} J`}</span></div>` +
            `<div class="data-row"><span class="data-name">오를 수 있는 높이</span><span class="data-val">${a.h0.toFixed(1)} m — 질량과 상관없음</span></div>` +
            `<div class="data-row match"><span class="data-name">결과</span><span class="data-val">${a.passes ? '언덕을 넘어간다' : a.verdict === 'stop' ? '꼭대기에서 멈춘다' : '되돌아온다'}</span></div>`;
    }

    function render() {
        const a = analyse();
        renderMain(a);
        graphGroup.innerHTML = a.kind === 'incline' ? graphIncline(a) : graphEnergy(a);
        stageBadge.textContent = a.kind === 'incline'
            ? `${state.angle}° · ${state.flash}초 간격`
            : `${a.h0.toFixed(1)} m · ${a.m} kg`;
        methodHint.textContent = state.mode === 'incline'
            ? '빗면에서는 속력이 일정하게 늘고, 평평한 곳에서는 속력이 그대로입니다'
            : '위치 에너지와 운동 에너지의 합은 어디서나 같습니다';
        dataNote.innerHTML = noteFor(a);
        return a;
    }

    /* --------------------------------------------------------------- run */
    function tick(dt) {
        state.progress = Math.min(1, state.progress + dt / RUN_SECONDS);
        render();
        return state.progress >= 1;
    }

    function stopRun() { running = false; if (frameId) cancelAnimationFrame(frameId); frameId = 0; }

    function frame(stamp) {
        if (!running) return;
        const dt = Math.min(0.05, (stamp - lastStamp) / 1000 || 0);
        lastStamp = stamp;
        if (tick(dt)) { stopRun(); finish(); } else frameId = requestAnimationFrame(frame);
    }

    function startRun() {
        stopRun();
        state.progress = 0;
        running = true;
        lastStamp = performance.now();
        render();
        frameId = requestAnimationFrame(frame);
    }

    function finish() {
        const a = render();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        if (a.kind === 'incline') {
            labelA.textContent = '빗면에서'; labelB.textContent = '평평한 곳에서';
            valueA.textContent = `${state.flash}초마다 ${(a.a * state.flash).toFixed(2)} m/s씩 빨라짐`;
            valueB.textContent = `${a.vEnd.toFixed(2)} m/s 그대로`;
            predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
                : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
            const gaps = rampGaps(a);
            explanation.textContent = '같은 시간 간격의 점 사이가 벌어지면 속력이 증가한 것입니다. 마찰 없는 평평한 곳에서는 운동 방향의 알짜힘이 없어 속력이 일정하고 점 사이 거리도 같습니다.';
            return;
        }
        labelA.textContent = '결과'; labelB.textContent = '에너지 합';
        valueA.textContent = a.passes ? '언덕을 넘어감' : a.verdict === 'stop' ? '꼭대기에서 멈춤' : '되돌아옴';
        valueB.textContent = `${a.eTotal.toFixed(1)} J 그대로`;
        predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        let s = `높이 ${a.h0.toFixed(1)} m에서 놓은 ${a.m} kg 공의 위치 에너지는 9.8 × ${a.m} × ${a.h0.toFixed(1)} = ${a.eTotal.toFixed(1)} J입니다. ` +
            `가장 낮은 곳에서는 이것이 모두 운동 에너지가 되어 속력이 ${a.vBottom.toFixed(2)} m/s가 되고, 올라갈수록 다시 위치 에너지로 돌아갑니다. `;
        if (a.passes) {
            s += `언덕 꼭대기(${HILL2} m)에서도 운동 에너지가 ${(a.eTotal - a.m * G * HILL2).toFixed(1)} J 남아 있어 넘어갑니다. `;
        } else {
            s += `공은 처음 높이 ${a.h0.toFixed(1)} m까지만 오를 수 있는데 언덕은 ${HILL2} m여서, 높이 ${a.h0.toFixed(1)} m 지점에서 속력이 0이 되어 되돌아옵니다. `;
        }
        s += `질량을 ${a.m === 1 ? 2 : 1} kg으로 바꿔도 위치 에너지와 운동 에너지가 같은 비율로 바뀌어 결과는 같습니다.`;
        explanation.textContent = s;
    }

    function settingsChanged() {
        stopRun();
        state.progress = 0;
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        render();
    }

    modeButtons.forEach(button => button.addEventListener('click', () => {
        state.mode = button.dataset.mode;
        state.prediction = null;
        modeButtons.forEach(item => item.classList.toggle('selected', item === button));
        buildControls();
        buildPrediction();
        stageCaption.textContent = state.mode === 'incline'
            ? '일정한 시간마다 찍은 점 사이가 벌어지면 속력이 늘고 있다는 뜻입니다.'
            : '두 막대가 서로 바뀌는 동안 오른쪽 합 막대는 그대로인지 보세요.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { angle: 20, flash: 0.2, height: 2, mass: 1, progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'incline').click();
    });

    function shuffleQuizOptions(card) {
        const optionGroup = card.querySelector('.quiz-options');
        const options = Array.from(optionGroup.children);
        for (let index = options.length - 1; index > 0; index -= 1) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [options[index], options[randomIndex]] = [options[randomIndex], options[index]];
        }
        optionGroup.append(...options);
    }

    document.querySelectorAll('.quiz-card').forEach(card => {
        shuffleQuizOptions(card);
        const answerButton = card.querySelector('.answer-button');
        const answerResult = card.querySelector('.answer-result');
        const answerExplanation = card.querySelector('.answer-explanation');
        answerButton.addEventListener('click', () => {
            const selected = card.querySelector('input:checked');
            if (!selected) {
                delete card.dataset.state;
                answerResult.textContent = '답을 먼저 선택하세요.';
                return;
            }
            const correct = selected.value === card.dataset.answer;
            card.dataset.state = correct ? 'correct' : 'incorrect';
            answerResult.textContent = correct ? '맞았습니다.' : '다시 생각해 보세요.';
            answerExplanation.hidden = !correct;
            if (!correct) {
                selected.checked = false;
                selected.disabled = true;
                answerResult.textContent = '다시 생각하고 다른 답을 골라보세요.';
            }
        });
    });

    window.__motionModel = {
        G, RAMP_M, FLAT_M, TOP, HILL2, END, state,
        analyseIncline, analyseEnergy, analyse, trackY, startX, sampleEnergy, render,
        runSeconds: () => RUN_SECONDS,
        setMode(m) { modeButtons.find(b => b.dataset.mode === m).click(); },
        set(key, value) { state[key] = value; buildControls(); settingsChanged(); },
        setProgress(p) { stopRun(); state.progress = p; render(); },
        runToEnd(dt = 0.25, cap = 5000) {
            stopRun(); state.progress = 0;
            let steps = 0;
            while (!tick(dt) && steps < cap) steps += 1;
            finish();
            return { steps, progress: state.progress };
        },
        tick, finish,
    };

    resetBtn.click();
});
