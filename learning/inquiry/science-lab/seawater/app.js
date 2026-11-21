document.addEventListener('DOMContentLoaded', () => {
    const placeButtons = [...document.querySelectorAll('[data-place]')];
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const tempRange = document.getElementById('tempRange');
    const saltRange = document.getElementById('saltRange');
    const windRange = document.getElementById('windRange');
    const tempOutput = document.getElementById('tempOutput');
    const saltOutput = document.getElementById('saltOutput');
    const windOutput = document.getElementById('windOutput');
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

    // The usual straight-line stand-in for how sea water density depends on
    // temperature and salt: colder is heavier, saltier is heavier.
    const RHO0 = 1027, T0 = 10, S0 = 35;
    const ALPHA = 1.7e-4;     // per degree
    const BETA = 7.6e-4;      // per psu
    const MEAN_RHO = 1026;    // what we compare against
    const DEEP_T = 4, THERMO_M = 400, MAX_DEPTH = 1000;
    const SEA = { x0: 64, x1: 244, top: 50, bottom: 206 };
    // the cut-open column shows the top 600 m so the thin stirred layer is visible
    const DRAW_DEPTH = 600;
    const PX_PER_M = (SEA.bottom - SEA.top) / DRAW_DEPTH;
    // depth runs downward, so the temperature axis sits along the top
    const GRAPH = { x0: 74, x1: 424, y0: 172, y1: 52 };

    // Whatever the total salinity, the salts keep these proportions.
    const SALTS = [
        { n: '염화 나트륨', pct: 77.7, c: '#cbd5e1' },
        { n: '염화 마그네슘', pct: 10.9, c: '#8fd0c0' },
        { n: '황산 마그네슘', pct: 4.7, c: '#7fb8e8' },
        { n: '황산 칼슘', pct: 3.6, c: '#c9a8e0' },
        { n: '기타', pct: 3.1, c: '#b8a888' },
    ];
    const PLACES = {
        equator: { label: '적도', temp: 28, salt: 34, wind: 3, why: '비가 많이 내려 염분이 조금 낮습니다' },
        // 바람은 중위도(편서풍)가 가장 세서 혼합층이 가장 두껍고, 극지방은 표층과
        // 심해의 수온 차가 작아 층상 구조가 뚜렷하지 않다(교과서의 위도별 연직 구조).
        middle: { label: '중위도', temp: 18, salt: 36, wind: 7, why: '증발이 활발해 염분이 높습니다' },
        polar: { label: '극지방', temp: 2, salt: 33, wind: 5, why: '얼음이 녹아 염분이 낮지만 아주 차갑습니다' },
    };

    let place = 'middle';
    let prediction = null;

    const temp = () => Number(tempRange.value);
    const salt = () => Number(saltRange.value);
    const wind = () => Number(windRange.value);

    function analyse(T = temp(), S = salt(), W = wind()) {
        const rho = RHO0 * (1 - ALPHA * (T - T0) + BETA * (S - S0));
        const mixed = 20 + 8 * W;                       // metres the wind can stir
        const verdict = S > 35 ? 'heavier' : S < 35 ? 'lighter' : 'same';
        // A thermocline needs a warm surface over cold deep water. Where the
        // surface is already as cold, the column is even or slightly inverted.
        const thermo = T - DEEP_T > 2 ? 'normal' : DEEP_T - T > 2 ? 'inverse' : 'weak';
        const grams = SALTS.map(s => (S * s.pct) / 100);
        return { T, S, W, rho, mixed, verdict, thermo, grams, place: PLACES[place] };
    }

    // Temperature at any depth: stirred on top, falling away below, steady deep down.
    function tempAt(z, a) {
        if (z <= a.mixed) return a.T;
        if (z >= a.mixed + THERMO_M) return DEEP_T;
        return a.T + (DEEP_T - a.T) * ((z - a.mixed) / THERMO_M);
    }

    const dy = m => SEA.top + m * PX_PER_M;
    // anim: 0..1 while the wind blows after 결과 보기 (1 = settled), phase: wave/swirl clock
    const view = { anim: 1, phase: 0, revealed: false, blowing: false };
    const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    function wavePath(amp, phase, x0, x1, y, bottom) {
        let d = `M${x0},${bottom} L${x0},${(y + amp * Math.sin(phase)).toFixed(1)}`;
        for (let x = x0 + 4; x <= x1; x += 4) d += ` L${x},${(y + amp * Math.sin((x - x0) / 26 * Math.PI * 2 - phase)).toFixed(1)}`;
        return d + ` L${x1},${bottom} Z`;
    }

    function renderMain(a) {
        const k = view.anim, ph = view.phase;
        // while the wind starts to blow the stirred layer deepens from the surface
        const mixedNow = a.W === 0 ? a.mixed : a.mixed * (k < 1 ? Math.min(1, 0.15 + k * 1.1) : 1);
        const thermoEnd = Math.min(DRAW_DEPTH, a.mixed + THERMO_M);
        const amp = a.W === 0 ? 0.4 : 0.8 + a.W * 0.42;
        let out = '';
        // sky
        out += `<rect x="${SEA.x0}" y="6" width="${SEA.x1 - SEA.x0}" height="${SEA.top - 6}" fill="#e0f2fe"/>`;
        // water body under a wavy surface, layers drawn as bands inside
        let body = `<path d="${wavePath(amp, ph, SEA.x0, SEA.x1, SEA.top, SEA.bottom)}" fill="#bfe3f5"/>`;
        body += `<rect class="layer-thermo" x="${SEA.x0}" y="${dy(mixedNow).toFixed(1)}" width="${SEA.x1 - SEA.x0}" height="${(dy(thermoEnd) - dy(mixedNow)).toFixed(1)}" fill="${a.thermo === 'normal' ? 'url(#seaThermo)' : '#7fa9cf'}"/>`;
        body += `<rect class="layer-deep" x="${SEA.x0}" y="${dy(thermoEnd).toFixed(1)}" width="${SEA.x1 - SEA.x0}" height="${(SEA.bottom - dy(thermoEnd)).toFixed(1)}"/>`;
        // swirls stirring the top layer, turning while the wind blows
        const mixPx = dy(mixedNow) - SEA.top;
        if (a.W > 0 && mixPx > 7) {
            const r = Math.min(15, mixPx * 0.42), n = Math.max(2, Math.min(5, Math.round(a.W / 2) + 1));
            const gap = (SEA.x1 - SEA.x0) / n;
            for (let i = 0; i < n; i += 1) {
                const cx = SEA.x0 + gap * (i + 0.5), cy = SEA.top + mixPx / 2 + 2;
                const rot = (ph * 70 * (i % 2 ? -1 : 1)) % 360;
                body += `<g transform="rotate(${rot.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})"><path class="swirl" d="M${(cx - r).toFixed(1)},${cy.toFixed(1)} a${r.toFixed(1)},${r.toFixed(1)} 0 1 1 ${(r * 0.8).toFixed(1)},${(r * 0.6).toFixed(1)}"/>` +
                    `<path class="swirl-head" d="M${(cx - r * 0.2).toFixed(1)},${(cy + r * 0.6).toFixed(1)} l-4,-4 m4,4 l-5,1"/></g>`;
            }
        }
        out += `<g clip-path="url(#seaClip)">${body}</g>`;
        out += `<rect class="sea-frame" x="${SEA.x0}" y="6" width="${SEA.x1 - SEA.x0}" height="${SEA.bottom - 6}"/>`;
        [mixedNow, thermoEnd].forEach(m => {
            out += `<line class="layer-line" x1="${SEA.x0}" y1="${dy(m).toFixed(1)}" x2="${SEA.x1}" y2="${dy(m).toFixed(1)}"/>`;
        });
        // depth scale on the left
        [0, 300, 600].forEach(m => {
            out += `<line class="tick" x1="${SEA.x0 - 5}" y1="${dy(m).toFixed(1)}" x2="${SEA.x0}" y2="${dy(m).toFixed(1)}"/>`;
            out += `<text class="depth-text" x="${SEA.x0 - 8}" y="${(dy(m) + 5).toFixed(1)}" text-anchor="end">${m} m</text>`;
        });
        // layer names on the right, each with a short leader to the middle of its band
        const LX = SEA.x1 + 26;
        const mids = [(SEA.top + dy(mixedNow)) / 2, (dy(mixedNow) + dy(thermoEnd)) / 2, (dy(thermoEnd) + SEA.bottom) / 2];
        const ys = [];
        mids.forEach((m, i) => { ys[i] = Math.max(m + 5, i ? ys[i - 1] + 22 : SEA.top + 6); });
        if (ys[2] > SEA.bottom) { ys[2] = SEA.bottom; ys[1] = Math.min(ys[1], ys[2] - 22); }
        [`혼합층 ${Math.round(mixedNow)} m`, THERMO_NAME[a.thermo], `심해층 ${DEEP_T} ℃`].forEach((name, i) => {
            out += `<path class="leader" d="M${SEA.x1 - 6},${mids[i].toFixed(1)} L${SEA.x1 + 8},${mids[i].toFixed(1)} L${LX - 4},${(ys[i] - 5).toFixed(1)}"/>`;
            out += `<text class="layer-name" x="${LX}" y="${ys[i].toFixed(1)}">${name}</text>`;
        });
        // wind over the water: arrows slide along while it blows
        if (a.W === 0) out += `<text class="small-label" x="${SEA.x0 + 8}" y="30">바람 없음</text>`;
        else {
            const rows = a.W > 6 ? 3 : a.W > 2 ? 2 : 1, len = 18 + a.W * 2.2;
            const shift = view.blowing ? (ph * 22) % 60 : 0;
            for (let r = 0; r < rows; r += 1) {
                const y = 18 + r * 11;
                for (let x = SEA.x0 - 60 + shift + r * 20; x < SEA.x1; x += 60) {
                    const x1 = Math.max(SEA.x0 + 2, x), x2 = Math.min(SEA.x1 - 4, x + len);
                    if (x2 - x1 < 8) continue;
                    out += `<line class="wind-arrow" x1="${x1.toFixed(1)}" y1="${y}" x2="${x2.toFixed(1)}" y2="${y}"/>`;
                    if (x2 === x + len) out += `<path class="wind-arrow" d="M${(x2 - 6).toFixed(1)},${y - 4} L${x2.toFixed(1)},${y} L${(x2 - 6).toFixed(1)},${y + 4}"/>`;
                }
            }
        }

        // the salts in 1 kg of this water, on a ruler with the 35 g standard
        const PX0 = 20, PX1 = 440, BY = 246, gx = g => PX0 + g / 40 * (PX1 - PX0);
        const fill = view.revealed ? (k < 1 ? Math.min(1, k * 1.25) : 1) : 0;
        out += `<text class="part-label" x="${PX0}" y="${BY - 14}">바닷물 1 kg에 녹은 염류${view.revealed && fill >= 1 ? ` ${a.S} g` : ''}</text>`;
        out += `<rect x="${PX0}" y="${BY}" width="${PX1 - PX0}" height="20" rx="3" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/>`;
        let cursor = PX0;
        SALTS.forEach((sl, i) => {
            const w = gx(a.grams[i] * fill) - PX0;
            if (w > 0.3) out += `<rect class="salt-seg" x="${cursor.toFixed(1)}" y="${BY}" width="${w.toFixed(1)}" height="20" fill="${sl.c}"/>`;
            cursor += w;
        });
        [0, 10, 20, 30, 40].forEach(g => {
            out += `<line class="tick" x1="${gx(g).toFixed(1)}" y1="${BY + 20}" x2="${gx(g).toFixed(1)}" y2="${BY + 25}"/><text class="axis-text" x="${gx(g).toFixed(1)}" y="${BY + 38}" text-anchor="middle">${g} g</text>`;
        });
        out += `<line class="standard-line" x1="${gx(35).toFixed(1)}" y1="${BY - 6}" x2="${gx(35).toFixed(1)}" y2="${BY + 26}"/>`;
        out += `<text class="standard-text" x="${gx(35).toFixed(1)}" y="${BY - 14}" text-anchor="middle">기준 35 g</text>`;
        // legend: name and share always, grams after the result
        SALTS.forEach((sl, i) => {
            const col = i % 2, row = Math.floor(i / 2);
            const x = PX0 + col * 214, y = BY + 58 + row * 20;
            out += `<rect x="${x}" y="${y - 11}" width="12" height="12" rx="2" fill="${sl.c}" stroke="rgba(15,23,42,.35)" stroke-width=".8"/>`;
            out += `<text class="salt-text" x="${x + 18}" y="${y}">${sl.n} ${sl.pct} %${view.revealed && fill >= 1 ? ` · ${a.grams[i].toFixed(2)} g` : ''}</text>`;
        });
        window.scienceScene.render(mainGroup,out);
    }

    const VERDICT = { heavier: '평균보다 무거워 가라앉습니다', same: '평균과 비슷해 그대로 있습니다', lighter: '평균보다 가벼워 떠 있습니다' };
    const THERMO_NAME = { normal: '수온 약층', weak: '수온이 거의 일정', inverse: '깊을수록 조금 따뜻해짐' };
    const THERMO_WHY = {
        normal: `그 아래에서 수온이 심해층의 ${DEEP_T} ℃까지 빠르게 떨어지는 수온 약층이 나타납니다. `,
        weak: `표층 수온이 심해층과 비슷해 수온 약층이 뚜렷하게 나타나지 않습니다. `,
        inverse: `표층이 심해층보다 오히려 차가워, 깊어질수록 수온이 조금 올라갑니다. 극지방 바다에서 볼 수 있는 모습입니다. `,
    };
    const SHORT = { heavier: '크다', same: '비슷하다', lighter: '작다' };
    const SENTENCE = { heavier: '커서 아래로 가라앉습니다', same: '비슷해서 그 자리에 머무릅니다', lighter: '작아서 위에 떠 있습니다' };
    // 이/가 after a number depends on the last digit read aloud:
    // 영·일·삼·육·칠·팔 end in a consonant, 이·사·오·구 do not.
    const numIga = s => s + ('013678'.includes(s[s.length - 1]) ? '이' : '가');

    function renderGraph(a) {
        const gx = t => GRAPH.x0 + (t / 30) * (GRAPH.x1 - GRAPH.x0);
        const gy = m => GRAPH.y1 + (m / MAX_DEPTH) * (GRAPH.y0 - GRAPH.y1);
        let out = '';
        [0, 10, 20, 30].forEach(t => {
            out += `<line class="grid-line" x1="${gx(t).toFixed(1)}" y1="${GRAPH.y1}" x2="${gx(t).toFixed(1)}" y2="${GRAPH.y0}"/>`;
            out += `<text class="axis-text" x="${gx(t).toFixed(1)}" y="${GRAPH.y1 - 8}" text-anchor="middle">${t}</text>`;
        });
        [0, 250, 500, 750, 1000].forEach(m => {
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(gy(m) + 3).toFixed(1)}" text-anchor="end">${m}</text>`;
        });
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y1}" x2="${GRAPH.x1}" y2="${GRAPH.y1}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y1}" x2="${GRAPH.x0}" y2="${GRAPH.y0}"/>`;
        out += `<text class="axis-title" x="${((GRAPH.x0 + GRAPH.x1) / 2).toFixed(1)}" y="26" text-anchor="middle">수온 (℃)</text>`;
        out += `<text class="axis-title" x="22" y="26">깊이 (m)</text>`;

        const thermoEnd = Math.min(MAX_DEPTH, a.mixed + THERMO_M);
        [[a.mixed, '혼합층 아래'], [thermoEnd, '심해층 위']].forEach(([m, name]) => {
            out += `<line class="band-line" x1="${GRAPH.x0}" y1="${gy(m).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(m).toFixed(1)}"/>`;
            // a line near the top has no room above it, so its caption drops below
            const ly = gy(m) - 4 < GRAPH.y1 + 12 ? gy(m) + 13 : gy(m) - 4;
            out += `<text class="band-text" x="${GRAPH.x1 - 4}" y="${ly.toFixed(1)}" text-anchor="end">${name} ${Math.round(m)} m</text>`;
        });
        const pts = [];
        for (let m = 0; m <= MAX_DEPTH; m += 5) pts.push(`${gx(tempAt(m, a)).toFixed(1)},${gy(m).toFixed(1)}`);
        out += `<path class="trace" d="M${pts.join('L')}"/>`;
        out += `<circle class="trace-dot" cx="${gx(a.T).toFixed(1)}" cy="${gy(0).toFixed(1)}" r="5" fill="#d97706"/>`;
        window.scienceScene.render(graphGroup,out);
    }

    function render() {
        const a = analyse();
        renderMain(a);
        renderGraph(a);
        tempOutput.textContent = `${a.T} ℃`;
        saltOutput.textContent = `${a.S} psu`;
        windOutput.textContent = `${a.W} 단계`;
        stageBadge.textContent = `${a.place.label} · 염분 ${a.S}`;
        dataNote.hidden = !view.revealed;
        window.scienceScene.render(dataNote, view.revealed ? '<p>염화 나트륨 '+a.grams[0].toFixed(2)+' g · 염화 마그네슘 '+a.grams[1].toFixed(2)+' g · 나머지 '+(a.S-a.grams[0]-a.grams[1]).toFixed(2)+' g. 바람에 따른 층 두께는 이 모형의 예시값입니다.</p>' : '');
        return a;
    }

    // the wind blows for a while: waves run, the top layer is stirred deeper, the salts are weighed
    let frameId = 0;
    function stopAnim() { if (frameId) cancelAnimationFrame(frameId); frameId = 0; view.blowing = false; }
    function blow(then) {
        stopAnim();
        if (reduceMotion()) { view.anim = 1; then(); return; }
        const t0 = performance.now(), DUR = 2600;
        view.anim = 0; view.blowing = true;
        const step = now => {
            const t = Math.min(1, (now - t0) / DUR);
            view.anim = t; view.phase = (now - t0) / 1000 * (1.5 + wind() * 0.35);
            if (t >= 1) { frameId = 0; view.blowing = false; view.anim = 1; then(); return; }
            render();
            frameId = requestAnimationFrame(step);
        };
        frameId = requestAnimationFrame(step);
    }

    function check(animate) {
        view.revealed = true;
        if (animate === true) { blow(() => check(false)); return; }
        const a=render();resultEmpty.hidden=true;resultContent.hidden=false;
        valueA.textContent=a.S+' g';valueB.textContent=a.mixed+' m (모형)';
        predictionResult.textContent=!prediction?'다음에는 먼저 예상해 보세요.':prediction===a.verdict?'예상이 맞았습니다.':'예상과 다른 결과입니다.';
        explanation.textContent='바닷물 1 kg에 녹은 염류의 양은 '+a.S+' g입니다. 염분이 달라도 주된 염류의 구성 비율은 대체로 일정합니다. 바람이 강할수록 표층 물이 깊게 섞일 수 있습니다. '+THERMO_WHY[a.thermo];
    }

    function changed() {
        stopAnim(); view.anim = 1; view.revealed = false;
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        render();
    }

    [tempRange, saltRange, windRange].forEach(el => el.addEventListener('input', () => {
        stopAnim(); view.anim = 1;
        if (!resultContent.hidden) check(false); else { view.revealed = false; render(); }
    }));
    placeButtons.forEach(button => button.addEventListener('click', () => {
        place = button.dataset.place;
        const p = PLACES[place];
        tempRange.value = String(p.temp);
        saltRange.value = String(p.salt);
        windRange.value = String(p.wind);
        placeButtons.forEach(item => item.classList.toggle('selected', item === button));
        changed();
    }));
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
        stopAnim(); view.anim = 1; view.revealed = false; render();
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    checkBtn.addEventListener('click', () => check(true));
    resetBtn.addEventListener('click', () => {
        prediction = null;
        predictionButtons.forEach(item => item.classList.remove('selected'));
        stageCaption.textContent = '바람이 셀수록 섞이는 층이 두꺼워집니다. 염류의 비율은 언제나 그대로입니다.';
        placeButtons.find(b => b.dataset.place === 'middle').click();
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

    window.__seaModel = {
        RHO0, T0, S0, ALPHA, BETA, MEAN_RHO, DEEP_T, THERMO_M, MAX_DEPTH, SALTS, PLACES,
        analyse, tempAt, render, check: () => check(false),
        setPlace(p) { placeButtons.find(b => b.dataset.place === p).click(); },
        setTemp(v) { tempRange.value = String(v); tempRange.dispatchEvent(new Event('input')); },
        setSalt(v) { saltRange.value = String(v); saltRange.dispatchEvent(new Event('input')); },
        setWind(v) { windRange.value = String(v); windRange.dispatchEvent(new Event('input')); },
        getPlace: () => place,
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
