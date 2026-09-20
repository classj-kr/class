document.addEventListener('DOMContentLoaded', () => {
    const mixButtons = [...document.querySelectorAll('[data-mix]')];
    const graphGroup = document.getElementById('graphGroup');
    const dataNote = document.getElementById('dataNote');
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const fossilBtn = document.getElementById('fossilBtn');
    const pourBtn = document.getElementById('pourBtn');
    const resetBtn = document.getElementById('resetBtn');
    const resultEmpty = document.getElementById('resultEmpty');
    const resultContent = document.getElementById('resultContent');
    const resultCount = document.getElementById('resultCount');
    const resultOldest = document.getElementById('resultOldest');
    const predictionResult = document.getElementById('predictionResult');
    const explanation = document.getElementById('elementaryExplanation');
    const stageCaption = document.getElementById('stageCaption');
    const stageBadge = document.getElementById('stageBadge');
    const layerGroup = document.getElementById('layerGroup');
    const fallGroup = document.getElementById('fallGroup');
    const rulerGroup = document.getElementById('rulerGroup');
    const speedNote = document.getElementById('speedNote');

    // Grain diameters in mm. Stokes' law makes settling speed go as d², so
    // these three sizes fix the order in which they reach the bottom — the
    // sorting inside every layer is a consequence of this, not a choice.
    const GRAINS = [
        { id: 'gravel', name: '자갈', mm: 4,    color: '#a8896a' },
        { id: 'sand',   name: '모래', mm: 1,    color: '#d6bd88' },
        { id: 'mud',    name: '진흙', mm: 0.25, color: '#8f8570' },
    ];
    const REF_MM = 1;                                   // sand is the reference
    const settlingSpeed = mm => (mm / REF_MM) ** 2;     // v ∝ d²

    const MIXES = {
        gravel: { label: '자갈이 많은 흙', gravel: .50, sand: .35, mud: .15 },
        sand:   { label: '모래가 많은 흙', gravel: .15, sand: .60, mud: .25 },
        mud:    { label: '진흙이 많은 흙', gravel: .05, sand: .25, mud: .70 },
    };

    const TANK = { x: 62, w: 336, bottom: 282, top: 42 };
    const LAYER_H = 34;
    const MAX_LAYERS = 6;
    // Display durations are compressed: the true speed spread is 256:1 between
    // gravel and mud, which no watchable animation can show literally. The
    // order is exact and the real ratios are printed under the tank.
    const FALL_MS = { gravel: 700, sand: 1500, mud: 2600 };

    let layers = [];
    let mix = 'gravel';
    let withFossil = false;
    let prediction = null;

    function buildRuler() {
        let out = '';
        for (let i = 1; i <= MAX_LAYERS; i += 1) {
            const y = TANK.bottom - i * LAYER_H;
            out += `<line class="ruler-line" x1="${TANK.x}" y1="${y}" x2="${TANK.x + TANK.w}" y2="${y}"/>`;
        }
        rulerGroup.innerHTML = out;
    }

    // Sub-layer geometry for one pour: grains stack in settling order, the
    // fastest (largest) at the bottom.
    function sublayersFor(mixKey) {
        const m = MIXES[mixKey];
        return GRAINS.map(g => ({ id: g.id, name: g.name, color: g.color, h: LAYER_H * m[g.id] }));
    }

    function renderLayers() {
        let out = '';
        layers.forEach((layer, i) => {
            let cursor = TANK.bottom - i * LAYER_H;      // bottom edge of this layer
            layer.sub.forEach(s => {
                out += `<rect class="sub-layer" x="${TANK.x}" y="${(cursor - s.h).toFixed(2)}" width="${TANK.w}" height="${s.h.toFixed(2)}" fill="${s.color}"/>`;
                cursor -= s.h;
            });
            const topY = TANK.bottom - (i + 1) * LAYER_H;
            if (i > 0) out += `<line class="layer-divider" x1="${TANK.x}" y1="${(TANK.bottom - i * LAYER_H).toFixed(2)}" x2="${TANK.x + TANK.w}" y2="${(TANK.bottom - i * LAYER_H).toFixed(2)}"/>`;
            if (layer.fossil) {
                const fx = TANK.x + 96 + ((i * 71) % 150);
                const fy = topY + LAYER_H * 0.55;
                out += `<path class="fossil" transform="translate(${fx} ${fy.toFixed(1)})" d="M0,0 q-11,-9 -11,0 q0,9 11,9 q11,0 11,-9 q0,-9 -11,0 Z"/>`;
            }
            const midY = topY + LAYER_H / 2 + 4;
            out += `<text class="layer-tag" x="${TANK.x + TANK.w + 8}" y="${midY.toFixed(1)}">${i + 1}번</text>`;
            out += `<text class="layer-age" x="${TANK.x + TANK.w + 8}" y="${(midY + 12).toFixed(1)}">${i === 0 ? '가장 오래됨' : i === layers.length - 1 ? '가장 최근' : ''}</text>`;
        });
        layerGroup.innerHTML = out;
    }

    function renderSpeeds() {
        const rows = GRAINS.map(g => {
            const v = settlingSpeed(g.mm);
            // log scale, because the real spread is far too wide for a linear bar
            const pct = Math.max(4, Math.min(100, ((Math.log2(v) + 5) / 9) * 100));
            const label = v >= 1 ? `${v % 1 === 0 ? v : v.toFixed(2)}배` : `1/${Math.round(1 / v)}배`;
            return `<div class="speed-row"><span class="speed-name">${g.name} ${g.mm} mm</span>` +
                   `<span class="speed-track"><span class="speed-fill" style="width:${pct.toFixed(1)}%;background:${g.color}"></span></span>` +
                   `<span class="speed-value">${label}</span></div>`;
        }).join('');
        speedNote.innerHTML = rows +
            `<p class="speed-caption">가라앉는 빠르기는 알갱이 지름의 제곱에 비례합니다(모래를 1배로 본 값). 화면의 떨어지는 속도는 보기 좋게 줄여 표현했습니다.</p>`;
    }

    function pourAnimation(sub) {
        // one burst of grains per type, arriving in size order
        let out = '';
        GRAINS.forEach(g => {
            const part = sub.find(s => s.id === g.id);
            if (!part || part.h < 0.5) return;
            const count = Math.max(2, Math.round(part.h / 3));
            const landY = TANK.bottom - layers.length * LAYER_H;
            for (let i = 0; i < count; i += 1) {
                const x = TANK.x + 16 + ((i * 53 + g.mm * 17) % (TANK.w - 32));
                const r = g.id === 'gravel' ? 4 : g.id === 'sand' ? 2.4 : 1.5;
                const dur = FALL_MS[g.id] / 1000;
                const delay = ((i % 5) * 0.06).toFixed(2);
                out += `<circle class="falling" cx="${x.toFixed(1)}" cy="${TANK.top + 6}" r="${r}" fill="${g.color}">` +
                       `<animate attributeName="cy" from="${TANK.top + 6}" to="${landY.toFixed(1)}" dur="${dur}s" begin="${delay}s" fill="freeze"/>` +
                       `<animate attributeName="opacity" values="1;1;0" keyTimes="0;0.85;1" dur="${dur}s" begin="${delay}s" fill="freeze"/></circle>`;
            }
        });
        fallGroup.innerHTML = out;
        setTimeout(() => { fallGroup.innerHTML = ''; }, 3200);
    }

    function updateResult() {
        const n = layers.length;
        resultCount.textContent = `${n}개`;
        resultOldest.textContent = n ? '1번 (맨 아래)' : '-';
        stageBadge.textContent = n ? `${n}개 층` : '빈 통';
        pourBtn.disabled = n >= MAX_LAYERS;
        pourBtn.textContent = n >= MAX_LAYERS ? '통이 가득 찼습니다' : '퇴적물 붓기';
        renderOrder();
        renderData();
    }

    /* ------------------------------------------- 쌓인 순서 = 시간 순서 */
    /* 지층에서 읽어 내는 것은 결국 순서입니다. 통을 세로로 그린 그림 옆에,
       같은 층을 '언제 쌓였나'로 다시 늘어놓아 아래가 오래된 것임을 글자로도
       읽히게 합니다. */
    function renderOrder() {
        const X0 = 18, W = 424, TOP = 30, H = 24, GAP = 3;
        const n = layers.length;
        let out = `<text class="ord-title" x="${X0}" y="18">쌓인 순서 — 아래가 먼저입니다</text>`;
        if (!n) {
            out += `<text class="ord-empty" x="${X0}" y="${TOP + 22}">아직 부은 것이 없습니다. 퇴적물을 부으면 층이 하나씩 늘어납니다.</text>`;
            graphGroup.innerHTML = out;
            return;
        }
        // newest at the top of the list, matching how the tank looks
        for (let i = n - 1; i >= 0; i -= 1) {
            const row = n - 1 - i;
            const y = TOP + row * (H + GAP);
            const L = layers[i];
            const newest = i === n - 1;
            out += `<rect class="ord-row${newest ? ' newest' : ''}" x="${X0}" y="${y}" width="${W}" height="${H}" rx="7"/>`;
            out += `<text class="ord-num" x="${X0 + 12}" y="${y + 16}">${i + 1}번 층</text>`;
            // the grain bands inside this layer, biggest at the bottom
            L.sub.forEach((g, k) => {
                out += `<rect class="ord-swatch" x="${X0 + 66 + k * 16}" y="${y + 7}" width="14" height="10" rx="2" fill="${g.color}"/>`;
            });
            out += `<text class="ord-name" x="${X0 + 122}" y="${y + 16}">${MIXES[L.mix].label}${L.fossil ? ' · 화석 있음' : ''}</text>`;
            out += `<text class="ord-when" x="${X0 + W - 12}" y="${y + 16}" text-anchor="end">${newest ? '가장 나중에 쌓임' : i === 0 ? '가장 먼저 쌓임' : `${i + 1}번째로 쌓임`}</text>`;
        }
        out += `<text class="ord-note" x="${X0}" y="${TOP + n * (H + GAP) + 15}">한 번 부을 때마다 큰 알갱이가 먼저 가라앉아, 한 층 안에서도 자갈이 아래·진흙이 위에 놓입니다.</text>`;
        graphGroup.innerHTML = out;
    }

    function renderData() {
        const n = layers.length;
        if (!n) {
            dataNote.innerHTML =
                `<div class="data-row"><span class="data-name">쌓인 층</span><span class="data-val">아직 없음</span></div>` +
                `<div class="data-row"><span class="data-name">알갱이 크기</span><span class="data-val">${GRAINS.map(g => `${g.name} ${g.mm} mm`).join(' · ')}</span></div>`;
            return;
        }
        const withFossilCount = layers.filter(L => L.fossil).length;
        dataNote.innerHTML =
            `<div class="data-row"><span class="data-name">쌓인 층</span><span class="data-val">${n}개</span></div>` +
            `<div class="data-row match"><span class="data-name">가장 오래된 층</span><span class="data-val">1번 — 맨 아래</span></div>` +
            `<div class="data-row"><span class="data-name">가장 새로운 층</span><span class="data-val">${n}번 — 맨 위</span></div>` +
            `<div class="data-row"><span class="data-name">맨 아래 층의 퇴적물</span><span class="data-val">${MIXES[layers[0].mix].label}</span></div>` +
            `<div class="data-row"><span class="data-name">알갱이 크기</span><span class="data-val">${GRAINS.map(g => `${g.name} ${g.mm} mm`).join(' · ')}</span></div>` +
            `<div class="data-row"><span class="data-name">화석이 든 층</span><span class="data-val">${withFossilCount ? layers.map((L, i) => L.fossil ? `${i + 1}번` : null).filter(Boolean).join(' · ') : '없음'}</span></div>`;
    }

    function pour() {
        if (layers.length >= MAX_LAYERS) return;
        const sub = sublayersFor(mix);
        pourAnimation(sub);
        layers.push({ mix, fossil: withFossil, sub });
        renderLayers();
        updateResult();

        resultEmpty.hidden = true;
        resultContent.hidden = false;
        predictionResult.textContent = !prediction
            ? '다음에는 결과를 먼저 예상해 보세요.'
            : prediction === 'bottom' ? '예상이 맞았습니다.' : '예상과 다른 결과입니다. 맨 아래층이 가장 먼저 쌓인 층입니다.';

        const m = MIXES[mix];
        stageCaption.textContent = `${m.label}을 부어 ${layers.length}번째 층이 쌓였습니다.`;
        explanation.textContent =
            `한 번 부을 때에도 큰 알갱이가 먼저 가라앉아 자갈이 아래, 진흙이 위에 놓입니다. ` +
            `여러 번 부으면 나중에 부은 것이 위에 쌓이므로, 맨 아래층인 1번이 가장 오래된 층입니다.` +
            (withFossil ? ' 이 층에는 화석이 함께 묻혔습니다.' : '');
    }

    mixButtons.forEach(button => button.addEventListener('click', () => {
        mix = button.dataset.mix;
        mixButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    fossilBtn.addEventListener('click', () => {
        withFossil = !withFossil;
        fossilBtn.classList.toggle('active', withFossil);
        fossilBtn.textContent = withFossil ? '화석 넣지 않기' : '화석 함께 넣기';
    });
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    pourBtn.addEventListener('click', pour);
    resetBtn.addEventListener('click', () => {
        layers = [];
        fallGroup.innerHTML = '';
        renderLayers();
        updateResult();
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        stageCaption.textContent = '퇴적물을 부어 층이 쌓이는 순서를 살펴보세요.';
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

    window.__layerModel = {
        GRAINS, MIXES, TANK, LAYER_H, MAX_LAYERS, settlingSpeed, sublayersFor,
        layers: () => layers.map(l => ({ ...l })),
        setMix(k) { document.querySelector(`[data-mix="${k}"]`).click(); },
        setFossil(v) { if (withFossil !== v) fossilBtn.click(); },
        pour, reset: () => resetBtn.click(),
    };

    buildRuler();
    renderSpeeds();
    resetBtn.click();
});
