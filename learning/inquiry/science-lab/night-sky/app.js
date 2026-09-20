document.addEventListener('DOMContentLoaded', () => {
    const modeButtons = [...document.querySelectorAll('[data-mode]')];
    const controlArea = document.getElementById('controlArea');
    const predictionArea = document.getElementById('predictionArea');
    const predictionLegend = document.getElementById('predictionLegend');
    const methodHint = document.getElementById('methodHint');
    const checkBtn = document.getElementById('checkBtn');
    const resetBtn = document.getElementById('resetBtn');
    const resultEmpty = document.getElementById('resultEmpty');
    const resultContent = document.getElementById('resultContent');
    const labelA = document.getElementById('labelA');
    const labelB = document.getElementById('labelB');
    const valueA = document.getElementById('valueA');
    const valueB = document.getElementById('valueB');
    const predictionResult = document.getElementById('predictionResult');
    const explanation = document.getElementById('elementaryExplanation');
    const stageCaption = document.getElementById('stageCaption');
    const stageBadge = document.getElementById('stageBadge');
    const mainGroup = document.getElementById('mainGroup');
    const graphGroup = document.getElementById('graphGroup');
    const dataNote = document.getElementById('dataNote');

    const RUN_SECONDS = 8;
    const D2R = Math.PI / 180;

    /* -------------------------------------------------------- moon data */
    // The moon runs once round the sky relative to the sun in 29.5 days. Its
    // angle east of the sun sets both its shape and where it sits at night.
    const SYNODIC = 29.53;
    const DAYS = [
        { day: 1, label: '초하루 (1일)', name: '삭 — 보이지 않음' },
        { day: 3, label: '초사흘 (3일)', name: '초승달' },
        { day: 7.5, label: '7~8일', name: '상현달' },
        { day: 15, label: '보름 (15일)', name: '보름달' },
        { day: 22.5, label: '22~23일', name: '하현달' },
        { day: 27, label: '27일', name: '그믐달' },
    ];
    const NIGHT_START = 18, NIGHT_END = 30;        // 6 pm to 6 am
    const ASK_HOUR = 19;                            // the prediction asks about 7 pm
    const elongation = day => (360 * day / SYNODIC) % 360;
    // hour angle of the moon (degrees west of south) at a clock hour
    const moonHA = (day, hour) => {
        let h = 15 * (hour - 12) - elongation(day);
        while (h > 180) h -= 360; while (h <= -180) h += 360;
        return h;
    };
    const MIN_LIT = 0.03;   // thinner than this the moon is lost in the twilight
    const litOf = day => (1 - Math.cos(elongation(day) * D2R)) / 2;
    const where = ha => (Math.abs(ha) >= 90 ? 'hidden' : Math.abs(ha) < 30 ? 'south' : ha < 0 ? 'east' : 'west');
    const WHERE = { east: '동쪽 하늘', south: '남쪽 하늘', west: '서쪽 하늘', hidden: '보이지 않음' };

    /* -------------------------------------------------------- star data */
    // Right ascension (hours) and declination (degrees) of the Big Dipper and
    // Cassiopeia; the pole star is at the centre. Seen from latitude 37.5°.
    const DIPPER = [
        { n: '두베', ra: 11.06, dec: 61.75 }, { n: '메라크', ra: 11.03, dec: 56.38 }, { n: '페크다', ra: 11.90, dec: 53.69 },
        { n: '메그레즈', ra: 12.26, dec: 57.03 }, { n: '알리오트', ra: 12.90, dec: 55.96 }, { n: '미자르', ra: 13.40, dec: 54.93 }, { n: '알카이드', ra: 13.79, dec: 49.31 },
    ];
    const CASS = [
        { n: '카프', ra: 0.15, dec: 59.15 }, { n: '셰다르', ra: 0.68, dec: 56.54 }, { n: '감마', ra: 0.95, dec: 60.72 },
        { n: '루크바', ra: 1.43, dec: 60.24 }, { n: '세긴', ra: 1.91, dec: 63.67 },
    ];
    const LAT = 37.5;
    // sidereal time at 9 pm, by season: the sun's right ascension plus nine hours
    const SEASONS = {
        spring: { label: '봄', hint: '3월 21일 무렵', sunRA: 0 },
        summer: { label: '여름', hint: '6월 21일 무렵', sunRA: 6 },
        autumn: { label: '가을', hint: '9월 23일 무렵', sunRA: 12 },
        winter: { label: '겨울', hint: '12월 21일 무렵', sunRA: 18 },
    };
    const STAR_START = 21, STAR_END = 27;           // 9 pm to 3 am
    const lst = (season, hour) => (SEASONS[season].sunRA + (hour - 12)) % 24;
    // where a star sits round the pole: angle measured from straight up, east (right) positive
    const polar = (star, season, hour) => {
        const ha = ((lst(season, hour) - star.ra) * 15 + 540) % 360 - 180;   // degrees, -180..180
        return { r: 90 - star.dec, phi: -ha };
    };
    const side = phi => { const a = ((phi % 360) + 360) % 360; return a < 45 || a >= 315 ? 'up' : a < 135 ? 'right' : a < 225 ? 'down' : 'left'; };
    const SIDE = { up: '위', right: '오른쪽 (동쪽)', down: '아래', left: '왼쪽 (서쪽)' };

    const state = {
        mode: 'moon',
        day: 15,
        season: 'spring',
        progress: 0, prediction: null,
    };
    let running = false, frameId = 0, lastStamp = 0;

    /* ------------------------------------------------------------ models */
    function analyseMoon(s = state) {
        const info = DAYS.find(d => d.day === s.day);
        const e = elongation(s.day);
        const lit = (1 - Math.cos(e * D2R)) / 2;
        const haAsk = moonHA(s.day, ASK_HOUR);
        const verdict = lit < MIN_LIT ? 'hidden' : where(haAsk);
        // when it rises and sets, to the nearest quarter hour, within the night
        let rise = null, set = null, seen = 0;
        for (let h = NIGHT_START; h <= NIGHT_END + 1e-9; h += 0.25) {
            const vis = lit >= MIN_LIT && Math.abs(moonHA(s.day, h)) < 90;
            if (vis) seen += 0.25;
            const prev = lit >= MIN_LIT && Math.abs(moonHA(s.day, h - 0.25)) < 90;
            if (vis && !prev && h > NIGHT_START) rise = h;
            if (!vis && prev && h > NIGHT_START) set = h;
        }
        const visibleAtStart = lit >= MIN_LIT && Math.abs(moonHA(s.day, NIGHT_START)) < 90;
        return { kind: 'moon', info, e, lit, haAsk, verdict, rise, set, seen, visibleAtStart };
    }
    const moonHour = p => NIGHT_START + (NIGHT_END - NIGHT_START) * p;

    function analyseStars(s = state) {
        const season = SEASONS[s.season];
        const cen = polar({ ra: 12.5, dec: 56 }, s.season, STAR_START);
        const verdict = side(cen.phi);
        const endPhi = polar({ ra: 12.5, dec: 56 }, s.season, STAR_END).phi;
        return { kind: 'stars', season, startPhi: cen.phi, endPhi, verdict, turned: 15 * (STAR_END - STAR_START) };
    }
    const starHour = p => STAR_START + (STAR_END - STAR_START) * p;

    const analyse = () => (state.mode === 'moon' ? analyseMoon() : analyseStars());

    /* ---------------------------------------------------------- controls */
    function pickRow(legend, name, options, current, cols) {
        return `<fieldset class="pick-field"><legend>${legend}</legend>` +
            `<div class="pick-buttons cols${cols}" data-pick="${name}">` +
            options.map(o => `<button type="button" data-value="${o.value}" class="${o.value === String(current) ? 'selected' : ''}">` +
                `${o.label}${o.hint ? `<small>${o.hint}</small>` : ''}</button>`).join('') +
            `</div></fieldset>`;
    }

    function buildControls() {
        if (state.mode === 'moon') {
            controlArea.innerHTML = pickRow('음력 날짜', 'day', DAYS.map(d => ({ value: String(d.day), label: d.label, hint: d.name })), state.day, 3);
        } else {
            controlArea.innerHTML = '<p>북두칠성의 국자 끝 두 별을 이용해 북극성을 찾아보세요.</p>';
        }
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                const v = button.dataset.value;
                state[group.dataset.pick] = group.dataset.pick === 'day' ? Number(v) : v;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                settingsChanged();
            }));
        });
    }

    const PRED_MOON = [{ value: 'east', label: '동쪽 하늘' }, { value: 'south', label: '남쪽 하늘' }, { value: 'west', label: '서쪽 하늘' }, { value: 'hidden', label: '보이지 않는다' }];
    const PRED_STARS = [{ value: 'up', label: '북극성 위' }, { value: 'right', label: '오른쪽 (동쪽)' }, { value: 'left', label: '왼쪽 (서쪽)' }, { value: 'down', label: '아래' }];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list = state.mode === 'moon' ? PRED_MOON : PRED_STARS;
        predictionLegend.textContent = state.mode === 'moon' ? '저녁 7시에 달은 어디에 있을까요?' : '저녁 9시에 북두칠성은 북극성의 어느 쪽에 있을까요?';
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    const hourText = h => { const hh = ((h % 24) + 24) % 24; const m = Math.round((hh % 1) * 60); return `${hh < 12 ? (hh < 5 ? '새벽' : '아침') : hh < 18 ? '오후' : '저녁'} ${Math.floor(hh) % 12 === 0 ? 12 : Math.floor(hh) % 12}시${m ? ` ${String(m).padStart(2, '0')}분` : ''}`; };

    // the lit part of the moon for an angle e east of the sun: right side lit while waxing
    function moonShape(cx, cy, R, e) {
        const lit = (1 - Math.cos(e * D2R)) / 2;
        let out = `<circle class="moon-dark" cx="${cx}" cy="${cy}" r="${R}"/>`;
        if (lit < 0.01) return out;
        if (lit > 0.99) return out + `<circle class="moon-lit" cx="${cx}" cy="${cy}" r="${R}"/>`;
        const waxing = e < 180;
        const a = Math.abs(R * Math.cos(e * D2R));        // terminator half-width
        const gibbous = lit > 0.5;
        // outer limb on the lit side, then the terminator back up
        const limbSweep = waxing ? 1 : 0;
        const termSweep = (gibbous ? waxing : !waxing) ? 1 : 0;   // the terminator bulges toward the lit limb when crescent, away when gibbous
        out += `<path class="moon-lit" d="M${cx},${cy - R} A${R},${R} 0 0 ${limbSweep} ${cx},${cy + R} A${a.toFixed(2)},${R} 0 0 ${termSweep} ${cx},${cy - R} Z"/>`;
        return out;
    }

    function renderMoon(a, p) {
        const hour = moonHour(p);
        const ha = moonHA(state.day, hour);
        const HX = 230, HY = 168, RX = 190, RY = 118;
        const pos = h => ({ x: HX + RX * Math.sin(h * D2R), y: HY - RY * Math.cos(h * D2R) });
        let out = `<rect class="sky" x="12" y="36" width="436" height="${HY - 36}"/>`;
        out += `<rect class="horizon" x="12" y="${HY}" width="436" height="24"/>`;
        out += `<line class="horizon-line" x1="12" y1="${HY}" x2="448" y2="${HY}"/>`;
        // faint stars
        for (let i = 0; i < 26; i += 1) out += `<circle class="star dim" cx="${20 + ((i * 97) % 420)}" cy="${42 + ((i * 53) % (HY - 60))}" r="${i % 3 ? 0.8 : 1.3}"/>`;
        out += `<text class="dir-text" x="24" y="${HY + 16}">동</text>`;
        out += `<text class="dir-text" x="${HX}" y="${HY + 16}" text-anchor="middle">남</text>`;
        out += `<text class="dir-text" x="436" y="${HY + 16}" text-anchor="end">서</text>`;
        // hourly trail so far
        const canSee = a.lit >= MIN_LIT;
        for (let h = NIGHT_START; h <= hour - 0.99; h += 1) {
            const hh = moonHA(state.day, h);
            if (canSee && Math.abs(hh) < 90) { const q = pos(hh); out += `<circle class="moon-trail" cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r="3"/>`; }
        }
        // the moon now
        if (canSee && Math.abs(ha) < 90) {
            const q = pos(ha);
            out += `<g data-moon-position>${moonShape(q.x, q.y, 16, a.e)}</g>`;
        }
        out += `<text class="sky-text" x="24" y="52">${hourText(hour)}</text>`;
        out += `<text class="sky-text" x="24" y="66">${!canSee ? '해 가까이 있어 보이지 않음' : Math.abs(ha) < 90 ? `${WHERE[where(ha)]} · 높이 ${Math.round(60 * Math.cos(ha * D2R))}°` : '지평선 아래'}</text>`;
        // The phase key is outside the sky: it is not a second Moon in the west.
        out += `<g data-phase-key><text class="phase-name" style="fill:#334155" x="405" y="27" text-anchor="end">모양: ${a.info.name}</text>${moonShape(430, 24, 9, a.e)}</g>`;
        out += `<text class="verdict-text" style="fill:#0f172a" x="20" y="16">음력 ${a.info.label} · ${a.info.name} → 저녁 7시에 ${WHERE[a.verdict]}</text>`;
        out += `<text class="note-text" x="20" y="208">${a.rise ? `${hourText(a.rise)}에 떠서 ` : a.visibleAtStart ? '해 질 때 이미 떠 있어 ' : ''}${a.set ? `${hourText(a.set)}에 짐` : a.seen > 0 ? '새벽까지 보임' : '이 밤에는 보이지 않음'} · 밤새 보인 시간 ${a.seen.toFixed(1)}시간</text>`;
        return out;
    }

    function renderStars(a, p) {
        const hour = starHour(p);
        const CX = 230, CY = 104, SCALE = 2.3;
        const HORIZON = CY + LAT * SCALE;                  // the pole stands 37.5° above it
        const toXY = st => { const q = polar(st, state.season, hour); return { x: CX + q.r * SCALE * Math.sin(q.phi * D2R), y: CY - q.r * SCALE * Math.cos(q.phi * D2R) }; };
        let out = `<rect class="sky" x="12" y="20" width="436" height="${HORIZON - 20}"/>`;
        out += `<rect class="horizon" x="12" y="${HORIZON.toFixed(1)}" width="436" height="${(214 - HORIZON - 4).toFixed(1)}"/>`;
        out += `<line class="horizon-line" x1="12" y1="${HORIZON.toFixed(1)}" x2="448" y2="${HORIZON.toFixed(1)}"/>`;
        for (let i = 0; i < 30; i += 1) { const y = 26 + ((i * 59) % (HORIZON - 34)); out += `<circle class="star dim" cx="${18 + ((i * 89) % 424)}" cy="${y.toFixed(1)}" r="${i % 3 ? 0.8 : 1.2}"/>`; }
        out += `<text class="dir-text" x="24" y="${(HORIZON + 14).toFixed(1)}">서</text>`;
        out += `<text class="dir-text" x="${CX}" y="${(HORIZON + 14).toFixed(1)}" text-anchor="middle">북</text>`;
        out += `<text class="dir-text" x="436" y="${(HORIZON + 14).toFixed(1)}" text-anchor="end">동</text>`;
        // faint circles: the paths the stars follow round the pole
        [20, 30, 40].forEach(deg => { out += `<circle class="constellation" style="stroke:rgba(148, 163, 184, 0.22)" cx="${CX}" cy="${CY}" r="${(deg * SCALE).toFixed(1)}"/>`; });
        const draw = (list, close) => {
            const pts = list.map(toXY);
            const path = pts.map((q, i) => `${i ? 'L' : 'M'}${q.x.toFixed(1)},${q.y.toFixed(1)}`).join('') + (close ? 'Z' : '');
            let s = `<path class="constellation" d="${path}"/>`;
            pts.forEach((q, i) => { if (q.y < HORIZON - 2) s += `<circle class="star" cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r="${i === 0 || i === 6 ? 3 : 2.4}"/>`; });
            return s;
        };
        out += draw(DIPPER, false);
        out += draw(CASS, false);
        // the pointer from the two bowl stars, stretched five times, lands on the pole star
        const merak = toXY(DIPPER[1]), dubhe = toXY(DIPPER[0]);
        const ex = dubhe.x + (dubhe.x - merak.x) * 5, ey = dubhe.y + (dubhe.y - merak.y) * 5;
        out += `<path class="pointer" d="M${merak.x.toFixed(1)},${merak.y.toFixed(1)} L${ex.toFixed(1)},${ey.toFixed(1)}"/>`;
        out += `<circle class="polaris" cx="${CX}" cy="${CY}" r="4"/>`;
        out += `<text class="pointer-text" x="${CX + 8}" y="${CY - 6}">북극성</text>`;
        const dipC = toXY({ ra: 12.5, dec: 56 }), casC = toXY({ ra: 1.0, dec: 60 });
        const nameY = c => (c.y - 12 < 34 ? c.y + 22 : c.y - 12);
        if (dipC.y < HORIZON - 6) out += `<text class="sky-text" x="${dipC.x.toFixed(1)}" y="${nameY(dipC).toFixed(1)}" text-anchor="middle">북두칠성</text>`;
        if (casC.y < HORIZON - 6) out += `<text class="sky-text" x="${casC.x.toFixed(1)}" y="${nameY(casC).toFixed(1)}" text-anchor="middle">카시오페이아</text>`;
        out += `<text class="sky-text" x="24" y="36">${hourText(hour)}</text>`;
        out += `<text class="sky-text" x="24" y="50">저녁 9시부터 ${Math.round(15 * (hour - STAR_START))}° 돌았음</text>`;
        const phiNow = polar({ ra: 12.5, dec: 56 }, state.season, hour).phi;
        out += `<text class="verdict-text" style="fill:#0f172a" x="20" y="16">모형의 저녁 9시 → 북두칠성은 북극성 ${SIDE[a.verdict]} · 지금은 ${SIDE[side(phiNow)]}</text>`;
        return out;
    }

    function renderMain(a) {
        mainGroup.innerHTML = a.kind === 'moon' ? renderMoon(a, state.progress) : renderStars(a, state.progress);
    }

    /* ------------------------------------------------------------ graphs */
    // a month of moons, the chosen day ringed
    function graphMoon(a) {
        let out = `<text class="axis-title" x="20" y="20">한 달 동안 달의 모양 (음력 날짜)</text>`;
        out += `<rect class="sky" x="12" y="28" width="436" height="152" rx="10"/>`;
        for (let d = 1; d <= 30; d += 1) {
            const col = (d - 1) % 10, row = Math.floor((d - 1) / 10);
            const cx = 39 + col * 42.4, cy = 52 + row * 46;
            const e = elongation(d);
            const chosen = Math.abs(d - state.day) < 0.6 || (state.day === 7.5 && (d === 7 || d === 8)) || (state.day === 22.5 && (d === 22 || d === 23));
            if (chosen) out += `<circle fill="none" stroke="#38bdf8" stroke-width="2" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="16"/>`;
            out += moonShape(cx, cy, 11, e);
            out += `<text class="moon-day-text" x="${cx.toFixed(1)}" y="${(cy + 22).toFixed(1)}" text-anchor="middle">${d}</text>`;
        }
        out += `<text class="note-text" x="20" y="193">초승달 → 상현달 → 보름달 → 하현달 → 그믐달, 약 30일마다 되풀이됩니다</text>`;
        return out;
    }

    // how far the sky has turned against the clock, at 15° an hour
    function graphStars(a) {
        return '<text x="20" y="50" fill="#334155" font-size="16">① 북두칠성의 국자 끝 두 별을 찾습니다.</text>' + '<text x="20" y="90" fill="#334155" font-size="16">② 두 별 사이 거리의 약 다섯 배를 연장합니다.</text>' + '<text x="20" y="130" fill="#334155" font-size="16">③ 북극성을 찾아 북쪽 방향을 확인합니다.</text>';
    }

    function noteFor(a) {
        if (a.kind === 'moon') {
            const hour = moonHour(state.progress);
            const ha = moonHA(state.day, hour);
            return `<div class="data-row"><span class="data-name">음력</span><span class="data-val">${a.info.label} · ${a.info.name}</span></div>` +
                `<div class="data-row"><span class="data-name">밝은 부분</span><span class="data-val">달의 ${Math.round(a.lit * 100)} %${a.e < 180 && a.lit > 0.01 && a.lit < 0.99 ? ' · 오른쪽이 밝음 (커지는 중)' : a.lit > 0.01 && a.lit < 0.99 ? ' · 왼쪽이 밝음 (작아지는 중)' : ''}</span></div>` +
                `<div class="data-row"><span class="data-name">지금</span><span class="data-val">${hourText(hour)} · ${a.lit < MIN_LIT ? '보이지 않음' : Math.abs(ha) < 90 ? WHERE[where(ha)] : '지평선 아래'}</span></div>` +
                `<div class="data-row"><span class="data-name">저녁 7시</span><span class="data-val">${WHERE[a.verdict]}</span></div>` +
                `<div class="data-row match"><span class="data-name">이 밤</span><span class="data-val">${a.rise ? `${hourText(a.rise)} 뜸` : a.visibleAtStart ? '해 질 때 이미 떠 있음' : '뜨지 않음'}${a.set ? ` · ${hourText(a.set)} 짐` : ''} · 보인 시간 ${a.seen.toFixed(1)}시간</span></div>`;
        }
        return '<p>북두칠성의 모양과 북극성의 위치를 비교하세요. 시간·위치는 모형의 예시입니다.</p>';
    }

    function render() {
        const a = analyse();
        renderMain(a);
        graphGroup.innerHTML = a.kind === 'moon' ? graphMoon(a) : graphStars(a);
        stageBadge.textContent = a.kind === 'moon' ? `음력 ${a.info.label}` : '북극성 찾기';
        methodHint.textContent = state.mode === 'moon'
            ? '달의 모양은 약 한 달을 주기로 초승달 → 상현달 → 보름달 → 하현달 → 그믐달로 바뀝니다'
            : '북두칠성의 국자 끝 두 별을 이어 북극성을 찾아보세요';
        dataNote.innerHTML = noteFor(a);
        return a;
    }

    /* --------------------------------------------------------------- run */
    function tick(dt) {
        state.progress = Math.min(1, state.progress + dt / RUN_SECONDS);
        render();
        return state.progress >= 1;
    }

    function stopRun() { running = false; if (frameId) cancelAnimationFrame(frameId); frameId = 0; }

    function frame(stamp) {
        if (!running) return;
        const dt = Math.min(0.05, (stamp - lastStamp) / 1000 || 0);
        lastStamp = stamp;
        if (tick(dt)) { stopRun(); finish(); } else frameId = requestAnimationFrame(frame);
    }

    function startRun() {
        stopRun();
        state.progress = 0;
        running = true;
        lastStamp = performance.now();
        render();
        frameId = requestAnimationFrame(frame);
    }

    function finish() {
        const a = render();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        if (a.kind === 'moon') {
            labelA.textContent = '저녁 7시'; labelB.textContent = '밤새 보인 시간';
            valueA.textContent = WHERE[a.verdict];
            valueB.textContent = `${a.seen.toFixed(1)}시간`;
            predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
                : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
            let s = '';
            if (state.day === 1) s = `초하루의 달은 해와 같은 쪽에 있어 해와 함께 뜨고 집니다. 밤에는 지평선 아래에 있고, 낮에도 밝은 쪽이 해를 향해 있어 보이지 않습니다.`;
            else if (state.day === 3) s = `초승달은 해보다 조금 늦게 지므로 해가 진 뒤 서쪽 하늘에 낮게 잠깐 보이고, ${hourText(a.set)}쯤 집니다. 오른쪽 아래가 가늘게 밝습니다.`;
            else if (state.day === 7.5) s = `상현달은 해가 질 무렵 남쪽 하늘 높이 있어 저녁 내내 잘 보이다가 ${hourText(a.set)}쯤 서쪽으로 집니다. 오른쪽 반이 밝습니다.`;
            else if (state.day === 15) s = `보름달은 해가 질 때 동쪽에서 떠서 한밤에 남쪽 하늘 가장 높이 있고 새벽에 서쪽으로 집니다. 해와 반대쪽에 있어 밤새 ${a.seen.toFixed(1)}시간 동안 보입니다.`;
            else if (state.day === 22.5) s = `하현달은 ${hourText(a.rise)}쯤에야 동쪽에서 떠서 새벽에 남쪽 하늘에 있습니다. 저녁에는 아직 뜨지 않아 보이지 않고, 왼쪽 반이 밝습니다.`;
            else s = `그믐달은 해보다 조금 먼저 뜨므로 ${hourText(a.rise)}쯤 동쪽 하늘에 가늘게 보이다가 곧 해가 떠 사라집니다. 저녁에는 보이지 않습니다.`;
            explanation.textContent = s;
            return;
        }
        labelA.textContent = '저녁 9시'; labelB.textContent = '새벽 3시';
        valueA.textContent = `북극성 ${SIDE[a.verdict]}`;
        valueB.textContent = `북극성 ${SIDE[side(a.endPhi)]}`;
        predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        explanation.textContent = "국자 끝 두 별 사이를 약 다섯 배 연장하면 북극성을 찾을 수 있습니다. 북극성은 북쪽 방향을 알아보는 데 이용합니다. 화면의 위치는 관측 예시입니다.";
    }

    function settingsChanged() {
        stopRun();
        state.progress = 0;
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        render();
    }

    modeButtons.forEach(button => button.addEventListener('click', () => {
        state.mode = button.dataset.mode;
        state.prediction = null;
        modeButtons.forEach(item => item.classList.toggle('selected', item === button));
        buildControls();
        buildPrediction();
        stageCaption.textContent = state.mode === 'moon'
            ? '남쪽을 바라보고 선 모습입니다. 왼쪽이 동쪽, 오른쪽이 서쪽입니다.'
            : '북쪽을 바라보고 선 모습입니다. 왼쪽이 서쪽, 오른쪽이 동쪽이고, 점선은 북극성을 찾는 선입니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { day: 15, season: 'spring', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'moon').click();
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

    window.__skyModel = {
        DAYS, SEASONS, DIPPER, CASS, state,
        analyseMoon, analyseStars, analyse, elongation, moonHA, where, polar, side, render,
        runSeconds: () => RUN_SECONDS,
        setMode(m) { modeButtons.find(b => b.dataset.mode === m).click(); },
        set(key, value) { state[key] = value; buildControls(); buildPrediction(); settingsChanged(); },
        setProgress(p) { stopRun(); state.progress = p; render(); },
        runToEnd(dt = 0.25, cap = 5000) {
            stopRun(); state.progress = 0;
            let steps = 0;
            while (!tick(dt) && steps < cap) steps += 1;
            finish();
            return { steps, progress: state.progress };
        },
        tick, finish,
    };

    resetBtn.click();
});
