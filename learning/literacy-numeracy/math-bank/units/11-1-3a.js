// 고등학교 대수 Ⅱ-1 삼각함수 — 단원 틀·도구와 앞쪽 묶음(일반각, 호도법, 부채꼴, 삼각함수의 뜻, 삼각함수 사이의 관계).
// 수집해 둔 천재 T셀파 대수(전인태, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 39꼴, 기본꼴_2: 30꼴, 심화꼴: 8꼴)을
// 꼴마다 따져서 실었다. 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-1-3/싣기_대조표.md 에 있다.
// (사인·코사인함수의 그래프, 삼각함수의 성질, 탄젠트함수의 그래프, 방정식과 부등식은 11-1-3b.js 에, 실력 문항은 11-1-3c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 성취기준: 12대수02-01(일반각과 호도법의 뜻을 알고, 그 관계를 설명할 수 있다), 12대수02-02(삼각함수의 개념을 이해하여 사인함수, 코사인함수,
// 탄젠트함수의 그래프를 그리고, 그 성질을 설명할 수 있다).
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(각·점·식·그래프·조건), 묻는 것(일반각의 α·사분면·값·부호·계수·해의 집합), 각을 적는 법(육십분법·호도법),
//    단계(사분면을 먼저 정하는가, 성질로 바꾸는가)가 다르면 따로 싣는다. 수만 바꾼 유형은 만들지 않는다.
//  - 교육과정: 「삼각함수가 포함된 방정식과 부등식은 … 주어진 구간 안에서 해를 구하는 것만 다룬다」 — 방정식·부등식은 모두 구간을 준다.
//    그래프와 직선의 교점을 세는 꼴은 해를 구하는 것이 아니라 그래프로 세는 일이라 싣는다(실력). 「간단히 다룬다」「지나치게 복잡한 문제는
//    다루지 않는다」는 정도를 말하는 줄이라 수집본의 꼴을 빼는 까닭으로 쓰지 않고, 꼬여 있는 꼴은 실력에 둔다.
//  - 답: 각(도)·좌표·개수·계수는 수 칸(음수가 될 수 있으면 부호 단추), 분수는 분자·분모 칸, π가 든 값은 묻는 글이 「□π」 꼴을 말할 때만
//    piAns(한 유형 안에서는 계수가 늘 분수이거나 늘 정수), 근호가 든 값·삼각함수의 값·해의 집합·식은 고르기로 받는다(칸의 모양이 답을 흘리지 않게).
//    원문의 「a + b + c의 값」「M + m의 값」처럼 따로 구한 값을 뜻 없이 더한 꼴은 값을 칸마다 따로 받는다.
//  - 고르기의 참·거짓은 손으로 적지 않고 코드가 값을 셈해 가린다. 수 칸의 근거는 facts.calc·value 이고, 글에 숫자로 없는 수는 seal 이 facts.unseen 에 밝힌다.
//  - 원문 답지의 잘못은 따르지 않는다: 교과서 69쪽 2⑶ −145°의 일반각(원문 125° — 215°가 맞다), 중간기말 07(제3사분면이면 sinθcosθ > 0 인데
//    두 근의 곱이 −a² 이라 전제가 맞지 않는다 — 같은 꼴의 다른 문항으로 실었다).
//
// 뺀 것과 까닭(11-1-3b.js, 11-1-3c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 활동: ②7(교과서 창의·코딩 프로젝트 — 무늬를 만드는 두 함수 짝 짓기), 생각 틔우기·공학 도구로 확인하기·발표하기.
//  - 앞 학년 되짚기: 대단원 진단 평가 전부(중1 부채꼴, 중3 삼각비·원주각), 교과서의 준비하기(직각삼각형의 삼각비, 단위원의 방정식, 평행이동).
//  - 다른 중단원(사인법칙과 코사인법칙): 대단원 평가·중간기말·최소 성취수준의 그 문항, 심화 09·10.
//  - 그리기만 묻는 것(작도)은 그리기를 빼고 바꾸어 실었다: ①4(동경이 지나는 눈금 고르기), ②1·②15(주기·최댓값·최솟값·점근선 묻기).
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, C, inline } = B.kit;
  const { MINUS, gcd, Q, qadd, qsub, qmul, qdiv, isInt, fl, tx, nb, V, sup, rt, sqParts } = B.kit.mid;
  const { trig, jh, qAns, piAns, plot, piTicks, signed } = B.kit.hs;
  const { Board, at, TINT, WHITE } = B.kit.mgeo;
  const S1 = '12대수02-01', S2 = '12대수02-02';

  // ── 검사 근거 마무리 ──
  // 문항에서 보이는 수(검사와 같은 방법으로 읽는다): 글·그림(그림 설명 포함)·보기
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 풀이의 긴 등식 사슬(A = B = C)은 휴대폰 너비를 넘기므로, 줄이 안 바뀌는 덩이를 바깥 층의 =·부등호 뒤에서 줄이 바뀔 수 있게 나눈다.
  // 나눈 조각이 그래도 길면 바깥 층의 +·− 뒤에서도 나눈다(괄호·분수·안쪽 덩이 속은 나누지 않는다).
  const NW = '<span style="white-space:nowrap">';
  function splitAt(h, ops) {
    const out = []; let depth = 0, par = 0, last = 0;
    for (let i = 0; i < h.length; i += 1) {
      if (h[i] === '<') { const j = h.indexOf('>', i), tag = h.slice(i, j + 1); if (/^<span\b/.test(tag)) depth += 1; else if (tag === '</span>') depth -= 1; i = j; continue; }
      if (h[i] === '(') par += 1; else if (h[i] === ')') par -= 1;
      else if (h[i] === ' ' && !depth && !par) { const op = ops.find((o) => h.startsWith(o, i)); if (op) { out.push(h.slice(last, i + op.length - 1)); last = i + op.length; i = last - 1; } }
    }
    out.push(h.slice(last));
    return out;
  }
  function wrapLong(h) {
    let out = '', i = 0;
    for (;;) {
      const s = h.indexOf(NW, i);
      if (s < 0) return out + h.slice(i);
      const re = /<(\/?)span\b[^>]*>/g; re.lastIndex = s; let depth = 0, end = -1, m;
      while ((m = re.exec(h))) { depth += m[1] ? -1 : 1; if (depth === 0) { end = m.index; break; } }
      if (end < 0) return out + h.slice(i);
      const pieces = splitAt(h.slice(s + NW.length, end), [' = ', ' &lt; ', ' &gt; ', ' ≤ ', ' ≥ ']).flatMap((p) => (stripH(p).length > 26 ? splitAt(p, [' − ', ' + ']) : [p]));
      out += h.slice(i, s) + pieces.map((p) => NW + p + '</span>').join(' ');
      i = end + '</span>'.length;
    }
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수(셈에서 나온 수: 반지름 r, 바퀴 수 n, 180 …)를 facts.unseen 에 밝힌다.
  function seal(item) {
    if (item.explain) item.explain = wrapLong(item.explain);
    if (item.facts && item.facts.calc) item.facts.calc = item.facts.calc.map(([t, i]) => [`(${t})+0`, i]);
    const f = item.facts || {}, shown = visibleNumbers(item), out = new Set(f.unseen || []);
    const exprs = (f.calc || []).map(([t]) => t).concat(f.value !== undefined ? [f.value] : [], (f.choose && f.choose.exprs) || [], f.pick ? [f.pick.expr] : []);
    for (const t of exprs) for (const n of String(t).match(/\d+(?:\.\d+)?/g) || []) if (!shown.has(n)) out.add(Number(n));
    if (out.size) f.unseen = [...out]; else delete f.unseen;
    item.facts = f;
    return item;
  }
  // 만들기가 null 을 돌려주면(조건에 맞지 않는 수) 다시 만든다. 다 만든 문항은 seal 로 검사 근거를 마무리한다.
  const retry = (make) => (d, n) => { for (let i = 0; i < 4000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const sourceOf = (ref) => '수집본 ' + (/[①②]/.test(ref) ? (/심/.test(ref) ? '기본·심화' : '기본') : '심화') + ' 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: sourceOf(ref), make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: sourceOf(ref), make: retry(make) }, more || {});

  // ── 글 ──
  const TH = V('θ'), X = V('x'), Y = V('y'), Nn = V('n'), AL = V('α'), BE = V('β'), Av = V('a'), Bv = V('b'), Cv = V('c'), Kv = V('k'), Rv = V('r'), Lv = V('l'), Sv = V('S');
  const LT = '&lt;', GT = '&gt;';
  const PI = 'π';
  const asQ = (x) => (typeof x === 'number' ? Q(x) : x);
  // 호도법의 각(π 의 몇 배): rad(Q(5, 6)) → 5/6π, rad(Q(1, 6)) → π/6, rad(Q(-2)) → −2π, rad(Q(1)) → π
  function rad(x) {
    const q = asQ(x);
    if (q.p === 0) return '0';
    const s = q.p < 0 ? MINUS : '', a = Math.abs(q.p);
    if (q.q === 1) return s + (a === 1 ? '' : a) + PI;
    return s + (a === 1 ? frac(PI, q.q) : frac(a, q.q) + PI);
  }
  const fa = (x) => (asQ(x).p < 0 ? `(${rad(x)})` : rad(x));                   // 함수 안의 각: 음수면 괄호
  const deg = (n) => (n < 0 ? MINUS : '') + Math.abs(n) + '°';                 // 육십분법의 각(−145°)
  const num = (x) => tx(asQ(x));                                               // 수(음수는 −, 분수는 분수 꼴)
  const jn = (x) => { const q = asQ(x); return q.q === 1 ? (q.p < 0 ? `(${q.p})` : String(q.p)) : `(${q.p}/${q.q})`; };   // 검사 식에 적는 수
  const eq = (l, r) => nb(`${l} = ${r}`);
  const sin = (a) => trig('sin', a), cos = (a) => trig('cos', a), tan = (a) => trig('tan', a);
  const TF = { sin, cos, tan };
  const FV = { sin: Math.sin, cos: Math.cos, tan: Math.tan };
  const QN = ['제1사분면', '제2사분면', '제3사분면', '제4사분면'];
  const genWords = (base) => nb(`${base} × ${Nn} + ${AL}°`);                   // 360° × n + α°
  const GEN360 = genWords('360°');
  const UNIT_NOTE = `(단, ${jh(Nn, '은/는')} 정수, ${nb(`0° ≤ ${AL}° ${LT} 360°`)})`;

  // 각의 사분면(라디안 값) — 좌표축 위면 0
  function quadOf(r) {
    const t = ((r % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI), k = t / (Math.PI / 2);
    if (Math.abs(k - Math.round(k)) < 1e-9) return 0;
    return Math.floor(k) + 1;
  }
  const quadOfDeg = (dg) => quadOf(dg * Math.PI / 180);
  const SGN = { sin: [0, 1, 1, -1, -1], cos: [0, 1, -1, -1, 1], tan: [0, 1, -1, 1, -1] };   // 사분면마다 값의 부호

  // ── 삼각함수의 특수한 값(정확한 글) ──
  const R2 = Math.SQRT2, R3 = Math.sqrt(3);
  const SPECIAL = [[0, '0'], [0.5, frac(1, 2)], [R2 / 2, frac(rt(2), 2)], [R3 / 2, frac(rt(3), 2)], [1, '1'], [R3, rt(3)], [R3 / 3, frac(rt(3), 3)], [2, '2'], [R2, rt(2)]];
  function exact(v) {
    if (!Number.isFinite(v) || Math.abs(v) > 1e6) return null;
    const a = Math.abs(v), hit = SPECIAL.find(([w]) => Math.abs(w - a) < 1e-9);
    if (!hit) return null;
    return a < 1e-12 ? '0' : (v < 0 ? MINUS : '') + hit[1];
  }
  // 특수한 값의 목록(보기에 쓰는 값들)
  const SVALS = [0, 0.5, -0.5, R2 / 2, -R2 / 2, R3 / 2, -R3 / 2, 1, -1, R3, -R3, R3 / 3, -R3 / 3];

  // ── 고르기 ──
  // 보기 다섯(정답 하나). right·wrongs 는 { h 글, v 값(같은 값이면 겹친 보기로 본다) } 이거나 글.
  function pickH(d, text, right, wrongs, o) {
    const opt = o || {}, k = opt.k || 4, key = (h) => stripH(h).replace(/\s+/g, '');
    const R = typeof right === 'string' ? { h: right } : right;
    const same = (a, b) => key(a.h) === key(b.h) || (a.v != null && b.v != null && Math.abs(a.v - b.v) < 1e-9);
    const pool = [];
    for (const w0 of d.shuffle(wrongs)) { const w = typeof w0 === 'string' ? { h: w0 } : w0; if (w && w.h && !same(w, R) && !pool.some((p) => same(p, w))) pool.push(w); }
    if (pool.length < k) return null;
    const rows = d.shuffle([R].concat(pool.slice(0, k)));
    return C(text, rows.map((r) => r.h), rows.indexOf(R), { figure: opt.figure, explain: opt.explain, facts: Object.assign({ truth: rows.map((r) => r === R), want: true }, opt.facts || {}) });
  }
  // 값 보기: 값(수)들을 exact 로 적는다(특수한 값만)
  const ev = (v) => { const h = exact(v); return h == null ? null : { h, v }; };
  function pickV(d, text, rightV, wrongVs, o) {
    const R = ev(rightV);
    if (!R) return null;
    return pickH(d, text, R, wrongVs.map(ev).filter(Boolean), o);
  }
  // 보기를 차례 그대로(사분면처럼 차례가 뜻인 보기)
  function pickFixed(text, options, answer, o) {
    const opt = o || {};
    return C(text, options, answer, { figure: opt.figure, explain: opt.explain, facts: Object.assign({ truth: options.map((_, i) => i === answer), want: true }, opt.facts || {}) });
  }

  // ── 피타고라스 수(삼각함수의 값이 유리수가 되게) ──
  const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [12, 35, 37], [9, 40, 41]];
  // 사분면 k 에 있는 점 (x, y) 와 r: |x|, |y| 는 피타고라스 수의 두 변
  function tripleIn(d, k) {
    const [a, b, r] = d.pick(TRIPLES), sw = d.bool(), ax = sw ? b : a, ay = sw ? a : b;
    return { x: SGN.cos[k] * ax, y: SGN.sin[k] * ay, r };
  }
  const fracOf = (p, q) => Q(p, q);
  // 분수·정수의 글(qAns 의 값과 같은 꼴)
  const qh = (x) => num(x);

  // ── 근호가 든 값의 글: s·(a√b)/c (b = 1 이면 근호 없이) ──
  function radFrac(s, a, b, c) {
    const [k, m] = sqParts(b), A = a * k, g = gcd(A, c) || 1, top = A / g, bot = c / g;
    const body = m === 1 ? String(top) : (top === 1 ? '' : top) + rt(m);
    return { h: (s < 0 ? MINUS : '') + (bot === 1 ? body : frac(body, bot)), v: s * A * Math.sqrt(m) / c };
  }

  // ── 그림 ──
  const RAD = Math.PI / 180;
  // 원(시초선 OX, 점 이름) — Board 위에 그린다. c 는 중심, R 반지름(px).
  function circleBase(R, o) {
    const b = Board(), c = [0, 0], opt = o || {};
    b.disk(c, R);
    if (opt.ray !== false) { b.seg(c, [R + 26, 0]); b.text([R + 34, 0], 'X'); }
    b.dot(c);
    return { b, c };
  }

  B.kit.u13 = {
    S1, S2, stripH, seal, retry, T, H, TH, X, Y, Nn, AL, BE, Av, Bv, Cv, Kv, Rv, Lv, Sv, LT, GT, PI, asQ, rad, deg, num, jn, eq, sin, cos, tan, TF, FV, QN,
    fa, genWords, GEN360, UNIT_NOTE, quadOf, quadOfDeg, SGN, SPECIAL, exact, SVALS, pickH, ev, pickV, pickFixed, TRIPLES, tripleIn, fracOf, qh, radFrac, RAD, circleBase
  };

  // ════════════════════════════════════════════════════════════════
  // 일반각
  // ════════════════════════════════════════════════════════════════
  const angle = [
    T('angle-general', '주어진 각의 일반각을 360° × n + α° 꼴로 나타내기', '①1', (d, n) => {
      const a = d.until(() => d.int(1, 359), (v) => v % 90 !== 0 && v % 5 === 0), turns = n === 0 ? d.int(1, 4) : -d.int(1, 3), th = 360 * turns + a;
      if (th === a) return null;
      return N(`시초선 OX와 동경 OP가 나타내는 한 각의 크기가 ${deg(th)}일 때, 동경 OP가 나타내는 일반각을 ${GEN360} 꼴로 나타내면 ${AL}의 값은? ${UNIT_NOTE}`, a, {
        explain: `${deg(th)} = 360° × ${turns < 0 ? `(${num(turns)})` : turns} + ${a}°이므로 일반각은 ${nb(`360° × ${Nn} + ${a}°`)}이고 ${eq(AL, a)}이다.`,
        facts: { value: `${th}-360*(${turns})` } });
    }, { count: 2, standard: S1 }),
    T('angle-perp', '서로 수직인 두 지름이 만드는 동경의 일반각', '①2', (d) => {
      const a = d.pick([30, 35, 40, 50, 55, 60, 65, 70]), names = ['P', 'R', 'Q', 'S'], which = d.pick([1, 2, 3]);   // 25° 아래는 각의 글이 원둘레에 걸린다
      const ang = a + 90 * which, { b, c } = circleBase(78), pts = names.map((nm, i) => at(c, 78, a + 90 * i));
      b.seg(pts[0], pts[2]).seg(pts[1], pts[3]);
      pts.forEach((p, i) => { b.dot(p); b.name(p, names[i], a + 90 * i, 13); });
      b.angle(c, 0, a, `${a}°`);
      b.text(at(c, 15, a + 135), 'O');                                          // 두 지름 OR·OQ 사이(선에 걸리지 않게)
      const figure = b.svg(`중심이 O인 원. 지름 PQ와 지름 RS가 서로 수직이고, 시초선 OX에서 시곗바늘이 도는 방향과 반대 방향으로 P, R, Q, S의 차례로 놓여 있다. ∠POX = ${a}°.`);
      const tgt = 'O' + names[which];
      return N(`그림과 같이 중심이 O인 원에서 두 지름 PQ, RS가 서로 수직이고 ${nb(`∠POX = ${a}°`)}이다. 반직선 OX를 시초선으로 할 때, 동경 ${jh(tgt, '이/가')} 나타내는 일반각을 ${GEN360} 꼴로 나타내면 ${AL}의 값은? ${UNIT_NOTE}`, ang % 360, {
        figure,
        explain: `동경 OP가 나타내는 각은 ${a}°이고, ${['', `OR은 OP에서 90°`, `OQ는 OP에서 180°`, `OS는 OP에서 270°`][which]} 더 돌아간 자리이므로 ${eq(AL, `${a} + ${90 * which} = ${ang % 360}`)}이다.`,
        facts: { value: `${a}+90*${which}` } });
    }, { standard: S1 }),
    T('angle-quadrant', '육십분법으로 나타낸 각이 제몇 사분면의 각인지', '①3', (d, n) => {
      const a = d.until(() => d.int(1, 359), (v) => v % 90 !== 0 && v % 5 === 0), turns = n === 0 ? d.int(1, 4) : -d.int(1, 3), th = 360 * turns + a, k = quadOfDeg(a);
      return pickFixed(`${deg(th)}는 제몇 사분면의 각인가?`, QN, k - 1, {
        explain: `${deg(th)} = 360° × ${turns < 0 ? `(${num(turns)})` : turns} + ${a}°이고 ${a}°는 ${QN[k - 1]}의 각이므로 ${deg(th)}도 ${QN[k - 1]}의 각이다.` });
    }, { count: 2, standard: S1 }),
    T('angle-draw', '둘레를 12등분 한 원에서 동경이 지나는 점 고르기', '①4', (d) => {
      const m = d.until(() => d.int(-26, 38), (v) => v % 12 !== 0 && (v < 0 || v > 12)), th = 30 * m, off = d.int(0, 11), L = '㉠㉡㉢㉣㉤㉥㉦㉧㉨㉩㉪㉫';
      const lab = (j) => L[(((j - off) % 12) + 12) % 12];
      const { b, c } = circleBase(74);
      for (let j = 0; j < 12; j += 1) { const p = at(c, 74, 30 * j); b.dot(p); b.name(p, lab(j), j === 0 ? 50 : 30 * j, 13); }   // 시초선 위의 점은 이름을 반직선 위쪽에
      b.text([-10, 13], 'O');
      const figure = b.svg(`중심이 O인 원의 둘레를 12등분 한 점. 시초선 OX 쪽(오른쪽) 점이 ${lab(0)}이고, 시곗바늘이 도는 방향과 반대 방향으로 ${Array.from({ length: 11 }, (_, i) => lab(i + 1)).join(', ')}의 차례이다.`);
      const j = ((m % 12) + 12) % 12, right = lab(j), wrongs = [lab(12 - j), lab(j + 6), lab(j + 1), lab(j - 1), lab(j + 3), lab(j - 3)];
      return pickH(d, `그림은 중심이 O인 원의 둘레를 12등분 한 점에 이름을 붙인 것이다. 반직선 OX를 시초선으로 할 때, ${deg(th)}를 나타내는 동경 OP는 어느 점을 지나는가?`, right, wrongs, {
        figure, explain: `${deg(th)} = 360° × ${Math.floor(m / 12) < 0 ? `(${num(Math.floor(m / 12))})` : Math.floor(m / 12)} + ${30 * j}°이므로 동경은 OX에서 시곗바늘이 도는 방향과 반대 방향으로 ${30 * j}°(${j}칸) 돈 점 ${right}을 지난다.` });
    }, { standard: S1 }),
    T('angle-clock', '시계에서 분침을 시초선으로 할 때 시침의 일반각', '①5', (d) => {
      const h = d.int(1, 11), mi = 2 * d.int(1, 29), raw = (11 * mi - 60 * h) / 2, al = ((raw % 360) + 360) % 360;
      if (al === 0 || !Number.isInteger(al)) return null;
      const K = (al - raw) / 360;
      return N(`시계가 ${h}시 ${mi}분을 가리키고 있다. 분침을 시초선으로 할 때, 시침이 나타내는 일반각을 ${GEN360} 꼴로 나타내면 ${AL}의 값은? ${UNIT_NOTE}`, al, {
        explain: `분침은 12를 가리키는 쪽에서 시곗바늘이 도는 방향으로 ${6 * mi}°, 시침은 ${30 * h + mi / 2}° 돌아가 있다. 분침에서 시곗바늘이 도는 방향과 반대 방향(양의 방향)으로 시침까지 잰 각은 ${6 * mi}° ${MINUS} ${30 * h + mi / 2}°에 360°의 배수를 더해 0°와 360° 사이로 맞춘 ${al}°이다.`,
        facts: { value: `(11*${mi}-60*${h})/2+360*${K}` } });
    }, { standard: S1 }),
    T('angle-half', '범위가 주어진 각 θ에서 θ/2가 제몇 사분면의 각인지', '①6', (d) => {
      const k = d.int(1, 7), q = Math.floor(k / 2) % 4;
      return pickFixed(`${rad(Q(k, 2))} ${LT} ${TH} ${LT} ${rad(Q(k + 1, 2))}일 때, 각 ${frac(TH, 2)}는 제몇 사분면의 각인가?`, QN, q, {
        explain: `각 변을 2로 나누면 ${rad(Q(k, 4))} ${LT} ${frac(TH, 2)} ${LT} ${rad(Q(k + 1, 4))}이므로 ${frac(TH, 2)}는 ${QN[q]}의 각이다.` });
    }, { standard: S1 }),
    T('angle-two-rays', '두 동경의 위치 관계로 각 θ 구하기', '①8', (d, n) => {
      const k = n === 1 ? d.pick([6, 7, 8, 9]) : d.int(3, 9), m = k - 1;
      if (n === 1) {
        const th = Q(2, m), r = d.pick([2, 3, 4, 6]), area = qmul(Q(r * r, 2), th);
        const wrongs = [qmul(Q(r * r, 2), Q(2, k + 1)), qmul(Q(r * r, 2), Q(1, m)), qmul(Q(r, 1), th), qmul(Q(r * r, 1), th), qmul(Q(r * r, 2), Q(4, m)), qmul(Q(r * r, 2), Q(1, k))];
        return pickH(d, `반지름의 길이가 ${r}이고 중심각의 크기가 ${TH}인 부채꼴이 있다. 각 ${TH}가 다음 조건을 모두 만족시킬 때, 이 부채꼴의 넓이는?<br>(가) ${nb(`0 ${LT} ${TH} ${LT} ${rad(Q(1, 2))}`)}<br>(나) 각 ${TH}를 나타내는 동경과 각 ${k}${TH}를 나타내는 동경이 일치한다.`,
          { h: rad(area), v: fl(area) }, wrongs.map((w) => ({ h: rad(w), v: fl(w) })), {
            explain: `두 동경이 일치하므로 ${nb(`${k}${TH} ${MINUS} ${TH} = 2${Nn}π`)}(${Nn}은 정수), 곧 ${eq(TH, frac(`2${Nn}`, m) + 'π')}이다. ${nb(`0 ${LT} ${TH} ${LT} ${rad(Q(1, 2))}`)}에서 ${eq(Nn, 1)}뿐이라 ${eq(TH, rad(th))}이고, 넓이는 ${nb(`${frac(1, 2)} × ${r}${sup(2)} × ${rad(th)} = ${rad(area)}`)}이다.` });
      }
      const same = n === 0, lo = d.int(0, 5), w = d.pick([1, 2]), hi = lo + w;
      const sols = [];
      for (let t = -20; t <= 40; t += 1) { const v = same ? Q(2 * t, m) : Q(2 * t + 1, m); if (fl(v) > lo / 2 + 1e-9 && fl(v) < hi / 2 - 1e-9) sols.push(v); }
      if (sols.length !== 1) return null;
      const th = sols[0], cand = [];
      for (let t = -4; t <= 12; t += 1) { cand.push(same ? Q(2 * t + 1, m) : Q(2 * t, m)); cand.push(same ? Q(2 * t, m) : Q(2 * t + 1, m)); cand.push(Q(2 * t, k + 1)); }
      const wrongs = cand.filter((v) => fl(v) > 0 && fl(v) < 6 && Math.abs(fl(v) - fl(th)) > 1e-9).map((v) => ({ h: rad(v), v: fl(v), near: Math.abs(fl(v) - fl(th)) })).sort((a, b) => a.near - b.near).slice(0, 7);
      const cond = same ? `각 ${TH}를 나타내는 동경과 각 ${k}${TH}를 나타내는 동경이 일치할 때` : `좌표평면 위에서 각 ${TH}를 나타내는 동경과 각 ${k}${TH}를 나타내는 동경이 일직선 위에 있고 방향이 반대일 때`;
      return pickH(d, `${cond}, ${TH}의 값은? (단, ${nb(`${rad(Q(lo, 2))} ${LT} ${TH} ${LT} ${rad(Q(hi, 2))}`)})`, { h: rad(th), v: fl(th) }, wrongs, {
        explain: `${same ? `두 동경이 일치하므로 ${nb(`${k}${TH} ${MINUS} ${TH} = 2${Nn}π`)}` : `두 동경이 반대 방향이므로 ${nb(`${k}${TH} ${MINUS} ${TH} = 2${Nn}π + π`)}`}(${Nn}은 정수)이다. 곧 ${eq(TH, frac(same ? `2${Nn}` : `2${Nn} + 1`, m) + 'π')}이고 주어진 범위에 드는 것은 ${eq(TH, rad(th))}뿐이다.` });
    }, { count: 3, standard: S1 })
  ];

  // ════════════════════════════════════════════════════════════════
  // 호도법
  // ════════════════════════════════════════════════════════════════
  // 특수한 각(도): 180°의 몇 분의 몇이 깔끔한 분수가 되는 각
  const NICE_DEN = [3, 4, 5, 6, 9, 10, 12, 18, 20, 36];
  function niceDeg(d, lo, hi) {
    return d.until(() => { const q = d.pick(NICE_DEN), p = d.int(Math.ceil(lo * q / 180), Math.floor(hi * q / 180)); return { p, q, dg: 180 * p / q }; },
      (v) => Number.isInteger(v.dg) && v.dg !== 0 && gcd(Math.abs(v.p), v.q) === 1 && v.q > 1);
  }
  const radian = [
    T('rad-convert', '육십분법과 호도법 바꾸기', '①9', (d, n) => {
      const { p, q, dg } = niceDeg(d, -400, 600), r = Q(p, q);
      if (n === 0) return piAns(`${deg(dg)}를 호도법으로 나타내면 □π이다. □ 안에 알맞은 수는?`, r.p, r.q, {
        explain: `${nb('1° = ' + frac(PI, 180))}이므로 ${nb(`${deg(dg)} = ${num(dg)} × ${frac(PI, 180)} = ${rad(r)}`)}이다.`, facts: { value: `${jn(dg)}/180` } });
      return N(`${rad(r)}를 육십분법으로 나타내면 몇 도인가?`, dg, { signed: true, unit: '°',
        explain: `${nb('π = 180°')}이므로 ${nb(`${rad(r)} = ${num(r)} × 180° = ${deg(dg)}`)}이다.`, facts: { value: `${jn(p)}*180/${q}` } });
    }, { count: 2, standard: S1 }),
    T('rad-no-pi', 'π가 없는 호도법의 각을 육십분법으로', '①10', (d) => {
      const a = d.pick([2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 45, 60]);
      const right = frac(`${180 * a}°`, PI), wrongs = [`${a}°`, `${180 * a}°`, frac(`${a}π`, 180) + '°', frac('180°', `${a}π`), frac(`${a}°`, PI), `${a}π°`];
      return pickH(d, `호도법으로 나타낸 각의 크기 ${josaN(a, '을/를')} 육십분법으로 나타낸 것은?`, right, wrongs, {
        explain: `각의 크기를 호도법으로 나타낼 때는 단위 「라디안」을 생략하므로 ${josaN(a, '은/는')} ${a}라디안이다. ${nb(`1라디안 = ${frac('180°', PI)}`)}이므로 ${a}라디안은 ${right}이다.` });
    }, { standard: S1 }),
    T('rad-wrong', '육십분법과 호도법의 관계가 맞는 것·틀린 것 고르기', '①11', (d, n) => {
      const rows = [], used = new Set();
      while (rows.length < 5) { const v = niceDeg(d, -300, 400); if (used.has(v.dg)) continue; used.add(v.dg); rows.push(v); }
      const odd = d.int(0, 4), slip = (v) => d.pick([v.dg + 30, v.dg - 30, v.dg + 45, 180 - v.dg, v.dg + 60].filter((w) => w !== v.dg && w !== 0));
      const want = n === 0 ? false : true;   // n=0: 옳지 않은 것, n=1: 옳은 것
      const lines = rows.map((v, i) => {
        const good = (i === odd) === want, dg = good ? v.dg : slip(v);
        return { h: d.bool() ? eq(deg(dg), rad(Q(v.p, v.q))) : eq(rad(Q(v.p, v.q)), deg(dg)), ok: good };
      });
      const ans = lines.findIndex((l) => l.ok === want);
      return C(`다음 중 각의 크기를 ${want ? '바르게 나타낸' : '잘못 나타낸'} 것은?`, lines.map((l) => l.h), ans, {
        explain: `${nb('π = 180°')}로 바꾸어 보면 ${rows.map((v) => nb(`${rad(Q(v.p, v.q))} = ${deg(v.dg)}`)).join(', ')}이다.`,
        facts: { truth: lines.map((l) => l.ok), want } });
    }, { count: 2, standard: S1 }),
    T('rad-general', '호도법으로 나타낸 각의 일반각(2nπ + α)과 사분면', '①12', (d, n) => {
      if (n === 0) {
        const q = d.pick([3, 4, 5, 6, 7, 8, 9, 12]), p = d.until(() => d.int(-6 * q, 9 * q), (v) => gcd(Math.abs(v), q) === 1 && Math.abs(v) > 2 * q), r = Q(p, q);
        const al = Q((((p % (2 * q)) + 2 * q) % (2 * q)), q), turns = (p - al.p * (q / al.q)) / (2 * q);
        return piAns(`${rad(r)}의 동경이 나타내는 일반각을 ${nb(`2${Nn}π + ${AL}`)} 꼴로 나타낼 때, ${eq(AL, '□π')}이다. □ 안에 알맞은 수는? (단, ${jh(Nn, '은/는')} 정수, ${nb(`0 ≤ ${AL} ${LT} 2π`)})`, al.p, al.q, {
          signed: false, explain: `${nb(`${rad(r)} = 2π × ${turns < 0 ? `(${num(turns)})` : turns} + ${rad(al)}`)}이므로 ${eq(AL, rad(al))}이다.`, facts: { value: `${jn(r)}-2*(${turns})` } });
      }
      const axis = d.int(0, 3) === 0, q = axis ? d.pick([1, 2]) : d.pick([3, 4, 5, 6, 7, 8]), p = d.until(() => d.int(-5 * q, 9 * q), (v) => gcd(Math.abs(v), q) === 1 && Math.abs(v) > 2 * q);
      const k = quadOf(Math.PI * p / q), opts = QN.concat(['어느 사분면의 각도 아니다']), ans = k === 0 ? 4 : k - 1;
      const al = Q((((p % (2 * q)) + 2 * q) % (2 * q)), q);
      return pickFixed(`${rad(Q(p, q))}는 제몇 사분면의 각인가?`, opts, ans, {
        explain: `${rad(Q(p, q))}의 동경은 ${al.p === 0 ? '0' : rad(al)}의 동경과 같다. ${k === 0 ? '이 동경은 좌표축 위에 있으므로 어느 사분면의 각도 아니다.' : `따라서 ${QN[k - 1]}의 각이다.`}` });
    }, { count: 2, standard: S1 }),
    T('rad-mixed', '육십분법·호도법이 섞인 각들의 사분면과 동경 견주기', '①13', (d, n) => {
      // 각 하나: 육십분법 또는 호도법(15°의 배수, 좌표축 위가 아닌 것)으로 적는다.
      const make = (quad, onAxis) => { const base = onAxis ? 90 * d.int(0, 3) : 90 * (quad - 1) + 15 * d.int(1, 5), dg = base + 360 * d.int(-2, 3); return dg; };
      const show = (dg) => (d.bool() || dg % 15 !== 0 ? deg(dg) : rad(Q(dg, 180)));
      const sameRay = (a, b) => (((a - b) % 360) + 360) % 360 === 0;
      if (n === 1) {
        const target = make(d.int(1, 4)), base = ((target % 360) + 360) % 360, list = [base + 360 * d.pick([-2, -1, 1, 2, 3])];
        const fakes = [180 - base, 360 - base, base + 180, base + 90, base - 90, base + 30, base - 30, 180 + base + 360].map((v) => v + 360 * d.int(-1, 2));
        for (const f of d.shuffle(fakes)) if (list.length < 5 && !sameRay(f, base) && !list.some((u) => sameRay(u, f)) && f !== 0) list.push(f);
        if (list.length < 5) return null;
        const rows = d.shuffle(list), ans = rows.findIndex((v) => sameRay(v, base)), shownRows = rows.map((v) => rad(Q(v, 180)));
        return C(`다음 각을 나타내는 동경 가운데 ${deg(target)}를 나타내는 동경과 일치하는 것은?`, shownRows, ans, {
          explain: `${deg(target)}의 동경은 ${deg(base)}의 동경과 같고, ${rad(Q(rows[ans], 180))} = ${deg(rows[ans])} = 360° × ${(rows[ans] - base) / 360 < 0 ? `(${num((rows[ans] - base) / 360)})` : (rows[ans] - base) / 360} + ${base}°이다.`,
          facts: { truth: rows.map((v) => sameRay(v, base)), want: true } });
      }
      if (n === 0) {
        const qd = d.int(1, 4), other = d.pick([1, 2, 3, 4].filter((v) => v !== qd)), list = [];
        while (list.length < 4) { const v = make(qd); if (!list.some((u) => sameRay(u, v))) list.push(v); }
        const odd = make(other), rows = d.shuffle(list.concat([odd])), ans = rows.indexOf(odd);
        return C('다음 각을 나타내는 동경이 위치한 사분면이 다른 하나는?', rows.map(show), ans, {
          explain: `${rows.map((v) => `${deg(v)}는 ${QN[quadOfDeg(v) - 1]}`).join(', ')}의 각이다.`, facts: { truth: rows.map((v) => v === odd), want: true } });
      }
      const qd = d.int(1, 4), right = make(qd), list = [right];
      list.push(make(0, true) || 180 + 360 * d.int(1, 2));
      while (list.length < 5) { const v = make(d.pick([1, 2, 3, 4].filter((t) => t !== qd))); if (!list.some((u) => sameRay(u, v))) list.push(v); }
      if (list.some((v) => v === 0)) return null;
      const rows = d.shuffle(list), ans = rows.indexOf(right);
      return C(`다음 중 ${QN[qd - 1]}의 각은?`, rows.map(show), ans, {
        explain: `${rows.map((v) => { const k = quadOfDeg(v); return `${deg(v)}는 ${k ? QN[k - 1] + '의 각' : '어느 사분면의 각도 아니다'}`; }).join(', ')}.`, facts: { truth: rows.map((v) => v === right), want: true } });
    }, { count: 3, standard: S1 }),
    T('rad-one', '1라디안의 뜻 — 중심각의 크기가 몇 라디안인 부채꼴이 몇 개 들어가는가', '①14', (d) => {
      const t = d.pick([Q(1, 2), Q(2, 3), Q(3, 4), Q(1), Q(3, 2), Q(2), Q(5, 2), Q(3), Q(2, 5), Q(4, 5), Q(5, 4)]), R = d.int(2, 9);
      const cnt = Math.floor(6.28 * t.q / t.p + 1e-9);
      return N(`반지름의 길이가 ${R}인 원 모양의 종이를 잘라서 중심각의 크기가 ${num(t)}인 부채꼴을 최대 몇 개 만들 수 있는가? (단, ${nb('π = 3.14')}로 계산한다.)`, cnt, {
        explain: `한 바퀴는 ${nb('2π = 6.28')}(라디안)이다. ${nb(`6.28 ÷ ${num(t)}`)}의 정수 부분이 ${cnt}이므로 최대 ${cnt}개 만들 수 있다.`,
        facts: { value: `(628*${t.q}-(628*${t.q})%(100*${t.p}))/(100*${t.p})` } });
    }, { standard: S1 })
  ];
  function josaN(n, pair) { return B.kit.josa(n, pair); }

  // ════════════════════════════════════════════════════════════════
  // 부채꼴의 호의 길이와 넓이(호도법)
  // ════════════════════════════════════════════════════════════════
  const notInt = (x) => !isInt(x);
  // 반원(지름 AB, 중심 O) 위의 점 P — 그림
  function semiFig(tDeg, pName, label) {
    const b = Board(), c = [0, 0], R = 84, A = at(c, R, 180), Bp = at(c, R, 0), P = at(c, R, tDeg);
    b.arc(c, R, 0, 180).seg(A, Bp).seg(c, P);
    for (const p of [A, Bp, P, c]) b.dot(p);
    b.name(A, 'A', 200).name(Bp, 'B', -20).name(P, pName, tDeg).name(c, 'O', 270);
    return b.svg(label);
  }
  const sector = [
    T('sector-forward', '반지름과 중심각으로 부채꼴의 호의 길이·넓이', '①15', (d, n) => {
      const r = n === 1 ? d.int(2, 8) : d.int(2, 12);
      if (n === 2) {
        const t = d.int(1, 3);
        if ((r * r * t) % 2 !== 0) return null;
        return M(`반지름의 길이가 ${r}, 중심각의 크기가 ${t}인 부채꼴의 호의 길이와 넓이를 각각 구하시오.`, [{ label: '호의 길이', answer: r * t }, { label: '넓이', answer: r * r * t / 2 }], {
          explain: `${nb(`${Lv} = ${Rv}${TH} = ${r} × ${t} = ${r * t}`)}, ${nb(`${Sv} = ${frac(1, 2)}${Rv}${sup(2)}${TH} = ${frac(1, 2)} × ${r}${sup(2)} × ${t} = ${r * r * t / 2}`)}이다.`,
          facts: { calc: [[`${r}*${t}`, 0], [`${r}*${r}*${t}/2`, 1]] } });
      }
      const q = d.pick([3, 4, 5, 6, 8, 9, 10, 12]), p = d.until(() => d.int(1, 2 * q - 1), (v) => gcd(v, q) === 1), th = Q(p, q);
      const val = n === 0 ? qmul(Q(r), th) : qmul(Q(r * r, 2), th);
      if (!notInt(val)) return null;
      return piAns(`반지름의 길이가 ${r}, 중심각의 크기가 ${rad(th)}인 부채꼴의 ${n === 0 ? '호의 길이' : '넓이'}는 □π이다. □ 안에 알맞은 수는?`, val.p, val.q, {
        signed: false, explain: n === 0 ? `${nb(`${Lv} = ${Rv}${TH} = ${r} × ${rad(th)} = ${rad(val)}`)}이다.` : `${nb(`${Sv} = ${frac(1, 2)}${Rv}${sup(2)}${TH} = ${frac(1, 2)} × ${r}${sup(2)} × ${rad(th)} = ${rad(val)}`)}이다.`,
        facts: { value: n === 0 ? `${r}*${p}/${q}` : `${r}*${r}*${p}/(2*${q})` } });
    }, { count: 3, standard: S1 }),
    T('sector-reverse', '부채꼴에서 두 값을 알 때 나머지 값 구하기', '①16', (d, n) => {
      const q = d.pick([3, 4, 5, 6, 8, 9, 10, 12]), p = d.until(() => d.int(1, 2 * q - 1), (v) => gcd(v, q) === 1), th = Q(p, q), r = d.int(2, 12);
      const l = qmul(Q(r), th), S = qmul(Q(r * r, 2), th);
      if (n === 0) {
        if (!notInt(l)) return null;
        return piAns(`중심각의 크기가 ${rad(th)}이고 넓이가 ${rad(S)}인 부채꼴의 호의 길이는 □π이다. □ 안에 알맞은 수는?`, l.p, l.q, { signed: false,
          explain: `반지름의 길이를 ${jh(Rv, '이라/라')} 하면 ${nb(`${frac(1, 2)}${Rv}${sup(2)} × ${rad(th)} = ${rad(S)}`)}에서 ${eq(Rv, r)}이다. 호의 길이는 ${nb(`${r} × ${rad(th)} = ${rad(l)}`)}이다.`,
          facts: { value: `${r}*${p}/${q}` } });
      }
      if (n === 1) {
        if (!notInt(S)) return null;
        return piAns(`중심각의 크기가 ${rad(th)}이고 호의 길이가 ${rad(l)}인 부채꼴의 넓이는 □π이다. □ 안에 알맞은 수는?`, S.p, S.q, { signed: false,
          explain: `반지름의 길이를 ${jh(Rv, '이라/라')} 하면 ${nb(`${Rv} × ${rad(th)} = ${rad(l)}`)}에서 ${eq(Rv, r)}이다. 넓이는 ${nb(`${frac(1, 2)} × ${r} × ${rad(l)} = ${rad(S)}`)}이다.`,
          facts: { value: `${r}*${r}*${p}/(2*${q})` } });
      }
      return piAns(`호의 길이가 ${rad(l)}이고 넓이가 ${rad(S)}인 부채꼴의 중심각의 크기는 □π이다. □ 안에 알맞은 수는?`, th.p, th.q, { signed: false,
        explain: `반지름의 길이를 ${jh(Rv, '이라/라')} 하면 ${nb(`${frac(1, 2)}${Rv} × ${rad(l)} = ${rad(S)}`)}에서 ${eq(Rv, r)}이다. ${nb(`${r}${TH} = ${rad(l)}`)}에서 ${eq(TH, rad(th))}이다.`,
        facts: { value: `${p}/${q}` } });
    }, { count: 3, standard: S1 }),
    T('sector-semi', '반원 위의 점 — 호의 길이와 다른 부채꼴의 넓이로 반지름', '①17 심1', (d, n) => {
      if (n === 0) {
        const r = 2 * d.int(1, 6), k = r * r / 2;
        const figure = semiFig(180 / Math.PI, 'P', '중심이 O인 반원. 지름의 양 끝 A, B와 호 위의 점 P. 선분 OP가 그어져 있다.');
        return N(`그림과 같이 중심이 O이고 반지름의 길이가 ${Rv}인 반원에서 호 BP의 길이가 ${Rv}이다. 부채꼴 AOP의 넓이가 ${nb(`${k}(π ${MINUS} 1)`)}일 때, ${Rv}의 값은?`, r, { figure,
          explain: `호 BP의 길이가 ${Rv}이므로 호 AP의 길이는 ${nb(`π${Rv} ${MINUS} ${Rv} = ${Rv}(π ${MINUS} 1)`)}이다. ${nb(`${frac(1, 2)} × ${Rv} × ${Rv}(π ${MINUS} 1) = ${k}(π ${MINUS} 1)`)}에서 ${nb(`${Rv}${sup(2)} = ${2 * k}`)}, ${eq(Rv, r)}이다.`,
          facts: { value: `${k}*2/${r}` } });
      }
      const r = d.int(3, 12), a = d.int(1, r - 1), b2 = r * r - a * r;
      if (b2 % 2 !== 0) return null;
      const bb = b2 / 2;
      const figure = semiFig(180 - 180 * a / r, 'C', '선분 AB를 지름으로 하는 반원과 호 위의 점 C, 선분 AB의 중점 O. 선분 OC가 그어져 있다.');
      return N(`그림과 같이 선분 AB를 지름으로 하는 반원의 호 AB 위에 점 C가 있다. 선분 AB의 중점을 O라 할 때, 호 AC의 길이가 ${rad(Q(a))}이고 부채꼴 OBC의 넓이가 ${rad(Q(bb))}이다. 선분 OA의 길이는?`, r, { figure,
        explain: `${nb(`OA = ${Rv}`)}, ${nb(`∠COA = ${TH}`)}라 하면 ${nb(`${Rv}${TH} = ${rad(Q(a))}`)}이다. 부채꼴 OBC의 넓이는 ${nb(`${frac(1, 2)}${Rv}${sup(2)}(π ${MINUS} ${TH}) = ${frac('π', 2)}(${Rv}${sup(2)} ${MINUS} ${a === 1 ? '' : a}${Rv}) = ${rad(Q(bb))}`)}이므로 ${nb(`${Rv}${sup(2)} ${MINUS} ${a === 1 ? '' : a}${Rv} ${MINUS} ${2 * bb} = 0`)}, ${eq(Rv, r)}이다.`,
        facts: { value: `(${a}+${2 * r - a})/2` } });
    }, { count: 2, standard: S1 }),
    T('sector-wiper-angle', '와이퍼가 닦은 넓이 — 회전한 각을 알 때', '①18', (d) => {
      const L = 5 * d.int(6, 12), l = 5 * d.int(2, L / 5 - 1), q = d.pick([3, 4, 5, 6]), p = d.until(() => d.int(1, q - 1), (v) => gcd(v, q) === 1);
      const inner = L - l, S = Q(p * (L * L - inner * inner), 2 * q);
      if (!isInt(S)) return null;
      return qAns(`어느 자동차의 와이퍼의 길이는 ${L} cm이고, 와이퍼의 바깥쪽 끝에 붙은 고무판의 길이는 ${l} cm이다. 이 와이퍼가 ${rad(Q(p, q))}만큼 부채꼴 모양으로 회전하였을 때, 고무판이 닦은 부분의 넓이는 □π cm²이다. □ 안에 알맞은 수는? (단, 유리창은 평평한 평면이다.)`, S, {
        unit: 'π cm²', explain: `닦은 부분은 반지름이 ${L}인 부채꼴에서 반지름이 ${L} ${MINUS} ${l} = ${inner}인 부채꼴을 뺀 것이므로 넓이는 ${nb(`${frac(1, 2)} × ${L}${sup(2)} × ${rad(Q(p, q))} ${MINUS} ${frac(1, 2)} × ${inner}${sup(2)} × ${rad(Q(p, q))} = ${rad(S)}`)} (cm²)이다.`,
        facts: { value: `${p}*(${L}*${L}-(${L}-${l})*(${L}-${l}))/(2*${q})` } });
    }, { standard: S1 }),
    T('sector-wiper-arc', '와이퍼가 닦은 넓이 — 끝이 움직인 길이를 알 때', '①18', (d) => {
      const L = 5 * d.int(6, 14), l = 5 * d.int(2, L / 5 - 1), t = d.int(1, 3), s = L * t, inner = L - l, S = t * (L * L - inner * inner) / 2;
      if (!Number.isInteger(S) || S > 9999) return null;
      const b = Board(), c = [0, 0], R1 = 96, R2 = 96 * inner / L, a0 = 90 - (t * 57.3) / 2, a1 = 90 + (t * 57.3) / 2;
      b.fan(c, R1, a0, a1, TINT).fan(c, R2, a0, a1, WHITE).seg(c, at(c, R1, a1)).seg(c, at(c, R1, a0));
      b.arcDim(c, R1, a0, a1, `${s} cm`);
      const figure = b.svg(`와이퍼가 회전하며 그린 고리 모양의 부채꼴(색칠한 부분이 고무판이 닦은 부분). 와이퍼의 끝이 움직인 길이 ${s} cm.`);
      return N(`그림과 같이 어느 자동차의 와이퍼의 길이는 ${L} cm이고, 와이퍼의 바깥쪽 끝에 붙은 고무판의 길이는 ${l} cm이다. 이 와이퍼를 작동하였더니 와이퍼의 끝이 움직인 길이가 ${s} cm이었을 때, 고무판이 닦은 부분의 넓이는 몇 cm²인가? (단, 유리창은 평평한 평면이다.)`, S, {
        unit: 'cm²', figure,
        explain: `와이퍼가 회전한 각을 ${TH}라 하면 ${nb(`${L}${TH} = ${s}`)}에서 ${eq(TH, t)}이다. 넓이는 ${nb(`${frac(1, 2)} × ${L}${sup(2)} × ${t} ${MINUS} ${frac(1, 2)} × ${inner}${sup(2)} × ${t} = ${S}`)} (cm²)이다.`,
        facts: { value: `(${L}*${L}-(${L}-${l})*(${L}-${l}))*${s}/(2*${L})` } });
    }, { standard: S1 }),
    T('sector-cone-net', '원뿔의 전개도에서 옆면인 부채꼴의 중심각', '①19', (d) => {
      const l = d.int(3, 12), a = d.int(1, l - 1), th = Q(2 * a, l);
      if (isInt(th)) return null;
      return piAns(`밑면의 반지름의 길이가 ${a}이고 모선의 길이가 ${l}인 원뿔의 전개도에서 옆면인 부채꼴의 중심각의 크기는 □π이다. □ 안에 알맞은 수는?`, th.p, th.q, { signed: false,
        explain: `부채꼴의 호의 길이는 밑면인 원의 둘레 ${nb(`2π × ${a} = ${rad(Q(2 * a))}`)}와 같다. 중심각의 크기를 ${TH}라 하면 ${nb(`${l}${TH} = ${rad(Q(2 * a))}`)}에서 ${eq(TH, rad(th))}이다.`,
        facts: { value: `2*${a}/${l}` } });
    }, { standard: S1 }),
    T('sector-frustum', '원뿔대의 옆넓이를 부채꼴로 구하기', '①19', (d) => {
      const r1 = d.int(1, 6), r2 = d.int(r1 + 1, r1 + 5), s = d.int(2, 9), A = s * (r1 + r2);
      const cut = Q(s * r1, r2 - r1);
      return qAns(`두 밑면의 반지름의 길이가 각각 ${r1}, ${r2}이고 모선의 길이가 ${s}인 원뿔대의 옆면의 넓이는 □π이다. □ 안에 알맞은 수는?`, A, {
        unit: 'π', explain: `옆면을 펼치면 두 부채꼴의 차이다. 잘라 낸 원뿔의 모선의 길이를 ${Av}라 하면 호의 길이의 비에서 ${nb(`${Av} : (${Av} + ${s}) = ${r1} : ${r2}`)}, ${eq(Av, num(cut))}이다. 넓이는 ${nb(`${frac(1, 2)} × (${Av} + ${s}) × ${2 * r2}π ${MINUS} ${frac(1, 2)} × ${Av} × ${2 * r1}π = ${A}π`)}이다.`,
        facts: { value: `${s}*(${r1}+${r2})` } });
    }, { standard: S1 }),
    T('sector-max-area', '둘레의 길이가 일정한 부채꼴의 넓이가 가장 클 때', '①20', (d) => {
      const P = 4 * d.int(2, 9), r = P / 4, S = P * P / 16;
      return M(`둘레의 길이가 ${P}인 부채꼴 가운데 넓이가 가장 큰 것의 반지름의 길이, 중심각의 크기, 넓이를 각각 구하시오.`, [{ label: '반지름의 길이', answer: r }, { label: '중심각의 크기', answer: 2 }, { label: '넓이', answer: S }], {
        explain: `반지름의 길이를 ${Rv}, 호의 길이를 ${jh(Lv, '이라/라')} 하면 ${nb(`2${Rv} + ${Lv} = ${P}`)}이므로 넓이는 ${nb(`${frac(1, 2)}${Rv}(${P} ${MINUS} 2${Rv}) = ${MINUS}(${Rv} ${MINUS} ${r})${sup(2)} + ${S}`)}이다. ${eq(Rv, r)}일 때 넓이가 가장 크고 ${eq(Lv, 2 * r)}, 중심각은 ${nb(`${frac(Lv, Rv)} = 2`)}이다.`,
        facts: { calc: [[`${P}/4`, 0], [`(${P}/2)/(${P}/4)`, 1], [`${P}*${P}/16`, 2]] } });
    }, { standard: S1 }),
    T('sector-band', '중심각이 같은 두 부채꼴 사이의 넓이로 길이 구하기', '①22', (d) => {
      const q = d.pick([2, 3, 4, 6]), p = d.until(() => d.int(1, q - 1), (v) => gcd(v, q) === 1), th = Q(p, q), r = d.int(2, 8), R = d.int(r + 1, r + 6);
      const L1 = qmul(Q(R), th), L2 = qmul(Q(r), th), S = qmul(Q(R * R - r * r, 2), th), g = gcd(r, R);   // 비는 기약으로 적는다
      const b = Board(), c = [0, 0], RR = 100, rr = 100 * r / R, a0 = 90 - (180 * fl(th)) / 2, a1 = 90 + (180 * fl(th)) / 2;
      b.fan(c, RR, a0, a1, TINT).fan(c, rr, a0, a1, WHITE).seg(c, at(c, RR, a0)).seg(c, at(c, RR, a1));
      const A = at(c, RR, a1), Bp = at(c, RR, a0), Cp = at(c, rr, a1), Dp = at(c, rr, a0);
      for (const pp of [A, Bp, Cp, Dp, c]) b.dot(pp);
      b.name(A, 'A', a1 + 15).name(Bp, 'B', a0 - 15).name(Cp, 'C', a1 + 60).name(Dp, 'D', a0 - 60).name(c, 'O', 270);
      const figure = b.svg('중심이 O인 두 부채꼴 AOB, COD. 점 C는 선분 OA 위, 점 D는 선분 OB 위에 있고, 두 호 사이(색칠한 부분)를 칠했다.');
      return N(`그림과 같이 중심이 O이고 중심각의 크기가 같은 두 부채꼴 AOB, COD에서 두 점 C, D는 각각 선분 OA, OB 위에 있다. 호 AB의 길이가 ${rad(L1)}, 호 CD의 길이가 ${rad(L2)}이고 색칠한 부분의 넓이가 ${rad(S)}일 때, 선분 AC의 길이는?`, R - r, { figure,
        explain: `호의 길이는 반지름의 길이에 정비례하므로 ${nb(`OC : OA = ${r / g} : ${R / g}`)}이다. ${nb(`OA = ${R / g}${Kv}`)}, ${nb(`OC = ${r / g}${Kv}`)}라 하면 넓이는 ${nb(`${frac(1, 2)} × ${R / g}${Kv} × ${rad(L1)} ${MINUS} ${frac(1, 2)} × ${r / g}${Kv} × ${rad(L2)} = ${rad(S)}`)}에서 ${eq(Kv, g)}이다. 따라서 ${nb(`AC = ${R} ${MINUS} ${r} = ${R - r}`)}이다.`,
        facts: { value: `2*(${S.p}/${S.q})/(${L1.p}/${L1.q}+${L2.p}/${L2.q})` } });
    }, { standard: S1 })
  ];

  // ════════════════════════════════════════════════════════════════
  // 삼각함수의 뜻
  // ════════════════════════════════════════════════════════════════
  // 특수한 각(π/12 의 몇 배로 적은 각 가운데 π/6·π/4 의 배수): 계수 Q
  const specialAngle = (d, lo, hi, ok) => d.until(() => { const m = d.int(lo, hi); return Q(m, 12); }, (q) => (q.q === 1 || q.q === 2 || q.q === 3 || q.q === 4 || q.q === 6) && (!ok || ok(q)));
  // 각 θ(계수 Q)의 삼각함수 값(수)
  const tv = (f, q) => { const v = FV[f](Math.PI * fl(q)); return Math.abs(v) > 1e6 ? NaN : v; };
  // 부호가 정해진 식들(사분면에 따라)
  const fracH = (p, q) => num(Q(p, q));
  const sq = (v) => (v < 0 ? `(${num(v)})` : String(v)) + sup(2);                 // 3², (−4)²
  const def = [
    T('def-point', '동경 위의 점의 좌표로 삼각함수의 값 구하기', '①23', (d) => {
      const k = d.int(1, 4), { x, y, r } = tripleIn(d, k), sx = x < 0 ? -1 : 1;
      const tpl = `${sin(TH)} = ${frac('{0}', '{1}')},&nbsp; ${cos(TH)} = ${frac('{2}', '{3}')},<br>${tan(TH)} = ${frac('{4}', '{5}')}`;
      return inline(`원점 O와 점 ${jh(nb(`P(${num(x)}, ${num(y)})`), '을/를')} 지나는 동경 OP가 나타내는 한 각의 크기를 ${TH}라 할 때, ${sin(TH)}, ${cos(TH)}, ${tan(TH)}의 값을 각각 기약분수로 구하시오.`, tpl,
        [{ answer: y, signed: true }, { answer: r }, { answer: x, signed: true }, { answer: r }, { answer: y * sx, signed: true }, { answer: Math.abs(x) }], {
          shown: `${sin(TH)} = ${fracH(y, r)}, ${cos(TH)} = ${fracH(x, r)}, ${tan(TH)} = ${fracH(y, x)}`,
          explain: `${nb(`OP = ${rt(`${sq(x)} + ${sq(y)}`)} = ${r}`)}이므로 ${eq(sin(TH), fracH(y, r))}, ${eq(cos(TH), fracH(x, r))}, ${eq(tan(TH), fracH(y, x))}이다.`,
          facts: { calc: [[`${jn(y)}`, 0], [`${r}`, 1], [`${jn(x)}`, 2], [`${r}`, 3], [`${jn(y)}*${sx}`, 4], [`${Math.abs(x)}`, 5]] } });
    }, { standard: S2 }),
    T('def-special', '특수한 일반각의 삼각함수의 값', '①24', (d, n) => {
      if (n === 0) {
        const f = d.pick(['sin', 'cos', 'tan']), q = specialAngle(d, -24, 48, (v) => (fl(v) < 0 || fl(v) > 0.5) && Number.isFinite(tv(f, v)));
        const right = tv(f, q), g = f === 'sin' ? 'cos' : 'sin', ref = Q(((q.p % (2 * q.q)) + 2 * q.q) % (2 * q.q), q.q);
        const wrongs = [-right, tv(g, q), -tv(g, q), right ? 1 / right : 1, right ? -1 / right : -1, tv(f, qadd(q, Q(1, 2)))].concat(d.shuffle(SVALS));
        return pickV(d, `${eq(TH, rad(q))}일 때, ${TF[f](TH)}의 값은?`, right, wrongs.filter(Number.isFinite), {
          explain: `${ref.p === q.p && ref.q === q.q ? `각 ${rad(q)}를 나타내는 동경은` : `각 ${rad(q)}를 나타내는 동경은 ${jh(rad(ref), '을/를')} 나타내는 동경과 같고,`} 단위원 위의 점 ${jh(nb(`(${exact(Math.cos(Math.PI * fl(q)))}, ${exact(Math.sin(Math.PI * fl(q)))})`), '을/를')} 지나므로 ${eq(TF[f](fa(q)), exact(right))}이다.` });
      }
      const rows = [], fs = ['sin', 'cos', 'tan'];
      while (rows.length < 5) {
        const f = d.pick(fs), q = specialAngle(d, -18, 30, (v) => Number.isFinite(tv(f, v)) && Math.abs(tv(f, v)) > 1e-9 && !(fl(v) >= 0 && fl(v) <= 0.5));
        if (rows.some((r) => r.f === f && r.q.p === q.p && r.q.q === q.q)) continue;
        rows.push({ f, q, v: tv(f, q) });
      }
      const odd = d.int(0, 4), lines = rows.map((r, i) => ({ h: eq(TF[r.f](fa(r.q)), exact(i === odd ? -r.v : r.v)), ok: i !== odd }));
      return C('다음 중 삼각함수의 값이 옳지 않은 것은?', lines.map((l) => l.h), odd, {
        explain: `${rows.map((r) => eq(TF[r.f](fa(r.q)), exact(r.v))).join(', ')}이다.`, facts: { truth: lines.map((l) => l.ok), want: false } });
    }, { count: 2, standard: S2 }),
    T('def-circle-point', '반지름이 r인 원 위의 점의 좌표', '①24', (d) => {
      const r = 2 * d.int(1, 6), q = d.pick([Q(1, 3), Q(2, 3), Q(4, 3), Q(5, 3), Q(1, 6), Q(5, 6), Q(7, 6), Q(11, 6)]), useX = q.q === 3;
      const val = Math.round(r * (useX ? Math.cos(Math.PI * fl(q)) : Math.sin(Math.PI * fl(q))));
      return N(`중심이 원점 O이고 반지름의 길이가 ${r}인 원 위의 점 ${nb(`P(${Av}, ${Bv})`)}에 대하여 동경 OP가 나타내는 한 각의 크기가 ${rad(q)}일 때, ${useX ? Av : Bv}의 값은?`, val, { signed: true,
        explain: `${eq(useX ? Av : Bv, `${r}${useX ? cos(rad(q)) : sin(rad(q))}`)} = ${r} × ${val < 0 ? `(${exact(val / r)})` : exact(val / r)} = ${num(val)}이다.`,
        facts: { value: `${r}*${val < 0 ? '(-1)' : '1'}/2` } });
    }, { standard: S2 }),
    T('def-sign', '각의 크기로 삼각함수의 값의 부호 정하기', '①25', (d) => {
      const useDeg = d.bool();
      let k, h;
      if (useDeg) { const dg = d.until(() => d.int(-700, 900), (v) => v % 90 !== 0 && v % 10 === 0 && v % 30 !== 0 && v % 45 !== 0); k = quadOfDeg(dg); h = deg(dg); }
      else { const q = d.until(() => Q(d.int(-30, 40), d.pick([5, 7, 9, 11])), (v) => !isInt(v) && v.q > 2 && quadOf(Math.PI * fl(v)) > 0 && Math.abs(fl(v)) > 0.5); k = quadOf(Math.PI * fl(q)); h = rad(q); }
      const sg = (s) => (s > 0 ? '+' : MINUS), triple = (kk) => [SGN.sin[kk], SGN.cos[kk], SGN.tan[kk]].map(sg).join(', ');
      const opts = [1, 2, 3, 4].map(triple).concat([[1, 1, -1].map(sg).join(', ')]);
      return pickFixed(`${eq(TH, h)}일 때, ${sin(TH)}, ${cos(TH)}, ${tan(TH)}의 값의 부호를 차례로 나타낸 것은?`, opts, k - 1, {
        explain: `${eq(TH, h)}는 ${QN[k - 1]}의 각이다. 동경 위의 점의 ${X}좌표는 ${SGN.cos[k] > 0 ? '양수' : '음수'}, ${Y}좌표는 ${SGN.sin[k] > 0 ? '양수' : '음수'}이므로 부호는 차례로 ${triple(k)}이다.` });
    }, { standard: S2 }),
    T('def-quadrant', '삼각함수의 값의 부호로 각의 사분면 정하기', '①26', (d, n) => {
      const sg = (f, k) => SGN[f][k], cmp = (s) => (s > 0 ? GT : LT);
      if (n === 0) {
        const k = d.int(1, 4), [f, g] = d.shuffle(['sin', 'cos', 'tan']).slice(0, 2);
        const fits = [1, 2, 3, 4].filter((kk) => sg(f, kk) === sg(f, k) && sg(g, kk) === sg(g, k));
        if (fits.length !== 1) return null;
        return pickFixed(`${nb(`${TF[f](TH)} ${cmp(sg(f, k))} 0`)}, ${nb(`${TF[g](TH)} ${cmp(sg(g, k))} 0`)}을 만족시키는 각 ${TH}는 제몇 사분면의 각인가?`, QN, k - 1, {
          explain: `${TF[f](TH)}의 부호로 ${[1, 2, 3, 4].filter((kk) => sg(f, kk) === sg(f, k)).map((kk) => QN[kk - 1]).join(' 또는 ')}, ${TF[g](TH)}의 부호로 ${[1, 2, 3, 4].filter((kk) => sg(g, kk) === sg(g, k)).map((kk) => QN[kk - 1]).join(' 또는 ')}의 각이다. 둘 다인 것은 ${QN[k - 1]}이다.` });
      }
      const [f, g] = d.shuffle(['sin', 'cos', 'tan']).slice(0, 2), s = d.pick([1, -1]), fitsP = [1, 2, 3, 4].filter((kk) => sg(f, kk) * sg(g, kk) === s);
      if (n === 1) {
        const pairs = [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]], tx2 = (p) => `${QN[p[0] - 1]} 또는 ${QN[p[1] - 1]}`;
        const right = pairs.findIndex((p) => p[0] === fitsP[0] && p[1] === fitsP[1]);
        return pickH(d, `${nb(`${TF[f](TH)}${TF[g](TH)} ${cmp(s)} 0`)}을 만족시키는 각 ${TH}는 제몇 사분면의 각인가?`, tx2(pairs[right]), pairs.filter((_, i) => i !== right).map(tx2), {
          explain: `두 값의 곱이 ${s > 0 ? '양수이면 부호가 같고' : '음수이면 부호가 다르고'}, 그런 사분면은 ${tx2(fitsP)}이다.` });
      }
      const h = d.pick(['sin', 'cos', 'tan']), k = d.pick(fitsP), t = sg(h, k), fits = fitsP.filter((kk) => sg(h, kk) === t);
      if (fits.length !== 1) return null;
      return pickFixed(`${nb(`${TF[f](TH)}${TF[g](TH)} ${cmp(s)} 0`)}, ${nb(`${TF[h](TH)} ${cmp(t)} 0`)}을 만족시키는 각 ${TH}는 제몇 사분면의 각인가?`, QN, k - 1, {
        explain: `${nb(`${TF[f](TH)}${TF[g](TH)} ${cmp(s)} 0`)}이면 ${fitsP.map((kk) => QN[kk - 1]).join(' 또는 ')}의 각이고, 그 가운데 ${nb(`${TF[h](TH)} ${cmp(t)} 0`)}인 것은 ${QN[k - 1]}이다.` });
    }, { count: 3, standard: S2 }),
    T('def-abs', '사분면을 정해 절댓값·근호가 든 식 간단히 하기', '①27', (d, n) => {
      const k = d.int(1, 4), val = { sin: SGN.sin[k], cos: SGN.cos[k], tan: SGN.tan[k] };
      // 부호가 정해진 식: { h 글, v 계수 [sin, cos, tan], s 부호, f 함수 이름(하나짜리) }
      const P = ['sin', 'cos', 'tan'].map((f, j) => ({ h: TF[f](TH), v: [0, 1, 2].map((i) => (i === j ? 1 : 0)), s: val[f], f }));
      const two = [[[1, 1, 0], `${sin(TH)} + ${cos(TH)}`], [[1, -1, 0], `${sin(TH)} ${MINUS} ${cos(TH)}`], [[1, 0, -1], `${sin(TH)} ${MINUS} ${tan(TH)}`], [[0, 1, -1], `${cos(TH)} ${MINUS} ${tan(TH)}`]];
      for (const [v, h] of two) { const ss = v.map((c, i) => c * [val.sin, val.cos, val.tan][i]).filter((x) => x !== 0); if (ss.every((x) => x > 0) || ss.every((x) => x < 0)) P.push({ h, v, s: ss[0] > 0 ? 1 : -1, two: true }); }
      const twos = P.filter((p) => p.two);
      if (!twos.length) return null;
      const picks = [d.pick(twos)].concat(d.shuffle(P.filter((p) => !p.two)).slice(0, 2)), coef = [0, 0, 0], parts = [], told = [];
      picks.forEach((p, i) => {
        const c = i === 0 ? 1 : d.pick([1, -1]), useRoot = i > 0 && d.bool(), inner = p.two ? `(${p.h})` : p.h;
        const body = useRoot ? rt(p.two ? `(${p.h})${sup(2)}` : trig(p.f, TH, 2)) : `|${p.h}|`;
        parts.push((i === 0 ? '' : c > 0 ? ' + ' : ` ${MINUS} `) + body);
        p.v.forEach((x, j) => { coef[j] += c * p.s * x; });
        told.push(nb(`${body} = ${p.s > 0 ? inner : MINUS + inner}`));
      });
      const lc = (v) => { const names = [sin(TH), cos(TH), tan(TH)]; let out = ''; v.forEach((c, j) => { if (!c) return; const m = Math.abs(c) === 1 ? '' : Math.abs(c); out += (out ? (c > 0 ? ' + ' : ` ${MINUS} `) : c < 0 ? MINUS : '') + m + names[j]; }); return out || '0'; };
      const right = lc(coef), wrongs = [];
      for (let t = 0; t < 30; t += 1) { const w = coef.map((c) => c + d.pick([0, 0, 2, -2])); if (w.join() !== coef.join()) wrongs.push(lc(w)); }
      wrongs.push(lc(coef.map((c) => -c)), '0', `2${sin(TH)}`, `${MINUS}2${cos(TH)}`, `2${tan(TH)}`);
      const lo = [0, 0, 1, 2, 3][k], cond = n === 0 ? `${rad(Q(lo, 2))} ${LT} ${TH} ${LT} ${rad(Q(lo + 1, 2))}일 때, ` : null;
      let condText = cond;
      if (n === 1) {
        // 부호 조건 둘로 사분면을 준다: 곱 하나와 값 하나(또는 비 하나)
        const [f, g] = d.shuffle(['sin', 'cos', 'tan']).slice(0, 2), s = SGN[f][k] * SGN[g][k], fitsP = [1, 2, 3, 4].filter((kk) => SGN[f][kk] * SGN[g][kk] === s);
        const h = d.pick(['sin', 'cos', 'tan']), t = SGN[h][k];
        if (fitsP.filter((kk) => SGN[h][kk] === t).length !== 1) return null;
        condText = `${nb(`${TF[f](TH)}${TF[g](TH)} ${s > 0 ? GT : LT} 0`)}, ${nb(`${TF[h](TH)} ${t > 0 ? GT : LT} 0`)}일 때, `;
      }
      return pickH(d, `${condText}다음 식을 간단히 하면?`, right, wrongs, {
        figure: B.kit.mid.ex(parts.join('')),
        explain: `${TH}는 ${QN[k - 1]}의 각이므로 ${told.join(', ')}이다. 정리하면 ${right}이다.` });
    }, { count: 2, standard: S2 }),
    T('def-unknown-coord', '동경 위의 점의 좌표에 미지수가 있을 때 삼각함수의 값', '①28', (d, n) => {
      const k = d.int(1, 4), { x, y, r } = tripleIn(d, k);
      if (n === 0) {
        return qAns(`중심이 원점 O이고 반지름의 길이가 ${r}인 원 위의 점 ${nb(`P(${num(x)}, ${Av})`)}에 대하여 동경 OP가 나타내는 한 각의 크기를 ${TH}라 하자. ${TH}가 ${QN[k - 1]}의 각일 때, ${tan(TH)}의 값은?`, Q(y, x), { signed: true,
          explain: `${nb(`${sq(x)} + ${Av}${sup(2)} = ${r}${sup(2)}`)}에서 ${nb(`${Av}${sup(2)} = ${y * y}`)}이고, ${QN[k - 1]}에서 ${Y}좌표는 ${y > 0 ? '양수' : '음수'}이므로 ${eq(Av, num(y))}이다. 따라서 ${eq(tan(TH), `${frac(Av, num(x))} = ${fracH(y, x)}`)}이다.`,
          facts: { value: `${jn(y)}/${jn(x)}` } });
      }
      return qAns(`원점 O와 점 ${jh(nb(`P(${Av}, ${num(y)})`), '을/를')} 지나는 동경 OP가 나타내는 한 각의 크기를 ${TH}라 하자. ${eq(tan(TH), fracH(y, x))}일 때, ${cos(TH)}의 값은?`, Q(x, r), { signed: true,
        explain: `${nb(`${tan(TH)} = ${frac(num(y), Av)} = ${fracH(y, x)}`)}에서 ${eq(Av, num(x))}이다. ${nb(`OP = ${rt(`${sq(x)} + ${sq(y)}`)} = ${r}`)}이므로 ${eq(cos(TH), fracH(x, r))}이다.`,
        facts: { value: `${jn(x)}/${r}` } });
    }, { count: 2, standard: S2 }),
    T('def-unit-line', '단위원과 직선의 교점이 정하는 각', '①29', (d, n) => {
      const circle = { x: (t) => Math.cos(t), y: (t) => Math.sin(t) };
      if (n === 0) {
        const vert = d.bool(), aq = d.pick([Q(1, 6), Q(1, 4), Q(1, 3)]), a = Math.PI * fl(aq), k = vert ? Math.cos(a) : Math.sin(a);
        const other = vert ? qsub(Q(2), aq) : qsub(Q(1), aq), diff = qsub(other, aq);
        const P = [Math.cos(a), Math.sin(a)], Qp = [Math.cos(Math.PI * fl(other)), Math.sin(Math.PI * fl(other))];
        const figure = plot({ x: [-1.5, 1.5], y: [-1.4, 1.4], params: [circle], lines: [vert ? { x: k, said: '단위원과 만나는 직선' } : { y: k, said: '단위원과 만나는 직선' }], dots: [{ x: P[0], y: P[1], name: 'P', said: '단위원과 직선의 교점' }, { x: Qp[0], y: Qp[1], name: 'Q', said: '단위원과 직선의 교점' }],
          say: `중심이 원점이고 반지름의 길이가 1인 원과 직선 ${vert ? 'x' : 'y'} = ${stripH(exact(k))}.` });
        const rangeP = `${nb(`0 ${LT} ${AL} ${LT} ${rad(Q(1, 2))}`)}`, rangeQ = vert ? nb(`${rad(Q(3, 2))} ${LT} ${BE} ${LT} 2π`) : nb(`${rad(Q(1, 2))} ${LT} ${BE} ${LT} π`);
        const wrongs = [qadd(other, aq), qsub(Q(1), qmul(Q(2), aq)), aq, other, qsub(Q(2), qmul(Q(2), aq)), qsub(Q(1, 2), aq), qmul(Q(2), aq)].filter((w) => w.p > 0).map((w) => ({ h: rad(w), v: fl(w) }));
        return pickH(d, `그림과 같이 중심이 원점 O이고 반지름의 길이가 1인 원과 직선 ${jh(eq(vert ? X : Y, exact(k)), '이/가')} 두 점 P, Q에서 만난다. 동경 OP, OQ가 나타내는 각의 크기를 각각 ${AL}, ${BE}라 할 때, ${nb(`${BE} ${MINUS} ${AL}`)}의 값은? (단, ${rangeP}, ${rangeQ})`, { h: rad(diff), v: fl(diff) }, wrongs, {
          figure, explain: `${vert ? `${eq(cos(AL), exact(k))}` : `${eq(sin(AL), exact(k))}`}이므로 ${eq(AL, rad(aq))}, ${eq(BE, rad(other))}이다. 따라서 ${nb(`${BE} ${MINUS} ${AL} = ${rad(diff)}`)}이다.` });
      }
      const mq = d.pick([Q(1, 6), Q(1, 4), Q(1, 3), Q(2, 3), Q(3, 4), Q(5, 6)]), back = d.bool(), tq = back ? qadd(mq, Q(1)) : mq, t = Math.PI * fl(tq), m = Math.tan(Math.PI * fl(mq));
      const P = [Math.cos(t), Math.sin(t)], kq = quadOf(t), f = d.pick(['sin', 'cos']);
      const mh = Math.abs(m - 1) < 1e-9 ? '' : Math.abs(m + 1) < 1e-9 ? MINUS : exact(m);
      const figure = plot({ x: [-1.5, 1.5], y: [-1.4, 1.4], params: [circle], lines: [{ a: m, b: 0 }], dots: [{ x: P[0], y: P[1], said: `단위원과 직선의 교점(${QN[kq - 1]}) P` }], say: '중심이 원점이고 반지름의 길이가 1인 원.',
        texts: [{ x: P[0] + 0.3 * Math.cos(t + Math.PI / 4), y: P[1] + 0.3 * Math.sin(t + Math.PI / 4), t: 'P', side: 'm' }] });   // 이름은 원 밖, 직선과 45° 비낀 자리에(직선이 원점을 지나 바깥쪽이 막힌다)
      return pickV(d, `그림과 같이 원 ${nb(`${X}${sup(2)} + ${Y}${sup(2)} = 1`)}과 직선 ${eq(Y, mh + X)}의 두 교점 가운데 ${QN[kq - 1]}에 있는 점을 P라 하자. 동경 OP가 나타내는 한 각의 크기를 ${TH}라 할 때, ${TF[f](TH)}의 값은? (단, O는 원점이다.)`,
        FV[f](t), [-FV[f](t), f === 'sin' ? Math.cos(t) : Math.sin(t), f === 'sin' ? -Math.cos(t) : -Math.sin(t), m, -m, 0.5, -0.5, R3 / 2, -R3 / 2, R2 / 2, -R2 / 2], {
          figure, explain: `점 P의 좌표를 ${nb(`(${Av}, ${Bv})`)}라 하면 ${eq(Bv, `${mh}${Av}`)}, ${nb(`${Av}${sup(2)} + ${Bv}${sup(2)} = 1`)}이고 ${QN[kq - 1]}에 있으므로 ${nb(`P(${exact(P[0])}, ${exact(P[1])})`)}이다. 따라서 ${eq(TF[f](TH), exact(FV[f](t)))}이다.` });
    }, { count: 2, standard: S2 }),
    T('def-two-values', '한 삼각함수의 값만 알 때 다른 값은 둘이다', '①30', (d) => {
      // 직각삼각형의 두 변 a(밑변), b(높이), 빗변 r: tan 의 크기 b/a, sin 의 크기 b/r, cos 의 크기 a/r
      const [a, b, r] = d.pick(TRIPLES), given = d.pick(['tan', 'cos', 'sin']), s = d.pick([1, -1]);
      let ask, vals, gv;
      if (given === 'tan') { gv = fracH(s * b, a); ask = 'sin'; vals = [Q(b, r), Q(-b, r)]; }
      else if (given === 'cos') { gv = fracH(s * a, r); ask = d.pick(['sin', 'tan']); vals = ask === 'sin' ? [Q(b, r), Q(-b, r)] : [Q(b, a), Q(-b, a)]; }
      else { gv = fracH(s * b, r); ask = d.pick(['cos', 'tan']); vals = ask === 'cos' ? [Q(a, r), Q(-a, r)] : [Q(b, a), Q(-b, a)]; }
      const both = `${qh(vals[0])} 또는 ${qh(vals[1])}`;
      const swap = ask === 'sin' ? [Q(a, r), Q(-a, r)] : ask === 'cos' ? [Q(b, r), Q(-b, r)] : [Q(a, b), Q(-a, b)];
      const wrongs = [qh(vals[0]), qh(vals[1]), `${qh(swap[0])} 또는 ${qh(swap[1])}`, qh(swap[0]), `${fracH(b, a)} 또는 ${fracH(-b, a)}`, qh(swap[1])];
      return pickH(d, `${nb(`0 ≤ ${TH} ${LT} 2π`)}이고 ${eq(TF[given](TH), gv)}일 때, ${TF[ask](TH)}의 값을 모두 구한 것은?`, both, wrongs, {
        explain: `${jh(eq(TF[given](TH), gv), '을/를')} 만족시키는 ${TH}는 ${given === 'tan' ? (s > 0 ? '제1사분면 또는 제3사분면' : '제2사분면 또는 제4사분면') : given === 'cos' ? (s > 0 ? '제1사분면 또는 제4사분면' : '제2사분면 또는 제3사분면') : (s > 0 ? '제1사분면 또는 제2사분면' : '제3사분면 또는 제4사분면')}의 각이다. 두 경우의 부호가 달라 ${TF[ask](TH)}의 값은 ${both}이다.` });
    }, { standard: S2 })
  ];

  // ════════════════════════════════════════════════════════════════
  // 삼각함수 사이의 관계
  // ════════════════════════════════════════════════════════════════
  const range4 = (k) => `${rad(Q(k - 1, 2))} ${LT} ${TH} ${LT} ${rad(Q(k, 2))}`;
  const where = (d, k) => (d.bool() ? `각 ${TH}가 ${QN[k - 1]}의 각이고` : `${nb(range4(k))}이고`);
  const rel = [
    T('rel-other', '사분면과 sinθ(cosθ)의 값으로 나머지 삼각함수의 값', '①31', (d, n) => {
      const k = d.int(1, 4), { x, y, r } = tripleIn(d, k), given = d.pick(['sin', 'cos']);
      const gv = given === 'sin' ? Q(y, r) : Q(x, r), ask = n === 0 ? (given === 'sin' ? 'cos' : 'sin') : 'tan', av = ask === 'sin' ? Q(y, r) : ask === 'cos' ? Q(x, r) : Q(y, x);
      return qAns(`${where(d, k)} ${eq(TF[given](TH), qh(gv))}일 때, ${TF[ask](TH)}의 값은?`, av, { signed: true,
        explain: `${nb(`${trig('sin', TH, 2)} + ${trig('cos', TH, 2)} = 1`)}에서 ${eq(trig(given === 'sin' ? 'cos' : 'sin', TH, 2), num(Q((given === 'sin' ? x : y) ** 2, r * r)))}이고, ${QN[k - 1]}에서 ${TF[given === 'sin' ? 'cos' : 'sin'](TH)}의 부호는 ${(given === 'sin' ? x : y) > 0 ? '+' : MINUS}이다. ${eq(sin(TH), qh(Q(y, r)))}, ${eq(cos(TH), qh(Q(x, r)))}이므로 ${eq(TF[ask](TH), qh(av))}이다.`,
        facts: { value: ask === 'tan' ? `${jn(y)}/${jn(x)}` : `${jn(ask === 'sin' ? y : x)}/${r}` } });
    }, { count: 2, standard: S2 }),
    T('rel-other-root', '사분면과 한 값으로 나머지 값(근호가 남는 값)', '①31 심2', (d, n) => {
      const k = d.int(1, 4), c = d.int(3, 7), p = d.until(() => d.int(1, c - 1), (v) => gcd(v, c) === 1 && sqParts(c * c - v * v)[1] > 1);
      const given = d.pick(['sin', 'cos']), sg = SGN[given][k], og = given === 'sin' ? 'cos' : 'sin', so = SGN[og][k];
      const gq = Q(sg * p, c), other = radFrac(so, 1, c * c - p * p, c), ask = n === 0 ? og : 'tan';
      // tan: (s√m/c)/(p/c) 꼴
      const tanV = given === 'sin' ? (sg * p / c) / other.v : other.v / (sg * p / c);
      const [kk, m] = sqParts(c * c - p * p), tanR = given === 'sin' ? radFrac(SGN.tan[k], p, m, kk * m) : radFrac(SGN.tan[k], kk, m, p);
      const right = ask === 'tan' ? tanR : other;
      if (Math.abs(right.v - (ask === 'tan' ? tanV : other.v)) > 1e-9) return null;
      const wrongs = [radFrac(-1 * Math.sign(right.v), 1, 1, 1)].concat([
        { h: right.h.startsWith(MINUS) ? right.h.slice(MINUS.length) : MINUS + right.h, v: -right.v },
        radFrac(so, 1, c * c - p * p, c * c), radFrac(-so, 1, c * c - p * p, c), radFrac(SGN.tan[k], p, m, kk * m * (given === 'sin' ? 1 : 1)), radFrac(-SGN.tan[k], kk, m, p), radFrac(SGN.tan[k], kk, m, p), radFrac(so, kk, m, p), radFrac(-SGN.tan[k], p, m, kk * m)]);
      const lead = n === 1 && given === 'sin' ? `${eq(sin(`(${MINUS}${TH})`), qh(Q(-sg * p, c)))}` : n === 1 ? `${eq(cos(`(π ${MINUS} ${TH})`), qh(Q(-sg * p, c)))}` : eq(TF[given](TH), qh(gq));
      return pickH(d, `${nb(range4(k))}이고 ${lead}일 때, ${TF[ask](TH)}의 값은?`, right, wrongs, {
        explain: `${n === 1 ? `${given === 'sin' ? `${nb(`${sin(`(${MINUS}${TH})`)} = ${MINUS}${sin(TH)}`)}` : `${nb(`${cos(`(π ${MINUS} ${TH})`)} = ${MINUS}${cos(TH)}`)}`}이므로 ${eq(TF[given](TH), qh(gq))}이다. ` : ''}${QN[k - 1]}에서 ${TF[og](TH)}의 부호는 ${so > 0 ? '+' : MINUS}이므로 ${eq(TF[og](TH), other.h)}이다.${ask === 'tan' ? ` 따라서 ${eq(tan(TH), right.h)}이다.` : ''}` });
    }, { count: 2, standard: S2 }),
    T('rel-from-tan', '사분면과 tanθ의 값으로 sinθ, cosθ', '①32', (d) => {
      const k = d.int(1, 4), { x, y, r } = tripleIn(d, k);
      const tpl = `${sin(TH)} = ${frac('{0}', '{1}')},&nbsp; ${cos(TH)} = ${frac('{2}', '{3}')}`;
      return inline(`${where(d, k)} ${eq(tan(TH), fracH(y, x))}일 때, ${sin(TH)}, ${cos(TH)}의 값을 각각 기약분수로 구하시오.`, tpl,
        [{ answer: y, signed: true }, { answer: r }, { answer: x, signed: true }, { answer: r }], {
          shown: `${sin(TH)} = ${fracH(y, r)}, ${cos(TH)} = ${fracH(x, r)}`,
          explain: `${nb(`${sin(TH)} = ${fracH(y, x)}${cos(TH)}`)}를 ${nb(`${trig('sin', TH, 2)} + ${trig('cos', TH, 2)} = 1`)}에 넣으면 ${eq(trig('cos', TH, 2), num(Q(x * x, r * r)))}이다. ${QN[k - 1]}에서 ${cos(TH)}의 부호는 ${x > 0 ? '+' : MINUS}이므로 ${eq(cos(TH), fracH(x, r))}, ${eq(sin(TH), fracH(y, r))}이다.`,
          facts: { calc: [[jn(y), 0], [String(r), 1], [jn(x), 2], [String(r), 3]] } });
    }, { standard: S2 }),
    T('rel-sc-product', 'sinθ ± cosθ의 값으로 sinθcosθ의 값', '①34', (d, n) => {
      const kq = d.until(() => Q(d.int(1, 6) * d.pick([1, -1]), d.int(2, 7)), (v) => Math.abs(fl(v)) < 1.4 && !isInt(v));
      const plus = n === 0 ? d.bool() : false, sc = plus ? qmul(qsub(qmul(kq, kq), Q(1)), Q(1, 2)) : qmul(qsub(Q(1), qmul(kq, kq)), Q(1, 2));
      const lhs = n === 0 ? `${sin(TH)} ${plus ? '+' : MINUS} ${cos(TH)}` : `${cos(`(${MINUS}${TH})`)} + ${sin(`(π + ${TH})`)}`;
      return qAns(`${eq(lhs, qh(kq))}일 때, ${sin(TH)}${cos(TH)}의 값은?`, sc, { signed: true,
        explain: `${n === 1 ? `${nb(`${cos(`(${MINUS}${TH})`)} = ${cos(TH)}`)}, ${nb(`${sin(`(π + ${TH})`)} = ${MINUS}${sin(TH)}`)}이므로 ${eq(`${cos(TH)} ${MINUS} ${sin(TH)}`, qh(kq))}이다. ` : ''}양변을 제곱하면 ${nb(`1 ${plus ? '+' : MINUS} 2${sin(TH)}${cos(TH)} = ${qh(qmul(kq, kq))}`)}이므로 ${eq(`${sin(TH)}${cos(TH)}`, qh(sc))}이다.`,
        facts: { value: plus ? `(${jn(kq)}*${jn(kq)}-1)/2` : `(1-${jn(kq)}*${jn(kq)})/2` } });
    }, { count: 2, standard: S2 }),
    T('rel-symmetric', 'sinθ ± cosθ의 값으로 여러 가지 식의 값', '①35', (d, n) => {
      if (n === 3) {
        const m = d.until(() => Q(d.int(2, 12) * d.pick([1, -1]), d.int(1, 3)), (v) => Math.abs(fl(v)) >= 2.0001), sc = qdiv(Q(1), m), minus = d.bool();
        const val = minus ? qsub(Q(1), qmul(Q(2), sc)) : qadd(Q(1), qmul(Q(2), sc));
        return qAns(`${eq(`${tan(TH)} + ${frac(1, tan(TH))}`, qh(m))}일 때, ${nb(`(${sin(TH)} ${minus ? MINUS : '+'} ${cos(TH)})${sup(2)}`)}의 값은?`, val, { signed: true,
          explain: `${nb(`${tan(TH)} + ${frac(1, tan(TH))} = ${frac(`${trig('sin', TH, 2)} + ${trig('cos', TH, 2)}`, `${sin(TH)}${cos(TH)}`)} = ${frac(1, `${sin(TH)}${cos(TH)}`)}`)}이므로 ${eq(`${sin(TH)}${cos(TH)}`, qh(sc))}이다. ${nb(`(${sin(TH)} ${minus ? MINUS : '+'} ${cos(TH)})${sup(2)} = 1 ${minus ? MINUS : '+'} 2${sin(TH)}${cos(TH)} = ${qh(val)}`)}이다.`,
          facts: { value: `1${minus ? '-' : '+'}2/${jn(m)}` } });
      }
      const k = d.until(() => Q(d.int(1, 6) * d.pick([1, -1]), d.int(2, 7)), (v) => Math.abs(fl(v)) < 1.4 && !isInt(v));
      if (n === 0) {
        const sc = qmul(qsub(Q(1), qmul(k, k)), Q(1, 2)), val = qdiv(qneg2(k), sc);
        return qAns(`${eq(`${sin(TH)} ${MINUS} ${cos(TH)}`, qh(k))}일 때, ${nb(`${frac(1, sin(TH))} ${MINUS} ${frac(1, cos(TH))}`)}의 값은?`, val, { signed: true,
          explain: `양변을 제곱하면 ${nb(`1 ${MINUS} 2${sin(TH)}${cos(TH)} = ${qh(qmul(k, k))}`)}, ${eq(`${sin(TH)}${cos(TH)}`, qh(sc))}이다. ${nb(`${frac(1, sin(TH))} ${MINUS} ${frac(1, cos(TH))} = ${frac(`${cos(TH)} ${MINUS} ${sin(TH)}`, `${sin(TH)}${cos(TH)}`)} = ${qh(val)}`)}이다.`,
          facts: { value: `(-1)*${jn(k)}/((1-${jn(k)}*${jn(k)})/2)` } });
      }
      if (n === 1) {
        const sc = qmul(qsub(qmul(k, k), Q(1)), Q(1, 2)), val = qdiv(Q(1), sc);
        return qAns(`${eq(`${sin(TH)} + ${cos(TH)}`, qh(k))}일 때, ${nb(`${tan(TH)} + ${frac(1, tan(TH))}`)}의 값은?`, val, { signed: true,
          explain: `양변을 제곱하면 ${nb(`1 + 2${sin(TH)}${cos(TH)} = ${qh(qmul(k, k))}`)}, ${eq(`${sin(TH)}${cos(TH)}`, qh(sc))}이다. ${nb(`${tan(TH)} + ${frac(1, tan(TH))} = ${frac(1, `${sin(TH)}${cos(TH)}`)} = ${qh(val)}`)}이다.`,
          facts: { value: `1/((${jn(k)}*${jn(k)}-1)/2)` } });
      }
      const minus = d.bool(), sc = minus ? qmul(qsub(Q(1), qmul(k, k)), Q(1, 2)) : qmul(qsub(qmul(k, k), Q(1)), Q(1, 2));
      const val = minus ? qmul(k, qadd(Q(1), sc)) : qmul(k, qsub(Q(1), sc)), op = minus ? MINUS : '+';
      return qAns(`${eq(`${sin(TH)} ${op} ${cos(TH)}`, qh(k))}일 때, ${nb(`${trig('sin', TH, 3)} ${op} ${trig('cos', TH, 3)}`)}의 값은?`, val, { signed: true,
        explain: `양변을 제곱하면 ${eq(`${sin(TH)}${cos(TH)}`, qh(sc))}이다. ${nb(`${trig('sin', TH, 3)} ${op} ${trig('cos', TH, 3)} = (${sin(TH)} ${op} ${cos(TH)})(1 ${minus ? '+' : MINUS} ${sin(TH)}${cos(TH)}) = ${qh(val)}`)}이다.`,
        facts: { value: minus ? `${jn(k)}*(1+(1-${jn(k)}*${jn(k)})/2)` : `${jn(k)}*(1-(${jn(k)}*${jn(k)}-1)/2)` } });
    }, { count: 4, standard: S2 }),
    T('rel-sum-from-diff', '제1사분면에서 sinθ − cosθ의 값으로 sinθ + cosθ의 값', '①35', (d) => {
      const q = d.int(2, 7), p = d.until(() => d.int(1, q - 1), (v) => gcd(v, q) === 1 && sqParts(2 * q * q - v * v)[1] > 1), s = d.pick([1, -1]), k = Q(s * p, q);
      const right = radFrac(1, 1, 2 * q * q - p * p, q), wrongs = [radFrac(-1, 1, 2 * q * q - p * p, q), radFrac(1, 1, q * q + p * p, q), radFrac(1, 1, q * q - p * p, q), radFrac(1, 1, 2 * q * q + p * p, q), radFrac(1, 1, 2 * q * q - p * p, q * q)];
      return pickH(d, `각 ${TH}가 제1사분면의 각이고 ${eq(`${sin(TH)} ${MINUS} ${cos(TH)}`, qh(k))}일 때, ${nb(`${sin(TH)} + ${cos(TH)}`)}의 값은?`, right, wrongs, {
        explain: `양변을 제곱하면 ${nb(`1 ${MINUS} 2${sin(TH)}${cos(TH)} = ${qh(qmul(k, k))}`)}이다. ${nb(`(${sin(TH)} + ${cos(TH)})${sup(2)} = 1 + 2${sin(TH)}${cos(TH)} = ${qh(Q(2 * q * q - p * p, q * q))}`)}이고 제1사분면에서 ${nb(`${sin(TH)} + ${cos(TH)} ${GT} 0`)}이므로 ${right.h}이다.` });
    }, { standard: S2 }),
    T('rel-roots-k', '두 근이 sinθ, cosθ인 이차방정식의 상수', '①36', (d) => {
      const a = d.int(2, 6), b = d.until(() => d.int(-8, 8), (v) => v !== 0 && v * v < 2 * a * a && Math.abs(v) !== a), kq = Q(b * b - a * a, 2 * a);
      return qAns(`${X}에 대한 이차방정식 ${nb(`${a}${X}${sup(2)} ${b < 0 ? MINUS : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}${X} + ${Kv} = 0`)}의 두 근이 ${sin(TH)}, ${cos(TH)}일 때, 상수 ${Kv}의 값은?`, kq, { signed: true,
        explain: `근과 계수의 관계에서 ${eq(`${sin(TH)} + ${cos(TH)}`, qh(Q(-b, a)))}, ${eq(`${sin(TH)}${cos(TH)}`, frac(Kv, a))}이다. 첫 식을 제곱하면 ${nb(`1 + 2 × ${frac(Kv, a)} = ${qh(Q(b * b, a * a))}`)}이므로 ${eq(Kv, qh(kq))}이다.`,
        facts: { value: `(${jn(b)}*${jn(b)}-${a}*${a})/(2*${a})` } });
    }, { standard: S2 }),
    T('rel-simplify', '삼각함수 사이의 관계로 식 간단히 하기', '①37', (d, n) => {
      const C2 = (f) => trig(f, TH, 2), C3 = (f) => trig(f, TH, 3);
      const list = n === 0 ? [[`${frac(1, tan(TH))} + ${frac(`1 ${MINUS} ${cos(TH)}`, sin(TH))}`, 'is'], [`${tan(TH)} + ${frac(`1 ${MINUS} ${sin(TH)}`, cos(TH))}`, 'ic']]
        : [[frac(C3('sin'), `${cos(TH)} ${MINUS} ${C3('cos')}`), 't'], [frac(C3('cos'), `${sin(TH)} ${MINUS} ${C3('sin')}`), 'it']];
      const [expr, key] = d.pick(list);
      const OPT = { is: frac(1, sin(TH)), ic: frac(1, cos(TH)), t: tan(TH), it: frac(1, tan(TH)), s: sin(TH), c: cos(TH), one: '1', s2: C2('sin'), c2: C2('cos') };
      const right = OPT[key], wrongs = Object.keys(OPT).filter((x) => x !== key).map((x) => OPT[x]);
      const why = { is: `${frac(cos(TH), sin(TH))} + ${frac(`1 ${MINUS} ${cos(TH)}`, sin(TH))} = ${frac(1, sin(TH))}`, ic: `${frac(sin(TH), cos(TH))} + ${frac(`1 ${MINUS} ${sin(TH)}`, cos(TH))} = ${frac(1, cos(TH))}`,
        t: `${frac(C3('sin'), `${cos(TH)}(1 ${MINUS} ${C2('cos')})`)} = ${frac(C3('sin'), `${cos(TH)}${C2('sin')}`)} = ${frac(sin(TH), cos(TH))}`, it: `${frac(C3('cos'), `${sin(TH)}(1 ${MINUS} ${C2('sin')})`)} = ${frac(C3('cos'), `${sin(TH)}${C2('cos')}`)} = ${frac(cos(TH), sin(TH))}` }[key];
      return pickH(d, '다음 식을 간단히 하면?', right, wrongs, { figure: B.kit.mid.ex(expr), explain: `${why}이므로 ${right}이다.` });
    }, { count: 2, standard: S2 }),
    T('rel-proof-blank', '삼각함수의 등식이 성립함을 보이는 과정의 빈칸', '①38', (d, n) => {
      const C2 = (f) => trig(f, TH, 2), s = sin(TH), c = cos(TH);
      let steps, blanks, alts;
      if (n === 0) {
        steps = [`${frac(c, `1 ${MINUS} ${s}`)} ${MINUS} ${frac(c, `1 + ${s}`)}`, `= ${frac(`${c}(1 + ${s}) ${MINUS} ${c}(㉠)`, `(1 ${MINUS} ${s})(1 + ${s})`)}`, `= ${frac(`2${s}${c}`, '㉡')} = ${frac(`2${s}`, '㉢')} = 2${tan(TH)}`];
        blanks = [`1 ${MINUS} ${s}`, C2('cos'), c]; alts = [[`1 + ${s}`, C2('cos'), c], [`1 ${MINUS} ${s}`, C2('sin'), c], [`1 ${MINUS} ${s}`, C2('cos'), s], [`1 + ${s}`, C2('sin'), s], [`1 ${MINUS} ${c}`, C2('cos'), c]];
      } else {
        steps = [`${frac(`1 + ${s}`, `1 ${MINUS} ${c}`)} + ${frac(`1 ${MINUS} ${s}`, `1 + ${c}`)} ${MINUS} ${frac(2, C2('sin'))}`, `= ${frac(`(1 + ${s})(1 + ${c}) + (1 ${MINUS} ${s})(1 ${MINUS} ${c})`, '㉠')} ${MINUS} ${frac(2, C2('sin'))}`, `= ${frac('㉡', C2('sin'))} = ${frac(`2${c}`, '㉢')} = ${frac(2, tan(TH))}`];
        blanks = [C2('sin'), `2${s}${c}`, s]; alts = [[C2('cos'), `2${s}${c}`, s], [C2('sin'), `2 + 2${s}${c}`, s], [C2('sin'), `2${s}${c}`, c], [C2('cos'), `2 + 2${s}${c}`, c], [C2('sin'), '2', s]];
      }
      const show = (b) => b.map((x, i) => `${'㉠㉡㉢'[i]}: ${x}`).join(', ');
      const wide = Math.max(...steps.map(B.kit.mid.emOf));
      return pickH(d, `다음은 등식이 성립함을 보이는 과정이다. ㉠, ㉡, ㉢에 알맞은 것을 차례로 적은 것은?`, show(blanks), alts.map(show), {
        figure: B.kit.lines(steps.map((h) => B.kit.mid.ex(h, wide - B.kit.mid.emOf(h)))), explain: `${n === 0 ? `분모 ${nb(`(1 ${MINUS} ${s})(1 + ${s}) = 1 ${MINUS} ${C2('sin')} = ${C2('cos')}`)}` : `분모 ${nb(`(1 ${MINUS} ${c})(1 + ${c}) = ${C2('sin')}`)}이고 분자를 정리하면 ${nb(`2 + 2${s}${c}`)}`}이므로 ${show(blanks)}이다.` });
    }, { count: 2, standard: S2 }),
    T('rel-frac-value', '분수 꼴의 삼각함수 식의 값으로 sin²θ(cos²θ) 구하기', '①39', (d) => {
      const kind = d.int(0, 2), p = d.int(2, 9), q = d.until(() => d.int(1, p - 1), (v) => gcd(v, p) === 1), s = sin(TH), c = cos(TH);
      const E = [`${frac(c, `1 ${MINUS} ${s}`)} ${MINUS} ${frac(s, c)}`, `${frac(c, `1 + ${s}`)} + ${frac(s, c)}`, `${frac(s, `1 ${MINUS} ${c}`)} ${MINUS} ${frac(c, s)}`][kind];
      const recip = kind === 2 ? 'sin' : 'cos', ask = kind === 2 ? 'cos' : 'sin', val = Q(p * p - q * q, p * p);
      return qAns(`${nb(`0 ${LT} ${TH} ${LT} ${rad(Q(1, 2))}`)}이고 ${eq(E, fracH(p, q))}일 때, ${trig(ask, TH, 2)}의 값은?`, val, {
        explain: `통분하여 정리하면 주어진 식은 ${frac(1, TF[recip](TH))}이므로 ${eq(TF[recip](TH), fracH(q, p))}이다. ${nb(`${trig(ask, TH, 2)} = 1 ${MINUS} ${trig(recip, TH, 2)} = ${qh(val)}`)}이다.`,
        facts: { value: `1-${q}*${q}/(${p}*${p})` } });
    }, { standard: S2 })
  ];
  function qneg2(x) { return Q(-x.p, x.q); }

  B.addUnit({ id: '11-1-3', grade: 11, semester: 1, no: 3, title: '삼각함수', version: 1, groups: [
    { id: 'angle', title: '일반각', standard: S1, types: angle },
    { id: 'radian', title: '호도법', standard: S1, types: radian },
    { id: 'sector', title: '부채꼴의 호의 길이와 넓이', standard: S1, types: sector },
    { id: 'def', title: '삼각함수의 뜻', standard: S2, types: def },
    { id: 'rel', title: '삼각함수 사이의 관계', standard: S2, types: rel },
    { id: 'sincos', title: '사인함수와 코사인함수의 그래프', standard: S2, types: [] },
    { id: 'prop', title: '삼각함수의 성질', standard: S2, types: [] },
    { id: 'tan', title: '탄젠트함수의 그래프', standard: S2, types: [] },
    { id: 'eq', title: '삼각함수를 포함한 방정식과 부등식', standard: S2, types: [] }
  ] });
})(typeof window !== 'undefined' ? window : globalThis);
