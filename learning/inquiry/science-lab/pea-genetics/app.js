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
    const valueA = document.getElementById('valueA');
    const valueB = document.getElementById('valueB');
    const predictionResult = document.getElementById('predictionResult');
    const explanation = document.getElementById('elementaryExplanation');
    const stageCaption = document.getElementById('stageCaption');
    const stageBadge = document.getElementById('stageBadge');
    const mainGroup = document.getElementById('mainGroup');
    const graphGroup = document.getElementById('graphGroup');
    const dataNote = document.getElementById('dataNote');

    const GRAPH = { x0: 62, x1: 424, y0: 152, y1: 26 };
    const RUN_SECONDS = 8;

    const batchim = w => {
        const c = w.charCodeAt(w.length - 1);
        return c >= 0xAC00 && c <= 0xD7A3 ? (c - 0xAC00) % 28 !== 0 : false;
    };
    const eun = w => w + (batchim(w) ? '은' : '는');
    const iga = w => w + (batchim(w) ? '이' : '가');
    const eul = w => w + (batchim(w) ? '을' : '를');

    /* -------------------------------------------------------------- data */
    // One gene per trait; a capital letter is the dominant allele.
    const TRAITS = {
        shape: { name: '씨 모양', gene: 'R', thing: '완두', unit: '알',
                 dom: { label: '둥근', shape: 'round', hex: '#e9d57a' }, rec: { label: '주름진', shape: 'wrinkled', hex: '#d9c066' } },
        colour: { name: '씨 색', gene: 'Y', thing: '완두', unit: '알',
                  dom: { label: '노란', shape: 'round', hex: '#f2d15c' }, rec: { label: '초록', shape: 'round', hex: '#7cc46a' } },
        flower: { name: '꽃 색', gene: 'P', thing: '꽃', unit: '그루',
                  dom: { label: '보라', shape: 'round', hex: '#9b5de5' }, rec: { label: '흰', shape: 'round', hex: '#f4f1ea' } },
    };
    const GENOS = { DD: '순종 우성', Dd: '잡종', dd: '순종 열성' };
    const CROSSES2 = {
        f1self: { label: 'RrYy × RrYy', hint: '잡종 1대끼리', a: 'RrYy', b: 'RrYy' },
        pure: { label: 'RRYY × rryy', hint: '순종끼리', a: 'RRYY', b: 'rryy' },
        test: { label: 'RrYy × rryy', hint: '검정 교배', a: 'RrYy', b: 'rryy' },
    };
    const SEED_COUNTS = [8, 40, 200, 1000];

    const state = {
        mode: 'one',
        trait: 'shape', parentA: 'DD', parentB: 'dd',
        cross: 'f1self',
        seeds: 200,
        progress: 0, prediction: null,
        seed: (Date.now() % 100000) | 0, offspring: [],
    };
    let running = false, frameId = 0, lastStamp = 0;

    // a small seeded generator, so the same sowing can be replayed exactly
    function rng(seed) {
        let a = seed >>> 0;
        return () => {
            a = (a + 0x6D2B79F5) >>> 0;
            let t = a;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    /* ------------------------------------------------------------ models */
    const alleles = (geno, gene) => geno.split('').map(ch => (ch === 'D' ? gene : ch === 'd' ? gene.toLowerCase() : ch));
    const isDom = (pair, gene) => pair.includes(gene);
    const sortPair = (a, b, gene) => (a === gene || b !== gene ? a + b : b + a);

    function analyseOne(s = state) {
        const trait = TRAITS[s.trait];
        const g = trait.gene;
        const gamA = alleles(s.parentA, g), gamB = alleles(s.parentB, g);
        // every gamete of A against every gamete of B: the Punnett square
        const cells = gamA.map(a => gamB.map(b => sortPair(a, b, g)));
        const flat = cells.flat();
        const pDom = flat.filter(x => isDom(x, g)).length / flat.length;
        const genoCounts = {};
        flat.forEach(x => { genoCounts[x] = (genoCounts[x] || 0) + 1; });
        const verdict = pDom === 1 ? 'all-dom' : pDom === 0.75 ? '3-1' : pDom === 0.5 ? '1-1' : 'all-rec';
        const phenos = [
            { key: 'dom', label: `${trait.dom.label} ${trait.thing}`, p: pDom, ...trait.dom },
            { key: 'rec', label: `${trait.rec.label} ${trait.thing}`, p: 1 - pDom, ...trait.rec },
        ];
        const laws = [];
        if (flat.some(x => isDom(x, g) && x !== g + g)) laws.push('우열의 원리');
        if (s.parentA === 'Dd' || s.parentB === 'Dd') laws.push('분리의 법칙');
        return { kind: 'one', trait, gene: g, gamA, gamB, cells, genoCounts, pDom, verdict, phenos, laws,
                 classify: geno => (isDom(geno, g) ? 'dom' : 'rec') };
    }

    // gametes of a two-gene genotype like RrYy: one allele of each gene, all combinations
    const gametes2 = geno => {
        const r = [geno[0], geno[1]], y = [geno[2], geno[3]];
        return r.flatMap(a => y.map(b => a + b));
    };
    function analyseTwo(s = state) {
        const cross = CROSSES2[s.cross];
        const gamA = gametes2(cross.a), gamB = gametes2(cross.b);
        const pair2 = (x, y) => sortPair(x[0], y[0], 'R') + sortPair(x[1], y[1], 'Y');
        const cells = gamA.map(a => gamB.map(b => pair2(a, b)));
        const flat = cells.flat();
        const cls = geno => (geno.includes('R') ? 'R' : 'r') + (geno.includes('Y') ? 'Y' : 'y');
        const PHENO = {
            RY: { key: 'RY', label: '둥근 노란 완두', shape: 'round', hex: '#f2d15c' },
            Ry: { key: 'Ry', label: '둥근 초록 완두', shape: 'round', hex: '#7cc46a' },
            rY: { key: 'rY', label: '주름진 노란 완두', shape: 'wrinkled', hex: '#f2d15c' },
            ry: { key: 'ry', label: '주름진 초록 완두', shape: 'wrinkled', hex: '#7cc46a' },
        };
        const phenos = Object.values(PHENO).map(ph => ({ ...ph, p: flat.filter(x => cls(x) === ph.key).length / flat.length }));
        const ratio = phenos.map(ph => ph.p * 16);
        const verdict = ratio.join(',') === '9,3,3,1' ? '9-3-3-1' : ratio.join(',') === '16,0,0,0' ? 'all-same' : ratio.join(',') === '4,4,4,4' ? '1-1-1-1' : 'other';
        const laws = ['독립의 법칙'];
        if (s.cross !== 'pure') laws.unshift('분리의 법칙');
        if (flat.some(x => x !== 'RRYY' && cls(x) === 'RY')) laws.unshift('우열의 원리');
        return { kind: 'two', cross, gamA, gamB, cells, phenos, verdict, laws, classify: cls,
                 trait: { thing: '완두', unit: '알' } };
    }

    const analyse = () => (state.mode === 'one' ? analyseOne() : analyseTwo());

    // sow every seed up front from the seed value; the run only reveals them
    function sow(a) {
        const rand = rng(state.seed);
        const pick = list => list[Math.floor(rand() * list.length)];
        const out = [];
        for (let i = 0; i < state.seeds; i += 1) {
            let geno;
            if (a.kind === 'one') geno = sortPair(pick(a.gamA), pick(a.gamB), a.gene);
            else {
                // each gene's allele is drawn on its own: that independence is the law
                const ga = pick(a.gamA), gb = pick(a.gamB);
                geno = sortPair(ga[0], gb[0], 'R') + sortPair(ga[1], gb[1], 'Y');
            }
            out.push({ geno, key: a.classify(geno) });
        }
        state.offspring = out;
    }

    const shown = () => Math.floor(state.progress * state.seeds);
    function tally(a, upTo = shown()) {
        const counts = {};
        a.phenos.forEach(ph => { counts[ph.key] = 0; });
        for (let i = 0; i < upTo; i += 1) counts[state.offspring[i].key] += 1;
        return counts;
    }

    /* ---------------------------------------------------------- controls */
    function pickRow(legend, name, options, current, cols) {
        return `<fieldset class="pick-field"><legend>${legend}</legend>` +
            `<div class="pick-buttons cols${cols}" data-pick="${name}">` +
            options.map(o => `<button type="button" data-value="${o.value}" class="${o.value === String(current) ? 'selected' : ''}">` +
                `${o.label}${o.hint ? `<small>${o.hint}</small>` : ''}</button>`).join('') +
            `</div></fieldset>`;
    }

    const genoOptions = trait => Object.entries(GENOS).map(([k, v]) => ({ value: k, label: alleles(k, trait.gene).join(''), hint: v }));

    function buildControls() {
        const seedRow = pickRow('뿌릴 씨앗 수', 'seeds', SEED_COUNTS.map(n => ({ value: String(n), label: `${n}알` })), state.seeds, 4);
        if (state.mode === 'one') {
            const trait = TRAITS[state.trait];
            controlArea.innerHTML =
                pickRow('형질', 'trait', Object.entries(TRAITS).map(([k, v]) => ({ value: k, label: v.name, hint: `${v.dom.label} ${v.gene} · ${v.rec.label} ${v.gene.toLowerCase()}` })), state.trait, 3) +
                pickRow('부모 ⓐ', 'parentA', genoOptions(trait), state.parentA, 3) +
                pickRow('부모 ⓑ', 'parentB', genoOptions(trait), state.parentB, 3) +
                seedRow;
        } else {
            controlArea.innerHTML =
                pickRow('교배 (씨 모양 R/r · 씨 색 Y/y)', 'cross', Object.entries(CROSSES2).map(([k, v]) => ({ value: k, label: v.label, hint: v.hint })), state.cross, 3) +
                seedRow;
        }
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                const v = button.dataset.value;
                state[group.dataset.pick] = group.dataset.pick === 'seeds' ? Number(v) : v;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                if (group.dataset.pick === 'trait') buildControls();
                settingsChanged();
            }));
        });
    }

    const PRED_ONE = [{ value: 'all-dom', label: '모두 우성' }, { value: '3-1', label: '3 : 1' }, { value: '1-1', label: '1 : 1' }, { value: 'all-rec', label: '모두 열성' }];
    const PRED_TWO = [{ value: 'all-same', label: '모두 같음' }, { value: '9-3-3-1', label: '9 : 3 : 3 : 1' }, { value: '1-1-1-1', label: '1 : 1 : 1 : 1' }, { value: '3-1', label: '3 : 1' }];

    function buildPrediction() {
        const list = state.mode === 'one' ? PRED_ONE : PRED_TWO;
        predictionLegend.textContent = state.mode === 'one' ? '우성 : 열성 비는 어떻게 나올까요?' : '네 가지 겉모습의 비는 어떻게 나올까요?';
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction;
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    function seedShape(cx, cy, r, ph, cls = 'seed') {
        if (ph.shape === 'round') return `<circle class="${cls}" fill="${ph.hex}" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}"/>`;
        // a lumpy outline reads as wrinkled even when tiny
        const pts = [];
        for (let i = 0; i < 8; i += 1) {
            const ang = (Math.PI * 2 * i) / 8, rr = i % 2 ? r * 0.72 : r;
            pts.push(`${(cx + rr * Math.cos(ang)).toFixed(1)},${(cy + rr * Math.sin(ang)).toFixed(1)}`);
        }
        return `<polygon class="${cls}" fill="${ph.hex}" points="${pts.join(' ')}"/>`;
    }

    const phenoOf = (a, key) => a.phenos.find(ph => ph.key === key);

    function renderPunnett(a) {
        const n = a.gamA.length;
        const cell = a.kind === 'two' ? 44 : 36;
        const X = 26, Y = 52;
        let out = `<text class="part-label" x="${X}" y="26">유전자형 표 — 기대</text>`;
        out += `<text class="small-label" x="${X + cell + (n * cell) / 2}" y="${Y - 6}" text-anchor="middle">부모 ⓐ${a.kind === 'one' ? '' : ' ' + a.cross.a}</text>`;
        out += `<text class="small-label" transform="rotate(-90 ${X - 8} ${Y + cell + (n * cell) / 2})" x="${X - 8}" y="${Y + cell + (n * cell) / 2}" text-anchor="middle">부모 ⓑ${a.kind === 'one' ? '' : ' ' + a.cross.b}</text>`;
        for (let i = 0; i < n; i += 1) {
            out += `<rect class="pun-head" x="${X + cell * (i + 1)}" y="${Y}" width="${cell}" height="${cell}"/>`;
            out += `<text class="pun-gamete" x="${X + cell * (i + 1) + cell / 2}" y="${Y + cell / 2 + 4}" text-anchor="middle">${a.gamA[i]}</text>`;
            out += `<rect class="pun-head" x="${X}" y="${Y + cell * (i + 1)}" width="${cell}" height="${cell}"/>`;
            out += `<text class="pun-gamete" x="${X + cell / 2}" y="${Y + cell * (i + 1) + cell / 2 + 4}" text-anchor="middle">${a.gamB[i]}</text>`;
        }
        for (let i = 0; i < n; i += 1) for (let j = 0; j < n; j += 1) {
            const geno = a.cells[i][j];
            const ph = phenoOf(a, a.classify(geno));
            const x = X + cell * (i + 1), y = Y + cell * (j + 1);
            out += `<rect class="pun-cell" fill="${ph.hex}" x="${x}" y="${y}" width="${cell}" height="${cell}"/>`;
            const dark = ph.hex === '#9b5de5';
            out += `<text class="pun-text${dark ? ' light' : ''}" x="${x + cell / 2}" y="${y + cell / 2 + 3.5}" text-anchor="middle">${geno}</text>`;
        }
        return out;
    }

    function renderTray(a) {
        const TX = a.kind === 'two' ? 290 : 196, TY = 58, TW = a.kind === 'two' ? 350 : 244, TH = 132;
        const n = state.seeds, k = shown();
        const cols = Math.ceil(Math.sqrt(n * TW / TH)), rows = Math.ceil(n / cols);
        const cw = TW / cols, ch = TH / rows, r = Math.min(cw, ch) * 0.38;
        let out = `<text class="part-label" x="${TX}" y="26">뿌려서 나온 것 — 실제</text>`;
        const counts = tally(a);
        out += `<text class="small-label" x="${TX + TW}" y="38" text-anchor="end">${k} / ${n}${a.trait.unit} · 지금까지 ${ratioText(a, counts)}</text>`;
        out += `<rect class="tray" x="${TX}" y="${TY}" width="${TW}" height="${TH}" rx="6"/>`;
        for (let i = 0; i < k; i += 1) {
            const ph = phenoOf(a, state.offspring[i].key);
            out += seedShape(TX + cw * (i % cols) + cw / 2, TY + ch * Math.floor(i / cols) + ch / 2, r, ph);
        }
        // legend: one row for two kinds, two rows for four
        a.phenos.forEach((ph, i) => {
            const lx = TX + (i % 2) * (a.kind === 'two' ? 176 : 124), ly = a.phenos.length > 2 ? 216 + Math.floor(i / 2) * 24 : 214;
            out += seedShape(lx + 5, ly - 4, 4.5, ph);
            out += `<text class="legend-text" x="${lx + 13}" y="${ly}">${ph.label.replace(' 완두', '').replace(' 꽃', '')} ${counts[ph.key]}</text>`;
        });
        return out;
    }

    function ratioText(a, counts) {
        if (a.kind === 'one') {
            const d = counts.dom, r = counts.rec;
            if (d + r === 0) return '-';
            if (r === 0) return `모두 ${a.trait.dom.label}`;
            if (d === 0) return `모두 ${a.trait.rec.label}`;
            return `${(d / r).toFixed(2)} : 1`;
        }
        const total = Object.values(counts).reduce((x, y) => x + y, 0);
        if (!total) return '-';
        const seen = a.phenos.filter(ph => counts[ph.key] > 0);
        if (seen.length === 1) return `모두 ${seen[0].label.replace(' 완두', '')}`;
        const unit = total / 16;
        return a.phenos.map(ph => (counts[ph.key] / unit).toFixed(1)).join(' : ');
    }
    function expectedText(a) {
        if (a.kind === 'one') {
            if (a.pDom === 1) return `모두 ${a.trait.dom.label}`;
            if (a.pDom === 0) return `모두 ${a.trait.rec.label}`;
            return `${a.pDom / (1 - a.pDom)} : 1`;
        }
        const possible = a.phenos.filter(ph => ph.p > 0);
        if (possible.length === 1) return `모두 ${possible[0].label.replace(' 완두', '')}`;
        return a.phenos.map(ph => ph.p * 16).join(' : ');
    }

    function renderMain(a) {
        mainGroup.closest('svg').setAttribute('viewBox',a.kind==='two'?'0 0 660 290':'0 0 460 238');
        let out = renderPunnett(a) + renderTray(a);
        const head = a.kind === 'one'
            ? `${alleles(state.parentA, a.gene).join('')} × ${alleles(state.parentB, a.gene).join('')}`
            : a.cross.label;
        out += `<text class="verdict-text figure-caption" fill="#0f172a" x="26" y="210">${head} · 기대 ${expectedText(a)}</text>`;
        mainGroup.innerHTML = out;
    }

    /* ------------------------------------------------------------ graphs */
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
        out += `<text class="axis-title" x="${GRAPH.x0 + 4}" y="${GRAPH.y1 - 8}">${yTitle}</text>`;
        return out;
    }

    // one trait: the share of dominant seeds as the sowing goes on, inside the
    // band where chance alone usually keeps it (two standard deviations)
    function graphOne(a) {
        const n = state.seeds, k = shown();
        const gx = i => GRAPH.x0 + (i / n) * (GRAPH.x1 - GRAPH.x0);
        const gy = f => GRAPH.y0 - f * (GRAPH.y0 - GRAPH.y1);
        let out = graphFrame(
            [0, 0.25, 0.5, 0.75, 1].map(f => [Math.round(f * n), gx(f * n)]),
            [[0, gy(0)], ['25 %', gy(0.25)], ['50 %', gy(0.5)], ['75 %', gy(0.75)], ['100 %', gy(1)]],
            `뿌린 씨앗 (${a.trait.unit})`, `${a.trait.dom.label} ${a.trait.thing}의 비율`);
        const p = a.pDom;
        if (p > 0 && p < 1) {
            const upper = [], lower = [];
            for (let i = 1; i <= n; i += Math.max(1, Math.floor(n / 80))) {
                const s = 2 * Math.sqrt(p * (1 - p) / i);
                upper.push(`${gx(i).toFixed(1)},${gy(Math.min(1, p + s)).toFixed(1)}`);
                lower.unshift(`${gx(i).toFixed(1)},${gy(Math.max(0, p - s)).toFixed(1)}`);
            }
            out += `<path class="band" d="M${upper.join('L')}L${lower.join('L')}Z"/>`;
        }
        out += `<line class="expect-line" x1="${GRAPH.x0}" y1="${gy(p).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(p).toFixed(1)}"/>`;
        out += `<text class="axis-text" style="fill:#059669" x="${GRAPH.x1 - 4}" y="${(gy(p) - 5).toFixed(1)}" text-anchor="end">기대 ${Math.round(p * 100)} %</text>`;
        if (k > 0) {
            const pts = [];
            let dom = 0;
            for (let i = 1; i <= k; i += 1) {
                if (state.offspring[i - 1].key === 'dom') dom += 1;
                if (i % Math.max(1, Math.floor(k / 120)) === 0 || i === k) pts.push(`${gx(i).toFixed(1)},${gy(dom / i).toFixed(1)}`);
            }
            out += `<path class="trace" d="M${pts.join('L')}"/>`;
            out += `<circle class="trace-dot" cx="${gx(k).toFixed(1)}" cy="${gy(dom / k).toFixed(1)}" r="5" fill="#0284c7"/>`;
        }
        if (p > 0 && p < 1) out += `<text class="note-text" x="${GRAPH.x0 + 8}" y="${GRAPH.y1 + 14}">옅은 띠: 우연만으로 보통 벗어나는 범위 — 많이 뿌릴수록 좁아집니다</text>`;
        return out;
    }

    // two traits: the four counts as bars, with a tick where each is expected
    function graphTwo(a) {
        const n = state.seeds, counts = tally(a);
        const max = Math.max(n * 0.6, ...a.phenos.map(ph => Math.max(counts[ph.key], ph.p * n))) * 1.08;
        const gx = v => GRAPH.x0 + (v / max) * (GRAPH.x1 - GRAPH.x0);
        let out = graphFrame([0, 0.25, 0.5, 0.75, 1].map(f => [Math.round(f * max), gx(f * max)]), [], `개수 (${a.trait.unit})`, '');
        a.phenos.forEach((ph, i) => {
            const y = GRAPH.y1 + 24 + i * 30;
            out += `<text class="bar-text" fill="#0f172a" x="${GRAPH.x0}" y="${y - 9}">${ph.label} ${counts[ph.key]}${a.trait.unit} · 기대 ${Math.round(ph.p * n)}${a.trait.unit}</text>`;
            out += `<rect class="bar" x="${GRAPH.x0}" y="${y - 4}" width="${Math.max(0, gx(counts[ph.key]) - GRAPH.x0).toFixed(1)}" height="11" rx="3" fill="${ph.hex}" opacity=".8"/>`;
            out += `<line class="expect-tick" x1="${gx(ph.p * n).toFixed(1)}" y1="${y - 7}" x2="${gx(ph.p * n).toFixed(1)}" y2="${y + 10}"/>`;
        });
        return out;
    }

    function noteFor(a) {
        const counts = tally(a);
        const k = shown();
        const gam = `${[...new Set(a.gamA)].join(', ')} / ${[...new Set(a.gamB)].join(', ')}`;
        const genoRatio = a.kind === 'one'
            ? Object.entries(a.genoCounts).map(([g, c]) => `${g} ${c}`).join(' : ')
            : '표의 16칸';
        return `<div class="data-row"><span class="data-name">생식세포</span><span class="data-val">${gam}</span></div>` +
            `<div class="data-row"><span class="data-name">유전자형 (기대)</span><span class="data-val">${genoRatio}</span></div>` +
            `<div class="data-row"><span class="data-name">겉모습 (기대)</span><span class="data-val">${a.phenos.map(ph => `${ph.label} ${Math.round(ph.p * 100)} %`).join(' · ')}</span></div>` +
            `<div class="data-row"><span class="data-name">뿌린 씨앗</span><span class="data-val">${k} / ${state.seeds}${a.trait.unit}</span></div>` +
            `<div class="data-row match"><span class="data-name">지금까지</span><span class="data-val">${a.phenos.map(ph => `${ph.label} ${counts[ph.key]}`).join(' · ')} → ${ratioText(a, counts)}</span></div>` +
            `<div class="data-row"><span class="data-name">쓰인 법칙</span><span class="data-val">${a.laws.join(' · ')}</span></div>`;
    }

    function render() {
        const a = analyse();
        if (state.offspring.length !== state.seeds) sow(a);
        renderMain(a);
        graphGroup.innerHTML = a.kind === 'one' ? graphOne(a) : graphTwo(a);
        stageBadge.textContent = a.kind === 'one'
            ? `${a.trait.name} · ${alleles(state.parentA, a.gene).join('')} × ${alleles(state.parentB, a.gene).join('')}`
            : a.cross.label;
        methodHint.textContent = state.mode === 'one'
            ? '생식세포가 만들어질 때 한 쌍의 유전자는 갈라져 하나씩 들어갑니다'
            : '서로 다른 형질의 유전자는 서로 상관없이 따로 갈라집니다';
        dataNote.innerHTML = noteFor(a);
        return a;
    }

    /* --------------------------------------------------------------- run */
    function tick(dt) {
        state.progress = Math.min(1, state.progress + dt / RUN_SECONDS);
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
        state.seed = (state.seed + 7919) | 0;   // a fresh sowing every time
        state.offspring = [];
        state.progress = 0;
        running = true;
        lastStamp = performance.now();
        render();
        frameId = requestAnimationFrame(frame);
    }

    function finish() {
        const a = render();
        const counts = tally(a, state.seeds);
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        valueA.textContent = ratioText(a, counts);
        valueB.textContent = expectedText(a);
        predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        const n = state.seeds, u = a.trait.unit;
        let s = '';
        if (a.kind === 'one') {
            const t = a.trait, d = counts.dom, r = counts.rec;
            s = `${n}${u} 가운데 ${t.dom.label} ${t.thing} ${d}${u}, ${t.rec.label} ${t.thing} ${r}${iga(u)} 나왔습니다. `;
            if (a.pDom === 1) {
                s += `자손이 모두 ${alleles('Dd', a.gene).join('')}이어서 우성 유전자와 열성 유전자가 함께 있는데도 ${t.dom.label} 모습만 드러납니다. 이것이 우열의 원리입니다.`;
            } else if (a.pDom === 0) {
                s += `부모 둘 다 ${a.gene.toLowerCase()}만 가지고 있어 자손도 모두 ${t.rec.label} ${t.thing}입니다.`;
            } else {
                const exp = a.pDom === 0.75 ? '3 : 1' : '1 : 1';
                const dev = Math.abs(d / n - a.pDom), sig = Math.sqrt(a.pDom * (1 - a.pDom) / n);
                s += `잡종 ${alleles('Dd', a.gene).join('')} ${eun(t.thing)} 생식세포를 만들 때 유전자 쌍이 갈라져 ${a.gene}, ${a.gene.toLowerCase()} 하나씩 들어가고(분리의 법칙), 이들이 무작위로 만나 기대 비는 ${exp}입니다. `;
                const grow = u === '그루' ? '기르니' : '뿌리니';
                s += dev > 2 * sig
                    ? `이번에는 우연히 기대에서 꽤 벗어났습니다. 씨앗을 더 많이 뿌리면 ${exp}에 가까워집니다.`
                    : n <= 40
                        ? `${n}${eun(u)} 적어서 다음번에는 다른 비가 나올 수 있습니다. 씨앗 수를 늘려 견주어 보세요.`
                        : dev > sig
                            ? `${n}${eul(u)} ${grow} 기대 비와 조금 차이가 나지만, 우연으로 흔히 생기는 범위 안입니다. 더 많이 ${u === '그루' ? '기르면' : '뿌리면'} ${exp}에 더 가까워집니다.`
                            : `${n}${eul(u)} ${grow} 기대 비에 가깝게 나왔습니다. 씨앗이 많을수록 우연이 서로 지워져 비가 또렷해집니다.`;
            }
        } else {
            const parts = a.phenos.map(ph => `${ph.label} ${counts[ph.key]}${u}`).join(', ');
            s = `${n}${u} 가운데 ${parts}${iga(u).slice(-1)} 나왔습니다. `;
            if (a.verdict === '9-3-3-1') s += `씨 모양의 R·r과 씨 색의 Y·y가 서로 상관없이 따로 갈라져 생식세포 RY·Ry·rY·ry가 같은 수로 생기고(독립의 법칙), 표의 16칸이 9 : 3 : 3 : 1로 나뉩니다.`;
            if (a.verdict !== 'all-same') s += n <= 40
                ? ` ${n}${eun(u)} 적어서 네 칸의 비가 크게 흔들립니다. 씨앗 수를 늘려 다시 뿌려 보세요.`
                : ` ${n}${eul(u)} 뿌리니 기대 비에 가깝게 나왔습니다.`;
            else if (a.verdict === 'all-same') s += `순종끼리의 교배여서 자손은 모두 RrYy이고, 우성인 R과 Y만 드러나 모두 둥근 노란 완두입니다.`;
            else s += `RrYy가 만드는 네 가지 생식세포가 rryy의 ry와 하나씩 만나 네 겉모습이 같은 수로 나옵니다. 이렇게 열성 순종과 교배해 유전자형을 알아내는 것을 검정 교배라고 합니다.`;
        }
        explanation.textContent = s;
    }

    function settingsChanged() {
        stopRun();
        state.progress = 0;
        state.offspring = [];
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
        stageCaption.textContent = state.mode === 'one'
            ? '왼쪽 표는 기대, 오른쪽 씨앗은 실제로 뿌려 나온 결과입니다.'
            : '두 형질이 따로 갈라지면 표의 16칸이 9 : 3 : 3 : 1로 나뉩니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { trait: 'shape', parentA: 'DD', parentB: 'dd', cross: 'f1self', seeds: 200, progress: 0, prediction: null, offspring: [] });
        modeButtons.find(b => b.dataset.mode === 'one').click();
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

    window.__peaModel = {
        TRAITS, GENOS, CROSSES2, SEED_COUNTS, state,
        analyseOne, analyseTwo, analyse, sow, tally, rng, render,
        runSeconds: () => RUN_SECONDS,
        setMode(m) { modeButtons.find(b => b.dataset.mode === m).click(); },
        set(key, value) { state[key] = value; buildControls(); settingsChanged(); },
        setSeed(v) { state.seed = v | 0; state.offspring = []; render(); },
        setProgress(p) { stopRun(); state.progress = p; render(); },
        runToEnd(dt = 0.25, cap = 5000) {
            stopRun(); state.progress = 0; state.offspring = [];
            let steps = 0;
            while (!tick(dt) && steps < cap) steps += 1;
            finish();
            return { steps, progress: state.progress };
        },
        tick, finish,
    };

    resetBtn.click();
});
