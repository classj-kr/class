document.addEventListener('DOMContentLoaded', () => {
    const modeButtons = [...document.querySelectorAll('[data-mode]')];
    const controlArea = document.getElementById('controlArea');
    const predictionArea = document.getElementById('predictionArea');
    const predictionLegend = document.getElementById('predictionLegend');
    const methodHint = document.getElementById('methodHint');
    const checkBtn = document.getElementById('checkBtn');
    const resetBtn = document.getElementById('resetBtn');
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

    // Crystals grow as the fourth-ish root of how long the melt stays hot:
    // seven days of lava gives 0.1 mm, a million years underground gives 20 mm.
    const K_CRYSTAL = 0.0558, N_CRYSTAL = 0.3;
    const FINE_MM = 1, COARSE_MM = 5;
    const LOG_MIN = 0.5, LOG_MAX = 8.6;      // cooling time from 3 days to a million years
    const COOL_K = 3.65e6;                    // days per square kilometre of depth
    const FIELD = { x: 252, y: 44, w: 160, h: 120, mm: 10 };
    const PX_PER_MM = FIELD.w / FIELD.mm;
    const GRAPH = { x0: 66, x1: 424, y0: 150, y1: 28 };

    /* 숫자 뒤의 조사는 그 수를 소리 내어 읽은 끝소리를 따릅니다.
       영 일 이 삼 사 오 육 칠 팔 구 — 굳기 1·3·6·7은 받침이 있어 '과/을',
       4와 6.5는 받침이 없어 '와/를'입니다. */
    const DIGIT_JONG = { '0': 21, '1': 8, '2': 0, '3': 16, '4': 0, '5': 0, '6': 1, '7': 8, '8': 8, '9': 0 };
    const numJong = n => DIGIT_JONG[String(n).replace(/[^0-9]/g, '').slice(-1)] ?? 0;
    const wa = n => `${n}${numJong(n) > 0 ? '과' : '와'}`;
    /* 구별 기준은 조흔색·자성·염산 반응·굳기로 바뀝니다. 앞의 셋은 받침이 있어
       '으로', 굳기는 받침이 없어 '로'입니다. '(으)로'는 서식 표기지 문장에 쓸 말이
       아니라서 받침을 보고 골라 붙입니다. */
    const roWord = w => {
        const c = String(w).trim().slice(-1).charCodeAt(0);
        const j = (c < 0xac00 || c > 0xd7a3) ? -1 : (c - 0xac00) % 28;
        return `${w}${j <= 0 || j === 8 ? '로' : '으로'}`;
    };
    const eulNum = n => `${n}${numJong(n) > 0 ? '을' : '를'}`;

    const MINERALS = {
        talc: { name: '활석', h: 1, streak: '흰색', sc: '#f0f2f0', magnetic: false, acid: false, colour: '#cfd8d0' },
        calcite: { name: '방해석', h: 3, streak: '흰색', sc: '#f2eee2', magnetic: false, acid: true, colour: '#e6e0cc' },
        fluorite: { name: '형석', h: 4, streak: '흰색', sc: '#f0f4f2', magnetic: false, acid: false, colour: '#8fd0c0' },
        magnetite: { name: '자철석', h: 6, streak: '검은색', sc: '#2a2f33', magnetic: true, acid: false, colour: '#3a4046' },
        hematite: { name: '적철석', h: 6, streak: '붉은색', sc: '#8a3229', magnetic: false, acid: false, colour: '#6b3a35' },
        pyrite: { name: '황철석', h: 6.5, streak: '검은색', sc: '#33342c', magnetic: false, acid: false, colour: '#c9a227' },
        quartz: { name: '석영', h: 7, streak: '흰색', sc: '#eef2f4', magnetic: false, acid: false, colour: '#d8e2e8' },
    };

    const ROCKS = {
        fine: { basic: '현무암', middle: '안산암', acidic: '유문암', family: '화산암', texture: '세립질' },
        medium: { basic: '휘록암', middle: '안산반암', acidic: '석영반암', family: '반심성암', texture: '중립질' },
        coarse: { basic: '반려암', middle: '섬록암', acidic: '화강암', family: '심성암', texture: '조립질' },
    };

    const state = { mode: 'mineral', a: 'quartz', b: 'calcite', logT: 30, silica: 50, prediction: null };

    /* ------------------------------------------------------------ models */
    function analyseMineral(ak = state.a, bk = state.b) {
        const A = MINERALS[ak], B = MINERALS[bk];
        const verdict = A.h > B.h ? 'a' : A.h < B.h ? 'b' : 'none';
        // when hardness cannot tell them apart, something else has to
        const sameHardness = A.h === B.h;
        const tellApart = sameHardness
            ? (A.streak !== B.streak ? '조흔색' : A.magnetic !== B.magnetic ? '자성' : A.acid !== B.acid ? '염산 반응' : null)
            : '굳기';
        return { kind: 'mineral', A, B, ak, bk, verdict, sameHardness, tellApart, gap: Math.abs(A.h - B.h) };
    }

    const daysFor = slider => 10 ** (LOG_MIN + (slider / 100) * (LOG_MAX - LOG_MIN));
    const crystalFor = days => K_CRYSTAL * days ** N_CRYSTAL;

    function analyseRock(slider = state.logT, silica = state.silica) {
        const days = daysFor(slider);
        const mm = crystalFor(days);
        const texture = mm < FINE_MM ? 'fine' : mm > COARSE_MM ? 'coarse' : 'medium';
        const comp = silica < 52 ? 'basic' : silica < 63 ? 'middle' : 'acidic';
        const row = ROCKS[texture];
        // conductive cooling: time grows with the square of the depth
        const depthKm = Math.min(10, Math.sqrt(Math.max(0, days - 7) / COOL_K));
        return { kind: 'rock', days, mm, texture, comp, row, name: row[comp], silica, depthKm,
                 years: days / 365.25, verdict: texture };
    }

    const analyse = () => (state.mode === 'mineral' ? analyseMineral() : analyseRock());

    function timeText(days) {
        const y = days / 365.25;
        if (y >= 1e6) return `${(y / 1e6).toFixed(1)}백만 년`;
        if (y >= 10000) return `${Math.round(y / 10000).toLocaleString()}만 년`;
        if (y >= 1) return `${Math.round(y).toLocaleString()}년`;
        return `${Math.round(days)}일`;
    }

    /* ---------------------------------------------------------- controls */
    function mineralRow(which) {
        return `<fieldset class="pick-field"><legend>광물 ${which === 'a' ? 'A' : 'B'}</legend>` +
            `<div class="pick-buttons" data-pick="${which}">` +
            Object.entries(MINERALS).map(([k, m]) =>
                `<button type="button" data-value="${k}" class="${state[which] === k ? 'selected' : ''}">${m.name}<small>굳기 ${m.h}</small></button>`).join('') +
            `</div></fieldset>`;
    }

    function buildControls() {
        if (state.mode === 'mineral') {
            controlArea.innerHTML = mineralRow('a') + mineralRow('b');
        } else {
            controlArea.innerHTML =
                `<div class="range-heading"><label for="timeRange">마그마가 식는 데 걸린 시간</label><output id="timeOut" for="timeRange"></output></div>` +
                `<input id="timeRange" type="range" min="0" max="100" step="1" value="${state.logT}">` +
                `<div class="range-scale" aria-hidden="true"><span>며칠</span><span>수백 년</span><span>백만 년</span></div>` +
                `<div class="range-heading amount-heading"><label for="silicaRange">마그마의 성분 (이산화규소)</label><output id="silicaOut" for="silicaRange"></output></div>` +
                `<input id="silicaRange" type="range" min="45" max="75" step="1" value="${state.silica}">` +
                `<div class="range-scale" aria-hidden="true"><span>45% 어두움</span><span>60%</span><span>75% 밝음</span></div>`;
        }
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                changed();
            }));
        });
        ['timeRange', 'silicaRange'].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('input', () => {
                if (id === 'timeRange') state.logT = Number(el.value); else state.silica = Number(el.value);
                changed();
            });
        });
    }

    const PRED_MIN = [{ v: 'a', t: 'A가 B를 긁는다' }, { v: 'b', t: 'B가 A를 긁는다' }, { v: 'none', t: '서로 긁지 못한다' }];
    const PRED_ROCK = [{ v: 'fine', t: '세립질' }, { v: 'medium', t: '중립질' }, { v: 'coarse', t: '조립질' }];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list = state.mode === 'mineral' ? PRED_MIN : PRED_ROCK;
        predictionLegend.textContent = state.mode === 'mineral' ? '서로 긁으면 어떻게 될까요?' : '결정의 크기는 어떨까요?';
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.v}">${o.t}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

    function lump(cx, cy, r, colour, seed) {
        const rand = rng(seed);
        const pts = [];
        for (let i = 0; i < 9; i += 1) {
            const th = (i / 9) * Math.PI * 2;
            const rr = r * (0.78 + rand() * 0.34);
            pts.push(`${(cx + rr * Math.cos(th)).toFixed(1)},${(cy + rr * Math.sin(th) * 0.8).toFixed(1)}`);
        }
        return `<polygon class="specimen" fill="${colour}" points="${pts.join(' ')}"/>`;
    }

    function renderMineral(a) {
        let out = '';
        const AX = 96, BX = 216, CY = 96;
        out += lump(AX, CY, 36, a.A.colour, 7);
        out += lump(BX, CY, 36, a.B.colour, 23);
        out += `<text class="part-label" x="${AX}" y="150" text-anchor="middle">A · ${a.A.name}</text>`;
        out += `<text class="small-label" x="${AX}" y="164" text-anchor="middle">모스 굳기 ${a.A.h}</text>`;
        out += `<text class="part-label" x="${BX}" y="150" text-anchor="middle">B · ${a.B.name}</text>`;
        out += `<text class="small-label" x="${BX}" y="164" text-anchor="middle">모스 굳기 ${a.B.h}</text>`;

        // the scratch appears on whichever one is softer
        if (a.verdict !== 'none') {
            const vx = a.verdict === 'a' ? BX : AX;
            out += `<path class="scratch" d="M${vx - 22},${CY + 6} L${vx + 22},${CY - 6}" stroke-dasharray="52" stroke-dashoffset="52">` +
                   `<animate attributeName="stroke-dashoffset" values="52;0;0;52" dur="2.6s" repeatCount="indefinite"/></path>`;
            const hx = a.verdict === 'a' ? AX : BX;
            out += `<text class="small-label" x="${vx}" y="${CY + 28}" text-anchor="middle" style="fill:#d97706">흠집</text>`;
            out += `<text class="small-label" x="${hx}" y="${CY + 28}" text-anchor="middle">더 단단함</text>`;
        } else {
            out += `<text class="small-label" x="${(AX + BX) / 2}" y="${CY + 30}" text-anchor="middle">굳기가 같아 서로 긁지 못합니다</text>`;
        }

        // the streak plate tells them apart when hardness cannot
        out += `<rect class="streak-plate" x="300" y="44" width="140" height="52" rx="5"/>`;
        out += `<text class="small-label" x="370" y="38" text-anchor="middle">조흔판</text>`;
        [[a.A, 62, 'A'], [a.B, 82, 'B']].forEach(([m, y, tag]) => {
            out += `<line class="streak-mark" style="stroke:${m.sc}" x1="316" y1="${y}" x2="410" y2="${y}"/>`;
            out += `<text class="small-label" style="fill:#3a4448" x="310" y="${y + 4}" text-anchor="end">${tag}</text>`;
            out += `<text class="small-label" x="416" y="${y + 4}">${m.streak}</text>`;
        });

        out += `<text class="part-label" x="300" y="122">자석에 붙는가</text>`;
        out += `<text class="note-text" x="300" y="138">A ${a.A.magnetic ? '붙는다' : '안 붙는다'} · B ${a.B.magnetic ? '붙는다' : '안 붙는다'}</text>`;
        out += `<text class="part-label" x="300" y="160">묽은 염산 반응</text>`;
        out += `<text class="note-text" x="300" y="176">A ${a.A.acid ? '거품이 난다' : '반응 없음'} · B ${a.B.acid ? '거품이 난다' : '반응 없음'}</text>`;

        out += `<text class="part-label" x="20" y="24">굳기 ${wa(a.A.h)} ${eulNum(a.B.h)} 견줍니다</text>`;
        out += `<text class="note-text" x="20" y="200">${a.tellApart ? `이 둘은 ${roWord(a.tellApart)} 구별할 수 있습니다` : '이 둘은 주어진 방법으로는 구별되지 않습니다'}</text>`;
        mainGroup.innerHTML = out;
    }

    function crystalColour(silica, shade) {
        // low silica rocks are dark, high silica rocks are pale
        const f = (silica - 45) / 30;
        const dark = [58, 64, 70], light = [226, 220, 206];
        const mix = dark.map((d, i) => Math.round(d + (light[i] - d) * f * shade));
        return `rgb(${mix.join(',')})`;
    }

    function renderRock(a) {
        let out = '';
        // where this melt cooled
        const GY = 92;
        out += `<rect class="crust" x="20" y="${GY}" width="210" height="96" rx="3"/>`;
        out += `<line class="ground-line" x1="20" y1="${GY}" x2="230" y2="${GY}"/>`;
        out += `<text class="small-label" x="24" y="${GY - 6}">지표</text>`;
        if (a.depthKm < 0.4) {
            out += `<path class="magma" d="M96,${GY} q30,-16 60,0 q-30,8 -60,0 Z"/>`;
            out += `<rect class="magma" x="60" y="${GY - 5}" width="130" height="6" rx="3"/>`;
            out += `<text class="small-label" x="125" y="${GY - 16}" text-anchor="middle">지표로 흘러나온 용암</text>`;
        } else {
            // kept high enough that its caption clears the line of notes below
            const dy = GY + 10 + (a.depthKm / 10) * 44;
            out += `<ellipse class="magma deep" cx="125" cy="${dy.toFixed(1)}" rx="52" ry="18"/>`;
            out += `<text class="depth-label" x="125" y="${(dy + 32).toFixed(1)}" text-anchor="middle">깊이 약 ${a.depthKm.toFixed(1)} km</text>`;
        }
        out += `<text class="note-text" x="20" y="200">식는 데 걸린 시간 ${timeText(a.days)} · 결정 크기 ${a.mm.toFixed(2)} mm</text>`;

        // the same rock seen through a lens
        out += `<rect class="field-box" x="${FIELD.x}" y="${FIELD.y}" width="${FIELD.w}" height="${FIELD.h}" rx="4"/>`;
        const px = Math.max(2, a.mm * PX_PER_MM);
        const rand = rng(Math.round(a.silica) * 131 + Math.round(a.mm * 100));
        let grains = '';
        for (let y = FIELD.y - px; y < FIELD.y + FIELD.h + px; y += px) {
            for (let x = FIELD.x - px; x < FIELD.x + FIELD.w + px; x += px) {
                const jx = x + (rand() - 0.5) * px * 0.4, jy = y + (rand() - 0.5) * px * 0.4;
                const s = px * (0.55 + rand() * 0.5);
                grains += `<rect class="crystal" x="${jx.toFixed(1)}" y="${jy.toFixed(1)}" width="${s.toFixed(1)}" height="${s.toFixed(1)}" ` +
                          `rx="${(s * 0.2).toFixed(1)}" fill="${crystalColour(a.silica, 0.6 + rand() * 0.7)}"/>`;
            }
        }
        out += `<g clip-path="url(#fieldClip)">${grains}</g>`;
        out += `<rect class="field-box" fill="none" x="${FIELD.x}" y="${FIELD.y}" width="${FIELD.w}" height="${FIELD.h}" rx="4"/>`;
        out += `<text class="small-label" x="${FIELD.x + FIELD.w / 2}" y="${FIELD.y - 6}" text-anchor="middle">확대해서 본 모습 (가로 ${FIELD.mm} mm)</text>`;
        out += `<line class="scale-bar" x1="${FIELD.x + 8}" y1="${FIELD.y + FIELD.h - 8}" x2="${FIELD.x + 8 + PX_PER_MM}" y2="${FIELD.y + FIELD.h - 8}"/>`;
        out += `<text class="scale-text" x="${FIELD.x + 12 + PX_PER_MM}" y="${FIELD.y + FIELD.h - 5}">1 mm</text>`;

        out += `<text class="rock-name" x="${FIELD.x + FIELD.w / 2}" y="${FIELD.y + FIELD.h + 22}" text-anchor="middle">${a.name}</text>`;
        out += `<text class="small-label" x="${FIELD.x + FIELD.w / 2}" y="${FIELD.y + FIELD.h + 38}" text-anchor="middle">${a.row.family} · ${a.row.texture}</text>`;
        out += `<text class="part-label" x="20" y="24">이산화규소 ${a.silica}% · ${a.silica < 52 ? '어두운 색' : a.silica < 63 ? '중간 색' : '밝은 색'}</text>`;
        mainGroup.innerHTML = out;
    }

    /* ------------------------------------------------------------ graphs */
    function graphMineral(a) {
        const list = Object.entries(MINERALS);
        const gx = h => GRAPH.x0 + (h / 10) * (GRAPH.x1 - GRAPH.x0);
        let out = '';
        [0, 2, 4, 6, 8, 10].forEach(h => {
            out += `<line class="grid-line" x1="${gx(h).toFixed(1)}" y1="${GRAPH.y1}" x2="${gx(h).toFixed(1)}" y2="${GRAPH.y0}"/>`;
            out += `<text class="axis-text" x="${gx(h).toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${h}</text>`;
        });
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<text class="axis-title" x="${((GRAPH.x0 + GRAPH.x1) / 2).toFixed(1)}" y="${GRAPH.y0 + 32}" text-anchor="middle">모스 굳기</text>`;
        list.forEach(([k, m], i) => {
            const y = GRAPH.y1 + 10 + i * 17;
            const on = k === a.ak || k === a.bk;
            out += `<text class="axis-text" style="fill:${on ? '#0f172a' : '#7f9298'}" x="${GRAPH.x0 - 6}" y="${(y + 4).toFixed(1)}" text-anchor="end">${m.name}</text>`;
            out += `<rect class="bar" x="${GRAPH.x0}" y="${y - 5}" width="${(gx(m.h) - GRAPH.x0).toFixed(1)}" height="11" rx="3" ` +
                   `fill="${m.colour}" opacity="${on ? 0.95 : 0.32}"/>`;
            out += `<text class="bar-text" style="fill:${on ? '#d97706' : '#7f9298'}" x="${(gx(m.h) + 6).toFixed(1)}" y="${(y + 4).toFixed(1)}">${m.h}` +
                   `${k === a.ak ? ' ← A' : ''}${k === a.bk ? ' ← B' : ''}</text>`;
        });
        graphGroup.innerHTML = out;
    }

    function graphRock(a) {
        const gx = lg => GRAPH.x0 + ((lg - LOG_MIN) / (LOG_MAX - LOG_MIN)) * (GRAPH.x1 - GRAPH.x0);
        const lgY = mm => Math.log10(mm);
        const YMIN = -1.4, YMAX = 1.6;
        const gy = mm => GRAPH.y0 - ((lgY(mm) - YMIN) / (YMAX - YMIN)) * (GRAPH.y0 - GRAPH.y1);
        let out = '';
        [0.05, 0.1, 0.5, 1, 5, 10, 30].forEach(mm => {
            out += `<line class="grid-line" x1="${GRAPH.x0}" y1="${gy(mm).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(mm).toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(gy(mm) + 3).toFixed(1)}" text-anchor="end">${mm}</text>`;
        });
        [[0.5, '3일'], [2.5, '1년'], [4.5, '90년'], [6.5, '9천 년'], [8.6, '백만 년']].forEach(([lg, name]) => {
            out += `<text class="axis-text" x="${gx(lg).toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${name}</text>`;
        });
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-title" x="${((GRAPH.x0 + GRAPH.x1) / 2).toFixed(1)}" y="${GRAPH.y0 + 32}" text-anchor="middle">식는 데 걸린 시간</text>`;
        out += `<text class="axis-title" x="${GRAPH.x0 + 4}" y="${GRAPH.y1 - 10}">결정 크기 (mm)</text>`;
        [[FINE_MM, '1 mm — 여기부터 알갱이가 보입니다'], [COARSE_MM, '5 mm — 조립질']].forEach(([mm, name]) => {
            out += `<line class="split-line" x1="${GRAPH.x0}" y1="${gy(mm).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(mm).toFixed(1)}"/>`;
            out += `<text class="split-text" x="${GRAPH.x1 - 4}" y="${(gy(mm) - 4).toFixed(1)}" text-anchor="end">${name}</text>`;
        });
        const pts = [];
        for (let lg = LOG_MIN; lg <= LOG_MAX + 1e-9; lg += 0.1) pts.push(`${gx(lg).toFixed(1)},${gy(crystalFor(10 ** lg)).toFixed(1)}`);
        out += `<path class="trace" d="M${pts.join('L')}"/>`;
        const lgNow = LOG_MIN + (state.logT / 100) * (LOG_MAX - LOG_MIN);
        out += `<circle class="trace-dot" cx="${gx(lgNow).toFixed(1)}" cy="${gy(a.mm).toFixed(1)}" r="5" fill="#d97706"/>`;
        graphGroup.innerHTML = out;
    }

    /* ------------------------------------------------------------ render */
    function render() {
        const a = analyse();
        if (a.kind === 'mineral') { renderMineral(a); graphMineral(a); } else { renderRock(a); graphRock(a); }
        const t = document.getElementById('timeOut');
        if (t) t.textContent = timeText(daysFor(state.logT));
        const s = document.getElementById('silicaOut');
        if (s) s.textContent = `${state.silica} %`;
        methodHint.textContent = state.mode === 'mineral'
            ? '굳기가 큰 광물이 작은 광물을 긁습니다'
            : '천천히 식을수록 결정이 크게 자랍니다';
        stageBadge.textContent = a.kind === 'mineral'
            ? `${a.A.name} ${a.A.h} vs ${a.B.name} ${a.B.h}`
            : `${a.name} · 결정 ${a.mm.toFixed(2)} mm`;
        dataNote.innerHTML = a.kind === 'mineral'
            ? `<div class="data-row"><span class="data-name">굳기</span><span class="data-val">A ${a.A.name} ${a.A.h} · B ${a.B.name} ${a.B.h}</span></div>` +
              `<div class="data-row"><span class="data-name">조흔색</span><span class="data-val">A ${a.A.streak} · B ${a.B.streak}</span></div>` +
              `<div class="data-row"><span class="data-name">자성</span><span class="data-val">A ${a.A.magnetic ? '있음' : '없음'} · B ${a.B.magnetic ? '있음' : '없음'}</span></div>` +
              `<div class="data-row"><span class="data-name">염산 반응</span><span class="data-val">A ${a.A.acid ? '거품' : '없음'} · B ${a.B.acid ? '거품' : '없음'}</span></div>` +
              `<div class="data-row match"><span class="data-name">긁기 결과</span><span class="data-val">${SCRATCH[a.verdict](a)}</span></div>`
            : `<div class="data-row"><span class="data-name">식는 시간</span><span class="data-val">${timeText(a.days)} (${Math.round(a.days).toLocaleString()}일)</span></div>` +
              `<div class="data-row"><span class="data-name">결정 크기</span><span class="data-val">${a.mm.toFixed(2)} mm → ${a.row.texture}</span></div>` +
              `<div class="data-row"><span class="data-name">식은 곳</span><span class="data-val">${a.depthKm < 0.4 ? '지표 (용암)' : `땅속 약 ${a.depthKm.toFixed(1)} km`}</span></div>` +
              `<div class="data-row"><span class="data-name">성분</span><span class="data-val">이산화규소 ${a.silica}% → ${a.comp === 'basic' ? '어두운 색' : a.comp === 'middle' ? '중간 색' : '밝은 색'}</span></div>` +
              `<div class="data-row match"><span class="data-name">암석 이름</span><span class="data-val">${a.name} (${a.row.family})</span></div>`;
        return a;
    }

    const SCRATCH = {
        a: x => `${x.A.name}이 ${x.B.name}에 흠집을 냅니다`,
        b: x => `${x.B.name}이 ${x.A.name}에 흠집을 냅니다`,
        none: () => '굳기가 같아 서로 긁지 못합니다',
    };

    function check() {
        const a = render();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        if (a.kind === 'mineral') {
            labelA.textContent = '긁기 결과'; labelB.textContent = '구별하는 방법';
            valueA.textContent = a.verdict === 'a' ? 'A가 B를 긁음' : a.verdict === 'b' ? 'B가 A를 긁음' : '서로 긁지 못함';
            valueB.textContent = a.tellApart || '구별 어려움';
            predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
                : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
            let s = `${a.A.name}의 모스 굳기는 ${a.A.h}, ${a.B.name}의 모스 굳기는 ${a.B.h}입니다. `;
            if (a.verdict === 'none') {
                s += `굳기가 같아 서로 긁지 못합니다. 이럴 때는 다른 성질을 봐야 합니다. `;
                s += a.tellApart === '조흔색'
                    ? `조흔색이 ${a.A.name}은 ${a.A.streak}, ${a.B.name}은 ${a.B.streak}으로 달라 가루의 색으로 구별할 수 있습니다.`
                    : a.tellApart === '자성'
                        ? `${(a.A.magnetic ? a.A : a.B).name}만 자석에 붙으므로 자석으로 구별할 수 있습니다.`
                        : a.tellApart === '염산 반응'
                            ? `${(a.A.acid ? a.A : a.B).name}만 묽은 염산에서 거품이 나므로 그것으로 구별합니다.`
                            : `같은 광물이라 구별할 것이 없습니다.`;
            } else {
                const hard = a.verdict === 'a' ? a.A : a.B, soft = a.verdict === 'a' ? a.B : a.A;
                s += `굳기가 ${a.gap}만큼 큰 ${hard.name}이 ${soft.name}에 흠집을 냅니다. 반대로는 흠집이 나지 않습니다. `;
                s += `굳기가 다르면 이렇게 긁어 보는 것만으로도 어느 쪽이 단단한지 알 수 있습니다.`;
            }
            explanation.textContent = s;
            return;
        }
        labelA.textContent = '결정 크기'; labelB.textContent = '암석 이름';
        valueA.textContent = `${a.mm.toFixed(2)} mm`;
        valueB.textContent = a.name;
        predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        const fast = analyseRock(0, a.silica), slow = analyseRock(100, a.silica);
        explanation.textContent =
            `마그마가 ${timeText(a.days)} 동안 식었습니다. 그동안 결정이 ${a.mm.toFixed(2)} mm까지 자라 ${a.row.texture}이 되었습니다. ` +
            `${a.depthKm < 0.4 ? '지표로 흘러나온 용암은 금세 식어 결정이 자랄 틈이 없습니다. ' : `땅속 약 ${a.depthKm.toFixed(1)} km 에서는 둘레의 암석이 이불처럼 덮고 있어 아주 천천히 식습니다. `}` +
            `같은 성분이라도 ${timeText(fast.days)} 만에 식으면 ${fast.mm.toFixed(2)} mm인 ${fast.name}, ` +
            `${timeText(slow.days)} 동안 식으면 ${slow.mm.toFixed(2)} mm인 ${slow.name}이 됩니다. ` +
            `여기에 이산화규소 ${a.silica}%라는 성분이 더해져 ${a.silica < 52 ? '어두운' : a.silica < 63 ? '중간' : '밝은'} 색을 띠므로, 이 암석은 ${a.name}입니다.`;
    }

    function changed() {
        resultEmpty.hidden = false;
        resultContent.hidden = true;
        render();
    }

    modeButtons.forEach(button => button.addEventListener('click', () => {
        state.mode = button.dataset.mode;
        state.prediction = null;
        modeButtons.forEach(item => item.classList.toggle('selected', item === button));
        buildControls();
        buildPrediction();
        stageCaption.textContent = state.mode === 'mineral'
            ? '굳기가 큰 쪽이 작은 쪽에 흠집을 냅니다. 같으면 서로 긁지 못합니다.'
            : '확대한 화면에서 알갱이의 크기를 견주어 보세요.';
        changed();
    }));
    checkBtn.addEventListener('click', check);
    resetBtn.addEventListener('click', () => {
        Object.assign(state, { a: 'quartz', b: 'calcite', logT: 30, silica: 50, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'mineral').click();
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

    window.__rockModel = {
        MINERALS, ROCKS, K_CRYSTAL, N_CRYSTAL, FINE_MM, COARSE_MM, LOG_MIN, LOG_MAX, COOL_K, state,
        analyseMineral, analyseRock, analyse, daysFor, crystalFor, timeText, render, check,
        setMode(m) { modeButtons.find(b => b.dataset.mode === m).click(); },
        set(key, value) { state[key] = value; buildControls(); changed(); },
    };

    resetBtn.click();
});
