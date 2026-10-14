// 2학년 2학기 4단원 시각과 시간 — 단원 틀, 그림 도구(시계·시간 띠·하루 시간 띠·달력), 기본 문항(몇 시 몇 분 읽기, 몇 시 몇 분 전).
// 수집해 둔 평가 자료(미래엔·아이스크림미디어·천재, 기본 27개 문서와 심화 5개 문서)에서 뽑은 꼴 목록(기본꼴 66, 심화꼴 52)을
// 번호마다 따져 실었다. 꼴(무엇을 주고 무엇을 묻는가)만 가져오고 시각·상황·문장은 새로 만들었다.
// (1시간과 걸린 시간·하루의 시간은 2-2-4b.js, 달력과 실력 문항은 2-2-4c.js. 대조표는 수집본의 _분석/2-2-4/싣기_대조표.md)
//
// 영역과 성취기준 — 도형과 측정 가운데 측정
//  - [2수03-07] 시계를 보고 시각을 '몇 시 몇 분'까지 읽을 수 있다.
//  - [2수03-08] 1시간과 1분의 관계를 이해하고, 시간을 '시간', '분'으로 표현할 수 있다.
//  - [2수03-09] 실생활 문제 상황과 연결하여 1분, 1시간, 1일, 1주일, 1개월, 1년 사이의 관계를 이해한다.
//  - 교육과정의 금
//    「'몇 시 몇 분 전'의 시각 읽기에서 5분 전, 10분 전과 같이 간단한 경우를 다루고, 13분 전과 같이 복잡한 경우는 다루지 않는다」
//      → 긴바늘이 숫자를 가리키는 「5분 전」「10분 전」「15분 전」을 싣는다(15분 전은 긴바늘이 9를 가리켜 5분 전·10분 전과 같은 간단한 경우이고,
//        수집본에도 다섯 문서에 나온다). 긴바늘이 숫자 사이의 작은 눈금에 있는 것(13분 전, 7분 전)과 20분 전·40분 전은 싣지 않는다.
//    「시간의 여러 가지 단위를 지도할 때는 실생활 장면과 연결하여 다루고, 지나친 단위 환산은 다루지 않는다」
//      → 시간·분은 3시간 안쪽, 일·시간은 2일 안쪽, 주일·일은 3주일 안쪽, 년·개월은 3년 안쪽에서만 바꾼다.
//    초와 시간의 덧셈·뺄셈 세로셈은 3학년 내용이다. 걸린 시간은 시계 두 개나 시간 띠를 보고 구하고, 풀이도 나누어 세어 적는다.
//    답으로 한글을 적게 하지 않는다(시·분은 숫자 칸으로, 요일과 오전·오후는 고르기로).
//
// 싣는 기준
//  - 시계 그림에는 숫자 12개와 작은 눈금 60개를 모두 그린다. 그림 설명(aria-label)에는 시각이 아니라 바늘이 있는 곳을 적는다
//    (「짧은바늘은 2와 3 사이에 있고, 긴바늘은 9를 가리킨다」). 두 바늘이 겹치거나 붙어 보이는 시각은 쓰지 않는다.
//    (geometry.js 의 clock 은 작은 눈금을 초바늘이 있을 때만 그리고 그림 설명에 시각을 그대로 적어, 이 단원에서는 따로 그린다.)
//  - 한 문항에 시계는 넷까지, 휴대폰 너비에서 두 개씩 놓이게 그린다.
//  - 주는 것(시계·글·표)과 묻는 것(시각·바늘의 자리·고르기)이 다르면 다른 문제로 싣고, 시각만 다른 것은 한 번만 싣는다.
//  - 시계에서 고르는 기본 문항(read-pick, read-words-pick)은 짧은바늘이 두 숫자의 가운데쯤에 오는 시각(10분 ~ 48분)으로 낸다.
//    짧은바늘이 다음 숫자에 거의 닿은 시각의 시계를 가리는 일은 실력 문항(h-near-pick)이 맡는다.
//  - 한 회차에 같이 나오는 두 문항이 서로 답을 알려 주지 않게, 서로 거꾸로인 문항(숫자 → 분과 분 → 숫자)은 수의 범위를 갈랐다.
//
// 뺀 것과 까닭(이 파일의 두 묶음)
//  - 같은 시각끼리 잇기(①11·19 심7): 긋기. 시계 셋과 시각 셋을 짝 짓는 고르기(read-match)로 바꾸어 한 번 실었다.
//  - 시계에 바늘 그리기(①12·18 심8·12): 그리기. 「바늘이 가리켜야 하는 곳」을 수로 물었다(read-place, read-draw, before-hand).
//  - 잘못 읽은 까닭 쓰기(①13 ①21의 고쳐 쓰기): 서술형. 바른 시각만 물었다(read-fix).
//  - 20분 전·40분 전(①15의 변형)과 긴바늘이 숫자 사이에 있는 「몇 분 전」: 교육과정이 다루지 않는다고 한 복잡한 경우이고 수집본에도 거의 없다.
//    「전」으로 읽는 유형은 모두 5분 전·10분 전·15분 전 가운데에서 낸다(①15·17·18·21과 심12·15의 15분 전 변형도 여기에 든다).
//  - 거울에 비친 시계(심10): 뒤집힌 그림을 읽는 일은 이 단원의 내용이 아니다.
//  - 바늘 시계와 전자시계(「1:50」) 잇기(①19의 변형): 전자시계를 그릴 도구가 없어 미루었다.
// 묻는 말: 값을 물으면 「~은?」, 양을 물으면 「몇 ~인가?」. 문장은 짧게, 한 문장에 한 가지만.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, lines, tagged, table, N, M, C } = B.kit;
  const G = B.kit.geo;
  const READ = '2수03-07', SPAN = '2수03-08', UNITS = '2수03-09';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const TAGS = ['가', '나', '다', '라'];
  const PERMS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const RAD = Math.PI / 180, r2 = (n) => Math.round(n * 100) / 100;

  // ── 시각과 시간을 적는 글 ─────────────────────────────────────
  const next = (h) => (h % 12) + 1, prev = (h) => (h === 1 ? 12 : h - 1);
  const at = (h, m) => h + '시' + (m ? ' ' + m + '분' : '');
  const span = (min) => [min >= 60 ? Math.floor(min / 60) + '시간' : '', min % 60 ? (min % 60) + '분' : ''].filter(Boolean).join(' ');
  // 검사가 다시 셈하는 식: 시각을 분으로(3시 20분 → (3*60+20))
  const mins = (h, m) => (m ? `(${h}*60+${m})` : `${h}*60`);
  // 긴바늘이 가리키는 숫자(5분 → 1, 60분·0분 → 12)
  const numOf = (m) => Math.floor(m / 5) || 12;
  // 두 바늘 사이의 각(도). 22도보다 좁으면 겹치거나 붙어 보인다.
  const gap = (h, m) => { const g = Math.abs((h % 12) * 30 + m * 0.5 - m * 6) % 360; return Math.min(g, 360 - g); };
  const clear = (h, m) => gap(h, m) >= 22;
  // 바늘이 있는 곳을 말로
  const longAt = (m) => (m % 5 ? `${numOf(m)}에서 작은 눈금 ${m % 5}칸 더 간 곳을` : josa(numOf(m), '을/를'));
  const shortAt = (h, m) => (m ? `${josa(h, '과/와')} ${next(h)} 사이에 있고` : `${josa(h, '을/를')} 가리키고`);
  const why = (h, m) => `짧은바늘이 ${shortAt(h, m)} 긴바늘이 ${longAt(m)} 가리키므로 ${at(h, m)}이다.`;

  // ── 시계 ─────────────────────────────────────────────────────
  // 숫자 12개와 작은 눈금 60개를 그린다. 긴바늘은 눈금까지 뻗고, 숫자는 바늘 위에 흰 테두리를 둘러 적어 가려지지 않게 한다.
  // 그림 설명에는 시각이 아니라 두 바늘이 있는 곳을 적는다(시각을 묻는 문항에서 답을 적어 주지 않으려고).
  const BIG = 164;
  function clock(h, m, width) {
    const R = 46, c = 54, polar = (deg, r) => [c + r * Math.sin(deg * RAD), c - r * Math.cos(deg * RAD)];
    const ln = (cls, p, q, style) => `<line class="${cls}"${style ? ` style="${style}"` : ''} x1="${r2(p[0])}" y1="${r2(p[1])}" x2="${r2(q[0])}" y2="${r2(q[1])}"/>`;
    let ticks = '', numbers = '';
    for (let i = 0; i < 60; i += 1) ticks += i % 5 === 0 ? ln('mb-tick', polar(i * 6, R - 0.8), polar(i * 6, R - 5.8)) : ln('mb-tick mb-tick-small', polar(i * 6, R - 0.8), polar(i * 6, R - 3.6), 'stroke-width:0.8');
    for (let n = 1; n <= 12; n += 1) {
      const p = polar(n * 30, R - 14.2);
      numbers += `<text class="mb-clock-number" style="font-size:9.4px;paint-order:stroke;stroke:#fff;stroke-width:2.4px;stroke-linejoin:round" x="${r2(p[0])}" y="${r2(p[1])}" text-anchor="middle" dominant-baseline="central">${n}</text>`;
    }
    const long = polar(m * 6, R - 6.6), short = polar((h % 12) * 30 + m * 0.5, R - 27);
    return `<svg class="mb-clock" viewBox="0 0 108 108" width="${width || 118}" role="img" aria-label="시계: 짧은바늘은 ${shortAt(h, m)}, 긴바늘은 ${longAt(m)} 가리킨다"><circle class="mb-clock-face" cx="54" cy="54" r="46"/>${ticks}`
      + ln('mb-hand-hour', [c, c], short, 'stroke-width:3.2') + ln('mb-hand-minute', [c, c], long, 'stroke-width:1.8') + numbers + '<circle class="mb-clock-pin" cx="54" cy="54" r="2.4"/></svg>';
  }

  // ── 시간 띠 ──────────────────────────────────────────────────
  // 작은 칸 하나가 10분이다. fromHour 시부터 hours 시간을 그리고, first 번째 칸(0부터 센다)부터 n칸을 색칠한다.
  function strip(fromHour, hours, first, n) {
    const cells = hours * 6, u = Math.min(20, 252 / cells), x0 = 17, y0 = 8, tall = 22, W = x0 * 2 + cells * u;
    let out = '';
    for (let i = 0; i < cells; i += 1) out += `<rect x="${r2(x0 + i * u)}" y="${y0}" width="${r2(u)}" height="${tall}" style="fill:${i >= first && i < first + n ? '#fdba74' : '#fff'};stroke:#1f2933;stroke-width:0.9"/>`;
    for (let k = 0; k <= hours; k += 1) {
      const x = r2(x0 + k * 6 * u);
      out += `<line x1="${x}" y1="${y0 - 4}" x2="${x}" y2="${y0 + tall + 5}" style="stroke:#1f2933;stroke-width:1.9"/><text class="mb-axis-label" style="font-size:13px;font-weight:700" x="${x}" y="${y0 + tall + 20}" text-anchor="middle">${((fromHour + k - 1) % 12) + 1}시</text>`;
    }
    return `<svg class="mb-numberline" viewBox="0 0 ${r2(W)} 58" width="${Math.round(W)}" role="img" aria-label="시간 띠: 작은 칸 하나는 10분. ${fromHour}시부터 ${((fromHour + hours - 1) % 12) + 1}시까지 그렸다. ${fromHour}시에서 ${first}칸 간 곳부터 ${n}칸을 색칠했다">${out}</svg>`;
  }

  // ── 하루 시간 띠 ─────────────────────────────────────────────
  // 윗줄은 오전, 아랫줄은 오후이고 한 칸은 1시간이다. 오전 from 시부터 오후 to 시까지 색칠한다.
  function dayStrip(from, to) {
    const u = 19, x0 = 38, tall = 17, W = x0 + 12 * u + 14;
    const row = (y, label, on) => {
      let out = `<text class="mb-axis-label" style="font-size:12px;font-weight:700" x="4" y="${y + 12.5}">${label}</text>`;
      for (let i = 0; i < 12; i += 1) out += `<rect x="${x0 + i * u}" y="${y}" width="${u}" height="${tall}" style="fill:${on(i) ? '#fdba74' : '#fff'};stroke:#1f2933;stroke-width:0.9"/>`;
      for (let i = 0; i <= 12; i += 1) out += `<text class="mb-axis-label" style="font-size:11px;font-weight:600" x="${x0 + i * u}" y="${y + tall + 12.5}" text-anchor="middle">${i === 0 ? 12 : i}</text>`;
      return out;
    };
    return `<svg class="mb-numberline" viewBox="0 0 ${W} 86" width="${W}" role="img" aria-label="하루 시간 띠: 윗줄은 오전, 아랫줄은 오후이고 한 칸은 1시간이다. 윗줄은 눈금 ${from}부터 끝까지, 아랫줄은 처음부터 눈금 ${to}까지 색칠했다">`
      + row(6, '오전', (i) => i >= from) + row(48, '오후', (i) => i < to) + '</svg>';
  }

  // ── 달력 ─────────────────────────────────────────────────────
  // 달마다의 날수(2월은 28일로 다룬다)
  const DAYS_IN = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const WEEK = ['일', '월', '화', '수', '목', '금', '토'];
  const ORD = ['첫째', '둘째', '셋째', '넷째'];
  // first: 1일의 요일(0 = 일요일). 날짜 day 의 요일
  const weekdayOf = (first, day) => (first + day - 1) % 7;
  // rows 를 주면 위에서부터 그만큼의 줄만 그린다(아랫부분이 보이지 않는 달력).
  function calendar(month, first, rows) {
    const cells = Array(first).fill('').concat(Array.from({ length: DAYS_IN[month] }, (_, i) => String(i + 1)));
    while (cells.length % 7) cells.push('');
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    const cell = 'style="padding:4px 0;width:36px;min-width:36px"';
    return `<div class="mb-table-wrap"><table class="mb-table" aria-label="${month}월 달력${rows ? '의 윗부분' : ''}"><thead><tr><th colspan="7">${month}월</th></tr><tr>${WEEK.map((w) => `<th ${cell}>${w}</th>`).join('')}</tr></thead><tbody>`
      + (rows ? weeks.slice(0, rows) : weeks).map((week) => '<tr>' + week.map((v) => `<td ${cell}>${v}</td>`).join('') + '</tr>').join('') + '</tbody></table></div>';
  }
  // 요일 보기 넷: 답이 든 이어진 네 요일
  function weekdayOptions(d, w) {
    const start = (w - d.int(0, 3) + 7) % 7, list = [0, 1, 2, 3].map((i) => (start + i) % 7);
    return { options: list.map((x) => WEEK[x] + '요일'), answer: list.indexOf(w), list };
  }

  // 여럿을 고르는 문제의 보기: 맞는 묶음 하나와, 거기서 하나를 빼거나 더하거나 바꾼 틀린 묶음 셋
  function setOptions(d, labels, flags) {
    const key = (list) => list.join(', ');
    const right = labels.filter((_, i) => flags[i]);
    const pool = [];
    labels.forEach((_, i) => { const flipped = labels.filter((__, j) => (j === i ? !flags[j] : flags[j])); if (flipped.length) pool.push(flipped); });
    labels.forEach((_, i) => labels.forEach((__, j) => { if (flags[i] && !flags[j]) pool.push(labels.filter((___, k) => (k === i ? false : k === j ? true : flags[k]))); }));
    const out = [right], seen = new Set([key(right)]);
    for (const cand of d.shuffle(pool)) { if (out.length === 4) break; if (!seen.has(key(cand))) { seen.add(key(cand)); out.push(cand); } }
    const list = d.shuffle(out);
    return { options: list.map(key), answer: list.findIndex((o) => key(o) === key(right)), sets: list };
  }

  // 시계 여럿을 한 문항에 그릴 때: 모두 바늘이 또렷하고 서로 다른 시각이어야 한다.
  const value = ([h, m]) => h * 60 + m;
  const allClear = (list) => list.every(([h, m]) => m >= 0 && m <= 59 && h >= 1 && h <= 12 && clear(h, m)) && new Set(list.map(value)).size === list.length;

  // 같은 단원의 다른 파일이 쓰는 도구
  B.kit.g224 = { READ, SPAN, UNITS, TAGS, PERMS, next, prev, at, span, mins, numOf, gap, clear, longAt, shortAt, why, BIG, clock, strip, dayStrip, DAYS_IN, WEEK, ORD, weekdayOf, calendar, weekdayOptions, setOptions, value, allClear };

  B.addUnit({
    id: '2-2-4', grade: 2, semester: 2, no: 4, title: '시각과 시간', version: 1,
    groups: [
      {
        id: 'read', title: '몇 시 몇 분 읽기', standard: READ,
        types: [
          T('read-num-min', '긴바늘이 가리키는 숫자와 분', '①1 심1', (d) => {
            const k = d.int(6, 11);
            return N(`시계의 긴바늘이 숫자 ${josa(k, '을/를')} 가리키면 몇 분을 나타내는가?`, k * 5, {
              unit: '분', explain: `긴바늘이 가리키는 숫자가 1씩 커질 때마다 5분씩 늘어난다. 5씩 ${k}번 뛰어 세면 ${k * 5}분이다.`, facts: { calc: [[`${k}*5`, 0]], unseen: [5] }
            });
          }),
          T('read-min-num', '분을 나타내는 긴바늘의 자리', '①1 심1', (d) => {
            const k = d.int(2, 5);
            return N(`시계의 긴바늘이 ${k * 5}분을 나타낼 때 가리키는 숫자는?`, k, {
              explain: `5분, 10분, 15분처럼 5씩 뛰어 세면 ${k}번째가 ${k * 5}분이다. 긴바늘은 숫자 ${josa(k, '을/를')} 가리킨다.`, facts: { calc: [[`${k * 5}/5`, 0]], unseen: [5] }
            });
          }),
          T('read-ticks', '숫자 눈금 한 칸과 작은 눈금 한 칸', '①3', (d) => {
            const a = d.int(2, 10);
            return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: 5 }, { label: LABELS[1], answer: 1 }], {
              figure: lines([`긴바늘이 숫자 ${a}에서 ${a + 1}까지 가면 ${box(LABELS[0])}분이 지난다.`, `긴바늘이 작은 눈금 한 칸을 가면 ${box(LABELS[1])}분이 지난다.`]),
              explain: '시계의 숫자와 숫자 사이는 작은 눈금 5칸이다. 작은 눈금 한 칸은 1분이고, 숫자 한 칸은 5분이다.', facts: { calc: [['5', 0], ['1', 1]], unseen: [5, 1] }
            });
          }),
          T('read-table', '긴바늘이 가리키는 숫자와 분의 표', '①2', (d) => {
            // 둘째 줄과 넷째 줄은 분을, 셋째 줄은 숫자를 가린다.
            const ks = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).slice(0, 4).sort((x, y) => x - y);
            return M('긴바늘이 가리키는 숫자와 그때의 분을 표로 나타냈다. ㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: ks[1] * 5 }, { label: LABELS[1], answer: ks[2] }, { label: LABELS[2], answer: ks[3] * 5 }], {
              figure: table(['긴바늘이 가리키는 숫자', '분'], [[ks[0], ks[0] * 5], [ks[1], box(LABELS[0])], [box(LABELS[1]), ks[2] * 5], [ks[3], box(LABELS[2])]]),
              explain: `숫자가 1씩 커질 때마다 5분씩 늘어난다. 숫자 ${josa(ks[1], '은/는')} ${ks[1] * 5}분, ${ks[2] * 5}분은 숫자 ${ks[2]}, 숫자 ${josa(ks[3], '은/는')} ${ks[3] * 5}분이다.`,
              facts: { calc: [[`${ks[1]}*5`, 0], [`${ks[2] * 5}/5`, 1], [`${ks[3]}*5`, 2]], unseen: [5] }
            });
          }),
          T('read-see', '시계에서 두 바늘이 있는 곳 읽기', '①4 심2', (d) => {
            const [h, m] = d.until(() => [d.int(1, 11), d.int(2, 9) * 5], ([x, y]) => clear(x, y));
            return M('시계를 보고 ㉠, ㉡, ㉢에 알맞은 수를 구하시오. (㉠은 ㉡보다 작다.)', [{ label: LABELS[0], answer: h }, { label: LABELS[1], answer: h + 1 }, { label: LABELS[2], answer: m / 5 }], {
              figure: clock(h, m, BIG) + lines([`짧은바늘은 ${box(LABELS[0])}과 ${box(LABELS[1])} 사이에 있다.`, `긴바늘은 ${box(LABELS[2])}을 가리킨다.`]),
              explain: `짧은바늘은 ${josa(h, '과/와')} ${h + 1} 사이에 있고, 긴바늘은 ${josa(m / 5, '을/를')} 가리킨다. 시계가 나타내는 시각은 ${at(h, m)}이다.`,
              facts: { calc: [[String(h), 0], [String(h + 1), 1], [String(m / 5), 2]], shown: [[h, m]] }
            });
          }),
          T('read-see-fine', '긴바늘이 작은 눈금 몇 칸을 더 갔는지 읽기', '①4', (d) => {
            const [h, m] = d.until(() => [d.int(1, 11), d.int(2, 10) * 5 + d.int(1, 4)], ([x, y]) => clear(x, y)), k = numOf(m), j = m % 5;
            return M('시계를 보고 ㉠, ㉡에 알맞은 수를 구하시오.', [{ label: LABELS[0], answer: j }, { label: LABELS[1], answer: m }], {
              figure: clock(h, m, BIG) + lines([`긴바늘은 숫자 ${k}에서 작은 눈금 ${box(LABELS[0])}칸을 더 갔다.`, `시계가 나타내는 시각은 ${h}시 ${box(LABELS[1])}분이다.`]),
              explain: `긴바늘이 숫자 ${josa(k, '을/를')} 가리키면 ${k * 5}분이다. 작은 눈금 ${j}칸을 더 갔으므로 ${k * 5} + ${j} = ${m}(분)이다.`,
              facts: { calc: [[String(j), 0], [`${k}*5+${j}`, 1]], unseen: [5], shown: [[h, m]] }
            });
          }),
          T('read-place', '그 시각에 두 바늘이 있는 곳', '①4의 변형 ①12', (d) => {
            const h = d.int(1, 11), m = d.int(2, 10) * 5;
            return M(`${at(h, m)}일 때 시계의 바늘이 있는 곳이다. ㉠, ㉡, ㉢에 알맞은 수는? (㉠은 ㉡보다 작다.)`, [{ label: LABELS[0], answer: h }, { label: LABELS[1], answer: h + 1 }, { label: LABELS[2], answer: m / 5 }], {
              figure: lines([`짧은바늘은 ${box(LABELS[0])}과 ${box(LABELS[1])} 사이에 있다.`, `긴바늘은 ${box(LABELS[2])}을 가리킨다.`]),
              explain: `${h}시가 지났으므로 짧은바늘은 ${josa(h, '과/와')} ${h + 1} 사이에 있다. ${m}분은 5분씩 ${m / 5}번이므로 긴바늘은 ${josa(m / 5, '을/를')} 가리킨다.`,
              facts: { calc: [[String(h), 0], [`${h}+1`, 1], [`${m}/5`, 2]], unseen: [1, 5] }
            });
          }),
          T('read-near', '짧은바늘이 더 가까이 있는 숫자', '①4 ①13', (d) => {
            const h = d.int(1, 11), m = d.pick([5, 10, 15, 20, 40, 45, 50, 55]), near = m > 30 ? h + 1 : h;
            return N(`${at(h, m)}일 때 시계의 짧은바늘은 ${josa(h, '과/와')} ${h + 1} 사이에 있다. 짧은바늘은 두 숫자 가운데 어느 숫자에 더 가까운가?`, near, {
              explain: `짧은바늘은 한 시간 동안 ${h}에서 ${h + 1}까지 천천히 간다. ${m}분은 30분보다 ${m > 30 ? '많이' : '적게'} 지났으므로 ${m > 30 ? `${h + 1}에` : `${h}에`} 더 가깝다.`,
              facts: { calc: [[String(near), 0]], near: [h, m] }
            });
          }),
          T('read-five', '시계를 보고 몇 시 몇 분 쓰기(숫자를 가리킬 때)', '①5', (d) => {
            const [h, m] = d.until(() => [d.int(1, 12), d.int(1, 11) * 5], ([x, y]) => clear(x, y));
            return M('시계가 나타내는 시각은 몇 시 몇 분인가?', [{ answer: h, unit: '시' }, { answer: m, unit: '분' }], {
              figure: clock(h, m, BIG), explain: why(h, m), facts: { calc: [[String(h), 0], [`${m / 5}*5`, 1]], unseen: [5], rule: 'five', shown: [[h, m]] }
            });
          }),
          T('read-one', '시계를 보고 몇 시 몇 분 쓰기(작은 눈금까지)', '①6 심3', (d) => {
            const [h, m] = d.until(() => [d.int(1, 12), d.int(1, 11) * 5 + d.int(1, 4)], ([x, y]) => clear(x, y)), k = numOf(m), j = m % 5;
            return M('시계가 나타내는 시각은 몇 시 몇 분인가?', [{ answer: h, unit: '시' }, { answer: m, unit: '분' }], {
              figure: clock(h, m, BIG), explain: `${why(h, m)} 숫자 ${josa(k, '은/는')} ${k * 5}분이고 작은 눈금 한 칸은 1분이다.`,
              facts: { calc: [[String(h), 0], [`${k}*5+${j}`, 1]], unseen: [5], rule: 'one', shown: [[h, m]] }
            });
          }),
          T('read-words', '바늘이 있는 곳을 적은 글로 시각 알기', '①7', (d) => {
            const h = d.int(1, 11), k = d.int(1, 11);
            return M(`시계의 짧은바늘이 ${josa(h, '과/와')} ${h + 1} 사이에 있고, 긴바늘이 ${josa(k, '을/를')} 가리킨다. 몇 시 몇 분인가?`, [{ answer: h, unit: '시' }, { answer: k * 5, unit: '분' }], {
              explain: `짧은바늘이 ${josa(h, '과/와')} ${h + 1} 사이에 있으면 ${h}시가 지난 것이다. 긴바늘이 ${josa(k, '을/를')} 가리키면 ${k * 5}분이다.`, facts: { calc: [[String(h), 0], [`${k}*5`, 1]], unseen: [5] }
            });
          }),
          T('read-words-fine', '작은 눈금을 덜 간 곳으로 적은 글', '①7', (d) => {
            // 「10에서 작은 눈금 2칸 덜 간 곳」: 50분에서 2분을 뺀다.
            const h = d.int(1, 11), k = d.int(3, 11), j = d.int(1, 2);
            return M(`시계의 짧은바늘이 ${josa(h, '과/와')} ${h + 1} 사이에 있고, 긴바늘이 숫자 ${k}에서 작은 눈금 ${j}칸 덜 간 곳을 가리킨다. 몇 시 몇 분인가?`, [{ answer: h, unit: '시' }, { answer: k * 5 - j, unit: '분' }], {
              explain: `긴바늘이 숫자 ${josa(k, '을/를')} 가리키면 ${k * 5}분이다. 작은 눈금 ${j}칸을 덜 갔으므로 ${k * 5} − ${j} = ${k * 5 - j}(분)이다.`, facts: { calc: [[String(h), 0], [`${k}*5-${j}`, 1]], unseen: [5] }
            });
          }),
          T('read-words-pick', '바늘이 있는 곳을 적은 글에 맞는 시계', '①8', (d) => {
            // 보기: 바른 시계, 작은 눈금을 덜 간 시계, 긴바늘이 숫자 한 칸 더 간 시계, 짧은바늘이 한 칸 옆에 있는 시계
            const list = d.until(() => { const h = d.int(2, 10), k = d.int(2, 8), j = d.int(1, 3); return [[h, k * 5 + j], [h, k * 5 - j], [h, (k + 1) * 5 + j], [h + d.pick([-1, 1]), k * 5 + j]]; }, allClear);
            const [h, m] = list[0], order = d.shuffle(list);
            return C(`짧은바늘은 ${josa(h, '과/와')} ${h + 1} 사이에 있고, 긴바늘은 숫자 ${numOf(m)}에서 작은 눈금 ${m % 5}칸 더 간 곳을 가리키는 시계는?`, TAGS, order.indexOf(list[0]), {
              figure: G.tiles(order.map((t, i) => [TAGS[i], clock(t[0], t[1])])), explain: `긴바늘이 숫자 ${numOf(m)}에서 작은 눈금 ${m % 5}칸 더 간 곳을 가리키고, 짧은바늘이 ${josa(h, '과/와')} ${h + 1} 사이에 있는 시계를 찾는다. ${at(h, m)}을 나타낸다.`,
              facts: { kindPick: { kinds: order.map(value), target: value(list[0]) }, shown: order }
            });
          }),
          T('read-pick', '시각에 맞는 시계 고르기', '①9 심5', (d) => {
            // 보기: 바른 시계, 두 바늘을 바꾸어 그린 시계(2시 25분 → 5시 10분), 긴바늘이 숫자 한 칸 옆인 시계, 짧은바늘이 숫자 한 칸 옆인 시계
            const list = d.until(() => { const h = d.int(2, 10), k = d.int(2, 8); return [[h, k * 5], [k, h * 5], [h, (k + d.pick([-1, 1])) * 5], [h + d.pick([-1, 1]), k * 5]]; }, allClear);
            const [h, m] = list[0], order = d.shuffle(list);
            return C(`${at(h, m)}을 나타내는 시계는?`, TAGS, order.indexOf(list[0]), {
              figure: G.tiles(order.map((t, i) => [TAGS[i], clock(t[0], t[1])])), explain: `${at(h, m)}에는 짧은바늘이 ${josa(h, '과/와')} ${h + 1} 사이에 있고, 긴바늘이 ${josa(m / 5, '을/를')} 가리킨다.`,
              facts: { kindPick: { kinds: order.map(value), target: value(list[0]) }, shown: order }
            });
          }),
          T('read-wrong', '시계를 잘못 읽은 것 찾기', '①10 심4', (d) => {
            // 시계 넷 가운데 하나만 잘못 읽었다: 긴바늘이 가리키는 숫자를 그대로 분으로 읽었거나(2시 50분 → 2시 10분),
            // 작은 눈금을 빼고 읽었거나(2시 23분 → 2시 20분), 짧은바늘이 다가가는 수를 시로 읽었다(8시 55분 → 9시 55분).
            const times = d.shuffle(d.until(() => [0, 1, 2, 3].map((i) => [d.int(1, 11), d.int(2, 10) * 5 + (i < 2 ? 0 : d.int(1, 4))]), (list) => allClear(list) && new Set(list.map(([h]) => h)).size === 4));
            const bad = d.int(0, 3), [h, m] = times[bad];
            const slip = d.pick([m % 5 ? [h, m - (m % 5)] : [h, m / 5]].concat(m >= 40 ? [[h + 1, m]] : []));
            const read = times.map((t, i) => (i === bad ? slip : t));
            return C('시계 아래에 읽은 시각을 적었다. 잘못 읽은 것은?', TAGS, bad, {
              figure: G.tiles(times.map((t, i) => [`${TAGS[i]} ${at(read[i][0], read[i][1])}`, clock(t[0], t[1])])), explain: `${TAGS[bad]}의 시계는 ${why(h, m)}`,
              facts: { claimed: times.map((t, i) => [`${t[0]}*60+${t[1]}`, value(read[i])]), claimedWant: false, shown: times }
            });
          }),
          T('read-match', '세 시계와 세 시각 짝 짓기', '①11 심6·7', (d) => {
            // 두 시계는 긴바늘이 같은 숫자를 가리킨다: 짧은바늘을 보아야 가릴 수 있다.
            const said = d.shuffle(d.until(() => { const m = d.int(2, 9) * 5; return [[d.int(1, 11), m], [d.int(1, 11), m], [d.int(1, 11), d.int(2, 9) * 5]]; }, (list) => allClear(list) && list[2][1] !== list[0][1] && new Set(list.map(([h]) => h)).size === 3));
            const right = d.pick(PERMS), options = d.shuffle([right].concat(d.shuffle(PERMS.filter((p) => p !== right)).slice(0, 3)));
            return C('가, 나, 다 시계가 나타내는 시각을 차례로 쓴 것은?', options.map((p) => p.map((i) => LABELS[i]).join(', ')), options.indexOf(right), {
              figure: G.tiles(right.map((i, n) => [TAGS[n], clock(said[i][0], said[i][1])])) + tagged(said.map(([h, m]) => at(h, m))),
              explain: right.map((i, n) => `${TAGS[n]}는 ${at(said[i][0], said[i][1])}`).join(', ') + '이다. 긴바늘이 같은 숫자를 가리키는 두 시계는 짧은바늘이 있는 곳으로 가린다.',
              facts: { truth: options.map((p) => p.join() === right.join()), want: true, shown: right.map((i) => said[i]) }
            });
          }),
          T('read-draw', '시계에 나타낼 때 긴바늘이 가리켜야 하는 곳', '①12 심8', (d) => {
            const h = d.int(1, 12), m = d.int(2, 11) * 5 + d.int(1, 4), k = numOf(m), j = m % 5;
            return M(`${at(h, m)}을 시계에 나타내려고 한다. 긴바늘이 가리켜야 하는 곳을 적은 것이다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: k }, { label: LABELS[1], answer: j }], {
              figure: lines([`숫자 ${box(LABELS[0])}에서 작은 눈금 ${box(LABELS[1])}칸 더 간 곳`]),
              explain: `숫자 ${josa(k, '은/는')} ${k * 5}분이다. ${m}분은 ${k * 5}분보다 ${j}분 더 지났으므로 숫자 ${k}에서 작은 눈금 ${j}칸 더 간 곳이다.`,
              facts: { calc: [[`(${m}-${m}%5)/5`, 0], [`${m}%5`, 1]], unseen: [5] }
            });
          }),
          T('read-fix', '잘못 읽은 시각 바로잡기', '①13', (d) => {
            // 잘못 읽는 세 가지: 긴바늘이 가리키는 숫자를 그대로 분으로(ten), 짧은바늘이 다가가는 수를 시로(next), 작은 눈금을 빼고(skip)
            const kind = d.pick(['ten', 'next', 'skip']);
            const [h, m] = d.until(() => [d.int(1, 11), kind === 'ten' ? d.int(7, 11) * 5 : kind === 'next' ? d.pick([50, 55]) : d.int(2, 10) * 5 + d.int(1, 4)], ([x, y]) => clear(x, y));
            const wrong = kind === 'ten' ? [h, m / 5] : kind === 'next' ? [h + 1, m] : [h, m - (m % 5)], k = numOf(m);
            const note = { ten: `긴바늘이 가리키는 숫자 ${josa(k, '은/는')} ${k}분이 아니라 ${k * 5}분을 나타낸다.`, next: `짧은바늘이 ${josa(h, '과/와')} ${h + 1} 사이에 있으면 아직 ${h + 1}시가 되지 않았다.`, skip: `긴바늘이 숫자 ${k}에서 작은 눈금 ${m % 5}칸을 더 갔으므로 ${m % 5}분을 더한다.` }[kind];
            return M(`시계를 보고 「${at(wrong[0], wrong[1])}」이라고 잘못 읽었다. 바르게 읽으면 몇 시 몇 분인가?`, [{ answer: h, unit: '시' }, { answer: m, unit: '분' }], {
              figure: clock(h, m, BIG), explain: `${note} ${why(h, m)}`,
              facts: { calc: [[String(h), 0], [m % 5 ? `${k}*5+${m % 5}` : `${k}*5`, 1]], unseen: [5], shown: [[h, m]], slip: wrong }
            });
          }),
          T('read-more', '긴바늘이 작은 눈금 몇 칸을 더 간 시각', '①14', (d) => {
            const h = d.int(1, 12), m = d.int(1, 10) * 5, j = d.int(1, 4);
            return M(`${at(h, m)}에서 시계의 긴바늘이 작은 눈금 ${j}칸만큼 더 갔다. 몇 시 몇 분이 되는가?`, [{ answer: h, unit: '시' }, { answer: m + j, unit: '분' }], {
              explain: `작은 눈금 한 칸은 1분이다. ${at(h, m)}에서 ${j}분이 지나면 ${at(h, m + j)}이다.`, facts: { clock: [{ expr: `${mins(h, m)}+${j}`, parts: 'ms', at: 0 }] }
            });
          }),
          T('read-next-pick', '1분 뒤의 시각을 나타내는 시계', '심9', (d) => {
            // 보기: 1분 뒤(바른 시계), 1분 앞, 긴바늘이 숫자 한 칸 더 간 시계(5분 뒤), 짧은바늘이 한 칸 더 간 시계(1시간 뒤)
            const who = d.pick(NAMES), list = d.until(() => { const h = d.int(1, 10), m = d.int(2, 9) * 5; return [[h, m + 1], [h, m - 1], [h, m + 5], [h + 1, m], [h, m]]; }, allClear);
            const order = d.shuffle(list.slice(0, 4)), [h, m] = list[4];
            return C(`${name(who, '은/는')} 1분 전에 시계를 보았다. 그때 시계는 ${at(h, m)}을 나타냈다. 지금 시각을 나타내는 시계는?`, TAGS, order.indexOf(list[0]), {
              figure: G.tiles(order.map((t, i) => [TAGS[i], clock(t[0], t[1])])), explain: `${at(h, m)}에서 1분이 지나면 ${at(h, m + 1)}이다. 긴바늘이 숫자 ${m / 5}에서 작은 눈금 1칸 더 간 곳을 가리키는 시계를 찾는다.`,
              facts: { kindPick: { kinds: order.map(value), target: value(list[0]) }, shown: order }
            });
          })
        ]
      },
      {
        id: 'before', title: '몇 시 몇 분 전', standard: READ,
        types: [
          T('before-read', '시계를 「몇 시 몇 분 전」으로 읽기', '①15', (d) => {
            const [h, m] = d.until(() => [d.int(1, 11), d.pick([45, 50, 55])], ([x, y]) => clear(x, y));
            return M('시계를 보고 ㉠, ㉡, ㉢, ㉣에 알맞은 수를 구하시오.', [{ label: LABELS[0], answer: h }, { label: LABELS[1], answer: m }, { label: LABELS[2], answer: h + 1 }, { label: LABELS[3], answer: 60 - m }], {
              figure: clock(h, m, BIG) + lines([`시계가 나타내는 시각은 ${box(LABELS[0])}시 ${box(LABELS[1])}분이다.`, `이 시각은 ${box(LABELS[2])}시 ${box(LABELS[3])}분 전이다.`]),
              explain: `${why(h, m)} ${h + 1}시가 되려면 ${60 - m}분이 더 지나야 하므로 ${h + 1}시 ${60 - m}분 전이다.`,
              facts: { calc: [[String(h), 0], [`${m / 5}*5`, 1], [String(h + 1), 2], [`60-${m / 5}*5`, 3]], unseen: [5, 60], shown: [[h, m]] }
            });
          }),
          T('before-left', '몇 시가 되려면 더 지나야 하는 분', '①16', (d) => {
            const [h, m] = d.until(() => [d.int(1, 11), d.pick([45, 50, 55])], ([x, y]) => clear(x, y));
            return N(`시계가 나타내는 시각에서 ${h + 1}시가 되려면 몇 분이 더 지나야 하는가?`, 60 - m, {
              unit: '분', figure: clock(h, m, BIG), explain: `시계가 나타내는 시각은 ${at(h, m)}이다. 긴바늘이 ${m / 5}에서 12까지 가려면 ${60 - m}분이 더 지나야 한다.`,
              facts: { calc: [[`60-${m / 5}*5`, 0]], unseen: [60, 5], shown: [[h, m]] }
            });
          }),
          T('before-words', '「몇 분 전」과 「몇 시 몇 분」을 서로 바꾸기', '①17 심11', (d) => {
            const [k1, k2] = d.shuffle([5, 10, 15]), h1 = d.int(1, 11), h2 = d.until(() => d.int(2, 12), (x) => x !== h1 + 1);
            return M('㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: k1 }, { label: LABELS[1], answer: h2 - 1 }, { label: LABELS[2], answer: 60 - k2 }], {
              figure: lines([`${h1}시 ${60 - k1}분은 ${h1 + 1}시 ${box(LABELS[0])}분 전이다.`, `${h2}시 ${k2}분 전은 ${box(LABELS[1])}시 ${box(LABELS[2])}분이다.`]),
              explain: `${h1}시 ${60 - k1}분에서 ${k1}분이 더 지나면 ${h1 + 1}시이다. ${h2}시가 되기 ${k2}분 전은 ${h2 - 1}시 ${60 - k2}분이다.`,
              facts: { calc: [[`60-${60 - k1}`, 0], [`${h2}-1`, 1], [`60-${k2}`, 2]], unseen: [60, 1] }
            });
          }),
          T('before-hand', '「몇 시 몇 분 전」일 때 두 바늘이 있는 곳', '①18 심12', (d) => {
            const h = d.int(2, 12), k = d.pick([5, 10, 15]);
            return M(`${h}시 ${k}분 전을 시계에 나타내려고 한다. ㉠, ㉡, ㉢에 알맞은 수는? (㉠은 ㉡보다 작다.)`, [{ label: LABELS[0], answer: h - 1 }, { label: LABELS[1], answer: h }, { label: LABELS[2], answer: (60 - k) / 5 }], {
              figure: lines([`짧은바늘은 ${box(LABELS[0])}과 ${box(LABELS[1])} 사이에 있다.`, `긴바늘은 ${box(LABELS[2])}을 가리킨다.`]),
              explain: `${h}시 ${k}분 전은 ${h - 1}시 ${60 - k}분이다. 짧은바늘은 ${josa(h - 1, '과/와')} ${h} 사이에 있고, 긴바늘은 ${josa((60 - k) / 5, '을/를')} 가리킨다.`,
              facts: { calc: [[`${h}-1`, 0], [String(h), 1], [`(60-${k})/5`, 2]], unseen: [1, 60, 5] }
            });
          }),
          T('before-same', '같은 시각과 다른 시각 가리기', '①20 심16', (d) => {
            // 「7시 5분 전」과 「6시 55분」은 같은 시각이다. 「7시 5분」은 「전」을 빼고 읽은 시각이다.
            const who = d.shuffle(NAMES).slice(0, 3), h = d.int(2, 12), k = d.pick([5, 10, 15]);
            const rows = d.shuffle([{ text: `${h}시 ${k}분 전`, expr: `${h}*60-${k}` }, { text: `${h - 1}시 ${60 - k}분`, expr: `${h - 1}*60+${60 - k}` }, { text: `${h}시 ${k}분`, expr: `${h}*60+${k}`, odd: true }]);
            return C('세 사람이 말한 시각이다. 나머지 두 사람과 다른 시각을 말한 사람은?', who, rows.findIndex((row) => row.odd), {
              figure: lines(rows.map((row, i) => `${who[i]}: ${row.text}`)), explain: `${h}시 ${k}분 전은 ${h}시가 되기 ${k}분 전이므로 ${h - 1}시 ${60 - k}분이다. ${h}시 ${k}분은 ${h}시에서 ${k}분이 지난 시각이다.`,
              facts: { choose: { exprs: rows.map((row) => row.expr), rule: 'odd' }, unseen: [60] }
            });
          }),
          T('before-talk', '시계를 보고 한 말 가운데 틀린 것', '①21 심14', (d) => {
            const [h, m] = d.until(() => [d.int(1, 11), d.pick([45, 50, 55])], ([x, y]) => clear(x, y)), k = 60 - m;
            // 틀린 말: 시를 그대로 둔 것(9시 5분 전), 짧은바늘이 다가가는 수를 시로 읽은 것(10시 55분), 분을 바꾸지 않은 것(10시 55분 전)
            const bad = d.pick([`${h}시 ${k}분 전이다.`, `${h + 1}시 ${m}분이다.`, `${h + 1}시 ${m}분 전이다.`]);
            const rows = d.shuffle([[`${h}시 ${m}분이다.`, true], [`${h + 1}시 ${k}분 전이다.`, true], [`${h + 1}시가 되려면 ${k}분이 더 지나야 한다.`, true], [bad, false]]);
            return C('시계를 보고 한 말이다. 옳지 않은 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => !ok), {
              figure: clock(h, m, BIG), explain: `${why(h, m)} ${k}분이 더 지나면 ${h + 1}시가 되므로 ${h + 1}시 ${k}분 전이다.`,
              facts: { truth: rows.map(([, ok]) => ok), want: false, shown: [[h, m]] }
            });
          }),
          T('before-earlier', '「몇 분 전」으로 말한 시각과 견주기', '①22 심15', (d) => {
            const [a, b] = d.shuffle(NAMES).slice(0, 2), h = d.int(7, 8), k = d.pick([5, 10, 15]), m = 60 - k + d.pick([-3, -2, -1, 1, 2, 3]), early = d.bool();
            const flip = d.bool(), said = flip ? [`${h + 1}시 ${k}분 전`, at(h, m)] : [at(h, m), `${h + 1}시 ${k}분 전`], exprs = flip ? [`${h + 1}*60-${k}`, `${h}*60+${m}`] : [`${h}*60+${m}`, `${h + 1}*60-${k}`];
            const values = flip ? [h * 60 + 60 - k, h * 60 + m] : [h * 60 + m, h * 60 + 60 - k], hit = (values[0] < values[1]) === early ? 0 : 1;
            return C(`${name(a, '은/는')} ${said[0]}에, ${name(b, '은/는')} ${said[1]}에 학교에 왔다. 더 ${early ? '일찍' : '늦게'} 온 사람은?`, [a, b], hit, {
              explain: `${h + 1}시 ${k}분 전은 ${h}시 ${60 - k}분이다. ${h}시 ${60 - k}분과 ${at(h, m)} 가운데 더 ${early ? '이른' : '늦은'} 시각은 ${early === (m < 60 - k) ? at(h, m) : `${h}시 ${60 - k}분`}이다.`,
              facts: { choose: { exprs, rule: early ? 'min' : 'max' }, unseen: [60] }
            });
          }),
          T('before-shift', '몇 시에서 5분 전, 10분 전, 15분 전의 시각', '①23 심17', (d) => {
            const h = d.int(2, 11), k = d.pick([5, 10, 15]);
            return M(`시계가 나타내는 시각에서 ${k}분 전의 시각은 몇 시 몇 분인가?`, [{ answer: h - 1, unit: '시' }, { answer: 60 - k, unit: '분' }], {
              figure: clock(h, 0, BIG), explain: `짧은바늘이 ${josa(h, '을/를')}, 긴바늘이 12를 가리키므로 ${h}시이다. ${h}시 ${k}분 전은 ${h - 1}시 ${60 - k}분이다.`,
              facts: { clock: [{ expr: `${h}*60-${k}`, parts: 'ms', at: 0 }], shown: [[h, 0]] }
            });
          })
        ]
      },
      { id: 'hour', title: '1시간과 걸린 시간', standard: SPAN, types: [] },
      { id: 'day', title: '하루의 시간', standard: UNITS, types: [] },
      { id: 'cal', title: '달력', standard: UNITS, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
