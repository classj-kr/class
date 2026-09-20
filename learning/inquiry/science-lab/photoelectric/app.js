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
    const H = 6.626e-34, HC = 1239.84, QE = 1.602e-19, ME = 9.109e-31, C_LIGHT = 2.998e8, MC2_EV = 0.511e6, H_EVS = 4.136e-15;
    const METALS = { cs: { label: '세슘', hint: '일함수 2.14 eV', W: 2.14 }, na: { label: '나트륨', hint: '일함수 2.28 eV', W: 2.28 }, zn: { label: '아연', hint: '일함수 4.33 eV', W: 4.33 }, pt: { label: '백금', hint: '일함수 5.65 eV', W: 5.65 } };
    const LIGHTS = {
        red: { label: '빨강', hint: '650 nm', nm: 650, color: '#ff4b3e', ink: '#dc2626' },
        green: { label: '초록', hint: '530 nm', nm: 530, color: '#4ade80', ink: '#15803d' },
        blue: { label: '파랑', hint: '450 nm', nm: 450, color: '#60a5fa', ink: '#2563eb' },
        violet: { label: '보라', hint: '400 nm', nm: 400, color: '#a78bfa', ink: '#7c3aed' },
        uv: { label: '자외선', hint: '250 nm', nm: 250, color: '#d8b4fe', ink: '#6b21a8', dashed: true },
    };
    const BRIGHTS = { dim: { label: '어두운 빛', hint: '광자 수 1', rate: 1 }, bright: { label: '밝은 빛', hint: '광자 수 4배', rate: 4 } };
    const FROMS = { n2: { label: 'n = 2', n: 2 }, n3: { label: 'n = 3', n: 3 }, n4: { label: 'n = 4', n: 4 }, n5: { label: 'n = 5', n: 5 }, n6: { label: 'n = 6', n: 6 } };
    const TOS = { n1: { label: 'n = 1', hint: '라이먼 계열', n: 1 }, n2: { label: 'n = 2', hint: '발머 계열', n: 2 }, n3: { label: 'n = 3', hint: '파셴 계열', n: 3 } };
    const OBJS = {
        e1: { label: '전자 · 1 V로 가속', name: '1 V로 가속한 전자', hint: '느린 전자', m: ME, KE: 1 },
        e100: { label: '전자 · 100 V로 가속', name: '100 V로 가속한 전자', hint: '회절 실험', m: ME, KE: 100 },
        e10k: { label: '전자 · 10,000 V로 가속', name: '10,000 V로 가속한 전자', hint: '전자 현미경', m: ME, KE: 1e4 },
        ball: { label: '야구공', name: '야구공', hint: '145 g · 초속 40 m', m: 0.145, v: 40 },
    };

    const state = { mode: 'photo', metal: 'na', light: 'green', bright: 'dim', from: 'n3', to: 'n2', obj: 'e100', progress: 0, prediction: null };
    let running = false, frameId = 0, lastStamp = 0;

    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const ease = p => p < 0.5 ? 2 * p * p : 1 - (1 - p) * (1 - p) * 2;
    const fmtN = (n, d = 0) => (+n.toFixed(d)).toLocaleString('ko-KR', { minimumFractionDigits: d, maximumFractionDigits: d }).replace('-', '−');
    const SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
    const sup = s => String(s).split('').map(ch => SUP[ch] || ch).join('');
    const SUB = { '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆' };
    const sub = s => String(s).split('').map(ch => SUB[ch] || ch).join('');
    const roNum = n => '036'.includes(String(n).slice(-1)) ? '으로' : '로';
    const fmtSci = (x, d = 1) => { if (x === 0) return '0'; const e = Math.floor(Math.log10(Math.abs(x))); const m = x / 10 ** e; return e === 0 ? m.toFixed(d) : `${m.toFixed(d)}×10${sup(e)}`; };
    const fmtLam = m => m >= 1e-6 ? `${fmtN(m * 1e6, 1)} μm` : m >= 1e-9 ? `${fmtN(m * 1e9, m < 1e-8 ? 2 : 0)} nm` : m >= 1e-12 ? `${fmtN(m * 1e12, 1)} pm` : `${fmtSci(m)} m`;
    const fmtSpeed = v => v >= 1e6 ? `초속 ${fmtN(v / 1000)} km` : v >= 1000 ? `초속 ${fmtN(v / 1000, 1)} km` : `초속 ${fmtN(v)} m`;
    // colour of a visible wavelength (nm), a plain approximation
    function waveColor(nm) {
        if (nm < 380) return '#a78bfa';
        if (nm > 750) return '#ff7a59';
        let r = 0, g = 0, b = 0;
        if (nm < 440) { r = (440 - nm) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; } else if (nm < 510) { g = 1; b = (510 - nm) / 20; } else if (nm < 580) { r = (nm - 510) / 70; g = 1; } else if (nm < 645) { r = 1; g = (645 - nm) / 65; } else { r = 1; }
        const f = nm < 420 ? 0.4 + 0.6 * (nm - 380) / 40 : nm > 700 ? 0.4 + 0.6 * (750 - nm) / 50 : 1;
        return `rgb(${Math.round(255 * r * f)},${Math.round(255 * g * f)},${Math.round(255 * b * f)})`;
    }

    /* ------------------------------------------------------------ models */
    function analyse() {
        if (state.mode === 'photo') {
            const metal = METALS[state.metal], light = LIGHTS[state.light], br = BRIGHTS[state.bright];
            const hf = HC / light.nm, KE = hf - metal.W, emit = KE > 0;
            const f = C_LIGHT / (light.nm * 1e-9), f0 = metal.W / H_EVS, lam0 = HC / metal.W;
            const v = emit ? Math.sqrt(2 * KE * QE / ME) : 0;
            return { kind: 'photo', metal, light, br, hf, KE, emit, f, f0, lam0, v, current: emit ? br.rate : 0, verdict: !emit ? 'none' : KE < 1 ? 'slow' : 'fast' };
        }
        if (state.mode === 'hydrogen') {
            const ni = FROMS[state.from].n, nf = TOS[state.to].n;
            const Ei = -13.6 / (ni * ni), Ef = -13.6 / (nf * nf);
            if (ni <= nf) return { kind: 'hydrogen', ni, nf, Ei, Ef, dE: Ef - Ei, lam: null, region: 'none', verdict: 'none' };
            const dE = Ei - Ef, lam = HC / dE;
            const region = lam < 380 ? 'uv' : lam <= 750 ? 'visible' : 'ir';
            return { kind: 'hydrogen', ni, nf, Ei, Ef, dE, lam, region, series: nf === 1 ? '라이먼' : nf === 2 ? '발머' : '파셴', color: waveColor(lam), verdict: region };
        }
        const o = OBJS[state.obj];
        let p, v;
        if (o.v) { v = o.v; p = o.m * o.v; } else { const KEj = o.KE * QE, mc2 = o.m * C_LIGHT * C_LIGHT; p = Math.sqrt(KEj * KEj + 2 * KEj * mc2) / C_LIGHT; const gamma = 1 + KEj / mc2; v = C_LIGHT * Math.sqrt(1 - 1 / (gamma * gamma)); }
        const lam = H / p;
        return { kind: 'matter', o, p, v, lam, ratio: lam / 1e-10, verdict: lam > 1e-9 ? 'big' : lam >= 1e-11 ? 'atom' : 'tiny' };
    }
    const runSeconds = () => state.mode === 'photo' ? 6 : 5;

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
        if (state.mode === 'photo') controlArea.innerHTML = pickRow('금속판', 'metal', opts(METALS), state.metal, 4) + pickRow('빛의 색', 'light', opts(LIGHTS), state.light, 5) + pickRow('밝기', 'bright', opts(BRIGHTS), state.bright, 2);
        else if (state.mode === 'hydrogen') controlArea.innerHTML = pickRow('전자가 처음 있던 준위', 'from', opts(FROMS), state.from, 5) + pickRow('내려오는 준위', 'to', opts(TOS), state.to, 3);
        else controlArea.innerHTML = pickRow('파장을 잴 물체', 'obj', opts(OBJS), state.obj, 2);
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                buildPrediction();
                settingsChanged();
            }));
        });
    }

    const PRED_P = [{ value: 'none', label: '전자가 안 나옴' }, { value: 'slow', label: '나옴 — 에너지 1 eV 아래' }, { value: 'fast', label: '나옴 — 에너지 1 eV 넘게' }];
    const PRED_H = [{ value: 'visible', label: '눈에 보이는 빛' }, { value: 'uv', label: '자외선' }, { value: 'ir', label: '적외선' }, { value: 'none', label: '빛이 안 나옴 (흡수해야 올라감)' }];
    const PRED_M = [{ value: 'big', label: '원자보다 큼 (1 nm 넘게)' }, { value: 'atom', label: '원자만 함 (0.01~1 nm)' }, { value: 'tiny', label: '잴 수 없이 작음' }];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list = state.mode === 'photo' ? PRED_P : state.mode === 'hydrogen' ? PRED_H : PRED_M;
        predictionLegend.textContent = state.mode === 'photo' ? `${METALS[state.metal].label}에 ${BRIGHTS[state.bright].label.replace(' 빛', '')} ${LIGHTS[state.light].label}${state.light === 'uv' ? '을' : ' 빛을'} 비추면?`
            : state.mode === 'hydrogen' ? `전자가 ${FROMS[state.from].label}에서 ${TOS[state.to].label}${roNum(TOS[state.to].n)} 갈 때 나오는 빛은?`
                : `${OBJS[state.obj].name}의 물질파 파장은?`;
        predictionArea.className = `prediction-buttons ${list.length === 4 ? 'four' : 'three'}`;
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    // a short wavy segment from (x1,y1) toward (x2,y2)
    function squiggle(x1, y1, x2, y2, wl, amp, cls, style) {
        const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
        let d = '';
        for (let s = 0; s <= len; s += 2) { const off = amp * Math.sin(2 * Math.PI * s / wl); const x = x1 + ux * s + nx * off, y = y1 + uy * s + ny * off; d += `${d ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)} `; }
        return `<path class="${cls}" style="${style}" d="${d}"/>`;
    }

    function renderPhoto(a) {
        const p = state.progress, { metal, light, br } = a;
        const TX = 90, TY = 50, TW = 310, TH = 120, MX = 104, CX = 384;
        let out = `<rect class="tube" x="${TX}" y="${TY}" width="${TW}" height="${TH}" rx="14"/>`;
        out += `<rect class="metal" x="${MX - 6}" y="${TY + 12}" width="7" height="${TH - 24}" rx="2"/><rect class="collector" x="${CX}" y="${TY + 12}" width="5" height="${TH - 24}" rx="2"/>`;
        out += `<text class="small-label" x="${MX - 2}" y="${TY + TH + 12}" text-anchor="middle">${metal.label} 판</text><text class="small-label" x="${CX + 2}" y="${TY + TH + 12}" text-anchor="middle">받는 판</text>`;
        // lamp and photons
        out += `<rect class="lamp" x="22" y="24" width="44" height="26" rx="6"/><text class="small-label" x="44" y="40" text-anchor="middle">${light.label}</text>`;
        const nPh = br.rate * 2, sx = 66, sy = 40, ex = MX - 8, ey = TY + TH / 2;
        for (let k = 0; k < nPh; k += 1) {
            const t = (p * 1.6 + k / nPh) % 1, jitter = ((k * 37) % 40) - 20;
            const x = sx + (ex - sx) * t, y = sy + (ey + jitter - sy) * t;
            out += squiggle(x, y, x + (ex - sx) * 0.08, y + (ey + jitter - sy) * 0.08, 6, 2.5, 'photon', `stroke:${light.color}${light.dashed ? ';stroke-dasharray:2 1.5' : ''}`);
        }
        // electrons
        if (a.emit) {
            const nE = br.rate * 2, speed = 0.5 + 0.6 * Math.sqrt(a.KE / 3);
            for (let k = 0; k < nE; k += 1) { const t = (p * speed * 2 + k / nE) % 1, y = TY + 24 + ((k * 29) % (TH - 48)); out += `<circle class="electron" cx="${(MX + 4 + (CX - MX - 10) * t).toFixed(1)}" cy="${y}" r="3.2"/>`; }
        }
        // circuit and meter
        const AX = 428, AY = 110;
        out += `<path class="wire" d="M${MX - 2},${TY + TH - 12} L${MX - 2},${TY + TH + 26} L${AX},${TY + TH + 26} L${AX},${AY + 20}"/><path class="wire" d="M${CX + 2},${TY + 12} L${CX + 2},${TY - 10} L${AX},${TY - 10} L${AX},${AY - 20}"/>`;
        out += `<circle class="meter" cx="${AX}" cy="${AY}" r="20"/>`;
        const ang = (-60 + (a.current === 0 ? 0 : a.current === 1 ? 45 : 110) * clamp(p * 3, 0, 1)) * Math.PI / 180;
        out += `<line class="needle" x1="${AX}" y1="${AY}" x2="${(AX + 15 * Math.sin(ang)).toFixed(1)}" y2="${(AY - 15 * Math.cos(ang)).toFixed(1)}"/>`;
        out += `<text class="meter-text" x="${AX}" y="${AY + 34}" text-anchor="middle">전류 ${a.current === 0 ? '0' : a.current === 1 ? '1' : '4'}</text>`;
        // readouts
        out += `<text class="trait-text" style="fill:${light.ink || '#0f172a'}" x="120" y="40">광자 한 개의 에너지 hf = 1240 ÷ ${light.nm} = ${fmtN(a.hf, 2)} eV</text>`;
        out += `<text class="trait-text" x="120" y="72">일함수 ${fmtN(metal.W, 2)} eV</text>`;
        out += `<text class="trait-text" style="fill:${a.emit ? '#059669' : '#dc2626'}" x="120" y="88">${a.emit ? `남는 에너지 ${fmtN(a.KE, 2)} eV → 전자 나옴` : `${fmtN(-a.KE, 2)} eV 모자람 → 전자 못 나옴`}</text>`;
        if (a.emit) out += `<text class="small-label" x="120" y="102">전자 속력 ${fmtSpeed(a.v)} · 정지 전압 ${fmtN(a.KE, 2)} V</text>`;
        const VERD = { none: '전자가 안 나옴', slow: `전자 나옴 — 최대 ${fmtN(a.KE, 2)} eV`, fast: `전자 나옴 — 최대 ${fmtN(a.KE, 2)} eV` };
        out += `<text class="verdict-text" fill="#0f172a" x="20" y="16">${state.progress >= 1 ? `${metal.label} · ${light.label} ${light.nm} nm · ${br.label}: ${VERD[a.verdict]}${a.emit ? `, 전류 ${a.current}` : ''}` : `${metal.label} · ${light.label} ${light.nm} nm · ${br.label}`}</text>`;
        out += `<text class="note-text" x="20" y="208">밝기는 광자 수(전류)만 바꾸고, 전자 한 개의 에너지 hf − W는 빛의 색(진동수)이 정합니다</text>`;
        return out;
    }

    function graphPhoto(a) {
        const X0 = 56, X1 = 420, Y0 = 146, Y1 = 34, FMAX = 13e14, KMAX = 3.5;
        const xOf = f => X0 + clamp(f / FMAX, 0, 1) * (X1 - X0), yOf = k => Y0 - clamp(k / KMAX, 0, 1) * (Y0 - Y1);
        let out = `<text class="axis-title" x="${X0}" y="16">전자의 최대 에너지 = hf − W: 금속마다 문턱 진동수만 다르고 기울기 h는 같습니다</text>`;
        for (let k = 0; k <= 3; k += 1) out += `<line class="grid-line" x1="${X0}" y1="${yOf(k).toFixed(1)}" x2="${X1}" y2="${yOf(k).toFixed(1)}"/><text class="axis-text" x="${X0 - 5}" y="${(yOf(k) + 3.5).toFixed(1)}" text-anchor="end">${k} eV</text>`;
        for (let f = 0; f <= 12e14; f += 2e14) out += `<text class="axis-text" x="${xOf(f).toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${f / 1e14}</text>`;
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        Object.entries(METALS).forEach(([k, m], i) => {
            const f0 = m.W / H_EVS, fEnd = Math.min(FMAX, (KMAX + m.W) / H_EVS);
            if (f0 < FMAX) out += `<line class="trace${k === state.metal ? '' : ' faint'}" style="stroke:${k === state.metal ? '#d97706' : '#475569'}" x1="${xOf(f0).toFixed(1)}" y1="${Y0}" x2="${xOf(fEnd).toFixed(1)}" y2="${yOf(fEnd * H_EVS - m.W).toFixed(1)}"/>`;
            out += `<text class="small-label" style="fill:${k === state.metal ? '#d97706' : '#475569'}" x="${(xOf(Math.min(f0, FMAX * 0.93)) + (i % 2 ? 3 : -3)).toFixed(1)}" y="${Y0 - 6}" text-anchor="${i % 2 ? 'start' : 'end'}">${m.label}${f0 > FMAX ? ' (눈금 밖)' : ''}</text>`;
        });
        Object.values(LIGHTS).forEach(l => { const f = C_LIGHT / (l.nm * 1e-9); out += `<line class="ref-line" style="stroke:${l.color}" x1="${xOf(f).toFixed(1)}" y1="${Y1}" x2="${xOf(f).toFixed(1)}" y2="${Y0}"/>`; });
        const xf = xOf(a.f);
        out += `<circle fill="${a.emit ? a.light.color : '#dc2626'}" stroke="#fff" stroke-width="1" cx="${xf.toFixed(1)}" cy="${yOf(Math.max(0, a.KE)).toFixed(1)}" r="4.5"/>`;
        out += `<text class="small-label" style="fill:${a.light.ink || '#0f172a'}" x="${(xf + (xf > 380 ? -6 : 6)).toFixed(1)}" y="${Y1 + 10}" text-anchor="${xf > 380 ? 'end' : 'start'}">${a.light.label} ${fmtN(a.f / 1e14, 1)}×10¹⁴ Hz${a.emit ? '' : ' — 문턱 아래'}</text>`;
        out += `<text class="axis-title" x="${(X0 + X1) / 2}" y="${Y0 + 42}" text-anchor="middle">빛의 진동수 (×10¹⁴ Hz) — 기울기 = h = 4.14×10⁻¹⁵ eV·s, 가로축 절편 = 문턱 진동수 W/h</text>`;
        return out;
    }

    const yLevel = n => 186 - Math.log(n) / Math.log(6) * 146;   // spacing eased for reading; the energies are labelled
    function renderHydrogen(a) {
        const p = state.progress, { ni, nf } = a;
        let out = '';
        for (let n = 1; n <= 6; n += 1) {
            const y = yLevel(n);
            out += `<line class="level" x1="70" y1="${y.toFixed(1)}" x2="200" y2="${y.toFixed(1)}"/>`;
            if (n <= 4) {
                out += `<text class="level-text" x="64" y="${(y + 3.5).toFixed(1)}" text-anchor="end">n = ${n}</text>`;
                out += `<text class="level-text" style="fill:#8fa8b0" x="206" y="${(y + 3.5).toFixed(1)}">${fmtN(-13.6 / (n * n), 2)} eV</text>`;
            }
        }
        out += `<line class="ref-line" x1="70" y1="26" x2="200" y2="26"/><text class="level-text" x="64" y="29.5" text-anchor="end">n = ∞</text><text class="level-text" style="fill:#8fa8b0" x="206" y="29.5">0 eV (이온화)</text>`;
        const yi = yLevel(ni), yf = yLevel(nf);
        const jump = a.verdict === 'none' ? 0 : ease(clamp((p - 0.25) / 0.3, 0, 1));
        const ey = yi + (yf - yi) * jump;
        out += `<circle class="electron-dot" cx="135" cy="${ey.toFixed(1)}" r="4.5"/>`;
        if (a.verdict !== 'none' && p > 0.25) out += `<line class="jump" x1="135" y1="${yi.toFixed(1)}" x2="135" y2="${ey.toFixed(1)}"/>`;
        if (a.verdict !== 'none' && p > 0.55) {
            const yMid = (yi + yf) / 2, tx = 440, ty = 36, front = clamp((p - 0.55) / 0.45, 0, 1);
            const wl = a.region === 'uv' ? 7 : a.region === 'ir' ? 20 : 12;
            out += squiggle(208, yMid, 208 + (tx - 208) * front, yMid + (ty - yMid) * front, wl, 5, 'photon-wave', `stroke:${a.color}${a.region !== 'visible' ? ';stroke-dasharray:3 2' : ''}`);
        }
        // readouts
        const RX = 300;
        out += `<text class="trait-text" x="${RX}" y="128">처음 준위 E${sub(ni)} = ${fmtN(a.Ei, 2)} eV</text>`;
        out += `<text class="trait-text" x="${RX}" y="144">나중 준위 E${sub(nf)} = ${fmtN(a.Ef, 2)} eV</text>`;
        if (a.verdict === 'none') {
            out += `<text class="trait-text" style="fill:#dc2626" x="${RX}" y="160">${ni === nf ? '같은 준위 — 아무 일도 없음' : `올라가려면 ${fmtN(a.dE, 2)} eV를 흡수해야 함`}</text>`;
            out += `<text class="small-label" x="${RX}" y="176">빛을 내는 것은 내려올 때뿐입니다</text>`;
        } else {
            out += `<text class="trait-text" style="fill:#0f172a" x="${RX}" y="160">차이 ΔE = ${fmtN(a.dE, 2)} eV</text>`;
            out += `<text class="trait-text" style="fill:#0f172a" x="${RX}" y="176">파장 λ = 1240 ÷ ${fmtN(a.dE, 2)} = ${fmtN(a.lam, a.lam < 200 ? 1 : 0)} nm</text>`;
            out += `<text class="trait-text" x="${RX}" y="192">${a.series} 계열 · ${a.region === 'visible' ? '눈에 보이는 빛' : a.region === 'uv' ? '자외선 (안 보임)' : '적외선 (안 보임)'}</text>`;
        }
        const VERD = { visible: '눈에 보이는 빛', uv: '자외선', ir: '적외선', none: '빛이 안 나옴' };
        out += `<text class="verdict-text" fill="#0f172a" x="20" y="16">${state.progress >= 1 ? `n = ${ni} → n = ${nf}: ${a.verdict === 'none' ? VERD.none : `${fmtN(a.lam, a.lam < 200 ? 1 : 0)} nm, ${VERD[a.verdict]} (${a.series} 계열)`}` : `n = ${ni} → n = ${nf}`}</text>`;
        out += `<text class="note-text" x="20" y="208">Eₙ = −13.6/n² eV. 준위 간격은 읽기 쉽게 벌렸고 값은 옆에 적었습니다. 내려올 때 그 차이가 광자 하나</text>`;
        return out;
    }

    function graphHydrogen(a) {
        const X0 = 40, X1 = 430, Y0 = 118, Y1 = 60;
        const xOf = nm => X0 + (Math.log10(nm) - Math.log10(90)) / (Math.log10(2000) - Math.log10(90)) * (X1 - X0);
        let out = `<text class="axis-title" x="${X0}" y="18">수소가 내는 빛의 파장 (로그 눈금) — 가운데 띠만 눈에 보입니다</text>`;
        out += `<rect fill="rgba(167,139,250,.15)" x="${X0}" y="${Y1}" width="${(xOf(380) - X0).toFixed(1)}" height="${Y0 - Y1}"/>`;
        for (let nm = 380; nm < 750; nm += 10) out += `<rect fill="${waveColor(nm + 5)}" opacity=".55" x="${xOf(nm).toFixed(1)}" y="${Y1}" width="${(xOf(nm + 10) - xOf(nm) + 0.5).toFixed(1)}" height="${Y0 - Y1}"/>`;
        out += `<rect fill="rgba(255,122,89,.15)" x="${xOf(750).toFixed(1)}" y="${Y1}" width="${(X1 - xOf(750)).toFixed(1)}" height="${Y0 - Y1}"/>`;
        out += `<text class="small-label" x="${((X0 + xOf(380)) / 2).toFixed(1)}" y="${Y1 - 6}" text-anchor="middle">자외선</text><text class="small-label" x="${((xOf(380) + xOf(750)) / 2).toFixed(1)}" y="${Y1 - 6}" text-anchor="middle">눈에 보이는 빛</text><text class="small-label" x="${((xOf(750) + X1) / 2).toFixed(1)}" y="${Y1 - 6}" text-anchor="middle">적외선</text>`;
        [100, 200, 400, 700, 1000, 2000].forEach(nm => { out += `<text class="axis-text" x="${xOf(nm).toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${nm}</text>`; });
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/>`;
        const lines = [];
        for (let nf = 1; nf <= 3; nf += 1) for (let ni = nf + 1; ni <= 7; ni += 1) { const dE = 13.6 * (1 / (nf * nf) - 1 / (ni * ni)), lam = HC / dE; if (lam >= 90 && lam <= 2000) lines.push({ nf, ni, lam }); }
        lines.forEach(l => { const now = l.nf === a.nf && l.ni === a.ni; out += `<line class="line-mark" style="stroke:${now ? '#d97706' : '#64748b'};stroke-width:${now ? 3 : 1.2}" x1="${xOf(l.lam).toFixed(1)}" y1="${Y1 + (now ? -4 : 2)}" x2="${xOf(l.lam).toFixed(1)}" y2="${Y0 + (now ? 4 : -2)}"/>`; });
        [[1, '라이먼 (n=1로)', 121.6], [2, '발머 (n=2로)', 656], [3, '파셴 (n=3으로)', 1875]].forEach(([nf, lab, nm]) => { out += `<text class="small-label" style="fill:${a.nf === nf ? '#d97706' : '#475569'}" x="${xOf(nm).toFixed(1)}" y="${Y0 + 30}" text-anchor="middle">${lab}</text>`; });
        if (a.lam) out += `<text class="trait-text" style="fill:#d97706" x="${clamp(xOf(a.lam), 70, 400).toFixed(1)}" y="${Y1 - 20}" text-anchor="middle">지금 ${fmtN(a.lam, a.lam < 200 ? 1 : 0)} nm</text>`;
        out += `<text class="small-label" x="${X0}" y="${Y0 + 48}">발머 계열 656·486·434·410 nm가 수소 방전관의 붉은빛과 푸른 선입니다. 흰 선은 n = 7까지의 모든 전이.</text>`;
        return out;
    }

    function renderMatter(a) {
        const p = state.progress, { o } = a;
        let out = `<circle class="atom" cx="110" cy="118" r="20"/><circle class="nucleus" cx="110" cy="118" r="2.5"/>`;
        out += `<text class="small-label" x="110" y="150" text-anchor="middle">수소 원자 · 지름 0.1 nm</text>`;
        const wlPx = a.lam * 400e9;   // 400 px per nm
        if (wlPx >= 1.5) {
            let d = '';
            for (let x = 160; x <= 440; x += 1) { const y = 118 + 22 * Math.sin(2 * Math.PI * ((x - 160) / wlPx) - p * 6.28 * 2); d += `${d ? 'L' : 'M'}${x},${y.toFixed(1)} `; }
            out += `<path class="wave" d="${d}"/>`;
            if (wlPx <= 280) { out += `<line class="ref-line" style="stroke:#d97706" x1="160" y1="156" x2="${(160 + wlPx).toFixed(1)}" y2="156"/><text class="small-label" style="fill:#d97706" x="${Math.max(200, 160 + wlPx / 2).toFixed(1)}" y="168" text-anchor="middle">한 파장 ${fmtLam(a.lam)}</text>`; }
            else out += `<text class="small-label" style="fill:#d97706" x="300" y="168" text-anchor="middle">한 파장 ${fmtLam(a.lam)} — 화면보다 김 (원자 ${fmtN(a.ratio)}개 너비)</text>`;
        } else {
            out += `<line class="wave" x1="160" y1="118" x2="440" y2="118"/>`;
            out += `<text class="small-label" style="fill:#d97706" x="300" y="168" text-anchor="middle">파장 ${fmtSci(a.lam)} m — 어떤 눈금으로도 물결이 보이지 않음</text>`;
        }
        out += `<text class="trait-text" x="160" y="44">${o.name}</text>`;
        out += `<text class="trait-text" x="160" y="60">속력 ${fmtSpeed(a.v)} · 운동량 p = mv = ${fmtSci(a.p)} kg·m/s</text>`;
        out += `<text class="trait-text" style="fill:#0284c7" x="160" y="76">파장 λ = h/p = ${fmtLam(a.lam)}</text>`;
        out += `<text class="small-label" x="160" y="90">원자 지름(0.1 nm)의 ${a.ratio >= 0.01 ? `${fmtN(a.ratio, a.ratio < 1 ? 2 : 1)}배` : `${fmtSci(a.ratio, 0)}배`}</text>`;
        const VERD = { big: '원자보다 큼', atom: '원자만 함', tiny: '잴 수 없이 작음' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${state.progress >= 1 ? `${o.name}: 파장 ${fmtLam(a.lam)} — ${VERD[a.verdict]}` : o.name}</text>`;
        out += `<text class="note-text" x="20" y="208">드브로이 파장 λ = h/p, h = 6.63×10⁻³⁴ J·s. 파장보다 작은 것은 파동으로 구별할 수 없습니다</text>`;
        return out;
    }

    function graphMatter(a) {
        const X0 = 120, X1 = 430, Y = 44, BH = 20;
        const xOf = lam => X0 + clamp((Math.log10(lam) + 36) / 31, 0, 1) * (X1 - X0);
        let out = `<text class="axis-title" x="20" y="18">파장 (로그 눈금, m) — 원자·원자핵·빛의 파장과 견주기</text>`;
        [-35, -30, -25, -20, -15, -10, -5].forEach(e => { const x = xOf(10 ** e); out += `<line class="grid-line" x1="${x.toFixed(1)}" y1="${Y - 8}" x2="${x.toFixed(1)}" y2="${Y + 4 * (BH + 6)}"/><text class="axis-text" x="${x.toFixed(1)}" y="${Y + 4 * (BH + 6) + 14}" text-anchor="middle">10${sup(e)}</text>`; });
        [[1e-15, '원자핵', '#dc2626'], [1e-10, '원자', '#d97706'], [5e-7, '가시광선', '#059669']].forEach(([lam, lab, col]) => { const x = xOf(lam); out += `<line class="ref-line" style="stroke:${col}" x1="${x.toFixed(1)}" y1="${Y - 8}" x2="${x.toFixed(1)}" y2="${Y + 4 * (BH + 6)}"/><text class="small-label" style="fill:${col}" x="${x.toFixed(1)}" y="${Y - 12}" text-anchor="middle">${lab}</text>`; });
        Object.entries(OBJS).forEach(([k, o], i) => {
            let pp; if (o.v) pp = o.m * o.v; else { const KEj = o.KE * QE, mc2 = o.m * C_LIGHT * C_LIGHT; pp = Math.sqrt(KEj * KEj + 2 * KEj * mc2) / C_LIGHT; }
            const lam = H / pp, y = Y + i * (BH + 6), w = xOf(lam) - X0;
            out += `<rect class="${k === 'ball' ? 'bar-ball' : 'bar-e'}" style="opacity:${k === state.obj ? 1 : 0.5}" x="${X0}" y="${y}" width="${w.toFixed(1)}" height="${BH}" rx="3"/>`;
            if (k === state.obj) out += `<rect class="bar-now" x="${X0}" y="${y}" width="${w.toFixed(1)}" height="${BH}" rx="3"/>`;
            out += `<text class="trait-text" x="${X0 - 6}" y="${y + BH / 2 + 4}" text-anchor="end">${o.label.replace('전자 · ', '전자 ').replace('로 가속', '')}</text>`;
            out += `<text class="trait-text" x="${(X0 + w + 6).toFixed(1)}" y="${y + BH / 2 + 4}">${fmtLam(lam)}</text>`;
        });
        return out;
    }

    function noteFor(a) {
        if (a.kind === 'photo') {
            return `<div class="data-row"><span class="data-name">빛</span><span class="data-val">${a.light.label} ${a.light.nm} nm · 진동수 ${fmtN(a.f / 1e14, 2)}×10¹⁴ Hz · 광자 에너지 hf = ${fmtN(a.hf, 2)} eV · ${a.br.label}</span></div>` +
                `<div class="data-row"><span class="data-name">금속</span><span class="data-val">${a.metal.label} — 일함수 ${fmtN(a.metal.W, 2)} eV · 문턱 파장 ${fmtN(a.lam0)} nm (진동수 ${fmtN(a.f0 / 1e14, 2)}×10¹⁴ Hz)</span></div>` +
                `<div class="data-row"><span class="data-name">전자</span><span class="data-val">${a.emit ? `최대 에너지 ${fmtN(a.KE, 2)} eV · 속력 ${fmtSpeed(a.v)} · 정지 전압 ${fmtN(a.KE, 2)} V` : `광자 에너지가 일함수보다 ${fmtN(-a.KE, 2)} eV 작아 나오지 않음`}</span></div>` +
                `<div class="data-row match"><span class="data-name">전류</span><span class="data-val">${a.emit ? `상대값 ${a.current} (광자 수에 비례)` : '0 — 아무리 밝아도 0'}</span></div>`;
        }
        if (a.kind === 'hydrogen') {
            return `<div class="data-row"><span class="data-name">준위</span><span class="data-val">E${sub(a.ni)} = −13.6/${a.ni}² = ${fmtN(a.Ei, 2)} eV → E${sub(a.nf)} = −13.6/${a.nf}² = ${fmtN(a.Ef, 2)} eV</span></div>` +
                (a.verdict === 'none' ? `<div class="data-row match"><span class="data-name">결과</span><span class="data-val">${a.ni === a.nf ? '같은 준위라 변화 없음' : `낮은 곳에서 높은 곳으로는 ${fmtN(a.dE, 2)} eV의 빛을 흡수해야 올라감 — 빛이 나오지 않음`}</span></div>`
                    : `<div class="data-row"><span class="data-name">광자</span><span class="data-val">ΔE = ${fmtN(a.dE, 2)} eV · λ = 1240 ÷ ${fmtN(a.dE, 2)} = ${fmtN(a.lam, a.lam < 200 ? 1 : 0)} nm · 진동수 ${fmtN(C_LIGHT / (a.lam * 1e-9) / 1e14, 2)}×10¹⁴ Hz</span></div>` +
                    `<div class="data-row match"><span class="data-name">계열</span><span class="data-val">${a.series} 계열 — ${a.region === 'visible' ? '눈에 보이는 빛' : a.region === 'uv' ? '자외선' : '적외선'}</span></div>`);
        }
        return `<div class="data-row"><span class="data-name">물체</span><span class="data-val">${a.o.name} — 질량 ${a.o.m >= 1e-3 ? `${fmtN(a.o.m * 1000)} g` : `${fmtSci(a.o.m, 2)} kg`} · 속력 ${fmtSpeed(a.v)}</span></div>` +
            `<div class="data-row"><span class="data-name">운동량</span><span class="data-val">p = ${fmtSci(a.p, 2)} kg·m/s</span></div>` +
            `<div class="data-row"><span class="data-name">파장</span><span class="data-val">λ = h/p = 6.63×10⁻³⁴ ÷ ${fmtSci(a.p, 2)} = ${fmtLam(a.lam)}</span></div>` +
            `<div class="data-row match"><span class="data-name">원자와 견주면</span><span class="data-val">${a.ratio >= 10 ? `원자 ${fmtN(a.ratio)}개 너비 — 원자를 구별 못 함` : a.ratio >= 0.01 ? `원자 지름의 ${fmtN(a.ratio, 2)}배 — 원자 배열을 볼 수 있음` : `원자의 ${fmtSci(a.ratio, 0)}배 — 파동성이 드러날 길 없음`}</span></div>`;
    }

    function render() {
        const a = analyse();
        mainGroup.innerHTML = a.kind === 'photo' ? renderPhoto(a) : a.kind === 'hydrogen' ? renderHydrogen(a) : renderMatter(a);
        graphGroup.innerHTML = a.kind === 'photo' ? graphPhoto(a) : a.kind === 'hydrogen' ? graphHydrogen(a) : graphMatter(a);
        liftProse();
        stageBadge.textContent = a.kind === 'photo' ? `${a.metal.label} · ${a.light.label} · ${a.br.label}` : a.kind === 'hydrogen' ? `n = ${a.ni} → n = ${a.nf}` : a.o.label;
        methodHint.textContent = a.kind === 'photo' ? '광자 하나의 에너지 hf가 일함수를 넘어야 전자가 나옵니다. 밝기는 개수만 바꿉니다'
            : a.kind === 'hydrogen' ? '전자가 내려올 때 두 준위의 에너지 차이가 광자 하나가 됩니다'
                : '움직이는 것은 무엇이든 파장 h/p의 파동이기도 합니다';
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
        if (a.kind === 'photo') {
            const { metal, light, br } = a;
            labelA.textContent = '전자 한 개의 최대 에너지'; valueA.textContent = a.emit ? `${fmtN(a.KE, 2)} eV` : '나오지 않음';
            labelB.textContent = '전류 (상대값)'; valueB.textContent = `${a.current}`;
            s = `${light.label} 빛(${light.nm} nm)의 광자 하나는 hf = 1240 ÷ ${light.nm} = ${fmtN(a.hf, 2)} eV의 에너지를 지닙니다. ${metal.label}에서 전자 하나를 떼어내는 데는 일함수 ${fmtN(metal.W, 2)} eV가 듭니다. `;
            if (!a.emit) s += `광자 하나가 ${fmtN(-a.KE, 2)} eV 모자라 전자가 전혀 나오지 않았습니다. 빛을 네 배로 밝게 해도 광자 수만 늘 뿐 광자 하나의 에너지는 그대로라 여전히 0입니다. ${metal.label}의 문턱 파장은 ${fmtN(a.lam0)} nm로, 그보다 짧은 빛이라야 합니다.`;
            else s += `광자 하나가 일함수를 넘으므로 전자가 곧바로 튀어나오고, 남는 ${fmtN(a.KE, 2)} eV가 전자의 최대 운동 에너지가 되어 ${fmtSpeed(a.v)}로 날아갑니다. 이 전자를 멈추려면 ${fmtN(a.KE, 2)} V의 정지 전압이 필요합니다. ${br.rate > 1 ? '밝은 빛은 광자가 네 배라 전자도 네 배 나와 전류가 4가 되지만, 전자 한 개의 에너지는 어두울 때와 똑같습니다.' : '빛을 네 배 밝게 하면 전류만 4로 늘고 전자 한 개의 에너지는 그대로입니다.'}${a.KE < 0.15 ? ' 문턱을 겨우 넘어 전자는 아주 느립니다.' : ''}`;
        } else if (a.kind === 'hydrogen') {
            labelA.textContent = '나오는 빛'; valueA.textContent = a.verdict === 'none' ? '없음' : `${fmtN(a.lam, a.lam < 200 ? 1 : 0)} nm`;
            labelB.textContent = '광자 에너지'; valueB.textContent = a.verdict === 'none' ? '—' : `${fmtN(a.dE, 2)} eV`;
            if (a.verdict === 'none') s = a.ni === a.nf ? `처음과 나중이 같은 준위라 아무 일도 일어나지 않습니다. 빛은 전자가 다른 준위로 옮겨 갈 때만 나옵니다.` : `n = ${a.ni}(${fmtN(a.Ei, 2)} eV)에서 n = ${a.nf}(${fmtN(a.Ef, 2)} eV)로는 올라가는 것이라 에너지가 ${fmtN(a.dE, 2)} eV 더 필요합니다. 꼭 그 에너지의 광자를 흡수해야 올라갈 수 있고, 빛이 나오는 것은 높은 준위에서 낮은 준위로 내려올 때뿐입니다. 이것이 흡수 스펙트럼의 검은 선이 됩니다.`;
            else s = `전자가 n = ${a.ni}(${fmtN(a.Ei, 2)} eV)에서 n = ${a.nf}(${fmtN(a.Ef, 2)} eV)로 내려오며 두 준위의 차이 ${fmtN(a.dE, 2)} eV를 광자 하나로 내놓았습니다. 파장은 λ = 1240 ÷ ${fmtN(a.dE, 2)} = ${fmtN(a.lam, a.lam < 200 ? 1 : 0)} nm로 ${a.region === 'visible' ? `눈에 보이는 ${a.lam > 620 ? '빨간' : a.lam > 495 ? '청록' : '보랏빛 도는 파란'}빛` : a.region === 'uv' ? '자외선이라 눈에 보이지 않습니다' : '적외선이라 눈에 보이지 않습니다'}${a.region === 'visible' ? '입니다' : ''}. n = ${a.nf}로 내려오는 전이들을 ${a.series} 계열이라 부르고, ${a.nf === 2 ? '이 계열만 눈에 보여 수소 방전관의 붉은빛(656 nm)과 푸른 선들이 됩니다' : a.nf === 1 ? '바닥 준위로 떨어지는 만큼 에너지가 커서 모두 자외선입니다' : '에너지 차이가 작아 모두 적외선입니다'}. 준위가 띄엄띄엄이라 특정 파장만 나오는 것이 선 스펙트럼입니다.`;
        } else {
            const { o } = a;
            labelA.textContent = '물질파 파장'; valueA.textContent = fmtLam(a.lam);
            labelB.textContent = '원자 지름과 견주면'; valueB.textContent = a.ratio >= 0.01 ? `${fmtN(a.ratio, a.ratio < 1 ? 2 : 1)}배` : `${fmtSci(a.ratio, 0)}배`;
            s = `${o.name}${o.v ? `(145 g, ${fmtSpeed(a.v)})의` : `는 ${fmtSpeed(a.v)}로 움직이고`} 운동량은 p = mv = ${fmtSci(a.p, 2)} kg·m/s입니다. 드브로이 파장은 λ = h/p = ${fmtLam(a.lam)}입니다. `;
            s += a.verdict === 'big' ? `원자 지름 0.1 nm의 ${fmtN(a.ratio)}배나 되어 이 전자로는 원자 하나하나를 구별할 수 없습니다. 느린 전자는 파동성이 크게 드러납니다.`
                : a.verdict === 'atom' ? `원자 크기와 비슷하거나 더 짧아, 결정의 원자 배열에서 회절하고(데이비슨·저머 실험) 전자 현미경에서 원자 배열을 볼 수 있습니다. 파장이 500 nm쯤인 빛으로는 그 ${fmtN(5e-7 / a.lam)}분의 1 크기까지 보는 셈입니다.`
                    : `${fmtSci(a.lam)} m는 원자핵(10⁻¹⁵ m)보다도 10¹⁹배나 짧아 어떤 실험으로도 파동성이 드러나지 않습니다. 그래서 일상의 물체는 그냥 알갱이로만 보입니다. 물질파는 전자처럼 가벼운 것에서만 뚜렷합니다.`;
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
        checkBtn.textContent = state.mode === 'photo' ? '빛 비추기' : state.mode === 'hydrogen' ? '전자 내려보내기' : '물결 재기';
        stageCaption.textContent = state.mode === 'photo' ? '진공관 왼쪽의 금속판에 빛(물결)을 비춥니다. 파란 점이 튀어나온 전자이고 오른쪽 판에 닿으면 전류계 바늘이 움직입니다.'
            : state.mode === 'hydrogen' ? '왼쪽 사다리가 수소 원자의 에너지 준위입니다. 파란 점이 전자이고, 내려올 때 나오는 빛이 오른쪽 위로 날아갑니다.'
                : '왼쪽 원이 수소 원자(지름 0.1 nm)입니다. 오른쪽 물결의 파장을 같은 눈금으로 그렸습니다(1 nm = 400칸).';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { metal: 'na', light: 'green', bright: 'dim', from: 'n3', to: 'n2', obj: 'e100', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'photo').click();
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

    window.__photoModel = {
        METALS, LIGHTS, BRIGHTS, FROMS, TOS, OBJS, state,
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
