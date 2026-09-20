document.addEventListener('DOMContentLoaded', () => {
    const kindButtons = [...document.querySelectorAll('[data-kind]')];
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const speedRange = document.getElementById('speedRange');
    const timeRange = document.getElementById('timeRange');
    const speedOutput = document.getElementById('speedOutput');
    const timeOutput = document.getElementById('timeOutput');
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

    const DEPTH_MAX = 700;                 // km, as deep as earthquakes ever reach
    const SURFACE_Y = 76, BOTTOM_Y = 190;
    // One scale for both directions, so a 45 degree slab is drawn at 45 degrees.
    const PX_PER_KM = (BOTTOM_Y - SURFACE_Y) / DEPTH_MAX;
    const CX = 230, SEC_X0 = 30, SEC_X1 = 430;
    const SHALLOW = 70, MIDDLE = 300;      // the usual depth bands
    const GRAPH = { x0: 64, x1: 424, y0: 150, y1: 30, span: 700 };

    const KINDS = {
        diverge: { label: '발산형 경계', place: '해령', verdict: 'shallow', moves: '서로 멀어집니다' },
        converge: { label: '수렴형 경계', place: '해구', verdict: 'deep', moves: '서로 가까워집니다' },
        transform: { label: '보존형 경계', place: '변환 단층', verdict: 'shallow', moves: '서로 어긋납니다' },
        inside: { label: '판의 내부', place: '경계가 아닌 곳', verdict: 'none', moves: '판 전체가 함께 움직입니다' },
    };

    let kind = 'diverge';
    let prediction = null;
    let running = false, frameId = 0, lastStamp = 0;

    const speed = () => Number(speedRange.value);      // cm each year, for one plate
    const years = () => Number(timeRange.value);       // in units of ten thousand years

    // 5 cm/year for ten million years is 500 km, so distance = speed x time x 0.1
    const moved = (v = speed(), t = years()) => v * t * 0.1;

    // Fixed pseudo-random draw so the same boundary always shows the same quakes.
    function rng(seed) {
        let s = seed >>> 0;
        return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    }

    function quakes(k = kind) {
        const r = rng({ diverge: 11, converge: 27, transform: 43, inside: 61 }[k]);
        const list = [];
        if (k === 'diverge') {
            for (let i = 0; i < 46; i += 1) list.push({ dist: (r() * 2 - 1) * 80, depth: r() * 15 });
        } else if (k === 'transform') {
            for (let i = 0; i < 46; i += 1) list.push({ dist: (r() * 2 - 1) * 50, depth: r() * 20 });
        } else if (k === 'inside') {
            for (let i = 0; i < 6; i += 1) list.push({ dist: (r() * 2 - 1) * 600, depth: r() * 25 });
        } else {
            // shallow ones right at the trench
            for (let i = 0; i < 16; i += 1) list.push({ dist: -30 + r() * 90, depth: r() * 45 });
            // then down the sinking slab: it dips at 45 degrees, so depth = distance
            for (let i = 0; i < 52; i += 1) {
                const s = r() * DEPTH_MAX;
                list.push({ dist: s + (r() * 2 - 1) * 34, depth: Math.max(4, s + (r() * 2 - 1) * 30) });
            }
        }
        return list;
    }

    function analyse(k = kind, v = speed(), t = years()) {
        const info = KINDS[k];
        const pts = quakes(k);
        const deepest = Math.max(...pts.map(p => p.depth));
        const dist = k === 'inside' ? moved(v, t) : moved(v, t);
        const total = k === 'inside' ? dist : dist * 2;   // both plates move
        const age = v > 0 ? dist / v * 1e5 / 1e4 : 0;     // ten-thousand-year units
        return { k, info, pts, deepest, dist, total, age, verdict: info.verdict, v, t };
    }

    const dx = km => CX + km * PX_PER_KM;
    const dy = km => SURFACE_Y + km * PX_PER_KM;

    function arrow(x1, y, x2, cls) {
        const s = Math.sign(x2 - x1);
        return `<line class="${cls}" x1="${x1.toFixed(1)}" y1="${y}" x2="${x2.toFixed(1)}" y2="${y}"/>` +
               `<path class="${cls}" d="M${(x2 - s * 7).toFixed(1)},${y - 5} L${x2.toFixed(1)},${y} L${(x2 - s * 7).toFixed(1)},${y + 5}"/>`;
    }

    function renderMain(a) {
        const off = a.dist * PX_PER_KM;      // how far one plate has slid, in pixels
        let out = '';
        out += `<rect class="mantle" x="${SEC_X0}" y="${SURFACE_Y}" width="${SEC_X1 - SEC_X0}" height="${BOTTOM_Y - SURFACE_Y}"/>`;
        out += `<rect class="sea" x="${SEC_X0}" y="52" width="${SEC_X1 - SEC_X0}" height="${SURFACE_Y - 52}"/>`;

        let body = '';
        if (a.k === 'diverge') {
            // old crust pushed outwards, new crust filling the middle
            body += `<rect class="plate old" x="${SEC_X0 - 40}" y="${SURFACE_Y}" width="${(CX - off - SEC_X0 + 40).toFixed(1)}" height="12"/>`;
            body += `<rect class="plate old" x="${(CX + off).toFixed(1)}" y="${SURFACE_Y}" width="${(SEC_X1 + 40 - CX - off).toFixed(1)}" height="12"/>`;
            if (off > 0.5) body += `<rect class="plate new" x="${(CX - off).toFixed(1)}" y="${SURFACE_Y}" width="${(off * 2).toFixed(1)}" height="12"/>`;
            body += `<path class="magma" d="M${CX - 9},${SURFACE_Y + 12} L${CX + 9},${SURFACE_Y + 12} L${CX + 4},${BOTTOM_Y} L${CX - 4},${BOTTOM_Y} Z"/>`;
            body += `<path class="magma hot" d="M${CX - 5},${SURFACE_Y + 2} L${CX + 5},${SURFACE_Y + 2} L${CX + 2},${SURFACE_Y + 40} L${CX - 2},${SURFACE_Y + 40} Z">` +
                    `<animate attributeName="opacity" values=".55;1;.55" dur="2.4s" repeatCount="indefinite"/></path>`;
            body += arrow(CX - 22, SURFACE_Y - 12, CX - 62, 'move-arrow');
            body += arrow(CX + 22, SURFACE_Y - 12, CX + 62, 'move-arrow');
        } else if (a.k === 'converge') {
            // an ocean plate sliding under a continent, at 45 degrees
            const slabEnd = dy(DEPTH_MAX);
            body += `<rect class="plate" x="${SEC_X0 - 40}" y="${SURFACE_Y}" width="${(CX - SEC_X0 + 40).toFixed(1)}" height="12"/>`;
            body += `<path class="plate" d="M${CX},${SURFACE_Y} L${CX + 12},${SURFACE_Y} L${dx(DEPTH_MAX) + 12},${slabEnd} L${dx(DEPTH_MAX)},${slabEnd} Z"/>`;
            body += `<path class="continent" d="M${CX + 16},${SURFACE_Y + 4} L${SEC_X1 + 40},${SURFACE_Y + 4} L${SEC_X1 + 40},${SURFACE_Y + 26} L${CX + 16},${SURFACE_Y + 26} Z"/>`;
            body += `<path class="continent" d="M${CX + 6},${SURFACE_Y + 4} q8,-12 18,0 Z"/>`;
            body += `<path class="magma hot" d="M${CX + 74},${SURFACE_Y + 4} l10,-16 l10,16 Z">` +
                    `<animate attributeName="opacity" values=".5;1;.5" dur="1.8s" repeatCount="indefinite"/></path>`;
            body += `<text class="small-label" x="${CX + 84}" y="${SURFACE_Y - 22}" text-anchor="middle">화산</text>`;
            body += `<text class="small-label" x="${CX - 2}" y="${SURFACE_Y - 8}" text-anchor="end">해구</text>`;
            body += arrow(CX - 62, SURFACE_Y - 22, CX - 22, 'move-arrow');
            body += arrow(CX + 150, SURFACE_Y - 22, CX + 110, 'move-arrow');
        } else if (a.k === 'transform') {
            // the two blocks slide past each other, across the page
            body += `<rect class="plate" x="${SEC_X0 - 40}" y="${SURFACE_Y}" width="${(CX - SEC_X0 + 38).toFixed(1)}" height="14"/>`;
            body += `<rect class="plate" x="${CX + 2}" y="${SURFACE_Y}" width="${(SEC_X1 + 40 - CX).toFixed(1)}" height="14"/>`;
            body += `<line class="slab-line" x1="${CX}" y1="${SURFACE_Y - 14}" x2="${CX}" y2="${BOTTOM_Y}"/>`;
            body += `<circle class="into-page" cx="${CX - 46}" cy="${SURFACE_Y - 20}" r="8"/>`;
            body += `<circle class="magma hot" cx="${CX - 46}" cy="${SURFACE_Y - 20}" r="2.6"/>`;
            body += `<circle class="into-page" cx="${CX + 46}" cy="${SURFACE_Y - 20}" r="8"/>`;
            body += `<path class="into-page" d="M${CX + 40},${SURFACE_Y - 26} L${CX + 52},${SURFACE_Y - 14} M${CX + 52},${SURFACE_Y - 26} L${CX + 40},${SURFACE_Y - 14}"/>`;
            body += `<text class="small-label" x="${CX - 46}" y="${SURFACE_Y - 34}" text-anchor="middle">앞으로</text>`;
            body += `<text class="small-label" x="${CX + 46}" y="${SURFACE_Y - 34}" text-anchor="middle">뒤로</text>`;
        } else {
            body += `<rect class="plate" x="${SEC_X0 - 40}" y="${SURFACE_Y}" width="${(SEC_X1 - SEC_X0 + 80).toFixed(1)}" height="14"/>`;
            body += arrow(CX - 40, SURFACE_Y - 16, CX + 40, 'move-arrow');
            body += `<text class="small-label" x="${CX}" y="${SURFACE_Y - 26}" text-anchor="middle">판 전체가 함께 움직입니다</text>`;
        }
        // earthquakes, at the depth each one really happens
        a.pts.forEach(p => {
            const x = dx(p.dist), y = dy(p.depth);
            if (x < SEC_X0 - 2 || x > SEC_X1 + 2 || y > BOTTOM_Y) return;
            body += `<circle class="quake${p.depth > MIDDLE ? ' deep' : ''}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6"/>`;
        });
        out += `<g clip-path="url(#sectionClip)">${body}</g>`;

        // depth scale down the left edge
        out += `<line class="surface" x1="${SEC_X0}" y1="${SURFACE_Y}" x2="${SEC_X1}" y2="${SURFACE_Y}"/>`;
        [0, 200, 400, 600].forEach(km => {
            out += `<line class="depth-tick" x1="${SEC_X0}" y1="${dy(km).toFixed(1)}" x2="${SEC_X1}" y2="${dy(km).toFixed(1)}"/>`;
            out += `<text class="depth-text" x="${SEC_X0 - 4}" y="${(dy(km) + 3).toFixed(1)}" text-anchor="end">${km}</text>`;
        });
        out += `<text class="depth-text" x="${SEC_X0 - 4}" y="${(dy(700) + 3).toFixed(1)}" text-anchor="end">km</text>`;

        // a bar showing how far 200 km is at this scale
        const barPx = 200 * PX_PER_KM;
        out += `<line class="scale-bar" x1="${SEC_X1 - barPx - 10}" y1="${BOTTOM_Y - 8}" x2="${SEC_X1 - 10}" y2="${BOTTOM_Y - 8}"/>`;
        out += `<text class="scale-text" x="${SEC_X1 - barPx / 2 - 10}" y="${BOTTOM_Y - 12}" text-anchor="middle">200 km</text>`;

        out += `<text class="part-label" x="20" y="20">${a.info.label} (${a.info.place}) — 판이 ${a.info.moves}</text>`;
        out += `<text class="note-text" x="20" y="206">` +
               (a.k === 'inside'
                   ? `${a.v} cm/년 × ${(a.t * 1e4).toLocaleString()}년 = ${a.dist.toFixed(0)} km 이동 · 가장 깊은 지진 ${a.deepest.toFixed(0)} km`
                   : `한쪽 판이 ${a.dist.toFixed(0)} km, 두 판을 합쳐 ${a.total.toFixed(0)} km · 가장 깊은 지진 ${a.deepest.toFixed(0)} km`) +
               `</text>`;
        mainGroup.innerHTML = out;
    }

    function renderGraph(a) {
        const gx = km => GRAPH.x0 + ((km + GRAPH.span) / (2 * GRAPH.span)) * (GRAPH.x1 - GRAPH.x0);
        const gy = km => GRAPH.y1 + (km / DEPTH_MAX) * (GRAPH.y0 - GRAPH.y1);
        let out = '';
        [-700, -350, 0, 350, 700].forEach(km => {
            out += `<line class="grid-line" x1="${gx(km).toFixed(1)}" y1="${GRAPH.y1}" x2="${gx(km).toFixed(1)}" y2="${GRAPH.y0}"/>`;
            out += `<text class="axis-text" x="${gx(km).toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${km}</text>`;
        });
        [0, 200, 400, 600].forEach(km => {
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(gy(km) + 3).toFixed(1)}" text-anchor="end">${km}</text>`;
        });
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y1}" x2="${GRAPH.x1}" y2="${GRAPH.y1}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y1}" x2="${GRAPH.x0}" y2="${GRAPH.y0}"/>`;
        out += `<text class="axis-title" x="${((GRAPH.x0 + GRAPH.x1) / 2).toFixed(1)}" y="${GRAPH.y0 + 32}" text-anchor="middle">경계로부터의 거리 (km)</text>`;
        out += `<text class="axis-title" x="${GRAPH.x0}" y="${GRAPH.y1 - 10}">깊이 (km)</text>`;

        [[SHALLOW, '얕은 지진'], [MIDDLE, '중간 깊이']].forEach(([km, name]) => {
            out += `<line class="zone-line" x1="${GRAPH.x0}" y1="${gy(km).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(km).toFixed(1)}"/>`;
            out += `<text class="zone-text" x="${GRAPH.x1 - 4}" y="${(gy(km) - 4).toFixed(1)}" text-anchor="end">${name} ${km} km</text>`;
        });
        a.pts.forEach(p => {
            if (Math.abs(p.dist) > GRAPH.span) return;
            out += `<circle class="quake${p.depth > MIDDLE ? ' deep' : ''}" cx="${gx(p.dist).toFixed(1)}" cy="${gy(p.depth).toFixed(1)}" r="3"/>`;
        });
        // anchored right: the y-axis title already sits at the left of this row
        out += `<text class="legend-text" fill="#8fa8b0" x="${GRAPH.x1}" y="${GRAPH.y1 - 10}" text-anchor="end">지진 ${a.pts.length}개 · 가장 깊은 곳 ${a.deepest.toFixed(0)} km</text>`;
        graphGroup.innerHTML = out;
    }

    function render() {
        const a = analyse();
        renderMain(a);
        renderGraph(a);
        speedOutput.textContent = `${a.v} cm/년`;
        timeOutput.textContent = `${a.t.toLocaleString()} 만년`;
        stageBadge.textContent = `${a.info.label} · 가장 깊은 지진 ${a.deepest.toFixed(0)} km`;
        const deepCount = a.pts.filter(p => p.depth > MIDDLE).length;
        dataNote.innerHTML =
            `<div class="data-row"><span class="data-name">판의 이동</span><span class="data-val">${a.v} cm/년 × ${(a.t * 1e4).toLocaleString()}년 = ${a.dist.toFixed(0)} km</span></div>` +
            (a.k === 'diverge'
                ? `<div class="data-row"><span class="data-name">새 해양 지각</span><span class="data-val">해령 양쪽으로 ${a.dist.toFixed(0)} km씩, 모두 ${a.total.toFixed(0)} km</span></div>`
                : a.k === 'converge'
                    ? `<div class="data-row"><span class="data-name">사라진 판</span><span class="data-val">${a.total.toFixed(0)} km가 맨틀 속으로 들어갔습니다</span></div>`
                    : a.k === 'transform'
                        ? `<div class="data-row"><span class="data-name">어긋난 거리</span><span class="data-val">양쪽을 합쳐 ${a.total.toFixed(0)} km</span></div>`
                        : `<div class="data-row"><span class="data-name">경계까지</span><span class="data-val">멀리 떨어져 있어 힘이 쌓이지 않습니다</span></div>`) +
            `<div class="data-row"><span class="data-name">지진 수</span><span class="data-val">${a.pts.length}개 · 이 가운데 ${MIDDLE} km보다 깊은 것 ${deepCount}개</span></div>` +
            `<div class="data-row match"><span class="data-name">가장 깊은 지진</span><span class="data-val">${a.deepest.toFixed(0)} km</span></div>`;
        return a;
    }

    const VERDICT = { shallow: '얕은 지진만', deep: '깊은 지진까지', none: '지진이 거의 없다' };

    function check() {
        const a = analyse();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        valueA.textContent = `${a.total.toFixed(0)} km`;
        valueB.textContent = `${a.deepest.toFixed(0)} km`;
        predictionResult.textContent = !prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        let s = `${a.v} cm씩 ${(a.t * 1e4).toLocaleString()}년 동안 움직이면 한쪽 판이 ${a.dist.toFixed(0)} km를 갑니다. `;
        if (a.k === 'diverge') {
            s += `해령에서 새 지각이 계속 만들어져 양쪽으로 ${a.dist.toFixed(0)} km 씩, 모두 ${a.total.toFixed(0)} km 넓어졌습니다. ` +
                 `해령에서 멀수록 오래된 지각이고, 양쪽이 좌우 대칭입니다. ` +
                 `판이 벌어지기만 하므로 지진은 ${a.deepest.toFixed(0)} km보다 깊은 곳에서는 일어나지 않습니다.`;
        } else if (a.k === 'converge') {
            s += `두 판을 합쳐 ${a.total.toFixed(0)} km 만큼의 판이 해구에서 맨틀 속으로 들어갔습니다. ` +
                 `들어간 판이 45도로 비스듬히 내려가기 때문에, 해구에서 멀어질수록 지진이 점점 깊어져 ${a.deepest.toFixed(0)} km 까지 이릅니다. ` +
                 `이렇게 비스듬히 줄지어 나타나는 지진대가 판이 내려가고 있다는 증거입니다.`;
        } else if (a.k === 'transform') {
            s += `두 판이 서로 어긋나기만 해 모두 ${a.total.toFixed(0)} km가 밀려났습니다. ` +
                 `새 지각이 생기지도, 사라지지도 않습니다. 어긋나는 힘은 얕은 곳에 쌓이므로 지진도 ${a.deepest.toFixed(0)} km보다 얕은 곳에서만 일어납니다.`;
        } else {
            s += `하지만 이곳은 판의 한가운데라 부딪치거나 벌어지는 곳이 없습니다. ` +
                 `힘이 쌓이지 않으니 지진이 ${a.pts.length}개밖에 없고 그마저도 아주 얕습니다. 지진은 판의 경계에 몰려 있습니다.`;
        }
        explanation.textContent = s;
    }

    function stopRun() { running = false; if (frameId) cancelAnimationFrame(frameId); frameId = 0; }

    function tick(dt) {
        const next = Math.min(1000, Number(timeRange.value) + dt * 200);
        timeRange.value = String(Math.round(next / 10) * 10);
        render();
        return next >= 1000;
    }

    function frame(stamp) {
        if (!running) return;
        const dt = Math.min(0.05, (stamp - lastStamp) / 1000 || 0);
        lastStamp = stamp;
        if (tick(dt)) { stopRun(); check(); } else frameId = requestAnimationFrame(frame);
    }

    function startRun() {
        stopRun();
        timeRange.value = '0';
        running = true;
        lastStamp = performance.now();
        render();
        frameId = requestAnimationFrame(frame);
    }

    function changed() {
        stopRun();
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        render();
    }

    [speedRange, timeRange].forEach(el => el.addEventListener('input', () => {
        stopRun(); render(); if (!resultContent.hidden) check();
    }));
    kindButtons.forEach(button => button.addEventListener('click', () => {
        kind = button.dataset.kind;
        kindButtons.forEach(item => item.classList.toggle('selected', item === button));
        stageCaption.textContent = kind === 'converge'
            ? '지진이 비스듬히 줄지어 깊어집니다. 판이 내려가는 길입니다.'
            : '지진이 일어난 곳에 점을 찍었습니다. 깊이가 어떻게 다른지 보세요.';
        changed();
    }));
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction;
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        speedRange.value = '5'; timeRange.value = '0';
        prediction = null;
        predictionButtons.forEach(item => item.classList.remove('selected'));
        kindButtons.find(b => b.dataset.kind === 'diverge').click();
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

    window.__plateModel = {
        DEPTH_MAX, PX_PER_KM, SHALLOW, MIDDLE, KINDS, analyse, quakes, moved, render, check,
        setKind(k) { kindButtons.find(b => b.dataset.kind === k).click(); },
        setSpeed(v) { speedRange.value = String(v); speedRange.dispatchEvent(new Event('input')); },
        setYears(v) { timeRange.value = String(v); timeRange.dispatchEvent(new Event('input')); },
        runToEnd(dt = 0.1, cap = 500) {
            stopRun(); timeRange.value = '0';
            let n = 0; while (!tick(dt) && n < cap) n += 1;
            check(); return { steps: n, years: Number(timeRange.value) };
        },
        getKind: () => kind, speed, years,
    };

    resetBtn.click();
});

/* 그림 속 문장을 HTML로 내린다. 액자를 벗어나거나 서로 겹치는 글자만 옮기므로
   조건이 바뀌어도 스스로 맞는다. 그림에는 짧은 이름표만 남는다. */
(function () {
    const stageVerdict = document.getElementById('stageVerdict');
    const stageReadout = document.getElementById('stageReadout');
    const stageNote = document.getElementById('stageNote');
    if (!stageReadout) return;
    const pairs = [['mainGroup', '.main-svg'], ['graphGroup', '.graph-svg']]
        .map(([id, sel]) => [document.getElementById(id), document.querySelector(sel)])
        .filter(([g, s]) => g && s);
    if (!pairs.length) return;

    // 그림에서 쓰던 색이 흰 바탕에서는 너무 흐린 경우가 있어, 그런 색은 버리고 기본색을 쓴다.
    function readableOnWhite(c) {
        let r, g, b;
        if (c[0] === '#') {
            let h = c.slice(1);
            if (h.length === 3) h = h.split('').map(x => x + x).join('');
            if (h.length !== 6) return false;
            r = parseInt(h.slice(0, 2), 16); g = parseInt(h.slice(2, 4), 16); b = parseInt(h.slice(4, 6), 16);
        } else {
            const m = c.match(/[\d.]+/g);
            if (!m || m.length < 3) return false;
            r = +m[0]; g = +m[1]; b = +m[2];
            const a = m.length > 3 ? +m[3] : 1;
            r = a * r + (1 - a) * 255; g = a * g + (1 - a) * 255; b = a * b + (1 - a) * 255;
        }
        const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
        const L = 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
        return 1.05 / (L + 0.05) >= 3.5;
    }

    function liftProse() {
        const rows = [], notes = [], verdicts = [];
        const takeOut = t => {
            const cls = t.getAttribute('class') || '';let txt = t.textContent.trim();
            if(t.matches('.stat-value')){
                const label=t.previousElementSibling;
                if(label?.matches('.stat-name')&&label.getAttribute('y')===t.getAttribute('y')){txt=label.textContent.trim()+': '+txt;label.remove();}
            }
            if (txt) {
                if (/verdict-text/.test(cls)) verdicts.push(txt);
                else if (/note-text/.test(cls)) notes.push(txt);
                else rows.push({ txt, fill: t.style.fill || '' });
            }
            t.remove();
        };
        pairs.forEach(([g, svg]) => {
            const vb = svg.viewBox.baseVal, W = vb.width, H = vb.height;
            const outside = b => b.x < -0.5 || b.x + b.width > W + 0.5 || b.y + b.height > H + 0.5 || b.y < -0.5;
            [...g.querySelectorAll('text')].forEach(t => {
                const cls = t.getAttribute('class') || '';
                const must = /verdict-text|note-text|prose/.test(cls);
                let b; try { b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); } catch (e) { return; }
                // 눈금 같은 짧은 이름표는 밖으로 내보내면 뜻을 잃는다. 액자 안으로 밀어 넣어 본다.
                if (!must && outside(b) && b.width < W * 0.6 && !t.getAttribute('transform')) {
                    const x = parseFloat(t.getAttribute('x')), y = parseFloat(t.getAttribute('y'));
                    if (!Number.isNaN(x)) {
                        const dx = b.x + b.width > W - 2 ? (W - 2) - (b.x + b.width) : (b.x < 2 ? 2 - b.x : 0);
                        if (dx) { t.setAttribute('x', (x + dx).toFixed(1)); b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); }
                    }
                    if (!Number.isNaN(y)) {
                        const dy = b.y + b.height > H - 1 ? (H - 1) - (b.y + b.height) : (b.y < 1 ? 1 - b.y : 0);
                        if (dy) { t.setAttribute('y', (y + dy).toFixed(1)); b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); }
                    }
                }
                if (must || outside(b)) takeOut(t);
            });
            const items = [...g.querySelectorAll('text')].map(t => {
                let b; try { b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); } catch (e) { b = null; }
                return { t, b, len: t.textContent.trim().length };
            }).filter(o => o.b);
            const drop = new Set();
            for (let i = 0; i < items.length; i += 1) for (let j = i + 1; j < items.length; j += 1) {
                if (drop.has(i) || drop.has(j)) continue;
                const a = items[i].b, c = items[j].b;
                if (Math.min(a.x + a.width, c.x + c.width) - Math.max(a.x, c.x) <= 3) continue;
                if (Math.min(a.y + a.height, c.y + c.height) - Math.max(a.y, c.y) <= 1.5) continue;
                const k = items[i].len >= items[j].len ? i : j;
                if (items[k].len < 8) continue;
                drop.add(k);
            }
            [...drop].sort((x, y) => x - y).forEach(k => takeOut(items[k].t));
        });
        // 옮긴 것이 없는 실행은 우리 자신이 일으킨 메아리다. 그때 지우면 방금 옮긴 글이 사라진다.
        if (!rows.length && !notes.length && !verdicts.length) return;
        if (stageVerdict) stageVerdict.textContent = verdicts.join(' ');
        stageReadout.textContent = '';
        rows.forEach(r => {
            const s = document.createElement('span');
            s.textContent = r.txt;
            if (r.fill && readableOnWhite(r.fill)) s.style.color = r.fill;
            stageReadout.appendChild(s);
        });
        if (stageNote) stageNote.textContent = notes.join(' ');
    }

    // 화면이 다시 그려지면 곧바로 돈다. 옮기는 동안 스스로를 깨우지 않도록 잠근다.
    let busy = false, obs;
    // 글자를 옮기는 것도 화면 변경이라 감시기가 다시 불린다. 그때는 기록이 비어 있으므로
    // 그냥 돌아가야 한다. 그러지 않으면 두 번째 실행이 방금 옮긴 결과를 지운다.
    const run = recs => {
        if (busy || (recs && recs.length === 0)) return;
        busy = true;
        try { liftProse(); } finally { obs.takeRecords(); busy = false; }
    };
    obs = new MutationObserver(run);
    pairs.forEach(([g]) => obs.observe(g, { childList: true, subtree: true }));
    run();
    document.addEventListener('DOMContentLoaded', run);
})();
