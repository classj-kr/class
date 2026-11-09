document.addEventListener('DOMContentLoaded', () => {
    const indButtons = [...document.querySelectorAll('[data-ind]')];
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const acidConcRange = document.getElementById('acidConcRange');
    const baseConcRange = document.getElementById('baseConcRange');
    const volRange = document.getElementById('volRange');
    const acidConcOutput = document.getElementById('acidConcOutput');
    const baseConcOutput = document.getElementById('baseConcOutput');
    const volOutput = document.getElementById('volOutput');
    const playBtn = document.getElementById('playBtn');
    const resetBtn = document.getElementById('resetBtn');
    const resultEmpty = document.getElementById('resultEmpty');
    const resultContent = document.getElementById('resultContent');
    const valueA = document.getElementById('valueA');
    const valueB = document.getElementById('valueB');
    const predictionResult = document.getElementById('predictionResult');
    const explanation = document.getElementById('elementaryExplanation');
    const stageCaption = document.getElementById('stageCaption');
    const stageBadge = document.getElementById('stageBadge');
    const beakerGroup = document.getElementById('beakerGroup');
    const graphGroup = document.getElementById('graphGroup');
    const dataNote = document.getElementById('dataNote');

    const ACID_ML = 50;
    const T0 = 20;
    const KW = 1e-14;
    const DH_NEUT = 57100;      // J per mole of water formed
    const C_WATER = 4.18;       // J/(g·℃)
    const MAX_ML = 120;
    const GRAPH = { x0: 52, x1: 408, y0: 172, y1: 24 };

    let indicator = 'btb';
    let prediction = null;
    let playing = false;
    let animV = null;
    let rafId = null, lastT = null;

    const acidC = () => Number(acidConcRange.value);
    const baseC = () => Number(baseConcRange.value);
    const addedML = () => (animV === null ? Number(volRange.value) : animV);

    // Moles of each ion, then whichever is in excess sets the acidity.
    // Solving [H+]² − c[H+] − Kw = 0 keeps pH exact right through the
    // neutral point instead of blowing up when the excess reaches zero.
    function analyse(vb = addedML()) {
        const nH = acidC() * (ACID_ML / 1000);
        const nOH = baseC() * (vb / 1000);
        const totalL = (ACID_ML + vb) / 1000;
        const net = (nH - nOH) / totalL;          // + acid excess, − base excess
        let pH;
        if (net >= 0) {
            const h = (net + Math.sqrt(net * net + 4 * KW)) / 2;
            pH = -Math.log10(h);
        } else {
            const oh = (-net + Math.sqrt(net * net + 4 * KW)) / 2;
            pH = 14 + Math.log10(oh);
        }
        // Every OH⁻ that meets an H⁺ makes one water molecule and releases
        // heat; past the equivalence point no more forms, yet the liquid keeps
        // growing, so the temperature falls again.
        const nWater = Math.min(nH, nOH);
        const massG = ACID_ML + vb;
        const temp = T0 + (DH_NEUT * nWater) / (massG * C_WATER);
        const eqML = (nH / baseC()) * 1000;
        return { nH, nOH, pH, nWater, temp, eqML, net,
            state: Math.abs(nH - nOH) < 1e-12 ? 'neutral' : nH > nOH ? 'acid' : 'base' };
    }

    // Indicator colours keyed to the pH ranges where each actually changes.
    function indicatorColor(pH) {
        if (indicator === 'btb') {
            if (pH < 6.0) return { fill: 'rgba(240,220,90,.55)', name: '노란색 (산성)' };
            if (pH <= 7.6) return { fill: 'rgba(120,215,140,.55)', name: '초록색 (중성)' };
            return { fill: 'rgba(110,170,240,.55)', name: '파란색 (염기성)' };
        }
        if (indicator === 'phen') {
            if (pH < 8.3) return { fill: 'rgba(210,225,235,.30)', name: '무색' };
            return { fill: 'rgba(240,110,180,.55)', name: '붉은색 (염기성)' };
        }
        if (pH < 5.5) return { fill: 'rgba(235,120,110,.5)', name: '붉은색 (산성)' };
        if (pH <= 8.0) return { fill: 'rgba(200,190,175,.4)', name: '보라색 (중성)' };
        return { fill: 'rgba(110,150,230,.55)', name: '푸른색 (염기성)' };
    }

    const gx = v => GRAPH.x0 + (v / MAX_ML) * (GRAPH.x1 - GRAPH.x0);
    const gyPH = p => GRAPH.y0 - (p / 14) * (GRAPH.y0 - GRAPH.y1);

    const reduceMotion = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    // 화학식은 고딕으로: 공용 읽기 글꼴(바탕체)에서 H가 II처럼 보인다
    const CHEM_RE = /(?:[A-Z][a-z]?[₀-₉]*)+(?:[⁺⁻][₀-₉]*)?|pH/g;
    const chem = t => String(t).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])).replace(CHEM_RE, f => `<span class="chem">${f}</span>`);
    function chemifyTree(root) {
        if (!root) return;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), nodes = [];
        while (walker.nextNode()) { const n = walker.currentNode; if (n.parentElement && !n.parentElement.closest('.chem,script,style,svg') && /[A-Z]|pH/.test(n.nodeValue)) nodes.push(n); }
        nodes.forEach(n => { const span = document.createElement('span'); span.innerHTML = chem(n.nodeValue); n.replaceWith(...span.childNodes); });
    }
    chemifyTree(document.querySelector('.meaning-panel'));
    chemifyTree(document.querySelector('.quiz-section'));

    // 확대 모형의 입자 수: 처음 염산의 H⁺를 4개로 두고 넣은 OH⁻를 같은 비율로 센다
    function particleCounts(a) {
        const unit = a.nH / 4, b = Math.min(8, Math.round(a.nOH / unit));
        return { h: Math.max(0, 4 - b), cl: 4, na: b, water: Math.min(4, b), oh: Math.max(0, b - 4), capped: a.nOH / unit > 8.5 };
    }
    const SLOTS = (() => {
        // 확대 원 안의 자리: 겹치지 않게 미리 정한 24곳
        const out = [], cx = 368, cy = 174, R = 84;
        for (let r = -3; r <= 3; r += 1) for (let c = -4; c <= 4; c += 1) {
            const x = cx + c * 27 + (r % 2 ? 13.5 : 0), y = cy + r * 24;
            if (Math.hypot(x - cx, y - cy) < R - 12) out.push([x, y]);
        }
        const order = out.map((p, i) => [p, Math.sin(i * 91.7) * 1000 % 1]).sort((u, v) => u[1] - v[1]).map(u => u[0]);
        if (order.length < 20) console.warn('slots', order.length);
        return order;
    })();

    function renderBeaker(a, now = performance.now()) {
        const col = indicatorColor(a.pH);
        const vol = ACID_ML + addedML();
        const BX = { x0: 98, x1: 206, top: 150, bottom: 246 };
        const mlPx = (BX.bottom - BX.top - 6) / 200;
        const surface = BX.bottom - vol * mlPx;
        let out = '';
        // 스탠드: 받침, 막대, 클램프
        out += `<rect x="18" y="246" width="96" height="9" rx="2" fill="#7c8a93"/><rect x="34" y="14" width="6" height="234" rx="2" fill="#94a3ad"/>`;
        out += `<rect x="38" y="44" width="110" height="5" rx="2" fill="#94a3ad"/><rect x="140" y="38" width="22" height="16" rx="3" fill="#6b7a84"/>`;
        // 뷰렛: 눈금 있는 긴 유리관, 꼭지, 가는 끝
        const BU = { x0: 145, x1: 157, top: 8, bot: 118 };
        const left = 1 - addedML() / MAX_ML, liqTop = BU.top + 4 + (BU.bot - BU.top - 4) * (1 - left);
        out += `<rect x="${BU.x0}" y="${BU.top}" width="${BU.x1 - BU.x0}" height="${BU.bot - BU.top}" rx="2" fill="#f4f9fb" stroke="#7fa9b8" stroke-width="1.6"/>`;
        out += `<rect x="${BU.x0 + 1.5}" y="${liqTop.toFixed(1)}" width="${BU.x1 - BU.x0 - 3}" height="${(BU.bot - liqTop).toFixed(1)}" fill="#cfe8f6"/>`;
        for (let k = 0; k <= 10; k += 1) { const y = BU.top + 6 + k * (BU.bot - BU.top - 8) / 10; out += `<line x1="${BU.x0}" y1="${y.toFixed(1)}" x2="${BU.x0 + (k % 5 ? 4 : 7)}" y2="${y.toFixed(1)}" stroke="#56707c" stroke-width="1"/>`; }
        out += `<path d="M${BU.x0} ${BU.bot} L${BU.x0 + 4} ${BU.bot + 10} L${BU.x0 + 4} ${BU.bot + 22} L${BU.x0 + 5} ${BU.bot + 30} L${BU.x1 - 5} ${BU.bot + 30} L${BU.x1 - 4} ${BU.bot + 22} L${BU.x1 - 4} ${BU.bot + 10} L${BU.x1} ${BU.bot} Z" fill="#cfe8f6" stroke="#7fa9b8" stroke-width="1.4"/>`;
        // 꼭지: 넣는 동안은 손잡이가 관과 나란히(열림), 멈추면 가로(닫힘)
        const open = playing;
        out += `<circle cx="151" cy="${BU.bot + 15}" r="5" fill="#e2e8f0" stroke="#475569" stroke-width="1.4"/>`;
        out += open ? `<rect x="148.5" y="${BU.bot + 4}" width="5" height="22" rx="2" fill="#334155"/>` : `<rect x="138" y="${BU.bot + 12.5}" width="26" height="5" rx="2" fill="#334155"/>`;
        out += `<text class="beaker-note" x="${BU.x1 + 10}" y="${BU.top + 24}">NaOH</text>`;
        // 떨어지는 방울과 물결
        const tipY = BU.bot + 30;
        if (playing && !reduceMotion()) {
            for (let k = 0; k < 2; k += 1) {
                const ph = ((now / 420) + k * 0.5) % 1, y = tipY + 2 + (surface - tipY - 4) * ph * ph;
                out += `<path d="M151 ${(y - 5).toFixed(1)} C154 ${(y - 1).toFixed(1)} 155 ${(y + 2).toFixed(1)} 151 ${(y + 3.5).toFixed(1)} C147 ${(y + 2).toFixed(1)} 148 ${(y - 1).toFixed(1)} 151 ${(y - 5).toFixed(1)} Z" fill="#9fd3ee" stroke="#5b9fc4" stroke-width=".8"/>`;
                const rp = ((now / 420) + k * 0.5 + 0.5) % 1;
                out += `<ellipse cx="151" cy="${surface.toFixed(1)}" rx="${(3 + rp * 16).toFixed(1)}" ry="${(1 + rp * 3).toFixed(1)}" fill="none" stroke="#ffffff" stroke-width="1.4" opacity="${(0.9 * (1 - rp)).toFixed(2)}"/>`;
            }
        }
        // 비커: 입술, 눈금, 지시약 색의 용액
        out += `<rect class="solution" x="${BX.x0 + 2}" y="${surface.toFixed(1)}" width="${BX.x1 - BX.x0 - 4}" height="${(BX.bottom - surface - 2).toFixed(1)}" fill="${col.fill}"/>`;
        out += `<ellipse cx="${(BX.x0 + BX.x1) / 2}" cy="${surface.toFixed(1)}" rx="${(BX.x1 - BX.x0 - 4) / 2}" ry="2.5" fill="#ffffff" opacity=".45"/>`;
        for (let ml = 50; ml <= 200; ml += 50) { const y = BX.bottom - ml * mlPx; out += `<line x1="${BX.x0 + 2}" y1="${y.toFixed(1)}" x2="${BX.x0 + 12}" y2="${y.toFixed(1)}" stroke="#7fa9b8" stroke-width="1.2"/>`; }
        out += `<path d="M${BX.x0 - 6} ${BX.top - 4} Q${BX.x0} ${BX.top - 2} ${BX.x0} ${BX.top + 6} L${BX.x0} ${BX.bottom - 4} Q${BX.x0} ${BX.bottom} ${BX.x0 + 4} ${BX.bottom} L${BX.x1 - 4} ${BX.bottom} Q${BX.x1} ${BX.bottom} ${BX.x1} ${BX.bottom - 4} L${BX.x1} ${BX.top}" fill="none" stroke="#7fa9b8" stroke-width="3" stroke-linejoin="round"/>`;
        // 온도계: 비커 안에 비스듬히 기대어 끝이 용액에 잠김
        const tFrac = Math.max(0, Math.min(1, (a.temp - T0) / 12));
        const TA = [196, 112], TB = [178, 236], tl = Math.hypot(TB[0] - TA[0], TB[1] - TA[1]), ux = (TB[0] - TA[0]) / tl, uy = (TB[1] - TA[1]) / tl;
        const redLen = 18 + 60 * tFrac, rs = [TB[0] - ux * (8 + redLen), TB[1] - uy * (8 + redLen)];
        out += `<line x1="${TA[0]}" y1="${TA[1]}" x2="${TB[0]}" y2="${TB[1]}" stroke="#8aa3b0" stroke-width="9" stroke-linecap="round"/>`;
        out += `<line x1="${TA[0]}" y1="${TA[1]}" x2="${TB[0]}" y2="${TB[1]}" stroke="#f8fbfc" stroke-width="6" stroke-linecap="round"/>`;
        out += `<line x1="${(TB[0] - ux * 6).toFixed(1)}" y1="${(TB[1] - uy * 6).toFixed(1)}" x2="${rs[0].toFixed(1)}" y2="${rs[1].toFixed(1)}" stroke="#dc2626" stroke-width="2.6" stroke-linecap="round"/><circle cx="${TB[0]}" cy="${TB[1]}" r="5" fill="#dc2626"/>`;
        out += `<text class="temp-text" x="214" y="128">${a.temp.toFixed(2)} ℃</text>`;
        out += `<text class="beaker-note" x="${BX.x0 - 8}" y="${(surface + 5).toFixed(1)}" text-anchor="end">${vol.toFixed(0)} mL</text>`;
        out += `<text class="beaker-note" x="${(BX.x0 + BX.x1) / 2}" y="268" text-anchor="middle">${col.name}</text>`;
        // 확대 모형: 비커 속 용액을 크게 본 그림
        const pc = particleCounts(a);
        out += `<line x1="${BX.x1 - 30}" y1="${(BX.bottom - 14).toFixed(1)}" x2="296" y2="216" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="4 3"/><line x1="${BX.x1 - 30}" y1="${(BX.bottom - 14).toFixed(1)}" x2="312" y2="112" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="4 3"/><circle cx="${BX.x1 - 30}" cy="${BX.bottom - 14}" r="5" fill="none" stroke="#64748b" stroke-width="1.4"/>`;
        out += `<circle cx="368" cy="174" r="84" fill="${col.fill}" stroke="#64748b" stroke-width="2.4"/><circle cx="368" cy="174" r="84" fill="#ffffff" opacity=".55"/>`;
        out += `<text class="beaker-note" x="368" y="82" text-anchor="middle">확대 모형</text>`;
        const list = [...Array(pc.cl).fill('cl'), ...Array(pc.na).fill('na'), ...Array(pc.h).fill('h'), ...Array(pc.oh).fill('oh'), ...Array(pc.water).fill('w')];
        const wob = playing && !reduceMotion() ? now / 380 : 0;
        list.forEach((kind, i) => {
            const [sx, sy] = SLOTS[i % SLOTS.length], x = sx + Math.sin(wob + i * 1.7) * 2.2, y = sy + Math.cos(wob * 0.9 + i * 2.3) * 2.2;
            if (kind === 'w') {
                out += `<g><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7.5" fill="#ef6b5b" stroke="#9f2d22" stroke-width=".8"/><circle cx="${(x - 7).toFixed(1)}" cy="${(y + 5).toFixed(1)}" r="4.2" fill="#f1f5f9" stroke="#64748b" stroke-width=".8"/><circle cx="${(x + 7).toFixed(1)}" cy="${(y + 5).toFixed(1)}" r="4.2" fill="#f1f5f9" stroke="#64748b" stroke-width=".8"/></g>`;
                return;
            }
            const st = { h: ['#fecaca', '#b91c1c', 'H⁺'], cl: ['#bbf7d0', '#166534', 'Cl⁻'], na: ['#e9d5ff', '#6b21a8', 'Na⁺'], oh: ['#bfdbfe', '#1d4ed8', 'OH⁻'] }[kind];
            out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="11" fill="${st[0]}" stroke="${st[1]}" stroke-width="1.2"/><text class="ion-label" style="fill:${st[1]}" x="${x.toFixed(1)}" y="${(y + 4.5).toFixed(1)}" text-anchor="middle">${st[2]}</text>`;
        });
        window.scienceScene.render(beakerGroup, out);
    }

    function renderGraph(a) {
        let out = '';
        for (let p = 0; p <= 14; p += 2) {
            out += `<line class="grid-line" x1="${GRAPH.x0}" y1="${gyPH(p).toFixed(1)}" x2="${GRAPH.x1}" y2="${gyPH(p).toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${(gyPH(p) + 3).toFixed(1)}" text-anchor="end">${p}</text>`;
        }
        for (let v = 0; v <= MAX_ML; v += 30) {
            out += `<text class="axis-text" x="${gx(v).toFixed(1)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${v}</text>`;
        }
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        out += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        out += `<text class="axis-title" fill="#0f172a" x="${(GRAPH.x0 + GRAPH.x1) / 2}" y="${GRAPH.y0 + 30}" text-anchor="middle">넣은 수산화나트륨 (mL)</text>`;
        out += `<text class="axis-title" fill="#c79bff" x="${GRAPH.x0}" y="${GRAPH.y1 - 8}">pH</text>`;
        out += `<text class="axis-title" fill="#ea580c" x="${GRAPH.x1 + 4}" y="${GRAPH.y1 - 8}" text-anchor="end">온도 (점선)</text>`;

        // temperature is drawn on its own scale so both fit the same panel
        const tempAt = v => analyse(v).temp;
        let tMax = T0;
        for (let v = 0; v <= MAX_ML; v += 2) tMax = Math.max(tMax, tempAt(v));
        const tSpan = Math.max(1, tMax - T0);
        const gyT = t => GRAPH.y0 - ((t - T0) / (tSpan * 1.15)) * (GRAPH.y0 - GRAPH.y1);

        const phPts = [], tPts = [], upTo = addedML();
        for (let v = 0; v <= upTo; v += 1) {
            phPts.push(`${gx(v).toFixed(1)},${gyPH(analyse(v).pH).toFixed(1)}`);
            tPts.push(`${gx(v).toFixed(1)},${gyT(tempAt(v)).toFixed(1)}`);
        }
        phPts.push(`${gx(upTo).toFixed(1)},${gyPH(a.pH).toFixed(1)}`);
        tPts.push(`${gx(upTo).toFixed(1)},${gyT(a.temp).toFixed(1)}`);
        out += `<path class="temp-curve" d="M${tPts.join('L')}"/>`;
        out += `<path class="ph-curve" d="M${phPts.join('L')}"/>`;

        if (a.eqML <= MAX_ML && upTo >= a.eqML) {
            out += `<line class="eq-line" x1="${gx(a.eqML).toFixed(1)}" y1="${GRAPH.y1}" x2="${gx(a.eqML).toFixed(1)}" y2="${GRAPH.y0}"/>`;
            const flip = gx(a.eqML) > (GRAPH.x0 + GRAPH.x1) / 2;
            out += `<text class="eq-text" x="${(gx(a.eqML) + (flip ? -5 : 5)).toFixed(1)}" y="${GRAPH.y1 + 10}"${flip ? ' text-anchor="end"' : ''}>중화점 ${a.eqML.toFixed(1)} mL</text>`;
        }
        out += `<circle class="ph-dot" cx="${gx(addedML()).toFixed(1)}" cy="${gyPH(a.pH).toFixed(1)}" r="5"/>`;
        out += `<circle class="temp-dot" cx="${gx(addedML()).toFixed(1)}" cy="${gyT(a.temp).toFixed(1)}" r="4"/>`;
        window.scienceScene.render(graphGroup,out);
    }

    function render() {
        const a = analyse();
        renderBeaker(a);
        stageCaption.innerHTML = chem('오른쪽 원은 비커 속 용액을 크게 본 모형입니다. 넣은 OH⁻는 H⁺와 만나 물 분자가 되고, Na⁺와 Cl⁻는 반응하지 않고 남습니다.');
        renderGraph(a);
        acidConcOutput.textContent = `${acidC().toFixed(2)} mol/L`;
        baseConcOutput.textContent = `${baseC().toFixed(2)} mol/L`;
        volOutput.textContent = `${addedML().toFixed(0)} mL`;
        stageBadge.textContent = `${addedML().toFixed(0)} mL · pH ${a.pH.toFixed(2)}`;
        dataRows(a);
        if (!resultContent.hidden) showResult();
        return a;
    }

    function dataRows(a) {
        window.scienceScene.render(dataNote,chemHtml(`<div class="data-row"><span class="data-name">H⁺ 의 몰수</span><span class="data-val">${acidC().toFixed(2)} × 0.050 L = ${a.nH.toFixed(4)} mol</span></div>` +
            `<div class="data-row"><span class="data-name">OH⁻ 의 몰수</span><span class="data-val">${baseC().toFixed(2)} × ${(addedML() / 1000).toFixed(3)} L = ${a.nOH.toFixed(4)} mol</span></div>` +
            `<div class="data-row${a.state === 'neutral' ? ' match' : ''}"><span class="data-name">지금 상태</span>` +
            `<span class="data-val">${a.state === 'neutral' ? '두 몰수가 같아 중화점' : a.state === 'acid' ? `수소 이온(H⁺)이 ${(a.nH - a.nOH).toFixed(4)} mol 남아 산성` : `수산화 이온(OH⁻)이 ${(a.nOH - a.nH).toFixed(4)} mol 남아 염기성`}</span></div>`));
    }

    const chemHtml = html => html.replace(/>([^<]+)</g, (m, t) => '>' + chem(t) + '<');
    const clearResult = () => { resultEmpty.hidden = false; resultContent.hidden = true; };

    function showResult() {
        const a = analyse();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        valueA.textContent = a.pH.toFixed(2);
        const passed = addedML() >= Math.min(MAX_ML, a.eqML + 4) || (!playing && addedML() >= a.eqML);
        valueB.textContent = addedML() >= a.eqML ? `${a.eqML.toFixed(1)} mL` : '아직';
        if (!passed) {
            predictionResult.textContent = ''; predictionResult.hidden = true;
            explanation.innerHTML = chem(`지금 ${addedML().toFixed(0)} mL를 넣었습니다. 온도계와 그래프의 점을 계속 지켜보세요.`);
            return;
        }
        predictionResult.hidden = false;
        predictionResult.textContent = !prediction
            ? '다음에는 결과를 먼저 예상해 보세요.'
            : prediction === 'at' ? '예상이 맞았습니다.' : '예상과 다른 결과입니다. 온도는 중화점에서 가장 높습니다.';
        const peak = analyse(a.eqML).temp;
        explanation.innerHTML = chem(
            `H⁺ ${a.nH.toFixed(4)} mol과 OH⁻ ${a.nOH.toFixed(4)} mol이 1 : 1로 만나 물이 됩니다. ` +
            `두 몰수가 같아지는 ${a.eqML.toFixed(1)} mL가 중화점이고 이때 pH가 7이 됩니다. ` +
            `중화 반응은 열을 내므로 물이 가장 많이 만들어지는 중화점에서 온도가 ${peak.toFixed(2)} ℃로 가장 높고, ` +
            `그 뒤로는 물이 더 만들어지지 않는데 부피만 늘어나 오히려 온도가 내려갑니다.`);
    }

    function frame(now) {
        const t = now / 1000;
        const dt = lastT === null ? 1 / 60 : Math.min(1 / 20, t - lastT);
        lastT = t;
        if (playing) {
            animV = Math.min(MAX_ML, animV + dt * 24);
            volRange.value = String(Math.round(animV));
            render();
            if (animV >= MAX_ML) { playing = false; playBtn.textContent = '한 방울씩 넣기'; }
            rafId = playing ? requestAnimationFrame(frame) : null;
            if (!playing) lastT = null;
        } else { rafId = null; lastT = null; }
    }

    function stopPlayback() {
        playing = false;
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = null; lastT = null; animV = null;
        playBtn.textContent = '한 방울씩 넣기';
    }
    document.querySelectorAll('.control-panel input[type="range"]').forEach(el => el.addEventListener('input', stopPlayback, true));
    document.querySelectorAll('.control-panel button').forEach(el => {
        if (el !== playBtn && el !== resetBtn) el.addEventListener('click', stopPlayback, true);
    });

    playBtn.addEventListener('click', () => {
        playing = !playing;
        playBtn.textContent = playing ? '멈추기' : '한 방울씩 넣기';
        if (playing) {
            animV = Number(volRange.value);
            if (animV >= MAX_ML) animV = 0;
            showResult();
            if (rafId === null) { lastT = null; rafId = requestAnimationFrame(frame); }
        } else {
            volRange.value = String(Math.round(addedML()));
            animV = null;
            render();
        }
    });
    resetBtn.addEventListener('click', () => {
        playing = false; animV = null;
        if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; lastT = null; }
        playBtn.textContent = '한 방울씩 넣기';
        volRange.value = '0';
        clearResult();
        render();
    });
    indButtons.forEach(button => button.addEventListener('click', () => {
        indicator = button.dataset.ind;
        indButtons.forEach(item => item.classList.toggle('selected', item === button));
        render(); if (!resultContent.hidden) showResult();
    }));
    [acidConcRange, baseConcRange, volRange].forEach(el => el.addEventListener('input', () => {
        animV = null; render(); if (!resultContent.hidden) showResult();
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

    window.__neutModel = {
        ACID_ML, T0, KW, DH_NEUT, C_WATER, MAX_ML, analyse, indicatorColor,
        setAcid(c) { acidConcRange.value = String(c); acidConcRange.dispatchEvent(new Event('input')); },
        setBase(c) { baseConcRange.value = String(c); baseConcRange.dispatchEvent(new Event('input')); },
        setVol(v) { volRange.value = String(v); volRange.dispatchEvent(new Event('input')); },
        setIndicator(i) { document.querySelector(`[data-ind="${i}"]`).click(); },
        addedML, render,
    };

    resetBtn.click();
});
