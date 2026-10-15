// 중학교 3학년 1학기 1단원 제곱근과 실수 — 단원 틀·단원 안의 도구와 앞쪽 묶음(제곱근의 뜻, 제곱근의 성질과 계산, 넓이와 제곱근, 근호 안을 제곱인 수로).
// 수집해 둔 미래엔 2015(황선욱) 교과서·지도서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 76꼴, 심화꼴: 31꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭) / 겹침」을 가른 대조표는 references/textbooks/수학/_분석/9-1-1/싣기_대조표.md 에 있다.
// (제곱근의 대소 관계, 무리수와 실수, 수직선 위의 무리수, 실수의 대소 관계는 9-1-1b.js 에, 실력 문항은 9-1-1c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 영역은 수와 연산. 성취기준은 9수01-07(제곱근의 뜻과 성질, 제곱근의 대소 관계), 9수01-08(무리수의 개념, 무리수의 유용성), 9수01-09(실수의 대소 관계)이다.
// 교육과정 해설·고려 사항(2022): 실생활에서 쓰는 무리수의 예로 무리수의 유용성을 인식하게 한다. 실수는 유리수와 무리수로 이루어짐을 이해하게 한다.
//   제곱근과 무리수는 피타고라스 정리로 도입할 수 있다. 한 변이 1인 정사각형의 대각선의 길이 등으로 무리수의 존재를 직관적으로 이해하게 한다.
//   제곱근의 값은 계산기 등으로 구할 수 있음을 알게 한다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(수 / 거듭제곱·근호로 준 수 / 그림 / 문자와 부호 조건), 묻는 것(값·제곱근·참과 거짓·개수·가장 작은 수·대소)이 다르면 따로 싣는다.
//    수만 다른 것은 한 번만 싣는다. 같은 글에 구조만 다른 문항은 facts.rule 에 이름을 달았다.
//  - 이 단원은 9-1-2(근호를 포함한 식의 계산) 앞이다. √8 = 2√2처럼 근호 밖으로 꺼내는 셈, 근호끼리의 곱셈·나눗셈, 분모의 유리화, √2 + √2 = 2√2 같은 근호끼리의 덧셈은 쓰지 않는다.
//    그래서 답이 √b 인 문항의 b 는 제곱인 수를 인수로 갖지 않게 수를 고르고(√54 대신 √42), 원문이 2√2로 적은 답은 그 셈이 필요 없는 수로 바꾸었다.
//    같은 근호를 빼어 없애는 셈((√5 + 2) − (√5 + 1) = 1)은 교과서 9-1-1 본문이 쓰므로 쓴다.
//  - 답: 수는 N·F·D(부호가 될 수 있는 답에는 부호 단추), 제곱근 둘은 「±[ ]」, √b 는 「√[ ]」, a + b√c 는 「[±][ ] [±][ ]√[ ]」(둘째 칸의 부호 단추가 더하기·빼기 기호 노릇),
//    식은 계수 칸이나 고르기, 대소는 고르기. 한 유형 안에서는 칸의 모양이 같다.
//  - 그림: 수직선·모눈·정사각형·호는 이 파일의 rline 으로, 직사각형·정사각형·좌표평면의 삼각형은 B.kit.mgeo 의 판으로 그린다. 그림 속 글에는 근호를 쓰지 않는다.
//  - 꼴 목록에 적힌 원문 답의 잘못(기1-09의 12/15, 표29 풀이)은 따르지 않는다. 답은 모두 코드가 셈한다.
//  - 검사 근거: 값은 facts.value / calc 로 다시 셈한다(제곱근은 **0.5 — 0.5 는 글에 없는 수라 unseen 에 적는다). 근호 안을 제곱인 수로 만드는 수·부등식을 만족하는 수는
//    1부터 넣어 보는 틀(facts.digit — √의 소수 부분이 0인가는 (식)**0.5%1<0.000001)로 다시 센다. 문장·식의 참·거짓은 코드로 셈해 넣고, 문제 글만 읽어 다시 푸는 풀이를 따로 써서 맞춰 보았다.
//
// 뺀 것과 까닭(9-1-1b.js, 9-1-1c.js 의 것까지 여기에 모아 적는다)
//  - 교육과정 밖: 제곱근표 읽기(①61 — 2022는 「계산기 등을 이용하여 구할 수 있음을 알게 한다」, 2015 자료에만 있는 표), 겉보기 이중근호 f(√256)(심27).
//    근호 안이 음수인 틀린 보기(①10의 표02⑤ √−7)는 쓰지 않았다.
//  - 9-1-2의 셈이 있어야 풀리는 보기·답: 표21의 3√5 □ 5√3 같은 보기(①72 — 9-1-1의 보기만으로 실었다), 대22의 2√2 − 3(①73), 원문 답 2 ± 2√2(①66), √54 = 3√6(①25), √28 = 2√7(①34 — m, n 을 묻는다).
//  - 작도·활동·조사: √3·√5·√6을 컴퍼스로 나타내기(①69 끝), 용지의 비를 계산기로 셈하기·조리갯값 조사(①60의 탐구1·3).
//  - 뜻 없는 셈: 세 점이 나타내는 수의 합(①63의 대08), a + 2b(①67의 대지10 — a 와 b 를 따로 묻는 꼴로), b − a(①44의 대05 — 개수 하나로).
//  - 같은 일이어서 한 번만 실은 것은 대조표에 「겹침」으로 적었다(①66과 ①65, 심6과 ①31, 심20과 ①40 등).
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」 길이는 띄어 적는다(3 cm).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines, numbers, N, M, C, F, D, inline, NAMES } = B.kit;
  const { MINUS, GT, LT, range, gcd, Q, qmul, qdiv, qadd, qsub, qneg, qcmp, isInt, fl, dc, dc2, mag, tx, nb, tail, lastOf, V, sup, ex, claimQ, sqParts, js } = B.kit.mid;
  // 근호는 공용 rt(√ 그림에 mb-inline 이 붙어 있다 — 받는 쪽에서 공용으로 옮김).
  const rt = B.kit.mid.rt;
  const { at, arcTo, r1, Board, dist, mid: midPt } = B.kit.mgeo;
  const STD7 = '9수01-07', STD8 = '9수01-08', STD9 = '9수01-09';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const ruled = (item, rule) => { item.facts.rule = rule; return item; };
  const RT = '**0.5', U5 = [0.5];

  // ── 수와 근호의 글 ──
  // 수(정수·유리수 Q·소수 dc)를 그대로 적은 글과 근호 √x. 토씨는 읽을 때 마지막에 오는 숫자(분수는 분자, 소수는 끝자리)에 맞춘다.
  const asQ = (x) => (typeof x === 'number' ? Q(x) : x);
  const M_ = (x) => mag(asQ(x));
  // 근호 안의 분수는 글로 옮길 때만 괄호로 묶인다(√(2/3)과 √2/3이 글로도 갈리게).
  const SRs = (t) => '<span class="mb-sr">' + t + '</span>';
  const rq = (p, q) => rt(SRs('(') + frac(p, q) + SRs(')'));
  const R = (x) => { const q = asQ(x); return !q.d && q.q !== 1 ? rq(Math.abs(q.p), q.q) : rt(M_(x)); };
  const lastNum = (x) => lastOf(asQ(x));
  const J = (x, pair) => tail(lastNum(x), pair);                         // 수 뒤의 토씨만
  const RJ = (x, pair) => R(x) + J(x, pair);                              // √x + 토씨
  const NJ = (x, pair) => (asQ(x).p < 0 ? MINUS : '') + M_(x) + J(x, pair); // 수 + 토씨(부호 포함)
  const neg = (h) => MINUS + h;
  const sq = (h) => h + sup(2);
  const par = (h) => '(' + h + ')';
  const isSquare = (n) => Number.isInteger(n) && n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;
  const squareFree = (n) => sqParts(n)[0] === 1;
  // 유리수 q 가 유리수의 제곱인가(근호를 없앨 수 있는가)
  const ratSquare = (q) => q.p >= 0 && isSquare(q.p) && isSquare(q.q);
  const sqrtQ = (q) => Q(Math.round(Math.sqrt(q.p)), Math.round(Math.sqrt(q.q)));
  // 검사 식에 적는 수(소수는 소수 그대로, 분수는 (3/4))
  const jq = (x) => { const q = asQ(x); return q.d ? (q.p < 0 ? '(-' : '(') + (Math.abs(q.p) / q.q).toFixed(q.d) + ')' : js(q); };
  // 소수 한 자리 수 t/10, 그 제곱(소수 두 자리)
  const tenth = (t) => dc(t), tenthSq = (t) => dc2(t * t);

  // ── 실수 a + b√c 의 식(항의 배열) ──
  // 항: { n: 유리수 } 또는 { s: ±1, c: 근호 안의 자연수 }. 차례대로 적는다(√5 − √2, −√6 − √2, 2 − √3).
  const num = (v) => ({ n: asQ(v) }), rad = (c, s) => ({ s: s == null ? 1 : s, c });
  const negT = (t) => (t.n ? { n: qneg(t.n) } : { s: -t.s, c: t.c });
  const tneg = (t) => (t.n ? t.n.p < 0 : t.s < 0);
  const tmag = (t) => (t.n ? M_(Q(Math.abs(t.n.p), t.n.q)) : rt(t.c));
  // 0인 수 항은 다른 항이 있으면 적지 않는다(0 + √2 가 아니라 √2).
  const clean = (list) => (list.length > 1 ? list.filter((t) => !(t.n && t.n.p === 0)) : list);
  const sText = (list0) => { const list = clean(list0); return nb(list.map((t, i) => (i === 0 ? (tneg(t) ? MINUS : '') : tneg(t) ? ' ' + MINUS + ' ' : ' + ') + tmag(t)).join('')); };
  const sVal = (list) => list.reduce((s, t) => s + (t.n ? fl(t.n) : t.s * Math.sqrt(t.c)), 0);
  const tjs = (t) => (t.n ? jq(Q(Math.abs(t.n.p), t.n.q)) : '(' + t.c + RT + ')');
  const sJs = (list0) => clean(list0).map((t, i) => (i === 0 ? (tneg(t) ? '-' : '') : tneg(t) ? '-' : '+') + tjs(t)).join('');
  // 토씨는 마지막 항(근호면 근호 안의 수)에 맞춘다.
  const sJ = (list, pair) => sText(list) + (list[list.length - 1].n ? J(list[list.length - 1].n, pair) : tail(list[list.length - 1].c, pair));
  const sum = (...xs) => xs.reduce((all, x) => all.concat(Array.isArray(x) ? x : [x]), []);

  // ── 답 칸 ──
  // 제곱근 둘(±k): 정수·소수는 한 칸, 분수는 분자·분모 칸
  const pmInt = (text, k, o) => inline(text, '±{0}', [{ answer: k }], Object.assign({}, o, { shown: '±' + k }));
  // √b (b 는 2 이상이고 제곱인 수를 인수로 갖지 않는 자연수). unit 이 있으면 칸 뒤에 적는다.
  const rootAns = (text, b, o, unit) => {
    if (!Number.isInteger(b) || b < 2 || !squareFree(b)) throw new Error('√b 답의 b 는 제곱인 수를 인수로 갖지 않는 2 이상의 자연수여야 한다: ' + b);
    return inline(text, rt('{0}') + (unit ? ' ' + unit : ''), [{ answer: b }], Object.assign({}, o, { shown: rt(b) + (unit ? ' ' + unit : '') }));
  };
  // a + b√c (a, b 는 0이 아닌 정수, c 는 제곱인 수를 인수로 갖지 않는 2 이상의 자연수). 틀리면 1 − √2 꼴로 보인다.
  const abcAns = (text, a, b, c, o) => {
    if (!Number.isInteger(a) || !Number.isInteger(b) || a === 0 || b === 0 || !squareFree(c) || c < 2) throw new Error('a + b√c 답: ' + [a, b, c]);
    const shown = nb((a < 0 ? MINUS : '') + Math.abs(a) + ' ' + (b < 0 ? MINUS : '+') + ' ' + (Math.abs(b) === 1 ? '' : Math.abs(b)) + rt(c));
    return inline(text, '{0} {1}' + rt('{2}'), [{ answer: a, signed: true }, { answer: b, signed: true }, { answer: c }], Object.assign({}, o, { shown }));
  };
  const ABC_NOTE = '(단, 근호 앞의 수가 1이면 1을 적는다.)';

  // ── 그림: 수직선(모눈을 깔 수 있다) 위의 도형·호·점 ──
  // lo~hi: 수직선의 정수 눈금. 좌표는 [수직선의 수, 위로 올라간 칸]. o.rows 모눈의 높이(칸), o.grid 모눈을 긋는가,
  // o.polys [{ pts, tint }] 도형, o.segs [[x1, y1, x2, y2, 'dash']] 선분, o.arcs [{ c, r, a0, a1 }] 호(a0° 에서 a1° 로, 끝에 화살촉),
  // o.circles [{ c, r }] 원, o.arrows [{ from, to }] 곧은 화살표(파란색),
  // o.points [{ at, name, side: -1 | 1 }] 수직선 위의 점(이름은 수직선 위, side 쪽으로 비켜 적는다), o.names [{ p, name, a }] 꼭짓점의 이름(a° 쪽으로 띄워 적는다),
  // o.labels 수를 적을 눈금(주지 않으면 모두), o.say 그림 설명(aria-label).
  function rline(lo, hi, o) {
    const opt = o || {}, span = hi - lo, u = opt.u || Math.min(44, Math.floor(252 / span)), L = 22;
    const rows = opt.rows || 0, top = 16, base = top + rows * u + (opt.headroom || 0);
    const X = (x) => L + (x - lo) * u, Y = (y) => base - y * u, P = (p) => [X(p[0]), Y(p[1])];
    const W = L * 2 + span * u, H = base + 26;
    let g = '', fg = '', tx2 = '';
    if (opt.grid) {
      for (let x = lo; x <= hi; x += 1) g += `<line x1="${r1(X(x))}" y1="${r1(Y(0))}" x2="${r1(X(x))}" y2="${r1(Y(rows))}" style="stroke:#c3ccd5;stroke-width:0.8"/>`;
      for (let y = 1; y <= rows; y += 1) g += `<line x1="${r1(X(lo))}" y1="${r1(Y(y))}" x2="${r1(X(hi))}" y2="${r1(Y(y))}" style="stroke:#c3ccd5;stroke-width:0.8"/>`;
    }
    for (const pl of opt.polys || []) fg += `<polygon points="${pl.pts.map((p) => P(p).map(r1).join(',')).join(' ')}" style="fill:${pl.tint === false ? 'none' : 'rgba(251,191,36,0.32)'};stroke:#1f2933;stroke-width:1.5;stroke-linejoin:round"/>`;
    for (const s of opt.segs || []) fg += `<line x1="${r1(X(s[0]))}" y1="${r1(Y(s[1]))}" x2="${r1(X(s[2]))}" y2="${r1(Y(s[3]))}" style="stroke:#1f2933;stroke-width:${s[4] === 'dash' ? 1.1 : 1.5}${s[4] === 'dash' ? ';stroke-dasharray:3 3' : ''}"/>`;
    for (const c of opt.circles || []) fg += `<circle cx="${r1(X(c.c[0]))}" cy="${r1(Y(c.c[1]))}" r="${r1(c.r * u)}" style="fill:rgba(147,197,253,0.25);stroke:#1f2933;stroke-width:1.5"/>`;
    for (const w of opt.arrows || []) {
      const p = P(w.from), q = P(w.to), ang = Math.atan2(q[1] - p[1], q[0] - p[0]), bx = q[0] - 8 * Math.cos(ang), by = q[1] - 8 * Math.sin(ang);
      fg += `<line x1="${r1(p[0])}" y1="${r1(p[1])}" x2="${r1(bx)}" y2="${r1(by)}" style="stroke:#1d4ed8;stroke-width:1.8"/><path d="M${r1(q[0])} ${r1(q[1])}L${r1(bx - 3.8 * Math.sin(ang))} ${r1(by + 3.8 * Math.cos(ang))}L${r1(bx + 3.8 * Math.sin(ang))} ${r1(by - 3.8 * Math.cos(ang))}Z" style="fill:#1d4ed8"/>`;
    }
    for (const a of opt.arcs || []) {
      const c = P(a.c), rr = a.r * u, end = at(c, rr, a.a1), dir = a.a1 > a.a0 ? 1 : -1, tang = a.a1 + dir * 90;
      const tip = end, back = at(tip, 8, tang + 180), w1 = at(back, 3.6, tang + 90), w2 = at(back, 3.6, tang - 90);
      const stop = at(c, rr, a.a1 - dir * (5 / rr) * 57.3);
      fg += `<path d="M${r1(at(c, rr, a.a0)[0])} ${r1(at(c, rr, a.a0)[1])}${arcTo(c, rr, a.a0, a.a1 - dir * (5 / rr) * 57.3)}" style="fill:none;stroke:#c2410c;stroke-width:1.5"/>`
        + `<path d="M${r1(tip[0])} ${r1(tip[1])}L${r1(w1[0])} ${r1(w1[1])}L${r1(w2[0])} ${r1(w2[1])}Z" style="fill:#c2410c"/>`;
      void stop;
    }
    let ax = `<line class="mb-axis" x1="${r1(X(lo) - 12)}" y1="${r1(base)}" x2="${r1(X(hi) + 12)}" y2="${r1(base)}" style="stroke-width:1.2"/>`
      + `<path d="M${r1(X(lo) - 18)} ${r1(base)}l7 -3.6v7.2z" style="fill:#1f2933"/><path d="M${r1(X(hi) + 18)} ${r1(base)}l-7 -3.6v7.2z" style="fill:#1f2933"/>`;
    for (let x = lo; x <= hi; x += 1) ax += `<line class="mb-axis" x1="${r1(X(x))}" y1="${r1(base - 4.5)}" x2="${r1(X(x))}" y2="${r1(base + 4.5)}"/>`;
    for (const x of opt.labels || range(lo, hi)) tx2 += `<text class="mb-axis-label" style="font-size:12.5px" x="${r1(X(x))}" y="${r1(base + 19)}" text-anchor="middle">${x < 0 ? MINUS + -x : x}</text>`;
    for (const p of opt.points || []) {
      const x = X(p.at), side = p.side || 1;
      fg += `<circle class="mb-dot" cx="${r1(x)}" cy="${r1(base)}" r="3.2"/>`;
      tx2 += `<text class="mb-label" style="font-size:13.5px;paint-order:stroke;stroke:#fff;stroke-width:3px" x="${r1(x + side * 8)}" y="${r1(base - 7)}" text-anchor="middle">${p.name}</text>`;
    }
    for (const nm of opt.names || []) { const c = at(P(nm.p), nm.gap || 10, nm.a); tx2 += `<text class="mb-label" style="font-size:13.5px;paint-order:stroke;stroke:#fff;stroke-width:3px" x="${r1(c[0])}" y="${r1(c[1])}" text-anchor="middle" dominant-baseline="central">${nm.name}</text>`; }
    return `<svg class="mb-geo" viewBox="0 0 ${r1(W)} ${r1(H)}" width="${Math.round(W)}" role="img" aria-label="${opt.say || ''}">${g}${fg}${ax}${tx2}</svg>`;
  }

  // ── 그림: 직사각형·정사각형(가로·세로 길이를 적는다) ──
  function boxes(list, say) {
    // list: [{ w, h, wl, hl }] — 길이(칸)와 적을 글. 왼쪽부터 밑변을 맞추어 놓는다.
    const b = Board(), k = Math.min(26, 150 / Math.max(...list.map((r) => Math.max(r.w, r.h))), 200 / list.reduce((s, r) => s + r.w, 0));
    let x = 0;
    for (const r of list) {
      const p = [[x, 0], [x + r.w * k, 0], [x + r.w * k, -r.h * k], [x, -r.h * k]];
      b.poly(p, 'fill:rgba(251,191,36,0.32)');
      if (r.wl) b.dim(p[0], p[1], r.wl, p[3], 9);
      if (r.hl) b.dim(p[1], p[2], r.hl, p[0], 9);
      x += r.w * k + 34;
    }
    return b.svg(say);
  }

  // ── 실수의 셈이 든 문항 도구(b·c 파일과 함께 쓴다) ──
  B.kit.m911 = { rt, rq, SRs, STD7, STD8, STD9, RT, U5, asQ, M_, R, J, RJ, NJ, neg, sq, par, isSquare, squareFree, ratSquare, sqrtQ, jq, tenth, tenthSq, num, rad, negT, tneg, tmag, sText, sVal, sJs, sJ, sum, pmInt, rootAns, abcAns, ABC_NOTE, rline, boxes, ruled };

  // ── 제곱근이 되는 수를 말로 적기 ──
  // 거듭제곱·근호로 준 수와 그 값: (−7)², √81, √((−9)²), 제곱근 49 …
  const src = {
    // (−k)² 의 양(음)의 제곱근 → ±k
    sqr: (k, s) => ({ h: `${sq(par(neg(k)))}의 ${s > 0 ? '양' : '음'}의 제곱근`, v: s * k, js: `${s < 0 ? '-' : ''}(((-${k})**2)${RT})`, told: `${sq(par(neg(k)))} = ${k * k}이고 ${k * k}의 ${s > 0 ? '양' : '음'}의 제곱근은 ${s < 0 ? MINUS : ''}${k}이다.` }),
    // √(m⁴) 의 양(음)의 제곱근 → ±m (√81 = 9 의 제곱근 ±3)
    root: (m, s) => ({ h: `${R(m ** 4)}의 ${s > 0 ? '양' : '음'}의 제곱근`, v: s * m, js: `${s < 0 ? '-' : ''}((${m ** 4}${RT})${RT})`, told: `${R(m ** 4)} = ${m * m}이고 ${m * m}의 ${s > 0 ? '양' : '음'}의 제곱근은 ${s < 0 ? MINUS : ''}${m}이다.` }),
    // √((−m²)²) 의 양의 제곱근 → m
    rootSq: (m, s) => ({ h: `${rt(sq(par(neg(m * m))))}의 ${s > 0 ? '양' : '음'}의 제곱근`, v: s * m, js: `${s < 0 ? '-' : ''}((((-${m * m})**2)${RT})${RT})`, told: `${rt(sq(par(neg(m * m))))} = ${m * m}이고 ${m * m}의 ${s > 0 ? '양' : '음'}의 제곱근은 ${s < 0 ? MINUS : ''}${m}이다.` }),
    // 제곱근 k² → k
    named: (k) => ({ h: `제곱근 ${k * k}`, v: k, js: `(${k * k}${RT})`, told: `제곱근 ${k * k}는 ${R(k * k)}, 곧 ${k * k}의 양의 제곱근이므로 ${k}이다.`.replace(`${k * k}는`, josa(k * k, '은/는')) })
  };
  const srcJ = (s, pair) => s.h + (/\d$/.test(s.h) ? tail(Number(s.h.match(/(\d+)$/)[1]), pair) : josa('근', pair).slice(1));
  const OPS = { '+': (a, b) => a + b, '-': (a, b) => a - b, '*': (a, b) => a * b };
  const OPH = { '+': '+', '-': MINUS, '*': '×' };

  B.addUnit({
    id: '9-1-1', grade: 9, semester: 1, no: 1, title: '제곱근과 실수', version: 2,
    groups: [
      {
        id: 'root', title: '제곱근의 뜻', standard: STD7,
        types: [
          T('root-find', '수의 제곱근 구하기', '①1', (d, n) => {
            // 첫째는 분수, 둘째는 소수의 제곱근이다(0.09의 제곱근은 ±0.03이 아니라 ±0.3).
            if (n === 0) {
              const [a, b] = d.until(() => [d.int(1, 11), d.int(2, 13)], ([p, q]) => p < q && gcd(p, q) === 1);
              const v = frac(a * a, b * b);
              return inline(`${v}의 제곱근을 구하시오.`, '±' + frac('{0}', '{1}'), [{ answer: a }, { answer: b }], {
                shown: '±' + frac(a, b), explain: `${sq(par(frac(a, b)))} = ${v}, ${sq(par(neg(frac(a, b))))} = ${v}이므로 ${v}의 제곱근은 ±${frac(a, b)}이다.`,
                facts: { calc: [[`${a * a}${RT}`, 0], [`${b * b}${RT}`, 1]], unseen: U5 }
              });
            }
            const t = d.until(() => d.int(2, 19), (v) => v % 10 !== 0), s = mag(tenthSq(t)), r = mag(tenth(t));
            return inline(`${s}의 제곱근을 구하시오.`, '±{0}', [{ answer: t / 10, decimal: true }], {
              shown: '±' + r, explain: `${sq(r)} = ${s}, ${sq(par(neg(r)))} = ${s}이므로 ${s}의 제곱근은 ±${r}이다.`,
              facts: { calc: [[`${s}${RT}`, 0]], unseen: U5 }
            });
          }, { count: 2 }),
          T('root-of-power', '거듭제곱·근호로 준 수의 제곱근', '①2', (d) => {
            // 값을 먼저 구한다: (−5)² = 25의 제곱근은 ±5, √81 = 9의 제곱근은 ±3(±9가 아니다).
            // 틀린 보기: 값을 구하지 않은 것(±81의 근을 ±9로), 부호 하나만 쓴 것, 음수라서 없다고 본 것
            const kind = d.pick(['sqr', 'root', 'rootSq']);
            const m = kind === 'sqr' ? d.int(3, 12) : d.int(2, 5), shown = kind === 'sqr' ? sq(par(neg(m))) : kind === 'root' ? R(m ** 4) : rt(sq(par(neg(m * m))));
            const val = kind === 'sqr' ? m * m : m * m, k = kind === 'sqr' ? m : m;
            const opts = kind === 'sqr' ? [`±${k}`, `${MINUS}${k}`, `±${k * k}`, `${k}`, '없다'] : [`±${k}`, `±${k * k}`, `${k * k}`, `${k}`, '없다'];
            const rows = d.shuffle(opts);
            return C(`${shown}의 제곱근은?`, rows, rows.indexOf(`±${k}`), {
              explain: `${shown} = ${val}이고, ${val}의 제곱근은 제곱하여 ${val}이 되는 수이므로 ±${k}이다.`.replace(`${val}이 되는`, josa(val, '이/가') + ' 되는'),
              facts: { truth: rows.map((r) => r === `±${k}`), want: true }
            });
          }),
          T('root-repeat', '순환소수의 제곱근', '①3', (d) => {
            // 0.4̇ = 4/9 이므로 제곱근은 ±2/3 = ±0.6̇ 이다. 틀린 보기는 숫자만 보고 근을 구한 것(±0.2̇), 그 수 자체 등이다.
            const POOL = [['0.', '4', 2], ['0.', '1', 1], ['1.', '7', 4], ['2.', '7', 5], ['5.', '4', 7], ['7.', '1', 8]];
            const [h, c, k] = d.pick(POOL), val = (h === '0.' ? 0 : Number(h)) * 9 + Number(c), give = B.kit.mid.rep(h, c);
            const asRep = (j) => B.kit.mid.rep(Math.floor(j / 3) + '.', String((j % 3) * 3));
            const right = '±' + asRep(k);
            const others = [1, 2, 4, 5, 7, 8].filter((j) => j !== k).map((j) => '±' + asRep(j));
            const rows = d.shuffle([right, '±' + give].concat(d.shuffle(others).slice(0, 3)));
            return C(`순환소수 ${give}의 제곱근은?`, rows, rows.indexOf(right), {
              explain: `${give} = ${frac(val, 9)}이고 ${sq(par(frac(k, 3)))} = ${frac(val, 9)}이므로 제곱근은 ±${frac(k, 3)} = ${right}이다.`,
              facts: { truth: rows.map((r) => r === right), want: true }
            });
          }),
          T('root-write', '제곱근을 근호를 사용하여 나타내기', '①4', (d) => {
            // 「제곱근」은 ±√a, 「양의 제곱근」은 √a, 「음의 제곱근」은 −√a. 틀린 보기: ± 를 빠뜨림, 양의 제곱근에 ±, 근호 대신 제곱
            const pickV = () => d.pick([() => Q(d.until(() => d.int(2, 30), (v) => !isSquare(v))), () => { const [p, q] = d.until(() => [d.int(1, 7), d.int(2, 9)], ([a, b]) => a < b && gcd(a, b) === 1 && !(isSquare(a) && isSquare(b))); return Q(p, q); }, () => tenth(d.pick([2, 3, 5, 6, 7, 8, 11, 13]))])();
            const vs = d.until(() => range(1, 5).map(pickV), (list) => new Set(list.map((v) => M_(v))).size === 5);
            const want = d.bool();
            const right = [(v) => [`${M_(v)}의 제곱근: ±${R(v)}`, true], (v) => [`${M_(v)}의 양의 제곱근: ${R(v)}`, true], (v) => [`${M_(v)}의 음의 제곱근: ${MINUS}${R(v)}`, true]];
            const wrong = [(v) => [`${M_(v)}의 제곱근: ${R(v)}`, false, `${M_(v)}의 제곱근은 ±${R(v)}이다.`], (v) => [`${M_(v)}의 양의 제곱근: ±${R(v)}`, false, `${M_(v)}의 양의 제곱근은 ${R(v)}이다.`],
              (v) => [`${M_(v)}의 제곱근: ±${sq(par(M_(v)))}`, false, `${M_(v)}의 제곱근은 ±${R(v)}이다.`], (v) => [`${M_(v)}의 음의 제곱근: ±${R(v)}`, false, `${M_(v)}의 음의 제곱근은 ${MINUS}${R(v)}이다.`]];
            const makers = want ? [d.pick(right)].concat(d.shuffle(wrong).slice(0, 4)) : d.shuffle(right.concat(right)).slice(0, 4).concat([d.pick(wrong)]);
            const rows = d.shuffle(makers.map((mk, i) => mk(vs[i])));
            return C(`다음 중 근호를 사용하여 ${want ? '바르게 나타낸' : '바르게 나타내지 않은'} 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1] === want), {
              explain: `양수 ${V('a')}의 제곱근은 ±${rt(V('a'))}, 양의 제곱근은 ${rt(V('a'))}, 음의 제곱근은 ${MINUS}${rt(V('a'))}로 나타낸다. ${rows.filter((r) => !r[1]).map((r) => r[2]).join(' ')}`,
              facts: { truth: rows.map((r) => r[1]), want }
            });
          }),
          T('root-unroot', '근호를 사용하지 않고 나타내기', '①5', (d, n) => {
            // 첫째는 분수, 둘째는 소수. 앞에 −가 붙으면 음의 제곱근 하나이다(−√(25/64) = −5/8, ±가 아니다).
            const s = d.bool() ? -1 : 1;
            if (n === 0) {
              const [a, b] = d.until(() => [d.int(1, 9), d.int(2, 12)], ([p, q]) => p < q && gcd(p, q) === 1);
              const h = (s < 0 ? MINUS : '') + rq(a * a, b * b);
              return F(`${h}${tail(a * a, '을/를')} 근호를 사용하지 않고 나타내면?`, a, b, {
                signed: true, negative: s < 0, anyForm: true,
                explain: `${frac(a * a, b * b)}의 ${s > 0 ? '양' : '음'}의 제곱근이므로 ${h} = ${s < 0 ? MINUS : ''}${frac(a, b)}이다.`,
                facts: { value: `${s < 0 ? '-' : ''}((${a * a}/${b * b})${RT})`, unseen: U5 }
              });
            }
            const t = d.until(() => d.int(2, 19), (v) => v % 10 !== 0), sv = mag(tenthSq(t)), h = (s < 0 ? MINUS : '') + rt(sv);
            return D(`${h}${tail(t * t % 10, '을/를')} 근호를 사용하지 않고 나타내면?`, s * t / 10, {
              signed: true, explain: `${sv}의 ${s > 0 ? '양' : '음'}의 제곱근이므로 ${h} = ${s < 0 ? MINUS : ''}${mag(tenth(t))}이다.`,
              facts: { calc: [[`${s < 0 ? '-' : ''}(${sv}${RT})`, 0]], unseen: U5 }
            });
          }, { count: 2 }),
          T('root-which', '근호를 없앨 수 있는 수 고르기', '①6', (d) => {
            // 근호 안이 유리수의 제곱인 것 하나. 틀린 보기는 제곱인 수의 숫자를 자리만 옮긴 것(√0.4, √8.1, √1.6), 분자나 분모 하나만 제곱인 수(√(1/12), √(9/2))
            const right = d.pick([() => { const [a, b] = d.until(() => [d.int(1, 9), d.int(2, 9)], ([p, q]) => gcd(p, q) === 1 && p !== q); return Q(a * a, b * b); }, () => tenthSq(d.until(() => d.int(3, 19), (v) => v % 10 !== 0))])();
            const traps = d.shuffle([tenth(4), tenth(9), tenth(16), tenth(25), tenth(36), tenth(49), tenth(64), tenth(81), Q(1, 12), Q(9, 2), Q(2, 9), Q(25, 8), Q(16, 5), Q(1, 8), Q(4, 7), Q(12), Q(45), dc(225)]).filter((v) => !ratSquare(plainOf(v)));
            const rows = d.shuffle([right].concat(traps.slice(0, 4)));
            const okOf = (v) => ratSquare(plainOf(v));
            return C('다음 중 근호를 사용하지 않고 나타낼 수 있는 것은?', rows.map(R), rows.indexOf(right), {
              explain: `근호 안의 수가 유리수의 제곱이면 근호를 없앨 수 있다. ${R(right)} = ${M_(sqrtVal(right))}이다. 나머지는 근호 안의 수가 유리수의 제곱이 아니다.`,
              facts: { truth: rows.map(okOf), want: true }
            });
          }),
          T('root-count-plain', '제곱근을 근호 없이 나타낼 수 있는 수의 개수', '①7', (d) => {
            // 값을 먼저 구한다: √(1/36) = 1/6 의 제곱근은 근호가 남고, 1.7̇ = 16/9 의 제곱근은 ±4/3, (−8)² = 64 의 제곱근은 ±8 이다.
            const rep = B.kit.mid.rep;
            const pool = [
              () => { const k = d.int(2, 9) * 10; return { h: String(k * k), ok: true, why: `${k * k}의 제곱근은 ±${k}` }; },
              () => { const k = d.pick([10, 20, 30, 40, 50, 90]); return { h: String(k), ok: false, why: `${k}의 제곱근은 ±${R(k)}` }; },
              () => { const t = d.pick([4, 9, 16, 25, 36, 49]); return { h: mag(tenth(t)), ok: false, why: `${mag(tenth(t))}의 제곱근은 ±${R(tenth(t))}` }; },
              () => { const t = d.pick([4, 7, 9, 12]); return { h: mag(tenthSq(t)), ok: true, why: `${mag(tenthSq(t))}의 제곱근은 ±${mag(tenth(t))}` }; },
              () => { const k = d.pick([6, 7, 10]); return { h: R(Q(1, k * k)), ok: false, why: `${R(Q(1, k * k))} = ${frac(1, k)}의 제곱근은 ±${R(Q(1, k))}` }; },
              () => { const k = d.pick([2, 3]); return { h: R(Q(1, k ** 4)), ok: true, why: `${R(Q(1, k ** 4))} = ${frac(1, k * k)}의 제곱근은 ±${frac(1, k)}` }; },
              () => { const [w, c, k] = d.pick([['1.', '7', 4], ['2.', '7', 5], ['0.', '4', 2]]); return { h: rep(w, c), ok: true, why: `${rep(w, c)} = ${frac(k * k, 9)}의 제곱근은 ±${frac(k, 3)}` }; },
              () => { const [w, c, v] = d.pick([['0.', '5', 5], ['1.', '2', 11], ['0.', '2', 2]]); return { h: rep(w, c), ok: false, why: `${rep(w, c)} = ${frac(v, 9)}의 제곱근은 ±${R(Q(v, 9))}` }; },
              () => { const k = d.int(3, 9); return { h: sq(par(neg(k))), ok: true, why: `${sq(par(neg(k)))} = ${k * k}의 제곱근은 ±${k}` }; },
              () => { const k = d.pick([2, 3, 5]); return { h: k + sup(3), ok: false, why: `${k}${sup(3)} = ${k ** 3}의 제곱근은 ±${R(k ** 3)}` }; }
            ];
            const rows = d.until(() => d.shuffle(pool).slice(0, 6).map((mk) => mk()), (list) => { const n = list.filter((r) => r.ok).length; return n >= 2 && n <= 4 && new Set(list.map((r) => r.h)).size === 6; });
            const hit = rows.filter((r) => r.ok);
            return N('다음 수 가운데 제곱근을 근호를 사용하지 않고 나타낼 수 있는 수는 모두 몇 개인가?', hit.length, {
              unit: '개', figure: numbers(rows.map((r) => r.h)),
              explain: rows.map((r) => r.why).join(', ') + `이다. 근호 없이 나타낼 수 있는 것은 ${hit.length}개이다.`,
              facts: { count: rows.map((r) => r.ok) }
            });
          }),
          T('root-eq', '제곱근의 뜻을 식으로 나타내기', '①8', (d) => {
            // x 가 a 의 제곱근이면 x² = a 이다. x = √a 는 음의 제곱근을 빠뜨린 것이다.
            const a = d.until(() => d.int(2, 30), (v) => !isSquare(v)), x = V('x');
            const right = `${x}${sup(2)} = ${a}`;
            const rows = d.shuffle([right, `${x} = ${a}${sup(2)}`, `${rt(x)} = ${a}`, `${x}${sup(2)} = ${R(a)}`, `${x} = ${R(a)}`]);
            return C(`‘${x}는 ${a}의 제곱근이다.’를 식으로 나타낸 것은?`, rows, rows.indexOf(right), {
              explain: `어떤 수 ${x}를 제곱하여 ${a}가 될 때 ${x}를 ${a}의 제곱근이라고 한다. 곧 ${right}이다. ${x} = ${R(a)}${tail(a, '은/는')} 음의 제곱근 ${MINUS}${R(a)}${tail(a, '을/를')} 빠뜨린 식이다.`.replace(`${a}가`, josa(a, '이/가')),
              facts: { truth: rows.map((r) => r === right), want: true }
            });
          }),
          T('root-facts', '제곱근의 개수에 대한 설명', '①9', (d) => {
            const a = V('a'), yes = [
              '양수의 제곱근은 양수와 음수의 2개이다.', '양수의 두 제곱근은 절댓값이 서로 같다.', '0의 제곱근은 0 하나뿐이다.',
              '제곱하여 음수가 되는 수는 없으므로 음수의 제곱근은 생각하지 않는다.', '제곱근이 하나뿐인 수는 0이다.', `양수 ${a}의 음의 제곱근은 ${MINUS}${rt(a)}이다.`
            ];
            const no = [
              ['0의 제곱근은 없다.', '0의 제곱근은 0이다.', yes[2]],
              ['음수의 제곱근은 1개이고 음수이다.', '제곱하여 음수가 되는 수는 없으므로 음수의 제곱근은 없다.', yes[3]],
              ['모든 수는 제곱근을 2개씩 갖는다.', '0의 제곱근은 0 하나뿐이고 음수의 제곱근은 없다.', yes[4]],
              ['양수의 제곱근은 1개이다.', '양수의 제곱근은 양수와 음수의 2개이다.', yes[0]],
              ['양수의 두 제곱근의 합은 그 수와 같다.', '양수의 두 제곱근은 절댓값이 같고 부호가 반대이므로 합은 0이다.', yes[1]],
              [`양수 ${a}의 제곱근은 ${rt(a)}이다.`, `양수 ${a}의 제곱근은 ±${rt(a)}이고, ${rt(a)}는 양의 제곱근이다.`, yes[5]]
            ];
            const want = d.bool();
            return claimQ(d, `제곱근에 대한 다음 설명 가운데 ${want ? '옳은' : '옳지 않은'} 것은?`, yes, no, want);
          }),
          T('root-claims', '수가 든 제곱근 문장의 참·거짓', '①10', (d) => {
            // 「제곱근 a」는 √a 하나, 「a의 제곱근」은 ±√a 둘이다. √a 는 양수 하나이다.
            const a = d.until(() => d.int(2, 30), (v) => !isSquare(v)), k = d.int(4, 13), K = k * k, m = d.int(2, 4), M4 = m ** 4, [p, q] = d.pick([[4, 9], [9, 16], [16, 9], [4, 25], [9, 25]]);
            const yes = [
              `제곱근 ${josa(a, '은/는')} ${R(a)}이다.`, `${R(M4)}의 제곱근은 ±${m}이다.`, `${MINUS}${josa(k, '은/는')} ${K}의 음의 제곱근이다.`,
              `${K}의 제곱근은 ±${k}이다.`, `${R(K)} = ${k}이다.`
            ];
            const no = [
              [`${K}의 제곱근은 ${k}이다.`, `${K}의 제곱근은 ±${k}이다.`, yes[3]],
              [`${R(K)} = ±${k}이다.`, `${R(K)}${tail(K, '은/는')} ${K}의 양의 제곱근이므로 ${R(K)} = ${k}이다.`, yes[4]],
              [`제곱근 ${josa(K, '은/는')} ±${k}이다.`, `제곱근 ${josa(K, '은/는')} ${R(K)} = ${k}이다.`, ''],
              [`${MINUS}${a}의 제곱근은 ${MINUS}${R(a)}이다.`, '제곱하여 음수가 되는 수는 없으므로 음수의 제곱근은 없다.', ''],
              [`${R(M4)}의 제곱근은 ±${m * m}이다.`, `${R(M4)} = ${m * m}이므로 ${R(M4)}의 제곱근은 ±${m}이다.`, yes[1]],
              [`${R(p)} + ${R(q)} = ${R(p + q)}이다.`, `${R(p)} + ${R(q)} = ${Math.sqrt(p)} + ${Math.sqrt(q)} = ${Math.sqrt(p) + Math.sqrt(q)}이다.`, '']
            ];
            const want = d.bool();
            return claimQ(d, `다음 문장 가운데 ${want ? '옳은' : '옳지 않은'} 것은?`, yes, no, want);
          }),
          T('root-pm-direct', '양의 제곱근과 음의 제곱근으로 셈하기', '①11', (d) => {
            const [p, q] = d.until(() => [d.int(2, 12), d.int(2, 12)], ([x, y]) => x !== y), sa = d.pick([1, -1]), sb = d.pick([1, -1]), op = d.pick(['+', '-', '*']);
            const A = sa * p, Bv = sb * q, v = OPS[op](A, Bv), w = (s) => (s > 0 ? '양' : '음');
            return N(`${p * p}의 ${w(sa)}의 제곱근을 ${V('A')}, ${q * q}의 ${w(sb)}의 제곱근을 ${V('B')}라 할 때, ${V('A')} ${OPH[op]} ${V('B')}의 값은?`, v, {
              signed: true,
              explain: `${V('A')} = ${tx(Q(A))}, ${V('B')} = ${tx(Q(Bv))}이므로 ${V('A')} ${OPH[op]} ${V('B')} = ${tx(Q(A))} ${OPH[op]} ${Bv < 0 ? par(tx(Q(Bv))) : Bv} = ${tx(Q(v))}이다.`,
              facts: { value: `(${sa < 0 ? '-' : ''}(${p * p}${RT}))${op}(${sb < 0 ? '-' : ''}(${q * q}${RT}))`, unseen: U5 }
            });
          }),
          T('root-pm-two', '거듭제곱·근호로 준 수의 양·음의 제곱근으로 셈하기', '①12', (d) => {
            // √81의 양의 제곱근은 9가 아니라 3이다(√81 = 9 의 양의 제곱근). 제곱근 49 는 √49 = 7 하나이다.
            const KINDS = { sqr: () => src.sqr(d.int(3, 12), d.pick([1, -1])), root: () => src.root(d.int(2, 5), d.pick([1, -1])), rootSq: () => src.rootSq(d.int(2, 4), d.pick([1, -1])), named: () => src.named(d.int(4, 12)) };
            const [k1, k2] = d.shuffle(Object.keys(KINDS)).slice(0, 2);
            const [s1, s2, op] = d.until(() => [KINDS[k1](), KINDS[k2](), d.pick(['+', '-', '*'])], ([x, y, o]) => Math.abs(OPS[o](x.v, y.v)) <= 80 && OPS[o](x.v, y.v) !== 0);
            const v = OPS[op](s1.v, s2.v), a = V('a'), b = V('b');
            return N(`${srcJ(s1, '을/를')} ${a}, ${srcJ(s2, '을/를')} ${b}라 할 때, ${a} ${OPH[op]} ${b}의 값은?`, v, {
              signed: true, explain: `${s1.told} ${s2.told} 따라서 ${a} ${OPH[op]} ${b} = ${tx(Q(s1.v))} ${OPH[op]} ${s2.v < 0 ? par(tx(Q(s2.v))) : s2.v} = ${tx(Q(v))}이다.`,
              facts: { value: `(${s1.js})${op}(${s2.js})`, unseen: U5.concat([2]) }
            });
          }),
          T('root-pm-compare', '근호로 준 수의 양의 제곱근의 대소', '①12', (d) => {
            // √25의 양의 제곱근은 √5, (−√6)²의 양의 제곱근은 √6 — 둘 다 무리수이고 근호 안의 수로 견준다.
            const [k, m] = d.until(() => [d.pick([2, 3, 5, 6, 7, 8, 10, 11]), d.pick([2, 3, 5, 6, 7, 8, 10, 11])], ([x, y]) => x !== y);
            const A = { h: `${R(k * k)}의 양의 제곱근`, js: `((${k * k}${RT})${RT})`, v: k, told: (w) => `${R(k * k)} = ${k}이므로 ${w} = ${R(k)}` };
            const Bs = { h: `${sq(par(neg(R(m))))}의 양의 제곱근`, js: `(((${m}${RT})**2)${RT})`, v: m, told: (w) => `${sq(par(neg(R(m))))} = ${m}이므로 ${w} = ${R(m)}` };
            const [P1, P2] = d.bool() ? [Bs, A] : [A, Bs], a = V('a'), b = V('b'), big = P1.v > P2.v;
            return C(`${P1.h}을 ${a}, ${P2.h}을 ${b}라 할 때, ${a} □ ${b}의 □ 안에 알맞은 부등호는?`, [GT, '=', LT], big ? 0 : 2, {
              explain: `${P1.told(a)}, ${P2.told(b)}이다. ${P1.v} ${big ? GT : LT} ${P2.v}이므로 ${R(P1.v)} ${big ? GT : LT} ${R(P2.v)}, 곧 ${a} ${big ? GT : LT} ${b}이다.`,
              facts: { choose: { exprs: [P1.js, P2.js], rule: 'compare' }, unseen: U5.concat([2]) }
            });
          }),
          T('root-pm-square', '제곱근을 구해 제곱하여 셈하기', '심1', (d) => {
            // √9의 양의 제곱근은 3이 아니라 √3이므로 b² = 3이다(9로 셈하는 실수).
            const k = d.int(3, 9), s = d.pick([1, -1]), m = d.pick([2, 3, 5, 6, 7]), op = d.pick(['+', '-']);
            const A = src.sqr(k, s), b = V('b'), a = V('a'), v = op === '+' ? s * k + m : s * k - m;
            return N(`${A.h}을 ${a}, ${R(m * m)}의 양의 제곱근을 ${b}라 할 때, ${a} ${OPH[op]} ${b}${sup(2)}의 값은?`, v, {
              signed: true,
              explain: `${A.told} 따라서 ${a} = ${tx(Q(s * k))}이다. ${R(m * m)} = ${m}이고 ${m}의 양의 제곱근은 ${R(m)}이므로 ${b} = ${R(m)}, ${b}${sup(2)} = ${m}이다. ${a} ${OPH[op]} ${b}${sup(2)} = ${tx(Q(s * k))} ${OPH[op]} ${m} = ${tx(Q(v))}이다.`,
              facts: { value: `(${A.js})${op}((${m * m}${RT})${RT})**2`, unseen: U5.concat([2]) }
            });
          }),
          T('root-again', '구한 값의 제곱근을 다시 구하기', '①13', (d) => {
            const make = () => d.pick([() => src.sqr(d.int(2, 9), d.pick([1, -1])), () => src.root(d.int(2, 4), d.pick([1, -1])), () => src.named(d.int(2, 9))])();
            const [s1, s2, op] = d.until(() => [make(), make(), d.pick(['+', '-'])], ([x, y, o]) => x.h !== y.h && isSquare(OPS[o](x.v, y.v)) && OPS[o](x.v, y.v) >= 4);
            const v = OPS[op](s1.v, s2.v), k = Math.round(Math.sqrt(v)), a = V('a'), b = V('b');
            return pmInt(`${srcJ(s1, '을/를')} ${a}, ${srcJ(s2, '을/를')} ${b}라 할 때, ${a} ${OPH[op]} ${b}의 제곱근을 구하시오.`, k, {
              explain: `${s1.told} ${s2.told} ${a} ${OPH[op]} ${b} = ${tx(Q(s1.v))} ${OPH[op]} ${s2.v < 0 ? par(tx(Q(s2.v))) : s2.v} = ${v}이고, ${v}의 제곱근은 ±${k}이다.`,
              facts: { calc: [[`((${s1.js})${op}(${s2.js}))${RT}`, 0]], unseen: U5 }
            });
          }),
          T('root-sq-def', '제곱근의 뜻으로 제곱한 값 구하기', '①14', (d) => {
            // a 를 구하지 않아도 a 가 p 의 제곱근이면 a² = p 이다.
            const [p, q] = d.until(() => [d.int(2, 30), d.int(2, 30)], ([x, y]) => x !== y && !isSquare(x) && !isSquare(y)), op = d.pick(['+', '-', '*']);
            const a = V('a'), b = V('b'), v = OPS[op](p, q);
            return N(`${a}는 ${p}의 제곱근이고 ${b}는 ${q}의 제곱근일 때, ${a}${sup(2)} ${OPH[op]} ${b}${sup(2)}의 값은?`, v, {
              signed: true, explain: `${a}는 ${p}의 제곱근이므로 ${a}${sup(2)} = ${p}, ${b}는 ${q}의 제곱근이므로 ${b}${sup(2)} = ${q}이다. 따라서 ${a}${sup(2)} ${OPH[op]} ${b}${sup(2)} = ${p} ${OPH[op]} ${q} = ${tx(Q(v))}이다.`,
              facts: { value: `${p}${op}${q}` }
            });
          })
        ]
      },
      {
        id: 'prop', title: '제곱근의 성질과 계산', standard: STD7,
        types: [
          T('prop-value', '제곱근의 성질로 값 구하기', '①15', (d, n) => {
            // 첫째는 정수, 둘째는 분수. (√a)², (−√a)², √(a²), √((−a)²) 와 그 앞에 −가 붙은 꼴
            const v = n === 0 ? Q(d.int(2, 30)) : (() => { const [p, q] = d.until(() => [d.int(1, 9), d.int(2, 9)], ([x, y]) => x < y && gcd(x, y) === 1); return Q(p, q); })();
            const f = d.pick(['sq', 'nsq', 'msq', 'mnsq', 'rsq', 'rnsq', 'mrsq', 'mrnsq']), h = M_(v), j = jq(v);
            const SHOW = { sq: sq(par(R(v))), nsq: sq(par(neg(R(v)))), msq: neg(sq(par(R(v)))), mnsq: neg(sq(par(neg(R(v))))), rsq: rt(sq(n === 0 ? h : par(h))), rnsq: rt(sq(par(neg(h)))), mrsq: neg(rt(sq(n === 0 ? h : par(h)))), mrnsq: neg(rt(sq(par(neg(h))))) };
            const JS = { sq: `(${j}${RT})**2`, nsq: `(-(${j}${RT}))**2`, msq: `-((${j}${RT})**2)`, mnsq: `-((-(${j}${RT}))**2)`, rsq: `((${j})**2)${RT}`, rnsq: `((-${j})**2)${RT}`, mrsq: `-(((${j})**2)${RT})`, mrnsq: `-(((-${j})**2)${RT})` };
            const s = f.startsWith('m') ? -1 : 1, ans = s > 0 ? v : qneg(v);
            const why = f.includes('r') ? `${V('a')} ${GT} 0일 때 ${rt(sq(V('a')))} = ${rt(sq(par(neg(V('a')))))} = ${V('a')}이다.` : `${V('a')} ${GT} 0일 때 ${sq(par(rt(V('a'))))} = ${sq(par(neg(rt(V('a')))))} = ${V('a')}이다.`;
            const text = '다음 값을 구하시오.', o = { figure: ex(SHOW[f]), explain: `${why} 따라서 ${SHOW[f]} = ${tx(ans)}이다.`, facts: { value: JS[f], unseen: U5.concat([2]) } };
            return n === 0 ? N(text, ans.p, Object.assign({ signed: true }, o)) : F(text, Math.abs(ans.p), ans.q, Object.assign({ signed: true, negative: ans.p < 0, anyForm: true }, o));
          }, { count: 2 }),
          T('prop-claims', '제곱근의 성질을 적은 등식의 참·거짓', '①16', (d) => {
            const a = d.until(() => d.int(2, 20), (v) => !isSquare(v)), k = d.int(2, 12), [p, q] = d.until(() => [d.int(1, 9), d.int(2, 9)], ([x, y]) => x < y && gcd(x, y) === 1), t = tenth(d.pick([3, 7, 9, 11, 13]));
            const r = frac(p, q), tt = mag(t);
            const yes = [`${sq(par(neg(R(a))))} = ${a}`, `${rt(sq(par(neg(k))))} = ${k}`, `${neg(rt(sq(par(neg(tt)))))} = ${neg(tt)}`, `${sq(par(R(a)))} = ${a}`, `${rt(sq(par(r)))} = ${r}`, `${neg(sq(par(R(a))))} = ${neg(a)}`];
            const no = [
              [`${sq(par(R(a)))} = ±${a}`, `${sq(par(R(a)))} = ${a}이다.`, yes[3]],
              [`${sq(par(neg(R(a))))} = ${neg(a)}`, `${sq(par(neg(R(a))))} = ${a}이다.`, yes[0]],
              [`${rt(sq(par(neg(k))))} = ${neg(k)}`, `${rt(sq(par(neg(k))))} = ${rt(k * k)} = ${k}이다.`, yes[1]],
              [`${rt(sq(par(neg(r))))} = ${neg(r)}`, `${rt(sq(par(neg(r))))} = ${r}이다.`, ''],
              [`${neg(rt(sq(par(neg(tt)))))} = ${tt}`, `${neg(rt(sq(par(neg(tt)))))} = ${neg(tt)}이다.`, yes[2]]
            ];
            const want = d.bool();
            return claimQ(d, `제곱근의 성질을 적은 다음 등식 가운데 ${want ? '옳은' : '옳지 않은'} 것은?`, yes, no, want);
          }),
          T('prop-who', '제곱근의 성질을 잘못 말한 사람 찾기', '①17', (d) => {
            const k = d.int(2, 9), a = d.until(() => d.int(2, 20), (v) => !isSquare(v)), [x, y] = d.until(() => [d.int(2, 20), d.int(2, 20)], ([u, w]) => u > w);
            const good = [
              `${sq(par(neg(k)))} = ${k * k}이므로 ${rt(sq(par(neg(k))))} = ${R(k * k)} = ${k}`,
              `${x} ${GT} ${y}이므로 ${R(x)} ${GT} ${R(y)}`,
              `${sq(par(neg(R(a))))} = ${a}`,
              `${x} ${GT} ${y}이므로 ${neg(R(x))} ${LT} ${neg(R(y))}`
            ];
            const bad = [
              [`${sq(par(neg(k)))} = ${k * k}이므로 ${R(k * k)} = ${rt(sq(par(neg(k))))} = ${neg(k)}`, `${R(k * k)}${tail(k * k, '은/는')} ${k * k}의 양의 제곱근이므로 ${k}이다.`],
              [`${sq(par(neg(R(a))))} = ${neg(a)}`, `${sq(par(neg(R(a))))} = ${a}이다.`],
              [`${x} ${GT} ${y}이므로 ${neg(R(x))} ${GT} ${neg(R(y))}`, `${R(x)} ${GT} ${R(y)}이므로 ${neg(R(x))} ${LT} ${neg(R(y))}이다.`]
            ];
            const names = d.shuffle(NAMES.slice()).slice(0, 3), b = d.pick(bad), says = d.shuffle(d.shuffle(good).slice(0, 2).map((s) => [s, true]).concat([[b[0], false]]));
            const wrongAt = says.findIndex((s) => !s[1]);
            return C('다음은 세 사람이 제곱근의 성질에 대하여 말한 것이다. 잘못 말한 사람은?', names, wrongAt, {
              figure: lines(says.map((s, i) => `${names[i]}: ${s[0]}`)),
              explain: `${names[wrongAt]}의 말이 틀렸다. ${b[1]}`,
              facts: { truth: says.map((s) => !s[1]), want: true }
            });
          }),
          T('prop-add', '제곱근의 성질로 덧셈·뺄셈', '①18', (d) => {
            const [t1, t2, op] = d.until(() => [termOf(d, 'int'), termOf(d, 'int'), d.pick(['+', '-'])], ([x, y]) => x.h !== y.h);
            const first = d.int(0, 3) === 0 ? negTerm(t1) : t1, v = op === '+' ? first.v + t2.v : first.v - t2.v;
            const h = `${first.h} ${OPH[op]} ${t2.h}`;
            return ruled(N(CALCQ, v, { signed: true, figure: ex(h), explain: `${first.h} = ${tx(Q(first.v))}, ${t2.h} = ${t2.v}이므로 ${h} = ${tx(Q(first.v))} ${OPH[op]} ${t2.v} = ${tx(Q(v))}이다.`, facts: { value: `${first.js}${op}${t2.js}`, unseen: U5.concat([2]) } }), 'prop-add');
          }),
          T('prop-mul', '제곱근의 성질로 곱셈·나눗셈', '①19', (d) => {
            const [t1, t2, op, sgn] = d.until(() => [termOf(d, 'any'), termOf(d, 'any'), d.pick(['*', '/']), d.int(0, 2)], ([x, y, o]) => {
              const v = o === '*' ? qmul(x.q, y.q) : qdiv(x.q, y.q);
              return x.h !== y.h && isInt(v) && v.p >= 2 && v.p <= 60 && !(isInt(x.q) && isInt(y.q));
            });
            const first = sgn === 0 ? negTerm(t1) : t1, v = op === '*' ? qmul(first.q, t2.q) : qdiv(first.q, t2.q);
            const h = `${first.h} ${op === '*' ? '×' : '÷'} ${t2.h}`;
            return ruled(N(CALCQ, v.p, { signed: true, figure: ex(h), explain: `${first.h} = ${tx(first.q)}, ${t2.h} = ${tx(t2.q)}이므로 ${h} = ${tx(first.q)} ${op === '*' ? '×' : '÷'} ${tx(t2.q)} = ${tx(v)}이다.`, facts: { value: `${first.js}${op}${t2.js}`, unseen: U5.concat([2]) } }), 'prop-mul');
          }),
          T('prop-mixed', '세 항 넘게 섞인 계산', '①20', (d) => {
            // 곱셈·나눗셈을 먼저 한다. 근호 안이 거듭제곱의 곱인 항(√((−2)⁴ × 3²) = 12)이 섞이기도 한다.
            const pow = () => { const [p, q] = d.pick([[2, 3], [2, 5], [3, 2], [2, 1]]); return q === 1 ? null : { h: rt(`${sq(par(neg(p))).replace(sup(2), sup(4))} × ${q}${sup(2)}`), v: p * p * q, q: Q(p * p * q), js: `(((-${p})**4*${q}**2)${RT})` }; };
            const built = d.until(() => {
              const n = d.pick([3, 4]), terms = range(1, n).map(() => termOf(d, 'int'));
              if (d.bool()) { const pw = pow(); if (pw) terms[d.int(0, n - 1)] = pw; }
              const ops = range(1, n - 1).map(() => d.pick(['+', '-', '*', '/']));
              return { terms, ops };
            }, ({ terms, ops }) => { const v = evalMix(terms, ops); return v !== null && isInt(v) && Math.abs(v.p) <= 99 && ops.some((o) => o === '+' || o === '-') && ops.some((o) => o === '*' || o === '/') && new Set(terms.map((t) => t.h)).size === terms.length; });
            const { terms, ops } = built, v = evalMix(terms, ops), h = terms.map((t, i) => (i ? ` ${OPH2[ops[i - 1]]} ` : '') + t.h).join('');
            const plainH = terms.map((t, i) => (i ? ` ${OPH2[ops[i - 1]]} ` : '') + tx(t.q)).join('');
            return ruled(N(CALCQ, v.p, { signed: true, figure: ex(h), explain: `${terms.map((t) => `${t.h} = ${tx(t.q)}`).join(', ')}이므로 주어진 식은 ${plainH} = ${tx(v)}이다.`, facts: { value: terms.map((t, i) => (i ? ops[i - 1] : '') + t.js).join(''), unseen: U5.concat([2, 4]) } }), 'prop-mixed');
          }),
          T('prop-odd', '계산 결과가 다른 하나 찾기', '①21', (d) => {
            // 다섯 식 가운데 넷은 값이 같고 하나만 다르다. 식마다 제곱근의 성질로 항의 값을 구해 셈한다.
            const target = d.int(3, 9), odd = target + d.pick([-1, 1, 2]);
            const exprWith = (v) => d.until(() => {
              const op = d.pick(['+', '-', '*', '/']);
              if (op === '+') { const a = d.int(1, v - 1); return [op, a, v - a]; }
              if (op === '-') { const b = d.int(1, 9); return [op, v + b, b]; }
              if (op === '*') { const fs = range(2, v - 1).filter((u) => v % u === 0); if (!fs.length) return null; const a = d.pick(fs); return [op, a, v / a]; }
              const b = d.int(2, 4); return [op, v * b, b];
            }, (e) => e !== null && e[1] >= 2 && e[2] >= 2);
            const shapeOf = (v) => { const [op, a, b] = exprWith(v), t1 = termWith(d, a), t2 = termWith(d, b); return { h: `${t1.h} ${OPH2[op]} ${t2.h}`, js: `${t1.js}${op}${t2.js}`, v, a, b, op }; };
            const rows = d.until(() => d.shuffle([shapeOf(odd)].concat(range(1, 4).map(() => shapeOf(target)))), (list) => new Set(list.map((r) => r.h)).size === 5);
            const at2 = rows.findIndex((r) => r.v === odd);
            return C('다음 중 계산 결과가 나머지 넷과 다른 것은?', rows.map((r) => r.h), at2, {
              explain: `${rows.map((r) => `${r.h} = ${r.a} ${OPH2[r.op]} ${r.b} = ${r.v}`).join(', ')}이다. 결과가 다른 것은 ${rows[at2].h}이다.`,
              facts: { choose: { exprs: rows.map((r) => r.js), rule: 'odd' }, unseen: U5.concat([2]) }
            });
          }),
          T('prop-sign', '부호가 정해진 문자의 √(a²) 간단히', '①22', (d, n) => {
            // a < 0 이면 √(a²) = −a, √((−a)²) = −a 이다. 첫째는 덧셈·뺄셈(답 ka), 둘째는 나눗셈(답 수).
            const a = V('a'), sgn = d.pick([1, -1]);
            const termA = () => {
              const k = d.int(1, 5), inner = d.bool(), outer = d.pick([1, 1, -1]);
              const h = (outer < 0 ? MINUS : '') + (inner ? rt(sq(par(MINUS + (k === 1 ? '' : k) + a))) : rt((k === 1 ? '' : k * k) + a + sup(2)));
              return { h, c: outer * k * sgn, k, outer, told: `${h} = ${outer < 0 ? MINUS : ''}${sgn < 0 ? par(MINUS + (k === 1 ? '' : k) + a) : (k === 1 ? '' : k) + a}` };
            };
            const termB = () => { const outer = d.pick([1, -1]); return { h: (outer < 0 ? MINUS : '') + sq(par((d.bool() ? MINUS : '') + rt(a))), c: outer, k: 1, outer, told: '' }; };
            const cond = `${a} ${sgn > 0 ? GT : LT} 0`;
            if (n === 0) {
              const [t1, t2, op] = d.until(() => [termA(), sgn > 0 && d.bool() ? termB() : termA(), d.pick(['+', '-'])], ([x, y, o]) => { const c = x.c + (o === '+' ? 1 : -1) * y.c; return x.h !== y.h && Math.abs(c) >= 2; });
              const c = t1.c + (op === '+' ? 1 : -1) * t2.c, h = `${t1.h} ${OPH[op]} ${t2.h}`;
              return inline(`${cond}일 때, ${h}을 간단히 하면?`, '{0}' + a, [{ answer: c, signed: true }], {
                shown: (c < 0 ? MINUS : '') + Math.abs(c) + a,
                explain: `${cond}이므로 ${sgn < 0 ? `${MINUS}${a} ${GT} 0이고 ` : ''}${rt(sq(a))} = ${sgn < 0 ? MINUS + a : a}이다. ${h} = ${termWord(t1, sgn, a)} ${OPH[op]} ${pw(termWord(t2, sgn, a))} = ${(c < 0 ? MINUS : '') + Math.abs(c) + a}이다.`,
                facts: { calc: [[`${t1.c}${op}(${t2.c})`, 0]], unseen: [t1.c, t2.c].map(Math.abs) }
              });
            }
            const [t1, t2] = d.until(() => [termA(), termA()], ([x, y]) => x.h !== y.h && x.c % y.c === 0 && Math.abs(x.c / y.c) >= 2);
            const v = t1.c / t2.c, h = `${t1.h} ÷ ${t2.h.startsWith(MINUS) ? par(t2.h) : t2.h}`;
            return N(`${cond}일 때, ${h}의 값은?`, v, {
              signed: true, explain: `${cond}이므로 ${rt(sq(a))} = ${sgn < 0 ? MINUS + a : a}이다. ${h} = ${pw(termWord(t1, sgn, a))} ÷ ${pw(termWord(t2, sgn, a))} = ${tx(Q(v))}이다.`,
              facts: { calc: [[`(${t1.c})/(${t2.c})`, 0]], unseen: [t1.c, t2.c].map(Math.abs) }
            });
          }, { count: 2 }),
          T('prop-range', '범위가 주어진 √((x − p)²) 간단히', '①23', (d, n) => {
            // 근호 안의 식의 부호부터 정한다: lo < x < hi 에서 c ≤ lo 이면 √((x − c)²) = x − c, c ≥ hi 이면 c − x.
            // 첫째는 두 항(가운데 수가 두 끝), 둘째는 √(x²)이 섞인 세 항. 틀린 보기는 부호를 거꾸로 정한 것들이다.
            const x = V('x'), lo = n === 0 ? d.int(-3, 2) : d.int(0, 2), hi = lo + d.int(2, 4);
            const cs = n === 0 ? d.shuffle([lo, hi]) : [0].concat(d.shuffle([hi, lo === 0 ? hi : d.pick([lo, hi])]));
            const inside = (c, flip) => (flip ? `${c < 0 ? MINUS + -c : c} ${MINUS} ${x}` : `${x} ${c < 0 ? '+' : MINUS} ${Math.abs(c)}`);
            const [terms, signs] = d.until(() => [cs.map((c) => { const flip = c !== 0 && d.bool(); return { c, flip, h: c === 0 ? rt(sq(x)) : rt(sq(par(inside(c, flip)))) }; }), [1].concat(cs.slice(1).map(() => d.pick([1, -1])))],
              ([ts]) => new Set(ts.map((t) => t.h)).size === ts.length);
            // 항 하나: |x − c| = s(x − c), s = 1(c ≤ lo) 또는 −1(c ≥ hi). 부호를 거꾸로 잡은 것까지 [x의 계수, 상수항]으로 셈한다.
            const lin = (t, wrong) => { const s = (t.c <= lo ? 1 : -1) * (wrong ? -1 : 1); return [s, -s * t.c]; };
            const total = (mask) => terms.reduce(([A, Bc], t, i) => { const [a1, b1] = lin(t, Boolean(mask & (1 << i))); return [A + signs[i] * a1, Bc + signs[i] * b1]; }, [0, 0]);
            const key = (e) => e.join(','), right = total(0), pool = [right];
            for (let mask = 1; mask < 2 ** terms.length; mask += 1) pool.push(total(mask));
            pool.push([right[0], -right[1]], [-right[0], -right[1]], [right[0], right[1] + 2], [right[0] + 2, right[1]]);
            const opts = []; for (const e of pool) if (!opts.some((o) => key(o) === key(e))) opts.push(e);
            const rows = d.shuffle(opts.slice(0, 5)), show = ([A, Bc]) => B.kit.mid.poly([[A, x], [Bc, '']]);
            const expr = terms.map((t, i) => (i ? ` ${signs[i] > 0 ? '+' : MINUS} ` : '') + t.h).join('');
            const why = terms.map((t) => `${t.h} = ${t.c === 0 ? x : t.c <= lo ? `${x} ${t.c < 0 ? '+' : MINUS} ${Math.abs(t.c)}` : `${t.c} ${MINUS} ${x}`}`);
            const cond = `${tx(Q(lo))} ${LT} ${x} ${LT} ${tx(Q(hi))}`;
            return C(`${cond}일 때, ${expr}을 간단히 하면?`, rows.map(show), rows.findIndex((r) => key(r) === key(right)), {
              explain: `${cond}이므로 ${uniqList(terms.map((t) => (t.c === 0 ? `${x} ${GT} 0` : t.c <= lo ? `${inside(t.c, false)} ${GT} 0` : `${inside(t.c, false)} ${LT} 0`))).join(', ')}이다. 따라서 ${uniqList(why).join(', ')}이고, 주어진 식은 ${show(right)}이다.`,
              facts: { truth: rows.map((r) => key(r) === key(right)), want: true, rule: 'prop-range-' + n }
            });
          }, { count: 2 }),
          T('prop-solve', '√((x + p)²) = q 를 만족하는 x', '①24', (d) => {
            // √((x + p)²) = |x + p| = q 이므로 x + p = q 또는 x + p = −q 이다.
            const p = d.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]), q = d.until(() => d.int(2, 9), (v) => v !== Math.abs(p)), x = V('x');
            const h = rt(sq(par(`${x} ${p < 0 ? MINUS : '+'} ${Math.abs(p)}`)));
            const a1 = q - p, a2 = -q - p;
            return M(`${h} = ${josa(q, '을/를')} 만족시키는 ${x}의 값을 모두 구하시오.`, [{ answer: a1, signed: true }, { answer: a2, signed: true, lead: '또는' }], {
              unordered: true, shown: `${x} = ${tx(Q(a2))} 또는 ${x} = ${tx(Q(a1))}`,
              explain: `${h} = |${x} ${p < 0 ? MINUS : '+'} ${Math.abs(p)}| = ${q}이므로 ${x} ${p < 0 ? MINUS : '+'} ${Math.abs(p)} = ${q} 또는 ${x} ${p < 0 ? MINUS : '+'} ${Math.abs(p)} = ${MINUS}${q}이다. 따라서 ${x} = ${tx(Q(a1))} 또는 ${x} = ${tx(Q(a2))}이다.`,
              facts: { calc: [[`${q}-(${p})`, 0], [`-${q}-(${p})`, 1]] }
            });
          })
        ]
      },
      {
        id: 'area', title: '넓이와 제곱근', standard: STD7,
        types: [
          T('area-rect', '직사각형과 넓이가 같은 정사각형의 한 변', '①25', (d) => {
            const [w, h] = d.until(() => [d.int(2, 12), d.int(2, 12)], ([a, b]) => a > b && squareFree(a * b));
            return rootAns(`가로의 길이가 ${w} cm, 세로의 길이가 ${h} cm인 직사각형과 넓이가 같은 정사각형의 한 변의 길이는?`, w * h, {
              figure: boxes([{ w, h, wl: w + ' cm', hl: h + ' cm' }], `직사각형: 가로 ${w} cm, 세로 ${h} cm`),
              explain: `직사각형의 넓이는 ${w} × ${h} = ${w * h} (cm²)이다. 정사각형의 한 변의 길이를 ${V('x')} cm라 하면 ${V('x')}${sup(2)} = ${w * h}이고 ${V('x')} ${GT} 0이므로 ${V('x')} = ${R(w * h)}이다.`,
              facts: { calc: [[`${w}*${h}`, 0]] }
            }, 'cm');
          }),
          T('area-sum', '두 정사각형의 넓이의 합과 같은 정사각형의 한 변', '①26', (d) => {
            const [a, b] = d.until(() => [d.int(1, 7), d.int(1, 7)], ([x, y]) => x > y && squareFree(x * x + y * y));
            return rootAns(`한 변의 길이가 각각 ${a} cm, ${b} cm인 두 정사각형의 넓이의 합과 넓이가 같은 정사각형을 만들려고 한다. 새 정사각형의 한 변의 길이는?`, a * a + b * b, {
              figure: boxes([{ w: a, h: a, wl: a + ' cm' }, { w: b, h: b, wl: b + ' cm' }], `정사각형 둘: 한 변 ${a} cm, 한 변 ${b} cm`),
              explain: `두 정사각형의 넓이의 합은 ${a}${sup(2)} + ${b}${sup(2)} = ${a * a + b * b} (cm²)이다. 새 정사각형의 한 변의 길이를 ${V('x')} cm라 하면 ${V('x')}${sup(2)} = ${a * a + b * b}, ${V('x')} = ${R(a * a + b * b)}이다.`,
              facts: { calc: [[`${a}*${a}+${b}*${b}`, 0]] }
            }, 'cm');
          }),
          T('area-grid', '모눈종이에 비스듬히 그린 정사각형의 한 변', '①27', (d) => {
            // 큰 정사각형의 넓이에서 네 귀의 직각삼각형을 빼어 넓이를 구하고, 넓이의 양의 제곱근이 한 변이다.
            const [a, b] = d.pick([[1, 1], [1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2], [1, 4], [4, 1]]), s = a + b, area = a * a + b * b;
            const pts = [[a, 0], [s, a], [b, s], [0, b]], u = Math.min(32, 150 / s), bd = Board();
            for (let i = 0; i <= s; i += 1) { bd.seg([i * u, 0], [i * u, -s * u], 'thin', 'stroke:#c3ccd5'); bd.seg([0, -i * u], [s * u, -i * u], 'thin', 'stroke:#c3ccd5'); }
            bd.poly(pts.map(([x, y]) => [x * u, -y * u]), 'fill:rgba(251,191,36,0.4)');
            return rootAns(`다음 그림은 한 눈금의 길이가 1 cm인 모눈종이 위에 정사각형을 그린 것이다. 이 정사각형의 한 변의 길이는?`, area, {
              figure: bd.svg(`모눈종이(한 눈금 1 cm) 가로 ${s}칸, 세로 ${s}칸 안에 꼭짓점이 모눈의 네 변 위에 있는 정사각형. 각 꼭짓점은 모서리에서 ${a}칸, 다른 쪽에서 ${b}칸 떨어져 있다`),
              explain: `한 변이 ${s} cm인 정사각형의 넓이 ${s * s} cm²에서 네 귀의 직각삼각형(두 변 ${a} cm, ${b} cm)의 넓이 4 × ${frac(a * b, 2)} = ${2 * a * b} (cm²)를 빼면 ${area} cm²이다. 한 변의 길이는 ${R(area)} cm이다.`,
              facts: { calc: [[`(${a}+${b})*(${a}+${b})-4*${a}*${b}/2`, 0]], unseen: [4, 2] }
            }, 'cm');
          }),
          T('area-coord', '넓이가 정해진 직각이등변삼각형을 이어 놓은 점의 좌표', '①28', (d) => {
            // 직각이등변삼각형의 넓이가 S 이면 직각을 낀 변의 길이 x 는 x²/2 = S 에서 x = √(2S) 이다.
            const s = d.int(1, 4), m = d.pick([3, 5, 6, 7, 10, 11]), t = d.until(() => d.int(2, 6), (v) => v !== s);
            const P = Q(s * s, 2), Qa = Q(m, 2), Ra = Q(t * t, 2);
            const u = 150 / (s + Math.sqrt(m) + t + 0.6), bd = Board(), x0 = 0, xA = s * u, xC = xA + Math.sqrt(m) * u, xE = xC + t * u;
            bd.seg([-10, 0], [xE + 18, 0], 'thin').seg([0, 10], [0, -(Math.max(s, Math.sqrt(m), t) * u + 18)], 'thin');
            bd.poly([[x0, 0], [xA, 0], [xA, -s * u]], 'fill:rgba(251,191,36,0.35)').poly([[xA, 0], [xC, 0], [xC, -Math.sqrt(m) * u]], 'fill:rgba(251,191,36,0.35)').poly([[xC, 0], [xE, 0], [xE, -t * u]], 'fill:rgba(251,191,36,0.35)');
            bd.text([-8, 9], 'O').text([xA, 12], 'A').text([xA, -s * u - 10], 'B').text([xC, 12], 'C').text([xC, -Math.sqrt(m) * u - 10], 'D').text([xE, 12], 'E').text([xE + 9, -t * u - 6], 'F');
            bd.text([xE + 20, 10], `<tspan style="font-style:italic">x</tspan>`).text([10, -(Math.max(s, Math.sqrt(m), t) * u + 14)], `<tspan style="font-style:italic">y</tspan>`);
            const area = (q) => (q.q === 1 ? String(q.p) : frac(q.p, q.q)), aj = (q) => (q.q === 1 ? String(q.p) : q.p + '/' + q.q);
            const text = `다음 그림과 같이 좌표평면 위에 직각이등변삼각형 OAB, ACD, CEF가 있다. 세 삼각형의 넓이는 차례로 ${area(P)}, ${area(Qa)}, ${area(Ra)}이고, 각은 ∠A = ∠C = ∠E = 90°이다. 세 점 A, C, E가 ${V('x')}축 위에 있을 때, 점 F의 좌표는? (단, O는 원점이다.)`;
            return inline(text, `({0} + ${rt('{1}')}, {2})`, [{ answer: s + t }, { answer: m }, { answer: t }], {
              shown: `(${s + t} + ${rt(m)}, ${t})`,
              figure: bd.svg(`좌표평면의 제1사분면에 직각이등변삼각형 셋이 x축 위에 잇달아 놓여 있다. 삼각형 OAB(넓이 ${aj(P)}), ACD(넓이 ${aj(Qa)}), CEF(넓이 ${aj(Ra)})의 직각은 A, C, E에 있다`),
              explain: `직각을 낀 변의 길이를 ${V('x')}라 하면 넓이는 ${frac(V('x') + sup(2), 2)}이다. ${frac(V('x') + sup(2), 2)} = ${area(P)}에서 OA = ${s}, ${frac(V('x') + sup(2), 2)} = ${area(Qa)}에서 AC = ${R(m)}, ${frac(V('x') + sup(2), 2)} = ${area(Ra)}에서 CE = EF = ${t}이다. 점 F의 ${V('x')}좌표는 ${s} + ${R(m)} + ${t} = ${s + t} + ${R(m)}, ${V('y')}좌표는 ${t}이다.`,
              facts: { calc: [[`(2*${aj(P)})${RT}+(2*${aj(Ra)})${RT}`, 0], [`2*${aj(Qa)}`, 1], [`(2*${aj(Ra)})${RT}`, 2]], unseen: U5.concat([2]) }
            });
          }),
          T('area-ratio', '넓이가 몇 배씩 줄어드는 정사각형의 한 변', '심14', (d) => {
            const k = d.pick([2, 3]), m = d.pick(k === 2 ? [3, 5, 6, 7, 10, 11, 13] : [2, 5, 6, 7]), A = m * k ** 3;
            return rootAns(`네 정사각형 A, B, C, D가 있다. A의 넓이는 B의 넓이의 ${k}배, B의 넓이는 C의 넓이의 ${k}배, C의 넓이는 D의 넓이의 ${k}배이다. A의 넓이가 ${A} cm²일 때, D의 한 변의 길이는?`, m, {
              explain: `B의 넓이는 ${A} ÷ ${k} = ${A / k} (cm²), C는 ${A / k / k} cm², D는 ${m} cm²이다. 넓이가 ${m} cm²인 정사각형의 한 변의 길이는 ${R(m)} cm이다.`,
              facts: { calc: [[`${A}/(${k}*${k}*${k})`, 0]] }
            }, 'cm');
          }),
          T('area-sim', '닮음비와 넓이의 합으로 정사각형의 한 변 구하기', '심15', (d) => {
            const [p, q] = d.pick([[1, 2], [2, 3], [1, 3], [3, 4], [2, 5], [3, 5]]), x = d.int(1, 3), S = (p * p + q * q) * x * x;
            return N(`닮음비가 ${p} : ${q}인 두 정사각형의 넓이의 합이 ${S} cm²일 때, 큰 정사각형의 한 변의 길이는 몇 cm인가?`, q * x, {
              unit: 'cm',
              explain: `두 정사각형의 한 변의 길이를 ${p === 1 ? '' : p}${V('x')} cm, ${q}${V('x')} cm라 하면 ${p * p === 1 ? '' : p * p}${V('x')}${sup(2)} + ${q * q}${V('x')}${sup(2)} = ${S}, ${V('x')}${sup(2)} = ${x * x}이고 ${V('x')} ${GT} 0이므로 ${V('x')} = ${x}이다. 큰 정사각형의 한 변은 ${q} × ${x} = ${q * x} (cm)이다.`,
              facts: { calc: [[`${q}*(${S}/(${p}*${p}+${q}*${q}))${RT}`, 0]], unseen: U5 }
            });
          })
        ]
      },
      {
        id: 'square', title: '근호 안을 제곱인 수로', standard: STD7,
        types: [
          T('sq-mul', '√(kx)가 자연수가 되는 가장 작은 자연수 x', '①29', (d) => {
            const [a, b] = d.until(() => [d.int(2, 6), d.pick([2, 3, 5, 6, 7, 10, 14, 15])], ([x, y]) => x * x * y <= 300 && x * x * y >= 12);
            const K = a * a * b, x = V('x'), fz = factor(K), shown = d.int(0, 2) === 0 ? rt(fz.map(([pp, e]) => pp + (e > 1 ? sup(e) : '')).join(' × ') + ' × ' + x) : rt(K + x);
            return N(`${shown}가 자연수가 되게 하는 가장 작은 자연수 ${x}의 값은?`, b, {
              explain: `${K} = ${fz.map(([pp, e]) => pp + (e > 1 ? sup(e) : '')).join(' × ')}이다. 근호 안의 수가 자연수의 제곱이 되려면 소인수의 지수가 모두 짝수여야 하므로 ${x} = ${b} × (자연수)${sup(2)} 꼴이다. 가장 작은 ${x}는 ${b}이다.`,
              facts: { digit: { template: `(${K}*□)${RT}%1<0.000001`, lo: 1, hi: K, ask: 'min' } }
            });
          }),
          T('sq-div', '√(k/x)가 자연수가 되는 가장 작은 자연수 x', '①30', (d) => {
            // x 는 k 의 약수이면서 k/x 가 제곱인 수가 되게 한다.
            const [a, b] = d.until(() => [d.int(2, 6), d.pick([2, 3, 5, 6, 7, 10, 14, 15, 21])], ([x, y]) => x * x * y <= 300 && x * x * y >= 12);
            const K = a * a * b, x = V('x'), fz = factor(K);
            return N(`${rq(K, x)}${tail(K, '이/가')} 자연수가 되게 하는 가장 작은 자연수 ${x}의 값은?`, b, {
              explain: `${K} = ${fz.map(([pp, e]) => pp + (e > 1 ? sup(e) : '')).join(' × ')}이다. ${frac(K, x)}${tail(K, '이/가')} 자연수의 제곱이 되려면 ${x}는 ${K}의 약수이고, 지수가 홀수인 소인수를 모두 나누어 없애야 한다. 가장 작은 ${x}는 ${b}이고 그때 ${rq(K, b)} = ${R(K / b)} = ${a}이다.`,
              facts: { digit: { template: `(${K}/□)${RT}%1<0.000001`, lo: 1, hi: K, ask: 'min' } }
            });
          }),
          T('sq-sub', '√(k − x)가 자연수가 되는 자연수 x', '①31', (d, n) => {
            const x = V('x');
            if (n === 0) {
              // 근호 안이 k 보다 작은 제곱인 수(1, 4, 9, …)가 되는 x 를 모두 더한다.
              const K = d.until(() => d.int(15, 40), (v) => !isSquare(v)), js2 = range(1, 7).filter((j) => j * j < K), xs = js2.map((j) => K - j * j);
              return N(`${rt(`${K} ${MINUS} ${x}`)}${'가'} 자연수가 되게 하는 자연수 ${x}의 값을 모두 더하면?`, xs.reduce((s, v) => s + v, 0), {
                explain: `${K} ${MINUS} ${x}가 ${K}보다 작은 제곱인 수 ${js2.map((j) => j * j).join(', ')}이어야 하므로 ${x} = ${xs.join(', ')}이다. 모두 더하면 ${xs.reduce((s, v) => s + v, 0)}이다.`,
                facts: { calc: [[xs.map((v) => `(${K}-${K - v})`).join('+'), 0]], unseen: js2.map((j) => j * j) }
              });
            }
            const [mm, K] = d.until(() => [d.pick([2, 3, 4, 5]), d.int(30, 120)], ([c, k]) => range(1, Math.floor((k - 1) / c)).filter((v) => isSquare(k - c * v)).length >= 2);
            const hi = Math.floor((K - 1) / mm), xs = range(1, hi).filter((v) => isSquare(K - mm * v));
            return ruled(N(`${rt(`${K} ${MINUS} ${mm}${x}`)}${'가'} 자연수가 되게 하는 자연수 ${x}는 모두 몇 개인가?`, xs.length, {
              unit: '개',
              explain: `${K} ${MINUS} ${mm}${x}가 ${K}보다 작은 제곱인 수이고 ${x}가 자연수여야 한다. ${xs.map((v) => `${x} = ${v}이면 ${K - mm * v} = ${Math.round(Math.sqrt(K - mm * v))}${sup(2)}`).join(', ')}이므로 ${xs.length}개이다.`,
              facts: { digit: { template: `(${K}-${mm}*□)${RT}%1<0.000001`, lo: 1, hi, ask: 'count' } }
            }), 'sq-sub-coef');
          }, { count: 2 }),
          T('sq-rational', '√x가 유리수가 되는 x의 개수', '①33', (d) => {
            const lo = d.int(5, 30), hi = lo + d.int(25, 60), xs = range(lo, hi).filter(isSquare), x = V('x');
            return N(`${lo} ≤ ${x} ≤ ${hi}인 자연수 ${x} 가운데 ${rt(x)}${'가'} 유리수가 되는 ${x}는 모두 몇 개인가?`, xs.length, {
              unit: '개', explain: `${rt(x)}가 유리수가 되려면 근호 안의 수가 제곱인 수여야 한다. ${xs.join(', ')}의 ${xs.length}개이다.`,
              facts: { digit: { template: `(□)${RT}%1<0.000001`, lo, hi, ask: 'count' } }
            });
          })
        ]
      }
    ]
  });

  // ── 이 파일 안에서만 쓰는 셈 ──
  function plainOf(v) { return Q(v.p, v.q); }
  function sqrtVal(v) { const q = sqrtQ(plainOf(v)); return v.d ? Object.assign(q, { d: v.d / 2 }) : q; }
  function factor(n) { const out = []; let m = n; for (let p = 2; m > 1; p += 1) { let e = 0; while (m % p === 0) { e += 1; m /= p; } if (e) out.push([p, e]); } return out; }
  // 제곱근의 성질로 값이 정해지는 항: (√a)², (−√a)², √(a²), √((−a)²), √(제곱인 수). kind 'int' 는 정수 값, 'any' 는 분수·소수 값도
  function termOf(d, kind) {
    const pickV = () => (kind === 'int' || d.int(0, 2) === 0 ? Q(d.int(2, 15)) : d.bool() ? d.pick([Q(1, 2), Q(3, 2), Q(2, 3), Q(3, 4), Q(4, 3), Q(9, 8), Q(16, 3), Q(5, 2), Q(2, 5), Q(1, 3), Q(5, 4), Q(1, 10)]) : tenth(d.pick([2, 3, 4, 5, 6, 8, 12, 15])));
    const v = pickV(), h = M_(v), j = jq(v), f = d.pick(['sq', 'nsq', 'rsq', 'rnsq', 'plain']);
    if (f === 'plain') { const s2 = v.d ? dc2(Math.round(fl(v) * 10) ** 2) : Q(v.p * v.p, v.q * v.q); return { h: R(s2), q: v, v: fl(v), js: `(${jq(s2)}${RT})` }; }
    const H = { sq: sq(par(R(v))), nsq: sq(par(neg(R(v)))), rsq: rt(sq(isInt(v) && !v.d ? h : par(h))), rnsq: rt(sq(par(neg(h)))) }[f];
    const JS = { sq: `((${j}${RT})**2)`, nsq: `((-(${j}${RT}))**2)`, rsq: `(((${j})**2)${RT})`, rnsq: `(((-${j})**2)${RT})` }[f];
    return { h: H, q: v, v: fl(v), js: JS };
  }
  function negTerm(t) { return { h: MINUS + t.h, q: qneg(t.q), v: -t.v, js: `(-${t.js})` }; }
  // 값이 정해진 자연수 v 인 항
  function termWith(d, v) {
    const f = d.pick(['sq', 'nsq', 'rsq', 'rnsq', 'plain']);
    if (f === 'plain') return { h: R(v * v), js: `(${v * v}${RT})` };
    return { h: { sq: sq(par(R(v))), nsq: sq(par(neg(R(v)))), rsq: rt(sq(v)), rnsq: rt(sq(par(neg(v)))) }[f], js: { sq: `((${v}${RT})**2)`, nsq: `((-(${v}${RT}))**2)`, rsq: `((${v}**2)${RT})`, rnsq: `(((-${v})**2)${RT})` }[f] };
  }
  const OPH2 = { '+': '+', '-': MINUS, '*': '×', '/': '÷' };
  const CALCQ = '다음을 계산하시오.';
  // 곱셈·나눗셈을 먼저 한다(0으로 나누면 null)
  function evalMix(terms, ops) {
    const vals = [terms[0].q], adds = [];
    for (let i = 0; i < ops.length; i += 1) {
      const t = terms[i + 1].q;
      if (ops[i] === '*') vals[vals.length - 1] = qmul(vals[vals.length - 1], t);
      else if (ops[i] === '/') { if (t.p === 0) return null; vals[vals.length - 1] = qdiv(vals[vals.length - 1], t); } else { adds.push(ops[i]); vals.push(t); }
    }
    return vals.reduce((s, v, i) => (i === 0 ? v : adds[i - 1] === '+' ? qadd(s, v) : qsub(s, v)));
  }
  // √(k²a²) 꼴 항을 부호 조건에 맞춰 푼 글
  function termWord(t, sgn, a) {
    if (t.told === '') return (t.outer < 0 ? MINUS : '') + a;
    const k = t.k === 1 ? '' : t.k, inner = sgn < 0 ? MINUS + k + a : k + a;
    return (t.outer < 0 ? MINUS + par(inner) : inner);
  }
  function pw(h) { return h.startsWith(MINUS) ? par(h) : h; }
  function uniqList(list) { return list.filter((v, i) => list.indexOf(v) === i); }
  void qcmp; void dist; void midPt;
})(typeof window !== 'undefined' ? window : globalThis);
