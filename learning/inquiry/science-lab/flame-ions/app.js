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

    const GRAPH = { x0: 62, x1: 424, y0: 152, y1: 26 };
    const RUN_SECONDS = 8;

    const batchim = w => {
        const c = w.charCodeAt(w.length - 1);
        return c >= 0xAC00 && c <= 0xD7A3 ? (c - 0xAC00) % 28 !== 0 : false;
    };
    const eun = w => w + (batchim(w) ? '은' : '는');
    const iga = w => w + (batchim(w) ? '이' : '가');
    const eul = w => w + (batchim(w) ? '을' : '를');

    /* ------------------------------------------------------- flame data */
    // Emission lines (nm) with rough relative brightness. The flame colour is
    // what the eye sees; the lines are what a spectroscope separates it into.
    const METALS = {
        li: { name: '리튬', symbol: 'Li', charge: 1, colour: 'red', hex: '#ff3b30', lines: [[610.4, 0.35], [670.8, 1]] },
        na: { name: '나트륨', symbol: 'Na', charge: 1, colour: 'yellow', hex: '#ffcf33', lines: [[589.0, 1], [589.6, 0.9]] },
        k: { name: '칼륨', symbol: 'K', charge: 1, colour: 'violet', hex: '#b57bff', lines: [[404.4, 0.5], [404.7, 0.45], [766.5, 1], [769.9, 0.85]] },
        ca: { name: '칼슘', symbol: 'Ca', charge: 2, colour: 'orange', hex: '#ff8a3d', lines: [[422.7, 0.7], [616.2, 0.6], [618.2, 0.5], [620.3, 0.4], [643.9, 0.3]] },
        cu: { name: '구리', symbol: 'Cu', charge: 2, colour: 'green', hex: '#2ec4b6', lines: [[510.6, 0.9], [515.3, 0.8], [521.8, 1], [578.2, 0.3]] },
        sr: { name: '스트론튬', symbol: 'Sr', charge: 2, colour: 'red', hex: '#e0182d', lines: [[460.7, 0.6], [650.4, 0.7], [687.8, 0.9], [707.0, 0.5]] },
    };
    const ANIONS = {
        cl: { name: '염화', formula: 'Cl', charge: 1, poly: false },
        no3: { name: '질산', formula: 'NO₃', charge: 1, poly: true },
        so4: { name: '황산', formula: 'SO₄', charge: 2, poly: true },
        co3: { name: '탄산', formula: 'CO₃', charge: 2, poly: true },
    };
    const COLOURS = {
        red: { label: '빨강', note: '리튬·스트론튬' }, yellow: { label: '노랑', note: '나트륨' },
        violet: { label: '보라', note: '칼륨' }, orange: { label: '주황', note: '칼슘' }, green: { label: '청록', note: '구리' },
    };
    // The two red flames are told apart by their lines, so each names the other.
    const LOOKALIKE = { li: 'sr', sr: 'li' };

    const SUB = '₀₁₂₃₄₅₆₇₈₉';
    const sub = n => (n === 1 ? '' : String(n).split('').map(d => SUB[Number(d)]).join(''));
    const gcd = (a, b) => (b ? gcd(b, a % b) : a);
    function compound(metal, anion) {
        const g = gcd(metal.charge, anion.charge);
        const nm = anion.charge / g, na = metal.charge / g;
        const anionPart = anion.poly && na > 1 ? `(${anion.formula})${sub(na)}` : `${anion.formula}${sub(na)}`;
        return { name: `${anion.name} ${metal.name}`, formula: `${metal.symbol}${sub(nm)}${anionPart}` };
    }

    /* --------------------------------------------------------- ion data */
    // Mobility in water (m² per volt-second) from limiting ionic conductivities.
    // Wet filter paper roughly halves it: the ions have to wind between fibres.
    const IONS = {
        kmno4: { name: '과망간산 칼륨', formula: 'KMnO₄', ion: '과망간산 이온', ionFormula: 'MnO₄⁻', charge: -1, hex: '#8e2de2',
                 mobility: 6.35e-8, other: '칼륨 이온', otherFormula: 'K⁺' },
        cuso4: { name: '황산 구리', formula: 'CuSO₄', ion: '구리 이온', ionFormula: 'Cu²⁺', charge: 2, hex: '#2f80ed',
                 mobility: 5.56e-8, other: '황산 이온', otherFormula: 'SO₄²⁻' },
        k2cro4: { name: '크로뮴산 칼륨', formula: 'K₂CrO₄', ion: '크로뮴산 이온', ionFormula: 'CrO₄²⁻', charge: -2, hex: '#f2c418',
                  mobility: 8.8e-8, other: '칼륨 이온', otherFormula: 'K⁺' },
    };
    const PAPER_FACTOR = 0.5;
    const STRIP_M = 0.05;          // 5 cm of paper between the electrodes
    const RUN_MINUTES = 20;
    const KT_OVER_E = 0.0257;      // volts, at room temperature: turns mobility into diffusion
    const CRYSTAL_MM = 1.5;        // half-width of the speck of crystal at the start

    const state = {
        mode: 'flame',
        metal: 'na', anion: 'cl',
        sample: 'kmno4', volts: 12, leftPlus: true,
        progress: 0, prediction: null,
    };
    let running = false, frameId = 0, lastStamp = 0;

    /* ------------------------------------------------------------ models */
    function analyseFlame(s = state) {
        const metal = METALS[s.metal], anion = ANIONS[s.anion];
        const c = compound(metal, anion);
        const brightest = [...metal.lines].sort((a, b) => b[1] - a[1]).slice(0, 2).map(l => l[0]);
        return { kind: 'flame', metal, anion, compound: c, colour: metal.colour, lookalike: LOOKALIKE[s.metal] ? METALS[LOOKALIKE[s.metal]] : null, brightest };
    }

    // how strongly the flame is coloured at progress p: the wire goes in, the
    // salt vaporises, then it is used up
    function flameIntensity(p) {
        if (p < 0.3) return 0;
        if (p < 0.45) return (p - 0.3) / 0.15;
        if (p < 0.85) return 1;
        return Math.max(0, 1 - (p - 0.85) / 0.15);
    }

    function analyseIon(s = state) {
        const sample = IONS[s.sample];
        const field = s.volts / STRIP_M;                                   // V/m
        const speed = PAPER_FACTOR * sample.mobility * field;              // m/s
        const diffusion = PAPER_FACTOR * sample.mobility * KT_OVER_E;      // m²/s
        const seconds = RUN_MINUTES * 60;
        const travelMm = Math.min(speed * seconds * 1000, STRIP_M * 500 - CRYSTAL_MM);
        const spreadMm = Math.sqrt(2 * diffusion * seconds) * 1000;        // one standard deviation
        // a negative ion goes to the (+) electrode; which side that is depends on the wiring
        const towardPlus = sample.charge < 0;
        const dir = s.volts === 0 ? 0 : (towardPlus === s.leftPlus ? -1 : 1);  // -1 = left
        const verdict = s.volts === 0 ? 'none' : towardPlus ? 'plus' : 'minus';
        return { kind: 'ion', sample, field, speed, diffusion, travelMm, spreadMm, dir, verdict, towardPlus };
    }

    const ionAt = (p, a) => {
        const t = p * RUN_MINUTES * 60;
        return { minutes: p * RUN_MINUTES, mm: Math.min(a.speed * t * 1000, a.travelMm), sigma: Math.sqrt(2 * a.diffusion * t) * 1000 };
    };

    const analyse = () => (state.mode === 'flame' ? analyseFlame() : analyseIon());

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
        if (state.mode === 'flame') {
            controlArea.innerHTML =
                pickRow('금속 원소', 'metal', Object.entries(METALS).map(([k, v]) => ({ value: k, label: v.name, hint: v.symbol })), state.metal, 3) +
                pickRow('음이온 부분', 'anion', Object.entries(ANIONS).map(([k, v]) => ({ value: k, label: v.name, hint: v.formula + (v.charge === 2 ? '²⁻' : '⁻') })), state.anion, 4);
        } else {
            controlArea.innerHTML =
                pickRow('시료', 'sample', Object.entries(IONS).map(([k, v]) => ({ value: k, label: v.name, hint: v.formula })), state.sample, 3) +
                sliderRow('voltRange', '전압', 0, 18, 6, state.volts, ['0V', '9V', '18V']) +
                pickRow('전극 배치', 'leftPlus', [{ value: 'true', label: '왼쪽 (+) · 오른쪽 (−)' }, { value: 'false', label: '왼쪽 (−) · 오른쪽 (+)' }], state.leftPlus, 2);
        }
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                const v = button.dataset.value;
                state[group.dataset.pick] = group.dataset.pick === 'leftPlus' ? v === 'true' : v;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                settingsChanged();
            }));
        });
        const volt = document.getElementById('voltRange');
        if (volt) volt.addEventListener('input', () => { state.volts = Number(volt.value); settingsChanged(); });
    }

    const PRED_FLAME = Object.entries(COLOURS).map(([value, c]) => ({ value, label: c.label }));
    const PRED_ION = [{ value: 'plus', label: '(+)극 쪽으로' }, { value: 'minus', label: '(−)극 쪽으로' }, { value: 'none', label: '움직이지 않는다' }];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list = state.mode === 'flame' ? PRED_FLAME : PRED_ION;
        predictionLegend.textContent = state.mode === 'flame' ? '불꽃은 무슨 색일까요?' : '색은 어느 쪽으로 움직일까요?';
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    // visible wavelength to a screen colour, dimming toward both ends of sight
    function wlToRgb(w) {
        let r = 0, g = 0, b = 0;
        if (w >= 380 && w < 440) { r = -(w - 440) / 60; b = 1; }
        else if (w < 490) { g = (w - 440) / 50; b = 1; }
        else if (w < 510) { g = 1; b = -(w - 510) / 20; }
        else if (w < 580) { r = (w - 510) / 70; g = 1; }
        else if (w < 645) { r = 1; g = -(w - 645) / 65; }
        else if (w <= 780) { r = 1; }
        const f = w < 420 ? 0.3 + 0.7 * (w - 380) / 40 : w > 700 ? 0.3 + 0.7 * (780 - w) / 80 : 1;
        return `rgb(${Math.round(255 * r * f)},${Math.round(255 * g * f)},${Math.round(255 * b * f)})`;
    }

    function flamePath(cx, baseY, h, wf = 1) {
        const w = 13 * wf;
        return `M${cx},${baseY} C${(cx - w).toFixed(1)},${(baseY - h * 0.2).toFixed(1)} ${(cx - w * 0.8).toFixed(1)},${(baseY - h * 0.7).toFixed(1)} ${cx},${(baseY - h).toFixed(1)} ` +
               `C${(cx + w * 0.8).toFixed(1)},${(baseY - h * 0.7).toFixed(1)} ${(cx + w).toFixed(1)},${(baseY - h * 0.2).toFixed(1)} ${cx},${baseY} Z`;
    }

    function renderFlame(a, p) {
        const CX = 250, BASE = 168;
        const k = flameIntensity(p);
        let out = '';

        // dark observation chamber for flame reaction
        out += `<rect class="flame-chamber" x="180" y="32" width="140" height="174" rx="8"/>`;
        out += `<text class="small-label" style="fill:#94a3b8" x="250" y="48" text-anchor="middle">암실 관찰대</text>`;

        // burner
        out += `<rect class="stand" x="${CX - 40}" y="192" width="80" height="8" rx="2"/>`;
        out += `<rect class="burner" x="${CX - 7}" y="${BASE}" width="14" height="24" rx="2"/>`;
        out += `<path class="burner-flame" d="${flamePath(CX, BASE, 88)}"/>`;
        out += `<path class="burner-flame inner" d="${flamePath(CX, BASE, 40, 0.5)}"/>`;
        if (k > 0) {
            out += `<path fill="${a.metal.hex}" opacity="${(0.9 * k).toFixed(2)}" d="${flamePath(CX, BASE - 4, 96, 1.15)}"/>`;
            out += `<path fill="#fff" opacity="${(0.35 * k).toFixed(2)}" d="${flamePath(CX, BASE - 20, 46, 0.45)}"/>`;
        }

        // the beaker of sample solution
        const BX = 84, BY = 116;
        out += `<path class="glass" d="M${BX - 26},${BY - 10} L${BX - 26},${BY + 48} Q${BX - 26},${BY + 56} ${BX - 18},${BY + 56} L${BX + 18},${BY + 56} Q${BX + 26},${BY + 56} ${BX + 26},${BY + 48} L${BX + 26},${BY - 10}"/>`;
        out += `<rect fill="${a.metal.hex}" opacity=".18" x="${BX - 25}" y="${BY + 14}" width="50" height="41" rx="3"/>`;
        out += `<text class="part-label" x="${BX}" y="${BY + 76}" text-anchor="middle">${a.compound.name}</text>`;
        out += `<text class="small-label" x="${BX}" y="${BY + 90}" text-anchor="middle">${a.compound.formula} 수용액</text>`;

        // the wire: in the beaker until it is lifted into the flame
        const lift = Math.min(1, Math.max(0, (p - 0.18) / 0.14));
        const lx = BX + (CX - BX) * lift, ly = (BY + 30) + ((BASE - 62) - (BY + 30)) * lift;
        out += `<line class="wire" x1="${(lx - 70).toFixed(1)}" y1="${(ly - 60).toFixed(1)}" x2="${lx.toFixed(1)}" y2="${ly.toFixed(1)}"/>`;
        out += `<circle class="wire-loop" cx="${lx.toFixed(1)}" cy="${(ly + 4).toFixed(1)}" r="4.5"/>`;
        out += `<rect class="handle" x="${(lx - 84).toFixed(1)}" y="${(ly - 72).toFixed(1)}" width="18" height="16" rx="3" transform="rotate(41 ${(lx - 75).toFixed(1)} ${(ly - 64).toFixed(1)})"/>`;

        // readouts
        const c = COLOURS[a.colour];
        out += `<text class="part-label" x="336" y="82">불꽃 색</text>`;
        out += `<text class="read-text" style="fill:#0f172a" x="336" y="102">${k > 0 ? c.label : '파란 불꽃'}</text>`;
        out += `<text class="part-label" x="336" y="128">색을 내는 원소</text>`;
        out += `<text class="read-text" style="fill:#0f172a" x="336" y="148">${k > 0 ? `${a.metal.name} ${a.metal.symbol}` : '-'}</text>`;
        out += `<text class="note-text" x="336" y="170">${p < 0.18 ? '시료를 묻히는 중' : k > 0 ? '시료가 불꽃에서 빛을 냅니다' : p >= 0.85 ? '시료가 다 날아갔습니다' : '불꽃으로 옮기는 중'}</text>`;

        const text = k > 0 || p >= 0.85 ? `${a.compound.name} → ${c.label} 불꽃` : `${a.compound.name} — 불꽃에 넣기 전`;
        out += `<text class="verdict-text" fill="#0f172a" x="20" y="28">${text}</text>`;
        return out;
    }

    // one coloured ion cloud: a stack of slices whose opacity falls off like a bell
    function cloud(cx, y, h, halfMm, sigmaMm, hex, pxPerMm) {
        const N = 13;
        let out = '';
        const total = halfMm + 2.5 * sigmaMm;
        for (let i = 0; i < N; i += 1) {
            const f = (i + 0.5) / N;
            const half = total * f;
            const op = f <= halfMm / total ? 0.85 : 0.85 * Math.exp(-0.5 * Math.pow((half - halfMm) / Math.max(0.01, sigmaMm), 2));
            out += `<rect fill="${hex}" opacity="${(op / N * 2.2).toFixed(3)}" x="${(cx - half * pxPerMm).toFixed(1)}" y="${y}" width="${(2 * half * pxPerMm).toFixed(1)}" height="${h}" rx="3"/>`;
        }
        return out;
    }

    function renderIon(a, p) {
        const at = ionAt(p, a);
        const X0 = 80, X1 = 380, Y = 104, H = 36, MID = 230;
        const pxPerMm = (X1 - X0) / (STRIP_M * 1000);
        const plusX = state.leftPlus ? X0 - 14 : X1 + 14, minusX = state.leftPlus ? X1 + 14 : X0 - 14;
        let out = '';

        // power supply and wires
        // the supply sits at the right so its reading stays clear of the verdict line
        out += `<rect class="supply" x="350" y="14" width="80" height="34" rx="6"/>`;
        out += `<text class="read-text" x="390" y="37" text-anchor="middle">${state.volts} V</text>`;
        out += `<text class="small-label" x="390" y="18" text-anchor="middle">전원 장치</text>`;
        out += `<path class="lead lead-plus" d="M366,48 L366,56 L${plusX},56 L${plusX},${Y - 2}"/>`;
        out += `<path class="lead lead-minus" d="M414,48 L414,64 L${minusX},64 L${minusX},${Y - 2}"/>`;
        out += `<rect class="clip clip-plus" x="${plusX - 5}" y="${Y - 2}" width="10" height="${H + 4}" rx="2"/>`;
        out += `<rect class="clip clip-minus" x="${minusX - 5}" y="${Y - 2}" width="10" height="${H + 4}" rx="2"/>`;
        out += `<text class="pole-text plus" x="${plusX}" y="${Y + H + 22}" text-anchor="middle">(+)극</text>`;
        out += `<text class="pole-text minus" x="${minusX}" y="${Y + H + 22}" text-anchor="middle">(−)극</text>`;

        // the wet strip and the colour on it
        out += `<rect class="strip" x="${X0}" y="${Y}" width="${X1 - X0}" height="${H}" rx="3"/>`;
        const cx = MID + a.dir * at.mm * pxPerMm;
        out += cloud(cx, Y + 3, H - 6, CRYSTAL_MM, at.sigma, a.sample.hex, pxPerMm);
        out += `<line class="mid-mark" x1="${MID}" y1="${Y - 6}" x2="${MID}" y2="${Y + H + 6}"/>`;

        // ruler in centimetres from the starting point
        for (let mm = -25; mm <= 25; mm += 5) {
            const x = MID + mm * pxPerMm;
            const major = mm % 10 === 0;
            out += `<line class="ruler" x1="${x.toFixed(1)}" y1="${Y + H + 2}" x2="${x.toFixed(1)}" y2="${Y + H + (major ? 9 : 5)}"/>`;
            if (major && Math.abs(mm) < 25) out += `<text class="axis-text" x="${x.toFixed(1)}" y="${Y + H + 20}" text-anchor="middle">${mm === 0 ? '0' : `${mm / 10} cm`}</text>`;
        }

        // arrows for the coloured ion and its colourless partner
        if (state.volts > 0 && p > 0.02) {
            const ay = Y - 18, len = 34;
            const sx = MID + a.dir * 12, ex = sx + a.dir * len;
            out += `<line class="ion-arrow" stroke="${a.sample.hex}" x1="${sx}" y1="${ay}" x2="${ex}" y2="${ay}"/>`;
            out += `<path fill="${a.sample.hex}" d="M${ex},${ay} l${-a.dir * 7},-4 l0,8 z"/>`;
            out += `<text class="small-label" style="fill:#0f172a" x="${sx + a.dir * len / 2}" y="${ay - 7}" text-anchor="middle">${a.sample.ionFormula}</text>`;
            const sx2 = MID - a.dir * 12, ex2 = sx2 - a.dir * len;
            out += `<line class="ion-arrow ghost" x1="${sx2}" y1="${ay}" x2="${ex2}" y2="${ay}"/>`;
            out += `<path fill="#8fa8b0" opacity=".7" d="M${ex2},${ay} l${a.dir * 7},-4 l0,8 z"/>`;
            out += `<text class="small-label" x="${sx2 - a.dir * len / 2}" y="${ay - 7}" text-anchor="middle">${a.sample.otherFormula} (색 없음)</text>`;
        } else if (state.volts === 0) {
            out += `<text class="small-label" x="${MID}" y="${Y - 12}" text-anchor="middle">전압이 없어 끄는 힘이 없습니다</text>`;
        }

        out += `<text class="part-label" x="20" y="190">지난 시간 ${at.minutes.toFixed(0)}분</text>`;
        out += `<text class="part-label" x="160" y="190">움직인 거리 ${at.mm.toFixed(1)} mm</text>`;
        out += `<text class="note-text" x="316" y="190">퍼진 폭 ±${(2 * at.sigma).toFixed(1)} mm</text>`;

        const VERD = { plus: '(+)극 쪽으로 움직인다', minus: '(−)극 쪽으로 움직인다', none: '움직이지 않는다' };
        out += `<text class="verdict-text" fill="#0f172a" x="20" y="28">${a.sample.name} · ${state.volts} V → ${VERD[a.verdict]}</text>`;
        return out;
    }

    function renderMain(a) {
        mainGroup.innerHTML = a.kind === 'flame' ? renderFlame(a, state.progress) : renderIon(a, state.progress);
    }

    /* ------------------------------------------------------------ graphs */
    function graphFrame(xTicks, yTicks, xTitle, yTitle) {
        let out = '';
        yTicks.forEach(([v, y]) => {
            out += `<line class="grid-line" x1="${GRAPH.x0}" y1="${y.toFixed(1)}" x2="${GRAPH.x1}" y2="${y.toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(y + 3).toFixed(1)}" text-anchor="end">${v}</text>`;
        });
        xTicks.forEach(([v, x]) => {
            out += `<text class="axis-text" x="${x.toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${v}</text>`;
        });
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-title" x="${((GRAPH.x0 + GRAPH.x1) / 2).toFixed(1)}" y="${GRAPH.y0 + 30}" text-anchor="middle">${xTitle}</text>`;
        out += `<text class="axis-title" x="${GRAPH.x0 + 4}" y="${GRAPH.y1 - 8}">${yTitle}</text>`;
        return out;
    }

    const SPEC = { x0: 60, x1: 420, w0: 380, w1: 780 };
    const specX = w => SPEC.x0 + ((w - SPEC.w0) / (SPEC.w1 - SPEC.w0)) * (SPEC.x1 - SPEC.x0);

    function spectrumStrip(metal, y, h, k) {
        let out = `<rect class="spec-bg" x="${SPEC.x0}" y="${y}" width="${SPEC.x1 - SPEC.x0}" height="${h}" rx="3"/>`;
        // the faint rainbow says where each colour lives; the bright lines are the element
        const N = 60;
        for (let i = 0; i < N; i += 1) {
            const w = SPEC.w0 + ((i + 0.5) / N) * (SPEC.w1 - SPEC.w0);
            out += `<rect fill="${wlToRgb(w)}" opacity=".16" x="${(specX(w) - (SPEC.x1 - SPEC.x0) / N / 2).toFixed(1)}" y="${y}" width="${((SPEC.x1 - SPEC.x0) / N + 0.4).toFixed(1)}" height="${h}"/>`;
        }
        metal.lines.forEach(([w, b]) => {
            const x = specX(w);
            out += `<rect fill="${wlToRgb(w)}" opacity="${(0.35 * b * k).toFixed(2)}" x="${(x - 3).toFixed(1)}" y="${y}" width="6" height="${h}"/>`;
            out += `<rect fill="${wlToRgb(w)}" opacity="${(b * k).toFixed(2)}" x="${(x - 1.1).toFixed(1)}" y="${y}" width="2.2" height="${h}"/>`;
        });
        return out;
    }

    function graphFlame(a) {
        const k = Math.max(0.12, flameIntensity(state.progress));
        let out = `<text class="axis-title" x="${SPEC.x0}" y="20">선 스펙트럼 — ${a.metal.name} (${a.metal.symbol})</text>`;
        out += spectrumStrip(a.metal, 28, 42, k);
        if (a.lookalike) {
            out += `<text class="axis-title" x="${SPEC.x0}" y="98">비교 — ${a.lookalike.name} (${a.lookalike.symbol}) · 불꽃 색은 비슷하지만 선의 자리가 다릅니다</text>`;
            out += spectrumStrip(a.lookalike, 106, 42, 1);
        } else {
            out += `<text class="note-text" x="${SPEC.x0}" y="98">선이 있는 자리(파장)는 원소마다 정해져 있어 지문처럼 원소를 알아내는 데 씁니다.</text>`;
        }
        [400, 500, 600, 700].forEach(w => {
            out += `<line class="ruler" x1="${specX(w).toFixed(1)}" y1="160" x2="${specX(w).toFixed(1)}" y2="166"/>`;
            out += `<text class="axis-text" x="${specX(w).toFixed(1)}" y="178" text-anchor="middle">${w}</text>`;
        });
        out += `<line class="axis" x1="${SPEC.x0}" y1="160" x2="${SPEC.x1}" y2="160"/>`;
        out += `<text class="axis-title" x="${SPEC.x1}" y="178" text-anchor="end">파장 (nm)</text>`;
        return out;
    }

    function graphIon(a) {
        const total = RUN_MINUTES, t = state.progress * total;
        const yMax = 20;
        const gx = m => GRAPH.x0 + (m / total) * (GRAPH.x1 - GRAPH.x0);
        const gy = mm => GRAPH.y0 - (mm / yMax) * (GRAPH.y0 - GRAPH.y1);
        let out = graphFrame(
            [0, 5, 10, 15, 20].map(m => [m, gx(m)]),
            [0, 5, 10, 15, 20].map(v => [v, gy(v)]),
            '시간 (분)', '움직인 거리 (mm)');
        const line = (t1, cls) => {
            const pts = [];
            for (let i = 0; i <= 40; i += 1) {
                const m = (t1 * i) / 40;
                pts.push(`${gx(m).toFixed(1)},${gy(ionAt(m / total, a).mm).toFixed(1)}`);
            }
            return `<path class="${cls}" style="stroke:${a.sample.hex}${cls === 'trace-done' ? ';opacity:.3' : ''}" d="M${pts.join('L')}"/>`;
        };
        out += line(total, 'trace-done');
        if (t > 0) out += line(t, 'trace');
        const now = ionAt(state.progress, a);
        out += `<circle class="trace-dot" cx="${gx(t).toFixed(1)}" cy="${gy(now.mm).toFixed(1)}" r="5" fill="${a.sample.hex}"/>`;
        if (state.volts === 0) {
            out += `<text class="note-text" x="${GRAPH.x0 + 8}" y="${GRAPH.y1 + 14}">전압이 0이면 한쪽으로 가지 않고 양쪽으로 ±${(2 * a.spreadMm).toFixed(1)} mm 퍼지기만 합니다</text>`;
        } else {
            out += `<text class="note-text" x="${GRAPH.x0 + 8}" y="${GRAPH.y1 + 14}">1분에 ${(a.speed * 60000).toFixed(2)} mm — 전압이 높을수록 빨라집니다</text>`;
        }
        return out;
    }

    function noteFor(a) {
        if (a.kind === 'flame') {
            return `<div class="data-row"><span class="data-name">시료</span><span class="data-val">${a.compound.name} ${a.compound.formula}</span></div>` +
                `<div class="data-row"><span class="data-name">금속 원소</span><span class="data-val">${a.metal.name} ${a.metal.symbol}</span></div>` +
                `<div class="data-row"><span class="data-name">음이온 부분</span><span class="data-val">${a.anion.name} — 불꽃 색과는 상관없습니다</span></div>` +
                `<div class="data-row"><span class="data-name">가장 밝은 선</span><span class="data-val">${a.brightest.map(w => `${w.toFixed(1)} nm`).join(' · ')}</span></div>` +
                `<div class="data-row match"><span class="data-name">불꽃 색</span><span class="data-val">${COLOURS[a.colour].label} (${COLOURS[a.colour].note})</span></div>`;
        }
        const sign = a.sample.charge < 0 ? '(−)' : '(+)';
        return `<div class="data-row"><span class="data-name">시료</span><span class="data-val">${a.sample.name} ${a.sample.formula}</span></div>` +
            `<div class="data-row"><span class="data-name">색을 띤 이온</span><span class="data-val">${a.sample.ion} ${a.sample.ionFormula} · ${sign}전하</span></div>` +
            `<div class="data-row"><span class="data-name">전기장</span><span class="data-val">${state.volts} V ÷ 5 cm = ${a.field.toFixed(0)} V/m</span></div>` +
            `<div class="data-row"><span class="data-name">이동 속도</span><span class="data-val">1분에 ${(a.speed * 60000).toFixed(2)} mm</span></div>` +
            `<div class="data-row match"><span class="data-name">${RUN_MINUTES}분 뒤</span><span class="data-val">${a.verdict === 'none' ? `제자리에서 ±${(2 * a.spreadMm).toFixed(1)} mm 퍼짐` : `${a.verdict === 'plus' ? '(+)극' : '(−)극'} 쪽으로 ${a.travelMm.toFixed(1)} mm`}</span></div>`;
    }

    function render() {
        const a = analyse();
        renderMain(a);
        graphGroup.innerHTML = a.kind === 'flame' ? graphFlame(a) : graphIon(a);
        const vOut = document.getElementById('voltRangeOut');
        if (vOut) vOut.textContent = `${state.volts} V`;
        stageBadge.textContent = a.kind === 'flame'
            ? `${a.compound.name} · ${COLOURS[a.colour].label}`
            : `${a.sample.name} · ${state.volts} V`;
        methodHint.textContent = state.mode === 'flame'
            ? '불꽃 색은 화합물이 아니라 그 속의 금속 원소가 정합니다'
            : '이온은 전하를 띠어 반대 전하의 전극으로 끌려갑니다';
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
        if (a.kind === 'flame') {
            const c = COLOURS[a.colour];
            labelA.textContent = '불꽃 색'; labelB.textContent = '색을 내는 원소';
            valueA.textContent = c.label;
            valueB.textContent = `${a.metal.name} ${a.metal.symbol}`;
            predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
                : state.prediction === a.colour ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
            const others = Object.values(ANIONS).filter(x => x !== a.anion).slice(0, 2).map(x => `${x.name} ${a.metal.name}`).join('·');
            let s = `${eul(a.compound.name)} 불꽃에 넣으니 ${c.label} 불꽃이 나타났습니다. ` +
                `이 색은 ${a.anion.name} 부분이 아니라 금속 원소 ${iga(a.metal.name)} 내는 것이어서, ${others}도 모두 같은 ${c.label}입니다.`;
            if (a.lookalike) {
                const mine = a.brightest.map(w => `${w.toFixed(0)} nm`).join('·');
                const theirs = [...a.lookalike.lines].sort((x, y) => y[1] - x[1]).slice(0, 2).map(l => `${l[0].toFixed(0)} nm`).join('·');
                s += ` ${a.metal.name}과 ${eun(a.lookalike.name)} 불꽃 색이 비슷해 눈으로는 가르기 어렵지만, 선 스펙트럼에서 ${eun(a.metal.name)} ${mine}에, ${eun(a.lookalike.name)} ${theirs}에 밝은 선이 있어 구별됩니다.`;
            }
            explanation.textContent = s;
            return;
        }
        labelA.textContent = '움직인 방향'; labelB.textContent = '움직인 거리';
        const pole = a.verdict === 'plus' ? '(+)극' : '(−)극';
        valueA.textContent = a.verdict === 'none' ? '움직이지 않음' : `${pole} 쪽`;
        valueB.textContent = a.verdict === 'none' ? `±${(2 * a.spreadMm).toFixed(1)} mm 퍼짐` : `${RUN_MINUTES}분에 ${a.travelMm.toFixed(1)} mm`;
        predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        let s = '';
        if (a.verdict === 'none') {
            s = `전압을 걸지 않으면 이온을 끄는 힘이 없어 어느 쪽으로도 가지 않습니다. ` +
                `물속에서 저절로 퍼지는 만큼 양쪽으로 약 ${(2 * a.spreadMm).toFixed(1)} mm씩만 번졌습니다. 전압을 걸어 보세요.`;
        } else {
            const sign = a.sample.charge < 0 ? '(−)' : '(+)';
            s = `${a.sample.ion} ${eun(a.sample.ionFormula)} ${sign}전하를 띠므로 반대 전하인 ${pole} 쪽으로 끌려갑니다. ` +
                `${state.volts} V를 걸어 ${RUN_MINUTES}분 동안 ${a.travelMm.toFixed(1)} mm 움직였습니다. ` +
                `색이 없는 ${a.sample.other} ${eun(a.sample.otherFormula)} 반대쪽으로 갔지만 눈에는 보이지 않습니다. 전극을 바꿔 꽂으면 색도 반대로 움직입니다.`;
        }
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
        stageCaption.textContent = state.mode === 'flame'
            ? '같은 금속이 든 화합물은 음이온 부분이 달라도 불꽃 색이 같습니다.'
            : '색을 띤 이온이 어느 전극으로 가는지, 전극을 바꾸면 어떻게 되는지 보세요.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { metal: 'na', anion: 'cl', sample: 'kmno4', volts: 12, leftPlus: true, progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'flame').click();
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

    window.__flameIonModel = {
        METALS, ANIONS, IONS, COLOURS, PAPER_FACTOR, STRIP_M, RUN_MINUTES, state,
        analyseFlame, analyseIon, analyse, compound, ionAt, flameIntensity, wlToRgb, render,
        runSeconds: () => RUN_SECONDS,
        setMode(m) { modeButtons.find(b => b.dataset.mode === m).click(); },
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
        // 옮긴 것이 없는 실행은 우리 자신이 일으킨 메아리다. 그때 지우면 방금 옮긴 글이 사라진다.
        if (!rows.length && !notes.length && !verdicts.length) return;
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
    document.addEventListener('DOMContentLoaded', run);
})();
