document.addEventListener('DOMContentLoaded', () => {
    const kindButtons = [...document.querySelectorAll('[data-kind]')];
    const chromButtons = [...document.querySelectorAll('[data-chrom]')];
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const stageRange = document.getElementById('stageRange');
    const stageOutput = document.getElementById('stageOutput');
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

    const GRAPH = { x0: 62, x1: 424, y0: 150, y1: 34 };

    // dna is per cell against a G1 cell; chrom is per cell in units of 2n.
    const MITOSIS = [
        { name: 'G₁기', dna: 1, chrom: 1, two: false, cells: 1, lay: 'scatter', why: '복제 전' },
        { name: 'S기', dna: 2, chrom: 1, two: true, cells: 1, lay: 'scatter', why: 'DNA 복제 — 염색체 수는 그대로' },
        { name: 'G₂기', dna: 2, chrom: 1, two: true, cells: 1, lay: 'scatter', why: '분열 준비' },
        { name: '전기', dna: 2, chrom: 1, two: true, cells: 1, lay: 'scatter', why: '핵막 사라지고 방추사 생김' },
        { name: '중기', dna: 2, chrom: 1, two: true, cells: 1, lay: 'equator', why: '염색체가 적도면에 한 줄로' },
        { name: '후기', dna: 2, chrom: 2, two: false, cells: 1, lay: 'poles', why: '염색 분체가 갈라져 수가 잠시 4n' },
        { name: '말기', dna: 2, chrom: 2, two: false, cells: 1, lay: 'poles', why: '핵막이 다시 생기고 세포질 분열' },
        { name: '딸세포', dna: 1, chrom: 1, two: false, cells: 2, lay: 'cells', why: '어버이와 같은 2n 세포 2개' },
    ];
    const MEIOSIS = [
        { name: 'G₁기', dna: 1, chrom: 1, two: false, cells: 1, lay: 'scatter', why: '복제 전' },
        { name: 'S기', dna: 2, chrom: 1, two: true, cells: 1, lay: 'scatter', why: 'DNA 복제 — 한 번만' },
        { name: 'G₂기', dna: 2, chrom: 1, two: true, cells: 1, lay: 'scatter', why: '분열 준비' },
        { name: '전기 I', dna: 2, chrom: 1, two: true, cells: 1, lay: 'pairs', why: '상동 염색체가 붙어 2가 염색체 · 교차' },
        { name: '중기 I', dna: 2, chrom: 1, two: true, cells: 1, lay: 'equatorPairs', why: '2가 염색체가 적도면에 두 줄로' },
        { name: '후기 I', dna: 2, chrom: 1, two: true, cells: 1, lay: 'polesPairs', why: '상동 염색체가 무작위로 갈라짐' },
        { name: '말기 I', dna: 2, chrom: 1, two: true, cells: 1, lay: 'polesPairs', why: '세포질 분열 — 곧 n이 됨' },
        { name: '전기 II', dna: 1, chrom: 0.5, two: true, cells: 2, lay: 'cellsScatter', why: '복제 없이 바로 두 번째 분열' },
        { name: '중기 II', dna: 1, chrom: 0.5, two: true, cells: 2, lay: 'cellsEquator', why: '적도면에 한 줄로' },
        { name: '후기 II', dna: 1, chrom: 1, two: false, cells: 2, lay: 'cellsPoles', why: '염색 분체가 갈라짐' },
        { name: '말기 II', dna: 1, chrom: 1, two: false, cells: 2, lay: 'cellsPoles', why: '세포질 분열' },
        { name: '딸세포', dna: 0.5, chrom: 0.5, two: false, cells: 4, lay: 'four', why: 'n인 생식세포 4개' },
    ];

    let kind = 'mitosis';
    let diploid = 4;
    let prediction = null;
    let running = false, frameId = 0, lastStamp = 0, acc = 0;

    const list = () => (kind === 'mitosis' ? MITOSIS : MEIOSIS);
    const idx = () => Math.min(list().length - 1, Number(stageRange.value));

    function analyse(k = kind, twoN = diploid, i = idx()) {
        const L = k === 'mitosis' ? MITOSIS : MEIOSIS;
        const s = L[Math.min(L.length - 1, i)];
        const chromPer = s.chrom * twoN;                  // chromosomes in one cell
        const chromatidsPer = chromPer * (s.two ? 2 : 1);
        const totalDNA = s.dna * s.cells;                 // must stay put once copied
        const pairs = twoN / 2;
        const verdict = s.dna > 1.5 ? 'double' : s.dna < 0.75 ? 'half' : 'same';
        return { k, twoN, i, s, L, chromPer, chromatidsPer, totalDNA, pairs,
                 combos: 2 ** pairs, verdict, last: L[L.length - 1] };
    }

    /* ----------------------------------------------------------- visuals */
    function shape(cx, cy, s, two, cls) {
        if (two) {
            return `<path class="chrom ${cls}" d="M${(cx - s * 0.55).toFixed(1)},${(cy - s).toFixed(1)} Q${cx.toFixed(1)},${(cy - s * 0.18).toFixed(1)} ${(cx - s * 0.55).toFixed(1)},${(cy + s).toFixed(1)}"/>` +
                   `<path class="chrom ${cls}" d="M${(cx + s * 0.55).toFixed(1)},${(cy - s).toFixed(1)} Q${cx.toFixed(1)},${(cy - s * 0.18).toFixed(1)} ${(cx + s * 0.55).toFixed(1)},${(cy + s).toFixed(1)}"/>` +
                   `<circle class="centromere" cx="${cx.toFixed(1)}" cy="${(cy - s * 0.18).toFixed(1)}" r="2"/>`;
        }
        return `<path class="chrom ${cls}" d="M${cx.toFixed(1)},${(cy - s).toFixed(1)} Q${(cx + s * 0.32).toFixed(1)},${cy.toFixed(1)} ${cx.toFixed(1)},${(cy + s).toFixed(1)}"/>`;
    }

    function cellShell(cx, cy, r, pinch) {
        let out = `<ellipse class="cell-wall" cx="${cx}" cy="${cy}" rx="${r * (pinch ? 1.18 : 1)}" ry="${r}"/>`;
        if (pinch) {
            out += `<path class="cell-wall" fill="none" d="M${cx},${cy - r} q${r * 0.3},${r * 0.35} 0,${r * 0.65} q-${r * 0.3},${r * 0.3} 0,${r * 0.65}"/>`;
        }
        return out;
    }

    function renderMain(a) {
        const s = a.s, n = a.twoN;
        const cols = i => (i % 2 === 0 ? 'mum' : 'dad');
        let body = '';
        const spindle = (cx, cy, r) => {
            let o = `<circle class="pole" cx="${cx - r - 6}" cy="${cy}" r="3"/><circle class="pole" cx="${cx + r + 6}" cy="${cy}" r="3"/>`;
            for (let k = -2; k <= 2; k += 1) {
                o += `<line class="spindle" x1="${cx - r - 6}" y1="${cy}" x2="${cx + r + 6}" y2="${cy + k * r * 0.4}"/>`;
            }
            return o;
        };

        if (s.cells === 1) {
            const cx = 150, cy = 108, r = 62;
            const dividing = s.lay === 'poles' || s.lay === 'polesPairs';
            if (s.lay === 'scatter' || s.lay === 'pairs') {
                body += cellShell(cx, cy, r, false);
                body += `<ellipse class="nucleus" cx="${cx}" cy="${cy}" rx="${r - 12}" ry="${r - 16}"/>`;
            } else {
                body += cellShell(cx, cy, r, s.name.startsWith('말기'));
                body += spindle(cx, cy, r);
                if (s.lay === 'equator' || s.lay === 'equatorPairs') {
                    body += `<line class="equator" x1="${cx}" y1="${cy - r + 6}" x2="${cx}" y2="${cy + r - 6}"/>`;
                }
            }
            if (s.lay === 'scatter') {
                for (let i = 0; i < n; i += 1) {
                    const ang = (i / n) * Math.PI * 2 + 0.6;
                    body += shape(cx + Math.cos(ang) * 26, cy + Math.sin(ang) * 22, 13, s.two, cols(i));
                }
            } else if (s.lay === 'pairs') {
                for (let p = 0; p < a.pairs; p += 1) {
                    const y = cy - (a.pairs - 1) * 16 + p * 32;
                    // a crossover recombines one pair, drawn in the blended colour
                    body += shape(cx - 11, y, 13, true, p === 0 ? 'mix' : 'mum');
                    body += shape(cx + 11, y, 13, true, p === 0 ? 'mix' : 'dad');
                }
            } else if (s.lay === 'equator') {
                for (let i = 0; i < n; i += 1) {
                    const y = cy - (n - 1) * 12 + i * 24;
                    body += shape(cx, y, 12, true, cols(i));
                }
            } else if (s.lay === 'equatorPairs') {
                for (let p = 0; p < a.pairs; p += 1) {
                    const y = cy - (a.pairs - 1) * 16 + p * 32;
                    body += shape(cx - 12, y, 12, true, 'mum');
                    body += shape(cx + 12, y, 12, true, 'dad');
                }
            } else if (s.lay === 'poles') {
                for (let side = 0; side < 2; side += 1) {
                    for (let i = 0; i < n; i += 1) {
                        const y = cy - (n - 1) * 11 + i * 22;
                        body += shape(cx + (side ? 40 : -40), y, 11, false, cols(i));
                    }
                }
            } else if (s.lay === 'polesPairs') {
                for (let side = 0; side < 2; side += 1) {
                    for (let p = 0; p < a.pairs; p += 1) {
                        const y = cy - (a.pairs - 1) * 16 + p * 32;
                        body += shape(cx + (side ? 40 : -40), y, 12, true, side ? 'dad' : 'mum');
                    }
                }
            }
            void dividing;
        } else if (s.cells === 2) {
            [95, 215].forEach((cx, ci) => {
                const cy = 108, r = 48;
                const eq = s.lay === 'cellsEquator', pol = s.lay === 'cellsPoles';
                body += cellShell(cx, cy, r, s.name === '말기 II');
                if (s.lay === 'cellsScatter' || s.lay === 'cells') {
                    body += `<ellipse class="nucleus" cx="${cx}" cy="${cy}" rx="${r - 10}" ry="${r - 14}"/>`;
                } else body += spindle(cx, cy, r);
                if (eq) body += `<line class="equator" x1="${cx}" y1="${cy - r + 6}" x2="${cx}" y2="${cy + r - 6}"/>`;
                const count = a.chromPer;
                if (pol) {
                    for (let side = 0; side < 2; side += 1) {
                        for (let i = 0; i < count / 2; i += 1) {
                            const y = cy - (count / 2 - 1) * 11 + i * 22;
                            body += shape(cx + (side ? 26 : -26), y, 10, false, ci ? 'dad' : 'mum');
                        }
                    }
                } else {
                    for (let i = 0; i < count; i += 1) {
                        const y = cy - (count - 1) * 12 + i * 24;
                        const x = eq ? cx : cx + (i % 2 ? 16 : -16);
                        body += shape(x, y, 11, s.two, ci ? 'dad' : 'mum');
                    }
                }
            });
        } else {
            [[86, 68], [86, 148], [214, 68], [214, 148]].forEach(([cx, cy], ci) => {
                const r = 34;
                body += cellShell(cx, cy, r, false);
                body += `<ellipse class="nucleus" cx="${cx}" cy="${cy}" rx="${r - 8}" ry="${r - 11}"/>`;
                for (let i = 0; i < a.chromPer; i += 1) {
                    const y = cy - (a.chromPer - 1) * 9 + i * 18;
                    body += shape(cx + (i % 2 ? 9 : -9), y, 9, false, ci % 2 ? 'dad' : 'mum');
                }
            });
        }

        let out = `<g clip-path="url(#fieldClip)">${body}</g>`;
        out += `<text class="stage-name" x="300" y="40">${s.name}</text>`;
        out += `<text class="note-text" x="300" y="58">${s.why}</text>`;
        out += `<text class="note-text" x="300" y="82">세포 ${s.cells}개</text>`;
        out += `<text class="note-text" x="300" y="100">세포 하나의 염색체 ${a.chromPer}개</text>`;
        out += `<text class="note-text" x="300" y="118">염색 분체 ${a.chromatidsPer}개</text>`;
        out += `<text class="note-text" x="300" y="136">DNA 양 ${fmt(s.dna)} (G₁ = 1)</text>`;
        out += `<text class="part-label" x="20" y="26">${kind === 'mitosis' ? '체세포 분열' : '감수 분열'} · 2n = ${a.twoN}</text>`;
        out += `<text class="read-text" x="20" y="196">전체 DNA ${fmt(a.totalDNA)} — 복제한 뒤로는 나뉘기만 할 뿐 늘지 않습니다</text>`;
        out += `<text class="note-text" x="20" y="210">빨강은 어머니, 파랑은 아버지에게서 온 상동 염색체입니다</text>`;
        mainGroup.innerHTML = out;
    }

    const fmt = v => (Number.isInteger(v) ? String(v) : v.toFixed(1));

    function renderGraph(a) {
        const L = a.L, n = L.length;
        const gx = i => GRAPH.x0 + (i / (n - 1)) * (GRAPH.x1 - GRAPH.x0);
        const gy = v => GRAPH.y0 - (v / 2.2) * (GRAPH.y0 - GRAPH.y1);
        let out = '';
        [0, 0.5, 1, 1.5, 2].forEach(v => {
            out += `<line class="grid-line" x1="${GRAPH.x0}" y1="${gy(v).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(v).toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(gy(v) + 3).toFixed(1)}" text-anchor="end">${v}</text>`;
        });
        L.forEach((s, i) => {
            if (n > 9 && i % 2 === 1 && i !== n - 1) return;
            out += `<text class="axis-text" x="${gx(i).toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${s.name}</text>`;
        });
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-title" x="22" y="22">G₁기의 세포 하나를 1로 본 값</text>`;
        const path = pick => `M${L.map((s, i) => `${gx(i).toFixed(1)},${gy(pick(s)).toFixed(1)}`).join('L')}`;
        out += `<path class="chrom-line" d="${path(s => s.chrom)}"/>`;
        out += `<path class="dna-line" d="${path(s => s.dna)}"/>`;
        out += `<line class="now-line" x1="${gx(a.i).toFixed(1)}" y1="${GRAPH.y1}" x2="${gx(a.i).toFixed(1)}" y2="${GRAPH.y0}"/>`;
        out += `<circle class="trace-dot" cx="${gx(a.i).toFixed(1)}" cy="${gy(a.s.dna).toFixed(1)}" r="5" fill="#d97706"/>`;
        out += `<circle class="trace-dot" cx="${gx(a.i).toFixed(1)}" cy="${gy(a.s.chrom).toFixed(1)}" r="4.5" fill="#0284c7"/>`;
        [['DNA 양', '#d97706', 0], ['염색체 수 (2n = 1)', '#0284c7', 1]].forEach(([t, c, k]) => {
            out += `<rect x="${GRAPH.x0 + 150 + k * 96}" y="14" width="9" height="9" rx="2" fill="${c}"/>`;
            out += `<text class="legend-text" fill="${c}" x="${GRAPH.x0 + 163 + k * 96}" y="22">${t}</text>`;
        });
        graphGroup.innerHTML = out;
    }

    function render() {
        const a = analyse();
        renderMain(a);
        renderGraph(a);
        stageOutput.textContent = a.s.name;
        stageBadge.textContent = `${a.s.name} · 염색체 ${a.chromPer}개 · DNA ${fmt(a.s.dna)}`;
        dataNote.innerHTML =
            `<div class="data-row"><span class="data-name">시기</span><span class="data-val">${a.s.name} — ${a.s.why}</span></div>` +
            `<div class="data-row"><span class="data-name">세포 하나</span><span class="data-val">염색체 ${a.chromPer}개 · 염색 분체 ${a.chromatidsPer}개 · DNA ${fmt(a.s.dna)}</span></div>` +
            `<div class="data-row"><span class="data-name">세포 수</span><span class="data-val">${a.s.cells}개</span></div>` +
            `<div class="data-row"><span class="data-name">전체 DNA</span><span class="data-val">${fmt(a.s.dna)} × ${a.s.cells} = ${fmt(a.totalDNA)} — 복제 뒤 언제나 2</span></div>` +
            `<div class="data-row match"><span class="data-name">끝나면</span><span class="data-val">${a.last.cells}개의 세포가 각각 염색체 ${a.last.chrom * a.twoN}개</span></div>`;
        return a;
    }

    function stopRun() { running = false; if (frameId) cancelAnimationFrame(frameId); frameId = 0; }

    function tick(dt) {
        acc += dt;
        if (acc >= 0.75) {
            acc = 0;
            const next = Number(stageRange.value) + 1;
            if (next >= list().length) return true;
            stageRange.value = String(next);
            render();
        }
        return false;
    }

    function frame(stamp) {
        if (!running) return;
        const dt = Math.min(0.05, (stamp - lastStamp) / 1000 || 0);
        lastStamp = stamp;
        if (tick(dt)) { stopRun(); check(); } else frameId = requestAnimationFrame(frame);
    }

    function startRun() {
        stopRun();
        stageRange.value = '0'; acc = 0;
        running = true;
        lastStamp = performance.now();
        render();
        frameId = requestAnimationFrame(frame);
    }

    function check() {
        const a = render();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        valueA.textContent = `${fmt(a.s.dna)} (G₁ = 1)`;
        valueB.textContent = `${a.chromPer}개`;
        predictionResult.textContent = !prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        let s = `${a.s.name}에서는 ${a.s.why}. `;
        s += `세포 하나에 염색체가 ${a.chromPer}개, 염색 분체가 ${a.chromatidsPer}개 있고 DNA 양은 ${fmt(a.s.dna)} 입니다. `;
        if (a.s.dna === 2 && a.s.cells === 1) {
            s += `S기에서 복제가 끝났기 때문에 G₁기의 두 배입니다. 이때 염색 분체는 2개가 되었지만 동원체가 붙어 있는 동안은 염색체 하나로 세므로 염색체 수는 그대로입니다. `;
        } else if (a.s.dna < 1) {
            s += `감수 분열은 복제를 한 번 하고 두 번 나누므로 딸세포의 DNA는 G₁기의 절반이 됩니다. `;
        }
        if (a.chromPer === a.twoN * 2) {
            s += `지금은 염색 분체가 갈라진 직후라 각각이 독립된 염색체가 되어 수가 잠시 ${a.twoN * 2}개로 늘었습니다. 세포가 아직 나뉘지 않았기 때문입니다. `;
        }
        s += `전체 DNA는 ${fmt(a.s.dna)} × ${a.s.cells} = ${fmt(a.totalDNA)}로, 복제한 뒤로는 나누어 가질 뿐 늘지도 줄지도 않습니다. `;
        s += a.k === 'mitosis'
            ? `끝나면 어버이와 똑같은 2n = ${a.twoN} 인 딸세포 2개가 생깁니다. 몸이 자라거나 상처가 아물 때 쓰이는 분열입니다.`
            : `끝나면 n = ${a.twoN / 2} 인 생식세포 4개가 생깁니다. 상동 염색체 ${a.pairs}쌍이 각각 무작위로 갈라지므로 조합만 따져도 2^${a.pairs} = ${a.combos}가지가 나오고, 교차까지 더하면 훨씬 다양해집니다. 사람은 23쌍이라 8,388,608가지입니다.`;
        explanation.textContent = s;
    }

    function changed() {
        stopRun();
        stageRange.max = String(list().length - 1);
        if (Number(stageRange.value) > list().length - 1) stageRange.value = String(list().length - 1);
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        render();
    }

    stageRange.addEventListener('input', () => { stopRun(); render(); if (!resultContent.hidden) check(); });
    kindButtons.forEach(button => button.addEventListener('click', () => {
        kind = button.dataset.kind;
        kindButtons.forEach(item => item.classList.toggle('selected', item === button));
        stageCaption.textContent = kind === 'mitosis'
            ? '색이 다른 염색체는 아버지와 어머니에게서 온 상동 염색체입니다.'
            : '상동 염색체가 짝을 지었다가 무작위로 갈라지는 것을 보세요.';
        changed();
    }));
    chromButtons.forEach(button => button.addEventListener('click', () => {
        diploid = Number(button.dataset.chrom);
        chromButtons.forEach(item => item.classList.toggle('selected', item === button));
        changed();
    }));
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        stageRange.value = '0';
        prediction = null;
        predictionButtons.forEach(item => item.classList.remove('selected'));
        chromButtons.find(b => b.dataset.chrom === '4').click();
        kindButtons.find(b => b.dataset.kind === 'mitosis').click();
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

    window.__divModel = {
        MITOSIS, MEIOSIS, analyse, render, check,
        setKind(k) { kindButtons.find(b => b.dataset.kind === k).click(); },
        setChrom(v) { chromButtons.find(b => b.dataset.chrom === String(v)).click(); },
        setStage(i) { stageRange.value = String(i); stageRange.dispatchEvent(new Event('input')); },
        getKind: () => kind, getChrom: () => diploid, idx, list,
        runToEnd(dt = 0.4, cap = 200) {
            stopRun(); stageRange.value = '0'; acc = 0;
            let n = 0; while (!tick(dt) && n < cap) n += 1;
            check(); return { steps: n, stage: Number(stageRange.value) };
        },
    };

    resetBtn.click();
});
