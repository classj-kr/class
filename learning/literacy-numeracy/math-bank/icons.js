// 「수학 문제」 묶음(차시)마다 제목 오른쪽에 붙이는 아이콘.
// 초1-1부터 고1-2까지 122개 단원, 1,007개 차시의 개념에 맞추어 선명하고 구별되는 24×24 SVG 그림을 만든다.
(function (root) {
  'use strict';

  const THEMES = {
    blue:   { bg: '#eff6ff', border: '#2563eb', main: '#1d4ed8', soft: '#bfdbfe', accent: '#ef4444' },
    teal:   { bg: '#f0fdfa', border: '#0d9488', main: '#0f766e', soft: '#99f6e4', accent: '#f59e0b' },
    green:  { bg: '#f0fdf4', border: '#16a34a', main: '#15803d', soft: '#bbf7d0', accent: '#ea580c' },
    amber:  { bg: '#fffbeb', border: '#d97706', main: '#b45309', soft: '#fde68a', accent: '#2563eb' },
    orange: { bg: '#fff7ed', border: '#ea580c', main: '#c2410c', soft: '#fed7aa', accent: '#2563eb' },
    rose:   { bg: '#fff1f2', border: '#e11d48', main: '#be123c', soft: '#fecdd3', accent: '#2563eb' },
    purple: { bg: '#f5f3ff', border: '#7c3aed', main: '#6d28d9', soft: '#ddd6fe', accent: '#f59e0b' },
    cyan:   { bg: '#ecfeff', border: '#0891b2', main: '#0e7490', soft: '#a5f3fc', accent: '#e11d48' },
    indigo: { bg: '#eef2ff', border: '#4f46e5', main: '#4338ca', soft: '#c7d2fe', accent: '#f59e0b' },
    pink:   { bg: '#fdf2f8', border: '#db2777', main: '#be185d', soft: '#fbcfe8', accent: '#2563eb' }
  };
  const THEME_KEYS = Object.keys(THEMES);

  const card = (t, body) =>
    `<svg class="mb-group-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="1.5" y="1.5" width="21" height="21" rx="5" fill="${t.bg}" stroke="${t.border}" stroke-width="1.35"/>${body}</svg>`;

  const tx = (x, y, s, fill, size = 8.5, weight = 800) =>
    `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="middle" font-family="Pretendard, 'Segoe UI', sans-serif">${s}</text>`;
  const mx = (x, y, s, fill, size = 9.5, italic = true) =>
    `<text x="${x}" y="${y}" font-size="${size}" font-weight="700" fill="${fill}" text-anchor="middle" font-family="'Times New Roman', Georgia, serif"${italic ? ' font-style="italic"' : ''}>${s}</text>`;
  const ln = (x1, y1, x2, y2, stroke, w = 1.65, dash = '') =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
  const dt = (x, y, r, fill, stroke = '#fff') =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="0.85"` : ''}/>`;

  const axes = (c = '#94a3b8') => ln(4, 18.5, 20, 18.5, c, 1.2) + ln(6, 20, 6, 4, c, 1.2);
  const cAxes = (c = '#94a3b8') => ln(3.8, 12, 20.2, 12, c, 1.1) + ln(12, 3.8, 12, 20.2, c, 1.1);

  // ── 큼직하고 선명한 도형·기호 드로잉 ──
  const DRAW = {
    // 실력 문제: 보라색 빛나는 별
    hard: () => card(THEMES.purple,
      `<polygon points="12,3.8 14.5,8.8 20,9.6 16,13.5 17,19 12,16.3 7,19 8,13.5 4,9.6 9.5,8.8" fill="#a855f7" stroke="#6d28d9" stroke-width="1.2" stroke-linejoin="round"/><circle cx="12" cy="12.2" r="2.4" fill="#fde047"/>`),

    // 점 세기 (1~9개)
    dots: (t, n = 5) => {
      const coords = [
        [[12, 12]],
        [[8.2, 12], [15.8, 12]],
        [[7.5, 15], [12, 7.2], [16.5, 15]],
        [[8, 8], [16, 8], [8, 16], [16, 16]],
        [[6.8, 7.5], [17.2, 7.5], [12, 12], [6.8, 16.5], [17.2, 16.5]],
        [[6.8, 8.2], [12, 8.2], [17.2, 8.2], [6.8, 15.8], [12, 15.8], [17.2, 15.8]],
        [[6.5, 7.5], [12, 7.5], [17.5, 7.5], [6.5, 12.8], [12, 12.8], [17.5, 12.8], [9.2, 17.5]],
        [[6.5, 7.2], [12, 7.2], [17.5, 7.2], [6.5, 12.4], [12, 12.4], [17.5, 12.4], [9.2, 17.4], [14.8, 17.4]],
        [[6.8, 6.8], [12, 6.8], [17.2, 6.8], [6.8, 12], [12, 12], [17.2, 12], [6.8, 17.2], [12, 17.2], [17.2, 17.2]]
      ][Math.max(1, Math.min(9, n)) - 1];
      return card(t, coords.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="2.2" fill="${i % 2 ? t.accent : t.main}" stroke="#fff" stroke-width="0.7"/>`).join(''));
    },

    // 수모형 (십모형 막대 + 낱개)
    blocks10: (t, rods = 2, ones = 3) => card(t,
      Array.from({ length: Math.min(3, rods) }, (_, i) => `<rect x="${4.2 + i * 3.8}" y="5" width="2.8" height="14" rx="0.7" fill="${t.soft}" stroke="${t.main}" stroke-width="1.1"/>${ln(4.2 + i * 3.8, 9.6, 7 + i * 3.8, 9.6, t.main, 0.85)}${ln(4.2 + i * 3.8, 14.2, 7 + i * 3.8, 14.2, t.main, 0.85)}`).join('') +
      Array.from({ length: Math.min(4, ones) }, (_, i) => `<rect x="${13.8 + (i % 2) * 3.3}" y="${15.5 - Math.floor(i / 2) * 3.5}" width="2.6" height="2.6" rx="0.5" fill="${t.accent}"/>`).join('')),

    // 숫자·글자 카드 두 장
    twinCards: (t, l = '5', r = '오') => card(t,
      `<rect x="3.5" y="5.5" width="7.8" height="13" rx="1.8" fill="#fff" stroke="${t.main}" stroke-width="1.2"/>${tx(7.4, 14.8, l, t.main, String(l).length > 1 ? 6.5 : 8.5)}` +
      `<rect x="12.7" y="5.5" width="7.8" height="13" rx="1.8" fill="${t.soft}" stroke="${t.main}" stroke-width="1.2"/>${tx(16.6, 14.8, r, t.main, String(r).length > 1 ? 6.2 : 8.2)}`),

    // 순서·차례 (줄 서기)
    nthQueue: (t, hi = 1) => card(t,
      [0, 1, 2, 3].map((i) => `<circle cx="${5.2 + i * 4.5}" cy="14" r="2.1" fill="${i === (hi % 4) ? t.accent : t.soft}" stroke="${t.main}" stroke-width="1.1"/>`).join('') +
      `<path d="M${5.2 + (hi % 4) * 4.5} 5v4.2m-1.8-1.6l1.8 1.8 1.8-1.8" fill="none" stroke="${t.accent}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`),

    // 수의 순서 3칸
    numSteps: (t, a = '1', b = '2', c = '3') => card(t,
      [a, b, c].map((v, i) => `<rect x="${3.3 + i * 5.9}" y="6.8" width="5.5" height="10.4" rx="1.4" fill="${i === 1 ? t.soft : '#fff'}" stroke="${t.main}" stroke-width="1.15"/>${tx(6.05 + i * 5.9, 14.5, v, i === 1 ? t.accent : t.main, String(v).length > 1 ? 5.8 : 7.5)}`).join('')),

    // 대소 비교
    compare: (t, l = '8', op = '>', r = '5') => card(t,
      `${tx(6, 15, l, '#0f172a', String(l).length > 1 ? 6.5 : 8.5)}<circle cx="12" cy="12" r="3.6" fill="${t.soft}" stroke="${t.main}" stroke-width="1.2"/>${tx(12, 14.6, op, t.main, 8)}${tx(18, 15, r, '#0f172a', String(r).length > 1 ? 6.5 : 8.5)}`),

    // 모으기와 가르기
    splitJoin: (t, top = '7', l = '3', r = '4') => card(t,
      `<circle cx="12" cy="6.5" r="3.2" fill="${t.soft}" stroke="${t.main}" stroke-width="1.2"/>${tx(12, 8.7, top, t.main, 6)}${ln(10.2, 9.3, 7.5, 14, t.main, 1.4)}${ln(13.8, 9.3, 16.5, 14, t.main, 1.4)}<circle cx="6.8" cy="17" r="3" fill="#fff" stroke="${t.main}" stroke-width="1.2"/>${tx(6.8, 19.1, l, t.main, 5.8)}<circle cx="17.2" cy="17" r="3" fill="#fff" stroke="${t.main}" stroke-width="1.2"/>${tx(17.2, 19.1, r, t.accent, 5.8)}`),

    // 사칙연산 기호
    opSign: (t, op = '+') => {
      let body = '';
      if (op === '+') body = ln(6.5, 12, 17.5, 12, t.main, 3) + ln(12, 6.5, 12, 17.5, t.main, 3);
      else if (op === '-') body = ln(6, 12, 18, 12, t.main, 3.2);
      else if (op === '×') body = ln(7, 7, 17, 17, t.main, 2.8) + ln(17, 7, 7, 17, t.main, 2.8);
      else if (op === '÷') body = ln(6, 12, 18, 12, t.main, 2.6) + dt(12, 6.8, 2, t.main, '') + dt(12, 17.2, 2, t.main, '');
      else if (op === '±') body = ln(5, 8.2, 11.4, 8.2, '#2563eb', 2.4) + ln(8.2, 5, 8.2, 11.4, '#2563eb', 2.4) + ln(12.6, 16.2, 19, 16.2, '#e11d48', 2.4) + ln(6, 18, 18, 6, '#94a3b8', 1.3);
      else body = tx(12, 15.5, op, t.main, 10);
      return card(t, body);
    },

    // 세로셈
    colCalc: (t, top = '24', op = '+', bot = '18') => card(t,
      `${tx(14.8, 9.8, top, '#0f172a', 7.2)}${tx(6.2, 15.6, op, t.accent, 7.8)}${tx(14.8, 15.6, bot, '#0f172a', 7.2)}${ln(4.5, 17.8, 19.5, 17.8, t.main, 1.6)}`),

    // 나눗셈 세로셈
    longDiv: (t, a = '3', b = '24') => card(t,
      `${tx(5.8, 16, a, '#0f172a', 7.2)}<path d="M9.4 8.2c0 5-1.3 7.8-2.6 9.6M9 8.2h10.5" fill="none" stroke="${t.main}" stroke-width="1.8" stroke-linecap="round"/>${tx(14.5, 16, b, t.main, 7.5)}`),

    // □가 있는 식
    boxEq: (t, op = '+', r = '5') => card(t,
      `<rect x="4" y="7.5" width="7" height="9" rx="1.6" fill="#fff" stroke="${t.main}" stroke-width="1.7"/>${tx(7.5, 14.5, '?', t.accent, 7.2)}${tx(13.5, 14.8, op, '#0f172a', 7.8)}${tx(18.2, 14.8, r, '#0f172a', 7.8)}`),

    // 문장제 말풍선
    storyBubble: (t, s = '+') => card(t,
      `<path d="M4.2 6A2 2 0 0 1 6.2 4h11.6a2 2 0 0 1 2 2v8.2a2 2 0 0 1-2 2H10.2l-3.6 3.2v-3.2H6.2a2 2 0 0 1-2-2z" fill="#fff" stroke="${t.main}" stroke-width="1.35"/>${tx(12, 13, s, t.main, s.length > 2 ? 6.5 : 9)}`),

    // 분수 원 조각
    fracPie: (t, num = 1, den = 4) => {
      const r = 7;
      let slices = '';
      for (let i = 0; i < den; i++) {
        const a1 = (-90 + (360 * i) / den) * Math.PI / 180;
        const a2 = (-90 + (360 * (i + 1)) / den) * Math.PI / 180;
        const x1 = (12 + r * Math.cos(a1)).toFixed(2), y1 = (12 + r * Math.sin(a1)).toFixed(2);
        const x2 = (12 + r * Math.cos(a2)).toFixed(2), y2 = (12 + r * Math.sin(a2)).toFixed(2);
        slices += `<path d="M12 12L${x1} ${y1}A${r} ${r} 0 0 1 ${x2} ${y2}Z" fill="${i < num ? t.main : '#fff'}" fill-opacity="${i < num ? '0.82' : '1'}" stroke="${t.main}" stroke-width="1.1"/>`;
      }
      return card(t, slices);
    },

    // 분수 표기 (대분수 또는 연산 기호 포함)
    fracText: (t, left = '', num = '1', den = '3') => card(t,
      (left ? tx(6.8, 15.2, left, t.accent, 8.2) : '') +
      `${tx(left ? 14.5 : 12, 9.8, num, t.main, 7.4)}${ln(left ? 10.5 : 7, 12, left ? 18.5 : 17, 12, t.main, 1.7)}${tx(left ? 14.5 : 12, 19, den, t.main, 7.4)}`),

    // 소수 표기
    deciText: (t, s = '0.5') => card(t,
      `<rect x="3.5" y="6.2" width="17" height="11.6" rx="2.2" fill="#fff" stroke="${t.main}" stroke-width="1.25"/>${tx(12, 15, s, t.main, s.length > 3 ? 7 : 8.5)}`),

    // 자·저울·비커·시계·달력
    ruler: (t, unit = 'cm') => card(t,
      `<rect x="3.2" y="6.8" width="17.6" height="6.8" rx="1" fill="#fde047" stroke="#a16207" stroke-width="1.15"/>` +
      [5.8, 8.3, 10.8, 13.3, 15.8, 18.3].map((x, i) => ln(x, 6.8, x, i % 2 === 0 ? 10.6 : 9.2, '#854d0e', 1)).join('') +
      tx(12, 19.6, unit, t.main, 6.8)),

    scale: (t, unit = 'kg') => card(t,
      `${ln(5, 8.8, 19, 7.6, t.main, 1.6)}<polygon points="12,8.4 9,18.5 15,18.5" fill="${t.soft}" stroke="${t.main}" stroke-width="1.2"/>${dt(5.8, 6.8, 2.3, t.accent, '')}${dt(18.2, 5.6, 1.8, t.main, '')}${tx(12, 17.2, unit, t.main, 5.2)}`),

    beaker: (t, unit = 'mL') => card(t,
      `<rect x="6" y="4.5" width="12" height="15" rx="1.4" fill="#fff" stroke="${t.main}" stroke-width="1.4"/><rect x="6.8" y="10.5" width="10.4" height="8.2" fill="${t.soft}"/>${ln(8.5, 8, 12.5, 8, t.main, 1.1)}${tx(12, 16.8, unit, t.main, 5.5)}`),

    clock: (t, h = 3, m = 0) => {
      const ha = (h * 30 + m * 0.5) * Math.PI / 180, ma = (m * 6) * Math.PI / 180;
      return card(t,
        `<circle cx="12" cy="12" r="7.2" fill="#fff" stroke="${t.main}" stroke-width="1.5"/>` +
        ln(12, 12, (12 + 3.6 * Math.sin(ha)).toFixed(1), (12 - 3.6 * Math.cos(ha)).toFixed(1), '#0f172a', 2) +
        ln(12, 12, (12 + 5.3 * Math.sin(ma)).toFixed(1), (12 - 5.3 * Math.cos(ma)).toFixed(1), t.accent, 1.4) +
        dt(12, 12, 1.2, '#0f172a', ''));
    },

    calendar: (t, d = '15') => card(t,
      `<rect x="4.2" y="5.2" width="15.6" height="14" rx="1.8" fill="#fff" stroke="${t.main}" stroke-width="1.3"/><rect x="4.2" y="5.2" width="15.6" height="4.2" rx="1" fill="${t.main}"/>${ln(8.2, 3.8, 8.2, 6.6, '#0f172a', 1.5)}${ln(15.8, 3.8, 15.8, 6.6, '#0f172a', 1.5)}${tx(12, 16.5, d, t.main, 8)}`),

    // 각·다각형·원·입체도형
    angle: (t, deg = 60) => card(t,
      deg === 90
        ? `${ln(5.8, 17.8, 18.2, 17.8, t.main, 1.8)}${ln(5.8, 17.8, 5.8, 5.4, t.main, 1.8)}<rect x="5.8" y="14" width="3.8" height="3.8" fill="none" stroke="${t.accent}" stroke-width="1.3"/>`
        : deg > 90
        ? `${ln(8, 17.8, 19, 17.8, t.main, 1.8)}${ln(8, 17.8, 4.2, 6.5, t.main, 1.8)}<path d="M12.8 17.8A4.8 4.8 0 0 0 6.5 13.2" fill="none" stroke="${t.accent}" stroke-width="1.4"/>`
        : `${ln(5.2, 17.8, 18.8, 17.8, t.main, 1.8)}${ln(5.2, 17.8, 16.2, 6.2, t.main, 1.8)}<path d="M11.2 17.8A5.8 5.8 0 0 0 9.4 13.5" fill="none" stroke="${t.accent}" stroke-width="1.4"/>`),

    polygon: (t, kind = 'tri', label = '') => {
      const shapes = {
        tri: `<polygon points="12,4.6 19.2,18.2 4.8,18.2" fill="${t.soft}" stroke="${t.main}" stroke-width="1.5" stroke-linejoin="round"/>`,
        rtri: `<polygon points="5.2,5.2 5.2,18.2 18.8,18.2" fill="${t.soft}" stroke="${t.main}" stroke-width="1.5" stroke-linejoin="round"/><rect x="5.2" y="14.8" width="3.4" height="3.4" fill="none" stroke="${t.accent}" stroke-width="1.2"/>`,
        pyth: `<polygon points="5.5,18 15.5,18 5.5,8" fill="${t.soft}" stroke="${t.main}" stroke-width="1.4" stroke-linejoin="round"/><rect x="5.5" y="15" width="3" height="3" fill="none" stroke="${t.main}" stroke-width="1.1"/>${tx(14.5, 11.2, label || 'c²', t.accent, 6.5)}`,
        iso: `<polygon points="12,4.5 18.2,18.2 5.8,18.2" fill="${t.soft}" stroke="${t.main}" stroke-width="1.5" stroke-linejoin="round"/>${ln(7.6, 11.2, 10, 11.8, t.accent, 1.4)}${ln(16.4, 11.2, 14, 11.8, t.accent, 1.4)}`,
        equi: `<polygon points="12,4.8 18.8,17.8 5.2,17.8" fill="${t.soft}" stroke="${t.main}" stroke-width="1.5" stroke-linejoin="round"/>${dt(12, 13.5, 1.8, t.accent, '')}`,
        circum: `<circle cx="12" cy="12.2" r="6.8" fill="#fff" stroke="${t.accent}" stroke-width="1.2"/><polygon points="12,5.5 18,16 6,16" fill="${t.soft}" stroke="${t.main}" stroke-width="1.3" stroke-linejoin="round"/>`,
        incenter: `<polygon points="12,4.5 19,18 5,18" fill="${t.soft}" stroke="${t.main}" stroke-width="1.4" stroke-linejoin="round"/><circle cx="12" cy="14" r="3.6" fill="#fff" stroke="${t.accent}" stroke-width="1.3"/>`,
        rect: `<rect x="4.5" y="6.5" width="15" height="11" rx="0.8" fill="${t.soft}" stroke="${t.main}" stroke-width="1.5"/>`,
        square: `<rect x="5.8" y="5.8" width="12.4" height="12.4" rx="0.8" fill="${t.soft}" stroke="${t.main}" stroke-width="1.5"/>`,
        gridArea: `<rect x="4.8" y="6.2" width="14.4" height="11.6" fill="${t.soft}" stroke="${t.main}" stroke-width="1.4"/>${ln(9.6, 6.2, 9.6, 17.8, t.main, 0.9)}${ln(14.4, 6.2, 14.4, 17.8, t.main, 0.9)}${ln(4.8, 12, 19.2, 12, t.main, 0.9)}`,
        trap: `<polygon points="8,6.2 16,6.2 19.2,17.8 4.8,17.8" fill="${t.soft}" stroke="${t.main}" stroke-width="1.5" stroke-linejoin="round"/>`,
        pgram: `<polygon points="7.6,6.5 19.2,6.5 16.4,17.5 4.8,17.5" fill="${t.soft}" stroke="${t.main}" stroke-width="1.5" stroke-linejoin="round"/>`,
        rhom: `<polygon points="12,4.5 19,12 12,19.5 5,12" fill="${t.soft}" stroke="${t.main}" stroke-width="1.5" stroke-linejoin="round"/>`,
        penta: `<polygon points="12,4.5 19.2,9.8 16.5,18.4 7.5,18.4 4.8,9.8" fill="${t.soft}" stroke="${t.main}" stroke-width="1.5" stroke-linejoin="round"/>`,
        hexa: `<polygon points="8.2,5 15.8,5 19.2,12 15.8,19 8.2,19 4.8,12" fill="${t.soft}" stroke="${t.main}" stroke-width="1.5" stroke-linejoin="round"/>`,
        diag: `<polygon points="5.8,5.8 18.2,5.8 18.2,18.2 5.8,18.2" fill="${t.soft}" stroke="${t.main}" stroke-width="1.4"/>${ln(5.8, 5.8, 18.2, 18.2, t.accent, 1.5)}${ln(18.2, 5.8, 5.8, 18.2, t.accent, 1.5)}`,
        circle: `<circle cx="12" cy="12" r="6.8" fill="${t.soft}" stroke="${t.main}" stroke-width="1.5"/>${dt(12, 12, 1.4, t.main, '')}${ln(12, 12, 18.8, 12, t.accent, 1.6)}`,
        tangent: `<circle cx="10.8" cy="11" r="5.8" fill="${t.soft}" stroke="${t.main}" stroke-width="1.4"/>${ln(4.2, 18.5, 19.8, 12, t.accent, 1.7)}`,
        inscribed: `<circle cx="12" cy="12" r="6.8" fill="#fff" stroke="${t.main}" stroke-width="1.4"/><polyline points="7.5,17 12,5.2 16.8,16.8" fill="none" stroke="${t.accent}" stroke-width="1.6" stroke-linejoin="round"/>`,
        sector: `<circle cx="12" cy="12" r="6.8" fill="#fff" stroke="${t.main}" stroke-width="1.2"/><path d="M12 12L12 5.2A6.8 6.8 0 0 1 18.8 12Z" fill="${t.soft}" stroke="${t.main}" stroke-width="1.4"/>`
      };
      const inner = (shapes[kind] || shapes.tri) + (label && kind !== 'pyth' ? tx(12, 15.2, label, t.accent, 6.2) : '');
      return card(t, inner);
    },

    solid3d: (t, kind = 'box') => {
      const solids = {
        box: `<polygon points="12,4.2 19,7.8 12,11.4 5,7.8" fill="${t.soft}" stroke="${t.main}" stroke-width="1.15"/><polygon points="5,7.8 12,11.4 12,19.6 5,16" fill="#fff" stroke="${t.main}" stroke-width="1.15"/><polygon points="12,11.4 19,7.8 19,16 12,19.6" fill="${t.soft}" stroke="${t.main}" stroke-width="1.15"/>`,
        net: `<rect x="9.5" y="4.2" width="5" height="5.2" fill="${t.soft}" stroke="${t.main}" stroke-width="1.1"/><rect x="4.5" y="9.4" width="5" height="5.2" fill="#fff" stroke="${t.main}" stroke-width="1.1"/><rect x="9.5" y="9.4" width="5" height="5.2" fill="${t.soft}" stroke="${t.main}" stroke-width="1.1"/><rect x="14.5" y="9.4" width="5" height="5.2" fill="#fff" stroke="${t.main}" stroke-width="1.1"/><rect x="9.5" y="14.6" width="5" height="5.2" fill="${t.soft}" stroke="${t.main}" stroke-width="1.1"/>`,
        prism: `<polygon points="12,4.2 18.2,8.4 5.8,8.4" fill="${t.soft}" stroke="${t.main}" stroke-width="1.2"/><polygon points="5.8,8.4 18.2,8.4 18.2,18.4 5.8,18.4" fill="#fff" stroke="${t.main}" stroke-width="1.2"/>${ln(12, 4.2, 12, 18.4, t.main, 1.1, '2 1.5')}`,
        pyramid: `<polygon points="12,4.2 4.8,17 12,19.6 19.2,17" fill="${t.soft}" stroke="${t.main}" stroke-width="1.3" stroke-linejoin="round"/>${ln(12, 4.2, 12, 19.6, t.main, 1.2)}`,
        cyl: `<ellipse cx="12" cy="6.8" rx="5.8" ry="2.3" fill="${t.soft}" stroke="${t.main}" stroke-width="1.25"/><path d="M6.2 6.8v10.4c0 1.3 2.6 2.3 5.8 2.3s5.8-1 5.8-2.3V6.8" fill="#fff" stroke="${t.main}" stroke-width="1.25"/><ellipse cx="12" cy="6.8" rx="5.8" ry="2.3" fill="${t.soft}" stroke="${t.main}" stroke-width="1.25"/>`,
        cone: `<path d="M12 4.5L6 17c0 1.3 2.7 2.4 6 2.4s6-1.1 6-2.4Z" fill="${t.soft}" stroke="${t.main}" stroke-width="1.3"/><ellipse cx="12" cy="17" rx="6" ry="2.3" fill="#fff" stroke="${t.main}" stroke-width="1.15"/>`,
        sphere: `<circle cx="12" cy="12" r="6.8" fill="${t.soft}" stroke="${t.main}" stroke-width="1.3"/><ellipse cx="12" cy="12" rx="6.8" ry="2.4" fill="none" stroke="${t.accent}" stroke-width="1.1" stroke-dasharray="2 1.4"/>`
      };
      return card(t, solids[kind] || solids.box);
    },

    transform: (t, kind = 'slide') => {
      if (kind === 'flip') return card(t, `${ln(12, 4.2, 12, 19.8, t.accent, 1.3, '2 1.5')}<polygon points="9.8,6.8 4.8,17 9.8,17" fill="${t.soft}" stroke="${t.main}" stroke-width="1.2"/><polygon points="14.2,6.8 19.2,17 14.2,17" fill="#fff" stroke="${t.main}" stroke-width="1.2"/>`);
      if (kind === 'turn') return card(t, `<path d="M7 15.2A5.8 5.8 0 0 1 16.8 8.2" fill="none" stroke="${t.main}" stroke-width="1.8" stroke-linecap="round"/><polygon points="17.8,10.5 18.2,6.5 14.5,8.2" fill="${t.main}"/>${dt(12, 13.8, 2, t.accent, '')}`);
      return card(t, `<polygon points="4.5,7.8 10,7.8 7.2,16.8" fill="#fff" stroke="${t.main}" stroke-width="1.2"/><polygon points="14,7.8 19.5,7.8 16.8,16.8" fill="${t.soft}" stroke="${t.main}" stroke-width="1.2"/>${ln(9.5, 12, 14.5, 12, t.accent, 1.6)}`);
    },

    // 그래프·표·규칙
    chart: (t, kind = 'bar') => {
      if (kind === 'line') return card(t, `${axes('#64748b')}<polyline points="6.8,15.8 10.5,10.5 14.2,13.2 18.6,6.5" fill="none" stroke="${t.main}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>${dt(6.8, 15.8, 1.6, t.accent, '')}${dt(10.5, 10.5, 1.6, t.accent, '')}${dt(14.2, 13.2, 1.6, t.accent, '')}${dt(18.6, 6.5, 1.6, t.accent, '')}`);
      if (kind === 'pie') return card(t, `<circle cx="12" cy="12" r="6.8" fill="${t.soft}" stroke="${t.main}" stroke-width="1.3"/><path d="M12 12V5.2A6.8 6.8 0 0 1 18.8 12Z" fill="${t.main}"/><path d="M12 12H18.8A6.8 6.8 0 0 1 8.4 17.8Z" fill="${t.accent}" opacity="0.85"/>`);
      if (kind === 'scatter') return card(t, `${axes('#64748b')}${[[7.5, 15.8], [9.5, 13], [11.6, 14.2], [13.6, 10.2], [15.8, 8.8], [18, 6.5]].map(([x, y], i) => dt(x, y, 1.6, i % 2 ? t.accent : t.main, '')).join('')}`);
      if (kind === 'table') return card(t, `<rect x="4.2" y="5.2" width="15.6" height="13.6" rx="1.4" fill="#fff" stroke="${t.main}" stroke-width="1.3"/><rect x="4.2" y="5.2" width="15.6" height="4.2" fill="${t.soft}"/>${ln(12, 5.2, 12, 18.8, t.main, 1.1)}${ln(4.2, 14, 19.8, 14, t.main, 1.1)}`);
      return card(t, `${ln(4.5, 18.6, 19.5, 18.6, '#334155', 1.3)}<rect x="5.8" y="11.8" width="3" height="6.8" fill="${t.soft}" stroke="${t.main}" stroke-width="0.9"/><rect x="10.5" y="6.6" width="3" height="12" fill="${t.main}"/><rect x="15.2" y="9.5" width="3" height="9.1" fill="${t.accent}"/>`);
    },

    pattern: (t, mode = 'shape') => card(t,
      mode === 'num'
        ? `${tx(6, 15.2, '2', t.main, 7.8)}${tx(12, 15.2, '4', t.accent, 7.8)}${tx(18, 15.2, '6', t.main, 7.8)}<path d="M7.2 8.5q4.8-3.4 9.6 0" fill="none" stroke="${t.main}" stroke-width="1.4" stroke-linecap="round"/>`
        : `<circle cx="6" cy="12" r="2.4" fill="${t.accent}"/><polygon points="12,9.2 14.8,14.8 9.2,14.8" fill="${t.main}"/><circle cx="18" cy="12" r="2.4" fill="${t.accent}"/>`),

    // 중·고등 좌표·함수·집합·행렬·수식
    coord: (t, mode = 'dist') => {
      if (mode === 'div') return card(t, `${axes()}${ln(5.5, 16.8, 18.8, 6.2, t.main, 1.8)}${dt(5.5, 16.8, 2, t.main)}${dt(18.8, 6.2, 2, t.main)}${dt(13.4, 10.5, 2.4, t.accent)}${tx(10.2, 8.2, 'm:n', t.accent, 5.8)}`);
      if (mode === 'line') return card(t, `${axes()}${ln(4.5, 17.2, 19.5, 5.8, t.main, 2.1)}${dt(9.5, 13.4, 1.8, t.accent)}`);
      if (mode === 'pp') return card(t, `${axes()}${ln(4.8, 15.5, 17, 5.2, t.main, 1.8)}${ln(7, 18.2, 19.2, 7.8, t.main, 1.8)}${ln(6, 6.8, 16.5, 17.2, t.accent, 1.6)}`);
      if (mode === 'pd') return card(t, `${ln(4.8, 17.8, 19.2, 7.2, t.main, 2)}${dt(7.8, 6.8, 2.3, t.accent)}${ln(7.8, 6.8, 12.8, 11.9, t.accent, 1.5, '2.2 1.4')}`);
      if (mode === 'quad') return card(t, `${cAxes()}${dt(16.2, 7.8, 2.2, t.accent)}${dt(7.8, 16.2, 2.2, t.main)}`);
      return card(t, `${axes()}${ln(6.5, 16.2, 17.8, 6.8, t.accent, 1.7, '2.2 1.5')}${dt(6.5, 16.2, 2.3, t.main)}${dt(17.8, 6.8, 2.3, t.main)}`);
    },

    curve: (t, kind = 'parabola') => {
      if (kind === 'hyper') return card(t, `${cAxes()}<path d="M13.4 4.2Q14 10 19.8 10.6M4.2 13.4Q10 14 10.6 19.8" fill="none" stroke="${t.main}" stroke-width="2" stroke-linecap="round"/>`);
      if (kind === 'sqrt') return card(t, `${axes()}<path d="M6 18.5Q9.2 9 19.8 7" fill="none" stroke="${t.main}" stroke-width="2.1" stroke-linecap="round"/>${dt(6, 18.5, 1.9, t.accent)}`);
      if (kind === 'cross') return card(t, `${cAxes()}<path d="M5.2 6.2Q12 21.4 18.8 6.2" fill="none" stroke="${t.main}" stroke-width="1.9" stroke-linecap="round"/>${ln(4.2, 15.8, 19.8, 8.2, t.accent, 1.6)}`);
      if (kind === 'down') return card(t, `${cAxes()}<path d="M5.2 17.8Q12 2.6 18.8 17.8" fill="none" stroke="${t.main}" stroke-width="2" stroke-linecap="round"/>`);
      return card(t, `${cAxes()}<path d="M5.2 6.2Q12 21.4 18.8 6.2" fill="none" stroke="${t.main}" stroke-width="2" stroke-linecap="round"/>${dt(12, 13.8, 1.8, t.accent)}`);
    },

    venn: (t, mode = 'inter', label = '') => card(t,
      `<circle cx="9.4" cy="12" r="5" fill="${mode === 'union' ? t.main : t.soft}" fill-opacity="0.78" stroke="${t.main}" stroke-width="1.25"/><circle cx="14.6" cy="12" r="5" fill="${mode === 'union' ? t.main : '#fde68a'}" fill-opacity="0.72" stroke="${t.accent}" stroke-width="1.25"/>` +
      (label ? tx(12, 14.4, label, '#0f172a', 5.8) : '')),

    matrix: (t, a = 'a', b = 'b', c = 'c', d = 'd') => card(t,
      `<path d="M7.2 5.5H5v13h2.2M16.8 5.5H19v13h-2.2" fill="none" stroke="${t.main}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>${tx(9.4, 10.6, a, t.main, 6.4)}${tx(14.6, 10.6, b, t.accent, 6.4)}${tx(9.4, 16.8, c, t.accent, 6.4)}${tx(14.6, 16.8, d, t.main, 6.4)}`),

    dice: (t, pips = 3) => {
      const p = pips % 2
        ? `${dt(8.2, 8.2, 1.5, t.main, '')}${dt(12, 12, 1.5, t.accent, '')}${dt(15.8, 15.8, 1.5, t.main, '')}`
        : `${dt(8.5, 8.5, 1.5, t.main, '')}${dt(15.5, 8.5, 1.5, t.accent, '')}${dt(8.5, 15.5, 1.5, t.accent, '')}${dt(15.5, 15.5, 1.5, t.main, '')}`;
      return card(t, `<rect x="4.8" y="4.8" width="14.4" height="14.4" rx="2.8" fill="#fff" stroke="${t.main}" stroke-width="1.5"/>${p}`);
    },

    mathText: (t, expr = 'f(x)') => card(t,
      mx(12, 15.2, expr, t.main, expr.length > 4 ? 6.8 : expr.length > 2 ? 8.2 : 10, /[a-zA-Z]/.test(expr)))
  };

  function pickIcon(unit, group, index) {
    if (!group || group.id === 'hard' || /실력/.test(group.title)) return DRAW.hard();
    const uid = unit ? unit.id : '';
    const gid = group.id || '';
    const title = String(group.title || '');
    const t = THEMES[THEME_KEYS[((unit ? unit.no * 3 + unit.grade : 0) + index * 2) % THEME_KEYS.length]];

    // ── 고1-2 (10-2) ──
    if (uid === '10-2-1') {
      if (gid === 'dist') return DRAW.coord(THEMES.blue, 'dist');
      if (gid === 'div') return DRAW.coord(THEMES.teal, 'div');
      if (gid === 'line') return DRAW.coord(THEMES.amber, 'line');
      if (gid === 'pp') return DRAW.coord(THEMES.green, 'pp');
      if (gid === 'pd') return DRAW.coord(THEMES.rose, 'pd');
    }
    if (uid === '10-2-2') {
      if (gid === 'circle') return DRAW.polygon(THEMES.blue, 'circle');
      if (gid === 'general') return DRAW.mathText(THEMES.teal, 'x²+y²');
      if (gid === 'cond') return DRAW.polygon(THEMES.amber, 'circum');
      if (gid === 'meet') return DRAW.polygon(THEMES.green, 'inscribed');
      if (gid === 'tangent') return DRAW.polygon(THEMES.rose, 'tangent');
    }
    if (uid === '10-2-3') {
      if (gid === 'pmove') return DRAW.coord(THEMES.blue, 'quad');
      if (gid === 'pfig') return DRAW.transform(THEMES.teal, 'slide');
      if (gid === 'pcond') return DRAW.coord(THEMES.amber, 'line');
      if (gid === 'smove') return DRAW.transform(THEMES.purple, 'flip');
      if (gid === 'sfig') return DRAW.transform(THEMES.pink, 'flip');
      if (gid === 'mix') return DRAW.transform(THEMES.cyan, 'turn');
      if (gid === 'short') return DRAW.coord(THEMES.rose, 'pd');
    }
    if (uid === '10-2-4') {
      const map = { meaning: 'a∈A', subset: 'A⊂B', union: '∪∩', diff: 'A-B', demorgan: '(A∪B)ᶜ', cond: 'A∩B', count: 'n(A)' };
      return gid === 'union' || gid === 'diff' ? DRAW.venn(t, gid === 'union' ? 'union' : 'inter', map[gid]) : DRAW.mathText(t, map[gid] || 'A⊂B');
    }
    if (uid === '10-2-5') {
      const map = { prop: 'p, q', quant: '∀x', impl: 'p→q', conv: 'q→p', cond: 'p⇔q', proof: '~q→~p', ineq: 'a²≥0' };
      return DRAW.mathText(t, map[gid] || 'p→q');
    }
    if (uid === '10-2-6') {
      const map = { func: 'X→Y', same: 'f=g', graph: 'y=f(x)', kinds: '1:1', comp: 'g∘f', compx: 'f(g)', inv: 'f⁻¹', invx: 'y=x' };
      return DRAW.mathText(t, map[gid] || 'f(x)');
    }
    if (uid === '10-2-7') {
      if (gid === 'rexpr') return DRAW.mathText(THEMES.cyan, '1/x');
      if (gid === 'rgraph') return DRAW.curve(THEMES.blue, 'hyper');
      if (gid === 'ruse') return DRAW.curve(THEMES.indigo, 'hyper');
      if (gid === 'iexpr') return DRAW.mathText(THEMES.teal, '√x');
      if (gid === 'igraph') return DRAW.curve(THEMES.green, 'sqrt');
      if (gid === 'iuse') return DRAW.curve(THEMES.amber, 'sqrt');
    }

    // ── 고1-1 (10-1) ──
    if (uid === '10-1-8') {
      const pairs = [['a', 'b', 'c', 'd'], ['1', '2', '3', '4'], ['+', '-', 'k', 'A'], ['X', '=', 'A', 'B'], ['2', '0', '1', '3'], ['A', '×', 'B', 'C'], ['1', '0', '0', '1'], ['A', 'X', '=', 'B'], ['p', 'q', 'r', 's']];
      const p = pairs[index % pairs.length];
      return DRAW.matrix(t, p[0], p[1], p[2], p[3]);
    }
    if (uid === '10-1-7') {
      const map = { sum: 'm+n', product: 'm×n', perm: 'ₙPᵣ', line: 'n!', number: '123', comb: 'ₙCᵣ', pick: 'C', shape: '△' };
      return gid === 'pick' ? DRAW.dice(t, 4) : gid === 'shape' ? DRAW.polygon(t, 'tri') : DRAW.mathText(t, map[gid] || 'ₙPᵣ');
    }
    if (uid === '10-1-3') {
      const map = { cx: 'a+bi', calc: 'z₁+z₂', pow: 'iⁿ', neg: '√-a', cond: 'z̄', disc: 'D>0', kval: 'D=0', vieta: 'α+β', coef: 'αβ', make: 'x²=0', conj: 'p+qi' };
      return DRAW.mathText(t, map[gid] || 'a+bi');
    }
    if (uid === '10-1-4') {
      if (gid === 'xaxis') return DRAW.curve(THEMES.blue, 'parabola');
      if (gid === 'line') return DRAW.curve(THEMES.rose, 'cross');
      if (gid === 'maxmin') return DRAW.curve(THEMES.purple, 'down');
      return DRAW.polygon(THEMES.green, 'rect');
    }

    // ── 제목 기반 정밀 매칭 ──
    if (/달력/.test(title)) return DRAW.calendar(t, String(10 + index * 3));
    if (/시각|몇 시|시간|초와 분|걸린 시간|하루/.test(title)) return DRAW.clock(t, (index * 2 + 3) % 12 || 12, /30분|분|초/.test(title) ? 30 : 0);
    if (/들이|L와 mL/.test(title)) return DRAW.beaker(t, /L와/.test(title) ? 'L' : 'mL');
    if (/무게|kg|g, t/.test(title)) return DRAW.scale(t, /t/.test(title) ? 't' : 'kg');
    if (/자로|줄자|cm|mm|km|1 m|길이/.test(title) && !/닮음|피타고라스|호의 길이|삼각비|선분의 길이|넓이/.test(title)) {
      return DRAW.ruler(t, /km/.test(title) ? 'km' : /mm/.test(title) ? 'mm' : /1 m/.test(title) ? 'm' : 'cm');
    }

    if (/막대그래프|히스토그램/.test(title)) return DRAW.chart(t, 'bar');
    if (/꺾은선|도수분포다각형|상대도수의 그래프/.test(title)) return DRAW.chart(t, 'line');
    if (/띠그래프|원그래프/.test(title)) return DRAW.chart(t, 'pie');
    if (/산점도|상관관계/.test(title)) return DRAW.chart(t, 'scatter');
    if (/그림그래프|표와 그래프|표로|도수분포표|줄기와 잎|분류/.test(title)) return DRAW.chart(t, 'table');
    if (/평균|대푯값|산포도|분산|표준편차|편차/.test(title)) return /분산|표준편차|산포도/.test(title) ? DRAW.mathText(t, 'σ²') : DRAW.chart(t, 'bar');
    if (/가능성|확률|경우의 수|주사위|순열|조합|뽑기/.test(title)) return DRAW.dice(t, index + 1);

    if (/원기둥/.test(title)) return DRAW.solid3d(t, /전개도/.test(title) ? 'net' : 'cyl');
    if (/원뿔|뿔의/.test(title)) return DRAW.solid3d(t, 'cone');
    if (/\b구\b|구의/.test(title) && !/구구|구하기/.test(title)) return DRAW.solid3d(t, 'sphere');
    if (/각뿔/.test(title)) return DRAW.solid3d(t, 'pyramid');
    if (/각기둥|기둥의/.test(title)) return DRAW.solid3d(t, /전개도/.test(title) ? 'net' : 'prism');
    if (/전개도/.test(title)) return DRAW.solid3d(t, 'net');
    if (/직육면체|정육면체|쌓기나무|쌓은 모양|공간과 입체|다면체|정다면체|회전체/.test(title)) return DRAW.solid3d(t, 'box');

    if (/밀기|평행이동/.test(title)) return DRAW.transform(t, 'slide');
    if (/뒤집기|선대칭|대칭이동/.test(title)) return DRAW.transform(t, 'flip');
    if (/돌리기|점대칭|돌려서/.test(title)) return DRAW.transform(t, 'turn');

    if (/외심/.test(title)) return DRAW.polygon(t, 'circum');
    if (/내심|내접원/.test(title)) return DRAW.polygon(t, 'incenter');
    if (/접선/.test(title)) return DRAW.polygon(t, 'tangent');
    if (/원주각/.test(title)) return DRAW.polygon(t, 'inscribed');
    if (/부채꼴|중심각|호의 길이|반원/.test(title)) return DRAW.polygon(t, 'sector');
    if (/원주|원의|원 /.test(title) && !/원소|원점|원기둥|원뿔|원그래프/.test(title)) return DRAW.polygon(t, 'circle');
    if (/피타고라스/.test(title)) return DRAW.polygon(t, 'pyth', ['c²', 'a²', 'b²', '직각', '3:4:5', '넓이', '반원', '활용'][index % 8]);
    if (/삼각비/.test(title)) return DRAW.polygon(t, 'pyth', ['sin', 'cos', 'tan', '30°', '45°', '60°'][index % 6]);
    if (/직각삼각형/.test(title)) return DRAW.polygon(t, 'rtri');
    if (/이등변삼각형/.test(title)) return DRAW.polygon(t, 'iso');
    if (/정삼각형/.test(title)) return DRAW.polygon(t, 'equi');
    if (/삼각형|무게중심|합동|닮음/.test(title)) return DRAW.polygon(t, 'tri');
    if (/사다리꼴/.test(title)) return DRAW.polygon(t, 'trap');
    if (/평행사변형/.test(title)) return DRAW.polygon(t, 'pgram');
    if (/마름모/.test(title)) return DRAW.polygon(t, 'rhom');
    if (/대각선/.test(title)) return DRAW.polygon(t, 'diag');
    if (/cm²|m²|km²|넓이 세기/.test(title)) return DRAW.polygon(t, 'gridArea');
    if (/다각형|정다각형|오각형|육각형|여러 도형/.test(title)) return DRAW.polygon(t, index % 2 ? 'hexa' : 'penta');
    if (/사각형|직사각형|정사각형|칠교판|모양/.test(title) && !/수 배열/.test(title)) return DRAW.polygon(t, /정사각형/.test(title) ? 'square' : 'rect');
    if (/각도|직각|예각|둔각|맞꼭지각|동위각|엇각|\b각\b/.test(title)) return DRAW.angle(t, /직각|수직/.test(title) ? 90 : /둔각/.test(title) ? 120 : 60);
    if (/선분|직선|반직선|평행|수직|작도|점·선·면/.test(title)) return DRAW.coord(t, /평행|수직/.test(title) ? 'pp' : /내분/.test(title) ? 'div' : 'line');

    if (/이차함수|포물선/.test(title)) return DRAW.curve(t, index % 2 ? 'down' : 'parabola');
    if (/반비례|유리함수/.test(title)) return DRAW.curve(t, 'hyper');
    if (/정비례|일차함수|좌표평면|사분면|순서쌍/.test(title)) return DRAW.coord(t, /사분면|순서쌍|점/.test(title) ? 'quad' : 'line');

    if (/제곱근|근호|무리수/.test(title)) return DRAW.mathText(t, ['√a', '√2', 'a√b', '√ab'][index % 4]);
    if (/인수분해|완전제곱|나머지정리|조립제법|항등식|다항식|단항식|지수법칙|문자의 사용|식의 값|동류항/.test(title)) {
      return DRAW.mathText(t, /지수|거듭제곱/.test(title) ? 'aⁿ' : /인수분해|완전제곱/.test(title) ? '(x+a)²' : ['2x+y', 'x²+x', '3ab', 'P(x)'][index % 4]);
    }
    if (/부등식|이상, 이하|수의 범위/.test(title)) return DRAW.compare(t, 'x', ['>', '<', '≥', '≤'][index % 4], 'a');
    if (/방정식|등식|이항|연립/.test(title)) return DRAW.mathText(t, /이차/.test(title) ? 'x²=a' : /연립/.test(title) ? 'x, y' : 'x=a');

    if (/비와 비율|비례식|비례배분|백분율|대응 관계|\b비\b/.test(title)) return /백분율/.test(title) ? DRAW.mathText(t, '%') : DRAW.twinCards(t, 'a:b', 'c:d');
    if (/약수와 배수|약수|배수|공약수|공배수|소인수|소수와 합성수/.test(title)) return DRAW.splitJoin(t, '12', '3', '4');
    if (/약분|통분|분수/.test(title)) {
      if (/덧셈|더하기/.test(title)) return DRAW.fracText(t, '+', '1', '3');
      if (/뺄셈|빼기/.test(title)) return DRAW.fracText(t, '−', '2', '3');
      if (/곱셈/.test(title)) return DRAW.fracText(t, '×', '1', '2');
      if (/나눗셈/.test(title)) return DRAW.fracText(t, '÷', '3', '4');
      if (/대분수/.test(title)) return DRAW.fracText(t, '1', '1', '2');
      return DRAW.fracPie(t, (index % 3) + 1, 4);
    }
    if (/소수|순환소수|유한소수/.test(title)) return DRAW.deciText(t, '0.' + ((index % 8) + 1));
    if (/올림|버림|반올림|어림/.test(title)) return DRAW.twinCards(t, '48', '50');

    if (/규칙|무늬|배열/.test(title)) return DRAW.pattern(t, /수|덧셈|곱셈|계산/.test(title) ? 'num' : 'shape');
    if (/모으기와 가르기/.test(title)) return DRAW.splitJoin(t, '9', '4', '5');
    if (/□|빈칸/.test(title)) return DRAW.boxEq(t, '+', String((index % 7) + 2));
    if (/문장제|활용|이야기/.test(title)) return DRAW.storyBubble(t, ['?', '+', '−', '×'][index % 4]);
    if (/\( \)|혼합 계산|섞여 있는|계산 순서/.test(title)) return DRAW.mathText(t, ['(a+b)', 'a+b×c', 'a-b÷c', '( )'][index % 4]);

    if (/나눗셈|똑같이 나누|몫|나머지/.test(title)) return index % 2 === 0 ? DRAW.opSign(t, '÷') : DRAW.longDiv(t, String((index % 6) + 2), String(((index % 6) + 2) * 4));
    if (/곱셈|구구|몇 배|묶어 세기/.test(title)) return index % 2 === 0 ? DRAW.opSign(t, '×') : DRAW.colCalc(t, String(12 + index), '×', String((index % 7) + 2));
    if (/덧셈과 뺄셈/.test(title)) return DRAW.opSign(t, '±');
    if (/덧셈|더하기/.test(title)) return index % 2 === 0 ? DRAW.opSign(t, '+') : DRAW.colCalc(t, String(21 + index), '+', String(14 + index));
    if (/뺄셈|빼기/.test(title)) return index % 2 === 0 ? DRAW.opSign(t, '-') : DRAW.colCalc(t, String(45 + index), '−', String(18 + index));

    if (/크기 비교|비교|대소/.test(title)) return DRAW.compare(t, String(index + 6), index % 2 ? '<' : '>', String(index + 3));
    if (/몇째/.test(title)) return DRAW.nthQueue(t, index);
    if (/순서|뛰어 세기|1만큼/.test(title)) return DRAW.numSteps(t, index + 1, index + 2, index + 3);
    if (/짝수와 홀수/.test(title)) return DRAW.dots(t, 5);
    if (/수 카드/.test(title)) return DRAW.twinCards(t, '3', '8');
    if (/읽기|읽고 쓰기/.test(title)) return DRAW.twinCards(t, String((index % 9) + 1), ['일', '이', '삼', '사', '오', '육', '칠', '팔', '구'][index % 9]);
    if (/십|백|천|자리/.test(title) && !/만|억|조/.test(title)) return DRAW.blocks10(t, (index % 3) + 1, (index % 4) + 1);
    if (/만|억|조|큰 수/.test(title)) return DRAW.mathText(t, /조/.test(title) ? '1조' : /억/.test(title) ? '1억' : '1만');
    if (/^0$|0이/.test(title)) return DRAW.mathText(t, '0');

    return DRAW.dots(t, ((index + 2) % 8) + 2);
  }

  // 한 단원 안에서 같은 아이콘이 나오지 않게 보정
  function forGroup(unit, group, index = 0) {
    if (!unit || !Array.isArray(unit.groups)) return pickIcon(unit, group, index);
    const seen = new Set();
    for (let i = 0; i <= index; i++) {
      const g = unit.groups[i];
      let svg = pickIcon(unit, g, i);
      let bump = 1;
      while (seen.has(svg) && bump < 20) {
        svg = pickIcon({ id: unit.id, grade: unit.grade, no: unit.no + bump }, g, i + bump);
        bump++;
      }
      if (i === index) return svg;
      seen.add(svg);
    }
    return pickIcon(unit, group, index);
  }

  root.MathBankIcons = { forGroup };
  if (typeof module !== 'undefined' && module.exports) module.exports = { forGroup };
})(typeof window !== 'undefined' ? window : globalThis);
