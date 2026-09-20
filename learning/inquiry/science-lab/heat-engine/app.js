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
    const R = 8.314, GAMMA = 5 / 3, V1 = 1, V2 = 2; // 1 mol of a monatomic ideal gas, litres; isothermal expansion doubles the volume
    const HOTS = { h150: { label: '150 ℃', hint: '증기 기관', T: 150 }, h300: { label: '300 ℃', hint: '자동차 엔진', T: 300 }, h500: { label: '500 ℃', hint: '화력 발전소', T: 500 }, h800: { label: '800 ℃', hint: '가스 터빈', T: 800 } };
    const COLDS = { c20: { label: '20 ℃', hint: '강물·바깥 공기', T: 20 }, c100: { label: '100 ℃', hint: '뜨거운 배기', T: 100 } };
    const EFFS = { e20: { label: '20 %', hint: '', eta: 0.2 }, e40: { label: '40 %', hint: '', eta: 0.4 }, e60: { label: '60 %', hint: '', eta: 0.6 }, e100: { label: '100 %', hint: '버리는 열 없음', eta: 1 } };
    const PAIRS = { low: { label: '150 ℃ / 20 ℃', hint: '카르노 한계 30.7 %', Th: 150, Tc: 20 }, high: { label: '500 ℃ / 20 ℃', hint: '카르노 한계 62.1 %', Th: 500, Tc: 20 } };
    const OUTS = { o10: { label: '10 ℃', hint: '서늘한 날', T: 10 }, o0: { label: '0 ℃', hint: '영하 언저리', T: 0 }, om10: { label: '−10 ℃', hint: '한겨울', T: -10 }, om20: { label: '−20 ℃', hint: '혹한', T: -20 } };
    const INS = { i18: { label: '18 ℃', hint: '서늘하게', T: 18 }, i24: { label: '24 ℃', hint: '따뜻하게', T: 24 } };
    const Q_IN = 1000, REAL_FACTOR = 0.35; // J per cycle in the flow view; real heat pumps reach about a third of the ideal figure (대략)

    const state = { mode: 'carnot', hot: 'h500', cold: 'c20', eff: 'e40', pair: 'high', out: 'o0', inn: 'i18', progress: 0, prediction: null };
    let running = false, frameId = 0, lastStamp = 0;

    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const ease = p => p < 0.5 ? 2 * p * p : 1 - (1 - p) * (1 - p) * 2;
    const fmtN = (n, d = 0) => (+n.toFixed(d)).toLocaleString('ko-KR', { minimumFractionDigits: d, maximumFractionDigits: d }).replace('-', '−');
    const K = c => c + 273.15;
    const roNum = v => /[036]$/.test(String(v)) ? '으로' : '로';

    /* ------------------------------------------------------------ models */
    function carnotModel() {
        const Th = K(HOTS[state.hot].T), Tc = K(COLDS[state.cold].T), eta = 1 - Tc / Th;
        const V3 = V2 * (Th / Tc) ** (1 / (GAMMA - 1)), V4 = V1 * (Th / Tc) ** (1 / (GAMMA - 1));
        const Qh = R * Th * Math.log(V2 / V1), Qc = R * Tc * Math.log(V3 / V4), W = Qh - Qc;
        const pOf = (T, V) => R * T / (V * 1e-3) / 1000; // kPa
        return { kind: 'carnot', Th, Tc, eta, V3, V4, Qh, Qc, W, pOf, verdict: eta < 0.3 ? 'low' : eta < 0.6 ? 'mid' : 'high' };
    }
    // the state of the gas at cycle phase u in [0,1): (T, V) along the four legs
    function carnotState(a, u) {
        const s = ((u % 1) + 1) % 1, k = s * 4, leg = Math.floor(k), f = ease(k - leg);
        let T, V;
        if (leg === 0) { T = a.Th; V = V1 * Math.exp(f * Math.log(V2 / V1)); }
        else if (leg === 1) { V = V2 * Math.exp(f * Math.log(a.V3 / V2)); T = a.Th * (V2 / V) ** (GAMMA - 1); }
        else if (leg === 2) { T = a.Tc; V = a.V3 * Math.exp(f * Math.log(a.V4 / a.V3)); }
        else { V = a.V4 * Math.exp(f * Math.log(V1 / a.V4)); T = a.Tc * (a.V4 / V) ** (GAMMA - 1); }
        return { leg, f, T, V, p: a.pOf(T, V) };
    }
    function flowModel() {
        const e = EFFS[state.eff], pr = PAIRS[state.pair], Th = K(pr.Th), Tc = K(pr.Tc), etaC = 1 - Tc / Th;
        const W = Q_IN * e.eta, Qc = Q_IN - W, dS = Qc / Tc - Q_IN / Th;
        return { kind: 'flow', eta: e.eta, Th, Tc, etaC, W, Qc, dS, verdict: e.eta >= 1 ? 'perpetual' : e.eta > etaC + 1e-9 ? 'over' : 'ok' };
    }
    function pumpModel() {
        const Tc = K(OUTS[state.out].T), Th = K(INS[state.inn].T), cop = Th / (Th - Tc), copReal = cop * REAL_FACTOR;
        return { kind: 'pump', Tc, Th, cop, copReal, Qc: cop - 1, verdict: cop < 10 ? 'low' : cop < 20 ? 'mid' : 'high' };
    }
    function analyse() {
        if (state.mode === 'carnot') return carnotModel();
        if (state.mode === 'flow') return flowModel();
        return pumpModel();
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
    const opts = table => Object.entries(table).map(([k, v]) => ({ value: k, label: v.label }));

    function buildControls() {
        if (state.mode === 'carnot') controlArea.innerHTML = pickRow('뜨거운 곳 (열원)', 'hot', opts(HOTS), state.hot, 4) + pickRow('차가운 곳 (열을 버리는 곳)', 'cold', opts(COLDS), state.cold, 2);
        else if (state.mode === 'flow') { if(!['e20','e100'].includes(state.eff))state.eff='e20'; controlArea.innerHTML=pickRow('받은 열을 어떻게 쓰는 기관인가요?', 'eff', [{value:'e20',label:'일부를 일로, 나머지는 배출'},{value:'e100',label:'모두 일로, 배출 없음'}], state.eff, 2); }
        else controlArea.innerHTML = pickRow('바깥 온도', 'out', opts(OUTS), state.out, 4) + pickRow('실내 온도', 'inn', opts(INS), state.inn, 2);
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                buildPrediction();
                settingsChanged();
            }));
        });
    }

    const PRED_C = [{ value: 'low', label: '30 % 안' }, { value: 'mid', label: '30~60 %' }, { value: 'high', label: '60 % 넘게' }];
    const PRED_F = [{ value: 'ok', label: '가능한 기관' }, { value: 'over', label: '불가능 — 카르노 한계 넘음' }, { value: 'perpetual', label: '불가능 — 2종 영구 기관' }];
    const PRED_P = [{ value: 'low', label: '10배 안' }, { value: 'mid', label: '10~20배' }, { value: 'high', label: '20배 넘게' }];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list=state.mode==='flow'?[{value:'yes',label:'가능한 기관'},{value:'no',label:'불가능한 기관'}]:state.mode==='pump'?[{value:'yes',label:'외부에서 일을 공급해야 한다'},{value:'no',label:'일 없이 저절로 옮긴다'}]:[{value:'yes',label:'고온 열원을 높이면 한계 효율 증가'},{value:'no',label:'고온 열원을 높이면 한계 효율 감소'}];
        predictionLegend.textContent=state.mode==='carnot'?'저온 열원의 온도를 고정하고 비교하세요.':state.mode==='flow'?'이러한 순환 기관을 만들 수 있을까요?':'저온에서 고온으로 열을 옮기려면?';
        predictionArea.innerHTML=list.map(o=>'<button type="button" data-prediction="'+o.value+'">'+o.label+'</button>').join('');
        predictionArea.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{state.prediction=b.dataset.prediction; window.scienceInvalidatePrediction?.();predictionArea.querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===b));}));
    }

    /* ----------------------------------------------------------- visuals */
    const arrow = (x1, y1, x2, y2, cls, head, w = 3.5) => {
        const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
        const bx = x2 - ux * 6, by = y2 - uy * 6;
        return `<line class="${cls}" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}"/><polygon class="${head}" points="${x2.toFixed(1)},${y2.toFixed(1)} ${(bx - uy * w).toFixed(1)},${(by + ux * w).toFixed(1)} ${(bx + uy * w).toFixed(1)},${(by - ux * w).toFixed(1)}"/>`;
    };
    const LEGS = ['등온 팽창 (열 받음)', '단열 팽창 (식음)', '등온 압축 (열 버림)', '단열 압축 (더워짐)'];

    function renderCarnot(a) {
        const p = state.progress, on = p > 0, st = carnotState(a, p), CX0 = 60, CW = 70, CT = 40, CB = 160;
        const hFrac = Math.log(st.V / V1) / Math.log(a.V3 / V1), gasTop = CB - 22 - (CB - CT - 40) * hFrac;
        let out = `<rect class="cylinder" x="${CX0}" y="${CT}" width="${CW}" height="${CB - CT}" rx="3"/>`;
        out += `<rect class="gas${st.T < (a.Th + a.Tc) / 2 ? ' cold' : ''}" x="${CX0 + 1}" y="${gasTop.toFixed(1)}" width="${CW - 2}" height="${(CB - gasTop - 1).toFixed(1)}"/>`;
        out += `<rect class="piston" x="${CX0 + 2}" y="${(gasTop - 7).toFixed(1)}" width="${CW - 4}" height="7"/><line class="rod" x1="${CX0 + CW / 2}" y1="${(gasTop - 7).toFixed(1)}" x2="${CX0 + CW / 2}" y2="${Math.max(18, gasTop - 30).toFixed(1)}"/>`;
        // gas particles, faster when hot
        for (let i = 0; i < 18; i += 1) { const gx = CX0 + 6 + ((i * 37 + Math.floor(p * 300 * (st.T / a.Tc))) % (CW - 12)), gy = gasTop + 6 + ((i * 53 + Math.floor(p * 200 * (st.T / a.Tc))) % Math.max(4, CB - gasTop - 12)); out += `<circle fill="#d97706" opacity=".8" cx="${gx.toFixed(1)}" cy="${gy.toFixed(1)}" r="1.6"/>`; }
        // reservoir in contact below the cylinder
        const leg = on ? st.leg : -1;
        if (leg === 0) out += `<rect class="hot-block" x="${CX0 - 8}" y="${CB + 4}" width="${CW + 16}" height="16" rx="3"/><text class="small-label" x="${CX0 + CW / 2}" y="${CB + 33}" text-anchor="middle">뜨거운 곳 ${fmtN(a.Th - 273.15)} ℃</text>` + arrow(CX0 + CW / 2, CB + 2, CX0 + CW / 2, CB - 16, 'heat-in', 'heat-in-head', 4);
        else if (leg === 2) out += `<rect class="cold-block" x="${CX0 - 8}" y="${CB + 4}" width="${CW + 16}" height="16" rx="3"/><text class="small-label" x="${CX0 + CW / 2}" y="${CB + 33}" text-anchor="middle">차가운 곳 ${fmtN(a.Tc - 273.15)} ℃</text>` + arrow(CX0 + CW / 2, CB - 16, CX0 + CW / 2, CB + 2, 'heat-out', 'heat-out-head', 4);
        else out += `<rect class="insul" x="${CX0 - 8}" y="${CB + 4}" width="${CW + 16}" height="16" rx="3"/><text class="small-label" x="${CX0 + CW / 2}" y="${CB + 33}" text-anchor="middle">${on ? '단열 (열 드나듦 없음)' : '아직 정지'}</text>`;
        if (on && (leg === 0 || leg === 1)) out += arrow(CX0 + CW + 12, gasTop + 10, CX0 + CW + 12, gasTop - 14, 'work', 'work-head', 3.5) + `<text class="small-label" style="fill:#059669" x="${CX0 + CW + 18}" y="${(gasTop - 2).toFixed(1)}">일 함</text>`;
        else if (on) out += arrow(CX0 + CW + 12, gasTop - 24, CX0 + CW + 12, gasTop, 'work', 'work-head', 3.5) + `<text class="small-label" style="fill:#059669" x="${CX0ᅟ = 0 || CX0 + CW + 18}" y="${(gasTop - 2).toFixed(1)}">일 받음</text>`;
        out += `<text class="small-label" x="${CX0 + CW / 2}" y="${CT - 8}" text-anchor="middle">${on ? `${LEGS[leg]}` : '기체 1 mol'}</text>`;
        const TX = 230;
        out += `<text class="trait-text" x="${TX}" y="50">T_h = ${fmtN(a.Th - 273.15)} ℃ = ${fmtN(a.Th)} K · T_c = ${fmtN(a.Tc - 273.15)} ℃ = ${fmtN(a.Tc)} K</text>`;
        out += `<text class="gen-text" style="fill:#d97706" x="${TX}" y="72">η = 1 − ${fmtN(a.Tc)}/${fmtN(a.Th)} = ${fmtN(a.eta * 100, 1)} %</text>`;
        out += `<text class="trait-text" x="${TX}" y="94">${on ? `지금 기체 ${fmtN(st.T - 273.15)} ℃ · ${fmtN(st.V, 2)} L · ${fmtN(st.p)} kPa` : '한 바퀴 돌려 보세요'}</text>`;
        out += `<text class="trait-text" style="fill:#dc2626" x="${TX}" y="116">받는 열 Q_h = ${fmtN(a.Qh)} J</text><text class="trait-text" style="fill:#059669" x="${TX}" y="134">한 일 W = ${fmtN(a.W)} J</text><text class="trait-text" style="fill:#0284c7" x="${TX}" y="152">버리는 열 Q_c = ${fmtN(a.Qc)} J</text>`;
        out += `<text class="small-label" x="${TX}" y="174">견주기: 화력 발전소 40 % · 자동차 엔진 30 % 안팎</text>`;
        out += `<text class="small-label" x="${TX}" y="188">(실제 기관은 마찰과 새는 열로 한계보다 낮음)</text>`;
        const VERD = { low: '30 % 안', mid: '30~60 %', high: '60 % 넘게' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${p >= 1 ? `${HOTS[state.hot].label} / ${COLDS[state.cold].label}: 효율 ${fmtN(a.eta * 100, 1)} % — ${VERD[a.verdict]}` : `${HOTS[state.hot].label} / ${COLDS[state.cold].label} 카르노 기관`}</text>`;
        out += `<text class="note-text" x="20" y="208">기체 1 mol, 등온 팽창으로 부피 2배. 피스톤 높이는 부피의 로그 눈금(대략). 효율은 절대 온도로 계산</text>`;
        return out;
    }

    function graphCarnot(a) {
        const X0 = 66, X1 = 420, Y0 = 150, Y1 = 40, Vmax = a.V3 * 1.06, pMax = a.pOf(a.Th, V1) * 1.06, xOf = V => X0 + V / Vmax * (X1 - X0), yOf = pp => Y0 - clamp(pp / pMax, 0, 1) * (Y0 - Y1);
        let out = `<text class="axis-title" x="20" y="18">압력–부피 그래프 — 닫힌 고리의 넓이가 한 바퀴에 한 일 W = ${fmtN(a.W)} J</text>`;
        const vStep = Vmax > 20 ? 5 : Vmax > 8 ? 2 : 1;
        for (let V = 0; V <= Vmax; V += vStep) out += `<line class="grid-line" x1="${xOf(V).toFixed(1)}" y1="${Y1}" x2="${xOf(V).toFixed(1)}" y2="${Y0}"/><text class="axis-text" x="${xOf(V).toFixed(1)}" y="${Y0 + 14}" text-anchor="${V === 0 ? 'start' : 'middle'}">${V} L</text>`;
        const pStep = pMax > 5000 ? 2000 : pMax > 2500 ? 1000 : 500;
        for (let pp = 0; pp <= pMax; pp += pStep) out += `<line class="grid-line" x1="${X0}" y1="${yOf(pp).toFixed(1)}" x2="${X1}" y2="${yOf(pp).toFixed(1)}"/><text class="axis-text" x="${X0 - 5}" y="${(yOf(pp) + 3.5).toFixed(1)}" text-anchor="end">${pp >= 1000 ? `${pp / 1000} MPa` : `${pp} kPa`}</text>`;
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        const legPath = (l) => { let d = ''; for (let f = 0; f <= 1.0001; f += 0.02) { const s = carnotState(a, (l + f) / 4); d += `${d ? 'L' : 'M'}${xOf(s.V).toFixed(1)},${yOf(s.p).toFixed(1)} `; } return d; };
        out += `<path class="loop-fill" d="${legPath(0)} ${legPath(1).replace('M', 'L')} ${legPath(2).replace('M', 'L')} ${legPath(3).replace('M', 'L')} Z"/>`;
        out += `<path class="leg-iso-h" d="${legPath(0)}"/><path class="leg-adi" d="${legPath(1)}"/><path class="leg-iso-c" d="${legPath(2)}"/><path class="leg-adi" d="${legPath(3)}"/>`;
        const s1 = carnotState(a, 0.125), s3 = carnotState(a, 0.625);
        out += `<text class="small-label" style="fill:#dc2626" x="${(xOf(s1.V) + 8).toFixed(1)}" y="${(yOf(s1.p) - 6).toFixed(1)}">등온 ${fmtN(a.Th - 273.15)} ℃</text>`;
        out += `<text class="small-label" style="fill:#0284c7" x="${xOf(s3.V).toFixed(1)}" y="${(yOf(s3.p) - 8).toFixed(1)}" text-anchor="middle">등온 ${fmtN(a.Tc - 273.15)} ℃</text>`;
        if (state.progress > 0) { const st = carnotState(a, state.progress); out += `<circle fill="#d97706" stroke="#fff" cx="${xOf(st.V).toFixed(1)}" cy="${yOf(st.p).toFixed(1)}" r="4.5"/>`; }
        out += `<text class="axis-title" x="${(X0 + X1) / 2}" y="${Y0 + 30}" text-anchor="middle">부피 — 점선은 단열 과정. 위 등온선 아래 넓이가 Q_h, 아래 등온선 아래 넓이가 Q_c</text>`;
        return out;
    }

    function renderFlow(a) {
        const p = state.progress, e = ease(p), SC = 44 / Q_IN, wH = Q_IN * SC, wW = a.W * SC, wC = a.Qc * SC, EX = 150, EY = 108, ER = 26;
        let out = `<rect class="reservoir-h" x="${EX - 70}" y="26" width="140" height="26" rx="4"/><text class="trait-text" x="${EX}" y="43" text-anchor="middle">뜨거운 곳 ${fmtN(a.Th - 273.15)} ℃</text>`;
        out += `<rect class="reservoir-c" x="${EX - 70}" y="164" width="140" height="26" rx="4"/><text class="trait-text" x="${EX}" y="181" text-anchor="middle">차가운 곳 ${fmtN(a.Tc - 273.15)} ℃</text>`;
        // heat in
        out += `<rect class="flow-h" x="${(EX - wH / 2).toFixed(1)}" y="52" width="${wH.toFixed(1)}" height="${(30 * e).toFixed(1)}"/>`;
        if (e > 0.95) out += `<polygon class="flow-h" points="${(EX - wH / 2 - 6).toFixed(1)},80 ${(EX + wH / 2 + 6).toFixed(1)},80 ${EX},${EY - ER}"/>`;
        // work out to the right
        if (wW > 0) { out += `<rect class="flow-w" x="${EX + ER}" y="${(EY - wW / 2).toFixed(1)}" width="${(110 * e).toFixed(1)}" height="${wW.toFixed(1)}"/>`; if (e > 0.95) out += `<polygon class="flow-w" points="${EX + ER + 110},${(EY - wW / 2 - 6).toFixed(1)} ${EX + ER + 110},${(EY + wW / 2 + 6).toFixed(1)} ${EX + ER + 128},${EY}"/>`; }
        // heat out downwards
        if (wC > 0) { out += `<rect class="flow-c" x="${(EX - wC / 2).toFixed(1)}" y="${EY + ER}" width="${wC.toFixed(1)}" height="${(20 * e).toFixed(1)}"/>`; if (e > 0.95) out += `<polygon class="flow-c" points="${(EX - wC / 2 - 6).toFixed(1)},${EY + ER + 20} ${(EX + wC / 2 + 6).toFixed(1)},${EY + ER + 20} ${EX},${EY + ER + 32}"/>`; }
        out += `<circle class="engine" cx="${EX}" cy="${EY}" r="${ER}"/><text class="gen-text" x="${EX}" y="${EY + 4}" text-anchor="middle">기관</text>`;
        // energy packets flowing in
        for (let k = 0; k < 4; k += 1) { const t = (p * 1.5 + k / 4) % 1; out += `<circle class="packet" cx="${EX}" cy="${(52 + 30 * t).toFixed(1)}" r="2.2"/>`; }
        out += `<text class="small-label" style="fill:#dc2626" x="${EX + wH / 2 + 8}" y="63">Q_h = ${fmtN(Q_IN)} J</text>`;
        out += `<text class="small-label" style="fill:#059669" x="${EX + ER + 8}" y="${(EY - wW / 2 - 6).toFixed(1)}">W = ${fmtN(a.W)} J</text>`;
        out += `<text class="small-label" style="fill:#0284c7" x="${EX + wC / 2 + 8}" y="${EY + ER + 16}">Q_c = ${fmtN(a.Qc)} J${a.Qc === 0 ? ' (없음)' : ''}</text>`;
        if (p >= 1 && a.verdict !== 'ok') out += `<line class="forbid" x1="${EX - 22}" y1="${EY - 22}" x2="${EX + 22}" y2="${EY + 22}"/><line class="forbid" x1="${EX + 22}" y1="${EY - 22}" x2="${EX - 22}" y2="${EY + 22}"/>`;
        const TX = 306;
        out += `<text class="trait-text" x="${TX}" y="50">효율 η = W/Q_h = ${fmtN(a.eta * 100)} %</text>`;
        out += `<text class="trait-text" x="${TX}" y="68">카르노 한계 1 − T_c/T_h = ${fmtN(a.etaC * 100, 1)} %</text>`;
        out += `<text class="trait-text" x="${TX}" y="92">엔트로피 변화 (한 바퀴)</text>`;
        out += `<text class="trait-text" x="${TX}" y="108">Q_c/T_c − Q_h/T_h</text>`;
        out += `<text class="gen-text" style="fill:${a.dS >= -1e-9 ? '#059669' : '#dc2626'}" x="${TX}" y="128">= ${fmtN(a.dS, 2)} J/K</text>`;
        out += `<text class="small-label" x="${TX}" y="148">${a.dS >= -1e-9 ? '0 이상 → 제2법칙에 맞음' : '0보다 작음 → 제2법칙 위반'}</text>`;
        out += `<text class="small-label" x="${TX}" y="162">${a.verdict === 'perpetual' ? '열을 몽땅 일로 — 2종 영구 기관' : a.verdict === 'over' ? '카르노 기관보다 좋을 수 없음' : '실제 기관도 이 안에서 돔'}</text>`;
        const VERD = { ok: '가능한 기관', over: '불가능 — 카르노 한계 넘음', perpetual: '불가능 — 2종 영구 기관' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${p >= 1 ? `효율 ${fmtN(a.eta * 100)} % (${PAIRS[state.pair].label}): ${VERD[a.verdict]}` : `효율 ${fmtN(a.eta * 100)} %를 내세우는 기관 · ${PAIRS[state.pair].label}`}</text>`;
        out += `<text class="note-text" x="20" y="208">띠의 폭이 에너지의 크기. Q_h = W + Q_c는 늘 성립(제1법칙)하고, 엔트로피 변화가 0 이상이어야 함(제2법칙)</text>`;
        return out;
    }

    function graphFlow(a) {
        const X0 = 66, X1 = 420, Y0 = 150, Y1 = 40, keys = Object.keys(EFFS), bw = (X1 - X0) / keys.length, yOf = v => Y0 - v * (Y0 - Y1);
        let out = `<text class="axis-title" x="20" y="18">내세우는 효율과 카르노 한계 (${PAIRS[state.pair].label}) — 점선 위는 불가능</text>`;
        [0, 0.25, 0.5, 0.75, 1].forEach(v => { out += `<line class="grid-line" x1="${X0}" y1="${yOf(v).toFixed(1)}" x2="${X1}" y2="${yOf(v).toFixed(1)}"/><text class="axis-text" x="${X0 - 5}" y="${(yOf(v) + 3.5).toFixed(1)}" text-anchor="end">${v * 100} %</text>`; });
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        keys.forEach((k, i) => {
            const eta = EFFS[k].eta, x = X0 + bw * i + bw * 0.22, w = bw * 0.56, over = eta > a.etaC + 1e-9;
            out += `<rect class="bar-eff${over ? ' over' : ''}" style="${k === state.eff ? 'stroke:#d97706;stroke-width:2' : ''}" x="${x.toFixed(1)}" y="${yOf(eta).toFixed(1)}" width="${w.toFixed(1)}" height="${(Y0 - yOf(eta)).toFixed(1)}" rx="2"/>`;
            out += `<text class="axis-text" style="${k === state.eff ? 'fill:#d97706' : ''}" x="${(x + w / 2).toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${EFFS[k].label}</text>`;
            out += `<text class="small-label" x="${(x + w / 2).toFixed(1)}" y="${(yOf(eta) - 5).toFixed(1)}" text-anchor="middle">${over ? '✕' : 'W ' + fmtN(Q_IN * eta) + ' J'}</text>`;
        });
        out += `<line class="limit-line" x1="${X0}" y1="${yOf(a.etaC).toFixed(1)}" x2="${X1}" y2="${yOf(a.etaC).toFixed(1)}"/><text class="small-label" style="fill:#d97706" x="${X1}" y="${(yOf(a.etaC) - 5).toFixed(1)}" text-anchor="end">카르노 한계 ${fmtN(a.etaC * 100, 1)} %</text>`;
        out += `<text class="axis-title" x="${(X0 + X1) / 2}" y="${Y0 + 30}" text-anchor="middle">받은 열 1,000 J 가운데 일로 바꾸는 몫 — 한계는 온도로만 정해집니다</text>`;
        return out;
    }

    function renderPump(a) {
        const p = state.progress, e = ease(p), PX = 214, PY = 104, PW = 64, PH = 52, SC = 14 / Math.max(a.cop, 1);
        let out = `<rect class="outside" x="20" y="40" width="130" height="130" rx="6"/><text class="trait-text" x="85" y="60" text-anchor="middle">바깥 ${OUTS[state.out].label}</text>`;
        for (let i = 0; i < 14; i += 1) out += `<circle class="snow" cx="${(30 + (i * 37) % 110).toFixed(1)}" cy="${(70 + ((i * 53 + Math.floor(p * 60)) % 90)).toFixed(1)}" r="1.6"/>`;
        out += `<path class="house" d="M300,84 L360,44 L420,84 L420,170 L300,170 Z"/><text class="trait-text" x="360" y="104" text-anchor="middle">실내 ${INS[state.inn].label}</text>`;
        out += `<rect class="pump" x="${PX - PW / 2}" y="${PY - PH / 2}" width="${PW}" height="${PH}" rx="6"/><text class="gen-text" x="${PX}" y="${PY - 2}" text-anchor="middle">열펌프</text><text class="small-label" x="${PX}" y="${PY + 14}" text-anchor="middle">거꾸로 도는 기관</text>`;
        // Qc from outside, W from the plug, Qh into the house; widths scale with energy per 1 J of work
        const wQc = Math.max(4, a.Qc * SC), wQh = Math.max(4, a.cop * SC), wW = Math.max(4, 1 * SC);
        out += `<rect class="flow-c" x="150" y="${(PY - wQc / 2).toFixed(1)}" width="${(32 * e).toFixed(1)}" height="${wQc.toFixed(1)}"/>`;
        out += `<rect class="flow-h" x="${PX + PW / 2}" y="${(PY - wQh / 2).toFixed(1)}" width="${(54 * e).toFixed(1)}" height="${wQh.toFixed(1)}"/>`;
        out += `<rect class="flow-w" x="${(PX - wW / 2).toFixed(1)}" y="${(PY + PH / 2 + 30 - 30 * e).toFixed(1)}" width="${wW.toFixed(1)}" height="${(30 * e).toFixed(1)}"/>`;
        out += `<line class="plug" x1="${PX - 8}" y1="${PY + PH / 2 + 32}" x2="${PX + 8}" y2="${PY + PH / 2 + 32}"/><text class="small-label" style="fill:#d97706" x="${PX}" y="${PY + PH / 2 + 46}" text-anchor="middle">전기 W = 1 J</text>`;
        out += `<text class="small-label" style="fill:#0284c7" x="166" y="${(PY - wQc / 2 - 6).toFixed(1)}" text-anchor="middle">Q_c = ${fmtN(a.Qc, 1)} J</text>`;
        out += `<text class="small-label" style="fill:#dc2626" x="${PX + PW / 2 + 27}" y="${(PY - wQh / 2 - 6).toFixed(1)}" text-anchor="middle">Q_h = ${fmtN(a.cop, 1)} J</text>`;
        for (let k = 0; k < 3; k += 1) { const t = (p * 1.5 + k / 3) % 1; out += `<circle class="packet" cx="${(150 + 32 * t).toFixed(1)}" cy="${PY}" r="2"/><circle class="packet" cx="${(PX + PW / 2 + 54 * t).toFixed(1)}" cy="${PY}" r="2"/>`; }
        out += `<text class="trait-text" x="20" y="190">이상적 성적 계수 = T_h/(T_h − T_c) = ${fmtN(a.Th, 1)}/(${fmtN(a.Th, 1)} − ${fmtN(a.Tc, 1)}) = ${fmtN(a.cop, 1)} · 실제 기기는 그 3분의 1쯤 ≈ ${fmtN(a.copReal, 1)}</text>`;
        const VERD = { low: '10배 안', mid: '10~20배', high: '20배 넘게' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${p >= 1 ? `바깥 ${OUTS[state.out].label} · 실내 ${INS[state.inn].label}: 전기 1 J로 열 ${fmtN(a.cop, 1)} J — ${VERD[a.verdict]}` : `바깥 ${OUTS[state.out].label} · 실내 ${INS[state.inn].label} 열펌프`}</text>`;
        out += `<text class="note-text" x="20" y="208">Q_h = Q_c + W · 이상값은 카르노 기관을 거꾸로 돌린 값, 실제 기기는 온도 차와 마찰로 그보다 낮음(대략)</text>`;
        return out;
    }

    function graphPump(a) {
        const X0 = 66, X1 = 420, Y0 = 150, Y1 = 40, TA = -30, TB = 15, CM = 35, xOf = T => X0 + (T - TA) / (TB - TA) * (X1 - X0), yOf = c => Y0 - clamp(c, 0, CM) / CM * (Y0 - Y1);
        let out = `<text class="axis-title" x="20" y="18">바깥 온도에 따른 성적 계수 — 실선 이상값, 점선 실제 기기(대략), 실내 ${INS[state.inn].label}</text>`;
        [-30, -20, -10, 0, 10].forEach(T => { out += `<line class="grid-line" x1="${xOf(T).toFixed(1)}" y1="${Y1}" x2="${xOf(T).toFixed(1)}" y2="${Y0}"/><text class="axis-text" x="${xOf(T).toFixed(1)}" y="${Y0 + 14}" text-anchor="${T === -30 ? 'start' : 'middle'}">${T} ℃</text>`; });
        [0, 10, 20, 30].forEach(c => { out += `<line class="grid-line" x1="${X0}" y1="${yOf(c).toFixed(1)}" x2="${X1}" y2="${yOf(c).toFixed(1)}"/><text class="axis-text" x="${X0 - 5}" y="${(yOf(c) + 3.5).toFixed(1)}" text-anchor="end">${c}배</text>`; });
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        let dI = '', dR = '';
        for (let T = TA; T <= TB + 1e-9; T += 0.5) { const c = a.Th / (a.Th - K(T)); if (c <= CM * 1.02) dI += `${dI ? 'L' : 'M'}${xOf(T).toFixed(1)},${yOf(c).toFixed(1)} `; dR += `${dR ? 'L' : 'M'}${xOf(T).toFixed(1)},${yOf(c * REAL_FACTOR).toFixed(1)} `; }
        out += `<path class="trace" style="stroke:#d97706" d="${dI}"/><path class="trace faint" style="stroke:#97dad3" d="${dR}"/>`;
        out += `<line class="marker" x1="${xOf(OUTS[state.out].T).toFixed(1)}" y1="${Y1}" x2="${xOf(OUTS[state.out].T).toFixed(1)}" y2="${Y0}"/>`;
        out += `<circle fill="#d97706" stroke="#fff" cx="${xOf(OUTS[state.out].T).toFixed(1)}" cy="${yOf(a.cop).toFixed(1)}" r="4.5"/><circle fill="#97dad3" stroke="#fff" cx="${xOf(OUTS[state.out].T).toFixed(1)}" cy="${yOf(a.copReal).toFixed(1)}" r="3.5"/>`;
        out += `<text class="small-label" style="fill:#d97706" x="${(xOf(OUTS[state.out].T) + (OUTS[state.out].T >= 5 ? -8 : 8)).toFixed(1)}" y="${(clamp(yOf(a.cop), Y1 + 14, Y0) - 8).toFixed(1)}" text-anchor="${OUTS[state.out].T >= 5 ? 'end' : 'start'}">${OUTS[state.out].label}: ${fmtN(a.cop, 1)}배 (실제 ≈ ${fmtN(a.copReal, 1)}배)</text>`;
        out += `<text class="axis-title" x="${(X0 + X1) / 2}" y="${Y0 + 30}" text-anchor="middle">바깥 온도 — 추울수록 온도 차가 커져 전기 1 J로 나르는 열이 줄어듭니다</text>`;
        return out;
    }

    function noteFor(a) {
        if (a.kind === 'carnot') {
            return `<div class="data-row"><span class="data-name">온도</span><span class="data-val">T_h = ${fmtN(a.Th - 273.15)} ℃ = ${fmtN(a.Th, 1)} K, T_c = ${fmtN(a.Tc - 273.15)} ℃ = ${fmtN(a.Tc, 1)} K</span></div>` +
                `<div class="data-row"><span class="data-name">한 바퀴</span><span class="data-val">Q_h = RT_h ln2 = ${fmtN(a.Qh)} J, Q_c = RT_c ln2 = ${fmtN(a.Qc)} J, W = Q_h − Q_c = ${fmtN(a.W)} J</span></div>` +
                `<div class="data-row"><span class="data-name">효율</span><span class="data-val">W/Q_h = ${fmtN(a.W)} ÷ ${fmtN(a.Qh)} = ${fmtN(a.eta * 100, 1)} % = 1 − ${fmtN(a.Tc, 1)}/${fmtN(a.Th, 1)}</span></div>` +
                `<div class="data-row match"><span class="data-name">판정</span><span class="data-val">${{ low: '30 % 안', mid: '30~60 %', high: '60 % 넘게' }[a.verdict]}</span></div>`;
        }
        if (a.kind === 'flow') {
            return `<div class="data-row"><span class="data-name">에너지</span><span class="data-val">Q_h ${fmtN(Q_IN)} J = W ${fmtN(a.W)} J + Q_c ${fmtN(a.Qc)} J (제1법칙은 늘 성립)</span></div>` +
                `<div class="data-row"><span class="data-name">카르노 한계</span><span class="data-val">1 − ${fmtN(a.Tc, 1)}/${fmtN(a.Th, 1)} = ${fmtN(a.etaC * 100, 1)} % — 내세운 효율 ${fmtN(a.eta * 100)} %</span></div>` +
                `<div class="data-row"><span class="data-name">엔트로피</span><span class="data-val">Q_c/T_c − Q_h/T_h = ${fmtN(a.Qc)}/${fmtN(a.Tc, 1)} − ${fmtN(Q_IN)}/${fmtN(a.Th, 1)} = ${fmtN(a.dS, 2)} J/K ${a.dS >= -1e-9 ? '≥ 0' : '< 0 (제2법칙 위반)'}</span></div>` +
                `<div class="data-row match"><span class="data-name">판정</span><span class="data-val">${{ ok: '가능한 기관', over: '불가능 — 카르노 한계 넘음', perpetual: '불가능 — 2종 영구 기관' }[a.verdict]}</span></div>`;
        }
        return `<div class="data-row"><span class="data-name">온도</span><span class="data-val">바깥 T_c = ${fmtN(a.Tc, 1)} K, 실내 T_h = ${fmtN(a.Th, 1)} K, 차이 ${fmtN(a.Th - a.Tc, 1)} K</span></div>` +
            `<div class="data-row"><span class="data-name">성적 계수</span><span class="data-val">Q_h/W = T_h/(T_h − T_c) = ${fmtN(a.cop, 2)} → 전기 1 J로 바깥 열 ${fmtN(a.Qc, 2)} J을 퍼 와 집 안에 ${fmtN(a.cop, 2)} J</span></div>` +
            `<div class="data-row"><span class="data-name">실제 기기</span><span class="data-val">이상값의 3분의 1쯤 ≈ ${fmtN(a.copReal, 1)} (전기 난로는 늘 1)</span></div>` +
            `<div class="data-row match"><span class="data-name">판정</span><span class="data-val">${{ low: '10배 안', mid: '10~20배', high: '20배 넘게' }[a.verdict]}</span></div>`;
    }

    function render() {
        const a = analyse(), pump = a.kind === 'pump', invalid = a.kind === 'flow' && a.verdict !== 'ok';
        const cycle = a.kind === 'carnot' ? carnotState(a, state.progress >= 1 ? 1 - 1e-9 : state.progress) : null;
        mainGroup.innerHTML = window.ScienceScenes.engine(a, state, cycle);
        graphGroup.innerHTML = window.ScienceScenes.engineGraph(a, state);
        stageBadge.textContent = a.kind === 'carnot' ? HOTS[state.hot].label + ' / ' + COLDS[state.cold].label : pump ? OUTS[state.out].label + ' → ' + INS[state.inn].label : invalid ? '배출 열 없음 · 불가능' : '열의 일부를 일로';
        methodHint.textContent = pump ? '열을 옮기는 데 외부의 일이 필요합니다.' : '받은 열의 일부는 일로, 나머지는 저온 열원으로 이동합니다.';
        dataNote.innerHTML = '<p>' + (pump ? '실내로 전달한 열 = 바깥에서 가져온 열 + 공급한 일' : invalid ? '하나의 열원에서 받은 열을 전부 일로 바꾸는 순환 기관은 만들 수 없습니다.' : '고온에서 받은 열 = 한 일 + 저온으로 배출한 열') + '</p><p>' + (pump ? '막대는 선택한 두 온도에서의 이상적 열펌프를 비교한 값입니다. 실제 기기의 성능을 예측한 값이 아닙니다.' : a.kind === 'carnot' ? '막대는 한 주기의 에너지 배분입니다. 고온 열원을 높이거나 저온 열원을 낮추면 한계 효율이 증가합니다.' : '막대는 선택한 기관이 내세우는 에너지 배분입니다. 에너지의 합이 같더라도 모두 실현 가능한 것은 아닙니다.') + '</p>';
        liftProse();
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
        labelA.textContent='관찰';valueA.textContent=a.kind==='pump'?'일을 공급하여 열 이동':a.kind==='flow'&&state.eff==='e100'?'불가능한 기관':'열의 일부를 일로';
        labelB.textContent='에너지';valueB.textContent='보존됨';
        const answer=a.kind==='flow'&&state.eff==='e100'?'no':'yes';predictionResult.textContent=!state.prediction?'다음에는 먼저 예상해 보세요.':state.prediction===answer?'예상이 맞았습니다.':'예상과 다른 결과입니다.';
        explanation.textContent=a.kind==='pump'?'열펌프는 일을 공급받아 저온의 열을 고온으로 옮깁니다. 에너지를 새로 만드는 것이 아닙니다.':a.kind==='flow'?'순환 열기관은 받은 열을 모두 일로 바꿀 수 없습니다. 에너지 보존뿐 아니라 열역학 제2법칙도 만족해야 합니다.':'다른 열원의 온도를 고정하고 고온 열원을 높이거나 저온 열원을 낮추면 가역 기관의 한계 효율은 커집니다. 실제 기관은 비가역적인 과정 때문에 이보다 효율이 낮습니다.';
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
        checkBtn.textContent = state.mode === 'carnot' ? '한 바퀴 돌리기' : state.mode === 'flow' ? '열 흘려보내기' : '열펌프 돌리기';
        stageCaption.textContent = state.mode === 'carnot' ? '실린더 속 기체가 뜨거운 곳에서 열을 받아 팽창하고, 단열 팽창으로 식은 뒤, 차가운 곳에 열을 버리며 압축되고, 단열 압축으로 다시 더워지는 네 과정입니다.'
            : state.mode === 'flow' ? '위에서 받은 열이 기관에서 오른쪽의 일과 아래로 버리는 열로 갈라집니다. 화살표는 에너지의 이동 방향을 나타냅니다.'
                : '왼쪽 바깥에서 열을 퍼 올려 오른쪽 집 안에 보냅니다. 외부에서 일을 공급하여 열을 옮깁니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { hot: 'h500', cold: 'c20', eff: 'e40', pair: 'high', out: 'o0', inn: 'i18', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'carnot').click();
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

    window.__engineModel = {
        HOTS, COLDS, EFFS, PAIRS, OUTS, INS, state,
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
