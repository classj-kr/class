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

    const GRAPH = { x0: 62, x1: 424, y0: 152, y1: 26 };
    const RUN_SECONDS = 8;

    /* ------------------------------------------------------- bean data */
    const BEAN_DAYS = 7;
    // How a seedling grows over a week under each condition. The pot with
    // everything (light, water, warmth) is the standard the others are held against.
    const STANDARD = { light: true, water: true, warm: true };
    function beanProfile(c) {
        if (!c.water) return { maxCm: 0, leaf: 0, hue: 'none', stem: 0, sprouts: false };
        if (!c.warm) return { maxCm: 1.2, leaf: 0.25, hue: c.light ? 'green' : 'yellow', stem: 0.7, sprouts: true };
        // in the dark the stem stretches after light and the leaves stay small and pale
        if (!c.light) return { maxCm: 18, leaf: 0.35, hue: 'yellow', stem: 0.6, sprouts: true };
        return { maxCm: 12, leaf: 1, hue: 'green', stem: 1, sprouts: true };
    }
    // seeds take about a day and a half to break the soil, then growth eases off
    const heightAt = (day, maxCm) => {
        const t = Math.max(0, day - 1.5);
        return maxCm * (t * t) / (t * t + 6);
    };

    /* -------------------------------------------------------- web data */
    // Grass, rabbits and foxes on a meadow. Grass regrows toward what the land
    // can carry; rabbits eat grass and are eaten by foxes. Starting at rest.
    const WEB = { rG: 1.0, KG: 100, a: 0.02, b: 0.5, dR: 0.3, c: 0.1, e: 0.2, dF: 0.4 };
    const START = { G: 60, R: 20, F: 3 };
    const WEB_MONTHS = 24, EVENT_MONTH = 3;
    const EVENTS = {
        none: { label: '아무 일 없음', hint: '그대로 둔다', note: '' },
        nofox: { label: '여우가 사라짐', hint: '모두 잡혀 감', note: '여우가 사라짐' },
        drought: { label: '가뭄', hint: '풀이 절반만 자람', note: '가뭄 시작' },
        disease: { label: '토끼 병', hint: '토끼 절반이 죽음', note: '토끼 병' },
    };

    const state = {
        mode: 'bean',
        light: true, water: true, warm: true,
        event: 'nofox',
        progress: 0, prediction: null,
    };
    let running = false, frameId = 0, lastStamp = 0;

    /* ------------------------------------------------------------ models */
    function analyseBean(s = state) {
        const cond = { light: s.light, water: s.water, warm: true };
        const mine = beanProfile(cond), base = beanProfile(STANDARD);
        const same = cond.light && cond.water && cond.warm;
        const finalCm = heightAt(BEAN_DAYS, mine.maxCm);
        const verdict = !mine.sprouts || finalCm < 3 ? 'none' : mine.hue === 'yellow' ? 'yellow' : 'green';
        const changed = ['light', 'water', 'warm'].filter(k => !cond[k]);
        return { kind: 'bean', cond, mine, base, same, finalCm, baseCm: heightAt(BEAN_DAYS, base.maxCm), verdict, changed };
    }

    function simulateWeb(event) {
        const p = { ...WEB };
        let { G, R, F } = START;
        const DT = 0.01;
        const path = [];
        let fired = false;
        for (let t = 0, i = 0; t <= WEB_MONTHS + 1e-9; t += DT, i += 1) {
            if (!fired && t >= EVENT_MONTH) {
                fired = true;
                if (event === 'nofox') F = 0;
                if (event === 'drought') p.KG = 50;
                if (event === 'disease') R *= 0.5;
            }
            if (i % 5 === 0) path.push({ t, G, R, F });
            const dG = p.rG * G * (1 - G / p.KG) - p.a * G * R;
            const dR = p.b * p.a * G * R - p.dR * R - p.c * R * F;
            const dF = p.e * p.c * R * F - p.dF * F;
            G = Math.max(0, G + dG * DT); R = Math.max(0, R + dR * DT); F = Math.max(0, F + dF * DT);
            if (F < 0.05) F = 0;
        }
        return path;
    }

    function analyseWeb(s = state) {
        const ev = EVENTS[s.event];
        const path = simulateWeb(s.event);
        const after = path.filter(q => q.t >= EVENT_MONTH + 1);
        const peak = k => Math.max(...after.map(q => q[k]));
        const low = k => Math.min(...after.map(q => q[k]));
        const end = path[path.length - 1];
        // a sharp fall right after the event counts as falling, even if the
        // rabbits recover later; otherwise judge by the half year that follows
        const soon = path.filter(q => q.t >= EVENT_MONTH && q.t <= EVENT_MONTH + 6);
        const meanR = soon.reduce((x, q) => x + q.R, 0) / soon.length;
        const dipR = Math.min(...path.filter(q => q.t >= EVENT_MONTH && q.t <= EVENT_MONTH + 3).map(q => q.R));
        const verdict = dipR < START.R * 0.75 ? 'rabbit-down' : meanR > START.R * 1.25 ? 'rabbit-up' : 'steady';
        return { kind: 'web', ev, path, peakR: peak('R'), lowR: low('R'), peakG: peak('G'), lowG: low('G'), lowF: low('F'), peakF: peak('F'), end, meanR, verdict };
    }

    const analyse = () => (state.mode === 'bean' ? analyseBean() : analyseWeb());

    const webAt = (a, p) => {
        const t = p * WEB_MONTHS;
        let lo = 0, hi = a.path.length - 1;
        while (lo < hi) { const mid = (lo + hi) >> 1; if (a.path[mid].t < t) lo = mid + 1; else hi = mid; }
        return a.path[lo];
    };

    /* ---------------------------------------------------------- controls */
    function pickRow(legend, name, options, current, cols) {
        return `<fieldset class="pick-field"><legend>${legend}</legend>` +
            `<div class="pick-buttons cols${cols}" data-pick="${name}">` +
            options.map(o => `<button type="button" data-value="${o.value}" class="${o.value === String(current) ? 'selected' : ''}">` +
                `${o.label}${o.hint ? `<small>${o.hint}</small>` : ''}</button>`).join('') +
            `</div></fieldset>`;
    }

    function buildControls() {
        if (state.mode === 'bean') {
            controlArea.innerHTML =
                pickRow('햇빛', 'light', [{ value: 'true', label: '햇빛이 드는 곳' }, { value: 'false', label: '어두운 상자 속' }], state.light, 2) +
                pickRow('물', 'water', [{ value: 'true', label: '날마다 물을 줌' }, { value: 'false', label: '물을 주지 않음' }], state.water, 2);
        } else {
            controlArea.innerHTML =
                pickRow(`${EVENT_MONTH}달째에 일어나는 일`, 'event', Object.entries(EVENTS).map(([k, v]) => ({ value: k, label: v.label, hint: v.hint })), state.event, 2);
        }
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                const v = button.dataset.value;
                state[group.dataset.pick] = group.dataset.pick === 'event' ? v : v === 'true';
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                settingsChanged();
            }));
        });
    }

    const PRED_BEAN = [{ value: 'green', label: '푸르고 튼튼하게 자란다' }, { value: 'yellow', label: '노랗고 길쭉하게 자란다' }, { value: 'none', label: '거의 자라지 않는다' }];
    const PRED_WEB = [{ value: 'rabbit-up', label: '토끼가 늘어난다' }, { value: 'rabbit-down', label: '토끼가 줄어든다' }, { value: 'steady', label: '거의 변하지 않는다' }];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list = state.mode === 'bean' ? PRED_BEAN : PRED_WEB;
        predictionLegend.textContent = state.mode === 'bean' ? `${BEAN_DAYS}일 뒤 강낭콩은 어떻게 되어 있을까요?` : '그 뒤 토끼 수는 어떻게 될까요?';
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    const HUES = { green: { stem: '#5fae4a', leaf: '#6cc25a' }, yellow: { stem: '#d9d26a', leaf: '#e6de7a' }, none: { stem: '#8a7a5a', leaf: '#8a7a5a' } };
    const PX_PER_CM = 6;

    function drawPot(cx, cond, profile, day, title) {
        const SOIL_Y = 172;
        let out = '';
        out += `<text class="pot-title" x="${cx}" y="30" text-anchor="middle">${title}</text>`;
        // condition icons: sun, drop, thermometer reading
        out += `<circle class="sun${cond.light ? '' : ' off'}" cx="${cx - 34}" cy="46" r="7"/>`;
        out += `<path class="drop${cond.water ? '' : ' off'}" d="M${cx},39 q6,8 0,14 q-6,-6 0,-14 z"/>`;
        out += `<text class="cond-text" x="${cx + 34}" y="50" text-anchor="middle">${cond.warm ? '25 ℃' : '5 ℃'}</text>`;
        // pot and soil
        out += `<g transform="translate(${cx - 36}, ${SOIL_Y - 4}) scale(0.72, 0.65)">` +
               `<path class="pot" d="M 18 42 L 82 42 L 72 86 L 28 86 Z M 14 34 L 86 34 L 86 42 L 14 42 Z"/>` +
               `</g>`;
        out += `<rect class="soil" x="${cx - 30}" y="${SOIL_Y + 1}" width="60" height="6" rx="2"/>`;
        const h = heightAt(day, profile.maxCm);
        if (!profile.sprouts) {
            out += `<ellipse class="seed" cx="${cx}" cy="${SOIL_Y - 1}" rx="5" ry="3.2"/>`;
            if (day > 2) out += `<text class="note-text" x="${cx}" y="${SOIL_Y - 14}" text-anchor="middle">싹이 나지 않음</text>`;
        } else if (h > 0.05) {
            const top = SOIL_Y - 4 - h * PX_PER_CM;
            const hue = HUES[profile.hue];
            out += `<path class="stem" stroke="${hue.stem}" stroke-width="${(3 * profile.stem).toFixed(1)}" d="M${cx},${SOIL_Y - 4} Q${cx + 4},${((SOIL_Y - 4 + top) / 2).toFixed(1)} ${cx},${top.toFixed(1)}"/>`;
            const ls = Math.min(1, h / 3) * profile.leaf;
            const rx = 13 * ls, ry = 7 * ls;
            if (ls > 0.05) {
                out += `<ellipse class="leaf" fill="${hue.leaf}" cx="${(cx - rx * 0.9).toFixed(1)}" cy="${(top + 2).toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" transform="rotate(-20 ${(cx - rx * 0.9).toFixed(1)} ${(top + 2).toFixed(1)})"/>`;
                out += `<ellipse class="leaf" fill="${hue.leaf}" cx="${(cx + rx * 0.9).toFixed(1)}" cy="${(top + 2).toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" transform="rotate(20 ${(cx + rx * 0.9).toFixed(1)} ${(top + 2).toFixed(1)})"/>`;
                if (h > 8) {
                    // bean pod when well grown
                    out += `<path d="M ${cx - 2} ${top + 24} C ${cx - 10} ${top + 28} ${cx - 12} ${top + 38} ${cx - 4} ${top + 42}" stroke="${hue.leaf}" stroke-width="2.5" fill="none"/>`;
                }
            }
        }
        // the reading sits on the face of the pot
        out += `<text class="read-text" style="fill:#fff6e8" x="${cx}" y="${SOIL_Y + 26}" text-anchor="middle">${h.toFixed(1)} cm</text>`;
        return out;
    }

    function renderBean(a, p) {
        const day = p * BEAN_DAYS;
        let out = '';
        // a ruler between the pots
        const SOIL_Y = 172;
        for (let cm = 0; cm <= 18; cm += 2) {
            const y = SOIL_Y - 4 - cm * PX_PER_CM;
            out += `<line class="ruler" x1="196" y1="${y}" x2="${cm % 6 === 0 ? 206 : 202}" y2="${y}"/>`;
            if (cm % 6 === 0) out += `<text class="axis-text" x="210" y="${y + 3}">${cm} cm</text>`;
        }
        out += drawPot(110, STANDARD, a.base, day, '기준 화분');
        out += drawPot(300, a.cond, a.mine, day, a.same ? '내 화분 (기준과 같음)' : '내 화분');
        // right-hand notes
        out += `<text class="part-label" x="372" y="84">${Math.floor(day) === 0 && p < 0.02 ? '씨를 심은 날' : `${Math.min(BEAN_DAYS, Math.floor(day) + (p >= 1 ? 0 : 1))}일째`}</text>`;
        out += `<text class="note-text" x="372" y="104">잎: ${a.mine.sprouts && heightAt(day, a.mine.maxCm) > 0.5 ? (a.mine.hue === 'green' ? '푸름' : '노랗고 작음') : '없음'}</text>`;
        out += `<text class="note-text" x="372" y="120">줄기: ${a.mine.sprouts && heightAt(day, a.mine.maxCm) > 0.5 ? (a.mine.stem >= 1 ? '굵고 곧음' : '가늘고 약함') : '없음'}</text>`;
        const VERD = { green: '푸르고 튼튼하게 자란다', yellow: '노랗고 길쭉하게 자란다', none: '거의 자라지 않는다' };
        out += `<text class="verdict-text" fill="#6cc25a" x="20" y="16">${a.changed.length ? `${a.changed.map(k => ({ light: '햇빛', water: '물', warm: '따뜻함' })[k]).join('·')} 없이 기르면` : '햇빛·물·따뜻함을 모두 주면'} → ${VERD[a.verdict]}</text>`;
        return out;
    }

    function renderWeb(a, p) {
        const q = webAt(a, p);
        const MX = 20, MY = 40, MW = 280, MH = 150;
        let out = `<rect class="meadow" x="${MX}" y="${MY}" width="${MW}" height="${MH}" rx="8"/>`;
        // grass tufts, one per 3 units, in fixed spots so they only appear or vanish
        const tufts = Math.round(q.G / 3);
        for (let i = 0; i < tufts; i += 1) {
            const x = MX + 12 + ((i * 53) % (MW - 24)), y = MY + 20 + ((i * 37) % (MH - 30));
            out += `<path class="grass" d="M${x},${y} l-3,-9 M${x},${y} l0,-11 M${x},${y} l3,-9"/>`;
        }
        // rabbits, one per two animals; foxes one each
        const rabbits = Math.round(q.R / 2);
        for (let i = 0; i < rabbits; i += 1) {
            const x = MX + 20 + ((i * 71 + 13) % (MW - 40)), y = MY + 26 + ((i * 43 + 7) % (MH - 40));
            out += `<ellipse class="rabbit" cx="${x}" cy="${y}" rx="5" ry="3.4"/><ellipse class="rabbit" cx="${x + 4}" cy="${y - 4}" rx="1.4" ry="3.4"/>`;
        }
        const foxes = Math.round(q.F);
        for (let i = 0; i < foxes; i += 1) {
            const x = MX + 40 + ((i * 97 + 31) % (MW - 80)), y = MY + 40 + ((i * 61 + 19) % (MH - 60));
            out += `<path class="fox" d="M${x - 8},${y + 3} L${x + 8},${y + 3} L${x + 4},${y - 5} L${x},${y - 1} L${x - 4},${y - 5} Z"/>`;
        }
        // counts at the right
        out += `<text class="part-label" x="318" y="60">${Math.floor(q.t)}달째</text>`;
        out += `<text class="count-text" style="fill:#059669" x="318" y="88">풀 ${Math.round(q.G)}</text>`;
        out += `<text class="count-text" style="fill:#334155" x="318" y="112">토끼 ${Math.round(q.R)}마리</text>`;
        out += `<text class="count-text" style="fill:#ea580c" x="318" y="136">여우 ${Math.round(q.F)}마리</text>`;
        out += `<text class="note-text" x="318" y="160">처음: 풀 ${START.G} · 토끼 ${START.R} · 여우 ${START.F}</text>`;
        if (a.ev.note && q.t >= EVENT_MONTH) out += `<text class="event-text" x="318" y="180">${EVENT_MONTH}달째 ${a.ev.note}</text>`;
        const VERD = { 'rabbit-up': '토끼가 늘어난다', 'rabbit-down': '토끼가 줄어든다', steady: '거의 변하지 않는다' };
        out += `<text class="verdict-text" fill="#0f172a" x="20" y="16">${a.ev.label} → 그 뒤 ${VERD[a.verdict]}</text>`;
        out += `<text class="note-text" x="20" y="206">그림의 풀 한 포기 = 풀 3 · 토끼 한 마리 그림 = 2마리 · 여우는 한 마리씩</text>`;
        return out;
    }

    function renderMain(a) {
        mainGroup.innerHTML = a.kind === 'bean' ? renderBean(a, state.progress) : renderWeb(a, state.progress);
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

    // height against days, my pot solid and the standard pot dashed
    function graphBean(a) {
        const day = state.progress * BEAN_DAYS;
        const gx = d => GRAPH.x0 + (d / BEAN_DAYS) * (GRAPH.x1 - GRAPH.x0);
        const gy = cm => GRAPH.y0 - (cm / 18) * (GRAPH.y0 - GRAPH.y1);
        let out = graphFrame(
            [0, 1, 2, 3, 4, 5, 6, 7].map(d => [d, gx(d)]),
            [0, 6, 12, 18].map(cm => [`${cm} cm`, gy(cm)]),
            '심은 뒤 지난 날', '키');
        const line = (maxCm, upTo, cls, colour) => {
            const pts = [];
            for (let d = 0; d <= upTo + 1e-9; d += 0.1) pts.push(`${gx(d).toFixed(1)},${gy(heightAt(d, maxCm)).toFixed(1)}`);
            return pts.length > 1 ? `<path class="${cls}" style="stroke:${colour}" d="M${pts.join('L')}"/>` : '';
        };
        if (!a.same) out += line(a.base.maxCm, BEAN_DAYS, 'trace other', '#16a34a');
        const mineColour = a.mine.hue === 'yellow' ? '#d97706' : a.mine.hue === 'green' ? '#0284c7' : '#64748b';
        const mineTextColour = a.mine.hue === 'yellow' ? '#b45309' : mineColour;
        out += line(a.mine.maxCm, day, 'trace', mineColour);
        out += `<circle class="trace-dot" cx="${gx(day).toFixed(1)}" cy="${gy(heightAt(day, a.mine.maxCm)).toFixed(1)}" r="5" fill="${mineColour}"/>`;
        out += `<text class="axis-text" style="fill:${mineTextColour}" x="${GRAPH.x0 + 8}" y="${GRAPH.y1 + 14}">— 내 화분</text>`;
        if (!a.same) out += `<text class="axis-text" style="fill:#15803d" x="${GRAPH.x0 + 78}" y="${GRAPH.y1 + 14}">- - 기준 화분</text>`;
        return out;
    }

    // three strips, one per living thing, each on its own scale
    function graphWeb(a) {
        const tNow = state.progress * WEB_MONTHS;
        const rows = [
            { key: 'G', name: '풀', colour: '#16a34a', textColour: '#15803d', max: 100 },
            { key: 'R', name: '토끼', colour: '#64748b', textColour: '#334155', max: 50 },
            { key: 'F', name: '여우', colour: '#ea580c', textColour: '#c2410c', max: 6 },
        ];
        const X0 = 70, X1 = 424, H = 40, TOP = 14, GAP = 10;
        const gx = t => X0 + (t / WEB_MONTHS) * (X1 - X0);
        let out = '';
        rows.forEach((r, i) => {
            const y0 = TOP + i * (H + GAP) + H;
            const gy = v => y0 - Math.min(1, v / r.max) * H;
            out += `<line class="axis" x1="${X0}" y1="${y0}" x2="${X1}" y2="${y0}"/>`;
            out += `<text class="strip-title" fill="${r.textColour}" x="${X0 - 8}" y="${y0 - H / 2 + 4}" text-anchor="end">${r.name}</text>`;
            out += `<text class="axis-text" x="${X0 - 8}" y="${y0 - H + 4}" text-anchor="end">${r.max}</text>`;
            const done = a.path.map(q => `${gx(q.t).toFixed(1)},${gy(q[r.key]).toFixed(1)}`);
            out += `<path class="trace-done" d="M${done.join('L')}"/>`;
            const live = a.path.filter(q => q.t <= tNow + 1e-9).map(q => `${gx(q.t).toFixed(1)},${gy(q[r.key]).toFixed(1)}`);
            if (live.length > 1) out += `<path class="trace" style="stroke:${r.colour}" d="M${live.join('L')}"/>`;
            const now = webAt(a, state.progress);
            out += `<circle class="trace-dot" cx="${gx(now.t).toFixed(1)}" cy="${gy(now[r.key]).toFixed(1)}" r="4" fill="${r.colour}"/>`;
            if (a.ev.note) out += `<line class="event-line" x1="${gx(EVENT_MONTH).toFixed(1)}" y1="${y0 - H}" x2="${gx(EVENT_MONTH).toFixed(1)}" y2="${y0}"/>`;
        });
        const lastY0 = TOP + 2 * (H + GAP) + H;
        [0, 6, 12, 18, 24].forEach(m => {
            out += `<text class="axis-text" x="${gx(m).toFixed(1)}" y="${lastY0 + 14}" text-anchor="middle">${m}</text>`;
        });
        out += `<text class="axis-title" x="${((X0 + X1) / 2).toFixed(1)}" y="${lastY0 + 27}" text-anchor="middle">지난 달 수</text>`;
        if (a.ev.note) out += `<text class="event-text" x="${(gx(EVENT_MONTH) + 4).toFixed(1)}" y="${TOP + 9}">${a.ev.note}</text>`;
        return out;
    }

    function noteFor(a) {
        if (a.kind === 'bean') {
            const day = state.progress * BEAN_DAYS;
            const c = a.cond;
            return `<div class="data-row"><span class="data-name">내 화분</span><span class="data-val">햇빛 ${c.light ? '있음' : '없음'} · 물 ${c.water ? '줌' : '안 줌'} · ${c.warm ? '따뜻함' : '차가움'}</span></div>` +
                `<div class="data-row"><span class="data-name">기준 화분</span><span class="data-val">햇빛 있음 · 물 줌 · 따뜻함</span></div>` +
                `<div class="data-row"><span class="data-name">바꾼 조건</span><span class="data-val">${a.changed.length ? a.changed.map(k => ({ light: '햇빛', water: '물', warm: '온도' })[k]).join(', ') : '없음 — 기준과 같음'}${a.changed.length > 1 ? ' (둘 이상 바꾸면 무엇 때문인지 알기 어렵습니다)' : ''}</span></div>` +
                `<div class="data-row"><span class="data-name">지금 키</span><span class="data-val">내 화분 ${heightAt(day, a.mine.maxCm).toFixed(1)} cm · 기준 ${heightAt(day, a.base.maxCm).toFixed(1)} cm</span></div>` +
                `<div class="data-row match"><span class="data-name">${BEAN_DAYS}일 뒤</span><span class="data-val">${a.mine.sprouts ? `${a.finalCm.toFixed(1)} cm · 잎 ${a.mine.hue === 'green' ? '푸름' : '노랗고 작음'} · 줄기 ${a.mine.stem >= 1 ? '굵음' : '가늚'}` : '싹이 나지 않음'}</span></div>`;
        }
        const q = webAt(a, state.progress);
        return `<div class="data-row"><span class="data-name">일어난 일</span><span class="data-val">${a.ev.label}${a.ev.note ? ` (${EVENT_MONTH}달째)` : ''}</span></div>` +
            `<div class="data-row"><span class="data-name">지금</span><span class="data-val">${q.t.toFixed(1)}달 · 풀 ${Math.round(q.G)} · 토끼 ${Math.round(q.R)} · 여우 ${Math.round(q.F)}</span></div>` +
            `<div class="data-row"><span class="data-name">토끼</span><span class="data-val">일 뒤 가장 많을 때 ${Math.round(a.peakR)} · 가장 적을 때 ${Math.round(a.lowR)}</span></div>` +
            `<div class="data-row"><span class="data-name">풀</span><span class="data-val">일 뒤 가장 많을 때 ${Math.round(a.peakG)} · 가장 적을 때 ${Math.round(a.lowG)}</span></div>` +
            `<div class="data-row match"><span class="data-name">${WEB_MONTHS}달 뒤</span><span class="data-val">풀 ${Math.round(a.end.G)} · 토끼 ${Math.round(a.end.R)} · 여우 ${Math.round(a.end.F)}</span></div>`;
    }

    function render() {
        const a = analyse();
        renderMain(a);
        graphGroup.innerHTML = a.kind === 'bean' ? graphBean(a) : graphWeb(a);
        stageBadge.textContent = a.kind === 'bean'
            ? (a.changed.length ? `${a.changed.map(k => ({ light: '햇빛', water: '물', warm: '따뜻함' })[k]).join('·')} 없음` : '기준과 같음')
            : a.ev.label;
        methodHint.textContent = state.mode === 'bean'
            ? '한 가지 조건만 바꾸고 나머지는 기준 화분과 똑같이 해야 무엇 때문인지 알 수 있습니다'
            : '먹고 먹히는 관계로 이어져 있어 한 생물이 바뀌면 다른 생물도 바뀝니다';
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
        if (a.kind === 'bean') {
            labelA.textContent = `${BEAN_DAYS}일 뒤 키`; labelB.textContent = '기준 화분';
            valueA.textContent = a.mine.sprouts ? `${a.finalCm.toFixed(1)} cm` : '싹 없음';
            valueB.textContent = `${a.baseCm.toFixed(1)} cm`;
            predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
                : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
            let s = '';
            if (a.same) s = `햇빛·물·따뜻함을 모두 준 화분은 ${BEAN_DAYS}일 뒤 ${a.finalCm.toFixed(1)} cm까지 자라고 잎이 푸르고 줄기가 굵습니다. 이것이 기준입니다. 조건 하나를 빼고 다시 길러 견주어 보세요.`;
            else if (!a.cond.water) s = `물을 주지 않은 강낭콩은 싹조차 나지 않았습니다. 씨가 싹을 내려면 물을 빨아들여야 하기 때문입니다. 햇빛과 따뜻함이 있어도 물이 없으면 소용이 없습니다.`;
            else if (!a.cond.warm) s = `차가운 곳에서는 싹이 늦게 나고 ${BEAN_DAYS}일 동안 ${a.finalCm.toFixed(1)} cm밖에 자라지 못했습니다. 기준 화분은 같은 기간에 ${a.baseCm.toFixed(1)} cm입니다. 식물도 따뜻해야 잘 자랍니다.`;
            else s = `어두운 상자 속 강낭콩은 ${a.finalCm.toFixed(1)} cm로 기준 화분(${a.baseCm.toFixed(1)} cm)보다 오히려 키가 큽니다. 하지만 빛을 찾느라 줄기만 가늘고 길게 뻗은 것이고, 잎은 노랗고 작습니다. 햇빛이 있어야 잎이 푸르게 되고 튼튼하게 자랍니다.`;
            if (a.changed.length > 1) s += ` 이번에는 조건을 ${a.changed.length}가지나 바꿔서 무엇 때문에 달라졌는지 가려내기 어렵습니다. 한 가지만 바꿔 보세요.`;
            explanation.textContent = s;
            return;
        }
        labelA.textContent = '토끼 (가장 많을 때 / 적을 때)'; labelB.textContent = `${WEB_MONTHS}달 뒤`;
        valueA.textContent = `${Math.round(a.peakR)} / ${Math.round(a.lowR)}마리`;
        valueB.textContent = `풀 ${Math.round(a.end.G)} · 토끼 ${Math.round(a.end.R)} · 여우 ${Math.round(a.end.F)}`;
        predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        let s = '';
        if (state.event === 'none') s = `아무 일도 일어나지 않으면 풀 ${START.G}, 토끼 ${START.R}마리, 여우 ${START.F}마리가 거의 그대로 이어집니다. 풀이 자라는 만큼 토끼가 먹고, 토끼가 늘어나는 만큼 여우가 먹어 균형이 맞기 때문입니다.`;
        else if (state.event === 'nofox') s = `여우가 사라지자 잡아먹히지 않은 토끼가 ${START.R}마리에서 ${Math.round(a.peakR)}마리까지 늘었습니다. 그러자 풀이 ${START.G}에서 ${Math.round(a.lowG)}까지 줄어 토끼도 먹을 것이 모자라 다시 줄었고, ${WEB_MONTHS}달 뒤 토끼 ${Math.round(a.end.R)}마리·풀 ${Math.round(a.end.G)} 근처에서 오르내립니다. 여우가 없어져 토끼가 좋아진 것만은 아닙니다.`;
        else if (state.event === 'drought') s = `가뭄으로 풀이 절반밖에 자라지 못하자 풀이 ${Math.round(a.lowG)}까지 줄었고, 먹을 것이 모자란 토끼는 ${Math.round(a.lowR)}마리까지 줄었습니다. 풀을 먹지 않는 여우도 토끼가 줄어 ${a.lowF < 0.5 ? '거의 사라졌습니다' : `${Math.round(a.lowF)}마리로 줄었습니다`}. 풀 → 토끼 → 여우로 이어져 있어 환경이 바뀌면 모두 영향을 받습니다.`;
        else s = `병으로 토끼가 절반으로 줄자 먹이가 모자란 여우가 ${START.F}마리에서 ${Math.round(a.lowF)}마리로 줄었고, 먹는 동물이 줄어든 풀은 ${Math.round(a.peakG)}까지 늘었습니다. 그 뒤 토끼가 다시 늘면서 ${WEB_MONTHS}달 뒤에는 풀 ${Math.round(a.end.G)}·토끼 ${Math.round(a.end.R)}·여우 ${Math.round(a.end.F)}로 천천히 돌아옵니다.`;
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
        stageCaption.textContent = state.mode === 'bean'
            ? '왼쪽은 햇빛·물·따뜻함을 모두 준 기준 화분, 오른쪽은 내가 고른 조건의 화분입니다.'
            : `${EVENT_MONTH}달째에 일이 일어난 뒤 풀·토끼·여우의 수가 차례로 어떻게 바뀌는지 보세요.`;
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { light: true, water: true, warm: true, event: 'nofox', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'bean').click();
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

    window.__livingModel = {
        EVENTS, START, WEB, BEAN_DAYS, WEB_MONTHS, EVENT_MONTH, state,
        analyseBean, analyseWeb, analyse, simulateWeb, heightAt, beanProfile, render,
        runSeconds: () => RUN_SECONDS,
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
