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
            const cls = t.getAttribute('class') || '', txt = t.textContent.trim();
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
                let b; try { b = t.getBBox(); } catch (e) { return; }
                const out = b.x < -0.5 || b.x + b.width > W + 0.5 || b.y + b.height > H + 0.5 || b.y < -0.5;
                if (must || out) takeOut(t);
            });
            const items = [...g.querySelectorAll('text')].map(t => { let b; try { b = t.getBBox(); } catch (e) { b = null; } return { t, b, len: t.textContent.trim().length }; }).filter(o => o.b);
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
    const C = 299792458, KB = 8.617e-5, EG = 1.12, I0_300 = 1e-12, R_SERIES = 100, V_BI = 0.7, TAU = 2.197e-6; // m/s, eV/K, eV, A, Ω, V, s
    const VOLTS = { m2: { label: '−2 V', hint: '역방향', v: -2 }, p03: { label: '+0.3 V', hint: '순방향', v: 0.3 }, p05: { label: '+0.5 V', hint: '순방향', v: 0.5 }, p07: { label: '+0.7 V', hint: '순방향', v: 0.7 }, p2: { label: '+2 V', hint: '순방향', v: 2 } };
    const TEMPS = { t300: { label: '실온 27 ℃', hint: '300 K', T: 300 }, t400: { label: '뜨거움 127 ℃', hint: '400 K', T: 400 } };
    const SPEEDS_M = { b05: { label: '0.5c', hint: 'γ = 1.15', b: 0.5 }, b09: { label: '0.9c', hint: 'γ = 2.29', b: 0.9 }, b099: { label: '0.99c', hint: 'γ = 7.09', b: 0.99 }, b0999: { label: '0.999c', hint: 'γ = 22.4', b: 0.999 } };
    const HEIGHTS = { h5: { label: '5 km', hint: '낮은 구름 높이', d: 5000 }, h10: { label: '10 km', hint: '여객기 높이', d: 10000 }, h20: { label: '20 km', hint: '성층권', d: 20000 } };
    const SPEEDS_E = { e01: { label: '0.1c', hint: 'γ = 1.005', b: 0.1 }, e05: { label: '0.5c', hint: 'γ = 1.15', b: 0.5 }, e09: { label: '0.9c', hint: 'γ = 2.29', b: 0.9 }, e099: { label: '0.99c', hint: 'γ = 7.09', b: 0.99 }, e0999: { label: '0.999c', hint: 'γ = 22.4', b: 0.999 } };
    const BODIES = { electron: { label: '전자', hint: 'mc² = 0.511 MeV', mc2: 0.511e6, unit: 'eV' }, proton: { label: '양성자', hint: 'mc² = 938 MeV', mc2: 938.27e6, unit: 'eV' }, kg: { label: '1 kg 물체', hint: 'mc² = 9 × 10¹⁶ J', mc2: 8.988e16, unit: 'J' } };

    const state = { mode: 'diode', volt: 'p07', temp: 't300', mspeed: 'b099', height: 'h10', espeed: 'e09', body: 'electron', progress: 0, prediction: null };
    let running = false, frameId = 0, lastStamp = 0;

    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const ease = p => p < 0.5 ? 2 * p * p : 1 - (1 - p) * (1 - p) * 2;
    const fmtN = (n, d = 0) => (+n.toFixed(d)).toLocaleString('ko-KR', { minimumFractionDigits: d, maximumFractionDigits: d }).replace('-', '−');
    const rnd = i => (((i * 7919 + 13) * 104729) % 100003) / 100003;
    const gamma = b => 1 / Math.sqrt(1 - b * b);
    const ra = v => /[013678]$/.test(String(v)) ? '이라' : '라';
    const cnt = f => f * 1000 < 0.005 ? '0' : fmtN(f * 1000, f < 0.001 ? 2 : 0);
    const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
    const pow10 = e => { const k = Math.floor(Math.log10(e)), m = e / 10 ** k; return `${fmtN(m, 2)} × 10${String(k).split('').map(ch => SUP[+ch]).join('')} J`; };
    const fmtI = a => { const x = Math.abs(a), s = a < 0 ? '−' : ''; if (x >= 1) return `${s}${fmtN(x, 2)} A`; if (x >= 1e-3) return `${s}${fmtN(x * 1e3, x >= 1e-2 ? 1 : 2)} mA`; if (x >= 1e-6) return `${s}${fmtN(x * 1e6, x >= 1e-5 ? 0 : 1)} μA`; if (x >= 1e-9) return `${s}${fmtN(x * 1e9, x >= 1e-8 ? 0 : 1)} nA`; return `${s}${fmtN(x * 1e12, 1)} pA`; };
    const fmtE = (e, unit) => { if (unit === 'J') return e > 0 ? pow10(e) : '0 J'; return e >= 1e9 ? `${fmtN(e / 1e9, 2)} GeV` : e >= 1e6 ? `${fmtN(e / 1e6, 2)} MeV` : `${fmtN(e / 1e3, 1)} keV`; };

    /* ------------------------------------------------------------ models */
    // Shockley diode with a 100 Ω series resistor; I₀ grows with temperature as T³·exp(−Eg/kT)
    function diodeModel() {
        const Vs = VOLTS[state.volt].v, T = TEMPS[state.temp].T, VT = KB * T, I0 = I0_300 * (T / 300) ** 3 * Math.exp(-EG / KB * (1 / T - 1 / 300));
        const Iof = Vd => I0 * (Math.exp(Vd / VT) - 1);
        let lo = -3, hi = 1.3;
        for (let k = 0; k < 80; k += 1) { const m = (lo + hi) / 2; if (m + R_SERIES * Iof(m) - Vs < 0) lo = m; else hi = m; }
        const Vd = (lo + hi) / 2, I = Iof(Vd), W = Math.max(0.05, Math.sqrt(Math.max(0, 1 - Vd / V_BI))); // depletion width relative to zero bias
        const verdict = Math.abs(I) >= 1e-3 ? 'well' : Math.abs(I) >= 1e-6 ? 'some' : 'none';
        return { kind: 'diode', Vs, T, VT, I0, Iof, Vd, I, W, verdict };
    }
    function muonModel() {
        const b = SPEEDS_M[state.mspeed].b, d = HEIGHTS[state.height].d, g = gamma(b), v = b * C;
        const tGround = d / v, tMuon = tGround / g, fRel = Math.exp(-tMuon / TAU), fNewton = Math.exp(-tGround / TAU);
        return { kind: 'muon', b, d, g, v, tGround, tMuon, fRel, fNewton, reach: v * g * TAU, verdict: fRel < 0.01 ? 'few' : fRel < 0.3 ? 'some' : 'many' };
    }
    function energyModel() {
        const b = SPEEDS_E[state.espeed].b, body = BODIES[state.body], g = gamma(b), L = 100 / g;
        const kRel = (g - 1) * body.mc2, kNewton = 0.5 * b * b * body.mc2, ratio = kRel / kNewton;
        return { kind: 'energy', b, body, g, L, kRel, kNewton, ratio, verdict: ratio < 1.1 ? 'same' : ratio < 2 ? 'bit' : 'much' };
    }
    function analyse() {
        if (state.mode === 'diode') return diodeModel();
        if (state.mode === 'muon') return muonModel();
        return energyModel();
    }
    const runSeconds = () => 5;

    /* ---------------------------------------------------------- controls */
    function pickRow(legend, name, options, current, cols) {
        return `<fieldset class="pick-field"><legend>${legend}</legend>` +
            `<div class="pick-buttons cols${cols}" data-pick="${name}">` +
            options.map(o => `<button type="button" data-value="${o.value}" class="${o.value === String(current) ? 'selected' : ''}">` +
                `${o.label}${o.hint ? `<small>${o.hint}</small>` : ''}</button>`).join('') +
            `</div></fieldset>`;
    }
    const opts = table => Object.entries(table).map(([k, v]) => ({ value: k, label: v.label }));

    function buildControls() {
        if (state.mode === 'diode') controlArea.innerHTML = pickRow('전원 전압 (p쪽 기준)', 'volt', opts(VOLTS), state.volt, 5) + pickRow('다이오드 온도', 'temp', opts(TEMPS), state.temp, 2);
        else if (state.mode === 'muon') controlArea.innerHTML = pickRow('뮤온의 속력', 'mspeed', opts(SPEEDS_M), state.mspeed, 4) + pickRow('뮤온이 생긴 높이', 'height', opts(HEIGHTS), state.height, 3);
        else controlArea.innerHTML = pickRow('속력', 'espeed', opts(SPEEDS_E), state.espeed, 5);
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                buildPrediction();
                settingsChanged();
            }));
        });
    }

    const PRED_D = [{ value: 'well', label: '잘 흐름 (1 mA 넘게)' }, { value: 'some', label: '조금 흐름 (1 μA ~ 1 mA)' }, { value: 'none', label: '거의 안 흐름 (1 μA 아래)' }];
    const PRED_M = [{ value: 'few', label: '거의 다 붕괴 (1 % 아래)' }, { value: 'some', label: '일부 닿음 (1~30 %)' }, { value: 'many', label: '많이 닿음 (30 % 넘게)' }];
    const PRED_E = [{ value: 'same', label: '거의 같음 (10 % 안)' }, { value: 'bit', label: '조금 큼 (10~100 %)' }, { value: 'much', label: '두 배 넘게' }];

    function buildPrediction() {
        const list = state.mode === 'diode' ? PRED_D : state.mode === 'muon' ? [{value:'yes',label:'지상에서 더 길게 측정'}, {value:'no',label:'지상에서 더 짧게 측정'}] : [{value:'yes',label:'운동 방향 길이가 짧아짐'}, {value:'no',label:'운동 방향 길이가 길어짐'}];
        predictionLegend.textContent = state.mode === 'diode' ? '전류의 흐름을 예상하세요.' : state.mode === 'muon' ? '지상에서 측정한 뮤온의 수명은 고유 수명에 비해?' : '정지 관측자가 측정한 우주선의 길이는 고유 길이에 비해?';
        predictionArea.innerHTML=list.map(o=>'<button type="button" data-prediction="'+o.value+'">'+o.label+'</button>').join('');
        predictionArea.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{state.prediction=b.dataset.prediction;predictionArea.querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===b));}));
    }

    /* ----------------------------------------------------------- visuals */
    const arrow = (x1, y1, x2, y2, cls, head, w = 3.5) => {
        const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
        const bx = x2 - ux * 6, by = y2 - uy * 6;
        return `<line class="${cls}" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}"/><polygon class="${head}" points="${x2.toFixed(1)},${y2.toFixed(1)} ${(bx - uy * w).toFixed(1)},${(by + ux * w).toFixed(1)} ${(bx + uy * w).toFixed(1)},${(by - ux * w).toFixed(1)}"/>`;
    };

    function renderDiode(a) {
        const p = state.progress, on = p > 0, flow = on ? clamp((Math.log10(Math.max(Math.abs(a.I), 1e-13)) + 7) / 6, 0, 1) : 0; // 0 at 0.1 μA, 1 at 100 mA
        const L = 30, Rr = 190, Tt = 50, Bb = 170, forward = a.Vs > 0;
        let out = '';
        // loop: battery on the left, resistor on top, diode on the right, ammeter at the bottom
        out += `<path class="wire${on ? '' : ' off'}" d="M${L},${Tt + 42} L${L},${Tt} L${L + 60},${Tt} M${L + 100},${Tt} L${Rr},${Tt} L${Rr},${Tt + 40} M${Rr},${Tt + 72} L${Rr},${Bb} L${(L + Rr) / 2 + 14},${Bb} M${(L + Rr) / 2 - 14},${Bb} L${L},${Bb} L${L},${Tt + 78}"/>`;
        // battery: long plate is +; p side (top of the diode) is + when forward
        const plates = forward ? [[Tt + 46, 12], [Tt + 56, 6], [Tt + 66, 12], [Tt + 76, 6]] : [[Tt + 46, 6], [Tt + 56, 12], [Tt + 66, 6], [Tt + 76, 12]];
        plates.forEach(([y, w]) => { out += `<line class="part" x1="${L - w}" y1="${y}" x2="${L + w}" y2="${y}"/>`; });
        out += `<text class="small-label" x="${L + 18}" y="${Tt + 52}">${forward ? '+' : '−'}</text><text class="small-label" x="${L + 18}" y="${Tt + 80}">${forward ? '−' : '+'}</text>`;
        out += `<text class="small-label" x="${L - 22}" y="${Tt + 98}" text-anchor="start">전원 ${VOLTS[state.volt].label}</text>`;
        // resistor zigzag
        let zz = `M${L + 60},${Tt}`; for (let i = 0; i < 8; i += 1) zz += ` L${L + 62.5 + i * 5},${Tt + (i % 2 ? 6 : -6)}`; zz += ` L${L + 100},${Tt}`;
        out += `<path class="part" d="${zz}"/><text class="small-label" x="${L + 80}" y="${Tt - 12}" text-anchor="middle">저항 100 Ω</text>`;
        // diode symbol: triangle points from p (top) to n (bottom)
        out += `<polygon class="diode-tri" points="${Rr - 9},${Tt + 42} ${Rr + 9},${Tt + 42} ${Rr},${Tt + 60}"/><line class="part" x1="${Rr - 9}" y1="${Tt + 60}" x2="${Rr + 9}" y2="${Tt + 60}"/><line class="wire${on ? '' : ' off'}" x1="${Rr}" y1="${Tt + 40}" x2="${Rr}" y2="${Tt + 72}"/>`;
        out += `<text class="small-label" x="${Rr + 13}" y="${Tt + 47}">p</text><text class="small-label" x="${Rr + 13}" y="${Tt + 70}">n</text>`;
        // ammeter
        out += `<circle class="meter" cx="${(L + Rr) / 2}" cy="${Bb}" r="14"/><text class="gen-text" x="${(L + Rr) / 2}" y="${Bb + 4}" text-anchor="middle">A</text>`;
        out += `<text class="trait-text" style="fill:#d97706" x="${(L + Rr) / 2}" y="${Bb + 26}" text-anchor="middle">${on ? fmtI(a.I) : '—'}</text>`;
        // moving charges along the loop when current flows (conventional current, p→n through the diode)
        if (on && flow > 0.02) {
            const path = [[L, Tt + 42], [L, Tt], [Rr, Tt], [Rr, Bb], [L, Bb], [L, Tt + 78]];
            const segs = []; let total = 0; for (let i = 0; i < path.length - 1; i += 1) { const len = Math.hypot(path[i + 1][0] - path[i][0], path[i + 1][1] - path[i][1]); segs.push([path[i], path[i + 1], len]); total += len; }
            const n = 14, shift = (p * (0.3 + flow * 1.2) * total) % total, dir = forward ? 1 : -1;
            for (let k = 0; k < n; k += 1) {
                let s = ((k / n) * total + dir * shift) % total; if (s < 0) s += total;
                for (const [a0, a1, len] of segs) { if (s <= len) { const u = s / len; out += `<circle class="charge" opacity="${(0.4 + 0.6 * flow).toFixed(2)}" cx="${(a0[0] + (a1[0] - a0[0]) * u).toFixed(1)}" cy="${(a0[1] + (a1[1] - a0[1]) * u).toFixed(1)}" r="2.2"/>`; break; } s -= len; }
            }
        }
        // junction bar
        const JX = 236, JW = 200, JY = 56, JH = 60, mid = JX + JW / 2, wPx = clamp(14 * a.W * (a.Vs < 0 ? 1 : 1), 3, 60), wDraw = a.Vs < 0 ? clamp(14 * Math.sqrt(1 - a.Vd / V_BI), 3, 60) : wPx;
        out += `<rect class="p-side" x="${JX}" y="${JY}" width="${JW / 2}" height="${JH}"/><rect class="n-side" x="${mid}" y="${JY}" width="${JW / 2}" height="${JH}"/>`;
        out += `<rect class="depl" x="${(mid - wDraw).toFixed(1)}" y="${JY}" width="${(2 * wDraw).toFixed(1)}" height="${JH}"/>`;
        out += `<text class="small-label" x="${JX + 6}" y="${JY - 6}">p형 (양공 ○)</text><text class="small-label" x="${JX + JW - 6}" y="${JY - 6}" text-anchor="end">n형 (전자 ●)</text>`;
        const drift = on && forward ? p * flow * 60 : 0;
        for (let i = 0; i < 26; i += 1) {
            const ux = rnd(i), uy = rnd(i + 100);
            let hx = JX + 6 + ux * (JW / 2 - wDraw - 12) + drift, hy = JY + 8 + uy * (JH - 16);
            if (hx > mid + JW / 2 - 8) hx = JX + 6 + ((hx - JX - 6) % (JW / 2 - wDraw - 12));
            out += `<circle class="hole" cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" r="3"/>`;
            let ex = JX + JW - 6 - ux * (JW / 2 - wDraw - 12) - drift, ey = JY + 8 + rnd(i + 200) * (JH - 16);
            if (ex < JX + 8) ex = JX + JW - 6 - ((JX + JW - 6 - ex) % (JW / 2 - wDraw - 12));
            out += `<circle class="electron" cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="2.6"/>`;
        }
        if (on && forward && flow > 0.02) out += arrow(mid + 40, JY + JH + 10, mid - 40, JY + JH + 10, 'wind', 'wind-head', 3) + `<text class="small-label" x="${mid}" y="${JY + JH + 24}" text-anchor="middle">전자는 n → p, 양공은 p → n</text>`;
        else out += `<text class="small-label" x="${mid}" y="${JY + JH + 24}" text-anchor="middle">${on ? '공핍층이 두꺼워져 운반자가 못 건넘' : '공핍층: 운반자가 없는 띠'}</text>`;
        out += `<text class="trait-text" x="${JX}" y="158">양단 ${on ? `${fmtN(a.Vd, 2)} V` : '—'} · 공핍층 ${on ? `${fmtN(wDraw / 14 * 100)} %` : '100 %'} (0 V일 때 기준)</text>`;
        out += `<text class="trait-text" x="${JX}" y="174">I₀ = ${fmtI(a.I0)} · V_T = kT/q = ${fmtN(a.VT * 1000, 1)} mV (${a.T} K)</text>`;
        const VERD = { well: '잘 흐름', some: '조금 흐름', none: '거의 안 흐름' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${p >= 1 ? `${VOLTS[state.volt].label} ${VOLTS[state.volt].hint} · ${a.T} K: ${fmtI(a.I)} — ${VERD[a.verdict]}` : `${VOLTS[state.volt].label} ${VOLTS[state.volt].hint} · ${TEMPS[state.temp].label}`}</text>`;
        out += `<text class="note-text" x="20" y="208">규소 다이오드, 실온 I₀ = 1 pA (대략) · 뜨거워지면 I₀ ∝ T³e^(−Eg/kT), Eg = 1.12 eV · 노란 점은 전류의 방향</text>`;
        return out;
    }

    function graphDiode(a) {
        const X0 = 60, X1 = 420, Y0 = 150, Y1 = 40, VA = -2, VB = 1, IM = 20e-3, xOf = v => X0 + (v - VA) / (VB - VA) * (X1 - X0), yOf = i => Y0 - clamp(i, -IM * 0.08, IM) / IM * (Y0 - Y1);
        let out = `<text class="axis-title" x="${X0}" y="18">다이오드의 전압–전류 모형 — 노란 점이 지금의 작동점</text>`;
        [-2, -1, 0, 0.5, 1].forEach(v => { out += `<line class="grid-line" x1="${xOf(v).toFixed(1)}" y1="${Y1}" x2="${xOf(v).toFixed(1)}" y2="${Y0}"/><text class="axis-text" x="${xOf(v).toFixed(1)}" y="${Y0 + 14}" text-anchor="${v === -2 ? 'start' : 'middle'}">${v} V</text>`; });
        [0, 5, 10, 15, 20].forEach(i => { out += `<line class="grid-line" x1="${X0}" y1="${yOf(i * 1e-3).toFixed(1)}" x2="${X1}" y2="${yOf(i * 1e-3).toFixed(1)}"/><text class="axis-text" x="${X0 - 5}" y="${(yOf(i * 1e-3) + 3.5).toFixed(1)}" text-anchor="end">${i} mA</text>`; });
        out += `<line class="axis" x1="${X0}" y1="${yOf(0).toFixed(1)}" x2="${X1}" y2="${yOf(0).toFixed(1)}"/><line class="axis" x1="${xOf(0).toFixed(1)}" y1="${Y1}" x2="${xOf(0).toFixed(1)}" y2="${Y0}"/>`;
        Object.values(TEMPS).forEach(t => {
            const VT = KB * t.T, I0 = I0_300 * (t.T / 300) ** 3 * Math.exp(-EG / KB * (1 / t.T - 1 / 300));
            let d = ''; for (let v = VA; v <= VB + 1e-9; v += 0.01) { const i = I0 * (Math.exp(v / VT) - 1); if (i > IM * 1.05) break; d += `${d ? 'L' : 'M'}${xOf(v).toFixed(1)},${yOf(i).toFixed(1)} `; }
            out += `<path class="trace${t.T === a.T ? '' : ' faint'}" style="stroke:${t.T === 300 ? '#0284c7' : '#dc2626'}" d="${d}"/>`;
        });
        out += `<text class="small-label" style="fill:#0284c7" x="${X0 + 8}" y="${Y1 + 12}">파랑 300 K · 주황 400 K</text>`;
        if (state.progress > 0) out += `<circle fill="#d97706" stroke="#fff" cx="${xOf(clamp(a.Vd, VA, VB)).toFixed(1)}" cy="${yOf(a.I).toFixed(1)}" r="4.5"/><text class="small-label" style="fill:#d97706" x="${(xOf(clamp(a.Vd, VA, VB)) + (a.Vd > 0.4 ? -8 : 8)).toFixed(1)}" y="${(yOf(a.I) - 8).toFixed(1)}" text-anchor="${a.Vd > 0.4 ? 'end' : 'start'}">${fmtN(a.Vd, 2)} V · ${fmtI(a.I)}</text>`;
        out += `<text class="axis-title" x="${(X0 + X1) / 2}" y="${Y0 + 30}" text-anchor="middle">다이오드 양단 전압 — 0.6 V 근처부터 급히 켜지고, 역방향은 pA 수준. 뜨거우면 곡선이 왼쪽으로</text>`;
        return out;
    }

    function renderMuon(a) {
        const p=state.progress, clock=(x,phase,label)=>'<circle cx="'+x+'" cy="100" r="38" fill="#edf4fb" stroke="#4e6578"/><line x1="'+x+'" y1="100" x2="'+(x+30*Math.sin(phase))+'" y2="'+(100-30*Math.cos(phase))+'" stroke="#d97706" stroke-width="4"/><text x="'+x+'" y="162" text-anchor="middle" fill="#334155">'+label+'</text>';
        return clock(125,p*12,'지상 시계')+clock(330,p*12/a.g,'운동하는 뮤온 시계')+'<text x="20" y="25" fill="#334155">지상 관측자의 관점 · 시간 흐름 비교 모형</text>';
    }

    function graphMuon(a) { return '<text x="20" y="50" fill="#334155">시간 지연은 관측자 사이의 시간 간격 비교입니다.</text><text x="20" y="95" fill="#334155">자신과 함께 움직이는 시계의 고유 시간은 변하지 않습니다.</text>'; }

    function renderEnergy(a) {
        const moving=260/a.g;
        return '<text x="20" y="35" fill="#334155">고유 길이 (우주선과 함께 측정)</text><rect x="40" y="50" width="260" height="35" rx="10" fill="#a0bacb"/><text x="20" y="123" fill="#334155">지나가는 우주선의 운동 방향 길이</text><rect x="40" y="140" width="'+moving+'" height="35" rx="10" fill="#d97706"/><text x="20" y="208" fill="#334155">높이는 같고, 운동 방향만 짧게 측정됩니다.</text>';
    }

    function graphEnergy(a) { return '<text x="20" y="50" fill="#334155">속력을 바꾸어 두 길이를 비교하세요.</text><text x="20" y="95" fill="#334155">그림은 측정 길이 모형이며 사진의 모습이 아닙니다.</text>'; }

    function noteFor(a) { return a.kind==='diode' ? '<p>순방향과 역방향에서 전류가 다르게 흐릅니다. 그래프는 소자 특성의 모형값입니다.</p>' : a.kind==='muon' ? '<p>지상 관측자가 잰 움직이는 뮤온의 수명은 고유 수명보다 깁니다.</p>' : '<p>우주선과 함께 측정한 고유 길이와 정지 관측자가 측정한 길이를 비교합니다.</p>'; }

    function render() {
        const a = analyse();
        mainGroup.innerHTML = a.kind === 'diode' ? renderDiode(a) : a.kind === 'muon' ? renderMuon(a) : renderEnergy(a);
        graphGroup.innerHTML = a.kind === 'diode' ? graphDiode(a) : a.kind === 'muon' ? graphMuon(a) : graphEnergy(a);
        liftProse();
        stageBadge.textContent = a.kind === 'diode' ? `${VOLTS[state.volt].label} · ${TEMPS[state.temp].label}` : a.kind === 'muon' ? `${SPEEDS_M[state.mspeed].label} · ${HEIGHTS[state.height].label}` : `${SPEEDS_E[state.espeed].label} · ${BODIES[state.body].label}`;
        methodHint.textContent = a.kind === 'diode' ? '순방향 전압은 공핍층을 얇게 해 전류를 흘리고, 역방향은 두껍게 해 막습니다'
            : a.kind === 'muon' ? '지상에서 잰 뮤온의 수명은 고유 수명보다 깁니다'
                : '운동 방향의 길이는 고유 길이보다 짧게 측정됩니다';
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
        const a=render();resultEmpty.hidden=true;resultContent.hidden=false;
        labelA.textContent=a.kind==='diode'?'전류':a.kind==='muon'?'지상에서 잰 수명':'운동 방향 길이';
        valueA.textContent=a.kind==='diode'?fmtI(a.I):a.kind==='muon'?'고유 수명보다 김':'고유 길이보다 짧음';
        labelB.textContent='비교 기준';valueB.textContent=a.kind==='diode'?'순방향 / 역방향':'함께 움직이는 관측자';
        const answer=a.kind==='diode'?a.verdict:'yes';
        predictionResult.textContent=!state.prediction?'다음에는 먼저 예상해 보세요.':state.prediction===answer?'예상이 맞았습니다.':'예상과 다른 결과입니다.';
        explanation.textContent=a.kind==='diode'?'다이오드는 전압의 방향에 따라 전류가 다르게 흘러 정류에 이용됩니다.':a.kind==='muon'?'지상에서 빠르게 움직이는 뮤온의 수명을 관측하면 고유 수명보다 길게 측정됩니다.':'운동 방향 길이는 고유 길이보다 짧게 측정됩니다. 운동에 수직인 방향은 수축하지 않습니다.';
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
        checkBtn.textContent = state.mode === 'diode' ? '전압 걸기' : state.mode === 'muon' ? '뮤온 떨어뜨리기' : '우주선 보내기';
        stageCaption.textContent = state.mode === 'diode' ? '왼쪽은 전원·저항·다이오드 회로, 오른쪽은 다이오드 속 p-n 접합입니다. 가운데 점선 띠가 전하 운반자가 없는 공핍층입니다.'
            : state.mode === 'muon' ? '왼쪽은 시간 지연이 없을 때, 오른쪽은 있을 때 같은 뮤온 무리가 떨어지는 모습입니다. 흐려진 점은 붕괴한 뮤온이고, 가운데 두 시계가 지상과 뮤온의 시간입니다.'
                : '정지 관측자가 측정한 운동 방향 길이와 고유 길이를 비교하는 모형입니다. 사진의 모습과는 다릅니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { volt: 'p07', temp: 't300', mspeed: 'b099', height: 'h10', espeed: 'e09', body: 'electron', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'diode').click();
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

    window.__semiModel = {
        VOLTS, TEMPS, SPEEDS_M, HEIGHTS, SPEEDS_E, BODIES, state,
        analyse, render, runSeconds,
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
