document.addEventListener('DOMContentLoaded', () => {
    const temperatureRange = document.getElementById('temperatureRange');
    const graphGroup = document.getElementById('graphGroup');
    const dataNote = document.getElementById('dataNote');
    const amountRange = document.getElementById('amountRange');
    const temperatureOutput = document.getElementById('temperatureOutput');
    const amountOutput = document.getElementById('amountOutput');
    const amountMinLabel = document.getElementById('amountMinLabel');
    const amountMaxLabel = document.getElementById('amountMaxLabel');
    const amountGuide = document.getElementById('amountGuide');
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const runButton = document.getElementById('runExperimentBtn');
    const resultEmpty = document.getElementById('resultEmpty');
    const resultContent = document.getElementById('resultContent');
    const dissolvedValue = document.getElementById('dissolvedValue');
    const remainingValue = document.getElementById('remainingValue');
    const predictionResult = document.getElementById('predictionResult');
    const explanation = document.getElementById('elementaryExplanation');
    const stageCaption = document.getElementById('stageCaption');
    const solubilityBadge = document.getElementById('solubilityBadge');
    const beaker = document.getElementById('beaker');
    const waterStopTop = document.getElementById('waterStopTop');
    const waterStopBottom = document.getElementById('waterStopBottom');
    const sedimentGroup = document.getElementById('sedimentGroup');
    const dissolvingGroup = document.getElementById('dissolvingGroup');
    const mercuryRect = document.getElementById('mercuryRect');
    const saltDose = document.getElementById('saltDose');
    const saltCrystalGroup = document.getElementById('saltCrystalGroup');
    const saltDoseValue = document.getElementById('saltDoseValue');

    const points = [[0, 35.7], [20, 36], [40, 36.5], [60, 37.3], [80, 38.4], [100, 39.8]];
    let prediction = null;

    function createCrystalPool(count, bounds) {
        const pool = [];
        for (let i = 0; i < count; i += 1) {
            const level = Math.random();
            const y = bounds.yFloor - level * bounds.height;
            const spread = bounds.width * (1 - level * .55);
            const x = bounds.xCenter + (Math.random() - .5) * spread;
            pool.push({ x, y, size: 2 + Math.random() * 1.6, rot: Math.random() * 40 - 20 });
        }
        return pool.sort((a, b) => b.y - a.y);
    }

    function renderCrystals(group, pool, fraction, sizeScale = 1) {
        const count = Math.round(pool.length * Math.max(0, Math.min(1, fraction)));
        group.innerHTML = pool.slice(0, count).map(c => {
            const half = c.size * sizeScale;
            return `<rect x="${(c.x - half).toFixed(1)}" y="${(c.y - half).toFixed(1)}" width="${(half * 2).toFixed(1)}" height="${(half * 2).toFixed(1)}" rx="0.6" fill="#f3ecd6" stroke="#c9bb92" stroke-width="0.5" transform="rotate(${c.rot.toFixed(1)} ${c.x.toFixed(1)} ${c.y.toFixed(1)})"></rect>`;
        }).join('');
    }

    const cupCrystalPool = createCrystalPool(60, { xCenter: 50, width: 42, yFloor: 108, height: 20 });
    const sedimentCrystalPool = createCrystalPool(70, { xCenter: 120, width: 176, yFloor: 296, height: 46 });

    let dissolveTimers = [];

    function clearDissolveTimers() {
        dissolveTimers.forEach(id => clearTimeout(id));
        dissolveTimers = [];
    }

    function makeCrystalGroup(c) {
        const half = c.size;
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', (-half).toFixed(1));
        rect.setAttribute('y', (-half).toFixed(1));
        rect.setAttribute('width', (half * 2).toFixed(1));
        rect.setAttribute('height', (half * 2).toFixed(1));
        rect.setAttribute('rx', '0.6');
        rect.setAttribute('fill', '#f3ecd6');
        rect.setAttribute('stroke', '#c9bb92');
        rect.setAttribute('stroke-width', '0.5');
        g.appendChild(rect);
        g.style.transformBox = 'fill-box';
        g.style.transformOrigin = 'center';
        g.style.transform = `translate(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px) rotate(${c.rot.toFixed(1)}deg) scale(1)`;
        return g;
    }

    function animateDissolve(dissolved, remaining) {
        clearDissolveTimers();
        dissolvingGroup.innerHTML = '';
        sedimentGroup.innerHTML = '';

        beaker.classList.remove('mixed', 'stirring');
        void beaker.offsetWidth;
        beaker.classList.add('mixed', 'stirring');

        // Salt is denser than water, so everything poured in settles into the
        // bottom pile first. Dissolving crystals then shrink away in place
        // (surface erosion) instead of teleporting or fading like a ghost;
        // undissolved excess only shrinks a little (some surface loss before
        // the solution saturates) and stays put.
        const finalSedimentFraction = remaining > 0 ? Math.max(.12, Math.min(1, remaining / 6)) : 0;
        const totalCount = Math.min(sedimentCrystalPool.length, Math.max(1, Math.round(dissolved + remaining)));
        // remainCount matches the *final* settled pile 1:1 (same fraction,
        // same pool) so the animation hands off to it with no visible jump.
        const remainCount = Math.min(totalCount, Math.round(sedimentCrystalPool.length * finalSedimentFraction));
        const pile = sedimentCrystalPool.slice(0, totalCount);

        pile.forEach((c, i) => {
            const isKeep = i < remainCount;
            const g = makeCrystalGroup(c);
            dissolvingGroup.appendChild(g);

            const startDelay = isKeep ? Math.random() * .3 : Math.random() * .9;
            const duration = isKeep ? .5 : .8 + Math.random() * .4;
            const endScale = isKeep ? .8 : 0;
            const startMs = 30 + startDelay * 1000;

            dissolveTimers.push(setTimeout(() => {
                g.style.transition = `transform ${duration}s ease-in`;
                g.style.transform = `translate(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px) rotate(${c.rot.toFixed(1)}deg) scale(${endScale})`;
            }, startMs));
        });

        dissolveTimers.push(setTimeout(() => {
            beaker.classList.remove('stirring');
            dissolvingGroup.innerHTML = '';
            renderCrystals(sedimentGroup, sedimentCrystalPool, finalSedimentFraction);
        }, 2300));
    }

    function solubilityAt(temperature) {
        return points.find(([pointTemperature]) => pointTemperature === temperature)[1];
    }

    function grams(value) {
        return Number(value).toLocaleString('ko-KR', { maximumFractionDigits: 1 });
    }

    function setAmountRange(resetValue = true) {
        const maximum = solubilityAt(Number(temperatureRange.value));
        const minimum = Math.floor(maximum - 3);
        const upper = Math.ceil(maximum + 3);
        amountRange.min = String(minimum);
        amountRange.max = String(upper);
        if (resetValue) amountRange.value = String(Math.min(upper, Math.round(maximum + 1)));
        amountMinLabel.textContent = `${grams(minimum)} g`;
        amountMaxLabel.textContent = `${grams(upper)} g`;
        amountGuide.textContent = `${temperatureRange.value}℃에서 녹는 양의 근처만 조절합니다.`;
        solubilityBadge.textContent = `최대로 녹는 양 ${grams(maximum)} g`;
        renderCurve();
        renderData();
    }

    /* ------------------------------------------- 용해도 곡선과 측정값 표 */
    /* 곡선은 위의 points 표를 그대로 씁니다. 0℃에서 35.7 g, 100℃에서 39.8 g —
       온도를 100도나 올려도 4.1 g밖에 더 녹지 않는다는 것이 이 실험에서
       보여 주려는 사실입니다. */
    const G = { x0: 52, x1: 424, y0: 140, y1: 26 };
    const S_LO = 30, S_HI = 44;
    const gx = t => G.x0 + (t / 100) * (G.x1 - G.x0);
    const gy = g => G.y0 - ((g - S_LO) / (S_HI - S_LO)) * (G.y0 - G.y1);

    function renderCurve() {
        const temperature = Number(temperatureRange.value);
        const amount = Number(amountRange.value);
        const maximum = solubilityAt(temperature);
        let out = '';
        for (let g = S_LO; g <= S_HI; g += 2) {
            const y = gy(g);
            out += `<line class="grid-line" x1="${G.x0}" y1="${y.toFixed(1)}" x2="${G.x1}" y2="${y.toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${G.x0 - 6}" y="${(y + 3).toFixed(1)}" text-anchor="end">${g}</text>`;
        }
        for (const t of [0, 20, 40, 60, 80, 100]) {
            out += `<text class="axis-text" x="${gx(t).toFixed(1)}" y="${G.y0 + 15}" text-anchor="middle">${t}</text>`;
        }
        out += `<line class="axis" x1="${G.x0}" y1="${G.y0}" x2="${G.x1}" y2="${G.y0}"/>`;
        out += `<line class="axis" x1="${G.x0}" y1="${G.y0}" x2="${G.x0}" y2="${G.y1}"/>`;
        out += `<text class="axis-title" x="${(G.x0 + G.x1) / 2}" y="${G.y0 + 32}" text-anchor="middle">물의 온도 (℃)</text>`;
        out += `<text class="axis-title" x="${G.x0}" y="${G.y1 - 8}">물 100 g에 녹는 소금 (g)</text>`;

        out += `<path class="sol-curve" d="M${points.map(([t, g]) => `${gx(t).toFixed(1)},${gy(g).toFixed(1)}`).join('L')}"/>`;
        points.forEach(([t, g]) => {
            out += `<circle class="sol-dot" cx="${gx(t).toFixed(1)}" cy="${gy(g).toFixed(1)}" r="3"/>`;
        });

        // how much was put in, so the gap to the curve is the leftover
        const putY = gy(Math.min(S_HI, Math.max(S_LO, amount)));
        out += `<line class="put-line" x1="${G.x0}" y1="${putY.toFixed(1)}" x2="${G.x1}" y2="${putY.toFixed(1)}"/>`;
        out += `<text class="put-text" x="${G.x1 - 4}" y="${(putY - 5).toFixed(1)}" text-anchor="end">넣은 소금 ${grams(amount)} g</text>`;

        const px = gx(temperature), py = gy(maximum);
        out += `<line class="op-guide" x1="${px.toFixed(1)}" y1="${G.y0}" x2="${px.toFixed(1)}" y2="${py.toFixed(1)}"/>`;
        out += `<circle class="op-point" cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="5"/>`;
        const flip = px > (G.x0 + G.x1) / 2;
        out += `<text class="op-text" x="${(px + (flip ? -9 : 9)).toFixed(1)}" y="${Math.min(G.y0 - 4, py + 16).toFixed(1)}"` +
               `${flip ? ' text-anchor="end"' : ''}>${temperature}℃에서 ${grams(maximum)} g까지</text>`;
        graphGroup.innerHTML = out;
    }

    function renderData() {
        const temperature = Number(temperatureRange.value);
        const amount = Number(amountRange.value);
        const maximum = solubilityAt(temperature);
        const dissolved = Math.min(amount, maximum);
        const remaining = Math.max(0, amount - maximum);
        const cold = points[0][1], hot = points[points.length - 1][1];
        dataNote.innerHTML =
            `<div class="data-row"><span class="data-name">물의 양</span><span class="data-val">100 g</span></div>` +
            `<div class="data-row"><span class="data-name">물의 온도</span><span class="data-val">${temperature}℃</span></div>` +
            `<div class="data-row"><span class="data-name">이 온도에서 녹는 양</span><span class="data-val">${grams(maximum)} g</span></div>` +
            `<div class="data-row"><span class="data-name">넣은 소금</span><span class="data-val">${grams(amount)} g</span></div>` +
            `<div class="data-row${remaining < .05 ? ' match' : ''}"><span class="data-name">녹은 소금</span><span class="data-val">${grams(dissolved)} g</span></div>` +
            `<div class="data-row"><span class="data-name">바닥에 남는 소금</span><span class="data-val">${remaining < .05 ? '없음' : `${grams(amount)} − ${grams(maximum)} = ${grams(remaining)} g`}</span></div>` +
            `<div class="data-row"><span class="data-name">0℃와 100℃ 차이</span><span class="data-val">${grams(cold)} g → ${grams(hot)} g, ${grams(hot - cold)} g만 더 녹습니다</span></div>`;
    }

    function clearResult() {
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        clearDissolveTimers();
        beaker.classList.remove('mixed', 'stirring');
        saltDose.classList.remove('poured');
        sedimentGroup.innerHTML = '';
        dissolvingGroup.innerHTML = '';
        stageCaption.textContent = '온도와 소금의 양을 정하세요.';
    }

    function syncControls(resetAmount = false) {
        if (resetAmount) setAmountRange(true);
        temperatureOutput.textContent = `${temperatureRange.value}℃`;
        amountOutput.textContent = `${grams(amountRange.value)} g`;
        saltDoseValue.textContent = `${grams(amountRange.value)} g`;
        // Scaled against the realistic max amount (~43g, just above the
        // highest solubility point), not the slider's own narrow ±3g window
        // — otherwise 33g (already close to saturation) would render as a
        // near-empty pinch instead of the substantial amount it really is.
        const cupFraction = Math.max(.5, Math.min(1, Number(amountRange.value) / 43));
        renderCrystals(saltCrystalGroup, cupCrystalPool, cupFraction, .85 + .3 * cupFraction);
        const temperature = Number(temperatureRange.value);
        const mercuryHeight = 4 + (temperature / 100) * 164;
        mercuryRect.setAttribute('y', String(180 - mercuryHeight));
        mercuryRect.setAttribute('height', String(mercuryHeight));
        renderCurve();
        renderData();
        const warmth = temperature / 100;
        waterStopTop.setAttribute('stop-color', `rgb(${Math.round(110 + 70 * warmth)}, ${Math.round(200 - 15 * warmth)}, ${Math.round(235 - 25 * warmth)})`);
        waterStopBottom.setAttribute('stop-color', `rgb(${Math.round(60 + 50 * warmth)}, ${Math.round(150 - 15 * warmth)}, ${Math.round(195 - 35 * warmth)})`);
    }

    function runExperiment() {
        const temperature = Number(temperatureRange.value);
        const amount = Number(amountRange.value);
        const maximum = solubilityAt(temperature);
        const dissolved = Math.min(amount, maximum);
        const remaining = Math.max(0, amount - maximum);
        const actual = remaining < .05 ? 'all' : 'some';

        document.getElementById('massBefore').textContent = `${grams(100 + amount)} g`;
        document.getElementById('massAfter').textContent = `${grams(100 + amount)} g`;
        saltDose.classList.add('poured');
        animateDissolve(dissolved, remaining);
        dissolvedValue.textContent = `${grams(dissolved)} g`;
        remainingValue.textContent = `${grams(remaining)} g`;
        resultEmpty.hidden = true;
        resultContent.hidden = false;

        predictionResult.textContent = !prediction
            ? '다음에는 결과를 먼저 예상해 보세요.'
            : prediction === actual ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        if (actual === 'all') {
            stageCaption.textContent = `${temperature}℃의 물 100 g에 소금 ${grams(amount)} g이 모두 녹았습니다.`;
            explanation.textContent = `소금이 녹아 눈에 보이는 소금 결정은 없습니다. 소금이 없어진 것은 아닙니다. 흘리거나 증발하지 않으면 물과 소금을 합한 무게는 녹이기 전후 모두 ${grams(100 + amount)} g입니다.`;
        } else {
            stageCaption.textContent = `${temperature}℃에서 ${grams(maximum)} g까지 녹고 ${grams(remaining)} g이 바닥에 남았습니다.`;
            explanation.textContent = `이 온도에서 녹을 수 있는 양을 넘은 소금은 바닥에 남습니다. 남은 소금까지 포함한 전체 무게는 넣기 전후 모두 ${grams(100 + amount)} g입니다.`;
        }
    }

    temperatureRange.addEventListener('input', () => { syncControls(true); clearResult(); });
    amountRange.addEventListener('input', () => { syncControls(); clearResult(); });
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction;
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    runButton.addEventListener('click', runExperiment);

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

    setAmountRange(true);
    syncControls();
    clearResult();
});
