document.addEventListener('DOMContentLoaded', () => {
    const modeButtons = [...document.querySelectorAll('[data-mode]')];
    const fluidButtons = [...document.querySelectorAll('[data-fluid]')];
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const buoyControls = document.getElementById('buoyControls');
    const gasControls = document.getElementById('gasControls');
    const massRange = document.getElementById('massRange');
    const volRange = document.getElementById('volRange');
    const gasVolRange = document.getElementById('gasVolRange');
    const massOutput = document.getElementById('massOutput');
    const volOutput = document.getElementById('volOutput');
    const gasVolOutput = document.getElementById('gasVolOutput');
    const checkBtn = document.getElementById('checkBtn');
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

    const FLUIDS = {
        water: { name: '물',     rho: 1.00, fill: 'rgba(110,200,235,.30)' },
        brine: { name: '소금물', rho: 1.20, fill: 'rgba(150,215,240,.34)' },
        oil:   { name: '식용유', rho: 0.92, fill: 'rgba(232,208,122,.30)' },
    };
    const G = 9.8;
    const P0 = 100, V0 = 50;          // kPa at mL, the reference state

    /* 숫자 뒤 조사는 그 수를 읽은 끝소리를 따릅니다. 영 일 이 삼 사 오 육 칠 팔 구 —
       1.00은 '영'으로 끝나 받침이 있어 '과', 0.92는 '이'로 끝나 '와'입니다. */
    const DIGIT_JONG = { '0': 21, '1': 8, '2': 0, '3': 16, '4': 0, '5': 0, '6': 1, '7': 8, '8': 8, '9': 0 };
    const wa = n => `${n}${DIGIT_JONG[String(n).replace(/[^0-9]/g, '').slice(-1)] > 0 ? '과' : '와'}`;
    const TANK = { x0: 110, x1: 330, surface: 88, bottom: 228 };
    const GRAPH = { x0: 54, x1: 428, y0: 142, y1: 20 };

    let mode = 'buoy';
    let fluid = 'water';
    let prediction = null;

    const mass = () => Number(massRange.value);
    const vol = () => Number(volRange.value);
    const gasVol = () => Number(gasVolRange.value);

    // Density decides everything here. A floating body sinks until the liquid
    // it pushes aside weighs as much as the body does, which makes the
    // submerged fraction exactly the ratio of the two densities.
    function buoyancy() {
        const rhoObj = mass() / vol();
        const rhoFl = FLUIDS[fluid].rho;
        // Three outcomes, not two. When the densities match exactly the body is
        // neutrally buoyant: fully submerged, yet held up entirely by buoyancy
        // with nothing left for the floor to push against, so it hovers rather
        // than resting on the bottom.
        const EPS = 1e-9;
        const state = rhoObj < rhoFl - EPS ? 'float'
                    : rhoObj > rhoFl + EPS ? 'sink' : 'neutral';
        const floats = state === 'float';
        const frac = floats ? rhoObj / rhoFl : 1;
        const vSub = vol() * frac;
        // ρ in g/cm³ is 1000 kg/m³ and V in cm³ is 1e-6 m³, so ρ·V·g in these
        // units comes out in newtons with a factor of 9.8e-3.
        const buoyN = rhoFl * vSub * G * 1e-3;
        const weightN = mass() * G * 1e-3;
        return { rhoObj, rhoFl, state, floats, frac, vSub, buoyN, weightN,
            normalN: state === 'sink' ? Math.max(0, weightN - buoyN) : 0 };
    }

    // Boyle's law at constant temperature: the same particles in a smaller
    // space collide with the walls more often, so P V stays constant.
    const pressureOf = v => (P0 * V0) / v;

    // Fixed normalised particle spots, so shrinking the gas space genuinely
    // crowds the same particles instead of removing any.
    const PARTICLES = (() => {
        let seed = 11;
        const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
        return Array.from({ length: 22 }, () => ({ u: rnd(), v: rnd(), r: 2 + rnd() * 1.4 }));
    })();

    const gx = (v, lo, hi) => GRAPH.x0 + ((v - lo) / (hi - lo)) * (GRAPH.x1 - GRAPH.x0);
    const gy = (v, max) => GRAPH.y0 - (v / max) * (GRAPH.y0 - GRAPH.y1);

    function renderBuoy() {
        const b = buoyancy();
        const f = FLUIDS[fluid];
        const side = 12 * Math.cbrt(vol());
        const cx = (TANK.x0 + TANK.x1) / 2;
        // floating: broken by the surface; neutral: hovering mid-liquid;
        // sinking: resting on the floor
        const topY = b.state === 'float' ? TANK.surface - side * (1 - b.frac)
                   : b.state === 'neutral' ? (TANK.surface + TANK.bottom) / 2 - side / 2
                   : TANK.bottom - side;

        let out = '';
        out += `<rect class="liquid" x="${TANK.x0 + 2}" y="${TANK.surface}" width="${TANK.x1 - TANK.x0 - 4}" height="${TANK.bottom - TANK.surface}" fill="${f.fill}"/>`;
        out += `<ellipse class="liquid-surface" cx="${cx}" cy="${TANK.surface}" rx="${(TANK.x1 - TANK.x0 - 4) / 2}" ry="4"/>`;
        out += `<path class="tank" fill="none" d="M${TANK.x0},52 L${TANK.x0},${TANK.bottom} L${TANK.x1},${TANK.bottom} L${TANK.x1},52"/>`;
        out += `<rect class="block" x="${(cx - side / 2).toFixed(1)}" y="${topY.toFixed(1)}" width="${side.toFixed(1)}" height="${side.toFixed(1)}" rx="3" fill="#d97706"/>`;
        out += `<text class="block-label" x="${cx}" y="${(topY + side / 2 + 4).toFixed(1)}" text-anchor="middle">${b.rhoObj.toFixed(2)}</text>`;
        out += `<text class="zone-label" x="${TANK.x0}" y="44">${f.name} (밀도 ${f.rho.toFixed(2)})</text>`;
        out += `<text class="zone-label" x="${TANK.x1 + 6}" y="${TANK.surface + 4}">수면</text>`;

        // force arrows, drawn to scale against the largest weight in range
        const scale = 62 / (240 * G * 1e-3);
        const ax = 392, base = 150;
        const upLen = b.buoyN * scale, dnLen = b.weightN * scale;
        out += `<line class="force-arrow force-up" x1="${ax}" y1="${base}" x2="${ax}" y2="${(base - upLen).toFixed(1)}"/>`;
        out += `<path class="force-arrow force-up" d="M${ax - 5},${(base - upLen + 7).toFixed(1)} L${ax},${(base - upLen).toFixed(1)} L${ax + 5},${(base - upLen + 7).toFixed(1)}" fill="none"/>`;
        // With small forces both arrows are short and the two labels land on top
        // of each other, so each is held clear of the mid-line.
        const upTextY = Math.min(base - upLen + 4, base - 6);
        const dnTextY = Math.max(base + dnLen + 4, base + 18);
        out += `<text class="force-text" fill="#059669" x="${ax + 9}" y="${upTextY.toFixed(1)}">부력 ${b.buoyN.toFixed(2)} N</text>`;
        out += `<line class="force-arrow force-down" x1="${ax}" y1="${base}" x2="${ax}" y2="${(base + dnLen).toFixed(1)}"/>`;
        out += `<path class="force-arrow force-down" d="M${ax - 5},${(base + dnLen - 7).toFixed(1)} L${ax},${(base + dnLen).toFixed(1)} L${ax + 5},${(base + dnLen - 7).toFixed(1)}" fill="none"/>`;
        out += `<text class="force-text" fill="#ff8a8a" x="${ax + 9}" y="${dnTextY.toFixed(1)}">무게 ${b.weightN.toFixed(2)} N</text>`;
        if (b.state === 'sink' && b.normalN > 0) {
            out += `<text class="force-text" fill="#c79bff" x="${ax - 84}" y="${base + 34}">바닥이 ${b.normalN.toFixed(2)} N 받침</text>`;
        } else if (b.state === 'neutral') {
            out += `<text class="force-text" fill="#059669" x="${ax - 84}" y="${base + 34}">부력 = 무게 (중성 부력)</text>`;
        }
        mainGroup.innerHTML = out;

        graphGroup.innerHTML = '<text x="20" y="50" fill="#334155" font-size="16">물체와 액체의 밀도를 비교하세요.</text><text x="20" y="90" fill="#334155" font-size="16">물체의 밀도가 더 작으면 뜹니다.</text>';
        dataNote.innerHTML = '<p>질량 ' + mass() + ' g ÷ 부피 ' + vol() + ' cm³ = 밀도 ' + b.rhoObj.toFixed(3) + ' g/cm³</p><p>액체의 밀도: ' + b.rhoFl.toFixed(2) + ' g/cm³</p>';
        stageBadge.textContent = `${f.name} · ${b.state === 'float' ? '뜸' : b.state === 'neutral' ? '중성 부력' : '가라앉음'}`;
        massOutput.textContent = `${mass()} g`;
        volOutput.textContent = `${vol()} cm³`;
    }

    function renderGas() {
        const v = gasVol(), p = pressureOf(v);
        const BX0 = 176, BX1 = 260, BTOP = 44, BBOT = 232;
        const PX_PER_ML = (BBOT - BTOP - 16) / V0;
        const gasH = v * PX_PER_ML;
        const gasTop = BBOT - gasH;

        let out = '';
        out += `<rect class="gas-space" x="${BX0 + 3}" y="${gasTop.toFixed(1)}" width="${BX1 - BX0 - 6}" height="${gasH.toFixed(1)}"/>`;
        PARTICLES.forEach(pt => {
            const x = BX0 + 8 + pt.u * (BX1 - BX0 - 16);
            const y = gasTop + 5 + pt.v * Math.max(2, gasH - 10);
            out += `<circle class="gas-particle" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${pt.r.toFixed(1)}"/>`;
        });
        out += `<rect class="plunger" x="${BX0 - 4}" y="${(gasTop - 14).toFixed(1)}" width="${BX1 - BX0 + 8}" height="14" rx="3"/>`;
        out += `<rect class="plunger" x="${(BX0 + BX1) / 2 - 5}" y="${Math.max(10, gasTop - 46).toFixed(1)}" width="10" height="${Math.max(2, gasTop - 14 - Math.max(10, gasTop - 46)).toFixed(1)}" rx="3"/>`;
        out += `<path class="syringe-body" fill="none" d="M${BX0},${BTOP} L${BX0},${BBOT} L${BX1},${BBOT} L${BX1},${BTOP}"/>`;
        out += `<text class="zone-label" x="${BX1 + 12}" y="${(gasTop + gasH / 2).toFixed(1)}">기체 ${v} mL</text>`;
        out += `<text class="pressure-text" x="${BX1 + 12}" y="${(gasTop + gasH / 2 + 20).toFixed(1)}">${v < V0 ? "기준보다 높은 압력" : "기준 압력"}</text>`;
        out += `<text class="axis-text" x="${(BX0 + BX1) / 2}" y="252" text-anchor="middle">입자 수는 그대로, 공간만 좁아집니다</text>`;
        mainGroup.innerHTML = out;

        graphGroup.innerHTML = '<text x="20" y="50" fill="#334155" font-size="16">온도와 기체의 양을 일정하게 합니다.</text><text x="20" y="90" fill="#334155" font-size="16">부피 감소 → 압력 증가</text><text x="20" y="130" fill="#334155" font-size="16">부피 증가 → 압력 감소</text>';
        dataNote.innerHTML = '<p>부피: ' + v + ' mL</p><p>입자 수는 그대로입니다. 부피를 줄이면 벽과의 충돌이 잦아집니다.</p>';
        stageBadge.textContent = v + ' mL · ' + (v < V0 ? '기준보다 높은 압력' : '기준 압력');
        gasVolOutput.textContent = `${v} mL`;
    }

    const render = () => (mode === 'buoy' ? renderBuoy() : renderGas());
    const clearResult = () => { resultEmpty.hidden = false; resultContent.hidden = true; };

    function check() {
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        if (mode === 'buoy') {
            const b = buoyancy();
            const f = FLUIDS[fluid];
            labelA.textContent = '물체의 밀도';
            labelB.textContent = '결과';
            valueA.textContent = `${b.rhoObj.toFixed(2)} g/cm³`;
            valueB.textContent = b.state === 'float' ? '뜸'
                : b.state === 'neutral' ? '액체 속에 떠 있음' : '가라앉음';
            if (b.state === 'neutral') {
                predictionResult.textContent = '두 밀도가 같아 뜨지도 가라앉지도 않습니다.';
            } else {
                predictionResult.textContent = !prediction
                    ? '다음에는 결과를 먼저 예상해 보세요.'
                    : prediction === b.state ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
            }
            explanation.textContent = b.state === 'float' ? '물체의 밀도가 액체보다 작아 뜹니다.' : b.state === 'neutral' ? '물체와 액체의 밀도가 같아 액체 속에 머무릅니다.' : '물체의 밀도가 액체보다 커서 가라앉습니다.';
        } else {
            const v = gasVol(), p = pressureOf(v);
            labelA.textContent = '기체의 압력';
            labelB.textContent = '기체의 양';
            valueA.textContent = v < V0 ? "기준보다 높음" : "기준과 같음";
            valueB.textContent = "일정";
            predictionResult.textContent = '부피를 줄이면 압력이 커집니다.';
            explanation.textContent = "온도와 기체의 양이 일정할 때, 부피를 줄이면 입자가 벽에 더 자주 충돌하므로 압력이 커집니다.";
        }
    }

    modeButtons.forEach(button => button.addEventListener('click', () => {
        mode = button.dataset.mode;
        modeButtons.forEach(item => item.classList.toggle('selected', item === button));
        buoyControls.hidden = mode !== 'buoy';
        gasControls.hidden = mode !== 'gas';
        stageCaption.textContent = mode === 'buoy'
            ? '밀도를 바꾸며 뜨는지 가라앉는지 관찰해 보세요.'
            : '부피를 줄이며 압력이 어떻게 변하는지 관찰해 보세요.';
        render(); clearResult();
    }));
    fluidButtons.forEach(button => button.addEventListener('click', () => {
        fluid = button.dataset.fluid;
        fluidButtons.forEach(item => item.classList.toggle('selected', item === button));
        render(); clearResult();
    }));
    [massRange, volRange, gasVolRange].forEach(el => el.addEventListener('input', () => { render(); clearResult(); }));
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    checkBtn.addEventListener('click', check);

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

    window.__buoyModel = {
        FLUIDS, G, P0, V0, TANK, buoyancy, pressureOf, PARTICLES,
        setMode(m) { document.querySelector(`[data-mode="${m}"]`).click(); },
        setFluid(f) { document.querySelector(`[data-fluid="${f}"]`).click(); },
        set(m, v) { if (m !== undefined) massRange.value = String(m); if (v !== undefined) volRange.value = String(v); render(); },
        setGas(v) { gasVolRange.value = String(v); render(); },
        mass, vol, gasVol, render,
    };

    render();
    clearResult();
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
