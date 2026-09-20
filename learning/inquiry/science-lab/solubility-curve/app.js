document.addEventListener('DOMContentLoaded', () => {
    const soluteButtons = [...document.querySelectorAll('[data-solute]')];
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const addedRange = document.getElementById('addedRange');
    const tempRange = document.getElementById('tempRange');
    const coolRange = document.getElementById('coolRange');
    const addedOutput = document.getElementById('addedOutput');
    const tempOutput = document.getElementById('tempOutput');
    const coolOutput = document.getElementById('coolOutput');
    const checkBtn = document.getElementById('checkBtn');
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

    // Measured solubilities in g per 100 g of water, at 0/20/40/60/80/100 ℃.
    // Potassium nitrate climbs steeply while table salt barely moves, which is
    // the contrast the whole experiment turns on.
    const SOLUTES = {
        kno3: { name: '질산칼륨', formula: 'KNO₃', color: '#059669', data: [13.3, 31.6, 63.9, 110.0, 169.0, 246.0] },
        kcl:  { name: '염화칼륨', formula: 'KCl',  color: '#d97706', data: [28.1, 34.2, 40.1, 45.8, 51.3, 56.3] },
        nacl: { name: '염화나트륨', formula: 'NaCl', color: '#0284c7', data: [35.7, 36.0, 36.6, 37.3, 38.4, 39.8] },
    };
    const TEMPS = [0, 20, 40, 60, 80, 100];
    const WATER_G = 100;
    const S_MAX = 260;
    const GRAPH = { x0: 54, x1: 424, y0: 196, y1: 22 };

    let solute = 'kno3';
    let prediction = null;

    const added = () => Number(addedRange.value);
    const temp = () => Number(tempRange.value);
    const coolTemp = () => Number(coolRange.value);

    // Read the curve at any temperature by interpolating between the measured
    // points — the same thing a student does with a ruler on the printed graph.
    function solubility(key, t) {
        const d = SOLUTES[key].data;
        if (t <= TEMPS[0]) return d[0];
        if (t >= TEMPS[TEMPS.length - 1]) return d[d.length - 1];
        const i = Math.min(TEMPS.length - 2, Math.floor(t / 20));
        const span = TEMPS[i + 1] - TEMPS[i];
        return d[i] + ((d[i + 1] - d[i]) * (t - TEMPS[i])) / span;
    }

    // Only as much as the curve allows can dissolve; the rest sits on the
    // bottom. Cooling lowers the ceiling, and whatever no longer fits comes
    // back out as crystals.
    function analyse() {
        const s1 = solubility(solute, temp());
        const max1 = (s1 * WATER_G) / 100;
        const dissolved = Math.min(added(), max1);
        const undissolved = added() - dissolved;
        const s2 = solubility(solute, coolTemp());
        const max2 = (s2 * WATER_G) / 100;
        // Raising the second temperature instead of lowering it means heating,
        // and then any solid still sitting on the bottom starts to dissolve.
        // Ignoring that would leave the picture wrong for half the slider.
        const heating = max2 > max1;
        const extraDissolved = heating ? Math.min(undissolved, max2 - dissolved) : 0;
        const dissolvedAfter = heating ? dissolved + extraDissolved : Math.min(dissolved, max2);
        const precipitated = heating ? 0 : dissolved - dissolvedAfter;
        const undissolvedAfter = undissolved - extraDissolved + precipitated;
        const saturated = added() >= max1 - 1e-9;
        return { s1, s2, max1, max2, dissolved, undissolved, dissolvedAfter,
            precipitated, extraDissolved, undissolvedAfter, heating, saturated };
    }

    const gx = t => GRAPH.x0 + (t / 100) * (GRAPH.x1 - GRAPH.x0);
    const gy = s => GRAPH.y0 - (Math.min(s, S_MAX) / S_MAX) * (GRAPH.y0 - GRAPH.y1);

    function renderBeaker() {
        const a = analyse();
        const S = SOLUTES[solute];
        const BX = { x0: 150, x1: 310, top: 22, bottom: 140 };
        const surface = 52;
        let out = '';
        out += `<rect class="solution" x="${BX.x0 + 2}" y="${surface}" width="${BX.x1 - BX.x0 - 4}" height="${BX.bottom - surface}"/>`;
        out += `<ellipse class="solution-surface" cx="${(BX.x0 + BX.x1) / 2}" cy="${surface}" rx="${(BX.x1 - BX.x0 - 4) / 2}" ry="4"/>`;
        // dissolved particles scattered through the liquid, count tracks the amount
        const dots = Math.min(46, Math.round(a.dissolved / 5));
        for (let i = 0; i < dots; i += 1) {
            const x = BX.x0 + 10 + ((i * 47) % (BX.x1 - BX.x0 - 20));
            const y = surface + 10 + ((i * 29) % (BX.bottom - surface - 20));
            out += `<circle class="dissolved-dot" cx="${x}" cy="${y}" r="2.2"/>`;
        }
        // undissolved solid heaped on the bottom
        if (a.undissolved > 0.01) {
            const w = Math.min(BX.x1 - BX.x0 - 16, 24 + a.undissolved * 0.9);
            const h = Math.min(34, 5 + a.undissolved * 0.28);
            out += `<path class="undissolved" d="M${((BX.x0 + BX.x1) / 2 - w / 2).toFixed(1)},${BX.bottom} Q${(BX.x0 + BX.x1) / 2},${(BX.bottom - h * 2).toFixed(1)} ${((BX.x0 + BX.x1) / 2 + w / 2).toFixed(1)},${BX.bottom} Z"/>`;
        }
        out += `<path class="beaker" d="M${BX.x0},${BX.top} L${BX.x0},${BX.bottom} L${BX.x1},${BX.bottom} L${BX.x1},${BX.top}"/>`;
        out += `<text class="beaker-note" x="${BX.x0 - 10}" y="${surface + 4}" text-anchor="end">물 ${WATER_G} g</text>`;
        out += `<text class="beaker-note" x="${BX.x1 + 10}" y="60">녹은 양 ${a.dissolved.toFixed(1)} g</text>`;
        out += `<text class="beaker-note" x="${BX.x1 + 10}" y="78">남은 양 ${a.undissolved.toFixed(1)} g</text>`;
        const label = a.undissolved > 0.01 ? '포화 (남음)' : a.saturated ? '꼭 포화' : '불포화';
        const col = a.undissolved > 0.01 ? '#dc2626' : a.saturated ? '#d97706' : '#059669';
        out += `<text class="sat-badge" fill="${col}" x="${BX.x1 + 10}" y="98">${label}</text>`;
        out += `<text class="beaker-note" x="${(BX.x0 + BX.x1) / 2}" y="${BX.bottom + 20}" text-anchor="middle">${S.name} ${added()} g · ${temp()} ℃</text>`;
        beakerGroup.innerHTML = out;
        return a;
    }

    function renderGraph(a) {
        const S = SOLUTES[solute];
        let out = '';
        for (let s = 0; s <= S_MAX; s += 65) {
            out += `<line class="grid-line" x1="${GRAPH.x0}" y1="${gy(s).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(s).toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(gy(s) + 3).toFixed(1)}" text-anchor="end">${s}</text>`;
        }
        for (const t of TEMPS) {
            out += `<line class="grid-line" x1="${gx(t).toFixed(1)}" y1="${GRAPH.y1}" x2="${gx(t).toFixed(1)}" y2="${GRAPH.y0}"/>`;
            out += `<text class="axis-text" x="${gx(t).toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${t}</text>`;
        }
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-title" x="${(GRAPH.x0 + GRAPH.x1) / 2}" y="${GRAPH.y0 + 30}" text-anchor="middle">온도 (℃)</text>`;
        out += `<text class="axis-title" x="${GRAPH.x0}" y="${GRAPH.y1 - 6}">용해도 (g / 물 100 g)</text>`;

        const names = Object.entries(SOLUTES).map(([key, sol]) => {
            const pts = [];
            for (let t = 0; t <= 100; t += 2) pts.push(`${gx(t).toFixed(1)},${gy(solubility(key, t)).toFixed(1)}`);
            out += `<path class="curve${key === solute ? '' : ' dim'}" style="stroke:${sol.color}" d="M${pts.join('L')}"/>`;
            return { key, sol, y: gy(sol.data[sol.data.length - 1]) - 6 };
        });
        /* Curves that finish at similar solubilities put their names on the same
           line. Fan them apart, then slide the block back inside the plot. */
        const GAP = 14;
        names.sort((p, q) => p.y - q.y);
        for (let i = 1; i < names.length; i += 1) {
            if (names[i].y - names[i - 1].y < GAP) names[i].y = names[i - 1].y + GAP;
        }
        let nShift = 0;
        if (names[0].y < GRAPH.y1 + 10) nShift = (GRAPH.y1 + 10) - names[0].y;
        if (names[names.length - 1].y + nShift > GRAPH.y0 - 2) nShift = (GRAPH.y0 - 2) - names[names.length - 1].y;
        names.forEach(n => { n.y += nShift; });
        names.forEach(n => {
            out += `<text class="curve-name" fill="${n.sol.color}" opacity="${n.key === solute ? 1 : 0.5}" ` +
                   `x="${GRAPH.x1 - 4}" y="${n.y.toFixed(1)}" text-anchor="end">${n.sol.formula}</text>`;
        });

        // how much was put in, so the gap to the curve is readable
        out += `<line class="added-line" x1="${GRAPH.x0}" y1="${gy(added()).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(added()).toFixed(1)}"/>`;
        // held below the axis title, which sits just above the plot's top edge
        const addedY = Math.max(GRAPH.y1 + 12, gy(added()) - 5);
        out += `<text class="axis-text" x="${GRAPH.x0 + 4}" y="${addedY.toFixed(1)}" style="fill:#d97706">넣은 양 ${added()} g</text>`;

        const px = gx(temp()), py = gy(a.s1);
        out += `<line class="op-guide" x1="${px.toFixed(1)}" y1="${GRAPH.y0}" x2="${px.toFixed(1)}" y2="${py.toFixed(1)}"/>`;
        out += `<line class="op-guide" x1="${GRAPH.x0}" y1="${py.toFixed(1)}" x2="${px.toFixed(1)}" y2="${py.toFixed(1)}"/>`;
        out += `<circle class="op-point" cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="5"/>`;
        const flipA = px > (GRAPH.x0 + GRAPH.x1) / 2;
        // Flipped, this label hangs off the same right edge as the curve names;
        // drop it below the point when it would land on one of them.
        let opY = Math.max(GRAPH.y1 + 10, py - 9);
        if (flipA && names.some(n => Math.abs(n.y - opY) < 13)) {
            opY = Math.min(GRAPH.y0 - 2, py + 18);
        }
        out += `<text class="op-text" fill="#d97706" x="${(px + (flipA ? -9 : 9)).toFixed(1)}" y="${opY.toFixed(1)}"${flipA ? ' text-anchor="end"' : ''}>${temp()} ℃ → ${a.s1.toFixed(1)} g</text>`;

        const cx2 = gx(coolTemp()), cy2 = gy(a.s2);
        out += `<line class="cool-guide" x1="${cx2.toFixed(1)}" y1="${GRAPH.y0}" x2="${cx2.toFixed(1)}" y2="${cy2.toFixed(1)}"/>`;
        out += `<circle class="cool-point" cx="${cx2.toFixed(1)}" cy="${cy2.toFixed(1)}" r="5"/>`;
        /* Cooling to the starting temperature puts this point exactly on the
           other one; there is then only one reading to give, so the second
           label is left off rather than printed over the first. Nearby but not
           equal, it is pushed clear instead. */
        const sameSpot = Math.abs(cx2 - px) < 2 && Math.abs(cy2 - py) < 2;
        if (!sameSpot) {
            const flipB = cx2 > (GRAPH.x0 + GRAPH.x1) / 2;
            /* Two close temperatures put the points within a few pixels of each
               other, and the labels are wide enough to meet whichever side they
               are anchored on. Keep this one a full line away — below by
               preference, above when a low-solubility pair has left no room
               between the point and the floor. */
            let coolY = cy2 + 16;
            if (coolY > GRAPH.y0 - 6 || Math.abs(coolY - opY) < 14) coolY = opY - 16;
            // y1 + 28 keeps it under the axis title and the "넣은 양" marker,
            // both of which live in the band along the top-left of the plot.
            coolY = Math.max(GRAPH.y1 + 28, Math.min(GRAPH.y0 - 6, coolY));
            out += `<text class="op-text" fill="#0284c7" x="${(cx2 + (flipB ? -9 : 9)).toFixed(1)}" y="${coolY.toFixed(1)}"${flipB ? ' text-anchor="end"' : ''}>${coolTemp()} ℃ → ${a.s2.toFixed(1)} g</text>`;
        }

        if (a.precipitated > 0.01) {
            const topY = gy(a.dissolved), botY = gy(a.dissolvedAfter);
            out += `<path class="drop-arrow" d="M${cx2.toFixed(1)},${topY.toFixed(1)} L${cx2.toFixed(1)},${botY.toFixed(1)}"/>`;
            out += `<path class="drop-arrow" d="M${(cx2 - 5).toFixed(1)},${(botY - 7).toFixed(1)} L${cx2.toFixed(1)},${botY.toFixed(1)} L${(cx2 + 5).toFixed(1)},${(botY - 7).toFixed(1)}"/>`;
        }
        graphGroup.innerHTML = out;
    }

    function render() {
        const a = renderBeaker();
        renderGraph(a);
        addedOutput.textContent = `${added()} g`;
        tempOutput.textContent = `${temp()} ℃`;
        coolOutput.textContent = `${coolTemp()} ℃`;
        stageBadge.textContent = `${SOLUTES[solute].name} · ${temp()} ℃`;
        dataNote.innerHTML =
            `<div class="data-row"><span class="data-name">${temp()} ℃ 용해도</span><span class="data-val">${a.s1.toFixed(1)} g — 물 100 g에 최대 ${a.max1.toFixed(1)} g</span></div>` +
            `<div class="data-row"><span class="data-name">녹은 양 / 남은 양</span><span class="data-val">${a.dissolved.toFixed(1)} g 녹고 ${a.undissolved.toFixed(1)} g 남음</span></div>` +
            `<div class="data-row${a.precipitated > 0.01 || a.extraDissolved > 0.01 ? ' match' : ''}">` +
            `<span class="data-name">${coolTemp()} ℃로 ${a.heating ? '데우면' : '식히면'}</span>` +
            `<span class="data-val">용해도 ${a.s2.toFixed(1)} g → ` +
            (a.heating
                ? (a.extraDissolved > 0.01 ? `${a.extraDissolved.toFixed(1)} g 더 녹음` : '변화 없음')
                : `${a.precipitated.toFixed(1)} g 석출`) +
            `</span></div>`;
    }

    const clearResult = () => { resultEmpty.hidden = false; resultContent.hidden = true; };

    function check() {
        const a = analyse();
        const S = SOLUTES[solute];
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        valueA.textContent = `${a.undissolved.toFixed(1)} g`;
        valueB.textContent = a.heating
            ? (a.extraDissolved > 0.01 ? `+${a.extraDissolved.toFixed(1)} g 더 녹음` : '변화 없음')
            : `${a.precipitated.toFixed(1)} g`;
        const actual = a.undissolved > 1e-9 ? 'left' : 'all';
        predictionResult.textContent = !prediction
            ? '다음에는 결과를 먼저 예상해 보세요.'
            : prediction === actual ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        explanation.textContent =
            `${temp()} ℃ 에서 ${S.name}의 용해도는 ${a.s1.toFixed(1)} g 이므로 물 100 g 에 최대 ${a.max1.toFixed(1)} g 까지 녹습니다. ` +
            (a.undissolved > 1e-9
                ? `넣은 ${added()} g 중 ${a.dissolved.toFixed(1)} g 만 녹고 ${a.undissolved.toFixed(1)} g이 바닥에 남아 포화 용액이 됩니다. `
                : `넣은 ${added()} g이 모두 녹아 ${a.saturated ? '꼭 포화' : '불포화'} 용액입니다. `) +
            (a.heating
                ? `이 상태에서 ${coolTemp()} ℃로 데우면 용해도가 ${a.s2.toFixed(1)} g으로 늘어나 ` +
                  (a.extraDissolved > 0.01
                      ? `바닥에 남아 있던 ${a.undissolved.toFixed(1)} g 중 ${a.extraDissolved.toFixed(1)} g이 더 녹습니다.`
                      : `석출도 추가로 녹는 것도 없습니다.`)
                : `이 용액을 ${coolTemp()} ℃로 식히면 용해도가 ${a.s2.toFixed(1)} g으로 줄어들어 ` +
                  (a.precipitated > 0.01
                      ? `녹아 있던 ${a.dissolved.toFixed(1)} g 중 ${a.precipitated.toFixed(1)} g이 결정으로 석출됩니다.`
                      : `석출되는 결정은 없습니다.`));
    }

    soluteButtons.forEach(button => button.addEventListener('click', () => {
        solute = button.dataset.solute;
        soluteButtons.forEach(item => item.classList.toggle('selected', item === button));
        render(); if (!resultContent.hidden) check();
    }));
    [addedRange, tempRange, coolRange].forEach(el => el.addEventListener('input', () => {
        render(); if (!resultContent.hidden) check();
    }));
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    checkBtn.addEventListener('click', check);

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

    window.__curveModel = {
        SOLUTES, TEMPS, WATER_G, solubility, analyse,
        setSolute(s) { document.querySelector(`[data-solute="${s}"]`).click(); },
        setAdded(v) { addedRange.value = String(v); addedRange.dispatchEvent(new Event('input')); },
        setTemp(v) { tempRange.value = String(v); tempRange.dispatchEvent(new Event('input')); },
        setCool(v) { coolRange.value = String(v); coolRange.dispatchEvent(new Event('input')); },
        added, temp, coolTemp, render,
    };

    render();
    clearResult();
});
