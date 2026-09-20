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

    /* --- 긴 설명은 그림 밖으로: 액자를 벗어나는 글자와 판정·주석은 HTML로 옮긴다 --- */
    const stageVerdict = document.getElementById('stageVerdict');
    const stageReadout = document.getElementById('stageReadout');
    const stageNote = document.getElementById('stageNote');
    const mainSvg = document.querySelector('.main-svg');
    const graphSvg = document.querySelector('.graph-svg');
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
        [[mainGroup, mainSvg], [graphGroup, graphSvg]].forEach(([g, svg]) => {
            if (!g || !svg) return;
            const vb = svg.viewBox.baseVal, W = vb.width, H = vb.height;
            [...g.querySelectorAll('text')].forEach(t => {
                const cls = t.getAttribute('class') || '';
                const must = /verdict-text|note-text/.test(cls) || /prose/.test(cls);
                let b; try { b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); } catch (e) { return; }
                const out = b.x < -0.5 || b.x + b.width > W + 0.5 || b.y + b.height > H + 0.5 || b.y < -0.5;
                if (must || out) takeOut(t);
            });
            const items = [...g.querySelectorAll('text')].map(t => { let b; try { b = window.scienceTextInkBox ? window.scienceTextInkBox(t) : t.getBBox(); } catch (e) { b = null; } return { t, b, len: t.textContent.trim().length }; }).filter(o => o.b);
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
        if (stageVerdict) stageVerdict.textContent = verdicts.join(' ');
        if (stageReadout) stageReadout.innerHTML = rows.map(r => `<span${r.fill ? ` style="color:${r.fill}"` : ''}>${r.txt}</span>`).join('');
        if (stageNote) stageNote.textContent = notes.join(' ');
    }

    /* -------------------------------------------------------------- data */
    const LEVELS = ['역', '계', '문', '강', '목', '과', '속', '종'];
    const HUMAN = ['진핵생물역', '동물계', '척삭동물문', '포유강', '영장목', '사람과', '사람속', '사람'];
    const HUMAN_WHY = ['세포에 핵막이 있음', '여러 세포로 되어 다른 생물을 먹음', '등 쪽에 척삭과 등뼈', '털이 있고 젖을 먹임', '손으로 쥐고 두 눈이 앞을 봄', '꼬리가 없고 뇌가 큼', '두 발로 서서 걷고 도구를 씀', 'Homo sapiens'];
    const ORGS = {
        chimp: { label: '침팬지', hint: '가장 가까운 친척', ranks: ['진핵생물역', '동물계', '척삭동물문', '포유강', '영장목', '사람과', '침팬지속', '침팬지'], split: 6, why: '네 발로도 걷고 두 발로도 걸음' },
        cat: { label: '고양이', hint: '젖먹이 동물', ranks: ['진핵생물역', '동물계', '척삭동물문', '포유강', '식육목', '고양이과', '고양이속', '고양이'], split: 4, why: '송곳니와 발톱으로 사냥함' },
        sparrow: { label: '참새', hint: '새', ranks: ['진핵생물역', '동물계', '척삭동물문', '조강', '참새목', '참새과', '참새속', '참새'], split: 3, why: '깃털이 있고 알을 낳음' },
        frog: { label: '개구리', hint: '양서류', ranks: ['진핵생물역', '동물계', '척삭동물문', '양서강', '개구리목', '개구리과', '참개구리속', '참개구리'], split: 3, why: '물에 알을 낳고 올챙이를 거침' },
        trout: { label: '송어', hint: '물고기', ranks: ['진핵생물역', '동물계', '척삭동물문', '조기어강', '연어목', '연어과', '연어속', '송어'], split: 3, why: '아가미로 숨 쉬고 지느러미가 있음' },
        pine: { label: '소나무', hint: '식물', ranks: ['진핵생물역', '식물계', '구과식물문', '구과식물강', '구과목', '소나무과', '소나무속', '소나무'], split: 1, why: '광합성으로 스스로 양분을 만듦' },
        mushroom: { label: '표고버섯', hint: '균류', ranks: ['진핵생물역', '균계', '담자균문', '주름버섯강', '주름버섯목', '솔밭버섯과', '표고속', '표고버섯'], split: 1, why: '양분을 몸 밖에서 분해해 흡수함' },
        ecoli: { label: '대장균', hint: '세균', ranks: ['세균역', '세균계', '프로테오박테리아문', '감마프로테오박테리아강', '장내세균목', '장내세균과', '에스케리키아속', '대장균'], split: 0, why: '핵막이 없음' },
    };
    // character tables and trees for the cladogram; a tree is nested arrays, tips are strings
    const SETS = {
        vert: { label: '척추동물', hint: '고양이와 견줌', ref: '고양이', taxa: ['송어', '개구리', '도마뱀', '참새', '고양이'], traits: [['척추', [1, 1, 1, 1, 1]], ['네 다리', [0, 1, 1, 1, 1]], ['양막 (마른 땅에 알)', [0, 0, 1, 1, 1]], ['깃털', [0, 0, 0, 1, 0]], ['털·젖먹임', [0, 0, 0, 0, 1]]], tree: ['송어', ['개구리', [['도마뱀', '참새'], '고양이']]], nodeNames: { '송어|개구리|도마뱀|참새|고양이': '척추', '개구리|도마뱀|참새|고양이': '네 다리', '도마뱀|참새|고양이': '양막', '도마뱀|참새': '조류·파충류 무리' }, pairs: [['참새', '개구리'], ['송어', '도마뱀'], ['참새', '도마뱀']] },
        plant: { label: '식물', hint: '소나무와 견줌', ref: '소나무', taxa: ['이끼', '고사리', '소나무', '벼', '장미'], traits: [['관다발', [0, 1, 1, 1, 1]], ['씨', [0, 0, 1, 1, 1]], ['꽃·열매', [0, 0, 0, 1, 1]], ['떡잎 두 장', [0, 0, 0, 0, 1]]], tree: ['이끼', ['고사리', ['소나무', ['벼', '장미']]]], nodeNames: { '이끼|고사리|소나무|벼|장미': '육상 식물', '고사리|소나무|벼|장미': '관다발', '소나무|벼|장미': '씨', '벼|장미': '꽃·열매' }, pairs: [['벼', '고사리'], ['이끼', '고사리'], ['벼', '장미']] },
        domain: { label: '세 역', hint: '효모와 견줌', ref: '효모', taxa: ['대장균', '고세균', '효모', '해파리', '사람'], traits: [['핵막', [0, 0, 1, 1, 1]], ['펩티도글리칸 세포벽', [1, 0, 0, 0, 0]], ['히스톤 단백질', [0, 1, 1, 1, 1]], ['여러 세포와 신경', [0, 0, 0, 1, 1]]], tree: ['대장균', ['고세균', ['효모', ['해파리', '사람']]]], nodeNames: { '대장균|고세균|효모|해파리|사람': '모든 생물의 공통 조상', '고세균|효모|해파리|사람': '히스톤·rRNA가 닮음', '효모|해파리|사람': '핵막 (진핵생물)', '해파리|사람': '여러 세포·신경 (동물)' }, pairs: [['고세균', '대장균'], ['대장균', '사람'], ['해파리', '사람']] },
    };
    // cytochrome c: amino-acid differences from human out of 104, and the divergence age from fossils (백만 년, 대략)
    const ORGS3 = { chimp: { label: '침팬지', hint: '차이 0', diff: 0, fossil: 6.5 }, rhesus: { label: '붉은털원숭이', hint: '차이 1', diff: 1, fossil: 25 }, dog: { label: '개', hint: '차이 11', diff: 11, fossil: 95 }, horse: { label: '말', hint: '차이 12', diff: 12, fossil: 95 }, chicken: { label: '닭', hint: '차이 13', diff: 13, fossil: 310 }, tuna: { label: '참치', hint: '차이 21', diff: 21, fossil: 430 }, fly: { label: '초파리', hint: '차이 29', diff: 29, fossil: 600 }, yeast: { label: '효모', hint: '차이 44', diff: 44, fossil: 1000 } };
    const CALS = { horse: { label: '말로 맞춤', hint: '12개 ↔ 9,500만 년', k: 95 / 12 }, rhesus: { label: '원숭이로 맞춤', hint: '1개 ↔ 2,500만 년', k: 25 }, chicken: { label: '닭으로 맞춤', hint: '13개 ↔ 3억 1천만 년', k: 310 / 13 } };
    const AA_TOTAL = 104;

    const state = { mode: 'rank', org: 'cat', set: 'vert', pair: 0, org3: 'horse', cal: 'horse', progress: 0, prediction: null };
    let running = false, frameId = 0, lastStamp = 0;

    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const ease = p => p < 0.5 ? 2 * p * p : 1 - (1 - p) * (1 - p) * 2;
    const fmtN = (n, d = 0) => (+n.toFixed(d)).toLocaleString('ko-KR', { minimumFractionDigits: d, maximumFractionDigits: d }).replace('-', '−');
    const rnd = i => (((i * 7919 + 13) * 104729) % 100003) / 100003;
    const jong = s => { const c = s.charCodeAt(s.length - 1); return c >= 0xac00 && c <= 0xd7a3 ? (c - 0xac00) % 28 : 0; };
    const eun = s => jong(s) ? '은' : '는', iga = s => jong(s) ? '이' : '가', wa = s => jong(s) ? '과' : '와', eul = s => jong(s) ? '을' : '를';
    const myr = m => m <= 0 ? '0' : m >= 100 ? `${fmtN(m / 100, Number.isInteger(+(m / 100).toFixed(1)) ? 0 : 1)}억 년` : `${fmtN(m * 100)}만 년`;

    /* ------------------------------------------------------------ models */
    function rankModel() {
        const o = ORGS[state.org], shared = o.split; // number of ranks shared with humans
        return { kind: 'rank', o, shared, verdict: shared >= 5 ? 'close' : shared >= 3 ? 'mid' : 'far' };
    }
    const tips = t => typeof t === 'string' ? [t] : t.flatMap(tips);
    // depth of the smallest subtree that holds both names (root = 0)
    function mrcaDepth(tree, a, b, depth = 0) {
        if (typeof tree === 'string') return depth;
        for (const child of tree) { const ts = tips(child); if (ts.includes(a) && ts.includes(b)) return mrcaDepth(child, a, b, depth + 1); }
        return depth;
    }
    function treeModel() {
        const st = SETS[state.set], pair = st.pairs[clamp(state.pair, 0, st.pairs.length - 1)], [A, B] = pair;
        const dA = mrcaDepth(st.tree, st.ref, A), dB = mrcaDepth(st.tree, st.ref, B);
        return { kind: 'tree', st, A, B, dA, dB, verdict: dA > dB ? 'first' : dB > dA ? 'second' : 'equal' };
    }
    function clockModel() {
        const o = ORGS3[state.org3], cal = CALS[state.cal], est = o.diff * cal.k;
        return { kind: 'clock', o, cal, est, verdict: est < 10 ? 'recent' : est < 100 ? 'mid' : 'old' };
    }
    function analyse() {
        if (state.mode === 'rank') return rankModel();
        if (state.mode === 'tree') return treeModel();
        return clockModel();
    }
    const runSeconds = () => 6;

    /* ---------------------------------------------------------- controls */
    function pickRow(legend, name, options, current, cols) {
        return `<fieldset class="pick-field"><legend>${legend}</legend>` +
            `<div class="pick-buttons cols${cols}" data-pick="${name}">` +
            options.map(o => `<button type="button" data-value="${o.value}" class="${o.value === String(current) ? 'selected' : ''}">` +
                `${o.label}${o.hint ? `<small>${o.hint}</small>` : ''}</button>`).join('') +
            `</div></fieldset>`;
    }
    const opts = table => Object.entries(table).map(([k, v]) => ({ value: k, label: v.label, hint: v.hint }));

    function buildControls() {
        if (state.mode === 'rank') controlArea.innerHTML = pickRow('사람과 견줄 생물', 'org', opts(ORGS), state.org, 4);
        else if (state.mode === 'tree') {
            const st = SETS[state.set];
            controlArea.innerHTML = pickRow('생물 묶음', 'set', opts(SETS), state.set, 3) + pickRow(`${st.ref}${wa(st.ref)} 견줄 짝`, 'pair', st.pairs.map((pr, i) => ({ value: String(i), label: `${pr[0]} · ${pr[1]}`, hint: '' })), state.pair, 3);
        } else controlArea.innerHTML = pickRow('사람과 견줄 생물 (사이토크롬 c)', 'org3', opts(ORGS3), state.org3, 4) + pickRow('시계 눈금 맞추기', 'cal', opts(CALS), state.cal, 3);
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                const key = group.dataset.pick, val = button.dataset.value;
                state[key] = key === 'pair' ? Number(val) : val;
                if (key === 'set') { state.pair = 0; buildControls(); }
                else group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                buildPrediction();
                settingsChanged();
            }));
        });
    }

    const PRED_R = [{ value: 'close', label: '목 이상까지 같음' }, { value: 'mid', label: '문·강까지 같음' }, { value: 'far', label: '계부터 다름' }];
    const PRED_C = [{ value: 'recent', label: '1천만 년 안' }, { value: 'mid', label: '1천만~1억 년' }, { value: 'old', label: '1억 년 넘게' }];

    function buildPrediction() {
        let list;
        if (state.mode === 'rank') { list = PRED_R; predictionLegend.textContent = `${ORGS[state.org].label}${eun(ORGS[state.org].label)} 사람과 어느 단계까지 같은 무리일까요?`; }
        else if (state.mode === 'tree') { const a = treeModel(); list = [{ value: 'first', label: a.A }, { value: 'second', label: a.B }, { value: 'equal', label: '똑같이 가까움' }]; predictionLegend.textContent = `${a.st.ref}에 더 가까운 친척은 ${a.A}${wa(a.A)} ${a.B} 가운데 누구일까요?`; }
        else { list = PRED_C; predictionLegend.textContent = `사람과 ${ORGS3[state.org3].label}${iga(ORGS3[state.org3].label)} 갈라진 때는 언제일까요? (${CALS[state.cal].label})`; }
        predictionArea.className = 'prediction-buttons three';
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction;
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    function renderRank(a) {
        const p = state.progress, { o, shared } = a, shown = Math.min(8, Math.floor(p * 8 + 1e-9) + (p >= 1 ? 0 : 1));
        const Y0 = 34, DY = 20, LX = 22, LW = 190, RX = 248, RW = 192, SX = 118, SW = 224;
        let out = `<text class="small-label" x="${LX}" y="28">사람</text><text class="small-label" x="${RX + RW}" y="28" text-anchor="end">${o.label}</text>`;
        for (let i = 0; i < 8; i += 1) {
            const y = Y0 + i * DY, vis = p === 0 || i < shown;
            if (!vis) { out += `<text class="rank-name" x="10" y="${y + 13}">${LEVELS[i]}</text>`; continue; }
            out += `<text class="rank-name" x="10" y="${y + 13}">${LEVELS[i]}</text>`;
            if (i < shared) {
                out += `<rect class="rank-box shared" x="${SX}" y="${y}" width="${SW}" height="17" rx="3"/><text class="rank-text" x="${SX + SW / 2}" y="${y + 12}" text-anchor="middle">${HUMAN[i]} — ${HUMAN_WHY[i]}</text>`;
                if (i < 7 && i + 1 < shared) out += `<line class="ladder-line" x1="${SX + SW / 2}" y1="${y + 17}" x2="${SX + SW / 2}" y2="${y + DY}"/>`;
                else if (i + 1 === shared && (shown > i + 1 || p >= 1)) out += `<line class="fork-line" x1="${SX + SW / 2}" y1="${y + 17}" x2="${LX + LW / 2}" y2="${y + DY}"/><line class="fork-line" x1="${SX + SW / 2}" y1="${y + 17}" x2="${RX + RW / 2}" y2="${y + DY}"/>`;
            } else {
                out += `<rect class="rank-box human" x="${LX}" y="${y}" width="${LW}" height="17" rx="3"/><text class="rank-text" x="${LX + LW / 2}" y="${y + 12}" text-anchor="middle">${HUMAN[i]}${i === shared ? ` — ${HUMAN_WHY[i]}` : ''}</text>`;
                out += `<rect class="rank-box other" x="${RX}" y="${y}" width="${RW}" height="17" rx="3"/><text class="rank-text" x="${RX + RW / 2}" y="${y + 12}" text-anchor="middle">${o.ranks[i]}${i === shared ? ` — ${o.why}` : ''}</text>`;
                if (i < 7) out += `<line class="ladder-line" x1="${LX + LW / 2}" y1="${y + 17}" x2="${LX + LW / 2}" y2="${y + DY}"/><line class="ladder-line" x1="${RX + RW / 2}" y1="${y + 17}" x2="${RX + RW / 2}" y2="${y + DY}"/>`;
            }
        }
        const VERD = { close: '목 이상까지 같음', mid: '문·강까지 같음', far: '계부터 다름' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${p >= 1 ? `${o.label}: ${shared === 0 ? '역부터 다름' : `${LEVELS[shared - 1]}까지 같음`} — ${VERD[a.verdict]}` : `사람과 ${o.label} · ${LEVELS[Math.max(0, Math.min(7, shown - 1))]}까지 내려옴`}</text>`;
        out += `<text class="note-text" x="20" y="208">초록 = 같은 무리, 노랑 = 사람 쪽, 주황 = ${o.label} 쪽. 학명은 속명 + 종소명 (사람 Homo sapiens)</text>`;
        return out;
    }

    function graphRank(a) {
        const keys = Object.keys(ORGS), X0 = 66, X1 = 420, Y0 = 150, Y1 = 40, bw = (X1 - X0) / keys.length, yOf = n => Y0 - n / 7 * (Y0 - Y1);
        let out = `<text class="axis-title" x="20" y="18">사람과 같은 분류 단계의 수 — 많을수록 가까운 친척</text>`;
        [0, 1, 3, 5, 7].forEach(n => { out += `<line class="grid-line" x1="${X0}" y1="${yOf(n).toFixed(1)}" x2="${X1}" y2="${yOf(n).toFixed(1)}"/><text class="axis-text" x="${X0 - 5}" y="${(yOf(n) + 3.5).toFixed(1)}" text-anchor="end">${n === 0 ? '0' : `${LEVELS[n - 1]}까지`}</text>`; });
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/>`;
        keys.forEach((k, i) => {
            const o = ORGS[k], x = X0 + bw * i + bw * 0.2, w = bw * 0.6, on = k === state.org;
            out += `<rect fill="${on ? 'rgba(217, 119, 6, .6)' : 'rgba(84,230,193,.4)'}" x="${x.toFixed(1)}" y="${yOf(o.split).toFixed(1)}" width="${w.toFixed(1)}" height="${Math.max(1, Y0 - yOf(o.split)).toFixed(1)}" rx="2"/>`;
            out += `<text class="axis-text" style="${on ? 'fill:#d97706' : ''}" x="${(x + w / 2).toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${o.label}</text>`;
            out += `<text class="small-label" x="${(x + w / 2).toFixed(1)}" y="${(yOf(o.split) - 5).toFixed(1)}" text-anchor="middle">${o.split}</text>`;
        });
        out += `<text class="axis-title" x="${(X0 + X1) / 2}" y="${Y0 + 30}" text-anchor="middle">침팬지는 과까지 같고, 소나무·버섯은 역만 같으며, 대장균은 역부터 다릅니다</text>`;
        return out;
    }

    // rectangular cladogram: tips along the top, root at the bottom
    function layoutTree(tree) {
        const nodes = [], order = tips(tree), X0 = 40, X1 = 420, TY = 44, RY = 172;
        let maxDepth = 0;
        const walk = (t, depth) => {
            if (typeof t === 'string') { const i = order.indexOf(t); const n = { tip: t, x: X0 + i / (order.length - 1) * (X1 - X0), y: TY, depth, tips: [t] }; nodes.push(n); return n; }
            const kids = t.map(c => walk(c, depth + 1)); maxDepth = Math.max(maxDepth, depth);
            const n = { kids, x: kids.reduce((s, k) => s + k.x, 0) / kids.length, depth, tips: t.flatMap(tips) }; nodes.push(n); return n;
        };
        const root = walk(tree, 0);
        nodes.forEach(n => { if (!n.tip) n.y = RY - (maxDepth - n.depth) * ((RY - TY - 26) / Math.max(1, maxDepth)); });
        return { root, nodes, maxDepth };
    }
    function renderTree(a) {
        const p = state.progress, { st, A, B } = a, L = layoutTree(st.tree), inner = L.nodes.filter(n => !n.tip).sort((u, v) => v.depth - u.depth);
        const shown = p === 0 ? 0 : Math.min(inner.length, Math.floor(p * inner.length + 1e-9) + (p >= 1 ? 0 : 1));
        const mA = L.nodes.find(n => !n.tip && n.tips.includes(st.ref) && n.tips.includes(A) && n.depth === a.dA), mB = L.nodes.find(n => !n.tip && n.tips.includes(st.ref) && n.tips.includes(B) && n.depth === a.dB);
        let out = '';
        inner.forEach((n, i) => {
            const vis = i < shown;
            n.kids.forEach(k => { out += `<path class="branch${vis ? '' : ' dim'}" d="M${k.x.toFixed(1)},${k.y.toFixed(1)} L${k.x.toFixed(1)},${n.y.toFixed(1)} L${n.x.toFixed(1)},${n.y.toFixed(1)}"/>`; });
            const on = p >= 1 && (n === mA || n === mB);
            out += `<circle class="node-dot${on ? ' on' : ''}" cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${on ? 5 : 3.5}"/>`;
            const name = st.nodeNames[n.tips.join('|')];
            if (vis && name) out += `<text class="node-text" x="${(n.x + 8).toFixed(1)}" y="${(n.y + 3.5).toFixed(1)}">${name}</text>`;
        });
        L.nodes.filter(n => n.tip).forEach(n => {
            const role = n.tip === st.ref ? 'ref-tip' : n.tip === A ? 'a-tip' : n.tip === B ? 'b-tip' : '';
            out += `<circle class="${role || 'node-dot'}" cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${role ? 5 : 3}"/><text class="tip-text" style="${role === 'ref-tip' ? 'fill:#d97706' : role === 'a-tip' ? 'fill:#059669' : role === 'b-tip' ? 'fill:#dc2626' : ''}" x="${n.x.toFixed(1)}" y="${(n.y - 10).toFixed(1)}" text-anchor="middle">${n.tip}${n.tip === st.ref ? ' (기준)' : ''}</text>`;
        });
        const cnt = { first: A, second: B, equal: '똑같이 가까움' };
        out += `<text class="small-label" x="20" y="192">묶는 차례: ${inner.map(n => st.nodeNames[n.tips.join('|')] || n.tips.join('·')).slice(0, shown).join(' → ') || '아직 시작 전'}</text>`;
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${p >= 1 ? `${st.ref}에 더 가까운 것: ${cnt[a.verdict]} (공통 조상 마디 깊이 ${A} ${a.dA} · ${B} ${a.dB})` : `${st.label} 계통수 · 공유 형질이 많은 것부터 묶는 중`}</text>`;
        out += `<text class="note-text" x="20" y="208">가지는 마디를 축으로 돌려도 같은 나무. 가까움은 그림의 거리가 아니라 공통 조상 마디의 깊이로 읽습니다</text>`;
        return out;
    }

    function graphTree(a) {
        const { st } = a, X0 = 150, cw = (430 - X0) / st.taxa.length, rh = 22, Y0 = 44;
        let out = `<text class="axis-title" x="20" y="18">형질표 — ✓ 있음 · 새 형질을 함께 가진 무리끼리 묶습니다 (${st.label})</text>`;
        st.taxa.forEach((t, j) => { out += `<text class="grid-text" style="${t === st.ref ? 'fill:#d97706' : t === a.A ? 'fill:#059669' : t === a.B ? 'fill:#dc2626' : ''}" x="${(X0 + cw * j + cw / 2).toFixed(1)}" y="${Y0 - 8}" text-anchor="middle">${t}</text>`; });
        st.traits.forEach(([name, row], i) => {
            const y = Y0 + i * rh;
            out += `<text class="grid-text" x="${X0 - 8}" y="${y + 15}" text-anchor="end">${name}</text>`;
            row.forEach((v, j) => { const x = X0 + cw * j + 3; out += `<rect class="${v ? 'cell-yes' : 'cell-no'}" x="${x.toFixed(1)}" y="${y + 2}" width="${(cw - 6).toFixed(1)}" height="${rh - 4}" rx="3"/>`; if (v) out += `<text class="cell-text" x="${(x + (cw - 6) / 2).toFixed(1)}" y="${y + 15}" text-anchor="middle">✓</text>`; });
        });
        out += `<text class="small-label" x="20" y="${Y0 + st.traits.length * rh + 22}">${st.set === 'domain' ? '' : ''}${state.set === 'domain' ? '고세균이 진핵생물에 가까운 것은 리보솜 RNA 서열 비교로 밝혀졌습니다' : '한 무리만 가진 새 형질(공유 파생 형질)이 가지를 정합니다'}</text>`;
        return out;
    }

    function renderClock(a) {
        const p = state.progress, { o, cal, est } = a, cols = 52, cell = 7, SX = 20, SY1 = 44, SY2 = 92;
        const diffPos = new Set(); { let i = 0; while (diffPos.size < o.diff) { diffPos.add(Math.floor(rnd(i + 7) * AA_TOTAL)); i += 1; } }
        const shownDiff = Math.floor(o.diff * ease(p) + 1e-9), order = [...diffPos].sort((u, v) => u - v).slice(0, shownDiff), showSet = new Set(order);
        let out = `<text class="small-label" x="${SX}" y="${SY1 - 8}">사람의 사이토크롬 c (아미노산 ${AA_TOTAL}개)</text><text class="small-label" x="${SX}" y="${SY2 - 8}">${o.label}의 사이토크롬 c — 붉은 칸이 다른 자리</text>`;
        for (let i = 0; i < AA_TOTAL; i += 1) {
            const cx = SX + (i % cols) * (cell + 1), r1 = SY1 + Math.floor(i / cols) * (cell + 1), r2 = SY2 + Math.floor(i / cols) * (cell + 1);
            out += `<rect class="aa" x="${cx}" y="${r1}" width="${cell}" height="${cell}"/><rect class="aa ${showSet.has(i) ? 'diff' : 'same'}" x="${cx}" y="${r2}" width="${cell}" height="${cell}"/>`;
        }
        // clock: one full turn = 200 million years on the dial
        const CX = 78, CY = 152, R = 24, tNow = est * ease(p), ang = t => (t / 200) * 2 * Math.PI;
        out += `<circle class="clock-face" cx="${CX}" cy="${CY}" r="${R}"/>`;
        for (let k = 0; k < 8; k += 1) out += `<line class="ladder-line" x1="${(CX + (R - 3) * Math.sin(k * Math.PI / 4)).toFixed(1)}" y1="${(CY - (R - 3) * Math.cos(k * Math.PI / 4)).toFixed(1)}" x2="${(CX + R * Math.sin(k * Math.PI / 4)).toFixed(1)}" y2="${(CY - R * Math.cos(k * Math.PI / 4)).toFixed(1)}"/>`;
        out += `<line class="clock-fossil" x1="${CX}" y1="${CY}" x2="${(CX + (R - 4) * Math.sin(ang(o.fossil))).toFixed(1)}" y2="${(CY - (R - 4) * Math.cos(ang(o.fossil))).toFixed(1)}"/>`;
        out += `<line class="clock-hand" x1="${CX}" y1="${CY}" x2="${(CX + (R - 6) * Math.sin(ang(tNow))).toFixed(1)}" y2="${(CY - (R - 6) * Math.cos(ang(tNow))).toFixed(1)}"/>`;
        out += `<text class="small-label" x="${CX}" y="${CY + R + 14}" text-anchor="middle">한 바퀴 = 2억 년</text>`;
        const TX = 130;
        out += `<text class="trait-text" x="${TX}" y="132">다른 자리 ${shownDiff}개 / ${AA_TOTAL}개 (모두 ${o.diff}개)</text>`;
        out += `<text class="trait-text" x="${TX}" y="150">눈금: ${cal.label} → 한 차이당 ${fmtN(cal.k * 100)}만 년</text>`;
        out += `<text class="gen-text" style="fill:#d97706" x="${TX}" y="172">어림 ${o.diff} × ${fmtN(cal.k * 100)}만 년 = ${est > 0 ? myr(est) : '0'}</text>`;
        out += `<text class="trait-text" style="fill:#0284c7" x="${TX}" y="192">화석 기록: 약 ${myr(o.fossil)} (파란 바늘)</text>`;
        const VERD = { recent: '1천만 년 안', mid: '1천만~1억 년', old: '1억 년 넘게' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${p >= 1 ? `사람–${o.label}: 차이 ${o.diff}개 → 어림 ${est > 0 ? myr(est) : '0'} — ${VERD[a.verdict]}` : `사람–${o.label} 사이토크롬 c 견주는 중`}</text>`;
        out += `<text class="note-text" x="20" y="208">다른 자리는 보기 위해 임의 배치 · 차이 수와 화석 연대는 교과서 값(대략) · 눈금은 화석으로 아는 갈래로 맞춤</text>`;
        return out;
    }

    function graphClock(a) {
        const X0 = 66, X1 = 420, Y0 = 150, Y1 = 40, TM = 1050, DM = 50, xOf = t => X0 + t / TM * (X1 - X0), yOf = d => Y0 - d / DM * (Y0 - Y1);
        let out = `<text class="axis-title" x="20" y="18">화석 연대와 아미노산 차이 — 노란 선이 지금 눈금의 시계, 점이 실제 생물</text>`;
        [0, 200, 400, 600, 800, 1000].forEach(t => { out += `<line class="grid-line" x1="${xOf(t).toFixed(1)}" y1="${Y1}" x2="${xOf(t).toFixed(1)}" y2="${Y0}"/><text class="axis-text" x="${xOf(t).toFixed(1)}" y="${Y0 + 14}" text-anchor="${t === 0 ? 'start' : 'middle'}">${t === 0 ? '0' : myr(t)}</text>`; });
        [0, 10, 20, 30, 40, 50].forEach(d => { out += `<line class="grid-line" x1="${X0}" y1="${yOf(d).toFixed(1)}" x2="${X1}" y2="${yOf(d).toFixed(1)}"/><text class="axis-text" x="${X0 - 5}" y="${(yOf(d) + 3.5).toFixed(1)}" text-anchor="end">${d}개</text>`; });
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        const tEnd = Math.min(TM, DM * a.cal.k);
        out += `<line class="clock-line" x1="${X0}" y1="${Y0}" x2="${xOf(tEnd).toFixed(1)}" y2="${yOf(tEnd / a.cal.k).toFixed(1)}"/>`;
        Object.entries(ORGS3).forEach(([k, o], i) => {
            const on = k === state.org3;
            out += `<circle fill="${on ? '#d97706' : '#0284c7'}" stroke="${on ? '#fff' : 'none'}" cx="${xOf(o.fossil).toFixed(1)}" cy="${yOf(o.diff).toFixed(1)}" r="${on ? 5 : 3.5}"/>`;
            out += `<text class="small-label" style="${on ? 'fill:#d97706' : ''}" x="${(xOf(o.fossil) + (o.fossil > 900 ? -7 : 7)).toFixed(1)}" y="${(yOf(o.diff) - [6, 19, 32, 45][i % 4]).toFixed(1)}" text-anchor="${o.fossil > 900 ? 'end' : 'start'}">${o.label}</text>`;
        });
        out += `<text class="axis-title" x="${(X0 + X1) / 2}" y="${Y0 + 30}" text-anchor="middle">갈라진 때(화석) — 오래된 갈래일수록 점이 선 아래로 처집니다 (같은 자리가 되풀이 바뀜)</text>`;
        return out;
    }

    function noteFor(a) {
        if (a.kind === 'rank') {
            return `<div class="data-row"><span class="data-name">사람</span><span class="data-val">${HUMAN.join(' › ')}</span></div>` +
                `<div class="data-row"><span class="data-name">${a.o.label}</span><span class="data-val">${a.o.ranks.join(' › ')}</span></div>` +
                `<div class="data-row"><span class="data-name">갈라지는 단계</span><span class="data-val">${a.shared === 0 ? '역부터 다름 (사람은 진핵생물역, 대장균은 세균역)' : `${LEVELS[a.shared - 1]}까지 같고 ${LEVELS[a.shared]}에서 갈라짐 — 사람 ${HUMAN[a.shared]}(${HUMAN_WHY[a.shared]}) / ${a.o.label} ${a.o.ranks[a.shared]}(${a.o.why})`}</span></div>` +
                `<div class="data-row match"><span class="data-name">판정</span><span class="data-val">${{ close: '목 이상까지 같음', mid: '문·강까지 같음', far: '계부터 다름' }[a.verdict]}</span></div>`;
        }
        if (a.kind === 'tree') {
            const { st, A, B } = a;
            return `<div class="data-row"><span class="data-name">묶음</span><span class="data-val">${st.taxa.join(' · ')} — 기준 ${st.ref}</span></div>` +
                `<div class="data-row"><span class="data-name">공통 조상</span><span class="data-val">${st.ref}${wa(st.ref)} ${A}: 마디 깊이 ${a.dA} / ${st.ref}${wa(st.ref)} ${B}: 마디 깊이 ${a.dB} (뿌리 0, 깊을수록 최근)</span></div>` +
                `<div class="data-row"><span class="data-name">읽기</span><span class="data-val">${a.verdict === 'equal' ? `${A}${wa(A)} ${B}${eun(B)} 같은 마디에서 ${st.ref}${wa(st.ref)} 갈라져 똑같이 가까움` : `${a.verdict === 'first' ? A : B}${iga(a.verdict === 'first' ? A : B)} ${st.ref}${wa(st.ref)} 더 최근에 갈라졌음`}</span></div>` +
                `<div class="data-row match"><span class="data-name">판정</span><span class="data-val">${a.verdict === 'equal' ? '똑같이 가까움' : a.verdict === 'first' ? A : B}</span></div>`;
        }
        return `<div class="data-row"><span class="data-name">차이</span><span class="data-val">사람과 ${a.o.label}의 사이토크롬 c 아미노산 ${AA_TOTAL}개 가운데 ${a.o.diff}개가 다름</span></div>` +
            `<div class="data-row"><span class="data-name">눈금</span><span class="data-val">${a.cal.label}: ${a.cal.hint} → 한 차이당 ${fmtN(a.cal.k * 100)}만 년</span></div>` +
            `<div class="data-row"><span class="data-name">어림 vs 화석</span><span class="data-val">${a.o.diff} × ${fmtN(a.cal.k * 100)}만 년 = ${a.est > 0 ? myr(a.est) : '0'} / 화석 기록 약 ${myr(a.o.fossil)}</span></div>` +
            `<div class="data-row match"><span class="data-name">판정</span><span class="data-val">${{ recent: '1천만 년 안', mid: '1천만~1억 년', old: '1억 년 넘게' }[a.verdict]}</span></div>`;
    }

    function render() {
        const a = analyse();
        mainGroup.innerHTML = a.kind === 'rank' ? renderRank(a) : a.kind === 'tree' ? renderTree(a) : renderClock(a);
        graphGroup.innerHTML = a.kind === 'rank' ? graphRank(a) : a.kind === 'tree' ? graphTree(a) : graphClock(a);
        liftProse();
        stageBadge.textContent = a.kind === 'rank' ? `사람 · ${a.o.label}` : a.kind === 'tree' ? `${a.st.label} · ${a.A} vs ${a.B}`.replace(' vs ', ' · ') : `사람 · ${a.o.label} · ${a.cal.label}`;
        methodHint.textContent = a.kind === 'rank' ? '같은 단계를 오래 나눌수록 가까운 친척입니다'
            : a.kind === 'tree' ? '가까움은 겉모습이 아니라 공통 조상이 얼마나 최근인가로 읽습니다'
                : '차이는 시간에 비례해 쌓이지만, 눈금은 화석으로 맞춰야 합니다';
        dataNote.innerHTML = noteFor(a);
        return a;
    }

    /* --------------------------------------------------------------- run */
    function tick(dt) {
        state.progress = Math.min(1, state.progress + dt / runSeconds());
        render();
        return state.progress >= 1;
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
        state.progress = 0;
        running = true;
        lastStamp = performance.now();
        render();
        frameId = requestAnimationFrame(frame);
    }

    function finish() {
        const a = render();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        let s = '';
        if (a.kind === 'rank') {
            const { o, shared } = a;
            labelA.textContent = '같은 단계'; valueA.textContent = shared === 0 ? '없음' : `${LEVELS[shared - 1]}까지 (${shared}단계)`;
            labelB.textContent = '갈라지는 단계'; valueB.textContent = LEVELS[shared];
            s = `사람은 ${HUMAN.join('·')}입니다. ${o.label}${eun(o.label)} ${o.ranks.join('·')}이고, `;
            if (shared === 0) s += `첫 단계인 역부터 다릅니다. 대장균은 핵막이 없는 세균역이라, 핵막이 있는 진핵생물역의 사람과는 가장 큰 무리에서 이미 갈라진 아주 먼 관계입니다.`;
            else s += `${LEVELS[shared - 1]}까지는 사람과 같은 무리이지만 ${LEVELS[shared]}에서 갈라집니다. 사람은 ${HUMAN[shared]}(${HUMAN_WHY[shared]}), ${o.label}${eun(o.label)} ${o.ranks[shared]}(${o.why})입니다. `;
            if (a.verdict === 'close') s += `과까지 같으니 지구의 생물 가운데 가장 가까운 친척이고, 약 600만~700만 년 전에 공통 조상에서 갈라졌습니다.`;
            else if (a.verdict === 'mid') s += shared === 4 ? `강까지 같으니 털과 젖으로 새끼를 기르는 같은 포유류이고, 목에서 갈라진 친척입니다.` : `문까지 같으니 등뼈를 가진 같은 척삭동물이지만, 강에서 갈라져 젖을 먹이는 포유류와는 다른 무리입니다.`;
            else if (shared > 0) s += `역만 같으니 핵이 있는 세포로 되어 있다는 점만 같고, 계부터 다른 먼 관계입니다.`;
        } else if (a.kind === 'tree') {
            const { st, A, B } = a, win = a.verdict === 'first' ? A : B, lose = a.verdict === 'first' ? B : A;
            labelA.textContent = `${st.ref}에 더 가까운 것`; valueA.textContent = a.verdict === 'equal' ? '똑같이 가까움' : win;
            labelB.textContent = '공통 조상 마디'; valueB.textContent = `${A} ${a.dA} · ${B} ${a.dB}`;
            s = `형질표에서 새 형질을 함께 가진 무리끼리 묶으면 ${st.taxa.join('·')}의 계통수가 그려집니다. ${st.ref}${wa(st.ref)} ${A}${iga(A)} 마지막으로 함께 있는 마디는 깊이 ${a.dA}, ${st.ref}${wa(st.ref)} ${B}${eun(B)} 깊이 ${a.dB}입니다. `;
            if (a.verdict === 'equal') s += `두 마디가 같으니 ${A}${wa(A)} ${B}${eun(B)} ${st.ref}에게 똑같이 먼 친척입니다. ${state.set === 'vert' ? '새와 도마뱀은 서로 가장 가까운 짝이고, 그 둘이 함께 고양이와 갈라졌기 때문입니다. 겉모습이 다르다고 새를 더 멀리 두면 안 됩니다.' : state.set === 'plant' ? '벼와 장미는 둘 다 꽃 피는 식물로 서로 가장 가까운 짝이고, 함께 소나무와 갈라졌기 때문입니다.' : '해파리와 사람은 함께 동물 무리를 이루어 효모와 갈라졌으므로, 효모가 보기에는 둘이 똑같이 먼 친척입니다.'}`;
            else s += `${win}${iga(win)} 더 최근의 공통 조상을 나누니 ${st.ref}에 더 가까운 친척입니다. ${state.set === 'domain' && win === '고세균' ? '고세균은 핵이 없어 세균처럼 보이지만 리보솜 RNA와 히스톤 단백질이 진핵생물과 닮아, 세균보다 진핵생물 쪽에 섭니다.' : state.set === 'domain' ? `${lose}${eun(lose)} 가장 먼저 갈라진 세균입니다. 핵막·히스톤·여러 세포처럼 새로 생긴 형질을 누가 함께 가졌는지가 가지를 정합니다.` : state.set === 'vert' ? `${lose}${eun(lose)} 그보다 앞선 마디에서 갈라져 ${win}보다 먼 친척입니다. 가까움은 그림에서의 거리가 아니라 마디로 읽습니다.` : `${lose}${eun(lose)} 그보다 앞선 마디에서 갈라졌습니다. 관다발·씨·꽃처럼 새로 생긴 형질을 누가 함께 가졌는지가 가지를 정합니다.`}`;
        } else {
            const { o, cal, est } = a;
            labelA.textContent = '어림한 때'; valueA.textContent = est > 0 ? myr(est) : '0 (차이 없음)';
            labelB.textContent = '화석 기록'; valueB.textContent = `약 ${myr(o.fossil)}`;
            s = `사람과 ${o.label}의 사이토크롬 c는 아미노산 ${AA_TOTAL}개 가운데 ${o.diff}개가 다릅니다. ${cal.hint}으로 눈금을 맞추면 한 차이가 ${fmtN(cal.k * 100)}만 년이므로 ${est > 0 ? `두 생물은 약 ${myr(est)} 전에 갈라진 것으로 어림됩니다. ` : '어림값은 0이 됩니다. '}`;
            const ratio = o.fossil > 0 ? est / o.fossil : 0;
            if (o.diff === 0) s += `차이가 없어 시계로는 0이 나오지만 화석과 다른 유전자로는 600만~700만 년 전입니다. 사이토크롬 c는 아주 천천히 바뀌는 단백질이라 이렇게 가까운 갈래를 재기에는 눈금이 너무 성깁니다.`;
            else if (ratio > 0.6 && ratio < 1.6) s += `화석 기록 약 ${myr(o.fossil)}과 잘 맞습니다. 눈금을 맞춘 갈래와 비슷한 시기라 시계가 잘 듣는 범위입니다.`;
            else if (ratio <= 0.6 && o.diff <= 2) s += `화석 기록 약 ${myr(o.fossil)}보다 짧게 나옵니다. 차이가 한두 개뿐이라 우연에 크게 흔들리는 범위이고, 사이토크롬 c처럼 느린 시계는 이렇게 가까운 갈래에는 맞지 않습니다.`;
            else if (ratio <= 0.6) s += `화석 기록 약 ${myr(o.fossil)}보다 훨씬 짧게 나옵니다. 오래된 갈래에서는 같은 자리가 여러 번 바뀌어 차이가 시간만큼 늘지 못하기 때문에, 시계가 실제보다 젊게 읽습니다.`;
            else s += `화석 기록 약 ${myr(o.fossil)}보다 길게 나옵니다. 눈금을 맞춘 갈래(${cal.label})가 이 갈래와 빠르기가 달라서이고, 분자 시계는 어느 갈래로 맞추느냐에 따라 값이 달라지는 어림임을 보여 줍니다.`;
        }
        predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        explanation.textContent = s;
    }

    function settingsChanged() {
        stopRun();
        state.progress = 0;
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
        checkBtn.textContent = state.mode === 'rank' ? '사다리 내려가기' : state.mode === 'tree' ? '가지 묶기' : '시계 돌리기';
        stageCaption.textContent = state.mode === 'rank' ? '역에서 종까지 여덟 단계를 내려갑니다. 초록 칸은 사람과 같은 무리, 갈라진 뒤에는 왼쪽이 사람, 오른쪽이 고른 생물입니다.'
            : state.mode === 'tree' ? '형질표에서 새 형질을 함께 가진 무리부터 차례로 묶어 계통수를 그립니다. 노란 점이 기준 생물, 초록과 주황이 견주는 두 생물, 노란 마디가 공통 조상입니다.'
                : '위 띠가 사람, 아래 띠가 고른 생물의 사이토크롬 c입니다. 붉은 칸이 다른 자리이고, 시계 바늘이 어림한 때, 파란 점선 바늘이 화석 기록입니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { org: 'cat', set: 'vert', pair: 0, org3: 'horse', cal: 'horse', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'rank').click();
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

    window.__phyloModel = {
        ORGS, SETS, ORGS3, CALS, state,
        analyse, render, runSeconds,
        setMode(m) { modeButtons.find(b => b.dataset.mode === m).click(); },
        set(key, value) { state[key] = key === 'pair' ? Number(value) : value; buildControls(); buildPrediction(); settingsChanged(); },
        setProgress(p) { stopRun(); state.progress = p; render(); },
        runToEnd(dt = 0.25, cap = 5000) {
            stopRun(); state.progress = 0;
            let steps = 0;
            while (!tick(dt) && steps < cap) steps += 1;
            finish();
            return { steps, progress: state.progress };
        },
        tick, finish,
    };

    resetBtn.click();
});
