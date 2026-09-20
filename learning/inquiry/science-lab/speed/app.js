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

    const batchim = w => { const c = w.charCodeAt(w.length - 1); return c >= 0xAC00 && c <= 0xD7A3 ? (c - 0xAC00) % 28 !== 0 : false; };
    const iga = w => w + (batchim(w) ? '이' : '가');
    const eun = w => w + (batchim(w) ? '은' : '는');
    const wa = w => w + (batchim(w) ? '과' : '와');

    /* -------------------------------------------------------------- data */
    // Everyday speeds in metres per second.
    const MOVERS = {
        tortoise: { name: '거북', icon: '🐢', speed: 0.3 },
        walker: { name: '걷는 사람', icon: '🚶', speed: 1.2 },
        runner: { name: '달리는 사람', icon: '🏃', speed: 5 },
        bike: { name: '자전거', icon: '🚲', speed: 6 },
        car: { name: '자동차', icon: '🚗', speed: 14 },
        cheetah: { name: '치타', icon: '🐆', speed: 30 },
    };
    const COURSE_M = 100, CLOCK_S = 10;

    const state = {
        mode: 'distance',
        a: 'runner', b: 'bike',
        progress: 0, prediction: null,
    };
    let running = false, frameId = 0, lastStamp = 0;

    /* ------------------------------------------------------------ models */
    function analyse(s = state) {
        const A = MOVERS[s.a], B = MOVERS[s.b];
        const same = Math.abs(A.speed - B.speed) < 1e-9;
        const verdict = same ? 'same' : A.speed > B.speed ? 'a' : 'b';
        if (s.mode === 'distance') {
            const tA = COURSE_M / A.speed, tB = COURSE_M / B.speed;
            // the clock runs until the slower one arrives, but never past three minutes on screen
            const simEnd = Math.max(tA, tB);
            return { kind: 'distance', A, B, tA, tB, simEnd, verdict, same };
        }
        const dA = A.speed * CLOCK_S, dB = B.speed * CLOCK_S;
        return { kind: 'time', A, B, dA, dB, simEnd: CLOCK_S, trackM: Math.max(dA, dB) * 1.08, verdict, same };
    }
    const timeAt = (a, p) => a.simEnd * p;
    const fmtTime = t => (t >= 60 ? `${Math.floor(t / 60)}분 ${(t % 60).toFixed(1)}초` : `${t.toFixed(1)}초`);
    const kmh = v => (v * 3.6).toFixed(1);

    /* ---------------------------------------------------------- controls */
    function pickRow(legend, name, options, current, cols) {
        return `<fieldset class="pick-field"><legend>${legend}</legend>` +
            `<div class="pick-buttons cols${cols}" data-pick="${name}">` +
            options.map(o => `<button type="button" data-value="${o.value}" class="${o.value === String(current) ? 'selected' : ''}">` +
                `${o.label}${o.hint ? `<small>${o.hint}</small>` : ''}</button>`).join('') +
            `</div></fieldset>`;
    }
    const moverOptions = () => Object.entries(MOVERS).map(([k, v]) => ({ value: k, label: `${v.icon} ${v.name}` }));

    function buildControls() {
        controlArea.innerHTML =
            pickRow('1번 길', 'a', moverOptions(), state.a, 3) +
            pickRow('2번 길', 'b', moverOptions(), state.b, 3);
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                buildPrediction();
                settingsChanged();
            }));
        });
    }

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const A = MOVERS[state.a], B = MOVERS[state.b];
        const list = [{ value: 'a', label: `1번 ${A.name}` }, { value: 'b', label: `2번 ${B.name}` }, { value: 'same', label: '같다' }];
        predictionLegend.textContent = state.mode === 'distance' ? '누가 먼저 100 m에 닿을까요?' : '10초 동안 누가 더 멀리 갈까요?';
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}"${o.value === state.prediction ? ' class="selected"' : ''}>${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    function renderMain(a) {
        const t = timeAt(a, state.progress);
        const X0 = 70, X1 = 400, LANES = [72, 142];
        const trackM = a.kind === 'distance' ? COURSE_M : a.trackM;
        const px = m => X0 + (Math.min(m, trackM) / trackM) * (X1 - X0);
        let out = '';
        // distance marks
        const step = trackM <= 120 ? 20 : trackM <= 250 ? 50 : 100;
        for (let m = 0; m <= trackM + 1e-9; m += step) {
            out += `<line class="mark" x1="${px(m).toFixed(1)}" y1="${LANES[0] - 30}" x2="${px(m).toFixed(1)}" y2="${LANES[1] + 22}"/>`;
            out += `<text class="axis-text" x="${px(m).toFixed(1)}" y="${LANES[1] + 34}" text-anchor="middle">${m} m</text>`;
        }
        [a.A, a.B].forEach((M, i) => {
            const y = LANES[i];
            out += `<rect class="lane" x="${X0 - 40}" y="${y - 26}" width="${X1 - X0 + 80}" height="44" rx="6"/>`;
            out += `<text class="lane-name" x="${X0 - 40}" y="${y - 30}">${i + 1}번 ${M.name}</text>`;
            const tOwn = a.kind === 'distance' ? Math.min(t, COURSE_M / M.speed) : t;
            const d = M.speed * tOwn;
            out += `<text class="mover" x="${px(d).toFixed(1)}" y="${y + 8}" text-anchor="middle">${M.icon}</text>`;
            // stopwatch for this lane
            const wx = 420, wy = y - 8;
            out += `<rect class="watch" x="${wx - 4}" y="${wy - 12}" width="42" height="34" rx="6"/>`;
            out += `<text class="watch-text" x="${wx + 17}" y="${wy + 2}" text-anchor="middle">${tOwn >= 60 ? `${Math.floor(tOwn / 60)}:${String(Math.floor(tOwn % 60)).padStart(2, '0')}` : tOwn.toFixed(1)}</text>`;
            out += `<text class="axis-text" x="${wx + 17}" y="${wy + 16}" text-anchor="middle">${tOwn >= 60 ? '분:초' : '초'}</text>`;
            // the running distance sits above the mover once it has cleared the lane name
            if (a.kind === 'time' && px(d) > X0 + 70) out += `<text class="dist-text" x="${px(d).toFixed(1)}" y="${y - 22}" text-anchor="middle">${d.toFixed(0)} m</text>`;
            else if (a.kind === 'distance' && tOwn >= COURSE_M / M.speed - 1e-9 && t > 0) out += `<text class="dist-text" x="${(px(COURSE_M) - 16).toFixed(1)}" y="${y - 22}" text-anchor="end">도착 ${fmtTime(COURSE_M / M.speed)}</text>`;
        });
        if (a.kind === 'distance') {
            out += `<line class="finish-post" x1="${px(COURSE_M)}" y1="${LANES[0] - 34}" x2="${px(COURSE_M)}" y2="${LANES[1] + 22}"/>`;
            out += `<path class="finish" d="M${px(COURSE_M)},${LANES[0] - 34} l16,6 l-16,6 z"/>`;
        }
        const VERD = { a: `1번 ${iga(a.A.name)} 빠르다`, b: `2번 ${iga(a.B.name)} 빠르다`, same: '똑같이 빠르다' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${a.kind === 'distance' ? '같은 거리 100 m' : '같은 시간 10초'} → ${VERD[a.verdict]}</text>`;
        out += `<text class="note-text" x="20" y="206">${a.kind === 'distance' ? '결승선에 닿으면 그 길의 초시계만 멈춥니다' : '10초가 되면 둘 다 멈추고 간 거리를 잽니다'} · 지난 시간 ${fmtTime(t)}</text>`;
        return out;
    }

    /* ------------------------------------------------------------ graphs */
    function graphFrame(xTicks, xTitle) {
        let out = '';
        xTicks.forEach(([v, x]) => {
            out += `<line class="grid-line" x1="${x.toFixed(1)}" y1="${GRAPH.y1}" x2="${x.toFixed(1)}" y2="${GRAPH.y0}"/>`;
            out += `<text class="axis-text" x="${x.toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${v}</text>`;
        });
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-title" x="${((GRAPH.x0 + GRAPH.x1) / 2).toFixed(1)}" y="${GRAPH.y0 + 30}" text-anchor="middle">${xTitle}</text>`;
        return out;
    }

    // the quantity that was measured, as two bars, with the speed worked out beside each
    function graph(a) {
        const t = timeAt(a, state.progress);
        const rows = [a.A, a.B].map((M, i) => {
            const measured = a.kind === 'distance' ? Math.min(t, COURSE_M / M.speed) : M.speed * t;
            const full = a.kind === 'distance' ? COURSE_M / M.speed : M.speed * CLOCK_S;
            return { M, i, measured, full };
        });
        const max = Math.max(...rows.map(r => r.full)) * 1.1;
        const gx = v => GRAPH.x0 + (v / max) * (GRAPH.x1 - GRAPH.x0);
        const ticks = [];
        const step = max > 200 ? 100 : max > 60 ? 20 : max > 20 ? 5 : max > 8 ? 2 : 1;
        for (let v = 0; v <= max; v += step) ticks.push([`${v}${a.kind === 'distance' ? '초' : ' m'}`, gx(v)]);
        let out = graphFrame(ticks, a.kind === 'distance' ? '100 m를 가는 데 걸린 시간 — 짧을수록 빠름' : '10초 동안 간 거리 — 길수록 빠름');
        rows.forEach(r => {
            const y = GRAPH.y1 + 30 + r.i * 48;
            const colour = r.i === 0 ? '#0284c7' : '#ea580c';
            out += `<text class="bar-text" fill="${colour}" x="${GRAPH.x0}" y="${y - 10}">${r.i + 1}번 ${r.M.name} — ${a.kind === 'distance' ? fmtTime(r.full) : `${r.full.toFixed(0)} m`} · 속력 ${r.M.speed} m/s (${kmh(r.M.speed)} km/h)</text>`;
            out += `<rect class="bar" x="${GRAPH.x0}" y="${y - 4}" width="${Math.max(0, gx(r.full) - GRAPH.x0).toFixed(1)}" height="12" rx="3" fill="${colour}" opacity=".25"/>`;
            out += `<rect class="bar" x="${GRAPH.x0}" y="${y - 4}" width="${Math.max(0, gx(r.measured) - GRAPH.x0).toFixed(1)}" height="12" rx="3" fill="${colour}" opacity=".9"/>`;
        });
        return out;
    }

    function noteFor(a) {
        const rows = [a.A, a.B].map((M, i) => {
            const full = a.kind === 'distance' ? `100 m를 ${fmtTime(COURSE_M / M.speed)}에` : `10초에 ${(M.speed * CLOCK_S).toFixed(0)} m`;
            const calc = a.kind === 'distance' ? `100 ÷ ${(COURSE_M / M.speed).toFixed(1)} = ${M.speed} m/s` : `${(M.speed * CLOCK_S).toFixed(0)} ÷ 10 = ${M.speed} m/s`;
            return `<div class="data-row"><span class="data-name">${i + 1}번 ${M.name}</span><span class="data-val">${full} · 속력 ${calc} (${kmh(M.speed)} km/h)</span></div>`;
        }).join('');
        return `<div class="data-row"><span class="data-name">재는 방법</span><span class="data-val">${a.kind === 'distance' ? '같은 거리 100 m를 가게 하고 걸린 시간을 잼' : '같은 시간 10초를 가게 하고 간 거리를 잼'}</span></div>` + rows +
            `<div class="data-row match"><span class="data-name">더 빠른 것</span><span class="data-val">${a.same ? '둘이 같음' : `${a.verdict === 'a' ? `1번 ${a.A.name}` : `2번 ${a.B.name}`} — ${a.verdict === 'a' ? (a.A.speed / a.B.speed).toFixed(1) : (a.B.speed / a.A.speed).toFixed(1)}배 빠름`}</span></div>`;
    }

    function render() {
        const a = analyse();
        mainGroup.innerHTML = renderMain(a);
        graphGroup.innerHTML = graph(a);
        stageBadge.textContent = `${a.A.icon} ${a.A.name} · ${a.B.icon} ${a.B.name}`;
        methodHint.textContent = state.mode === 'distance'
            ? '같은 거리를 가는 데 걸린 시간이 짧을수록 빠릅니다'
            : '같은 시간에 간 거리가 길수록 빠릅니다';
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
        labelA.textContent = `1번 ${a.A.name}`; labelB.textContent = `2번 ${a.B.name}`;
        if (a.kind === 'distance') {
            valueA.textContent = fmtTime(a.tA); valueB.textContent = fmtTime(a.tB);
        } else {
            valueA.textContent = `${a.dA.toFixed(0)} m`; valueB.textContent = `${a.dB.toFixed(0)} m`;
        }
        predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        const fast = a.verdict === 'a' ? a.A : a.B, slow = a.verdict === 'a' ? a.B : a.A;
        let s = '';
        if (a.same) s = `${wa(a.A.name)} ${eun(a.B.name)} 속력이 같아 ${a.kind === 'distance' ? `100 m를 똑같이 ${fmtTime(a.tA)}에 갔습니다` : `10초에 똑같이 ${a.dA.toFixed(0)} m를 갔습니다`}. 다른 물체를 골라 견주어 보세요.`;
        else if (a.kind === 'distance') s = `같은 100 m를 ${eun(fast.name)} ${fmtTime(COURSE_M / fast.speed)}, ${eun(slow.name)} ${fmtTime(COURSE_M / slow.speed)}에 갔습니다. 걸린 시간이 짧은 ${iga(fast.name)} 더 빠릅니다. ` +
            `속력으로 바꾸면 ${eun(fast.name)} 100 ÷ ${(COURSE_M / fast.speed).toFixed(1)} = ${fast.speed} m/s, ${eun(slow.name)} ${slow.speed} m/s로, ${iga(fast.name)} ${(fast.speed / slow.speed).toFixed(1)}배 빠릅니다.`;
        else s = `같은 10초 동안 ${eun(fast.name)} ${(fast.speed * CLOCK_S).toFixed(0)} m, ${eun(slow.name)} ${(slow.speed * CLOCK_S).toFixed(0)} m를 갔습니다. 간 거리가 긴 ${iga(fast.name)} 더 빠릅니다. ` +
            `속력은 간 거리 ÷ 걸린 시간이므로 ${eun(fast.name)} ${(fast.speed * CLOCK_S).toFixed(0)} ÷ 10 = ${fast.speed} m/s, 곧 1초에 ${fast.speed} m를 갑니다. 시속으로는 ${kmh(fast.speed)} km입니다.`;
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
        stageCaption.textContent = state.mode === 'distance'
            ? '두 물체가 100 m 결승선에 닿는 순간 초시계가 멈춥니다.'
            : '10초가 되면 둘 다 멈추고, 어디까지 갔는지 거리를 읽습니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { a: 'runner', b: 'bike', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'distance').click();
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

    window.__speedModel = {
        MOVERS, COURSE_M, CLOCK_S, state,
        analyse, render,
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
