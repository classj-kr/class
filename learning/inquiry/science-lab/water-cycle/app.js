document.addEventListener('DOMContentLoaded', () => {
    const sunRange = document.getElementById('sunRange');
    const tempRange = document.getElementById('tempRange');
    const sunOutput = document.getElementById('sunOutput');
    const tempOutput = document.getElementById('tempOutput');
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const runBtn = document.getElementById('runBtn');
    const resetBtn = document.getElementById('resetBtn');
    const graphGroup = document.getElementById('graphGroup');
    const dataNote = document.getElementById('dataNote');
    const resultEmpty = document.getElementById('resultEmpty');
    const resultContent = document.getElementById('resultContent');
    const resultTotal = document.getElementById('resultTotal');
    const resultTime = document.getElementById('resultTime');
    const predictionResult = document.getElementById('predictionResult');
    const explanation = document.getElementById('elementaryExplanation');
    const stageCaption = document.getElementById('stageCaption');
    const stageBadge = document.getElementById('stageBadge');
    const sunBeams = document.getElementById('sunBeams');
    const sunDisc = document.getElementById('sunDisc');
    const cloudGroup = document.getElementById('cloudGroup');
    const rainGroup = document.getElementById('rainGroup');
    const vaporGroup = document.getElementById('vaporGroup');
    const seaRect = document.getElementById('seaRect');
    const seaSurface = document.getElementById('seaSurface');
    const riverCourse = document.getElementById('riverCourse');
    const riverBody = document.getElementById('riverBody');
    const riverFlow = document.getElementById('riverFlow');

    /* 강은 산에서 시작해 바다로 갑니다. 예전에는 화면 바닥으로 빠져 바다에
       닿지 않았고, 선 하나로 그려 상류와 하류의 굵기가 같았습니다. 이제
       가운데 선을 따라 좌우로 벌린 면으로 그리고, 아래로 갈수록 넓힙니다. */
    const COURSE = [[72, 174], [92, 196], [112, 212], [140, 228], [175, 240], [210, 247], [243, 250]];

    function renderRiver() {
        // 땅에 고인 물이 많을수록 강 전체가 굵어집니다
        const scale = Math.max(0.55, Math.min(1.9, R.land / 45));
        const half = i => {
            const t = i / (COURSE.length - 1);          // 0 상류 → 1 하류
            return (0.9 + 4.4 * t * t) * scale;          // 하류로 갈수록 빠르게 넓어짐
        };
        const left = [], right = [];
        COURSE.forEach(([x, y], i) => {
            const [px, py] = COURSE[Math.max(0, i - 1)];
            const [nx, ny] = COURSE[Math.min(COURSE.length - 1, i + 1)];
            const dx = nx - px, dy = ny - py;
            const len = Math.hypot(dx, dy) || 1;
            const ox = (-dy / len) * half(i), oy = (dx / len) * half(i);
            left.push(`${(x + ox).toFixed(1)},${(y + oy).toFixed(1)}`);
            right.unshift(`${(x - ox).toFixed(1)},${(y - oy).toFixed(1)}`);
        });
        riverBody.setAttribute('d', `M${left.join('L')}L${right.join('L')}Z`);

        // 물이 실제로 흐르는 것이 보이도록, 가운데 선을 따라 물방울을 흘려보냅니다
        const drops = Math.max(3, Math.round(4 + scale * 3));
        let out = '';
        for (let i = 0; i < drops; i += 1) {
            const delay = (i * (2.8 / drops)).toFixed(2);
            const r = (1.1 + (i % 3) * 0.5) * Math.min(1.4, scale);
            out += `<circle class="river-drop" r="${r.toFixed(1)}">` +
                   `<animateMotion dur="2.8s" begin="-${delay}s" repeatCount="indefinite">` +
                   `<mpath href="#riverCourse"/></animateMotion></circle>`;
        }
        riverFlow.innerHTML = out;
    }

    const reservoirBars = document.getElementById('reservoirBars');

    // Four reservoirs holding a fixed amount of water between them. Every flow
    // below moves water from one reservoir to another and never creates or
    // destroys any, so the total is conserved by construction — which is the
    // whole point of the lesson, not something tuned to look right.
    const TOTAL = 1000;
    const INITIAL = { sea: 850, vapor: 40, cloud: 40, land: 70 };
    const SEA_REF = 850;

    const K_EVAP = 0.10, K_COND = 0.18, K_PRECIP = 0.12, K_RUNOFF = 0.10;
    const CLOUD_MIN = 25;        // a thin cloud does not rain yet
    const LAND_FRAC = 0.30;      // share of rain that lands on ground, not sea
    const DT = 0.05;             // simulated days per solver step
    const DAYS_PER_SECOND = 2;

    let R = { ...INITIAL };
    let days = 0;
    let running = false;
    let prediction = null;
    let rafId = null, lastT = null;

    const total = () => R.sea + R.vapor + R.cloud + R.land;

    // One step of the compartment model. Each flow is capped by what the
    // source reservoir actually holds, so a reservoir can never go negative
    // and the water taken out is exactly the water put in.
    function step() {
        const sun = Number(sunRange.value) / 10;
        const cool = (11 - Number(tempRange.value)) / 10;

        let evap = K_EVAP * sun * (R.sea / SEA_REF) * DT * 100;
        let cond = K_COND * cool * R.vapor * DT;
        let precip = K_PRECIP * Math.max(0, R.cloud - CLOUD_MIN) * DT;
        let runoff = K_RUNOFF * R.land * DT;

        evap = Math.min(evap, R.sea);
        cond = Math.min(cond, R.vapor);
        precip = Math.min(precip, R.cloud);
        runoff = Math.min(runoff, R.land);

        R.sea += -evap + precip * (1 - LAND_FRAC) + runoff;
        R.vapor += evap - cond;
        R.cloud += cond - precip;
        R.land += precip * LAND_FRAC - runoff;

        days += DT;
        return { evap, cond, precip, runoff };
    }

    /* 흐른 자취를 남겨 둡니다. 막대는 지금 이 순간만 보여 주지만, 물이
       어디로 옮겨 갔는지와 그러면서도 총량이 그대로인지는 시간을 따라
       그려야 보입니다. */
    const HISTORY_EVERY = 0.5;          // 처음의 기록 간격(모의 날짜)
    const HISTORY_MAX = 400;
    let history = [{ d: 0, ...INITIAL }];
    let historyEvery = HISTORY_EVERY;
    /* 오래된 기록을 버리면 첫날치가 사라져 그래프 왼쪽이 빈 채로 남습니다.
       버리는 대신 하나 걸러 하나씩 솎아 내고 기록 간격을 두 배로 늘립니다.
       그러면 개수는 묶여 있으면서도 그래프는 언제나 0일부터 지금까지를
       덮습니다. */
    const recordHistory = () => {
        const last = history[history.length - 1];
        if (days - last.d < historyEvery) return;
        history.push({ d: days, ...R });
        if (history.length > HISTORY_MAX) {
            const end = history.length - 1;
            history = history.filter((_, i) => i % 2 === 0 || i === end);
            historyEvery *= 2;
        }
    };
    const resetHistory = () => { history = [{ d: 0, ...INITIAL }]; historyEvery = HISTORY_EVERY; };

    function advanceSim(simDays) {
        const steps = Math.round(simDays / DT);
        let last = null;
        for (let i = 0; i < steps; i += 1) { last = step(); recordHistory(); }
        return last;
    }

    function currentFlows() {
        const sun = Number(sunRange.value) / 10;
        const cool = (11 - Number(tempRange.value)) / 10;
        return {
            evap: K_EVAP * sun * (R.sea / SEA_REF) * DT * 100,
            cond: K_COND * cool * R.vapor * DT,
            precip: K_PRECIP * Math.max(0, R.cloud - CLOUD_MIN) * DT,
        };
    }

    function buildBeams() {
        let out = '';
        for (let i = 0; i < 5; i += 1) {
            const a = (215 + i * 25) * Math.PI / 180;
            out += `<line class="sun-beam" x1="${(60 + 27 * Math.cos(a)).toFixed(1)}" y1="${(46 + 27 * Math.sin(a)).toFixed(1)}" x2="${(60 + 38 * Math.cos(a)).toFixed(1)}" y2="${(46 + 38 * Math.sin(a)).toFixed(1)}"/>`;
        }
        sunBeams.innerHTML = out;
    }

    function render() {
        const sun = Number(sunRange.value);
        sunDisc.setAttribute('r', (14 + sun * 0.7).toFixed(1));
        sunBeams.setAttribute('opacity', (0.25 + 0.075 * sun).toFixed(2));

        // sea level tracks how much water the sea currently holds
        const seaH = Math.max(14, Math.min(140, 88 * (R.sea / SEA_REF)));
        const seaTop = 300 - seaH;
        seaRect.setAttribute('y', seaTop.toFixed(1));
        seaRect.setAttribute('height', seaH.toFixed(1));
        seaSurface.setAttribute('y1', seaTop.toFixed(1));
        seaSurface.setAttribute('y2', seaTop.toFixed(1));

        renderRiver();

        // cloud grows with the condensed water it holds
        const s = Math.max(0.35, Math.min(2.1, R.cloud / 55));
        const cx = 300, cy = 78;
        cloudGroup.innerHTML =
            `<ellipse class="cloud-puff" cx="${cx - 26 * s}" cy="${cy + 4}" rx="${26 * s}" ry="${15 * s}" opacity="${(0.5 + 0.35 * Math.min(1, s)).toFixed(2)}"/>` +
            `<ellipse class="cloud-puff" cx="${cx}" cy="${cy - 6 * s}" rx="${32 * s}" ry="${20 * s}" opacity="${(0.55 + 0.35 * Math.min(1, s)).toFixed(2)}"/>` +
            `<ellipse class="cloud-puff" cx="${cx + 28 * s}" cy="${cy + 4}" rx="${24 * s}" ry="${14 * s}" opacity="${(0.5 + 0.35 * Math.min(1, s)).toFixed(2)}"/>`;

        // rising vapour: how many wisps reflects how much water is in the air
        const vaporCount = Math.max(0, Math.min(14, Math.round(R.vapor / 7)));
        let vout = '';
        for (let i = 0; i < vaporCount; i += 1) {
            const x = 250 + ((i * 37) % 190);
            const delay = ((i * 0.37) % 2.2).toFixed(2);
            vout += `<circle class="vapor" cx="${x}" cy="${(seaTop - 6).toFixed(1)}" r="${(2.6 + (i % 3) * 0.7).toFixed(1)}">` +
                    `<animate attributeName="cy" from="${(seaTop - 6).toFixed(1)}" to="102" dur="2.6s" begin="${delay}s" repeatCount="indefinite"/>` +
                    `<animate attributeName="opacity" values="0;.85;0" dur="2.6s" begin="${delay}s" repeatCount="indefinite"/></circle>`;
        }
        vaporGroup.innerHTML = vout;

        // rain only falls once the cloud is thick enough to precipitate
        const f = currentFlows();
        const rainCount = f.precip > 0.002 ? Math.max(1, Math.min(12, Math.round(f.precip * 90))) : 0;
        let rout = '';
        for (let i = 0; i < rainCount; i += 1) {
            const x = 258 + ((i * 29) % 96);
            const delay = ((i * 0.21) % 1.1).toFixed(2);
            rout += `<ellipse class="raindrop" cx="${x}" cy="100" rx="1.9" ry="4">` +
                    `<animate attributeName="cy" from="100" to="${(seaTop - 4).toFixed(1)}" dur="1.1s" begin="${delay}s" repeatCount="indefinite"/>` +
                    `<animate attributeName="opacity" values="0;.9;0" dur="1.1s" begin="${delay}s" repeatCount="indefinite"/></ellipse>`;
        }
        rainGroup.innerHTML = rout;

        const rows = [
            { key: 'sea', name: '바다', color: '#4aa3d0' },
            // 구름(#d8e6ee)과 거의 같은 옅은 파랑이었습니다. 두 선이 아래 칸에
            // 나란히 놓이게 되면서 구별이 안 돼, 눈에 안 보이는 수증기 쪽을
            // 뚜렷이 다른 보라로 바꿉니다.
            { key: 'vapor', name: '수증기', color: '#9d8fe0' },
            { key: 'cloud', name: '구름', color: '#d8e6ee' },
            { key: 'land', name: '땅의 물', color: '#6fbf73' },
        ];
        reservoirBars.innerHTML = rows.map(r =>
            `<div class="res-row"><span class="res-name">${r.name}</span>` +
            `<span class="res-track"><span class="res-fill" style="width:${(R[r.key] / TOTAL * 100).toFixed(1)}%;background:${r.color}"></span></span>` +
            `<span class="res-value">${Math.round(R[r.key])}</span></div>`
        ).join('') +
            `<div class="res-row total"><span class="res-name">전체</span>` +
            `<span class="res-track"><span class="res-fill" style="width:100%;background:rgba(84,230,193,.5)"></span></span>` +
            `<span class="res-value">${Math.round(total())}</span></div>`;

        resultTotal.textContent = `${Math.round(total())}`;
        resultTime.textContent = `${Math.round(days)}일`;
        stageBadge.textContent = running ? `${Math.round(days)}일째 순환 중` : '멈춤';

        renderTrend(rows);
        renderData(rows);
    }

    /* 바다가 850을 쥐고 있어 한 눈금에 다 그리면 나머지 셋이 바닥에 눌려
       움직임이 보이지 않습니다. 그래서 칸을 둘로 나눕니다 — 위는 0~1000으로
       전체와 바다를, 아래는 눈금을 키워 공기와 땅의 물을 봅니다. 아래 칸이
       확대된 것이라는 사실은 제목에 적어 둡니다. */
    const AX = { x0: 52, x1: 396 };
    const TOP = { y0: 130, y1: 34, max: 1000 };
    const BOT = { y0: 268, y1: 176 };
    const tx = (d, span) => AX.x0 + (span > 0 ? d / span : 0) * (AX.x1 - AX.x0);
    const tyTop = v => TOP.y0 - (v / TOP.max) * (TOP.y0 - TOP.y1);
    const tyBot = (v, max) => BOT.y0 - (v / max) * (BOT.y0 - BOT.y1);

    const SMALL = ['vapor', 'cloud', 'land'];
    function smallMax() {
        let m = 0;
        for (const h of history) for (const k of SMALL) m = Math.max(m, h[k]);
        return Math.max(100, Math.ceil(m / 50) * 50);
    }

    function axisFrame(out, box, ticks, span, title, yLabel) {
        for (const v of ticks) {
            const y = box.ty(v);
            out.push(`<line class="grid-line" x1="${AX.x0}" y1="${y.toFixed(1)}" x2="${AX.x1}" y2="${y.toFixed(1)}"/>`);
            out.push(`<text class="axis-text" x="${AX.x0 - 6}" y="${(y + 3).toFixed(1)}" text-anchor="end">${v}</text>`);
        }
        for (let k = 0; k <= 4; k += 1) {
            const d = (span * k) / 4;
            out.push(`<text class="axis-text" x="${tx(d, span).toFixed(1)}" y="${box.y0 + 15}" text-anchor="middle">${d.toFixed(0)}</text>`);
        }
        out.push(`<line class="axis" x1="${AX.x0}" y1="${box.y0}" x2="${AX.x1}" y2="${box.y0}"/>`);
        out.push(`<line class="axis" x1="${AX.x0}" y1="${box.y0}" x2="${AX.x0}" y2="${box.y1}"/>`);
        out.push(`<text class="axis-title" x="${AX.x0}" y="${box.y1 - 8}">${title}</text>`);
        if (yLabel) out.push(`<text class="axis-title" x="${(AX.x0 + AX.x1) / 2}" y="${box.y0 + 31}" text-anchor="middle">${yLabel}</text>`);
    }

    // right-hand end labels, fanned so they never sit on one another
    function endTags(out, tags, box) {
        tags.sort((a, b) => a.y - b.y);
        for (let i = 1; i < tags.length; i += 1) {
            if (tags[i].y - tags[i - 1].y < 12) tags[i].y = tags[i - 1].y + 12;
        }
        const spill = tags[tags.length - 1].y - (box.y0 - 2);
        if (spill > 0) tags.forEach(t => { t.y -= spill; });
        tags.forEach(t => out.push(
            `<text class="trend-tag" style="fill:${t.color}" x="${AX.x1 + 6}" y="${t.y.toFixed(1)}">${t.name}</text>`));
    }

    function renderTrend(rows) {
        const span = Math.max(1, history[history.length - 1].d);
        const byKey = Object.fromEntries(rows.map(r => [r.key, r]));
        const out = [];

        axisFrame(out, { ...TOP, ty: tyTop }, [0, 500, 1000], span, '전체와 바다의 물의 양');
        const bMax = smallMax();
        axisFrame(out, { ...BOT, ty: v => tyBot(v, bMax) }, [0, bMax / 2, bMax], span,
            '공기와 땅의 물 — 눈금을 크게 키운 것', '흐른 날수 (일)');

        if (history.length < 2) {
            out.push(`<text class="trend-empty" x="${(AX.x0 + AX.x1) / 2}" y="${((TOP.y0 + TOP.y1) / 2).toFixed(0)}" text-anchor="middle">순환을 시작하면 물이 어디로 옮겨 가는지 그려집니다.</text>`);
            graphGroup.innerHTML = out.join('');
            return;
        }

        // upper: the total holding flat while the sea barely stirs
        const seaPts = history.map(h => `${tx(h.d, span).toFixed(1)},${tyTop(h.sea).toFixed(1)}`);
        out.push(`<path class="trend" style="stroke:${byKey.sea.color}" d="M${seaPts.join('L')}"/>`);
        const totalPts = history.map(h => `${tx(h.d, span).toFixed(1)},${tyTop(h.sea + h.vapor + h.cloud + h.land).toFixed(1)}`);
        out.push(`<path class="trend-total" d="M${totalPts.join('L')}"/>`);
        endTags(out, [
            { name: '전체', color: '#059669', y: tyTop(total()) },
            { name: byKey.sea.name, color: byKey.sea.color, y: tyTop(R.sea) },
        ], TOP);

        // lower: the three that actually move
        SMALL.forEach(key => {
            const pts = history.map(h => `${tx(h.d, span).toFixed(1)},${tyBot(h[key], bMax).toFixed(1)}`);
            out.push(`<path class="trend" style="stroke:${byKey[key].color}" d="M${pts.join('L')}"/>`);
        });
        endTags(out, SMALL.map(key => ({ name: byKey[key].name, color: byKey[key].color, y: tyBot(R[key], bMax) })), BOT);

        graphGroup.innerHTML = out.join('');
    }

    function renderData(rows) {
        const drift = total() - TOTAL;
        dataNote.innerHTML =
            rows.map(r =>
                `<div class="data-row"><span class="data-name">${r.name}</span>` +
                `<span class="data-val">${Math.round(R[r.key])} (처음 ${INITIAL[r.key]})</span></div>`).join('') +
            `<div class="data-row match"><span class="data-name">네 곳을 더하면</span>` +
            `<span class="data-val">${Math.round(total())} — 처음과 ${Math.abs(drift) < 0.5 ? '똑같습니다' : `${drift.toFixed(1)} 다릅니다`}</span></div>` +
            `<div class="data-row"><span class="data-name">흐른 날수</span><span class="data-val">${days.toFixed(1)}일</span></div>`;
    }

    function frame(now) {
        const t = now / 1000;
        const dt = lastT === null ? 1 / 60 : Math.min(1 / 20, t - lastT);
        lastT = t;
        if (running) advanceSim(dt * DAYS_PER_SECOND);
        render();
        if (running) rafId = requestAnimationFrame(frame);
        else { rafId = null; lastT = null; }
    }

    const RES_NAME = { sea: '바다', vapor: '수증기', cloud: '구름', land: '땅의 물' };
    // 받침이 있으면 '이', 없으면 '가'. 구름이·물이 vs 바다가·수증기가.
    const iga = w => { const c = w.slice(-1).charCodeAt(0);
        const j = (c < 0xac00 || c > 0xd7a3) ? 0 : (c - 0xac00) % 28;
        return `${w}${j > 0 ? '이' : '가'}`; };

    function updateExplanation() {
        const sun = Number(sunRange.value), temp = Number(tempRange.value);
        /* 슬라이더가 1~10이므로 마디도 셋이어야 합니다. 예전에는 둘로만 갈라
           한가운데인 5가 '따뜻해' 쪽으로 떨어졌습니다. */
        const band = v => (v <= 3 ? 0 : v <= 7 ? 1 : 2);
        const sunWord = ['약해 증발이 느리고', '보통이라 증발이 꾸준하고', '강해 증발이 활발하고'][band(sun)];
        const tempWord = ['차가워 수증기가 금세 응결해 구름이 잘 만들어집니다',
                          '알맞아 증발과 응결이 비슷하게 일어납니다',
                          '따뜻해 수증기가 잘 응결하지 않습니다'][band(temp)];
        let s = `햇빛이 ${sunWord}, 공기가 ${tempWord}. `;

        /* 늘 같은 말만 하지 않고, 지금 화면에 찍힌 값에서 무엇이 늘고 줄었는지
           읽어 씁니다. 그래야 막대·그래프와 설명이 어긋나지 않습니다. */
        const moved = Object.keys(RES_NAME).map(k => ({ k, d: R[k] - INITIAL[k] }));
        const up = moved.reduce((a, b) => (b.d > a.d ? b : a));
        const down = moved.reduce((a, b) => (b.d < a.d ? b : a));
        if (days >= 1 && up.d >= 1) {
            s += `${Math.round(days)}일 동안 ${iga(RES_NAME[down.k])} ${Math.round(-down.d)}만큼 줄고 ` +
                 `${iga(RES_NAME[up.k])} ${Math.round(up.d)}만큼 늘었습니다. `;
        }
        s += '옮겨 다니기만 할 뿐, 물의 총량은 그대로입니다.';
        explanation.textContent = s;
    }

    runBtn.addEventListener('click', () => {
        running = !running;
        runBtn.textContent = running ? '순환 멈춤' : '순환 시작';
        if (running) {
            resultEmpty.hidden = true;
            resultContent.hidden = false;
            predictionResult.textContent = !prediction
                ? '다음에는 결과를 먼저 예상해 보세요.'
                : prediction === 'same' ? '예상이 맞았습니다.' : '예상과 다른 결과입니다. 물의 총량은 변하지 않습니다.';
            updateExplanation();
            stageCaption.textContent = '증발한 물이 구름이 되었다가 비로 내려 다시 돌아옵니다.';
            if (rafId === null) { lastT = null; rafId = requestAnimationFrame(frame); }
        } else {
            stageCaption.textContent = '순환을 멈추었습니다. 각 곳에 나뉜 물의 양을 살펴보세요.';
        }
        render();
    });

    resetBtn.addEventListener('click', () => {
        running = false;
        R = { ...INITIAL };
        days = 0;
        resetHistory();
        if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; lastT = null; }
        runBtn.textContent = '순환 시작';
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        stageCaption.textContent = '햇빛과 기온을 정하고 순환을 시작해 보세요.';
        render();
    });

    [sunRange, tempRange].forEach(el => el.addEventListener('input', () => {
        sunOutput.textContent = sunRange.value;
        tempOutput.textContent = tempRange.value;
        if (!resultContent.hidden) updateExplanation();
        render();
    }));
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        running = false;
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = null; lastT = null; runBtn.textContent = '순환 시작';
        prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));

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

    window.__cycleModel = {
        TOTAL, INITIAL, DT, advanceSim, render,
        reservoirs: () => ({ ...R }),
        total, days: () => days,
        setSun(v) { sunRange.value = String(v); sunRange.dispatchEvent(new Event('input')); },
        setTemp(v) { tempRange.value = String(v); tempRange.dispatchEvent(new Event('input')); },
        reset: () => resetBtn.click(),
    };

    buildBeams();
    resetBtn.click();
});
