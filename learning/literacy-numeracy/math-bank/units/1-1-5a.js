// 1학년 1학기 5단원 50까지의 수 — 단원 틀, 그림 도구, 기본 문항(10, 십몇, 19까지의 수 모으기와 가르기, 몇십).
// 수집해 둔 평가 자료(미래엔·아이스크림미디어·천재)에서 뽑은 꼴 목록(기본꼴_1 76꼴, 심화꼴 49꼴)을 처음부터 끝까지 대조하여,
// 꼴마다 ① 몇 학년 무슨 단원 내용인가 ② 무엇을 하게 하는 문제인가를 따져서 실었다.
// (50까지의 수·수의 순서·크기 비교의 기본 문항과 실력 문항은 1-1-5b.js에 있다.)
//
// 영역과 성취기준: 수와 연산. 2수01-01(수를 세고 읽고 쓰기), 2수01-02(10개씩 묶음과 낱개), 2수01-03(수의 순서와 크기 비교), 2수01-04(모으기와 가르기) 가운데 50까지의 수.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다. 같은 물음이라도 수의 범위(10, 십몇, 몇십몇)가 다르면 차시가 달라 따로 싣고 facts.rule 에 그 이름을 단다.
//  - 교육과정의 금: 두 자리 수는 「10개씩 묶음」과 「낱개」로 말한다(「십의 자리·일의 자리」를 쓰지 않는다).
//    모으기와 가르기는 19까지의 수에서만, 가지 그림의 빈칸으로만 묻는다(덧셈식·뺄셈식은 1학년 2학기).
//    한글로 쓰는 답은 없다. 수 읽기·크다/작다는 고르기로 묻고 답 칸에는 숫자만 받는다.
//  - 51 이상의 수는 보기에도 쓰지 않는다. 묶음과 낱개를 뒤바꾼 틀린 보기는 뒤바꾼 수가 50을 넘지 않을 때만 쓴다(13과 31, 24와 42).
//  - 크기 비교는 「크다·작다」로 말한다(>, < 는 1학년 2학기 「100까지의 수」에서 배운다).
//  - 세는 그림은 다섯 개씩 끊어 놓고, 10개씩 묶음은 묶음(연결 모형 막대, 봉지)으로 그린다.
//
// 뺀 것과 까닭(이 파일의 묶음)
//  - 긋기·그리기(작도): 수만큼 ○ 그리기(①1·①21·①23의 변형, 심20의 변형) — ①5(10이 되도록 ○ 더 그리기)는 「몇 개 더」를 수로 묻는다.
//  - 20을 넘는 수의 모으기와 가르기: 묶음끼리 모으기(①39 심19), 50이 되려면 10개씩 묶음이 몇 개 더(심22).
//  - 합과 차로 두 수 찾기: 한 사람이 1개 더 적게 나누어 가지기(심18).
//  - 열린 답: 서로 다른 방법으로 가르기(①24 심14)는 한 짝씩 빈칸으로 닫아 `split-table`로 실었다.
//  - 답이 여럿인 고르기(①4·8·14·16·35 심6·10)는 맞는 것이 하나뿐이게 바꾸어 실었다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, NAMES, box, lines, josa, N, M, C } = B.kit;
  const COUNT = '2수01-01', PLACE = '2수01-02', ORDER = '2수01-03', SPLIT = '2수01-04';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});

  // ── 수 읽기(50까지) ──────────────────────────────────────────
  const S1 = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'], N1 = ['', '하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉'], N10 = ['', '열', '스물', '서른', '마흔', '쉰'];
  const sino = (n) => (n >= 20 ? S1[Math.floor(n / 10)] : '') + (n >= 10 ? '십' : '') + S1[n % 10];   // 십사, 삼십오
  const native = (n) => N10[Math.floor(n / 10)] + N1[n % 10];                                         // 열넷, 서른다섯
  const mixNS = (n) => N10[Math.floor(n / 10)] + S1[n % 10];                                          // 서른오(틀린 읽기)
  const mixSN = (n) => sino(n - (n % 10)) + N1[n % 10];                                               // 삼십다섯(틀린 읽기)
  // 읽은 말은 낫표로 묶는다(「사십이」라고 — 낫표가 없으면 「사십」이라고 로도 읽힌다).
  const quoted = (word, pair) => `「${word}」${josa(word, pair).slice(word.length)}`;
  const called = (word) => quoted(word, '이라고/라고');
  const reads = (n) => `${josa(n, '은/는')} 「${sino(n)}」 또는 ${called(native(n))} 읽는다.`;
  const range = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
  const truthOf = (rows, want) => ({ truth: rows.map((row) => row[1]), want });
  // 참·거짓이 붙은 보기에서 고르기: rows 는 [보기 글, 참인가]. want 인 보기가 하나뿐이어야 한다.
  const ask = (text, rows, want, o) => C(text, rows.map((row) => row[0]), rows.findIndex((row) => row[1] === want), Object.assign({}, o, { facts: Object.assign(truthOf(rows, want), o.facts || {}) }));
  const joined = (x, y, s) => `${josa(x, '과/와')} ${josa(y, '을/를')} 모으면 ${s}`;
  const pairText = (x, y) => `${josa(x, '과/와')} ${y}`;
  const becomes = (x, y, s) => `${josa(x, '과/와')} ${josa(y, '을/를')} 모으면 ${josa(s, '이/가')} 된다.`;
  const splits = (n, x, y) => `${josa(n, '은/는')} ${josa(x, '과/와')} ${josa(y, '으로/로')} 가를 수 있다.`;

  // ── 그림 ─────────────────────────────────────────────────────
  const INK = '#1f2933';
  const word = (size, weight) => `style="font-size:${size}px;font-weight:${weight || 600};fill:${INK}"`;
  const pic = (w, h, scale, label, body) => `<svg class="mb-dots" viewBox="0 0 ${w} ${h}" width="${Math.round(w * scale)}" role="img" aria-label="${label}">${body}</svg>`;
  // 한 줄로 늘어놓은 수(다섯 칸이 휴대폰 너비에 한 줄로 들어가게 사이를 좁혔다)
  const row = (list) => `<div class="mb-numbers" style="gap:6px 16px;padding:8px 12px">${list.map((v) => `<span>${v}</span>`).join('')}</div>`;
  const captioned = (caption, svg) => `<figure class="mb-blocks"><figcaption>${caption}</figcaption>${svg}</figure>`;
  // 낱개로 놓인 물건: 한 줄에 다섯 개씩, 두 줄(10개)마다 조금 띄운다. o.on: 앞에서부터 파란색으로 칠할 개수.
  function pile(n, o) {
    const opt = o || {}, step = 13, r = 5, pad = 7, rows = Math.ceil(n / 5), lift = (row) => Math.floor(row / 2) * 5;
    const w = pad * 2 + 4 * step + 2 * r, h = pad * 2 + (rows - 1) * step + lift(rows - 1) + 2 * r;
    let out = '';
    for (let i = 0; i < n; i += 1) { const row = Math.floor(i / 5); out += `<circle class="mb-thing${i < (opt.on || 0) ? ' is-on' : ''}" cx="${pad + r + (i % 5) * step}" cy="${pad + r + row * step + lift(row)}" r="${r}"/>`; }
    const said = opt.on ? `파란 구슬 ${opt.on}개와 노란 구슬 ${n - opt.on}개` : `${opt.name || '구슬'} ${n}개`;
    return pic(w, h, opt.scale || 1.3, said, out);
  }
  // 접시에 담긴 구슬(두 줄 자리)
  function plate(n) {
    const step = 13, r = 5, pad = 9, w = pad * 2 + 4 * step + 2 * r, h = pad * 2 + step + 2 * r;
    let out = `<rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="10" style="fill:#f8fafc;stroke:#94a3b8;stroke-width:1.2"/>`;
    for (let i = 0; i < n; i += 1) out += `<circle class="mb-thing" cx="${pad + r + (i % 5) * step}" cy="${pad + r + Math.floor(i / 5) * step}" r="${r}"/>`;
    return pic(w, h, 1.3, `접시에 구슬 ${n}개`, out);
  }
  // 열 칸짜리 판. b 를 주면 앞의 a 칸은 파란 구슬, 다음 b 칸은 노란 구슬이다.
  function tenFrame(a, b) {
    const c = 18, pad = 3;
    let out = '';
    for (let i = 0; i < 10; i += 1) {
      const x = pad + (i % 5) * c, y = pad + Math.floor(i / 5) * c;
      out += `<rect x="${x}" y="${y}" width="${c}" height="${c}" style="fill:#fff;stroke:#5b6770;stroke-width:1"/>`;
      if (i < a + (b || 0)) out += `<circle class="mb-thing${b != null && i < a ? ' is-on' : ''}" cx="${x + c / 2}" cy="${y + c / 2}" r="6"/>`;
    }
    return pic(pad * 2 + 5 * c, pad * 2 + 2 * c, 1.6, b != null ? `구슬 10개: 파란 구슬 ${a}개, 노란 구슬 ${b}개` : `10칸짜리 판에 구슬 ${a}개`, out);
  }
  // 10개씩 묶음 t 개와 낱개 k 개. kind 'rod': 연결 모형(10개 막대와 낱개), 'bag': 10개씩 담은 봉지와 낱개.
  // 낱개는 다섯 개씩 한 줄로 세우고, 두 줄(10개)마다 조금 띄운다. 낱개가 10개를 넘는 그림도 그린다.
  function bundles(t, k, o) {
    const opt = o || {}, bag = opt.kind === 'bag', cols = Math.ceil(k / 5), gaps = Math.floor(Math.max(cols - 1, 0) / 2);
    let out = '', x = 6;
    if (bag) {
      for (let i = 0; i < t; i += 1) {
        out += `<rect x="${x}" y="5" width="22" height="48" rx="6" style="fill:#fff7e6;stroke:#a86a00;stroke-width:1"/>`;
        for (let j = 0; j < 10; j += 1) out += `<circle class="mb-thing" cx="${x + 7 + (j % 2) * 8}" cy="${13 + Math.floor(j / 2) * 8}" r="3.1"/>`;
        x += 26;
      }
      if (t && k) x += 6;
      for (let j = 0; j < k; j += 1) { const col = Math.floor(j / 5); out += `<circle class="mb-thing" cx="${x + 4 + col * 9 + Math.floor(col / 2) * 5}" cy="${13 + (j % 5) * 8}" r="3.1"/>`; }
      x += k ? cols * 9 - 1 + gaps * 5 : -4;
    } else {
      for (let i = 0; i < t; i += 1) {
        let ticks = '';
        for (let j = 1; j < 10; j += 1) ticks += `<path d="M${x} ${6 + j * 7}h7"/>`;
        out += `<g class="mb-rod"><rect x="${x}" y="6" width="7" height="70" rx="1"/>${ticks}</g>`;
        x += 12;
      }
      if (t && k) x += 5;
      for (let j = 0; j < k; j += 1) { const col = Math.floor(j / 5); out += `<rect class="mb-one" x="${x + col * 10 + Math.floor(col / 2) * 4}" y="${69 - (j % 5) * 9}" width="7" height="7" rx="1"/>`; }
      x += k ? cols * 10 - 3 + gaps * 4 : -5;
    }
    const said = t && k ? `10개씩 묶음 ${t}개와 낱개 ${k}개` : t ? `10개씩 묶음 ${t}개` : `낱개 ${k}개`;
    return pic(Math.max(x + 6, 42), bag ? 58 : 82, opt.scale || (bag ? 1.7 : 1.5), said, out);
  }
  // 가지 그림. kind 'join': 위의 두 수(a, b)를 모아 아래의 수(c), 'split': 위의 수(c)를 아래의 두 수(a, b)로 가른다.
  // 수 대신 '□'(빈칸)나 ㉠·㉡(이름 붙은 빈칸)을 넘긴다.
  const cellAt = (x, y, v) => {
    const blank = typeof v !== 'number';
    return `<rect x="${x}" y="${y}" width="32" height="24" rx="5" style="fill:${blank ? '#fff' : '#eef3fb'};stroke:${INK};stroke-width:${blank ? 1.8 : 1}"/>` + (v === '□' ? '' : `<text x="${x + 16}" y="${y + 17}" text-anchor="middle" ${word(blank ? 12.5 : 14, 700)}>${v}</text>`);
  };
  const twig = (d) => `<path d="${d}" style="fill:none;stroke:${INK};stroke-width:1.2"/>`;
  function branch(kind, a, b, c) {
    const join = kind === 'join', top = 3, bottom = 47;
    const body = twig(join ? `M24 ${top + 24}L56 ${bottom}M88 ${top + 24}L56 ${bottom}` : `M56 ${top + 24}L24 ${bottom}M56 ${top + 24}L88 ${bottom}`)
      + cellAt(40, join ? bottom : top, c) + cellAt(8, join ? top : bottom, a) + cellAt(72, join ? top : bottom, b);
    return pic(112, 74, 1.5, join ? `모으기 그림: 위의 두 수 ${a}, ${b}, 아래의 수 ${c}` : `가르기 그림: 위의 수 ${c}, 아래의 두 수 ${a}, ${b}`, body);
  }
  // 모으기를 두 번 한 가지 그림: a 와 b 를 모아 ㉠, ㉠과 c 를 모아 ㉡.
  function branch2(a, b, c) {
    const body = twig('M22 27L53 44M84 27L53 44M53 68L86 85M120 68L86 85') + cellAt(6, 3, a) + cellAt(68, 3, b) + cellAt(37, 44, LABELS[0]) + cellAt(104, 44, c) + cellAt(70, 85, LABELS[1]);
    return pic(142, 112, 1.5, `모으기를 두 번 한 그림: 첫째 줄 ${a}, ${b}, 둘째 줄 ㉠, ${c}, 셋째 줄 ㉡`, body);
  }
  // 수 배열표: first 부터 순서대로 한 줄에 cols 칸씩 rows 줄. asks: { 칸 번호(0부터): 이름표 }, shown: 수를 적을 칸 번호(없으면 모두 적는다).
  function chart(first, cols, rows, asks, shown) {
    const cw = 27, ch = 24, w = cols * cw + 2, h = rows * ch + 2;
    let out = '';
    for (let i = 0; i < cols * rows; i += 1) {
      const x = 1 + (i % cols) * cw, y = 1 + Math.floor(i / cols) * ch, tag = asks[i], text = tag || (!shown || shown.includes(i) ? first + i : '');
      out += `<rect x="${x}" y="${y}" width="${cw}" height="${ch}" style="fill:${tag ? '#fff3d6' : '#fff'};stroke:#5b6770;stroke-width:0.8"/>`;
      if (text !== '') out += `<text x="${x + cw / 2}" y="${y + 16.7}" text-anchor="middle" ${word(13.5, tag ? 700 : 600)}>${text}</text>`;
    }
    const said = Object.keys(asks).map(Number).sort((p, q) => p - q).map((i) => `${asks[i]}은 ${i + 1}째 칸`).join(', ');
    return pic(w, h, Math.min(1.3, 276 / w), `수 배열표: 한 줄에 ${cols}칸씩 ${rows}줄, 첫 칸의 수는 ${first}. ${said}`, out);
  }
  // 구불구불한 길: first 부터 길을 따라 순서대로 적는다. 홀수째 줄은 오른쪽으로, 짝수째 줄은 왼쪽으로 간다.
  function snake(first, cols, rows, asks) {
    const cw = 28, ch = 22, gx = 13, gy = 15, pad = 5;
    const at = (i) => { const r = Math.floor(i / cols), c = r % 2 ? cols - 1 - (i % cols) : i % cols; return [pad + c * (cw + gx) + cw / 2, pad + r * (ch + gy) + ch / 2]; };
    let out = '';
    for (let i = 0; i + 1 < cols * rows; i += 1) {
      const [x1, y1] = at(i), [x2, y2] = at(i + 1), mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = Math.sign(x2 - x1), dy = Math.sign(y2 - y1);
      out += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:#5b6770;stroke-width:1.4"/>`
        + `<path d="M${mx + dx * 3.6} ${my + dy * 3.6}L${mx - dx * 2.6 - dy * 3.2} ${my - dy * 2.6 - dx * 3.2}L${mx - dx * 2.6 + dy * 3.2} ${my - dy * 2.6 + dx * 3.2}Z" style="fill:#5b6770"/>`;
    }
    for (let i = 0; i < cols * rows; i += 1) {
      const [x, y] = at(i), tag = asks[i];
      out += `<rect x="${x - cw / 2}" y="${y - ch / 2}" width="${cw}" height="${ch}" rx="6" style="fill:${tag ? '#fff3d6' : '#fff'};stroke:${INK};stroke-width:1"/><text x="${x}" y="${y + 4.7}" text-anchor="middle" ${word(13, tag ? 700 : 600)}>${tag || first + i}</text>`;
    }
    const said = Object.keys(asks).map(Number).sort((p, q) => p - q).map((i) => `${asks[i]}은 ${i + 1}째 칸`).join(', ');
    return pic(pad * 2 + cols * cw + (cols - 1) * gx, pad * 2 + rows * ch + (rows - 1) * gy, 1.6, `길 그림: 첫 칸의 수는 ${first}, 길을 따라 ${cols * rows}칸. ${said}`, out);
  }
  // 구슬 몇 개는 보이고 나머지는 상자로 덮여 있다.
  function covered(k) {
    const step = 13, r = 5, pad = 7, left = pad * 2 + 4 * step + 2 * r + 4;
    let out = '';
    for (let i = 0; i < k; i += 1) out += `<circle class="mb-thing" cx="${pad + r + (i % 5) * step}" cy="${pad + r + Math.floor(i / 5) * step}" r="${r}"/>`;
    out += `<rect x="${left}" y="6" width="46" height="27" rx="3" style="fill:#cbd5e1;stroke:#475569;stroke-width:1.2"/><path d="M${left - 2} 6h50" style="stroke:#475569;stroke-width:2.4"/><text x="${left + 23}" y="25" text-anchor="middle" ${word(14, 700)}>?</text>`;
    return pic(left + 46 + pad, 37, 1.5, `구슬 ${k}개가 보이고 나머지 구슬은 상자로 덮여 있다`, out);
  }
  // 한 수를 여러 가지로 가른 표: 위 칸과 아래 칸의 수를 모으면 n 이 된다.
  const splitTable = (n, top, bottom) => `<div class="mb-table-wrap"><table class="mb-table"><thead><tr><th colspan="${top.length}">${n}</th></tr></thead><tbody>`
    + [top, bottom].map((row) => '<tr>' + row.map((cell) => `<td style="background:#fff;font-weight:400;min-width:3.2em">${cell}</td>`).join('') + '</tr>').join('') + '</tbody></table></div>';

  // 같은 단원의 b 파일이 함께 쓴다.
  B.kit.g115 = { COUNT, PLACE, ORDER, SPLIT, sino, native, mixNS, mixSN, quoted, called, reads, range, truthOf, ask, joined, pairText, becomes, splits, pic, row, captioned, pile, plate, tenFrame, bundles, branch, branch2, chart, snake, covered, splitTable };

  B.addUnit({
    id: '1-1-5', grade: 1, semester: 1, no: 5, title: '50까지의 수', version: 1,
    groups: [
      {
        id: 'ten', title: '10', standard: COUNT,
        types: [
          T('ten-count', '물건을 세어 10 쓰기', '①1 심1', (d) => {
            const thing = d.pick(['딸기', '공깃돌', '단추']);
            return N(`${josa(thing, '은/는')} 모두 몇 개인가?`, 10, { unit: '개', figure: pile(10, { name: thing }), explain: '5개씩 2줄이다. 9개보다 1개 더 많으므로 10개이다.', facts: { rule: 'ten', calc: [['10', 0]] } });
          }),
          T('ten-pick', '10개인 것 고르기', '①1 심1', (d) => {
            const counts = d.shuffle([10, 9, d.pick([7, 8])]);
            return C('구슬이 10개인 것은?', LABELS.slice(0, 3), counts.indexOf(10), {
              figure: counts.map((n, i) => captioned(LABELS[i], pile(n, { scale: 1 }))).join(''), explain: `구슬은 차례로 ${counts.join('개, ')}개이다.`, facts: { choose: { exprs: counts.map(String), rule: 'equals', target: 10 } }
            });
          }),
          T('ten-next', '9보다 1만큼 더 큰 수', '①2', () => N('9보다 1만큼 더 큰 수는?', 10, { explain: '9 다음 수는 10이다.', facts: { calc: [['9+1', 0]] } })),
          T('ten-more', '10은 어떤 수보다 몇만큼 더 큰 수', '①2 심2', (d) => {
            const k = d.pick([9, 8, 7]), steps = range(k + 1, 10).join(', ');
            return N(`10은 ${k}보다 몇만큼 더 큰 수인가?`, 10 - k, { explain: `${k}부터 이어 세면 ${steps}이다. 10은 ${k}보다 ${10 - k}만큼 더 큰 수이다.`, facts: { calc: [[`10-${k}`, 0]] } });
          }),
          T('ten-pic-more', '그림의 수보다 몇만큼 더 큰 수', '①3', (d) => {
            const n = d.pick([7, 8]), gap = 10 - n;
            return N(`구슬의 수보다 ${gap}만큼 더 큰 수는?`, 10, { figure: pile(n), explain: `구슬은 ${n}개이다. ${n}보다 ${gap}만큼 더 큰 수는 10이다.`, facts: { calc: [[`${n}+${gap}`, 0]] } });
          }),
          T('ten-read', '10 읽기', '①1·4', (d) => {
            const rows = d.shuffle([['십, 열', true], ['구, 열', false], ['십, 아홉', false], ['일영, 열', false]]);
            return ask('10을 바르게 읽은 것끼리 짝 지은 것은?', rows, true, { explain: '10은 십 또는 열이라고 읽는다.' });
          }),
          T('ten-say-next', '수 세는 말의 차례', '심5', (d) => {
            const own = d.bool(), rows = d.shuffle(own ? [['열', true], ['십', false], ['하나', false], ['영', false]] : [['십', true], ['열', false], ['일', false], ['영', false]]);
            return ask('수를 순서대로 세었다. □에 알맞은 말은?', rows, true, {
              figure: lines([(own ? '일곱, 여덟, 아홉, ' : '칠, 팔, 구, ') + box()]), explain: own ? '하나, 둘, 셋으로 세면 아홉 다음은 열이다.' : '일, 이, 삼으로 세면 구 다음은 십이다.'
            });
          }),
          T('ten-frame-more', '10이 되려면 더 놓을 수', '①5', (d) => {
            const k = d.int(3, 8);
            return N('구슬을 몇 개 더 놓으면 10개가 되는가?', 10 - k, { unit: '개', figure: tenFrame(k), explain: `구슬은 ${k}개이다. ${becomes(k, 10 - k, 10)}`, facts: { calc: [[`10-${k}`, 0]] } });
          }),
          T('ten-join', '모아서 10 만들기', '①6', (d) => {
            const a = d.int(1, 9), b = 10 - a;
            return N('두 수를 모았다. □에 알맞은 수는?', 10, { figure: branch('join', a, b, '□'), explain: becomes(a, b, 10), facts: { rule: 'ten', calc: [[`${a}+${b}`, 0]] } });
          }, { standard: SPLIT }),
          T('ten-join-part', '모아서 10이 되는 한쪽 수', '①5·6', (d) => {
            const a = d.int(1, 9), first = d.bool();
            return N('두 수를 모아 10이 되었다. □에 알맞은 수는?', 10 - a, { figure: first ? branch('join', a, '□', 10) : branch('join', '□', a, 10), explain: becomes(a, 10 - a, 10), facts: { rule: 'ten', calc: [[`10-${a}`, 0]] } });
          }, { standard: SPLIT }),
          T('ten-split-part', '10을 가른 한쪽 수', '①6', (d) => {
            const a = d.int(1, 9), first = d.bool();
            return N('10을 두 수로 갈랐다. □에 알맞은 수는?', 10 - a, { figure: first ? branch('split', a, '□', 10) : branch('split', '□', a, 10), explain: splits(10, a, 10 - a), facts: { rule: 'ten', calc: [[`10-${a}`, 0]] } });
          }, { standard: SPLIT }),
          T('ten-beads', '구슬 그림을 보고 10 가르기', '①6', (d) => {
            const a = d.int(2, 8), b = 10 - a;
            return M('구슬 10개를 색깔에 따라 두 수로 가르시오.', [{ label: '파란 구슬', answer: a, unit: '개' }, { label: '노란 구슬', answer: b, unit: '개' }], {
              figure: tenFrame(a, b), explain: `파란 구슬은 ${a}개, 노란 구슬은 ${b}개이다. ${splits(10, a, b)}`, facts: { rule: 'ten', calc: [[`10-${b}`, 0], [`10-${a}`, 1]] }
            });
          }, { standard: SPLIT }),
          T('ten-pic-join', '그림을 보고 바르게 모은 것', '①7 심7', (d) => {
            // 틀린 보기: 수는 맞게 셌지만 모은 수가 틀린 것, 모은 수는 맞지만 그림과 다르게 센 것
            const a = d.int(3, 7), b = 10 - a, rows = d.shuffle([[a, b, 10], [a, b, 9], [a + 1, b - 1, 10], [a, b - 1, 9]]).map(([x, y, s]) => [joined(x, y, s), x === a && y === b && s === x + y]);
            return ask('그림을 보고 바르게 모은 것은?', rows, true, { figure: plate(a) + plate(b), explain: `구슬은 ${a}개와 ${b}개이다. ${becomes(a, b, 10)}` });
          }, { standard: SPLIT }),
          T('ten-pair', '모으면 10이 되는 두 수', '①8 심6', (d) => {
            const sums = d.shuffle([10, 9, 9, 11]);
            const firsts = d.until(() => d.shuffle(range(1, 8)).slice(0, 4), (f) => f.every((x, i) => sums[i] - x >= 1 && sums[i] - x <= 9) && new Set(f.map((x, i) => [x, sums[i] - x].sort().join())).size === 4);
            return C('모으면 10이 되는 두 수는?', firsts.map((x, i) => pairText(x, sums[i] - x)), sums.indexOf(10), {
              explain: becomes(firsts[sums.indexOf(10)], 10 - firsts[sums.indexOf(10)], 10), facts: { rule: 'ten', choose: { exprs: firsts.map((x, i) => `${x}+${sums[i] - x}`), rule: 'equals', target: 10 } }
            });
          }, { standard: SPLIT }),
          T('ten-pair-not', '모아서 10이 되지 않는 두 수', '①8', (d) => {
            const sums = d.shuffle([10, 10, 10, d.pick([9, 11])]), odd = sums.findIndex((s) => s !== 10);
            const firsts = d.until(() => d.shuffle(range(1, 8)).slice(0, 4), (f) => f.every((x, i) => sums[i] - x >= 1 && sums[i] - x <= 9) && new Set(f.map((x, i) => [x, sums[i] - x].sort().join())).size === 4);
            return C('모아서 10이 되지 않는 두 수는?', firsts.map((x, i) => pairText(x, sums[i] - x)), odd, {
              explain: `${becomes(firsts[odd], sums[odd] - firsts[odd], sums[odd])} 나머지는 모으면 10이 된다.`, facts: { choose: { exprs: firsts.map((x, i) => `${x}+${sums[i] - x}`), rule: 'odd' } }
            });
          }, { standard: SPLIT }),
          T('ten-need', '10이 되려면 더 있어야 하는 수', '①9', (d) => {
            const have = d.int(3, 8);
            return N(`연필이 ${have}자루 있다. 10명에게 한 자루씩 주려면 몇 자루가 더 있어야 하는가?`, 10 - have, { unit: '자루', explain: `${splits(10, have, 10 - have)} ${10 - have}자루가 더 있어야 한다.`, facts: { calc: [[`10-${have}`, 0]] } });
          }, { standard: SPLIT })
        ]
      },
      {
        id: 'teen', title: '십몇', standard: PLACE,
        types: [
          T('teen-pic', '10개씩 묶음 1개와 낱개를 세어 쓰기', '①10 심8', (d) => {
            const k = d.int(1, 9);
            return N('연결 모형은 모두 몇 개인가?', 10 + k, { unit: '개', figure: bundles(1, k), explain: `10개씩 묶음 1개와 낱개 ${k}개이므로 ${10 + k}개이다.`, facts: { rule: 'teen', calc: [[`10*1+${k}`, 0]] } });
          }),
          T('teen-split', '십몇을 10개씩 묶음과 낱개로', '①10', (d) => {
            const n = d.int(11, 19);
            return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: 1 }, { label: LABELS[1], answer: n % 10 }], {
              figure: lines([`${josa(n, '은/는')} 10개씩 묶음 ${box(LABELS[0])}개와 낱개 ${box(LABELS[1])}개이다.`]), explain: `${josa(n, '은/는')} 10개씩 묶음 1개와 낱개 ${n % 10}개이다.`, facts: { rule: 'teen', calc: [[`(${n}-${n}%10)/10`, 0], [`${n}%10`, 1]] }
            });
          }),
          T('teen-make', '10개씩 묶음 1개와 낱개 몇 개인 수', '①10', (d) => {
            const k = d.int(1, 9);
            return N(`10개씩 묶음 1개와 낱개 ${k}개인 수는?`, 10 + k, { explain: `10개씩 묶음 1개와 낱개 ${k}개인 수는 ${10 + k}이다.`, facts: { rule: 'teen', calc: [[`10*1+${k}`, 0]] } });
          }),
          T('teen-read-two', '십몇을 두 가지로 읽기', '①11', (d) => {
            // 틀린 보기: 우리말 읽기가 한 칸 어긋난 것, 한자말 읽기가 한 칸 어긋난 것, 숫자를 하나씩 읽은 것
            const n = d.int(12, 18), m = n + d.pick([-1, 1]);
            const rows = d.shuffle([[`${sino(n)}, ${native(n)}`, true], [`${sino(n)}, ${native(m)}`, false], [`${sino(m)}, ${native(n)}`, false], [`일${S1[n % 10]}, ${native(n)}`, false]]);
            return ask(`${josa(n, '을/를')} 두 가지로 바르게 읽은 것은?`, rows, true, { explain: `${reads(n)}`, facts: { rule: 'teen' } });
          }, { standard: COUNT }),
          T('teen-read-right', '바르게 읽은 것 고르기(십몇)', '①12', (d) => {
            const ns = d.shuffle(range(12, 18)).slice(0, 4);
            const rows = d.shuffle(ns.map((n, i) => { const said = n + (i === 0 ? 0 : d.pick([-1, 1])); return [`${n} – ${d.bool() ? sino(said) : native(said)}`, i === 0]; }));
            return ask('수를 바르게 읽은 것은?', rows, true, { explain: `${reads(ns[0])}`, facts: { rule: 'teen' } });
          }, { standard: COUNT }),
          T('teen-pic-read', '그림을 세어 쓰고 읽은 짝', '①13 심8', (d) => {
            // 틀린 보기: 수는 맞고 읽기가 틀린 것, 하나 더 센 것(읽기는 그 수에 맞거나 틀리거나)
            const k = d.int(2, 8), n = 10 + k;
            const rows = d.shuffle([[n, n], [n, n - 1], [n + 1, n], [n + 1, n + 1]]).map(([x, y]) => [`${x}, ${native(y)}`, x === n && y === n]);
            return ask('사탕의 수를 쓰고 바르게 읽은 것은?', rows, true, { figure: bundles(1, k, { kind: 'bag' }), explain: `10개씩 묶음 1개와 낱개 ${k}개이므로 ${n}이다. ${josa(n, '은/는')} ${called(native(n))} 읽는다.` });
          }, { standard: COUNT }),
          T('teen-pic-not', '그림의 수를 나타내지 않는 것', '①14', (d) => {
            const k = d.int(2, 8), n = 10 + k, off = d.pick([-1, 1]), wrong = d.bool() ? sino(n + off) : native(n + off);
            const rows = d.shuffle([[String(n), true], [sino(n), true], [native(n), true], [wrong, false]]);
            return ask('연결 모형의 수를 나타내지 않는 것은?', rows, false, { figure: bundles(1, k), explain: `연결 모형은 ${n}개이다. ${reads(n)} ${quoted(wrong, '은/는')} ${n + off}이다.` });
          }, { standard: COUNT }),
          T('teen-odd', '나타내는 수가 다른 하나(십몇)', '①15 심11', (d) => {
            const k = d.int(2, 8), n = 10 + k, off = d.pick([-1, 1]);
            const same = d.shuffle([[sino(n), n], [native(n), n], [`10개씩 묶음 1개와 낱개 ${k}개인 수`, n], [`10보다 ${k}만큼 더 큰 수`, n], [String(n), n]]).slice(0, 3);
            const rows = d.shuffle(same.concat([d.pick([[native(n + off), n + off], [sino(n + off), n + off], [String(n + off), n + off]])]));
            return C('나타내는 수가 다른 하나는?', rows.map((row) => row[0]), rows.findIndex((row) => row[1] !== n), { explain: `「${rows.find((row) => row[1] !== n)[0]}」만 ${josa(n + off, '을/를')} 나타낸다. 나머지는 모두 ${josa(n, '을/를')} 나타낸다.`, facts: { rule: 'teen', big: { odd: rows.map((row) => String(row[1])) } } });
          }),
          T('teen-swap', '십몇을 잘못 나타낸 것', '심10', (d) => {
            // 10개씩 묶음의 수와 낱개의 수를 뒤바꾼 것을 섞는다(뒤바꾼 수가 50을 넘지 않게 12, 13, 14만 쓴다).
            const n = d.pick([12, 13, 14]), k = n % 10;
            const rows = d.shuffle([[sino(n), true], [native(n), true], [`10개씩 묶음 1개와 낱개 ${k}개인 수`, true], [`10개씩 묶음 ${k}개와 낱개 1개인 수`, false]]);
            return ask(`${josa(n, '을/를')} 잘못 나타낸 것은?`, rows, false, { explain: `${josa(n, '은/는')} 10개씩 묶음 1개와 낱개 ${k}개인 수이다. 10개씩 묶음 ${k}개와 낱개 1개인 수는 ${k * 10 + 1}이다.` });
          }),
          T('teen-cmp-say', '십몇의 크기를 바르게 말한 것', '①16 심12', (d) => {
            const ns = d.shuffle(range(11, 19)).slice(0, 8), pairs = [0, 1, 2, 3].map((i) => [ns[2 * i], ns[2 * i + 1]]);
            const rows = d.shuffle(pairs.map(([x, y], i) => [`${josa(x, '은/는')} ${y}보다 ${(i === 0) === (x > y) ? '크다' : '작다'}.`, i === 0]));
            const [x, y] = pairs[0];
            return ask('두 수의 크기를 바르게 말한 것은?', rows, true, { explain: `10개씩 묶음의 수가 같으므로 낱개의 수를 비교한다. ${josa(x, '은/는')} ${y}보다 ${x > y ? '크다' : '작다'}.` });
          }, { standard: ORDER }),
          T('teen-pic-cmp', '그림의 수와 십몇의 크기 비교', '①17 심12', (d) => {
            const k = d.int(1, 8), n = 10 + k, m = d.until(() => d.int(11, 19), (v) => v !== n && Math.abs(v - n) <= 3);
            return ask(`연결 모형의 수는 ${m}보다 □. □에 알맞은 말은?`, [['크다', n > m], ['작다', n < m]], true, { figure: bundles(1, k), explain: `연결 모형은 ${n}개이다. ${josa(n, '은/는')} ${m}보다 ${n > m ? '크다' : '작다'}.` });
          }, { standard: ORDER }),
          T('teen-two-say', '다르게 말한 두 십몇의 비교', '①18', (d) => {
            const [a, b] = d.shuffle(NAMES).slice(0, 2), k = d.int(1, 9), x = 10 + k, y = d.until(() => d.int(11, 19), (v) => v !== x), flip = d.bool();
            const said = [`10개씩 묶음 1개와 낱개 ${k}개인 수`, native(y)], values = [x, y], exprs = [`10*1+${k}`, String(y)], order = flip ? [1, 0] : [0, 1];
            return C('더 큰 수를 말한 사람은?', [a, b], values[order[0]] > values[order[1]] ? 0 : 1, {
              figure: lines([`${a}: ${said[order[0]]}`, `${b}: ${said[order[1]]}`]), explain: `10개씩 묶음 1개와 낱개 ${k}개인 수는 ${x}이고, ${josa(native(y), '은/는')} ${y}이다. ${josa(Math.max(x, y), '이/가')} 더 크다.`,
              facts: { choose: { exprs: order.map((i) => exprs[i]), rule: 'max' }, unseen: [y] }
            });
          }, { standard: ORDER }),
          T('teen-leftover', '10개를 담고 남는 낱개', '①19', (d) => {
            const n = d.int(11, 19);
            return N(`사과 ${n}개 가운데 10개를 상자에 담았다. 남은 사과는 몇 개인가?`, n - 10, { unit: '개', explain: `${josa(n, '은/는')} 10개씩 묶음 1개와 낱개 ${n - 10}개이다. 남은 사과는 ${n - 10}개이다.`, facts: { calc: [[`${n}%10`, 0]] } });
          }),
          T('teen-pic-next', '그림의 수보다 1개 더 많은 수', '심9', (d) => {
            const k = d.int(1, 8), n = 10 + k;
            return N('초콜릿은 그림의 사탕보다 1개 더 많다. 초콜릿은 몇 개인가?', n + 1, { unit: '개', figure: bundles(1, k, { kind: 'bag' }), explain: `사탕은 ${n}개이다. ${n}보다 1만큼 더 큰 수는 ${n + 1}이다.`, facts: { calc: [[`10*1+${k}+1`, 0]] } });
          }, { standard: ORDER })
        ]
      },
      {
        id: 'split', title: '19까지의 수 모으기와 가르기', standard: SPLIT,
        types: [
          T('split-join', '두 수 모으기', '①20', (d) => {
            const a = d.int(2, 9), b = d.int(Math.max(2, 11 - a), 9);
            return N('두 수를 모았다. □에 알맞은 수는?', a + b, { figure: branch('join', a, b, '□'), explain: becomes(a, b, a + b), facts: { rule: 'upto19', calc: [[`${a}+${b}`, 0]] } });
          }),
          T('split-pic-join', '그림을 보고 모으기', '①21 심13', (d) => {
            const a = d.int(5, 9), b = d.int(Math.max(2, 11 - a), 9);
            return N('두 접시의 구슬을 모으면 모두 몇 개인가?', a + b, { unit: '개', figure: plate(a) + plate(b), explain: `구슬은 ${a}개와 ${b}개이다. ${becomes(a, b, a + b)}`, facts: { calc: [[`${a}+${b}`, 0]] } });
          }),
          T('split-part', '십몇을 가른 한쪽 수', '①22', (d) => {
            const n = d.int(11, 18), a = d.int(Math.max(2, n - 9), Math.min(9, n - 2)), first = d.bool();
            return N(`${josa(n, '을/를')} 두 수로 갈랐다. □에 알맞은 수는?`, n - a, { figure: first ? branch('split', a, '□', n) : branch('split', '□', a, n), explain: splits(n, a, n - a), facts: { rule: 'upto19', calc: [[`${n}-${a}`, 0]] } });
          }),
          T('split-join-part', '모아서 십몇이 되는 한쪽 수', '①22', (d) => {
            const n = d.int(11, 18), a = d.int(Math.max(2, n - 9), Math.min(9, n - 2)), first = d.bool();
            return N(`두 수를 모아 ${josa(n, '이/가')} 되었다. □에 알맞은 수는?`, n - a, { figure: first ? branch('join', '□', a, n) : branch('join', a, '□', n), explain: becomes(a, n - a, n), facts: { rule: 'upto19', calc: [[`${n}-${a}`, 0]] } });
          }),
          T('split-pic-part', '그림을 보고 가르기', '①23 심13', (d) => {
            const n = d.int(11, 17), a = d.int(Math.max(3, n - 9), Math.min(9, n - 3)), b = n - a;
            return M(`구슬 ${n}개를 색깔에 따라 두 수로 가르시오.`, [{ label: '파란 구슬', answer: a, unit: '개' }, { label: '노란 구슬', answer: b, unit: '개' }], {
              figure: pile(n, { on: a }), explain: `파란 구슬은 ${a}개, 노란 구슬은 ${b}개이다. ${splits(n, a, b)}`, facts: { rule: 'upto19', calc: [[`${n}-${b}`, 0], [`${n}-${a}`, 1]] }
            });
          }),
          T('split-table', '한 수를 여러 가지로 가르기', '①24 심14·15', (d) => {
            // 셋째 칸은 십몇과 한 자리 수로 가른다(12를 11과 1로).
            const n = d.int(12, 16), [a, b] = d.until(() => d.shuffle(range(n - 9, 9)).slice(0, 2), ([p, q]) => p + q !== n), small = d.int(1, 2);
            return M(`${josa(n, '을/를')} 위와 아래의 두 수로 갈랐다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: n - a }, { label: LABELS[1], answer: n - b }, { label: LABELS[2], answer: small }], {
              figure: splitTable(n, [a, box(LABELS[1]), n - small], [box(LABELS[0]), b, box(LABELS[2])]), explain: `${josa(n, '은/는')} ${josa(a, '과/와')} ${n - a}, ${josa(n - b, '과/와')} ${b}, ${josa(n - small, '과/와')} ${josa(small, '으로/로')} 가를 수 있다.`,
              facts: { calc: [[`${n}-${a}`, 0], [`${n}-${b}`, 1], [`${n}-${n - small}`, 2]] }
            });
          }),
          T('split-right', '가르기를 바르게 한 것', '①25', (d) => {
            const ns = d.shuffle(range(12, 17)).slice(0, 4);
            const rows = d.shuffle(ns.map((n, i) => { const x = d.int(Math.max(3, n - 9), Math.min(9, n - 3)), y = n - x + (i === 0 ? 0 : d.pick([-1, 1].filter((off) => n - x + off <= 9))); return [n, x, y]; })), right = rows.find(([n, x, y]) => x + y === n);
            return C('가르기를 바르게 한 것은?', rows.map(([n, x, y]) => `${josa(n, '을/를')} ${josa(x, '과/와')} ${josa(y, '으로/로')} 가르기`), rows.findIndex(([n, x, y]) => x + y === n), {
              explain: `${becomes(right[1], right[2], right[0])} 나머지는 모은 수가 가르기 전의 수와 다르다.`, facts: { claimed: rows.map(([n, x, y]) => [`${x}+${y}`, n]), claimedWant: true }
            });
          }),
          T('split-wrong', '가르기를 잘못 한 것', '심16', (d) => {
            // 10과 몇으로 가른 것(맞는 가르기)을 하나 섞는다.
            const ns = d.shuffle(range(12, 17)).slice(0, 3), ten = d.int(12, 18);
            const made = ns.map((n, i) => { const x = d.int(Math.max(3, n - 9), Math.min(9, n - 3)); return [n, x, n - x + (i === 0 ? d.pick([-1, 1].filter((off) => n - x + off <= 9)) : 0)]; }).concat([[ten, 10, ten - 10]]);
            const rows = d.shuffle(made), bad = rows.find(([n, x, y]) => x + y !== n);
            return C('가르기를 잘못 한 것은?', rows.map(([n, x, y]) => `${josa(n, '을/를')} ${josa(x, '과/와')} ${josa(y, '으로/로')} 가르기`), rows.indexOf(bad), {
              explain: `${becomes(bad[1], bad[2], bad[1] + bad[2])} ${splits(bad[0], bad[1], bad[0] - bad[1])}`, facts: { claimed: rows.map(([n, x, y]) => [`${x}+${y}`, n]), claimedWant: false }
            });
          }),
          T('split-odd-sum', '모은 수가 다른 하나', '①26', (d) => {
            const s = d.int(11, 14), other = s + d.pick([-2, -1, 1]), mine = (sum) => range(Math.max(2, sum - 9), Math.floor(sum / 2)).map((x) => [x, sum - x]);
            const rows = d.shuffle(d.shuffle(mine(s)).slice(0, 3).concat([d.pick(mine(other))])).map(([x, y]) => (d.bool() ? [x, y] : [y, x]));
            return C('모은 수가 다른 하나는?', rows.map(([x, y]) => pairText(x, y)), rows.findIndex(([x, y]) => x + y === other), { explain: `모은 수는 차례로 ${rows.map(([x, y]) => x + y).join(', ')}이다.`, facts: { choose: { exprs: rows.map(([x, y]) => `${x}+${y}`), rule: 'odd' } } });
          }),
          T('split-pair-target', '모으면 십몇이 되는 두 수', '①27 심17', (d) => {
            const t = d.int(12, 15), sums = d.shuffle([t, t - 1, t + 1, t - 2]), mine = (sum) => range(Math.max(2, sum - 9), Math.floor(sum / 2)).map((x) => [x, sum - x]);
            const rows = sums.map((sum) => { const [x, y] = d.pick(mine(sum)); return d.bool() ? [x, y] : [y, x]; }), right = rows[sums.indexOf(t)];
            return C(`모으면 ${josa(t, '이/가')} 되는 두 수는?`, rows.map(([x, y]) => pairText(x, y)), sums.indexOf(t), {
              explain: becomes(right[0], right[1], t), facts: { rule: 'upto19', choose: { exprs: rows.map(([x, y]) => `${x}+${y}`), rule: 'equals', target: t } }
            });
          }),
          T('split-twice', '이어서 두 번 모으기', '①28', (d) => {
            const a = d.int(4, 9), b = d.int(Math.max(2, 11 - a), Math.min(9, 14 - a)), c = d.int(2, Math.min(6, 19 - a - b));
            return M('모으기를 두 번 하였다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: a + b }, { label: LABELS[1], answer: a + b + c }], {
              figure: branch2(a, b, c), explain: `${becomes(a, b, a + b)} ${becomes(a + b, c, a + b + c)}`, facts: { calc: [[`${a}+${b}`, 0], [`${a}+${b}+${c}`, 1]] }
            });
          }),
          T('split-word', '나누어 가진 수', '①29', (d) => {
            const n = d.int(11, 16), a = d.int(Math.max(3, n - 9), Math.min(9, n - 3));
            return N(`사탕 ${n}개를 두 손에 나누어 쥐었다. 왼손에 ${a}개가 있다. 오른손에는 몇 개가 있는가?`, n - a, { unit: '개', explain: `${splits(n, a, n - a)} 오른손에는 ${n - a}개가 있다.`, facts: { calc: [[`${n}-${a}`, 0]] } });
          })
        ]
      },
      {
        id: 'tens', title: '10개씩 묶어 세기(몇십)', standard: PLACE,
        types: [
          T('tens-count', '몇십은 10개씩 묶음이 몇 개', '①31', (d) => {
            const t = d.int(2, 5);
            return N(`${josa(t * 10, '은/는')} 10개씩 묶음이 몇 개인 수인가?`, t, { unit: '개', explain: `10개씩 묶음이 ${t}개이면 ${t * 10}이다.`, facts: { calc: [[`${t * 10}/10`, 0]] } });
          }),
          T('tens-make', '10개씩 묶음이 몇 개인 수', '①31', (d) => {
            const t = d.int(2, 5);
            return N(`10개씩 묶음이 ${t}개인 수는?`, t * 10, { explain: `10개씩 묶음이 ${t}개이면 ${t * 10}이다.`, facts: { calc: [[`10*${t}`, 0]] } });
          }),
          T('tens-pic', '그림을 10개씩 묶어 세기', '①32·34 심20', (d) => {
            const t = d.int(2, 5);
            return M('10개씩 묶음은 몇 개이고, 구슬은 모두 몇 개인가?', [{ label: '묶음', answer: t, unit: '개' }, { label: '구슬', answer: t * 10, unit: '개' }], {
              figure: bundles(t, 0, { kind: 'bag' }), explain: `10개씩 묶음이 ${t}개이므로 구슬은 모두 ${t * 10}개이다.`, facts: { calc: [[`${t}`, 0], [`10*${t}`, 1]] }
            });
          }),
          T('tens-read-two', '몇십을 두 가지로 읽기', '①32·33 심20', (d) => {
            const [n, m, other] = d.shuffle([20, 30, 40, 50]);
            const rows = d.shuffle([[`${sino(n)}, ${native(n)}`, true], [`${sino(n)}, ${native(m)}`, false], [`${sino(m)}, ${native(n)}`, false], [`${sino(other)}, ${native(other)}`, false]]);
            return ask(`${josa(n, '을/를')} 두 가지로 바르게 읽은 것은?`, rows, true, { explain: `${reads(n)}`, facts: { rule: 'tens' } });
          }, { standard: COUNT }),
          T('tens-match', '몇십과 읽은 말의 짝', '①34', (d) => {
            // 스물·서른·마흔·쉰은 서로 바꾸어 읽기 쉽다.
            const ns = d.shuffle([20, 30, 40, 50]);
            const rows = d.shuffle(ns.map((n, i) => { const said = i === 0 ? n : d.pick([20, 30, 40, 50].filter((v) => v !== n)); return [`${n} – ${i % 2 ? sino(said) : native(said)}`, i === 0]; }));
            return ask('수와 읽은 말을 바르게 짝 지은 것은?', rows, true, { explain: '20은 이십·스물, 30은 삼십·서른, 40은 사십·마흔, 50은 오십·쉰이라고 읽는다.' });
          }, { standard: COUNT }),
          T('tens-pic-read', '그림의 몇십 읽기', '①34 심20', (d) => {
            const t = d.int(2, 5), rows = d.shuffle([2, 3, 4, 5].map((v) => [native(v * 10), v === t]));
            return ask('연결 모형의 수를 바르게 읽은 것은?', rows, true, { figure: bundles(t, 0), explain: `10개씩 묶음이 ${t}개이므로 ${t * 10}이다. ${josa(t * 10, '은/는')} ${called(native(t * 10))} 읽는다.` });
          }, { standard: COUNT }),
          T('tens-above', '몇십보다 큰 수·작은 수 고르기', '①36', (d) => {
            // 숫자·한자말·우리말을 섞는다. 10개씩 묶음의 수가 많은 수가 더 크다.
            const [base, up] = d.pick([[40, true], [30, true], [20, false], [30, false]]), tens = [10, 20, 30, 40, 50], form = (v) => [d.pick([String(v), sino(v), native(v)]), v];
            const hit = form(d.pick(tens.filter((v) => (up ? v > base : v < base)))), rows = d.shuffle(tens.filter((v) => (up ? v < base : v > base)).map(form).concat([hit]));
            return C(`${base}보다 ${up ? '큰' : '작은'} 수는?`, rows.map((row) => row[0]), rows.indexOf(hit), {
              explain: `수로 쓰면 차례로 ${rows.map((row) => row[1]).join(', ')}이다. 10개씩 묶음의 수가 ${base / 10}개보다 ${up ? '많은' : '적은'} 수는 ${hit[1]}이다.`, facts: { choose: { exprs: rows.map((row) => String(row[1])), rule: up ? 'onlyAbove' : 'onlyBelow', target: base }, unseen: tens }
            });
          }, { standard: ORDER }),
          T('tens-word-cmp', '10개씩 몇 봉지인 두 양의 비교', '①37 심21', (d) => {
            const [x, y] = d.shuffle(['귤', '감', '밤', '사탕']).slice(0, 2), [a, b] = d.shuffle([2, 3, 4, 5]);
            return C(`${josa(x, '은/는')} 10개씩 ${a}봉지, ${josa(y, '은/는')} 10개씩 ${b}봉지 있다. 더 많은 것은?`, [x, y], a > b ? 0 : 1, {
              explain: `${josa(x, '은/는')} ${a * 10}개, ${josa(y, '은/는')} ${b * 10}개이다. 10개씩 묶음의 수가 많은 쪽이 더 많다.`, facts: { choose: { exprs: [`10*${a}`, `10*${b}`], rule: 'max' } }
            });
          }, { standard: ORDER }),
          T('tens-pack', '몇십을 10개씩 담기', '①38', (d) => {
            const t = d.int(2, 5);
            return N(`쿠키 ${t * 10}개를 한 봉지에 10개씩 담는다. 봉지는 몇 개가 되는가?`, t, { unit: '개', explain: `${josa(t * 10, '은/는')} 10개씩 묶음이 ${t}개인 수이다. 봉지는 ${t}개가 된다.`, facts: { calc: [[`${t * 10}/10`, 0]] } });
          })
        ]
      },
      { id: 'num', title: '50까지의 수', standard: PLACE, types: [] },
      { id: 'order', title: '수의 순서', standard: ORDER, types: [] },
      { id: 'compare', title: '수의 크기 비교', standard: ORDER, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
