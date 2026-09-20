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
    const NA = 6.022e23, VM = 22.4;
    const SUBS = {
        water: { label: '물', formula: 'H₂O', M: 18.02, kind: 'liquid', per: '물 분자', short: '분자' },
        salt: { label: '소금', formula: 'NaCl', M: 58.44, kind: 'solid', per: 'NaCl 단위(이온 쌍)', short: 'NaCl 단위' },
        sugar: { label: '설탕', formula: 'C₁₂H₂₂O₁₁', M: 342.3, kind: 'solid', per: '설탕 분자', short: '분자' },
        iron: { label: '철', formula: 'Fe', M: 55.85, kind: 'metal', per: '철 원자', short: '원자' },
        oxygen: { label: '산소 기체', formula: 'O₂', M: 32.00, kind: 'gas', per: '산소 분자', short: '분자' },
    };
    const MASSES = { g10: { label: '10 g', g: 10 }, g50: { label: '50 g', g: 50 }, g100: { label: '100 g', g: 100 }, kg1: { label: '1 kg', g: 1000 } };
    const REACTIONS = {
        h2o: { label: '수소 연소', eq: '2H₂ + O₂ → 2H₂O', A: { name: '수소', f: 'H₂', M: 2.016, coef: 2 }, B: { name: '산소', f: 'O₂', M: 32.00, coef: 1 }, products: [{ name: '물', f: 'H₂O', M: 18.02, coef: 2 }] },
        ch4: { label: '메테인 연소', eq: 'CH₄ + 2O₂ → CO₂ + 2H₂O', A: { name: '메테인', f: 'CH₄', M: 16.04, coef: 1 }, B: { name: '산소', f: 'O₂', M: 32.00, coef: 2 }, products: [{ name: '이산화 탄소', f: 'CO₂', M: 44.01, coef: 1 }, { name: '물', f: 'H₂O', M: 18.02, coef: 2 }] },
        mg: { label: '마그네슘 + 염산', eq: 'Mg + 2HCl → MgCl₂ + H₂', A: { name: '마그네슘', f: 'Mg', M: 24.31, coef: 1 }, B: { name: '염화 수소', f: 'HCl', M: 36.46, coef: 2 }, products: [{ name: '염화 마그네슘', f: 'MgCl₂', M: 95.21, coef: 1 }, { name: '수소', f: 'H₂', M: 2.016, coef: 1 }] },
    };
    const AMT_A = { a1: { label: '1 mol', n: 1 }, a2: { label: '2 mol', n: 2 } };
    const AMT_B = { b05: { label: '0.5 mol', n: 0.5 }, b1: { label: '1 mol', n: 1 }, b2: { label: '2 mol', n: 2 }, b4: { label: '4 mol', n: 4 } };
    const SOLUTES = { nacl: { label: '소금 NaCl', short: '소금', M: 58.44 }, glucose: { label: '포도당 C₆H₁₂O₆', short: '포도당', M: 180.16 }, naoh: { label: '수산화 나트륨 NaOH', short: '수산화 나트륨', M: 40.00 } };
    const NSOL = { n01: { label: '0.1 mol', n: 0.1 }, n05: { label: '0.5 mol', n: 0.5 }, n1: { label: '1 mol', n: 1 } };
    const VOLS = { v250: { label: '250 mL', L: 0.25 }, v500: { label: '500 mL', L: 0.5 }, v1000: { label: '1 L', L: 1 } };
    const DILS = { none: { label: '그대로', hint: '묽히지 않음', k: 1 }, x2: { label: '2배 부피로', hint: '물을 더 넣음', k: 2 }, x4: { label: '4배 부피로', hint: '물을 더 넣음', k: 4 } };

    const state = { mode: 'count', sub: 'water', mass: 'g100', rxn: 'h2o', na: 'a2', nb: 'b1', solute: 'nacl', nsol: 'n05', vol: 'v500', dil: 'none', progress: 0, prediction: null };
    let running = false, frameId = 0, lastStamp = 0;

    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const ease = p => p < 0.5 ? 2 * p * p : 1 - (1 - p) * (1 - p) * 2;
    const fmtN = (n, d = 0) => (+n.toFixed(d)).toLocaleString('ko-KR', { minimumFractionDigits: d, maximumFractionDigits: d }).replace('-', '−');
    const SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
    const sup = s => String(s).split('').map(ch => SUP[ch] || ch).join('');
    const fmtSci = (x, d = 2) => { if (x === 0) return '0'; const e = Math.floor(Math.log10(Math.abs(x))); const m = x / 10 ** e; return e === 0 ? m.toFixed(d) : `${m.toFixed(d)}×10${sup(e)}`; };
    const fmtMol = n => fmtN(n, n < 0.1 ? 3 : n < 10 ? 2 : 1);
    const fmtG = g => g >= 1000 ? `${fmtN(g / 1000, 2)} kg` : `${fmtN(g, g < 10 ? 2 : 1)} g`;
    const fmtVolL = L => L >= 1 ? `${fmtN(L, L < 10 ? 2 : 0)} L` : `${fmtN(L * 1000)} mL`;
    const jong = ch => { const c = ch.charCodeAt(0); return c >= 0xac00 && c <= 0xd7a3 ? (c - 0xac00) % 28 : 0; };
    const last = w => w.replace(/[^가-힣]+$/, '').slice(-1);
    const iga = w => jong(last(w)) ? '이' : '가';
    const eul = w => jong(last(w)) ? '을' : '를';
    const eun = w => jong(last(w)) ? '은' : '는';
    const eulNum = n => '013678'.includes(String(n).slice(-1)) ? '을' : '를';

    /* ------------------------------------------------------------ models */
    function analyse() {
        if (state.mode === 'count') {
            const sub = SUBS[state.sub], g = MASSES[state.mass].g;
            const n = g / sub.M, N = n * NA, V = sub.kind === 'gas' ? n * VM : null;
            return { kind: 'count', sub, g, n, N, V, verdict: n < 0.8 ? 'less' : n <= 1.25 ? 'one' : 'more' };
        }
        if (state.mode === 'react') {
            const r = REACTIONS[state.rxn], nA = AMT_A[state.na].n, nB = AMT_B[state.nb].n;
            const rA = nA / r.A.coef, rB = nB / r.B.coef, ext = Math.min(rA, rB);
            const usedA = ext * r.A.coef, usedB = ext * r.B.coef, leftA = nA - usedA, leftB = nB - usedB;
            const prods = r.products.map(pr => ({ ...pr, n: ext * pr.coef, g: ext * pr.coef * pr.M }));
            const before = nA * r.A.M + nB * r.B.M, after = prods.reduce((s, pr) => s + pr.g, 0) + leftA * r.A.M + leftB * r.B.M;
            const verdict = Math.abs(rA - rB) < 1e-9 ? 'exact' : rA < rB ? 'bLeft' : 'aLeft';
            return { kind: 'react', r, nA, nB, ext, usedA, usedB, leftA, leftB, prods, before, after, limiting: verdict === 'aLeft' ? 'B' : verdict === 'bLeft' ? 'A' : null, verdict };
        }
        const so = SOLUTES[state.solute], n = NSOL[state.nsol].n, V1 = VOLS[state.vol].L, k = DILS[state.dil].k;
        const M1 = n / V1, V2 = V1 * k, M2 = M1 / k, g = n * so.M;
        return { kind: 'molar', so, n, g, V1, M1, V2, M2, k, verdict: M2 < 0.5 ? 'low' : M2 <= 1.5 ? 'mid' : 'high' };
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
    const opts = table => Object.entries(table).map(([k, v]) => ({ value: k, label: v.label, hint: v.hint }));

    function buildControls() {
        if (state.mode === 'count') controlArea.innerHTML = pickRow('물질', 'sub', Object.entries(SUBS).map(([k, v]) => ({ value: k, label: v.label, hint: `${v.formula} · ${fmtN(v.M, 1)} g/mol` })), state.sub, 5) + pickRow('양', 'mass', opts(MASSES), state.mass, 4);
        else if (state.mode === 'react') { const r = REACTIONS[state.rxn]; controlArea.innerHTML = pickRow('반응', 'rxn', Object.entries(REACTIONS).map(([k, v]) => ({ value: k, label: v.label, hint: v.eq })), state.rxn, 3) + pickRow(`${r.A.name} ${r.A.f}의 양`, 'na', opts(AMT_A), state.na, 2) + pickRow(`${r.B.name} ${r.B.f}의 양`, 'nb', opts(AMT_B), state.nb, 4); }
        else controlArea.innerHTML = pickRow('용질', 'solute', Object.entries(SOLUTES).map(([k, v]) => ({ value: k, label: v.label, hint: `${fmtN(v.M, 1)} g/mol` })), state.solute, 3) + pickRow('용질의 양', 'nsol', opts(NSOL), state.nsol, 3) + pickRow('용액 부피', 'vol', opts(VOLS), state.vol, 3) + pickRow('묽히기', 'dil', opts(DILS), state.dil, 3);
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                if (group.dataset.pick === 'rxn') buildControls();
                buildPrediction();
                settingsChanged();
            }));
        });
    }

    const PRED_C = [{ value: 'less', label: '1몰보다 적다' }, { value: 'one', label: '거의 1몰 (0.8~1.25)' }, { value: 'more', label: '1몰보다 많다' }];
    const PRED_M = [{ value: 'low', label: '0.5 M 아래' }, { value: 'mid', label: '0.5~1.5 M' }, { value: 'high', label: '1.5 M 넘게' }];

    function buildPrediction() {
        let list;
        if (state.mode === 'count') list = PRED_C;
        else if (state.mode === 'react') { const r = REACTIONS[state.rxn]; list = [{ value: 'aLeft', label: `${r.A.name}${iga(r.A.name)} 남음` }, { value: 'exact', label: '둘 다 딱 맞게 쓰임' }, { value: 'bLeft', label: `${r.B.name}${iga(r.B.name)} 남음` }]; }
        else list = PRED_M;
        predictionLegend.textContent = state.mode === 'count' ? `${SUBS[state.sub].label} ${MASSES[state.mass].label}은 몇 몰일까요?`
            : state.mode === 'react' ? `${REACTIONS[state.rxn].A.name} ${AMT_A[state.na].label}과 ${REACTIONS[state.rxn].B.name} ${AMT_B[state.nb].label}을 반응시키면?`
                : `${SOLUTES[state.solute].short} ${NSOL[state.nsol].label}로 ${VOLS[state.vol].label} 용액을 만들고 ${DILS[state.dil].label === '그대로' ? '그대로 두면' : `${DILS[state.dil].label} 묽히면`} 농도는?`;
        predictionArea.className = 'prediction-buttons three';
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction;
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    function renderCount(a) {
        const p = state.progress, { sub, g, n } = a, shown = g * ease(clamp(p / 0.6, 0, 1));
        let out = '';
        // a digital scale
        out += `<rect class="pan" x="40" y="150" width="180" height="10" rx="3"/><rect class="box" x="60" y="162" width="140" height="30" rx="5"/>`;
        out += `<text class="gen-text" x="130" y="182" text-anchor="middle">${shown >= 1000 ? `${fmtN(shown / 1000, 2)} kg` : `${fmtN(shown, 1)} g`}</text>`;
        // the sample
        const size = 18 + 26 * Math.log10(g / 10 + 1);
        if (sub.kind === 'liquid') out += `<path class="beaker" d="M${130 - size / 2},${150 - size} L${130 - size / 2},150 L${130 + size / 2},150 L${130 + size / 2},${150 - size}"/><rect class="sample-liquid" x="${130 - size / 2 + 1}" y="${150 - size * 0.7}" width="${size - 2}" height="${size * 0.7 - 1}"/>`;
        else if (sub.kind === 'gas') out += `<rect class="sample-gas" x="${130 - size / 2 - 6}" y="${150 - size - 8}" width="${size + 12}" height="${size + 8}" rx="8"/><text class="small-label" x="130" y="${150 - size / 2 - 2}" text-anchor="middle">${a.V >= 1000 ? `${fmtN(a.V / 1000, 1)} m³` : `${fmtN(a.V, a.V < 10 ? 1 : 0)} L`}</text>`;
        else out += `<polygon class="${sub.kind === 'metal' ? 'sample-iron' : 'sample-solid'}" points="${130 - size / 2},150 ${130 - size / 4},${150 - size * 0.8} ${130 + size / 5},${150 - size} ${130 + size / 2},150"/>`;
        out += `<text class="small-label" x="130" y="${(150 - size - 14).toFixed(1)}" text-anchor="middle">${sub.label} ${sub.formula} ${MASSES[state.mass].label}</text>`;
        // bundles of a mole each
        const nb = Math.min(Math.ceil(n - 1e-9), 12), BX = 236, BY = 118;
        for (let i = 0; i < nb; i += 1) {
            const x = BX + (i % 6) * 32, y = BY + Math.floor(i / 6) * 32, frac = Math.min(1, n - i), vis = clamp((p - 0.3) * 3 - i * 0.05, 0, 1);
            if (vis <= 0) continue;
            out += `<rect class="box" x="${x}" y="${y}" width="26" height="26" rx="4" opacity="${vis.toFixed(2)}"/>`;
            out += `<rect class="bar-a" x="${x + 2}" y="${(y + 24 - 22 * frac).toFixed(1)}" width="22" height="${(22 * frac).toFixed(1)}" rx="2" opacity="${vis.toFixed(2)}"/>`;
        }
        out += `<text class="small-label" x="${BX}" y="${BY - 8}">1몰 묶음으로 세면${n > 12 ? ` (${fmtMol(n)}묶음 중 12개만 그림)` : ''}</text>`;
        out += `<text class="trait-text" x="236" y="40">몰 질량 ${fmtN(sub.M, 2)} g/mol (1몰의 질량)</text>`;
        out += `<text class="trait-text" style="fill:#d97706" x="236" y="58">몰수 = ${fmtG(g)} ÷ ${fmtN(sub.M, 2)} = ${fmtMol(n)} mol</text>`;
        out += `<text class="trait-text" style="fill:#0284c7" x="236" y="76">${sub.short} 수 = ${fmtMol(n)} × 6.02×10²³ = ${fmtSci(a.N)}개</text>`;
        if (a.V !== null) out += `<text class="trait-text" style="fill:#97dad3" x="236" y="94">0 ℃ 1기압 부피 = ${fmtMol(n)} × 22.4 L = ${a.V >= 1000 ? `${fmtN(a.V / 1000, 2)} m³` : `${fmtN(a.V, a.V < 10 ? 2 : 1)} L`}</text>`;
        const VERD = { less: '1몰보다 적음', one: '거의 1몰', more: '1몰보다 많음' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${state.progress >= 1 ? `${sub.label} ${MASSES[state.mass].label}: ${fmtMol(n)} mol = ${fmtSci(a.N)}개 — ${VERD[a.verdict]}` : `${sub.label} ${sub.formula} · ${MASSES[state.mass].label}`}</text>`;
        out += `<text class="note-text" x="20" y="208">몰수 = 질량 ÷ 몰 질량. 저울로 무게를 재는 것이 곧 개수를 세는 것입니다</text>`;
        return out;
    }

    function graphCount(a) {
        const { sub } = a, X0 = 90, X1 = 420, Y = 44, BH = 20;
        const xOf = n => X0 + clamp((Math.log10(n) + 2) / 4, 0, 1) * (X1 - X0);   // 0.01 … 100 mol
        let out = `<text class="axis-title" x="20" y="18">${sub.label} ${sub.formula}의 양에 따른 몰수 (로그 눈금) — 초록 띠가 '거의 1몰'</text>`;
        out += `<rect class="band-good" x="${xOf(0.8).toFixed(1)}" y="${Y - 8}" width="${(xOf(1.25) - xOf(0.8)).toFixed(1)}" height="${4 * (BH + 6) + 8}"/>`;
        [0.01, 0.1, 1, 10, 100].forEach(n => { const x = xOf(n); out += `<line class="grid-line" x1="${x.toFixed(1)}" y1="${Y - 8}" x2="${x.toFixed(1)}" y2="${Y + 4 * (BH + 6)}"/><text class="axis-text" x="${x.toFixed(1)}" y="${Y + 4 * (BH + 6) + 14}" text-anchor="middle">${n} mol</text>`; });
        out += `<line class="ref-line" style="stroke:#d97706" x1="${xOf(1).toFixed(1)}" y1="${Y - 8}" x2="${xOf(1).toFixed(1)}" y2="${Y + 4 * (BH + 6)}"/>`;
        Object.entries(MASSES).forEach(([k, m], i) => {
            const n = m.g / sub.M, y = Y + i * (BH + 6), w = Math.max(2, xOf(n) - X0);
            out += `<rect class="bar-a" style="opacity:${k === state.mass ? 1 : 0.45}" x="${X0}" y="${y}" width="${w.toFixed(1)}" height="${BH}" rx="3"/>`;
            if (k === state.mass) out += `<rect class="bar-now" x="${X0}" y="${y}" width="${w.toFixed(1)}" height="${BH}" rx="3"/>`;
            out += `<text class="trait-text" x="${X0 - 6}" y="${y + BH / 2 + 4}" text-anchor="end">${m.label}</text>`;
            out += `<text class="trait-text" x="${(X0 + w + 6).toFixed(1)}" y="${y + BH / 2 + 4}">${fmtMol(n)} mol${sub.kind === 'gas' ? ` · ${fmtN(n * VM, n * VM < 10 ? 1 : 0)} L` : ''}</text>`;
        });
        out += `<text class="small-label" x="20" y="${Y + 4 * (BH + 6) + 32}">${sub.formula} 1몰 = ${fmtN(sub.M, 1)} g. 양이 10배면 몰수도 10배 — 눈금 한 칸.</text>`;
        return out;
    }

    function dots(cls, count, x, y, w, h, seed, vis = 1) {
        let out = '';
        for (let i = 0; i < count; i += 1) { const px = x + 8 + ((i * 53 + seed * 17) % (w - 16)), py = y + 8 + ((i * 37 + seed * 29) % (h - 16)); out += `<circle class="particle ${cls}" cx="${px}" cy="${py}" r="4" opacity="${vis.toFixed(2)}"/>`; }
        return out;
    }

    function renderReact(a) {
        const p = state.progress, { r } = a, per = 4;
        const react = clamp((p - 0.35) / 0.4, 0, 1);
        let out = `<text class="gen-text" x="230" y="36" text-anchor="middle">${r.eq}</text>`;
        // reactant boxes
        const boxes = [{ x: 30, n: a.nA, used: a.usedA, cls: 'p-a', who: r.A }, { x: 140, n: a.nB, used: a.usedB, cls: 'p-b', who: r.B }];
        boxes.forEach((b, i) => {
            out += `<rect class="box" x="${b.x}" y="56" width="96" height="96" rx="6"/>`;
            const left = b.n - b.used * react;
            out += dots(b.cls, Math.round(left * per), b.x, 56, 96, 96, i + 1);
            out += `<text class="trait-text" x="${b.x + 48}" y="166" text-anchor="middle">${b.who.name} ${b.who.f}</text>`;
            out += `<text class="small-label" x="${b.x + 48}" y="178" text-anchor="middle">${fmtMol(left)} mol · ${fmtG(left * b.who.M)}</text>`;
        });
        out += `<polygon class="arrow-big" points="250,98 250,110 268,110 268,118 284,104 268,90 268,98"/>`;
        // product box
        out += `<rect class="box" x="300" y="56" width="130" height="96" rx="6"/>`;
        a.prods.forEach((pr, i) => { out += dots(i === 0 ? 'p-c' : 'p-d', Math.round(pr.n * react * per), 300 + i * 40, 56, 130 - i * 40, 96, 5 + i); });
        out += `<text class="trait-text" x="365" y="166" text-anchor="middle">${a.prods.map(pr => `${pr.name} ${pr.f}`).join(' + ')}</text>`;
        out += `<text class="small-label" x="365" y="178" text-anchor="middle">${a.prods.map(pr => `${fmtMol(pr.n * react)} mol`).join(' · ')}</text>`;
        out += `<text class="small-label" x="30" y="50">넣은 양 (점 하나 = 0.25 mol)</text>`;
        const VERD = { aLeft: `${r.B.name}${iga(r.B.name)} 먼저 바닥나고 ${r.A.name} ${fmtMol(a.leftA)} mol 남음`, bLeft: `${r.A.name}${iga(r.A.name)} 먼저 바닥나고 ${r.B.name} ${fmtMol(a.leftB)} mol 남음`, exact: '계수 비대로 둘 다 딱 맞게 쓰임' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${state.progress >= 1 ? `${r.label}: ${VERD[a.verdict]}` : `${r.label} — ${r.A.name} ${AMT_A[state.na].label}, ${r.B.name} ${AMT_B[state.nb].label}`}</text>`;
        out += `<text class="note-text" x="20" y="196">질량은 반응 전 ${fmtG(a.before)} = 반응 후 (생성물 + 남은 것) ${fmtG(a.before)}. 원자는 없어지지 않습니다</text>`;
        out += `<text class="note-text" x="20" y="208">계수 비 ${r.A.f} : ${r.B.f} = ${r.A.coef} : ${r.B.coef} — 이 비율보다 많이 넣은 쪽이 남습니다</text>`;
        return out;
    }

    function graphReact(a) {
        const { r } = a, X0 = 150, X1 = 420, Y = 34, BH = 14, SC = (X1 - X0) / 5.4;
        let out = `<text class="axis-title" x="20" y="18">몰수로 본 반응 — 쓰인 양은 계수 비 ${r.A.coef} : ${r.B.coef}${eulNum(r.B.coef)} 따릅니다</text>`;
        const rows = [
            [`${r.A.name} 넣음`, a.nA, 'bar-a'], [`${r.A.name} 쓰임`, a.usedA, 'bar-a'], [`${r.A.name} 남음`, a.leftA, 'bar-a'],
            [`${r.B.name} 넣음`, a.nB, 'bar-b'], [`${r.B.name} 쓰임`, a.usedB, 'bar-b'], [`${r.B.name} 남음`, a.leftB, 'bar-b'],
            ...a.prods.map((pr, i) => [`${pr.name} 생김`, pr.n, i === 0 ? 'bar-c' : 'bar-d']),
        ];
        rows.forEach(([lab, n, cls], i) => {
            const y = Y + i * (BH + 4), w = n * SC;
            if (w > 0.5) out += `<rect class="${cls}" x="${X0}" y="${y}" width="${w.toFixed(1)}" height="${BH}" rx="2"/>`;
            out += `<text class="trait-text" x="${X0 - 6}" y="${y + BH / 2 + 4}" text-anchor="end">${lab}</text>`;
            out += `<text class="small-label" x="${(X0 + Math.max(w, 0) + 5).toFixed(1)}" y="${y + BH / 2 + 4}">${fmtMol(n)} mol${n > 0 ? ` (${fmtG(n * (lab.startsWith(r.A.name) ? r.A.M : lab.startsWith(r.B.name) ? r.B.M : a.prods.find(pr => lab.startsWith(pr.name)).M))})` : ''}</text>`;
        });
        [1, 2, 3, 4].forEach(n => { out += `<line class="grid-line" x1="${(X0 + n * SC).toFixed(1)}" y1="${Y - 6}" x2="${(X0 + n * SC).toFixed(1)}" y2="${Y + rows.length * (BH + 4)}"/><text class="axis-text" x="${(X0 + n * SC).toFixed(1)}" y="${Y + rows.length * (BH + 4) + 12}" text-anchor="middle">${n} mol</text>`; });
        return out;
    }

    function renderMolar(a) {
        const p = state.progress, { so, n, V1, V2, M1, M2, k } = a;
        const dil = clamp((p - 0.35) / 0.45, 0, 1), V = V1 + (V2 - V1) * ease(dil), M = n / V;
        const BX = 70, BW = 120, BB = 190, BT = 40, h = 146 * Math.sqrt(V / 4);
        let out = `<path class="beaker" d="M${BX},${BT} L${BX},${BB} L${BX + BW},${BB} L${BX + BW},${BT}"/>`;
        [0.25, 0.5, 1, 2, 4].forEach(L => { const y = BB - 146 * Math.sqrt(L / 4); out += `<line class="tick" x1="${BX + BW - 8}" y1="${y.toFixed(1)}" x2="${BX + BW}" y2="${y.toFixed(1)}"/><text class="small-label" x="${BX + BW + 4}" y="${(y + 3.5).toFixed(1)}">${fmtVolL(L)}</text>`; });
        const alpha = clamp(0.12 + M * 0.22, 0.12, 0.85);
        out += `<rect class="solution" fill="rgba(82,199,255,${alpha.toFixed(2)})" x="${BX + 1}" y="${(BB - h).toFixed(1)}" width="${BW - 2}" height="${h.toFixed(1)}"/>`;
        const cnt = Math.max(3, Math.round(n * 24));
        for (let i = 0; i < cnt; i += 1) { const px = BX + 8 + ((i * 53) % (BW - 16)), py = BB - 6 - ((i * 37) % Math.max(8, h - 12)); out += `<circle class="particle p-d" cx="${px}" cy="${py.toFixed(1)}" r="3"/>`; }
        if (k > 1 && dil > 0 && dil < 1) out += `<rect class="water-in" x="${BX + BW / 2 - 4}" y="${BT - 14}" width="8" height="${(BB - h - BT + 10).toFixed(1)}" rx="3"/><text class="small-label" style="fill:#0284c7" x="${BX + BW / 2 + 10}" y="${BT - 4}">물 붓는 중</text>`;
                // readouts
        const RX = 238;
        out += `<text class="trait-text" x="${RX}" y="48">용질 ${so.label} ${fmtMol(n)} mol = ${fmtG(a.g)}</text>`;
        out += `<text class="trait-text" x="${RX}" y="66">용액 ${fmtVolL(V1)} → 몰 농도 = ${fmtMol(n)} ÷ ${fmtN(V1, 2)} = ${fmtN(M1, 2)} M</text>`;
        if (k > 1) {
            out += `<text class="trait-text" style="fill:#0284c7" x="${RX}" y="90">물을 더해 ${fmtVolL(V2)} (${k}배)로 묽힘</text>`;
            out += `<text class="trait-text" style="fill:#d97706" x="${RX}" y="108">용질은 그대로 ${fmtMol(n)} mol → ${fmtN(M2, 2)} M</text>`;
            out += `<text class="small-label" x="${RX}" y="124">M₁V₁ = M₂V₂: ${fmtN(M1, 2)} × ${fmtN(V1, 2)} = ${fmtN(M2, 2)} × ${fmtN(V2, 2)}</text>`;
        } else out += `<text class="trait-text" style="fill:#d97706" x="${RX}" y="90">묽히지 않음 → ${fmtN(M2, 2)} M</text>`;
        out += `<text class="trait-text" x="${RX}" y="148">지금 부피 ${fmtVolL(V)} · 농도 ${fmtN(M, 2)} M</text>`;
        out += `<text class="small-label" x="${RX}" y="162">노란 점(용질) 수는 그대로, 부피만 늘어 옅어집니다</text>`;
        const VERD = { low: '0.5 M 아래', mid: '0.5~1.5 M', high: '1.5 M 넘게' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${state.progress >= 1 ? `${so.short} ${fmtMol(n)} mol · ${fmtVolL(V1)}${k > 1 ? ` → ${fmtVolL(V2)}` : ''}: ${fmtN(M2, 2)} M — ${VERD[a.verdict]}` : `${so.short} ${fmtMol(n)} mol · ${fmtVolL(V1)} · ${DILS[state.dil].label}`}</text>`;
        out += `<text class="note-text" x="20" y="208">몰 농도(M) = 용질 몰수 ÷ 용액 부피(L). 묽혀도 용질의 몰수는 변하지 않습니다</text>`;
        return out;
    }

    function graphMolar(a) {
        const X0 = 120, X1 = 420, Y = 44, BH = 22, SC = (X1 - X0) / 6.4;
        let out = `<text class="axis-title" x="20" y="18">몰 농도 — 붉은 점선이 예상 보기의 경계(0.5 M, 1.5 M)</text>`;
        [0, 1, 2, 3, 4].forEach(m => { out += `<line class="grid-line" x1="${(X0 + m * SC).toFixed(1)}" y1="${Y - 8}" x2="${(X0 + m * SC).toFixed(1)}" y2="${Y + 2 * (BH + 10)}"/><text class="axis-text" x="${(X0 + m * SC).toFixed(1)}" y="${Y + 2 * (BH + 10) + 14}" text-anchor="middle">${m} M</text>`; });
        [0.5, 1.5].forEach(m => { out += `<line class="ref-line" style="stroke:#dc2626" x1="${(X0 + m * SC).toFixed(1)}" y1="${Y - 8}" x2="${(X0 + m * SC).toFixed(1)}" y2="${Y + 2 * (BH + 10)}"/>`; });
        [['처음 농도', a.M1, 'bar-a'], ['묽힌 뒤 농도', a.M2, 'bar-c']].forEach(([lab, m, cls], i) => {
            const y = Y + i * (BH + 10), w = m * SC;
            out += `<rect class="${cls}" x="${X0}" y="${y}" width="${w.toFixed(1)}" height="${BH}" rx="3"/>`;
            if (i === 1) out += `<rect class="bar-now" x="${X0}" y="${y}" width="${w.toFixed(1)}" height="${BH}" rx="3"/>`;
            out += `<text class="trait-text" x="${X0 - 6}" y="${y + BH / 2 + 4}" text-anchor="end">${lab}</text>`;
            out += `<text class="trait-text" x="${(X0 + w + 6).toFixed(1)}" y="${y + BH / 2 + 4}">${fmtN(m, 2)} M (${fmtMol(a.n)} mol ÷ ${fmtN(i ? a.V2 : a.V1, 2)} L)</text>`;
        });
        out += `<text class="small-label" x="20" y="${Y + 2 * (BH + 10) + 34}">${a.k > 1 ? `부피를 ${a.k}배로 하면 농도는 ${a.k}분의 1 — 용질 몰수 ${fmtMol(a.n)} mol은 그대로입니다.` : '묽히지 않으면 처음 농도 그대로입니다.'}</text>`;
        out += `<text class="small-label" x="20" y="${Y + 2 * (BH + 10) + 48}">같은 ${fmtMol(a.n)} mol이라도 ${fmtVolL(a.V1)}에 녹이면 ${fmtN(a.M1, 2)} M, 1 L에 녹이면 ${fmtN(a.n, 2)} M입니다.</text>`;
        return out;
    }

    function noteFor(a) {
        if (a.kind === 'count') {
            return `<div class="data-row"><span class="data-name">물질</span><span class="data-val">${a.sub.label} ${a.sub.formula} — 화학식량 ${fmtN(a.sub.M, 2)} → 몰 질량 ${fmtN(a.sub.M, 2)} g/mol</span></div>` +
                `<div class="data-row"><span class="data-name">몰수</span><span class="data-val">${fmtG(a.g)} ÷ ${fmtN(a.sub.M, 2)} g/mol = ${fmtMol(a.n)} mol</span></div>` +
                `<div class="data-row"><span class="data-name">입자 수</span><span class="data-val">${fmtMol(a.n)} × 6.022×10²³ = ${fmtSci(a.N)}개의 ${a.sub.per}</span></div>` +
                `<div class="data-row match"><span class="data-name">${a.V !== null ? '기체 부피' : '판정'}</span><span class="data-val">${a.V !== null ? `0 ℃ 1기압에서 ${fmtMol(a.n)} × 22.4 L = ${a.V >= 1000 ? `${fmtN(a.V / 1000, 2)} m³` : `${fmtN(a.V, 1)} L`}` : a.verdict === 'less' ? '1몰보다 적음' : a.verdict === 'one' ? '거의 1몰' : '1몰보다 많음'}</span></div>`;
        }
        if (a.kind === 'react') {
            const { r } = a;
            return `<div class="data-row"><span class="data-name">넣은 양</span><span class="data-val">${r.A.f} ${fmtMol(a.nA)} mol (${fmtG(a.nA * r.A.M)}) · ${r.B.f} ${fmtMol(a.nB)} mol (${fmtG(a.nB * r.B.M)})</span></div>` +
                `<div class="data-row"><span class="data-name">계수로 나누면</span><span class="data-val">${r.A.f}: ${fmtMol(a.nA)} ÷ ${r.A.coef} = ${fmtMol(a.nA / r.A.coef)} · ${r.B.f}: ${fmtMol(a.nB)} ÷ ${r.B.coef} = ${fmtMol(a.nB / r.B.coef)} → ${a.limiting ? `작은 쪽 ${a.limiting === 'A' ? r.A.name : r.B.name}${iga(a.limiting === 'A' ? r.A.name : r.B.name)} 한계 반응물` : '같음 — 둘 다 다 쓰임'}</span></div>` +
                `<div class="data-row"><span class="data-name">생성물</span><span class="data-val">${a.prods.map(pr => `${pr.f} ${fmtMol(pr.n)} mol (${fmtG(pr.g)})`).join(' · ')}</span></div>` +
                `<div class="data-row match"><span class="data-name">남는 것</span><span class="data-val">${a.leftA > 1e-9 ? `${r.A.f} ${fmtMol(a.leftA)} mol (${fmtG(a.leftA * r.A.M)})` : a.leftB > 1e-9 ? `${r.B.f} ${fmtMol(a.leftB)} mol (${fmtG(a.leftB * r.B.M)})` : '없음'} · 질량 ${fmtG(a.before)} → ${fmtG(a.before)} (같음)</span></div>`;
        }
        return `<div class="data-row"><span class="data-name">용질</span><span class="data-val">${a.so.label} ${fmtMol(a.n)} mol × ${fmtN(a.so.M, 2)} g/mol = ${fmtG(a.g)}</span></div>` +
            `<div class="data-row"><span class="data-name">처음 농도</span><span class="data-val">${fmtMol(a.n)} mol ÷ ${fmtN(a.V1, 2)} L = ${fmtN(a.M1, 2)} M</span></div>` +
            `<div class="data-row"><span class="data-name">묽힌 뒤</span><span class="data-val">${a.k > 1 ? `부피 ${fmtVolL(a.V2)} · ${fmtN(a.M1, 2)} × ${fmtN(a.V1, 2)} = M₂ × ${fmtN(a.V2, 2)} → M₂ = ${fmtN(a.M2, 2)} M` : '묽히지 않음'}</span></div>` +
            `<div class="data-row match"><span class="data-name">판정</span><span class="data-val">${fmtN(a.M2, 2)} M — ${a.verdict === 'low' ? '0.5 M 아래' : a.verdict === 'mid' ? '0.5~1.5 M' : '1.5 M 넘게'}</span></div>`;
    }

    function render() {
        const a = analyse();
        mainGroup.innerHTML = a.kind === 'count' ? renderCount(a) : a.kind === 'react' ? renderReact(a) : renderMolar(a);
        graphGroup.innerHTML = a.kind === 'count' ? graphCount(a) : a.kind === 'react' ? graphReact(a) : graphMolar(a);
        liftProse();
        stageBadge.textContent = a.kind === 'count' ? `${a.sub.label} · ${MASSES[state.mass].label}` : a.kind === 'react' ? `${a.r.label} · ${AMT_A[state.na].label} + ${AMT_B[state.nb].label}` : `${a.so.short} ${NSOL[state.nsol].label} · ${VOLS[state.vol].label} · ${DILS[state.dil].label}`;
        methodHint.textContent = a.kind === 'count' ? '1몰 = 6.02×10²³개, 그 질량이 몰 질량(g)입니다'
            : a.kind === 'react' ? '반응식의 계수가 몰수의 비입니다. 비율보다 많은 쪽이 남습니다'
                : '몰 농도 = 용질 몰수 ÷ 용액 부피(L). 묽혀도 몰수는 그대로입니다';
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
        if (a.kind === 'count') {
            const { sub, g, n } = a;
            labelA.textContent = '몰수'; valueA.textContent = `${fmtMol(n)} mol`;
            labelB.textContent = '입자 수'; valueB.textContent = `${fmtSci(a.N)}개`;
            s = `${sub.label} ${sub.formula}의 화학식량은 ${fmtN(sub.M, 2)}이므로 1몰의 질량은 ${fmtN(sub.M, 2)} g입니다. ${fmtG(g)}을 이 값으로 나누면 ${fmtMol(n)} mol이고, 1몰이 6.02×10²³개이므로 ${sub.per}는 ${fmtSci(a.N)}개입니다. `;
            s += a.verdict === 'one' ? `몰 질량과 비슷한 무게라 거의 1몰입니다. ` : a.verdict === 'less' ? `몰 질량보다 가벼워 1몰이 안 됩니다. 1몰이 되려면 ${fmtN(sub.M, 1)} g이 필요합니다. ` : `몰 질량의 ${fmtN(n, 1)}배 무게라 ${fmtMol(n)}몰입니다. `;
            if (a.V !== null) s += `기체는 종류와 상관없이 0 ℃ 1기압에서 1몰이 22.4 L이므로 이 산소는 ${a.V >= 1000 ? `${fmtN(a.V / 1000, 2)} m³` : `${fmtN(a.V, 1)} L`}를 차지합니다. `;
            else if (sub.kind === 'liquid') s += `물은 1 g이 1 mL이니 ${fmtN(g)} mL, 컵으로 ${fmtN(g / 180, 1)}잔쯤입니다. `;
            s += `저울로 무게를 재는 것이 곧 입자의 개수를 세는 것, 이것이 몰의 쓸모입니다.`;
        } else if (a.kind === 'react') {
            const { r } = a;
            labelA.textContent = '한계 반응물'; valueA.textContent = a.limiting ? (a.limiting === 'A' ? `${r.A.name} ${r.A.f}` : `${r.B.name} ${r.B.f}`) : '없음 (딱 맞음)';
            labelB.textContent = '남는 것'; valueB.textContent = a.leftA > 1e-9 ? `${r.A.f} ${fmtMol(a.leftA)} mol` : a.leftB > 1e-9 ? `${r.B.f} ${fmtMol(a.leftB)} mol` : '없음';
            s = `${r.eq}에서 계수 비는 ${r.A.f} : ${r.B.f} = ${r.A.coef} : ${r.B.coef}입니다. ${r.A.name} ${fmtMol(a.nA)} mol을 ${r.A.coef}로 나누면 ${fmtMol(a.nA / r.A.coef)}, ${r.B.name} ${fmtMol(a.nB)} mol을 ${r.B.coef}로 나누면 ${fmtMol(a.nB / r.B.coef)}이므로 `;
            if (a.verdict === 'exact') s += `두 값이 같아 둘 다 남김없이 쓰입니다. `;
            else { const lim = a.limiting === 'A' ? r.A : r.B, other = a.limiting === 'A' ? r.B : r.A, left = a.limiting === 'A' ? a.leftB : a.leftA; s += `값이 작은 ${lim.name}${iga(lim.name)} 먼저 바닥나는 한계 반응물입니다. ${lim.name}${iga(lim.name)} 다 쓰이는 동안 ${other.name}${eun(other.name)} ${fmtMol(a.limiting === 'A' ? a.usedB : a.usedA)} mol만 쓰이고 ${fmtMol(left)} mol(${fmtG(left * other.M)})이 남습니다. `; }
            s += `생성물은 한계 반응물이 정합니다: ${a.prods.map(pr => `${pr.name} ${fmtMol(pr.n)} mol(${fmtG(pr.g)})`).join(', ')}. 반응 전 질량 ${fmtG(a.before)}은 반응 후 생성물과 남은 것의 질량을 더한 값과 똑같으니, 원자는 하나도 사라지지 않았습니다.`;
        } else {
            const { so, n, V1, V2, M1, M2, k } = a;
            labelA.textContent = '처음 농도'; valueA.textContent = `${fmtN(M1, 2)} M`;
            labelB.textContent = k > 1 ? '묽힌 뒤 농도' : '최종 농도'; valueB.textContent = `${fmtN(M2, 2)} M`;
            s = `${so.label} ${fmtMol(n)} mol은 ${fmtG(a.g)}입니다. 이것을 물에 녹여 전체 ${fmtVolL(V1)}로 만들면 몰 농도는 ${fmtMol(n)} ÷ ${fmtN(V1, 2)} = ${fmtN(M1, 2)} M입니다. `;
            if (k > 1) s += `물을 더 부어 ${fmtVolL(V2)}로 만들면 용질은 여전히 ${fmtMol(n)} mol이므로 농도는 ${fmtMol(n)} ÷ ${fmtN(V2, 2)} = ${fmtN(M2, 2)} M, 곧 ${k}분의 1이 됩니다. M₁V₁ = M₂V₂(${fmtN(M1, 2)} × ${fmtN(V1, 2)} = ${fmtN(M2, 2)} × ${fmtN(V2, 2)})로 바로 셈할 수도 있습니다. `;
            else s += `묽히지 않았으니 농도는 그대로입니다. `;
            s += `몰 농도는 물의 양이 아니라 용액 전체의 부피가 기준이라, 용질을 넣은 뒤 눈금까지 물을 채워 맞춥니다.`;
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
        checkBtn.textContent = state.mode === 'count' ? '저울에 올리기' : state.mode === 'react' ? '반응시키기' : '만들고 묽히기';
        stageCaption.textContent = state.mode === 'count' ? '왼쪽 접시의 물질을 재고, 몰 질량으로 나누어 몰수와 입자 수를 셉니다. 기체면 0 ℃ 1기압에서의 부피도 나옵니다.'
            : state.mode === 'react' ? '왼쪽 두 상자가 반응물, 오른쪽이 생성물입니다. 점 하나가 0.25 mol이고, 남는 점은 그대로 상자에 남습니다.'
                : '비커에 용질(노란 점)을 녹여 눈금까지 채운 뒤, 물을 더 부으면 점 수는 그대로인데 부피만 늘어납니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { sub: 'water', mass: 'g100', rxn: 'h2o', na: 'a2', nb: 'b1', solute: 'nacl', nsol: 'n05', vol: 'v500', dil: 'none', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'count').click();
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

    window.__moleModel = {
        SUBS, MASSES, REACTIONS, AMT_A, AMT_B, SOLUTES, NSOL, VOLS, DILS, state,
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
