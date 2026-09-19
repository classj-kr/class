document.addEventListener('DOMContentLoaded', () => {
    const modeButtons = [...document.querySelectorAll('[data-mode]')];
    const grainButtons = [...document.querySelectorAll('[data-grain]')];
    const predictionButtons = [...document.querySelectorAll('[data-prediction]')];
    const diffControls = document.getElementById('diffControls');
    const gasControls = document.getElementById('gasControls');
    const tempRange = document.getElementById('tempRange');
    const timeRange = document.getElementById('timeRange');
    const concRange = document.getElementById('concRange');
    const gasTimeRange = document.getElementById('gasTimeRange');
    const tempOutput = document.getElementById('tempOutput');
    const timeOutput = document.getElementById('timeOutput');
    const concOutput = document.getElementById('concOutput');
    const gasTimeOutput = document.getElementById('gasTimeOutput');
    const playBtn = document.getElementById('playBtn');
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

    // Molar masses in g/mol. Kinetic theory puts the mean molecular speed at
    // √(8RT/πM), so a gas's diffusion rate goes as √(T/M) — that single fact
    // gives both Graham's law and the temperature dependence below.
    const NH3 = { name: '암모니아', formula: 'NH₃', M: 17.0 };
    const HCL = { name: '염화수소', formula: 'HCl', M: 36.5 };
    const TUBE_CM = 40;
    const DIFF_C = 1.1453;              // tuned so they meet in about 5 s at 20 ℃

    // CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂
    const CACO3_G = 1.00, CACO3_M = 100.09;
    const HCL_VOL_L = 0.050;
    const MOLAR_VOL_ML = 22400;         // at STP
    const SURFACE = { lump: 1, chip: 3, powder: 8 };
    const GRAIN_NAME = { lump: '큰 덩어리', chip: '작은 조각', powder: '가루' };
    // 조사는 앞말의 받침에 따라 갈립니다. 받침이 없거나 ㄹ이면 '로', 그 밖에는 '으로'.
    const jong = w => { const c = String(w).trim().slice(-1).charCodeAt(0); return (c < 0xac00 || c > 0xd7a3) ? -1 : (c - 0xac00) % 28; };
    const ro = w => w + (jong(w) <= 0 || jong(w) === 8 ? '로' : '으로');
    const RATE_K = 0.012;

    const TUBE = { x0: 50, x1: 410, y: 66, h: 34 };
    const GRAPH = { x0: 54, x1: 428, y0: 142, y1: 20 };

    let mode = 'diff';
    let grain = 'lump';
    let prediction = null;
    let playing = false;
    let animT = null;
    let rafId = null, lastT = null;

    const tempK = () => Number(tempRange.value) + 273.15;
    const elapsed = () => (animT === null ? Number(timeRange.value) : animT);
    const conc = () => Number(concRange.value);
    const gasElapsed = () => (animT === null ? Number(gasTimeRange.value) : animT);

    const speed = (M, T) => DIFF_C * Math.sqrt(T / M);

    // Where the two fronts meet. Because both speeds carry the same √T, the
    // temperature cancels out of the ratio: raising it makes the ring appear
    // sooner but never moves it.
    function meetPoint() {
        const rNH3 = 1 / Math.sqrt(NH3.M), rHCL = 1 / Math.sqrt(HCL.M);
        const fromNH3 = (TUBE_CM * rNH3) / (rNH3 + rHCL);
        return { fromNH3, fromHCL: TUBE_CM - fromNH3, ratio: rNH3 / rHCL };
    }
    function meetTime(T) {
        const sum = speed(NH3.M, T) + speed(HCL.M, T);
        return TUBE_CM / sum;
    }
    function fronts(t, T) {
        const mp = meetPoint(), tm = meetTime(T);
        const capped = Math.min(t, tm);
        return {
            nh3: speed(NH3.M, T) * capped,
            hcl: speed(HCL.M, T) * capped,
            met: t >= tm, meetTime: tm, mp,
        };
    }

    // Stoichiometry decides the final volume; concentration and surface area
    // only decide how quickly it gets there.
    function gasModel() {
        const nCaCO3 = CACO3_G / CACO3_M;
        const nHCl = HCL_VOL_L * conc();
        const nFromAcid = nHCl / 2;
        const limiting = nFromAcid < nCaCO3 ? 'acid' : 'solid';
        const nCO2 = Math.min(nCaCO3, nFromAcid);
        const vMax = nCO2 * MOLAR_VOL_ML;
        const k = RATE_K * conc() * SURFACE[grain];
        return { nCaCO3, nHCl, nFromAcid, limiting, nCO2, vMax, k };
    }
    const gasVolume = (t, g) => g.vMax * (1 - Math.exp(-g.k * t));

    const gx = (v, lo, hi) => GRAPH.x0 + ((v - lo) / (hi - lo)) * (GRAPH.x1 - GRAPH.x0);
    const gy = (v, max) => GRAPH.y0 - (v / max) * (GRAPH.y0 - GRAPH.y1);
    const PX_PER_CM = (TUBE.x1 - TUBE.x0) / TUBE_CM;

    function renderDiff() {
        const T = tempK(), t = elapsed();
        const f = fronts(t, T);
        const nh3W = f.nh3 * PX_PER_CM, hclW = f.hcl * PX_PER_CM;
        let out = '';

        out += `<rect class="cloud-nh3" x="${TUBE.x0}" y="${TUBE.y}" width="${nh3W.toFixed(1)}" height="${TUBE.h}"/>`;
        out += `<rect class="cloud-hcl" x="${(TUBE.x1 - hclW).toFixed(1)}" y="${TUBE.y}" width="${hclW.toFixed(1)}" height="${TUBE.h}"/>`;
        out += `<rect class="tube" x="${TUBE.x0}" y="${TUBE.y}" width="${TUBE.x1 - TUBE.x0}" height="${TUBE.h}" rx="4"/>`;
        out += `<rect class="cotton" x="${TUBE.x0 - 12}" y="${TUBE.y + 4}" width="12" height="${TUBE.h - 8}" rx="3"/>`;
        out += `<rect class="cotton" x="${TUBE.x1}" y="${TUBE.y + 4}" width="12" height="${TUBE.h - 8}" rx="3"/>`;
        out += `<text class="end-label" fill="#78dcbe" x="${TUBE.x0 - 14}" y="${TUBE.y - 8}">${NH3.name}</text>`;
        out += `<text class="end-label" fill="#ffbe78" x="${TUBE.x1 + 12}" y="${TUBE.y - 8}" text-anchor="end">${HCL.name}</text>`;

        for (let cm = 0; cm <= TUBE_CM; cm += 5) {
            const x = TUBE.x0 + cm * PX_PER_CM;
            out += `<line class="tick" x1="${x.toFixed(1)}" y1="${TUBE.y + TUBE.h}" x2="${x.toFixed(1)}" y2="${TUBE.y + TUBE.h + 6}"/>`;
            out += `<text class="tick-text" x="${x.toFixed(1)}" y="${TUBE.y + TUBE.h + 17}" text-anchor="middle">${cm}</text>`;
        }
        // where the ring will be, marked from the start so the prediction is testable
        const ringX = TUBE.x0 + f.mp.fromNH3 * PX_PER_CM;
        out += `<line class="meet-marker" x1="${ringX.toFixed(1)}" y1="${TUBE.y - 4}" x2="${ringX.toFixed(1)}" y2="${TUBE.y + TUBE.h + 4}"/>`;
        if (f.met) {
            out += `<rect class="ring-glow" x="${(ringX - 9).toFixed(1)}" y="${TUBE.y}" width="18" height="${TUBE.h}"/>`;
            out += `<rect class="ring" x="${(ringX - 4).toFixed(1)}" y="${TUBE.y}" width="8" height="${TUBE.h}"/>`;
            out += `<text class="ring-text" x="${ringX.toFixed(1)}" y="${TUBE.y - 20}" text-anchor="middle">흰 고리 ${f.mp.fromNH3.toFixed(1)} cm</text>`;
        }
        out += `<text class="tick-text" x="230" y="${TUBE.y + TUBE.h + 40}" text-anchor="middle">암모니아 끝에서의 거리 (cm)</text>`;
        out += `<text class="axis-title" x="230" y="${TUBE.y + TUBE.h + 62}" text-anchor="middle">${f.met ? `${f.meetTime.toFixed(2)} 초에 만났습니다` : `만나는 예상 시각 ${f.meetTime.toFixed(2)} 초`}</text>`;
        mainGroup.innerHTML = out;

        // distance travelled against time for both gases
        const tMax = 8;
        let g = '';
        for (let k = 0; k <= 4; k += 1) {
            const y = GRAPH.y0 - (k / 4) * (GRAPH.y0 - GRAPH.y1);
            g += `<line class="grid-line" x1="${GRAPH.x0}" y1="${y}" x2="${GRAPH.x1}" y2="${y}"/>`;
            g += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${y + 3}" text-anchor="end">${(TUBE_CM * k / 4).toFixed(0)}</text>`;
        }
        for (let s = 0; s <= tMax; s += 2) {
            g += `<text class="axis-text" x="${gx(s, 0, tMax)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${s}</text>`;
        }
        g += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        g += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        g += `<text class="axis-title" x="${(GRAPH.x0 + GRAPH.x1) / 2}" y="${GRAPH.y0 + 30}" text-anchor="middle">시간 (초)</text>`;
        g += `<text class="axis-title" x="${GRAPH.x0}" y="${GRAPH.y1 - 4}">이동 거리 (cm)</text>`;
        [[NH3, '#78dcbe'], [HCL, '#ffbe78']].forEach(([gas, col]) => {
            const pts = [];
            for (let k = 0; k <= 80; k += 1) {
                const tt = (tMax * k) / 80;
                const d = speed(gas.M, T) * Math.min(tt, f.meetTime);
                pts.push(`${gx(tt, 0, tMax).toFixed(1)},${gy(d, TUBE_CM).toFixed(1)}`);
            }
            g += `<path class="trace" style="stroke:${col}" d="M${pts.join('L')}"/>`;
            const d = speed(gas.M, T) * Math.min(t, f.meetTime);
            g += `<circle class="trace-dot" cx="${gx(t, 0, tMax).toFixed(1)}" cy="${gy(d, TUBE_CM).toFixed(1)}" r="4" fill="${col}"/>`;
        });
        g += `<line class="limit-line" x1="${gx(f.meetTime, 0, tMax).toFixed(1)}" y1="${GRAPH.y0}" x2="${gx(f.meetTime, 0, tMax).toFixed(1)}" y2="${GRAPH.y1}"/>`;
        graphGroup.innerHTML = g;

        const mp = f.mp;
        dataNote.innerHTML =
            `<div class="data-row"><span class="data-name">이동 거리</span><span class="data-val">${NH3.name} ${f.nh3.toFixed(1)} cm · ${HCL.name} ${f.hcl.toFixed(1)} cm</span></div>` +
            `<div class="data-row"><span class="data-name">고리 위치</span><span class="data-val">암모니아 끝에서 ${mp.fromNH3.toFixed(2)} cm (온도와 무관)</span></div>`;

        stageBadge.textContent = `${t.toFixed(1)} 초`;
        tempOutput.textContent = `${Number(tempRange.value)} ℃`;
        timeOutput.textContent = `${t.toFixed(1)} 초`;
    }

    function renderGas() {
        const g0 = gasModel(), t = gasElapsed();
        const v = gasVolume(t, g0);
        const V_SCALE = 250;
        let out = '';
        // flask with acid and the carbonate
        out += `<path class="flask" d="M150,66 L150,96 L120,168 Q114,186 132,186 L188,186 Q206,186 200,168 L170,96 L170,66 Z"/>`;
        out += `<path class="acid" d="M126,150 L194,150 Q200,168 188,180 L132,180 Q120,168 126,150 Z"/>`;
        const chips = grain === 'lump' ? 1 : grain === 'chip' ? 4 : 12;
        for (let i = 0; i < chips; i += 1) {
            const r = grain === 'lump' ? 9 : grain === 'chip' ? 5 : 2.6;
            const cx = 138 + ((i * 37) % 44);
            const cy = 168 + ((i * 13) % 10);
            out += `<circle class="chip" cx="${cx}" cy="${cy}" r="${r}"/>`;
        }
        if (v > 0.5 && v < g0.vMax - 0.5) {
            for (let i = 0; i < 6; i += 1) {
                const bx = 134 + ((i * 23) % 52);
                const by = 108 + ((i * 17) % 40);
                out += `<circle class="bubble" cx="${bx}" cy="${by}" r="${2 + (i % 3)}">` +
                       `<animate attributeName="cy" from="${by}" to="102" dur="1.3s" begin="${(i * 0.18).toFixed(2)}s" repeatCount="indefinite"/>` +
                       `<animate attributeName="opacity" values="0;.8;0" dur="1.3s" begin="${(i * 0.18).toFixed(2)}s" repeatCount="indefinite"/></circle>`;
            }
        }
        // delivery tube to a syringe that reads the gas volume
        out += `<path class="tube" fill="none" d="M160,66 L160,44 L286,44 L286,62"/>`;
        const SY = { x0: 262, x1: 322, top: 62, bot: 196 };
        const gasH = (v / V_SCALE) * (SY.bot - SY.top - 12);
        out += `<rect class="syringe-gas" x="${SY.x0 + 3}" y="${(SY.bot - gasH).toFixed(1)}" width="${SY.x1 - SY.x0 - 6}" height="${gasH.toFixed(1)}"/>`;
        out += `<rect class="syringe-plunger" x="${SY.x0 - 3}" y="${(SY.bot - gasH - 11).toFixed(1)}" width="${SY.x1 - SY.x0 + 6}" height="11" rx="3"/>`;
        out += `<path class="syringe" fill="none" d="M${SY.x0},${SY.top} L${SY.x0},${SY.bot} L${SY.x1},${SY.bot} L${SY.x1},${SY.top}"/>`;
        out += `<text class="vol-text" x="${SY.x1 + 10}" y="${(SY.bot - gasH + 4).toFixed(1)}">${v.toFixed(1)} mL</text>`;
        out += `<text class="tick-text" x="${(SY.x0 + SY.x1) / 2}" y="${SY.bot + 16}" text-anchor="middle">모인 이산화탄소</text>`;
        out += `<text class="tick-text" x="160" y="204" text-anchor="middle">${GRAIN_NAME[grain]} · 염산 ${conc().toFixed(1)} mol/L</text>`;
        mainGroup.innerHTML = out;

        const tMax = 120, vScale = 250;
        let g = '';
        for (let k = 0; k <= 5; k += 1) {
            const y = GRAPH.y0 - (k / 5) * (GRAPH.y0 - GRAPH.y1);
            g += `<line class="grid-line" x1="${GRAPH.x0}" y1="${y}" x2="${GRAPH.x1}" y2="${y}"/>`;
            g += `<text class="axis-text" x="${GRAPH.x0 - 6}" y="${y + 3}" text-anchor="end">${(vScale * k / 5).toFixed(0)}</text>`;
        }
        for (let s = 0; s <= tMax; s += 30) {
            g += `<text class="axis-text" x="${gx(s, 0, tMax)}" y="${GRAPH.y0 + 14}" text-anchor="middle">${s}</text>`;
        }
        g += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x1}" y2="${GRAPH.y0}"/>`;
        g += `<line class="axis" x1="${GRAPH.x0}" y1="${GRAPH.y0}" x2="${GRAPH.x0}" y2="${GRAPH.y1}"/>`;
        g += `<text class="axis-title" x="${(GRAPH.x0 + GRAPH.x1) / 2}" y="${GRAPH.y0 + 30}" text-anchor="middle">시간 (초)</text>`;
        g += `<text class="axis-title" x="${GRAPH.x0}" y="${GRAPH.y1 - 4}">기체 부피 (mL)</text>`;
        g += `<line class="limit-line" x1="${GRAPH.x0}" y1="${gy(g0.vMax, vScale).toFixed(1)}" x2="${GRAPH.x1}" y2="${gy(g0.vMax, vScale).toFixed(1)}"/>`;
        g += `<text class="axis-text" x="${GRAPH.x1 - 4}" y="${(gy(g0.vMax, vScale) - 5).toFixed(1)}" text-anchor="end" style="fill:#d97706">최대 ${g0.vMax.toFixed(0)} mL</text>`;
        // all three surface areas share the same ceiling and differ only in rate
        Object.entries(SURFACE).forEach(([key, factor]) => {
            const kk = RATE_K * conc() * factor;
            const pts = [];
            for (let i = 0; i <= 90; i += 1) {
                const tt = (tMax * i) / 90;
                pts.push(`${gx(tt, 0, tMax).toFixed(1)},${gy(g0.vMax * (1 - Math.exp(-kk * tt)), vScale).toFixed(1)}`);
            }
            const col = key === 'powder' ? '#059669' : key === 'chip' ? '#0284c7' : '#9aa4ab';
            g += `<path class="trace" style="stroke:${col};opacity:${key === grain ? 1 : 0.42}" d="M${pts.join('L')}"/>`;
        });
        g += `<circle class="trace-dot" cx="${gx(t, 0, tMax).toFixed(1)}" cy="${gy(v, vScale).toFixed(1)}" r="4.5" fill="#d97706"/>`;
        graphGroup.innerHTML = g;

        dataNote.innerHTML =
            `<div class="data-row"><span class="data-name">탄산칼슘</span><span class="data-val">${CACO3_G.toFixed(2)} g ÷ ${CACO3_M} = ${g0.nCaCO3.toFixed(5)} mol</span></div>` +
            `<div class="data-row"><span class="data-name">염산</span><span class="data-val">${(HCL_VOL_L * 1000).toFixed(0)} mL × ${conc().toFixed(1)} = ${g0.nHCl.toFixed(4)} mol → CO₂ ${g0.nFromAcid.toFixed(5)} mol</span></div>` +
            `<div class="data-row match"><span class="data-name">한계 반응물</span><span class="data-val">${g0.limiting === 'acid' ? '염산' : '탄산칼슘'} → 최대 ${g0.vMax.toFixed(1)} mL</span></div>`;

        stageBadge.textContent = `${t.toFixed(0)} 초 · ${v.toFixed(0)} mL`;
        concOutput.textContent = `${conc().toFixed(2)} mol/L`;
        gasTimeOutput.textContent = `${t.toFixed(0)} 초`;
    }

    const render = () => (mode === 'diff' ? renderDiff() : renderGas());
    const clearResult = () => { resultEmpty.hidden = false; resultContent.hidden = true; };

    function showResult() {
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        if (mode === 'diff') {
            const T = tempK(), t = elapsed();
            const f = fronts(t, T);
            const grahamRatio = Math.sqrt(HCL.M / NH3.M);
            labelA.textContent = '고리 위치';
            labelB.textContent = '이동 비교';
            valueA.textContent = `${f.mp.fromNH3.toFixed(1)} cm`;
            valueB.textContent = "암모니아가 더 멀리";
            const actual = f.mp.fromNH3 > TUBE_CM / 2 + 0.01 ? 'hcl'
                         : f.mp.fromNH3 < TUBE_CM / 2 - 0.01 ? 'nh3' : 'center';
            predictionResult.textContent = !prediction
                ? '다음에는 결과를 먼저 예상해 보세요.'
                : prediction === actual ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
            explanation.textContent = "직접 섞지 않아도 입자가 스스로 움직여 퍼집니다. 이 모형에서는 암모니아가 더 멀리 이동하므로 염화수소 쪽에서 흰 고리가 생깁니다. 시간·경계는 단순화한 예시이며 실제 측정값이 아닙니다.";
        } else {
            const g0 = gasModel(), t = gasElapsed();
            const v = gasVolume(t, g0);
            labelA.textContent = '모인 기체';
            labelB.textContent = '최대 부피';
            valueA.textContent = `${v.toFixed(1)} mL`;
            valueB.textContent = `${g0.vMax.toFixed(1)} mL`;
            predictionResult.textContent = `한계 반응물은 ${g0.limiting === 'acid' ? '염산' : '탄산칼슘'}입니다.`;
            explanation.textContent =
                `CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂ 에서 탄산칼슘 ${g0.nCaCO3.toFixed(4)} mol과 염산 ${g0.nHCl.toFixed(4)} mol 중 ` +
                `${g0.limiting === 'acid' ? '염산이 부족해 CO₂가 ' + g0.nCO2.toFixed(5) + ' mol 까지만' : '탄산칼슘이 먼저 다 써서 CO₂가 ' + g0.nCO2.toFixed(5) + ' mol 까지만'} 생깁니다. ` +
                `${ro(GRAIN_NAME[grain])} 만들면 표면적이 ${SURFACE[grain]}배가 되어 반응이 그만큼 빨라지지만, 최대 부피 ${g0.vMax.toFixed(1)} mL는 달라지지 않습니다.`;
        }
    }

    function frame(now) {
        const tt = now / 1000;
        const dt = lastT === null ? 1 / 60 : Math.min(1 / 20, tt - lastT);
        lastT = tt;
        if (playing) {
            const max = mode === 'diff' ? 8 : 120;
            const rate = mode === 'diff' ? 1 : 20;
            animT = Math.min(max, animT + dt * rate);
            (mode === 'diff' ? timeRange : gasTimeRange).value = String(mode === 'diff' ? animT.toFixed(1) : Math.round(animT));
            render();
            if (animT >= max) { playing = false; playBtn.textContent = '시간 흘려보내기'; }
            rafId = playing ? requestAnimationFrame(frame) : null;
            if (!playing) lastT = null;
        } else { rafId = null; lastT = null; }
    }

    playBtn.addEventListener('click', () => {
        playing = !playing;
        playBtn.textContent = playing ? '멈추기' : '시간 흘려보내기';
        if (playing) {
            animT = mode === 'diff' ? Number(timeRange.value) : Number(gasTimeRange.value);
            const max = mode === 'diff' ? 8 : 120;
            if (animT >= max) animT = 0;
            showResult();
            if (rafId === null) { lastT = null; rafId = requestAnimationFrame(frame); }
        } else {
            if (mode === 'diff') timeRange.value = String(elapsed().toFixed(1));
            else gasTimeRange.value = String(Math.round(gasElapsed()));
            animT = null;
            render();
        }
    });

    resetBtn.addEventListener('click', () => {
        playing = false; animT = null;
        if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; lastT = null; }
        playBtn.textContent = '시간 흘려보내기';
        timeRange.value = '0';
        gasTimeRange.value = '0';
        clearResult();
        stageCaption.textContent = mode === 'diff'
            ? '두 기체가 동시에 퍼져 나가 만나는 곳에 흰 고리가 생깁니다.'
            : '농도와 표면적을 바꾸며 기체가 모이는 속도를 비교해 보세요.';
        render();
    });

    modeButtons.forEach(button => button.addEventListener('click', () => {
        mode = button.dataset.mode;
        modeButtons.forEach(item => item.classList.toggle('selected', item === button));
        diffControls.hidden = mode !== 'diff';
        gasControls.hidden = mode !== 'gas';
        resetBtn.click();
    }));
    grainButtons.forEach(button => button.addEventListener('click', () => {
        grain = button.dataset.grain;
        grainButtons.forEach(item => item.classList.toggle('selected', item === button));
        animT = null; render();
        if (!resultContent.hidden) showResult();
    }));
    [tempRange, timeRange, concRange, gasTimeRange].forEach(el => el.addEventListener('input', () => {
        animT = null; render();
        if (!resultContent.hidden) showResult();
    }));
    predictionButtons.forEach(button => button.addEventListener('click', () => {
        prediction = button.dataset.prediction;
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

    window.__diffModel = {
        NH3, HCL, TUBE_CM, SURFACE, CACO3_G, CACO3_M, HCL_VOL_L, MOLAR_VOL_ML,
        speed, meetPoint, meetTime, fronts, gasModel, gasVolume,
        setMode(m) { document.querySelector(`[data-mode="${m}"]`).click(); },
        setGrain(gr) { document.querySelector(`[data-grain="${gr}"]`).click(); },
        // These fire a real input event so they follow exactly the same path as
        // dragging the slider — otherwise the result panel would keep stale
        // numbers and look like a bug that isn't there.
        setTemp(c) { tempRange.value = String(c); tempRange.dispatchEvent(new Event('input')); },
        setTime(t) { timeRange.value = String(t); timeRange.dispatchEvent(new Event('input')); },
        setConc(c) { concRange.value = String(c); concRange.dispatchEvent(new Event('input')); },
        setGasTime(t) { gasTimeRange.value = String(t); gasTimeRange.dispatchEvent(new Event('input')); },
        tempK, elapsed, conc, gasElapsed, render,
    };

    resetBtn.click();
});
