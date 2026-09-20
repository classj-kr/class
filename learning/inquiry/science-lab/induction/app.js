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

    const ROD_L = 0.4;              // metres of rod between the rails
    const RAIL_M = 4;               // metres of rail on screen
    const EMF_BENCH = 1;            // the emf we compare against
    const EMF_SOURCE = 12;          // volts of the battery in the circuit mode
    const RAIL_X0 = 60, RAIL_X1 = 400, RAIL_TOP = 72, RAIL_BOT = 152;
    const PX_PER_M = (RAIL_X1 - RAIL_X0) / RAIL_M;
    const GRAPH = { x0: 70, x1: 424, y0: 154, y1: 34 };

    const state = { mode: 'induce', B: 0.5, v: 4, R: 4, r: 2, Rext: 4, prediction: null };

    /* ------------------------------------------------------------ models */
    // A rod of length L cutting field lines at speed v makes emf = BLv.
    function analyseInduce(B = state.B, v = state.v, R = state.R) {
        const emf = B * ROD_L * v;
        const current = emf / R;
        const force = B * current * ROD_L;      // always opposing, by Lenz
        const power = emf * current;
        const verdict = emf > EMF_BENCH * 1.1 ? 'more' : emf < EMF_BENCH * 0.9 ? 'less' : 'near';
        return { kind: 'induce', B, v, R, L: ROD_L, emf, current, force, power, verdict };
    }

    // A real cell has resistance of its own, so the terminals sag under load.
    function analyseCircuit(r = state.r, R = state.Rext, emf = EMF_SOURCE) {
        const current = emf / (R + r);
        const terminal = emf - current * r;
        const pExt = current * current * R;
        const pInt = current * current * r;
        const pTotal = emf * current;
        const best = (emf * emf) / (4 * r);      // the most the load can ever draw
        const verdict = R < r - 1e-9 ? 'up' : R > r + 1e-9 ? 'down' : 'peak';
        return { kind: 'circuit', r, R, emf, current, terminal, pExt, pInt, pTotal, best, verdict,
                 efficiency: (pExt / pTotal) * 100 };
    }

    const analyse = () => (state.mode === 'induce' ? analyseInduce() : analyseCircuit());

    /* ---------------------------------------------------------- controls */
    const slider = (id, label, min, max, step, value, scale) =>
        `<div class="range-heading"><label for="${id}">${label}</label><output id="${id}Out" for="${id}"></output></div>` +
        `<input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}">` +
        `<div class="range-scale" aria-hidden="true">${scale.map(s => `<span>${s}</span>`).join('')}</div>`;

    function buildControls() {
        controlArea.innerHTML = state.mode === 'induce'
            ? slider('bRange', '자기장의 세기 B', 0.1, 1, 0.1, state.B, ['0.1', '0.5', '1.0 T']) +
              slider('vRange', '도선의 속력 v', 0, 10, 0.5, state.v, ['0', '5', '10 m/s']) +
              slider('rRange', '회로의 저항 R', 1, 10, 1, state.R, ['1', '5', '10 Ω'])
            : slider('riRange', '전지의 내부 저항 r', 0.5, 5, 0.5, state.r, ['0.5', '2.5', '5 Ω']) +
              slider('reRange', '외부 저항 R', 0.5, 20, 0.5, state.Rext, ['0.5', '10', '20 Ω']);
        [['bRange', 'B'], ['vRange', 'v'], ['rRange', 'R'], ['riRange', 'r'], ['reRange', 'Rext']].forEach(([id, key]) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('input', () => { state[key] = Number(el.value); changed(); });
        });
    }

    const PRED_IND = [{ v: 'more', t: '크다' }, { v: 'near', t: '비슷하다' }, { v: 'less', t: '작다' }];
    const PRED_CIR = [{ v: 'up', t: '커진다' }, { v: 'peak', t: '이미 최대다' }, { v: 'down', t: '작아진다' }];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list = state.mode === 'induce' ? PRED_IND : PRED_CIR;
        predictionLegend.textContent = state.mode === 'induce'
            ? `유도 기전력이 ${EMF_BENCH} V보다 어떨까요?` : 'R을 조금 더 키우면 소비 전력은?';
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.v}">${o.t}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    function arrow(x1, y1, x2, y2, cls) {
        const dx = Math.sign(x2 - x1);
        return `<line class="${cls}" x1="${x1.toFixed(1)}" y1="${y1}" x2="${x2.toFixed(1)}" y2="${y2}"/>` +
               `<path class="${cls}" d="M${(x2 - dx * 7).toFixed(1)},${y2 - 5} L${x2.toFixed(1)},${y2} L${(x2 - dx * 7).toFixed(1)},${y2 + 5}"/>`;
    }

    function renderInduce(a) {
        const moving = a.v > 0.001;
        const rodStart = RAIL_X0 + 60;
        const travel = RAIL_X1 - 30 - rodStart;
        let body = '';
        // the field, pointing into the page
        for (let x = RAIL_X0 + 16; x < RAIL_X1; x += 34) {
            for (let y = RAIL_TOP + 18; y < RAIL_BOT; y += 26) {
                body += `<path class="field-mark" d="M${x - 4},${y - 4} L${x + 4},${y + 4} M${x + 4},${y - 4} L${x - 4},${y + 4}"/>`;
            }
        }
        body += `<line class="rail" x1="${RAIL_X0}" y1="${RAIL_TOP}" x2="${RAIL_X1}" y2="${RAIL_TOP}"/>`;
        body += `<line class="rail" x1="${RAIL_X0}" y1="${RAIL_BOT}" x2="${RAIL_X1}" y2="${RAIL_BOT}"/>`;
        body += `<line class="rail" x1="${RAIL_X0}" y1="${RAIL_TOP}" x2="${RAIL_X0}" y2="${RAIL_BOT}"/>`;
        body += `<rect class="resistor-box" x="${RAIL_X0 - 13}" y="${(RAIL_TOP + RAIL_BOT) / 2 - 16}" width="26" height="32" rx="3"/>`;
        body += `<text class="resistor-text" x="${RAIL_X0}" y="${(RAIL_TOP + RAIL_BOT) / 2 + 4}" text-anchor="middle">${a.R}Ω</text>`;

        // the rod, sliding at the speed that was set
        const dur = moving ? (RAIL_M * (travel / (RAIL_X1 - RAIL_X0)) / a.v).toFixed(3) : 0;
        body += `<g>${moving ? `<animateTransform attributeName="transform" type="translate" from="0 0" to="${travel} 0" dur="${dur}s" repeatCount="indefinite"/>` : ''}` +
                `<line class="rod" x1="${rodStart}" y1="${RAIL_TOP}" x2="${rodStart}" y2="${RAIL_BOT}"/>` +
                (moving ? arrow(rodStart + 8, RAIL_TOP - 14, rodStart + 44, RAIL_TOP - 14, 'motion-arrow') : '') +
                (moving ? arrow(rodStart - 8, RAIL_BOT + 12, rodStart - 44, RAIL_BOT + 12, 'force-arrow') : '') +
                `</g>`;

        // current running round the loop, faster when there is more of it
        if (a.current > 0.001) {
            const per = Math.max(0.5, 3.2 / a.current);
            const loop = `M${RAIL_X0},${(RAIL_TOP + RAIL_BOT) / 2} L${RAIL_X0},${RAIL_TOP} L${RAIL_X1 - 30},${RAIL_TOP} ` +
                         `L${RAIL_X1 - 30},${RAIL_BOT} L${RAIL_X0},${RAIL_BOT} L${RAIL_X0},${(RAIL_TOP + RAIL_BOT) / 2}`;
            for (let i = 0; i < 6; i += 1) {
                body += `<circle class="current-dot" r="3.4"><animateMotion dur="${per.toFixed(2)}s" repeatCount="indefinite" ` +
                        `begin="${(-i * per / 6).toFixed(2)}s" path="${loop}"/></circle>`;
            }
        }
        let out = `<g clip-path="url(#railClip)">${body}</g>`;
        out += `<text class="part-label" x="20" y="20">B = ${a.B} T (지면으로 들어감) · L = ${a.L} m · v = ${a.v} m/s</text>`;
        // one legend row, then the readings, each on its own line
        out += `<text class="small-label" x="20" y="180"><tspan fill="#059669">초록 = 미는 방향</tspan>` +
               `<tspan fill="#8fa8b0">  ·  </tspan><tspan fill="#ff7d6b">빨강 = 유도 전류가 만드는 방해하는 힘</tspan></text>`;
        out += `<text class="read-text" x="20" y="196">ε = ${a.B}×${a.L}×${a.v} = ${a.emf.toFixed(2)} V · I = ${a.current.toFixed(3)} A · F = ${a.force.toFixed(3)} N</text>`;
        out += `<text class="note-text" x="20" y="209">${moving ? `도선이 실제 속력으로 움직입니다 (${RAIL_M} m 구간)` : '도선이 멈춰 있어 자기장 변화가 없고 전류도 흐르지 않습니다'}</text>`;
        mainGroup.innerHTML = out;
    }

    function renderCircuit(a) {
        // sits high enough that the voltmeter below it clears the readings
        const L = 90, R = 380, T = 52, Bm = 146;
        let body = '';
        body += `<path class="wire" d="M${L},${T} L${R},${T} L${R},${Bm} L${L},${Bm} L${L},${T}"/>`;
        // the cell and the resistance hiding inside it
        body += `<rect class="battery-box" x="${L - 26}" y="${(T + Bm) / 2 - 46}" width="52" height="92" rx="6"/>`;
        body += `<line class="cell-long" x1="${L - 14}" y1="${(T + Bm) / 2 - 26}" x2="${L + 14}" y2="${(T + Bm) / 2 - 26}"/>`;
        body += `<line class="cell-short" x1="${L - 7}" y1="${(T + Bm) / 2 - 18}" x2="${L + 7}" y2="${(T + Bm) / 2 - 18}"/>`;
        body += `<text class="small-label" x="${L + 20}" y="${(T + Bm) / 2 - 22}">ε ${a.emf} V</text>`;
        body += `<rect class="resistor-box" x="${L - 15}" y="${(T + Bm) / 2 + 6}" width="30" height="22" rx="3"/>`;
        body += `<text class="resistor-text" x="${L}" y="${(T + Bm) / 2 + 21}" text-anchor="middle">r ${a.r}Ω</text>`;
        body += `<text class="small-label" x="${L}" y="${(T + Bm) / 2 + 56}" text-anchor="middle">전지 속</text>`;
        // the load
        body += `<rect class="resistor-box" x="${R - 20}" y="${(T + Bm) / 2 - 20}" width="40" height="40" rx="4"/>`;
        body += `<text class="resistor-text" x="${R}" y="${(T + Bm) / 2 + 4}" text-anchor="middle">R ${a.R}Ω</text>`;
        // meters
        body += `<rect class="meter" x="${(L + R) / 2 - 46}" y="${T - 20}" width="92" height="26" rx="5"/>`;
        body += `<text class="meter-text" x="${(L + R) / 2}" y="${T - 2}" text-anchor="middle">I = ${a.current.toFixed(2)} A</text>`;
        body += `<rect class="meter" x="${(L + R) / 2 - 56}" y="${Bm + 8}" width="112" height="26" rx="5"/>`;
        body += `<text class="meter-text" x="${(L + R) / 2}" y="${Bm + 26}" text-anchor="middle">단자 전압 ${a.terminal.toFixed(2)} V</text>`;
        // charge drifting round the loop at a rate set by the current
        const per = Math.max(0.6, 6 / a.current);
        const loop = `M${L},${(T + Bm) / 2} L${L},${T} L${R},${T} L${R},${Bm} L${L},${Bm} L${L},${(T + Bm) / 2}`;
        for (let i = 0; i < 8; i += 1) {
            body += `<circle class="current-dot" r="3.2"><animateMotion dur="${per.toFixed(2)}s" repeatCount="indefinite" ` +
                    `begin="${(-i * per / 8).toFixed(2)}s" path="${loop}"/></circle>`;
        }
        let out = `<g clip-path="url(#railClip)">${body}</g>`;
        out += `<text class="part-label" x="20" y="20">기전력 ${a.emf} V · 내부 저항 ${a.r} Ω · 외부 저항 ${a.R} Ω</text>`;
        out += `<text class="read-text" x="20" y="192">외부 소비 전력 ${a.pExt.toFixed(2)} W (최대 가능 ${a.best.toFixed(2)} W)</text>`;
        out += `<text class="note-text" x="20" y="208">내부에서 ${a.pInt.toFixed(2)} W가 열로 버려집니다 · 효율 ${a.efficiency.toFixed(0)}%</text>`;
        mainGroup.innerHTML = out;
    }

    /* ------------------------------------------------------------ graphs */
    function frame(xTicks, yTicks, xTitle, yTitle) {
        let out = '';
        yTicks.forEach(([v, y]) => {
            out += `<line class="grid-line" x1="${GRAPH.x0}" y1="${y.toFixed(1)}" x2="${GRAPH.x1}" y2="${y.toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(y + 3).toFixed(1)}" text-anchor="end">${v}</text>`;
        });
        xTicks.forEach(([v, x]) => {
            out += `<text class="axis-text" x="${x.toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${v}</text>`;
        });
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-title" x="${((GRAPH.x0 + GRAPH.x1) / 2).toFixed(1)}" y="${GRAPH.y0 + 32}" text-anchor="middle">${xTitle}</text>`;
        out += `<text class="axis-title" x="22" y="22">${yTitle}</text>`;
        return out;
    }

    function graphInduce(a) {
        const eMax = 1 * ROD_L * 10 * 1.1;
        const gx = v => GRAPH.x0 + (v / 10) * (GRAPH.x1 - GRAPH.x0);
        const gy = e => GRAPH.y0 - (e / eMax) * (GRAPH.y0 - GRAPH.y1);
        let out = frame([0, 2.5, 5, 7.5, 10].map(v => [v, gx(v)]),
                        [0, 1, 2, 3, 4].map(e => [e, gy(e)]), '도선의 속력 v (m/s)', '유도 기전력 (V)');
        out += `<line class="bench-line" x1="${GRAPH.x0}" y1="${gy(EMF_BENCH).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(EMF_BENCH).toFixed(1)}"/>`;
        // at the left end: the curve labels are anchored to the right end
        out += `<text class="bench-text" x="${GRAPH.x0 + 4}" y="${(gy(EMF_BENCH) - 5).toFixed(1)}">${EMF_BENCH} V</text>`;
        [0.2, 0.5, 1].forEach(b => {
            const on = Math.abs(b - a.B) < 1e-9;
            out += `<path class="trace" style="stroke:${on ? '#d97706' : 'rgba(217, 119, 6, .28)'}" ` +
                   `d="M${gx(0).toFixed(1)},${gy(0).toFixed(1)}L${gx(10).toFixed(1)},${gy(b * ROD_L * 10).toFixed(1)}"/>`;
            out += `<text class="axis-text" style="fill:${on ? '#d97706' : '#7f9298'}" x="${GRAPH.x1 - 4}" y="${(gy(b * ROD_L * 10) + 12).toFixed(1)}" text-anchor="end">B ${b} T</text>`;
        });
        if (!([0.2, 0.5, 1].some(b => Math.abs(b - a.B) < 1e-9))) {
            out += `<path class="trace" d="M${gx(0).toFixed(1)},${gy(0).toFixed(1)}L${gx(10).toFixed(1)},${gy(a.B * ROD_L * 10).toFixed(1)}"/>`;
        }
        out += `<circle class="trace-dot" cx="${gx(a.v).toFixed(1)}" cy="${gy(a.emf).toFixed(1)}" r="5" fill="#d97706"/>`;
        graphGroup.innerHTML = out;
    }

    function graphCircuit(a) {
        const rMax = 20;
        const pMax = a.best * 1.18;
        const gx = R => GRAPH.x0 + (R / rMax) * (GRAPH.x1 - GRAPH.x0);
        const gy = p => GRAPH.y0 - (p / pMax) * (GRAPH.y0 - GRAPH.y1);
        let out = frame([0, 5, 10, 15, 20].map(v => [v, gx(v)]),
                        [0, 1, 2, 3].map(i => [((pMax / 3) * i).toFixed(0), gy((pMax / 3) * i)]),
                        '외부 저항 R (Ω)', '외부 소비 전력 (W)');
        const pts = [];
        for (let R = 0.1; R <= rMax + 1e-9; R += 0.1) pts.push(`${gx(R).toFixed(1)},${gy(analyseCircuit(a.r, R).pExt).toFixed(1)}`);
        out += `<path class="trace" d="M${pts.join('L')}"/>`;
        out += `<line class="peak-line" x1="${gx(a.r).toFixed(1)}" y1="${GRAPH.y1}" x2="${gx(a.r).toFixed(1)}" y2="${GRAPH.y0}"/>`;
        out += `<text class="peak-text" x="${(gx(a.r) + 5).toFixed(1)}" y="${GRAPH.y1 + 10}">R = r 에서 최대</text>`;
        out += `<circle class="trace-dot" cx="${gx(a.R).toFixed(1)}" cy="${gy(a.pExt).toFixed(1)}" r="5" fill="#d97706"/>`;
        graphGroup.innerHTML = out;
    }

    /* ------------------------------------------------------------ render */
    function render() {
        const a = analyse();
        if (a.kind === 'induce') { renderInduce(a); graphInduce(a); } else { renderCircuit(a); graphCircuit(a); }
        [['bRangeOut', `${state.B} T`], ['vRangeOut', `${state.v} m/s`], ['rRangeOut', `${state.R} Ω`],
         ['riRangeOut', `${state.r} Ω`], ['reRangeOut', `${state.Rext} Ω`]].forEach(([id, txt]) => {
            const el = document.getElementById(id); if (el) el.textContent = txt;
        });
        methodHint.textContent = state.mode === 'induce'
            ? 'ε = BLv · 유도 전류는 언제나 변화를 방해합니다'
            : '전지 속 저항 때문에 단자 전압이 기전력보다 낮아집니다';
        stageBadge.textContent = a.kind === 'induce'
            ? `ε ${a.emf.toFixed(2)} V · I ${a.current.toFixed(2)} A`
            : `${a.pExt.toFixed(2)} W · ${VERDICT_C[a.verdict]}`;
        dataNote.innerHTML = a.kind === 'induce'
            ? `<div class="data-row"><span class="data-name">유도 기전력</span><span class="data-val">ε = BLv = ${a.B}×${a.L}×${a.v} = ${a.emf.toFixed(3)} V</span></div>` +
              `<div class="data-row"><span class="data-name">유도 전류</span><span class="data-val">I = ε/R = ${a.emf.toFixed(3)}÷${a.R} = ${a.current.toFixed(3)} A</span></div>` +
              `<div class="data-row"><span class="data-name">방해하는 힘</span><span class="data-val">F = BIL = ${a.force.toFixed(3)} N — 운동 반대쪽</span></div>` +
              `<div class="data-row"><span class="data-name">전력</span><span class="data-val">P = εI = ${a.power.toFixed(3)} W = 미는 데 드는 일률 Fv</span></div>` +
              `<div class="data-row match"><span class="data-name">${EMF_BENCH} V와 견주면</span><span class="data-val">${VERDICT_I[a.verdict]}</span></div>`
            : `<div class="data-row"><span class="data-name">전류</span><span class="data-val">I = ε/(R+r) = ${a.emf}÷(${a.R}+${a.r}) = ${a.current.toFixed(3)} A</span></div>` +
              `<div class="data-row"><span class="data-name">단자 전압</span><span class="data-val">V = ε − Ir = ${a.emf} − ${(a.current * a.r).toFixed(2)} = ${a.terminal.toFixed(2)} V</span></div>` +
              `<div class="data-row"><span class="data-name">외부 소비 전력</span><span class="data-val">I²R = ${a.pExt.toFixed(2)} W</span></div>` +
              `<div class="data-row"><span class="data-name">내부 손실</span><span class="data-val">I²r = ${a.pInt.toFixed(2)} W · 효율 ${a.efficiency.toFixed(0)}%</span></div>` +
              `<div class="data-row match"><span class="data-name">R을 더 키우면</span><span class="data-val">${VERDICT_C[a.verdict]}</span></div>`;
        return a;
    }

    const VERDICT_I = { more: `${EMF_BENCH} V보다 크다`, near: `${EMF_BENCH} V와 비슷하다`, less: `${EMF_BENCH} V보다 작다` };
    const VERDICT_C = { up: '더 커진다', peak: '이미 최대다', down: '작아진다' };

    function check() {
        const a = render();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        if (a.kind === 'induce') {
            labelA.textContent = '유도 기전력'; labelB.textContent = '유도 전류';
            valueA.textContent = `${a.emf.toFixed(2)} V`;
            valueB.textContent = `${a.current.toFixed(3)} A`;
            predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
                : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
            let s = `길이 ${a.L} m 인 도선이 ${a.B} T 의 자기장 속을 ${a.v} m/s로 지나므로 ε = BLv = ${a.emf.toFixed(2)} V 입니다. `;
            if (a.v === 0) {
                s = `도선이 멈춰 있으면 자기장이 변하지 않습니다. 자기장이 아무리 세도 ε = BLv = 0 이므로 전류가 흐르지 않습니다. 유도 전류를 만드는 것은 자기장이 아니라 자기장의 변화입니다.`;
            } else {
                s += `${a.R} Ω 회로에 I = ε/R = ${a.current.toFixed(3)} A가 흐르고, 이 전류가 자기장 속에서 F = BIL = ${a.force.toFixed(3)} N 의 힘을 받습니다. `;
                s += `이 힘은 렌츠 법칙에 따라 언제나 운동을 방해하는 쪽입니다. 도선을 계속 밀려면 이 힘을 이겨야 하고, 그때 한 일 Fv = ${(a.force * a.v).toFixed(3)} W가 그대로 전기 에너지 εI = ${a.power.toFixed(3)} W가 됩니다. `;
                s += `속력을 2배로 하면 기전력도 2배가 되지만, 전력은 ε²/R 이라 4배가 됩니다.`;
            }
            explanation.textContent = s;
            return;
        }
        labelA.textContent = '외부 소비 전력'; labelB.textContent = '단자 전압';
        valueA.textContent = `${a.pExt.toFixed(2)} W`;
        valueB.textContent = `${a.terminal.toFixed(2)} V`;
        predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        let s = `I = ε/(R+r) = ${a.emf}÷(${a.R}+${a.r}) = ${a.current.toFixed(3)} A가 흐릅니다. `;
        s += `내부 저항에서 ${(a.current * a.r).toFixed(2)} V가 걸려 단자 전압은 ${a.emf} − ${(a.current * a.r).toFixed(2)} = ${a.terminal.toFixed(2)} V로 기전력보다 낮습니다. `;
        s += `외부에서 쓰는 전력은 I²R = ${a.pExt.toFixed(2)} W 이고, 이 전지가 낼 수 있는 최대값은 R = r = ${a.r} Ω 일 때의 ${a.best.toFixed(2)} W 입니다. `;
        if (a.verdict === 'peak') s += `지금이 바로 그 최대점입니다. R을 키우든 줄이든 전력은 떨어집니다. 대신 효율은 ${a.efficiency.toFixed(0)}%로 절반뿐입니다.`;
        else if (a.verdict === 'up') s += `지금 R이 r보다 작아 전류는 크지만 R에 걸리는 전압이 낮습니다. R을 키우면 전력이 더 올라갑니다.`;
        else s += `지금 R이 r보다 커서 전압은 높지만 전류가 작습니다. R을 더 키우면 전력은 오히려 떨어집니다. 다만 효율은 ${a.efficiency.toFixed(0)}%로 높아집니다.`;
        explanation.textContent = s;
    }

    function changed() {
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
        stageCaption.textContent = state.mode === 'induce'
            ? '도선이 받는 힘은 언제나 움직임을 방해하는 쪽입니다.'
            : '전지 안에서도 전력이 열로 버려집니다.';
        changed();
    }));
    checkBtn.addEventListener('click', check);
    resetBtn.addEventListener('click', () => {
        Object.assign(state, { B: 0.5, v: 4, R: 4, r: 2, Rext: 4, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'induce').click();
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

    window.__emfModel = {
        ROD_L, RAIL_M, EMF_BENCH, EMF_SOURCE, state, analyseInduce, analyseCircuit, analyse, render, check,
        setMode(m) { modeButtons.find(b => b.dataset.mode === m).click(); },
        set(key, value) { state[key] = value; buildControls(); changed(); },
    };

    resetBtn.click();
});
