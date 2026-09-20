'use strict';

/* Two measurements that depend on each other: how much DNA the reagents
   actually recover, and what size the gel says the pieces are. Migration is
   linear in log10(bp), which is why the standard curve is a straight line and
   why a ladder is the only way to turn a distance into a number. */

const PLASMID = 6000;                       // bp, and it is a closed circle
const SITES = { eco: [500, 2300, 5200], hind: [1200, 4000] };
const LADDER = [10000, 5000, 3000, 2000, 1500, 1000, 700, 500];
const LOG_TOP = Math.log10(20000), LOG_BOT = Math.log10(100);
const RATE = 3.6;        // px per minute for a fragment at the fast end
const LANE = 150;        // px of gel below the well
const PX_MM = 0.5;       // the lane is 75 mm of real gel
// A closed circle is wound up tight, so it slips through the mesh as though
// it were smaller than it is.
const CIRCULAR_APPARENT = 3500;

const state = {
    det: true, salt: true, cold: true, cut: 'eco',
    time: 40, elapsed: 40,
    prediction: null, checked: false,
    running: false, phase: 0,
};

const $ = id => document.getElementById(id);
const svgNS = 'http://www.w3.org/2000/svg';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = (v, d) => v.toFixed(d).replace('-', '−');

function yieldNow() {
    return 0.92 * (state.det ? 1 : 0.03) * (state.salt ? 1 : 0.28) * (state.cold ? 1 : 0.42);
}
function mobility(bp) { return clamp((LOG_TOP - Math.log10(bp)) / (LOG_TOP - LOG_BOT), 0.05, 1); }
function rawTravel(bp, min) { return mobility(bp) * RATE * min; }
function travel(bp, min) { return Math.min(LANE, rawTravel(bp, min)); }
function piled(bp, min) { return rawTravel(bp, min) > LANE + 1e-9; }

// check-controls: cut none,both — both are resolved here, before SITES is read.
function cutSites() {
    if (state.cut === 'none') return [];
    const s = state.cut === 'both' ? [...SITES.eco, ...SITES.hind] : SITES[state.cut];
    return s.slice().sort((a, b) => a - b);
}
function fragments() {
    const sites = cutSites();
    if (!sites.length) return [{ bp: PLASMID, app: CIRCULAR_APPARENT, circular: true }];
    const out = [];
    for (let i = 0; i < sites.length; i += 1) {
        const next = i === sites.length - 1 ? sites[0] + PLASMID : sites[i + 1];
        out.push({ bp: next - sites[i], app: next - sites[i], circular: false });
    }
    return out.sort((a, b) => b.bp - a.bp);
}

// Turning a distance back into a size is the whole point of the ladder.
function readSize(px, min) {
    if (min <= 0) return null;
    const f = px / (RATE * min);
    return Math.pow(10, LOG_TOP - f * (LOG_TOP - LOG_BOT));
}

function verdict() {
    const y = yieldNow();
    return y >= 0.70 ? 'p1' : (y >= 0.15 ? 'p2' : 'p3');
}

// Staining is by mass, so each band carries only its share of what was
// recovered. Below a couple of percent of the loaded plasmid a band is simply
// not there to be seen - which is why the faint small ones go first.
const DETECT = 0.02;

function analyse() {
    const min = state.elapsed;
    const y = yieldNow();
    const frs = fragments().map(f => {
        const mass = y * f.bp / PLASMID;
        return {
            ...f, mass,
            visible: mass >= DETECT,
            px: travel(f.app, min),
            piled: piled(f.app, min),
            read: piled(f.app, min) ? null : readSize(travel(f.app, min), min),
        };
    });
    return {
        yield: y, fragments: frs, seen: frs.filter(f => f.visible), cuts: cutSites().length,
        mmPerDecade: PX_MM * RATE * min / (LOG_TOP - LOG_BOT),
        minutes: min, verdict: verdict(),
    };
}

function el(tag, attrs, text) {
    const n = document.createElementNS(svgNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text !== undefined) n.textContent = text;
    return n;
}

const WELL_Y = 46;
const LANE_X = { ladder: 150, sample: 270 };
const BAND_W = 76;

function drawStage(g) {
    const a = analyse();

    // Extraction tube. The thread count is what the reagents earned.
    g.appendChild(el('text', { x: 50, y: 18, 'text-anchor': 'middle', class: 'small-label' }, '추출 튜브'));
    g.appendChild(el('rect', { x: 26, y: 122, width: 48, height: 72, class: 'layer-water' }));
    g.appendChild(el('rect', { x: 26, y: 46, width: 48, height: 76, class: 'layer-etoh' }));
    g.appendChild(el('path', { d: 'M 26 46 L 26 182 Q 26 194 38 194 L 62 194 Q 74 194 74 182 L 74 46', class: 'tube-glass' }));
    const threads = Math.round(a.yield * 7);
    for (let i = 0; i < threads; i += 1) {
        const bx = 32 + (i % 4) * 11, by = 108 - Math.floor(i / 4) * 16 + Math.sin(state.phase * 1.4 + i) * 2.2;
        g.appendChild(el('path', { d: `M ${bx} ${by} q 4 -6 8 0 q 4 6 8 0`, class: 'dna-thread' }));
    }
    g.appendChild(el('text', { x: 50, y: 208, 'text-anchor': 'middle', class: 'read-text' }, `${Math.round(a.yield * 100)}%`));

    // Gel with its two lanes.
    g.appendChild(el('rect', { x: 96, y: 30, width: 242, height: 5, rx: 2, class: 'electrode-minus' }));
    g.appendChild(el('text', { x: 92, y: 36, 'text-anchor': 'end', class: 'small-label', style: 'fill:#0284c7' }, '(−)'));
    g.appendChild(el('rect', { x: 96, y: 205, width: 242, height: 5, rx: 2, class: 'electrode-plus' }));
    g.appendChild(el('text', { x: 92, y: 211, 'text-anchor': 'end', class: 'small-label', style: 'fill:#ea580c' }, '(+)'));
    g.appendChild(el('rect', { x: 96, y: 40, width: 242, height: 160, rx: 6, class: 'gel-body' }));
    g.appendChild(el('text', { x: LANE_X.ladder, y: 22, 'text-anchor': 'middle', class: 'part-label' }, '표준자'));
    g.appendChild(el('text', { x: LANE_X.sample, y: 22, 'text-anchor': 'middle', class: 'part-label' }, '시료'));

    ['ladder', 'sample'].forEach(k => {
        g.appendChild(el('rect', { x: LANE_X[k] - BAND_W / 2, y: WELL_Y - 6, width: BAND_W, height: 6, class: 'well' }));
    });

    // Early in the run the ladder has not resolved, so most labels would land
    // on top of each other. Only the ones far enough apart to read get one.
    let lastLabel = -99;
    LADDER.forEach(bp => {
        const y = WELL_Y + travel(bp, a.minutes);
        g.appendChild(el('rect', { x: LANE_X.ladder - BAND_W / 2, y: y - 2, width: BAND_W, height: 4, rx: 1.5, class: 'band ladder' }));
        if (y - lastLabel >= 11) {
            g.appendChild(el('text', { x: LANE_X.ladder - BAND_W / 2 - 4, y: y + 3, 'text-anchor': 'end', class: 'tiny-label' }, String(bp)));
            lastLabel = y;
        }
    });

    a.seen.forEach(f => {
        const y = WELL_Y + f.px;
        const alpha = clamp(f.mass / 0.35, 0.25, 1);
        g.appendChild(el('rect', {
            x: LANE_X.sample - BAND_W / 2, y: y - 2.5, width: BAND_W, height: 5, rx: 1.5,
            class: `band ${f.piled ? 'piled' : 'sample'}`, style: `opacity:${fmt(alpha, 3)}`,
        }));
    });
    if (!a.seen.length) {
        g.appendChild(el('text', { x: LANE_X.sample, y: 120, 'text-anchor': 'middle', class: 'warn-text' }, '띠가 보이지 않음'));
    }

    // Sizes read off the ladder, listed rather than crammed onto the bands.
    g.appendChild(el('text', { x: 352, y: 22, class: 'small-label' }, '읽은 크기'));
    a.seen.slice(0, 5).forEach((f, i) => {
        const ty = 42 + i * 20;
        g.appendChild(el('rect', { x: 352, y: ty - 7, width: 12, height: 5, rx: 1.5, class: `band ${f.piled ? 'piled' : 'sample'}` }));
        g.appendChild(el('text', { x: 370, y: ty, class: 'part-label' },
            f.piled ? '젤 끝' : (f.read === null ? '아직 못 잼' : `${Math.round(f.read / 10) * 10} bp`)));
    });
    if (!a.seen.length) {
        g.appendChild(el('text', { x: 352, y: 150, class: 'warn-text' }, '건진 DNA가'));
        g.appendChild(el('text', { x: 352, y: 163, class: 'warn-text' }, '너무 적습니다'));
    } else if (a.minutes < 1) {
        g.appendChild(el('text', { x: 352, y: 150, class: 'warn-text' }, '아직 달리지'));
        g.appendChild(el('text', { x: 352, y: 163, class: 'warn-text' }, '않았습니다'));
    } else if (a.seen.some(f => f.piled)) {
        g.appendChild(el('text', { x: 352, y: 150, class: 'warn-text' }, '젤 끝에 몰려'));
        g.appendChild(el('text', { x: 352, y: 163, class: 'warn-text' }, '크기를 못 읽음'));
    }
    g.appendChild(el('text', { x: 352, y: 190, class: 'small-label' }, `${Math.round(a.minutes)}분`));
    g.appendChild(el('text', { x: 352, y: 203, class: 'tiny-label' }, '100 V'));
}

function drawGraph(g) {
    const a = analyse();
    const x0 = 54, x1 = 440, yTop = 26, yBot = 146, MM = 80;
    const X = mm => x0 + (mm / MM) * (x1 - x0);
    const Y = bp => yBot - ((Math.log10(bp) - LOG_BOT) / (LOG_TOP - LOG_BOT)) * (yBot - yTop);

    [100, 300, 1000, 3000, 10000].forEach(bp => {
        g.appendChild(el('line', { x1: x0, y1: Y(bp), x2: x1, y2: Y(bp), class: 'grid-line' }));
        g.appendChild(el('text', { x: x0 - 6, y: Y(bp) + 3.5, 'text-anchor': 'end', class: 'axis-text' }, String(bp)));
    });
    g.appendChild(el('line', { x1: x0, y1: yBot, x2: x1, y2: yBot, class: 'axis' }));
    g.appendChild(el('line', { x1: x0, y1: yTop, x2: x0, y2: yBot, class: 'axis' }));
    for (let mm = 0; mm <= MM; mm += 20) {
        g.appendChild(el('line', { x1: X(mm), y1: yBot, x2: X(mm), y2: yBot + 4, class: 'axis' }));
        g.appendChild(el('text', { x: X(mm), y: yBot + 15, 'text-anchor': 'middle', class: 'axis-text' }, String(mm)));
    }

    // The ladder's own points, and the line they define.
    const pts = LADDER.filter(bp => !piled(bp, a.minutes)).map(bp => [travel(bp, a.minutes) * PX_MM, bp]);
    if (pts.length >= 2 && a.minutes > 0) {
        const [m1, b1] = pts[0], [m2, b2] = pts[pts.length - 1];
        g.appendChild(el('line', { x1: X(m1), y1: Y(b1), x2: X(m2), y2: Y(b2), class: 'fit-line' }));
    }
    pts.forEach(([mm, bp]) => g.appendChild(el('circle', { cx: X(mm), cy: Y(bp), r: 3.4, class: 'ladder-dot' })));

    a.seen.forEach(f => {
        if (f.piled || a.minutes <= 0) return;
        const mm = f.px * PX_MM;
        g.appendChild(el('line', { x1: X(mm), y1: yBot, x2: X(mm), y2: Y(f.read), class: 'sample-mark' }));
        g.appendChild(el('line', { x1: x0, y1: Y(f.read), x2: X(mm), y2: Y(f.read), class: 'sample-mark' }));
        g.appendChild(el('circle', { cx: X(mm), cy: Y(f.read), r: 4, class: 'sample-dot' }));
    });

    g.appendChild(el('circle', { cx: x0 + 4, cy: 172, r: 3.4, class: 'ladder-dot' }));
    g.appendChild(el('text', { x: x0 + 12, y: 175.5, class: 'legend-text', style: 'fill:#bed2e1' }, '표준자'));
    g.appendChild(el('circle', { cx: x0 + 66, cy: 172, r: 4, class: 'sample-dot' }));
    g.appendChild(el('text', { x: x0 + 74, y: 175.5, class: 'legend-text', style: 'fill:#7ff0d6' }, '시료 조각'));
    g.appendChild(el('text', { x: x0 + 148, y: 175.5, class: 'legend-text', style: 'fill:#475569' },
        a.minutes > 0 ? `10배마다 ${fmt(a.mmPerDecade, 1)} mm씩` : '전압을 걸지 않았습니다'));
    g.appendChild(el('text', { x: (x0 + x1) / 2, y: 191, 'text-anchor': 'middle', class: 'axis-title' }, '이동 거리 (mm) — 세로는 조각 크기 (bp, 로그 눈금)'));
}

function render() {
    const m = $('mainGroup'), gr = $('graphGroup');
    m.textContent = ''; gr.textContent = '';
    drawStage(m); drawGraph(gr);
    updateReadout();
}

const CUT_NAME = { none: '자르지 않음', eco: 'EcoRI', hind: 'HindIII', both: 'EcoRI + HindIII' };

function updateReadout() {
    const a = analyse();
    $('stageBadge').textContent = `${CUT_NAME[state.cut]} · ${Math.round(a.minutes)}분`;
    $('valueA').textContent = `${Math.round(a.yield * 100)}%`;
    $('valueB').textContent = `${a.seen.length}개`;
    const faint = a.fragments.length - a.seen.length;
    const rows = [
        ['자른 곳', `${a.cuts}군데`, false],
        ['생긴 조각', `${a.fragments.map(f => `${f.bp}`).join(' · ')} bp`, false],
        ['조각 크기의 합', `${a.fragments.reduce((s, f) => s + f.bp, 0)} bp`, a.fragments.reduce((s, f) => s + f.bp, 0) === PLASMID],
        ['너무 흐린 조각', faint ? `${faint}개` : '없음', faint === 0],
        ['표준자 눈금', a.minutes > 0 ? `10배마다 ${fmt(a.mmPerDecade, 1)} mm` : '아직 달리지 않음', false],
        ['젤 끝에 닿은 띠', a.seen.filter(f => f.piled).length ? `${a.seen.filter(f => f.piled).length}개` : '없음', !a.seen.some(f => f.piled)],
    ];
    $('dataNote').innerHTML = rows.map(([n, v, m]) =>
        `<div class="data-row${m ? ' match' : ''}"><span class="data-name">${n}</span><span class="data-val">${v}</span></div>`).join('');
    if (state.checked) explain(a);
}

const WORDS = { p1: '거의 다', p2: '절반쯤', p3: '거의 못 건짐' };

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

    let s = `이 순서로는 DNA의 ${Math.round(a.yield * 100)}%를 건졌습니다. `;
    const missing = [];
    if (!state.det) missing.push('세제가 없어 막이 그대로 남아 DNA가 밖으로 나오지 못했습니다');
    if (!state.salt) missing.push('소금이 없어 가닥끼리 밀어내는 음전하가 그대로라 잘 뭉치지 않았습니다');
    if (!state.cold) missing.push('에탄올이 미지근해 DNA가 덜 엉겨 붙었습니다');
    if (missing.length) s += `${missing.join('. ')}. `;
    else s += `세 시약이 각각 막을 녹이고, 음전하를 가리고, 물을 빼앗는 일을 모두 해냈습니다. `;

    if (state.cut === 'none') {
        s += `자르지 않은 DNA는 고리 모양 그대로라 띠가 하나만 보입니다. 그런데 표준자로 읽으면 약 ${CIRCULAR_APPARENT} bp로 나옵니다. 실제로는 ${PLASMID} bp인데도 고리가 단단히 꼬여 있어 젤의 그물을 더 쉽게 빠져나가기 때문입니다. 젤이 알려 주는 것은 무게가 아니라 빠져나가는 정도라는 뜻입니다. `;
    } else {
        s += `${CUT_NAME[state.cut]}은 이 고리를 ${a.cuts}군데에서 자릅니다. 고리를 ${a.cuts}군데 자르면 조각도 ${a.cuts}개가 되고, 크기를 모두 더하면 ${PLASMID} bp로 원래대로 돌아옵니다. `;
    }
    const faint = a.fragments.length - a.seen.length;
    if (!a.seen.length) {
        s += `건진 양이 너무 적어 시료 칸에는 아무 띠도 나타나지 않습니다. 염색은 DNA의 양에 따라 진해지므로, 조각이 제대로 만들어졌더라도 눈에 보일 만큼 모이지 않으면 없는 것과 같습니다.`;
    } else if (a.minutes <= 0) {
        s += `아직 전압을 걸지 않아 모든 DNA가 홈에 그대로 있습니다. 거리를 재야 크기를 읽을 수 있습니다.`;
    } else if (a.seen.some(f => f.piled)) {
        s += `${Math.round(a.minutes)}분은 너무 깁니다. 작은 조각이 젤 끝까지 내려가 서로 겹쳤으므로 그 띠들은 크기를 읽을 수 없습니다. 시간을 줄여야 합니다.`;
    } else {
        if (faint) s += `다만 건진 양이 적어 작은 조각 ${faint}개는 너무 흐려 보이지 않습니다. 조각마다 나눠 가진 DNA의 양이 다르므로 작은 조각부터 사라집니다. `;
        s += `${Math.round(a.minutes)}분 동안 달린 결과, 표준자는 크기가 10배 달라질 때마다 ${fmt(a.mmPerDecade, 1)} mm씩 자리를 옮겼습니다. 이 직선을 자 삼아 시료의 띠를 읽으면 ${a.seen.map(f => `${Math.round(f.read / 10) * 10} bp`).join(', ')}입니다.`;
    }
    $('elementaryExplanation').textContent = s;
}

// --- animation --------------------------------------------------------------
function tick(dt) {
    state.phase += dt;
    if (!state.running) return false;
    state.elapsed = Math.min(state.time, state.elapsed + dt * state.time / 6);
    if (state.elapsed >= state.time) {
        state.running = false;
        $('runBtn').textContent = '전기 영동 시작';
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
function syncMarks() {
    markSelected('[data-det]', 'det', state.det ? 1 : 0);
    markSelected('[data-salt]', 'salt', state.salt ? 1 : 0);
    markSelected('[data-cold]', 'cold', state.cold ? 1 : 0);
    markSelected('[data-cut]', 'cut', state.cut);
}

document.querySelectorAll('[data-det]').forEach(b => b.addEventListener('click', () => {
    state.det = b.dataset.det === '1'; syncMarks(); render();
}));
document.querySelectorAll('[data-salt]').forEach(b => b.addEventListener('click', () => {
    state.salt = b.dataset.salt === '1'; syncMarks(); render();
}));
document.querySelectorAll('[data-cold]').forEach(b => b.addEventListener('click', () => {
    state.cold = b.dataset.cold === '1'; syncMarks(); render();
}));
document.querySelectorAll('[data-cut]').forEach(b => b.addEventListener('click', () => {
    state.cut = b.dataset.cut; syncMarks(); render();
}));
document.querySelectorAll('[data-prediction]').forEach(b => b.addEventListener('click', () => {
    state.prediction = b.dataset.prediction; state.checked = false; window.scienceInvalidatePrediction?.(); markSelected('[data-prediction]', 'prediction', state.prediction);
}));
$('timeRange').addEventListener('input', e => {
    state.time = Number(e.target.value);
    state.elapsed = state.time;
    state.running = false;
    $('runBtn').textContent = '전기 영동 시작';
    $('timeOutput').textContent = `${state.time}분`;
    render();
});
$('runBtn').addEventListener('click', () => {
    if (state.running) { state.running = false; $('runBtn').textContent = '전기 영동 시작'; return; }
    state.elapsed = 0; state.running = true; state.checked = true;
    $('runBtn').textContent = '멈추기';
    render();
});
$('resetBtn').addEventListener('click', () => {
    state.det = true; state.salt = true; state.cold = true; state.cut = 'eco';
    state.time = 40; state.elapsed = 40; state.running = false;
    state.prediction = null; state.checked = false;
    $('timeRange').value = '40'; $('timeOutput').textContent = '40분';
    $('runBtn').textContent = '전기 영동 시작';
    document.querySelectorAll('[data-prediction]').forEach(x => x.classList.remove('selected'));
    $('resultEmpty').hidden = false; $('resultContent').hidden = true;
    syncMarks(); render();
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

syncMarks();
render();
requestAnimationFrame(frame);

window.__gelModel = {
    state, analyse, tick, render, fragments, travel, mobility, readSize, yieldNow, piled,
    LADDER, PLASMID, SITES, CIRCULAR_APPARENT,
    setDet(v) { document.querySelector(`[data-det="${v ? 1 : 0}"]`).click(); },
    setSalt(v) { document.querySelector(`[data-salt="${v ? 1 : 0}"]`).click(); },
    setCold(v) { document.querySelector(`[data-cold="${v ? 1 : 0}"]`).click(); },
    setCut(v) { document.querySelector(`[data-cut="${v}"]`).click(); },
    setTime(v) { const r = $('timeRange'); r.value = String(v); r.dispatchEvent(new Event('input')); },
    check() { state.checked = true; explain(analyse()); },
    runToEnd(dt = 1 / 30) {
        $('runBtn').click();
        let steps = 0;
        while (state.running && steps < 20000) { tick(dt); steps += 1; }
        render();
        return { steps, elapsed: state.elapsed };
    },
};
