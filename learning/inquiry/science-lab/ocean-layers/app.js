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

    /* --- 긴 설명은 그림 밖으로: 액자를 벗어나는 글자와 판정·주석은 HTML로 옮긴다 --- */
    const stageVerdict = document.getElementById('stageVerdict');
    const stageReadout = document.getElementById('stageReadout');
    const stageNote = document.getElementById('stageNote');
    const mainSvg = document.querySelector('.main-svg');
    const graphSvg = document.querySelector('.graph-svg');
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
        [[mainGroup, mainSvg], [graphGroup, graphSvg]].forEach(([g, svg]) => {
            if (!g || !svg) return;
            const vb = svg.viewBox.baseVal, W = vb.width, H = vb.height;
            [...g.querySelectorAll('text')].forEach(t => {
                const cls = t.getAttribute('class') || '';
                const must = /verdict-text|note-text/.test(cls) || /prose/.test(cls);
                let b; try { b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); } catch (e) { return; }
                const out = b.x < -0.5 || b.x + b.width > W + 0.5 || b.y + b.height > H + 0.5 || b.y < -0.5;
                if (must || out) takeOut(t);
            });
            const items = [...g.querySelectorAll('text')].map(t => { let b; try { b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); } catch (e) { b = null; } return { t, b, len: t.textContent.trim().length }; }).filter(o => o.b);
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
        if (stageVerdict) stageVerdict.textContent = verdicts.join(' ');
        if (stageReadout) stageReadout.innerHTML = rows.map(r => `<span${r.fill ? ` style="color:${r.fill}"` : ''}>${r.txt}</span>`).join('');
        if (stageNote) stageNote.textContent = notes.join(' ');
    }

    /* -------------------------------------------------------------- data */
    // surface temperature and mixed-layer depth by region and season (대략), deep water temperature, e-folding scale of the thermocline
    const REGIONS = {
        low: { label: '저위도 (적도)', hint: '햇볕이 셈', summer: { sst: 28, mld: 50 }, winter: { sst: 27, mld: 80 }, deep: 2, L: 250 },
        mid: { label: '중위도 (우리나라)', hint: '계절 차가 큼', summer: { sst: 24, mld: 20 }, winter: { sst: 8, mld: 150 }, deep: 2, L: 300 },
        high: { label: '고위도 (극지방)', hint: '늘 차가움', summer: { sst: 2, mld: 20 }, winter: { sst: -1.5, mld: 200 }, deep: 0, L: 300 },
    };
    const SEASONS = { summer: { label: '여름', hint: '햇볕 세고 바람 약함' }, winter: { label: '겨울', hint: '식고 바람 셈' } };
    // 1,000 g of seawater: 965 g water + 35 g salts; what each event does to the water (g)
    const EVENTS = {
        evap: { label: '증발', hint: '햇볕에 물 100 g 날아감', water: -100, when: '증발이 일어나면', how: '증발로 물 100 g이 수증기로 날아가면' },
        rain: { label: '비', hint: '민물 200 g 들어옴', water: 200, when: '비가 오면', how: '비로 민물 200 g이 들어오면' },
        river: { label: '강물 유입', hint: '민물 300 g 들어옴', water: 300, when: '강물이 들어오면', how: '강물로 민물 300 g이 들어오면' },
        freeze: { label: '결빙', hint: '물 200 g이 얼음이 됨', water: -200, ice: 'form', when: '결빙이 일어나면', how: '결빙으로 물 200 g이 얼음이 되어 빠져나가면(얼음 결정에는 염류가 거의 끼지 못합니다)' },
        melt: { label: '해빙', hint: '빙하 200 g 녹아 들어옴', water: 200, ice: 'melt', when: '해빙이 일어나면', how: '해빙으로 빙하 녹은 민물 200 g이 들어오면' },
        stir: { label: '바람이 섞음', hint: '물만 오르내림', water: 0, when: '바람이 섞기만 하면', how: '바람이 물을 위아래로 섞기만 하면' },
    };
    const IONS = [['염화 이온 Cl⁻', 55.0, '#4ade80'], ['나트륨 이온 Na⁺', 30.6, '#e5e7eb'], ['황산 이온 SO₄²⁻', 7.7, '#d97706'], ['마그네슘 이온 Mg²⁺', 3.7, '#a78bfa'], ['칼슘·칼륨 등', 3.0, '#dc2626']];
    const TEMPS = { t0: { label: '0 ℃', hint: '극지방 겨울', T: 0 }, t15: { label: '15 ℃', hint: '중위도', T: 15 }, t25: { label: '25 ℃', hint: '열대', T: 25 } };
    const SALTS = { s33: { label: '33 ‰', hint: '강물 많은 곳', S: 33 }, s35: { label: '35 ‰', hint: '평균', S: 35 }, s37: { label: '37 ‰', hint: '증발 많은 곳', S: 37 } };
    const REF = { T: 15, S: 35 };

    const state = { mode: 'profile', region: 'mid', season: 'summer', event: 'evap', temp: 't0', salt: 's35', progress: 0, prediction: null };
    let running = false, frameId = 0, lastStamp = 0;

    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const ease = p => p < 0.5 ? 2 * p * p : 1 - (1 - p) * (1 - p) * 2;
    const fmtN = (n, d = 0) => (+n.toFixed(d)).toLocaleString('ko-KR', { minimumFractionDigits: d, maximumFractionDigits: d }).replace('-', '−');

    /* ------------------------------------------------------------ models */
    // seawater density at the surface (EOS-80), kg/m³
    function rho(S, T) {
        const r0 = 999.842594 + 6.793952e-2 * T - 9.095290e-3 * T * T + 1.001685e-4 * T ** 3 - 1.120083e-6 * T ** 4 + 6.536332e-9 * T ** 5;
        const A = 0.824493 - 4.0899e-3 * T + 7.6438e-5 * T * T - 8.2467e-7 * T ** 3 + 5.3875e-9 * T ** 4;
        const B = -5.72466e-3 + 1.0227e-4 * T - 1.6546e-6 * T * T;
        return r0 + A * S + B * S ** 1.5 + 4.8314e-4 * S * S;
    }
    function profile(region, season) {
        const r = REGIONS[region], s = r[season];
        const T = z => z <= s.mld ? s.sst : r.deep + (s.sst - r.deep) * Math.exp(-(z - s.mld) / r.L);
        const pts = []; for (let z = 0; z <= 1000; z += 10) pts.push([z, T(z)]);
        return { sst: s.sst, mld: s.mld, deep: r.deep, L: r.L, T, pts, thermoEnd: Math.min(1000, Math.round(s.mld + 2.3 * r.L)) };
    }

    function analyse() {
        if (state.mode === 'profile') {
            const pr = profile(state.region, state.season), dT = pr.sst - pr.deep;
            const verdict = Math.abs(dT) < 3 ? 'none' : pr.mld < 100 ? 'shallow' : 'deep';
            return { kind: 'profile', ...pr, dT, verdict };
        }
        if (state.mode === 'salinity') {
            const ev = EVENTS[state.event], water = 965 + ev.water, S1 = 35, S2 = 35 / (water + 35) * 1000;
            return { kind: 'salinity', ev, water, S1, S2, verdict: S2 > S1 + 0.05 ? 'up' : S2 < S1 - 0.05 ? 'down' : 'same' };
        }
        const T = TEMPS[state.temp].T, S = SALTS[state.salt].S, rA = rho(S, T), rB = rho(REF.S, REF.T), d = rA - rB;
        return { kind: 'density', T, S, rA, rB, d, verdict: d > 0.05 ? 'sink' : d < -0.05 ? 'float' : 'same' };
    }
    const runSeconds = () => 5;

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
        if (state.mode === 'profile') controlArea.innerHTML = pickRow('바다', 'region', opts(REGIONS), state.region, 3) + pickRow('계절', 'season', opts(SEASONS), state.season, 2);
        else if (state.mode === 'salinity') controlArea.innerHTML = pickRow('바닷물 1 kg에 일어나는 일', 'event', opts(EVENTS), state.event, 3);
        else controlArea.innerHTML = pickRow('물덩이의 수온', 'temp', opts(TEMPS), state.temp, 3) + pickRow('물덩이의 염분', 'salt', opts(SALTS), state.salt, 3);
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                buildPrediction();
                settingsChanged();
            }));
        });
    }

    const PRED_P = [{ value: 'shallow', label: '얕고 뚜렷한 수온약층 (100 m 안쪽)' }, { value: 'deep', label: '깊고 완만한 수온약층 (100 m 너머)' }, { value: 'none', label: '수온약층이 거의 없음' }];
    const PRED_S = [{ value: 'up', label: '염분이 오름 (짜짐)' }, { value: 'same', label: '그대로' }, { value: 'down', label: '염분이 내림 (싱거워짐)' }];
    const PRED_D = [{ value: 'sink', label: '가라앉음 (더 무거움)' }, { value: 'same', label: '그 자리 (같음)' }, { value: 'float', label: '떠오름 (더 가벼움)' }];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list = state.mode === 'profile' ? PRED_P : state.mode === 'salinity' ? PRED_S : PRED_D;
        predictionLegend.textContent = state.mode === 'profile' ? `${REGIONS[state.region].label} ${SEASONS[state.season].label} 바다의 수온약층은?`
            : state.mode === 'salinity' ? `바닷물 1 kg(35 ‰)에 ${EVENTS[state.event].when} 염분은?`
                : `${TEMPS[state.temp].label}·${SALTS[state.salt].label} 물덩이를 15 ℃·35 ‰ 바닷물 속에 놓으면?`;
        predictionArea.className = 'prediction-buttons three';
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    const arrow = (x1, y1, x2, y2, cls, head, w = 3.5) => {
        const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
        const bx = x2 - ux * 6, by = y2 - uy * 6;
        return `<line class="${cls}" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}"/><polygon class="${head}" points="${x2.toFixed(1)},${y2.toFixed(1)} ${(bx - uy * w).toFixed(1)},${(by + ux * w).toFixed(1)} ${(bx + uy * w).toFixed(1)},${(by - ux * w).toFixed(1)}"/>`;
    };
    // temperature colour, −2 … 30 ℃
    const tColor = T => { const u = clamp((T + 2) / 32, 0, 1); const r = Math.round(40 + 215 * u), g = Math.round(90 + 90 * Math.sin(u * Math.PI)), b = Math.round(220 - 170 * u); return `rgb(${r},${g},${b})`; };

    function renderProfile(a) {
        const p = state.progress, CX0 = 44, CW = 60, Y0 = 38, Y1 = 156, zOf = y => (y - Y0) / (Y1 - Y0) * 1000, yOf = z => Y0 + z / 1000 * (Y1 - Y0);
        let out = '';
        for (let y = Y0; y < Y1; y += 4) out += `<rect fill="${tColor(a.T(zOf(y)))}" x="${CX0}" y="${y}" width="${CW}" height="${Math.min(4.5, Y1 - y).toFixed(1)}"/>`;
        out += `<rect class="column-frame" x="${CX0}" y="${Y0}" width="${CW}" height="${Y1 - Y0}"/>`;
        [0, 200, 400, 600, 800, 1000].forEach(z => { out += `<text class="axis-text" x="${CX0 - 4}" y="${(yOf(z) + 3.5).toFixed(1)}" text-anchor="end">${z}</text>`; });
        out += `<text class="small-label" x="${CX0 - 4}" y="${Y0 - 14}" text-anchor="end">깊이 m</text>`;
        // temperature axis and the profile curve, drawn down to the probe's depth
        const TX0 = 120, TX1 = 260, xOf = T => TX0 + clamp((T + 2) / 32, 0, 1) * (TX1 - TX0);
        [0, 10, 20, 30].forEach(T => { out += `<line class="grid-line" x1="${xOf(T).toFixed(1)}" y1="${Y0}" x2="${xOf(T).toFixed(1)}" y2="${Y1}"/><text class="axis-text" x="${xOf(T).toFixed(1)}" y="${Y0 - 9}" text-anchor="middle">${T} ℃</text>`; });
        const zNow = 1000 * ease(p);
        let d = '';
        a.pts.forEach(([z, T]) => { if (z <= zNow) d += `${d ? 'L' : 'M'}${xOf(T).toFixed(1)},${yOf(z).toFixed(1)} `; });
        out += `<path class="trace" style="stroke:#d97706" d="${d}"/>`;
        const Tn = a.T(zNow), px = xOf(Tn), py = yOf(zNow), flip = px > 196;
        out += `<circle class="probe" cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="4"/><circle class="probe" cx="${CX0 + CW / 2}" cy="${py.toFixed(1)}" r="3"/>`;
        out += `<text class="small-label" style="fill:#d97706" x="${(px + (flip ? -8 : 8)).toFixed(1)}" y="${(py + 3.5).toFixed(1)}" text-anchor="${flip ? 'end' : 'start'}">${fmtN(zNow)} m · ${fmtN(Tn, 1)} ℃</text>`;
        // layer brackets on the right
        const BX = 292;
        const layers = a.verdict === 'none' ? [[0, 1000, '위아래 다 차가움 · 층 없음', '#475569']] : [[0, a.mld, `혼합층 0~${a.mld} m`, '#059669'], [a.mld, a.thermoEnd, `수온약층 ${a.mld}~${a.thermoEnd} m`, '#d97706'], [a.thermoEnd, 1000, `심해층 ${a.deep} ℃쯤`, '#0284c7']];
        let lastY = Y0 - 4;
        layers.forEach(([z0, z1, lab, col]) => {
            const y0 = yOf(z0), y1 = yOf(z1);
            out += `<path class="bracket" style="stroke:${col}" d="M${BX},${y0.toFixed(1)} L${BX + 6},${y0.toFixed(1)} L${BX + 6},${y1.toFixed(1)} L${BX},${y1.toFixed(1)}"/>`;
            const ly = clamp((y0 + y1) / 2 + 3.5, Math.max(Y0 + 10, lastY + 13), Y1 - 2);
            lastY = ly;
            out += `<text class="layer-label" style="fill:${col}" x="${BX + 12}" y="${ly.toFixed(1)}">${lab}</text>`;
        });
        // season: sun above the column, wind arrows across the mixed layer
        const summer = state.season === 'summer';
        out += `<circle class="sun" style="opacity:${summer ? 1 : 0.4}" cx="${CX0 + CW / 2}" cy="${Y0 - 10}" r="${summer ? 6 : 4}"/>`;
        for (let k = 0; k < (summer ? 1 : 3); k += 1) out += arrow(CX0 + 6, Y0 + 8 + k * 7, CX0 + CW - 6, Y0 + 8 + k * 7, 'wind', 'wind-head', 2.5);
        out += `<text class="small-label" x="20" y="172">${summer ? '햇볕 셈 · 바람 약함' : '햇볕 약함 · 바람 셈'} → 혼합층 ${a.mld} m까지 섞임 · 표층 ${fmtN(a.sst, 1)} ℃ · 심해 ${a.deep} ℃</text>`;
        out += `<text class="small-label" x="20" y="186">${a.verdict === 'none' ? `위아래 차이 ${fmtN(Math.abs(a.dT), 1)} ℃뿐 — 급히 식는 층이 없음` : `수온약층 ${a.mld}~${a.thermoEnd} m에서 ${fmtN(a.dT, 1)} ℃ 떨어짐 (가장 급한 곳 ${fmtN(a.dT / a.L * 100, 1)} ℃/100 m)`}</text>`;
        const VERD = { shallow: `얕고 뚜렷한 수온약층 (${a.mld} m 아래)`, deep: `깊고 완만한 수온약층 (${a.mld} m 아래)`, none: '수온약층이 거의 없음' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${state.progress >= 1 ? `${REGIONS[state.region].label} ${SEASONS[state.season].label}: ${VERD[a.verdict]}` : `${REGIONS[state.region].label} · ${SEASONS[state.season].label}`}</text>`;
        out += `<text class="note-text" x="20" y="208">햇볕은 겉 몇십 m만 데우고 바람이 그 열을 섞어 혼합층을 만듭니다. 그 아래 수온이 급히 내려가는 곳이 수온약층</text>`;
        return out;
    }

    function graphProfile(a) {
        const X0 = 60, X1 = 420, Y0 = 40, Y1 = 150, xOf = T => X0 + clamp((T + 2) / 32, 0, 1) * (X1 - X0), yOf = z => Y0 + z / 1000 * (Y1 - Y0);
        let out = `<text class="axis-title" x="${X0}" y="18">${SEASONS[state.season].label}철 세 바다의 깊이–수온 곡선 견주기 — 굵은 선이 고른 바다</text>`;
        [0, 10, 20, 30].forEach(T => { out += `<line class="grid-line" x1="${xOf(T).toFixed(1)}" y1="${Y0}" x2="${xOf(T).toFixed(1)}" y2="${Y1}"/><text class="axis-text" x="${xOf(T).toFixed(1)}" y="${Y1 + 14}" text-anchor="middle">${T} ℃</text>`; });
        [0, 500, 1000].forEach(z => { out += `<text class="axis-text" x="${X0 - 5}" y="${(yOf(z) + 3.5).toFixed(1)}" text-anchor="end">${z} m</text>`; });
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1}"/>`;
        const cols = { low: '#dc2626', mid: '#d97706', high: '#0284c7' };
        Object.keys(REGIONS).forEach(k => {
            const pr = profile(k, state.season);
            let d = ''; pr.pts.forEach(([z, T]) => { d += `${d ? 'L' : 'M'}${xOf(T).toFixed(1)},${yOf(z).toFixed(1)} `; });
            out += `<path class="trace${k === state.region ? '' : ' faint'}" style="stroke:${cols[k]}" d="${d}"/>`;
            out += `<text class="small-label" style="fill:${cols[k]}" x="${(xOf(pr.sst) + (k === 'high' ? 6 : -6)).toFixed(1)}" y="${Y0 + 12 + (k === 'mid' ? 12 : 0)}" text-anchor="${k === 'high' ? 'start' : 'end'}">${REGIONS[k].label.split(' ')[0]}</text>`;
        });
        out += `<text class="axis-title" x="${(X0 + X1) / 2}" y="${Y1 + 30}" text-anchor="middle">수온 — 심해층은 어디서나 0~2 ℃로 만나고, 차이는 표층과 수온약층에서 납니다</text>`;
        return out;
    }

    function renderSalinity(a) {
        const p = state.progress, { ev } = a, BX = 60, BW = 130, BB = 190, t = ease(clamp((p - 0.15) / 0.7, 0, 1));
        const mass = 1000 + ev.water * t, level = 110 * mass / 1000, top = BB - level;
        let out = `<path class="beaker" d="M${BX},40 L${BX},${BB} L${BX + BW},${BB} L${BX + BW},40"/>`;
        out += `<rect class="brine" x="${BX + 1}" y="${top.toFixed(1)}" width="${BW - 2}" height="${(level - 1).toFixed(1)}"/>`;
        [1000, 800, 600].forEach(m => { const y = BB - 110 * m / 1000; out += `<line class="ref-line" x1="${BX + BW - 10}" y1="${y.toFixed(1)}" x2="${BX + BW}" y2="${y.toFixed(1)}"/><text class="small-label" x="${BX + BW + 4}" y="${(y + 3.5).toFixed(1)}">${m} g</text>`; });
        // the 35 grains stay; they just get closer or farther apart
        for (let i = 0; i < 35; i += 1) { const x = BX + 8 + ((i * 7919) % 997) / 997 * (BW - 16), y = top + 6 + ((i * 104729) % 991) / 991 * Math.max(8, level - 12); out += `<circle class="salt" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6"/>`; }
        if (ev.ice === 'form') { const h = 22 * t; out += `<rect class="ice" x="${BX + 6}" y="${(top - h + 2).toFixed(1)}" width="${BW - 12}" height="${h.toFixed(1)}" rx="4"/>`; if (t > 0.1) out += `<text class="small-label" style="fill:#bae6fd" x="${BX + BW / 2}" y="${(top - h - 4).toFixed(1)}" text-anchor="middle">얼음 ${fmtN(200 * t)} g — 소금은 못 들어감</text>`; }
        if (ev.ice === 'melt') { const h = 22 * (1 - t); if (h > 0.5) out += `<rect class="ice" x="${BX + 6}" y="${(top - h + 2).toFixed(1)}" width="${BW - 12}" height="${h.toFixed(1)}" rx="4"/>`; out += `<text class="small-label" style="fill:#bae6fd" x="${BX + BW / 2}" y="${(top - h - 4).toFixed(1)}" text-anchor="middle">빙하 ${fmtN(200 * (1 - t))} g 남음</text>`; }
        if (state.event === 'evap' && t < 1) for (let k = 0; k < 4; k += 1) { const x = BX + 24 + k * 28, y0 = top - 4, y1 = top - 22 - ((k * 7 + Math.floor(p * 40)) % 12); out += arrow(x, y0, x, y1, 'evap', 'evap-head', 2.5); }
        if (state.event === 'rain' && t < 1) for (let k = 0; k < 8; k += 1) { const x = BX + 10 + k * 15, y = 26 + ((k * 23 + Math.floor(p * 200)) % Math.max(10, top - 30)); out += `<line class="rain" x1="${x}" y1="${y}" x2="${x - 2}" y2="${y + 8}"/>`; }
        if (state.event === 'river' && t < 1) out += arrow(BX - 34, top - 10, BX - 2, top - 2, 'wind', 'wind-head', 3) + `<text class="small-label" x="${BX - 36}" y="${top - 16}" text-anchor="start">강물</text>`;
        if (state.event === 'stir') for (let k = 0; k < 2; k += 1) out += arrow(BX + 20, top - 10 - k * 8, BX + BW - 20, top - 10 - k * 8, 'wind', 'wind-head', 2.5);
        const Snow = 35 / (965 + ev.water * t + 35) * 1000;
        const RX = 238;
        out += `<text class="trait-text" x="${RX}" y="48">처음: 물 965 g + 염류 35 g → 35.0 ‰</text>`;
        out += `<text class="trait-text" style="fill:#0284c7" x="${RX}" y="70">${ev.label}: ${ev.water === 0 ? '물의 양 그대로' : ev.water > 0 ? `민물 ${ev.water} g 들어옴` : `물 ${-ev.water} g 빠져나감`}</text>`;
        out += `<text class="trait-text" x="${RX}" y="88">지금: 물 ${fmtN(965 + ev.water * t)} g + 염류 35 g</text>`;
        out += `<text class="gen-text" style="fill:#d97706" x="${RX}" y="110">염분 = 35 ÷ ${fmtN(1000 + ev.water * t)} × 1000 = ${fmtN(Snow, 1)} ‰</text>`;
        out += `<text class="small-label" x="${RX}" y="134">염류의 양(알갱이 35개)은 그대로 — 물만 늘거나 줄어</text>`;
        out += `<text class="small-label" x="${RX}" y="148">알갱이 사이가 좁아지면 짠 것, 넓어지면 싱거운 것</text>`;
        out += `<text class="small-label" x="${RX}" y="170">이온 비율은 늘 같음: 염화 55 % · 나트륨 31 %</text><text class="small-label" x="${RX}" y="184">황산 8 % · 마그네슘 4 % · 나머지 3 %</text>`;
        const VERD = { up: `염분 ${fmtN(a.S2, 1)} ‰로 오름`, down: `염분 ${fmtN(a.S2, 1)} ‰로 내림`, same: '염분 35.0 ‰ 그대로' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${state.progress >= 1 ? `${ev.label}: ${VERD[a.verdict]}` : `${ev.label} — ${ev.hint}`}</text>`;
        out += `<text class="note-text" x="20" y="208">염분(‰) = 바닷물 1 kg 속 염류의 g. 물이 드나들어도 염류의 양과 이온 비율은 변하지 않습니다</text>`;
        return out;
    }

    function graphSalinity(a) {
        const X0 = 60, W = 120, Y0 = 150, Y1 = 40;
        let out = `<text class="axis-title" x="20" y="18">왼쪽: 염분 전과 후 · 오른쪽: 이온 비율 전과 후 — 비율은 조금도 바뀌지 않습니다</text>`;
        const yOf = S => Y0 - clamp(S / 50, 0, 1) * (Y0 - Y1);
        [0, 10, 20, 30, 40, 50].forEach(S => { out += `<line class="grid-line" x1="${X0}" y1="${yOf(S).toFixed(1)}" x2="${X0 + W}" y2="${yOf(S).toFixed(1)}"/><text class="axis-text" x="${X0 - 5}" y="${(yOf(S) + 3.5).toFixed(1)}" text-anchor="end">${S}</text>`; });
        [[a.S1, '전', 'bar-a'], [a.S2, '후', 'bar-b']].forEach(([S, lab, cls], i) => { const x = X0 + 14 + i * 56; out += `<rect class="${cls}" x="${x}" y="${yOf(S).toFixed(1)}" width="36" height="${(Y0 - yOf(S)).toFixed(1)}" rx="3"/><text class="trait-text" x="${x + 18}" y="${(yOf(S) - 5).toFixed(1)}" text-anchor="middle">${fmtN(S, 1)} ‰</text><text class="axis-text" x="${x + 18}" y="${Y0 + 14}" text-anchor="middle">${lab}</text>`; });
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X0 + W}" y2="${Y0}"/>`;
        const SX = 230, SW = 190;
        [['전', Y1 + 10], ['후', Y1 + 60]].forEach(([lab, y]) => {
            let x = SX;
            IONS.forEach(([name, pct, col]) => { const w = pct / 100 * SW; out += `<rect class="ion-bar" fill="${col}" opacity=".7" x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="22"/>`; if (w > 26) out += `<text class="small-label" style="fill:#08131a" x="${(x + w / 2).toFixed(1)}" y="${y + 15}" text-anchor="middle">${pct} %</text>`; x += w; });
            out += `<text class="axis-text" x="${SX - 5}" y="${y + 15}" text-anchor="end">${lab}</text>`;
        });
        let lx = SX; IONS.forEach(([name, pct, col], i) => { out += `<rect fill="${col}" opacity=".8" x="${(SX + (i % 2) * 100).toFixed(1)}" y="${Y1 + 92 + Math.floor(i / 2) * 18}" width="9" height="9"/><text class="small-label" x="${(SX + (i % 2) * 100 + 13).toFixed(1)}" y="${Y1 + 100 + Math.floor(i / 2) * 18}">${name.split(' ')[0]}</text>`; });
        out += `<text class="small-label" x="20" y="${Y0 + 34}">염분비 일정: 염화 이온 하나만 재면 염분 전체를 알 수 있습니다 (염분 ≈ 1.8 × 염화 이온 농도).</text>`;
        return out;
    }

    function renderDensity(a) {
        const p = state.progress, { T, S, rA, rB, d } = a;
        const TX = 40, TW = 250, TT = 40, TB = 190;
        let out = `<rect class="tank" x="${TX}" y="${TT}" width="${TW}" height="${TB - TT}" rx="6"/>`;
        out += `<text class="small-label" x="${TX + 6}" y="${TT + 14}">둘레 바닷물 15 ℃ · 35 ‰ → ${fmtN(rB, 1)} kg/m³</text>`;
        const speed = clamp(Math.abs(d) / 3, 0.15, 1), move = ease(clamp(p * (0.4 + speed), 0, 1));
        const yMid = (TT + TB) / 2, yEnd = a.verdict === 'sink' ? TB - 26 : a.verdict === 'float' ? TT + 30 : yMid;
        const y = yMid + (yEnd - yMid) * move;
        out += `<circle class="parcel" fill="${tColor(T)}" fill-opacity=".85" stroke="#fff" cx="${TX + TW / 2}" cy="${y.toFixed(1)}" r="22"/>`;
        out += `<text class="small-label" style="fill:#08131a" x="${TX + TW / 2}" y="${(y - 5).toFixed(1)}" text-anchor="middle">${T} ℃</text><text class="small-label" style="fill:#08131a" x="${TX + TW / 2}" y="${(y + 13).toFixed(1)}" text-anchor="middle">${S} ‰</text>`;
        if (a.verdict !== 'same' && p > 0.05) out += arrow(TX + TW / 2 + 34, yMid, TX + TW / 2 + 34, a.verdict === 'sink' ? yMid + 40 : yMid - 40, 'wind', 'wind-head', 3);
        const RX = 302;
        out += `<text class="trait-text" x="${RX}" y="52">물덩이 ${T} ℃ · ${S} ‰</text>`;
        out += `<text class="gen-text" style="fill:#d97706" x="${RX}" y="72">${fmtN(rA, 1)} kg/m³</text>`;
        out += `<text class="trait-text" x="${RX}" y="96">둘레 바닷물</text><text class="gen-text" style="fill:#0284c7" x="${RX}" y="114">${fmtN(rB, 1)} kg/m³</text>`;
        out += `<text class="trait-text" style="fill:${d > 0.05 ? '#dc2626' : d < -0.05 ? '#059669' : '#334155'}" x="${RX}" y="140">차이 ${d >= 0 ? '+' : ''}${fmtN(d, 1)} kg/m³</text>`;
        out += `<text class="small-label" x="${RX}" y="158">${d > 0.05 ? '더 무거워 가라앉음' : d < -0.05 ? '더 가벼워 떠오름' : '같아서 그 자리'}</text>`;
        out += `<text class="small-label" x="${RX}" y="178">차가울수록·짤수록 무겁습니다</text>`;
        const VERD = { sink: '가라앉음', float: '떠오름', same: '그 자리에 머묾' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${state.progress >= 1 ? `물덩이 ${fmtN(rA, 1)} · 둘레 ${fmtN(rB, 1)} kg/m³ → ${VERD[a.verdict]}` : `${T} ℃ · ${S} ‰ 물덩이를 15 ℃ · 35 ‰ 속에`}</text>`;
        out += `<text class="note-text" x="20" y="208">밀도는 국제 해수 상태 방정식(EOS-80)으로 계산. 1 ‰ 차이 ≈ 0.8 kg/m³, 10 ℃ 차이 ≈ 2 kg/m³</text>`;
        return out;
    }

    function graphDensity(a) {
        const X0 = 60, X1 = 420, Y0 = 150, Y1 = 36;
        const xOf = S => X0 + (S - 30) / 8 * (X1 - X0), yOf = T => Y0 - (T + 2) / 32 * (Y0 - Y1);
        let out = `<text class="axis-title" x="${X0}" y="18">수온–염분 그림 위의 같은 밀도 선 (kg/m³) — 오른쪽 아래로 갈수록 무거움</text>`;
        [30, 32, 34, 36, 38].forEach(S => { out += `<line class="grid-line" x1="${xOf(S).toFixed(1)}" y1="${Y1}" x2="${xOf(S).toFixed(1)}" y2="${Y0}"/><text class="axis-text" x="${xOf(S).toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${S} ‰</text>`; });
        [0, 10, 20, 30].forEach(T => { out += `<line class="grid-line" x1="${X0}" y1="${yOf(T).toFixed(1)}" x2="${X1}" y2="${yOf(T).toFixed(1)}"/><text class="axis-text" x="${X0 - 5}" y="${(yOf(T) + 3.5).toFixed(1)}" text-anchor="end">${T} ℃</text>`; });
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        [1021, 1023, 1025, 1027, 1029].forEach(r0 => {
            let d = '', lab = null;
            for (let S = 30; S <= 38 + 1e-9; S += 0.25) {
                let lo = -2, hi = 30; if (rho(S, lo) < r0 || rho(S, hi) > r0) { if (d) { d += ' '; } continue; }
                for (let k = 0; k < 30; k += 1) { const m = (lo + hi) / 2; if (rho(S, m) > r0) lo = m; else hi = m; }
                const T = (lo + hi) / 2; d += `${d && !d.endsWith(' ') ? 'L' : 'M'}${xOf(S).toFixed(1)},${yOf(T).toFixed(1)}`; if (!lab || S <= 37.5) lab = [xOf(S), yOf(T)];
            }
            if (d) { out += `<path class="iso" d="${d.replace(/ M/g, ' M')}"/>`; if (lab) out += `<text class="iso-text" x="${(lab[0] + 3).toFixed(1)}" y="${(lab[1] - 3).toFixed(1)}">${r0}</text>`; }
        });
        out += `<circle fill="#0284c7" stroke="#fff" cx="${xOf(REF.S).toFixed(1)}" cy="${yOf(REF.T).toFixed(1)}" r="4.5"/><text class="small-label" style="fill:#0284c7" x="${(xOf(REF.S) + 7).toFixed(1)}" y="${(yOf(REF.T) + 3.5).toFixed(1)}">둘레 ${fmtN(a.rB, 1)}</text>`;
        out += `<circle fill="#d97706" stroke="#fff" cx="${xOf(a.S).toFixed(1)}" cy="${yOf(a.T).toFixed(1)}" r="4.5"/><text class="small-label" style="fill:#d97706" x="${(xOf(a.S) + (a.S >= 37 ? -7 : 7)).toFixed(1)}" y="${(yOf(a.T) + (Math.abs(a.T - REF.T) < 6 ? 15 : -6)).toFixed(1)}" text-anchor="${a.S >= 37 ? 'end' : 'start'}">물덩이 ${fmtN(a.rA, 1)}</text>`;
        out += `<text class="axis-title" x="${(X0 + X1) / 2}" y="${Y0 + 30}" text-anchor="middle">염분 — 같은 선 위의 물은 밀도가 같아 섞여도 층이 안 생깁니다</text>`;
        return out;
    }

    function noteFor(a) {
        if (a.kind === 'profile') {
            return `<div class="data-row"><span class="data-name">바다</span><span class="data-val">${REGIONS[state.region].label} ${SEASONS[state.season].label} — 표층 ${fmtN(a.sst, 1)} ℃, 심해 ${a.deep} ℃ (차이 ${fmtN(Math.abs(a.dT), 1)} ℃)</span></div>` +
                `<div class="data-row"><span class="data-name">혼합층</span><span class="data-val">0~${a.mld} m — 바람이 섞어 수온이 고름</span></div>` +
                `<div class="data-row"><span class="data-name">수온약층</span><span class="data-val">${a.verdict === 'none' ? '뚜렷하지 않음 (위아래 차이 3 ℃ 미만)' : `${a.mld}~${a.thermoEnd} m — 가장 급한 곳 ${fmtN((a.sst - a.deep) / a.L * 100, 1)} ℃/100 m`}</span></div>` +
                `<div class="data-row match"><span class="data-name">판정</span><span class="data-val">${a.verdict === 'shallow' ? '얕고 뚜렷한 수온약층' : a.verdict === 'deep' ? '깊고 완만한 수온약층' : '수온약층이 거의 없음'}</span></div>`;
        }
        if (a.kind === 'salinity') {
            return `<div class="data-row"><span class="data-name">처음</span><span class="data-val">물 965 g + 염류 35 g = 1,000 g → 35 ÷ 1,000 × 1000 = 35.0 ‰</span></div>` +
                `<div class="data-row"><span class="data-name">${a.ev.label}</span><span class="data-val">${a.ev.hint}${a.ev.ice === 'form' ? ' (얼음에는 염류가 거의 안 들어감)' : ''}</span></div>` +
                `<div class="data-row"><span class="data-name">나중</span><span class="data-val">물 ${fmtN(a.water)} g + 염류 35 g = ${fmtN(a.water + 35)} g → 35 ÷ ${fmtN(a.water + 35)} × 1000 = ${fmtN(a.S2, 1)} ‰</span></div>` +
                `<div class="data-row match"><span class="data-name">이온 비율</span><span class="data-val">그대로 (염화 55.0 · 나트륨 30.6 · 황산 7.7 · 마그네슘 3.7 %) — 염분비 일정</span></div>`;
        }
        return `<div class="data-row"><span class="data-name">물덩이</span><span class="data-val">${a.T} ℃ · ${a.S} ‰ → 밀도 ${fmtN(a.rA, 2)} kg/m³</span></div>` +
            `<div class="data-row"><span class="data-name">둘레 바닷물</span><span class="data-val">15 ℃ · 35 ‰ → 밀도 ${fmtN(a.rB, 2)} kg/m³</span></div>` +
            `<div class="data-row"><span class="data-name">차이</span><span class="data-val">${a.d >= 0 ? '+' : ''}${fmtN(a.d, 2)} kg/m³ (${fmtN(Math.abs(a.d) / a.rB * 100, 2)} %)</span></div>` +
            `<div class="data-row match"><span class="data-name">판정</span><span class="data-val">${a.verdict === 'sink' ? '가라앉음' : a.verdict === 'float' ? '떠오름' : '같아서 그 자리'}</span></div>`;
    }

    function render() {
        const a = analyse();
        mainGroup.innerHTML = a.kind === 'profile' ? renderProfile(a) : a.kind === 'salinity' ? renderSalinity(a) : renderDensity(a);
        graphGroup.innerHTML = a.kind === 'profile' ? graphProfile(a) : a.kind === 'salinity' ? graphSalinity(a) : graphDensity(a);
        liftProse();
        stageBadge.textContent = a.kind === 'profile' ? `${REGIONS[state.region].label} · ${SEASONS[state.season].label}` : a.kind === 'salinity' ? EVENTS[state.event].label : `${TEMPS[state.temp].label} · ${SALTS[state.salt].label}`;
        methodHint.textContent = a.kind === 'profile' ? '햇볕은 표층만 데우고, 바람은 그 열을 아래로 섞습니다'
            : a.kind === 'salinity' ? '염류는 그대로, 물만 드나듭니다 — 이온 비율은 늘 같습니다'
                : '차고 짤수록 무겁습니다. 무거운 물이 가라앉으며 층과 순환이 생깁니다';
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
        if (a.kind === 'profile') {
            const r = REGIONS[state.region], se = SEASONS[state.season];
            labelA.textContent = '혼합층 깊이'; valueA.textContent = `${a.mld} m`;
            labelB.textContent = '표층과 심해 차이'; valueB.textContent = `${fmtN(Math.abs(a.dT), 1)} ℃`;
            s = `${r.label} ${se.label} 바다는 표층이 ${fmtN(a.sst, 1)} ℃, 심해가 ${a.deep} ℃입니다. ${se.label === '여름' ? '햇볕이 세서 겉물이 데워지고 바람이 약해' : '햇볕이 약해 겉물이 식고 바람이 세서'} 혼합층은 ${a.mld} m까지입니다. `;
            if (a.verdict === 'none') s += `표층과 심해의 온도 차이가 ${fmtN(Math.abs(a.dT), 1)} ℃뿐이라 아래로 갈수록 급히 식는 층이 생기지 않습니다. 극지방 바다는 위아래가 다 차서 층이 없고, 그래서 표층수가 식거나 얼며 짜지면 곧장 심해로 가라앉을 수 있습니다.`;
            else if (a.verdict === 'shallow') s += `그 바로 아래 ${a.mld}~${a.thermoEnd} m에서 수온이 ${fmtN(a.dT, 1)} ℃나 급히 떨어지는 얕고 뚜렷한 수온약층이 생깁니다. 이 층은 위아래 물이 섞이는 것을 막는 뚜껑이라, 표층의 산소가 아래로, 심해의 영양분이 위로 오르내리기 어렵습니다.`;
            else s += `겨울에는 식은 표층수가 무거워져 가라앉고 센 바람이 깊이 휘저어 혼합층이 ${a.mld} m로 깊어지며, 수온약층은 그 아래 ${a.mld}~${a.thermoEnd} m에서 완만하게 나타납니다. 이때 위아래가 잘 섞여 표층에 영양분이 올라오고, 봄에 플랑크톤이 크게 늘어나는 바탕이 됩니다.`;
        } else if (a.kind === 'salinity') {
            const { ev } = a;
            labelA.textContent = '염분'; valueA.textContent = `35.0 → ${fmtN(a.S2, 1)} ‰`;
            labelB.textContent = '염류의 양'; valueB.textContent = '35 g 그대로';
            s = `바닷물 1 kg은 물 965 g에 염류 35 g이 녹아 있어 35 ‰입니다. ${ev.how} ${ev.water === 0 ? '물도 염류도 넣거나 빼지 않으므로 염분은 35.0 ‰ 그대로입니다.' : `염류는 35 g 그대로인데 전체가 ${fmtN(a.water + 35)} g으로 ${ev.water > 0 ? '늘어' : '줄어'} 염분은 35 ÷ ${fmtN(a.water + 35)} × 1000 = ${fmtN(a.S2, 1)} ‰로 ${ev.water > 0 ? '내려갑니다' : '올라갑니다'}.`} `;
            s += `어느 경우든 녹아 있는 이온끼리의 비율(염화 이온 55 %, 나트륨 이온 31 % …)은 변하지 않습니다. 물만 드나들기 때문이고, 이것이 염분비 일정의 법칙입니다.${ev.ice === 'form' ? ' 극지방에서 이렇게 짜지고 차가워진 물이 심해로 가라앉아 심층 순환을 일으킵니다.' : ''}`;
        } else {
            labelA.textContent = '물덩이 밀도'; valueA.textContent = `${fmtN(a.rA, 1)} kg/m³`;
            labelB.textContent = '둘레 바닷물'; valueB.textContent = `${fmtN(a.rB, 1)} kg/m³`;
            s = `${a.T} ℃·${a.S} ‰ 물덩이의 밀도는 해수 상태 방정식으로 ${fmtN(a.rA, 2)} kg/m³이고, 둘레 바닷물(15 ℃·35 ‰)은 ${fmtN(a.rB, 2)} kg/m³입니다. `;
            if (a.verdict === 'same') s += `같은 물이라 밀도가 같고, 물덩이는 그 자리에 머뭅니다. 밀도가 같은 물끼리는 섞여도 층이 생기지 않습니다.`;
            else if (a.verdict === 'sink') {
                const why = a.T < 15 && a.S > 35 ? '차가워서 물 분자가 촘촘히 모인 데다 더 짜서 이온도 많아' : a.T < 15 && a.S < 35 ? '염류가 적어 가벼워지는 몫보다 차가워서 물 분자가 촘촘히 모이는 몫이 더 커' : a.T < 15 ? '차가워서 물 분자가 더 촘촘히 모여' : a.S > 35 ? '더 짜서 녹은 이온이 더 많아' : '물 분자와 이온이 더 촘촘히 들어차';
                s += `물덩이가 ${fmtN(a.d, 2)} kg/m³ 더 무겁습니다. ${why} 무거워졌기 때문입니다. 차이는 ${fmtN(Math.abs(a.d) / a.rB * 100, 2)} %에 지나지 않지만 그것으로 충분해 물덩이는 둘레 물을 헤치고 가라앉습니다. 극지방에서 결빙으로 차고 짜진 물이 이렇게 가라앉아 심층 순환이 시작됩니다.`;
            } else {
                const why = a.T > 15 && a.S < 35 ? '따뜻해서 물 분자 사이가 벌어진 데다 녹은 염류도 적어' : a.T > 15 && a.S > 35 ? '더 짜서 무거워지는 몫보다 따뜻해서 물 분자 사이가 벌어지는 몫이 더 커' : a.T > 15 ? '따뜻해서 물 분자 사이가 벌어져' : a.S < 35 ? '녹은 염류가 적어' : '물 분자 사이가 벌어져';
                s += `물덩이가 ${fmtN(-a.d, 2)} kg/m³ 더 가볍습니다. ${why} 가벼워졌기 때문입니다. 가벼운 물은 위에 떠서 표층을 이루고, 그 아래 무거운 물과 뚜렷한 경계를 만듭니다. 열대 바다와 강물이 흘러드는 곳의 표층수가 그렇습니다.`;
            }
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
        checkBtn.textContent = state.mode === 'profile' ? '수온 재기' : state.mode === 'salinity' ? '일어나게 하기' : '물덩이 놓기';
        stageCaption.textContent = state.mode === 'profile' ? '왼쪽 물기둥의 색이 수온입니다. 노란 곡선이 깊이에 따른 수온이고, 급하게 꺾이는 곳이 수온약층입니다.'
            : state.mode === 'salinity' ? '비커 속 흰 알갱이 35개가 염류입니다. 물이 늘거나 줄면 알갱이 사이가 벌어지거나 좁아집니다.'
                : '가운데 물덩이가 둘레 바닷물보다 무거우면 가라앉고 가벼우면 떠오릅니다. 색은 수온입니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { region: 'mid', season: 'summer', event: 'evap', temp: 't0', salt: 's35', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'profile').click();
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

    window.__layersModel = {
        REGIONS, SEASONS, EVENTS, TEMPS, SALTS, state,
        analyse, render, rho, runSeconds,
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
