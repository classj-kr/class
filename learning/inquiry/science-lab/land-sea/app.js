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

    /* -------------------------------------------------------------- data */
    // A hundred-square model of the surface: 29 land cells laid out as four
    // continents, 71 sea cells. The true share of land is about 29 %.
    const LAND = new Set(['1,1', '1,2', '2,1', '2,2', '2,3', '3,1', '3,2', '4,2',
        '1,5', '1,6', '1,7', '2,5', '2,6', '2,7', '2,8', '3,6', '3,7', '3,8', '4,6', '4,7', '5,7',
        '6,2', '6,3', '7,2', '7,3', '8,2', '7,7', '7,8', '8,8']);
    const LAND_SHARE = LAND.size / 100;                 // 0.29
    const DOT_COUNTS = [10, 30, 100, 300];

    // Salt dissolved in a hundred grams of each water.
    const WATERS = {
        sea: { name: '바닷물', hint: '바다에서 떠 옴', saltPer100: 3.5, cls: 'brine', taste: '짜다' },
        river: { name: '강물', hint: '강에서 떠 옴', saltPer100: 0.02, cls: 'fresh', taste: '짜지 않다' },
        tap: { name: '수돗물', hint: '집에서 받음', saltPer100: 0.01, cls: 'fresh', taste: '짜지 않다' },
    };
    const AMOUNTS = [100, 200];

    const state = {
        mode: 'area',
        dots: 30,
        water: 'sea', grams: 100,
        progress: 0, prediction: null,
        seed: (Date.now() % 100000) | 0, drops: [],
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

    /* ------------------------------------------------------------ models */
    // every dot lands somewhere on the hundred squares, chosen at random
    function dropDots() {
        const rand = rng(state.seed);
        state.drops = Array.from({ length: state.dots }, () => {
            const x = rand() * 10, y = rand() * 10;
            return { x, y, land: LAND.has(`${Math.floor(y)},${Math.floor(x)}`) };
        });
    }
    const shownDots = () => Math.floor(state.progress * state.dots + 1e-9);
    function analyseArea() {
        if (state.drops.length !== state.dots) dropDots();
        const seaAll = state.drops.filter(d => !d.land).length;
        const share = seaAll / state.dots;
        const verdict = share > 0.6 ? 'sea-more' : share < 0.4 ? 'land-more' : 'even';
        return { kind: 'area', seaAll, landAll: state.dots - seaAll, verdict };
    }
    const tallyArea = k => { let sea = 0; for (let i = 0; i < k; i += 1) if (!state.drops[i].land) sea += 1; return { sea, land: k - sea }; };

    function analyseSalt(s = state) {
        const water = WATERS[s.water];
        const salt = water.saltPer100 * s.grams / 100;
        const verdict = salt >= 30 ? 'lots' : salt >= 1 ? 'some' : 'none';
        return { kind: 'salt', water, salt, evaporated: s.grams - salt, verdict };
    }
    const evaporated = p => Math.min(1, p * 1.15);        // the water is gone a little before the run ends

    const analyse = () => (state.mode === 'area' ? analyseArea() : analyseSalt());

    /* ---------------------------------------------------------- controls */
    function pickRow(legend, name, options, current, cols) {
        return `<fieldset class="pick-field"><legend>${legend}</legend>` +
            `<div class="pick-buttons cols${cols}" data-pick="${name}">` +
            options.map(o => `<button type="button" data-value="${o.value}" class="${o.value === String(current) ? 'selected' : ''}">` +
                `${o.label}${o.hint ? `<small>${o.hint}</small>` : ''}</button>`).join('') +
            `</div></fieldset>`;
    }

    function buildControls() {
        if (state.mode === 'area') {
            controlArea.innerHTML = pickRow('떨어뜨릴 붙임딱지', 'dots', DOT_COUNTS.map(n => ({ value: String(n), label: `${n}장` })), state.dots, 4);
        } else {
            controlArea.innerHTML =
                pickRow('말릴 물', 'water', Object.entries(WATERS).map(([k, v]) => ({ value: k, label: v.name, hint: v.hint })), state.water, 3) +
                pickRow('물의 양', 'grams', AMOUNTS.map(g => ({ value: String(g), label: `${g} g` })), state.grams, 2);
        }
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                const v = button.dataset.value;
                state[group.dataset.pick] = ['dots', 'grams'].includes(group.dataset.pick) ? Number(v) : v;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                buildPrediction();
                settingsChanged();
            }));
        });
    }

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        let list;
        if (state.mode === 'area') {
            list = [{ value: 'sea-more', label: '바다에 훨씬 많이' }, { value: 'even', label: '반반쯤' }, { value: 'land-more', label: '육지에 훨씬 많이' }];
            predictionLegend.textContent = `${state.dots}장은 어디에 더 많이 떨어질까요?`;
        } else {
            list = [{ value: 'none', label: '거의 남지 않는다' }, { value: 'some', label: '소금이 몇 g 남는다' }, { value: 'lots', label: '소금이 30 g 넘게 남는다' }];
            predictionLegend.textContent = `${WATERS[state.water].name} ${state.grams} g을 말리면 무엇이 남을까요?`;
        }
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}"${o.value === state.prediction ? ' class="selected"' : ''}>${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    function renderArea(a, p) {
        const k = shownDots();
        const GX = 24, GY = 34, CELL = 16;
        let out = '';
        for (let r = 0; r < 10; r += 1) for (let c = 0; c < 10; c += 1) {
            out += `<rect class="${LAND.has(`${r},${c}`) ? 'cell-land' : 'cell-sea'}" x="${GX + c * CELL}" y="${GY + r * CELL}" width="${CELL}" height="${CELL}"/>`;
        }
        for (let i = 0; i < k; i += 1) {
            const d = state.drops[i];
            out += `<circle class="dot ${d.land ? 'land' : 'sea'}" cx="${(GX + d.x * CELL).toFixed(1)}" cy="${(GY + d.y * CELL).toFixed(1)}" r="${state.dots > 100 ? 2 : 3}"/>`;
        }
        const t = tallyArea(k);
        out += `<text class="legend-text" x="${GX}" y="${GY + 10 * CELL + 14}">초록 = 육지 29칸 · 파랑 = 바다 71칸</text>`;
        // tally on the right
        const TX = 220;
        out += `<text class="tally-text" x="${TX}" y="60">떨어진 붙임딱지 ${k} / ${state.dots}장</text>`;
        out += `<circle class="dot sea" cx="${TX + 6}" cy="86" r="5"/><text class="tally-text" x="${TX + 18}" y="90">바다에 ${t.sea}장${k ? ` (${Math.round(t.sea / k * 100)} %)` : ''}</text>`;
        out += `<circle class="dot land" cx="${TX + 6}" cy="112" r="5"/><text class="tally-text" x="${TX + 18}" y="116">육지에 ${t.land}장${k ? ` (${Math.round(t.land / k * 100)} %)` : ''}</text>`;
        // two bars to compare
        const BW = 200;
        out += `<rect class="bar" x="${TX}" y="132" width="${BW}" height="12" rx="3" fill="rgba(255,255,255,.08)"/>`;
        if (k) out += `<rect class="bar" x="${TX}" y="132" width="${(BW * t.sea / k).toFixed(1)}" height="12" rx="3" fill="#d97706" opacity=".9"/>`;
        out += `<text class="legend-text" x="${TX}" y="158">노란 막대 = 바다 비율 · 점선 = 실제 71 %</text>`;
        out += `<line class="expect-line" x1="${(TX + BW * (1 - LAND_SHARE)).toFixed(1)}" y1="128" x2="${(TX + BW * (1 - LAND_SHARE)).toFixed(1)}" y2="148"/>`;
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">붙임딱지 ${state.dots}장 → ${a.verdict === 'sea-more' ? '바다에 더 많이' : a.verdict === 'land-more' ? '육지에 더 많이' : '반반에 가까움'}</text>`;
        out += `<text class="note-text" x="${TX}" y="196">${k < state.dots ? '떨어뜨리는 중' : `다 떨어졌습니다 · 바다 ${a.seaAll}장 : 육지 ${a.landAll}장`}</text>`;
        return out;
    }

    function renderSalt(a, p) {
        const e = evaporated(p);
        let out = '';
        // two dishes: the chosen water and, for comparison, the other kind
        const others = Object.entries(WATERS).filter(([k]) => k !== state.water);
        const pair = [[state.water, WATERS[state.water]], others[0]];
        pair.forEach(([k, w], i) => {
            const cx = 120 + i * 220, base = 150, W = 150, H = 40;
            const salt = w.saltPer100 * state.grams / 100;
            const level = (1 - e) * H * (state.grams / 200 + 0.4);
            out += `<text class="dish-title" x="${cx}" y="${64}" text-anchor="middle">${w.name} ${state.grams} g${i ? ' (견주기)' : ''}</text>`;
            out += `<path class="dish" d="M${cx - W / 2},${base - H} L${cx - W / 2 + 10},${base} L${cx + W / 2 - 10},${base} L${cx + W / 2},${base - H}"/>`;
            if (level > 0.5) out += `<rect class="${w.cls}" x="${cx - W / 2 + 12}" y="${(base - level).toFixed(1)}" width="${W - 24}" height="${level.toFixed(1)}"/>`;
            // salt shows as the water goes, thicker the more there is
            const saltH = Math.min(14, salt * 2.2) * Math.min(1, Math.max(0, (e - 0.5) / 0.5));
            if (saltH > 0.3) {
                for (let j = 0; j < 9; j += 1) {
                    const sx = cx - 50 + j * 12.5;
                    out += `<rect class="salt" x="${sx.toFixed(1)}" y="${(base - saltH * (0.6 + ((j * 7) % 5) / 10)).toFixed(1)}" width="9" height="${(saltH * (0.6 + ((j * 7) % 5) / 10)).toFixed(1)}" rx="1.5"/>`;
                }
            }
            if (e > 0.02 && e < 1) for (let j = 0; j < 3; j += 1) {
                const sx = cx - 30 + j * 30, ph = (p * 6 + j * 0.33) % 1;
                out += `<path class="steam" opacity="${(1 - ph).toFixed(2)}" d="M${sx},${(base - H - 6 - ph * 30).toFixed(1)} q6,-8 0,-16 q-6,-6 0,-14"/>`;
            }
            out += `<text class="legend-text" x="${cx}" y="${base + 20}" text-anchor="middle">${e >= 1 ? (salt >= 0.1 ? `소금 ${salt.toFixed(1)} g 남음` : '거의 남지 않음') : `물 ${((1 - e) * (state.grams - salt)).toFixed(1)} g 남음`}</text>`;
        });
        const VERD = { none: '거의 남지 않는다', some: `소금 ${a.salt.toFixed(1)} g이 남는다`, lots: '소금이 아주 많이 남는다' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${a.water.name} ${state.grams} g → ${VERD[a.verdict]}</text>`;
        out += `<text class="note-text" x="20" y="34">${e < 1 ? `햇볕에 말리는 중 · ${Math.round(e * 100)} % 증발` : '물이 다 날아갔습니다'}</text>`;
        out += `<text class="note-text" x="20" y="206">물은 수증기가 되어 날아가고 녹아 있던 것만 남습니다 · 맛: ${a.water.taste}</text>`;
        return out;
    }

    function renderMain(a) {
        mainGroup.innerHTML = a.kind === 'area' ? renderArea(a, state.progress) : renderSalt(a, state.progress);
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

    // the share landing in the sea as dots fall, inside the band chance usually stays in
    function graphArea(a) {
        const n = state.dots, k = shownDots();
        const gx = i => GRAPH.x0 + (i / n) * (GRAPH.x1 - GRAPH.x0);
        const gy = f => GRAPH.y0 - f * (GRAPH.y0 - GRAPH.y1);
        let out = graphFrame(
            [0, 0.25, 0.5, 0.75, 1].map(f => [Math.round(f * n), gx(f * n)]),
            [[0, gy(0)], ['25 %', gy(0.25)], ['50 %', gy(0.5)], ['75 %', gy(0.75)], ['100 %', gy(1)]],
            '떨어뜨린 붙임딱지 (장)', '바다에 떨어진 비율');
        const pSea = 1 - LAND_SHARE;
        const upper = [], lower = [];
        for (let i = 1; i <= n; i += Math.max(1, Math.floor(n / 80))) {
            const s = 2 * Math.sqrt(pSea * (1 - pSea) / i);
            upper.push(`${gx(i).toFixed(1)},${gy(Math.min(1, pSea + s)).toFixed(1)}`);
            lower.unshift(`${gx(i).toFixed(1)},${gy(Math.max(0, pSea - s)).toFixed(1)}`);
        }
        out += `<path class="band" d="M${upper.join('L')}L${lower.join('L')}Z"/>`;
        out += `<line class="expect-line" x1="${GRAPH.x0}" y1="${gy(pSea).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(pSea).toFixed(1)}"/>`;
        out += `<text class="axis-text" style="fill:#059669" x="${GRAPH.x1 - 4}" y="${(gy(pSea) - 5).toFixed(1)}" text-anchor="end">실제 바다 ${Math.round(pSea * 100)} %</text>`;
        if (k > 0) {
            const pts = [];
            let sea = 0;
            for (let i = 1; i <= k; i += 1) {
                if (!state.drops[i - 1].land) sea += 1;
                if (i % Math.max(1, Math.floor(k / 120)) === 0 || i === k) pts.push(`${gx(i).toFixed(1)},${gy(sea / i).toFixed(1)}`);
            }
            out += `<path class="trace" style="stroke:#d97706" d="M${pts.join('L')}"/>`;
            out += `<circle class="trace-dot" cx="${gx(k).toFixed(1)}" cy="${gy(sea / k).toFixed(1)}" r="5" fill="#d97706"/>`;
        }
        out += `<text class="note-text" x="${GRAPH.x0 + 8}" y="${GRAPH.y1 + 14}">옅은 띠: 우연만으로 보통 벗어나는 범위 — 많이 떨어뜨릴수록 좁아집니다</text>`;
        return out;
    }

    // salt left from each water, side by side
    function graphSalt(a) {
        const rows = Object.entries(WATERS).map(([k, w]) => ({ k, w, salt: w.saltPer100 * state.grams / 100 }));
        const max = Math.max(...rows.map(r => r.salt)) * 1.15;
        const gx = v => GRAPH.x0 + (v / max) * (GRAPH.x1 - GRAPH.x0);
        let out = graphFrame([0, 2, 4, 6].filter(v => v <= max).map(v => [`${v} g`, gx(v)]), [], `${state.grams} g을 말렸을 때 남는 소금`, '');
        rows.forEach((r, i) => {
            const y = GRAPH.y1 + 30 + i * 36;
            const mine = r.k === state.water;
            out += `<text class="bar-text" fill="${mine ? '#d97706' : '#334155'}" x="${GRAPH.x0}" y="${y - 9}">${r.w.name} — ${r.salt >= 0.1 ? `${r.salt.toFixed(1)} g` : `${r.salt.toFixed(2)} g (거의 없음)`}</text>`;
            out += `<rect class="bar" x="${GRAPH.x0}" y="${y - 4}" width="${Math.max(2, gx(r.salt) - GRAPH.x0).toFixed(1)}" height="12" rx="3" fill="${mine ? '#d97706' : '#6f8f8d'}" opacity=".9"/>`;
        });
        return out;
    }

    function noteFor(a) {
        if (a.kind === 'area') {
            const k = shownDots(), t = tallyArea(k);
            return `<div class="data-row"><span class="data-name">모형</span><span class="data-val">지구 표면 100칸 = 바다 71칸 + 육지 29칸</span></div>` +
                `<div class="data-row"><span class="data-name">떨어뜨린 것</span><span class="data-val">${k} / ${state.dots}장 (어디에 떨어질지는 우연)</span></div>` +
                `<div class="data-row"><span class="data-name">지금까지</span><span class="data-val">바다 ${t.sea}장 · 육지 ${t.land}장${k ? ` → 바다 ${Math.round(t.sea / k * 100)} %` : ''}</span></div>` +
                `<div class="data-row match"><span class="data-name">다 떨어지면</span><span class="data-val">바다 ${a.seaAll}장 : 육지 ${a.landAll}장 (바다 ${Math.round(a.seaAll / state.dots * 100)} %)</span></div>`;
        }
        const e = evaporated(state.progress);
        return `<div class="data-row"><span class="data-name">물</span><span class="data-val">${a.water.name} ${state.grams} g · 100 g마다 소금 ${a.water.saltPer100} g</span></div>` +
            `<div class="data-row"><span class="data-name">지금</span><span class="data-val">${Math.round(e * 100)} % 증발 · 물 ${((1 - e) * a.evaporated).toFixed(1)} g 남음</span></div>` +
            `<div class="data-row"><span class="data-name">맛</span><span class="data-val">${a.water.taste}</span></div>` +
            `<div class="data-row match"><span class="data-name">다 마르면</span><span class="data-val">${a.salt >= 0.1 ? `소금 ${a.salt.toFixed(1)} g` : `소금 ${a.salt.toFixed(2)} g — 눈에 잘 띄지 않음`}</span></div>`;
    }

    function render() {
        const a = analyse();
        renderMain(a);
        graphGroup.innerHTML = a.kind === 'area' ? graphArea(a) : graphSalt(a);
        stageBadge.textContent = a.kind === 'area' ? `붙임딱지 ${state.dots}장` : `${a.water.name} ${state.grams} g`;
        methodHint.textContent = state.mode === 'area'
            ? '지구 표면은 바다가 약 71칸, 육지가 약 29칸입니다'
            : '물은 날아가고 녹아 있던 소금만 남습니다';
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
        if (state.mode === 'area') { state.seed = (state.seed + 7919) | 0; state.drops = []; }
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
        if (a.kind === 'area') {
            labelA.textContent = '바다에'; labelB.textContent = '육지에';
            valueA.textContent = `${a.seaAll}장`; valueB.textContent = `${a.landAll}장`;
            const share = a.seaAll / state.dots;
            const actual = a.verdict;
            predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
                : state.prediction === actual ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
            let s = `${state.dots}장 가운데 바다에 ${a.seaAll}장(${Math.round(share * 100)} %), 육지에 ${a.landAll}장이 떨어졌습니다. `;
            if (actual === 'sea-more') s += `이번 표본에서는 바다 쪽이 더 많이 나왔습니다. 바다에 떨어질 확률이 더 크지만 매번 같은 결과가 나오는 것은 아닙니다. `;
            else if (actual === 'even') s += `이번에는 우연히 바다와 육지가 비슷하게 나왔습니다. 몇 장만으로는 이런 일이 생깁니다. `;
            else s += `이번에는 우연히 육지에 더 많이 떨어졌습니다. 몇 장만으로는 이런 일이 생깁니다. `;
            s += state.dots <= 30
                ? `${state.dots}장은 적어서 다음번에는 다른 비율이 나올 수 있습니다. 더 많이 떨어뜨려 71 : 29에 가까워지는지 보세요.`
                : `실제 지구는 바다 71칸 : 육지 29칸입니다. 많이 떨어뜨릴수록 이 비율에 가까워집니다.`;
            explanation.textContent = s;
            return;
        }
        labelA.textContent = '남은 소금'; labelB.textContent = '날아간 물';
        valueA.textContent = a.salt >= 0.1 ? `${a.salt.toFixed(1)} g` : '거의 없음';
        valueB.textContent = `${Number(a.evaporated.toFixed(2))} g`;
        predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        explanation.textContent = state.water === 'sea'
            ? `바닷물 ${state.grams} g을 말리자 물은 수증기가 되어 모두 날아가고 하얀 소금이 ${a.salt.toFixed(1)} g 남았습니다. 바닷물 100 g마다 소금이 약 3.5 g 녹아 있어 짠맛이 나고, 그래서 마실 수 없습니다. 강물이나 수돗물을 같이 말리면 거의 아무것도 남지 않습니다.`
            : `${a.water.name} ${state.grams} g을 말리자 물은 다 날아갔지만 접시에는 거의 아무것도 남지 않았습니다(소금 ${a.salt.toFixed(2)} g). 염류가 적다는 결과만으로 마셔도 안전하다고 판단할 수는 없습니다. 강물은 정수 없이 마시면 안 됩니다. 바닷물을 같이 말리면 소금이 ${(3.5 * state.grams / 100).toFixed(1)} g 남아 차이가 뚜렷합니다.`;
    }

    function settingsChanged() {
        stopRun();
        state.progress = 0;
        state.drops = [];
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
        stageCaption.textContent = state.mode === 'area'
            ? '지구 표면을 100칸으로 나눈 모형입니다. 눈을 감고 붙임딱지를 떨어뜨리는 것과 같습니다.'
            : '왼쪽은 고른 물, 오른쪽은 견주기 위한 다른 물입니다. 물이 마르면서 접시에 남는 것을 보세요.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { dots: 30, water: 'sea', grams: 100, progress: 0, prediction: null, drops: [] });
        modeButtons.find(b => b.dataset.mode === 'area').click();
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

    window.__landSeaModel = {
        LAND, LAND_SHARE, WATERS, DOT_COUNTS, state,
        analyseArea, analyseSalt, analyse, dropDots, tallyArea, render,
        runSeconds: () => RUN_SECONDS,
        setMode(m) { modeButtons.find(b => b.dataset.mode === m).click(); },
        set(key, value) { state[key] = value; buildControls(); buildPrediction(); settingsChanged(); },
        setSeed(v) { state.seed = v | 0; state.drops = []; render(); },
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
