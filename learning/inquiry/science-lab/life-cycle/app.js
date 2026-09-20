'use strict';

/* Two things about an animal, side by side. How it grows — with or without a
   pupa, and how many days each step takes — and where it sits in the chain
   that feeds it. The pyramid narrows by ten each step up, because almost
   nothing an animal eats stays as body. */

const PASS = 10;   // roughly how many of a level it takes to feed one above
const NONE = '아무것도 먹지 않습니다';

const ANIMALS = {
    butterfly: {
        name: '배추흰나비', change: 'full', colour: '#f0d78a',
        stages: [
            { n: '알', days: 4, eat: NONE, food: '없음', tint: '#e8e0c0' },
            { n: '애벌레', days: 15, eat: '배춧잎을 갉아 먹습니다', food: '배춧잎', tint: '#a8cf7a' },
            { n: '번데기', days: 10, eat: NONE, food: '없음', tint: '#c8b98a' },
            { n: '어른벌레', days: null, eat: '꽃의 꿀을 빨아 먹습니다', food: '꽃의 꿀', tint: '#f2ecd2' },
        ],
        chain: ['배추', '배추흰나비 애벌레', '참새', '매'],
        units: ['포기', '마리', '마리', '마리'], at: 1,
        why: '애벌레는 갉아 먹는 턱을 가졌고 어른벌레는 빨아 먹는 대롱을 가졌습니다. 입이 통째로 바뀌었으니 먹는 것도 바뀝니다.',
    },
    mantis: {
        name: '사마귀', change: 'none', colour: '#9fd08a',
        stages: [
            { n: '알', days: 180, eat: NONE, food: '없음', tint: '#d6c9a0' },
            { n: '애벌레', days: 60, eat: '작은 벌레를 잡아먹습니다', food: '작은 벌레', tint: '#9fd08a' },
            { n: '어른벌레', days: null, eat: '메뚜기 같은 큰 벌레를 잡아먹습니다', food: '큰 벌레', tint: '#7ab86a' },
        ],
        chain: ['풀', '메뚜기', '사마귀', '새'],
        units: ['포기', '마리', '마리', '마리'], at: 2,
        moult: '몸에 맞지 않게 된 껍질을 여러 번 벗으며',
        why: '사마귀는 자라도 사는 곳이 바뀌지 않습니다. 다만 몸이 커진 만큼 잡을 수 있는 먹이도 커집니다.',
    },
    frog: {
        name: '개구리', change: 'shape', colour: '#8fd0b0',
        stages: [
            { n: '알', days: 7, eat: NONE, food: '없음', tint: '#cfe6e0' },
            { n: '올챙이', days: 60, eat: '물속 이끼를 먹습니다', food: '물속 이끼', tint: '#6f8f9a' },
            { n: '뒷다리 난 올챙이', days: 14, eat: '작은 벌레를 먹기 시작합니다', food: '작은 벌레', tint: '#79a68f' },
            { n: '개구리', days: null, eat: '곤충을 혀로 잡아먹습니다', food: '곤충', tint: '#8fd0b0' },
        ],
        chain: ['물풀', '물속 벌레', '개구리', '뱀'],
        units: ['포기', '마리', '마리', '마리'], at: 2,
        why: '올챙이는 물속에서 이끼를 훑어 먹고, 개구리는 뭍에서 혀를 뻗어 곤충을 잡습니다. 사는 곳이 바뀌니 먹는 것도 바뀝니다.',
    },
    chick: {
        name: '닭', change: 'none', colour: '#f0c98a',
        stages: [
            { n: '알', days: 21, eat: NONE, food: '없음', tint: '#f0e6d2' },
            { n: '병아리', days: 150, eat: '곡식과 벌레를 쪼아 먹습니다', food: '곡식과 벌레', tint: '#f5dd90' },
            { n: '어른 닭', days: null, eat: '곡식과 벌레를 먹습니다', food: '곡식과 벌레', tint: '#e0b070' },
        ],
        chain: ['곡식', '닭', '사람'],
        units: ['줌', '마리', '명'], at: 1,
        moult: '솜털이 빠지고 깃털이 자라며',
        // 병아리와 어른 닭은 먹는 것이 같습니다. 없는 차이를 만들어 내지 않습니다.
    },
};

/* Korean particles depend on the last letter, so they cannot be hard-coded
   into a sentence that swaps its subject. */
function jong(w) {
    const c = String(w).trim().slice(-1).charCodeAt(0);
    if (c < 0xac00 || c > 0xd7a3) return -1;
    return (c - 0xac00) % 28;
}
const eun = w => w + (jong(w) > 0 ? '은' : '는');
const iga = w => w + (jong(w) > 0 ? '이' : '가');
const eul = w => w + (jong(w) > 0 ? '을' : '를');
const ro = w => { const j = jong(w); return w + (j <= 0 || j === 8 ? '로' : '으로'); };   // 8 = ㄹ

const state = {
    animal: 'butterfly', step: 0,
    prediction: null, checked: false,
    running: false, t: 0, phase: 0,
};

const $ = id => document.getElementById(id);
const svgNS = 'http://www.w3.org/2000/svg';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function daysToAdult(k) {
    return ANIMALS[k].stages.reduce((s, x) => s + (x.days || 0), 0);
}
function verdictFor(k) {
    const c = ANIMALS[k].change;
    return c === 'full' ? 'p1' : (c === 'shape' ? 'p2' : 'p3');
}
// How many of each level it takes to keep one of the top alive.
function pyramid(k) {
    const a = ANIMALS[k];
    return a.chain.map((name, i) => ({
        name, unit: a.units[i], level: i,
        count: Math.pow(PASS, a.chain.length - 1 - i),
    }));
}

function analyse() {
    const a = ANIMALS[state.animal];
    const step = clamp(state.step, 0, a.stages.length - 1);
    return {
        animal: a, step, stage: a.stages[step],
        total: daysToAdult(state.animal), pyramid: pyramid(state.animal),
        verdict: verdictFor(state.animal),
    };
}

function el(tag, attrs, text) {
    const n = document.createElementNS(svgNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text !== undefined) n.textContent = text;
    return n;
}

/* How many days have gone by: every finished stage in full, plus however far
   we are into the one we are standing in. */
function elapsedDays() {
    const a = analyse(), list = a.animal.stages;
    let d = 0;
    for (let i = 0; i < a.step; i++) d += list[i].days || 0;
    const within = clamp(state.t * list.length - a.step, 0, 1);
    return d + (list[a.step].days || 0) * (state.running || state.t > 0 ? within : 0);
}

const STAGE_PATHS = {
    butterfly: [
        'M 50 16 C 66 16 72 44 72 64 C 72 78 62 84 50 84 C 38 84 28 78 28 64 C 28 44 34 16 50 16 Z',
        'M 18 62 C 14 56 16 48 24 46 C 26 42 30 40 36 44 C 44 38 56 38 66 42 C 76 40 84 46 88 54 C 92 62 88 70 80 72 C 72 74 60 70 50 72 C 40 70 30 74 22 70 C 16 68 14 64 18 62 M 16 58 L 10 60 L 14 64 Z',
        'M 48 10 C 56 10 60 22 62 38 C 68 50 64 74 54 90 C 48 90 42 74 38 52 C 34 36 40 10 48 10 Z',
        'M 50 40 C 42 20 20 18 14 26 C 8 34 16 52 38 54 C 20 58 12 74 20 84 C 28 94 44 80 48 64 L 52 64 C 56 80 72 94 80 84 C 88 74 80 58 62 54 C 84 52 92 34 86 26 C 80 18 58 20 50 40 M 50 36 C 48 30 46 22 42 20 C 38 18 42 14 45 16 C 48 18 50 28 50 36 Z',
    ],
    mantis: [
        'M 50 18 C 72 18 82 36 82 56 C 82 76 68 84 50 84 C 32 84 18 76 18 56 C 18 36 28 18 50 18 Z',
        'M 48 18 L 54 18 L 56 36 L 68 28 L 72 34 L 58 44 L 60 64 L 74 82 L 68 86 L 56 70 L 52 86 L 46 86 L 48 64 L 40 74 L 34 70 L 44 54 L 44 36 L 48 18 Z',
        'M 46 12 L 54 12 L 56 28 L 74 16 L 78 24 L 62 38 L 62 88 L 54 88 L 54 50 L 46 50 L 46 88 L 38 88 L 38 38 L 22 24 L 26 16 L 44 28 Z',
    ],
    frog: [
        'M 50 18 C 68 18 82 32 82 50 C 82 68 68 82 50 82 C 32 82 18 68 18 50 C 18 32 32 18 50 18 M 50 38 C 57 38 62 43 62 50 C 62 57 57 62 50 62 C 43 62 38 57 38 50 C 38 43 43 38 50 38 Z',
        'M 36 30 C 50 30 60 40 60 50 C 60 60 50 70 36 70 C 22 70 14 60 14 50 C 14 40 22 30 36 30 M 58 48 C 74 44 88 40 92 50 C 88 60 74 56 58 52 Z',
        'M 36 30 C 50 30 60 40 60 50 C 60 60 50 70 36 70 C 22 70 14 60 14 50 C 14 40 22 30 36 30 M 58 48 C 74 44 88 40 92 50 C 88 60 74 56 58 52 M 48 64 L 56 78 L 66 80 L 64 84 L 52 82 L 44 68 Z',
        'M 50 20 C 66 20 74 32 74 48 C 84 50 90 68 84 82 L 74 80 C 76 68 70 58 64 56 C 64 70 58 82 50 82 C 42 82 36 70 36 56 C 30 58 24 68 26 80 L 16 82 C 10 68 16 50 26 48 C 26 32 34 20 50 20 Z',
    ],
    chick: [
        'M 50 14 C 68 14 78 36 78 58 C 78 74 66 86 50 86 C 34 86 22 74 22 58 C 22 36 32 14 50 14 Z',
        'M 38 28 C 48 28 54 34 54 44 C 62 46 72 54 72 68 C 72 78 62 84 48 84 C 36 84 28 78 28 66 C 28 56 32 50 30 44 C 30 34 34 28 38 28 M 28 38 L 18 42 L 28 46 Z M 44 84 L 40 92 M 52 84 L 56 92',
        'M 36 14 C 44 14 48 22 48 30 C 58 34 76 44 82 58 C 86 68 82 78 72 82 C 58 82 46 76 40 64 L 38 82 L 32 82 L 34 56 C 28 48 28 34 36 14 M 28 26 L 16 30 L 28 34 Z M 38 82 L 36 94 M 50 82 L 52 94',
    ],
};

function drawStages(g) {
    const a = analyse();
    const list = a.animal.stages, n = list.length;
    const slot = 440 / n;

    g.appendChild(el('text', { x: 16, y: 24, class: 'big-read' }, a.animal.name));
    g.appendChild(el('text', { x: 16, y: 42, class: 'tiny-label' },
        a.animal.change === 'full' ? '번데기를 거칩니다'
            : (a.animal.change === 'shape' ? '번데기 없이 모습이 크게 바뀝니다' : '번데기 없이 조금씩 커집니다')));
    g.appendChild(el('text', { x: 444, y: 24, 'text-anchor': 'end', class: 'read-text' }, `어른까지 ${a.total}일`));

    const beat = 1 + 0.05 * Math.sin(state.phase * 3.2);
    const paths = STAGE_PATHS[state.animal] || [];
    list.forEach((s, i) => {
        const cx = 10 + slot * (i + 0.5), cy = 92;
        const here = i === a.step;
        const r = here ? 25 * (state.running ? beat : 1) : 21;
        g.appendChild(el('circle', { cx, cy, r, class: `stage-disc${here ? ' now' : ''}`, style: `fill:${s.tint}` }));
        if (paths[i]) {
            const sc = (r * 1.35 / 50).toFixed(3);
            const pathEl = el('path', {
                d: paths[i],
                fill: '#24343d',
                stroke: '#24343d',
                'stroke-width': '1.5',
                transform: `translate(${(cx - 50 * sc).toFixed(1)}, ${(cy - 50 * sc).toFixed(1)}) scale(${sc})`,
            });
            g.appendChild(pathEl);
        } else {
            g.appendChild(el('text', { x: cx, y: cy + 4, 'text-anchor': 'middle', class: 'stage-name', style: 'fill:#14242c' }, String(i + 1)));
        }
        g.appendChild(el('text', { x: cx, y: 132, 'text-anchor': 'middle', class: 'stage-name', style: `fill:${here ? '#d97706' : '#0f172a'}` }, s.n));
        g.appendChild(el('text', { x: cx, y: 146, 'text-anchor': 'middle', class: 'stage-days' }, s.days ? `${s.days}일` : '어른'));
        if (i < n - 1) {
            const x1 = cx + 27, x2 = 10 + slot * (i + 1.5) - 27;
            g.appendChild(el('line', { x1, y1: cy, x2, y2: cy, class: 'step-arrow' }));
            g.appendChild(el('path', { d: `M ${x2} ${cy} l -6 -4 l 0 8 z`, class: 'arrow-head' }));
        }
    });

    // A day counter, so the run reads as time passing rather than steps jumping.
    const done = elapsedDays();
    g.appendChild(el('rect', { x: 22, y: 156, width: 416, height: 6, rx: 3, class: 'day-track' }));
    g.appendChild(el('rect', { x: 22, y: 156, width: Math.max(2, 416 * done / a.total), height: 6, rx: 3, class: 'day-fill' }));
    g.appendChild(el('text', { x: 438, y: 222, 'text-anchor': 'end', class: 'tiny-label figure-caption' }, `${Math.round(done)}일째`));

    // What it is eating right now, given its own line so the row stays clean.
    g.appendChild(el('rect', { x: 22, y: 168, width: 416, height: 34, rx: 9, class: 'eat-box' }));
    g.appendChild(el('text', { x: 36, y: 182, class: 'tiny-label' }, `${a.stage.n}일 때 먹는 것`));
    g.appendChild(el('text', { x: 36, y: 196, class: 'part-label', style: 'fill:#0f172a' }, a.stage.eat));
}

function drawPyramid(g) {
    const a = analyse();
    const tiers = a.pyramid;
    const n = tiers.length;
    const cx = 230, topW = 96, botW = 340;
    const hTop = 30, hBot = 150;
    const rowH = (hBot - hTop) / n;

    tiers.forEach((t, i) => {
        const fromTop = n - 1 - i;          // 0 at the very top of the pyramid
        const y = hTop + fromTop * rowH;
        const wTop = topW + (botW - topW) * (fromTop / n);
        const wBot = topW + (botW - topW) * ((fromTop + 1) / n);
        const here = i === a.animal.at;
        g.appendChild(el('polygon', {
            points: `${cx - wTop / 2},${y} ${cx + wTop / 2},${y} ${cx + wBot / 2},${y + rowH - 3} ${cx - wBot / 2},${y + rowH - 3}`,
            class: `tier${here ? ' here' : ''}`,
            style: `fill:${here ? a.animal.colour : 'rgba(150,190,175,.28)'}`,
        }));
        g.appendChild(el('text', { x: cx, y: y + rowH / 2, 'text-anchor': 'middle', class: 'tier-name', style: `fill:${here ? '#14242c' : '#0f172a'}` }, t.name));
        g.appendChild(el('text', {
            x: cx + wBot / 2 + 8, y: y + rowH / 2 + 1, class: 'tier-count',
            style: `fill:${here ? '#d97706' : '#475569'}`,
        }, t.count === 1 ? `1${t.unit}` : `${t.count.toLocaleString('ko-KR')}${t.unit}쯤`));
        /* An arrow up the left edge for "this level feeds the one above". It
           needs a head — a bare curve just read as a stray bracket. */
        if (fromTop > 0) {
            const ax = cx - wBot / 2 - 13;
            const y1 = y + rowH - 5, y2 = y + 3;
            g.appendChild(el('line', { x1: ax, y1, x2: ax, y2, class: 'eat-arrow' }));
            g.appendChild(el('path', { d: `M ${ax} ${y2} l -3.5 6 l 7 0 z`, class: 'eat-head' }));
        }
    });

    g.appendChild(el('text', { x: 16, y: 22, class: 'small-label' }, `${iga(a.animal.name)} 든 먹이 사슬`));
    g.appendChild(el('text', { x: 444, y: 22, 'text-anchor': 'end', class: 'legend-text', style: `fill:${a.animal.colour}` },
        `${eun(a.animal.chain[a.animal.at])} 여기`));
    g.appendChild(el('text', { x: 230, y: 172, 'text-anchor': 'middle', class: 'legend-text', style: 'fill:#475569' },
        '한 단계 올라갈 때마다 열 배쯤 적어집니다'));
    g.appendChild(el('text', { x: 230, y: 190, 'text-anchor': 'middle', class: 'axis-title' },
        '맨 위 하나를 먹여 살리는 데 필요한 수'));
}

function render() {
    const m = $('mainGroup'), gr = $('graphGroup');
    m.textContent = ''; gr.textContent = '';
    drawStages(m); drawPyramid(gr);
    updateReadout();
}

const WORDS = { p1: '번데기를 거친다', p2: '번데기 없이 모습이 크게 바뀐다', p3: '처음부터 어른과 닮았다' };

function updateReadout() {
    const a = analyse();
    $('stageBadge').textContent = `${a.animal.name} · ${a.stage.n}`;
    $('valueA').textContent = `${a.total}일`;
    $('valueB').textContent = a.stage.food;
    const top = a.pyramid[a.pyramid.length - 1];
    const rows = [
        ['자라는 차례', a.animal.stages.map(s => s.n).join(' → '), false],
        ['지금 단계', `${a.step + 1}번째 · ${a.stage.n}`, false],
        ['이 단계에 머무는 날', a.stage.days ? `${a.stage.days}일` : '어른이 되면 끝', false],
        ['번데기', a.animal.change === 'full' ? '있습니다' : '없습니다', a.animal.change === 'full'],
        ['먹이 사슬', a.animal.chain.join(' → '), false],
        [`${top.name} 한 ${eul(top.unit)} 먹이려면`,
            `${iga(a.pyramid[0].name)} ${a.pyramid[0].count.toLocaleString('ko-KR')}${a.pyramid[0].unit}쯤 있어야 합니다`, false],
    ];
    $('dataNote').innerHTML = rows.map(([n, v, m]) =>
        `<div class="data-row${m ? ' match' : ''}"><span class="data-name">${n}</span><span class="data-val">${v}</span></div>`).join('');
    if (state.checked) explain(a);
}

function explain(a) {
    $('resultEmpty').hidden = true;
    $('resultContent').hidden = false;
    const v = a.verdict;
    if (state.prediction) {
        const ok = state.prediction === v;
        $('predictionResult').textContent = ok ? `예상이 맞았습니다 — ${WORDS[v]}.`
            : `예상은 ${WORDS[state.prediction]}였지만 결과는 ${WORDS[v]}입니다.`;
        $('predictionResult').className = `prediction-result ${ok ? 'correct' : 'wrong'}`;
    } else {
        $('predictionResult').textContent = '';
        $('predictionResult').className = 'prediction-result';
    }

    const names = a.animal.stages.map(s => s.n).join(' → ');
    let s = `${eun(a.animal.name)} ${names} 차례로 자랍니다. 알에서 어른이 되기까지 모두 ${a.total}일쯤 걸립니다. `;

    if (v === 'p1') {
        s += `가운데에 번데기가 있는 것이 눈에 띕니다. 번데기 속에서 몸이 새로 만들어지기 때문에, 애벌레와 어른벌레는 생김새가 전혀 다릅니다. 이런 자람을 완전 탈바꿈이라고 합니다. `;
    } else if (v === 'p2') {
        s += `번데기는 없지만 모습이 크게 바뀝니다. 올챙이는 물속에서 아가미로 숨 쉬고, 개구리가 되면 뭍으로 올라와 폐로 숨 쉽니다. 사는 곳이 통째로 바뀌는 셈입니다. `;
    } else {
        s += `번데기가 없습니다. 알에서 나올 때부터 어른과 제법 닮았고, ${a.animal.moult} 조금씩 커질 뿐입니다. `;
    }

    s += `지금은 ${a.stage.n} 단계이고, ${a.stage.eat}. `;
    const first = a.animal.stages.find(x => x.food !== '없음');
    const last = a.animal.stages[a.animal.stages.length - 1];
    if (first && first !== last && first.food !== last.food) {
        s += `${first.n}일 때는 ${first.food}, ${last.n}일 때는 ${last.food}입니다. ${a.animal.why} `;
    } else {
        s += `${eun(a.animal.name)} 새끼일 때와 어른일 때 먹는 것이 거의 같습니다. 모든 동물이 자라면서 먹이를 바꾸는 것은 아닙니다. `;
    }

    const p = a.pyramid, top = p[p.length - 1], bottom = p[0];
    s += `${eun(a.animal.name)} ${ro(a.animal.chain.join(' → '))} 이어지는 먹이 사슬 안에 있습니다. `;
    s += `먹은 것이 모두 몸이 되지는 않습니다. 대부분은 움직이고 숨 쉬는 데 쓰여 사라지므로, 한 단계 올라갈 때마다 수가 열 배쯤 줄어듭니다. `;
    s += `그래서 맨 위의 ${top.name} 한 ${eul(top.unit)} 먹여 살리려면 맨 아래의 ${iga(bottom.name)} ${bottom.count.toLocaleString('ko-KR')}${bottom.unit}쯤 있어야 합니다.`;
    $('elementaryExplanation').textContent = s;
}

// --- animation --------------------------------------------------------------
function tick(dt) {
    state.phase += dt;
    if (!state.running) return false;
    const n = ANIMALS[state.animal].stages.length;
    state.t = Math.min(1, state.t + dt / (n * 1.6));
    const step = Math.min(n - 1, Math.floor(state.t * n));
    if (step !== state.step) {
        state.step = step;
        $('stageRange').value = String(step);
        $('stageOutput').textContent = ANIMALS[state.animal].stages[step].n;
    }
    if (state.t >= 1) {
        state.running = false;
        $('runBtn').textContent = '키워 보기';
        state.checked = true;
        return true;
    }
    return false;
}

let last = 0;
function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    tick(dt);
    render();
    requestAnimationFrame(frame);
}

// --- wiring -----------------------------------------------------------------
function markSelected(sel, attr, value) {
    document.querySelectorAll(sel).forEach(b => b.classList.toggle('selected', b.dataset[attr] === String(value)));
}
// Each animal has its own number of stages, so the dial has to be resized.
function fitRange() {
    const n = ANIMALS[state.animal].stages.length;
    const r = $('stageRange');
    r.max = String(n - 1);
    state.step = clamp(state.step, 0, n - 1);
    r.value = String(state.step);
    $('stageOutput').textContent = ANIMALS[state.animal].stages[state.step].n;
}

document.querySelectorAll('[data-animal]').forEach(b => b.addEventListener('click', () => {
    state.animal = b.dataset.animal; state.step = 0; state.running = false; state.t = 0;
    $('runBtn').textContent = '키워 보기';
    markSelected('[data-animal]', 'animal', state.animal);
    fitRange(); render();
}));
document.querySelectorAll('[data-prediction]').forEach(b => b.addEventListener('click', () => {
    state.prediction = b.dataset.prediction; markSelected('[data-prediction]', 'prediction', state.prediction);
}));
$('stageRange').addEventListener('input', e => {
    state.step = Number(e.target.value);
    state.running = false; state.t = 0;   // dragged here by hand, so no part-day is elapsed
    $('runBtn').textContent = '키워 보기';
    $('stageOutput').textContent = ANIMALS[state.animal].stages[state.step].n;
    render();
});
$('runBtn').addEventListener('click', () => {
    if (state.running) { state.running = false; $('runBtn').textContent = '키워 보기'; return; }
    state.t = 0; state.step = 0; state.running = true; state.checked = true;
    $('runBtn').textContent = '멈추기';
    render();
});
$('resetBtn').addEventListener('click', () => {
    state.animal = 'butterfly'; state.step = 0;
    state.prediction = null; state.checked = false; state.running = false; state.t = 0;
    $('runBtn').textContent = '키워 보기';
    document.querySelectorAll('[data-prediction]').forEach(x => x.classList.remove('selected'));
    $('resultEmpty').hidden = false; $('resultContent').hidden = true;
    markSelected('[data-animal]', 'animal', 'butterfly');
    fitRange(); render();
});

document.querySelectorAll('.quiz-card').forEach(card => {
    card.querySelector('.answer-button').addEventListener('click', () => {
        const picked = card.querySelector('input:checked');
        const result = card.querySelector('.answer-result');
        const why = card.querySelector('.answer-explanation');
        if (!picked) { result.textContent = '먼저 답을 골라 보세요.'; result.className = 'answer-result'; return; }
        const ok = picked.value === card.dataset.answer;
        result.textContent = ok ? '맞았습니다.' : '다시 생각해 볼까요?';
        result.className = `answer-result ${ok ? 'correct' : 'wrong'}`;
        why.hidden = false;
    });
});

markSelected('[data-animal]', 'animal', state.animal);
fitRange();
render();
requestAnimationFrame(frame);

window.__lifeModel = {
    state, analyse, tick, render, daysToAdult, verdictFor, pyramid,
    ANIMALS, PASS,
    setAnimal(v) { document.querySelector(`[data-animal="${v}"]`).click(); },
    setStep(v) { const r = $('stageRange'); r.value = String(v); r.dispatchEvent(new Event('input')); },
    check() { state.checked = true; explain(analyse()); },
    runToEnd(dt = 1 / 30) {
        $('runBtn').click();
        let steps = 0;
        while (state.running && steps < 20000) { tick(dt); steps += 1; }
        render();
        return { steps, step: state.step };
    },
};

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
