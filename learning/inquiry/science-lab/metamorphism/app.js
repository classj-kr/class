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
    const P_PER_KM = 0.02744; // GPa per km for rock of 2,800 kg/m³
    const DEPTHS = { d5: { label: '5 km', hint: '얕게 묻힘', z: 5 }, d15: { label: '15 km', hint: '중간', z: 15 }, d30: { label: '30 km', hint: '깊이 묻힘', z: 30 } };
    const GRADS = { g10: { label: '낮음 10 ℃/km', hint: '섭입대', g: 10, col: '#0284c7' }, g25: { label: '보통 25 ℃/km', hint: '안정한 대륙', g: 25, col: '#d97706' }, g40: { label: '높음 40 ℃/km', hint: '화산호·열곡', g: 40, col: '#ff7a59' } };
    const TEMPS = { t200: { label: '200 ℃', hint: '낮은 변성', T: 200 }, t350: { label: '350 ℃', hint: '', T: 350 }, t550: { label: '550 ℃', hint: '', T: 550 }, t750: { label: '750 ℃', hint: '높은 변성', T: 750 } };
    const PARENTS = { shale: { label: '셰일', hint: '진흙이 굳은 암석' }, sandstone: { label: '사암', hint: '석영 모래' }, limestone: { label: '석회암', hint: '방해석' } };
    const BODIES = { dike: { label: '얇은 암맥', hint: '두께 10 m', L: 5 }, pluton: { label: '큰 저반', hint: '지름 5 km', L: 2500 } };
    const DISTS = { x1: { label: '1 m', hint: '바로 곁', x: 1 }, x100: { label: '100 m', hint: '', x: 100 }, x1k: { label: '1 km', hint: '', x: 1000 }, x5k: { label: '5 km', hint: '멀리', x: 5000 } };
    const T_MAGMA = 900, T_HOST = 100;

    const state = { mode: 'facies', depth: 'd15', grad: 'g25', temp: 't550', parent: 'shale', body: 'pluton', dist: 'x100', progress: 0, prediction: null };
    let running = false, frameId = 0, lastStamp = 0;

    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const ease = p => p < 0.5 ? 2 * p * p : 1 - (1 - p) * (1 - p) * 2;
    const fmtN = (n, d = 0) => (+n.toFixed(d)).toLocaleString('ko-KR', { minimumFractionDigits: d, maximumFractionDigits: d }).replace('-', '−');
    const rnd = i => (((i * 7919 + 13) * 104729) % 100003) / 100003;
    const jong = s => { const c = s.charCodeAt(s.length - 1); return c >= 0xac00 && c <= 0xd7a3 ? (c - 0xac00) % 28 : 0; };
    const eun = s => jong(s) ? '은' : '는', iga = s => jong(s) ? '이' : '가';

    /* ------------------------------------------------------------ models */
    // simplified facies boundaries (대략) on the T–P diagram
    function faciesOf(T, P) {
        if (T < 120) return { key: 'none', name: '미변성 (속성 작용)', rock: '아직 셰일' };
        if (T >= 900) return { key: 'melt', name: '부분 용융 (마그마)', rock: '미그마타이트·마그마' };
        if (P >= 1.2 && T >= 450) return { key: 'eclogite', name: '에클로자이트상', rock: '에클로자이트' };
        if (P >= 0.45 && T < 500) return { key: 'blueschist', name: '청색편암상', rock: '남섬석이 든 청색편암' };
        if (T >= 700) return { key: 'granulite', name: '백립암상', rock: '백립암·편마암' };
        if (T >= 450) return P < 0.2 ? { key: 'hornfels', name: '혼펠스상', rock: '혼펠스' } : { key: 'amphibolite', name: '각섬암상', rock: '석류석이 든 편암·편마암' };
        if (T >= 300) return P < 0.2 ? { key: 'hornfels', name: '혼펠스상', rock: '혼펠스' } : { key: 'greenschist', name: '녹색편암상', rock: '천매암·녹니석 편암' };
        return { key: 'zeolite', name: '제올라이트상', rock: '약하게 변한 점판암' };
    }
    function faciesModel() {
        const z = DEPTHS[state.depth].z, g = GRADS[state.grad].g, T = 20 + g * z, P = P_PER_KM * z, f = faciesOf(T, P);
        return { kind: 'facies', z, g, T, P, f, verdict: T < 400 ? 'low' : T < 650 ? 'mid' : 'high' };
    }
    const ROCKS = {
        shale: [[0, '셰일', '점토 광물', '층리만 있음'], [150, '점판암', '녹니석·견운모', '얇게 쪼개지는 벽개'], [300, '천매암', '흑운모 시작·녹니석', '비단 광택의 엽리'], [450, '편암', '석류석·십자석·흑운모', '굵은 판상 광물이 늘어선 엽리'], [650, '편마암', '규선석·석류석·장석', '밝고 어두운 띠 (편마 구조)']],
        sandstone: [[0, '사암', '석영 알갱이', '둥근 모래 알갱이'], [250, '규암', '석영 (재결정)', '맞물린 석영 결정, 엽리 없음'], [650, '굵은 규암', '석영 (굵게 재결정)', '더 굵게 맞물린 결정']],
        limestone: [[0, '석회암', '방해석 알갱이', '잔알갱이·화석'], [250, '대리암', '방해석 (재결정)', '맞물린 방해석 결정, 엽리 없음'], [650, '굵은 대리암', '방해석 (굵게 재결정)', '더 굵게 맞물린 결정']],
    };
    function rockAt(parent, T) { const list = ROCKS[parent]; let r = list[0]; list.forEach(row => { if (T >= row[0]) r = row; }); return { name: r[1], minerals: r[2], texture: r[3], stage: list.indexOf(r), stages: list.length }; }
    function gradeModel() {
        const T = TEMPS[state.temp].T, parent = state.parent, r = rockAt(parent, T);
        const verdict = T < 300 ? 'weak' : T < 650 ? 'strong' : 'high';
        return { kind: 'grade', T, parent, r, verdict };
    }
    // peak temperature beside an intrusion: half the contrast at the contact, fading with the intrusion's half-size (대략)
    const contactT = (x, L) => T_HOST + 0.5 * (T_MAGMA - T_HOST) * Math.exp(-x / L);
    function contactModel() {
        const b = BODIES[state.body], x = DISTS[state.dist].x, T = contactT(x, b.L);
        return { kind: 'contact', b, x, T, verdict: T >= 400 ? 'hornfels' : T >= 200 ? 'baked' : 'none' };
    }
    function analyse() {
        if (state.mode === 'facies') return faciesModel();
        if (state.mode === 'grade') return gradeModel();
        return contactModel();
    }
    const runSeconds = () => 6;

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
        if (state.mode === 'facies') controlArea.innerHTML = pickRow('묻히는 깊이', 'depth', opts(DEPTHS), state.depth, 3) + pickRow('지온 기울기', 'grad', opts(GRADS), state.grad, 3);
        else if (state.mode === 'grade') controlArea.innerHTML = pickRow('온도 (압력은 중간)', 'temp', opts(TEMPS), state.temp, 4) + pickRow('원암', 'parent', opts(PARENTS), state.parent, 3);
        else controlArea.innerHTML = pickRow('관입체', 'body', opts(BODIES), state.body, 2) + pickRow('관입체와의 거리', 'dist', opts(DISTS), state.dist, 4);
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                buildPrediction();
                settingsChanged();
            }));
        });
    }

    const PRED_F = [{ value: 'low', label: '낮은 변성 (400 ℃ 안)' }, { value: 'mid', label: '중간 변성 (400~650 ℃)' }, { value: 'high', label: '높은 변성 (650 ℃ 넘게)' }];
    const PRED_G = { shale: [{ value: 'weak', label: '점판암·천매암' }, { value: 'strong', label: '편암' }, { value: 'high', label: '편마암' }], sandstone: [{ value: 'weak', label: '사암 거의 그대로' }, { value: 'strong', label: '규암' }, { value: 'high', label: '굵은 규암' }], limestone: [{ value: 'weak', label: '석회암 거의 그대로' }, { value: 'strong', label: '대리암' }, { value: 'high', label: '굵은 대리암' }] };
    const PRED_C = [{ value: 'hornfels', label: '혼펠스로 구워짐' }, { value: 'baked', label: '약간 구워짐' }, { value: 'none', label: '변화 없음' }];

    function buildPrediction() {
        const list = state.mode === 'facies' ? PRED_F : state.mode === 'grade' ? PRED_G[state.parent] : PRED_C;
        predictionLegend.textContent = state.mode === 'facies' ? `${DEPTHS[state.depth].label} 깊이, 지온 기울기 ${GRADS[state.grad].label}이면 셰일의 변성도는?`
            : state.mode === 'grade' ? `${PARENTS[state.parent].label}${eul(PARENTS[state.parent].label)} ${TEMPS[state.temp].label}까지 데우면 어떤 암석이 될까요?`
                : `${BODIES[state.body].label}에서 ${DISTS[state.dist].label} 떨어진 셰일은?`;
        predictionArea.className = 'prediction-buttons three';
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction;
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }
    const eul = s => jong(s) ? '을' : '를';

    /* ----------------------------------------------------------- visuals */
    const tColor = T => { const u = clamp(T / 1000, 0, 1); return `rgb(${Math.round(60 + 195 * u)},${Math.round(90 + 60 * Math.sin(u * Math.PI))},${Math.round(200 - 170 * u)})`; };
    // rock texture drawn inside a box: foliation grows with grade, bands appear for gneiss, grains coarsen for quartzite/marble
    function texture(x0, y0, w, h, parent, T, melt) {
        let out = `<rect class="rock" x="${x0}" y="${y0}" width="${w}" height="${h}" rx="4"/>`;
        if (parent === 'shale') {
            const fol = clamp((T - 150) / 350, 0, 1), gneiss = clamp((T - 600) / 120, 0, 1), n = 46;
            if (gneiss > 0) for (let b = 0; b < 5; b += 1) out += `<rect class="${b % 2 ? 'band-dark' : 'band-light'}" opacity="${gneiss.toFixed(2)}" x="${x0 + 2}" y="${(y0 + 2 + b * (h - 4) / 5).toFixed(1)}" width="${w - 4}" height="${((h - 4) / 5).toFixed(1)}"/>`;
            for (let i = 0; i < n; i += 1) {
                const cx = x0 + 6 + rnd(i) * (w - 12), cy = y0 + 6 + rnd(i + 100) * (h - 12), ang = (rnd(i + 200) - 0.5) * Math.PI * (1 - fol), len = 4 + 5 * clamp((T - 100) / 500, 0, 1);
                out += `<line class="flake${T >= 300 && i % 3 === 0 ? ' mica' : ''}" x1="${(cx - len * Math.cos(ang)).toFixed(1)}" y1="${(cy - len * Math.sin(ang)).toFixed(1)}" x2="${(cx + len * Math.cos(ang)).toFixed(1)}" y2="${(cy + len * Math.sin(ang)).toFixed(1)}"/>`;
            }
            if (T >= 450) for (let i = 0; i < 5; i += 1) out += `<circle class="garnet" cx="${(x0 + 12 + rnd(i + 300) * (w - 24)).toFixed(1)}" cy="${(y0 + 10 + rnd(i + 400) * (h - 20)).toFixed(1)}" r="${(3 + 2 * clamp((T - 450) / 300, 0, 1)).toFixed(1)}"/>`;
        } else {
            const grow = clamp((T - 150) / 500, 0, 1), cols = Math.max(4, Math.round(12 - 6 * grow)), rows = Math.max(3, Math.round(8 - 4 * grow)), cw = (w - 8) / cols, ch = (h - 8) / rows;
            for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) {
                const cx = x0 + 4 + c * cw + cw / 2 + (rnd(r * 20 + c) - 0.5) * cw * 0.3, cy = y0 + 4 + r * ch + ch / 2 + (rnd(r * 20 + c + 50) - 0.5) * ch * 0.3, rad = Math.min(cw, ch) * (0.3 + 0.25 * grow);
                if (grow < 0.25) out += `<circle class="${parent === 'sandstone' ? 'grain' : 'calcite'}" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${rad.toFixed(1)}"/>`;
                else { const k = 6, pts = []; for (let q = 0; q < k; q += 1) { const a = q / k * 2 * Math.PI + rnd(r * 20 + c + 90) * 0.5; pts.push(`${(cx + rad * 1.15 * Math.cos(a)).toFixed(1)},${(cy + rad * 1.15 * Math.sin(a)).toFixed(1)}`); } out += `<polygon class="${parent === 'sandstone' ? 'grain' : 'calcite'}" points="${pts.join(' ')}"/>`; }
            }
        }
        if (melt > 0) for (let i = 0; i < 6; i += 1) out += `<ellipse class="melt" opacity="${melt.toFixed(2)}" cx="${(x0 + 12 + rnd(i + 500) * (w - 24)).toFixed(1)}" cy="${(y0 + 8 + rnd(i + 600) * (h - 16)).toFixed(1)}" rx="${(6 + 8 * melt).toFixed(1)}" ry="${(3 + 3 * melt).toFixed(1)}"/>`;
        return out;
    }

    function renderFacies(a) {
        const p = state.progress, zNow = a.z * ease(p), Tnow = 20 + a.g * zNow, Pnow = P_PER_KM * zNow, fNow = faciesOf(Tnow, Pnow);
        const CX0 = 40, CW = 90, Y0 = 36, Y1 = 186, ZM = 35, yOf = z => Y0 + z / ZM * (Y1 - Y0);
        let out = '';
        for (let y = Y0; y < Y1; y += 3) out += `<rect fill="${tColor(20 + a.g * (y - Y0) / (Y1 - Y0) * ZM)}" opacity=".55" x="${CX0}" y="${y}" width="${CW}" height="3.5"/>`;
        out += `<rect class="crust-frame" x="${CX0}" y="${Y0}" width="${CW}" height="${Y1 - Y0}"/>`;
        [0, 10, 20, 30].forEach(z => { out += `<text class="axis-text" x="${CX0 - 4}" y="${(yOf(z) + 3.5).toFixed(1)}" text-anchor="end">${z} km</text>`; });
        [200, 400, 600, 800].forEach(T => { const z = (T - 20) / a.g; if (z < ZM) out += `<line class="isotherm" x1="${CX0}" y1="${yOf(z).toFixed(1)}" x2="${CX0 + CW}" y2="${yOf(z).toFixed(1)}"/><text class="small-label" style="fill:#dc2626" x="${CX0 + CW + 4}" y="${(yOf(z) + 3.5).toFixed(1)}">${T} ℃</text>`; });
        out += `<circle class="sample" cx="${CX0 + CW / 2}" cy="${yOf(zNow).toFixed(1)}" r="6"/>`;
        out += `<text class="small-label" x="${CX0 + CW / 2}" y="${Y0 - 8}" text-anchor="middle">지각 · ${GRADS[state.grad].hint}</text>`;
        // rock panel on the right
        const RX = 214, RW = 110, RY = 44, RH = 70;
        out += texture(RX, RY, RW, RH, 'shale', Tnow, fNow.key === 'melt' ? 1 : Tnow > 700 ? clamp((Tnow - 700) / 200, 0, 0.6) : 0);
        out += `<text class="small-label" x="${RX + RW / 2}" y="${RY - 8}" text-anchor="middle">지금의 시료 (셰일이 변한 것)</text>`;
        const TX = 336;
        out += `<text class="trait-text" x="${TX}" y="56">깊이 ${fmtN(zNow, 1)} km</text><text class="trait-text" x="${TX}" y="74">온도 ${fmtN(Tnow)} ℃</text><text class="trait-text" x="${TX}" y="92">압력 ${fmtN(Pnow, 2)} GPa</text>`;
        out += `<text class="gen-text" style="fill:#d97706" x="${RX}" y="136">${fNow.name}</text><text class="trait-text" x="${RX}" y="154">→ ${fNow.rock}</text>`;
        out += `<text class="small-label" x="${RX}" y="174">${fNow.key === 'blueschist' ? '온도는 낮고 압력만 높음 — 섭입대의 특징' : fNow.key === 'melt' ? '녹기 시작 — 변성암과 마그마가 섞임' : fNow.key === 'none' ? '아직 굳어 가는 중 (속성 작용)' : fNow.key === 'granulite' ? '물이 빠져나가고 무수 광물이 자람' : '온도가 오를수록 결정이 굵어지고 엽리가 뚜렷'}</text>`;
        out += `<text class="small-label" x="${RX}" y="188">지온 기울기 ${a.g} ℃/km · 1 km마다 ${fmtN(P_PER_KM * 1000)} MPa</text>`;
        const VERD = { low: '낮은 변성', mid: '중간 변성', high: '높은 변성' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${p >= 1 ? `${a.z} km · ${a.g} ℃/km: ${fmtN(a.T)} ℃, ${fmtN(a.P, 2)} GPa → ${a.f.name} — ${VERD[a.verdict]}` : `셰일이 ${DEPTHS[state.depth].label}까지 묻히는 중 (${GRADS[state.grad].label})`}</text>`;
        out += `<text class="note-text" x="20" y="208">온도 = 20 ℃ + 지온 기울기 × 깊이 · 압력 = 2,800 kg/m³ × g × 깊이 · 변성상 경계는 어림값</text>`;
        return out;
    }

    function graphFacies(a) {
        const X0 = 60, X1 = 420, Y0 = 150, Y1 = 36, TM = 1000, PM = 1.4, xOf = T => X0 + T / TM * (X1 - X0), yOf = P => Y0 - P / PM * (Y0 - Y1);
        let out = `<text class="axis-title" x="20" y="18">온도–압력 그림과 변성상 — 점선 셋이 지온 기울기, 노란 점이 지금의 시료</text>`;
        const fields = [
            ['zeolite', '제올라이트', [[120, 0], [300, 0], [300, 0.45], [120, 0.45]], 'rgba(148, 163, 184, 0.28)'],
            ['greenschist', '녹색편암', [[300, 0.2], [450, 0.2], [450, 0.45], [300, 0.45]], 'rgba(84,230,193,.22)'],
            ['hornfels', '혼펠스', [[300, 0], [700, 0], [700, 0.2], [300, 0.2]], 'rgba(217, 119, 6, .22)'],
            ['amphibolite', '각섬암', [[450, 0.2], [700, 0.2], [700, 1.2], [500, 1.2], [500, 0.45], [450, 0.45]], 'rgba(255,159,138,.22)'],
            ['blueschist', '청색편암', [[120, 0.45], [500, 0.45], [500, 1.2], [450, 1.2], [450, PM], [120, PM]], 'rgba(82,199,255,.25)'],
            ['eclogite', '에클로자이트', [[450, 1.2], [900, 1.2], [900, PM], [450, PM]], 'rgba(167,139,250,.25)'],
            ['granulite', '백립암', [[700, 0], [900, 0], [900, 1.2], [700, 1.2]], 'rgba(255,122,89,.28)'],
            ['melt', '마그마', [[900, 0], [TM, 0], [TM, PM], [900, PM]], 'rgba(255,80,60,.3)'],
        ];
        fields.forEach(([key, name, poly, col]) => {
            out += `<polygon class="facies-field" fill="${col}" points="${poly.map(([T, P]) => `${xOf(T).toFixed(1)},${yOf(P).toFixed(1)}`).join(' ')}"/>`;
            const cx = poly.reduce((s, q) => s + q[0], 0) / poly.length, cy = poly.reduce((s, q) => s + q[1], 0) / poly.length;
            out += `<text class="facies-text" style="${state.progress >= 1 && a.f.key === key ? 'fill:#d97706' : ''}" x="${xOf(cx).toFixed(1)}" y="${(yOf(cy) + 3).toFixed(1)}" text-anchor="middle">${name}</text>`;
        });
        [0, 200, 400, 600, 800, 1000].forEach(T => { out += `<text class="axis-text" x="${xOf(T).toFixed(1)}" y="${Y0 + 14}" text-anchor="${T === 0 ? 'start' : 'middle'}">${T} ℃</text>`; });
        [0, 0.5, 1].forEach(P => { out += `<text class="axis-text" x="${X0 - 5}" y="${(yOf(P) + 3.5).toFixed(1)}" text-anchor="end">${P} GPa</text>`; });
        [10, 30, 50].forEach(z => { const P = P_PER_KM * z; if (P <= PM) out += `<text class="axis-text" x="${X1 + 4}" y="${(yOf(P) + 3.5).toFixed(1)}">${z} km</text>`; });
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        Object.entries(GRADS).forEach(([k, gr]) => { const zEnd = Math.min(50, (TM - 20) / gr.g), Pend = Math.min(PM, P_PER_KM * zEnd), zP = Pend / P_PER_KM; out += `<line class="geotherm${k === state.grad ? ' on' : ''}" style="stroke:${gr.col}" x1="${xOf(20).toFixed(1)}" y1="${yOf(0).toFixed(1)}" x2="${xOf(20 + gr.g * zP).toFixed(1)}" y2="${yOf(Pend).toFixed(1)}"/>`; });
        const zNow = a.z * ease(state.progress), Tn = 20 + a.g * zNow, Pn = P_PER_KM * zNow;
        out += `<circle fill="#d97706" stroke="#fff" cx="${xOf(Math.min(Tn, TM - 8)).toFixed(1)}" cy="${yOf(Pn).toFixed(1)}" r="4.5"/>`;
        out += `<text class="axis-title" x="${(X0 + X1) / 2}" y="${Y0 + 30}" text-anchor="middle">온도 — 오른쪽 눈금은 깊이. 섭입대(파랑)는 압력만, 열곡(주황)은 온도가 먼저 오릅니다</text>`;
        return out;
    }

    function renderGrade(a) {
        const p = state.progress, Tnow = 20 + (a.T - 20) * ease(p), rNow = rockAt(a.parent, Tnow), RX = 30, RY = 44, RW = 190, RH = 120;
        let out = texture(RX, RY, RW, RH, a.parent, Tnow, a.parent === 'shale' && Tnow > 700 ? clamp((Tnow - 700) / 150, 0, 0.6) : 0);
        out += `<text class="small-label" x="${RX + RW / 2}" y="${RY - 8}" text-anchor="middle">${PARENTS[a.parent].label} → 지금 ${fmtN(Tnow)} ℃</text>`;
        if (a.parent === 'shale') out += `<text class="small-label" x="${RX + RW / 2}" y="${RY + RH + 16}" text-anchor="middle">${Tnow >= 650 ? '밝고 어두운 띠 = 편마 구조' : Tnow >= 150 ? '판 모양 광물이 압력에 수직으로 늘어섬 = 엽리' : '진흙 알갱이가 층을 이룸'}</text>`;
        else out += `<text class="small-label" x="${RX + RW / 2}" y="${RY + RH + 16}" text-anchor="middle">${Tnow >= 250 ? '알갱이가 녹지 않고 다시 자라 맞물림 = 재결정' : '알갱이가 따로따로'}</text>`;
        const TX = 246;
        out += `<text class="gen-text" style="fill:#d97706" x="${TX}" y="58">${rNow.name}</text>`;
        out += `<text class="trait-text" x="${TX}" y="80">광물: ${rNow.minerals}</text><text class="trait-text" x="${TX}" y="98">조직: ${rNow.texture}</text>`;
        out += `<text class="small-label" x="${TX}" y="122">${a.parent === 'shale' ? '셰일 → 점판암 → 천매암 → 편암 → 편마암' : a.parent === 'sandstone' ? '사암 → 규암 (석영 하나라 엽리 없음)' : '석회암 → 대리암 (방해석 하나라 엽리 없음)'}</text>`;
        out += `<text class="small-label" x="${TX}" y="138">${a.parent === 'shale' ? '지시 광물: 녹니석 → 흑운모 → 석류석 → 규선석' : '온도가 오를수록 결정이 굵어짐'}</text>`;
        out += `<text class="small-label" x="${TX}" y="162">단계 ${rNow.stage + 1} / ${rNow.stages} · 압력은 중간 (광역 변성)</text>`;
        const VERD = { weak: '약한 변성', strong: '뚜렷한 변성암', high: '높은 변성' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${p >= 1 ? `${PARENTS[a.parent].label} ${a.T} ℃: ${a.r.name} — ${VERD[a.verdict]}` : `${PARENTS[a.parent].label}${eul(PARENTS[a.parent].label)} ${a.T} ℃까지 데우는 중`}</text>`;
        out += `<text class="note-text" x="20" y="208">암석 이름이 바뀌는 온도는 어림값. 실제로는 압력과 물의 양에 따라 조금씩 달라집니다</text>`;
        return out;
    }

    function graphGrade(a) {
        const X0 = 66, X1 = 420, TM = 900, xOf = T => X0 + T / TM * (X1 - X0);
        let out = `<text class="axis-title" x="20" y="18">온도(℃)에 따른 암석 이름과 지시 광물 (${PARENTS[a.parent].label}) — 노란 선이 지금 온도</text>`;
        const zones = ROCKS[a.parent], ZY = 40;
        zones.forEach((row, i) => { const t0 = row[0], t1 = i + 1 < zones.length ? zones[i + 1][0] : TM, x = xOf(t0), w = xOf(t1) - x; out += `<rect class="zone-bar" fill="${['rgba(148, 163, 184, 0.30)', 'rgba(84,230,193,.25)', 'rgba(217, 119, 6, .25)', 'rgba(255,159,138,.28)', 'rgba(255,122,89,.32)'][i]}" x="${x.toFixed(1)}" y="${ZY}" width="${w.toFixed(1)}" height="22"/>`; if (w > 24) out += `<text class="small-label" style="fill:#08131a" x="${(x + w / 2).toFixed(1)}" y="${ZY + 15}" text-anchor="middle">${row[1]}</text>`; });
        out += `<text class="axis-text" x="${X0 - 5}" y="${ZY + 15}" text-anchor="end">암석</text>`;
        const minerals = a.parent === 'shale' ? [['녹니석', 150, 400, '#059669'], ['흑운모', 350, 650, '#d97706'], ['석류석', 450, 750, '#ff7a59'], ['십자석', 500, 650, '#dc2626'], ['규선석', 600, 850, '#a78bfa']] : a.parent === 'sandstone' ? [['석영', 250, 900, '#0f172a']] : [['방해석', 250, 900, '#0f172a']];
        minerals.forEach(([name, t0, t1, col], i) => { const y = ZY + 34 + i * 16; out += `<rect class="mineral-bar" fill="${col}" opacity=".6" x="${xOf(t0).toFixed(1)}" y="${y}" width="${(xOf(t1) - xOf(t0)).toFixed(1)}" height="10" rx="2"/><text class="axis-text" x="${X0 - 5}" y="${y + 9}" text-anchor="end">${name}</text>`; });
        const AY = ZY + 34 + minerals.length * 16 + 8;
        [0, 150, 300, 450, 600, 750, 900].forEach(T => { out += `<line class="grid-line" x1="${xOf(T).toFixed(1)}" y1="${ZY}" x2="${xOf(T).toFixed(1)}" y2="${AY}"/><text class="axis-text" x="${xOf(T).toFixed(1)}" y="${AY + 12}" text-anchor="${T === 0 ? 'start' : 'middle'}">${T}</text>`; });
                const Tn = 20 + (a.T - 20) * ease(state.progress);
        out += `<line class="marker" x1="${xOf(Tn).toFixed(1)}" y1="${ZY - 4}" x2="${xOf(Tn).toFixed(1)}" y2="${AY}"/>`;
        out += `<text class="axis-title" x="${(X0 + X1) / 2}" y="${AY + 28}" text-anchor="middle">${a.parent === 'shale' ? '지시 광물이 차례로 나타나는 것으로 변성도를 읽습니다' : '광물이 하나뿐이라 지시 광물 대신 결정의 굵기로 변성도를 읽습니다'}</text>`;
        return out;
    }

    function renderContact(a) {
        const p = state.progress, { b, x } = a, spread = ease(p), MX = 40, MW = b.L > 100 ? 120 : 14, Y0 = 44, Y1 = 176;
        // distance axis is logarithmic so 1 m and 5 km both fit
        const xOf = d => MX + MW + 6 + Math.log10(Math.max(d, 1)) / Math.log10(10000) * (440 - MX - MW - 6);
        let out = `<rect class="host" x="20" y="${Y0}" width="420" height="${Y1 - Y0}"/>`;
        // halo widths at the two thresholds
        const dOf = T => Math.max(0.5, -b.L * Math.log((T - T_HOST) / (0.5 * (T_MAGMA - T_HOST))));
        out += `<rect class="halo2" x="${MX + MW}" y="${Y0}" width="${((xOf(dOf(200)) - MX - MW) * spread).toFixed(1)}" height="${Y1 - Y0}"/>`;
        out += `<rect class="halo" x="${MX + MW}" y="${Y0}" width="${((xOf(dOf(400)) - MX - MW) * spread).toFixed(1)}" height="${Y1 - Y0}"/>`;
        out += `<rect class="magma" x="${MX}" y="${Y0}" width="${MW}" height="${Y1 - Y0}"/>`;
        out += `<text class="small-label" style="fill:#d97706" x="${MX + MW / 2}" y="${Y0 - 8}" text-anchor="middle">${b.label} 900 ℃</text>`;
        [1, 10, 100, 1000, 5000].forEach(d => { out += `<line class="thresh" x1="${xOf(d).toFixed(1)}" y1="${Y1}" x2="${xOf(d).toFixed(1)}" y2="${Y1 + 5}"/><text class="axis-text" x="${xOf(d).toFixed(1)}" y="${Y1 + 17}" text-anchor="middle">${d >= 1000 ? `${d / 1000} km` : `${d} m`}</text>`; });
        const Tn = T_HOST + (a.T - T_HOST) * spread, sx = xOf(x);
        out += `<circle class="sample" cx="${sx.toFixed(1)}" cy="${(Y0 + Y1) / 2}" r="6"/>`;
        out += `<text class="small-label" x="${sx.toFixed(1)}" y="${(Y0 + Y1) / 2 - 12}" text-anchor="middle">셰일 시료 ${DISTS[state.dist].label}</text>`;
        out += `<text class="trait-text" style="fill:#d97706" x="${sx.toFixed(1)}" y="${(Y0 + Y1) / 2 + 22}" text-anchor="middle">${fmtN(Tn)} ℃</text>`;
        out += `<text class="small-label" x="${MX + MW + 6}" y="${Y0 + 12}">붉은 띠: 400 ℃ 넘게 (혼펠스) · 노란 띠: 200~400 ℃ (약간 구워짐)</text>`;
        out += `<text class="small-label" x="${MX + MW + 6}" y="${Y1 - 8}">구워지는 범위 ≈ 관입체 크기: 암맥은 몇 m, 저반은 수백 m~수 km</text>`;
        const VERD = { hornfels: '혼펠스로 구워짐', baked: '약간 구워짐', none: '변화 없음' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${p >= 1 ? `${b.label}에서 ${DISTS[state.dist].label}: 최고 ${fmtN(a.T)} ℃ — ${VERD[a.verdict]}` : `${b.label}의 열이 퍼지는 중 · 시료는 ${DISTS[state.dist].label}`}</text>`;
        out += `<text class="note-text" x="20" y="208">거리 눈금은 로그 · 최고 온도 = 100 + 400 × e^(−거리/관입체 반지름) ℃ (대략) · 압력은 그대로라 엽리 없음</text>`;
        return out;
    }

    function graphContact(a) {
        const X0 = 66, X1 = 420, Y0 = 150, Y1 = 40, xOf = d => X0 + Math.log10(Math.max(d, 1)) / 4 * (X1 - X0), yOf = T => Y0 - (T - 0) / 600 * (Y0 - Y1);
        let out = `<text class="axis-title" x="20" y="18">관입체에서의 거리에 따른 최고 온도 — 실선 ${a.b.label}, 점선 다른 관입체</text>`;
        [1, 10, 100, 1000, 10000].forEach(d => { out += `<line class="grid-line" x1="${xOf(d).toFixed(1)}" y1="${Y1}" x2="${xOf(d).toFixed(1)}" y2="${Y0}"/><text class="axis-text" x="${xOf(d).toFixed(1)}" y="${Y0 + 14}" text-anchor="${d === 1 ? 'start' : 'middle'}">${d >= 1000 ? `${d / 1000} km` : `${d} m`}</text>`; });
        [0, 200, 400, 600].forEach(T => { out += `<line class="grid-line" x1="${X0}" y1="${yOf(T).toFixed(1)}" x2="${X1}" y2="${yOf(T).toFixed(1)}"/><text class="axis-text" x="${X0 - 5}" y="${(yOf(T) + 3.5).toFixed(1)}" text-anchor="end">${T} ℃</text>`; });
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        out += `<line class="thresh" x1="${X0}" y1="${yOf(400).toFixed(1)}" x2="${X1}" y2="${yOf(400).toFixed(1)}"/><text class="small-label" style="fill:#dc2626" x="${X1}" y="${(yOf(400) - 4).toFixed(1)}" text-anchor="end">혼펠스 400 ℃</text>`;
        out += `<line class="thresh" x1="${X0}" y1="${yOf(200).toFixed(1)}" x2="${X1}" y2="${yOf(200).toFixed(1)}"/><text class="small-label" style="fill:#d97706" x="${X1}" y="${(yOf(200) - 4).toFixed(1)}" text-anchor="end">약간 구워짐 200 ℃</text>`;
        Object.entries(BODIES).forEach(([k, bd]) => { let d = ''; for (let e = 0; e <= 4 + 1e-9; e += 0.05) { const dist = 10 ** e; d += `${d ? 'L' : 'M'}${xOf(dist).toFixed(1)},${yOf(contactT(dist, bd.L)).toFixed(1)} `; } out += `<path class="trace${k === state.body ? '' : ' faint'}" style="stroke:${k === 'pluton' ? '#ff7a59' : '#0284c7'}" d="${d}"/>`; });
        out += `<circle fill="#d97706" stroke="#fff" cx="${xOf(a.x).toFixed(1)}" cy="${yOf(a.T).toFixed(1)}" r="4.5"/>`;
        out += `<text class="axis-title" x="${(X0 + X1) / 2}" y="${Y0 + 30}" text-anchor="middle">거리 (로그 눈금) — 관입체가 클수록 열이 멀리까지 미칩니다</text>`;
        return out;
    }

    function noteFor(a) {
        if (a.kind === 'facies') {
            return `<div class="data-row"><span class="data-name">온도</span><span class="data-val">20 ℃ + ${a.g} ℃/km × ${a.z} km = ${fmtN(a.T)} ℃</span></div>` +
                `<div class="data-row"><span class="data-name">압력</span><span class="data-val">2,800 kg/m³ × 9.8 m/s² × ${a.z} km = ${fmtN(a.P * 1000)} MPa = ${fmtN(a.P, 2)} GPa</span></div>` +
                `<div class="data-row"><span class="data-name">변성상</span><span class="data-val">${a.f.name} → ${a.f.rock}</span></div>` +
                `<div class="data-row match"><span class="data-name">판정</span><span class="data-val">${{ low: '낮은 변성 (400 ℃ 안)', mid: '중간 변성 (400~650 ℃)', high: '높은 변성 (650 ℃ 넘게)' }[a.verdict]}</span></div>`;
        }
        if (a.kind === 'grade') {
            return `<div class="data-row"><span class="data-name">조건</span><span class="data-val">${PARENTS[a.parent].label}, ${a.T} ℃, 중간 압력 (광역 변성)</span></div>` +
                `<div class="data-row"><span class="data-name">암석</span><span class="data-val">${a.r.name} — 광물 ${a.r.minerals}</span></div>` +
                `<div class="data-row"><span class="data-name">조직</span><span class="data-val">${a.r.texture}</span></div>` +
                `<div class="data-row match"><span class="data-name">판정</span><span class="data-val">${PRED_G[a.parent].find(o => o.value === a.verdict).label}</span></div>`;
        }
        return `<div class="data-row"><span class="data-name">관입체</span><span class="data-val">${a.b.label} (${a.b.hint}), 마그마 900 ℃, 둘레 암석 100 ℃</span></div>` +
            `<div class="data-row"><span class="data-name">최고 온도</span><span class="data-val">100 + 400 × e^(−${fmtN(a.x)} m ÷ ${fmtN(a.b.L)} m) = ${fmtN(a.T)} ℃</span></div>` +
            `<div class="data-row"><span class="data-name">암석</span><span class="data-val">${a.verdict === 'hornfels' ? '혼펠스 — 엽리 없이 치밀하게 구워짐' : a.verdict === 'baked' ? '점무늬 점판암 — 새 광물이 점점이 생김' : '셰일 그대로'}</span></div>` +
            `<div class="data-row match"><span class="data-name">판정</span><span class="data-val">${{ hornfels: '혼펠스로 구워짐', baked: '약간 구워짐', none: '변화 없음' }[a.verdict]}</span></div>`;
    }

    function render() {
        const a = analyse();
        mainGroup.innerHTML = a.kind === 'facies' ? renderFacies(a) : a.kind === 'grade' ? renderGrade(a) : renderContact(a);
        graphGroup.innerHTML = a.kind === 'facies' ? graphFacies(a) : a.kind === 'grade' ? graphGrade(a) : graphContact(a);
        liftProse();
        stageBadge.textContent = a.kind === 'facies' ? `${DEPTHS[state.depth].label} · ${GRADS[state.grad].hint}` : a.kind === 'grade' ? `${PARENTS[a.parent].label} · ${a.T} ℃` : `${a.b.label} · ${DISTS[state.dist].label}`;
        methodHint.textContent = a.kind === 'facies' ? '깊이가 압력을, 지온 기울기가 온도를 정합니다'
            : a.kind === 'grade' ? '온도가 오를수록 결정이 굵어지고 새 광물이 나타납니다'
                : '마그마 곁은 압력 없이 열만 받아 엽리 없는 혼펠스가 됩니다';
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
        if (a.kind === 'facies') {
            labelA.textContent = '온도·압력'; valueA.textContent = `${fmtN(a.T)} ℃ · ${fmtN(a.P, 2)} GPa`;
            labelB.textContent = '변성상'; valueB.textContent = a.f.name;
            s = `${a.z} km 깊이에서 압력은 2,800 kg/m³ × 9.8 m/s² × ${a.z} km = ${fmtN(a.P, 2)} GPa이고, 지온 기울기 ${a.g} ℃/km(${GRADS[state.grad].hint})이면 온도는 20 + ${a.g} × ${a.z} = ${fmtN(a.T)} ℃입니다. 온도–압력 그림에서 이 점은 ${a.f.name}에 듭니다. ${a.f.key === 'none' ? '셰일은 아직 그대로입니다. ' : `셰일은 ${a.f.rock}${iga(a.f.rock)} 됩니다. `}`;
            if (a.f.key === 'none') s += `120 ℃도 안 되어 아직 변성 작용이라 하기 어렵고, 진흙이 다져지고 굳는 속성 작용 단계입니다.`;
            else if (a.f.key === 'zeolite') s += `가장 낮은 변성 단계라 겉보기는 셰일과 비슷하지만 얇게 쪼개지는 점판암이 됩니다.`;
            else if (a.f.key === 'greenschist') s += `녹니석이 자라 초록빛을 띠고 비단 광택의 엽리가 생기는 낮은 변성 단계입니다. 안정한 대륙의 중간 깊이에서 흔합니다.`;
            else if (a.f.key === 'amphibolite') s += `흑운모·석류석이 자라 편암이 되고 더 뜨거우면 편마암이 되는 중간 변성입니다. 조산대의 광역 변성에서 가장 흔한 상입니다.`;
            else if (a.f.key === 'granulite') s += `물을 머금은 광물이 물을 내놓고 무수 광물이 자라는 높은 변성입니다. 조금만 더 뜨거우면 녹기 시작합니다.`;
            else if (a.f.key === 'blueschist') s += `깊이는 30 km인데 지온 기울기가 낮아 온도는 ${fmtN(a.T)} ℃뿐입니다. 압력만 높은 이 조건은 차가운 판이 밀려 들어가는 섭입대에서만 만들어지며, 푸른 남섬석이 자라 청색편암이 됩니다. 온도로는 낮은 변성이지만 압력으로는 깊은 변성입니다.`;
            else if (a.f.key === 'eclogite') s += `아주 높은 압력에서 석류석과 옴파사이트가 자라는 에클로자이트가 됩니다. 섭입한 판이 깊이 들어간 자리입니다.`;
            else s += `${fmtN(a.T)} ℃는 물을 머금은 셰일이 녹는 온도를 훌쩍 넘어, 변성암이 아니라 마그마와 변성암이 섞인 미그마타이트가 되고 더 뜨거우면 통째로 녹아 화강암질 마그마가 됩니다. 열곡이나 화산호의 뜨거운 지각에서 일어나는 일입니다.`;
        } else if (a.kind === 'grade') {
            const { r, T, parent } = a;
            labelA.textContent = '암석'; valueA.textContent = r.name;
            labelB.textContent = '광물'; valueB.textContent = r.minerals;
            s = `${PARENTS[parent].label}${eul(PARENTS[parent].label)} 중간 압력에서 ${T} ℃까지 데우면 ${r.name}${iga(r.name)} 됩니다. 광물은 ${r.minerals}, 조직은 ${r.texture}입니다. `;
            if (parent === 'shale') s += T < 300 ? `점토 광물이 녹니석과 견운모로 바뀌지만 결정이 너무 작아 눈에 안 보이고, 압력에 수직으로 얇게 쪼개지는 벽개가 생깁니다.` : T < 450 ? `흑운모가 나타나기 시작하고 판 모양 광물이 늘어서 비단처럼 반짝이는 엽리가 생깁니다.` : T < 650 ? `석류석과 십자석 같은 지시 광물이 자라고 운모가 굵어져 엽리가 뚜렷한 편암이 됩니다.` : `규선석이 나타나고 밝은 장석·석영과 어두운 흑운모·각섬석이 띠를 이루는 편마 구조가 생깁니다. 조금 더 뜨거우면 밝은 부분부터 녹아 미그마타이트가 됩니다.`;
            else s += T < 250 ? `알갱이가 다져질 뿐 아직 재결정은 일어나지 않아 원암과 거의 같습니다.` : `${parent === 'sandstone' ? '석영' : '방해석'} 알갱이가 녹지 않고 다시 자라 서로 맞물린 결정이 됩니다. 광물이 하나뿐이라 지시 광물도 엽리도 없고, 온도가 오를수록 결정만 굵어집니다.${T >= 650 ? ' 결정이 눈에 띄게 굵은 고변성 단계입니다.' : ''}`;
        } else {
            labelA.textContent = '최고 온도'; valueA.textContent = `${fmtN(a.T)} ℃`;
            labelB.textContent = '암석'; valueB.textContent = a.verdict === 'hornfels' ? '혼펠스' : a.verdict === 'baked' ? '점무늬 점판암' : '셰일 그대로';
            s = `${a.b.label}(${a.b.hint})의 마그마 900 ℃가 둘레 100 ℃의 셰일을 데웁니다. 열은 관입체 크기만큼의 거리에서 스러지므로 ${DISTS[state.dist].label} 떨어진 시료의 최고 온도는 100 + 400 × e^(−${fmtN(a.x)}/${fmtN(a.b.L)}) = ${fmtN(a.T)} ℃입니다. `;
            if (a.verdict === 'hornfels') s += `400 ℃를 넘어 새 광물이 자라며 단단하게 구워집니다. 방향성 있는 압력이 없어 광물이 늘어서지 않으므로 엽리 없이 치밀한 혼펠스가 됩니다.`;
            else if (a.verdict === 'baked') s += `200~400 ℃라 새 광물이 점점이 생기는 점무늬 점판암 정도로만 바뀝니다. 관입체에서 조금 더 멀면 아무 변화가 없습니다.`;
            else s += `200 ℃도 안 되어 변화가 없습니다. ${a.b.L < 100 ? '얇은 암맥은 열이 적어 몇 m 안쪽만 굽습니다.' : '큰 저반이라도 수 km 밖까지는 열이 미치지 못합니다.'} 접촉 변성은 이렇게 관입체 곁 좁은 띠에서만 일어나고, 넓은 지역의 변성은 조산대의 광역 변성입니다.`;
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
        checkBtn.textContent = state.mode === 'facies' ? '묻어 내리기' : state.mode === 'grade' ? '데우기' : '마그마 관입시키기';
        stageCaption.textContent = state.mode === 'facies' ? '왼쪽 지각 기둥에서 셰일 시료가 고른 깊이까지 묻혀 내려갑니다. 점선은 등온선이고, 오른쪽은 그 깊이에서 시료가 되는 암석입니다.'
            : state.mode === 'grade' ? '왼쪽 암석 조각을 데우며 광물과 조직이 바뀌는 모습입니다. 짧은 선은 판 모양 광물, 노란 선은 운모, 붉은 점은 석류석입니다.'
                : '왼쪽 붉은 덩이가 마그마 관입체, 띠는 열이 미치는 범위입니다. 거리 눈금은 로그라 1 m와 5 km가 한 그림에 들어 있습니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { depth: 'd15', grad: 'g25', temp: 't550', parent: 'shale', body: 'pluton', dist: 'x100', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'facies').click();
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

    window.__metaModel = {
        DEPTHS, GRADS, TEMPS, PARENTS, BODIES, DISTS, state,
        analyse, render, faciesOf, runSeconds,
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
