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

    const RHO = 1.2;              // kg per cubic metre of air
    const CORIOLIS = 1.031e-4;    // at 45 degrees north
    const DP_HPA = 4;             // pressure step between neighbouring isobars
    const CROSS = 25 * Math.PI / 180;  // surface wind crosses isobars by this much
    const MAP_SCALE = 0.25;       // pixels per km on the chart
    const MAP_CX = 230, MAP_CY = 108;
    const FLOW_PX = 1.2;          // pixels per second of drawn flow, per m/s of wind
    const EXAG = 26;              // fronts are far too shallow to draw truthfully
    const PASS_H = 16;            // hour the front reaches us
    const GRAPH = { x0: 64, x1: 424, y0: 150, y1: 30 };

    const FRONTS = {
        cold: { label: '한랭 전선', slope: 1 / 50, speed: 40, cloud: '적운형 (수직으로 두꺼운 구름)',
                rainKm: 60, before: 22, after: 14, shift: 1, ahead: false, steep: '가파릅니다',
                how: '찬 공기가 따뜻한 공기 아래로 파고들며 따뜻한 공기를 급하게 밀어 올려 적운형 구름이 높이 솟습니다',
                afterText: '기온이 뚝 떨어지고 날이 갭니다' },
        warm: { label: '온난 전선', slope: 1 / 200, speed: 25, cloud: '층운형 (옆으로 넓은 구름)',
                rainKm: 350, before: 8, after: 14, shift: 4, ahead: true, steep: '완만합니다',
                how: '따뜻한 공기가 찬 공기 위를 천천히 타고 오르며 층운형 구름이 넓게 퍼집니다',
                afterText: '기온이 올라가고 비가 그칩니다' },
        // the summer rain front: it barely moves, so the weather hardly changes
        stay: { label: '정체 전선', slope: 1 / 150, speed: 5, cloud: '층운형 (오래 머무는 구름)',
                rainKm: 100, before: 20, after: 20, shift: 6, ahead: true, steep: '완만합니다',
                how: '찬 공기와 따뜻한 공기의 힘이 비슷해 어느 쪽도 밀어내지 못하고 한자리에 머뭅니다',
                afterText: '기온이 거의 그대로이고 비가 오래 이어집니다' },
    };

    const state = { mode: 'wind', system: 'low', spacing: 200, front: 'cold', prediction: null };

    /* ------------------------------------------------------------ models */
    // Pressure pushing sideways, balanced against the Earth's turning.
    function analyseWind(spacing = state.spacing, system = state.system) {
        const gradient = (DP_HPA * 100) / (spacing * 1000);   // pascals per metre
        const v = gradient / (RHO * CORIOLIS);                 // metres per second
        const kmh = v * 3.6;
        const strength = v >= 20 ? 'strong' : v < 10 ? 'weak' : 'medium';
        return { kind: 'wind', spacing, system, gradient, v, kmh, strength, low: system === 'low' };
    }

    function analyseFront(key = state.front) {
        const f = FRONTS[key];
        const rainHours = f.rainKm / f.speed;
        const rain = f.ahead ? [PASS_H - rainHours, PASS_H] : [PASS_H - 0.2, PASS_H - 0.2 + rainHours];
        const change = f.after - f.before;
        const verdict = change > 0.5 ? 'up' : change < -0.5 ? 'down' : 'same';
        return { kind: 'front', key, f, rainHours, rain, change, verdict };
    }

    const analyse = () => (state.mode === 'wind' ? analyseWind() : analyseFront());

    // Temperature at any hour of the day as the front sweeps past.
    function tempAt(h, a) {
        const f = a.f, half = f.shift / 2;
        if (h <= PASS_H - half) return f.before;
        if (h >= PASS_H + half) return f.after;
        return f.before + (f.after - f.before) * ((h - (PASS_H - half)) / f.shift);
    }

    /* ---------------------------------------------------------- controls */
    function buildControls() {
        if (state.mode === 'wind') {
            controlArea.innerHTML =
                `<fieldset class="pick-field"><legend>기압계</legend><div class="pick-buttons" data-pick="system">` +
                `<button type="button" data-value="low" class="${state.system === 'low' ? 'selected' : ''}">저기압<small>가운데가 낮다</small></button>` +
                `<button type="button" data-value="high" class="${state.system === 'high' ? 'selected' : ''}">고기압<small>가운데가 높다</small></button>` +
                `</div></fieldset>` +
                `<div class="range-heading"><label for="spacingRange">등압선 간격</label><output id="spacingOut" for="spacingRange"></output></div>` +
                `<input id="spacingRange" type="range" min="100" max="500" step="50" value="${state.spacing}">` +
                `<div class="range-scale" aria-hidden="true"><span>100km</span><span>300km</span><span>500km</span></div>`;
        } else {
            controlArea.innerHTML =
                `<fieldset class="pick-field"><legend>전선의 종류</legend><div class="pick-buttons" data-pick="front">` +
                `<button type="button" data-value="cold" class="${state.front === 'cold' ? 'selected' : ''}">한랭 전선<small>찬 공기가 밀고 옴</small></button>` +
                `<button type="button" data-value="warm" class="${state.front === 'warm' ? 'selected' : ''}">온난 전선<small>따뜻한 공기가 타고 옴</small></button>` +
                `<button type="button" data-value="stay" class="${state.front === 'stay' ? 'selected' : ''}">정체 전선<small>장마 전선 · 거의 안 움직임</small></button>` +
                `</div></fieldset>`;
        }
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                changed();
            }));
        });
        const el = document.getElementById('spacingRange');
        if (el) el.addEventListener('input', () => { state.spacing = Number(el.value); changed(); });
    }

    const PRED_WIND = [{ v: 'strong', t: '세다' }, { v: 'medium', t: '보통이다' }, { v: 'weak', t: '약하다' }];
    const PRED_FRONT = [{ v: 'up', t: '올라간다' }, { v: 'same', t: '그대로다' }, { v: 'down', t: '내려간다' }];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list = state.mode === 'wind' ? PRED_WIND : PRED_FRONT;
        predictionLegend.textContent = state.mode === 'wind' ? '바람의 세기는 어떨까요?' : '전선이 지나간 뒤 기온은?';
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.v}">${o.t}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    function windVector(theta, low) {
        // along the isobars, then tilted a little towards the low pressure
        const t = low ? [Math.sin(theta), -Math.cos(theta)] : [-Math.sin(theta), Math.cos(theta)];
        const radial = [Math.cos(theta), Math.sin(theta)];
        const sign = low ? -1 : 1;
        const x = t[0] * Math.cos(CROSS) + sign * radial[0] * Math.sin(CROSS);
        const y = t[1] * Math.cos(CROSS) + sign * radial[1] * Math.sin(CROSS);
        const n = Math.hypot(x, y);
        return [x / n, y / n];
    }

    function renderWind(a) {
        const stepPx = a.spacing * MAP_SCALE;
        const dur = 18 / (a.v * FLOW_PX);
        let body = '';
        const rings = [];
        for (let k = 1; k * stepPx <= 168; k += 1) rings.push(k * stepPx);
        rings.forEach((r, i) => {
            const hpa = a.low ? 992 + (i + 1) * DP_HPA : 1032 - (i + 1) * DP_HPA;
            body += `<circle class="isobar" cx="${MAP_CX}" cy="${MAP_CY}" r="${r.toFixed(1)}"/>`;
            // the same circle again, dashed and flowing, so the wind speed is visible
            body += `<circle class="isoflow${a.low ? '' : ' high'}" cx="${MAP_CX}" cy="${MAP_CY}" r="${r.toFixed(1)}" ` +
                    `stroke-dasharray="10 8" opacity=".8">` +
                    `<animate attributeName="stroke-dashoffset" from="${a.low ? 18 : 0}" to="${a.low ? 0 : 18}" ` +
                    `dur="${dur.toFixed(3)}s" repeatCount="indefinite"/></circle>`;
            // On a line out to the right, not at the top of each circle: a wide
            // circle's top is off the chart and its label would vanish.
            const every = stepPx < 30 ? 2 : 1;
            if (i % every === 0) {
                body += `<text class="iso-text" x="${(MAP_CX + r).toFixed(1)}" y="${MAP_CY - 5}" text-anchor="middle">${hpa}</text>`;
            }
        });
        // arrows so the turning direction is unmistakable
        const ring = rings[Math.min(1, rings.length - 1)];
        for (let i = 0; i < 8; i += 1) {
            const th = (i / 8) * Math.PI * 2;
            const px = MAP_CX + ring * Math.cos(th), py = MAP_CY + ring * Math.sin(th);
            const [ux, uy] = windVector(th, a.low);
            const len = 9 + a.v * 0.7;
            const ex = px + ux * len, ey = py + uy * len;
            const cls = a.low ? 'cross-arrow inward' : 'cross-arrow outward';
            const ax = ux * 6, ay = uy * 6, nx = -uy * 4, ny = ux * 4;
            body += `<line class="${cls}" x1="${px.toFixed(1)}" y1="${py.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}"/>`;
            body += `<path class="${cls}" d="M${(ex - ax + nx).toFixed(1)},${(ey - ay + ny).toFixed(1)} L${ex.toFixed(1)},${ey.toFixed(1)} ` +
                    `L${(ex - ax - nx).toFixed(1)},${(ey - ay - ny).toFixed(1)}"/>`;
        }
        let out = `<g clip-path="url(#mapClip)">${body}</g>`;
        out += `<text class="centre-mark ${a.low ? 'low' : 'high'}" x="${MAP_CX}" y="${MAP_CY + 8}" text-anchor="middle">${a.low ? '저' : '고'}</text>`;

        // what the rising or sinking air does to the sky
        if (a.low) {
            out += `<ellipse class="cloud" cx="368" cy="52" rx="26" ry="11"/><ellipse class="cloud" cx="356" cy="46" rx="16" ry="10"/>`;
            for (let i = 0; i < 4; i += 1) out += `<line class="rain" x1="${350 + i * 12}" y1="64" x2="${347 + i * 12}" y2="74"><animate attributeName="opacity" values="0;1;0" dur="1.1s" begin="${(i * 0.25).toFixed(2)}s" repeatCount="indefinite"/></line>`;
            out += `<text class="small-label" x="368" y="88" text-anchor="middle">상승 기류 → 흐리고 비</text>`;
        } else {
            out += `<circle class="sun" cx="368" cy="52" r="13"/>`;
            for (let i = 0; i < 8; i += 1) {
                const th = (i / 8) * Math.PI * 2;
                out += `<line class="rain" style="stroke:#d97706" x1="${(368 + 17 * Math.cos(th)).toFixed(1)}" y1="${(52 + 17 * Math.sin(th)).toFixed(1)}" ` +
                       `x2="${(368 + 22 * Math.cos(th)).toFixed(1)}" y2="${(52 + 22 * Math.sin(th)).toFixed(1)}"/>`;
            }
            out += `<text class="small-label" x="368" y="88" text-anchor="middle">하강 기류 → 맑음</text>`;
        }

        out += `<text class="part-label" x="20" y="20">${a.low ? '저기압' : '고기압'} · 등압선 간격 ${a.spacing} km · 등압선 사이 ${DP_HPA} hPa</text>`;
        out += `<text class="read-text" x="20" y="200">바람 ${a.v.toFixed(1)} m/s (시속 ${a.kmh.toFixed(0)} km)</text>`;
        out += `<text class="note-text" x="240" y="200">화면의 흐름 빠르기는 바람 세기에 비례합니다</text>`;
        mainGroup.innerHTML = out;
    }

    function renderFront(a) {
        const f = a.f, GROUND = 170, X0 = 40, X1 = 420, FX = 230;
        const drawnSlope = f.slope * EXAG;
        let body = '';
        body += `<rect class="warm-air" x="${X0}" y="30" width="${X1 - X0}" height="${GROUND - 30}"/>`;
        if (a.key === 'cold') {
            // cold air pushes in from the left and wedges under the warm air
            const rise = (FX - X0) * drawnSlope * 4;
            body += `<path class="cold-air" d="M${X0},${GROUND} L${FX},${GROUND} L${X0},${(GROUND - rise).toFixed(1)} Z"/>`;
            body += `<path class="front-line cold" d="M${FX},${GROUND} L${X0},${(GROUND - rise).toFixed(1)}"/>`;
            for (let i = 0; i < 4; i += 1) {
                const t = 0.12 + i * 0.22;
                const px = FX + (X0 - FX) * t, py = GROUND - rise * t;
                body += `<path class="front-mark cold" d="M${px.toFixed(1)},${py.toFixed(1)} l7,-3 l-1,8 Z"/>`;
            }
            body += `<ellipse class="cloud tall" cx="${FX + 6}" cy="62" rx="24" ry="16"/>`;
            body += `<ellipse class="cloud tall" cx="${FX + 6}" cy="90" rx="18" ry="14"/>`;
            body += `<text class="small-label" x="${FX + 40}" y="56">적운형 구름</text>`;
            for (let i = 0; i < 6; i += 1) {
                const x = FX - 14 + i * 8;
                body += `<line class="rain" x1="${x}" y1="106" x2="${x - 3}" y2="118">` +
                        `<animate attributeName="opacity" values="0;1;0" dur="0.6s" begin="${(i * 0.1).toFixed(2)}s" repeatCount="indefinite"/></line>`;
            }
        } else {
            // warm air slides up over the cold air that is already here
            const rise = (X1 - FX) * drawnSlope * 4;
            body += `<path class="cold-air" d="M${X1},${GROUND} L${FX},${GROUND} L${X1},${(GROUND - rise).toFixed(1)} Z"/>`;
            body += `<path class="front-line warm" d="M${FX},${GROUND} L${X1},${(GROUND - rise).toFixed(1)}"/>`;
            for (let i = 0; i < 4; i += 1) {
                const t = 0.12 + i * 0.22;
                const px = FX + (X1 - FX) * t, py = GROUND - rise * t;
                // a stationary front is drawn with the two symbols alternating,
                // each pointing at the air mass it is pushing against
                if (a.key === 'stay' && i % 2 === 1) {
                    body += `<path class="front-mark cold" d="M${px.toFixed(1)},${(py + 4).toFixed(1)} l7,3 l-1,-8 Z"/>`;
                } else {
                    body += `<circle class="front-mark warm" cx="${px.toFixed(1)}" cy="${(py - 4).toFixed(1)}" r="4"/>`;
                }
            }
            for (let i = 0; i < 4; i += 1) {
                body += `<ellipse class="cloud" cx="${FX + 34 + i * 44}" cy="${88 - i * 9}" rx="30" ry="8"/>`;
            }
            body += `<text class="small-label" x="${FX + 40}" y="56">${a.key === 'stay' ? '한자리에 머물며 계속 비를 뿌립니다' : '층운형 구름이 넓게 퍼집니다'}</text>`;
            for (let i = 0; i < 10; i += 1) {
                const x = FX + 30 + i * 17;
                body += `<line class="rain" x1="${x}" y1="112" x2="${x - 2}" y2="122" opacity=".7">` +
                        `<animate attributeName="opacity" values="0;.8;0" dur="1.4s" begin="${(i * 0.12).toFixed(2)}s" repeatCount="indefinite"/></line>`;
            }
        }
        body += `<rect class="ground" x="${X0}" y="${GROUND}" width="${X1 - X0}" height="14"/>`;
        let out = `<g clip-path="url(#mapClip)">${body}</g>`;
        out += `<line class="move-arrow" x1="${FX - 26}" y1="${GROUND + 26}" x2="${FX + 30}" y2="${GROUND + 26}"/>`;
        out += `<path class="move-arrow" d="M${FX + 23},${GROUND + 21} L${FX + 30},${GROUND + 26} L${FX + 23},${GROUND + 31}"/>`;
        out += `<text class="small-label" x="${FX + 38}" y="${GROUND + 30}">시속 ${f.speed} km로 이동${a.key === 'stay' ? ' — 거의 제자리' : ''}</text>`;
        out += `<text class="small-label" x="${X0 + 4}" y="${GROUND - 6}">${a.key === 'cold' ? '찬 공기' : '따뜻한 공기'}</text>`;
        out += `<text class="small-label" x="${X1 - 4}" y="${GROUND - 6}" text-anchor="end">${a.key === 'cold' ? '따뜻한 공기' : '찬 공기'}</text>`;
        out += `<text class="part-label" x="20" y="20">${f.label} — 기울기 1/${Math.round(1 / f.slope)} · 높이는 ${EXAG}배로 그렸습니다</text>`;
        out += `<text class="note-text" x="20" y="208">비가 내리는 폭 ${f.rainKm} km ÷ 시속 ${f.speed} km = ${a.rainHours.toFixed(1)}시간 동안 비</text>`;
        mainGroup.innerHTML = out;
    }

    /* ------------------------------------------------------------ graphs */
    function graphWind(a) {
        const gx = s => GRAPH.x0 + ((s - 100) / 400) * (GRAPH.x1 - GRAPH.x0);
        const vmax = 36;
        const gy = v => GRAPH.y0 - (v / vmax) * (GRAPH.y0 - GRAPH.y1);
        let out = '';
        [9, 18, 27, 36].forEach(v => {
            out += `<line class="grid-line" x1="${GRAPH.x0}" y1="${gy(v).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(v).toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(gy(v) + 3).toFixed(1)}" text-anchor="end">${v}</text>`;
        });
        [100, 200, 300, 400, 500].forEach(s => {
            out += `<text class="axis-text" x="${gx(s).toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${s}</text>`;
        });
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-title" x="${((GRAPH.x0 + GRAPH.x1) / 2).toFixed(1)}" y="${GRAPH.y0 + 32}" text-anchor="middle">등압선 간격 (km)</text>`;
        out += `<text class="axis-title" x="${GRAPH.x0}" y="${GRAPH.y1 - 10}">바람 (m/s)</text>`;
        [[20, '센 바람'], [10, '약한 바람']].forEach(([v, name]) => {
            out += `<line class="pass-line" x1="${GRAPH.x0}" y1="${gy(v).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(v).toFixed(1)}"/>`;
            out += `<text class="pass-text" x="${GRAPH.x1 - 4}" y="${(gy(v) - 4).toFixed(1)}" text-anchor="end">${name} ${v} m/s</text>`;
        });
        const pts = [];
        for (let s = 100; s <= 500; s += 4) pts.push(`${gx(s).toFixed(1)},${gy(analyseWind(s).v).toFixed(1)}`);
        out += `<path class="trace" d="M${pts.join('L')}"/>`;
        out += `<circle class="trace-dot" cx="${gx(a.spacing).toFixed(1)}" cy="${gy(a.v).toFixed(1)}" r="5" fill="#d97706"/>`;
        graphGroup.innerHTML = out;
    }

    function graphFront(a) {
        const gx = h => GRAPH.x0 + (h / 24) * (GRAPH.x1 - GRAPH.x0);
        const gy = t => GRAPH.y0 - ((t - 4) / 22) * (GRAPH.y0 - GRAPH.y1);
        let out = '';
        out += `<rect class="rain-band" x="${gx(Math.max(0, a.rain[0])).toFixed(1)}" y="${GRAPH.y1}" ` +
               `width="${(gx(Math.min(24, a.rain[1])) - gx(Math.max(0, a.rain[0]))).toFixed(1)}" height="${GRAPH.y0 - GRAPH.y1}"/>`;
        [4, 10, 16, 22, 26].forEach(t => {
            out += `<line class="grid-line" x1="${GRAPH.x0}" y1="${gy(t).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(t).toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(gy(t) + 3).toFixed(1)}" text-anchor="end">${t}</text>`;
        });
        [0, 6, 12, 18, 24].forEach(h => {
            out += `<text class="axis-text" x="${gx(h).toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${h}</text>`;
        });
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-title" x="${((GRAPH.x0 + GRAPH.x1) / 2).toFixed(1)}" y="${GRAPH.y0 + 32}" text-anchor="middle">시각 (시)</text>`;
        out += `<text class="axis-title" x="${GRAPH.x0}" y="${GRAPH.y1 - 10}">기온 (℃)</text>`;
        out += `<line class="pass-line" x1="${gx(PASS_H).toFixed(1)}" y1="${GRAPH.y1}" x2="${gx(PASS_H).toFixed(1)}" y2="${GRAPH.y0}"/>`;
        out += `<text class="pass-text" x="${(gx(PASS_H) + 5).toFixed(1)}" y="${GRAPH.y1 + 10}">전선 통과</text>`;
        out += `<text class="band-text" x="${(gx(Math.max(0, a.rain[0])) + 4).toFixed(1)}" y="${GRAPH.y0 - 6}">비 ${a.rainHours.toFixed(1)}시간</text>`;
        const pts = [];
        for (let h = 0; h <= 24; h += 0.25) pts.push(`${gx(h).toFixed(1)},${gy(tempAt(h, a)).toFixed(1)}`);
        out += `<path class="trace" d="M${pts.join('L')}"/>`;
        graphGroup.innerHTML = out;
    }

    /* ------------------------------------------------------------ render */
    function render() {
        const a = analyse();
        if (a.kind === 'wind') { renderWind(a); graphWind(a); } else { renderFront(a); graphFront(a); }
        const sp = document.getElementById('spacingOut');
        if (sp) sp.textContent = `${state.spacing} km`;
        methodHint.textContent = state.mode === 'wind'
            ? '등압선 간격이 좁을수록 바람이 셉니다'
            : '전선이 지나가면 기온과 날씨가 달라집니다';
        stageBadge.textContent = a.kind === 'wind'
            ? `${a.low ? '저기압' : '고기압'} · ${a.v.toFixed(1)} m/s`
            : `${a.f.label} · 기온 ${a.change > 0 ? '+' : ''}${a.change} ℃`;
        dataNote.innerHTML = a.kind === 'wind'
            ? `<div class="data-row"><span class="data-name">기압 차이</span><span class="data-val">${a.spacing} km 마다 ${DP_HPA} hPa</span></div>` +
              `<div class="data-row"><span class="data-name">기압 경도</span><span class="data-val">${(DP_HPA * 100)} Pa ÷ ${(a.spacing * 1000).toLocaleString()} m = ${a.gradient.toFixed(4)} Pa/m</span></div>` +
              `<div class="data-row"><span class="data-name">바람</span><span class="data-val">${a.v.toFixed(1)} m/s · 시속 ${a.kmh.toFixed(0)} km</span></div>` +
              `<div class="data-row"><span class="data-name">부는 방향</span><span class="data-val">${a.low ? '시계 반대 방향으로 불어 들어옴' : '시계 방향으로 불어 나감'}</span></div>` +
              `<div class="data-row match"><span class="data-name">세기</span><span class="data-val">${STRENGTH[a.strength]}</span></div>`
            : `<div class="data-row"><span class="data-name">전선면 기울기</span><span class="data-val">1/${Math.round(1 / a.f.slope)} — ${a.key === 'cold' ? '가파릅니다' : '완만합니다'}</span></div>` +
              `<div class="data-row"><span class="data-name">구름</span><span class="data-val">${a.f.cloud}</span></div>` +
              `<div class="data-row"><span class="data-name">비 오는 구역</span><span class="data-val">폭 ${a.f.rainKm} km ÷ 시속 ${a.f.speed} km = ${a.rainHours.toFixed(1)}시간</span></div>` +
              `<div class="data-row"><span class="data-name">기온</span><span class="data-val">${a.f.before} ℃ → ${a.f.after} ℃ (${a.change > 0 ? '+' : ''}${a.change} ℃)</span></div>` +
              `<div class="data-row match"><span class="data-name">지나간 뒤</span><span class="data-val">${a.f.afterText}</span></div>`;
        return a;
    }

    const STRENGTH = { strong: '세다', medium: '보통이다', weak: '약하다' };
    // '이다'만 인용형이 '-라고'입니다. '보통이다고'는 틀린 말입니다.
    const STRENGTH_QUOTE = { strong: '세다고', medium: '보통이라고', weak: '약하다고' };

    function check() {
        const a = render();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        if (a.kind === 'wind') {
            labelA.textContent = '바람의 세기'; labelB.textContent = '부는 방향';
            valueA.textContent = `${a.v.toFixed(1)} m/s`;
            valueB.textContent = a.low ? '시계 반대 · 안쪽' : '시계 방향 · 바깥쪽';
            predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
                : state.prediction === a.strength ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
            const other = analyseWind(state.spacing === 100 ? 400 : 100);
            explanation.textContent =
                `${a.spacing} km 마다 ${DP_HPA} hPa 씩 차이가 나므로 1 m 당 기압 차이는 ${a.gradient.toFixed(4)} Pa 입니다. ` +
                `같은 위도 등 다른 조건을 고정한 가상 모형에서는 ${a.v.toFixed(1)} m/s로 표시됩니다. 실제 관측값이나 기상 예보가 아닙니다. ${STRENGTH_QUOTE[a.strength]} 할 수 있습니다. ` +
                `같은 기압 차이라도 간격이 ${other.spacing} km 라면 ${other.v.toFixed(1)} m/s로 ${other.v > a.v ? '더 세집니다' : '약해집니다'}. ` +
                `등압선이 촘촘할수록 바람이 세다는 뜻입니다. ` +
                (a.low
                    ? `북반구 저기압에서는 바람이 시계 반대 방향으로 안쪽으로 불어 들어오고, 모인 공기가 위로 올라가 구름이 생깁니다.`
                    : `북반구 고기압에서는 바람이 시계 방향으로 바깥으로 불어 나가고, 빈자리를 채우려 공기가 내려와 날이 맑습니다.`);
            return;
        }
        labelA.textContent = '기온 변화'; labelB.textContent = '비 오는 시간';
        valueA.textContent = `${a.f.before} ℃ → ${a.f.after} ℃`;
        valueB.textContent = `${a.rainHours.toFixed(1)} 시간`;
        predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        const other = analyseFront(a.key === 'cold' ? 'warm' : 'cold');
        explanation.textContent =
            `${a.f.label}의 전선면은 기울기가 1/${Math.round(1 / a.f.slope)}로 ${a.f.steep}. ` +
            `${a.f.how}. ` +
            `비가 내리는 구역의 폭이 ${a.f.rainKm} km 이고 시속 ${a.f.speed} km로 움직이므로 ${a.rainHours.toFixed(1)}시간 동안 비가 옵니다. ` +
            `${other.f.label}은 ${other.rainHours.toFixed(1)}시간이니 ${a.rainHours > other.rainHours ? '훨씬 오래' : '훨씬 짧게'} 옵니다. ` +
            (a.change === 0
                ? `어느 공기도 밀려나지 않아 기온은 ${a.f.before} ℃ 그대로입니다. 우리나라 장마가 이런 전선입니다.`
                : `지나간 뒤에는 ${a.change > 0 ? '따뜻한' : '찬'} 공기가 들어와 기온이 ${a.f.before} ℃ 에서 ${a.f.after} ℃로 ${a.change > 0 ? '올라갑니다' : '떨어집니다'}.`);
    }

    function changed() {
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
        stageCaption.textContent = state.mode === 'wind'
            ? '북반구 지표 부근 바람은 등압선을 비스듬히 가로질러, 저기압으로 들어가고 고기압에서 나갑니다.'
            : '구름의 모양과 비가 내리는 폭이 어떻게 다른지 보세요.';
        changed();
    }));
    checkBtn.addEventListener('click', check);
    resetBtn.addEventListener('click', () => {
        Object.assign(state, { system: 'low', spacing: 200, front: 'cold', prediction: null });
        modeButtons.find(b => b.dataset.mode === 'wind').click();
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

    window.__weatherModel = {
        RHO, CORIOLIS, DP_HPA, CROSS, MAP_SCALE, MAP_CX, MAP_CY, EXAG, PASS_H, FRONTS, state,
        analyseWind, analyseFront, analyse, tempAt, windVector, render, check,
        setMode(m) { modeButtons.find(b => b.dataset.mode === m).click(); },
        set(key, value) { state[key] = value; buildControls(); changed(); },
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
