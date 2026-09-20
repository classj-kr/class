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
    const GRAPH = { x0: 116, x1: 424, y0: 158, y1: 24 };

    let act = 'rest';
    let prediction = null;

    const minutes = () => Number(timeRange.value);

    function derive(key = act) {
        const d = ACTS[key];
        const co = (d.hr * d.sv) / 1000;                 // litres of blood each minute
        const avDiff = d.vo2 / co;                       // mL of oxygen taken from each litre
        const ve = (d.rr * d.tv) / 1000;                 // all the air moved
        const va = (d.rr * (d.tv - DEAD_SPACE)) / 1000;  // only the air that reaches the air sacs
        const feO2 = AIR_O2 - d.vo2 / (va * 1000);       // what is left in the breath we let out
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

    function renderMain(a) {
        const CX = 230;
        const beat = 60 / a.d.hr, breath = 60 / a.d.rr;
        let out = '';
        out += `<text class="organ-label" x="${CX}" y="18" text-anchor="middle">${a.d.label}</text>`;
        out += `<path class="torso" d="M 230 24 C 236 24 240 28 240 34 C 240 39 236 43 234 44 C 242 46 252 50 258 55 C 263 60 266 72 266 86 C 266 98 264 109 261 112 C 259 115 256 113 255 109 C 253 99 254 82 253 71 C 250 69 248 72 248 79 C 248 95 246 114 245 127 C 245 137 243 154 243 172 C 238 172 237 172 236 172 C 235 159 234 146 231 138 C 229 138 229 138 229 138 C 226 146 225 159 224 172 C 223 172 222 172 217 172 C 217 154 215 137 215 127 C 214 114 212 95 212 79 C 212 72 210 69 207 71 C 206 82 207 99 205 109 C 204 113 201 115 199 112 C 196 109 194 98 194 86 C 194 72 197 60 202 55 C 208 50 218 46 226 44 C 224 43 220 39 220 34 C 220 28 224 24 230 24 Z"/>`;

        // the blood loop, with cells taking one real lap of the body
        const path = 'M230,80 C194,86 192,118 200,142 C210,168 250,168 260,142 C268,118 266,86 230,80';
        out += `<path id="bloodPath" class="vessel" d="${path}"/>`;
        for (let i = 0; i < 8; i += 1) {
            out += `<circle class="blood${i % 2 ? ' spent' : ''}" r="3.2">` +
                   `<animateMotion dur="${a.circTime.toFixed(2)}s" repeatCount="indefinite" ` +
                   `begin="${(-i * a.circTime / 8).toFixed(2)}s"><mpath href="#bloodPath"/></animateMotion></circle>`;
        }

        // lungs filling and emptying at the real breathing rate
        const lungPaths = [
            { cx: 206, d: 'M 200 34 C 206 34 220 37 222 51 C 222 65 215 78 206 78 C 195 78 190 69 190 56 C 190 43 194 34 200 34 Z' },
            { cx: 254, d: 'M 260 34 C 266 34 270 43 270 56 C 270 69 265 78 254 78 C 245 78 238 65 238 51 C 240 37 254 34 260 34 Z' },
        ];
        lungPaths.forEach(l => {
            out += `<g style="transform-origin:${l.cx}px 56px">` +
                   `<path class="lung" d="${l.d}">` +
                   `<animateTransform attributeName="transform" type="scale" values="0.95 0.88; 1.05 1.12; 0.95 0.88" dur="${breath.toFixed(2)}s" repeatCount="indefinite"/></path></g>`;
        });
        out += `<text class="organ-label" x="186" y="58" text-anchor="end">폐</text>`;

        // the heart, squeezing at the real pulse
        out += `<g style="transform-origin:${CX}px 96px">` +
               `<path class="heart" d="M 228 79 C 235 79 245 82 245 91 C 245 102 233 109 226 113 C 221 108 215 100 215 90 C 215 82 222 79 228 79 Z">` +
               `<animateTransform attributeName="transform" type="scale" values="1;0.85;1" dur="${beat.toFixed(3)}s" repeatCount="indefinite"/></path></g>`;
        // outside the torso: the right side of the blood loop passes there
        out += `<text class="organ-label" x="182" y="99" text-anchor="end">심장</text>`;

        out += `<path class="gut" d="M204,120 q10,-8 20,0 q10,8 20,0 q10,-8 12,6 q-2,12 -14,10 q-12,-2 -20,4 q-10,6 -18,-2 q-6,-8 0,-18 Z"/>`;
        out += `<text class="organ-label" x="190" y="149" text-anchor="end">소장</text>`;

        out += `<path class="kidney" d="M 214.4 104 C 220.2 104 220.2 112 216.9 118 C 220.2 124 220.2 132 214.4 132 C 206.2 132 200.5 124 200.5 118 C 200.5 112 206.2 104 214.4 104 Z M 245.6 104 C 253.8 104 259.5 112 259.5 118 C 259.5 124 253.8 132 245.6 132 C 239.8 132 239.8 124 243.1 118 C 239.8 112 239.8 104 245.6 104 Z"/>`;
        out += `<text class="organ-label" x="190" y="122" text-anchor="end">콩팥</text>`;

        // Breathing and pumping on the left, feeding and filtering on the right.
        // The columns stop short of the body so the organ labels have room.
        out += `<text class="group-title" style="fill:#8fd0ef" x="14" y="40">호흡</text>`;
        out += statRow(14, 56, '호흡수', `${a.d.rr} 회/분`, '#0f172a', 144);
        out += statRow(14, 70, '1회 호흡량', `${a.d.tv} mL`, '#0f172a', 144);
        out += statRow(14, 84, '분당 환기량', `${fmt(a.ve)} L/분`, '#8fd0ef', 144);
        out += `<text class="group-title" style="fill:#ff8a8a" x="14" y="106">순환</text>`;
        out += statRow(14, 122, '심장 박동수', `${a.d.hr} 회/분`, '#0f172a', 144);
        out += statRow(14, 136, '1회 박출량', `${a.d.sv} mL`, '#0f172a', 144);
        out += statRow(14, 150, '심박출량', `${fmt(a.co)} L/분`, '#ff8a8a', 144);

        out += `<text class="group-title" style="fill:#d9b070" x="300" y="40">소화·흡수</text>`;
        out += statRow(300, 56, '쓰는 포도당', `${fmt(a.glucose, 2)} g/분`, '#d9b070', 452);
        out += statRow(300, 70, '내는 열량', `${fmt(a.kcal, 1)} kcal/분`, '#0f172a', 452);
        out += `<text class="group-title" style="fill:#c9a6f0" x="300" y="106">배설</text>`;
        out += statRow(300, 122, '사구체 여과량', `${a.d.gfr} mL/분`, '#0f172a', 452);
        out += statRow(300, 136, '오줌 양', `${fmt(a.d.urine, 1)} mL/분`, '#c9a6f0', 452);
        out += statRow(300, 150, '오줌 속 포도당', `0 mg`, '#0f172a', 452);

        out += `<text class="note-text" x="14" y="188">산소 소비량 ${a.d.vo2} mL/분 = 심박출량 ${fmt(a.co)} L × 1 L에서 뽑아 쓴 ${fmt(a.avDiff, 0)} mL</text>`;
        out += `<text class="note-text" x="14" y="204">피가 온몸을 한 바퀴 도는 데 ${fmt(a.circTime, 0)} 초 · 내쉰 숨의 산소 ${fmt(a.feO2 * 100, 1)} % — 심장과 폐는 실제 빠르기입니다</text>`;
        mainGroup.innerHTML = out;
    }

    const ROWS = [
        { name: '산소 소비량', pick: a => a.d.vo2, unit: 'mL/분', colour: '#8fd0ef' },
        { name: '분당 환기량', pick: a => a.ve, unit: 'L/분', colour: '#0284c7', digits: 1 },
        { name: '심박출량', pick: a => a.co, unit: 'L/분', colour: '#ff8a8a', digits: 1 },
        { name: '사구체 여과량', pick: a => a.d.gfr, unit: 'mL/분', colour: '#c9a6f0' },
        { name: '오줌 양', pick: a => a.d.urine, unit: 'mL/분', colour: '#b8a6f0', digits: 1 },
    ];

    function renderGraph(a) {
        const base = derive('rest');
        const ratios = ROWS.map(r => r.pick(a) / r.pick(base));
        const max = Math.max(1.3, ...ratios) * 1.12;
        const gx = v => GRAPH.x0 + (v / max) * (GRAPH.x1 - GRAPH.x0);
        let out = '';
        for (let i = 0; i <= 4; i += 1) {
            const v = (max / 4) * i;
            out += `<line class="grid-line" x1="${gx(v).toFixed(1)}" y1="${GRAPH.y1}" x2="${gx(v).toFixed(1)}" y2="${GRAPH.y0}"/>`;
            out += `<text class="axis-text" x="${gx(v).toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${v.toFixed(1)}</text>`;
        }
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-title" x="${((GRAPH.x0 + GRAPH.x1) / 2).toFixed(1)}" y="${GRAPH.y0 + 30}" text-anchor="middle">앉아 있을 때를 1로 본 배수</text>`;
        out += `<line class="base-line" x1="${gx(1).toFixed(1)}" y1="${GRAPH.y1}" x2="${gx(1).toFixed(1)}" y2="${GRAPH.y0}"/>`;
        out += `<text class="base-text" x="${(gx(1) + 4).toFixed(1)}" y="${GRAPH.y1 + 9}">기준 1배</text>`;

        ROWS.forEach((row, i) => {
            const y = GRAPH.y1 + 22 + i * 26;
            const value = row.pick(a), ratio = ratios[i];
            const colour = ratio > 1.02 ? row.colour : ratio < 0.98 ? '#ea580c' : '#475569';
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(y + 4).toFixed(1)}" text-anchor="end">${row.name}</text>`;
            out += `<rect class="bar" x="${GRAPH.x0}" y="${y - 5}" width="${Math.max(2, gx(ratio) - GRAPH.x0).toFixed(1)}" height="13" rx="3" fill="${colour}" opacity=".82"/>`;
            const label = `${ratio.toFixed(2)}배 · ${value.toFixed(row.digits ?? 0)} ${row.unit}`;
            const flip = gx(ratio) > GRAPH.x1 - 110;
            out += `<text class="bar-text" style="fill:${flip ? '#ffffff' : colour}" x="${(gx(ratio) + (flip ? -6 : 6)).toFixed(1)}" y="${(y + 5).toFixed(1)}"${flip ? ' text-anchor="end"' : ''}>${label}</text>`;
        });
        graphGroup.innerHTML = out;
    }

    function render() {
        const a = derive();
        renderMain(a);
        renderGraph(a);
        timeOutput.textContent = `${minutes()} 분`;
        stageBadge.textContent = `${a.d.label} · 심장 ${a.d.hr}회/분`;
        const t = minutes();
        dataNote.innerHTML =
            `<div class="data-row"><span class="data-name">산소 소비량</span><span class="data-val">심박출량 ${fmt(a.co)} L/분 × 1 L당 ${fmt(a.avDiff, 0)} mL = ${a.d.vo2} mL/분</span></div>` +
            `<div class="data-row"><span class="data-name">숨</span><span class="data-val">${a.d.rr} 회 × ${a.d.tv} mL = ${fmt(a.ve)} L/분 · 내쉰 숨의 산소 ${fmt(a.feO2 * 100, 1)} %</span></div>` +
            `<div class="data-row"><span class="data-name">양분</span><span class="data-val">포도당 ${fmt(a.glucose, 2)} g/분 · ${t} 분이면 ${fmt(a.glucose * t, 1)} g (${fmt(a.kcal * t, 0)} kcal)</span></div>` +
            `<div class="data-row"><span class="data-name">콩팥</span><span class="data-val">포도당 ${fmt(a.filteredGlucose, 0)} mg/분을 거른 뒤 재흡수합니다 (정상 조건 모형)</span></div>` +
            `<div class="data-row match"><span class="data-name">${t} 분 동안</span><span class="data-val">산소 ${fmt((a.d.vo2 * t) / 1000, 1)} L · 오줌 ${fmt(a.d.urine * t, 0)} mL</span></div>`;
        return a;
    }

    const VERDICT = { more: '늘어난다', same: '그대로다', less: '줄어든다' };

    function check() {
        const a = derive();
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
            s += `숨을 아주 많이 쉬어서 내쉰 숨의 산소가 오히려 ${fmt(base.feO2 * 100, 1)} % 에서 ${fmt(a.feO2 * 100, 1)} %로 높아졌습니다. `;
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
        stageCaption.textContent = '심장과 폐는 실제 빠르기로 뜁니다. 활동을 바꾸면 눈에 띄게 빨라집니다.';
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
