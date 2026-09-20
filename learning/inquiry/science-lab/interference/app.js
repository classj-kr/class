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

    const X0 = 44, X1 = 428, LAM = 96, AMP = 17;
    const ROW1 = 54, ROW2 = 106, ROW3 = 174;
    const STRING_Y = 96, STRING_A = 40;
    const SAMPLES = 24;
    const SLOW = 200;          // the string is drawn this many times slower than real
    const BENCH = 500;         // the frequency we compare against
    const GRAPH = { x0: 66, x1: 424, y0: 152, y1: 34 };

    const state = { mode: 'superpose', ratio: 0, length: 1.0, speed: 200, mode_n: 1, prediction: null };

    /* ------------------------------------------------------------ models */
    // Two equal waves a path difference apart add to 2A cos(pi x ratio).
    function analyseSuper(ratio = state.ratio) {
        const phase = 2 * Math.PI * ratio;
        const amp = 2 * Math.abs(Math.cos(Math.PI * ratio));
        const verdict = amp > 1.8 ? 'constructive' : amp < 0.2 ? 'destructive' : 'partial';
        const nearest = Math.round(ratio * 2) / 2;
        return { kind: 'super', ratio, phase, amp, verdict, nearest };
    }

    // A string clamped at both ends only rings when its length is a whole
    // number of half wavelengths.
    function analyseStanding(L = state.length, v = state.speed, n = state.mode_n) {
        const lambda = (2 * L) / n;
        const freq = (n * v) / (2 * L);
        const base = v / (2 * L);
        const verdict = freq > BENCH * 1.1 ? 'high' : freq < BENCH * 0.9 ? 'low' : 'near';
        return { kind: 'standing', L, v, n, lambda, freq, base, verdict, nodes: n + 1, antinodes: n };
    }

    const analyse = () => (state.mode === 'superpose' ? analyseSuper() : analyseStanding());

    /* ---------------------------------------------------------- controls */
    function buildControls() {
        if (state.mode === 'superpose') {
            controlArea.innerHTML =
                `<div class="range-heading"><label for="ratioRange">두 파동의 경로차</label><output id="ratioOut" for="ratioRange"></output></div>` +
                `<input id="ratioRange" type="range" min="0" max="2" step="0.125" value="${state.ratio}">` +
                `<div class="range-scale" aria-hidden="true"><span>0</span><span>1λ</span><span>2λ</span></div>`;
        } else {
            controlArea.innerHTML =
                `<fieldset class="pick-field"><legend>진동 모드</legend><div class="pick-buttons" data-pick="mode_n">` +
                [1, 2, 3, 4, 5].map(n => `<button type="button" data-value="${n}" class="${state.mode_n === n ? 'selected' : ''}">${n}<small>${n === 1 ? '기본' : n + '배'}</small></button>`).join('') +
                `</div></fieldset>` +
                `<div class="range-heading"><label for="lenRange">줄의 길이 L</label><output id="lenOut" for="lenRange"></output></div>` +
                `<input id="lenRange" type="range" min="0.5" max="2" step="0.1" value="${state.length}">` +
                `<div class="range-scale" aria-hidden="true"><span>0.5m</span><span>1.25m</span><span>2m</span></div>` +
                `<div class="range-heading amount-heading"><label for="speedRange">줄에서의 파동 속력 v</label><output id="speedOut" for="speedRange"></output></div>` +
                `<input id="speedRange" type="range" min="100" max="400" step="20" value="${state.speed}">` +
                `<div class="range-scale" aria-hidden="true"><span>100</span><span>250</span><span>400 m/s</span></div>`;
        }
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = Number(button.dataset.value);
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                changed();
            }));
        });
        [['ratioRange', 'ratio'], ['lenRange', 'length'], ['speedRange', 'speed']].forEach(([id, key]) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('input', () => { state[key] = Number(el.value); changed(); });
        });
    }

    const PRED_SUPER = [{ v: 'constructive', t: '보강 간섭' }, { v: 'partial', t: '중간' }, { v: 'destructive', t: '상쇄 간섭' }];
    const PRED_STAND = [{ v: 'high', t: '높다' }, { v: 'near', t: '비슷하다' }, { v: 'low', t: '낮다' }];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list = state.mode === 'superpose' ? PRED_SUPER : PRED_STAND;
        predictionLegend.textContent = state.mode === 'superpose'
            ? '두 파동이 겹치면 어떻게 될까요?' : `고유 진동수가 ${BENCH} Hz보다 어떨까요?`;
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.v}">${o.t}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    function travelPath(row, amp, phase) {
        const pts = [];
        for (let x = X0 - LAM; x <= X1 + 2; x += 2) {
            pts.push(`${x.toFixed(1)},${(row - amp * Math.sin((2 * Math.PI * (x - X0)) / LAM + phase)).toFixed(2)}`);
        }
        return `M${pts.join('L')}`;
    }

    function renderSuper(a) {
        const dur = 2.4;
        let body = '';
        const rows = [
            [ROW1, 'wave-a', AMP, 0, '파동 1'],
            [ROW2, 'wave-b', AMP, a.phase, '파동 2'],
        ];
        rows.forEach(([row, cls, amp, ph]) => {
            body += `<line class="rest-line" x1="${X0}" y1="${row}" x2="${X1}" y2="${row}"/>`;
            body += `<g><path class="${cls}" d="${travelPath(row, amp, ph)}"/>` +
                    `<animateTransform attributeName="transform" type="translate" from="0 0" to="${LAM} 0" ` +
                    `dur="${dur}s" repeatCount="indefinite"/></g>`;
        });
        // the sum, built by adding the two displacements at each point
        body += `<line class="rest-line" x1="${X0}" y1="${ROW3}" x2="${X1}" y2="${ROW3}"/>`;
        const pts = [];
        for (let x = X0 - LAM; x <= X1 + 2; x += 2) {
            const t = (2 * Math.PI * (x - X0)) / LAM;
            const y = ROW3 - AMP * Math.sin(t) - AMP * Math.sin(t + a.phase);
            pts.push(`${x.toFixed(1)},${y.toFixed(2)}`);
        }
        body += `<g><path class="wave-sum" d="M${pts.join('L')}"/>` +
                `<animateTransform attributeName="transform" type="translate" from="0 0" to="${LAM} 0" ` +
                `dur="${dur}s" repeatCount="indefinite"/></g>`;
        const env = AMP * a.amp;
        if (env > 0.5) {
            [-1, 1].forEach(s => {
                body += `<line class="envelope" x1="${X0}" y1="${(ROW3 + s * env).toFixed(1)}" x2="${X1}" y2="${(ROW3 + s * env).toFixed(1)}"/>`;
            });
        }
        let out = `<g clip-path="url(#waveClip)">${body}</g>`;
        out += `<text class="small-label" x="${X0}" y="32">파동 1</text>`;
        out += `<text class="small-label" x="${X0}" y="84">파동 2 — ${a.ratio}λ 만큼 늦게 도착</text>`;
        out += `<text class="small-label" x="${X0}" y="136">두 파동을 더한 것</text>`;
        const tone = a.verdict === 'constructive' ? '#059669' : a.verdict === 'destructive' ? '#ea580c' : '#d97706';
        out += `<text class="verdict-text" fill="${tone}" x="20" y="20">경로차 ${a.ratio}λ · 합성 진폭 ${a.amp.toFixed(2)}A · ${VERDICT[a.verdict]}</text>`;
        mainGroup.innerHTML = out;
    }

    // one full cycle of cos, for the standing wave to breathe through
    function cosValues() {
        const v = [];
        for (let k = 0; k <= SAMPLES; k += 1) v.push(`1 ${Math.cos((2 * Math.PI * k) / SAMPLES).toFixed(4)}`);
        return v.join(';');
    }

    function renderStanding(a) {
        const span = X1 - X0;
        const shape = sign => {
            const pts = [];
            // 240 divides by every mode number, so a sample lands exactly on
            // each node and the drawn string is truly zero there
            for (let i = 0; i <= 240; i += 1) {
                const x = X0 + (span * i) / 240;
                pts.push(`${x.toFixed(1)},${(sign * -STRING_A * Math.sin((a.n * Math.PI * (x - X0)) / span)).toFixed(2)}`);
            }
            return `M${pts.join('L')}`;
        };
        const dur = (SLOW / a.freq).toFixed(3);
        let body = '';
        body += `<line class="rest-line" x1="${X0}" y1="${STRING_Y}" x2="${X1}" y2="${STRING_Y}"/>`;
        body += `<g transform="translate(0,${STRING_Y})">`;
        body += `<path class="string ghost" d="${shape(1)}"/><path class="string ghost" d="${shape(-1)}"/>`;
        body += `<g><animateTransform attributeName="transform" type="scale" values="${cosValues()}" ` +
                `dur="${dur}s" repeatCount="indefinite" calcMode="linear"/>` +
                `<path class="string" d="${shape(1)}"/></g></g>`;
        // nodes never move, antinodes swing hardest
        for (let k = 0; k <= a.n; k += 1) {
            const x = X0 + (span * k) / a.n;
            body += `<circle class="node-dot" cx="${x.toFixed(1)}" cy="${STRING_Y}" r="4"/>`;
        }
        for (let k = 0; k < a.n; k += 1) {
            const x = X0 + (span * (k + 0.5)) / a.n;
            body += `<line class="anti-mark" x1="${x.toFixed(1)}" y1="${STRING_Y - STRING_A - 6}" x2="${x.toFixed(1)}" y2="${STRING_Y + STRING_A + 6}"/>`;
        }
        let out = `<g clip-path="url(#waveClip)">${body}</g>`;
        out += `<rect class="peg" x="${X0 - 10}" y="${STRING_Y - 18}" width="10" height="36" rx="3"/>`;
        out += `<rect class="peg" x="${X1}" y="${STRING_Y - 18}" width="10" height="36" rx="3"/>`;
        out += `<text class="small-label" style="fill:#ff7d6b" x="${X0}" y="${STRING_Y + STRING_A + 26}">● 마디 ${a.nodes}개 — 움직이지 않습니다</text>`;
        out += `<text class="small-label" style="fill:#059669" x="${X1}" y="${STRING_Y + STRING_A + 26}" text-anchor="end">┆ 배 ${a.antinodes}개 — 가장 크게 흔들립니다</text>`;
        out += `<text class="part-label" x="20" y="20">${a.n}배 진동 · 줄 ${a.L.toFixed(1)} m · v ${a.v} m/s</text>`;
        out += `<text class="read-text" x="20" y="190">λ = 2×${a.L.toFixed(1)}÷${a.n} = ${a.lambda.toFixed(2)} m · f = ${a.n}×${a.v}÷(2×${a.L.toFixed(1)}) = ${a.freq.toFixed(0)} Hz</text>`;
        out += `<text class="note-text" x="20" y="206">화면의 진동은 실제보다 ${SLOW}배 느리게 보여 줍니다 — 모드끼리의 빠르기 비는 그대로입니다</text>`;
        mainGroup.innerHTML = out;
    }

    const VERDICT = { constructive: '보강 간섭', destructive: '상쇄 간섭', partial: '부분 보강' };
    const FREQ_WORD = { high: '높다', near: '비슷하다', low: '낮다' };

    /* ------------------------------------------------------------ graphs */
    function graphSuper(a) {
        const gx = r => GRAPH.x0 + (r / 2) * (GRAPH.x1 - GRAPH.x0);
        const gy = v => GRAPH.y0 - (v / 2.2) * (GRAPH.y0 - GRAPH.y1);
        let out = '';
        // no 0A label: it would sit on the 0λ tick in the corner
        [0.5, 1, 1.5, 2].forEach(v => {
            out += `<line class="grid-line" x1="${GRAPH.x0}" y1="${gy(v).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(v).toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(gy(v) + 3).toFixed(1)}" text-anchor="end">${v}A</text>`;
        });
        [0, 0.5, 1, 1.5, 2].forEach(r => {
            out += `<text class="axis-text" x="${gx(r).toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${r}λ</text>`;
        });
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-title" x="${((GRAPH.x0 + GRAPH.x1) / 2).toFixed(1)}" y="${GRAPH.y0 + 32}" text-anchor="middle">경로차 (파장의 배수)</text>`;
        out += `<text class="axis-title" x="22" y="22">합성 진폭</text>`;
        [0, 1, 2].forEach(r => {
            out += `<line class="mark-line" x1="${gx(r).toFixed(1)}" y1="${GRAPH.y1}" x2="${gx(r).toFixed(1)}" y2="${GRAPH.y0}"/>`;
        });
        [0.5, 1.5].forEach(r => {
            out += `<line class="null-line" x1="${gx(r).toFixed(1)}" y1="${GRAPH.y1}" x2="${gx(r).toFixed(1)}" y2="${GRAPH.y0}"/>`;
        });
        out += `<text class="mark-text" x="${(gx(1)).toFixed(1)}" y="${GRAPH.y1 - 6}" text-anchor="middle">정수배 → 보강</text>`;
        out += `<text class="null-text" x="${(gx(0.5)).toFixed(1)}" y="${GRAPH.y0 - 6}" text-anchor="middle">반파장 홀수배 → 상쇄</text>`;
        const pts = [];
        for (let r = 0; r <= 2.0001; r += 0.01) pts.push(`${gx(r).toFixed(1)},${gy(analyseSuper(r).amp).toFixed(1)}`);
        out += `<path class="trace" d="M${pts.join('L')}"/>`;
        out += `<circle class="trace-dot" cx="${gx(a.ratio).toFixed(1)}" cy="${gy(a.amp).toFixed(1)}" r="5" fill="#d97706"/>`;
        graphGroup.innerHTML = out;
    }

    function graphStanding(a) {
        const all = [1, 2, 3, 4, 5].map(n => analyseStanding(a.L, a.v, n));
        // the benchmark is part of the scale, or its marker lands off the chart
        const max = Math.max(...all.map(x => x.freq), BENCH) * 1.15;
        const gx = f => GRAPH.x0 + (f / max) * (GRAPH.x1 - GRAPH.x0);
        let out = '';
        for (let i = 0; i <= 4; i += 1) {
            const f = (max / 4) * i;
            out += `<line class="grid-line" x1="${gx(f).toFixed(1)}" y1="${GRAPH.y1}" x2="${gx(f).toFixed(1)}" y2="${GRAPH.y0}"/>`;
            out += `<text class="axis-text" x="${gx(f).toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${f.toFixed(0)}</text>`;
        }
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-title" x="${((GRAPH.x0 + GRAPH.x1) / 2).toFixed(1)}" y="${GRAPH.y0 + 32}" text-anchor="middle">고유 진동수 (Hz)</text>`;
        out += `<text class="axis-title" x="22" y="22">진동 모드</text>`;
        out += `<line class="mark-line" x1="${gx(BENCH).toFixed(1)}" y1="${GRAPH.y1}" x2="${gx(BENCH).toFixed(1)}" y2="${GRAPH.y0}"/>`;
        out += `<text class="mark-text" x="${(gx(BENCH) + 4).toFixed(1)}" y="${GRAPH.y1 + 9}">${BENCH} Hz</text>`;
        all.forEach((row, i) => {
            const y = GRAPH.y1 + 18 + i * 22;
            const on = row.n === a.n;
            out += `<text class="axis-text" style="fill:${on ? '#0f172a' : '#7f9298'}" x="${GRAPH.x0 - 6}" y="${(y + 4).toFixed(1)}" text-anchor="end">${row.n}배</text>`;
            out += `<rect class="bar" x="${GRAPH.x0}" y="${y - 5}" width="${Math.max(2, gx(row.freq) - GRAPH.x0).toFixed(1)}" height="12" rx="3" ` +
                   `fill="#d97706" opacity="${on ? 0.9 : 0.35}"/>`;
            const flip = gx(row.freq) > GRAPH.x1 - 80;
            out += `<text class="bar-text" style="fill:${flip ? '#ffffff' : (on ? '#b45309' : '#475569')}" x="${(gx(row.freq) + (flip ? -6 : 6)).toFixed(1)}" ` +
                   `y="${(y + 4).toFixed(1)}"${flip ? ' text-anchor="end"' : ''}>${row.freq.toFixed(0)} Hz</text>`;
        });
        graphGroup.innerHTML = out;
    }

    /* ------------------------------------------------------------ render */
    function render() {
        const a = analyse();
        if (a.kind === 'super') { renderSuper(a); graphSuper(a); } else { renderStanding(a); graphStanding(a); }
        const r = document.getElementById('ratioOut');
        if (r) r.textContent = `${a.ratio ?? state.ratio}λ`;
        const l = document.getElementById('lenOut');
        if (l) l.textContent = `${state.length.toFixed(1)} m`;
        const s = document.getElementById('speedOut');
        if (s) s.textContent = `${state.speed} m/s`;
        methodHint.textContent = state.mode === 'superpose'
            ? '두 파동이 겹치면 변위끼리 그대로 더해집니다'
            : '줄 길이가 반파장의 정수배일 때만 정상파가 생깁니다';
        stageBadge.textContent = a.kind === 'super'
            ? `${VERDICT[a.verdict]} · ${a.amp.toFixed(2)}A`
            : `${a.n}배 진동 · ${a.freq.toFixed(0)} Hz`;
        dataNote.innerHTML = a.kind === 'super'
            ? `<div class="data-row"><span class="data-name">경로차</span><span class="data-val">${a.ratio}λ → 위상차 ${(a.ratio * 360).toFixed(0)}°</span></div>` +
              `<div class="data-row"><span class="data-name">합성 진폭</span><span class="data-val">2A × |cos(${(a.ratio * 180).toFixed(0)}°)| = ${a.amp.toFixed(3)}A</span></div>` +
              `<div class="data-row"><span class="data-name">보강 조건</span><span class="data-val">경로차 = 0λ, 1λ, 2λ … (정수배)</span></div>` +
              `<div class="data-row"><span class="data-name">상쇄 조건</span><span class="data-val">경로차 = 0.5λ, 1.5λ … (반파장의 홀수배)</span></div>` +
              `<div class="data-row match"><span class="data-name">결과</span><span class="data-val">${VERDICT[a.verdict]}</span></div>`
            : `<div class="data-row"><span class="data-name">파장</span><span class="data-val">λ = 2L/n = 2×${a.L.toFixed(1)}÷${a.n} = ${a.lambda.toFixed(2)} m</span></div>` +
              `<div class="data-row"><span class="data-name">고유 진동수</span><span class="data-val">f = v/λ = ${a.v}÷${a.lambda.toFixed(2)} = ${a.freq.toFixed(0)} Hz</span></div>` +
              `<div class="data-row"><span class="data-name">기본 진동수</span><span class="data-val">${a.base.toFixed(0)} Hz 의 ${a.n}배</span></div>` +
              `<div class="data-row"><span class="data-name">마디와 배</span><span class="data-val">마디 ${a.nodes}개 · 배 ${a.antinodes}개</span></div>` +
              `<div class="data-row match"><span class="data-name">${BENCH} Hz와 견주면</span><span class="data-val">${FREQ_WORD[a.verdict]}</span></div>`;
        return a;
    }

    function check() {
        const a = render();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        if (a.kind === 'super') {
            labelA.textContent = '합성 진폭'; labelB.textContent = '위상차';
            valueA.textContent = `${a.amp.toFixed(2)}A`;
            valueB.textContent = `${(a.ratio * 360).toFixed(0)}°`;
            predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
                : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
            let s = `경로차가 ${a.ratio}λ 이므로 위상차는 ${(a.ratio * 360).toFixed(0)}° 입니다. `;
            s += `두 파동을 더하면 합성 진폭이 2A×|cos(${(a.ratio * 180).toFixed(0)}°)| = ${a.amp.toFixed(2)}A가 됩니다. `;
            if (a.verdict === 'constructive') s += `마루와 마루가 딱 겹쳐 진폭이 한 파동의 2배가 되었습니다. 경로차가 파장의 정수배일 때 일어나는 보강 간섭입니다.`;
            else if (a.verdict === 'destructive') s += `한 파동의 마루에 다른 파동의 골이 겹쳐 완전히 사라졌습니다. 경로차가 반파장의 홀수배일 때 일어나는 상쇄 간섭입니다. 파동이 없어진 것이 아니라 서로 지운 것입니다.`;
            else s += `완전히 겹치지도, 완전히 어긋나지도 않아 진폭이 그 사이입니다. 가장 가까운 ${a.nearest}λ 로 옮기면 ${a.nearest % 1 === 0 ? '보강' : '상쇄'} 간섭이 됩니다.`;
            explanation.textContent = s;
            return;
        }
        labelA.textContent = '고유 진동수'; labelB.textContent = '파장';
        valueA.textContent = `${a.freq.toFixed(0)} Hz`;
        valueB.textContent = `${a.lambda.toFixed(2)} m`;
        predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        const twice = analyseStanding(Math.min(2, a.L * 2), a.v, a.n);
        explanation.textContent =
            `양 끝이 고정되어 있으므로 줄 길이 ${a.L.toFixed(1)} m 안에 반파장이 ${a.n}개 들어갑니다. ` +
            `그래서 파장은 2×${a.L.toFixed(1)}÷${a.n} = ${a.lambda.toFixed(2)} m 이고, ` +
            `진동수는 v/λ = ${a.v}÷${a.lambda.toFixed(2)} = ${a.freq.toFixed(0)} Hz 입니다. ` +
            `기본 진동수 ${a.base.toFixed(0)} Hz 의 정확히 ${a.n}배로, 고유 진동수는 이렇게 띄엄띄엄한 값만 가질 수 있습니다. ` +
            `마디는 ${a.nodes}개로 언제나 배보다 하나 많고, 마디에서는 두 파동이 늘 상쇄되어 줄이 전혀 움직이지 않습니다. ` +
            `줄을 ${twice.L.toFixed(1)} m로 바꾸면 같은 모드의 진동수가 ${twice.freq.toFixed(0)} Hz로 ${twice.freq < a.freq ? '낮아집니다' : '높아집니다'}.`;
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
        stageCaption.textContent = state.mode === 'superpose'
            ? '위의 두 파동을 세로로 더한 것이 아래 파동입니다.'
            : '빨간 점(마디)은 전혀 움직이지 않습니다. 눈으로 확인해 보세요.';
        changed();
    }));
    checkBtn.addEventListener('click', check);
    resetBtn.addEventListener('click', () => {
        Object.assign(state, { ratio: 0, length: 1.0, speed: 200, mode_n: 1, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'superpose').click();
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

    window.__interfModel = {
        X0, X1, LAM, AMP, ROW1, ROW2, ROW3, STRING_Y, STRING_A, SLOW, BENCH, state,
        analyseSuper, analyseStanding, analyse, render, check,
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
