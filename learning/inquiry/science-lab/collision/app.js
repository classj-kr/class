document.addEventListener('DOMContentLoaded', () => {
    const kindButtons = [...document.querySelectorAll('[data-kind]')];
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const m1Range = document.getElementById('m1Range');
    const m2Range = document.getElementById('m2Range');
    const v1Range = document.getElementById('v1Range');
    const m1Output = document.getElementById('m1Output');
    const m2Output = document.getElementById('m2Output');
    const v1Output = document.getElementById('v1Output');
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

    const TRACK_Y = 132, X0 = 30, PX_PER_M = 38, TRACK_M = 10.4;
    const CART_M = 0.7, CART_H = 26;
    const START1 = 0.4, START2 = 5.4;
    const GRAPH = { x0: 96, x1: 424 };
    const E_OF = { elastic: 1, partial: 0.5, stick: 0 };
    const KIND_NAME = { elastic: '탄성 충돌', partial: '비탄성 충돌', stick: '완전비탄성 충돌' };

    let kind = 'elastic';
    let prediction = null;
    let sim = null, running = false, frameId = 0, lastStamp = 0;

    const m1 = () => Number(m1Range.value);
    const m2 = () => Number(m2Range.value);
    const v1 = () => Number(v1Range.value);

    function analyse(k = kind, M1 = m1(), M2 = m2(), V1 = v1(), V2 = 0) {
        const e = E_OF[k];
        // one-dimensional collision with restitution e
        const after1 = ((M1 - e * M2) * V1 + (1 + e) * M2 * V2) / (M1 + M2);
        const after2 = ((M2 - e * M1) * V2 + (1 + e) * M1 * V1) / (M1 + M2);
        const pBefore = M1 * V1 + M2 * V2;
        const pAfter = M1 * after1 + M2 * after2;
        const kBefore = 0.5 * M1 * V1 * V1 + 0.5 * M2 * V2 * V2;
        const kAfter = 0.5 * M1 * after1 * after1 + 0.5 * M2 * after2 * after2;
        const verdict = after1 > 0.02 ? 'forward' : after1 < -0.02 ? 'back' : 'stop';
        return { e, kind: k, m1: M1, m2: M2, v1: V1, v2: V2, after1, after2,
                 pBefore, pAfter, kBefore, kAfter, lost: kBefore - kAfter,
                 lostPct: kBefore > 0 ? ((kBefore - kAfter) / kBefore) * 100 : 0, verdict };
    }

    function freshSim(a = analyse()) {
        return { t: 0, x1: START1, x2: START2, v1: a.v1, v2: a.v2, hit: false, flash: 0, done: false };
    }

    // Advance both carts, stopping exactly at the moment of contact.
    function step(s, dt, a) {
        let left = dt;
        for (let guard = 0; guard < 4 && left > 1e-9; guard += 1) {
            let move = left;
            if (!s.hit) {
                const gap = s.x2 - (s.x1 + CART_M);
                const closing = s.v1 - s.v2;
                if (closing > 1e-9) {
                    const tc = gap / closing;
                    if (tc <= left) move = Math.max(0, tc);
                }
            }
            s.x1 += s.v1 * move;
            s.x2 += s.v2 * move;
            s.t += move;
            left -= move;
            if (!s.hit && s.x2 - (s.x1 + CART_M) <= 1e-9) {
                s.v1 = a.after1; s.v2 = a.after2; s.hit = true; s.flash = 0.35;
            } else if (move === 0) break;
        }
        if (s.flash > 0) s.flash = Math.max(0, s.flash - dt);
        if (s.x1 < -0.6 || s.x2 + CART_M > TRACK_M + 0.6 || s.t > 8) s.done = true;
        return s.done;
    }

    const px = m => X0 + m * PX_PER_M;

    function cart(x, w, cls, label) {
        const x0 = px(x), width = w * PX_PER_M;
        let out = `<rect class="cart ${cls}" x="${x0.toFixed(1)}" y="${TRACK_Y - CART_H}" width="${width.toFixed(1)}" height="${CART_H}" rx="4"/>`;
        out += `<text class="cart-text" x="${(x0 + width / 2).toFixed(1)}" y="${TRACK_Y - CART_H / 2 + 4}" text-anchor="middle">${label}</text>`;
        [0.25, 0.75].forEach(f => {
            out += `<circle class="wheel" cx="${(x0 + width * f).toFixed(1)}" cy="${TRACK_Y + 4}" r="4.4"/>`;
        });
        return out;
    }

    function arrow(cx, y, v, cls) {
        if (Math.abs(v) < 0.03) return `<text class="small-label" x="${cx.toFixed(1)}" y="${y + 4}" text-anchor="middle">정지</text>`;
        const len = Math.min(52, 10 + Math.abs(v) * 9) * Math.sign(v);
        const tip = cx + len;
        return `<line class="vel-arrow ${cls}" x1="${cx.toFixed(1)}" y1="${y}" x2="${tip.toFixed(1)}" y2="${y}"/>` +
               `<path class="vel-arrow ${cls}" d="M${(tip - Math.sign(v) * 6).toFixed(1)},${y - 5} L${tip.toFixed(1)},${y} L${(tip - Math.sign(v) * 6).toFixed(1)},${y + 5}"/>`;
    }

    function renderMain(a, s) {
        let body = '';
        body += `<line class="track" x1="${px(0)}" y1="${TRACK_Y + 9}" x2="${px(TRACK_M)}" y2="${TRACK_Y + 9}"/>`;
        for (let m = 0; m <= TRACK_M; m += 1) {
            body += `<line class="track-tick" x1="${px(m).toFixed(1)}" y1="${TRACK_Y + 9}" x2="${px(m).toFixed(1)}" y2="${TRACK_Y + 15}"/>`;
        }
        body += cart(s.x1, CART_M, 'one', `${a.m1}kg`);
        body += cart(s.x2, CART_M, 'two', `${a.m2}kg`);
        body += arrow(px(s.x1 + CART_M / 2), TRACK_Y - CART_H - 14, s.v1, 'one');
        body += arrow(px(s.x2 + CART_M / 2), TRACK_Y - CART_H - 34, s.v2, 'two');
        if (s.flash > 0) {
            const r = 10 + (0.35 - s.flash) * 60;
            body += `<circle class="flash" cx="${px(s.x1 + CART_M).toFixed(1)}" cy="${TRACK_Y - CART_H / 2}" r="${r.toFixed(1)}" opacity="${(s.flash / 0.35).toFixed(2)}"/>`;
        }
        let out = `<g clip-path="url(#trackClip)">${body}</g>`;
        out += `<text class="part-label" x="20" y="20">${KIND_NAME[a.kind]} (e = ${a.e}) · ${a.m1} kg이 ${a.v1} m/s로 ${a.m2} kg을 칩니다</text>`;
        const tone = s.hit ? '#059669' : '#d97706';
        out += `<text class="phase-text" fill="${tone}" x="20" y="176">${s.hit ? '충돌 뒤' : '충돌 전'} · ${s.t.toFixed(2)} 초</text>`;
        out += `<text class="read-text" x="20" y="196">수레 1 ${s.v1.toFixed(2)} m/s · 수레 2 ${s.v2.toFixed(2)} m/s</text>`;
        mainGroup.innerHTML = out;
    }

    function bar(y, label, value, max, colour, unit) {
        const w = max > 0 ? ((value / max) * (GRAPH.x1 - GRAPH.x0)) : 0;
        let out = `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${y + 4}" text-anchor="end">${label}</text>`;
        out += `<rect class="bar" x="${GRAPH.x0}" y="${y - 7}" width="${Math.max(1, w).toFixed(1)}" height="15" rx="3" fill="${colour}" opacity=".85"/>`;
        const flip = GRAPH.x0 + w > GRAPH.x1 - 70;
        out += `<text class="bar-text" style="fill:${flip ? '#ffffff' : colour}" x="${(GRAPH.x0 + w + (flip ? -6 : 6)).toFixed(1)}" y="${y + 4}"${flip ? ' text-anchor="end"' : ''}>${value.toFixed(2)} ${unit}</text>`;
        return out;
    }

    function renderGraph(a) {
        const pMax = Math.max(a.pBefore, a.pAfter) * 1.18 || 1;
        const kMax = Math.max(a.kBefore, a.kAfter) * 1.18 || 1;
        let out = '';
        out += `<text class="axis-title" x="20" y="26">두 수레 운동량 합 — 외부 충격량 무시</text>`;
        out += bar(50, '충돌 전', a.pBefore, pMax, '#059669', '');
        out += bar(76, '충돌 후', a.pAfter, pMax, '#059669', '');
        const pLine = GRAPH.x0 + (a.pBefore / pMax) * (GRAPH.x1 - GRAPH.x0);
        out += `<line class="keep-line" x1="${pLine.toFixed(1)}" y1="36" x2="${pLine.toFixed(1)}" y2="90"/>`;

        out += `<text class="axis-title" x="20" y="118">운동 에너지 (J) — 탄성 충돌에서만 보존</text>`;
        out += bar(142, '충돌 전', a.kBefore, kMax, '#d97706', 'J');
        out += bar(168, '충돌 후', a.kAfter, kMax, a.lost > 1e-9 ? '#ea580c' : '#d97706', 'J');
        const kLine = GRAPH.x0 + (a.kBefore / kMax) * (GRAPH.x1 - GRAPH.x0);
        out += `<line class="keep-line" x1="${kLine.toFixed(1)}" y1="128" x2="${kLine.toFixed(1)}" y2="182"/>`;
        if (a.lost > 1e-9) {
            out += `<text class="lost-text" x="${GRAPH.x1}" y="126" text-anchor="end">${a.lost.toFixed(2)} J (${a.lostPct.toFixed(0)}%)이 소리·열로</text>`;
        } else {
            out += `<text class="keep-text" x="${GRAPH.x1}" y="126" text-anchor="end">줄어든 에너지가 없습니다</text>`;
        }
        graphGroup.innerHTML = out;
    }

    function render() {
        const a = analyse();
        if (!sim) sim = freshSim(a);
        renderMain(a, sim);
        renderGraph(a);
        m1Output.textContent = `${a.m1} kg`;
        m2Output.textContent = `${a.m2} kg`;
        v1Output.textContent = `${a.v1.toFixed(1)} m/s`;
        stageBadge.textContent = `${KIND_NAME[a.kind]} · ${VERDICT[a.verdict]}`;
        dataNote.innerHTML =
            `<div class="data-row"><span class="data-name">충돌 뒤 속도</span><span class="data-val">수레 1 ${a.after1.toFixed(2)} m/s · 수레 2 ${a.after2.toFixed(2)} m/s</span></div>` +
            `<div class="data-row"><span class="data-name">운동량</span><span class="data-val">${a.pBefore.toFixed(2)} → ${a.pAfter.toFixed(2)} kg·m/s (차이 ${Math.abs(a.pAfter - a.pBefore).toExponential(1)})</span></div>` +
            `<div class="data-row"><span class="data-name">운동 에너지</span><span class="data-val">${a.kBefore.toFixed(2)} → ${a.kAfter.toFixed(2)} J</span></div>` +
            `<div class="data-row"><span class="data-name">반발 계수</span><span class="data-val">(${a.after2.toFixed(2)} − ${sn(a.after1)}) ÷ ${a.v1.toFixed(1)} = ${a.e}</span></div>` +
            `<div class="data-row match"><span class="data-name">수레 1</span><span class="data-val">${VERDICT[a.verdict]}</span></div>`;
        return a;
    }

    const VERDICT = { forward: '계속 앞으로', stop: '그 자리에 선다', back: '뒤로 튕긴다' };
    // a bounced-back speed is negative, and "1×-2.00" needs brackets to read
    const sn = v => (v < 0 ? `(−${Math.abs(v).toFixed(2)})` : v.toFixed(2));

    function stopRun() { running = false; if (frameId) cancelAnimationFrame(frameId); frameId = 0; }

    function tick(dt) {
        const a = analyse();
        const done = step(sim, dt, a);
        render();
        return done;
    }

    function frame(stamp) {
        if (!running) return;
        const dt = Math.min(0.04, (stamp - lastStamp) / 1000 || 0);
        lastStamp = stamp;
        if (tick(dt)) { stopRun(); finish(); } else frameId = requestAnimationFrame(frame);
    }

    function startRun() {
        stopRun();
        sim = freshSim(analyse());
        running = true;
        lastStamp = performance.now();
        render();
        frameId = requestAnimationFrame(frame);
    }

    function finish() {
        const a = render();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        valueA.textContent = `${a.after1.toFixed(2)} / ${a.after2.toFixed(2)} m/s`;
        valueB.textContent = a.lost > 1e-9 ? `${a.kAfter.toFixed(2)} J (${a.lostPct.toFixed(0)}% 감소)` : `${a.kAfter.toFixed(2)} J (보존)`;
        predictionResult.textContent = !prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        let s = `충돌 전 운동량은 ${a.m1}×${a.v1.toFixed(1)} = ${a.pBefore.toFixed(2)} kg·m/s 입니다. `;
        s += `충돌 뒤 ${a.m1}×${sn(a.after1)} + ${a.m2}×${sn(a.after2)} = ${a.pAfter.toFixed(2)} kg·m/s로 정확히 같습니다. `;
        s += `외부 충격량을 무시한 두 수레계에서 운동량 합이 보존됩니다. `;
        if (a.lost > 1e-9) {
            s += `반면 운동 에너지는 ${a.kBefore.toFixed(2)} J 에서 ${a.kAfter.toFixed(2)} J로 ${a.lostPct.toFixed(0)}% 줄었습니다. ` +
                 `줄어든 ${a.lost.toFixed(2)} J은 충돌 소리와 열, 수레의 변형으로 바뀐 것이지 사라진 것이 아닙니다. `;
        } else {
            s += `탄성 충돌이라 운동 에너지도 ${a.kBefore.toFixed(2)} J 그대로 보존되었습니다. `;
        }
        if (a.verdict === 'back') {
            s += `수레 1의 질량 ${a.m1} kg이 e×m₂ = ${(a.e * a.m2).toFixed(1)} kg보다 작아 충돌 뒤 속도가 음수가 되었습니다. 그래서 뒤로 튕겨 나옵니다.`;
        } else if (a.verdict === 'stop') {
            s += `수레 1의 질량이 e×m₂ = ${(a.e * a.m2).toFixed(1)} kg과 같아 충돌 뒤 속도가 정확히 0이 되었습니다. 가진 운동량을 모두 넘겨주고 그 자리에 섭니다.`;
        } else if (a.kind === 'stick') {
            s += `완전비탄성이라 두 수레가 붙어 ${a.after1.toFixed(2)} m/s로 함께 갑니다. 이때 운동 에너지가 가장 많이 줄어듭니다.`;
        } else {
            s += `수레 1의 질량이 e×m₂ = ${(a.e * a.m2).toFixed(1)} kg보다 커서 충돌 뒤에도 앞으로 나아갑니다.`;
        }
        explanation.textContent = s;
    }

    function changed() {
        stopRun();
        sim = freshSim(analyse());
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        render();
    }

    [m1Range, m2Range, v1Range].forEach(el => el.addEventListener('input', changed));
    kindButtons.forEach(button => button.addEventListener('click', () => {
        kind = button.dataset.kind;
        kindButtons.forEach(item => item.classList.toggle('selected', item === button));
        changed();
    }));
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        m1Range.value = '2'; m2Range.value = '2'; v1Range.value = '3';
        prediction = null;
        predictionButtons.forEach(item => item.classList.remove('selected'));
        stageCaption.textContent = '이 모형은 외부 충격량을 무시하므로 두 수레의 운동량 합이 충돌 전후 같습니다. 운동 에너지는 그렇지 않습니다.';
        kindButtons.find(b => b.dataset.kind === 'elastic').click();
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

    window.__collideModel = {
        TRACK_Y, X0, PX_PER_M, CART_M, START1, START2, E_OF, analyse, freshSim, step, render, check: finish,
        setKind(k) { kindButtons.find(b => b.dataset.kind === k).click(); },
        setM1(v) { m1Range.value = String(v); changed(); },
        setM2(v) { m2Range.value = String(v); changed(); },
        setV1(v) { v1Range.value = String(v); changed(); },
        runToEnd(dt = 1 / 120, cap = 4000) {
            stopRun(); sim = freshSim(analyse());
            let n = 0; while (!tick(dt) && n < cap) n += 1;
            finish(); return { steps: n, t: sim.t, hit: sim.hit };
        },
        getSim: () => sim, tick,
    };

    resetBtn.click();
});
