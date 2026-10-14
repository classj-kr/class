/* Authored diagrams: collected 2022 science textbooks; high-school
 * 행성우주과학 (김연귀), printed pp. 23–24 (PDF pp. 25–26).
 * Diagram geometry is calculated from Kepler's equation, not circular sectors. */
(function (root) {
    'use strict';
    const TAU = 2 * Math.PI;
    const planets = [
        ['수성', '#948c82'], ['금성', '#d4aa62'], ['지구', '#2786ac'], ['화성', '#bf6241'],
        ['목성', '#bc8a60'], ['토성', '#c8b179'], ['천왕성', '#72bfc7'], ['해왕성', '#4e6eb5']
    ];
    function eccentricAnomaly(mean, e) {
        let E = mean;
        for (let i = 0; i < 20; i++) {
            const step = (E - e * Math.sin(E) - mean) / (1 - e * Math.cos(E));
            E -= step;
            if (Math.abs(step) < 1e-12) break;
        }
        return E;
    }
    function orbitPoint(mean, e, a = 1) {
        const E = eccentricAnomaly(mean, e);
        return { x: a * Math.cos(E), y: a * Math.sqrt(1 - e * e) * Math.sin(E), E };
    }
    function sweep(center, fraction, e = .6, a = 200) {
        const start = center - Math.PI * fraction, end = center + Math.PI * fraction;
        const points = Array.from({ length: 121 }, (_, i) => orbitPoint(start + (end - start) * i / 120, e, a));
        return { points, area: Math.PI * a * a * Math.sqrt(1 - e * e) * fraction,
            length: points.slice(1).reduce((sum, p, i) => sum + Math.hypot(p.x - points[i].x, p.y - points[i].y), 0) };
    }
    const period = a => Math.sqrt(a ** 3);
    const n = x => Number(x.toFixed(2));
    const text = (x, y, label, cls = '', anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" class="${cls}">${label}</text>`;
    const line = (x1, y1, x2, y2, cls = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}"/>`;
    const dot = (x, y, r, fill) => `<circle cx="${n(x)}" cy="${n(y)}" r="${r}" fill="${fill}"/>`;
    const svg = (label, content, height = 380) => `<svg viewBox="0 0 640 ${height}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${content}</svg>`;
    const figure = (graphic, caption) => `<figure class="solar-lesson-figure">${graphic}<figcaption>${caption}</figcaption></figure>`;
    const section = (title, content) => `<section class="school-concepts solar-lesson-section"><h2>${title}</h2>${content}</section>`;
    const p = content => `<p>${content}</p>`;
    function ellipseFigure() {
        return svg('타원 궤도: 태양은 오른쪽 초점에 있고 긴반지름 a는 타원 중심에서 궤도 끝까지의 거리입니다.',
            `<ellipse cx="320" cy="182" rx="200" ry="160" class="sl-orbit"/>` +
            line(120, 182, 520, 182, 'sl-guide') + dot(200, 182, 5, '#65737c') + dot(320, 182, 5, '#65737c') + dot(440, 182, 14, '#df8d13') +
            text(200, 217, '다른 초점') + text(320, 165, '중심') + text(440, 217, '태양 · 초점', 'sl-amber') +
            dot(120, 182, 5, '#205f60') + dot(520, 182, 5, '#205f60') +
            text(107, 157, '원일점', '', 'end') + text(533, 157, '근일점', '', 'start') +
            line(320, 264, 520, 264, 'sl-measure') + line(320, 253, 320, 275, 'sl-measure') + line(520, 253, 520, 275, 'sl-measure') +
            text(420, 297, '긴반지름 a', 'sl-teal') +
            line(440, 182, 365, 26, 'sl-radius') + dot(365, 26, 9, '#247d9c') + text(390, 45, '행성', '', 'start'));
    }
    function areaFigure(percent = 8) {
        const fraction = percent / 100, near = sweep(0, fraction), far = sweep(Math.PI, fraction);
        const path = (s, color) => `<path d="M 440 182 ${s.points.map(p => `L ${n(320 + p.x)} ${n(182 - p.y)}`).join(' ')} Z" fill="${color}" fill-opacity=".3" stroke="${color}" stroke-width="2"/>`;
        const arc = (s, color) => `<path d="${s.points.map((p, i) => `${i ? 'L' : 'M'} ${n(320 + p.x)} ${n(182 - p.y)}`).join(' ')}" fill="none" stroke="${color}" stroke-width="6"/>`;
        return svg(`공전 주기의 ${percent}%씩 지난 두 구간. A와 B의 면적은 같고 근일점 쪽 A의 이동 거리가 더 깁니다.`,
            `<ellipse cx="320" cy="182" rx="200" ry="160" class="sl-orbit"/>` + path(near, '#a95d00') + path(far, '#207b7b') + arc(near, '#a95d00') + arc(far, '#207b7b') +
            dot(440, 182, 12, '#df8d13') + text(440, 218, '태양') +
            text(485, 189, 'A', 'sl-amber sl-bold') + text(198, 189, 'B', 'sl-teal sl-bold') +
            text(96, 133, '느리게', 'sl-teal', 'end') + text(544, 133, '빠르게', 'sl-amber', 'start') +
            text(320, 376, '같은 시간 → 면적 A = 면적 B', 'sl-bold'), 398);
    }
    function periodFigure(a = 4) {
        const x = v => 62 + v / 4 * 510, y = v => 280 - v / 8 * 230;
        const path = Array.from({ length: 81 }, (_, i) => { const v = i / 20; return `${i ? 'L' : 'M'}${n(x(v))} ${n(y(period(v)))}`; }).join(' ');
        let content = '';
        for (const v of [2, 4, 6, 8]) content += line(62, y(v), 572, y(v), 'sl-grid') + text(45, y(v) + 6, v, '', 'end');
        for (const v of [1, 2, 3, 4]) content += text(x(v), 310, v);
        content += line(62, 280, 590, 280, 'sl-axis') + line(62, 280, 62, 32, 'sl-axis') + text(62, 21, '공전 주기 P (년)', '', 'start') + text(572, 348, '긴반지름 a (AU)', '', 'end');
        content += `<path d="${path}" class="sl-curve"/>` + line(x(a), 280, x(a), y(period(a)), 'sl-guide') + line(62, y(period(a)), x(a), y(period(a)), 'sl-guide') +
            dot(x(1), y(1), 6, '#65737c') + text(x(1) + 12, y(1) + 5, '지구 (1, 1)', '', 'start') + dot(x(a), y(period(a)), 9, '#207b7b');
        return svg(`태양 주위 공전 주기 그래프: 긴반지름 ${a} AU이면 주기는 약 ${n(period(a))}년입니다.`, content, 365);
    }
    function high() {
        return section('타원 궤도에서 태양은 어디에 있을까?',
            figure(ellipseFigure(), '초점과 중심의 차이가 잘 드러나도록 납작한 타원으로 그렸습니다. 지구 궤도는 원에 훨씬 가깝습니다.') +
            p('행성은 태양을 한 초점으로 하는 타원 궤도를 공전합니다. 태양과 가장 가까운 곳은 <strong>근일점</strong>, 가장 먼 곳은 <strong>원일점</strong>입니다.') +
            p('<strong>긴반지름 a</strong>는 타원 중심에서 긴 축의 끝까지 잰 거리입니다. 태양에서 행성까지의 거리는 공전하는 동안 변하지만, 한 궤도의 긴반지름은 일정합니다.')) +
        section('같은 시간에 쓸고 지나간 면적 비교',
            `<div data-solar-area>${figure(areaFigure(), '굵은 선은 행성이 움직인 길, 색칠한 부분은 태양과 행성을 잇는 선이 쓸고 지나간 면적입니다.')}</div>` +
            `<label class="solar-lesson-control" for="solar-area-time">두 구간에 똑같이 흐른 시간 <output id="solar-area-value">공전 주기의 8%</output><input id="solar-area-time" type="range" min="3" max="12" step="1" value="8" aria-describedby="solar-area-result"></label>` +
            `<p class="solar-lesson-result" id="solar-area-result" aria-live="polite">시간을 바꾸어도 면적 A와 B는 같습니다.</p>` +
            p('같은 시간 동안 태양과 행성을 잇는 선이 쓸고 지나가는 면적은 같습니다. 태양에 가까운 A 구간은 움직인 길이 더 길므로 평균 속력이 더 큽니다. 태양에서 먼 B 구간은 움직인 길이 더 짧으므로 평균 속력이 더 작습니다.')) +
        section('궤도가 커지면 한 바퀴 도는 시간은?',
            `<div data-solar-period>${figure(periodFigure(), '같은 태양 주위를 공전하는 천체의 관계입니다. 가로축은 긴반지름, 세로축은 공전 주기입니다.')}</div>` +
            `<label class="solar-lesson-control" for="solar-orbit-size">긴반지름 a <output id="solar-period-value">4 AU</output><input id="solar-orbit-size" type="range" min="1" max="4" step=".5" value="4" aria-describedby="solar-period-result"></label>` +
            `<p class="solar-lesson-result" id="solar-period-result" aria-live="polite">a = 4 AU → P² = 4³ = 64 → P = 8년</p>` +
            p('공전 주기의 제곱은 궤도 긴반지름의 세제곱에 비례합니다. 태양 주위 공전에서 P의 단위를 년, a의 단위를 AU로 쓰면 <strong>P² ≈ a³</strong>입니다. 1 AU는 지구와 태양 사이의 평균 거리 정도입니다.') +
            p('긴반지름을 1 AU에서 4 AU로 늘리면 공전 주기는 1년에서 8년으로 늘어납니다. 중심 천체가 달라지면 질량이 달라져 비례 상수도 달라집니다.'));
    }
    function planetTokens(items) {
        return `<ol class="solar-planet-order">${items.map(([name, color]) => `<li><span class="solar-planet-dot" style="--planet-color:${color}"></span><strong>${name}</strong></li>`).join('')}</ol>`;
    }
    function elementary() {
        const light = svg('태양에서 나온 빛이 지구에서 반사되어 관측자의 눈에 들어옵니다.',
            dot(88, 100, 46, '#df8d13') + dot(340, 100, 32, '#2786ac') +
            `<path d="M137 84 L299 84 L286 76 M299 84 L286 92" class="sl-light"/>` +
            `<path d="M321 128 L448 191 L434 192 M448 191 L441 179" class="sl-light"/>` +
            `<path d="M451 205 Q478 176 506 205 Q478 234 451 205 Z" fill="#fff" stroke="#205f60" stroke-width="3"/>` + dot(478, 205, 9, '#205f60') +
            text(88, 166, '태양') + text(215, 61, '태양에서 나온 빛') + text(340, 47, '지구') + text(477, 153, '반사된 빛') + text(478, 250, '우주에서 보는 눈'), 277);
        return section('태양빛을 받아 보이는 행성', figure(light, '행성에서 반사된 태양빛이 눈에 들어오면 행성을 볼 수 있습니다.') +
            p('태양은 스스로 빛과 열을 내는 별입니다. 지구와 다른 행성들은 태양빛을 반사하여 보입니다.')) +
        section('태양에서 가까운 순서', `<div class="solar-order-start">☀ 태양에서 출발 →</div>${planetTokens(planets)}` +
            p('수성·금성·지구·화성·목성·토성·천왕성·해왕성 순서입니다. 위 그림은 순서를 나타냅니다.') +
            `<div class="solar-orbit-relation"><span>태양</span><b>← 주위를 공전</b><span>지구</span><b>← 주위를 공전</b><span>달</span></div>` +
            p('지구는 태양 주위를 도는 <strong>행성</strong>이고, 달은 지구 주위를 도는 <strong>위성</strong>입니다. 지구가 자기 자리에서 도는 운동은 자전, 태양 주위를 도는 운동은 공전입니다.'));
    }
    function middle() {
        const bars = [['지구', 1, '#2786ac'], ['화성', 1.88, '#bf6241'], ['목성', 11.86, '#bc8a60'], ['토성', 29.46, '#a78839']];
        const chart = svg('공전 주기 비교: 지구 1년, 화성 1.88년, 목성 11.86년, 토성 29.46년.',
            bars.map(([name, years, color], i) => text(90, 49 + i * 62, name, '', 'end') +
                `<rect x="110" y="${30 + i * 62}" width="${years / 30 * 380}" height="28" rx="4" fill="${color}"/>` + text(122 + years / 30 * 380, 50 + i * 62, `${years}년`, '', 'start')).join('') +
            line(110, 275, 490, 275, 'sl-axis') + [0, 10, 20, 30].map(v => text(110 + v / 30 * 380, 300, v)).join('') + text(490, 333, '공전 주기 (년)', '', 'end'), 353);
        return section('두 무리로 비교하는 행성',
            `<div class="solar-planet-groups"><div><h3>지구형 행성</h3>${planetTokens(planets.slice(0, 4))}<p>크기가 작은 편<br>평균 밀도가 큰 편<br>암석으로 된 단단한 표면</p></div><div><h3>목성형 행성</h3>${planetTokens(planets.slice(4))}<p>크기가 큰 편<br>평균 밀도가 작은 편<br>고리와 여러 위성</p></div></div>` +
            p('수성·금성·지구·화성은 지구형, 목성·토성·천왕성·해왕성은 목성형 행성으로 분류합니다. 크기와 평균 밀도, 표면과 고리의 특징을 함께 비교합니다.')) +
        section('태양에서 멀수록 길어지는 공전 주기', figure(chart, '각 막대는 태양을 한 바퀴 도는 데 걸리는 시간입니다. 지구의 공전 주기를 1년으로 비교합니다.') +
            p('지구보다 태양에서 먼 화성·목성·토성은 지구보다 공전 주기가 깁니다. 태양에서 먼 행성일수록 공전 주기가 길어집니다. 자전 주기는 이 순서대로 길어지지 않습니다.') +
            p('행성 주위를 도는 천체는 위성입니다. 태양계에는 행성과 위성 외에도 왜소행성·소행성·혜성 등이 있습니다.'));
    }
    function markup(level) {
        return `<div class="school-lesson solar-visual-lesson" data-school="${level}">${({ elementary, middle, high }[level] || high)()}</div>`;
    }
    function render(host, level) {
        host.innerHTML = markup(level);
        const area = host.querySelector('#solar-area-time'), size = host.querySelector('#solar-orbit-size');
        if (area) area.addEventListener('input', () => {
            const percent = Number(area.value);
            host.querySelector('[data-solar-area] svg').outerHTML = areaFigure(percent);
            host.querySelector('#solar-area-value').textContent = `공전 주기의 ${percent}%`;
            host.querySelector('#solar-area-result').textContent = `각 구간에서 공전 주기의 ${percent}%가 흐르면, 면적 A와 B는 각각 타원 전체 넓이의 ${percent}%입니다.`;
        });
        if (size) size.addEventListener('input', () => {
            const a = Number(size.value), P = period(a);
            host.querySelector('[data-solar-period] svg').outerHTML = periodFigure(a);
            host.querySelector('#solar-period-value').textContent = `${a} AU`;
            host.querySelector('#solar-period-result').textContent = `a = ${a} AU → P² = ${a}³ = ${n(a ** 3)} → P ${Number.isInteger(P) ? '=' : '≈'} ${n(P)}년`;
        });
    }
    const api = { render, markup, eccentricAnomaly, orbitPoint, sweep, period };
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.SolarLessonFigures = api;
})(typeof window === 'object' ? window : globalThis);
