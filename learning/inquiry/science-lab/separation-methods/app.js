document.addEventListener('DOMContentLoaded', () => {
    const modeButtons = [...document.querySelectorAll('[data-mode]')];
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const mixButtons = document.getElementById('mixButtons');
    const progressRange = document.getElementById('progressRange');
    const progressOutput = document.getElementById('progressOutput');
    const methodHint = document.getElementById('methodHint');
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

    const PORE_MM = 0.01;          // filter paper holes, about 10 micrometres
    const HEAT_RATE = 20;          // degrees per second while nothing is boiling
    const BOIL_SECONDS = 10;       // seconds to boil away a whole tank of one substance
    const GRAPH = { x0: 62, x1: 424, y0: 152, y1: 24 };

    // Korean particles depend on whether the noun ends in a consonant.
    const batchim = w => {
        const c = w.charCodeAt(w.length - 1);
        return c >= 0xAC00 && c <= 0xD7A3 ? (c - 0xAC00) % 28 !== 0 : false;
    };
    const eun = w => w + (batchim(w) ? '은' : '는');
    const iga = w => w + (batchim(w) ? '이' : '가');
    const eul = w => w + (batchim(w) ? '을' : '를');
    const wa = w => w + (batchim(w) ? '과' : '와');
    // 로/으로 after a number depends on how its last digit is read aloud:
    // 영·삼·육·칠 end in a consonant, and 일·팔 end in ㄹ which takes로.
    const ro = s => s + ('0367'.includes(s[s.length - 1]) ? '으로' : '로');

    const MIXTURES = {
        filter: [
            { id: 'sandWater', label: '모래 + 물', hint: '녹지 않는 알갱이',
              parts: [{ n: '모래', size: 0.5, dissolved: false, colour: '#c8a86a' },
                      { n: '물', size: 0.0000003, dissolved: true, colour: '#0284c7' }] },
            { id: 'saltWater', label: '소금물', hint: '녹아 있는 물질',
              parts: [{ n: '소금', size: 0.0000006, dissolved: true, colour: '#e6ecf0' },
                      { n: '물', size: 0.0000003, dissolved: true, colour: '#0284c7' }] },
            { id: 'sandSalt', label: '모래 + 소금물', hint: '둘이 섞인 것',
              parts: [{ n: '모래', size: 0.5, dissolved: false, colour: '#c8a86a' },
                      { n: '소금', size: 0.0000006, dissolved: true, colour: '#e6ecf0' },
                      { n: '물', size: 0.0000003, dissolved: true, colour: '#0284c7' }] },
        ],
        distill: [
            { id: 'saltWater', label: '소금물', hint: '물만 끓어 나감',
              parts: [{ n: '물', bp: 100, frac: 0.9, colour: '#0284c7' }],
              residue: { n: '소금', pure: true, colour: '#e6ecf0' } },
            { id: 'waterEthanol', label: '물 + 에탄올', hint: '끓는점 78 ℃와 100 ℃',
              parts: [{ n: '에탄올', bp: 78, frac: 0.4, colour: '#b8a6f0' },
                      { n: '물', bp: 100, frac: 0.6, colour: '#0284c7' }],
              residue: null },
            { id: 'seaWater', label: '바닷물', hint: '여러 물질이 녹아 있음',
              parts: [{ n: '물', bp: 100, frac: 0.9, colour: '#0284c7' }],
              residue: { n: '소금과 여러 물질', pure: false, colour: '#d8cbb0' } },
        ],
        chroma: [
            { id: 'blackInk', label: '검정 사인펜 잉크', hint: '색소 3가지',
              parts: [{ n: '노랑', rf: 0.86, colour: '#d97706' },
                      { n: '빨강', rf: 0.62, colour: '#ff7d6b' },
                      { n: '파랑', rf: 0.34, colour: '#0284c7' }] },
            { id: 'spinach', label: '시금치 색소', hint: '색소 4가지',
              parts: [{ n: '카로틴', rf: 0.93, colour: '#ffa94d' },
                      { n: '잔토필', rf: 0.72, colour: '#ffe066' },
                      { n: '엽록소 a', rf: 0.55, colour: '#51cf66' },
                      { n: '엽록소 b', rf: 0.41, colour: '#2f9e44' }] },
            { id: 'foodDye', label: '식용 색소', hint: 'Rf가 비슷한 것이 있음',
              parts: [{ n: '황색 4호', rf: 0.74, colour: '#ffd43b' },
                      { n: '적색 40호', rf: 0.57, colour: '#ff6b6b' },
                      { n: '적색 3호', rf: 0.53, colour: '#f06595' }] },
        ],
    };
    const MODE_NAME = { filter: '거름', distill: '증류', chroma: '크로마토그래피' };
    const MODE_HINT = {
        filter: '거름은 알갱이 크기 차이로 나눕니다',
        distill: '증류는 끓는점 차이로 나눕니다',
        chroma: '크로마토그래피는 이동 속도 차이로 나눕니다',
    };
    const VERDICT = { full: '완전히 나뉜다', partial: '일부만 나뉜다', none: '나뉘지 않는다' };
    const VERDICT_TONE = { full: '#059669', partial: '#d97706', none: '#ea580c' };

    let mode = 'filter';
    let mixId = 'sandWater';
    let prediction = null;
    let running = false, frameId = 0, lastStamp = 0;

    const mixture = () => MIXTURES[mode].find(m => m.id === mixId) || MIXTURES[mode][0];
    /* The slider only steps in whole percent, so a run's sub-percent increments
       were being rounded straight back to where they started and the animation
       never moved. The run keeps its own clock and the slider just follows. */
    let animP = null;
    const progress = () => (animP === null ? Number(progressRange.value) : animP) / 100;

    // How long one full run takes, so the clock and the picture agree.
    function schedule(mix) {
        const segs = [];
        let t = 0, T = 20;
        mix.parts.forEach(part => {
            const rise = (part.bp - T) / HEAT_RATE;
            segs.push({ kind: 'rise', t0: t, t1: t + rise, T0: T, T1: part.bp });
            t += rise; T = part.bp;
            const hold = part.frac * BOIL_SECONDS;
            segs.push({ kind: 'boil', t0: t, t1: t + hold, T0: T, T1: T, part });
            t += hold;
        });
        return { segs, total: t };
    }

    const runSeconds = () => (mode === 'distill' ? schedule(mixture()).total : mode === 'chroma' ? 8 : 6);

    function tempAt(t, sch) {
        for (const s of sch.segs) {
            if (t <= s.t1 || s === sch.segs[sch.segs.length - 1]) {
                const f = s.t1 === s.t0 ? 1 : Math.min(1, Math.max(0, (t - s.t0) / (s.t1 - s.t0)));
                return s.T0 + (s.T1 - s.T0) * f;
            }
        }
        return 20;
    }

    function collectedAt(part, t, sch) {
        const s = sch.segs.find(x => x.kind === 'boil' && x.part === part);
        if (!s) return 0;
        return part.frac * Math.min(1, Math.max(0, (t - s.t0) / (s.t1 - s.t0)));
    }

    // What this method can and cannot do with this mixture.
    function analyse(m = mode, id = mixId) {
        const mix = MIXTURES[m].find(x => x.id === id) || MIXTURES[m][0];
        if (m === 'filter') {
            const caught = mix.parts.filter(p => !p.dissolved && p.size > PORE_MM);
            const passed = mix.parts.filter(p => !caught.includes(p));
            const verdict = caught.length === 0 ? 'none' : passed.length > 1 ? 'partial' : 'full';
            return { mix, verdict, caught, passed };
        }
        if (m === 'distill') {
            const sch = schedule(mix);
            // more than one substance left behind means the leftover is still a mixture
            const verdict = mix.id === 'waterEthanol' || (mix.residue && !mix.residue.pure) ? 'partial' : 'full';
            return { mix, verdict, sch };
        }
        const sorted = [...mix.parts].sort((a, b) => b.rf - a.rf);
        let closest = 1;
        for (let i = 1; i < sorted.length; i += 1) closest = Math.min(closest, sorted[i - 1].rf - sorted[i].rf);
        const verdict = closest < 0.08 ? 'partial' : 'full';
        return { mix, verdict, sorted, closest };
    }

    const round = (n, d = 2) => Number(n.toFixed(d));

    /* ---------------------------------------------------------- filtering */
    function renderFilter(a, p) {
        const F = { top: 46, wide0: 138, wide1: 242, tipY: 112, stemX0: 183, stemX1: 197, stemY: 140 };
        const B = { x0: 148, x1: 232, top: 146, bottom: 196 };
        let out = '';
        const liquidColour = a.passed.some(x => x.n === '소금') ? '#8fd0e8' : '#0284c7';

        // what is still waiting in the funnel
        const leftFrac = 1 - p;
        if (leftFrac > 0.01) {
            const surfaceY = F.top + (F.tipY - F.top) * (1 - leftFrac);
            const halfAt = y => ((F.wide1 - F.wide0) / 2) * (1 - (y - F.top) / (F.tipY - F.top));
            const cxF = (F.wide0 + F.wide1) / 2;
            out += `<path class="liquid" fill="${liquidColour}" opacity=".55" d="M${cxF - halfAt(surfaceY)},${surfaceY.toFixed(1)} ` +
                   `L${cxF + halfAt(surfaceY)},${surfaceY.toFixed(1)} L${cxF + 2},${F.tipY} L${cxF - 2},${F.tipY} Z"/>`;
        }
        // the funnel and the paper cone inside it
        out += `<path class="paper" d="M${F.wide0 + 6},${F.top + 4} L${F.wide1 - 6},${F.top + 4} L${(F.wide0 + F.wide1) / 2},${F.tipY - 2} Z"/>`;
        out += `<path class="glass" fill="none" d="M${F.wide0},${F.top} L${(F.wide0 + F.wide1) / 2 - 7},${F.tipY} L${F.stemX0},${F.stemY} ` +
               `M${F.wide1},${F.top} L${(F.wide0 + F.wide1) / 2 + 7},${F.tipY} L${F.stemX1},${F.stemY}"/>`;

        // residue piling up on the paper
        a.caught.forEach(part => {
            const h = 16 * p;
            if (h > 0.5) {
                const cxF = (F.wide0 + F.wide1) / 2;
                const halfB = ((F.wide1 - F.wide0) / 2) * (h / (F.tipY - F.top)) + 8;
                out += `<path class="residue" fill="${part.colour}" opacity=".92" d="M${cxF - halfB},${(F.tipY - h).toFixed(1)} ` +
                       `L${cxF + halfB},${(F.tipY - h).toFixed(1)} L${cxF + 3},${F.tipY} L${cxF - 3},${F.tipY} Z"/>`;
            }
        });

        // a drop on its way down while the run is going
        if (p > 0.02 && p < 0.99) {
            const dy = ((p * 7) % 1);
            out += `<circle class="drop" cx="190" cy="${(F.stemY + 4 + dy * (B.top - F.stemY - 6)).toFixed(1)}" r="3"/>`;
        }

        // what has come through, collecting in the beaker
        const fill = (B.bottom - B.top - 6) * p;
        if (fill > 0.5) {
            out += `<rect class="liquid" fill="${liquidColour}" opacity=".6" x="${B.x0 + 3}" y="${(B.bottom - 3 - fill).toFixed(1)}" ` +
                   `width="${B.x1 - B.x0 - 6}" height="${fill.toFixed(1)}" rx="2"/>`;
        }
        out += `<path class="glass" fill="none" d="M${B.x0},${B.top} L${B.x0},${B.bottom} L${B.x1},${B.bottom} L${B.x1},${B.top}"/>`;

        // beside the funnel, not above it, where the verdict line already sits
        out += `<text class="part-label" x="${F.wide0 - 8}" y="56" text-anchor="end">거름종이와 깔때기</text>`;
        out += `<text class="part-label" x="${(B.x0 + B.x1) / 2}" y="${B.bottom + 13}" text-anchor="middle">거른 액체</text>`;

        out += `<text class="part-label" x="266" y="60">거름종이에 남은 것</text>`;
        out += a.caught.length
            ? a.caught.map((x, i) => `<text class="read-text" x="266" y="${80 + i * 19}">${x.n} (${x.size} mm)</text>`).join('')
            : `<text class="note-text" x="266" y="80">없음 — 모두 빠져나갔습니다</text>`;
        const baseY = 80 + Math.max(1, a.caught.length) * 19 + 12;
        out += `<text class="part-label" x="266" y="${baseY}">빠져나간 것</text>`;
        out += a.passed.map((x, i) =>
            `<text class="note-text" x="266" y="${baseY + 18 + i * 15}">${x.n} — 구멍보다 작아 통과</text>`).join('');
        return out;
    }

    /* -------------------------------------------------------- distillation */
    function renderDistill(a,p) {
        const started=p>.2,alcohol=a.mix.id==='waterEthanol';
        return '<rect x="45" y="75" width="115" height="110" rx="8" fill="#bdd8e7"/><path d="M103 75 V50 H290 V115" fill="none" stroke="#7893a0" stroke-width="8"/><rect x="255" y="125" width="90" height="60" rx="8" fill="'+(started?'#a4c6e0':'#edf4f7')+'"/><text class="part-label" x="55" y="210">'+a.mix.label+'</text><text class="part-label" x="185" y="35">증기 → 냉각</text><text class="note-text" x="265" y="205">받은 액체</text><text class="note-text" x="20" y="65">'+(started?(alcohol?'에탄올 비율이 높아진 혼합 액체':'물은 기화·응결, 녹아 있던 소금은 남음'):'기화한 물질을 냉각해 받을 준비')+'</text>';
    }

    /* ----------------------------------------------------- chromatography */
    function renderChroma(a, p) {
        const BK = { x0: 146, x1: 314, top: 34, bottom: 198 };
        const PAPER = { x0: 208, x1: 252, top: 40, bottom: 190 };
        const SOLVENT_Y = 178, BASE_Y = 168, TOP_Y = 56;
        const front = BASE_Y - (BASE_Y - TOP_Y) * p;
        const rise = BASE_Y - front;
        let out = '';

        out += `<rect class="liquid" fill="#0284c7" opacity=".3" x="${BK.x0 + 3}" y="${SOLVENT_Y}" width="${BK.x1 - BK.x0 - 6}" height="${BK.bottom - SOLVENT_Y - 3}"/>`;
        out += `<rect class="paper" x="${PAPER.x0}" y="${PAPER.top}" width="${PAPER.x1 - PAPER.x0}" height="${PAPER.bottom - PAPER.top}" rx="2"/>`;
        // the wetted part of the paper
        if (rise > 0.5) {
            out += `<rect fill="#0284c7" opacity=".13" x="${PAPER.x0}" y="${front.toFixed(1)}" width="${PAPER.x1 - PAPER.x0}" height="${(PAPER.bottom - front).toFixed(1)}"/>`;
        }
        out += `<path class="glass" fill="none" d="M${BK.x0},${BK.top} L${BK.x0},${BK.bottom} L${BK.x1},${BK.bottom} L${BK.x1},${BK.top}"/>`;

        out += `<line class="base-line" x1="${PAPER.x0 - 12}" y1="${BASE_Y}" x2="${PAPER.x1 + 12}" y2="${BASE_Y}"/>`;
        out += `<text class="small-label" x="${PAPER.x0 - 16}" y="${BASE_Y + 4}" text-anchor="end">기준선</text>`;
        out += `<text class="small-label" x="${BK.x1 + 4}" y="${SOLVENT_Y + 4}">용매</text>`;
        if (rise > 0.5) {
            out += `<line class="front-line" x1="${PAPER.x0 - 12}" y1="${front.toFixed(1)}" x2="${PAPER.x1 + 12}" y2="${front.toFixed(1)}"/>`;
            out += `<text class="small-label" x="${PAPER.x0 - 16}" y="${(front + 4).toFixed(1)}" text-anchor="end">용매가 올라간 곳</text>`;
        }

        // Each spot sits at Rf of however far the solvent has climbed, so the
        // ratio is the same at every moment of the run.
        a.mix.parts.forEach(part => {
            const y = BASE_Y - rise * part.rf;
            out += `<ellipse class="spot" fill="${part.colour}" opacity=".9" cx="${(PAPER.x0 + PAPER.x1) / 2}" cy="${y.toFixed(1)}" rx="15" ry="5.5"/>`;
        });

        out += `<text class="part-label" x="330" y="52">성분과 Rf</text>`;
        [...a.mix.parts].sort((x, y) => y.rf - x.rf).forEach((part, i) => {
            const y = 72 + i * 17;
            out += `<rect x="330" y="${y - 8}" width="9" height="9" rx="2" fill="${part.colour}"/>`;
            out += `<text class="note-text" x="344" y="${y}">${part.n} Rf ${part.rf.toFixed(2)}</text>`;
        });
        const yy = 72 + a.mix.parts.length * 17 + 10;
        out += `<text class="note-text" x="330" y="${yy}">용매가 ${rise.toFixed(0)} 칸 올라갔습니다</text>`;
        out += `<text class="note-text" x="330" y="${yy + 15}">Rf = 성분 거리 ÷ 용매 거리</text>`;
        return out;
    }

    function renderMain(a) {
        const p = progress();
        let out = '';
        if (mode === 'filter') out += renderFilter(a, p);
        else if (mode === 'distill') out += renderDistill(a, p);
        else out += renderChroma(a, p);
        out += `<text class="verdict-text" fill="${VERDICT_TONE[a.verdict]}" x="20" y="26">${MODE_NAME[mode]} · ${a.mix.label} → ${VERDICT[a.verdict]}</text>`;
        mainGroup.innerHTML = out;
    }

    /* ------------------------------------------------------------- graphs */
    function graphFrame(xTicks, yTicks, xTitle, yTitle) {
        let out = '';
        yTicks.forEach(([v, y]) => {
            out += `<line class="grid-line" x1="${GRAPH.x0}" y1="${y.toFixed(1)}" x2="${GRAPH.x1}" y2="${y.toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(y + 3).toFixed(1)}" text-anchor="end">${v}</text>`;
        });
        xTicks.forEach(([v, x]) => {
            out += `<text class="axis-text" x="${x.toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${v}</text>`;
        });
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-title" x="${((GRAPH.x0 + GRAPH.x1) / 2).toFixed(1)}" y="${GRAPH.y0 + 30}" text-anchor="middle">${xTitle}</text>`;
        // inside the plot's left edge, clear of the topmost y tick label
        out += `<text class="axis-title" x="${GRAPH.x0 + 4}" y="${GRAPH.y1 - 8}">${yTitle}</text>`;
        return out;
    }

    function graphFilter(a) {
        // Sizes span seven decades, so only a log axis can show them together.
        const LO = -7, HI = 0;
        const gx = mm => GRAPH.x0 + ((Math.log10(mm) - LO) / (HI - LO)) * (GRAPH.x1 - GRAPH.x0);
        let out = '';
        const ticks = [[-7, '0.0000001'], [-5, '0.00001'], [-3, '0.001'], [-1, '0.1']]
            .map(([e, s]) => [s, gx(10 ** e)]);
        out += graphFrame(ticks, [], '알갱이 크기 (mm)', '');
        out += `<line class="pore-line" x1="${gx(PORE_MM).toFixed(1)}" y1="${GRAPH.y1}" x2="${gx(PORE_MM).toFixed(1)}" y2="${GRAPH.y0}"/>`;
        out += `<text class="pore-text" x="${(gx(PORE_MM) + 5).toFixed(1)}" y="${GRAPH.y1 + 10}">거름종이 구멍 ${PORE_MM} mm</text>`;
        // Label above each bar rather than past its end: the sand bar reaches
        // the right edge, so a label after it would run off the canvas.
        a.mix.parts.forEach((part, i) => {
            const y = GRAPH.y1 + 34 + i * 34;
            const caught = a.caught.includes(part);
            out += `<text class="bar-text" fill="${caught ? '#ea580c' : '#0284c7'}" x="${GRAPH.x0}" y="${y - 10}">` +
                   `${part.n} ${part.size} mm${part.dissolved ? ' (물에 녹음)' : ''} — ${caught ? '걸러짐' : '통과'}</text>`;
            out += `<rect class="bar" x="${GRAPH.x0}" y="${y - 4}" width="${Math.max(2, gx(part.size) - GRAPH.x0).toFixed(1)}" height="11" rx="3" fill="${part.colour}" opacity=".8"/>`;
        });
        return out;
    }

    function graphDistill(a) {
        return '<text class="axis-title" x="30" y="30">증류 관찰의 핵심</text><text class="note-text" x="30" y="70">기화 → 냉각 → 응결한 액체를 받음</text><text class="note-text" x="30" y="110">혼합물은 끓는 동안 온도가 변할 수 있음</text><text class="note-text" x="30" y="150">한 번에 두 순물질로 완전히 분리한다고 단정하지 않음</text>';
    }

    function graphChroma(a) {
        const gx = rf => GRAPH.x0 + rf * (GRAPH.x1 - GRAPH.x0);
        let out = '';
        const xTicks = [0, 0.25, 0.5, 0.75, 1].map(v => [v.toFixed(2), gx(v)]);
        out += graphFrame(xTicks, [], 'Rf 값 (이동 거리의 비)', '');
        a.sorted.forEach((part, i) => {
            const y = GRAPH.y1 + 22 + i * 26;
            out += `<rect class="bar" x="${GRAPH.x0}" y="${y - 7}" width="${(gx(part.rf) - GRAPH.x0).toFixed(1)}" height="14" rx="3" fill="${part.colour}" opacity=".85"/>`;
            out += `<text class="bar-text" fill="#0f172a" x="${(gx(part.rf) + 6).toFixed(1)}" y="${y + 4}">${part.n} ${part.rf.toFixed(2)}</text>`;
        });
        if (a.verdict === 'partial') {
            // pick the tightest pair by comparing gaps, not by float equality
            let worst = 1, gap = Infinity;
            for (let i = 1; i < a.sorted.length; i += 1) {
                const g = a.sorted[i - 1].rf - a.sorted[i].rf;
                if (g < gap) { gap = g; worst = i; }
            }
            const y = GRAPH.y1 + 22 + (worst - 0.5) * 26;
            out += `<text class="pore-text" x="${GRAPH.x0 + 6}" y="${y.toFixed(1)}">이 둘은 Rf 차이가 ${a.closest.toFixed(2)} 뿐이라 겹칩니다</text>`;
        }
        return out;
    }

    function renderGraph(a) {
        graphGroup.innerHTML = mode === 'filter' ? graphFilter(a) : mode === 'distill' ? graphDistill(a) : graphChroma(a);
    }

    function renderMixButtons() {
        mixButtons.innerHTML = MIXTURES[mode].map(m =>
            `<button type="button" data-mix="${m.id}" class="${m.id === mixId ? 'selected' : ''}">` +
            `<span>${m.label}</span><small>${m.hint}</small></button>`).join('');
        mixButtons.querySelectorAll('[data-mix]').forEach(button => {
            button.addEventListener('click', () => {
                mixId = button.dataset.mix;
                mixButtons.querySelectorAll('[data-mix]').forEach(b => b.classList.toggle('selected', b === button));
                settingsChanged();
            });
        });
    }

    function render() {
        const a = analyse();
        renderMain(a);
        renderGraph(a);
        progressOutput.textContent = `${Math.round(progress() * 100)} %`;
        stageBadge.textContent = `${MODE_NAME[mode]} · ${a.mix.label}`;
        methodHint.textContent = MODE_HINT[mode];
        dataNote.innerHTML = noteFor(a);
        return a;
    }

    function noteFor(a) {
        if (mode === 'filter') {
            return `<div class="data-row"><span class="data-name">거름종이 구멍</span><span class="data-val">${PORE_MM} mm</span></div>` +
                a.mix.parts.map(part =>
                    `<div class="data-row"><span class="data-name">${part.n}</span><span class="data-val">${part.size} mm ${part.dissolved ? '(물에 녹아 있음)' : ''} → ${a.caught.includes(part) ? '걸러짐' : '통과'}</span></div>`).join('') +
                `<div class="data-row match"><span class="data-name">결과</span><span class="data-val">${VERDICT[a.verdict]}</span></div>`;
        }
        if (mode === 'distill') {
            return '<p>기화와 응결로 성분을 분리하는 정성 모형입니다. 실제 온도·시간·수율은 계산하지 않습니다. 물과 에탄올은 함께 기화하며 한 번의 증류로 순수 에탄올만 얻는 것은 아닙니다. 가열은 교사의 안전 지도 아래 수행합니다.</p>';
        }
        const rise = (168 - 56) * progress();
        return `<div class="data-row"><span class="data-name">용매가 간 거리</span><span class="data-val">${rise.toFixed(0)} 칸</span></div>` +
            a.sorted.map(part =>
                `<div class="data-row"><span class="data-name">${part.n}</span><span class="data-val">${(rise * part.rf).toFixed(0)} 칸 ÷ ${rise.toFixed(0)} 칸 = Rf ${part.rf.toFixed(2)}</span></div>`).join('') +
            `<div class="data-row match"><span class="data-name">결과</span><span class="data-val">${VERDICT[a.verdict]}</span></div>`;
    }

    /* ----------------------------------------------------------- the run */
    function tick(dt) {
        const step = (dt / runSeconds()) * 100;
        const from = animP === null ? Number(progressRange.value) : animP;
        animP = Math.min(100, from + step);
        progressRange.value = String(Math.round(animP));   // the slider follows loosely
        render();
        return animP >= 100;
    }

    function stopRun() { running = false; if (frameId) cancelAnimationFrame(frameId); frameId = 0; }

    function frame(stamp) {
        if (!running) return;
        const dt = Math.min(0.05, (stamp - lastStamp) / 1000 || 0);
        lastStamp = stamp;
        if (tick(dt)) { stopRun(); finish(); } else frameId = requestAnimationFrame(frame);
    }

    function startRun() {
        stopRun();
        progressRange.value = '0';
        animP = 0;
        running = true;
        lastStamp = performance.now();
        render();
        frameId = requestAnimationFrame(frame);
    }

    function finish() {
        const a = render();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        valueA.textContent = VERDICT[a.verdict];
        predictionResult.textContent = !prediction
            ? '다음에는 결과를 먼저 예상해 보세요.'
            : prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';

        if (mode === 'filter') {
            valueB.textContent = a.caught.length ? a.caught.map(x => x.n).join(', ') : '없음';
            let s = `거름종이의 구멍은 ${PORE_MM} mm 입니다. `;
            if (a.caught.length) s += `${a.caught.map(x => `${x.n}(${x.size} mm)`).join(', ')}${batchim(a.caught[a.caught.length - 1].n) ? '은' : '는'} 구멍보다 커서 걸러졌습니다. `;
            else s += `걸러진 것이 하나도 없습니다. `;
            s += `${a.passed.map(x => x.n).join(', ')}${batchim(a.passed[a.passed.length - 1].n) ? '은' : '는'} 구멍보다 훨씬 작아 그대로 빠져나갔습니다. `;
            if (a.verdict === 'none') s += `물에 녹은 물질은 알갱이가 너무 작아 거름으로는 나눌 수 없습니다.`;
            else if (a.verdict === 'partial') s += `모래는 걸러 냈지만 빠져나간 액체는 아직 소금물이라 완전히 나뉜 것이 아닙니다.`;
            else s += `걸러진 것과 빠져나간 것이 각각 한 가지씩이라 완전히 나뉘었습니다.`;
            explanation.textContent = s;
            return;
        }
        if (mode === 'distill') {
            valueB.textContent=a.mix.id==='waterEthanol'?'에탄올 비율이 높아진 액체':'응결한 물';
            explanation.textContent=a.mix.id==='waterEthanol'?'에탄올이 더 잘 기화하는 성질을 이용하여 처음 혼합물보다 에탄올 비율이 높은 액체를 얻을 수 있습니다. 두 성분이 함께 기화하므로 순수한 에탄올과 물이 차례로 완전히 나오는 것은 아닙니다.':'물은 기화한 뒤 냉각되어 받는 용기에 모이고, 녹아 있던 비휘발성 성분은 원래 용기에 남습니다. 이 모형은 용매와 남는 성분의 분리를 나타내며 실제 장치의 완벽한 회수율을 보장하지 않습니다.';
            return;
        }
        valueB.textContent = `${a.mix.parts.length}가지 색소`;
        const top = a.sorted[0], bottom = a.sorted[a.sorted.length - 1];
        let s = `${eun(top.n)} Rf ${ro(top.rf.toFixed(2))} 가장 빠르게 올라갔고, ${eun(bottom.n)} Rf ${ro(bottom.rf.toFixed(2))} 가장 느리게 올라갔습니다. `;
        s += `Rf는 성분이 간 거리를 용매가 간 거리로 나눈 값이라, 용매가 얼마나 올라갔든 같은 값이 나옵니다. `;
        s += a.verdict === 'partial'
            ? `그런데 Rf 차이가 ${a.closest.toFixed(2)} 밖에 안 되는 성분이 있어 두 점이 겹쳐 보입니다. 완전히 나누려면 다른 용매를 써야 합니다.`
            : `Rf가 충분히 달라 ${a.mix.parts.length}가지 색소가 모두 따로 떨어졌습니다.`;
        explanation.textContent = s;
    }

    function settingsChanged() {
        stopRun();
        progressRange.value = '0';
        animP = null;                       // otherwise a finished run's clock would stick
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        render();
    }

    progressRange.addEventListener('input', () => {
        stopRun();
        animP = null;                       // dragging takes over from playback
        render();
        if (Number(progressRange.value) >= 100) finish();
    });
    modeButtons.forEach(button => button.addEventListener('click', () => {
        mode = button.dataset.mode;
        mixId = MIXTURES[mode][0].id;
        modeButtons.forEach(item => item.classList.toggle('selected', item === button));
        renderMixButtons();
        stageCaption.textContent = mode === 'filter'
            ? '무엇이 걸러지고 무엇이 그대로 빠져나가는지 보세요.'
            : mode === 'distill'
                ? '기화한 물질을 냉각해 액체로 받습니다. 혼합물의 온도는 변할 수 있습니다.'
                : '용매가 올라간 만큼 성분도 같은 비율로 올라갑니다.';
        settingsChanged();
    }));
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        prediction = null;
        predictionButtons.forEach(item => item.classList.remove('selected'));
        mixId = MIXTURES.filter[0].id;
        modeButtons.find(b => b.dataset.mode === 'filter').click();
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

    window.__sepModel = {
        PORE_MM, MIXTURES, analyse, schedule, tempAt, collectedAt, render, round,
        setMode(m) { modeButtons.find(b => b.dataset.mode === m).click(); },
        setMix(id) { mixId = id; renderMixButtons(); settingsChanged(); },
        setProgress(v) { stopRun(); progressRange.value = String(v); progressRange.dispatchEvent(new Event('input')); },
        runToEnd(dt = 1 / 60, cap = 20000) {
            stopRun(); progressRange.value = '0'; animP = 0;
            let steps = 0;
            while (!tick(dt) && steps < cap) steps += 1;
            finish();
            return { steps, progress: Number(progressRange.value) };
        },
        tick, finish, getMode: () => mode, getMix: () => mixId, runSeconds,
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
