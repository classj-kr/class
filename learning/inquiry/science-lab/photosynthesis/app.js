document.addEventListener('DOMContentLoaded', () => {
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const lightRange = document.getElementById('lightRange');
    const co2Range = document.getElementById('co2Range');
    const tempRange = document.getElementById('tempRange');
    const lightOutput = document.getElementById('lightOutput');
    const co2Output = document.getElementById('co2Output');
    const tempOutput = document.getElementById('tempOutput');
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

    // Blackman's limiting-factor picture, which is what the textbook graph
    // shows: the scarcest resource sets the ceiling, so raising anything else
    // does nothing until that one is relieved.
    const V_MAX = 100;          // bubbles per minute at full capacity
    const K_LIGHT = 1.5;        // light saturates at 100/1.5 ≈ 67
    const K_CO2 = 2.0;          // CO₂ saturates at 100/2.0 = 50
    // Photosynthesis is enzyme-driven, so it climbs to an optimum and then
    // falls away sharply as the enzymes denature.
    const T_OPT = 32, T_RISE = 12, T_FALL = 7;
    /* 숫자 뒤 조사는 그 수를 읽은 끝소리를 따릅니다.
       영 일 이 삼 사 오 육 칠 팔 구 — 0·1·3·6·7·8만 받침이 있습니다. */
    const DIGIT_JONG = { '0': 21, '1': 8, '2': 0, '3': 16, '4': 0, '5': 0, '6': 1, '7': 8, '8': 8, '9': 0 };
    const iga = n => `${n}${DIGIT_JONG[String(n).replace(/[^0-9]/g, '').slice(-1)] > 0 ? '이' : '가'}`;
    const GRAPH = { x0: 54, x1: 424, y0: 152, y1: 22 };

    let prediction = null;

    const light = () => Number(lightRange.value);
    const co2 = () => Number(co2Range.value);
    const temp = () => Number(tempRange.value);

    const tempFactor = t => {
        const w = t <= T_OPT ? T_RISE : T_FALL;
        return Math.exp(-(((t - T_OPT) / w) ** 2));
    };

    function analyse(L = light(), C = co2(), T = temp()) {
        const byLight = K_LIGHT * L;
        const byCO2 = K_CO2 * C;
        const cap = Math.min(byLight, byCO2, V_MAX);
        const fT = tempFactor(T);
        const rate = cap * fT;
        // Which one is actually holding it back right now
        let limiter;
        if (byLight <= byCO2 && byLight < V_MAX) limiter = 'light';
        else if (byCO2 < byLight && byCO2 < V_MAX) limiter = 'co2';
        else limiter = 'none';
        // Temperature outranks the others when it is what is really costing us
        const tempCost = cap * (1 - fT);
        const otherHeadroom = V_MAX - cap;
        if (fT < 0.85 && tempCost >= otherHeadroom * 0.5) limiter = 'temp';
        return { byLight, byCO2, cap, fT, rate, limiter };
    }

    const gx = v => GRAPH.x0 + (v / 100) * (GRAPH.x1 - GRAPH.x0);
    const gy = v => GRAPH.y0 - (v / V_MAX) * (GRAPH.y0 - GRAPH.y1);
    const LIMIT_NAME = { light: '빛의 세기', co2: '이산화탄소', temp: '온도', none: '없음 (최대)' };
    const LIMIT_TONE = { light: '#d97706', co2: '#0284c7', temp: '#ea580c', none: '#059669' };

    function renderMain() {
        const a = analyse();
        const TUBE = { x0: 176, x1: 244, top: 30, bottom: 186 };
        const surface = 50;
        let out = '';
        // lamp on the left, its brightness tracking the light setting
        const lit = light() / 100;
        out += `<circle class="lamp-glow" cx="72" cy="96" r="30" fill="#d97706" opacity="${(0.06 + 0.34 * lit).toFixed(2)}"/>`;
        out += `<circle class="lamp-glow" cx="72" cy="96" r="17" fill="#fff3c4" opacity="${(0.15 + 0.75 * lit).toFixed(2)}"/>`;
        out += `<rect class="lamp-body" x="58" y="118" width="28" height="34" rx="4"/>`;
        for (let i = 0; i < 5; i += 1) {
            const y = 62 + i * 17;
            out += `<line class="lamp-ray" x1="104" y1="${y}" x2="${(104 + 26 * lit).toFixed(1)}" y2="${y}" opacity="${(0.15 + 0.75 * lit).toFixed(2)}"/>`;
        }
        out += `<text class="part-label" x="72" y="168" text-anchor="middle">빛 ${light()}</text>`;

        out += `<rect class="tube" x="${TUBE.x0}" y="${surface}" width="${TUBE.x1 - TUBE.x0}" height="${TUBE.bottom - surface}" rx="6"/>`;
        out += `<ellipse class="water-surface" cx="${(TUBE.x0 + TUBE.x1) / 2}" cy="${surface}" rx="${(TUBE.x1 - TUBE.x0) / 2 - 2}" ry="3.5"/>`;
        // dissolved CO₂ shown at the concentration that was set
        const dots = Math.round(co2() / 8);
        for (let i = 0; i < dots; i += 1) {
            const x = TUBE.x0 + 8 + ((i * 23) % (TUBE.x1 - TUBE.x0 - 16));
            const y = surface + 14 + ((i * 31) % (TUBE.bottom - surface - 26));
            out += `<circle class="co2-dot" cx="${x}" cy="${y}" r="2.6"/>`;
        }
        // the pondweed, pale when the enzymes are too hot to work
        const pale = a.fT < 0.35;
        out += `<path class="stem" d="M210,${TUBE.bottom - 8} L210,${surface + 22}"/>`;
        for (let i = 0; i < 6; i += 1) {
            const y = TUBE.bottom - 20 - i * 18, side = i % 2 === 0 ? -1 : 1;
            const lx = 210 + side * 13;
            out += `<g transform="translate(${lx - 12}, ${y - 8}) scale(0.24) rotate(${side * 60 + 90} 50 50)">` +
                   `<path class="leaf${pale ? ' pale' : ''}" d="M 50 10 C 78 28 88 56 50 90 C 12 56 22 28 50 10 Z" fill="#2d6a4f"/>` +
                   `<path d="M 50 18 L 50 86 M 50 36 L 68 46 M 50 54 L 72 64 M 50 36 L 32 46 M 50 54 L 28 64" stroke="#52b788" stroke-width="2" fill="none"/>` +
                   `</g>`;
        }
        // bubbles: the rate they leave is the measurement
        const bubbles = Math.min(14, Math.round(a.rate / 7));
        for (let i = 0; i < bubbles; i += 1) {
            const x = 206 + ((i * 13) % 18);
            const dur = (2.6 - 1.5 * (a.rate / V_MAX)).toFixed(2);
            const delay = ((i * 0.9) / Math.max(1, bubbles)).toFixed(2);
            out += `<circle class="bubble" cx="${x}" cy="${TUBE.bottom - 26}" r="${(2.2 + (i % 3) * 0.7).toFixed(1)}">` +
                   `<animate attributeName="cy" from="${TUBE.bottom - 26}" to="${surface + 4}" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>` +
                   `<animate attributeName="opacity" values="0;.9;.9;0" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/></circle>`;
        }
        // thermometer
        const TX = 268, tf = Math.max(0, Math.min(1, temp() / 50));
        out += `<rect class="therm-tube" x="${TX}" y="56" width="9" height="96" rx="4.5"/>`;
        out += `<rect class="therm-fill" x="${TX + 2}" y="${(148 - 90 * tf).toFixed(1)}" width="5" height="${(90 * tf + 4).toFixed(1)}" rx="2.5"/>`;
        out += `<text class="part-label" x="${TX + 15}" y="72">${temp()} ℃</text>`;

        out += `<text class="count-text" x="330" y="66">${a.rate.toFixed(0)} 개/분</text>`;
        out += `<text class="part-label" x="330" y="84">1분 동안 나온 기포</text>`;
        out += `<text class="limit-badge" fill="${LIMIT_TONE[a.limiter]}" x="330" y="112">제한 요인: ${LIMIT_NAME[a.limiter]}</text>`;
        out += `<text class="part-label" x="330" y="132">빛이 낼 수 있는 양 ${Math.min(V_MAX, a.byLight).toFixed(0)}</text>`;
        out += `<text class="part-label" x="330" y="148">CO₂가 낼 수 있는 양 ${Math.min(V_MAX, a.byCO2).toFixed(0)}</text>`;
        out += `<text class="part-label" x="330" y="164">온도 효율 ${(a.fT * 100).toFixed(0)}%</text>`;
        mainGroup.innerHTML = out;
        return a;
    }

    function renderGraph(a) {
        let out = '';
        for (let v = 0; v <= V_MAX; v += 25) {
            out += `<line class="grid-line" x1="${GRAPH.x0}" y1="${gy(v).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(v).toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(gy(v) + 3).toFixed(1)}" text-anchor="end">${v}</text>`;
        }
        for (let L = 0; L <= 100; L += 25) {
            out += `<text class="axis-text" x="${gx(L).toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${L}</text>`;
        }
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-title" x="${(GRAPH.x0 + GRAPH.x1) / 2}" y="${GRAPH.y0 + 30}" text-anchor="middle">빛의 세기</text>`;
        out += `<text class="axis-title" x="${GRAPH.x0}" y="${GRAPH.y1 - 6}">광합성량 (기포/분)</text>`;

        // Three CO₂ levels at the current temperature: they lie on top of one
        // another while light is scarce, then split where CO₂ takes over.
        const tags = [[25, '#4a7fd6'], [50, '#0284c7'], [100, '#a8ecff']].map(([c, col]) => {
            const pts = [];
            for (let L = 0; L <= 100; L += 1) pts.push(`${gx(L).toFixed(1)},${gy(analyse(L, c, temp()).rate).toFixed(1)}`);
            const isCurrent = Math.abs(c - co2()) < 3;
            out += `<path class="trace${isCurrent ? '' : ' dim'}" style="stroke:${col}" d="M${pts.join('L')}"/>`;
            return { c, col, isCurrent, y: gy(analyse(100, c, temp()).rate) - 6 };
        });
        /* When the temperature caps every curve at the same rate the three
           curves finish at one height and their tags print on top of each
           other. Fan them apart, keeping their order, then slide the whole set
           back inside the plot if the fanning pushed it past the floor. */
        const GAP = 14;
        tags.sort((p, q) => p.y - q.y);
        for (let i = 1; i < tags.length; i += 1) {
            if (tags[i].y - tags[i - 1].y < GAP) tags[i].y = tags[i - 1].y + GAP;
        }
        // Slide the whole fanned block to fit, rather than clamping each tag —
        // clamping individually would pile them back onto one line at the top.
        const lo = GRAPH.y1 + 10, hi = GRAPH.y0 - 2;
        let shift = 0;
        if (tags[0].y < lo) shift = lo - tags[0].y;
        if (tags[tags.length - 1].y + shift > hi) shift = hi - tags[tags.length - 1].y;
        tags.forEach(t => {
            out += `<text class="curve-tag" fill="${t.col}" opacity="${t.isCurrent ? 1 : .55}" ` +
                   `x="${GRAPH.x1 - 4}" y="${(t.y + shift).toFixed(1)}" text-anchor="end">CO₂ ${t.c}</text>`;
        });
        // where the current setting stops being light-limited
        const knee = Math.min(analyse().byCO2, V_MAX) / K_LIGHT;
        if (knee <= 100) {
            out += `<line class="knee-line" x1="${gx(knee).toFixed(1)}" y1="${GRAPH.y1}" x2="${gx(knee).toFixed(1)}" y2="${GRAPH.y0}"/>`;
            const flip = gx(knee) > (GRAPH.x0 + GRAPH.x1) / 2;
            out += `<text class="knee-text" x="${(gx(knee) + (flip ? -5 : 5)).toFixed(1)}" y="${GRAPH.y1 + 10}"${flip ? ' text-anchor="end"' : ''}>여기부터 빛이 남습니다</text>`;
        }
        out += `<circle class="trace-dot" cx="${gx(light()).toFixed(1)}" cy="${gy(a.rate).toFixed(1)}" r="5" fill="#d97706"/>`;
        graphGroup.innerHTML = out;
    }

    function render() {
        const a = renderMain();
        renderGraph(a);
        lightOutput.textContent = String(light());
        co2Output.textContent = String(co2());
        tempOutput.textContent = `${temp()} ℃`;
        stageBadge.textContent = `${a.rate.toFixed(0)} 개/분 · ${LIMIT_NAME[a.limiter]}`;
        dataNote.innerHTML =
            `<div class="data-row"><span class="data-name">각 조건의 한계</span><span class="data-val">빛 ${Math.min(V_MAX, a.byLight).toFixed(0)} · CO₂ ${Math.min(V_MAX, a.byCO2).toFixed(0)} → 더 작은 쪽인 ${iga(a.cap.toFixed(0))} 상한</span></div>` +
            `<div class="data-row"><span class="data-name">온도 보정</span><span class="data-val">${temp()} ℃ 에서 효율 ${(a.fT * 100).toFixed(0)}% (가장 좋은 온도 ${T_OPT} ℃)</span></div>` +
            `<div class="data-row match"><span class="data-name">광합성량</span><span class="data-val">${a.cap.toFixed(0)} × ${(a.fT * 100).toFixed(0)}% = ${a.rate.toFixed(0)} 개/분</span></div>`;
        return a;
    }

    const clearResult = () => { resultEmpty.hidden = false; resultContent.hidden = true; };

    function check() {
        const a = analyse();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        valueA.textContent = `${a.rate.toFixed(0)} 개/분`;
        valueB.textContent = LIMIT_NAME[a.limiter];
        predictionResult.textContent = !prediction
            ? '다음에는 결과를 먼저 예상해 보세요.'
            : prediction === a.limiter ? '예상이 맞았습니다.'
            : a.limiter === 'none' ? '지금은 어느 것도 부족하지 않아 최대입니다.' : '예상과 다른 결과입니다.';
        let s = `빛은 ${Math.min(V_MAX, a.byLight).toFixed(0)}, 이산화탄소는 ${Math.min(V_MAX, a.byCO2).toFixed(0)} 만큼을 낼 수 있어 더 작은 ${a.cap.toFixed(0)}이 상한이 됩니다. `;
        s += `여기에 ${temp()} ℃ 의 효소 효율 ${(a.fT * 100).toFixed(0)}%를 곱해 ${a.rate.toFixed(0)} 개/분이 나옵니다. `;
        if (a.limiter === 'light') s += `지금은 빛이 제한 요인이라, 이산화탄소를 늘려도 거의 변하지 않습니다. 빛을 세게 해야 늘어납니다.`;
        else if (a.limiter === 'co2') s += `지금은 이산화탄소가 제한 요인이라, 빛을 더 세게 해도 늘지 않습니다. 이산화탄소를 늘려야 합니다.`;
        else if (a.limiter === 'temp') s += `지금은 온도가 제한 요인입니다. ${temp() > T_OPT ? '너무 높아 효소가 제 기능을 못 합니다.' : '너무 낮아 효소가 느리게 작동합니다.'}`;
        else s += `세 조건이 모두 넉넉해 광합성량이 최대에 이르렀습니다.`;
        explanation.textContent = s;
    }

    [lightRange, co2Range, tempRange].forEach(el => el.addEventListener('input', () => {
        render(); if (!resultContent.hidden) check();
    }));
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    checkBtn.addEventListener('click', check);
    resetBtn.addEventListener('click', () => {
        lightRange.value = '60'; co2Range.value = '50'; tempRange.value = '30';
        clearResult();
        stageCaption.textContent = '조건을 하나씩 바꾸며 기포 수가 어떻게 달라지는지 보세요.';
        render();
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

    window.__photoModel = {
        V_MAX, K_LIGHT, K_CO2, T_OPT, analyse, tempFactor,
        setLight(v) { lightRange.value = String(v); lightRange.dispatchEvent(new Event('input')); },
        setCO2(v) { co2Range.value = String(v); co2Range.dispatchEvent(new Event('input')); },
        setTemp(v) { tempRange.value = String(v); tempRange.dispatchEvent(new Event('input')); },
        light, co2, temp, render,
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
