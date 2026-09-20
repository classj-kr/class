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

    const RUN_SECONDS = 8;

    /* -------------------------------------------------------------- data */
    // Solar: a south-facing panel at Seoul's latitude on three days of the year.
    const SEASONS = {
        summer: { label: '여름 (하지)', short: '여름', hint: '한낮 높이 76°', dec: 23.44 },
        equinox: { label: '봄·가을 (춘분)', short: '봄·가을', hint: '한낮 높이 53°', dec: 0 },
        winter: { label: '겨울 (동지)', short: '겨울', hint: '한낮 높이 29°', dec: -23.44 },
    };
    const WEATHERS = {
        clear: { label: '맑음', hint: '햇빛이 곧게 듦' },
        cloudy: { label: '흐림', hint: '구름에 흩어져 듦' },
    };
    const TILTS = {
        '0': { label: '눕혀 놓기', deg: 0, color: '#b45309' },
        '35': { label: '비스듬히', deg: 35, color: '#0284c7' },
        '70': { label: '많이 세우기', deg: 70, color: '#059669' },
    };
    const LAT = 37.5, PANEL_AREA = 1.6, PANEL_EFF = 0.20;   // one household panel, 320 W at 1000 W/m²
    const DIFFUSE_SHARE = 0.12;      // clear-sky diffuse light, as a share of the direct beam on the ground
    const CLOUD_FACTOR = 0.3;        // an overcast sky passes about a third of the clear-sky light, all of it scattered
    const DAY_START = 4, DAY_END = 20, STEP_H = 1 / 6;

    // Wind: power in the wind is ½ρAv³; a good rotor keeps about 40 % of it.
    const WINDS = {
        '3': { label: '3 m/s', hint: '나뭇잎 흔들림' },
        '6': { label: '6 m/s', hint: '깃발 펄럭임' },
        '12': { label: '12 m/s', hint: '우산 뒤집힘' },
    };
    const BLADES = { '10': { label: '10 m' }, '20': { label: '20 m' }, '40': { label: '40 m' } };
    const REF = { wind: 6, blade: 20 };
    const RHO = 1.2, CP = 0.4, TSR = 7;          // air density, power coefficient, tip-speed ratio

    // Chain: 100 J leave the plant, cross the grid, and end in a lamp.
    const PLANTS = {
        coal: { label: '석탄 화력', eff: 0.40, hint: '연료 → 증기 → 터빈', waste: '뜨거운 연기와 냉각수' },
        gas: { label: '가스 복합 화력', eff: 0.55, hint: '가스 터빈 + 증기 터빈', waste: '연기와 냉각수' },
        hydro: { label: '수력', eff: 0.90, hint: '떨어지는 물 → 터빈', waste: '물의 마찰과 발전기의 열' },
    };
    const GRID_EFF = 0.95;
    const LAMPS = {
        bulb: { label: '백열등', eun: '백열등은', eff: 0.05, hint: '필라멘트가 달아올라 빛' },
        cfl: { label: '형광등', eun: '형광등은', eff: 0.20, hint: '기체가 자외선, 형광 물질이 빛' },
        led: { label: 'LED', eun: 'LED는', eff: 0.40, hint: '반도체가 곧바로 빛' },
    };
    const SUPPLY_J = 100;

    const state = {
        mode: 'solar',
        season: 'equinox', weather: 'clear',
        wind: '12', blade: '20',
        plant: 'coal', lamp: 'bulb',
        progress: 0, prediction: null,
    };
    let running = false, frameId = 0, lastStamp = 0;

    const D2R = Math.PI / 180;
    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const fmtP = W => W >= 1e6 ? `${(W / 1e6).toFixed(2)} MW` : W >= 1e4 ? `${Math.round(W / 1e3)} kW` : W >= 1e3 ? `${(W / 1e3).toFixed(1)} kW` : `${Math.round(W)} W`;
    const fmtN = n => Math.round(n).toLocaleString('ko-KR');
    const fmtJ = v => (Math.round(v * 10) / 10).toString();

    /* ------------------------------------------------------------ models */
    // where the sun is: altitude and azimuth (from south, west positive)
    function sunAt(hour, decDeg) {
        const lat = LAT * D2R, dec = decDeg * D2R, H = (hour - 12) * 15 * D2R;
        const sinAlt = Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(H);
        const alt = Math.asin(clamp(sinAlt, -1, 1));
        const cosAz = clamp((sinAlt * Math.sin(lat) - Math.sin(dec)) / Math.max(1e-9, Math.cos(alt) * Math.cos(lat)), -1, 1);
        return { alt, az: Math.acos(cosAz) * (H < 0 ? -1 : 1) };
    }
    // direct beam on a clear day: the lower the sun, the more air the light crosses
    function clearBeam(alt) {
        if (alt <= 0) return 0;
        const a = alt / D2R;
        const airMass = 1 / (Math.sin(alt) + 0.50572 * Math.pow(a + 6.07995, -1.6364));
        return 1353 * Math.pow(0.7, Math.pow(airMass, 0.678));
    }
    // W/m² arriving on a south-facing panel tilted `deg` from the ground
    function panelIrradiance(hour, season, weather, deg) {
        const { alt, az } = sunAt(hour, SEASONS[season].dec);
        if (alt <= 0) return 0;
        const b = deg * D2R, beam = clearBeam(alt);
        const diffuseGround = DIFFUSE_SHARE * beam * Math.sin(alt);
        const skyView = (1 + Math.cos(b)) / 2;          // how much of the sky the panel faces
        if (weather === 'cloudy') return CLOUD_FACTOR * (beam * Math.sin(alt) + diffuseGround) * skyView;
        const cosIncidence = Math.sin(alt) * Math.cos(b) + Math.cos(alt) * Math.sin(b) * Math.cos(az);
        return Math.max(0, cosIncidence) * beam + diffuseGround * skyView;
    }
    const panelPower = (hour, season, weather, deg) => panelIrradiance(hour, season, weather, deg) * PANEL_AREA * PANEL_EFF;

    const dayCache = {};
    // the whole day for every tilt: power at each step and energy so far (Wh)
    function dayCurves(season, weather) {
        const key = `${season}|${weather}`;
        if (dayCache[key]) return dayCache[key];
        const hours = [];
        for (let h = DAY_START; h <= DAY_END + 1e-9; h += STEP_H) hours.push(Math.round(h * 6) / 6);
        const tilts = {};
        Object.entries(TILTS).forEach(([k, t]) => {
            const power = hours.map(h => panelPower(h, season, weather, t.deg));
            const energy = [0];
            for (let i = 1; i < power.length; i += 1) energy.push(energy[i - 1] + (power[i - 1] + power[i]) / 2 * STEP_H);
            tilts[k] = { power, energy, total: energy[energy.length - 1] };
        });
        const arcs = {};
        Object.entries(SEASONS).forEach(([k, s]) => { arcs[k] = hours.map(h => ({ h, alt: sunAt(h, s.dec).alt / D2R })).filter(p => p.alt > 0); });
        dayCache[key] = { hours, tilts, arcs, maxPower: Math.max(...Object.values(tilts).map(t => Math.max(...t.power))) };
        return dayCache[key];
    }
    const hourNow = () => DAY_START + state.progress * (DAY_END - DAY_START);
    const stepNow = () => Math.min(Math.round((hourNow() - DAY_START) / STEP_H), Math.round((DAY_END - DAY_START) / STEP_H));

    const windPower = (v, r) => 0.5 * RHO * Math.PI * r * r * v ** 3 * CP;

    // Shown figures are rounded stage by stage, so a stage's loss reads the same
    // whatever comes after it and every column still adds up to the supply.
    const round1 = v => Math.round(v * 10) / 10;
    function chainOf(plant, lamp) {
        const elec = SUPPLY_J * PLANTS[plant].eff;
        const delivered = elec * GRID_EFF;
        const light = delivered * LAMPS[lamp].eff;
        const elecR = round1(elec), gridHeat = round1(elec - delivered), deliveredR = round1(elecR - gridHeat);
        const lightR = round1(light), lampHeat = round1(deliveredR - lightR), plantHeat = round1(SUPPLY_J - elecR);
        return { elec: elecR, delivered: deliveredR, light, lightR, lampHeat, gridHeat, plantHeat, total: SUPPLY_J };
    }

    function analyse() {
        if (state.mode === 'solar') {
            const day = dayCurves(state.season, state.weather);
            const ranked = Object.keys(TILTS).sort((p, q) => day.tilts[q].total - day.tilts[p].total);
            return { kind: 'solar', day, ranked, winner: ranked[0], loser: ranked[ranked.length - 1], verdict: ranked[0] };
        }
        if (state.mode === 'wind') {
            const v = Number(state.wind), r = Number(state.blade);
            const P = windPower(v, r), Pref = windPower(REF.wind, REF.blade), ratio = P / Pref;
            const verdict = ratio < 0.2 ? 'tiny' : ratio < 0.75 ? 'less' : ratio < 1.5 ? 'same' : ratio < 6 ? 'more' : 'huge';
            return { kind: 'wind', v, r, P, Pref, ratio, verdict };
        }
        const c = chainOf(state.plant, state.lamp);
        const verdict = c.light < 2 ? 'tiny' : c.light < 10 ? 'small' : c.light < 20 ? 'mid' : 'big';
        return { kind: 'chain', ...c, verdict };
    }

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
        if (state.mode === 'solar') {
            controlArea.innerHTML = pickRow('계절', 'season', opts(SEASONS), state.season, 3) + pickRow('날씨', 'weather', opts(WEATHERS), state.weather, 2);
        } else if (state.mode === 'wind') {
            controlArea.innerHTML = pickRow('풍속', 'wind', opts(WINDS), state.wind, 3) + pickRow('날개 길이', 'blade', opts(BLADES), state.blade, 3);
        } else {
            controlArea.innerHTML = pickRow('발전소', 'plant', opts(PLANTS), state.plant, 3) + pickRow('전등', 'lamp', opts(LAMPS), state.lamp, 3);
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

    const PRED_SOLAR = Object.entries(TILTS).map(([k, t]) => ({ value: k, label: `${t.label} ${t.deg}°` }));
    const PRED_WIND = [
        { value: 'tiny', label: '8분의 1 이하' }, { value: 'less', label: '4분의 1 ~ 절반' }, { value: 'same', label: '같다' },
        { value: 'more', label: '2 ~ 4배' }, { value: 'huge', label: '8배 이상' },
    ];
    const PRED_CHAIN = [
        { value: 'tiny', label: '2 J도 안 됨' }, { value: 'small', label: '2 ~ 10 J' }, { value: 'mid', label: '10 ~ 20 J' }, { value: 'big', label: '20 J 넘음' },
    ];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list = state.mode === 'solar' ? PRED_SOLAR : state.mode === 'wind' ? PRED_WIND : PRED_CHAIN;
        predictionLegend.textContent = state.mode === 'solar' ? '이 날 하루 전기를 가장 많이 만드는 판은?'
            : state.mode === 'wind' ? `기준 발전기(풍속 ${REF.wind} m/s, 날개 ${REF.blade} m)와 견주면 내 발전기의 전력은?`
                : `공급한 ${SUPPLY_J} J 가운데 빛이 되는 에너지는?`;
        predictionArea.className = `prediction-buttons${list.length === 3 || list.length === 5 ? ' three' : ''}`;
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    const hx = h => 24 + (h - DAY_START) / (DAY_END - DAY_START) * 264;
    const ay = altDeg => 150 - altDeg / 90 * 116;
    const clock = h => { const hh = Math.floor(h), mm = Math.round((h - hh) * 60); return `${hh}시${mm ? ` ${mm}분` : ''}`; };

    function renderSolar(a) {
        const { day } = a;
        const h = hourNow(), i = stepNow();
        const cloudy = state.weather === 'cloudy';
        const { alt, az } = sunAt(h, SEASONS[state.season].dec);
        const altDeg = alt / D2R;
        let out = `<rect class="sky ${cloudy ? 'cloudy' : ''}" x="16" y="14" width="428" height="136" rx="6"/>`;
        out += `<rect class="ground" x="16" y="150" width="428" height="40" rx="3"/>`;
        // the sun's road across the sky for each season; today's is bright
        Object.entries(day.arcs).forEach(([k, pts]) => {
            const d = pts.map((p, n) => `${n ? 'L' : 'M'}${hx(p.h).toFixed(1)},${ay(p.alt).toFixed(1)}`).join(' ');
            out += `<path class="sun-arc ${k === state.season ? 'now' : ''}" d="${d}"/>`;
            const peak = pts.reduce((m, p) => Math.max(m, p.alt), 0);
            out += `<text class="small-label" x="${hx(12).toFixed(1)}" y="${(ay(peak) - 11).toFixed(1)}" text-anchor="middle">${SEASONS[k].short}</text>`;
        });
        if (cloudy) for (let c = 0; c < 4; c += 1) {
            const cx = 60 + c * 64, cy = 40 + (c % 2) * 14;
            out += `<ellipse class="cloud" cx="${cx}" cy="${cy}" rx="24" ry="9"/><ellipse class="cloud" cx="${cx - 8}" cy="${cy - 6}" rx="12" ry="8"/><ellipse class="cloud" cx="${cx + 9}" cy="${cy - 5}" rx="10" ry="7"/>`;
        }
        if (altDeg > 0) out += `<circle class="sun" cx="${hx(h).toFixed(1)}" cy="${ay(altDeg).toFixed(1)}" r="8" opacity="${cloudy ? 0.45 : 1}"/>`;
        // three panels, bottom edge toward the sun (south), top edge leaning away
        Object.entries(TILTS).forEach(([k, t], n) => {
            const px = 312 + n * 46, b = t.deg * D2R, L = 40;
            const tx = px + L * Math.cos(b), ty = 150 - L * Math.sin(b);
            const irr = panelIrradiance(h, state.season, state.weather, t.deg);
            if (altDeg > 0) {
                for (let r = 0; r < 3; r += 1) {
                    const f = 0.2 + r * 0.3;
                    const ex = px + (tx - px) * f, ey = 150 + (ty - 150) * f;
                    if (cloudy) {
                        const ang = (55 + r * 35) * D2R;      // scattered light arrives from all over the sky
                        out += `<line class="ray diffuse" x1="${(ex - 22 * Math.cos(ang)).toFixed(1)}" y1="${(ey - 22 * Math.sin(ang)).toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" opacity="${clamp(irr / 300, 0.15, 0.8).toFixed(2)}"/>`;
                    } else {
                        out += `<line class="ray" x1="${(ex - 30 * Math.cos(alt)).toFixed(1)}" y1="${(ey - 30 * Math.sin(alt)).toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" opacity="${clamp(irr / 900, 0.2, 1).toFixed(2)}"/>`;
                    }
                }
            }
            if (t.deg > 0) out += `<line class="panel-leg" x1="${tx.toFixed(1)}" y1="${ty.toFixed(1)}" x2="${tx.toFixed(1)}" y2="150"/>`;
            out += `<line class="panel-line" style="stroke:${t.color}" x1="${px}" y1="150" x2="${tx.toFixed(1)}" y2="${ty.toFixed(1)}"/>`;
            const watts = day.tilts[k].power[i];
            out += `<text class="trait-text" style="fill:${t.color}" x="${px + 20}" y="168" text-anchor="middle">${t.deg}°</text>`;
            out += `<text class="trait-text" style="fill:${t.color}" x="${px + 20}" y="182" text-anchor="middle">${fmtN(watts)} W</text>`;
        });
        // readouts
        out += `<text class="gen-text" x="20" y="30">${altDeg > 0 ? `${clock(h)} · 태양 높이 ${Math.round(altDeg)}°${Math.abs(az) > 1e-3 ? ` · ${az < 0 ? '동' : '서'}쪽으로 ${Math.round(Math.abs(az) / D2R)}°` : ' · 정남'}` : `${clock(h)} · ${h < 12 ? '해 뜨기 전' : '해가 진 뒤'}`}</text>`;
        out += `<text class="trait-text" x="440" y="30" text-anchor="end">판 넓이 ${PANEL_AREA} m² · 빛의 ${Math.round(PANEL_EFF * 100)} %가 전기로</text>`;
        out += `<text class="trait-text" x="440" y="44" text-anchor="end">나머지 ${Math.round((1 - PANEL_EFF) * 100)} %는 열로 판을 데움</text>`;
        if (state.progress >= 1) {
            const w = TILTS[a.winner];
            out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${SEASONS[state.season].label} ${WEATHERS[state.weather].label} → ${w.label} ${w.deg}° 판이 하루 ${(day.tilts[a.winner].total / 1000).toFixed(2)} kWh로 가장 많이</text>`;
        } else {
            out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${SEASONS[state.season].label} · ${WEATHERS[state.weather].label} — 남쪽을 보는 판 세 장</text>`;
        }
        out += `<text class="note-text" x="20" y="208">${cloudy ? '구름 낀 날은 곧게 오는 빛이 없고 하늘 전체에서 흩어진 빛만 옵니다' : '햇살은 태양 높이만큼 기울어 들고, 판에 수직으로 들수록 같은 넓이에 더 많이 닿습니다'}</text>`;
        return out;
    }

    function graphSolar(a) {
        const { day } = a;
        const i = stepNow();
        const X0 = 50, X1 = 430, Y0 = 150, Y1 = 40;
        const yMax = Math.max(100, Math.ceil(day.maxPower / 50) * 50);
        const xOf = h => X0 + (h - DAY_START) / (DAY_END - DAY_START) * (X1 - X0);
        const yOf = w => Y0 - w / yMax * (Y0 - Y1);
        let out = '';
        Object.entries(TILTS).forEach(([k, t], n) => {
            out += `<text class="axis-text" style="fill:${t.color}" x="${X0 + n * 120}" y="18">${t.deg}° · ${(day.tilts[k].energy[i] / 1000).toFixed(2)} kWh</text>`;
        });
        out += `<text class="axis-text" x="${X0 + 4}" y="${Y1 - 6}">전력 (W)</text>`;
        const yStep = yMax > 150 ? 100 : 50;
        for (let w = 0; w <= yMax; w += yStep) {
            out += `<line class="grid-line" x1="${X0}" y1="${yOf(w).toFixed(1)}" x2="${X1}" y2="${yOf(w).toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${X0 - 6}" y="${(yOf(w) + 3.5).toFixed(1)}" text-anchor="end">${w}</text>`;
        }
        for (let h = 6; h <= 18; h += 3) out += `<text class="axis-text" x="${xOf(h).toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${h}시</text>`;
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        Object.entries(TILTS).forEach(([k, t]) => {
            const pts = day.hours.slice(0, i + 1).map((h, n) => `${n ? 'L' : 'M'}${xOf(h).toFixed(1)},${yOf(day.tilts[k].power[n]).toFixed(1)}`).join(' ');
            out += `<path class="trace" style="stroke:${t.color}" d="${pts}"/>`;
            out += `<circle class="trace-dot" fill="${t.color}" cx="${xOf(day.hours[i]).toFixed(1)}" cy="${yOf(day.tilts[k].power[i]).toFixed(1)}" r="3"/>`;
        });
        out += `<line class="now-line" x1="${xOf(day.hours[i]).toFixed(1)}" y1="${Y1}" x2="${xOf(day.hours[i]).toFixed(1)}" y2="${Y0}"/>`;
        out += `<text class="axis-title" x="${((X0 + X1) / 2).toFixed(1)}" y="${Y0 + 30}" text-anchor="middle">시각 — 선 아래 넓이가 그날 만든 전기(kWh)</text>`;
        return out;
    }

    function turbine(cx, r, v, tag, shownW, dead) {
        const rpx = r * 1.8, hubY = 188 - rpx - 8;
        const theta = (TSR * v / r) * state.progress * RUN_SECONDS;   // real rotation rate: tip speed ≈ 7 × wind speed
        let out = `<polygon class="tower" points="${cx - 4},188 ${cx + 4},188 ${cx + 2},${hubY.toFixed(1)} ${cx - 2},${hubY.toFixed(1)}"/>`;
        for (let k = 0; k < 3; k += 1) {
            const ang = theta + k * 2 * Math.PI / 3;
            const pt = (lx, ly) => `${(cx + lx * Math.cos(ang) - ly * Math.sin(ang)).toFixed(1)},${(hubY + lx * Math.sin(ang) + ly * Math.cos(ang)).toFixed(1)}`;
            out += `<polygon class="blade" points="${pt(0, 0)} ${pt(3, -rpx * 0.3)} ${pt(1.2, -rpx)} ${pt(-1.2, -rpx)} ${pt(-3, -rpx * 0.3)}"/>`;
        }
        out += `<circle class="hub" cx="${cx}" cy="${hubY.toFixed(1)}" r="4"/>`;
        // wind streaks upwind of the rotor, sliding at the wind's speed
        const offset = -(state.progress * RUN_SECONDS * v * 6) % 24;
        for (let s = -1; s <= 1; s += 1) {
            const y = hubY + s * 16, x1 = cx - rpx - 48, x2 = cx - rpx - 10;
            out += `<line class="streak" x1="${x1.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y.toFixed(1)}" stroke-dashoffset="${offset.toFixed(1)}"/>`;
        }
        out += `<text class="gen-text" x="${cx}" y="18" text-anchor="middle">${fmtP(shownW)}</text>`;
        out += `<text class="trait-text" x="${cx}" y="32" text-anchor="middle">10 W 전등 ${fmtN(shownW / 10)}개</text>`;
        out += `<text class="trait-text" x="${cx}" y="208" text-anchor="middle">${tag} · 풍속 ${v} m/s · 날개 ${r} m</text>`;
        void dead;
        return out;
    }

    function renderWind(a) {
        const ease = 1 - (1 - state.progress) ** 2;      // the meters settle as the rotors come up to speed
        let out = `<rect class="ground" x="16" y="188" width="428" height="8" rx="2"/>`;
        out += turbine(130, REF.blade, REF.wind, '기준', a.Pref * ease);
        out += turbine(330, a.r, a.v, '내 발전기', a.P * ease);
        // two bars, taller one 120 px
        const top = Math.max(a.P, a.Pref);
        [[418, a.Pref, '#64748b'], [440, a.P, '#0284c7']].forEach(([x, P, fill]) => {
            const hgt = Math.max(1.5, 120 * P / top * ease);
            out += `<rect class="power-bar" fill="${fill}" x="${x}" y="${(186 - hgt).toFixed(1)}" width="12" height="${hgt.toFixed(1)}" rx="1.5"/>`;
        });
        out += `<text class="small-label" x="424" y="208" text-anchor="end">기준</text><text class="small-label" x="446" y="208" text-anchor="middle">내 것</text>`;
        if (state.progress >= 1) out += `<text class="verdict-text" fill="#d97706" x="234" y="60" text-anchor="middle">${a.verdict === 'same' ? '같다' : `${ratioText(a.ratio)}`}</text>`;
        return out;
    }
    const ratioText = ratio => ratio >= 1 ? `${Math.round(ratio * 10) / 10}배` : `${Math.round(10 / ratio) / 10}분의 1`;

    function niceCeil(x) {
        const e = 10 ** Math.floor(Math.log10(x)), m = x / e;
        return ([1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find(s => s >= m)) * e;
    }
    function graphWind(a) {
        const X0 = 50, X1 = 430, Y0 = 150, Y1 = 40, V1 = 14;
        const yMax = niceCeil(Math.max(a.P, a.Pref) * 1.15);
        const mega = yMax >= 1e6, unit = mega ? 1e6 : 1e3;
        const xOf = v => X0 + v / V1 * (X1 - X0);
        const yOf = P => Y0 - Math.min(1, P / yMax) * (Y0 - Y1);
        let out = `<text class="axis-text" x="${X0 + 4}" y="${Y1 - 6}">전력 (${mega ? 'MW' : 'kW'})</text>`;
        out += `<text class="axis-text" x="${X1}" y="18" text-anchor="end">전력 ∝ 풍속³ × 날개 길이²</text>`;
        for (let k = 0; k <= 4; k += 1) {
            const P = yMax * k / 4, y = yOf(P);
            out += `<line class="grid-line" x1="${X0}" y1="${y.toFixed(1)}" x2="${X1}" y2="${y.toFixed(1)}"/>`;
            const val = P / unit;
            out += `<text class="axis-text" x="${X0 - 6}" y="${(y + 3.5).toFixed(1)}" text-anchor="end">${Number.isInteger(val) ? val : val.toFixed(val < 1 ? 2 : 1)}</text>`;
        }
        for (let v = 0; v <= V1; v += 2) out += `<text class="axis-text" x="${xOf(v).toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${v}</text>`;
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        const curve = r => { let d = ''; for (let v = 0; v <= V1 + 1e-9; v += 0.25) { const P = windPower(v, r); if (P > yMax) break; d += `${d ? 'L' : 'M'}${xOf(v).toFixed(1)},${yOf(P).toFixed(1)} `; } return d; };
        if (a.r !== REF.blade) out += `<path class="trace-faint" d="${curve(REF.blade)}"/>`;
        out += `<path class="trace" style="stroke:#0284c7" d="${curve(a.r)}"/>`;
        if (a.r !== REF.blade) out += `<text class="axis-text" x="${X0 + 4}" y="18">흰 점선: 날개 ${REF.blade} m · 파란 선: 날개 ${a.r} m</text>`;
        else out += `<text class="axis-text" x="${X0 + 4}" y="18">파란 선: 날개 ${a.r} m</text>`;
        const px = xOf(a.v), py = yOf(a.P), rx = xOf(REF.wind), ry = yOf(a.Pref);
        out += `<circle class="trace-dot" fill="#ffb347" cx="${rx.toFixed(1)}" cy="${ry.toFixed(1)}" r="4"/>`;
        out += `<circle class="trace-dot" fill="#0284c7" cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="4"/>`;
        if (a.verdict === 'same' && a.v === REF.wind && a.r === REF.blade) {
            out += `<text class="axis-text" style="fill:#d97706" x="${(px + 8).toFixed(1)}" y="${(py - 6).toFixed(1)}">기준 = 내 발전기 ${fmtP(a.P)}</text>`;
        } else {
            // labels sit beside their dots, flipped to the left near the right edge
            const mineStart = px <= X1 - 93, refStart = mineStart ? px < rx : true;
            const refY = Math.max(Y1 + 12, ry - 8);
            let mineY = Math.max(Y1 + 12, py - 8);
            if (Math.abs(mineY - refY) < 12 && Math.abs(px - rx) < 100) mineY += 14;
            out += `<text class="axis-text" style="fill:#ffb347" x="${(rx + (refStart ? 8 : -8)).toFixed(1)}" y="${refY.toFixed(1)}" text-anchor="${refStart ? 'start' : 'end'}">기준 ${fmtP(a.Pref)}</text>`;
            out += `<text class="axis-text" style="fill:#0284c7" x="${(px + (mineStart ? 8 : -8)).toFixed(1)}" y="${mineY.toFixed(1)}" text-anchor="${mineStart ? 'start' : 'end'}">내 발전기 ${fmtP(a.P)}</text>`;
        }
        out += `<text class="axis-title" x="${((X0 + X1) / 2).toFixed(1)}" y="${Y0 + 30}" text-anchor="middle">풍속 (m/s)</text>`;
        return out;
    }

    function renderChain(a) {
        const front = 18 + state.progress * 440;
        const boxes = [
            { x: 18, name: `공급 ${SUPPLY_J} J`, sub: state.plant === 'hydro' ? '높은 곳의 물' : '연료' },
            { x: 128, name: PLANTS[state.plant].label, sub: `효율 ${Math.round(PLANTS[state.plant].eff * 100)} %` },
            { x: 238, name: '송전선', sub: `효율 ${Math.round(GRID_EFF * 100)} %` },
            { x: 348, name: LAMPS[state.lamp].label, sub: `효율 ${Math.round(LAMPS[state.lamp].eff * 100)} %` },
        ];
        const BW = 84, BY = 70, BH = 40, MID = BY + BH / 2, PX_PER_J = 0.5;
        const flows = [
            { from: boxes[0].x + BW, to: boxes[1].x, J: SUPPLY_J, cls: '' },
            { from: boxes[1].x + BW, to: boxes[2].x, J: a.elec, cls: 'elec' },
            { from: boxes[2].x + BW, to: boxes[3].x, J: a.delivered, cls: 'elec' },
            { from: boxes[3].x + BW, to: 452, J: a.light, cls: 'light' },
        ];
        const heats = [
            { x: boxes[1].x + BW / 2, J: a.plantHeat, after: boxes[1].x + BW },
            { x: boxes[2].x + BW / 2, J: a.gridHeat, after: boxes[2].x + BW },
            { x: boxes[3].x + BW / 2, J: a.lampHeat, after: boxes[3].x + BW },
        ];
        let out = '';
        flows.forEach(f => {
            const end = Math.min(front, f.to);
            if (end <= f.from) return;
            const t = Math.max(2, f.J * PX_PER_J);
            out += `<rect class="band ${f.cls}" x="${f.from}" y="${(MID - t / 2).toFixed(1)}" width="${(end - f.from).toFixed(1)}" height="${t.toFixed(1)}"/>`;
        });
        const flowLabels = [SUPPLY_J, a.elec, a.delivered, a.lightR].map(fmtJ);
        flows.forEach((f, n) => {
            if (front < f.from + 6) return;
            out += `<text class="trait-text" x="${((f.from + f.to) / 2).toFixed(1)}" y="${MID + Math.max(2, f.J * PX_PER_J) / 2 + 12}" text-anchor="middle">${flowLabels[n]} J</text>`;
        });
        boxes.forEach(b => {
            out += `<rect class="box ${front >= b.x ? 'lit' : ''}" x="${b.x}" y="${BY}" width="${BW}" height="${BH}" rx="6"/>`;
            out += `<text class="box-text" x="${b.x + BW / 2}" y="${BY + 17}" text-anchor="middle">${b.name}</text>`;
            out += `<text class="box-sub" x="${b.x + BW / 2}" y="${BY + 31}" text-anchor="middle">${b.sub}</text>`;
        });
        heats.forEach(hh => {
            if (front < hh.after) return;
            const d = `M${hh.x},${BY - 2} q4,-6 0,-12 t0,-12 t0,-8`;
            out += `<path class="heat" d="${d}"/><polygon fill="#ff7a59" points="${hh.x - 4},${BY - 30} ${hh.x + 4},${BY - 30} ${hh.x},${BY - 38}"/>`;
            out += `<text class="heat-text" x="${hh.x}" y="${BY - 42}" text-anchor="middle">열 ${fmtJ(hh.J)} J</text>`;
        });
        if (front >= 452) {
            const glow = clamp(a.light / 35, 0.08, 1);
            out += `<circle class="glow" cx="452" cy="${MID}" r="${(4 + 8 * glow).toFixed(1)}" opacity="${(0.35 + 0.65 * glow).toFixed(2)}"/>`;
            out += `<text class="trait-text" style="fill:#d97706" x="452" y="${BY + BH + 30}" text-anchor="middle">빛</text>`;
        }
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${state.progress >= 1 ? `${PLANTS[state.plant].label} → ${LAMPS[state.lamp].label}: 빛이 된 에너지 ${fmtJ(a.lightR)} J (효율 ${fmtJ(a.lightR)} %)` : `${PLANTS[state.plant].label} → 송전선 → ${LAMPS[state.lamp].label}`}</text>`;
        out += `<text class="trait-text" x="20" y="166">${state.progress >= 1 ? `열로 흩어진 것 ${fmtJ(a.plantHeat)} + ${fmtJ(a.gridHeat)} + ${fmtJ(a.lampHeat)} = ${fmtJ(a.plantHeat + a.gridHeat + a.lampHeat)} J, 빛 ${fmtJ(a.lightR)} J, 합 ${SUPPLY_J} J` : '띠의 두께가 남은 에너지의 양입니다'}</text>`;
        out += `<text class="trait-text" x="20" y="182">${state.progress >= 1 ? '에너지는 사라지지 않았지만 열로 흩어진 몫은 다시 쓰기 어렵습니다' : '단계마다 일부가 열로 빠져나갑니다'}</text>`;
        out += `<text class="note-text" x="20" y="208">${state.plant === 'hydro' ? '수력은 물의 위치 에너지가 곧바로 터빈을 돌려 열로 잃는 몫이 작습니다' : '화력은 연료의 열로 증기를 만들어 터빈을 돌리므로 열의 절반 넘게를 내보내야 합니다'}</text>`;
        return out;
    }

    function graphChain(a) {
        const X0 = 30, X1 = 430, BY = 44, BH = 26, scale = (X1 - X0) / SUPPLY_J;
        const segs = [
            { name: '빛', J: a.lightR, fill: '#d97706', text: '#0a1c24', narrowY: BY + BH + 14 },
            { name: '전등에서 열', J: a.lampHeat, fill: '#c9756b', text: '#fff', narrowY: BY - 8 },
            { name: '송전선에서 열', J: a.gridHeat, fill: '#e08a5c', text: '#0a1c24', narrowY: BY - 8 },
            { name: '발전소에서 열', J: a.plantHeat, fill: '#8a4b3f', text: '#fff', narrowY: BY + BH + 14 },
        ];
        let out = `<text class="axis-title" x="${X0}" y="18">공급한 ${SUPPLY_J} J은 어디로 갔나</text>`;
        out += `<text class="axis-text" style="fill:#059669" x="${X1}" y="18" text-anchor="end">합 ${SUPPLY_J} J — 사라진 에너지는 없음</text>`;
        let x = X0;
        const shown = Math.min(1, state.progress * 1.05);
        segs.forEach(s => {
            const w = s.J * scale * shown;
            out += `<rect class="stack-seg" fill="${s.fill}" x="${x.toFixed(1)}" y="${BY}" width="${w.toFixed(1)}" height="${BH}"/>`;
            const label = `${s.name} ${fmtJ(s.J)} J`;
            if (w >= label.length * 6.2) out += `<text class="seg-text" fill="${s.text}" x="${(x + w / 2).toFixed(1)}" y="${BY + BH / 2 + 3.5}" text-anchor="middle">${label}</text>`;
            else if (shown >= 1) out += `<text class="seg-text" fill="${s.fill}" x="${clamp(x + w / 2, X0 + label.length * 3.1, X1 - label.length * 3.1).toFixed(1)}" y="${s.narrowY}" text-anchor="middle">${label}</text>`;
            x += w;
        });
        // the same plant with each lamp: only the lamp changes
        const LY = 104;
        out += `<text class="axis-title" x="${X0}" y="${LY - 8}">${PLANTS[state.plant].label} 발전소에서 전등만 바꾸면 빛이 되는 에너지</text>`;
        Object.entries(LAMPS).forEach(([k, l], n) => {
            const c = chainOf(state.plant, k), y = LY + n * 24;
            const w = c.lightR * 8 * shown;
            const mine = k === state.lamp;
            out += `<text class="axis-text" style="fill:${mine ? '#d97706' : '#475569'}" x="${X0 + 50}" y="${y + 11}" text-anchor="end">${l.label}</text>`;
            out += `<rect class="lamp-bar" fill="${mine ? '#d97706' : 'rgba(217, 119, 6, .35)'}" x="${X0 + 58}" y="${y}" width="${Math.max(1, w).toFixed(1)}" height="15" rx="2"/>`;
            out += `<text class="axis-text" style="fill:${mine ? '#d97706' : '#475569'}" x="${(X0 + 64 + w).toFixed(1)}" y="${y + 11}">${fmtJ(c.lightR)} J (${fmtJ(c.lightR)} %)</text>`;
        });
        out += `<text class="axis-title" x="${X0}" y="${LY + 82}">효율은 곱해집니다: ${Math.round(PLANTS[state.plant].eff * 100)} % × ${Math.round(GRID_EFF * 100)} % × ${Math.round(LAMPS[state.lamp].eff * 100)} % = ${fmtJ(a.lightR)} %</text>`;
        return out;
    }

    function noteFor(a) {
        if (a.kind === 'solar') {
            const i = stepNow();
            const rows = Object.entries(TILTS).map(([k, t]) => `${t.label} ${t.deg}° ${(a.day.tilts[k].energy[i] / 1000).toFixed(2)} kWh`).join(' · ');
            return `<div class="data-row"><span class="data-name">판</span><span class="data-val">남쪽을 보는 ${PANEL_AREA} m² 판 세 장 · 위도 ${LAT}° · 빛 → 전기 ${Math.round(PANEL_EFF * 100)} %</span></div>` +
                `<div class="data-row"><span class="data-name">날</span><span class="data-val">${SEASONS[state.season].label} · ${WEATHERS[state.weather].label} · 한낮 태양 높이 ${Math.round(sunAt(12, SEASONS[state.season].dec).alt / D2R)}°</span></div>` +
                `<div class="data-row"><span class="data-name">지금까지</span><span class="data-val">${clock(a.day.hours[i])}까지 ${rows}</span></div>` +
                `<div class="data-row match"><span class="data-name">하루 전체</span><span class="data-val">${a.ranked.map(k => `${TILTS[k].deg}° ${(a.day.tilts[k].total / 1000).toFixed(2)} kWh`).join(' > ')}</span></div>`;
        }
        if (a.kind === 'wind') {
            const area = r => Math.round(Math.PI * r * r).toLocaleString('ko-KR');
            return `<div class="data-row"><span class="data-name">바람의 힘</span><span class="data-val">½ × 공기 밀도 ${RHO} kg/m³ × 날개가 쓸어 내는 넓이 × 풍속³ 가운데 ${Math.round(CP * 100)} %를 거둠</span></div>` +
                `<div class="data-row"><span class="data-name">기준 발전기</span><span class="data-val">풍속 ${REF.wind} m/s · 날개 ${REF.blade} m (넓이 ${area(REF.blade)} m²) → ${fmtP(a.Pref)}</span></div>` +
                `<div class="data-row"><span class="data-name">내 발전기</span><span class="data-val">풍속 ${a.v} m/s · 날개 ${a.r} m (넓이 ${area(a.r)} m²) → ${fmtP(a.P)}</span></div>` +
                `<div class="data-row match"><span class="data-name">비교</span><span class="data-val">풍속 ${a.v / REF.wind}배 → (${a.v / REF.wind})³ = ${ratioText((a.v / REF.wind) ** 3)} · 날개 ${a.r / REF.blade}배 → (${a.r / REF.blade})² = ${ratioText((a.r / REF.blade) ** 2)} · 모두 ${ratioText(a.ratio)}</span></div>`;
        }
        return `<div class="data-row"><span class="data-name">공급</span><span class="data-val">${SUPPLY_J} J (${state.plant === 'hydro' ? '높은 곳에 있는 물의 위치 에너지' : '연료의 화학 에너지'})</span></div>` +
            `<div class="data-row"><span class="data-name">발전소</span><span class="data-val">${PLANTS[state.plant].label} 효율 ${Math.round(PLANTS[state.plant].eff * 100)} % → 전기 ${fmtJ(a.elec)} J, 열 ${fmtJ(a.plantHeat)} J (${PLANTS[state.plant].waste})</span></div>` +
            `<div class="data-row"><span class="data-name">송전선</span><span class="data-val">효율 ${Math.round(GRID_EFF * 100)} % → 전기 ${fmtJ(a.delivered)} J, 열 ${fmtJ(a.gridHeat)} J</span></div>` +
            `<div class="data-row match"><span class="data-name">전등</span><span class="data-val">${LAMPS[state.lamp].label} 효율 ${Math.round(LAMPS[state.lamp].eff * 100)} % → 빛 ${fmtJ(a.lightR)} J, 열 ${fmtJ(a.lampHeat)} J · 전체 효율 ${fmtJ(a.lightR)} %</span></div>`;
    }

    function render() {
        const a = analyse();
        mainGroup.innerHTML = a.kind === 'solar' ? renderSolar(a) : a.kind === 'wind' ? renderWind(a) : renderChain(a);
        graphGroup.innerHTML = a.kind === 'solar' ? graphSolar(a) : a.kind === 'wind' ? graphWind(a) : graphChain(a);
        stageBadge.textContent = a.kind === 'solar' ? `${SEASONS[state.season].label} · ${WEATHERS[state.weather].label}`
            : a.kind === 'wind' ? `풍속 ${a.v} m/s · 날개 ${a.r} m` : `${PLANTS[state.plant].label} → ${LAMPS[state.lamp].label}`;
        methodHint.textContent = a.kind === 'solar' ? '빛이 판에 수직으로 들 때 같은 넓이에 가장 많은 빛이 닿습니다'
            : a.kind === 'wind' ? '바람이 초마다 전해 주는 에너지는 풍속의 세제곱에 비례합니다'
                : '에너지는 단계마다 일부가 열로 흩어지고, 효율은 곱해집니다';
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
        let s = '';
        if (a.kind === 'solar') {
            const w = TILTS[a.winner], l = TILTS[a.loser], mid = TILTS[a.ranked[1]];
            const kwh = k => (a.day.tilts[k].total / 1000).toFixed(2);
            const noon = Math.round(sunAt(12, SEASONS[state.season].dec).alt / D2R);
            labelA.textContent = '가장 많이 만든 판'; valueA.textContent = `${w.deg}° · ${kwh(a.winner)} kWh`;
            labelB.textContent = '가장 적게 만든 판'; valueB.textContent = `${l.deg}° · ${kwh(a.loser)} kWh`;
            s = `${SEASONS[state.season].short} ${state.weather === 'clear' ? '맑은 날' : '흐린 날'} 태양은 한낮에 ${noon}°까지 올라옵니다. 하루 동안 ${w.label} ${w.deg}° 판이 ${kwh(a.winner)} kWh로 가장 많이, ${mid.deg}° 판이 ${kwh(a.ranked[1])} kWh, ${l.label} ${l.deg}° 판이 ${kwh(a.loser)} kWh로 가장 적게 만들었습니다. `;
            if (state.weather === 'cloudy') {
                s += `구름 낀 날은 햇빛이 구름 속에서 흩어져 하늘 전체에서 고르게 내려옵니다. 곧게 오는 빛이 없으니 방향을 맞출 것도 없고, 하늘을 가장 넓게 바라보는 눕힌 판이 어느 계절이든 가장 많이 받습니다. 다만 전체 양은 맑은 날의 3분의 1쯤입니다. `;
            } else if (state.season === 'summer') {
                s += `빛이 판에 수직으로 들 때 같은 넓이에 가장 많은 빛이 닿습니다. 태양이 높이 뜨는 여름에는 눕힌 판이 한낮 빛을 거의 정면으로 받고, 해가 동북쪽에서 떠 서북쪽으로 지는 긴 하루 내내 하늘을 넓게 봅니다. 세운 판은 아침저녁 빛을 뒤로 흘려보냅니다. `;
            } else if (state.season === 'winter') {
                s += `빛이 판에 수직으로 들 때 같은 넓이에 가장 많은 빛이 닿습니다. 태양이 낮게 뜨는 겨울에는 판을 많이 세워야 빛을 정면으로 받습니다. 눕힌 판에는 빛이 비스듬히 스쳐 지나가 같은 넓이에 절반도 못 닿습니다. `;
            } else {
                s += `빛이 판에 수직으로 들 때 같은 넓이에 가장 많은 빛이 닿습니다. 태양이 중간 높이로 뜨는 봄·가을에는 이곳의 위도(${LAT}°)에 가까운 35° 판이 한낮 빛을 거의 정면으로 받습니다. 그래서 한 해 내내 두는 판은 보통 위도만큼 기울입니다. `;
            }
            s += `판에 닿은 빛의 ${Math.round(PANEL_EFF * 100)} %만 전기가 되고 나머지는 열이 되어 판을 데웁니다.`;
        } else if (a.kind === 'wind') {
            labelA.textContent = '기준 발전기'; valueA.textContent = fmtP(a.Pref);
            labelB.textContent = '내 발전기'; valueB.textContent = `${fmtP(a.P)} (${a.verdict === 'same' ? '같음' : ratioText(a.ratio)})`;
            const vf = a.v / REF.wind, rf = a.r / REF.blade;
            const parts = [];
            if (vf !== 1) parts.push(`풍속이 ${vf > 1 ? `${vf}배` : `${Math.round(1 / vf)}분의 1`}이니 세제곱해서 ${ratioText(vf ** 3)}`);
            if (rf !== 1) parts.push(`날개 길이가 ${rf > 1 ? `${rf}배` : `${Math.round(1 / rf)}분의 1`}이니 쓸어 내는 넓이는 제곱해서 ${ratioText(rf ** 2)}`);
            s = `바람이 초마다 날개에 전해 주는 에너지는 풍속의 세제곱에, 날개가 쓸어 내는 넓이는 날개 길이의 제곱에 비례합니다. 기준 발전기(풍속 ${REF.wind} m/s, 날개 ${REF.blade} m)는 ${fmtP(a.Pref)}를 만듭니다. `;
            s += parts.length === 2 ? `내 발전기는 ${parts.join(', ')}, 합쳐서 ${ratioText(a.ratio)}인 ${fmtP(a.P)}를 만듭니다. `
                : parts.length === 1 ? `내 발전기는 ${parts[0]}, 그래서 ${ratioText(a.ratio)}인 ${fmtP(a.P)}를 만듭니다. `
                    : `내 발전기는 기준과 조건이 같아 똑같이 ${fmtP(a.P)}를 만듭니다. `;
            s += `풍속이 조금만 달라도 전력이 몇 배씩 달라지므로 풍력 발전소는 바람이 세고 꾸준한 바닷가·산등성이·바다 위에 세우고, 날개는 갈수록 길게 만듭니다. 바람의 에너지 가운데 날개가 거두는 몫은 ${Math.round(CP * 100)} %쯤이고 나머지는 바람으로 지나갑니다.`;
        } else {
            labelA.textContent = '공급한 에너지'; valueA.textContent = `${SUPPLY_J} J`;
            labelB.textContent = '빛이 된 에너지'; valueB.textContent = `${fmtJ(a.lightR)} J (${fmtJ(a.lightR)} %)`;
            const p = PLANTS[state.plant], l = LAMPS[state.lamp];
            const heat = a.plantHeat + a.gridHeat + a.lampHeat;
            s = `${p.label} 발전소는 공급된 ${SUPPLY_J} J 가운데 ${fmtJ(a.elec)} J만 전기로 바꾸고 ${fmtJ(a.plantHeat)} J은 ${p.waste}로 빠져나갑니다. 송전선에서 ${fmtJ(a.gridHeat)} J이 열로 새고, ${l.eun} 받은 ${fmtJ(a.delivered)} J 가운데 ${fmtJ(a.lightR)} J만 빛으로 바꾸고 ${fmtJ(a.lampHeat)} J을 열로 냅니다. `;
            s += `열로 흩어진 것을 모두 더하면 ${fmtJ(heat)} J, 빛 ${fmtJ(a.lightR)} J과 합치면 처음의 ${SUPPLY_J} J 그대로입니다. 에너지는 사라지지 않았지만 쓸 수 있는 형태는 줄어들어, 전체 효율은 ${Math.round(p.eff * 100)} % × ${Math.round(GRID_EFF * 100)} % × ${Math.round(l.eff * 100)} % = ${fmtJ(a.lightR)} %입니다. `;
            s += state.lamp === 'bulb' ? '같은 발전소라도 LED로 바꾸면 빛이 여덟 배로 늘어납니다. 전등 하나의 효율이 전체를 좌우합니다.'
                : state.plant === 'coal' ? '전등이 좋아도 발전소에서 절반 넘게를 열로 잃습니다. 열을 덜 잃는 발전 방식이 함께 필요합니다.'
                    : '단계마다 효율이 높아야 처음 에너지의 많은 몫이 끝까지 살아남습니다.';
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
        checkBtn.textContent = state.mode === 'solar' ? '하루 돌려 보기' : state.mode === 'wind' ? '바람 불게 하기' : '전기 보내기';
        stageCaption.textContent = state.mode === 'solar' ? '같은 판 세 장을 기울기만 다르게 놓고 하루 동안 만드는 전기를 견줍니다.'
            : state.mode === 'wind' ? '왼쪽은 기준 발전기, 오른쪽은 내 발전기입니다. 날개 끝은 바람보다 일곱 배쯤 빠르게 돕니다.'
                : '왼쪽에서 공급한 에너지가 오른쪽 전등까지 가는 동안 띠가 얇아지는 만큼 열로 빠져나갑니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { season: 'equinox', weather: 'clear', wind: '12', blade: '20', plant: 'coal', lamp: 'bulb', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'solar').click();
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

    window.__energyModel = {
        SEASONS, WEATHERS, TILTS, WINDS, BLADES, REF, PLANTS, LAMPS, GRID_EFF, SUPPLY_J, state,
        analyse, render, panelPower, panelIrradiance, sunAt, windPower, chainOf, dayCurves,
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
