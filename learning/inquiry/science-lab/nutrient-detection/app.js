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
    const TUBES = [
        { key: 'starch', label: '녹말물', base: '#e2e8f0', nutrient: '녹말', icon: '🥔' },
        { key: 'sugar', label: '포도당물', base: '#e0f2fe', nutrient: '당분', icon: '🍬' },
        { key: 'protein', label: '단백질물', base: '#fef3c7', nutrient: '단백질', icon: '🥩' },
        { key: 'fat', label: '식용유', base: '#fef08a', nutrient: '지방', icon: '🧈' },
    ];
    const REAGENTS = {
        iodine: { label: '아이오딘', hint: '녹말 검출 (청람색)', full: '아이오딘-아이오딘화 칼륨 용액', target: 'starch', color: '#92400e', result: '#172554', resultName: '청람색', tint: 0.35, needsHeat: false, badgeColor: '#b45309', icon: '🍂' },
        benedict: { label: '베네딕트', hint: '당분 검출 (황적색)', full: '베네딕트 용액', target: 'sugar', color: '#0284c7', result: '#ea580c', resultName: '황적색', tint: 0.55, needsHeat: true, badgeColor: '#0369a1', icon: '🔥' },
        biuret: { label: '뷰렛', hint: '단백질 검출 (보라색)', full: '뷰렛 용액 (NaOH + CuSO₄)', target: 'protein', color: '#38bdf8', result: '#7e22ce', resultName: '보라색', tint: 0.35, needsHeat: false, badgeColor: '#6b21a8', icon: '💜' },
        sudan: { label: '수단 Ⅲ', hint: '지방 검출 (선홍색)', full: '수단 Ⅲ 용액', target: 'fat', color: '#dc2626', result: '#e11d48', resultName: '선홍색', tint: 0.15, needsHeat: false, badgeColor: '#b91c1c', icon: '🔴' },
    };
    const HEATS = {
        yes: { label: '가열 (100 ℃)', hint: '끓는 물 중탕', icon: '🔥' },
        no: { label: '가열 안 함', hint: '실온 (20 ℃)', icon: '❄️' }
    };
    const SAMPLES = {
        glucose: { label: '포도당물', hint: '단당류 (당분 있음)', sugar: true, name: '포도당', icon: '🍬' },
        maltose: { label: '엿당물', hint: '이당류 (당분 있음)', sugar: true, name: '엿당', icon: '🍯' },
        starch: { label: '녹말물', hint: '다당류 (큰 덩어리)', sugar: false, name: '녹말', icon: '🥔' },
        water: { label: '맹물', hint: '대조군 (무반응)', sugar: false, name: '물', icon: '💧' }
    };
    const CONCS = {
        thick: { label: '진하게', hint: '당분 많음', icon: '🫗' },
        thin: { label: '묽게', hint: '당분 적음', icon: '💧' }
    };
    const CONDS = {
        warm: { label: '아밀레이스 + 37 ℃', hint: '체온 (최적 활성)', enzyme: true, temp: 37, rate: 0.30, icon: '🌡️' },
        cold: { label: '아밀레이스 + 5 ℃', hint: '저온 (활성 저하)', enzyme: true, temp: 5, rate: 0.045, icon: '🧊' },
        none: { label: '아밀레이스 없음 (37 ℃)', hint: '대조군 (무반응)', enzyme: false, temp: 37, rate: 0, icon: '🚫' },
        boiled: { label: '끓인 아밀레이스 (37 ℃)', hint: '열 변성 (효소 파괴)', enzyme: true, temp: 37, rate: 0.002, icon: '♨️' },
    };
    const REACT_MIN = 10;

    const state = { mode: 'reagent', reagent: 'iodine', heat: 'yes', sample: 'glucose', bheat: 'no', conc: 'thick', cond: 'warm', progress: 0, prediction: null };
    let running = false, frameId = 0, lastStamp = 0;

    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const ease = p => p < 0.5 ? 2 * p * p : 1 - (1 - p) * (1 - p) * 2;
    const fmtN = (n, d = 0) => (+n.toFixed(d)).toLocaleString('ko-KR', { minimumFractionDigits: d, maximumFractionDigits: d }).replace('-', '−');
    const rnd = i => (((i * 7919 + 13) * 104729) % 100003) / 100003;
    const hex = c => c.startsWith('rgb') ? c.match(/\d+/g).slice(0, 3).map(Number) : [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
    const mix = (a, b, t) => { const A = hex(a), B = hex(b), u = clamp(t, 0, 1); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * u)).join(',')})`; };
    const jong = s => { const c = s.charCodeAt(s.length - 1); return c >= 0xac00 && c <= 0xd7a3 ? (c - 0xac00) % 28 : 0; };
    const eun = s => jong(s) ? '은' : '는', iga = s => jong(s) ? '이' : '가', eul = s => jong(s) ? '을' : '를';

    /* ------------------------------------------------------------ models */
    function reagentModel() {
        const r = REAGENTS[state.reagent], heated = state.heat === 'yes', works = !r.needsHeat || heated;
        const results = TUBES.map(t => ({ tube: t, reacts: works && t.key === r.target }));
        return { kind: 'reagent', r, heated, works, results, verdict: works ? r.target : 'none' };
    }
    function benedictModel() {
        const s = SAMPLES[state.sample], heated = state.bheat === 'yes', thick = state.conc === 'thick';
        const level = !heated || !s.sugar ? 0 : thick ? 1 : 0.45; // 0 blue, 0.45 green–yellow, 1 orange
        return { kind: 'benedict', s, heated, thick, level, verdict: level === 0 ? 'none' : level < 0.7 ? 'some' : 'much' };
    }
    function amylaseModel() {
        const c = CONDS[state.cond], remainAt = t => Math.exp(-c.rate * t), remain = remainAt(REACT_MIN), maltose = 1 - remain;
        const iodine = remain >= 0.15, benedict = maltose >= 0.15;
        return { kind: 'amylase', c, remainAt, remain, maltose, iodine, benedict, verdict: !iodine && benedict ? 'digested' : iodine && benedict ? 'partial' : 'none' };
    }
    function analyse() {
        if (state.mode === 'reagent') return reagentModel();
        if (state.mode === 'benedict') return benedictModel();
        return amylaseModel();
    }
    const runSeconds = () => 6;

    /* ---------------------------------------------------------- controls */
    function pickRow(legend, name, options, current, cols) {
        return `<fieldset class="pick-field"><legend>${legend}</legend>` +
            `<div class="pick-buttons cols${cols}" data-pick="${name}">` +
            options.map(o => `<button type="button" data-value="${o.value}" class="${o.value === String(current) ? 'selected' : ''}">` +
                `<span>${o.icon ? `${o.icon} ` : ''}${o.label}</span>${o.hint ? `<small>${o.hint}</small>` : ''}</button>`).join('') +
            `</div></fieldset>`;
    }
    const opts = table => Object.entries(table).map(([k, v]) => ({ value: k, label: v.label, hint: v.hint, icon: v.icon }));

    function buildControls() {
        if (state.mode === 'reagent') {
            controlArea.innerHTML = pickRow('검출할 시약 선택', 'reagent', opts(REAGENTS), state.reagent, 4) +
                (state.reagent === 'benedict' ? pickRow('가열 조건 (끓는 물 중탕)', 'heat', opts(HEATS), state.heat, 2) : '');
        } else if (state.mode === 'benedict') {
            controlArea.innerHTML = pickRow('검사할 시료', 'sample', opts(SAMPLES), state.sample, 4) +
                pickRow('가열 여부', 'bheat', opts(HEATS), state.bheat, 2) +
                pickRow('시료 농도', 'conc', opts(CONCS), state.conc, 2);
        } else {
            controlArea.innerHTML = pickRow('녹말물 반응 조건 (10분 소화)', 'cond', opts(CONDS), state.cond, 2);
        }
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                if (group.dataset.pick === 'reagent') buildControls();
                else group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                buildPrediction();
                settingsChanged();
            }));
        });
    }

    const PRED_R = [
        { value: 'starch', label: '① 녹말물만 청람색' },
        { value: 'sugar', label: '② 포도당물만 황적색' },
        { value: 'protein', label: '③ 단백질물만 보라색' },
        { value: 'fat', label: '④ 식용유만 선홍색' },
        { value: 'none', label: '모든 시험관 변화 없음' }
    ];
    const PRED_B = [
        { value: 'none', label: '푸른색 그대로 (반응 없음)' },
        { value: 'some', label: '녹색~황색 (당분 적음)' },
        { value: 'much', label: '황적색 앙금 (당분 많음)' }
    ];
    const PRED_A = [
        { value: 'digested', label: '아이오딘 반응 사라지고 베네딕트 황적색 (완전 소화)' },
        { value: 'partial', label: '둘 다 조금씩 반응 (부분 소화)' },
        { value: 'none', label: '아이오딘 청람색, 베네딕트 푸른색 그대로 (소화 안 됨)' }
    ];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list = state.mode === 'reagent' ? PRED_R : state.mode === 'benedict' ? PRED_B : PRED_A;
        predictionLegend.textContent = state.mode === 'reagent'
            ? `네 시험관에 ${REAGENTS[state.reagent].full}${eul(REAGENTS[state.reagent].full)} 넣${state.reagent === 'benedict' ? (state.heat === 'yes' ? '고 가열하' : '고 가열하지 않으') : '으'}면?`
            : state.mode === 'benedict'
                ? `${CONCS[state.conc].label} 탄 ${SAMPLES[state.sample].label}에 베네딕트 용액을 넣고 ${state.bheat === 'yes' ? '가열하면' : '가열하지 않으면'}?`
                : `녹말물에 ${CONDS[state.cond].label}로 10분 두고 아이오딘·베네딕트 검사를 하면?`;
        predictionArea.className = `prediction-buttons ${list.length === 5 ? 'five' : 'three'}`;
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- SVG graphics */
    const SVG_DEFS = `
    <defs>
        <linearGradient id="glassWall" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6"/>
            <stop offset="12%" stop-color="#ffffff" stop-opacity="0.12"/>
            <stop offset="80%" stop-color="#ffffff" stop-opacity="0.05"/>
            <stop offset="94%" stop-color="#ffffff" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#cbd5e1" stop-opacity="0.65"/>
        </linearGradient>
        <linearGradient id="liqShine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#0f172a" stop-opacity="0.12"/>
            <stop offset="22%" stop-color="#ffffff" stop-opacity="0.22"/>
            <stop offset="75%" stop-color="#ffffff" stop-opacity="0.05"/>
            <stop offset="100%" stop-color="#0f172a" stop-opacity="0.16"/>
        </linearGradient>
        <linearGradient id="rackWood" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#f8fafc"/>
            <stop offset="50%" stop-color="#f1f5f9"/>
            <stop offset="100%" stop-color="#e2e8f0"/>
        </linearGradient>
        <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="115%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#0f172a" flood-opacity="0.05"/>
        </filter>
    </defs>`;

    function renderTestTube(x, top, w, bot, liquidTop, color, opacity = 0.9, showPrecipitate = false) {
        const r = (w - 2) / 2;
        const cx = x + w / 2;
        let out = '';

        // Liquid body
        if (liquidTop < bot) {
            out += `<path d="M${x + 1.5},${liquidTop} L${x + 1.5},${bot - r} A${r},${r} 0 0 0 ${x + w - 1.5},${bot - r} L${x + w - 1.5},${liquidTop} Z" fill="${color}" fill-opacity="${opacity}"/>`;
            out += `<path d="M${x + 1.5},${liquidTop} L${x + 1.5},${bot - r} A${r},${r} 0 0 0 ${x + w - 1.5},${bot - r} L${x + w - 1.5},${liquidTop} Z" fill="url(#liqShine)"/>`;
            // Liquid meniscus
            out += `<ellipse cx="${cx}" cy="${liquidTop}" rx="${r}" ry="3.2" fill="${mix(color, '#ffffff', 0.28)}" stroke="${color}" stroke-width="0.8"/>`;
            out += `<path d="M${x + 4},${liquidTop} Q${cx},${liquidTop + 2.2} ${x + w - 4},${liquidTop}" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" opacity="0.85"/>`;

            // Precipitate particles
            if (showPrecipitate) {
                for (let k = 0; k < 12; k++) {
                    const px = x + 5 + rnd(k * 7) * (w - 10);
                    const py = bot - 3 - rnd(k * 13 + 5) * 14;
                    out += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(1.2 + rnd(k) * 0.8).toFixed(1)}" fill="#b91c1c" opacity="0.95"/>`;
                }
            }
        }

        // Glass tube
        out += `<path d="M${x},${top} L${x},${bot - w / 2} A${w / 2},${w / 2} 0 0 0 ${x + w},${bot - w / 2} L${x + w},${top}" fill="url(#glassWall)" stroke="#64748b" stroke-width="1.5"/>`;
        // Rim
        out += `<ellipse cx="${cx}" cy="${top}" rx="${w / 2 + 2.5}" ry="3.2" fill="#f8fafc" stroke="#475569" stroke-width="1.4"/>`;
        // Glass specular highlight
        out += `<line x1="${x + 3.5}" y1="${top + 4}" x2="${x + 3.5}" y2="${bot - w / 2 - 2}" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" opacity="0.8"/>`;
        out += `<path d="M${x + 6},${bot - 4} Q${cx},${bot - 1} ${x + w - 6},${bot - 4}" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" opacity="0.75"/>`;

        return out;
    }

    function renderDropper(x, y, color, dropY = null, ripple = false) {
        let out = '';
        out += `<path d="M${x - 6},${y - 28} C${x - 9},${y - 28} ${x - 9},${y - 14} ${x - 6},${y - 12} L${x + 6},${y - 12} C${x + 9},${y - 12} ${x + 9},${y - 28} ${x + 6},${y - 28} Z" fill="#475569" stroke="#334155" stroke-width="1.2"/>`;
        out += `<ellipse cx="${x}" cy="${y - 28}" rx="6" ry="2" fill="#64748b"/>`;
        out += `<rect x="${x - 7}" y="${y - 12}" width="14" height="3" rx="1" fill="#334155"/>`;
        out += `<path d="M${x - 5},${y - 9} L${x - 5},${y + 8} L${x - 1.8},${y + 18} L${x + 1.8},${y + 18} L${x + 5},${y + 8} L${x + 5},${y - 9} Z" fill="rgba(241, 245, 249, 0.6)" stroke="#475569" stroke-width="1.2"/>`;
        out += `<path d="M${x - 3.5},${y - 2} L${x - 3.5},${y + 7} L${x - 1.2},${y + 17} L${x + 1.2},${y + 17} L${x + 3.5},${y + 7} L${x + 3.5},${y - 2} Z" fill="${color}" fill-opacity="0.85"/>`;
        out += `<line x1="${x - 3}" y1="${y - 6}" x2="${x - 3}" y2="${y + 6}" stroke="#ffffff" stroke-width="1" opacity="0.8"/>`;

        if (dropY !== null) {
            out += `<path d="M${x},${dropY} C${x - 2.8},${dropY + 4} ${x - 2.8},${dropY + 7.5} ${x},${dropY + 7.5} C${x + 2.8},${dropY + 7.5} ${x + 2.8},${dropY + 4} ${x},${dropY} Z" fill="${color}"/>`;
        }
        if (ripple) {
            out += `<ellipse cx="${x}" cy="82" rx="10" ry="2.5" fill="none" stroke="#ffffff" stroke-width="1.4" opacity="0.9"/>`;
            out += `<ellipse cx="${x}" cy="82" rx="5" ry="1.2" fill="none" stroke="${color}" stroke-width="1" opacity="0.7"/>`;
        }
        return out;
    }

    function renderWaterBath(x0, x1, y0, y1, heated, progress) {
        const bw = x1 - x0, bh = y1 - y0;
        let out = '';
        if (heated) {
            out += `<ellipse cx="${(x0 + x1) / 2}" cy="${y1 + 10}" rx="${bw / 2 - 4}" ry="6" fill="rgba(249, 115, 22, 0.15)"/>`;
            const flameCount = 5;
            for (let i = 0; i < flameCount; i++) {
                const fx = x0 + 16 + i * (bw - 32) / (flameCount - 1);
                const fh = 14 + 3 * Math.sin(progress * 35 + i * 2);
                out += `<path d="M${fx - 5},${y1 + 14} Q${fx},${y1 + 14 - fh} ${fx + 5},${y1 + 14} Z" fill="rgba(234, 88, 12, 0.7)"/>`;
                out += `<path d="M${fx - 2.5},${y1 + 14} Q${fx},${y1 + 14 - fh * 0.65} ${fx + 2.5},${y1 + 14} Z" fill="rgba(254, 240, 138, 0.9)"/>`;
            }
            out += `<line x1="${x0 - 6}" y1="${y1 + 3}" x2="${x1 + 6}" y2="${y1 + 3}" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>`;
        } else {
            out += `<line x1="${x0 - 4}" y1="${y1 + 3}" x2="${x1 + 4}" y2="${y1 + 3}" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>`;
        }
        out += `<rect x="${x0}" y="${y0}" width="${bw}" height="${bh}" rx="4" fill="rgba(241, 245, 249, 0.25)" stroke="#64748b" stroke-width="1.8"/>`;
        out += `<rect x="${x0 + 1.5}" y="${y0 + 18}" width="${bw - 3}" height="${bh - 19.5}" rx="2" fill="rgba(2, 132, 199, 0.14)"/>`;
        out += `<line x1="${x0 + 2}" y1="${y0 + 18}" x2="${x1 - 2}" y2="${y0 + 18}" stroke="#38bdf8" stroke-width="1.2" opacity="0.8"/>`;

        for (let m = 1; m <= 3; m++) {
            const my = y1 - m * (bh - 28) / 4;
            out += `<line x1="${x0 + 2}" y1="${my}" x2="${x0 + 8}" y2="${my}" stroke="#64748b" stroke-width="1.2"/>`;
            out += `<text x="${x0 + 11}" y="${my + 3.5}" font-size="11.5" font-weight="750" fill="#64748b">${m * 100}</text>`;
        }

        if (heated) {
            for (let i = 0; i < 9; i++) {
                const bx = x0 + 10 + rnd(i * 17) * (bw - 20);
                const by = y1 - 4 - ((rnd(i * 23 + 5) * 50 + progress * 80) % (bh - 24));
                const br = 1.2 + rnd(i + 30) * 1.6;
                out += `<circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="${br.toFixed(1)}" fill="none" stroke="rgba(255, 255, 255, 0.85)" stroke-width="0.9"/>`;
            }
            for (let s = 0; s < 3; s++) {
                const sx = x0 + 20 + s * (bw - 40) / 2 + Math.sin(progress * 20 + s) * 5;
                const sy = y0 + 10 - (s * 8 + (progress * 30) % 18);
                out += `<path d="M${sx},${sy} Q${sx + 6},${sy - 8} ${sx - 3},${sy - 16}" fill="none" stroke="rgba(203, 213, 225, 0.6)" stroke-width="1.5" stroke-linecap="round"/>`;
            }
        }
        return out;
    }

    function renderRack(x0, x1, yBottom, tubeCenters) {
        let out = '';
        const rw = x1 - x0;
        out += `<ellipse cx="${(x0 + x1) / 2}" cy="${yBottom + 12}" rx="${rw / 2 + 4}" ry="5" fill="rgba(15, 23, 42, 0.06)"/>`;
        out += `<line x1="${x0 - 12}" y1="${yBottom + 12}" x2="${x1 + 12}" y2="${yBottom + 12}" stroke="#cbd5e1" stroke-width="1.5"/>`;
        out += `<rect x="${x0}" y="${yBottom}" width="${rw}" height="10" rx="3" fill="url(#rackWood)" stroke="#94a3b8" stroke-width="1.2"/>`;
        out += `<rect x="${x0 + 6}" y="${yBottom + 10}" width="14" height="4" rx="1" fill="#94a3b8"/><rect x="${x1 - 20}" y="${yBottom + 10}" width="14" height="4" rx="1" fill="#94a3b8"/>`;
        out += `<rect x="${x0 + 2}" y="66" width="9" height="${yBottom - 66}" rx="2" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.2"/>`;
        out += `<rect x="${x1 - 11}" y="66" width="9" height="${yBottom - 66}" rx="2" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.2"/>`;
        out += `<rect x="${x0}" y="68" width="${rw}" height="9" rx="2" fill="url(#rackWood)" stroke="#94a3b8" stroke-width="1.2"/>`;

        tubeCenters.forEach(cx => {
            out += `<ellipse cx="${cx}" cy="72" rx="18" ry="3" fill="#ffffff" stroke="#94a3b8" stroke-width="0.9"/>`;
            out += `<ellipse cx="${cx}" cy="${yBottom + 3}" rx="14" ry="2" fill="#cbd5e1" stroke="#94a3b8" stroke-width="0.7"/>`;
        });
        return out;
    }

    /* -------------------------------------------------------- Render Mode 1 */
    function renderReagent(a) {
        const p = state.progress, { r } = a;
        const TW = 34, TOP = 44, BOT = 172, LIQ_TOP = 82;
        const xs = [42, 108, 174, 240];
        const centers = xs.map(x => x + TW / 2);
        let out = SVG_DEFS;

        const dropPhase = clamp(p / 0.6, 0, 1);
        const which = Math.min(3, Math.floor(dropPhase * 4));
        const develop = ease(clamp((p - 0.6) / 0.4, 0, 1));

        // Heating water bath for Benedict
        if (p > 0 && a.heated && r.needsHeat) {
            out += renderWaterBath(24, 296, 92, 180, true, p);
        }

        // Test tube rack
        out += renderRack(24, 296, 172, centers);

        // 4 Test tubes
        TUBES.forEach((t, i) => {
            const x = xs[i], cx = centers[i];
            const got = p > 0 && (dropPhase * 4 > i + 0.5 || p >= 0.6);
            let color = t.base;
            let showPpt = false;

            if (got) {
                const res = a.results[i];
                if (res.reacts) {
                    color = mix(mix(t.base, r.color, r.tint), r.result, develop);
                    if (r.target === 'sugar' && a.heated && develop > 0.5) showPpt = true;
                } else {
                    color = mix(t.base, r.color, state.reagent === 'sudan' ? 0.05 : r.tint);
                }
            }

            out += renderTestTube(x, TOP, TW, BOT, LIQ_TOP, color, t.key === 'fat' ? 0.95 : 0.85, showPpt);

            // Sudan III insoluble droplets in water-based tubes
            if (got && state.reagent === 'sudan' && t.key !== 'fat') {
                for (let k = 0; k < 6; k++) {
                    const sx = x + 6 + rnd(i * 10 + k) * (TW - 12);
                    const sy = LIQ_TOP + 4 + rnd(k * 3) * 12;
                    out += `<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="1.5" fill="#dc2626"/>`;
                }
            }

            // Tube position label
            out += `<rect x="${cx - 30}" y="192" width="60" height="36" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>`;
            out += `<text class="tube-label" x="${cx}" y="206" text-anchor="middle">${i + 1}. ${t.label}</text>`;
            out += `<text class="tube-sub" x="${cx}" y="221" text-anchor="middle">(${t.nutrient})</text>`;
        });

        // Animated Dropper
        if (p > 0 && p < 0.6) {
            const dx = centers[which];
            const dp = (dropPhase * 4) % 1;
            const dropY = dp < 0.7 ? TOP + 10 + dp / 0.7 * 28 : null;
            const ripple = dp >= 0.7 && dp < 0.9;
            out += renderDropper(dx, 40, r.color, dropY, ripple);
        } else if (p === 0) {
            out += renderDropper(centers[0], 40, r.color, null);
        }

        // Top Verdict Banner
        const VERD = {
            starch: '① 녹말물만 청람색으로 반응!',
            sugar: '② 포도당물만 황적색으로 반응!',
            protein: '③ 단백질물만 보라색으로 반응!',
            fat: '④ 식용유만 선홍색으로 반응!',
            none: '모든 시험관 변화 없음 (가열 필요 또는 시약 불일치)'
        };
        const titleText = p >= 1
            ? `${r.label}${r.needsHeat ? (a.heated ? ' (가열)' : ' (가열 안 함)') : ''}: ${VERD[a.verdict]}`
            : `${r.full}${eul(r.full)} 시험관에 떨어뜨리는 중...`;
        out += `<rect x="24" y="8" width="272" height="28" rx="6" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>`;
        out += `<text class="verdict-text" style="fill:${p >= 1 ? '#0369a1' : '#0f172a'}" x="160" y="27" text-anchor="middle">${titleText}</text>`;

        // Right-Side Structured Information Card
        const RX = 316, RW = 192;
        out += `<rect x="${RX}" y="8" width="${RW}" height="220" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" filter="url(#cardShadow)"/>`;
        out += `<rect x="${RX + 10}" y="16" width="${RW - 20}" height="28" rx="6" fill="${r.color}15" stroke="${r.color}50"/>`;
        out += `<circle cx="${RX + 24}" cy="30" r="5" fill="${r.color}"/>`;
        out += `<text class="card-title" x="${RX + 36}" y="35">${r.label} 검출 반응</text>`;

        out += `<text class="card-text" x="${RX + 12}" y="62">검출 대상: <tspan class="card-val" fill="#0f172a">${TUBES.find(t => t.key === r.target).nutrient}</tspan></text>`;
        out += `<text class="card-text" x="${RX + 12}" y="80">반응 색: <tspan class="card-val" fill="${r.result}">${r.resultName}</tspan></text>`;
        out += `<text class="card-text" x="${RX + 12}" y="98">가열 조건: <tspan class="card-val" fill="${r.needsHeat && !a.heated ? '#dc2626' : '#047857'}">${r.needsHeat ? (a.heated ? '100 ℃ 가열 필수' : '가열 안 함 (무반응)') : '실온 반응 (가열 불필요)'}</tspan></text>`;

        out += `<line x1="${RX + 10}" y1="108" x2="${RX + RW - 10}" y2="108" stroke="#e2e8f0" stroke-width="1"/>`;
        out += `<text class="card-title" x="${RX + 12}" y="126" font-size="13">시험관별 반응 상태:</text>`;

        a.results.forEach((res, i) => {
            const shown = p >= 0.6 && develop > 0.3;
            const ry = 144 + i * 19;
            out += `<text class="card-text" x="${RX + 12}" y="${ry}">${i + 1}. ${res.tube.label}:</text>`;
            if (shown) {
                if (res.reacts) {
                    out += `<rect x="${RX + 102}" y="${ry - 12}" width="78" height="17" rx="4" fill="${r.result}"/>`;
                    out += `<text class="card-chip" x="${RX + 141}" y="${ry + 1}" fill="#ffffff" text-anchor="middle">${r.resultName} 반응</text>`;
                } else {
                    out += `<rect x="${RX + 102}" y="${ry - 12}" width="78" height="17" rx="4" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="0.8"/>`;
                    out += `<text class="card-chip" x="${RX + 141}" y="${ry + 1}" fill="#334155" font-weight="800" text-anchor="middle">변화 없음</text>`;
                }
            } else {
                out += `<text class="card-val" x="${RX + 112}" y="${ry}" style="fill:#64748b" font-weight="750">대기 중…</text>`;
            }
        });

        return out;
    }

    /* -------------------------------------------------------- Graph Mode 1 */
    function graphReagent(a) {
        let out = SVG_DEFS;
        const X0 = 20, W = 480, H = 194;
        out += `<rect x="${X0}" y="8" width="${W}" height="${H}" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" filter="url(#cardShadow)"/>`;
        out += `<text class="axis-title" x="${X0 + 16}" y="32">📊 중학교 필수 영양소 검출 반응표</text>`;

        const cw = 76, rh = 28, TX0 = 164, Y0 = 66;

        // Table Header Columns
        TUBES.forEach((t, j) => {
            out += `<rect x="${TX0 + cw * j}" y="44" width="${cw - 4}" height="22" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>`;
            out += `<text class="grid-text" x="${TX0 + cw * j + (cw - 4) / 2}" y="59" text-anchor="middle">${t.icon} ${t.nutrient}</text>`;
        });

        // 4 Reagent Rows
        Object.entries(REAGENTS).forEach(([k, r], i) => {
            const y = Y0 + i * rh;
            const on = k === state.reagent;
            if (on) {
                out += `<rect x="${X0 + 8}" y="${y - 2}" width="${W - 16}" height="${rh}" rx="6" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.2"/>`;
            }
            out += `<text class="grid-text" style="fill:${on ? '#0369a1' : '#1e293b'}" font-weight="${on ? '900' : '750'}" x="${TX0 - 12}" y="${y + 17}" text-anchor="end">${r.icon} ${r.label}${r.needsHeat ? ' (가열)' : ''}</text>`;

            TUBES.forEach((t, j) => {
                const x = TX0 + cw * j;
                const hit = t.key === r.target;
                if (hit) {
                    out += `<rect x="${x}" y="${y}" width="${cw - 4}" height="${rh - 4}" rx="5" fill="${r.result}" filter="url(#cardShadow)"/>`;
                    out += `<text class="cell-text" fill="#ffffff" x="${x + (cw - 4) / 2}" y="${y + 16}" text-anchor="middle">${r.resultName}</text>`;
                } else {
                    out += `<rect x="${x}" y="${y}" width="${cw - 4}" height="${rh - 4}" rx="5" fill="#f8fafc" stroke="#e2e8f0"/>`;
                    out += `<text class="cell-text" fill="#64748b" x="${x + (cw - 4) / 2}" y="${y + 16}" text-anchor="middle">—</text>`;
                }
            });
        });

        out += `<text class="note-text" x="${X0 + 16}" y="188">💡 베네딕트 반응은 끓는 물에 가열해야 일어나며, 녹말은 아밀레이스로 엿당이 된 뒤에야 반응합니다.</text>`;
        return out;
    }

    /* -------------------------------------------------------- Render Mode 2 */
    function renderBenedict(a) {
        const p = state.progress, { s } = a;
        const TX = 114, TW = 44, TOP = 40, BOT = 172, LIQ_TOP = 80;
        let out = SVG_DEFS;

        // Water bath beaker enclosing the tube
        out += renderWaterBath(60, 212, 92, 180, a.heated, p);

        // Thermometer
        const thermoX = 186;
        const tTemp = a.heated ? (p > 0.3 ? 100 : 25 + p / 0.3 * 75) : 20;
        const tFillH = 64 * clamp(tTemp / 110, 0, 1);
        out += `<rect x="${thermoX}" y="64" width="7" height="80" rx="3.5" fill="#ffffff" stroke="#475569" stroke-width="1.2"/>`;
        out += `<rect x="${thermoX + 1.5}" y="${144 - tFillH}" width="4" height="${tFillH}" rx="2" fill="${a.heated ? '#dc2626' : '#0284c7'}"/>`;
        out += `<rect x="${thermoX - 25}" y="47" width="58" height="18" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>`;
        out += `<text x="${thermoX + 4}" y="60.5" font-size="12.5" font-weight="850" fill="${a.heated ? '#dc2626' : '#0369a1'}" text-anchor="middle">${fmtN(tTemp, 0)} ℃</text>`;

        // Color transitions
        const base = s.sugar ? '#e0f2fe' : state.sample === 'starch' ? '#e2e8f0' : '#e0f2fe';
        const blue = mix(base, '#0284c7', 0.6);
        const target = a.level >= 0.7 ? '#ea580c' : a.level > 0 ? '#ca8a04' : blue;
        const develop = ease(clamp((p - 0.35) / 0.65, 0, 1));
        const color = a.level > 0 ? mix(blue, target, develop) : blue;
        const showPpt = a.level >= 0.7 && develop > 0.5;

        // Render central test tube
        out += renderTestTube(TX, TOP, TW, BOT, LIQ_TOP, color, 0.9, showPpt);
        out += `<text class="tube-label" x="${TX + TW / 2}" y="202" text-anchor="middle">${CONCS[state.conc].label} 탄 ${s.label}</text>`;
        out += `<text class="tube-sub" x="${TX + TW / 2}" y="217" text-anchor="middle">(${s.sugar ? '당분 있음' : '당분 없음'})</text>`;

        // Dropper at beginning
        if (p < 0.3) {
            const dropY = p > 0 && (p / 0.3) % 0.5 < 0.35 ? TOP + 10 + ((p / 0.3) % 0.5) / 0.35 * 30 : null;
            out += renderDropper(TX + TW / 2, 36, '#0284c7', dropY);
        }

        // Right-Side Card
        const RX = 246, RW = 254;
        out += `<rect x="${RX}" y="8" width="${RW}" height="220" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" filter="url(#cardShadow)"/>`;
        out += `<rect x="${RX + 10}" y="16" width="${RW - 20}" height="28" rx="6" fill="#f0f9ff" stroke="#bae6fd"/>`;
        out += `<text class="card-title" x="${RX + 20}" y="35">🔥 베네딕트 가열 반응 분석</text>`;

        out += `<text class="card-text" x="${RX + 14}" y="62">시료: <tspan class="card-val">${s.icon} ${s.label} (${s.name})</tspan></text>`;
        out += `<text class="card-text" x="${RX + 14}" y="82">가열 여부: <tspan class="card-val" fill="${a.heated ? '#ea580c' : '#0284c7'}">${HEATS[state.bheat].icon} ${HEATS[state.bheat].label}</tspan></text>`;
        out += `<text class="card-text" x="${RX + 14}" y="102">시료 농도: <tspan class="card-val">${CONCS[state.conc].icon} ${CONCS[state.conc].label}</tspan></text>`;

        out += `<line x1="${RX + 10}" y1="114" x2="${RX + RW - 10}" y2="114" stroke="#e2e8f0" stroke-width="1"/>`;
        out += `<text class="card-title" x="${RX + 14}" y="132" font-size="13">반응 메커니즘 & 결과:</text>`;

        let statusText = '', resColor = '#64748b';
        if (p < 0.3) {
            statusText = '베네딕트 용액 넣는 중…';
        } else if (p < 0.9) {
            statusText = a.heated ? '끓는 물에서 가열 중…' : '실온에 방치 중…';
        } else {
            if (!a.heated) {
                statusText = '가열 안 함 → 푸른색 그대로';
            } else if (!s.sugar) {
                statusText = state.sample === 'starch' ? '녹말은 반응 안 함 → 푸른색' : '당분 없음 → 푸른색';
            } else {
                statusText = a.thick ? '황적색 앙금 생성 (당분 풍부)' : '녹색~황색 변화 (당분 소량)';
                resColor = a.thick ? '#ea580c' : '#ca8a04';
            }
        }
        out += `<rect x="${RX + 14}" y="142" width="${RW - 28}" height="28" rx="6" fill="${resColor}15" stroke="${resColor}60"/>`;
        out += `<text class="card-chip" x="${RX + RW / 2}" y="160" fill="${resColor}" text-anchor="middle">${statusText}</text>`;

        out += `<text class="card-text" x="${RX + 14}" y="190" font-size="13">원리: Cu²⁺(청색) + 당 ➔ Cu₂O↓(황적색 앙금)</text>`;
        out += `<text class="card-text" x="${RX + 14}" y="208" font-size="13">※ 가열해야만 구리 이온 환원 반응이 진행됨</text>`;

        return out;
    }

    /* -------------------------------------------------------- Graph Mode 2 */
    function graphBenedict(a) {
        let out = SVG_DEFS;
        const X0 = 20, W = 480, H = 194;
        out += `<rect x="${X0}" y="8" width="${W}" height="${H}" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" filter="url(#cardShadow)"/>`;
        out += `<text class="axis-title" x="${X0 + 16}" y="32">🌈 베네딕트 반응 색깔 스펙트럼 (당분의 양 비교)</text>`;

        const stops = [
            ['#0284c7', '청색', '당분 0% (없음)'],
            ['#16a34a', '녹색', '당분 미량 (~0.5%)'],
            ['#ca8a04', '황색', '당분 소량 (~1.0%)'],
            ['#ea580c', '황적색', '당분 풍부 (~2.0%)'],
            ['#991b1b', '적갈색', '당분 과량 (3%+)']
        ];
        const SX0 = 36, SW = 448, SY = 68, SH = 36;
        const bw = SW / stops.length;

        stops.forEach(([col, name, amt], i) => {
            const bx = SX0 + i * bw;
            out += `<rect x="${bx}" y="${SY}" width="${bw - 3}" height="${SH}" rx="4" fill="${col}"/>`;
            out += `<text class="cell-text" fill="#ffffff" x="${bx + (bw - 3) / 2}" y="${SY + 22}" text-anchor="middle">${name}</text>`;
            out += `<text class="axis-text" x="${bx + (bw - 3) / 2}" y="${SY + SH + 18}" text-anchor="middle">${amt}</text>`;
        });

        // Pointer Arrow
        const pos = a.level === 0 ? 0.5 : a.level < 0.7 ? 2.0 : 3.5;
        const mx = SX0 + (state.progress >= 0.9 ? pos : 0.5) * bw;
        out += `<polygon points="${mx},${SY - 4} ${mx - 6},${SY - 14} ${mx + 6},${SY - 14}" fill="#ea580c"/>`;
        out += `<rect x="${mx - 24}" y="${SY - 32}" width="48" height="17" rx="4" fill="#ea580c"/>`;
        out += `<text class="card-chip" x="${mx}" y="${SY - 20}" fill="#ffffff" text-anchor="middle">${state.progress >= 0.9 ? '결과' : '초기'}</text>`;

        out += `<line x1="${X0 + 16}" y1="146" x2="${X0 + W - 16}" y2="146" stroke="#e2e8f0" stroke-width="1"/>`;
        out += `<text class="note-text" x="${X0 + 16}" y="168">💡 ${a.heated ? '100 ℃ 가열 상태' : '가열하지 않음 → 당분이 있어도 푸른색'} · ${a.s.name}${eun(a.s.name)} ${a.s.sugar ? '베네딕트와 반응하는 당분' : '베네딕트와 반응하지 않는 물질'}</text>`;
        out += `<text class="note-text" x="${X0 + 16}" y="186">💡 당분이 적으면 녹색~황색에서 멈추고, 많을수록 황적색~적갈색 앙금으로 짙어집니다.</text>`;

        return out;
    }

    /* -------------------------------------------------------- Render Mode 3 */
    function renderAmylase(a) {
        const p = state.progress, { c } = a;
        const ph1 = clamp(p / 0.5, 0, 1), ph2 = clamp((p - 0.5) / 0.25, 0, 1), ph3 = clamp((p - 0.75) / 0.25, 0, 1);
        const tNow = REACT_MIN * ph1;
        const remain = a.remainAt(tNow);
        const maltose = 1 - remain;
        let out = SVG_DEFS;

        // Left Beaker: Digestion Reaction (0~10 min)
        const BX = 20, BY = 46, BW = 120, BH = 126;
        out += `<rect x="${BX}" y="${BY}" width="${BW}" height="${BH}" rx="5" fill="rgba(241, 245, 249, 0.3)" stroke="#64748b" stroke-width="1.8"/>`;
        out += `<rect x="${BX + 2}" y="${BY + 30}" width="${BW - 4}" height="${BH - 32}" rx="3" fill="${mix('#e2e8f0', '#e0f2fe', maltose)}" fill-opacity="0.85"/>`;

        // Molecular particles in beaker
        for (let i = 0; i < 20; i++) {
            const isStarch = rnd(i) > maltose;
            const px = BX + 12 + rnd(i * 11 + 7) * (BW - 24);
            const py = BY + 38 + rnd(i * 19 + 3) * (BH - 52);
            if (isStarch) {
                // Starch polymer bead chain (회색 녹말 덩어리)
                out += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="2.8" fill="#64748b"/>`;
                out += `<circle cx="${(px + 4).toFixed(1)}" cy="${py.toFixed(1)}" r="2.8" fill="#64748b"/>`;
            } else {
                // Maltose disaccharide pairs (주황색 엿당 쌍)
                out += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="2.2" fill="#ea580c"/>`;
                out += `<circle cx="${(px + 3).toFixed(1)}" cy="${py.toFixed(1)}" r="2.2" fill="#f59e0b"/>`;
            }
        }

        // Thermometer in beaker
        out += `<rect x="${BX + BW - 18}" y="${BY - 16}" width="7" height="64" rx="3.5" fill="#ffffff" stroke="#475569" stroke-width="1.2"/>`;
        out += `<rect x="${BX + BW - 16.5}" y="${BY + 44 - 48 * clamp(c.temp / 45, 0, 1)}" width="4" height="${48 * clamp(c.temp / 45, 0, 1)}" rx="2" fill="#dc2626"/>`;
        out += `<text class="tube-sub" x="${BX + BW / 2}" y="${BY - 4}" text-anchor="middle">${fmtN(tNow, 1)}분 / 10분</text>`;

        // Beaker Bottom Composition Bar
        out += `<rect x="${BX}" y="${BY + BH + 8}" width="${(BW * remain).toFixed(1)}" height="10" rx="3" fill="#64748b"/>`;
        out += `<rect x="${(BX + BW * remain).toFixed(1)}" y="${BY + BH + 8}" width="${(BW * maltose).toFixed(1)}" height="10" rx="3" fill="#ea580c"/>`;
        out += `<text x="${BX + 2}" y="${BY + BH + 30}" font-size="12.5" font-weight="800" fill="#64748b">녹말 ${fmtN(remain * 100)}%</text>`;
        out += `<text x="${BX + BW - 2}" y="${BY + BH + 30}" font-size="12.5" font-weight="800" fill="#ea580c" text-anchor="end">엿당 ${fmtN(maltose * 100)}%</text>`;

        // Two Test Tubes Sampled from Beaker
        const TW = 34, TOP = 50, BOT = 172, LIQ_TOP = 86;
        const XA = 166, XB = 250;

        const iodColor = a.iodine
            ? mix(mix('#e2e8f0', '#92400e', 0.3), '#172554', ease(ph2) * clamp(a.remain / 0.6, 0.4, 1))
            : mix('#e2e8f0', '#92400e', 0.3 * ease(ph2));
        const benColor = a.benedict
            ? mix(mix('#e0f2fe', '#0284c7', 0.6), a.maltose < 0.7 ? '#ca8a04' : '#ea580c', ease(ph3))
            : mix('#e0f2fe', '#0284c7', 0.6);

        // Water bath for Tube B during Benedict test
        if (ph3 > 0) {
            out += renderWaterBath(XB - 14, XB + TW + 14, 102, 180, true, p);
        }

        // Render Tube A (Iodine)
        out += renderTestTube(XA, TOP, TW, BOT, LIQ_TOP, ph2 > 0 ? iodColor : '#e2e8f0', 0.88);
        out += `<text class="tube-label" x="${XA + TW / 2}" y="196" text-anchor="middle">아이오딘 검사</text>`;
        out += `<text class="tube-sub" x="${XA + TW / 2}" y="211" text-anchor="middle">${ph2 >= 1 ? (a.iodine ? '청람색 (녹말 있음)' : '반응 없음') : '녹말 잔류 검사'}</text>`;

        // Render Tube B (Benedict)
        out += renderTestTube(XB, TOP, TW, BOT, LIQ_TOP, ph3 > 0 ? benColor : '#e0f2fe', 0.88, a.benedict && ph3 >= 1);
        out += `<text class="tube-label" x="${XB + TW / 2}" y="196" text-anchor="middle">베네딕트 (가열)</text>`;
        out += `<text class="tube-sub" x="${XB + TW / 2}" y="211" text-anchor="middle">${ph3 >= 1 ? (a.benedict ? '황적색 (엿당 생성)' : '푸른색 그대로') : '엿당 생성 검사'}</text>`;

        // Animated Droppers
        if (ph2 > 0 && ph2 < 1) {
            out += renderDropper(XA + TW / 2, 44, '#92400e', ph2 < 0.7 ? TOP + 8 + ph2 / 0.7 * 26 : null);
        }
        if (ph3 > 0 && ph3 < 0.5) {
            out += renderDropper(XB + TW / 2, 44, '#0284c7', ph3 < 0.35 ? TOP + 8 + ph3 / 0.35 * 26 : null);
        }

        // Right-Side Card
        const RX = 316, RW = 184;
        out += `<rect x="${RX}" y="8" width="${RW}" height="220" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" filter="url(#cardShadow)"/>`;
        out += `<rect x="${RX + 10}" y="16" width="${RW - 20}" height="28" rx="6" fill="#f0fdf4" stroke="#bbf7d0"/>`;
        out += `<text class="card-title" x="${RX + 18}" y="35">✂️ 녹말 소화 분석</text>`;

        out += `<text class="card-text" x="${RX + 12}" y="62">조건: <tspan class="card-val">${c.label}</tspan></text>`;
        out += `<text class="card-text" x="${RX + 12}" y="82">효소 활성: <tspan class="card-val" fill="${c.rate > 0.1 ? '#15803d' : '#dc2626'}">${c.rate > 0.1 ? '체온 최적 (매우 활발)' : c.rate > 0.01 ? '저온 (매우 느림)' : '비활성 (변성/없음)'}</tspan></text>`;

        out += `<line x1="${RX + 10}" y1="94" x2="${RX + RW - 10}" y2="94" stroke="#e2e8f0" stroke-width="1"/>`;
        out += `<text class="card-title" x="${RX + 12}" y="114" font-size="13">10분 뒤 검출 결과:</text>`;

        out += `<text class="card-text" x="${RX + 12}" y="136">아이오딘: <tspan class="card-val" fill="${a.iodine ? '#172554' : '#64748b'}">${p >= 0.75 ? (a.iodine ? '청람색 (녹말 잔류)' : '반응 없음 (분해)') : '…'}</tspan></text>`;
        out += `<text class="card-text" x="${RX + 12}" y="156">베네딕트: <tspan class="card-val" fill="${a.benedict ? '#ea580c' : '#0284c7'}">${p >= 1 ? (a.benedict ? '황적색 (엿당 생성)' : '푸른색 그대로') : '…'}</tspan></text>`;

        out += `<rect x="${RX + 10}" y="172" width="${RW - 20}" height="32" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>`;
        const resVerdict = a.verdict === 'digested' ? '녹말 ➔ 엿당 완전 소화!' : a.verdict === 'partial' ? '일부만 소화됨' : '소화되지 않음';
        out += `<text class="card-chip" x="${RX + RW / 2}" y="192" fill="${a.verdict === 'digested' ? '#15803d' : '#ea580c'}" text-anchor="middle">${p >= 1 ? resVerdict : '소화 반응 중…'}</text>`;

        return out;
    }

    /* -------------------------------------------------------- Graph Mode 3 */
    function graphAmylase(a) {
        let out = SVG_DEFS;
        const X0 = 20, W = 480, H = 194;
        out += `<rect x="${X0}" y="8" width="${W}" height="${H}" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2" filter="url(#cardShadow)"/>`;
        out += `<text class="axis-title" x="${X0 + 16}" y="30">📈 시간에 따른 녹말과 엿당의 양 — ${a.c.label}</text>`;

        const GX0 = 70, GX1 = 460, GY0 = 144, GY1 = 44;
        const xOf = t => GX0 + t / REACT_MIN * (GX1 - GX0);
        const yOf = f => GY0 - f * (GY0 - GY1);

        // Grid lines & Axis labels
        [0, 2, 4, 6, 8, 10].forEach(t => {
            out += `<line class="grid-line" x1="${xOf(t).toFixed(1)}" y1="${GY1}" x2="${xOf(t).toFixed(1)}" y2="${GY0}"/>`;
            out += `<text class="axis-text" x="${xOf(t).toFixed(1)}" y="${GY0 + 17}" text-anchor="${t === 0 ? 'start' : t === 10 ? 'end' : 'middle'}">${t}분</text>`;
        });
        [0, 0.5, 1].forEach(f => {
            out += `<line class="grid-line" x1="${GX0}" y1="${yOf(f).toFixed(1)}" x2="${GX1}" y2="${yOf(f).toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${GX0 - 6}" y="${(yOf(f) + 4).toFixed(1)}" text-anchor="end">${f * 100} %</text>`;
        });
        out += `<line class="axis" x1="${GX0}" y1="${GY0}" x2="${GX1}" y2="${GY0}"/>`;
        out += `<line class="axis" x1="${GX0}" y1="${GY1}" x2="${GX0}" y2="${GY0}"/>`;

        // Curves
        let dS = '', dM = '';
        for (let t = 0; t <= REACT_MIN + 1e-9; t += 0.2) {
            const r = a.remainAt(t);
            dS += `${dS ? 'L' : 'M'}${xOf(t).toFixed(1)},${yOf(r).toFixed(1)} `;
            dM += `${dM ? 'L' : 'M'}${xOf(t).toFixed(1)},${yOf(1 - r).toFixed(1)} `;
        }
        out += `<path class="trace" stroke="#64748b" stroke-width="2.5" d="${dS}"/>`;
        out += `<path class="trace" stroke="#ea580c" stroke-width="2.5" d="${dM}"/>`;

        // Threshold line at 15%
        out += `<line class="thresh" x1="${GX0}" y1="${yOf(0.15).toFixed(1)}" x2="${GX1}" y2="${yOf(0.15).toFixed(1)}"/>`;
        out += `<text class="axis-text" style="fill:#64748b" font-size="12.5" x="${GX0 + 8}" y="${(yOf(0.15) - 5).toFixed(1)}">15% 검출 한계선</text>`;

        // Live cursor
        const tNow = REACT_MIN * clamp(state.progress / 0.5, 0, 1);
        out += `<line class="marker" x1="${xOf(tNow).toFixed(1)}" y1="${GY1}" x2="${xOf(tNow).toFixed(1)}" y2="${GY0}"/>`;

        // Legend
        out += `<rect x="${GX1 - 192}" y="14" width="192" height="22" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>`;
        out += `<circle cx="${GX1 - 180}" cy="25" r="4.5" fill="#64748b"/>`;
        out += `<text class="grid-text" font-size="13" style="fill:#475569" x="${GX1 - 170}" y="29.5">녹말 (아이오딘)</text>`;
        out += `<circle cx="${GX1 - 84}" cy="25" r="4.5" fill="#ea580c"/>`;
        out += `<text class="grid-text" font-size="13" style="fill:#ea580c" x="${GX1 - 74}" y="29.5">엿당 (베네딕트)</text>`;

        out += `<text class="note-text" x="${X0 + 16}" y="186">💡 아밀레이스는 체온(37 ℃)에서 가장 빠르게 녹말을 엿당으로 자르며, 끓이면 열 변성으로 파괴됩니다.</text>`;
        return out;
    }

    /* -------------------------------------------------------- Notes & Updates */
    function noteFor(a) {
        if (a.kind === 'reagent') {
            return `<div class="data-row"><span class="data-name">사용한 시약</span><span class="data-val">${a.r.full} — ${TUBES.find(t => t.key === a.r.target).nutrient} 검출용${a.r.needsHeat ? ` (가열 ${a.heated ? '함' : '안 함'})` : ''}</span></div>` +
                `<div class="data-row"><span class="data-name">시험관 반응</span><span class="data-val">${a.results.map((res, i) => `${i + 1}번 ${res.tube.label} [${res.reacts ? a.r.resultName : '변화 없음'}]`).join(' · ')}</span></div>` +
                `<div class="data-row"><span class="data-name">과학적 원리</span><span class="data-val">${a.works ? `${a.r.label}${eun(a.r.label)} ${TUBES.find(t => t.key === a.r.target).nutrient}에만 특이적으로 반응합니다.` : '베네딕트 용액은 가열해야 환원 반응이 일어나므로 실온에서는 색이 변하지 않습니다.'}</span></div>` +
                `<div class="data-row match"><span class="data-name">최종 판정</span><span class="data-val">${PRED_R.find(o => o.value === a.verdict).label}</span></div>`;
        }
        if (a.kind === 'benedict') {
            return `<div class="data-row"><span class="data-name">실험 조건</span><span class="data-val">${a.s.label} ${CONCS[state.conc].label} · 베네딕트 용액 · 가열 ${HEATS[state.bheat].label}</span></div>` +
                `<div class="data-row"><span class="data-name">반응 결과</span><span class="data-val">${!a.heated ? '가열하지 않아 반응이 일어나지 않음 (푸른색 유지)' : !a.s.sugar ? `${a.s.name}${eun(a.s.name)} 당분이 아니라 반응하지 않음` : `${a.s.name}이 구리 이온을 환원시켜 ${a.thick ? '황적색 앙금 생성' : '녹색~황색으로 변화'}`}</span></div>` +
                `<div class="data-row match"><span class="data-name">최종 판정</span><span class="data-val">${PRED_B.find(o => o.value === a.verdict).label}</span></div>`;
        }
        return `<div class="data-row"><span class="data-name">실험 조건</span><span class="data-val">녹말물 + ${a.c.label}, 10분 반응</span></div>` +
            `<div class="data-row"><span class="data-name">성분 변화율</span><span class="data-val">남은 녹말: ${fmtN(a.remain * 100)} % ｜ 생성된 엿당: ${fmtN(a.maltose * 100)} %</span></div>` +
            `<div class="data-row"><span class="data-name">검출 결과</span><span class="data-val">아이오딘 [${a.iodine ? '청람색 (녹말 잔류)' : '반응 없음 (분해 완료)'}] ｜ 베네딕트 [${a.benedict ? '황적색 (엿당 확인)' : '푸른색 그대로'}]</span></div>` +
            `<div class="data-row match"><span class="data-name">최종 판정</span><span class="data-val">${PRED_A.find(o => o.value === a.verdict).label}</span></div>`;
    }

    function render() {
        const a = analyse();
        mainGroup.innerHTML = a.kind === 'reagent' ? renderReagent(a) : a.kind === 'benedict' ? renderBenedict(a) : renderAmylase(a);
        graphGroup.innerHTML = a.kind === 'reagent' ? graphReagent(a) : a.kind === 'benedict' ? graphBenedict(a) : graphAmylase(a);
        liftProse();
        stageBadge.textContent = a.kind === 'reagent'
            ? `${a.r.label}${a.r.needsHeat ? ` · 가열 ${HEATS[state.heat].label}` : ''}`
            : a.kind === 'benedict'
                ? `${a.s.label} · ${CONCS[state.conc].label} · 가열 ${HEATS[state.bheat].label}`
                : a.c.label;
        methodHint.textContent = a.kind === 'reagent'
            ? '시약마다 찾아내는 영양소가 하나씩 정해져 있습니다'
            : a.kind === 'benedict'
                ? '베네딕트 용액은 당분과 만나도 가열해야 색이 납니다'
                : '녹말은 베네딕트에 반응하지 않고, 엿당으로 잘린 뒤라야 반응합니다';
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
        if (a.kind === 'reagent') {
            const { r } = a, tgt = TUBES.find(t => t.key === r.target);
            labelA.textContent = '변한 시험관'; valueA.textContent = a.works ? `${TUBES.indexOf(tgt) + 1}번 ${tgt.label}` : '없음';
            labelB.textContent = '색'; valueB.textContent = a.works ? r.resultName : '그대로';
            if (a.works) {
                s = `${r.full}${eun(r.full)} ${tgt.nutrient}${eul(tgt.nutrient)} 찾아내는 시약입니다. 네 시험관에 똑같이 넣어도 ${tgt.nutrient}이 든 ${TUBES.indexOf(tgt) + 1}번 ${tgt.label}만 ${r.resultName}으로 변하고, 나머지 시험관은 시약 색이 옅게 섞일 뿐 반응하지 않습니다. ${r.target === 'starch' ? '밥이나 감자에 떨어뜨리면 청람색이 되는 것과 같습니다.' : r.target === 'sugar' ? '끓는 물에 담가 가열했기 때문에 반응이 일어났고, 가열하지 않았다면 푸른색 그대로였을 것입니다. 녹말물은 당분이 아니라 변하지 않습니다.' : r.target === 'protein' ? '달걀 흰자처럼 단백질이 든 것만 보라색이 됩니다. 우유나 두부에서도 같은 색이 납니다.' : '수단 Ⅲ은 물에 녹지 않고 지방에만 녹아 색을 내므로, 지방층이 붉게 물드는지 대조군과 비교합니다. 시약 자체의 붉은색만으로 양성이라고 판단하지 않습니다.'}`;
            } else {
                s = `베네딕트 용액은 당분과 만나도 실온에서는 반응하지 않습니다. 끓는 물에 담가 데워야 당분이 구리 이온과 반응해 황적색 앙금이 생기므로, 가열하지 않은 지금은 2번 포도당물까지 푸른색 그대로입니다. 가열 단추를 켜고 다시 해 보세요.`;
            }
        } else if (a.kind === 'benedict') {
            labelA.textContent = '색'; valueA.textContent = PRED_B.find(o => o.value === a.verdict).label;
            labelB.textContent = '가열'; valueB.textContent = HEATS[state.bheat].label;
            s = `${CONCS[state.conc].label} 탄 ${a.s.label}에 베네딕트 용액을 넣고 ${a.heated ? '끓는 물에 담가 가열했습니다' : '가열하지 않았습니다'}. `;
            if (!a.heated) {
                s += `${a.s.sugar ? `${a.s.name}이 들어 있어도 ` : ''}가열하지 않으면 베네딕트 반응은 일어나지 않아 푸른색 그대로입니다. 반응에는 열이 필요하기 때문이고, 그래서 이 실험에서는 시험관을 끓는 물에 2~3분 담급니다.`;
            } else if (!a.s.sugar) {
                s += state.sample === 'starch' ? `가열했는데도 푸른색 그대로입니다. 녹말은 포도당이 수백 개 이어진 큰 덩어리라 베네딕트 용액과 반응하지 못하기 때문입니다. 아밀레이스로 엿당으로 잘라 준 뒤라야 반응합니다.` : `맹물에는 당분이 없으니 가열해도 푸른색 그대로입니다. 이렇게 아무것도 안 든 시험관을 나란히 두는 것이 대조 실험입니다.`;
            } else {
                s += a.thick ? `${a.s.name}이 많아 구리 이온이 충분히 환원되어 황적색 앙금이 생깁니다. 당분이 아주 많으면 적갈색까지 갑니다.` : `${a.s.name}이 조금뿐이라 청색이 녹색이나 황색으로 바뀌는 데서 멈춥니다. 색이 어디까지 가는지로 당분의 양을 어림할 수 있습니다.`;
            }
        } else {
            const { c } = a;
            labelA.textContent = '아이오딘 · 베네딕트'; valueA.textContent = `${a.iodine ? '청람색' : '반응 없음'} · ${a.benedict ? '황적색' : '푸른색'}`;
            labelB.textContent = '남은 녹말'; valueB.textContent = `${fmtN(a.remain * 100)} %`;
            s = `녹말물에 ${c.label}로 10분 두었더니 녹말이 ${fmtN(a.remain * 100)} % 남고 엿당이 ${fmtN(a.maltose * 100)} % 생겼습니다. 아이오딘 검사는 ${a.iodine ? '청람색 (녹말이 남아 있음)' : '변하지 않음 (녹말이 다 없어짐)'}, 베네딕트 검사는 가열한 뒤 ${a.benedict ? '황적색 (엿당이 생김)' : '푸른색 그대로 (엿당이 없음)'}입니다. `;
            if (a.verdict === 'digested') {
                s += `처음 녹말물은 아이오딘에는 반응하고 베네딕트에는 반응하지 않았는데, 결과가 정반대로 뒤집혔습니다. 아밀레이스가 체온에서 녹말을 엿당으로 다 잘랐다는 뜻이고, 입에서 밥을 오래 씹으면 단맛이 나는 까닭이 바로 이것입니다.`;
            } else if (a.verdict === 'partial') {
                s += `차가우면 효소가 느리게 일해 10분 동안 일부만 엿당으로 바뀝니다. 그래서 녹말도 남아 있고(아이오딘 청람색) 엿당도 조금 생겨(베네딕트 황적색) 두 검사가 다 나타납니다.`;
            } else {
                s += c.enzyme ? `끓인 아밀레이스는 모양이 망가져 다시는 일하지 못하므로 녹말이 그대로입니다. 효소는 열에 약합니다.` : `아밀레이스를 넣지 않은 대조군이라 녹말이 그대로입니다. 녹말은 베네딕트 용액에 반응하지 않으므로 가열해도 푸른색이고, 효소가 있어야만 결과가 바뀝니다.`;
            }
        }
        predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : state.prediction === a.verdict ? '🎉 예상이 맞았습니다!' : '💡 예상과 다른 결과입니다. 원리를 확인해 보세요.';
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
        checkBtn.textContent = state.mode === 'reagent' ? '시약 넣기' : state.mode === 'benedict' ? '베네딕트 넣기' : '10분 반응시키고 검사하기';
        stageCaption.textContent = state.mode === 'reagent'
            ? '네 시험관에 같은 시약을 차례로 떨어뜨립니다. 찾는 영양소가 든 시험관만 색이 변하고, 나머지는 시약 색이 옅게 섞일 뿐입니다.'
            : state.mode === 'benedict'
                ? '시험관 하나에 베네딕트 용액을 넣고, 가열을 골랐으면 끓는 물에 담급니다. 오른쪽 색 눈금에서 당분의 양을 읽습니다.'
                : '왼쪽 비커에서 10분 동안 녹말이 엿당으로 잘리는 모습을 보고, 반씩 나누어 아이오딘 검사와 베네딕트 검사를 이어서 합니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { reagent: 'iodine', heat: 'yes', sample: 'glucose', bheat: 'no', conc: 'thick', cond: 'warm', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'reagent').click();
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

    window.__nutrientModel = {
        REAGENTS, HEATS, SAMPLES, CONCS, CONDS, TUBES, state,
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
