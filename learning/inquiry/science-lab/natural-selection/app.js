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
    const N = 40, GENS = 10;

    /* -------------------------------------------------------------- data */
    // Beak size runs 1 (tiny) to 10 (huge). Each seed supply rewards one size.
    const SEEDS = {
        small: { label: '작은 씨앗만', hint: '작은 부리가 집기 좋음', targets: [3] },
        large: { label: '큰 씨앗만', hint: '큰 부리가 깨기 좋음', targets: [8] },
        mixed: { label: '작은 것과 큰 것', hint: '중간 크기는 없음', targets: [3, 8] },
    };
    // Coat shade runs 0 (white) to 1 (dark). Predators spot what stands out.
    const GROUNDS = {
        snow: { label: '눈밭', shade: 0.05, cls: 'snow' },
        soil: { label: '흙', shade: 0.95, cls: 'soil' },
    };
    const SWITCHES = {
        none: { label: '그대로', hint: '열 세대 내내 같은 배경' },
        flip: { label: '4세대 뒤 바뀜', hint: '눈이 녹거나 눈이 덮임' },
    };
    const SEL_WIDTH_BEAK = 1.6, SEL_WIDTH_COAT = 0.24, MUT_BEAK = 0.35, MUT_COAT = 0.06;
    const FLIP_GEN = 4;                  // when the ground changes, if it does

    const state = {
        mode: 'beak',
        seeds: 'small',
        ground: 'snow', flip: 'none',
        progress: 0, prediction: null,
        seed: (Date.now() % 100000) | 0, gens: null,
    };
    let running = false, frameId = 0, lastStamp = 0;

    function rng(seed) {
        let a = seed >>> 0;
        return () => {
            a = (a + 0x6D2B79F5) >>> 0;
            let t = a;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }
    const gauss = rand => { const u = Math.max(1e-9, rand()), v = rand(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    // digits are read aloud (영 일 이 삼 사 오 육 칠 팔 구), so the particle follows the reading
    const numIga = txt => { const d = String(txt).trim().slice(-1); return txt + ('013678'.includes(d) ? '이' : '가'); };

    /* ------------------------------------------------------------ models */
    // fitness of a trait under the environment of generation g
    const affinity = (trait, t) => Math.exp(-((trait - t) ** 2) / (2 * SEL_WIDTH_BEAK ** 2));
    // fitness of every member at once. Seeds are a shared supply: the more birds
    // able to eat a kind of seed, the smaller each one's share, so a crowded
    // beak size loses its edge and both sizes can persist when both seeds exist.
    function fitnessAll(traits, g) {
        if (state.mode === 'beak') {
            const targets = SEEDS[state.seeds].targets;
            const supply = N / targets.length;
            const demand = targets.map(t => traits.reduce((sum, tr) => sum + affinity(tr, t), 0));
            return traits.map(tr => targets.reduce((f, t, k) => f + affinity(tr, t) * supply / Math.max(1e-9, demand[k]), 0));
        }
        let ground = GROUNDS[state.ground];
        if (state.flip === 'flip' && g >= FLIP_GEN) ground = state.ground === 'snow' ? GROUNDS.soil : GROUNDS.snow;
        return traits.map(tr => Math.exp(-((tr - ground.shade) ** 2) / (2 * SEL_WIDTH_COAT ** 2)));
    }

    // run the whole history once: each generation half survive by fitness, then refill
    function simulate() {
        const rand = rng(state.seed);
        const beak = state.mode === 'beak';
        let traits = Array.from({ length: N }, () => beak ? clamp(5.5 + 1.8 * gauss(rand), 1, 10) : clamp(0.5 + 0.22 * gauss(rand), 0, 1));
        const gens = [];
        for (let g = 0; g <= GENS; g += 1) {
            const fit = fitnessAll(traits, g);
            // weighted draw without replacement picks the survivors: fitter, likelier
            const alive = new Array(N).fill(false);
            const pool = traits.map((t, i) => i);
            for (let k = 0; k < N / 2; k += 1) {
                const total = pool.reduce((s, i) => s + fit[i], 0);
                let r = rand() * total, pick = pool[pool.length - 1];
                for (const i of pool) { r -= fit[i]; if (r <= 0) { pick = i; break; } }
                alive[pick] = true;
                pool.splice(pool.indexOf(pick), 1);
            }
            const mean = traits.reduce((s, t) => s + t, 0) / N;
            gens.push({ traits: traits.slice(), alive, mean, fit });
            if (g === GENS) break;
            // survivors each leave two young, close to the parent but not identical
            const parents = traits.filter((t, i) => alive[i]);
            traits = [];
            parents.forEach(p => { for (let c = 0; c < 2; c += 1) traits.push(beak ? clamp(p + MUT_BEAK * gauss(rand), 1, 10) : clamp(p + MUT_COAT * gauss(rand), 0, 1)); });
        }
        return gens;
    }

    function analyse() {
        if (!state.gens) state.gens = simulate();
        const gens = state.gens;
        const first = gens[0], last = gens[GENS];
        let verdict;
        if (state.mode === 'beak') {
            const lo = last.traits.filter(t => t < 4.5).length / N, hi = last.traits.filter(t => t > 6.5).length / N, mid = 1 - lo - hi;
            void mid;
            verdict = lo >= 0.3 && hi >= 0.3 ? 'split' : last.mean < 4.5 ? 'small' : last.mean > 6.5 ? 'large' : 'same';
        } else if (state.flip === 'flip') {
            // after the ground changes, what matters is which way the flock moves
            const before = gens[FLIP_GEN].mean;
            verdict = last.mean > before + 0.05 ? 'dark' : last.mean < before - 0.05 ? 'light' : 'mixed';
        } else {
            verdict = last.mean < 0.35 ? 'light' : last.mean > 0.65 ? 'dark' : 'mixed';
        }
        return { kind: state.mode, gens, first, last, verdict };
    }
    // which generation is on screen, and whether its cull has happened yet
    const genAt = p => { const x = p * GENS; return { g: Math.min(GENS, Math.floor(x)), culled: x - Math.floor(x) > 0.5 || p >= 1 }; };

    /* ---------------------------------------------------------- controls */
    function pickRow(legend, name, options, current, cols) {
        return `<fieldset class="pick-field"><legend>${legend}</legend>` +
            `<div class="pick-buttons cols${cols}" data-pick="${name}">` +
            options.map(o => `<button type="button" data-value="${o.value}" class="${o.value === String(current) ? 'selected' : ''}">` +
                `${o.label}${o.hint ? `<small>${o.hint}</small>` : ''}</button>`).join('') +
            `</div></fieldset>`;
    }

    function buildControls() {
        if (state.mode === 'beak') {
            controlArea.innerHTML = pickRow('섬에 있는 씨앗', 'seeds', Object.entries(SEEDS).map(([k, v]) => ({ value: k, label: v.label, hint: v.hint })), state.seeds, 3);
        } else {
            controlArea.innerHTML =
                pickRow('처음 배경', 'ground', Object.entries(GROUNDS).map(([k, v]) => ({ value: k, label: v.label })), state.ground, 2) +
                pickRow('환경 변화', 'flip', Object.entries(SWITCHES).map(([k, v]) => ({ value: k, label: v.label, hint: v.hint })), state.flip, 2);
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

    const PRED_BEAK = [{ value: 'small', label: '작은 쪽으로 몰린다' }, { value: 'large', label: '큰 쪽으로 몰린다' }, { value: 'split', label: '양쪽으로 갈린다 (중간이 줄어듦)' }, { value: 'same', label: '거의 그대로' }];
    const PRED_COAT = [{ value: 'light', label: '밝은 쪽으로' }, { value: 'dark', label: '어두운 쪽으로' }, { value: 'mixed', label: '거의 그대로' }];

    function buildPrediction() {
        const list = state.mode === 'beak' ? PRED_BEAK : PRED_COAT;
        predictionLegend.textContent = state.mode === 'beak' ? '10세대 뒤 무리의 부리는?' : state.flip === 'flip' ? '배경이 바뀐 뒤 무리는 어느 쪽으로 옮겨 갈까요?' : '10세대 뒤 무리의 털 색은?';
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction;
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    const shadeHex = s => { const v = Math.round(235 - 190 * s); return `rgb(${v},${v - 10},${v - 20})`; };
    const groundAt = g => { let gr = GROUNDS[state.ground]; if (state.flip === 'flip' && g >= FLIP_GEN) gr = state.ground === 'snow' ? GROUNDS.soil : GROUNDS.snow; return gr; };

    function renderMain(a) {
        const { g, culled } = genAt(state.progress);
        const gen = a.gens[g];
        const FX = 16, FY = 34, FW = 300, FH = 160;
        let out = '';
        if (a.kind === 'beak') {
            out += `<rect class="field mixed" style="fill:${SEEDS[state.seeds].targets.length === 2 ? '#6f6a48' : SEEDS[state.seeds].targets[0] < 5 ? '#7a7040' : '#5a4a30'}" x="${FX}" y="${FY}" width="${FW}" height="${FH}" rx="8"/>`;
            // seeds scattered on the ground
            for (let i = 0; i < 26; i += 1) {
                const sx = FX + 10 + ((i * 97) % (FW - 20)), sy = FY + 12 + ((i * 61) % (FH - 24));
                const big = SEEDS[state.seeds].targets.length === 2 ? i % 2 === 0 : SEEDS[state.seeds].targets[0] > 5;
                const sc = big ? 0.1 : 0.06;
                out += `<g transform="translate(${sx - 50 * sc}, ${sy - 50 * sc}) scale(${sc})">` +
                       `<path class="${big ? 'seed-large' : 'seed-small'}" d="M 50 32 C 64 32 72 40 72 50 C 72 62 64 68 50 68 C 36 68 28 62 28 50 C 28 40 36 32 50 32 Z"/></g>`;
            }
        } else {
            out += `<rect class="field ${groundAt(g).cls}" x="${FX}" y="${FY}" width="${FW}" height="${FH}" rx="8"/>`;
        }
        // the flock in an 8 × 5 grid, sorted so the eye can read the spread
        const order = gen.traits.map((t, i) => i).sort((p, q) => gen.traits[p] - gen.traits[q]);
        order.forEach((i, k) => {
            const col = k % 8, row = Math.floor(k / 8);
            const cx = FX + 22 + col * 36, cy = FY + 20 + row * 30;
            const t = gen.traits[i];
            const dead = culled && !gen.alive[i];
            if (a.kind === 'beak') {
                out += `<g class="${dead ? 'dead' : ''}">` +
                    `<g transform="translate(${cx - 10}, ${cy - 12}) scale(0.24)">` +
                    `<path class="bird" fill="#8fb3d9" stroke="#8fb3d9" stroke-width="2" d="M 34 32 C 44 30 54 36 56 46 C 66 46 80 54 88 68 L 76 72 C 66 82 50 82 38 74 C 30 68 28 58 30 48 C 30 40 28 36 34 32 Z M 48 78 L 46 92 M 56 78 L 58 92"/>` +
                    `</g>` +
                    `<path class="beak" fill="#d97706" d="M${(cx - 3).toFixed(1)},${(cy - 4 - t * 0.35).toFixed(1)} L${(cx - 3 - 3 - t * 1.2).toFixed(1)},${(cy - 2).toFixed(1)} L${(cx - 3).toFixed(1)},${(cy + t * 0.35).toFixed(1)} Z"/></g>`;
            } else {
                out += `<g class="${dead ? 'dead' : ''}"><ellipse class="mouse" fill="${shadeHex(t)}" cx="${cx}" cy="${cy}" rx="9" ry="6"/><circle class="mouse" fill="${shadeHex(t)}" cx="${cx + 8}" cy="${cy - 3}" r="3.2"/></g>`;
            }
        });
        // readouts
        const RX = 330;
        out += `<text class="gen-text" x="${RX}" y="52">${g === 0 ? '처음 무리' : `${g}세대`}${culled && g < GENS ? ' · 살아남기' : ''}</text>`;
        const alive = gen.alive.filter(Boolean).length;
        out += `<text class="trait-text" x="${RX}" y="74">${a.kind === 'beak' ? `평균 부리 ${gen.mean.toFixed(1)}` : `평균 밝기 ${(1 - gen.mean).toFixed(2)}`}</text>`;
        out += `<text class="trait-text" x="${RX}" y="90">${culled ? `${alive}마리 살아남음` : `${N}마리`}</text>`;
        if (a.kind === 'coat') out += `<text class="trait-text" x="${RX}" y="112">배경: ${groundAt(g).label}${state.flip === 'flip' && g >= FLIP_GEN ? ' (바뀜)' : ''}</text>`;
        else out += `<text class="trait-text" x="${RX}" y="112">먹이: ${SEEDS[state.seeds].label}</text>`;
        out += `<text class="trait-text" x="${RX}" y="134">흐려진 개체는</text><text class="trait-text" x="${RX}" y="148">자손을 남기지 못함</text>`;
        const VERD_B = { small: '작은 쪽으로 몰림', large: '큰 쪽으로 몰림', split: '양쪽으로 갈림', same: '거의 그대로' };
        const VERD_C = { light: '밝은 쪽으로', dark: '어두운 쪽으로', mixed: '거의 그대로' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${a.kind === 'beak' ? `${SEEDS[state.seeds].label} → 10세대 뒤 ${VERD_B[a.verdict]}` : `${GROUNDS[state.ground].label}${state.flip === 'flip' ? ` → ${FLIP_GEN}세대 뒤 바뀜` : ''} → 10세대 뒤 ${VERD_C[a.verdict]}`}</text>`;
        out += `<text class="note-text" x="20" y="208">${a.kind === 'beak' ? '부리가 클수록 뾰족한 부분이 큽니다 · 씨앗에 맞는 부리가 잘 먹습니다' : '천적은 배경과 다른 색의 쥐를 먼저 잡습니다'}</text>`;
        return out;
    }

    /* ------------------------------------------------------------ graphs */
    // the spread of the trait now against the first generation, as two histograms
    function graph(a) {
        const { g } = genAt(state.progress);
        const gen = a.gens[g], first = a.gens[0];
        const beak = a.kind === 'beak';
        const bins = beak ? 9 : 10, lo = beak ? 1 : 0, hi = beak ? 10 : 1;
        const count = tr => { const c = new Array(bins).fill(0); tr.forEach(t => { c[Math.min(bins - 1, Math.floor((t - lo) / (hi - lo) * bins))] += 1; }); return c; };
        const c0 = count(first.traits), c1 = count(gen.traits);
        const X0 = 50, X1 = 424, Y0 = 144, Y1 = 30, W = (X1 - X0) / bins, max = Math.max(8, ...c0, ...c1);
        let out = `<text class="axis-title figure-caption" x="${X0}" y="18">옅은 막대: 처음 · 진한 막대: ${g === 0 ? '처음' : `${g}세대`}</text>`;
        out += `<text class="axis-text figure-caption" style="fill:#059669" x="${X1}" y="18" text-anchor="end">초록 점선: 환경이 유리하게 하는 값</text>`;
        for (let b = 0; b < bins; b += 1) {
            const x = X0 + b * W;
            out += `<rect class="hist-bar hist-first" x="${(x + 2).toFixed(1)}" y="${(Y0 - (Y0 - Y1) * c0[b] / max).toFixed(1)}" width="${(W - 4).toFixed(1)}" height="${((Y0 - Y1) * c0[b] / max).toFixed(1)}" rx="2"/>`;
            const fill = beak ? '#ffb347' : shadeHex((b + 0.5) / bins);
            out += `<rect class="hist-bar" fill="${fill}" opacity=".9" x="${(x + W * 0.25).toFixed(1)}" y="${(Y0 - (Y0 - Y1) * c1[b] / max).toFixed(1)}" width="${(W * 0.5).toFixed(1)}" height="${((Y0 - Y1) * c1[b] / max).toFixed(1)}" rx="2"/>`;
            out += `<text class="axis-text" x="${(x + W / 2).toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${beak ? `${b + 1}` : b === 0 ? '밝음' : b === bins - 1 ? '어둠' : ''}</text>`;
        }
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/>`;
        // the environment's favoured value, and the mean now
        if (beak) SEEDS[state.seeds].targets.forEach(t => { const x = X0 + (t - lo) / (hi - lo) * (X1 - X0); out += `<line class="expect-line" style="stroke:#059669" x1="${x.toFixed(1)}" y1="${Y1}" x2="${x.toFixed(1)}" y2="${Y0}"/>`; });
        else { const sh = groundAt(g).shade; const x = X0 + sh * (X1 - X0); out += `<line class="expect-line" style="stroke:#059669" x1="${x.toFixed(1)}" y1="${Y1}" x2="${x.toFixed(1)}" y2="${Y0}"/>`; }
        const mx = X0 + (gen.mean - lo) / (hi - lo) * (X1 - X0);
        out += `<line class="mean-line" x1="${mx.toFixed(1)}" y1="${Y1 - 4}" x2="${mx.toFixed(1)}" y2="${Y0}"/>`;
        out += `<text class="mean-text" x="${Math.min(X1 - 40, Math.max(X0 + 40, mx)).toFixed(1)}" y="${Y0 + 30}" text-anchor="middle">평균 ${beak ? gen.mean.toFixed(1) : (gen.mean).toFixed(2)}</text>`;
        out += `<text class="axis-title" x="${((X0 + X1) / 2).toFixed(1)}" y="${Y0 + 46}" text-anchor="middle">${beak ? '부리 크기 (1 작음 ~ 10 큼)' : '털 색 (밝음 ~ 어둠)'}</text>`;
        return out;
    }

    function noteFor(a) {
        const { g } = genAt(state.progress);
        const means = a.gens.map(x => (a.kind === 'beak' ? x.mean.toFixed(1) : x.mean.toFixed(2)));
        return `<div class="data-row"><span class="data-name">무리</span><span class="data-val">${N}마리 · 세대마다 절반이 살아남아 각각 새끼 둘을 남김</span></div>` +
            `<div class="data-row"><span class="data-name">환경</span><span class="data-val">${a.kind === 'beak' ? SEEDS[state.seeds].label : `${GROUNDS[state.ground].label}${state.flip === 'flip' ? ` → ${FLIP_GEN}세대 뒤 ${(state.ground === 'snow' ? GROUNDS.soil : GROUNDS.snow).label}` : ''}`}</span></div>` +
            `<div class="data-row"><span class="data-name">지금</span><span class="data-val">${g === 0 ? '처음 무리' : `${g}세대`} · 평균 ${means[g]}</span></div>` +
            `<div class="data-row"><span class="data-name">세대별 평균</span><span class="data-val">${means.join(' → ')}</span></div>` +
            `<div class="data-row match"><span class="data-name">10세대 뒤</span><span class="data-val">평균 ${means[GENS]} (처음 ${means[0]})</span></div>`;
    }

    function render() {
        const a = analyse();
        mainGroup.innerHTML = renderMain(a);
        graphGroup.innerHTML = graph(a);
        stageBadge.textContent = a.kind === 'beak' ? SEEDS[state.seeds].label : `${GROUNDS[state.ground].label} · ${SWITCHES[state.flip].label}`;
        methodHint.textContent = state.mode === 'beak'
            ? '씨앗에 맞는 부리를 가진 새가 더 많이 살아남아 자손을 남깁니다'
            : '배경과 비슷한 털 색의 쥐가 천적을 피해 더 많이 살아남습니다';
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
        state.seed = (state.seed + 7919) | 0;    // a fresh flock every run
        state.gens = null;
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
        const f = a.first.mean, l = a.last.mean;
        if (a.kind === 'beak') {
            valueA.textContent = `평균 부리 ${f.toFixed(1)}`; valueB.textContent = `평균 부리 ${l.toFixed(1)}`;
        } else {
            valueA.textContent = `평균 ${f.toFixed(2)} (${f < 0.5 ? '밝은 편' : '어두운 편'})`; valueB.textContent = `평균 ${l.toFixed(2)} (${l < 0.35 ? '밝음' : l > 0.65 ? '어둠' : '중간'})`;
        }
        predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        let s = '';
        if (a.kind === 'beak') {
            const lo = a.last.traits.filter(t => t < 4.5).length, hi = a.last.traits.filter(t => t > 6.5).length;
            s = `처음 무리의 평균 부리는 ${f.toFixed(1)}${'013678'.includes(f.toFixed(1).slice(-1)) ? '이었고' : '였고'}, ${SEEDS[state.seeds].label} 있는 섬에서 10세대가 지나자 ${numIga(l.toFixed(1))} 되었습니다. `;
            if (a.verdict === 'small') s += `작은 씨앗은 작은 부리가 집기 좋아 부리가 작은 새가 더 많이 살아남고 새끼를 남겼습니다. `;
            else if (a.verdict === 'large') s += `큰 씨앗은 큰 부리라야 깰 수 있어 부리가 큰 새가 더 많이 살아남고 새끼를 남겼습니다. `;
            else if (a.verdict === 'split') s += `작은 씨앗은 작은 부리가, 큰 씨앗은 큰 부리가 잘 먹고 중간 부리는 어느 쪽도 잘 못 먹어, 무리가 작은 부리 ${lo}마리와 큰 부리 ${hi}마리 두 갈래로 나뉘었습니다. `;
            else s += `이번에는 무리가 크게 옮겨 가지 않았습니다. 우연히 살아남은 쪽이 섞여서인데, 세대를 더 넘기면 환경에 맞는 쪽으로 갑니다. `;
            s += `새 한 마리의 부리가 자란 것이 아니라, 처음부터 무리 안에 있던 여러 부리 가운데 살아남는 쪽이 달라진 것입니다. 이것이 자연 선택입니다.`;
        } else {
            const g0 = GROUNDS[state.ground], g1 = state.ground === 'snow' ? GROUNDS.soil : GROUNDS.snow;
            const m5 = a.gens[FLIP_GEN].mean;
            const backHome = g1.shade < 0.5 ? l < 0.35 : l > 0.65;
            s = `처음 무리의 털 색 평균은 ${f.toFixed(2)}(0이 흰색, 1이 검은색)이었습니다. `;
            if (state.flip === 'none') s += `${g0.label} 위에서는 ${g0.shade < 0.5 ? '밝은' : '어두운'} 쥐가 천적 눈에 덜 띄어 더 많이 살아남았고, 10세대 뒤 평균이 ${l.toFixed(2)}로 ${g0.shade < 0.5 ? '밝은' : '어두운'} 쪽으로 옮겨 갔습니다. `;
            else s += `${g0.label}에서 ${FLIP_GEN}세대 동안 ${g0.shade < 0.5 ? '밝은' : '어두운'} 쥐가 늘어 평균이 ${m5.toFixed(2)}가 되었지만, 배경이 ${g1.label}으로 바뀌자 이번에는 ${g1.shade < 0.5 ? '밝은' : '어두운'} 쥐가 살아남아 10세대 뒤 ${l.toFixed(2)}${backHome ? '로 되돌아갔습니다' : '까지 되돌아가는 중입니다. 세대를 더 넘기면 더 옮겨 갑니다'}. 어떤 털 색이 유리한지는 환경이 정합니다. `;
            s += `쥐가 털 색을 바꾼 것이 아니라, 무리 안에 원래 있던 여러 색 가운데 살아남는 쪽이 달라진 것입니다.`;
        }
        explanation.textContent = s;
    }

    function settingsChanged() {
        stopRun();
        state.progress = 0;
        state.gens = null;
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
        stageCaption.textContent = state.mode === 'beak'
            ? '한 세대마다 먹이를 잘 먹는 새가 살아남고, 흐려진 새는 자손을 남기지 못합니다.'
            : '한 세대마다 배경에 잘 숨는 쥐가 살아남고, 흐려진 쥐는 천적에게 잡힙니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { seeds: 'small', ground: 'snow', flip: 'none', progress: 0, prediction: null, gens: null });
        modeButtons.find(b => b.dataset.mode === 'beak').click();
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

    window.__selectionModel = {
        SEEDS, GROUNDS, SWITCHES, N, GENS, state,
        analyse, simulate, fitnessAll, render,
        runSeconds: () => RUN_SECONDS,
        setMode(m) { modeButtons.find(b => b.dataset.mode === m).click(); },
        set(key, value) { state[key] = value; buildControls(); buildPrediction(); settingsChanged(); },
        setSeed(v) { state.seed = v | 0; state.gens = null; render(); },
        setProgress(p) { stopRun(); state.progress = p; render(); },
        runToEnd(dt = 0.25, cap = 5000) {
            stopRun(); state.progress = 0; state.gens = null;
            let steps = 0;
            while (!tick(dt) && steps < cap) steps += 1;
            finish();
            return { steps, progress: state.progress };
        },
        tick, finish,
    };

    resetBtn.click();
});
