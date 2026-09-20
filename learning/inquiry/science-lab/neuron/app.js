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

    /* --- 긴 설명은 그림 밖으로: 액자를 벗어나는 글자와 판정·주석은 HTML로 옮긴다 --- */
    const stageVerdict = document.getElementById('stageVerdict');
    const stageReadout = document.getElementById('stageReadout');
    const stageNote = document.getElementById('stageNote');
    const mainSvg = document.querySelector('.main-svg');
    const graphSvg = document.querySelector('.graph-svg');
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
        [[mainGroup, mainSvg], [graphGroup, graphSvg]].forEach(([g, svg]) => {
            if (!g || !svg) return;
            const vb = svg.viewBox.baseVal, W = vb.width, H = vb.height;
            [...g.querySelectorAll('text')].forEach(t => {
                const cls = t.getAttribute('class') || '';
                const must = /verdict-text|note-text/.test(cls) || /prose/.test(cls);
                let b; try { b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); } catch (e) { return; }
                const out = b.x < -0.5 || b.x + b.width > W + 0.5 || b.y + b.height > H + 0.5 || b.y < -0.5;
                if (must || out) takeOut(t);
            });
            const items = [...g.querySelectorAll('text')].map(t => { let b; try { b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); } catch (e) { b = null; } return { t, b, len: t.textContent.trim().length }; }).filter(o => o.b);
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
        if (stageVerdict) stageVerdict.textContent = verdicts.join(' ');
        if (stageReadout) stageReadout.innerHTML = rows.map(r => `<span${r.fill ? ` style="color:${r.fill}"` : ''}>${r.txt}</span>`).join('');
        if (stageNote) stageNote.textContent = notes.join(' ');
    }

    /* -------------------------------------------------------------- data */
    // Stimulus: current density on a patch of squid axon membrane, from t = 5 ms.
    const STIMS = { weak: { label: '약하게', hint: '1.5 μA/cm²', I: 1.5 }, mid: { label: '문턱 넘게', hint: '10 μA/cm²', I: 10 }, strong: { label: '아주 세게', hint: '40 μA/cm²', I: 40 } };
    const DURS = { short: { label: '짧게 1 ms', ms: 1 }, long: { label: '길게 25 ms', ms: 25 } };
    const T_END = 40, T_ON = 5, SAMPLE = 0.05, REST = -65, THRESHOLD = -55;

    // Axons: how fast an impulse travels, and a metre to cover.
    const AXONS = {
        thin: { label: '말이집 없음 · 얇음', hint: '지름 1 μm, 통각 신경', v: 1, myelin: false, width: 6 },
        squid: { label: '말이집 없음 · 굵음', hint: '지름 0.5 mm, 오징어 거대 축삭', v: 25, myelin: false, width: 26 },
        myelin: { label: '말이집 있음', hint: '지름 20 μm, 사람 운동 신경', v: 100, myelin: true, width: 12 },
    };
    const DIST_M = 1;

    // Synapse: transmitter is cleared half by reuptake and half by an enzyme.
    const DRUGS = {
        normal: { label: '정상', hint: '약물 없음', kRe: 0.5, kEnz: 0.5, receptor: 1 },
        blocker: { label: '수용체 막힘', hint: '예: 쿠라레', kRe: 0.5, kEnz: 0.5, receptor: 0 },
        reuptake: { label: '재흡수 막힘', hint: '예: 우울증 치료약', kRe: 0, kEnz: 0.5, receptor: 1 },
        enzyme: { label: '분해 효소 억제', hint: '예: 살충제·신경 가스', kRe: 0.5, kEnz: 0, receptor: 1 },
    };
    const SYN_END = 12, SYN_RELEASE = 1, SYN_DELAY = 0.5, EPSP_GAIN = 6, EPSP_TAU = 2;

    const state = { mode: 'spike', stim: 'mid', dur: 'long', axon: 'myelin', drug: 'normal', progress: 0, prediction: null };
    let running = false, frameId = 0, lastStamp = 0;

    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const fmtN = n => Math.round(n).toLocaleString('ko-KR');

    /* ------------------------------------------------------------ models */
    // Hodgkin–Huxley membrane (squid giant axon, 6.3 ℃ parameters, potentials in mV, time in ms)
    const hhCache = {};
    function hhRun(I, dur) {
        const key = `${I}|${dur}`;
        if (hhCache[key]) return hhCache[key];
        const gNa = 120, gK = 36, gL = 0.3, ENa = 50, EK = -77, EL = -54.4, C = 1, dt = 0.01;
        const an = V => 0.01 * (V + 55) / (1 - Math.exp(-(V + 55) / 10)), bn = V => 0.125 * Math.exp(-(V + 65) / 80);
        const am = V => 0.1 * (V + 40) / (1 - Math.exp(-(V + 40) / 10)), bm = V => 4 * Math.exp(-(V + 65) / 18);
        const ah = V => 0.07 * Math.exp(-(V + 65) / 20), bh = V => 1 / (1 + Math.exp(-(V + 35) / 10));
        let V = -65, m = 0.0529, h = 0.5961, n = 0.3177;
        const out = { t: [], V: [], na: [], k: [], iNa: [], iK: [], spikes: [] };
        let prev = V, step = 0, peak = -100, rising = false;
        for (let t = 0; t <= T_END + 1e-9; t += dt, step += 1) {
            if (step % Math.round(SAMPLE / dt) === 0) { out.t.push(Number(t.toFixed(2))); out.V.push(V); out.na.push(m ** 3 * h); out.k.push(n ** 4); out.iNa.push(gNa * m ** 3 * h * (V - ENa)); out.iK.push(gK * n ** 4 * (V - EK)); }
            const Iext = (t >= T_ON && t < T_ON + dur) ? I : 0;
            const INa = gNa * m ** 3 * h * (V - ENa), IK = gK * n ** 4 * (V - EK), IL = gL * (V - EL);
            m += dt * (am(V) * (1 - m) - bm(V) * m); h += dt * (ah(V) * (1 - h) - bh(V) * h); n += dt * (an(V) * (1 - n) - bn(V) * n);
            V += dt * (Iext - INa - IK - IL) / C;
            if (prev < 0 && V >= 0) { rising = true; peak = V; }
            else if (rising) { if (V >= peak) peak = V; else { out.spikes.push({ t: Number(t.toFixed(2)), peak }); rising = false; } }
            prev = V;
        }
        hhCache[key] = out;
        return out;
    }
    const sampleAt = (run, t) => { const i = clamp(Math.round(t / SAMPLE), 0, run.t.length - 1); return { V: run.V[i], na: run.na[i], k: run.k[i], iNa: run.iNa[i], iK: run.iK[i] }; };

    // synapse kinetics: cleft transmitter decays at kRe + kEnz; the next cell's potential follows it
    const synCache = {};
    function synRun(drugKey) {
        if (synCache[drugKey]) return synCache[drugKey];
        const d = DRUGS[drugKey], dt = 0.01;
        const out = { t: [], T: [], P: [] };
        let P = 0, step = 0, peak = 0;
        for (let t = 0; t <= SYN_END + 1e-9; t += dt, step += 1) {
            const T = t >= SYN_RELEASE ? Math.exp(-(d.kRe + d.kEnz) * (t - SYN_RELEASE)) : 0;
            if (step % 5 === 0) { out.t.push(Number(t.toFixed(2))); out.T.push(T); out.P.push(P); }
            P += dt * (EPSP_GAIN * T * d.receptor - P / EPSP_TAU);
            peak = Math.max(peak, P);
        }
        out.peak = peak;
        out.duration = out.t.filter((_, i) => out.P[i] > 1).length * 0.05;      // ms above 1 mV
        synCache[drugKey] = out;
        return out;
    }

    function analyse() {
        if (state.mode === 'spike') {
            const st = STIMS[state.stim], du = DURS[state.dur];
            const run = hhRun(st.I, du.ms);
            const n = run.spikes.length;
            return { kind: 'spike', st, du, run, n, verdict: n === 0 ? 'none' : n === 1 ? 'one' : 'many' };
        }
        if (state.mode === 'conduct') {
            const ax = AXONS[state.axon];
            const ms = DIST_M / ax.v * 1000;
            return { kind: 'conduct', ax, ms, verdict: ms <= 15 ? 'fast' : ms <= 100 ? 'mid' : 'slow' };
        }
        const d = DRUGS[state.drug], run = synRun(state.drug), normal = synRun('normal');
        const verdict = run.peak < 0.5 ? 'none' : run.duration >= 1.6 * normal.duration ? 'long' : 'normal';
        return { kind: 'synapse', d, run, normal, verdict };
    }
    const runSeconds = () => state.mode === 'spike' ? 6 : state.mode === 'conduct' ? 6 : 6;

    /* ---------------------------------------------------------- controls */
    function pickRow(legend, name, options, current, cols) {
        return `<fieldset class="pick-field"><legend>${legend}</legend>` +
            `<div class="pick-buttons cols${cols}" data-pick="${name}">` +
            options.map(o => `<button type="button" data-value="${o.value}" class="${o.value === String(current) ? 'selected' : ''}">` +
                `${o.label}${o.hint ? `<small>${o.hint}</small>` : ''}</button>`).join('') +
            `</div></fieldset>`;
    }
    const opts = table => Object.entries(table).map(([k, v]) => ({ value: k, label: v.label, hint: v.hint }));

    function buildControls() {
        if (state.mode === 'spike') controlArea.innerHTML = pickRow('자극의 세기', 'stim', opts(STIMS), state.stim, 3) + pickRow('자극 시간', 'dur', opts(DURS), state.dur, 2);
        else if (state.mode === 'conduct') controlArea.innerHTML = pickRow('축삭', 'axon', opts(AXONS), state.axon, 3);
        else controlArea.innerHTML = pickRow('시냅스에 끼어드는 것', 'drug', opts(DRUGS), state.drug, 2);
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                buildPrediction();
                settingsChanged();
            }));
        });
    }

    const PRED_SPIKE = [{ value: 'none', label: '활동 전위가 생기지 않는다' }, { value: 'one', label: '한 번 생기고 크기는 정해져 있다' }, { value: 'many', label: '여러 번 되풀이해 생긴다' }];
    const PRED_CONDUCT = [{ value: 'fast', label: '10 ms 안' }, { value: 'mid', label: '수십 ms' }, { value: 'slow', label: '1초 가까이' }];
    const PRED_SYN = [{ value: 'normal', label: '평소처럼 짧게 한 번 반응' }, { value: 'none', label: '반응하지 않는다' }, { value: 'long', label: '반응이 오래 이어진다' }];

    function buildPrediction() {
        const list = state.mode === 'spike' ? PRED_SPIKE : state.mode === 'conduct' ? PRED_CONDUCT : PRED_SYN;
        predictionLegend.textContent = state.mode === 'spike' ? `${STIMS[state.stim].hint} 전류를 ${DURS[state.dur].label.replace('짧게 ', '').replace('길게 ', '')} 동안 흘리면?`
            : state.mode === 'conduct' ? `${AXONS[state.axon].label} 축삭에서 흥분이 1 m를 가는 데 걸리는 시간은?`
                : `${DRUGS[state.drug].label}${state.drug === 'normal' ? '일' : '이'} 때 다음 신경 세포는?`;
        predictionArea.className = 'prediction-buttons three';
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction;
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    function renderSpike(a) {
        const t = state.progress * T_END;
        const s = sampleAt(a.run, t);
        const stimOn = t >= T_ON && t < T_ON + a.du.ms;
        const MY = 96, MH = 28, X0 = 20, X1 = 300;
        let out = `<text class="trait-text" x="${X0}" y="40">세포 밖 — Na⁺ 많음</text><text class="trait-text" x="${X0}" y="190">세포 안 — K⁺ 많음</text>`;
        out += `<rect class="membrane" x="${X0}" y="${MY}" width="${X1 - X0}" height="${MH}" rx="3"/>`;
        // channels: the gap opens with the fraction of open gates
        const draw = (x, cls, open) => { const gap = 2 + 9 * open; out += `<rect class="channel ${cls}" x="${x - 9}" y="${MY - 2}" width="${(9 - gap / 2).toFixed(1)}" height="${MH + 4}" rx="2"/><rect class="channel ${cls}" x="${(x + gap / 2).toFixed(1)}" y="${MY - 2}" width="${(9 - gap / 2).toFixed(1)}" height="${MH + 4}" rx="2"/>`; };
        for (let k = 0; k < 5; k += 1) draw(44 + k * 52, 'na', s.na / 0.35);
        for (let k = 0; k < 5; k += 1) draw(70 + k * 52, 'k', s.k / 0.6);
        // ions on the move: sodium in while its current flows, potassium out
        const naDots = Math.min(3, Math.floor(Math.abs(s.iNa) / 120)), kDots = Math.min(3, Math.floor(Math.abs(s.iK) / 120));
        for (let k = 0; k < 5; k += 1) for (let d = 0; d < naDots; d += 1) { const f = ((t * 2.3 + k * 0.29 + d * 0.41) % 1); const y = 66 + f * 88; out += `<circle class="ion na" cx="${44 + k * 52}" cy="${y.toFixed(1)}" r="4"/><text class="ion-text" x="${44 + k * 52}" y="${(y + 2.5).toFixed(1)}" text-anchor="middle">+</text>`; }
        for (let k = 0; k < 5; k += 1) for (let d = 0; d < kDots; d += 1) { const f = ((t * 1.7 + k * 0.31 + d * 0.43) % 1); const y = 154 - f * 88; out += `<circle class="ion k" cx="${70 + k * 52}" cy="${y.toFixed(1)}" r="4"/><text class="ion-text" x="${70 + k * 52}" y="${(y + 2.5).toFixed(1)}" text-anchor="middle">+</text>`; }
        if (stimOn) out += `<line class="electrode" x1="160" y1="48" x2="160" y2="${MY - 4}"/><text class="trait-text" style="fill:#ff7a59" x="166" y="60">자극 전류 ${a.st.I} μA/cm²</text>`;
        // the meter
        const MX = 330, MTOP = 50, MBOT = 170;
        const yOf = V => MBOT - (V + 90) / 140 * (MBOT - MTOP);
        out += `<rect class="meter" x="${MX}" y="${MTOP}" width="22" height="${MBOT - MTOP}" rx="3"/>`;
        out += `<rect class="meter-fill" x="${MX + 3}" y="${Math.min(yOf(s.V), yOf(REST)).toFixed(1)}" width="16" height="${Math.abs(yOf(s.V) - yOf(REST)).toFixed(1)}"/>`;
        [[50, '+50', 3], [0, '0', 3], [-55, '문턱', -6], [-65, '휴지', 6], [-90, '−90', 4]].forEach(([v, lab, dy]) => { out += `<line class="ref-line ${v === -55 ? 'threshold' : ''}" x1="${MX - 4}" y1="${yOf(v).toFixed(1)}" x2="${MX + 26}" y2="${yOf(v).toFixed(1)}"/><text class="small-label" x="${MX - 6}" y="${(yOf(v) + dy).toFixed(1)}" text-anchor="end">${lab}</text>`; });
        out += `<text class="gen-text" x="${MX + 34}" y="60">${s.V >= 0 ? '+' : ''}${s.V.toFixed(0)} mV</text>`;
        out += `<text class="trait-text" style="fill:#0284c7" x="${MX + 34}" y="80">Na⁺ 통로 ${Math.round(s.na / 0.35 * 100)} %</text>`;
        out += `<text class="trait-text" style="fill:#ffb347" x="${MX + 34}" y="96">K⁺ 통로 ${Math.round(s.k / 0.6 * 100)} %</text>`;
        out += `<text class="trait-text" x="${MX + 34}" y="120">${t.toFixed(1)} ms</text>`;
        const seen = a.run.spikes.filter(sp => sp.t <= t).length;
        out += `<text class="trait-text" style="fill:#d97706" x="${MX + 34}" y="140">활동 전위 ${seen}번</text>`;
        out += `<text class="small-label" x="${MX + 34}" y="160">${stimOn ? '자극 중' : t < T_ON ? '자극 전' : '자극 뒤'}</text>`;
        const VERD = { none: '생기지 않음', one: '한 번, 정해진 크기', many: '되풀이해 생김' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${state.progress >= 1 ? `${a.st.hint} · ${a.du.label}: 활동 전위 ${a.n}번 → ${VERD[a.verdict]}${a.n ? ` (꼭대기 +${Math.round(a.run.spikes[0].peak)} mV)` : ''}` : `${a.st.label} (${a.st.hint}) · ${a.du.label}`}</text>`;
        out += `<text class="note-text" x="20" y="208">통로 그림은 열린 비율(최대 열림 = 100 %) · 이온 알갱이는 전류가 흐를 때만 · 호지킨–헉슬리 방정식으로 계산</text>`;
        return out;
    }

    function graphSpike(a) {
        const t = state.progress * T_END;
        const X0 = 50, X1 = 430, Y0 = 150, Y1 = 40;
        const xOf = tt => X0 + tt / T_END * (X1 - X0), yOf = V => Y0 - (V + 90) / 140 * (Y0 - Y1);
        let out = `<text class="axis-title" x="${X0}" y="18">막전위–시간 — 붉은 띠가 자극, 주황 점선이 문턱</text>`;
        [[50, '+50'], [0, '0'], [-50, '−50'], [-90, '−90']].forEach(([v, lab]) => { out += `<line class="grid-line" x1="${X0}" y1="${yOf(v).toFixed(1)}" x2="${X1}" y2="${yOf(v).toFixed(1)}"/><text class="axis-text" x="${X0 - 6}" y="${(yOf(v) + 3.5).toFixed(1)}" text-anchor="end">${lab}</text>`; });
        out += `<line class="ref-line threshold" x1="${X0}" y1="${yOf(THRESHOLD).toFixed(1)}" x2="${X1}" y2="${yOf(THRESHOLD).toFixed(1)}"/><text class="small-label" style="fill:#ffb347" x="${X1}" y="${(yOf(THRESHOLD) - 3).toFixed(1)}" text-anchor="end">문턱 −55 mV</text>`;
        out += `<line class="ref-line" x1="${X0}" y1="${yOf(REST).toFixed(1)}" x2="${X1}" y2="${yOf(REST).toFixed(1)}"/><text class="small-label" x="${X1}" y="${(yOf(REST) + 11).toFixed(1)}" text-anchor="end">휴지 −65 mV</text>`;
        for (let tt = 0; tt <= T_END; tt += 10) out += `<text class="axis-text" x="${xOf(tt).toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${tt}</text>`;
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        out += `<rect fill="#ff7a59" x="${xOf(T_ON).toFixed(1)}" y="${Y0 + 2}" width="${(xOf(T_ON + a.du.ms) - xOf(T_ON)).toFixed(1)}" height="4" rx="1"/>`;
        let d = '';
        const iMax = clamp(Math.round(t / SAMPLE), 0, a.run.t.length - 1);
        for (let i = 0; i <= iMax; i += 1) d += `${i ? 'L' : 'M'}${xOf(a.run.t[i]).toFixed(1)},${yOf(a.run.V[i]).toFixed(1)} `;
        out += `<path class="trace" style="stroke:#059669" d="${d}"/>`;
        a.run.spikes.filter(sp => sp.t <= t).forEach((sp, i) => { out += `<text class="small-label" style="fill:#d97706" x="${clamp(xOf(sp.t), X0 + 14, X1 - 14).toFixed(1)}" y="${(yOf(sp.peak) - 5).toFixed(1)}" text-anchor="middle">+${Math.round(sp.peak)}</text>`; void i; });
        out += `<text class="axis-title" x="${((X0 + X1) / 2).toFixed(1)}" y="${Y0 + 30}" text-anchor="middle">시간 (ms) — 막전위 (mV, 세포 안이 밖보다 얼마나 높은가)</text>`;
        return out;
    }

    function renderConduct(a) {
        const p = state.progress;
        const { ax } = a;
        const AX0 = 46, AX1 = 424, AY = 104;
        let out = `<circle class="axon" cx="${AX0 - 6}" cy="${AY}" r="20"/><text class="small-label" x="${AX0 - 6}" y="${AY + 34}" text-anchor="middle">신경 세포체</text>`;
        out += `<rect class="axon" x="${AX0}" y="${AY - ax.width / 2}" width="${AX1 - AX0}" height="${ax.width}" rx="${ax.width / 2}"/>`;
        const nodes = 12;
        if (ax.myelin) for (let k = 0; k < nodes; k += 1) { const x = AX0 + 6 + k * (AX1 - AX0 - 12) / nodes; out += `<rect class="myelin" x="${x.toFixed(1)}" y="${AY - ax.width / 2 - 5}" width="${((AX1 - AX0 - 12) / nodes - 5).toFixed(1)}" height="${ax.width + 10}" rx="4"/>`; }
        out += `<text class="small-label" x="${AX1 + 4}" y="${AY + 3}">근육</text>`;
        // the impulse: smooth on a bare axon, node to node on a myelinated one
        let ix = AX0 + p * (AX1 - AX0);
        if (ax.myelin) { const k = Math.min(nodes, Math.floor(p * (nodes + 0.999))); ix = k >= nodes ? AX1 : AX0 + 3 + k * (AX1 - AX0 - 12) / nodes; }
        if (p > 0 && p < 1) { out += `<circle class="impulse-glow" cx="${ix.toFixed(1)}" cy="${AY}" r="${ax.width / 2 + 10}"/><circle class="impulse" cx="${ix.toFixed(1)}" cy="${AY}" r="${ax.width / 2 + 3}"/>`; }
        const ms = p * a.ms;
        out += `<text class="gen-text" x="20" y="158">${(p * DIST_M * 100).toFixed(0)} cm 옴 · ${ms < 100 ? ms.toFixed(1) : fmtN(ms)} ms</text>`;
        out += `<text class="trait-text" x="20" y="174">${ax.label} — ${ax.hint} · 초속 ${ax.v} m</text>`;
        out += `<text class="trait-text" x="20" y="189">${ax.myelin ? '말이집(회색)이 감긴 곳은 건너뛰고 마디에서만 활동 전위가 생김 (실제로는 1 mm마다 마디)' : ax.v > 5 ? '굵은 축삭은 안쪽으로 전류가 잘 흘러 이웃 막을 빨리 문턱까지 밀어 올림' : '얇은 축삭은 전류가 조금씩만 흘러 한 칸 한 칸 느리게 옮겨 감'}</text>`;
        const VERD = { fast: '10 ms 안', mid: '수십 ms', slow: '1초 가까이' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${p >= 1 ? `${ax.label}: 1 m에 ${a.ms < 100 ? a.ms.toFixed(0) : fmtN(a.ms)} ms → ${VERD[a.verdict]}` : `${ax.label} 축삭 — 발끝에서 척수까지 1 m`}</text>`;
        out += `<text class="note-text" x="20" y="208">화면은 실제보다 느리게 재생 · 초속 1·25·100 m는 실제 측정값</text>`;
        return out;
    }

    function graphConduct(a) {
        const X0 = 70, X1 = 430, Y0 = 150, Y1 = 40;
        const yOf = ms => Y0 - Math.log10(ms) / 3 * (Y0 - Y1);
        let out = `<text class="axis-title" x="${X0}" y="18">1 m 가는 데 걸리는 시간 — 한 칸 = 10배</text>`;
        [[1, '1 ms'], [10, '10 ms'], [100, '100 ms'], [1000, '1,000 ms']].forEach(([ms, lab]) => { out += `<line class="grid-line" x1="${X0}" y1="${yOf(ms).toFixed(1)}" x2="${X1}" y2="${yOf(ms).toFixed(1)}"/><text class="axis-text" x="${X0 - 6}" y="${(yOf(ms) + 3.5).toFixed(1)}" text-anchor="end">${lab}</text>`; });
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/>`;
        const step = (X1 - X0) / 3, W = 70;
        Object.entries(AXONS).forEach(([k, ax], i) => {
            const ms = DIST_M / ax.v * 1000, x = X0 + i * step + (step - W) / 2, mine = k === state.axon;
            out += `<rect class="bar ${mine ? 'chosen' : ''}" fill="${ax.myelin ? '#059669' : '#d97706'}" opacity="${mine ? 1 : 0.5}" x="${x.toFixed(1)}" y="${yOf(ms).toFixed(1)}" width="${W}" height="${(Y0 - yOf(ms)).toFixed(1)}" rx="2"/>`;
            out += `<text class="axis-text" style="fill:${mine ? '#0f172a' : '#475569'};font-weight:${mine ? '900' : '750'}" x="${(x + W / 2).toFixed(1)}" y="${(yOf(ms) - 4).toFixed(1)}" text-anchor="middle">${fmtN(ms)} ms</text>`;
            out += `<text class="axis-text" style="fill:${mine ? '#0f172a' : '#475569'};font-weight:${mine ? '900' : '750'}" x="${(x + W / 2).toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${ax.label}</text>`;
            out += `<text class="small-label" x="${(x + W / 2).toFixed(1)}" y="${Y0 + 26}" text-anchor="middle">초속 ${ax.v} m</text>`;
        });
        out += `<text class="axis-title" x="${((X0 + X1) / 2).toFixed(1)}" y="${Y0 + 42}" text-anchor="middle">다친 순간 날카로운 통증(빠른 신경) 뒤에 둔한 통증(느린 신경)이 오는 까닭</text>`;
        return out;
    }

    function renderSynapse(a) {
        const t = state.progress * SYN_END;
        const { d, run } = a;
        const i = clamp(Math.round(t / 0.05), 0, run.t.length - 1);
        const T = run.T[i], P = run.P[i];
        let out = '';
        // presynaptic terminal on the left, the next cell on the right, the cleft between
        out += `<path class="terminal" d="M30,70 Q40,60 120,60 L188,72 L188,150 L120,162 Q40,162 30,152 Z"/>`;
        out += `<rect class="terminal" x="214" y="52" width="230" height="118" rx="10"/>`;
        out += `<text class="small-label" x="60" y="52">앞 세포의 끝 (축삭 말단)</text><text class="small-label" x="330" y="46" text-anchor="middle">다음 세포</text>`;
        out += `<text class="small-label" x="201" y="40" text-anchor="middle">틈 20 nm</text>`;
        // vesicles: those not yet released sit inside; release at t = 1 ms
        const released = t >= SYN_RELEASE;
        for (let k = 0; k < 5; k += 1) { const vx = 150 + (k % 2) * 16, vy = 82 + k * 16; if (!(released && k < 3)) out += `<circle class="vesicle" cx="${vx}" cy="${vy}" r="7"/>`; }
        if (t > 0 && t < SYN_RELEASE) out += `<text class="trait-text" style="fill:#ff7a59" x="40" y="112">활동 전위 도착 → ${SYN_DELAY} ms 지연</text>`;
        // transmitter in the cleft, as many dots as its concentration
        const nT = Math.round(T * 18);
        for (let k = 0; k < nT; k += 1) { const x = 192 + ((k * 7) % 19), y = 72 + ((k * 13) % 80); out += `<circle class="transmitter" cx="${x}" cy="${y}" r="2.6"/>`; }
        // receptors on the next cell, blocked ones marked
        for (let k = 0; k < 6; k += 1) { const y = 70 + k * 15; out += `<rect class="receptor ${d.receptor ? '' : 'blocked'}" x="212" y="${y}" width="8" height="9" rx="2"/>`; if (!d.receptor) out += `<line stroke="#0a1c24" stroke-width="1.4" x1="213" y1="${y + 1}" x2="219" y2="${y + 8}"/><line stroke="#0a1c24" stroke-width="1.4" x1="219" y1="${y + 1}" x2="213" y2="${y + 8}"/>`; }
        // reuptake pumps and the enzyme, greyed out when a drug stops them
        for (let k = 0; k < 3; k += 1) { const y = 78 + k * 30; out += `<rect class="pump" x="182" y="${y}" width="7" height="12" rx="2" opacity="${d.kRe ? 1 : 0.25}"/>`; }
        for (let k = 0; k < 3; k += 1) { const y = 90 + k * 26; out += `<polygon class="enzyme" points="204,${y - 5} 209,${y} 204,${y + 5} 199,${y}" opacity="${d.kEnz ? 1 : 0.25}"/>`; }
        out += `<text class="small-label" x="100" y="176" text-anchor="middle">회색: 재흡수 펌프${d.kRe ? '' : ' (막힘)'}</text>`;
        out += `<text class="small-label" x="330" y="185" text-anchor="middle">보라: 분해 효소${d.kEnz ? '' : ' (억제됨)'}</text>`;
        // readouts
        const IX = 236;
        out += `<text class="trait-text" x="${IX}" y="70">틈의 전달 물질 ${Math.round(T * 100)} %</text>`;
        out += `<text class="trait-text" style="fill:#059669" x="${IX}" y="88">막전위 변화 +${P.toFixed(1)} mV</text>`;
        out += `<text class="trait-text" x="${IX}" y="106">${t.toFixed(1)} ms</text>`;
        out += `<text class="trait-text" x="${IX}" y="130">수용체 ${d.receptor ? '열림 가능' : '막힘 — 전달 물질이 붙지 못함'}</text>`;
        out += `<text class="trait-text" x="${IX}" y="146">치우는 속도 ${d.kRe + d.kEnz ? `평소의 ${Math.round((d.kRe + d.kEnz) / 1.0 * 100)} %` : '0'}</text>`;
        const VERD = { normal: '평소처럼 짧게', none: '반응 없음', long: '오래 이어짐' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${state.progress >= 1 ? `${d.label}: 최고 +${run.peak.toFixed(1)} mV, ${run.duration.toFixed(1)} ms 동안 → ${VERD[a.verdict]}` : `${d.label} (${d.hint})`}</text>`;
        out += `<text class="note-text" x="20" y="208">전달 물질은 앞 세포에서만 나오고 수용체는 뒤 세포에만 있어 신호는 한쪽으로만 갑니다</text>`;
        return out;
    }

    function graphSynapse(a) {
        const t = state.progress * SYN_END;
        const { run, normal } = a;
        const X0 = 50, X1 = 430, Y0 = 150, Y1 = 40;
        const xOf = tt => X0 + tt / SYN_END * (X1 - X0), yT = v => Y0 - v * (Y0 - Y1), yP = v => Y0 - v / 12 * (Y0 - Y1);
        let out = `<text class="axis-title" x="${X0}" y="18">노란 선: 틈의 전달 물질 · 초록 선: 다음 세포의 막전위 변화 (점선은 정상일 때)</text>`;
        for (let k = 0; k <= 4; k += 1) { const y = Y0 - k / 4 * (Y0 - Y1); out += `<line class="grid-line" x1="${X0}" y1="${y.toFixed(1)}" x2="${X1}" y2="${y.toFixed(1)}"/><text class="axis-text" x="${X0 - 6}" y="${(y + 3.5).toFixed(1)}" text-anchor="end">${k * 3} mV</text>`; }
        for (let tt = 0; tt <= SYN_END; tt += 2) out += `<text class="axis-text" x="${xOf(tt).toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${tt}</text>`;
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        let dN = ''; normal.t.forEach((tt, i) => { dN += `${i ? 'L' : 'M'}${xOf(tt).toFixed(1)},${yP(normal.P[i]).toFixed(1)} `; });
        out += `<path class="trace faint" style="stroke:#059669" d="${dN}"/>`;
        const iMax = clamp(Math.round(t / 0.05), 0, run.t.length - 1);
        let dT = '', dP = '';
        for (let i = 0; i <= iMax; i += 1) { dT += `${i ? 'L' : 'M'}${xOf(run.t[i]).toFixed(1)},${yT(run.T[i]).toFixed(1)} `; dP += `${i ? 'L' : 'M'}${xOf(run.t[i]).toFixed(1)},${yP(run.P[i]).toFixed(1)} `; }
        out += `<path class="trace" style="stroke:#d97706" d="${dT}"/><path class="trace" style="stroke:#059669" d="${dP}"/>`;
        out += `<text class="axis-title" x="${((X0 + X1) / 2).toFixed(1)}" y="${Y0 + 30}" text-anchor="middle">시간 (ms) — 전달 물질은 1 ms에 나와 치워지는 만큼 줄어듦</text>`;
        return out;
    }

    function noteFor(a) {
        if (a.kind === 'spike') {
            return `<div class="data-row"><span class="data-name">자극</span><span class="data-val">${a.st.hint}를 5 ms부터 ${a.du.ms} ms 동안</span></div>` +
                `<div class="data-row"><span class="data-name">활동 전위</span><span class="data-val">${a.n}번${a.n ? ` — ${a.run.spikes.map(s => `${s.t.toFixed(1)} ms에 +${Math.round(s.peak)} mV`).join(', ')}` : ''}</span></div>` +
                `<div class="data-row"><span class="data-name">모형</span><span class="data-val">호지킨–헉슬리 방정식(오징어 거대 축삭, 6.3 ℃): Na⁺ 통로 120, K⁺ 통로 36, 새는 전류 0.3 mS/cm²</span></div>` +
                `<div class="data-row match"><span class="data-name">규칙</span><span class="data-val">문턱 −55 mV 아래면 없음 · 넘으면 크기 같음(실무율) · 오래 자극하면 되풀이, 사이 시간은 불응기가 정함</span></div>`;
        }
        if (a.kind === 'conduct') {
            return `<div class="data-row"><span class="data-name">축삭</span><span class="data-val">${a.ax.label} — ${a.ax.hint}</span></div>` +
                `<div class="data-row"><span class="data-name">전도 속도</span><span class="data-val">초속 ${a.ax.v} m</span></div>` +
                `<div class="data-row"><span class="data-name">1 m 가는 데</span><span class="data-val">1 ÷ ${a.ax.v} = ${a.ms < 100 ? a.ms.toFixed(0) : fmtN(a.ms)} ms</span></div>` +
                `<div class="data-row match"><span class="data-name">비교</span><span class="data-val">${Object.values(AXONS).map(x => `${x.label} ${fmtN(DIST_M / x.v * 1000)} ms`).join(' · ')}</span></div>`;
        }
        const { d, run, normal } = a;
        return `<div class="data-row"><span class="data-name">상황</span><span class="data-val">${d.label} (${d.hint}) · 수용체 ${d.receptor ? '정상' : '막힘'} · 재흡수 ${d.kRe ? '됨' : '막힘'} · 분해 ${d.kEnz ? '됨' : '억제'}</span></div>` +
            `<div class="data-row"><span class="data-name">전달 물질</span><span class="data-val">1 ms에 나와 절반으로 줄기까지 ${(Math.LN2 / Math.max(d.kRe + d.kEnz, 1e-9)).toFixed(1)} ms (정상 ${(Math.LN2 / 1.0).toFixed(1)} ms)</span></div>` +
            `<div class="data-row"><span class="data-name">다음 세포</span><span class="data-val">막전위 변화 최고 +${run.peak.toFixed(1)} mV, 1 mV 넘게 ${run.duration.toFixed(1)} ms (정상 +${normal.peak.toFixed(1)} mV, ${normal.duration.toFixed(1)} ms)</span></div>` +
            `<div class="data-row match"><span class="data-name">모형</span><span class="data-val">틈의 전달 물질은 재흡수와 분해로 지수적으로 줄고, 다음 세포 막전위는 수용체에 붙은 양을 따라감</span></div>`;
    }

    function render() {
        const a = analyse();
        mainGroup.innerHTML = a.kind === 'spike' ? renderSpike(a) : a.kind === 'conduct' ? renderConduct(a) : renderSynapse(a);
        graphGroup.innerHTML = a.kind === 'spike' ? graphSpike(a) : a.kind === 'conduct' ? graphConduct(a) : graphSynapse(a);
        liftProse();
        stageBadge.textContent = a.kind === 'spike' ? `${a.st.hint} · ${a.du.label}` : a.kind === 'conduct' ? `${a.ax.label} · 초속 ${a.ax.v} m` : a.d.label;
        methodHint.textContent = a.kind === 'spike' ? '막전위가 문턱(−55 mV)을 넘으면 Na⁺ 통로가 한꺼번에 열립니다'
            : a.kind === 'conduct' ? '굵을수록, 말이집이 있을수록 흥분은 빨리 옮겨 갑니다'
                : '전달 물질이 틈에 남아 있는 동안만 다음 세포가 반응합니다';
        dataNote.innerHTML = noteFor(a);
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
        let s = '';
        if (a.kind === 'spike') {
            labelA.textContent = '활동 전위'; valueA.textContent = a.n ? `${a.n}번` : '없음';
            labelB.textContent = '꼭대기'; valueB.textContent = a.n ? `+${Math.round(a.run.spikes[0].peak)} mV` : '—';
            s = `${a.st.hint} 전류를 ${a.du.ms} ms 동안 흘렸습니다. `;
            if (a.n === 0) s += `막전위가 휴지 전위 −65 mV에서 조금 올랐지만 문턱 −55 mV에 미치지 못해 Na⁺ 통로가 한꺼번에 열리지 않았고, 활동 전위는 생기지 않았습니다. 문턱 아래의 자극은 아무리 오래 주어도 소용이 없습니다. `;
            else {
                s += `막전위가 문턱을 넘자 Na⁺ 통로가 한꺼번에 열려 Na⁺가 쏟아져 들어와 +${Math.round(a.run.spikes[0].peak)} mV까지 뒤집혔고, 곧 Na⁺ 통로가 닫히고 K⁺ 통로가 열려 K⁺가 빠져나가 다시 내려왔습니다. `;
                if (a.n === 1) s += `자극이 짧아 활동 전위는 한 번 생겼고, 크기는 자극 세기가 아니라 이온 통로가 정하므로 더 세게 주어도 같은 +40 mV쯤입니다(실무율). `;
                else s += `자극이 이어지자 활동 전위가 ${a.n}번 되풀이되었습니다. 첫 번째는 +${Math.round(a.run.spikes[0].peak)} mV였고, 뒤따르는 것은 앞 활동 전위의 여파가 채 가시기 전에 생겨 +${Math.round(a.run.spikes[1].peak)} mV로 조금 낮았습니다. 그래도 자극을 더 세게 준다고 커지지는 않습니다(실무율). 사이 간격(${(a.run.spikes[1].t - a.run.spikes[0].t).toFixed(1)} ms)은 Na⁺ 통로가 다시 열릴 수 있게 되는 불응기가 정하며, 자극이 셀수록 문턱에 빨리 다시 이르러 더 자주 생기지만 1초에 수백 번을 넘지는 못합니다. `;
            }
            s += `이 곡선은 호지킨과 헉슬리가 오징어 거대 축삭에서 잰 이온 통로의 성질을 그대로 방정식으로 옮겨 계산한 것입니다.`;
        } else if (a.kind === 'conduct') {
            const { ax } = a;
            labelA.textContent = '전도 속도'; valueA.textContent = `초속 ${ax.v} m`;
            labelB.textContent = '1 m 가는 데'; valueB.textContent = `${a.ms < 100 ? a.ms.toFixed(0) : fmtN(a.ms)} ms`;
            s = `${ax.label} 축삭(${ax.hint})에서 흥분은 초속 ${ax.v} m로 옮겨 가, 발끝에서 척수까지 1 m를 가는 데 ${a.ms < 100 ? a.ms.toFixed(0) : fmtN(a.ms)} ms가 걸립니다. `;
            if (ax.myelin) s += `말이집은 절연체여서 그 아래 막에서는 활동 전위가 생기지 않고, 전류가 다음 마디(실제로는 1 mm마다)까지 흘러가 그곳에서 새 활동 전위가 생깁니다. 마디마다 건너뛰므로 굵지 않아도 가장 빠릅니다. `;
            else if (ax.v > 5) s += `말이집이 없는 대신 아주 굵어서 안쪽으로 전류가 잘 흘러 이웃 막을 빨리 문턱까지 밀어 올립니다. 오징어는 이렇게 굵은 축삭으로 빠르게 도망치고, 덕분에 사람이 활동 전위를 처음 잴 수 있었습니다. `;
            else s += `얇고 말이집도 없는 축삭은 전류가 조금씩만 흘러 한 칸 한 칸 느리게 옮겨 갑니다. 둔한 통증을 전하는 신경이 이렇고, 그래서 다친 순간의 날카로운 통증 뒤에 둔한 통증이 1초쯤 늦게 옵니다. `;
            s += `굵을수록, 말이집이 있을수록 빠르고, 사람 몸은 빠르게 반응해야 하는 운동 신경과 촉각 신경에 말이집을 두었습니다.`;
        } else {
            const { d, run, normal } = a;
            labelA.textContent = '다음 세포 막전위'; valueA.textContent = run.peak < 0.5 ? '변화 없음' : `최고 +${run.peak.toFixed(1)} mV`;
            labelB.textContent = '이어진 시간'; valueB.textContent = run.peak < 0.5 ? '—' : `${run.duration.toFixed(1)} ms (정상 ${normal.duration.toFixed(1)})`;
            s = `활동 전위가 축삭 끝에 닿자 ${SYN_DELAY} ms쯤 뒤 소포가 터져 신경 전달 물질이 틈으로 나왔습니다. `;
            if (state.drug === 'normal') s += `전달 물질이 다음 세포의 수용체에 붙어 막전위가 +${run.peak.toFixed(1)} mV 올랐고, 재흡수 펌프와 분해 효소가 절반씩 치워 ${(Math.LN2 / 1.0).toFixed(1)} ms마다 반으로 줄어 ${run.duration.toFixed(1)} ms 만에 신호가 끝났습니다. 그래서 신경 신호는 짧고 또렷합니다. `;
            else if (state.drug === 'blocker') s += `전달 물질은 평소처럼 나왔지만 수용체가 막혀 붙지 못해 다음 세포는 전혀 반응하지 않았습니다. 쿠라레가 근육의 수용체를 이렇게 막아 몸을 움직이지 못하게 하고, 수술 때 근육 이완제로도 쓰입니다. `;
            else if (state.drug === 'reuptake') s += `앞 세포가 전달 물질을 되가져가는 펌프가 막혀 치우는 속도가 절반이 되었고, 전달 물질이 틈에 두 배 오래 남아 다음 세포의 반응이 ${run.duration.toFixed(1)} ms(정상 ${normal.duration.toFixed(1)} ms)로 길어졌습니다. 세로토닌 재흡수를 막는 우울증 치료약이 이 원리로 신호를 키웁니다. `;
            else s += `전달 물질을 분해하는 효소가 억제되어 치우는 속도가 절반이 되었고, 다음 세포가 ${run.duration.toFixed(1)} ms(정상 ${normal.duration.toFixed(1)} ms) 동안 계속 자극되었습니다. 유기인계 살충제와 신경 가스가 아세틜콜린 분해 효소를 이렇게 막아 근육이 떨리고 굳게 하며, 같은 원리를 약하게 쓴 약은 근무력증 치료에 쓰입니다. `;
            s += `전달 물질은 앞 세포에서만 나오고 수용체는 뒤 세포에만 있으므로 신호는 한쪽으로만 건너갑니다.`;
        }
        predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        explanation.textContent = s;
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
        checkBtn.textContent = state.mode === 'spike' ? '자극 주기' : state.mode === 'conduct' ? '흥분 보내기' : '신호 건너 보내기';
        stageCaption.textContent = state.mode === 'spike' ? '세포막의 한 조각입니다. 위가 세포 밖, 아래가 세포 안이고 파란 통로가 Na⁺, 노란 통로가 K⁺ 통로입니다.'
            : state.mode === 'conduct' ? '세포체에서 근육까지 1 m 축삭입니다. 붉은 점이 활동 전위가 있는 자리입니다 (실제보다 느리게 재생).'
                : '왼쪽이 앞 세포의 끝, 오른쪽이 다음 세포입니다. 노란 점이 틈에 나온 신경 전달 물질입니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { stim: 'mid', dur: 'long', axon: 'myelin', drug: 'normal', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'spike').click();
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

    window.__neuronModel = {
        STIMS, DURS, AXONS, DRUGS, state,
        analyse, render, hhRun, synRun,
        runSeconds,
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
