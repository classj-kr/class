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
    const stageReadout = document.getElementById('stageReadout');

    /* -------------------------------------------------------------- data */
    // Diffusion across a porous membrane: the count difference decays as each
    // second a fixed share of it crosses (Fick's law for a thin membrane).
    // Warm water is thinner and its molecules faster, so about 2.5 × the rate.
    const CONCS = {
        '40-0': { label: '왼쪽 40 · 오른쪽 0', L: 40, R: 0 },
        '30-10': { label: '왼쪽 30 · 오른쪽 10', L: 30, R: 10 },
        '20-20': { label: '왼쪽 20 · 오른쪽 20', L: 20, R: 20 },
    };
    const TEMPS = { cold: { label: '5 ℃', hint: '차가운 물', k: 0.04 }, warm: { label: '37 ℃', hint: '몸속 온도', k: 0.10 } };
    const SIM_T = 20;

    // Osmosis: a red cell is 0.29 mol of dissolved particles per litre inside.
    // What matters outside is the particle count, not the grams.
    const SOLUTIONS = {
        water: {label:'바깥이 더 옅음',hint:'같은 비투과성 용질',osm:0.15},
        salt09: {label:'안팎이 같은 농도',hint:'같은 비투과성 용질',osm:0.29},
        salt3: {label:'바깥이 더 진함',hint:'같은 비투과성 용질',osm:0.6},
    };
    const C_IN = 0.29, VB = 0.4, BURST = 1.6, TAU = 3, OSM_T = 15;   // inside particles, non-water share, bursting size, seconds

    const state = { mode: 'diffusion', conc: '40-0', temp: 'cold', solution: 'water', progress: 0, prediction: null };
    let running = false, frameId = 0, lastStamp = 0;

    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const jong = w => { const c = w.charCodeAt(w.length - 1); return c >= 0xac00 && c <= 0xd7a3 ? (c - 0xac00) % 28 : -1; };
    const pEun = w => jong(w) > 0 ? '은' : '는';

    /* ------------------------------------------------------------ models */
    const countsAt = (c, k, t) => { const mean = (c.L + c.R) / 2; const L = mean + (c.L - mean) * Math.exp(-2 * k * t); return { L, R: c.L + c.R - L }; };
    const volumeTarget = osm => VB + (1 - VB) * C_IN / Math.max(osm, 1e-4);
    const volumeAt = (osm, t) => { const target = volumeTarget(osm); return 1 + (target - 1) * (1 - Math.exp(-t / TAU)); };
    const burstTime = osm => { const target = volumeTarget(osm); return target <= BURST ? null : -TAU * Math.log(1 - (BURST - 1) / (target - 1)); };

    function analyse() {
        if (state.mode === 'diffusion') {
            const c = CONCS[state.conc], tmp = TEMPS[state.temp];
            const end = countsAt(c, tmp.k, SIM_T);
            const ratio = end.R > 0 ? end.L / end.R : Infinity;
            return { kind: 'diffusion', c, tmp, end, ratio, verdict: ratio >= 1.4 ? 'far' : ratio >= 1.15 ? 'mid' : 'same' };
        }
        const sol = SOLUTIONS[state.solution];
        const target = volumeTarget(sol.osm), bt = burstTime(sol.osm);
        const vEnd = bt !== null ? BURST : volumeAt(sol.osm, OSM_T);
        return { kind: 'osmosis', sol, target, bt, vEnd, verdict: bt !== null || vEnd >= 1.05 ? 'swell' : vEnd <= 0.95 ? 'shrink' : 'same' };
    }
    const runSeconds = () => 8;

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
        if (state.mode === 'diffusion') {
            controlArea.innerHTML = pickRow('처음 산소 알갱이 수', 'conc', opts(CONCS), state.conc, 3) + pickRow('물의 온도', 'temp', opts(TEMPS), state.temp, 2);
        } else {
            controlArea.innerHTML = pickRow('세포 모형 바깥의 조건', 'solution', opts(SOLUTIONS), state.solution, 3);
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

    const PRED_DIFF = [{ value: 'far', label: '아직 왼쪽에 훨씬 많다 (1.4배 넘게)' }, { value: 'mid', label: '왼쪽이 조금 더 많다 (1.15~1.4배)' }, { value: 'same', label: '거의 같아졌다' }];
    const PRED_OSM = [{ value: 'swell', label: '부풀어 오른다' }, { value: 'same', label: '거의 그대로' }, { value: 'shrink', label: '쪼그라든다' }];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list = state.mode === 'diffusion' ? PRED_DIFF : PRED_OSM;
        predictionLegend.textContent = state.mode === 'diffusion' ? `${TEMPS[state.temp].label} 물에서 20초 뒤, 양쪽 알갱이 수는?` : `${SOLUTIONS[state.solution].label}에 넣은 세포 모형은?`;
        predictionArea.className = 'prediction-buttons three';
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    // Particles are kept between frames so each one wanders on its own (random walk
    // inside its chamber). When the model says one more has crossed, a particle near
    // the membrane is sent through the pore; now and then a pair swaps sides, so the
    // two-way traffic stays visible even when the counts are equal.
    const DG = { LX: 18, W: 206, MX: 230, Y: 30, H: 150, GAP0: 88, GAP1: 122 };
    DG.RX = DG.MX + 2;
    let particles = [], particleKey = '', swapClock = 0;
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const boxOf = side => side === 'L' ? { x0: DG.LX + 6, x1: DG.MX - 9 } : { x0: DG.RX + 9, x1: DG.RX + DG.W - 6 };
    function seedParticles(c) {
        seed = 7; particles = [];
        const make = (side, n) => { const bx = boxOf(side); for (let i = 0; i < n; i += 1) particles.push({ side, x: bx.x0 + rnd() * (bx.x1 - bx.x0), y: DG.Y + 6 + rnd() * (DG.H - 12), vx: rnd() - 0.5, vy: rnd() - 0.5, cross: null }); };
        make('L', c.L); make('R', c.R);
        swapClock = 0;
    }
    function sendAcross(pt) {
        const gy = DG.Y + 10 + rnd() * (DG.H - 20);   // oxygen slips through the lipid bilayer itself, anywhere along it
        pt.cross = { stage: 0, gy, to: pt.side === 'L' ? 'R' : 'L' };
    }
    function stepParticles(dt, speed, wantR) {
        const step = speed * 60 * dt;
        let haveR = particles.filter(p => (p.cross ? p.cross.to : p.side) === 'R').length;
        while (haveR < wantR) {
            const pool = particles.filter(p => p.side === 'L' && !p.cross).sort((m, n) => n.x - m.x);
            if (!pool.length) break;
            sendAcross(pool[Math.floor(rnd() * Math.min(4, pool.length))]); haveR += 1;
        }
        swapClock += dt;
        if (swapClock > 1.1) {
            swapClock = 0;
            const l = particles.filter(p => p.side === 'L' && !p.cross), r = particles.filter(p => p.side === 'R' && !p.cross);
            if (l.length && r.length) { sendAcross(l[Math.floor(rnd() * l.length)]); sendAcross(r[Math.floor(rnd() * r.length)]); }
        }
        particles.forEach(p => {
            if (p.cross) {
                const tx = p.cross.stage === 0 ? DG.MX + (p.side === 'L' ? -12 : 12) : DG.MX + (p.cross.to === 'R' ? 13 : -13);
                const ty = p.cross.gy;
                const dx = tx - p.x, dy = ty - p.y, d = Math.hypot(dx, dy), v = step * 1.6 + 0.4;
                if (d <= v) { p.x = tx; p.y = ty; p.cross.stage += 1; if (p.cross.stage === 2) { p.side = p.cross.to; p.cross = null; } }
                else { p.x += dx / d * v; p.y += dy / d * v; }
                return;
            }
            p.vx = clamp(p.vx + (rnd() - 0.5) * 0.9, -1.4, 1.4); p.vy = clamp(p.vy + (rnd() - 0.5) * 0.9, -1.4, 1.4);
            p.x += p.vx * step; p.y += p.vy * step;
            const bx = boxOf(p.side);
            if (p.x < bx.x0) { p.x = bx.x0; p.vx = Math.abs(p.vx); } if (p.x > bx.x1) { p.x = bx.x1; p.vx = -Math.abs(p.vx); }
            if (p.y < DG.Y + 5) { p.y = DG.Y + 5; p.vy = Math.abs(p.vy); } if (p.y > DG.Y + DG.H - 5) { p.y = DG.Y + DG.H - 5; p.vy = -Math.abs(p.vy); }
        });
    }

    function renderDiffusion(a) {
        const t = state.progress * SIM_T;
        const { L } = countsAt(a.c, a.tmp.k, t);
        const nL = Math.round(L), nR = a.c.L + a.c.R - nL;
        if (state.conc !== particleKey || (state.progress === 0 && !running)) { particleKey = state.conc; seedParticles(a.c); }
        const { LX, RX, W, Y, H, MX, GAP0, GAP1 } = DG;
        const half = (GAP1 - GAP0) / 2;
        // water tank with a membrane down the middle
        let out = `<rect x="${LX - 6}" y="${Y - 6}" width="${RX + W - LX + 12}" height="${H + 12}" rx="8" fill="#e2e8f0" stroke="#64748b" stroke-width="1.6"/>`;
        out += `<rect class="chamber" x="${LX}" y="${Y}" width="${W}" height="${H}" rx="3"/><rect class="chamber" x="${RX}" y="${Y}" width="${W}" height="${H}" rx="3"/>`;
        // membrane: two rows of lipid heads with tails (oxygen crosses the bilayer directly, no channel needed)
        for (let py = Y + 4; py <= Y + H - 3; py += 8) {
            out += `<line x1="${MX - 4}" y1="${py}" x2="${MX - 1}" y2="${py}" stroke="#b45309" stroke-width="1"/><line x1="${MX + 1}" y1="${py}" x2="${MX + 4}" y2="${py}" stroke="#b45309" stroke-width="1"/>`;
            out += `<circle cx="${MX - 5}" cy="${py}" r="3" fill="#f59e0b" stroke="#b45309" stroke-width=".7"/><circle cx="${MX + 5}" cy="${py}" r="3" fill="#f59e0b" stroke="#b45309" stroke-width=".7"/>`;
        }
        particles.forEach(p => { out += `<circle class="molecule" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.4"/>`; });
        out += `<text class="gen-text" x="${LX + W / 2}" y="${Y + H + 24}" text-anchor="middle">왼쪽 ${nL}개</text>`;
        out += `<text class="gen-text" x="${RX + W / 2}" y="${Y + H + 24}" text-anchor="middle">오른쪽 ${nR}개</text>`;
        out += `<text class="small-label" x="${MX}" y="${Y + H + 24}" text-anchor="middle">막</text>`;
        const VERD = { far: '아직 왼쪽에 훨씬 많음', mid: '왼쪽이 조금 더 많음', same: '거의 같아짐' };
        if (state.progress >= 1) out += `<text class="verdict-text" fill="#b45309" x="${LX - 6}" y="14">20초 뒤 → ${VERD[a.verdict]}</text>`;
        stageReadout.innerHTML = `<span>물 온도 ${a.tmp.label} · 1초에 차이의 ${Math.round(a.tmp.k * 100)} %가 건너감</span><span>지난 시간 ${t.toFixed(1)}초 · 차이 ${Math.max(0, nL - nR)}개${state.progress > 0 && nR > 0 ? ` · 왼쪽 : 오른쪽 = ${(nL / nR).toFixed(2)} : 1` : ''}</span>`;
        return out;
    }

    function graphDiffusion(a) {
        const t = state.progress * SIM_T;
        const X0 = 50, X1 = 430, Y0 = 150, Y1 = 40, NMAX = 40;
        const xOf = tt => X0 + tt / SIM_T * (X1 - X0), yOf = n => Y0 - n / NMAX * (Y0 - Y1);
        let out = `<text class="axis-title" x="${X0}" y="18">양쪽 알갱이 수 — 노란 선 왼쪽, 파란 선 오른쪽</text>`;
        for (let n = 0; n <= NMAX; n += 10) { out += `<line class="grid-line" x1="${X0}" y1="${yOf(n).toFixed(1)}" x2="${X1}" y2="${yOf(n).toFixed(1)}"/><text class="axis-text" x="${X0 - 6}" y="${(yOf(n) + 3.5).toFixed(1)}" text-anchor="end">${n}</text>`; }
        for (let tt = 0; tt <= SIM_T; tt += 5) out += `<text class="axis-text" x="${xOf(tt).toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${tt}</text>`;
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        const mean = (a.c.L + a.c.R) / 2;
        const done = state.progress >= 1;
        if (done) out += `<line class="trace dashed" style="stroke:#475569" x1="${X0}" y1="${yOf(mean).toFixed(1)}" x2="${X1}" y2="${yOf(mean).toFixed(1)}"/><text class="small-label" x="${X0 + 8}" y="${(yOf(mean) + 15).toFixed(1)}">같아지는 값 ${mean}개</text>`;
        let dL = '', dR = '';
        for (let tt = 0; tt <= t + 1e-9; tt += 0.2) { const c = countsAt(a.c, a.tmp.k, tt); dL += `${dL ? 'L' : 'M'}${xOf(tt).toFixed(1)},${yOf(c.L).toFixed(1)} `; dR += `${dR ? 'L' : 'M'}${xOf(tt).toFixed(1)},${yOf(c.R).toFixed(1)} `; }
        out += `<path class="trace" style="stroke:#d97706" d="${dL}"/><path class="trace" style="stroke:#0284c7" d="${dR}"/>`;
        // the other temperature, faintly, for comparison
        const other = TEMPS[state.temp === 'cold' ? 'warm' : 'cold'];
        let dO = ''; for (let tt = 0; tt <= SIM_T; tt += 0.5) dO += `${dO ? 'L' : 'M'}${xOf(tt).toFixed(1)},${yOf(countsAt(a.c, other.k, tt).L).toFixed(1)} `;
        if (done) {
            out += `<path class="trace dashed" style="stroke:rgba(217, 119, 6, .45)" d="${dO}"/>`;
            out += `<text class="small-label" x="${X0 + 4}" y="${Y1 - 6}">점선: ${other.label}일 때의 왼쪽</text>`;
        }
        out += `<text class="axis-text" x="${X1 + 4}" y="${Y0 + 4}">초</text>`;
        return out;
    }

    function renderOsmosis(a) {
        const t = state.progress * OSM_T;
        const vNow = a.bt !== null && t >= a.bt ? BURST : volumeAt(a.sol.osm, t);
        const burst = a.bt !== null && t >= a.bt;
        const R = 40 * Math.cbrt(vNow);
        const cx = 150, cy = 112;
        // beaker of solution
        let out = `<path d="M 34 30 L 34 190 Q 34 200 44 200 L 256 200 Q 266 200 266 190 L 266 30" fill="none" stroke="#475569" stroke-width="2.2"/>`;
        out += `<path d="M 36 44 L 264 44 L 264 190 Q 264 198 256 198 L 44 198 Q 36 198 36 190 Z" fill="#cfe8f6"/>`;
        out += `<line x1="36" y1="44" x2="264" y2="44" stroke="#7fb4d4" stroke-width="1.2"/>`;
        // solute particles outside: more when the outside is more concentrated
        seed = 11;
        const nOut = Math.round(a.sol.osm * 70);
        for (let i = 0; i < nOut; i += 1) {
            const x = 44 + rnd() * 212, y = 52 + rnd() * 140;
            if (Math.hypot(x - cx, y - cy) < 40 * Math.cbrt(BURST) + 6) continue;
            out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" fill="#1e3a8a"/>`;
        }
        if (burst) {
            for (let i = 0; i < 9; i += 1) { const ang = i / 9 * Math.PI * 2; out += `<path d="M ${(cx + Math.cos(ang) * R * 0.8).toFixed(1)} ${(cy + Math.sin(ang) * R * 0.8).toFixed(1)} q 6 -4 ${(Math.cos(ang) * 14).toFixed(1)} ${(Math.sin(ang) * 14).toFixed(1)}" fill="none" stroke="#be123c" stroke-width="2"/>`; }
        } else {
            out += `<circle cx="${cx}" cy="${cy}" r="${R.toFixed(1)}" fill="#f6c3c6" stroke="#be123c" stroke-width="2.4"/>`;
            out += `<circle cx="${cx - R * 0.25}" cy="${cy - R * 0.2}" r="${(R * 0.28).toFixed(1)}" fill="#d98a96" stroke="#9f1239" stroke-width="1"/>`;
            seed = 23;
            for (let i = 0; i < 12; i += 1) { const ang = rnd() * Math.PI * 2, rr = Math.sqrt(rnd()) * R * 0.8; out += `<circle cx="${(cx + Math.cos(ang) * rr).toFixed(1)}" cy="${(cy + Math.sin(ang) * rr).toFixed(1)}" r="2.6" fill="#1e3a8a"/>`; }
        }
        // water arrows crossing the membrane while it runs
        if (running && !burst) {
            const dir = a.verdict === 'swell' ? -1 : a.verdict === 'shrink' ? 1 : 0;
            const phase = (performance.now() / 900) % 1;
            for (let i = 0; i < 6; i += 1) {
                const ang = i / 6 * Math.PI * 2 + 0.3;
                const both = dir === 0;
                const f = both ? (i % 2 ? phase : 1 - phase) : (dir > 0 ? phase : 1 - phase);
                const r1 = R - 12 + f * 30;
                const x = cx + Math.cos(ang) * r1, y = cy + Math.sin(ang) * r1;
                out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4" fill="#0284c7" opacity="${(0.4 + 0.6 * Math.sin(f * Math.PI)).toFixed(2)}"/>`;
            }
        }
        out += `<text class="small-label" x="282" y="70">● 녹은 알갱이</text><text class="small-label" x="282" y="92" style="fill:#0369a1">● 물</text>`;
        out += `<text class="gen-text" x="282" y="130">세포 크기</text><text class="gen-text" x="282" y="150">${burst ? '터짐' : `처음의 ${(vNow * 100).toFixed(0)} %`}</text>`;
        return out;
    }

    function graphOsmosis(a) {
        const X0 = 50, X1 = 430, Y0 = 150, Y1 = 30, VMIN = 0.6, VMAX = 1.7;
        const t = state.progress * OSM_T;
        const xOf = tt => X0 + tt / OSM_T * (X1 - X0), yOf = v => Y0 - (v - VMIN) / (VMAX - VMIN) * (Y0 - Y1);
        let out = `<text class="axis-title" x="${X0}" y="18">세포 부피 (처음 = 100 %)</text>`;
        [0.6, 1, 1.4].forEach(v => { out += `<line class="grid-line" x1="${X0}" y1="${yOf(v).toFixed(1)}" x2="${X1}" y2="${yOf(v).toFixed(1)}"/><text class="axis-text" x="${X0 - 6}" y="${(yOf(v) + 4).toFixed(1)}" text-anchor="end">${Math.round(v * 100)}</text>`; });
        for (let tt = 0; tt <= OSM_T; tt += 5) out += `<text class="axis-text" x="${xOf(tt).toFixed(1)}" y="${Y0 + 16}" text-anchor="middle">${tt}</text>`;
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        let d = '';
        for (let tt = 0; tt <= t + 1e-9; tt += 0.2) { if (a.bt !== null && tt > a.bt) break; d += `${d ? 'L' : 'M'}${xOf(tt).toFixed(1)},${yOf(volumeAt(a.sol.osm, tt)).toFixed(1)} `; }
        if (d) out += `<path class="trace" style="stroke:#be123c" d="${d}"/>`;
        if (a.bt !== null && t >= a.bt) out += `<text class="small-label" x="${(xOf(a.bt) + 6).toFixed(1)}" y="${(yOf(BURST) + 4).toFixed(1)}">터짐</text>`;
        out += `<text class="axis-text" x="${X1 + 4}" y="${Y0 + 4}">초</text>`;
        return out;
    }

    function noteFor(a) {
        return '<p>크기·시간·알갱이 수·이동 속도는 비교를 위한 가상 값입니다.</p>';
    }

    function render() {
        const a = analyse();
        window.scienceScene.render(mainGroup,a.kind === 'diffusion' ? renderDiffusion(a) : renderOsmosis(a));
        window.scienceScene.render(graphGroup,a.kind === 'diffusion' ? graphDiffusion(a) : graphOsmosis(a));
        stageBadge.textContent = a.kind === 'diffusion' ? `${a.c.label} · ${a.tmp.label}` : `동물 세포 모형 · ${a.sol.label}`;
        methodHint.textContent = a.kind === 'diffusion' ? '알갱이는 제멋대로 움직이지만, 많은 쪽에서 적은 쪽으로 더 많이 건너갑니다'
            : '물은 통과하고 용질은 통과하지 못하는 막에서 안팎 조건을 비교합니다';
        window.scienceScene.render(dataNote,noteFor(a));
        if (a.kind !== 'diffusion') stageReadout.innerHTML = '';
        return a;
    }

    /* --------------------------------------------------------------- run */
    function tick(dt) {
        state.progress = Math.min(1, state.progress + dt / runSeconds());
        if (state.mode === 'diffusion') {
            const a0 = analyse(), c = countsAt(a0.c, a0.tmp.k, state.progress * SIM_T);
            stepParticles(dt, a0.tmp.k > 0.06 ? 1.6 : 0.9, a0.c.L + a0.c.R - Math.round(c.L));
        }
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
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { state.progress = 1; render(); finish(); return; }
        running = true;
        lastStamp = performance.now();
        render();
        frameId = requestAnimationFrame(frame);
    }

    function settleParticles() {
        if (state.mode !== 'diffusion') return;
        const a0 = analyse(), want = a0.c.L + a0.c.R - Math.round(a0.end.L);
        particles.forEach(p => { if (p.cross) { p.side = p.cross.to; p.cross = null; const bx = boxOf(p.side); p.x = bx.x0 + rnd() * (bx.x1 - bx.x0); } });
        let have = particles.filter(p => p.side === 'R').length;
        particles.filter(p => p.side === 'L').forEach(p => { if (have < want) { p.side = 'R'; const bx = boxOf('R'); p.x = bx.x0 + rnd() * (bx.x1 - bx.x0); have += 1; } });
    }

    function finish() {
        settleParticles();
        const a=render();resultEmpty.hidden=true;resultContent.hidden=false;
        labelA.textContent='모형의 결과';valueA.textContent=a.kind==='diffusion'?'양쪽 알갱이 수 비교':{swell:'부풀어 오름',same:'거의 같은 크기',shrink:'줄어듦'}[a.verdict];
        labelB.textContent='관찰 조건';valueB.textContent=a.kind==='diffusion'?a.c.label:a.sol.label;
        predictionResult.textContent=!state.prediction?'다음에는 결과를 먼저 예상해 보세요.':state.prediction===a.verdict?'이 모형의 예상이 맞았습니다.':'이 모형의 결과와 다릅니다.';
        explanation.textContent=a.kind==='diffusion'?'알갱이는 양방향으로 이동하지만 농도가 높은 쪽에서 낮은 쪽으로 순이동합니다. 양쪽 농도가 같아져도 움직임은 계속됩니다. 시간과 이동 비율은 가상 설정입니다.':'물을 통과시키고 같은 용질은 통과시키지 않는 막에서, 바깥이 더 옅으면 물이 안으로, 더 진하면 밖으로 순이동합니다. 같은 농도에서는 평균적인 순이동이 거의 없습니다. 막의 투과성이 달라지는 경우와 실제 의료용 용액은 이 모형으로 판단하지 않습니다.';
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
        checkBtn.textContent = state.mode === 'diffusion' ? '20초 흘려 보기' : '15초 흘려 보기';
        stageCaption.textContent = state.mode === 'diffusion' ? '산소 알갱이는 가운데 노란 막(인지질 2중층)을 그대로 뚫고 어느 쪽으로든 지나갈 수 있습니다.'
            : '짙은 파란 점은 녹은 알갱이입니다. 물(하늘색 점)만 세포막을 지나고, 알갱이는 지나지 못합니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { conc: '40-0', temp: 'cold', solution: 'water', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'diffusion').click();
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

    window.__membraneModel = {
        CONCS, TEMPS, SOLUTIONS, C_IN, VB, BURST, state,
        analyse, render, countsAt, volumeAt, volumeTarget, burstTime,
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
        // A new drawing may contain no lifted prose. Clear the previous
        // drawing's copy too; takeRecords below already consumes our own edits.
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
    // The observer sees the app's DOMContentLoaded render; do not run twice.
})();
