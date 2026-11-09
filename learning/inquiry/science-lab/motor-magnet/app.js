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
                const must = /verdict-text|note-text/.test(cls) || /\bprose\b/.test(cls);
                if (must) { takeOut(t); return; }
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
        // 그림 글자가 그대로면(같은 그림을 다시 그린 경우) 이미 옮긴 글을 지우지 않는다.
        if (!rows.length && !notes.length && !verdicts.length) return;
        if (stageVerdict) stageVerdict.textContent = verdicts.join(' ');
        if (stageReadout) window.scienceScene.render(stageReadout,rows.map(r => `<span${r.fill ? ` style="color:${r.fill}"` : ''}>${r.txt}</span>`).join(''));
        if (stageNote) stageNote.textContent = notes.join(' ');
    }

    /* -------------------------------------------------------------- data */
    // coil 4 cm × 3 cm in a 0.5 T field; inertia, viscous friction and static friction are 대략
    const AREA = 1.2e-3, B0 = 0.5, J_INERTIA = 2e-5, B_FRICTION = 2e-4, C_FRICTION = 5e-5, TAU_STATIC = 1e-3, SIM_T = 6, MU0 = 4e-7 * Math.PI;
    const CURRENTS = { i05: { label: '0.5 A', hint: '', I: 0.5 }, i1: { label: '1 A', hint: '', I: 1 }, i2: { label: '2 A', hint: '', I: 2 } };
    const TURNS = { n1: { label: '1번', hint: '한 바퀴', N: 1 }, n10: { label: '10번', hint: '', N: 10 }, n50: { label: '50번', hint: '', N: 50 } };
    const COMMS = { yes: { label: '있음', hint: '반 바퀴마다 뒤집음' }, no: { label: '없음', hint: '전류 방향 그대로' } };
    // volume susceptibility (SI); iron is given by its saturation magnetization instead
    const MATERIALS = {
        iron: { label: '철', hint: '강자성', chi: 5000, Ms: 1.71e6, kind: 'ferro' },
        platinum: { label: '백금', hint: '상자성', chi: 2.6e-4, kind: 'para' },
        aluminium: { label: '알루미늄', hint: '상자성', chi: 2.2e-5, kind: 'para' },
        copper: { label: '구리', hint: '반자성', chi: -9.6e-6, kind: 'dia' },
        bismuth: { label: '비스무트', hint: '반자성', chi: -1.66e-4, kind: 'dia' },
    };
    const VOL = 1e-6, B_MAG = 0.5, GRAD_B = 50; // 1 cm³ sample, field and gradient near a strong magnet pole (대략)
    const FERROS = { fe: { label: '철', hint: '퀴리 770 ℃', Tc: 770 }, ni: { label: '니켈', hint: '퀴리 358 ℃', Tc: 358 }, co: { label: '코발트', hint: '퀴리 1,115 ℃', Tc: 1115 } };
    const HEATS = { t20: { label: '20 ℃', hint: '실온', T: 20 }, t400: { label: '400 ℃', hint: '검붉게 달굼', T: 400 }, t700: { label: '700 ℃', hint: '벌겋게 달굼', T: 700 }, t900: { label: '900 ℃', hint: '주황빛', T: 900 } };

    const state = { mode: 'motor', current: 'i1', turns: 'n10', comm: 'yes', material: 'iron', ferro: 'fe', heat: 't20', progress: 0, prediction: null };
    let running = false, frameId = 0, lastStamp = 0;

    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const ease = p => p < 0.5 ? 2 * p * p : 1 - (1 - p) * (1 - p) * 2;
    const fmtN = (n, d = 0) => (+n.toFixed(d)).toLocaleString('ko-KR', { minimumFractionDigits: d, maximumFractionDigits: d }).replace('-', '−');
    const rnd = i => (((i * 7919 + 13) * 104729) % 100003) / 100003;
    const fmtF = f => { const x = Math.abs(f), s = f < 0 ? '−' : ''; if (x >= 1) return `${s}${fmtN(x, 1)} N`; if (x >= 1e-3) return `${s}${fmtN(x * 1e3, 2)} mN`; return `${s}${fmtN(x * 1e6, 0)} μN`; };
    const fmtTau = t => { const x = Math.abs(t), s = t < 0 ? '−' : ''; return x >= 1 ? `${s}${fmtN(x, 2)} N·m` : `${s}${fmtN(x * 1000, x >= 0.01 ? 1 : 2)} mN·m`; };

    /* ------------------------------------------------------------ models */
    function motorModel() {
        const I = CURRENTS[state.current].I, N = TURNS[state.turns].N, comm = state.comm === 'yes', tauMax = N * I * AREA * B0;
        const moves = tauMax >= TAU_STATIC;
        // φ: angle between the coil normal and B; the coil starts with its plane parallel to B (φ = 90°, largest torque)
        const dt = 0.001, steps = Math.round(SIM_T / dt), samples = [];
        let phi = Math.PI / 2, w = 0, turns = 0;
        for (let k = 0; k <= steps; k += 1) {
            const s = Math.sin(phi), tau = !moves ? 0 : comm ? -tauMax * Math.abs(s) : -tauMax * s;
            if (k % 10 === 0) samples.push([k * dt, phi, w, tau]);
            const acc = (tau - B_FRICTION * w - C_FRICTION * w * Math.abs(w)) / J_INERTIA;
            w += acc * dt; phi += w * dt;
        }
        turns = Math.abs(phi - Math.PI / 2) / (2 * Math.PI);
        const tail = samples.slice(-100), wEnd = tail.reduce((acc, r) => acc + Math.abs(r[2]), 0) / tail.length; // mean speed over the last second
        return { kind: 'motor', I, N, comm, tauMax, moves, samples, turns, wEnd, verdict: !moves ? 'still' : comm ? 'spin' : 'wobble' };
    }
    function materialModel() {
        const m = MATERIALS[state.material];
        const F = m.kind === 'ferro' ? m.Ms * VOL * GRAD_B : m.chi * VOL / MU0 * B_MAG * GRAD_B;
        return { kind: 'material', m, F, verdict: F > 0.1 ? 'strong' : F > 0 ? 'weak' : 'repel' };
    }
    function curieModel() {
        const f = FERROS[state.ferro], T = HEATS[state.heat].T, tK = T + 273, tcK = f.Tc + 273;
        const ratio = T >= f.Tc ? 0 : Math.pow(1 - tK / tcK, 1 / 3); // M/M₀ ≈ (1 − T/Tc)^⅓, 대략
        return { kind: 'curie', f, T, ratio, verdict: ratio >= 0.6 ? 'strong' : ratio > 0 ? 'weak' : 'none' };
    }
    function analyse() {
        if (state.mode === 'motor') return motorModel();
        if (state.mode === 'material') return materialModel();
        return curieModel();
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
        if (state.mode === 'motor') controlArea.innerHTML = pickRow('전류', 'current', opts(CURRENTS), state.current, 3) + pickRow('코일 감은 수', 'turns', opts(TURNS), state.turns, 3) + pickRow('정류자', 'comm', opts(COMMS), state.comm, 2);
        else if (state.mode === 'material') controlArea.innerHTML = pickRow('시료 (1 cm³)', 'material', opts(MATERIALS), state.material, 5);
        else controlArea.innerHTML = pickRow('물질', 'ferro', opts(FERROS), state.ferro, 3) + pickRow('가열 온도', 'heat', opts(HEATS), state.heat, 4);
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                buildPrediction();
                settingsChanged();
            }));
        });
    }

    const PRED_M = [{ value: 'spin', label: '계속 돎' }, { value: 'wobble', label: '반 바퀴 가다 흔들리며 멈춤' }, { value: 'still', label: '거의 안 움직임' }];
    const PRED_S = [{ value: 'strong', label: '세게 끌림' }, { value: 'weak', label: '아주 약하게 끌림' }, { value: 'repel', label: '아주 약하게 밀림' }];
    const PRED_C = [{ value: 'strong', label: '세게 붙음' }, { value: 'weak', label: '약하게 붙음' }, { value: 'none', label: '안 붙음' }];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list = state.mode === 'motor' ? PRED_M : state.mode === 'material' ? PRED_S : PRED_C;
        predictionLegend.textContent = state.mode === 'motor' ? `${TURNS[state.turns].label} 감은 코일에 ${CURRENTS[state.current].label}, 정류자 ${COMMS[state.comm].label}이면 코일은?`
            : state.mode === 'material' ? `${MATERIALS[state.material].label} 1 cm³를 센 자석 곁에 두면?`
                : `${HEATS[state.heat].label}로 달군 ${FERROS[state.ferro].label}에 자석을 대면?`;
        predictionArea.className = 'prediction-buttons three';
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    const arrow = (x1, y1, x2, y2, cls, head, w = 3.5) => {
        const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
        const bx = x2 - ux * 6, by = y2 - uy * 6;
        return `<line class="${cls}" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}"/><polygon class="${head}" points="${x2.toFixed(1)},${y2.toFixed(1)} ${(bx - uy * w).toFixed(1)},${(by + ux * w).toFixed(1)} ${(bx + uy * w).toFixed(1)},${(by - ux * w).toFixed(1)}"/>`;
    };

    // 비스듬히 본 직류 전동기: 축은 화면 안쪽(오른쪽 위)에서 앞쪽(왼쪽 아래)으로 뻗고,
    // 축에 수직인 단면은 화면과 나란하게 그린다(사투영). φ는 코일 법선과 B의 각.
    function renderMotor(a) {
        const p = state.progress, on = p > 0, idx = Math.min(a.samples.length - 1, Math.round(p * (a.samples.length - 1))), [t, phi, w, tau] = a.samples[idx];
        const CX = 240, CY = 104, W = 56, LZ = 44, D = [-0.46, 0.36];
        const P = (ox, oy, z) => [CX + ox + D[0] * z, CY + oy + D[1] * z];
        const pt = q => `${q[0].toFixed(1)},${q[1].toFixed(1)}`;
        const poly = (pts, attrs) => `<polygon points="${pts.map(pt).join(' ')}" ${attrs}/>`;
        const seg = (q1, q2, attrs) => `<line x1="${q1[0].toFixed(1)}" y1="${q1[1].toFixed(1)}" x2="${q2[0].toFixed(1)}" y2="${q2[1].toFixed(1)}" ${attrs}/>`;
        let out = '';
        // 자석 두 개: 윗면·안쪽 면은 코일 뒤, 앞면은 맨 앞
        const block = (x0, x1, fill, top, side, label, inner) => {
            const y0 = -62, y1 = 62, zf = LZ + 14, zb = -LZ - 14, X0 = x0 - CX, X1 = x1 - CX, XI = inner === 'right' ? X1 : X0;
            const f = [P(X0, y0, zf), P(X1, y0, zf), P(X1, y1, zf), P(X0, y1, zf)];
            const tp = [P(X0, y0, zb), P(X1, y0, zb), P(X1, y0, zf), P(X0, y0, zf)];
            const sd = [P(XI, y0, zb), P(XI, y0, zf), P(XI, y1, zf), P(XI, y1, zb)];
            const c = f.reduce((m, q) => [m[0] + q[0] / 4, m[1] + q[1] / 4], [0, 0]);
            return { back: poly(tp, `fill="${top}" stroke="#64748b" stroke-width="1.2"`) + poly(sd, `fill="${side}" stroke="#64748b" stroke-width="1.2"`),
                front: poly(f, `fill="${fill}" stroke="#475569" stroke-width="1.4"`) + `<text class="pole-text" x="${c[0].toFixed(1)}" y="${(c[1] + 6).toFixed(1)}" text-anchor="middle">${label}</text>` };
        };
        const nB = block(104, 146, '#f3a29a', '#f8c8c2', '#e8968d', 'N', 'right'), sB = block(330, 372, '#93c5ea', '#c2dff5', '#86b8df', 'S', 'right');
        out += nB.back + sB.back;
        // 자기장(N → S), 코일 뒤쪽
        [-38, -13, 12, 37].forEach((dy, i) => { const z = i % 2 ? 14 : -14, a1 = P(148 - CX + D[0] * 0, dy, z), a2 = P(328 - CX, dy, z); out += arrow(a1[0], a1[1], a2[0], a2[1], 'field', 'field-head', 2.5); });
        // 코일 꼭짓점
        const nx = Math.cos(phi), ny = -Math.sin(phi), dx = -ny, dy = nx;
        const o1 = [dx * W, dy * W], o2 = [-dx * W, -dy * W];
        // 축 뒤쪽 토막
        out += seg(P(0, 0, -LZ - 30), P(0, 0, 0), 'stroke="#64748b" stroke-width="5" stroke-linecap="round"');
        // 코일 면: 법선이 화면 쪽을 향할수록 밝게
        const shade = 0.12 + 0.2 * Math.abs(Math.cos(phi));
        out += poly([P(o1[0], o1[1], -LZ), P(o1[0], o1[1], LZ), P(o2[0], o2[1], LZ), P(o2[0], o2[1], -LZ)], `fill="#f4b46a" fill-opacity="${shade.toFixed(2)}" stroke="none"`);
        // 여러 번 감은 도선(두 가닥으로 나타냄)
        [0, 1].forEach(k => { const m = 1 - k * 0.07, zz = LZ * (1 - k * 0.05); out += poly([P(o1[0] * m, o1[1] * m, -zz), P(o1[0] * m, o1[1] * m, zz), P(o2[0] * m, o2[1] * m, zz), P(o2[0] * m, o2[1] * m, -zz)], `fill="none" stroke="${k ? '#c2701f' : '#9a4a0c'}" stroke-width="${k ? 3 : 5}" stroke-linejoin="round"`); });
        // 전류 방향: 정류자가 있으면 반 바퀴마다 뒤집힘
        const half = Math.floor((Math.PI / 2 - phi) / Math.PI + 1e-9), flip = a.comm && on ? (half % 2 === 0 ? 1 : -1) : 1;
        const cur1 = on && a.moves ? flip : on ? 1 : 0; // +1 = 도선 1에서 앞쪽(+z)으로
        const L = Math.hypot(D[0], D[1]), ux = D[0] / L, uy = D[1] / L;
        const chevron = (o, z, dir) => { const q = P(o[0], o[1], z), vx = ux * dir, vy = uy * dir; return `<path d="M${(q[0] - vx * 6 - vy * 5).toFixed(1)},${(q[1] - vy * 6 + vx * 5).toFixed(1)} L${(q[0] + vx * 5).toFixed(1)},${(q[1] + vy * 5).toFixed(1)} L${(q[0] - vx * 6 + vy * 5).toFixed(1)},${(q[1] - vy * 6 - vx * 5).toFixed(1)}" fill="none" stroke="#7c2d12" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`; };
        if (cur1) [[o1, cur1], [o2, -cur1]].forEach(([o, c]) => { [-26, 0, 26].forEach(z => { out += chevron(o, z, c); }); });
        // 도선이 받는 힘 F = BIL: 화면에서 위아래
        if (on && cur1) [[o1, cur1], [o2, -cur1]].forEach(([o, c]) => { const q = P(o[0], o[1], 0), fl = 20 + 18 * Math.min(1, a.tauMax / 0.02); out += arrow(q[0], q[1], q[0], q[1] - c * fl, 'force', 'force-head', 4.5); });
        // 축 앞쪽 토막, 코일 끝 → 정류자 도선, 정류자
        const RC = P(0, 0, LZ + 58), r = 13;
        out += seg(P(0, 0, 0), P(0, 0, LZ + 80), 'stroke="#64748b" stroke-width="5" stroke-linecap="round"');
        [o1, o2].forEach((o, i) => { const e = P(o[0], o[1], LZ), m = P(o[0] * 0.3, o[1] * 0.3, LZ + 34), end = P(o[0] * 0.2, o[1] * 0.2, LZ + 60); out += `<path d="M${pt(e)} Q${pt(m)} ${pt(end)}" fill="none" stroke="${i ? '#d97706' : '#9a4a0c'}" stroke-width="2.4"/>`; });
        if (a.comm) {
            [0, Math.PI].forEach((off, i) => { const s0a = -phi + off + 0.24, s1a = -phi + off + Math.PI - 0.24; out += `<path d="M${(RC[0] + r * Math.cos(s0a)).toFixed(1)},${(RC[1] + r * Math.sin(s0a)).toFixed(1)} A${r},${r} 0 0 1 ${(RC[0] + r * Math.cos(s1a)).toFixed(1)},${(RC[1] + r * Math.sin(s1a)).toFixed(1)}" fill="none" stroke="${i ? '#d97706' : '#9a4a0c'}" stroke-width="7"/>`; });
        } else {
            out += `<circle cx="${RC[0].toFixed(1)}" cy="${RC[1].toFixed(1)}" r="${r}" fill="none" stroke="#9a4a0c" stroke-width="7"/>`;
        }
        // 브러시(고정)와 전지
        const bl = RC[0] - r - 15, br = RC[0] + r + 4, BX = RC[0], BY = 236, live = on ? '#dc2626' : '#64748b';
        out += `<path d="M${(bl + 4).toFixed(1)},${RC[1].toFixed(1)} V${BY} H${(BX - 24).toFixed(1)}M${(br + 7).toFixed(1)},${RC[1].toFixed(1)} V${BY - 20} H${(BX + 44).toFixed(1)} V${BY} H${(BX + 29).toFixed(1)}" fill="none" stroke="${live}" stroke-width="2.2"/>`;
        out += `<rect x="${bl.toFixed(1)}" y="${(RC[1] - 6).toFixed(1)}" width="11" height="12" rx="2" fill="#334155"/><rect x="${br.toFixed(1)}" y="${(RC[1] - 6).toFixed(1)}" width="11" height="12" rx="2" fill="#334155"/>`;
        out += `<rect x="${(BX - 24).toFixed(1)}" y="${BY - 12}" width="48" height="24" rx="4" fill="#f8fafc" stroke="#475569" stroke-width="1.6"/><rect x="${(BX + 24).toFixed(1)}" y="${BY - 5}" width="5" height="10" fill="#475569"/><text class="small-label" x="${(BX - 15).toFixed(1)}" y="${BY + 5}">−</text><text class="small-label" x="${(BX + 7).toFixed(1)}" y="${BY + 5}">+</text>`;
        out += nB.front + sB.front;
        // 짧은 이름표
        out += `<text class="small-label" x="${(BX + 52).toFixed(1)}" y="${BY + 5}">전지</text>`;
        out += `<text class="small-label" x="${(br + 16).toFixed(1)}" y="${(RC[1] + 26).toFixed(1)}">브러시</text>`;
        out += `<text class="small-label" x="${(bl - 6).toFixed(1)}" y="${(RC[1] + 26).toFixed(1)}" text-anchor="end">${a.comm ? '정류자' : '통고리'}</text>`;
        out += `<text class="small-label" x="262" y="22" text-anchor="middle">자기장 B →</text>`;
        // 수치 읽기(그림 밖 HTML로 옮겨짐)
        out += `<text class="trait-text prose" x="20" y="40">τ 최대 = ${fmtTau(a.tauMax)} (코일 ${a.N}번 × ${a.I} A × 12 cm² × 0.5 T)</text>`;
        if (on) out += `<text class="trait-text prose" x="20" y="60">각 θ = ${fmtN(((phi * 180 / Math.PI) % 360 + 360) % 360)}° · τ = ${fmtTau(tau)} · ${fmtN(Math.abs(w), 1)} rad/s (${fmtN(Math.abs(w) / (2 * Math.PI) * 60)} rpm) · ${fmtN(Math.abs(phi - Math.PI / 2) / (2 * Math.PI), 2)}바퀴 · ${fmtN(t, 1)} s</text>`;
        const VERD = { spin: '계속 돎', wobble: '흔들리다 멈춤', still: '거의 안 움직임' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${p >= 1 ? `${a.N}번 · ${a.I} A · 정류자 ${COMMS[state.comm].label}: ${VERD[a.verdict]} (6 s 동안 ${fmtN(a.turns, 1)}바퀴)` : `${a.N}번 감은 코일 · ${a.I} A · 정류자 ${COMMS[state.comm].label}`}</text>`;
        out += `<text class="note-text" x="20" y="208">돌림힘 τ = NIAB sinθ (θ는 코일 법선과 B의 각). 관성과 마찰은 작은 모형 전동기 값(대략). 초록 화살은 도선이 받는 힘 F = BIL, 갈색 꺾쇠는 전류 방향입니다.</text>`;
        return out;
    }

    function graphMotor(a) {
        const X0 = 76, X1 = 420, Y0 = 150, Y1 = 40, tm = Math.max(a.tauMax, 1e-4), xOf = t => X0 + t / SIM_T * (X1 - X0), yOf = tau => (Y0 + Y1) / 2 - clamp(tau / tm, -1, 1) * (Y0 - Y1) / 2;
        let out = `<text class="axis-title" x="20" y="18">시간에 따른 돌림힘 (mN·m)</text>`;
        [0, 1, 2, 3, 4, 5, 6].forEach(t => { out += `<line class="grid-line" x1="${xOf(t).toFixed(1)}" y1="${Y1}" x2="${xOf(t).toFixed(1)}" y2="${Y0}"/><text class="axis-text" x="${xOf(t).toFixed(1)}" y="${Y0 + 14}" text-anchor="${t === 0 ? 'start' : 'middle'}">${t} s</text>`; });
        [[-1, `−${fmtN(tm * 1000, tm >= 0.01 ? 0 : 1)}`], [0, '0'], [1, `+${fmtN(tm * 1000, tm >= 0.01 ? 0 : 1)}`]].forEach(([k, lab]) => { out += `<line class="grid-line" x1="${X0}" y1="${yOf(k * tm).toFixed(1)}" x2="${X1}" y2="${yOf(k * tm).toFixed(1)}"/><text class="axis-text" x="${X0 - 5}" y="${(yOf(k * tm) + 3.5).toFixed(1)}" text-anchor="end">${lab}</text>`; });
        out += `<line class="axis" x1="${X0}" y1="${yOf(0).toFixed(1)}" x2="${X1}" y2="${yOf(0).toFixed(1)}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        const idx = Math.min(a.samples.length - 1, Math.round(state.progress * (a.samples.length - 1)));
        let d = ''; a.samples.forEach(([t, phi, w, tau], i) => { if (i <= idx && i % 2 === 0) d += `${d ? 'L' : 'M'}${xOf(t).toFixed(1)},${yOf(-tau).toFixed(1)} `; });
        out += `<path class="trace" style="stroke:#d97706" d="${d}"/>`;
        if (state.progress > 0) { const [t, , , tau] = a.samples[idx]; out += `<circle fill="#d97706" stroke="#fff" cx="${xOf(t).toFixed(1)}" cy="${yOf(-tau).toFixed(1)}" r="4"/>`; }
        if (state.progress >= 1) out += `<text class="axis-title" x="${(X0 + X1) / 2}" y="${Y0 + 30}" text-anchor="middle">${a.moves ? (a.comm ? '돌림힘이 0이 되는 죽은점은 관성으로 넘고, 마찰과 균형을 이루면 속도가 일정해집니다' : '되돌리는 돌림힘이 번갈아 나타나 흔들림이 점점 줄어듭니다') : '돌림힘이 정지 마찰보다 작아 코일이 꼼짝하지 않습니다'}</text>`;
        return out;
    }

    function renderMaterial(a) {
        const p = state.progress, { m, F } = a, e = ease(p), MX = 70 + 50 * e, SX = 204, SY = 96, SW = 56, SH = 44;
        const shift = m.kind === 'ferro' ? -26 * e : (F > 0 ? -5 : 5) * e, sx = SX + shift;
        let out = `<rect class="magnet-s" x="${(MX - 60).toFixed(1)}" y="86" width="60" height="42" rx="3"/><rect class="magnet-n" x="${MX.toFixed(1)}" y="86" width="60" height="42" rx="3"/>`;
        out += `<text class="pole-text" x="${(MX - 30).toFixed(1)}" y="112" text-anchor="middle">S</text><text class="pole-text" x="${(MX + 30).toFixed(1)}" y="112" text-anchor="middle">N</text>`;
        for (let k = 0; k < 3; k += 1) out += arrow(MX + 64, 96 + k * 12, MX + 64 + 14 + 12 * e, 96 + k * 12, 'field', 'field-head', 2.5);
        // balance pan and post
        out += `<path class="balance" d="M${(SX - 12)},${SY + SH + 4} L${(SX + SW + 12)},${SY + SH + 4} M${SX + SW / 2},${SY + SH + 4} L${SX + SW / 2},${SY + SH + 26} M${SX + SW / 2 - 24},${SY + SH + 26} L${SX + SW / 2 + 24},${SY + SH + 26}"/>`;
        out += `<rect class="sample${m.kind === 'ferro' ? ' ferro' : ''}" x="${sx.toFixed(1)}" y="${SY}" width="${SW}" height="${SH}" rx="3"/>`;
        // atomic dipoles: ferro fully aligned, para slightly, dia slightly reversed
        const align = m.kind === 'ferro' ? e : m.kind === 'para' ? 0.35 * e : -0.35 * e;
        for (let i = 0; i < 12; i += 1) {
            const cx = sx + 8 + (i % 4) * 14, cy = SY + 9 + Math.floor(i / 4) * 13, base = (rnd(i) - 0.5) * Math.PI * 2 * (1 - Math.abs(align)), ang = align >= 0 ? base * (1 - Math.abs(align)) : Math.PI + base * (1 - Math.abs(align)), len = m.kind === 'ferro' ? 5.5 : 4;
            out += arrow(cx - len * Math.cos(ang), cy - len * Math.sin(ang), cx + len * Math.cos(ang), cy + len * Math.sin(ang), `dipole${m.kind === 'dia' ? ' dia' : ''}`, `dipole-head${m.kind === 'dia' ? ' dia' : ''}`, 2);
        }
        if (p > 0.05) { const fl = 12 + 22 * clamp(Math.log10(Math.abs(F) / 1e-5) / 7, 0, 1); out += arrow(sx + SW / 2, SY - 12, sx + SW / 2 + (F > 0 ? -fl : fl), SY - 12, F > 0 ? 'pull' : 'push', F > 0 ? 'pull-head' : 'push-head', 3); }
        out += `<text class="small-label" x="${SX + SW / 2}" y="${SY + SH + 42}" text-anchor="middle">저울 눈금 변화 ${p > 0.05 ? `${F > 0 ? '−' : '+'}${fmtN(Math.abs(F) / 9.8 * 1000 * e, Math.abs(F) < 1e-3 ? 2 : Math.abs(F) < 1 ? 1 : 0)} g` : '없음'}</text>`;
        out += `<text class="small-label" x="${SX + SW / 2}" y="${SY - 24}" text-anchor="middle">${m.label} 1 cm³ (${m.hint})</text>`;
        const TX = 302;
        out += `<text class="trait-text" x="${TX}" y="48">χ = ${m.kind === 'ferro' ? '수천 (강자성)' : `${fmtN(m.chi * 1e6, m.kind === 'dia' && Math.abs(m.chi) < 1e-5 ? 1 : 0)} × 10⁻⁶`}</text>`;
        out += `<text class="trait-text" x="${TX}" y="64">${m.kind === 'ferro' ? '포화 M = 1.7 × 10⁶ A/m' : 'B = 0.5 T · dB/dx = 50 T/m'}</text>`;
        out += `<text class="trait-text" x="${TX}" y="80">${m.kind === 'ferro' ? 'F = M V (dB/dx), dB/dx = 50 T/m' : 'F = χ V B (dB/dx) / μ₀'}</text>`;
        if (p > 0) out += `<text class="gen-text" style="fill:${F > 0 ? '#059669' : '#dc2626'}" x="${TX}" y="104">F = ${fmtF(F)} (${F > 0 ? '끌림' : '밀림'})</text>`;
        if (p > 0) out += `<text class="small-label" x="${TX}" y="126">${m.kind === 'ferro' ? '자기 구역이 통째로 정렬' : m.kind === 'para' ? '원자 자석이 조금 정렬' : '자기장과 반대로 자기화'}</text>`;
        if (p > 0) out += `<text class="small-label" x="${TX}" y="140">${m.kind === 'ferro' ? '→ 시료 무게(7.9 g)의 천 배 넘는 힘' : `→ 시료 무게(≈ ${fmtN([7.9, 21.5, 2.7, 9.0, 9.8][Object.keys(MATERIALS).indexOf(state.material)], 1)} g)의 ${fmtN(Math.abs(F) / 9.8 * 1000 / [7.9, 21.5, 2.7, 9.0, 9.8][Object.keys(MATERIALS).indexOf(state.material)] * 100, 1)} %`}</text>`;
        const VERD = { strong: '세게 끌림', weak: '아주 약하게 끌림', repel: '아주 약하게 밀림' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${p >= 1 ? `${m.label}: ${fmtF(F)} — ${VERD[a.verdict]}` : `${m.label} 1 cm³에 자석을 가까이 대는 중`}</text>`;
        out += `<text class="note-text" x="20" y="208">노란 화살은 원자 자석의 방향(자기 구역). 힘의 크기는 실제 자화율과 센 네오디뮴 자석 값으로 계산(대략)</text>`;
        return out;
    }

    function graphMaterial(a) {
        const X0 = 66, X1 = 420, YM = 100, H = 56, keys = Object.keys(MATERIALS), n = keys.length, bw = (X1 - X0) / n;
        const yOf = F => YM - Math.sign(F) * clamp(Math.log10(Math.abs(F) / 1e-5), 0, 7) / 7 * H;
        let out = `<text class="axis-title" x="${X0}" y="18">다섯 시료가 받는 힘 — 위는 끌림, 아래는 밀림, 눈금은 10배씩 (로그)</text>`;
        [1e-4, 1e-2, 1, 100].forEach(v => { out += `<line class="grid-line" x1="${X0}" y1="${yOf(v).toFixed(1)}" x2="${X1}" y2="${yOf(v).toFixed(1)}"/><text class="axis-text" x="${X0 - 5}" y="${(yOf(v) + 3.5).toFixed(1)}" text-anchor="end">${v >= 1 ? `${v} N` : `${fmtN(v * 1000, v < 1e-3 ? 1 : 0)} mN`}</text>`; });
        [-1e-4, -1e-2].forEach(v => { out += `<line class="grid-line" x1="${X0}" y1="${yOf(v).toFixed(1)}" x2="${X1}" y2="${yOf(v).toFixed(1)}"/><text class="axis-text" x="${X0 - 5}" y="${(yOf(v) + 3.5).toFixed(1)}" text-anchor="end">−${fmtN(-v * 1000, v > -1e-3 ? 1 : 0)} mN</text>`; });
        out += `<line class="axis" x1="${X0}" y1="${YM}" x2="${X1}" y2="${YM}"/>`;
        keys.forEach((k, i) => {
            const m = MATERIALS[k], F = m.kind === 'ferro' ? m.Ms * VOL * GRAD_B : m.chi * VOL / MU0 * B_MAG * GRAD_B, x = X0 + bw * i + bw * 0.2, w = bw * 0.6, y = yOf(F), top = Math.min(y, YM), h = Math.abs(y - YM);
            out += `<rect class="${F > 0 ? 'bar-pos' : 'bar-neg'}" style="${k === state.material ? 'stroke:#d97706;stroke-width:2' : ''}" x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${w.toFixed(1)}" height="${Math.max(1, h).toFixed(1)}" rx="2"/>`;
            out += `<text class="axis-text" style="${k === state.material ? 'fill:#d97706' : ''}" x="${(x + w / 2).toFixed(1)}" y="${YM + H + 20}" text-anchor="middle">${m.label}</text>`;
            out += `<text class="small-label" x="${(x + w / 2).toFixed(1)}" y="${(F > 0 ? top - 5 : top + h + 11).toFixed(1)}" text-anchor="middle">${fmtF(F)}</text>`;
        });
        out += `<text class="axis-title" x="${(X0 + X1) / 2}" y="${YM + H + 34}" text-anchor="middle">강자성체는 상자성체의 만 배 넘게 끌리고, 반자성체는 반대로 밀립니다</text>`;
        return out;
    }

    function renderCurie(a) {
        const p = state.progress, { f, T, ratio } = a, heatP = clamp(p / 0.5, 0, 1), magP = clamp((p - 0.5) / 0.5, 0, 1), Tnow = 20 + (T - 20) * ease(heatP);
        const BX = 214, BY = 80, BW = 88, BH = 60, align = ratio * ease(magP), bx = BX - 12 * align;
        const hue = Tnow < 400 ? '#7d8b96' : Tnow < 700 ? '#a33d2c' : Tnow < 900 ? '#e0442d' : '#ffa64a';
        let out = `<rect class="block" fill="${hue}" fill-opacity=".45" x="${bx.toFixed(1)}" y="${BY}" width="${BW}" height="${BH}" rx="4"/>`;
        // domains: thermal disorder grows with T/Tc; the magnet aligns what is left
        const disorder = T >= f.Tc ? 1 : clamp(((Tnow + 273) / (f.Tc + 273)) ** 3, 0, 1);
        for (let i = 0; i < 24; i += 1) {
            const cx = bx + 8 + (i % 6) * 14.5, cy = BY + 8 + Math.floor(i / 6) * 15;
            const domainDir = (Math.floor(i / 6) % 2 === 0 ? 0 : Math.PI) + (rnd(i + 40) - 0.5) * 0.3;
            const wobble = (rnd(i) - 0.5) * 2 * Math.PI * disorder + Math.sin(p * 40 + i) * 0.5 * disorder;
            const ang = align > 0 ? (1 - align) * (domainDir + wobble) : domainDir + wobble;
            out += arrow(cx - 5 * Math.cos(ang), cy - 5 * Math.sin(ang), cx + 5 * Math.cos(ang), cy + 5 * Math.sin(ang), 'domain', 'domain-head', 2);
        }
        // flame under the block, magnet approaching from the left in the second half
        if (T > 20) for (let k = 0; k < 4; k += 1) { const fx = BX + 14 + k * 20, fh = 10 + 10 * heatP * (T / 900) + 3 * Math.sin(p * 30 + k); out += `<path class="flame" d="M${fx - 6},${BY + BH + 16} Q${fx},${BY + BH + 16 - fh * 2} ${fx + 6},${BY + BH + 16} Z"/>`; }
        const MX = 60 + 84 * ease(magP);
        out += `<rect class="magnet-s" x="${(MX - 50).toFixed(1)}" y="${BY + 8}" width="50" height="44" rx="3"/><rect class="magnet-n" x="${MX.toFixed(1)}" y="${BY + 8}" width="50" height="44" rx="3"/>`;
        out += `<text class="pole-text" x="${(MX - 25).toFixed(1)}" y="${BY + 35}" text-anchor="middle">S</text><text class="pole-text" x="${(MX + 25).toFixed(1)}" y="${BY + 35}" text-anchor="middle">N</text>`;
        if (magP > 0 && align > 0.02) out += arrow(bx + BW / 2, BY - 8, bx + BW / 2 - 14 - 26 * ratio, BY - 8, 'pull', 'pull-head', 3);
        out += `<text class="small-label" x="${BX + BW / 2}" y="${BY - 20}" text-anchor="middle">${f.label} 덩이 · 지금 ${fmtN(Tnow)} ℃</text>`;
        out += `<text class="small-label" x="${BX + BW / 2}" y="${BY + BH + 44}" text-anchor="middle">${p < 0.5 ? (T > 20 ? '가열하는 중 — 열운동이 정렬을 흔듦' : '실온 그대로') : '자석을 가까이 대는 중'}</text>`;
        const TX = 330;
        out += `<text class="trait-text" x="${TX}" y="52">퀴리 온도 ${fmtN(f.Tc)} ℃ (${fmtN(f.Tc + 273)} K)</text>`;
        out += `<text class="trait-text" x="${TX}" y="70">가열 온도 ${T} ℃ (${T + 273} K)</text>`;
        out += `<text class="trait-text" x="${TX}" y="88">T/Tc = ${fmtN((T + 273) / (f.Tc + 273), 2)}</text>`;
        if (p > 0) out += `<text class="gen-text" style="fill:#d97706" x="${TX}" y="110">자발 자기화 M/M₀ = ${fmtN(ratio, 2)}</text>`;
        if (p > 0) out += `<text class="small-label" x="${TX}" y="130">${T >= f.Tc ? '퀴리 온도 위 — 자기 구역 사라짐' : 'M/M₀ ≈ (1 − T/Tc)^⅓ (대략)'}</text>`;
        if (p > 0) out += `<text class="small-label" x="${TX}" y="144">${T >= f.Tc ? '상자성체처럼 아주 약하게만 끌림' : `자발 자기화는 실온의 ${fmtN(ratio / Math.pow(1 - 293 / (f.Tc + 273), 1 / 3) * 100)} %`}</text>`;
        const VERD = { strong: '세게 붙음', weak: '약하게 붙음', none: '안 붙음' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${p >= 1 ? `${T} ℃의 ${f.label}: M/M₀ = ${fmtN(ratio, 2)} — ${VERD[a.verdict]}` : `${f.label} · ${T} ℃로 달구고 자석 대기`}</text>`;
        out += `<text class="note-text" x="20" y="208">노란 화살은 자기 구역의 방향. 자기화 곡선은 퀴리 온도 근처의 어림식이고, 식으면 다시 강자성체가 됩니다</text>`;
        return out;
    }

    function graphCurie(a) {
        const X0 = 60, X1 = 420, Y0 = 150, Y1 = 40, TM = 1300, xOf = T => X0 + T / TM * (X1 - X0), yOf = r => Y0 - clamp(r, 0, 1) * (Y0 - Y1);
        let out = `<text class="axis-title" x="${X0}" y="18">온도에 따른 자발 자기화 M/M₀ — 퀴리 온도에서 0이 됩니다</text>`;
        [0, 200, 400, 600, 800, 1000, 1200].forEach(T => { out += `<line class="grid-line" x1="${xOf(T).toFixed(1)}" y1="${Y1}" x2="${xOf(T).toFixed(1)}" y2="${Y0}"/><text class="axis-text" x="${xOf(T).toFixed(1)}" y="${Y0 + 14}" text-anchor="${T === 0 ? 'start' : 'middle'}">${T} ℃</text>`; });
        [0, 0.5, 1].forEach(r => { out += `<line class="grid-line" x1="${X0}" y1="${yOf(r).toFixed(1)}" x2="${X1}" y2="${yOf(r).toFixed(1)}"/><text class="axis-text" x="${X0 - 5}" y="${(yOf(r) + 3.5).toFixed(1)}" text-anchor="end">${r}</text>`; });
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        const cols = { fe: '#dc2626', ni: '#97dad3', co: '#0284c7' };
        Object.entries(FERROS).forEach(([k, f]) => {
            let d = ''; for (let T = 0; T <= TM; T += 5) { const r = T >= f.Tc ? 0 : Math.pow(1 - (T + 273) / (f.Tc + 273), 1 / 3); d += `${d ? 'L' : 'M'}${xOf(T).toFixed(1)},${yOf(r).toFixed(1)} `; }
            out += `<path class="trace${k === state.ferro ? '' : ' faint'}" style="stroke:${cols[k]}" d="${d}"/>`;
            out += `<text class="small-label" style="fill:${cols[k]}" x="${(xOf(f.Tc) + (k === 'co' ? -6 : 6)).toFixed(1)}" y="${Y1 + 12 + { fe: 0, ni: 14, co: 28 }[k]}" text-anchor="${k === 'co' ? 'end' : 'start'}">${f.label} ${f.Tc} ℃</text>`;
        });
        out += `<circle fill="#d97706" stroke="#fff" cx="${xOf(a.T).toFixed(1)}" cy="${yOf(a.ratio).toFixed(1)}" r="4.5"/>`;
        out += `<text class="axis-title" x="${(X0 + X1) / 2}" y="${Y0 + 30}" text-anchor="middle">온도 — 뜨거워질수록 열운동이 정렬을 흐트러뜨려 자발 자기화가 줄어듭니다</text>`;
        return out;
    }

    function noteFor(a) {
        if (a.kind === 'motor') {
            return `<div class="data-row"><span class="data-name">돌림힘</span><span class="data-val">τ = NIAB sinθ = ${a.N} × ${a.I} A × 1.2 × 10⁻³ m² × 0.5 T × sinθ → 최대 ${fmtTau(a.tauMax)}</span></div>` +
                `<div class="data-row"><span class="data-name">정지 마찰</span><span class="data-val">${fmtTau(TAU_STATIC)}${state.progress >= 1 ? ` — ${a.moves ? '돌림힘이 더 커서 움직임' : '돌림힘이 이보다 작아 꼼짝 않음'}` : ''}</span></div>` + (state.progress < 1 ? '' :
                `<div class="data-row"><span class="data-name">6초 뒤</span><span class="data-val">${a.moves ? `${fmtN(a.turns, 2)}바퀴 돎, 각속도 ${fmtN(Math.abs(a.wEnd), 1)} rad/s` : '제자리'}${a.comm ? ' (정류자가 반 바퀴마다 전류를 뒤집음)' : ' (전류 방향 그대로)'}</span></div>` +
                `<div class="data-row match"><span class="data-name">판정</span><span class="data-val">${{ spin: '계속 돎', wobble: '반 바퀴 가다 흔들리며 멈춤', still: '거의 안 움직임' }[a.verdict]}</span></div>`);
        }
        if (a.kind === 'material') {
            return `<div class="data-row"><span class="data-name">시료</span><span class="data-val">${a.m.label} 1 cm³ — ${a.m.kind === 'ferro' ? '강자성체, 포화 자기화 1.7 × 10⁶ A/m' : `${a.m.kind === 'para' ? '상자성체' : '반자성체'}, 자화율 ${fmtN(a.m.chi * 1e6, Math.abs(a.m.chi) < 1e-5 ? 1 : 0)} × 10⁻⁶`}</span></div>` +
                `<div class="data-row"><span class="data-name">힘</span><span class="data-val">${a.m.kind === 'ferro' ? 'M V dB/dx = 1.7 × 10⁶ × 10⁻⁶ × 50' : `χ V B (dB/dx) / μ₀ = ${fmtN(a.m.chi * 1e6, 1)} × 10⁻⁶ × 10⁻⁶ × 0.5 × 50 ÷ (4π × 10⁻⁷)`} = ${fmtF(a.F)}</span></div>` +
                `<div class="data-row"><span class="data-name">저울</span><span class="data-val">${fmtN(Math.abs(a.F) / 9.8 * 1000, Math.abs(a.F) < 1e-3 ? 3 : Math.abs(a.F) < 1 ? 1 : 0)} g만큼 ${a.F > 0 ? '가벼워짐 (자석 쪽으로 끌림)' : '무거워짐 (자석에서 밀림)'}</span></div>` +
                `<div class="data-row match"><span class="data-name">판정</span><span class="data-val">${{ strong: '세게 끌림', weak: '아주 약하게 끌림', repel: '아주 약하게 밀림' }[a.verdict]}</span></div>`;
        }
        return `<div class="data-row"><span class="data-name">온도</span><span class="data-val">${a.T} ℃ = ${a.T + 273} K, ${a.f.label}의 퀴리 온도 ${fmtN(a.f.Tc)} ℃ = ${fmtN(a.f.Tc + 273)} K → T/Tc = ${fmtN((a.T + 273) / (a.f.Tc + 273), 2)}</span></div>` +
            `<div class="data-row"><span class="data-name">자기화</span><span class="data-val">${a.T >= a.f.Tc ? '자발 자기화 0 · 외부 장에 대한 상자성 반응은 남음' : `(1 − ${fmtN((a.T + 273) / (a.f.Tc + 273), 2)})^⅓ = ${fmtN(a.ratio, 2)} (실온 ${fmtN(Math.pow(1 - 293 / (a.f.Tc + 273), 1 / 3), 2)})`}</span></div>` +
            `<div class="data-row"><span class="data-name">자석에</span><span class="data-val">${a.verdict === 'strong' ? '자기 구역이 정렬해 세게 붙음' : a.verdict === 'weak' ? '정렬이 많이 흐트러져 약하게 붙음' : '상자성체처럼 아주 약하게만 끌려 붙지 않음'}</span></div>` +
            `<div class="data-row match"><span class="data-name">판정</span><span class="data-val">${{ strong: '세게 붙음', weak: '약하게 붙음', none: '안 붙음' }[a.verdict]}</span></div>`;
    }

    function render() {
        const a = analyse();
        const box = a.kind === 'motor' ? '0 0 460 256' : '0 0 460 214';
        if (mainSvg.getAttribute('viewBox') !== box) mainSvg.setAttribute('viewBox', box);
        window.scienceScene.render(mainGroup,a.kind === 'motor' ? renderMotor(a) : a.kind === 'material' ? renderMaterial(a) : renderCurie(a));
        window.scienceScene.render(graphGroup,a.kind === 'motor' ? graphMotor(a) : a.kind === 'material' ? graphMaterial(a) : graphCurie(a));
        liftProse();
        stageBadge.textContent = a.kind === 'motor' ? `${TURNS[state.turns].label} · ${CURRENTS[state.current].label} · 정류자 ${COMMS[state.comm].label}` : a.kind === 'material' ? `${a.m.label} · ${a.m.hint}` : `${a.f.label} · ${a.T} ℃`;
        methodHint.textContent = a.kind === 'motor' ? '돌림힘은 감은 수 × 전류 × 넓이 × 자기장, 정류자가 반 바퀴마다 전류를 뒤집습니다'
            : a.kind === 'material' ? '강자성체는 세게 끌리고, 상자성체는 아주 약하게 끌리고, 반자성체는 아주 약하게 밀립니다'
                : '퀴리 온도 위에서는 강자성 질서가 사라지고 약한 상자성 반응이 남습니다';
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
        if (a.kind === 'motor') {
            labelA.textContent = '최대 돌림힘'; valueA.textContent = fmtTau(a.tauMax);
            labelB.textContent = '6초 동안'; valueB.textContent = a.verdict === 'spin' ? `${fmtN(a.turns, 1)}바퀴` : a.verdict === 'wobble' ? '흔들리다 멈춤' : '제자리';
            s = `코일을 ${a.N}번 감고 ${a.I} A를 흘리면 12 cm² 코일이 0.5 T 자기장에서 받는 돌림힘은 최대 τ = NIAB = ${fmtTau(a.tauMax)}입니다. `;
            if (!a.moves) s += `이 값이 축의 정지 마찰 ${fmtTau(TAU_STATIC)}보다 작아 코일은 꼼짝하지 않습니다. 감은 수나 전류를 늘리면 돌림힘이 그에 비례해 커지므로 곧 돌기 시작합니다.`;
            else if (a.comm) s += `코일 면이 자기장과 수직이 되는 순간 돌림힘은 0이 되지만, 정류자가 바로 그때 전류 방향을 뒤집어 다음 반 바퀴에도 같은 방향의 돌림힘이 생기고 코일은 관성으로 죽은점을 넘습니다. 그래서 계속 돌며, 마찰과 돌림힘이 균형을 이루면 각속도 ${fmtN(Math.abs(a.wEnd), 1)} rad/s(${fmtN(Math.abs(a.wEnd) / (2 * Math.PI) * 60)} rpm)로 일정해져 6초 동안 ${fmtN(a.turns, 1)}바퀴 돌았습니다.`;
            else s += `정류자가 없으면 코일이 수직 자리를 지나는 순간 돌림힘의 방향이 거꾸로 되어 코일을 되돌립니다. 코일은 수직 자리를 가운데 두고 앞뒤로 흔들리다 마찰에 잦아들어 결국 코일 면이 자기장과 수직인 자리에 멈춥니다. 도선의 전류 방향은 그대로인데 돌림힘만 번갈아 바뀌는 것이 그래프에 보입니다.`;
        } else if (a.kind === 'material') {
            const { m, F } = a;
            labelA.textContent = '힘'; valueA.textContent = fmtF(F);
            labelB.textContent = '자화율'; valueB.textContent = m.kind === 'ferro' ? '수천' : `${fmtN(m.chi * 1e6, Math.abs(m.chi) < 1e-5 ? 1 : 0)} × 10⁻⁶`;
            if (m.kind === 'ferro') s = `철은 강자성체라 원자 자석들이 자기 구역이라는 덩어리로 이미 같은 방향을 향하고 있고, 자석을 대면 이 구역들이 통째로 자기장 쪽으로 정렬해 포화 자기화 1.7 × 10⁶ A/m에 이릅니다. 1 cm³가 자기장 기울기 50 T/m 속에서 받는 힘은 F = MV(dB/dx) = ${fmtF(F)}로, 시료 무게 7.9 g(0.08 N)의 천 배가 넘어 자석에 달라붙습니다.`;
            else if (m.kind === 'para') s = `${m.label}은 상자성체라 원자 자석이 자기장 쪽으로 아주 조금만 정렬합니다. 자화율 ${fmtN(m.chi * 1e6)} × 10⁻⁶으로 힘은 F = χVB(dB/dx)/μ₀ = ${fmtF(F)}, 저울 눈금이 ${fmtN(F / 9.8 * 1000, 2)} g 가벼워지는 정도입니다. 손으로는 못 느끼지만 민감한 저울이나 실에 매달아 보면 자석 쪽으로 끌리는 것을 알 수 있습니다.`;
            else s = `${m.label}는 반자성체라 자기장을 걸면 반대 방향으로 자기화됩니다. 자화율 ${fmtN(m.chi * 1e6, Math.abs(m.chi) < 1e-5 ? 1 : 0)} × 10⁻⁶으로 힘은 ${fmtF(F)}, 곧 자석에서 밀려나며 저울 눈금이 ${fmtN(-F / 9.8 * 1000, 2)} g 무거워집니다. 물도 반자성체라 아주 센 자석(16 T) 위에서는 물이 많은 개구리가 떠오릅니다.`;
        } else {
            const { f, T, ratio } = a;
            labelA.textContent = '자발 자기화 M/M₀'; valueA.textContent = fmtN(ratio, 2);
            labelB.textContent = '퀴리 온도'; valueB.textContent = `${fmtN(f.Tc)} ℃`;
            s = `${f.label}의 퀴리 온도는 ${fmtN(f.Tc)} ℃입니다. ${T} ℃로 달구면 T/Tc = ${fmtN((T + 273) / (f.Tc + 273), 2)}이고, `;
            if (a.verdict === 'none') s += `퀴리 온도를 넘어 열운동이 원자 자석의 정렬을 완전히 흐트러뜨려 자기 구역이 사라집니다. 자석을 대도 약한 상자성 반응은 남습니다. 그림은 이 작은 반응을 생략한 모형이며, 실제 붙는지는 장의 세기·기울기와 지지 조건에 달려 있습니다. 식혀서 퀴리 온도 아래로 내려오면 자기 구역이 다시 생겨 강자성체로 돌아옵니다.`;
            else if (a.verdict === 'weak') s += `퀴리 온도에 가까워 자기화가 실온의 ${fmtN(ratio / Math.pow(1 - 293 / (f.Tc + 273), 1 / 3) * 100)} %로 줄었습니다. 자기 구역은 남아 있지만 열운동에 많이 흐트러져 자석에 약하게만 붙고, 조금 더 데우면 떨어집니다.`;
            else s += `아직 퀴리 온도에서 멀어 자기화가 실온의 ${fmtN(ratio / Math.pow(1 - 293 / (f.Tc + 273), 1 / 3) * 100)} %로 자기 구역이 잘 정렬합니다. 자석을 대면 세게 붙습니다.${T > 20 ? ` ${T} ℃로 달궈도 ${f.label}의 자성은 아직 남아 있습니다.` : ''}`;
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
        checkBtn.textContent = state.mode === 'motor' ? '전류 흘리기' : state.mode === 'material' ? '자석 가까이 대기' : '달구고 자석 대기';
        stageCaption.textContent = state.mode === 'motor' ? '비스듬히 내려다본 전동기입니다. 갈색 꺾쇠는 코일에 흐르는 전류의 방향, 초록 화살은 도선이 받는 힘입니다.'
            : state.mode === 'material' ? '저울 위의 시료 1 cm³에 자석의 N극을 가까이 댑니다. 시료 속 노란 화살은 원자 자석의 방향, 위 화살은 시료가 받는 힘입니다.'
                : '먼저 덩이를 달구고(앞 절반), 그 다음 자석을 가까이 댑니다(뒤 절반). 노란 화살이 자기 구역의 방향입니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { current: 'i1', turns: 'n10', comm: 'yes', material: 'iron', ferro: 'fe', heat: 't20', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'motor').click();
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

    window.__motorModel = {
        CURRENTS, TURNS, COMMS, MATERIALS, FERROS, HEATS, state,
        analyse, render, runSeconds,
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
