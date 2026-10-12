// 2학년 1학기 1단원 세 자리 수 — 단원 틀과 기본 문항(백, 몇백, 세 자리 수 읽고 쓰기, 각 자리의 숫자가 나타내는 값).
// 수집해 둔 교과서(국정 한 종)의 평가 자료 — 미래엔·아이스크림미디어·천재의 단원평가·차시학습지·수행평가 — 에서 뽑은
// 꼴 목록(기본꼴_1 74꼴, 심화꼴 41꼴)을 처음부터 끝까지 대조하여 꼴마다 ① 2학년 1학기 이 단원의 내용인가 ② 무엇을 하게 하는 문제인가를 따져 실었다.
// 유형마다 꼴 번호를 적는다(①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번). 뛰어 세기·크기 비교의 기본 문항과 실력 문항은 2-1-1b.js에 있다.
//
// 영역은 수와 연산. 성취기준 [2수01-02](자릿값과 위치적 기수법, 읽고 쓰기), [2수01-03](수의 계열, 크기 비교) 가운데 세 자리 수까지.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(수 모형·동전·묶음·글·읽는 말)과 묻는 것(수·개수·읽는 말 고르기·틀린 설명)이 다르면 따로 싣는다.
//    수만 다르거나 상황(물건·이름)만 다른 것은 한 번만 싣는다.
//  - 교육과정의 금: 수를 한글로 쓰게 하지 않는다 → 읽는 말은 고르기로만 묻고 답 칸에는 숫자만 받는다.
//    1000은 「999보다 1만큼 더 큰 수」「100이 10개인 수」까지만 다루고 1000을 넘는 수는 보기에도 쓰지 않는다.
//  - 한 문항에 답 칸은 넷까지. 수 모형은 엔진의 blocks 를 쓰고, 십 모형·일 모형이 10개를 넘는 그림만 이 파일의 model 로 그린다.
//
// 뺀 것과 까닭
//  - 빈칸의 수끼리 견주는 뜻 없는 셈: ①22(㉠·㉡·㉢에 알맞은 수 가운데 가장 큰 것) — 세 빈칸은 hd-gap, hs-count 가 따로 묻는다.
//    두 숫자가 나타내는 값의 합: 심19 — 4-1-1과 같은 잣대(값끼리 더하는 것은 이 단원의 일이 아니다).
//  - 작도·열린 답: ①19·심8(주어진 만큼 묶기 — 수 답으로 바꾸면 「몇백은 100이 몇 개인 수」와 같은 일이라 hs-count 하나로 묻는다),
//    ①35·심14의 그리기(고르기 꼴만 th-symbols 로 실음), ①47(수 모형에 ○표 — 「숫자가 나타내는 수 모형」 고르기 pl-model 로 바꿈), 심21(조건에 맞는 수를 아무거나 만들기).
//  - 그림을 알 수 없는 꼴: ①6(두 묶음을 모으는 그림 — 두 빛깔 묶음 그림 hd-bundles 로 실음), ①17(색칠한 칸과 더 가까운 몇백 — 글로 묻는 심7 꼴 hs-near 로 실음).
//  - 범위 밖: ①8의 20개씩·50개씩 묶음(뒤 단원의 묶어 세기) — 10개씩 10묶음(hd-ten-rows)으로 바꾸어 실음.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, box, lines, tagged, numbers, table, blocks, josa, say, N, M, C } = B.kit;
  const NUM = '2수01-02', ORDER = '2수01-03';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const PLACES = ['일', '십', '백'], MODELS = ['일 모형', '십 모형', '백 모형'];
  const pow = (k) => [1, 10, 100][k];
  const digitAt = (n, k) => Math.floor(n / pow(k)) % 10;
  const dx = (n, k) => `((${n}-${n}%${pow(k)})/${pow(k)})%10`;      // 검사가 자리 숫자를 다시 셈하는 식
  const vx = (n, k) => `(${dx(n, k)})*${pow(k)}`;                   // 그 숫자가 나타내는 값
  const pickDigits = (d, len, from) => d.shuffle(from || [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, len);
  const toNum = (digits) => digits.reduce((n, v) => n * 10 + v, 0);
  // 세 자리 수: 10^p 자리에만 숫자 t 가 있고 나머지 자리는 t 가 아닌(0도 아닌) 숫자이다.
  const withDigit = (d, t, p) => toNum([2, 1, 0].map((k) => (k === p ? t : d.until(() => d.int(1, 9), (v) => v !== t))));
  // 수 모형으로 그릴 수: 백 모형 2~4개(휴대폰에서도 낱개가 보이게), 세 숫자가 서로 다르다.
  const modelDigits = (d) => d.until(() => [d.int(2, 4), d.int(1, 9), d.int(1, 9)], (v) => new Set(v).size === 3);
  const quote = (text) => lines([text]);
  const tail = (word, pair) => josa(word, pair).slice(String(word).length);   // 낱말 뒤에 붙는 토씨만
  const said = (n) => '「' + say(n) + '」' + tail(say(n), '이라고/라고');
  const truthOf = (rows, want) => ({ truth: rows.map((row) => row[1]), want });
  const conds = (list) => '<ul class="mb-conditions">' + list.map((line) => '<li>' + line + '</li>').join('') + '</ul>';

  // ── 그림 ─────────────────────────────────────────────────────
  // 수 모형(엔진의 blocks 와 같은 생김새). 십 모형·일 모형이 10개를 넘어도 그린다: 십 모형은 다섯 개씩 끊어 한 줄에 10개, 일 모형은 다섯 개씩 세로로.
  function model(h, t, o, label) {
    const parts = []; let x = 4;
    for (let i = 0; i < h; i += 1) {
      let grid = '';
      for (let k = 1; k < 10; k += 1) grid += `<path d="M${(x + k * 3.4).toFixed(1)} 6v34M${x} ${(6 + k * 3.4).toFixed(1)}h34"/>`;
      parts.push(`<g class="mb-flat"><rect x="${x}" y="6" width="34" height="34" rx="1.5"/>${grid}</g>`); x += 38;
    }
    x += h ? 6 : 0;
    let wide = 0;
    for (let i = 0; i < t; i += 1) {
      const c = i % 10, px = x + c * 8 + Math.floor(c / 5) * 5, py = 6 + Math.floor(i / 10) * 40;
      let ticks = '';
      for (let k = 1; k < 10; k += 1) ticks += `<path d="M${px} ${(py + k * 3.4).toFixed(1)}h5"/>`;
      parts.push(`<g class="mb-rod"><rect x="${px}" y="${py}" width="5" height="34" rx="1"/>${ticks}</g>`);
      wide = Math.max(wide, px + 8 - x);
    }
    x += t ? wide + 6 : 0;
    for (let i = 0; i < o; i += 1) {
      const col = Math.floor(i / 5), px = x + col * 8 + Math.floor(col / 2) * 4, py = 6 + (i % 5) * 7;
      parts.push(`<rect class="mb-one" x="${px}" y="${py}" width="5.4" height="5.4" rx="1"/>`);
    }
    const cols = Math.ceil(o / 5); x += o ? cols * 8 + Math.floor((cols - 1) / 2) * 4 : 0;
    const width = Math.max(x + 4, 60), height = 46 + (t > 10 ? 40 : 0);
    const told = '수 모형: ' + [[h, '백'], [t, '십'], [o, '일']].filter(([n]) => n).map(([n, kind]) => `${kind} 모형 ${n}개`).join(', ');
    return `<figure class="mb-blocks">${label ? `<figcaption>${label}</figcaption>` : ''}<svg viewBox="0 0 ${width} ${height}" width="${Math.round(width * 2.1)}" role="img" aria-label="${told}">${parts.join('')}</svg></figure>`;
  }
  // 동전: 값이 적힌 동그라미. 값마다 줄을 바꾸고 다섯 개씩 끊어 한 줄에 10개까지 놓는다. list: [[값, 개수], …]
  const COIN = { 100: ['#e5e7eb', '#4b5563'], 10: ['#f6d2a8', '#9a5b13'], 1: ['#fdf0c2', '#946c00'] };
  function coins(list) {
    const kinds = list.filter(([, n]) => n > 0), rows = [];
    for (const [value, n] of kinds) for (let s = 0; s < n; s += 10) rows.push([value, Math.min(10, n - s)]);
    const cols = Math.max.apply(null, rows.map((row) => row[1])), width = Math.max(8 + cols * 23 + (cols > 5 ? 6 : 0), 60), height = 6 + rows.length * 25;
    let out = '';
    rows.forEach(([value, n], r) => {
      for (let i = 0; i < n; i += 1) {
        const cx = 15.5 + i * 23 + (i >= 5 ? 6 : 0), cy = 15.5 + r * 25;
        out += `<circle cx="${cx}" cy="${cy}" r="10.5" style="fill:${COIN[value][0]};stroke:${COIN[value][1]};stroke-width:1.2"/><text x="${cx}" y="${cy + 3}" text-anchor="middle" style="font-size:${value === 100 ? 8 : 9}px;font-weight:700;fill:#1f2933">${value}</text>`;
      }
    });
    return `<svg class="mb-counters" viewBox="0 0 ${width} ${height}" width="${Math.round(width * 1.25)}" role="img" aria-label="동전: ${kinds.map(([value, n]) => `${value}원짜리 ${n}개`).join(', ')}">${out}</svg>`;
  }
  // 10장씩 묶은 색종이. groups: [[빛깔 이름, 묶음 수, 칠, 테두리], …] 다섯 묶음씩 한 줄.
  function bundles(groups) {
    const all = []; groups.forEach((g) => { for (let i = 0; i < g[1]; i += 1) all.push(g); });
    const per = 5, rows = Math.ceil(all.length / per), width = 8 + per * 27, height = 8 + rows * 31;
    let out = '';
    all.forEach((g, i) => {
      const x = 5 + (i % per) * 27, y = 5 + Math.floor(i / per) * 31;
      out += `<rect x="${x + 2}" y="${y}" width="21" height="26" rx="2" style="fill:${g[2]};stroke:${g[3]};stroke-width:1"/><rect x="${x}" y="${y + 9}" width="25" height="9" rx="1.5" style="fill:#fff;stroke:${g[3]};stroke-width:1"/><text x="${x + 12.5}" y="${y + 16.3}" text-anchor="middle" style="font-size:7.5px;font-weight:700;fill:#1f2933">10</text>`;
    });
    return `<svg class="mb-counters" viewBox="0 0 ${width} ${height}" width="${Math.round(width * 1.7)}" role="img" aria-label="10장씩 묶음: ${groups.map((g) => `${g[0]} ${g[1]}묶음`).join(', ')}">${out}</svg>`;
  }
  // 수직선: 눈금마다 수를 적거나(수), 빈칸 이름(㉠)을 네모 안에 적는다.
  function hline(list) {
    const n = list.length, u = Math.min(34, 280 / (n - 1)), x = (i) => 18 + i * u, y = 14, width = Math.round(36 + (n - 1) * u);
    let out = `<line class="mb-axis" x1="${x(0) - 8}" y1="${y}" x2="${x(n - 1) + 8}" y2="${y}"/>`;
    list.forEach((v, i) => {
      out += `<line class="mb-axis" x1="${x(i)}" y1="${y - 5}" x2="${x(i)}" y2="${y + 5}"/>`;
      if (typeof v === 'number') out += `<text class="mb-axis-label" style="font-size:11px" x="${x(i)}" y="${y + 20}" text-anchor="middle">${v}</text>`;
      else out += `<rect x="${x(i) - 11}" y="${y + 8}" width="22" height="17" rx="3" style="fill:#fff;stroke:#1f2933;stroke-width:1.4"/><text x="${x(i)}" y="${y + 21}" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#1f2933">${v}</text>`;
    });
    return `<svg class="mb-numberline" viewBox="0 0 ${width} 44" width="${width}" role="img" aria-label="수직선: 눈금에 적힌 것은 왼쪽부터 ${list.join(', ')}">${out}</svg>`;
  }
  // 뛰어 세기 띠: 칸마다 수를 적고 칸 사이를 화살표로 잇는다. 수가 아닌 칸은 빈칸이다(이름 '㉠', 이름 없는 빈칸은 '').
  function hops(list) {
    const n = list.length, W = Math.min(58, Math.floor(300 / n)), w = W - 8, width = n * W, y = 24;
    let out = '';
    list.forEach((v, i) => {
      const x = 4 + i * W, mid = x + w / 2, blank = typeof v !== 'number';
      out += `<rect x="${x}" y="${y}" width="${w}" height="26" rx="5" style="fill:${blank ? '#fff' : '#f2f5f8'};stroke:#1f2933;stroke-width:${blank ? 1.8 : 1}"/>`;
      if (v !== '') out += `<text x="${mid}" y="${y + 18}" text-anchor="middle" style="font-size:14px;font-weight:600;fill:#1f2933">${v}</text>`;
      if (i < n - 1) out += `<path class="mb-jump" d="M${mid} ${y - 3}Q${mid + W / 2} ${y - 21} ${mid + W - 3} ${y - 5}"/><path d="M${mid + W - 2} ${y - 3}l-6.4 -1.6l3.4 -4z" style="fill:#1d4ed8"/>`;
    });
    return `<svg class="mb-numberline" viewBox="0 0 ${width} 54" width="${width}" role="img" aria-label="뛰어 세기: ${list.map((v) => (v === '' ? '□' : v)).join(', ')}">${out}</svg>`;
  }
  // 한 숫자에 밑줄을 친 수(k: 0 일의 자리, 1 십의 자리, 2 백의 자리)
  const under = (n, k) => { const s = String(n), i = s.length - 1 - k; return s.slice(0, i) + '<u style="text-decoration-thickness:2px;text-underline-offset:4px">' + s[i] + '</u>' + s.slice(i + 1); };
  // 숫자 아래에 이름을 단 수: marks 는 백·십·일의 자리 차례(없으면 '')
  const marked = (n, marks) => `<div style="display:inline-grid;grid-template-columns:repeat(3,1.9em);justify-items:center;row-gap:2px;font-size:1.5rem;font-weight:600;font-variant-numeric:tabular-nums">${String(n).split('').map((ch) => `<span>${ch}</span>`).join('')}${marks.map((m) => `<span style="font-size:1rem;font-weight:700;color:#1d4ed8">${m}</span>`).join('')}</div>`;

  B.addUnit({
    id: '2-1-1', grade: 2, semester: 1, no: 1, title: '세 자리 수', version: 1,
    groups: [
      {
        id: 'hundred', title: '백', standard: NUM,
        types: [
          T('hd-write-read', '90보다 10만큼 더 큰 수 쓰고 읽기', '①1·2 심1', (d) => {
            // 틀린 보기: 읽는 말을 헷갈린 것, 0을 하나 더 쓴 것, 1만큼 더 큰 수로 읽은 것
            const rows = d.shuffle([[100, '백', 100], [100, '천', 1000], [1000, '백', 100], [91, '백', 100]]).map(([written, word, read]) => [`${written}, ${word}`, written === 90 + 10 && read === 90 + 10]);
            return C('90보다 10만큼 더 큰 수를 바르게 쓰고 읽은 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), { explain: '90보다 10만큼 더 큰 수는 100이라 쓰고, 백이라고 읽는다.', facts: truthOf(rows, true) });
          }),
          T('hd-next', '99보다 1만큼 더 큰 수', '①1 심1', () => N('99보다 1만큼 더 큰 수는?', 100, { explain: '99 다음의 수는 100이다.', facts: { calc: [['99+1', 0]], rule: 'next-hundred' } })),
          T('hd-gap', '100은 어떤 수보다 얼마만큼 더 큰 수', '①1·3 심2', (d) => {
            const a = d.int(91, 98), b = d.int(2, 8) * 10;
            return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: 100 - a }, { label: LABELS[1], answer: 100 - b }], {
              figure: lines([`100은 ${a}보다 ${box(LABELS[0])}만큼 더 큰 수이다.`, `100은 ${b}보다 ${box(LABELS[1])}만큼 더 큰 수이다.`]),
              explain: `${a}에서 1씩 ${100 - a}번 세면 100이다. ${b}에서 10씩 ${(100 - b) / 10}번 세면 100이다.`, facts: { calc: [[`100-${a}`, 0], [`100-${b}`, 1]] }
            });
          }),
          T('hd-tens-count', '100은 10이 몇 개인 수', '①4 심1', () => N('100은 10이 몇 개인 수인가?', 10, { unit: '개', explain: '10이 10개이면 100이다.', facts: { calc: [['100/10', 0]], rule: 'tens-in-hundred' } })),
          T('hd-ten-rods', '십 모형 10개', '①4 심1', () => M('수 모형을 보고 ㉠, ㉡에 알맞은 수를 구하시오.', [{ label: LABELS[0], answer: 10 }, { label: LABELS[1], answer: 100 }], {
            figure: model(0, 10, 0) + quote(`십 모형이 ${box(LABELS[0])}개이면 ${box(LABELS[1])}이다.`), explain: '십 모형은 10개이다. 10이 10개이면 100이다. 십 모형 10개는 백 모형 1개와 같다.', facts: { calc: [['10', 0], ['10*10', 1]] }
          })),
          T('hd-nine-ten', '십 모형 9개와 일 모형 10개', '①4', () => N('수 모형이 나타내는 수는?', 100, {
            figure: model(0, 9, 10), explain: '일 모형 10개는 십 모형 1개와 같다. 십 모형이 모두 10개이므로 100이다.', facts: { calc: [['10*9+1*10', 0]], unseen: [1], rule: 'nine-ten' }
          })),
          T('hd-seq', '100까지 차례로 세기', '①4 심1', (d, turn) => (turn === 0
            ? N('10씩 커지는 수를 차례로 썼다. □ 안에 알맞은 수는?', 100, { figure: numbers([60, 70, 80, 90, box()]), explain: '90보다 10만큼 더 큰 수는 100이다.', facts: { calc: [['90+10', 0]] } })
            : M('1씩 커지는 수를 차례로 썼다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: 99 }, { label: LABELS[1], answer: 100 }], { figure: numbers([96, 97, 98, box(LABELS[0]), box(LABELS[1])]), explain: '98 다음의 수는 99, 99 다음의 수는 100이다.', facts: { calc: [['98+1', 0], ['98+1+1', 1]] } })), { count: 2 }),
          T('hd-bundles', '10장씩 묶음 세기', '①2·6', (d) => {
            const a = d.int(3, 7), b = 10 - a;
            return N('색종이를 10장씩 묶어 놓았다. 색종이는 모두 몇 장인가?', 100, {
              unit: '장', figure: bundles([['빨간색', a, '#fecaca', '#b91c1c'], ['파란색', b, '#bfdbfe', '#1d4ed8']]), explain: `빨간색 ${a}묶음과 파란색 ${b}묶음으로 묶음은 모두 10개이다. 10이 10개이면 100이다.`, facts: { calc: [[`10*${a}+10*${b}`, 0]] }
            });
          }),
          T('hd-say', '수 모형이 나타내는 수의 설명', '①5', (d) => {
            const slip = d.pick([['80보다 10만큼 더 큰 수이다.', '80+10', '80보다 10만큼 더 큰 수는 90이다.'], ['10이 9개인 수이다.', '10*9', '10이 9개인 수는 90이다.'], ['90보다 1만큼 더 큰 수이다.', '90+1', '90보다 1만큼 더 큰 수는 91이다.']]);
            const rows = d.shuffle([['90보다 10만큼 더 큰 수이다.', '90+10'], ['10이 10개인 수이다.', '10*10'], ['99보다 1만큼 더 큰 수이다.', '99+1'], slip]);
            return C('수 모형이 나타내는 수를 잘못 설명한 것은?', rows.map((row) => row[0]), rows.indexOf(slip), { figure: blocks(100), explain: `수 모형이 나타내는 수는 100이다. ${slip[2]}`, facts: { big: { odd: rows.map((row) => row[1]) } } });
          }),
          T('hd-need-days', '100일이 되려면', '①7', (d) => {
            const a = d.int(91, 97);
            return N(`강아지가 태어난 지 ${a}일이 되었다. 며칠이 더 지나면 100일이 되는가?`, 100 - a, { unit: '일', explain: `${a}보다 ${100 - a}만큼 더 큰 수가 100이다.`, facts: { calc: [[`100-${a}`, 0]] } });
          }),
          T('hd-need-bags', '100개가 되려면 몇 봉지 더', '①7 심4', (d) => {
            const a = d.int(3, 8);
            return N(`사탕이 한 봉지에 10개씩 ${a}봉지 있다. 사탕이 100개가 되려면 몇 봉지가 더 있어야 하는가?`, 10 - a, { unit: '봉지', explain: `10개씩 10봉지이면 100개이다. ${a}봉지가 있으므로 ${10 - a}봉지가 더 있어야 한다.`, facts: { calc: [[`100/10-${a}`, 0]] } });
          }),
          T('hd-ten-rows', '10개씩 10묶음', '①8', () => N('달걀이 한 줄에 10개씩 놓여 있다. 10줄에 놓인 달걀은 모두 몇 개인가?', 100, { unit: '개', explain: '10이 10개이면 100이다.', facts: { calc: [['10*10', 0]] } }))
        ]
      },
      {
        id: 'hundreds', title: '몇백', standard: NUM,
        types: [
          T('hs-flats', '백 모형과 몇백', '①9 심5', (d) => {
            const k = d.int(2, 8);
            return M('수 모형을 보고 ㉠, ㉡에 알맞은 수를 구하시오.', [{ label: LABELS[0], answer: k }, { label: LABELS[1], answer: k * 100 }], {
              figure: blocks(k * 100) + quote(`100이 ${box(LABELS[0])}개이면 ${box(LABELS[1])}이다.`), explain: `백 모형이 ${k}개이다. 100이 ${k}개이면 ${k * 100}이다.`, facts: { calc: [[String(k), 0], [`100*${k}`, 1]] }
            });
          }),
          T('hs-count', '몇백은 100이 몇 개인 수', '①11·19 심8', (d) => {
            const k = d.int(2, 9);
            return N(`${josa(k * 100, '은/는')} 100이 몇 개인 수인가?`, k, { unit: '개', explain: `100이 ${k}개이면 ${k * 100}이다.`, facts: { calc: [[`${k * 100}/100`, 0]], rule: 'hundreds-in' } });
          }),
          T('hs-count-read', '100이 몇 개인 수 읽기', '①9·12 심5', (d) => {
            // 틀린 보기: 몇십으로 읽은 것, 백몇으로 읽은 것, 백몇십으로 읽은 것
            const k = d.int(2, 9), list = d.shuffle([k * 100, k * 10, 100 + k, 100 + k * 10]);
            return C(`100이 ${k}개인 수를 바르게 읽은 것은?`, list.map(say), list.indexOf(k * 100), { explain: `100이 ${k}개이면 ${k * 100}이다. ${josa(k * 100, '은/는')} ${said(k * 100)} 읽는다.`, facts: { pick: { expr: `100*${k}`, options: list } } });
          }),
          T('hs-misread', '몇백을 잘못 읽은 것', '①12·13', (d) => {
            const ks = pickDigits(d, 4, [2, 3, 4, 5, 6, 7, 8, 9]), bad = d.int(0, 3), spare = d.until(() => d.int(2, 9), (v) => !ks.includes(v));
            const rows = ks.map((k, i) => [k * 100, i === bad ? d.pick([k * 10, spare * 100]) : k * 100]);
            return C('수를 잘못 읽은 것은?', rows.map(([n, read]) => `${n} — ${say(read)}`), bad, { explain: `${josa(rows[bad][0], '은/는')} ${said(rows[bad][0])} 읽는다.`, facts: { claimed: rows.map(([n, read]) => [String(n), read]), claimedWant: false } });
          }),
          T('hs-write', '읽은 몇백을 수로 쓰기', '①14', (d) => {
            const k = d.int(2, 9), word = say(k * 100);
            return N('다음을 수로 쓰면?', k * 100, { figure: quote(word), explain: `${word}${tail(word, '은/는')} 100이 ${k}개인 수이다. 수로 쓰면 ${k * 100}이다.`, facts: { rule: 'write-hundreds', big: { shown: [[word, k * 100]], written: [[word, 0]] } } });
          }),
          T('hs-flats-rods', '백 모형과 십 모형 10개', '①10', (d) => {
            const k = d.int(2, 4);
            return N('수 모형이 나타내는 수는?', (k + 1) * 100, { figure: model(k, 10, 0), explain: `십 모형 10개는 백 모형 1개와 같다. 백 모형이 모두 ${k + 1}개이므로 ${(k + 1) * 100}이다.`, facts: { calc: [[`100*${k}+10*10`, 0]], unseen: [100], rule: 'flats-rods' } });
          }),
          T('hs-coins', '100원짜리 동전', '①15', (d) => {
            const k = d.int(3, 9);
            return N('동전은 모두 얼마인가?', k * 100, { unit: '원', figure: coins([[100, k]]), explain: `100원짜리 동전이 ${k}개이다. 100이 ${k}개이면 ${k * 100}이다.`, facts: { calc: [[`100*${k}`, 0]], rule: 'coins-hundred' } });
          }),
          T('hs-line', '100씩 커지는 수직선', '①16', (d) => {
            const i = d.int(1, 3), j = d.int(5, 7), list = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((k, at) => (at === i ? LABELS[0] : at === j ? LABELS[1] : k * 100));
            return M('수직선에서 ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: (i + 1) * 100 }, { label: LABELS[1], answer: (j + 1) * 100 }], {
              figure: hline(list), explain: `눈금 한 칸은 100을 나타낸다. ㉠은 ${i * 100}보다 100만큼 더 큰 ${(i + 1) * 100}, ㉡은 ${j * 100}보다 100만큼 더 큰 ${(j + 1) * 100}이다.`, facts: { calc: [[`${i * 100}+100`, 0], [`${j * 100}+100`, 1]] }
            });
          }),
          T('hs-near', '가장 가까운 몇백', '①17 심7', (d) => {
            // 한쪽에만 100 떨어진 수를 둔다(양쪽에 다 있으면 답이 둘이 된다)
            const t = d.int(3, 7) * 100, side = d.pick([-100, 100]), near = t + side;
            const far = d.shuffle([100, 200, 300, 400, 500, 600, 700, 800, 900].filter((v) => v !== t && Math.abs(v - t) > 100)).slice(0, 3), list = d.shuffle([near].concat(far));
            return C(`${t}에 가장 가까운 수는?`, list.map(String), list.indexOf(near), { explain: `100씩 세면 ${josa(near, '은/는')} ${t}에서 1번, 나머지 수는 2번 넘게 세어야 닿는다.`, facts: { choose: { exprs: list.map(String), rule: 'nearest', target: t } } });
          }),
          T('hs-range', '수 모형이 나타내는 수의 범위', '①18', (d) => {
            const h = d.int(2, 4), n = h * 100 + d.int(2, 8) * 10, lo = h * 100, hi = lo + 100;
            const rows = d.shuffle([[`${lo}보다 크고 ${hi}보다 작다.`, lo, hi], [`${hi}보다 크다.`, hi, 9999], [`${lo}보다 작다.`, 0, lo], [`${hi}보다 크고 ${hi + 100}보다 작다.`, hi, hi + 100]]).map(([text, low, high]) => [text, n > low && n < high]);
            return C('수 모형이 나타내는 수를 바르게 설명한 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), { figure: blocks(n), explain: `수 모형이 나타내는 수는 ${n}이다. ${josa(n, '은/는')} ${lo}보다 크고 ${hi}보다 작다.`, facts: truthOf(rows, true) });
          }),
          T('hs-word', '100개씩 몇 묶음', '①20 심5', (d) => {
            const k = d.int(3, 9);
            return N(`책꽂이 한 개에 책이 100권씩 꽂혀 있다. 책꽂이 ${k}개에 꽂혀 있는 책은 모두 몇 권인가?`, k * 100, { unit: '권', explain: `100이 ${k}개이면 ${k * 100}이다.`, facts: { calc: [[`100*${k}`, 0]] } });
          }),
          T('hs-ten-boxes', '10개씩 몇십 상자', '①21', (d) => {
            const k = d.int(2, 5) * 10;
            return N(`구슬이 한 상자에 10개씩 들어 있다. ${k}상자에 들어 있는 구슬은 모두 몇 개인가?`, k * 10, { unit: '개', explain: `10개씩 10상자이면 100개이다. ${k}상자는 10상자씩 ${k / 10}번이므로 100이 ${k / 10}개인 ${k * 10}개이다.`, facts: { calc: [[`10*${k}`, 0]] } });
          })
        ]
      },
      {
        id: 'three', title: '세 자리 수 읽고 쓰기', standard: NUM,
        types: [
          T('th-blocks', '수 모형이 나타내는 세 자리 수', '①23 심9', (d) => {
            const [h, t, o] = modelDigits(d), n = toNum([h, t, o]);
            return M('수 모형을 보고 ㉠, ㉡, ㉢, ㉣에 알맞은 수를 구하시오.', [h, t, o, n].map((answer, i) => ({ label: LABELS[i], answer })), {
              figure: blocks(n) + quote(`100이 ${box(LABELS[0])}개, 10이 ${box(LABELS[1])}개, 1이 ${box(LABELS[2])}개이면 ${box(LABELS[3])}이다.`),
              explain: `백 모형 ${h}개, 십 모형 ${t}개, 일 모형 ${o}개이다. 100이 ${h}개, 10이 ${t}개, 1이 ${o}개이면 ${n}이다.`, facts: { calc: [[String(h), 0], [String(t), 1], [String(o), 2], [`100*${h}+10*${t}+1*${o}`, 3]] }
            });
          }),
          T('th-blocks-zero', '빈 자리가 있는 수 모형', '①23·30', (d) => {
            const h = d.int(2, 4), v = d.int(2, 9), noTens = d.bool(), n = h * 100 + (noTens ? v : v * 10);
            return N('수 모형이 나타내는 수는?', n, {
              figure: blocks(n), explain: noTens ? `백 모형 ${h}개, 일 모형 ${v}개이다. 100이 ${h}개, 10이 0개, 1이 ${v}개이면 ${n}이다.` : `백 모형 ${h}개, 십 모형 ${v}개이다. 100이 ${h}개, 10이 ${v}개, 1이 0개이면 ${n}이다.`,
              facts: { calc: [[noTens ? `100*${h}+1*${v}` : `100*${h}+10*${v}`, 0]], unseen: [100, 10, 1], rule: 'zero-place' }
            });
          }),
          T('th-compose', '100이 몇 개, 10이 몇 개, 1이 몇 개인 수', '①24 심9', (d) => {
            const [a, b, c] = pickDigits(d, 3), n = toNum([a, b, c]);
            return N(`100이 ${a}개, 10이 ${b}개, 1이 ${c}개인 수는?`, n, { explain: `100이 ${a}개이면 ${a * 100}, 10이 ${b}개이면 ${b * 10}, 1이 ${c}개이면 ${c}이다. ${n}이다.`, facts: { calc: [[`100*${a}+10*${b}+1*${c}`, 0]], rule: 'compose' } });
          }),
          T('th-compose-read', '수로 쓰고 읽기', '①23·24', (d) => {
            // 틀린 보기: 바르게 쓰고 십과 일을 바꾸어 읽은 것, 십과 일을 바꾸어 쓴 것, 백과 일을 바꾸어 쓴 것
            const [a, b, c] = pickDigits(d, 3, [2, 3, 4, 5, 6, 7, 8, 9]), n = toNum([a, b, c]), swap = toNum([a, c, b]), back = toNum([c, b, a]), whole = `100*${a}+10*${b}+1*${c}`;
            const rows = d.shuffle([[n, n], [n, swap], [swap, swap], [back, back]]);
            return C(`100이 ${a}개, 10이 ${b}개, 1이 ${c}개인 수를 바르게 쓰고 읽은 것은?`, rows.map(([written, read]) => `${written}, ${say(read)}`), rows.findIndex(([written, read]) => written === n && read === n), {
              explain: `수로 쓰면 ${n}이고, ${said(n)} 읽는다.`, facts: { claimed: rows.map(([written, read]) => [`(${whole})*1000+(${whole})`, written * 1000 + read]), claimedWant: true }
            });
          }),
          T('th-decompose', '수를 100, 10, 1이 몇 개인지로 나타내기', '①25 심9', (d) => {
            const ds = pickDigits(d, 3), n = toNum(ds);
            return M('㉠, ㉡, ㉢에 알맞은 수는?', ds.map((answer, i) => ({ label: LABELS[i], answer })), {
              figure: quote(`${josa(n, '은/는')} 100이 ${box(LABELS[0])}개, 10이 ${box(LABELS[1])}개, 1이 ${box(LABELS[2])}개인 수이다.`), explain: `${josa(n, '은/는')} 100이 ${ds[0]}개, 10이 ${ds[1]}개, 1이 ${ds[2]}개인 수이다.`,
              facts: { calc: [[dx(n, 2), 0], [dx(n, 1), 1], [dx(n, 0), 2]] }
            });
          }),
          T('th-read', '세 자리 수 읽기', '①26·28', (d) => {
            const [a, b, c] = pickDigits(d, 3, [2, 3, 4, 5, 6, 7, 8, 9]), n = toNum([a, b, c]), list = d.shuffle([n, toNum([a, c, b]), toNum([b, a, c]), toNum([c, b, a])]);
            return C(`${josa(n, '을/를')} 바르게 읽은 것은?`, list.map(say), list.indexOf(n), { explain: `${josa(n, '은/는')} 100이 ${a}개, 10이 ${b}개, 1이 ${c}개인 수이다. ${said(n)} 읽는다.`, facts: { rule: 'read-plain', big: { names: { value: n, given: String(n) } } } });
          }),
          T('th-read-special', '0이나 1이 있는 수 읽기', '①24·26 심10', (d, turn) => {
            const a = d.int(2, 9), c = d.until(() => d.int(2, 9), (v) => v !== a);
            let n, others, why;
            if (turn === 0) { n = a * 100 + c; others = [a * 100 + c * 10, a * 10 + c, a * 100 + 10 + c]; why = `${josa(n, '은/는')} 100이 ${a}개, 10이 0개, 1이 ${c}개인 수이다. 10이 없으면 그 자리는 읽지 않는다.`; }
            else if (d.bool()) { n = 100 + a * 10 + c; others = [a * 100 + 10 + c, 100 + c * 10 + a, 100 + a * 10]; why = '100이 1개이면 「백」이라고만 읽는다.'; }
            else { n = a * 100 + 10 + c; others = [a * 100 + c * 10 + 1, a * 100 + c, a * 100 + c * 10]; why = '10이 1개이면 「십」이라고만 읽는다.'; }
            const list = d.shuffle([n].concat(others));
            return C(`${josa(n, '을/를')} 바르게 읽은 것은?`, list.map(say), list.indexOf(n), { explain: `${why} ${josa(n, '은/는')} ${said(n)} 읽는다.`, facts: { rule: turn === 0 ? 'read-zero' : 'read-one', big: { names: { value: n, given: String(n) } } } });
          }, { count: 2 }),
          T('th-write', '읽은 수를 수로 쓰기', '①27 심10', (d) => {
            const n = toNum(pickDigits(d, 3)), word = say(n);
            return N('다음을 수로 쓰면?', n, { figure: quote(word), explain: `${word}${tail(word, '을/를')} 수로 쓰면 ${n}이다.`, facts: { rule: 'write-three', big: { shown: [[word, n]], written: [[word, 0]] } } });
          }),
          T('th-write-zero', '읽지 않은 자리가 있는 수 쓰기', '①27 심10', (d) => {
            // 틀린 보기: 0을 다른 자리에 쓴 것, 0을 쓰지 않은 것, 읽은 숫자를 한 번 더 쓴 것
            const a = d.int(2, 9), c = d.until(() => d.int(1, 9), (v) => v !== a), noTens = d.bool(), n = a * 100 + (noTens ? c : c * 10), word = say(n), list = d.shuffle([a * 100 + c, a * 100 + c * 10, a * 10 + c, a * 100 + c * 10 + c]);
            return C('다음을 수로 바르게 쓴 것은?', list.map(String), list.indexOf(n), {
              figure: quote(word), explain: noTens ? `${word}${tail(word, '은/는')} 100이 ${a}개, 1이 ${c}개인 수이다. 10이 없는 자리에는 0을 쓴다. ${n}이다.` : `${word}${tail(word, '은/는')} 100이 ${a}개, 10이 ${c}개인 수이다. 1이 없는 자리에는 0을 쓴다. ${n}이다.`,
              facts: { big: { names: { value: n, given: word } } }
            });
          }),
          T('th-odd', '나타내는 수가 다른 하나', '①29', (d) => {
            // 백과 십의 숫자를 바꾼 수를 하나 섞는다. 숫자만 훑어보면 같아 보인다.
            const [a, b, c] = pickDigits(d, 3), n = toNum([a, b, c]), m = toNum([b, a, c]), at = d.int(0, 2), vals = [0, 1, 2].map((i) => (i === at ? m : n));
            const parts = (v) => [digitAt(v, 2), digitAt(v, 1), digitAt(v, 0)];
            const shown = [String(vals[0]), `100이 ${parts(vals[1])[0]}개, 10이 ${parts(vals[1])[1]}개, 1이 ${parts(vals[1])[2]}개인 수`, say(vals[2])];
            return C('나타내는 수가 나머지 둘과 다른 하나는?', LABELS.slice(0, 3), at, {
              figure: tagged(shown), explain: `수로 쓰면 차례로 ${vals.join(', ')}이다.`, facts: { big: { odd: [String(vals[0]), `100*${parts(vals[1])[0]}+10*${parts(vals[1])[1]}+1*${parts(vals[1])[2]}`, String(vals[2])], shown: [[shown[2], vals[2]]] } }
            });
          }),
          T('th-compose-gap', '빈 자리가 있는 수', '①30', (d) => {
            // 틀린 보기: 앞에서부터 채운 것, 숫자만 이어 쓴 것, 가운데에 1을 쓴 것
            const a = d.int(2, 9), c = d.until(() => d.int(2, 9), (v) => v !== a), n = a * 100 + c, list = d.shuffle([n, a * 100 + c * 10, a * 10 + c, a * 100 + 10 + c]);
            return C(`100이 ${a}개, 1이 ${c}개인 수는?`, list.map(String), list.indexOf(n), { explain: `10이 0개이므로 가운데에 0을 쓴다. ${n}이다.`, facts: { pick: { expr: `100*${a}+1*${c}`, options: list } } });
          }),
          T('th-ten-tens', '10이 10개인 묶음이 낀 수', '①31', (d) => {
            const a = d.int(2, 8), c = d.int(1, 9), n = (a + 1) * 100 + c;
            return N(`100이 ${a}개, 10이 10개, 1이 ${c}개인 수는?`, n, { explain: `10이 10개이면 100이다. 100이 모두 ${a + 1}개, 10이 0개, 1이 ${c}개이므로 ${n}이다.`, facts: { calc: [[`100*${a}+10*10+1*${c}`, 0]], rule: 'ten-tens' } });
          }),
          T('th-tens-over', '10이 십몇 개인 수', '①31 심6', (d) => {
            const k = d.int(11, 19);
            return N(`10이 ${k}개인 수는?`, k * 10, { explain: `10이 10개이면 100, 10이 ${k - 10}개이면 ${(k - 10) * 10}이다. ${k * 10}이다.`, facts: { calc: [[`10*${k}`, 0]] } });
          }),
          T('th-coins', '동전은 모두 얼마', '①32', (d) => {
            const [a, b, c] = d.until(() => [d.int(2, 5), d.int(1, 9), d.int(1, 9)], (v) => new Set(v).size === 3), n = toNum([a, b, c]);
            return N('동전은 모두 얼마인가?', n, { unit: '원', figure: coins([[100, a], [10, b], [1, c]]), explain: `100원짜리 ${a}개는 ${a * 100}원, 10원짜리 ${b}개는 ${b * 10}원, 1원짜리 ${c}개는 ${c}원이다. 모두 ${n}원이다.`, facts: { calc: [[`100*${a}+10*${b}+1*${c}`, 0]], rule: 'coins-three' } });
          }),
          T('th-word', '100개씩, 10개씩 묶은 양', '①32·34 심12', (d) => {
            const a = d.int(2, 9), b = d.int(1, 9), n = a * 100 + b * 10;
            return N(`귤이 100개씩 ${a}상자, 10개씩 ${b}봉지 있다. 귤은 모두 몇 개인가?`, n, { unit: '개', explain: `100이 ${a}개, 10이 ${b}개, 1이 0개인 수이다. ${n}이다.`, facts: { calc: [[`100*${a}+10*${b}`, 0]] } });
          }),
          T('th-word-more', '묶음을 더 받았을 때의 양', '①34', (d) => {
            const a = d.int(2, 8), b = d.int(1, 5), c = d.int(1, 9), e = d.int(2, 9 - b), n = a * 100 + (b + e) * 10 + c;
            return N(`고구마가 100개씩 ${a}상자, 10개씩 ${b}묶음, 낱개 ${c}개 있다. 10개씩 ${e}묶음을 더 받으면 고구마는 모두 몇 개인가?`, n, { unit: '개', explain: `10개씩 묶음은 모두 ${b + e}묶음이 된다. 100이 ${a}개, 10이 ${b + e}개, 1이 ${c}개이면 ${n}이다.`, facts: { calc: [[`100*${a}+10*${b}+${c}+10*${e}`, 0]] } });
          }),
          T('th-symbols', '약속한 모양으로 나타낸 수', '①35 심14', (d) => {
            // 틀린 보기: ○를 하나 덜 그린 것, △를 하나 더 그린 것, ★과 △의 수를 바꾼 것
            const [a, b] = d.shuffle([2, 3, 4]).slice(0, 2), c = d.int(3, 6), n = toNum([a, b, c]);
            const draw = ([h, t, o]) => ['★'.repeat(h), '△'.repeat(t), '○'.repeat(o)].join(' ');
            const read = (text) => (text.split('★').length - 1) * 100 + (text.split('△').length - 1) * 10 + (text.split('○').length - 1);
            const options = d.shuffle([[a, b, c], [a, b, c - 1], [a, b + 1, c], [b, a, c]]).map(draw);
            return C(`100을 ★, 10을 △, 1을 ○로 나타내기로 하였다. ${josa(n, '을/를')} 바르게 나타낸 것은?`, options, options.indexOf(draw([a, b, c])), {
              explain: `${josa(n, '은/는')} 100이 ${a}개, 10이 ${b}개, 1이 ${c}개인 수이다. ★ ${a}개, △ ${b}개, ○ ${c}개로 나타낸다.`, facts: { pick: { expr: String(n), options: options.map(read) } }
            });
          })
        ]
      },
      {
        id: 'place', title: '각 자리의 숫자가 나타내는 값', standard: NUM,
        types: [
          T('pl-expand', '수를 각 자리의 값의 합으로 쓰기', '①37·38 심18', (d) => {
            const ex = toNum(pickDigits(d, 3)), n = d.until(() => toNum(pickDigits(d, 3)), (v) => v !== ex), parts = (v) => [digitAt(v, 2) * 100, digitAt(v, 1) * 10, digitAt(v, 0)];
            return M('보기와 같이 나타낼 때, ㉠, ㉡, ㉢에 알맞은 수는?', parts(n).map((answer, i) => ({ label: LABELS[i], answer })), {
              figure: lines([`<span class="mb-tag">보기</span>${ex} = ${parts(ex).join(' + ')}`, `<span class="mb-tag"></span>${n} = ${[0, 1, 2].map((i) => box(LABELS[i])).join(' + ')}`]),
              explain: `100이 ${digitAt(n, 2)}개이면 ${parts(n)[0]}, 10이 ${digitAt(n, 1)}개이면 ${parts(n)[1]}, 1이 ${digitAt(n, 0)}개이면 ${parts(n)[2]}이다. ${n} = ${parts(n).join(' + ')}`,
              facts: { calc: [[vx(n, 2), 0], [vx(n, 1), 1], [vx(n, 0), 2]], unseen: [100, 10, 1] }
            });
          }),
          T('pl-place-digit', '자리의 숫자와 그 숫자가 나타내는 값', '①38 심18', (d) => {
            const n = toNum(pickDigits(d, 3)), k = d.int(1, 2), t = digitAt(n, k);
            return M(`${n}에서 ${PLACES[k]}의 자리 숫자와 그 숫자가 나타내는 값은?`, [{ label: '숫자', answer: t }, { label: '나타내는 값', answer: t * pow(k) }], { explain: `${PLACES[k]}의 자리 숫자는 ${t}이고 ${josa(t * pow(k), '을/를')} 나타낸다.`, facts: { calc: [[dx(n, k), 0], [vx(n, k), 1]], unseen: [pow(k), 10] } });
          }),
          T('pl-digit-value', '숫자가 나타내는 값', '①39', (d) => {
            const n = toNum(pickDigits(d, 3)), k = d.int(1, 2), t = digitAt(n, k);
            return N(`${n}에서 숫자 ${josa(t, '이/가')} 나타내는 값은?`, t * pow(k), { explain: `숫자 ${josa(t, '은/는')} ${PLACES[k]}의 자리 숫자이므로 ${josa(t * pow(k), '을/를')} 나타낸다.`, facts: { calc: [[vx(n, k), 0]], unseen: [pow(k), 10] } });
          }),
          T('pl-same-two', '같은 숫자가 자리에 따라 나타내는 값', '①39', (d) => {
            const t = d.int(2, 9), u = d.until(() => d.int(1, 9), (v) => v !== t), [hi, lo] = d.pick([[2, 1], [2, 0], [1, 0]]), n = toNum([2, 1, 0].map((k) => (k === hi || k === lo ? t : u)));
            return M(`${n}에서 ㉠과 ㉡이 나타내는 값은?`, [{ label: LABELS[0], answer: t * pow(hi) }, { label: LABELS[1], answer: t * pow(lo) }], {
              figure: marked(n, [2, 1, 0].map((k) => (k === hi ? LABELS[0] : k === lo ? LABELS[1] : ''))),
              explain: `㉠은 ${PLACES[hi]}의 자리 숫자이므로 ${josa(t * pow(hi), '을/를')}, ㉡은 ${PLACES[lo]}의 자리 숫자이므로 ${josa(t * pow(lo), '을/를')} 나타낸다. 같은 숫자라도 자리에 따라 나타내는 값이 다르다.`,
              facts: { calc: [[vx(n, hi), 0], [vx(n, lo), 1]], unseen: [100, 10, 1] }
            });
          }),
          T('pl-read-digits', '읽은 수의 자리 숫자', '①40', (d) => {
            const n = toNum(pickDigits(d, 3)), word = say(n);
            return M(`「${word}」${tail(word, '을/를')} 수로 쓸 때, 십의 자리 숫자와 일의 자리 숫자는?`, [{ label: '십의 자리', answer: digitAt(n, 1) }, { label: '일의 자리', answer: digitAt(n, 0) }], {
              explain: `수로 쓰면 ${n}이다. 십의 자리 숫자는 ${digitAt(n, 1)}, 일의 자리 숫자는 ${digitAt(n, 0)}이다.`, facts: { calc: [[dx(n, 1), 0], [dx(n, 0), 1]], unseen: [10, 1], big: { shown: [[word, n]] } }
            });
          }),
          T('pl-pick-by-digit', '자리 숫자로 수 고르기', '①41 심17', (d) => {
            const t = d.int(1, 9), k = d.int(0, 2), rest = [0, 1, 2].filter((p) => p !== k), places = d.shuffle([k, rest[0], rest[1], d.pick(rest)]);
            const list = d.until(() => places.map((p) => withDigit(d, t, p)), (v) => new Set(v).size === 4), at = places.indexOf(k);
            return C(`${PLACES[k]}의 자리 숫자가 ${t}인 수는?`, list.map(String), at, { explain: `숫자 ${josa(t, '이/가')} 있는 자리를 찾는다. ${list[at]}의 ${PLACES[k]}의 자리 숫자가 ${t}이다.`, facts: { choose: { exprs: list.map((n) => dx(n, k)), rule: 'equals', target: t }, unseen: [100, 10, 1] } });
          }),
          T('pl-value-find', '숫자가 나타내는 값으로 수 고르기', '①42 심15', (d) => {
            const t = d.int(1, 9), k = d.pick([1, 1, 2, 0]), rest = [0, 1, 2].filter((p) => p !== k), places = d.shuffle([k, rest[0], rest[1], d.pick(rest)]);
            const list = d.until(() => places.map((p) => withDigit(d, t, p)), (v) => new Set(v).size === 4), at = places.indexOf(k);
            return C(`숫자 ${josa(t, '이/가')} ${josa(t * pow(k), '을/를')} 나타내는 수는?`, list.map(String), at, {
              explain: `숫자 ${josa(t, '이/가')} ${PLACES[k]}의 자리에 있으면 ${josa(t * pow(k), '을/를')} 나타낸다. ${list[at]}의 ${PLACES[k]}의 자리 숫자가 ${t}이다.`, facts: { choose: { exprs: list.map((n) => vx(n, k)), rule: 'equals', target: t * pow(k) }, unseen: [100, 10, 1] }
            });
          }),
          T('pl-value-odd', '숫자가 나타내는 값이 다른 하나', '①43', (d) => {
            const t = d.int(1, 9), p = d.int(0, 2), q = d.until(() => d.int(0, 2), (v) => v !== p), places = d.shuffle([p, p, p, q]);
            const list = d.until(() => places.map((k) => withDigit(d, t, k)), (v) => new Set(v).size === 4), at = places.indexOf(q);
            return C(`숫자 ${josa(t, '이/가')} 나타내는 값이 나머지 셋과 다른 하나는?`, list.map(String), at, {
              explain: `숫자 ${josa(t, '은/는')} ${list[at]}에서 ${josa(t * pow(q), '을/를')}, 나머지 수에서 ${josa(t * pow(p), '을/를')} 나타낸다.`, facts: { choose: { exprs: list.map((n, i) => vx(n, places[i])), rule: 'odd' }, unseen: [100, 10, 1] }
            });
          }),
          T('pl-underline-size', '밑줄 친 숫자가 나타내는 값의 크기', '①44', (d) => {
            // 숫자가 큰 쪽(작은 쪽)을 고르는 아이가 틀리게: 백의 자리에는 작은 숫자, 십의 자리에는 큰 숫자에 밑줄을 친다.
            const big = d.bool(), hs = d.shuffle([1, 2, 3, 4, 5]).slice(0, 2), ts = d.shuffle([6, 7, 8, 9]).slice(0, 2);
            const rows = d.shuffle([[2, hs[0]], [2, hs[1]], [1, ts[0]], [1, ts[1]]]).map(([k, t]) => [withDigit(d, t, k), k, t * pow(k)]);
            const values = rows.map((row) => row[2]), at = values.indexOf(big ? Math.max.apply(null, values) : Math.min.apply(null, values));
            return C(`밑줄 친 숫자가 나타내는 값이 가장 ${big ? '큰' : '작은'} 수는?`, LABELS.slice(0, 4), at, {
              figure: tagged(rows.map(([n, k]) => under(n, k))), explain: `밑줄 친 숫자가 나타내는 값은 차례로 ${values.join(', ')}이다. 숫자의 크기보다 숫자가 있는 자리를 먼저 본다.`,
              facts: { choose: { exprs: rows.map(([n, k]) => vx(n, k)), rule: big ? 'max' : 'min' }, unseen: [100, 10, 1] }
            });
          }),
          T('pl-underline-right', '밑줄 친 숫자가 나타내는 값을 바르게 쓴 것', '①45', (d) => {
            // 틀린 보기: 십의 자리 숫자를 그대로 쓴 것, 백의 자리 숫자를 몇십으로 쓴 것, 한 자리 위의 값으로 쓴 것
            const ts = pickDigits(d, 4), k0 = d.int(1, 2), kd = d.int(0, 1);
            const rows = d.shuffle([[k0, pow(k0)], [1, 1], [2, 10], [kd, pow(kd + 1)]].map(([k, unit], i) => [withDigit(d, ts[i], k), k, ts[i] * unit]));
            const at = rows.findIndex(([n, k, value]) => digitAt(n, k) * pow(k) === value), [n, k, value] = rows[at];
            return C('밑줄 친 숫자가 나타내는 값을 바르게 쓴 것은?', rows.map((row) => `${under(row[0], row[1])} → ${row[2]}`), at, {
              explain: `${n}에서 밑줄 친 숫자 ${josa(digitAt(n, k), '은/는')} ${PLACES[k]}의 자리 숫자이므로 ${josa(value, '을/를')} 나타낸다.`, facts: { claimed: rows.map((row) => [vx(row[0], row[1]), row[2]]), claimedWant: true }
            });
          }),
          T('pl-say', '세 자리 수에 대한 설명', '①46', (d) => {
            // 틀린 설명: 십의 자리 숫자가 나타내는 값을 숫자 그대로(또는 몇백으로) 말한 것
            const [a, b, c] = pickDigits(d, 3, [2, 3, 4, 5, 6, 7, 8, 9]), n = toNum([a, b, c]), slip = d.pick([b, b * 100]);
            const rows = d.shuffle([[`백의 자리 숫자는 ${a}이다.`, digitAt(n, 2) === a], [`숫자 ${josa(b, '이/가')} 나타내는 값은 ${slip}이다.`, digitAt(n, 1) * 10 === slip], [`${said(n)} 읽는다.`, true], [`일의 자리 숫자는 ${c}이다.`, digitAt(n, 0) === c]]);
            return C(`${n}에 대한 설명으로 틀린 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => !row[1]), { explain: `숫자 ${josa(b, '은/는')} 십의 자리 숫자이므로 ${josa(b * 10, '을/를')} 나타낸다.`, facts: truthOf(rows, false) });
          }),
          T('pl-model', '숫자가 나타내는 수 모형', '①47', (d) => {
            const ds = modelDigits(d), n = toNum(ds), k = d.int(0, 2), t = digitAt(n, k);
            return C(`수 모형은 ${josa(n, '을/를')} 나타낸다. ${n}에서 숫자 ${josa(t, '이/가')} 나타내는 수 모형은?`, [2, 1, 0].map((p) => `${MODELS[p]} ${t}개`), 2 - k, {
              figure: blocks(n), explain: `숫자 ${josa(t, '은/는')} ${PLACES[k]}의 자리 숫자이므로 ${josa(t * pow(k), '을/를')} 나타낸다. ${MODELS[k]} ${t}개이다.`,
              facts: { choose: { exprs: [dx(n, 2), dx(n, 1), dx(n, 0)], rule: 'equals', target: t }, unseen: [100, 10, 1] }
            });
          }),
          T('pl-cond', '자리마다 알려 준 세 자리 수', '①48 심10', (d) => {
            const a = d.int(1, 9), b = d.int(1, 9), other = d.until(() => d.int(101, 999), (v) => v % 10 !== 0 && Math.floor(v / 100) !== a), c = other % 10, n = toNum([a, b, c]);
            return N('다음에서 설명하는 세 자리 수는?', n, {
              figure: conds([`백의 자리 숫자는 ${a}이다.`, `십의 자리 숫자는 ${josa(b * 10, '을/를')} 나타낸다.`, `일의 자리 숫자는 ${other}의 일의 자리 숫자와 같다.`]),
              explain: `백의 자리 숫자는 ${a}, 십의 자리 숫자는 ${b}, 일의 자리 숫자는 ${c}이다. ${n}이다.`, facts: { calc: [[`${a}*100+${b * 10}+${other}%10`, 0]], unseen: [100, 10] }
            });
          }),
          T('pl-score', '몇백, 몇십, 몇의 합', '①36', (d) => {
            const hs = pickDigits(d, 2, [2, 3, 4, 5, 6, 7, 8]), ts = pickDigits(d, 2), os = pickDigits(d, 2);
            const rows = [['빨간색', hs[0] * 100], ['주황색', hs[1] * 100], ['노란색', ts[0] * 10], ['초록색', ts[1] * 10], ['파란색', os[0]], ['보라색', os[1]]];
            const hit = [rows[d.int(0, 1)], rows[d.int(2, 3)], rows[d.int(4, 5)]], n = hit.reduce((s, row) => s + row[1], 0);
            return N(`과녁의 색깔마다 점수가 다르다. ${hit.map((row) => row[0]).join(', ')} 칸을 한 번씩 맞혔다. 점수는 모두 몇 점인가?`, n, {
              unit: '점', figure: table(['색깔', '점수'], rows.map(([color, v]) => [color, v + '점'])), explain: `${hit.map((row) => row[1]).join(' + ')} = ${n}`, facts: { calc: [[hit.map((row) => row[1]).join('+'), 0]] }
            });
          })
        ]
      },
      { id: 'skip', title: '뛰어 세기와 1000', standard: ORDER, types: [] },
      { id: 'compare', title: '세 자리 수의 크기 비교', standard: ORDER, types: [] }
    ]
  });

  // 같은 단원의 b 파일이 쓰는 도구
  B.kit.g211 = { NUM, ORDER, PLACES, pow, digitAt, dx, vx, pickDigits, toNum, withDigit, quote, tail, said, truthOf, conds, model, coins, bundles, hline, hops, under, marked };
})(typeof window !== 'undefined' ? window : globalThis);
