document.addEventListener('DOMContentLoaded', () => {
    const controlArea = document.getElementById('controlArea');
    const predictionArea = document.getElementById('predictionArea');
    const checkBtn = document.getElementById('checkBtn');
    const resetBtn = document.getElementById('resetBtn');
    const resultEmpty = document.getElementById('resultEmpty');
    const resultContent = document.getElementById('resultContent');
    const valueA = document.getElementById('valueA');
    const valueB = document.getElementById('valueB');
    const predictionResult = document.getElementById('predictionResult');
    const explanation = document.getElementById('elementaryExplanation');
    const stageBadge = document.getElementById('stageBadge');
    const mainGroup = document.getElementById('mainGroup');
    const graphGroup = document.getElementById('graphGroup');
    const dataNote = document.getElementById('dataNote');

    const GRAPH = { x0: 62, x1: 424, y0: 152, y1: 26 };

    // Iron gains oxygen; wood loses its carbon and hydrogen as gas.
    const MATERIALS = {
        steel: { label: '강철솜', hint: '철 + 산소', eq: '4Fe + 3O₂ → 2Fe₂O₃',
                 oxygenPerGram: 48 / 111.7, ashFrac: 1, burnsAway: false },
        wood: { label: '나무', hint: '탄소·수소가 기체로', eq: 'C₆H₁₀O₅ + 6O₂ → 6CO₂ + 5H₂O',
                oxygenPerCombustible: 192 / 162.14, ashFrac: 0.03, burnsAway: true },
    };

    const state = { material: 'steel', vessel: 'open', mass: 5, progress: 0, prediction: null };
    let running = false, frameId = 0, lastStamp = 0;

    /* ------------------------------------------------------------- model */
    function analyse(s = state) {
        const mat = MATERIALS[s.material];
        const m = s.mass;
        let oxygenTotal, solidEnd, gasEnd, combustible;
        if (mat.burnsAway) {
            combustible = m * (1 - mat.ashFrac);
            oxygenTotal = combustible * mat.oxygenPerCombustible;
            solidEnd = m - combustible;
            gasEnd = combustible + oxygenTotal;   // conservation, by construction
        } else {
            combustible = 0;
            oxygenTotal = m * mat.oxygenPerGram;
            solidEnd = m + oxygenTotal;
            gasEnd = 0;
        }
        const totalBefore = m + oxygenTotal;
        const totalAfter = solidEnd + gasEnd;
        const verdict = s.vessel === 'sealed' ? 'same' : mat.burnsAway ? 'down' : 'up';
        return { mat, m, combustible, oxygenTotal, solidEnd, gasEnd, totalBefore, totalAfter, verdict, runFor: 6 };
    }

    function step(p, a) {
        const oxygen = a.oxygenTotal * p;
        const solid = a.mat.burnsAway ? a.m - a.combustible * p : a.m + oxygen;
        const gas = a.mat.burnsAway ? (a.combustible + a.oxygenTotal) * p : 0;
        const measured = state.vessel === 'sealed' ? a.totalBefore : solid;
        return { oxygen, solid, gas, measured };
    }

    const runSeconds = () => analyse().runFor;

    /* ---------------------------------------------------------- controls */
    function pickRow(legend, name, options, current, cols) {
        return `<fieldset class="pick-field"><legend>${legend}</legend>` +
            `<div class="pick-buttons cols${cols}" data-pick="${name}">` +
            options.map(o => `<button type="button" data-value="${o.value}" class="${o.value === String(current) ? 'selected' : ''}">` +
                `${o.label}${o.hint ? `<small>${o.hint}</small>` : ''}</button>`).join('') +
            `</div></fieldset>`;
    }

    function sliderRow(id, legend, min, max, step, value, scale) {
        return `<div class="range-heading"><label for="${id}">${legend}</label>` +
            `<output id="${id}Out" for="${id}"></output></div>` +
            `<input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}">` +
            `<div class="range-scale" aria-hidden="true">${scale.map(s => `<span>${s}</span>`).join('')}</div>`;
    }

    function buildControls() {
        controlArea.innerHTML =
            pickRow('태울 물질', 'material', Object.entries(MATERIALS).map(([k, v]) => ({ value: k, label: v.label, hint: v.hint })), state.material, 2) +
            pickRow('용기', 'vessel', [{ value: 'open', label: '열린 그릇', hint: '기체가 드나듦' },
                                      { value: 'sealed', label: '밀폐 용기', hint: '기체가 갇힘' }], state.vessel, 2) +
            sliderRow('massRange', '처음 질량', 1, 10, 1, state.mass, ['1g', '5g', '10g']);
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                settingsChanged();
            }));
        });
        const massRange = document.getElementById('massRange');
        massRange.addEventListener('input', () => {
            state.mass = Number(massRange.value);
            settingsChanged();
        });
    }

    const predictionButtons = [...predictionArea.querySelectorAll('button')];
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        state.prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
        predictionButtons.forEach(b => b.classList.toggle('selected', b === button));
    }));
    const clearPrediction = () => {
        state.prediction = null;
        predictionButtons.forEach(b => b.classList.remove('selected'));
    };

    /* ----------------------------------------------------------- visuals */
    let finished = false, clock = 0;
    const reducedMotion = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    const rnd = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

    function flame(cx, baseY, s, sway = 0) {
        if (s <= 0.02) return '';
        const tip = cx + sway;
        const f = (w, h, cls) => `<path class="${cls}" d="M${cx},${baseY} C${(cx - w * s).toFixed(1)},${(baseY - 0.2 * h * s).toFixed(1)} ` +
            `${(cx - 0.8 * w * s + sway * 0.4).toFixed(1)},${(baseY - 0.7 * h * s).toFixed(1)} ${tip.toFixed(1)},${(baseY - h * s).toFixed(1)} ` +
            `C${(cx + 0.8 * w * s + sway * 0.4).toFixed(1)},${(baseY - 0.7 * h * s).toFixed(1)} ${(cx + w * s).toFixed(1)},${(baseY - 0.2 * h * s).toFixed(1)} ${cx},${baseY} Z"/>`;
        return f(14, 44, 'flame') + f(7, 22, 'flame inner');
    }

    // Steel wool: a loose ball of thin curly strands. Each strand has its own moment when the glowing
    // front reaches it (left → right): grey steel → orange glow → black oxide.
    const STRANDS = Array.from({ length: 96 }, (_, i) => {
        const a = rnd(i) * Math.PI * 2, r = Math.sqrt(rnd(i + 99));
        const x = Math.cos(a) * r * 46, y = Math.sin(a) * r * 20;
        const loops = [];
        for (let k = 0; k < 3; k += 1) loops.push({ dx: (rnd(i * 7 + k) - 0.5) * 16, dy: (rnd(i * 13 + k) - 0.5) * 10, s: 4 + rnd(i * 3 + k) * 5 });
        return { x, y, loops, shade: rnd(i + 7), thr: Math.min(0.88, Math.max(0, (x + 50) / 100 * 0.8 + (rnd(i + 3) - 0.5) * 0.12)) };
    });

    const VERDICT = { up: '질량이 늘어난다', same: '질량이 그대로다', down: '질량이 줄어든다' };
    const TONE = { up: '#0369a1', same: '#047857', down: '#c2410c' };

    function renderMain(a) {
        const p = state.progress;
        const st = step(p, a);
        const CX = 180, PAN = 188, BENCH = 240;
        const live = running && p > 0 && p < 1;
        let out = '';

        out += `<rect x="0" y="${BENCH}" width="460" height="10" fill="#eadfcd"/><line x1="0" y1="${BENCH}" x2="460" y2="${BENCH}" stroke="#c7b79c" stroke-width="2"/>`;
        // electronic balance
        out += `<path d="M${CX - 92},${BENCH} L${CX - 84},${PAN + 6} H${CX + 84} L${CX + 92},${BENCH} Z" fill="#e2e8f0" stroke="#64748b" stroke-width="1.8"/>`;
        out += `<rect x="${CX - 88}" y="${PAN}" width="176" height="7" rx="3" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>`;
        out += `<rect x="${CX - 46}" y="${PAN + 15}" width="92" height="24" rx="4" fill="#ecfdf5" stroke="#64748b" stroke-width="1.4"/>`;
        out += `<text class="balance-read" x="${CX}" y="${PAN + 33}" text-anchor="middle">${st.measured.toFixed(2)} g</text>`;
        out += `<text class="small-label" x="${CX + 100}" y="${PAN + 30}">전자저울</text>`;

        // evaporating dish
        out += `<path d="M${CX - 66},${PAN - 26} Q${CX - 60},${PAN} ${CX - 30},${PAN} H${CX + 30} Q${CX + 60},${PAN} ${CX + 66},${PAN - 26} Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>`;

        const sampleCY = PAN - 34;
        if (state.material === 'steel') {
            // the soft woolly mass behind the strands, darkening where the steel has burnt
            const burntFrac = Math.min(1, p / 0.95);
            out += `<defs><linearGradient id="woolBody" x1="0" x2="1"><stop offset="${Math.max(0, burntFrac - 0.08).toFixed(2)}" stop-color="${p > 0 ? '#4b5057' : '#c4cbd1'}"/><stop offset="${Math.min(1, burntFrac + 0.04).toFixed(2)}" stop-color="#c4cbd1"/></linearGradient></defs>`;
            out += `<ellipse cx="${CX}" cy="${sampleCY + 2}" rx="54" ry="26" fill="url(#woolBody)" opacity=".75"/>`;
            STRANDS.forEach((s, i) => {
                let col;
                if (p <= s.thr || p === 0) col = s.shade < 0.33 ? '#8a949c' : s.shade < 0.66 ? '#a7b0b7' : '#cfd5da';
                else if (p < s.thr + 0.14 && p < 1) col = s.shade < 0.5 ? '#f97316' : '#fbbf24';
                else col = s.shade < 0.5 ? '#1f2328' : '#363b42';
                let d = `M${(CX + s.x).toFixed(1)},${(sampleCY + s.y).toFixed(1)}`;
                s.loops.forEach(l => { d += ` c${l.s},${-l.s} ${l.dx + l.s},${l.dy - l.s * 0.3} ${l.dx},${l.dy}`; });
                out += `<path d="${d}" fill="none" stroke="${col}" stroke-width="1.2" stroke-linecap="round"/>`;
            });
            if (live) {
                // sparks spitting from the glowing front
                const fx = CX - 50 + Math.min(1, p / 0.88) * 100;
                for (let k = 0; k < 9; k += 1) {
                    const u = ((clock / 520) + rnd(k)) % 1, ang = -Math.PI / 2 + (rnd(k + 20) - 0.5) * 2.2;
                    const r = 6 + u * 34;
                    out += `<circle cx="${(fx + Math.cos(ang) * r).toFixed(1)}" cy="${(sampleCY - 6 + Math.sin(ang) * r + u * u * 16).toFixed(1)}" r="${(1.8 - u).toFixed(2)}" fill="#f59e0b" opacity="${(1 - u).toFixed(2)}"/>`;
                }
            }
            out += `<text class="small-label" x="${CX - 80}" y="${sampleCY - 26}" text-anchor="end">강철솜</text>`;
        } else {
            const left = 1 - 0.9 * p;
            const char = Math.min(1, p * 1.6);
            const wood = `rgb(${Math.round(180 - 130 * char)},${Math.round(110 - 75 * char)},${Math.round(50 - 25 * char)})`;
            // ash pile grows as the sticks shrink
            if (p > 0) out += `<ellipse cx="${CX}" cy="${PAN - 6}" rx="${(10 + 30 * p).toFixed(1)}" ry="${(2 + 5 * p).toFixed(1)}" fill="#9ca3af"/>`;
            [[-22, -8], [22, -8], [0, -26]].forEach(([dx, dy], k) => {
                const w = 56 * left, h = 15 * Math.max(0.25, left);
                if (left < 0.13) return;
                out += `<rect x="${(CX + dx - w / 2).toFixed(1)}" y="${(PAN - 8 + dy - h).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${(h / 2).toFixed(1)}" fill="${wood}" stroke="#5b3a1a" stroke-width="1.3"/>`;
                out += `<ellipse cx="${(CX + dx + w / 2 - 3).toFixed(1)}" cy="${(PAN - 8 + dy - h / 2).toFixed(1)}" rx="3" ry="${(h / 2 - 1).toFixed(1)}" fill="#d9a066" opacity="${(1 - char).toFixed(2)}"/>`;
                void k;
            });
            if (live) {
                const s = 0.5 + 0.6 * Math.sin(Math.PI * Math.min(1, p * 1.15));
                out += flame(CX, PAN - 30 * Math.max(0.35, left), s * (1 + 0.07 * Math.sin(clock / 80)), Math.sin(clock / 130) * 3);
            }
            out += `<text class="small-label" x="${CX - 80}" y="${sampleCY - 10}" text-anchor="end">나무</text>`;
        }

        // gas moving in or out (open dish) or trapped (sealed jar)
        const sealed = state.vessel === 'sealed';
        if (sealed) {
            out += `<path class="glass" d="M${CX - 78},${PAN} L${CX - 78},74 Q${CX - 78},60 ${CX - 64},60 L${CX + 64},60 Q${CX + 78},60 ${CX + 78},74 L${CX + 78},${PAN}"/>`;
            out += `<path d="M${CX - 70},76 V${PAN - 12}" stroke="#ffffff" stroke-width="3" opacity=".8"/>`;
            out += `<text class="small-label" x="${CX}" y="52" text-anchor="middle">밀폐 용기</text>`;
        }
        if (live || (p > 0 && sealed)) {
            const steelIn = !a.mat.burnsAway;
            for (let k = 0; k < 10; k += 1) {
                const u = ((clock / 2200) + k / 10) % 1;
                let x, y, op;
                if (sealed) {
                    const ang = k * 0.63 + clock / 1400 * (k % 2 ? 1 : -1);
                    x = CX + Math.cos(ang) * (36 + (k % 3) * 10); y = 104 + Math.sin(ang) * 26; op = 0.75;
                } else if (steelIn) {
                    x = CX - 60 + (k % 5) * 30 + Math.sin(u * 6 + k) * 4; y = 40 + u * (sampleCY - 52); op = Math.min(1, (1 - u) * 3);
                } else {
                    x = CX - 40 + (k % 5) * 20 + Math.sin(u * 5 + k) * 8; y = PAN - 60 - u * 120; op = Math.max(0, 0.85 - u);
                }
                if (y < 6) continue;
                if (steelIn) out += `<g opacity="${op.toFixed(2)}"><circle cx="${(x - 3).toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="#38bdf8" stroke="#0369a1" stroke-width="1"/><circle cx="${(x + 3).toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="#38bdf8" stroke="#0369a1" stroke-width="1"/></g>`;
                else out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${4 + (k % 3)}" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1" opacity="${op.toFixed(2)}"/>`;
            }
            if (!sealed && live) out += `<text class="small-label" x="${CX - 84}" y="${steelIn ? 70 : 60}" text-anchor="end" style="fill:${steelIn ? '#0369a1' : '#475569'}">${steelIn ? '산소 O₂' : '기체 CO₂·H₂O'}</text>`;
        }

        out += `<text class="note-text" x="312" y="58">처음 고체 ${a.m.toFixed(2)} g</text>`;
        out += `<text class="note-text" x="312" y="80">지금 고체 ${st.solid.toFixed(2)} g</text>`;
        out += `<text class="note-text" x="312" y="102">결합한 산소 ${st.oxygen.toFixed(2)} g</text>`;
        out += `<text class="note-text" x="312" y="124">생긴 기체 ${st.gas.toFixed(2)} g</text>`;

        if (finished) {
            const text = `${a.mat.label} · ${state.vessel === 'open' ? '열린 그릇' : '밀폐 용기'} → ${VERDICT[a.verdict]}`;
            out += `<text class="verdict-text" fill="${TONE[a.verdict]}" x="14" y="24">${text}</text>`;
        }
        window.scienceScene.render(mainGroup,out);
    }

    /* ------------------------------------------------------------- graph */
    function niceStep(max) { for (const s of [0.5, 1, 2, 5, 10]) if (max / s <= 6) return s; return 10; }

    function graph(a) {
        const st = step(state.progress, a);
        const started = state.progress > 0;
        const rows = [
            ['반응 전 고체', a.m, '#7fa7b5', true],
            [finished ? '반응 후 고체' : '지금 고체', st.solid, a.mat.burnsAway ? '#ea580c' : '#0284c7', started],
            ['반응 전 전체', a.totalBefore, '#059669', finished],
            ['반응 후 전체', a.totalAfter, '#047857', finished],
        ];
        // the axis depends only on the starting mass, so its length gives nothing away
        const stepV = niceStep(a.m * 2.2), max = Math.ceil(a.m * 2.2 / stepV) * stepV;
        const L = 150, R = 404, Y0 = 160;
        const gx = v => L + (v / max) * (R - L);
        let out = '';
        for (let v = 0; v <= max + 1e-9; v += stepV) {
            out += `<line class="grid-line" x1="${gx(v).toFixed(1)}" y1="20" x2="${gx(v).toFixed(1)}" y2="${Y0}"/>`;
            out += `<text class="axis-text" x="${gx(v).toFixed(1)}" y="${Y0 + 17}" text-anchor="middle">${+v.toFixed(1)}</text>`;
        }
        out += `<line class="axis" x1="${L}" y1="${Y0}" x2="${R}" y2="${Y0}"/><line class="axis" x1="${L}" y1="20" x2="${L}" y2="${Y0}"/>`;
        out += `<text class="axis-name" x="${R}" y="${Y0 + 34}" text-anchor="end">질량 (g)</text>`;
        rows.forEach(([name, value, colour, show], i) => {
            const y = 40 + i * 32;
            out += `<text class="bar-name" x="${L - 8}" y="${y + 5}" text-anchor="end">${name}</text>`;
            if (!show) return;
            out += `<rect class="bar" x="${L}" y="${y - 8}" width="${Math.max(2, gx(value) - L).toFixed(1)}" height="16" rx="3" fill="${colour}" opacity=".85"/>`;
            out += `<text class="bar-text" fill="#0f172a" x="${(gx(value) + 6).toFixed(1)}" y="${y + 5}">${value.toFixed(2)} g</text>`;
        });
        return out;
    }

    const eqHtml = s => s.replace(/[₀-₉]+/g, m => `<sub>${[...m].map(c => c.charCodeAt(0) - 0x2080).join('')}</sub>`);

    function noteFor(a) {
        const st = step(state.progress, a);
        return `<div class="data-row"><span class="data-name">반응식</span><span class="data-val">${eqHtml(a.mat.eq)}</span></div>` +
            `<div class="data-row"><span class="data-name">고체</span><span class="data-val">${a.m.toFixed(2)} g → ${finished ? a.solidEnd.toFixed(2) + ' g' : st.solid.toFixed(2) + ' g (지금)'}</span></div>` +
            (finished ? `<div class="data-row"><span class="data-name">주고받은 기체</span><span class="data-val">산소 ${a.oxygenTotal.toFixed(2)} g 결합 · 기체 ${a.gasEnd.toFixed(2)} g 생성</span></div>` : '') +
            `<div class="data-row"><span class="data-name">저울 눈금</span><span class="data-val">${st.measured.toFixed(2)} g</span></div>` +
            (finished ? `<div class="data-row match"><span class="data-name">전체 질량</span><span class="data-val">${a.totalBefore.toFixed(2)} g → ${a.totalAfter.toFixed(2)} g (변하지 않습니다)</span></div>` : '');
    }

    function render() {
        const a = analyse();
        renderMain(a);
        window.scienceScene.render(graphGroup,graph(a));
        const mOut = document.getElementById('massRangeOut');
        if (mOut) mOut.textContent = `${state.mass} g`;
        stageBadge.textContent = finished ? `${a.mat.label} · ${VERDICT[a.verdict]}` : running ? `${a.mat.label} · 실험 중` : `${a.mat.label} · 준비`;
        window.scienceScene.render(dataNote,noteFor(a));
        return a;
    }

    /* --------------------------------------------------------------- run */
    function tick(dt) {
        state.progress = Math.min(1, state.progress + dt / runSeconds());
        render();
        return state.progress >= 1;
    }

    function stopRun() { running = false; if (frameId) cancelAnimationFrame(frameId); frameId = 0; }

    function frame(stamp) {
        if (!running) return;
        clock = stamp;
        const dt = Math.min(0.05, (stamp - lastStamp) / 1000 || 0);
        lastStamp = stamp;
        if (tick(dt)) { stopRun(); finish(); } else frameId = requestAnimationFrame(frame);
    }

    function startRun() {
        stopRun();
        state.progress = 0;
        finished = false;
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        if (reducedMotion()) { state.progress = 1; finish(); return; }
        running = true;
        clock = lastStamp = performance.now();
        render();
        frameId = requestAnimationFrame(frame);
    }

    function finish() {
        finished = true;
        const a = render();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        // both readings must come from the same meter: in a sealed vessel the
        // starting reading already includes the trapped air.
        const st0 = step(0, a), st = step(1, a);
        valueA.textContent = `${st0.measured.toFixed(2)} g → ${st.measured.toFixed(2)} g`;
        valueB.textContent = `${a.totalBefore.toFixed(2)} g 그대로`;
        predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        let s = '';
        if (state.vessel === 'sealed') {
            s = `밀폐 용기에서는 드나드는 기체가 없어 저울 눈금이 ${a.totalBefore.toFixed(2)} g 그대로입니다. ` +
                (a.mat.burnsAway
                    ? `나무가 타서 생긴 기체 ${a.gasEnd.toFixed(2)} g이 용기 안에 그대로 남아 있기 때문입니다.`
                    : `강철솜이 결합한 산소 ${a.oxygenTotal.toFixed(2)} g도 원래 용기 안의 공기에서 온 것이기 때문입니다.`) +
                ` 반응 전 ${a.totalBefore.toFixed(2)} g, 반응 후 ${a.totalAfter.toFixed(2)} g으로 질량은 보존됩니다.`;
        } else if (a.mat.burnsAway) {
            s = `열린 그릇에서는 타서 생긴 기체 ${a.gasEnd.toFixed(2)} g이 날아가 버립니다. ` +
                `그래서 저울에는 재 ${a.solidEnd.toFixed(2)} g만 남아 줄어든 것처럼 보입니다. ` +
                `하지만 날아간 기체까지 세면 ${a.totalBefore.toFixed(2)} g 그대로입니다.`;
        } else {
            s = `열린 그릇에서는 공기 중의 산소 ${a.oxygenTotal.toFixed(2)} g이 철과 결합해 들어옵니다. ` +
                `그래서 ${a.m.toFixed(2)} g이던 강철솜이 ${a.solidEnd.toFixed(2)} g으로 늘어납니다. ` +
                `타면 가벼워질 것 같지만, 금속은 산소가 붙기 때문에 오히려 무거워집니다.`;
        }
        explanation.textContent = s;
    }

    function settingsChanged() {
        stopRun();
        state.progress = 0;
        finished = false;
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        render();
    }

    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { material: 'steel', vessel: 'open', mass: 5, progress: 0 });
        clearPrediction();
        buildControls();
        settingsChanged();
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

    window.__oxideModel = {
        MATERIALS, state,
        analyse, step, render, runSeconds,
        set(key, value) { state[key] = value; buildControls(); settingsChanged(); },
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
