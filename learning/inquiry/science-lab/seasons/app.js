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
    const D2R = Math.PI / 180, R2D = 180 / Math.PI;

    /* -------------------------------------------------------------- data */
    const LAT = 37.5;                // Seoul
    const TILT_REAL = 23.44;
    // the sun's declination on the days the seasons are shown for
    const SEASONS = {
        spring: { label: '봄·가을', hint: '3월 21일 · 9월 23일', dec: 0, colour: '#16a34a', ink: '#15803d' },
        summer: { label: '여름', hint: '6월 21일', dec: TILT_REAL, colour: '#ea580c', ink: '#c2410c' },
        winter: { label: '겨울', hint: '12월 21일', dec: -TILT_REAL, colour: '#0284c7', ink: '#0369a1' },
    };
    const TILTS = [0, 23.44];
    const SPOTS = {
        summer: { label: '여름 자리', hint: '북반구가 태양 쪽으로', sign: 1 },
        winter: { label: '겨울 자리', hint: '북반구가 태양 반대쪽으로', sign: -1 },
    };

    // altitude and azimuth (south = 0, east negative) of the sun at clock hour h
    function sunAt(hour, dec, lat = LAT) {
        const H = 15 * (hour - 12) * D2R, d = dec * D2R, p = lat * D2R;
        const sinAlt = Math.sin(p) * Math.sin(d) + Math.cos(p) * Math.cos(d) * Math.cos(H);
        const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt))) * R2D;
        const cosAlt = Math.cos(alt * D2R);
        // azimuth measured from south toward west
        let az = Math.atan2(Math.sin(H) * Math.cos(d), Math.cos(H) * Math.cos(d) * Math.sin(p) - Math.sin(d) * Math.cos(p)) * R2D;
        void cosAlt;
        return { alt, az };
    }
    const dayLength = (dec, lat = LAT) => {
        const c = -Math.tan(lat * D2R) * Math.tan(dec * D2R);
        if (c <= -1) return 24; if (c >= 1) return 0;
        return 2 * Math.acos(c) * R2D / 15;
    };
    // past the zenith the sun stands north of overhead, so the height folds back
    const noonAlt = (dec, lat = LAT) => { const a = 90 - lat + dec; return a > 90 ? 180 - a : a; };

    const state = {
        mode: 'path',
        season: 'summer',
        tilt: TILT_REAL, spot: 'summer',
        progress: 0, prediction: null,
    };
    let running = false, frameId = 0, lastStamp = 0;

    /* ------------------------------------------------------------ models */
    function analysePath(s = state) {
        const season = SEASONS[s.season];
        const len = dayLength(season.dec);
        const rise = 12 - len / 2, set = 12 + len / 2;
        const noon = noonAlt(season.dec);
        const verdict = noon >= 70 ? 'high' : noon >= 45 ? 'mid' : 'low';
        const shadow = 1 / Math.tan(noon * D2R);      // metre stick at noon
        return { kind: 'path', season, len, rise, set, noon, verdict, shadow };
    }
    const pathHour = (a, p) => 4 + 16 * p;              // the run covers 4 am to 8 pm

    function analyseOrbit(s = state) {
        const spot = SPOTS[s.spot];
        const dec = spot.sign * s.tilt;
        const noon = noonAlt(dec), len = dayLength(dec);
        const other = noonAlt(-dec), otherLen = dayLength(-dec);
        const spread = 1 / Math.sin(noon * D2R);      // how many times wider the same light lands
        const verdict = s.tilt === 0 ? 'none' : spot.sign > 0 ? 'summer' : 'winter';
        return { kind: 'orbit', spot, dec, noon, len, other, otherLen, spread, verdict };
    }

    const analyse = () => (state.mode === 'path' ? analysePath() : analyseOrbit());

    /* ---------------------------------------------------------- controls */
    function pickRow(legend, name, options, current, cols) {
        return `<fieldset class="pick-field"><legend>${legend}</legend>` +
            `<div class="pick-buttons cols${cols}" data-pick="${name}">` +
            options.map(o => `<button type="button" data-value="${o.value}" class="${o.value === String(current) ? 'selected' : ''}">` +
                `${o.label}${o.hint ? `<small>${o.hint}</small>` : ''}</button>`).join('') +
            `</div></fieldset>`;
    }

    function buildControls() {
        if (state.mode === 'path') {
            controlArea.innerHTML = pickRow('계절', 'season', Object.entries(SEASONS).map(([k, v]) => ({ value: k, label: v.label, hint: v.hint })), state.season, 3);
        } else {
            controlArea.innerHTML =
                pickRow('자전축의 기울기', 'tilt', TILTS.map(t => ({ value: String(t), label: t === 0 ? '0°' : '23.5°', hint: t === 0 ? '기울지 않음' : '실제 지구' })), state.tilt, 2) +
                pickRow('지구의 자리', 'spot', Object.entries(SPOTS).map(([k, v]) => ({ value: k, label: v.label, hint: v.hint })), state.spot, 2);
        }
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                const v = button.dataset.value;
                state[group.dataset.pick] = group.dataset.pick === 'tilt' ? Number(v) : v;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                settingsChanged();
            }));
        });
    }

    const PRED_PATH = [{ value: 'high', label: '머리 위 가까이 (70° 넘게)' }, { value: 'mid', label: '중간쯤 (45~70°)' }, { value: 'low', label: '낮게 (45° 아래)' }];
    const PRED_ORBIT = [{ value: 'summer', label: '여름' }, { value: 'winter', label: '겨울' }, { value: 'none', label: '계절 차이 없음' }];

    function buildPrediction() {
        const list = state.mode === 'path' ? PRED_PATH : PRED_ORBIT;
        predictionLegend.textContent = state.mode === 'path' ? '정오에 태양은 얼마나 높이 있을까요?' : '이 자리에서 서울은 어느 계절일까요?';
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction;
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    const hourText = h => { const hh = Math.floor(h), mm = Math.round((h - hh) * 60); return `${hh < 12 ? '오전' : '오후'} ${hh % 12 === 0 ? 12 : hh % 12}시${mm ? ` ${String(mm).padStart(2, '0')}분` : ''}`; };

    function renderPath(a, p) {
        const hour = pathHour(a, p);
        const HX = 230, HY = 172, RX = 200, RY = 150;
        const pos = (alt, az) => ({ x: HX + RX * Math.sin(az * D2R), y: HY - RY * Math.sin(alt * D2R) });
        const up = sunAt(hour, a.season.dec).alt > 0;
        let out = `<rect class="sky${up ? ' day' : ''}" x="12" y="30" width="436" height="${HY - 30}"/>`;
        out += `<rect class="ground" x="12" y="${HY}" width="436" height="24"/>`;
        out += `<line class="horizon-line" x1="12" y1="${HY}" x2="448" y2="${HY}"/>`;
        out += `<text class="dir-text" x="24" y="${HY + 16}">동</text><text class="dir-text" x="${HX}" y="${HY + 16}" text-anchor="middle">남</text><text class="dir-text" x="436" y="${HY + 16}" text-anchor="end">서</text>`;
        // the three paths, this season's drawn bright
        Object.entries(SEASONS).forEach(([k, se]) => {
            const pts = [];
            for (let h = 3; h <= 21; h += 0.25) { const q = sunAt(h, se.dec); if (q.alt >= 0) { const r = pos(q.alt, q.az); pts.push(`${r.x.toFixed(1)},${r.y.toFixed(1)}`); } }
            if (pts.length > 1) out += `<path class="sun-path${k === state.season ? '' : ' other'}" style="stroke:${se.colour}" d="M${pts.join('L')}"/>`;
            const nq = sunAt(12, se.dec), nr = pos(nq.alt, nq.az);
            out += `<text class="axis-text" style="fill:${se.ink || se.colour}" x="${(nr.x + 14).toFixed(1)}" y="${(nr.y + 3).toFixed(1)}">${se.label} ${Math.round(nq.alt)}°</text>`;
        });
        // the sun now, with a metre stick and its shadow on the ground
        const q = sunAt(hour, a.season.dec);
        if (q.alt > 0) {
            const r = pos(q.alt, q.az);
            out += `<circle class="sun-glow" cx="${r.x.toFixed(1)}" cy="${r.y.toFixed(1)}" r="16"/><circle class="sun" cx="${r.x.toFixed(1)}" cy="${r.y.toFixed(1)}" r="8"/>`;
            const SX = 110, SY = HY, stickH = 30;
            const dir = q.az > 0 ? -1 : 1;         // shadow falls away from the sun
            // a low sun throws a long shadow; it stops at the edge of the picture
            const shadowRatio = 1 / Math.tan(q.alt * D2R);
            const shadowLen = Math.min(dir < 0 ? SX - 16 : 440 - SX, stickH * shadowRatio);
            out += `<line class="shadow" x1="${SX}" y1="${SY - 1}" x2="${(SX + dir * shadowLen).toFixed(1)}" y2="${SY - 1}"/>`;
            out += `<line class="stick" x1="${SX}" y1="${SY}" x2="${SX}" y2="${SY - stickH}"/>`;
            out += `<text class="alt-text" x="${SX}" y="${SY - stickH - 6}" text-anchor="middle">그림자 ${shadowRatio > 100 ? '100배 이상' : `${shadowRatio.toFixed(1)}배`}</text>`;
        }
        out += `<text class="sky-text" x="24" y="46">${hourText(hour)}</text>`;
        out += `<text class="sky-text" x="24" y="60">${q.alt > 0 ? `태양 높이 ${Math.round(q.alt)}°` : hour < 12 ? '해 뜨기 전' : '해 진 뒤'}</text>`;
        out += `<text class="verdict-text" fill="#0f172a" x="20" y="16">${a.season.label} · 남중 고도 ${Math.round(a.noon)}° · 낮 ${a.len.toFixed(1)}시간 (${hourText(a.rise)} ~ ${hourText(a.set)})</text>`;
        out += `<text class="note-text" x="20" y="208">1 m 막대의 정오 그림자: ${a.shadow.toFixed(2)} m · 태양이 높을수록 그림자가 짧습니다</text>`;
        return out;
    }

    function renderOrbit(a, p) {
        // left: the sun and the tilted Earth at its place on the orbit, seen from the side
        const SUNX = 150, SUNY = 108;
        let out = `<ellipse class="orbit" cx="${SUNX}" cy="${SUNY}" rx="105" ry="30"/>`;
        out += `<circle class="sun-glow" cx="${SUNX}" cy="${SUNY}" r="22"/><circle class="sun" cx="${SUNX}" cy="${SUNY}" r="13"/>`;
        const spin = p * 360;      // the Earth turns once during the run
        [['summer', -1], ['winter', 1]].forEach(([k, side]) => {
            const EX = SUNX + side * 105, EY = SUNY, R = k === state.spot ? 22 : 13;
            const mine = k === state.spot;
            // the axis keeps its direction in space: tilted to the right by the tilt angle
            const t = state.tilt * D2R;
            out += `<g opacity="${mine ? 1 : 0.5}">`;
            out += `<circle class="earth" cx="${EX}" cy="${EY}" r="${R}"/>`;
            // night side faces away from the sun
            const away = side;     // +1 means the sun is to the left, so night is on the right
            out += `<path class="night" d="M${EX},${EY - R} A${R},${R} 0 0 ${away > 0 ? 1 : 0} ${EX},${EY + R} Z"/>`;
            out += `<line class="earth-axis" x1="${(EX - (R + 6) * Math.sin(t)).toFixed(1)}" y1="${(EY + (R + 6) * Math.cos(t)).toFixed(1)}" x2="${(EX + (R + 6) * Math.sin(t)).toFixed(1)}" y2="${(EY - (R + 6) * Math.cos(t)).toFixed(1)}"/>`;
            out += `<line class="equator" x1="${(EX - R * Math.cos(t)).toFixed(1)}" y1="${(EY - R * Math.sin(t)).toFixed(1)}" x2="${(EX + R * Math.cos(t)).toFixed(1)}" y2="${(EY + R * Math.sin(t)).toFixed(1)}"/>`;
            // Seoul: 37.5° up the axis from the equator, on the side facing the viewer, turning with the day
            if (mine) {
                const lat = LAT * D2R;
                const ang = spin * D2R;
                const ux = Math.cos(lat) * Math.cos(ang), uz = Math.cos(lat) * Math.sin(ang), uy = Math.sin(lat);
                // rotate by the tilt in the picture plane
                const px = EX + R * (ux * Math.cos(t) + uy * Math.sin(t)), py = EY - R * (uy * Math.cos(t) - ux * Math.sin(t));
                if (uz > -0.2) out += `<circle class="here" cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="3"/>`;
            }
            out += `</g>`;
            out += `<text class="season-text" x="${EX}" y="${EY + R + 16}" text-anchor="middle">${SPOTS[k].label}${mine ? '' : ' (반대쪽)'}</text>`;
            if (mine) out += `<text class="axis-text" x="${EX}" y="${EY - R - 12}" text-anchor="middle">북극 쪽</text>`;
        });
        // rays from the sun to the chosen Earth
        const EX = SUNX + (state.spot === 'summer' ? -1 : 1) * 105;
        [-14, 0, 14].forEach(dy => { out += `<line class="ray" x1="${SUNX + (EX > SUNX ? 20 : -20)}" y1="${SUNY + dy}" x2="${EX + (EX > SUNX ? -28 : 28)}" y2="${SUNY + dy}"/>`; });

        // right: the same bundle of light landing on Seoul's ground at noon
        const GX = 300, GW = 140, GY = 168;
        out += `<line class="horizon-line" x1="${GX}" y1="${GY}" x2="${GX + GW}" y2="${GY}"/>`;
        out += `<text class="sky-text" x="${GX}" y="52">서울 정오의 햇빛</text>`;
        const alt = a.noon * D2R, beam = 30;
        const patch = Math.min(GW - 10, beam / Math.sin(alt));
        const cx = GX + GW / 2;
        out += `<rect class="patch" x="${(cx - patch / 2).toFixed(1)}" y="${GY - 4}" width="${patch.toFixed(1)}" height="6"/>`;
        [-1, 0, 1].forEach(k => {
            const x1 = cx + k * (patch / 2) * 0.95, y1 = GY - 2;
            const L = 80;
            out += `<line class="ray" x1="${(x1 - L * Math.cos(alt)).toFixed(1)}" y1="${(y1 - L * Math.sin(alt)).toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1}"/>`;
        });
        out += `<path class="alt-arc" d="M${(cx + patch / 2 + 22).toFixed(1)},${GY - 2} A22,22 0 0 0 ${(cx + patch / 2 + 22 * Math.cos(alt)).toFixed(1)},${(GY - 2 - 22 * Math.sin(alt)).toFixed(1)}"/>`;
        out += `<text class="alt-text" x="${Math.min(cx + patch / 2 + 26, 436).toFixed(1)}" y="${GY - 8}">${Math.round(a.noon)}°</text>`;
        out += `<text class="axis-text" x="${cx}" y="${GY + 14}" text-anchor="middle">빛이 닿는 땅 ${a.spread.toFixed(1)}배 넓이</text>`;
        const VERD = { summer: '여름', winter: '겨울', none: '계절 차이 없음' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">자전축 ${state.tilt === TILT_REAL ? '23.5' : state.tilt}° · ${a.spot.label} → 서울은 ${VERD[a.verdict]} (남중 고도 ${Math.round(a.noon)}°, 낮 ${a.len.toFixed(1)}시간)</text>`;
        out += `<text class="note-text" x="20" y="208">반대쪽 자리에서는 남중 고도 ${Math.round(a.other)}°, 낮 ${a.otherLen.toFixed(1)}시간 · 노란 선은 자전축, 빨간 점은 서울</text>`;
        return out;
    }

    function renderMain(a) {
        mainGroup.innerHTML = a.kind === 'path' ? renderPath(a, state.progress) : renderOrbit(a, state.progress);
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

    // the sun's height through the day, all three seasons, this one traced live
    function graphPath(a) {
        const hour = pathHour(a, state.progress);
        const gx = h => GRAPH.x0 + ((h - 4) / 16) * (GRAPH.x1 - GRAPH.x0);
        const gy = alt => GRAPH.y0 - (alt / 90) * (GRAPH.y0 - GRAPH.y1);
        let out = graphFrame([4, 8, 12, 16, 20].map(h => [`${h}시`, gx(h)]), [30, 60, 90].map(v => [`${v}°`, gy(v)]), '시각', '태양의 높이');
        Object.entries(SEASONS).forEach(([k, se]) => {
            const pts = [];
            for (let h = 4; h <= 20 + 1e-9; h += 0.25) pts.push(`${gx(h).toFixed(1)},${gy(Math.max(0, sunAt(h, se.dec).alt)).toFixed(1)}`);
            out += `<path class="${k === state.season ? 'trace-done' : 'trace other'}" style="stroke:${se.colour}" d="M${pts.join('L')}"/>`;
        });
        const live = [];
        for (let h = 4; h <= hour + 1e-9; h += 0.25) live.push(`${gx(h).toFixed(1)},${gy(Math.max(0, sunAt(h, a.season.dec).alt)).toFixed(1)}`);
        if (live.length > 1) out += `<path class="trace" style="stroke:${a.season.colour}" d="M${live.join('L')}"/>`;
        const now = Math.max(0, sunAt(hour, a.season.dec).alt);
        out += `<circle class="trace-dot" cx="${gx(hour).toFixed(1)}" cy="${gy(now).toFixed(1)}" r="5" fill="${a.season.colour}"/>`;
        let lx = GRAPH.x0 + 8;
        Object.values(SEASONS).forEach(se => { out += `<text class="axis-text" style="fill:${se.ink || se.colour}" x="${lx}" y="${GRAPH.y1 + 14}">— ${se.label}</text>`; lx += 70; });
        return out;
    }

    // this place against the opposite place: noon height, day length, light per patch
    function graphOrbit(a) {
        const rows = [
            { name: '남중 고도', mine: a.noon, other: a.other, max: 90, unit: '°' },
            { name: '낮의 길이', mine: a.len, other: a.otherLen, max: 24, unit: '시간' },
            { name: '한 곳이 받는 빛', mine: Math.sin(a.noon * D2R) * 100, other: Math.sin(a.other * D2R) * 100, max: 100, unit: ' %' },
        ];
        let out = `<text class="axis-title" x="${GRAPH.x0}" y="20">${a.spot.label}(진한 막대)와 반대쪽 자리(옅은 막대) 견주기</text>`;
        rows.forEach((r, i) => {
            const y = 40 + i * 48;
            const w = v => (v / r.max) * 300;
            out += `<text class="bar-text" fill="#0f172a" x="${GRAPH.x0}" y="${y}">${r.name}</text>`;
            out += `<rect class="bar" x="${GRAPH.x0}" y="${y + 6}" width="${w(r.mine).toFixed(1)}" height="11" rx="3" fill="#d97706" opacity=".9"/>`;
            out += `<text class="bar-text" fill="#d97706" x="${(GRAPH.x0 + w(r.mine) + 6).toFixed(1)}" y="${y + 15}">${r.mine.toFixed(r.unit === '시간' ? 1 : 0)}${r.unit}</text>`;
            out += `<rect class="bar" x="${GRAPH.x0}" y="${y + 20}" width="${w(r.other).toFixed(1)}" height="11" rx="3" fill="#0284c7" opacity=".45"/>`;
            out += `<text class="bar-text" fill="#475569" x="${(GRAPH.x0 + w(r.other) + 6).toFixed(1)}" y="${y + 29}">${r.other.toFixed(r.unit === '시간' ? 1 : 0)}${r.unit}</text>`;
        });
        out += `<text class="note-text" x="${GRAPH.x0}" y="190">${state.tilt === 0 ? '기울기가 없으면 두 자리가 똑같아 계절이 생기지 않습니다' : '기울기가 클수록 두 자리의 차이가 커집니다'}</text>`;
        return out;
    }

    function noteFor(a) {
        if (a.kind === 'path') {
            const hour = pathHour(a, state.progress);
            const q = sunAt(hour, a.season.dec);
            return `<div class="data-row"><span class="data-name">계절</span><span class="data-val">${a.season.label} (${a.season.hint}) · 서울</span></div>` +
                `<div class="data-row"><span class="data-name">모형의 일출·일몰</span><span class="data-val">${hourText(a.rise)} ~ ${hourText(a.set)} · 낮 ${a.len.toFixed(1)}시간</span></div>` +
                `<div class="data-row"><span class="data-name">남중 고도</span><span class="data-val">${a.noon.toFixed(1)}°</span></div>` +
                `<div class="data-row"><span class="data-name">지금</span><span class="data-val">${hourText(hour)} · ${q.alt > 0 ? `높이 ${q.alt.toFixed(0)}°` : '지평선 아래'}</span></div>` +
                `<div class="data-row match"><span class="data-name">정오 그림자</span><span class="data-val">1 m 막대에 ${a.shadow.toFixed(2)} m</span></div>` +
                `<p>태양이 가장 높을 때를 12시로 놓은 모형이며 실제 시계 시각과 다릅니다. 긴 그림자는 화면에 맞춰 줄여 그리지만 표시값은 막대 길이에 대한 실제 비율입니다.</p>`;
        }
        return `<div class="data-row"><span class="data-name">자전축</span><span class="data-val">${state.tilt === TILT_REAL ? '23.5' : state.tilt}° 기울어진 채 공전</span></div>` +
            `<div class="data-row"><span class="data-name">${a.spot.label}</span><span class="data-val">남중 고도 ${a.noon.toFixed(1)}° · 낮 ${a.len.toFixed(1)}시간</span></div>` +
            `<div class="data-row"><span class="data-name">반대쪽 자리</span><span class="data-val">남중 고도 ${a.other.toFixed(1)}° · 낮 ${a.otherLen.toFixed(1)}시간</span></div>` +
            `<div class="data-row"><span class="data-name">햇빛의 퍼짐</span><span class="data-val">곧게 비칠 때보다 ${a.spread.toFixed(2)}배 넓은 땅에 — 한 곳이 받는 빛은 ${Math.round(100 / a.spread)} %</span></div>` +
            `<div class="data-row match"><span class="data-name">서울의 계절</span><span class="data-val">${{ summer: '여름', winter: '겨울', none: '계절 차이 없음' }[a.verdict]}</span></div>`;
    }

    function render() {
        const a = analyse();
        renderMain(a);
        graphGroup.innerHTML = a.kind === 'path' ? graphPath(a) : graphOrbit(a);
        stageBadge.textContent = a.kind === 'path' ? `${a.season.label} · 서울` : `${state.tilt === TILT_REAL ? '23.5' : state.tilt}° · ${a.spot.label}`;
        methodHint.textContent = state.mode === 'path'
            ? '여름에는 태양이 높이 떠 낮이 길고, 겨울에는 낮게 떠 낮이 짧습니다'
            : '자전축이 기울어진 채 공전하기 때문에 자리에 따라 햇빛이 비치는 각도가 달라집니다';
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
        if (a.kind === 'path') {
            labelA.textContent = '남중 고도'; labelB.textContent = '낮의 길이';
            valueA.textContent = `${Math.round(a.noon)}°`;
            valueB.textContent = `${a.len.toFixed(1)}시간`;
            predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
                : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
            const others = Object.entries(SEASONS).filter(([k]) => k !== state.season).map(([, se]) => `${se.label} ${Math.round(noonAlt(se.dec))}°`).join(', ');
            explanation.textContent =
                `${a.season.label} 서울에서 태양은 ${hourText(a.rise)}에 떠 ${hourText(a.set)}에 지므로 낮이 ${a.len.toFixed(1)}시간이고, 정오에는 ${Math.round(a.noon)}° 높이까지 오릅니다(다른 계절은 ${others}). ` +
                `1 m 막대의 정오 그림자가 ${a.shadow.toFixed(2)} m인 것으로도 높이를 알 수 있습니다. ` +
                (a.verdict === 'high' ? '태양이 높이 떠 햇빛이 곧게 비치고 낮도 길어 가장 덥습니다.' : a.verdict === 'low' ? '태양이 낮게 떠 햇빛이 비스듬히 비치고 낮도 짧아 가장 춥습니다.' : '여름과 겨울의 중간으로, 낮과 밤의 길이가 거의 같습니다.');
            return;
        }
        labelA.textContent = `${a.spot.label} 남중 고도`; labelB.textContent = '반대쪽 자리';
        valueA.textContent = `${Math.round(a.noon)}°`;
        valueB.textContent = `${Math.round(a.other)}°`;
        predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        let s = '';
        if (state.tilt === 0) s = `자전축이 기울지 않으면 지구가 어느 자리에 있어도 서울의 남중 고도는 ${Math.round(a.noon)}°, 낮은 12시간으로 늘 같습니다. 계절이 생기지 않습니다. 계절은 태양과의 거리가 아니라 자전축의 기울기 때문에 생기는 것입니다.`;
        else if (a.verdict === 'summer') s = `${a.spot.label}에서는 북반구가 태양 쪽으로 기울어져 서울의 남중 고도가 ${Math.round(a.noon)}°까지 오르고 낮이 ${a.len.toFixed(1)}시간입니다. 햇빛이 곧게 비쳐 한 곳이 받는 빛이 많고 낮도 길어 여름이 됩니다. 반대쪽 자리에서는 ${Math.round(a.other)}°, ${a.otherLen.toFixed(1)}시간으로 겨울입니다.`;
        else s = `${a.spot.label}에서는 북반구가 태양 반대쪽으로 기울어져 서울의 남중 고도가 ${Math.round(a.noon)}°밖에 안 되고 낮이 ${a.len.toFixed(1)}시간입니다. 같은 햇빛이 ${a.spread.toFixed(1)}배 넓은 땅에 퍼져 한 곳이 받는 빛이 적고 낮도 짧아 겨울이 됩니다. 반대쪽 자리에서는 ${Math.round(a.other)}°, ${a.otherLen.toFixed(1)}시간으로 여름입니다.`;
        if (state.tilt === 45) s += ` 기울기를 45°로 키우면 두 자리의 차이가 훨씬 커져 계절 차이도 더 심해집니다.`;
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
        stageCaption.textContent = state.mode === 'path'
            ? '서울에서 남쪽을 바라본 하늘입니다. 점선은 다른 계절의 태양의 길입니다.'
            : '왼쪽은 옆에서 본 지구의 공전, 오른쪽은 같은 햇빛이 서울 땅에 닿는 모습입니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { season: 'summer', tilt: TILT_REAL, spot: 'summer', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'path').click();
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

    window.__seasonModel = {
        SEASONS, TILTS, SPOTS, LAT, state,
        analysePath, analyseOrbit, analyse, sunAt, dayLength, noonAlt, render,
        runSeconds: () => RUN_SECONDS,
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
