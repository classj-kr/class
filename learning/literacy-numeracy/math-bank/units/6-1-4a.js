// 6학년 1학기 4단원 비와 비율 — 단원 틀과 기본 문항(두 수를 뺄셈과 나눗셈으로 비교하기, 비, 비율).
// 수집해 둔 교과서 9종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 73·75·76꼴, 심화꼴 73꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/6-1-4/싣기_대조표.md 에 있다.
// (비율이 쓰이는 경우, 백분율, 백분율이 쓰이는 경우의 기본 문항은 6-1-4b.js 에, 실력 문항은 6-1-4c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
// 영역은 변화와 관계. 성취기준은 6수02-02(두 양의 크기를 비교하는 상황을 통해 비의 개념을 이해하고, 두 양의 관계를 비로 나타낼 수 있다)와
// 6수02-03(비율을 이해하고, 비율을 분수, 소수, 백분율로 나타낼 수 있다)이다.
//
// 싣는 기준
//  - 이 단원의 일만 싣는다: 두 수를 뺄셈과 나눗셈으로 비교하기(변하는 관계와 변하지 않는 관계), 비(기호 :, 읽는 법 넷), 기준량과 비교하는 양,
//    비율(분수·소수), 비율이 쓰이는 경우, 백분율, 백분율이 쓰이는 경우. 교육과정: 「비와 비율을 다룰 때는 기준량과 비교하는 양을 명확하게 인식하게 한다.」
//  - 기본에는 한 가지 일을 싣는다: 비 한 번 쓰기·읽기, 기준량 가리기, 비율 한 번 구하기, 꼴(분수·소수·백분율) 한 번 바꾸기, 꼴이 다른 비율의 크기 비교,
//    기준량에 비율을 한 번 곱해 비교하는 양 구하기. 단위를 맞추는 지도, 표에서 수를 찾아 쓰는 것처럼 준비가 한 번 드는 것은 기본에 두었다.
//    문장에서 기준량이나 비교하는 양을 먼저 셈해 만들어야 하는 것(전체 = 남학생 + 여학생, 소금물 = 물 + 소금, 할인 금액 = 정가 − 판매 가격),
//    두 비율을 구해 견주는 것, 비율로 구한 양으로 한 번 더 셈하는 것은 실력 묶음(6-1-4c.js)에 실었다.
//  - 비를 쓰는 문항은 문제에 나온 두 수를 그대로 쓴 것만 답이다(간단한 자연수의 비로 고치는 것은 6학년 2학기). 답 칸은 「□ : □」 두 칸이다.
//  - 비율을 분수로 답하는 문항은 크기가 같은 분수를 모두 받는다(anyForm). 교육과정: 「기약분수로 나타낼 것을 요구하지 않을 경우, 계산 결과를 기약분수가 아닌 분수로 나타내는 것도 허용한다.」
//  - 소수는 모두 정수(천분의 몇)로 셈한 뒤 글로 적는다. 비율은 소수 셋째 자리 안에서 끝나는 수만 쓴다.
//  - 주는 것(문장·표·그림·비·비율), 묻는 것(비, 기준량, 비교하는 양, 비율의 분수·소수·백분율, 고르기, 차례), 상황의 얼개가 다르면 다른 문제다.
//    수나 이름만 다른 것은 한 번만 싣는다. 식의 꼴만 같고 계산 구조가 다른 문항에는 facts.rule 에 그 이름을 단다.
//  - 보기의 참·거짓은 손으로 적지 않고 코드로 정한다. 검사가 다시 셈할 수 있는 보기에는 [식 글, 적힌 값]을 함께 적는다(facts.claimed).
//
// 뺀 것과 까닭(6-1-4b.js·6-1-4c.js 의 것까지 여기에 모아 적는다)
//  - 5학년 대응 관계(5-1-3)의 일: 대응 표를 채우거나 다음 값 구하기(①6 ②5 ③5), 몇 배 관계로 값 구하기(①10 ②7의 변형 심7)
//  - 6학년 2학기 비례식과 비례배분: 전항·후항(②22), 비율과 차·합으로 비 찾기(②24 심32), 비율이 같은 두 도형의 빠진 길이(②73 심31),
//    지도에서 잰 길이로 실제 거리 구하기(③42의 끝 물음), 일정한 빠르기로 걸리는 시간 구하기(심36)
//  - 기준량을 거꾸로 구하는 것((자연수) ÷ (소수)·(분수)가 드는 6학년 2학기의 일): 불량률과 불량품 수로 전체 구하기(①72), 당첨 가능성을 낮추려면 더 넣을 제비(③74),
//    비율과 비교하는 양으로 기준량 채우기(심33의 첫 줄)
//  - 중학교의 일: 물을 더 부어 진하기 맞추기(③75), 사 온 값·붙인 값·깎은 값을 잇는 손해율(③76)
//  - 넓이 셈(5학년 측정)이 일의 대부분인 것: 넓이를 구해 비·비율·백분율 쓰기(①34 ②23·49 ③21 심17·54), 늘이고 줄인 뒤의 넓이와 그 비율(①35 ②75 심71·72·73)
//  - 몫을 반올림해야 하는 큰 수의 비율(②48, ③38의 변형)
//  - 여러 조건을 한꺼번에 맞추는 꼬인 것: 목표 성공률이 되려면 몇 번 더(③73), 백분율과 분수를 이어 쓰는 세 단계(②74)
//  - 서술형·작도·활동·열린 답: 비교한 것을 문장으로 쓰기(①9 ②4의 대표 ②8 ③7 심4·6·8 — 바르게 비교한 것 고르기로 바꿈), 비에 맞게 색칠하기(①23 ②18 ③54 ②60 심29의 작도 —
//    바르게 색칠한 그림 고르기와 색칠할 칸 수로 바꿈), 비율에 맞는 직사각형 그리기(③35), 자로 재어 비 구하기(①24의 활동 ③22), 비·비율이 쓰이는 경우 찾아 쓰기(③44 심20),
//    까닭 쓰기(②16 ③16 심19 — 알맞은 까닭 고르기로 바꿈)
//  - 수가 맞지 않는 것: 소수 셋째 자리 안에서 끝나지 않는 비율을 통분해서 견주는 변형(①47 ②41·42 ③33 심34·41의 변형), 실제 지역의 어림수(①43의 변형),
//    답이 하나로 정해지지 않는 것(①58의 변형 — 비율을 보고 비 쓰기)
//  - 같은 문제여서 한 번만 실은 것은 대조표에 꼴 번호와 함께 적었다(잘못 쓴 비 고치기는 비 쓰기와, 득표율·정답률·참여율·권장 열량은 전체에 대한 부분의 백분율과,
//    받은 돈에서 이자를 구하는 이자율·몇 % 늘었는지는 오른 비율과 얼개가 같다).
//  - 그림이 필요해 미룬 것: 달력·영양 성분표에서 수를 찾아 비율 쓰기(③34), 고속버스 시간표에서 횟수를 세어 비율 쓰기(①50의 대표 심43) — 표가 휴대폰 너비를 넘는다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, box, frac, lines, table, tagged, numbers, pieces, N, M, C, F, D } = B.kit;
  const U = '6-1-4', RATIO = '6수02-02', RATE = '6수02-03';
  // 비(3 : 5)가 줄 끝에서 갈라지지 않게 기호 : 앞뒤의 빈칸을 줄이 바뀌지 않는 빈칸으로 바꾼다(글·그림 속 글·풀이·보기).
  const glue = (html) => (typeof html === 'string' ? html.replace(/(\S) : (?=\S)/g, '$1\u00A0:\u00A0') : html);
  const tidy = (item) => { item.text = glue(item.text); item.figure = glue(item.figure); item.explain = glue(item.explain); if (item.choice) item.choice.options = item.choice.options.map(glue); return item; };
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make: (d, n) => tidy(make(d, n)) }, more || {});
  const LAB = ['㉠', '㉡', '㉢', '㉣'], TAGS = ['가', '나', '다', '라'];
  const SIGNS = ['&gt;', '=', '&lt;'];
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const gcd = (x, y) => (y ? gcd(y, x % y) : x);
  const range = (n, from) => Array.from({ length: n }, (_, i) => i + (from || 0));
  const sum = (list) => list.reduce((s, v) => s + v, 0);

  // ── 수와 글 ─────────────────────────────────────────────────
  // 소수는 천분의 몇(정수)으로 셈한다. K(3, 8) = 375, ks(375) = '0.375'.
  const K = (n, d) => { const k = (n * 1000) / d; if (!Number.isInteger(k)) throw new Error(`소수 셋째 자리에서 끝나지 않는다: ${n}/${d}`); return k; };
  const ks = (k) => { const w = Math.floor(k / 1000), f = String(k % 1000).padStart(3, '0').replace(/0+$/, ''); return f ? `${w}.${f}` : String(w); };
  const dec = (n, d) => ks(K(n, d));
  const ends = (n, d) => Number.isInteger((n * 1000) / d);
  // 토씨: 소수는 끝자리 숫자를, 분수는 분자를, 백분율은 「퍼센트」를, 비는 뒤의 수를 마지막에 읽는다.
  const tail = (digit, pair) => josa(digit, pair).slice(String(digit).length);
  const dj = (text, pair) => text + tail(Number(String(text).slice(-1)), pair);
  const fj = (n, d, pair) => frac(n, d) + tail(n, pair);
  const pj = (p, pair) => `${p} %` + (pair === '으로/로' ? '로' : pair.split('/')[1]);
  const rj = (a, b, pair) => `${a} : ${josa(b, pair)}`;
  // 비 a : b(비교하는 양 a, 기준량 b)를 읽는 네 가지 말
  const READ = [(a, b) => `${a} 대 ${b}`, (a, b) => `${josa(a, '과/와')} ${b}의 비`, (a, b) => `${a}의 ${b}에 대한 비`, (a, b) => `${b}에 대한 ${a}의 비`];
  // 서로 다른 두 수(비에 쓰는 수)
  const pairAB = (d, lo, hi) => d.until(() => [d.int(lo || 2, hi || 19), d.int(lo || 2, hi || 19)], ([a, b]) => a !== b);
  // 두 양을 말로 이은 비: [글, 뒤에 말한 것이 비교하는 양인가]
  const PHRASE = [(A, B2) => [`${josa(A, '과/와')} ${B2}의 비`, false], (A, B2) => [`${A}에 대한 ${B2}의 비`, true], (A, B2) => [`${A}의 ${B2}에 대한 비`, false]];

  // ── 문항 꼴 ─────────────────────────────────────────────────
  // 식에 적는 값: 수 하나이거나 [식 글, 값]. 식 글에는 문제에 적힌 수만 쓴다.
  const ev = (x) => (Array.isArray(x) ? x : [String(x), x]);
  const facts = (calc, o, unseen) => { const more = (o && o.facts) || {}; return Object.assign({}, more, { calc }, (unseen && unseen.length) || more.unseen ? { unseen: (unseen || []).concat(more.unseen || []) } : {}); };
  // 비를 답하는 문항: 「□ : □」 두 칸
  function RA(text, a, b, o) {
    const [ae, av] = ev(a), [be, bv] = ev(b);
    return M(text, [{ answer: av, unit: ' :' }, { answer: bv }], { figure: o.figure, explain: o.explain, facts: facts([[ae, 0], [be, 1]], o) });
  }
  // 비율을 분수로 답하는 문항: 크기가 같은 분수를 모두 받는다. 약분할 때 나누는 수는 글에 없으므로 unseen 에 넣는다.
  function FR(text, num, den, o) {
    const [ne, nv] = ev(num), [de, dv] = ev(den), g = gcd(nv, dv), p = nv / g, q = dv / g;
    if (q === 1) throw new Error('자연수가 되는 비율');
    return F(text, p, q, { improper: p > q, anyForm: true, unit: o.unit, figure: o.figure, explain: o.explain, facts: facts([[`(${ne})/${g}`, 0], [`(${de})/${g}`, 1]], o, [g]) });
  }
  // 비율을 소수로 답하는 문항
  function DR(text, num, den, o) {
    const [ne, nv] = ev(num), [de, dv] = ev(den), k = K(nv, dv);
    if (k % 1000 === 0) throw new Error('자연수가 되는 비율');
    return D(text, k / 1000, { unit: o.unit, figure: o.figure, explain: o.explain, facts: facts([[`(${ne})/(${de})`, 0]], o) });
  }
  // 백분율을 답하는 문항(자연수)
  function PR(text, num, den, o) {
    const [ne, nv] = ev(num), [de, dv] = ev(den), p = (nv * 100) / dv;
    if (!Number.isInteger(p) || p <= 0) throw new Error(`백분율이 자연수가 아니다: ${nv}/${dv}`);
    return N(text, p, { unit: ' %', figure: o.figure, explain: o.explain, facts: facts([[`(${ne})*100/(${de})`, 0]], o, [100]) });
  }
  // 고르기 문항: 보기 [글, 참·거짓, (식 글과 적힌 값)]을 섞는다. want 인 보기는 하나뿐이어야 한다. o.explain 은 글이거나 섞은 보기를 받아 글을 돌려주는 함수.
  function pickOne(d, text, rows, want, o) {
    const opt = o || {}, list = opt.keep ? rows : d.shuffle(rows), hit = list.filter((r) => Boolean(r[1]) === want);
    if (hit.length !== 1) throw new Error('답이 하나가 아니다: ' + list.map((r) => r[0] + '=' + r[1]).join(' | '));
    if (new Set(list.map((r) => r[0])).size !== list.length) throw new Error('보기가 겹친다: ' + list.map((r) => r[0]).join(' | '));
    const f = Object.assign({ truth: list.map((r) => Boolean(r[1])), want }, opt.facts || {});
    if (list.every((r) => r[2])) { f.claimed = list.map((r) => r[2]); f.claimedWant = want; }
    return C(text, opt.labels || list.map((r) => r[0]), list.findIndex((r) => Boolean(r[1]) === want), { figure: typeof opt.figure === 'function' ? opt.figure(list) : opt.figure, explain: typeof opt.explain === 'function' ? opt.explain(list) : opt.explain, facts: f });
  }
  // 차례 고르기 보기: 값의 차례를 바르게 적은 것 하나와 틀린 것 셋
  function orderChoice(d, values, labels, descending) {
    const right = values.map((_, i) => i).sort((p, q) => (descending ? values[q] - values[p] : values[p] - values[q]));
    const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
    return { list, right, options: list.map((o) => o.map((i) => labels[i]).join(', ')), answer: list.findIndex((o) => o.join() === right.join()) };
  }
  const versus = (left, right) => `<div class="mb-versus">${left}<span class="mb-ring"></span>${right}</div>`;

  // ── 표와 그림 ───────────────────────────────────────────────
  // 가로로 긴 표: 줄마다 [이름, 값 …]. 이름 칸은 좁은 화면에서 두 줄로 접힌다.
  const tableOf = (rows) => '<div class="mb-table-wrap"><table class="mb-table"><tbody>' + rows.map((row) => '<tr>' + row.map((c, i) => '<td style="padding:5px 7px' + (i ? '' : ';white-space:normal;word-break:keep-all') + '">' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
  const svg = (w, h, label, body, cls) => `<svg class="${cls || 'mb-geo'}" viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-label="${label}">${body}</svg>`;
  const INK = 'stroke:#1f2937;stroke-width:1.2;stroke-linejoin:round';
  const SHAPE = {
    c: (x, y) => `<circle cx="${x}" cy="${y}" r="8" style="fill:#bfdbfe;${INK}"/>`,
    t: (x, y) => `<path d="M${x} ${y - 8.5}L${x + 9} ${y + 7}H${x - 9}Z" style="fill:#bbf7d0;${INK}"/>`,
    s: (x, y) => `<rect x="${x - 7.5}" y="${y - 7.5}" width="15" height="15" style="fill:#fde68a;${INK}"/>`,
    k: (x, y) => `<circle cx="${x}" cy="${y}" r="8" style="fill:#374151;${INK}"/>`,
    w: (x, y) => `<circle cx="${x}" cy="${y}" r="8" style="fill:#ffffff;${INK}"/>`
  };
  // 물건을 가지마다 한 줄씩 늘어놓은 그림. rows: [[이름, 개수, 모양(c 동그라미 · t 세모 · s 네모 · k 검은 돌 · w 흰 돌)], …]
  function things(rows) {
    const g = 23, per = 10, pad = 5, width = Math.max(70, pad * 2 + Math.min(per, Math.max(...rows.map((r) => r[1]))) * g);
    let y = pad, out = '';
    rows.forEach(([, k, kind]) => { for (let i = 0; i < k; i += 1) out += SHAPE[kind](pad + g / 2 + (i % per) * g, y + g / 2 + Math.floor(i / per) * g); y += Math.ceil(k / per) * g + 5; });
    return svg(width, y + pad - 5, `그림: ${rows.map(([n, k]) => `${n} ${k}개`).join(', ')}`, out);
  }
  // 똑같이 나눈 모눈: 가로 cols 칸, 세로 rows 칸 가운데 on(칸 번호의 배열)을 색칠한다. o: { u 한 칸의 크기, tag 아래에 적는 이름, on2 노란색으로 칠하는 칸 }
  function cells(cols, rows, on, o) {
    const opt = o || {}, u = opt.u || Math.max(11, Math.min(22, Math.floor(240 / cols))), W = cols * u + 4, set = new Set(on), set2 = new Set(opt.on2 || []);
    let out = '', Hh = rows * u + 4;
    for (let i = 0; i < cols * rows; i += 1) out += `<rect class="mb-piece${set.has(i) ? ' is-on' : ''}"${set2.has(i) ? ' style="fill:#fde047"' : ''} x="${2 + (i % cols) * u}" y="${2 + Math.floor(i / cols) * u}" width="${u}" height="${u}"/>`;
    if (opt.tag) { out += `<text class="mb-axis-label" style="font-size:13px" x="${W / 2}" y="${Hh + 13}" text-anchor="middle">${opt.tag}</text>`; Hh += 17; }
    const said = set2.size ? `전체 ${cols * rows}칸 가운데 파란색 ${set.size}칸, 노란색 ${set2.size}칸을 색칠` : `전체 ${cols * rows}칸 가운데 ${set.size}칸을 색칠`;
    return svg(W, Hh, `${opt.tag ? opt.tag + ' ' : ''}모눈: ${said}`, out, 'mb-pieces');
  }
  // 흩어 놓은 칸 번호 k개(전체 n칸)
  const scatter = (d, n, k) => d.shuffle(range(n)).slice(0, k);
  // 그림 여럿을 두 줄씩 가지런히 놓는다.
  const tiles = (list, cols) => `<div style="display:grid;grid-template-columns:repeat(${cols || 2}, auto);gap:10px 18px;justify-content:start;align-items:end">${list.join('')}</div>`;
  // 가로 w, 세로 h 인 직사각형(길이를 변 옆에 적는다)
  function rectFig(w, h, unit) {
    const s = Math.min(150 / w, 84 / h), W = Math.max(60, Math.round(w * s)), Hh = Math.max(30, Math.round(h * s)), left = 58, top = 6, word = 'style="font-size:13px;font-weight:700;fill:#1f2937"';
    const out = `<rect x="${left}" y="${top}" width="${W}" height="${Hh}" style="fill:#fff8e1;${INK}"/><text ${word} x="${left + W / 2}" y="${top + Hh + 17}" text-anchor="middle">${w} ${unit}</text><text ${word} x="${left - 7}" y="${top + Hh / 2 + 4.5}" text-anchor="end">${h} ${unit}</text>`;
    return svg(left + W + 8, top + Hh + 24, `직사각형: 가로 ${w} ${unit}, 세로 ${h} ${unit}`, out);
  }
  // 모눈에 그린 직사각형 여럿(가, 나, 다 …). list: [[가로 칸 수, 세로 칸 수], …]. 바닥을 맞추어 나란히 놓고 칸마다 모눈을 그린다.
  function gridRects(list) {
    const gap = 16, pad = 4, u = Math.min(16, Math.floor((250 - gap * (list.length - 1)) / sum(list.map((r) => r[0])))), high = Math.max(...list.map((r) => r[1])) * u;
    let x = pad, out = '';
    list.forEach(([w, h], i) => {
      for (let c = 0; c < w; c += 1) for (let r = 0; r < h; r += 1) out += `<rect x="${x + c * u}" y="${pad + high - (r + 1) * u}" width="${u}" height="${u}" style="fill:#fff8e1;stroke:#94a3b8;stroke-width:0.8"/>`;
      out += `<rect x="${x}" y="${pad + high - h * u}" width="${w * u}" height="${h * u}" style="fill:none;${INK};stroke-width:1.6"/><text class="mb-axis-label" style="font-size:13px" x="${x + (w * u) / 2}" y="${pad + high + 15}" text-anchor="middle">${TAGS[i]}</text>`;
      x += w * u + gap;
    });
    return svg(x - gap + pad, pad + high + 21, `모눈에 그린 직사각형: ${list.map(([w, h], i) => `${TAGS[i]}는 가로 ${w}칸, 세로 ${h}칸`).join(', ')}`, out);
  }
  // 약도: 가운데 집에서 왼쪽·오른쪽 두 곳까지의 거리(m)
  function mapFig(leftName, leftM, rightName, rightM) {
    const x0 = 28, x2 = 262, x1 = Math.round(x0 + (x2 - x0) * Math.min(0.68, Math.max(0.32, leftM / (leftM + rightM)))), y = 34, word = 'style="font-size:13px;font-weight:700;fill:#1f2937"';
    const dot = (x) => `<circle cx="${x}" cy="${y}" r="4" style="fill:#1d4ed8"/>`;
    const out = `<line x1="${x0}" y1="${y}" x2="${x2}" y2="${y}" style="stroke:#475569;stroke-width:3"/>${dot(x0)}${dot(x1)}${dot(x2)}`
      + `<text ${word} x="${x0}" y="${y + 21}" text-anchor="middle">${leftName}</text><text ${word} x="${x1}" y="${y + 21}" text-anchor="middle">집</text><text ${word} x="${x2}" y="${y + 21}" text-anchor="middle">${rightName}</text>`
      + `<text ${word} x="${(x0 + x1) / 2}" y="${y - 11}" text-anchor="middle">${leftM} m</text><text ${word} x="${(x1 + x2) / 2}" y="${y - 11}" text-anchor="middle">${rightM} m</text>`;
    return svg(290, 62, `약도: 집에서 ${leftName}까지 ${leftM} m, 집에서 ${rightName}까지 ${rightM} m`, out);
  }

  // ── 상황 ────────────────────────────────────────────────────
  // 두 가지를 한 묶음에 담는 상황: [묶음, 앞의 것, 뒤의 것]
  const PACKS = [['봉지', '밤', '귤'], ['바구니', '감자', '고구마'], ['상자', '초콜릿', '사탕'], ['접시', '만두', '송편']];
  // 두 가지 물건을 세는 상황: [앞의 것, 뒤의 것, 세는 말]
  const TWO = [['연필', '볼펜', '자루'], ['사과', '배', '개'], ['빨간 구슬', '파란 구슬', '개'], ['동화책', '과학책', '권'], ['농구공', '배구공', '개']];

  B.kit.r614 = { U, RATIO, RATE, tidy, LAB, TAGS, SIGNS, gcd, range, sum, K, ks, dec, ends, tail, dj, fj, pj, rj, READ, pairAB, PHRASE, ev, RA, FR, DR, PR, pickOne, orderChoice, versus, tableOf, svg, INK, things, cells, scatter, tiles, rectFig, TWO };

  B.addUnit({
    id: '6-1-4', grade: 6, semester: 1, no: 4, title: '비와 비율', version: 1,
    groups: [
      {
        id: 'cmp', title: '두 수를 뺄셈과 나눗셈으로 비교하기', standard: RATIO,
        types: [
          T('cm-both', '두 수를 뺄셈과 나눗셈으로 비교하기', '①1 ②1·2 ③3 심1', (d) => {
            const [A, B2, u] = d.pick(TWO), b = d.int(3, 9), k = d.int(2, 5), a = b * k;
            return M(`${A} ${josa(a + u, '과/와')} ${B2} ${josa(b + u, '이/가')} 있다. 두 수를 뺄셈과 나눗셈으로 비교하였다. ㉠, ㉡에 알맞은 수는?`, [{ label: LAB[0], answer: a - b }, { label: LAB[1], answer: k }], {
              figure: lines([`${josa(A, '은/는')} ${B2}보다 ${box(LAB[0])}${u} 더 많다.`, `${A} 수는 ${B2} 수의 ${box(LAB[1])}배이다.`]),
              explain: `뺄셈으로 비교하면 ${a} − ${b} = ${a - b}이므로 ${josa(A, '은/는')} ${B2}보다 ${a - b}${u} 더 많다. 나눗셈으로 비교하면 ${a} ÷ ${b} = ${k}이므로 ${A} 수는 ${B2} 수의 ${k}배이다.`,
              facts: { calc: [[`${a}-${b}`, 0], [`${a}/${b}`, 1]] }
            });
          }),
          T('cm-pic', '그림을 세어 몇 배인지 알아보기', '①1 ②2 ③1·2 심1', (d) => {
            const b = d.int(2, 4), k = d.int(2, 3), a = b * k;
            return N('검은 바둑돌 수는 흰 바둑돌 수의 몇 배인가?', k, {
              unit: '배', figure: things([['검은 바둑돌', a, 'k'], ['흰 바둑돌', b, 'w']]),
              explain: `검은 바둑돌은 ${a}개, 흰 바둑돌은 ${b}개이다. ${a} ÷ ${b} = ${k}이므로 검은 바둑돌 수는 흰 바둑돌 수의 ${k}배이다.`, facts: { calc: [[`${a}/${b}`, 0]] }
            });
          }),
          T('cm-frac', '적은 쪽은 많은 쪽의 몇 배인가(분수)', '①2 ②3 심2', (d) => {
            const [p, q] = d.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [1, 6], [5, 6]]), m = d.int(2, 6), a = p * m, b = q * m;
            const [A, B2, u] = d.pick([['김치만두', '고기만두', '개'], ['어른', '어린이', '명'], ['흰 우유', '딸기 우유', '개'], ['위인전', '동화책', '권']]);
            return FR(`${josa(A, '이/가')} ${a}${u}, ${josa(B2, '이/가')} ${b}${u} 있다. ${A} 수는 ${B2} 수의 몇 배인가?`, a, b, {
              unit: '배', explain: `${A} 수를 ${B2} 수로 나누면 ${a} ÷ ${b} = ${frac(a, b)} = ${frac(p, q)}이므로 ${frac(p, q)}배이다. ${A} 수가 더 적으므로 1배보다 작다.`
            });
          }),
          T('cm-dec', '많은 쪽은 적은 쪽의 몇 배인가(소수)', '①8 ②2·3', (d) => {
            const [p, q] = d.pick([[3, 2], [5, 4], [6, 5], [7, 4], [8, 5], [5, 2], [7, 5], [9, 4]]);
            if (d.bool()) {
              const m = d.pick([10, 20, 30]), a = p * m, b = q * m;
              return DR(`막대의 길이는 ${b} cm이고 막대의 그림자의 길이는 ${a} cm이다. 그림자의 길이는 막대의 길이의 몇 배인가?`, a, b, { unit: '배', explain: `그림자의 길이를 막대의 길이로 나누면 ${a} ÷ ${b} = ${dec(a, b)}이므로 ${dec(a, b)}배이다. 뺄셈으로 비교하면 그림자가 막대보다 ${a - b} cm 더 길다.` });
            }
            const m = d.int(2, 4), a = p * m, b = q * m;
            return DR(`줄넘기를 ${name(d.pick(NAMES), '은/는')} ${a}번, 동생은 ${b}번 넘었다. ${a}번은 ${b}번의 몇 배인가?`, a, b, { unit: '배', explain: `${a} ÷ ${b} = ${dec(a, b)}이므로 ${dec(a, b)}배이다. 뺄셈으로 비교하면 ${a - b}번 더 많이 넘었다.` });
          }),
          T('cm-table-sub', '표를 보고 뺄셈으로 비교하기', '①3 ②6 ③6 심5', (d) => {
            const [pack, A, B2] = d.pick(PACKS.slice(0, 2)), q = d.int(1, 3), k = d.int(2, 4), p = q * k, g = p - q;
            return M(`한 ${pack}에 ${A} ${p}개와 ${B2} ${q}개씩 담았다. ${pack} 수에 따라 ${A} 수와 ${B2} 수를 뺄셈으로 비교하였다. ㉠, ㉡에 알맞은 수는?`, [{ label: LAB[0], answer: 3 * g }, { label: LAB[1], answer: 4 * g }], {
              figure: tableOf([[`${pack} 수(개)`, 1, 2, 3, 4], [`${A} 수(개)`, p, 2 * p, 3 * p, 4 * p], [`${B2} 수(개)`, q, 2 * q, 3 * q, 4 * q]]) + lines([`${josa(A, '은/는')} ${B2}보다 각각 ${g}개, ${2 * g}개, ${box(LAB[0])}개, ${box(LAB[1])}개 더 많다.`]),
              explain: `${pack}가 3개일 때 ${3 * p} − ${3 * q} = ${3 * g}, 4개일 때 ${4 * p} − ${4 * q} = ${4 * g}이다. 뺄셈으로 비교하면 ${pack} 수에 따라 ${A} 수와 ${B2} 수의 관계가 변한다.`,
              facts: { calc: [[`${3 * p}-${3 * q}`, 0], [`${4 * p}-${4 * q}`, 1]] }
            });
          }),
          T('cm-table-div', '표를 보고 나눗셈으로 비교하기', '①4 ②7 ③6 심5', (d) => {
            const [pack, A, B2] = PACKS[2], q = d.int(2, 4), k = d.int(2, 4), p = q * k;
            return N(`한 ${pack}에 ${A} ${p}개와 ${B2} ${q}개씩 담았다. ${pack} 수가 변해도 ${A} 수는 항상 ${B2} 수의 몇 배인가?`, k, {
              unit: '배', figure: tableOf([[`${pack} 수(개)`, 1, 2, 3, 4], [`${A} 수(개)`, p, 2 * p, 3 * p, 4 * p], [`${B2} 수(개)`, q, 2 * q, 3 * q, 4 * q]]),
              explain: `${p} ÷ ${q} = ${k}, ${2 * p} ÷ ${2 * q} = ${k}, ${3 * p} ÷ ${3 * q} = ${k}, ${4 * p} ÷ ${4 * q} = ${k}이다. 나눗셈으로 비교하면 ${pack} 수가 변해도 ${A} 수는 항상 ${B2} 수의 ${k}배로 변하지 않는다.`,
              facts: { calc: [[`${4 * p}/${4 * q}`, 0]] }
            });
          }),
          T('cm-table-kind', '변하는 관계와 변하지 않는 관계', '①3·4·9 ②7·8 ③6·7 심5·6', (d) => {
            // 틀린 보기: 첫 칸의 차를 「항상」이라고 한 것, 두 양의 자리를 바꾼 몇 배, 둘째 칸의 차를 첫 칸의 차로 적은 것
            const [pack, A, B2] = PACKS[3], q = d.int(1, 3), k = d.int(2, 4), p = q * k, g = p - q;
            return pickOne(d, `한 ${pack}에 ${A} ${p}개와 ${B2} ${q}개씩 담았다. 표를 보고 ${A} 수와 ${B2} 수를 바르게 비교한 것은?`, [
              [`${A} 수는 항상 ${B2} 수의 ${k}배이다.`, true, [`${3 * p}/${3 * q}`, k]],
              [`${josa(A, '은/는')} 항상 ${B2}보다 ${g}개 더 많다.`, false, [`${3 * p}-${3 * q}`, g]],
              [`${B2} 수는 항상 ${A} 수의 ${k}배이다.`, false, [`${3 * q}/${3 * p}`, k]],
              [`${pack}가 2개일 때 ${josa(A, '은/는')} ${B2}보다 ${g}개 더 많다.`, false, [`${2 * p}-${2 * q}`, g]]
            ], true, {
              figure: tableOf([[`${pack} 수(개)`, 1, 2, 3, 4], [`${A} 수(개)`, p, 2 * p, 3 * p, 4 * p], [`${B2} 수(개)`, q, 2 * q, 3 * q, 4 * q]]),
              explain: `뺄셈으로 비교하면 ${josa(A, '은/는')} ${B2}보다 ${g}개, ${2 * g}개, ${3 * g}개, ${4 * g}개 더 많아 ${pack} 수에 따라 관계가 변한다. 나눗셈으로 비교하면 ${A} 수는 항상 ${B2} 수의 ${k}배로 변하지 않는다.`
            });
          }),
          T('cm-age', '뺄셈으로 비교해도 변하지 않는 관계(나이)', '①5 ③6', (d) => {
            // 틀린 보기: 첫 칸만 보고 「항상 2배」라고 한 것, 차가 커진다고 한 것, 누가 더 많은지 뒤바꾼 것
            const who = d.pick(NAMES), b = d.int(4, 7), a = 2 * b, g = a - b;
            return pickOne(d, `${name(who, '과/와')} 동생의 나이를 해마다 적은 표이다. 두 사람의 나이를 바르게 비교한 것은?`, [
              [`${name(who, '은/는')} 항상 동생보다 ${g}살 더 많다.`, true, [`${a + 3}-${b + 3}`, g]],
              [`${nick(who)}의 나이는 항상 동생의 나이의 2배이다.`, false, [`${a + 3}/${b + 3}`, 2]],
              ['두 사람의 나이의 차는 해마다 1살씩 커진다.', false, [`(${a + 1}-${b + 1})-(${a}-${b})`, 1]],
              [`동생은 항상 ${nick(who)}보다 ${g}살 더 많다.`, false, [`${b}-${a}`, g]]
            ], true, {
              figure: tableOf([[`${nick(who)}의 나이(살)`, a, a + 1, a + 2, a + 3], ['동생의 나이(살)', b, b + 1, b + 2, b + 3]]),
              explain: `${a} − ${b} = ${g}, ${a + 1} − ${b + 1} = ${g}, ${a + 2} − ${b + 2} = ${g}, ${a + 3} − ${b + 3} = ${g}이다. 나이는 뺄셈으로 비교한 관계가 변하지 않는다. 나눗셈으로 비교하면 처음에만 2배이고 그 뒤로는 2배가 아니다.`
            });
          }),
          T('cm-kind', '뺄셈으로 비교한 것과 나눗셈으로 비교한 것 가리기', '①7 ②4 심3', (d) => {
            const DIV = ['피자 조각 수는 모둠 학생 수의 3배이다.', `딸기 우유 수는 흰 우유 수의 ${frac(1, 3)}배이다.`, '어미 고양이의 몸무게는 새끼 고양이의 몸무게의 1.5배이다.', '달걀 수는 빵 수의 2배이다.', '연필 수는 지우개 수의 4배이다.'];
            const SUB = ['나무는 나무의 그림자보다 100 cm 더 길다.', '선생님은 나보다 20살 더 많다.', '빨간 구슬은 파란 구슬보다 5개 더 적다.', '오늘은 어제보다 책을 12쪽 더 많이 읽었다.', '키가 작년보다 6 cm 더 컸다.'];
            const div = d.bool(), rows = d.shuffle(div ? DIV : SUB).slice(0, 1).map((s) => [s, true]).concat(d.shuffle(div ? SUB : DIV).slice(0, 3).map((s) => [s, false]));
            return pickOne(d, `두 수를 ${div ? '나눗셈' : '뺄셈'}으로 비교한 것은?`, rows, true, {
              explain: (list) => `「${list.find((r) => r[1])[0].replace(/\.$/, '')}」는 ${div ? '한 수가 다른 수의 몇 배인지를 나타내므로 나눗셈으로 비교한 것이다. 나머지는 얼마나 더 많은지(적은지)를 나타내므로 뺄셈으로 비교한 것이다.' : '한 수가 다른 수보다 얼마나 더 많은지(적은지)를 나타내므로 뺄셈으로 비교한 것이다. 나머지는 몇 배인지를 나타내므로 나눗셈으로 비교한 것이다.'}`
            });
          }),
          T('cm-right', '두 수를 바르게 비교한 것 고르기', '①8 ②4 ③4 심1', (d) => {
            // 틀린 보기: 몇 배를 「몇 개 더 많다」로 적은 것, 두 양의 자리를 바꾼 것(적은 쪽이 몇 배라고 한 것, 적은 쪽이 더 많다고 한 것)
            const [A, B2, u] = d.pick(TWO), b = d.int(3, 9), k = d.int(2, 4), a = b * k, g = a - b;
            return pickOne(d, `${A} ${josa(a + u, '과/와')} ${B2} ${josa(b + u, '이/가')} 있다. 두 수를 바르게 비교한 것은?`, [
              [`${A} 수는 ${B2} 수의 ${k}배이다.`, true, [`${a}/${b}`, k]],
              [`${josa(A, '은/는')} ${B2}보다 ${k}${u} 더 많다.`, false, [`${a}-${b}`, k]],
              [`${B2} 수는 ${A} 수의 ${k}배이다.`, false, [`${b}/${a}`, k]],
              [`${josa(B2, '은/는')} ${A}보다 ${g}${u} 더 많다.`, false, [`${b}-${a}`, g]]
            ], true, { explain: `뺄셈으로 비교하면 ${a} − ${b} = ${g}이므로 ${josa(A, '은/는')} ${B2}보다 ${g}${u} 더 많다. 나눗셈으로 비교하면 ${a} ÷ ${b} = ${k}이므로 ${A} 수는 ${B2} 수의 ${k}배이다.` });
          }),
          T('cm-expr', '나눗셈으로 비교한 식 고르기', '①8 ③3', (d) => {
            // 틀린 보기: 뺄셈으로 비교한 식, 몫으로 나눈 식(두 수를 비교한 것이 아니다), 더한 식
            const [A, B2, u] = d.pick(TWO), [b, k] = d.until(() => [d.int(3, 9), d.int(2, 6)], ([x, y]) => x !== y), a = b * k;
            return pickOne(d, `${A} ${josa(a + u, '과/와')} ${B2} ${b}${u}의 수를 나눗셈으로 비교하려고 한다. 알맞은 식은?`, [
              [`${a} ÷ ${b} = ${k}`, true], [`${a} − ${b} = ${a - b}`, false], [`${a} ÷ ${k} = ${b}`, false], [`${a} + ${b} = ${a + b}`, false]
            ], true, { explain: `나눗셈으로 비교하려면 ${A} 수를 ${B2} 수로 나눈다. ${a} ÷ ${b} = ${k}이므로 ${A} 수는 ${B2} 수의 ${k}배이다.` });
          }),
          T('cm-rects', '모눈에 그린 직사각형의 가로와 세로 비교하기', '③6 심4', (d) => {
            const k = d.pick([2, 3]), g = k - 1;
            return M('모눈에 직사각형 가, 나, 다를 그렸다. 가로와 세로의 칸 수를 뺄셈과 나눗셈으로 비교하였다. ㉠, ㉡에 알맞은 수는?', [{ label: LAB[0], answer: 3 * g }, { label: LAB[1], answer: k }], {
              figure: gridRects([[k, 1], [2 * k, 2], [3 * k, 3]]) + lines([`가로는 세로보다 각각 ${g}칸, ${2 * g}칸, ${box(LAB[0])}칸 더 길다.`, `가로의 칸 수는 항상 세로의 칸 수의 ${box(LAB[1])}배이다.`]),
              explain: `다는 가로 ${3 * k}칸, 세로 3칸이므로 가로가 ${3 * k} − 3 = ${3 * g}(칸) 더 길다. 나눗셈으로 비교하면 ${k} ÷ 1 = ${k}, ${2 * k} ÷ 2 = ${k}, ${3 * k} ÷ 3 = ${k}이므로 가로의 칸 수는 항상 세로의 칸 수의 ${k}배이다. 뺄셈으로 비교한 관계는 변하고 나눗셈으로 비교한 관계는 변하지 않는다.`,
              facts: { calc: [[`${3 * k}-3`, 0], [`${3 * k}/3`, 1]] }
            });
          })
        ]
      },
      {
        id: 'ratio', title: '비', standard: RATIO,
        types: [
          T('rt-word', '비의 뜻', '①17 ②9 ③8', (d) => {
            const rows = d.shuffle([['비', true], ['비율', false], ['백분율', false], ['기준량', false]]);
            return C('두 수를 나눗셈으로 비교하기 위해 기호 :을 사용하여 나타낸 것을 무엇이라고 하는가?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              explain: '두 수를 나눗셈으로 비교하기 위해 기호 :을 사용하여 나타낸 것을 비라고 한다. 두 수 3과 5를 비교할 때 3 : 5라 쓰고 「3 대 5」라고 읽는다.', facts: { truth: rows.map((r) => r[1]), want: true }
            });
          }),
          T('rt-write', '읽은 비를 기호로 쓰기', '①11 ②11 ③12 심10', (d, n) => {
            // 첫째 문항은 「~에 대한 ~의 비」(먼저 말한 수가 기준량), 둘째 문항은 「~의 ~에 대한 비」.
            const [a, b] = pairAB(d);
            return RA(`${READ[n === 0 ? 3 : 2](a, b)}를 기호 :을 사용하여 나타내시오.`, a, b, {
              explain: `「${b}에 대한」은 「${josa(b, '을/를')} 기준으로」와 같은 뜻이다. 기준량 ${josa(b, '을/를')} 기호 :의 오른쪽에, 비교하는 양 ${josa(a, '을/를')} 왼쪽에 쓰므로 ${a} : ${b}이다.`
            });
          }, { count: 2 }),
          T('rt-read', '비를 두 가지로 읽기', '①12 ②12 ③11', (d) => {
            const [a, b] = pairAB(d);
            return M(`비 ${rj(a, b, '을/를')} 두 가지로 읽었다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?`, [a, b, b, a].map((answer, i) => ({ label: LAB[i], answer })), {
              figure: lines([`${box(LAB[0])}의 ${box(LAB[1])}에 대한 비`, `${box(LAB[2])}에 대한 ${box(LAB[3])}의 비`]),
              explain: `${rj(a, b, '은/는')} 「${a} 대 ${b}」, 「${josa(a, '과/와')} ${b}의 비」, 「${a}의 ${b}에 대한 비」, 「${b}에 대한 ${a}의 비」라고 읽는다. 기호 :의 오른쪽에 있는 ${josa(b, '이/가')} 기준량이므로 「에 대한」 앞에는 ${josa(b, '이/가')} 온다.`,
              facts: { calc: [[String(a), 0], [String(b), 1], [String(b), 2], [String(a), 3]] }
            });
          }),
          T('rt-misread', '비를 잘못 읽은 것 고르기', '①13 ②13 ③15 심10', (d) => {
            // 틀린 보기: 「~에 대한」 앞에 비교하는 양을 둔 것(두 수의 자리만 바뀌어 있다)
            const [a, b] = pairAB(d), wf = d.pick([2, 3]);
            const rows = d.shuffle([0, 1, 2, 3]).slice(0, 3).map((f) => [READ[f](a, b), true]).concat([[READ[wf](b, a), false]]);
            return pickOne(d, `비 ${rj(a, b, '을/를')} 잘못 읽은 것은?`, rows, false, {
              explain: `${rj(a, b, '은/는')} 「${a} 대 ${b}」, 「${josa(a, '과/와')} ${b}의 비」, 「${a}의 ${b}에 대한 비」, 「${b}에 대한 ${a}의 비」라고 읽는다. 「${READ[wf](b, a)}」는 ${rj(b, a, '을/를')} 읽은 것이다.`
            });
          }),
          T('rt-odd', '나타내는 비가 다른 하나 찾기', '①13 ②13 ③14 심11', (d) => {
            // 틀린 그림 찾기가 아니라 넷을 모두 기호로 옮겨 보아야 한다. 다른 하나는 두 수의 자리만 바뀐 비이다.
            const [a, b] = pairAB(d), of = d.pick([1, 2, 3]);
            const rows = d.shuffle([0, 1, 2, 3]).slice(0, 3).map((f) => [READ[f](a, b), true, [a, b]]).concat([[READ[of](b, a), false, [b, a]]]);
            const list = d.shuffle(rows);
            return C('나타내는 비가 나머지와 다른 하나는?', list.map((r) => r[0]), list.findIndex((r) => !r[1]), {
              explain: `기호 :을 사용하여 나타내면 차례로 ${list.map((r) => `${r[2][0]} : ${r[2][1]}`).join(', ')}이다. 「${list.find((r) => !r[1])[0]}」만 ${b} : ${a}이다.`, facts: { truth: list.map((r) => r[1]), want: false }
            });
          }),
          T('rt-base', '비에서 기준량과 비교하는 양 찾기', '①14 ②14 ③13 심12', (d, n) => {
            // 첫째 문항은 기호로 쓴 비, 둘째 문항은 말로 읽은 비.
            const [a, b] = pairAB(d, 2, 40), said = n === 0 ? `비 ${a} : ${b}` : `「${READ[d.pick([2, 3])](a, b)}」`;
            return M(`${said}에서 기준량과 비교하는 양은 각각 얼마인가?`, [{ label: '기준량', answer: b }, { label: '비교하는 양', answer: a }], {
              explain: n === 0 ? `비에서 기호 :의 오른쪽에 있는 수가 기준량이고 왼쪽에 있는 수가 비교하는 양이다. 기준량은 ${b}, 비교하는 양은 ${a}이다.` : `「${b}에 대한」은 「${josa(b, '을/를')} 기준으로」와 같은 뜻이다. 기호로 쓰면 ${a} : ${b}이므로 기준량은 ${b}, 비교하는 양은 ${a}이다.`,
              facts: { calc: [[String(b), 0], [String(a), 1]] }
            });
          }, { count: 2 }),
          T('rt-base-name', '기준량과 비교하는 양의 이름', '①14 ③13·16', (d) => {
            const [a, b] = pairAB(d), right = d.bool(), rows = d.shuffle([['기준량', right], ['비교하는 양', !right], ['비율', false], ['백분율', false]]);
            return C(`비 ${a} : ${b}에서 기호 :의 ${right ? '오른쪽' : '왼쪽'}에 있는 ${josa(right ? b : a, '을/를')} 무엇이라고 하는가?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              explain: `비 ${a} : ${b}에서 기호 :의 오른쪽에 있는 ${josa(b, '은/는')} 기준량이고, 왼쪽에 있는 ${josa(a, '은/는')} 비교하는 양이다.`, facts: { truth: rows.map((r) => r[1]), want: true }
            });
          }),
          T('rt-cond', '기준량(비교하는 양)을 보고 비 고르기', '①15 ②15 ③14 심13', (d) => {
            // 보기는 모두 같은 두 수로 되어 있다. 「~에 대한」이 어느 수 뒤에 붙었는지 읽어야 한다.
            const [k, m] = pairAB(d, 2, 15), base = d.bool(), fs = d.shuffle([0, 1, 2, 3]);
            const rows = fs.map((f, i) => { const pair = (i === 0) === base ? [m, k] : [k, m]; return [READ[f](pair[0], pair[1]), i === 0, undefined, pair]; });
            return pickOne(d, `${base ? '기준량' : '비교하는 양'}이 ${k}인 비는?`, rows, true, {
              explain: (list) => `기호 :을 사용하여 나타내면 차례로 ${list.map((r) => `${r[3][0]} : ${r[3][1]}`).join(', ')}이다. 기호 :의 ${base ? '오른쪽에 있는 수가 기준량' : '왼쪽에 있는 수가 비교하는 양'}이므로 ${base ? '기준량' : '비교하는 양'}이 ${k}인 비는 「${list.find((r) => r[1])[0]}」이다.`
            });
          }),
          T('rt-cond-big', '기준량이 비교하는 양보다 큰 비 고르기', '①15 심13', (d) => {
            // 틀린 보기: 「4에 대한 5의 비」처럼 먼저 말한 수가 작아도 기준량이 더 작은 것, 「9와 2의 비」
            const big = d.bool(), pairs = d.until(() => range(4).map(() => pairAB(d, 2, 12)), (ps) => ps.filter(([a, b]) => (big ? b > a : b < a)).length === 1 && new Set(ps.map((p) => p.join())).size === 4);
            const fs = d.shuffle([0, 1, 2, 3]), list = d.shuffle(pairs.map(([a, b], i) => [READ[fs[i]](a, b), big ? b > a : b < a, undefined, [a, b]]));
            return pickOne(d, `기준량이 비교하는 양보다 ${big ? '큰' : '작은'} 비는?`, list, true, {
              keep: true,
              explain: `기호 :을 사용하여 나타내면 차례로 ${list.map((r) => `${r[3][0]} : ${r[3][1]}`).join(', ')}이다. 기호 :의 오른쪽에 있는 기준량이 왼쪽에 있는 비교하는 양보다 ${big ? '큰' : '작은'} 것은 「${list.find((r) => r[1])[0]}」이다.`,
              facts: { choose: { exprs: list.map((r) => `${r[3][0]}/${r[3][1]}`), rule: big ? 'onlyBelow' : 'onlyAbove', target: 1 } }
            });
          }),
          T('rt-true', '비에 대한 설명의 옳고 그름', '①16 ②32 ③16', (d) => {
            const [a, b] = pairAB(d), [c, e] = pairAB(d), [p, q] = pairAB(d);
            const good = d.shuffle([[`${rj(a, b, '은/는')} ${a}의 ${b}에 대한 비이다.`, true], [`${c} : ${e}에서 비교하는 양은 ${c}이다.`, true], [`${p}에 대한 ${q}의 비에서 기준량은 ${p}이다.`, true], [`${josa(c, '과/와')} ${e}의 비는 ${c} : ${e}이다.`, true]]).slice(0, 3);
            const bad = d.pick([[`${rj(p, q, '과/와')} ${rj(q, p, '은/는')} 같은 비이다.`, false, `${rj(p, q, '과/와')} ${rj(q, p, '은/는')} 기준량이 ${josa(q, '과/와')} ${josa(p, '으로/로')} 서로 다르므로 다른 비이다.`], [`${p}에 대한 ${q}의 비는 ${p} : ${q}이다.`, false, `${p}에 대한 ${q}의 비는 기준량이 ${p}이므로 ${q} : ${p}이다.`], [`${p} : ${q}에서 기준량은 ${p}이다.`, false, `${p} : ${q}에서 기준량은 기호 :의 오른쪽에 있는 ${q}이다.`]]);
            return pickOne(d, '비에 대한 설명으로 옳지 않은 것은?', good.concat([bad.slice(0, 2)]), false, { explain: bad[2] });
          }),
          T('rt-swap', '두 수의 자리를 바꾼 비는 같은가', '②16 ③16 심19', (d) => {
            // 틀린 보기: 쓰인 두 수가 같으니 같은 비라는 생각, 기준량을 한쪽으로만 본 것
            const [a, b] = pairAB(d);
            return pickOne(d, `두 비 ${rj(a, b, '과/와')} ${b} : ${a}에 대하여 바르게 말한 것은?`, [
              [`기준량이 ${josa(b, '과/와')} ${josa(a, '으로/로')} 서로 다르므로 두 비는 다르다.`, true],
              [`두 비 모두 ${josa(a, '과/와')} ${josa(b, '을/를')} 비교한 것이므로 두 비는 같다.`, false],
              [`두 비 모두 기준량이 ${b}이므로 두 비는 같다.`, false],
              [`두 비 모두 비교하는 양이 ${a}이므로 두 비는 같다.`, false]
            ], true, { explain: `${a} : ${b}에서 기준량은 ${b}, 비교하는 양은 ${a}이고, ${b} : ${a}에서 기준량은 ${a}, 비교하는 양은 ${b}이다. 기준량과 비교하는 양이 서로 다르므로 두 비는 다르다.` });
          }),
          T('rt-pic', '그림을 보고 두 수의 비 쓰기', '①18 ②10 ③9', (d) => {
            const [a, b] = pairAB(d, 2, 9), [A, B2, ka, kb] = d.pick([['동그라미', '세모', 'c', 't'], ['네모', '동그라미', 's', 'c'], ['세모', '네모', 't', 's']]), [said, back] = d.pick(PHRASE)(`${A} 수`, `${B2} 수`);
            const x = back ? b : a, y = back ? a : b;
            return RA(`그림을 보고 ${said}를 쓰시오.`, x, y, {
              figure: things([[A, a, ka], [B2, b, kb]]),
              explain: `${josa(A, '은/는')} ${a}개, ${josa(B2, '은/는')} ${b}개이다. ${back ? `「${A} 수에 대한」은 ${A} 수를 기준으로 한다는 뜻이므로 기준량은 ${a}이다.` : `기준량은 ${B2} 수인 ${b}이다.`} ${said}는 ${x} : ${y}이다.`
            });
          }),
          T('rt-text', '문장을 읽고 두 수의 비 쓰기', '①19 ②19 ③10 심9', (d) => {
            const [a, b] = pairAB(d, 6, 19), [said, back] = d.pick(PHRASE.slice(1))('남학생 수', '여학생 수'), x = back ? b : a, y = back ? a : b;
            return RA(`${nick(d.pick(NAMES))}네 반 학생은 남학생이 ${a}명, 여학생이 ${b}명이다. ${said}를 쓰시오.`, x, y, {
              explain: `${back ? '「남학생 수에 대한」은 남학생 수를 기준으로 한다는 뜻이다. 기준량은 남학생 수' : '「여학생 수에 대한」은 여학생 수를 기준으로 한다는 뜻이다. 기준량은 여학생 수'}인 ${y}이고 비교하는 양은 ${x}이므로 ${x} : ${y}이다.`
            });
          }),
          T('rt-text-extra', '쓰지 않는 수가 섞인 문장에서 비 쓰기', '①19', (d) => {
            const [a, b] = d.until(() => [d.int(2, 9) * 5, d.int(2, 9) * 5], ([x, y]) => x !== y), t = (Math.floor((a + b) / 50) + d.int(2, 3)) * 50;
            return RA(`전체 학생 ${t}명 가운데 피구부 학생은 ${a}명, 축구부 학생은 ${b}명이다. 축구부 학생 수에 대한 피구부 학생 수의 비를 쓰시오.`, a, b, {
              explain: `기준량은 축구부 학생 수인 ${b}이고 비교하는 양은 피구부 학생 수인 ${a}이므로 ${a} : ${b}이다. 전체 학생 수 ${josa(t, '은/는')} 이 비에 쓰이지 않는다.`
            });
          }),
          T('rt-total', '빼서 구한 수로 비 쓰기', '①20 ②20 ③18 심15', (d, n) => {
            // 첫째 문항은 전체에서 한쪽을 빼기, 둘째 문항은 늘어난 양.
            if (n === 0) {
              const t = d.int(21, 32), m = d.until(() => d.int(9, t - 9), (v) => v * 2 !== t), whole = d.bool();
              return RA(`${nick(d.pick(NAMES))}네 반 학생 ${t}명 가운데 남학생은 ${m}명이다. ${whole ? '전체 학생 수' : '남학생 수'}에 대한 여학생 수의 비를 쓰시오.`, [`${t}-${m}`, t - m], whole ? t : m, {
                explain: `여학생은 ${t} − ${m} = ${t - m}(명)이다. 기준량은 ${whole ? '전체 학생 수' : '남학생 수'}인 ${whole ? t : m}이고 비교하는 양은 여학생 수인 ${t - m}이므로 ${t - m} : ${whole ? t : m}이다.`
              });
            }
            const a = d.int(31, 42), g = d.int(2, 6), b = a + g, who = d.pick(NAMES);
            return RA(`${name(who, '의/의')} 몸무게는 작년에 ${a} kg이었고 올해는 ${b} kg이다. 작년 몸무게에 대한 늘어난 몸무게의 비를 쓰시오.`, [`${b}-${a}`, g], a, {
              explain: `늘어난 몸무게는 ${b} − ${a} = ${g}(kg)이다. 기준량은 작년 몸무게인 ${a}이고 비교하는 양은 늘어난 몸무게인 ${g}이므로 ${g} : ${a}이다.`
            });
          }, { count: 2 }),
          T('rt-who', '비가 나타내는 것 고르기', '①21 ③19', (d) => {
            // 틀린 보기: 두 양의 자리를 바꾸어 읽은 것 셋
            const [A, B2, u] = d.pick(TWO.slice(0, 3)), [a, b] = pairAB(d, 2, 12), fs = d.shuffle([0, 1, 2]), X = `${A} 수`, Y = `${B2} 수`;
            const rows = [[PHRASE[fs[0]](fs[0] === 1 ? Y : X, fs[0] === 1 ? X : Y)[0], true]].concat(range(3).map((f) => [PHRASE[f](f === 1 ? X : Y, f === 1 ? Y : X)[0], false]));
            return pickOne(d, `${A} ${josa(a + u, '과/와')} ${B2} ${josa(b + u, '이/가')} 있다. 비 ${rj(a, b, '이/가')} 나타내는 것은?`, rows, true, {
              explain: `${a} : ${b}에서 기준량은 ${B2} 수인 ${b}이고 비교하는 양은 ${A} 수인 ${a}이다. ${B2} 수를 기준으로 ${A} 수를 비교한 비이므로 「${Y}에 대한 ${X}의 비」, 「${X}의 ${Y}에 대한 비」, 「${josa(X, '과/와')} ${Y}의 비」라고 한다.`
            });
          }),
          T('rt-shade', '색칠한 그림을 보고 비 쓰기', '①22 ②17 ③17 심14', (d, n) => {
            // 첫째 문항은 전체에 대한 색칠한 부분의 비, 둘째 문항은 색칠하지 않은 부분이 기준량인 비, 셋째 문항은 두 빛깔로 칠한 그림에서 한 빛깔이 기준량인 비(전체 칸 수는 쓰이지 않는다).
            if (n === 2) {
              const [c2, r2] = d.pick([[5, 3], [4, 3], [5, 2], [4, 4]]), all = c2 * r2, [b, y] = d.until(() => [d.int(2, all - 4), d.int(2, all - 4)], ([p, q]) => p !== q && p + q <= all - 2);
              return RA('파란색으로 칠한 부분에 대한 노란색으로 칠한 부분의 비를 쓰시오.', y, b, { figure: cells(c2, r2, range(b), { on2: range(y, b) }), explain: `파란색으로 칠한 부분은 ${b}칸, 노란색으로 칠한 부분은 ${y}칸이다. 기준량은 파란색으로 칠한 부분인 ${b}이므로 ${y} : ${b}이다. 전체 칸 수 ${josa(all, '은/는')} 이 비에 쓰이지 않는다.` });
            }
            const [cols, total] = d.pick([[3, 6], [4, 8], [3, 9], [5, 10], [4, 12], [5, 15]]), k = d.until(() => d.int(2, total - 2), (v) => v * 2 !== total);
            if (n === 0) return RA('전체에 대한 색칠한 부분의 비를 쓰시오.', k, total, { figure: pieces('grid', total, { shaded: k, cols }), explain: `전체는 ${total}칸이고 색칠한 부분은 ${k}칸이다. 기준량은 전체인 ${total}이므로 ${k} : ${total}이다.` });
            return RA('색칠하지 않은 부분에 대한 색칠한 부분의 비를 쓰시오.', k, [`${total}-${k}`, total - k], { figure: pieces('grid', total, { shaded: k, cols }), explain: `색칠한 부분은 ${k}칸이고 색칠하지 않은 부분은 ${total} − ${k} = ${total - k}(칸)이다. 기준량은 색칠하지 않은 부분인 ${total - k}이므로 ${k} : ${total - k}이다.` });
          }, { count: 3 }),
          T('rt-shade-pick', '비에 맞게 색칠한 그림 고르기', '①22·23 ②18 심29', (d) => {
            // 틀린 그림: 색칠한 칸과 색칠하지 않은 칸의 수를 비의 두 수로 본 것(전체 칸 수가 다르다), 색칠하지 않은 칸을 센 것, 한 칸 더 칠한 것
            const [k, total, g1, g2] = d.pick([[2, 8, [4, 2], [5, 2]], [3, 9, [3, 3], [4, 3]], [2, 10, [5, 2], [4, 3]], [3, 12, [4, 3], [5, 3]], [4, 12, [4, 3], [4, 4]], [2, 6, [3, 2], [4, 2]], [3, 15, [5, 3], [6, 3]]]);
            const list = d.shuffle([[g1, k], [g2, k], [g1, total - k], [g1, k + 1]]), ok = list.map(([g, s]) => s === k && g[0] * g[1] === total);
            return C(`전체에 대한 색칠한 부분의 비가 ${rj(k, total, '이/가')} 되도록 바르게 색칠한 것은?`, TAGS, ok.indexOf(true), {
              figure: tiles(list.map(([g, s], i) => cells(g[0], g[1], range(s), { u: 20, tag: TAGS[i] }))),
              explain: `전체가 ${total}칸이고 그 가운데 ${k}칸을 색칠해야 한다. ${list.map(([g, s], i) => `${TAGS[i]}는 ${g[0] * g[1]}칸 가운데 ${s}칸`).join(', ')}을 색칠하였다. 색칠한 칸과 색칠하지 않은 칸이 ${k}칸과 ${total}칸인 그림은 전체가 ${k + total}칸이다.`,
              facts: { truth: ok, want: true, claimed: list.map(([g, s]) => [`(${s}-${k})*(${s}-${k})+(${g[0]}*${g[1]}-${total})*(${g[0]}*${g[1]}-${total})`, 0]), claimedWant: true }
            });
          }),
          T('rt-table', '표를 보고 비 쓰기', '③19', (d) => {
            const kinds = ['어린이', '청소년', '어른'], fee = d.pick([[500, 900, 1300], [600, 1000, 1500], [450, 800, 1200], [700, 1100, 1600]]), [i, j] = d.pick([[0, 2], [2, 0], [0, 1], [1, 2], [2, 1], [1, 0]]);
            return RA(`버스 요금을 나타낸 표이다. ${kinds[j]} 요금에 대한 ${kinds[i]} 요금의 비를 쓰시오.`, fee[i], fee[j], {
              figure: table(['구분', '요금(원)'], kinds.map((kind, at) => [kind, fee[at]])),
              explain: `기준량은 ${kinds[j]} 요금인 ${fee[j]}이고 비교하는 양은 ${kinds[i]} 요금인 ${fee[i]}이므로 ${fee[i]} : ${fee[j]}이다.`
            });
          }),
          T('rt-length', '약도를 보고 거리의 비 쓰기', '①24 ②21', (d) => {
            const [L, R] = d.pick([['문구점', '학교'], ['도서관', '공원'], ['우체국', '병원']]), [a, b] = d.until(() => [d.int(12, 48) * 10, d.int(12, 48) * 10], ([x, y]) => Math.abs(x - y) >= 60), back = d.bool();
            return RA(`집에서 ${back ? L : R}까지의 거리에 대한 집에서 ${back ? R : L}까지의 거리의 비를 쓰시오.`, back ? b : a, back ? a : b, {
              figure: mapFig(L, a, R, b),
              explain: `기준량은 집에서 ${back ? L : R}까지의 거리인 ${back ? a : b}이고 비교하는 양은 집에서 ${back ? R : L}까지의 거리인 ${back ? b : a}이므로 ${back ? b : a} : ${back ? a : b}이다.`
            });
          }),
          T('rt-pack-wrong', '한 묶음의 두 양을 비교한 말 가리기', '③4', (d) => {
            // 틀린 보기: 묶음이 하나일 때의 차를 「항상」이라고 한 것
            const [pack, A] = d.pick([['접시', '만두'], ['봉지', '귤'], ['상자', '사과'], ['바구니', '감']]), k = d.int(3, 6);
            return pickOne(d, `${pack} 1개에 ${josa(A, '을/를')} ${k}개씩 담았다. ${pack} 수와 ${A} 수를 비교한 것으로 옳지 않은 것은?`, [
              [`${A} 수는 항상 ${pack} 수의 ${k}배이다.`, true, [`${2 * k}/2`, k]],
              [`${josa(A, '은/는')} 항상 ${pack}보다 ${k - 1}개 더 많다.`, false, [`${2 * k}-2`, k - 1]],
              [`${pack} 수에 대한 ${A} 수의 비는 ${k} : 1이다.`, true, [`${k}/1`, k]],
              [`${pack}가 2개이면 ${josa(A, '은/는')} ${2 * k}개이다.`, true, [`2*${k}`, 2 * k]]
            ], false, { explain: `${pack}가 1개, 2개, 3개일 때 ${josa(A, '은/는')} ${k}개, ${2 * k}개, ${3 * k}개이므로 ${josa(A, '은/는')} ${pack}보다 ${k - 1}개, ${2 * k - 2}개, ${3 * k - 3}개 더 많다. 뺄셈으로 비교한 관계는 변하고, 나눗셈으로 비교한 관계(${k}배, ${k} : 1)는 변하지 않는다.` });
          })
        ]
      },
      {
        id: 'rate', title: '비율', standard: RATE,
        types: [
          T('ra-word', '비율의 뜻', '①25 ②9 ③23', (d) => {
            const rows = d.shuffle([['비율', true], ['비', false], ['기준량', false], ['백분율', false]]);
            return C('기준량에 대한 비교하는 양의 크기를 무엇이라고 하는가?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              explain: `기준량에 대한 비교하는 양의 크기를 비율이라고 한다. 비 3 : 4에서 기준량은 4, 비교하는 양은 3이므로 비율은 3 ÷ 4 = ${frac(3, 4)}이다.`, facts: { truth: rows.map((r) => r[1]), want: true }
            });
          }),
          T('ra-formula', '비율을 구하는 식', '①25 ③23', (d) => {
            // 틀린 보기: 기준량을 비교하는 양으로 나눈 것(나누는 차례를 바꾼 것)
            const [a, b] = d.until(() => pairAB(d, 2, 9), ([x, y]) => x < y);
            return pickOne(d, '비율을 구하는 식으로 알맞은 것은?', [['(비교하는 양) ÷ (기준량)', true], ['(기준량) ÷ (비교하는 양)', false], ['(비교하는 양) − (기준량)', false], ['(기준량) × (비교하는 양)', false]], true, {
              explain: `(비율) = (비교하는 양) ÷ (기준량)이다. 비 ${a} : ${b}에서 비교하는 양은 ${a}, 기준량은 ${b}이므로 비율은 ${a} ÷ ${b} = ${frac(a, b)}이다.`
            });
          }),
          T('ra-frac', '비의 비율을 분수로 나타내기', '①26·27 ②25·26 ③24 심21', (d, n) => {
            // 첫째 문항은 기호로 쓴 비, 둘째 문항은 말로 읽은 비(기준량을 먼저 가린다), 셋째 문항은 비교하는 양이 기준량보다 큰 비.
            const [a, b] = n === 2 ? d.until(() => [d.int(3, 25), d.int(2, 12)], ([x, y]) => x > y && x % y !== 0) : d.until(() => [d.int(1, 24), d.int(2, 25)], ([x, y]) => x < y), g = gcd(a, b);
            const said = n === 1 ? `${READ[d.pick([2, 3])](a, b)}의` : `비 ${a} : ${b}의`;
            return FR(`${said} 비율을 분수로 나타내시오.`, a, b, {
              explain: `${n === 1 ? `기준량은 ${b}, 비교하는 양은 ${a}이다. ` : ''}(비율) = (비교하는 양) ÷ (기준량) = ${a} ÷ ${b} = ${frac(a, b)}${g > 1 ? ` = ${frac(a / g, b / g)}` : ''}이다.${n === 2 ? ' 비교하는 양이 기준량보다 크므로 비율이 1보다 크다.' : ''}`,
              facts: { rule: ['fracUnder', 'fracRead', 'fracOver'][n] }
            });
          }, { count: 3 }),
          T('ra-dec', '비의 비율을 소수로 나타내기', '①26·27 ②25·26 ③24 심21', (d, n) => {
            // 첫째 문항은 소수 둘째 자리 안에서 끝나는 비율, 둘째 문항은 소수 셋째 자리까지 가는 비율, 셋째 문항은 1보다 큰 비율.
            const [a, b] = n === 0 ? d.until(() => [d.int(1, 49), d.pick([4, 5, 10, 20, 25, 50])], ([x, y]) => x < y && K(x, y) % 10 === 0)
              : n === 1 ? d.until(() => [d.int(1, 60), d.pick([8, 40, 125, 200])], ([x, y]) => x < y && K(x, y) % 10 !== 0)
                : d.until(() => [d.int(3, 24), d.pick([2, 4, 5, 8])], ([x, y]) => x > y && x % y !== 0);
            return DR(`비 ${a} : ${b}의 비율을 소수로 나타내시오.`, a, b, {
              explain: `(비율) = (비교하는 양) ÷ (기준량) = ${a} ÷ ${b} = ${frac(a, b)} = ${dec(a, b)}이다.${n === 2 ? ' 비교하는 양이 기준량보다 크므로 비율이 1보다 크다.' : ''}`,
              facts: { rule: ['decTwo', 'decThree', 'decOver'][n] }
            });
          }, { count: 3 }),
          T('ra-over-pick', '비교하는 양이 기준량보다 큰 것 찾기', '①27 ②31 ③56 심25', (d) => {
            // 틀린 보기: 「9에 대한 4의 비」처럼 먼저 말한 수가 더 커도 기준량이 더 큰 것, 1보다 작은 분수·소수·비
            const over = d.int(0, 3), small = () => d.until(() => [d.int(2, 12), d.int(3, 13)], ([x, y]) => x < y && gcd(x, y) === 1), large = () => d.until(() => [d.int(3, 13), d.int(2, 12)], ([x, y]) => x > y && gcd(x, y) === 1);
            const mk = [(a, b) => `「${READ[3](a, b)}」`, (a, b) => frac(a, b), (a, b) => `${a} : ${b}`];
            const list = d.shuffle(range(4).map((i) => {
              if (i === 3) { const t = i === over ? d.pick(['1.02', '1.2', '1.05', '1.5']) : d.pick(['0.83', '0.9', '0.75', '0.6']); return [t, i === over, undefined, t]; }
              const [a, b] = i === over ? large() : small();
              return [mk[i](a, b), i === over, undefined, `${a}/${b}`];
            }));
            return pickOne(d, '비교하는 양이 기준량보다 큰 것은?', list, true, {
              keep: true, facts: { choose: { exprs: list.map((r) => r[3]), rule: 'onlyAbove', target: 1 } },
              explain: `비교하는 양이 기준량보다 크면 비율이 1보다 크다. 「~에 대한」 앞의 수와 기호 :의 오른쪽 수, 분수의 분모가 기준량이다. 비율이 1보다 큰 것은 ${list.find((r) => r[1])[0]}뿐이다.`
            });
          }),
          T('ra-table', '비교하는 양·기준량·비율을 표로 정리하기', '①26 ②27 ③24', (d) => {
            const [a, b] = d.until(() => [d.int(1, 30), d.pick([4, 5, 8, 10, 20, 25, 50])], ([x, y]) => x !== y && ends(x, y) && K(x, y) % 1000 !== 0), f = d.pick([1, 2, 3]);
            return M('비를 보고 표를 완성하려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LAB[0], answer: a }, { label: LAB[1], answer: b }, { label: LAB[2], answer: K(a, b) / 1000, decimal: true }], {
              figure: table(null, [['비', READ[f](a, b)], ['비교하는 양', box(LAB[0])], ['기준량', box(LAB[1])], ['비율(소수)', box(LAB[2])]]),
              explain: `${READ[f](a, b)}를 기호 :을 사용하여 나타내면 ${a} : ${b}이다. 비교하는 양은 ${a}, 기준량은 ${b}이고 비율은 ${a} ÷ ${b} = ${dec(a, b)}이다.`,
              facts: { calc: [[String(a), 0], [String(b), 1], [`${a}/${b}`, 2]] }
            });
          }),
          T('ra-wrong', '비율을 잘못 나타낸 것 고르기', '①28 ②32 심21', (d) => {
            // 틀린 보기: 「7에 대한 3의 비」를 말한 차례대로 7/3이라고 한 것(기준량과 비교하는 양을 바꾸어 나눈 것)
            const ps = d.until(() => range(4).map(() => d.until(() => [d.int(2, 9), d.pick([4, 5, 7, 8, 9, 10])], ([x, y]) => x !== y && gcd(x, y) === 1)), (list) => new Set(list.map((p) => p.join())).size === 4 && ends(list[2][0], list[2][1]));
            const [[a0, b0], [a1, b1], [a2, b2], [a3, b3]] = ps;
            return pickOne(d, '비를 비율로 잘못 나타낸 것은?', [
              [`${a0} : ${b0} → ${frac(a0, b0)}`, true, [`${a0}*${b0}-${b0}*${a0}`, 0]],
              [`${READ[2](a1, b1)} → ${frac(a1, b1)}`, true, [`${a1}*${b1}-${b1}*${a1}`, 0]],
              [`${a2} : ${b2} → ${dec(a2, b2)}`, true, [`${a2}/${b2}`, K(a2, b2) / 1000]],
              [`${READ[3](a3, b3)} → ${frac(b3, a3)}`, false, [`${a3}*${a3}-${b3}*${b3}`, 0]]
            ], false, { explain: `${READ[3](a3, b3)}에서 기준량은 ${b3}, 비교하는 양은 ${a3}이므로 비율은 ${a3} ÷ ${b3} = ${frac(a3, b3)}이다. 말한 차례대로 ${fj(b3, a3, '이라고/라고')} 쓰면 안 된다.` });
          }),
          T('ra-true', '비율에 대한 설명 가리기', '①28 ②32 ③23 심26', (d) => {
            const [a, b] = d.until(() => [d.int(3, 24), d.pick([4, 5, 10, 20, 25, 50])], ([x, y]) => x < y), [c, e] = d.pick([[9, 6], [6, 4], [12, 8], [15, 10], [10, 4], [5, 2]]);
            const good = d.pick([[`${b}에 대한 ${a}의 비율은 ${dec(a, b)}이다.`, true, `${b}에 대한 ${a}의 비율은 ${a} ÷ ${b} = ${dec(a, b)}이다.`], [`기준량이 ${e}, 비교하는 양이 ${c}이면 비율은 ${dec(c, e)}이다.`, true, `기준량이 ${e}, 비교하는 양이 ${c}이면 비율은 ${c} ÷ ${e} = ${dec(c, e)}이다.`]]);
            const bad = d.shuffle([['비율은 분수로만 나타낼 수 있다.', false], ['비율은 기준량을 비교하는 양으로 나눈 값이다.', false], [`비 ${a} : ${b}의 비율은 ${b} ÷ ${josa(a, '으로/로')} 구한다.`, false], ['비율은 항상 1보다 작다.', false]]).slice(0, 3);
            return pickOne(d, '비율에 대한 설명으로 옳은 것은?', [good.slice(0, 2)].concat(bad), true, { explain: `비율은 비교하는 양을 기준량으로 나눈 값이고 분수나 소수로 나타낼 수 있다. 비교하는 양이 기준량보다 크면 비율은 1보다 크다. ${good[2]}` });
          }),
          T('ra-match', '비와 비율(분수·소수) 짝 짓기', '①29 ②28 ③25 심22', (d) => {
            // 틀린 보기: 「~에 대한」을 거꾸로 읽어 분수와 소수가 모두 뒤집힌 것, 분수는 맞고 소수의 자리가 틀린 것, 기준량을 두 수의 합으로 잘못 본 분수
            const flip = d.pick([[4, 5], [2, 5], [5, 8]]), rest = d.shuffle([[1, 4], [3, 4], [1, 2], [3, 5], [7, 10], [3, 20], [6, 25], [1, 5]]).slice(0, 3), ms = range(4).map(() => d.int(2, 6)), fs = d.shuffle([0, 1, 2]);
            const row = ([p, q], i, f, kind) => {
              const a = p * ms[i], b = q * ms[i], k = K(p, q), said = READ[f](a, b), right = `${frac(p, q)}, ${ks(k)}`;
              const shown = kind === 'flip' ? `${frac(q, p)}, ${dec(q, p)}` : kind === 'shift' ? `${frac(p, q)}, ${ks(k % 10 === 0 ? k / 10 : k * 10)}` : kind === 'part' ? `${frac(p, p + q)}, ${ks(k)}` : right;
              return [`${said} → ${shown}`, kind === 'ok', undefined, `${said}의 비율은 ${a} ÷ ${b} = ${right.replace(', ', ' = ')}`];
            };
            const list = d.shuffle([row(rest[0], 0, fs[0], 'ok'), row(flip, 1, 3, 'flip'), row(rest[1], 2, fs[1], 'shift'), row(rest[2], 3, fs[2], 'part')]);
            return pickOne(d, '비와 그 비율을 분수와 소수로 바르게 나타낸 것은?', list, true, { keep: true, explain: `${list.map((r) => r[3]).join(', ')}이다.` });
          }),
          T('ra-odd', '비율이 다른 하나 찾기', '②29 ③26 심23', (d) => {
            // 다른 하나는 두 수의 자리를 바꾸어 읽은 비이다. 수만 보면 같은 비율로 보이므로 기준량을 가려야 한다.
            const [p, q] = d.pick([[3, 2], [3, 4], [2, 5], [3, 5], [4, 5], [1, 4], [5, 4], [7, 10], [1, 2]]), ms = d.shuffle([2, 3, 4, 5, 6]), of = d.pick([2, 3]);
            const same = d.shuffle([[`${p * ms[0]} : ${q * ms[0]}`, `${p * ms[0]}/${q * ms[0]}`], [READ[d.pick([0, 1])](p * ms[1], q * ms[1]), `${p * ms[1]}/${q * ms[1]}`], [frac(p, q), `${p}/${q}`], [dec(p, q), dec(p, q)]]).slice(0, 3).map(([text, e]) => [text, true, undefined, e]);
            const odd = [READ[of](q * ms[2], p * ms[2]), false, undefined, `${q * ms[2]}/${p * ms[2]}`], list = d.shuffle(same.concat([odd]));
            return pickOne(d, '비율이 나머지와 다른 하나는?', list, false, {
              keep: true, facts: { choose: { exprs: list.map((r) => r[3]), rule: 'odd' } },
              explain: `「${odd[0]}」는 기준량이 ${p * ms[2]}, 비교하는 양이 ${q * ms[2]}이므로 비율이 ${frac(q * ms[2], p * ms[2])}${p === 1 ? ` = ${q}` : ` = ${frac(q, p)}`}이다. 나머지는 비율이 모두 ${frac(p, q)}(= ${dec(p, q)})이다.`
            });
          }),
          T('ra-same', '비율이 주어진 분수와 같은 비 고르기', '①36 ②25·29', (d) => {
            // 틀린 보기: 두 수의 자리를 바꾸어 읽은 비, 기준량을 두 수의 합으로 잘못 본 비(3 : 8), 비교하는 양을 두 수의 차로 잘못 본 비
            const [p, q] = d.pick([[3, 5], [2, 5], [3, 4], [1, 4], [2, 3], [4, 5], [5, 8], [3, 8]]), ms = d.shuffle([2, 3, 4, 5, 6, 7]);
            const list = d.shuffle([
              [READ[d.pick([0, 1, 2, 3])](p * ms[0], q * ms[0]), true, undefined, `${p * ms[0]}/${q * ms[0]}`],
              [READ[3](q * ms[1], p * ms[1]), false, undefined, `${q * ms[1]}/${p * ms[1]}`],
              [`${p * ms[2]} : ${(p + q) * ms[2]}`, false, undefined, `${p * ms[2]}/${(p + q) * ms[2]}`],
              [READ[2]((q - p) * ms[3], q * ms[3]), false, undefined, `${(q - p) * ms[3]}/${q * ms[3]}`]
            ]);
            return pickOne(d, `비율이 ${fj(p, q, '과/와')} 같은 비는?`, list, true, {
              keep: true, facts: { choose: { exprs: list.map((r) => r[3]), rule: 'equals', target: p / q } },
              explain: `「${list.find((r) => r[1])[0]}」의 비율은 ${frac(p * ms[0], q * ms[0])}이고, 분모와 분자를 ${josa(ms[0], '으로/로')} 나누면 ${frac(p, q)}이다. 「${READ[3](q * ms[1], p * ms[1])}」는 기준량이 ${p * ms[1]}이므로 비율이 ${frac(q * ms[1], p * ms[1])}이다.`
            });
          }),
          T('ra-order', '여러 비의 비율을 크기 차례로 놓기', '①30 ②30 ③27 심24', (d) => {
            const ps = d.shuffle([[1, 5], [1, 4], [2, 5], [1, 2], [3, 5], [3, 4], [4, 5], [7, 10], [9, 10], [3, 10]]).slice(0, 3), ms = d.shuffle([2, 3, 4, 5, 6, 8]), fs = d.shuffle([0, 2, 3]), down = d.bool();
            const items = ps.map(([p, q], i) => ({ text: READ[fs[i]](p * ms[i], q * ms[i]), e: `${p * ms[i]}/${q * ms[i]}`, v: p / q, s: dec(p, q) })), tags = LAB.slice(0, 3);
            const oc = orderChoice(d, items.map((x) => x.v), tags, down);
            return C(`비율이 ${down ? '높은' : '낮은'} 것부터 차례로 쓴 것은?`, oc.options, oc.answer, {
              figure: tagged(items.map((x) => x.text), tags),
              explain: `비율을 소수로 나타내면 ${items.map((x, i) => `${tags[i]} ${x.s}`).join(', ')}이다. ${down ? '높은' : '낮은'} 것부터 차례로 쓰면 ${oc.options[oc.answer]}이다.`,
              facts: { choose: { exprs: items.map((x) => x.e), rule: down ? 'descending' : 'ascending', orders: oc.list } }
            });
          }),
          T('ra-compare', '두 비의 비율의 크기 비교', '①30 ②30 ③27', (d) => {
            const pool = [[1, 4], [2, 5], [1, 2], [3, 5], [3, 4], [4, 5], [7, 10], [3, 10]], same = d.int(0, 2) === 0;
            const [p1, q1] = d.pick(pool), [p2, q2] = same ? [p1, q1] : d.until(() => d.pick(pool), ([x, y]) => x * q1 !== y * p1), [m1, m2] = d.until(() => [d.int(2, 7), d.int(2, 7)], ([x, y]) => x !== y);
            const left = READ[0](p1 * m1, q1 * m1), right = READ[3](p2 * m2, q2 * m2), v1 = p1 * q2, v2 = p2 * q1;
            return C('두 비의 비율의 크기를 비교하여 ○ 안에 알맞은 것은?', SIGNS, v1 > v2 ? 0 : v1 === v2 ? 1 : 2, {
              figure: versus(left, right),
              explain: `${left}의 비율은 ${frac(p1 * m1, q1 * m1)} = ${dec(p1, q1)}이다. ${right}는 기준량이 ${q2 * m2}이므로 비율은 ${frac(p2 * m2, q2 * m2)} = ${dec(p2, q2)}이다. ${dec(p1, q1)} ${SIGNS[v1 > v2 ? 0 : v1 === v2 ? 1 : 2]} ${dec(p2, q2)}`,
              facts: { choose: { exprs: [`${p1 * m1}/${q1 * m1}`, `${p2 * m2}/${q2 * m2}`], rule: 'compare' } }
            });
          }),
          T('ra-pic', '그림을 보고 비율을 분수로 나타내기', '①31', (d) => {
            const [a, b] = d.until(() => pairAB(d, 2, 9), ([x, y]) => y % x !== 0), [A, B2, ka, kb] = d.pick([['세모', '네모', 't', 's'], ['동그라미', '네모', 'c', 's'], ['세모', '동그라미', 't', 'c']]), g = gcd(a, b);
            return FR(`그림에서 ${A} 수에 대한 ${B2} 수의 비율을 분수로 나타내시오.`, b, a, {
              figure: things([[A, a, ka], [B2, b, kb]]),
              explain: `${josa(A, '은/는')} ${a}개, ${josa(B2, '은/는')} ${b}개이다. 기준량은 ${A} 수인 ${a}, 비교하는 양은 ${B2} 수인 ${b}이므로 비율은 ${b} ÷ ${a} = ${frac(b, a)}${g > 1 ? ` = ${frac(b / g, a / g)}` : ''}이다.`
            });
          }),
          T('ra-shade', '색칠한 부분의 비율을 소수로 나타내기', '①31 ②33 ③28 심28', (d) => {
            const [total, cols] = d.pick([[4, 2], [5, 5], [8, 4], [10, 5], [20, 5], [25, 5]]), k = d.int(1, total - 1);
            return DR('전체에 대한 색칠한 부분의 비율을 소수로 나타내시오.', k, total, {
              figure: pieces('grid', total, { shaded: k, cols }), explain: `전체 ${total}칸 가운데 ${k}칸을 색칠하였다. 비율은 ${k} ÷ ${total} = ${frac(k, total)} = ${dec(k, total)}이다.`
            });
          }),
          T('ra-shade-count', '비율에 맞게 색칠할 칸 수', '①32 ②18 심29', (d) => {
            const [p, q] = d.pick([[2, 5], [3, 4], [2, 3], [3, 5], [1, 4], [5, 6], [3, 8], [4, 5]]), m = d.int(2, 4), total = q * m;
            return N(`전체에 대한 색칠한 부분의 비율이 ${fj(p, q, '이/가')} 되도록 색칠하려고 한다. 몇 칸을 색칠해야 하는가?`, p * m, {
              unit: '칸', figure: pieces('grid', total, { shaded: 0, cols: q }),
              explain: `전체는 ${total}칸이다. 분모와 분자에 ${josa(m, '을/를')} 곱하면 ${frac(p, q)} = ${frac(p * m, total)}이므로 ${p * m}칸을 색칠해야 한다.`, facts: { calc: [[`${total}*${p}/${q}`, 0]] }
            });
          }),
          T('ra-rect', '직사각형의 두 변의 길이의 비율', '①33 ②34 ③29 심30', (d, n) => {
            // 첫째 문항은 가로에 대한 세로의 비율(분수), 둘째 문항은 세로에 대한 가로의 비율(1보다 큰 소수).
            if (n === 0) {
              const [w, h] = d.until(() => [d.int(8, 30), d.int(4, 24)], ([x, y]) => y < x && x <= 3 * y), g = gcd(w, h);
              return FR('직사각형의 가로에 대한 세로의 비율을 분수로 나타내시오.', h, w, { figure: rectFig(w, h, 'cm'), explain: `기준량은 가로 ${w} cm, 비교하는 양은 세로 ${h} cm이다. 비율은 ${h} ÷ ${w} = ${frac(h, w)}${g > 1 ? ` = ${frac(h / g, w / g)}` : ''}이다.` });
            }
            const [w, h] = d.pick([[15, 12], [25, 20], [24, 15], [28, 16], [35, 20], [12, 8], [21, 12], [18, 15], [27, 20]]);
            return DR('직사각형의 세로에 대한 가로의 비율을 소수로 나타내시오.', w, h, { figure: rectFig(w, h, 'cm'), explain: `기준량은 세로 ${h} cm, 비교하는 양은 가로 ${w} cm이다. 비율은 ${w} ÷ ${h} = ${dec(w, h)}이다. 비교하는 양이 기준량보다 크므로 비율이 1보다 크다.` });
          }, { count: 2 }),
          T('ra-rect-same', '가로에 대한 세로의 비율이 다른 직사각형 찾기', '①33 ②35 ③30 심30', (d) => {
            // 다른 하나는 가로와 세로의 차가 가장 작은 직사각형과 같다. 차로 비교하면 틀리고 비율을 구해야 한다.
            const [p, q] = d.pick([[2, 3], [3, 4], [3, 5], [4, 5], [1, 2]]), same = d.shuffle([2, 3, 4, 5, 6]).slice(0, 3).sort((x, y) => x - y).map((m) => [q * m, p * m]), gap = same[0][0] - same[0][1];
            const odd = d.until(() => { const h = d.int(4, 24); return [h + gap, h]; }, ([w, h]) => h * q !== w * p && !same.some((s) => s[0] === w)), list = d.shuffle(same.concat([odd])), at = list.indexOf(odd), g = gcd(odd[0], odd[1]);
            return C('가로에 대한 세로의 비율이 나머지와 다른 직사각형은?', TAGS, at, {
              figure: table(['직사각형'].concat(TAGS), [['가로(cm)'].concat(list.map((r) => r[0])), ['세로(cm)'].concat(list.map((r) => r[1]))]),
              explain: `가로에 대한 세로의 비율은 차례로 ${list.map(([w, h]) => frac(h, w)).join(', ')}이다. ${TAGS[at]} 직사각형만 ${frac(odd[1] / g, odd[0] / g)}이고 나머지는 모두 ${frac(p, q)}이다. 가로와 세로의 차가 같아도 비율은 다를 수 있다.`,
              facts: { choose: { exprs: list.map(([w, h]) => `${h}/${w}`), rule: 'odd' } }
            });
          }),
          T('ra-text', '문장을 읽고 두 양의 비율 구하기', '①36 ②36 ③31 심27', (d, n) => {
            // 첫째 문항은 서로 다른 두 양의 비율(분수), 둘째 문항은 비교하는 양이 더 큰 비율(소수) — 문장에 나온 차례가 아니라 기준량을 가려야 한다.
            if (n === 0) {
              const [A, B2, u] = d.pick(TWO), [a, b] = d.until(() => pairAB(d, 3, 15), ([x, y]) => y % x !== 0), g = gcd(a, b);
              return FR(`${A} ${josa(a + u, '과/와')} ${B2} ${josa(b + u, '이/가')} 있다. ${A} 수에 대한 ${B2} 수의 비율을 분수로 나타내시오.`, b, a, { explain: `기준량은 ${A} 수인 ${a}, 비교하는 양은 ${B2} 수인 ${b}이다. 비율은 ${b} ÷ ${a} = ${frac(b, a)}${g > 1 ? ` = ${frac(b / g, a / g)}` : ''}이다.` });
            }
            const [l, s] = d.pick([[24, 15], [30, 24], [35, 28], [18, 12], [40, 25], [45, 36], [21, 12], [36, 16]]), first = d.bool();
            return DR(`길이가 ${first ? l : s} cm인 끈과 ${first ? s : l} cm인 끈이 있다. 짧은 끈의 길이에 대한 긴 끈의 길이의 비율을 소수로 나타내시오.`, l, s, { explain: `기준량은 짧은 끈의 길이인 ${s} cm, 비교하는 양은 긴 끈의 길이인 ${l} cm이다. 비율은 ${l} ÷ ${s} = ${dec(l, s)}이다.` });
          }, { count: 2 }),
          T('ra-named', '기준량과 비교하는 양으로 비율 구하기', '②27 ③24', (d) => {
            // 기준량을 먼저 말한 문장과 비교하는 양을 먼저 말한 문장이 있다. 나누는 차례는 말한 차례가 아니라 이름으로 정한다.
            const [a, b] = d.until(() => [d.int(2, 30) * 10, d.pick([200, 250, 400, 500, 800])], ([x, y]) => x < y && ends(x, y)), unit = d.pick(['kg', 'm', 'L']), first = d.bool();
            return DR(`${first ? `기준량이 ${b} ${unit}, 비교하는 양이 ${a} ${unit}` : `비교하는 양이 ${a} ${unit}, 기준량이 ${b} ${unit}`}일 때 비율을 소수로 나타내시오.`, a, b, {
              explain: `(비율) = (비교하는 양) ÷ (기준량) = ${a} ÷ ${b} = ${dec(a, b)}이다.`
            });
          }),
          T('ra-two-way', '남녀로 나눈 표에서 기준량을 가려 비율 구하기', '③33', (d) => {
            // 기준량은 전체 학생 수가 아니라 표의 한 줄(남학생 또는 여학생)의 합계이다.
            const places = ['놀이공원', '박물관', '과학관'], boy = d.bool(), at = d.int(0, 2), sizes = [11, 13, 14, 15, 16, 17];
            const [bs, gs] = d.until(() => [range(3).map(() => d.int(2, 7)), range(3).map(() => d.int(2, 7))], ([x, y]) => sum(x) !== sum(y) && sizes.includes(sum(x)) && sizes.includes(sum(y)));
            const mine = boy ? bs : gs, total = sum(mine), who = boy ? '남학생' : '여학생', g = gcd(mine[at], total);
            return FR(`학생들이 가고 싶은 곳을 조사하여 남학생과 여학생으로 나누어 나타낸 표이다. 전체 ${who} 수에 대한 ${places[at]}에 가고 싶은 ${who} 수의 비율을 분수로 나타내시오.`, mine[at], total, {
              figure: table(['장소', '남학생', '여학생'], places.map((place, i) => [place, bs[i], gs[i]]).concat([['합계', sum(bs), sum(gs)]])),
              explain: `기준량은 전체 ${who} 수인 ${total}, 비교하는 양은 ${places[at]}에 가고 싶은 ${who} 수인 ${mine[at]}이다. 비율은 ${frac(mine[at], total)}${g > 1 ? ` = ${frac(mine[at] / g, total / g)}` : ''}이다. 남학생과 여학생을 모두 더한 ${sum(bs) + sum(gs)}명은 기준량이 아니다.`
            });
          }),
          T('ra-data', '표를 보고 비율 구하기', '①36 ②36 ③33', (d) => {
            const total = d.pick([20, 25, 40, 50]), places = ['놀이공원', '박물관', '과학관', '동물원'], at = d.int(0, 3);
            const v = d.until(() => { const x = [d.int(3, total / 2), d.int(3, total / 2), d.int(3, total / 2)]; return x.concat([total - sum(x)]); }, (x) => x[3] >= 3 && new Set(x).size === 4);
            return DR(`학생들이 가고 싶은 곳을 조사하여 나타낸 표이다. 전체 학생 수에 대한 ${places[at]}에 가고 싶은 학생 수의 비율을 소수로 나타내시오.`, v[at], total, {
              figure: table(['장소', '학생 수(명)'], places.map((place, i) => [place, v[i]]).concat([['합계', total]])),
              explain: `기준량은 전체 학생 수인 ${total}, 비교하는 양은 ${places[at]}에 가고 싶은 학생 수인 ${v[at]}이다. 비율은 ${v[at]} ÷ ${total} = ${dec(v[at], total)}이다.`
            });
          }),
          T('ra-record', '기록을 세어 비율 구하기', '①50 ②37', (d) => {
            const n = d.pick([8, 10, 12]), k = d.until(() => d.int(3, n - 3), (v) => v * 2 !== n), g = gcd(k, n);
            return FR(`동전을 ${n}번 던져 나온 면을 차례로 적었다. 던진 횟수에 대한 그림 면이 나온 횟수의 비율을 분수로 나타내시오.`, k, n, {
              figure: numbers(d.shuffle(range(n).map((i) => (i < k ? '그림' : '숫자')))),
              explain: `그림 면은 ${k}번 나왔다. 기준량은 던진 횟수인 ${n}, 비교하는 양은 그림 면이 나온 횟수인 ${k}이므로 비율은 ${frac(k, n)}${g > 1 ? ` = ${frac(k / g, n / g)}` : ''}이다.`,
              facts: { unseen: [k] }
            });
          })
        ]
      },
      { id: 'use', title: '비율이 쓰이는 경우', standard: RATE, types: [] },
      { id: 'pct', title: '백분율', standard: RATE, types: [] },
      { id: 'puse', title: '백분율이 쓰이는 경우', standard: RATE, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
