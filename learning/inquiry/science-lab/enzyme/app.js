'use strict';

/* Michaelis-Menten kinetics with the three things that push it around:
   temperature, pH, and two kinds of inhibitor. Heat damage is kept as state
   rather than recomputed, because a cooked enzyme stays cooked - turning the
   dial back down must not bring it back to life. */

const VMAX_REF = 100;   // μmol per minute per mg, at 37 ℃ and the best pH
const Q10 = 2;
const S_DENAT = 1.8;    // ℃, how sharply the unfolding sets in
const IKI = 2;          // inhibitor concentration in units of its Ki
const S_MAX = 20;       // mmol/L on the dial

const ENZYMES = {
    pepsin: { name: '펩신', where: '위', km: 2.0, phOpt: 2.0, phW: 1.3, tm: 48, job: '단백질을 잘게 자릅니다' },
    trypsin: { name: '트립신', where: '작은창자', km: 1.0, phOpt: 8.0, phW: 1.3, tm: 46, job: '이자액을 타고 나와 단백질을 더 잘게 자릅니다' },
    amylase: { name: '아밀레이스', where: '침', km: 4.0, phOpt: 6.8, phW: 1.5, tm: 49, job: '녹말을 엿당으로 바꿉니다' },
};

function kcatAt(t) { return Math.pow(Q10, (t - 37) / 10); }
function survivalAt(t, tm) { return 1 / (1 + Math.exp((t - tm) / S_DENAT)); }
function phFactor(ph, e) { return Math.exp(-Math.pow((ph - e.phOpt) / e.phW, 2)); }

const state = {
    enzyme: 'pepsin', temp: 37, ph: 2, inhib: 'none', sub: 4,
    alive: 1,                 // fraction of enzyme that has not been cooked
    prediction: null, checked: false,
    running: false, sweep: 0, trail: [], cyclePos: 0, phase: 0,
};

const $ = id => document.getElementById(id);
const svgNS = 'http://www.w3.org/2000/svg';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = (v, d) => v.toFixed(d).replace('-', '−');

function enz() { return ENZYMES[state.enzyme]; }
function vmaxClean() { return VMAX_REF * kcatAt(state.temp) * phFactor(state.ph, enz()) * state.alive; }
function vmaxEff() { return state.inhib === 'non' ? vmaxClean() / (1 + IKI) : vmaxClean(); }
function kmEff() { return state.inhib === 'comp' ? enz().km * (1 + IKI) : enz().km; }
function rateAt(S) { const k = kmEff(); return vmaxEff() * S / (k + S); }
function rateClean(S) { return vmaxClean() * S / (enz().km + S); }

// Fraction of turnovers the inhibitor steals. For the competitive one this
// falls as substrate piles up, which is exactly why Vmax survives.
function blockedFraction(S) {
    if (state.inhib === 'comp') return IKI / (1 + S / enz().km + IKI);
    if (state.inhib === 'non') return IKI / (1 + IKI);
    return 0;
}
function isBlocked(n) {
    const f = blockedFraction(state.sub);
    if (f <= 0) return false;
    return ((n * f) % 1) < f - 1e-9 || f >= 1;
}

// 아밀레이스는, 펩신은 — the particle depends on the final consonant.
function eun(w) {
    const ch = w.charCodeAt(w.length - 1);
    const jong = ch >= 0xac00 && ch <= 0xd7a3 && (ch - 0xac00) % 28 !== 0;
    return w + (jong ? '은' : '는');
}
// Numbers are read aloud, so the particle follows the last digit's sound:
// 0·1·3·6·7·8 end in a consonant, and of those only 0·3·6 take으로 because
// ㄹ (일·칠·팔) takes plain로.
const JONG = '013678';
const EUIRO = '036';
const lastCh = s => s[s.length - 1];
function numEun(s) { return s + (JONG.includes(lastCh(s)) ? '은' : '는'); }
function numGwa(s) { return s + (JONG.includes(lastCh(s)) ? '과' : '와'); }
function numRo(s) { return s + (EUIRO.includes(lastCh(s)) ? '으로' : '로'); }

function verdict() { return state.inhib === 'comp' ? 'p1' : (state.inhib === 'non' ? 'p2' : 'p3'); }

function analyse() {
    return {
        v: rateAt(state.sub), vmax: vmaxEff(), km: kmEff(),
        vmaxClean: vmaxClean(), kmClean: enz().km,
        kcat: kcatAt(state.temp), ph: phFactor(state.ph, enz()),
        alive: state.alive, blocked: blockedFraction(state.sub),
        verdict: verdict(),
    };
}

function el(tag, attrs, text) {
    const n = document.createElementNS(svgNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text !== undefined) n.textContent = text;
    return n;
}

const S_SLOTS = [[34, 52], [68, 46], [102, 54], [36, 82], [70, 78], [30, 112], [34, 142], [40, 172]];
const P_SLOTS = [[268, 52], [300, 44], [272, 84], [304, 74], [276, 116], [308, 106], [280, 148], [312, 138]];
const SITE = [150, 107];

const BODY_OK = 'M 90 172 Q 74 124 100 98 L 134 98 L 150 116 L 166 98 L 200 98 Q 226 124 210 172 Q 150 190 90 172 Z';
const BODY_BENT = 'M 90 172 Q 74 124 100 98 L 130 98 L 152 106 L 170 100 L 200 98 Q 226 124 210 172 Q 150 190 90 172 Z';
const BODY_DEAD = 'M 88 170 Q 68 130 96 104 Q 118 92 136 106 Q 150 120 166 104 Q 192 90 208 112 Q 226 142 208 172 Q 150 192 88 170 Z';

function wedge(cx, cy, cls, scale = 1) {
    const w = 16 * scale, h = 9 * scale;
    return el('path', { d: `M ${cx - w} ${cy - h} L ${cx + w} ${cy - h} L ${cx} ${cy + h} Z`, class: cls });
}

function drawStage(g) {
    const a = analyse();
    const dead = a.alive < 0.02;
    const bent = state.inhib === 'non';

    g.appendChild(el('path', { d: dead ? BODY_DEAD : (bent ? BODY_BENT : BODY_OK), class: `enzyme-body${dead ? ' cooked' : ''}` }));
    // Name and heat damage share one line; as two they collided.
    const hurt = dead ? '단백질이 풀려 되돌아오지 않습니다'
        : (a.alive < 0.98 ? `${Math.round((1 - a.alive) * 100)}%가 이미 익었습니다` : '');
    g.appendChild(el('text', {
        x: 168, y: 204, 'text-anchor': 'middle', class: hurt ? 'warn-text' : 'part-label',
    }, hurt ? `${dead ? '익어 버린 효소' : enz().name} — ${hurt}` : `효소 · ${enz().name}`));

    // Free substrate, as many blobs as the dial is worth.
    const pool = clamp(Math.round(state.sub / 2.6), 0, 8);
    for (let i = 0; i < pool; i += 1) {
        const [sx, sy] = S_SLOTS[i];
        g.appendChild(wedge(sx + Math.sin(state.phase * 1.3 + i) * 2.5, sy + Math.cos(state.phase + i * 2) * 2.5, 'substrate', 0.62));
    }
    g.appendChild(el('text', { x: 150, y: 26, 'text-anchor': 'middle', class: 'small-label' }, `기질 ${fmt(state.sub, 1)} mmol/L`));
    g.appendChild(el('text', { x: 300, y: 26, 'text-anchor': 'middle', class: 'small-label' }, '생성물'));

    const n = Math.floor(state.cyclePos), c = state.cyclePos - n;
    const blocked = isBlocked(n);

    if (!dead && a.v > 0.02) {
        if (blocked && state.inhib === 'comp') {
            // The inhibitor looks like the substrate, so it fits the same slot.
            if (c < 0.35) {
                const p = c / 0.35;
                g.appendChild(wedge(34 + (SITE[0] - 34) * p, 52 + (SITE[1] - 52) * p, 'inhibitor', 0.9));
            } else if (c < 0.8) {
                g.appendChild(wedge(SITE[0], SITE[1], 'inhibitor', 0.9));
            } else {
                const p = (c - 0.8) / 0.2;
                g.appendChild(wedge(SITE[0] - 60 * p, SITE[1] - 40 * p, 'inhibitor', 0.9));
            }
        } else if (blocked) {
            // Bounced off a mouth that no longer matches.
            const p = c < 0.5 ? c / 0.5 : (1 - c) / 0.5;
            g.appendChild(wedge(34 + (SITE[0] - 34) * p * 0.8, 52 + (SITE[1] - 52) * p * 0.8, 'substrate', 0.9));
        } else if (c < 0.35) {
            const p = c / 0.35;
            g.appendChild(wedge(34 + (SITE[0] - 34) * p, 52 + (SITE[1] - 52) * p, 'substrate', 0.9));
        } else if (c < 0.6) {
            g.appendChild(wedge(SITE[0], SITE[1] + Math.sin(state.phase * 14) * 1.2, 'substrate', 0.9));
        } else {
            const p = c < 0.72 ? (c - 0.6) / 0.12 * 0.18 : 0.18 + (c - 0.72) / 0.28 * 0.82;
            const halves = [[268, 52], [300, 44]];
            halves.forEach(([tx, ty], i) => {
                const px = SITE[0] + (tx - SITE[0]) * p + (i ? 9 : -9) * Math.min(1, p * 5);
                const py = SITE[1] + (ty - SITE[1]) * p;
                g.appendChild(el('path', {
                    d: i ? `M ${px} ${py - 8} L ${px + 14} ${py - 8} L ${px} ${py + 8} Z`
                        : `M ${px - 14} ${py - 8} L ${px} ${py - 8} L ${px} ${py + 8} Z`,
                    class: 'product',
                }));
            });
        }
    }

    if (state.inhib === 'non' && !dead) {
        g.appendChild(el('circle', { cx: 196, cy: 152, r: 9, class: 'inhibitor' }));
        g.appendChild(el('text', { x: 196, y: 174, 'text-anchor': 'middle', class: 'small-label', style: 'fill:#ff9d9d' }, '다른 자리'));
    }

    // Settled products, standing in for what has already been let go.
    const made = clamp(Math.round(a.v / 14), 0, 8);
    for (let i = 0; i < made; i += 1) {
        const [px, py] = P_SLOTS[i];
        g.appendChild(el('path', { d: `M ${px - 12} ${py - 7} L ${px + 12} ${py - 7} L ${px} ${py + 7} Z`, class: 'product' }));
    }

    // Rate meter, always against the same 100 so settings can be compared.
    const mx = 400, mTop = 46, mBot = 190;
    g.appendChild(el('rect', { x: mx, y: mTop, width: 30, height: mBot - mTop, rx: 5, class: 'meter-frame' }));
    const h = (clamp(a.v, 0, 115) / 115) * (mBot - mTop);
    g.appendChild(el('rect', { x: mx + 2, y: mBot - h, width: 26, height: h, rx: 4, class: 'meter-fill', style: `fill:${dead ? 'rgba(125,139,144,.5)' : 'rgba(84,230,193,.5)'}` }));
    const y100 = mBot - (100 / 115) * (mBot - mTop);
    g.appendChild(el('line', { x1: mx - 4, y1: y100, x2: mx + 34, y2: y100, class: 'meter-tick' }));
    g.appendChild(el('text', { x: 415, y: 38, 'text-anchor': 'middle', class: 'small-label' }, '속도'));
    g.appendChild(el('text', { x: 415, y: 204, 'text-anchor': 'middle', class: 'small-label' }, '표준 100'));

    g.appendChild(el('text', { x: 22, y: 26, class: 'read-text' }, `속도 ${fmt(a.v, 1)}`));
    g.appendChild(el('text', { x: 22, y: 42, class: 'small-label' }, `${state.temp} ℃ · pH ${state.ph}`));
}

function drawGraph(g) {
    const x0 = 54, x1 = 440, yTop = 26, yBot = 146, VTOP = 115;
    const X = S => x0 + (S / S_MAX) * (x1 - x0);
    const Y = v => yBot - (clamp(v, 0, VTOP) / VTOP) * (yBot - yTop);

    for (let v = 0; v <= 100; v += 25) {
        g.appendChild(el('line', { x1: x0, y1: Y(v), x2: x1, y2: Y(v), class: 'grid-line' }));
        if (v > 0) g.appendChild(el('text', { x: x0 - 6, y: Y(v) + 3.5, 'text-anchor': 'end', class: 'axis-text' }, String(v)));
    }
    g.appendChild(el('line', { x1: x0, y1: yBot, x2: x1, y2: yBot, class: 'axis' }));
    g.appendChild(el('line', { x1: x0, y1: yTop, x2: x0, y2: yBot, class: 'axis' }));
    for (let S = 0; S <= S_MAX; S += 5) {
        g.appendChild(el('line', { x1: X(S), y1: yBot, x2: X(S), y2: yBot + 4, class: 'axis' }));
        g.appendChild(el('text', { x: X(S), y: yBot + 15, 'text-anchor': 'middle', class: 'axis-text' }, String(S)));
    }

    const e = enz();
    let dr = '', dn = '';
    for (let i = 0; i <= 160; i += 1) {
        const S = (i / 160) * S_MAX;
        dr += `${i ? 'L' : 'M'} ${fmt(X(S), 2)} ${fmt(Y(VMAX_REF * S / (e.km + S)), 2)} `;
        dn += `${i ? 'L' : 'M'} ${fmt(X(S), 2)} ${fmt(Y(rateAt(S)), 2)} `;
    }
    g.appendChild(el('path', { d: dr, class: 'ref-line' }));

    state.trail.forEach(([S, v]) => g.appendChild(el('circle', { cx: X(S), cy: Y(v), r: 2.6, class: 'trail-dot' })));
    g.appendChild(el('path', { d: dn, class: 'now-line' }));

    const vm = vmaxEff(), km = kmEff();
    g.appendChild(el('line', { x1: x0, y1: Y(vm), x2: x1, y2: Y(vm), class: 'mark-line' }));
    g.appendChild(el('text', { x: x1 - 2, y: Y(vm) - 5, 'text-anchor': 'end', class: 'axis-text' }, `Vmax ${fmt(vm, 1)}`));
    if (vm > 1) {
        g.appendChild(el('line', { x1: x0, y1: Y(vm / 2), x2: X(km), y2: Y(vm / 2), class: 'mark-line' }));
        g.appendChild(el('line', { x1: X(km), y1: Y(vm / 2), x2: X(km), y2: yBot, class: 'mark-line' }));
        g.appendChild(el('text', { x: X(km) + 4, y: yBot - 6, class: 'axis-text' }, `Km ${fmt(km, 1)}`));
    }
    g.appendChild(el('circle', { cx: X(state.sub), cy: Y(rateAt(state.sub)), r: 5, class: 'trace-dot', style: 'fill:#059669' }));

    g.appendChild(el('line', { x1: x0, y1: 172, x2: x0 + 15, y2: 172, style: 'stroke:rgba(217, 119, 6, .7);stroke-width:3' }));
    g.appendChild(el('text', { x: x0 + 20, y: 175.5, class: 'legend-text', style: 'fill:#d97706' }, `표준 (37 ℃ · pH ${e.phOpt} · 억제제 없음)`));
    g.appendChild(el('line', { x1: x0 + 246, y1: 172, x2: x0 + 261, y2: 172, style: 'stroke:#059669;stroke-width:3' }));
    g.appendChild(el('text', { x: x0 + 266, y: 175.5, class: 'legend-text', style: 'fill:#059669' }, '지금 조건'));
    g.appendChild(el('text', { x: (x0 + x1) / 2, y: 191, 'text-anchor': 'middle', class: 'axis-title' }, '기질 농도 (mmol/L) — 세로는 반응 속도 (μmol/min·mg)'));
}

function render() {
    const m = $('mainGroup'), gr = $('graphGroup');
    m.textContent = ''; gr.textContent = '';
    drawStage(m); drawGraph(gr);
    updateReadout();
}

function updateReadout() {
    const a = analyse();
    const e = enz();
    $('stageBadge').textContent = `${e.name} · ${state.temp} ℃ · pH ${state.ph} · ${state.inhib === 'none' ? '억제제 없음' : (state.inhib === 'comp' ? '경쟁적 억제' : '비경쟁적 억제')}`;
    $('valueA').textContent = `${fmt(a.v, 1)} μmol/min·mg`;
    $('valueB').textContent = `${fmt(a.vmax, 1)} · Km ${fmt(a.km, 1)}`;
    const rows = [
        ['온도가 주는 배수', `${fmt(a.kcat, 2)}배`, a.kcat >= 1],
        ['pH가 맞는 정도', `${Math.round(a.ph * 100)}%`, a.ph > 0.9],
        ['살아 있는 효소', `${Math.round(a.alive * 100)}%`, a.alive > 0.98],
        ['억제제에 막히는 몫', state.inhib === 'none' ? '없음' : `${Math.round(a.blocked * 100)}%`, false],
        ['억제제 없을 때 Vmax·Km', `${fmt(a.vmaxClean, 1)} · ${fmt(a.kmClean, 1)}`, false],
        ['최고 속도에 견준 지금', `${Math.round(a.vmax > 0 ? a.v / a.vmax * 100 : 0)}%`, false],
    ];
    $('dataNote').innerHTML = rows.map(([n, v, m]) =>
        `<div class="data-row${m ? ' match' : ''}"><span class="data-name">${n}</span><span class="data-val">${v}</span></div>`).join('');
    if (state.checked) explain(a);
}

const WORDS = { p1: 'Km만 오른다', p2: 'Vmax만 내린다', p3: '둘 다 그대로' };

function explain(a) {
    $('resultEmpty').hidden = true;
    $('resultContent').hidden = false;
    const v = a.verdict;
    if (state.prediction) {
        const ok = state.prediction === v;
        $('predictionResult').textContent = ok ? `예상이 맞았습니다 — ${WORDS[v]}.`
            : `예상은 ${WORDS[state.prediction]}였지만 결과는 ${WORDS[v]}입니다.`;
        $('predictionResult').className = `prediction-result ${ok ? 'correct' : 'wrong'}`;
    } else {
        $('predictionResult').textContent = '';
        $('predictionResult').className = 'prediction-result';
    }

    const e = enz();
    let s = `${eun(e.name)} ${e.where}에서 ${e.job}. `;
    // With the enzyme cooked, both the rate and its ceiling are zero, and a
    // percentage of nothing would be nonsense.
    s += a.vmax < 0.5
        ? `지금은 기질을 아무리 넣어도 속도가 사실상 0입니다. `
        : `지금 기질 ${fmt(state.sub, 1)} mmol/L에서 속도는 ${fmt(a.v, 1)}이고, 이는 이 조건의 최고 속도 ${fmt(a.vmax, 1)}의 ${Math.round(a.v / a.vmax * 100)}%입니다. `;
    if (a.alive < 0.02) {
        s += `그러나 ${state.temp} ℃에서 단백질이 거의 다 풀려 버렸습니다. 활성 부위 모양이 사라졌으므로 온도를 다시 낮춰도 속도는 돌아오지 않습니다. 온도를 먼저 내린 다음 새 효소를 꺼내야 합니다. 뜨거운 채로 새로 넣으면 그것도 곧바로 익습니다. `;
    } else if (a.alive < 0.98) {
        s += `높은 온도를 거치며 효소의 ${Math.round((1 - a.alive) * 100)}%가 이미 익었고, 이 몫은 온도를 낮춰도 되살아나지 않습니다. `;
    } else if (a.ph < 0.2) {
        s += `pH ${numEun(String(state.ph))} ${e.name}에게 너무 벗어난 값이라 활성 부위 모양이 흐트러졌습니다. 다만 이 변화는 pH를 ${e.phOpt} 가까이 되돌리면 다시 회복됩니다. `;
    }
    if (v === 'p1') {
        s += `경쟁적 억제제는 기질과 똑같은 자리를 노리므로 지금 ${Math.round(a.blocked * 100)}%의 차례를 가로챕니다. 하지만 기질을 늘릴수록 밀려나기 때문에 아무리 방해해도 최고 속도 ${numEun(fmt(a.vmax, 1))} 억제제가 없을 때와 같고, 대신 절반 속도에 이르는 데 필요한 농도가 ${fmt(a.kmClean, 1)}에서 ${numRo(fmt(a.km, 1))} 늘어납니다.`;
    } else if (v === 'p2') {
        s += `비경쟁적 억제제는 활성 부위가 아닌 다른 자리에 붙어 효소 모양을 바꿉니다. 기질과 다투는 것이 아니므로 기질을 아무리 넣어도 막힌 ${Math.round(a.blocked * 100)}%는 그대로 놀고, 최고 속도가 ${fmt(a.vmaxClean, 1)}에서 ${numRo(fmt(a.vmax, 1))} 내려갑니다. 붙잡는 힘은 그대로여서 Km은 ${fmt(a.km, 1)}에 머뭅니다.`;
    } else {
        s += `억제제가 없으므로 Vmax ${numGwa(fmt(a.vmax, 1))} Km ${fmt(a.km, 1)}이 지금 조건에서 효소가 가진 값 그대로입니다. Km은 온도나 pH를 바꿔도 달라지지 않습니다. 붙잡는 힘이 아니라 일하는 빠르기만 달라지기 때문입니다.`;
    }
    $('elementaryExplanation').textContent = s;
}

// --- animation --------------------------------------------------------------
function tick(dt) {
    state.phase += dt;
    // Turnovers are attempted at the uninhibited pace; blocked ones waste a
    // slot, which is what makes the two inhibitors differ on screen.
    if (state.alive >= 0.02) state.cyclePos += dt * rateClean(state.sub) / 25;
    if (!state.running) return false;
    state.sweep = Math.min(1, state.sweep + dt / 10);
    const S = state.sweep * S_MAX;
    state.sub = Math.round(S * 2) / 2;
    $('subRange').value = String(state.sub);
    $('subOutput').textContent = `${fmt(state.sub, 1)} mmol/L`;
    const last = state.trail.length ? state.trail[state.trail.length - 1][0] : -1;
    if (state.sub - last >= 0.5) state.trail.push([state.sub, rateAt(state.sub)]);
    if (state.sweep >= 1) {
        state.running = false;
        $('runBtn').textContent = '기질 농도 훑기';
        state.checked = true;
        return true;
    }
    return false;
}

let last = 0;
function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    tick(dt);
    render();
    requestAnimationFrame(frame);
}

// --- wiring -----------------------------------------------------------------
function markSelected(sel, attr, value) {
    document.querySelectorAll(sel).forEach(b => b.classList.toggle('selected', b.dataset[attr] === String(value)));
}

document.querySelectorAll('[data-enzyme]').forEach(b => b.addEventListener('click', () => {
    state.enzyme = b.dataset.enzyme;
    state.alive = 1;             // a different enzyme is a fresh tube
    state.trail = [];
    markSelected('[data-enzyme]', 'enzyme', state.enzyme); render();
}));
document.querySelectorAll('[data-temp]').forEach(b => b.addEventListener('click', () => {
    state.temp = Number(b.dataset.temp);
    state.alive = Math.min(state.alive, survivalAt(state.temp, enz().tm));
    state.trail = [];
    markSelected('[data-temp]', 'temp', state.temp); render();
}));
document.querySelectorAll('[data-ph]').forEach(b => b.addEventListener('click', () => {
    state.ph = Number(b.dataset.ph); state.trail = [];
    markSelected('[data-ph]', 'ph', state.ph); render();
}));
document.querySelectorAll('[data-inhib]').forEach(b => b.addEventListener('click', () => {
    state.inhib = b.dataset.inhib; state.trail = [];
    markSelected('[data-inhib]', 'inhib', state.inhib); render();
}));
document.querySelectorAll('[data-prediction]').forEach(b => b.addEventListener('click', () => {
    state.prediction = b.dataset.prediction; state.checked = false; window.scienceInvalidatePrediction?.(); markSelected('[data-prediction]', 'prediction', state.prediction);
}));
$('subRange').addEventListener('input', e => {
    state.sub = Number(e.target.value);
    $('subOutput').textContent = `${fmt(state.sub, 1)} mmol/L`;
    render();
});
$('runBtn').addEventListener('click', () => {
    if (state.running) { state.running = false; $('runBtn').textContent = '기질 농도 훑기'; return; }
    state.sweep = 0; state.trail = []; state.running = true; state.checked = true;
    $('runBtn').textContent = '멈추기';
    render();
});
$('freshBtn').addEventListener('click', () => {
    state.alive = Math.min(1, survivalAt(state.temp, enz().tm));
    state.trail = [];
    state.checked = true;
    render();
});

document.querySelectorAll('.quiz-card').forEach(card => {
    card.querySelector('.answer-button').addEventListener('click', () => {
        const picked = card.querySelector('input:checked');
        const result = card.querySelector('.answer-result');
        const why = card.querySelector('.answer-explanation');
        if (!picked) { result.textContent = '먼저 답을 골라 보세요.'; result.className = 'answer-result'; return; }
        const ok = picked.value === card.dataset.answer;
        result.textContent = ok ? '맞았습니다.' : '다시 생각해 볼까요?';
        result.className = `answer-result ${ok ? 'correct' : 'wrong'}`;
        why.hidden = false;
    });
});

markSelected('[data-enzyme]', 'enzyme', state.enzyme);
markSelected('[data-temp]', 'temp', state.temp);
markSelected('[data-ph]', 'ph', state.ph);
markSelected('[data-inhib]', 'inhib', state.inhib);
render();
requestAnimationFrame(frame);

window.__enzymeModel = {
    state, analyse, tick, render, rateAt, rateClean, vmaxEff, kmEff, vmaxClean,
    kcatAt, survivalAt, phFactor, blockedFraction, isBlocked, ENZYMES,
    setEnzyme(v) { document.querySelector(`[data-enzyme="${v}"]`).click(); },
    setTemp(v) { document.querySelector(`[data-temp="${v}"]`).click(); },
    setPh(v) { document.querySelector(`[data-ph="${v}"]`).click(); },
    setInhib(v) { document.querySelector(`[data-inhib="${v}"]`).click(); },
    setSub(v) { const r = $('subRange'); r.value = String(v); r.dispatchEvent(new Event('input')); },
    fresh() { $('freshBtn').click(); },
    check() { state.checked = true; explain(analyse()); },
    runToEnd(dt = 1 / 30) {
        $('runBtn').click();
        let steps = 0;
        while (state.running && steps < 20000) { tick(dt); steps += 1; }
        render();
        return { steps, points: state.trail.length, sweep: state.sweep };
    },
    // Count how many turnovers actually complete per simulated second, so the
    // picture can be checked against the rate it claims to show.
    measureThroughput(seconds = 400, dt = 0.002) {
        const keep = state.cyclePos;
        state.cyclePos = 0;
        let done = 0, prev = 0;
        for (let t = 0; t < seconds; t += dt) {
            state.cyclePos += dt * rateClean(state.sub) / 25;
            const n = Math.floor(state.cyclePos);
            if (n > prev) { for (let k = prev; k < n; k += 1) if (!isBlocked(k)) done += 1; prev = n; }
        }
        state.cyclePos = keep;
        return done / seconds * 25;
    },
};
