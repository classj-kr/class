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
    const C = 299792, MPC_LY = 3.262e6, AGE_K = 977.8; // km/s, light-years per Mpc, 1/H₀ in Gyr when H₀ is in km/s/Mpc
    const ARMS = { none: { label: '없음', hint: '매끈함' }, tight: { label: '촘촘히 감김', hint: '팔 사이 각 12°' }, loose: { label: '느슨하게 감김', hint: '팔 사이 각 28°' } };
    const BULGES = { big: { label: '크고 둥긂', hint: '가운데 뭉침 큼' }, small: { label: '작고 납작함', hint: '가운데 뭉침 작음' }, none: { label: '없음', hint: '한가운데가 없음' } };
    const BARS = { no: { label: '없음', hint: '' }, yes: { label: '있음', hint: '가운데 막대' } };
    // real objects: redshift z, kind of spectrum, distance in millions of light-years (대략)
    const OBJECTS = {
        virgo: { label: '처녀자리', hint: '가까운 은하단', z: 0.00428, kind: 'galaxy', name: '처녀자리 은하단 (M87)', dist: 54 },
        coma: { label: '머리털자리', hint: '먼 은하단', z: 0.0231, kind: 'galaxy', name: '머리털자리 은하단', dist: 320 },
        q3c273: { label: '3C 273', hint: '가장 밝은 퀘이사', z: 0.158, kind: 'quasar', name: '퀘이사 3C 273', dist: 2400 },
        farGal: { label: '먼 은하', hint: '깊은 하늘 은하', z: 0.5, kind: 'galaxy', name: '먼 은하 (z = 0.5)', dist: 5000 },
        farQ: { label: '먼 퀘이사', hint: '더 먼 퀘이사', z: 1.0, kind: 'quasar', name: '먼 퀘이사 (z = 1)', dist: 7800 },
    };
    // rest wavelengths (nm); galaxies show absorption lines, quasars emission lines
    const LINES = {
        galaxy: [['Ca H·K', 393.4, false], ['Ca H', 396.8, false], ['Hβ', 486.1, false], ['Mg', 517.3, false], ['Na', 589.3, false], ['Hα', 656.3, true]],
        quasar: [['Mg II', 279.8, false], ['Hγ', 434.0, false], ['Hβ', 486.1, true], ['Hα', 656.3, false]],
    };
    // real galaxies and clusters: distance (Mpc), radial velocity (km/s)
    const SAMPLES = {
        near: { label: '가까운 은하 6개', hint: '1,000만 광년 안쪽', list: [['안드로메다 M31', 0.78, -300], ['삼각형자리 M33', 0.84, -179], ['큰곰자리 M81', 3.6, -34], ['바람개비 M101', 6.4, 241], ['소용돌이 M51', 8.6, 463], ['바다뱀자리 M83', 4.6, 513]] },
        far: { label: '먼 은하단까지 6개', hint: '3억 광년까지', list: [['바람개비 M101', 6.4, 241], ['처녀자리 M87', 16.5, 1284], ['센타우루스자리 은하단', 45, 3420], ['바다뱀자리 은하단', 50, 3780], ['페르세우스자리 은하단', 73, 5264], ['머리털자리 은하단', 99, 6930]] },
    };
    const SCALES = { today: { label: '오늘날 눈금', hint: '세페이드 밝기 바로잡음', f: 1 }, h1929: { label: '허블 1929년 눈금', hint: '거리를 7분의 1로 잼', f: 1 / 7 } };

    const state = { mode: 'classify', arms: 'tight', bulge: 'big', bar: 'no', object: 'virgo', sample: 'far', scale: 'today', progress: 0, prediction: null };
    let running = false, frameId = 0, lastStamp = 0;

    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const ease = p => p < 0.5 ? 2 * p * p : 1 - (1 - p) * (1 - p) * 2;
    const fmtN = (n, d = 0) => (+n.toFixed(d)).toLocaleString('ko-KR', { minimumFractionDigits: d, maximumFractionDigits: d }).replace('-', '−');
    const rnd = i => (((i * 7919 + 13) * 104729) % 100003) / 100003;
    const lyText = d => d >= 1000 ? `${fmtN(d / 100)}억 광년` : d >= 100 ? `${fmtN(d / 100, 1)}억 광년` : `${fmtN(d * 100)}만 광년`;

    /* ------------------------------------------------------------ models */
    function classifyModel() {
        const arms = state.arms, bulge = state.bulge, bar = arms === 'none' ? 'no' : state.bar;
        let cls, code, sub;
        if (bulge === 'none') { cls = 'irr'; code = 'Irr'; sub = arms === 'none' ? '뭉친 데도 팔도 없음' : '팽대부 없이 팔 조각만 (마젤란형)'; }
        else if (arms === 'none') { const q = bulge === 'big' ? 0.7 : 0.3; const n = Math.round(10 * (1 - q)); cls = 'e'; code = `E${n}`; sub = `납작한 정도 ${n} (1 − 짧은축/긴축 = ${(1 - q).toFixed(1)})`; }
        else { const letter = bulge === 'big' ? (arms === 'tight' ? 'a' : 'b') : (arms === 'tight' ? 'b' : 'c'); cls = bar === 'yes' ? 'sb' : 's'; code = `${bar === 'yes' ? 'SB' : 'S'}${letter}`; sub = `팽대부 ${bulge === 'big' ? '큼' : '작음'} · 팔 ${arms === 'tight' ? '촘촘' : '느슨'} → ${letter}`; }
        return { kind: 'classify', arms, bulge, bar, cls, code, sub, verdict: cls };
    }
    function redshiftModel() {
        const o=OBJECTS[state.object],z=o.z,track=LINES[o.kind].find(l=>l[2]);
        return {kind:'redshift',o,z,track,lines:LINES[o.kind],verdict:z<0.03?'slow':z<0.3?'mid':'fast'};
    }
    function hubbleModel() {
        const sm = SAMPLES[state.sample], f = SCALES[state.scale].f;
        const pts = sm.list.map(([name, d, v]) => ({ name, d: d * f, v, d0: d }));
        const fit = list => { let sdv = 0, sdd = 0; list.forEach(p => { sdv += p.d * p.v; sdd += p.d * p.d; }); return sdd ? sdv / sdd : 0; };
        const H = fit(pts), age = AGE_K / H;
        return { kind: 'hubble', sm, f, pts, fit, H, age, verdict: H < 60 ? 'low' : H <= 80 ? 'ok' : 'high' };
    }
    function analyse() {
        if (state.mode === 'classify') return classifyModel();
        if (state.mode === 'redshift') return redshiftModel();
        return hubbleModel();
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
        if (state.mode === 'classify') controlArea.innerHTML = pickRow('나선팔', 'arms', opts(ARMS), state.arms, 3) + pickRow('팽대부 (가운데 뭉침)', 'bulge', opts(BULGES), state.bulge, 3) + (state.arms === 'none' ? '' : pickRow('막대', 'bar', opts(BARS), state.bar, 2));
        else if (state.mode === 'redshift') controlArea.innerHTML = pickRow('관측할 천체', 'object', opts(OBJECTS), state.object, 5);
        else controlArea.innerHTML = pickRow('은하 표본', 'sample', opts(SAMPLES), state.sample, 2) + pickRow('거리 눈금', 'scale', opts(SCALES), state.scale, 2);
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                if (group.dataset.pick === 'arms') buildControls();
                else group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                buildPrediction();
                settingsChanged();
            }));
        });
    }

    const PRED_C = [{ value: 'e', label: '타원 은하 (E)' }, { value: 's', label: '정상 나선 은하 (S)' }, { value: 'sb', label: '막대 나선 은하 (SB)' }, { value: 'irr', label: '불규칙 은하 (Irr)' }];
    const PRED_Z = [{value:'slow',label:'z < 0.03'},{value:'mid',label:'0.03 ≤ z < 0.3'},{value:'fast',label:'z ≥ 0.3'}];
    const PRED_H = [{ value: 'ok', label: '60~80 (모형 비교값 근처)' }, { value: 'low', label: '60보다 작음' }, { value: 'high', label: '80보다 큼' }];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list = state.mode === 'classify' ? PRED_C : state.mode === 'redshift' ? PRED_Z : PRED_H;
        predictionLegend.textContent = state.mode === 'classify' ? `나선팔 ${ARMS[state.arms].label} · 팽대부 ${BULGES[state.bulge].label}${state.arms === 'none' ? '' : ` · 막대 ${BARS[state.bar].label}`} — 이 은하는 어디에 들까요?`
            : state.mode === 'redshift' ? `${OBJECTS[state.object].name}의 적색편이 z 범위는?`
                : `${SAMPLES[state.sample].label}를 ${SCALES[state.scale].label}으로 재면 기울기 H₀(km/s/Mpc)는?`;
        predictionArea.className = `prediction-buttons ${list.length === 4 ? 'four' : 'three'}`;
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

    function renderClassify(a) {
        const p = state.progress, CX = 126, CY = 112, R = 82, rot = -p * 70 * Math.PI / 180, fade = clamp(0.25 + p, 0, 1);
        let out = `<rect class="sky" x="18" y="24" width="216" height="176" rx="10" fill="#040814" stroke="rgba(148, 163, 184, 0.35)"/>`;
        const dot = (x, y, r, cls, op) => `<circle class="${cls}" opacity="${op.toFixed(2)}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}"/>`;
        const turn = (x, y) => [CX + x * Math.cos(rot) - y * Math.sin(rot), CY + x * Math.sin(rot) + y * Math.cos(rot)];
        if (a.cls === 'e') {
            const q = a.bulge === 'big' ? 0.7 : 0.3;
            for (let i = 6; i >= 0; i -= 1) { const rx = R * (1 - i / 8); out += `<ellipse fill="#f3c98b" opacity="${(0.14 * fade).toFixed(2)}" cx="${CX}" cy="${CY}" rx="${rx.toFixed(1)}" ry="${(rx * q).toFixed(1)}"/>`; }
            for (let i = 0; i < 90; i += 1) { const u = rnd(i) ** 1.6, ang = rnd(i + 200) * 2 * Math.PI; out += dot(CX + R * u * Math.cos(ang), CY + R * q * u * Math.sin(ang), 1.1, 'old-star', fade * 0.9); }
        } else if (a.cls === 'irr') {
            for (let i = 0; i < 110; i += 1) {
                const u = rnd(i), ang = rnd(i + 300) * 2 * Math.PI, wob = 0.55 + 0.45 * Math.sin(3 * ang + 1) * Math.sin(2 * ang);
                let x = R * 0.9 * u * wob * Math.cos(ang), y = R * 0.7 * u * wob * Math.sin(ang);
                if (a.bar === 'yes' && i % 3 === 0) { x = (rnd(i + 500) - 0.5) * 90; y = (rnd(i + 700) - 0.5) * 14; }
                if (a.arms !== 'none' && i % 4 === 0) { const t = rnd(i + 900) * 2.2; x = 30 * Math.cos(t + 1) + 25 * t * Math.cos(t); y = 14 * Math.sin(t + 1) + 18 * t * Math.sin(t) - 20; }
                const [px, py] = turn(x, y);
                out += dot(px, py, i % 5 === 0 ? 2.2 : 1.3, i % 5 === 0 ? 'hii' : i % 3 === 1 ? 'old-star' : 'young-star', fade);
            }
        } else {
            out += `<circle class="disk" cx="${CX}" cy="${CY}" r="${R}"/>`;
            const rb = a.bulge === 'big' ? 22 : 9, pitch = (a.arms === 'tight' ? 12 : 28) * Math.PI / 180, k = Math.tan(pitch), r0 = a.bar === 'yes' ? 38 : rb;
            if (a.bar === 'yes') { const [bx, by] = turn(0, 0); out += `<ellipse class="bar" transform="rotate(${(rot * 180 / Math.PI).toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)})" cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" rx="40" ry="8"/>`; }
            [0, Math.PI].forEach((phi, armIdx) => {
                let th = 0;
                for (let step = 0; step < 400; step += 1) {
                    const r = r0 * Math.exp(k * th); if (r > R) break;
                    const spread = 3 + 5 * (r / R);
                    for (let j = 0; j < 2; j += 1) {
                        const i = armIdx * 900 + step * 2 + j;
                        const x = r * Math.cos(th + phi) + (rnd(i) - 0.5) * spread * 2, y = r * Math.sin(th + phi) + (rnd(i + 50) - 0.5) * spread * 2;
                        const [px, py] = turn(x, y);
                        out += dot(px, py, i % 9 === 0 ? 2.3 : 1.4, i % 9 === 0 ? 'hii' : 'young-star', fade);
                    }
                    th += 2.6 / r;
                }
            });
            for (let i = 0; i < 40; i += 1) { const u = rnd(i + 1000), ang = rnd(i + 1200) * 2 * Math.PI, [px, py] = turn(R * u * Math.cos(ang), R * u * Math.sin(ang)); out += dot(px, py, 0.9, 'old-star', fade * 0.5); }
            for (let i = 5; i >= 0; i -= 1) out += `<circle class="bulge" opacity="${(0.18 * fade).toFixed(2)}" cx="${CX}" cy="${CY}" r="${(rb * (1 - i / 7)).toFixed(1)}"/>`;
        }
        const RX = 244;
        out += `<text class="small-label" x="${RX}" y="190">노랑 늙은 별 · 파랑 젊은 별 · 분홍 별 탄생 구름</text>`;
        out += `<text class="trait-text" x="${RX}" y="52">나선팔: ${ARMS[a.arms].label}</text><text class="trait-text" x="${RX}" y="70">팽대부: ${BULGES[a.bulge].label}</text><text class="trait-text" x="${RX}" y="88">막대: ${a.arms === 'none' ? '(팔이 없으면 따지지 않음)' : BARS[a.bar].label}</text>`;
        const NAMES = { e: '타원 은하', s: '정상 나선 은하', sb: '막대 나선 은하', irr: '불규칙 은하' };
        out += `<text class="gen-text" style="fill:#0f172a" x="${RX}" y="114">${p >= 1 ? `${a.code} — ${NAMES[a.cls]}` : '분류 기호: ?'}</text>`;
        out += `<text class="small-label" x="${RX}" y="132">${p >= 1 ? a.sub : '만들어 보면 소리굽쇠의 자리가 나옵니다'}</text>`;
        out += `<text class="small-label" x="${RX}" y="156">${a.cls === 'e' ? '붉고 늙은 별 위주 · 가스 거의 없음' : a.cls === 'irr' ? '가스 많음 · 젊은 별이 여기저기 태어남' : '팽대부는 늙은 별 · 팔에서 젊은 별 탄생'}</text>`;
        out += `<text class="small-label" x="${RX}" y="172">${a.cls === 'e' ? '새 별이 거의 안 태어남' : a.cls === 'irr' ? '작은 은하가 많고 모양이 흐트러짐' : '원반이 돌며 팔이 감김'}</text>`;
        out += `<text class="verdict-text" fill="#0f172a" x="20" y="16">${p >= 1 ? `${NAMES[a.cls]} (${a.code})` : '고른 특징으로 은하를 그리는 중'}</text>`;
        out += `<text class="note-text" x="20" y="208">소리굽쇠 표는 생김새의 정리이지 진화 순서가 아닙니다. 팔 사이 각(피치각)은 실제 은하의 값 범위</text>`;
        return out;
    }

    function graphClassify(a) {
        const cells = [['E0', 52, 98], ['E3', 104, 98], ['E7', 156, 98], ['S0', 214, 98], ['Sa', 282, 58], ['Sb', 340, 58], ['Sc', 398, 58], ['SBa', 282, 138], ['SBb', 340, 138], ['SBc', 398, 138], ['Irr', 428, 98]];
        let out = `<text class="axis-title" x="20" y="18">허블의 소리굽쇠 분류표 — 노란 테가 이 은하의 자리</text>`;
        out += `<path class="fork-line" d="M52,98 L214,98 M214,98 L282,58 L398,58 M214,98 L282,138 L398,138"/>`;
        const on = state.progress >= 1 ? (a.cls === 'irr' ? 'Irr' : a.code) : null;
        cells.forEach(([code, x, y]) => {
            const isOn = code === on, sb = code.startsWith('SB'), sp = /^S[abc]/.test(code), e = code.startsWith('E');
            out += `<circle class="fork-cell${isOn ? ' on' : ''}" cx="${x}" cy="${y}" r="14"/>`;
            if (e) { const q = 1 - Number(code[1]) / 10; out += `<ellipse fill="#f3c98b" opacity=".8" cx="${x}" cy="${y}" rx="8" ry="${(8 * q).toFixed(1)}"/>`; }
            else if (code === 'S0') out += `<ellipse fill="#f3c98b" opacity=".8" cx="${x}" cy="${y}" rx="9" ry="3.5"/><circle fill="#f5d58a" cx="${x}" cy="${y}" r="3.5"/>`;
            else if (sp || sb) { const rb = { a: 4.5, b: 3, c: 1.8 }[code.slice(-1)], k = Math.tan(({ a: 12, b: 20, c: 28 }[code.slice(-1)]) * Math.PI / 180); if (sb) out += `<rect class="bar" x="${x - 6}" y="${y - 1.2}" width="12" height="2.4"/>`; [0, Math.PI].forEach(phi => { let d = ''; for (let th = 0; ; th += 0.15) { const r = (sb ? 6 : rb) * Math.exp(k * th); if (r > 10) break; d += `${d ? 'L' : 'M'}${(x + r * Math.cos(th + phi)).toFixed(1)},${(y + r * Math.sin(th + phi)).toFixed(1)} `; } out += `<path fill="none" stroke="#8ec5ff" stroke-width="1.4" d="${d}"/>`; }); out += `<circle fill="#f5d58a" cx="${x}" cy="${y}" r="${rb}"/>`; }
            else { for (let i = 0; i < 12; i += 1) out += `<circle fill="${i % 3 ? '#8ec5ff' : '#ff9fd0'}" cx="${(x + (rnd(i + 20) - 0.5) * 16).toFixed(1)}" cy="${(y + (rnd(i + 40) - 0.5) * 14).toFixed(1)}" r="1.4"/>`; }
            out += `<text class="fork-text" x="${x}" y="${y + 26}" text-anchor="middle">${code}</text>`;
        });
        out += `<text class="small-label" x="20" y="176">E 타원 · S0 렌즈형(원반은 있고 팔은 없음) · S 정상 나선 · SB 막대 나선 · Irr 불규칙</text>`;
        out += `<text class="small-label" x="20" y="190">왼쪽일수록 붉고 늙은 별에 가스 적음, 오른쪽일수록 푸른 젊은 별에 가스 많음</text>`;
        return out;
    }

    function renderRedshift(a) {
        const p = state.progress, { o, z } = a, SX0 = 40, SX1 = 440, L0 = 300, L1 = 1000, xOf = nm => SX0 + (nm - L0) / (L1 - L0) * (SX1 - SX0);
        const zNow = z * ease(p), YL = 72, YO = 132;
        let out = `<defs><linearGradient id="vis" x1="0" x2="1"><stop offset="0" stop-color="#7c3aed"/><stop offset=".14" stop-color="#3b82f6"/><stop offset=".33" stop-color="#22c55e"/><stop offset=".5" stop-color="#facc15"/><stop offset=".68" stop-color="#f97316"/><stop offset="1" stop-color="#b91c1c"/></linearGradient></defs>`;
        [YL, YO].forEach(y => {
            out += `<rect fill="#111a22" x="${SX0}" y="${y - 12}" width="${SX1 - SX0}" height="24"/>`;
            out += `<rect fill="url(#vis)" opacity=".55" x="${xOf(380).toFixed(1)}" y="${y - 12}" width="${(xOf(750) - xOf(380)).toFixed(1)}" height="24"/>`;
            out += `<rect class="strip-frame" x="${SX0}" y="${y - 12}" width="${SX1 - SX0}" height="24"/>`;
        });
        out += `<text class="small-label" x="${SX0}" y="${YL - 17}">위: 실험실에서 잰 파장 (${o.kind === 'quasar' ? '방출선' : '흡수선'}) · 아래: ${o.name}에서 온 빛</text>`;
        out += `<text class="small-label" x="${xOf(340).toFixed(1)}" y="${YL + 4}" text-anchor="middle" style="fill:#475569">자외선</text><text class="small-label" x="${xOf(880).toFixed(1)}" y="${YL + 4}" text-anchor="middle" style="fill:#475569">적외선</text>`;
        [400, 500, 600, 700, 800, 900].forEach(nm => { out += `<text class="axis-text" x="${xOf(nm).toFixed(1)}" y="${(YL + YO) / 2 + 3.5}" text-anchor="middle">${nm}</text>`; });
        out += `<text class="axis-text" x="${SX1}" y="${(YL + YO) / 2 + 3.5}" text-anchor="end">nm</text>`;
        a.lines.forEach(([name, lam, tracked]) => {
            const x0 = xOf(lam), lamObs = lam * (1 + zNow), x1 = xOf(lamObs);
            out += `<line class="${tracked ? 'line-track' : 'line-lab'}" x1="${x0.toFixed(1)}" y1="${YL - 12}" x2="${x0.toFixed(1)}" y2="${YL + 12}"/>`;
            if (name !== 'Ca H') out += `<text class="small-label" x="${x0.toFixed(1)}" y="${YL - 30}" text-anchor="middle">${name}</text>`;
            if (lamObs <= L1) out += `<line class="${tracked ? 'line-track' : 'line-obs'}" x1="${x1.toFixed(1)}" y1="${YO - 12}" x2="${x1.toFixed(1)}" y2="${YO + 12}"/>`;
            if (tracked) {
                if (x1 - x0 > 14) out += arrow(x0, (YL + YO) / 2 + 14, x1, (YL + YO) / 2 + 14, 'shift-arrow', 'shift-head', 3);
                out += `<text class="small-label" style="fill:#d97706" x="${Math.min(x1, SX1 - 4).toFixed(1)}" y="${YO + 25}" text-anchor="end">${name} ${fmtN(lamObs, 1)}</text>`;
            }
        });
        const [tn,tl]=a.track,lamObs=tl*(1+zNow),dl=lamObs-tl;
        out += '<text class="trait-text" x="20" y="176">'+tn+' '+tl+' nm → '+fmtN(lamObs,1)+' nm</text>';
        out += '<text class="trait-text" x="20" y="194">z = Δλ/λ₀ = '+fmtN(zNow,4)+'</text>';
        out += '<text class="note-text" x="20" y="210">큰 적색편이를 단순한 속도 공식으로 환산하지 않습니다.</text>';
        return out;
    }

    function graphRedshift(a) {
        let out='<text class="axis-title" x="30" y="25">같은 스펙트럼 선의 관측 파장 비교</text>';
        for(const [i,o]of Object.values(OBJECTS).entries()){
            const y=50+i*26,w=90*(1+o.z);out+='<rect x="130" y="'+y+'" width="'+w+'" height="14" fill="'+(o===a.o?'#d97706':'#b6c4d0')+'"/><text class="small-label" x="20" y="'+(y+11)+'">'+o.label+'</text><text class="small-label" x="'+(140+w)+'" y="'+(y+11)+'">λ₀의 '+(1+o.z).toFixed(3)+'배</text>';
        }return out;
    }

    function renderHubble(a) {
        const p = state.progress, N = a.pts.length, shown = Math.min(N, Math.floor(p * N + 1e-9) + (p >= 1 ? 0 : 0));
        const AX0 = 66, AX1 = 428, AY = 128, maxD = Math.max(...a.pts.map(q => q.d)) * 1.08, xOf = d => AX0 + d / maxD * (AX1 - AX0);
        const vMax = Math.max(...a.pts.map(q => Math.abs(q.v))), vScale = 70 / vMax;
        let out = `<line class="axis" x1="${AX0}" y1="${AY}" x2="${AX1}" y2="${AY}"/>`;
        const step = maxD > 50 ? 25 : maxD > 12 ? 5 : maxD > 8 ? 2 : maxD > 4 ? 1 : 0.5;
        for (let d = 0; d <= maxD + 1e-9; d += step) out += `<line class="grid-line" x1="${xOf(d).toFixed(1)}" y1="${AY - 4}" x2="${xOf(d).toFixed(1)}" y2="${AY + 4}"/><text class="axis-text" x="${xOf(d).toFixed(1)}" y="${AY + 16}" text-anchor="middle">${d}</text>`;
        out += `<text class="axis-text" x="${AX1 + 5}" y="${AY + 16}">Mpc</text>`;
        out += `<circle class="home" cx="${AX0}" cy="${AY}" r="5"/><text class="small-label" x="${AX0}" y="${AY + 34}" text-anchor="middle">우리 은하</text>`;
        const order = a.pts.map((q, i) => i).sort((i, j) => a.pts[i].d - a.pts[j].d);
        const rows = [[], [], [], []], est = t => [...t].reduce((w, ch) => w + (/[가-힣]/.test(ch) ? 9.5 : 5.6), 0);
        order.forEach(idx => {
            if (idx >= shown) return;
            const q = a.pts[idx], x = xOf(q.d), len = q.v * vScale, label = `${q.name} ${q.v >= 0 ? '+' : '−'}${fmtN(Math.abs(q.v))}`;
            const w = est(label), endAnchor = x > 300, x0 = endAnchor ? x - 7 - w : x + 7, x1 = x0 + w;
            let row = rows.findIndex(list => list.every(([l, r]) => x1 < l - 6 || x0 > r + 6)); if (row < 0) row = 3;
            rows[row].push([x0, x1]);
            const yArrow = AY - 26 - row * 20, yText = yArrow - 10;
            out += `<line class="grid-line" x1="${x.toFixed(1)}" y1="${AY}" x2="${x.toFixed(1)}" y2="${yArrow.toFixed(1)}"/><circle class="gal-dot" cx="${x.toFixed(1)}" cy="${yArrow.toFixed(1)}" r="4"/>`;
            out += arrow(x, yArrow, clamp(x + len, 10, 450), yArrow, len >= 0 ? 'away' : 'toward', len >= 0 ? 'away-head' : 'toward-head', 3);
            out += `<text class="small-label" x="${(endAnchor ? x - 7 : x + 7).toFixed(1)}" y="${yText.toFixed(1)}" text-anchor="${endAnchor ? 'end' : 'start'}">${label}</text>`;
        });
        out += `<text class="small-label" x="20" y="173">붉은 화살 멀어짐 · 파란 화살 다가옴 (km/s, 길이 ∝ 속도) · 거리는 ${SCALES[state.scale].label}</text>`;
        const cur = a.fit(a.pts.slice(0, shown));
        out += `<text class="trait-text" x="20" y="186">${shown >= 2 ? `지금까지 ${shown}개로 맞춘 기울기 H₀ = ${fmtN(cur)} km/s/Mpc → 1/H₀ = ${fmtN(AGE_K / cur * 10, 0)}억 년` : '은하를 하나씩 재는 중…'}</text>`;
        const VERD = { ok: '모형 비교값 근처', low: '60보다 작음', high: '80보다 큼' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${p >= 1 ? `H₀ = ${fmtN(a.H)} km/s/Mpc (${VERD[a.verdict]}) → 우주 나이 어림 ${fmtN(a.age * 10, 0)}억 년` : `${a.sm.label} · ${SCALES[state.scale].label}`}</text>`;
        out += `<text class="note-text" x="20" y="208">1 Mpc = 326만 광년 · 속도는 실제 관측값 · 나이 어림 1/H₀ = 9,778억 년 ÷ H₀ (팽창 빠르기가 늘 같았다면)</text>`;
        return out;
    }

    function graphHubble(a) {
        const p = state.progress, N = a.pts.length, shown = Math.min(N, Math.floor(p * N + 1e-9));
        const X0 = 66, X1 = 420, Y0 = 150, Y1 = 40, maxD = Math.max(...a.pts.map(q => q.d)) * 1.1, vMax = Math.max(...a.pts.map(q => q.v)) * 1.15, vMin = Math.min(0, ...a.pts.map(q => q.v)) * 1.3;
        const xOf = d => X0 + d / maxD * (X1 - X0), yOf = v => Y0 - (v - vMin) / (vMax - vMin) * (Y0 - Y1);
        let out = `<text class="axis-title" x="${X0}" y="18">거리–후퇴 속도 그림 — 노란 점선이 원점을 지나게 맞춘 기울기 H₀</text>`;
        const dStep = maxD > 50 ? 25 : maxD > 12 ? 5 : maxD > 8 ? 2 : maxD > 4 ? 1 : 0.5, dTicks = [];
        for (let d = 0; d <= maxD + 1e-9; d += dStep) dTicks.push(+d.toFixed(2));
        dTicks.forEach(d => { out += `<line class="grid-line" x1="${xOf(d).toFixed(1)}" y1="${Y1}" x2="${xOf(d).toFixed(1)}" y2="${Y0}"/><text class="axis-text" x="${xOf(d).toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${d}</text>`; });
        const vStep = vMax > 4000 ? 2000 : vMax > 1000 ? 500 : 200;
        for (let v = Math.ceil(vMin / vStep) * vStep; v <= vMax; v += vStep) out += `<line class="grid-line" x1="${X0}" y1="${yOf(v).toFixed(1)}" x2="${X1}" y2="${yOf(v).toFixed(1)}"/><text class="axis-text" x="${X0 - 5}" y="${(yOf(v) + 3.5).toFixed(1)}" text-anchor="end">${v >= 0 ? '' : '−'}${fmtN(Math.abs(v))}</text>`;
        out += `<line class="axis" x1="${X0}" y1="${yOf(0).toFixed(1)}" x2="${X1}" y2="${yOf(0).toFixed(1)}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        out += `<line class="true-line" x1="${X0}" y1="${yOf(0).toFixed(1)}" x2="${xOf(Math.min(maxD, vMax / 70)).toFixed(1)}" y2="${yOf(Math.min(maxD, vMax / 70) * 70).toFixed(1)}"/>`;
        if (shown >= 2) { const H = a.fit(a.pts.slice(0, shown)), dEnd = Math.min(maxD, vMax / H); out += `<line class="fit-line" x1="${X0}" y1="${yOf(0).toFixed(1)}" x2="${xOf(dEnd).toFixed(1)}" y2="${yOf(dEnd * H).toFixed(1)}"/>`; }
        a.pts.forEach((q, i) => { if (i < shown) out += `<circle class="gal-dot" cx="${xOf(q.d).toFixed(1)}" cy="${yOf(q.v).toFixed(1)}" r="4"/>`; });
        out += `<text class="small-label" x="${X1}" y="${Y1 + 12}" text-anchor="end">회색 점선: H₀ = 70일 때</text>`;
        out += `<text class="axis-title" x="${(X0 + X1) / 2}" y="${Y0 + 30}" text-anchor="middle">거리 (Mpc) · 세로는 후퇴 속도 (km/s) — 기울기 = 거리 1 Mpc마다 늘어나는 속도</text>`;
        return out;
    }

    function noteFor(a) {
        if (a.kind === 'classify') {
            const NAMES = { e: '타원 은하', s: '정상 나선 은하', sb: '막대 나선 은하', irr: '불규칙 은하' };
            return `<div class="data-row"><span class="data-name">특징</span><span class="data-val">나선팔 ${ARMS[a.arms].label} · 팽대부 ${BULGES[a.bulge].label}${a.arms === 'none' ? '' : ` · 막대 ${BARS[a.bar].label}`}</span></div>` +
                `<div class="data-row"><span class="data-name">분류 기호</span><span class="data-val">${a.code} — ${a.sub}</span></div>` +
                `<div class="data-row"><span class="data-name">별과 가스</span><span class="data-val">${a.cls === 'e' ? '붉고 늙은 별, 가스·먼지 거의 없음, 새 별 거의 안 태어남' : a.cls === 'irr' ? '가스 많고 젊은 별이 여기저기서 태어남, 뚜렷한 대칭 없음' : '팽대부는 붉고 늙은 별, 나선팔은 가스와 푸른 젊은 별'}</span></div>` +
                `<div class="data-row match"><span class="data-name">판정</span><span class="data-val">${NAMES[a.cls]}</span></div>`;
        }
        if (a.kind === 'redshift') {
            const [tn,tl]=a.track;
            return '<p>'+a.o.name+': '+tn+' '+tl+' nm → '+fmtN(tl*(1+a.z),1)+' nm, z = '+a.z+'</p><p>스펙트럼 이동을 비교합니다. 우주론적 적색편이를 특수상대론 도플러 속도로 단순 변환하지 않습니다.</p>';
        }
        return `<div class="data-row"><span class="data-name">표본</span><span class="data-val">${a.pts.map(q => `${(q.name.match(/M\d+/) || [q.name.split(' ')[0]])[0]} ${fmtN(q.d, q.d < 10 ? 2 : q.d < 20 ? 1 : 0)} Mpc·${q.v >= 0 ? '+' : '−'}${fmtN(Math.abs(q.v))}`).join(' / ')}</span></div>` +
            `<div class="data-row"><span class="data-name">맞춘 기울기</span><span class="data-val">Σ(거리 × 속도) ÷ Σ(거리²) = ${fmtN(a.H, 1)} km/s/Mpc ${a.f < 1 ? '(거리를 7분의 1로 잰 눈금)' : ''}</span></div>` +
            `<div class="data-row"><span class="data-name">우주 나이</span><span class="data-val">1/H₀ = 9,778억 년 ÷ ${fmtN(a.H, 1)} = ${fmtN(a.age * 10, 0)}억 년 ${a.age < 4.6 ? '— 지구(46억 년)보다 젊음, 모순' : ''}</span></div>` +
            `<div class="data-row match"><span class="data-name">판정</span><span class="data-val">${{ ok: '60~80, 모형 비교값 근처', low: '60보다 작음', high: '80보다 큼' }[a.verdict]}</span></div>`;
    }

    function render() {
        const a = analyse();
        mainGroup.innerHTML = a.kind === 'classify' ? renderClassify(a) : a.kind === 'redshift' ? renderRedshift(a) : renderHubble(a);
        graphGroup.innerHTML = a.kind === 'classify' ? graphClassify(a) : a.kind === 'redshift' ? graphRedshift(a) : graphHubble(a);
        liftProse();
        stageBadge.textContent = a.kind === 'classify' ? `팔 ${ARMS[a.arms].label} · 팽대부 ${BULGES[a.bulge].label}` : a.kind === 'redshift' ? a.o.name : `${a.sm.label} · ${SCALES[state.scale].label}`;
        methodHint.textContent = a.kind === 'classify' ? '팽대부와 나선팔, 막대의 유무로 은하의 자리가 정해집니다'
            : a.kind === 'redshift' ? '멀어지는 천체의 스펙트럼 선은 파장이 길어져 붉은 쪽으로 밀립니다'
                : '멀수록 빨리 멀어집니다. 기울기가 H₀, 그 역수가 우주 나이의 어림값';
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
        if (a.kind === 'classify') {
            const NAMES = { e: '타원 은하', s: '정상 나선 은하', sb: '막대 나선 은하', irr: '불규칙 은하' };
            labelA.textContent = '분류'; valueA.textContent = `${NAMES[a.cls]} ${a.code}`;
            labelB.textContent = '결정한 특징'; valueB.textContent = a.cls === 'irr' ? '팽대부 없음' : a.cls === 'e' ? '팔 없음' : `팔 ${ARMS[a.arms].label}${a.cls === 'sb' ? '·막대' : ''}`;
            if (a.cls === 'e') s = `나선팔이 없고 가운데가 매끈하게 뭉쳐 있으니 타원 은하입니다. 납작한 정도로 번호를 붙여 ${a.code}이고, 둥글면 E0, 가장 납작하면 E7입니다. 타원 은하는 가스와 먼지가 거의 없어 새 별이 태어나지 않고, 오래전 태어난 붉고 늙은 별만 남아 전체가 붉게 보입니다. 은하단 한가운데의 거대 타원 은하부터 작은 왜소 타원 은하까지 크기는 천차만별입니다.`;
            else if (a.cls === 'irr') s = `한가운데 뭉친 팽대부가 없고 ${a.arms === 'none' ? '팔도 없이' : '팔 조각만 흩어져'} 뚜렷한 대칭이 없으니 불규칙 은하입니다. 대체로 작은 은하이고 가스가 많아 여기저기서 푸른 젊은 별이 태어나며, 남반구에서 맨눈에 보이는 대·소마젤란은하가 그 예입니다. 이웃 은하의 중력에 흐트러진 경우도 많습니다.`;
            else s = `원반과 나선팔이 있고 가운데 팽대부가 ${a.bulge === 'big' ? '크며' : '작으며'} ${a.cls === 'sb' ? '팽대부를 가로지르는 막대가 있으니 막대 나선 은하' : '막대가 없으니 정상 나선 은하'}입니다. 팽대부가 ${a.bulge === 'big' ? '크고' : '작고'} 팔이 ${a.arms === 'tight' ? '촘촘히' : '느슨하게'} 감겨 ${a.code}이고, a에서 c로 갈수록 팽대부가 작아지고 팔이 풀립니다. 팽대부는 붉고 늙은 별, 팔은 가스와 먼지가 많아 푸른 젊은 별이 계속 태어나는 곳입니다. ${a.cls === 'sb' ? '우리 은하도 막대 나선 은하(SBbc쯤)입니다.' : '안드로메다은하가 정상 나선 은하(Sb)의 예입니다.'}`;
        } else if (a.kind === 'redshift') {
            const [tn,tl]=a.track;labelA.textContent='적색편이';valueA.textContent='z = '+a.z;
            labelB.textContent='파장 비';valueB.textContent=(1+a.z).toFixed(3)+'배';
            s=tn+'의 실험실 파장 '+tl+' nm와 관측 파장 '+fmtN(tl*(1+a.z),1)+' nm를 비교합니다. 우주의 팽창은 빛의 파장을 늘립니다. 큰 적색편이에서 속도나 거리를 구하려면 우주론 모형을 고려해야 합니다.';
        } else {
            labelA.textContent = '기울기 H₀'; valueA.textContent = `${fmtN(a.H)} km/s/Mpc`;
            labelB.textContent = '우주 나이 어림'; valueB.textContent = `${fmtN(a.age * 10, 0)}억 년`;
            s = `${a.sm.label}의 거리와 속도를 찍고 원점을 지나는 직선을 맞추면 기울기 H₀ = ${fmtN(a.H)} km/s/Mpc입니다. 거리를 속도로 나눈 1/H₀ = ${fmtN(a.age * 10, 0)}억 년이 팽창이 시작된 뒤 흐른 시간의 어림값입니다. `;
            if (a.f < 1) s += `허블은 1929년에 세페이드 변광성의 밝기 눈금이 틀린 탓에 거리를 실제의 7분의 1로 재어 기울기 500 안팎을 얻었습니다. 그러면 우주 나이가 ${fmtN(a.age * 10, 0)}억 년으로 지구(46억 년)보다 젊다는 모순이 생깁니다. 이 모순은 1950년대에 세페이드에 두 종류가 있음을 알고 눈금을 바로잡으며 풀렸습니다. 값은 틀렸어도 "멀수록 빨리 멀어진다"는 법칙은 옳았습니다.`;
            else if (a.verdict === 'low') s += `가까운 은하들은 서로 중력으로 끌어당겨 제멋대로 움직이는 고유 운동이 초속 수백 km인데, 이 거리에서 팽창 속도는 그보다 작습니다. 안드로메다은하는 아예 초속 300 km로 다가옵니다. 그래서 기울기가 낮고 들쭉날쭉하며, 이런 표본으로는 허블 상수를 믿을 수 없습니다. 수천만 광년 넘는 먼 은하단까지 써야 팽창이 고유 운동을 압도합니다.`;
            else s += `먼 은하단은 팽창 속도가 초속 수천 km라 고유 운동을 압도하므로 점들이 직선에 가깝게 늘어서고, 기울기는 이 모형의 비교 구간 67~73 km/s/Mpc 안에 듭니다. 1/H₀ = ${fmtN(a.age * 10, 0)}억 년은 팽창 빠르기가 늘 같았다고 본 어림이고, 감속과 가속을 넣어 계산한 우주의 나이는 138억 년입니다.`;
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
        checkBtn.textContent = state.mode === 'classify' ? '은하 만들기' : state.mode === 'redshift' ? '스펙트럼 찍기' : '은하 재기';
        stageCaption.textContent = state.mode === 'classify' ? '왼쪽은 고른 특징으로 그린 은하이고, 아래는 허블의 소리굽쇠 분류표입니다. 노란 별은 늙은 별, 파란 별은 젊은 별, 분홍은 별이 태어나는 가스 구름입니다.'
            : state.mode === 'redshift' ? '위 띠는 실험실에서 잰 선의 자리, 아래 띠는 천체에서 온 빛의 선입니다. 노란 선이 밀린 만큼이 적색 이동입니다.'
                : '위는 우리 은하에서 본 은하들의 거리와 속도 화살, 아래는 거리–속도 그림입니다. 원점을 지나는 직선의 기울기가 허블 상수입니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { arms: 'tight', bulge: 'big', bar: 'no', object: 'virgo', sample: 'far', scale: 'today', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'classify').click();
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

    window.__galaxyModel = {
        ARMS, BULGES, BARS, OBJECTS, SAMPLES, SCALES, state,
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
