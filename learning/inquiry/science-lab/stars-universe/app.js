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

    const batchim = w => {
        const c = w.charCodeAt(w.length - 1);
        return c >= 0xAC00 && c <= 0xD7A3 ? (c - 0xAC00) % 28 !== 0 : false;
    };
    const eun = w => w + (batchim(w) ? '은' : '는');
    const iga = w => w + (batchim(w) ? '이' : '가');

    /* -------------------------------------------------------------- data */
    // Absolute magnitude, surface temperature and the colour the eye sees.
    const STARS = {
        sun: { name: '태양 같은 별', abs: 4.8, temp: 5800, colour: '노란색', hex: '#ffe9a0' },
        sirius: { name: '시리우스', abs: 1.4, temp: 9900, colour: '흰색', hex: '#eef4ff' },
        betelgeuse: { name: '베텔게우스', abs: -5.5, temp: 3500, colour: '붉은색', hex: '#ff8c5a' },
        rigel: { name: '리겔', abs: -7.0, temp: 12100, colour: '청백색', hex: '#9fc5ff' },
    };
    const BASE_PC = 10;                    // absolute magnitude is the view from here
    const MULTIPLES = [2, 3, 4, 5];
    const apparent = (abs, d) => abs + 5 * Math.log10(d / BASE_PC);

    // Galaxies glued to a rubber band, one every notch; the band is stretched
    // over the run and every distance grows by the same factor.
    const GALAXIES = ['가', '나', '다', '라', '마'];
    const STRETCH = [1.5, 2, 3];

    const state = {
        mode: 'bright',
        star: 'sun', mult: 2,
        stretch: 2, home: 0,
        progress: 0, prediction: null,
    };
    let running = false, frameId = 0, lastStamp = 0;

    /* ------------------------------------------------------------ models */
    function analyseBright(s = state) {
        const star = STARS[s.star];
        const d = BASE_PC * s.mult;
        const ratio = 1 / (s.mult * s.mult);
        const m0 = apparent(star.abs, BASE_PC), m1 = apparent(star.abs, d);
        return { kind: 'bright', star, d, ratio, m0, m1, dm: m1 - m0, verdict: 'square' };
    }
    // the screen on its way out: distance and what reaches one cell of it
    const brightAt = (p, a) => {
        const d = BASE_PC + (a.d - BASE_PC) * p;
        const n = d / BASE_PC;
        return { d, n, ratio: 1 / (n * n), m: apparent(a.star.abs, d) };
    };

    function analyseExpand(s = state) {
        const S = s.stretch;
        const rows = GALAXIES.map((name, i) => {
            const d0 = Math.abs(i - s.home);
            return { name, i, d0, d1: d0 * S, moved: d0 * (S - 1), speed: d0 * (S - 1) / RUN_SECONDS };
        });
        return { kind: 'expand', S, home: s.home, rows, verdict: 'faster' };
    }
    const stretchAt = (p, a) => 1 + (a.S - 1) * p;

    const analyse = () => (state.mode === 'bright' ? analyseBright() : analyseExpand());

    /* ---------------------------------------------------------- controls */
    function pickRow(legend, name, options, current, cols) {
        return `<fieldset class="pick-field"><legend>${legend}</legend>` +
            `<div class="pick-buttons cols${cols}" data-pick="${name}">` +
            options.map(o => `<button type="button" data-value="${o.value}" class="${o.value === String(current) ? 'selected' : ''}">` +
                `${o.label}${o.hint ? `<small>${o.hint}</small>` : ''}</button>`).join('') +
            `</div></fieldset>`;
    }

    function buildControls() {
        if (state.mode === 'bright') {
            controlArea.innerHTML =
                pickRow('별', 'star', Object.entries(STARS).map(([k, v]) => ({ value: k, label: v.name, hint: `절대 등급 ${v.abs.toFixed(1)}` })), state.star, 2) +
                pickRow(`거리 (처음 ${BASE_PC} pc의 몇 배로)`, 'mult', MULTIPLES.map(n => ({ value: String(n), label: `${n}배`, hint: `${n * BASE_PC} pc` })), state.mult, 4);
        } else {
            controlArea.innerHTML =
                pickRow('고무줄을 늘리는 정도', 'stretch', STRETCH.map(S => ({ value: String(S), label: `${S}배` })), state.stretch, 3) +
                pickRow('내가 서 있는 은하', 'home', GALAXIES.map((g, i) => ({ value: String(i), label: g })), state.home, 5);
        }
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                const v = button.dataset.value;
                state[group.dataset.pick] = group.dataset.pick === 'star' ? v : Number(v);
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                if (group.dataset.pick === 'mult') buildPrediction();
                settingsChanged();
            }));
        });
    }

    const PRED_EXPAND = [{ value: 'faster', label: '더 빨리 멀어진다' }, { value: 'same', label: '같은 속도로 멀어진다' }, { value: 'slower', label: '더 느리게 멀어진다' }];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list=state.mode==='bright'?[{value:'square',label:'어두워진다'},{value:'no',label:'밝아진다'}]:[{value:'faster',label:'점들 사이 거리가 커진다'},{value:'no',label:'모든 점이 한 곳으로 모인다'}];
        predictionLegend.textContent=state.mode==='bright'?'같은 별을 멀리에서 보면?':'고무줄을 늘리면?';
        predictionArea.innerHTML=list.map(o=>'<button type="button" data-prediction="'+o.value+'">'+o.label+'</button>').join('');
        predictionArea.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{state.prediction=b.dataset.prediction; window.scienceInvalidatePrediction?.();predictionArea.querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===b));}));
    }

    /* ----------------------------------------------------------- visuals */
    const fmtMag = m => `${m.toFixed(1)}등급`;
    const fmtFrac = n => (Math.abs(n - Math.round(n)) < 1e-9 ? `${Math.round(n)}분의 1` : `${n.toFixed(1)}분의 1`);

    // 밝은 바탕에서도 보이도록 별빛을 짙은 색으로 칠한다
    const INK = { sun: '#f59e0b', sirius: '#60a5fa', betelgeuse: '#ea580c', rigel: '#2563eb' };
    function renderBright(a, p) {
        const at = brightAt(p, a);
        const SX = 30, SY = 110, CELL = 16;
        const xOf = n => SX + n * 75;                  // 처음 거리(10 pc)의 n배인 자리
        const ink = INK[state.star];
        let out = `<rect class="space" x="8" y="34" width="444" height="164" rx="8"/>`;
        // 빛이 퍼지는 원뿔: 처음 거리에서 한 칸을 채우는 빛이 멀수록 넓게 퍼진다
        const xNow = SX + at.n * 75, halfNow = CELL / 2 * at.n;
        out += `<path d="M${SX},${SY} L${xNow.toFixed(1)},${(SY - halfNow).toFixed(1)} L${xNow.toFixed(1)},${(SY + halfNow).toFixed(1)} Z" fill="${ink}" opacity=".12"/>`;
        out += `<path class="ray" stroke="${ink}" d="M${SX},${SY} L${xNow.toFixed(1)},${(SY - halfNow).toFixed(1)} M${SX},${SY} L${xNow.toFixed(1)},${(SY + halfNow).toFixed(1)}"/>`;
        // 거리마다 세운 네모 격자 화면: n배 거리에서는 n×n칸에 나뉘어 한 칸이 1/n²로 옅어진다
        for (let n = 1; n <= a.d / BASE_PC; n += 1) {
            const show = Math.max(0, Math.min(1, (at.n - n) * 4 + 1));
            if (n > 1 && show <= 0) continue;
            const x = xOf(n), half = CELL / 2 * n;
            out += `<g opacity="${(n === 1 ? 1 : show).toFixed(2)}">`;
            out += `<rect x="${(x - half).toFixed(1)}" y="${(SY - half).toFixed(1)}" width="${(2 * half).toFixed(1)}" height="${(2 * half).toFixed(1)}" fill="${ink}" opacity="${Math.max(0.05, 0.9 / (n * n)).toFixed(3)}"/>`;
            for (let k = 0; k <= n; k += 1) {
                const o = -half + k * CELL;
                out += `<line class="screen-grid" x1="${(x + o).toFixed(1)}" y1="${(SY - half).toFixed(1)}" x2="${(x + o).toFixed(1)}" y2="${(SY + half).toFixed(1)}"/><line class="screen-grid" x1="${(x - half).toFixed(1)}" y1="${(SY + o).toFixed(1)}" x2="${(x + half).toFixed(1)}" y2="${(SY + o).toFixed(1)}"/>`;
            }
            out += `<text class="small-label" x="${x}" y="${(SY + 60).toFixed(1)}" text-anchor="middle">${n * BASE_PC} pc</text>`;
            out += `<text class="small-label grid-count" x="${x}" y="${(SY + 78).toFixed(1)}" text-anchor="middle">${n * n}칸</text>`;
            out += `</g>`;
        }
        // 별: 표면 온도에 따른 색
        out += `<circle fill="${a.star.hex}" stroke="${ink}" stroke-width="2" cx="${SX}" cy="${SY}" r="10"/>`;
        out += `<text class="small-label" x="${SX - 14}" y="${SY - 22}">${a.star.name}</text>`;
        out += `<text class="verdict-text" fill="#0f172a" x="20" y="22">${a.star.name} · ${BASE_PC} pc → ${a.d} pc</text>`;
        if (p >= 1) out += `<text class="mag-text figure-caption verdict-text" fill="#0f172a" x="20" y="212">겉보기 ${fmtMag(at.m)} · 절대 ${fmtMag(a.star.abs)}</text>`;
        return out;
    }

    function renderExpand(a, p) {
        const S = stretchAt(p, a);
        const X0 = 30, Y = 100, UNIT0 = 32;                 // one notch = 32 px before stretching
        const unit = UNIT0 * S;
        const len = unit * (GALAXIES.length - 1);
        let out = `<rect class="space" x="8" y="34" width="444" height="164" rx="8"/>`;
        // 양쪽 손: 고무줄을 잡아당긴다
        out += `<rect class="band" x="${X0 - 10}" y="${Y - 7}" width="${(len + 20).toFixed(1)}" height="14" rx="4"/>`;
        out += `<circle cx="${X0 - 14}" cy="${Y}" r="9" fill="#f2c9a5" stroke="#9a6b47"/><circle cx="${(X0 + len + 14).toFixed(1)}" cy="${Y}" r="9" fill="#f2c9a5" stroke="#9a6b47"/>`;
        for (let i = 0; i < GALAXIES.length; i += 1) {
            const x = X0 + i * unit;
            out += `<line class="band-tick" x1="${x.toFixed(1)}" y1="${Y - 7}" x2="${x.toFixed(1)}" y2="${Y + 7}"/>`;
        }
        const homeX = X0 + a.home * unit;
        a.rows.forEach(r => {
            const x = X0 + r.i * unit;
            if (r.i !== a.home && p > 0.001) {
                const dir = r.i > a.home ? 1 : -1;
                const from = homeX + dir * (r.d0 * UNIT0), to = x;
                const ay = Y + 24 + (r.d0 % 2) * 16;
                out += `<line class="recede" x1="${from.toFixed(1)}" y1="${ay}" x2="${to.toFixed(1)}" y2="${ay}"/>`;
                out += `<path fill="#ea580c" d="M${to.toFixed(1)},${ay} l${-dir * 6},-3.5 l0,7 z"/>`;
            }
            out += `<circle class="galaxy${r.i === a.home ? ' home' : ''}" cx="${x.toFixed(1)}" cy="${Y}" r="${r.i === a.home ? 7 : 5.5}"/>`;
            out += `<text class="galaxy-text" x="${x.toFixed(1)}" y="${Y - 16}" text-anchor="middle">${r.name}</text>`;
        });
        out += `<text class="verdict-text" fill="#0f172a" x="20" y="22">고무줄 ${S.toFixed(2)}배 · ${GALAXIES[a.home]} 은하에서 본 모습</text>`;
        return out;
    }

    function renderMain(a) {
        window.scienceScene.render(mainGroup,a.kind === 'bright' ? renderBright(a, state.progress) : renderExpand(a, state.progress));
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

    // 거리에 따른 한 칸의 밝기: 화면이 지나간 거리까지만 막대가 선다
    function graphBright(a) {
        const M = a.d / BASE_PC, at = brightAt(state.progress, a), ink = INK[state.star];
        const xOf = n => GRAPH.x0 + (n - 0.5) * (GRAPH.x1 - GRAPH.x0) / 5, yOf = v => GRAPH.y0 - v * (GRAPH.y0 - GRAPH.y1);
        let out = graphFrame([1, 2, 3, 4, 5].map(n => [`${n}배`, xOf(n)]), [[0, yOf(0)], ['1/2', yOf(.5)], [1, yOf(1)]], '거리 (처음의 몇 배)', '한 칸에 오는 빛');
        for (let n = 1; n <= M; n += 1) {
            if (at.n < n - 1e-6) break;
            const v = 1 / (n * n);
            out += `<rect x="${(xOf(n) - 16).toFixed(1)}" y="${yOf(v).toFixed(1)}" width="32" height="${(GRAPH.y0 - yOf(v)).toFixed(1)}" fill="${ink}" opacity=".75"/>`;
            if (n > 1) out += `<text class="axis-text" x="${xOf(n).toFixed(1)}" y="${(yOf(v) - 5).toFixed(1)}" text-anchor="middle">1/${n * n}</text>`;
        }
        return out;
    }

    // 처음 거리와 멀어진 거리: 은하가 멀수록 더 많이 멀어진다
    function graphExpand(a) {
        const S = stretchAt(state.progress, a), maxD = 4, maxMove = maxD * (3 - 1);
        const xOf = d => GRAPH.x0 + d / maxD * (GRAPH.x1 - GRAPH.x0 - 20), yOf = v => GRAPH.y0 - v / maxMove * (GRAPH.y0 - GRAPH.y1);
        let out = graphFrame([0, 1, 2, 3, 4].map(d => [`${d}칸`, xOf(d)]), [0, 2, 4, 6, 8].map(v => [v, yOf(v)]), '처음 거리', '멀어진 거리 (칸)');
        if (state.progress > 0) a.rows.filter(r => r.i !== a.home).forEach(r => {
            out += `<circle cx="${xOf(r.d0).toFixed(1)}" cy="${yOf(r.d0 * (S - 1)).toFixed(1)}" r="5" fill="#ea580c" stroke="#fff"/><text class="axis-text" x="${(xOf(r.d0) + 8).toFixed(1)}" y="${(yOf(r.d0 * (S - 1)) - 6).toFixed(1)}">${r.name}</text>`;
        });
        return out;
    }

    function noteFor(a) { return a.kind==='bright'?'<p>'+a.star.name+' · '+a.star.colour+'</p><p>같은 별을 멀리 놓으면 어둡게 보이지만 절대 등급은 그대로입니다. 청백색 별은 붉은색 별보다 표면 온도가 높습니다.</p>':'<p>늘리기 전후의 점 사이 거리가 커집니다. 어느 점을 기준으로 삼아도 다른 점들과 멀어지는 모습을 관찰할 수 있습니다.</p>'; }

    function render() {
        const a = analyse();
        renderMain(a);
        window.scienceScene.render(graphGroup,a.kind === 'bright' ? graphBright(a) : graphExpand(a));
        stageBadge.textContent = a.kind === 'bright' ? `${a.star.name} · ${a.d} pc` : `${a.S}배 · ${GALAXIES[a.home]} 은하에서`;
        methodHint.textContent = state.mode === 'bright'
            ? '같은 별을 거리만 바꾸어 놓고 비교합니다'
            : '고무줄에 붙인 점들 사이의 거리를 비교합니다';
        window.scienceScene.render(dataNote, state.progress >= 1 ? noteFor(a) : '');
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
        const a=render();resultEmpty.hidden=true;resultContent.hidden=false;
        labelA.textContent=a.kind==='bright'?'겉보기 밝기':'점 사이 거리';valueA.textContent=a.kind==='bright'?'어두워짐':'커짐';
        labelB.textContent=a.kind==='bright'?'절대 등급':'모형의 의미';valueB.textContent=a.kind==='bright'?fmtMag(a.star.abs)+' 그대로':'우주 팽창';
        predictionResult.textContent=!state.prediction?'다음에는 먼저 예상해 보세요.':state.prediction===a.verdict?'예상이 맞았습니다.':'예상과 다른 결과입니다.';
        explanation.textContent=a.kind==='bright'?'같은 별은 멀리에서 보면 어둡게 보입니다. 절대 등급은 같은 기준 거리에서의 밝기를 뜻하므로 별 자체의 성질이 같으면 바뀌지 않습니다.':'고무줄을 늘릴 때 점 사이가 벌어지는 모습은 우주 팽창의 모형입니다. 어느 점을 기준으로 삼아도 다른 점들과 멀어지는 모습을 관찰할 수 있습니다. 모형의 가장자리와 바깥 공간을 실제 우주에 그대로 대응시키지 않습니다.';
    }
    const eul = w => w + (batchim(w) ? '을' : '를');

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
        stageCaption.textContent = state.mode === 'bright'
            ? '별빛이 지나가는 거리마다 같은 크기의 칸으로 된 화면을 세웠습니다. 한 칸에 오는 빛이 어떻게 되는지 보세요.'
            : '양손으로 고무줄을 당깁니다. 주황 화살표는 내가 선 은하에서 다른 은하가 멀어진 거리입니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { star: 'sun', mult: 2, stretch: 2, home: 0, progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'bright').click();
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

    window.__starsModel = {
        STARS, GALAXIES, BASE_PC, MULTIPLES, STRETCH, state,
        analyseBright, analyseExpand, analyse, apparent, brightAt, stretchAt, render,
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
