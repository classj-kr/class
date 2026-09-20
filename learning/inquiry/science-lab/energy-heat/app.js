document.addEventListener('DOMContentLoaded', () => {
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const heightRange = document.getElementById('heightRange');
    const angleRange = document.getElementById('angleRange');
    const frictionRange = document.getElementById('frictionRange');
    const heightOutput = document.getElementById('heightOutput');
    const angleOutput = document.getElementById('angleOutput');
    const frictionOutput = document.getElementById('frictionOutput');
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

    const MASS = 2, G = 9.8;
    const GROUND_Y = 172, RAMP_X0 = 44, PX_PER_M = 25;
    const GRAPH = { x0: 66, x1: 424, y0: 156, y1: 34 };

    let prediction = null;
    let sim = null, running = false, frameId = 0, lastStamp = 0;

    const height = () => Number(heightRange.value);
    const angle = () => Number(angleRange.value);
    const mu = () => Number(frictionRange.value);

    function analyse(h = height(), deg = angle(), m = mu()) {
        const th = (deg * Math.PI) / 180;
        const sin = Math.sin(th), cos = Math.cos(th), tan = Math.tan(th);
        const slope = h / sin;                       // metres down the ramp
        const total = MASS * G * h;                  // everything starts as height
        // it only slides when gravity down the slope beats the most friction can hold
        const accel = G * (sin - m * cos);
        const stuck = accel <= 1e-9;
        const lostFrac = stuck ? 0 : Math.min(1, m / tan);
        const heat = stuck ? 0 : total * lostFrac;
        const ke = stuck ? 0 : total - heat;
        const speed = Math.sqrt(Math.max(0, (2 * ke) / MASS));
        const fall = stuck ? Infinity : Math.sqrt((2 * slope) / accel);
        const verdict = stuck ? 'most' : lostFrac < 0.2 ? 'little' : lostFrac < 0.6 ? 'half' : 'most';
        return { h, deg, mu: m, th, sin, cos, tan, slope, total, accel, stuck,
                 lostFrac, heat, ke, speed, fall, verdict };
    }

    // Energy split at any distance travelled down the ramp. A cart that never
    // slides stays at the top, so it keeps the whole lot as height.
    function at(d, a) {
        if (a.stuck) return { d: 0, pe: a.total, heat: 0, ke: 0, v: 0 };
        const dd = Math.max(0, Math.min(a.slope, d));
        const pe = MASS * G * (a.h - dd * a.sin);
        const heat = a.mu * MASS * G * a.cos * dd;
        const ke = Math.max(0, a.total - pe - heat);
        return { d: dd, pe, heat, ke, v: Math.sqrt((2 * ke) / MASS) };
    }

    const freshSim = () => ({ t: 0, d: 0, done: false });

    function step(s, dt, a) {
        if (a.stuck) { s.t += dt; if (s.t > 1.6) s.done = true; return s.done; }
        s.t += dt;
        s.d = 0.5 * a.accel * s.t * s.t;
        if (s.d >= a.slope) { s.d = a.slope; s.done = true; }
        return s.done;
    }

    function renderMain(a, s) {
        const topY = GROUND_Y - a.h * PX_PER_M;
        const baseLen = (a.h / a.tan) * PX_PER_M;
        const botX = RAMP_X0 + baseLen;
        const st = at(s.d, a);
        let body = '';
        body += `<rect class="ground" x="20" y="${GROUND_Y}" width="420" height="16"/>`;
        body += `<path class="ramp${a.stuck ? ' stuck' : ''}" d="M${RAMP_X0},${topY.toFixed(1)} L${botX.toFixed(1)},${GROUND_Y} L${RAMP_X0},${GROUND_Y} Z"/>`;
        body += `<line class="height-line" x1="${RAMP_X0}" y1="${topY.toFixed(1)}" x2="${RAMP_X0}" y2="${GROUND_Y}"/>`;
        body += `<text class="small-label" x="${RAMP_X0 - 6}" y="${((topY + GROUND_Y) / 2).toFixed(1)}" text-anchor="end">h ${a.h} m</text>`;
        const arcR = Math.min(34, baseLen * 0.6);
        body += `<path class="angle-arc" d="M${(botX - arcR).toFixed(1)},${GROUND_Y} A${arcR.toFixed(1)} ${arcR.toFixed(1)} 0 0 1 ` +
                `${(botX - arcR * a.cos).toFixed(1)},${(GROUND_Y - arcR * a.sin).toFixed(1)}"/>`;
        // inside the arc, not left of it: a short steep ramp puts the two labels together
        body += `<text class="small-label" x="${(botX - arcR / 2).toFixed(1)}" y="${GROUND_Y - 6}" text-anchor="middle">${a.deg}°</text>`;

        // the cart, wherever it has slid to
        const f = a.slope > 0 ? st.d / a.slope : 0;
        const cx = RAMP_X0 + (botX - RAMP_X0) * f;
        const cy = topY + (GROUND_Y - topY) * f;
        body += `<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${a.deg})">`;
        body += `<rect class="cart" x="-13" y="-19" width="26" height="15" rx="3"/>`;
        body += `<circle class="wheel" cx="-7" cy="-3" r="3.6"/><circle class="wheel" cx="7" cy="-3" r="3.6"/>`;
        body += `</g>`;
        // heat shimmering off the contact patch when friction is doing work
        if (!a.stuck && a.mu > 0 && st.d > 0.01 && st.d < a.slope) {
            for (let i = 0; i < 3; i += 1) {
                body += `<path class="heat-wave" opacity=".8" d="M${(cx - 8 + i * 8).toFixed(1)},${(cy + 6).toFixed(1)} q3,-5 0,-9">` +
                        `<animate attributeName="opacity" values="0;.9;0" dur="0.7s" begin="${(i * 0.22).toFixed(2)}s" repeatCount="indefinite"/></path>`;
            }
        }
        if (a.stuck) {
            body += `<path class="stuck-mark" d="M${(cx - 16).toFixed(1)},${(cy - 26).toFixed(1)} l10,10 M${(cx - 6).toFixed(1)},${(cy - 26).toFixed(1)} l-10,10"/>`;
        }
        let out = `<g clip-path="url(#rampClip)">${body}</g>`;
        out += `<text class="part-label" x="20" y="20">h ${a.h} m · θ ${a.deg}° · μ ${a.mu.toFixed(2)} · 빗면 길이 ${a.slope.toFixed(2)} m</text>`;
        if (a.stuck) {
            out += `<text class="warn-text" x="20" y="196">μ ${a.mu.toFixed(2)}가 tan ${a.deg}° = ${a.tan.toFixed(2)}보다 커서 수레가 미끄러지지 않습니다</text>`;
        } else {
            out += `<text class="read-text" x="20" y="196">지금 속력 ${st.v.toFixed(2)} m/s · 위치 ${st.pe.toFixed(1)} J · 운동 ${st.ke.toFixed(1)} J · 열 ${st.heat.toFixed(1)} J</text>`;
        }
        out += `<text class="note-text" x="20" y="210">세 값을 더하면 언제나 ${a.total.toFixed(1)} J 입니다</text>`;
        mainGroup.innerHTML = out;
    }

    function renderGraph(a, s) {
        const gx = d => GRAPH.x0 + (a.slope > 0 ? d / a.slope : 0) * (GRAPH.x1 - GRAPH.x0);
        const top = a.total * 1.15;
        const gy = e => GRAPH.y0 - (e / top) * (GRAPH.y0 - GRAPH.y1);
        let out = '';
        // from 1: a zero label here would sit on the zero of the x axis
        for (let i = 1; i <= 4; i += 1) {
            const e = (top / 4) * i;
            out += `<line class="grid-line" x1="${GRAPH.x0}" y1="${gy(e).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(e).toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(gy(e) + 3).toFixed(1)}" text-anchor="end">${e.toFixed(0)}</text>`;
        }
        [0, 0.25, 0.5, 0.75, 1].forEach(f => {
            out += `<text class="axis-text" x="${gx(a.slope * f).toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${(a.slope * f).toFixed(1)}</text>`;
        });
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-title" x="${((GRAPH.x0 + GRAPH.x1) / 2).toFixed(1)}" y="${GRAPH.y0 + 32}" text-anchor="middle">빗면을 내려온 거리 (m)</text>`;
        out += `<text class="axis-title" x="22" y="22">에너지 (J)</text>`;

        // three bands stacked to a flat top: position, motion, heat
        const N = 60;
        const peTop = [], keTop = [];
        for (let i = 0; i <= N; i += 1) {
            const d = (a.slope * i) / N, e = at(d, a);
            peTop.push([gx(d), gy(e.pe)]);
            keTop.push([gx(d), gy(e.pe + e.ke)]);
        }
        const area = (upper, lowerY) => `M${upper.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('L')}` +
            `L${upper[upper.length - 1][0].toFixed(1)},${lowerY.toFixed(1)} L${upper[0][0].toFixed(1)},${lowerY.toFixed(1)} Z`;
        out += `<path class="band-heat" d="${area(peTop.map((p, i) => [p[0], gy(a.total)]), gy(0))}"/>`;
        out += `<path class="band-ke" d="${area(keTop, gy(0))}"/>`;
        out += `<path class="band-pe" d="${area(peTop, gy(0))}"/>`;
        out += `<path class="band-edge" d="M${keTop.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('L')}"/>`;
        out += `<path class="band-edge" d="M${peTop.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('L')}"/>`;
        out += `<line class="total-line" x1="${GRAPH.x0}" y1="${gy(a.total).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(a.total).toFixed(1)}"/>`;
        out += `<text class="total-text" x="${GRAPH.x0 + 6}" y="${(gy(a.total) - 5).toFixed(1)}">전체 ${a.total.toFixed(1)} J — 어디에서나 같습니다</text>`;
        if (s && s.d > 0.001) out += `<line class="now-line" x1="${gx(s.d).toFixed(1)}" y1="${GRAPH.y1}" x2="${gx(s.d).toFixed(1)}" y2="${GRAPH.y0}"/>`;
        [['위치', '#0284c7'], ['운동', '#059669'], ['열', '#ff7d6b']].forEach(([n, c], i) => {
            out += `<rect x="${GRAPH.x0 + 150 + i * 74}" y="14" width="9" height="9" rx="2" fill="${c}"/>`;
            out += `<text class="legend-text" fill="${c}" x="${GRAPH.x0 + 163 + i * 74}" y="22">${n} 에너지</text>`;
        });
        graphGroup.innerHTML = out;
    }

    function render() {
        const a = analyse();
        if (!sim) sim = freshSim();
        renderMain(a, sim);
        renderGraph(a, sim);
        heightOutput.textContent = `${a.h.toFixed(1)} m`;
        angleOutput.textContent = `${a.deg}°`;
        frictionOutput.textContent = a.mu.toFixed(2);
        stageBadge.textContent = a.stuck ? '미끄러지지 않음' : `바닥 ${a.speed.toFixed(2)} m/s · 열 ${(a.lostFrac * 100).toFixed(0)}%`;
        dataNote.innerHTML = a.stuck
            ? `<div class="data-row"><span class="data-name">미끄러짐 조건</span><span class="data-val">μ ${a.mu.toFixed(2)} > tan ${a.deg}° = ${a.tan.toFixed(3)} → 정지</span></div>` +
              `<div class="data-row"><span class="data-name">빗면 방향 힘</span><span class="data-val">mg sin θ = ${(MASS * G * a.sin).toFixed(2)} N < 최대 마찰력 ${(a.mu * MASS * G * a.cos).toFixed(2)} N</span></div>` +
              `<div class="data-row match"><span class="data-name">결과</span><span class="data-val">움직이지 않아 에너지가 그대로 위치 에너지로 남습니다</span></div>`
            : `<div class="data-row"><span class="data-name">전체 에너지</span><span class="data-val">mgh = ${MASS}×${G}×${a.h} = ${a.total.toFixed(1)} J</span></div>` +
              `<div class="data-row"><span class="data-name">열로 바뀐 양</span><span class="data-val">μ/tan θ = ${a.mu.toFixed(2)}÷${a.tan.toFixed(3)} = ${(a.lostFrac * 100).toFixed(1)}% → ${a.heat.toFixed(1)} J</span></div>` +
              `<div class="data-row"><span class="data-name">바닥의 운동 에너지</span><span class="data-val">${a.total.toFixed(1)} − ${a.heat.toFixed(1)} = ${a.ke.toFixed(1)} J</span></div>` +
              `<div class="data-row"><span class="data-name">바닥에서의 속력</span><span class="data-val">√(2×${a.ke.toFixed(1)}÷${MASS}) = ${a.speed.toFixed(2)} m/s</span></div>` +
              `<div class="data-row match"><span class="data-name">내려오는 데</span><span class="data-val">${a.fall.toFixed(2)} 초 (가속도 ${a.accel.toFixed(2)} m/s²)</span></div>`;
        return a;
    }

    const VERDICT = { little: '거의 없다', half: '절반쯤', most: '대부분' };

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
        valueA.textContent = a.stuck ? '0 m/s (정지)' : `${a.speed.toFixed(2)} m/s`;
        valueB.textContent = a.stuck ? '움직이지 않음' : `${(a.lostFrac * 100).toFixed(0)}%`;
        predictionResult.textContent = !prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        if (a.stuck) {
            explanation.textContent =
                `빗면 방향으로 미는 힘은 mg sin θ = ${(MASS * G * a.sin).toFixed(2)} N 인데, 최대 마찰력은 μmg cos θ = ${(a.mu * MASS * G * a.cos).toFixed(2)} N 입니다. ` +
                `미는 힘이 더 작으므로 수레는 아예 움직이지 않습니다. μ ${a.mu.toFixed(2)}가 tan ${a.deg}° = ${a.tan.toFixed(2)}보다 클 때가 그런 경우입니다. ` +
                `질량은 양쪽 식에 똑같이 들어 있어 아무리 무거워도 결과가 달라지지 않습니다. ` +
                `에너지는 ${a.total.toFixed(1)} J이 그대로 위치 에너지로 남아 있습니다.`;
            return;
        }
        const free = analyse(a.h, a.deg, 0);
        let s = `처음 가진 에너지는 mgh = ${MASS}×${G}×${a.h} = ${a.total.toFixed(1)} J 입니다. `;
        s += `빗면을 ${a.slope.toFixed(2)} m 내려오는 동안 마찰력이 한 일만큼 열이 생기는데, 그 비율은 μ/tan θ = ${(a.lostFrac * 100).toFixed(1)}%로 ${a.heat.toFixed(1)} J 입니다. `;
        s += `남은 ${a.ke.toFixed(1)} J이 운동 에너지가 되어 바닥에서 ${a.speed.toFixed(2)} m/s로 달립니다. `;
        s += a.mu > 0
            ? `마찰이 없었다면 ${free.speed.toFixed(2)} m/s 였을 텐데 ${((1 - a.speed / free.speed) * 100).toFixed(0)}% 느려졌습니다. `
            : `마찰이 없어 위치 에너지가 남김없이 운동 에너지로 바뀌었습니다. `;
        s += `역학적 에너지만 보면 줄었지만 열까지 더하면 ${a.total.toFixed(1)} J 그대로입니다. 에너지는 없어지지 않고 형태만 바뀝니다. `;
        s += `높이가 같으면 기울기를 바꿔도 마찰이 없는 한 바닥에서의 속력은 늘 ${free.speed.toFixed(2)} m/s로 같습니다.`;
        explanation.textContent = s;
    }

    function changed() {
        stopRun();
        sim = freshSim();
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        render();
    }

    [heightRange, angleRange, frictionRange].forEach(el => el.addEventListener('input', changed));
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        heightRange.value = '4'; angleRange.value = '30'; frictionRange.value = '0';
        prediction = null;
        predictionButtons.forEach(item => item.classList.remove('selected'));
        stageCaption.textContent = '세 에너지를 합한 높이는 어디에서나 똑같습니다.';
        changed();
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

    window.__energyModel = {
        MASS, G, analyse, at, freshSim, step, render, check: finish,
        setHeight(v) { heightRange.value = String(v); changed(); },
        setAngle(v) { angleRange.value = String(v); changed(); },
        setMu(v) { frictionRange.value = String(v); changed(); },
        runToEnd(dt = 1 / 120, cap = 4000) {
            stopRun(); sim = freshSim();
            let n = 0; while (!tick(dt) && n < cap) n += 1;
            finish(); return { steps: n, t: sim.t, d: sim.d };
        },
        getSim: () => sim, tick,
    };

    resetBtn.click();
});
