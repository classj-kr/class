document.addEventListener('DOMContentLoaded', () => {
    const indButtons = [...document.querySelectorAll('[data-ind]')];
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const acidConcRange = document.getElementById('acidConcRange');
    const baseConcRange = document.getElementById('baseConcRange');
    const volRange = document.getElementById('volRange');
    const acidConcOutput = document.getElementById('acidConcOutput');
    const baseConcOutput = document.getElementById('baseConcOutput');
    const volOutput = document.getElementById('volOutput');
    const playBtn = document.getElementById('playBtn');
    const resetBtn = document.getElementById('resetBtn');
    const resultEmpty = document.getElementById('resultEmpty');
    const resultContent = document.getElementById('resultContent');
    const valueA = document.getElementById('valueA');
    const valueB = document.getElementById('valueB');
    const predictionResult = document.getElementById('predictionResult');
    const explanation = document.getElementById('elementaryExplanation');
    const stageCaption = document.getElementById('stageCaption');
    const stageBadge = document.getElementById('stageBadge');
    const beakerGroup = document.getElementById('beakerGroup');
    const graphGroup = document.getElementById('graphGroup');
    const dataNote = document.getElementById('dataNote');

    const ACID_ML = 50;
    const T0 = 20;
    const KW = 1e-14;
    const DH_NEUT = 57100;      // J per mole of water formed
    const C_WATER = 4.18;       // J/(g·℃)
    const MAX_ML = 120;
    const GRAPH = { x0: 52, x1: 408, y0: 172, y1: 24 };

    let indicator = 'btb';
    let prediction = null;
    let playing = false;
    let animV = null;
    let rafId = null, lastT = null;

    const acidC = () => Number(acidConcRange.value);
    const baseC = () => Number(baseConcRange.value);
    const addedML = () => (animV === null ? Number(volRange.value) : animV);

    // Moles of each ion, then whichever is in excess sets the acidity.
    // Solving [H+]² − c[H+] − Kw = 0 keeps pH exact right through the
    // neutral point instead of blowing up when the excess reaches zero.
    function analyse(vb = addedML()) {
        const nH = acidC() * (ACID_ML / 1000);
        const nOH = baseC() * (vb / 1000);
        const totalL = (ACID_ML + vb) / 1000;
        const net = (nH - nOH) / totalL;          // + acid excess, − base excess
        let pH;
        if (net >= 0) {
            const h = (net + Math.sqrt(net * net + 4 * KW)) / 2;
            pH = -Math.log10(h);
        } else {
            const oh = (-net + Math.sqrt(net * net + 4 * KW)) / 2;
            pH = 14 + Math.log10(oh);
        }
        // Every OH⁻ that meets an H⁺ makes one water molecule and releases
        // heat; past the equivalence point no more forms, yet the liquid keeps
        // growing, so the temperature falls again.
        const nWater = Math.min(nH, nOH);
        const massG = ACID_ML + vb;
        const temp = T0 + (DH_NEUT * nWater) / (massG * C_WATER);
        const eqML = (nH / baseC()) * 1000;
        return { nH, nOH, pH, nWater, temp, eqML, net,
            state: Math.abs(nH - nOH) < 1e-12 ? 'neutral' : nH > nOH ? 'acid' : 'base' };
    }

    // Indicator colours keyed to the pH ranges where each actually changes.
    function indicatorColor(pH) {
        if (indicator === 'btb') {
            if (pH < 6.0) return { fill: 'rgba(240,220,90,.55)', name: '노란색 (산성)' };
            if (pH <= 7.6) return { fill: 'rgba(120,215,140,.55)', name: '초록색 (중성)' };
            return { fill: 'rgba(110,170,240,.55)', name: '파란색 (염기성)' };
        }
        if (indicator === 'phen') {
            if (pH < 8.3) return { fill: 'rgba(210,225,235,.30)', name: '무색' };
            return { fill: 'rgba(240,110,180,.55)', name: '붉은색 (염기성)' };
        }
        if (pH < 5.5) return { fill: 'rgba(235,120,110,.5)', name: '붉은색 (산성)' };
        if (pH <= 8.0) return { fill: 'rgba(200,190,175,.4)', name: '보라색 (중성)' };
        return { fill: 'rgba(110,150,230,.55)', name: '푸른색 (염기성)' };
    }

    const gx = v => GRAPH.x0 + (v / MAX_ML) * (GRAPH.x1 - GRAPH.x0);
    const gyPH = p => GRAPH.y0 - (p / 14) * (GRAPH.y0 - GRAPH.y1);

    function renderBeaker(a) {
        const col = indicatorColor(a.pH);
        const BX = { x0: 138, x1: 292, top: 60, bottom: 168 };
        const level = Math.max(6, Math.min(BX.bottom - BX.top - 6, ((ACID_ML + addedML()) / 170) * (BX.bottom - BX.top)));
        const surface = BX.bottom - level;
        let out = '';
        // burette above, its remaining volume shrinking as it is delivered
        const BU = { x0: 200, x1: 224, top: 4, bot: 50 };
        const left = 1 - addedML() / MAX_ML;
        out += `<rect class="burette-fill" x="${BU.x0 + 2}" y="${(BU.top + (BU.bot - BU.top) * (1 - left)).toFixed(1)}" width="${BU.x1 - BU.x0 - 4}" height="${((BU.bot - BU.top) * left).toFixed(1)}"/>`;
        out += `<rect class="burette" x="${BU.x0}" y="${BU.top}" width="${BU.x1 - BU.x0}" height="${BU.bot - BU.top}" rx="3"/>`;
        if (playing) {
            out += `<circle class="drop" cx="${(BU.x0 + BU.x1) / 2}" cy="${BU.bot + 4}" r="3.4">` +
                   `<animate attributeName="cy" from="${BU.bot + 4}" to="${surface.toFixed(1)}" dur=".55s" repeatCount="indefinite"/>` +
                   `<animate attributeName="opacity" values="1;1;0" dur=".55s" repeatCount="indefinite"/></circle>`;
        }
        out += `<rect class="solution" x="${BX.x0 + 2}" y="${surface.toFixed(1)}" width="${BX.x1 - BX.x0 - 4}" height="${level.toFixed(1)}" fill="${col.fill}"/>`;
        out += `<ellipse class="solution-surface" cx="${(BX.x0 + BX.x1) / 2}" cy="${surface.toFixed(1)}" rx="${(BX.x1 - BX.x0 - 4) / 2}" ry="3.5"/>`;
        // leftover ions: only the excess species remains in solution
        const excess = Math.abs(a.nH - a.nOH);
        const dots = Math.min(10, Math.round(excess / (0.05 * 0.05) * 2));
        /* Laid out on a grid rather than by modular arithmetic: the old spacing
           wrapped onto itself in a shallow beaker and printed ions on top of
           each other. If the liquid is too shallow for every ion to have its own
           row, fewer are drawn rather than overlapping ones. */
        const boxW = (BX.x1 - BX.x0) - 30;
        const cols = 3;
        const availH = Math.max(16, level - 22);
        const maxRows = Math.max(1, Math.floor(availH / 15));
        const shown = Math.min(dots, cols * maxRows);
        const rows = Math.max(1, Math.ceil(shown / cols));
        const stepY = Math.min(18, availH / rows);
        for (let i = 0; i < shown; i += 1) {
            const x = BX.x0 + 15 + (boxW * ((i % cols) + 0.5)) / cols;
            const y = surface + 10 + stepY * (Math.floor(i / cols) + 0.5);
            const isH = a.state === 'acid';
            out += `<circle class="${isH ? 'ion-h' : 'ion-oh'}" cx="${x}" cy="${y}" r="6.5"/>`;
            out += `<text class="ion-label" x="${x}" y="${y + 3}" text-anchor="middle">${isH ? 'H⁺' : 'OH⁻'}</text>`;
        }
        out += `<path class="beaker" d="M${BX.x0},${BX.top} L${BX.x0},${BX.bottom} L${BX.x1},${BX.bottom} L${BX.x1},${BX.top}"/>`;
        // thermometer standing in the beaker
        const TX = 316, tFrac = Math.max(0, Math.min(1, (a.temp - T0) / 12));
        out += `<rect class="temp-tube" x="${TX}" y="70" width="9" height="80" rx="4.5"/>`;
        out += `<rect class="temp-fill" x="${TX + 2}" y="${(146 - 74 * tFrac).toFixed(1)}" width="5" height="${(74 * tFrac + 4).toFixed(1)}" rx="2.5"/>`;
        out += `<circle class="temp-bulb" cx="${TX + 4.5}" cy="154" r="7"/>`;
        out += `<text class="temp-text" x="${TX + 16}" y="96">${a.temp.toFixed(2)} ℃</text>`;
        out += `<text class="beaker-note" x="${TX + 16}" y="112">시작 ${T0} ℃</text>`;
        out += `<text class="beaker-note" x="${BX.x0 - 10}" y="${surface + 4}" text-anchor="end">${(ACID_ML + addedML()).toFixed(0)} mL</text>`;
        out += `<text class="beaker-note" x="${(BX.x0 + BX.x1) / 2}" y="186" text-anchor="middle">${col.name}</text>`;
        beakerGroup.innerHTML = out;
    }

    function renderGraph(a) {
        let out = '';
        for (let p = 0; p <= 14; p += 2) {
            out += `<line class="grid-line" x1="${GRAPH.x0}" y1="${gyPH(p).toFixed(1)}" x2="${GRAPH.x1}" y2="${gyPH(p).toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(gyPH(p) + 3).toFixed(1)}" text-anchor="end">${p}</text>`;
        }
        for (let v = 0; v <= MAX_ML; v += 30) {
            out += `<text class="axis-text" x="${gx(v).toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${v}</text>`;
        }
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-title" fill="#0f172a" x="${(GRAPH.x0 + GRAPH.x1) / 2}" y="${GRAPH.y0 + 30}" text-anchor="middle">넣은 수산화나트륨 (mL)</text>`;
        out += `<text class="axis-title" fill="#c79bff" x="${GRAPH.x0}" y="${GRAPH.y1 - 8}">pH</text>`;
        out += `<text class="axis-title" fill="#ea580c" x="${GRAPH.x1 + 4}" y="${GRAPH.y1 - 8}" text-anchor="end">온도 (점선)</text>`;

        // temperature is drawn on its own scale so both fit the same panel
        const tempAt = v => analyse(v).temp;
        let tMax = T0;
        for (let v = 0; v <= MAX_ML; v += 2) tMax = Math.max(tMax, tempAt(v));
        const tSpan = Math.max(1, tMax - T0);
        const gyT = t => GRAPH.y0 - ((t - T0) / (tSpan * 1.15)) * (GRAPH.y0 - GRAPH.y1);

        const phPts = [], tPts = [];
        for (let v = 0; v <= MAX_ML; v += 1) {
            phPts.push(`${gx(v).toFixed(1)},${gyPH(analyse(v).pH).toFixed(1)}`);
            tPts.push(`${gx(v).toFixed(1)},${gyT(tempAt(v)).toFixed(1)}`);
        }
        out += `<path class="temp-curve" d="M${tPts.join('L')}"/>`;
        out += `<path class="ph-curve" d="M${phPts.join('L')}"/>`;

        if (a.eqML <= MAX_ML) {
            out += `<line class="eq-line" x1="${gx(a.eqML).toFixed(1)}" y1="${GRAPH.y1}" x2="${gx(a.eqML).toFixed(1)}" y2="${GRAPH.y0}"/>`;
            const flip = gx(a.eqML) > (GRAPH.x0 + GRAPH.x1) / 2;
            out += `<text class="eq-text" x="${(gx(a.eqML) + (flip ? -5 : 5)).toFixed(1)}" y="${GRAPH.y1 + 10}"${flip ? ' text-anchor="end"' : ''}>중화점 ${a.eqML.toFixed(1)} mL</text>`;
        }
        out += `<circle class="ph-dot" cx="${gx(addedML()).toFixed(1)}" cy="${gyPH(a.pH).toFixed(1)}" r="5"/>`;
        out += `<circle class="temp-dot" cx="${gx(addedML()).toFixed(1)}" cy="${gyT(a.temp).toFixed(1)}" r="4"/>`;
        graphGroup.innerHTML = out;
    }

    function render() {
        const a = analyse();
        renderBeaker(a);
        renderGraph(a);
        acidConcOutput.textContent = `${acidC().toFixed(2)} mol/L`;
        baseConcOutput.textContent = `${baseC().toFixed(2)} mol/L`;
        volOutput.textContent = `${addedML().toFixed(0)} mL`;
        stageBadge.textContent = `${addedML().toFixed(0)} mL · pH ${a.pH.toFixed(2)}`;
        dataRows(a);
        if (!resultContent.hidden) showResult();
        return a;
    }

    function dataRows(a) {
        dataNote.innerHTML =
            `<div class="data-row"><span class="data-name">H⁺ 의 몰수</span><span class="data-val">${acidC().toFixed(2)} × 0.050 L = ${a.nH.toFixed(4)} mol</span></div>` +
            `<div class="data-row"><span class="data-name">OH⁻ 의 몰수</span><span class="data-val">${baseC().toFixed(2)} × ${(addedML() / 1000).toFixed(3)} L = ${a.nOH.toFixed(4)} mol</span></div>` +
            `<div class="data-row${a.state === 'neutral' ? ' match' : ''}"><span class="data-name">지금 상태</span>` +
            `<span class="data-val">${a.state === 'neutral' ? '두 몰수가 같아 중화점' : a.state === 'acid' ? `수소 이온(H⁺)이 ${(a.nH - a.nOH).toFixed(4)} mol 남아 산성` : `수산화 이온(OH⁻)이 ${(a.nOH - a.nH).toFixed(4)} mol 남아 염기성`}</span></div>`;
    }

    const clearResult = () => { resultEmpty.hidden = false; resultContent.hidden = true; };

    function showResult() {
        const a = analyse();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        valueA.textContent = a.pH.toFixed(2);
        valueB.textContent = `${a.eqML.toFixed(1)} mL`;
        predictionResult.textContent = !prediction
            ? '다음에는 결과를 먼저 예상해 보세요.'
            : prediction === 'at' ? '예상이 맞았습니다.' : '예상과 다른 결과입니다. 온도는 중화점에서 가장 높습니다.';
        const peak = analyse(a.eqML).temp;
        explanation.textContent =
            `H⁺ ${a.nH.toFixed(4)} mol과 OH⁻ ${a.nOH.toFixed(4)} mol이 1 : 1로 만나 물이 됩니다. ` +
            `두 몰수가 같아지는 ${a.eqML.toFixed(1)} mL가 중화점이고 이때 pH가 7이 됩니다. ` +
            `중화 반응은 열을 내므로 물이 가장 많이 만들어지는 중화점에서 온도가 ${peak.toFixed(2)} ℃로 가장 높고, ` +
            `그 뒤로는 물이 더 만들어지지 않는데 부피만 늘어나 오히려 온도가 내려갑니다.`;
    }

    function frame(now) {
        const t = now / 1000;
        const dt = lastT === null ? 1 / 60 : Math.min(1 / 20, t - lastT);
        lastT = t;
        if (playing) {
            animV = Math.min(MAX_ML, animV + dt * 24);
            volRange.value = String(Math.round(animV));
            render();
            if (animV >= MAX_ML) { playing = false; playBtn.textContent = '한 방울씩 넣기'; }
            rafId = playing ? requestAnimationFrame(frame) : null;
            if (!playing) lastT = null;
        } else { rafId = null; lastT = null; }
    }

    function stopPlayback() {
        playing = false;
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = null; lastT = null; animV = null;
        playBtn.textContent = '한 방울씩 넣기';
    }
    document.querySelectorAll('.control-panel input[type="range"]').forEach(el => el.addEventListener('input', stopPlayback, true));
    document.querySelectorAll('.control-panel button').forEach(el => {
        if (el !== playBtn && el !== resetBtn) el.addEventListener('click', stopPlayback, true);
    });

    playBtn.addEventListener('click', () => {
        playing = !playing;
        playBtn.textContent = playing ? '멈추기' : '한 방울씩 넣기';
        if (playing) {
            animV = Number(volRange.value);
            if (animV >= MAX_ML) animV = 0;
            showResult();
            if (rafId === null) { lastT = null; rafId = requestAnimationFrame(frame); }
        } else {
            volRange.value = String(Math.round(addedML()));
            animV = null;
            render();
        }
    });
    resetBtn.addEventListener('click', () => {
        playing = false; animV = null;
        if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; lastT = null; }
        playBtn.textContent = '한 방울씩 넣기';
        volRange.value = '0';
        clearResult();
        stageCaption.textContent = '수산화나트륨을 넣으며 색과 온도 변화를 살펴보세요.';
        render();
    });
    indButtons.forEach(button => button.addEventListener('click', () => {
        indicator = button.dataset.ind;
        indButtons.forEach(item => item.classList.toggle('selected', item === button));
        render(); if (!resultContent.hidden) showResult();
    }));
    [acidConcRange, baseConcRange, volRange].forEach(el => el.addEventListener('input', () => {
        animV = null; render(); if (!resultContent.hidden) showResult();
    }));
    predictionButtons.forEach(button => button.addEventListener('click', () => {
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

    window.__neutModel = {
        ACID_ML, T0, KW, DH_NEUT, C_WATER, MAX_ML, analyse, indicatorColor,
        setAcid(c) { acidConcRange.value = String(c); acidConcRange.dispatchEvent(new Event('input')); },
        setBase(c) { baseConcRange.value = String(c); baseConcRange.dispatchEvent(new Event('input')); },
        setVol(v) { volRange.value = String(v); volRange.dispatchEvent(new Event('input')); },
        setIndicator(i) { document.querySelector(`[data-ind="${i}"]`).click(); },
        addedML, render,
    };

    resetBtn.click();
});
