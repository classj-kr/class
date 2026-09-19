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
    const EN = { H: 2.20, C: 2.55, N: 3.04, O: 3.44, F: 3.98, Cl: 3.16, B: 2.04 };
    const ATOM = { H: { col: '#e5e7eb', r: 7 }, C: { col: '#9ca3af', r: 10 }, N: { col: '#60a5fa', r: 10 }, O: { col: '#ff7a59', r: 10 }, F: { col: '#4ade80', r: 9 }, Cl: { col: '#4ade80', r: 11 }, B: { col: '#f9a8d4', r: 10 } };
    const T = 1 / Math.sqrt(3), S52 = Math.sin(52.25 * Math.PI / 180), C52 = Math.cos(52.25 * Math.PI / 180);
    const TETRA = [[T, T, T], [T, -T, -T], [-T, T, -T], [-T, -T, T]];
    const PYR = [[0.943, -0.333, 0], [-0.471, -0.333, 0.816], [-0.471, -0.333, -0.816]];
    const BENT = [[S52, -C52, 0], [-S52, -C52, 0]];
    const LIN2 = [[1, 0, 0], [-1, 0, 0]];
    const TRIG = [[1, 0, 0], [-0.5, 0.866, 0], [-0.5, -0.866, 0]];
    // shapeKey: linear / trigonal / tetra / lone(비공유 전자쌍이 모양을 바꿈)
    const MOLS = {
        h2o: { formula: 'H₂O', name: '물', center: 'O', atoms: ['H', 'H'], dirs: BENT, lone: [[0, 0.55, 0.83], [0, 0.55, -0.83]], order: 1, angle: 104.5, shape: '굽은형', shapeKey: 'lone', bondPairs: 2, lonePairs: 2 },
        co2: { formula: 'CO₂', name: '이산화 탄소', center: 'C', atoms: ['O', 'O'], dirs: LIN2, lone: [], order: 2, angle: 180, shape: '직선형', shapeKey: 'linear', bondPairs: 2, lonePairs: 0 },
        nh3: { formula: 'NH₃', name: '암모니아', center: 'N', atoms: ['H', 'H', 'H'], dirs: PYR, lone: [[0, 1, 0]], order: 1, angle: 107, shape: '삼각뿔형', shapeKey: 'lone', bondPairs: 3, lonePairs: 1 },
        ch4: { formula: 'CH₄', name: '메테인', center: 'C', atoms: ['H', 'H', 'H', 'H'], dirs: TETRA, lone: [], order: 1, angle: 109.5, shape: '정사면체형', shapeKey: 'tetra', bondPairs: 4, lonePairs: 0 },
        bf3: { formula: 'BF₃', name: '삼플루오린화 붕소', center: 'B', atoms: ['F', 'F', 'F'], dirs: TRIG, lone: [], order: 1, angle: 120, shape: '평면 삼각형', shapeKey: 'trigonal', bondPairs: 3, lonePairs: 0 },
        hcl: { formula: 'HCl', name: '염화 수소', center: 'Cl', atoms: ['H'], dirs: [[-1, 0, 0]], lone: [], order: 1, angle: null, shape: '직선형 (두 원자)', shapeKey: 'linear', bondPairs: 1, lonePairs: 3, diatomic: true },
        ccl4: { formula: 'CCl₄', name: '사염화 탄소', center: 'C', atoms: ['Cl', 'Cl', 'Cl', 'Cl'], dirs: TETRA, lone: [], order: 1, angle: 109.5, shape: '정사면체형', shapeKey: 'tetra', bondPairs: 4, lonePairs: 0 },
        h2: { formula: 'H₂', name: '수소', center: 'H', atoms: ['H'], dirs: [[-1, 0, 0]], lone: [], order: 1, angle: null, shape: '직선형 (두 원자)', shapeKey: 'linear', bondPairs: 1, lonePairs: 0, diatomic: true },
    };
    const SHAPE_LIST = ['h2o', 'co2', 'nh3', 'ch4', 'bf3', 'hcl'];
    const POLAR_LIST = ['h2o', 'co2', 'nh3', 'ch4', 'bf3', 'hcl', 'ccl4', 'h2'];
    const SOLVENTS = { water: { label: '물', hint: '극성 용매', polar: true, cls: 'solvent-water' }, oil: { label: '기름 (헥세인)', hint: '무극성 용매', polar: false, cls: 'solvent-oil' } };
    const SOLUTES = {
        salt: { label: '소금', hint: '이온 결정', kind: '이온 결정', cls: 's-salt', water: 'mix', oil: 'no', sink: true },
        sugar: { label: '설탕', hint: '극성 분자', kind: '극성 분자 (OH가 8개)', cls: 's-sugar', water: 'mix', oil: 'no', sink: true },
        iodine: { label: '아이오딘', hint: '무극성 분자', kind: '무극성 분자 I₂', cls: 's-iodine', water: 'partly', oil: 'mix', sink: true, tint: { water: 'rgba(150,80,20,.22)', oil: 'rgba(124,58,237,.35)' } },
        wax: { label: '왁스', hint: '무극성 분자', kind: '무극성 분자 (긴 탄화수소)', cls: 's-wax', water: 'no', oil: 'mix', sink: false },
        ethanol: { label: '에탄올', hint: '극성+무극성', kind: '극성 OH와 무극성 탄소 사슬을 함께 가진 분자', cls: 's-ethanol', water: 'mix', oil: 'partly', sink: false },
    };
    const REASON = {
        water: { salt: '물 분자의 δ− 산소가 Na⁺를, δ+ 수소가 Cl⁻를 둘러싸 결정에서 이온을 하나씩 끌어냅니다', sugar: '설탕의 OH가 물 분자와 수소 결합을 하며 물 사이로 들어갑니다', iodine: '무극성 I₂는 물 분자끼리의 강한 끌림을 비집지 못해 조금만 녹고 대부분 바닥에 남습니다', wax: '무극성 왁스는 물 분자 사이에 낄 수 없어 밀려나 물 위에 층을 이룹니다', ethanol: '에탄올의 OH가 물과 수소 결합을 해 어떤 비율로도 섞입니다' },
        oil: { salt: '기름 분자는 무극성이라 이온을 둘러싸 끌어낼 힘이 없어 결정이 그대로 남습니다', sugar: '설탕의 극성 OH끼리의 끌림을 무극성 기름이 떼어 놓지 못해 녹지 않습니다', iodine: 'I₂와 기름 모두 무극성이라 약한 분산력으로 고르게 섞여 보랏빛 용액이 됩니다', wax: '둘 다 무극성 탄화수소라 서로 잘 섞입니다', ethanol: '무극성 탄소 사슬 덕에 조금은 섞이지만 극성 OH 때문에 온전히 섞이지는 않습니다' },
    };

    const state = { mode: 'shape', mol: 'h2o', pmol: 'h2o', solvent: 'water', solute: 'salt', progress: 0, prediction: null };
    let running = false, frameId = 0, lastStamp = 0;

    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const ease = p => p < 0.5 ? 2 * p * p : 1 - (1 - p) * (1 - p) * 2;
    const fmtN = (n, d = 0) => (+n.toFixed(d)).toLocaleString('ko-KR', { minimumFractionDigits: d, maximumFractionDigits: d }).replace('-', '−');
    const jong = ch => { const c = ch.charCodeAt(0); return c >= 0xac00 && c <= 0xd7a3 ? (c - 0xac00) % 28 : 0; };
    const lastK = w => (w.match(/[가-힣](?=[^가-힣]*$)/) || [''])[0];
    const iga = w => jong(lastK(w)) ? '이' : '가';
    const eun = w => jong(lastK(w)) ? '은' : '는';
    const eul = w => jong(lastK(w)) ? '을' : '를';
    // H₂O → 오, NH₃ → 삼, HCl → 엘: only ₃ and l end with a batchim among the formulas here
    const eunF = f => /[₃l]$/.test(f) ? '은' : '는';
    const ra = num => '013678'.includes(String(num).slice(-1)) ? '이라' : '라';

    /* ------------------------------------------------------------ models */
    function dipoles(m) {
        const bonds = m.atoms.map((a, i) => { const dEN = EN[a] - EN[m.center]; return { atom: a, dEN, v: m.dirs[i].map(c => c * dEN) }; });
        const net = [0, 1, 2].map(k => bonds.reduce((s, b) => s + b.v[k], 0));
        const mag = Math.hypot(...net);
        const bondPolar = bonds.some(b => Math.abs(b.dEN) > 0.05);
        return { bonds, net, mag, bondPolar, verdict: !bondPolar ? 'nonbond' : mag < 0.05 ? 'cancel' : 'polar' };
    }

    function analyse() {
        if (state.mode === 'shape') { const m = MOLS[state.mol]; return { kind: 'shape', m, verdict: m.shapeKey }; }
        if (state.mode === 'polar') { const m = MOLS[state.pmol]; return { kind: 'polar', m, ...dipoles(m) }; }
        const sv = SOLVENTS[state.solvent], su = SOLUTES[state.solute];
        return { kind: 'mix', sv, su, verdict: su[state.solvent], reason: REASON[state.solvent][state.solute] };
    }
    const runSeconds = () => state.mode === 'shape' ? 6 : 5;

    /* ---------------------------------------------------------- controls */
    function pickRow(legend, name, options, current, cols) {
        return `<fieldset class="pick-field"><legend>${legend}</legend>` +
            `<div class="pick-buttons cols${cols}" data-pick="${name}">` +
            options.map(o => `<button type="button" data-value="${o.value}" class="${o.value === String(current) ? 'selected' : ''}">` +
                `${o.label}${o.hint ? `<small>${o.hint}</small>` : ''}</button>`).join('') +
            `</div></fieldset>`;
    }
    const opts = table => Object.entries(table).map(([k, v]) => ({ value: k, label: v.label, hint: v.hint }));
    const molOpts = list => list.map(k => ({ value: k, label: MOLS[k].formula, hint: MOLS[k].name }));

    function buildControls() {
        if (state.mode === 'shape') controlArea.innerHTML = pickRow('분자', 'mol', molOpts(SHAPE_LIST), state.mol, 3);
        else if (state.mode === 'polar') controlArea.innerHTML = pickRow('분자', 'pmol', molOpts(POLAR_LIST), state.pmol, 4);
        else controlArea.innerHTML = pickRow('용매', 'solvent', opts(SOLVENTS), state.solvent, 2) + pickRow('넣는 것', 'solute', opts(SOLUTES), state.solute, 5);
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                buildPrediction();
                settingsChanged();
            }));
        });
    }

    const PRED_S = [{ value: 'linear', label: '직선형' }, { value: 'trigonal', label: '평면 삼각형' }, { value: 'tetra', label: '정사면체형' }, { value: 'lone', label: '삼각뿔형이나 굽은형 (비공유 전자쌍이 밀어냄)' }];
    const PRED_P = [{ value: 'polar', label: '극성 분자' }, { value: 'cancel', label: '무극성 — 결합은 극성이지만 상쇄' }, { value: 'nonbond', label: '무극성 — 결합부터 무극성' }];
    const PRED_M = [{ value: 'mix', label: '잘 녹아 섞임' }, { value: 'partly', label: '조금만 녹음' }, { value: 'no', label: '녹지 않고 따로 놂' }];

    function buildPrediction() {
        const list = state.mode === 'shape' ? PRED_S : state.mode === 'polar' ? PRED_P : PRED_M;
        predictionLegend.textContent = state.mode === 'shape' ? `${MOLS[state.mol].name} ${MOLS[state.mol].formula}의 모양은?`
            : state.mode === 'polar' ? `${MOLS[state.pmol].name} ${MOLS[state.pmol].formula}${eunF(MOLS[state.pmol].formula)} 극성 분자일까요?`
                : `${SOLVENTS[state.solvent].label}에 ${SOLUTES[state.solute].label}${eul(SOLUTES[state.solute].label)} 넣으면?`;
        predictionArea.className = `prediction-buttons ${list.length === 4 ? 'four' : 'three'}`;
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction;
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    // turn about the vertical axis by th, then tip the top toward the viewer a little
    function proj(v, th) {
        const [x, y, z] = v, c = Math.cos(th), s = Math.sin(th);
        const x1 = x * c + z * s, z1 = -x * s + z * c;
        const ct = Math.cos(-0.35), st = Math.sin(-0.35);
        return [x1, y * ct - z1 * st, y * st + z1 * ct];
    }
    const arrow = (x1, y1, x2, y2, cls, head, w = 3.5) => {
        const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
        const bx = x2 - ux * 6, by = y2 - uy * 6;
        return `<line class="${cls}" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}"/><polygon class="${head}" points="${x2.toFixed(1)},${y2.toFixed(1)} ${(bx - uy * w).toFixed(1)},${(by + ux * w).toFixed(1)} ${(bx + uy * w).toFixed(1)},${(by - ux * w).toFixed(1)}"/>`;
    };

    // draws a molecule centred at (CX, CY); returns markup plus the screen positions of its atoms
    function drawMolecule(m, th, CX, CY, S, withLone, dip) {
        const items = [];
        const centerP = [0, 0, 0];
        const atomPos = m.atoms.map((a, i) => { const p = proj(m.dirs[i], th); return { a, x: CX + p[0] * S, y: CY - p[1] * S, z: p[2], i }; });
        const lonePos = withLone ? m.lone.map(l => { const p = proj(l, th); return { x: CX + p[0] * S * 0.7, y: CY - p[1] * S * 0.7, z: p[2] }; }) : [];
        let out = '';
        // bonds first, lone pairs and atoms sorted back-to-front
        atomPos.forEach(ap => {
            out += `<line class="${m.order === 2 ? 'bond-double' : 'bond'}" x1="${CX}" y1="${CY}" x2="${ap.x.toFixed(1)}" y2="${ap.y.toFixed(1)}"/>`;
            if (m.order === 2) out += `<line class="bond-gap" x1="${CX}" y1="${CY}" x2="${ap.x.toFixed(1)}" y2="${ap.y.toFixed(1)}"/>`;
        });
        const drawables = [{ kind: 'atom', a: m.center, x: CX, y: CY, z: 0 }, ...atomPos.map(ap => ({ kind: 'atom', ...ap })), ...lonePos.map(lp => ({ kind: 'lone', ...lp }))].sort((p, q) => p.z - q.z);
        const covered = d => drawables.some(o => o.kind === 'atom' && o !== d && o.z > d.z && Math.hypot(o.x - d.x, o.y - d.y) < 24);
        drawables.forEach(d => {
            const sc = 1 + 0.22 * d.z;
            if (d.kind === 'lone') { out += `<ellipse class="lone-pair" cx="${d.x.toFixed(1)}" cy="${d.y.toFixed(1)}" rx="${(13 * sc).toFixed(1)}" ry="${(8 * sc).toFixed(1)}"/><circle fill="#a78bfa" cx="${(d.x - 3).toFixed(1)}" cy="${d.y.toFixed(1)}" r="1.6"/><circle fill="#a78bfa" cx="${(d.x + 3).toFixed(1)}" cy="${d.y.toFixed(1)}" r="1.6"/>`; return; }
            const at = ATOM[d.a];
            out += `<circle class="atom" fill="${at.col}" cx="${d.x.toFixed(1)}" cy="${d.y.toFixed(1)}" r="${(at.r * sc).toFixed(1)}"/>${d.a !== 'H' && !covered(d) ? `<text class="atom-text" x="${d.x.toFixed(1)}" y="${(d.y + 3.5).toFixed(1)}" text-anchor="middle">${d.a}</text>` : ''}`;
        });
        if (dip) {
            dip.bonds.forEach((b, i) => {
                if (Math.abs(b.dEN) < 0.05) return;
                const ap = atomPos[i], L = Math.min(0.85, Math.abs(b.dEN) * 0.5);
                const fromC = b.dEN > 0;   // the outer atom pulls harder: the arrow points outward
                const x1 = fromC ? CX + (ap.x - CX) * 0.15 : ap.x - (ap.x - CX) * 0.15, y1 = fromC ? CY + (ap.y - CY) * 0.15 : ap.y - (ap.y - CY) * 0.15;
                const x2 = fromC ? CX + (ap.x - CX) * (0.15 + L) : ap.x - (ap.x - CX) * (0.15 + L), y2 = fromC ? CY + (ap.y - CY) * (0.15 + L) : ap.y - (ap.y - CY) * (0.15 + L);
                out += arrow(x1, y1, x2, y2, 'dipole', 'dipole-head', 3);
                const bl = Math.hypot(ap.x - CX, ap.y - CY), ux = (ap.x - CX) / (bl || 1), uy = (ap.y - CY) / (bl || 1), lx = ap.x + ux * (ATOM[ap.a].r + 10), ly = ap.y + uy * (ATOM[ap.a].r + 10);
                if (bl > 14 && ly < 168 && !atomPos.some((o, j) => j !== i && Math.hypot(o.x - lx, o.y - ly) < 13)) out += `<text class="small-label" style="fill:#d97706" x="${lx.toFixed(1)}" y="${(ly + 3).toFixed(1)}" text-anchor="middle">${fromC ? 'δ−' : 'δ+'}</text>`;
            });
            if (dip.mag > 0.05) { const n = proj(dip.net, th); const L = dip.mag * 34; out += arrow(CX, CY, CX + n[0] / dip.mag * L, CY - n[1] / dip.mag * L, 'net-dipole', 'net-head', 5); }
        }
        return { out, atomPos };
    }

    function renderShape(a) {
        const p = state.progress, { m } = a, th = p * Math.PI * 2, CX = 132, CY = 112, S = 74;
        const { out: mol, atomPos } = drawMolecule(m, th, CX, CY, S, true, null);
        let out = mol;
        if (m.angle !== null && atomPos.length >= 2) {
            const a1 = Math.atan2(atomPos[0].y - CY, atomPos[0].x - CX), a2 = Math.atan2(atomPos[1].y - CY, atomPos[1].x - CX);
            let d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
            const r = 24, big = Math.abs(d) > Math.PI ? 1 : 0, sweep = d > 0 ? 1 : 0;
            out += `<path class="angle-arc" d="M${(CX + r * Math.cos(a1)).toFixed(1)},${(CY + r * Math.sin(a1)).toFixed(1)} A${r},${r} 0 ${big} ${sweep} ${(CX + r * Math.cos(a2)).toFixed(1)},${(CY + r * Math.sin(a2)).toFixed(1)}"/>`;
            const am = a1 + d / 2, lx = CX + 44 * Math.cos(am), ly = CY + 44 * Math.sin(am);
            if (!atomPos.some(ap => Math.hypot(ap.x - lx, ap.y - ly) < 16)) out += `<text class="small-label" style="fill:#d97706" x="${lx.toFixed(1)}" y="${(ly + 3).toFixed(1)}" text-anchor="middle">${m.angle}°</text>`;
        }
        const RX = 250;
        out += `<text class="gen-text" x="${RX}" y="44">${m.name} ${m.formula}</text>`;
        if (m.diatomic) {
            out += `<text class="trait-text" x="${RX}" y="66">원자가 둘뿐이라 이을 점이 둘 — 언제나 직선</text>`;
            out += `<text class="trait-text" x="${RX}" y="82">${m.center} 둘레: 결합 1쌍 · 비공유 ${m.lonePairs}쌍</text>`;
        } else {
            out += `<text class="trait-text" x="${RX}" y="66">중심 원자 ${m.center} 둘레의 전자쌍</text>`;
            out += `<text class="trait-text" style="fill:#d6f5fa" x="${RX}" y="82">결합 전자쌍 ${m.bondPairs}${m.order === 2 ? ' (이중 결합도 하나로 셈)' : ''}</text>`;
            out += `<text class="trait-text" style="fill:#a78bfa" x="${RX}" y="98">비공유 전자쌍 ${m.lonePairs}</text>`;
            const total = m.bondPairs + m.lonePairs;
            out += `<text class="trait-text" style="fill:#d97706" x="${RX}" y="118">모두 ${total}쌍 → ${total === 2 ? '직선 배치 180°' : total === 3 ? '평면 삼각 배치 120°' : '정사면체 배치 109.5°'}</text>`;
            out += `<text class="trait-text" x="${RX}" y="136">${m.lonePairs ? `비공유 ${m.lonePairs}쌍이 더 밀어` : '모두 결합이라'} → ${m.shape} ${m.angle}°</text>`;
        }
        out += `<text class="small-label" x="${RX}" y="158">회색 C · 붉은 O · 파란 N · 흰 H · 초록 F/Cl · 분홍 B</text>`;
        out += `<text class="small-label" x="${RX}" y="172">보라 덩어리 = 비공유 전자쌍 (원자에는 안 보임)</text>`;
        const VERD = { linear: '직선형', trigonal: '평면 삼각형', tetra: '정사면체형', lone: `${m.shape} — 비공유 전자쌍이 밀어냄` };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${state.progress >= 1 ? `${m.formula}: ${VERD[a.verdict]}${m.angle !== null ? `, 결합각 ${m.angle}°` : ''}` : `${m.name} ${m.formula}`}</text>`;
        out += `<text class="note-text" x="20" y="208">전자쌍은 서로 밀어 가장 멀리 떨어진 자리를 잡습니다. 비공유 전자쌍은 더 넓게 퍼져 결합각을 조금 좁힙니다</text>`;
        return out;
    }

    function graphShape(a) {
        const X0 = 120, X1 = 420, Y = 40, BH = 18;
        const list = ['co2', 'bf3', 'ch4', 'nh3', 'h2o'];
        let out = `<text class="axis-title" x="20" y="18">결합각 견주기 — 전자쌍 수와 비공유 전자쌍 수가 각을 정합니다</text>`;
        [90, 120, 150, 180].forEach(d => { const x = X0 + (d - 90) / 90 * (X1 - 70 - X0); out += `<line class="grid-line" x1="${x.toFixed(1)}" y1="${Y - 8}" x2="${x.toFixed(1)}" y2="${Y + 5 * (BH + 6)}"/><text class="axis-text" x="${x.toFixed(1)}" y="${Y + 5 * (BH + 6) + 14}" text-anchor="middle">${d}°</text>`; });
        list.forEach((k, i) => {
            const m = MOLS[k], y = Y + i * (BH + 6), w = (m.angle - 90) / 90 * (X1 - 70 - X0);
            out += `<rect class="${m.lonePairs ? 'bar-c' : 'bar-a'}" style="opacity:${k === state.mol ? 1 : 0.5}" x="${X0}" y="${y}" width="${w.toFixed(1)}" height="${BH}" rx="3"/>`;
            if (k === state.mol) out += `<rect class="bar-now" x="${X0}" y="${y}" width="${w.toFixed(1)}" height="${BH}" rx="3"/>`;
            out += `<text class="trait-text" x="${X0 - 6}" y="${y + BH / 2 + 4}" text-anchor="end">${m.formula} ${m.shape}</text>`;
            out += `<text class="small-label" x="${(X0 + w + 6).toFixed(1)}" y="${y + BH / 2 + 4}">${m.angle}° · 전자쌍 ${m.bondPairs + m.lonePairs}${m.lonePairs ? ` (비공유 ${m.lonePairs})` : ''}</text>`;
        });
        out += `<text class="small-label" x="20" y="${Y + 5 * (BH + 6) + 32}">전자쌍 4개는 109.5°가 기준. 비공유 전자쌍이 하나면 107°, 둘이면 104.5°로 좁아집니다.</text>`;
        return out;
    }

    function renderPolar(a) {
        const p = state.progress, { m } = a, th = 0.6 + p * Math.PI, CX = 110, CY = 112, S = 50;
        const { out: mol } = drawMolecule(m, th, CX, CY, S, false, a);
        let out = mol;
        out += `<text class="small-label" x="110" y="188" text-anchor="middle">노란 화살표: 결합의 쌍극자 (δ+ → δ−) · 붉은 화살표: 합</text>`;
        // the field box
        const FX = 236, FY = 40, FW = 204, FH = 138, on = p > 0.5, align = ease(clamp((p - 0.5) / 0.4, 0, 1));
        out += `<rect class="field-box" x="${FX}" y="${FY}" width="${FW}" height="${FH}" rx="8"/>`;
        out += `<rect fill="rgba(255,122,89,.5)" x="${FX + 6}" y="${FY + 8}" width="6" height="${FH - 16}"/><rect fill="rgba(82,199,255,.5)" x="${FX + FW - 12}" y="${FY + 8}" width="6" height="${FH - 16}"/>`;
        out += `<text class="charge-text" style="fill:#dc2626;font-size:13.5px;font-weight:900" x="${FX + 9}" y="${FY - 4}" text-anchor="middle">+</text><text style="fill:#0284c7;font-size:13.5px;font-weight:900" x="${FX + FW - 9}" y="${FY - 4}" text-anchor="middle">−</text>`;
        if (on) for (let k = 0; k < 4; k += 1) { const y = FY + 26 + k * 34; out += arrow(FX + 16, y, FX + FW - 18, y, 'field-line', 'field-arrow', 2.5); }
        const polar = a.verdict === 'polar';
        for (let k = 0; k < 8; k += 1) {
            const gx = FX + 36 + (k % 4) * 44, gy = FY + 38 + Math.floor(k / 4) * 62, seed = ((k * 137) % 360) - 180;
            const ang = polar ? seed * (1 - align) : seed;
            out += `<g transform="rotate(${ang.toFixed(1)} ${gx} ${gy})"><ellipse class="mol-glyph${polar ? '' : ' nonpolar'}" cx="${gx}" cy="${gy}" rx="15" ry="8"/>${polar ? `<text class="glyph-text" style="fill:#dc2626" x="${gx - 10}" y="${gy + 3}" text-anchor="middle">δ−</text><text class="glyph-text" style="fill:#0284c7" x="${gx + 10}" y="${gy + 3}" text-anchor="middle">δ+</text>` : ''}</g>`;
        }
        out += `<text class="small-label" x="${FX + FW / 2}" y="${FY + FH + 14}" text-anchor="middle">${on ? (polar ? '전기장 켬 — 극성 분자가 줄지어 섬' : '전기장 켬 — 무극성이라 제멋대로 놓임') : '전기장 끔 — 제멋대로 놓인 분자들'}</text>`;
        const VERD = { polar: '극성 분자 — 쌍극자가 남음', cancel: '무극성 분자 — 결합은 극성이지만 상쇄됨', nonbond: '무극성 분자 — 결합부터 무극성' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${state.progress >= 1 ? `${m.formula}: ${VERD[a.verdict]}` : `${m.name} ${m.formula}`}</text>`;
        out += `<text class="note-text" x="20" y="208">전기 음성도: H 2.2 · B 2.0 · C 2.6 · N 3.0 · O 3.4 · F 4.0 · Cl 3.2 — 차이가 클수록 결합이 극성</text>`;
        return out;
    }

    function graphPolar(a) {
        const { m } = a, X0 = 150, X1 = 420, Y = 40, BH = 20, SC = (X1 - X0) / 2.6;
        const uniq = [];
        a.bonds.forEach(b => { if (!uniq.some(u => u.atom === b.atom)) uniq.push(b); });
        let out = `<text class="axis-title" x="20" y="18">결합의 극성(전기 음성도 차)과 분자 전체의 쌍극자 (화살표를 더한 크기)</text>`;
        [0, 0.5, 1, 1.5, 2].forEach(v => { const x = X0 + v * SC; out += `<line class="grid-line" x1="${x.toFixed(1)}" y1="${Y - 8}" x2="${x.toFixed(1)}" y2="${Y + (uniq.length + 1) * (BH + 8)}"/><text class="axis-text" x="${x.toFixed(1)}" y="${Y + (uniq.length + 1) * (BH + 8) + 14}" text-anchor="middle">${v}</text>`; });
        const rows = [...uniq.map(b => [`${m.center}${m.order === 2 ? '=' : '–'}${b.atom} 결합`, Math.abs(b.dEN), 'bar-c', `${Math.abs(b.dEN).toFixed(2)} (${b.dEN > 0 ? `${b.atom} 쪽이 δ−` : b.dEN < 0 ? `${m.center} 쪽이 δ−` : '차이 없음'})`]), ['분자 전체', a.mag, a.mag > 0.05 ? 'bar-b' : 'bar-a', a.mag > 0.05 ? `${a.mag.toFixed(2)} — 남음 → 극성` : '0 — 상쇄 → 무극성']];
        rows.forEach(([lab, v, cls, txt], i) => {
            const y = Y + i * (BH + 8), w = v * SC;
            if (w > 0.5) out += `<rect class="${cls}" x="${X0}" y="${y}" width="${w.toFixed(1)}" height="${BH}" rx="3"/>`;
            out += `<text class="trait-text" x="${X0 - 6}" y="${y + BH / 2 + 4}" text-anchor="end">${lab}</text><text class="small-label" x="${(X0 + Math.max(w, 0) + 6).toFixed(1)}" y="${y + BH / 2 + 4}">${txt}</text>`;
        });
        out += `<text class="small-label" x="20" y="${Y + (uniq.length + 1) * (BH + 8) + 32}">${m.diatomic ? '두 원자 분자는 결합의 극성이 곧 분자의 극성입니다.' : `${m.shape}${m.lonePairs && a.mag > 0.05 ? ' — 비공유 전자쌍 쪽으로 화살표가 몰려 남습니다.' : a.mag > 0.05 ? '' : ' — 대칭이라 화살표가 서로 지웁니다.'}`}</text>`;
        return out;
    }

    function renderMix(a) {
        const p = state.progress, { sv, su } = a, BX = 60, BW = 130, BT = 40, BB = 190, LT = 72;
        let out = `<path class="beaker" d="M${BX},${BT} L${BX},${BB} L${BX + BW},${BB} L${BX + BW},${BT}"/>`;
        const spread = a.verdict === 'mix' ? 1 : a.verdict === 'partly' ? 0.3 : 0;
        const tintA = su.tint && spread ? spread * ease(clamp((p - 0.3) / 0.6, 0, 1)) : 0;
        out += `<rect class="${sv.cls}" x="${BX + 1}" y="${LT}" width="${BW - 2}" height="${BB - LT - 1}"/>`;
        if (tintA > 0) out += `<rect fill="${su.tint[state.solvent]}" opacity="${tintA.toFixed(2)}" x="${BX + 1}" y="${LT}" width="${BW - 2}" height="${BB - LT - 1}"/>`;
        // solute grains: drop in, then settle or spread
        const drop = ease(clamp(p / 0.3, 0, 1)), mixT = ease(clamp((p - 0.3) / 0.6, 0, 1));
        const N = 18;
        for (let i = 0; i < N; i += 1) {
            const sx = BX + 55 + ((i * 7) % 20), sy = BT - 10 + ((i * 5) % 12);
            const restX = su.sink ? BX + 40 + ((i * 29) % 50) : BX + 8 + ((i * 31) % (BW - 16)), restY = su.sink ? BB - 6 - ((i * 13) % 14) : LT + 4 + ((i * 7) % 8);
            const spX = BX + 8 + ((i * 53) % (BW - 16)), spY = LT + 8 + ((i * 37) % (BB - LT - 16));
            const disperse = i < Math.round(N * spread) ? mixT : 0;
            const x = sx + (restX - sx) * drop + (spX - restX) * disperse, y = sy + (restY - sy) * drop + (spY - restY) * disperse;
            const r = 3.4 - 1.4 * disperse;
            out += `<circle class="solute ${su.cls}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" opacity="${(1 - 0.35 * disperse).toFixed(2)}"/>`;
        }
        out += `<text class="small-label" x="${BX + BW / 2}" y="32" text-anchor="middle">${sv.label} + ${su.label}</text>`;
        // right: the two kinds of molecule and the reason
        const RX = 236;
        out += `<text class="trait-text" x="${RX}" y="48">용매 ${sv.label} — ${sv.polar ? '극성 분자 (δ+/δ− 있음)' : '무극성 분자'}</text>`;
        const G1 = RX + 8;
        out += sv.polar ? `<ellipse class="mol-glyph" cx="${G1 + 16}" cy="68" rx="15" ry="8"/><text class="glyph-text" style="fill:#dc2626" x="${G1 + 6}" y="71" text-anchor="middle">δ−</text><text class="glyph-text" style="fill:#0284c7" x="${G1 + 26}" y="71" text-anchor="middle">δ+</text>` : `<rect class="mol-glyph nonpolar" x="${G1}" y="62" width="44" height="12" rx="6"/>`;
        out += `<text class="trait-text" x="${RX}" y="96">넣는 것 ${su.label} — ${su.hint}</text>`;
        out += state.solute === 'salt' ? `<circle class="solute s-salt" cx="${G1 + 8}" cy="112" r="7"/><text class="glyph-text" x="${G1 + 8}" y="115" text-anchor="middle">+</text><circle class="solute" fill="#4ade80" stroke="#166534" cx="${G1 + 26}" cy="112" r="8"/><text class="glyph-text" x="${G1 + 26}" y="115" text-anchor="middle">−</text>` : state.solute === 'sugar' || state.solute === 'ethanol' ? `<ellipse class="mol-glyph" cx="${G1 + 16}" cy="112" rx="15" ry="8"/><text class="glyph-text" style="fill:#dc2626" x="${G1 + 6}" y="115" text-anchor="middle">δ−</text><text class="glyph-text" style="fill:#0284c7" x="${G1 + 26}" y="115" text-anchor="middle">δ+</text>${state.solute === 'ethanol' ? `<rect class="mol-glyph nonpolar" x="${G1 + 32}" y="106" width="30" height="12" rx="6"/>` : ''}` : `<rect class="mol-glyph nonpolar" x="${G1}" y="106" width="44" height="12" rx="6"/>`;
        const words = a.reason.split(' '); const lines = []; let cur = '';
        words.forEach(w => { if ((cur + ' ' + w).length > 26) { lines.push(cur); cur = w; } else cur = cur ? `${cur} ${w}` : w; }); lines.push(cur);
        lines.slice(0, 4).forEach((ln, i) => { out += `<text class="small-label" style="fill:#d6f5fa" x="${RX}" y="${138 + i * 13}">${ln}</text>`; });
        const VERD = { mix: '잘 녹아 섞임', partly: '조금만 녹음', no: '녹지 않고 따로 놂' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${state.progress >= 1 ? `${sv.label} + ${su.label}: ${VERD[a.verdict]}` : `${sv.label}에 ${su.label} 넣기`}</text>`;
        out += `<text class="note-text" x="20" y="208">비슷한 것끼리 녹습니다 — 극성은 극성끼리, 무극성은 무극성끼리. 이온은 극성 용매에</text>`;
        return out;
    }

    function graphMix(a) {
        const X = 150, Y = 46, W = 56, H = 30;
        let out = `<text class="axis-title" x="20" y="18">녹는 짝 한눈에 — ○ 잘 녹음 · △ 조금 · ✕ 안 녹음</text>`;
        Object.entries(SOLUTES).forEach(([k, su], i) => { out += `<text class="chart-text" x="${X + i * W + W / 2}" y="${Y - 8}" text-anchor="middle">${su.label}</text>`; });
        Object.entries(SOLVENTS).forEach(([sk, sv], j) => {
            out += `<text class="chart-text" x="${X - 8}" y="${Y + j * H + H / 2 + 4}" text-anchor="end">${sv.label}</text>`;
            Object.entries(SOLUTES).forEach(([k, su], i) => {
                const v = su[sk];
                out += `<rect class="chart-cell ${v === 'mix' ? 'chart-ok' : v === 'partly' ? 'chart-part' : 'chart-bad'}" x="${X + i * W}" y="${Y + j * H}" width="${W}" height="${H}"/>`;
                out += `<text class="chart-text" style="fill:${v === 'mix' ? '#059669' : v === 'partly' ? '#d97706' : '#dc2626'}" x="${X + i * W + W / 2}" y="${Y + j * H + H / 2 + 4}" text-anchor="middle">${v === 'mix' ? '○' : v === 'partly' ? '△' : '✕'}</text>`;
            });
        });
        const i = Object.keys(SOLUTES).indexOf(state.solute), j = Object.keys(SOLVENTS).indexOf(state.solvent);
        out += `<rect class="chart-now" x="${X + i * W}" y="${Y + j * H}" width="${W}" height="${H}" rx="3"/>`;
        out += `<text class="trait-text" x="20" y="${Y + 2 * H + 26}">극성 용매(물)는 이온과 극성 분자를, 무극성 용매(기름)는 무극성 분자를 녹입니다.</text>`;
        out += `<text class="trait-text" x="20" y="${Y + 2 * H + 42}">에탄올처럼 두 성질을 다 가진 분자는 양쪽에 걸쳐 섞이고, 세제가 기름때를 물에 씻어 내는 원리도 같습니다.</text>`;
        return out;
    }

    function noteFor(a) {
        if (a.kind === 'shape') {
            const { m } = a;
            return `<div class="data-row"><span class="data-name">분자</span><span class="data-val">${m.name} ${m.formula} — 중심 원자 ${m.diatomic ? '없음(두 원자)' : m.center}</span></div>` +
                `<div class="data-row"><span class="data-name">전자쌍</span><span class="data-val">결합 영역 ${m.bondPairs}개 · 비공유 전자쌍 ${m.lonePairs}쌍${m.order === 2 ? ' (이중 결합도 한 영역)' : ''}</span></div>` +
                `<div class="data-row"><span class="data-name">배치</span><span class="data-val">${m.diatomic ? '두 점은 언제나 한 직선' : `${m.bondPairs + m.lonePairs}쌍 → ${m.bondPairs + m.lonePairs === 2 ? '직선' : m.bondPairs + m.lonePairs === 3 ? '평면 삼각' : '정사면체'} 배치`}</span></div>` +
                `<div class="data-row match"><span class="data-name">모양·결합각</span><span class="data-val">${m.shape}${m.angle !== null ? ` · ${m.angle}°` : ''}</span></div>`;
        }
        if (a.kind === 'polar') {
            const { m } = a;
            return `<div class="data-row"><span class="data-name">결합</span><span class="data-val">${a.bonds.filter((b, i, arr) => arr.findIndex(x => x.atom === b.atom) === i).map(b => `${m.center}–${b.atom}: 전기 음성도 차 ${Math.abs(b.dEN).toFixed(2)}${Math.abs(b.dEN) > 0.05 ? ` (${b.dEN > 0 ? b.atom : m.center} 쪽이 δ−)` : ' (무극성 결합)'}`).join(' · ')}</span></div>` +
                `<div class="data-row"><span class="data-name">모양</span><span class="data-val">${m.shape}${m.lonePairs && !m.diatomic ? ` · 비공유 전자쌍 ${m.lonePairs}` : ''}</span></div>` +
                `<div class="data-row"><span class="data-name">쌍극자 합</span><span class="data-val">${a.mag > 0.05 ? `${a.mag.toFixed(2)} (상대값) — 남음` : '0 — 상쇄'}</span></div>` +
                `<div class="data-row match"><span class="data-name">판정</span><span class="data-val">${a.verdict === 'polar' ? '극성 분자' : a.verdict === 'cancel' ? '무극성 분자 (결합은 극성, 대칭이라 상쇄)' : '무극성 분자 (결합부터 무극성)'}</span></div>`;
        }
        return `<div class="data-row"><span class="data-name">용매</span><span class="data-val">${a.sv.label} — ${a.sv.polar ? '극성' : '무극성'}</span></div>` +
            `<div class="data-row"><span class="data-name">넣는 것</span><span class="data-val">${a.su.label} — ${a.su.kind}</span></div>` +
            `<div class="data-row"><span class="data-name">까닭</span><span class="data-val">${a.reason}</span></div>` +
            `<div class="data-row match"><span class="data-name">결과</span><span class="data-val">${a.verdict === 'mix' ? '잘 녹아 섞임' : a.verdict === 'partly' ? '조금만 녹음' : '녹지 않고 따로 놂'}</span></div>`;
    }

    function render() {
        const a = analyse();
        mainGroup.innerHTML = a.kind === 'shape' ? renderShape(a) : a.kind === 'polar' ? renderPolar(a) : renderMix(a);
        graphGroup.innerHTML = a.kind === 'shape' ? graphShape(a) : a.kind === 'polar' ? graphPolar(a) : graphMix(a);
        liftProse();
        stageBadge.textContent = a.kind === 'mix' ? `${a.sv.label} + ${a.su.label}` : `${a.m.name} ${a.m.formula}`;
        methodHint.textContent = a.kind === 'shape' ? '중심 원자의 전자쌍들은 서로 밀어내며 가장 멀리 떨어진 자리를 잡습니다'
            : a.kind === 'polar' ? '결합의 쌍극자를 화살표로 더해 남으면 극성, 상쇄되면 무극성입니다'
                : '비슷한 것끼리 녹습니다 — 극성은 극성끼리, 무극성은 무극성끼리';
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
        if (a.kind === 'shape') {
            const { m } = a, total = m.bondPairs + m.lonePairs;
            labelA.textContent = '모양'; valueA.textContent = m.shape;
            labelB.textContent = '결합각'; valueB.textContent = m.angle !== null ? `${m.angle}°` : '없음 (두 원자)';
            if (m.diatomic) s = `${m.name} ${m.formula}${eunF(m.formula)} 원자가 둘뿐입니다. 두 점은 언제나 한 직선 위에 있으므로 모양은 직선형이고 결합각은 따로 없습니다. 전자쌍 반발은 중심 원자에 셋 이상의 전자쌍이 있을 때 모양을 정합니다.`;
            else {
                s = `${m.name} ${m.formula}의 중심 원자 ${m.center} 둘레에는 결합 영역 ${m.bondPairs}개${m.order === 2 ? '(이중 결합은 한 자리로 셉니다)' : ''}과 비공유 전자쌍 ${m.lonePairs}쌍, 모두 ${total}개의 전자 영역이 있습니다. 전자쌍은 서로 밀어내므로 ${total === 2 ? '정반대 방향으로 벌어져 직선(180°)' : total === 3 ? '평면에서 120°씩 벌어진 삼각형' : '정사면체 꼭짓점 방향(109.5°)'}으로 배치됩니다. `;
                s += m.lonePairs ? `그 가운데 ${m.lonePairs}자리를 비공유 전자쌍이 차지합니다. 비공유 전자쌍은 한 원자에만 붙어 있어 더 넓게 퍼지므로 결합 전자쌍을 조금 더 밀어내고, 원자만 보면 ${m.shape}이 되며 결합각은 ${m.angle}°로 109.5°보다 좁습니다.` : `모두 결합 전자쌍이라 원자들도 그 방향에 놓여 ${m.shape}, 결합각 ${m.angle}°입니다.`;
            }
        } else if (a.kind === 'polar') {
            const { m } = a;
            labelA.textContent = '판정'; valueA.textContent = a.verdict === 'polar' ? '극성 분자' : '무극성 분자';
            labelB.textContent = '쌍극자 합'; valueB.textContent = a.mag > 0.05 ? `${a.mag.toFixed(2)} (남음)` : '0 (상쇄)';
            const b0 = a.bonds[0];
            if (a.verdict === 'nonbond') s = `${m.formula}${eunF(m.formula)} 같은 원자끼리 결합해 전기 음성도 차이가 0입니다. 공유 전자쌍이 어느 쪽으로도 치우치지 않으니 결합부터 무극성이고, 분자도 무극성입니다. 전기장을 걸어도 돌아설 까닭이 없습니다.`;
            else if (a.verdict === 'cancel') s = `${m.center}–${b0.atom} 결합은 전기 음성도 차이가 ${Math.abs(b0.dEN).toFixed(2)}${ra(Math.abs(b0.dEN).toFixed(2))} ${b0.dEN > 0 ? b0.atom : m.center} 쪽이 δ−인 극성 결합입니다. 그러나 ${m.formula}${eunF(m.formula)} ${m.shape}으로 대칭이라 ${m.atoms.length}개의 쌍극자 화살표를 더하면 정확히 0이 됩니다. 결합은 극성이지만 분자는 무극성이고, 전기장 속에서도 제멋대로 놓여 있습니다.`;
            else s = m.diatomic ? `${m.formula}${eunF(m.formula)} 두 원자의 전기 음성도 차이가 ${Math.abs(b0.dEN).toFixed(2)}${ra(Math.abs(b0.dEN).toFixed(2))} ${b0.dEN > 0 ? b0.atom : m.center} 쪽이 δ−, 반대쪽이 δ+인 극성 결합이고, 원자가 둘뿐이라 이 결합의 극성이 곧 분자의 극성입니다. 전기장을 걸면 δ+가 − 극을 향하도록 줄지어 섭니다.`
                : `${m.center}–${b0.atom} 결합은 전기 음성도 차이 ${Math.abs(b0.dEN).toFixed(2)}의 극성 결합이고, ${m.formula}${eunF(m.formula)} 비공유 전자쌍 ${m.lonePairs}쌍 때문에 ${m.shape}으로 비대칭입니다. ${m.atoms.length}개의 쌍극자 화살표를 더하면 ${m.center} 쪽(비공유 전자쌍 쪽)으로 ${a.mag.toFixed(2)}(상대값)이 남아 극성 분자입니다. 전기장을 걸면 δ+ 쪽이 − 극을 향하도록 돌아 줄지어 섭니다. ${state.pmol === 'h2o' ? '전자레인지는 물 분자를 이렇게 흔들어 음식을 데웁니다.' : ''}`;
        } else {
            const { sv, su } = a;
            labelA.textContent = '결과'; valueA.textContent = a.verdict === 'mix' ? '잘 녹아 섞임' : a.verdict === 'partly' ? '조금만 녹음' : '녹지 않음';
            labelB.textContent = '용매 · 넣는 것'; valueB.textContent = `${sv.polar ? '극성' : '무극성'} · ${{ salt: '이온', sugar: '극성', iodine: '무극성', wax: '무극성', ethanol: '극성+무극성' }[state.solute]}`;
            s = `${sv.label}${eun(sv.label)} ${sv.polar ? '극성 분자라 서로 δ+와 δ−로 강하게 끌어당깁니다' : '무극성 분자라 서로 약한 분산력으로만 끌립니다'}. ${su.label}${eun(su.label)} ${su.kind}입니다. ${a.reason}. `;
            s += a.verdict === 'mix' ? `그래서 ${su.label}${iga(su.label)} ${sv.label} 사이로 고르게 퍼져 한 용액이 됩니다.` : a.verdict === 'partly' ? `그래서 아주 조금만 녹고 나머지는 ${su.sink ? '바닥에' : '위에'} 남습니다.` : `그래서 ${su.label}${eun(su.label)} ${su.sink ? '바닥에 그대로 남고' : '위에 층을 이루고'} ${sv.label}${eun(sv.label)} 맑은 채입니다. 비슷한 것끼리 녹는다는 규칙 그대로입니다.`;
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
        checkBtn.textContent = state.mode === 'shape' ? '분자 돌려 보기' : state.mode === 'polar' ? '전기장 걸기' : '넣고 저어 보기';
        stageCaption.textContent = state.mode === 'shape' ? '분자가 천천히 돌아갑니다. 보라색 덩어리가 비공유 전자쌍이고, 노란 호가 결합각입니다.'
            : state.mode === 'polar' ? '왼쪽은 결합마다의 쌍극자 화살표와 그 합, 오른쪽은 전기장 속의 분자들입니다. 극성 분자만 줄지어 섭니다.'
                : '비커에 넣은 것이 퍼지면 녹은 것이고, 바닥이나 위에 그대로 모여 있으면 안 녹은 것입니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { mol: 'h2o', pmol: 'h2o', solvent: 'water', solute: 'salt', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'shape').click();
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

    window.__shapeModel = {
        MOLS, SHAPE_LIST, POLAR_LIST, SOLVENTS, SOLUTES, state,
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
