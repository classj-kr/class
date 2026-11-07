// 고등학교 기하 Ⅲ-2 벡터의 성분과 내적(11-4-7) — 단원 틀·단원 안의 도구와 앞쪽 묶음(위치벡터, 벡터의 성분).
// 수집해 둔 천재 T셀파 기하(전인태, 2022 개정)의 교과서·대단원 평가·소단원 평가·중단원 평가에서 뽑은 문제 꼴 목록
// (기본꼴_1: 위치벡터·성분 23꼴, 기본꼴_2: 내적·각·활용 43꼴, 심화 문서 없음)을 꼴마다 따져서 실었다.
// 꼴마다 「실음 / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-4-7/싣기_대조표.md 에 있다.
// (내적·두 벡터가 이루는 각·도형에서의 활용은 11-4-7b.js 에, 실력 문항은 11-4-7c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 공간①15 = 11-4-5 꼴 목록에서 넘겨받은 꼴.
// 영역은 기하(벡터). 성취기준은 12기하03-02(위치벡터, 벡터와 좌표의 대응), 12기하03-03(내적).
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(위치벡터·성분·크기와 각·도형), 묻는 것(벡터·성분·크기·내적·각·미지수·고르기), 이어 하는 일이 다르면
//    따로 싣는다. 같은 꼴에서 수만 바꾼 유형은 만들지 않았다. 차례(count)가 여럿인 유형은 차례마다 주는 것이나 계산의 얼개가 다르다.
//  - 11-4-6(벡터의 연산)과의 경계(조율 결정): 원점을 시점으로 한 위치벡터를 쓰는 꼴(내분점·무게중심, 직선 위의 점의 위치벡터 — 계수의 합 1,
//    벡터 등식으로 점의 자리·넓이의 비 읽기, 두 선분의 교점)과 성분으로 나타낸 벡터(크기·평행 조건·연산)는 이 단원에 싣는다.
//    고1 「도형의 방정식」과 같은 일이 섞인 꼴(①22 원의 넓이, ②40 원의 방정식, ②41 삼각형의 넓이)도 벡터로 하는 일이 새것이라 실었다(조율 결정).
//  - 교육과정 원문에 「~은 다루지 않는다」로 내용을 막은 줄은 이 단원에 없다(3-3 도형의 방정식에 대한 정도의 줄뿐이다).
//  - 답: 벡터를 정수 계수로 나타낸 답은 계수 칸(「[±][ ] a⃗ [±][ ] b⃗」, 1도 칸에 적는다), 성분은 coordAns, 근호는 「[ ]√[ ]」, 각은 수 칸(°).
//    계수나 성분이 분수인 벡터, 근호가 든 분수(cos 값), 답이 둘인 벡터는 고르기로 낸다. 분수 값 둘은 「k = □/□, l = □/□」(기약분수) 칸으로 받는다.
//    한 유형(한 차례)의 칸 모양은 씨앗이 바뀌어도 같다. 음수가 될 수 있는 답에는 모두 부호 단추를 단다.
//  - 원문의 「x + y의 값」「xy의 값」「m + n의 값」처럼 따로 구한 값을 뜻 없이 더하거나 곱하는 꼴은 값을 칸마다 묻는다.
//  - 참·거짓과 정답은 모두 코드가 셈한다(벡터는 정수 성분으로, 분수 계수는 유리수 셈으로).
//  - 검사 근거: 칸마다 글에 보이는 수로 다시 셈하는 식(facts.calc·value)을 단다. 글에 보이지 않는 수(내분 공식의 2, 1/2 따위)는 seal 이
//    facts.unseen 에 밝히고, 밝히기로 한 수(derived) 밖의 수가 나오면 오류를 낸다.
//
// 뺀 것과 까닭(11-4-7b.js, 11-4-7c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - ①21 좌표공간에서 대칭점으로 거리의 합이 최소인 점(교과서 활동): 11-4-5 공간좌표의 일이다(조율 결정).
//  - 증명을 쓰게 하는 꼴(②10 |a⃗ + b⃗|²의 전개 보이기, ②37 사면체의 두 모서리가 수직임 보이기, ①2의 공식 보이기): 원문에 빈칸·고르기 꼴이 없다.
//  - ②1의 변형 「힘이 한 일 W = F⃗ · s⃗」: 크기와 끼인각으로 내적을 구하는 ②1과 상황만 다르다.
//  - ②26 가운데 0°(같은 방향): 답 0을 검사가 다시 셈할 수 없고, 같은 일을 하는 다른 각이 있다.
//  - 대단원 평가 13(PQ⃗ ∥ PR⃗ — 11-4-6 몫), 22·23(수선의 발·구와 평면 — 11-4-8 몫)은 꼴 목록에 넣지 않았다.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, inline } = B.kit;
  const { MINUS, Q, qadd, qsub, qmul, gcd, tx, V, nb, tag, poly, polyAns, rt, sqParts, radAns } = B.kit.mid;
  const { vec, sub, jh, qAns, coordAns } = B.kit.hs;
  const { Board, awayFrom, dirOf } = B.kit.mgeo;
  const UNIT = '11-4-7', S2 = '12기하03-02', S3 = '12기하03-03';
  const HAN = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'];

  // ── 검사 근거 마무리(11-1-1a.js 와 같은 방법) ──
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  function seal(item) {
    const f = item.facts || {};
    if (f.calc) f.calc = f.calc.map(([t, i]) => [/\+0$/.test(t) ? t : '(' + t + ')+0', i]);
    if (f.value !== undefined && !/\+0$/.test(f.value)) f.value = '(' + f.value + ')+0';
    const derived = new Set((f.derived || []).map(Number).concat([0, 1])), shown = visibleNumbers(item), out = new Set(f.unseen || []);
    const exprs = (f.calc || []).map(([t]) => t).concat(f.value !== undefined ? [f.value] : [], (f.choose && f.choose.exprs) || [], f.pick ? [f.pick.expr] : []);
    for (const t of exprs) for (const n of String(t).match(/\d+(?:\.\d+)?/g) || []) {
      if (shown.has(n)) continue;
      if (!derived.has(Number(n)) && !out.has(Number(n))) throw new Error('검사 식의 수 ' + n + ' 이 글에도 밝힌 수에도 없다: ' + t);
      out.add(Number(n));
    }
    delete f.derived;
    if (out.size) f.unseen = [...out]; else delete f.unseen;
    item.facts = f;
    return item;
  }
  const retry = (make) => (d, n) => { for (let i = 0; i < 4000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const srcOf = (ref) => '수집본 기본 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: srcOf(ref), make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: srcOf(ref), make: retry(make) }, more || {});

  // ── 수와 글 ──
  const num = (n) => (n < 0 ? MINUS + Math.abs(n) : String(n));                 // 정수
  const jn = (n) => (n < 0 ? '(' + n + ')' : String(n));                         // 검사 식의 정수
  const par = (n) => (n < 0 ? '(' + num(n) + ')' : num(n));                      // 곱하는 자리의 음수는 괄호
  const tup = (c) => nb('(' + c.map((x) => (typeof x === 'number' ? num(x) : x)).join(', ') + ')');   // 성분·좌표 (3, −1, 2)
  const pt = (name, c) => nb(name + tup(c));                                    // 점 A(3, −1, 2)
  const va = vec('a'), vb = vec('b'), vc = vec('c'), vp = vec('p'), vg = vec('g'), vk = V('k'), vl = V('l'), vx = V('x'), vy = V('y');
  const VV = (h, c) => nb(h + ' = ' + tup(c));                                  // a⃗ = (3, −1)
  const E1 = vec('e') + sub(1), E2 = vec('e') + sub(2), E3 = vec('e') + sub(3);
  const dotv = (u, v) => u.reduce((s, x, i) => s + x * v[i], 0);
  const addv = (u, v) => u.map((x, i) => x + v[i]);
  const subv = (u, v) => u.map((x, i) => x - v[i]);
  const mulv = (k, u) => u.map((x) => k * x);
  const sq = (u) => dotv(u, u);
  const dotJ = (u, v) => u.map((x, i) => jn(x) + '*' + jn(v[i])).join('+');    // 검사 식의 내적
  const dotT = (u, v) => u.map((x, i) => par(x) + ' × ' + par(v[i])).join(' + ');  // 풀이 글의 내적
  const dt = (x, y) => x + ' · ' + y;                                           // 내적 a⃗ · b⃗
  const ab = (h) => '|' + h + '|';                                              // 크기 |a⃗|
  const ratio = (m, n, pair) => nb(m + ' : ' + B.kit.josa(n, pair));          // 「2 : 3으로」
  const NOTE1 = ' <span style="white-space:nowrap">(단, 1도 칸에 적는다.)</span>';
  const NOTEQ = ' <span style="white-space:nowrap">(단, 기약분수로 나타낸다.)</span>';
  const isSqFree = (n) => n >= 2 && sqParts(n)[0] === 1;
  const isSquare = (n) => n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;
  // √n 을 간단히 한 글(n 이 제곱수면 정수)
  const rad = (n) => { const [s, t] = sqParts(n); return t === 1 ? String(s) : (s === 1 ? '' : s) + rt(String(t)); };
  // 유리수 r(0 이상)의 제곱근을 간단히 한 글: √(p/q) = √(pq)/q
  function rootQ(r) {
    const [s, t] = sqParts(r.p * r.q), g = gcd(s, r.q), a = s / g, b = r.q / g;
    if (t === 1) return tx(Q(a, b));
    const top = (a === 1 ? '' : a) + rt(String(t));
    return b === 1 ? top : frac(top, b);
  }
  // 부호가 있는 값(cos 값): sign × √r
  const sRootQ = (sgn, r) => (sgn < 0 ? MINUS : '') + rootQ(r);

  // ── 답 칸 ──
  // 벡터를 정수 계수로 나타낸 답: 「[±][ ] a⃗ [±][ ] b⃗ …」(계수 1도 칸에 적는다). terms: [[계수, 벡터 글], …]
  const vecAns = (text, terms, o) => polyAns(text + NOTE1, terms, o);
  // 문자마다 값을 답하는 문항: 칸 앞에 「x =」를 적는다. pairs: [[이름 글, 값, 부호 단추?], …]
  const valsQ = (text, pairs, o) => M(text, pairs.map(([n, v, s]) => ({ answer: v, signed: Boolean(s), lead: n + ' =' })), Object.assign({}, o, { shown: pairs.map(([n, v]) => nb(n + ' = ' + num(v))).join(', ') }));
  // 분수 값 여럿: 「k = □/□, l = □/□」(기약분수로 적는다). pairs: [[이름 글, 정수가 아닌 유리수], …]
  function fracVals(text, pairs, o) {
    if (pairs.some(([, q]) => q.q === 1)) throw new Error('분수 값 칸에는 정수가 아닌 값만 둔다');
    const tpl = pairs.map(([n], i) => nb(n + ' = ' + frac('{' + (2 * i) + '}', '{' + (2 * i + 1) + '}'))).join(', ');
    const inputs = [];
    pairs.forEach(([, q]) => { inputs.push({ answer: q.p, signed: true }); inputs.push({ answer: q.q }); });
    return inline(text + NOTEQ, tpl, inputs, Object.assign({}, o, { shown: pairs.map(([n, q]) => nb(n + ' = ' + tx(q))).join(', ') }));
  }
  // 근호 답(계수 칸이 늘 있는 꼴): 「[ ]√[ ]」 — 계수 1도 칸에 적는다.
  function radFix(text, c, n, o) {
    if (!Number.isInteger(c) || c < 1 || !isSqFree(n)) throw new Error('근호 답: 계수는 자연수, 근호 안은 제곱인 수를 인수로 갖지 않는 2 이상의 수');
    return inline(text + NOTE1, '{0}' + rt('{1}'), [{ answer: c }, { answer: n }], Object.assign({}, o, { shown: (c === 1 ? '' : c) + rt(String(n)) }));
  }
  // 각의 크기(도)
  const degAns = (text, deg, o) => N(text, deg, Object.assign({ unit: '°' }, o));
  // 이름표(ㄱ. ㄴ. …)를 붙인 여러 줄
  const rowsFig = (list, tags) => lines(list.map((h, i) => tag((tags || HAN.map((x) => x + '.'))[i]) + ' ' + h));
  // 옳은(옳지 않은) 것 하나를 고르는 문항: rows = [글, 참인가]. 보기가 겹치거나 고를 것이 하나가 아니면 null(다시 만든다).
  function choose(d, text, rows, want, o) {
    const list = d.shuffle(rows), opt = o || {}, w = want !== false;
    if (new Set(list.map((r) => stripH(r[0]))).size !== list.length || list.filter((r) => r[1] === w).length !== 1) return null;
    return C(text, list.map((r) => r[0]), list.findIndex((r) => r[1] === w), Object.assign({}, opt, { facts: Object.assign({ truth: list.map((r) => r[1]), want: w }, opt.facts || {}) }));
  }
  // 계수(유리수)들로 벡터식 글: lc([[Q(1, 4), va], [Q(3, 4), vb]])
  const lc = (terms) => poly(terms);
  const sameQ = (u, v) => u.length === v.length && u.every((x, i) => x.p * v[i].q === v[i].p * x.q);
  // 내분 비 m : n 의 짝(서로소, m ≠ n)
  const RATIOS = [[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2], [1, 4], [4, 1], [3, 4], [4, 3], [2, 5], [5, 2], [1, 5], [5, 1], [3, 5], [5, 3]];

  // ── 그림 ──
  // 점 이름: 도형의 가운데에서 먼 쪽에 적는다.
  const nameOut = (g, p, label, center) => g.name(p, label, awayFrom(p, [center]));
  const centerOf = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
  const onSeg = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  // 점 p 에서 거리 r 만큼 떨어진 이름 자리 가운데 선분들에서 가장 먼 쪽(도). 이름 상자(가로 9, 세로 13)의 네 귀까지 잰다.
  const segGap = (c, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy, t = Math.max(0, Math.min(1, ((c[0] - a[0]) * dx + (c[1] - a[1]) * dy) / L2)); return Math.hypot(c[0] - a[0] - t * dx, c[1] - a[1] - t * dy); };
  const clearAngle = (p, segs, r) => { let best = 0, bv = -1; for (let ang = 0; ang < 360; ang += 15) { const c = [p[0] + r * Math.cos(ang * Math.PI / 180), p[1] - r * Math.sin(ang * Math.PI / 180)]; const v = Math.min(...[[-4.5, -6.5], [4.5, -6.5], [4.5, 6.5], [-4.5, 6.5], [0, 0]].flatMap(([x, y]) => segs.map(([a, b]) => segGap([c[0] + x, c[1] + y], a, b)))); if (v > bv) { bv = v; best = ang; } } return best; };

  B.kit.u1147 = {
    UNIT, S2, S3, HAN, stripH, seal, retry, T, H, num, jn, par, tup, pt, va, vb, vc, vp, vg, vk, vl, vx, vy, VV, E1, E2, E3, dotv, addv, subv, mulv, sq, dotJ, dotT, dt, ab, ratio,
    NOTE1, NOTEQ, isSqFree, isSquare, rad, rootQ, sRootQ, vecAns, valsQ, fracVals, radFix, degAns, rowsFig, choose, lc, sameQ, RATIOS, nameOut, centerOf, onSeg
  };

  // ── 단원 틀 ──
  B.addUnit({
    id: '11-4-7', grade: 11, semester: 4, no: 7, title: '벡터의 성분과 내적', version: 1,
    groups: [
      { id: 'pos', title: '위치벡터', standard: S2, types: [] },
      { id: 'comp', title: '벡터의 성분과 연산', standard: S2, types: [] },
      { id: 'dot', title: '벡터의 내적', standard: S3, types: [] },
      { id: 'dotc', title: '성분으로 나타낸 내적과 내적의 성질', standard: S3, types: [] },
      { id: 'angle', title: '두 벡터가 이루는 각과 수직', standard: S3, types: [] },
      { id: 'use', title: '도형에서 내적의 활용', standard: S3, types: [] }
    ]
  });

  // ── 위치벡터 ──
  B.addTypes(UNIT, 'pos', [
    T('pos-express', '위치벡터로 벡터 나타내기', '①1', (d) => {
      const VE = { AB: [-1, 1, 0], BA: [1, -1, 0], BC: [0, -1, 1], CB: [0, 1, -1], AC: [-1, 0, 1], CA: [1, 0, -1] };
      const names = d.shuffle(Object.keys(VE)).slice(0, 3);
      if (names.some((x, i) => names.some((y, j) => j > i && x === y[1] + y[0]))) return null;
      const ks = names.map((_, i) => (i === 0 ? 1 : d.pick([1, -1])) * d.int(1, 4));
      const res = [0, 1, 2].map((j) => names.reduce((s, nm, i) => s + ks[i] * VE[nm][j], 0));
      if (res.some((x) => x === 0) || ks.filter((k) => Math.abs(k) === 1).length > 1) return null;
      const expr = poly(names.map((nm, i) => [ks[i], vec(nm)])), terms = [[res[0], va], [res[1], vb], [res[2], vc]];
      const back = names.map((nm) => nb(vec(nm) + ' = ' + vec(nm[1].toLowerCase()) + ' ' + MINUS + ' ' + vec(nm[0].toLowerCase())));
      return vecAns(`세 점 A, B, C의 위치벡터를 각각 ${va}, ${vb}, ${jh(vc, '이라/라')} 할 때, 벡터 ${jh(expr, '을/를')} ${va}, ${vb}, ${jh(vc, '으로/로')} 나타내시오.`, terms, {
        explain: `${back.join(', ')}이므로 ${nb(expr + ' = ' + poly(terms))}이다.`,
        facts: { calc: [0, 1, 2].map((j) => [names.map((nm, i) => jn(ks[i]) + '*' + jn(VE[nm][j])).join('+'), j]) }
      });
    }),
    T('pos-divide', '선분의 내분점의 위치벡터', '①2', (d) => {
      const [m, n] = d.pick(RATIOS), s = m + n;
      const cand = [[Q(n, s), Q(m, s)], [Q(m, s), Q(n, s)], [Q(1, 2), Q(1, 2)], [Q(-n, m - n), Q(m, m - n)]];
      const rows = cand.map((c, i) => [lc([[c[0], va], [c[1], vb]]), i === 0]);
      return choose(d, `두 점 A, B의 위치벡터를 각각 ${va}, ${jh(vb, '이라/라')} 할 때, 선분 AB를 ${ratio(m, n, '으로/로')} 내분하는 점 P의 위치벡터를 ${va}, ${jh(vb, '으로/로')} 나타낸 것은?`, rows, true, {
        explain: `선분 AB를 ${ratio(m, n, '으로/로')} 내분하는 점의 위치벡터는 ${frac(poly([[m, vb], [n, va]]), s)} = ${rows.find((r) => r[1])[0]}이다.`
      });
    }),
    T('pos-back', '내분점이 주어질 때 끝점의 위치벡터', '①3', (d) => {
      const [m, n] = d.pick(RATIOS.filter(([x]) => x >= 2)), s = m + n;
      const right = [Q(-n, m), Q(s, m)];
      const cand = [right, [Q(-m, n), Q(s, n)], [Q(n, s), Q(m, s)], [Q(s, m), Q(-n, m)]];
      if (cand.some((c, i) => i > 0 && sameQ(c, right))) return null;
      const rows = cand.map((c, i) => [lc([[c[0], va], [c[1], vb]]), i === 0]);
      return choose(d, `세 점 A, B, P의 위치벡터를 각각 ${va}, ${vb}, ${jh(vp, '이라/라')} 하자. 선분 AP를 ${ratio(m, n, '으로/로')} 내분하는 점이 B일 때, ${jh(vp, '을/를')} ${va}, ${jh(vb, '으로/로')} 나타낸 것은?`, rows, true, {
        explain: `${nb(vb + ' = ' + frac(poly([[m, vp], [n, va]]), s))}이므로 ${nb(m + vp + ' = ' + poly([[s, vb], [-n, va]]))}, 곧 ${nb(vp + ' = ' + lc([[right[0], va], [right[1], vb]]))}이다.`
      });
    }),
    T('pos-centroid', '삼각형의 무게중심과 위치벡터', '①4', (d, n) => {
      const head = `삼각형 ABC의 세 꼭짓점 A, B, C의 위치벡터를 각각 ${va}, ${vb}, ${jh(vc, '이라/라')} 하고, 삼각형 ABC의 무게중심을 G라 하자.`;
      if (n === 0) {
        // 묻는 것: G 의 위치벡터, 또는 꼭짓점에서 G 로 가는 벡터
        const ask = d.pick(['G', 'A', 'B', 'C']), base = { G: [0, 0, 0], A: [1, 0, 0], B: [0, 1, 0], C: [0, 0, 1] }[ask];
        const g3 = (x, y, z) => [Q(x[0], x[1]), Q(y[0], y[1]), Q(z[0], z[1])];
        const gs = [g3([1, 3], [1, 3], [1, 3]), g3([2, 3], [1, 6], [1, 6]), g3([1, 2], [1, 4], [1, 4]), g3([0, 1], [1, 2], [1, 2])];
        const minus = (g) => g.map((q, i) => qsub(q, Q(base[i])));
        const opts = gs.map((g, i) => [minus(g), i === 0]);
        if (ask !== 'G') opts.push([gs[0].map((q, i) => qsub(Q(base[i]), q)), false]);
        const rows = opts.map(([c, ok]) => [lc([[c[0], va], [c[1], vb], [c[2], vc]]), ok]).slice(0, 5);
        const what = ask === 'G' ? '점 G의 위치벡터를' : `벡터 ${jh(vec(ask + 'G'), '을/를')}`;
        const right = rows.find((r) => r[1])[0];
        return choose(d, `${head} ${what} ${va}, ${vb}, ${jh(vc, '으로/로')} 나타낸 것은?`, rows, true, {
          explain: `변 BC의 중점 M의 위치벡터는 ${frac(vb + ' + ' + vc, 2)}이고, G는 선분 AM을 ${ratio(2, 1, '으로/로')} 내분하므로 G의 위치벡터는 ${frac(va + ' + ' + vb + ' + ' + vc, 3)}이다.` + (ask === 'G' ? '' : ` 따라서 ${nb(vec(ask + 'G') + ' = ' + vg + ' ' + MINUS + ' ' + vec(ask.toLowerCase()) + ' = ' + right)}이다.`)
        });
      }
      // GX⃗ + GY⃗ 와 같은 벡터: GA⃗ + GB⃗ + GC⃗ = 0⃗ 을 쓴다.
      const order = d.shuffle(['A', 'B', 'C']), [X, Y, Z] = order;
      const rows = [[vec(Z + 'G'), true], [vec('G' + Z), false], ['2' + vec('G' + Z), false], [frac(1, 2) + vec(Z + 'G'), false], [vec(X + Y), false]];
      return choose(d, `삼각형 ABC의 무게중심을 G라 할 때, ${nb(vec('G' + X) + ' + ' + vec('G' + Y))}와 같은 벡터는?`, rows, true, {
        explain: `G의 위치벡터를 ${jh(vg, '이라/라')} 하면 ${nb(vg + ' = ' + frac(va + ' + ' + vb + ' + ' + vc, 3))}이므로 ${nb(vec('GA') + ' + ' + vec('GB') + ' + ' + vec('GC'))} = (${va} ${MINUS} ${vg}) + (${vb} ${MINUS} ${vg}) + (${vc} ${MINUS} ${vg}) = ${nb(va + ' + ' + vb + ' + ' + vc + ' ' + MINUS + ' 3' + vg)} = ${vec('0')}이다. 따라서 ${nb(vec('G' + X) + ' + ' + vec('G' + Y) + ' = ' + MINUS + vec('G' + Z) + ' = ' + vec(Z + 'G'))}이다.`
      });
    }, { count: 2 }),
    T('pos-line', '직선 위의 점의 위치벡터', '①5', (d) => {
      const good = [[-2, 3], [Q(-3, 2), Q(5, 2)], [Q(1, 2), Q(1, 2)], [4, -3], [Q(1, 3), Q(2, 3)], [3, -2], [Q(3, 2), Q(-1, 2)], [Q(-1, 2), Q(3, 2)], [2, -1], [-1, 2], [Q(2, 3), Q(1, 3)], [Q(5, 4), Q(-1, 4)]];
      const bad = [[Q(3, 2), -1], [2, 1], [Q(1, 2), Q(1, 3)], [-1, 1], [3, -3], [Q(-3, 2), Q(3, 2)], [Q(2, 3), Q(2, 3)], [1, 1], [Q(5, 2), Q(-1, 2)], [-2, 2]];
      const can = d.bool();
      const pick = can ? d.shuffle(good).slice(0, 1).concat(d.shuffle(bad).slice(0, 4)) : d.shuffle(good).slice(0, 4).concat(d.shuffle(bad).slice(0, 1));
      const toQ = (x) => (typeof x === 'number' ? Q(x) : x);
      const rows = pick.map(([k, l]) => { const s = qadd(toQ(k), toQ(l)); return [lc([[k, va], [l, vb]]), s.p === s.q]; });
      return choose(d, `좌표공간에서 두 점 A, B의 위치벡터를 각각 ${va}, ${jh(vb, '이라/라')} 하고, 두 점 A, B를 지나는 직선 위의 점을 P라 할 때, 다음 가운데 점 P의 위치벡터가 될 수 ${can ? '있는' : '없는'} 것은?`, rows, can, {
        explain: `점 P가 직선 AB 위에 있으면 ${nb(vec('AP') + ' = ' + V('t') + vec('AB'))}인 실수 ${jh(V('t'), '이/가')} 있으므로 ${nb(vp + ' ' + MINUS + ' ' + va + ' = ' + V('t') + '(' + vb + ' ' + MINUS + ' ' + va + ')')}, 곧 ${nb(vp + ' = (1 ' + MINUS + ' ' + V('t') + ')' + va + ' + ' + V('t') + vb)}이다. ${va}, ${vb}의 계수의 합이 1인 것만 점 P의 위치벡터가 될 수 있다.`
      });
    }),
    T('pos-chain', '내분점을 거듭 잡은 점을 두 벡터로 나타내기', '①6', (d, n) => {
      if (n === 0) {
        const [m, k] = d.pick(RATIOS), [p, q] = d.pick(RATIOS.concat([[1, 1]]));
        const s = m + k, t = p + q;
        const right = [qsub(Q(p * k, t * s), Q(1)), Q(p * m, t * s)];
        const cand = [right, [qsub(Q(q * k, t * s), Q(1)), Q(q * m, t * s)], [qsub(Q(p * m, t * s), Q(1)), Q(p * k, t * s)], [Q(p * k, t * s), Q(p * m, t * s)]];
        if (cand.some((c, i) => cand.some((e, j) => j > i && sameQ(c, e)))) return null;
        const rows = cand.map((c, i) => [lc([[c[0], va], [c[1], vb]]), i === 0]);
        // 그림: O 왼쪽 아래, B 오른쪽 아래, A 위
        const g = Board(), O = [0, 120], Bp = [230, 120], A = [75, 0], P = onSeg(A, Bp, m / s), Qp = onSeg(O, P, p / t), cen = centerOf([O, A, Bp]);
        if (Math.hypot(Qp[0] - O[0], Qp[1] - O[1]) < 50 || O[1] - Qp[1] < 24) return null;   // Q가 꼭짓점 O에 붙으면 이름이 선에 걸린다
        g.poly([O, A, Bp]).seg(O, P).seg(A, Qp, 'cut').dot(P).dot(Qp);
        nameOut(g, O, 'O', cen); nameOut(g, A, 'A', cen); nameOut(g, Bp, 'B', cen); g.name(P, 'P', 45); g.name(Qp, 'Q', clearAngle(Qp, [[O, A], [O, Bp], [A, Bp], [O, P], [A, Qp]], 12), 12);   // 둘레 선분에서 가장 먼 쪽
        const figure = g.svg('삼각형 OAB. 변 AB 위의 점 P와 선분 OP 위의 점 Q가 있고, A와 Q를 잇는 점선이 그어져 있다.');
        return choose(d, `삼각형 OAB에서 ${nb(vec('OA') + ' = ' + va)}, ${nb(vec('OB') + ' = ' + vb)}라 하자. 선분 AB를 ${ratio(m, k, '으로/로')} 내분하는 점을 P, 선분 OP를 ${ratio(p, q, '으로/로')} 내분하는 점을 Q라 할 때, 벡터 ${jh(vec('AQ'), '을/를')} ${va}, ${jh(vb, '으로/로')} 나타낸 것은?`, rows, true, {
          figure,
          explain: `${nb(vec('OP') + ' = ' + frac(poly([[m, vb], [k, va]]), s))}, ${nb(vec('OQ') + ' = ' + tx(Q(p, t)) + vec('OP') + ' = ' + lc([[Q(p * k, t * s), va], [Q(p * m, t * s), vb]]))}이므로 ${nb(vec('AQ') + ' = ' + vec('OQ') + ' ' + MINUS + ' ' + va + ' = ' + rows.find((r) => r[1])[0])}이다.`
        });
      }
      const [m, k] = d.pick(RATIOS), s = m + k, x = Q(m, s);
      const cand = [[x, Q(1)], [Q(k, s), Q(1)], [Q(1), x], [x, Q(k, s)]];
      const rows = cand.map((c, i) => [lc([[c[0], vec('OA')], [c[1], vec('OC')]]), i === 0]);
      const g = Board(), O = [0, 100], A = [220, 100], Bp = [220, 0], Cp = [0, 0], P = onSeg(Cp, Bp, m / s), cen = centerOf([O, A, Bp, Cp]);
      g.poly([O, A, Bp, Cp]).seg(O, P).dot(P);
      nameOut(g, O, 'O', cen); nameOut(g, A, 'A', cen); nameOut(g, Bp, 'B', cen); nameOut(g, Cp, 'C', cen); g.name(P, 'P', 90);
      const figure = g.svg('직사각형 OABC(O 왼쪽 아래, A 오른쪽 아래, B 오른쪽 위, C 왼쪽 위). 변 CB 위의 점 P와 O를 잇는 선분이 그어져 있다.');
      return choose(d, `직사각형 OABC에서 선분 CB를 ${ratio(m, k, '으로/로')} 내분하는 점을 P라 할 때, 벡터 ${jh(vec('OP'), '을/를')} ${vec('OA')}, ${jh(vec('OC'), '으로/로')} 나타낸 것은?`, rows, true, {
        figure,
        explain: `${nb(vec('CB') + ' = ' + vec('OA'))}이고 ${nb(vec('CP') + ' = ' + tx(x) + vec('CB'))}이므로 ${nb(vec('OP') + ' = ' + vec('OC') + ' + ' + vec('CP') + ' = ' + rows.find((r) => r[1])[0])}이다.`
      });
    }, { count: 2 }),
    T('pos-read', '벡터 등식으로 점의 자리 읽기', '①7', (d) => {
      const [m, n] = d.pick(RATIOS), t = d.pick([1, 2]), s = m + n, fromC = d.bool();
      const eq = nb(t * s + vec('AP') + ' = ' + poly([[t * n, vec('AB')], [t * m, vec('AC')]]));
      const ask = fromC ? nb(vec('CP') + ' = ' + vk + vec('CB')) : nb(vec('BP') + ' = ' + vk + vec('BC'));
      const v = fromC ? Q(n, s) : Q(m, s);
      return qAns(`삼각형 ABC에서 ${jh(eq, '을/를')} 만족시키는 점 P에 대하여 ${ask}일 때, 실수 ${vk}의 값은?`, v, {
        explain: `${nb(vec('AP') + ' = ' + frac(poly([[n, vec('AB')], [m, vec('AC')]]), s))}이므로 점 P는 선분 BC를 ${ratio(m, n, '으로/로')} 내분하는 점이다. 따라서 ${nb((fromC ? vec('CP') : vec('BP')) + ' = ' + tx(v) + (fromC ? vec('CB') : vec('BC')))}이므로 ${nb(vk + ' = ' + tx(v))}이다.`,
        facts: { value: fromC ? `${t * n}/${t * s}` : `${t * m}/${t * s}` }
      });
    })
  ]);

  // ── 벡터의 성분 ──
  // 정수 성분 벡터: 0 이 아닌 성분을 고른다.
  const nz = (d, lo, hi) => { if (lo === 0 && hi === 0) throw new Error('0이 아닌 수를 고를 수 없다'); let x = 0; while (x === 0) x = d.int(lo, hi); return x; };
  const vecOf = (d, dim, lo, hi) => Array.from({ length: dim }, () => d.int(lo, hi));
  const nzVec = (d, dim, lo, hi) => Array.from({ length: dim }, () => nz(d, lo, hi));
  // 크기가 자연수인 공간벡터(성분의 절댓값)
  const QUADS = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [2, 4, 4, 6], [3, 4, 12, 13], [2, 5, 14, 15], [2, 10, 11, 15], [4, 8, 8, 12], [3, 6, 6, 9]];
  const quadVec = (d) => { const q = d.pick(QUADS); return { v: d.shuffle(q.slice(0, 3)).map((x) => x * d.pick([1, -1])), m: q[3] }; };
  const sqJ = (u) => u.map((x) => jn(x) + '*' + jn(x)).join('+');
  const diffJ = (P, A) => P.map((x, i) => '(' + jn(x) + '-' + jn(A[i]) + ')');

  B.addTypes(UNIT, 'comp', [
    T('comp-basis', '기본벡터와 성분을 서로 바꾸기', '①10', (d, n) => {
      if (n === 0) {
        const c = vecOf(d, 3, -6, 6), zero = c.filter((x) => x === 0).length;
        if (zero > 1 || c.every((x) => Math.abs(x) <= 1)) return null;
        const expr = poly([[c[0], E1], [c[1], E2], [c[2], E3]]);
        return coordAns(`벡터 ${jh(nb(va + ' = ' + expr), '을/를')} 성분으로 나타내시오. (단, ${nb(E1 + ' = (1, 0, 0)')}, ${nb(E2 + ' = (0, 1, 0)')}, ${nb(E3 + ' = (0, 0, 1)')})`, c, {
          explain: `${nb(va + ' = ' + c.map((x, i) => par(x) + ['(1, 0, 0)', '(0, 1, 0)', '(0, 0, 1)'][i]).join(' + '))} = ${tup(c)}이다.`,
          facts: { calc: c.map((x, i) => [jn(x), i]) }
        });
      }
      const c = nzVec(d, 2, -7, 7);
      if (c.every((x) => Math.abs(x) === 1)) return null;
      return polyAns(`벡터 ${jh(VV(va, c), '을/를')} ${E1}, ${jh(E2, '으로/로')} 나타내시오. (단, ${nb(E1 + ' = (1, 0)')}, ${nb(E2 + ' = (0, 1)')}이고, 1도 칸에 적는다.)`, [[c[0], E1], [c[1], E2]], {
        explain: `${nb(tup(c) + ' = ' + par(c[0]) + '(1, 0) + ' + par(c[1]) + '(0, 1)')}이므로 ${nb(va + ' = ' + poly([[c[0], E1], [c[1], E2]]))}이다.`,
        facts: { calc: c.map((x, i) => [jn(x), i]) }
      });
    }, { count: 2 }),
    T('comp-size', '성분으로 나타낸 벡터의 크기', '①11', (d, n) => {
      if (n === 0) {
        const c = nzVec(d, 2, -8, 8), s = sq(c);
        if (!isSqFree(s)) return null;
        return radAns(`벡터 ${VV(va, c)}의 크기는?`, 1, s, {
          explain: `${nb(ab(va) + ' = ' + rt(c.map((x) => par(x) + '<sup>2</sup>').join(' + ')) + ' = ' + rt(String(s)))}이다.`,
          facts: { calc: [[sqJ(c), 0]] }
        });
      }
      const { v, m } = quadVec(d);
      return N(`벡터 ${VV(va, v)}의 크기는?`, m, {
        explain: `${nb(ab(va) + ' = ' + rt(v.map((x) => par(x) + '<sup>2</sup>').join(' + ')) + ' = ' + rt(String(m * m)) + ' = ' + m)}이다.`,
        facts: { value: `(${sqJ(v)})/${m}`, derived: [m] }
      });
    }, { count: 2 }),
    T('comp-equal', '두 벡터가 서로 같을 조건', '①12', (d, n) => {
      if (n === 0) {
        const x0 = nz(d, -6, 6), y0 = nz(d, -6, 6), c1 = nz(d, -5, 5), c2 = nz(d, -5, 5), c3 = x0 + c1 + y0, c4 = c2 - y0 + x0;
        if (c3 === 0 || c4 === 0) return null;
        const a = [poly([[1, vx], [c1, '']]), poly([[c2, ''], [-1, vy]])], b = [poly([[c3, ''], [-1, vy]]), poly([[c4, ''], [-1, vx]])];
        return valsQ(`두 벡터 ${VV(va, a)}, ${VV(vb, b)}에 대하여 ${nb(va + ' = ' + vb)}일 때, 실수 ${vx}, ${vy}의 값은?`, [[vx, x0, true], [vy, y0, true]], {
          explain: `성분끼리 같으므로 ${nb(poly([[1, vx], [c1, '']]) + ' = ' + poly([[c3, ''], [-1, vy]]))}, ${nb(poly([[c2, ''], [-1, vy]]) + ' = ' + poly([[c4, ''], [-1, vx]]))}이다. 곧 ${nb(vx + ' + ' + vy + ' = ' + num(c3 - c1))}, ${nb(vx + ' ' + MINUS + ' ' + vy + ' = ' + num(c4 - c2))}이므로 ${nb(vx + ' = ' + num(x0))}, ${nb(vy + ' = ' + num(y0))}이다.`,
          facts: { calc: [[`((${jn(c3)}-${jn(c1)})+(${jn(c4)}-${jn(c2)}))/2`, 0], [`((${jn(c3)}-${jn(c1)})-(${jn(c4)}-${jn(c2)}))/2`, 1]], derived: [2] }
        });
      }
      // a⃗ = (αx + c1, y + c2), b⃗ = (c3 − y, βx + c4) 가 같을 때 |a⃗|
      const al = d.int(1, 3), be = d.int(1, 3), x0 = nz(d, -4, 4), y0 = nz(d, -4, 4), c1 = nz(d, -6, 6), c2 = nz(d, -6, 6);
      const a0 = [al * x0 + c1, y0 + c2], c3 = a0[0] + y0, c4 = a0[1] - be * x0, s = sq(a0);
      if (c3 === 0 || c4 === 0 || a0.includes(0) || !isSqFree(s)) return null;
      const a = [poly([[al, vx], [c1, '']]), poly([[1, vy], [c2, '']])], b = [poly([[c3, ''], [-1, vy]]), poly([[be, vx], [c4, '']])];
      const X = `((${jn(c3)}-${jn(c1)})+(${jn(c2)}-${jn(c4)}))/(${al}+${be})`, A1 = `${al}*${X}+${jn(c1)}`, A2 = `(${jn(c3)}-${jn(c1)}-${al}*${X})+${jn(c2)}`;
      return radAns(`두 벡터 ${VV(va, a)}, ${VV(vb, b)}에 대하여 ${nb(va + ' = ' + vb)}일 때, ${ab(va)}의 값은?`, 1, s, {
        explain: `성분끼리 같으므로 ${nb(poly([[al, vx], [c1, '']]) + ' = ' + poly([[c3, ''], [-1, vy]]))}, ${nb(poly([[1, vy], [c2, '']]) + ' = ' + poly([[be, vx], [c4, '']]))}이다. 이를 풀면 ${nb(vx + ' = ' + num(x0))}, ${nb(vy + ' = ' + num(y0))}이므로 ${nb(va + ' = ' + tup(a0))}, ${nb(ab(va) + ' = ' + rt(String(s)))}이다.`,
        facts: { calc: [[`(${A1})*(${A1})+(${A2})*(${A2})`, 0]] }
      });
    }, { count: 2 }),
    T('comp-ops', '성분으로 나타낸 벡터의 연산', '①13', (d, n) => {
      if (n === 0) {
        const a = nzVec(d, 2, -5, 5), b = nzVec(d, 2, -5, 5), c = nzVec(d, 2, -5, 5);
        const p = d.int(2, 3), q = d.int(1, 3), r = d.int(2, 3), s = d.int(1, 3), e = d.pick([1, -1]);
        const kA = p - e * r * s, kB = -p * q, kC = e * r, res = a.map((x, i) => kA * x + kB * b[i] + kC * c[i]);
        if (res.some((x) => Math.abs(x) > 40)) return null;
        const expr = nb(`${p}(${va} ${MINUS} ${q === 1 ? '' : q}${vb}) ${e > 0 ? '+' : MINUS} ${r}(${vc} ${MINUS} ${s === 1 ? '' : s}${va})`);
        return coordAns(`세 벡터 ${VV(va, a)}, ${VV(vb, b)}, ${VV(vc, c)}에 대하여 벡터 ${jh(expr, '을/를')} 성분으로 나타내시오.`, res, {
          explain: `${nb(expr + ' = ' + poly([[kA, va], [kB, vb], [kC, vc]]))} = ${tup(res)}이다.`,
          facts: { calc: res.map((_, i) => [`${p}*${jn(a[i])}-${p}*${q}*${jn(b[i])}${e > 0 ? '+' : '-'}${r}*${jn(c[i])}${e > 0 ? '-' : '+'}${r}*${s}*${jn(a[i])}`, i]) }
        });
      }
      const a = nzVec(d, 3, -5, 5), b = nzVec(d, 3, -5, 5), p = d.int(2, 3), q = d.int(2, 4), r = d.int(1, 7), kB = p * q - r;
      if (kB === 0) return null;
      const res = a.map((x, i) => p * x + kB * b[i]);
      const expr = nb(`${p}(${va} + ${q}${vb}) ${MINUS} ${r === 1 ? '' : r}${vb}`);
      return coordAns(`두 벡터 ${VV(va, a)}, ${VV(vb, b)}에 대하여 벡터 ${jh(expr, '을/를')} 성분으로 나타내시오.`, res, {
        explain: `${nb(expr + ' = ' + poly([[p, va], [kB, vb]]))} = ${tup(res)}이다.`,
        facts: { calc: res.map((_, i) => [`${p}*${jn(a[i])}+(${p}*${q}-${r})*${jn(b[i])}`, i]) }
      });
    }, { count: 2 }),
    T('comp-eqsolve', '연산 등식에서 미지수 구하기', '①14', (d) => {
      const k = d.int(2, 3), a = nzVec(d, 2, -5, 5), b2 = nz(d, -5, 5), x0 = nz(d, -6, 6), c1 = k * a[0] - 2 * x0, y0 = k * a[1] - 2 * b2;
      if (c1 === 0 || y0 === 0) return null;
      return valsQ(`세 벡터 ${VV(va, a)}, ${VV(vb, [vx, b2])}, ${VV(vc, [c1, vy])}에 대하여 ${nb(k + va + ' ' + MINUS + ' ' + vb + ' = ' + vb + ' + ' + vc)}가 성립할 때, 실수 ${vx}, ${vy}의 값은?`, [[vx, x0, true], [vy, y0, true]], {
        explain: `${nb(vc + ' = ' + k + va + ' ' + MINUS + ' 2' + vb)}이므로 ${nb(tup([c1, vy]) + ' = ' + tup([k * a[0] + ' ' + MINUS + ' 2' + vx, k * a[1] - 2 * b2]))}이다. 따라서 ${nb(vx + ' = ' + num(x0))}, ${nb(vy + ' = ' + num(y0))}이다.`,
        facts: { calc: [[`(${k}*${jn(a[0])}-${jn(c1)})/2`, 0], [`${k}*${jn(a[1])}-2*${jn(b2)}`, 1]], derived: [2] }
      });
    }),
    T('comp-combo', '한 벡터를 두 벡터의 실수배의 합으로 나타내기', '①15', (d, n) => {
      const a = nzVec(d, 2, -4, 4), b = nzVec(d, 2, -4, 4), det = a[0] * b[1] - a[1] * b[0];
      if (det === 0) return null;
      if (n === 0) {
        const k = nz(d, -4, 4), l = nz(d, -4, 4), c = addv(mulv(k, a), mulv(l, b));
        if (c.some((x) => x === 0 || Math.abs(x) > 20)) return null;
        return valsQ(`세 벡터 ${VV(va, a)}, ${VV(vb, b)}, ${VV(vc, c)}에 대하여 ${nb(vc + ' = ' + vk + va + ' + ' + vl + vb)}일 때, 실수 ${vk}, ${vl}의 값은?`, [[vk, k, true], [vl, l, true]], {
          explain: `${nb(tup(c) + ' = ' + vk + tup(a) + ' + ' + vl + tup(b))}이므로 ${nb(poly([[a[0], vk], [b[0], vl]]) + ' = ' + num(c[0]))}, ${nb(poly([[a[1], vk], [b[1], vl]]) + ' = ' + num(c[1]))}이다. 이를 풀면 ${nb(vk + ' = ' + num(k))}, ${nb(vl + ' = ' + num(l))}이다.`,
          facts: { calc: [[`(${jn(c[0])}*${jn(b[1])}-${jn(c[1])}*${jn(b[0])})/(${jn(a[0])}*${jn(b[1])}-${jn(a[1])}*${jn(b[0])})`, 0], [`(${jn(a[0])}*${jn(c[1])}-${jn(a[1])}*${jn(c[0])})/(${jn(a[0])}*${jn(b[1])}-${jn(a[1])}*${jn(b[0])})`, 1]] }
        });
      }
      // 기본벡터 e⃗₁ 또는 e⃗₂ 를 두 벡터로: 계수가 분수
      const first = d.bool(), c = first ? [1, 0] : [0, 1], E = first ? E1 : E2;
      const k = Q(c[0] * b[1] - c[1] * b[0], det), l = Q(a[0] * c[1] - a[1] * c[0], det);
      if (k.q === 1 || l.q === 1) return null;
      return fracVals(`두 벡터 ${VV(va, a)}, ${VV(vb, b)}에 대하여 ${nb(E + ' = ' + tup(c) + ' = ' + vk + va + ' + ' + vl + vb)}일 때, 실수 ${vk}, ${vl}의 값은?`, [[vk, k], [vl, l]], {
        explain: `${nb(tup(c) + ' = ' + vk + tup(a) + ' + ' + vl + tup(b))}이므로 ${nb(poly([[a[0], vk], [b[0], vl]]) + ' = ' + c[0])}, ${nb(poly([[a[1], vk], [b[1], vl]]) + ' = ' + c[1])}이다. 이를 풀면 ${nb(vk + ' = ' + tx(k))}, ${nb(vl + ' = ' + tx(l))}이다.`,
        facts: { calc: [[jn(k.p), 0], [String(k.q), 1], [jn(l.p), 2], [String(l.q), 3]], derived: [Math.abs(k.p), k.q, Math.abs(l.p), l.q] }
      });
    }, { count: 2 }),
    T('comp-ab', '두 점으로 벡터의 성분과 크기 구하기', '①16', (d, n) => {
      const dim = n === 0 ? 2 : 3, A = vecOf(d, dim, -5, 5), P = vecOf(d, dim, -5, 5), v = subv(P, A), s = sq(v);
      if (v.some((x) => x === 0) || !isSqFree(s)) return null;
      const AB = vec('AB'), slots = v.map((_, i) => '{' + i + '}').join(', ');
      return inline(`두 점 ${pt('A', A)}, ${pt('B', P)}에 대하여 벡터 ${jh(AB, '을/를')} 성분으로 나타내고, 그 크기를 구하시오.`, `${AB} = (${slots}), ${ab(AB)} = ${rt('{' + dim + '}')}`, v.map((x) => ({ answer: x, signed: true })).concat([{ answer: s }]), {
        shown: `${AB} = ${tup(v)}, ${ab(AB)} = ${rt(String(s))}`,
        explain: `${nb(AB + ' = ' + tup(P.map((x, i) => num(x) + ' ' + MINUS + ' ' + par(A[i]))) + ' = ' + tup(v))}이고 ${nb(ab(AB) + ' = ' + rt(v.map((x) => par(x) + '<sup>2</sup>').join(' + ')) + ' = ' + rt(String(s)))}이다.`,
        facts: { calc: v.map((_, i) => [`${jn(P[i])}-${jn(A[i])}`, i]).concat([[diffJ(P, A).map((t) => t + '*' + t).join('+'), dim]]) }
      });
    }, { count: 2 }),
    T('comp-pointd', '벡터가 같도록 하는 점의 좌표', '①17', (d) => {
      const A = vecOf(d, 2, -5, 5), P = vecOf(d, 2, -5, 5), Cq = vecOf(d, 2, -5, 5), same = d.bool();
      const D = same ? addv(Cq, subv(P, A)) : subv(Cq, subv(P, A));
      if (subv(P, A).some((x) => x === 0) || D.some((x) => x === 0) || String(D) === String(A) || String(D) === String(P)) return null;
      const rel = same ? nb(vec('AB') + ' = ' + vec('CD')) : nb(vec('AB') + ' = ' + vec('DC'));
      return coordAns(`세 점 ${pt('A', A)}, ${pt('B', P)}, ${pt('C', Cq)}에 대하여 ${jh(rel, '을/를')} 만족시키는 점 D의 좌표를 구하시오.`, D, {
        explain: `${nb(vec('AB') + ' = ' + tup(subv(P, A)))}이다. 점 D의 좌표를 ${nb('(' + vx + ', ' + vy + ')')}라 하면 ${same ? nb(vec('CD') + ' = (' + vx + ' ' + MINUS + ' ' + par(Cq[0]) + ', ' + vy + ' ' + MINUS + ' ' + par(Cq[1]) + ')') : nb(vec('DC') + ' = (' + num(Cq[0]) + ' ' + MINUS + ' ' + vx + ', ' + num(Cq[1]) + ' ' + MINUS + ' ' + vy + ')')}이므로 D${tup(D)}이다.`,
        facts: { calc: D.map((_, i) => [same ? `${jn(Cq[i])}+${jn(P[i])}-${jn(A[i])}` : `${jn(Cq[i])}-${jn(P[i])}+${jn(A[i])}`, i]) }
      });
    }),
    T('comp-par', '성분으로 나타낸 두 벡터의 평행 조건', '①18', (d, n) => {
      const TS = [Q(2), Q(3), Q(-2), Q(-3), Q(1, 2), Q(-1, 2), Q(3, 2), Q(-3, 2), Q(2, 3), Q(-2, 3)];
      if (n === 0) {
        const dim = d.pick([2, 3]), a = nzVec(d, dim, -6, 6), t = d.pick(TS), b = a.map((x) => qmul(Q(x), t));
        if (b.some((x) => x.q !== 1 || Math.abs(x.p) > 12)) return null;
        const bi = b.map((x) => x.p), j = d.int(0, dim - 1), i = (j + 1) % dim, shownB = bi.map((x, idx) => (idx === j ? vk : x));
        return qAns(`두 벡터 ${VV(va, a)}, ${jh(VV(vb, shownB), '이/가')} 서로 평행하도록 하는 실수 ${vk}의 값은?`, bi[j], {
          signed: true,
          explain: `${nb(vb + ' = ' + V('t') + va)}(${V('t')}는 0이 아닌 실수)라 하면 ${nb(num(bi[i]) + ' = ' + V('t') + ' × ' + par(a[i]))}에서 ${nb(V('t') + ' = ' + tx(t))}이므로 ${nb(vk + ' = ' + tx(t) + ' × ' + par(a[j]) + ' = ' + num(bi[j]))}이다.`,
          facts: { value: `${jn(a[j])}*${jn(bi[i])}/${jn(a[i])}` }
        });
      }
      if (n === 1) {
        const b = nzVec(d, 3, -5, 5), t = d.pick(TS), tb = b.map((x) => qmul(Q(x), t));
        if (tb.some((x) => x.q !== 1)) return null;
        const p = nz(d, -6, 6), c = d.int(1, 2), e = nz(d, -7, 7), x0 = tb[0].p - p, y0 = (tb[2].p - e) / c;
        if (!Number.isInteger(y0) || x0 === 0 || y0 === 0 || tb[1].p === 0) return null;
        const a = [poly([[1, vx], [p, '']]), tb[1].p, poly([[c, vy], [e, '']])];
        return valsQ(`두 벡터 ${VV(va, a)}, ${jh(VV(vb, b), '이/가')} 서로 평행할 때, 실수 ${vx}, ${vy}의 값은?`, [[vx, x0, true], [vy, y0, true]], {
          explain: `${nb(va + ' = ' + V('t') + vb)}라 하면 ${nb(num(tb[1].p) + ' = ' + par(b[1]) + V('t'))}에서 ${nb(V('t') + ' = ' + tx(t))}이다. ${nb(poly([[1, vx], [p, '']]) + ' = ' + num(tb[0].p))}, ${nb(poly([[c, vy], [e, '']]) + ' = ' + num(tb[2].p))}이므로 ${nb(vx + ' = ' + num(x0))}, ${nb(vy + ' = ' + num(y0))}이다.`,
          facts: { calc: [[`${jn(tb[1].p)}*${jn(b[0])}/${jn(b[1])}-${jn(p)}`, 0], [`(${jn(tb[1].p)}*${jn(b[2])}/${jn(b[1])}-${jn(e)})/${c}`, 1]] }
        });
      }
      // a⃗ + kc⃗ ∥ b⃗ − a⃗ (평면벡터)
      const a = nzVec(d, 2, -5, 5), b = nzVec(d, 2, -5, 5), c = nzVec(d, 2, -5, 5), w = subv(b, a);
      const da = a[0] * w[1] - a[1] * w[0], dc = c[0] * w[1] - c[1] * w[0];
      if (dc === 0 || da % dc !== 0 || da === 0 || w.includes(0)) return null;
      const k = -da / dc, u = addv(a, mulv(k, c));
      if (Math.abs(k) > 9 || u.every((x) => x === 0)) return null;
      const W = `((${jn(b[0])})-(${jn(a[0])}))`, W2 = `((${jn(b[1])})-(${jn(a[1])}))`;
      return qAns(`세 벡터 ${VV(va, a)}, ${VV(vb, b)}, ${VV(vc, c)}에 대하여 두 벡터 ${nb(va + ' + ' + vk + vc)}, ${nb(vb + ' ' + MINUS + ' ' + va)}가 서로 평행할 때, 실수 ${vk}의 값은?`, k, {
        signed: true,
        explain: `${nb(va + ' + ' + vk + vc + ' = ' + tup([poly([[c[0], vk], [a[0], '']]), poly([[c[1], vk], [a[1], '']])]))}, ${nb(vb + ' ' + MINUS + ' ' + va + ' = ' + tup(w))}이다. 평행하므로 ${nb('(' + poly([[c[0], vk], [a[0], '']]) + ') × ' + par(w[1]) + ' = (' + poly([[c[1], vk], [a[1], '']]) + ') × ' + par(w[0]))}이고 ${nb(vk + ' = ' + num(k))}이다. 이때 ${nb(va + ' + ' + vk + vc + ' = ' + tup(u))}이다.`,
        facts: { value: `0-((${jn(a[0])})*${W2}-(${jn(a[1])})*${W})/((${jn(c[0])})*${W2}-(${jn(c[1])})*${W})` }
      });
    }, { count: 3 }),
    T('comp-unit', '평행한 단위벡터', '①19', (d) => {
      const { v, m } = quadVec(d);
      const tq = (k, den) => tup(v.map((x) => tx(Q(k * x, den))));
      const rows = [
        [nb(tq(1, m)) + ' 또는 ' + nb(tq(-1, m)), true],
        [tq(1, m), false],
        [tq(-1, m), false],
        [nb(tq(1, m * m)) + ' 또는 ' + nb(tq(-1, m * m)), false]
      ];
      return choose(d, `벡터 ${jh(VV(va, v), '과/와')} 평행한 단위벡터를 모두 구한 것은?`, rows, true, {
        explain: `${nb(ab(va) + ' = ' + m)}이므로 ${jh(va, '과/와')} 평행한 단위벡터는 ${frac(1, m)}${va}, ${MINUS}${frac(1, m)}${va}의 두 개이다.`
      });
    }),
    T('comp-mid', '모서리의 중점을 이은 벡터의 성분', '①20', (d) => {
      const A = vecOf(d, 3, -4, 4), P = vecOf(d, 3, -4, 4), half = nzVec(d, 3, -3, 3), Cq = addv(P, mulv(2, half));
      if (Cq.some((x) => Math.abs(x) > 8) || A.every((x) => x === 0) || P.every((x) => x === 0) || String(A) === String(P)) return null;
      const MN = vec('MN');
      return coordAns(`좌표공간의 네 점 O(0, 0, 0), ${pt('A', A)}, ${pt('B', P)}, ${jh(pt('C', Cq), '을/를')} 꼭짓점으로 하는 사면체에서 두 모서리 AB, AC의 중점을 각각 M, N이라 할 때, 벡터 ${jh(MN, '을/를')} 성분으로 나타내시오.`, half, {
        explain: `M, N의 위치벡터는 각각 ${frac(vec('a') + ' + ' + vec('b'), 2)}, ${frac(vec('a') + ' + ' + vec('c'), 2)}이므로 ${nb(MN + ' = ' + frac(vec('c') + ' ' + MINUS + ' ' + vec('b'), 2) + ' = ' + frac(1, 2) + tup(subv(Cq, P)) + ' = ' + tup(half))}이다. (${vec('a')}, ${vec('b')}, ${vec('c')}는 A, B, C의 위치벡터)`,
        facts: { calc: half.map((_, i) => [`(${jn(A[i])}+${jn(Cq[i])})/2-(${jn(A[i])}+${jn(P[i])})/2`, i]), derived: [2] }
      });
    }),
    T('comp-locus', '벡터 합의 크기가 일정한 점이 나타내는 도형', '①22', (d) => {
      const A = [nz(d, -5, 5), d.int(-5, 5)], P = [d.int(-5, 5), nz(d, -5, 5)], k = 3 * d.int(1, 4);
      if (String(A) === String(P)) return null;
      const S = [A[0] + P[0], A[1] + P[1]], r = k / 3;
      const sqT = (v, c) => (c === 0 ? v + '<sup>2</sup>' : '(' + poly([[1, v], [Q(c, 3), '']]) + ')<sup>2</sup>');
      const head = nb('|' + vec('OP') + ' + ' + vec('AP') + ' + ' + vec('BP') + '| = ' + k);
      return qAns(`좌표평면 위의 세 점 O(0, 0), ${pt('A', A)}, ${pt('B', P)}에 대하여 ${jh(head, '을/를')} 만족시키는 점 P가 나타내는 도형의 넓이는 □π이다. □ 안에 알맞은 수는?`, r * r, {
        explain: `점 P의 좌표를 ${nb('(' + vx + ', ' + vy + ')')}라 하면 ${nb(vec('OP') + ' + ' + vec('AP') + ' + ' + vec('BP') + ' = ' + tup([poly([[3, vx], [-S[0], '']]), poly([[3, vy], [-S[1], '']])]))}이다. 크기가 ${k}이므로 ${nb(sqT(vx, -S[0]) + ' + ' + sqT(vy, -S[1]) + ' = ' + r * r)}, 곧 반지름의 길이가 ${r}인 원이고 넓이는 ${r * r === 1 ? '' : r * r}π이다.`,
        facts: { value: `(${k}/3)*(${k}/3)`, derived: [3] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
