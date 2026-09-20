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

    // Sample points spread down the screen; one ray is aimed at each. A ray
    // is drawn all the way to the screen if it clears the card, or cut off
    // at the card if the card is in its way — the cut-off rays are exactly
    // the ones whose screen positions fall inside the shadow.
    const RAY_TARGETS = [];
    for (let y = 25; y <= 275; y += 25) RAY_TARGETS.push(y);
    const rayLines = RAY_TARGETS.map(() => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('class', 'ray');
        line.setAttribute('x1', String(LIGHT_X));
        line.setAttribute('y1', String(CENTER_Y));
        rayGroup.appendChild(line);
        return line;
    });

    let selectedShape = 'circle';
    let prediction = null;

    // Linear magnification of a point-source shadow: an object d cm from the
    // lamp with the screen D cm away casts a shadow D/d times its own size.
    const magnification = distanceCm => SCREEN_DIST_CM / distanceCm;

    function renderScene() {
        const distance = Number(distanceRange.value);
        const objX = LIGHT_X + distance * PX_PER_CM;
        const m = magnification(distance);
        const shadowHalf = OBJ_HALF * m;

        distanceOutput.textContent = `${distance} cm`;
        distanceBadge.textContent = `${distance} cm`;

        objectCard.setAttribute('x', String(objX - 4));
        objectLabel.setAttribute('x', String(objX));
        objectLabelChip.setAttribute('x', String(objX - Number(objectLabelChip.getAttribute('width')) / 2));

        dimLine.setAttribute('x2', String(objX));
        dimTickEnd.setAttribute('x1', String(objX));
        dimTickEnd.setAttribute('x2', String(objX));
        dimLabel.setAttribute('x', String((LIGHT_X + objX) / 2));
        dimLabel.textContent = `${distance} cm`;

        shadowSide.setAttribute('y', String(CENTER_Y - shadowHalf));
        shadowSide.setAttribute('height', String(shadowHalf * 2));

        // The two rays that just graze the card's edges are the shadow's
        // boundary, so they always land exactly on the shadow rect's edges.
        edgeRayTop.setAttribute('y2', String(CENTER_Y - shadowHalf));
        edgeRayBottom.setAttribute('y2', String(CENTER_Y + shadowHalf));

        const objectT = (objX - LIGHT_X) / (SCREEN_X - LIGHT_X);
        rayLines.forEach((line, i) => {
            const screenY = RAY_TARGETS[i];
            const yAtObject = CENTER_Y + (screenY - CENTER_Y) * objectT;
            const blocked = Math.abs(yAtObject - CENTER_Y) <= OBJ_HALF;
            if (blocked) {
                line.setAttribute('class', 'ray blocked');
                line.setAttribute('x2', String(objX));
                line.setAttribute('y2', String(yAtObject));
            } else {
                line.setAttribute('class', 'ray');
                line.setAttribute('x2', String(SCREEN_X));
                line.setAttribute('y2', String(screenY));
            }
        });

        const s = OBJ_HALF * m * FRONT_SCALE;
        frontCircle.setAttribute('r', String(s));
        frontSquare.setAttribute('x', String(FRONT_CENTER - s));
        frontSquare.setAttribute('y', String(FRONT_CENTER - s));
        frontSquare.setAttribute('width', String(s * 2));
        frontSquare.setAttribute('height', String(s * 2));
        frontTriangle.setAttribute('points',
            `${FRONT_CENTER},${FRONT_CENTER - s} ${FRONT_CENTER + s},${FRONT_CENTER + s} ${FRONT_CENTER - s},${FRONT_CENTER + s}`);
        // These are SVG elements, and the `hidden` attribute has no effect on
        // them — all three shapes stayed drawn on top of one another. Display is
        // set outright instead.
        frontCircle.style.display = selectedShape === 'circle' ? '' : 'none';
        frontSquare.style.display = selectedShape === 'square' ? '' : 'none';
        frontTriangle.style.display = selectedShape === 'triangle' ? '' : 'none';

        renderGraph(distance, m, shadowHalf);
        renderData(distance, m);
    }

    /* ------------------------------------------------- graph and readings */
    const GRAPH = { x0: 52, x1: 428, y0: 140, y1: 24 };
    const D_MIN = Number(distanceRange.min), D_MAX = Number(distanceRange.max);
    const SHADOW_MAX = CARD_HEIGHT_CM * magnification(D_MIN);   // biggest shadow in range
    const gx = d => GRAPH.x0 + ((d - D_MIN) / (D_MAX - D_MIN)) * (GRAPH.x1 - GRAPH.x0);
    const gy = cm => GRAPH.y0 - (cm / SHADOW_MAX) * (GRAPH.y0 - GRAPH.y1);

    function renderGraph(distance) {
        const shadowCm = CARD_HEIGHT_CM * magnification(distance);
        let out = `
        <defs>
            <linearGradient id="shadowCurveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#ea580c" stop-opacity="0.18"/>
                <stop offset="100%" stop-color="#ea580c" stop-opacity="0.01"/>
            </linearGradient>
        </defs>`;

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
        out += `<text class="axis-title" x="${(GRAPH.x0 + GRAPH.x1) / 2}" y="${GRAPH.y0 + 32}" text-anchor="middle">광원에서 물체까지의 거리 (cm)</text>`;
        out += `<text class="axis-title" x="${GRAPH.x0}" y="${GRAPH.y1 - 8}">그림자 높이 (cm)</text>`;

        // The curve is 1/d, so it falls steeply near the lamp and flattens out
        // far away — that shape is the whole lesson.
        const pts = [];
        for (let d = D_MIN; d <= D_MAX; d += 0.5) {
            pts.push(`${gx(d).toFixed(1)},${gy(CARD_HEIGHT_CM * magnification(d)).toFixed(1)}`);
        }

        // Shaded area under curve
        const polyPts = [`${GRAPH.x0},${GRAPH.y0}`, ...pts, `${GRAPH.x1},${GRAPH.y0}`];
        out += `<polygon points="${polyPts.join(' ')}" fill="url(#shadowCurveGrad)"/>`;
        out += `<path class="curve" d="M${pts.join('L')}"/>`;

        // the object's own height reference line with high-contrast badge
        const objY = gy(CARD_HEIGHT_CM);
        out += `<line class="ref-line" x1="${GRAPH.x0}" y1="${objY.toFixed(1)}" x2="${GRAPH.x1}" y2="${objY.toFixed(1)}"/>`;
        out += `
        <g transform="translate(${GRAPH.x1 - 138}, ${(objY - 18).toFixed(1)})">
            <rect width="134" height="18" rx="5" fill="#f0f9ff" stroke="#0284c7" stroke-width="1"/>
            <text x="67" y="12.5" text-anchor="middle" fill="#0369a1" font-size="10.5" font-weight="900" font-family="Pretendard, sans-serif">물체 높이 ${CARD_HEIGHT_CM.toFixed(0)} cm (기준선)</text>
        </g>`;

        const px = gx(distance), py = gy(shadowCm);
        out += `<line class="op-guide" x1="${px.toFixed(1)}" y1="${GRAPH.y0}" x2="${px.toFixed(1)}" y2="${py.toFixed(1)}"/>`;
        out += `<line class="op-guide" x1="${GRAPH.x0}" y1="${py.toFixed(1)}" x2="${px.toFixed(1)}" y2="${py.toFixed(1)}"/>`;
        out += `<circle class="op-point" cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="5"/>`;

        const flip = px > (GRAPH.x0 + GRAPH.x1) / 2;
        const badgeW = 124, badgeH = 22;
        const badgeX = flip ? px - badgeW - 10 : px + 10;
        const badgeY = Math.max(GRAPH.y1 - 2, py - badgeH / 2);

        out += `
        <g transform="translate(${badgeX.toFixed(1)}, ${badgeY.toFixed(1)})">
            <rect width="${badgeW}" height="${badgeH}" rx="6" fill="#ffffff" stroke="#ea580c" stroke-width="1.5" filter="drop-shadow(0 2px 5px rgba(0,0,0,0.12))"/>
            <text x="${badgeW / 2}" y="15" text-anchor="middle" fill="#c2410c" font-size="11" font-weight="900" font-family="Pretendard, monospace">${distance} cm에서 ${shadowCm.toFixed(1)} cm</text>
        </g>`;

        graphGroup.innerHTML = out;
    }

    function renderData(distance, m) {
        const shadowCm = CARD_HEIGHT_CM * magnification(distance);
        const gap = SCREEN_DIST_CM - distance;
        const ratio = m / magnification(REFERENCE_CM);
        const same = Math.abs(ratio - 1) < 1e-9;
        dataNote.innerHTML =
            `<div class="data-row"><span class="data-name">광원에서 물체까지</span><span class="data-val">${distance} cm</span></div>` +
            `<div class="data-row"><span class="data-name">물체에서 스크린까지</span><span class="data-val">${gap.toFixed(0)} cm</span></div>` +
            `<div class="data-row"><span class="data-name">광원에서 스크린까지</span><span class="data-val">${SCREEN_DIST_CM.toFixed(0)} cm</span></div>` +
            `<div class="data-row"><span class="data-name">물체의 높이</span><span class="data-val">${CARD_HEIGHT_CM.toFixed(0)} cm</span></div>` +
            `<div class="data-row"><span class="data-name">몇 배로 커지나</span><span class="data-val">${SCREEN_DIST_CM.toFixed(0)} ÷ ${distance} = ${m.toFixed(2)}배</span></div>` +
            // 반올림한 배율을 다시 곱해 보이면 아이가 검산할 때 값이 어긋납니다.
            // 나누기를 그대로 남겨 두면 손으로 따라가도 딱 맞습니다.
            `<div class="data-row"><span class="data-name">그림자 높이</span><span class="data-val">${CARD_HEIGHT_CM.toFixed(0)} × ${SCREEN_DIST_CM.toFixed(0)} ÷ ${distance} = ${shadowCm.toFixed(1)} cm</span></div>` +
            `<div class="data-row${same ? ' match' : ''}"><span class="data-name">기준 ${REFERENCE_CM} cm와 견주면</span><span class="data-val">${ratio.toFixed(2)}배</span></div>`;
    }

    function clearResult() {
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        stageCaption.textContent = '거리를 정하고 그림자 크기를 확인해 보세요.';
    }

    function checkShadow() {
        const distance = Number(distanceRange.value);
        const m = magnification(distance);
        const shadowCm = CARD_HEIGHT_CM * m;
        const ratio = m / magnification(REFERENCE_CM);

        resultShadow.textContent = `${shadowCm.toFixed(1)} cm`;
        resultRatio.textContent = `${ratio.toFixed(2)}배`;
        resultEmpty.hidden = true;
        resultContent.hidden = false;

        const actual = distance < REFERENCE_CM ? 'bigger' : distance > REFERENCE_CM ? 'smaller' : 'same';
        predictionResult.textContent = !prediction
            ? '다음에는 결과를 먼저 예상해 보세요.'
            : prediction === actual ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';

        stageCaption.textContent = `광원에서 ${distance} cm 떨어졌을 때 그림자 높이는 약 ${shadowCm.toFixed(1)} cm입니다.`;
        if (actual === 'bigger') {
            explanation.textContent = `물체가 기준(${REFERENCE_CM} cm)보다 광원에 가까우면 퍼져 나가는 빛을 더 넓게 가로막게 되어 그림자가 커집니다.`;
        } else if (actual === 'smaller') {
            explanation.textContent = `물체가 기준(${REFERENCE_CM} cm)보다 광원에서 멀면 빛을 가로막는 범위가 좁아져 그림자가 작아집니다.`;
        } else {
            explanation.textContent = `기준 거리와 같으므로 그림자 크기도 기준과 같습니다. 물체를 광원 쪽으로 옮기면 커지고, 스크린 쪽으로 옮기면 작아집니다.`;
        }
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
    distanceRange.addEventListener('input', () => { renderScene(); clearResult(); });
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
