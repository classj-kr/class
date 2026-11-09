document.addEventListener('DOMContentLoaded', () => {
    const modeButtons = [...document.querySelectorAll('[data-mode]')];
    const rxnButtons = [...document.querySelectorAll('[data-rxn]')];
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const massControls = document.getElementById('massControls');
    const heatControls = document.getElementById('heatControls');
    const mgRange = document.getElementById('mgRange');
    const oxRange = document.getElementById('oxRange');
    const timeRange = document.getElementById('timeRange');
    const mgOutput = document.getElementById('mgOutput');
    const oxOutput = document.getElementById('oxOutput');
    const timeOutput = document.getElementById('timeOutput');
    const runBtn = document.getElementById('runBtn');
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

    // 2Mg + O₂ → 2MgO. With Mg at 24 and O at 16 per formula unit, the masses
    // land on a clean 3 : 2 : 5, which is exactly the ratio the law of definite
    // proportions predicts and what the graph below has to reproduce.
    const R_MG = 3, R_OX = 2, R_PROD = 5;
    const MAX_G = 12;

    // Real classroom reactions, with the sign and rough size of their
    // temperature change.
    const REACTIONS = {
        cao:     { name: '산화칼슘 + 물',        delta: +26, kind: '발열', tau: 6 },
        neut:    { name: '산과 염기의 중화',      delta: +8,  kind: '발열', tau: 8 },
        nh4no3:  { name: '질산암모늄 녹이기',     delta: -9,  kind: '흡열', tau: 10 },
        baoh:    { name: '수산화바륨 + 염화암모늄', delta: -18, kind: '흡열', tau: 7 },
    };
    const T0 = 20;

    const GRAPH = { x0: 52, x1: 420, y0: 152, y1: 22 };

    let mode = 'mass';
    let rxn = 'cao';
    let prediction = null;
    let playing = false;
    let animT = null;
    let rafId = null, lastT = null;

    const mg = () => Number(mgRange.value);
    const ox = () => Number(oxRange.value);
    const elapsed = () => (animT === null ? Number(timeRange.value) : animT);

    // Whichever runs out first stops the reaction; the rest is left over. The
    // product always carries the same 3 : 2 split, and nothing is lost — the
    // leftovers plus the product must weigh what went in.
    function react(mgG = mg(), oxG = ox()) {
        const mgNeeded = (oxG * R_MG) / R_OX;
        const mgUsed = Math.min(mgG, mgNeeded);
        const oxUsed = (mgUsed * R_OX) / R_MG;
        const product = mgUsed + oxUsed;
        const mgLeft = mgG - mgUsed;
        const oxLeft = oxG - oxUsed;
        const limiting = mgG === 0 || oxG === 0 ? 'none'
            : Math.abs(mgLeft) < 1e-9 && Math.abs(oxLeft) < 1e-9 ? 'exact'
            : mgLeft > 1e-9 ? 'ox' : 'mg';
        return { mgUsed, oxUsed, product, mgLeft, oxLeft, limiting,
            before: mgG + oxG, after: product + mgLeft + oxLeft };
    }

    const tempAt = t => {
        const r = REACTIONS[rxn];
        return T0 + r.delta * (1 - Math.exp(-t / r.tau));
    };

    const gx = (v, max) => GRAPH.x0 + (v / max) * (GRAPH.x1 - GRAPH.x0);
    const gy = (v, lo, hi) => GRAPH.y0 - ((v - lo) / (hi - lo)) * (GRAPH.y0 - GRAPH.y1);

    const chips = (n, cls, cx, cy, r) => {
        let s = '';
        const count = Math.min(24, Math.round(n * 2));
        for (let i = 0; i < count; i += 1) {
            const col = i % 6, row = Math.floor(i / 6);
            s += `<circle class="${cls}" cx="${(cx - 32 + col * 13).toFixed(1)}" cy="${(cy - row * 11).toFixed(1)}" r="${r}"/>`;
        }
        return s;
    };

    const clamp01 = v => Math.max(0, Math.min(1, v));
    // 질량 관계: 닫힌 플라스크(마그네슘 리본 + 산소)를 왼쪽 접시에, 같은 질량의 추를 오른쪽 접시에 올린다.
    // '결과 확인하기'를 누르면 플라스크 속 마그네슘이 타서 흰 산화마그네슘 가루가 되고, 저울이 흔들렸다가 멈춘다.
    let burn = 0, burnId = 0;
    const easeIO = t => t < .5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t);
    function renderMass() {
        const a = react(), done = burn >= 1;
        const q = clamp01((burn - 0.12) / 0.6), e = easeIO(q);          // 반응이 진행된 정도
        const mgNow = mg() - a.mgUsed * e, oxNow = ox() - a.oxUsed * e, prodNow = a.product * e;
        // 질량은 그대로이므로 저울은 수평. 타는 동안만 플라스크가 흔들려 저울대가 살짝 떨린다.
        const shake = burn > 0 && burn < 1 ? Math.sin(burn * 70) * 2.2 * Math.max(0, 1 - burn) : 0;
        const PIV = { x: 230, y: 44 }, ARM = 120, ang = shake * Math.PI / 180;
        const end = s => [PIV.x + s * ARM * Math.cos(ang), PIV.y + s * ARM * Math.sin(ang)];
        const [lx, ly] = end(-1), [rx, ry] = end(1);
        const PAN_DROP = 104, PW = 58;
        let out = '';
        // 받침대
        out += `<rect class="stand" x="${PIV.x - 5}" y="${PIV.y}" width="10" height="152"/><rect class="stand-base" x="${PIV.x - 46}" y="194" width="92" height="9" rx="3"/>`;
        // 저울대와 가운데 바늘
        out += `<line class="beam" x1="${lx.toFixed(1)}" y1="${ly.toFixed(1)}" x2="${rx.toFixed(1)}" y2="${ry.toFixed(1)}"/>`;
        out += `<circle class="pivot" cx="${PIV.x}" cy="${PIV.y}" r="6"/>`;
        out += `<line class="pointer" x1="${PIV.x}" y1="${PIV.y}" x2="${(PIV.x - Math.sin(ang) * 34).toFixed(1)}" y2="${(PIV.y + Math.cos(ang) * 34).toFixed(1)}"/><path class="scale-arc" d="M${PIV.x - 12},${PIV.y + 38} Q${PIV.x},${PIV.y + 42} ${PIV.x + 12},${PIV.y + 38}"/>`;
        // 접시: 끝에서 세 줄로 매달고, 줄은 접시 가장자리에 닿는다
        const pan = (x, y) => {
            const py = y + PAN_DROP;
            return `<line class="hanger" x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${(x - PW).toFixed(1)}" y2="${py.toFixed(1)}"/>` +
                `<line class="hanger" x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${(x + PW).toFixed(1)}" y2="${py.toFixed(1)}"/>` +
                `<circle class="hook" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3"/>` +
                `<path class="pan" d="M${(x - PW - 4).toFixed(1)},${py.toFixed(1)} L${(x + PW + 4).toFixed(1)},${py.toFixed(1)} Q${(x + PW - 6).toFixed(1)},${(py + 9).toFixed(1)} ${(x + PW - 16).toFixed(1)},${(py + 9).toFixed(1)} L${(x - PW + 16).toFixed(1)},${(py + 9).toFixed(1)} Q${(x - PW + 6).toFixed(1)},${(py + 9).toFixed(1)} ${(x - PW - 4).toFixed(1)},${py.toFixed(1)} Z"/>`;
        };
        out += pan(lx, ly) + pan(rx, ry);
        // 왼쪽 접시 위의 닫힌 삼각 플라스크
        const fx = lx, fb = ly + PAN_DROP, ft = fb - 78;
        const flaskPath = `M${(fx - 7).toFixed(1)},${ft.toFixed(1)} L${(fx - 7).toFixed(1)},${(ft + 20).toFixed(1)} L${(fx - 34).toFixed(1)},${(fb - 3).toFixed(1)} Q${(fx - 35).toFixed(1)},${fb.toFixed(1)} ${(fx - 30).toFixed(1)},${fb.toFixed(1)} L${(fx + 30).toFixed(1)},${fb.toFixed(1)} Q${(fx + 35).toFixed(1)},${fb.toFixed(1)} ${(fx + 34).toFixed(1)},${(fb - 3).toFixed(1)} L${(fx + 7).toFixed(1)},${(ft + 20).toFixed(1)} L${(fx + 7).toFixed(1)},${ft.toFixed(1)}`;
        out += `<path class="flask-glass" d="${flaskPath} Z"/>`;
        // 산소 분자 (O₂ 두 알갱이 짝), 남은 만큼만
        const nO = Math.round(clamp01(oxNow / MAX_G) * 16 + (oxNow > 0.05 ? 1 : 0));
        for (let i = 0; i < nO; i += 1) {
            const row = Math.floor(i / 4), col = i % 4, wob = burn > 0 && burn < 1 ? Math.sin(burn * 40 + i) * 1.5 : 0;
            const ox_ = fx - 15 + col * 10 - row * 2 + wob, oy = fb - 22 - row * 9 + (col % 2) * 3;
            out += `<circle class="o2" cx="${(ox_ - 2.2).toFixed(1)}" cy="${oy.toFixed(1)}" r="2.4"/><circle class="o2" cx="${(ox_ + 2.2).toFixed(1)}" cy="${oy.toFixed(1)}" r="2.4"/>`;
        }
        // 마그네슘 리본 (은빛 띠, 남은 길이만큼)
        const ribbon = clamp01(mgNow / MAX_G) * 50;
        if (ribbon > 0.5) out += `<rect class="mg-ribbon" x="${(fx - 25).toFixed(1)}" y="${(fb - 6).toFixed(1)}" width="${ribbon.toFixed(1)}" height="3.4" rx="1"/>`;
        // 산화마그네슘: 흰 가루 더미
        if (prodNow > 0.05) { const w = 8 + clamp01(prodNow / (MAX_G * 5 / 3)) * 48, h = 3 + w * 0.3; out += `<path class="mgo" d="M${(fx + 26 - w).toFixed(1)},${(fb - 1).toFixed(1)} Q${(fx + 26 - w / 2).toFixed(1)},${(fb - 1 - h * 2).toFixed(1)} ${(fx + 26).toFixed(1)},${(fb - 1).toFixed(1)} Z"/>`; }
        // 타는 모습: 리본 끝에서 밝은 흰 불꽃과 불티, 플라스크 안 흰 연기
        if (burn > 0.08 && burn < 0.8 && a.product > 0) {
            const hx = fx - 25 + ribbon, hy = fb - 6, fl = 15 + Math.sin(burn * 90) * 3;
            out += `<circle class="mg-glow" cx="${hx.toFixed(1)}" cy="${(hy - 8).toFixed(1)}" r="${(13 + Math.sin(burn * 60) * 2).toFixed(1)}"/>`;
            out += `<path class="mg-flame" d="M${(hx - 9).toFixed(1)},${hy.toFixed(1)} C${(hx - 9).toFixed(1)},${(hy - fl).toFixed(1)} ${(hx - 2).toFixed(1)},${(hy - fl * 1.3).toFixed(1)} ${hx.toFixed(1)},${(hy - fl * 1.8).toFixed(1)} C${(hx + 2).toFixed(1)},${(hy - fl * 1.3).toFixed(1)} ${(hx + 9).toFixed(1)},${(hy - fl).toFixed(1)} ${(hx + 9).toFixed(1)},${hy.toFixed(1)} Z"/><circle class="mg-core" cx="${hx.toFixed(1)}" cy="${(hy - 5).toFixed(1)}" r="4.5"/>`;
            for (let i = 0; i < 5; i += 1) { const t = (burn * 9 + i / 5) % 1; out += `<circle class="spark" cx="${(hx + Math.cos(i * 1.3) * t * 16).toFixed(1)}" cy="${(hy - 4 - t * 18 + Math.sin(i) * 3).toFixed(1)}" r="1.4" opacity="${(1 - t).toFixed(2)}"/>`; }
        }
        if (burn > 0.2 && a.product > 0) { const haze = Math.min(0.35, (burn - 0.2) * 0.8) * (done ? 0.4 : 1); out += `<path class="smoke" opacity="${haze.toFixed(2)}" d="${flaskPath} Z"/>`; }
        out += `<rect class="stopper" x="${(fx - 9).toFixed(1)}" y="${(ft - 9).toFixed(1)}" width="18" height="11" rx="2"/>`;
        // 오른쪽 접시 위의 추 (반응 전 전체 질량과 같게)
        const wb = ry + PAN_DROP, nW = Math.max(1, Math.min(4, Math.ceil(a.before / 6)));
        for (let i = 0; i < nW; i += 1) { const wx = rx - (nW - 1) * 12 + i * 24, wh = 22; out += `<rect class="weight" x="${(wx - 9).toFixed(1)}" y="${(wb - wh).toFixed(1)}" width="18" height="${wh}" rx="3"/><rect class="weight" x="${(wx - 3.5).toFixed(1)}" y="${(wb - wh - 6).toFixed(1)}" width="7" height="7" rx="2"/>`; }
        // 짧은 이름표 (줄과 겹치지 않게 접시 아래에)
        out += `<text class="pan-title" x="${lx.toFixed(1)}" y="${(ly + PAN_DROP + 28).toFixed(1)}" text-anchor="middle">닫힌 플라스크</text>`;
        out += `<text class="pan-title" x="${rx.toFixed(1)}" y="${(ry + PAN_DROP + 28).toFixed(1)}" text-anchor="middle">추 ${a.before.toFixed(1)} g</text>`;
        out += `<text class="small-label" x="${(lx).toFixed(1)}" y="${(ly + PAN_DROP + 44).toFixed(1)}" text-anchor="middle">Mg ${mg().toFixed(1)} g + O ${ox().toFixed(1)} g</text>`;
        if (done) out += `<text class="level-note" x="${(rx).toFixed(1)}" y="${(ry + PAN_DROP + 44).toFixed(1)}" text-anchor="middle">반응 뒤에도 수평</text>`;
        // 범례 (그림 위쪽 빈자리)
        out += `<rect class="mg-ribbon" x="292" y="10" width="16" height="4" rx="1"/><text class="legend-text" x="312" y="16">마그네슘</text>`;
        out += `<circle class="o2" cx="378" cy="12" r="2.6"/><circle class="o2" cx="383" cy="12" r="2.6"/><text class="legend-text" x="390" y="16">산소</text>`;
        out += `<path class="mgo" d="M20,15 Q28,5 36,15 Z"/><text class="legend-text" x="40" y="16">산화마그네슘</text>`;
        window.scienceScene.render(mainGroup,out);

        // Product against magnesium added, at the current oxygen: a straight
        // line while oxygen lasts, then a flat ceiling once it runs out.
        let g = '';
        const yMax = MAX_G * 2;
        for (let v = 0; v <= yMax; v += 6) {
            g += `<line class="grid-line" x1="${GRAPH.x0}" y1="${gy(v, 0, yMax).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(v, 0, yMax).toFixed(1)}"/>`;
            g += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(gy(v, 0, yMax) + 3).toFixed(1)}" text-anchor="end">${v}</text>`;
        }
        for (let v = 0; v <= MAX_G; v += 3) {
            g += `<text class="axis-text" x="${gx(v, MAX_G).toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${v}</text>`;
        }
        g += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        g += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        g += `<text class="axis-title" x="${(GRAPH.x0 + GRAPH.x1) / 2}" y="${GRAPH.y0 + 30}" text-anchor="middle">넣은 마그네슘 (g)</text>`;
        g += `<text class="axis-title" x="${GRAPH.x0}" y="${GRAPH.y1 - 6}">산화마그네슘 (g)</text>`;
        const pts = [];
        for (let v = 0; v <= MAX_G; v += 0.25) pts.push(`${gx(v, MAX_G).toFixed(1)},${gy(react(v, ox()).product, 0, yMax).toFixed(1)}`);
        g += `<path class="trace" style="stroke:#059669" d="M${pts.join('L')}"/>`;
        const knee = (ox() * R_MG) / R_OX;
        if (ox() > 0 && knee <= MAX_G) {
            g += `<line class="knee-line" x1="${gx(knee, MAX_G).toFixed(1)}" y1="${GRAPH.y1}" x2="${gx(knee, MAX_G).toFixed(1)}" y2="${GRAPH.y0}"/>`;
            const flip = gx(knee, MAX_G) > (GRAPH.x0 + GRAPH.x1) / 2;
            g += `<text class="knee-text" x="${(gx(knee, MAX_G) + (flip ? -5 : 5)).toFixed(1)}" y="${GRAPH.y1 + 10}"${flip ? ' text-anchor="end"' : ''}>산소가 다 쓰이는 ${knee.toFixed(1)} g</text>`;
        }
        if (done) g += `<circle class="trace-dot" cx="${gx(mg(), MAX_G).toFixed(1)}" cy="${gy(a.product, 0, yMax).toFixed(1)}" r="5" fill="#d97706"/>`;
        window.scienceScene.render(graphGroup,g);

        stageBadge.textContent = done ? `${a.before.toFixed(1)} g → ${a.after.toFixed(1)} g` : `반응 전 ${a.before.toFixed(1)} g`;
        mgOutput.textContent = `${mg().toFixed(1)} g`;
        oxOutput.textContent = `${ox().toFixed(1)} g`;
        window.scienceScene.render(dataNote, !done ? `<div class="data-row"><span class="data-name">넣은 질량</span><span class="data-val">Mg ${mg().toFixed(1)} g + O ${ox().toFixed(1)} g = ${a.before.toFixed(1)} g</span></div>` :
            `<div class="data-row"><span class="data-name">반응한 질량</span><span class="data-val">Mg ${a.mgUsed.toFixed(1)} g + O ${a.oxUsed.toFixed(1)} g → MgO ${a.product.toFixed(1)} g</span></div>` +
            `<div class="data-row${a.product > 0 ? ' match' : ''}"><span class="data-name">화합물의 질량비</span><span class="data-val">${a.product > 0 ? `${a.mgUsed.toFixed(1)} : ${a.oxUsed.toFixed(1)} = ${R_MG} : ${R_OX} (항상 일정)` : '반응 없음'}</span></div>` +
            `<div class="data-row match"><span class="data-name">전체 질량</span><span class="data-val">반응 전 ${a.before.toFixed(1)} g = 반응 후 ${a.after.toFixed(1)} g</span></div>`);
    }
    function stopBurn() { if (burnId) cancelAnimationFrame(burnId); burnId = 0; }
    function playBurn(done) {
        stopBurn();
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { burn = 1; renderMass(); done(); return; }
        const t0 = performance.now(), dur = 3400;
        const step = now => { burn = Math.min(1, (now - t0) / dur); renderMass(); if (burn >= 1) { burnId = 0; done(); return; } burnId = requestAnimationFrame(step); };
        burn = 0.0001; renderMass(); burnId = requestAnimationFrame(step);
    }

    function renderHeat() {
        const r = REACTIONS[rxn], t = elapsed(), temp = tempAt(t);
        const warming = r.delta > 0;
        let out = '';
        const BX = { x0: 160, x1: 290, top: 44, bottom: 160 };
        out += `<rect class="vessel-fill" x="${BX.x0 + 2}" y="80" width="${BX.x1 - BX.x0 - 4}" height="${BX.bottom - 80}" fill="${warming ? 'rgba(255,140,100,.28)' : 'rgba(120,190,240,.28)'}"/>`;
        out += `<path class="vessel" fill="none" d="M${BX.x0},${BX.top} L${BX.x0},${BX.bottom} L${BX.x1},${BX.bottom} L${BX.x1},${BX.top}"/>`;
        const frac = Math.max(0, Math.min(1, (temp - (T0 - 20)) / 50));
        const TX = 312;
        out += `<rect class="therm-tube" x="${TX}" y="52" width="10" height="96" rx="5"/>`;
        out += `<rect class="therm-fill${warming ? '' : ' cold'}" x="${TX + 2}" y="${(144 - 90 * frac).toFixed(1)}" width="6" height="${(90 * frac + 4).toFixed(1)}" rx="3"/>`;
        out += `<text class="rxn-label" x="${TX + 18}" y="76">${temp.toFixed(1)} ℃</text>`;
        out += `<text class="axis-text" x="${TX + 18}" y="92">시작 ${T0} ℃</text>`;
        out += `<text class="rxn-label" x="${(BX.x0 + BX.x1) / 2}" y="182" text-anchor="middle">${r.name}</text>`;
        out += `<text class="rxn-kind" fill="${warming ? '#ea580c' : '#0284c7'}" x="${(BX.x0 + BX.x1) / 2}" y="200" text-anchor="middle">${r.kind} 반응 · 주위 온도 ${warming ? '상승' : '하강'}</text>`;
        window.scienceScene.render(mainGroup,out);

        const lo = 0, hi = 50;
        let g = '';
        for (let v = lo; v <= hi; v += 10) {
            g += `<line class="grid-line" x1="${GRAPH.x0}" y1="${gy(v, lo, hi).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(v, lo, hi).toFixed(1)}"/>`;
            g += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(gy(v, lo, hi) + 3).toFixed(1)}" text-anchor="end">${v}</text>`;
        }
        for (let s = 0; s <= 60; s += 15) {
            g += `<text class="axis-text" x="${gx(s, 60).toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${s}</text>`;
        }
        g += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        g += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        g += `<text class="axis-title" x="${(GRAPH.x0 + GRAPH.x1) / 2}" y="${GRAPH.y0 + 30}" text-anchor="middle">시간 (초)</text>`;
        g += `<text class="axis-title" x="${GRAPH.x0}" y="${GRAPH.y1 - 6}">온도 (℃)</text>`;
        g += `<line class="base-line" x1="${GRAPH.x0}" y1="${gy(T0, lo, hi).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(T0, lo, hi).toFixed(1)}"/>`;
        g += `<text class="axis-text" x="${GRAPH.x1 - 4}" y="${(gy(T0, lo, hi) - 5).toFixed(1)}" text-anchor="end">시작 온도 ${T0} ℃</text>`;
        Object.entries(REACTIONS).forEach(([key, rr]) => {
            const pts = [];
            for (let s = 0; s <= 60; s += 1) {
                pts.push(`${gx(s, 60).toFixed(1)},${gy(T0 + rr.delta * (1 - Math.exp(-s / rr.tau)), lo, hi).toFixed(1)}`);
            }
            const col = rr.delta > 0 ? '#ea580c' : '#0284c7';
            g += `<path class="trace" style="stroke:${col};opacity:${key === rxn ? 1 : .32}" d="M${pts.join('L')}"/>`;
        });
        g += `<circle class="trace-dot" cx="${gx(t, 60).toFixed(1)}" cy="${gy(temp, lo, hi).toFixed(1)}" r="5" fill="#d97706"/>`;
        window.scienceScene.render(graphGroup,g);

        stageBadge.textContent = `${r.kind} · ${temp.toFixed(1)} ℃`;
        timeOutput.textContent = `${t.toFixed(0)} 초`;
        window.scienceScene.render(dataNote,`<div class="data-row"><span class="data-name">반응</span><span class="data-val">${r.name}</span></div>` +
            `<div class="data-row"><span class="data-name">온도 변화</span><span class="data-val">${T0} ℃ → ${temp.toFixed(1)} ℃ (${r.delta > 0 ? '+' : ''}${(temp - T0).toFixed(1)} ℃)</span></div>` +
            `<div class="data-row match"><span class="data-name">종류</span><span class="data-val">${r.kind} 반응 — 열을 ${r.delta > 0 ? '내놓아 주위가 따뜻해집니다' : '흡수해 주위가 차가워집니다'}</span></div>`);
    }

    const render = () => {
        mode === 'mass' ? renderMass() : renderHeat();
        if (!resultContent.hidden) showResult();
    };
    const clearResult = () => { resultEmpty.hidden = false; resultContent.hidden = true; };

    function showResult() {
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        if (mode === 'mass') {
            const a = react();
            labelA.textContent = '만들어진 산화마그네슘';
            labelB.textContent = '남은 물질';
            valueA.textContent = `${a.product.toFixed(1)} g`;
            valueB.textContent = a.mgLeft > 1e-9 ? `Mg ${a.mgLeft.toFixed(1)} g`
                : a.oxLeft > 1e-9 ? `O ${a.oxLeft.toFixed(1)} g` : '없음';
            predictionResult.textContent = !prediction
                ? '다음에는 결과를 먼저 예상해 보세요.'
                : prediction === 'same' ? '예상이 맞았습니다.' : '예상과 다른 결과입니다. 전체 질량은 변하지 않습니다.';
            explanation.textContent =
                `마그네슘과 산소는 언제나 ${R_MG} : ${R_OX} 의 질량비로 반응합니다. ` +
                (a.limiting === 'mg' ? `산소가 넉넉해 마그네슘 ${a.mgUsed.toFixed(1)} g이 모두 반응하고 산소 ${a.oxLeft.toFixed(1)} g이 남습니다. `
                : a.limiting === 'ox' ? `산소 ${a.oxUsed.toFixed(1)} g이 먼저 다 쓰여 마그네슘 ${a.mgLeft.toFixed(1)} g이 남습니다. `
                : a.limiting === 'exact' ? `두 물질이 꼭 맞는 비율이라 남는 것 없이 모두 반응합니다. ` : `한쪽이 없어 반응이 일어나지 않습니다. `) +
                `반응 전 ${a.before.toFixed(1)} g과 반응 후 ${a.after.toFixed(1)} g이 같아 저울은 수평을 유지합니다. 원자가 새로 생기거나 사라지지 않기 때문입니다.`;
        } else {
            const r = REACTIONS[rxn], t = elapsed(), temp = tempAt(t);
            labelA.textContent = '지금 온도';
            labelB.textContent = '반응의 종류';
            valueA.textContent = `${temp.toFixed(1)} ℃`;
            valueB.textContent = r.kind;
            predictionResult.textContent = `${r.kind} 반응이므로 주위 온도가 ${r.delta > 0 ? '올라갑니다' : '내려갑니다'}.`;
            explanation.textContent =
                `${r.name}은 ${r.kind} 반응입니다. 반응이 진행되면서 온도가 ${T0} ℃ 에서 ${temp.toFixed(1)} ℃로 ` +
                `${r.delta > 0 ? '올라갑니다' : '내려갑니다'}. ` +
                `${r.delta > 0 ? '반응물이 가지고 있던 에너지 일부가 열로 빠져나와 주위를 데웁니다.' : '반응이 진행되려면 에너지가 필요해 주위에서 열을 빼앗아 가므로 주위가 차가워집니다.'}`;
        }
    }

    function frame(now) {
        const tt = now / 1000;
        const dt = lastT === null ? 1 / 60 : Math.min(1 / 20, tt - lastT);
        lastT = tt;
        if (playing) {
            animT = Math.min(60, animT + dt * 12);
            timeRange.value = String(Math.round(animT));
            render();
            if (animT >= 60) { playing = false; runBtn.textContent = '결과 확인하기'; }
            rafId = playing ? requestAnimationFrame(frame) : null;
            if (!playing) lastT = null;
        } else { rafId = null; lastT = null; }
    }

    function stopPlayback() {
        playing = false;
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = null; lastT = null; animT = null;
        runBtn.textContent = mode === 'mass' ? '결과 확인하기' : '반응 시작';
    }
    document.querySelectorAll('.control-panel input[type="range"]').forEach(el => el.addEventListener('input', stopPlayback, true));
    document.querySelectorAll('.control-panel button').forEach(el => {
        if (el !== runBtn && el !== resetBtn) el.addEventListener('click', stopPlayback, true);
    });

    runBtn.addEventListener('click', () => {
        if (mode === 'mass') { clearResult(); playBurn(() => showResult()); return; }
        playing = !playing;
        runBtn.textContent = playing ? '멈추기' : '결과 확인하기';
        if (playing) {
            animT = Number(timeRange.value);
            if (animT >= 60) animT = 0;
            showResult();
            if (rafId === null) { lastT = null; rafId = requestAnimationFrame(frame); }
        } else {
            timeRange.value = String(Math.round(elapsed()));
            animT = null; render();
        }
    });
    resetBtn.addEventListener('click', () => {
        stopBurn(); burn = 0;
        playing = false; animT = null;
        if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; lastT = null; }
        runBtn.textContent = mode === 'mass' ? '결과 확인하기' : '반응 시작';
        timeRange.value = '0';
        clearResult();
        stageCaption.textContent = mode === 'mass'
            ? '반응 전과 후의 전체 질량을 저울로 비교해 보세요.'
            : '반응을 골라 온도가 오르는지 내리는지 확인해 보세요.';
        render();
    });
    modeButtons.forEach(button => button.addEventListener('click', () => {
        mode = button.dataset.mode;
        modeButtons.forEach(item => item.classList.toggle('selected', item === button));
        massControls.hidden = mode !== 'mass';
        heatControls.hidden = mode !== 'heat';
        resetBtn.click();
    }));
    rxnButtons.forEach(button => button.addEventListener('click', () => {
        rxn = button.dataset.rxn;
        rxnButtons.forEach(item => item.classList.toggle('selected', item === button));
        animT = null; render(); if (!resultContent.hidden) showResult();
    }));
    [mgRange, oxRange, timeRange].forEach(el => el.addEventListener('input', () => {
        // 질량을 바꾸면 다시 반응 전 상태로 (결과는 다시 확인해야 보인다)
        if (el !== timeRange) { stopBurn(); burn = 0; clearResult(); }
        animT = null; render(); if (!resultContent.hidden) showResult();
    }));
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
        predictionButtons.forEach(item => item.classList.toggle('selected', item === button));
    }));

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

    window.__massModel = {
        R_MG, R_OX, R_PROD, MAX_G, REACTIONS, T0, react, tempAt,
        setMode(m) { document.querySelector(`[data-mode="${m}"]`).click(); },
        setRxn(r) { document.querySelector(`[data-rxn="${r}"]`).click(); },
        setMg(v) { mgRange.value = String(v); mgRange.dispatchEvent(new Event('input')); },
        setOx(v) { oxRange.value = String(v); oxRange.dispatchEvent(new Event('input')); },
        setTime(v) { timeRange.value = String(v); timeRange.dispatchEvent(new Event('input')); },
        mg, ox, elapsed, render,
    };

    resetBtn.click();
});
