document.addEventListener('DOMContentLoaded', () => {
    const modeButtons = [...document.querySelectorAll('[data-mode]')];
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const speedRange = document.getElementById('speedRange');
    const freqRange = document.getElementById('freqRange');
    const ampRange = document.getElementById('ampRange');
    const speedOutput = document.getElementById('speedOutput');
    const freqOutput = document.getElementById('freqOutput');
    const ampOutput = document.getElementById('ampOutput');
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

    // The visible stretch of rope is 40 cm long, drawn between X0 and X1.
    const X0 = 52, X1 = 440, SPAN_CM = 40;
    const PX = (X1 - X0) / SPAN_CM;          // 9.7 px per cm
    const CY = 76;                            // rest line of the medium
    const MARK_X = 196;                       // the bead we follow with our eyes
    const SAMPLES = 32;                       // steps per period for the bead animation
    const REF_LAMBDA = 20;                    // the reference wavelength we compare against
    const GRAPH = { x0: 54, x1: 424, y0: 152, y1: 22, fMax: 2.75, lMax: 64 };

    let mode = 'transverse';
    let prediction = null;
    let capNote = '';        // set when the spring cannot take the amplitude asked for

    const speed = () => Number(speedRange.value);      // cm/s, set by the medium alone
    const freq = () => Number(freqRange.value);        // Hz, set by the hand
    const amp = () => Number(ampRange.value);          // cm

    function analyse(v = speed(), f = freq()) {
        const lambda = v / f;                          // v = f λ
        const period = 1 / f;
        const verdict = lambda > REF_LAMBDA + 0.05 ? 'longer'
            : lambda < REF_LAMBDA - 0.05 ? 'shorter' : 'same';
        return { v, f, lambda, period, verdict, lambdaPx: lambda * PX };
    }

    const phaseOf = (x, lambdaPx) => (2 * Math.PI * (x - X0)) / lambdaPx;

    // One period of a bead's motion, sampled so SMIL can walk through it.
    function samples(rest, ampPx, phase, sign) {
        const list = [];
        for (let k = 0; k <= SAMPLES; k += 1) {
            list.push((rest + sign * ampPx * Math.sin(phase - (2 * Math.PI * k) / SAMPLES)).toFixed(2));
        }
        return list.join(';');
    }

    function renderTransverse(a) {
        const ampPx = amp() * PX;
        const lp = a.lambdaPx;
        let out = '';
        // The rope itself is a continuous curve, so sliding the whole shape to
        // the right by one wavelength each period is exactly y(x - vt).
        // Sample a fixed number of points per wavelength, never per pixel, or a
        // short wave turns into a zigzag whose corners the beads fall off. The
        // step dividing the wavelength exactly also makes the loop seamless.
        const per = Math.max(48, Math.ceil(lp / 3));
        const step = lp / per;
        const pts = [];
        for (let x = X0 - lp; x <= X1 + step; x += step) {
            pts.push(`${x.toFixed(2)},${(CY - ampPx * Math.sin(phaseOf(x, lp))).toFixed(2)}`);
        }
        out += `<g clip-path="url(#mediumClip)"><path class="rope" d="M${pts.join('L')}">` +
               `</path><animateTransform attributeName="transform" type="translate" ` +
               `from="0 0" to="${lp.toFixed(1)} 0" dur="${a.period.toFixed(3)}s" repeatCount="indefinite"/></g>`;
        // Beads sit on the rope but are animated on their own: they only ever
        // move up and down, never to the right.
        for (let k = 0; k < 6; k += 1) {
            const bx = X0 + k * 72;
            if (bx > X1) break;
            const marked = bx === MARK_X;
            out += `<circle class="bead${marked ? ' marked' : ''}" cx="${bx}" cy="${CY}" r="${marked ? 5.2 : 3.6}">` +
                   `<animate attributeName="cy" values="${samples(CY, ampPx, phaseOf(bx, lp), -1)}" ` +
                   `dur="${a.period.toFixed(3)}s" repeatCount="indefinite"/></circle>`;
        }
        out += `<line class="guide" x1="${MARK_X}" y1="${CY - 34}" x2="${MARK_X}" y2="${CY + 34}"/>`;
        // the hand, moving with the end of the rope it is holding
        out += `<rect class="hand" x="34" y="${CY - 7}" width="16" height="14" rx="4">` +
               `<animate attributeName="y" values="${samples(CY - 7, ampPx, phaseOf(X0, lp), -1)}" ` +
               `dur="${a.period.toFixed(3)}s" repeatCount="indefinite"/></rect>`;
        return out;
    }

    function renderLongitudinal(a) {
        const lp = a.lambdaPx;
        // A real medium cannot be displaced by more than λ/2π without the coils
        // running through each other, so that is the honest ceiling here. When
        // it bites we say so rather than letting the slider look broken.
        const ceiling = lp / (2 * Math.PI);
        const ampPx = Math.min(amp() * PX, ceiling);
        capNote = amp() * PX > ceiling
            ? `파장 ${(lp / PX).toFixed(1)} cm에서는 진폭이 ${(ceiling / PX).toFixed(1)} cm를 넘을 수 없습니다.`
            : '';
        const rest = [];
        for (let x = X0 + 4; x <= X1 - 4; x += 8) rest.push(x);
        const markRest = rest.reduce((best, x) => (Math.abs(x - MARK_X) < Math.abs(best - MARK_X) ? x : best), rest[0]);
        let out = '';
        // Every coil is animated about its own rest position, so the crowding
        // pattern travels while no coil ever leaves its place.
        rest.forEach(x => {
            const marked = x === markRest;
            out += `<line class="coil${marked ? ' marked' : ''}" x1="${x}" y1="${CY - 17}" x2="${x}" y2="${CY + 17}">` +
                   `<animate attributeName="x1" values="${samples(x, ampPx, phaseOf(x, lp), 1)}" dur="${a.period.toFixed(3)}s" repeatCount="indefinite"/>` +
                   `<animate attributeName="x2" values="${samples(x, ampPx, phaseOf(x, lp), 1)}" dur="${a.period.toFixed(3)}s" repeatCount="indefinite"/></line>`;
        });
        out += `<line class="guide" x1="${markRest}" y1="${CY - 26}" x2="${markRest}" y2="${CY + 26}"/>`;
        out += `<rect class="hand" x="34" y="${CY - 12}" width="16" height="24" rx="4">` +
               `<animate attributeName="x" values="${samples(34, ampPx, phaseOf(X0, lp), 1)}" ` +
               `dur="${a.period.toFixed(3)}s" repeatCount="indefinite"/></rect>`;
        return out;
    }

    function renderMain(a) {
        capNote = '';
        let out = '';
        // which way the wave is heading
        out += `<line class="span-arrow" x1="300" y1="20" x2="368" y2="20"/>`;
        out += `<path class="span-arrow" fill="none" d="M362,15 L368,20 L362,25"/>`;
        out += `<text class="part-label" x="296" y="24" text-anchor="end">파동의 진행 방향</text>`;

        out += mode === 'transverse' ? renderTransverse(a) : renderLongitudinal(a);
        out += `<text class="part-label" x="${MARK_X}" y="118" text-anchor="middle">이 점은 제자리</text>`;

        // ruler along the medium, marked every 5 cm
        out += `<line class="ruler" x1="${X0}" y1="124" x2="${X1}" y2="124"/>`;
        for (let cm = 0; cm <= SPAN_CM; cm += 1) {
            const x = X0 + cm * PX, major = cm % 5 === 0;
            out += `<line class="tick${major ? ' major' : ''}" x1="${x.toFixed(1)}" y1="${major ? 114 : 118}" x2="${x.toFixed(1)}" y2="124"/>`;
            if (major) out += `<text class="axis-text" x="${x.toFixed(1)}" y="136" text-anchor="middle">${cm}</text>`;
        }

        // one wavelength measured off against that ruler
        const fits = a.lambdaPx <= X1 - X0;
        const spanEnd = fits ? X0 + a.lambdaPx : X1;
        // dropped clear of the ruler numbers, which sit just above
        out += `<line class="span-arrow" x1="${X0}" y1="158" x2="${spanEnd.toFixed(1)}" y2="158"/>`;
        out += `<line class="span-arrow" x1="${X0}" y1="152" x2="${X0}" y2="164"/>`;
        if (fits) out += `<line class="span-arrow" x1="${spanEnd.toFixed(1)}" y1="152" x2="${spanEnd.toFixed(1)}" y2="164"/>`;
        const spanText = fits ? `파장 ${a.lambda.toFixed(1)} cm` : `파장 ${a.lambda.toFixed(1)} cm — 화면보다 깁니다`;
        out += `<text class="span-text" x="${((X0 + spanEnd) / 2).toFixed(1)}" y="153" text-anchor="middle">${spanText}</text>`;

        out += `<text class="read-text" x="${X0}" y="178">파동은 진행하지만 매질은 제자리에서 진동합니다</text>`;
        out += `<text class="note-text" x="${X0}" y="196">진폭을 ${amp().toFixed(1)} cm로 바꿔도 파장과 속력은 그대로입니다.</text>`;
        const tail = capNote || (mode === 'longitudinal'
            ? '빽빽한 곳이 밀, 성긴 곳이 소입니다.'
            : '줄 위의 점은 위아래로만 움직입니다.');
        out += `<text class="note-text" x="${X0}" y="209">${tail}</text>`;
        mainGroup.innerHTML = out;
    }

    const gx = f => GRAPH.x0 + (f / GRAPH.fMax) * (GRAPH.x1 - GRAPH.x0);
    const gy = l => GRAPH.y0 - (l / GRAPH.lMax) * (GRAPH.y0 - GRAPH.y1);

    function renderGraph(a) {
        let out = '';
        for (let l = 0; l <= GRAPH.lMax; l += 16) {
            out += `<line class="grid-line" x1="${GRAPH.x0}" y1="${gy(l).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(l).toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(gy(l) + 3).toFixed(1)}" text-anchor="end">${l}</text>`;
        }
        for (let f = 0.5; f <= 2.51; f += 0.5) {
            out += `<text class="axis-text" x="${gx(f).toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${f.toFixed(1)}</text>`;
        }
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-title" x="${((GRAPH.x0 + GRAPH.x1) / 2).toFixed(1)}" y="${GRAPH.y0 + 30}" text-anchor="middle">진동수 (Hz)</text>`;
        out += `<text class="axis-title" x="${GRAPH.x0}" y="${GRAPH.y1 - 6}">파장 (cm)</text>`;

        out += `<line class="ref-line" x1="${GRAPH.x0}" y1="${gy(REF_LAMBDA).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(REF_LAMBDA).toFixed(1)}"/>`;
        out += `<text class="ref-text" x="${GRAPH.x1 - 4}" y="${(gy(REF_LAMBDA) - 5).toFixed(1)}" text-anchor="end">기준 ${REF_LAMBDA} cm</text>`;

        // λ = v / f for three different media: faster medium, longer wave
        [[10, '#4a7fd6'], [20, '#0284c7'], [30, '#a8ecff']].forEach(([v, col]) => {
            const pts = [];
            for (let f = 0.5; f <= 2.501; f += 0.02) pts.push(`${gx(f).toFixed(1)},${gy(v / f).toFixed(1)}`);
            const isCurrent = v === speed();
            out += `<path class="trace${isCurrent ? '' : ' dim'}" style="stroke:${col}" d="M${pts.join('L')}"/>`;
            out += `<text class="curve-tag" fill="${col}" opacity="${isCurrent ? 1 : .55}" x="${(gx(0.5) + 5).toFixed(1)}" y="${(gy(v / 0.5) - 6).toFixed(1)}">${v} cm/s</text>`;
        });
        if (![10, 20, 30].includes(speed())) {
            const pts = [];
            for (let f = 0.5; f <= 2.501; f += 0.02) pts.push(`${gx(f).toFixed(1)},${gy(speed() / f).toFixed(1)}`);
            out += `<path class="trace" style="stroke:#d97706" d="M${pts.join('L')}"/>`;
        }
        out += `<circle class="trace-dot" cx="${gx(a.f).toFixed(1)}" cy="${gy(a.lambda).toFixed(1)}" r="5" fill="#d97706"/>`;
        graphGroup.innerHTML = out;
    }

    const VERDICT = { longer: '기준보다 길다', same: '기준과 같다', shorter: '기준보다 짧다' };

    function render() {
        const a = analyse();
        renderMain(a);
        renderGraph(a);
        speedOutput.textContent = `${a.v} cm/s`;
        freqOutput.textContent = `${a.f.toFixed(2)} Hz`;
        ampOutput.textContent = `${amp().toFixed(1)} cm`;
        stageBadge.textContent = `${mode === 'transverse' ? '횡파' : '종파'} · 파장 ${a.lambda.toFixed(1)} cm`;
        dataNote.innerHTML = '<p>진동수: ' + a.f.toFixed(2) + ' Hz · 진폭: ' + amp().toFixed(1) + ' cm</p><p>소리는 진동수가 클수록 높고, 진폭이 클수록 큽니다.</p>';
        return a;
    }

    const clearResult = () => { resultEmpty.hidden = false; resultContent.hidden = true; };

    function check() {
        const a = analyse();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        valueA.textContent = `${a.lambda.toFixed(1)} cm`;
        valueB.textContent = `${a.period.toFixed(2)} 초`;
        predictionResult.textContent = !prediction
            ? '다음에는 결과를 먼저 예상해 보세요.'
            : prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        const s = mode === 'transverse' ? '줄의 빨간 점은 위아래로 진동합니다. 파동이 오른쪽으로 진행해도 줄의 각 부분은 함께 오른쪽으로 이동하지 않습니다.' : '용수철의 빨간 고리는 앞뒤로 진동합니다. 빽빽한 곳과 성긴 곳이 이동하며 파동이 전달됩니다.';
        explanation.textContent = s;
    }

    [speedRange, freqRange, ampRange].forEach(el => el.addEventListener('input', () => {
        render(); if (!resultContent.hidden) check();
    }));
    modeButtons.forEach(button => button.addEventListener('click', () => {
        mode = button.dataset.mode;
        modeButtons.forEach(item => item.classList.toggle('selected', item === button));
        stageCaption.textContent = mode === 'transverse'
            ? '빨간 점을 눈으로 따라가 보세요. 파동은 오른쪽으로 가지만 점은 제자리에 있습니다.'
            : '빨간 고리를 눈으로 따라가 보세요. 빽빽한 곳만 오른쪽으로 옮겨 갑니다.';
        render(); if (!resultContent.hidden) check();
    }));
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    checkBtn.addEventListener('click', check);
    resetBtn.addEventListener('click', () => {
        speedRange.value = '20'; freqRange.value = '1'; ampRange.value = '2';
        prediction = null;
        predictionButtons.forEach(item => item.classList.remove('selected'));
        clearResult();
        modeButtons.find(b => b.dataset.mode === 'transverse').click();
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

    window.__waveModel = {
        X0, X1, PX, CY, SPAN_CM, MARK_X, SAMPLES, REF_LAMBDA, analyse, phaseOf, render,
        setSpeed(v) { speedRange.value = String(v); speedRange.dispatchEvent(new Event('input')); },
        setFreq(v) { freqRange.value = String(v); freqRange.dispatchEvent(new Event('input')); },
        setAmp(v) { ampRange.value = String(v); ampRange.dispatchEvent(new Event('input')); },
        setMode(m) { modeButtons.find(b => b.dataset.mode === m).click(); },
        speed, freq, amp, getMode: () => mode,
    };

    resetBtn.click();
});
