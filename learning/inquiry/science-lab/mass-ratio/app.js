document.addEventListener('DOMContentLoaded', () => {
    const modeButtons = [...document.querySelectorAll('[data-mode]')];
    const rxnButtons = [...document.querySelectorAll('[data-rxn]')];
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const massControls = document.getElementById('massControls');
    const heatControls = document.getElementById('heatControls');
    const mgRange = document.getElementById('mgRange');
    const oxRange = document.getElementById('oxRange');
    const timeRange = document.getElementById('timeRange');
    const mgOutput = document.getElementById('mgOutput');
    const oxOutput = document.getElementById('oxOutput');
    const timeOutput = document.getElementById('timeOutput');
    const runBtn = document.getElementById('runBtn');
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

    // 2Mg + O₂ → 2MgO. With Mg at 24 and O at 16 per formula unit, the masses
    // land on a clean 3 : 2 : 5, which is exactly the ratio the law of definite
    // proportions predicts and what the graph below has to reproduce.
    const R_MG = 3, R_OX = 2, R_PROD = 5;
    const MAX_G = 12;

    // Real classroom reactions, with the sign and rough size of their
    // temperature change.
    const REACTIONS = {
        cao:     { name: '산화칼슘 + 물',        delta: +26, kind: '발열', tau: 6 },
        neut:    { name: '산과 염기의 중화',      delta: +8,  kind: '발열', tau: 8 },
        nh4no3:  { name: '질산암모늄 녹이기',     delta: -9,  kind: '흡열', tau: 10 },
        baoh:    { name: '수산화바륨 + 염화암모늄', delta: -18, kind: '흡열', tau: 7 },
    };
    const T0 = 20;

    const GRAPH = { x0: 52, x1: 420, y0: 152, y1: 22 };

    let mode = 'mass';
    let rxn = 'cao';
    let prediction = null;
    let playing = false;
    let animT = null;
    let rafId = null, lastT = null;

    const mg = () => Number(mgRange.value);
    const ox = () => Number(oxRange.value);
    const elapsed = () => (animT === null ? Number(timeRange.value) : animT);

    // Whichever runs out first stops the reaction; the rest is left over. The
    // product always carries the same 3 : 2 split, and nothing is lost — the
    // leftovers plus the product must weigh what went in.
    function react(mgG = mg(), oxG = ox()) {
        const mgNeeded = (oxG * R_MG) / R_OX;
        const mgUsed = Math.min(mgG, mgNeeded);
        const oxUsed = (mgUsed * R_OX) / R_MG;
        const product = mgUsed + oxUsed;
        const mgLeft = mgG - mgUsed;
        const oxLeft = oxG - oxUsed;
        const limiting = mgG === 0 || oxG === 0 ? 'none'
            : Math.abs(mgLeft) < 1e-9 && Math.abs(oxLeft) < 1e-9 ? 'exact'
            : mgLeft > 1e-9 ? 'ox' : 'mg';
        return { mgUsed, oxUsed, product, mgLeft, oxLeft, limiting,
            before: mgG + oxG, after: product + mgLeft + oxLeft };
    }

    const tempAt = t => {
        const r = REACTIONS[rxn];
        return T0 + r.delta * (1 - Math.exp(-t / r.tau));
    };

    const gx = (v, max) => GRAPH.x0 + (v / max) * (GRAPH.x1 - GRAPH.x0);
    const gy = (v, lo, hi) => GRAPH.y0 - ((v - lo) / (hi - lo)) * (GRAPH.y0 - GRAPH.y1);

    const chips = (n, cls, cx, cy, r) => {
        let s = '';
        const count = Math.min(24, Math.round(n * 2));
        for (let i = 0; i < count; i += 1) {
            const col = i % 6, row = Math.floor(i / 6);
            s += `<circle class="${cls}" cx="${(cx - 32 + col * 13).toFixed(1)}" cy="${(cy - row * 11).toFixed(1)}" r="${r}"/>`;
        }
        return s;
    };

    function renderMass() {
        const a = react();
        // The beam stays level because the two totals are equal — that is the
        // whole point, so it is never tilted for effect.
        const PIV = { x: 230, y: 46 };
        const armL = 128, panY = 118;
        let out = '';
        out += `<line class="beam" x1="${PIV.x - armL}" y1="${PIV.y}" x2="${PIV.x + armL}" y2="${PIV.y}"/>`;
        out += `<polygon class="pivot" points="${PIV.x},${PIV.y} ${PIV.x - 16},${PIV.y + 40} ${PIV.x + 16},${PIV.y + 40}"/>`;
        [[-1, '반응 전'], [1, '반응 후']].forEach(([side, title]) => {
            const cx = PIV.x + side * armL;
            out += `<line class="hanger" x1="${cx}" y1="${PIV.y}" x2="${cx}" y2="${panY - 6}"/>`;
            out += `<path class="pan" fill="none" d="M${cx - 54},${panY} L${cx + 54},${panY} L${cx + 40},${panY + 26} L${cx - 40},${panY + 26} Z"/>`;
            out += `<text class="pan-title" x="${cx}" y="${PIV.y + 18}" text-anchor="middle">${title}</text>`;
        });
        const lx = PIV.x - armL, rx = PIV.x + armL;
        out += chips(mg(), 'chip-mg', lx, panY - 4, 4.5);
        out += chips(ox(), 'chip-ox', lx, panY - 26, 4);
        out += chips(a.product, 'chip-mgo', rx, panY - 4, 4.5);
        if (a.mgLeft > 1e-9) out += chips(a.mgLeft, 'chip-mg', rx, panY - 26, 4.5);
        if (a.oxLeft > 1e-9) out += chips(a.oxLeft, 'chip-ox', rx, panY - 26, 4);
        out += `<text class="pan-mass" x="${lx}" y="${panY + 46}" text-anchor="middle">${a.before.toFixed(1)} g</text>`;
        out += `<text class="pan-mass" x="${rx}" y="${panY + 46}" text-anchor="middle">${a.after.toFixed(1)} g</text>`;
        out += `<text class="level-note" x="${PIV.x}" y="${panY + 46}" text-anchor="middle">= 수평</text>`;
        const leftTxt = a.mgLeft > 1e-9 ? `마그네슘 ${a.mgLeft.toFixed(1)} g 남음`
                      : a.oxLeft > 1e-9 ? `산소 ${a.oxLeft.toFixed(1)} g 남음`
                      : a.product > 0 ? '남는 물질 없음 (꼭 맞게 반응)' : '';
        out += `<text class="left-note" x="${rx}" y="${panY + 62}" text-anchor="middle">${leftTxt}</text>`;
        out += `<text class="left-note" x="${lx}" y="${panY + 62}" text-anchor="middle">Mg ${mg().toFixed(1)} g + O ${ox().toFixed(1)} g</text>`;
        mainGroup.innerHTML = out;

        // Product against magnesium added, at the current oxygen: a straight
        // line while oxygen lasts, then a flat ceiling once it runs out.
        let g = '';
        const yMax = MAX_G * 2;
        for (let v = 0; v <= yMax; v += 6) {
            g += `<line class="grid-line" x1="${GRAPH.x0}" y1="${gy(v, 0, yMax).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(v, 0, yMax).toFixed(1)}"/>`;
            g += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(gy(v, 0, yMax) + 3).toFixed(1)}" text-anchor="end">${v}</text>`;
        }
        for (let v = 0; v <= MAX_G; v += 3) {
            g += `<text class="axis-text" x="${gx(v, MAX_G).toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${v}</text>`;
        }
        g += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        g += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        g += `<text class="axis-title" x="${(GRAPH.x0 + GRAPH.x1) / 2}" y="${GRAPH.y0 + 30}" text-anchor="middle">넣은 마그네슘 (g)</text>`;
        g += `<text class="axis-title" x="${GRAPH.x0}" y="${GRAPH.y1 - 6}">산화마그네슘 (g)</text>`;
        const pts = [];
        for (let v = 0; v <= MAX_G; v += 0.25) pts.push(`${gx(v, MAX_G).toFixed(1)},${gy(react(v, ox()).product, 0, yMax).toFixed(1)}`);
        g += `<path class="trace" style="stroke:#059669" d="M${pts.join('L')}"/>`;
        const knee = (ox() * R_MG) / R_OX;
        if (ox() > 0 && knee <= MAX_G) {
            g += `<line class="knee-line" x1="${gx(knee, MAX_G).toFixed(1)}" y1="${GRAPH.y1}" x2="${gx(knee, MAX_G).toFixed(1)}" y2="${GRAPH.y0}"/>`;
            const flip = gx(knee, MAX_G) > (GRAPH.x0 + GRAPH.x1) / 2;
            g += `<text class="knee-text" x="${(gx(knee, MAX_G) + (flip ? -5 : 5)).toFixed(1)}" y="${GRAPH.y1 + 10}"${flip ? ' text-anchor="end"' : ''}>산소가 다 쓰이는 ${knee.toFixed(1)} g</text>`;
        }
        g += `<circle class="trace-dot" cx="${gx(mg(), MAX_G).toFixed(1)}" cy="${gy(a.product, 0, yMax).toFixed(1)}" r="5" fill="#d97706"/>`;
        graphGroup.innerHTML = g;

        stageBadge.textContent = `${a.before.toFixed(1)} g → ${a.after.toFixed(1)} g`;
        mgOutput.textContent = `${mg().toFixed(1)} g`;
        oxOutput.textContent = `${ox().toFixed(1)} g`;
        dataNote.innerHTML =
            `<div class="data-row"><span class="data-name">반응한 질량</span><span class="data-val">Mg ${a.mgUsed.toFixed(1)} g + O ${a.oxUsed.toFixed(1)} g → MgO ${a.product.toFixed(1)} g</span></div>` +
            `<div class="data-row${a.product > 0 ? ' match' : ''}"><span class="data-name">화합물의 질량비</span><span class="data-val">${a.product > 0 ? `${a.mgUsed.toFixed(1)} : ${a.oxUsed.toFixed(1)} = ${R_MG} : ${R_OX} (항상 일정)` : '반응 없음'}</span></div>` +
            `<div class="data-row match"><span class="data-name">전체 질량</span><span class="data-val">반응 전 ${a.before.toFixed(1)} g = 반응 후 ${a.after.toFixed(1)} g</span></div>`;
    }

    function renderHeat() {
        const r = REACTIONS[rxn], t = elapsed(), temp = tempAt(t);
        const warming = r.delta > 0;
        let out = '';
        const BX = { x0: 160, x1: 290, top: 44, bottom: 160 };
        out += `<rect class="vessel-fill" x="${BX.x0 + 2}" y="80" width="${BX.x1 - BX.x0 - 4}" height="${BX.bottom - 80}" fill="${warming ? 'rgba(255,140,100,.28)' : 'rgba(120,190,240,.28)'}"/>`;
        out += `<path class="vessel" fill="none" d="M${BX.x0},${BX.top} L${BX.x0},${BX.bottom} L${BX.x1},${BX.bottom} L${BX.x1},${BX.top}"/>`;
        const frac = Math.max(0, Math.min(1, (temp - (T0 - 20)) / 50));
        const TX = 312;
        out += `<rect class="therm-tube" x="${TX}" y="52" width="10" height="96" rx="5"/>`;
        out += `<rect class="therm-fill${warming ? '' : ' cold'}" x="${TX + 2}" y="${(144 - 90 * frac).toFixed(1)}" width="6" height="${(90 * frac + 4).toFixed(1)}" rx="3"/>`;
        out += `<text class="rxn-label" x="${TX + 18}" y="76">${temp.toFixed(1)} ℃</text>`;
        out += `<text class="axis-text" x="${TX + 18}" y="92">시작 ${T0} ℃</text>`;
        out += `<text class="rxn-label" x="${(BX.x0 + BX.x1) / 2}" y="182" text-anchor="middle">${r.name}</text>`;
        out += `<text class="rxn-kind" fill="${warming ? '#ea580c' : '#0284c7'}" x="${(BX.x0 + BX.x1) / 2}" y="200" text-anchor="middle">${r.kind} 반응 · 주위 온도 ${warming ? '상승' : '하강'}</text>`;
        mainGroup.innerHTML = out;

        const lo = 0, hi = 50;
        let g = '';
        for (let v = lo; v <= hi; v += 10) {
            g += `<line class="grid-line" x1="${GRAPH.x0}" y1="${gy(v, lo, hi).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(v, lo, hi).toFixed(1)}"/>`;
            g += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(gy(v, lo, hi) + 3).toFixed(1)}" text-anchor="end">${v}</text>`;
        }
        for (let s = 0; s <= 60; s += 15) {
            g += `<text class="axis-text" x="${gx(s, 60).toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${s}</text>`;
        }
        g += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        g += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        g += `<text class="axis-title" x="${(GRAPH.x0 + GRAPH.x1) / 2}" y="${GRAPH.y0 + 30}" text-anchor="middle">시간 (초)</text>`;
        g += `<text class="axis-title" x="${GRAPH.x0}" y="${GRAPH.y1 - 6}">온도 (℃)</text>`;
        g += `<line class="base-line" x1="${GRAPH.x0}" y1="${gy(T0, lo, hi).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(T0, lo, hi).toFixed(1)}"/>`;
        g += `<text class="axis-text" x="${GRAPH.x1 - 4}" y="${(gy(T0, lo, hi) - 5).toFixed(1)}" text-anchor="end">시작 온도 ${T0} ℃</text>`;
        Object.entries(REACTIONS).forEach(([key, rr]) => {
            const pts = [];
            for (let s = 0; s <= 60; s += 1) {
                pts.push(`${gx(s, 60).toFixed(1)},${gy(T0 + rr.delta * (1 - Math.exp(-s / rr.tau)), lo, hi).toFixed(1)}`);
            }
            const col = rr.delta > 0 ? '#ea580c' : '#0284c7';
            g += `<path class="trace" style="stroke:${col};opacity:${key === rxn ? 1 : .32}" d="M${pts.join('L')}"/>`;
        });
        g += `<circle class="trace-dot" cx="${gx(t, 60).toFixed(1)}" cy="${gy(temp, lo, hi).toFixed(1)}" r="5" fill="#d97706"/>`;
        graphGroup.innerHTML = g;

        stageBadge.textContent = `${r.kind} · ${temp.toFixed(1)} ℃`;
        timeOutput.textContent = `${t.toFixed(0)} 초`;
        dataNote.innerHTML =
            `<div class="data-row"><span class="data-name">반응</span><span class="data-val">${r.name}</span></div>` +
            `<div class="data-row"><span class="data-name">온도 변화</span><span class="data-val">${T0} ℃ → ${temp.toFixed(1)} ℃ (${r.delta > 0 ? '+' : ''}${(temp - T0).toFixed(1)} ℃)</span></div>` +
            `<div class="data-row match"><span class="data-name">종류</span><span class="data-val">${r.kind} 반응 — 열을 ${r.delta > 0 ? '내놓아 주위가 따뜻해집니다' : '흡수해 주위가 차가워집니다'}</span></div>`;
    }

    const render = () => (mode === 'mass' ? renderMass() : renderHeat());
    const clearResult = () => { resultEmpty.hidden = false; resultContent.hidden = true; };

    function showResult() {
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        if (mode === 'mass') {
            const a = react();
            labelA.textContent = '만들어진 산화마그네슘';
            labelB.textContent = '남은 물질';
            valueA.textContent = `${a.product.toFixed(1)} g`;
            valueB.textContent = a.mgLeft > 1e-9 ? `Mg ${a.mgLeft.toFixed(1)} g`
                : a.oxLeft > 1e-9 ? `O ${a.oxLeft.toFixed(1)} g` : '없음';
            predictionResult.textContent = !prediction
                ? '다음에는 결과를 먼저 예상해 보세요.'
                : prediction === 'same' ? '예상이 맞았습니다.' : '예상과 다른 결과입니다. 전체 질량은 변하지 않습니다.';
            explanation.textContent =
                `마그네슘과 산소는 언제나 ${R_MG} : ${R_OX} 의 질량비로 반응합니다. ` +
                (a.limiting === 'mg' ? `산소가 넉넉해 마그네슘 ${a.mgUsed.toFixed(1)} g이 모두 반응하고 산소 ${a.oxLeft.toFixed(1)} g이 남습니다. `
                : a.limiting === 'ox' ? `산소 ${a.oxUsed.toFixed(1)} g이 먼저 다 쓰여 마그네슘 ${a.mgLeft.toFixed(1)} g이 남습니다. `
                : a.limiting === 'exact' ? `두 물질이 꼭 맞는 비율이라 남는 것 없이 모두 반응합니다. ` : `한쪽이 없어 반응이 일어나지 않습니다. `) +
                `반응 전 ${a.before.toFixed(1)} g과 반응 후 ${a.after.toFixed(1)} g이 같아 저울은 수평을 유지합니다. 원자가 새로 생기거나 사라지지 않기 때문입니다.`;
        } else {
            const r = REACTIONS[rxn], t = elapsed(), temp = tempAt(t);
            labelA.textContent = '지금 온도';
            labelB.textContent = '반응의 종류';
            valueA.textContent = `${temp.toFixed(1)} ℃`;
            valueB.textContent = r.kind;
            predictionResult.textContent = `${r.kind} 반응이므로 주위 온도가 ${r.delta > 0 ? '올라갑니다' : '내려갑니다'}.`;
            explanation.textContent =
                `${r.name}은 ${r.kind} 반응입니다. 반응이 진행되면서 온도가 ${T0} ℃ 에서 ${temp.toFixed(1)} ℃로 ` +
                `${r.delta > 0 ? '올라갑니다' : '내려갑니다'}. ` +
                `${r.delta > 0 ? '반응물이 가지고 있던 에너지 일부가 열로 빠져나와 주위를 데웁니다.' : '반응이 진행되려면 에너지가 필요해 주위에서 열을 빼앗아 가므로 주위가 차가워집니다.'}`;
        }
    }

    function frame(now) {
        const tt = now / 1000;
        const dt = lastT === null ? 1 / 60 : Math.min(1 / 20, tt - lastT);
        lastT = tt;
        if (playing) {
            animT = Math.min(60, animT + dt * 12);
            timeRange.value = String(Math.round(animT));
            render();
            if (animT >= 60) { playing = false; runBtn.textContent = '결과 확인하기'; }
            rafId = playing ? requestAnimationFrame(frame) : null;
            if (!playing) lastT = null;
        } else { rafId = null; lastT = null; }
    }

    runBtn.addEventListener('click', () => {
        if (mode === 'mass') { showResult(); return; }
        playing = !playing;
        runBtn.textContent = playing ? '멈추기' : '결과 확인하기';
        if (playing) {
            animT = Number(timeRange.value);
            if (animT >= 60) animT = 0;
            showResult();
            if (rafId === null) { lastT = null; rafId = requestAnimationFrame(frame); }
        } else {
            timeRange.value = String(Math.round(elapsed()));
            animT = null; render();
        }
    });
    resetBtn.addEventListener('click', () => {
        playing = false; animT = null;
        if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; lastT = null; }
        runBtn.textContent = mode === 'mass' ? '결과 확인하기' : '반응 시작';
        timeRange.value = '0';
        clearResult();
        stageCaption.textContent = mode === 'mass'
            ? '반응 전과 후의 전체 질량을 저울로 비교해 보세요.'
            : '반응을 골라 온도가 오르는지 내리는지 확인해 보세요.';
        render();
    });
    modeButtons.forEach(button => button.addEventListener('click', () => {
        mode = button.dataset.mode;
        modeButtons.forEach(item => item.classList.toggle('selected', item === button));
        massControls.hidden = mode !== 'mass';
        heatControls.hidden = mode !== 'heat';
        resetBtn.click();
    }));
    rxnButtons.forEach(button => button.addEventListener('click', () => {
        rxn = button.dataset.rxn;
        rxnButtons.forEach(item => item.classList.toggle('selected', item === button));
        animT = null; render(); if (!resultContent.hidden) showResult();
    }));
    [mgRange, oxRange, timeRange].forEach(el => el.addEventListener('input', () => {
        animT = null; render(); if (!resultContent.hidden) showResult();
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

    window.__massModel = {
        R_MG, R_OX, R_PROD, MAX_G, REACTIONS, T0, react, tempAt,
        setMode(m) { document.querySelector(`[data-mode="${m}"]`).click(); },
        setRxn(r) { document.querySelector(`[data-rxn="${r}"]`).click(); },
        setMg(v) { mgRange.value = String(v); mgRange.dispatchEvent(new Event('input')); },
        setOx(v) { oxRange.value = String(v); oxRange.dispatchEvent(new Event('input')); },
        setTime(v) { timeRange.value = String(v); timeRange.dispatchEvent(new Event('input')); },
        mg, ox, elapsed, render,
    };

    resetBtn.click();
});
