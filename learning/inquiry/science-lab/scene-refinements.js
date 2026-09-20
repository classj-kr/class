/* Code-native apparatus and process drawings. Geometry is illustrative unless a scale is shown. */
(function () {
    'use strict';
    const ink = '#173449', muted = '#516779', hot = '#c65320', cold = '#1676a5', green = '#167858';
    const text = (x, y, s, color = ink, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" style="fill:${color};stroke:none;font-size:14px;font-weight:600">${s}</text>`;
    const box = (x, y, w, h, fill = '#f1f6f9', stroke = '#c9d9e3', r = 10) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}"/>`;
    const path = (d, stroke, width = 2, extra = '') => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
    function arrow(x1, y1, x2, y2, color, width = 3, extra = '') {
        const a = Math.atan2(y2 - y1, x2 - x1), c = Math.cos(a), s = Math.sin(a);
        return `<g ${extra}>${path(`M${x1} ${y1} L${x2 - c * 8} ${y2 - s * 8}`, color, width)}<polygon points="${x2},${y2} ${x2 - 9 * c + 4 * s},${y2 - 9 * s - 4 * c} ${x2 - 9 * c - 4 * s},${y2 - 9 * s + 4 * c}" fill="${color}"/></g>`;
    }
    const dot = (x, y, r, fill, extra = '') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra}/>`;
    const frame = content => `<g data-scene-refined="true">${content}</g>`;
    function distill(a, p) {
        const vapour = p > .2, collected = Math.max(0, (p - .4) / .6), liquidY = 130 + 15 * collected;
        const flask = 'M72 60 H90 V106 C124 122 127 158 103 171 Q81 185 59 171 C35 157 39 122 72 106 Z';
        let s = `<defs><clipPath id="refinedFlask"><path d="${flask}"/></clipPath></defs>`;
        s += text(81, 24, '가열') + text(246, 24, '냉각') + text(387, 24, '수집');
        s += `<path data-apparatus="flask" d="${flask}" fill="#f2f9fc" stroke="#7799aa" stroke-width="2"/>`;
        s += `<g clip-path="url(#refinedFlask)"><rect data-liquid="remaining" x="35" y="${liquidY}" width="100" height="60" fill="#8bc6dd"/>${path(`M38 ${liquidY} Q65 ${liquidY - 5} 85 ${liquidY} T130 ${liquidY}`, cold, 1.5)}</g>`;
        if (vapour) for (let i = 0; i < 4; i++) s += dot(61 + i * 12, liquidY + 5 + ((i * .27 + p * 4) % 1) * 19, 2.3, '#f6fcff');
        s += box(46, 177, 70, 22, '#344f60', '#344f60', 5) + path('M53 175 Q81 189 109 175', hot, 5);
        s += dot(103, 188, 3, p > 0 ? '#ffb463' : '#94a3b8') + text(77, 193, '전열기', '#ffffff');
        s += path('M82 58 V88', '#334e60', 3) + dot(82, 91, 3, hot);
        s += path('M90 74 H130 L340 130 V150 H379 V159', '#8aa7b6', 8);
        s += path('M90 74 H130 L340 130 V150 H379 V159', '#edf8fc', 5);
        s += `<path data-apparatus="condenser" d="M143 65 L326 114 L320 139 L137 90 Z" fill="#b6e3ef" fill-opacity=".75" stroke="#6da6bb" stroke-width="1.8"/>`;
        s += path('M140 78 L324 127', vapour ? '#d99452' : '#8199a5', 3, `data-flow="vapour" stroke-dasharray="6 6" stroke-dashoffset="${-p * 100}"`);
        // Cooling water enters the lower end and leaves the upper end, filling the jacket.
        s += arrow(307, 163, 314, 137, cold, 2.5, 'data-flow="coolant-in"') + text(300, 186, '냉각수 입구');
        s += arrow(151, 64, 158, 40, cold, 2.5, 'data-flow="coolant-out"') + text(179, 51, '출구', cold);
        s += arrow(282, 124, 187, 99, cold, 1.5);
        s += path('M224 107 V167 M205 169 H243', '#718b99', 3);
        s += `<path data-apparatus="receiver" d="M353 154 V195 Q353 199 357 199 H409 Q413 199 413 195 V154" fill="#f5fafc" stroke="#7898aa" stroke-width="2"/>`;
        s += `<rect data-liquid="collected" x="355" y="${197 - collected * 27}" width="56" height="${collected * 27}" fill="#8bc6dd"/>`;
        if (collected > 0 && p < 1) s += dot(379, 162 + ((p * 7) % 1) * 15, 2.5, cold);
        s += text(386, 140, '받는 용기');
        return frame(s);
    }
    function distillGraph(p) {
        const steps = ['액체 가열', '기화', '증기 냉각', '응결·수집'];
        let s = '';
        steps.forEach((label, i) => {
            const on = p > [0, .2, .3, .4][i], x = 18 + i * 111;
            s += box(x, 61, 92, 66, on ? '#e4f4f4' : '#f1f5f8', on ? '#6aafa8' : '#d5e1e8');
            s += dot(x + 46, 79, 4, on ? green : '#9db0bd') + text(x + 46, 108, label);
            if (i < 3) s += arrow(x + 96, 94, x + 108, 94, muted, 1.8);
        });
        return frame(s);
    }
    function weather(a, phase, hourLabel) {
        const sky = a.daylight ? '#d7edf6' : '#172b45', airInk = a.daylight ? '#27485d' : '#edf6ff';
        let s = box(0, 0, 460, 214, sky, 'none', 12);
        s += box(10, 9, 440, 32, a.daylight ? '#f7fcff' : '#263e59', 'none', 7);
        s += text(23, 30, `${hourLabel} · ${a.sky.name}`, airInk, 'start');
        const windName = a.wind.dir === 'sea' ? '해풍' : a.wind.dir === 'land' ? '육풍' : '바람 멎음';
        s += text(437, 30, windName + (a.wind.speed ? ` ${a.wind.speed.toFixed(1)} m/s` : ''), airInk, 'end');
        const sx = a.daylight ? 140 + (a.hour - 6) / 13 * 180 : 300;
        s += dot(sx, 67, 12, a.daylight ? '#f2af36' : '#f9edbc');
        if (!a.daylight) s += dot(sx - 5, 63, 10, sky);
        for (let i = 0; i < a.sky.puffs; i++) {
            const x = 135 + i * 175 / Math.max(1, a.sky.puffs - 1) + Math.sin(phase * .4 + i) * 4, y = 79 + i % 2 * 8;
            [0, 11, 22].forEach((dx, j) => { s += `<ellipse cx="${x + dx}" cy="${y - (j === 1 ? 5 : 0)}" rx="12" ry="7" fill="${a.daylight ? '#ffffff' : '#71869e'}"/>`; });
        }
        s += `<path d="M0 148 Q65 145 110 150 T214 148 V214 H0 Z" fill="#78bcd6"/><path d="M214 148 Q315 136 460 141 V214 H214 Z" fill="#bac7a3"/>`;
        s += path('M18 155 Q38 151 58 155 M126 155 Q146 151 166 155', '#d9f0f6', 2);
        if (a.wind.dir !== 'calm') {
            const sea = a.wind.dir === 'sea', start = sea ? 83 : 377, end = sea ? 377 : 83;
            s += arrow(start, 130, end, 130, airInk, 2.5, `data-wind="${a.wind.dir}"`);
            s += dot(start + (end - start) * ((phase * (.25 + a.wind.speed * .08)) % 1), 130, 3.5, a.daylight ? cold : '#70d4ee');
            const warm = sea ? 377 : 83, cool = sea ? 83 : 377;
            s += arrow(warm, 115, warm, 65, a.daylight ? hot : '#ffb077', 2.5) + arrow(cool, 65, cool, 115, a.daylight ? cold : '#86d8f1', 2.5);
            s += text(warm, 56, '상승', airInk) + text(cool, 56, '하강', airInk);
        } else s += text(230, 131, '온도 차이가 작음', airInk);
        [[16, a.sea, '바다'], [252, a.land, '육지']].forEach(([x, t, name]) => {
            s += box(x, 164, 192, 41, '#f9fcfd', '#c2d5dd', 8);
            s += text(x + 14, 190, name, ink, 'start') + text(x + 174, 190, `${t.toFixed(1)} ℃`, ink, 'end');
            const h = Math.max(0, Math.min(25, (t - 12) / 18 * 25));
            s += box(x + 69, 171, 7, 26, '#dfebf1', '#b0c9d6', 3) + `<rect x="${x + 71}" y="${197 - h}" width="3" height="${h}" fill="${name === '바다' ? cold : hot}"/>`;
        });
        return frame(s);
    }
    function rock(a, colour, time) {
        const f = { x: 266, y: 43, w: 174, h: 122 }, fieldMM = a.mm > 16 ? 100 : a.mm > 3 ? 50 : 10, scaleMM = fieldMM / 10, pxPerMM = f.w / fieldMM, size = Math.max(2, a.mm * pxPerMM);
        let s = text(125, 24, '냉각 위치') + text(353, 24, `관찰 폭 ${fieldMM} mm`);
        s += box(20, 43, 210, 131, '#e7eef2', '#c9d6df', 8);
        s += `<path d="M21 83 H229 V173 H21 Z" fill="#667d87"/>` + path('M22 83 H228', '#416253', 3) + text(35, 72, '지표', muted, 'start');
        const depth = a.depthKm < .4 ? 83 : 104 + a.depthKm / 10 * 28;
        s += `<ellipse cx="125" cy="${depth}" rx="48" ry="${a.depthKm < .4 ? 5 : 14}" fill="#d97742" stroke="#ffd5ad"/>`;
        s += text(125, 163, a.depthKm < .4 ? '지표 부근' : `깊이 약 ${a.depthKm.toFixed(1)} km`, '#ffffff');
        s += `<defs><clipPath id="refinedRockField"><rect x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" rx="7"/></clipPath></defs>`;
        // Shared polygon vertices tile the field without gaps, even when one crystal exceeds the field.
        const cols = Math.ceil(f.w / size) + 3, rows = Math.ceil(f.h / size) + 3;
        const jitter = (i, j) => { const n = Math.sin(i * 127.1 + j * 311.7 + a.silica * .17) * 43758.5453; return n - Math.floor(n); };
        const point = (i, j) => [f.x + (i - 1.4 + .25 * jitter(i, j)) * size, f.y + (j - 1.4 + .25 * jitter(j + 33, i)) * size];
        let grains = '';
        for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
            const points = [point(i, j), point(i + 1, j), point(i + 1, j + 1), point(i, j + 1)].map(p => p.map(n => n.toFixed(2)).join(',')).join(' ');
            grains += `<polygon data-crystal="true" points="${points}" fill="${colour(a.silica, .6 + jitter(i + 77, j) * .7)}" stroke="#435362" stroke-opacity=".38" stroke-width="${Math.min(.8, size * .06)}"/>`;
        }
        s += `<g data-rock-field="true" data-field-mm="${fieldMM}" clip-path="url(#refinedRockField)">${grains}</g>`;
        s += `<rect data-field-outline="true" x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" rx="7" fill="none" stroke="#8aa1b0" stroke-width="1.5"/>`;
        s += box(273, 137, 88, 22, '#f8fcff', 'none', 4) + path(`M281 150 H${281 + pxPerMM * scaleMM}`, ink, 2) + text(354, 153, `${scaleMM} mm`, ink, 'end');
        s += text(125, 198, time, muted) + text(353, 190, a.name) + text(353, 208, `결정 ${a.mm.toFixed(2)} mm`, muted);
        return frame(s);
    }
    function sphereIcon(key, x, y) {
        if (key === 'space') return dot(x, y, 22, '#ecb449') + [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i * Math.PI / 4; return path(`M${x + Math.cos(a) * 28} ${y + Math.sin(a) * 28} L${x + Math.cos(a) * 34} ${y + Math.sin(a) * 34}`, '#c78c26', 2); }).join('');
        if (key === 'atmo') return `<path d="M${x - 35} ${y + 15} C${x - 55} ${y - 5} ${x - 30} ${y - 30} ${x - 15} ${y - 17} C${x - 4} ${y - 43} ${x + 32} ${y - 29} ${x + 25} ${y - 7} C${x + 52} ${y - 8} ${x + 49} ${y + 18} ${x + 29} ${y + 18} Z" fill="#b8dce9" stroke="#78aebf"/>`;
        if (key === 'hydro') return `<path d="M${x - 44} ${y - 5} q15 -10 30 0 t30 0 t28 0 V${y + 28} H${x - 44} Z" fill="#8ccce1"/>` + path(`M${x - 34} ${y + 12} q13 -8 26 0 t26 0 t20 0`, '#f0fbff', 2);
        if (key === 'geo') return `<path d="M${x - 46} ${y + 29} L${x - 5} ${y - 31} L${x + 14} ${y - 7} L${x + 26} ${y - 20} L${x + 48} ${y + 29} Z" fill="#a3ad96" stroke="#75816a"/><path d="M${x - 16} ${y - 15} L${x - 5} ${y - 31} L${x + 8} ${y - 15} Z" fill="#f4f7f4"/>`;
        return path(`M${x} ${y + 31} V${y - 16}`, green, 4) + `<path d="M${x} ${y + 9} Q${x - 45} ${y + 1} ${x - 33} ${y - 21} Q${x - 4} ${y - 28} ${x} ${y + 9} M${x} ${y - 3} Q${x + 4} ${y - 37} ${x + 34} ${y - 28} Q${x + 40} ${y - 4} ${x} ${y - 3}" fill="#5ea080"/>`;
    }
    function earth(a, state, spheres, keys) {
        let s = '';
        [[a.ph.from, 20], [a.ph.to, 315]].forEach(([key, x]) => {
            s += `<g data-sphere="${key}">${box(x, 29, 125, 132)}${sphereIcon(key, x + 62, 90)}${text(x + 62, 147, spheres[key].label)}</g>`;
        });
        s += arrow(160, 98, 300, 98, hot, 3.5) + text(230, 79, '영향 전달', hot);
        if (state.progress > 0 && state.progress < 1) s += dot(165 + ((state.progress * 3) % 1) * 125, 98, 5, '#eab86a');
        keys.forEach((key, i) => {
            const selected = key === a.ph.from || key === a.ph.to, x = 20 + i * 86;
            s += box(x, 180, 76, 28, selected ? '#e1f1ed' : '#f5f7f9', selected ? '#72a595' : '#e0e8ed', 7) + text(x + 38, 199, spheres[key].label, selected ? green : muted);
        });
        return frame(s);
    }
    function earthGraph(a, state, spheres, keys, phenomena) {
        let s = '', x0 = 116, y0 = 38, cw = 56, ch = 26;
        s += text(24, 17, '받는 권 →', muted, 'start');
        keys.forEach((k, i) => { s += text(x0 + i * cw + cw / 2, 26, spheres[k].label); });
        keys.forEach((from, r) => {
            s += text(x0 - 13, y0 + r * ch + 18, spheres[from].label, ink, 'end');
            keys.forEach((to, c) => {
                const count = Object.entries(phenomena).filter(([id, ph]) => ph.from === from && ph.to === to && (state.seen.has(id) || (state.progress >= 1 && id === state.phenomenon))).length;
                const selected = a.ph.from === from && a.ph.to === to;
                s += box(x0 + c * cw, y0 + r * ch, cw - 4, ch - 3, count ? '#dff2e8' : '#f3f6f8', selected ? hot : '#e0e8ed', 4);
                if (count) s += dot(x0 + c * cw + 26, y0 + r * ch + 11, 4, green);
            });
        });
        s += dot(122, 187, 4, green) + text(134, 192, '확인한 관계', muted, 'start') + text(290, 192, '주황 테두리: 선택', hot, 'start');
        return frame(s);
    }
    function engine(a, state, cycle) {
        const pump = a.kind === 'pump', invalid = a.kind === 'flow' && a.verdict !== 'ok';
        const phase = cycle?.leg ?? 0, p = state.progress, workColor = invalid ? '#a83b3b' : green;
        let s = '';
        if (pump) {
            s += box(15, 40, 123, 113, '#e6f3fa', '#accbdc') + text(76, 65, '바깥') + text(76, 138, `${(a.Tc - 273.15).toFixed(0)} ℃`, cold);
            s += box(322, 40, 123, 113, '#fbede4', '#dcc5b5') + text(383, 65, '실내') + text(383, 138, `${(a.Th - 273.15).toFixed(0)} ℃`, hot);
            s += path('M38 83 v22 h18 v-22 h18 v22 h18 v-22 h18', cold, 3) + path('M345 83 v22 h18 v-22 h18 v22 h18 v-22 h18', hot, 3);
            s += box(181, 63, 98, 76, '#edf4f4', '#88b0ab') + dot(230, 94, 19, '#d1e7e1', 'stroke="#64988a"');
            const angle = p * Math.PI * 8;
            s += path(`M${230 - Math.cos(angle) * 13} ${94 - Math.sin(angle) * 13} L${230 + Math.cos(angle) * 13} ${94 + Math.sin(angle) * 13}`, green, 4) + text(230, 129, '열펌프');
            s += arrow(140, 99, 177, 99, cold) + arrow(283, 99, 319, 99, hot);
            s += arrow(230, 181, 230, 146, green) + text(230, 204, '외부에서 일 공급', green);
        } else {
            s += box(25, 24, 129, 55, '#faeadd', '#e0beaa') + text(89, 46, '고온 열원') + text(89, 68, `${(a.Th - 273.15).toFixed(0)} ℃`, hot);
            s += box(25, 141, 129, 55, '#e5f1f8', '#b7d1e0') + text(89, 162, '저온 열원') + text(89, 185, `${(a.Tc - 273.15).toFixed(0)} ℃`, cold);
            const volume = cycle ? Math.log(cycle.V / 1) / Math.log(a.V3 / 1) : .45 + (invalid ? 0 : .15 * Math.sin(p * Math.PI * 8));
            const top = 120 - Math.max(0, Math.min(1, volume)) * 57;
            s += box(211, 48, 78, 106, '#edf3f6', '#8fa7b5', 5) + `<rect x="215" y="${top + 6}" width="70" height="${148 - top - 6}" fill="#f4c98b"/>`;
            s += `<rect data-piston="true" x="214" y="${top}" width="72" height="7" rx="2" fill="#627d8d"/>` + path(`M251 ${top} V34 H282`, '#627d8d', 5);
            s += text(250, 178, invalid ? '실현 불가' : '순환 기관', invalid ? '#a83b3b' : ink);
            s += arrow(156, 54, 202, 75, hot, 3, `opacity="${a.kind !== 'carnot' || phase === 0 ? 1 : .25}" data-energy-flow="in"`);
            s += arrow(204, 135, 158, 167, cold, 3, `opacity="${invalid ? .15 : a.kind !== 'carnot' || phase === 2 ? 1 : .25}" data-energy-flow="out"`);
            s += arrow(299, 102, 403, 102, workColor, 4, `data-energy-flow="work" ${invalid ? 'stroke-dasharray="4 4"' : ''}`) + text(351, 88, '한 일', workColor);
            s += box(331, 118, 95, 32, invalid ? '#fbe9e9' : '#e5f2ed', 'none', 6) + text(379, 139, invalid ? '불가능' : '에너지 전달', workColor);
            if (invalid) s += path('M181 92 L197 108 M197 92 L181 108', '#a83b3b', 3);
        }
        return frame(`<g data-engine-valid="${!invalid}">${s}</g>`);
    }
    function engineGraph(a, state) {
        const pump = a.kind === 'pump', invalid = a.kind === 'flow' && a.verdict !== 'ok';
        const fraction = pump ? 1 / a.cop : a.eta, split = 420 * fraction;
        const first = pump ? '공급한 일' : '한 일', second = pump ? '바깥에서 가져온 열' : '배출한 열';
        let s = text(20, 28, pump ? '실내로 전달한 열을 100으로 놓고 비교' : invalid ? '주장하는 에너지 배분 · 실현 불가' : '고온에서 받은 열을 100으로 놓고 비교', ink, 'start');
        s += `<rect data-energy="work" data-share="${fraction}" x="20" y="52" width="${split}" height="30" fill="${invalid ? '#bb5960' : green}"/><rect data-energy="heat" data-share="${1 - fraction}" x="${20 + split}" y="52" width="${420 - split}" height="30" fill="${cold}"/>`;
        s += dot(24, 106, 4, invalid ? '#bb5960' : green) + text(35, 111, `${first} ${(fraction * 100).toFixed(1)}`, ink, 'start');
        s += dot(229, 106, 4, cold) + text(240, 111, `${second} ${((1 - fraction) * 100).toFixed(1)}`, ink, 'start');
        if (a.kind === 'carnot') {
            const labels = ['열 받음', '팽창', '열 배출', '압축'], phase = Math.min(3, Math.floor(state.progress * 4));
            labels.forEach((label, i) => { s += box(20 + i * 107, 144, 99, 31, i === phase ? '#e6f1ec' : '#f2f5f7', i === phase ? '#82a797' : '#dae4ea', 6) + text(69 + i * 107, 165, label); });
        }
        return frame(s);
    }
    function nucleusGroup(cx, cy, A, Z, extra = '') {
        // A small packed grid keeps every nucleon count visible, not a single symbolic dot.
        const cols = Math.ceil(Math.sqrt(A)), rows = Math.ceil(A / cols), r = A === 1 ? 11 : 7;
        let s = '';
        for (let i = 0; i < A; i++) {
            const count = Math.min(cols, A - Math.floor(i / cols) * cols), x = cx + (i % cols - (count - 1) / 2) * r * 1.75, y = cy + (Math.floor(i / cols) - (rows - 1) / 2) * r * 1.65;
            s += dot(x, y, r, i < Z ? '#c75b4a' : '#5689b0', `data-nucleon="${i < Z ? 'proton' : 'neutron'}" stroke="#ffffff" stroke-width="1.2"`);
        }
        return `<g data-nucleus-a="${A}" data-nucleus-z="${Z}" ${extra}>${s}</g>`;
    }
    function fusion(a, p) {
        const st = a.st, h = st.fuel.sym === 'H', opacity = Math.max(0, Math.min(1, (p - .45) / .3));
        let s = box(15, 28, 178, 151) + box(267, 28, 178, 151, '#fdf4e8', '#e3cfb1');
        s += text(104, 53, '반응 전') + text(356, 53, '반응 후');
        const positions = h ? [[73, 88], [135, 88], [73, 124], [135, 124]] : [[65, 94], [139, 94], [103, 127]];
        positions.forEach(([x, y]) => { s += nucleusGroup(x, y, st.fuel.A, h ? 1 : 2, 'data-fusion-side="before"'); });
        s += text(104, 166, `${st.fuel.name} 원자핵 ${st.fuel.n}개`);
        s += arrow(207, 106, 254, 106, hot, 3);
        s += nucleusGroup(356, 105, st.ash.A, h ? 2 : 6, `data-fusion-side="after" opacity="${opacity}"`);
        s += text(356, 166, `${st.ash.name} 원자핵 1개`);
        if (opacity > 0) {
            s += `<g data-fusion-energy="true" opacity="${opacity}">${path('M383 90 l8 -7 4 6 11 -9', '#b47c20', 2)}${path('M385 115 l9 4 -1 6 14 4', '#b47c20', 2)}${path('M329 120 l-8 7 -5 -3 -9 7', '#b47c20', 2)}</g>`;
        }
        s += dot(88, 201, 5, '#c75b4a') + text(100, 206, '양성자', ink, 'start') + dot(196, 201, 5, '#5689b0') + text(208, 206, '중성자', ink, 'start') + text(377, 206, opacity > 0 ? '에너지 방출' : '반응 대기', hot);
        return frame(s);
    }
    function fusionGraph(a) {
        const h = a.st.fuel.sym === 'H';
        let s = text(24, 28, '핵자 수는 보존됩니다', ink, 'start');
        s += box(24, 48, 166, 53, '#eaf1f7', 'none') + text(107, 80, h ? '수소 4개: 핵자 4개' : '헬륨 3개: 핵자 12개');
        s += arrow(202, 74, 247, 74, muted, 2);
        s += box(260, 48, 176, 53, '#f6ede0', 'none') + text(348, 80, h ? '헬륨 1개: 핵자 4개' : '탄소 1개: 핵자 12개');
        s += text(230, 145, '질량 차이에 해당하는 에너지 방출', hot);
        return frame(s);
    }
    window.ScienceScenes = { distill, distillGraph, weather, rock, earth, earthGraph, engine, engineGraph, fusion, fusionGraph };
})();
