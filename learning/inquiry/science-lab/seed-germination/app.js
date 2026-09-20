document.addEventListener('DOMContentLoaded', () => {
    const conditionButtons = [...document.querySelectorAll('[data-cond]')];
    const graphGroup = document.getElementById('graphGroup');
    const dataNote = document.getElementById('dataNote');
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const growButton = document.getElementById('growBtn');
    const resetButton = document.getElementById('resetBtn');
    const resultEmpty = document.getElementById('resultEmpty');
    const resultContent = document.getElementById('resultContent');
    const resultGerm = document.getElementById('resultGerm');
    const resultStage = document.getElementById('resultStage');
    const predictionResult = document.getElementById('predictionResult');
    const explanation = document.getElementById('elementaryExplanation');
    const stageCaption = document.getElementById('stageCaption');
    const dayBadge = document.getElementById('dayBadge');
    const plantGroup = document.getElementById('plantGroup');
    const labelGroup = document.getElementById('labelGroup');
    const sunGroup = document.getElementById('sunGroup');
    const sunBeams = document.getElementById('sunBeams');
    const airZone = document.querySelector('.air-zone');

    const COND_LABELS = {
        water: { on: '준다', off: '주지 않음', name: '물' },
        warm:  { on: '따뜻함', off: '차가움', name: '알맞은 온도' },
        air:   { on: '통한다', off: '막힘', name: '공기' },
        light: { on: '비춘다', off: '어두움', name: '빛' },
    };

    const SOIL_Y = 190;
    const SEED = { x: 210, y: 232 };
    const GROW_SECONDS = 9;         // display seconds for a full run
    const TOTAL_DAYS = 10;

    let conditions = { water: true, warm: true, air: true, light: true };
    let prediction = null;
    let progress = 0;
    let growing = false;
    let rafId = null, lastT = null;

    // Germination needs water, a suitable temperature and air. Light is
    // deliberately excluded: seeds sprout in the dark, and treating light as
    // required is the misconception this experiment exists to correct.
    const germinates = () => conditions.water && conditions.warm && conditions.air;
    const missingConditions = () =>
        ['water', 'warm', 'air'].filter(k => !conditions[k]).map(k => COND_LABELS[k].name);

    const clamp01 = v => Math.max(0, Math.min(1, v));

    // Korean particles depend on whether the preceding syllable ends in a
    // consonant: 물이/공기가, 물과/공기와. The condition names are assembled
    // into sentences at runtime, so these can't be written inline.
    function hasBatchim(word) {
        const code = word.charCodeAt(word.length - 1);
        if (code < 0xac00 || code > 0xd7a3) return false;
        return (code - 0xac00) % 28 !== 0;
    }
    const subjectParticle = w => (hasBatchim(w) ? '이' : '가');
    // Joins a list the way Korean does: 물과 공기, 물과 알맞은 온도와 공기.
    function joinAnd(words) {
        return words.reduce((acc, w, i) =>
            i === 0 ? w : `${acc}${hasBatchim(words[i - 1]) ? '과' : '와'} ${w}`, '');
    }

    function stageName(p) {
        if (p < 0.02) return '씨 그대로';
        if (p < 0.2) return '물을 빨아들임';
        if (p < 0.45) return '뿌리가 남';
        if (p < 0.75) return '떡잎이 남';
        return '본잎이 남';
    }

    function buildBeams() {
        let out = '';
        for (let i = 0; i < 6; i += 1) {
            const a = (200 + i * 22) * Math.PI / 180;
            const x1 = 356 + 27 * Math.cos(a), y1 = 46 + 27 * Math.sin(a);
            const x2 = 356 + 38 * Math.cos(a), y2 = 46 + 38 * Math.sin(a);
            out += `<line class="sun-beam" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
        }
        sunBeams.innerHTML = out;
    }

    function renderPlant() {
        const p = progress;
        // Without light the seedling still sprouts but grows pale and leggy —
        // real etiolation, not a penalty invented for the simulation.
        const lit = conditions.light;
        const stemMax = lit ? 96 : 130;
        const leafFill = lit ? '#5fb85f' : '#d9d99a';
        const stemStroke = lit ? '#4f9e52' : '#cfd292';

        const swell = 1 + 0.35 * clamp01(p / 0.2);
        const rootLen = clamp01((p - 0.2) / 0.25) * 62;
        const stemLen = clamp01((p - 0.4) / 0.35) * stemMax;
        const cot = clamp01((p - 0.45) / 0.2);
        const trueLeaf = clamp01((p - 0.75) / 0.25);

        let out = '';
        // seed
        out += `<ellipse class="seed-body" cx="${SEED.x}" cy="${SEED.y}" rx="${(13 * swell).toFixed(1)}" ry="${(10 * swell).toFixed(1)}"/>`;
        // root, downward into the soil
        if (rootLen > 0.5) {
            const ry = SEED.y + 10 + rootLen;
            out += `<path class="root" d="M${SEED.x},${SEED.y + 10} C${SEED.x - 5},${SEED.y + 10 + rootLen * .4} ${SEED.x + 6},${SEED.y + 10 + rootLen * .7} ${SEED.x - 3},${ry.toFixed(1)}"/>`;
            if (rootLen > 26) {
                out += `<path class="root" d="M${SEED.x - 1},${SEED.y + 34} l-14,${(rootLen * .3).toFixed(1)}"/>`;
                out += `<path class="root" d="M${SEED.x + 1},${SEED.y + 40} l13,${(rootLen * .26).toFixed(1)}"/>`;
            }
        }
        // stem, upward through the soil surface
        if (stemLen > 0.5) {
            const topY = SEED.y - 10 - stemLen;
            out += `<path class="stem" style="stroke:${stemStroke}" d="M${SEED.x},${SEED.y - 8} L${SEED.x},${topY.toFixed(1)}"/>`;
            if (cot > 0.02) {
                const w = 26 * cot, h = 12 * cot;
                out += `<ellipse class="leaf" style="fill:${leafFill}" cx="${SEED.x - w * .7}" cy="${topY.toFixed(1)}" rx="${w.toFixed(1)}" ry="${h.toFixed(1)}"/>`;
                out += `<ellipse class="leaf" style="fill:${leafFill}" cx="${SEED.x + w * .7}" cy="${topY.toFixed(1)}" rx="${w.toFixed(1)}" ry="${h.toFixed(1)}"/>`;
            }
            if (trueLeaf > 0.02) {
                const w = 22 * trueLeaf, h = 11 * trueLeaf;
                const ly = topY - 20 * trueLeaf;
                out += `<path class="stem" style="stroke:${stemStroke}" d="M${SEED.x},${topY.toFixed(1)} L${SEED.x},${ly.toFixed(1)}"/>`;
                out += `<ellipse class="leaf" style="fill:${leafFill}" cx="${SEED.x - w * .8}" cy="${ly.toFixed(1)}" rx="${w.toFixed(1)}" ry="${h.toFixed(1)}" transform="rotate(-18 ${SEED.x - w * .8} ${ly.toFixed(1)})"/>`;
                out += `<ellipse class="leaf" style="fill:${leafFill}" cx="${SEED.x + w * .8}" cy="${ly.toFixed(1)}" rx="${w.toFixed(1)}" ry="${h.toFixed(1)}" transform="rotate(18 ${SEED.x + w * .8} ${ly.toFixed(1)})"/>`;
            }
        }
        plantGroup.innerHTML = out;

        // Part names appear only once there is a part to point at.
        let labels = '';
        if (p >= 0.8) {
            const topY = SEED.y - 10 - stemLen - 20 * trueLeaf;
            labels += `<line class="part-line" x1="${SEED.x + 34}" y1="${topY.toFixed(1)}" x2="${SEED.x + 62}" y2="${topY.toFixed(1)}"/>`;
            labels += `<text class="part-label" x="${SEED.x + 66}" y="${(topY + 4).toFixed(1)}">잎</text>`;
            const midY = SEED.y - 10 - stemLen * .5;
            labels += `<line class="part-line" x1="${SEED.x + 8}" y1="${midY.toFixed(1)}" x2="${SEED.x + 62}" y2="${midY.toFixed(1)}"/>`;
            labels += `<text class="part-label" x="${SEED.x + 66}" y="${(midY + 4).toFixed(1)}">줄기</text>`;
            const rootY = SEED.y + 10 + rootLen * .7;
            labels += `<line class="part-line" x1="${SEED.x + 6}" y1="${rootY.toFixed(1)}" x2="${SEED.x + 62}" y2="${rootY.toFixed(1)}"/>`;
            labels += `<text class="part-label" x="${SEED.x + 66}" y="${(rootY + 4).toFixed(1)}">뿌리</text>`;
        }
        labelGroup.innerHTML = labels;
    }

    function renderEnvironment() {
        sunGroup.classList.toggle('dark', !conditions.light);
        airZone.classList.toggle('no-air', !conditions.air);
        conditionButtons.forEach(btn => {
            const key = btn.dataset.cond;
            const on = conditions[key];
            btn.classList.toggle('on', on);
            btn.classList.toggle('off', !on);
            btn.querySelector('.cond-state').textContent = on ? COND_LABELS[key].on : COND_LABELS[key].off;
        });
        dayBadge.textContent = `${Math.round(progress * TOTAL_DAYS)}일째`;
    }

    function render() { renderEnvironment(); renderPlant(); renderCompare(); renderData(); }

    /* ------------------------------- 조건을 하나씩 뺐을 때를 견주는 표 */
    /* 대조 실험의 결과를 한자리에 모아 놓은 것입니다. 물·온도·공기 가운데
       하나만 빠져도 싹이 트지 않지만, 빛은 빠져도 싹이 틉니다 — 그 한 줄이
       이 실험에서 가장 놀라운 대목이라 따로 표시합니다. */
    const CASES = [
        { key: null,    name: '모두 갖춤' },
        { key: 'water', name: '물만 빼면' },
        { key: 'warm',  name: '온도만 낮추면' },
    ];
    const wouldGerminate = key => {
        const c = { water: true, warm: true, air: true, light: true };
        if (key) c[key] = false;
        return c.water && c.warm && c.air;
    };
    // which row matches what is set right now
    function currentCase() {
        const off = ['water', 'warm'].filter(k => !conditions[k]);
        if (off.length === 0) return null;
        return off.length === 1 ? off[0] : 'other';
    }

    function renderCompare() {
        const now = currentCase();
        const X0 = 20, W = 420, TOP = 30, H = 26, GAP = 3;
        let out = `<text class="cmp-title" x="${X0}" y="18">조건을 하나씩 빼 보면</text>`;
        CASES.forEach((c, i) => {
            const y = TOP + i * (H + GAP);
            const isNow = (c.key === null && now === null) || (c.key !== null && c.key === now);
            out += `<rect class="cmp-row${isNow ? ' now' : ''}" x="${X0}" y="${y}" width="${W}" height="${H}" rx="7"/>`;
            out += `<text class="cmp-label" x="${X0 + 12}" y="${y + 17}">${c.name}</text>`;
            const ok = wouldGerminate(c.key);
            out += `<text class="${ok ? 'cmp-yes' : 'cmp-no'}" x="${X0 + 150}" y="${y + 17}">${ok ? '싹이 틉니다' : '싹이 트지 않습니다'}</text>`;
            if (c.key === 'light') {
                out += `<text class="cmp-surprise" x="${X0 + W - 12}" y="${y + 17}" text-anchor="end">빛은 없어도 싹은 틉니다</text>`;
            } else if (c.key === null) {
                out += `<text class="cmp-note" x="${X0 + W - 12}" y="${y + 17}" text-anchor="end">기준</text>`;
            }
        });
        out += `<text class="cmp-note" x="${X0}" y="${TOP + CASES.length * (H + GAP) + 14}">한 번에 한 가지만 바꾸고 나머지는 똑같이 두어야 무엇 때문인지 알 수 있습니다.</text>`;
        graphGroup.innerHTML = out;
    }

    function renderData() {
        const need = ['water', 'warm'];
        const missing = need.filter(k => !conditions[k]).map(k => COND_LABELS[k].name);
        const days = (progress * TOTAL_DAYS).toFixed(1);
        dataNote.innerHTML =
            ['water', 'warm'].map(k =>
                `<div class="data-row"><span class="data-name">${COND_LABELS[k].name}</span>` +
                `<span class="data-val">${conditions[k] ? COND_LABELS[k].on : COND_LABELS[k].off}</span></div>`).join('') +
            `<div class="data-row"><span class="data-name">싹트는 데 필요한 것</span><span class="data-val">물 · 알맞은 온도 (나머지 조건은 같게 둠)</span></div>` +
            `<div class="data-row${germinates() ? ' match' : ''}"><span class="data-name">지금 모자란 것</span>` +
            `<span class="data-val">${missing.length ? missing.join(' · ') : '없음 — 세 가지가 다 갖추어졌습니다'}</span></div>` +
            `<div class="data-row"><span class="data-name">지난 날수</span><span class="data-val">${germinates() ? `${days}일째 · ${stageName(progress)}` : '변화 없음'}</span></div>`;
    }

    function frame(now) {
        const t = now / 1000;
        const dt = lastT === null ? 1 / 60 : Math.min(1 / 20, t - lastT);
        lastT = t;
        if (growing && germinates() && progress < 1) {
            progress = Math.min(1, progress + dt / GROW_SECONDS);
        }
        render();
        updateLiveResult();
        if (growing && germinates() && progress < 1) { rafId = requestAnimationFrame(frame); }
        else { rafId = null; lastT = null; growing = false; growButton.textContent = '며칠 두고 관찰하기'; }
    }

    function updateLiveResult() {
        if (resultContent.hidden) return;
        resultGerm.textContent = germinates() ? (progress > 0.02 ? '싹틈' : '싹트는 중') : '싹트지 않음';
        resultStage.textContent = germinates() ? stageName(progress) : '변화 없음';
    }

    function startGrowing() {
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        const ok = germinates();
        const missing = missingConditions();

        predictionResult.textContent = !prediction
            ? '다음에는 결과를 먼저 예상해 보세요.'
            : (prediction === 'yes') === ok ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';

        if (!ok) {
            const joined = joinAnd(missing);
            const last = missing[missing.length - 1];
            stageCaption.textContent = `${joined}${subjectParticle(last)} 없어서 씨가 싹트지 않았습니다.`;
            explanation.textContent = `이 실험은 다른 조건을 같게 두고 물과 온도를 비교합니다. 지금은 ${joined}${subjectParticle(last)} 없습니다.`;
            updateLiveResult();
            render();
            return;
        }

        growing = true;
        growButton.textContent = '자라는 중…';
        stageCaption.textContent = conditions.light
            ? '물과 알맞은 온도가 갖추어져 씨가 싹트고 있습니다.'
            : '빛이 없어도 씨는 싹틉니다. 다만 잎이 초록색이 되지 못합니다.';
        explanation.textContent = conditions.light
            ? '물과 알맞은 온도가 갖추어진 조건에서 씨가 싹텄습니다. 뿌리와 싹, 잎이 나타나는 모습을 순서대로 관찰합니다.'
            : '빛은 싹트는 데 필요한 조건이 아니므로 씨는 싹텄습니다. 다만 빛을 못 받아 잎이 노랗고 줄기만 가늘고 길게 자랍니다.';
        if (rafId === null) { lastT = null; rafId = requestAnimationFrame(frame); }
    }

    function resetAll() {
        growing = false;
        progress = 0;
        if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; lastT = null; }
        growButton.textContent = '며칠 두고 관찰하기';
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        stageCaption.textContent = '조건을 정하고 관찰을 시작해 보세요.';
        render();
    }

    conditionButtons.forEach(button => button.addEventListener('click', () => {
        conditions[button.dataset.cond] = !conditions[button.dataset.cond];
        resetAll();
    }));
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    growButton.addEventListener('click', () => { if (!growing) startGrowing(); });
    resetButton.addEventListener('click', resetAll);

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

    window.__seedModel = {
        germinates, missingConditions, stageName,
        setConditions(c) { conditions = { ...conditions, ...c }; resetAll(); },
        conditions: () => ({ ...conditions }),
        setProgress(p) { progress = clamp01(p); render(); updateLiveResult(); },
        progress: () => progress,
        SOIL_Y, SEED,
    };

    buildBeams();
    resetAll();
});
