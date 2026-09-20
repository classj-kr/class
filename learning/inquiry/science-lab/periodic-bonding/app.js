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

    const RUN_SECONDS = 7;

    /* -------------------------------------------------------------- data */
    // The first twenty elements. Shells fill 2, 8, 8 from the inside; the ion an
    // element forms is the one that leaves a noble-gas arrangement behind.
    const ELEMENTS = [
        { z: 1, sym: 'H', name: '수소', period: 1, group: 1, shells: [1], kind: '비금속', state: '기체', ion: null, why: 'h' },
        { z: 2, sym: 'He', name: '헬륨', period: 1, group: 18, shells: [2], kind: '비활성 기체', state: '기체', ion: null, why: 'noble' },
        { z: 3, sym: 'Li', name: '리튬', period: 2, group: 1, shells: [2, 1], kind: '알칼리 금속', state: '고체', ion: { q: 1, sym: 'Li⁺', noble: '헬륨' } },
        { z: 4, sym: 'Be', name: '베릴륨', period: 2, group: 2, shells: [2, 2], kind: '알칼리 토금속', state: '고체', ion: { q: 2, sym: 'Be²⁺', noble: '헬륨' } },
        { z: 5, sym: 'B', name: '붕소', period: 2, group: 13, shells: [2, 3], kind: '준금속', state: '고체', ion: null, why: 'share' },
        { z: 6, sym: 'C', name: '탄소', period: 2, group: 14, shells: [2, 4], kind: '비금속', state: '고체', ion: null, why: 'share' },
        { z: 7, sym: 'N', name: '질소', period: 2, group: 15, shells: [2, 5], kind: '비금속', state: '기체', ion: { q: -3, sym: 'N³⁻', noble: '네온' } },
        { z: 8, sym: 'O', name: '산소', period: 2, group: 16, shells: [2, 6], kind: '비금속', state: '기체', ion: { q: -2, sym: 'O²⁻', noble: '네온' } },
        { z: 9, sym: 'F', name: '플루오린', period: 2, group: 17, shells: [2, 7], kind: '할로젠', state: '기체', ion: { q: -1, sym: 'F⁻', noble: '네온' } },
        { z: 10, sym: 'Ne', name: '네온', period: 2, group: 18, shells: [2, 8], kind: '비활성 기체', state: '기체', ion: null, why: 'noble' },
        { z: 11, sym: 'Na', name: '나트륨', period: 3, group: 1, shells: [2, 8, 1], kind: '알칼리 금속', state: '고체', ion: { q: 1, sym: 'Na⁺', noble: '네온' } },
        { z: 12, sym: 'Mg', name: '마그네슘', period: 3, group: 2, shells: [2, 8, 2], kind: '알칼리 토금속', state: '고체', ion: { q: 2, sym: 'Mg²⁺', noble: '네온' } },
        { z: 13, sym: 'Al', name: '알루미늄', period: 3, group: 13, shells: [2, 8, 3], kind: '금속', state: '고체', ion: { q: 3, sym: 'Al³⁺', noble: '네온' } },
        { z: 14, sym: 'Si', name: '규소', period: 3, group: 14, shells: [2, 8, 4], kind: '준금속', state: '고체', ion: null, why: 'share' },
        { z: 15, sym: 'P', name: '인', period: 3, group: 15, shells: [2, 8, 5], kind: '비금속', state: '고체', ion: { q: -3, sym: 'P³⁻', noble: '아르곤' } },
        { z: 16, sym: 'S', name: '황', period: 3, group: 16, shells: [2, 8, 6], kind: '비금속', state: '고체', ion: { q: -2, sym: 'S²⁻', noble: '아르곤' } },
        { z: 17, sym: 'Cl', name: '염소', period: 3, group: 17, shells: [2, 8, 7], kind: '할로젠', state: '기체', ion: { q: -1, sym: 'Cl⁻', noble: '아르곤' } },
        { z: 18, sym: 'Ar', name: '아르곤', period: 3, group: 18, shells: [2, 8, 8], kind: '비활성 기체', state: '기체', ion: null, why: 'noble' },
        { z: 19, sym: 'K', name: '칼륨', period: 4, group: 1, shells: [2, 8, 8, 1], kind: '알칼리 금속', state: '고체', ion: { q: 1, sym: 'K⁺', noble: '아르곤' } },
        { z: 20, sym: 'Ca', name: '칼슘', period: 4, group: 2, shells: [2, 8, 8, 2], kind: '알칼리 토금속', state: '고체', ion: { q: 2, sym: 'Ca²⁺', noble: '아르곤' } },
    ];
    const BY_SYM = Object.fromEntries(ELEMENTS.map(e => [e.sym, e]));
    const valence = e => e.shells[e.shells.length - 1];
    const GROUPS = ['1', '2', '13', '14', '15', '16', '17', '18'];
    const PERIODS = ['1', '2', '3', '4'];
    const GROUP_COLOR = { 1: '#ffb347', 2: '#f4a261', 13: '#e9a3c9', 14: '#9fb6d9', 15: '#7c3aed', 16: '#ff7a59', 17: '#7fd48a', 18: '#0284c7' };
    const elementAt = (period, group) => ELEMENTS.find(e => e.period === Number(period) && e.group === Number(group)) || null;

    // Pairs that meet. Ionic: electrons cross over; covalent: pairs are shared.
    // Melting points in ℃ (CO₂ has none at 1 atm: dry ice sublimes at −78.5 ℃).
    const PAIRS = {
        nacl: { label: 'Na + Cl', a: 'Na', b: 'Cl', atoms: ['Na', 'Cl'], formula: 'NaCl', formulaHtml: 'NaCl', name: '염화 나트륨', bond: 'ionic', melt: 801, state: '고체', aq: 'yes', ratio: '1:1', transfers: [{ from: 0, to: 1, n: 1 }], note: '소금' },
        na2o: { label: 'Na + O', a: 'Na', b: 'O', atoms: ['Na', 'O', 'Na'], formula: 'Na₂O', formulaHtml: 'Na<tspan baseline-shift="sub" font-size="70%">2</tspan>O', name: '산화 나트륨', bond: 'ionic', melt: 1132, state: '고체', aq: 'reacts', ratio: '2:1', transfers: [{ from: 0, to: 1, n: 1 }, { from: 2, to: 1, n: 1 }] },
        mgo: { label: 'Mg + O', a: 'Mg', b: 'O', atoms: ['Mg', 'O'], formula: 'MgO', formulaHtml: 'MgO', name: '산화 마그네슘', bond: 'ionic', melt: 2852, state: '고체', aq: 'insoluble', ratio: '1:1', transfers: [{ from: 0, to: 1, n: 2 }], note: '내화 벽돌' },
        cacl2: { label: 'Ca + Cl', a: 'Ca', b: 'Cl', atoms: ['Cl', 'Ca', 'Cl'], formula: 'CaCl₂', formulaHtml: 'CaCl<tspan baseline-shift="sub" font-size="70%">2</tspan>', name: '염화 칼슘', bond: 'ionic', melt: 772, state: '고체', aq: 'yes', ratio: '1:2', transfers: [{ from: 1, to: 0, n: 1 }, { from: 1, to: 2, n: 1 }], note: '제설제·습기 제거제' },
        h2: { label: 'H + H', a: 'H', b: 'H', atoms: ['H', 'H'], formula: 'H₂', formulaHtml: 'H<tspan baseline-shift="sub" font-size="70%">2</tspan>', name: '수소', bond: 'covalent', melt: -259, state: '기체', ratio: '1:1', bonds: [{ i: 0, j: 1, pairs: 1 }] },
        o2: { label: 'O + O', a: 'O', b: 'O', atoms: ['O', 'O'], formula: 'O₂', formulaHtml: 'O<tspan baseline-shift="sub" font-size="70%">2</tspan>', name: '산소', bond: 'covalent', melt: -219, state: '기체', ratio: '1:1', bonds: [{ i: 0, j: 1, pairs: 2 }], note: '공기의 21 %' },
        h2o: { label: 'H + O', a: 'H', b: 'O', atoms: ['H', 'O', 'H'], formula: 'H₂O', formulaHtml: 'H<tspan baseline-shift="sub" font-size="70%">2</tspan>O', name: '물', bond: 'covalent', melt: 0, state: '액체', ratio: '2:1', bonds: [{ i: 0, j: 1, pairs: 1 }, { i: 2, j: 1, pairs: 1 }], bent: true },
        co2: { label: 'C + O', a: 'C', b: 'O', atoms: ['O', 'C', 'O'], formula: 'CO₂', formulaHtml: 'CO<tspan baseline-shift="sub" font-size="70%">2</tspan>', name: '이산화 탄소', bond: 'covalent', melt: -78.5, sublimes: true, state: '기체', ratio: '1:2', bonds: [{ i: 0, j: 1, pairs: 2 }, { i: 2, j: 1, pairs: 2 }], note: '드라이아이스' },
        n2: { label: 'N + N', a: 'N', b: 'N', atoms: ['N', 'N'], formula: 'N₂', formulaHtml: 'N<tspan baseline-shift="sub" font-size="70%">2</tspan>', name: '질소', bond: 'covalent', melt: -210, state: '기체', ratio: '1:1', bonds: [{ i: 0, j: 1, pairs: 3 }], note: '공기의 78 %' },
    };
    const IONIC_KEYS = ['nacl', 'na2o', 'mgo', 'cacl2'], COVALENT_KEYS = ['h2', 'o2', 'n2', 'h2o', 'co2'];

    const state = {
        mode: 'elements',
        period: '3', group: '1',
        pair: 'nacl',
        progress: 0, prediction: null,
    };
    let running = false, frameId = 0, lastStamp = 0;

    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const lerp = (a, b, t) => a + (b - a) * t;
    const jong = s => { const c = s.charCodeAt(s.length - 1); return c >= 0xac00 && c <= 0xd7a3 ? (c - 0xac00) % 28 : -1; };
    const pEun = n => jong(n) > 0 ? '은' : '는', pIga = n => jong(n) > 0 ? '이' : '가', pWa = n => jong(n) > 0 ? '과' : '와';
    const pRo = n => jong(n) > 0 && jong(n) !== 8 ? '으로' : '로';
    const fmtNum = m => m < 0 ? `−${Math.abs(m)}` : String(m);
    const KOREAN_COUNT = ['', '한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟'];
    const meltText = p => p.sublimes ? `${fmtNum(p.melt)} ℃(승화)` : `${fmtNum(p.melt)} ℃`;

    /* ------------------------------------------------------------ models */
    function analyse() {
        if (state.mode === 'elements') {
            const el = elementAt(state.period, state.group) || BY_SYM.Na;
            const v = valence(el);
            const verdict = el.ion ? (el.ion.q > 0 ? 'cation' : 'anion') : 'none';
            const change = el.ion ? (el.ion.q > 0 ? -el.ion.q : -el.ion.q) : 0;   // electrons gained (+) or lost (−)
            const siblings = ELEMENTS.filter(e => e.group === el.group && e.z !== el.z);
            return { kind: 'elements', el, v, verdict, change, siblings };
        }
        const p = PAIRS[state.pair];
        const A = BY_SYM[p.a], B = BY_SYM[p.b];
        const same = p.a === p.b;
        const na = p.atoms.filter(s => s === p.a).length, nb = p.atoms.filter(s => s === p.b).length;
        const pairs = p.bonds ? p.bonds.reduce((sum, b) => sum + b.pairs, 0) : 0;
        return { kind: 'bonds', p, A, B, same, pairs, na: same ? 1 : na, nb: same ? 1 : nb, verdict: same ? `p${pairs}` : p.ratio };
    }

    /* ---------------------------------------------------------- controls */
    function pickRow(legend, name, options, current, cols) {
        return `<fieldset class="pick-field"><legend>${legend}</legend>` +
            `<div class="pick-buttons cols${cols}" data-pick="${name}">` +
            options.map(o => `<button type="button" data-value="${o.value}" class="${o.value === String(current) ? 'selected' : ''}" ${o.disabled ? 'disabled' : ''}>` +
                `${o.label}${o.hint ? `<small>${o.hint}</small>` : ''}</button>`).join('') +
            `</div></fieldset>`;
    }

    function buildControls() {
        if (state.mode === 'elements') {
            controlArea.innerHTML =
                pickRow('주기 (가로줄)', 'period', PERIODS.map(p => ({ value: p, label: `${p}주기`, hint: p === '1' ? '껍질 1개' : `껍질 ${p}개` })), state.period, 4) +
                pickRow('족 (세로줄)', 'group', GROUPS.map(g => { const e = elementAt(state.period, g); return { value: g, label: `${g}족`, hint: e ? e.sym : '없음', disabled: !e }; }), state.group, 4);
        } else {
            controlArea.innerHTML =
                pickRow('금속 + 비금속', 'pair', IONIC_KEYS.map(k => ({ value: k, label: PAIRS[k].label })), state.pair, 4) +
                pickRow('비금속 + 비금속', 'pair', COVALENT_KEYS.map(k => ({ value: k, label: PAIRS[k].label })), state.pair, 5);
        }
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                const name = group.dataset.pick;
                state[name] = button.dataset.value;
                // a period with no element in the chosen column falls back to the first column
                if (name === 'period' && !elementAt(state.period, state.group)) state.group = '1';
                buildControls();
                buildPrediction();
                settingsChanged();
            }));
        });
    }

    const PRED_ELEMENTS = [
        { value: 'cation', label: '전자를 잃어 양이온(+)이 된다' },
        { value: 'anion', label: '전자를 얻어 음이온(−)이 된다' },
        { value: 'none', label: '이 모형에서는 이온으로 나타내지 않음' },
    ];
    const PRED_RATIO = [{ value: '1:1', label: '1 : 1' }, { value: '1:2', label: '1 : 2' }, { value: '2:1', label: '2 : 1' }];
    const PRED_PAIRS = [{ value: 'p1', label: '1쌍' }, { value: 'p2', label: '2쌍' }, { value: 'p3', label: '3쌍' }];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const a = analyse();
        const list = a.kind === 'elements' ? PRED_ELEMENTS : a.same ? PRED_PAIRS : PRED_RATIO;
        predictionLegend.textContent = a.kind === 'elements' ? `${a.el.name}(${a.el.sym}) 원자는 어떤 이온이 될까요?`
            : a.same ? `${a.A.name}(${a.A.sym}) 원자 둘이 만나면 전자를 몇 쌍 함께 쓸까요?`
                : `${a.A.name}(${a.A.sym})${pWa(a.A.name)} ${a.B.name}(${a.B.sym})${pEun(a.B.name)} 몇 개씩 만나 결합할까요?`;
        predictionArea.className = `prediction-buttons${list.length === 3 ? ' three' : ''}`;
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    const SHELL_R = [20, 36, 52, 68];
    const polar = (cx, cy, r, ang) => [cx + r * Math.cos(ang), cy + r * Math.sin(ang)];

    // one element: Bohr shells on the left, the table on the right
    function renderElements(a) {
        const { el, v } = a;
        const p = state.progress;
        const CX = 110, CY = 118;
        const spin = Math.min(p, 0.5) * Math.PI * 0.5;           // the model turns a quarter while we look
        const t = clamp((p - 0.5) / 0.4, 0, 1);                  // then the outer electrons move
        const lost = a.change < 0, gained = a.change > 0;
        let out = '';
        el.shells.forEach((n, s) => {
            const outer = s === el.shells.length - 1;
            out += `<circle class="shell ${outer ? 'outer' : ''} ${outer && lost && t >= 1 ? 'empty' : ''}" cx="${CX}" cy="${CY}" r="${SHELL_R[s]}"/>`;
        });
        out += `<circle class="nucleus" cx="${CX}" cy="${CY}" r="11"/><text class="nucleus-text" x="${CX}" y="${CY + 3.5}" text-anchor="middle">${el.sym}</text>`;
        // electrons, shell by shell
        el.shells.forEach((n, s) => {
            const r = SHELL_R[s], outer = s === el.shells.length - 1;
            const slots = outer ? Math.max(n, gained ? 8 : n) : n;
            for (let k = 0; k < n; k += 1) {
                const ang = -Math.PI / 2 + spin + k * 2 * Math.PI / slots;
                let [x, y] = polar(CX, CY, r, ang);
                let cls = 'electron';
                if (outer && lost && k >= n - Math.abs(a.change) && t > 0) {
                    // the leaving electrons drift out to the right and fade
                    const idx = k - (n - Math.abs(a.change));
                    const [ex, ey] = [CX + 120, CY - 6 + idx * 12];
                    x = lerp(x, ex, t); y = lerp(y, ey, t); cls += ' moving';
                    out += `<circle class="${cls}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2" opacity="${(1 - 0.6 * t).toFixed(2)}"/>`;
                    continue;
                }
                out += `<circle class="${cls}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2"/>`;
            }
            if (outer && gained && t > 0) {
                // the arriving electrons come in from the right into the empty slots
                for (let k = n; k < n + a.change; k += 1) {
                    const ang = -Math.PI / 2 + spin + k * 2 * Math.PI / 8;
                    const [x1, y1] = polar(CX, CY, r, ang);
                    const [x0, y0] = [CX + 120, CY - 6 + (k - n) * 12];
                    out += `<circle class="electron moving" cx="${lerp(x0, x1, t).toFixed(1)}" cy="${lerp(y0, y1, t).toFixed(1)}" r="3.2"/>`;
                }
            }
        });
        // facts beside the atom
        const IX = 200;
        out += `<text class="trait-text" x="${IX}" y="50">전자 껍질 ${el.shells.join(' · ')}</text>`;
        out += `<text class="trait-text" x="${IX}" y="66">바깥 전자 ${v}개</text>`;
        out += `<text class="trait-text" x="${IX}" y="82">${el.kind}</text>`;
        out += `<text class="trait-text" x="${IX}" y="98">상온에서 ${el.state}</text>`;
        if (t > 0 && (lost || gained)) out += `<text class="trait-text" style="fill:#d97706" x="${IX}" y="160">전자 ${Math.abs(a.change)}개 ${lost ? '잃음' : '얻음'}</text>`;
        else if (p >= 0.5) out += `<text class="trait-text" style="fill:#d97706" x="${IX}" y="160">${el.why === 'noble' ? '이미 가득 참' : '전자를 함께 씀'}</text>`;
        // the table
        const TX = 296, TY = 40, CW = 19, CH = 17;
        GROUPS.forEach((g, c) => { out += `<text class="cell-head" x="${TX + c * CW + CW / 2}" y="${TY - 4}" text-anchor="middle">${g}</text>`; });
        ELEMENTS.forEach(e => {
            const c = GROUPS.indexOf(String(e.group)), r = e.period - 1;
            const x = TX + c * CW, y = TY + r * CH;
            const mine = e.z === el.z, same = e.group === el.group;
            out += `<rect class="cell" x="${x}" y="${y}" width="${CW}" height="${CH}" fill="${mine ? GROUP_COLOR[e.group] : same ? GROUP_COLOR[e.group] + '55' : 'rgba(148,163,184,.18)'}"/>`;
            out += `<text class="cell-text" style="fill:${mine ? '#0a1c24' : '#0f172a'}" x="${x + CW / 2}" y="${y + CH / 2 + 3}" text-anchor="middle">${e.sym}</text>`;
        });
        out += `<text class="small-label" x="${TX}" y="${TY + 4 * CH + 14}">같은 세로줄(족) = 같은 바깥 전자 수</text>`;
        // verdict
        if (p >= 0.9) {
            const IONX = 372;
            if (el.ion) {
                out += `<text class="big-text" fill="#d97706" x="${IONX}" y="166" text-anchor="middle">${el.ion.sym}</text>`;
                out += `<text class="small-label" x="${IONX}" y="182" text-anchor="middle">${el.ion.noble}과 같은 전자 배치</text>`;
            } else {
                out += `<text class="big-text" fill="#d97706" x="${IONX}" y="166" text-anchor="middle">${el.sym}</text>`;
                out += `<text class="small-label" x="${IONX}" y="182" text-anchor="middle">${el.why === 'noble' ? '그대로 안정' : '공유 결합으로 감'}</text>`;
            }
            out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${el.name} → ${el.ion ? `${el.ion.sym} (전자 ${Math.abs(a.change)}개 ${lost ? '잃음' : '얻음'})` : el.why === 'noble' ? '이 모형에서 안정한 원자 상태' : '이 모형에서 공유 결합으로 다룸'}</text>`;
        } else {
            out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${el.name} (${el.sym}) · 원자 번호 ${el.z} · ${el.period}주기 ${el.group}족</text>`;
        }
        out += `<text class="note-text" x="20" y="208">${lost || gained ? '가장 바깥 껍질이 비활성 기체처럼 가득 차는 쪽으로 전자를 잃거나 얻습니다' : el.why === 'noble' ? '바깥 껍질이 가득 차 있어 전자를 잃거나 얻을 까닭이 없습니다' : '4개를 잃기도 얻기도 힘들어 다른 원자와 전자를 함께 씁니다'}</text>`;
        return out;
    }

    // valence electrons of the first twenty, in a saw-tooth
    function graphElements(a) {
        const X0 = 40, X1 = 440, Y0 = 140, Y1 = 40;
        const xOf = z => X0 + (z - 1) / 19 * (X1 - X0), yOf = v => Y0 - v / 8 * (Y0 - Y1);
        let out = `<text class="axis-title" x="${X0}" y="18">가장 바깥 껍질의 전자 수 — 8개가 되면 다음 가로줄로 넘어간다</text>`;
        for (let v = 0; v <= 8; v += 2) {
            out += `<line class="grid-line" x1="${X0}" y1="${yOf(v).toFixed(1)}" x2="${X1}" y2="${yOf(v).toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${X0 - 6}" y="${(yOf(v) + 3.5).toFixed(1)}" text-anchor="end">${v}</text>`;
        }
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/>`;
        out += `<path class="trace" d="${ELEMENTS.map((e, n) => `${n ? 'L' : 'M'}${xOf(e.z).toFixed(1)},${yOf(valence(e)).toFixed(1)}`).join(' ')}"/>`;
        ELEMENTS.forEach(e => {
            const mine = e.z === a.el.z, same = e.group === a.el.group;
            out += `<circle class="trace-dot ${mine ? 'chosen' : ''}" fill="${same ? GROUP_COLOR[e.group] : '#64748b'}" cx="${xOf(e.z).toFixed(1)}" cy="${yOf(valence(e)).toFixed(1)}" r="${mine ? 5 : 3.2}"/>`;
            out += `<text class="axis-text" style="fill:${same ? GROUP_COLOR[e.group] : '#475569'};font-size:${e.sym.length > 1 ? 8.5 : 9.5}px" x="${xOf(e.z).toFixed(1)}" y="${Y0 + 13}" text-anchor="middle">${e.sym}</text>`;
        });
        [[1, 2], [3, 10], [11, 18], [19, 20]].forEach(([z0, z1], n) => {
            out += `<text class="small-label" x="${((xOf(z0) + xOf(z1)) / 2).toFixed(1)}" y="${Y0 + 28}" text-anchor="middle">${n + 1}주기</text>`;
        });
        out += `<text class="axis-title" x="${((X0 + X1) / 2).toFixed(1)}" y="${Y0 + 46}" text-anchor="middle">원자 번호 순서 — 색이 같은 점이 ${a.el.name}과 같은 족 (바깥 전자 ${a.v}개)</text>`;
        return out;
    }

    // where the atoms of a pair sit before and after they meet
    function layoutOf(p) {
        const n = p.atoms.length;
        const start = n === 2 ? [[100, 118], [260, 118]] : [[60, 118], [180, 118], [300, 118]];
        let end;
        if (p.bent) end = [[142, 134], [180, 104], [218, 134]];
        else if (n === 2) end = [[156, 118], [204, 118]];
        else end = [[132, 118], [180, 118], [228, 118]];
        return p.atoms.map((sym, i) => ({ el: BY_SYM[sym], x0: start[i][0], y0: start[i][1], x1: end[i][0], y1: end[i][1] }));
    }
    const R_ATOM = 28, R_CATION = 18, R_ANION = 30;

    function renderBonds(a) {
        const { p } = a;
        const prog = state.progress;
        const atoms = layoutOf(p);
        const ionic = p.bond === 'ionic';
        // phases: 0-0.35 look, 0.35-0.7 electrons cross (ionic) or atoms approach (covalent), 0.7-1 settle
        const t1 = clamp((prog - 0.35) / 0.35, 0, 1), t2 = clamp((prog - 0.7) / 0.3, 0, 1);
        const move = ionic ? t2 : t1;
        const pos = atoms.map(at => [lerp(at.x0, at.x1, move), lerp(at.y0, at.y1, move)]);
        let out = '';
        const angleTo = (i, j) => Math.atan2(pos[j][1] - pos[i][1], pos[j][0] - pos[i][0]);
        if (ionic) {
            // who gives, who takes
            const gives = atoms.map(() => 0), takes = atoms.map(() => 0);
            p.transfers.forEach(tr => { gives[tr.from] += tr.n; takes[tr.to] += tr.n; });
            atoms.forEach((at, i) => {
                const v = valence(at.el);
                const donor = gives[i] > 0;
                const r = donor ? lerp(R_ATOM, R_CATION, t2) : lerp(R_ATOM, R_ANION, t2);
                const [cx, cy] = pos[i];
                out += `<circle class="shell outer ${donor && t1 >= 1 ? 'empty' : ''}" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}"/>`;
                if (t2 > 0) out += `<circle class="ion-body" fill="${donor ? 'rgba(255,179,71,.14)' : 'rgba(82,199,255,.14)'}" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" opacity="${t2.toFixed(2)}"/>`;
                out += `<circle class="nucleus" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="9"/><text class="nucleus-text" x="${cx.toFixed(1)}" y="${(cy + 3.2).toFixed(1)}" text-anchor="middle">${at.el.sym}</text>`;
                // own electrons that stay: an acceptor keeps all of its own, a donor keeps none of the outer shell
                const partner = p.transfers.find(tr => tr.from === i || tr.to === i);
                const face = partner ? angleTo(i, partner.from === i ? partner.to : partner.from) : 0;
                if (!donor) {
                    for (let k = 0; k < v; k += 1) {
                        const ang = face + Math.PI + (k - (v - 1) / 2) * (2 * Math.PI / 8);
                        const [x, y] = polar(cx, cy, r, ang);
                        out += `<circle class="electron" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2"/>`;
                    }
                }
                if (t2 > 0.5) {
                    const q = donor ? gives[i] : -takes[i];
                    const label = q > 0 ? `${at.el.sym}${q > 1 ? ['', '', '²', '³'][q] : ''}⁺` : `${at.el.sym}${-q > 1 ? ['', '', '²', '³'][-q] : ''}⁻`;
                    out += `<text class="charge-text" x="${cx.toFixed(1)}" y="${(cy - r - 6).toFixed(1)}" text-anchor="middle">${label}</text>`;
                }
            });
            // the crossing electrons: on the donor's shell facing the acceptor, then on the acceptor's shell facing the donor
            p.transfers.forEach(tr => {
                const [dx, dy] = pos[tr.from], [ax, ay] = pos[tr.to];
                const faceD = angleTo(tr.from, tr.to), faceA = angleTo(tr.to, tr.from);
                const rD = lerp(R_ATOM, R_CATION, t2), rA = lerp(R_ATOM, R_ANION, t2);
                // the acceptor may receive from two sides; spread its incoming slots
                const slotsA = takes[tr.to];
                const already = p.transfers.filter(o => o.to === tr.to && p.transfers.indexOf(o) < p.transfers.indexOf(tr)).reduce((s, o) => s + o.n, 0);
                for (let k = 0; k < tr.n; k += 1) {
                    const angD = faceD + (k - (tr.n - 1) / 2) * 0.5;
                    const spreadA = slotsA > 1 && p.transfers.filter(o => o.to === tr.to).length === 1 ? (k - (tr.n - 1) / 2) * 0.5 : 0;
                    const angA = faceA + spreadA;
                    void already;
                    const [x0, y0] = polar(dx, dy, rD, angD), [x1, y1] = polar(ax, ay, rA, angA);
                    out += `<circle class="electron ${t1 > 0 && t1 < 1 ? 'moving' : ''}" cx="${lerp(x0, x1, t1).toFixed(1)}" cy="${lerp(y0, y1, t1).toFixed(1)}" r="3.2"/>`;
                }
            });
            if (t2 > 0.5) {
                out += `<text class="trait-text" style="fill:#d97706" x="180" y="174" text-anchor="middle">반대 전하의 이온이 서로 끌어당김</text>`;
                out += `<text class="gen-text" x="180" y="190" text-anchor="middle">${p.formulaHtml} · 이온 결합</text>`;
            } else if (t1 > 0) {
                out += `<text class="trait-text" style="fill:#d97706" x="180" y="174" text-anchor="middle">${a.A.name}의 바깥 전자가 ${a.B.name}${pRo(a.B.name)} 옮겨 감</text>`;
            } else {
                out += `<text class="trait-text" x="180" y="174" text-anchor="middle">${a.A.name} 바깥 전자 ${valence(a.A)}개 · ${a.B.name} 바깥 전자 ${valence(a.B)}개</text>`;
            }
        } else {
            // covalent: the shared electrons settle where the shells overlap, the rest stay on the far side
            atoms.forEach((at, i) => {
                const [cx, cy] = pos[i];
                out += `<circle class="shell outer" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${R_ATOM}"/>`;
                out += `<circle class="nucleus" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="9"/><text class="nucleus-text" x="${cx.toFixed(1)}" y="${(cy + 3.2).toFixed(1)}" text-anchor="middle">${at.el.sym}</text>`;
            });
            atoms.forEach((at, i) => {
                const [cx, cy] = pos[i];
                const v = valence(at.el);
                const myBonds = p.bonds.filter(b => b.i === i || b.j === i);
                const shared = myBonds.reduce((s, b) => s + b.pairs, 0);      // electrons this atom puts into bonds
                const lone = v - shared;
                // start positions: evenly around the shell
                const starts = Array.from({ length: v }, (_, k) => polar(cx, cy, R_ATOM, -Math.PI / 2 + k * 2 * Math.PI / v));
                // end positions: bond electrons in the overlap, lone ones away from the bonds
                const ends = [];
                myBonds.forEach(b => {
                    const other = b.i === i ? b.j : b.i;
                    const ang = angleTo(i, other);
                    const mx = (cx + pos[other][0]) / 2, my = (cy + pos[other][1]) / 2;
                    const px = -Math.sin(ang), py = Math.cos(ang);
                    for (let k = 0; k < b.pairs; k += 1) {
                        const off = (k - (b.pairs - 1) / 2) * 10;
                        // this atom's electron of the pair sits on its own side of the midpoint
                        ends.push([mx + px * off - Math.cos(ang) * 3.5, my + py * off - Math.sin(ang) * 3.5]);
                    }
                });
                const away = myBonds.length ? Math.atan2(-myBonds.reduce((s, b) => s + Math.sin(angleTo(i, b.i === i ? b.j : b.i)), 0), -myBonds.reduce((s, b) => s + Math.cos(angleTo(i, b.i === i ? b.j : b.i)), 0)) : -Math.PI / 2;
                const lonePairs = Math.ceil(lone / 2);
                for (let k = 0; k < lone; k += 1) {
                    const pairIdx = Math.floor(k / 2), side = k % 2 ? 1 : -1;
                    const ang = away + (pairIdx - (lonePairs - 1) / 2) * 0.9 + side * 0.16;
                    ends.push(polar(cx, cy, R_ATOM, ang));
                }
                starts.forEach((s, k) => {
                    const e = ends[k] || s;
                    const x = lerp(s[0], e[0], t2), y = lerp(s[1], e[1], t2);
                    out += `<circle class="electron ${k < shared && t2 >= 1 ? 'shared' : ''}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2"/>`;
                });
            });
            const pairsTotal = p.bonds.reduce((s, b) => s + b.pairs, 0);
            if (t2 >= 1) {
                out += `<text class="trait-text" style="fill:#059669" x="180" y="174" text-anchor="middle">초록 전자 ${pairsTotal}쌍을 함께 씀 — 모두 바깥 껍질이 채워짐</text>`;
                out += `<text class="gen-text" x="180" y="190" text-anchor="middle">${p.formulaHtml} · 공유 결합 (분자)</text>`;
            } else if (t1 > 0) {
                out += `<text class="trait-text" style="fill:#d97706" x="180" y="174" text-anchor="middle">둘 다 비금속 — 어느 쪽도 전자를 내주지 않음</text>`;
            } else {
                out += `<text class="trait-text" x="180" y="174" text-anchor="middle">${a.A.name} 바깥 전자 ${valence(a.A)}개${p.a === p.b ? '' : ` · ${a.B.name} 바깥 전자 ${valence(a.B)}개`}</text>`;
            }
        }
        // property card
        const PX = 338;
        const shown = prog >= 0.9;
        out += `<text class="gen-text" x="${PX}" y="46" style="font-size:15px">${p.formulaHtml}</text>`;
        out += `<text class="trait-text" x="${PX}" y="66">${p.name}${p.note ? ` (${p.note})` : ''}</text>`;
        out += `<text class="trait-text" x="${PX}" y="86">결합: ${shown ? (ionic ? '이온 결합' : '공유 결합') : '?'}</text>`;
        out += `<text class="trait-text" x="${PX}" y="102">상온: ${shown ? p.state : '?'}</text>`;
        out += `<text class="trait-text" x="${PX}" y="118">녹는점: ${shown ? meltText(p) : '?'}</text>`;
        out += `<text class="trait-text" x="${PX}" y="134">전기: ${shown ? (ionic ? '고체 ✗ · 녹인 액체 ✓' : '흐르지 않음') : '?'}</text>`;
        if (shown && ionic) out += `<text class="trait-text" x="${PX}" y="150">${p.aq === 'yes' ? '물에 풀면 ✓' : p.aq === 'insoluble' ? '물에 거의 안 녹음' : '물과 만나면 반응'}</text>`;
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${shown ? (a.same ? `${a.A.name} 원자 2개 → ${p.formulaHtml} (공유 결합, 전자 ${a.pairs}쌍 함께 씀)` : `${a.A.name} ${a.na}개 : ${a.B.name} ${a.nb}개 → ${p.formulaHtml} (${ionic ? '이온 결합' : '공유 결합'})`) : `${a.A.name}(${a.A.sym})${a.same ? ' 원자 둘이' : `${pWa(a.A.name)} ${a.B.name}(${a.B.sym})${pIga(a.B.name)}`} 만난다`}</text>`;
        out += `<text class="note-text" x="20" y="208">안쪽 껍질의 전자는 그리지 않았습니다 · ${ionic ? '금속은 전자를 내주고 비금속은 받습니다' : '비금속끼리는 전자쌍을 함께 씁니다'}</text>`;
        return out;
    }

    // melting points of the eight, above and below the 0 ℃ line
    function graphBonds(a) {
        const X0 = 50, X1 = 440, YZ = 122, YTOP = 36, YBOT = 134;
        const keys = [...IONIC_KEYS, ...COVALENT_KEYS];
        const yOf = m => m >= 0 ? YZ - m / 3000 * (YZ - YTOP) : YZ - m / 300 * (YBOT - YZ);
        let out = `<text class="axis-title" x="${X0}" y="18">녹는점 — 노란 막대는 이온 결합, 파란 막대는 분자</text>`;
        out += `<text class="axis-text" x="${X1}" y="18" text-anchor="end">℃</text>`;
        [0, 1000, 2000, 3000].forEach(m => {
            out += `<line class="grid-line" x1="${X0}" y1="${yOf(m).toFixed(1)}" x2="${X1}" y2="${yOf(m).toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${X0 - 6}" y="${(yOf(m) + 3.5).toFixed(1)}" text-anchor="end">${m}</text>`;
        });
        out += `<text class="axis-text" x="${X0 - 6}" y="${(YBOT + 3.5).toFixed(1)}" text-anchor="end">−300</text>`;
        out += `<line class="axis" x1="${X0}" y1="${YZ}" x2="${X1}" y2="${YZ}"/>`;
        const W = 30, step = (X1 - X0 - 10) / keys.length;
        keys.forEach((k, n) => {
            const p = PAIRS[k], x = X0 + 8 + n * step;
            const y = yOf(p.melt), top = Math.min(y, YZ), h = Math.max(1.5, Math.abs(YZ - y));
            const mine = k === state.pair;
            out += `<rect class="bar ${mine ? 'chosen' : ''}" fill="${p.bond === 'ionic' ? '#d97706' : '#0284c7'}" opacity="${mine ? 1 : 0.6}" x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${W}" height="${h.toFixed(1)}" rx="2"/>`;
            const ly = p.melt >= 0 ? top - 4 : YZ + h + 11;
            out += `<text class="axis-text" style="fill:${mine ? '#0f172a' : '#475569'};font-weight:${mine ? '900' : '750'}" x="${(x + W / 2).toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle">${fmtNum(p.melt)}</text>`;
            out += `<text class="axis-text" style="fill:${mine ? '#0f172a' : '#475569'};font-weight:${mine ? '900' : '750'}" x="${(x + W / 2).toFixed(1)}" y="${YBOT + 26}" text-anchor="middle">${p.formulaHtml}</text>`;
        });
        out += `<text class="axis-title" x="${((X0 + X1) / 2).toFixed(1)}" y="${YBOT + 46}" text-anchor="middle">이온끼리의 끌림은 세고, 분자끼리의 끌림은 약하다${a.p.sublimes ? ' (CO₂는 −78.5 ℃에서 곧바로 기체가 됨)' : ''}</text>`;
        return out;
    }

    function noteFor(a) {
        if (a.kind === 'elements') {
            const { el } = a;
            const sib = a.siblings.map(e => `${e.name}(${e.sym})`).join(', ');
            return `<div class="data-row"><span class="data-name">원소</span><span class="data-val">${el.name} ${el.sym} · 원자 번호 ${el.z} · 전자 ${el.z}개 · ${el.kind}${el.sym === 'Na' ? ' · 소듐이라고도 함' : el.sym === 'K' ? ' · 포타슘이라고도 함' : ''}</span></div>` +
                `<div class="data-row"><span class="data-name">전자 배치</span><span class="data-val">안쪽부터 ${el.shells.join(' · ')} — 바깥 전자 ${a.v}개</span></div>` +
                `<div class="data-row"><span class="data-name">같은 족</span><span class="data-val">${sib} — 모두 바깥 전자 ${a.v}개</span></div>` +
                `<div class="data-row match"><span class="data-name">되는 이온</span><span class="data-val">${el.ion ? `${el.ion.sym} (전자 ${Math.abs(a.change)}개 ${a.change < 0 ? '잃음' : '얻음'}, ${el.ion.noble}과 같은 배치)` : el.why === 'noble' ? '없음 — 이미 가득 참' : el.why === 'h' ? '주로 공유 결합 (산에서는 H⁺)' : '없음 — 전자를 함께 쓰는 공유 결합'}</span></div>`;
        }
        const { p, A, B } = a;
        return `<div class="data-row"><span class="data-name">만나는 원자</span><span class="data-val">${A.name}(${A.sym}, 바깥 전자 ${valence(A)}개)${p.a === p.b ? ' 둘' : ` + ${B.name}(${B.sym}, 바깥 전자 ${valence(B)}개)`}</span></div>` +
            `<div class="data-row"><span class="data-name">결합</span><span class="data-val">${p.bond === 'ionic' ? `이온 결합 — ${A.name} ${a.na}개가 전자 ${valence(A) * a.na}개를 ${B.name} ${a.nb}개에 넘김` : `공유 결합 — 전자 ${p.bonds.reduce((s, b) => s + b.pairs, 0)}쌍을 함께 씀`}</span></div>` +
            `<div class="data-row"><span class="data-name">${p.formula}</span><span class="data-val">${p.name} · 상온에서 ${p.state} · 녹는점 ${meltText(p)}</span></div>` +
            `<div class="data-row match"><span class="data-name">전기</span><span class="data-val">${p.bond === 'ionic' ? `고체 ✗ · 녹인 액체 ✓${p.aq === 'yes' ? ' · 수용액 ✓' : p.aq === 'insoluble' ? ' · 물에 거의 안 녹음' : ' · 물과 만나면 반응함'}` : '이온이 없어 흐르지 않음'}</span></div>`;
    }

    function render() {
        const a = analyse();
        mainGroup.innerHTML = a.kind === 'elements' ? renderElements(a) : renderBonds(a);
        graphGroup.innerHTML = a.kind === 'elements' ? graphElements(a) : graphBonds(a);
        stageBadge.textContent = a.kind === 'elements' ? `${a.el.name} ${a.el.sym} · ${a.el.period}주기 ${a.el.group}족` : `${PAIRS[state.pair].label} → ${PAIRS[state.pair].formula}`;
        methodHint.textContent = a.kind === 'elements' ? '가장 바깥 껍질의 전자 수가 원소의 성질을 정합니다'
            : '금속은 전자를 내주고, 비금속끼리는 전자를 함께 씁니다';
        dataNote.innerHTML = noteFor(a);
        return a;
    }

    /* --------------------------------------------------------------- run */
    function tick(dt) {
        state.progress = Math.min(1, state.progress + dt / RUN_SECONDS);
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
        if (a.kind === 'elements') {
            const { el, v } = a;
            labelA.textContent = '바깥 전자'; valueA.textContent = `${v}개 (배치 ${el.shells.join('·')})`;
            labelB.textContent = '되는 이온'; valueB.textContent = el.ion ? el.ion.sym : '없음';
            const sib = a.siblings.map(e => e.name).join('·');
            const sameIon = el.ion ? a.siblings.filter(e => e.ion && e.ion.q === el.ion.q).map(e => e.name).join('·') : '';
            s = `${el.name}(${el.sym})${pEun(el.name)} 원자 번호 ${el.z}, 전자 ${el.z}개가 ${el.shells.length === 1 ? '첫 껍질에' : `안쪽부터 ${el.shells.join('·')}개씩`} 들어 있습니다. `;
            if (a.verdict === 'cation') {
                s += `바깥 전자 ${v}개를 잃으면 남는 배치가 비활성 기체 ${el.ion.noble}과 같아지므로 ${el.ion.sym}이 됩니다. `;
                s += sameIon ? `같은 세로줄(${el.group}족)의 ${sameIon}도 바깥 전자가 ${v}개여서 모두 +${v} 이온이 됩니다. `
                    : `같은 세로줄(${el.group}족)의 ${sib}도 바깥 전자가 ${v}개이지만, 원자가 작아 전자를 놓기 어려워 이 모형에서는 단원자 이온으로 나타내지 않고 전자를 함께 씁니다. `;
                if (el.kind === '알칼리 금속') s += `알칼리 금속은 물과 만나 수소 기체를 내며 반응하는데, 아래로 갈수록(Li < Na < K) 바깥 전자가 핵에서 멀어 더 쉽게 잃으므로 반응이 더 셉니다. `;
                else if (el.kind === '알칼리 토금속') s += `2족은 전자 두 개를 잃어야 하므로 1족보다는 반응이 덜 격렬하지만, 마찬가지로 아래로 갈수록 반응이 세집니다. `;
                else s += `알루미늄은 전자 세 개까지 잃는 금속입니다. 규소는 이 모형에서 단원자 이온 대신 공유 결합의 예로 다룹니다. `;
            } else if (a.verdict === 'anion') {
                s += `바깥 전자가 ${v}개라 ${8 - v}개만 더 있으면 비활성 기체 ${el.ion.noble}과 같은 배치가 되므로, 전자를 얻어 ${el.ion.sym}이 됩니다. 같은 세로줄(${el.group}족)의 ${sameIon}도 바깥 전자가 ${v}개여서 같은 이온이 됩니다. `;
                if (el.kind === '할로젠') s += `할로젠은 전자 하나만 얻으면 되어 금속과 잘 반응해 소금 같은 물질을 만들고, 위로 갈수록(F > Cl) 반응이 더 셉니다. `;
                else s += `얻어야 하는 전자가 많을수록 이온이 되기는 어려워, 이런 원소는 금속과 만나면 이온이 되지만 비금속과 만나면 전자를 함께 씁니다. `;
            } else if (el.why === 'noble') {
                s += `가장 바깥 껍질이 ${v}개로 가득 차 있어 전자를 잃거나 얻을 까닭이 없습니다. 그래서 비활성 기체는 다른 원자와 거의 결합하지 않고 원자 하나하나로 떠다닙니다. `;
            } else if (el.why === 'h') {
                s += `수소는 전자가 하나뿐이어서 1족에 있지만 금속이 아닙니다. 하나를 잃기도, 하나를 얻어 헬륨 배치를 만들기도 하지만, 보통은 다른 원자와 전자를 함께 쓰는 공유 결합을 합니다(H₂, H₂O). 산에서는 전자를 잃은 H⁺로 있습니다. `;
            } else {
                s += `바깥 전자가 ${v}개라 ${8 - v}개를 얻기도 ${v}개를 잃기도 힘듭니다. 그래서 이 모형에서는 단원자 이온으로 나타내지 않고 다른 원자와 전자를 함께 쓰는 공유 결합을 합니다${el.sym === 'C' ? '(다이아몬드, 이산화 탄소, 생명체의 몸)' : el.sym === 'Si' ? '(모래·유리·반도체)' : ''}. `;
            }
            s += `주기율표에서 세로줄이 같으면 바깥 전자 수가 같고, 그래서 성질이 닮습니다.`;
        } else {
            const { p, A, B } = a;
            if (a.same) { labelA.textContent = '함께 쓰는 전자쌍'; valueA.textContent = `${a.pairs}쌍`; }
            else { labelA.textContent = '만나는 비율'; valueA.textContent = `${A.name} ${a.na} : ${B.name} ${a.nb}`; }
            labelB.textContent = '만들어진 물질'; valueB.textContent = `${p.formula} · ${p.bond === 'ionic' ? '이온 결합' : '공유 결합'}`;
            const vA = valence(A), vB = valence(B);
            if (p.bond === 'ionic') {
                const e = vA * a.na;
                const ionA = ELEMENTS.find(x => x.sym === A.sym).ion.sym, ionB = ELEMENTS.find(x => x.sym === B.sym).ion.sym;
                s = `${A.name}${pEun(A.name)} 금속, ${B.name}${pEun(B.name)} 비금속입니다. ${A.name} 원자는 바깥 전자 ${vA}개를 잃어야 하고 ${B.name} 원자는 ${8 - vB}개를 얻어야 안정해지므로, 넘기는 수와 받는 수가 맞게 ${A.name} ${a.na}개가 ${B.name} ${a.nb}개에게 전자 ${e}개를 넘겨 ${ionA}과 ${ionB}이 됩니다. `;
                s += `반대 전하의 이온이 서로 끌어당겨 규칙적으로 쌓인 것이 ${p.formula}(${p.name}${p.note ? `, ${p.note}` : ''})입니다. 이온 사이의 끌림이 세서 녹는점이 ${p.melt} ℃로 높고, 고체일 때는 이온이 제자리에 묶여 전류가 흐르지 않지만 녹이면 이온이 움직여 흐릅니다. `;
                s += p.aq === 'yes' ? '물에 풀어도 이온이 흩어져 전류가 흐릅니다.' : p.aq === 'insoluble' ? '물에는 거의 녹지 않습니다.' : '물과 만나면 반응해 수산화 나트륨이 됩니다.';
            } else {
                const pairs = a.pairs;
                const need = el => el.sym === 'H' ? 1 : 8 - valence(el);
                s = a.same ? `${A.name} 원자는 둘 다 비금속이어서 어느 쪽도 전자를 내주지 않습니다. 저마다 전자 ${need(A)}개가 더 있어야 하므로 ${KOREAN_COUNT[pairs]} 쌍을 함께 써서 둘 다 바깥 껍질을 채웁니다. `
                    : `${A.name}${pWa(A.name)} ${B.name}${pEun(B.name)} 둘 다 비금속이어서 어느 쪽도 전자를 내주지 않습니다. ${A.name}${pEun(A.name)} 전자 ${need(A)}개, ${B.name}${pEun(B.name)} ${need(B)}개가 더 있어야 하므로 ${A.name} ${a.na}개와 ${B.name} ${a.nb}개가 전자 ${KOREAN_COUNT[pairs]} 쌍을 함께 써서 모두 바깥 껍질을 채웁니다. `;
                s += `이렇게 묶인 원자 ${p.atoms.length}개가 ${p.formula} 분자 하나입니다. 분자 안의 결합은 단단하지만 분자와 분자 사이의 끌림은 약해 녹는점이 ${meltText(p)}로 낮아 상온에서 ${p.state}이고, 이온이 없으니 전류가 흐르지 않습니다.`;
            }
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
        checkBtn.textContent = state.mode === 'elements' ? '전자 배치 보기' : '만나게 하기';
        stageCaption.textContent = state.mode === 'elements'
            ? '원자핵 둘레의 껍질에 전자가 안쪽부터 차례로 들어갑니다. 첫 껍질은 2개, 다음은 8개까지입니다.'
            : '두 원소의 원자가 만나면 바깥 전자가 옮겨 가거나(이온 결합) 함께 쓰입니다(공유 결합).';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { period: '3', group: '1', pair: 'nacl', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'elements').click();
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

    window.__bondingModel = {
        ELEMENTS, PAIRS, GROUPS, PERIODS, state,
        analyse, render, elementAt, layoutOf,
        runSeconds: () => RUN_SECONDS,
        setMode(m) { modeButtons.find(b => b.dataset.mode === m).click(); },
        set(key, value) { state[key] = value; if (!elementAt(state.period, state.group)) state.group = '1'; buildControls(); buildPrediction(); settingsChanged(); },
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
