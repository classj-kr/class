'use strict';

/* Four journeys through the body, with the real numbers attached. The one
   worth arriving at: a resting heart moves about five litres a minute and the
   body holds about five litres of blood, so the whole lot goes round roughly
   once a minute — and while running, once every seventeen seconds. Digestion
   and the kidneys, meanwhile, do not speed up at all. */

const BLOOD_ML = 5000;   // roughly what a 40 kg child carries

const ACTS = {
    rest: { name: '쉴 때', hr: 70, sv: 70, br: 15, tv: 500 },
    walk: { name: '걸을 때', hr: 100, sv: 85, br: 25, tv: 600 },
    run: { name: '달릴 때', hr: 160, sv: 110, br: 40, tv: 800 },
};

/* Front view, textbook proportions. The figure faces us, so the person's left
   (where the heart sits) is on the viewer's right. Each organ carries its own
   drawing and the stretch of the route the traveller walks while inside it. */
const SYSTEMS = {
    dig: {
        name: '소화 기관', mover: '음식', colour: '#eab676', dark: '#9a6326', unit: '시간',
        label: '음식이 다 지나가는 시간',
        organs: [
            { n: '입', x: 150, y: 53, note: '이로 잘게 부수고 침을 섞습니다', stay: '30초',
              art: (c, k) => `<path d="M139 51 Q150 47 161 51 Q150 60 139 51 Z" fill="${c}" stroke="${k}" stroke-width="1.4"/><path d="M141 52 Q150 54 159 52" fill="none" stroke="${k}" stroke-width="1"/>`,
              route: [[150, 52], [150, 60]] },
            { n: '식도', x: 151, y: 92, note: '꿈틀 운동으로 위까지 밀어 내립니다', stay: '7초',
              art: (c, k) => `<path d="M150 58 L150 80 C150 100 151 112 158 128" fill="none" stroke="${k}" stroke-width="8" stroke-linecap="round"/><path d="M150 58 L150 80 C150 100 151 112 158 128" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`,
              route: [[150, 60], [150, 80], [151, 104], [158, 127]] },
            { n: '위', x: 172, y: 138, note: '위액과 섞어 죽처럼 만듭니다', stay: '3시간',
              art: (c, k) => `<path d="M156 126 C162 118 182 118 186 132 C190 148 178 162 160 162 C148 162 140 156 141 149 C142 145 147 146 151 148 C158 151 166 147 168 140 C170 133 164 129 158 131 Z" fill="${c}" stroke="${k}" stroke-width="1.6"/><path d="M150 149 L144 158" stroke="${c}" stroke-width="6" stroke-linecap="round"/>`,
              route: [[158, 128], [176, 128], [180, 144], [166, 156], [148, 154], [144, 160]] },
            { n: '작은창자', x: 150, y: 194, note: '영양소를 빨아들여 피로 보냅니다', stay: '5시간',
              art: (c, k) => { const d = 'M144 162 C130 166 132 178 146 178 C162 178 170 180 166 186 C162 192 138 186 134 194 C130 202 166 194 168 202 C170 210 140 204 136 210 C134 214 144 216 150 216'; return `<path d="${d}" fill="none" stroke="${k}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`; },
              route: [[144, 161], [133, 171], [148, 178], [166, 184], [140, 190], [136, 197], [166, 200], [140, 208], [150, 216]] },
            { n: '큰창자', x: 124, y: 196, note: '물을 빨아들이고 찌꺼기를 모읍니다', stay: '16시간',
              art: (c, k) => { const d = 'M150 216 C136 218 126 220 124 212 L124 176 C124 168 128 166 136 166 L166 166 C174 166 177 170 177 178 L177 212 C177 222 168 224 158 224 C152 224 150 228 150 238'; return `<path d="${d}" fill="none" stroke="${k}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`; },
              route: [[150, 216], [126, 214], [124, 176], [132, 166], [168, 166], [177, 178], [177, 214], [158, 224], [150, 238]] },
        ],
    },
    resp: {
        name: '호흡 기관', mover: '공기', colour: '#8fc6e8', dark: '#2a6d97', unit: 'L/분',
        label: '1분에 들이마시는 공기',
        organs: [
            { n: '코', x: 150, y: 40, note: '먼지를 거르고 공기를 데웁니다', stay: '한순간',
              art: (c, k) => `<path d="M150 30 C153 36 156 41 158 45 C155 48 145 48 142 45 C144 41 147 36 150 30 Z" fill="${c}" stroke="${k}" stroke-width="1.4"/>`,
              route: [[150, 30], [150, 46], [150, 60]] },
            { n: '기관', x: 150, y: 80, note: '목에서 가슴까지 곧게 내려갑니다', stay: '한순간',
              art: (c, k) => { let s = `<rect x="145" y="60" width="10" height="38" rx="4" fill="${c}" stroke="${k}" stroke-width="1.4"/>`; for (let y = 65; y < 96; y += 6) s += `<path d="M145.5 ${y} H154.5" stroke="${k}" stroke-width="1"/>`; return s; },
              route: [[150, 60], [150, 98]] },
            { n: '기관지', x: 150, y: 104, note: '좌우 폐로 갈라집니다', stay: '한순간',
              art: (c, k) => { const d = 'M150 97 L150 102 M150 102 C144 106 138 108 132 116 M150 102 C156 106 162 108 168 116 M137 110 L128 112 M134 114 L130 124 M163 110 L172 112 M166 114 L170 124'; return `<path d="${d}" fill="none" stroke="${k}" stroke-width="6" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="3.5" stroke-linecap="round"/>`; },
              route: [[150, 98], [150, 102], [140, 108], [132, 116]] },
            { n: '폐', x: 186, y: 128, note: '폐 속 폐포에서 산소와 이산화 탄소를 주고받습니다', stay: '숨 한 번',
              art: (c, k) => `<path d="M143 96 C134 88 118 96 114 118 C111 136 112 152 118 158 C126 162 138 158 144 152 C146 132 146 110 143 96 Z M157 96 C166 88 182 96 186 118 C189 136 188 152 182 158 C174 162 164 160 158 154 L160 146 C164 142 162 132 158 128 C156 116 155 106 157 96 Z" fill="${c}" fill-opacity=".85" stroke="${k}" stroke-width="1.6"/><path d="M128 116 Q124 128 126 144 M172 116 Q176 128 174 144" fill="none" stroke="${k}" stroke-width="1" opacity=".55"/>`,
              route: [[132, 116], [124, 132], [128, 150], [140, 140], [150, 112], [160, 118], [176, 132], [172, 150]] },
        ],
    },
    circ: {
        name: '순환 기관', mover: '피', colour: '#e8838b', dark: '#9e2f3c', unit: 'L/분',
        label: '1분에 내보내는 피',
        organs: [
            { n: '심장', x: 158, y: 122, note: '펌프처럼 피를 밀어 보냅니다', stay: '한 번 뜀',
              art: (c, k) => `<path d="M157 108 C150 102 140 106 141 116 C142 126 152 134 160 140 C168 133 176 124 174 114 C172 104 162 103 157 108 Z" fill="${c}" stroke="${k}" stroke-width="1.6"/><path d="M152 106 C150 96 156 92 162 94" fill="none" stroke="${k}" stroke-width="5" stroke-linecap="round"/>`,
              route: [[146, 122], [158, 128], [162, 112], [158, 98]] },
            { n: '동맥', x: 166, y: 176, note: '굵고 튼튼한 관으로 피가 힘차게 흘러 나갑니다', stay: '몇 초',
              art: () => `<path d="M158 98 C162 90 170 92 168 104 L164 230 L177 238 L177 292 M164 230 L123 238 L123 292 M166 100 C182 96 196 104 198 130 L202 222" fill="none" stroke="#c43a48" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M152 100 C130 96 104 104 102 130 L98 222" fill="none" stroke="#c43a48" stroke-width="3" stroke-linecap="round"/>`,
              route: [[158, 98], [166, 94], [167, 110], [164, 230], [177, 238], [177, 290]] },
            { n: '모세혈관', x: 172, y: 296, note: '온몸 구석구석에서 산소를 건넵니다', stay: '1초쯤',
              art: () => { let s = ''; for (const [a, b] of [[177, 168], [123, 132]]) { s += `<path d="M${a} 288 C${a} 300 ${b} 300 ${b} 288" fill="none" stroke="#b2597a" stroke-width="2"/>`; for (let i = 0; i < 4; i++) { const y = 286 + i * 4; s += `<path d="M${a} ${y} Q${(a + b) / 2} ${y + 3} ${b} ${y}" fill="none" stroke="#b2597a" stroke-width="1" opacity=".8"/>`; } } return s; },
              route: [[177, 290], [174, 298], [168, 292]] },
            { n: '정맥', x: 140, y: 176, note: '온몸을 돈 피가 심장으로 돌아옵니다', stay: '몇 초',
              art: () => `<path d="M168 292 L168 236 L144 228 L146 124 M132 292 L132 236 L144 228" fill="none" stroke="#3f63a8" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M144 104 C126 102 108 110 106 132 L104 222 M156 104 C174 102 192 110 194 132 L196 222" fill="none" stroke="#3f63a8" stroke-width="2.6" stroke-linecap="round"/>`,
              route: [[168, 292], [168, 236], [144, 228], [146, 124]] },
        ],
    },
    excr: {
        name: '배설 기관', mover: '찌꺼기', colour: '#e0a07a', dark: '#8a4a26', unit: 'L/일',
        label: '하루에 거르는 피',
        organs: [
            { n: '콩팥', x: 132, y: 172, note: '피 속 찌꺼기를 걸러 냅니다', stay: '늘',
              art: (c, k) => `<path d="M131 160 C122 160 118 170 120 180 C122 190 132 194 137 188 C140 184 136 180 138 176 C140 172 142 168 140 164 C138 161 134 160 131 160 Z M169 156 C178 156 182 166 180 176 C178 186 168 190 163 184 C160 180 164 176 162 172 C160 168 158 164 160 160 C162 157 166 156 169 156 Z" fill="${c}" stroke="${k}" stroke-width="1.6"/><path d="M150 150 L150 214 M138 174 L150 172 M162 170 L150 168" stroke="#c43a48" stroke-width="2" opacity=".55"/>`,
              route: [[150, 168], [138, 174], [130, 178], [136, 184]] },
            { n: '오줌관', x: 140, y: 202, note: '콩팥에서 방광까지 내려갑니다', stay: '몇 초',
              art: (c, k) => `<path d="M136 184 C138 196 142 206 146 218 M164 180 C162 194 158 206 154 218" fill="none" stroke="${k}" stroke-width="3" stroke-linecap="round"/>`,
              route: [[136, 184], [140, 200], [146, 218]] },
            { n: '방광', x: 150, y: 224, note: '오줌을 모아 두었다가 내보냅니다', stay: '몇 시간',
              art: (c, k) => `<path d="M150 214 C162 214 168 220 166 228 C164 234 158 236 150 236 C142 236 136 234 134 228 C132 220 138 214 150 214 Z" fill="${c}" stroke="${k}" stroke-width="1.6"/>`,
              route: [[146, 218], [150, 226], [150, 235]] },
            { n: '요도', x: 150, y: 242, note: '방광에 모인 오줌을 몸 밖으로 내보냅니다', stay: '배출할 때',
              art: (c, k) => `<path d="M150 236 L150 250" stroke="${k}" stroke-width="3" stroke-linecap="round"/>`,
              route: [[150, 235], [150, 250]] },
        ],
    },
};

const state = {
    sys: 'circ', act: 'rest',
    prediction: null, checked: false,
    running: false, t: 0, phase: 0,
};

const $ = id => document.getElementById(id);
const svgNS = 'http://www.w3.org/2000/svg';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = (v, d) => v.toFixed(d).replace('-', '−');
// 음식은, 공기는 — the particle follows the final consonant.
function eun(w) {
    const ch = w.charCodeAt(w.length - 1);
    const jong = ch >= 0xac00 && ch <= 0xd7a3 && (ch - 0xac00) % 28 !== 0;
    return w + (jong ? '은' : '는');
}

// What this system gets through, in its own units. Digestion and excretion do
// not speed up when you run, and that is the point of asking.
function output(sys, act) {
    const a = ACTS[act];
    if (sys === 'circ') return a.hr * a.sv / 1000;
    if (sys === 'resp') return a.br * a.tv / 1000;
    if (sys === 'dig') return 24;
    return 180;
}
function ratio(sys, act) { return output(sys, act) / output(sys, 'rest'); }
function verdictFor(sys, act) { return {dig:'p1',resp:'p2',circ:'p3',excr:'p4'}[sys]; }

function analyse() {
    const s = SYSTEMS[state.sys], a = ACTS[state.act];
    const out = output(state.sys, state.act);
    return {
        sys: s, act: a, out, ratio: ratio(state.sys, state.act),
        // How long the whole blood supply takes to go round once.
        lapSec: 60 * BLOOD_ML / (a.hr * a.sv),
        verdict: verdictFor(state.sys, state.act),
    };
}

function el(tag, attrs, text) {
    const n = document.createElementNS(svgNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text !== undefined) n.textContent = text;
    return n;
}

const BODY_PATH = 'M150 12 C166 12 175 25 175 41 C175 55 168 64 160 68 L160 77 C178 80 196 85 204 95 C210 106 212 140 214 190 C215 210 214 226 210 234 C206 239 200 237 199 231 C197 213 196 180 192 140 L190 134 C188 162 186 196 188 222 C190 260 187 290 185 314 L163 314 C161 286 157 262 152 240 L148 240 C143 262 139 286 137 314 L115 314 C113 290 110 260 112 222 C114 196 112 162 110 134 L108 140 C104 180 103 213 101 231 C100 237 94 239 90 234 C86 226 85 210 86 190 C88 140 90 106 96 95 C104 85 122 80 140 77 L140 68 C132 64 125 55 125 41 C125 25 134 12 150 12 Z';

function svgFrag(g, markup) {
    const tmp = document.createElementNS(svgNS, 'g');
    tmp.innerHTML = markup;
    while (tmp.firstChild) g.appendChild(tmp.firstChild);
}
function routeOf(sys) {
    const pts = [], marks = [];
    sys.organs.forEach(o => {
        marks.push(pts.length ? pts.length - 1 : 0);
        o.route.forEach((p, i) => { if (!(pts.length && i === 0)) pts.push(p); });
    });
    const seg = [];
    let total = 0;
    for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); total += d; }
    const markLen = marks.map(m => seg.slice(0, m).reduce((a, b) => a + b, 0) / total);
    return { pts, seg, total, markLen };
}
function pointOn(r, t) {
    let left = clamp(t, 0, 1) * r.total;
    for (let i = 0; i < r.seg.length; i++) {
        if (left <= r.seg[i] || i === r.seg.length - 1) {
            const f = r.seg[i] ? clamp(left / r.seg[i], 0, 1) : 0, a = r.pts[i], b = r.pts[i + 1];
            return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
        }
        left -= r.seg[i];
    }
    return r.pts[r.pts.length - 1];
}

function drawBody(g) {
    const a = analyse();
    const sys = a.sys, organs = sys.organs, route = routeOf(sys);
    let stepAt = -1;
    if (state.running) route.markLen.forEach((m, i) => { if (state.t >= m) stepAt = i; });

    g.appendChild(el('path', { d: BODY_PATH, class: 'body-outline' }));
    svgFrag(g, '<path class="body-detail" d="M142 33 Q144 31 146 33 M154 33 Q156 31 158 33"/>');

    // A beating heart: the drawing swells at the rate the numbers say.
    const beat = state.sys === 'circ' ? Math.pow(Math.max(0, Math.sin(Math.PI * ((state.phase * a.act.hr / 60) % 1))), 3) : 0;
    organs.forEach((o, i) => {
        const here = i === stepAt;
        const wrap = el('g', { class: `organ-art${here ? ' here' : state.running ? ' dim' : ''}`, 'data-scene-key': `${state.sys}-${i}` });
        if (state.sys === 'circ' && i === 0) wrap.setAttribute('transform', `translate(158 122) scale(${fmt(1 + beat * 0.08, 3)}) translate(-158 -122)`);
        svgFrag(wrap, o.art(sys.colour, sys.dark));
        g.appendChild(wrap);
    });

    if (state.running) {
        const [x, y] = pointOn(route, state.t);
        g.appendChild(el('circle', { cx: fmt(x, 1), cy: fmt(y, 1), r: 5.5, class: 'traveller', style: `fill:${sys.dark}` }));
    }

    // Names stand beside the body, joined to each organ by a thin line.
    g.appendChild(el('text', { x: 236, y: 26, class: 'small-label' }, `${sys.mover}가 지나는 차례`));
    const gap = Math.min(52, 250 / organs.length);
    organs.forEach((o, i) => {
        const here = i === stepAt, y = 56 + i * gap;
        g.appendChild(el('path', { d: `M${o.x} ${o.y} L222 ${y} L240 ${y}`, class: `leader${here ? ' here' : ''}` }));
        g.appendChild(el('circle', { cx: o.x, cy: o.y, r: 2.4, class: 'leader-dot' }));
        g.appendChild(el('circle', { cx: 254, cy: y, r: 11, class: `step-dot${here ? ' here' : ''}`, style: here ? `fill:${sys.dark}` : '' }));
        g.appendChild(el('text', { x: 254, y: y + 5, 'text-anchor': 'middle', class: `step-num${here ? ' here' : ''}` }, String(i + 1)));
        g.appendChild(el('text', { x: 272, y: y + 5, class: `step-text${here ? ' here' : ''}` }, o.n));
    });
}

function drawGraph(g) {
    const a=analyse();
    a.sys.organs.forEach((o,i)=>g.appendChild(el('text',{x:20,y:28+i*30,fill:'#334155','font-size':14},o.n+' — '+o.note)));
}

function render() {
    window.scienceScene.draw([$('mainGroup'), $('graphGroup')], ([m, gr]) => {
    drawBody(m); drawGraph(gr);
    });
    updateReadout();
}

const WORDS = {p1:'소화와 영양소 흡수',p2:'산소 공급과 이산화 탄소 배출',p3:'피를 온몸으로 운반',p4:'노폐물을 오줌으로 배출'};

function updateReadout() {
    const a=analyse();$('stageBadge').textContent=a.sys.name+' · '+a.act.name;
    $('labelA').textContent='기관';$('valueA').textContent=a.sys.name;$('valueB').textContent=WORDS[a.verdict];
    $('dataNote').innerHTML='<p>'+a.sys.organs.map(o=>o.n).join(' → ')+'</p><p>모형의 움직임 속도는 실제 측정값이 아닙니다. 기관의 위치·기능과 서로 연결된 관계를 관찰하세요.</p>';
    if(state.checked)explain(a);
}

function explain(a) {
    $('resultEmpty').hidden=true;$('resultContent').hidden=false;
    $('predictionResult').textContent=state.prediction?(state.prediction===a.verdict?'예상이 맞았습니다.':'선택한 기관의 하는 일을 다시 확인하세요.'):'다음에는 먼저 예상해 보세요.';
    $('elementaryExplanation').textContent=a.sys.name+'의 주요 역할은 '+WORDS[a.verdict]+'입니다. '+a.sys.organs.map(o=>o.n+': '+o.note).join(' / ')+'. 기관들은 서로 연결되어 우리 몸이 활동하도록 돕습니다.';
}

// --- animation --------------------------------------------------------------
function tick(dt) {
    state.phase += dt;
    if (!state.running) return false;
    state.t = Math.min(1, state.t + dt / 7);
    if (state.t >= 1) {
        state.running = false;
        $('runBtn').textContent = '따라가 보기';
        state.checked = true;
        return true;
    }
    return false;
}

let last = 0, looping = false;
const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
// The loop only runs while something travels; it stops when the trip ends.
function frame(now) {
    const dt = Math.max(0, Math.min(0.05, (now - last) / 1000 || 0));
    last = now;
    tick(dt);
    render();
    if (state.running) requestAnimationFrame(frame); else looping = false;
}
function startLoop() {
    if (reduceMotion()) { while (state.running) tick(0.5); render(); return; }
    if (looping) return;
    looping = true; last = performance.now();
    requestAnimationFrame(frame);
}

// --- wiring -----------------------------------------------------------------
function markSelected(sel, attr, value) {
    document.querySelectorAll(sel).forEach(b => b.classList.toggle('selected', b.dataset[attr] === String(value)));
}

document.querySelectorAll('[data-sys]').forEach(b => b.addEventListener('click', () => {
    state.sys = b.dataset.sys; markSelected('[data-sys]', 'sys', state.sys); render();
}));
document.querySelectorAll('[data-act]').forEach(b => b.addEventListener('click', () => {
    state.act = b.dataset.act; markSelected('[data-act]', 'act', state.act); render();
}));
document.querySelectorAll('[data-prediction]').forEach(b => b.addEventListener('click', () => {
    state.prediction = b.dataset.prediction; state.checked = false; window.scienceInvalidatePrediction?.(); markSelected('[data-prediction]', 'prediction', state.prediction);
}));
$('runBtn').addEventListener('click', () => {
    if (state.running) { state.running = false; $('runBtn').textContent = '따라가 보기'; return; }
    state.t = 0; state.running = true; state.checked = true;
    $('runBtn').textContent = '멈추기';
    render();
    startLoop();
});
$('resetBtn').addEventListener('click', () => {
    state.sys = 'circ'; state.act = 'rest';
    state.prediction = null; state.checked = false; state.running = false; state.t = 0;
    $('runBtn').textContent = '따라가 보기';
    document.querySelectorAll('[data-prediction]').forEach(x => x.classList.remove('selected'));
    $('resultEmpty').hidden = false; $('resultContent').hidden = true;
    markSelected('[data-sys]', 'sys', 'circ'); markSelected('[data-act]', 'act', 'rest');
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

markSelected('[data-sys]', 'sys', state.sys);
markSelected('[data-act]', 'act', state.act);
render();

window.__organModel = {
    state, analyse, tick, render, output, ratio, verdictFor,
    SYSTEMS, ACTS, BLOOD_ML,
    setSys(v) { document.querySelector(`[data-sys="${v}"]`).click(); },
    setAct(v) { document.querySelector(`[data-act="${v}"]`).click(); },
    check() { state.checked = true; explain(analyse()); },
    runToEnd(dt = 1 / 30) {
        $('runBtn').click();
        let steps = 0;
        while (state.running && steps < 20000) { tick(dt); steps += 1; }
        render();
        return { steps, t: state.t };
    },
};

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
