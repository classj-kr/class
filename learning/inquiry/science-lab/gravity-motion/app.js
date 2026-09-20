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

    const G = 9.8;

    /* -------------------------------------------------------------- data */
    // Two balls from a cliff: one let go, one thrown.
    const HEIGHTS = { '10': { label: '10 m', hint: '3층 높이' }, '20': { label: '20 m', hint: '6층 높이' }, '45': { label: '45 m', hint: '15층 높이' } };
    const SPEEDS = { '5': { label: '5 m/s', hint: '살짝' }, '10': { label: '10 m/s', hint: '힘껏' }, '15': { label: '15 m/s', hint: '아주 세게' } };
    const AIMS = { level: { label: '옆으로 (수평)', phrase: '옆으로', deg: 0 }, up: { label: '조금 위로 30°', phrase: '30° 위로', deg: 30 }, down: { label: '조금 아래로 30°', phrase: '30° 아래로', deg: -30 } };

    // Newton's cannon: a mountain 400 km high (the height of the space station), no air.
    const GM = 3.986004e14, R_E = 6.371e6, ALT = 400e3;
    const V_CIRC = Math.sqrt(GM / (R_E + ALT)), V_ESC = Math.sqrt(2 * GM / (R_E + ALT));
    const LAUNCH = {
        '4': { label: '4 km/s' }, '6': { label: '6 km/s' }, '7.5': { label: '7.5 km/s' },
        '7.67': { label: '7.67 km/s', hint: '이 높이의 원 궤도 속력' }, '9': { label: '9 km/s' }, '11': { label: '11 km/s', hint: '탈출 속력 넘음' },
    };

    // An egg on four floors: the floor gives by `d` metres while the egg stops.
    const EGG_M = 0.06, BREAK_N = 25;
    const DROPS = { '0.5': { label: '0.5 m' }, '1': { label: '1 m' }, '2': { label: '2 m' } };
    const FLOORS = {
        concrete: { label: '콘크리트 바닥', d: 0.002, cls: '' },
        towel: { label: '접은 수건', d: 0.015, cls: 'soft' },
        sponge: { label: '두꺼운 스펀지', d: 0.04, cls: 'softer' },
        airbag: { label: '공기 든 봉지', d: 0.15, cls: 'air', hint: '에어백처럼' },
    };

    const state = {
        mode: 'drop',
        height: '20', speed: '10', aim: 'level',
        launch: '6',
        drop: '1', floor: 'concrete',
        progress: 0, prediction: null,
    };
    let running = false, frameId = 0, lastStamp = 0;

    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const D2R = Math.PI / 180;
    const fmtN = n => Math.round(n).toLocaleString('ko-KR');
    const fmt1 = n => (Math.round(n * 10) / 10).toString();
    const fmt2 = n => n.toFixed(2);
    const depthText = d => d >= 0.01 ? `${Math.round(d * 100)} cm` : `${Math.round(d * 1000)} mm`;

    /* ------------------------------------------------------------ models */
    function dropCalc() {
        const h = Number(state.height), v = Number(state.speed), th = AIMS[state.aim].deg * D2R;
        const vx = v * Math.cos(th), vy0 = v * Math.sin(th);
        const tA = Math.sqrt(2 * h / G);
        const tB = (vy0 + Math.sqrt(vy0 * vy0 + 2 * G * h)) / G;
        const rise = vy0 > 0 ? vy0 * vy0 / (2 * G) : 0;
        const range = vx * tB;
        const verdict = th === 0 ? 'same' : th > 0 ? 'drop-first' : 'throw-first';
        return { kind: 'drop', h, v, th, vx, vy0, tA, tB, rise, range, T: Math.max(tA, tB), verdict };
    }
    const posA = (a, t) => ({ x: 0, y: Math.max(0, a.h - 0.5 * G * t * t) });
    const posB = (a, t) => { const tt = Math.min(t, a.tB); return { x: a.vx * tt, y: Math.max(0, a.h + a.vy0 * tt - 0.5 * G * tt * tt) }; };

    const orbitCache = {};
    // fly the cannonball with real gravity, one second at a time, until it lands, escapes or comes round
    function orbitOf(key) {
        if (orbitCache[key]) return orbitCache[key];
        const v0 = Number(key) * 1000;
        let x = 0, y = R_E + ALT, vx = v0, vy = 0, t = 0;
        const dt = 1;
        const acc = (px, py) => { const r = Math.hypot(px, py); const a = -GM / (r * r * r); return [a * px, a * py]; };
        const samples = [{ t: 0, x, y, r: Math.hypot(x, y), v: v0 }];
        let ang = 0, prev = Math.atan2(y, x), maxR = y, minR = y, outcome = 'orbit';
        for (let i = 1; i <= 60000; i += 1) {
            let [ax, ay] = acc(x, y);
            x += vx * dt + 0.5 * ax * dt * dt; y += vy * dt + 0.5 * ay * dt * dt;
            const [ax2, ay2] = acc(x, y);
            vx += 0.5 * (ax + ax2) * dt; vy += 0.5 * (ay + ay2) * dt; t += dt;
            const r = Math.hypot(x, y);
            maxR = Math.max(maxR, r); minR = Math.min(minR, r);
            const a = Math.atan2(y, x); let d = a - prev; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; ang += d; prev = a;
            if (i % 10 === 0) samples.push({ t, x, y, r, v: Math.hypot(vx, vy) });
            if (r <= R_E) { outcome = 'hit'; samples.push({ t, x, y, r, v: Math.hypot(vx, vy) }); break; }
            if (r >= 5 * R_E) { outcome = 'escape'; break; }
            if (Math.abs(ang) >= 2 * Math.PI) { outcome = 'orbit'; break; }
        }
        const deg = Math.abs(ang) / D2R, rangeKm = Math.abs(ang) * R_E / 1000;
        const verdict = outcome === 'escape' ? 'escape' : outcome === 'hit' ? (deg < 90 ? 'short' : 'far') : 'orbit';
        orbitCache[key] = { kind: 'orbit', v0, samples, T: t, outcome, verdict, deg, rangeKm, maxAlt: (maxR - R_E) / 1000, minAlt: (minR - R_E) / 1000 };
        return orbitCache[key];
    }
    // the sample at time t, interpolated
    function orbitAt(o, t) {
        const s = o.samples;
        if (t >= s[s.length - 1].t) return s[s.length - 1];
        let lo = 0, hi = s.length - 1;
        while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (s[mid].t <= t) lo = mid; else hi = mid; }
        const a = s[lo], b = s[hi], f = (t - a.t) / Math.max(1e-9, b.t - a.t);
        return { t, x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, r: a.r + (b.r - a.r) * f, v: a.v + (b.v - a.v) * f };
    }

    function impactCalc(hKey, floorKey) {
        const h = Number(hKey), d = FLOORS[floorKey].d;
        const v = Math.sqrt(2 * G * h), dt = 2 * d / v;          // steady slowing over the give of the floor
        const p = EGG_M * v, F = p / dt, W = EGG_M * G;
        const ratio = F / W;                                     // equals h / d
        return { h, d, v, dt, p, F, W, ratio, broken: F > BREAK_N, tFall: Math.sqrt(2 * h / G) };
    }

    function analyse() {
        if (state.mode === 'drop') return dropCalc();
        if (state.mode === 'orbit') return orbitOf(state.launch);
        const c = impactCalc(state.drop, state.floor);
        const verdict = c.ratio <= 10 ? 'low' : c.ratio <= 100 ? 'mid' : 'high';
        return { kind: 'impact', ...c, verdict, all: Object.keys(FLOORS).map(k => ({ key: k, ...impactCalc(state.drop, k) })) };
    }
    const runSeconds = () => state.mode === 'drop' ? Math.max(3, 2 * (dropCalc().T + 0.4)) : state.mode === 'orbit' ? 7 : 4;

    /* ---------------------------------------------------------- controls */
    function pickRow(legend, name, options, current, cols) {
        return `<fieldset class="pick-field"><legend>${legend}</legend>` +
            `<div class="pick-buttons cols${cols}" data-pick="${name}">` +
            options.map(o => `<button type="button" data-value="${o.value}" class="${o.value === String(current) ? 'selected' : ''}">` +
                `${o.label}${o.hint ? `<small>${o.hint}</small>` : ''}</button>`).join('') +
            `</div></fieldset>`;
    }
    const opts = table => Object.entries(table).map(([k, v]) => ({ value: k, label: v.label, hint: v.hint }));

    function buildControls() {
        if (state.mode === 'drop') {
            controlArea.innerHTML = pickRow('높이', 'height', opts(HEIGHTS), state.height, 3) +
                pickRow('던지는 속력', 'speed', opts(SPEEDS), state.speed, 3) +
                pickRow('던지는 방향', 'aim', opts(AIMS), state.aim, 3);
        } else if (state.mode === 'orbit') {
            controlArea.innerHTML = pickRow('던지는 속력 (400 km 높이의 산에서 옆으로)', 'launch', opts(LAUNCH), state.launch, 3);
        } else {
            controlArea.innerHTML = pickRow('떨어뜨리는 높이', 'drop', opts(DROPS), state.drop, 3) +
                pickRow('바닥', 'floor', opts(FLOORS), state.floor, 4);
        }
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                buildPrediction();
                settingsChanged();
            }));
        });
    }

    const PRED_DROP = [{ value: 'drop-first', label: '놓은 공이 먼저 닿는다' }, { value: 'throw-first', label: '던진 공이 먼저 닿는다' }, { value: 'same', label: '동시에 닿는다' }];
    const PRED_ORBIT = [
        { value: 'short', label: '금방 떨어진다 (지구 둘레의 4분의 1도 못 감)' }, { value: 'far', label: '멀리 가다 떨어진다 (4분의 1 바퀴 넘게)' },
        { value: 'orbit', label: '지구를 돈다' }, { value: 'escape', label: '지구를 떠난다' },
    ];
    const PRED_IMPACT = [{ value: 'low', label: '10배 이내' }, { value: 'mid', label: '10 ~ 100배' }, { value: 'high', label: '100배 넘게' }];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list = state.mode === 'drop' ? PRED_DROP : state.mode === 'orbit' ? PRED_ORBIT : PRED_IMPACT;
        predictionLegend.textContent = state.mode === 'drop' ? '같은 순간 한 공은 놓고 한 공은 던지면, 어느 공이 먼저 땅에 닿을까요?'
            : state.mode === 'orbit' ? `${LAUNCH[state.launch].label}로 옆으로 던진 대포알은 어떻게 될까요?`
                : `달걀이 바닥에서 받는 평균 힘은 달걀 무게(${fmt2(EGG_M * G)} N)의 몇 배일까요?`;
        predictionArea.className = `prediction-buttons${list.length === 3 ? ' three' : ''}`;
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    function renderDrop(a) {
        const dur = a.T + 0.4;
        const t = state.progress * dur;
        const GY = 178, LX = 52;
        const s = Math.min(150 / (a.h + a.rise + 1), 320 / (a.range + 2));
        const X = m => LX + m * s, Y = m => GY - m * s;
        let out = `<rect class="ground" x="16" y="${GY}" width="428" height="12" rx="2"/>`;
        out += `<rect class="cliff" x="30" y="${Y(a.h).toFixed(1)}" width="16" height="${(a.h * s).toFixed(1)}" rx="2"/>`;
        out += `<text class="trait-text" x="27" y="${(Y(a.h) + 3).toFixed(1)}" text-anchor="end">${a.h} m</text>`;
        // trails every tenth of a second
        for (let k = 1; k * 0.1 <= Math.min(t, a.tA); k += 1) { const p = posA(a, k * 0.1); out += `<circle class="trail-a" cx="${X(p.x).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="1.8"/>`; }
        for (let k = 1; k * 0.1 <= Math.min(t, a.tB); k += 1) { const p = posB(a, k * 0.1); out += `<circle class="trail-b" cx="${X(p.x).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="1.8"/>`; }
        const pa = posA(a, Math.min(t, a.tA)), pb = posB(a, t);
        out += `<circle class="ball-a" cx="${X(pa.x).toFixed(1)}" cy="${(Y(pa.y) - 5).toFixed(1)}" r="5"/>`;
        out += `<circle class="ball-b" cx="${X(pb.x).toFixed(1)}" cy="${(Y(pb.y) - 5).toFixed(1)}" r="5"/>`;
        // launch arrow for the thrown ball, before it goes
        if (t === 0) out += `<line class="arrow" x1="${X(0) + 7}" y1="${(Y(a.h) - 5).toFixed(1)}" x2="${(X(0) + 7 + 22 * Math.cos(a.th)).toFixed(1)}" y2="${(Y(a.h) - 5 - 22 * Math.sin(a.th)).toFixed(1)}"/>`;
        // landings
        if (t >= a.tA) out += `<line class="mark" x1="${X(0) - 4}" y1="${GY - 4}" x2="${X(0) + 4}" y2="${GY + 4}"/><line class="mark" x1="${X(0) - 4}" y1="${GY + 4}" x2="${X(0) + 4}" y2="${GY - 4}"/>`;
        if (t >= a.tB) out += `<line class="mark" x1="${(X(a.range) - 4).toFixed(1)}" y1="${GY - 4}" x2="${(X(a.range) + 4).toFixed(1)}" y2="${GY + 4}"/><line class="mark" x1="${(X(a.range) - 4).toFixed(1)}" y1="${GY + 4}" x2="${(X(a.range) + 4).toFixed(1)}" y2="${GY - 4}"/>`;
        // readouts
        out += `<text class="gen-text" x="450" y="44" text-anchor="end">t = ${Math.min(t, dur).toFixed(2)} s</text>`;
        out += `<text class="trait-text" x="450" y="60" text-anchor="end">놓은 공 높이 ${pa.y.toFixed(1)} m${t >= a.tA ? ` · ${a.tA.toFixed(2)} s에 닿음` : ''}</text>`;
        out += `<text class="trait-text" style="fill:#d97706" x="450" y="76" text-anchor="end">던진 공 높이 ${pb.y.toFixed(1)} m${t >= a.tB ? ` · ${a.tB.toFixed(2)} s에 닿음` : ''}</text>`;
        out += `<text class="trait-text" style="fill:#d97706" x="450" y="92" text-anchor="end">던진 공 옆으로 ${pb.x.toFixed(1)} m</text>`;
        // scale bar
        const bar = 10 * s;
        out += `<line class="scale-bar" x1="${(440 - bar).toFixed(1)}" y1="166" x2="440" y2="166"/><text class="small-label" x="${(440 - bar / 2).toFixed(1)}" y="160" text-anchor="middle">10 m</text>`;
        const VERD = { same: '동시에 닿음', 'drop-first': '놓은 공이 먼저', 'throw-first': '던진 공이 먼저' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${state.progress >= 1 ? `놓은 공 ${a.tA.toFixed(2)} s · 던진 공 ${a.tB.toFixed(2)} s → ${VERD[a.verdict]}` : `높이 ${a.h} m · ${AIMS[state.aim].phrase} ${a.v} m/s로 던짐`}</text>`;
        out += `<text class="note-text" x="20" y="208">공기 저항 없음 · 두 공 모두 아래 방향 속력이 1초마다 9.8 m/s씩 늘어남 · 옆 방향 속력은 그대로</text>`;
        return out;
    }

    function graphDrop(a) {
        const dur = a.T + 0.4;
        const t = state.progress * dur;
        const X0 = 50, X1 = 430, Y0 = 150, Y1 = 40;
        const tMax = Math.ceil((a.T + 0.2) * 2) / 2, hMax = Math.ceil((a.h + a.rise) / 5) * 5;
        const xOf = tt => X0 + tt / tMax * (X1 - X0), yOf = hh => Y0 - hh / hMax * (Y0 - Y1);
        let out = `<text class="axis-title" x="${X0}" y="18">높이–시간 — 흰 선: 놓은 공, 노란 점선: 던진 공</text>`;
        const hStep = hMax > 30 ? 10 : 5;
        for (let hh = 0; hh <= hMax; hh += hStep) { out += `<line class="grid-line" x1="${X0}" y1="${yOf(hh).toFixed(1)}" x2="${X1}" y2="${yOf(hh).toFixed(1)}"/><text class="axis-text" x="${X0 - 6}" y="${(yOf(hh) + 3.5).toFixed(1)}" text-anchor="end">${hh}</text>`; }
        const tStep = tMax > 3 ? 1 : 0.5;
        for (let tt = 0; tt <= tMax + 1e-9; tt += tStep) out += `<text class="axis-text" x="${xOf(tt).toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${tt}</text>`;
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        out += `<text class="axis-text" x="${X0 + 4}" y="${Y1 - 6}">높이 (m)</text>`;
        const curve = (fn, tEnd) => { let d = ''; for (let tt = 0; tt <= Math.min(t, tEnd) + 1e-9; tt += 0.02) d += `${d ? 'L' : 'M'}${xOf(tt).toFixed(1)},${yOf(fn(tt)).toFixed(1)} `; if (t >= tEnd) d += `L${xOf(tEnd).toFixed(1)},${yOf(0).toFixed(1)}`; return d; };
        out += `<path class="trace" style="stroke:#eef5f8" d="${curve(tt => posA(a, tt).y, a.tA)}"/>`;
        out += `<path class="trace dashed" style="stroke:#d97706" d="${curve(tt => posB(a, tt).y, a.tB)}"/>`;
        const landing = (tt, txt, color, first) => {
            const x = xOf(tt);
            if (first) return `<text class="axis-text" style="fill:${color}" x="${(x - 4).toFixed(1)}" y="${Y0 - 6}" text-anchor="end">${txt}</text>`;
            const room = x + 70 <= X1;
            return `<text class="axis-text" style="fill:${color}" x="${(room ? x + 4 : x - 4).toFixed(1)}" y="${room ? Y0 - 6 : Y0 - 18}" text-anchor="${room ? 'start' : 'end'}">${txt}</text>`;
        };
        if (t >= a.tA) out += landing(a.tA, `${a.verdict === 'same' ? '둘 다 ' : '놓은 공 '}${a.tA.toFixed(2)} s`, '#eef5f8', a.tA <= a.tB);
        if (t >= a.tB && a.verdict !== 'same') out += landing(a.tB, `던진 공 ${a.tB.toFixed(2)} s`, '#d97706', a.tB < a.tA);
        out += `<text class="axis-title" x="${((X0 + X1) / 2).toFixed(1)}" y="${Y0 + 30}" text-anchor="middle">시간 (s) — 세로 운동만 견줍니다</text>`;
        return out;
    }

    const EC = [150, 92], ER = 44, KPX = ER / R_E;   // Earth on screen
    function renderOrbit(o) {
        const t = state.progress * o.T;
        const now = orbitAt(o, t);
        const sx = m => EC[0] + m * KPX, sy = m => EC[1] - m * KPX;
        let out = `<circle class="earth" cx="${EC[0]}" cy="${EC[1]}" r="${ER}"/>`;
        out += `<ellipse class="earth-land" cx="${EC[0] - 12}" cy="${EC[1] - 8}" rx="14" ry="10"/><ellipse class="earth-land" cx="${EC[0] + 14}" cy="${EC[1] + 12}" rx="10" ry="13"/>`;
        // the mountain at the north pole
        out += `<polygon class="mountain" points="${EC[0] - 5},${EC[1] - ER + 1} ${EC[0] + 5},${EC[1] - ER + 1} ${EC[0]},${(sy(R_E + ALT)).toFixed(1)}"/>`;
        // the path so far
        let d = '';
        for (const p of o.samples) { if (p.t > t) break; d += `${d ? 'L' : 'M'}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)} `; }
        d += `L${sx(now.x).toFixed(1)},${sy(now.y).toFixed(1)}`;
        out += `<path class="path" d="${d}"/>`;
        if (t === 0) out += `<line class="arrow" x1="${sx(now.x).toFixed(1)}" y1="${sy(now.y).toFixed(1)}" x2="${(sx(now.x) + 8 + 3 * Number(state.launch)).toFixed(1)}" y2="${sy(now.y).toFixed(1)}"/>`;
        if (!(o.outcome === 'escape' && t >= o.T)) out += `<circle class="cannonball" cx="${sx(now.x).toFixed(1)}" cy="${sy(now.y).toFixed(1)}" r="3.5"/>`;
        // readouts
        const IX = 290;
        out += `<text class="gen-text" x="${IX}" y="44">던진 속력 ${LAUNCH[state.launch].label}</text>`;
        out += `<text class="trait-text" x="${IX}" y="60">이 높이의 원 궤도 속력 ${(V_CIRC / 1000).toFixed(2)} km/s</text>`;
        out += `<text class="trait-text" x="${IX}" y="76">탈출 속력 ${(V_ESC / 1000).toFixed(2)} km/s</text>`;
        out += `<text class="trait-text" x="${IX}" y="100">지난 시간 ${(t / 60).toFixed(1)}분</text>`;
        out += `<text class="trait-text" x="${IX}" y="116">높이 ${fmtN(Math.max(0, (now.r - R_E) / 1000))} km</text>`;
        out += `<text class="trait-text" x="${IX}" y="132">속력 ${(now.v / 1000).toFixed(2)} km/s</text>`;
        const travelled = (() => { let s = 0, prev = o.samples[0]; for (const p of o.samples) { if (p.t > t) break; s += Math.hypot(p.x - prev.x, p.y - prev.y); prev = p; } return s + Math.hypot(now.x - prev.x, now.y - prev.y); })();
        out += `<text class="trait-text" x="${IX}" y="148">날아간 거리 ${fmtN(travelled / 1000)} km</text>`;
        const VERD = { short: `${fmtN(o.rangeKm)} km 가서 떨어짐`, far: `${fmtN(o.rangeKm)} km(둘레의 ${Math.round(o.deg / 360 * 100)} %) 가서 떨어짐`, orbit: `지구를 돎 · 한 바퀴 ${(o.T / 60).toFixed(0)}분`, escape: '지구를 떠남' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${state.progress >= 1 ? `${LAUNCH[state.launch].label} → ${VERD[o.verdict]}` : `400 km 산꼭대기에서 ${LAUNCH[state.launch].label}로 옆으로 던짐`}</text>`;
        out += `<text class="note-text" x="20" y="208">${o.outcome === 'orbit' ? '떨어지는 만큼 지면이 둥글게 멀어져 영원히 땅에 닿지 않습니다' : o.outcome === 'escape' ? '멀어질수록 중력이 약해져 속력은 줄지만 붙잡히지 않습니다' : '중력이 대포알을 아래로 당겨 길이 굽고, 땅이 둥글어 더 멀리 갑니다'}</text>`;
        return out;
    }

    function niceCeil(x) { const e = 10 ** Math.floor(Math.log10(Math.max(1, x))), m = x / e; return ([1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find(s => s >= m)) * e; }
    function graphOrbit(o) {
        const t = state.progress * o.T;
        const X0 = 50, X1 = 430, Y0 = 150, Y1 = 40;
        const tMax = o.T / 60, aMax = niceCeil(Math.max(500, o.maxAlt * 1.1));
        const xOf = min => X0 + min / tMax * (X1 - X0), yOf = km => Y0 - km / aMax * (Y0 - Y1);
        let out = `<text class="axis-title" x="${X0}" y="18">높이–시간 — 땅에서 얼마나 높이 있나</text>`;
        for (let k = 0; k <= 4; k += 1) { const km = aMax * k / 4; out += `<line class="grid-line" x1="${X0}" y1="${yOf(km).toFixed(1)}" x2="${X1}" y2="${yOf(km).toFixed(1)}"/><text class="axis-text" x="${X0 - 6}" y="${(yOf(km) + 3.5).toFixed(1)}" text-anchor="end">${fmtN(km)}</text>`; }
        const tStep = tMax > 120 ? 60 : tMax > 40 ? 20 : tMax > 12 ? 5 : 2;
        for (let m = 0; m <= tMax + 1e-9; m += tStep) out += `<text class="axis-text" x="${xOf(m).toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${m}</text>`;
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        out += `<text class="axis-text" x="${X0 + 4}" y="${Y1 - 6}">높이 (km)</text>`;
        let d = '';
        for (const p of o.samples) { if (p.t > t) break; d += `${d ? 'L' : 'M'}${xOf(p.t / 60).toFixed(1)},${yOf(Math.max(0, (p.r - R_E) / 1000)).toFixed(1)} `; }
        const now = orbitAt(o, t);
        d += `L${xOf(t / 60).toFixed(1)},${yOf(Math.max(0, (now.r - R_E) / 1000)).toFixed(1)}`;
        out += `<path class="trace" style="stroke:#d97706" d="${d}"/>`;
        out += `<text class="axis-title" x="${((X0 + X1) / 2).toFixed(1)}" y="${Y0 + 30}" text-anchor="middle">시간 (분)${o.outcome === 'orbit' ? ` — 한 바퀴 ${(o.T / 60).toFixed(0)}분, 국제 우주 정거장은 92분` : ''}</text>`;
        return out;
    }

    function renderImpact(a) {
        const p = state.progress;
        const FY = 160, S = 60, EX = 150;
        const startY = FY - a.h * S - 10;
        const fallT = clamp(p / 0.6, 0, 1) * a.tFall;
        const squash = clamp((p - 0.6) / 0.1, 0, 1);
        const done = p >= 0.7;
        const fl = FLOORS[state.floor];
        const dip = fl.d * S * squash;
        let out = '';
        // the floor
        out += `<rect class="floor ${fl.cls}" x="60" y="${(FY + dip).toFixed(1)}" width="180" height="${(24 - dip).toFixed(1)}" rx="3"/>`;
        out += `<text class="trait-text" x="150" y="${FY + 34}" text-anchor="middle">${fl.label} · 들어가는 깊이 ${depthText(fl.d)}</text>`;
        // the egg
        const eggY = p < 0.6 ? startY + 0.5 * G * fallT * fallT * S : FY - 10 + dip;
        out += `<ellipse class="egg" cx="${EX}" cy="${eggY.toFixed(1)}" rx="8" ry="10"/>`;
        if (done && a.broken) out += `<polyline class="crack" points="${EX - 5},${(eggY - 6).toFixed(1)} ${EX - 1},${(eggY - 1).toFixed(1)} ${EX - 4},${(eggY + 3).toFixed(1)} ${EX + 1},${(eggY + 6).toFixed(1)}"/><polyline class="crack" points="${EX + 2},${(eggY - 8).toFixed(1)} ${EX + 4},${(eggY - 2).toFixed(1)} ${EX + 1},${(eggY + 1).toFixed(1)}"/>`;
        out += `<text class="trait-text" x="${EX - 14}" y="${(startY + 3).toFixed(1)}" text-anchor="end">높이 ${a.h} m</text>`;
        out += `<line class="weight-line" x1="${EX}" y1="${(startY + 12).toFixed(1)}" x2="${EX}" y2="${FY - 2}"/>`;
        // the force meter: each step up is ten times the force
        const MX = 300, MTOP = 40, MBOT = 160;
        const yOf = F => MBOT - (Math.log10(F) + 1) / 4 * (MBOT - MTOP);
        out += `<rect class="meter" x="${MX}" y="${MTOP}" width="24" height="${MBOT - MTOP}" rx="3"/>`;
        [0.1, 1, 10, 100, 1000].forEach(F => { out += `<text class="axis-text" x="${MX - 5}" y="${(yOf(F) + 3.5).toFixed(1)}" text-anchor="end">${F}</text>`; });
        if (done) out += `<rect class="meter-fill ${a.broken ? 'broken' : ''}" x="${MX + 3}" y="${yOf(a.F).toFixed(1)}" width="18" height="${(MBOT - yOf(a.F)).toFixed(1)}"/>`;
        out += `<line class="limit" x1="${MX - 2}" y1="${yOf(BREAK_N).toFixed(1)}" x2="${MX + 26}" y2="${yOf(BREAK_N).toFixed(1)}"/>`;
        out += `<text class="trait-text" style="fill:#ff7a59" x="${MX + 32}" y="${(yOf(BREAK_N) + 3).toFixed(1)}">깨지는 힘 약 ${BREAK_N} N</text>`;
        out += `<line class="weight-line" x1="${MX - 2}" y1="${yOf(a.W).toFixed(1)}" x2="${MX + 26}" y2="${yOf(a.W).toFixed(1)}"/>`;
        out += `<text class="trait-text" x="${MX + 32}" y="${(yOf(a.W) + 3).toFixed(1)}">달걀 무게 ${fmt2(a.W)} N</text>`;
        out += `<text class="small-label" x="${MX + 12}" y="${MBOT + 12}" text-anchor="middle">힘 (N)</text>`;
        out += `<text class="gen-text" x="${MX + 32}" y="48">${done ? `평균 힘 ${a.F < 10 ? fmt1(a.F) : fmtN(a.F)} N` : '평균 힘 ?'}</text>`;
        out += `<text class="trait-text" x="${MX + 32}" y="64">${done ? `무게의 ${a.ratio < 100 ? fmt1(a.ratio) : fmtN(a.ratio)}배 · ${a.broken ? '깨짐' : '멀쩡함'}` : ''}</text>`;
        out += `<text class="trait-text" x="${MX + 32}" y="112">${p >= 0.6 ? `닿는 속력 ${fmt1(a.v)} m/s` : `떨어지는 중 ${fallT.toFixed(2)} s`}</text>`;
        out += `<text class="trait-text" x="${MX + 32}" y="126">${done ? `멈추는 데 ${a.dt * 1000 < 10 ? (a.dt * 1000).toFixed(1) : fmtN(a.dt * 1000)} ms` : ''}</text>`;
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${done ? `${a.h} m → ${fl.label}: 평균 힘 ${a.F < 10 ? fmt1(a.F) : fmtN(a.F)} N, 무게의 ${a.ratio < 100 ? fmt1(a.ratio) : fmtN(a.ratio)}배 → ${a.broken ? '깨짐' : '안 깨짐'}` : `달걀 ${EGG_M * 1000} g을 ${a.h} m에서 ${fl.label}에 떨어뜨림`}</text>`;
        out += `<text class="note-text" x="20" y="208">멈출 때 힘 × 시간(충격량)은 어느 바닥이든 같음 · 힘 눈금은 한 칸에 10배</text>`;
        return out;
    }

    function graphImpact(a) {
        const X0 = 60, X1 = 430, Y0 = 150, Y1 = 40;
        const yOf = ratio => Y0 - Math.log10(Math.max(1, ratio)) / 3 * (Y0 - Y1);
        let out = `<text class="axis-title" x="${X0}" y="18">받는 힘 — 달걀 무게의 몇 배 (한 칸 = 10배)</text>`;
        [1, 10, 100, 1000].forEach(r => { out += `<line class="grid-line" x1="${X0}" y1="${yOf(r).toFixed(1)}" x2="${X1}" y2="${yOf(r).toFixed(1)}"/><text class="axis-text" x="${X0 - 6}" y="${(yOf(r) + 3.5).toFixed(1)}" text-anchor="end">${r}배</text>`; });
        const br = BREAK_N / a.W;
        out += `<line class="limit" x1="${X0}" y1="${yOf(br).toFixed(1)}" x2="${X1}" y2="${yOf(br).toFixed(1)}"/>`;
        out += `<text class="axis-text" style="fill:#ff7a59" x="${X1}" y="${(yOf(br) - 4).toFixed(1)}" text-anchor="end">여기부터 깨짐 (${BREAK_N} N)</text>`;
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/>`;
        const shown = state.progress >= 0.7 ? 1 : 0;
        a.all.forEach((f, n) => {
            const x = X0 + 20 + n * 92, w = 50, mine = f.key === state.floor;
            const top = yOf(f.ratio), h = (Y0 - top) * shown;
            out += `<rect class="bar" fill="${f.broken ? '#ff7a59' : '#0284c7'}" opacity="${mine ? 1 : 0.45}" stroke="${mine ? '#0284c7' : 'rgba(2,132,199,.2)'}" stroke-width="${mine ? 2 : .8}" x="${x}" y="${(Y0 - h).toFixed(1)}" width="${w}" height="${h.toFixed(1)}" rx="2"/>`;
            if (shown) out += `<text class="axis-text" style="fill:${mine ? '#0f172a' : '#475569'};font-weight:${mine ? '900' : '750'}" x="${x + w / 2}" y="${(top - 4).toFixed(1)}" text-anchor="middle">${f.ratio < 100 ? fmt1(f.ratio) : fmtN(f.ratio)}배</text>`;
            out += `<text class="axis-text" style="fill:${mine ? '#0f172a' : '#475569'};font-weight:${mine ? '900' : '750'}" x="${x + w / 2}" y="${Y0 + 14}" text-anchor="middle">${FLOORS[f.key].label}</text>`;
            out += `<text class="small-label" x="${x + w / 2}" y="${Y0 + 26}" text-anchor="middle">${shown ? `${f.dt * 1000 < 10 ? (f.dt * 1000).toFixed(1) : fmtN(f.dt * 1000)} ms 만에 멈춤` : ''}</text>`;
        });
        out += `<text class="axis-title" x="${((X0 + X1) / 2).toFixed(1)}" y="${Y0 + 40}" text-anchor="middle">${shown ? `네 바닥 모두 충격량(힘 × 시간)은 ${fmt2(a.p)} N·s로 같고, 멈추는 시간이 길수록 힘이 작다` : '같은 높이에서 떨어진 달걀을 네 바닥이 멈출 때'}</text>`;
        return out;
    }

    function noteFor(a) {
        if (a.kind === 'drop') {
            return `<div class="data-row"><span class="data-name">조건</span><span class="data-val">높이 ${a.h} m · ${AIMS[state.aim].label} ${a.v} m/s (옆 ${fmt1(a.vx)} m/s, 세로 ${fmt1(a.vy0)} m/s) · 공기 저항 없음</span></div>` +
                `<div class="data-row"><span class="data-name">놓은 공</span><span class="data-val">${a.tA.toFixed(2)} s 뒤 닿음 · 닿는 속력 ${fmt1(Math.sqrt(2 * G * a.h))} m/s</span></div>` +
                `<div class="data-row"><span class="data-name">던진 공</span><span class="data-val">${a.tB.toFixed(2)} s 뒤 닿음 · 옆으로 ${fmt1(a.range)} m${a.rise ? ` · 먼저 ${fmt1(a.rise)} m 올라감` : ''}</span></div>` +
                `<div class="data-row match"><span class="data-name">차이</span><span class="data-val">${a.verdict === 'same' ? '없음 — 동시에' : `${Math.abs(a.tB - a.tA).toFixed(2)} s, ${a.verdict === 'drop-first' ? '놓은 공이 먼저' : '던진 공이 먼저'}`}</span></div>`;
        }
        if (a.kind === 'orbit') {
            return `<div class="data-row"><span class="data-name">출발</span><span class="data-val">높이 ${ALT / 1000} km 산꼭대기 · 옆으로 ${LAUNCH[state.launch].label} · 공기 없음</span></div>` +
                `<div class="data-row"><span class="data-name">기준 속력</span><span class="data-val">원 궤도 ${(V_CIRC / 1000).toFixed(2)} km/s · 탈출 ${(V_ESC / 1000).toFixed(2)} km/s</span></div>` +
                `<div class="data-row"><span class="data-name">높이 변화</span><span class="data-val">${a.outcome === 'hit' ? `${ALT / 1000} km → 0 (${(a.T / 60).toFixed(1)}분 뒤 떨어짐)` : `가장 낮을 때 ${fmtN(a.minAlt)} km · 가장 높을 때 ${fmtN(a.maxAlt)} km${a.outcome === 'escape' ? ' 넘어 계속' : ''}`}</span></div>` +
                `<div class="data-row match"><span class="data-name">결과</span><span class="data-val">${a.outcome === 'hit' ? `${fmtN(a.rangeKm)} km 가서 떨어짐 (지구 둘레의 ${Math.round(a.deg / 360 * 100)} %)` : a.outcome === 'orbit' ? `한 바퀴 ${(a.T / 60).toFixed(0)}분마다 지구를 돎` : '지구를 떠남'}</span></div>`;
        }
        return `<div class="data-row"><span class="data-name">달걀</span><span class="data-val">${EGG_M * 1000} g (무게 ${fmt2(a.W)} N) · ${a.h} m에서 떨어져 ${fmt1(a.v)} m/s로 닿음 · 운동량 ${fmt2(a.p)} kg·m/s</span></div>` +
            `<div class="data-row"><span class="data-name">바닥</span><span class="data-val">${FLOORS[state.floor].label} · ${depthText(a.d)} 들어가며 ${a.dt * 1000 < 10 ? (a.dt * 1000).toFixed(1) : fmtN(a.dt * 1000)} ms 만에 멈춤</span></div>` +
            `<div class="data-row"><span class="data-name">힘</span><span class="data-val">충격량 ${fmt2(a.p)} N·s ÷ 시간 = 평균 ${a.F < 10 ? fmt1(a.F) : fmtN(a.F)} N (무게의 ${a.ratio < 100 ? fmt1(a.ratio) : fmtN(a.ratio)}배 = 높이 ÷ 들어간 깊이)</span></div>` +
            `<div class="data-row match"><span class="data-name">네 바닥 비교</span><span class="data-val">${a.all.map(f => `${FLOORS[f.key].label} ${f.F < 10 ? fmt1(f.F) : fmtN(f.F)} N`).join(' · ')}</span></div>`;
    }

    function render() {
        const a = analyse();
        mainGroup.innerHTML = a.kind === 'drop' ? renderDrop(a) : a.kind === 'orbit' ? renderOrbit(a) : renderImpact(a);
        graphGroup.innerHTML = a.kind === 'drop' ? graphDrop(a) : a.kind === 'orbit' ? graphOrbit(a) : graphImpact(a);
        stageBadge.textContent = a.kind === 'drop' ? `${a.h} m · ${a.v} m/s · ${AIMS[state.aim].label}`
            : a.kind === 'orbit' ? `${LAUNCH[state.launch].label} · 400 km 높이` : `${a.h} m · ${FLOORS[state.floor].label}`;
        methodHint.textContent = a.kind === 'drop' ? '중력은 아래로만 당기므로 옆 방향 운동에는 손대지 않습니다'
            : a.kind === 'orbit' ? '빠르게 던질수록 떨어지는 동안 더 멀리 가고, 땅은 둥글게 멀어집니다'
                : '멈출 때 힘 × 시간은 정해져 있으니, 시간이 길면 힘이 작습니다';
        dataNote.innerHTML = noteFor(a);
        return a;
    }

    /* --------------------------------------------------------------- run */
    function tick(dt) {
        state.progress = Math.min(1, state.progress + dt / runSeconds());
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
        let s = '';
        if (a.kind === 'drop') {
            labelA.textContent = '놓은 공'; valueA.textContent = `${a.tA.toFixed(2)} s 뒤 닿음`;
            labelB.textContent = '던진 공'; valueB.textContent = `${a.tB.toFixed(2)} s 뒤 닿음 · 옆으로 ${fmt1(a.range)} m`;
            const aim = AIMS[state.aim].phrase;
            s = `높이 ${a.h} m에서 놓은 공은 ${a.tA.toFixed(2)}초 뒤에, ${a.v} m/s로 ${aim} 던진 공은 ${a.tB.toFixed(2)}초 뒤에 땅에 닿았습니다. `;
            if (a.verdict === 'same') s += `옆으로 던진 속력은 세로 운동에 아무 영향을 주지 않습니다. 두 공 모두 세로로는 정지에서 출발해 1초마다 9.8 m/s씩 빨라지며 떨어졌으므로 동시에 닿았고, 던진 공은 그 ${a.tB.toFixed(2)}초 동안 옆으로 ${fmt1(a.vx)} m/s의 일정한 속력으로 ${fmt1(a.range)} m를 나아갔을 뿐입니다. `;
            else if (a.verdict === 'drop-first') s += `위로 던진 공은 세로 속력 ${fmt1(a.vy0)} m/s로 먼저 ${fmt1(a.rise)} m를 올라갔다가 내려오므로 ${(a.tB - a.tA).toFixed(2)}초 늦게 닿았습니다. 옆 방향 속력 ${fmt1(a.vx)} m/s는 그동안 변하지 않아 ${fmt1(a.range)} m를 갔습니다. `;
            else s += `아래로 던진 공은 처음부터 아래 방향 속력 ${fmt1(-a.vy0)} m/s를 가지고 출발하므로 ${(a.tA - a.tB).toFixed(2)}초 먼저 닿았습니다. 옆 방향 속력 ${fmt1(a.vx)} m/s는 그동안 변하지 않아 ${fmt1(a.range)} m를 갔습니다. `;
            const vyEnd = Math.sqrt(a.vy0 * a.vy0 + 2 * G * a.h);
            s += `중력은 아래로만 당기므로 던진 공의 운동은 "옆으로 일정하게 + 아래로 점점 빠르게"를 합친 것이고, 그래서 길이 포물선입니다. 땅에 닿는 순간 놓은 공의 속력은 ${fmt1(Math.sqrt(2 * G * a.h))} m/s, 던진 공은 ${fmt1(Math.hypot(a.vx, vyEnd))} m/s입니다.`;
        } else if (a.kind === 'orbit') {
            const vk = LAUNCH[state.launch].label;
            labelA.textContent = '던진 속력'; valueA.textContent = vk;
            labelB.textContent = '결과'; valueB.textContent = a.outcome === 'hit' ? `${fmtN(a.rangeKm)} km 가서 떨어짐` : a.outcome === 'orbit' ? `지구를 돎 (${(a.T / 60).toFixed(0)}분마다 한 바퀴)` : '지구를 떠남';
            if (a.outcome === 'hit') {
                s = `${vk}로 던진 대포알은 ${fmtN(a.rangeKm)} km, 지구 둘레의 ${Math.round(a.deg / 360 * 100)} %를 날아가 ${(a.T / 60).toFixed(1)}분 뒤 땅에 떨어졌습니다. 중력이 대포알을 계속 아래로 당겨 길이 굽지만, 빠를수록 떨어지는 동안 더 멀리 가고 그 사이 땅이 둥글게 멀어져 떨어지는 데 더 오래 걸립니다. `;
                s += `이 높이에서 ${(V_CIRC / 1000).toFixed(2)} km/s가 되면 떨어지는 만큼 땅이 멀어져 영원히 닿지 않게 됩니다. `;
            } else if (a.outcome === 'orbit' && Math.abs(a.v0 - V_CIRC) < 100) {
                s = `${vk}는 400 km 높이의 원 궤도 속력과 같습니다. 대포알은 계속 지구로 떨어지고 있지만 떨어지는 만큼 지면이 둥글게 멀어져 영원히 땅에 닿지 않고, ${(a.T / 60).toFixed(0)}분마다 지구를 한 바퀴 돕니다. 같은 높이를 도는 국제 우주 정거장이 92분에 한 바퀴 도는 것과 같습니다. `;
            } else if (a.outcome === 'orbit') {
                s = `${vk}는 원 궤도 속력 ${(V_CIRC / 1000).toFixed(2)} km/s보다 빨라 대포알이 지구에서 멀어지다가 되돌아오는 길쭉한 타원을 돕니다. 가장 멀 때 높이는 ${fmtN(a.maxAlt)} km, 그때 속력은 가장 느리고, 다시 가까워지며 빨라져 ${(a.T / 60).toFixed(0)}분마다 한 바퀴 돕니다. `;
            } else {
                s = `${vk}는 이 높이의 탈출 속력 ${(V_ESC / 1000).toFixed(2)} km/s보다 빨라 중력이 붙잡지 못합니다. 멀어질수록 중력이 약해져 속력은 줄지만 0이 되기 전에 한없이 멀어져 지구를 떠납니다. `;
            }
            s += `달도 마찬가지입니다. 지구를 향해 계속 떨어지고 있지만 옆으로 약 1 km/s로 움직여 떨어지는 만큼 지구가 멀어지므로 한 달에 한 번 지구를 돕니다.`;
        } else {
            const fl = FLOORS[state.floor];
            const Fs = a.F < 10 ? fmt1(a.F) : fmtN(a.F), dts = a.dt * 1000 < 10 ? (a.dt * 1000).toFixed(1) : fmtN(a.dt * 1000);
            labelA.textContent = '받은 평균 힘'; valueA.textContent = `${Fs} N (무게의 ${a.ratio < 100 ? fmt1(a.ratio) : fmtN(a.ratio)}배)`;
            labelB.textContent = '달걀'; valueB.textContent = a.broken ? '깨짐' : '안 깨짐';
            const hard = a.all.find(f => f.key === 'concrete'), soft = a.all.find(f => f.key === 'airbag');
            s = `${a.h} m에서 떨어진 달걀은 ${fmt1(a.v)} m/s로 ${fl.label}에 닿아 ${depthText(a.d)} 들어가며 ${dts} ms 만에 멈췄습니다. `;
            s += `멈출 때의 충격량(힘 × 시간)은 운동량 변화와 같아 어느 바닥이든 ${fmt2(a.p)} N·s로 같지만, 멈추는 시간이 ${dts} ms이니 평균 힘은 ${Fs} N — 달걀 무게(${fmt2(a.W)} N)의 ${a.ratio < 100 ? fmt1(a.ratio) : fmtN(a.ratio)}배입니다. 이 배수는 떨어진 높이를 들어간 깊이로 나눈 값과 같습니다. `;
            s += a.broken ? `껍데기가 견디는 약 ${BREAK_N} N을 넘어 깨졌습니다. ` : `${BREAK_N} N보다 작아 깨지지 않았습니다. `;
            s += `같은 높이라도 콘크리트에서는 ${fmtN(hard.F)} N, 공기 든 봉지에서는 ${fmt1(soft.F)} N — 멈추는 시간이 ${Math.round(soft.dt / hard.dt)}배 길어지면 힘은 그만큼 작아집니다. 에어백·안전띠·매트·헬멧의 푹신한 속, 무릎을 굽히며 착지하는 것이 모두 이 원리입니다.`;
        }
        predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
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
        checkBtn.textContent = state.mode === 'drop' ? '동시에 놓기' : state.mode === 'orbit' ? '대포 쏘기' : '떨어뜨리기';
        stageCaption.textContent = state.mode === 'drop' ? '흰 공은 가만히 놓고, 노란 공은 같은 순간에 던집니다. 0.1초마다 자리를 점으로 남깁니다 (느리게 재생).'
            : state.mode === 'orbit' ? '공기가 없는 400 km 높이의 산꼭대기에서 옆으로 던집니다. 지구 중력을 1초마다 계산해 길을 그립니다.'
                : '달걀 60 g을 떨어뜨립니다. 바닥이 들어가는 깊이만큼의 거리에서 일정하게 느려져 멈춘다고 봅니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { height: '20', speed: '10', aim: 'level', launch: '6', drop: '1', floor: 'concrete', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'drop').click();
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

    window.__gravityModel = {
        HEIGHTS, SPEEDS, AIMS, LAUNCH, DROPS, FLOORS, V_CIRC, V_ESC, EGG_M, BREAK_N, state,
        analyse, render, dropCalc, orbitOf, impactCalc,
        runSeconds,
        setMode(m) { modeButtons.find(b => b.dataset.mode === m).click(); },
        set(key, value) { state[key] = value; buildControls(); buildPrediction(); settingsChanged(); },
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
        // 옮긴 것이 없는 실행은 우리 자신이 일으킨 메아리다. 그때 지우면 방금 옮긴 글이 사라진다.
        if (!rows.length && !notes.length && !verdicts.length) return;
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
    document.addEventListener('DOMContentLoaded', run);
})();
