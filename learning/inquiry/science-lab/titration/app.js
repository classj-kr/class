document.addEventListener('DOMContentLoaded', () => {
    const caseButtons = [...document.querySelectorAll('[data-case]')];
    const indButtons = [...document.querySelectorAll('[data-ind]')];
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const acidRange = document.getElementById('acidRange');
    const baseRange = document.getElementById('baseRange');
    const acidOutput = document.getElementById('acidOutput');
    const baseOutput = document.getElementById('baseOutput');
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

    const VA = 25.0;                 // mL of acid in the flask
    const KA = 1.8e-5, KB = 1.8e-5, KW = 1e-14;
    const DROP = 0.1;                // mL, about two drops from the burette
    const CX = 111;
    /* 숫자 뒤 조사는 그 수를 읽은 끝소리를 따릅니다. 영 일 이 삼 사 오 육 칠 팔 구 —
       받침이 없거나 ㄹ(일·칠·팔)이면 '로', 그 밖에는 '으로'입니다. */
    const DIGIT_JONG = { '0': 21, '1': 8, '2': 0, '3': 16, '4': 0, '5': 0, '6': 1, '7': 8, '8': 8, '9': 0 };
    const ro = n => {
        const j = DIGIT_JONG[String(n).replace(/[^0-9]/g, '').slice(-1)] ?? 0;
        return `${n}${j === 0 || j === 8 ? '로' : '으로'}`;
    };
    const GRAPH = { x0: 66, x1: 424, y0: 160, y1: 30 };

    const CASES = {
        ss: { label: '강산 + 강염기', acid: 'HCl', base: 'NaOH', weakAcid: false, weakBase: false },
        ws: { label: '약산 + 강염기', acid: 'CH₃COOH', base: 'NaOH', weakAcid: true, weakBase: false },
        sw: { label: '강산 + 약염기', acid: 'HCl', base: 'NH₃', weakAcid: false, weakBase: true },
    };
    const INDS = {
        pp: { name: '페놀프탈레인', lo: 8.3, hi: 10.0, band: 'band-pp', tone: '#e678be',
              below: 'rgba(235,240,245,0.30)', above: 'rgba(230,90,170,0.62)' },
        mo: { name: '메틸오렌지', lo: 3.1, hi: 4.4, band: 'band-mo', tone: '#ff9650',
              below: 'rgba(225,70,50,0.55)', above: 'rgba(250,200,60,0.55)' },
    };

    let kind = 'ss';
    let indicator = 'pp';
    let prediction = null;
    let sim = null, running = false, frameId = 0, lastStamp = 0;

    const ca = () => Number(acidRange.value);
    const cb = () => Number(baseRange.value);
    const clampPH = p => Math.max(0, Math.min(14, p));

    // Find the [H+] that balances charge. Bisecting geometrically because the
    // answer spans fifteen decades. One routine covers the whole curve, so
    // there is no seam where a buffer approximation blows up.
    function solveH(g) {
        let lo = 1e-15, hi = 1;
        for (let i = 0; i < 60; i += 1) {
            const mid = Math.sqrt(lo * hi);
            if (g(mid) > 0) hi = mid; else lo = mid;
        }
        return Math.sqrt(lo * hi);
    }

    // pH after adding V mL of base. Millimoles over millilitres is mol/L.
    function pHAt(V, k = kind, Ca = ca(), Cb = cb()) {
        const c = CASES[k];
        const na = Ca * VA, nb = Cb * Math.max(0, V), Vt = VA + Math.max(0, V);
        const acid = na / Vt, base = nb / Vt;
        let h;
        if (c.weakAcid) {
            // Na+ + H+ = A- + OH-, with A- set by the acid's own equilibrium
            h = solveH(x => base + x - (acid * KA) / (KA + x) - KW / x);
        } else if (c.weakBase) {
            // BH+ + H+ = Cl- + OH-, where BH+ follows Ka = Kw/Kb
            const kaConj = KW / KB;
            h = solveH(x => (base * x) / (x + kaConj) + x - acid - KW / x);
        } else {
            h = solveH(x => base + x - acid - KW / x);
        }
        return clampPH(-Math.log10(h));
    }

    function analyse(k = kind, Ca = ca(), Cb = cb(), ind = indicator) {
        const c = CASES[k];
        const veq = (Ca * VA) / Cb;
        const eqPH = pHAt(veq, k, Ca, Cb);
        // the jump a drop either side of the equivalence point
        const jumpLo = pHAt(Math.max(0, veq - DROP), k, Ca, Cb);
        const jumpHi = pHAt(veq + DROP, k, Ca, Cb);
        const fits = key => {
            const mid = (INDS[key].lo + INDS[key].hi) / 2;
            return mid >= jumpLo && mid <= jumpHi;
        };
        const verdict = eqPH > 7.05 ? 'basic' : eqPH < 6.95 ? 'acidic' : 'neutral';
        return { k, c, Ca, Cb, veq, eqPH, jumpLo, jumpHi, verdict,
                 ind, indOk: fits(ind), ppOk: fits('pp'), moOk: fits('mo'), moles: Ca * VA };
    }

    const freshSim = () => ({ V: 0, done: false });

    function step(s, dt, a) {
        s.V += dt * (a.veq * 0.55);           // sweeps to twice the equivalence volume
        if (s.V >= a.veq * 2) { s.V = a.veq * 2; s.done = true; }
        return s.done;
    }

    // The flask colour the chosen indicator actually shows at this pH.
    function flaskColour(pH, key) {
        const i = INDS[key];
        if (pH <= i.lo) return i.below;
        if (pH >= i.hi) return i.above;
        const f = (pH - i.lo) / (i.hi - i.lo);
        return f < 0.5 ? i.below : i.above;
    }

    function renderMain(a, s) {
        const pH = pHAt(s.V, a.k, a.Ca, a.Cb);
        const total = VA + s.V;
        const BUR = { x0: 100, x1: 122, top: 24, bot: 118 };
        let body = '';
        // burette, emptying as the titration goes
        const used = Math.min(1, s.V / Math.max(1e-9, a.veq * 2));
        const liq = BUR.top + 4 + (BUR.bot - BUR.top - 8) * used;
        body += `<rect class="burette-fill" x="${BUR.x0 + 2}" y="${liq.toFixed(1)}" width="${BUR.x1 - BUR.x0 - 4}" height="${(BUR.bot - 2 - liq).toFixed(1)}"/>`;
        body += `<path class="glass" d="M${BUR.x0},${BUR.top} L${BUR.x0},${BUR.bot} L${BUR.x1},${BUR.bot} L${BUR.x1},${BUR.top}"/>`;
        for (let i = 1; i < 5; i += 1) {
            const y = BUR.top + ((BUR.bot - BUR.top) * i) / 5;
            body += `<line class="burette-tick" x1="${BUR.x1}" y1="${y.toFixed(1)}" x2="${BUR.x1 + 5}" y2="${y.toFixed(1)}"/>`;
        }
        body += `<rect class="tap" x="${CX - 6}" y="${BUR.bot}" width="12" height="9" rx="2"/>`;
        if (!s.done && s.V > 0) {
            body += `<circle class="drop" cx="${CX}" cy="${BUR.bot + 14}" r="2.8">` +
                    `<animate attributeName="cy" values="${BUR.bot + 12};146" dur="0.5s" repeatCount="indefinite"/>` +
                    `<animate attributeName="opacity" values="1;1;0" dur="0.5s" repeatCount="indefinite"/></circle>`;
        }
        // conical flask
        const FT = 152, FB = 190, HALF_T = 8, HALF_B = 35;
        const halfAt = y => HALF_T + ((HALF_B - HALF_T) * (y - FT)) / (FB - FT);
        const level = Math.max(FT + 2, FB - 4 - (Math.min(total, 150) / 150) * 32);
        const h = halfAt(level);
        body += `<polygon class="flask-liquid" fill="${flaskColour(pH, a.ind)}" points="${(CX - h).toFixed(1)},${level.toFixed(1)} ` +
                `${(CX + h).toFixed(1)},${level.toFixed(1)} ${(CX + HALF_B - 2).toFixed(1)},${FB - 3} ${(CX - HALF_B + 2).toFixed(1)},${FB - 3}"/>`;
        body += `<path class="swirl" d="M${CX - 14},${FB - 12} q14,-6 28,0"/>`;
        body += `<path class="glass" d="M${CX - 7},134 L${CX - 7},${FT} L${CX - HALF_B},${FB} L${CX + HALF_B},${FB} L${CX + 7},${FT} L${CX + 7},134"/>`;

        let out = `<g clip-path="url(#flaskClip)">${body}</g>`;
        out += `<text class="small-label" x="${BUR.x1 + 8}" y="${BUR.top + 10}">${a.c.base} ${a.Cb.toFixed(2)} M</text>`;
        // beside the flask, not under it, where the closing note runs
        out += `<text class="small-label" x="${CX + 42}" y="186">${a.c.acid} ${VA.toFixed(1)} mL</text>`;

        out += `<text class="part-label" x="248" y="42">${a.c.label}</text>`;
        out += `<text class="ph-big" fill="${pH > 7 ? '#0284c7' : pH < 7 ? '#ea580c' : '#059669'}" x="248" y="72">pH ${pH.toFixed(2)}</text>`;
        out += `<text class="note-text" x="248" y="92">떨어뜨린 염기 ${s.V.toFixed(2)} mL</text>`;
        out += `<text class="note-text" x="248" y="110">당량점 ${a.veq.toFixed(2)} mL</text>`;
        out += `<text class="note-text" x="248" y="128">지시약 ${INDS[a.ind].name} (${INDS[a.ind].lo}~${INDS[a.ind].hi})</text>`;
        const shown = pH >= INDS[a.ind].hi ? '변색됨' : pH <= INDS[a.ind].lo ? '아직 그대로' : '변색 중';
        out += `<text class="note-text" x="248" y="146">지금 상태 ${shown}</text>`;
        out += `<text class="verdict-text" fill="${a.indOk ? '#059669' : '#ea580c'}" x="248" y="170">` +
               `${a.indOk ? '이 적정에 알맞은 지시약입니다' : '이 적정에는 알맞지 않습니다'}</text>`;
        out += `<text class="note-text" x="20" y="206">한두 방울(${DROP} mL) 사이에 pH가 ${a.jumpLo.toFixed(1)} → ${ro(a.jumpHi.toFixed(1))} 뜁니다</text>`;
        mainGroup.innerHTML = out;
    }

    function renderGraph(a, s) {
        const vMax = a.veq * 2;
        const gx = V => GRAPH.x0 + (V / vMax) * (GRAPH.x1 - GRAPH.x0);
        const gy = p => GRAPH.y0 - (p / 14) * (GRAPH.y0 - GRAPH.y1);
        let out = '';
        // the two indicator ranges, drawn as bands
        Object.entries(INDS).forEach(([k, i]) => {
            out += `<rect class="${i.band}" x="${GRAPH.x0}" y="${gy(i.hi).toFixed(1)}" width="${GRAPH.x1 - GRAPH.x0}" height="${(gy(i.lo) - gy(i.hi)).toFixed(1)}"/>`;
            out += `<text class="band-text" fill="${i.tone}" x="${GRAPH.x0 + 4}" y="${(gy(i.hi) + 10).toFixed(1)}">${i.name} ${i.lo}~${i.hi}${k === a.ind ? ' ←' : ''}</text>`;
        });
        [0, 7, 14].forEach(p => {
            out += `<line class="grid-line" x1="${GRAPH.x0}" y1="${gy(p).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(p).toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(gy(p) + 3).toFixed(1)}" text-anchor="end">${p}</text>`;
        });
        [0, 0.5, 1, 1.5, 2].forEach(f => {
            out += `<text class="axis-text" x="${gx(vMax * f / 2).toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${(vMax * f / 2).toFixed(0)}</text>`;
        });
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-title" x="${((GRAPH.x0 + GRAPH.x1) / 2).toFixed(1)}" y="${GRAPH.y0 + 32}" text-anchor="middle">넣어 준 염기의 부피 (mL)</text>`;
        out += `<text class="axis-title" x="22" y="20">pH</text>`;
        const line = (to, cls) => {
            const pts = [];
            for (let i = 0; i <= 400; i += 1) {
                const V = (to * i) / 400;
                pts.push(`${gx(V).toFixed(1)},${gy(pHAt(V, a.k, a.Ca, a.Cb)).toFixed(1)}`);
            }
            return `<path class="${cls}" d="M${pts.join('L')}"/>`;
        };
        out += line(vMax, 'curve-done');
        if (s && s.V > 0) out += line(s.V, 'curve');
        out += `<line class="eq-line" x1="${gx(a.veq).toFixed(1)}" y1="${GRAPH.y1}" x2="${gx(a.veq).toFixed(1)}" y2="${GRAPH.y0}"/>`;
        out += `<circle class="mark-dot" cx="${gx(a.veq).toFixed(1)}" cy="${gy(a.eqPH).toFixed(1)}" r="5" fill="#059669"/>`;
        const flip = gx(a.veq) > (GRAPH.x0 + GRAPH.x1) / 2;
        out += `<text class="eq-text" x="${(gx(a.veq) + (flip ? -6 : 6)).toFixed(1)}" y="${(gy(a.eqPH) - 8).toFixed(1)}"${flip ? ' text-anchor="end"' : ''}>` +
               `당량점 ${a.veq.toFixed(1)} mL · pH ${a.eqPH.toFixed(2)}</text>`;
        if (s && s.V > 0) out += `<circle class="mark-dot" cx="${gx(s.V).toFixed(1)}" cy="${gy(pHAt(s.V, a.k, a.Ca, a.Cb)).toFixed(1)}" r="4" fill="#d97706"/>`;
        graphGroup.innerHTML = out;
    }

    function render() {
        const a = analyse();
        if (!sim) sim = freshSim();
        renderMain(a, sim);
        renderGraph(a, sim);
        acidOutput.textContent = `${a.Ca.toFixed(2)} M`;
        baseOutput.textContent = `${a.Cb.toFixed(2)} M`;
        stageBadge.textContent = `${a.veq.toFixed(1)} mL · 당량점 pH ${a.eqPH.toFixed(2)}`;
        dataNote.innerHTML =
            `<div class="data-row"><span class="data-name">산의 몰수</span><span class="data-val">${a.Ca.toFixed(2)} M × ${VA.toFixed(1)} mL = ${a.moles.toFixed(3)} mmol</span></div>` +
            `<div class="data-row"><span class="data-name">당량점 부피</span><span class="data-val">${a.moles.toFixed(3)} ÷ ${a.Cb.toFixed(2)} = ${a.veq.toFixed(2)} mL</span></div>` +
            `<div class="data-row"><span class="data-name">당량점 pH</span><span class="data-val">${a.eqPH.toFixed(2)} — ${EQ_WHY[a.k]}</span></div>` +
            `<div class="data-row"><span class="data-name">급변 구간</span><span class="data-val">${DROP} mL 사이에 pH ${a.jumpLo.toFixed(1)} → ${a.jumpHi.toFixed(1)}</span></div>` +
            `<div class="data-row match"><span class="data-name">지시약</span><span class="data-val">페놀프탈레인 ${a.ppOk ? '알맞음' : '부적합'} · 메틸오렌지 ${a.moOk ? '알맞음' : '부적합'}</span></div>`;
        return a;
    }

    const EQ_WHY = {
        ss: '중성 염만 남아 정확히 7',
        ws: '아세트산 이온이 가수 분해해 7보다 큼',
        sw: '암모늄 이온이 가수 분해해 7보다 작음',
    };

    function stopRun() { running = false; if (frameId) cancelAnimationFrame(frameId); frameId = 0; }

    function tick(dt) {
        const a = analyse();
        const done = step(sim, dt, a);
        render();
        return done;
    }

    function frame(stamp) {
        if (!running) return;
        const dt = Math.min(0.05, (stamp - lastStamp) / 1000 || 0);
        lastStamp = stamp;
        if (tick(dt)) { stopRun(); finish(); } else frameId = requestAnimationFrame(frame);
    }

    function startRun() {
        stopRun();
        sim = freshSim();
        running = true;
        lastStamp = performance.now();
        render();
        frameId = requestAnimationFrame(frame);
    }

    function finish() {
        const a = render();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        valueA.textContent = `${a.veq.toFixed(2)} mL`;
        valueB.textContent = a.eqPH.toFixed(2);
        predictionResult.textContent = !prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        let s = `산의 몰수는 ${a.Ca.toFixed(2)} M × ${VA.toFixed(1)} mL = ${a.moles.toFixed(3)} mmol 입니다. `;
        s += `같은 몰수의 염기가 필요하므로 당량점은 ${a.moles.toFixed(3)} ÷ ${a.Cb.toFixed(2)} = ${a.veq.toFixed(2)} mL 입니다. `;
        if (a.k === 'ss') {
            s += `강산과 강염기가 만나 중성 염만 남으므로 당량점의 pH는 정확히 7 입니다. `;
        } else if (a.k === 'ws') {
            s += `당량점에서는 아세트산 이온만 남습니다. 이 이온이 물과 반응해 수산화 이온(OH⁻)을 내놓기 때문에 pH가 ${ro(a.eqPH.toFixed(2))} 7보다 큽니다. `;
        } else {
            s += `당량점에서는 암모늄 이온만 남습니다. 이 이온이 물과 반응해 수소 이온(H⁺)을 내놓기 때문에 pH가 ${ro(a.eqPH.toFixed(2))} 7보다 작습니다. `;
        }
        s += `당량점 앞뒤로 ${DROP} mL, 곧 한두 방울 차이에 pH가 ${a.jumpLo.toFixed(1)} 에서 ${a.jumpHi.toFixed(1)} 까지 뜁니다. `;
        s += `지시약은 변색 범위가 이 급변 구간 안에 들어와야 합니다. `;
        if (a.ppOk && a.moOk) s += `이 적정에서는 급변 구간이 넓어 페놀프탈레인과 메틸오렌지 둘 다 쓸 수 있습니다.`;
        else if (a.ppOk) s += `페놀프탈레인(8.3~10.0)은 알맞지만, 메틸오렌지(3.1~4.4)는 당량점보다 훨씬 먼저 변해 버려 쓸 수 없습니다.`;
        else if (a.moOk) s += `메틸오렌지(3.1~4.4)는 알맞지만, 페놀프탈레인(8.3~10.0)은 당량점을 지나서야 변하므로 쓸 수 없습니다.`;
        else s += `두 지시약 모두 급변 구간을 벗어나 이 적정에는 알맞지 않습니다.`;
        explanation.textContent = s;
    }

    function changed() {
        stopRun();
        sim = freshSim();
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        render();
    }

    [acidRange, baseRange].forEach(el => el.addEventListener('input', changed));
    caseButtons.forEach(button => button.addEventListener('click', () => {
        kind = button.dataset.case;
        caseButtons.forEach(item => item.classList.toggle('selected', item === button));
        changed();
    }));
    indButtons.forEach(button => button.addEventListener('click', () => {
        indicator = button.dataset.ind;
        indButtons.forEach(item => item.classList.toggle('selected', item === button));
        changed();
    }));
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        acidRange.value = '0.1'; baseRange.value = '0.1';
        prediction = null;
        predictionButtons.forEach(item => item.classList.remove('selected'));
        stageCaption.textContent = '당량점 근처에서 pH가 갑자기 뛰는 구간에 변색 범위가 들어와야 합니다.';
        indButtons.find(b => b.dataset.ind === 'pp').click();
        caseButtons.find(b => b.dataset.case === 'ss').click();
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

    window.__titrModel = {
        VA, KA, KB, KW, DROP, CASES, INDS, pHAt, analyse, freshSim, step, render, check: finish,
        setCase(k) { caseButtons.find(b => b.dataset.case === k).click(); },
        setInd(k) { indButtons.find(b => b.dataset.ind === k).click(); },
        setCa(v) { acidRange.value = String(v); changed(); },
        setCb(v) { baseRange.value = String(v); changed(); },
        runToEnd(dt = 1 / 60, cap = 4000) {
            stopRun(); sim = freshSim();
            let n = 0; while (!tick(dt) && n < cap) n += 1;
            finish(); return { steps: n, V: sim.V };
        },
        getSim: () => sim, tick,
    };

    resetBtn.click();
});
