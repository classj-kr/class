// 1학년 2학기 1단원 100까지의 수 — 단원 틀, 그림 도구, 기본 문항(몇십, 99까지의 수, 수의 순서).
// 수집해 둔 평가 자료(미래엔·아이스크림미디어·천재)에서 뽑은 꼴 목록(기본꼴 56꼴, 심화꼴 35꼴)을 처음부터 끝까지 대조하여 실었다.
// 수의 크기 비교, 짝수와 홀수, 실력 문항은 1-2-1b.js에 있다. 꼴 번호: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 영역은 수와 연산. 성취기준 [2수01-01] 100까지의 수 개념·세기·읽기·쓰기, [2수01-02] 위치적 기수법(이 단원에서는 10개씩 묶음과 낱개),
// [2수01-03] 수의 계열과 크기 비교 가운데 100까지의 수.
//
// 싣는 기준
//  - 교육과정: 「두 자리 수를 10개씩 묶음과 낱개로 나타내게 함으로써 위치적 기수법의 기초 개념을 형성하게 한다」
//    → 「십의 자리·일의 자리·두 자리 수」라는 말을 쓰지 않고 「10개씩 묶음」「낱개」「몇십몇」만 쓴다.
//  - 교육과정: 「수를 '여덟', '마흔아홉', '칠십육' … 과 같이 한글로 쓰게 하는 것은 지양한다」
//    → 읽는 말은 모두 고르기로 묻고, 답 칸에는 숫자만 받는다(①15·22, 심3의 읽어 쓰기는 읽는 말 고르기로 바꾸어 실었다).
//  - 몇십과 몇십몇은 차시가 달라 같은 물음도 따로 싣고 facts.rule 에 이름을 단다.
//  - 수를 읽는 말은 엔진과 따로 쓴 표(WORDS)로 다시 읽어 값과 읽는 방법(한자말·우리말·섞임)을 가린다. 문항은 그 값으로 답을 정한다.
//
// 뺀 것과 까닭
//  - 작도·잇기: 수를 순서대로 잇기(①33 심19). 수와 읽는 말 잇기(①4·13 심2)는 짝 고르기로 바꾸어 실었다.
//  - 놀이: 갈림길에서 큰 수 따라가기(①44) — 두 수의 비교를 되풀이할 뿐이고 길 그림이 있어야 한다.
//  - 조건 풀이: 조건 둘·셋에 맞는 수(①46 심35), □가 10개씩 묶음의 수 자리에 든 비교(①45 변형, 심28 — 경계가 되는 수를 넣어 따지는 것이 어려움의 대부분).
//  - 범위 밖: 20을 넘는 수의 짝수·홀수(①50·51의 일부, ①56, 심31·33·34) — 교육과정이 20 이하로 못박았다. 수를 20 이하로 바꾼 꼴은 실었다.
//  - 뒤 단원: 수로 준 양에서 여러 묶음을 덜어 내는 것(심10의 66개에서 2봉지)은 「몇십몇 − 몇십」의 뺄셈이라, 묶음의 수로 준 것만 실력에 실었다.
//  - 같은 문제: 그림을 세어 읽기(①13·15 변형)는 「그림의 수를 읽은 말」(tens-picture-read)과, 한 줄 수 배열의 ㉠(①29 변형)은 순서대로 빈칸 채우기와,
//    수의 줄을 채우고 비교하기(①36 변형)는 빈칸 채우기·두 수의 비교와, 남는 것만 묻는 것(①18 대표)은 접시 수와 남는 수를 함께 묻는 것과 같다.
//    두 사람의 말에서 바르게 읽은 사람(①23 심6)은 상황에 알맞게 읽은 말 고르기(n99-context)와 같은 일이라 따로 싣지 않았다.
//    개수(「신발장이 육십 개」)는 두 읽기가 다 쓰여 시비가 생기므로 번호·층(한자말)과 나이(우리말)만 물었다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, NAMES, box, lines, josa, N, M, C } = B.kit;
  const COUNT = '2수01-01', PLACE = '2수01-02', ORDER = '2수01-03';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});

  // ── 수를 읽는 말 ─────────────────────────────────────────────
  const SINO_TENS = ['', '십', '이십', '삼십', '사십', '오십', '육십', '칠십', '팔십', '구십'], SINO_ONES = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
  const NAT_TENS = ['', '열', '스물', '서른', '마흔', '쉰', '예순', '일흔', '여든', '아흔'], NAT_ONES = ['', '하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉'];
  // 「살」처럼 세는 말 앞에서 바뀌는 꼴(일흔세 살)
  const NAT_COUNT = ['', '한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉'];
  const tenOf = (n) => Math.floor(n / 10);
  const sino = (n) => (n === 100 ? '백' : SINO_TENS[tenOf(n)] + SINO_ONES[n % 10]);
  const nat = (n) => NAT_TENS[tenOf(n)] + NAT_ONES[n % 10];
  const natCount = (n) => NAT_TENS[tenOf(n)] + NAT_COUNT[n % 10];
  const either = (d, n) => (d.bool() ? sino(n) : nat(n));
  // 읽는 말을 다시 수로 읽는 표(위의 만드는 표와 따로 적었다). 앞에서부터 맞는 낱말을 떼어 낸다 — 긴 낱말이 먼저 오게 적는다.
  const WORDS = [
    ['구십', 90, 's'], ['팔십', 80, 's'], ['칠십', 70, 's'], ['육십', 60, 's'], ['오십', 50, 's'], ['사십', 40, 's'], ['삼십', 30, 's'], ['이십', 20, 's'], ['십', 10, 's'],
    ['아흔', 90, 'n'], ['여든', 80, 'n'], ['일흔', 70, 'n'], ['예순', 60, 'n'], ['쉰', 50, 'n'], ['마흔', 40, 'n'], ['서른', 30, 'n'], ['스물', 20, 'n'], ['열', 10, 'n'],
    ['하나', 1, 'n'], ['둘', 2, 'n'], ['셋', 3, 'n'], ['넷', 4, 'n'], ['다섯', 5, 'n'], ['여섯', 6, 'n'], ['일곱', 7, 'n'], ['여덟', 8, 'n'], ['아홉', 9, 'n'],
    ['한', 1, 'n'], ['두', 2, 'n'], ['세', 3, 'n'], ['네', 4, 'n'],
    ['백', 100, 's'], ['일', 1, 's'], ['이', 2, 's'], ['삼', 3, 's'], ['사', 4, 's'], ['오', 5, 's'], ['육', 6, 's'], ['칠', 7, 's'], ['팔', 8, 's'], ['구', 9, 's']
  ];
  // { value: 나타내는 수, kind: 's' 한자말 | 'n' 우리말 | 'mixed' 두 가지를 섞음 }
  function readWord(text) {
    let rest = String(text).replace(/\s/g, ''), value = 0;
    const kinds = [];
    while (rest) {
      const hit = WORDS.find((row) => rest.startsWith(row[0]));
      if (!hit) throw new Error('읽을 수 없는 말: ' + text);
      value += hit[1]; rest = rest.slice(hit[0].length);
      if (!kinds.includes(hit[2])) kinds.push(hit[2]);
    }
    return { value, kind: kinds.length > 1 ? 'mixed' : kinds[0] };
  }
  const wordValue = (text) => readWord(text).value;
  // 숫자, 읽는 말, 「10개씩 묶음 a개와 낱개 b개」를 모두 수로 바꾼다.
  function valueOfText(text) {
    const s = String(text).trim(), m = s.match(/^10개씩 묶음 (\d+)개(?:와 낱개 (\d+)개)?$/);
    if (/^\d+$/.test(s)) return Number(s);
    return m ? Number(m[1]) * 10 + Number(m[2] || 0) : wordValue(s);
  }
  const quoted = (word, pair) => '「' + word + '」' + (pair ? josa(word, pair).slice(String(word).length) : '');
  const kindWord = (n) => (n % 2 ? '홀수' : '짝수');

  // ── 그림 ─────────────────────────────────────────────────────
  // 연결 모형: 10개씩 이은 막대 t개와 낱개 o개. 낱개는 다섯 개씩 끊어 세로로 놓는다(낱개가 10개를 넘는 그림도 그린다).
  function rods(t, o, scale) {
    const u = 7, top = 4, H = u * 10;
    let x = 5, body = '';
    for (let i = 0; i < t; i += 1) {
      let ticks = '';
      for (let k = 1; k < 10; k += 1) ticks += 'M' + x + ' ' + (top + k * u) + 'h' + u;
      body += '<g class="mb-rod"><rect x="' + x + '" y="' + top + '" width="' + u + '" height="' + H + '" rx="1"/><path d="' + ticks + '" style="stroke-width:0.6"/></g>';
      x += u + 4;
    }
    if (t && o) x += 7;
    for (let i = 0; i < o; i += 1) body += '<rect class="mb-one" x="' + (x + Math.floor(i / 5) * (u + 5)) + '" y="' + (top + H - u - (i % 5) * (u + 3)) + '" width="' + u + '" height="' + u + '" rx="1"/>';
    if (o) x += Math.ceil(o / 5) * (u + 5) - 5;
    const width = Math.max(x + 5, 48);
    return '<svg class="mb-dots" viewBox="0 0 ' + width + ' ' + (top * 2 + H) + '" width="' + Math.round(width * (scale || 1.45)) + '" role="img" aria-label="10개씩 묶음 ' + t + '개' + (o ? ', 낱개 ' + o + '개' : '') + '">' + body + '</svg>';
  }
  // 10개씩 담은 판(상자) t개와 낱개 o개. 판은 한 줄에 셋씩(10판은 다섯씩) 놓고, 낱개는 오른쪽에 다섯 개씩 끊어 놓는다.
  function trays(t, o, scale, fill) {
    const p = 8.4, r = 3.3, bw = 5 * p + 3, bh = 2 * p + 3, cols = t === 10 ? 5 : Math.min(3, t), rows = Math.ceil(t / cols);
    const one = (cx, cy) => '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + r + '" style="fill:' + (fill || '#fde9a8') + ';stroke:#a86a00;stroke-width:0.7"/>';
    let body = '';
    for (let i = 0; i < t; i += 1) {
      const x = 4 + (i % cols) * (bw + 5), y = 4 + Math.floor(i / cols) * (bh + 5);
      body += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw + '" height="' + bh.toFixed(1) + '" rx="3" style="fill:#eef2f7;stroke:#64748b;stroke-width:0.9"/>';
      for (let k = 0; k < 10; k += 1) body += one(x + 1.5 + p / 2 + (k % 5) * p, y + 1.5 + p / 2 + Math.floor(k / 5) * p);
    }
    const left = 4 + cols * (bw + 5) + 5;
    for (let i = 0; i < o; i += 1) body += one(left + p / 2 + (i % 5) * p, 5.5 + p / 2 + Math.floor(i / 5) * p);
    const width = Math.ceil((o ? left + 5 * p : left - 10) + 4), height = Math.ceil(4 + rows * (bh + 5) - 5 + 4);
    return '<svg class="mb-dots" viewBox="0 0 ' + width + ' ' + height + '" width="' + Math.round(width * (scale || 1.3)) + '" role="img" aria-label="10개씩 묶음 ' + t + '개' + (o ? ', 낱개 ' + o + '개' : '') + '">' + body + '</svg>';
  }
  const THING_INK = { 구슬: ['#f5b942', '#a86a00'], 사과: ['#f87171', '#b42318'], 풍선: ['#93c5fd', '#1d4ed8'] };
  const thing = (noun, cx, cy, r) => '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" style="fill:' + THING_INK[noun][0] + ';stroke:' + THING_INK[noun][1] + ';stroke-width:0.8"/>';
  // 물건 n개를 한 줄에 다섯 개씩 놓는다. o.pitch: 물건 사이의 간격, o.scale: 그림 배율.
  function things(n, noun, o) {
    const opt = o || {}, p = opt.pitch || 15, r = p * 0.36, rows = Math.ceil(n / 5), width = 8 + 5 * p, height = Math.max(8 + rows * p, 26);
    let body = '';
    for (let i = 0; i < n; i += 1) body += thing(noun, 4 + p / 2 + (i % 5) * p, 4 + p / 2 + Math.floor(i / 5) * p, r);
    return '<svg class="mb-dots" viewBox="0 0 ' + width + ' ' + height + '" width="' + Math.round(width * (opt.scale || 1.25)) + '" role="img" aria-label="' + noun + ' ' + n + '개">' + body + '</svg>';
  }
  // 둘씩 묶은 그림: 두 개씩 고리로 묶고, 남는 하나는 묶지 않는다. 다섯 묶음마다 조금 띄운다.
  function pairs(n, noun) {
    const p = Math.floor(n / 2), rest = n % 2, at = (i) => 13 + i * 19 + (i >= 5 ? 7 : 0);
    let body = '';
    for (let i = 0; i < p; i += 1) body += '<rect class="mb-loop" x="' + (at(i) - 7.5) + '" y="4" width="15" height="33" rx="7.5"/>' + thing(noun, at(i), 12.5, 5.2) + thing(noun, at(i), 28.5, 5.2);
    if (rest) body += thing(noun, at(p), 20.5, 5.2);
    const width = at(p + rest - 1) + 13;
    return '<svg class="mb-dots" viewBox="0 0 ' + width + ' 41" width="' + Math.round(width * 1.25) + '" role="img" aria-label="' + josa(noun, '을/를') + ' 둘씩 묶은 그림: 묶음 ' + p + '개, ' + (rest ? '남는 것 1개' : '남는 것 없음') + '">' + body + '</svg>';
  }
  // 수 배열표: start 부터 count 개의 수를 한 줄에 cols 칸씩 차례로 쓴다. shown: 수를 적는 칸(0부터 센 차례), tags: { 칸: '㉠' }. 나머지 칸은 비워 둔다.
  function grid(start, count, cols, shown, tags) {
    const cw = cols === 10 ? 26 : 38, ch = 25, rows = Math.ceil(count / cols), width = cols * cw + 2, height = rows * ch + 2;
    let body = '';
    for (let i = 0; i < count; i += 1) {
      const x = 1 + (i % cols) * cw, y = 1 + Math.floor(i / cols) * ch, tag = tags[i];
      body += '<rect x="' + x + '" y="' + y + '" width="' + cw + '" height="' + ch + '" style="fill:' + (tag ? '#e6eefc' : '#fff') + ';stroke:#8a96a3;stroke-width:0.8"/>';
      if (tag || shown.includes(i)) body += '<text class="mb-axis-label" style="font-size:' + (tag ? 13.5 : 12.5) + 'px;font-weight:' + (tag ? 700 : 600) + (tag ? ';fill:#1d4ed8' : '') + '" x="' + (x + cw / 2) + '" y="' + (y + ch / 2 + 4.5) + '" text-anchor="middle">' + (tag || start + i) + '</text>';
    }
    const said = Object.keys(tags).map((i) => tags[i] + '은 ' + start + '에서 ' + i + '칸 뒤').join(', ');
    return '<svg class="mb-dots" viewBox="0 0 ' + width + ' ' + height + '" width="' + width + '" role="img" aria-label="수 배열표: ' + start + '부터 차례로 쓴다. 한 줄에 ' + cols + '칸. 적힌 수 ' + shown.map((i) => start + i).join(', ') + '. ' + said + '">' + body + '</svg>';
  }
  // 수를 한 줄로 늘어놓은 띠. 칸에는 수나 ㉠ 같은 이름표를 넣는다.
  function strip(cells) {
    const cw = 44, ch = 30;
    const body = cells.map((cell, i) => {
      const tag = typeof cell !== 'number';
      return '<rect x="' + (1 + i * cw) + '" y="1" width="' + cw + '" height="' + ch + '" style="fill:' + (tag ? '#e6eefc' : '#fff') + ';stroke:#8a96a3;stroke-width:0.8"/>'
        + '<text class="mb-axis-label" style="font-size:15px;font-weight:' + (tag ? 700 : 600) + (tag ? ';fill:#1d4ed8' : '') + '" x="' + (1 + i * cw + cw / 2) + '" y="21.5" text-anchor="middle">' + cell + '</text>';
    }).join('');
    return '<svg class="mb-dots" viewBox="0 0 ' + (cells.length * cw + 2) + ' ' + (ch + 2) + '" width="' + (cells.length * cw + 2) + '" role="img" aria-label="차례로 쓴 수: ' + cells.join(', ') + '">' + body + '</svg>';
  }
  const versus = (left, right) => '<div class="mb-versus"><span class="mb-expr">' + left + '</span><span class="mb-ring"></span><span class="mb-expr">' + right + '</span></div>';
  // 수 넷을 차례로 쓴 줄이 1씩 커지는가
  const inOrder = (list) => list.every((v, i) => i === 0 || v === list[i - 1] + 1);

  // 몇십몇: 10개씩 묶음의 수와 낱개의 수가 서로 다른 수
  const twoDigit = (d, loT, hiT, loO, hiO) => { const t = d.int(loT || 5, hiT || 9), o = d.until(() => d.int(loO || 1, hiO || 9), (v) => v !== t); return [t, o, t * 10 + o]; };
  // 틀리게 읽은 수: 두 숫자를 바꾼 수, 10개씩 묶음의 수가 하나 다른 수, 낱개의 수가 하나 다른 수
  const wrongOf = (d, t, o, kind) => (kind === 'swap' ? o * 10 + t : kind === 'tens' ? (t === 9 ? 8 : t === 5 ? 6 : t + (d.bool() ? 1 : -1)) * 10 + o : t * 10 + (o === 9 ? 8 : o === 1 ? 2 : o + (d.bool() ? 1 : -1)));
  const readBoth = (n) => `${josa(n, '은/는')} ${quoted(sino(n))} 또는 ${quoted(nat(n), '이라고/라고')} 읽는다.`;

  // 같은 단원의 b 파일이 쓰는 도구
  B.kit.g121 = { SINO_TENS, SINO_ONES, NAT_TENS, NAT_ONES, NAT_COUNT, tenOf, sino, nat, natCount, either, readWord, wordValue, valueOfText, quoted, kindWord, readBoth, twoDigit, rods, trays, things, pairs, grid, strip, versus };

  B.addUnit({
    id: '1-2-1', grade: 1, semester: 2, no: 1, title: '100까지의 수', version: 1,
    groups: [
      {
        id: 'tens', title: '몇십', standard: COUNT,
        types: [
          T('tens-count', '10개씩 묶음을 세어 몇십 쓰기', '①1 심1', (d) => {
            const k = d.int(6, 9);
            return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: k }, { label: LABELS[1], answer: k * 10 }], {
              figure: trays(k, 0) + lines([`달걀은 10개씩 묶음 ${box(LABELS[0])}개이므로 모두 ${box(LABELS[1])}개이다.`]),
              explain: `10개씩 묶음이 ${k}개이므로 ${k * 10}이다.`, facts: { calc: [[String(k), 0], [`10*${k}`, 1]] }
            });
          }),
          T('tens-make', '10개씩 묶음 몇 개인 수 쓰기', '①2', (d) => {
            const k = d.int(6, 9);
            return N(`10개씩 묶음 ${k}개인 수를 쓰면?`, k * 10, { explain: `10개씩 묶음 ${k}개는 ${k * 10}이다.`, facts: { calc: [[`10*${k}`, 0]] } });
          }),
          T('tens-bundles', '몇십은 10개씩 묶음 몇 개', '①2', (d) => {
            const k = d.int(6, 9);
            return N(`${josa(k * 10, '은/는')} 10개씩 묶음이 몇 개인 수인가?`, k, { unit: '개', explain: `10개씩 묶음 ${k}개가 ${k * 10}이다.`, facts: { calc: [[`${k * 10}/10`, 0]] } });
          }),
          T('tens-read', '몇십을 읽은 말 고르기', '①3 심2', (d) => {
            const n = d.int(6, 9) * 10, opts = d.shuffle([60, 70, 80, 90].map(nat));
            return C(`${josa(n, '을/를')} 바르게 읽은 것은?`, opts, opts.indexOf(nat(n)), { explain: readBoth(n), facts: { rule: 'tens', claimed: opts.map((w) => [String(n), wordValue(w)]), claimedWant: true } });
          }),
          T('tens-write', '읽는 말을 몇십으로 쓰기', '①16', (d) => {
            const n = d.int(6, 9) * 10, w = nat(n);
            return N(`${quoted(w, '을/를')} 수로 쓰면?`, n, { explain: `${quoted(w, '은/는')} ${n}이다. ${quoted(sino(n), '이라고도/라고도')} 읽는다.`, facts: { parts: [[String(wordValue(w)), 0]] } });
          }),
          T('tens-picture-read', '그림의 수를 읽은 말 고르기', '①4 심2 ①13·15 변형', (d) => {
            const k = d.int(6, 9), vals = d.shuffle([60, 70, 80, 90]), opts = vals.map((v) => either(d, v));
            return C('달걀의 수를 바르게 읽은 것은?', opts, vals.indexOf(k * 10), {
              figure: trays(k, 0), explain: `10개씩 묶음이 ${k}개이므로 ${k * 10}이다. ${readBoth(k * 10)}`, facts: { claimed: opts.map((w) => [`10*${k}`, wordValue(w)]), claimedWant: true }
            });
          }),
          T('tens-bundles-pick', '10개씩 묶음이 몇 개인 수 고르기', '①5', (d) => {
            // 맞는 수는 읽는 말로 적고, 나머지는 수와 읽는 말을 섞어 적는다(말을 수로 바꿔야 묶음의 수가 보인다)
            const k = d.int(6, 9), vals = d.shuffle([60, 70, 80, 90]), right = vals.indexOf(k * 10), styles = d.shuffle(['수', '수', '말']);
            const opts = vals.map((v, i) => (i === right || styles[i > right ? i - 1 : i] === '말' ? either(d, v) : String(v)));
            return C(`10개씩 묶음이 ${k}개인 수는?`, opts, right, {
              explain: `${quoted(opts[right], '은/는')} ${k * 10}이다. ${josa(k * 10, '은/는')} 10개씩 묶음이 ${k}개인 수이다.`, facts: { rule: 'tens', claimed: opts.map((o) => [String(k), valueOfText(o) / 10]), claimedWant: true }
            });
          }),
          T('tens-odd-one', '나타내는 수가 다른 하나(몇십)', '①6 심4', (d) => {
            const a = d.int(6, 9) * 10, b = d.until(() => d.int(5, 9) * 10, (v) => v !== a);
            const opts = d.shuffle(d.shuffle([String(a), sino(a), nat(a), `10개씩 묶음 ${a / 10}개`]).slice(0, 3).concat([either(d, b)])), values = opts.map(valueOfText);
            return C('나타내는 수가 나머지와 다른 하나는?', opts, values.indexOf(b), { explain: `${quoted(opts[values.indexOf(b)], '은/는')} ${b}이고, 나머지는 모두 ${a}이다.`, facts: { rule: 'tens', big: { odd: values.map(String) } } });
          }),
          T('tens-bundle-least', '10개씩 묶음의 수가 가장 작은 수', '①7', (d) => {
            const vals = d.shuffle([50, 60, 70, 80, 90]).slice(0, 4), styles = d.shuffle(['수', '수', '말', '말']), opts = vals.map((v, i) => (styles[i] === '수' ? String(v) : either(d, v))), values = opts.map(valueOfText);
            return C('10개씩 묶음의 수가 가장 작은 수는?', opts, values.indexOf(Math.min(...values)), {
              explain: `수로 쓰면 차례로 ${values.join(', ')}이다. 10개씩 묶음의 수는 차례로 ${values.map((v) => v / 10).join('개, ')}개이다.`, facts: { rank: { values, nth: 4 } }
            });
          }),
          T('tens-word-total', '10개씩 몇 묶음은 모두 몇 개', '①8', (d) => {
            const [what, unit] = d.pick([['공책', '권'], ['색종이', '장'], ['연필', '자루']]), k = d.int(6, 9);
            return N(`${josa(what, '이/가')} 한 묶음에 10${unit}씩 ${k}묶음 있다. ${josa(what, '은/는')} 모두 몇 ${unit}인가?`, k * 10, { unit, explain: `10개씩 묶음 ${k}개는 ${k * 10}이다.`, facts: { calc: [[`10*${k}`, 0]] } });
          }),
          T('tens-word-boxes', '몇십 개를 10개씩 담을 때 묶음의 수', '①9', (d) => {
            const [what, pack] = d.pick([['쿠키', '상자'], ['사탕', '봉지'], ['구슬', '주머니']]), k = d.int(6, 9);
            return N(`${what} ${k * 10}개를 한 ${pack}에 10개씩 담는다. ${josa(pack, '은/는')} 몇 개 필요한가?`, k, { unit: '개', explain: `${josa(k * 10, '은/는')} 10개씩 묶음 ${k}개이다.`, facts: { calc: [[`${k * 10}/10`, 0]] } });
          }),
          T('tens-word-said', '말로 준 몇십 개를 10개씩 담기', '①9 심9', (d) => {
            const k = d.int(6, 9), w = nat(k * 10);
            return N(`땅콩이 ${w} 개 있다. 한 봉지에 10개씩 담으면 몇 봉지가 되는가?`, k, { unit: '봉지', explain: `${quoted(w, '은/는')} ${k * 10}이다. ${josa(k * 10, '은/는')} 10개씩 묶음 ${k}개이다.`, facts: { parts: [[`${wordValue(w)}/10`, 0]] } });
          })
        ]
      },
      {
        id: 'upto99', title: '99까지의 수', standard: PLACE,
        types: [
          T('n99-count', '그림을 세어 10개씩 묶음, 낱개, 수 쓰기', '①10 심1', (d) => {
            const [t, o, n] = twoDigit(d);
            return M('㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: t }, { label: LABELS[1], answer: o }, { label: LABELS[2], answer: n }], {
              figure: rods(t, o) + lines([`10개씩 묶음 ${box(LABELS[0])}개와 낱개 ${box(LABELS[1])}개이므로 ${box(LABELS[2])}이다.`]),
              explain: `10개씩 묶음 ${t}개와 낱개 ${o}개는 ${n}이다.`, facts: { calc: [[String(t), 0], [String(o), 1], [`10*${t}+${o}`, 2]] }
            });
          }),
          T('n99-count-trays', '10개씩 담은 그림을 보고 수 쓰기', '①21 ①10 변형 심1', (d) => {
            const [t, o, n] = twoDigit(d);
            return N('귤을 한 상자에 10개씩 담았다. 귤은 모두 몇 개인가?', n, { unit: '개', figure: trays(t, o, 1.3, '#fdba74'), explain: `10개씩 묶음 ${t}개와 낱개 ${o}개이므로 ${n}이다.`, facts: { calc: [[`10*${t}+${o}`, 0]] } });
          }),
          T('n99-make', '10개씩 묶음과 낱개를 수로 쓰기', '①11', (d) => {
            const [t, o, n] = twoDigit(d);
            return N(`10개씩 묶음 ${t}개와 낱개 ${o}개인 수는?`, n, { explain: `10개씩 묶음 ${t}개는 ${t * 10}이다. 낱개 ${o}개가 더 있으므로 ${n}이다.`, facts: { calc: [[`10*${t}+${o}`, 0]] } });
          }),
          T('n99-split', '수를 10개씩 묶음과 낱개로 나타내기', '①12', (d) => {
            const [t, o, n] = twoDigit(d);
            return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: t }, { label: LABELS[1], answer: o }], {
              figure: lines([`${josa(n, '은/는')} 10개씩 묶음 ${box(LABELS[0])}개와 낱개 ${box(LABELS[1])}개인 수이다.`]), explain: `${josa(n, '은/는')} 10개씩 묶음 ${t}개와 낱개 ${o}개인 수이다.`,
              facts: { calc: [[`(${n}-${n}%10)/10`, 0], [`${n}%10`, 1]] }
            });
          }),
          T('n99-read-native', '몇십몇을 읽은 말 고르기(예순, 일흔 …)', '①13 심2', (d) => {
            const [t, o, n] = twoDigit(d), opts = d.shuffle([n, wrongOf(d, t, o, 'swap'), wrongOf(d, t, o, 'tens'), wrongOf(d, t, o, 'ones')].map(nat));
            return C(`${josa(n, '을/를')} 바르게 읽은 것은?`, opts, opts.indexOf(nat(n)), { explain: readBoth(n), facts: { rule: 'native', claimed: opts.map((w) => [String(n), wordValue(w)]), claimedWant: true } });
          }, { standard: COUNT }),
          T('n99-read-sino', '몇십몇을 읽은 말 고르기(육십, 칠십 …)', '①13 심2', (d) => {
            const [t, o, n] = twoDigit(d), opts = d.shuffle([n, wrongOf(d, t, o, 'swap'), wrongOf(d, t, o, 'tens'), wrongOf(d, t, o, 'ones')].map(sino));
            return C(`${josa(n, '을/를')} 바르게 읽은 것은?`, opts, opts.indexOf(sino(n)), { explain: readBoth(n), facts: { rule: 'sino', big: { names: { value: n, given: String(n) } } } });
          }, { standard: COUNT }),
          T('n99-read-both', '수를 두 가지 방법으로 읽은 것 고르기', '①15 심2·3', (d) => {
            // 틀린 보기: 일흔·여든을 헷갈린 것, 낱개의 수를 다르게 읽은 것, 육십·칠십을 헷갈린 것
            const [t, o, n] = twoDigit(d), rows = d.shuffle([[n, n], [n, wrongOf(d, t, o, 'tens')], [n, wrongOf(d, t, o, 'ones')], [wrongOf(d, t, o, 'tens'), n]]);
            const opts = rows.map(([x, y]) => `${sino(x)}, ${nat(y)}`), truth = opts.map((text) => text.split(', ').every((w) => wordValue(w) === n));
            return C(`${josa(n, '을/를')} 두 가지 방법으로 바르게 읽은 것은?`, opts, truth.indexOf(true), { explain: readBoth(n), facts: { truth, want: true } });
          }, { standard: COUNT }),
          T('n99-read-pairs-right', '수와 읽는 말의 짝에서 바른 것', '①14', (d) => {
            const tens = d.shuffle([5, 6, 7, 8, 9]), kinds = d.shuffle(['right', 'swap', 'tens', 'ones']);
            const rows = kinds.map((kind, i) => { const t = tens[i], o = d.until(() => d.int(1, 9), (v) => v !== t), x = t * 10 + o; return [x, either(d, kind === 'right' ? x : wrongOf(d, t, o, kind))]; });
            const at = kinds.indexOf('right');
            return C('수를 바르게 읽은 것은?', rows.map(([x, w]) => `${x} — ${w}`), at, { explain: readBoth(rows[at][0]), facts: { claimed: rows.map(([x, w]) => [String(x), wordValue(w)]), claimedWant: true } });
          }, { standard: COUNT }),
          T('n99-read-pairs-wrong', '수와 읽는 말의 짝에서 틀린 것', '①14', (d) => {
            const tens = d.shuffle([5, 6, 7, 8, 9]), kinds = d.shuffle(['right', 'right', 'right', d.pick(['swap', 'tens', 'ones'])]);
            const rows = kinds.map((kind, i) => { const t = tens[i], o = d.until(() => d.int(1, 9), (v) => v !== t), x = t * 10 + o; return [x, either(d, kind === 'right' ? x : wrongOf(d, t, o, kind))]; });
            const at = kinds.findIndex((kind) => kind !== 'right'), [x, w] = rows[at];
            return C('수를 잘못 읽은 것은?', rows.map((row) => `${row[0]} — ${row[1]}`), at, { explain: `${quoted(w, '은/는')} ${wordValue(w)}이다. ${readBoth(x)}`, facts: { rule: 'number', claimed: rows.map((row) => [String(row[0]), wordValue(row[1])]), claimedWant: false } });
          }, { standard: COUNT }),
          T('n99-write', '읽는 말을 몇십몇으로 쓰기', '①16', (d) => {
            const [t, o, n] = twoDigit(d), w = nat(n);
            return N(`${quoted(w, '을/를')} 수로 쓰면?`, n, { explain: `${quoted(NAT_TENS[t], '은/는')} ${t * 10}, ${quoted(NAT_ONES[o], '은/는')} ${o}이므로 ${n}이다.`, facts: { parts: [[String(wordValue(w)), 0]] } });
          }, { standard: COUNT }),
          T('n99-bundles-pick-word', '읽는 말에서 10개씩 묶음이 몇 개인 수 고르기', '①5', (d) => {
            // 틀린 보기: 낱개의 수가 그 수인 것 둘(육십구, 일흔아홉), 10개씩 묶음이 하나 적은 것
            const t = d.int(6, 9), o = d.until(() => d.int(1, 8), (v) => v !== t), [u1, u2] = d.shuffle([5, 6, 7, 8, 9].filter((v) => v !== t));
            const vals = d.shuffle([t * 10 + o, u1 * 10 + t, u2 * 10 + t, (t - 1) * 10 + d.until(() => d.int(1, 9), (v) => v !== t)]), opts = vals.map((v) => either(d, v));
            return C(`10개씩 묶음이 ${t}개인 수는?`, opts, vals.indexOf(t * 10 + o), {
              explain: `수로 쓰면 차례로 ${vals.join(', ')}이다. 10개씩 묶음이 ${t}개인 수는 ${t * 10 + o}이다.`, facts: { rule: 'words', claimed: opts.map((w) => [String(t), tenOf(wordValue(w))]), claimedWant: true }
            });
          }),
          T('n99-odd-one', '나타내는 수가 다른 하나(몇십몇)', '①6', (d) => {
            // 두 숫자를 바꾼 수(아흔일곱과 일흔아홉)를 섞는다
            const [t, o] = d.shuffle([5, 6, 7, 8, 9]), n = t * 10 + o, other = o * 10 + t;
            const opts = d.shuffle(d.shuffle([String(n), sino(n), nat(n), `10개씩 묶음 ${t}개와 낱개 ${o}개`]).slice(0, 3).concat([either(d, other)])), values = opts.map(valueOfText);
            return C('나타내는 수가 나머지와 다른 하나는?', opts, values.indexOf(other), { explain: `${quoted(opts[values.indexOf(other)], '은/는')} ${other}이고, 나머지는 모두 ${n}이다.`, facts: { rule: 'upto99', big: { odd: values.map(String) } } });
          }),
          T('n99-bundle-diff', '10개씩 묶음의 수가 다른 하나', '①7', (d) => {
            // 낱개의 수가 같은 숫자인 수(86과 98의 8)를 섞는다
            const [a, b] = d.shuffle([5, 6, 7, 8, 9]), rest = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== a && v !== b)).slice(0, 2);
            const vals = d.shuffle([a * 10 + b, a * 10 + rest[0], a * 10 + rest[1], b * 10 + a]);
            return C('10개씩 묶음의 수가 나머지와 다른 하나는?', vals.map(String), vals.indexOf(b * 10 + a), {
              explain: `${josa(b * 10 + a, '은/는')} 10개씩 묶음이 ${b}개이고, 나머지는 모두 ${a}개이다.`, facts: { choose: { exprs: vals.map((v) => `(${v}-${v}%10)/10`), rule: 'odd' } }
            });
          }),
          T('n99-bundle-most', '10개씩 묶음이 가장 많은 수', '심7 ①7', (d) => {
            // 낱개가 많은 수(69, 79)에 끌리는 아이가 있다: 10개씩 묶음이 가장 많은 수는 낱개가 적다
            const tens = d.shuffle([5, 6, 7, 8, 9]).slice(0, 4), top = Math.max(...tens), vals = tens.map((t) => t * 10 + (t === top ? d.int(1, 3) : d.int(6, 9)));
            return C('10개씩 묶음이 가장 많은 수는?', vals.map(String), tens.indexOf(top), {
              explain: `10개씩 묶음의 수는 차례로 ${tens.join('개, ')}개이다.`, facts: { choose: { exprs: vals.map((v) => `(${v}-${v}%10)/10`), rule: 'max' } }
            });
          }),
          T('n99-word-total', '10개씩 몇 봉지와 낱개는 모두 몇 개', '①17 심8', (d) => {
            const [what, pack] = d.pick([['방울토마토', '봉지'], ['구슬', '상자'], ['밤', '봉지']]), [t, o, n] = twoDigit(d);
            return N(`${josa(what, '이/가')} 10개씩 ${t}${josa(pack, '과/와')} 낱개 ${o}개 있다. ${josa(what, '은/는')} 모두 몇 개인가?`, n, { unit: '개', explain: `10개씩 묶음 ${t}개와 낱개 ${o}개는 ${n}이다.`, facts: { calc: [[`10*${t}+${o}`, 0]] } });
          }),
          T('n99-word-bags-left', '10개씩 담은 접시의 수와 남는 수', '①18 심9', (d) => {
            const [t, o, n] = twoDigit(d);
            return M(`귤 ${n}개를 한 접시에 10개씩 담는다. 10개씩 담은 접시의 수와 남는 귤의 수는?`, [{ label: '접시', answer: t, unit: '개' }, { label: '남는 귤', answer: o, unit: '개' }], {
              explain: `${josa(n, '은/는')} 10개씩 묶음 ${t}개와 낱개 ${o}개이다. 접시 ${t}개에 담고 ${o}개가 남는다.`, facts: { calc: [[`(${n}-${n}%10)/10`, 0], [`${n}%10`, 1]] }
            });
          }),
          T('n99-word-left-said', '말로 준 수를 10개씩 담고 남는 수', '심9 ①18', (d) => {
            const [t, o, n] = twoDigit(d), w = nat(n);
            return N(`호두가 ${w} 개 있다. 한 봉지에 10개씩 담으면 몇 개가 남는가?`, o, { unit: '개', explain: `${quoted(w, '은/는')} ${n}이다. ${josa(n, '은/는')} 10개씩 묶음 ${t}개와 낱개 ${o}개이므로 ${o}개가 남는다.`, facts: { parts: [[`${wordValue(w)}%10`, 0]] } });
          }),
          T('n99-context', '상황에 알맞게 읽은 말 고르기', '①22·23 심6', (d, i) => {
            // 틀린 보기: 다른 읽기로 읽은 것(일흔두 번, 칠십삼 살), 두 읽기를 섞은 것 둘
            if (i === 0) {
              const who = d.pick(NAMES), t = d.int(5, 9), o = d.until(() => d.int(2, 9), (v) => v !== t), x = t * 10 + o;
              const [told, unit] = d.pick([[`${who}의 사물함 번호는 ${x}번이다.`, '번'], [`${who}의 신발장 번호는 ${x}번이다.`, '번'], [`${who}의 이모는 높은 건물의 ${x}층에서 일한다.`, '층']]);
              const opts = d.shuffle([sino(x), natCount(x), SINO_TENS[t] + NAT_ONES[o], NAT_TENS[t] + SINO_ONES[o]]), truth = opts.map((w) => readWord(w).kind === 's' && wordValue(w) === x);
              return C(`${told} ${quoted(x + unit, '을/를')} 바르게 읽은 것은?`, opts.map((w) => `${w} ${unit}`), truth.indexOf(true), {
                explain: `${unit === '번' ? '번호' : '층'}는 ${quoted(sino(x) + ' ' + unit, '과/와')} 같이 읽는다.`, facts: { truth, want: true }
              });
            }
            const who = d.pick(NAMES), t = d.int(6, 8), o = d.until(() => d.int(1, 9), (v) => v !== t), x = t * 10 + o;
            const opts = d.shuffle([natCount(x), sino(x), NAT_TENS[t] + SINO_ONES[o], SINO_TENS[t] + NAT_COUNT[o]]), truth = opts.map((w) => readWord(w).kind === 'n' && wordValue(w) === x);
            return C(`${who}의 할머니는 올해 ${x}살이다. ${quoted(x + '살', '을/를')} 바르게 읽은 것은?`, opts.map((w) => `${w} 살`), truth.indexOf(true), {
              explain: `나이는 ${quoted(natCount(x) + ' 살', '과/와')} 같이 읽는다.`, facts: { truth, want: true }
            });
          }, { count: 2, standard: COUNT })
        ]
      },
      {
        id: 'order', title: '수의 순서', standard: ORDER,
        types: [
          T('order-both', '1만큼 더 작은 수와 더 큰 수', '①24 심12', (d) => {
            const n = d.int(5, 9) * 10 + d.int(2, 8);
            return M(`${n}보다 1만큼 더 작은 수와 1만큼 더 큰 수는?`, [{ label: '1만큼 더 작은 수', answer: n - 1 }, { label: '1만큼 더 큰 수', answer: n + 1 }], {
              explain: `수를 순서대로 쓰면 ${n - 1}, ${n}, ${n + 1}이다.`, facts: { rule: 'plain', calc: [[`${n}-1`, 0], [`${n}+1`, 1]] }
            });
          }),
          T('order-around-ten', '몇십보다 1만큼 더 작은 수와 더 큰 수', '①24', (d) => {
            const n = d.int(6, 9) * 10;
            return M(`${n}보다 1만큼 더 작은 수와 1만큼 더 큰 수는?`, [{ label: '1만큼 더 작은 수', answer: n - 1 }, { label: '1만큼 더 큰 수', answer: n + 1 }], {
              explain: `수를 순서대로 쓰면 ${n - 1}, ${n}, ${n + 1}이다. ${n}보다 1만큼 더 작은 수는 10개씩 묶음이 ${n / 10 - 1}개인 ${n - 1}이다.`, facts: { rule: 'tens', calc: [[`${n}-1`, 0], [`${n}+1`, 1]] }
            });
          }),
          T('order-next-ten', '몇십구보다 1만큼 더 큰 수', '①24', (d) => {
            const n = d.int(5, 8) * 10 + 9;
            return N(`${n}보다 1만큼 더 큰 수는?`, n + 1, { explain: `${n} 다음 수는 ${n + 1}이다. 낱개가 10개가 되어 10개씩 묶음이 ${(n + 1) / 10}개가 된다.`, facts: { rule: 'ten', calc: [[`${n}+1`, 0]] } });
          }),
          T('order-hundred', '99보다 1만큼 더 큰 수', '①25 심12', () => N('99보다 1만큼 더 큰 수는?', 100, { explain: '99보다 1만큼 더 큰 수는 100이다. 100은 「백」이라고 읽는다.', facts: { rule: 'hundred', calc: [['99+1', 0]] } })),
          T('hundred-bundles', '10개씩 묶음이 10개인 수', '①26', () => N('달걀이 한 판에 10개씩 10판 있다. 달걀은 모두 몇 개인가?', 100, {
            unit: '개', figure: trays(10, 0, 1.1), explain: '10개씩 묶음이 10개인 수는 100이다.', facts: { calc: [['10*10', 0]] }
          })),
          T('hundred-say', '100을 설명한 말', '①26 심13', (d) => {
            // 한 낱말만 바꾼 설명: 90보다 1만큼, 1만큼 더 작은 수, 묶음 9개
            const wrong = d.pick([['90보다 1만큼 더 큰 수이다.', '90+1', '90보다 1만큼 더 큰 수는 91이다.'], ['99보다 1만큼 더 작은 수이다.', '99-1', '99보다 1만큼 더 작은 수는 98이다.'], ['10개씩 묶음이 9개인 수이다.', '10*9', '10개씩 묶음이 9개인 수는 90이다.']]);
            const rows = d.shuffle([['백이라고 읽는다.', String(wordValue('백'))], ['99보다 1만큼 더 큰 수이다.', '99+1'], ['10개씩 묶음이 10개인 수이다.', '10*10'], wrong]);
            return C('100을 잘못 설명한 것은?', rows.map((row) => row[0]), rows.indexOf(wrong), { explain: `${wrong[2]} 100은 99보다 1만큼 더 큰 수이고, 10개씩 묶음이 10개인 수이다.`, facts: { claimed: rows.map((row) => [row[1], 100]), claimedWant: false } });
          }),
          T('order-row', '수를 순서대로 쓴 줄의 빈칸', '①27 심14', (d, i) => {
            // 차례: 한 묶음 안에서 / 몇십을 넘어가며 / 100까지
            const s = i === 0 ? d.int(5, 9) * 10 + d.int(1, 3) : i === 1 ? d.int(5, 8) * 10 + 8 : 96, at = [[1, 3, 4], [1, 2, 4], [0, 2, 4]][i];
            const cells = [0, 1, 2, 3, 4].map((k) => (at.includes(k) ? LABELS[at.indexOf(k)] : s + k)), given = [0, 1, 2, 3, 4].filter((k) => !at.includes(k));
            // 빈칸마다 가장 가까운 앞(없으면 뒤)의 적힌 수에서 센다
            const from = (k) => { const back = given.filter((g) => g < k).pop(), base = back === undefined ? given[0] : back; return `${s + base}${k > base ? '+' : '-'}${Math.abs(k - base)}`; };
            return M('수를 순서대로 썼다. ㉠, ㉡, ㉢에 알맞은 수는?', at.map((k, j) => ({ label: LABELS[j], answer: s + k })), {
              figure: strip(cells), explain: `1씩 커지게 순서대로 쓰면 ${[0, 1, 2, 3, 4].map((k) => s + k).join(', ')}이다.`, facts: { rule: ['row', 'rowCross', 'rowHundred'][i], calc: at.map((k, j) => [from(k), j]), unseen: [1, 2] }
            });
          }, { count: 3 }),
          T('order-chart', '수 배열표의 빈칸', '①28 심14', (d) => {
            const s = d.pick([51, 61, 71, 81]), at = [d.int(2, 7), d.int(9, 10), d.int(12, 18)], tags = {};
            at.forEach((k, j) => { tags[k] = LABELS[j]; });
            return M('수 배열표에서 ㉠, ㉡, ㉢에 알맞은 수는?', at.map((k, j) => ({ label: LABELS[j], answer: s + k })), {
              figure: grid(s, 20, 10, Array.from({ length: 20 }, (_, k) => k).filter((k) => !at.includes(k)), tags), explain: `수를 순서대로 쓴 표이다. ㉠은 ${s + at[0]}, ㉡은 ${s + at[1]}, ㉢은 ${s + at[2]}이다.`,
              facts: { calc: at.map((k, j) => [`${s}+${k}`, j]) }
            });
          }),
          T('order-grid4', '빈칸이 많은 수 배열의 ㉠, ㉡', '①29 심16', (d) => {
            // 바로 옆 칸이 비어 있어 두세 칸을 건너 세어야 한다
            const s = d.int(52, 83), at = [d.int(3, 5), d.int(10, 11)], tags = {};
            at.forEach((k, j) => { tags[k] = LABELS[j]; });
            return M('수를 순서대로 쓴 표이다. ㉠, ㉡에 알맞은 수는?', at.map((k, j) => ({ label: LABELS[j], answer: s + k })), {
              figure: grid(s, 16, 4, [0, 1, 7, 8, 13, 14], tags), explain: `${s + 1}부터 순서대로 세면 ㉠은 ${s + at[0]}이다. ${s + 8}부터 순서대로 세면 ㉡은 ${s + at[1]}이다.`, facts: { calc: at.map((k, j) => [`${s}+${k}`, j]) }
            });
          }),
          T('order-back', '수를 거꾸로 센 줄의 빈칸', '①30 심15', (d, i) => {
            // 차례: 몇십을 넘어 작아지는 줄 / 100에서 시작하는 줄
            const s = i === 0 ? d.int(6, 9) * 10 + d.int(1, 2) : 100, at = i === 0 ? [1, 2, 4] : [0, 2, 4];
            const cells = [0, 1, 2, 3, 4].map((k) => (at.includes(k) ? LABELS[at.indexOf(k)] : s - k)), given = [0, 1, 2, 3, 4].filter((k) => !at.includes(k));
            const from = (k) => { const back = given.filter((g) => g < k).pop(), base = back === undefined ? given[0] : back; return `${s - base}${k > base ? '-' : '+'}${Math.abs(k - base)}`; };
            return M('수를 거꾸로 세어 차례로 썼다. ㉠, ㉡, ㉢에 알맞은 수는?', at.map((k, j) => ({ label: LABELS[j], answer: s - k })), {
              figure: strip(cells), explain: `1씩 작아지게 차례로 쓰면 ${[0, 1, 2, 3, 4].map((k) => s - k).join(', ')}이다.`, facts: { rule: ['back', 'backHundred'][i], calc: at.map((k, j) => [from(k), j]), unseen: [1, 2] }
            });
          }, { count: 2 }),
          T('order-rows-wrong', '순서대로 쓰지 않은 줄', '①31', (d) => {
            // 틀린 줄: 69 다음에 80을 쓴 것, 두 수의 자리를 바꾼 것, 수 하나를 빠뜨린 것
            const [a, b, c] = d.until(() => d.shuffle([5, 6, 7, 8]), (v) => v[2] <= 7), from = c * 10 + d.int(1, 5), kind = d.pick(['jump', 'swap', 'skip']);
            const wrong = kind === 'jump' ? [c * 10 + 8, c * 10 + 9, (c + 1) * 10 + 10, (c + 1) * 10 + 11] : kind === 'swap' ? [from + 1, from, from + 2, from + 3] : [from, from + 1, from + 3, from + 4];
            const rows = d.shuffle([[a * 10 + 8, a * 10 + 9, a * 10 + 10, a * 10 + 11], [b * 10 + 2, b * 10 + 3, b * 10 + 4, b * 10 + 5], [97, 98, 99, 100], wrong]), truth = rows.map(inOrder);
            return C('수를 순서대로 쓰지 않은 것은?', rows.map((row) => row.join(', ')), truth.indexOf(false), {
              explain: kind === 'swap' ? `순서대로 쓰면 ${wrong.slice().sort((x, y) => x - y).join(', ')}이다.` : `${wrong[1]} 다음 수는 ${wrong[1] + 1}이다.`, facts: { truth, want: false }
            });
          }),
          T('order-rows-right', '순서대로 쓴 줄', '①31', (d) => {
            // 틀린 줄: 79 다음에 90을 쓴 것, 10씩 건너뛴 수를 섞은 것, 수 하나를 빠뜨린 것
            const [a, b, c, e] = d.until(() => d.shuffle([5, 6, 7, 8]), (v) => v[2] <= 7), p = b * 10 + d.int(1, 4), q = e * 10 + d.int(1, 5);
            const rows = d.shuffle([[a * 10 + 8, a * 10 + 9, a * 10 + 10, a * 10 + 11], [c * 10 + 8, c * 10 + 9, (c + 1) * 10 + 10, (c + 1) * 10 + 11], [p, p + 10, p + 1, p + 11], [q, q + 1, q + 3, q + 4]]), truth = rows.map(inOrder);
            return C('수를 순서대로 쓴 것은?', rows.map((row) => row.join(', ')), truth.indexOf(true), { explain: `${a * 10 + 9} 다음 수는 ${a * 10 + 10}이다. 1씩 커지는 줄은 ${rows[truth.indexOf(true)].join(', ')}뿐이다.`, facts: { truth, want: true } });
          }),
          T('order-between', '두 수 사이에 있는 수', '①32', (d) => {
            const a = d.int(5, 8) * 10 + d.int(7, 8), b = a + 4;
            return M(`${josa(a, '과/와')} ${b} 사이에 있는 수를 작은 수부터 차례로 쓰시오.`, [{ answer: a + 1 }, { answer: a + 2 }, { answer: a + 3 }], {
              explain: `${a}부터 순서대로 쓰면 ${a}, ${a + 1}, ${a + 2}, ${a + 3}, ${b}이다. 사이에 있는 수는 ${a + 1}, ${a + 2}, ${a + 3}이다.`, facts: { calc: [[`${a}+1`, 0], [`${a}+2`, 1], [`${b}-1`, 2]], unseen: [1, 2] }
            });
          })
        ]
      },
      // 아래 두 묶음의 문항은 1-2-1b.js가 채운다.
      { id: 'compare', title: '수의 크기 비교', standard: ORDER, types: [] },
      { id: 'evenodd', title: '짝수와 홀수', standard: COUNT, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
