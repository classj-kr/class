document.addEventListener('DOMContentLoaded', () => {
    const placeButtons = [...document.querySelectorAll('[data-place]')];
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const tempRange = document.getElementById('tempRange');
    const saltRange = document.getElementById('saltRange');
    const windRange = document.getElementById('windRange');
    const tempOutput = document.getElementById('tempOutput');
    const saltOutput = document.getElementById('saltOutput');
    const windOutput = document.getElementById('windOutput');
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

    // The usual straight-line stand-in for how sea water density depends on
    // temperature and salt: colder is heavier, saltier is heavier.
    const RHO0 = 1027, T0 = 10, S0 = 35;
    const ALPHA = 1.7e-4;     // per degree
    const BETA = 7.6e-4;      // per psu
    const MEAN_RHO = 1026;    // what we compare against
    const DEEP_T = 4, THERMO_M = 400, MAX_DEPTH = 1000;
    const SEA = { x0: 20, x1: 250, top: 48, bottom: 190 };
    const PX_PER_M = (SEA.bottom - SEA.top) / MAX_DEPTH;
    // depth runs downward, so the temperature axis sits along the top
    const GRAPH = { x0: 74, x1: 424, y0: 172, y1: 52 };

    // Whatever the total salinity, the salts keep these proportions.
    const SALTS = [
        { n: '염화 나트륨', pct: 77.7, c: '#e8ecee' },
        { n: '염화 마그네슘', pct: 10.9, c: '#8fd0c0' },
        { n: '황산 마그네슘', pct: 4.7, c: '#7fb8e8' },
        { n: '황산 칼슘', pct: 3.6, c: '#c9a8e0' },
        { n: '기타', pct: 3.1, c: '#b8a888' },
    ];
    const PLACES = {
        equator: { label: '적도', temp: 28, salt: 34, wind: 3, why: '비가 많이 내려 염분이 조금 낮습니다' },
        middle: { label: '중위도', temp: 18, salt: 36, wind: 5, why: '증발이 활발해 염분이 높습니다' },
        polar: { label: '극지방', temp: 1, salt: 33, wind: 7, why: '얼음이 녹아 염분이 낮지만 아주 차갑습니다' },
    };

    let place = 'middle';
    let prediction = null;

    const temp = () => Number(tempRange.value);
    const salt = () => Number(saltRange.value);
    const wind = () => Number(windRange.value);

    function analyse(T = temp(), S = salt(), W = wind()) {
        const rho = RHO0 * (1 - ALPHA * (T - T0) + BETA * (S - S0));
        const mixed = 20 + 8 * W;                       // metres the wind can stir
        const verdict = S > 35 ? 'heavier' : S < 35 ? 'lighter' : 'same';
        // A thermocline needs a warm surface over cold deep water. Where the
        // surface is already as cold, the column is even or slightly inverted.
        const thermo = T - DEEP_T > 2 ? 'normal' : DEEP_T - T > 2 ? 'inverse' : 'weak';
        const grams = SALTS.map(s => (S * s.pct) / 100);
        return { T, S, W, rho, mixed, verdict, thermo, grams, place: PLACES[place] };
    }

    // Temperature at any depth: stirred on top, falling away below, steady deep down.
    function tempAt(z, a) {
        if (z <= a.mixed) return a.T;
        if (z >= a.mixed + THERMO_M) return DEEP_T;
        return a.T + (DEEP_T - a.T) * ((z - a.mixed) / THERMO_M);
    }

    const dy = m => SEA.top + m * PX_PER_M;

    function renderMain(a) {
        const thermoEnd = Math.min(MAX_DEPTH, a.mixed + THERMO_M);
        let out = '';
        let body = '';
        body += `<rect class="layer-mixed" x="${SEA.x0}" y="${SEA.top}" width="${SEA.x1 - SEA.x0}" height="${(dy(a.mixed) - SEA.top).toFixed(1)}"/>`;
        body += `<rect class="layer-thermo" x="${SEA.x0}" y="${dy(a.mixed).toFixed(1)}" width="${SEA.x1 - SEA.x0}" height="${(dy(thermoEnd) - dy(a.mixed)).toFixed(1)}"/>`;
        body += `<rect class="layer-deep" x="${SEA.x0}" y="${dy(thermoEnd).toFixed(1)}" width="${SEA.x1 - SEA.x0}" height="${(SEA.bottom - dy(thermoEnd)).toFixed(1)}"/>`;
        // the wind stirring the top layer
        for (let i = 0; i < Math.max(1, Math.round(a.W / 2) + 1); i += 1) {
            const cx = SEA.x0 + 30 + i * 42;
            if (cx > SEA.x1 - 16) break;
            const r = Math.max(4, (dy(a.mixed) - SEA.top) * 0.3);
            body += `<path class="swirl" d="M${cx - r},${(SEA.top + r + 3).toFixed(1)} a${r},${r} 0 1 1 ${r * 0.7},${r * 0.5}">` +
                    `<animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${(SEA.top + r + 3).toFixed(1)}" ` +
                    `to="360 ${cx} ${(SEA.top + r + 3).toFixed(1)}" dur="${(6 - a.W * 0.4).toFixed(1)}s" repeatCount="indefinite"/></path>`;
        }
        out += `<g clip-path="url(#seaClip)">${body}</g>`;
        out += `<rect class="sea-frame" x="${SEA.x0}" y="${SEA.top}" width="${SEA.x1 - SEA.x0}" height="${SEA.bottom - SEA.top}"/>`;
        out += `<line class="surface-line" x1="${SEA.x0}" y1="${SEA.top}" x2="${SEA.x1}" y2="${SEA.top}"/>`;
        [a.mixed, thermoEnd].forEach(m => {
            out += `<line class="layer-line" x1="${SEA.x0}" y1="${dy(m).toFixed(1)}" x2="${SEA.x1}" y2="${dy(m).toFixed(1)}"/>`;
        });
        // Thin layers would stack their captions on top of one another, so each
        // one is pushed at least a line below the last.
        const l1 = SEA.top + 12;
        const l2 = Math.max(dy(a.mixed) + 12, l1 + 14);
        const l3 = Math.min(Math.max(dy(thermoEnd) + 12, l2 + 14), SEA.bottom - 5);
        out += `<text class="layer-text" x="${SEA.x0 + 6}" y="${l1.toFixed(1)}">혼합층 ${a.mixed} m</text>`;
        out += `<text class="layer-text" x="${SEA.x0 + 6}" y="${l2.toFixed(1)}">${THERMO_NAME[a.thermo]}</text>`;
        out += `<text class="layer-text" x="${SEA.x0 + 6}" y="${l3.toFixed(1)}">심해층 ${DEEP_T} ℃</text>`;
        [0, 500, 1000].forEach(m => {
            // the deepest label goes above its line, clear of the reading below
            const ty = m === MAX_DEPTH ? dy(m) - 5 : dy(m) + 3;
            out += `<text class="depth-text" x="${SEA.x1 + 4}" y="${ty.toFixed(1)}">${m} m</text>`;
        });
        // wind arrows above the water
        for (let i = 0; i < Math.max(1, a.W); i += 1) {
            const y = 34 + (i % 2) * 8, x = SEA.x0 + 10 + Math.floor(i / 2) * 44;
            if (x + 26 > SEA.x1) break;
            out += `<line class="wind-arrow" x1="${x}" y1="${y}" x2="${x + 22}" y2="${y}"/>`;
            out += `<path class="wind-arrow" d="M${x + 16},${y - 4} L${x + 22},${y} L${x + 16},${y + 4}"/>`;
        }
        if (a.W === 0) out += `<text class="small-label" x="${SEA.x0 + 10}" y="40">바람 없음</text>`;

        // the salts, always in the same proportions
        const BX = 282, BW = 158, BY = 60;
        out += `<text class="part-label" x="${BX}" y="${BY - 8}">바닷물 1 kg에 녹은 염류 ${a.S} g</text>`;
        let cursor = BX;
        SALTS.forEach(s => {
            const w = (BW * s.pct) / 100;
            out += `<rect class="salt-seg" x="${cursor.toFixed(1)}" y="${BY}" width="${w.toFixed(1)}" height="15" fill="${s.c}"/>`;
            cursor += w;
        });
        SALTS.forEach((s, i) => {
            const y = BY + 32 + i * 14;
            out += `<rect x="${BX}" y="${y - 8}" width="9" height="9" rx="2" fill="${s.c}"/>`;
            out += `<text class="salt-text" style="fill:${s.c}" x="${BX + 14}" y="${y}">${s.n} ${s.pct}%</text>`;
            out += `<text class="salt-text" style="fill:#0f172a" x="448" y="${y}" text-anchor="end">${a.grams[i].toFixed(2)} g</text>`;
        });
        out += `<text class="note-text" x="${BX}" y="${BY + 32 + SALTS.length * 14 + 8}">염분이 달라져도 비율은 그대로입니다</text>`;

        out += `<text class="part-label" x="20" y="24">${a.place.label} · 수온 ${a.T} ℃ · 염분 ${a.S} psu</text>`;
        out += `<text class="read-text" x="20" y="208">바닷물 1 kg의 염류 ${a.S} g</text>`;
        mainGroup.innerHTML = out;
    }

    const VERDICT = { heavier: '평균보다 무거워 가라앉습니다', same: '평균과 비슷해 그대로 있습니다', lighter: '평균보다 가벼워 떠 있습니다' };
    const THERMO_NAME = { normal: '수온 약층', weak: '수온이 거의 일정', inverse: '깊을수록 조금 따뜻해짐' };
    const THERMO_WHY = {
        normal: `그 아래에서 수온이 심해층의 ${DEEP_T} ℃까지 빠르게 떨어지는 수온 약층이 나타납니다. `,
        weak: `표층 수온이 심해층과 비슷해 수온 약층이 뚜렷하게 나타나지 않습니다. `,
        inverse: `표층이 심해층보다 오히려 차가워, 깊어질수록 수온이 조금 올라갑니다. 극지방 바다에서 볼 수 있는 모습입니다. `,
    };
    const SHORT = { heavier: '크다', same: '비슷하다', lighter: '작다' };
    const SENTENCE = { heavier: '커서 아래로 가라앉습니다', same: '비슷해서 그 자리에 머무릅니다', lighter: '작아서 위에 떠 있습니다' };
    // 이/가 after a number depends on the last digit read aloud:
    // 영·일·삼·육·칠·팔 end in a consonant, 이·사·오·구 do not.
    const numIga = s => s + ('013678'.includes(s[s.length - 1]) ? '이' : '가');

    function renderGraph(a) {
        const gx = t => GRAPH.x0 + (t / 30) * (GRAPH.x1 - GRAPH.x0);
        const gy = m => GRAPH.y1 + (m / MAX_DEPTH) * (GRAPH.y0 - GRAPH.y1);
        let out = '';
        [0, 10, 20, 30].forEach(t => {
            out += `<line class="grid-line" x1="${gx(t).toFixed(1)}" y1="${GRAPH.y1}" x2="${gx(t).toFixed(1)}" y2="${GRAPH.y0}"/>`;
            out += `<text class="axis-text" x="${gx(t).toFixed(1)}" y="${GRAPH.y1 - 8}" text-anchor="middle">${t}</text>`;
        });
        [0, 250, 500, 750, 1000].forEach(m => {
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(gy(m) + 3).toFixed(1)}" text-anchor="end">${m}</text>`;
        });
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y1}" x2="${GRAPH.x1}" y2="${GRAPH.y1}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y1}" x2="${GRAPH.x0}" y2="${GRAPH.y0}"/>`;
        out += `<text class="axis-title" x="${((GRAPH.x0 + GRAPH.x1) / 2).toFixed(1)}" y="26" text-anchor="middle">수온 (℃)</text>`;
        out += `<text class="axis-title" x="22" y="26">깊이 (m)</text>`;

        const thermoEnd = Math.min(MAX_DEPTH, a.mixed + THERMO_M);
        [[a.mixed, '혼합층 아래'], [thermoEnd, '심해층 위']].forEach(([m, name]) => {
            out += `<line class="band-line" x1="${GRAPH.x0}" y1="${gy(m).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(m).toFixed(1)}"/>`;
            // a line near the top has no room above it, so its caption drops below
            const ly = gy(m) - 4 < GRAPH.y1 + 12 ? gy(m) + 13 : gy(m) - 4;
            out += `<text class="band-text" x="${GRAPH.x1 - 4}" y="${ly.toFixed(1)}" text-anchor="end">${name} ${Math.round(m)} m</text>`;
        });
        const pts = [];
        for (let m = 0; m <= MAX_DEPTH; m += 5) pts.push(`${gx(tempAt(m, a)).toFixed(1)},${gy(m).toFixed(1)}`);
        out += `<path class="trace" d="M${pts.join('L')}"/>`;
        out += `<circle class="trace-dot" cx="${gx(a.T).toFixed(1)}" cy="${gy(0).toFixed(1)}" r="5" fill="#d97706"/>`;
        graphGroup.innerHTML = out;
    }

    function render() {
        const a = analyse();
        renderMain(a);
        renderGraph(a);
        tempOutput.textContent = `${a.T} ℃`;
        saltOutput.textContent = `${a.S} psu`;
        windOutput.textContent = `${a.W} 단계`;
        stageBadge.textContent = `${a.place.label} · 염분 ${a.S}`;
        dataNote.innerHTML='<p>바닷물 1 kg에 녹은 염류: '+a.S+' g · 염화 나트륨: '+a.grams[0].toFixed(2)+' g</p><p>염류의 구성 비율은 대체로 일정합니다. 바람에 따른 층 두께는 이 모형의 예시값입니다.</p>';
        return a;
    }

    function check() {
        const a=render();resultEmpty.hidden=true;resultContent.hidden=false;
        valueA.textContent=a.S+' g';valueB.textContent=a.mixed+' m (모형)';
        predictionResult.textContent=!prediction?'다음에는 먼저 예상해 보세요.':prediction===a.verdict?'예상이 맞았습니다.':'예상과 다른 결과입니다.';
        explanation.textContent='바닷물 1 kg에 녹은 염류의 양은 '+a.S+' g입니다. 염분이 달라도 주된 염류의 구성 비율은 대체로 일정합니다. 바람이 강할수록 표층 물이 깊게 섞일 수 있습니다. '+THERMO_WHY[a.thermo];
    }

    function changed() {
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        render();
    }

    [tempRange, saltRange, windRange].forEach(el => el.addEventListener('input', () => {
        render(); if (!resultContent.hidden) check();
    }));
    placeButtons.forEach(button => button.addEventListener('click', () => {
        place = button.dataset.place;
        const p = PLACES[place];
        tempRange.value = String(p.temp);
        saltRange.value = String(p.salt);
        windRange.value = String(p.wind);
        placeButtons.forEach(item => item.classList.toggle('selected', item === button));
        changed();
    }));
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    checkBtn.addEventListener('click', check);
    resetBtn.addEventListener('click', () => {
        prediction = null;
        predictionButtons.forEach(item => item.classList.remove('selected'));
        stageCaption.textContent = '바람이 셀수록 섞이는 층이 두꺼워집니다. 염류의 비율은 언제나 그대로입니다.';
        placeButtons.find(b => b.dataset.place === 'middle').click();
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

    window.__seaModel = {
        RHO0, T0, S0, ALPHA, BETA, MEAN_RHO, DEEP_T, THERMO_M, MAX_DEPTH, SALTS, PLACES,
        analyse, tempAt, render, check,
        setPlace(p) { placeButtons.find(b => b.dataset.place === p).click(); },
        setTemp(v) { tempRange.value = String(v); tempRange.dispatchEvent(new Event('input')); },
        setSalt(v) { saltRange.value = String(v); saltRange.dispatchEvent(new Event('input')); },
        setWind(v) { windRange.value = String(v); windRange.dispatchEvent(new Event('input')); },
        getPlace: () => place,
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
