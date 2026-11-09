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
    let sim = null, running = false, frameId = 0, lastStamp = 0, revealed = false;

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
        const now = performance.now() / 1000;
        const B = { x0: 104, x1: 118, top: 8, bot: 150 };      // graduated part of the burette
        const FB = 238, FT = 198, NECK = 182, HB = 42, HN = 9; // flask bottom, shoulder, neck top
        let o = '';
        // stand: base, rod, boss head and clamp holding the burette
        o += `<rect x="18" y="238" width="150" height="11" rx="3" fill="#5d6c75"/>`;
        o += `<rect x="38" y="6" width="7" height="233" fill="url(#science-material-steel)" stroke="#5d6c75" stroke-width="1"/>`;
        o += `<rect x="33" y="40" width="17" height="16" rx="3" fill="#47555d"/><rect x="50" y="45" width="52" height="6" fill="url(#science-material-steel)" stroke="#5d6c75" stroke-width="1"/>`;
        o += `<rect x="99" y="41" width="5" height="14" rx="1.5" fill="#47555d"/><rect x="118" y="41" width="5" height="14" rx="1.5" fill="#47555d"/>`;
        // burette liquid, emptying as base is added
        const used = Math.min(1, s.V / Math.max(1e-9, a.veq * 2));
        const liq = B.top + 6 + (B.bot - B.top - 12) * used;
        o += `<rect class="burette-fill" x="${B.x0 + 1.5}" y="${liq.toFixed(1)}" width="${B.x1 - B.x0 - 3}" height="${(B.bot - liq).toFixed(1)}"/>`;
        o += `<rect class="burette-fill" x="${B.x0 + 1.5}" y="${B.bot}" width="${B.x1 - B.x0 - 3}" height="2"/>`;
        o += `<path class="burette-fill" d="M${B.x0 + 2},163 L${B.x1 - 2},163 L${CX + 1.2},176 L${CX - 1.2},176 Z"/>`;
        o += `<path class="glass-dark" d="M${B.x0},${B.top} L${B.x0},162 L${CX - 2},177 L${CX + 2},177 L${B.x1},162 L${B.x1},${B.top}"/>`;
        for (let i = 0; i <= 20; i += 1) {
            const y = B.top + 6 + ((B.bot - B.top - 12) * i) / 20;
            o += `<line class="burette-tick" x1="${B.x0}" y1="${y.toFixed(1)}" x2="${B.x0 + (i % 5 ? 4 : 8)}" y2="${y.toFixed(1)}"/>`;
        }
        // stopcock: the handle turns along the tube while the base runs
        o += `<rect x="${B.x0 - 1}" y="152" width="${B.x1 - B.x0 + 2}" height="10" rx="2" fill="#e8eef1" stroke="#4d5c65" stroke-width="1.2"/>`;
        o += running ? `<rect x="${CX - 2.5}" y="145" width="5" height="24" rx="2" fill="#2f6f85"/>`
                     : `<rect x="${CX - 15}" y="154.5" width="30" height="5" rx="2" fill="#2f6f85"/>`;
        // conical flask, swirled by hand while the titration runs
        const halfAt = y => HN + ((HB - HN) * (y - FT)) / (FB - FT);
        // drawn so that the starting 25 mL is clearly visible; the level rises as base is added
        const level = FB - 4 - (0.3 + 0.6 * Math.min(1, s.V / Math.max(1e-9, a.veq * 2))) * (FB - FT - 6);
        const h = halfAt(level);
        const tilt = running ? 4 * Math.sin(now * 9) : 0;
        const pts = `${(CX - h).toFixed(1)},${level.toFixed(1)} ${(CX + h).toFixed(1)},${level.toFixed(1)} ${CX + HB - 3},${FB - 3} ${CX - HB + 3},${FB - 3}`;
        let f = `<polygon fill="#dcecf3" points="${pts}"/><polygon class="flask-liquid" fill="${flaskColour(pH, a.ind)}" points="${pts}"/>`;
        f += `<line x1="${(CX - h).toFixed(1)}" y1="${level.toFixed(1)}" x2="${(CX + h).toFixed(1)}" y2="${level.toFixed(1)}" stroke="#7fa6b6" stroke-width="1.2"/>`;
        if (running) f += `<path class="swirl" d="M${CX - 20},${FB - 12} q20,${(-7 * Math.cos(now * 9)).toFixed(1)} 40,0"/>`;
        f += `<path class="glass-dark" d="M${CX - HN},${NECK} L${CX - HN},${FT} L${CX - HB},${FB - 2} Q${CX - HB},${FB} ${CX - HB + 3},${FB} L${CX + HB - 3},${FB} Q${CX + HB},${FB} ${CX + HB},${FB - 2} L${CX + HN},${FT} L${CX + HN},${NECK}"/>`;
        f += `<path d="M${CX - HN - 3},${NECK} h${2 * HN + 6}" stroke="#5f8394" stroke-width="2"/><path d="M${CX - HB + 10},${FB - 8} L${CX - HN - 2},${FT + 6}" stroke="#fff" stroke-width="2.5" opacity=".7"/>`;
        o += `<g transform="rotate(${tilt.toFixed(2)} ${CX} ${FB})">${f}</g>`;
        // falling drops between the tip and the liquid
        if (running) {
            for (let i = 0; i < 2; i += 1) {
                const p = (now * 2.2 + i * 0.5) % 1;
                o += `<ellipse class="drop" cx="${CX}" cy="${(179 + p * (level - 181)).toFixed(1)}" rx="2.2" ry="3" opacity="${(1 - p * 0.4).toFixed(2)}"/>`;
            }
        }
        o += `<text class="small-label" x="128" y="22">${a.c.base} ${a.Cb.toFixed(2)} M</text>`;
        o += `<text class="small-label" x="${CX + HB + 6}" y="226">${a.c.acid} ${VA.toFixed(1)} mL</text>`;
        o += `<text class="part-label" x="248" y="40">${a.c.label}</text>`;
        o += `<text class="ph-big" fill="${pH > 7 ? '#0284c7' : pH < 7 ? '#ea580c' : '#059669'}" x="248" y="72">pH ${pH.toFixed(2)}</text>`;
        o += `<text class="small-label" x="248" y="98">넣은 염기 ${s.V.toFixed(2)} mL</text>`;
        o += `<text class="small-label" x="248" y="120">지시약 ${INDS[a.ind].name}</text>`;
        const shown = pH >= INDS[a.ind].hi ? '색이 변함' : pH <= INDS[a.ind].lo ? '아직 그대로' : '변하는 중';
        o += `<text class="small-label" x="248" y="142">플라스크 색 ${shown}</text>`;
        if (revealed) {
            o += `<text class="verdict-text" fill="${a.indOk ? '#059669' : '#ea580c'}" x="248" y="172">` +
                 `${a.indOk ? '이 적정에 알맞은 지시약' : '이 적정에는 알맞지 않은 지시약'}</text>`;
        }
        window.scienceScene.render(mainGroup, o);
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
        if (revealed) out += line(vMax, 'curve-done');
        if (s && s.V > 0) out += line(s.V, 'curve');
        if (revealed) {
        out += `<line class="eq-line" x1="${gx(a.veq).toFixed(1)}" y1="${GRAPH.y1}" x2="${gx(a.veq).toFixed(1)}" y2="${GRAPH.y0}"/>`;
        out += `<circle class="mark-dot" cx="${gx(a.veq).toFixed(1)}" cy="${gy(a.eqPH).toFixed(1)}" r="5" fill="#059669"/>`;
        const flip = gx(a.veq) > (GRAPH.x0 + GRAPH.x1) / 2;
        out += `<text class="eq-text" x="${(gx(a.veq) + (flip ? -6 : 6)).toFixed(1)}" y="${(gy(a.eqPH) - 8).toFixed(1)}"${flip ? ' text-anchor="end"' : ''}>` +
               `당량점 ${a.veq.toFixed(1)} mL · pH ${a.eqPH.toFixed(2)}</text>`;
        }
        if (s && s.V > 0) out += `<circle class="mark-dot" cx="${gx(s.V).toFixed(1)}" cy="${gy(pHAt(s.V, a.k, a.Ca, a.Cb)).toFixed(1)}" r="4" fill="#d97706"/>`;
        window.scienceScene.render(graphGroup,out);
    }

    function render() {
        const a = analyse();
        if (!sim) sim = freshSim();
        renderMain(a, sim);
        renderGraph(a, sim);
        acidOutput.textContent = `${a.Ca.toFixed(2)} M`;
        baseOutput.textContent = `${a.Cb.toFixed(2)} M`;
        stageBadge.textContent = revealed ? `${a.veq.toFixed(1)} mL · 당량점 pH ${a.eqPH.toFixed(2)}` : running ? '적정하는 중' : '적정 전';
        const moleRow = `<div class="data-row"><span class="data-name">산의 몰수</span><span class="data-val">${a.Ca.toFixed(2)} M × ${VA.toFixed(1)} mL = ${a.moles.toFixed(3)} mmol</span></div>`;
        if (!revealed) { window.scienceScene.render(dataNote, moleRow); return a; }
        window.scienceScene.render(dataNote, moleRow +
            `<div class="data-row"><span class="data-name">당량점 부피</span><span class="data-val">${a.moles.toFixed(3)} ÷ ${a.Cb.toFixed(2)} = ${a.veq.toFixed(2)} mL</span></div>` +
            `<div class="data-row"><span class="data-name">당량점 pH</span><span class="data-val">${a.eqPH.toFixed(2)} — ${EQ_WHY[a.k]}</span></div>` +
            `<div class="data-row"><span class="data-name">급변 구간</span><span class="data-val">${DROP} mL 사이에 pH ${a.jumpLo.toFixed(1)} → ${a.jumpHi.toFixed(1)}</span></div>` +
            `<div class="data-row match"><span class="data-name">지시약</span><span class="data-val">페놀프탈레인 ${a.ppOk ? '알맞음' : '부적합'} · 메틸오렌지 ${a.moOk ? '알맞음' : '부적합'}</span></div>`);
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
        revealed = false;
        running = true;
        lastStamp = performance.now();
        render();
        frameId = requestAnimationFrame(frame);
    }

    function finish() {
        revealed = true;
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
        revealed = false;
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
