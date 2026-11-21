document.addEventListener('DOMContentLoaded', () => {
    const actButtons = [...document.querySelectorAll('[data-act]')];
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const timeRange = document.getElementById('timeRange');
    const timeOutput = document.getElementById('timeOutput');
    const checkBtn = document.getElementById('checkBtn');
    const resetBtn = document.getElementById('resetBtn');
    const resultEmpty = document.getElementById('resultEmpty');
    const resultContent = document.getElementById('resultContent');
    const valueA = document.getElementById('valueA');
    const valueB = document.getElementById('valueB');
    const predictionResult = document.getElementById('predictionResult');
    const explanation = document.getElementById('elementaryExplanation');
    const stageCaption = document.getElementById('stageCaption');
    const stageBadge = document.getElementById('stageBadge');
    const mainGroup = document.getElementById('mainGroup');
    const graphGroup = document.getElementById('graphGroup');
    const dataNote = document.getElementById('dataNote');
    const bodyStats = document.getElementById('bodyStats');

    // Textbook resting and exercising values for a healthy adult.
    const ACTS = {
        rest: { label: '앉아 있기', when: '앉아 있을 때', vo2: 250, hr: 70, sv: 70, rr: 12, tv: 500, gfr: 125, urine: 1.0 },
        water: { label: '물 마시고 쉬기', when: '물을 마시고 쉴 때', vo2: 250, hr: 72, sv: 70, rr: 12, tv: 500, gfr: 130, urine: 4.0 },
        walk: { label: '걷기', when: '걸을 때', vo2: 900, hr: 100, sv: 85, rr: 20, tv: 900, gfr: 110, urine: 0.7 },
        run: { label: '달리기', when: '달릴 때', vo2: 2500, hr: 160, sv: 110, rr: 35, tv: 1800, gfr: 95, urine: 0.4 },
    };
    const DEAD_SPACE = 150;      // mL of each breath that never reaches the air sacs
    const O2_PER_GLUCOSE = 0.746; // litres of oxygen to burn one gram of glucose
    const BLOOD_VOLUME = 5;      // litres
    const PLASMA_GLUCOSE = 1;    // mg per mL of blood plasma
    const AIR_O2 = 0.21;
    const GRAPH = { x0: 116, x1: 424, y0: 158, y1: 24 }; // graph box 460 × 206

    let act = 'rest';
    let prediction = null;

    const minutes = () => Number(timeRange.value);

    function derive(key = act) {
        const d = ACTS[key];
        const co = (d.hr * d.sv) / 1000;                 // litres of blood each minute
        const avDiff = d.vo2 / co;                       // mL of oxygen taken from each litre
        const ve = (d.rr * d.tv) / 1000;                 // all the air moved
        const va = (d.rr * (d.tv - DEAD_SPACE)) / 1000;  // only the air that reaches the air sacs
        const feO2 = AIR_O2 - d.vo2 / (ve * 1000);       // Mixed expired air; illustrative equal inspired/expired volume approximation.
        const glucose = d.vo2 / 1000 / O2_PER_GLUCOSE;   // grams burned each minute
        const kcal = (d.vo2 / 1000) * 5;
        const filteredGlucose = d.gfr * PLASMA_GLUCOSE;  // mg filtered each minute, all taken back
        const circTime = (BLOOD_VOLUME / co) * 60;       // seconds for one lap of the body
        const ratio = d.urine / ACTS.rest.urine;
        const verdict = ratio > 1.05 ? 'more' : ratio < 0.95 ? 'less' : 'same';
        return { key, d, co, avDiff, ve, va, feO2, glucose, kcal, filteredGlucose, circTime, ratio, verdict };
    }

    const fmt = (n, d = 1) => n.toFixed(d);

    function statRow(x, y, name, value, colour, alignEnd) {
        return `<text class="stat-name" x="${x}" y="${y}">${name}</text>` +
               `<text class="stat-value" style="fill:${colour}" x="${alignEnd}" y="${y}" text-anchor="end">${value}</text>`;
    }

    let revealed = false;
    let graphAnim = 0;
    const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function renderMain(a) {
        const beat = 60 / a.d.hr, breath = 60 / a.d.rr;
        let out = '';
        // the body seen from the front, cut at the hips
        out += `<path class="body-shape" d="M219,78 L241,78 Q245,90 262,93 L298,101 Q317,107 321,127 L331,214 Q335,250 329,262 Q324,269 318,262 L312,226 L303,152 L300,180 Q303,232 297,262 Q300,292 292,334 L168,334 Q160,292 163,262 Q157,232 160,180 L157,152 L148,226 L142,262 Q136,269 131,262 Q125,250 129,214 L139,127 Q143,107 162,101 L198,93 Q215,90 219,78Z"/>`;
        out += `<ellipse class="body-shape" cx="230" cy="42" rx="26" ry="31"/>`;
        out += `<path class="body-shape" d="M219,66 L219,84 L241,84 L241,66Z" style="stroke:none"/>`;

        // lungs and windpipe, filling and emptying at the real breathing rate
        out += `<path class="airway" d="M230,72 L230,112 M230,112 Q222,118 212,126 M230,112 Q238,118 248,126"/>`;
        const lungPaths = [
            { cx: 196, d: 'M223,114 C206,104 181,112 173,140 C165,170 167,196 177,205 C191,211 211,205 223,197 Q226,150 223,114 Z' },
            { cx: 266, d: 'M237,114 C254,104 279,112 287,140 C295,170 293,196 283,205 C272,211 259,207 254,201 C264,188 258,170 241,168 Q236,140 237,114 Z' },
        ];
        lungPaths.forEach(l => {
            out += `<g style="transform-origin:${l.cx}px 160px">` +
                   `<path class="lung" d="${l.d}">` +
                   `<animateTransform attributeName="transform" type="scale" values="0.94 0.9; 1.04 1.08; 0.94 0.9" dur="${breath.toFixed(2)}s" repeatCount="indefinite"/></path></g>`;
        });
        for (let i = 0; i < 3; i += 1) {
            out += `<circle class="air-dot" r="2.6"><animateMotion dur="${breath.toFixed(2)}s" repeatCount="indefinite" keyPoints="0;1;0" keyTimes="0;0.5;1" calcMode="linear" begin="${(-i * breath / 6).toFixed(2)}s" path="${i % 2 ? 'M230,60 L230,112 L250,128 L262,150' : 'M230,60 L230,112 L210,128 L198,150'}"/></circle>`;
        }

        // liver, stomach and the intestines below the diaphragm
        out += `<path class="diaphragm" d="M168,209 Q230,188 292,209"/>`;
        out += `<path class="liver" d="M171,213 Q200,199 238,210 Q234,229 207,233 Q181,233 171,213Z"/>`;
        out += `<path class="stomach" d="M246,214 Q270,203 285,216 Q293,235 277,245 Q262,251 252,241 Q258,230 246,222Z"/>`;
        out += `<path class="kidney" d="M186,232 C197,232 199,244 193,248 C199,252 197,264 186,264 C176,264 172,256 172,248 C172,240 176,232 186,232Z M274,234 C284,234 288,242 288,250 C288,258 284,266 274,266 C263,266 261,254 267,250 C261,246 263,234 274,234Z"/>`;
        out += `<path class="large-gut" d="M206,300 L206,250 Q230,240 254,250 L254,300"/>`;
        out += `<path class="small-gut" d="M212,258 q9,-6 18,0 t18,0 q6,7 -2,11 q-9,6 -18,0 t-16,3 q-6,7 2,11 q9,6 18,0 t16,0 q6,7 -2,11 q-10,6 -20,0 t-12,2"/>`;
        out += `<path class="ureter" d="M188,264 Q196,292 220,309 M272,266 Q264,292 240,309"/>`;
        out += `<ellipse class="bladder" cx="230" cy="314" rx="15" ry="10"/>`;

        // the blood loop, with cells taking one real lap of the body
        const loop = 'M244,202 C262,214 286,232 280,260 C274,292 246,302 230,302 C214,302 186,292 180,260 C174,232 198,214 216,202 Q230,194 244,202';
        out += `<path id="bloodPath" class="vessel" d="${loop}"/>`;
        out += `<path id="lungLoop" class="vessel thin" d="M236,176 C214,160 196,150 190,160 C186,172 214,180 236,176"/>`;
        for (let i = 0; i < 10; i += 1) {
            out += `<circle class="blood${i % 2 ? ' spent' : ''}" r="3.6">` +
                   `<animateMotion dur="${a.circTime.toFixed(2)}s" repeatCount="indefinite" ` +
                   `begin="${(-i * a.circTime / 10).toFixed(2)}s"><mpath href="#bloodPath"/></animateMotion></circle>`;
        }
        for (let i = 0; i < 3; i += 1) {
            out += `<circle class="blood spent" r="3"><animateMotion dur="${(a.circTime / 3).toFixed(2)}s" repeatCount="indefinite" begin="${(-i * a.circTime / 9).toFixed(2)}s"><mpath href="#lungLoop"/></animateMotion></circle>`;
        }

        // the heart, squeezing at the real pulse
        out += `<g style="transform-origin:244px 182px">` +
               `<path class="heart" d="M238,160 C248,152 266,160 264,176 C262,192 248,202 240,208 C232,200 222,190 224,176 C226,164 232,160 238,160Z">` +
               `<animateTransform attributeName="transform" type="scale" values="1;0.86;1" dur="${beat.toFixed(3)}s" repeatCount="indefinite"/></path></g>`;

        // drops of urine only once the result is shown, so the drawing does not answer the question first
        if (revealed) {
            const drip = Math.max(0.6, 3 / a.ratio);
            for (let i = 0; i < 4; i += 1) {
                out += `<circle class="urine-drop" r="2.8"><animateMotion dur="${drip.toFixed(2)}s" repeatCount="indefinite" begin="${(-i * drip / 4).toFixed(2)}s" path="${i % 2 ? 'M272,266 Q264,292 240,309' : 'M188,264 Q196,292 220,309'}"/></circle>`;
            }
        }

        // short names with leader lines, kept outside the body
        const tags = [
            ['기관', 'end', 96, 232, 96], ['폐', 'end', 150, 176, 150], ['간', 'end', 220, 182, 220], ['콩팥', 'end', 250, 176, 250], ['작은창자', 'end', 282, 214, 282],
            ['심장', 'start', 182, 262, 182], ['위', 'start', 228, 286, 228], ['큰창자', 'start', 288, 254, 288], ['방광', 'start', 316, 244, 316],
        ];
        tags.forEach(([name, side, y, px, py]) => {
            const tx = side === 'end' ? 96 : 364;
            out += `<path class="leader" d="M${px},${py} L${side === 'end' ? tx + 6 : tx - 6},${y}"/>`;
            out += `<text class="organ-label" x="${tx}" y="${y + 5}" text-anchor="${side}">${name}</text>`;
        });
        window.scienceScene.render(mainGroup, out);
        const svg = mainGroup.ownerSVGElement;
        if (svg && reducedMotion()) svg.pauseAnimations();
    }

    function renderStats(a) {
        if (!bodyStats) return;
        const hide = v => revealed ? v : '?';
        const group = (title, cls, rows) => `<section class="stat-group ${cls}"><h3>${title}</h3>` +
            rows.map(([n, v, strong]) => `<p><span>${n}</span><strong${strong ? ' class="key"' : ''}>${v}</strong></p>`).join('') + '</section>';
        bodyStats.innerHTML =
            group('호흡', 'g-breath', [['호흡수', `${a.d.rr} 회/분`], ['1회 호흡량', `${a.d.tv} mL`], ['분당 환기량', `${fmt(a.ve)} L/분`, true]]) +
            group('순환', 'g-blood', [['심장 박동수', `${a.d.hr} 회/분`], ['1회 박출량', `${a.d.sv} mL`], ['심박출량', `${fmt(a.co)} L/분`, true]]) +
            group('소화·흡수', 'g-gut', [['쓰는 포도당', `${fmt(a.glucose, 2)} g/분`, true], ['내는 열량', `${fmt(a.kcal, 1)} kcal/분`]]) +
            group('배설', 'g-kidney', [['사구체 여과량', hide(`${a.d.gfr} mL/분`)], ['오줌 양', hide(`${fmt(a.d.urine, 1)} mL/분`), true], ['오줌 속 포도당', hide('0 mg')]]);
    }

    const ROWS = [
        { name: '산소 소비량', pick: a => a.d.vo2, unit: 'mL/분', colour: '#8fd0ef' },
        { name: '분당 환기량', pick: a => a.ve, unit: 'L/분', colour: '#0284c7', digits: 1 },
        { name: '심박출량', pick: a => a.co, unit: 'L/분', colour: '#ff8a8a', digits: 1 },
        { name: '사구체 여과량', pick: a => a.d.gfr, unit: 'mL/분', colour: '#c9a6f0' },
        { name: '오줌 양', pick: a => a.d.urine, unit: 'mL/분', colour: '#b8a6f0', digits: 1 },
    ];

    function renderGraph(a, k = 1) {
        const base = derive('rest');
        const ratios = ROWS.map(r => r.pick(a) / r.pick(base));
        const max = Math.max(1.3, ...(revealed ? ratios.map(r => 1 + (r - 1) * k) : [1])) * 1.12;
        const gx = v => GRAPH.x0 + (v / max) * (GRAPH.x1 - GRAPH.x0);
        let out = '';
        for (let i = 0; i <= 4; i += 1) {
            const v = (max / 4) * i;
            out += `<line class="grid-line" x1="${gx(v).toFixed(1)}" y1="${GRAPH.y1}" x2="${gx(v).toFixed(1)}" y2="${GRAPH.y0}"/>`;
            out += `<text class="axis-text" x="${gx(v).toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${v.toFixed(1)}</text>`;
        }
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-title" x="${((GRAPH.x0 + GRAPH.x1) / 2).toFixed(1)}" y="${GRAPH.y0 + 36}" text-anchor="middle">앉아 있을 때를 1로 본 배수</text>`;
        out += `<line class="base-line" x1="${gx(1).toFixed(1)}" y1="${GRAPH.y1}" x2="${gx(1).toFixed(1)}" y2="${GRAPH.y0}"/>`;
        out += `<text class="base-text" x="${(gx(1) + 4).toFixed(1)}" y="${GRAPH.y1 + 9}">기준 1배</text>`;

        ROWS.forEach((row, i) => {
            const y = GRAPH.y1 + 22 + i * 26;
            const ratio = ratios[i];
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(y + 4).toFixed(1)}" text-anchor="end">${row.name}</text>`;
            out += `<rect class="bar-rest" x="${GRAPH.x0}" y="${y - 5}" width="${(gx(1) - GRAPH.x0).toFixed(1)}" height="13" rx="3"/>`;
            if (!revealed) return;
            const shown = 1 + (ratio - 1) * k;
            const colour = ratio > 1.02 ? row.colour : ratio < 0.98 ? '#ea580c' : '#475569';
            out += `<rect class="bar" x="${GRAPH.x0}" y="${y - 5}" width="${Math.max(2, gx(shown) - GRAPH.x0).toFixed(1)}" height="13" rx="3" fill="${colour}" opacity=".85"/>`;
            if (k < 1) return;
            const label = `${ratio.toFixed(2)}배`;
            const flip = gx(ratio) > GRAPH.x1 - 110;
            out += `<text class="bar-text" style="fill:${flip ? '#0f172a' : colour}" x="${(gx(ratio) + (flip ? -6 : 6)).toFixed(1)}" y="${(y + 5).toFixed(1)}"${flip ? ' text-anchor="end"' : ''}>${label}</text>`;
        });
        window.scienceScene.render(graphGroup,out);
    }

    function growGraph(a) {
        cancelAnimationFrame(graphAnim);
        if (reducedMotion()) { renderGraph(a, 1); return; }
        renderGraph(a, 0);
        const t0 = performance.now(), dur = 1100;
        const step = now => {
            const t = Math.min(1, (now - t0) / dur), k = 1 - Math.pow(1 - t, 3);
            renderGraph(a, t >= 1 ? 1 : k);
            if (t < 1) graphAnim = requestAnimationFrame(step);
        };
        graphAnim = requestAnimationFrame(step);
    }

    function render() {
        const a = derive();
        cancelAnimationFrame(graphAnim);
        renderMain(a);
        renderGraph(a);
        renderStats(a);
        timeOutput.textContent = `${minutes()} 분`;
        stageBadge.textContent = `${a.d.label} · 심장 ${a.d.hr}회/분`;
        const t = minutes();
        if (!revealed) { window.scienceScene.render(dataNote, ''); return a; }
        window.scienceScene.render(dataNote,`<div class="data-row"><span class="data-name">산소 소비량</span><span class="data-val">심박출량 ${fmt(a.co)} L/분 × 1 L당 ${fmt(a.avDiff, 0)} mL = ${a.d.vo2} mL/분</span></div>` +
            `<div class="data-row"><span class="data-name">숨</span><span class="data-val">${a.d.rr} 회 × ${a.d.tv} mL = ${fmt(a.ve)} L/분 · 내쉰 숨의 산소 약 ${fmt(a.feO2 * 100, 1)} % (들숨·날숨 부피를 같게 둔 근사)</span></div>` +
            `<div class="data-row"><span class="data-name">양분</span><span class="data-val">포도당 ${fmt(a.glucose, 2)} g/분 · ${t} 분이면 ${fmt(a.glucose * t, 1)} g (${fmt(a.kcal * t, 0)} kcal)</span></div>` +
            `<div class="data-row"><span class="data-name">콩팥</span><span class="data-val">포도당 ${fmt(a.filteredGlucose, 0)} mg/분을 거른 뒤 재흡수합니다 (정상 조건 모형)</span></div>` +
            `<div class="data-row match"><span class="data-name">${t} 분 동안</span><span class="data-val">산소 ${fmt((a.d.vo2 * t) / 1000, 1)} L · 오줌 ${fmt(a.d.urine * t, 0)} mL</span></div>`);
        return a;
    }

    const VERDICT = { more: '늘어난다', same: '그대로다', less: '줄어든다' };

    function check() {
        const first = !revealed;
        revealed = true;
        const a = render();
        if (first) growGraph(a);
        const t = minutes();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        valueA.textContent = `${fmt((a.d.vo2 * t) / 1000, 1)} L`;
        valueB.textContent = `${fmt(a.d.urine * t, 0)} mL`;
        predictionResult.textContent = !prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        const base = derive('rest');
        let s = `${a.d.when} 산소를 1분에 ${a.d.vo2} mL 씁니다. `;
        s += a.key === 'rest' || a.key === 'water'
            ? `이것이 견주어 볼 기준입니다. `
            : `앉아 있을 때의 ${fmt(a.d.vo2 / base.d.vo2, 1)}배입니다. `;
        s += `이만큼을 나르려고 심장은 1분에 ${a.d.hr}번 뛰며 ${fmt(a.co)} L를 내보내고, 폐는 ${a.d.rr}번 숨 쉬며 ${fmt(a.ve)} L 의 공기를 움직입니다. `;
        if (a.key === 'run') {
            s += `이때 심박출량은 ${fmt(a.co / base.co, 1)}배밖에 늘지 않았는데 산소 소비량은 ${fmt(a.d.vo2 / base.d.vo2, 1)}배가 되었습니다. ` +
                 `세포가 피 1 L 에서 뽑아 쓰는 산소가 ${fmt(base.avDiff, 0)} mL 에서 ${fmt(a.avDiff, 0)} mL로 늘었기 때문입니다. `;
            s += `이 예시의 환기량을 적용하면 내쉰 숨의 산소 비율은 ${fmt(base.feO2 * 100, 1)} % 에서 ${fmt(a.feO2 * 100, 1)} %로 높아졌습니다. `;
        }
        if (a.verdict === 'less') s += `피가 근육으로 몰려 콩팥으로 가는 피가 줄었습니다. 사구체 여과량이 ${base.d.gfr} 에서 ${a.d.gfr} mL/분으로 줄어 오줌도 ${fmt(a.d.urine, 1)} mL/분으로 적어졌습니다.`;
        else if (a.verdict === 'more') s += `물을 마셔 몸속 물이 많아지자 콩팥이 물을 덜 되찾아 오줌이 ${fmt(a.d.urine, 1)} mL/분으로 늘었습니다. 몸속 물의 양을 콩팥이 조절합니다.`;
        else s += `콩팥은 걸러 낸 포도당 ${fmt(a.filteredGlucose, 0)} mg/분을 재흡수하는 정상 조건 모형입니다. 실제 재흡수량은 혈당 등 조건에 따라 달라집니다.`;
        explanation.textContent = s;
    }

    timeRange.addEventListener('input', () => { render(); if (!resultContent.hidden) check(); });
    actButtons.forEach(button => button.addEventListener('click', () => {
        act = button.dataset.act;
        actButtons.forEach(item => item.classList.toggle('selected', item === button));
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        revealed = false;
        render();
    }));
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    checkBtn.addEventListener('click', check);
    resetBtn.addEventListener('click', () => {
        timeRange.value = '10';
        prediction = null;
        predictionButtons.forEach(item => item.classList.remove('selected'));
        stageCaption.textContent = '심장 박동과 숨쉬기는 실제 빠르기로 나타냈습니다. 활동을 바꾸면 눈에 띄게 빨라집니다. 수치는 건강한 어른의 예시 자료입니다.';
        actButtons.find(b => b.dataset.act === 'rest').click();
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

    window.__bodyModel = {
        ACTS, DEAD_SPACE, O2_PER_GLUCOSE, BLOOD_VOLUME, AIR_O2, derive, render, check,
        setAct(k) { actButtons.find(b => b.dataset.act === k).click(); },
        setMinutes(v) { timeRange.value = String(v); timeRange.dispatchEvent(new Event('input')); },
        getAct: () => act, minutes,
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
