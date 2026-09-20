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
    const SSTS = { c25: { label: '25 ℃', hint: '서늘한 바다', sst: 25 }, c27: { label: '27 ℃', hint: '여름 북서태평양', sst: 27 }, c30: { label: '30 ℃', hint: '매우 따뜻함', sst: 30 } };
    const LATS = { l0: { label: '적도 (0°)', hint: '전향력 없음', lat: 0 }, l15: { label: '북위 15°', hint: '필리핀 동쪽', lat: 15 }, l30: { label: '북위 30°', hint: '제주 남쪽', lat: 30 } };
    const SST_MIN = 26.5, LAT_MIN = 5, OMEGA = 7.292e-5;
    // grades by maximum wind (m/s), the Korea Meteorological Administration scale
    const GRADES = [[54, '초강력'], [44, '매우강'], [33, '강'], [25, '중'], [17, '열대 폭풍 (태풍 등급 아래)'], [0, '열대 저압부']];
    // the map: local coordinates inside a 280 × 178 box
    const LAND = {
        china: [[0, 0], [120, 0], [128, 44], [112, 74], [124, 112], [100, 148], [60, 178], [0, 178]],
        korea: [[142, 50], [164, 46], [176, 72], [170, 102], [156, 110], [148, 92], [140, 70]],
        japan: [[196, 104], [226, 86], [262, 60], [280, 48], [286, 58], [262, 84], [232, 112], [204, 124]],
        taiwan: [[118, 132], [128, 130], [130, 146], [120, 148]],
    };
    const HIGHS = {
        west: { label: '서쪽으로 크게 뻗음', when: '서쪽으로 크게 뻗었을 때', hint: '한반도까지 덮음', cx: 232, cy: 70, rx: 92, ry: 52, track: [[180, 174], [150, 146], [118, 120], [84, 92]], dest: 'china' },
        mid: { label: '보통', when: '보통 자리에 있을 때', hint: '8월 평균 자리', cx: 268, cy: 62, rx: 72, ry: 50, track: [[180, 174], [170, 136], [162, 100], [160, 70], [168, 36]], dest: 'korea' },
        east: { label: '동쪽으로 물러남', when: '동쪽으로 물러났을 때', hint: '가을로 갈 때', cx: 296, cy: 50, rx: 52, ry: 46, track: [[180, 174], [190, 140], [204, 110], [232, 90], [262, 64]], dest: 'japan' },
    };
    const SPEEDS = { s20: { label: '시속 20 km', hint: '느리게', kmh: 20 }, s40: { label: '시속 40 km', hint: '보통', kmh: 40 }, s60: { label: '시속 60 km', hint: '전향점 지난 뒤', kmh: 60 } };
    const V_ROT = 40, R_MAX = 50;
    const TRADES = { weak: { label: '약함', hint: '엘니뇨', k: -1 }, normal: { label: '보통', hint: '평소', k: 0 }, strong: { label: '강함', hint: '라니냐', k: 1 } };
    // 대략적인 편차: 동·서태평양 수온(℃), 동쪽·서쪽 온난층 두께(m), 페루·인도네시아 강수 지수(평소 = 1)
    const ENSO = { '-1': { east: 2.5, west: -1.0, thE: 150, thW: 100, up: 0.2, rainE: 3, rainW: 0.3, name: '엘니뇨' }, '0': { east: 0, west: 0, thE: 50, thW: 150, up: 1, rainE: 1, rainW: 1, name: '평소' }, '1': { east: -1.5, west: 0.7, thE: 30, thW: 170, up: 1.5, rainE: 0.3, rainW: 1.6, name: '라니냐' } };

    const state = { mode: 'genesis', sst: 'c27', lat: 'l15', high: 'mid', speed: 's40', trade: 'weak', progress: 0, prediction: null };
    let running = false, frameId = 0, lastStamp = 0;

    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const ease = p => p < 0.5 ? 2 * p * p : 1 - (1 - p) * (1 - p) * 2;
    const fmtN = (n, d = 0) => (+n.toFixed(d)).toLocaleString('ko-KR', { minimumFractionDigits: d, maximumFractionDigits: d }).replace('-', '−');
    const sgn = (n, d = 1) => (n > 0 ? '+' : '') + fmtN(n, d);
    const RAD = Math.PI / 180;
    const SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
    const sup = t => String(t).split('').map(ch => SUP[ch] || ch).join('');
    const fmtExp = (x, d = 1) => { if (x === 0) return '0'; const e = Math.floor(Math.log10(Math.abs(x))); return `${(x / 10 ** e).toFixed(d)}×10${sup(e)}`; };

    /* ------------------------------------------------------------ models */
    const esat = T => 6.11 * Math.exp(17.27 * T / (T + 237.3));   // hPa
    function analyse() {
        if (state.mode === 'genesis') {
            const sst = SSTS[state.sst].sst, lat = LATS[state.lat].lat;
            const heat = sst >= SST_MIN, cor = lat >= LAT_MIN, f = 2 * OMEGA * Math.sin(lat * RAD), es = esat(sst);
            const PI = heat ? 35 + 12 * (sst - SST_MIN) : 0, eff = lat <= 20 ? 0.8 : 0.65;
            const vmax = heat && cor ? PI * eff : 0;
            const kt = vmax * 1.944, p = vmax > 0 ? 1010 - Math.pow(kt / 6.7, 1 / 0.644) : 1008;
            const grade = GRADES.find(g => vmax >= g[0])[1];
            return { kind: 'genesis', sst, lat, heat, cor, f, es, PI, eff, vmax, p, grade, verdict: !(heat && cor) ? 'none' : vmax < 44 ? 'mid' : 'high' };
        }
        if (state.mode === 'track') {
            const h = HIGHS[state.high], kmh = SPEEDS[state.speed].kmh, vm = kmh / 3.6;
            return { kind: 'track', h, kmh, vm, right: V_ROT + vm, left: V_ROT - vm, verdict: h.dest };
        }
        const k = TRADES[state.trade].k, e = ENSO[String(k)];
        return { kind: 'enso', k, e, verdict: k < 0 ? 'elnino' : k > 0 ? 'lanina' : 'normal' };
    }
    const runSeconds = () => state.mode === 'genesis' ? 6 : state.mode === 'track' ? 7 : 5;

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
        if (state.mode === 'genesis') controlArea.innerHTML = pickRow('해수면 온도', 'sst', opts(SSTS), state.sst, 3) + pickRow('위도', 'lat', opts(LATS), state.lat, 3);
        else if (state.mode === 'track') controlArea.innerHTML = pickRow('북태평양 고기압', 'high', opts(HIGHS), state.high, 3) + pickRow('태풍의 이동 속도', 'speed', opts(SPEEDS), state.speed, 3);
        else controlArea.innerHTML = pickRow('무역풍의 세기', 'trade', opts(TRADES), state.trade, 3);
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                buildPrediction();
                settingsChanged();
            }));
        });
    }

    const PRED_G = [{ value: 'none', label: '태풍이 안 생김' }, { value: 'mid', label: '생김 — 중·강 (25~44 m/s)' }, { value: 'high', label: '생김 — 매우강·초강력 (44 m/s 넘게)' }];
    const PRED_T = [{ value: 'china', label: '중국 쪽으로 지나감' }, { value: 'korea', label: '한반도를 지나감' }, { value: 'japan', label: '일본 쪽으로 휘어감' }];
    const PRED_E = [{ value: 'elnino', label: '동태평양이 따뜻해짐 — 페루에 비, 인도네시아 가뭄' }, { value: 'normal', label: '평소와 같음' }, { value: 'lanina', label: '동태평양이 더 차가워짐 — 인도네시아 홍수, 페루 가뭄' }];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list = state.mode === 'genesis' ? PRED_G : state.mode === 'track' ? PRED_T : PRED_E;
        predictionLegend.textContent = state.mode === 'genesis' ? `해수면 ${SSTS[state.sst].label}, ${LATS[state.lat].label}의 바다에서는?`
            : state.mode === 'track' ? `북태평양 고기압이 ${HIGHS[state.high].when} 태풍은?`
                : `무역풍이 ${TRADES[state.trade].label.replace('함', '해지면').replace('보통', '보통이면')} 태평양은?`;
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
    // a counter-clockwise spiral of three arms
    function spiral(cx, cy, R, rot, cls = 'spiral', width = null) {
        let out = '';
        for (let k = 0; k < 3; k += 1) {
            let d = '';
            for (let r = R * 0.18; r <= R; r += 2) { const th = -(rot + k * 2.094 + r * 0.11); d += `${d ? 'L' : 'M'}${(cx + r * Math.cos(th)).toFixed(1)},${(cy + r * Math.sin(th) * 0.85).toFixed(1)} `; }
            out += `<path class="${cls}" ${width ? `style="stroke-width:${width}"` : ''} d="${d}"/>`;
        }
        return out + `<circle class="eye" cx="${cx}" cy="${cy}" r="${(R * 0.12).toFixed(1)}"/>`;
    }
    const cloud = (x, y, s, cls = 'cloud') => `<g class="${cls}"><circle cx="${x}" cy="${y}" r="${s}"/><circle cx="${x + s * 0.9}" cy="${y + s * 0.2}" r="${s * 0.8}"/><circle cx="${x - s * 0.9}" cy="${y + s * 0.25}" r="${s * 0.7}"/><circle cx="${x + s * 0.3}" cy="${y - s * 0.5}" r="${s * 0.7}"/></g>`;
    const seaColor = sst => sst >= 30 ? 'rgba(255,140,90,.35)' : sst >= 27 ? 'rgba(90,200,190,.35)' : 'rgba(60,130,220,.35)';

    function renderGenesis(a) {
        const p = state.progress, { sst, lat } = a;
        let out = `<rect class="sea" fill="${seaColor(sst)}" x="20" y="140" width="260" height="60" rx="6"/>`;
        for (let x = 30; x < 280; x += 24) out += `<path fill="none" stroke="rgba(148, 163, 184, 0.40)" stroke-width="1" d="M${x},${150 + (x % 48 ? 0 : 5)} q6,-4 12,0 q6,4 12,0"/>`;
        out += `<text class="small-label" x="26" y="196">바다 ${sst} ℃ · ${LATS[state.lat].label}</text>`;
        // vapour rising, more from a warmer sea
        const nV = Math.round(a.es / 6), rise = clamp(p / 0.35, 0, 1);
        for (let i = 0; i < nV; i += 1) { const x = 50 + i * (200 / Math.max(1, nV - 1)), y0 = 138, y1 = 138 - 26 * rise - ((i * 7) % 12); out += arrow(x, y0, x, y1, 'vapor', 'vapor-head', 2.5); }
        out += `<text class="small-label" style="fill:#0369a1" x="160" y="134" text-anchor="middle">수증기 ${a.es.toFixed(0)} hPa (${a.heat ? '넉넉함' : '모자람'})</text>`;
        const cx = 150, cy = 82;
        if (!a.heat) { for (let i = 0; i < 3; i += 1) out += cloud(90 + i * 70, 96 - (i % 2) * 8, 9, 'cloud-weak'); out += `<text class="trait-text" style="fill:#dc2626" x="${cx}" y="46" text-anchor="middle">수증기가 모자라 구름이 자라지 못함</text>`; }
        else if (!a.cor) { const g = clamp((p - 0.3) / 0.5, 0, 1); for (let i = 0; i < 5; i += 1) out += cloud(cx - 60 + i * 30, cy + 8 - (i % 2) * 12, 8 + 6 * g); out += `<text class="trait-text" style="fill:#dc2626" x="${cx}" y="42" text-anchor="middle">구름은 크게 자라지만 전향력이 0 — 소용돌이로 감기지 않음</text>`; }
        else { const g = clamp((p - 0.3) / 0.6, 0, 1), R = 14 + (a.vmax / 62) * 46 * g; if (g < 0.25) for (let i = 0; i < 4; i += 1) out += cloud(cx - 45 + i * 30, cy + 6, 8); out += spiral(cx, cy, R, p * 9, 'spiral', (2 + 3 * g).toFixed(1)); out += `<text class="trait-text" style="fill:#059669" x="${cx}" y="34" text-anchor="middle">전향력이 공기를 꺾어 반시계 방향으로 감김</text>`; }
        // readouts
        const RX = 292;
        out += `<text class="trait-text" x="${RX}" y="44">전향력 f = ${fmtExp(a.f)} /s</text>`;
        out += `<text class="trait-text" x="${RX}" y="60">${a.cor ? '회전 가능 (위도 5° 밖)' : '0 — 회전 불가'}</text>`;
        out += `<text class="trait-text" x="${RX}" y="84">잠재 최대 풍속(이론) ${a.heat ? `${fmtN(a.PI)} m/s` : '—'}</text>`;
        out += `<text class="trait-text" style="fill:#d97706" x="${RX}" y="100">실제 최대 풍속(대략) ${a.vmax ? `${fmtN(a.vmax)} m/s` : '—'}</text>`;
        out += `<text class="trait-text" style="fill:#dc2626" x="${RX}" y="116">중심 기압 ${a.vmax ? `${fmtN(a.p)} hPa` : '—'}</text>`;
        out += `<text class="gen-text" x="${RX}" y="140">${a.vmax ? `등급: ${a.grade}` : '태풍 없음'}</text>`;
        out += `<text class="small-label" x="${RX}" y="158">등급 문턱 25 · 33 · 44 · 54 m/s</text>`;
        out += `<text class="small-label" x="${RX}" y="172">(중 · 강 · 매우강 · 초강력)</text>`;
        const VERD = { none: '태풍이 생기지 않음', mid: `${a.grade} 태풍 (최대 ${fmtN(a.vmax)} m/s)`, high: `${a.grade} 태풍 (최대 ${fmtN(a.vmax)} m/s)` };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${state.progress >= 1 ? `${SSTS[state.sst].label} · ${LATS[state.lat].label}: ${VERD[a.verdict]}` : `${SSTS[state.sst].label} · ${LATS[state.lat].label}`}</text>`;
        out += `<text class="note-text" x="20" y="208">조건: 해수면 26.5 ℃ 이상(잠열) + 위도 5° 밖(전향력). 육지에 오르면 연료가 끊겨 약해집니다</text>`;
        return out;
    }

    function graphGenesis(a) {
        const X0 = 60, X1 = 420, Y0 = 150, Y1 = 40;
        const xOf = t => X0 + (t - 24) / 8 * (X1 - X0), yOf = v => Y0 - clamp(v / 80, 0, 1) * (Y0 - Y1);
        let out = `<text class="axis-title" x="${X0}" y="18">해수면 온도와 태풍의 잠재 최대 풍속 — 26.5 ℃ 문턱 너머에서 가파르게 늘어남</text>`;
        GRADES.slice(0, 4).forEach(([v, name], gi) => { const rt = gi % 2 === 0; out += `<line class="ref-line" x1="${X0}" y1="${yOf(v).toFixed(1)}" x2="${X1}" y2="${yOf(v).toFixed(1)}"/><text class="small-label" x="${rt ? X1 - 4 : X0 + 6}" y="${(yOf(v) - 4).toFixed(1)}" text-anchor="${rt ? 'end' : 'start'}">${name} ${v}</text>`; });
        for (let t = 24; t <= 32; t += 2) out += `<text class="axis-text" x="${xOf(t).toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${t} ℃</text>`;
        [20, 40, 60, 80].forEach(v => { out += `<text class="axis-text" x="${X0 - 5}" y="${(yOf(v) + 3.5).toFixed(1)}" text-anchor="end">${v}</text>`; });
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        out += `<rect class="band-bad" x="${X0}" y="${Y1}" width="${(xOf(SST_MIN) - X0).toFixed(1)}" height="${Y0 - Y1}"/><text class="small-label" style="fill:#dc2626" x="${((X0 + xOf(SST_MIN)) / 2).toFixed(1)}" y="${Y1 + 12}" text-anchor="middle">안 생김</text>`;
        let d = '', d2 = '';
        for (let t = SST_MIN; t <= 32; t += 0.1) { const PI = 35 + 12 * (t - SST_MIN); d += `${d ? 'L' : 'M'}${xOf(t).toFixed(1)},${yOf(PI).toFixed(1)} `; d2 += `${d2 ? 'L' : 'M'}${xOf(t).toFixed(1)},${yOf(PI * 0.8).toFixed(1)} `; }
        out += `<path class="trace faint" style="stroke:#475569" d="${d}"/><path class="trace" style="stroke:#d97706" d="${d2}"/>`;
        out += `<text class="small-label" x="${xOf(31.2).toFixed(1)}" y="${(yOf(35 + 12 * 4.7) - 6).toFixed(1)}" text-anchor="end">이론값</text><text class="small-label" style="fill:#d97706" x="${xOf(31.2).toFixed(1)}" y="${(yOf((35 + 12 * 4.7) * 0.8) + 12).toFixed(1)}" text-anchor="end">실제(대략, 위도 15°)</text>`;
        if (a.vmax) out += `<circle fill="#ff7a59" stroke="#fff" cx="${xOf(a.sst).toFixed(1)}" cy="${yOf(a.vmax).toFixed(1)}" r="4.5"/>`;
        else out += `<circle fill="#ff7a59" stroke="#fff" cx="${xOf(a.sst).toFixed(1)}" cy="${Y0}" r="4.5"/>`;
        out += `<text class="axis-title" x="${(X0 + X1) / 2}" y="${Y0 + 30}" text-anchor="middle">해수면 온도 — 세로축은 최대 풍속 (m/s)</text>`;
        return out;
    }

    const MX = 20, MY = 26;
    const poly = pts => pts.map(([x, y]) => `${x + MX},${y + MY}`).join(' ');
    function alongTrack(track, t) {
        const segs = []; let total = 0;
        for (let i = 1; i < track.length; i += 1) { const L = Math.hypot(track[i][0] - track[i - 1][0], track[i][1] - track[i - 1][1]); segs.push(L); total += L; }
        let dist = t * total;
        for (let i = 0; i < segs.length; i += 1) { if (dist <= segs[i] || i === segs.length - 1) { const u = clamp(dist / segs[i], 0, 1); const [x0, y0] = track[i], [x1, y1] = track[i + 1]; return { x: x0 + (x1 - x0) * u + MX, y: y0 + (y1 - y0) * u + MY, i, u }; } dist -= segs[i]; }
        return { x: track[0][0] + MX, y: track[0][1] + MY, i: 0, u: 0 };
    }

    function renderTrack(a) {
        const p = state.progress, { h } = a;
        let out = `<defs><clipPath id="mapClip"><rect x="${MX}" y="${MY}" width="280" height="178"/></clipPath></defs>`;
        out += `<rect class="map-sea" x="${MX}" y="${MY}" width="280" height="178" rx="6"/>`;
        out += `<g clip-path="url(#mapClip)">`;
        out += `<polygon class="land" points="${poly(LAND.china)}"/><polygon class="land land-korea" points="${poly(LAND.korea)}"/><polygon class="land" points="${poly(LAND.japan)}"/><polygon class="land" points="${poly(LAND.taiwan)}"/>`;
        out += `<ellipse class="high" cx="${h.cx + MX}" cy="${h.cy + MY}" rx="${h.rx}" ry="${h.ry}"/>`;
        out += `</g>`;
        out += `<text class="map-text" x="${MX + 40}" y="${MY + 70}">중국</text><text class="map-text" x="${MX + 158}" y="${MY + 84}" text-anchor="middle">한반도</text><text class="map-text" x="${MX + 250}" y="${MY + 104}">일본</text>`;
        out += `<text class="map-text" style="fill:#dc2626" x="${clamp(h.cx + MX, MX + 30, MX + 250)}" y="${h.cy + MY - h.ry + 14}" text-anchor="middle">북태평양 고기압</text>`;
        const full = h.track.map(([x, y]) => `${x + MX},${y + MY}`).join(' ');
        out += `<polyline class="track" points="${full}"/>`;
        const pos = alongTrack(h.track, ease(p));
        const done = h.track.slice(0, pos.i + 1).map(([x, y]) => `${x + MX},${y + MY}`).join(' ') + ` ${pos.x.toFixed(1)},${pos.y.toFixed(1)}`;
        out += `<polyline class="track-done" points="${done}"/>`;
        out += spiral(pos.x, pos.y, 12, p * 14, 'spiral', 2);
        // the right-hand column: danger semicircle
        const RX = 380, RY = 96;
        out += `<circle fill="rgba(240,248,250,.08)" stroke="rgba(148, 163, 184, 0.40)" cx="${RX}" cy="${RY}" r="40"/>`;
        out += `<line class="ref-line" x1="${RX}" y1="${RY - 44}" x2="${RX}" y2="${RY + 44}"/>`;
        [[RX + 30, RY, RX + 30, RY - 16], [RX - 30, RY, RX - 30, RY + 16]].forEach(([x1, y1, x2, y2]) => { out += arrow(x1, y1, x2, y2, 'wind-arrow', 'wind-head', 3); });
        out += arrow(RX, RY + 8, RX, RY - 26, 'move-arrow', 'move-head', 3.5);
        out += `<text class="small-label" style="fill:#d97706" x="${RX}" y="${RY - 30}" text-anchor="middle">이동 ${fmtN(a.vm)} m/s</text>`;
        out += `<text class="small-label" style="fill:#0284c7" x="${RX + 36}" y="${RY + 32}" text-anchor="middle">회전 ${V_ROT}</text><text class="small-label" style="fill:#0284c7" x="${RX - 36}" y="${RY + 32}" text-anchor="middle">회전 ${V_ROT}</text>`;
        out += `<text class="trait-text" style="fill:#dc2626" x="${RX}" y="${RY + 58}" text-anchor="middle">오른쪽(위험 반원) ${fmtN(a.right)} m/s</text>`;
        out += `<text class="trait-text" style="fill:#059669" x="${RX}" y="${RY + 74}" text-anchor="middle">왼쪽(가항 반원) ${fmtN(a.left)} m/s</text>`;
        out += `<text class="small-label" x="${RX}" y="${RY + 90}" text-anchor="middle">회전 ${V_ROT} ± 이동 ${fmtN(a.vm)}</text>`;
        const VERD = { china: '고기압 서쪽 가장자리를 따라 중국으로', korea: '고기압 서쪽 끝을 돌아 한반도 관통', japan: '일찍 휘어 일본 쪽으로' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${state.progress >= 1 ? `고기압 ${h.label} · ${SPEEDS[state.speed].label}: ${VERD[a.verdict]}` : `고기압 ${h.label} · ${SPEEDS[state.speed].label}`}</text>`;
        out += `<text class="note-text" x="20" y="208">태풍은 고기압 가장자리의 바람을 타고 갑니다. 진행 방향 오른쪽은 회전 바람에 이동 속력이 더해져 위험 반원</text>`;
        return out;
    }

    function graphTrack(a) {
        const X0 = 60, X1 = 420, Y0 = 150, Y1 = 40, RMAX = 300;
        const xOf = r => X0 + (r + RMAX) / (2 * RMAX) * (X1 - X0), yOf = v => Y0 - clamp(v / 60, 0, 1) * (Y0 - Y1);
        const prof = r => { const ar = Math.abs(r); const rot = ar < R_MAX ? V_ROT * ar / R_MAX : V_ROT * Math.sqrt(R_MAX / ar); return rot + (r > 0 ? a.vm : -a.vm); };
        let out = `<text class="axis-title" x="${X0}" y="18">태풍 중심에서 왼쪽·오른쪽으로의 거리에 따른 바람 (북쪽으로 ${SPEEDS[state.speed].label}로 갈 때)</text>`;
        [0, 20, 40, 60].forEach(v => { out += `<line class="grid-line" x1="${X0}" y1="${yOf(v).toFixed(1)}" x2="${X1}" y2="${yOf(v).toFixed(1)}"/><text class="axis-text" x="${X0 - 5}" y="${(yOf(v) + 3.5).toFixed(1)}" text-anchor="end">${v}</text>`; });
        [-200, -100, 0, 100, 200, 300].forEach(r => { out += `<text class="axis-text" x="${xOf(r).toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${r === 0 ? '중심' : `${Math.abs(r)}`}</text>`; });
        out += `<rect class="band-bad" x="${xOf(0).toFixed(1)}" y="${Y1}" width="${(X1 - xOf(0)).toFixed(1)}" height="${Y0 - Y1}"/>`;
        out += `<text class="small-label" style="fill:#dc2626" x="${xOf(180).toFixed(1)}" y="${Y1 + 12}" text-anchor="middle">오른쪽 — 위험 반원</text><text class="small-label" style="fill:#059669" x="${xOf(-180).toFixed(1)}" y="${Y1 + 12}" text-anchor="middle">왼쪽 — 가항 반원</text>`;
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        let d = '';
        for (let r = -RMAX; r <= RMAX; r += 5) { if (Math.abs(r) < 3) continue; d += `${d ? 'L' : 'M'}${xOf(r).toFixed(1)},${yOf(Math.max(0, prof(r))).toFixed(1)} `; }
        out += `<path class="trace" style="stroke:#d97706" d="${d}"/>`;
        out += `<circle fill="#ff7a59" cx="${xOf(R_MAX).toFixed(1)}" cy="${yOf(a.right).toFixed(1)}" r="3.5"/><text class="small-label" style="fill:#dc2626" x="${(xOf(R_MAX) + 6).toFixed(1)}" y="${(yOf(a.right) - 4).toFixed(1)}">${fmtN(a.right)} m/s</text>`;
        out += `<circle fill="#059669" cx="${xOf(-R_MAX).toFixed(1)}" cy="${yOf(a.left).toFixed(1)}" r="3.5"/><text class="small-label" style="fill:#059669" x="${(xOf(-R_MAX) - 6).toFixed(1)}" y="${(yOf(a.left) - 4).toFixed(1)}" text-anchor="end">${fmtN(a.left)} m/s</text>`;
        out += `<text class="axis-title" x="${(X0 + X1) / 2}" y="${Y0 + 30}" text-anchor="middle">중심에서의 거리 (km) — 세로축은 풍속 (m/s), 회전 바람은 최대 풍속 반지름 50 km에서 ${V_ROT} m/s</text>`;
        return out;
    }

    function renderEnso(a) {
        const p = state.progress, t = a.k * ease(clamp(p / 0.8, 0, 1));
        const mix = (x0, x1) => x0 + (x1 - x0) * Math.abs(t);
        const eN = ENSO['0'], eT = a.e;
        const east = mix(eN.east, eT.east), west = mix(eN.west, eT.west), thE = mix(eN.thE, eT.thE), thW = mix(eN.thW, eT.thW), up = mix(eN.up, eT.up), rainE = mix(eN.rainE, eT.rainE), rainW = mix(eN.rainW, eT.rainW);
        const X0 = 20, X1 = 440, SY = 64, BY = 200, dz = 2 + 2 * (1 + t);   // the sea piles up in the west when the trades are strong
        let out = `<rect class="sky" x="${X0}" y="26" width="${X1 - X0}" height="${SY - 26}"/>`;
        const yTh = depth => SY + depth * 0.55;
        out += `<polygon class="cold-layer" points="${X0},${(yTh(thW)).toFixed(1)} ${X1},${(yTh(thE)).toFixed(1)} ${X1},${BY} ${X0},${BY}"/>`;
        out += `<polygon class="warm-layer" points="${X0},${(SY - dz).toFixed(1)} ${X1},${(SY + dz * 0.4).toFixed(1)} ${X1},${(yTh(thE)).toFixed(1)} ${X0},${(yTh(thW)).toFixed(1)}"/>`;
        out += `<line class="surface" x1="${X0}" y1="${(SY - dz).toFixed(1)}" x2="${X1}" y2="${(SY + dz * 0.4).toFixed(1)}"/>`;
        out += `<line class="thermocline" x1="${X0}" y1="${(yTh(thW)).toFixed(1)}" x2="${X1}" y2="${(yTh(thE)).toFixed(1)}"/>`;
        out += `<text class="small-label" style="fill:#fff" x="${X1 - 6}" y="${(yTh(thE) + 13).toFixed(1)}" text-anchor="end">수온약층 ${fmtN(thE)} m</text><text class="small-label" style="fill:#fff" x="${X0 + 6}" y="${(yTh(thW) + 11).toFixed(1)}">${fmtN(thW)} m</text>`;
        // trade wind
        const len = 40 + 30 * (1 + t);
        out += arrow(230 + len / 2, 40, 230 - len / 2, 40, 'trade', 'trade-head', 4);
        out += `<text class="small-label" style="fill:#0369a1" x="230" y="54" text-anchor="middle">무역풍 ${TRADES[state.trade].label} (동 → 서)</text>`;
        // rain over the warm side
        const rainAt = (x, amt) => { let s = ''; for (let i = 0; i < Math.round(amt * 4); i += 1) s += `<line class="rain" x1="${x - 16 + i * 8}" y1="${34 + (i % 2) * 4}" x2="${x - 19 + i * 8}" y2="${44 + (i % 2) * 4}"/>`; return s; };
        out += cloud(70, 32, 7 * Math.min(1.6, 0.5 + rainW * 0.5)) + rainAt(70, rainW);
        out += cloud(390, 32, 7 * Math.min(1.6, 0.5 + rainE * 0.5)) + rainAt(390, rainE);
        // upwelling arrows near Peru
        for (let i = 0; i < Math.round(up * 2); i += 1) out += arrow(X1 - 14 - i * 12, BY - 10, X1 - 14 - i * 12, yTh(thE) + 4, 'up-arrow', 'up-head', 3);
        out += `<text class="small-label" style="fill:#059669" x="${X1 - 8}" y="${BY - 14}" text-anchor="end">용승 ${up < 0.5 ? '멎음' : up > 1.2 ? '강함' : '보통'}</text>`;
        out += `<text class="trait-text" x="${X0 + 6}" y="${SY + 16}">인도네시아 쪽 ${sgn(west)} ℃</text><text class="trait-text" x="${X1 - 6}" y="${SY + 18}" text-anchor="end">페루 쪽 ${sgn(east)} ℃</text>`;
        out += `<text class="small-label" x="${X0 + 6}" y="${BY - 6}">서태평양</text><text class="small-label" x="230" y="${BY - 6}" text-anchor="middle">붉은 층이 따뜻한 물, 파란 층이 찬물, 흰 점선이 그 경계</text>`;
        const VERD = { elnino: '엘니뇨 — 동태평양 따뜻, 페루 큰비·인도네시아 가뭄', normal: '평소 — 서쪽에 따뜻한 물, 동쪽에서 용승', lanina: '라니냐 — 동태평양 더 차가움, 인도네시아 홍수·페루 가뭄' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${state.progress >= 1 ? VERD[a.verdict] : `무역풍 ${TRADES[state.trade].label}`}</text>`;
        out += `<text class="note-text" x="20" y="208">무역풍이 따뜻한 물을 서쪽에 쌓고, 동쪽에서는 찬물이 올라옵니다(용승). 바람이 바뀌면 다 뒤집힙니다</text>`;
        return out;
    }

    function graphEnso(a) {
        const { e } = a, X0 = 150, XC = 285, X1 = 420, Y = 40, BH = 18;
        let out = `<text class="axis-title" x="20" y="18">평소와 견준 값 — ${e.name} (대략적인 편차)</text>`;
        const rows = [
            ['동태평양 수온', e.east, 2.5, '℃', e.east >= 0 ? 'bar-warm' : 'bar-cold'],
            ['서태평양 수온', e.west, 2.5, '℃', e.west >= 0 ? 'bar-warm' : 'bar-cold'],
            ['동쪽 온난층 두께', e.thE - 50, 130, 'm', e.thE >= 50 ? 'bar-warm' : 'bar-cold'],
            ['페루 강수', (e.rainE - 1) * 100, 260, '%', 'bar-rain'],
            ['인도네시아 강수', (e.rainW - 1) * 100, 260, '%', 'bar-rain'],
        ];
        out += `<line class="axis" x1="${XC}" y1="${Y - 8}" x2="${XC}" y2="${Y + rows.length * (BH + 6)}"/>`;
        rows.forEach(([lab, v, scale, unit, cls], i) => {
            const y = Y + i * (BH + 6), w = Math.abs(v) / scale * (X1 - XC);
            if (w > 0.5) out += `<rect class="${cls}" x="${(v >= 0 ? XC : XC - w).toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="${BH}" rx="3"/>`;
            out += `<text class="trait-text" x="${X0 - 6}" y="${y + BH / 2 + 4}" text-anchor="end">${lab}</text>`;
            out += `<text class="small-label" x="${(v >= 0 ? XC + w + 6 : XC + 6).toFixed(1)}" y="${y + BH / 2 + 4}">${Math.abs(v) < 0.05 ? '평소와 같음' : `${sgn(v, unit === '℃' ? 1 : 0)} ${unit}`}</text>`;
        });
        out += `<text class="small-label" x="${XC}" y="${Y + rows.length * (BH + 6) + 14}" text-anchor="middle">평소 = 0</text>`;
        out += `<text class="small-label" x="20" y="${Y + rows.length * (BH + 6) + 32}">동태평양 수온이 평소보다 0.5 ℃ 넘게 높은 상태가 다섯 달쯤 이어지면 엘니뇨, 낮으면 라니냐라 부릅니다.</text>`;
        return out;
    }

    function noteFor(a) {
        if (a.kind === 'genesis') {
            return `<div class="data-row"><span class="data-name">잠열 조건</span><span class="data-val">해수면 ${a.sst} ℃ — ${a.heat ? '26.5 ℃ 넘음, 수증기 넉넉' : '26.5 ℃에 못 미침'} (포화 수증기압 ${a.es.toFixed(0)} hPa)</span></div>` +
                `<div class="data-row"><span class="data-name">전향력 조건</span><span class="data-val">위도 ${a.lat}° — f = ${fmtExp(a.f, 2)} /s, ${a.cor ? '회전 가능' : '0이라 회전 불가'}</span></div>` +
                `<div class="data-row"><span class="data-name">세기</span><span class="data-val">${a.vmax ? `잠재 ${fmtN(a.PI)} m/s × ${a.eff} = 최대 풍속 약 ${fmtN(a.vmax)} m/s · 중심 기압 약 ${fmtN(a.p)} hPa` : '태풍 없음'}</span></div>` +
                `<div class="data-row match"><span class="data-name">판정</span><span class="data-val">${a.vmax ? `${a.grade} (중 25 · 강 33 · 매우강 44 · 초강력 54 m/s)` : '태풍이 생기지 않음'}</span></div>`;
        }
        if (a.kind === 'track') {
            return `<div class="data-row"><span class="data-name">고기압</span><span class="data-val">북태평양 고기압 ${a.h.label} — 태풍은 그 가장자리를 따라 서북서 → 북 → 북동으로</span></div>` +
                `<div class="data-row"><span class="data-name">진로</span><span class="data-val">${a.verdict === 'china' ? '중국 남동 해안 상륙' : a.verdict === 'korea' ? '남해안 상륙 뒤 한반도 관통' : '규슈·일본 남쪽으로 휘어감'}</span></div>` +
                `<div class="data-row"><span class="data-name">바람</span><span class="data-val">회전 ${V_ROT} m/s · 이동 ${SPEEDS[state.speed].label} = ${fmtN(a.vm, 1)} m/s → 오른쪽 ${fmtN(a.right)} m/s · 왼쪽 ${fmtN(a.left)} m/s</span></div>` +
                `<div class="data-row match"><span class="data-name">위험 반원</span><span class="data-val">진행 방향 오른쪽 — 왼쪽보다 ${fmtN(a.right - a.left)} m/s 셈</span></div>`;
        }
        const { e } = a;
        return `<div class="data-row"><span class="data-name">무역풍</span><span class="data-val">${TRADES[state.trade].label} — ${a.k < 0 ? '따뜻한 표층수가 동쪽으로 되돌아옴' : a.k > 0 ? '따뜻한 표층수를 서쪽에 더 많이 쌓음' : '따뜻한 물은 서쪽에, 동쪽은 용승'}</span></div>` +
            `<div class="data-row"><span class="data-name">수온</span><span class="data-val">동태평양(페루) ${sgn(e.east)} ℃ · 서태평양(인도네시아) ${sgn(e.west)} ℃ · 동쪽 수온약층 ${e.thE} m</span></div>` +
            `<div class="data-row"><span class="data-name">비와 어장</span><span class="data-val">페루 강수 평소의 ${e.rainE}배 · 인도네시아 ${e.rainW}배 · 용승 ${e.up < 0.5 ? '멎어 어획 급감' : e.up > 1.2 ? '강해 어획 풍성' : '보통'}</span></div>` +
            `<div class="data-row match"><span class="data-name">판정</span><span class="data-val">${e.name}</span></div>`;
    }

    function render() {
        const a = analyse();
        mainGroup.innerHTML = a.kind === 'genesis' ? renderGenesis(a) : a.kind === 'track' ? renderTrack(a) : renderEnso(a);
        graphGroup.innerHTML = a.kind === 'genesis' ? graphGenesis(a) : a.kind === 'track' ? graphTrack(a) : graphEnso(a);
        liftProse();
        stageBadge.textContent = a.kind === 'genesis' ? `${SSTS[state.sst].label} · ${LATS[state.lat].label}` : a.kind === 'track' ? `고기압 ${HIGHS[state.high].label} · ${SPEEDS[state.speed].label}` : `무역풍 ${TRADES[state.trade].label}`;
        methodHint.textContent = a.kind === 'genesis' ? '따뜻한 바다의 수증기(잠열)와 전향력, 둘 다 있어야 태풍이 됩니다'
            : a.kind === 'track' ? '태풍은 북태평양 고기압의 가장자리를 따라 갑니다'
                : '무역풍이 따뜻한 물을 서쪽으로 밀어 쌓습니다. 바람이 바뀌면 바다도 뒤집힙니다';
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
        if (a.kind === 'genesis') {
            labelA.textContent = '최대 풍속 (대략)'; valueA.textContent = a.vmax ? `${fmtN(a.vmax)} m/s` : '태풍 없음';
            labelB.textContent = '중심 기압'; valueB.textContent = a.vmax ? `${fmtN(a.p)} hPa` : '—';
            if (!a.heat) s = `해수면이 ${a.sst} ℃로 26.5 ℃에 못 미칩니다. 증발이 적어(포화 수증기압 ${a.es.toFixed(0)} hPa) 상승 공기가 응결하며 내놓는 잠열이 모자라고, 구름은 조금 생겨도 소용돌이를 키울 연료가 없어 태풍이 되지 못합니다. 태풍이 여름과 초가을에만, 열대 바다에서만 생기는 까닭입니다.`;
            else if (!a.cor) s = `바다는 ${a.sst} ℃로 충분히 따뜻해 수증기가 넉넉하지만 위도가 0°라 전향력 f = 2Ω sin φ가 0입니다. 저기압 중심으로 모여드는 공기를 옆으로 꺾어 회전시킬 힘이 없어 커다란 적란운 무리는 생겨도 소용돌이로 감기지 못합니다. 태풍은 위도 5° 밖에서 생깁니다.`;
            else s = `해수면 ${a.sst} ℃의 수증기(포화 수증기압 ${a.es.toFixed(0)} hPa)가 올라가 응결하며 잠열을 내놓고, 위도 ${a.lat}°의 전향력(${fmtExp(a.f)} /s)이 모여드는 공기를 반시계 방향으로 감았습니다. 이 바다에서 이론상 가능한 최대 풍속은 ${fmtN(a.PI)} m/s이고, ${a.lat <= 20 ? '실제 태풍은 대개 그 8할쯤인' : '위도가 높아 상층 바람이 어긋나고 바다가 얕게 따뜻해 6~7할쯤인'} ${fmtN(a.vmax)} m/s에 이르러 중심 기압은 ${fmtN(a.p)} hPa, ${a.grade} 등급입니다. ${a.sst >= 30 ? '바다가 3 ℃ 더 따뜻할 뿐인데 풍속이 훨씬 커지는 것은 수증기가 온도에 따라 가파르게 늘기 때문입니다.' : '바다가 30 ℃면 같은 위도에서 초강력까지 자랄 수 있습니다.'}`;
        } else if (a.kind === 'track') {
            const { h } = a;
            labelA.textContent = '진로'; valueA.textContent = a.verdict === 'china' ? '중국 쪽' : a.verdict === 'korea' ? '한반도 관통' : '일본 쪽';
            labelB.textContent = '위험 반원 · 가항 반원'; valueB.textContent = `${fmtN(a.right)} · ${fmtN(a.left)} m/s`;
            s = `태풍은 북태평양 고기압의 가장자리 바람을 타고 갑니다. 고기압이 ${h.when} 태풍은 서북서로 가다가 ${a.verdict === 'china' ? '고기압이 한반도까지 덮고 있어 그 서쪽 가장자리를 따라 계속 서쪽으로 가 중국 남동 해안에 상륙합니다' : a.verdict === 'korea' ? '고기압의 서쪽 끝인 한반도 부근에서 북동쪽으로 휘어 남해안에 상륙하고 한반도를 관통합니다' : '고기압이 동쪽으로 물러나 있어 일찍 북동쪽으로 휘어 규슈와 일본 남쪽을 지납니다'}. `;
            s += `북반구 태풍은 반시계 방향으로 돕니다. ${SPEEDS[state.speed].label}(${fmtN(a.vm, 1)} m/s)로 움직이면 진행 방향 오른쪽에서는 회전 바람 ${V_ROT} m/s에 이동 속력이 더해져 ${fmtN(a.right)} m/s, 왼쪽에서는 빼져 ${fmtN(a.left)} m/s가 됩니다. 그래서 오른쪽을 위험 반원, 왼쪽을 가항 반원이라 부르고, ${a.verdict === 'korea' ? '태풍이 서해안을 따라 북상하면 우리나라 대부분이 위험 반원에 들어 피해가 큽니다' : '태풍 진로의 오른쪽에 놓인 지역이 더 큰 피해를 입습니다'}.${a.kmh >= 60 ? ' 전향점을 지나 편서풍을 타면 이동이 빨라져 위험 반원의 바람은 더 세집니다.' : ''}`;
        } else {
            const { e } = a;
            labelA.textContent = '동태평양 수온'; valueA.textContent = `${sgn(e.east)} ℃`;
            labelB.textContent = '동쪽 수온약층'; valueB.textContent = `${e.thE} m`;
            if (a.k === 0) s = `무역풍이 평소대로 동쪽에서 서쪽으로 불면 따뜻한 표층수가 서태평양에 쌓여 수온약층이 서쪽 ${e.thW} m, 동쪽 ${e.thE} m로 기울고, 페루 앞바다에서는 깊은 찬물이 올라와(용승) 영양분이 풍부한 어장을 만듭니다. 비는 따뜻한 서태평양 위에 많이 내리고, 그 공기가 상층에서 동쪽으로 되돌아 내려오는 워커 순환이 돕니다.`;
            else if (a.k < 0) s = `무역풍이 약해지자 서쪽에 쌓여 있던 따뜻한 물이 동쪽으로 되돌아왔습니다. 동태평양 수온이 평소보다 ${sgn(e.east)} ℃ 오르고 수온약층이 ${e.thE} m로 깊어져 용승이 멎으니 영양분이 오르지 않아 멸치 어장이 무너집니다. 따뜻한 바다 위로 비구름이 옮겨 가 페루에는 평소의 ${e.rainE}배 큰비가, 인도네시아·호주에는 가뭄이 듭니다. 이것이 엘니뇨이고, 2~7년마다 되풀이됩니다.`;
            else s = `무역풍이 강해지자 따뜻한 물이 서쪽에 더 두껍게 쌓이고(수온약층 ${e.thW} m) 동태평양에서는 용승이 세져 수온이 평소보다 ${fmtN(Math.abs(e.east), 1)} ℃ 더 내려갑니다. 서태평양 위의 비구름이 더 커져 인도네시아에는 평소의 ${e.rainW}배 비가 오고 페루는 가뭅니다. 이것이 라니냐이며, 엘니뇨와 번갈아 나타납니다.`;
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
        checkBtn.textContent = state.mode === 'genesis' ? '며칠 지켜보기' : state.mode === 'track' ? '태풍 보내기' : '바람 바꾸기';
        stageCaption.textContent = state.mode === 'genesis' ? '바다 위에서 수증기가 올라와 구름이 되고, 전향력이 있으면 반시계 방향 소용돌이로 감깁니다.'
            : state.mode === 'track' ? '점선이 북태평양 고기압의 가장자리, 노란 선이 태풍의 길입니다. 오른쪽 원은 회전 바람과 이동 방향을 보입니다.'
                : '태평양을 서쪽(인도네시아)에서 동쪽(페루)으로 자른 단면입니다. 붉은 층이 따뜻한 물, 초록 화살표가 용승입니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { sst: 'c27', lat: 'l15', high: 'mid', speed: 's40', trade: 'weak', progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'genesis').click();
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

    window.__typhoonModel = {
        SSTS, LATS, HIGHS, SPEEDS, TRADES, state,
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
