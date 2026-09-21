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
    // Bread mould: how many days until half the slice is covered, by temperature
    // and by whether the bread is damp. Cold or dry pushes it almost out of reach.
    const TEMPS = {
        cold: { label: '냉장고 4 ℃', temp: 4, halfDays: 9 },
        room: { label: '실온 20 ℃', temp: 20, halfDays: 5.2 },
        warm: { label: '따뜻한 곳 30 ℃', temp: 30, halfDays: 3.0 },
    };
    const MOIST = {
        damp: { label: '축축한 빵', extraDays: 0 },
        dry: { label: '바짝 마른 빵', extraDays: 14 },
    };
    const MOULD_DAYS = 7, MOULD_MAX = 0.9, MOULD_K = 1.25;
    const coverage = (t, halfDays) => {
        const logistic = x => MOULD_MAX / (1 + Math.exp(-MOULD_K * (x - halfDays)));
        return Math.max(0, logistic(t) - logistic(0));
    };

    // Bacteria: minutes between one splitting into two, by temperature
    const GERM_TEMPS = {
        cold: { label: '냉장고 4 ℃', temp: 4, minutes: 360 },
        room: { label: '실온 25 ℃', temp: 25, minutes: 60 },
        warm: { label: '따뜻한 곳 37 ℃', temp: 37, minutes: 20 },
    };
    const HOURS = [2, 4, 6];
    const germCount = (start, hours, minutes) => start * Math.pow(2, Math.floor((hours * 60) / minutes + 1e-9));

    const state = {
        mode: 'mould',
        temp: 'warm', moist: 'damp',
        gtemp: 'warm', hours: 4,
        progress: 0, prediction: null,
    };
    let running = false, frameId = 0, lastStamp = 0;

    // fixed spots so the mould always sprouts in the same places
    const SPOTS = [[0.18, 0.3], [0.62, 0.22], [0.4, 0.7], [0.8, 0.62], [0.3, 0.5], [0.72, 0.4], [0.15, 0.78], [0.55, 0.48], [0.88, 0.85], [0.45, 0.15], [0.68, 0.82], [0.25, 0.12]];

    /* ------------------------------------------------------------ models */
    function analyseMould(s = state) {
        const t = TEMPS[s.temp], m = MOIST[s.moist];
        const halfDays = t.halfDays + m.extraDays;
        const finalCover = coverage(MOULD_DAYS, halfDays);
        const verdict = finalCover >= 0.4 ? 'lots' : finalCover >= 0.05 ? 'some' : 'none';
        // the day the mould first covers a tenth of the slice, if it ever does
        let firstDay = null;
        for (let d = 0; d <= MOULD_DAYS; d += 0.25) if (coverage(d, halfDays) >= 0.1) { firstDay = d; break; }
        return { kind: 'mould', t, m, halfDays, finalCover, verdict, firstDay, coverAt: day => coverage(day, halfDays) };
    }

    function analyseGerm(s = state) {
        const t = GERM_TEMPS[s.gtemp];
        const splits = Math.floor((s.hours * 60) / t.minutes + 1e-9);
        const final = germCount(1, s.hours, t.minutes);
        const verdict = final >= 1000 ? 'huge' : final > 2 ? 'tens' : 'double';
        return { kind: 'germ', t, hours: s.hours, splits, final, verdict, countAt: h => germCount(1, h, t.minutes) };
    }

    const analyse = () => (state.mode === 'mould' ? analyseMould() : analyseGerm());

    /* ---------------------------------------------------------- controls */
    function pickRow(legend, name, options, current, cols) {
        return `<fieldset class="pick-field"><legend>${legend}</legend>` +
            `<div class="pick-buttons cols${cols}" data-pick="${name}">` +
            options.map(o => `<button type="button" data-value="${o.value}" class="${o.value === String(current) ? 'selected' : ''}">` +
                `${o.label}${o.hint ? `<small>${o.hint}</small>` : ''}</button>`).join('') +
            `</div></fieldset>`;
    }

    function buildControls() {
        if (state.mode === 'mould') {
            controlArea.innerHTML =
                pickRow('빵을 둘 곳', 'temp', Object.entries(TEMPS).map(([k, v]) => ({ value: k, label: v.label })), state.temp, 3) +
                pickRow('빵의 물기', 'moist', Object.entries(MOIST).map(([k, v]) => ({ value: k, label: v.label })), state.moist, 2);
        } else {
            controlArea.innerHTML =
                pickRow('세균을 둘 곳', 'gtemp', Object.entries(GERM_TEMPS).map(([k, v]) => ({ value: k, label: v.label, hint: `${v.minutes >= 60 ? `${v.minutes / 60}시간` : `${v.minutes}분`}마다 둘로` })), state.gtemp, 3) +
                pickRow('기르는 시간', 'hours', HOURS.map(h => ({ value: String(h), label: `${h}시간` })), state.hours, 3);
        }
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                const v = button.dataset.value;
                state[group.dataset.pick] = group.dataset.pick === 'hours' ? Number(v) : v;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                if (group.dataset.pick === 'hours') buildPrediction();
                settingsChanged();
            }));
        });
    }

    const PRED_MOULD = [{ value: 'lots', label: '많이 자란다' }, { value: 'some', label: '조금 자란다' }, { value: 'none', label: '거의 안 자란다' }];
    const PRED_GERM = [{ value: 'double', label: '2배 안팎' }, { value: 'tens', label: '몇 배에서 수십 배' }, { value: 'huge', label: '수천 배 넘게' }];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list = state.mode === 'mould' ? PRED_MOULD : PRED_GERM;
        predictionLegend.textContent = state.mode === 'mould' ? `${MOULD_DAYS}일 뒤 곰팡이는 어떻게 될까요?` : `${state.hours}시간 뒤 세균은 몇 배가 될까요?`;
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    const fmtCount = n => (n >= 10000 ? `약 ${Math.round(n / 10000)}만` : n >= 1000 ? `약 ${Math.round(n / 100) * 100}` : `${Math.round(n)}`);

    function renderMould(a, p) {
        const day = p * MOULD_DAYS;
        const cover = a.coverAt(day);
        const BX = 40, BY = 48, BW = 210, BH = 140;
        let out = `<rect class="tray-dish" x="${BX - 14}" y="${BY - 12}" width="${BW + 28}" height="${BH + 24}" rx="10"/>`;
        out += `<path class="bread" d="M${BX + 10},${BY + 26} Q${BX},${BY} ${BX + 38},${BY + 4} Q${BX + BW / 2},${BY - 10} ${BX + BW - 38},${BY + 4} Q${BX + BW},${BY} ${BX + BW - 10},${BY + 26} L${BX + BW - 4},${BY + BH - 8} Q${BX + BW - 4},${BY + BH} ${BX + BW - 12},${BY + BH} L${BX + 12},${BY + BH} Q${BX + 4},${BY + BH} ${BX + 4},${BY + BH - 8} Z"/>`;
        [[0.3, 0.45, 6], [0.62, 0.66, 5], [0.5, 0.3, 4], [0.78, 0.35, 4], [0.2, 0.75, 4]].forEach(([fx, fy, r]) => {
            out += `<circle class="bread-hole" cx="${(BX + fx * BW).toFixed(1)}" cy="${(BY + 20 + fy * (BH - 30)).toFixed(1)}" r="${r}"/>`;
        });
        // each spot takes an equal share of the covered area
        if (cover > 0.002) {
            const area = cover * BW * (BH - 20);
            const r = Math.sqrt(area / SPOTS.length / Math.PI);
            SPOTS.forEach(([fx, fy], i) => {
                const cx = BX + 12 + fx * (BW - 24), cy = BY + 24 + fy * (BH - 40);
                const rr = r * (0.8 + 0.4 * ((i * 7) % 5) / 4);
                out += `<circle class="mould-fuzz" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(rr * 1.25).toFixed(1)}"/>`;
                out += `<circle class="mould" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${rr.toFixed(1)}"/>`;
                out += `<circle class="mould-core" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(rr * 0.45).toFixed(1)}"/>`;
            });
        }
        out += `<text class="day-text" x="${BX - 8}" y="${BY - 14}">${Math.floor(day) === 0 && p < 0.02 ? '빵을 놓은 날' : `${Math.min(MOULD_DAYS, Math.floor(day) + (p >= 1 ? 0 : 1))}일째`}</text>`;
        // condition and readings on the right
        out += `<text class="cond-text" x="290" y="60">${a.t.label}</text>`;
        out += `<text class="cond-text" x="290" y="76">${a.m.label}</text>`;
        out += `<text class="part-label" x="290" y="108">곰팡이가 덮은 넓이</text>`;
        out += `<text class="read-text" x="290" y="130">빵의 ${Math.round(cover * 100)} %</text>`;
        out += `<text class="note-text" x="290" y="156">${cover < 0.01 ? '아직 보이지 않습니다' : cover < 0.1 ? '작은 점들이 생겼습니다' : cover < 0.4 ? '군데군데 퍼졌습니다' : '거의 다 덮였습니다'}</text>`;
        const VERD = { lots: '많이 자란다', some: '조금 자란다', none: '거의 안 자란다' };
        out += `<text class="verdict-text" fill="#9fc98a" x="20" y="16">${a.t.label} · ${a.m.label} → ${MOULD_DAYS}일 뒤 ${VERD[a.verdict]}</text>`;
        return out;
    }

    function renderGerm(a, p) {
        const h = p * a.hours;
        const n = a.countAt(h);
        const CX = 150, CY = 118, R = 74;
        let out = `<circle class="dish" cx="${CX}" cy="${CY}" r="${R}"/>`;
        // draw them one by one up to a few hundred; past that the number tells the story
        const shown = Math.min(400, Math.round(n));
        const golden = 2.399963;
        for (let i = 0; i < shown; i += 1) {
            const rr = (R - 8) * Math.sqrt((i + 0.5) / Math.max(shown, 40));
            const ang = i * golden;
            out += `<ellipse class="germ" cx="${(CX + rr * Math.cos(ang)).toFixed(1)}" cy="${(CY + rr * Math.sin(ang)).toFixed(1)}" rx="3.2" ry="1.8" transform="rotate(${((ang * 57.3) % 180).toFixed(0)} ${(CX + rr * Math.cos(ang)).toFixed(1)} ${(CY + rr * Math.sin(ang)).toFixed(1)})"/>`;
        }
        if (n > 400) out += `<text class="small-label" x="${CX}" y="${CY + R + 16}" text-anchor="middle">너무 많아 400마리까지만 그렸습니다</text>`;
        out += `<text class="cond-text" x="270" y="60">${a.t.label}</text>`;
        out += `<text class="cond-text" x="270" y="76">${a.t.minutes >= 60 ? `${a.t.minutes / 60}시간` : `${a.t.minutes}분`}마다 한 번 둘로 나뉨</text>`;
        out += `<text class="part-label" x="270" y="104">지난 시간</text>`;
        out += `<text class="read-text" x="270" y="122">${Math.floor(h)}시간 ${Math.round((h % 1) * 60).toString().padStart(2, '0')}분</text>`;
        out += `<text class="part-label" x="270" y="148">세균 수</text>`;
        out += `<text class="count-text" x="270" y="172">${fmtCount(n)}마리</text>`;
        out += `<text class="note-text" x="270" y="190">${Math.floor(h * 60 / a.t.minutes)}번 나뉨 · 1마리에서 시작</text>`;
        const VERD = { double: '2배 안팎', tens: '몇 배에서 수십 배', huge: '수천 배 넘게' };
        out += `<text class="verdict-text" fill="#ea580c" x="20" y="16">${a.t.label} · ${a.hours}시간 → ${VERD[a.verdict]} 늘어난다</text>`;
        return out;
    }

    function renderMain(a) {
        mainGroup.innerHTML = a.kind === 'mould' ? renderMould(a, state.progress) : renderGerm(a, state.progress);
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

    // covered share against days, the chosen place solid and the other two places dashed
    function graphMould(a) {
        const day = state.progress * MOULD_DAYS;
        const gx = d => GRAPH.x0 + (d / MOULD_DAYS) * (GRAPH.x1 - GRAPH.x0);
        const gy = f => GRAPH.y0 - f * (GRAPH.y0 - GRAPH.y1);
        let out = graphFrame(
            [0, 1, 2, 3, 4, 5, 6, 7].map(d => [d, gx(d)]),
            [[0, gy(0)], ['25 %', gy(0.25)], ['50 %', gy(0.5)], ['75 %', gy(0.75)], ['100 %', gy(1)]],
            '빵을 놓은 뒤 지난 날', '곰팡이가 덮은 넓이');
        const colours = { cold: '#0284c7', room: '#d97706', warm: '#ea580c' };
        const line = (halfDays, upTo, cls, colour) => {
            const pts = [];
            for (let d = 0; d <= upTo + 1e-9; d += 0.1) pts.push(`${gx(d).toFixed(1)},${gy(coverage(d, halfDays)).toFixed(1)}`);
            return pts.length > 1 ? `<path class="${cls}" style="stroke:${colour}" d="M${pts.join('L')}"/>` : '';
        };
        const others = Object.entries(TEMPS).filter(([k]) => k !== state.temp);
        others.forEach(([k, t]) => { out += line(t.halfDays + a.m.extraDays, MOULD_DAYS, 'trace other', colours[k]); });
        out += line(a.halfDays, day, 'trace', colours[state.temp]);
        out += `<circle class="trace-dot" cx="${gx(day).toFixed(1)}" cy="${gy(a.coverAt(day)).toFixed(1)}" r="5" fill="${colours[state.temp]}"/>`;
        // a legend row, since the curves can end on top of one another
        out += `<text class="axis-text" style="fill:${colours[state.temp]}" x="${GRAPH.x0 + 8}" y="${GRAPH.y1 + 14}">— ${a.t.temp} ℃ (이 빵)</text>`;
        others.forEach(([k, t], i) => {
            out += `<text class="axis-text" style="fill:${colours[k]}" x="${GRAPH.x0 + 100 + i * 78}" y="${GRAPH.y1 + 14}">- - ${t.temp} ℃</text>`;
        });
        out += `<text class="note-text" x="${GRAPH.x0 + 262}" y="${GRAPH.y1 + 14}">점선: 같은 빵, 다른 온도</text>`;
        return out;
    }

    // count against hours: doubling makes the curve shoot up at the end
    function graphGerm(a) {
        const h = state.progress * a.hours;
        const yMax = Math.max(16, a.final);
        const gx = t => GRAPH.x0 + (t / a.hours) * (GRAPH.x1 - GRAPH.x0);
        const gy = n => GRAPH.y0 - (n / yMax) * (GRAPH.y0 - GRAPH.y1);
        const ticks = [0, 0.25, 0.5, 0.75, 1].map(f => [fmtCount(f * yMax), gy(f * yMax)]);
        let out = graphFrame(
            Array.from({ length: a.hours + 1 }, (_, i) => [i, gx(i)]),
            ticks, '지난 시간 (시간)', '세균 수 (마리)');
        const pts = [];
        for (let t = 0; t <= h + 1e-9; t += a.hours / 200) pts.push(`${gx(t).toFixed(1)},${gy(a.countAt(t)).toFixed(1)}`);
        const done = [];
        for (let t = 0; t <= a.hours + 1e-9; t += a.hours / 200) done.push(`${gx(t).toFixed(1)},${gy(a.countAt(t)).toFixed(1)}`);
        out += `<path class="trace-done" d="M${done.join('L')}"/>`;
        if (pts.length > 1) out += `<path class="trace" style="stroke:#ea580c" d="M${pts.join('L')}"/>`;
        out += `<circle class="trace-dot" cx="${gx(h).toFixed(1)}" cy="${gy(a.countAt(h)).toFixed(1)}" r="5" fill="#ea580c"/>`;
        // the halfway mark shows how little has happened by then
        const half = a.countAt(a.hours / 2);
        out += `<text class="note-text" x="${GRAPH.x0 + 8}" y="${GRAPH.y1 + 14}">절반인 ${a.hours / 2}시간 때는 ${fmtCount(half)}마리 — 늘어난 것이 거의 끝에 몰립니다</text>`;
        return out;
    }

    function noteFor(a) {
        if (a.kind === 'mould') {
            const day = state.progress * MOULD_DAYS;
            return `<div class="data-row"><span class="data-name">둔 곳</span><span class="data-val">${a.t.label} · ${a.m.label}</span></div>` +
                `<div class="data-row"><span class="data-name">지금</span><span class="data-val">${day.toFixed(1)}일째 · 빵의 ${Math.round(a.coverAt(day) * 100)} %</span></div>` +
                `<div class="data-row"><span class="data-name">눈에 띄는 날</span><span class="data-val">${a.firstDay === null ? `${MOULD_DAYS}일 안에는 잘 보이지 않음` : `${a.firstDay.toFixed(1)}일째부터 (빵의 10 %)`}</span></div>` +
                `<div class="data-row match"><span class="data-name">${MOULD_DAYS}일 뒤</span><span class="data-val">빵의 ${Math.round(a.finalCover * 100)} %</span></div>`;
        }
        const h = state.progress * a.hours;
        const rows = [];
        for (let k = 0; k <= Math.min(a.splits, 6); k += 1) rows.push(`${Math.pow(2, k)}`);
        return `<div class="data-row"><span class="data-name">둔 곳</span><span class="data-val">${a.t.label} · ${a.t.minutes >= 60 ? `${a.t.minutes / 60}시간` : `${a.t.minutes}분`}마다 둘로</span></div>` +
            `<div class="data-row"><span class="data-name">나뉜 차례</span><span class="data-val">${rows.join(' → ')}${a.splits > 6 ? ' → …' : ''} 마리</span></div>` +
            `<div class="data-row"><span class="data-name">지금</span><span class="data-val">${h.toFixed(1)}시간 · ${fmtCount(a.countAt(h))}마리</span></div>` +
            `<div class="data-row match"><span class="data-name">${a.hours}시간 뒤</span><span class="data-val">${a.splits}번 나뉘어 ${fmtCount(a.final)}마리 (처음의 ${fmtCount(a.final)}배)</span></div>`;
    }

    function render() {
        const a = analyse();
        renderMain(a);
        graphGroup.innerHTML = a.kind === 'mould' ? graphMould(a) : graphGerm(a);
        stageBadge.textContent = a.kind === 'mould' ? `${a.t.temp} ℃ · ${a.m.label}` : `${a.t.temp} ℃ · ${a.hours}시간`;
        methodHint.textContent = state.mode === 'mould'
            ? '곰팡이는 따뜻하고 축축한 곳에서 잘 자랍니다'
            : '세균은 둘로 나뉘어 늘어나고, 따뜻할수록 빨리 나뉩니다';
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
        if (a.kind === 'mould') {
            labelA.textContent = `${MOULD_DAYS}일 뒤`; labelB.textContent = '눈에 띈 날';
            valueA.textContent = `빵의 ${Math.round(a.finalCover * 100)} %`;
            valueB.textContent = a.firstDay === null ? '보이지 않음' : `${Math.ceil(a.firstDay)}일째`;
            predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
                : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
            let s = `${a.t.label}에 둔 ${a.m.label}은 ${MOULD_DAYS}일 뒤 곰팡이가 빵의 ${Math.round(a.finalCover * 100)} %를 덮었습니다. `;
            if (a.verdict === 'lots') s += `따뜻하고 축축해서 곰팡이가 자라기 딱 좋은 조건입니다. ${Math.ceil(a.firstDay)}일째부터 점이 보이더니 며칠 만에 빵을 거의 다 덮었습니다.`;
            else if (a.verdict === 'some') s += `물기는 있지만 온도가 낮아 곰팡이가 천천히 자랍니다. 같은 빵을 따뜻한 곳에 두면 훨씬 빨리 퍼집니다.`;
            else if (state.moist === 'dry') s += `물기가 없으면 온도가 알맞아도 곰팡이가 거의 자라지 못합니다. 그래서 음식을 말려 보관합니다.`;
            else s += `냉장고처럼 차가운 곳에서는 곰팡이가 아주 느리게 자라 ${MOULD_DAYS}일이 지나도 거의 보이지 않습니다. 그래서 음식을 냉장고에 넣어 둡니다.`;
            explanation.textContent = s;
            return;
        }
        labelA.textContent = `${a.hours}시간 뒤`; labelB.textContent = '나뉜 횟수';
        valueA.textContent = `${fmtCount(a.final)}마리`;
        valueB.textContent = `${a.splits}번`;
        predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        const every = a.t.minutes >= 60 ? `${a.t.minutes / 60}시간` : `${a.t.minutes}분`;
        let s = `${a.t.label}에서는 세균이 ${every}마다 둘로 나뉩니다. ` +
            (a.splits === 0 ? `${a.hours}시간 동안은 아직 한 번도 나뉘지 못해 그대로 1마리입니다. `
                : `${a.hours}시간 동안 ${a.splits}번 나뉘어 1마리가 ${fmtCount(a.final)}마리가 되었습니다. `);
        if (a.verdict === 'huge') s += `나뉠 때마다 2배가 되기 때문에 처음에는 조금 늘다가 뒤로 갈수록 엄청나게 불어납니다. 따뜻한 곳에 둔 음식이 금방 상하는 까닭입니다.`;
        else if (a.verdict === 'tens') s += `나뉠 때마다 2배가 되니 ${a.splits}번이면 ${fmtCount(a.final)}배입니다. 더 따뜻한 곳에 두거나 더 오래 두면 훨씬 많아집니다.`;
        else s += `차가운 곳에서는 나뉘는 데 아주 오래 걸려 몇 시간이 지나도 거의 늘지 않습니다. 세균이 죽는 것은 아니어서, 냉장고 속 음식도 오래 두면 상합니다.`;
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
        stageCaption.textContent = state.mode === 'mould'
            ? '날이 갈수록 빵 위에 곰팡이가 얼마나 퍼지는지 보세요.'
            : '세균이 둘로 나뉠 때마다 수가 2배가 되는 것을 보세요.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { temp: 'warm', moist: 'damp', gtemp: 'warm', hours: 4, progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'mould').click();
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

    window.__microbeModel = {
        TEMPS, MOIST, GERM_TEMPS, HOURS, MOULD_DAYS, state,
        analyseMould, analyseGerm, analyse, coverage, germCount, render,
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
