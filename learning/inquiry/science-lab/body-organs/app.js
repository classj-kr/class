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

const SYSTEMS = {
    dig: {
        name: '소화 기관', mover: '음식', colour: '#e0b070', unit: '시간',
        label: '음식이 다 지나가는 시간',
        organs: [
            { n: '입', x: 150, y: 34, w: 26, h: 14, d: 'M 137 34 C 137 30 144 28 150 30 C 156 28 163 30 163 34 C 163 38 157 41 150 41 C 143 41 137 38 137 34 Z', note: '이로 잘게 부수고 침을 섞습니다', stay: '30초' },
            { n: '식도', x: 150, y: 64, w: 12, h: 26, d: 'M 145 51 C 148 51 152 51 155 51 C 156 59 154 69 155 77 C 152 77 148 77 145 77 C 146 69 144 59 145 51 Z', note: '꿈틀 운동으로 위까지 밀어 내립니다', stay: '7초' },
            { n: '위', x: 134, y: 100, w: 40, h: 30, d: 'M 148 85 C 138 85 124 88 118 96 C 113 103 115 112 124 115 C 134 117 146 112 153 104 C 155 101 154 96 147 96 C 138 96 130 99 126 97 C 124 94 130 90 144 89 Z', note: '위액과 섞어 죽처럼 만듭니다', stay: '3시간' },
            { n: '작은창자', x: 150, y: 140, w: 52, h: 30, d: 'M 130 126 C 142 125 158 125 170 127 C 176 133 174 141 166 143 C 174 146 175 152 168 155 C 156 155 144 154 132 155 C 125 152 126 146 134 143 C 126 141 124 133 130 126 Z', note: '영양소를 빨아들여 피로 보냅니다', stay: '5시간' },
            { n: '큰창자', x: 150, y: 140, w: 58, h: 16, d: 'M 121 131 C 124 131 127 131 127 139 C 133 142 167 142 173 139 C 173 131 176 131 179 131 C 179 142 176 149 166 149 C 154 149 154 145 150 145 C 146 145 146 149 134 149 C 124 149 121 142 121 131 Z', note: '물을 빨아들이고 찌꺼기를 모읍니다', stay: '16시간' },
        ],
    },
    resp: {
        name: '호흡 기관', mover: '공기', colour: '#0284c7', unit: 'L/분',
        label: '1분에 들이마시는 공기',
        organs: [
            { n: '코', x: 150, y: 32, w: 20, h: 14, d: 'M 150 25 C 154 28 158 33 160 36 C 158 39 153 39 150 37 C 147 39 142 39 140 36 C 142 33 146 28 150 25 Z', note: '먼지를 거르고 공기를 데웁니다', stay: '한순간' },
            { n: '기관', x: 150, y: 62, w: 12, h: 28, d: 'M 144 48 C 148 48 152 48 156 48 C 156 55 154 62 156 69 C 156 76 154 76 150 76 C 146 76 144 76 144 69 C 146 62 144 55 144 48 Z', note: '목에서 가슴까지 곧게 내려갑니다', stay: '한순간' },
            { n: '기관지', x: 150, y: 92, w: 34, h: 14, d: 'M 147 85 C 150 85 150 85 153 85 C 154 89 160 93 167 96 C 165 99 162 99 156 94 C 152 91 148 91 144 94 C 138 99 135 99 133 96 C 140 93 146 89 147 85 Z', note: '좌우 폐로 갈라집니다', stay: '한순간' },
            { n: '폐', x: 150, y: 126, w: 62, h: 34, d: 'M 143 109 C 146 117 146 133 142 143 C 133 144 123 140 119 133 C 116 123 123 111 133 109 C 137 109 140 109 143 109 M 157 109 C 160 109 163 109 167 109 C 177 111 184 123 181 133 C 177 140 167 144 158 143 C 154 133 154 117 157 109 Z', note: '폐 속 폐포에서 산소와 이산화 탄소를 주고받습니다', stay: '숨 한 번' },
        ],
    },
    circ: {
        name: '순환 기관', mover: '피', colour: '#ff8a8a', unit: 'L/분',
        label: '1분에 내보내는 피',
        organs: [
            { n: '심장', x: 148, y: 104, w: 30, h: 34, d: 'M 146 87 C 153 87 163 90 163 99 C 163 110 151 117 144 121 C 139 116 133 108 133 98 C 133 90 140 87 146 87 Z', note: '펌프처럼 피를 밀어 보냅니다', stay: '한 번 뜀' },
            { n: '동맥', x: 182, y: 140, w: 12, h: 44, d: 'M 179 118 C 183 118 186 128 187 140 C 188 152 186 162 182 162 C 178 162 176 152 177 140 C 177 128 177 118 179 118 Z', note: '굵고 튼튼한 관으로 피가 힘차게 흘러 나갑니다', stay: '몇 초' },
            { n: '모세혈관', x: 150, y: 128, w: 44, h: 12, d: 'M 128 128 C 134.5 122 143.5 122 150 125 C 156.5 122 165.5 122 172 128 C 165.5 134 156.5 134 150 131 C 143.5 134 134.5 134 128 128 Z', note: '온몸 구석구석에서 산소를 건넵니다', stay: '1초쯤' },
            { n: '정맥', x: 118, y: 140, w: 12, h: 44, d: 'M 121 118 C 123 128 123 140 123 152 C 122 162 118 162 115 162 C 112 152 113 140 114 128 C 115 118 118 118 121 118 Z', note: '온몸을 돈 피가 심장으로 돌아옵니다', stay: '몇 초' },
        ],
    },
    excr: {
        name: '배설 기관', mover: '찌꺼기', colour: '#a8d6b0', unit: 'L/일',
        label: '하루에 거르는 피',
        organs: [
            { n: '콩팥', x: 150, y: 108, w: 56, h: 26, d: 'M 136 95 C 142 95 142 103 138 108 C 142 113 142 121 136 121 C 128 121 123 113 123 108 C 123 103 128 95 136 95 M 164 95 C 172 95 177 103 177 108 C 177 113 172 121 164 121 C 158 121 158 113 162 108 C 158 103 158 95 164 95 Z', note: '피 속 찌꺼기를 걸러 냅니다', stay: '늘' },
            { n: '오줌관', x: 150, y: 132, w: 10, h: 24, d: 'M 143 117 C 145 127 146 137 147 147 C 146 147 144 147 144 147 C 143 137 142 127 140 117 Z M 157 117 C 158 127 157 137 156 147 C 154 147 153 147 153 147 C 154 137 155 127 160 117 Z', note: '콩팥에서 방광까지 내려갑니다', stay: '몇 초' },
            { n: '방광', x: 150, y: 144, w: 26, h: 16, d: 'M 150 133 C 159 133 167 138 167 144 C 167 150 159 155 150 155 C 141 155 133 150 133 144 C 133 138 141 133 150 133 Z', note: '오줌을 모아 두었다가 내보냅니다', stay: '몇 시간' },
            { n: '요도', x: 150, y: 169, w: 8, h: 24, d: 'M 147 154 L 153 154 L 153 181 L 147 181 Z', note: '방광에 모인 오줌을 몸 밖으로 내보냅니다', stay: '배출할 때' },
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

function drawBody(g) {
    const a = analyse();
    const organs = a.sys.organs;
    const stepAt = state.running ? Math.min(organs.length - 1, Math.floor(state.t * organs.length)) : -1;

    g.appendChild(el('path', {
        d: 'M 150 18 C 158 18 163 23 163 31 C 163 38 158 43 155 45 C 165 47 178 52 184 58 C 190 64 193 78 193 96 C 193 110 191 124 188 128 C 185 131 181 129 180 124 C 178 112 179 92 178 78 C 174 76 172 80 172 88 C 172 108 170 132 168 148 C 168 160 166 182 166 198 C 160 198 159 198 157 198 C 156 182 155 166 151 156 C 149 156 149 156 149 156 C 145 166 144 182 143 198 C 141 198 140 198 134 198 C 134 182 132 160 132 148 C 130 132 128 108 128 88 C 128 80 126 76 122 78 C 121 92 122 112 120 124 C 119 129 115 131 112 128 C 109 124 107 110 107 96 C 107 78 110 64 116 58 C 122 52 135 47 145 45 C 142 43 137 38 137 31 C 137 23 142 18 150 18 Z',
        class: 'body-outline',
    }));

    let d = '';
    organs.forEach((o, i) => { d += `${i ? 'L' : 'M'} ${o.x} ${o.y} `; });
    if (state.sys === 'circ') d += `L ${organs[0].x} ${organs[0].y} `;
    g.appendChild(el('path', { d, class: 'path-line' }));

    organs.forEach((o, i) => {
        const here = i === stepAt;
        if (o.d) {
            g.appendChild(el('path', {
                d: o.d,
                class: `organ${here ? ' here' : ''}`, style: `fill:${a.sys.colour}${here ? '' : '99'}`,
            }));
        } else {
            g.appendChild(el('ellipse', {
                cx: o.x, cy: o.y, rx: o.w / 2, ry: o.h / 2,
                class: `organ${here ? ' here' : ''}`, style: `fill:${a.sys.colour}${here ? '' : '99'}`,
            }));
        }
    });

    // The traveller walks the same path the organs sit on.
    if (state.running) {
        const n = organs.length;
        const legs = state.sys === 'circ' ? n : n - 1;
        const p = clamp(state.t, 0, 0.999) * legs;
        const i = Math.floor(p), f = p - i;
        const from = organs[i % n], to = organs[(i + 1) % n];
        g.appendChild(el('circle', {
            cx: from.x + (to.x - from.x) * f, cy: from.y + (to.y - from.y) * f,
            r: 6, class: 'traveller', style: `fill:${a.sys.colour}`,
        }));
    }

    // A heart that beats at the rate the numbers say.
    if (state.sys === 'circ') {
        const beat = (state.phase * a.act.hr / 60) % 1;
        g.appendChild(el('ellipse', {
            cx: organs[0].x, cy: organs[0].y, rx: 15 + beat * 6, ry: 17 + beat * 6,
            class: 'beat-ring', style: `opacity:${fmt(0.7 - beat * 0.7, 2)}`,
        }));
    }

    g.appendChild(el('text', { x: 20, y: 22, class: 'small-label' }, `${a.sys.name} · ${a.act.name}`));
    // The journey, listed in order beside the body.
    g.appendChild(el('text', { x: 244, y: 22, class: 'small-label' }, `${a.sys.mover}가 지나는 차례`));
    organs.forEach((o, i) => {
        const here = i === stepAt;
        const y = 44 + i * 22;
        g.appendChild(el('circle', { cx: 252, cy: y, r: 8, class: 'organ', style: `fill:${a.sys.colour}${here ? '' : '77'}` }));
        g.appendChild(el('text', { x: 252, y: y + 3, 'text-anchor': 'middle', class: 'tiny-label', style: 'fill:#10202a;font-weight:900' }, String(i + 1)));
        g.appendChild(el('text', { x: 266, y: y + 4, class: `step-text${here ? ' here' : ''}` }, o.n));
    });
}

function drawGraph(g) {
    const a=analyse();
    a.sys.organs.forEach((o,i)=>g.appendChild(el('text',{x:20,y:28+i*30,fill:'#334155','font-size':14},o.n+' — '+o.note)));
}

function render() {
    const m = $('mainGroup'), gr = $('graphGroup');
    m.textContent = ''; gr.textContent = '';
    drawBody(m); drawGraph(gr);
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
requestAnimationFrame(frame);

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
