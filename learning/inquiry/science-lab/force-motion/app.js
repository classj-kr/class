document.addEventListener('DOMContentLoaded', () => {
    const floorButtons = [...document.querySelectorAll('[data-floor]')];
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const forceRange = document.getElementById('forceRange');
    const massRange = document.getElementById('massRange');
    const startRange = document.getElementById('startRange');
    const forceOutput = document.getElementById('forceOutput');
    const massOutput = document.getElementById('massOutput');
    const startOutput = document.getElementById('startOutput');
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

    const G = 10;                             // N per kg, the value school uses
    // The track starts far enough in that the longest friction arrow (40 N on
    // rubber under a 10 kg crate, 80 px) still fits beside the crate at 0 m.
    const TRACK_X0 = 88, TRACK_X1 = 388, TRACK_M = 11;
    const PX_PER_M = (TRACK_X1 - TRACK_X0) / TRACK_M;
    const PX_PER_N = 2;                       // one scale for every horizontal force
    const CRATE_W = 26, CRATE_H = 30, GROUND_Y = 126;
    const CRATE_TOP = GROUND_Y - CRATE_H, CY = CRATE_TOP + CRATE_H / 2;
    const REST_RUN = 2.5;                     // seconds to watch a crate refuse to move
    const GRAPH = { x0: 54, x1: 424, y0: 152, y1: 22 };
    const FLOORS = {
        ice: { mu: 0.05, name: '얼음' },
        wood: { mu: 0.20, name: '나무' },
        rubber: { mu: 0.40, name: '고무 매트' },
    };

    let floor = 'wood';
    let prediction = null;
    let simTime = 0, running = false, lastStamp = 0, frameId = 0;

    const push = () => Number(forceRange.value);
    const mass = () => Number(massRange.value);
    const startSpeed = () => Number(startRange.value);

    function analyse(F = push(), m = mass(), v0 = startSpeed(), key = floor) {
        const mu = FLOORS[key].mu;
        const weight = m * G;
        const fMax = mu * weight;                  // the most friction this floor can give
        const moving = v0 > 0;
        // Standing still, friction only pushes back as hard as it is pushed —
        // it never invents force of its own.
        const friction = moving ? fMax : Math.min(F, fMax);
        const net = F - friction;
        const accel = moving || F > fMax ? (F - fMax) / m : 0;
        let motion;
        if (!moving && F <= fMax) motion = 'rest';
        else if (accel > 1e-9) motion = 'faster';
        else if (accel < -1e-9) motion = 'slower';
        else motion = 'constant';

        // Where and when the run ends, in closed form: the acceleration is
        // constant, so there is nothing to integrate numerically.
        let endTime, stopTime = Infinity, reachedEnd = false;
        if (motion === 'rest') {
            endTime = REST_RUN;
        } else if (motion === 'slower') {
            stopTime = v0 / -accel;
            const stopDist = (v0 * v0) / (2 * -accel);
            if (stopDist >= TRACK_M) { endTime = timeToReach(TRACK_M, v0, accel); reachedEnd = true; }
            else endTime = stopTime;
        } else {
            endTime = timeToReach(TRACK_M, v0, accel);
            reachedEnd = true;
        }
        return { F, m, v0, mu, weight, fMax, friction, net, accel, motion, endTime, stopTime, reachedEnd, floorName: FLOORS[key].name };
    }

    function timeToReach(dist, v0, a) {
        if (Math.abs(a) < 1e-12) return v0 > 0 ? dist / v0 : Infinity;
        return (-v0 + Math.sqrt(v0 * v0 + 2 * a * dist)) / a;
    }

    // Position and speed at any moment, straight from the kinematics.
    function stateAt(t, a = analyse()) {
        if (a.motion === 'rest') return { x: 0, v: 0 };
        const tm = Math.min(t, a.endTime, a.stopTime);
        const x = Math.min(TRACK_M, a.v0 * tm + 0.5 * a.accel * tm * tm);
        const v = Math.max(0, a.v0 + a.accel * tm);
        return { x, v };
    }

    const clampX = (x, w) => Math.max(w / 2 + 2, Math.min(460 - w / 2 - 2, x));

    function arrow(x1, y1, x2, y2, cls) {
        const dx = Math.sign(x2 - x1), dy = Math.sign(y2 - y1);
        let head;
        if (dy === 0) head = `M${x2 - dx * 7},${y2 - 6} L${x2},${y2} L${x2 - dx * 7},${y2 + 6}`;
        else head = `M${x2 - 6},${y2 - dy * 7} L${x2},${y2} L${x2 + 6},${y2 - dy * 7}`;
        return `<line class="${cls}" x1="${x1.toFixed(1)}" y1="${y1}" x2="${x2.toFixed(1)}" y2="${y2}"/>` +
               `<path class="${cls}" d="${head}"/>`;
    }

    function renderMain(a, st) {
        let out = '';
        out += `<text class="read-text" x="20" y="24">속력 ${st.v.toFixed(1)} m/s</text>`;
        out += `<text class="part-label" x="440" y="24" text-anchor="end">이동 거리 ${st.x.toFixed(1)} m · 시간 ${simTime.toFixed(1)} 초</text>`;
        // how long an arrow of a given size is, stated once
        out += `<line class="scale-bar" x1="20" y1="44" x2="${20 + 10 * PX_PER_N}" y2="44"/>`;
        out += `<text class="scale-text" x="${24 + 10 * PX_PER_N}" y="48">화살표 이 길이가 10 N</text>`;

        // the floor, textured to match how slippery it is
        out += `<line class="floor" x1="20" y1="${GROUND_Y}" x2="450" y2="${GROUND_Y}"/>`;
        const hatchStep = floor === 'rubber' ? 9 : floor === 'wood' ? 14 : 26;
        for (let x = 22; x < 450; x += hatchStep) {
            out += `<line class="floor-hatch ${floor}" x1="${x}" y1="${GROUND_Y + 2}" x2="${x - 6}" y2="${GROUND_Y + 9}"/>`;
        }

        const left = TRACK_X0 + st.x * PX_PER_M;
        const right = left + CRATE_W, cx = left + CRATE_W / 2;
        out += `<rect class="crate" x="${left.toFixed(1)}" y="${CRATE_TOP}" width="${CRATE_W}" height="${CRATE_H}" rx="3"/>`;
        out += `<line class="crate-band" x1="${left.toFixed(1)}" y1="${CRATE_TOP + 8}" x2="${right.toFixed(1)}" y2="${CRATE_TOP + 8}"/>`;
        out += `<text class="crate-text" x="${cx.toFixed(1)}" y="${CY + 6}" text-anchor="middle">${a.m} kg</text>`;

        // up and down always balance on a flat floor, so they are drawn equal
        out += arrow(cx, CY, cx, CRATE_TOP - 12, 'arrow-vert');
        out += arrow(cx, CY, cx, GROUND_Y + 14, 'arrow-vert');
        if (a.F > 0) out += arrow(right, CY, right + a.F * PX_PER_N, CY, 'arrow-push');
        if (a.friction > 0) out += arrow(left, CY, left - a.friction * PX_PER_N, CY, 'arrow-fric');

        // The arrows carry no text of their own. The crate roams the whole
        // track, so any label pinned to it collides with something sooner or
        // later; this table sits where the crate can never reach.
        [['미는 힘', a.F, '#0284c7'], ['마찰력', a.friction, '#ea580c'],
         ['수직항력', a.weight, '#b4d2dc'], ['무게', a.weight, '#b4d2dc']]
            .forEach(([name, value, colour], i) => {
                const y = 38 + i * 12;
                // inline style, not a fill attribute: the class rule would win
                out += `<rect x="250" y="${y - 7}" width="8" height="8" rx="2" fill="${colour}"/>`;
                out += `<text class="vert-text" style="fill:${colour}" x="264" y="${y}">${name} ${fmt(value)} N</text>`;
            });

        // the distance ruler the crate is measured against
        out += `<line class="ruler" x1="${TRACK_X0}" y1="152" x2="${TRACK_X1}" y2="152"/>`;
        for (let mtr = 0; mtr <= TRACK_M; mtr += 1) {
            const x = TRACK_X0 + mtr * PX_PER_M;
            out += `<line class="tick major" x1="${x.toFixed(1)}" y1="152" x2="${x.toFixed(1)}" y2="158"/>`;
            out += `<text class="axis-text" x="${x.toFixed(1)}" y="170" text-anchor="middle">${mtr}</text>`;
        }
        out += `<text class="part-label" x="${TRACK_X1 + 8}" y="162">m</text>`;

        const balanced = Math.abs(a.net) < 1e-9;
        const tone = balanced ? '#059669' : a.net > 0 ? '#0284c7' : '#ea580c';
        out += `<text class="balance-text" fill="${tone}" x="20" y="190">` +
               `미는 힘 ${a.F} N ${balanced ? '=' : a.net > 0 ? '>' : '<'} 마찰력 ${fmt(a.friction)} N → 알짜힘 ${fmt(Math.abs(a.net))} N${balanced ? ' (평형)' : ''}</text>`;
        out += `<text class="note-text" x="20" y="206">${MOTION_NOTE[a.motion]}</text>`;
        mainGroup.innerHTML = out;
    }

    const fmt = n => (Math.abs(n - Math.round(n)) < 1e-9 ? String(Math.round(n)) : n.toFixed(1));
    const MOTION_NAME = { rest: '정지', constant: '등속 운동', faster: '점점 빨라짐', slower: '점점 느려짐' };
    const MOTION_NOTE = {
        rest: '알짜힘이 0이라 멈춘 채로 있습니다. 마찰력이 미는 힘만큼만 생겼습니다.',
        constant: '알짜힘이 0이라 속력이 변하지 않습니다. 힘이 평형이어도 움직일 수 있습니다.',
        faster: '알짜힘이 앞으로 작용해 속력이 점점 커집니다.',
        slower: '알짜힘이 뒤로 작용해 속력이 점점 줄어들다가 멈춥니다.',
    };

    function renderGraph(a, st) {
        const endT = Number.isFinite(a.endTime) ? a.endTime : REST_RUN;
        const vEnd = Math.max(a.v0, a.v0 + a.accel * Math.min(endT, a.stopTime));
        const tMax = Math.max(1, Math.ceil(endT * 1.15 * 2) / 2);
        const vMax = Math.max(2, Math.ceil(vEnd * 1.15));
        const gx = t => GRAPH.x0 + (t / tMax) * (GRAPH.x1 - GRAPH.x0);
        const gy = v => GRAPH.y0 - (v / vMax) * (GRAPH.y0 - GRAPH.y1);
        let out = '';
        for (let i = 0; i <= 4; i += 1) {
            const v = (vMax / 4) * i;
            out += `<line class="grid-line" x1="${GRAPH.x0}" y1="${gy(v).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(v).toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(gy(v) + 3).toFixed(1)}" text-anchor="end">${fmt(v)}</text>`;
        }
        for (let i = 0; i <= 4; i += 1) {
            const t = (tMax / 4) * i;
            out += `<text class="axis-text" x="${gx(t).toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${fmt(t)}</text>`;
        }
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-title" x="${((GRAPH.x0 + GRAPH.x1) / 2).toFixed(1)}" y="${GRAPH.y0 + 30}" text-anchor="middle">시간 (초)</text>`;
        out += `<text class="axis-title" x="${GRAPH.x0}" y="${GRAPH.y1 - 6}">속력 (m/s)</text>`;

        if (a.v0 > 0) {
            out += `<line class="start-line" x1="${GRAPH.x0}" y1="${gy(a.v0).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(a.v0).toFixed(1)}"/>`;
            out += `<text class="start-text" x="${GRAPH.x1 - 4}" y="${(gy(a.v0) - 5).toFixed(1)}" text-anchor="end">처음 속력 ${fmt(a.v0)} m/s</text>`;
        }
        // whole run faint, the part already travelled bright
        const line = (t0, t1, cls) => {
            const pts = [];
            for (let i = 0; i <= 40; i += 1) {
                const t = t0 + ((t1 - t0) * i) / 40;
                pts.push(`${gx(t).toFixed(1)},${gy(stateAt(t, a).v).toFixed(1)}`);
            }
            return `<path class="${cls}" d="M${pts.join('L')}"/>`;
        };
        out += line(0, endT, 'trace-done');
        if (simTime > 0) out += line(0, Math.min(simTime, endT), 'trace');
        out += `<circle class="trace-dot" cx="${gx(Math.min(simTime, endT)).toFixed(1)}" cy="${gy(st.v).toFixed(1)}" r="5" fill="#d97706"/>`;
        graphGroup.innerHTML = out;
    }

    function render() {
        const a = analyse();
        const st = stateAt(simTime, a);
        renderMain(a, st);
        renderGraph(a, st);
        forceOutput.textContent = `${a.F} N`;
        massOutput.textContent = `${a.m} kg`;
        startOutput.textContent = `${a.v0.toFixed(1)} m/s`;
        stageBadge.textContent = `${a.floorName} · ${MOTION_NAME[a.motion]}`;
        dataNote.innerHTML = '<p>미는 힘: ' + a.F + ' N · 마찰력: ' + fmt(a.friction) + ' N</p>' +
            '<p>알짜힘: ' + fmt(a.net) + ' N · ' + MOTION_NAME[a.motion] + '</p>';
        return { a, st };
    }

    function stopSim() { running = false; if (frameId) cancelAnimationFrame(frameId); frameId = 0; }

    // One step of the clock. Kept apart from the frame callback so the run can
    // be driven and checked without depending on the animation timer.
    function tick(dt) {
        const a = analyse();
        simTime += dt;
        const limit = Number.isFinite(a.endTime) ? a.endTime : REST_RUN;
        let done = false;
        if (simTime >= limit) { simTime = limit; done = true; }
        render();
        return done;
    }

    function frame(stamp) {
        if (!running) return;
        const dt = Math.min(0.05, (stamp - lastStamp) / 1000 || 0);
        lastStamp = stamp;
        if (tick(dt)) { stopSim(); finish(); }
        else frameId = requestAnimationFrame(frame);
    }

    function startSim() {
        stopSim();
        simTime = 0;
        running = true;
        lastStamp = performance.now();
        render();
        frameId = requestAnimationFrame(frame);
    }

    function finish() {
        const { a, st } = render();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        valueA.textContent = Math.abs(a.net) < 1e-9
            ? '0 N (평형)'
            : `${fmt(Math.abs(a.net))} N ${a.net > 0 ? '앞쪽' : '뒤쪽'}`;
        valueB.textContent = MOTION_NAME[a.motion];
        predictionResult.textContent = !prediction
            ? '다음에는 결과를 먼저 예상해 보세요.'
            : prediction === a.motion ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        const s = Math.abs(a.net) < 1e-9 ? '서로 반대 방향의 힘이 같은 크기여서 힘의 평형을 이룹니다. 멈춰 있던 물체는 멈춰 있고, 움직이던 물체는 같은 속력과 방향으로 움직입니다.' : '알짜힘이 작용하면 물체의 운동이 변합니다. 미는 힘과 마찰력의 화살표를 비교해 보세요.';
        explanation.textContent = s;
    }

    function settingsChanged() {
        stopSim();
        simTime = 0;
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        render();
    }

    [forceRange, massRange, startRange].forEach(el => el.addEventListener('input', settingsChanged));
    floorButtons.forEach(button => button.addEventListener('click', () => {
        floor = button.dataset.floor;
        floorButtons.forEach(item => item.classList.toggle('selected', item === button));
        settingsChanged();
    }));
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction;
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    checkBtn.addEventListener('click', startSim);
    resetBtn.addEventListener('click', () => {
        stopSim();
        forceRange.value = '8'; massRange.value = '4'; startRange.value = '0';
        prediction = null;
        predictionButtons.forEach(item => item.classList.remove('selected'));
        stageCaption.textContent = '미는 힘과 마찰력의 길이를 견주어 보세요. 길이가 같으면 힘이 평형입니다.';
        floorButtons.find(b => b.dataset.floor === 'wood').click();
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

    window.__forceModel = {
        G, TRACK_M, PX_PER_M, PX_PER_N, TRACK_X0, FLOORS, analyse, stateAt, timeToReach, render,
        setForce(v) { forceRange.value = String(v); forceRange.dispatchEvent(new Event('input')); },
        setMass(v) { massRange.value = String(v); massRange.dispatchEvent(new Event('input')); },
        setStart(v) { startRange.value = String(v); startRange.dispatchEvent(new Event('input')); },
        setFloor(f) { floorButtons.find(b => b.dataset.floor === f).click(); },
        seek(t) { stopSim(); simTime = t; render(); },
        // drive the real run loop without waiting on the animation timer
        runToEnd(dt = 1 / 60, cap = 20000) {
            stopSim(); simTime = 0;
            let steps = 0;
            while (!tick(dt) && steps < cap) steps += 1;
            finish();
            return { steps, simTime };
        },
        tick, finish, getTime: () => simTime, getFloor: () => floor,
    };

    resetBtn.click();
});
