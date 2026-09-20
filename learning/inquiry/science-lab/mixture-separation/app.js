document.addEventListener('DOMContentLoaded', () => {
    const magnetBtn = document.getElementById('magnetBtn');
    const waterBtn = document.getElementById('waterBtn');
    const sieveBtn = document.getElementById('sieveBtn');
    const meshRange = document.getElementById('meshRange');
    const graphGroup = document.getElementById('graphGroup');
    const meshOutput = document.getElementById('meshOutput');
    const resetBtn = document.getElementById('resetBtn');
    const resultEmpty = document.getElementById('resultEmpty');
    const resultContent = document.getElementById('resultContent');
    const resultLeft = document.getElementById('resultLeft');
    const resultDone = document.getElementById('resultDone');
    const explanation = document.getElementById('elementaryExplanation');
    const stageCaption = document.getElementById('stageCaption');
    const stageBadge = document.getElementById('stageBadge');
    const mixtureGroup = document.getElementById('mixtureGroup');
    const trayGroup = document.getElementById('trayGroup');
    const waterGroup = document.getElementById('waterGroup');
    const toolGroup = document.getElementById('toolGroup');
    const propertyTable = document.getElementById('propertyTable');

    // Real grain sizes in mm and densities in g/cm³. The sieve decision uses
    // these numbers, not the drawn radii — the drawing has to compress a 27x
    // size range to stay visible, and the page says so.
    const SUBSTANCES = [
        { id: 'iron', name: '철가루',      mm: 0.3, density: 7.9,  magnetic: true,  soluble: false, color: '#8a8f98' },
        { id: 'salt', name: '소금',        mm: 0.4, density: 2.2,  magnetic: false, soluble: true,  color: '#eef2f5' },
        { id: 'sand', name: '모래',        mm: 0.5, density: 2.6,  magnetic: false, soluble: false, color: '#c8a97a' },
        { id: 'foam', name: '스타이로폼',  mm: 6,   density: 0.05, magnetic: false, soluble: false, color: '#f2f4f6' },
        { id: 'bean', name: '콩',          mm: 8,   density: 1.3,  magnetic: false, soluble: false, color: '#d5b25e' },
    ];
    const GRAINS_PER = { iron: 7, salt: 7, sand: 7, foam: 3, bean: 3 };

    // 체 구멍은 실제 알갱이 크기(0.3 · 0.4 · 0.5 · 6 · 8 mm) 사이사이에 눈금을
    // 두어야 뜻이 있다. 예전에는 1 mm부터 시작해 가루 셋이 언제나 한꺼번에
    // 빠져나갔고, 그래서 구멍을 바꿔도 결과가 같았다.
    const MESH_STOPS = [0.2, 0.35, 0.45, 0.6, 1, 2, 4, 7, 9];
    const meshMm = () => MESH_STOPS[Number(meshRange.value)];

    const BOWL = { x0: 44, x1: 192, yTop: 96, yBottom: 222 };
    const TRAY = { x: 244, w: 200, yTop: 40, h: 52, gap: 8 };

    let separated = [];     // [{id, method}] in the order they came out
    let grains = [];        // one entry per drawn grain

    // Korean particles agree with the final consonant of the preceding word:
    // 철가루가/콩이, 모래를/콩을, 소금은/모래는. Substance names are assembled
    // into sentences at runtime, so these can't be written inline. For a
    // comma-joined list the particle follows the last item.
    function hasBatchim(phrase) {
        const w = phrase.trim();
        const code = w.charCodeAt(w.length - 1);
        if (code < 0xac00 || code > 0xd7a3) return false;
        return (code - 0xac00) % 28 !== 0;
    }
    const subjectP = w => (hasBatchim(w) ? '이' : '가');   // 이/가
    const objectP  = w => (hasBatchim(w) ? '을' : '를');   // 을/를
    const topicP   = w => (hasBatchim(w) ? '은' : '는');   // 은/는

    const remaining = () => SUBSTANCES.filter(s => !separated.some(v => s.id === v.id));
    const isSeparated = id => separated.some(v => v.id === id);
    const drawRadius = mm => 2.5 + 2.6 * Math.sqrt(mm);

    function buildGrains() {
        grains = [];
        SUBSTANCES.forEach(s => {
            for (let i = 0; i < GRAINS_PER[s.id]; i += 1) {
                grains.push({ sub: s.id, key: `${s.id}-${i}`, i });
            }
        });
        // Deterministic scatter so a reset reproduces the same picture.
        let seed = 7;
        const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
        grains.forEach(g => {
            const s = SUBSTANCES.find(x => x.id === g.sub);
            const r = drawRadius(s.mm);
            g.homeX = BOWL.x0 + r + rnd() * (BOWL.x1 - BOWL.x0 - 2 * r);
            g.homeY = BOWL.yTop + r + rnd() * (BOWL.yBottom - BOWL.yTop - 2 * r);
        });
        mixtureGroup.innerHTML = grains.map(g => {
            const s = SUBSTANCES.find(x => x.id === g.sub);
            return `<circle class="grain" id="g-${g.key}" cx="${g.homeX.toFixed(1)}" cy="${g.homeY.toFixed(1)}" r="${drawRadius(s.mm).toFixed(1)}" fill="${s.color}" stroke="rgba(0,0,0,.28)" stroke-width="0.8"/>`;
        }).join('');
    }


    /* --------------------------------------------- 도구가 하는 일을 보여 준다 */
    /* 세 도구가 결과만 같은 방식으로 내놓으면 무엇을 한 것인지 알 수 없다.
       자석은 끌어당기고, 물은 차오르며 녹이거나 띄우고, 체는 흔들어 내려
       보낸다. 각 동작이 끝난 뒤에야 물질이 그릇에서 접시로 옮겨 간다. */
    const SLOW = !window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let acting = false;

    const grainEls = id => grains.filter(g => g.sub === id).map(g => document.getElementById(`g-${g.key}`));
    const setShift = (el, dx, dy, extra = '') => {
        el.setAttribute('transform', `translate(${dx.toFixed(1)} ${dy.toFixed(1)})`);
        if (extra) el.setAttribute('style', extra);
    };

    function setBusy(on) {
        [magnetBtn, waterBtn, sieveBtn].forEach(b => { b.disabled = on || remaining().length === 0; });
    }

    function clearApparatus() {
        waterGroup.innerHTML = '';
        toolGroup.innerHTML = '';
        grains.forEach(g => {
            const el = document.getElementById(`g-${g.key}`);
            if (el) el.removeAttribute('style');
        });
    }

    const MID_X = (BOWL.x0 + BOWL.x1) / 2;

    function drawMagnet(y) {
        const w = 54, arm = 22;
        return `<g class="magnet" transform="translate(${(MID_X - w / 2).toFixed(1)} ${y.toFixed(1)})">` +
               `<path d="M0,0 L0,${arm} A${w / 2},${w / 2} 0 0 0 ${w},${arm} L${w},0 L${w - 15},0 L${w - 15},${arm}` +
               ` A${w / 2 - 15},${w / 2 - 15} 0 0 1 15,${arm} L15,0 Z" fill="#94a3b8" stroke="#475569" stroke-width="1.4"/>` +
               `<rect x="0" y="0" width="15" height="10" fill="#dc2626"/>` +
               `<rect x="${w - 15}" y="0" width="15" height="10" fill="#0284c7"/></g>`;
    }

    function drawSieve(y, mesh) {
        // 구멍 간격은 실제 구멍 크기를 눈으로 견줄 수 있게 로그로 줄여 그린다.
        const gap = 4 + 9 * (Math.log(mesh / 0.2) / Math.log(9 / 0.2));
        let bars = '';
        for (let x = BOWL.x0 + 4; x < BOWL.x1 - 4; x += gap) {
            bars += `<line x1="${x.toFixed(1)}" y1="${y - 3}" x2="${x.toFixed(1)}" y2="${y + 3}" stroke="#64748b" stroke-width="1.6"/>`;
        }
        return `<g class="sieve" transform="translate(0 ${y.toFixed(1)})">` +
               `<g transform="translate(0 ${-y.toFixed(1)})">${bars}</g>` +
               `<line x1="${BOWL.x0 - 6}" y1="0" x2="${BOWL.x1 + 6}" y2="0" stroke="#334155" stroke-width="3" stroke-linecap="round"/>` +
               `<line x1="${BOWL.x0 - 6}" y1="-14" x2="${BOWL.x0 - 6}" y2="0" stroke="#334155" stroke-width="3" stroke-linecap="round"/>` +
               `<line x1="${BOWL.x1 + 6}" y1="-14" x2="${BOWL.x1 + 6}" y2="0" stroke="#334155" stroke-width="3" stroke-linecap="round"/></g>`;
    }

    const wait = ms => new Promise(r => setTimeout(r, SLOW ? ms : 0));

    async function playMagnet(picked) {
        const hangY = BOWL.yTop - 34;
        toolGroup.innerHTML = drawMagnet(hangY - 40);
        const magnet = toolGroup.firstChild;
        await wait(20);
        magnet.setAttribute('transform', magnet.getAttribute('transform').replace(/ [\d.-]+\)$/, ` ${hangY})`));
        await wait(420);
        // 붙는 알갱이만 자석 쪽으로 튀어 올라 달라붙는다
        picked.forEach(s => grainEls(s.id).forEach((el, i) => {
            const g = grains.find(x => `g-${x.key}` === el.id);
            setShift(el, (MID_X - 20 + (i % 7) * 7) - g.homeX, (hangY + 26) - g.homeY);
        }));
        await wait(520);
        magnet.setAttribute('transform', magnet.getAttribute('transform').replace(/ [\d.-]+\)$/, ` ${hangY - 46})`));
        picked.forEach(s => grainEls(s.id).forEach(el => {
            const t = el.getAttribute('transform').match(/translate\(([\d.-]+) ([\d.-]+)\)/);
            setShift(el, Number(t[1]), Number(t[2]) - 46);
        }));
        await wait(420);
    }

    async function playWater(dissolved, floated) {
        const top = BOWL.yTop - 6, bottom = BOWL.yBottom + 8;
        waterGroup.innerHTML = `<rect class="water" x="${BOWL.x0 - 8}" y="${bottom}" width="${BOWL.x1 - BOWL.x0 + 16}" height="0" rx="4"/>`;
        const water = waterGroup.firstChild;
        await wait(20);
        water.setAttribute('y', String(top));
        water.setAttribute('height', String(bottom - top));
        await wait(560);
        // 녹는 것은 사라지고, 뜨는 것은 물 위로 올라오고, 나머지는 바닥에 가라앉는다
        dissolved.forEach(s => grainEls(s.id).forEach(el => el.setAttribute('style', 'opacity:0;transition:opacity .6s ease')));
        floated.forEach(s => grainEls(s.id).forEach((el, i) => {
            const g = grains.find(x => `g-${x.key}` === el.id);
            setShift(el, (BOWL.x0 + 22 + i * 26) - g.homeX, (top + 10) - g.homeY);
        }));
        remaining().filter(s => !s.soluble && s.density >= 1).forEach(s => grainEls(s.id).forEach((el, i) => {
            const g = grains.find(x => `g-${x.key}` === el.id);
            setShift(el, 0, (BOWL.yBottom - 6) - g.homeY);
        }));
        await wait(700);
    }

    async function playSieve(picked, mesh) {
        const y = BOWL.yBottom - 30;
        toolGroup.innerHTML = drawSieve(y, mesh);
        const sieve = toolGroup.firstChild;
        await wait(20);
        // 흔들기
        for (const dx of [5, -5, 4, -4, 0]) {
            sieve.setAttribute('transform', `translate(${dx} ${y})`);
            await wait(110);
        }
        // 구멍보다 작은 알갱이가 체 아래로 떨어진다
        picked.forEach(s => grainEls(s.id).forEach((el, i) => {
            const g = grains.find(x => `g-${x.key}` === el.id);
            setShift(el, (BOWL.x0 + 14 + (i % 9) * 17) - g.homeX, (y + 20) - g.homeY);
        }));
        await wait(560);
    }

    function trayRect(index) {
        return { x: TRAY.x, y: TRAY.yTop + index * (TRAY.h + TRAY.gap), w: TRAY.w, h: TRAY.h };
    }

    function render() {
        // trays
        trayGroup.innerHTML = separated.map((entry, idx) => {
            const s = SUBSTANCES.find(x => x.id === entry.id);
            const r = trayRect(idx);
            return `<rect class="tray-box" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="8"/>` +
                   `<text class="tray-label" x="${r.x + 10}" y="${r.y + 21}">${s.name}</text>` +
                   `<text class="tray-method" x="${r.x + 10}" y="${r.y + 38}">${entry.method}</text>`;
        }).join('');

        // move each grain to its tray, or leave it in the bowl
        grains.forEach(g => {
            const el = document.getElementById(`g-${g.key}`);
            const idx = separated.findIndex(v => v.id === g.sub);
            if (idx === -1) { el.setAttribute('transform', 'translate(0 0)'); return; }
            const r = trayRect(idx);
            const s = SUBSTANCES.find(x => x.id === g.sub);
            const rad = drawRadius(s.mm);
            const perRow = Math.max(1, Math.floor((r.w - 96) / (rad * 2 + 3)));
            const col = g.i % perRow, row = Math.floor(g.i / perRow);
            const tx = r.x + 92 + rad + col * (rad * 2 + 3);
            const ty = r.y + 18 + row * (rad * 2 + 3);
            el.setAttribute('transform', `translate(${(tx - g.homeX).toFixed(1)} ${(ty - g.homeY).toFixed(1)})`);
        });

        const left = remaining();
        stageBadge.textContent = left.length <= 1 ? '분리 완료' : `${left.length}가지 섞여 있음`;
        resultLeft.textContent = `${left.length}가지`;
        resultDone.textContent = `${separated.length}가지`;

        magnetBtn.disabled = left.length === 0;
        waterBtn.disabled = left.length === 0;
        sieveBtn.disabled = left.length === 0;

        propertyTable.innerHTML =
            `<div class="property-row head"><span>물질</span><span>크기</span><span>자석</span><span>물에서</span></div>` +
            SUBSTANCES.map(s => {
                const done = isSeparated(s.id);
                const water = s.soluble ? '녹음' : s.density < 1 ? '뜸' : '가라앉음';
                return `<div class="property-row${done ? ' separated' : ''}">` +
                       `<span><i class="swatch" style="background:${s.color}"></i>${s.name}</span>` +
                       `<span>${s.mm} mm</span><span>${s.magnetic ? '붙음' : '안 붙음'}</span><span>${water}</span></div>`;
            }).join('');

        renderSizes();
    }

    /* ------------------------------- 알갱이 크기와 체 구멍을 견주는 그림 */
    /* 가장 작은 철가루(0.3 mm)와 가장 큰 콩(8 mm)은 27배 차이라, 곧이곧대로
       그리면 작은 것들이 점이 되어 버립니다. 그래서 가로축을 로그로 잡고 그
       사실을 아래에 적어 둡니다. 체 구멍 선은 슬라이더 값을 그대로 씁니다. */
    const SZ = { x0: 96, x1: 400, top: 34, h: 17, gap: 6 };
    const MM_MIN = 0.2, MM_MAX = 12;
    const sxOf = mm => SZ.x0 + (Math.log(mm / MM_MIN) / Math.log(MM_MAX / MM_MIN)) * (SZ.x1 - SZ.x0);

    function renderSizes() {
        const mesh = meshMm();
        let out = `<text class="size-title" x="20" y="18">알갱이 크기와 체 구멍</text>`;

        SUBSTANCES.forEach((s, i) => {
            const y = SZ.top + i * (SZ.h + SZ.gap);
            const done = isSeparated(s.id);
            out += `<rect class="size-track" x="${SZ.x0}" y="${y}" width="${SZ.x1 - SZ.x0}" height="${SZ.h}" rx="5"/>`;
            out += `<rect class="size-bar" x="${SZ.x0}" y="${y + 3}" width="${(sxOf(s.mm) - SZ.x0).toFixed(1)}" height="${SZ.h - 6}" rx="4" fill="${s.color}" opacity="${done ? .45 : .95}"/>`;
            out += `<text class="size-name" x="${SZ.x0 - 8}" y="${y + 13}" text-anchor="end">${s.name}</text>`;
            out += `<text class="size-mm" x="${(sxOf(s.mm) + 6).toFixed(1)}" y="${y + 13}">${s.mm} mm</text>`;
            if (done) out += `<text class="size-done" x="${SZ.x1 + 6}" y="${y + 13}">분리됨</text>`;
        });

        const bottom = SZ.top + SUBSTANCES.length * (SZ.h + SZ.gap);
        out += `<line class="size-axis" x1="${SZ.x0}" y1="${bottom}" x2="${SZ.x1}" y2="${bottom}"/>`;
        for (const mm of [0.2, 1, 4, 12]) {
            out += `<text class="size-tick" x="${sxOf(mm).toFixed(1)}" y="${bottom + 12}" text-anchor="middle">${mm}</text>`;
        }
        out += `<text class="size-tick" x="${SZ.x1 + 6}" y="${bottom + 12}">mm</text>`;

        // where the sieve cuts: anything to the left of the line falls through
        const mx = sxOf(mesh);
        out += `<line class="mesh-line" x1="${mx.toFixed(1)}" y1="${SZ.top - 8}" x2="${mx.toFixed(1)}" y2="${bottom}"/>`;
        const flip = mx > (SZ.x0 + SZ.x1) / 2;
        out += `<text class="mesh-text" x="${(mx + (flip ? -6 : 6)).toFixed(1)}" y="${SZ.top - 12}"${flip ? ' text-anchor="end"' : ''}>체 구멍 ${mesh} mm</text>`;
        out += `<text class="size-note" x="20" y="${bottom + 28}">왼쪽이 구멍보다 작아 빠져나가고, 오른쪽은 체에 남습니다. 가로 눈금은 27배 차이를 담으려고 촘촘해집니다.</text>`;
        graphGroup.innerHTML = out;
    }

    function showResult(text) {
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        explanation.textContent = text;
    }

    // Each tool splits whatever is still mixed into two groups by one real
    // property. If every remaining substance falls on the same side, nothing
    // has actually been separated — which is itself worth showing.
    async function applyTool(name, predicate, methodLabel, describe, play) {
        const left = remaining();
        if (left.length === 0 || acting) return;
        const picked = left.filter(predicate);
        acting = true;
        setBusy(true);
        clearApparatus();
        if (play) await play(picked);
        if (picked.length === 0 || picked.length === left.length) {
            stageCaption.textContent = describe.none;
            showResult(describe.noneDetail);
            await wait(350);
            clearApparatus();
            render();
            acting = false;
            setBusy(false);
            return;
        }
        picked.forEach(s => separated.push({ id: s.id, method: methodLabel(s) }));
        const names = picked.map(s => s.name).join(', ');
        stageCaption.textContent = describe.ok(names);
        showResult(describe.okDetail(names));
        clearApparatus();
        render();
        acting = false;
        setBusy(false);
        if (remaining().length === 1) {
            const last = remaining()[0];
            stageCaption.textContent = `${names}${objectP(names)} 분리했습니다. 그릇에는 ${last.name}만 남아 모두 나뉘었습니다.`;
        }
    }

    magnetBtn.addEventListener('click', () => applyTool('magnet',
        s => s.magnetic,
        () => '자석에 붙음',
        {
            none: '자석에 붙는 물질이 따로 없어 분리되지 않았습니다.',
            noneDetail: '자석은 철로 된 물질만 끌어당깁니다. 남은 물질 중에는 자석에 붙는 것이 없습니다.',
            ok: n => `${n}${subjectP(n)} 자석에 붙어 분리되었습니다.`,
            okDetail: n => `${n}만 자석에 붙는 성질이 있어 다른 물질과 나눌 수 있었습니다.`,
        },
        playMagnet));

    waterBtn.addEventListener('click', async () => {
        const left = remaining();
        if (left.length === 0 || acting) return;
        // Water sorts by two properties at once: what dissolves and what floats.
        const dissolved = left.filter(s => s.soluble);
        const floated = left.filter(s => !s.soluble && s.density < 1);
        const picked = [...dissolved, ...floated];
        acting = true;
        setBusy(true);
        clearApparatus();
        await playWater(dissolved, floated);
        if (picked.length === 0 || picked.length === left.length) {
            stageCaption.textContent = '물에 넣어도 남은 물질이 모두 같게 행동해 분리되지 않았습니다.';
            showResult('물로 나누려면 녹는 물질이나 뜨는 물질이 섞여 있어야 합니다.');
            await wait(350);
            clearApparatus();
            render();
            acting = false;
            setBusy(false);
            return;
        }
        dissolved.forEach(s => separated.push({ id: s.id, method: '물에 녹음' }));
        floated.forEach(s => separated.push({ id: s.id, method: '물에 뜸' }));
        const parts = [];
        if (dissolved.length) {
            const n = dissolved.map(s => s.name).join(', ');
            parts.push(`${n}${topicP(n)} 물에 녹고`);
        }
        if (floated.length) {
            const n = floated.map(s => s.name).join(', ');
            parts.push(`${n}${topicP(n)} 물에 떠서`);
        }
        stageCaption.textContent = `${parts.join(' ')} 분리되었습니다.`;
        showResult(`물에 녹는 성질과 물에 뜨는 성질이 서로 달라 나눌 수 있었습니다. 가라앉은 물질은 그릇에 남습니다.`);
        clearApparatus();
        render();
        acting = false;
        setBusy(false);
    });

    sieveBtn.addEventListener('click', () => {
        const mesh = meshMm();
        applyTool('sieve',
            s => s.mm < mesh,                       // smaller than the opening falls through
            () => `체를 빠져나감 (${mesh} mm 구멍)`,
            {
                none: `구멍이 ${mesh} mm라 남은 물질이 모두 같은 쪽으로 가서 분리되지 않았습니다.`,
                noneDetail: `체로 나누려면 구멍 크기가 두 물질의 알갱이 크기 사이에 있어야 합니다. 지금은 모두 통과하거나 모두 남았습니다.`,
                ok: n => `${n}${subjectP(n)} ${mesh} mm 구멍을 빠져나가 분리되었습니다.`,
                okDetail: n => `${n}${topicP(n)} 구멍보다 작아 빠져나가고, 더 큰 알갱이는 체 위에 남았습니다.`,
            },
            picked => playSieve(picked, mesh));
    });

    meshRange.addEventListener('input', () => { meshOutput.textContent = `${meshMm()} mm`; renderSizes(); });

    resetBtn.addEventListener('click', () => {
        separated = [];
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        stageCaption.textContent = '자석·물·체 가운데 알맞은 도구를 골라 보세요.';
        acting = false;
        clearApparatus();
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

    window.__mixtureModel = {
        SUBSTANCES, remaining, separated: () => separated.map(v => ({ ...v })),
        setMesh(v) {
            const i = MESH_STOPS.indexOf(v);
            meshRange.value = String(i === -1 ? 3 : i);
            meshOutput.textContent = `${meshMm()} mm`;
            renderSizes();
        },
        reset: () => resetBtn.click(),
        grainCount: () => grains.length,
    };

    buildGrains();
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
