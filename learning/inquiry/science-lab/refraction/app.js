document.addEventListener('DOMContentLoaded', () => {
    const mediumButtons = [...document.querySelectorAll('[data-medium]')];
    const dirButtons = [...document.querySelectorAll('[data-dir]')];
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const angleRange = document.getElementById('angleRange');
    const angleOutput = document.getElementById('angleOutput');
    const checkBtn = document.getElementById('checkBtn');
    const resultEmpty = document.getElementById('resultEmpty');
    const resultContent = document.getElementById('resultContent');
    const resultReflect = document.getElementById('resultReflect');
    const resultRefract = document.getElementById('resultRefract');
    const predictionResult = document.getElementById('predictionResult');
    const explanation = document.getElementById('elementaryExplanation');
    const stageCaption = document.getElementById('stageCaption');
    const stageBadge = document.getElementById('stageBadge');
    const criticalNote = document.getElementById('criticalNote');
    const rayGroup = document.getElementById('rayGroup');
    const arcGroup = document.getElementById('arcGroup');
    const mediumZone = document.getElementById('mediumZone');
    const mediumLabel = document.getElementById('mediumLabel');

    const MEDIA = {
        water:   { name: '물',         n: 1.33, fill: 'rgba(110,200,235,.16)' },
        glass:   { name: '유리',       n: 1.50, fill: 'rgba(180,210,235,.20)' },
        diamond: { name: '다이아몬드', n: 2.42, fill: 'rgba(200,220,255,.26)' },
    };
    const N_AIR = 1.00;

    const P = { x: 230, y: 180 };     // where the ray meets the boundary
    const L = 130;                    // drawn ray length
    const ARC_R = 36;

    let medium = 'water';
    let dir = 'in';                   // 'in' = air → medium, 'out' = medium → air
    let prediction = null;

    const rad = d => (d * Math.PI) / 180;
    const deg = r => (r * 180) / Math.PI;

    // Ray endpoints run to the edge of the drawing, so a label hung off one
    // can fall outside the canvas — at 0° incidence the refracted ray points
    // straight down and its caption landed below the bottom edge. These keep
    // every caption on screen without moving the rays themselves.
    const LABEL_W = 58;
    const clampLabelX = x => Math.max(6, Math.min(460 - LABEL_W, x));
    const clampLabelY = y => Math.max(16, Math.min(312, y));

    // Snell's law. n1 is whichever medium the light starts in, so flipping the
    // direction swaps them — and only the dense-to-rare case can go total.
    function solve() {
        const theta1 = Number(angleRange.value);
        const nMed = MEDIA[medium].n;
        const n1 = dir === 'in' ? N_AIR : nMed;
        const n2 = dir === 'in' ? nMed : N_AIR;
        const sinT2 = (n1 * Math.sin(rad(theta1))) / n2;
        const total = sinT2 > 1;                       // no real refracted ray
        const theta2 = total ? null : deg(Math.asin(sinT2));
        const critical = n1 > n2 ? deg(Math.asin(n2 / n1)) : null;
        return { theta1, theta2, reflect: theta1, n1, n2, total, critical };
    }

    function arcPath(startDeg, endDeg, sgn, side) {
        // sweep an arc around the hit point between the normal and a ray
        const pts = [];
        const steps = 18;
        for (let i = 0; i <= steps; i += 1) {
            const a = rad(startDeg + ((endDeg - startDeg) * i) / steps);
            pts.push([
                (P.x + side * ARC_R * Math.sin(a)).toFixed(2),
                (P.y + sgn * ARC_R * Math.cos(a)).toFixed(2),
            ]);
        }
        return `M${pts.map(p => p.join(',')).join('L')}`;
    }

    function render() {
        angleRange.max = dir === 'out' ? '40' : '85';
        if (+angleRange.value > +angleRange.max) angleRange.value = angleRange.max;
        const s = solve();
        const m = MEDIA[medium];
        // The medium always occupies the lower half; only where the light
        // starts changes, so "incoming" points up or down accordingly.
        const inSgn = dir === 'in' ? -1 : 1;   // side the incident ray comes from
        const outSgn = -inSgn;                 // side the refracted ray leaves to

        mediumZone.setAttribute('fill', m.fill);
        mediumLabel.textContent = m.name;
        angleOutput.textContent = `${s.theta1}°`;
        stageBadge.textContent = dir === 'in' ? `공기 → ${m.name}` : `${m.name} → 공기`;

        const sinI = Math.sin(rad(s.theta1)), cosI = Math.cos(rad(s.theta1));
        const start = { x: P.x - L * sinI, y: P.y + inSgn * L * cosI };
        const refl = { x: P.x + L * sinI, y: P.y + inSgn * L * cosI };

        let out = '';
        // incident ray, drawn from its origin toward the boundary
        out += `<path class="ray incident" d="M${start.x.toFixed(1)},${start.y.toFixed(1)} L${P.x},${P.y}"/>`;
        /* Near normal incidence the incident and reflected rays lie almost on
           top of each other — that is the physics, not a drawing fault — so the
           two labels are pushed to opposite sides of the ray instead of being
           left to print over one another. */
        const nearNormal = Math.abs(refl.x - start.x) < LABEL_W + 20;
        const incX = nearNormal ? start.x - LABEL_W - 10 : start.x - 4;
        const reflX = nearNormal ? refl.x + 10 : refl.x - 26;
        out += `<text class="ray-label incident" x="${clampLabelX(incX).toFixed(1)}" y="${clampLabelY(start.y + (inSgn < 0 ? -6 : 14)).toFixed(1)}">입사 광선</text>`;
        // reflected ray, drawn away from the boundary on the same side
        out += `<path class="ray reflected" d="M${P.x},${P.y} L${refl.x.toFixed(1)},${refl.y.toFixed(1)}"/>`;
        out += `<text class="ray-label reflected" x="${clampLabelX(reflX).toFixed(1)}" y="${clampLabelY(refl.y + (inSgn < 0 ? -6 : 14)).toFixed(1)}">반사 광선</text>`;

        if (!s.total) {
            const sinT = Math.sin(rad(s.theta2)), cosT = Math.cos(rad(s.theta2));
            const refr = { x: P.x + L * sinT, y: P.y + outSgn * L * cosT };
            out += `<path class="ray refracted" d="M${P.x},${P.y} L${refr.x.toFixed(1)},${refr.y.toFixed(1)}"/>`;
            out += `<text class="ray-label refracted" x="${clampLabelX(refr.x - 20).toFixed(1)}" y="${clampLabelY(refr.y + (outSgn < 0 ? -6 : 16)).toFixed(1)}">굴절 광선</text>`;
        }
        rayGroup.innerHTML = out;

        // angle arcs, measured from the normal
        let arcs = '';
        arcs += `<path class="angle-arc incident" d="${arcPath(0, s.theta1, inSgn, -1)}"/>`;
        arcs += `<text class="angle-text" fill="#b45309" x="${(P.x - ARC_R * Math.sin(rad(s.theta1 / 2)) - 30).toFixed(1)}" y="${(P.y + inSgn * (ARC_R + 8) * Math.cos(rad(s.theta1 / 2))).toFixed(1)}">${s.theta1}°</text>`;
        arcs += `<path class="angle-arc reflected" d="${arcPath(0, s.theta1, inSgn, 1)}"/>`;
        if (!s.total) {
            arcs += `<path class="angle-arc refracted" d="${arcPath(0, s.theta2, outSgn, 1)}"/>`;
        }
        arcGroup.innerHTML = arcs;

        criticalNote.textContent = '입사각과 반사각은 법선을 기준으로 비교합니다.';
    }

    function clearResult() { resultEmpty.hidden = false; resultContent.hidden = true; }

    function check() {
        const s = solve();
        const m = MEDIA[medium];
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        resultReflect.textContent = `${s.reflect}°`;
        resultRefract.textContent = s.theta1 === 0 ? '꺾이지 않음' : dir === 'in' ? '법선 쪽' : '법선에서 멀어짐';

        const actual = s.theta1 === 0 ? 'same' : dir === 'in' ? 'smaller' : 'larger';
        predictionResult.textContent = !prediction
            ? '다음에는 결과를 먼저 예상해 보세요.'
            : prediction === actual ? '예상이 맞았습니다.'
            : (s.theta1 === 0 ? '입사각이 0°이면 꺾이지 않고 그대로 지나갑니다.' : '예상과 다른 결과입니다.');

        if (s.theta1 === 0) {
            stageCaption.textContent = '수직으로 입사하면 꺾이지 않고 나아갑니다.';
        } else {
            stageCaption.textContent = dir === 'in' ? '공기에서 물질로 들어가며 법선 쪽으로 꺾입니다.' : '물질에서 공기로 나가며 법선에서 멀어집니다.';
        }
        explanation.textContent = '반사각은 입사각과 같습니다. 굴절은 서로 다른 물질의 경계에서 빛의 진행 방향이 달라지는 현상입니다.';
    }

    mediumButtons.forEach(button => button.addEventListener('click', () => {
        medium = button.dataset.medium;
        mediumButtons.forEach(item => item.classList.toggle('selected', item === button));
        render(); clearResult();
    }));
    dirButtons.forEach(button => button.addEventListener('click', () => {
        dir = button.dataset.dir;
        dirButtons.forEach(item => item.classList.toggle('selected', item === button));
        render(); clearResult();
    }));
    angleRange.addEventListener('input', () => { render(); clearResult(); });
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction;
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    checkBtn.addEventListener('click', check);

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

    window.__rayModel = {
        MEDIA, N_AIR, P, L, solve,
        setAngle(a) { angleRange.value = String(a); render(); },
        setMedium(m) { document.querySelector(`[data-medium="${m}"]`).click(); },
        setDir(d) { document.querySelector(`[data-dir="${d}"]`).click(); },
    };

    render();
    clearResult();
});
