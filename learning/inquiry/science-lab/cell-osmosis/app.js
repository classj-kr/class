document.addEventListener('DOMContentLoaded', () => {
    const cellButtons = [...document.querySelectorAll('[data-cell]')];
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const concRange = document.getElementById('concRange');
    const timeRange = document.getElementById('timeRange');
    const concOutput = document.getElementById('concOutput');
    const timeOutput = document.getElementById('timeOutput');
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
    const mainGroup = document.getElementById('mainGroup');
    const graphGroup = document.getElementById('graphGroup');
    const dataNote = document.getElementById('dataNote');

    // The cell's solute stays put while water crosses the membrane, so at
    // equilibrium the inside concentration matches the outside — which fixes
    // the final volume at V0 / C_out. Everything else follows from that.
    const C_IN0 = 1.0, V0 = 1.0;
    const BURST_V = 1.4;      // red cells haemolyse around 1.4x volume
    const TAU = 4.0;          // minutes
    const GRAPH = { x0: 54, x1: 420, y0: 146, y1: 22 };

    let cell = 'animal';
    let prediction = null;
    let playing = false;
    let animT = null;
    let rafId = null, lastT = null;

    const conc = () => Number(concRange.value);
    const elapsed = () => (animT === null ? Number(timeRange.value) : animT);

    // Where the volume is heading. A plant cell's wall will not stretch, so
    // its protoplast can never pass V0 no matter how dilute the outside is;
    // an animal cell has nothing to stop it.
    function targetVolume(c, kind = cell) {
        const free = (C_IN0 * V0) / c;
        return kind === 'plant' ? Math.min(V0, free) : free;
    }
    function volumeAt(t, c = conc(), kind = cell) {
        const target = targetVolume(c, kind);
        return V0 + (target - V0) * (1 - Math.exp(-t / TAU));
    }
    // The moment an animal cell reaches bursting size, if it ever does.
    function burstTime(c) {
        const target = targetVolume(c, 'animal');
        if (target <= BURST_V) return null;
        return -TAU * Math.log(1 - (BURST_V - V0) / (target - V0));
    }

    function state(t = elapsed(), c = conc(), kind = cell) {
        const bt = kind === 'animal' ? burstTime(c) : null;
        const burst = bt !== null && t >= bt;
        const v = burst ? BURST_V : volumeAt(t, c, kind);
        let label, tone;
        if (kind === 'animal') {
            if (burst) { label = '터짐'; tone = '#dc2626'; }
            else if (v > 1.02) { label = '부풀어 오름'; tone = '#0284c7'; }
            else if (v < 0.98) { label = '쭈그러듦'; tone = '#ea580c'; }
            else { label = '정상'; tone = '#059669'; }
        } else {
            if (v < 0.98) { label = '원형질 분리'; tone = '#ea580c'; }
            else if (targetVolume(c, 'plant') >= V0 && c < 0.98) { label = '팽팽함 (터지지 않음)'; tone = '#059669'; }
            else { label = '정상'; tone = '#059669'; }
        }
        return { v, burst, burstTime: bt, label, tone, target: targetVolume(c, kind) };
    }

    const gx = c => GRAPH.x0 + ((c - 0.2) / 1.8) * (GRAPH.x1 - GRAPH.x0);
    const gy = v => GRAPH.y0 - (v / 2.2) * (GRAPH.y0 - GRAPH.y1);
    // A sphere's radius grows as the cube root of its volume.
    const scaleOf = v => Math.cbrt(v);

    function renderMain() {
        const s = state();
        const c = conc();
        const CX = 220, CY = 108;
        let out = '';
        out += `<rect class="field" x="14" y="14" width="330" height="190" rx="14"/>`;
        // solute dots outside: more of them the more concentrated the bath
        const dots = Math.round(6 + c * 26);
        for (let i = 0; i < dots; i += 1) {
            const a = (i * 137.5) * Math.PI / 180;
            const rr = 42 + ((i * 17) % 120);
            const x = 178 + rr * Math.cos(a) * 0.92;
            const y = 108 + rr * Math.sin(a) * 0.62;
            if (x < 24 || x > 334 || y < 24 || y > 194) continue;
            out += `<circle class="solution-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.4"/>`;
        }

        if (cell === 'animal') {
            const sc = (scaleOf(s.v)).toFixed(3);
            if (s.burst) {
                out += `<g transform="translate(${CX - 50 * BURST_V}, ${CY - 50 * BURST_V}) scale(${BURST_V})">` +
                       `<path class="animal-cell burst membrane" d="M 50 8 C 76 6 94 24 92 50 C 90 74 76 94 50 92 C 24 90 6 76 8 50 C 10 24 24 10 50 8 Z"/></g>`;
                for (let i = 0; i < 9; i += 1) {
                    const a = (i * 40) * Math.PI / 180, rr = 62 + (i % 3) * 9;
                    out += `<circle class="burst-bit" cx="${(CX + rr * Math.cos(a)).toFixed(1)}" cy="${(CY + rr * Math.sin(a) * 0.7).toFixed(1)}" r="${3 + (i % 3)}"/>`;
                }
            } else {
                out += `<g transform="translate(${(CX - 50 * sc).toFixed(1)}, ${(CY - 50 * sc).toFixed(1)}) scale(${sc})">` +
                       `<path class="animal-cell membrane" d="M 50 8 C 76 6 94 24 92 50 C 90 74 76 94 50 92 C 24 90 6 76 8 50 C 10 24 24 10 50 8 Z"/>` +
                       `<path class="nucleus" d="M 50 28 C 62 28 70 36 70 48 C 70 60 62 68 50 68 C 38 68 30 60 30 48 C 30 36 38 28 50 28 Z"/></g>`;
            }
            out += `<text class="cell-label" x="${CX}" y="30" text-anchor="middle">동물세포 (세포벽 없음)</text>`;
            out += `<text class="part-label" x="${CX}" y="196" text-anchor="middle">세포막만 있어 부피를 제한하지 못합니다</text>`;
        } else {
            const W = 116, H = 92;                    // the wall never changes size
            const k = scaleOf(s.v);
            const pw = W * k, ph = H * k;
            out += `<rect class="gap-fill" x="${CX - W / 2}" y="${CY - H / 2}" width="${W}" height="${H}" rx="6"/>`;
            out += `<g transform="translate(${(CX - 50 * k).toFixed(1)}, ${(CY - 50 * k).toFixed(1)}) scale(${k.toFixed(3)})">` +
                   `<rect class="protoplast membrane" x="${50 - W / 2}" y="${50 - H / 2}" width="${W}" height="${H}" rx="6"/>` +
                   `<path class="vacuole" d="M 38 28 C 64 26 76 34 76 56 C 76 76 58 80 38 78 C 24 76 22 62 24 48 C 26 34 32 30 38 28 Z"/>` +
                   `<path class="nucleus" d="M 74 66 C 80 66 84 70 84 76 C 84 82 80 86 74 86 C 68 86 64 82 64 76 C 64 70 68 66 74 66 Z"/></g>`;
            out += `<rect class="wall" x="${CX - W / 2}" y="${CY - H / 2}" width="${W}" height="${H}" rx="6"/>`;
            for (let i = 0; i < 6; i += 1) {
                const a = (i * 61) * Math.PI / 180;
                const chx = (CX + 38 * k * Math.cos(a)).toFixed(1), chy = (CY + 28 * k * Math.sin(a)).toFixed(1);
                out += `<g transform="translate(${chx - 5}, ${chy - 3.5}) scale(0.1)">` +
                       `<path class="chloroplast" d="M 50 38 C 60 38 66 44 66 50 C 66 56 60 62 50 62 C 40 62 34 56 34 50 C 34 44 40 38 50 38 Z"/></g>`;
            }
            out += `<text class="cell-label" x="${CX}" y="30" text-anchor="middle">식물세포 (세포벽 있음)</text>`;
            out += `<text class="part-label" x="${CX}" y="196" text-anchor="middle">${s.v < 0.98 ? '세포막이 세포벽에서 떨어졌습니다' : '세포벽이 더 부풀지 못하게 막습니다'}</text>`;
        }

        // water arrows point the way water actually moves
        const inward = c < 0.98, outward = c > 1.02;
        if (inward || outward) {
            const cls = inward ? 'water-in' : 'water-out';
            [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dx, dy]) => {
                const far = 96, near = 60;
                const x1 = CX + dx * (inward ? far : near), y1 = CY + dy * (inward ? far : near) * 0.8;
                const x2 = CX + dx * (inward ? near : far), y2 = CY + dy * (inward ? near : far) * 0.8;
                out += `<path class="water-arrow ${cls}" d="M${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)}"/>`;
                const ax = x2 - dx * 7, ay = y2 - dy * 7 * 0.8;
                out += `<path class="water-arrow ${cls}" d="M${(ax - dy * 5).toFixed(1)},${(ay - dx * 5).toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)} L${(ax + dy * 5).toFixed(1)},${(ay + dx * 5).toFixed(1)}"/>`;
            });
            out += `<text class="part-label" style="fill:${inward ? '#0284c7' : '#ea580c'}" x="358" y="150">물이 ${inward ? '들어옴' : '빠져나감'}</text>`;
        } else {
            out += `<text class="part-label" style="fill:#059669" x="358" y="150">물의 출입 균형</text>`;
        }
        out += `<text class="state-label" fill="${s.tone}" x="358" y="60">${s.label}</text>`;
        out += `<text class="part-label" x="358" y="78">부피 ${(s.v * 100).toFixed(0)}%</text>`;
        out += `<text class="part-label" x="358" y="96">바깥 농도 ${c.toFixed(2)}</text>`;
        out += `<text class="part-label" x="358" y="114">처음 내부 1.00</text>`;
        mainGroup.innerHTML = out;
        return s;
    }

    function renderGraph(s) {
        let out = '';
        for (let v = 0; v <= 2.2; v += 0.55) {
            out += `<line class="grid-line" x1="${GRAPH.x0}" y1="${gy(v).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(v).toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(gy(v) + 3).toFixed(1)}" text-anchor="end">${(v * 100).toFixed(0)}</text>`;
        }
        for (const c of [0.2, 0.6, 1.0, 1.4, 2.0]) {
            // clear of the y-axis "0", which sits just above the corner
            out += `<text class="axis-text" x="${gx(c).toFixed(1)}" y="${GRAPH.y0 + 16}" text-anchor="middle">${c.toFixed(1)}</text>`;
        }
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-title" x="${(GRAPH.x0 + GRAPH.x1) / 2}" y="${GRAPH.y0 + 32}" text-anchor="middle">바깥 용액의 농도</text>`;
        // starts at the plot edge, not over the tick numbers
        out += `<text class="axis-title" x="${GRAPH.x0}" y="${GRAPH.y1 - 6}">최종 부피 (%)</text>`;
        out += `<line class="iso-line" x1="${gx(1).toFixed(1)}" y1="${GRAPH.y1}" x2="${gx(1).toFixed(1)}" y2="${GRAPH.y0}"/>`;
        out += `<text class="zone-text" fill="#059669" x="${(gx(1) + 4).toFixed(1)}" y="${GRAPH.y1 + 10}">등장액</text>`;
        out += `<line class="burst-line" x1="${GRAPH.x0}" y1="${gy(BURST_V).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(BURST_V).toFixed(1)}"/>`;
        out += `<text class="zone-text" fill="#dc2626" x="${GRAPH.x1 - 4}" y="${(gy(BURST_V) - 5).toFixed(1)}" text-anchor="end">동물세포가 터지는 부피 140%</text>`;

        [['animal', '#ff8a8a'], ['plant', '#6fbf73']].forEach(([kind, col]) => {
            const pts = [];
            for (let c = 0.2; c <= 2.001; c += 0.02) {
                pts.push(`${gx(c).toFixed(1)},${gy(Math.min(2.2, targetVolume(c, kind))).toFixed(1)}`);
            }
            out += `<path class="trace${kind === cell ? '' : ' dim'}" style="stroke:${col}" d="M${pts.join('L')}"/>`;
        });
        out += `<text class="zone-text" fill="#6fbf73" x="${gx(0.35).toFixed(1)}" y="${(gy(1) - 8).toFixed(1)}">식물세포 — 처음부터 팽팽한 모형</text>`;
        out += `<circle class="trace-dot" cx="${gx(conc()).toFixed(1)}" cy="${gy(Math.min(2.2, s.v)).toFixed(1)}" r="5" fill="#d97706"/>`;
        graphGroup.innerHTML = out;
    }

    function render() {
        const s = renderMain();
        renderGraph(s);
        concOutput.textContent = conc().toFixed(2);
        timeOutput.textContent = `${elapsed().toFixed(elapsed() % 1 ? 1 : 0)} 분`;
        stageBadge.textContent = `${cell === 'animal' ? '동물세포' : '식물세포'} · ${s.label}`;
        const dir = conc() < 0.98 ? '세포 안으로' : conc() > 1.02 ? '세포 밖으로' : '양쪽이 균형';
        dataNote.innerHTML =
            `<div class="data-row"><span class="data-name">농도 비교</span><span class="data-val">바깥 ${conc().toFixed(2)} vs 처음 세포 속 1.00 → 물이 ${dir}</span></div>` +
            `<div class="data-row"><span class="data-name">최종 부피</span><span class="data-val">1.00 ÷ ${conc().toFixed(2)} = ${((C_IN0 * V0) / conc()).toFixed(2)}${cell === 'plant' && (C_IN0 * V0) / conc() > 1 ? ' → 세포벽이 1.00으로 제한' : ''}</span></div>` +
            `<div class="data-row${s.burst ? '' : ' match'}"><span class="data-name">지금 상태</span><span class="data-val">부피 ${(s.v * 100).toFixed(0)}% · ${s.label}</span></div>`;
        if (!resultContent.hidden) showResult();
        return s;
    }

    const clearResult = () => { resultEmpty.hidden = false; resultContent.hidden = true; };

    function showResult() {
        const s = state();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        valueA.textContent = `${(s.v * 100).toFixed(0)} %`;
        valueB.textContent = s.label;
        const actual = s.v > 1.02 ? 'swell' : s.v < 0.98 ? 'shrink' : 'same';
        predictionResult.textContent = elapsed() < 20
            ? '변화를 관찰 중입니다. 20분 뒤의 부피로 예상을 확인하세요.'
            : !prediction
            ? '다음에는 결과를 먼저 예상해 보세요.'
            : prediction === actual ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        const c = conc();
        let s2 = `물은 농도가 낮은 쪽에서 높은 쪽으로 이동합니다. 바깥이 ${c.toFixed(2)}, 처음 세포 속이 1.00 이므로 `;
        s2 += c < 0.98 ? '물이 세포 안으로 들어옵니다. ' : c > 1.02 ? '물이 세포 밖으로 빠져나갑니다. ' : '물의 출입이 균형을 이룹니다. ';
        if (cell === 'animal') {
            s2 += s.burst
                ? `동물세포는 세포벽이 없어 부피가 ${(BURST_V * 100).toFixed(0)}%를 넘자 터졌습니다. 적혈구가 이렇게 터지는 현상을 용혈이라고 합니다.`
                : `동물세포는 세포벽이 없어 부피가 ${(s.v * 100).toFixed(0)}% 까지 그대로 변합니다.`;
        } else {
            s2 += s.v < 0.98
                ? `식물세포는 세포질이 줄어들어도 세포벽은 그대로여서, 세포막이 세포벽에서 떨어지는 원형질 분리가 일어납니다.`
                : `이 모형의 식물세포는 처음부터 팽팽한 상태이며, 세포벽이 팽창을 제한합니다. 실제 세포의 부피 변화는 처음 상태와 팽압에 따라 달라집니다.`;
        }
        explanation.textContent = s2;
    }

    function frame(now) {
        const tt = now / 1000;
        const dt = lastT === null ? 1 / 60 : Math.min(1 / 20, tt - lastT);
        lastT = tt;
        if (playing) {
            animT = Math.min(20, animT + dt * 4);
            timeRange.value = String(Math.round(animT * 2) / 2);
            render();
            if (animT >= 20) { playing = false; playBtn.textContent = '시간 흘려보내기'; }
            rafId = playing ? requestAnimationFrame(frame) : null;
            if (!playing) lastT = null;
        } else { rafId = null; lastT = null; }
    }

    function stopPlayback() {
        playing = false;
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = null; lastT = null; animT = null;
        playBtn.textContent = '시간 흘려보내기';
    }
    document.querySelectorAll('.control-panel input[type="range"]').forEach(el => el.addEventListener('input', stopPlayback, true));
    document.querySelectorAll('.control-panel button').forEach(el => {
        if (el !== playBtn && el !== resetBtn) el.addEventListener('click', stopPlayback, true);
    });

    playBtn.addEventListener('click', () => {
        playing = !playing;
        playBtn.textContent = playing ? '멈추기' : '시간 흘려보내기';
        if (playing) {
            animT = Number(timeRange.value);
            if (animT >= 20) animT = 0;
            showResult();
            if (rafId === null) { lastT = null; rafId = requestAnimationFrame(frame); }
        } else {
            timeRange.value = String(Math.round(elapsed() * 2) / 2);
            animT = null; render();
        }
    });
    resetBtn.addEventListener('click', () => {
        playing = false; animT = null;
        if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; lastT = null; }
        playBtn.textContent = '시간 흘려보내기';
        timeRange.value = '0';
        clearResult();
        stageCaption.textContent = '농도를 바꾸며 세포의 부피 변화를 관찰해 보세요.';
        render();
    });
    cellButtons.forEach(button => button.addEventListener('click', () => {
        cell = button.dataset.cell;
        cellButtons.forEach(item => item.classList.toggle('selected', item === button));
        animT = null; render(); if (!resultContent.hidden) showResult();
    }));
    [concRange, timeRange].forEach(el => el.addEventListener('input', () => {
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

    window.__cellModel = {
        C_IN0, V0, BURST_V, TAU, targetVolume, volumeAt, burstTime, state, scaleOf,
        setCell(k) { document.querySelector(`[data-cell="${k}"]`).click(); },
        setConc(c) { concRange.value = String(c); concRange.dispatchEvent(new Event('input')); },
        setTime(t) { timeRange.value = String(t); timeRange.dispatchEvent(new Event('input')); },
        conc, elapsed, render,
    };

    resetBtn.click();
});
