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
        if (stageReadout) window.scienceScene.render(stageReadout,rows.map(r => `<span${r.fill ? ` style="color:${r.fill}"` : ''}>${r.txt}</span>`).join(''));
        if (stageNote) stageNote.textContent = notes.join(' ');
    }

    /* -------------------------------------------------------------- data */
    // Days. A germ doubles every 8 h; the innate system removes about 40 % a day;
    // antibody 1 = the level that stops the germ; lymphocytes need 5 days the first time, 1.5 days with memory.
    const R = 2.08, C0 = 0.5, KA = 3, CAP = 1e9, DT = 0.02, SICK = 1e4;
    const LAG1 = 5, LAG2 = 1.5, STR1 = 1, STR2 = 10, PLASMA_LIFE = 5, A_DECAY = 0.033, LONG_RATE = 0.01, C_LONG = 0.3;

    const INFECTS = {
        first: { label: '처음 걸림', hint: '기억 세포 없음' },
        same: { label: '두 번째 · 같은 병원체', hint: '두 달 전에 앓았음' },
        other: { label: '두 번째 · 다른 병원체', hint: '다른 병을 앓았던 몸' },
        nolymph: { label: '림프구 없는 몸', hint: '후천 면역 못 함' },
    };
    const DOSES = { small: { label: '조금 들어옴', hint: '100마리', dose: 100 }, large: { label: '많이 들어옴', hint: '100만 마리', dose: 1e6 } };
    const SHOTS = { none: { label: '접종 안 함', hint: '기억 세포 없음', n: 0 }, one: { label: '1회 접종', hint: '한 번만', n: 1 }, two: { label: '2회 접종', hint: '가상 추가 노출', n: 2 } };
    const WHENS = { m1: { label: '한 달 뒤 만남', hint: '30일 뒤', gap: 30 }, m6: { label: '여섯 달 뒤 만남', hint: '180일 뒤', gap: 180 } };
    const V_DOSE = 1e5;
    const ABO = ['A', 'B', 'AB', 'O'];
    const ANTIGENS = { A: ['A'], B: ['B'], AB: ['A', 'B'], O: [] };
    const ANTIBODIES = { A: ['B'], B: ['A'], AB: [], O: ['A', 'B'] };
    const RHS = {
        same: { label: 'Rh 같음', hint: '둘 다 Rh⁺' },
        first: { label: 'Rh⁺ → Rh⁻ 처음', hint: '받는 사람 첫 수혈' },
        second: { label: 'Rh⁺ → Rh⁻ 두 번째', hint: '전에 한 번 받았음' },
    };

    const state = { mode: 'infect', infect: 'first', dose: 'small', shot: 'none', when: 'm1', donor: 'A', recip: 'B', rh: 'same', progress: 0, prediction: null };
    let running = false, frameId = 0, lastStamp = 0;

    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const sig = x => 1 / (1 + Math.exp(-x));
    const log10 = x => Math.log(x) / Math.LN10;
    const fmtCount = P => P < 1 ? '0' : P >= 1e8 ? `${P >= 1e9 ? Math.round(P / 1e8) : (P / 1e8).toFixed(1)}억` : P >= 1e4 ? `${Math.round(P / 1e4).toLocaleString('ko-KR')}만` : Math.round(P).toLocaleString('ko-KR');
    const fmtGerms = P => { const c = fmtCount(P); return `${c}${/[만억]$/.test(c) ? ' ' : ''}마리`; };
    // particles after a number follow how the last digit is read: 영 일 이 삼 사 오 육 칠 팔 구
    const lastDigit = str => (String(str).match(/\d(?!.*\d)/) || [''])[0];
    const pIga = str => '013678'.includes(lastDigit(str)) ? '이' : '가';
    const roOf = str => '036'.includes(lastDigit(str)) ? '으로' : '로';
    const dayWord = d => d < 0.5 ? '들어온 날' : `${fmtDay(d)}일째`;
    const sickWord = sick => sick <= 0 ? '열은 나지 않았습니다.' : sick < 0.5 ? '열은 반나절도 채 나지 않았습니다.' : `열은 ${sick.toFixed(1)}일 났습니다.`;
    const fmtA = A => A < 0.01 ? '거의 없음' : A < 1 ? A.toFixed(2) : A < 10 ? A.toFixed(1) : Math.round(A).toLocaleString('ko-KR');
    const fmtDay = d => Number.isInteger(+d.toFixed(1)) ? `${Math.round(d)}` : d.toFixed(1);

    /* ------------------------------------------------------------ models */
    const cache = {};
    function immuneRun(o) {
        const key = JSON.stringify(o);
        if (cache[key]) return cache[key];
        const { days, exposures, lymph = true } = o;
        let P = 0, A = o.A0 || 0, M = o.M0 || 0, Ag = 0, plasma = 0, longP = o.long0 || 0;
        let lastExp = -1e9, memAtExp = 0, armed = false, memShown = o.M0 || 0;
        const out = { t: [], P: [], A: [], Ag: [], plasma: [], M: [], memShown: [], act: [], sick: 0, firstSick: null, lastSick: null, peak: 0, peakDay: 0, clearDay: null, infectDay: null, protectDay: null };
        let step = 0;
        for (let t = 0; t <= days + 1e-9; t += DT, step += 1) {
            for (const e of exposures) if (Math.abs(t - e.day) < DT / 2) {
                if (e.kind === 'infect') { P += e.dose; out.infectDay = t; out.clearDay = null; out.peak = 0; } else Ag += 1e6;
                lastExp = t; memAtExp = M; M = Math.min(3, M + 1); armed = true;
            }
            const antigen = P + Ag;
            const lag = memAtExp > 0 ? LAG2 : LAG1, strength = memAtExp > 0 ? STR2 : STR1;
            const act = lymph ? (antigen / (antigen + 1e4)) * sig((t - lastExp - lag) / 0.5) : 0;
            if (armed && act > 0.3) { memShown = Math.min(3, memShown + 1); armed = false; }
            plasma += DT * (strength * act - plasma / PLASMA_LIFE);
            longP += DT * C_LONG * strength * act;
            A += DT * (0.4 * plasma + LONG_RATE * longP - A_DECAY * A);
            if (P > 0) {
                P *= Math.exp(DT * ((R - C0) * (1 - P / CAP) - KA * A));
                if (P < 0.5) { P = 0; if (out.clearDay === null) out.clearDay = +t.toFixed(2); }
            }
            Ag *= Math.exp(-DT * 0.5);
            if (step % 5 === 0) { out.t.push(+t.toFixed(2)); out.P.push(P); out.A.push(A); out.Ag.push(Ag); out.plasma.push(plasma); out.M.push(M); out.memShown.push(memShown); out.act.push(act); }
            if (P > out.peak) { out.peak = P; out.peakDay = +t.toFixed(2); }
            if (P > SICK) { out.sick += DT; if (out.firstSick === null) out.firstSick = +t.toFixed(2); out.lastSick = +t.toFixed(2); }
            if (out.infectDay !== null && out.protectDay === null && A >= 1 && t >= out.infectDay) out.protectDay = +t.toFixed(2);
        }
        out.Aend = A; out.Mend = M; out.longEnd = longP; out.maxA = Math.max(...out.A);
        cache[key] = out;
        return out;
    }
    // what is left of a fight `gap` days later: antibody has decayed, long-lived plasma cells keep a little coming
    const afterGap = (run, gap) => ({ A0: +(run.Aend * Math.exp(-A_DECAY * gap) + LONG_RATE * run.longEnd / A_DECAY * (1 - Math.exp(-A_DECAY * gap))).toFixed(4), M0: run.Mend, long0: +run.longEnd.toFixed(4) });
    const verdictOf = run => !run.clearDay ? 'unbeaten' : run.sick >= 5 ? 'week' : run.sick >= 1 ? 'days' : 'none';

    function analyse() {
        if (state.mode === 'infect') {
            const dose = DOSES[state.dose].dose;
            const base = { days: 21, exposures: [{ day: 0, kind: 'infect', dose }] };
            let run, prior = null;
            if (state.infect === 'same') { prior = immuneRun({ days: 21, exposures: [{ day: 0, kind: 'infect', dose: 100 }] }); run = immuneRun({ ...base, ...afterGap(prior, 60) }); }
            else if (state.infect === 'nolymph') run = immuneRun({ ...base, lymph: false });
            else run = immuneRun(base);
            return { kind: 'infect', run, prior, dose, verdict: verdictOf(run), tEnd: 21 };
        }
        if (state.mode === 'vaccine') {
            const n = SHOTS[state.shot].n, gap = WHENS[state.when].gap;
            const ex = []; if (n >= 1) ex.push({ day: 0, kind: 'vaccine' }); if (n >= 2) ex.push({ day: 21, kind: 'vaccine' });
            const lastDose = n === 2 ? 21 : 0, infectDay = lastDose + gap;
            ex.push({ day: infectDay, kind: 'infect', dose: V_DOSE });
            const run = immuneRun({ days: infectDay + 21, exposures: ex });
            const iA = run.t.findIndex(t => t >= infectDay - 0.01);
            return { kind: 'vaccine', run, n, gap, lastDose, infectDay, segA: n ? [0, lastDose + 21] : null, segB: [infectDay - 2, infectDay + 21], Aat: run.A[iA], verdict: verdictOf(run) };
        }
        const d = state.donor, r = state.recip;
        const hits = ANTIGENS[d].filter(x => ANTIBODIES[r].includes(x));
        const rhClump = state.rh === 'second';
        const verdict = hits.length || rhClump ? 'clump' : state.rh === 'first' ? 'sensitize' : 'ok';
        return { kind: 'blood', d, r, hits, rhClump, verdict };
    }
    const runSeconds = () => state.mode === 'infect' ? 14 : state.mode === 'vaccine' ? 16 : 5;

    // where the clock stands for the current progress (vaccine mode skips the empty months)
    function dayOf(a) {
        if (a.kind === 'infect') return state.progress * a.tEnd;
        if (a.kind === 'vaccine') {
            const p = state.progress;
            if (a.segA) return p < 0.4 ? (p / 0.4) * a.segA[1] : a.segB[0] + ((p - 0.4) / 0.6) * (a.segB[1] - a.segB[0]);
            return a.segB[0] + p * (a.segB[1] - a.segB[0]);
        }
        return 0;
    }
    const at = (arr, run, t) => arr[clamp(Math.round(t / 0.1), 0, arr.length - 1)];

    /* ---------------------------------------------------------- controls */
    function pickRow(legend, name, options, current, cols) {
        return `<fieldset class="pick-field"><legend>${legend}</legend>` +
            `<div class="pick-buttons cols${cols}" data-pick="${name}">` +
            options.map(o => `<button type="button" data-value="${o.value}" class="${o.value === String(current) ? 'selected' : ''}">` +
                `${o.label}${o.hint ? `<small>${o.hint}</small>` : ''}</button>`).join('') +
            `</div></fieldset>`;
    }
    const opts = table => Object.entries(table).map(([k, v]) => ({ value: k, label: v.label, hint: v.hint }));
    const aboOpts = ABO.map(t => ({ value: t, label: `${t}형`, hint: ANTIGENS[t].length ? `응집원 ${ANTIGENS[t].join('·')}` : '응집원 없음' }));

    function buildControls() {
        if (state.mode === 'infect') controlArea.innerHTML = pickRow('몇 번째 감염인가', 'infect', opts(INFECTS), state.infect, 2) + pickRow('들어온 병원체', 'dose', opts(DOSES), state.dose, 2);
        else if (state.mode === 'vaccine') controlArea.innerHTML = pickRow('백신', 'shot', opts(SHOTS), state.shot, 3) + pickRow('진짜 병원체를 만난 때', 'when', opts(WHENS), state.when, 2);
        else controlArea.innerHTML = pickRow('주는 사람 (적혈구)', 'donor', aboOpts, state.donor, 4) + pickRow('받는 사람 (혈장)', 'recip', aboOpts, state.recip, 4) + pickRow('Rh', 'rh', opts(RHS), state.rh, 3);
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                buildPrediction();
                settingsChanged();
            }));
        });
    }

    const PRED_I = [{ value: 'week', label: '일주일 가까이 앓음' }, { value: 'days', label: '하루 이틀 앓음' }, { value: 'none', label: '거의 앓지 않음' }, { value: 'unbeaten', label: '이기지 못함' }];
    const PRED_V = [{ value: 'week', label: '일주일 가까이 앓음' }, { value: 'days', label: '하루 이틀 앓음' }, { value: 'none', label: '거의 앓지 않음' }];
    const PRED_B = [{ value: 'ok', label: '괜찮음' }, { value: 'clump', label: '응집이 일어남' }, { value: 'sensitize', label: '이번엔 괜찮지만 항체가 생김' }];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list = state.mode === 'infect' ? PRED_I : state.mode === 'vaccine' ? PRED_V : PRED_B;
        predictionLegend.textContent = state.mode === 'infect' ? `${INFECTS[state.infect].label} · 병원체가 ${DOSES[state.dose].label.replace(' 들어옴', '')} 들어오면 얼마나 앓을까요?`
            : state.mode === 'vaccine' ? `${SHOTS[state.shot].label}, ${WHENS[state.when].label.replace(' 만남', '')} 병원체를 만나면?`
                : `${state.donor}형 적혈구를 ${state.recip}형에게 주면? (${RHS[state.rh].label})`;
        predictionArea.className = `prediction-buttons ${list.length === 4 ? 'four' : 'three'}`;
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    // 항체: Y 모양 (줄기 + 두 팔), 각도 ang 으로 돌린다
    const yShape = (x, y, cls, s = 4, ang = 0) => {
        const r = ang * Math.PI / 180, c = Math.cos(r), n = Math.sin(r);
        const P = (dx, dy) => `${(x + dx * c - dy * n).toFixed(1)},${(y + dx * n + dy * c).toFixed(1)}`;
        return `<path class="${cls}" d="M${P(0, s * 1.1)} L${P(0, 0)} M${P(0, 0)} L${P(-s * 0.8, -s)} M${P(0, 0)} L${P(s * 0.8, -s)}"/>`;
    };
    // 병원체: 보라색 막대 모양 세균
    const germShape = (x, y, ang, cls = 'germ') => `<rect class="${cls}" x="${(x - 5).toFixed(1)}" y="${(y - 2.6).toFixed(1)}" width="10" height="5.2" rx="2.6" transform="rotate(${ang.toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    const CELL_PATHS = {
        'cell-mac': 'M 50 10 C 60 12 62 24 72 20 C 82 16 86 30 84 40 C 82 50 94 56 90 68 C 86 80 74 82 70 92 C 66 102 50 90 40 94 C 30 98 22 86 16 78 C 10 70 20 60 14 50 C 8 40 18 32 22 22 C 26 12 40 8 50 10 Z',
        'cell-b': 'M 50 15 C 69 15 85 31 85 50 C 85 69 69 85 50 85 C 31 85 15 69 15 50 C 15 31 31 15 50 15 M 50 25 C 64 25 75 36 75 50 C 75 64 64 75 50 75 C 36 75 25 64 25 50 C 25 36 36 25 50 25 Z',
        'cell-plasma': 'M 42 12 C 68 12 88 28 88 56 C 88 78 72 90 46 90 C 20 90 12 74 12 52 C 12 30 24 12 42 12 M 34 32 C 46 32 54 40 54 52 C 54 64 46 72 34 72 C 22 72 14 64 14 52 C 14 40 22 32 34 32 Z',
        'cell-mem': 'M 50 12 C 71 12 88 29 88 50 C 88 71 71 88 50 88 C 29 88 12 71 12 50 C 12 29 29 12 50 12 M 50 20 C 67 20 80 33 80 50 C 80 67 67 80 50 80 C 33 80 20 67 20 50 C 20 33 33 20 50 20 M 50 30 C 61 30 70 39 70 50 C 70 61 61 70 50 70 C 39 70 30 61 30 50 C 30 39 39 30 50 30 Z',
        'cell-t': 'M 50 18 C 53 18 53 10 50 10 C 47 10 47 18 50 18 C 66 18 78 28 82 42 C 86 40 90 44 88 47 C 82 52 82 60 76 72 C 78 76 74 80 70 78 C 62 84 54 86 50 86 C 50 92 46 92 46 86 C 36 84 28 78 24 70 C 20 72 18 68 20 64 C 18 56 20 46 26 36 C 22 32 26 28 30 32 C 36 24 44 18 50 18 Z',
    };
    const cellAt = (cls, x, y, r, extra = '') => { const sc = r / 40; return `<g transform="translate(${(x - 50 * sc).toFixed(1)} ${(y - 50 * sc).toFixed(1)}) scale(${sc.toFixed(3)})"${extra}><path class="cell ${cls}" d="${CELL_PATHS[cls]}"/></g>`; };

    // 몸속 칸: 병원체가 늘어나고, 세포들이 깨어나 항체를 내고, 항체가 병원체에 달라붙는다
    const FX0 = 18, FX1 = 330, FY0 = 22, FY1 = 196;
    function renderImmune(a) {
        const t = dayOf(a), { run } = a;
        const P = at(run.P, run, t), A = at(run.A, run, t), Ag = at(run.Ag, run, t), plasma = at(run.plasma, run, t), M = at(run.M, run, t), mem = at(run.memShown, run, t), act = at(run.act, run, t);
        const lymph = !(a.kind === 'infect' && state.infect === 'nolymph');
        const memBefore = a.kind === 'infect' ? (state.infect === 'same' ? 1 : 0) : 0;
        const W = FX1 - FX0, H = FY1 - FY0;
        const drift = (k, ax, ay) => [Math.sin(t * 1.1 + k * 1.7) * ax, Math.cos(t * 0.9 + k * 2.3) * ay];
        let out = `<rect class="blood-field" x="${FX0}" y="${FY0}" width="${W}" height="${H}" rx="12"/>`;
        // 조직 속 혈관 한 줄기 (배경)
        out += `<defs><clipPath id="immuneFieldClip"><rect x="${FX0 + 1}" y="${FY0 + 1}" width="${W - 2}" height="${H - 2}" rx="11"/></clipPath></defs>`;
        out += `<path class="vessel" clip-path="url(#immuneFieldClip)" d="M${FX0},${FY0 + 34} C${FX0 + 90},${FY0 + 18} ${FX0 + 200},${FY0 + 52} ${FX1},${FY0 + 30}"/>`;
        out += `<text class="small-label" x="${FX0 + 8}" y="${FY1 - 8}">몸속</text>`;

        // 병원체: 수의 로그만큼 그린다 (자리는 번호마다 정해져 있어 늘면 새로 나타난다)
        const nG = P >= 1 ? clamp(Math.round(log10(P) * 4) + 1, 1, 36) : 0;
        const germs = [];
        for (let k = 0; k < nG; k += 1) {
            const [dx, dy] = drift(k, 6, 5);
            const x = FX0 + 22 + ((k * 53) % (W - 44)) + dx, y = FY0 + 50 + ((k * 37) % (H - 80)) + dy;
            germs.push([x, y]);
            out += germShape(x, y, (k * 47 + t * 20) % 180);
        }
        const nV = Ag >= 100 ? clamp(Math.round(log10(Ag) * 3), 1, 20) : 0;
        for (let k = 0; k < nV; k += 1) { const [dx, dy] = drift(k + 50, 5, 4); out += germShape(FX0 + 30 + ((k * 71) % (W - 60)) + dx, FY0 + 46 + ((k * 43) % (H - 80)) + dy, k * 33, 'germ vaccine'); }

        // 항체: 충분하면(1 넘음) 병원체마다 달라붙고, 나머지는 떠다닌다
        const nA = A >= 0.02 ? clamp(Math.round((log10(A) + 2) * 5), 1, 34) : 0;
        let used = 0;
        if (A >= 1) germs.forEach(([gx, gy], k) => {
            if (used + 2 > nA) return;
            out += yShape(gx - 7, gy - 4, 'ab stuck', 3.4, 60) + yShape(gx + 7, gy + 3, 'ab stuck', 3.4, -120);
            used += 2;
        });
        for (let k = used; k < nA; k += 1) { const [dx, dy] = drift(k + 100, 8, 6); out += yShape(FX0 + 26 + ((k * 61) % (W - 52)) + dx, FY0 + 48 + ((k * 29) % (H - 76)) + dy, 'ab', 3.6, (k * 67) % 360); }

        // 세포들 (몸속 칸 안에서 천천히 움직인다)
        const near = germs[0] || [FX0 + 70, FY0 + 90];
        const [mdx, mdy] = drift(7, 10, 8);
        const macX = clamp(near[0] + 18 + mdx, FX0 + 22, FX1 - 22), macY = clamp(near[1] + 14 + mdy, FY0 + 24, FY1 - 24);
        out += cellAt('cell-mac', macX, macY, 15);
        if (P >= 1 || Ag >= 100) out += germShape(macX - 2, macY + 1, 30, 'germ eaten');
        const dim = lymph ? '' : ' opacity=".28"';
        const awake = lymph && act > 0.3;
        const [bdx, bdy] = drift(11, 4, 3), bX = FX0 + 64 + bdx, bY = FY1 - 34 + bdy;
        out += cellAt('cell-b', bX, bY, 11, dim + (awake ? ' class="awake"' : ''));
        const [tdx, tdy] = drift(13, 4, 3), tX = FX0 + 108 + tdx, tY = FY1 - 30 + tdy;
        out += cellAt('cell-t', tX, tY, 11, dim + (awake ? ' class="awake"' : ''));
        if (awake) out += `<path class="signal" d="M${(tX - 10).toFixed(1)},${(tY - 4).toFixed(1)} Q${((tX + bX) / 2).toFixed(1)},${(bY - 18).toFixed(1)} ${(bX + 9).toFixed(1)},${(bY - 6).toFixed(1)}"/>`;
        // 형질 세포: 수가 늘며 항체를 내뿜는다
        const nPl = lymph ? clamp(Math.ceil(Math.log2(1 + plasma)), 0, 6) : 0;
        for (let k = 0; k < nPl; k += 1) {
            const [dx, dy] = drift(k + 20, 3, 3), x = FX0 + 156 + k * 26 + dx, y = FY1 - 30 - (k % 2) * 14 + dy;
            out += cellAt('cell-plasma', x, y, 10);
            const puff = (t * 3 + k * 0.37) % 1;
            out += yShape(x + 10 + puff * 14, y - 8 - puff * 12, 'ab', 3, -30 + k * 20);
        }
        // 기억 세포
        for (let k = 0; k < (lymph ? mem : 0); k += 1) { const [dx, dy] = drift(k + 30, 2, 2); out += cellAt('cell-mem', FX1 - 26 - k * 22 + dx, FY0 + 22 + dy, 9); }

        // 오른쪽: 날짜, 수, 열 막대 (짧은 이름표만)
        const sick = P > SICK;
        out += `<text class="day-text" x="344" y="46">${fmtDay(t)}일째</text>`;
        out += `<text class="trait-text" style="fill:#7e22ce" x="344" y="70">병원체 ${P >= 1 ? fmtGerms(P) : '없음'}</text>`;
        out += `<text class="trait-text" style="fill:#047857" x="344" y="90">항체 ${fmtA(A)}</text>`;
        out += `<text class="small-label" x="344" y="114">열</text>`;
        out += `<rect class="fever" x="364" y="104" width="80" height="12" rx="6"/><rect class="fever-fill" x="366" y="106" width="${(76 * clamp(P >= 1 ? log10(P) / 9 : 0, 0, 1)).toFixed(1)}" height="8" rx="4"/>`;
        out += `<line class="fever-mark" x1="${(366 + 76 * 4 / 9).toFixed(1)}" y1="100" x2="${(366 + 76 * 4 / 9).toFixed(1)}" y2="120"/>`;
        out += `<text class="trait-text" style="fill:${sick ? '#dc2626' : '#475569'}" x="344" y="140">${sick ? '앓는 중' : P >= 1 ? '괜찮음' : '병원체 없음'}</text>`;
        // 범례
        const LY = 220, LY2 = 240;
        out += germShape(26, LY - 5, 0) + `<text class="legend-text" x="36" y="${LY}">병원체</text>`;
        out += yShape(96, LY - 5, 'ab', 4) + `<text class="legend-text" x="106" y="${LY}">항체</text>`;
        out += cellAt('cell-mac', 158, LY - 5, 8) + `<text class="legend-text" x="170" y="${LY}">큰포식세포</text>`;
        out += cellAt('cell-b', 262, LY - 5, 7) + `<text class="legend-text" x="273" y="${LY}">B 림프구</text>`;
        out += cellAt('cell-t', 352, LY - 5, 7) + `<text class="legend-text" x="363" y="${LY}">T 림프구</text>`;
        out += cellAt('cell-plasma', 26, LY2 - 5, 7) + `<text class="legend-text" x="37" y="${LY2}">형질 세포</text>`;
        out += cellAt('cell-mem', 120, LY2 - 5, 7) + `<text class="legend-text" x="131" y="${LY2}">기억 세포</text>`;
        if (nV || a.kind === 'vaccine') out += germShape(214, LY2 - 5, 0, 'germ vaccine') + `<text class="legend-text" x="224" y="${LY2}">백신 항원</text>`;

        // 세포 상태와 진행 단계는 그림 밖(HTML)에 짧게
        const memWord = !lymph ? '없음' : mem > memBefore ? (memBefore ? `${mem}배로 늘어남` : '이번에 새로 생김') : mem > 0 ? '전에 생긴 것이 있음' : a.kind === 'infect' && state.infect === 'other' ? '다른 병원체용만 있음' : '아직 없음';
        out += `<text class="prose">B 림프구: ${!lymph ? '없음' : awake ? '항원을 알아봄' : '대기'}</text>`;
        out += `<text class="prose">형질 세포: ${!lymph ? '없음' : nPl ? `${nPl}무리, 항체를 냄` : '아직 없음'}</text>`;
        out += `<text class="prose">기억 세포: ${memWord}</text>`;
        let phase;
        if (!lymph) phase = P > 0 ? '림프구가 없어 항체가 안 나옴' : '';
        else if (P < 1 && Ag < 100 && A < 1) phase = M > 0 ? '기억 세포가 지키는 중' : '아직 아무 일 없음';
        else if (act < 0.3 && A < 1) phase = M > 1 || (a.kind === 'infect' && state.infect === 'same') ? '기억 세포가 깨어나는 중 (하루 반쯤)' : '림프구가 깨어나는 중 (닷새쯤)';
        else if (P >= 1 && A >= 1) phase = '항체가 병원체에 붙어 치우는 중';
        else if (act >= 0.3) phase = '형질 세포가 항체를 쏟아냄';
        else phase = A >= 1 ? '항체가 남아 지킴' : '';
        if (phase) out += `<text class="prose" style="fill:#0f172a">지금: ${phase}</text>`;
        const title = a.kind === 'infect' ? `${INFECTS[state.infect].label} · ${DOSES[state.dose].hint}` : `${SHOTS[state.shot].label} · ${WHENS[state.when].label}`;
        const VERD = { week: `${run.sick.toFixed(1)}일 앓음`, days: `${run.sick.toFixed(1)}일 앓음`, none: run.sick > 0 ? `거의 앓지 않음 (${run.sick.toFixed(1)}일)` : '앓지 않음', unbeaten: '3주 뒤에도 병원체 그대로' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${state.progress >= 1 ? `${title}: ${VERD[a.verdict]}${run.clearDay !== null ? `, ${run.clearDay - (run.infectDay || 0) < 0.5 ? '반나절 안에' : `${fmtDay(run.clearDay - (run.infectDay || 0))}일 만에`} 병원체 사라짐` : ''}` : title}</text>`;
        out += `<text class="note-text" x="0" y="0">열 막대는 병원체 수(로그 눈금)이고, 세로 금(1만 마리)을 넘으면 열이 납니다.</text>`;
        return out;
    }

    function graphImmune(a) {
        const t = dayOf(a), { run } = a;
        const X0 = 56, X1 = 404, Y0 = 150, Y1 = 40, XM = X0 + (X1 - X0) * 0.42;
        const yP = P => Y0 - clamp(P >= 1 ? log10(P) / 9 : 0, 0, 1) * (Y0 - Y1);
        const yA = A => Y0 - clamp((log10(Math.max(A, 0.01)) + 2) / 5, 0, 1) * (Y0 - Y1);
        let xOf;
        if (a.kind === 'infect') xOf = d => X0 + d / a.tEnd * (X1 - X0);
        else if (a.segA) xOf = d => d <= a.segA[1] + 1e-6 ? X0 + d / a.segA[1] * (XM - 6 - X0) : d < a.segB[0] ? NaN : XM + 6 + (d - a.segB[0]) / (a.segB[1] - a.segB[0]) * (X1 - XM - 6);
        else xOf = d => d < a.segB[0] ? NaN : X0 + (d - a.segB[0]) / (a.segB[1] - a.segB[0]) * (X1 - X0);
        let out = `<text class="axis-title" x="${X0}" y="14">보라 선: 병원체 수(왼쪽 눈금) · 초록 선: 항체(오른쪽 눈금) · 붉은 띠: 열이 나는 범위</text>`;
        out += `<rect class="band" x="${X0}" y="${Y1}" width="${X1 - X0}" height="${(yP(SICK) - Y1).toFixed(1)}"/>`;
        [0, 2, 4, 6, 8].forEach(e => { out += `<line class="grid-line" x1="${X0}" y1="${yP(10 ** e).toFixed(1)}" x2="${X1}" y2="${yP(10 ** e).toFixed(1)}"/><text class="axis-text" style="fill:#c084fc" x="${X0 - 5}" y="${(yP(10 ** e) + 3.5).toFixed(1)}" text-anchor="end">${['1', '100', '1만', '100만', '1억'][e / 2]}</text>`; });
        [-2, -1, 0, 1, 2, 3].forEach(e => { out += `<text class="axis-text" style="fill:#059669" x="${X1 + 5}" y="${(yA(10 ** e) + 3.5).toFixed(1)}">${e < 0 ? (10 ** e).toFixed(-e) : 10 ** e}</text>`; });
        out += `<line class="ref-line" style="stroke:#059669" x1="${X0}" y1="${yA(1).toFixed(1)}" x2="${X1}" y2="${yA(1).toFixed(1)}"/>`;
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/><line class="axis" x1="${X1}" y1="${Y1}" x2="${X1}" y2="${Y0}"/>`;
        // ticks
        const ticks = [];
        if (a.kind === 'infect') for (let d = 0; d <= 21; d += 3) ticks.push([d, `${d}`]);
        else {
            if (a.segA) { for (let d = 0; d < a.segA[1]; d += 7) ticks.push([d, `${d}`]); out += `<path class="axis" d="M${(XM - 5).toFixed(1)},${Y0 + 5} L${(XM - 1).toFixed(1)},${Y0 - 5} M${(XM + 1).toFixed(1)},${Y0 + 5} L${(XM + 5).toFixed(1)},${Y0 - 5}"/><line class="ref-line" x1="${XM.toFixed(1)}" y1="${Y1}" x2="${XM.toFixed(1)}" y2="${Y0}"/>`; }
            for (let d = a.infectDay; d < a.segB[1] - 1; d += 7) ticks.push([d, `${d}`]);
        }
        ticks.forEach(([d, lab]) => { const x = xOf(d); if (!Number.isNaN(x)) out += `<text class="axis-text" x="${x.toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${lab}</text>`; });
        // exposure markers
        if (a.kind === 'vaccine') {
            for (let k = 0; k < a.n; k += 1) { const x = xOf(k * 21); out += `<polygon fill="#a78bfa" points="${x.toFixed(1)},${Y1 - 1} ${(x - 4).toFixed(1)},${Y1 - 7} ${(x + 4).toFixed(1)},${Y1 - 7}"/><text class="small-label" style="fill:#a78bfa" x="${x.toFixed(1)}" y="${Y1 - 9}" text-anchor="middle">접종</text>`; }
            const xi = xOf(a.infectDay); out += `<polygon fill="#c084fc" points="${xi.toFixed(1)},${Y1 - 1} ${(xi - 4).toFixed(1)},${Y1 - 7} ${(xi + 4).toFixed(1)},${Y1 - 7}"/><text class="small-label" style="fill:#c084fc" x="${xi.toFixed(1)}" y="${Y1 - 9}" text-anchor="middle">병원체</text>`;
        }
        let dP = '', dA = '', penUp = true;
        run.t.forEach((d, i) => {
            if (d > t) return;
            const x = xOf(d);
            if (Number.isNaN(x)) { penUp = true; return; }
            if (run.P[i] >= 1) { dP += `${penUp ? 'M' : 'L'}${x.toFixed(1)},${yP(run.P[i]).toFixed(1)} `; penUp = false; } else penUp = true;
            dA += `${dA ? 'L' : 'M'}${x.toFixed(1)},${yA(run.A[i]).toFixed(1)} `;
        });
        out += `<path class="trace" style="stroke:#059669" d="${dA}"/>`;
        out += `<path class="trace" style="stroke:#c084fc" d="${dP}"/>`;
        out += `<text class="axis-title" x="${((X0 + X1) / 2).toFixed(1)}" y="${Y0 + 30}" text-anchor="middle">${a.kind === 'infect' ? '병원체가 들어온 뒤 날수' : '첫 접종 뒤 날수 (점선 자리에서 몇 달을 건너뜀)'}</text>`;
        return out;
    }

    // blood: red cells carrying their antigens, plasma carrying its antibodies
    const AG_COLOR = { A: 'antigen-a', B: 'antigen-b', D: 'antigen-d' };
    const AB_STROKE = { A: '#d97706', B: '#0284c7', D: '#7c3aed' };
    function rbc(x, y, antigens, r = 7) {
        let s = `<circle class="rbc" cx="${x}" cy="${y}" r="${r}"/><circle class="rbc-hole" cx="${x}" cy="${y}" r="${r * 0.38}"/>`;
        antigens.forEach((ag, i) => {
            const ang = -Math.PI / 2 + i * 2.1, px = x + Math.cos(ang) * r, py = y + Math.sin(ang) * r;
            if (ag === 'A') s += `<polygon class="antigen-a" points="${px},${py - 3} ${px - 2.8},${py + 2} ${px + 2.8},${py + 2}"/>`;
            else if (ag === 'B') s += `<rect class="antigen-b" x="${px - 2.4}" y="${py - 2.4}" width="4.8" height="4.8"/>`;
            else s += `<polygon class="antigen-d" points="${px},${py - 3.2} ${px + 1},${py - 1} ${px + 3.2},${py - 1} ${px + 1.5},${py + 0.6} ${px + 2},${py + 3} ${px},${py + 1.6} ${px - 2},${py + 3} ${px - 1.5},${py + 0.6} ${px - 3.2},${py - 1} ${px - 1},${py - 1}"/>`;
        });
        return s;
    }

    function renderBlood(a) {
        const p = state.progress;
        const donorAg = [...ANTIGENS[a.d], 'D'];   // the donor is Rh⁺ in every setting here
        const recipAb = [...ANTIBODIES[a.r], ...(state.rh === 'second' ? ['D'] : [])];
        const recipAg = [...ANTIGENS[a.r], ...(state.rh === 'same' ? ['D'] : [])];
        let out = `<rect class="bag" x="20" y="44" width="96" height="120" rx="12"/><text class="small-label" x="68" y="38" text-anchor="middle">주는 사람 ${a.d}형 Rh⁺</text>`;
        out += `<text class="small-label" x="68" y="176" text-anchor="middle">응집원 ${donorAg.join('·')}</text>`;
        const bagSpots = [[44, 66], [78, 62], [96, 88], [40, 98], [66, 116], [94, 130], [50, 146]];
        const moved = Math.round(p * 8);
        bagSpots.forEach(([x, y], i) => { if (i >= moved) out += rbc(x, y, donorAg); });
        out += `<path class="tube" d="M116,104 C150,104 160,104 196,104"/>`;
        out += `<rect class="vein" x="196" y="52" width="248" height="104" rx="16"/><text class="small-label" x="320" y="46" text-anchor="middle">받는 사람 ${a.r}형 ${state.rh === 'same' ? 'Rh⁺' : 'Rh⁻'} — 혈장에 응집소 ${recipAb.length ? recipAb.map(x => `항${x}`).join('·') : '없음'}</text>`;
        // the recipient's own cells, faint
        [[420, 76], [426, 132], [396, 140]].forEach(([x, y]) => { out += `<g opacity=".45">${rbc(x, y, recipAg, 6)}</g>`; });
        // plasma antibodies drifting
        recipAb.forEach((ab, j) => { for (let k = 0; k < 6; k += 1) { const x = 214 + ((k * 41 + j * 17 + p * 30) % 200), y = 64 + ((k * 23 + j * 31) % 80); out += yShape(x, y, 'plasma-ab', 4).replace('class="plasma-ab"', `class="plasma-ab" style="stroke:${AB_STROKE[ab]}"`); } });
        // moved donor cells: spread out, or gather into a clump
        const clumpNow = a.verdict === 'clump';
        const cx = 300, cy = 104;
        for (let i = 0; i < moved; i += 1) {
            const spread = [[224, 80], [250, 124], [276, 72], [304, 126], [330, 82], [356, 120], [380, 76], [340, 100]][i];
            let x = spread[0], y = spread[1];
            if (clumpNow) { const g = clamp((p - 0.35) / 0.5, 0, 1); const ang = i * 0.785, rr = 16 * (1 - g) + 12; x = spread[0] + (cx + Math.cos(ang) * rr - spread[0]) * g; y = spread[1] + (cy + Math.sin(ang) * rr - spread[1]) * g; }
            out += rbc(x, y, donorAg);
            if (clumpNow && p > 0.6 && i > 0) { const prev = i - 1, ang0 = prev * 0.785, ang = i * 0.785; out += `<line class="clump-link" x1="${(cx + Math.cos(ang0) * 12).toFixed(1)}" y1="${(cy + Math.sin(ang0) * 12).toFixed(1)}" x2="${(cx + Math.cos(ang) * 12).toFixed(1)}" y2="${(cy + Math.sin(ang) * 12).toFixed(1)}"/>`; }
        }
        if (clumpNow && p > 0.6) { const hit = a.hits[0] || 'D'; out += yShape(cx, cy - 2, 'plasma-ab', 6).replace('class="plasma-ab"', `class="plasma-ab" style="stroke:${AB_STROKE[hit]};stroke-width:2.2"`); out += `<text class="trait-text" style="fill:#ff7a59" x="${cx}" y="${cy + 30}" text-anchor="middle">응집 — 항${hit} 응집소가 응집원 ${hit}를 붙잡음</text>`; }
        if (a.verdict === 'sensitize' && p > 0.6) { out += `<circle class="cell cell-b" cx="404" cy="118" r="7"/><text class="cell-text" x="404" y="134" text-anchor="middle">B 림프구</text>`; for (let k = 0; k < Math.round((p - 0.6) * 10); k += 1) out += yShape(388 + k * 8, 102, 'plasma-ab', 3).replace('class="plasma-ab"', 'class="plasma-ab" style="stroke:#7c3aed"'); out += `<text class="trait-text" style="fill:#7c3aed" x="320" y="146" text-anchor="middle">처음 본 응집원 D → 항D 응집소를 만들기 시작</text>`; }
        if (a.verdict === 'ok' && p >= 1) out += `<text class="trait-text" style="fill:#059669" x="320" y="146" text-anchor="middle">붙잡을 응집원이 없어 그대로 흐름</text>`;
        const VERD = { ok: '응집 없음 — 수혈 가능', clump: '응집 — 수혈 불가', sensitize: '이번엔 괜찮지만 항D 응집소가 생김' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${state.progress >= 1 ? `${a.d}형 → ${a.r}형 (${RHS[state.rh].label}): ${VERD[a.verdict]}` : `${a.d}형 적혈구 → ${a.r}형 (${RHS[state.rh].label})`}</text>`;
        out += `<text class="note-text" x="20" y="194">응집원 = 적혈구 표면의 표지 (세모 A · 네모 B · 별 D)</text><text class="note-text" x="20" y="208">응집소 = 혈장 속 Y (같은 색끼리 짝). 짝이 맞으면 적혈구가 뭉칩니다</text>`;
        return out;
    }

    function graphBlood(a) {
        const X = 122, Y = 48, W = 62, H = 24;
        let out = `<text class="axis-title" x="20" y="18">적혈구를 줄 수 있는 짝 — 가로: 주는 사람, 세로: 받는 사람 (ABO만)</text>`;
        ABO.forEach((d, i) => { out += `<text class="chart-text" x="${X + i * W + W / 2}" y="${Y - 8}" text-anchor="middle">${d}형</text>`; });
        ABO.forEach((r, j) => {
            out += `<text class="chart-text" x="${X - 8}" y="${Y + j * H + H / 2 + 4}" text-anchor="end">${r}형에게</text>`;
            ABO.forEach((d, i) => {
                const ok = !ANTIGENS[d].some(x => ANTIBODIES[r].includes(x));
                out += `<rect class="chart-cell ${ok ? 'chart-ok' : 'chart-bad'}" x="${X + i * W}" y="${Y + j * H}" width="${W}" height="${H}"/>`;
                out += `<text class="chart-text" style="fill:${ok ? '#059669' : '#dc2626'}" x="${X + i * W + W / 2}" y="${Y + j * H + H / 2 + 4}" text-anchor="middle">${ok ? '○' : '✕ 응집'}</text>`;
            });
        });
        out += `<rect class="chart-now" x="${X + ABO.indexOf(a.d) * W}" y="${Y + ABO.indexOf(a.r) * H}" width="${W}" height="${H}" rx="3"/>`;
        out += `<text class="trait-text" x="20" y="${Y + 4 * H + 22}">O형 적혈구에는 응집원이 없어 어느 줄에도 ○, AB형 혈장에는 응집소가 없어 어느 칸도 ○입니다.</text>`;
        out += `<text class="trait-text" x="20" y="${Y + 4 * H + 38}">Rh: 항D 응집소는 태어날 때 없고 Rh⁺ 피를 한 번 받은 뒤 생깁니다 — 첫 수혈은 무사해 보여도 두 번째는 응집.</text>`;
        return out;
    }

    function noteFor(a) {
        return '<p>수치·시간·증상 기준은 면역 기억을 설명하기 위해 정한 가상 값입니다. 실제 감염 기간이나 백신 접종 일정·효과를 예측하지 않습니다.</p><p>선천 면역과 후천 면역의 역할, 같은 항원에 재노출될 때 항체 반응의 차이를 비교하세요.</p>';
    }

    let lastMainHtml = null, lastGraphHtml = null;
    function render() {
        const a = analyse();
        const mainHtml = a.kind === 'blood' ? renderBlood(a) : renderImmune(a), graphHtml = a.kind === 'blood' ? graphBlood(a) : graphImmune(a);
        // 같은 그림이면 장면 그리기가 건너뛰므로, 이미 그림 밖으로 옮긴 글을 다시 비우지 않는다
        if (mainHtml !== lastMainHtml || graphHtml !== lastGraphHtml) {
            window.scienceScene.render(mainGroup, mainHtml);
            window.scienceScene.render(graphGroup, graphHtml);
            lastMainHtml = mainHtml; lastGraphHtml = graphHtml;
            liftProse();
        }
        stageBadge.textContent = a.kind === 'infect' ? `${INFECTS[state.infect].label} · ${DOSES[state.dose].label}` : a.kind === 'vaccine' ? `${SHOTS[state.shot].label} · ${WHENS[state.when].label}` : `${a.d}형 → ${a.r}형 · ${RHS[state.rh].label}`;
        methodHint.textContent = a.kind === 'infect' ? '면역 기억에 따른 항체 반응의 차이를 관찰하는 가상 모형입니다'
            : a.kind === 'vaccine' ? '백신은 항원에 대한 면역 반응과 기억을 유도합니다'
                : '받는 사람의 응집소가 주는 적혈구의 응집원을 붙잡으면 뭉칩니다';
        window.scienceScene.render(dataNote,noteFor(a));
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
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { state.progress = 1; finish(); return; }
        state.progress = 0;
        running = true;
        lastStamp = performance.now();
        render();
        frameId = requestAnimationFrame(frame);
    }

    function finish() {
        const a=render();resultEmpty.hidden=true;resultContent.hidden=false;
        const run=a.run,since=run.infectDay||0;
        labelA.textContent='열이 난 기간';valueA.textContent=run.sick<0.05?'열 없음':`${run.sick.toFixed(1)}일`;
        labelB.textContent='병원체가 사라진 때';valueB.textContent=run.clearDay===null?'3주 안에 못 치움':run.clearDay-since<0.5?'반나절 안':`들어온 뒤 ${fmtDay(run.clearDay-since)}일째`;
        predictionResult.textContent=!state.prediction?'다음에는 모형의 결과를 먼저 예상해 보세요.':state.prediction===a.verdict?'이 가상 모형의 예상이 맞았습니다.':'이 가상 모형의 결과와 다릅니다.';
        const why=a.kind==='infect'?({first:'처음 만난 병원체라 B 림프구가 알아보고 형질 세포가 항체를 내기까지 닷새쯤 걸렸고, 그동안 병원체가 늘었습니다. 이번 감염으로 기억 세포가 새로 생겼습니다. ',same:'두 달 전에 생긴 기억 세포가 하루 반 만에 깨어나 항체를 빨리, 많이 만들었습니다. ',other:'기억 세포는 있지만 다른 병원체용이라 이번 병원체에는 처음처럼 닷새쯤 걸렸습니다. ',nolymph:'림프구가 없어 항체가 나오지 않았고, 큰포식세포만으로는 늘어나는 병원체를 다 치우지 못했습니다. '})[state.infect]
            :a.n?'백신으로 생긴 기억 세포와 남은 항체 덕분에 진짜 병원체가 들어오자 곧바로 항체가 늘었습니다. ':'백신을 맞지 않아 처음 걸린 것과 같이 닷새쯤 뒤에야 항체가 나왔습니다. ';
        explanation.textContent=why+'특정 항원에 대한 면역 기억은 같은 항원에 다시 노출될 때 더 빠르고 강한 반응에 기여할 수 있습니다. B 림프구가 형질 세포로 분화하면 항체를 분비합니다. 그림의 수치·기간은 가상 조건이며 실제 감염, 접종 일정, 수혈이나 치료 결정을 위한 자료가 아닙니다.';
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
        checkBtn.textContent = state.mode === 'blood' ? '수혈하기' : '3주 흘려 보기';
        stageCaption.textContent = state.mode === 'infect' ? '보라 막대가 병원체, 초록 Y가 항체입니다. 병원체가 늘면 림프구가 깨어나고, 형질 세포가 낸 항체가 병원체에 달라붙습니다.'
            : state.mode === 'vaccine' ? '점선 막대는 백신 항원, 진한 보라 막대는 진짜 병원체입니다. 그래프 가운데 점선에서 몇 달을 건너뜁니다.'
                : '왼쪽 주머니의 적혈구가 관을 타고 받는 사람의 혈관으로 들어갑니다. 혈장 속 Y가 응집소입니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { infect: 'first', dose: 'small', shot: 'none', when: 'm1', donor: 'A', recip: 'B', rh: 'same', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'infect').click();
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

    window.__immuneModel = {
        INFECTS, DOSES, SHOTS, WHENS, ABO, RHS, state,
        analyse, render, immuneRun, runSeconds,
        setMode(m) { modeButtons.find(b => b.dataset.mode === m).click(); },
        set(key, value) { state[key] = value; buildControls(); buildPrediction(); settingsChanged(); },
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
