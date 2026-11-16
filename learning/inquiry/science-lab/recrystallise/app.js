document.addEventListener('DOMContentLoaded', () => {
    const saltButtons = [...document.querySelectorAll('[data-salt]')];
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const waterRange = document.getElementById('waterRange');
    const hotRange = document.getElementById('hotRange');
    const coldRange = document.getElementById('coldRange');
    const dirtRange = document.getElementById('dirtRange');
    const waterOutput = document.getElementById('waterOutput');
    const hotOutput = document.getElementById('hotOutput');
    const coldOutput = document.getElementById('coldOutput');
    const dirtOutput = document.getElementById('dirtOutput');
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

    // Real solubility, grams per 100 g of water.
    const SALTS = {
        kno3: { name: '질산 칼륨', formula: 'KNO₃', colour: '#0284c7',
                table: [[0, 13.3], [10, 20.9], [20, 31.6], [30, 45.8], [40, 63.9], [50, 85.5],
                        [60, 110], [70, 138], [80, 169], [90, 202], [100, 246]] },
        nacl: { name: '염화 나트륨', formula: 'NaCl', colour: '#d97706',
                table: [[0, 35.7], [10, 35.8], [20, 36.0], [30, 36.3], [40, 36.6], [50, 37.0],
                        [60, 37.3], [70, 37.8], [80, 38.4], [90, 39.0], [100, 39.8]] },
    };
    const IMP_S = 12;              // the impurity's own solubility, per 100 g water
    const BEAKER = { x0: 46, x1: 196, top: 40, bottom: 200 };
    const GRAPH = { x0: 66, x1: 424, y0: 158, y1: 30, tMax: 100, sMax: 260 };

    let salt = 'kno3';
    let prediction = null;
    let sim = null, running = false, frameId = 0, lastStamp = 0;

    const water = () => Number(waterRange.value);
    const hot = () => Number(hotRange.value);
    const cold = () => Number(coldRange.value);
    const dirt = () => Number(dirtRange.value);

    function solubility(T, key = salt) {
        const t = SALTS[key].table;
        if (T <= t[0][0]) return t[0][1];
        if (T >= t[t.length - 1][0]) return t[t.length - 1][1];
        for (let i = 1; i < t.length; i += 1) {
            if (T <= t[i][0]) {
                const [x0, y0] = t[i - 1], [x1, y1] = t[i];
                return y0 + ((y1 - y0) * (T - x0)) / (x1 - x0);
            }
        }
        return t[t.length - 1][1];
    }

    function analyse(key = salt, w = water(), T1 = hot(), T2 = cold(), imp = dirt()) {
        const hi = T1, lo = T2; // Preserve the selected start and finish; heating is not cooling.
        const s1 = solubility(hi, key), s2 = solubility(lo, key);
        const dissolved = (s1 * w) / 100;                 // a saturated solution at the hot end
        const canHold = (s2 * w) / 100;
        const crystals = Math.max(0, dissolved - canHold);
        // the impurity only comes out if it too passes its own saturation
        const impCanHold = (IMP_S * w) / 100;
        const impOut = Math.max(0, imp - impCanHold);
        const totalOut = crystals + impOut;
        const purity = totalOut > 1e-9 ? (crystals / totalOut) * 100 : 0;
        const verdict = crystals < 1e-9 ? 'none' : impOut < 1e-9 ? 'pure' : purity >= 90 ? 'slight' : 'dirty';
        return { key, S: SALTS[key], w, T1: hi, T2: lo, s1, s2, dissolved, canHold,
                 crystals, imp, impCanHold, impOut, totalOut, purity, verdict };
    }

    const freshSim = () => ({ t: 0, T: hot(), done: false });

    function step(s, dt, a) {
        s.t += dt;
        const span = 3.2;                                  // seconds to cool all the way
        const f = Math.min(1, s.t / span);
        s.T = a.T1 + (a.T2 - a.T1) * f;
        if (f >= 1) s.done = true;
        return s.done;
    }

    // How much has come out by the time it has cooled to T.
    function outAt(T, a) {
        const held = (solubility(T, a.key) * a.w) / 100;
        const c = Math.max(0, Math.min(a.crystals, a.dissolved - held));
        const i = a.impOut; // Constant-solubility impurity: any excess was already undissolved at the start.
        return { crystals: c, imp: i };
    }

    // 비커 안의 용액·녹아 있는 입자·바닥에 쌓이는 결정 알갱이, 비커에 꽂은 온도계.
    const rnd = i => (((i * 7919 + 13) * 104729) % 100003) / 100003;
    function grainSpot(i) {
        // 바닥 가운데부터 둔덕 모양으로 쌓는다(층마다 폭이 줄어든다).
        let layer = 0, left = i;
        while (left >= 22 - layer * 2 && layer < 9) { left -= 22 - layer * 2; layer += 1; }
        const cap = Math.max(4, 22 - layer * 2), w = (BEAKER.x1 - BEAKER.x0 - 20) * cap / 22;
        const cx = (BEAKER.x0 + BEAKER.x1) / 2, x = cx - w / 2 + (left + 0.5) * w / cap + (rnd(i) - 0.5) * 3;
        return { x, y: BEAKER.bottom - 6 - layer * 5.2 - rnd(i + 3) * 1.5, rot: (rnd(i + 7) - 0.5) * 50 };
    }
    function renderMain(a, s) {
        const st = outAt(s.T, a), started = running || s.t > 0, done = s.done || !resultContent.hidden;
        const inner = BEAKER.x1 - BEAKER.x0 - 8;
        const liquidTop = BEAKER.top + 30;
        let body = '';
        const warm = Math.max(0, Math.min(1, (s.T - a.T2) / Math.max(1, a.T1 - a.T2)));
        const fill = `rgb(${Math.round(176 + 34 * warm)},${Math.round(208 + 20 * warm)},${Math.round(232 + 8 * warm)})`;
        body += `<rect class="solution" fill="${fill}" opacity=".55" x="${BEAKER.x0}" y="${liquidTop}" width="${BEAKER.x1 - BEAKER.x0}" height="${BEAKER.bottom - liquidTop}"/>`;
        body += `<ellipse class="surface" cx="${(BEAKER.x0 + BEAKER.x1) / 2}" cy="${liquidTop}" rx="${(BEAKER.x1 - BEAKER.x0) / 2}" ry="3.5"/>`;
        const stillIn = Math.max(0, a.dissolved - st.crystals);
        const dots = Math.min(26, Math.round(stillIn / Math.max(1, a.dissolved / 26)));
        for (let i = 0; i < dots; i += 1) {
            const x = BEAKER.x0 + 10 + ((i * 29) % (inner - 30));
            const y = liquidTop + 12 + ((i * 37) % (BEAKER.bottom - liquidTop - 44));
            body += `<circle class="dissolved-dot" cx="${x}" cy="${y}" r="2.2"/>`;
        }
        for (let i = 0; i < Math.min(10, a.imp - st.imp); i += 1) {
            const x = BEAKER.x0 + 14 + ((i * 41) % (inner - 30));
            const y = liquidTop + 18 + ((i * 53) % (BEAKER.bottom - liquidTop - 48));
            body += `<circle class="dirt-dot" cx="${x}" cy="${y}" r="2.2"/>`;
        }
        // 바닥의 결정: 나온 양(g)에 비례하는 알갱이 수. 막 생긴 알갱이는 용액 속에서 가라앉는 중이다.
        const perGrain = 1.2, made = st.crystals / perGrain, n = Math.min(150, Math.floor(made));
        for (let i = 0; i < n; i += 1) {
            const g = grainSpot(i), sinking = i >= n - 4 && !done ? (n - i) / 5 : 0;
            const y = sinking ? g.y - (g.y - liquidTop - 20) * sinking * (0.6 + 0.4 * rnd(i)) : g.y;
            body += `<path class="crystal pure" d="M-3.4 0 L-1.7 -3 H1.7 L3.4 0 L1.7 3 H-1.7 Z" transform="translate(${g.x.toFixed(1)} ${y.toFixed(1)}) rotate(${g.rot.toFixed(0)})"/>`;
        }
        for (let i = 0; i < Math.round(st.imp * 2); i += 1) {
            const x = BEAKER.x0 + 16 + ((i * 31) % (inner - 24));
            body += `<rect class="crystal dirt" x="${x.toFixed(1)}" y="${(BEAKER.bottom - 9 - (i % 2) * 6).toFixed(1)}" width="5" height="5" rx="1.5"/>`;
        }
        let out = `<g clip-path="url(#beakerClip)">${body}</g>`;
        // 비커: 주둥이와 눈금이 있는 유리 그릇
        out += `<path class="beaker" d="M${BEAKER.x0 - 8},${BEAKER.top - 4} Q${BEAKER.x0 - 2},${BEAKER.top - 2} ${BEAKER.x0},${BEAKER.top + 4} L${BEAKER.x0},${BEAKER.bottom - 6} Q${BEAKER.x0},${BEAKER.bottom} ${BEAKER.x0 + 6},${BEAKER.bottom} L${BEAKER.x1 - 6},${BEAKER.bottom} Q${BEAKER.x1},${BEAKER.bottom} ${BEAKER.x1},${BEAKER.bottom - 6} L${BEAKER.x1},${BEAKER.top}"/>`;
        for (let k = 0; k < 4; k += 1) out += `<line x1="${BEAKER.x0 + 6}" x2="${BEAKER.x0 + (k % 2 ? 14 : 22)}" y1="${BEAKER.bottom - 26 - k * 28}" y2="${BEAKER.bottom - 26 - k * 28}" stroke="#7d98a4" stroke-width="1.2"/>`;
        out += `<path d="M${BEAKER.x0 + 4},${BEAKER.top + 12} V${BEAKER.bottom - 14}" stroke="#fff" stroke-width="3" opacity=".6" stroke-linecap="round"/>`;
        // 온도계: 비커 속 용액에 꽂혀 있다
        const TX = BEAKER.x1 - 22, TOP = BEAKER.top - 22, BOT = BEAKER.bottom - 22;
        out += `<rect class="therm-tube" x="${TX}" y="${TOP}" width="9" height="${BOT - TOP}" rx="4.5"/>`;
        out += `<circle cx="${TX + 4.5}" cy="${BOT}" r="6.5" fill="#dc2626" stroke="#94a3b8" stroke-width="1.2"/>`;
        const tf = Math.max(0, Math.min(1, s.T / 100));
        out += `<rect class="therm-fill" x="${TX + 2.2}" y="${(BOT - (BOT - TOP - 12) * tf).toFixed(1)}" width="4.6" height="${((BOT - TOP - 12) * tf).toFixed(1)}" rx="2.3"/>`;
        out += `<text class="read-text" x="${TX + 14}" y="${TOP + 8}">${s.T.toFixed(0)} ℃</text>`;
        if (s.T > 70) {
            for (let i = 0; i < 3; i += 1) {
                out += `<path class="steam" d="M${BEAKER.x0 + 24 + i * 28},${BEAKER.top + 20} q6,-10 0,-18">` +
                       `<animate attributeName="opacity" values="0;.7;0" dur="2s" begin="${(i * 0.5).toFixed(1)}s" repeatCount="indefinite"/></path>`;
            }
        }

        out += `<text class="part-label" x="248" y="60">${a.S.name} ${a.S.formula}</text>`;
        out += `<text class="note-text" x="248" y="80">물 ${a.w} g · ${a.T1} ℃ 에서 ${a.dissolved.toFixed(1)} g 녹음</text>`;
        out += `<text class="note-text" x="248" y="98">${a.T2} ℃ 에서는 ${a.canHold.toFixed(1)} g 만 녹을 수 있음</text>`;
        // 식히기 전에는 나온 양·불순물·순도를 적지 않는다.
        if (started) out += `<text class="note-text" x="248" y="116">지금까지 나온 결정 ${st.crystals.toFixed(1)} g</text>`;
        if (done) {
            out += `<text class="note-text" x="248" y="134">불순물 ${a.imp} g 중 녹아 남는 양 ${Math.min(a.imp, a.impCanHold).toFixed(1)} g</text>`;
            const tone = a.verdict === 'pure' ? '#059669' : a.verdict === 'slight' ? '#d97706' : '#ea580c';
            out += `<text class="purity-text verdict-text" fill="${tone}" x="248" y="160">${VERDICT[a.verdict]}</text>`;
            out += `<text class="note-text" x="248" y="182">석출량 ${yieldText(a)}</text>`;
        }
        window.scienceScene.render(mainGroup,out);
    }

    const VERDICT = { none: '주성분 결정이 나오지 않습니다', pure: '모형에서 불순물 없는 결정', slight: '불순물이 조금 섞였습니다', dirty: '불순물이 많이 섞였습니다' };
    const SHORT = { none: '결정 없음', pure: '불순물 없음', slight: '조금 섞임', dirty: '많이 섞임' };

    function yieldText(a) {
        return a.s1 > a.s2
            ? `(${a.s1.toFixed(1)} − ${a.s2.toFixed(1)}) × ${a.w} ÷ 100 = ${a.crystals.toFixed(1)} g`
            : '0.0 g (용해도가 줄지 않음)';
    }

    function renderGraph(a) {
        const gx = T => GRAPH.x0 + (T / GRAPH.tMax) * (GRAPH.x1 - GRAPH.x0);
        const gy = S => GRAPH.y0 - (S / GRAPH.sMax) * (GRAPH.y0 - GRAPH.y1);
        let out = '';
        [0, 65, 130, 195, 260].forEach(S => {
            out += `<line class="grid-line" x1="${GRAPH.x0}" y1="${gy(S).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(S).toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(gy(S) + 3).toFixed(1)}" text-anchor="end">${S}</text>`;
        });
        [0, 25, 50, 75, 100].forEach(T => {
            out += `<text class="axis-text" x="${gx(T).toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${T}</text>`;
        });
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-title" x="${((GRAPH.x0 + GRAPH.x1) / 2).toFixed(1)}" y="${GRAPH.y0 + 32}" text-anchor="middle">온도 (℃)</text>`;
        out += `<text class="axis-title" x="22" y="18">용해도 (물 100 g당 g)</text>`;

        Object.entries(SALTS).forEach(([k, s]) => {
            const on = k === a.key;
            const pts = s.table.map(([T, S]) => `${gx(T).toFixed(1)},${gy(S).toFixed(1)}`);
            out += `<path class="curve ${k}${on ? '' : ' dim'}" d="M${pts.join('L')}"/>`;
            const last = s.table[s.table.length - 1];
            out += `<text class="curve-tag" fill="${s.colour}" x="${(gx(last[0]) - 4).toFixed(1)}" ` +
                   `y="${(gy(last[1]) - 7).toFixed(1)}" text-anchor="end">${s.formula}</text>`;
        });
        // A solubility decrease is per 100 g water; scale it by the selected water mass.
        out += `<line class="imp-line" x1="${GRAPH.x0}" y1="${gy(IMP_S).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(IMP_S).toFixed(1)}"/>`;
        // 이름표는 선 위가 아니라 그래프 왼쪽 위 빈 곳에 범례로 둔다(염화 나트륨 선과 겹치지 않게).
        out += `<line class="imp-line" x1="${GRAPH.x0 + 10}" y1="${gy(205).toFixed(1)}" x2="${GRAPH.x0 + 30}" y2="${gy(205).toFixed(1)}"/><text class="imp-text" x="${GRAPH.x0 + 36}" y="${(gy(205) + 4).toFixed(1)}">불순물의 용해도 ${IMP_S}</text>`;
        out += `<line class="drop-line" x1="${gx(a.T2).toFixed(1)}" y1="${gy(a.s2).toFixed(1)}" x2="${gx(a.T1).toFixed(1)}" y2="${gy(a.s1).toFixed(1)}"/>`;
        out += `<line class="drop-line" x1="${gx(a.T2).toFixed(1)}" y1="${gy(a.s1).toFixed(1)}" x2="${gx(a.T1).toFixed(1)}" y2="${gy(a.s1).toFixed(1)}"/>`;
        out += `<line class="drop-line" x1="${gx(a.T2).toFixed(1)}" y1="${gy(a.s1).toFixed(1)}" x2="${gx(a.T2).toFixed(1)}" y2="${gy(a.s2).toFixed(1)}"/>`;
        out += `<circle class="mark-dot" cx="${gx(a.T1).toFixed(1)}" cy="${gy(a.s1).toFixed(1)}" r="4.5" fill="#059669"/>`;
        out += `<circle class="mark-dot" cx="${gx(a.T2).toFixed(1)}" cy="${gy(a.s2).toFixed(1)}" r="4.5" fill="#059669"/>`;
        const midY = (gy(a.s1) + gy(a.s2)) / 2;
        const flip = gx(a.T2) < 130;
        out += `<text class="drop-text" x="${(gx(a.T2) + (flip ? 8 : -8)).toFixed(1)}" y="${midY.toFixed(1)}"${flip ? '' : ' text-anchor="end"'}>` +
               `${a.s1 >= a.s2 ? '감소' : '증가'} ${Math.abs(a.s1 - a.s2).toFixed(1)}</text>`;
        window.scienceScene.render(graphGroup,out);
    }

    function render() {
        const a = analyse();
        if (!sim) sim = freshSim();
        renderMain(a, sim);
        renderGraph(a);
        waterOutput.textContent = `${a.w} g`;
        hotOutput.textContent = `${hot()} ℃`;
        coldOutput.textContent = `${cold()} ℃`;
        dirtOutput.textContent = `${a.imp} g`;
        const shown = (sim && sim.done) || !resultContent.hidden;
        stageBadge.textContent = shown ? `${a.crystals.toFixed(1)} g 석출 · ${SHORT[a.verdict]}` : `${a.S.formula} · ${a.T1} ℃ → ${a.T2} ℃`;
        window.scienceScene.render(dataNote,!shown ? `<div class="data-row"><span class="data-name">용해도</span><span class="data-val">${a.T1} ℃ 에서 ${a.s1.toFixed(1)} · ${a.T2} ℃ 에서 ${a.s2.toFixed(1)} (물 100 g당)</span></div>` : `<div class="data-row"><span class="data-name">용해도</span><span class="data-val">${a.T1} ℃ 에서 ${a.s1.toFixed(1)} · ${a.T2} ℃ 에서 ${a.s2.toFixed(1)} (물 100 g당)</span></div>` +
            `<div class="data-row"><span class="data-name">녹아 있던 양</span><span class="data-val">${a.s1.toFixed(1)} × ${a.w} ÷ 100 = ${a.dissolved.toFixed(1)} g</span></div>` +
            `<div class="data-row"><span class="data-name">석출량</span><span class="data-val">${yieldText(a)}</span></div>` +
            `<div class="data-row"><span class="data-name">불순물</span><span class="data-val">${a.imp} g 중 ${a.impCanHold.toFixed(1)} g 까지 녹을 수 있어 ${a.impOut.toFixed(1)} g 석출</span></div>` +
            `<div class="data-row match"><span class="data-name">결정의 순도</span><span class="data-val">${a.crystals > 0 ? `${a.crystals.toFixed(1)} ÷ ${a.totalOut.toFixed(1)} = ${a.purity.toFixed(1)}%` : '주성분 결정 없음 — 순도 비교 대상 없음'}</span></div>`);
        return a;
    }

    function stopRun() { running = false; if (frameId) cancelAnimationFrame(frameId); frameId = 0; }

    function tick(dt) {
        const a = analyse();
        const done = step(sim, dt, a);
        render();
        return done;
    }

    function frame(stamp) {
        if (!running) return;
        const dt = Math.min(0.05, (stamp - lastStamp) / 1000 || 0);
        lastStamp = stamp;
        if (tick(dt)) { stopRun(); finish(); } else frameId = requestAnimationFrame(frame);
    }

    function startRun() {
        stopRun();
        sim = freshSim();
        running = true;
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) { running = false; const a = analyse(); while (!step(sim, 0.1, a)); finish(); return; }
        lastStamp = performance.now();
        render();
        frameId = requestAnimationFrame(frame);
    }

    function finish() {
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        const a = render();
        valueA.textContent = `${a.crystals.toFixed(1)} g`;
        valueB.textContent = a.crystals > 0 ? `${a.purity.toFixed(1)}%` : '—';
        predictionResult.textContent = !prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        const other = analyse(a.key === 'kno3' ? 'nacl' : 'kno3', a.w, a.T1, a.T2, a.imp);
        let s = `${a.T1} ℃ 물 ${a.w} g 에는 ${a.S.name}이 ${a.dissolved.toFixed(1)} g 까지 녹습니다. `;
        if (a.verdict === 'none') {
            explanation.textContent = s + a.T2 + ' ℃에서는 ' + a.canHold.toFixed(1) + ' g까지 녹을 수 있어 새 주성분 결정은 나오지 않습니다. 온도를 그대로 두거나 높이는 것은 냉각 재결정이 아닙니다.' + (a.impOut > 0 ? ' 바닥의 불순물 ' + a.impOut.toFixed(1) + ' g은 처음부터 녹지 않은 것으로, 새로 생긴 주성분 결정이 아닙니다.' : '');
            return;
        }
        s += `${a.T2} ℃로 식히면 ${a.canHold.toFixed(1)} g까지 녹을 수 있으므로 차이인 ${a.crystals.toFixed(1)} g이 결정으로 나옵니다. `;
        if (a.impOut < 1e-9) {
            s += `불순물 ${a.imp} g은 이 물에 ${a.impCanHold.toFixed(1)} g 까지 녹을 수 있어 식힌 뒤에도 전부 녹은 채 남습니다. ` +
                 `이상화한 모형에서는 주성분 결정만 얻습니다. 실제 결정의 순도는 씻기·거르기 등의 조건에도 영향을 받습니다. `;
        } else {
            s += `그런데 불순물 ${a.imp} g은 이 물에 ${a.impCanHold.toFixed(1)} g 까지밖에 녹지 못해 ${a.impOut.toFixed(1)} g은 처음부터 녹지 않고 남아 있습니다. 이를 미리 거르지 않고 마지막 고체를 함께 모은 조건입니다. ` +
                 `결정의 순도는 ${a.purity.toFixed(1)}%로 떨어집니다. 물을 더 쓰면 불순물이 다 녹아 남아 순도가 올라갑니다. `;
        }
        s += a.key === 'kno3'
            ? `질산 칼륨은 온도에 따라 용해도가 크게 달라져 식히는 것만으로 많은 양을 얻을 수 있습니다. 같은 조건에서 염화 나트륨은 ${other.crystals.toFixed(1)} g 밖에 나오지 않습니다.`
            : `염화 나트륨은 ${a.T1} ℃와 ${a.T2} ℃ 의 용해도가 ${a.s1.toFixed(1)}과 ${a.s2.toFixed(1)}로 거의 같아 식혀도 ${a.crystals.toFixed(1)} g 밖에 나오지 않습니다. ` +
              `같은 조건의 질산 칼륨은 ${other.crystals.toFixed(1)} g이 나옵니다. 그래서 염화 나트륨은 재결정으로 정제하기 어렵고, 바닷물에서는 물을 증발시켜 얻습니다.`;
        explanation.textContent = s;
    }

    function changed() {
        stopRun();
        sim = freshSim();
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        render();
    }

    [waterRange, hotRange, coldRange, dirtRange].forEach(el => el.addEventListener('input', changed));
    saltButtons.forEach(button => button.addEventListener('click', () => {
        salt = button.dataset.salt;
        saltButtons.forEach(item => item.classList.toggle('selected', item === button));
        changed();
    }));
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        waterRange.value = '100'; hotRange.value = '80'; coldRange.value = '20'; dirtRange.value = '0';
        prediction = null;
        predictionButtons.forEach(item => item.classList.remove('selected'));
        stageCaption.textContent = '용해도가 줄어들 때, 줄어든 용해도에 물의 질량을 곱하고 100으로 나누면 석출량입니다.';
        saltButtons.find(b => b.dataset.salt === 'kno3').click();
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

    window.__crystalModel = {
        SALTS, IMP_S, solubility, analyse, outAt, freshSim, step, render, check: finish,
        setSalt(k) { saltButtons.find(b => b.dataset.salt === k).click(); },
        setWater(v) { waterRange.value = String(v); changed(); },
        setHot(v) { hotRange.value = String(v); changed(); },
        setCold(v) { coldRange.value = String(v); changed(); },
        setDirt(v) { dirtRange.value = String(v); changed(); },
        runToEnd(dt = 1 / 60, cap = 2000) {
            stopRun(); sim = freshSim();
            let n = 0; while (!tick(dt) && n < cap) n += 1;
            finish(); return { steps: n, T: sim.T };
        },
        getSim: () => sim, tick,
    };

    resetBtn.click();
});

// 「실험 결과의 의미」 해설은 결과를 확인한 뒤에만 펼친다(답이 먼저 보이지 않게).
document.addEventListener('DOMContentLoaded',()=>{const m=document.querySelector('.meaning-panel'),c=document.getElementById('resultContent');if(!m||!c)return;const sync=()=>{m.style.display=c.hidden?'none':'';};new MutationObserver(sync).observe(c,{attributes:true,attributeFilter:['hidden']});sync();});
