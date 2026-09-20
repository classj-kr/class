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
    const AU = 149.6e6, PE = 365.25, D2R = Math.PI / 180, R2D = 180 / Math.PI;
    // real orbital radii (AU), periods (days), diameters (km), inclinations (°); circular orbits are an approximation
    const PLANETS = {
        mercury: { label: '수성', hint: '88일', a: 0.387, P: 87.97, D: 4879, i: 7.0, inner: true, col: '#c8c8c8', win: 35 },
        venus: { label: '금성', hint: '225일', a: 0.723, P: 224.7, D: 12104, i: 3.39, inner: true, col: '#d97706', win: 60 },
        mars: { label: '화성', hint: '687일', a: 1.524, P: 687.0, D: 6779, i: 1.85, inner: false, col: '#ff7a59', win: 100 },
        jupiter: { label: '목성', hint: '11.9년', a: 5.203, P: 4333, D: 139820, i: 1.30, inner: false, col: '#f5c58a', win: 140 },
        saturn: { label: '토성', hint: '29.5년', a: 9.537, P: 10759, D: 116460, i: 2.49, inner: false, col: '#e8d9a8', win: 160 },
    };
    const PHASE_PLANETS = { mercury: PLANETS.mercury, venus: PLANETS.venus, mars: PLANETS.mars };
    const POS_INNER = { near: { label: '내합 직전', hint: '태양과 15°' }, elong: { label: '최대 이각', hint: '옆으로 가장 벌어짐' }, far: { label: '외합 직전', hint: '태양과 15°' } };
    const POS_OUTER = { near: { label: '충', hint: '지구에 가장 가까움' }, far: { label: '합 직전', hint: '태양과 15°' } };
    const KINDS = { solar: { label: '일식', hint: '삭 — 달이 해를 가림' }, lunar: { label: '월식', hint: '망 — 달이 그림자에 듦' } };
    const NODES = { n0: { label: '교점', hint: '황위 0°', dl: 0 }, n6: { label: '6°', hint: '황위 0.54°', dl: 6 }, n12: { label: '12°', hint: '황위 1.07°', dl: 12 }, n20: { label: '20°', hint: '황위 1.76°', dl: 20 } };
    const DISTS = { perigee: { label: '근지점', hint: '363,300 km', d: 363300 }, mean: { label: '평균', hint: '384,400 km', d: 384400 }, apogee: { label: '원지점', hint: '405,500 km', d: 405500 } };
    const RS = 696000, RE = 6371, RM = 1737.4, INCL = 5.145;

    const state = { mode: 'retro', planet: 'mars', pplanet: 'venus', ppos: 'elong', kind: 'solar', node: 'n0', dist: 'mean', progress: 0, prediction: null };
    let running = false, frameId = 0, lastStamp = 0;

    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const ease = p => p < 0.5 ? 2 * p * p : 1 - (1 - p) * (1 - p) * 2;
    const fmtN = (n, d = 0) => (+n.toFixed(d)).toLocaleString('ko-KR', { minimumFractionDigits: d, maximumFractionDigits: d }).replace('-', '−');
    const solve = (f, lo, hi) => { let flo = f(lo); for (let k = 0; k < 60; k += 1) { const m = (lo + hi) / 2, fm = f(m); if ((fm < 0) === (flo < 0)) { lo = m; flo = fm; } else hi = m; } return (lo + hi) / 2; };

    /* ------------------------------------------------------------ models */
    // geometry of Earth (at angle 0, 1 AU) and a planet at heliocentric angle psi
    function geom(pl, psi) {
        const px = pl.a * Math.cos(psi), py = pl.a * Math.sin(psi), dx = px - 1, dy = py, delta = Math.hypot(dx, dy);
        const e = Math.acos(clamp(-dx / delta, -1, 1)); // elongation: angle at Earth between Sun and planet
        const alpha = Math.acos(clamp((-px * (1 - px) + -py * (0 - py)) / (pl.a * delta), -1, 1)); // phase angle at the planet
        const k = (1 + Math.cos(alpha)) / 2, size = pl.D / (delta * AU) * 206265;
        return { psi, px, py, dx, dy, delta, e, alpha, k, size, west: dy > 0 };
    }
    function retroModel(key) {
        const pl = PLANETS[key], W = pl.win, NODE = -20 * D2R, rows = [];
        const pos = t => {
            const te = 2 * Math.PI * t / PE, tp = 2 * Math.PI * t / pl.P;
            const ex = Math.cos(te), ey = Math.sin(te), px = pl.a * Math.cos(tp), py = pl.a * Math.sin(tp), dx = px - ex, dy = py - ey;
            const delta = Math.hypot(dx, dy), z = pl.a * Math.sin(pl.i * D2R) * Math.sin(tp - NODE);
            return { t, lam: Math.atan2(dy, dx), beta: Math.atan2(z, delta) * R2D, delta, ex, ey, px, py };
        };
        for (let t = -W; t <= W; t += 1) rows.push(pos(t));
        let prev = rows[0].lam, acc = 0;
        rows.forEach(r => { let d = r.lam - prev; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; acc += d; r.lon = acc * R2D; prev = r.lam; });
        const lon0 = rows[W].lon; rows.forEach(r => { r.lon -= lon0; });
        let t1 = null, t2 = null;
        for (let k = 1; k < rows.length; k += 1) { const dec = rows[k].lon < rows[k - 1].lon; if (dec && t1 === null) t1 = rows[k - 1].t; if (!dec && t1 !== null && t2 === null) t2 = rows[k - 1].t; }
        if (t1 !== null && t2 === null) t2 = W;
        const dur = t1 === null ? 0 : t2 - t1, arc = t1 === null ? 0 : rows[t1 + W].lon - rows[t2 + W].lon;
        return { kind: 'retro', pl, W, rows, t1, t2, dur, arc, verdict: dur <= 50 ? 'short' : dur <= 100 ? 'mid' : 'long' };
    }
    function phaseModel(key, posKey) {
        const pl = PHASE_PLANETS[key];
        let psi;
        if (pl.inner) {
            const tangent = Math.acos(pl.a);
            psi = posKey === 'near' ? solve(x => geom(pl, x).e - 15 * D2R, 1e-4, tangent) : posKey === 'elong' ? tangent : solve(x => geom(pl, x).e - 15 * D2R, tangent, Math.PI - 1e-4);
        } else psi = posKey === 'near' ? 0 : solve(x => geom(pl, x).e - 15 * D2R, 1e-4, Math.PI - 1e-4);
        const g = geom(pl, psi), sizeMax = pl.D / (Math.abs(pl.a - 1) * AU) * 206265, sizeMin = pl.D / ((pl.a + 1) * AU) * 206265;
        const verdict = g.k < 0.25 ? 'crescent' : g.k < 0.7 ? 'half' : g.size >= 0.6 * sizeMax ? 'fullNear' : 'fullFar';
        return { kind: 'phase', pl, posKey, psi, g, sizeMax, sizeMin, verdict };
    }
    // eclipse geometry: Sun radius, Earth radius, Moon radius, Moon distance d, Moon's ecliptic latitude beta at syzygy
    function eclipseType(kindKey, d, beta) {
        const offset = d * Math.sin(beta * D2R); // distance of the shadow axis from the Earth's centre (or the Moon's centre from the Earth's shadow axis)
        if (kindKey === 'solar') {
            const Lu = RM * AU / (RS - RM), Rpen = RM + d * (RS + RM) / AU;
            if (offset < RE) { const x = d - Math.sqrt(RE * RE - offset * offset); return { type: x < Lu ? 'total' : 'annular', offset, Lu, x, Rpen, Ru: RM * (1 - x / Lu) }; }
            return { type: offset < RE + Rpen ? 'partial' : 'none', offset, Lu, x: d, Rpen, Ru: 0 };
        }
        const Ru = RE - d * (RS - RE) / AU, Rp = RE + d * (RS + RE) / AU;
        return { type: offset + RM <= Ru ? 'total' : offset - RM < Ru ? 'partial' : offset - RM < Rp ? 'penumbral' : 'none', offset, Ru, Rp };
    }
    function eclipseModel() {
        const kindKey = state.kind, d = DISTS[state.dist].d, dl = NODES[state.node].dl;
        const beta = Math.asin(Math.sin(INCL * D2R) * Math.sin(dl * D2R)) * R2D;
        const ec = eclipseType(kindKey, d, beta);
        return { kind: 'eclipse', kindKey, d, dl, beta, ...ec, verdict: ec.type };
    }

    function analyse() {
        if (state.mode === 'retro') return retroModel(state.planet);
        if (state.mode === 'phase') return phaseModel(state.pplanet, state.ppos);
        return eclipseModel();
    }
    const runSeconds = () => 6;

    /* ---------------------------------------------------------- controls */
    function pickRow(legend, name, options, current, cols) {
        return `<fieldset class="pick-field"><legend>${legend}</legend>` +
            `<div class="pick-buttons cols${cols}" data-pick="${name}">` +
            options.map(o => `<button type="button" data-value="${o.value}" class="${o.value === String(current) ? 'selected' : ''}">` +
                `${o.label}${o.hint ? `<small>${o.hint}</small>` : ''}</button>`).join('') +
            `</div></fieldset>`;
    }
    const opts = table => Object.entries(table).map(([k, v]) => ({ value: k, label: v.label, hint: v.hint }));
    const posTable = () => PHASE_PLANETS[state.pplanet].inner ? POS_INNER : POS_OUTER;

    function buildControls() {
        if (state.mode === 'retro') controlArea.innerHTML = pickRow('행성 (공전 주기)', 'planet', opts(PLANETS), state.planet, 5);
        else if (state.mode === 'phase') {
            if (!posTable()[state.ppos]) state.ppos = 'near';
            const pt = posTable();
            const rows = Object.entries(pt).map(([k, v]) => ({ value: k, label: v.label, hint: k === 'elong' ? `태양과 ${fmtN(Math.asin(PHASE_PLANETS[state.pplanet].a) * R2D)}°` : v.hint }));
            controlArea.innerHTML = pickRow('행성', 'pplanet', opts(PHASE_PLANETS), state.pplanet, 3) + pickRow('행성의 자리', 'ppos', rows, state.ppos, Object.keys(pt).length);
        } else controlArea.innerHTML = pickRow('식의 종류', 'kind', opts(KINDS), state.kind, 2) + pickRow('교점에서 떨어진 각 (달의 황위)', 'node', opts(NODES), state.node, 4) + pickRow('달까지 거리', 'dist', opts(DISTS), state.dist, 3);
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                if (group.dataset.pick === 'pplanet') buildControls();
                else group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                buildPrediction();
                settingsChanged();
            }));
        });
    }

    const PRED_R = [{ value: 'short', label: '한 달 남짓 (50일 안)' }, { value: 'mid', label: '두 달 반쯤 (50~100일)' }, { value: 'long', label: '넉 달 안팎 (100일 넘게)' }];
    const PRED_P = [{ value: 'crescent', label: '가는 초승달, 가장 크게' }, { value: 'half', label: '반달쯤' }, { value: 'fullFar', label: '둥글고 가장 작게' }, { value: 'fullNear', label: '둥글고 가장 크게' }];
    const PRED_S = [{ value: 'total', label: '개기일식' }, { value: 'annular', label: '금환일식' }, { value: 'partial', label: '부분일식' }, { value: 'none', label: '일식 없음' }];
    const PRED_L = [{ value: 'total', label: '개기월식' }, { value: 'partial', label: '부분월식' }, { value: 'penumbral', label: '반영월식' }, { value: 'none', label: '월식 없음' }];

    function buildPrediction() {
        const list = state.mode === 'retro' ? PRED_R : state.mode === 'phase' ? PRED_P : state.kind === 'solar' ? PRED_S : PRED_L;
        predictionLegend.textContent = state.mode === 'retro' ? `${PLANETS[state.planet].label}은 ${PLANETS[state.planet].inner ? '내합' : '충'} 앞뒤로 얼마나 오래 서쪽으로 되돌아갈까요?`
            : state.mode === 'phase' ? `${PHASE_PLANETS[state.pplanet].label}이 ${posTable()[state.ppos].label}에 있을 때 어떻게 보일까요?`
                : `${state.node === 'n0' ? '교점 바로' : `교점에서 ${NODES[state.node].dl}°`}, 달까지 ${DISTS[state.dist].hint}일 때 어떤 ${KINDS[state.kind].label}이 될까요?`;
        predictionArea.className = `prediction-buttons ${list.length === 4 ? 'four' : 'three'}`;
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction;
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    const stars = []; for (let i = 0; i < 70; i += 1) stars.push([((i * 7919) % 997) / 997, ((i * 104729) % 991) / 991, 0.5 + ((i * 31) % 7) / 7]);
    const phasePath = (cx, cy, r, k, litRight) => {
        const rx = r * Math.abs(2 * k - 1), s1 = litRight ? 1 : 0, s2 = (k > 0.5 ? 1 : 0) === 1 ? s1 : 1 - s1;
        return `M${cx},${(cy - r).toFixed(1)} A${r},${r} 0 0 ${s1} ${cx},${(cy + r).toFixed(1)} A${rx.toFixed(2)},${r} 0 0 ${s2} ${cx},${(cy - r).toFixed(1)} Z`;
    };

    function renderRetro(a) {
        const p = state.progress, { pl, W, rows } = a, t = Math.round(-W + 2 * W * p), row = rows[t + W];
        const CX = 92, CY = 110, s = 66 / Math.max(pl.a, 1);
        let out = `<circle class="orbit" cx="${CX}" cy="${CY}" r="${s.toFixed(1)}"/><circle class="orbit" cx="${CX}" cy="${CY}" r="${(pl.a * s).toFixed(1)}"/><circle class="sun-dot" cx="${CX}" cy="${CY}" r="4"/>`;
        const P = r => [CX + r.px * s, CY - r.py * s], E = r => [CX + r.ex * s, CY - r.ey * s];
        // faint sight lines at the two stationary points, the current one bright
        [a.t1, a.t2].forEach(tt => { if (tt === null) return; const r = rows[tt + W], e = E(r), q = P(r); out += `<line class="sight" x1="${e[0].toFixed(1)}" y1="${e[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}"/>`; });
        const e = E(row), q = P(row), L = Math.hypot(q[0] - e[0], q[1] - e[1]) || 1, ext = Math.min(80, 74 - Math.hypot(q[0] - CX, q[1] - CY));
        out += `<line class="sight now" x1="${e[0].toFixed(1)}" y1="${e[1].toFixed(1)}" x2="${(q[0] + (q[0] - e[0]) / L * Math.max(0, ext)).toFixed(1)}" y2="${(q[1] + (q[1] - e[1]) / L * Math.max(0, ext)).toFixed(1)}"/>`;
        out += `<circle class="earth-dot" cx="${e[0].toFixed(1)}" cy="${e[1].toFixed(1)}" r="3.5"/><circle fill="${pl.col}" cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="4"/>`;
        out += `<text class="small-label" x="${CX}" y="196" text-anchor="middle">위에서 본 궤도 (축척대로) · 파랑 지구 · ${pl.label}</text>`;
        // sky strip: east on the left, as when facing south
        const SX0 = 212, SX1 = 446, SY0 = 36, SY1 = 152;
        out += `<rect class="sky" x="${SX0}" y="${SY0}" width="${SX1 - SX0}" height="${SY1 - SY0}" rx="4"/>`;
        stars.forEach(([u, v, r]) => { out += `<circle class="star" cx="${(SX0 + 4 + u * (SX1 - SX0 - 8)).toFixed(1)}" cy="${(SY0 + 4 + v * (SY1 - SY0 - 8)).toFixed(1)}" r="${r.toFixed(1)}"/>`; });
        const lons = rows.map(r => r.lon), lonMin = Math.min(...lons), lonMax = Math.max(...lons), span = Math.max(1e-6, lonMax - lonMin);
        const betaMax = Math.max(...rows.map(r => Math.abs(r.beta)), 1e-6);
        const sc = Math.min((SX1 - SX0 - 24) / span, 48 / betaMax);
        const xOf = lon => SX1 - 12 - (lon - lonMin) * sc - ((SX1 - SX0 - 24) - span * sc) / 2, yOf = beta => (SY0 + SY1) / 2 - beta * sc;
        let dPro = '', dRet = '', dPro2 = '';
        rows.forEach(r => {
            if (r.t > t) return;
            const seg = a.t1 !== null && r.t >= a.t1 && r.t <= a.t2 ? 'ret' : a.t1 !== null && r.t > a.t2 ? 'pro2' : 'pro';
            const pt = `${xOf(r.lon).toFixed(1)},${yOf(r.beta).toFixed(1)} `;
            if (seg === 'pro') dPro += (dPro ? 'L' : 'M') + pt; else if (seg === 'ret') dRet += (dRet ? 'L' : 'M') + pt; else dPro2 += (dPro2 ? 'L' : 'M') + pt;
        });
        out += `<path class="path-fore" d="${dPro}"/><path class="path-retro" d="${dRet}"/><path class="path-fore" d="${dPro2}"/>`;
        [a.t1, a.t2].forEach(tt => { if (tt !== null && t >= tt) { const r = rows[tt + W]; out += `<circle class="stop-dot" cx="${xOf(r.lon).toFixed(1)}" cy="${yOf(r.beta).toFixed(1)}" r="4"/>`; } });
        out += `<circle fill="${pl.col}" stroke="#fff" stroke-width=".8" cx="${xOf(row.lon).toFixed(1)}" cy="${yOf(row.beta).toFixed(1)}" r="4"/>`;
        out += `<text class="small-label" x="${SX0}" y="${SY0 - 6}">동쪽 ←</text><text class="small-label" x="${(SX0 + SX1) / 2}" y="${SY0 - 6}" text-anchor="middle">남쪽 하늘에 찍힌 ${pl.label}의 자리</text><text class="small-label" x="${SX1}" y="${SY0 - 6}" text-anchor="end">→ 서쪽</text>`;
        out += `<text class="small-label" style="fill:#e2e8f0" x="${SX0 + 6}" y="${SY1 - 6}">가로 ${fmtN(span, 1)}° · 세로 남북 ${fmtN(betaMax * 2, 1)}° (같은 눈금)</text>`;
        const ref = pl.inner ? '내합' : '충';
        const inRet = a.t1 !== null && t >= a.t1 && t <= a.t2;
        out += `<text class="trait-text" x="${SX0}" y="170">${t === 0 ? ref : t < 0 ? `${ref} ${-t}일 전` : `${ref} ${t}일 후`} · 지구에서 ${fmtN(row.delta, 2)} AU · 황경 ${row.lon >= 0 ? '+' : ''}${fmtN(row.lon, 1)}°</text>`;
        out += `<text class="trait-text" style="fill:${inRet ? '#dc2626' : '#0369a1'}" x="${SX0}" y="186">${inRet ? '지금 서쪽으로 되돌아가는 중 (역행)' : '지금 동쪽으로 가는 중 (순행)'}</text>`;
        const VERD = { short: '한 달 남짓', mid: '두 달 반쯤', long: '넉 달 안팎' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${p >= 1 ? `${pl.label}: ${ref} ${-a.t1}일 전부터 ${a.t2}일 후까지 ${a.dur}일 동안 역행 — ${VERD[a.verdict]}` : `${pl.label} · ${ref} 앞뒤 ${W}일씩`}</text>`;
        out += `<text class="note-text" x="20" y="208">궤도는 원, 공전 주기와 반지름은 실제 값. 남북 움직임은 궤도 기울기 ${pl.i}°에서 나온 것(대략)</text>`;
        return out;
    }

    function graphRetro(a) {
        const { W, rows, pl } = a, X0 = 60, X1 = 420, Y0 = 150, Y1 = 40;
        const lons = rows.map(r => r.lon), lonMin = Math.min(...lons), lonMax = Math.max(...lons), pad = (lonMax - lonMin) * 0.08 || 1;
        const xOf = t => X0 + (t + W) / (2 * W) * (X1 - X0), yOf = lon => Y0 - (lon - lonMin + pad) / (lonMax - lonMin + 2 * pad) * (Y0 - Y1);
        let out = `<text class="axis-title" x="${X0}" y="18">날짜에 따른 ${pl.label}의 황경 — 내려가는 구간이 서쪽으로 되돌아가는 때 (역행)</text>`;
        if (a.t1 !== null) out += `<rect class="retro-band" x="${xOf(a.t1).toFixed(1)}" y="${Y1}" width="${(xOf(a.t2) - xOf(a.t1)).toFixed(1)}" height="${Y0 - Y1}"/>`;
        [-W, -W / 2, 0, W / 2, W].forEach(t => { out += `<line class="grid-line" x1="${xOf(t).toFixed(1)}" y1="${Y1}" x2="${xOf(t).toFixed(1)}" y2="${Y0}"/><text class="axis-text" x="${xOf(t).toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${t === 0 ? (pl.inner ? '내합' : '충') : `${t > 0 ? '+' : '−'}${Math.abs(t)}일`}</text>`; });
        [lonMin, (lonMin + lonMax) / 2, lonMax].forEach(l => { out += `<line class="grid-line" x1="${X0}" y1="${yOf(l).toFixed(1)}" x2="${X1}" y2="${yOf(l).toFixed(1)}"/><text class="axis-text" x="${X0 - 5}" y="${(yOf(l) + 3.5).toFixed(1)}" text-anchor="end">${l >= 0 ? '+' : ''}${fmtN(l, 0)}°</text>`; });
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        const tNow = Math.round(-W + 2 * W * state.progress);
        let d = ''; rows.forEach(r => { if (r.t <= tNow) d += `${d ? 'L' : 'M'}${xOf(r.t).toFixed(1)},${yOf(r.lon).toFixed(1)} `; });
        out += `<path class="trace" style="stroke:#d97706" d="${d}"/>`;
        if (a.t1 !== null) { const r1 = rows[a.t1 + W], r2 = rows[a.t2 + W]; out += `<text class="small-label" style="fill:#dc2626" x="${((xOf(a.t1) + xOf(a.t2)) / 2).toFixed(1)}" y="${Y1 + 12}" text-anchor="middle">역행 ${a.dur}일 · ${fmtN(a.arc, 1)}° 되돌아감</text>`; if (tNow >= a.t1) out += `<circle class="stop-dot" cx="${xOf(a.t1).toFixed(1)}" cy="${yOf(r1.lon).toFixed(1)}" r="3.5"/>`; if (tNow >= a.t2) out += `<circle class="stop-dot" cx="${xOf(a.t2).toFixed(1)}" cy="${yOf(r2.lon).toFixed(1)}" r="3.5"/>`; }
        out += `<text class="axis-title" x="${(X0 + X1) / 2}" y="${Y0 + 30}" text-anchor="middle">황경은 동쪽으로 갈수록 커집니다. 동그라미가 멈추는 순간 유(留)</text>`;
        return out;
    }

    function renderPhase(a) {
        const p = state.progress, { pl } = a, psi = a.psi - 2 * Math.PI * (1 - ease(p)), g = geom(pl, psi);
        const CX = 92, CY = 110, s = 66 / Math.max(pl.a, 1);
        let out = `<circle class="orbit" cx="${CX}" cy="${CY}" r="${s.toFixed(1)}"/><circle class="orbit" cx="${CX}" cy="${CY}" r="${(pl.a * s).toFixed(1)}"/><circle class="sun-dot" cx="${CX}" cy="${CY}" r="6"/>`;
        const ex = CX + s, ey = CY, px = CX + g.px * s, py = CY - g.py * s;
        out += `<line class="sight" x1="${ex.toFixed(1)}" y1="${ey}" x2="${CX}" y2="${CY}"/><line class="sight now" x1="${ex.toFixed(1)}" y1="${ey}" x2="${px.toFixed(1)}" y2="${py.toFixed(1)}"/>`;
        // the planet's sunlit half, seen from above
        const ang = Math.atan2(-(g.py), g.px), r0 = 5;
        out += `<circle fill="#1b2733" stroke="rgba(148, 163, 184, 0.40)" cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${r0}"/>`;
        out += `<path fill="${pl.col}" d="M${(px + r0 * Math.cos(ang + Math.PI / 2)).toFixed(1)},${(py + r0 * Math.sin(ang + Math.PI / 2)).toFixed(1)} A${r0},${r0} 0 0 1 ${(px + r0 * Math.cos(ang - Math.PI / 2)).toFixed(1)},${(py + r0 * Math.sin(ang - Math.PI / 2)).toFixed(1)} Z"/>`;
        out += `<circle class="earth-dot" cx="${ex.toFixed(1)}" cy="${ey}" r="3.5"/>`;
        out += `<text class="small-label" x="${CX}" y="196" text-anchor="middle">위에서 본 궤도 (축척대로) · 밝은 쪽이 태양 쪽</text>`;
        // the disk as seen from Earth
        const DX = 330, DY = 100, r = 6 + 34 * clamp(g.size / a.sizeMax, 0, 1), litRight = !g.west;
        out += `<rect class="sky" x="220" y="30" width="224" height="136" rx="10"/>`;
        out += `<circle class="disk-dark" cx="${DX}" cy="${DY}" r="${r.toFixed(1)}"/><path class="disk-lit" fill="${pl.col}" d="${phasePath(DX, DY, r, g.k, litRight)}"/>`;
        // the sunlit limb is outlined so even a hairline crescent stays visible
        out += `<path fill="none" stroke="${pl.col}" stroke-width="1.6" d="M${DX},${(DY - r).toFixed(1)} A${r.toFixed(1)},${r.toFixed(1)} 0 0 ${litRight ? 1 : 0} ${DX},${(DY + r).toFixed(1)}"/>`;
        out += `<text class="small-label" style="fill:#cbd5e1" x="${DX}" y="${DY - 46}" text-anchor="middle">지구에서 본 ${pl.label} (크기는 가장 클 때에 견준 비율)</text>`;
        out += `<text class="small-label" style="fill:#94a3b8" x="${DX + (litRight ? 52 : -52)}" y="${DY + 3.5}" text-anchor="${litRight ? 'start' : 'end'}">☀ 태양 쪽</text>`;
        out += `<text class="trait-text" x="212" y="170">지구에서 ${fmtN(g.delta, 2)} AU · 겉보기 지름 ${fmtN(g.size, 1)}″ · 태양과 ${fmtN(g.e * R2D)}° 벌어짐</text>`;
        out += `<text class="trait-text" x="212" y="186">밝은 부분 ${fmtN(g.k * 100)} % — ${g.k < 0.25 ? '가는 초승달' : g.k < 0.7 ? '반달쯤' : g.k < 0.97 ? '조금 이지러진 둥근 모양' : '둥근 모양'}</text>`;
        const VERD = { crescent: '가는 초승달, 가장 크게', half: '반달쯤', fullFar: '둥글고 가장 작게', fullNear: '둥글고 가장 크게' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${p >= 1 ? `${pl.label} ${posTable()[a.posKey].label}: ${VERD[a.verdict]} (${fmtN(a.g.size, 1)}″, ${fmtN(a.g.k * 100)} %)` : `${pl.label} · ${posTable()[a.posKey].label}까지 한 바퀴`}</text>`;
        out += `<text class="note-text" x="20" y="208">겉보기 지름 = 실제 지름 ÷ 거리, 밝은 부분 = (1 + cos 위상각) ÷ 2. 1″은 1°의 3,600분의 1</text>`;
        return out;
    }

    function graphPhase(a) {
        const { pl } = a, X0 = 60, X1 = 420, Y0 = 150, Y1 = 40, top = Math.ceil(a.sizeMax / 10) * 10;
        const xOf = deg => X0 + deg / 360 * (X1 - X0), ySize = v => Y0 - v / top * (Y0 - Y1), yPct = v => Y0 - v / 100 * (Y0 - Y1);
        let out = `<text class="axis-title" x="${X0}" y="18">${pl.label}이 태양을 한 바퀴 도는 동안 — 겉보기 지름(노랑, ″)과 밝은 부분(하늘색, %)</text>`;
        const marks = pl.inner ? [[0, '내합'], [Math.acos(pl.a) * R2D, '최대 이각'], [180, '외합'], [360 - Math.acos(pl.a) * R2D, '최대 이각'], [360, '내합']] : [[0, '충'], [90, '구'], [180, '합'], [270, '구'], [360, '충']];
        marks.forEach(([deg, lab], mi) => { out += `<line class="grid-line" x1="${xOf(deg).toFixed(1)}" y1="${Y1}" x2="${xOf(deg).toFixed(1)}" y2="${Y0}"/><text class="axis-text" x="${xOf(deg).toFixed(1)}" y="${Y0 + (mi % 2 ? 30 : 14)}" text-anchor="${deg === 0 ? 'start' : deg === 360 ? 'end' : 'middle'}">${lab}</text>`; });
        [0, 50, 100].forEach(v => { out += `<text class="axis-text" x="${X1 + 5}" y="${(yPct(v) + 3.5).toFixed(1)}">${v} %</text>`; });
        [0, top / 2, top].forEach(v => { out += `<line class="grid-line" x1="${X0}" y1="${ySize(v).toFixed(1)}" x2="${X1}" y2="${ySize(v).toFixed(1)}"/><text class="axis-text" x="${X0 - 5}" y="${(ySize(v) + 3.5).toFixed(1)}" text-anchor="end">${v}″</text>`; });
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        let dS = '', dK = '';
        for (let deg = 0; deg <= 360; deg += 2) { const g = geom(pl, deg * D2R); dS += `${dS ? 'L' : 'M'}${xOf(deg).toFixed(1)},${ySize(g.size).toFixed(1)} `; dK += `${dK ? 'L' : 'M'}${xOf(deg).toFixed(1)},${yPct(g.k * 100).toFixed(1)} `; }
        out += `<path class="trace" style="stroke:#d97706" d="${dS}"/><path class="trace" style="stroke:#0284c7" d="${dK}"/>`;
        const psi = a.psi - 2 * Math.PI * (1 - ease(state.progress)), deg = ((psi * R2D) % 360 + 360) % 360, g = geom(pl, psi);
        out += `<line class="marker" x1="${xOf(deg).toFixed(1)}" y1="${Y1}" x2="${xOf(deg).toFixed(1)}" y2="${Y0}"/><circle fill="#d97706" stroke="#fff" cx="${xOf(deg).toFixed(1)}" cy="${ySize(g.size).toFixed(1)}" r="4"/><circle fill="#0284c7" stroke="#fff" cx="${xOf(deg).toFixed(1)}" cy="${yPct(g.k * 100).toFixed(1)}" r="4"/>`;
        out += `<text class="axis-title" x="${(X0 + X1) / 2}" y="${Y0 + 30}" text-anchor="middle">${pl.inner ? '가까울수록 크지만 초승달, 멀수록 둥글지만 작음 — 크기와 모양이 엇갈립니다' : '충에서 둥글고 가장 크고, 합에서 둥글고 가장 작음 — 늘 거의 둥긂'}</text>`;
        return out;
    }

    function renderEclipse(a) {
        const p = state.progress, CX = 150, CY = 110, RX = 296;
        let out = `<rect class="sky" x="14" y="24" width="270" height="166" rx="10"/>`;
        if (a.kindKey === 'solar') {
            const SC = 2.2, rs = RS / AU * R2D * 60 * SC, rm = RM / (a.d - RE) * R2D * 60 * SC; // arcmin → px, the Moon as seen from the closest point on Earth
            const offArc = a.type === 'total' || a.type === 'annular' ? 0 : (a.offset - RE) / a.d * R2D * 60;
            const mx = CX - (1 - ease(p)) * (rs + rm + 14), my = CY - offArc * SC;
            const covered = p >= 0.98 && a.type === 'total';
            if (covered) out += `<circle class="corona" cx="${CX}" cy="${CY}" r="${(rs + 22).toFixed(1)}"/><circle class="corona" cx="${CX}" cy="${CY}" r="${(rs + 9).toFixed(1)}"/>`;
            out += `<circle class="sun-disk" cx="${CX}" cy="${CY}" r="${rs.toFixed(1)}"/><circle class="moon-disk" cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="${rm.toFixed(1)}"/>`;
            out += `<text class="small-label" style="fill:#cbd5e1" x="${CX}" y="${CY + rs + 24}" text-anchor="middle">지구에서 본 일식 (크기 비율 실제)</text>`;
            out += `<text class="small-label" style="fill:#94a3b8" x="${CX}" y="${CY - rs - 10}" text-anchor="middle">해 반지름 ${fmtN(rs / SC, 1)}′ · 달 반지름 ${fmtN(rm / SC, 1)}′</text>`;
            out += `<text class="trait-text" x="${RX}" y="52">달까지 ${fmtN(a.d)} km (${DISTS[state.dist].label})</text>`;
            out += `<text class="trait-text" x="${RX}" y="70">본그림자 길이 ${fmtN(a.Lu)} km</text>`;
            out += `<text class="trait-text" x="${RX}" y="88">달에서 지표까지 ${fmtN(a.x)} km</text>`;
            out += `<text class="trait-text" style="fill:${a.x < a.Lu ? '#dc2626' : '#d97706'}" x="${RX}" y="106">→ 본그림자가 지표에 ${a.x < a.Lu ? '닿음' : '안 닿음'}</text>`;
            out += `<text class="trait-text" x="${RX}" y="130">그림자 축이 지구 중심에서</text><text class="trait-text" x="${RX}" y="146">${fmtN(a.offset)} km 빗나감 (황위 ${fmtN(a.beta, 2)}°)</text>`;
            out += `<text class="trait-text" style="fill:#0284c7" x="${RX}" y="164">${a.offset < RE ? '축이 지구를 지남 → 중심식' : a.type === 'partial' ? '축은 비껴가고 반그림자만 스침' : '반그림자도 지구를 비껴감'}</text>`;
            if (a.type === 'total' || a.type === 'annular') out += `<text class="small-label" x="${RX}" y="184">지표의 ${a.type === 'annular' ? '고리 그림자' : '본그림자'} 반지름 ${fmtN(Math.abs(a.Ru))} km</text>`;
        } else {
            const SC = 0.9, toArc = km => km / a.d * R2D * 60, rp = toArc(a.Rp) * SC, ru = toArc(a.Ru) * SC, rm = toArc(RM) * SC;
            const mx = CX - (1 - ease(p)) * (rp + rm + 10), my = CY - a.beta * 60 * SC;
            out += `<circle class="penumbra" cx="${CX}" cy="${CY}" r="${rp.toFixed(1)}"/><circle class="umbra" cx="${CX}" cy="${CY}" r="${ru.toFixed(1)}"/>`;
            out += `<circle class="moon-lit" cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="${rm.toFixed(1)}"/>`;
            // the part of the Moon inside the umbra goes dark
            const dist = Math.hypot(mx - CX, my - CY);
            if (dist < ru + rm) out += `<clipPath id="umbraClip"><circle cx="${CX}" cy="${CY}" r="${ru.toFixed(1)}"/></clipPath><circle fill="#3b1a12" clip-path="url(#umbraClip)" cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="${rm.toFixed(1)}"/>`;
            out += `<text class="small-label" style="fill:#cbd5e1" x="${CX}" y="${CY + rp + 14}" text-anchor="middle">달의 거리에서 본 지구 그림자와 달 (크기 비율 실제)</text>`;
            out += `<text class="small-label" style="fill:#94a3b8" x="${CX}" y="${CY - rp - 6}" text-anchor="middle">바깥 점선 반그림자 · 안쪽 본그림자</text>`;
            out += `<text class="trait-text" x="${RX}" y="52">달까지 ${fmtN(a.d)} km (${DISTS[state.dist].label})</text>`;
            out += `<text class="trait-text" x="${RX}" y="70">본그림자 반지름 ${fmtN(a.Ru)} km (${fmtN(toArc(a.Ru))}′)</text>`;
            out += `<text class="trait-text" x="${RX}" y="88">반그림자 반지름 ${fmtN(a.Rp)} km (${fmtN(toArc(a.Rp))}′)</text>`;
            out += `<text class="trait-text" x="${RX}" y="106">달 반지름 ${fmtN(RM)} km (${fmtN(toArc(RM), 1)}′)</text>`;
            out += `<text class="trait-text" x="${RX}" y="130">달 중심이 그림자 축에서</text><text class="trait-text" x="${RX}" y="146">${fmtN(a.offset)} km 빗나감 (황위 ${fmtN(a.beta, 2)}°)</text>`;
            out += `<text class="trait-text" style="fill:#0284c7" x="${RX}" y="164">${a.type === 'total' ? '달 전체가 본그림자 안' : a.type === 'partial' ? '달 일부만 본그림자 안' : a.type === 'penumbral' ? '반그림자만 지남 — 조금 어두워짐' : '그림자를 비껴감'}</text>`;
        }
        const NAMES = { solar: { total: '개기일식', annular: '금환일식', partial: '부분일식', none: '일식 없음' }, lunar: { total: '개기월식', partial: '부분월식', penumbral: '반영월식', none: '월식 없음' } };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${p >= 1 ? `${state.node === 'n0' ? '교점 바로' : `교점에서 ${a.dl}°`} · ${DISTS[state.dist].label}: ${NAMES[a.kindKey][a.type]}` : `${KINDS[a.kindKey].label} · ${state.node === 'n0' ? '교점 바로' : `교점에서 ${a.dl}°`} · ${DISTS[state.dist].label}`}</text>`;
        out += `<text class="note-text" x="20" y="208">해 반지름 696,000 km · 지구 6,371 km · 달 1,737 km · 해까지 1억 4,960만 km로 계산. 궤도 기울기 5.1°</text>`;
        return out;
    }

    function graphEclipse(a) {
        const X0 = 70, X1 = 430, xOf = dl => X0 + dl / 25 * (X1 - X0);
        const COL = { total: '#ff7a59', annular: '#d97706', partial: '#0284c7', penumbral: '#a78bfa', none: '#24343f' };
        const NAMES = { solar: { total: '개기', annular: '금환', partial: '부분', none: '없음' }, lunar: { total: '개기', partial: '부분', penumbral: '반영', none: '없음' } };
        let out = `<text class="axis-title" x="20" y="18">교점에서 떨어진 각에 따른 식의 종류 — 달까지 ${fmtN(a.d)} km일 때</text>`;
        [['solar', 46], ['lunar', 100]].forEach(([kk, y]) => {
            const segs = []; let cur = null;
            for (let dl = 0; dl <= 25 + 1e-9; dl += 0.1) {
                const beta = Math.asin(Math.sin(INCL * D2R) * Math.sin(dl * D2R)) * R2D, type = eclipseType(kk, a.d, beta).type;
                if (!cur || cur.type !== type) { cur = { type, from: dl, to: dl }; segs.push(cur); } else cur.to = dl;
            }
            out += `<text class="trait-text" style="fill:${kk === a.kindKey ? '#d97706' : '#334155'}" x="${X0 - 5}" y="${y + 15}" text-anchor="end">${KINDS[kk].label}</text>`;
            segs.forEach(sg => { const x = xOf(sg.from), w = Math.max(0.5, xOf(sg.to) - x); out += `<rect class="band" fill="${COL[sg.type]}" x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="22"/>`; if (w > 30) out += `<text class="band-text" style="fill:${sg.type === 'none' ? '#cbd5e1' : '#08131a'}" x="${(x + w / 2).toFixed(1)}" y="${y + 15}" text-anchor="middle">${NAMES[kk][sg.type]}</text>`; });
            segs.forEach((sg, i) => { if (i > 0) out += `<text class="small-label" x="${xOf(sg.from).toFixed(1)}" y="${y + 33}" text-anchor="middle">${fmtN(sg.from, 1)}°</text>`; });
        });
        [0, 5, 10, 15, 20, 25].forEach(dl => { out += `<text class="axis-text" x="${xOf(dl).toFixed(1)}" y="158" text-anchor="middle">${dl}°</text>`; });
        out += `<line class="marker" x1="${xOf(a.dl).toFixed(1)}" y1="38" x2="${xOf(a.dl).toFixed(1)}" y2="130"/>`;
        out += `<text class="axis-title" x="${(X0 + X1) / 2}" y="184" text-anchor="middle">삭·망이 교점에서 멀어질수록 달이 그림자에서 비껴나 식이 약해지다 사라집니다</text>`;
        return out;
    }

    function noteFor(a) {
        if (a.kind === 'retro') {
            return `<div class="data-row"><span class="data-name">궤도</span><span class="data-val">${a.pl.label} ${a.pl.a} AU · 공전 ${fmtN(a.pl.P)}일 / 지구 1 AU · 365일 — ${a.pl.inner ? '안쪽 행성이 지구를 앞지름' : '지구가 바깥 행성을 앞지름'}</span></div>` +
                `<div class="data-row"><span class="data-name">회합 주기</span><span class="data-val">${fmtN(1 / Math.abs(1 / PE - 1 / a.pl.P))}일마다 ${a.pl.inner ? '내합' : '충'}이 되풀이됨</span></div>` +
                `<div class="data-row"><span class="data-name">역행</span><span class="data-val">${a.pl.inner ? '내합' : '충'} ${-a.t1}일 전 ~ ${a.t2}일 후, ${a.dur}일 동안 ${fmtN(a.arc, 1)}° 서쪽으로</span></div>` +
                `<div class="data-row match"><span class="data-name">판정</span><span class="data-val">${a.verdict === 'short' ? '한 달 남짓' : a.verdict === 'mid' ? '두 달 반쯤' : '넉 달 안팎'}</span></div>`;
        }
        if (a.kind === 'phase') {
            return `<div class="data-row"><span class="data-name">자리</span><span class="data-val">${a.pl.label} ${posTable()[a.posKey].label} — 태양과 ${fmtN(a.g.e * R2D)}° 벌어짐, 지구에서 ${fmtN(a.g.delta, 3)} AU</span></div>` +
                `<div class="data-row"><span class="data-name">겉보기 지름</span><span class="data-val">${fmtN(a.pl.D)} km ÷ ${fmtN(a.g.delta, 3)} AU = ${fmtN(a.g.size, 1)}″ (가장 클 때 ${fmtN(a.sizeMax, 1)}″, 가장 작을 때 ${fmtN(a.sizeMin, 1)}″)</span></div>` +
                `<div class="data-row"><span class="data-name">위상</span><span class="data-val">위상각 ${fmtN(a.g.alpha * R2D)}° → 밝은 부분 ${fmtN(a.g.k * 100)} %</span></div>` +
                `<div class="data-row match"><span class="data-name">판정</span><span class="data-val">${{ crescent: '가는 초승달, 가장 크게', half: '반달쯤', fullFar: '둥글고 가장 작게', fullNear: '둥글고 가장 크게' }[a.verdict]}</span></div>`;
        }
        const NAMES = { solar: { total: '개기일식', annular: '금환일식', partial: '부분일식', none: '일식 없음' }, lunar: { total: '개기월식', partial: '부분월식', penumbral: '반영월식', none: '월식 없음' } };
        return `<div class="data-row"><span class="data-name">달의 자리</span><span class="data-val">교점에서 ${a.dl}° → 황위 ${fmtN(a.beta, 2)}°, 달까지 ${fmtN(a.d)} km → 그림자 축에서 ${fmtN(a.offset)} km</span></div>` +
            (a.kindKey === 'solar'
                ? `<div class="data-row"><span class="data-name">본그림자</span><span class="data-val">길이 ${fmtN(a.Lu)} km, 지표까지 ${fmtN(a.x)} km → ${a.x < a.Lu ? '닿음 (개기 가능)' : '못 미침 (금환)'}</span></div>` +
                `<div class="data-row"><span class="data-name">지구와의 만남</span><span class="data-val">${a.offset < RE ? '축이 지구 지름 안을 지남' : a.type === 'partial' ? `축은 비껴가지만 반그림자(반지름 ${fmtN(a.Rpen)} km)가 닿음` : '반그림자도 안 닿음'}</span></div>`
                : `<div class="data-row"><span class="data-name">지구 그림자</span><span class="data-val">본그림자 반지름 ${fmtN(a.Ru)} km, 반그림자 ${fmtN(a.Rp)} km, 달 반지름 ${fmtN(RM)} km</span></div>` +
                `<div class="data-row"><span class="data-name">달의 위치</span><span class="data-val">${a.type === 'total' ? `${fmtN(a.offset)} + ${fmtN(RM)} ≤ ${fmtN(a.Ru)} → 전체가 본그림자 안` : a.type === 'partial' ? `${fmtN(a.offset)} − ${fmtN(RM)} < ${fmtN(a.Ru)} → 일부만 본그림자 안` : a.type === 'penumbral' ? `${fmtN(a.offset)} − ${fmtN(RM)} < ${fmtN(a.Rp)} → 반그림자만` : '반그림자 밖'}</span></div>`) +
            `<div class="data-row match"><span class="data-name">판정</span><span class="data-val">${NAMES[a.kindKey][a.type]}</span></div>`;
    }

    function render() {
        const a = analyse();
        mainGroup.innerHTML = a.kind === 'retro' ? renderRetro(a) : a.kind === 'phase' ? renderPhase(a) : renderEclipse(a);
        graphGroup.innerHTML = a.kind === 'retro' ? graphRetro(a) : a.kind === 'phase' ? graphPhase(a) : graphEclipse(a);
        liftProse();
        stageBadge.textContent = a.kind === 'retro' ? `${a.pl.label} · ${a.pl.inner ? '내합' : '충'} 앞뒤` : a.kind === 'phase' ? `${a.pl.label} · ${posTable()[a.posKey].label}` : `${KINDS[a.kindKey].label} · ${NODES[state.node].label} · ${DISTS[state.dist].label}`;
        methodHint.textContent = a.kind === 'retro' ? '안쪽 행성이 바깥 행성을 앞지를 때 하늘에서 행성이 뒤로 가는 것처럼 보입니다'
            : a.kind === 'phase' ? '가까울수록 크게, 태양 반대편에 있을수록 둥글게 보입니다'
                : '달이 가까우면 본그림자가 지표에 닿고, 교점에서 멀면 그림자가 비껴갑니다';
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
        if (a.kind === 'retro') {
            const ref = a.pl.inner ? '내합' : '충';
            labelA.textContent = '역행 기간'; valueA.textContent = `${a.dur}일`;
            labelB.textContent = '되돌아간 각'; valueB.textContent = `${fmtN(a.arc, 1)}°`;
            s = `${a.pl.label}은 ${a.pl.a} AU 궤도를 ${fmtN(a.pl.P)}일에 한 바퀴 돌고, 지구는 1 AU를 365일에 돕니다. ${a.pl.inner ? `안쪽의 ${a.pl.label}이 더 빨라 내합 앞뒤에 지구를 앞지르는데` : `안쪽의 지구가 더 빨라 충 앞뒤에 ${a.pl.label}을 앞지르는데`}, 이때 하늘에서는 ${a.pl.label}이 별들 사이를 동쪽에서 서쪽으로 되돌아가는 것처럼 보입니다. `;
            s += `계산해 보면 ${ref} ${-a.t1}일 전에 멈췄다가(유) 서쪽으로 ${fmtN(a.arc, 1)}° 되돌아가고 ${a.t2}일 후에 다시 멈춰 동쪽으로 갑니다. 모두 ${a.dur}일 동안입니다. `;
            s += a.pl.inner ? `${a.pl.label}은 지구보다 훨씬 빨리 돌아 앞지르기가 금방 끝나므로 역행도 짧습니다. 다만 이때는 태양 가까이 있어 실제로는 보기 어렵습니다.`
                : a.pl.a < 3 ? `화성은 지구 바로 바깥에서 지구와 속도 차이가 크지 않아 앞지르기에 두 달 넘게 걸리고, 그만큼 역행도 깁니다. 가까워서 되돌아가는 각도 커 하늘에서 눈에 띕니다.`
                    : `${a.pl.label}은 멀어서 거의 서 있는 것과 같아, 역행은 사실상 지구가 자기 궤도의 한 부분을 도는 동안 시선이 흔들리는 것입니다. 그래서 넉 달 넘게 길지만, 멀어서 되돌아가는 각은 ${fmtN(a.arc, 1)}°로 작습니다.`;
        } else if (a.kind === 'phase') {
            const { g, pl } = a, pos = posTable()[a.posKey].label;
            labelA.textContent = '겉보기 지름'; valueA.textContent = `${fmtN(g.size, 1)}″`;
            labelB.textContent = '밝은 부분'; valueB.textContent = `${fmtN(g.k * 100)} %`;
            s = `${pl.label}이 ${pos}에 있으면 지구에서 ${fmtN(g.delta, 2)} AU 떨어져 있고, 지름 ${fmtN(pl.D)} km를 그 거리로 나누면 겉보기 지름 ${fmtN(g.size, 1)}″입니다 (가장 클 때 ${fmtN(a.sizeMax, 1)}″, 가장 작을 때 ${fmtN(a.sizeMin, 1)}″). 태양·${pl.label}·지구가 이루는 위상각이 ${fmtN(g.alpha * R2D)}°라 밝은 부분은 ${fmtN(g.k * 100)} %입니다. `;
            if (a.verdict === 'crescent') s += `지구에 가장 가까운 내합 근처라 가장 크지만, 태양이 ${pl.label} 뒤에 있어 우리 쪽은 거의 어두운 면이라 가는 초승달입니다. ${pl.a > 0.5 ? '갈릴레이가 본 대로 ' : ''}크기와 모양이 이렇게 엇갈리는 것은 ${pl.label}이 지구가 아니라 태양 둘레를 돌기 때문입니다.`;
            else if (a.verdict === 'half') s += `지구에서 본 시선과 태양 빛이 직각을 이루어 정확히 반달입니다. 최대 이각은 지구에서 그은 시선이 궤도에 스치는 자리라, 태양과 가장 멀리 벌어져 보이는 초저녁이나 새벽에 잘 보입니다.`;
            else if (a.verdict === 'fullFar') s += pl.inner ? `외합 근처라 태양 너머 가장 먼 곳에 있어 가장 작고, 태양 빛을 받은 면을 거의 정면으로 보아 둥급니다. 다만 태양에 가려 실제로 보기는 어렵습니다.` : `합 근처라 태양 너머 가장 먼 곳에 있어 가장 작고, 태양·지구·${pl.label}이 거의 한 줄이라 둥급니다. 태양에 가려 실제로 보기는 어렵습니다.`;
            else s += `충에서는 지구가 태양과 ${pl.label} 사이에 있어 가장 가깝고, 우리가 보는 면이 바로 햇빛 받는 면이라 둥글고 가장 큽니다. 화성은 구에서는 위상각이 ${fmtN(Math.asin(1 / pl.a) * R2D)}°까지 벌어져 살짝 이지러지지만, 초승달이 되는 일은 결코 없습니다.`;
        } else {
            const NAMES = { solar: { total: '개기일식', annular: '금환일식', partial: '부분일식', none: '일식 없음' }, lunar: { total: '개기월식', partial: '부분월식', penumbral: '반영월식', none: '월식 없음' } };
            labelA.textContent = '식의 종류'; valueA.textContent = NAMES[a.kindKey][a.type];
            labelB.textContent = '축에서 빗나간 거리'; valueB.textContent = `${fmtN(a.offset)} km`;
            s = `달의 궤도는 5.1° 기울어 있어 교점에서 ${a.dl}° 떨어진 곳에서 ${a.kindKey === 'solar' ? '삭' : '망'}이 되면 달의 황위는 ${fmtN(a.beta, 2)}°이고, 달까지 ${fmtN(a.d)} km이므로 ${a.kindKey === 'solar' ? '달 그림자의 축이 지구 중심에서' : '달의 중심이 지구 그림자의 축에서'} ${fmtN(a.offset)} km 빗나갑니다. `;
            if (a.kindKey === 'solar') {
                if (a.type === 'total') s += `축이 지구(반지름 6,371 km)를 지나고, 달의 본그림자 길이 ${fmtN(a.Lu)} km가 달에서 지표까지 거리 ${fmtN(a.x)} km보다 길어 그림자 끝이 지표에 닿습니다. 그 자리에서는 달이 해보다 커 해가 완전히 가려지는 개기일식이고, 낮에 코로나가 보입니다. 다만 본그림자의 반지름이 ${fmtN(Math.abs(a.Ru))} km뿐이라 아주 좁은 띠에서만 그렇습니다.`;
                else if (a.type === 'annular') s += `축은 지구를 지나지만 달이 멀어서 본그림자 길이 ${fmtN(a.Lu)} km가 지표까지 거리 ${fmtN(a.x)} km에 못 미칩니다. 달이 해보다 조금 작게 보여 해의 가장자리가 고리처럼 남는 금환일식입니다. 실제로는 해까지 거리도 철마다 달라져 경계가 조금 움직입니다.`;
                else if (a.type === 'partial') s += `축이 지표 위 ${fmtN(a.offset - RE)} km를 스치듯 비껴가지만, 반그림자(지구 거리에서 반지름 ${fmtN(a.Rpen)} km)는 지구에 닿아 극지방 쪽에서 해의 일부가 가려지는 부분일식만 일어납니다.`;
                else s += `축이 지구 반지름과 반그림자 반지름을 합한 ${fmtN(RE + a.Rpen)} km보다 멀리 비껴가 그림자가 지구에 전혀 닿지 않습니다. 삭이어도 일식은 없습니다. 이렇게 교점에서 약 16° 넘게 떨어지면 일식이 없으므로 한 해에 일식의 철은 두 번뿐입니다.`;
            } else {
                if (a.type === 'total') s += `달의 거리에서 지구 본그림자의 반지름은 ${fmtN(a.Ru)} km로 달 반지름 1,737 km의 두 배가 넘습니다. 빗나간 거리에 달 반지름을 더해도 본그림자 안이라 달 전체가 들어가는 개기월식입니다. 지구 대기를 지나며 꺾인 붉은빛이 닿아 달이 붉게 보입니다.`;
                else if (a.type === 'partial') s += `빗나간 거리에 달 반지름을 더하면 본그림자 반지름 ${fmtN(a.Ru)} km를 넘지만, 빼면 그 안이라 달의 일부만 본그림자에 들어가는 부분월식입니다.`;
                else if (a.type === 'penumbral') s += `달이 본그림자에는 닿지 않고 반그림자(반지름 ${fmtN(a.Rp)} km)만 지나는 반영월식입니다. 달이 조금 어두워질 뿐이라 눈여겨보지 않으면 모르고 지나갑니다.`;
                else s += `빗나간 거리에서 달 반지름을 빼도 반그림자 반지름 ${fmtN(a.Rp)} km를 넘어 달이 그림자를 아예 비껴갑니다. 보름달이어도 월식은 없습니다. 보름달이 달마다 뜨는데 월식이 드문 까닭이 이것입니다.`;
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
        checkBtn.textContent = state.mode === 'retro' ? '행성 돌리기' : state.mode === 'phase' ? '한 바퀴 돌리기' : '달 지나가게 하기';
        stageCaption.textContent = state.mode === 'retro' ? '왼쪽은 위에서 본 궤도(축척대로), 오른쪽은 남쪽 하늘에 찍힌 행성의 자리입니다. 붉은 구간이 서쪽으로 되돌아가는 역행입니다.'
            : state.mode === 'phase' ? '왼쪽은 위에서 본 궤도, 오른쪽은 지구에서 본 행성의 모양과 크기입니다. 한 바퀴 도는 동안 모양과 크기가 어떻게 엇갈리는지 보세요.'
                : '일식은 지구에서 본 해와 달, 월식은 달의 거리에서 본 지구 그림자와 달입니다. 크기 비율은 실제 값입니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { planet: 'mars', pplanet: 'venus', ppos: 'elong', kind: 'solar', node: 'n0', dist: 'mean', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'retro').click();
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

    window.__planetModel = {
        PLANETS, PHASE_PLANETS, POS_INNER, POS_OUTER, KINDS, NODES, DISTS, state,
        analyse, render, geom, eclipseType, runSeconds,
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
