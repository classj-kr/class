document.addEventListener('DOMContentLoaded', () => {
    const dayRange = document.getElementById('dayRange');
    const dayOutput = document.getElementById('dayOutput');
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const checkButton = document.getElementById('checkBtn');
    const resultEmpty = document.getElementById('resultEmpty');
    const resultContent = document.getElementById('resultContent');
    const resultName = document.getElementById('resultName');
    const resultLit = document.getElementById('resultLit');
    const predictionResult = document.getElementById('predictionResult');
    const explanation = document.getElementById('elementaryExplanation');
    const stageCaption = document.getElementById('stageCaption');
    const phaseBadge = document.getElementById('phaseBadge');
    const sunRays = document.getElementById('sunRays');
    const moonMarker = document.getElementById('moonMarker');
    const moonLitHalf = document.getElementById('moonLitHalf');
    const sightLine = document.getElementById('sightLine');
    const phaseLit = document.getElementById('phaseLit');

    const SYNODIC = 29.53;           // days from one new moon to the next
    const EARTH = { x: 286, y: 150 };
    const ORBIT_R = 96;
    const MOON_R = 15;
    const PHASE_C = { x: 90, y: 90 };
    const PHASE_R = 62;
    const SAMPLES = 90;

    let prediction = null;

    const dayValue = () => Number(dayRange.value) / 10;
    // Elongation: the Sun-Earth-Moon angle, 0° at new moon and 180° at full.
    const elongationDeg = day => (360 * day / SYNODIC) % 360;
    // The standard illuminated fraction. Everything drawn below has to agree
    // with this number rather than merely look plausible.
    const litFraction = E => (1 - Math.cos(E * Math.PI / 180)) / 2;

    function phaseName(E) {
        if (E < 22.5 || E >= 337.5) return '삭';
        if (E < 67.5) return '초승달';
        if (E < 112.5) return '상현달';
        if (E < 157.5) return '배부른 달';
        if (E < 202.5) return '보름달';
        if (E < 247.5) return '배부른 달';
        if (E < 292.5) return '하현달';
        return '그믐달';
    }

    // The lit region is bounded by the limb on one side and the terminator on
    // the other. The terminator is the projection of the day/night circle, an
    // ellipse whose semi-axis is R·cos(E) — so at E=0 it sits exactly on the
    // limb (nothing lit), at 90° it is a straight line (half lit) and at 180°
    // it reaches the far limb (fully lit). Sampling both curves gives the
    // exact shape without relying on arc-flag guesswork.
    function litPath(E, cx, cy, R) {
        const waxing = E <= 180;
        const Eprime = waxing ? E : 360 - E;
        const c = Math.cos(Eprime * Math.PI / 180);
        const side = waxing ? 1 : -1;
        const pts = [];
        for (let i = 0; i <= SAMPLES; i += 1) {           // limb, top to bottom
            const y = -R + (2 * R * i) / SAMPLES;
            pts.push([cx + side * Math.sqrt(Math.max(0, R * R - y * y)), cy + y]);
        }
        for (let i = SAMPLES; i >= 0; i -= 1) {           // terminator, back up
            const y = -R + (2 * R * i) / SAMPLES;
            pts.push([cx + side * c * Math.sqrt(Math.max(0, R * R - y * y)), cy + y]);
        }
        return `M${pts.map(p => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join('L')}Z`;
    }

    // The half of the Moon facing the Sun. The Sun is drawn far to the left
    // with parallel rays, so that is always the -x half whatever the Moon's
    // orbital position — which is precisely why the phase changes.
    function sunlitHalfPath(r) {
        const pts = [];
        for (let i = 0; i <= SAMPLES; i += 1) {
            const a = (90 + (180 * i) / SAMPLES) * Math.PI / 180;
            pts.push([r * Math.cos(a), r * Math.sin(a)]);
        }
        return `M${pts.map(p => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join('L')}Z`;
    }

    function buildRays() {
        let out = '';
        for (const y of [66, 108, 150, 192, 234]) {
            out += `<line class="sun-ray" x1="70" y1="${y}" x2="168" y2="${y}"/>`;
            out += `<polygon class="sun-ray-head" points="168,${y - 4} 176,${y} 168,${y + 4}" fill="rgba(251, 191, 36, .85)"/>`;
        }
        sunRays.innerHTML = out;
    }

    function render() {
        const day = dayValue();
        const E = elongationDeg(day);
        const k = litFraction(E);

        dayOutput.textContent = `약 ${day.toFixed(1)}일`;
        phaseBadge.textContent = phaseName(E);

        // Orbital position: at E=0 the Moon sits between Earth and Sun, at
        // E=180 it is on the far side. The Sun lies toward -x, so measuring
        // the orbital angle from that direction keeps the diagram honest.
        const alpha = (180 - E) * Math.PI / 180;
        const mx = EARTH.x + ORBIT_R * Math.cos(alpha);
        const my = EARTH.y + ORBIT_R * Math.sin(alpha);
        moonMarker.setAttribute('transform', `translate(${mx.toFixed(2)} ${my.toFixed(2)})`);
        moonLitHalf.setAttribute('d', sunlitHalfPath(MOON_R));
        sightLine.setAttribute('x2', mx.toFixed(2));
        sightLine.setAttribute('y2', my.toFixed(2));

        phaseLit.setAttribute('d', litPath(E, PHASE_C.x, PHASE_C.y, PHASE_R));
    }

    function clearResult() {
        resultEmpty.hidden = false;
        resultContent.hidden = true;
    }

    function check() {
        const day = dayValue();
        const E = elongationDeg(day);
        const k = litFraction(E);
        const waxing = E <= 180;

        resultName.textContent = phaseName(E);
        resultLit.textContent = `${Math.round(k * 100)}%`;
        resultEmpty.hidden = true;
        resultContent.hidden = false;

        const actual = k >= 0.9 ? 'full' : waxing ? 'right' : 'left';
        if (k < 0.06) {
            predictionResult.textContent = '삭 무렵에는 밝은 부분이 거의 없어 달이 잘 보이지 않습니다.';
        } else {
            predictionResult.textContent = !prediction
                ? '다음에는 결과를 먼저 예상해 보세요.'
                : prediction === actual ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        }

        stageCaption.textContent = `음력 약 ${day.toFixed(1)}일, ${phaseName(E)}입니다. 밝게 보이는 부분은 약 ${Math.round(k * 100)}%입니다.`;
        if (k < 0.06) {
            explanation.textContent = '달이 태양과 같은 쪽에 있어 햇빛 받는 면이 지구 반대쪽을 향합니다. 그래서 거의 보이지 않습니다.';
        } else if (k >= 0.9) {
            explanation.textContent = '달이 태양의 반대쪽에 있어 햇빛 받는 면 전체가 지구를 향합니다. 그래서 둥근 보름달로 보입니다.';
        } else if (waxing) {
            explanation.textContent = '달이 점점 차오르는 때로, 오른쪽부터 밝아집니다. 달의 절반은 늘 햇빛을 받고 있지만 지구에서는 그 일부만 보입니다.';
        } else {
            explanation.textContent = '달이 점점 이지러지는 때로, 왼쪽이 밝게 남습니다. 달의 절반은 늘 햇빛을 받고 있지만 지구에서는 그 일부만 보입니다.';
        }
    }

    dayRange.addEventListener('input', () => { render(); clearResult(); });
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    checkButton.addEventListener('click', check);

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

    window.__moonModel = {
        SYNODIC, EARTH, ORBIT_R, MOON_R, PHASE_C, PHASE_R,
        elongationDeg, litFraction, phaseName, litPath, sunlitHalfPath,
        setDay(d) { dayRange.value = String(Math.round(d * 10)); render(); },
        day: dayValue,
    };

    buildRays();
    render();
    clearResult();
});
