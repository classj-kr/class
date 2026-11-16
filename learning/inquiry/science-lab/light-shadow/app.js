document.addEventListener('DOMContentLoaded', () => {
    const shapeButtons = [...document.querySelectorAll('[data-shape]')];
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const distanceRange = document.getElementById('distanceRange');
    const graphGroup = document.getElementById('graphGroup');
    const dataNote = document.getElementById('dataNote');
    const distanceOutput = document.getElementById('distanceOutput');
    const distanceBadge = document.getElementById('distanceBadge');
    const checkButton = document.getElementById('checkShadowBtn');
    const resultEmpty = document.getElementById('resultEmpty');
    const resultContent = document.getElementById('resultContent');
    const resultShadow = document.getElementById('resultShadow');
    const resultRatio = document.getElementById('resultRatio');
    const predictionResult = document.getElementById('predictionResult');
    const explanation = document.getElementById('elementaryExplanation');
    const stageCaption = document.getElementById('stageCaption');

    const rayGroup = document.getElementById('rayGroup');
    const edgeRayTop = document.getElementById('edgeRayTop');
    const edgeRayBottom = document.getElementById('edgeRayBottom');
    const shadowSide = document.getElementById('shadowSide');
    const objectCard = document.getElementById('objectCard');
    const objectLabel = document.getElementById('objectLabel');
    const objectLabelChip = document.getElementById('objectLabelChip');
    const dimLine = document.getElementById('dimLine');
    const dimTickEnd = document.getElementById('dimTickEnd');
    const dimLabel = document.getElementById('dimLabel');
    const frontCircle = document.getElementById('frontCircle');
    const frontSquare = document.getElementById('frontSquare');
    const frontTriangle = document.getElementById('frontTriangle');

    // Optical bench geometry, all in the side view's own SVG units.
    // 5 units = 1 cm, so the lamp-to-screen gap (436 - 36 = 400 units) is
    // exactly the 80 cm quoted in the UI — the numbers on screen and the
    // drawing are the same measurement, not two independent guesses.
    const LIGHT_X = 36;
    const CENTER_Y = 150;
    const SCREEN_X = 436;
    const PX_PER_CM = 5;
    const SCREEN_DIST_CM = (SCREEN_X - LIGHT_X) / PX_PER_CM;
    const OBJ_HALF = 30;                 // half the card's height, in units
    const CARD_HEIGHT_CM = (OBJ_HALF * 2) / PX_PER_CM;
    const REFERENCE_CM = 40;

    // Front view: a 150-unit square standing in for the screen's 260-unit
    // height in the side view, so a shadow measured in one view converts
    // straight into the other.
    const FRONT_CENTER = 90;
    const FRONT_SCALE = 150 / 260;

    const lightCone = document.getElementById('lightCone');
    const darkZone = document.getElementById('darkZone');
    const objectPole = document.getElementById('objectPole');
    const objectBase = document.getElementById('objectBase');
    const ghostMark = document.getElementById('ghostMark');
    const ghostCard = document.getElementById('ghostCard');
    const ghostLabel = document.getElementById('ghostLabel');
    // 빛줄기 선 네 개를 미리 만들어 두고 drawBench가 자리만 옮긴다.
    const rayLines = Array.from({ length: 4 }, () => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('class', 'ray');
        line.setAttribute('x1', String(LIGHT_X));
        line.setAttribute('y1', String(CENTER_Y));
        rayGroup.append(line);
        return line;
    });
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');

    let selectedShape = 'circle';
    let prediction = null;
    let shownDistance = REFERENCE_CM;   // 물체가 지금 서 있는 자리(처음은 기준 40 cm)
    let checked = false;                 // 확인한 뒤에만 그래프·기록을 보인다
    const measured = new Map();          // 아이가 확인해 본 거리 → 그림자 높이
    let anim = 0;

    // Linear magnification of a point-source shadow: an object d cm from the
    // lamp with the screen D cm away casts a shadow D/d times its own size.
    const magnification = distanceCm => SCREEN_DIST_CM / distanceCm;

    // 물체를 distance(cm) 자리에 세우고, 빛 두 줄·그림자·앞모습을 그 자리에 맞춘다.
    // reach(0~1)는 켠 빛이 스크린까지 뻗어 간 정도.
    function drawBench(distance, reach = 1) {
        const objX = LIGHT_X + distance * PX_PER_CM;
        const m = magnification(distance);
        const shadowHalf = OBJ_HALF * m;

        objectCard.setAttribute('x', (objX - 4).toFixed(1));
        objectPole.setAttribute('x', (objX - 2).toFixed(1));
        objectBase.setAttribute('x', (objX - 14).toFixed(1));
        objectLabel.setAttribute('x', objX.toFixed(1));
        objectLabelChip.setAttribute('x', (objX - Number(objectLabelChip.getAttribute('width')) / 2).toFixed(1));

        dimLine.setAttribute('x2', objX.toFixed(1));
        dimTickEnd.setAttribute('x1', objX.toFixed(1));
        dimTickEnd.setAttribute('x2', objX.toFixed(1));
        dimLabel.setAttribute('x', ((LIGHT_X + objX) / 2).toFixed(1));
        dimLabel.textContent = `${Math.round(distance)} cm`;

        const endX = LIGHT_X + (SCREEN_X - LIGHT_X) * reach;
        const k = (endX - LIGHT_X) / (SCREEN_X - LIGHT_X);
        edgeRayTop.setAttribute('x2', endX.toFixed(1));
        edgeRayBottom.setAttribute('x2', endX.toFixed(1));
        edgeRayTop.setAttribute('y2', (CENTER_Y - shadowHalf * k).toFixed(1));
        edgeRayBottom.setAttribute('y2', (CENTER_Y + shadowHalf * k).toFixed(1));
        lightCone.setAttribute('points', `${LIGHT_X},${CENTER_Y} ${endX.toFixed(1)},${(CENTER_Y - 130 * k).toFixed(1)} ${endX.toFixed(1)},${(CENTER_Y + 130 * k).toFixed(1)}`);

        // 흐르는 빛줄기: 물체를 비켜 가 스크린에 닿는 빛 두 줄과, 물체에 막혀 멈추는 빛 두 줄
        const flowRays = [];
        const room = 128 - shadowHalf;
        if (room > 4) {
            const a = shadowHalf + room * 0.55;
            flowRays.push([endX, CENTER_Y - a * k, false], [endX, CENTER_Y + a * k, false]);
        }
        const stopX = Math.min(endX, objX - 4);
        if (stopX > LIGHT_X + 2) {
            const slope = (OBJ_HALF * 0.5) / (objX - 4 - LIGHT_X);
            const dy = slope * (stopX - LIGHT_X);
            flowRays.push([stopX, CENTER_Y - dy, true], [stopX, CENTER_Y + dy, true]);
        }
        rayLines.forEach((line, i) => {
            const r = flowRays[i];
            line.style.display = r ? '' : 'none';
            if (!r) return;
            line.setAttribute('x2', r[0].toFixed(1));
            line.setAttribute('y2', r[1].toFixed(1));
            line.classList.toggle('blocked', r[2]);
        });

        const lit = reach >= 1;
        darkZone.setAttribute('points', `${objX.toFixed(1)},${CENTER_Y - OBJ_HALF} ${SCREEN_X},${(CENTER_Y - shadowHalf).toFixed(1)} ${SCREEN_X},${(CENTER_Y + shadowHalf).toFixed(1)} ${objX.toFixed(1)},${CENTER_Y + OBJ_HALF}`);
        darkZone.style.display = endX > objX ? '' : 'none';
        shadowSide.style.display = lit ? '' : 'none';
        shadowSide.setAttribute('y', (CENTER_Y - shadowHalf).toFixed(1));
        shadowSide.setAttribute('height', (shadowHalf * 2).toFixed(1));

        const s = OBJ_HALF * m * FRONT_SCALE;
        frontCircle.setAttribute('r', s.toFixed(1));
        frontSquare.setAttribute('x', (FRONT_CENTER - s).toFixed(1));
        frontSquare.setAttribute('y', (FRONT_CENTER - s).toFixed(1));
        frontSquare.setAttribute('width', (s * 2).toFixed(1));
        frontSquare.setAttribute('height', (s * 2).toFixed(1));
        frontTriangle.setAttribute('points',
            `${FRONT_CENTER},${(FRONT_CENTER - s).toFixed(1)} ${(FRONT_CENTER + s).toFixed(1)},${(FRONT_CENTER + s).toFixed(1)} ${(FRONT_CENTER - s).toFixed(1)},${(FRONT_CENTER + s).toFixed(1)}`);
        // SVG elements ignore `hidden`, so display is set outright.
        frontCircle.style.display = lit && selectedShape === 'circle' ? '' : 'none';
        frontSquare.style.display = lit && selectedShape === 'square' ? '' : 'none';
        frontTriangle.style.display = lit && selectedShape === 'triangle' ? '' : 'none';
    }

    // 슬라이더는 물체를 바로 옮기지 않고 옮길 자리만 점선으로 보여 준다.
    function showTarget() {
        const target = Number(distanceRange.value);
        distanceOutput.textContent = `${target} cm`;
        distanceBadge.textContent = `${target} cm`;
        const x = LIGHT_X + target * PX_PER_CM;
        ghostCard.setAttribute('x', (x - 4).toFixed(1));
        ghostLabel.setAttribute('x', x.toFixed(1));
        ghostMark.style.display = Math.abs(target - shownDistance) > 0.01 && !anim ? '' : 'none';
    }

    function renderScene() {
        drawBench(shownDistance);
        showTarget();
        renderGraph();
        renderData();
    }

    /* ------------------------------------------------- graph and readings */
    const GRAPH = { x0: 52, x1: 428, y0: 140, y1: 24 };
    const D_MIN = Number(distanceRange.min), D_MAX = Number(distanceRange.max);
    const SHADOW_MAX = CARD_HEIGHT_CM * magnification(D_MIN);   // biggest shadow in range
    const gx = d => GRAPH.x0 + ((d - D_MIN) / (D_MAX - D_MIN)) * (GRAPH.x1 - GRAPH.x0);
    const gy = cm => GRAPH.y0 - (cm / SHADOW_MAX) * (GRAPH.y0 - GRAPH.y1);

    // 확인해 본 거리만 점으로 찍는다(미리 그린 곡선 없음).
    function renderGraph() {
        const graphSvg = graphGroup.ownerSVGElement;
        if (graphSvg) graphSvg.style.display = checked ? '' : 'none';
        if (!checked) { window.scienceScene.render(graphGroup, ''); return; }
        let out = '';
        for (let k = 0; k <= 4; k += 1) {
            const cm = (SHADOW_MAX * k) / 4;
            const y = gy(cm);
            out += `<line class="grid-line" x1="${GRAPH.x0}" y1="${y.toFixed(1)}" x2="${GRAPH.x1}" y2="${y.toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(y + 3).toFixed(1)}" text-anchor="end">${cm.toFixed(0)}</text>`;
        }
        for (let d = D_MIN; d <= D_MAX; d += 10) {
            out += `<text class="axis-text" x="${gx(d).toFixed(1)}" y="${GRAPH.y0 + 16}" text-anchor="middle">${d}</text>`;
        }
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-title" x="${GRAPH.x1}" y="${GRAPH.y0 - 8}" text-anchor="end">물체까지 거리 (cm)</text>`;
        out += `<text class="axis-title" x="${GRAPH.x0}" y="${GRAPH.y1 - 8}">그림자 높이 (cm)</text>`;

        const objY = gy(CARD_HEIGHT_CM);
        out += `<line class="ref-line" x1="${GRAPH.x0}" y1="${objY.toFixed(1)}" x2="${GRAPH.x1}" y2="${objY.toFixed(1)}"/>`;
        out += `<text class="ref-text" x="${GRAPH.x0 + 6}" y="${(objY - 6).toFixed(1)}">물체 높이 ${CARD_HEIGHT_CM.toFixed(0)} cm</text>`;

        const pts = [...measured.entries()].sort((a, b) => a[0] - b[0]);
        if (pts.length >= 2) out += `<path class="curve" d="M${pts.map(([d, h]) => `${gx(d).toFixed(1)},${gy(h).toFixed(1)}`).join('L')}"/>`;
        const now = Math.round(shownDistance);
        pts.forEach(([d, h]) => {
            out += `<circle class="${d === now ? 'op-point' : 'op-old'}" cx="${gx(d).toFixed(1)}" cy="${gy(h).toFixed(1)}" r="${d === now ? 6 : 4.5}"/>`;
        });
        const h = measured.get(now);
        if (h != null) {
            const px = gx(now), py = gy(h), right = px < (GRAPH.x0 + GRAPH.x1) / 2;
            out += `<text class="point-text" x="${(px + (right ? 10 : -10)).toFixed(1)}" y="${(Math.max(GRAPH.y1 + 10, py - 12)).toFixed(1)}" text-anchor="${right ? 'start' : 'end'}">${now} cm → ${h.toFixed(0)} cm</text>`;
        }
        window.scienceScene.render(graphGroup, out);
    }

    // 초등 눈높이: 계산식 없이 잰 값과 기준과의 비교만.
    function renderData() {
        if (!checked) { window.scienceScene.render(dataNote, ''); return; }
        const distance = Math.round(shownDistance);
        const shadowCm = CARD_HEIGHT_CM * magnification(distance);
        const refCm = CARD_HEIGHT_CM * magnification(REFERENCE_CM);
        const word = distance < REFERENCE_CM ? '더 크다' : distance > REFERENCE_CM ? '더 작다' : '같다';
        window.scienceScene.render(dataNote,
            `<div class="data-row"><span class="data-name">광원에서 물체까지</span><span class="data-val">${distance} cm</span></div>` +
            `<div class="data-row"><span class="data-name">물체 높이</span><span class="data-val">${CARD_HEIGHT_CM.toFixed(0)} cm</span></div>` +
            `<div class="data-row"><span class="data-name">그림자 높이</span><span class="data-val">약 ${shadowCm.toFixed(0)} cm</span></div>` +
            `<div class="data-row match"><span class="data-name">40 cm일 때(${refCm.toFixed(0)} cm)와 견주면</span><span class="data-val">${word}</span></div>`);
    }

    function clearResult() {
        checked = false;
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        stageCaption.textContent = '거리를 정하고 그림자 크기를 확인해 보세요.';
        renderGraph();
        renderData();
    }

    function showResult() {
        const distance = Number(distanceRange.value);
        const m = magnification(distance);
        const shadowCm = CARD_HEIGHT_CM * m;
        const ratio = m / magnification(REFERENCE_CM);
        checked = true;
        measured.set(distance, shadowCm);

        resultShadow.textContent = `약 ${shadowCm.toFixed(0)} cm`;
        resultRatio.textContent = ratio > 1.001 ? '더 크다' : ratio < 0.999 ? '더 작다' : '같다';
        resultEmpty.hidden = true;
        resultContent.hidden = false;

        const actual = distance < REFERENCE_CM ? 'bigger' : distance > REFERENCE_CM ? 'smaller' : 'same';
        predictionResult.textContent = !prediction
            ? '다음에는 결과를 먼저 예상해 보세요.'
            : prediction === actual ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';

        stageCaption.textContent = `광원에서 ${distance} cm 떨어졌을 때 그림자 높이는 약 ${shadowCm.toFixed(0)} cm입니다.`;
        if (actual === 'bigger') {
            explanation.textContent = `물체가 기준(${REFERENCE_CM} cm)보다 광원에 가까우면 퍼져 나가는 빛을 더 넓게 가로막게 되어 그림자가 커집니다.`;
        } else if (actual === 'smaller') {
            explanation.textContent = `물체가 기준(${REFERENCE_CM} cm)보다 광원에서 멀면 빛을 가로막는 범위가 좁아져 그림자가 작아집니다.`;
        } else {
            explanation.textContent = `기준 거리와 같으므로 그림자 크기도 기준과 같습니다. 물체를 광원 쪽으로 옮기면 커지고, 스크린 쪽으로 옮기면 작아집니다.`;
        }
        renderGraph();
        renderData();
    }

    // 확인하기: 물체가 옮길 자리로 미끄러지며 그림자가 따라 변하고,
    // 자리가 같으면 전구를 다시 켜서 빛이 스크린까지 뻗어 가는 모습을 보인다.
    function checkShadow() {
        if (anim) cancelAnimationFrame(anim);
        anim = 0;
        const from = shownDistance, to = Number(distanceRange.value);
        const slide = Math.abs(to - from) > 0.01;
        ghostMark.style.display = 'none';
        if (reduceMotion?.matches) { shownDistance = to; drawBench(to); showResult(); return; }
        const dur = slide ? 700 + Math.abs(to - from) * 30 : 900;
        const start = performance.now();
        const step = now => {
            const p = Math.min(1, (now - start) / dur);
            const e = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
            if (slide) { shownDistance = from + (to - from) * e; drawBench(shownDistance); }
            else drawBench(to, Math.min(1, p * 1.15));
            if (p < 1) { anim = requestAnimationFrame(step); return; }
            anim = 0; shownDistance = to; drawBench(to); showTarget(); showResult();
        };
        if (!slide) drawBench(to, 0);
        anim = requestAnimationFrame(step);
    }

    shapeButtons.forEach(button => button.addEventListener('click', () => {
        selectedShape = button.dataset.shape;
        shapeButtons.forEach(item => item.classList.toggle('selected', item === button));
        renderScene();
    }));
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    distanceRange.addEventListener('input', () => {
        if (anim) { cancelAnimationFrame(anim); anim = 0; drawBench(shownDistance); }
        showTarget(); clearResult();
    });
    checkButton.addEventListener('click', checkShadow);

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

    renderScene();
    clearResult();
});
