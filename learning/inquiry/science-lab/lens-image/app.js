document.addEventListener('DOMContentLoaded', () => {
    const lensButtons = [...document.querySelectorAll('[data-lens]')];
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const focusRange = document.getElementById('focusRange');
    const distRange = document.getElementById('distRange');
    const focusOutput = document.getElementById('focusOutput');
    const distOutput = document.getElementById('distOutput');
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

    const LENS_X = 230, AXIS_Y = 122, SCALE = 3.3;   // pixels per centimetre (가로)
    const OBJ_CM = 5;                                 // how tall the object is
    const OBJ_PX = 32;                                // 그림에서 물체 높이 (세로는 읽기 쉽게 키움 — 작도는 세로 배율과 무관)
    const BENCH = { x0: 26, x1: 434, y0: 12, y1: 236 };
    const GRAPH = { x0: 66, x1: 424, y0: 160, y1: 30, aMax: 60, bMax: 60 };

    let lens = 'convex';
    let prediction = null;
    // 작도 진행: 0 = 아직 안 그음, 1 = 세 광선과 상까지 다 그음
    let drawn = 0, checked = false, animId = 0;

    const focal = () => (lens === 'convex' ? 1 : -1) * Number(focusRange.value);
    const dist = () => Number(distRange.value);

    function analyse(f = focal(), a = dist()) {
        // 1/a + 1/b = 1/f, so b = af / (a - f)
        const parallel = Math.abs(a - f) < 1e-9;
        const b = parallel ? Infinity : (a * f) / (a - f);
        const m = parallel ? Infinity : b / a;
        const kind = parallel ? 'none' : b > 0 ? 'real' : 'virtual';
        return { f, a, b, m, kind, parallel, upright: b < 0, magnified: Math.abs(m) > 1 };
    }

    // Each ray is worked out from its own rule, never from the answer.
    function rays(a) {
        const xo = LENS_X - a.a * SCALE;
        const yo = AXIS_Y - OBJ_PX;
        const fpx = a.f * SCALE;
        // 1. in parallel to the axis, out through the far focus
        const r1 = { x: LENS_X, y: yo, slope: (AXIS_Y - yo) / fpx };
        // 2. straight through the middle of the lens
        const r2 = { x: LENS_X, y: AXIS_Y, slope: (AXIS_Y - yo) / (LENS_X - xo) };
        // 3. in through the near focus, out parallel to the axis
        const nearF = LENS_X - fpx;
        const yAtLens = nearF === xo ? yo : yo + ((AXIS_Y - yo) * (LENS_X - xo)) / (nearF - xo);
        const r3 = { x: LENS_X, y: yAtLens, slope: 0 };
        return { xo, yo, r1, r2, r3 };
    }

    const at = (r, x) => r.y + r.slope * (x - r.x);
    // a negative focal length needs brackets, or the sums read as "20−-10"
    const sf = v => (v < 0 ? `(−${Math.abs(v)})` : String(v));
    const clamp01 = v => Math.max(0, Math.min(1, v));
    // 선분을 비율 u 만큼만 그린다
    const part = (x1, y1, x2, y2, u) => `M${x1.toFixed(1)},${y1.toFixed(1)} L${(x1 + (x2 - x1) * u).toFixed(1)},${(y1 + (y2 - y1) * u).toFixed(1)}`;
    const arrow = (x, yBase, yTip, cls) => {
        const dir = yTip > yBase ? -1 : 1;
        return `<line class="${cls}" x1="${x.toFixed(1)}" y1="${yBase}" x2="${x.toFixed(1)}" y2="${yTip.toFixed(1)}"/>` +
            `<path class="${cls} head" d="M${(x - 7).toFixed(1)},${(yTip + dir * 10).toFixed(1)} L${x.toFixed(1)},${yTip.toFixed(1)} L${(x + 7).toFixed(1)},${(yTip + dir * 10).toFixed(1)} Z"/>`;
    };

    function renderMain(a) {
        const R = rays(a);
        const fpx = a.f * SCALE;
        const imgX = LENS_X + a.b * SCALE;
        const imgY = AXIS_Y + OBJ_PX * (a.b / a.a);
        const onScreen = !a.parallel && imgX > BENCH.x0 + 6 && imgX < BENCH.x1 - 6 && imgY > BENCH.y0 + 6 && imgY < BENCH.y1 - 6;
        let body = '';

        // the bench
        body += `<line class="axis-line" x1="${BENCH.x0}" y1="${AXIS_Y}" x2="${BENCH.x1}" y2="${AXIS_Y}"/>`;
        for (let cm = -60; cm <= 60; cm += 10) {
            const x = LENS_X + cm * SCALE;
            if (x < BENCH.x0 || x > BENCH.x1) continue;
            body += `<line class="tick" x1="${x.toFixed(1)}" y1="${AXIS_Y - 4}" x2="${x.toFixed(1)}" y2="${AXIS_Y + 4}"/>`;
        }
        // the lens itself
        const LH = 84;
        if (lens === 'convex') {
            body += `<path class="lens-body" d="M${LENS_X},${AXIS_Y - LH} Q${LENS_X + 20},${AXIS_Y} ${LENS_X},${AXIS_Y + LH} ` +
                    `Q${LENS_X - 20},${AXIS_Y} ${LENS_X},${AXIS_Y - LH} Z"/>`;
        } else {
            body += `<path class="lens-body" d="M${LENS_X - 11},${AXIS_Y - LH} L${LENS_X + 11},${AXIS_Y - LH} ` +
                    `Q${LENS_X - 1},${AXIS_Y} ${LENS_X + 11},${AXIS_Y + LH} L${LENS_X - 11},${AXIS_Y + LH} ` +
                    `Q${LENS_X + 1},${AXIS_Y} ${LENS_X - 11},${AXIS_Y - LH} Z"/>`;
        }
        // focal points on both sides
        [fpx, -fpx].forEach((d, i) => {
            const x = LENS_X + d;
            body += `<circle class="focus-dot" cx="${x.toFixed(1)}" cy="${AXIS_Y}" r="3.6"/>`;
            body += `<text class="focus-text" x="${x.toFixed(1)}" y="${AXIS_Y + 19}" text-anchor="middle">${i === 0 ? 'F′' : 'F'}</text>`;
        });

        // the object
        body += arrow(R.xo, AXIS_Y, R.yo, 'object-arrow');
        body += `<text class="small-label" x="${R.xo.toFixed(1)}" y="${(R.yo - 9).toFixed(1)}" text-anchor="middle">물체</text>`;

        // the three rays, one after another: 물체 → 렌즈 (앞 절반), 렌즈 → 끝 (뒤 절반)
        const endX = a.kind === 'virtual' || a.parallel ? BENCH.x1 : Math.min(BENCH.x1, Math.max(imgX + 30, LENS_X + 40));
        [['r1', R.r1], ['r2', R.r2], ['r3', R.r3]].forEach(([cls, r], i) => {
            const u = clamp01((drawn * 4 - i) / 1);            // 이 광선의 진행 0→1
            if (u <= 0) return;
            const inY = cls === 'r1' ? R.yo : r.y;
            const u1 = clamp01(u * 2), u2 = clamp01(u * 2 - 1);
            body += `<path class="ray ${cls}" d="${part(R.xo, R.yo, LENS_X, inY, u1)}"/>`;
            if (u2 > 0) body += `<path class="ray ${cls}" d="${part(LENS_X, r.y, endX, at(r, endX), u2)}"/>`;
            // for a virtual image the rays never really meet, so trace them back
            if (a.kind === 'virtual' && u2 >= 1) body += `<path class="ray ${cls} back" d="M${LENS_X},${r.y.toFixed(1)} L${imgX.toFixed(1)},${at(r, imgX).toFixed(1)}"/>`;
            // 빛이 나아가는 앞머리 점
            if (u < 1) { const [hx, hy] = u2 > 0 ? [LENS_X + (endX - LENS_X) * u2, r.y + (at(r, endX) - r.y) * u2] : [R.xo + (LENS_X - R.xo) * u1, R.yo + (inY - R.yo) * u1]; body += `<circle class="ray-head ${cls}" cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" r="3.2"/>`; }
        });

        // the image: 세 광선을 다 그은 뒤 물체와 같은 화살표로 자라난다
        const grow = clamp01((drawn - 0.75) / 0.2);
        if (onScreen && grow > 0) {
            const yTip = AXIS_Y + (imgY - AXIS_Y) * grow;
            body += arrow(imgX, AXIS_Y, yTip, `image-arrow${a.kind === 'virtual' ? ' virtual' : ''}`);
            if (grow >= 1) {
                // 실상은 화살표 옆, 허상은 물체·광선과 겹치지 않게 광축 아래에 적는다
                let lx, ly, anchor;
                if (a.kind === 'virtual') { lx = Math.min(imgX + 4, LENS_X - 18); ly = AXIS_Y + 42; anchor = 'end'; }
                else { const right = imgX < BENCH.x1 - 110; lx = imgX + (right ? 12 : -12); ly = (AXIS_Y + imgY) / 2 + 5; anchor = right ? 'start' : 'end'; }
                body += `<text class="image-label" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${anchor}">${a.kind === 'virtual' ? '바로 선 허상' : '거꾸로 선 실상'}</text>`;
            }
        }

        let out = `<g clip-path="url(#benchClip)">${body}</g>`;
        if (drawn >= 1 && a.parallel) out += `<text class="warn-text" x="20" y="244">물체가 초점에 있어 굴절한 빛이 나란해집니다 — 상이 생기지 않습니다</text>`;
        else if (drawn >= 1 && !onScreen) out += `<text class="warn-text" x="20" y="244">상이 그림 밖에 생깁니다 — 물체의 위치를 바꾸어 보세요</text>`;
        window.scienceScene.render(mainGroup,out);
    }

    // 상 거리 그래프: 1/a + 1/b = 1/f 를 따라 물체 거리 a 에 따른 상 거리 b (작도한 뒤에만)
    function renderGraph(a) {
        const G = GRAPH, gx = v => G.x0 + (v / G.aMax) * (G.x1 - G.x0), yMid = (G.y0 + G.y1) / 2;
        const gy = v => yMid - Math.max(-1, Math.min(1, v / G.bMax)) * (G.y0 - G.y1) / 2;
        let out = '';
        [-60, -30, 0, 30, 60].forEach(v => { out += `<line class="grid-line" x1="${G.x0}" y1="${gy(v).toFixed(1)}" x2="${G.x1}" y2="${gy(v).toFixed(1)}"/><text class="axis-text" x="${G.x0 - 6}" y="${(gy(v) + 4).toFixed(1)}" text-anchor="end">${v}</text>`; });
        [0, 10, 20, 30, 40, 50, 60].forEach(v => { out += `<text class="axis-text" x="${gx(v).toFixed(1)}" y="${G.y0 + 16}" text-anchor="middle">${v}</text>`; });
        out += `<line class="axis" x1="${G.x0}" y1="${G.y0}" x2="${G.x1}" y2="${G.y0}"/><line class="axis" x1="${G.x0}" y1="${G.y1}" x2="${G.x0}" y2="${G.y0}"/><line class="zero-line" x1="${G.x0}" y1="${yMid}" x2="${G.x1}" y2="${yMid}"/>`;
        out += `<text class="axis-title" x="${G.x0}" y="${G.y1 - 10}">상 거리 b (cm) · 위는 실상, 아래는 허상</text>`;
        out += `<text class="axis-title" x="${(G.x0 + G.x1) / 2}" y="${G.y0 + 34}" text-anchor="middle">물체 거리 a (cm)</text>`;
        if (drawn >= 1) {
            if (a.f > 0) out += `<line class="asym-line" x1="${gx(a.f).toFixed(1)}" y1="${G.y1}" x2="${gx(a.f).toFixed(1)}" y2="${G.y0}"/><text class="asym-text" x="${(gx(a.f) + 5).toFixed(1)}" y="${G.y0 - 8}">a = f</text>`;
            let d = '', pen = false;
            for (let v = 1; v <= G.aMax; v += 0.25) {
                const r = analyse(a.f, v);
                if (!Number.isFinite(r.b) || Math.abs(r.b) > G.bMax * 1.05) { pen = false; continue; }
                d += `${pen ? 'L' : 'M'}${gx(v).toFixed(1)},${gy(r.b).toFixed(1)} `; pen = true;
            }
            out += `<path class="trace" d="${d}"/>`;
            if (Number.isFinite(a.b) && Math.abs(a.b) <= G.bMax) out += `<circle class="trace-dot" fill="#ea580c" cx="${gx(a.a).toFixed(1)}" cy="${gy(a.b).toFixed(1)}" r="5"/>`;
        }
        window.scienceScene.render(graphGroup, out);
    }

    function render() {
        const a = analyse();
        renderMain(a);
        renderGraph(a);
        focusOutput.textContent = `${Math.abs(a.f)} cm`;
        distOutput.textContent = `${a.a} cm`;
        const done = drawn >= 1;
        stageBadge.textContent = !done ? `${lens === 'convex' ? '볼록' : '오목'} 렌즈 · a = ${a.a} cm` : a.parallel ? '상이 생기지 않음' : `${a.kind === 'real' ? '실상' : '허상'}`;
        window.scienceScene.render(dataNote, !done ? '<p>작도해 보기를 누르면 세 광선을 차례로 긋습니다.</p>'
            : a.parallel ? '<p>a = f 이면 렌즈를 지난 광선이 나란히 나아갑니다.</p>'
            : `<p>a = ${a.a} cm, b = ${sf(+a.b.toFixed(1))} cm, 배율 ${Math.abs(a.m).toFixed(2)}배 (b ÷ a)</p>`);
        return a;
    }

    function stopAnim() { if (animId) cancelAnimationFrame(animId); animId = 0; }
    function check() {
        stopAnim(); checked = true; drawn = 1;
        const a = render();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        valueA.textContent = a.parallel ? '광선 나란함' : a.kind === 'real' ? '실상' : '허상';
        valueB.textContent = a.parallel ? '—' : Math.abs(Math.abs(a.m) - 1) < 1e-8 ? '같은 크기' : a.magnified ? '물체보다 큼' : '물체보다 작음';
        predictionResult.textContent = !prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : prediction === a.kind ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        const s = a.parallel ? '렌즈를 지난 빛이 나란히 나아가므로 가까운 스크린에 상이 맺히지 않습니다.' : a.kind === 'real' ? '렌즈를 지난 빛이 실제로 모여 거꾸로 선 실상이 생깁니다. 스크린으로 확인할 수 있습니다.' : '렌즈를 지난 빛이 퍼져 나갑니다. 광선의 연장선이 만나는 것처럼 보이는 곳에 바로 선 허상이 보입니다.';
        explanation.textContent = s;
    }

    // '작도해 보기': 광선 1·2·3을 차례로 긋고, 상 화살표가 자란 뒤 결과를 적는다
    function playDraw() {
        stopAnim(); checked = false;
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { check(); return; }
        resultEmpty.hidden = false; resultContent.hidden = true;
        const t0 = performance.now(), dur = 3600;
        const step = now => { drawn = Math.min(1, (now - t0) / dur); if (drawn >= 1) { animId = 0; check(); return; } render(); animId = requestAnimationFrame(step); };
        drawn = 0; render(); animId = requestAnimationFrame(step);
    }

    function changed() {
        stopAnim(); checked = false; drawn = 0;
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        render();
    }

    [focusRange, distRange].forEach(el => el.addEventListener('input', () => {
        if (checked) check(); else { stopAnim(); drawn = 0; resultEmpty.hidden = false; resultContent.hidden = true; render(); }
    }));
    lensButtons.forEach(button => button.addEventListener('click', () => {
        lens = button.dataset.lens;
        lensButtons.forEach(item => item.classList.toggle('selected', item === button));
        stageCaption.textContent = lens === 'convex'
            ? '렌즈를 지난 광선과 그 연장선이 만나는 곳을 관찰합니다.'
            : '오목 렌즈에서는 광선이 퍼지므로 뒤로 이어야 만납니다.';
        changed();
    }));
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    checkBtn.addEventListener('click', playDraw);
    resetBtn.addEventListener('click', () => {
        focusRange.value = '10'; distRange.value = '30';
        prediction = null;
        predictionButtons.forEach(item => item.classList.remove('selected'));
        lensButtons.find(b => b.dataset.lens === 'convex').click();
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

    window.__lensModel = {
        LENS_X, AXIS_Y, SCALE, OBJ_CM, analyse, rays, at, render, check,
        setLens(k) { lensButtons.find(b => b.dataset.lens === k).click(); },
        setFocus(v) { focusRange.value = String(v); focusRange.dispatchEvent(new Event('input')); },
        setDist(v) { distRange.value = String(v); distRange.dispatchEvent(new Event('input')); },
        getLens: () => lens, focal, dist,
    };

    resetBtn.click();
});
