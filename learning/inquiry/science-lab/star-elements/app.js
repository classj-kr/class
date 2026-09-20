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

    /* -------------------------------------------------------------- data */
    // Binding energy per nucleon, MeV (measured masses).
    const BINDING = [
        { sym: 'H', A: 1, be: 0, name: '수소' }, { sym: 'H', A: 2, be: 1.112 }, { sym: 'He', A: 3, be: 2.573 }, { sym: 'He', A: 4, be: 7.074, name: '헬륨' },
        { sym: 'Li', A: 7, be: 5.606 }, { sym: 'C', A: 12, be: 7.680, name: '탄소' }, { sym: 'N', A: 14, be: 7.476 }, { sym: 'O', A: 16, be: 7.976, name: '산소' },
        { sym: 'Ne', A: 20, be: 8.032 }, { sym: 'Mg', A: 24, be: 8.261 }, { sym: 'Si', A: 28, be: 8.448, name: '규소' }, { sym: 'S', A: 32, be: 8.493 },
        { sym: 'Ca', A: 40, be: 8.551 }, { sym: 'Fe', A: 56, be: 8.790, name: '철' }, { sym: 'Ni', A: 62, be: 8.795 }, { sym: 'Zn', A: 64, be: 8.736 },
        { sym: 'Kr', A: 84, be: 8.717 }, { sym: 'Sn', A: 120, be: 8.505 }, { sym: 'Ba', A: 138, be: 8.393 }, { sym: 'Pb', A: 208, be: 7.867, name: '납' }, { sym: 'U', A: 238, be: 7.570, name: '우라늄' },
    ];
    const beOf = (sym, A) => BINDING.find(b => b.sym === sym && b.A === A).be;
    const H_GAIN = 26.7 / 4;                     // MeV per nucleon when four protons make helium, neutrinos included
    const MEV_PER_NUCLEON_MASS = 931.5;
    const J_PER_KG_PER_MEV = 9.65e13;            // 1 MeV per nucleon, in joules per kilogram of fuel
    const COAL_J_PER_KG = 3.0e7;
    const COLOR = { H: '#dc2626', He: '#d97706', C: '#9fb6d9', O: '#0284c7', Mg: '#7c3aed', Si: '#c9a35f', Fe: '#e08a5c', Pb: '#475569' };
    // One burning stage each: fuel, ash, and where and how long it happens.
    const STEPS = {
        h: { label: '수소 → 헬륨', fuel: { sym: 'H', A: 1, n: 4, name: '수소' }, ash: { sym: 'He', A: 4, name: '헬륨' }, gain: H_GAIN, temp: '1,500만 K', where: '태양 같은 별의 중심', time25: '700만 년', timeSun: '100억 년' },
        he: { label: '헬륨 → 탄소', fuel: { sym: 'He', A: 4, n: 3, name: '헬륨' }, ash: { sym: 'C', A: 12, name: '탄소' }, gain: beOf('C', 12) - beOf('He', 4), temp: '1억 K', where: '붉은 거성의 중심', time25: '70만 년', timeSun: '약 1억 년' },
        c: { label: '탄소 → 마그네슘', fuel: { sym: 'C', A: 12, n: 2, name: '탄소' }, ash: { sym: 'Mg', A: 24, name: '마그네슘' }, gain: beOf('Mg', 24) - beOf('C', 12), temp: '6억 K', where: '태양의 8배 넘는 별', time25: '600년' },
        o: { label: '산소 → 규소', fuel: { sym: 'O', A: 16, n: 2, name: '산소' }, ash: { sym: 'Si', A: 28, name: '규소', extra: '(+ 헬륨)' }, gain: beOf('Si', 28) - beOf('O', 16), temp: '15억 K', where: '태양의 8배 넘는 별', time25: '6개월' },
        si: { label: '규소 → 철', fuel: { sym: 'Si', A: 28, n: 2, name: '규소' }, ash: { sym: 'Fe', A: 56, name: '철' }, gain: beOf('Fe', 56) - beOf('Si', 28), temp: '30억 K', where: '태양의 8배 넘는 별', time25: '하루' },
        fe: { label: '철 → 더 무거운 것', fuel: { sym: 'Fe', A: 56, n: 4, name: '철' }, ash: { sym: 'Pb', A: 208, name: '납 같은 무거운 원소' }, gain: beOf('Pb', 208) - beOf('Fe', 56), temp: '—', where: '별 속에서는 일어나지 않음', time25: '—' },
    };

    // Stars by mass: how long they live (10 Gyr × M^-2.5) and how far they burn.
    const STARS = {
        '0.3': { label: '태양의 0.3배', hint: '붉은 작은 별', stages: ['h'], end: 'he', lifeText: '약 2,000억 년', endText: '헬륨으로 된 백색 왜성이 되어 아주 천천히 식음' },
        '1': { label: '태양', hint: '지금의 태양', stages: ['h', 'he'], end: 'co', lifeText: '약 100억 년', endText: '바깥층을 행성상 성운으로 날리고 탄소·산소 백색 왜성이 됨' },
        '5': { label: '태양의 5배', hint: '흰 별', stages: ['h', 'he'], end: 'co', lifeText: '약 2억 년', endText: '바깥층을 날리고 탄소·산소 백색 왜성이 됨' },
        '25': { label: '태양의 25배', hint: '푸른 큰 별', stages: ['h', 'he', 'c', 'o', 'si'], end: 'sn', lifeText: '약 700만 년', endText: '철 중심이 무너져 초신성으로 터지고 중성자별(더 무거우면 블랙홀)이 남음' },
    };
    const lifeYears = m => 1e10 * Math.pow(m, -2.5);
    const LAYER_COLOR = { H: '#dc2626', He: '#d97706', C: '#9fb6d9', O: '#0284c7', Si: '#c9a35f', Fe: '#e08a5c' };

    // Where each element is found (mass %) and where it came from.
    const ORIGINS = {
        h: { sym: 'H', name: '수소', universe: 73.9, crust: 0.14, body: 9.5, origin: 'bigbang', how: '빅뱅 직후 몇 분 동안 만들어졌습니다' },
        he: { sym: 'He', name: '헬륨', universe: 24, crust: 0.0000008, body: 0, origin: 'bigbang', how: '대부분 빅뱅 직후에 만들어졌고, 조금은 별 속에서도 만들어집니다' },
        c: { sym: 'C', name: '탄소', universe: 0.46, crust: 0.02, body: 18.5, origin: 'star', how: '별 속 헬륨 핵융합으로 만들어져 태양 같은 별이 말년에 퍼뜨렸습니다' },
        o: { sym: 'O', name: '산소', universe: 1.04, crust: 46.6, body: 65, origin: 'star', how: '무거운 별 속 핵융합으로 만들어져 초신성이 퍼뜨렸습니다' },
        fe: { sym: 'Fe', name: '철', universe: 0.109, crust: 5.0, body: 0.006, origin: 'star', how: '무거운 별의 중심과 백색 왜성의 폭발에서 만들어졌습니다 — 별 속 핵융합의 끝입니다' },
        au: { sym: 'Au', name: '금', universe: 0.00000006, crust: 0.0000004, body: 0.0000003, origin: 'merger', how: '중성자별 충돌과 초신성에서 만들어졌습니다 — 철보다 무거워 핵융합으로는 못 만듭니다' },
    };
    const UNIVERSE = [['H', 73.9], ['He', 24.0], ['O', 1.04], ['C', 0.46], ['Ne', 0.134], ['Fe', 0.109], ['N', 0.096], ['Si', 0.065], ['Mg', 0.058], ['S', 0.044], ['Au', 0.00000006]];

    const state = {
        mode: 'fusion',
        step: 'h', star: '1', element: 'c',
        progress: 0, prediction: null,
    };
    let running = false, frameId = 0, lastStamp = 0;

    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const lerp = (a, b, t) => a + (b - a) * t;
    const fmtN = n => Math.round(n).toLocaleString('ko-KR');
    const fmtTons = kg => kg >= 1e7 ? `${(kg / 1e7).toFixed(1).replace(/\.0$/, '')}만 t` : kg >= 1e3 ? `${fmtN(kg / 1e3)} t` : `${fmtN(kg)} kg`;
    const jong = w => { const c = w.charCodeAt(w.length - 1); return c >= 0xac00 && c <= 0xd7a3 ? (c - 0xac00) % 28 : -1; };
    const pEun = w => jong(w) > 0 ? '은' : '는', pIga = w => jong(w) > 0 ? '이' : '가';
    const eulOf = txt => /g$/.test(txt) ? '을' : '를';          // 그램·밀리그램 → 을, 퍼센트 → 를
    const beText = be => be === 0 ? '0' : `${be.toFixed(2)} MeV`;
    // a share of mass: percent when it is large, milligrams (or grams) per tonne when tiny
    const fmtShare = pct => pct === 0 ? '거의 없음' : pct >= 10 ? `${Math.round(pct)} %` : pct >= 1 ? `${pct.toFixed(1)} %` : pct >= 0.01 ? `${pct.toFixed(2)} %` : (() => { const mg = pct * 1e7; return mg >= 1000 ? `1 t에 ${fmtN(mg / 1000)} g` : `1 t에 ${mg < 10 ? mg.toFixed(1) : fmtN(mg)} mg`; })();
    const shortShare = pct => fmtShare(pct).replace(/^1 t에 (.*)$/, '$1/t');

    /* ------------------------------------------------------------ models */
    function analyse() {
        if (state.mode === 'fusion') {
            const st = STEPS[state.step];
            const ratio = st.gain / H_GAIN * 100;
            const massPct = st.gain / MEV_PER_NUCLEON_MASS * 100;
            const jPerKg = st.gain * J_PER_KG_PER_MEV;
            const verdict = ratio >= 50 ? 'lots' : ratio >= 6 ? 'tenth' : ratio > 0 ? 'little' : 'costs';
            return { kind: 'fusion', st, ratio, massPct, jPerKg, coalKg: jPerKg / COAL_J_PER_KG, verdict };
        }
        if (state.mode === 'mass') {
            const star = STARS[state.star];
            return { kind: 'mass', star, m: Number(state.star), life: lifeYears(Number(state.star)), verdict: star.end };
        }
        const el = ORIGINS[state.element];
        return { kind: 'origin', el, verdict: el.origin };
    }
    const runSeconds = () => state.mode === 'fusion' ? 6 : state.mode === 'mass' ? 8 : 6;

    /* ---------------------------------------------------------- controls */
    function pickRow(legend, name, options, current, cols) {
        return `<fieldset class="pick-field"><legend>${legend}</legend>` +
            `<div class="pick-buttons cols${cols}" data-pick="${name}">` +
            options.map(o => `<button type="button" data-value="${o.value}" class="${o.value === String(current) ? 'selected' : ''}">` +
                `${o.label}${o.hint ? `<small>${o.hint}</small>` : ''}</button>`).join('') +
            `</div></fieldset>`;
    }

    function buildControls() {
        if (state.mode === 'fusion') {
            controlArea.innerHTML = pickRow('합쳐지는 원자핵', 'step', Object.entries(STEPS).filter(([k])=>['h','he'].includes(k)).map(([k,v])=>({value:k,label:v.label})), state.step, 3);
        } else if (state.mode === 'mass') {
            controlArea.innerHTML = pickRow('별의 질량', 'star', Object.entries(STARS).map(([k, v]) => ({ value: k, label: v.label, hint: v.hint })), state.star, 4);
        } else {
            controlArea.innerHTML = pickRow('원소', 'element', Object.entries(ORIGINS).map(([k, v]) => ({ value: k, label: `${v.name} ${v.sym}` })), state.element, 3);
        }
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                buildPrediction();
                settingsChanged();
            }));
        });
    }

    const PRED_FUSION = [
        { value: 'lots', label: '수소 때와 비슷하게 많이' }, { value: 'tenth', label: '수소 때의 10분의 1쯤' },
        { value: 'little', label: '수소 때의 20분의 1쯤 이하' }, { value: 'costs', label: '오히려 에너지가 들어간다' },
    ];
    const PRED_MASS = [{ value: 'he', label: '헬륨까지' }, { value: 'co', label: '탄소·산소까지' }, { value: 'sn', label: '철까지 만들고 초신성으로 더 무거운 원소를' }];
    const PRED_ORIGIN = [{ value: 'bigbang', label: '빅뱅 직후 몇 분 동안' }, { value: 'star', label: '별 속 핵융합에서' }, { value: 'merger', label: '초신성이나 중성자별 충돌에서' }];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list=state.mode==='fusion'?[{value:'yes',label:'에너지 방출'},{value:'no',label:'에너지가 전혀 나오지 않음'}]:state.mode==='mass'?PRED_MASS:PRED_ORIGIN;
        predictionLegend.textContent=state.mode==='fusion'?'이 핵융합 과정에서는?':state.mode==='mass'?'이 별에서 생성되는 원소를 예상하세요.':'이 원소의 주요 생성 과정을 고르세요.';
        predictionArea.innerHTML=list.map(o=>'<button type="button" data-prediction="'+o.value+'">'+o.label+'</button>').join('');
        predictionArea.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{state.prediction=b.dataset.prediction; window.scienceInvalidatePrediction?.();predictionArea.querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===b));}));
    }

    /* ----------------------------------------------------------- visuals */
    const nucR = A => 5 + 2.3 * Math.cbrt(A);
    function nucleus(cx, cy, sym, A, opacity = 1, labelOpacity = opacity) {
        const r = nucR(A);
        let out = `<circle class="nucleus" fill="${COLOR[sym] || '#475569'}" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" opacity="${opacity}"/>`;
        // a few of the protons and neutrons, drawn inside
        const dots = Math.min(7, A);
        for (let k = 0; k < dots; k += 1) {
            const ang = k * 2.4, rr = A === 1 ? 0 : (r - 3) * (0.35 + 0.5 * ((k * 7) % 3) / 2);
            out += `<circle class="${k % 2 ? 'neutron' : 'proton'}" cx="${(cx + rr * Math.cos(ang)).toFixed(1)}" cy="${(cy + rr * Math.sin(ang)).toFixed(1)}" r="1.6" opacity="${opacity}"/>`;
        }
        if (labelOpacity > 0.02) out += `<text class="nucleus-label" x="${cx.toFixed(1)}" y="${(cy + r + 11).toFixed(1)}" text-anchor="middle" opacity="${labelOpacity.toFixed(2)}">${sym}-${A}</text>`;
        return out;
    }

    function renderFusion(a) {
        const { st } = a;
        const p = state.progress;
        const t1 = clamp(p / 0.5, 0, 1), flash = clamp((p - 0.5) / 0.15, 0, 1), t3 = clamp((p - 0.6) / 0.4, 0, 1);
        const CX = 150, CY = 104;
        let out = '';
        const n = st.fuel.n;
        for (let k = 0; k < n; k += 1) {
            const ang = -Math.PI / 2 + k * 2 * Math.PI / n;
            const sx = CX + 62 * Math.cos(ang), sy = CY + 46 * Math.sin(ang);
            const ex = CX + 9 * Math.cos(ang), ey = CY + 9 * Math.sin(ang);
            out += nucleus(lerp(sx, ex, t1), lerp(sy, ey, t1), st.fuel.sym, st.fuel.A, 1 - t3, (1 - t1) * (1 - t3));
        }
        if (flash > 0 && st.gain > 0) out += `<circle class="glow" cx="${CX}" cy="${CY}" r="${(10 + 40 * Math.sin(flash * Math.PI) * Math.min(1, 0.4 + a.ratio / 100)).toFixed(1)}" opacity="${(0.55 * Math.sin(flash * Math.PI)).toFixed(2)}"/>`;
        if (t3 > 0) out += nucleus(CX, CY, st.ash.sym, st.ash.A, t3, clamp((t3 - 0.5) * 2, 0, 1));
        if (t3 > 0.3) {
            if (st.gain > 0) {
                for (let k = 0; k < 6; k += 1) {
                    const ang = k * Math.PI / 3 + 0.3, d = 22 + 40 * t3;
                    out += `<line class="ray" style="stroke:#d97706;stroke-width:1.4" x1="${(CX + 22 * Math.cos(ang)).toFixed(1)}" y1="${(CY + 22 * Math.sin(ang)).toFixed(1)}" x2="${(CX + d * Math.cos(ang)).toFixed(1)}" y2="${(CY + d * Math.sin(ang)).toFixed(1)}" opacity="${(1 - t3 * 0.6).toFixed(2)}"/>`;
                }
                out += `<text class="energy-text" x="${CX}" y="196" text-anchor="middle">빛과 열이 나옴 — 질량 ${a.massPct.toFixed(a.massPct < 0.1 ? 3 : 2)} % 줄어듦</text>`;
            } else {
                out += `<text class="energy-in" x="${CX}" y="196" text-anchor="middle">에너지를 넣어야 합쳐짐 — 질량이 ${Math.abs(a.massPct).toFixed(2)} % 늘어남</text>`;
            }
        } else if (p === 0) {
            out += `<text class="trait-text" x="${CX}" y="196" text-anchor="middle">${st.fuel.name} 원자핵 ${n}개가 만나면?</text>`;
        }
        // facts
        const IX = 300;
        out += `<text class="trait-text" x="${IX}" y="46">필요한 온도 ${st.temp}</text>`;
        out += `<text class="trait-text" x="${IX}" y="62">어디서: ${st.where}</text>`;
        out += `<text class="trait-text" x="${IX}" y="78">${st.time25 === '—' ? '별 속에서는 이어지지 않음' : `25배 무거운 별에서 이 단계: ${st.time25}`}</text>`;
        if (t3 > 0.3) {
            out += `<text class="trait-text" style="fill:#d97706" x="${IX}" y="104">연료 1 kg에서 ${st.gain > 0 ? `${(a.jPerKg / 1e12).toFixed(a.jPerKg < 1e14 ? 0 : 0)}조 J` : '에너지가 나오지 않음'}</text>`;
            if (st.gain > 0) out += `<text class="trait-text" style="fill:#d97706" x="${IX}" y="120">= 석탄 ${fmtTons(a.coalKg)} 태우는 것</text>`;
            out += `<text class="trait-text" style="fill:#d97706" x="${IX}" y="140">수소 → 헬륨 때의 ${st.gain > 0 ? `${a.ratio >= 50 ? Math.round(a.ratio) : a.ratio.toFixed(1)} %` : '반대 방향'}</text>`;
            out += `<text class="trait-text" x="${IX}" y="156">핵자 하나에 ${st.gain > 0 ? '+' : ''}${st.gain.toFixed(2)} MeV</text>`;
        }
        const VERD = { lots: '수소 때와 비슷하게 많이', tenth: '수소 때의 10분의 1쯤', little: '수소 때의 20분의 1쯤 이하', costs: '오히려 에너지가 들어감' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${p >= 1 ? `${st.label}: ${VERD[a.verdict]}` : `${st.label} — ${st.fuel.name} ${n}개가 ${st.ash.name} ${st.ash.extra || ''}1개로`}</text>`;
        out += `<text class="note-text" x="20" y="208">${st.gain > 0 ? '원자핵이 더 단단히 묶이면 그만큼 질량이 줄고, 줄어든 질량이 에너지가 됩니다' : '철은 원자핵이 가장 단단히 묶여 있어 더 합치면 오히려 에너지가 듭니다'}</text>`;
        return out;
    }

    // how tightly each nucleus is bound, and the step just taken
    function graphFusion(a) {
        const { st } = a;
        const X0 = 50, X1 = 430, Y0 = 150, Y1 = 40;
        const xOf = A => X0 + Math.log10(A) / Math.log10(250) * (X1 - X0), yOf = be => Y0 - be / 9 * (Y0 - Y1);
        let out = `<text class="axis-title" x="${X0}" y="18">원자핵 알갱이 하나를 묶는 에너지 (MeV) — 높을수록 단단히 묶임</text>`;
        for (let be = 0; be <= 9; be += 3) { out += `<line class="grid-line" x1="${X0}" y1="${yOf(be).toFixed(1)}" x2="${X1}" y2="${yOf(be).toFixed(1)}"/><text class="axis-text" x="${X0 - 6}" y="${(yOf(be) + 3.5).toFixed(1)}" text-anchor="end">${be}</text>`; }
        [1, 4, 12, 28, 56, 120, 238].forEach(A => { out += `<text class="axis-text" x="${xOf(A).toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${A}</text>`; });
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        out += `<path class="trace" d="${BINDING.filter(b => b.A !== 3 && b.A !== 7 && b.A !== 14).map((b, i) => `${i ? 'L' : 'M'}${xOf(b.A).toFixed(1)},${yOf(b.be).toFixed(1)}`).join(' ')}"/>`;
        BINDING.forEach(b => { out += `<circle class="trace-dot" fill="${COLOR[b.sym] || '#475569'}" cx="${xOf(b.A).toFixed(1)}" cy="${yOf(b.be).toFixed(1)}" r="2.6"/>`; });
        const LABELS = [['H', 1, 8, 4, 'start'], ['He', 4, 0, -8, 'middle'], ['C', 12, -4, 12, 'end'], ['O', 16, 4, -8, 'start'], ['Si', 28, 0, -9, 'middle'], ['Fe', 56, 0, -9, 'middle'], ['Pb', 208, 0, 14, 'middle'], ['U', 238, 4, 14, 'start']];
        LABELS.forEach(([sym, A, dx, dy, anchor]) => { const b = BINDING.find(x => x.sym === sym && x.A === A); out += `<text class="axis-text" style="fill:#0f172a" x="${(xOf(A) + dx).toFixed(1)}" y="${(yOf(b.be) + dy).toFixed(1)}" text-anchor="${anchor}">${b.name}${sym === 'Fe' ? ' — 가장 단단함' : ''}</text>`; });
        // the step: from fuel to ash
        const fx = xOf(st.fuel.A), fy = yOf(beOf(st.fuel.sym, st.fuel.A)), ax = xOf(st.ash.A), ay = yOf(beOf(st.ash.sym, st.ash.A));
        const f = clamp(state.progress / 0.6, 0, 1);
        const mx = lerp(fx, ax, f), my = lerp(fy, ay, f);
        out += `<line class="step-arrow" x1="${fx.toFixed(1)}" y1="${fy.toFixed(1)}" x2="${mx.toFixed(1)}" y2="${my.toFixed(1)}"/>`;
        out += `<circle class="trace-dot chosen" fill="#d97706" cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="4.5"/>`;
        out += `<text class="axis-title" x="${((X0 + X1) / 2).toFixed(1)}" y="${Y0 + 30}" text-anchor="middle">원자핵 알갱이 수 — 노란 화살표가 ${st.label}${st.gain > 0 ? ' (위로 = 에너지 나옴)' : ' (아래로 = 에너지 들어감)'}</text>`;
        return out;
    }

    function renderMass(a) {
        const { star } = a;
        const p = state.progress;
        const stages = star.stages;
        const segs = stages.length + 1;                                  // one screen-segment per stage, then the ending
        const idx = Math.min(segs - 1, Math.floor(p * segs)), within = p * segs - idx;
        const CX = 150, CY = 108;
        const R = { '0.3': 44, '1': 56, '5': 66, '25': 78 }[state.star];
        const ending = idx === stages.length && p > 0;
        const endT = ending ? within : 0;
        let out = '';
        const shellOrder = ['H', 'He', 'C', 'O', 'Si', 'Fe'];
        // layers made so far: each finished stage leaves its ash as a new core
        const doneStages = p === 0 ? 0 : Math.min(stages.length, idx + (within >= 0.999 ? 1 : 0));
        const ashOf = { h: 'He', he: 'C', c: 'O', o: 'Si', si: 'Fe' };
        const cores = ['H'];
        for (let k = 0; k < stages.length; k += 1) if (k < idx || (k === idx && !ending && within > 0.5) || ending) cores.push(ashOf[stages[k]]);
        if (ending && star.end === 'sn') {
            const rr = R * (1 - 0.7 * Math.min(1, endT * 2));
            if (endT < 0.5) cores.forEach((sym, i) => { const r = rr * (1 - i / cores.length); out += `<circle class="layer" fill="${LAYER_COLOR[sym]}" cx="${CX}" cy="${CY}" r="${r.toFixed(1)}"/>`; });
            else {
                const burst = (endT - 0.5) * 2;
                for (let k = 0; k < 12; k += 1) { const ang = k * Math.PI / 6; out += `<line class="ray" x1="${(CX + 14 * Math.cos(ang)).toFixed(1)}" y1="${(CY + 14 * Math.sin(ang)).toFixed(1)}" x2="${(CX + (14 + 90 * burst) * Math.cos(ang)).toFixed(1)}" y2="${(CY + (14 + 90 * burst) * Math.sin(ang)).toFixed(1)}" opacity="${(1 - burst * 0.7).toFixed(2)}"/>`; }
                out += `<circle class="remnant" cx="${CX}" cy="${CY}" r="6"/>`;
                out += `<text class="trait-text" style="fill:#d97706" x="${CX}" y="${CY + 22}" text-anchor="middle">중성자별</text>`;
                ['금', '은', '우라늄', '납'].forEach((nm, k) => { const ang = k * Math.PI / 2 + 0.6, d = 30 + 70 * burst; out += `<text class="trait-text" style="fill:#d97706" x="${(CX + d * Math.cos(ang)).toFixed(1)}" y="${(CY + d * Math.sin(ang) + 3).toFixed(1)}" text-anchor="middle" opacity="${burst.toFixed(2)}">${nm}</text>`; });
            }
        } else if (ending) {
            // the outer layers drift off; a small white dwarf stays
            const rr = R * (1 - 0.8 * endT);
            out += `<circle class="star-glow" cx="${CX}" cy="${CY}" r="${(R + 30 * endT).toFixed(1)}" opacity="${(0.6 - 0.5 * endT).toFixed(2)}"/>`;
            cores.forEach((sym, i) => { const r = Math.max(6, rr * (1 - i / cores.length)); out += `<circle class="layer" fill="${LAYER_COLOR[sym]}" cx="${CX}" cy="${CY}" r="${r.toFixed(1)}"/>`; });
            if (endT > 0.6) out += `<text class="trait-text" style="fill:#d97706" x="${CX}" y="${CY + 24}" text-anchor="middle">백색 왜성 (${star.end === 'he' ? '헬륨' : '탄소·산소'})</text>`;
        } else {
            out += `<circle class="star-glow" cx="${CX}" cy="${CY}" r="${R + 10}"/>`;
            cores.forEach((sym, i) => { const r = R * (1 - i / (cores.length + 0.4)); out += `<circle class="layer" fill="${LAYER_COLOR[sym]}" cx="${CX}" cy="${CY}" r="${r.toFixed(1)}"/>`; });
            // layer names down the right side of the star
            cores.forEach((sym, i) => { const r = R * (1 - i / (cores.length + 0.4)), rIn = i + 1 < cores.length ? R * (1 - (i + 1) / (cores.length + 0.4)) : 0; out += `<text class="layer-text" x="${CX}" y="${(CY - (r + rIn) / 2 + 3).toFixed(1)}" text-anchor="middle">${sym}</text>`; });
        }
        // facts
        const IX = 300;
        const stageNow = p === 0 ? null : ending ? null : STEPS[stages[idx]];
        out += `<text class="trait-text" x="${IX}" y="46">질량: ${star.label}</text>`;
        out += `<text class="trait-text" x="${IX}" y="60">수명 ${star.lifeText}</text>`;
        out += `<text class="trait-text" x="${IX}" y="76">지금: ${p === 0 ? '태어난 별 (수소로 가득)' : ending ? '연료가 끝남' : `${stageNow.label} 핵융합`}</text>`;
        if (stageNow) out += `<text class="trait-text" x="${IX}" y="90">중심 온도 ${stageNow.temp}</text>`;
        out += `<text class="trait-text" x="${IX}" y="110">만든 원소:</text>`;
        const made = p === 0 ? '—' : cores.slice(1).map(s => ({ He: '헬륨', C: '탄소', O: '산소', Si: '규소', Fe: '철' }[s])).join('·') || '—';
        out += `<text class="trait-text" style="fill:#d97706" x="${IX}" y="124">${made}</text>`;
        if (ending && star.end === 'sn' && endT > 0.5) out += `<text class="trait-text" style="fill:#d97706" x="${IX}" y="138">+ 철보다 무거운 원소</text>`;
        if (ending && endT > 0.6) { const words = star.endText.match(/.{1,15}/g); words.forEach((w, i) => { out += `<text class="trait-text" x="${IX}" y="${156 + i * 13}">${w}</text>`; }); }
        const VERD = { he: '헬륨까지', co: '탄소·산소까지', sn: '철까지, 초신성으로 더 무거운 원소' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${p >= 1 ? `${star.label}: ${VERD[star.end]} · 수명 ${star.lifeText}` : `${star.label}의 일생 (${star.hint})`}</text>`;
        out += `<text class="note-text" x="20" y="208">단계마다 같은 시간을 준 그림 — 실제로는 수소 단계가 수명의 90 %, 마지막 단계들은 며칠에서 몇 해</text>`;
        return out;
    }

    // how long stars live against their mass
    function graphMass(a) {
        const X0 = 70, X1 = 430, Y0 = 150, Y1 = 40;
        const xOf = m => X0 + (Math.log10(m) + 1) / 3 * (X1 - X0), yOf = yr => Y0 - (Math.log10(yr) - 6) / 6 * (Y0 - Y1);
        let out = `<text class="axis-title" x="${X0}" y="18">별의 수명 — 무거울수록 연료를 훨씬 빨리 써서 짧게 산다</text>`;
        [[1e6, '100만 년'], [1e8, '1억 년'], [1e10, '100억 년'], [1e12, '1조 년']].forEach(([yr, lab]) => { out += `<line class="grid-line" x1="${X0}" y1="${yOf(yr).toFixed(1)}" x2="${X1}" y2="${yOf(yr).toFixed(1)}"/><text class="axis-text" x="${X0 - 6}" y="${(yOf(yr) + 3.5).toFixed(1)}" text-anchor="end">${lab}</text>`; });
        [0.1, 1, 10, 100].forEach(m => { out += `<text class="axis-text" x="${xOf(m).toFixed(1)}" y="${Y0 + 17}" text-anchor="middle">${m}</text>`; });
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        let d = '';
        for (let lg = -1; lg <= 2.0001; lg += 0.1) { const m = 10 ** lg; d += `${d ? 'L' : 'M'}${xOf(m).toFixed(1)},${clamp(yOf(lifeYears(m)), Y1, Y0).toFixed(1)} `; }
        out += `<path class="life-line" d="${d}"/>`;
        Object.entries(STARS).forEach(([k, s]) => {
            const m = Number(k), mine = k === state.star;
            out += `<circle class="trace-dot ${mine ? 'chosen' : ''}" fill="${mine ? '#d97706' : '#475569'}" cx="${xOf(m).toFixed(1)}" cy="${yOf(lifeYears(m)).toFixed(1)}" r="${mine ? 5 : 3.5}"/>`;
            out += `<text class="axis-text" style="fill:${mine ? '#d97706' : '#475569'}" x="${(xOf(m) + 8).toFixed(1)}" y="${(yOf(lifeYears(m)) - 6).toFixed(1)}">${s.label} ${s.lifeText.replace('약 ', '')}</text>`;
        });
        out += `<text class="axis-title" x="${((X0 + X1) / 2).toFixed(1)}" y="${Y0 + 33}" text-anchor="middle">질량 (태양의 몇 배) — 질량이 10배면 수명은 약 300분의 1</text>`;
        return out;
    }

    function renderOrigin(a) {
        const { el } = a;
        const p = state.progress;
        const CX = 150, CY = 104;
        let out = '';
        if (p > 0) {
            if (el.origin === 'bigbang') {
                for (let k = 0; k < 4; k += 1) { const r = ((p * 1.2 + k * 0.25) % 1) * 80; out += `<circle class="scene-ring" cx="${CX}" cy="${CY}" r="${r.toFixed(1)}" opacity="${(1 - r / 80).toFixed(2)}"/>`; }
                out += `<circle class="glow" cx="${CX}" cy="${CY}" r="${(6 + 6 * Math.sin(p * 6)).toFixed(1)}"/>`;
                for (let k = 0; k < 8; k += 1) { const ang = k * Math.PI / 4 + 0.4, d = 24 + 56 * ((p + k * 0.125) % 1); out += `<text class="trait-text" style="fill:#d97706" x="${(CX + d * Math.cos(ang)).toFixed(1)}" y="${(CY + d * Math.sin(ang) * 0.7 + 3).toFixed(1)}" text-anchor="middle">${k % 4 === 0 ? 'He' : 'H'}</text>`; }
                out += `<text class="trait-text" x="${CX}" y="188" text-anchor="middle">우주가 태어난 뒤 3분 — 수소 원자핵 12개마다 헬륨 1개</text>`;
            } else if (el.origin === 'star') {
                const R = 44;
                out += `<circle class="star-glow" cx="${CX}" cy="${CY}" r="${R + 14}"/>`;
                out += `<circle class="layer" fill="${LAYER_COLOR.H}" cx="${CX}" cy="${CY}" r="${R}"/><circle class="layer" fill="${LAYER_COLOR.He}" cx="${CX}" cy="${CY}" r="${R * 0.66}"/>`;
                out += `<circle class="layer" fill="${COLOR[el.sym] || '#475569'}" cx="${CX}" cy="${CY}" r="${R * 0.34}"/><text class="nucleus-label" x="${CX}" y="${CY + 3.5}" text-anchor="middle">${el.sym}</text>`;
                if (p > 0.5) { const f = (p - 0.5) * 2; for (let k = 0; k < 8; k += 1) { const ang = k * Math.PI / 4 + 0.2, d = R + 14 + 32 * f; out += `<text class="trait-text" style="fill:#d97706" x="${(CX + d * Math.cos(ang)).toFixed(1)}" y="${(CY + d * Math.sin(ang) * 0.7 + 3).toFixed(1)}" text-anchor="middle" opacity="${(1 - f * 0.5).toFixed(2)}">${el.sym}</text>`; } }
                out += `<text class="trait-text" x="${CX}" y="188" text-anchor="middle">${p > 0.5 ? '별이 죽으며 만든 원소를 우주에 뿌림' : '별 속에서 핵융합으로 만들어짐'}</text>`;
            } else {
                if (p < 0.55) {
                    const f = p / 0.55, ang = f * 6 * Math.PI, d = 50 * (1 - f) + 6;
                    out += `<circle class="small-star" cx="${(CX + d * Math.cos(ang)).toFixed(1)}" cy="${(CY + d * Math.sin(ang) * 0.6).toFixed(1)}" r="7"/><circle class="small-star" cx="${(CX - d * Math.cos(ang)).toFixed(1)}" cy="${(CY - d * Math.sin(ang) * 0.6).toFixed(1)}" r="7"/>`;
                    out += `<text class="trait-text" x="${CX}" y="188" text-anchor="middle">중성자별 두 개가 서로 돌며 다가감</text>`;
                } else {
                    const f = (p - 0.55) / 0.45;
                    out += `<circle class="glow" cx="${CX}" cy="${CY}" r="${(8 + 30 * Math.sin(Math.min(1, f * 1.5) * Math.PI)).toFixed(1)}" opacity="${(0.8 - 0.5 * f).toFixed(2)}"/>`;
                    ['Au', 'Ag', 'Pt', 'U', 'Au', 'Ag'].forEach((sym, k) => { const ang = k * Math.PI / 3 + 0.5, d = 30 + 56 * f; out += `<text class="trait-text" style="fill:#d97706" x="${(CX + d * Math.cos(ang)).toFixed(1)}" y="${(CY + d * Math.sin(ang) * 0.7 + 3).toFixed(1)}" text-anchor="middle">${sym}</text>`; });
                    out += `<text class="trait-text" x="${CX}" y="188" text-anchor="middle">충돌 순간 중성자가 쏟아져 철보다 무거운 원소가 됨</text>`;
                }
            }
        } else {
            out += `<circle class="star-glow" cx="${CX}" cy="${CY}" r="40"/><text class="gen-text" x="${CX}" y="${CY + 4}" text-anchor="middle">${el.sym}</text>`;
            out += `<text class="trait-text" x="${CX}" y="188" text-anchor="middle">${el.name}${pEun(el.name)} 어디에서 만들어졌을까요?</text>`;
        }
        // where it is found: three bars, each step up ten times more
        const BX = 316, BY0 = 160, BY1 = 54, BW = 26;
        const yOf = pct => pct <= 0 ? BY0 : BY0 - (Math.log10(pct) + 8) / 10 * (BY0 - BY1);
        [['우주', el.universe], ['지각', el.crust], ['사람 몸', el.body]].forEach(([nm, v], i) => {
            const x = BX + i * 46;
            out += `<rect class="share-bar" fill="${i === 0 ? '#475569' : i === 1 ? '#c9a35f' : '#dc2626'}" x="${x}" y="${yOf(v).toFixed(1)}" width="${BW}" height="${(BY0 - yOf(v)).toFixed(1)}" rx="2"/>`;
            out += `<text class="small-label" x="${x + BW / 2}" y="${(yOf(v) - 4).toFixed(1)}" text-anchor="middle">${shortShare(v)}</text>`;
            out += `<text class="trait-text" x="${x + BW / 2}" y="${BY0 + 13}" text-anchor="middle">${nm}</text>`;
        });
        out += `<text class="small-label" x="${BX + 69}" y="${BY0 + 26}" text-anchor="middle">질량 비율 (한 칸 = 10배)</text>`;
        out += `<text class="small-label" x="${BX + 69}" y="34" text-anchor="middle">${el.name}${pIga(el.name)} 있는 곳</text>`;
        const VERD = { bigbang: '빅뱅 직후에', star: '별 속 핵융합에서', merger: '초신성·중성자별 충돌에서' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${p >= 1 ? `${el.name}(${el.sym})의 고향: ${VERD[el.origin]}` : `${el.name}(${el.sym})은 어디에서 왔나`}</text>`;
        out += `<text class="note-text" x="20" y="208">${el.how}</text>`;
        return out;
    }

    function graphOrigin(a) {
        const X0 = 60, X1 = 430, Y0 = 150, Y1 = 40;
        const yOf = pct => Y0 - (Math.log10(pct) + 8) / 10 * (Y0 - Y1);
        let out = `<text class="axis-title" x="${X0}" y="18">우주에 있는 원소 (질량 %) — 한 칸 = 10배</text>`;
        [[100, '100 %'], [1, '1 %'], [0.01, '0.01 %'], [0.0001, '만분의 1 %'], [0.000001, '백만분의 1 %'], [0.00000001, '1억분의 1 %']].forEach(([v, lab]) => { out += `<line class="grid-line" x1="${X0}" y1="${yOf(v).toFixed(1)}" x2="${X1}" y2="${yOf(v).toFixed(1)}"/><text class="axis-text" x="${X0 - 6}" y="${(yOf(v) + 3.5).toFixed(1)}" text-anchor="end">${lab}</text>`; });
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/>`;
        const step = (X1 - X0) / UNIVERSE.length, W = 22;
        UNIVERSE.forEach(([sym, v], n) => {
            const x = X0 + n * step + (step - W) / 2, mine = sym === a.el.sym;
            out += `<rect class="bar ${mine ? 'chosen' : ''}" fill="${COLOR[sym] || '#475569'}" opacity="${mine ? 1 : 0.55}" x="${x.toFixed(1)}" y="${yOf(v).toFixed(1)}" width="${W}" height="${(Y0 - yOf(v)).toFixed(1)}" rx="2"/>`;
            out += `<text class="axis-text" style="fill:${mine ? '#0f172a' : '#475569'};font-weight:${mine ? '900' : '750'}" x="${(x + W / 2).toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${sym}</text>`;
        });
        out += `<text class="axis-title" x="${((X0 + X1) / 2).toFixed(1)}" y="${Y0 + 32}" text-anchor="middle">수소와 헬륨이 98 % — 나머지 모든 원소는 별이 만든 2 %</text>`;
        return out;
    }

    function noteFor(a) {
        if (a.kind === 'fusion') {
            const { st } = a;
            return `<div class="data-row"><span class="data-name">반응</span><span class="data-val">${st.fuel.name}(${st.fuel.sym}-${st.fuel.A}) ${st.fuel.n}개 → ${st.ash.name}(${st.ash.sym}-${st.ash.A}) ${st.ash.extra || ''} · ${st.temp === '—' ? '별 속에서는 일어나지 않음' : `${st.temp}, ${st.where}`}</span></div>` +
                `<div class="data-row"><span class="data-name">묶는 에너지</span><span class="data-val">핵자 하나에 ${beOf(st.fuel.sym, st.fuel.A).toFixed(2)} → ${beOf(st.ash.sym, st.ash.A).toFixed(2)} MeV (${st.gain > 0 ? '+' : ''}${st.gain.toFixed(2)})</span></div>` +
                `<div class="data-row"><span class="data-name">질량 변화</span><span class="data-val">${a.massPct > 0 ? '−' : '+'}${Math.abs(a.massPct).toFixed(3)} % → 연료 1 kg에서 ${st.gain > 0 ? `${(a.jPerKg / 1e12).toFixed(0)}조 J (석탄 ${fmtTons(a.coalKg)})` : '에너지가 나오지 않음'}</span></div>` +
                `<div class="data-row match"><span class="data-name">수소 때와 견줌</span><span class="data-val">${st.gain > 0 ? `${a.ratio >= 50 ? Math.round(a.ratio) : a.ratio.toFixed(1)} %` : '반대 방향 (에너지 들어감)'}${st.time25 !== '—' ? ` · 25배 별에서 이 단계 ${st.time25}` : ''}</span></div>`;
        }
        if (a.kind === 'mass') {
            const { star } = a;
            return `<div class="data-row"><span class="data-name">별</span><span class="data-val">${star.label} (${star.hint}) · 수명 ${star.lifeText} (10 Gyr × 질량^−2.5)</span></div>` +
                `<div class="data-row"><span class="data-name">핵융합 단계</span><span class="data-val">${star.stages.map(k => STEPS[k].label).join(' → ')}</span></div>` +
                `<div class="data-row"><span class="data-name">마지막</span><span class="data-val">${star.endText}</span></div>` +
                `<div class="data-row match"><span class="data-name">만드는 원소</span><span class="data-val">${{ he: '헬륨까지', co: '탄소·산소까지 (탄소 핵융합에는 6억 K가 필요해 못 감)', sn: '철까지 만들고, 초신성 폭발에서 철보다 무거운 원소까지' }[star.end]}</span></div>`;
        }
        const { el } = a;
        return `<div class="data-row"><span class="data-name">원소</span><span class="data-val">${el.name} ${el.sym}</span></div>` +
            `<div class="data-row"><span class="data-name">있는 곳</span><span class="data-val">우주 ${fmtShare(el.universe)} · 지각 ${fmtShare(el.crust)} · 사람 몸 ${fmtShare(el.body)}</span></div>` +
            `<div class="data-row"><span class="data-name">고향</span><span class="data-val">${el.how}</span></div>` +
            `<div class="data-row match"><span class="data-name">우주 전체</span><span class="data-val">수소 73.9 % · 헬륨 24 % · 나머지 2.1 % (산소 1.0, 탄소 0.46, 네온 0.13, 철 0.11 …)</span></div>`;
    }

    function render() {
        const a=analyse(),p=state.progress;
        let text='',drawing='',label='';
        if(a.kind==='fusion'){
            const st=a.st;
            drawing=window.ScienceScenes.fusion(a,p);
            text=st.label+' · 核융합 과정에서 에너지가 방출됩니다.'.replace('核','핵');label='핵융합과 에너지';
        }else if(a.kind==='mass'){
            const i=Math.min(a.star.stages.length-1,Math.floor(p*a.star.stages.length));
            const st=STEPS[a.star.stages[i]];
            drawing='<circle cx="200" cy="105" r="68" fill="#f59e0b" opacity=".55"/><circle cx="200" cy="105" r="34" fill="#b45309"/>'+nucleus(200,105,st.ash.sym,st.ash.A);
            text=p>=1?a.star.endText:st.label+' 과정의 모형';label=a.star.label;
        }else{
            drawing='<circle cx="200" cy="100" r="60" fill="#dbeafe"/><text x="200" y="112" text-anchor="middle" fill="#334155" font-size="32">'+a.el.sym+'</text>';
            text=a.el.origin==='bigbang'?'초기 우주에서 주로 수소·헬륨 생성':a.el.origin==='star'?'별 내부와 진화 과정 등에서 생성':'중성자별 충돌 등 무거운 원소의 생성 과정';label=a.el.name+'의 기원';
        }
        mainGroup.innerHTML=drawing+(a.kind==='fusion'?'':'<text x="20" y="28" fill="#334155">'+label+'</text>');
        graphGroup.innerHTML='<text x="20" y="45" fill="#334155">초기 우주 → 별의 형성과 진화 → 원소가 우주로 퍼짐</text><text x="20" y="95" fill="#334155">이 물질들이 모여 태양계와 우리 몸의 재료가 됩니다.</text>';
        if(a.kind==='fusion') graphGroup.innerHTML=window.ScienceScenes.fusionGraph(a);
        stageBadge.textContent=label;methodHint.textContent='태양의 수소 핵융합과 원소의 생성 과정을 연결합니다.';
        dataNote.innerHTML='<p>'+text+'</p><p>단계와 원자핵 그림은 개념을 나타내는 모형입니다. 그림의 크기·시간으로 실제 핵반응량이나 별의 수명을 계산하지 않습니다.</p>';
        if(a.kind==='fusion') dataNote.innerHTML='<p>'+text+'</p><p>'+(state.step==='h'?'여러 반응 단계를 합친 개념 모형입니다. 수소 핵융합 중 일부 양성자가 중성자로 바뀝니다. 양전자·중성미자 등은 그림에서 생략했습니다.':'헬륨 원자핵 세 개가 여러 단계를 거쳐 탄소 원자핵 하나를 만듭니다.')+' 핵자 수는 보존되며, 질량 차이에 해당하는 에너지가 방출됩니다.</p>';
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
        labelA.textContent='관찰';valueA.textContent=a.kind==='fusion'?'에너지 방출':a.kind==='mass'?{he:'헬륨까지',co:'탄소·산소까지',sn:'철까지 + 초신성'}[a.star.end]:a.el.name;
        labelB.textContent='핵심';valueB.textContent=a.kind==='fusion'?'핵융합':a.kind==='mass'?'질량에 따라 다름':'원소의 기원';
        const answer=a.kind==='fusion'?'yes':a.verdict;predictionResult.textContent=!state.prediction?'다음에는 먼저 예상해 보세요.':state.prediction===answer?'예상이 맞았습니다.':'예상과 다른 결과입니다.';
        explanation.textContent=a.kind==='fusion'?'태양은 수소 원자핵의 핵융합으로 에너지를 방출합니다.':a.kind==='mass'?'별의 질량에 따라 생성하는 원소와 마지막 모습이 달라집니다. 모형의 진행 시간은 실제 수명이 아닙니다.':'초기 우주에서 주로 수소·헬륨이 생성되었고, 이후 별 내부·진화·폭발·충돌 등의 여러 과정으로 다양한 원소가 만들어져 퍼졌습니다. 특정 원소의 생성 과정은 하나로만 한정되지 않을 수 있습니다.';
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
        checkBtn.textContent = state.mode === 'fusion' ? '합쳐 보기' : state.mode === 'mass' ? '일생 돌려 보기' : '고향 찾기';
        stageCaption.textContent = state.mode === 'fusion' ? '원자핵들이 가까이 다가가 하나로 합쳐지고, 줄어든 질량만큼 빛과 열이 나옵니다.'
            : state.mode === 'mass' ? '별의 속을 잘라 본 그림입니다. 단계가 끝날 때마다 타고 남은 재가 새 중심이 되어 층이 쌓입니다.'
                : '원소가 만들어진 자리를 보고, 오른쪽에서 우주·지각·사람 몸에 얼마나 있는지 견줍니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { step: 'h', star: '1', element: 'c', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'fusion').click();
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

    window.__starModel = {
        BINDING, STEPS, STARS, ORIGINS, UNIVERSE, state,
        analyse, render, beOf, lifeYears, fmtShare,
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
        // A new drawing may contain no lifted prose. Clear the previous
        // drawing's copy too; takeRecords below already consumes our own edits.
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
    // The observer sees the app's DOMContentLoaded render; do not run twice.
})();
