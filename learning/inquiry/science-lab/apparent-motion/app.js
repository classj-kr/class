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
    const southSky = document.getElementById('southSky');
    const southMoon = document.getElementById('southMoon');
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
    const SYNODIC = 29.53;
    const MOON_SYNODIC_PER_DAY = 360 / SYNODIC;     // ≈ 12.2 °/day
    // 달이 다시 같은 자리(같은 시간각)에 오는 데 걸리는 시간, 곧 달의 하루는
    // 24 h × 29.53 / 28.53 ≈ 24시간 50.5분. 그래서 다음 날 달은 약 50분 늦게 뜬다.
    const LUNAR_DAY_H = 24 * SYNODIC / (SYNODIC - 1);
    const MOONRISE_DELAY_MIN = (LUNAR_DAY_H - 24) * 60;                       // ≈ 50.5 min
    const MOON_HA_PER_HOUR = DIURNAL_PER_HOUR - MOON_SYNODIC_PER_DAY / 24;    // ≈ 14.49 °/h

    // 서울(126.98°E)은 표준시 기준 경도 135°E보다 서쪽이라 해가 남중하는 때가
    // 12시보다 약 32분 늦다. 달의 시각도 같은 시계(한국 표준시)로 읽는다.
    const LAT = 37.5;
    const SEOUL_LAG_H = (135 - 126.98) / 15;        // ≈ 0.53 h
    // 0일 뒤 오후 9시의 달은 상현달(태양과 90° 떨어짐)로 둔다.
    const MOON_E0 = 90;

    const BASE_HOUR = 21;                           // observations start at 9 pm

    // Positions around Polaris from the real coordinates (J2000 RA/Dec):
    // angle = RA − LST (LST 22.5h, an autumn evening at 9 pm), distance from
    // Polaris = 2.6 px per degree of polar distance. The bowl of the Big Dipper
    // closes at Megrez, and the two pointer stars (Merak→Dubhe) aim at Polaris.
    // b marks the brighter stars (about magnitude 2.3 or brighter).
    const BIG_DIPPER = [   // 알카이드, 미자르, 알리오트, 메그레즈, 페크다, 메라크, 두베
        { a: 229, r: 106, b: true }, { a: 223, r: 91 }, { a: 216, r: 88, b: true }, { a: 206, r: 86 },
        { a: 200, r: 94 }, { a: 187, r: 87 }, { a: 188, r: 73, b: true },
    ];
    const BIG_DIPPER_CLOSE = 3;   // 두베 → 메그레즈로 국자 머리를 닫는다
    const CASSIOPEIA = [   // 카프, 셰다르, 나비, 루크바, 세긴 (W 모양)
        { a: 24, r: 80, b: true }, { a: 32, r: 87, b: true }, { a: 36, r: 76, b: true }, { a: 43, r: 77 }, { a: 51, r: 68 },
    ];
    const MOON_R = 116;
    const MOON_BASE_A = 130;

    // 남쪽 하늘 칸: 지평선 위 방위각(남쪽 0°, 서쪽 +)과 고도를 같은 눈금으로 편다.
    // 달이 지나는 길은 날마다 조금씩 높낮이가 바뀌지만, 여기서는 평균적인 길
    // (적위 0°: 정동에서 떠 남쪽 하늘 고도 52.5°를 지나 정서로 짐)로 그린다.
    const SOUTH = { cx: 230, horizon: 186, k: 1.9, R: 11 };
    const norm180 = a => ((a + 180) % 360 + 360) % 360 - 180;
    // τ: 0일 뒤 자정부터 잰 시각(시간). 0일 뒤 오후 9시는 τ = 21.
    const tauOf = (d, h) => 24 * d + BASE_HOUR + h;
    const elongation = tau => MOON_E0 + MOON_SYNODIC_PER_DAY * (tau - BASE_HOUR) / 24;
    const moonHourAngle = tau => norm180(DIURNAL_PER_HOUR * (tau - 12 - SEOUL_LAG_H) - elongation(tau));
    function altAzOf(Hdeg) {
        const H = Hdeg * Math.PI / 180, phi = LAT * Math.PI / 180;
        return {
            alt: Math.asin(Math.cos(phi) * Math.cos(H)) * 180 / Math.PI,
            az: Math.atan2(Math.sin(H), Math.sin(phi) * Math.cos(H)) * 180 / Math.PI,
            H: Hdeg,
        };
    }
    const moonAltAz = tau => altAzOf(moonHourAngle(tau));
    const southXY = (az, alt) => ({ x: SOUTH.cx + SOUTH.k * az, y: SOUTH.horizon - SOUTH.k * alt });
    // d일 뒤(그날 0시~24시) 달이 동쪽 지평선에 뜨는 시각. 달의 하루는 24시간보다
    // 길어서 한 달에 하루쯤은 달이 뜨지 않는 날이 있다.
    function moonriseOn(d) {
        const H21 = DIURNAL_PER_HOUR * (BASE_HOUR - 12 - SEOUL_LAG_H) - MOON_E0;   // 0일 뒤 오후 9시의 시간각
        const k = Math.ceil((MOON_HA_PER_HOUR * (24 * d - BASE_HOUR) + H21 + 90) / 360);
        const tau = BASE_HOUR + (-90 + 360 * k - H21) / MOON_HA_PER_HOUR;
        const h = tau - 24 * d;
        return h >= 24 ? { none: true } : { none: false, h };
    }
    function fmtClock(h) {
        let total = Math.round(h * 60);
        total = ((total % 1440) + 1440) % 1440;
        const hh = Math.floor(total / 60), mm = total % 60;
        const disp = hh % 12 === 0 ? 12 : hh % 12;
        return `${hh < 12 ? '오전' : '오후'} ${disp}시${mm ? ` ${mm}분` : ''}`;
    }
    const riseLabel = d => { const r = moonriseOn(d); return r.none ? '이날은 뜨지 않음' : fmtClock(r.h); };

    // 지구에서 본 달의 모양. 남쪽을 보고 설 때 차는 달은 오른쪽(서쪽)이 밝다.
    function phasePath(E, cx, cy, R) {
        const e = ((E % 360) + 360) % 360, waxing = e <= 180;
        const c = Math.cos((waxing ? e : 360 - e) * Math.PI / 180), side = waxing ? 1 : -1, n = 24, pts = [];
        for (let i = 0; i <= n; i += 1) { const y = -R + 2 * R * i / n; pts.push([cx + side * Math.sqrt(Math.max(0, R * R - y * y)), cy + y]); }
        for (let i = n; i >= 0; i -= 1) { const y = -R + 2 * R * i / n; pts.push([cx + side * c * Math.sqrt(Math.max(0, R * R - y * y)), cy + y]); }
        return `M${pts.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('L')}Z`;
    }
    function drawSouthPath() {
        const pts = [];
        for (let H = -90; H <= 90; H += 3) {
            const m = altAzOf(H), p = southXY(m.az, Math.max(0, m.alt));
            pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
        }
        document.getElementById('southPath').setAttribute('d', `M${pts.join('L')}`);
    }
    function moonDisc(tau, cls, label) {
        const m = moonAltAz(tau);
        if (m.alt < 0) return '';
        const p = southXY(m.az, m.alt);
        return `<g class="${cls}"><circle class="moon-dark" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${SOUTH.R}"/>` +
            `<path class="moon-lit" d="${phasePath(elongation(tau), p.x, p.y, SOUTH.R)}"/>` +
            `<text class="moon-label" x="${p.x.toFixed(1)}" y="${(p.y - SOUTH.R - 6).toFixed(1)}" text-anchor="middle">${label}</text></g>`;
    }
    function renderSouth() {
        if (!showMoon) { southMoon.innerHTML = ''; return; }
        const d = days(), h = hours(), tau = tauOf(d, h);
        let out = '';
        if (d > 0) out += moonDisc(tauOf(0, h), 'moon-ghost', '0일 뒤');
        const now = moonDisc(tau, 'moon-now', d > 0 ? `${d}일 뒤` : '달');
        out += now;
        if (!now) out += `<text class="south-note" x="${SOUTH.cx}" y="44" text-anchor="middle">지금 달은 지평선 아래</text>`;
        out += `<text class="south-note" x="16" y="24">뜨는 시각 ${riseLabel(d)}</text>`;
        southMoon.innerHTML = out;
    }

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

    function clockLabel(h) {
        const t = (BASE_HOUR + h) % 24;
        const hh = Math.floor(t);
        const mm = Math.round((t - hh) * 60);
        const ampm = hh < 12 ? '오전' : '오후';
        const disp = hh % 12 === 0 ? 12 : hh % 12;
        return `${ampm} ${disp}시${mm ? ` ${mm}분` : ''}`;
    }

    function buildSky() {
        const drawGroup = (stars, name, labelIdx, dr, closeTo = null) => {
            const pts = stars.map(s => polar(s.a, s.r));
            const line = closeTo === null ? pts : [...pts, pts[closeTo]];
            let out = `<path class="const-line" d="M${line.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('L')}"/>`;
            pts.forEach((p, i) => {
                out += `<circle class="star${stars[i].b ? ' star-bright' : ''}" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${stars[i].b ? 3.4 : 2.6}"/>`;
            });
            const lp = polar(stars[labelIdx].a, stars[labelIdx].r + dr);
            out += `<text class="const-name" x="${lp.x.toFixed(1)}" y="${(lp.y + 5).toFixed(1)}" text-anchor="middle">${name}</text>`;
            return out;
        };
        skyGroup.innerHTML = drawGroup(BIG_DIPPER, '북두칠성', 3, -28, BIG_DIPPER_CLOSE) + drawGroup(CASSIOPEIA, '카시오페이아', 2, 26);

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
        // 별자리 이름은 하늘과 함께 돌되 글자는 늘 바로 서 있게 한다.
        skyGroup.querySelectorAll('.const-name').forEach(t => t.setAttribute('transform', `rotate(${rot.toFixed(3)} ${t.getAttribute('x')} ${t.getAttribute('y')})`));

        // 달은 서울에서 북극성 둘레를 도는 주극성이 될 수 없다(적위 52.5° 이상이어야
        // 하는데 달은 최대 약 28.6°). 그래서 달은 북쪽 하늘이 아니라 남쪽 하늘 칸에 그린다.
        moonGroup.innerHTML = '';
        southSky.toggleAttribute('hidden', !showMoon);   // SVG 요소에는 hidden 속성 짝 프로퍼티가 없다
        document.getElementById('southNote').hidden = !showMoon;
        renderSouth();

        hourOutput.textContent = `${hours() % 1 === 0 ? hours() : hours().toFixed(1)}시간 뒤`;
        dayOutput.textContent = `${days()}일 뒤`;
        stageBadge.textContent = `${clockLabel(hours())}${days() ? ` · ${days()}일 뒤` : ''}`;

        rateNote.innerHTML =
            `<div class="rate-row"><span class="rate-name">일주운동</span><span class="rate-value">시간당 ${DIURNAL_PER_HOUR}° — 지금까지 ${(DIURNAL_PER_HOUR * hours()).toFixed(1)}°</span></div>` +
            `<div class="rate-row"><span class="rate-name">연주운동</span><span class="rate-value">하루 약 ${ANNUAL_PER_DAY.toFixed(2)}° — 지금까지 ${(ANNUAL_PER_DAY * days()).toFixed(1)}°</span></div>` +
            `<div class="rate-row"><span class="rate-name">달의 이동</span><span class="rate-value">별 기준 하루 약 ${MOON_SIDEREAL_PER_DAY.toFixed(1)}° 동쪽 — 지금까지 ${(MOON_SIDEREAL_PER_DAY * days()).toFixed(1)}°</span></div>` +
            `<div class="rate-row"><span class="rate-name">달이 뜨는 시각</span><span class="rate-value">하루 약 50분씩 늦어짐 — ${days()}일 뒤 ${riseLabel(days())}</span></div>`;

        resultAngle.textContent = `${(starRotation() % 360).toFixed(1)}°`;
        resultMoon.textContent = riseLabel(days());
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
        if (showMoon && d === 0) {
            s += ` 오늘 달은 ${riseLabel(0)}에 동쪽에서 떠서 남쪽 하늘을 지나 서쪽으로 집니다.`;
        } else if (showMoon && d > 0) {
            const r = moonriseOn(d);
            s += ` 달은 별을 기준으로 하루 약 ${MOON_SIDEREAL_PER_DAY.toFixed(1)}°씩 동쪽으로 밀려나, 뜨는 시각이 하루에 약 50분씩 늦어집니다. 처음 날은 ${riseLabel(0)}에 떴고, ${d}일 뒤에는 ${r.none ? '그날 하루 동안 달이 뜨지 않습니다' : `${fmtClock(r.h)}에 뜹니다`}.`;
            if (d >= 29) s += ` 약 29.5일이 지나면 늦어진 시간이 하루를 채워, 달은 다시 처음과 비슷한 시각에 뜹니다.`;
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
        MOON_SYNODIC_PER_DAY, MOONRISE_DELAY_MIN, LUNAR_DAY_H, MOON_R, MOON_BASE_A, polar,
        moonAltAz, moonriseOn, elongation, tauOf,
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
    drawSouthPath();
    resetBtn.click();
});
