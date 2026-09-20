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
    const G = 9.8;
    // seesaw: a 4 m, 8 kg board; the red 20 kg box sits 1 m right of the middle; positions are metres from the middle
    const BOARD_L = 4, BOARD_M = 8, MB = 20, XB = 1.0, PIVOT_H = 0.45;
    const PIVOTS = { center: { label: '가운데', hint: '판 무게 균형', p: 0 }, left: { label: '왼쪽으로 0.5 m', hint: '판 무게도 한몫', p: -0.5 } };
    const MASSES = { m10: { label: '10 kg', m: 10 }, m20: { label: '20 kg', m: 20 }, m40: { label: '40 kg', m: 40 } };
    const DISTS = { d05: { label: '0.5 m', hint: '가운데에서 왼쪽으로', d: 0.5 }, d10: { label: '1 m', hint: '가운데에서 왼쪽으로', d: 1 }, d15: { label: '1.5 m', hint: '가운데에서 왼쪽으로', d: 1.5 } };
    // box on a tilting board
    const SHAPES = { wide: { label: '넓적한 상자', hint: '폭 0.6 m · 높이 0.3 m', w: 0.6, h: 0.3 }, cube: { label: '정육면체', hint: '0.4 m', w: 0.4, h: 0.4 }, tall: { label: '높은 병', hint: '폭 0.2 m · 높이 0.6 m', w: 0.2, h: 0.6 } };
    const FLOORS = { rough: { label: '거친 바닥', hint: '마찰 계수 1.2 (고무)', mu: 1.2 }, smooth: { label: '매끄러운 바닥', hint: '마찰 계수 0.3 (얼음)', mu: 0.3 } };
    const ANGLES = { a15: { label: '15°', deg: 15 }, a35: { label: '35°', deg: 35 }, a55: { label: '55°', deg: 55 } };
    // plank on two stands: 2 m, 4 kg; stands at 0.3 m and 1.3 m from the left end
    const PL_L = 2, PL_M = 4, S1 = 0.3, S2 = 1.3;
    const LOADS = { m5: { label: '5 kg', m: 5 }, m10: { label: '10 kg', m: 10 }, m20: { label: '20 kg', m: 20 } };
    const SPOTS = { x05: { label: '두 받침 사이 왼쪽', hint: '왼쪽 끝에서 0.5 m', x: 0.5 }, x10: { label: '두 받침 사이 오른쪽', hint: '1.0 m', x: 1.0 }, x15: { label: '오른쪽 받침 바깥', hint: '1.5 m', x: 1.5 }, x19: { label: '오른쪽 끝자락', hint: '1.9 m', x: 1.9 } };

    const state = { mode: 'seesaw', pivot: 'center', mass: 'm10', dist: 'd10', shape: 'tall', floor: 'rough', angle: 'a35', load: 'm10', spot: 'x10', progress: 0, prediction: null };
    let running = false, frameId = 0, lastStamp = 0;

    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const RAD = Math.PI / 180;
    const fmt = (n, d = 0) => (+n.toFixed(d)).toLocaleString('ko-KR', { minimumFractionDigits: d, maximumFractionDigits: d }).replace('-', '−');
    const jong = ch => { const c = ch.charCodeAt(0); return c >= 0xac00 && c <= 0xd7a3 ? (c - 0xac00) % 28 : 0; };
    const lastDigit = str => (String(str).match(/\d(?!.*\d)/) || [''])[0];
    // 을/를 after a Korean word, or after a number read aloud (영 일 이 삼 사 오 육 칠 팔 구)
    const eul = word => jong(word[word.length - 1]) ? '을' : '를';
    const eulNum = num => '013678'.includes(lastDigit(num)) ? '을' : '를';
    const ease = p => p < 0.5 ? 2 * p * p : 1 - (1 - p) * (1 - p) * 2;

    /* ------------------------------------------------------------ models */
    const cache = {};
    function seesawRun(p, mA, dA) {
        const key = `${p}|${mA}|${dA}`;
        if (cache[key]) return cache[key];
        // torques about the pivot; positive turns the right end down
        const parts = [
            { name: '파란 상자', m: mA, x: -dA },
            { name: '판 (8 kg)', m: BOARD_M, x: 0 },
            { name: '붉은 상자', m: MB, x: XB },
        ].map(o => ({ ...o, arm: o.x - p, tau: o.m * G * (o.x - p) }));
        const tau = parts.reduce((s, o) => s + o.tau, 0);
        const I = mA * (-dA - p) ** 2 + MB * (XB - p) ** 2 + BOARD_M * (BOARD_L * BOARD_L / 12 + p * p);
        const maxRight = Math.asin(PIVOT_H / (BOARD_L / 2 - p)), maxLeft = Math.asin(PIVOT_H / (BOARD_L / 2 + p));
        const phi = [];
        let f = 0, w = 0;
        for (let t = 0; t <= 4 + 1e-9; t += 0.02) {
            phi.push(f);
            const alpha = Math.abs(tau) < 1e-6 ? 0 : tau / I - 1.2 * w;
            w += alpha * 0.02; f += w * 0.02;
            if (f > maxRight) { f = maxRight; w = 0; }
            if (f < -maxLeft) { f = -maxLeft; w = 0; }
        }
        const out = { parts, tau, I, phi, maxRight, maxLeft, verdict: Math.abs(tau) < 0.5 ? 'balance' : tau < 0 ? 'left' : 'right' };
        cache[key] = out;
        return out;
    }

    function analyse() {
        if (state.mode === 'seesaw') {
            const p = PIVOTS[state.pivot].p, mA = MASSES[state.mass].m, dA = DISTS[state.dist].d;
            const run = seesawRun(p, mA, dA);
            return { kind: 'seesaw', p, mA, dA, run, verdict: run.verdict };
        }
        if (state.mode === 'tip') {
            const sh = SHAPES[state.shape], mu = FLOORS[state.floor].mu, deg = ANGLES[state.angle].deg;
            const tan = Math.tan(deg * RAD), ratio = sh.w / sh.h;
            const slideAt = Math.atan(mu) / RAD, tipAt = Math.atan(ratio) / RAD;
            const verdict = deg <= Math.min(slideAt, tipAt) ? 'stay' : slideAt < tipAt ? 'slide' : 'tip';
            return { kind: 'tip', sh, mu, deg, tan, ratio, slideAt, tipAt, verdict };
        }
        const m = LOADS[state.load].m, x = SPOTS[state.spot].x;
        const N2 = G * (PL_M * (PL_L / 2 - S1) + m * (x - S1)) / (S2 - S1);
        const N1 = (PL_M + m) * G - N2;
        return { kind: 'plank', m, x, N1, N2, W: (PL_M + m) * G, verdict: N1 <= 0 ? 'tip' : N1 > N2 ? 'left' : 'right' };
    }
    const runSeconds = () => state.mode === 'seesaw' ? 4 : 5;

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
        if (state.mode === 'seesaw') controlArea.innerHTML = pickRow('받침점', 'pivot', opts(PIVOTS), state.pivot, 2) + pickRow('파란 상자 무게', 'mass', opts(MASSES), state.mass, 3) + pickRow('파란 상자 자리', 'dist', opts(DISTS), state.dist, 3);
        else if (state.mode === 'tip') controlArea.innerHTML = pickRow('물체', 'shape', opts(SHAPES), state.shape, 3) + pickRow('바닥', 'floor', opts(FLOORS), state.floor, 2) + pickRow('기울기', 'angle', opts(ANGLES), state.angle, 3);
        else controlArea.innerHTML = pickRow('물건 무게', 'load', opts(LOADS), state.load, 3) + pickRow('놓는 자리', 'spot', opts(SPOTS), state.spot, 2);
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                buildPrediction();
                settingsChanged();
            }));
        });
    }

    const PRED_S = [{ value: 'left', label: '왼쪽(파란 쪽)이 내려감' }, { value: 'balance', label: '수평으로 평형' }, { value: 'right', label: '오른쪽(붉은 쪽)이 내려감' }];
    const PRED_T = [{ value: 'stay', label: '그대로 버팀' }, { value: 'slide', label: '미끄러져 내려감' }, { value: 'tip', label: '넘어짐' }];
    const PRED_P = [{ value: 'left', label: '왼쪽 받침이 더 받음' }, { value: 'right', label: '오른쪽 받침이 더 받음' }, { value: 'tip', label: '왼쪽이 뜨며 판이 뒤집힘' }];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list = state.mode === 'seesaw' ? PRED_S : state.mode === 'tip' ? PRED_T : PRED_P;
        predictionLegend.textContent = state.mode === 'seesaw' ? `받침점 ${PIVOTS[state.pivot].label}, 파란 상자 ${MASSES[state.mass].label}을 왼쪽 ${DISTS[state.dist].label}에 놓으면?`
            : state.mode === 'tip' ? `${FLOORS[state.floor].label}의 ${SHAPES[state.shape].label}, 바닥을 ${ANGLES[state.angle].label} 기울이면?`
                : `${LOADS[state.load].label} 물건을 ${SPOTS[state.spot].label}(${SPOTS[state.spot].hint.replace('왼쪽 끝에서 ', '')})에 놓으면?`;
        predictionArea.className = 'prediction-buttons three';
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    const arrow = (x1, y1, x2, y2, cls, head) => {
        const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
        const bx = x2 - ux * 6, by = y2 - uy * 6;
        return `<line class="force ${cls}" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}"/><polygon class="${head}" points="${x2.toFixed(1)},${y2.toFixed(1)} ${(bx - uy * 3.5).toFixed(1)},${(by + ux * 3.5).toFixed(1)} ${(bx + uy * 3.5).toFixed(1)},${(by - ux * 3.5).toFixed(1)}"/>`;
    };
    const rot = (x, y, cx, cy, deg) => { const c = Math.cos(deg * RAD), s = Math.sin(deg * RAD); return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]; };

    function renderSeesaw(a) {
        const { run, p, mA, dA } = a, S = 80, CX = 230, Y = 118;
        const t = state.progress * 4, phi = run.phi[clamp(Math.round(t / 0.02), 0, run.phi.length - 1)], deg = phi / RAD;
        const px = CX + p * S, groundY = Y + PIVOT_H * S;
        let out = `<line class="ground" x1="20" y1="${groundY}" x2="440" y2="${groundY}"/>`;
        for (let x = 24; x < 440; x += 16) out += `<line class="ground-hatch" x1="${x}" y1="${groundY}" x2="${x - 6}" y2="${groundY + 7}"/>`;
        out += `<polygon class="pivot" points="${px},${Y} ${px - 12},${groundY} ${px + 12},${groundY}"/>`;
        const boxW = m => 14 + Math.sqrt(m) * 2.8;
        const boxes = [{ x: -dA, m: mA, cls: 'box-a', label: `${mA} kg` }, { x: XB, m: MB, cls: 'box-b', label: `${MB} kg` }];
        out += `<g transform="rotate(${deg.toFixed(2)} ${px} ${Y})">`;
        out += `<rect class="board" x="${CX - S * BOARD_L / 2}" y="${Y - 4}" width="${S * BOARD_L}" height="8" rx="2"/>`;
        out += `<circle class="cm-dot" cx="${CX}" cy="${Y}" r="3"/>`;
        boxes.forEach(b => { const w = boxW(b.m); out += `<rect class="${b.cls}" x="${CX + b.x * S - w / 2}" y="${Y - 4 - w}" width="${w}" height="${w}" rx="3"/>`; });
        out += `</g>`;
        // weights drawn upright at the rotated box centres
        boxes.forEach(b => {
            const w = boxW(b.m), [cx, cy] = rot(CX + b.x * S, Y - 4 - w / 2, px, Y, deg);
            const len = 10 + b.m * 0.9;
            out += arrow(cx, cy, cx, cy + len, 'force-w', 'arrow-w');
            const lx = clamp(cx, 40, 420);
            out += `<text class="trait-text" x="${lx.toFixed(1)}" y="${(cy - w / 2 - 6).toFixed(1)}" text-anchor="middle">${b.label}</text>`;
        });
        const [bcx, bcy] = rot(CX, Y, px, Y, deg);
        if (Math.abs(p) > 0.01) out += arrow(bcx, bcy, bcx, bcy + 18, 'force-w', 'arrow-w');
        // arm labels under the ground
        const arms = run.parts.filter(o => Math.abs(o.arm) > 0.01);
        arms.forEach((o, i) => { const x = clamp(px + o.arm * S, 40, 420); out += `<line class="ref-line" x1="${px}" y1="${groundY + 14 + i * 12}" x2="${x.toFixed(1)}" y2="${groundY + 14 + i * 12}"/><text class="small-label" x="${((px + x) / 2).toFixed(1)}" y="${groundY + 11 + i * 12}" text-anchor="middle">${o.name} ${Math.abs(o.arm).toFixed(1)} m</text>`; });
        const left = run.parts.filter(o => o.tau < -1e-6).reduce((s, o) => s - o.tau, 0), right = run.parts.filter(o => o.tau > 1e-6).reduce((s, o) => s + o.tau, 0);
        out += `<text class="trait-text" style="fill:#0284c7" x="20" y="30">왼쪽으로 돌리는 돌림힘 ${fmt(left)} N·m</text>`;
        out += `<text class="trait-text" style="fill:#dc2626" x="440" y="30" text-anchor="end">오른쪽으로 돌리는 돌림힘 ${fmt(right)} N·m</text>`;
        out += `<text class="small-label" x="440" y="${groundY + 11}" text-anchor="end">기울기 ${Math.abs(deg).toFixed(1)}°${Math.abs(phi) >= Math.min(run.maxLeft, run.maxRight) - 1e-6 ? ' — 끝이 땅에 닿음' : ''}</text>`;
        const VERD = { left: '왼쪽이 내려감', balance: '평형 — 수평 유지', right: '오른쪽이 내려감' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${state.progress >= 1 ? `${MASSES[state.mass].label} · 왼쪽 ${DISTS[state.dist].label} · 받침점 ${PIVOTS[state.pivot].label}: ${VERD[run.verdict]} (${fmt(left)} 대 ${fmt(right)} N·m)` : `${MASSES[state.mass].label} · 왼쪽 ${DISTS[state.dist].label} · 받침점 ${PIVOTS[state.pivot].label}`}</text>`;
        out += `<text class="note-text" x="20" y="208">돌림힘 = 무게 × 받침점까지의 거리. 붉은 상자 20 kg은 오른쪽 1 m 고정, 노란 점은 판(8 kg)의 무게중심</text>`;
        return out;
    }

    function graphSeesaw(a) {
        const { run } = a, X0 = 230, Y = 44, H = 22, SC = 0.2;
        let out = `<text class="axis-title" x="20" y="18">받침점을 축으로 잰 돌림힘 (N·m) — 왼쪽으로 돌리면 왼쪽으로, 오른쪽으로 돌리면 오른쪽으로 그림</text>`;
        out += `<line class="axis" x1="${X0}" y1="${Y - 8}" x2="${X0}" y2="${Y + 4 * (H + 8)}"/>`;
        [...run.parts, { name: '합', tau: run.tau, sum: true }].forEach((o, i) => {
            const y = Y + i * (H + 8), w = Math.abs(o.tau) * SC;
            const cls = o.sum ? (Math.abs(o.tau) < 0.5 ? 'band-good' : 'band-bad') : i === 0 ? 'box-a' : i === 1 ? 'board' : 'box-b';
            if (w > 0.5) out += `<rect class="${cls}" x="${(o.tau < 0 ? X0 - w : X0).toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="${H}" rx="3"/>`;
            out += `<text class="trait-text" x="${X0 - (o.tau < 0 ? w + 6 : 6)}" y="${y + H / 2 + 4}" text-anchor="end">${o.name}</text>`;
            out += `<text class="trait-text" x="${X0 + (o.tau > 0 ? w + 6 : 6)}" y="${y + H / 2 + 4}">${Math.abs(o.tau) < 0.5 ? '0 (받침점 바로 위)' : `${fmt(Math.abs(o.tau))} N·m ${o.tau < 0 ? '왼쪽' : '오른쪽'}`}${o.sum ? (Math.abs(o.tau) < 0.5 ? ' → 평형' : ` → ${o.tau < 0 ? '왼쪽' : '오른쪽'}이 내려감`) : ''}</text>`;
        });
        out += `<text class="small-label" x="20" y="${Y + 4 * (H + 8) + 14}">합이 0이면 평형, 아니면 큰 쪽으로 돕니다. 어느 점을 축으로 재도 결론은 같습니다.</text>`;
        return out;
    }

    function renderTip(a) {
        const p = state.progress, { sh, deg, mu, verdict } = a, SC = 120;
        const HX = 390, HY = 186, theta = deg * ease(clamp(p / 0.6, 0, 1)), after = clamp((p - 0.6) / 0.4, 0, 1);
        const W = sh.w * SC, H = sh.h * SC, s0 = 130;   // the box's downhill corner sits s0 px from the hinge, along the board
        const slide = verdict === 'slide' ? 80 * ease(after) : 0, psi = verdict === 'tip' ? 80 * ease(after) : 0;
        let out = `<line class="ground" x1="20" y1="${HY}" x2="440" y2="${HY}"/>`;
        for (let x = 24; x < 440; x += 16) out += `<line class="ground-hatch" x1="${x}" y1="${HY}" x2="${x - 6}" y2="${HY + 7}"/>`;
        const cornerX = HX - s0 + slide;   // downhill bottom corner (local, before board rotation)
        out += `<g transform="rotate(${theta.toFixed(2)} ${HX} ${HY})">`;
        out += `<rect class="incline" x="${HX - 240}" y="${HY}" width="240" height="7" rx="2"/>`;
        out += `<g transform="rotate(${psi.toFixed(2)} ${cornerX.toFixed(1)} ${HY})"><rect class="box-c" x="${(cornerX - W).toFixed(1)}" y="${HY - H}" width="${W}" height="${H}" rx="2"/></g>`;
        out += `</g>`;
        // centre of mass in world coordinates, and the vertical from it
        const localCM = rot(cornerX - W / 2, HY - H / 2, cornerX, HY, psi);
        const [cmx, cmy] = rot(localCM[0], localCM[1], HX, HY, theta);
        const tanT = Math.tan(theta * RAD);
        const footLocal = cornerX - W / 2 + (H / 2) * tanT;       // where the vertical through the CM meets the board (before tipping)
        const inside = footLocal <= cornerX + 0.01;
        const [fx, fy] = rot(footLocal, HY, HX, HY, theta);
        if (psi < 1) {
            out += `<line class="cm-line" style="stroke:${inside ? '#059669' : '#dc2626'}" x1="${cmx.toFixed(1)}" y1="${cmy.toFixed(1)}" x2="${cmx.toFixed(1)}" y2="${(cmy + Math.max(0, fy - cmy)).toFixed(1)}"/>`;
            out += `<circle class="cm-dot" cx="${cmx.toFixed(1)}" cy="${cmy.toFixed(1)}" r="3.2"/>`;
            const [c1x, c1y] = rot(cornerX, HY, HX, HY, theta);
            out += `<circle fill="${inside ? '#059669' : '#dc2626'}" cx="${c1x.toFixed(1)}" cy="${c1y.toFixed(1)}" r="2.6"/>`;
        }
        // forces: weight down from the CM, normal and friction at the foot
        out += arrow(cmx, cmy, cmx, cmy + 36, 'force-w', 'arrow-w');
        out += `<text class="small-label" style="fill:#dc2626" x="${(cmx + 6).toFixed(1)}" y="${(cmy + 22).toFixed(1)}">무게</text>`;
        if (verdict !== 'tip' || psi < 1) {
            const nLen = 34 * Math.cos(theta * RAD), fLen = 34 * Math.min(Math.sin(theta * RAD), mu * Math.cos(theta * RAD));
            const [nx, ny] = rot(fx, fy - nLen, fx, fy, theta);
            out += arrow(fx, fy, nx, ny, 'force-n', 'arrow-n');
            if (fLen > 2) { const [gx, gy] = rot(fx - fLen, fy, fx, fy, theta); out += arrow(fx, fy, gx, gy, 'force-f', 'arrow-f'); }
        }
        // angle arc at the hinge
        if (theta > 1) out += `<path class="angle-arc" d="M${HX - 44},${HY} A44,44 0 0 0 ${(HX - 44 * Math.cos(theta * RAD)).toFixed(1)},${(HY - 44 * Math.sin(theta * RAD)).toFixed(1)}"/><text class="small-label" style="fill:#d97706" x="${HX - 62}" y="${HY - 8}" text-anchor="end">${theta.toFixed(0)}°</text>`;
        // readouts
        out += `<text class="trait-text" x="20" y="40">기울기 ${theta.toFixed(0)}° · tan = ${Math.tan(theta * RAD).toFixed(2)}</text>`;
        out += `<text class="trait-text" style="fill:#7c3aed" x="20" y="56">미끄러지는 문턱 tan = 마찰 계수 ${mu} → ${a.slideAt.toFixed(0)}°</text>`;
        out += `<text class="trait-text" style="fill:#d97706" x="20" y="72">넘어지는 문턱 tan = 폭÷높이 ${a.ratio.toFixed(2)} → ${a.tipAt.toFixed(0)}°</text>`;
        out += `<text class="small-label" x="20" y="88">먼저 오는 문턱: ${a.slideAt < a.tipAt ? `미끄러짐 (${a.slideAt.toFixed(0)}°)` : `넘어짐 (${a.tipAt.toFixed(0)}°)`}</text>`;
        out += `<text class="small-label" x="20" y="104">${inside ? '무게중심 수직선이 바닥면 안 — 되돌리는 쪽' : '무게중심 수직선이 모서리 밖 — 넘기는 쪽'}</text>`;
        const VERD = { stay: '그대로 버팀', slide: '미끄러져 내려감', tip: '넘어짐' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${state.progress >= 1 ? `${SHAPES[state.shape].label} · ${FLOORS[state.floor].label} · ${deg}°: ${VERD[verdict]}` : `${SHAPES[state.shape].label} · ${FLOORS[state.floor].label} · ${deg}°`}</text>`;
        out += `<text class="note-text" x="20" y="208">초록 화살표 수직 항력, 보라 마찰력, 붉은 무게. 노란 점이 무게중심, 점선이 그 수직선입니다</text>`;
        return out;
    }

    function graphTip(a) {
        const X0 = 60, X1 = 420, Y0 = 120, Y1 = 50;
        const xOf = d => X0 + d / 70 * (X1 - X0);
        let out = `<text class="axis-title" x="20" y="18">기울기 눈금 위의 두 문턱 — 작은 쪽 문턱을 먼저 넘습니다</text>`;
        const first = Math.min(a.slideAt, a.tipAt), which = a.slideAt < a.tipAt ? '미끄러짐' : '넘어짐';
        out += `<rect class="band-good" x="${X0}" y="${Y1}" width="${(xOf(first) - X0).toFixed(1)}" height="${Y0 - Y1}"/>`;
        out += `<rect class="band-bad" x="${xOf(first).toFixed(1)}" y="${Y1}" width="${(X1 - xOf(first)).toFixed(1)}" height="${Y0 - Y1}"/>`;
        out += `<text class="small-label" x="${((X0 + xOf(first)) / 2).toFixed(1)}" y="${Y1 + 14}" text-anchor="middle">버팀</text><text class="small-label" x="${((xOf(first) + X1) / 2).toFixed(1)}" y="${Y1 + 14}" text-anchor="middle">${which}</text>`;
        for (let d = 0; d <= 70; d += 10) out += `<line class="grid-line" x1="${xOf(d).toFixed(1)}" y1="${Y1}" x2="${xOf(d).toFixed(1)}" y2="${Y0}"/><text class="axis-text" x="${xOf(d).toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${d}°</text>`;
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/>`;
        const marks = [[a.slideAt, `미끄러짐 문턱 ${a.slideAt.toFixed(0)}°`, '#7c3aed', 78], [a.tipAt, `넘어짐 문턱 ${a.tipAt.toFixed(0)}°`, '#d97706', 96]];
        marks.forEach(([d, lab, col, y]) => { const x = xOf(Math.min(d, 70)); out += `<line class="ref-line" style="stroke:${col}" x1="${x.toFixed(1)}" y1="${Y1}" x2="${x.toFixed(1)}" y2="${Y0}"/><text class="trait-text" style="fill:${col}" x="${(x + (x > 300 ? -5 : 5)).toFixed(1)}" y="${y}" text-anchor="${x > 300 ? 'end' : 'start'}">${lab}</text>`; });
        const xc = xOf(a.deg);
        out += `<polygon fill="#0f172a" points="${xc.toFixed(1)},${Y0 - 1} ${(xc - 5).toFixed(1)},${Y0 + 9} ${(xc + 5).toFixed(1)},${Y0 + 9}"/>`;
        out += `<text class="trait-text" x="${xc.toFixed(1)}" y="${Y0 + 30}" text-anchor="middle">지금 기울기 ${a.deg}°</text>`;
        out += `<text class="small-label" x="20" y="${Y0 + 52}">마찰 계수가 폭÷높이보다 작으면 미끄러짐이 먼저, 크면 넘어짐이 먼저 옵니다.</text>`;
        return out;
    }

    function renderPlank(a) {
        const p = state.progress, { m, x, N1, N2, verdict } = a, S = 160, X0 = 60, Y = 120, GY = 172;
        const drop = ease(clamp(p / 0.4, 0, 1)), grow = ease(clamp((p - 0.35) / 0.35, 0, 1)), tilt = verdict === 'tip' ? -16 * ease(clamp((p - 0.7) / 0.3, 0, 1)) : 0;
        const x1 = X0 + S1 * S, x2 = X0 + S2 * S, bx = X0 + x * S, bw = 30, bh = 12 + m;
        let out = `<line class="ground" x1="20" y1="${GY}" x2="440" y2="${GY}"/>`;
        for (let xx = 24; xx < 440; xx += 16) out += `<line class="ground-hatch" x1="${xx}" y1="${GY}" x2="${xx - 6}" y2="${GY + 7}"/>`;
        [x1, x2].forEach(sx => { out += `<rect class="stand" x="${sx - 7}" y="${Y + 4}" width="14" height="${GY - Y - 4}" rx="2"/>`; });
        out += `<g transform="rotate(${tilt.toFixed(2)} ${x2} ${Y})">`;
        out += `<rect class="board" x="${X0}" y="${Y - 4}" width="${PL_L * S}" height="8" rx="2"/>`;
        const boxY = Y - 4 - bh - (1 - drop) * 70;
        out += `<rect class="box-a" x="${bx - bw / 2}" y="${boxY.toFixed(1)}" width="${bw}" height="${bh}" rx="3"/>`;
        out += `<circle class="cm-dot" cx="${X0 + PL_L / 2 * S}" cy="${Y}" r="3"/>`;
        out += `</g>`;
        const [bcx, bcy] = rot(bx, boxY + bh / 2, x2, Y, tilt);
        if (drop >= 1) {
            out += `<text class="trait-text" x="${bcx.toFixed(1)}" y="${(bcy - bh / 2 - 6).toFixed(1)}" text-anchor="middle">${m} kg</text>`;
            out += arrow(bcx, bcy, bcx, bcy + 14 + m * G * 0.25 * grow, 'force-w', 'arrow-w');
            const [pcx, pcy] = rot(X0 + PL_L / 2 * S, Y, x2, Y, tilt);
            out += arrow(pcx, pcy, pcx, pcy + 6 + PL_M * G * 0.25 * grow, 'force-w', 'arrow-w');
            out += `<text class="small-label" style="fill:#dc2626" x="${(pcx + 5).toFixed(1)}" y="${(pcy + 18 + PL_M * G * 0.25 * grow).toFixed(1)}">판 ${fmt(PL_M * G)} N</text>`;
            const n1 = Math.max(0, N1) * 0.25 * grow, n2 = N2 * 0.25 * grow;
            if (n1 > 1) out += arrow(x1, Y + 4, x1, Y + 4 - n1 - 4, 'force-n', 'arrow-n');
            out += arrow(x2, Y + 4, x2, Y + 4 - n2 - 4, 'force-n', 'arrow-n');
            out += `<text class="trait-text" style="fill:${N1 <= 0 ? '#dc2626' : '#059669'}" x="${x1}" y="${GY + 16}" text-anchor="middle">왼쪽 받침 ${N1 <= 0 ? `${fmt(N1)} N → 0 아래, 뜸` : `${fmt(N1 * grow)} N`}</text>`;
            out += `<text class="trait-text" style="fill:#059669" x="${x2}" y="${GY + 16}" text-anchor="middle">오른쪽 받침 ${fmt(N2 * grow)} N</text>`;
        } else {
            out += `<text class="trait-text" style="fill:#059669" x="${x1}" y="${GY + 16}" text-anchor="middle">왼쪽 받침 (0.3 m)</text><text class="trait-text" style="fill:#059669" x="${x2}" y="${GY + 16}" text-anchor="middle">오른쪽 받침 (1.3 m)</text>`;
        }
        out += `<text class="small-label" x="${X0}" y="${GY + 30}">0 m</text>${x < 1.7 ? `<text class="small-label" x="${X0 + PL_L * S}" y="${GY + 30}" text-anchor="end">2 m</text>` : ''}<text class="small-label" x="${bx.toFixed(1)}" y="${GY + 30}" text-anchor="middle">물건 ${x} m</text>`;
        const VERD = { left: '왼쪽 받침이 더 받음', right: '오른쪽 받침이 더 받음', tip: '왼쪽이 뜨며 판이 뒤집힘' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${state.progress >= 1 ? `${m} kg을 ${x} m에: ${VERD[verdict]} (왼쪽 ${fmt(N1)} N · 오른쪽 ${fmt(N2)} N)` : `${m} kg 물건을 ${x} m 자리에 (판 2 m · 4 kg, 받침 0.3 m와 1.3 m)`}</text>`;
        out += `<text class="trait-text" x="20" y="40">누르는 힘 모두 ${fmt(a.W)} N = 판 ${fmt(PL_M * G)} N + 물건 ${fmt(m * G)} N</text>`;
        out += `<text class="small-label" x="20" y="54">받침대는 위로 밀 수만 있고 아래로 붙잡지는 못합니다</text>`;
        return out;
    }

    function graphPlank(a) {
        const { m, x, N1, N2 } = a, X0 = 60, Y0 = 130, SC = 0.2;
        let out = `<text class="axis-title" x="20" y="18">오른쪽 받침을 축으로 돌림힘을 맞추면 왼쪽 받침이 받는 힘이 나옵니다</text>`;
        const parts = [
            { name: '판 무게', tau: PL_M * G * (S2 - PL_L / 2), note: `${fmt(PL_M * G)} N × ${(S2 - PL_L / 2).toFixed(1)} m` },
            { name: '물건 무게', tau: m * G * (S2 - x), note: `${fmt(m * G)} N × ${Math.abs(S2 - x).toFixed(1)} m` },
        ];
        // positive = turns the left end down (needs the left stand to push up)
        parts.forEach((o, i) => {
            const y = 40 + i * 26, w = Math.abs(o.tau) * SC;
            out += `<rect class="${o.tau >= 0 ? 'box-c' : 'box-b'}" x="${o.tau >= 0 ? 230 : 230 - w}" y="${y}" width="${w.toFixed(1)}" height="18" rx="3"/>`;
            out += `<text class="trait-text" x="${o.tau >= 0 ? 224 : 230 - w - 6}" y="${y + 13}" text-anchor="end">${o.name}</text>`;
            out += `<text class="trait-text" x="${(o.tau >= 0 ? 236 + w : 236).toFixed(1)}" y="${y + 13}">${o.note} = ${fmt(Math.abs(o.tau))} N·m · 왼쪽 끝 ${o.tau >= 0 ? '내림' : '올림'}</text>`;
        });
        out += `<line class="axis" x1="230" y1="34" x2="230" y2="96"/>`;
        const net = parts[0].tau + parts[1].tau;
        out += `<text class="trait-text" x="20" y="${Y0 - 14}">합 ${fmt(net)} N·m을 왼쪽 받침(축에서 ${(S2 - S1).toFixed(1)} m)이 받쳐야 하므로 왼쪽 받침 힘 = ${fmt(net)} ÷ ${(S2 - S1).toFixed(1)} = ${fmt(N1)} N</text>`;
        out += `<text class="trait-text" x="20" y="${Y0 + 4}">오른쪽 받침 힘 = 전체 ${fmt(a.W)} − ${fmt(N1)} = ${fmt(N2)} N</text>`;
        out += `<text class="small-label" style="fill:${N1 <= 0 ? '#dc2626' : '#059669'}" x="20" y="${Y0 + 24}">${N1 <= 0 ? '왼쪽 받침 힘이 0 아래 — 받침대는 아래로 붙잡지 못하므로 왼쪽 끝이 들리며 판이 뒤집힙니다' : N1 > N2 ? '물건이 왼쪽 받침에 더 가까워 왼쪽이 더 받습니다' : '물건이 오른쪽 받침에 더 가까워 오른쪽이 더 받습니다'}</text>`;
        out += `<text class="small-label" x="20" y="${Y0 + 42}">힘의 합 0 · 돌림힘의 합 0 — 이 두 식이 평형 조건입니다</text>`;
        return out;
    }

    function noteFor(a) {
        if (a.kind === 'seesaw') {
            const { run } = a;
            return run.parts.map(o => `<div class="data-row"><span class="data-name">${o.name}</span><span class="data-val">${o.m} kg × 9.8 × ${Math.abs(o.arm).toFixed(1)} m = ${fmt(Math.abs(o.tau))} N·m${Math.abs(o.tau) < 0.5 ? ' (받침점 바로 위)' : o.tau < 0 ? ' (왼쪽으로 돌림)' : ' (오른쪽으로 돌림)'}</span></div>`).join('') +
                `<div class="data-row match"><span class="data-name">합</span><span class="data-val">${Math.abs(run.tau) < 0.5 ? '0 — 평형' : `${fmt(Math.abs(run.tau))} N·m ${run.tau < 0 ? '왼쪽' : '오른쪽'}으로 → 그쪽이 내려감`}</span></div>`;
        }
        if (a.kind === 'tip') {
            return `<div class="data-row"><span class="data-name">물체</span><span class="data-val">${a.sh.label} — 폭 ${a.sh.w} m, 높이 ${a.sh.h} m, 폭÷높이 ${a.ratio.toFixed(2)}</span></div>` +
                `<div class="data-row"><span class="data-name">문턱</span><span class="data-val">미끄러짐 tan θ > ${a.mu} → ${a.slideAt.toFixed(1)}° · 넘어짐 tan θ > ${a.ratio.toFixed(2)} → ${a.tipAt.toFixed(1)}°</span></div>` +
                `<div class="data-row"><span class="data-name">기울기</span><span class="data-val">${a.deg}° → tan = ${a.tan.toFixed(2)}</span></div>` +
                `<div class="data-row match"><span class="data-name">판정</span><span class="data-val">${a.verdict === 'stay' ? '두 문턱 모두 아래 — 버팀' : a.verdict === 'slide' ? `미끄러짐 문턱(${a.slideAt.toFixed(0)}°)이 먼저 — 미끄러짐` : `넘어짐 문턱(${a.tipAt.toFixed(0)}°)이 먼저 — 넘어짐`}</span></div>`;
        }
        return `<div class="data-row"><span class="data-name">판과 물건</span><span class="data-val">판 2 m · ${PL_M} kg (${fmt(PL_M * G)} N, 무게중심 1.0 m) · 물건 ${a.m} kg (${fmt(a.m * G)} N) ${a.x} m</span></div>` +
            `<div class="data-row"><span class="data-name">받침대</span><span class="data-val">0.3 m와 1.3 m — 사이 1.0 m</span></div>` +
            `<div class="data-row"><span class="data-name">받는 힘</span><span class="data-val">왼쪽 ${fmt(a.N1)} N · 오른쪽 ${fmt(a.N2)} N (합 ${fmt(a.W)} N)</span></div>` +
            `<div class="data-row match"><span class="data-name">판정</span><span class="data-val">${a.verdict === 'tip' ? '왼쪽 받침 힘이 0 아래 → 판이 뒤집힘' : a.verdict === 'left' ? '왼쪽 받침이 더 받음' : '오른쪽 받침이 더 받음'}</span></div>`;
    }

    function render() {
        const a = analyse();
        mainGroup.innerHTML = a.kind === 'seesaw' ? renderSeesaw(a) : a.kind === 'tip' ? renderTip(a) : renderPlank(a);
        graphGroup.innerHTML = a.kind === 'seesaw' ? graphSeesaw(a) : a.kind === 'tip' ? graphTip(a) : graphPlank(a);
        liftProse();
        stageBadge.textContent = a.kind === 'seesaw' ? `받침점 ${PIVOTS[state.pivot].label} · ${MASSES[state.mass].label} · 왼쪽 ${DISTS[state.dist].label}` : a.kind === 'tip' ? `${SHAPES[state.shape].label} · ${FLOORS[state.floor].label} · ${ANGLES[state.angle].label}` : `${LOADS[state.load].label} · ${SPOTS[state.spot].label}`;
        methodHint.textContent = a.kind === 'seesaw' ? '돌림힘 = 힘 × 받침점까지의 거리. 양쪽이 같으면 평형입니다'
            : a.kind === 'tip' ? '무게중심의 수직선이 바닥면을 벗어나면 넘어집니다'
                : '힘의 합 0, 돌림힘의 합 0 — 둘 다 맞아야 판이 가만히 있습니다';
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
        if (a.kind === 'seesaw') {
            const { run, p, mA, dA } = a;
            const left = run.parts.filter(o => o.tau < -1e-6).reduce((v, o) => v - o.tau, 0), right = run.parts.filter(o => o.tau > 1e-6).reduce((v, o) => v + o.tau, 0);
            labelA.textContent = '왼쪽 돌림힘'; valueA.textContent = `${fmt(left)} N·m`;
            labelB.textContent = '오른쪽 돌림힘'; valueB.textContent = `${fmt(right)} N·m`;
            const A = run.parts[0], B = run.parts[2], Bd = run.parts[1];
            s = `${Math.abs(A.tau) < 0.5 ? `파란 상자 ${mA} kg은 받침점 바로 위에 있어 거리가 0이고 돌림힘도 0 N·m이며` : `파란 상자 ${mA} kg은 받침점에서 ${Math.abs(A.arm).toFixed(1)} m 떨어져 ${mA} × 9.8 × ${Math.abs(A.arm).toFixed(1)} = ${fmt(Math.abs(A.tau))} N·m로 왼쪽을 내리려 하고`}, 붉은 상자 20 kg은 ${B.arm.toFixed(1)} m 떨어져 ${fmt(B.tau)} N·m로 오른쪽을 내리려 합니다. `;
            s += p === 0 ? `판의 무게중심이 받침점 바로 위라 판 무게는 돌림힘을 내지 않습니다. ` : `받침점을 왼쪽으로 옮겨 판(8 kg)의 무게중심이 받침점 오른쪽 0.5 m에 놓였으므로 판 무게도 ${fmt(Bd.tau)} N·m로 오른쪽을 내리려 하고, 붉은 상자의 거리도 1.5 m로 늘었습니다. `;
            s += run.verdict === 'balance' ? `두 쪽의 돌림힘이 ${fmt(left)} N·m로 똑같아 판은 수평을 지킵니다. 무게가 절반이면 거리를 두 배로 하면 되는 까닭입니다.`
                : run.verdict === 'left' ? `왼쪽으로 돌리는 ${fmt(left)} N·m가 오른쪽 ${fmt(right)} N·m보다 커서 왼쪽이 내려가 끝이 땅에 닿았습니다. 남는 돌림힘은 ${fmt(left - right)} N·m입니다.`
                    : `오른쪽으로 돌리는 ${fmt(right)} N·m가 왼쪽 ${fmt(left)} N·m보다 커서 오른쪽이 내려가 끝이 땅에 닿았습니다. 남는 돌림힘은 ${fmt(right - left)} N·m입니다.`;
        } else if (a.kind === 'tip') {
            labelA.textContent = '결과'; valueA.textContent = { stay: '버팀', slide: '미끄러짐', tip: '넘어짐' }[a.verdict];
            labelB.textContent = '먼저 오는 문턱'; valueB.textContent = a.slideAt < a.tipAt ? `미끄러짐 ${a.slideAt.toFixed(0)}°` : `넘어짐 ${a.tipAt.toFixed(0)}°`;
            s = `${a.sh.label}(폭 ${a.sh.w} m, 높이 ${a.sh.h} m)${eul(a.sh.label)} ${FLOORS[state.floor].label}(마찰 계수 ${a.mu}) 위에 놓고 ${a.deg}° 기울였습니다. 기울기의 탄젠트는 ${a.tan.toFixed(2)}입니다. 미끄러짐은 이 값이 마찰 계수 ${a.mu}${eulNum(a.mu)} 넘을 때(${a.slideAt.toFixed(0)}°부터), 넘어짐은 폭÷높이 ${a.ratio.toFixed(2)}${eulNum(a.ratio.toFixed(2))} 넘을 때(${a.tipAt.toFixed(0)}°부터) 시작됩니다. `;
            if (a.verdict === 'stay') s += `${a.deg}°는 두 문턱 모두에 못 미쳐 물체는 그대로 버팁니다. 무게중심의 수직선이 아직 바닥면 안에 떨어져 무게가 물체를 되돌리는 쪽으로 돌리고, 마찰력이 미끄러짐을 막습니다.`;
            else if (a.verdict === 'slide') s += a.deg > a.tipAt
                ? `${a.deg}°는 두 문턱을 다 넘었지만, 바닥을 천천히 세우는 동안 미끄러짐 문턱(${a.slideAt.toFixed(0)}°)에 먼저 이르러 넘어지기 전에 미끄러져 내려갑니다. 마찰력이 무게의 빗면 성분을 붙잡지 못하기 때문입니다.`
                : `${a.deg}°는 미끄러짐 문턱은 넘었지만 넘어짐 문턱(${a.tipAt.toFixed(0)}°)에는 못 미쳐 미끄러져 내려갑니다. 마찰력이 무게의 빗면 성분보다 작아 붙잡지 못하지만, 무게중심의 수직선은 바닥면 안에 있어 넘어지지는 않습니다.`;
            else s += `${a.deg}°에서 무게중심의 수직선이 아래쪽 모서리 밖으로 나가 무게가 물체를 넘기는 쪽으로 돌립니다. 마찰 계수 ${a.mu}가 폭÷높이 ${a.ratio.toFixed(2)}보다 커서 미끄러지기 전에 넘어집니다. 같은 병이라도 얼음 위에서는 미끄러지고 고무판 위에서는 넘어지는 까닭입니다.`;
        } else {
            const { m, x, N1, N2 } = a;
            labelA.textContent = '왼쪽 받침'; valueA.textContent = `${fmt(N1)} N`;
            labelB.textContent = '오른쪽 받침'; valueB.textContent = `${fmt(N2)} N`;
            const tauB = PL_M * G * (S2 - PL_L / 2), tauM = m * G * (S2 - x);
            s = `판 ${PL_M} kg(${fmt(PL_M * G)} N)과 물건 ${m} kg(${fmt(m * G)} N)이 누르는 힘은 모두 ${fmt(a.W)} N이고, 두 받침대가 이를 나누어 받칩니다. 오른쪽 받침(1.3 m)을 축으로 돌림힘을 재면 판 무게는 ${fmt(PL_M * G)} × 0.3 = ${fmt(tauB)} N·m로 왼쪽 끝을 내리려 하고, 물건은 ${fmt(m * G)} × ${Math.abs(S2 - x).toFixed(1)} = ${fmt(Math.abs(tauM))} N·m로 왼쪽 끝을 ${tauM >= 0 ? '내리려' : '올리려'} 합니다. `;
            s += `왼쪽 받침은 축에서 1.0 m이므로 받는 힘은 (${fmt(tauB)} ${tauM >= 0 ? '+' : '−'} ${fmt(Math.abs(tauM))}) ÷ 1.0 = ${fmt(N1)} N, 오른쪽 받침은 나머지 ${fmt(N2)} N입니다. `;
            if (a.verdict === 'tip') s += `왼쪽 값이 0보다 작다는 것은 판을 아래로 붙잡아야 한다는 뜻인데 받침대는 위로 밀 수만 있으므로, 왼쪽 끝이 들리며 판이 오른쪽 받침을 축으로 뒤집힙니다. 물건을 받침 사이로 옮기거나 오른쪽 받침을 끝 쪽으로 옮겨야 합니다.`;
            else if (a.verdict === 'left') s += `물건이 왼쪽 받침에 더 가까워 왼쪽이 더 많이 받습니다.`;
            else s += `물건이 오른쪽 받침에 더 가까워 오른쪽이 더 많이 받습니다${N1 < 10 ? '. 왼쪽은 거의 0에 가까워, 조금만 더 바깥으로 옮기면 뒤집힙니다' : ''}.`;
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
        checkBtn.textContent = state.mode === 'seesaw' ? '손 떼기' : state.mode === 'tip' ? '바닥 기울이기' : '물건 놓기';
        stageCaption.textContent = state.mode === 'seesaw' ? '4 m 판이 받침점 위에 놓여 있습니다. 파란 상자가 고를 수 있는 물체, 붉은 상자는 20 kg으로 가운데에서 오른쪽 1 m에 고정입니다.'
            : state.mode === 'tip' ? '오른쪽 끝을 축으로 바닥이 천천히 올라갑니다. 노란 점이 무게중심, 점선이 무게중심에서 내린 수직선입니다.'
                : '2 m 판이 두 받침대 위에 놓여 있습니다. 초록 화살표가 받침대가 미는 힘, 붉은 화살표가 무게입니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { pivot: 'center', mass: 'm10', dist: 'd10', shape: 'tall', floor: 'rough', angle: 'a35', load: 'm10', spot: 'x10', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'seesaw').click();
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

    window.__torqueModel = {
        PIVOTS, MASSES, DISTS, SHAPES, FLOORS, ANGLES, LOADS, SPOTS, state,
        analyse, render, seesawRun, runSeconds,
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
