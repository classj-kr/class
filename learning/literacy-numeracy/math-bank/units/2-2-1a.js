// 2학년 2학기 1단원 네 자리 수 — 단원 틀, 그림 도구, 기본 문항(천, 몇천, 네 자리 수 쓰고 읽기, 각 자리의 숫자가 나타내는 값).
// 수집해 둔 교과서(국정 한 종)의 평가 자료 — 미래엔·아이스크림미디어·천재의 단원평가·차시학습지·수행평가 — 에서 뽑은
// 꼴 목록(기본꼴_1 73꼴, 심화꼴 52꼴)을 처음부터 끝까지 대조하여 꼴마다 ① 2학년 2학기 이 단원의 내용인가 ② 무엇을 하게 하는 문제인가를 따져 실었다.
// 유형마다 꼴 번호를 적는다(①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번). 뛰어 세기·크기 비교·수 카드의 기본 문항과 실력 문항은 2-2-1b.js에 있다.
//
// 영역은 수와 연산. 성취기준 [2수01-02](일·십·백·천의 자릿값과 위치적 기수법, 네 자리 이하의 수 읽고 쓰기), [2수01-03](수의 계열, 크기 비교).
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(수 모형·돈·수직선·글·읽는 말·묶음의 수)과 묻는 것(수·개수·읽는 말 고르기·틀린 설명)이 다르면 따로 싣는다.
//    수만 다르거나 상황(물건·이름)만 다른 것은 한 번만 싣는다. 0이 낀 수와 0이 없는 수는 하는 일이 달라 따로 싣고 facts.rule 에 이름을 단다.
//  - 교육과정의 금: 「수를 … 한글로 쓰게 하는 것은 지양한다」 → 읽는 말은 고르기로만 묻고 답 칸에는 숫자만 받는다(①11·19·20·21·23·28, 심1·8·13·14·18의 읽어 쓰기 칸).
//    읽는 말을 수로 쓰는 것(「삼천오」 → 3005)은 수 답이라 싣는다. 9999를 넘는 수(만)는 문제에도 보기에도 쓰지 않는다.
//  - 수를 읽는 말은 엔진(say)으로 만들고, 이 파일의 wordValue 로 따로 다시 읽어 값을 정한다. 검사는 또 다른 표로 한 번 더 읽는다.
//  - 한 문항에 답 칸은 넷까지. 수 모형의 천 모형·백 모형과 동전은 다섯 개씩 끊어 놓고, 한 그림에 놓는 모형·돈은 모두 20개를 넘기지 않는다.
//
// 뺀 것과 까닭
//  - 범위 밖: 덧셈·뺄셈으로만 풀리는 1000의 짝(①7 변형 780원 → 220원, 심3 890과 110 — 세 자리 수의 뺄셈은 3학년). 「몇백과 몇백」의 짝(①6·7)은 100이 몇 개인지로 풀리므로 실었다.
//    몇십 개씩 100묶음(①18 — 30이 100개는 (몇십)×(몇백)), 20씩·500씩 뛰어 세기(심32·39 — 교과서의 뛰어 세기는 1000·100·10·1씩), 4년마다 돌아오는 해(심40).
//  - 조건 풀이·경우 따지기: 수 카드로 조건에 맞는 수를 「모두」 만들기(①72 심50), 조건 여럿에 맞는 수(①73 심52), 두 식에 모두 들어갈 수 있는 수(심49).
//  - 작도·놀이·열린 답: 동전 묶기(①8), 색칠하기(①13 심6·11), 값을 찾아 낱말 만들기(①41), 주변의 네 자리 수 말하기(심14⑶).
//    잇기(①6·12·25·37)는 짝 고르기로, 수직선에 쓰기(①2 변형·①10 변형)는 ㉠·㉡의 수 답으로 바꾸어 실었다.
//  - 뜻 없는 결합: 번호가 가장 큰 버스의 십의 자리 숫자(①63 변형) — 크기 비교(cmp-ends)와 자리 숫자 읽기(pl-digit-value)를 이어 붙였을 뿐이다.
//  - 찍으면 맞는 것: 두 사람이 수 카드로 만든 수의 비교(심51) — 자리를 정해 만드는 일은 cd-fixed-max·h-cards-fixed-min 에 실었고,
//    보기가 두 사람뿐이라 「가장 큰 수」를 만든 쪽을 고르면 맞는다.
//  - 같은 문제: 「다음이 나타내는 수」 오지선다(①10·19 변형, 심8)는 수 모형을 세어 쓰기와, 두 수 가운데 더 큰 수(①61)는 >·< 고르기와,
//    말로 바르게 비교한 사람(①62 변형 심42)은 바르게 비교한 것 고르기와, 지폐·동전을 글로 준 금액(①29 대표, 심18 변형)은 그림으로 준 금액·묶음 문장제와,
//    10장이 넘는 돈의 금액(심19 변형)은 한 자리의 묶음이 10개를 넘는 수(h-over)와 수·상황만 다르다. 달마다 표 채우기(①56 변형)는 표에서 규칙을 찾는 꼴로 실었다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, box, lines, numbers, table, josa, say, N, M, C } = B.kit;
  const NUM = '2수01-02', ORDER = '2수01-03';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const PLACES = ['일', '십', '백', '천'], UNITS = [1000, 100, 10, 1], KINDS = ['천', '백', '십', '일'];
  const pow = (k) => [1, 10, 100, 1000][k];
  const digitAt = (n, k) => Math.floor(n / pow(k)) % 10;
  const dx = (n, k) => `((${n}-${n}%${pow(k)})/${pow(k)})%10`;      // 검사가 자리 숫자를 다시 셈하는 식
  const vx = (n, k) => `(${dx(n, k)})*${pow(k)}`;                   // 그 숫자가 나타내는 값
  const toNum = (digits) => digits.reduce((n, v) => n * 10 + v, 0);
  const uniq = (d, len) => d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, len);
  // 네 자리 수: 10^p 자리에만 숫자 t 가 있고 나머지 자리는 t 가 아닌(0도 아닌) 숫자이다.
  const withDigit = (d, t, p) => toNum([3, 2, 1, 0].map((k) => (k === p ? t : d.until(() => d.int(1, 9), (v) => v !== t))));
  // 천의 자리 숫자는 그대로 두고 아래 세 자리 숫자의 차례만 바꾼 수들(자신은 뺀다). 0의 자리를 옮겨 읽거나 숫자의 차례를 바꾸어 읽은 틀린 보기에 쓴다.
  function moves(n) {
    const s = String(n), out = [];
    for (const [i, j, k] of [[1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]) { const v = Number(s[0] + s[i] + s[j] + s[k]); if (v !== n && !out.includes(v)) out.push(v); }
    return out;
  }
  const tail = (word, pair) => josa(word, pair).slice(String(word).length);   // 낱말 뒤에 붙는 토씨만
  const quoted = (word, pair) => '「' + word + '」' + (pair ? tail(word, pair) : '');
  const said = (n) => quoted(say(n), '이라고/라고');
  // 수로 끝나는 글(「4000 + 60」)과 낱말로 끝나는 글 뒤에 토씨를 붙인다.
  const after = (text, pair) => { const m = String(text).match(/(\d+)$/); return m ? josa(Number(m[1]), pair).slice(m[1].length) : tail(text, pair); };

  // ── 수를 읽는 말을 다시 읽기(엔진의 say 와 따로 적었다) ──────────
  const DIGIT = { 일: 1, 이: 2, 삼: 3, 사: 4, 오: 5, 육: 6, 칠: 7, 팔: 8, 구: 9 }, BIG = { 천: 1000, 백: 100, 십: 10 };
  function wordValue(text) {
    let total = 0, digit = 0;
    for (const ch of String(text).replace(/\s/g, '')) {
      if (DIGIT[ch]) digit = DIGIT[ch];
      else if (BIG[ch]) { total += (digit || 1) * BIG[ch]; digit = 0; }
      else throw new Error('읽을 수 없는 말: ' + text);
    }
    return total + digit;
  }
  // ── 수를 나타내는 여러 가지 글 ───────────────────────────────
  const digits4 = (n) => [3, 2, 1, 0].map((k) => digitAt(n, k));
  // 「1000이 4개, 10이 6개인 수」: counts 는 [1000, 100, 10, 1]의 개수. 0개인 것은 적지 않는다.
  const bundles = (counts) => counts.map((c, k) => (c ? `${josa(UNITS[k], '이/가')} ${c}개` : '')).filter(Boolean).join(', ') + '인 수';
  // 「4000 + 100 + 60」: 0인 자리는 적지 않는다.
  const expanded = (n) => digits4(n).map((v, k) => (v ? v * UNITS[k] : '')).filter(Boolean).join(' + ');
  // 묶음으로 적은 글을 식으로 다시 읽는다(1000이 4개, 10이 6개 → 1000*4+10*6).
  const bundleExpr = (text) => Array.from(String(text).matchAll(/(\d+)이 (\d+)개/g)).map((m) => `${m[1]}*${m[2]}`).join('+');
  // 수, 읽는 말, 묶음, 자릿값의 합으로 적은 글을 검사가 셈할 식으로 바꾼다.
  const formExpr = (text) => (/^\d+$/.test(text) ? String(text) : /개인 수$/.test(text) ? bundleExpr(text) : /\+/.test(text) ? String(text).replace(/\s/g, '') : String(wordValue(text)));
  // 「900보다 100만큼 더 큰 수」「100이 10개인 수」를 [식, 값]으로 읽는다.
  function claimOf(text) {
    let m = String(text).match(/^(\d+)보다 (\d+)만큼 더 큰 수$/);
    if (m) return [`${m[1]}+${m[2]}`, Number(m[1]) + Number(m[2])];
    m = String(text).match(/^(\d+)이 (\d+)개인 수$/);
    if (m) return [`${m[1]}*${m[2]}`, Number(m[1]) * Number(m[2])];
    throw new Error('뜻을 읽을 수 없는 글: ' + text);
  }

  // ── 그림 ─────────────────────────────────────────────────────
  // 수 모형: 천 모형(정육면체)·백 모형(판)·십 모형(막대)·일 모형(낱개). 천 모형과 백 모형은 다섯 개씩 끊어 줄을 바꾼다.
  // 휴대폰 너비에 들어가게 엔진의 blocks 보다 조금 작게 그린다(판 한 변 30). scale 을 주지 않으면 너비 280px 안에서 1.5배까지 키운다.
  function model(th, h, t, o, scale) {
    const S = 30, D = 8, ink = '#a86a00', net = (x, y) => { let p = ''; for (let k = 1; k < 10; k += 1) p += `M${x + k * 3} ${y}v${S}M${x} ${y + k * 3}h${S}`; return p; };
    let body = '', y = 3, right = 0;
    for (let i = 0; i < th; i += 1) {
      const x = 3 + (i % 5) * (S + D + 4), fy = y + Math.floor(i / 5) * (S + D + 4) + D;
      body += `<path d="M${x} ${fy}l${D} ${-D}h${S}l${-D} ${D}z" style="fill:#fbdc94;stroke:${ink};stroke-width:0.7;stroke-linejoin:round"/>`
        + `<path d="M${x + S} ${fy}l${D} ${-D}v${S}l${-D} ${D}z" style="fill:#dc9f27;stroke:${ink};stroke-width:0.7;stroke-linejoin:round"/>`
        + `<g class="mb-flat"><rect x="${x}" y="${fy}" width="${S}" height="${S}" rx="1"/><path d="${net(x, fy)}"/></g>`;
      right = Math.max(right, x + S + D);
    }
    if (th) y += Math.ceil(th / 5) * (S + D + 4);
    let x = 3;
    for (let i = 0; i < h; i += 1) {
      const fx = 3 + (i % 5) * (S + 3), fy = y + Math.floor(i / 5) * (S + 3);
      body += `<g class="mb-flat"><rect x="${fx}" y="${fy}" width="${S}" height="${S}" rx="1.5"/><path d="${net(fx, fy)}"/></g>`;
    }
    if (h) x += Math.min(h, 5) * (S + 3) + 3;
    for (let i = 0; i < t; i += 1) {
      let ticks = '';
      for (let k = 1; k < 10; k += 1) ticks += `M${x} ${y + k * 3}h5`;
      body += `<g class="mb-rod"><rect x="${x}" y="${y}" width="5" height="${S}" rx="1"/><path d="${ticks}"/></g>`; x += 8;
    }
    if (t) x += 3;
    for (let i = 0; i < o; i += 1) body += `<rect class="mb-one" x="${x + Math.floor(i / 5) * 7.5}" y="${(y + (i % 5) * 6.2).toFixed(1)}" width="5" height="5" rx="1"/>`;
    if (o) x += Math.ceil(o / 5) * 7.5;
    const band = Math.max(h ? Math.ceil(h / 5) * (S + 3) - 3 : 0, t || o ? S : 0);
    const width = Math.max(right, x, 67) + 3, height = y + band + (band ? 3 : -1);
    const told = '수 모형: ' + [[th, '천'], [h, '백'], [t, '십'], [o, '일']].filter(([n]) => n).map(([n, kind]) => `${kind} 모형 ${n}개`).join(', ');
    return `<svg class="mb-dots" viewBox="0 0 ${width} ${height}" width="${Math.round(width * (scale || Math.min(1.5, 280 / width)))}" role="img" aria-label="${told}">${body}</svg>`;
  }
  // 돈: 1000원짜리 지폐(값이 적힌 네모)와 100원·10원짜리 동전(값이 적힌 동그라미). 값마다 줄을 바꾸고 다섯 개씩 끊어 놓는다.
  const COIN = { 100: ['#e5e7eb', '#4b5563'], 10: ['#f6d2a8', '#9a5b13'] };
  function money(bills, hundreds, tens) {
    let out = '', y = 5, right = 0;
    for (let i = 0; i < bills; i += 1) {
      const x = 5 + (i % 5) * 50, top = y + Math.floor(i / 5) * 27;
      out += `<rect x="${x}" y="${top}" width="46" height="23" rx="3" style="fill:#dcefe0;stroke:#2f7d4f;stroke-width:1.2"/><text x="${x + 23}" y="${top + 15.2}" text-anchor="middle" style="font-size:10px;font-weight:700;fill:#1f2933">1000</text>`;
      right = Math.max(right, x + 46);
    }
    if (bills) y += Math.ceil(bills / 5) * 27 + 2;
    for (const [value, n] of [[100, hundreds], [10, tens]]) {
      for (let i = 0; i < n; i += 1) {
        const c = i % 10, cx = 15.5 + c * 23 + (c >= 5 ? 6 : 0), cy = y + 10.5 + Math.floor(i / 10) * 25;
        out += `<circle cx="${cx}" cy="${cy}" r="10.5" style="fill:${COIN[value][0]};stroke:${COIN[value][1]};stroke-width:1.2"/><text x="${cx}" y="${cy + 3}" text-anchor="middle" style="font-size:${value === 100 ? 8 : 9}px;font-weight:700;fill:#1f2933">${value}</text>`;
        right = Math.max(right, cx + 10.5);
      }
      if (n) y += Math.ceil(n / 10) * 25;
    }
    const width = Math.max(right + 5, 60), height = y + 3;
    const told = [[bills, '1000원짜리 지폐', '장'], [hundreds, '100원짜리 동전', '개'], [tens, '10원짜리 동전', '개']].filter(([n]) => n).map(([n, what, unit]) => `${what} ${n}${unit}`).join(', ');
    return `<svg class="mb-counters" viewBox="0 0 ${width} ${height}" width="${Math.round(width * Math.min(1.3, 280 / width))}" role="img" aria-label="돈: ${told}">${out}</svg>`;
  }
  // 수직선: 눈금마다 수를 적거나, 빈칸 이름(㉠)을 네모 안에 적는다.
  function hline(list) {
    const n = list.length, u = Math.min(42, 252 / (n - 1)), x = (i) => 18 + i * u, y = 14, width = Math.round(36 + (n - 1) * u);
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
    const n = list.length, W = Math.min(58, Math.floor(288 / n)), w = W - 8, width = n * W, y = 24;
    let out = '';
    list.forEach((v, i) => {
      const x = 4 + i * W, mid = x + w / 2, blank = typeof v !== 'number';
      out += `<rect x="${x}" y="${y}" width="${w}" height="26" rx="5" style="fill:${blank ? '#fff' : '#f2f5f8'};stroke:#1f2933;stroke-width:${blank ? 1.8 : 1}"/>`;
      if (v !== '') out += `<text x="${mid}" y="${y + 18}" text-anchor="middle" style="font-size:14px;font-weight:600;fill:#1f2933">${v}</text>`;
      if (i < n - 1) out += `<path class="mb-jump" d="M${mid} ${y - 3}Q${mid + W / 2} ${y - 21} ${mid + W - 3} ${y - 5}"/><path d="M${mid + W - 2} ${y - 3}l-6.4 -1.6l3.4 -4z" style="fill:#1d4ed8"/>`;
    });
    return `<svg class="mb-numberline" viewBox="0 0 ${width} 54" width="${width}" role="img" aria-label="뛰어 세기: ${list.map((v) => (v === '' ? '□' : v)).join(', ')}">${out}</svg>`;
  }
  // 한 숫자에 밑줄을 친 수(k: 0 일의 자리 … 3 천의 자리)
  const under = (n, k) => { const s = String(n), i = s.length - 1 - k; return s.slice(0, i) + '<u style="text-decoration-thickness:2px;text-underline-offset:4px">' + s[i] + '</u>' + s.slice(i + 1); };
  // 숫자 아래에 이름을 단 수: marks 는 천·백·십·일의 자리 차례(없으면 '')
  const marked = (n, marks) => `<div style="display:inline-grid;grid-template-columns:repeat(4,1.9em);justify-items:center;row-gap:2px;font-size:1.5rem;font-weight:600;font-variant-numeric:tabular-nums">${String(n).split('').map((ch) => `<span>${ch}</span>`).join('')}${marks.map((m) => `<span style="font-size:1rem;font-weight:700;color:#1d4ed8">${m}</span>`).join('')}</div>`;
  const versus = (left, right) => `<div class="mb-versus"><span class="mb-expr">${left}</span><span class="mb-ring"></span><span class="mb-expr">${right}</span></div>`;
  const both = (first, second, unit) => [{ label: LABELS[0], answer: first, unit }, { label: LABELS[1], answer: second, unit }];

  // 같은 단원의 b 파일이 쓰는 도구
  B.kit.g221 = { PLACES, UNITS, KINDS, pow, digitAt, dx, vx, toNum, uniq, withDigit, moves, tail, quoted, said, after, wordValue, digits4, bundles, expanded, bundleExpr, formExpr, claimOf, model, money, hline, hops, under, marked, versus, both };

  B.addUnit({
    id: '2-2-1', grade: 2, semester: 2, no: 1, title: '네 자리 수', version: 1,
    groups: [
      {
        id: 'thousand', title: '천', standard: NUM,
        types: [
          T('th-flats', '백 모형 10개가 나타내는 수', '①1 심1', () => M('수 모형을 보고 ㉠, ㉡에 알맞은 수를 구하시오.', both(10, 1000), {
            figure: model(0, 10, 0, 0) + lines([`100이 ${box(LABELS[0])}개이면 ${box(LABELS[1])}이다.`]),
            explain: '백 모형이 10개이다. 100이 10개이면 1000이다. 1000은 「천」이라고 읽는다.', facts: { rule: 'hundreds', calc: [['10', 0], ['100*10', 1]] }
          })),
          T('th-gap', '1000은 어떤 수보다 얼마만큼 더 큰 수', '①2 심2', (d, i) => {
            // 차례: 999·990·900(1000의 세 가지 뜻) / 몇백(100씩 세어 올라간다) / 950~980(10씩 세어 올라간다)
            const base = i === 0 ? d.pick([999, 990, 900]) : i === 1 ? d.int(2, 8) * 100 : d.pick([950, 960, 970, 980]), gap = 1000 - base, step = i === 1 ? 100 : 10;
            return N(`1000은 ${base}보다 얼마만큼 더 큰 수인가?`, gap, {
              explain: i === 0 ? `${base}보다 ${gap}만큼 더 큰 수가 1000이다.` : `${base}에서 ${step}씩 ${gap / step}번 뛰어 세면 1000이다. 1000은 ${base}보다 ${gap}만큼 더 큰 수이다.`,
              facts: { rule: ['near', 'hundreds', 'tens'][i], calc: [[`1000-${base}`, 0]] }
            });
          }, { count: 3 }),
          T('th-next', '1000이 되는 수', '①2', (d) => {
            const [base, gap] = d.pick([[999, 1], [990, 10], [900, 100]]);
            return N(`${base}보다 ${gap}만큼 더 큰 수는?`, 1000, { explain: `${base}보다 ${gap}만큼 더 큰 수는 1000이다. 1000은 「천」이라고 읽는다.`, facts: { calc: [[`${base}+${gap}`, 0]] } });
          }),
          T('th-row', '1000까지 뛰어 세기', '①3', (d) => {
            const step = d.pick([1, 10, 100]), at = (k) => 1000 - step * (4 - k);
            return M(`${step}씩 뛰어 세었다. ㉠, ㉡에 알맞은 수는?`, both(at(2), 1000), {
              figure: hops([at(0), at(1), LABELS[0], at(3), LABELS[1]]), explain: `${step}씩 커진다. ㉠은 ${at(1)}보다 ${step}만큼 더 큰 ${at(2)}, ㉡은 ${at(3)}보다 ${step}만큼 더 큰 1000이다.`,
              facts: { rule: 'toThousand', calc: [[`${at(1)}+${step}`, 0], [`${at(3)}+${step}`, 1]] }
            });
          }),
          T('th-not', '1000을 나타내는 것이 아닌 것', '①4 심4', (d) => {
            // 틀린 보기: 「900과 100」「990과 10」의 짝을 엇갈리게 적은 것, 「300과 700」을 떠올리게 하는 것, 10이 10개(100)
            const wrong = d.pick(['900보다 10만큼 더 큰 수', '990보다 1만큼 더 큰 수', '300보다 70만큼 더 큰 수', '10이 10개인 수']);
            const rows = d.shuffle(d.shuffle(['900보다 100만큼 더 큰 수', '990보다 10만큼 더 큰 수', '999보다 1만큼 더 큰 수', '100이 10개인 수', '700보다 300만큼 더 큰 수']).slice(0, 3).concat([wrong]));
            return C('1000을 나타내는 것이 아닌 것은?', rows, rows.indexOf(wrong), { explain: `${wrong}는 ${claimOf(wrong)[1]}이다. 나머지는 모두 1000을 나타낸다.`, facts: { rule: 'thousand', big: { odd: rows.map((row) => claimOf(row)[0]) } } });
          }),
          T('th-units', '1000은 몇이 몇 개인 수', '①5', (d) => {
            const unit = d.pick([10, 100]);
            return N(`1000은 ${josa(unit, '이/가')} 몇 개인 수인가?`, 1000 / unit, { unit: '개', explain: `${josa(unit, '이/가')} ${1000 / unit}개이면 1000이다.`, facts: { rule: 'units', calc: [[`1000/${unit}`, 0]] } });
          }),
          T('th-pair', '모으면 1000이 되는 두 수', '①6', (d) => {
            // 몇백과 몇백: 100이 모두 10개가 되는 짝. 틀린 짝은 100이 9개, 11개, 12개이다.
            const a = d.int(2, 8), b = 10 - a, rows = d.shuffle([[a, b], [a, b + 1], [a, b - 1], [a + 1, b + 1]]);
            return C('두 수를 모으면 1000이 되는 것은?', rows.map(([x, y]) => `${x * 100}, ${y * 100}`), rows.findIndex(([x, y]) => x + y === 10), {
              explain: `${josa(a * 100, '은/는')} 100이 ${a}개, ${josa(b * 100, '은/는')} 100이 ${b}개인 수이다. 100이 모두 10개이므로 1000이다.`, facts: { choose: { exprs: rows.map(([x, y]) => `${x * 100}+${y * 100}`), rule: 'equals', target: 1000 } }
            });
          }),
          T('th-coins', '1000원이 되려면 더 있어야 하는 돈', '①7', (d) => {
            const k = d.int(4, 8);
            return N('동전이 그림과 같이 있다. 1000원이 되려면 얼마가 더 있어야 하는가?', (10 - k) * 100, {
              unit: '원', figure: money(0, k, 0), explain: `100원짜리 동전이 ${k}개이므로 ${k * 100}원이다. 100원짜리 동전이 ${10 - k}개 더 있으면 100이 10개가 되어 1000원이다.`, facts: { calc: [[`1000-100*${k}`, 0]] }
            });
          }),
          T('th-word', '100씩 10묶음, 10씩 100묶음', '①9 심7', (d, i) => {
            // 차례: 100이 10개 / 10이 100개
            if (i === 0) {
              const [what, pack, unit] = d.pick([['색종이', '묶음', '장'], ['구슬', '상자', '개'], ['단추', '통', '개']]);
              return N(`${what} 100${unit}씩 10${josa(pack, '은/는')} 모두 몇 ${unit}인가?`, 1000, { unit, explain: '100이 10개이면 1000이다.', facts: { calc: [['100*10', 0]] } });
            }
            const [told, unit] = d.pick([['줄넘기를 하루에 10번씩 한다. 100일 동안 하면 모두 몇 번인가?', '번'], ['붙임딱지를 한 장에 10개씩 붙였다. 100장에 붙인 붙임딱지는 모두 몇 개인가?', '개']]);
            return N(told, 1000, { unit, explain: '10이 10개이면 100이고, 100이 10개이면 1000이다. 10이 100개이면 1000이다.', facts: { calc: [['10*100', 0]] } });
          }, { count: 2 })
        ]
      },
      {
        id: 'thousands', title: '몇천', standard: NUM,
        types: [
          T('ths-cubes', '천 모형을 세어 몇천 쓰기', '①10 심8', (d) => {
            const k = d.int(3, 9);
            return M('수 모형을 보고 ㉠, ㉡에 알맞은 수를 구하시오.', both(k, k * 1000), {
              figure: model(k, 0, 0, 0) + lines([`1000이 ${box(LABELS[0])}개이면 ${box(LABELS[1])}이다.`]), explain: `천 모형이 ${k}개이다. 1000이 ${k}개이면 ${k * 1000}이다.`,
              facts: { rule: 'thousands', calc: [[String(k), 0], [`1000*${k}`, 1]] }
            });
          }),
          T('ths-make', '1000이 몇 개인 수 쓰기', '①11', (d) => {
            const k = d.int(2, 9);
            return N(`1000이 ${k}개인 수는?`, k * 1000, { explain: `1000이 ${k}개이면 ${k * 1000}이다. ${josa(k * 1000, '은/는')} ${said(k * 1000)} 읽는다.`, facts: { rule: 'make', calc: [[`1000*${k}`, 0]] } });
          }),
          T('ths-count', '몇천은 1000이 몇 개인 수', '심9', (d) => {
            const k = d.int(2, 9);
            return N(`${josa(k * 1000, '은/는')} 1000이 몇 개인 수인가?`, k, { unit: '개', explain: `1000이 ${k}개이면 ${k * 1000}이다.`, facts: { rule: 'count', calc: [[`${k * 1000}/1000`, 0]] } });
          }),
          T('ths-write-read', '몇천을 쓰고 읽은 것 고르기', '①11 심9', (d) => {
            // 틀린 보기: 0을 하나 덜 쓰고 백으로 읽은 것(700, 칠백), 수는 맞고 백으로 읽은 것(7000, 칠백), 천과 백을 함께 쓴 것(7700, 칠천칠백)
            const k = d.int(2, 9), n = k * 1000, rows = d.shuffle([[n, n], [k * 100, k * 100], [n, k * 100], [k * 1100, k * 1100]]);
            const truth = rows.map(([written, read]) => written === 1000 * k && wordValue(say(read)) === 1000 * k);
            return C(`1000이 ${k}개인 수를 바르게 쓰고 읽은 것은?`, rows.map(([written, read]) => `${written}, ${say(read)}`), truth.indexOf(true), {
              explain: `1000이 ${k}개인 수는 ${n}이라 쓰고, ${said(n)} 읽는다.`, facts: { truth, want: true }
            });
          }),
          T('ths-pairs', '몇천과 읽는 말의 짝', '①12', (d) => {
            // 틀린 짝: 백으로 읽은 것(4000 — 사백), 다른 몇천으로 읽은 것(6000 — 구천), 천을 앞에 읽은 것(5000 — 천오)
            const ks = d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]);
            const rows = d.shuffle([[ks[0] * 1000, say(ks[0] * 1000)], [ks[1] * 1000, say(ks[1] * 100)], [ks[2] * 1000, say(ks[4] * 1000)], [ks[3] * 1000, say(1000 + ks[3])]]), at = rows.findIndex(([n, word]) => wordValue(word) === n);
            return C('수와 읽는 말을 바르게 짝 지은 것은?', rows.map(([n, word]) => `${n} — ${word}`), at, {
              explain: `${josa(rows[at][0], '은/는')} ${quoted(rows[at][1], '이라고/라고')} 읽는다. 몇천은 천 앞에 1000의 개수를 붙여 읽는다.`, facts: { claimed: rows.map(([n, word]) => [String(n), wordValue(word)]), claimedWant: true }
            });
          }),
          T('ths-many', '100이 몇십 개, 10이 몇백 개인 수', '①14 심10', (d, i) => {
            // 차례: 100이 몇십 개 / 10이 몇백 개
            const k = d.int(2, 9), unit = [100, 10][i], count = k * 1000 / unit;
            return N(`${josa(unit, '이/가')} ${count}개인 수는?`, k * 1000, {
              explain: `${josa(unit, '이/가')} ${1000 / unit}개이면 1000이다. ${josa(unit, '이/가')} ${count}개이면 1000이 ${k}개인 것과 같으므로 ${k * 1000}이다.`, facts: { rule: ['hundreds', 'tens'][i], calc: [[`${unit}*${count}`, 0]] }
            });
          }, { count: 2 }),
          T('ths-not', '몇천을 나타내는 것이 아닌 것', '①15', (d) => {
            // 틀린 보기: 0을 하나 덜 붙인 묶음의 수(10이 80개 → 800, 100이 8개 → 800)
            const k = d.int(2, 9), n = k * 1000, wrong = d.pick([`10이 ${k * 10}개인 수`, `100이 ${k}개인 수`]);
            const rows = d.shuffle([`1000이 ${k}개인 수`, `100이 ${k * 10}개인 수`, `10이 ${k * 100}개인 수`, wrong]);
            return C(`${josa(n, '을/를')} 나타내는 것이 아닌 것은?`, rows, rows.indexOf(wrong), { explain: `${wrong}는 ${claimOf(wrong)[1]}이다. 나머지는 모두 ${josa(n, '을/를')} 나타낸다.`, facts: { rule: 'thousands', big: { odd: rows.map((row) => claimOf(row)[0]) } } });
          }),
          T('ths-word', '1000씩 몇 묶음', '①16 심12', (d) => {
            const [what, pack] = d.pick([['나사못', '상자'], ['빨대', '봉지'], ['종이컵', '상자']]), k = d.int(3, 9);
            return N(`${josa(what, '이/가')} 한 ${pack}에 1000개씩 들어 있다. ${k}${pack}에 들어 있는 ${josa(what, '은/는')} 모두 몇 개인가?`, k * 1000, { unit: '개', explain: `1000이 ${k}개이면 ${k * 1000}이다.`, facts: { calc: [[`1000*${k}`, 0]] } });
          }),
          T('ths-word-many', '100개씩 몇십 묶음, 10개씩 몇백 묶음', '①17', (d) => {
            const k = d.int(2, 9), hundred = d.bool();
            const told = hundred ? `구슬을 한 통에 100개씩 담았다. ${k * 10}통에 담은 구슬은 모두 몇 개인가?` : `사탕을 한 봉지에 10개씩 담았다. ${k * 100}봉지에 담은 사탕은 모두 몇 개인가?`;
            return N(told, k * 1000, {
              unit: '개', explain: hundred ? `100이 10개이면 1000이다. 100이 ${k * 10}개이면 1000이 ${k}개인 것과 같으므로 ${k * 1000}이다.` : `10이 100개이면 1000이다. 10이 ${k * 100}개이면 1000이 ${k}개인 것과 같으므로 ${k * 1000}이다.`,
              facts: { calc: [[hundred ? `100*${k * 10}` : `10*${k * 100}`, 0]] }
            });
          }),
          T('ths-line', '1000씩 커지는 수직선', '①10', (d) => {
            const from = d.int(1, 3), p = from + d.int(1, 2), q = d.int(p + 2, from + 6), list = [0, 1, 2, 3, 4, 5, 6].map((j) => from + j).map((k) => (k === p ? LABELS[0] : k === q ? LABELS[1] : k * 1000));
            return M('수직선에서 ㉠, ㉡에 알맞은 수는?', both(p * 1000, q * 1000), {
              figure: hline(list), explain: `눈금 한 칸은 1000을 나타낸다. ㉠은 ${(p - 1) * 1000}보다 1000만큼 더 큰 ${p * 1000}, ㉡은 ${(q - 1) * 1000}보다 1000만큼 더 큰 ${q * 1000}이다.`,
              facts: { calc: [[`${(p - 1) * 1000}+1000`, 0], [`${(q - 1) * 1000}+1000`, 1]], unseen: [1000] }
            });
          })
        ]
      },
      {
        id: 'four', title: '네 자리 수 쓰고 읽기', standard: NUM,
        types: [
          T('fo-model', '수 모형이 나타내는 수', '①19', (d, i) => {
            // 차례: 네 가지 모형이 모두 있는 수 / 한 가지 모형이 없는 수(그 자리에 0을 쓴다). 한 그림의 모형은 모두 20개를 넘지 않는다.
            const ds = d.until(() => [d.int(1, 4), d.int(1, 5), d.int(1, 5), d.int(1, 6)], (v) => new Set(v).size >= 3), gone = i === 1 ? d.int(1, 3) : -1;
            if (gone > 0) ds[gone] = 0;
            const n = toNum(ds), seen = ds.map((v, k) => (v ? `${KINDS[k]} 모형 ${v}개` : '')).filter(Boolean).join(', ');
            return N('수 모형이 나타내는 수는?', n, {
              figure: model(ds[0], ds[1], ds[2], ds[3]),
              explain: gone > 0 ? `${seen}이다. ${KINDS[gone]} 모형이 없으므로 ${KINDS[gone]}의 자리에 0을 쓴다. ${n}이다.` : `${seen}이다. ${bundles(ds)}이므로 ${n}이다.`,
              facts: { rule: ['full', 'gap'][i], calc: [[ds.map((v, k) => (v ? (k < 3 ? `${UNITS[k]}*${v}` : String(v)) : '')).filter(Boolean).join('+'), 0]], unseen: [1000, 100, 10] }
            });
          }, { count: 2 }),
          T('fo-compose', '자리마다 몇 개인 수', '①20', (d) => {
            const ds = uniq(d, 4), n = toNum(ds), text = bundles(ds);
            return N(`${text}는?`, n, { explain: `${ds.map((v, k) => v * UNITS[k]).join(' + ')} = ${n}`, facts: { rule: 'plain', calc: [[bundleExpr(text), 0]] } });
          }),
          T('fo-compose-gap', '한 자리가 비는 수', '①20', (d) => {
            const ds = uniq(d, 4), z = d.int(1, 3); ds[z] = 0;
            const n = toNum(ds), text = bundles(ds);
            return N(`${text}는?`, n, { explain: `${josa(UNITS[z], '이/가')} 없으므로 ${KINDS[z]}의 자리에 0을 쓴다. ${n}이다.`, facts: { rule: 'gap', calc: [[bundleExpr(text), 0]] } });
          }),
          T('fo-decompose', '수를 자리마다 몇 개로 나타내기', '①21', (d) => {
            // 0이 낀 수: 0인 자리가 빈칸에 든다
            const ds = uniq(d, 4), z = d.int(1, 3); ds[z] = 0;
            const n = toNum(ds), [i, j] = [z, d.pick([0, 1, 2, 3].filter((k) => k !== z))].sort((p, q) => p - q);
            const parts = UNITS.map((u, k) => `${josa(u, '이/가')} ${k === i ? box(LABELS[0]) : k === j ? box(LABELS[1]) : ds[k]}개`);
            return M('㉠, ㉡에 알맞은 수는?', both(ds[i], ds[j]), {
              figure: lines([`${josa(n, '은/는')} ${parts.join(', ')}인 수이다.`]), explain: `${n}의 ${KINDS[i]}의 자리 숫자는 ${ds[i]}, ${KINDS[j]}의 자리 숫자는 ${ds[j]}이다. ${josa(n, '은/는')} ${UNITS.map((u, k) => `${josa(u, '이/가')} ${ds[k]}개`).join(', ')}인 수이다.`,
              facts: { parts: [[dx(n, 3 - i), 0], [dx(n, 3 - j), 1]] }
            });
          }),
          T('fo-write', '읽은 말을 수로 쓰기', '①22', (d, i) => {
            // 차례: 0이 없는 수(백이나 십의 자리 숫자가 1이라 「백」「십」만 읽는다) / 0이 낀 수(0이 하나이거나 둘)
            const ds = d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
            if (i === 0) ds[d.int(1, 2)] = 1; else for (const z of d.pick([[1], [2], [3], [1, 2], [1, 3]])) ds[z] = 0;
            const n = toNum(ds), word = say(n);
            return N('다음을 수로 쓰면?', n, {
              figure: lines([word]), explain: i === 0 ? `${ds[1] === 1 ? '「백」은 100이 1개' : '「십」은 10이 1개'}라는 말이다. ${word}${tail(word, '을/를')} 수로 쓰면 ${n}이다.` : `읽지 않은 자리에는 0을 쓴다. ${word}${tail(word, '을/를')} 수로 쓰면 ${n}이다.`,
              facts: { rule: ['plain', 'zero'][i], big: { written: [[word, 0]] } }
            });
          }, { count: 2 }),
          T('fo-read', '네 자리 수를 읽은 말 고르기', '①23·24·25 심13', (d, i) => {
            // 차례: 0이 없는 수(숫자의 차례를 바꾸어 읽은 보기) / 0이 낀 수(0의 자리를 옮겨 읽은 보기)
            const ds = uniq(d, 4);
            if (i === 1) ds[d.int(1, 3)] = 0;
            const n = toNum(ds), list = d.shuffle([n].concat(d.shuffle(moves(n)).slice(0, 3)));
            return C(`${josa(n, '을/를')} 바르게 읽은 것은?`, list.map(say), list.indexOf(n), {
              explain: (i === 1 ? '숫자가 0인 자리는 읽지 않는다. ' : `${josa(n, '은/는')} ${bundles(ds)}이다. `) + `${josa(n, '은/는')} ${said(n)} 읽는다.`,
              facts: { rule: ['plain', 'zero'][i], big: { names: { value: n, given: String(n) } } }
            });
          }, { count: 2 }),
          T('fo-misread', '0이 낀 수를 잘못 읽은 것', '①26 심15', (d) => {
            // 네 수 모두 0이 끼어 있고 0의 자리가 서로 다르다. 틀린 줄은 0의 자리를 옮겨 읽었다(5809 — 오천팔십구).
            const tops = uniq(d, 4), kinds = d.shuffle([[1], [2], [3], d.pick([[1, 2], [1, 3], [2, 3]])]);
            const nums = kinds.map((zeros, k) => { const ds = [tops[k]].concat(uniq(d, 3)); zeros.forEach((z) => { ds[z] = 0; }); return toNum(ds); });
            const bad = d.int(0, 3), rows = nums.map((n, k) => [n, say(k === bad ? d.pick(moves(n)) : n)]);
            return C('수를 잘못 읽은 것은?', rows.map(([n, word]) => `${n} — ${word}`), bad, {
              explain: `${josa(rows[bad][0], '은/는')} ${said(rows[bad][0])} 읽는다. ${quoted(rows[bad][1], '은/는')} ${wordValue(rows[bad][1])}이다.`,
              facts: { claimed: rows.map(([n, word]) => [String(n), wordValue(word)]), claimedWant: false }
            });
          }),
          T('fo-odd', '나타내는 수가 다른 하나', '①27', (d) => {
            // 수, 읽는 말, 묶음, 자릿값의 합 가운데 하나만 다른 수이다. 다른 수는 한 자리를 빠뜨렸거나(1000이 4개, 10이 6개) 두 자리의 숫자를 바꾼 수이다.
            const [a, b, c] = uniq(d, 3), n = a * 1000 + b * 100 + c * 10, m = d.pick([a * 1000 + c * 10, a * 1000 + b * 100, a * 1000 + c * 100 + b * 10]);
            const forms = [String, say, (v) => bundles(digits4(v)), expanded], odd = d.int(0, 3), order = d.shuffle([0, 1, 2, 3]), rows = order.map((f) => forms[f](f === odd ? m : n)), at = order.indexOf(odd);
            return C('나타내는 수가 나머지와 다른 하나는?', rows, at, {
              explain: `수로 쓰면 차례로 ${order.map((f) => (f === odd ? m : n)).join(', ')}이다.`, facts: { rule: 'forms', big: { odd: rows.map(formExpr) } }
            });
          }),
          T('fo-over', '100이 열 개가 넘는 수', '①28', (d, i) => {
            // 차례: 100이 십몇 개인 수 / 1000이 몇 개, 100이 꼭 10개인 수
            if (i === 0) {
              const k = d.int(11, 19);
              return N(`100이 ${k}개인 수는?`, k * 100, { explain: `100이 10개이면 1000이다. 100이 ${k}개이면 1000이 1개, 100이 ${k - 10}개인 것과 같으므로 ${k * 100}이다.`, facts: { rule: 'over', calc: [[`100*${k}`, 0]] } });
            }
            const a = d.int(2, 8), text = bundles([a, 10, 0, 0]);
            return N(`${text}는?`, (a + 1) * 1000, { explain: `100이 10개이면 1000이다. 1000이 모두 ${a + 1}개이므로 ${(a + 1) * 1000}이다.`, facts: { calc: [[bundleExpr(text), 0]] } });
          }, { count: 2 }),
          T('fo-money', '지폐와 동전의 금액', '①29 심18', (d, i) => {
            // 차례: 지폐·100원·10원이 모두 있는 돈(일의 자리에 0) / 100원짜리가 없는 돈(백의 자리와 일의 자리에 0). 한 그림의 돈은 모두 20개를 넘지 않는다.
            const a = d.int(2, 4), b = i === 0 ? d.int(1, 8) : 0, c = d.int(1, 8), n = a * 1000 + b * 100 + c * 10;
            return N('돈은 모두 얼마인가?', n, {
              unit: '원', figure: money(a, b, c),
              explain: i === 0 ? `1000원짜리 ${a}장은 ${a * 1000}원, 100원짜리 ${b}개는 ${b * 100}원, 10원짜리 ${c}개는 ${c * 10}원이다. 모두 ${n}원이다.` : `1000원짜리 ${a}장은 ${a * 1000}원, 10원짜리 ${c}개는 ${c * 10}원이다. 100원짜리가 없으므로 백의 자리에 0을 쓴다. 모두 ${n}원이다.`,
              facts: { rule: ['coins', 'gap'][i], calc: [[`1000*${a}` + (b ? `+100*${b}` : '') + `+10*${c}`, 0]] }
            });
          }, { count: 2 }),
          T('fo-word', '1000·100·10씩 묶은 물건의 수', '심18', (d) => {
            const [what, unit] = d.pick([['구슬', '개'], ['단추', '개'], ['공책', '권']]), [a, b, c] = uniq(d, 3), n = a * 1000 + b * 100 + c * 10;
            return N(`${josa(what, '이/가')} 1000${unit}씩 ${a}상자, 100${unit}씩 ${b}봉지, 10${unit}씩 ${c}묶음 있다. ${josa(what, '은/는')} 모두 몇 ${unit}인가?`, n, {
              unit, explain: `1000이 ${a}개, 100이 ${b}개, 10이 ${c}개인 수이다. 낱개가 없으므로 일의 자리에 0을 쓴다. ${n}이다.`, facts: { calc: [[`1000*${a}+100*${b}+10*${c}`, 0]] }
            });
          }),
          T('fo-find', '네 자리 수 찾기', '심14', (d) => {
            // 0이 낀 네 자리 수(1004, 2000)와 숫자가 큰 세 자리 수(987)를 섞는다
            const k = d.int(2, 4), [a, b, c, e] = uniq(d, 4);
            const four = d.shuffle([a * 1000 + d.int(1, 9), b * 1000, c * 1000 + d.int(1, 9) * 100 + d.int(11, 99), e * 1000 + d.int(1, 9) * 10]).slice(0, k);
            const rest = d.shuffle([900 + d.int(11, 99), d.int(1, 8) * 100 + d.int(1, 9), d.int(11, 99), d.int(1, 9) * 100, 990 + d.int(1, 9)]).slice(0, 6 - k), vals = d.shuffle(four.concat(rest));
            return N('네 자리 수는 모두 몇 개인가?', k, {
              unit: '개', figure: numbers(vals), explain: `네 자리 수는 천의 자리까지 있는 수이다. ${vals.filter((v) => String(v).length === 4).join(', ')}${after(String(vals.filter((v) => String(v).length === 4).pop()), '으로/로')} ${k}개이다.`,
              facts: { calc: [[vals.map((v) => `(1-0**((${v}-${v}%1000)/1000))`).join('+'), 0]], unseen: [0, 1, 1000] }
            });
          })
        ]
      },
      {
        id: 'place', title: '각 자리의 숫자가 나타내는 값', standard: NUM,
        types: [
          T('pl-table', '자리 표의 빈칸', '①30', (d) => {
            const ds = uniq(d, 4), n = toNum(ds), shown = d.int(0, 3), blanks = [0, 1, 2, 3].filter((k) => k !== shown);
            return M(`${josa(n, '을/를')} 표로 나타내었다. ㉠, ㉡, ㉢에 알맞은 수는?`, blanks.map((k, j) => ({ label: LABELS[j], answer: ds[k] * UNITS[k] })), {
              figure: table(['자리', '숫자', '나타내는 값'], ds.map((v, k) => [`${KINDS[k]}의 자리`, v, k === shown ? v * UNITS[k] : box(LABELS[blanks.indexOf(k)])])),
              explain: `${n} = ${expanded(n)}`, facts: { calc: blanks.map((k, j) => [vx(n, 3 - k), j]), unseen: [1000, 100, 10, 1] }
            });
          }),
          T('pl-digit-value', '자리의 숫자와 그 숫자가 나타내는 값', '①31 심22', (d) => {
            // 0이 낀 수에서 0이 아닌 자리를 묻는다(자리를 하나씩 짚어야 한다)
            const ds = uniq(d, 4), z = d.int(1, 3); ds[z] = 0;
            const n = toNum(ds), k = d.pick([0, 1, 2, 3].filter((p) => p !== 3 - z)), t = digitAt(n, k);
            return M(`${n}에서 ${PLACES[k]}의 자리 숫자와 그 숫자가 나타내는 값은?`, [{ label: '숫자', answer: t }, { label: '나타내는 값', answer: t * pow(k) }], {
              explain: `${PLACES[k]}의 자리 숫자는 ${t}이고 ${josa(t * pow(k), '을/를')} 나타낸다.`, facts: { calc: [[dx(n, k), 0], [vx(n, k), 1]], unseen: [pow(k), 10] }
            });
          }),
          T('pl-value', '숫자가 나타내는 값', '①32 심22', (d) => {
            const n = toNum(uniq(d, 4)), k = d.int(1, 3), t = digitAt(n, k);
            return N(`${n}에서 숫자 ${josa(t, '이/가')} 나타내는 값은?`, t * pow(k), { explain: `숫자 ${josa(t, '은/는')} ${PLACES[k]}의 자리 숫자이므로 ${josa(t * pow(k), '을/를')} 나타낸다.`, facts: { calc: [[vx(n, k), 0]], unseen: [pow(k), 10] } });
          }),
          T('pl-same-two', '같은 숫자가 자리에 따라 나타내는 값', '①32·40', (d) => {
            const t = d.int(2, 9), [hi, lo] = d.pick([[3, 1], [3, 0], [2, 0], [3, 2], [2, 1], [1, 0]]), rest = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== t)), n = toNum([3, 2, 1, 0].map((k) => (k === hi || k === lo ? t : rest.pop())));
            return M(`${n}에서 ㉠과 ㉡이 나타내는 값은?`, both(t * pow(hi), t * pow(lo)), {
              figure: marked(n, [3, 2, 1, 0].map((k) => (k === hi ? LABELS[0] : k === lo ? LABELS[1] : ''))),
              explain: `㉠은 ${PLACES[hi]}의 자리 숫자이므로 ${josa(t * pow(hi), '을/를')}, ㉡은 ${PLACES[lo]}의 자리 숫자이므로 ${josa(t * pow(lo), '을/를')} 나타낸다. 같은 숫자라도 자리에 따라 나타내는 값이 다르다.`,
              facts: { calc: [[vx(n, hi), 0], [vx(n, lo), 1]], unseen: [pow(hi), pow(lo), 10] }
            });
          }),
          T('pl-expand', '자릿값의 합으로 나타내기', '①33', (d) => {
            const ds = uniq(d, 4), n = toNum(ds), [i, j] = d.pick([[1, 2], [0, 2], [1, 3], [2, 3], [0, 3], [0, 1]]);
            return M('㉠, ㉡에 알맞은 수는?', both(ds[i] * UNITS[i], ds[j] * UNITS[j]), {
              figure: lines([`${n} = ${UNITS.map((u, k) => (k === i ? box(LABELS[0]) : k === j ? box(LABELS[1]) : ds[k] * u)).join(' + ')}`]),
              explain: `${bundles(ds)}이다. ${n} = ${expanded(n)}`, facts: { calc: [[vx(n, 3 - i), 0], [vx(n, 3 - j), 1]], unseen: [1000, 100, 10, 1] }
            });
          }),
          T('pl-expand-zero', '0이 낀 수를 자릿값의 합으로 나타내기', '①33 심23', (d) => {
            // 0인 자리는 식에서 빠져 더하는 수가 셋이다
            const ds = uniq(d, 4), z = d.int(1, 3); ds[z] = 0;
            const n = toNum(ds), terms = [0, 1, 2, 3].filter((k) => k !== z), [i, j] = d.pick([[terms[0], terms[1]], [terms[1], terms[2]], [terms[0], terms[2]]]);
            return M('㉠, ㉡에 알맞은 수는?', both(ds[i] * UNITS[i], ds[j] * UNITS[j]), {
              figure: lines([`${n} = ${terms.map((k) => (k === i ? box(LABELS[0]) : k === j ? box(LABELS[1]) : ds[k] * UNITS[k])).join(' + ')}`]),
              explain: `${KINDS[z]}의 자리 숫자가 0이므로 더하는 수는 셋이다. ${n} = ${expanded(n)}`, facts: { calc: [[vx(n, 3 - i), 0], [vx(n, 3 - j), 1]], unseen: [1000, 100, 10, 1] }
            });
          }),
          T('pl-value-find', '숫자가 주어진 값을 나타내는 수 고르기', '①34', (d) => {
            const t = d.int(1, 9), places = d.shuffle([0, 1, 2, 3]), k = d.int(1, 2), list = places.map((p) => withDigit(d, t, p));
            return C(`숫자 ${josa(t, '이/가')} ${josa(t * pow(k), '을/를')} 나타내는 수는?`, list.map(String), places.indexOf(k), {
              explain: `숫자 ${josa(t, '이/가')} ${PLACES[k]}의 자리에 있으면 ${josa(t * pow(k), '을/를')} 나타낸다. ${list[places.indexOf(k)]}의 ${PLACES[k]}의 자리 숫자가 ${t}이다.`,
              facts: { choose: { exprs: list.map((n) => vx(n, k)), rule: 'equals', target: t * pow(k) }, unseen: [pow(k), 10] }
            });
          }),
          T('pl-value-size', '같은 숫자가 나타내는 값이 가장 큰(작은) 수', '①35 심26', (d) => {
            const t = d.int(1, 9), places = d.shuffle([0, 1, 2, 3]), list = places.map((p) => withDigit(d, t, p)), big = d.bool(), want = big ? 3 : 0;
            return C(`숫자 ${josa(t, '이/가')} 나타내는 값이 가장 ${big ? '큰' : '작은'} 수는?`, list.map(String), places.indexOf(want), {
              explain: `숫자 ${josa(t, '이/가')} 나타내는 값은 차례로 ${places.map((p) => t * pow(p)).join(', ')}이다. 숫자 ${josa(t, '이/가')} ${PLACES[want]}의 자리에 있는 ${josa(list[places.indexOf(want)], '이/가')} 답이다.`,
              facts: { rule: 'numbers', choose: { exprs: list.map((n, i) => vx(n, places[i])), rule: big ? 'max' : 'min' }, unseen: [1000, 100, 10, 1] }
            });
          }),
          T('pl-same-value', '같은 숫자가 같은 값을 나타내는 수', '①37', (d) => {
            const t = d.int(1, 9), k = d.int(0, 3), n = withDigit(d, t, k), places = d.shuffle([0, 1, 2, 3]), list = places.map((p) => d.until(() => withDigit(d, t, p), (v) => v !== n));
            return C(`숫자 ${josa(t, '이/가')} ${n}에서와 같은 값을 나타내는 수는?`, list.map(String), places.indexOf(k), {
              explain: `${n}에서 숫자 ${josa(t, '은/는')} ${PLACES[k]}의 자리 숫자이므로 ${josa(t * pow(k), '을/를')} 나타낸다. ${list[places.indexOf(k)]}에서도 숫자 ${josa(t, '은/는')} ${PLACES[k]}의 자리 숫자이다.`,
              facts: { choose: { exprs: list.map((v, i) => vx(v, places[i])), rule: 'equals', target: t * pow(k) }, unseen: [1000, 100, 10, 1] }
            });
          }),
          T('pl-cond', '자리 숫자로 설명한 수', '①38', (d) => {
            // 자리의 차례를 섞어 말한다. 한 자리의 숫자는 0이다.
            const ds = uniq(d, 4), z = d.int(1, 3); ds[z] = 0;
            const n = toNum(ds), order = d.until(() => d.shuffle([0, 1, 2, 3]), (o) => o.join() !== '0,1,2,3');
            return N('다음에서 설명하는 네 자리 수는?', n, {
              figure: lines(order.map((k) => `${KINDS[k]}의 자리 숫자는 ${ds[k]}이다.`)), explain: `천의 자리부터 차례로 쓰면 ${ds.join(', ')}이다. ${n}이다.`,
              facts: { calc: [[ds.map((v, k) => (v ? `${v}*${UNITS[k]}` : '')).filter(Boolean).join('+'), 0]], unseen: [1000, 100, 10, 1] }
            });
          }),
          T('pl-zero', '어느 자리 숫자가 0인 수', '①39 심24', (d, i) => {
            // 차례: 수로 적은 보기 / 읽는 말로 적은 보기(수로 바꾸어야 0의 자리가 보인다). 네 수 모두 0이 있고 0의 자리가 서로 다르다.
            const k = d.int(0, 2), others = [0, 1, 2].filter((p) => p !== k), tops = uniq(d, 4);
            const list = d.shuffle([[k], [others[0]], [others[1]], others]).map((zeros, j) => { const ds = [tops[j]].concat(uniq(d, 3)); zeros.forEach((p) => { ds[3 - p] = 0; }); return toNum(ds); });
            const options = list.map((v) => (i === 0 ? String(v) : say(v))), values = options.map((o) => (i === 0 ? Number(o) : wordValue(o))), at = values.findIndex((v) => digitAt(v, k) === 0);
            return C(`${PLACES[k]}의 자리 숫자가 0인 수는?`, options, at, {
              explain: (i === 0 ? '' : `수로 쓰면 차례로 ${values.join(', ')}이다. `) + `${values[at]}의 ${PLACES[k]}의 자리 숫자가 0이다.`,
              facts: i === 0 ? { rule: 'numbers', choose: { exprs: values.map((v) => `(${dx(v, k)})+1`), rule: 'equals', target: 1 }, unseen: [pow(k), 10, 1] } : { rule: 'words', claimed: values.map((v) => [`(${dx(v, k)})+1`, 1]), claimedWant: true }
            });
          }, { count: 2 }),
          T('pl-say', '네 자리 수에 대한 설명', '①40', (d) => {
            // 같은 숫자가 두 자리에 있는 수: 틀린 설명은 그 숫자가 나타내는 값을 다른 자리의 값으로 말한다(8997의 십의 자리 숫자 9는 900을 나타낸다)
            const t = d.int(2, 9), [p, q] = d.shuffle(d.pick([[2, 1], [3, 2], [2, 0], [3, 1], [1, 0]])), rest = [3, 2, 1, 0].filter((k) => k !== p && k !== q);
            const [x, y] = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== t)), n = t * pow(p) + t * pow(q) + x * pow(rest[0]) + y * pow(rest[1]);
            const rows = d.shuffle([`${PLACES[rest[0]]}의 자리 숫자는 ${x}이다.`, `${PLACES[p]}의 자리 숫자 ${josa(t, '은/는')} ${josa(t * pow(p), '을/를')} 나타낸다.`, `${PLACES[q]}의 자리 숫자 ${josa(t, '은/는')} ${josa(t * pow(p), '을/를')} 나타낸다.`, `${PLACES[rest[1]]}의 자리 숫자 ${josa(y, '은/는')} ${josa(y * pow(rest[1]), '을/를')} 나타낸다.`]);
            // 설명을 다시 읽어 참·거짓을 가린다
            const truth = rows.map((row) => { const m = row.match(/^(천|백|십|일)의 자리 숫자(?:는 (\d)이다| (\d)[은는] (\d+)[을를] 나타낸다)\.$/), k = PLACES.indexOf(m[1]); return m[2] ? digitAt(n, k) === Number(m[2]) : digitAt(n, k) === Number(m[3]) && Number(m[3]) * pow(k) === Number(m[4]); });
            return C(`${n}에 대한 설명으로 틀린 것은?`, rows, truth.indexOf(false), { explain: `${PLACES[q]}의 자리 숫자 ${josa(t, '은/는')} ${josa(t * pow(q), '을/를')} 나타낸다. 같은 숫자라도 자리에 따라 나타내는 값이 다르다.`, facts: { truth, want: false } });
          }),
          T('pl-digit-max', '한 자리의 숫자가 가장 큰 수', '심25', (d) => {
            // 수의 크기가 아니라 그 자리의 숫자만 본다: 그 자리 숫자가 가장 큰 수는 천의 자리 숫자가 가장 작다
            const k = d.int(1, 2), digs = uniq(d, 4).sort((x, y) => y - x), tops = uniq(d, 4).sort((x, y) => x - y);
            const list = d.shuffle(digs.map((v, j) => { const ds = [tops[j], d.int(0, 9), d.int(0, 9), d.int(0, 9)]; ds[3 - k] = v; return toNum(ds); })), shown = list.map((v) => digitAt(v, k));
            return C(`${PLACES[k]}의 자리 숫자가 가장 큰 수는?`, list.map(String), shown.indexOf(Math.max(...shown)), {
              explain: `${PLACES[k]}의 자리 숫자는 차례로 ${shown.join(', ')}이다. 수의 크기가 아니라 ${PLACES[k]}의 자리 숫자만 비교한다.`, facts: { choose: { exprs: list.map((v) => dx(v, k)), rule: 'max' }, unseen: [pow(k), 10] }
            });
          })
        ]
      },
      // 아래 세 묶음의 문항은 2-2-1b.js가 채운다.
      { id: 'skip', title: '뛰어 세기', standard: ORDER, types: [] },
      { id: 'compare', title: '수의 크기 비교', standard: ORDER, types: [] },
      { id: 'cards', title: '수 카드로 수 만들기', standard: ORDER, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
