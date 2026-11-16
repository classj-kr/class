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

    /* -------------------------------------------------------------- data */
    const SPHERES = {
        space: { label: '외권', pos: [60, 40], color: '#7c3aed' },
        atmo: { label: '기권', pos: [190, 40], color: '#9fd8ff' },
        hydro: { label: '수권', pos: [80, 116], color: '#0284c7' },
        geo: { label: '지권', pos: [290, 116], color: '#c9a35f' },
        bio: { label: '생물권', pos: [185, 170], color: '#7fd48a' },
    };
    const SPHERE_KEYS = ['space', 'atmo', 'hydro', 'geo', 'bio'];
    const LINKS = [['atmo', 'hydro'], ['atmo', 'geo'], ['hydro', 'geo'], ['bio', 'atmo'], ['bio', 'hydro'], ['bio', 'geo'], ['space', 'atmo'], ['space', 'hydro']];
    // Which pair of spheres each phenomenon joins, what crosses, and a real case.
    const PHENOMENA = {
        volcano: { label: '화산 폭발과 기온', short: '화산과 기온', from: 'geo', to: 'atmo', carry: '화산재·이산화 황 (물질)', cat: 'geo-atmo', lines: ['성층권의 이산화황에서', '황산염 에어로졸이 생성됨', '햇빛 일부를 반사하여', '일시적 냉각에 기여함'], example: ['1815년 탐보라 화산 →', '1816년 여름이 없던 해'] },
        typhoon: { label: '태풍의 발달', short: '태풍', from: 'hydro', to: 'atmo', carry: '수증기와 열 (물질·에너지)', cat: 'hydro-atmo', lines: ['따뜻한 바다에서 증발한', '수증기가 구름이 되며 열을', '내놓아 태풍이 힘을 얻음'], example: ['바다 표면 26.5 ℃ 넘는', '곳에서 태풍이 생김'] },
        river: { label: '강이 깎은 계곡', short: '강과 계곡', from: 'hydro', to: 'geo', carry: '흙과 모래 (물질)', cat: 'geo-hydro', lines: ['강물이 바위를 깎아', '계곡을 만들고 흙과 모래를', '하류와 바다로 옮김'], example: ['그랜드 캐니언,', '한강 하류의 삼각주'] },
        photo: { label: '식물의 광합성', short: '광합성', from: 'atmo', to: 'bio', carry: '이산화 탄소 (물질)', cat: 'bio', lines: ['식물이 공기 속 이산화', '탄소를 빨아들여 양분을', '만들고 산소를 내놓음'], example: ['한 해 약 1,200억 t의', '탄소가 공기에서 식물로'] },
        wind: { label: '바람과 파도', short: '바람과 파도', from: 'atmo', to: 'hydro', carry: '운동 에너지', cat: 'hydro-atmo', lines: ['바람이 바다 표면을 밀어', '파도와 표층 해류를', '일으킴'], example: ['무역풍이 적도의 바닷물을', '서쪽으로 밈'] },
        cave: { label: '석회 동굴', short: '석회 동굴', from: 'hydro', to: 'geo', carry: '녹은 석회 성분 (물질)', cat: 'geo-hydro', lines: ['이산화 탄소가 녹은 빗물이', '석회암을 조금씩 녹여', '동굴과 종유석을 만듦'], example: ['단양 고수동굴,', '삼척 환선굴'] },
        coral: { label: '산호와 석회암', short: '산호 석회암', from: 'bio', to: 'geo', carry: '탄산 칼슘 껍데기 (물질)', cat: 'bio', lines: ['산호와 조개가 석회 껍데기를', '쌓아 두꺼운 석회암', '지층이 됨'], example: ['강원도 석회암 지대는', '옛 바다 생물의 껍데기'] },
        sun: { label: '햇빛과 증발', short: '햇빛 증발', from: 'space', to: 'hydro', carry: '태양 에너지', cat: 'space', lines: ['태양 에너지가 바닷물을', '데워 한 해 약 44만 km³를', '증발시킴'], example: ['물의 순환을', '움직이는 힘'] },
        seaco2: { label: '바다가 품는 이산화 탄소', short: '바다의 탄소', from: 'atmo', to: 'hydro', carry: '이산화 탄소 (물질)', cat: 'hydro-atmo', lines: ['바닷물이 공기 속 이산화', '탄소를 녹여 품음 —', '사람이 내놓는 양의', '4분의 1쯤'], example: ['바닷물이 조금씩', '산성으로 기울어짐'] },
        tide: { label: '달과 밀물·썰물', short: '밀물 썰물', from: 'space', to: 'hydro', carry: '달의 중력 (에너지)', cat: 'space', lines: ['달의 중력이 바닷물을', '끌어 하루 두 번', '밀물과 썰물이 생김'], example: ['서해안의 넓은 갯벌'] },
    };

    // Water: how much sits in each store and how much passes through in a year
    // (thousand km³; Oki & Kanae 2006). Where a store has no single outflow,
    // a representative residence time is given instead.
    const RESERVOIRS = {
        atmo: { label: '대기', volume: 12.7, out: 486, how: '비와 눈이 되어', note: '비와 눈으로 내림', cat: 'days' },
        river: { label: '강', volume: 2.12, out: 45.5, how: '바다로 흘러', note: '바다로 흘러 나감', cat: 'days' },
        soil: { label: '토양 수분', volume: 17, out: 65.5, how: '증발하거나 식물에 빨려', note: '증발하거나 식물이 빨아올림', cat: 'years' },
        lake: { label: '호수', volume: 176, tau: 10, how: '강으로 흘러', note: '강으로 흘러 나감 (호수마다 크게 다름)', cat: 'years' },
        ground: { label: '지하수', volume: 23400, tau: 1400, how: '샘과 강으로 조금씩 새어', note: '샘과 강으로 조금씩 새어 나감', cat: 'ages' },
        ice: { label: '빙하', volume: 24064, tau: 10000, how: '녹거나 바다로 떨어져', note: '녹거나 바다로 떨어져 나감', cat: 'ages' },
        ocean: { label: '바다', volume: 1338000, out: 436.5, how: '증발해', note: '증발', cat: 'ages' },
    };
    const FLUX = { evapSea: 436.5, rainSea: 391, evapLand: 65.5, rainLand: 111, runoff: 45.5 };
    const tauOf = r => r.tau !== undefined ? r.tau : r.volume / r.out;

    // Carbon, in Gt of carbon: the air today and before industry, the natural
    // exchanges, and how hard the ocean and land pull on the excess.
    const C_NOW = 870, C_PRE = 590, K_SINK = 0.018, GT_PER_PPM = 2.13, YEARS = 50;
    const NAT_LAND = 120, NAT_SEA = 80, LAND_C = 2300, SEA_C = 38000;
    const EMITS = {
        zero: { label: '배출 없음', hint: '0', E: 0 },
        half: { label: '절반으로', hint: '한 해 47억 t', E: 4.7 },
        now: { label: '지금처럼', hint: '한 해 95억 t', E: 9.5 },
        double: { label: '두 배로', hint: '한 해 190억 t', E: 19 },
    };
    const carbonAt = (E, t) => { const eq = C_PRE + E / K_SINK; return eq + (C_NOW - eq) * Math.exp(-K_SINK * t); };

    const state = {
        mode: 'spheres',
        phenomenon: 'volcano', reservoir: 'atmo', emit: 'now',
        seen: new Set(),
        progress: 0, prediction: null,
    };
    let running = false, frameId = 0, lastStamp = 0;

    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const fmtN = n => Math.round(n).toLocaleString('ko-KR');
    const fmtVol = thousandKm3 => { const v = thousandKm3 * 1000; return v >= 1e8 ? `${(v / 1e8).toFixed(1)}억 km³` : v >= 1e5 ? `${fmtN(v / 1e4)}만 km³` : v >= 1e4 ? `${(v / 1e4).toFixed(1)}만 km³` : `${fmtN(v)} km³`; };
    const fmtTime = years => {
        const days = years * 365;
        if (days < 60) return `${days < 10 ? days.toFixed(1) : Math.round(days)}일`;
        if (years < 2) return `${Math.round(years * 12)}개월`;
        if (years < 100) return `${Math.round(years)}년`;
        if (years < 1000) return `약 ${Math.round(years / 10) * 10}년`;
        return `약 ${fmtN(Math.round(years / 100) * 100)}년`;
    };
    const gt = g => g === 0 ? '0' : `${fmtN(g >= 100 ? Math.round(g / 10) * 100 : g * 10)}억 t`;   // Gt of carbon, said in 억 톤
    const jong = w => { const c = w.charCodeAt(w.length - 1); return c >= 0xac00 && c <= 0xd7a3 ? (c - 0xac00) % 28 : -1; };
    const iga = w => w + (jong(w) > 0 ? '이' : '가');
    const ppm = g => Math.round(g / GT_PER_PPM);

    /* ------------------------------------------------------------ models */
    function analyse() {
        if (state.mode === 'spheres') {
            const ph = PHENOMENA[state.phenomenon];
            return { kind: 'spheres', ph, verdict: ph.cat };
        }
        if (state.mode === 'water') {
            const r = RESERVOIRS[state.reservoir];
            return { kind: 'water', r, tau: tauOf(r), verdict: r.cat };
        }
        const em = EMITS[state.emit];
        const end = carbonAt(em.E, YEARS), change = end / C_NOW - 1;
        const sinkNow = K_SINK * (C_NOW - C_PRE);
        return { kind: 'carbon', em, end, change, sinkNow, verdict: change < -0.05 ? 'down' : change > 0.05 ? 'up' : 'same' };
    }
    const runSeconds = () => state.mode === 'spheres' ? 6 : state.mode === 'water' ? 7 : 8;

    /* ---------------------------------------------------------- controls */
    function pickRow(legend, name, options, current, cols) {
        return `<fieldset class="pick-field"><legend>${legend}</legend>` +
            `<div class="pick-buttons cols${cols}" data-pick="${name}">` +
            options.map(o => `<button type="button" data-value="${o.value}" class="${o.value === String(current) ? 'selected' : ''} ${o.cls || ''}">` +
                `${o.label}${o.hint ? `<small>${o.hint}</small>` : ''}</button>`).join('') +
            `</div></fieldset>`;
    }
    const opts = table => Object.entries(table).map(([k, v]) => ({ value: k, label: v.label, hint: v.hint }));

    function buildControls() {
        if (state.mode === 'spheres') {
            controlArea.innerHTML = pickRow('현상', 'phenomenon', Object.entries(PHENOMENA).map(([k, v]) => ({ value: k, label: v.label, hint: state.seen.has(k) ? '확인함' : '', cls: state.seen.has(k) ? 'done' : '' })), state.phenomenon, 2);
        } else if (state.mode === 'water') {
            controlArea.innerHTML = pickRow('물이 머무는 곳', 'reservoir', opts(RESERVOIRS), state.reservoir, 4);
        } else {
            controlArea.innerHTML = pickRow('화석 연료에서 나오는 탄소', 'emit', opts(EMITS), state.emit, 2);
        }
        controlArea.querySelectorAll('[data-pick]').forEach(group => {
            group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
                state[group.dataset.pick] = button.dataset.value;
                group.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
                buildPrediction();
                settingsChanged();
            }));
        });
    }

    const PRED_SPHERES = [
        { value: 'geo-hydro', label: '지권과 수권' }, { value: 'geo-atmo', label: '지권과 기권' }, { value: 'hydro-atmo', label: '수권과 기권' },
        { value: 'bio', label: '생물권과 다른 권' }, { value: 'space', label: '외권과 다른 권' },
    ];
    const PRED_WATER = [{ value: 'days', label: '며칠 ~ 몇 주' }, { value: 'years', label: '몇 달 ~ 몇십 년' }, { value: 'ages', label: '몇백 년 ~ 몇만 년' }];
    const PRED_CARBON = [{ value: 'down', label: '줄어든다' }, { value: 'same', label: '거의 그대로 (±5 %)' }, { value: 'up', label: '늘어난다' }];

    function buildPrediction() {
        state.prediction = null;
        window.scienceInvalidatePrediction?.();
        const list = state.mode === 'spheres' ? PRED_SPHERES : state.mode === 'water' ? PRED_WATER : PRED_CARBON;
        predictionLegend.textContent = state.mode === 'spheres' ? `'${PHENOMENA[state.phenomenon].label}'은 어느 권 사이의 상호작용일까요?`
            : state.mode === 'water' ? `${RESERVOIRS[state.reservoir].label}에 든 물은 얼마 만에 모두 새 물로 바뀔까요?`
                : `${EMITS[state.emit].label} 하면 50년 뒤 대기의 탄소는?`;
        predictionArea.className = `prediction-buttons${list.length === 3 || list.length === 5 ? ' three' : ''}`;
        predictionArea.innerHTML = list.map(o => `<button type="button" data-prediction="${o.value}">${o.label}</button>`).join('');
        predictionArea.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            state.prediction = button.dataset.prediction; window.scienceInvalidatePrediction?.();
            predictionArea.querySelectorAll('button').forEach(b => b.classList.toggle('selected', b === button));
        }));
    }

    /* ----------------------------------------------------------- visuals */
    const CAT_LABEL = { 'geo-hydro': '지권과 수권', 'geo-atmo': '지권과 기권', 'hydro-atmo': '수권과 기권', bio: '생물권과 다른 권', space: '외권과 다른 권' };

    /* 현상 장면: 왼쪽에 실제로 일어나는 일을 움직여 보이고, 오른쪽 카드는 지켜보는 동안에만 '주는 권 → 받는 권'을 드러낸다 */
    const n1 = v => (+v).toFixed(1);
    const lab = (x, y, s, color = '#334155', anchor = 'middle') => `<text class="scene-label" x="${n1(x)}" y="${n1(y)}" text-anchor="${anchor}" style="fill:${color}">${s}</text>`;
    const chip = (x, y, t) => `<rect x="${n1(x - 4)}" y="${n1(y - 15)}" width="${t.length * 14 + 8}" height="21" rx="6" fill="rgba(255,255,255,.88)"/>` + lab(x, y, t, '#0c4a6e', 'start');
    const hsh = k => { const v = Math.sin(k * 91.7 + 13.3) * 43758.5453; return v - Math.floor(v); };
    const easeIO = q => q < 0.5 ? 2 * q * q : 1 - 2 * (1 - q) * (1 - q);
    const seg = (p, a, b) => clamp((p - a) / (b - a), 0, 1);
    const SC = { x: 10, y: 24, w: 288, h: 184 };
    const sky = (top = '#dbeafe', bottom = '#f0f9ff') => `<defs><linearGradient id="esSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>` +
        `<linearGradient id="esSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5aa9d6"/><stop offset="1" stop-color="#2d7bb0"/></linearGradient>` +
        `<clipPath id="esClip"><rect x="${SC.x}" y="${SC.y}" width="${SC.w}" height="${SC.h}" rx="8"/></clipPath></defs>` +
        `<rect x="${SC.x}" y="${SC.y}" width="${SC.w}" height="${SC.h}" rx="8" fill="url(#esSky)"/>`;
    const sunAt = (x, y, r = 14) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fbbf24" stroke="#f59e0b" stroke-width="1.5"/>` +
        [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i * Math.PI / 4; return `<line x1="${n1(x + Math.cos(a) * (r + 4))}" y1="${n1(y + Math.sin(a) * (r + 4))}" x2="${n1(x + Math.cos(a) * (r + 9))}" y2="${n1(y + Math.sin(a) * (r + 9))}" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>`; }).join('');
    const cloudBlob = (x, y, s, fill = '#ffffff', stroke = '#94a3b8') => `<g><circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(s)}" fill="${fill}" stroke="${stroke}" stroke-width="1"/><circle cx="${n1(x + s * 0.9)}" cy="${n1(y + s * 0.25)}" r="${n1(s * 0.75)}" fill="${fill}" stroke="${stroke}" stroke-width="1"/><circle cx="${n1(x - s * 0.9)}" cy="${n1(y + s * 0.3)}" r="${n1(s * 0.65)}" fill="${fill}" stroke="${stroke}" stroke-width="1"/><rect x="${n1(x - s * 1.4)}" y="${n1(y + s * 0.2)}" width="${n1(s * 2.9)}" height="${n1(s * 0.7)}" fill="${fill}"/></g>`;
    const seaBand = (y, phase = 0, amp = 2) => {
        let d = `M${SC.x} ${y}`;
        for (let x = SC.x; x <= SC.x + SC.w; x += 6) d += ` L${x} ${n1(y + Math.sin(x / 14 + phase) * amp)}`;
        return `<path d="${d} L${SC.x + SC.w} ${SC.y + SC.h} L${SC.x} ${SC.y + SC.h} Z" fill="url(#esSea)"/>`;
    };
    const upArrow = (x, y1, y2, color, w = 2) => `<line x1="${n1(x)}" y1="${n1(y1)}" x2="${n1(x)}" y2="${n1(y2 + 6)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/><polygon points="${n1(x)},${n1(y2)} ${n1(x - 4)},${n1(y2 + 7)} ${n1(x + 4)},${n1(y2 + 7)}" fill="${color}"/>`;
    const lineArrow = (x1, y1, x2, y2, color, w = 2.4) => { const a = Math.atan2(y2 - y1, x2 - x1), c = Math.cos(a), s = Math.sin(a); return `<line x1="${n1(x1)}" y1="${n1(y1)}" x2="${n1(x2 - c * 7)}" y2="${n1(y2 - s * 7)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/><polygon points="${n1(x2)},${n1(y2)} ${n1(x2 - 9 * c + 4 * s)},${n1(y2 - 9 * s - 4 * c)} ${n1(x2 - 9 * c - 4 * s)},${n1(y2 - 9 * s + 4 * c)}" fill="${color}"/>`; };
    const co2 = (x, y, o = 1) => `<g opacity="${o.toFixed(2)}"><circle cx="${n1(x - 6)}" cy="${n1(y)}" r="3.5" fill="#ef4444"/><circle cx="${n1(x + 6)}" cy="${n1(y)}" r="3.5" fill="#ef4444"/><circle cx="${n1(x)}" cy="${n1(y)}" r="4.2" fill="#334155"/></g>`;
    const o2 = (x, y, o = 1) => `<g opacity="${o.toFixed(2)}"><circle cx="${n1(x - 3.5)}" cy="${n1(y)}" r="3.5" fill="#ef4444"/><circle cx="${n1(x + 3.5)}" cy="${n1(y)}" r="3.5" fill="#ef4444"/></g>`;
    const thermo = (x, y, level) => `<rect x="${x - 5}" y="${y}" width="10" height="56" rx="5" fill="#ffffff" stroke="#64748b"/><circle cx="${x}" cy="${y + 60}" r="8" fill="#dc2626" stroke="#64748b"/><rect x="${x - 2.5}" y="${n1(y + 52 - 46 * level)}" width="5" height="${n1(46 * level + 6)}" fill="#dc2626"/>`;

    const SCENES = {
        volcano(p) {
            let s = sky('#cfe3f6', '#eef6fc');
            const strat = 86, plume = seg(p, 0.05, 0.55), spread = easeIO(seg(p, 0.35, 0.95));
            s += `<line x1="${SC.x}" y1="${strat}" x2="${SC.x + SC.w}" y2="${strat}" stroke="#94a3b8" stroke-dasharray="5 4"/>` + lab(SC.x + 8, strat - 6, '성층권', '#475569', 'start');
            s += sunAt(276, 44, 12);
            // 햇빛: 퍼진 재 띠에 닿으면 일부가 되튄다
            const bandL = 160 - 135 * spread, bandR = 160 + 135 * spread;
            [[250, 0], [205, 1], [120, 2]].forEach(([gx, i]) => {
                const sx = gx + 36, sy = SC.y + 2, hit = p > 0.35 && gx > bandL && gx < bandR;
                const ex = hit ? sx + (gx - sx) * ((strat - 4 - sy) / (190 - sy)) : gx, ey = hit ? strat - 4 : 190;
                s += lineArrow(sx, sy, ex, ey, '#f59e0b', 2);
                if (hit) s += lineArrow(ex, ey, ex - 16, ey - 22, '#f59e0b', 2);
            });
            if (spread > 0) s += `<rect x="${n1(bandL)}" y="${strat - 4}" width="${n1(bandR - bandL)}" height="14" rx="7" fill="#9ca3af" opacity="${n1(0.35 + 0.35 * spread)}"/>`;
            // 화산과 분출 기둥
            s += `<path d="M${SC.x} 196 Q80 190 100 192 L148 128 L172 128 L222 192 Q260 190 ${SC.x + SC.w} 194 L${SC.x + SC.w} ${SC.y + SC.h} L${SC.x} ${SC.y + SC.h} Z" fill="#8b7a62" stroke="#6b5b45" stroke-width="1.2"/>`;
            s += `<path d="M120 192 L148 128 L156 128 L132 192 Z" fill="#a08d72" opacity=".7"/>`;
            if (p > 0) {
                s += `<ellipse cx="160" cy="129" rx="12" ry="3.5" fill="#f97316"/>`;
                for (let i = 0; i < 16; i += 1) {
                    const life = (p * 5 + hsh(i)) % 1, up = Math.min(life / plume || 0, 1), y = 124 - (124 - strat - 2) * Math.min(1, life * 1.4) * plume;
                    const x = 160 + Math.sin(i * 1.7 + life * 3) * (4 + 14 * life);
                    s += `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(5 + 7 * life)}" fill="#6b7280" opacity="${n1(0.75 - 0.45 * life + 0 * up)}"/>`;
                }
            }
            s += thermo(36, 124, 0.7 - 0.35 * easeIO(seg(p, 0.55, 1))) + lab(36, 116, '기온');
            return s;
        },
        typhoon(p) {
            let s = sky('#cfe3f6', '#eef6fc') + sunAt(42, 44, 12);
            s += seaBand(156, p * 8, 2.5) + chip(SC.x + 14, 198, '따뜻한 바다');
            for (let i = 0; i < 9; i += 1) {
                const x = 40 + i * 30, life = (p * 4 + hsh(i)) % 1, y = 150 - life * 70;
                if (p > 0) s += `<path d="M${x} ${n1(y + 14)} q4 -5 0 -10 q-4 -5 0 -10" fill="none" stroke="#0369a1" stroke-width="1.8" opacity="${n1(1 - life)}"/>`;
            }
            const g = easeIO(seg(p, 0.1, 0.9)), top = 120 - 80 * g;
            const blobs = [];
            for (let k = 0; k <= 5; k += 1) { const y = 122 - (122 - top) * k / 5, sz = (16 + 4 * Math.sin(k) + 8 * g) * (0.6 + 0.4 * g); if (g > 0 || k === 0) blobs.push([160 + (k % 2 ? 6 : -6), y, sz]); }
            blobs.forEach(([x, y, r]) => { [[0, 0, 1], [r * 0.85, r * 0.2, 0.75], [-r * 0.85, r * 0.25, 0.7]].forEach(([ox, oy, f]) => { s += `<circle cx="${n1(x + ox)}" cy="${n1(y + oy)}" r="${n1(r * f + 1.3)}" fill="#94a3b8"/>`; }); });
            blobs.forEach(([x, y, r]) => { [[0, 0, 1], [r * 0.85, r * 0.2, 0.75], [-r * 0.85, r * 0.25, 0.7]].forEach(([ox, oy, f]) => { s += `<circle cx="${n1(x + ox)}" cy="${n1(y + oy)}" r="${n1(r * f)}" fill="#ffffff"/>`; }); });
            if (g > 0.6) s += `<ellipse cx="160" cy="${n1(top)}" rx="${n1(70 * (g - 0.4))}" ry="10" fill="#ffffff" stroke="#94a3b8"/>`;
            if (g > 0.3) { const a = p * 12; s += `<ellipse cx="160" cy="140" rx="70" ry="10" fill="none" stroke="#0284c7" stroke-width="2" stroke-dasharray="10 8" stroke-dashoffset="${n1(-a * 10)}"/>`; }
            s += lab(250, 118, '수증기', '#0369a1');
            return s;
        },
        river(p) {
            let s = sky();
            const deep = 22 * easeIO(seg(p, 0, 1)), flow = p * 120;
            // 산에서 바다로 내려가는 땅, 강이 그 위를 깎는다
            s += `<path d="M${SC.x} 70 L90 74 L210 160 L232 172 L232 ${SC.y + SC.h} L${SC.x} ${SC.y + SC.h} Z" fill="#a3895f" stroke="#7c6847"/>`;
            s += `<path d="M30 76 L90 80 L${n1(150)} ${n1(124 + deep * 0.6)} L210 164" fill="none" stroke="#7c6847" stroke-width="1" stroke-dasharray="3 3"/>`;
            s += `<path d="M${SC.x} 70 L30 64 L60 50 L90 74 Z" fill="#8a9a6a" stroke="#6b7a50"/>`;
            s += `<path d="M${SC.x} 178 L232 178 L${SC.x + SC.w} 178 L${SC.x + SC.w} ${SC.y + SC.h} L232 ${SC.y + SC.h} Z" fill="url(#esSea)" opacity=".0"/>`;
            s += `<rect x="226" y="172" width="${SC.x + SC.w - 226}" height="${SC.y + SC.h - 172}" fill="url(#esSea)"/>` + chip(252, 200, '바다');
            // 강물(깎인 골짜기 속)
            s += `<path d="M40 ${n1(78 + deep * 0.2)} L90 ${n1(82 + deep * 0.5)} L150 ${n1(126 + deep * 0.6)} L212 166 L232 174" fill="none" stroke="#2f86c4" stroke-width="5" stroke-linecap="round"/>`;
            s += `<path d="M40 ${n1(78 + deep * 0.2)} L90 ${n1(82 + deep * 0.5)} L150 ${n1(126 + deep * 0.6)} L212 166 L232 174" fill="none" stroke="#bfe3fb" stroke-width="1.6" stroke-dasharray="6 10" stroke-dashoffset="${n1(-flow)}"/>`;
            // 실려 가는 모래, 바닷가에 쌓이는 삼각주
            const pts = [[40, 78], [90, 82], [150, 126], [212, 166], [232, 174]];
            for (let i = 0; i < 8 && p > 0; i += 1) {
                const u = (p * 3 + hsh(i)) % 1, k = Math.min(3, Math.floor(u * 4)), f = u * 4 - k;
                const x = pts[k][0] + (pts[k + 1][0] - pts[k][0]) * f, y = pts[k][1] + (pts[k + 1][1] - pts[k][1]) * f + deep * 0.4 - 4;
                s += `<circle cx="${n1(x)}" cy="${n1(y)}" r="2.6" fill="#92400e"/>`;
            }
            const d = 6 + 30 * easeIO(seg(p, 0.2, 1));
            s += `<path d="M226 172 Q${n1(232 + d)} ${n1(172 + d * 0.15)} ${n1(232 + d * 0.6)} 184 L226 184 Z" fill="#d6b97a" stroke="#a3895f"/>`;
            s += lab(240, 150, '흙과 모래', '#92400e', 'start');
            return s;
        },
        photo(p) {
            let s = sky('#dbeafe', '#f0f9ff') + sunAt(44, 46, 13);
            s += `<rect x="${SC.x}" y="184" width="${SC.w}" height="${SC.y + SC.h - 184}" fill="#a3895f"/><rect x="${SC.x}" y="180" width="${SC.w}" height="6" fill="#7fb069"/>`;
            s += `<rect x="150" y="120" width="12" height="62" fill="#7c5a3a"/><path d="M156 150 L134 132 M158 140 L180 124" stroke="#7c5a3a" stroke-width="4" stroke-linecap="round"/>`;
            [[156, 96, 36], [128, 112, 24], [186, 110, 26], [156, 70, 24]].forEach(([x, y, r]) => { s += `<circle cx="${x}" cy="${y}" r="${r}" fill="#4f9a6a" stroke="#3a7a52"/>`; });
            [[0, 1], [1, 2], [2, 3]].forEach((_, i) => { s += lineArrow(64 + i * 8, 64 + i * 4, 120 + i * 6, 90 + i * 8, '#f59e0b', 1.8); });
            for (let i = 0; i < 6 && p > 0; i += 1) {
                const u = (p * 2.5 + i / 6) % 1, sx = 270 - (i % 3) * 14, sy = 60 + i * 18, ex = 172, ey = 100;
                s += co2(sx + (ex - sx) * u, sy + (ey - sy) * u, u < 0.85 ? 1 : (1 - u) / 0.15);
            }
            for (let i = 0; i < 4 && p > 0; i += 1) {
                const u = (p * 2.5 + i / 4 + 0.1) % 1, sx = 132, sy = 104, ex = 40 + i * 12, ey = 150 - i * 16;
                s += o2(sx + (ex - sx) * u, sy + (ey - sy) * u, u > 0.15 ? 1 : u / 0.15);
            }
            s += lab(266, 46, '이산화 탄소', '#334155') + lab(52, 172, '산소', '#b91c1c');
            return s;
        },
        wind(p) {
            let s = sky();
            const g = easeIO(seg(p, 0, 0.9)), amp = 1.5 + 9 * g;
            s += seaBand(128, -p * 30, amp);
            for (let k = 0; k < 3; k += 1) {
                const y = 44 + k * 22;
                for (let m = 0; m < 4; m += 1) {
                    const x = SC.x + ((m * 80 + k * 30 + p * 260) % (SC.w + 60)) - 50;
                    s += lineArrow(x, y, x + 46, y, '#64748b', 2);
                }
            }
            const by = 128 + Math.sin(150 / 14 - p * 30) * amp;
            s += `<rect x="146" y="${n1(by - 14)}" width="8" height="16" rx="2" fill="#ef4444" stroke="#991b1b"/><line x1="150" y1="${n1(by - 14)}" x2="150" y2="${n1(by - 24)}" stroke="#334155" stroke-width="1.5"/>`;
            s += lab(SC.x + 10, 34, '바람', '#475569', 'start') + chip(SC.x + 14, 198, '바다');
            for (let i = 0; i < 4; i += 1) { const x = 40 + i * 70, y = 168; s += lineArrow(x, y, x + 34 * (0.3 + g), y, '#e0f2fe', 2.2); }
            return s;
        },
        cave(p) {
            let s = sky('#dbeafe', '#f0f9ff');
            s += `<rect x="${SC.x}" y="70" width="${SC.w}" height="16" fill="#8a6f4b"/><rect x="${SC.x}" y="66" width="${SC.w}" height="5" fill="#7fb069"/>`;
            s += `<rect x="${SC.x}" y="86" width="${SC.w}" height="${SC.y + SC.h - 86}" fill="#cbd5e1"/>`;
            for (let r = 0; r < 6; r += 1) for (let c = 0; c < 10; c += 1) s += `<rect x="${SC.x + c * 30 + (r % 2) * 15 - 15}" y="${86 + r * 20}" width="30" height="20" fill="none" stroke="#94a3b8" stroke-width=".8"/>`;
            s += lab(SC.x + SC.w - 8, 104, '석회암', '#334155', 'end');
            for (let i = 0; i < 10 && p > 0; i += 1) {
                const u = (p * 4 + hsh(i)) % 1, x = 30 + i * 26;
                if (u < 0.4) s += `<path d="M${x} ${n1(28 + u * 90)} q-2 4 0 6 q2 -2 0 -6" fill="#3b82f6"/>`;
                else s += `<circle cx="${n1(x + Math.sin(i) * 4)}" cy="${n1(66 + (u - 0.4) * 110)}" r="2" fill="#3b82f6" opacity="${n1(1 - u)}"/>`;
            }
            const g = easeIO(seg(p, 0.1, 1)), rx = 30 + 70 * g, ry = 12 + 26 * g;
            s += `<ellipse cx="160" cy="160" rx="${n1(rx)}" ry="${n1(ry)}" fill="#475569"/>`;
            for (let k = -2; k <= 2; k += 1) { const x = 160 + k * rx * 0.33, top = 160 - ry * Math.sqrt(Math.max(0, 1 - (k * 0.33) ** 2)), L = 4 + 16 * g * (1 - Math.abs(k) * 0.25); s += `<path d="M${n1(x - 4)} ${n1(top)} L${n1(x + 4)} ${n1(top)} L${n1(x)} ${n1(top + L)} Z" fill="#e2e8f0"/>`; }
            s += lab(SC.x + 10, 46, '빗물', '#1d4ed8', 'start');
            return s;
        },
        coral(p) {
            let s = sky('#9fd0ec', '#5aa9d6');
            s += `<rect x="${SC.x}" y="${SC.y}" width="${SC.w}" height="${SC.h}" rx="8" fill="url(#esSea)" opacity=".55"/>`;
            const g = easeIO(seg(p, 0.1, 1)), layers = 4, th = 6 + 26 * g;
            for (let k = 0; k < layers; k += 1) s += `<rect x="${SC.x}" y="${n1(SC.y + SC.h - th * (k + 1) / layers)}" width="${SC.w}" height="${n1(th / layers + 0.5)}" fill="${k % 2 ? '#e7dcc4' : '#d9cba8'}"/>`;
            const bed = SC.y + SC.h - th;
            [[60, '#f472b6'], [120, '#fb923c'], [190, '#f472b6'], [250, '#fb7185']].forEach(([x, c]) => {
                s += `<path d="M${x} ${n1(bed)} L${x} ${n1(bed - 26)} M${x} ${n1(bed - 14)} L${x - 10} ${n1(bed - 28)} M${x} ${n1(bed - 18)} L${x + 10} ${n1(bed - 32)}" stroke="${c}" stroke-width="5" stroke-linecap="round" fill="none"/>`;
            });
            for (let i = 0; i < 10 && p > 0; i += 1) {
                const u = (p * 3 + hsh(i)) % 1, x = 30 + i * 26 + Math.sin(u * 6 + i) * 5, y = 40 + u * (bed - 46);
                s += `<path d="M${n1(x - 5)} ${n1(y)} a5 4 0 0 1 10 0 Z" fill="#fff7ed" stroke="#b45309" stroke-width=".8"/>`;
            }
            s += lab(SC.x + SC.w - 8, n1(SC.y + SC.h - 4), '석회암 층', '#334155', 'end') + chip(SC.x + 12, 44, '바다');
            return s;
        },
        sun(p) {
            let s = sky('#cfe3f6', '#eef6fc') + sunAt(48, 48, 16);
            s += seaBand(146, p * 6, 2);
            const warm = easeIO(seg(p, 0, 0.6));
            s += `<rect x="${SC.x}" y="150" width="${SC.w}" height="${SC.y + SC.h - 150}" fill="#f59e0b" opacity="${n1(0.18 * warm)}"/>`;
            [[0], [1], [2], [3]].forEach((_, i) => { s += lineArrow(64 + i * 6, 64 + i * 6, 110 + i * 50, 144, '#f59e0b', 2); });
            for (let i = 0; i < 8 && p > 0; i += 1) {
                const x = 120 + i * 20, life = (p * 4 + hsh(i)) % 1, y = 142 - life * 72;
                s += `<path d="M${x} ${n1(y + 14)} q4 -5 0 -10 q-4 -5 0 -10" fill="none" stroke="#0369a1" stroke-width="1.8" opacity="${n1(1 - life)}"/>`;
            }
            const c = easeIO(seg(p, 0.3, 1));
            if (c > 0) s += cloudBlob(200, 52, 10 + 12 * c);
            s += chip(SC.x + 14, 198, '바다') + lab(262, 104, '수증기', '#0369a1');
            return s;
        },
        seaco2(p) {
            let s = sky();
            s += seaBand(110, p * 6, 2) + chip(SC.x + 14, 198, '바다');
            s += `<path d="M230 110 L236 72 L244 72 L246 60 L254 60 L256 72 L270 72 L276 110 Z" fill="#94a3b8" stroke="#64748b"/>`;
            for (let i = 0; i < 4 && p > 0; i += 1) { const u = (p * 2 + i / 4) % 1; s += `<circle cx="${n1(250 - u * 20)}" cy="${n1(56 - u * 26)}" r="${n1(5 + 6 * u)}" fill="#9ca3af" opacity="${n1(0.7 - 0.6 * u)}"/>`; }
            for (let i = 0; i < 9 && p > 0; i += 1) {
                const u = (p * 2.2 + hsh(i)) % 1, x = 30 + i * 22 + Math.sin(u * 5 + i) * 6;
                if (u < 0.55) s += co2(x, 40 + u / 0.55 * 66, 1);
                else s += `<circle cx="${n1(x)}" cy="${n1(116 + (u - 0.55) * 120)}" r="2.6" fill="#e2e8f0" opacity="${n1(1 - (u - 0.55) / 0.45 * 0.6)}"/>`;
            }
            s += lab(SC.x + 10, 40, '이산화 탄소', '#334155', 'start');
            return s;
        },
        tide(p) {
            let s = sky('#e2e8f0', '#f8fafc');
            s += `<rect x="${SC.x}" y="${SC.y}" width="${SC.w}" height="${SC.h}" rx="8" fill="#1e293b" opacity=".06"/>`;
            const ex = 92, ey = 112, spin = p * Math.PI * 4;   // 지구가 두 바퀴 돈다
            s += `<ellipse cx="${ex}" cy="${ey}" rx="60" ry="46" fill="#7cc0e4" stroke="#3b82b8"/>`;
            s += `<circle cx="${ex}" cy="${ey}" r="42" fill="#6fae7a" stroke="#4a7f55"/>`;
            const hx = ex + Math.cos(spin) * 46, hy = ey + Math.sin(spin) * 46 * 0.98;
            s += `<circle cx="${n1(hx)}" cy="${n1(hy)}" r="5" fill="#dc2626" stroke="#ffffff" stroke-width="1.4"/>`;
            s += `<circle cx="244" cy="${ey}" r="13" fill="#e5e7eb" stroke="#9ca3af"/>` + lab(244, ey + 30, '달');
            s += lineArrow(226, ey, 166, ey, '#64748b', 1.8);
            // 바닷가: 빨간 점의 물 높이
            const level = Math.cos(2 * spin), wy = 186 - 8 * level;
            s += `<rect x="186" y="150" width="104" height="54" rx="4" fill="#ffffff" stroke="#cbd5e1"/>`;
            s += `<path d="M186 ${n1(wy)} L290 ${n1(wy)} L290 204 L186 204 Z" fill="#7cc0e4"/><path d="M196 204 L290 166 L290 204 Z" fill="#d6b97a" opacity=".9"/>`;
            s += lab(238, 166, level > 0.3 ? '밀물' : level < -0.3 ? '썰물' : '', '#334155');
            return s;
        },
    };

    function sphereCard(key, y, shown, role) {
        if (!shown) return `<rect x="316" y="${y}" width="134" height="58" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-dasharray="5 4"/>` + lab(383, y + 25, role, '#64748b') + lab(383, y + 46, '?', '#94a3b8');
        const sp = SPHERES[key];
        return `<g data-sphere="${key}"><rect x="316" y="${y}" width="134" height="58" rx="10" fill="#f0fdf4" stroke="#4d9a7a" stroke-width="1.6"/>` + lab(383, y + 25, role, '#475569') + `<text class="sphere-name" x="383" y="${y + 47}" text-anchor="middle">${sp.label}</text></g>`;
    }
    function renderSpheres(a) {
        const p = state.progress, ph = a.ph;
        let s = `<g clip-path="url(#esClip)">${(SCENES[state.phenomenon] || SCENES.volcano)(p)}</g>`;
        s += `<rect x="${SC.x}" y="${SC.y}" width="${SC.w}" height="${SC.h}" rx="8" fill="none" stroke="#94a3b8" stroke-width="1.2"/>`;
        s += lab(SC.x, 16, ph.label, '#0f172a', 'start');
        const showFrom = p >= 0.35, showTo = p >= 0.7;
        s += sphereCard(ph.from, 30, showFrom, '주는 권') + sphereCard(ph.to, 136, showTo, '받는 권');
        s += `<line x1="383" y1="92" x2="383" y2="126" stroke="#c2410c" stroke-width="3" stroke-linecap="round"/><polygon points="383,134 377,124 389,124" fill="#c2410c"/>`;
        if (p > 0.35 && p < 1) s += `<circle cx="383" cy="${n1(94 + ((p * 3) % 1) * 30)}" r="5" fill="#f59e0b" stroke="#ffffff"/>`;
        return s;
    }
    // 기록표: 주는 권(세로) × 받는 권(가로). 확인한 관계에 점을 찍는다
    function graphSpheres(a) {
        const x0 = 110, y0 = 40, cw = 68, ch = 29;
        let s = lab(x0 - 10, 22, '주는↓ 받는→', '#475569', 'end');
        SPHERE_KEYS.forEach((k, i) => { s += `<text class="table-head" x="${x0 + i * cw + cw / 2 - 2}" y="28" text-anchor="middle">${SPHERES[k].label}</text>`; });
        SPHERE_KEYS.forEach((from, r) => {
            s += `<text class="table-head" x="${x0 - 10}" y="${y0 + r * ch + 19}" text-anchor="end">${SPHERES[from].label}</text>`;
            SPHERE_KEYS.forEach((to, c) => {
                const count = Object.entries(PHENOMENA).filter(([id, ph]) => ph.from === from && ph.to === to && (state.seen.has(id) || (state.progress >= 1 && id === state.phenomenon))).length;
                const mine = state.progress >= 1 && a.ph.from === from && a.ph.to === to;
                s += `<rect x="${x0 + c * cw}" y="${y0 + r * ch}" width="${cw - 4}" height="${ch - 4}" rx="5" fill="${from === to ? '#eef2f6' : count ? '#dcfce7' : '#f8fafc'}" stroke="${mine ? '#c2410c' : '#d5dee6'}" stroke-width="${mine ? 2.2 : 1}"/>`;
                if (count) s += `<circle cx="${x0 + c * cw + cw / 2 - 2}" cy="${y0 + r * ch + ch / 2 - 2}" r="5.5" fill="#15803d"/>` + (count > 1 ? lab(x0 + c * cw + cw / 2 + 12, y0 + r * ch + 19, String(count), '#15803d') : '');
            });
        });
        return s;
    }

    function renderWater(a) {
        const { r, tau } = a;
        const p = state.progress;
        const t = p * tau; // One mean residence time, not complete replacement.
        const dyed = Math.exp(-t / tau); // Constant-volume, completely mixed illustrative reservoir.
        let out = '';
        // the budget on the left
        out += `<rect class="sky" x="20" y="28" width="280" height="34" rx="4"/>`;
        out += `<text class="trait-text" x="160" y="49" text-anchor="middle">대기 ${fmtVol(RESERVOIRS.atmo.volume)}</text>`;
        out += `<rect class="sea" x="20" y="130" width="146" height="60" rx="3"/>`;
        out += `<polygon class="land" points="166,190 166,150 200,118 260,112 300,126 300,190"/>`;
        out += `<text class="trait-text" x="92" y="180" text-anchor="middle">바다 ${fmtVol(RESERVOIRS.ocean.volume)}</text>`;
        out += `<text class="trait-text" x="236" y="180" text-anchor="middle">육지</text>`;
        const arrow = (x, y1, y2, cls) => { const up = y2 < y1; return `<line class="flow ${cls}" x1="${x}" y1="${y1}" x2="${x}" y2="${y2}"/><polygon fill="${cls === 'rain' ? '#9fd8ff' : '#0284c7'}" points="${x},${y2} ${x - 4},${up ? y2 + 7 : y2 - 7} ${x + 4},${up ? y2 + 7 : y2 - 7}"/>`; };
        out += arrow(56, 128, 64, '') + `<text class="flow-text" x="60" y="98">증발 ${FLUX.evapSea}</text>`;
        out += arrow(130, 64, 128, 'rain') + `<text class="flow-text" x="134" y="98">강수 ${FLUX.rainSea}</text>`;
        out += arrow(206, 114, 64, '') + `<text class="flow-text" x="210" y="92">증발 ${FLUX.evapLand}</text>`;
        out += arrow(272, 64, 110, 'rain') + `<text class="flow-text" x="276" y="92" text-anchor="start">강수 ${FLUX.rainLand}</text>`;
        out += `<line class="flow river" x1="214" y1="160" x2="172" y2="160"/><polygon fill="#7fc8ff" points="170,160 177,156 177,164"/><text class="flow-text" x="194" y="173" text-anchor="middle">강물 ${FLUX.runoff}</text>`;
        // where the chosen store sits
        const spot = { atmo: [20, 28, 280, 34], ocean: [20, 130, 146, 60], river: [166, 150, 50, 40], soil: [216, 118, 60, 30], lake: [230, 128, 40, 22], ground: [180, 166, 110, 22], ice: [196, 112, 30, 12] }[state.reservoir];
        out += `<rect fill="none" stroke="#d97706" stroke-width="2" stroke-dasharray="4 3" x="${spot[0]}" y="${spot[1]}" width="${spot[2]}" height="${spot[3]}" rx="3"/>`;
        // the tank on the right: the dyed water that was there at the start drains away
        const TX = 336, TY = 44, TW = 100, TH = 126;
        out += `<text class="gen-text" x="${TX + TW / 2}" y="34" text-anchor="middle">${r.label} ${fmtVol(r.volume)}</text>`;
        out += `<rect class="tank" x="${TX}" y="${TY}" width="${TW}" height="${TH}" rx="4"/>`;
        out += `<rect class="new-water" x="${TX + 2}" y="${TY + 2}" width="${TW - 4}" height="${(TH - 4) * (1 - dyed)}"/>`;
        out += `<rect class="old-water" x="${TX + 2}" y="${(TY + 2 + (TH - 4) * (1 - dyed)).toFixed(1)}" width="${TW - 4}" height="${((TH - 4) * dyed).toFixed(1)}"/>`;
        out += `<text class="trait-text" x="${TX + TW / 2}" y="${TY + TH / 2 + 3}" text-anchor="middle">처음 물 ${Math.round(dyed * 100)} %</text>`;
        out += `<text class="trait-text" x="${TX + TW / 2}" y="${TY + TH + 14}" text-anchor="middle">지난 시간 ${fmtTime(t)}</text>`;
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${p >= 1 ? `${r.label} 평균 체류 시간 ${fmtTime(tau)}` : `${r.label} — ${r.out ? `한 해 ${r.out}천 km³가 드나듦` : '대표값으로 재 봅니다'}`}</text>`;
        out += `<text class="note-text" x="20" y="208">물 흐름: 천 km³/년 · 탱크는 완전 혼합 예시 · 평균 체류 시간 뒤에도 처음 물이 남음</text>`;
        return out;
    }

    // how long water waits in each store, one step up being ten times longer
    function graphWater(a) {
        const X0 = 60, X1 = 430, Y0 = 150, Y1 = 40;
        const keys = Object.keys(RESERVOIRS);
        const yOf = years => Y0 - Math.log10(Math.max(1, years * 365)) / 7 * (Y0 - Y1);
        const CAT_COLOR = { days: '#0284c7', years: '#059669', ages: '#ffb347' };
        let out = `<text class="axis-title" x="${X0}" y="18">물이 머무는 시간 — 든 양 ÷ 한 해 드나드는 양 (한 칸 = 10배)</text>`;
        [[1, '1일'], [30, '1개월'], [365, '1년'], [3650, '10년'], [36500, '100년'], [365000, '1,000년'], [3650000, '1만 년']].forEach(([d, lab]) => {
            const y = Y0 - Math.log10(d) / 7 * (Y0 - Y1);
            out += `<line class="grid-line" x1="${X0}" y1="${y.toFixed(1)}" x2="${X1}" y2="${y.toFixed(1)}"/><text class="axis-text" x="${X0 - 6}" y="${(y + 3.5).toFixed(1)}" text-anchor="end">${lab}</text>`;
        });
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/>`;
        const step = (X1 - X0) / keys.length, W = 34;
        keys.forEach((k, n) => {
            const r = RESERVOIRS[k], tau = tauOf(r), x = X0 + n * step + (step - W) / 2, mine = k === state.reservoir;
            const top = yOf(tau);
            out += `<rect class="bar ${mine ? 'chosen' : ''}" fill="${CAT_COLOR[r.cat]}" opacity="${mine ? 1 : 0.5}" x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${W}" height="${(Y0 - top).toFixed(1)}" rx="2"/>`;
            out += `<text class="axis-text" style="fill:${mine ? '#0f172a' : '#475569'};font-weight:${mine ? '900' : '750'}" x="${(x + W / 2).toFixed(1)}" y="${(top - 4).toFixed(1)}" text-anchor="middle">${fmtTime(tau).replace('약 ', '')}</text>`;
            out += `<text class="axis-text" style="fill:${mine ? '#0f172a' : '#475569'};font-weight:${mine ? '900' : '750'}" x="${(x + W / 2).toFixed(1)}" y="${Y0 + 14}" text-anchor="middle">${r.label}</text>`;
        });
        out += `<text class="axis-title" x="${((X0 + X1) / 2).toFixed(1)}" y="${Y0 + 34}" text-anchor="middle">양이 적고 드나듦이 많으면 금방, 양이 많고 드나듦이 적으면 아주 오래</text>`;
        return out;
    }

    function renderCarbon(a) {
        const { em } = a;
        const p = state.progress;
        const t = p * YEARS;
        const A = carbonAt(em.E, t);
        const sink = K_SINK * (A - C_PRE), sinkLand = sink * 0.55, sinkSea = sink * 0.45;
        const dash = (-p * 240).toFixed(1);
        let out = '';
        out += `<rect class="box air" x="20" y="28" width="420" height="38" rx="5"/>`;
        out += `<text class="box-text" x="230" y="45" text-anchor="middle">대기의 탄소 ${gt(A)} (${ppm(A)} ppm)</text>`;
        out += `<text class="box-sub" x="230" y="59" text-anchor="middle">산업화 전 ${gt(C_PRE)} (${ppm(C_PRE)} ppm) · 모형 초기값 ${gt(C_NOW)} (${ppm(C_NOW)} ppm)</text>`;
        out += `<rect class="box landbox" x="20" y="118" width="170" height="72" rx="5"/>`;
        out += `<text class="box-text" x="105" y="136" text-anchor="middle">숲과 흙 ${gt(LAND_C)}</text>`;
        out += `<text class="box-sub" style="fill:#059669" x="105" y="152" text-anchor="middle">더 거두는 양 한 해 ${gt(sinkLand)}</text>`;
        out += `<text class="box-sub" x="105" y="168" text-anchor="middle">광합성 ${gt(NAT_LAND)} = 호흡·분해 ${gt(NAT_LAND)}</text>`;
        out += `<rect class="box seabox" x="270" y="118" width="170" height="72" rx="5"/>`;
        out += `<text class="box-text" x="355" y="136" text-anchor="middle">바다 ${gt(SEA_C)}</text>`;
        out += `<text class="box-sub" style="fill:#059669" x="355" y="152" text-anchor="middle">더 거두는 양 한 해 ${gt(sinkSea)}</text>`;
        out += `<text class="box-sub" x="355" y="168" text-anchor="middle">녹아듦 ${gt(NAT_SEA)} = 내놓음 ${gt(NAT_SEA)}</text>`;
        out += `<rect class="box fossil" x="200" y="150" width="60" height="40" rx="4"/>`;
        out += `<text class="box-sub" style="fill:#0f172a" x="230" y="167" text-anchor="middle">화석 연료</text><text class="box-sub" x="230" y="181" text-anchor="middle">땅속</text>`;
        const vArrow = (x, y1, y2, cls, w) => { const up = y2 < y1; return `<line class="carbon-flow ${cls}" style="stroke-width:${w}" stroke-dashoffset="${up ? dash : -dash}" x1="${x}" y1="${y1}" x2="${x}" y2="${up ? y2 + 6 : y2 - 6}"/><polygon class="arrow-head ${cls}" points="${x},${y2} ${x - 4},${up ? y2 + 7 : y2 - 7} ${x + 4},${up ? y2 + 7 : y2 - 7}"/>`; };
        out += vArrow(60, 68, 116, '', 2.2) + `<text class="trait-text" x="54" y="90" text-anchor="end">광합성</text>`;
        out += vArrow(100, 116, 68, '', 2.2) + `<text class="trait-text" x="106" y="90">호흡·분해</text>`;
        if (sink > 0.05) out += vArrow(160, 68, 116, 'sink', 1 + sinkLand * 0.5);
        out += vArrow(310, 68, 116, '', 2) + `<text class="trait-text" x="304" y="90" text-anchor="end">녹아듦</text>`;
        out += vArrow(350, 116, 68, '', 2) + `<text class="trait-text" x="356" y="90">내놓음</text>`;
        if (sink > 0.05) out += vArrow(410, 68, 116, 'sink', 1 + sinkSea * 0.5);
        if (em.E > 0) out += vArrow(230, 148, 68, 'emit', 1 + em.E * 0.35) + `<text class="trait-text" style="fill:#ff7a59" x="236" y="112">사람이 더함</text><text class="trait-text" style="fill:#ff7a59" x="236" y="126">한 해 ${gt(em.E)}</text>`;
        else out += `<text class="trait-text" style="fill:#ff7a59" x="236" y="112">사람이 더함 0</text>`;
        out += `<text class="gen-text" x="440" y="16" text-anchor="end">${2020 + Math.round(t)}년</text>`;
        const VERD = { down: '줄어듦', same: '거의 그대로', up: '늘어남' };
        out += `<text class="verdict-text" fill="#d97706" x="20" y="16">${p >= 1 ? `${em.label} → 50년 뒤 ${gt(a.end)} (${ppm(a.end)} ppm), ${VERD[a.verdict]} (${a.change >= 0 ? '+' : '−'}${Math.round(Math.abs(a.change) * 100)} %)` : `화석 연료 ${em.label}: 한 해 ${gt(em.E)}`}</text>`;
        out += `<text class="note-text" x="20" y="208">자연의 큰 순환은 서로 같아 균형 · 초록 화살표는 대기에 쌓인 여분에 비례해 바다와 숲이 더 거두는 양</text>`;
        return out;
    }

    function graphCarbon(a) {
        const X0 = 56, X1 = 398, Y0 = 150, Y1 = 40, CMIN = 500, CMAX = 1400;
        const t = state.progress * YEARS;
        const xOf = yr => X0 + yr / YEARS * (X1 - X0), yOf = c => Y0 - (c - CMIN) / (CMAX - CMIN) * (Y0 - Y1);
        let out = `<text class="axis-title" x="${X0}" y="18">대기의 탄소 — 네 경우, 굵은 선이 지금 고른 것</text>`;
        for (let c = CMIN; c <= CMAX; c += 300) {
            out += `<line class="grid-line" x1="${X0}" y1="${yOf(c).toFixed(1)}" x2="${X1}" y2="${yOf(c).toFixed(1)}"/>`;
            out += `<text class="axis-text" x="${X0 - 6}" y="${(yOf(c) + 3.5).toFixed(1)}" text-anchor="end">${fmtN(c * 10)}</text>`;
            out += `<text class="axis-text" x="${X1 + 6}" y="${(yOf(c) + 3.5).toFixed(1)}">${ppm(c)} ppm</text>`;
        }
        for (let yr = 0; yr <= YEARS; yr += 10) out += `<text class="axis-text" x="${xOf(yr).toFixed(1)}" y="${Y0 + 17}" text-anchor="middle">${2020 + yr}</text>`;
        out += `<line class="axis" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}"/><line class="axis" x1="${X0}" y1="${Y1}" x2="${X0}" y2="${Y0}"/>`;
        out += `<text class="axis-text" x="${X0 + 4}" y="${Y1 - 6}">억 t</text>`;
        out += `<line class="grid-line" style="stroke:rgba(217, 119, 6, .5)" x1="${X0}" y1="${yOf(C_PRE).toFixed(1)}" x2="${X1}" y2="${yOf(C_PRE).toFixed(1)}"/><text class="small-label" x="${X1 - 4}" y="${(yOf(C_PRE) - 3).toFixed(1)}" text-anchor="end">산업화 전 ${gt(C_PRE)}</text>`;
        Object.entries(EMITS).forEach(([k, em]) => {
            const mine = k === state.emit;
            const tEnd = mine ? t : YEARS;
            let d = '';
            for (let yr = 0; yr <= tEnd + 1e-9; yr += 0.5) d += `${d ? 'L' : 'M'}${xOf(yr).toFixed(1)},${yOf(carbonAt(em.E, yr)).toFixed(1)} `;
            out += `<path class="trace ${mine ? '' : 'faint'}" style="stroke:${mine ? '#d97706' : '#475569'}" d="${d}"/>`;
        });
        const now = carbonAt(a.em.E, t);
        out += `<circle class="trace-dot" fill="#d97706" cx="${xOf(t).toFixed(1)}" cy="${yOf(now).toFixed(1)}" r="4"/>`;
        out += `<text class="axis-title" x="${((X0 + X1) / 2).toFixed(1)}" y="${Y0 + 33}" text-anchor="middle">연도 — 지금 고른 경우: ${a.em.label}</text>`;
        return out;
    }

    function noteFor(a) {
        const warning = '<p>저장량·유출입량은 고정된 예시입니다. 현재 관측값이나 실제 미래 예측이 아니며, 체류 시간은 평균적 추정치입니다. 탱크는 유입·유출량이 같고 물이 완전히 섞이는 예시로, 평균 체류 시간이 지나도 처음 물의 약 37%가 남습니다. 실제 저장소의 혼합과 이동 경로는 다릅니다.</p>';
        if (a.kind === 'spheres') {
            const { ph } = a;
            return `<div class="data-row"><span class="data-name">현상</span><span class="data-val">${state.progress >= 1 ? `${ph.label} — ${ph.lines.join(' ')}` : ph.label}</span></div>` +
                `<div class="data-row"><span class="data-name">주는 권 → 받는 권</span><span class="data-val">${state.progress > 0 ? `${SPHERES[ph.from].label} → ${SPHERES[ph.to].label}` : '따라가 보면 나옵니다'}</span></div>` +
                `<div class="data-row"><span class="data-name">옮겨 가는 것</span><span class="data-val">${state.progress > 0 ? ph.carry : '?'}</span></div>` +
                (state.progress >= 1 ? `<div class="data-row match"><span class="data-name">실제 예</span><span class="data-val">${ph.example.join(' ')}</span></div>` : '');
        }
        if (a.kind === 'water') {
            const { r, tau } = a;
            return warning + `<div class="data-row"><span class="data-name">든 물</span><span class="data-val">${r.label} ${fmtVol(r.volume)} (${r.volume.toLocaleString('ko-KR')}천 km³)</span></div>` +
                `<div class="data-row"><span class="data-name">나가는 길</span><span class="data-val">${r.note}${r.out ? ` · 한 해 ${r.out}천 km³` : ' · 대표값'}</span></div>` +
                `<div class="data-row"><span class="data-name">머무는 시간</span><span class="data-val">${r.out ? `${r.volume.toLocaleString('ko-KR')} ÷ ${r.out} = ${tau < 1 ? `${tau.toFixed(3)}년 = ` : ''}${fmtTime(tau)}` : fmtTime(tau)}</span></div>` +
                `<div class="data-row match"><span class="data-name">지구 전체</span><span class="data-val">증발 ${FLUX.evapSea} + ${FLUX.evapLand} = ${FLUX.evapSea + FLUX.evapLand}천 km³ = 강수 ${FLUX.rainSea} + ${FLUX.rainLand} · 바다 → 육지 → 강물 ${FLUX.runoff}천 km³</span></div>`;
        }
        return warning + `<div class="data-row"><span class="data-name">대기</span><span class="data-val">모형 초기값 ${gt(C_NOW)} (${ppm(C_NOW)} ppm) · 산업화 전 ${gt(C_PRE)} (${ppm(C_PRE)} ppm)</span></div>` +
            `<div class="data-row"><span class="data-name">자연의 순환</span><span class="data-val">광합성 ${gt(NAT_LAND)} = 호흡·분해 ${gt(NAT_LAND)} · 바다 녹아듦 ${gt(NAT_SEA)} = 내놓음 ${gt(NAT_SEA)} (한 해)</span></div>` +
            `<div class="data-row"><span class="data-name">사람</span><span class="data-val">화석 연료 ${a.em.label}: 한 해 ${gt(a.em.E)} · 바다와 숲이 더 거둠: 지금 한 해 ${gt(a.sinkNow)} (여분의 ${(K_SINK * 100).toFixed(1)} %)</span></div>` +
            `<div class="data-row match"><span class="data-name">50년 뒤</span><span class="data-val">${gt(a.end)} (${ppm(a.end)} ppm) — 지금보다 ${a.change >= 0 ? '+' : '−'}${Math.round(Math.abs(a.change) * 100)} %</span></div>`;
    }

    function render() {
        const a = analyse();
        window.scienceScene.render(mainGroup,a.kind === 'spheres' ? renderSpheres(a) : a.kind === 'water' ? renderWater(a) : renderCarbon(a));
        window.scienceScene.render(graphGroup,a.kind === 'spheres' ? graphSpheres(a) : a.kind === 'water' ? graphWater(a) : graphCarbon(a));
        stageBadge.textContent = a.kind === 'spheres' ? a.ph.label : a.kind === 'water' ? `${a.r.label} · ${fmtVol(a.r.volume)}` : `${a.em.label} · 한 해 ${gt(a.em.E)}`;
        methodHint.textContent = a.kind === 'spheres' ? '지구의 다섯 권은 물질과 에너지를 주고받으며 서로 바꿉니다'
            : a.kind === 'water' ? '머무는 시간 = 든 물의 양 ÷ 한 해 드나드는 양'
                : '더하는 양과 거두는 양의 차이만큼 대기에 쌓입니다';
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
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { state.progress = 1; finish(); return; }
        state.progress = 0;
        running = true;
        lastStamp = performance.now();
        render();
        frameId = requestAnimationFrame(frame);
    }

    function finish() {
        if (state.mode === 'spheres') state.seen.add(state.phenomenon);
        const a = render();
        resultEmpty.hidden = true;
        resultContent.hidden = false;
        let s = '';
        if (a.kind === 'spheres') {
            const { ph } = a;
            controlArea.querySelectorAll('[data-pick="phenomenon"] button').forEach(b => { if (state.seen.has(b.dataset.value)) { b.classList.add('done'); if (!b.querySelector('small')) b.insertAdjacentHTML('beforeend', '<small>확인함</small>'); } });
            labelA.textContent = '주는 권 → 받는 권'; valueA.textContent = `${SPHERES[ph.from].label} → ${SPHERES[ph.to].label}`;
            labelB.textContent = '옮겨 가는 것'; valueB.textContent = ph.carry;
            const carried = ph.carry.replace(/ \(.*\)$/, '');
            s = `${ph.lines.join(' ')}. ${SPHERES[ph.from].label}의 ${iga(carried)} ${SPHERES[ph.to].label}으로 옮겨 가 ${SPHERES[ph.to].label}을 바꾸는 상호작용입니다. `;
            s += `실제 예: ${ph.example.join(' ')}. 지구는 이렇게 땅·물·공기·생물·바깥이 한 덩어리로 얽힌 시스템이어서, 한 곳의 변화가 다른 곳으로 퍼집니다. `;
            s += `지금까지 ${state.seen.size}가지 현상을 확인해 기록표를 채웠습니다.`;
        } else if (a.kind === 'water') {
            const { r, tau } = a;
            labelA.textContent = '든 물'; valueA.textContent = fmtVol(r.volume);
            labelB.textContent = '평균 체류 시간'; valueB.textContent = fmtTime(tau);
            s = `${r.label}에는 물이 ${fmtVol(r.volume)} 들어 있고, ${r.out ? `한 해 ${r.out}천 km³가 ${r.how} 나갑니다(들어오는 양도 같습니다)` : `${r.how} 나갑니다`}. `;
            s += r.out ? `든 양을 한 해 드나드는 양으로 나누면 ${fmtTime(tau)} — 평균적인 체류 시간의 추정치이며 모든 물이 그 시간에 완전히 교체되는 것은 아닙니다. ` : `${r.label}는 곳마다 달라 한 숫자로 재기 어렵지만, 대표값으로 ${fmtTime(tau)}쯤 머뭅니다. `;
            if (r.cat === 'days') s += `양에 비해 드나듦이 많아 평균 체류 시간이 짧습니다. 오염 물질이 제거되는 정도는 물질의 성질과 다른 과정에도 영향을 받습니다. `;
            else if (r.cat === 'years') s += `대기보다는 훨씬 오래, 바다보다는 훨씬 짧게 머무는 중간 자리입니다. `;
            else s += `양이 엄청 많은데 드나듦은 그 아주 작은 부분이라 아주 오래 머뭅니다. 그래서 바다·지하수·빙하에 들어간 것은 오랫동안 남고, 빙하 속 공기로 옛 기후를 알 수 있습니다. `;
            s += `물 순환 전체를 보면 한 해 증발 ${FLUX.evapSea + FLUX.evapLand}천 km³ = 강수 ${FLUX.rainSea + FLUX.rainLand}천 km³로 같고, 바다에서 증발한 물 가운데 ${FLUX.runoff}천 km³가 육지에 내려 강물이 되어 돌아옵니다. 이 모든 순환을 움직이는 에너지는 태양에서 옵니다.`;
        } else {
            const { em } = a;
            labelA.textContent = '모형 초기 대기'; valueA.textContent = `${gt(C_NOW)} (${ppm(C_NOW)} ppm)`;
            labelB.textContent = '50년 뒤'; valueB.textContent = `${gt(a.end)} (${ppm(a.end)} ppm)`;
            s = `자연의 큰 순환 — 광합성 ${gt(NAT_LAND)}과 호흡·분해 ${gt(NAT_LAND)}, 바다와 대기가 주고받는 ${gt(NAT_SEA)} — 은 서로 거의 같아 균형을 이룹니다. 사람이 화석 연료를 태워 더하는 양은 그보다 훨씬 적지만 한쪽으로만 쌓입니다. 바다와 숲은 대기에 쌓인 여분(산업화 전보다 많은 양)에 비례해 더 거두는데, 지금은 한 해 약 ${gt(a.sinkNow)}입니다. `;
            if (state.emit === 'zero') s += `배출을 멈추면 더하는 양은 0이고 거두는 양만 남아 대기의 탄소는 천천히 줄어, 50년 뒤 ${gt(a.end)}(${ppm(a.end)} ppm)이 됩니다. 그래도 산업화 전 ${gt(C_PRE)}까지는 훨씬 더 오래 걸립니다. `;
            else if (state.emit === 'half') s += `절반으로 줄이면 더하는 양(${gt(em.E)})과 거두는 양(약 ${gt(a.sinkNow)})이 거의 같아져 대기의 탄소는 늘기를 멈추고, 50년 뒤에도 ${gt(a.end)}(${ppm(a.end)} ppm) 근처에 머뭅니다. 줄이려면 그보다 더 줄여야 합니다. `;
            else if (state.emit === 'now') s += `지금처럼 더하면 거두는 양보다 한 해 ${gt(em.E - a.sinkNow)}쯤 많아 대기의 탄소가 계속 늘어, 50년 뒤 ${gt(a.end)}(${ppm(a.end)} ppm)이 됩니다. `;
            else s += `두 배로 더하면 거두는 양이 조금 늘어도 따라가지 못해 대기의 탄소가 빠르게 늘어, 50년 뒤 ${gt(a.end)}(${ppm(a.end)} ppm)이 됩니다. `;
            s += `대기의 이산화 탄소가 늘면 지구가 내보내는 열을 더 붙잡아 기온이 오르고, 바다에 더 녹아 바닷물이 산성으로 기울어집니다.`;
        }
        predictionResult.textContent = !state.prediction ? '다음에는 결과를 먼저 예상해 보세요.'
            : state.prediction === a.verdict ? '예상이 맞았습니다.' : '예상과 다른 결과입니다.';
        explanation.textContent = s + (a.kind === 'carbon' ? ' 화면의 배출량·흡수식으로 계산한 가상 시나리오이며, 실제 미래 농도나 감축 목표를 예측하지 않습니다.' : '');
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
        checkBtn.textContent = state.mode === 'spheres' ? '따라가 보기' : state.mode === 'water' ? '시간 흘려 보기' : '50년 흘려 보기';
        stageCaption.textContent = state.mode === 'spheres' ? '왼쪽 장면에서 무엇이 어디에서 어디로 옮겨 가는지 지켜보세요. 아래 기록표에는 확인한 관계에 초록 점이 찍힙니다.'
            : state.mode === 'water' ? '오른쪽 통에서 처음 있던 물(짙은 색)이 빠져나가고 새 물(옅은 색)이 채워지는 데 걸리는 시간을 봅니다.'
                : '더하는 양(붉은 화살표)과 거두는 양(초록 화살표)의 차이만큼 대기의 탄소가 바뀝니다.';
        settingsChanged();
    }));
    checkBtn.addEventListener('click', startRun);
    resetBtn.addEventListener('click', () => {
        stopRun();
        Object.assign(state, { phenomenon: 'volcano', reservoir: 'atmo', emit: 'now', seen: new Set(), progress: 0, prediction: null });
        modeButtons.find(b => b.dataset.mode === 'spheres').click();
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

    window.__earthModel = {
        SPHERES, PHENOMENA, RESERVOIRS, FLUX, EMITS, state,
        analyse, render, tauOf, carbonAt, fmtTime, fmtVol,
        runSeconds,
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
