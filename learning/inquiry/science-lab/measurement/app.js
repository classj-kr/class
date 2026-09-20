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
    // Sizes and durations, in metres and seconds, against a person and a heartbeat.
    const KINDS = {
        length: { label: '길이', unit: 'm', ref: 1.7, refLabel: '사람 키 1.7 m', eMin: -11, eMax: 27 },
        time: { label: '시간', unit: 's', ref: 1, refLabel: '심장 한 번 1초', eMin: -11, eMax: 18 },
    };
    const TARGETS = {
        length: {
            atom: { short: '원자', label: '수소 원자', value: 1.0e-10, words: '1억분의 1 cm' },
            virus: { short: '바이러스', label: '바이러스', value: 1.0e-7, words: '1만분의 1 mm' },
            cell: { short: '세포', label: '사람 세포', value: 2.0e-5, words: '0.02 mm' },
            ant: { short: '개미', label: '개미', value: 5e-3, words: '5 mm' },
            everest: { short: '에베레스트', label: '에베레스트 높이', value: 8.8e3, words: '8.8 km' },
            earth: { short: '지구', label: '지구 지름', value: 1.27e7, words: '1만 2,700 km' },
            sun: { short: '태양', label: '태양 지름', value: 1.39e9, words: '139만 km' },
            au: { short: '지구–태양', label: '지구–태양 거리', value: 1.5e11, words: '1억 5천만 km' },
            ly: { short: '1광년', label: '1광년', value: 9.46e15, words: '9조 4,600억 km' },
            galaxy: { short: '은하', label: '우리 은하 지름', value: 1.0e21, words: '약 10만 광년' },
            universe: { short: '우주', label: '관측 가능한 우주', value: 8.8e26, words: '약 930억 광년' },
        },
        time: {
            cesium: { short: '세슘 진동', label: '세슘 원자 진동 한 번', value: 1.09e-10, words: '약 100억분의 1초' },
            light: { short: '빛 1 m', label: '빛이 1 m 가는 시간', value: 3.3e-9, words: '약 3억분의 1초' },
            sound: { short: '소리 1 m', label: '소리가 1 m 가는 시간', value: 2.9e-3, words: '약 340분의 1초' },
            blink: { short: '눈 깜빡임', label: '눈 깜빡임', value: 0.3, words: '0.3초' },
            day: { short: '하루', label: '하루', value: 8.64e4, words: '86,400초' },
            year: { short: '1년', label: '1년', value: 3.156e7, words: '3,156만 초' },
            life: { short: '수명 80년', label: '사람 수명 80년', value: 2.52e9, words: '25억 초' },
            sapiens: { short: '사피엔스', label: '호모 사피엔스 30만 년', value: 9.5e12, words: '9조 5천억 초' },
            dino: { short: '공룡 멸종', label: '공룡 멸종 뒤 6,600만 년', value: 2.08e15, words: '2,080조 초' },
            earth: { short: '지구 나이', label: '지구 나이 46억 년', value: 1.45e17, words: '14.5경 초' },
            universe: { short: '우주 나이', label: '우주 나이 138억 년', value: 4.35e17, words: '43.5경 초' },
        },
    };
    const POW_WORDS = ['1', '10', '100', '1,000', '1만', '10만', '100만', '1,000만', '1억', '10억', '100억', '1,000억', '1조', '10조', '100조', '1,000조', '1경', '10경', '100경'];

    // What each base unit has been tied to, and roughly how well it could be reproduced (digits).
    const UNITS = { m: { label: '미터 (길이)' }, kg: { label: '킬로그램 (질량)' }, s: { label: '초 (시간)' }, K: { label: '켈빈 (온도)' } };
    const ERAS = { old: { label: '1800년대', hint: '처음 정할 때' }, mid: { label: '1900년대', hint: '원기의 시절' }, now: { label: '지금', hint: '2019년 뒤' } };
    const DEFS = {
        m: {
            old: { year: 1793, text: '지구 둘레(북극에서 적도까지)의 1천만분의 1', cat: 'nature', digits: 4 },
            mid: { year: 1889, text: '파리에 보관한 백금-이리듐 막대에 새긴 두 금 사이', cat: 'artifact', digits: 7 },
            now: { year: 1983, text: '빛이 진공에서 1/299,792,458초 동안 가는 거리', cat: 'constant', digits: 11 },
        },
        kg: {
            old: { year: 1795, text: '4 ℃ 물 1 L의 질량', cat: 'nature', digits: 4 },
            mid: { year: 1889, text: '파리에 보관한 백금-이리듐 원통(킬로그램 원기)', cat: 'artifact', digits: 8 },
            now: { year: 2019, text: '플랑크 상수(빛 알갱이 에너지의 기본 상수)에 맞춤', cat: 'constant', digits: 8 },
        },
        s: {
            old: { year: 1800, text: '하루(지구 자전)의 86,400분의 1', cat: 'nature', digits: 7 },
            mid: { year: 1956, text: '1900년 기준 지구 공전 주기의 31,556,925.9747분의 1', cat: 'nature', digits: 9 },
            now: { year: 1967, text: '세슘-133 원자가 내는 빛이 9,192,631,770번 진동하는 시간', cat: 'constant', digits: 16 },
        },
        K: {
            old: { year: 1742, text: '물의 어는점 0, 끓는점 100으로 나눈 눈금(섭씨)', cat: 'nature', digits: 3 },
            mid: { year: 1954, text: '물의 삼중점(얼음·물·수증기가 함께 있는 온도)의 1/273.16', cat: 'nature', digits: 6 },
            now: { year: 2019, text: '볼츠만 상수(온도와 알갱이 운동 에너지의 비)에 맞춤', cat: 'constant', digits: 6 },
        },
    };
    const CAT_LABEL = { nature: '지구·물 같은 자연물', artifact: '보관한 물건(원기)', constant: '변하지 않는 자연 상수' };

    // One stick, three rulers: read to a tenth of the smallest division.
    const RULERS = {
        cm: { label: '1 cm 눈금 자', div: 10, est: 1, hint: 'mm 자리를 어림' },
        mm: { label: '1 mm 눈금 자', div: 1, est: 0.1, hint: '0.1 mm 자리를 어림' },
        vernier: { label: '0.1 mm 눈금 (버니어)', div: 0.1, est: 0.01, hint: '0.01 mm 자리를 어림' },
    };
    const TRUE_MM = 123.46, READS = 10;

    const state = { mode: 'scale', kind: 'length', target: 'earth', unit: 'm', era: 'now', ruler: 'mm', progress: 0, prediction: null };
    let running = false, frameId = 0, lastStamp = 0;

    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const fmtN = n => Math.round(n).toLocaleString('ko-KR');
    const sup = n => String(n).replace('-', '⁻').replace(/\d/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
    const fmtSci = v => { const e = Math.floor(Math.log10(v)); const m = v / 10 ** e; return `${m.toFixed(1)} × 10${sup(e)}`; };
    const powWords = k => k <= 18 ? POW_WORDS[k] : `10${sup(k)}`;
    const decimals = est => est >= 1 ? 0 : est >= 0.1 ? 1 : 2;
    const DIGIT_JONG = { 0: 1, 1: 1, 2: 0, 3: 1, 4: 0, 5: 0, 6: 1, 7: 1, 8: 1, 9: 0 };   // read aloud: 영 일 이 삼 사 오 육 칠 팔 구
    const hasJong = txt => { const w = txt.replace(/[)\s]+$/, ''); const ch = w.slice(-1); if (/\d/.test(ch)) return DIGIT_JONG[ch] === 1; const c = ch.charCodeAt(0); return c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 > 0; };
    const pEun = txt => hasJong(txt) ? '은' : '는';

    /* ------------------------------------------------------------ models */
    function readingsFor(rulerKey) {
        const r = RULERS[rulerKey];
        let seed = { cm: 11, mm: 23, vernier: 37 }[rulerKey];
        const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
        // eye error: within a fifth of a division either way, then rounded to the estimated digit
        return Array.from({ length: READS }, () => Number((TRUE_MM + (rnd() * 2 - 1) * r.div / 5).toFixed(decimals(r.est))));
    }

    function analyse() {
        if (state.mode === 'scale') {
            const kind = KINDS[state.kind], t = TARGETS[state.kind][state.target];
            const lg = Math.log10(t.value / kind.ref), k = Math.abs(lg);
            return { kind: 'scale', k, t, lg, steps: Math.round(k), verdict: k < 4 ? 'near' : k < 8 ? 'mid' : 'far' };
        }
        if (state.mode === 'units') {
            const d = DEFS[state.unit][state.era];
            return { kind: 'units', d, verdict: d.cat };
        }
        const r = RULERS[state.ruler], reads = readingsFor(state.ruler);
        const mean = reads.reduce((s, v) => s + v, 0) / reads.length;
        const spread = (Math.max(...reads) - Math.min(...reads)) / 2;
        return { kind: 'measure', r, reads, mean, spread, verdict: state.ruler };
    }
    const runSeconds = () => state.mode === 'scale' ? 7 : state.mode === 'units' ? 6 : 6;

    /* ---------------------------------------------------------- controls */
    function pickRow(legend, name, options, current, cols) {
        return `<fieldset class="pick-field"><legend>${legend}</legend>` +
            `<div class="pick-buttons cols${cols}" data-pick="${name}">` +
            options.map(o => `<button type="button" data-value="${o.value}" class="${o.value === String(current) ? 'selected' : ''}">` +
                `${o.label}${o.hint ? `<small>${o.hint}</small>` : ''}</button>`).join('') +
            `</div></fieldset>`;
    }

    function buildControls() {
        if (state.mode === 'scale') {
            if (!TARGETS[state.kind][state.target]) state.target = Object.keys(TARGETS[state.kind])[5];
            controlArea.innerHTML = pickRow('무엇을 잴까', 'kind', Object.entries(KINDS).map(([k, v]) => ({ value: k, label: v.label, hint: `기준: ${v.refLabel}` })), state.kind, 2) +
                pickRow('대상', 'target', Object.entries(TARGETS[state.kind]).map(([k, v]) => ({ value: k, label: v.label })), state.target, 3);
        } else if (state.mode === 'units') {
            controlArea.innerHTML = pickRow('단위', 'unit', Object.entries(UNITS).map(([k, v]) => ({ value: k, label: v.label })), state.unit, 4) +
                pickRow('시대', 'era', Object.entries(ERAS).map(([k, v]) => ({ value: k, label: v.label, hint: v.hint })), state.era, 3);
        } else {
            controlArea.innerHTML = pickRow('자', 'ruler', Object.entries(RULERS).map(([k, v]) => ({ value: k, label: v.label, hint: v.hint })), state.ruler, 3);
        }
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                if (group.dataset.pick === 'kind') { state.target = Object.keys(TARGETS[state.kind])[5]; buildControls(); }
                else group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                buildPrediction();
                settingsChanged();
            }));
        });
    }

    const PRED_SCALE = [{ value: 'near', label: '1만 배 안' }, { value: 'mid', label: '1만 ~ 1억 배' }, { value: 'far', label: '1억 배 넘게' }];
    const PRED_UNITS = [{ value: 'nature', label: CAT_LABEL.nature }, { value: 'artifact', label: CAT_LABEL.artifact }, { value: 'constant', label: CAT_LABEL.constant }];
    const PRED_MEASURE = [{ value: 'cm', label: '1 mm 자리까지' }, { value: 'mm', label: '0.1 mm 자리까지' }, { value: 'vernier', label: '0.01 mm 자리까지' }];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list = state.mode === 'scale' ? PRED_SCALE : state.mode === 'units' ? PRED_UNITS : PRED_MEASURE;
        predictionLegend.textContent = state.mode === 'scale' ? `${TARGETS[state.kind][state.target].label}${pEun(TARGETS[state.kind][state.target].label)} ${KINDS[state.kind].refLabel}와 견주면 몇 배 크거나 작을까요?`
            : state.mode === 'units' ? `${ERAS[state.era].label}의 ${UNITS[state.unit].label} 기준은 무엇에 맞추었을까요?`
                : `${RULERS[state.ruler].label}로 재면 어느 자리까지 믿을 수 있을까요?`;
        predictionArea.className = 'prediction-buttons three';
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    function renderScale(a) {
        const kind = KINDS[state.kind], { t, lg } = a;
        const p = state.progress;
        const X0 = 24, X1 = 436, RY = 110;
        const xOf = v => X0 + (Math.log10(v) - kind.eMin) / (kind.eMax - kind.eMin) * (X1 - X0);
        let out = `<line class="rail" x1="${X0}" y1="${RY}" x2="${X1}" y2="${RY}"/>`;
        for (let e = kind.eMin; e <= kind.eMax; e += 1) {
            const x = xOf(10 ** e), major = e % 5 === 0;
            out += `<line class="tick ${major ? 'major' : ''}" x1="${x.toFixed(1)}" y1="${RY - (major ? 8 : 4)}" x2="${x.toFixed(1)}" y2="${RY + (major ? 8 : 4)}"/>`;
            if (major) out += `<text class="axis-text" x="${x.toFixed(1)}" y="${RY + 22}" text-anchor="middle">10${sup(e)}</text>`;
        }
        // the reference and the target
        const rx = xOf(kind.ref), tx = xOf(t.value);
        out += `<line class="ref-mark" x1="${rx.toFixed(1)}" y1="${RY - 30}" x2="${rx.toFixed(1)}" y2="${RY + 10}"/>`;
        out += `<text class="trait-text" style="fill:#0284c7" x="${rx.toFixed(1)}" y="${RY - 34}" text-anchor="middle">${kind.refLabel}</text>`;
        const curLg = Math.log10(kind.ref) + lg * p, cx = xOf(10 ** curLg);
        out += `<line class="marker" x1="${cx.toFixed(1)}" y1="${RY - 14}" x2="${cx.toFixed(1)}" y2="${RY + 14}"/>`;
        out += `<polygon class="marker-head" points="${cx.toFixed(1)},${RY - 14} ${(cx - 5).toFixed(1)},${RY - 22} ${(cx + 5).toFixed(1)},${RY - 22}"/>`;
        const steps = Math.floor(Math.abs(lg) * p + 1e-9);
        out += `<text class="big-text" fill="#d97706" x="230" y="40" text-anchor="middle">${steps === 0 && p === 0 ? '×1' : `${lg > 0 ? '×' : '÷'} ${powWords(steps)}`}</text>`;
        out += `<text class="trait-text" x="230" y="58" text-anchor="middle">${p >= 1 ? `${t.label}: ${fmtSci(t.value)} ${kind.unit} = ${t.words}` : `10배 눈금 ${steps}칸 ${lg > 0 ? '크게' : '작게'} · 지금 ${fmtSci(10 ** curLg)} ${kind.unit}`}</text>`;
        out += `<text class="trait-text" style="fill:#d97706" x="${clamp(tx, X0 + 40, X1 - 40).toFixed(1)}" y="${RY + 40}" text-anchor="middle">${t.label}</text>`;
        const VERD = { near: '1만 배 안', mid: '1만~1억 배', far: '1억 배 넘게' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${p >= 1 ? `${t.label}${pEun(t.label)} ${kind.refLabel.split(' ')[0]}의 ${powWords(a.steps)} 배 ${lg > 0 ? '크다' : '작다'} (${a.steps}자리) → ${VERD[a.verdict]}` : `${kind.refLabel}에서 ${t.label}까지`}</text>`;
        out += `<text class="trait-text" x="20" y="176">10배 눈금으로 재면 ${kind.label}의 세계는 ${kind.eMax - kind.eMin}칸 — 우리가 맨눈으로 보는 것은 그 가운데 두세 칸</text>`;
        out += `<text class="note-text" x="20" y="208">눈금 한 칸 = 10배 · 10${sup(kind.eMin)}부터 10${sup(kind.eMax)} ${kind.unit}까지</text>`;
        return out;
    }

    function graphScale(a) {
        const kind = KINDS[state.kind];
        const X0 = 24, X1 = 436, RY = 100;
        const xOf = v => X0 + (Math.log10(v) - kind.eMin) / (kind.eMax - kind.eMin) * (X1 - X0);
        let out = `<text class="axis-title" x="${X0}" y="18">${kind.label}의 규모 — 눈금 한 칸이 10배</text>`;
        out += `<line class="rail" x1="${X0}" y1="${RY}" x2="${X1}" y2="${RY}"/>`;
        for (let e = kind.eMin; e <= kind.eMax; e += 1) { const x = xOf(10 ** e); out += `<line class="tick" x1="${x.toFixed(1)}" y1="${RY - 3}" x2="${x.toFixed(1)}" y2="${RY + 3}"/>`; if (e % 5 === 0) out += `<text class="axis-text" x="${x.toFixed(1)}" y="${RY + 44}" text-anchor="middle">10${sup(e)}</text>`; }
        const items = Object.entries(TARGETS[state.kind]);
        const ROWS = [[-30, -34], [16, 28], [-46, -50]];     // tick end, label baseline: three rows so names do not collide
        items.forEach(([k, t], i) => {
            const x = xOf(t.value), row = ROWS[i % 3], mine = k === state.target;
            out += `<circle class="trace-dot ${mine ? 'chosen' : ''}" fill="${mine ? '#d97706' : '#475569'}" cx="${x.toFixed(1)}" cy="${RY}" r="${mine ? 5 : 3.5}"/>`;
            out += `<line class="tick" x1="${x.toFixed(1)}" y1="${RY}" x2="${x.toFixed(1)}" y2="${RY + row[0]}"/>`;
            out += `<text class="axis-text" style="fill:${mine ? '#d97706' : '#475569'};font-size:12px;font-weight:800" x="${clamp(x, X0 + 24, X1 - 24).toFixed(1)}" y="${RY + row[1]}" text-anchor="middle">${t.short}</text>`;
        });
        const rx = xOf(kind.ref);
        out += `<line class="ref-mark" x1="${rx.toFixed(1)}" y1="${RY - 62}" x2="${rx.toFixed(1)}" y2="${RY}"/><text class="axis-text" style="fill:#0284c7" x="${rx.toFixed(1)}" y="${RY - 66}" text-anchor="middle">기준</text>`;
        out += `<text class="axis-title" x="${((X0 + X1) / 2).toFixed(1)}" y="${RY + 70}" text-anchor="middle">${kind.unit === 'm' ? '원자에서 우주까지 38칸 — 사람은 한가운데쯤' : '원자의 진동에서 우주의 나이까지 29칸 — 1초는 아래쪽 3분의 1 자리'}</text>`;
        return out;
    }

    function renderUnits(a) {
        const p = state.progress;
        const defs = DEFS[state.unit];
        const target = defs[state.era];
        const Y0 = 1740, Y1 = 2030, X0 = 30, X1 = 430, TY = 150;
        const xOf = y => X0 + (y - Y0) / (Y1 - Y0) * (X1 - X0);
        const year = Y0 + (target.year - Y0) * p;
        let out = `<line class="rail" x1="${X0}" y1="${TY}" x2="${X1}" y2="${TY}"/>`;
        for (let y = 1750; y <= 2000; y += 50) out += `<line class="tick" x1="${xOf(y).toFixed(1)}" y1="${TY - 4}" x2="${xOf(y).toFixed(1)}" y2="${TY + 4}"/><text class="axis-text" x="${xOf(y).toFixed(1)}" y="${TY + 18}" text-anchor="middle">${y}</text>`;
        // three cards, one per era, revealed as the marker passes their year
        const wrap = (txt, n) => txt.match(new RegExp(`.{1,${n}}`, 'g')) || [txt];
        ['old', 'mid', 'now'].forEach((k, i) => {
            const d = defs[k], x = 24 + i * 140, shown = p > 0 && year >= d.year - 1, active = k === state.era;
            out += `<rect class="card ${active && p >= 1 ? 'active' : ''}" x="${x}" y="30" width="130" height="86" rx="6" opacity="${shown ? 1 : 0.35}"/>`;
            out += `<text class="card-title" x="${x + 8}" y="46">${ERAS[k].label}</text>`;
            if (shown) {
                out += `<text class="card-text" x="${x + 8}" y="70">${d.year}년</text>`;
                if (p >= 1 || !active) out += `<text class="card-text" style="fill:${d.cat === 'constant' ? '#059669' : d.cat === 'artifact' ? '#d97706' : '#0284c7'}" x="${x + 8}" y="108">${CAT_LABEL[d.cat]}</text>`;
            } else out += `<text class="card-text" x="${x + 8}" y="62">?</text>`;
            out += `<line class="tick major" x1="${xOf(d.year).toFixed(1)}" y1="${TY - 10}" x2="${xOf(d.year).toFixed(1)}" y2="${TY}"/>`;
            out += `<line class="tick" style="stroke:rgba(148, 163, 184, 0.35)" x1="${x + 65}" y1="116" x2="${xOf(d.year).toFixed(1)}" y2="${TY - 10}"/>`;
        });
        const mx = xOf(year);
        out += `<line class="marker" x1="${mx.toFixed(1)}" y1="${TY - 12}" x2="${mx.toFixed(1)}" y2="${TY + 12}"/><polygon class="marker-head" points="${mx.toFixed(1)},${TY + 12} ${(mx - 5).toFixed(1)},${TY + 20} ${(mx + 5).toFixed(1)},${TY + 20}"/>`;
        out += `<text class="trait-text" x="230" y="188" text-anchor="middle">${Math.round(year)}년${p >= 1 ? ` — ${UNITS[state.unit].label}: ${target.text}` : ''}</text>`;
        out += `<text class="verdict-text" fill="#0f172a" x="20" y="16">${p >= 1 ? `${ERAS[state.era].label} ${UNITS[state.unit].label.split(' ')[0]}의 기준: ${CAT_LABEL[target.cat]}` : `${UNITS[state.unit].label}의 기준은 어떻게 바뀌어 왔나`}</text>`;
        out += `<text class="note-text" x="20" y="208">기준은 재기 쉽고 변하지 않는 것을 찾아 자연물 → 원기 → 자연 상수로 옮겨 왔습니다 (2019년 완성)</text>`;
        return out;
    }

    function graphUnits(a) {
        const defs = DEFS[state.unit];
        const X0 = 60, X1 = 430, Y0 = 150, Y1 = 40, DMAX = 18;
        const yOf = d => Y0 - d / DMAX * (Y0 - Y1);
        let out = `<text class="axis-title" x="${X0}" y="18">기준을 얼마나 정확히 되살릴 수 있나 — 믿을 수 있는 자릿수 (대략)</text>`;
        [0, 3, 6, 9, 12, 15, 18].forEach(d => { out += `<line class="grid-line" x1="${X0}" y1="${yOf(d).toFixed(1)}" x2="${X1}" y2="${yOf(d).toFixed(1)}"/><text class="axis-text" x="${X0 - 6}" y="${(yOf(d) + 3.5).toFixed(1)}" text-anchor="end">${d}자리</text>`; });
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/>`;
        const step = (X1 - X0) / 3, W = 70;
        ['old', 'mid', 'now'].forEach((k, i) => {
            const d = defs[k], x = X0 + i * step + (step - W) / 2, mine = k === state.era;
            const color = d.cat === 'constant' ? '#059669' : d.cat === 'artifact' ? '#d97706' : '#0284c7';
            out += `<rect class="bar ${mine ? 'chosen' : ''}" fill="${color}" opacity="${mine ? 1 : 0.5}" x="${x.toFixed(1)}" y="${yOf(d.digits).toFixed(1)}" width="${W}" height="${(Y0 - yOf(d.digits)).toFixed(1)}" rx="2"/>`;
            out += `<text class="axis-text" style="fill:${mine ? '#0f172a' : '#475569'};font-weight:${mine ? '900' : '750'}" x="${(x + W / 2).toFixed(1)}" y="${(yOf(d.digits) - 4).toFixed(1)}" text-anchor="middle">10${sup(-d.digits)}</text>`;
            out += `<text class="axis-text" style="fill:${mine ? '#0f172a' : '#475569'};font-weight:${mine ? '900' : '750'}" x="${(x + W / 2).toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${ERAS[k].label} (${d.year})</text>`;
        });
        out += `<text class="axis-title" x="${((X0 + X1) / 2).toFixed(1)}" y="${Y0 + 32}" text-anchor="middle">${state.unit === 's' ? '초는 자연 상수에 묶인 뒤 가장 정확한 단위가 되어 다른 단위의 바탕이 됨' : state.unit === 'kg' ? '원기는 100년 동안 복제품과 50 μg 어긋나 2019년 상수로 바꿈' : '색: 파랑 자연물 · 노랑 원기 · 초록 자연 상수'}</text>`;
        return out;
    }

    function renderMeasure(a) {
        const { r, reads } = a;
        const p = state.progress;
        const shown = Math.floor(p * READS + 1e-9);
        const SX = 30, SY = 92, PX = 2.6, endX = SX + TRUE_MM * PX;
        let out = `<rect class="stick" x="${SX}" y="${SY}" width="${(TRUE_MM * PX).toFixed(1)}" height="16" rx="2"/>`;
        out += `<rect class="ruler-body" x="${SX - 6}" y="${SY + 18}" width="${(135 * PX + 6).toFixed(1)}" height="26" rx="2"/>`;
        // ruler ticks: every division, taller each centimetre
        const divPx = r.div * PX;
        if (divPx >= 1.5) for (let mm = 0; mm <= 135; mm += r.div) { const x = SX + mm * PX, cm = Math.abs(mm % 10) < 1e-9, five = Math.abs(mm % 5) < 1e-9; out += `<line class="ruler-tick" x1="${x.toFixed(1)}" y1="${SY + 18}" x2="${x.toFixed(1)}" y2="${SY + 18 + (cm ? 12 : five ? 8 : 5)}"/>`; }
        else for (let mm = 0; mm <= 135; mm += 1) { const x = SX + mm * PX, cm = mm % 10 === 0; out += `<line class="ruler-tick" x1="${x.toFixed(1)}" y1="${SY + 18}" x2="${x.toFixed(1)}" y2="${SY + 18 + (cm ? 12 : 5)}"/>`; }
        for (let cm = 0; cm <= 13; cm += 1) out += `<text class="axis-text" style="fill:#0f172a;font-size:11px;font-weight:700" x="${(SX + cm * 10 * PX).toFixed(1)}" y="${SY + 43}" text-anchor="middle">${cm}</text>`;
        out += `<line class="marker" x1="${endX.toFixed(1)}" y1="${SY - 6}" x2="${endX.toFixed(1)}" y2="${SY + 46}"/>`;
        // zoom on the end of the stick: one division either side
        const ZX = 300, ZY = 34, ZW = 140, ZH = 50;
        out += `<rect class="zoom-box" x="${ZX}" y="${ZY}" width="${ZW}" height="${ZH}" rx="4"/>`;
        const lo = Math.floor(TRUE_MM / r.div) * r.div - r.div, hi = lo + 3 * r.div;
        const zx = mm => ZX + (mm - lo) / (hi - lo) * ZW;
        for (let k = 0; k <= 3; k += 1) { const mm = lo + k * r.div, x = zx(mm); out += `<line class="ruler-tick" style="stroke:#0f172a" x1="${x.toFixed(1)}" y1="${ZY + ZH - 14}" x2="${x.toFixed(1)}" y2="${ZY + ZH}"/><text class="small-label" x="${x.toFixed(1)}" y="${ZY + ZH - 17}" text-anchor="middle">${Number(mm.toFixed(2))}</text>`; }
        for (let k = 1; k < 30; k += 1) { const x = zx(lo + k * r.div / 10); if (k % 10) out += `<line class="ruler-tick" style="stroke:rgba(220,233,232,.35)" x1="${x.toFixed(1)}" y1="${ZY + ZH - 6}" x2="${x.toFixed(1)}" y2="${ZY + ZH}"/>`; }
        out += `<rect class="stick" x="${ZX + 1}" y="${ZY + 6}" width="${(zx(TRUE_MM) - ZX - 1).toFixed(1)}" height="10"/>`;
        out += `<line class="marker" x1="${zx(TRUE_MM).toFixed(1)}" y1="${ZY + 2}" x2="${zx(TRUE_MM).toFixed(1)}" y2="${ZY + ZH}"/>`;
        out += `<text class="small-label" x="${ZX + ZW / 2}" y="${ZY - 5}" text-anchor="middle">끝부분 확대 — 눈금 사이를 눈으로 어림</text>`;
        // readings so far
        out += `<text class="gen-text" x="${SX}" y="160">${shown === 0 ? '아직 재지 않음' : `${shown}번째 읽음: ${reads[shown - 1].toFixed(decimals(r.est))} mm`}</text>`;
        out += `<text class="trait-text" x="${SX}" y="178">${shown ? reads.slice(0, shown).map(v => v.toFixed(decimals(r.est))).join(' · ') : `${r.label} — 눈금 ${r.div} mm, 마지막 자리는 ${r.est} mm 자리를 어림`}</text>`;
        const VERD = { cm: '1 mm 자리', mm: '0.1 mm 자리', vernier: '0.01 mm 자리' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${p >= 1 ? `${r.label}: 평균 ${a.mean.toFixed(decimals(r.est) + 1)} ± ${a.spread.toFixed(decimals(r.est) + 1)} mm → ${VERD[state.ruler]}까지` : `${r.label}로 같은 막대를 열 번 잽니다`}</text>`;
        out += `<text class="note-text" x="20" y="208">눈금 사이를 열 등분해 한 자리를 어림해 적습니다 — 그 마지막 자리는 재는 사람마다 조금씩 다릅니다</text>`;
        return out;
    }

    function graphMeasure(a) {
        const { r, reads } = a;
        const p = state.progress;
        const shown = Math.floor(p * READS + 1e-9);
        const X0 = 50, X1 = 430, Y0 = 130, half = r.div * 0.6;
        const lo = TRUE_MM - half, hi = TRUE_MM + half;
        const xOf = mm => X0 + (mm - lo) / (hi - lo) * (X1 - X0);
        let out = `<text class="axis-title" x="${X0}" y="18">열 번 읽은 값 — 파란 점, 노란 선은 평균, 초록 점선은 실제 길이</text>`;
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/>`;
        const nTicks = 6;
        for (let k = 0; k <= nTicks; k += 1) { const mm = lo + (hi - lo) * k / nTicks; out += `<line class="tick" x1="${xOf(mm).toFixed(1)}" y1="${Y0}" x2="${xOf(mm).toFixed(1)}" y2="${Y0 + 5}"/><text class="axis-text" x="${xOf(mm).toFixed(1)}" y="${Y0 + 17}" text-anchor="middle">${mm.toFixed(decimals(r.est) + 1)}</text>`; }
        const stacks = {};
        reads.slice(0, shown).forEach(v => { const key = v.toFixed(decimals(r.est)); stacks[key] = (stacks[key] || 0) + 1; out += `<circle class="reading-dot" cx="${xOf(v).toFixed(1)}" cy="${(Y0 - 8 - (stacks[key] - 1) * 12).toFixed(1)}" r="5"/>`; });
        if (shown) { const mean = reads.slice(0, shown).reduce((s, v) => s + v, 0) / shown; out += `<line class="mean-line" x1="${xOf(mean).toFixed(1)}" y1="40" x2="${xOf(mean).toFixed(1)}" y2="${Y0}"/><text class="axis-text" style="fill:#d97706" x="${xOf(mean).toFixed(1)}" y="36" text-anchor="middle">평균 ${mean.toFixed(decimals(r.est) + 1)}</text>`; }
        if (p >= 1) out += `<line class="true-line" x1="${xOf(TRUE_MM).toFixed(1)}" y1="48" x2="${xOf(TRUE_MM).toFixed(1)}" y2="${Y0}"/><text class="axis-text" style="fill:#059669" x="${xOf(TRUE_MM).toFixed(1)}" y="${Y0 + 30}" text-anchor="middle">실제 ${TRUE_MM} mm</text>`;
        out += `<text class="axis-title" x="${((X0 + X1) / 2).toFixed(1)}" y="${Y0 + 50}" text-anchor="middle">읽은 값 (mm) — 눈금이 ${r.div} mm인 자는 ±${(r.div / 5).toFixed(decimals(r.est) + 1)} mm쯤 흔들림</text>`;
        return out;
    }

    function noteFor(a) {
        if (a.kind === 'scale') {
            const kind = KINDS[state.kind], { t } = a;
            return `<div class="data-row"><span class="data-name">대상</span><span class="data-val">${t.label} = ${fmtSci(t.value)} ${kind.unit} (${t.words})</span></div>` +
                `<div class="data-row"><span class="data-name">기준</span><span class="data-val">${kind.refLabel}</span></div>` +
                `<div class="data-row"><span class="data-name">비율</span><span class="data-val">${a.lg > 0 ? '×' : '÷'} ${fmtSci(10 ** a.k)} = 10배 눈금 ${a.k.toFixed(1)}칸 (${a.steps}자리)</span></div>` +
                `<div class="data-row match"><span class="data-name">전체 눈금</span><span class="data-val">10${sup(kind.eMin)} ~ 10${sup(kind.eMax)} ${kind.unit}, ${kind.eMax - kind.eMin}칸</span></div>`;
        }
        if (a.kind === 'units') {
            const defs = DEFS[state.unit];
            return `<div class="data-row"><span class="data-name">${ERAS.old.label}</span><span class="data-val">${defs.old.year}년 · ${defs.old.text} — ${CAT_LABEL[defs.old.cat]}</span></div>` +
                `<div class="data-row"><span class="data-name">${ERAS.mid.label}</span><span class="data-val">${defs.mid.year}년 · ${defs.mid.text} — ${CAT_LABEL[defs.mid.cat]}</span></div>` +
                `<div class="data-row"><span class="data-name">${ERAS.now.label}</span><span class="data-val">${defs.now.year}년 · ${defs.now.text} — ${CAT_LABEL[defs.now.cat]}</span></div>` +
                `<div class="data-row match"><span class="data-name">정확도 (대략)</span><span class="data-val">${['old', 'mid', 'now'].map(k => `10${sup(-defs[k].digits)}`).join(' → ')}</span></div>`;
        }
        const { r, reads } = a;
        return `<div class="data-row"><span class="data-name">자</span><span class="data-val">${r.label} — 눈금 ${r.div} mm, 눈금 사이를 열 등분해 ${r.est} mm 자리를 어림</span></div>` +
            `<div class="data-row"><span class="data-name">열 번 읽음</span><span class="data-val">${reads.map(v => v.toFixed(decimals(r.est))).join(', ')} mm</span></div>` +
            `<div class="data-row"><span class="data-name">평균·흩어짐</span><span class="data-val">${a.mean.toFixed(decimals(r.est) + 1)} ± ${a.spread.toFixed(decimals(r.est) + 1)} mm</span></div>` +
            `<div class="data-row match"><span class="data-name">실제 길이</span><span class="data-val">${TRUE_MM} mm (어떤 자로도 정확히는 못 잼)</span></div>`;
    }

    function render() {
        const a = analyse();
        mainGroup.innerHTML = a.kind === 'scale' ? renderScale(a) : a.kind === 'units' ? renderUnits(a) : renderMeasure(a);
        graphGroup.innerHTML = a.kind === 'scale' ? graphScale(a) : a.kind === 'units' ? graphUnits(a) : graphMeasure(a);
        stageBadge.textContent = a.kind === 'scale' ? `${KINDS[state.kind].label} · ${a.t.label}` : a.kind === 'units' ? `${UNITS[state.unit].label} · ${ERAS[state.era].label}` : a.r.label;
        methodHint.textContent = a.kind === 'scale' ? '10배씩 뛰는 눈금 하나가 한 자리입니다'
            : a.kind === 'units' ? '단위의 기준은 누가 어디서 재어도 같아야 합니다'
                : '마지막 자리는 눈금 사이를 어림한 값입니다';
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
        if (a.kind === 'scale') {
            const kind = KINDS[state.kind], { t } = a;
            labelA.textContent = t.label; valueA.textContent = `${fmtSci(t.value)} ${kind.unit}`;
            labelB.textContent = '기준과 견주면'; valueB.textContent = `${powWords(a.steps)} 배 ${a.lg > 0 ? '크다' : '작다'} (${a.steps}자리)`;
            s = `${t.label}${pEun(t.label)} ${fmtSci(t.value)} ${kind.unit}, 곧 ${t.words}입니다. ${kind.refLabel}와 견주면 10배 눈금으로 ${a.k.toFixed(1)}칸, 약 ${powWords(a.steps)} 배 ${a.lg > 0 ? '큽니다' : '작습니다'}. `;
            s += `10배씩 뛰는 눈금으로 재면 ${kind.label}의 세계는 10${sup(kind.eMin)}에서 10${sup(kind.eMax)} ${kind.unit}까지 ${kind.eMax - kind.eMin}칸이나 되고, 우리가 맨눈과 몸으로 겪는 것은 그 가운데 두세 칸뿐입니다. `;
            s += `이렇게 다른 크기를 한눈에 견주려면 10의 몇 제곱이라는 표기가 필요하고, 자릿수(몇 칸)만 맞아도 어림은 쓸 만합니다.`;
        } else if (a.kind === 'units') {
            const { d } = a, defs = DEFS[state.unit];
            labelA.textContent = `${ERAS[state.era].label}의 기준`; valueA.textContent = CAT_LABEL[d.cat];
            labelB.textContent = '되살릴 수 있는 정확도'; valueB.textContent = `10${sup(-d.digits)} (약 ${d.digits}자리)`;
            s = `${ERAS[state.era].label}(${d.year}년) ${UNITS[state.unit].label}의 기준은 '${d.text}'${hasJong(d.text) ? '이었습니다' : '였습니다'} — ${CAT_LABEL[d.cat]}에 맞춘 것입니다. `;
            if (d.cat === 'nature') s += `지구나 물처럼 손에 닿는 자연물은 누구나 떠올릴 수 있지만, 정확히 재기 어렵고 재는 조건에 따라 달라져 ${d.digits}자리쯤밖에 믿을 수 없었습니다. `;
            else if (d.cat === 'artifact') s += `정밀하게 만든 물건을 보관하면 자연물보다 훨씬 정확하지만, 닳고 오염되고 변합니다. 킬로그램 원기는 100년 동안 복제품들과 50 μg쯤 어긋났고, 무엇이 변한 것인지조차 알 수 없었습니다. `;
            else s += `빛의 속력, 세슘 원자의 진동, 플랑크 상수는 우주 어디서나 같으므로 어느 실험실이든 스스로 같은 기준을 되살릴 수 있고, ${d.digits}자리까지 믿을 수 있습니다. `;
            s += `기준은 이렇게 자연물(${defs.old.year}년) → ${defs.mid.cat === 'artifact' ? '원기' : '더 정밀한 자연물'}(${defs.mid.year}년) → 자연 상수(${defs.now.year}년)로 옮겨 왔고, 2019년에 일곱 기본 단위가 모두 자연 상수에 묶였습니다.`;
        } else {
            const { r, reads } = a;
            labelA.textContent = '열 번 평균'; valueA.textContent = `${a.mean.toFixed(decimals(r.est) + 1)} mm`;
            labelB.textContent = '흩어짐'; valueB.textContent = `±${a.spread.toFixed(decimals(r.est) + 1)} mm`;
            s = `${r.label}는 눈금이 ${r.div} mm입니다. 눈금 사이를 눈으로 열 등분해 ${r.est} mm 자리까지 어림해 적으므로, 마지막 자리는 재는 사람과 순간에 따라 흔들립니다. 열 번 읽은 값은 ${Math.min(...reads).toFixed(decimals(r.est))}~${Math.max(...reads).toFixed(decimals(r.est))} mm 사이에 흩어졌고 평균은 ${a.mean.toFixed(decimals(r.est) + 1)} mm입니다. `;
            s += `실제 길이 ${TRUE_MM} mm에 가깝지만 어느 한 번도 정확히 맞지는 않습니다. 눈금이 10배 촘촘한 자를 쓰면 흩어짐도 10분의 1로 줄어 한 자리를 더 믿을 수 있습니다. `;
            s += `그래서 측정값은 '어느 자리까지 믿을 수 있는지'를 함께 담아 적어야 하고(유효숫자), 여러 번 재어 평균을 내면 우연한 흔들림은 줄지만 자 자체가 틀린 것은 줄지 않습니다.`;
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
        checkBtn.textContent = state.mode === 'scale' ? '10배씩 가 보기' : state.mode === 'units' ? '역사 넘기기' : '열 번 재기';
        stageCaption.textContent = state.mode === 'scale' ? '눈금 한 칸이 10배입니다. 기준(사람 키 1.7 m 또는 1초)에서 출발해 대상까지 칸을 세어 갑니다.'
            : state.mode === 'units' ? '시간을 넘기며 그 단위의 기준이 무엇에 맞추어져 있었는지 카드가 열립니다.'
                : '같은 막대를 같은 자로 열 번 잽니다. 오른쪽 위는 막대 끝을 확대한 것입니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { kind: 'length', target: 'earth', unit: 'm', era: 'now', ruler: 'mm', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'scale').click();
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

    window.__measureModel = {
        KINDS, TARGETS, UNITS, ERAS, DEFS, RULERS, TRUE_MM, state,
        analyse, render, readingsFor, fmtSci,
        runSeconds,
        setMode(m) { modeButtons.find(b => b.dataset.mode === m).click(); },
        set(key, value) { state[key] = value; if (key === 'kind' && !TARGETS[state.kind][state.target]) state.target = Object.keys(TARGETS[state.kind])[5]; buildControls(); buildPrediction(); settingsChanged(); },
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
