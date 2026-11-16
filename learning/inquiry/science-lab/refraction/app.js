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

    // 빛은 [각도 확인하기]를 눌렀을 때 레이저에서 나와 경계까지 간 뒤 반사·굴절한다.
    let shown = false, beam = 1, beamFrame = 0;
    const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lerp = (a, b, k) => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k });

    // 레이저 포인터: 광선 방향을 따라 놓인 원통 몸체와 단추, 빛이 나오는 구멍.
    function laser(start, ux, uy) {
        const len = 40, w = 12, ang = deg(Math.atan2(uy, ux));
        return `<g class="laser" transform="translate(${start.x.toFixed(1)},${start.y.toFixed(1)}) rotate(${ang.toFixed(1)})">` +
            `<rect class="laser-body" x="${-len}" y="${-w / 2}" width="${len}" height="${w}" rx="3"/>` +
            `<rect class="laser-tip" x="-7" y="${-w / 2 - 1}" width="7" height="${w + 2}" rx="1.5"/>` +
            `<rect class="laser-button" x="${-len + 12}" y="${-w / 2 - 3}" width="9" height="3.5" rx="1.2"/>` +
            `<circle class="laser-aperture" cx="0" cy="0" r="2.2"/></g>`;
    }

    function labelAt(a, b, text, cls, away, at = 0.7) {
        // 광선 위 한 자리에서 광선과 수직 방향으로 비켜 이름을 단다(법선·경계에서 먼 쪽).
        const p = lerp(a, b, at), len = Math.hypot(b.x - a.x, b.y - a.y) || 1, dx = (b.x - a.x) / len, dy = (b.y - a.y) / len;
        let nx = -dy, ny = dx;
        if (Math.abs(dx) > Math.abs(dy) ? ny * (p.y - P.y) < 0 : nx * away < 0) { nx = -nx; ny = -ny; }
        const x = p.x + nx * 16, y = p.y + ny * 16 + 4.5;
        const anchor = nx > 0.35 ? 'start' : nx < -0.35 ? 'end' : 'middle';
        return `<text class="ray-label ${cls}" x="${Math.max(6, Math.min(454, x)).toFixed(1)}" y="${clampLabelY(y).toFixed(1)}" text-anchor="${anchor}">${text}</text>`;
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
        // 확인 전에는 빛이 어디서 어디로 가는지만 말하고, 꺾이는 쪽(답)은 말하지 않는다.
        stageCaption.textContent = !shown ? (s.theta1 === 0 ? `빛이 경계에 수직으로 들어갑니다. 나아가는 방향이 어떻게 될지 예상한 뒤 [각도 확인하기]를 눌러 보세요.`
            : `${dir === 'in' ? `공기에서 ${m.name}로 들어가는` : `${m.name}에서 공기로 나가는`} 빛입니다. 굴절각이 입사각보다 클지 작을지 예상한 뒤 [각도 확인하기]를 눌러 보세요.`)
            : s.total ? '전반사가 일어나 굴절 광선은 나오지 않습니다.' : s.theta1 === 0
            ? '수직으로 입사하면 꺾이지 않고 나아갑니다.'
            : dir === 'in' ? `공기에서 ${m.name}로 들어가며 법선 쪽으로 꺾입니다.` : `${m.name}에서 공기로 나가며 법선에서 멀어집니다.`;

        const sinI = Math.sin(rad(s.theta1)), cosI = Math.cos(rad(s.theta1));
        const LIN = dir === 'in' ? 104 : 94;
        const start = { x: P.x - LIN * sinI, y: P.y + inSgn * LIN * cosI };
        const refl = { x: P.x + L * sinI, y: P.y + inSgn * L * cosI };
        const k2 = beam;

        let out = laser(start, (P.x - start.x) / LIN, (P.y - start.y) / LIN);
        // 레이저에서 경계까지 가는 입사 광선은 처음부터 흐르고(주어진 조건),
        // 반사·굴절 광선은 [각도 확인하기]를 누르면 경계에서 뻗어 나간다.
        out += `<path class="ray incident" d="M${start.x.toFixed(1)},${start.y.toFixed(1)} L${P.x},${P.y}"/>`;
        out += labelAt(start, P, '입사 광선', 'incident', -1, 0.3);
        if (shown) {
            if (k2 > 0) {
                const rEnd = lerp(P, refl, k2);
                out += `<path class="ray reflected" d="M${P.x},${P.y} L${rEnd.x.toFixed(1)},${rEnd.y.toFixed(1)}"/>`;
                if (k2 < 1) out += `<circle class="beam-front" cx="${rEnd.x.toFixed(1)}" cy="${rEnd.y.toFixed(1)}" r="3"/>`;
                if (k2 >= 1) out += labelAt(P, refl, '반사 광선', 'reflected', 1);
                if (!s.total) {
                    const sinT = Math.sin(rad(s.theta2)), cosT = Math.cos(rad(s.theta2));
                    const refr = { x: P.x + L * sinT, y: P.y + outSgn * L * cosT };
                    const fEnd = lerp(P, refr, k2);
                    out += `<path class="ray refracted" d="M${P.x},${P.y} L${fEnd.x.toFixed(1)},${fEnd.y.toFixed(1)}"/>`;
                    if (k2 < 1) out += `<circle class="beam-front" cx="${fEnd.x.toFixed(1)}" cy="${fEnd.y.toFixed(1)}" r="3"/>`;
                    if (k2 >= 1) out += labelAt(P, refr, '굴절 광선', 'refracted', 1);
                }
            }
        }
        rayGroup.innerHTML = out;

        // angle arcs, measured from the normal; the label sits off the ray
        let arcs = '';
        arcs += `<path class="angle-arc incident" d="${arcPath(0, s.theta1, inSgn, -1)}"/>`;
        const la = s.theta1 >= 26 ? s.theta1 / 2 : s.theta1 + 16, lr = ARC_R + (s.theta1 >= 26 ? 17 : 13);
        arcs += `<text class="angle-text" fill="#b45309" x="${(P.x - lr * Math.sin(rad(la))).toFixed(1)}" y="${(P.y + inSgn * lr * Math.cos(rad(la)) + 4.5).toFixed(1)}" text-anchor="middle">${s.theta1}°</text>`;
        if (shown && k2 >= 1) {
            arcs += `<path class="angle-arc reflected" d="${arcPath(0, s.theta1, inSgn, 1)}"/>`;
            if (!s.total) arcs += `<path class="angle-arc refracted" d="${arcPath(0, s.theta2, outSgn, 1)}"/>`;
        }
        arcGroup.innerHTML = arcs;

        criticalNote.textContent = '입사각과 반사각은 법선을 기준으로 비교합니다.';
    }

    function shine() {
        cancelAnimationFrame(beamFrame);
        shown = true;
        if (reduceMotion()) { beam = 1; render(); return; }
        beam = 0;
        const t0 = performance.now();
        const step = now => { beam = Math.min(1, (now - t0) / 1100); render(); if (beam < 1) beamFrame = requestAnimationFrame(step); };
        render();
        beamFrame = requestAnimationFrame(step);
    }

    function clearResult() { resultEmpty.hidden = false; resultContent.hidden = true; if (shown) { cancelAnimationFrame(beamFrame); shown = false; beam = 1; render(); } }

    function check() {
        shine();
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
        prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
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
