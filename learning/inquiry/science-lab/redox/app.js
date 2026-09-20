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

    const FARADAY = 96485;          // coulombs per mole of electrons
    const MOLAR_VOL = 22.4;         // litres per mole of gas at STP
    const E_BENCH = 0.05;           // moles of electrons we compare against
    const GRAPH = { x0: 78, x1: 424, y0: 158, y1: 30 };

    // Standard reduction potentials, volts.
    const METALS = {
        mg: { name: '마그네슘', sym: 'Mg', E: -2.37, n: 2, M: 24.3, colour: '#c9d4d8' },
        zn: { name: '아연', sym: 'Zn', E: -0.76, n: 2, M: 65.4, colour: '#b8c2c8' },
        fe: { name: '철', sym: 'Fe', E: -0.44, n: 2, M: 55.8, colour: '#9aa6ad' },
        cu: { name: '구리', sym: 'Cu', E: 0.34, n: 2, M: 63.5, colour: '#c8783c' },
        ag: { name: '은', sym: 'Ag', E: 0.80, n: 1, M: 107.9, colour: '#dfe7ea' },
    };
    const BATHS = {
        cu: { label: '황산 구리 수용액', out: '구리', sym: 'Cu', n: 2, M: 63.5, gas: false, colour: '#c8783c' },
        ag: { label: '질산 은 수용액', out: '은', sym: 'Ag', n: 1, M: 107.9, gas: false, colour: '#dfe7ea' },
        water: { label: '물 (묽은 황산)', out: '수소와 산소', sym: 'H₂', n: 2, M: 2.02, gas: true, colour: '#0284c7' },
    };

    const state = { mode: 'cell', a: 'zn', b: 'cu', bath: 'cu', I: 2, mins: 30, prediction: null };

    /* ------------------------------------------------------------ models */
    // The lower standard potential is oxidised; the gap is the cell voltage.
    function analyseCell(ak = state.a, bk = state.b) {
        const A = METALS[ak], B = METALS[bk];
        const same = Math.abs(A.E - B.E) < 1e-12;
        const anode = A.E <= B.E ? A : B;          // gives up electrons
        const cathode = A.E <= B.E ? B : A;
        const emf = cathode.E - anode.E;
        const verdict = same ? 'none' : anode === A ? 'a' : 'b';
        return { kind: 'cell', A, B, ak, bk, same, anode, cathode, emf, verdict };
    }

    // Faraday: charge fixes the moles of electrons, valence fixes the product.
    function analyseElec(bathKey = state.bath, I = state.I, mins = state.mins) {
        const b = BATHS[bathKey];
        const seconds = mins * 60;
        const charge = I * seconds;
        const eMol = charge / FARADAY;
        const molOut = eMol / b.n;                  // moles of metal, or of H2
        const mass = molOut * b.M;
        const h2 = eMol / 2, o2 = eMol / 4;         // 2H2O -> 2H2 + O2
        const verdict = eMol > E_BENCH * 1.1 ? 'more' : eMol < E_BENCH / 1.1 ? 'less' : 'near';
        return { kind: 'elec', b, bathKey, I, mins, seconds, charge, eMol, molOut, mass,
                 h2, o2, h2L: h2 * MOLAR_VOL, o2L: o2 * MOLAR_VOL, verdict };
    }

    const analyse = () => (state.mode === 'cell' ? analyseCell() : analyseElec());

    /* ---------------------------------------------------------- controls */
    function metalRow(which) {
        return `<fieldset class="pick-field"><legend>금속 ${which === 'a' ? 'A (왼쪽)' : 'B (오른쪽)'}</legend>` +
            `<div class="pick-buttons" data-pick="${which}">` +
            Object.entries(METALS).map(([k, m]) =>
                `<button type="button" data-value="${k}" class="${state[which] === k ? 'selected' : ''}">${m.sym}<small>${m.E.toFixed(2)}V</small></button>`).join('') +
            `</div></fieldset>`;
    }

    function buildControls() {
        controlArea.innerHTML = state.mode === 'cell'
            ? metalRow('a') + metalRow('b')
            : `<fieldset class="pick-field"><legend>전기 분해할 것</legend><div class="pick-buttons cols3" data-pick="bath">` +
              Object.entries(BATHS).map(([k, b]) =>
                  `<button type="button" data-value="${k}" class="${state.bath === k ? 'selected' : ''}">${b.sym}<small>${b.n}가</small></button>`).join('') +
              `</div></fieldset>` +
              `<div class="range-heading"><label for="iRange">전류</label><output id="iRangeOut" for="iRange"></output></div>` +
              `<input id="iRange" type="range" min="0.5" max="5" step="0.5" value="${state.I}">` +
              `<div class="range-scale" aria-hidden="true"><span>0.5A</span><span>2.75A</span><span>5A</span></div>` +
              `<div class="range-heading amount-heading"><label for="tRange">시간</label><output id="tRangeOut" for="tRange"></output></div>` +
              `<input id="tRange" type="range" min="10" max="120" step="10" value="${state.mins}">` +
              `<div class="range-scale" aria-hidden="true"><span>10분</span><span>65분</span><span>120분</span></div>`;
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                changed();
            }));
        });
        [['iRange', 'I'], ['tRange', 'mins']].forEach(([id, key]) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('input', () => { state[key] = Number(el.value); changed(); });
        });
    }

    const PRED_CELL = [{ v: 'a', t: '금속 A' }, { v: 'none', t: '반응 없음' }, { v: 'b', t: '금속 B' }];
    const PRED_ELEC = [{ v: 'more', t: '많다' }, { v: 'near', t: '비슷하다' }, { v: 'less', t: '적다' }];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list = state.mode === 'cell' ? PRED_CELL : PRED_ELEC;
        predictionLegend.textContent = state.mode === 'cell'
            ? '산화되는 (−)극은 어느 쪽일까요?' : `흐른 전자가 ${E_BENCH} mol보다?`;
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.v}">${o.t}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    function renderCell(a) {
        const LB = { x0: 52, x1: 158 }, RB = { x0: 262, x1: 368 };
        const TOP = 84, BOT = 178, LIQ = 100;
        let body = '';
        [[LB, a.A], [RB, a.B]].forEach(([bk, m]) => {
            body += `<rect class="solution" fill="${m.colour}" opacity=".22" x="${bk.x0 + 3}" y="${LIQ}" width="${bk.x1 - bk.x0 - 6}" height="${BOT - LIQ - 3}"/>`;
            body += `<path class="glass" d="M${bk.x0},${TOP} L${bk.x0},${BOT} L${bk.x1},${BOT} L${bk.x1},${TOP}"/>`;
            const ex = (bk.x0 + bk.x1) / 2;
            body += `<rect class="electrode" fill="${m.colour}" x="${ex - 6}" y="56" width="12" height="${BOT - 68}" rx="2"/>`;
            body += `<text class="small-label" x="${ex}" y="${BOT + 12}" text-anchor="middle">${m.name} ${m.sym}</text>`;
        });
        // salt bridge over the top
        body += `<path class="bridge" d="M${(LB.x0 + LB.x1) / 2 + 26},${LIQ + 6} L${(LB.x0 + LB.x1) / 2 + 26},${TOP - 8} L${(RB.x0 + RB.x1) / 2 - 26},${TOP - 8} L${(RB.x0 + RB.x1) / 2 - 26},${LIQ + 6}"/>`;
        body += `<text class="small-label" x="210" y="${TOP - 14}" text-anchor="middle">염다리</text>`;
        // wire and meter
        const lx = (LB.x0 + LB.x1) / 2, rx = (RB.x0 + RB.x1) / 2;
        body += `<path class="wire" d="M${lx},56 L${lx},36 L${rx},36 L${rx},56"/>`;
        body += `<rect class="meter" x="176" y="22" width="68" height="26" rx="5"/>`;
        body += `<text class="meter-text" x="210" y="40" text-anchor="middle">${a.emf.toFixed(2)} V</text>`;
        // electrons run out of the metal that is oxidised
        if (!a.same) {
            const toRight = a.anode === a.A;
            const path = toRight ? `M${lx},50 L${lx},36 L${rx},36 L${rx},50` : `M${rx},50 L${rx},36 L${lx},36 L${lx},50`;
            for (let i = 0; i < 5; i += 1) {
                body += `<circle class="electron" r="3"><animateMotion dur="2.4s" repeatCount="indefinite" ` +
                        `begin="${(-i * 0.48).toFixed(2)}s" path="${path}"/></circle>`;
            }
        }
        let out = `<g clip-path="url(#cellClip)">${body}</g>`;
        if (!a.same) {
            const anodeX = a.anode === a.A ? lx : rx, cathodeX = a.anode === a.A ? rx : lx;
            out += `<text class="pole-text minus" x="${anodeX}" y="72" text-anchor="middle">(−) 산화</text>`;
            out += `<text class="pole-text plus" x="${cathodeX}" y="72" text-anchor="middle">(+) 환원</text>`;
        }
        // nothing extra when the metals match: the reading below already says so,
        // and a second message here lands on the salt bridge label
        out += `<text class="part-label" x="20" y="18">${a.A.sym} (${a.A.E.toFixed(2)} V)와 ${a.B.sym} (${a.B.E.toFixed(2)} V)</text>`;
        out += `<text class="read-text" x="20" y="209">${a.same ? '전위 차이가 0 이라 전류가 흐르지 않습니다'
            : `${a.anode.sym}이 산화되어 (−)극 · 기전력 ${a.emf.toFixed(2)} V`}</text>`;
        mainGroup.innerHTML = out;
    }

    function renderElec(a) {
        const BK = { x0: 130, x1: 300 }, TOP = 62, BOT = 178, LIQ = 78;
        let body = '';
        body += `<rect class="solution" fill="${a.b.colour}" opacity=".2" x="${BK.x0 + 3}" y="${LIQ}" width="${BK.x1 - BK.x0 - 6}" height="${BOT - LIQ - 3}"/>`;
        body += `<path class="glass" d="M${BK.x0},${TOP} L${BK.x0},${BOT} L${BK.x1},${BOT} L${BK.x1},${TOP}"/>`;
        const lx = BK.x0 + 40, rx = BK.x1 - 40;
        [[lx, '(+) 산화'], [rx, '(−) 환원']].forEach(([x]) => {
            body += `<rect class="electrode" fill="#8a949a" x="${x - 6}" y="40" width="12" height="${BOT - 54}" rx="2"/>`;
        });
        // what collects on the negative electrode
        const grow = Math.min(1, a.mass / 4);
        if (!a.b.gas) {
            const w = 8 + 16 * grow;
            body += `<rect class="deposit" fill="${a.b.colour}" x="${(rx - w / 2).toFixed(1)}" y="${(BOT - 20 - 60 * grow).toFixed(1)}" ` +
                    `width="${w.toFixed(1)}" height="${(60 * grow + 14).toFixed(1)}" rx="3"/>`;
        } else {
            for (let i = 0; i < 8; i += 1) {
                body += `<circle class="bubble" cx="${rx + (i % 2 ? 9 : -9)}" cy="${BOT - 20 - (i * 13) % 90}" r="${2.4 + (i % 3) * 0.6}">` +
                        `<animate attributeName="cy" values="${BOT - 16};${LIQ + 6}" dur="1.7s" begin="${(i * 0.2).toFixed(1)}s" repeatCount="indefinite"/></circle>`;
                if (i < 4) body += `<circle class="bubble" cx="${lx + (i % 2 ? 8 : -8)}" cy="${BOT - 30}" r="2.2">` +
                        `<animate attributeName="cy" values="${BOT - 16};${LIQ + 6}" dur="1.7s" begin="${(i * 0.4).toFixed(1)}s" repeatCount="indefinite"/></circle>`;
            }
        }
        // battery driving it
        body += `<path class="wire" d="M${lx},40 L${lx},26 L${rx},26 L${rx},40"/>`;
        body += `<line class="battery-long" x1="${205}" y1="18" x2="${205}" y2="34"/>`;
        body += `<line class="battery-short" x1="${213}" y1="22" x2="${213}" y2="30"/>`;
        body += `<text class="small-label" x="228" y="30">${a.I} A</text>`;

        let out = `<g clip-path="url(#cellClip)">${body}</g>`;
        out += `<text class="pole-text plus" x="${lx}" y="${BOT + 12}" text-anchor="middle">(+)</text>`;
        out += `<text class="pole-text minus" x="${rx}" y="${BOT + 12}" text-anchor="middle">(−)</text>`;
        out += `<text class="part-label" x="20" y="18">${a.b.label} · ${a.I} A · ${a.mins} 분</text>`;
        out += `<text class="note-text" x="316" y="76">전기량 ${a.charge.toFixed(0)} C</text>`;
        out += `<text class="note-text" x="316" y="94">전자 ${a.eMol.toFixed(4)} mol</text>`;
        if (a.b.gas) {
            out += `<text class="note-text" x="316" y="112">수소 ${a.h2.toFixed(4)} mol</text>`;
            out += `<text class="note-text" x="316" y="130">산소 ${a.o2.toFixed(4)} mol</text>`;
            out += `<text class="read-text" x="20" y="209">수소 ${a.h2L.toFixed(2)} L · 산소 ${a.o2L.toFixed(2)} L — 부피비 2 : 1</text>`;
        } else {
            out += `<text class="note-text" x="316" y="112">${a.b.out} ${a.molOut.toFixed(4)} mol</text>`;
            out += `<text class="note-text" x="316" y="130">${a.b.sym}${a.b.n === 1 ? '⁺' : '²⁺'} + ${a.b.n}e⁻ → ${a.b.sym}</text>`;
            out += `<text class="read-text" x="20" y="209">${a.b.out} ${a.mass.toFixed(3)} g이 (−)극에 석출됩니다</text>`;
        }
        mainGroup.innerHTML = out;
    }

    /* ------------------------------------------------------------ graphs */
    function graphCell(a) {
        const LO = -2.6, HI = 1.1;
        const gy = e => GRAPH.y0 - ((e - LO) / (HI - LO)) * (GRAPH.y0 - GRAPH.y1);
        let out = '';
        [-2, -1, 0, 1].forEach(v => {
            out += `<line class="grid-line" x1="${GRAPH.x0}" y1="${gy(v).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(v).toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(gy(v) + 3).toFixed(1)}" text-anchor="end">${v.toFixed(1)}</text>`;
        });
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-title" x="22" y="20">표준 환원 전위 (V)</text>`;
        if (!a.same) {
            out += `<rect class="gap-band" x="${GRAPH.x0}" y="${gy(a.cathode.E).toFixed(1)}" width="${GRAPH.x1 - GRAPH.x0}" ` +
                   `height="${(gy(a.anode.E) - gy(a.cathode.E)).toFixed(1)}"/>`;
            // inside the band on the left: the rung captions occupy the right
            out += `<text class="gap-text" x="${GRAPH.x0 + 6}" y="${((gy(a.cathode.E) + gy(a.anode.E)) / 2 + 3).toFixed(1)}">` +
                   `차이 ${a.emf.toFixed(2)} V = 기전력</text>`;
        }
        // Zinc and iron sit only 11 px apart on this scale, so labels are laid
        // out top down with a floor on the spacing and led back to their rung.
        const sorted = Object.values(METALS).slice().sort((p, q) => q.E - p.E);
        let lastY = -Infinity;
        sorted.forEach(m => {
            const ry = gy(m.E);
            const ly = Math.max(ry, lastY + 13);
            lastY = ly;
            const on = m === a.A || m === a.B;
            out += `<line class="rung${on ? ' on' : ''}" x1="${GRAPH.x0}" y1="${ry.toFixed(1)}" x2="${GRAPH.x0 + 120}" y2="${ry.toFixed(1)}"/>`;
            if (Math.abs(ly - ry) > 0.5) {
                out += `<line class="rung" x1="${GRAPH.x0 + 120}" y1="${ry.toFixed(1)}" x2="${GRAPH.x0 + 128}" y2="${ly.toFixed(1)}"/>`;
            }
            out += `<text class="rung-text" fill="${on ? '#d97706' : '#7f9298'}" x="${GRAPH.x0 + 132}" y="${(ly + 3.5).toFixed(1)}">` +
                   `${m.name} ${m.sym} ${m.E > 0 ? '+' : ''}${m.E.toFixed(2)} V` +
                   `${!a.same && m === a.anode ? ' ← 산화 (−)' : ''}${!a.same && m === a.cathode ? ' ← 환원 (+)' : ''}</text>`;
        });
        out += `<text class="axis-text" x="${GRAPH.x0}" y="${GRAPH.y0 + 16}">아래로 갈수록 산화되기 쉬움</text>`;
        graphGroup.innerHTML = out;
    }

    function graphElec(a) {
        const rows = [
            ['구리 Cu (2가)', (a.eMol / 2) * 63.5, '#c8783c'],
            ['은 Ag (1가)', (a.eMol / 1) * 107.9, '#dfe7ea'],
            ['수소 H₂ (2가)', (a.eMol / 2) * 2.02, '#0284c7'],
            ['산소 O₂ (4가)', (a.eMol / 4) * 32.0, '#059669'],
        ];
        const max = Math.max(...rows.map(r => r[1])) * 1.18 || 1;
        const gx = m => GRAPH.x0 + (m / max) * (GRAPH.x1 - GRAPH.x0);
        let out = '';
        for (let i = 0; i <= 4; i += 1) {
            const m = (max / 4) * i;
            out += `<line class="grid-line" x1="${gx(m).toFixed(1)}" y1="${GRAPH.y1}" x2="${gx(m).toFixed(1)}" y2="${GRAPH.y0}"/>`;
            out += `<text class="axis-text" x="${gx(m).toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${m.toFixed(1)}</text>`;
        }
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-title" x="${((GRAPH.x0 + GRAPH.x1) / 2).toFixed(1)}" y="${GRAPH.y0 + 32}" text-anchor="middle">같은 전기량으로 얻는 질량 (g)</text>`;
        out += `<text class="axis-title" x="22" y="20">전자 ${a.eMol.toFixed(4)} mol이 흘렀을 때</text>`;
        rows.forEach(([name, mass, colour], i) => {
            const y = GRAPH.y1 + 26 + i * 30;
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(y + 4).toFixed(1)}" text-anchor="end">${name}</text>`;
            out += `<rect class="bar" x="${GRAPH.x0}" y="${y - 6}" width="${Math.max(2, gx(mass) - GRAPH.x0).toFixed(1)}" height="13" rx="3" fill="${colour}" opacity=".85"/>`;
            const flip = gx(mass) > GRAPH.x1 - 60;
            out += `<text class="bar-text" style="fill:${flip ? '#ffffff' : colour}" x="${(gx(mass) + (flip ? -6 : 6)).toFixed(1)}" y="${(y + 4).toFixed(1)}"${flip ? ' text-anchor="end"' : ''}>${mass.toFixed(3)} g</text>`;
        });
        graphGroup.innerHTML = out;
    }

    /* ------------------------------------------------------------ render */
    function render() {
        const a = analyse();
        if (a.kind === 'cell') { renderCell(a); graphCell(a); } else { renderElec(a); graphElec(a); }
        const i = document.getElementById('iRangeOut');
        if (i) i.textContent = `${state.I} A`;
        const t = document.getElementById('tRangeOut');
        if (t) t.textContent = `${state.mins} 분`;
        methodHint.textContent = state.mode === 'cell'
            ? '표준 환원 전위가 낮은 금속이 산화됩니다'
            : '전기량이 전자의 몰수를 정합니다';
        stageBadge.textContent = a.kind === 'cell'
            ? (a.same ? '전위 차이 없음' : `${a.anode.sym} 산화 · ${a.emf.toFixed(2)} V`)
            : `전자 ${a.eMol.toFixed(4)} mol`;
        dataNote.innerHTML = a.kind === 'cell'
            ? `<div class="data-row"><span class="data-name">표준 환원 전위</span><span class="data-val">${a.A.sym} ${a.A.E.toFixed(2)} V · ${a.B.sym} ${a.B.E.toFixed(2)} V</span></div>` +
              `<div class="data-row"><span class="data-name">(−)극 · 산화</span><span class="data-val">${a.same ? '없음' : `${a.anode.name} → ${a.anode.sym}${a.anode.n === 1 ? '⁺' : '²⁺'} + ${a.anode.n}e⁻`}</span></div>` +
              `<div class="data-row"><span class="data-name">(+)극 · 환원</span><span class="data-val">${a.same ? '없음' : `${a.cathode.sym}${a.cathode.n === 1 ? '⁺' : '²⁺'} + ${a.cathode.n}e⁻ → ${a.cathode.name}`}</span></div>` +
              `<div class="data-row"><span class="data-name">기전력</span><span class="data-val">${a.same ? '0 V' : `${a.cathode.E.toFixed(2)} − (${a.anode.E.toFixed(2)}) = ${a.emf.toFixed(2)} V`}</span></div>` +
              `<div class="data-row match"><span class="data-name">결과</span><span class="data-val">${a.same ? '전류가 흐르지 않습니다' : `전자는 ${a.anode.sym} 에서 ${a.cathode.sym} 쪽으로 흐릅니다`}</span></div>`
            : `<div class="data-row"><span class="data-name">전기량</span><span class="data-val">${a.I} A × ${a.seconds.toLocaleString()} 초 = ${a.charge.toFixed(0)} C</span></div>` +
              `<div class="data-row"><span class="data-name">전자의 몰수</span><span class="data-val">${a.charge.toFixed(0)} ÷ 96485 = ${a.eMol.toFixed(4)} mol</span></div>` +
              (a.b.gas
                  ? `<div class="data-row"><span class="data-name">수소</span><span class="data-val">${a.eMol.toFixed(4)} ÷ 2 = ${a.h2.toFixed(4)} mol · ${a.h2L.toFixed(2)} L</span></div>` +
                    `<div class="data-row"><span class="data-name">산소</span><span class="data-val">${a.eMol.toFixed(4)} ÷ 4 = ${a.o2.toFixed(4)} mol · ${a.o2L.toFixed(2)} L</span></div>` +
                    `<div class="data-row match"><span class="data-name">부피비</span><span class="data-val">${a.h2L.toFixed(2)} : ${a.o2L.toFixed(2)} = 2 : 1</span></div>`
                  : `<div class="data-row"><span class="data-name">${a.b.out}의 몰수</span><span class="data-val">${a.eMol.toFixed(4)} ÷ ${a.b.n} = ${a.molOut.toFixed(4)} mol</span></div>` +
                    `<div class="data-row"><span class="data-name">질량</span><span class="data-val">${a.molOut.toFixed(4)} × ${a.b.M} = ${a.mass.toFixed(3)} g</span></div>` +
                    `<div class="data-row match"><span class="data-name">${E_BENCH} mol과 견주면</span><span class="data-val">${E_WORD[a.verdict]}</span></div>`);
        return a;
    }

    const E_WORD = { more: '전자가 더 많이 흘렀습니다', near: '전자가 비슷하게 흘렀습니다', less: '전자가 적게 흘렀습니다' };

    function check() {
        const a = render();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        if (a.kind === 'cell') {
            labelA.textContent = '산화되는 극'; labelB.textContent = '기전력';
            valueA.textContent = a.same ? '없음' : `${a.anode.name} (−)`;
            valueB.textContent = `${a.emf.toFixed(2)} V`;
            predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
                : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
            explanation.textContent = a.same
                ? `두 쪽 모두 ${a.A.name}이라 표준 환원 전위가 ${a.A.E.toFixed(2)} V로 같습니다. 전위 차이가 0 이므로 어느 쪽도 상대에게 전자를 내주지 않고 전류도 흐르지 않습니다. 전지가 되려면 서로 다른 금속이어야 합니다.`
                : `${a.anode.name}의 표준 환원 전위는 ${a.anode.E.toFixed(2)} V, ${a.cathode.name}은 ${a.cathode.E.toFixed(2)} V 입니다. ` +
                  `낮은 쪽인 ${a.anode.name}이 전자를 내놓고 산화되어 (−)극이 되고, ${a.cathode.name}쪽에서는 이온이 전자를 받아 환원됩니다. ` +
                  `기전력은 두 전위의 차이인 ${a.cathode.E.toFixed(2)} − (${a.anode.E.toFixed(2)}) = ${a.emf.toFixed(2)} V 입니다. ` +
                  `전자는 도선을 따라 ${a.anode.sym} 에서 ${a.cathode.sym} 쪽으로 흐르고, 염다리가 전하의 치우침을 막아 반응이 이어지게 해 줍니다.`;
            return;
        }
        labelA.textContent = '전자의 몰수'; labelB.textContent = a.b.gas ? '기체 부피' : '석출량';
        valueA.textContent = `${a.eMol.toFixed(4)} mol`;
        valueB.textContent = a.b.gas ? `H₂ ${a.h2L.toFixed(2)} L` : `${a.mass.toFixed(3)} g`;
        predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        let s = `${a.I} A로 ${a.mins} 분, 곧 ${a.seconds.toLocaleString()} 초 동안 흘렸으므로 전기량은 ${a.charge.toFixed(0)} C 입니다. `;
        s += `이를 패러데이 상수 96485로 나누면 전자 ${a.eMol.toFixed(4)} mol이 흐른 셈입니다. `;
        if (a.b.gas) {
            s += `2H₂O → 2H₂ + O₂ 에서 전자 4몰마다 수소 2몰과 산소 1몰이 나옵니다. ` +
                 `따라서 수소는 ${a.eMol.toFixed(4)} ÷ 2 = ${a.h2.toFixed(4)} mol, 산소는 ${a.eMol.toFixed(4)} ÷ 4 = ${a.o2.toFixed(4)} mol 이고, ` +
                 `부피로는 ${a.h2L.toFixed(2)} L와 ${a.o2L.toFixed(2)} L로 언제나 2 : 1 입니다. `;
        } else {
            s += `${a.b.sym}${a.b.n === 1 ? '⁺' : '²⁺'} 이온이 ${a.b.n} 개의 전자를 받아야 금속이 되므로 ` +
                 `${a.b.out}은 ${a.eMol.toFixed(4)} ÷ ${a.b.n} = ${a.molOut.toFixed(4)} mol, 질량으로는 ${a.mass.toFixed(3)} g이 석출됩니다. `;
            const other = analyseElec(a.bathKey === 'ag' ? 'cu' : 'ag', a.I, a.mins);
            s += `같은 전기량이라도 ${other.b.out}은 ${other.molOut.toFixed(4)} mol로 몰수가 다릅니다. 이온이 받아야 하는 전자 수가 다르기 때문입니다. `;
        }
        s += `전기량이 두 배가 되면 나오는 양도 정확히 두 배가 됩니다.`;
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
        stageCaption.textContent = state.mode === 'cell'
            ? '전자는 산화되는 쪽에서 환원되는 쪽으로 흐릅니다.'
            : '같은 전기량이라도 이온의 전하수에 따라 나오는 양이 다릅니다.';
        changed();
    }));
    checkBtn.addEventListener('click', check);
    resetBtn.addEventListener('click', () => {
        Object.assign(state, { a: 'zn', b: 'cu', bath: 'cu', I: 2, mins: 30, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'cell').click();
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

    window.__redoxModel = {
        FARADAY, MOLAR_VOL, E_BENCH, METALS, BATHS, state,
        analyseCell, analyseElec, analyse, render, check,
        setMode(m) { modeButtons.find(b => b.dataset.mode === m).click(); },
        set(key, value) { state[key] = value; buildControls(); changed(); },
    };

    resetBtn.click();
});

/* 그림 속 문장을 HTML로 내린다. 액자를 벗어나거나 서로 겹치는 글자만 옮기므로
   조건이 바뀌어도 스스로 맞는다. 그림에는 짧은 이름표만 남는다. */
(function () {
    const stageVerdict = document.getElementById('stageVerdict');
    const stageReadout = document.getElementById('stageReadout');
    const stageNote = document.getElementById('stageNote');
    if (!stageReadout) return;
    const pairs = [['mainGroup', '.main-svg'], ['graphGroup', '.graph-svg']]
        .map(([id, sel]) => [document.getElementById(id), document.querySelector(sel)])
        .filter(([g, s]) => g && s);
    if (!pairs.length) return;

    // 그림에서 쓰던 색이 흰 바탕에서는 너무 흐린 경우가 있어, 그런 색은 버리고 기본색을 쓴다.
    function readableOnWhite(c) {
        let r, g, b;
        if (c[0] === '#') {
            let h = c.slice(1);
            if (h.length === 3) h = h.split('').map(x => x + x).join('');
            if (h.length !== 6) return false;
            r = parseInt(h.slice(0, 2), 16); g = parseInt(h.slice(2, 4), 16); b = parseInt(h.slice(4, 6), 16);
        } else {
            const m = c.match(/[\d.]+/g);
            if (!m || m.length < 3) return false;
            r = +m[0]; g = +m[1]; b = +m[2];
            const a = m.length > 3 ? +m[3] : 1;
            r = a * r + (1 - a) * 255; g = a * g + (1 - a) * 255; b = a * b + (1 - a) * 255;
        }
        const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
        const L = 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
        return 1.05 / (L + 0.05) >= 3.5;
    }

    function liftProse() {
        const rows = [], notes = [], verdicts = [];
        const takeOut = t => {
            const cls = t.getAttribute('class') || '';let txt = t.textContent.trim();
            if(t.matches('.stat-value')){
                const label=t.previousElementSibling;
                if(label?.matches('.stat-name')&&label.getAttribute('y')===t.getAttribute('y')){txt=label.textContent.trim()+': '+txt;label.remove();}
            }
            if (txt) {
                if (/verdict-text/.test(cls)) verdicts.push(txt);
                else if (/note-text/.test(cls)) notes.push(txt);
                else rows.push({ txt, fill: t.style.fill || '' });
            }
            t.remove();
        };
        pairs.forEach(([g, svg]) => {
            const vb = svg.viewBox.baseVal, W = vb.width, H = vb.height;
            const outside = b => b.x < -0.5 || b.x + b.width > W + 0.5 || b.y + b.height > H + 0.5 || b.y < -0.5;
            [...g.querySelectorAll('text')].forEach(t => {
                const cls = t.getAttribute('class') || '';
                const must = /verdict-text|note-text|prose/.test(cls);
                let b; try { b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); } catch (e) { return; }
                // 눈금 같은 짧은 이름표는 밖으로 내보내면 뜻을 잃는다. 액자 안으로 밀어 넣어 본다.
                if (!must && outside(b) && b.width < W * 0.6 && !t.getAttribute('transform')) {
                    const x = parseFloat(t.getAttribute('x')), y = parseFloat(t.getAttribute('y'));
                    if (!Number.isNaN(x)) {
                        const dx = b.x + b.width > W - 2 ? (W - 2) - (b.x + b.width) : (b.x < 2 ? 2 - b.x : 0);
                        if (dx) { t.setAttribute('x', (x + dx).toFixed(1)); b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); }
                    }
                    if (!Number.isNaN(y)) {
                        const dy = b.y + b.height > H - 1 ? (H - 1) - (b.y + b.height) : (b.y < 1 ? 1 - b.y : 0);
                        if (dy) { t.setAttribute('y', (y + dy).toFixed(1)); b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); }
                    }
                }
                if (must || outside(b)) takeOut(t);
            });
            const items = [...g.querySelectorAll('text')].map(t => {
                let b; try { b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); } catch (e) { b = null; }
                return { t, b, len: t.textContent.trim().length };
            }).filter(o => o.b);
            const drop = new Set();
            for (let i = 0; i < items.length; i += 1) for (let j = i + 1; j < items.length; j += 1) {
                if (drop.has(i) || drop.has(j)) continue;
                const a = items[i].b, c = items[j].b;
                if (Math.min(a.x + a.width, c.x + c.width) - Math.max(a.x, c.x) <= 3) continue;
                if (Math.min(a.y + a.height, c.y + c.height) - Math.max(a.y, c.y) <= 1.5) continue;
                const k = items[i].len >= items[j].len ? i : j;
                if (items[k].len < 8) continue;
                drop.add(k);
            }
            [...drop].sort((x, y) => x - y).forEach(k => takeOut(items[k].t));
        });
        // 옮긴 것이 없는 실행은 우리 자신이 일으킨 메아리다. 그때 지우면 방금 옮긴 글이 사라진다.
        if (!rows.length && !notes.length && !verdicts.length) return;
        if (stageVerdict) stageVerdict.textContent = verdicts.join(' ');
        stageReadout.textContent = '';
        rows.forEach(r => {
            const s = document.createElement('span');
            s.textContent = r.txt;
            if (r.fill && readableOnWhite(r.fill)) s.style.color = r.fill;
            stageReadout.appendChild(s);
        });
        if (stageNote) stageNote.textContent = notes.join(' ');
    }

    // 화면이 다시 그려지면 곧바로 돈다. 옮기는 동안 스스로를 깨우지 않도록 잠근다.
    let busy = false, obs;
    // 글자를 옮기는 것도 화면 변경이라 감시기가 다시 불린다. 그때는 기록이 비어 있으므로
    // 그냥 돌아가야 한다. 그러지 않으면 두 번째 실행이 방금 옮긴 결과를 지운다.
    const run = recs => {
        if (busy || (recs && recs.length === 0)) return;
        busy = true;
        try { liftProse(); } finally { obs.takeRecords(); busy = false; }
    };
    obs = new MutationObserver(run);
    pairs.forEach(([g]) => obs.observe(g, { childList: true, subtree: true }));
    run();
    document.addEventListener('DOMContentLoaded', run);
})();
