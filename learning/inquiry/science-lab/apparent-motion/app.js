document.addEventListener('DOMContentLoaded', () => {
    const hourRange = document.getElementById('hourRange');
    const dayRange = document.getElementById('dayRange');
    const hourOutput = document.getElementById('hourOutput');
    const dayOutput = document.getElementById('dayOutput');
    const moonBtn = document.getElementById('moonBtn');
    const playBtn = document.getElementById('playBtn');
    const resetBtn = document.getElementById('resetBtn');
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const resultEmpty = document.getElementById('resultEmpty');
    const resultContent = document.getElementById('resultContent');
    const resultAngle = document.getElementById('resultAngle');
    const resultMoon = document.getElementById('resultMoon');
    const predictionResult = document.getElementById('predictionResult');
    const explanation = document.getElementById('elementaryExplanation');
    const stageCaption = document.getElementById('stageCaption');
    const stageBadge = document.getElementById('stageBadge');
    const skyGroup = document.getElementById('skyGroup');
    const moonGroup = document.getElementById('moonGroup');
    const trailGroup = document.getElementById('trailGroup');
    const rateNote = document.getElementById('rateNote');

    const POLARIS = { x: 230, y: 160 };

    // Earth turns once in 24 h, so the sky appears to turn 15° every hour.
    const DIURNAL_PER_HOUR = 360 / 24;              // 15 °/h
    // Earth's orbit shifts the same clock time against the stars by a full
    // turn per year — about 1° a day, 30° a month.
    const ANNUAL_PER_DAY = 360 / 365.25;            // ≈ 0.986 °/day
    // The Moon laps the star background once per sidereal month, drifting
    // eastward against the stars.
    const MOON_SIDEREAL_PER_DAY = 360 / 27.32;      // ≈ 13.2 °/day
    // Moonrise is read off a solar clock, so the delay follows the Moon's
    // motion relative to the Sun (synodic month), not to the stars.
    const MOON_SYNODIC_PER_DAY = 360 / 29.53;       // ≈ 12.2 °/day
    const MOONRISE_DELAY_MIN = (MOON_SYNODIC_PER_DAY / DIURNAL_PER_HOUR) * 60;  // ≈ 49 min

    const BASE_HOUR = 21;                           // observations start at 9 pm

    // Schematic positions, in degrees around Polaris and pixels from it.
    // Both groups are circumpolar and sit roughly opposite each other, which
    // is true of the real sky.
    const BIG_DIPPER = [
        { a: 196, r: 74 }, { a: 206, r: 66 }, { a: 216, r: 70 }, { a: 222, r: 80 },
        { a: 232, r: 90 }, { a: 242, r: 98 }, { a: 252, r: 104 },
    ];
    const CASSIOPEIA = [
        { a: 16, r: 88 }, { a: 26, r: 76 }, { a: 36, r: 86 }, { a: 46, r: 74 }, { a: 56, r: 86 },
    ];
    const MOON_R = 116;
    const MOON_BASE_A = 130;

    let showMoon = false;
    let playing = false;
    let prediction = null;
    let rafId = null, lastT = null;

    // While the animation runs, time is tracked here as a float. A range input
    // snaps its value to the step (0.5 h), which would turn a smooth sweep into
    // 7.5° jumps, so the slider is only ever a readout during playback.
    let animHours = null;
    const hours = () => (animHours === null ? Number(hourRange.value) : animHours);
    const days = () => Number(dayRange.value);

    const polar = (aDeg, r) => ({
        x: POLARIS.x + r * Math.sin((aDeg * Math.PI) / 180),
        y: POLARIS.y - r * Math.cos((aDeg * Math.PI) / 180),
    });

    // How far the star sphere has turned since the reference observation.
    const starRotation = () => DIURNAL_PER_HOUR * hours() + ANNUAL_PER_DAY * days();

    // Moonrise slips ~49 minutes later every day, but a rise time is a clock
    // time, so the shift wraps once it passes a full day. Reporting the raw
    // running total gives numbers like "1463분 늦게", which is arithmetically
    // right but unreadable — and it hides the real point, that after roughly
    // one synodic month the Moon is back to rising at nearly the same time.
    function moonriseLabel(d) {
        if (d === 0) return '기준';
        const totalMin = MOONRISE_DELAY_MIN * d;
        const wrapped = ((totalMin % 1440) + 1440) % 1440;
        const h = Math.floor(wrapped / 60);
        const m = Math.round(wrapped - h * 60);
        return h === 0 ? `약 ${m}분 늦게` : `약 ${h}시간 ${m}분 늦게`;
    }

    function clockLabel(h) {
        const t = (BASE_HOUR + h) % 24;
        const hh = Math.floor(t);
        const mm = Math.round((t - hh) * 60);
        const ampm = hh < 12 ? '오전' : '오후';
        const disp = hh % 12 === 0 ? 12 : hh % 12;
        return `${ampm} ${disp}시${mm ? ` ${mm}분` : ''}`;
    }

    function buildSky() {
        const drawGroup = (stars, name, labelIdx) => {
            const pts = stars.map(s => polar(s.a, s.r));
            let out = `<path class="const-line" d="M${pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('L')}"/>`;
            pts.forEach((p, i) => {
                out += `<circle class="star${i === 0 || i === pts.length - 1 ? ' star-bright' : ''}" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${i === 0 || i === pts.length - 1 ? 3.4 : 2.6}"/>`;
            });
            const lp = pts[labelIdx];
            out += `<text class="const-name" x="${(lp.x - 18).toFixed(1)}" y="${(lp.y - 10).toFixed(1)}">${name}</text>`;
            return out;
        };
        skyGroup.innerHTML = drawGroup(BIG_DIPPER, '북두칠성', 6) + drawGroup(CASSIOPEIA, '카시오페이아', 2);

        // the circle each group sweeps out as the sky turns
        const radii = [...new Set([
            Math.round(BIG_DIPPER.reduce((s, v) => s + v.r, 0) / BIG_DIPPER.length),
            Math.round(CASSIOPEIA.reduce((s, v) => s + v.r, 0) / CASSIOPEIA.length),
        ])];
        trailGroup.innerHTML = radii.map(r =>
            `<circle class="trail" cx="${POLARIS.x}" cy="${POLARIS.y}" r="${r}"/>`).join('');
    }

    function render() {
        const rot = starRotation();
        // The sky turns anticlockwise on this view, so the SVG angle is negative.
        skyGroup.setAttribute('transform', `rotate(${(-rot).toFixed(3)} ${POLARIS.x} ${POLARIS.y})`);

        if (showMoon) {
            // The Moon rides the same daily turn but slips eastward against the
            // stars, so it falls behind them a little more each day.
            const moonRot = -rot + MOON_SIDEREAL_PER_DAY * days();
            const p = polar(MOON_BASE_A + moonRot, MOON_R);
            const starRef = polar(MOON_BASE_A - rot, MOON_R);
            moonGroup.innerHTML =
                `<path class="moon-gap" d="M${starRef.x.toFixed(1)},${starRef.y.toFixed(1)} A${MOON_R},${MOON_R} 0 0 1 ${p.x.toFixed(1)},${p.y.toFixed(1)}"/>` +
                `<circle class="moon-body" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="9"/>` +
                `<text class="moon-label" x="${(p.x - 8).toFixed(1)}" y="${(p.y + 24).toFixed(1)}">달</text>`;
        } else {
            moonGroup.innerHTML = '';
        }

        hourOutput.textContent = `${hours() % 1 === 0 ? hours() : hours().toFixed(1)}시간 뒤`;
        dayOutput.textContent = `${days()}일 뒤`;
        stageBadge.textContent = `${clockLabel(hours())}${days() ? ` · ${days()}일 뒤` : ''}`;

        rateNote.innerHTML =
            `<div class="rate-row"><span class="rate-name">일주운동</span><span class="rate-value">시간당 ${DIURNAL_PER_HOUR}° — 지금까지 ${(DIURNAL_PER_HOUR * hours()).toFixed(1)}°</span></div>` +
            `<div class="rate-row"><span class="rate-name">연주운동</span><span class="rate-value">하루 약 ${ANNUAL_PER_DAY.toFixed(2)}° — 지금까지 ${(ANNUAL_PER_DAY * days()).toFixed(1)}°</span></div>` +
            `<div class="rate-row"><span class="rate-name">달의 이동</span><span class="rate-value">별 기준 하루 약 ${MOON_SIDEREAL_PER_DAY.toFixed(1)}° 동쪽 — 지금까지 ${(MOON_SIDEREAL_PER_DAY * days()).toFixed(1)}°</span></div>`;

        resultAngle.textContent = `${(starRotation() % 360).toFixed(1)}°`;
        resultMoon.textContent = moonriseLabel(days());
        if (!resultContent.hidden) showResult();
    }

    function showResult() {
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        predictionResult.textContent = !prediction
            ? '다음에는 결과를 먼저 예상해 보세요.'
            : prediction === 'ccw' ? '예상이 맞았습니다.' : '예상과 다른 결과입니다. 북쪽 하늘에서는 시계 반대 방향으로 돕니다.';
        const h = hours(), d = days();
        let s = `지구가 서에서 동으로 자전하기 때문에, 북쪽 하늘의 별은 북극성을 중심으로 시계 반대 방향으로 1시간에 ${DIURNAL_PER_HOUR}°씩 돕니다.`;
        if (h > 0) s += ` ${h}시간 동안 ${(DIURNAL_PER_HOUR * h).toFixed(0)}° 돌았습니다.`;
        if (d > 0) s += ` 또 지구의 공전 때문에 같은 시각에 보아도 하루에 약 1°씩 옮겨 가, ${d}일 뒤에는 ${(ANNUAL_PER_DAY * d).toFixed(0)}° 더 돌아 있습니다.`;
        if (showMoon && d > 0) {
            s += ` 달은 별을 기준으로 하루 약 ${MOON_SIDEREAL_PER_DAY.toFixed(1)}°씩 동쪽으로 밀려나, 뜨는 시각이 매일 약 ${Math.round(MOONRISE_DELAY_MIN)}분씩 늦어집니다.`;
            if (d >= 29) s += ` 약 29.5일이면 이 늦어짐이 하루를 꽉 채워, 달은 다시 처음과 비슷한 시각에 뜹니다.`;
        }
        explanation.textContent = s;
    }

    function frame(now) {
        const t = now / 1000;
        const dt = lastT === null ? 1 / 60 : Math.min(1 / 20, t - lastT);
        lastT = t;
        if (playing) {
            // one displayed hour per second of real time, wrapping after 12
            animHours = (animHours + dt) % 12;
            hourRange.value = String(Math.round(animHours * 2) / 2);   // slider follows loosely
            render();
            rafId = requestAnimationFrame(frame);
        } else { rafId = null; lastT = null; }
    }

    function stopPlayback() {
        playing = false;
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = null; lastT = null; animHours = null;
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
            animHours = Number(hourRange.value);      // pick up where the slider left off
            showResult();
            stageCaption.textContent = '별이 북극성을 중심으로 시계 반대 방향으로 돌고 있습니다.';
            if (rafId === null) { lastT = null; rafId = requestAnimationFrame(frame); }
        } else {
            // hand control back to the slider at the nearest step
            hourRange.value = String(Math.round(hours() * 2) / 2);
            animHours = null;
            render();
            stageCaption.textContent = '시간을 멈추었습니다. 별의 위치를 살펴보세요.';
        }
    });

    resetBtn.addEventListener('click', () => {
        playing = false;
        playBtn.textContent = '시간 흘려보내기';
        if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; lastT = null; }
        animHours = null;
        hourRange.value = '0';
        dayRange.value = '0';
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        stageCaption.textContent = '별은 북극성을 중심으로 원을 그리며 돕니다.';
        render();
    });

    [hourRange, dayRange].forEach(el => el.addEventListener('input', () => {
        animHours = null;                            // dragging takes over from playback
        render();
        if (!resultContent.hidden) showResult();
    }));
    moonBtn.addEventListener('click', () => {
        showMoon = !showMoon;
        moonBtn.classList.toggle('active', showMoon);
        moonBtn.textContent = showMoon ? '달 숨기기' : '달 함께 보기';
        render();
        if (!resultContent.hidden) showResult();
    });
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

    window.__skyModel = {
        POLARIS, DIURNAL_PER_HOUR, ANNUAL_PER_DAY, MOON_SIDEREAL_PER_DAY,
        MOON_SYNODIC_PER_DAY, MOONRISE_DELAY_MIN, MOON_R, MOON_BASE_A, polar,
        starRotation, clockLabel,
        setHours(h) { animHours = h; render(); },
        setHoursViaSlider(h) { animHours = null; hourRange.value = String(h); render(); },
        animHours: () => animHours,
        stepFrame(dt) { animHours = ((animHours ?? Number(hourRange.value)) + dt) % 12; render(); },
        setDays(d) { dayRange.value = String(d); render(); },
        setMoon(v) { if (showMoon !== v) moonBtn.click(); },
        isPlaying: () => playing,
        render,
    };

    buildSky();
    resetBtn.click();
});
