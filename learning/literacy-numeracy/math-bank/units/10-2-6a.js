// 고등학교 1학년 2학기 공통수학2 Ⅲ-1 「함수」 — 단원 틀·단원 안의 도구와 앞쪽 묶음
// (함수의 뜻과 정의역·공역·치역, 서로 같은 함수, 함수의 그래프, 여러 가지 함수(일대일함수·일대일대응·항등함수·상수함수)).
// 수집해 둔 천재 T셀파 공통수학2(홍진곤, 전인태 — 2022 개정) 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 42꼴, 기본꼴_2: 52꼴, 심화꼴: 7꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭) / 겹침」을 가른 대조표는 references/textbooks/수학/_분석/10-2-6/싣기_대조표.md 에 있다.
// (합성함수와 역함수는 10-2-6b.js 에, 실력 문항은 10-2-6c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 영역은 함수와 그래프. 성취기준은 10공수2-03-01(함수의 개념을 설명하고, 그 그래프를 이해한다), 10공수2-03-02(함수의 합성을 설명하고, 합성함수를 구할 수 있다),
// 10공수2-03-03(역함수의 개념을 설명하고, 역함수를 구할 수 있다)이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(대응 그림·식·그래프·문장·조건), 묻는 것(함숫값·치역·계수·식·고르기·개수)이 다르면 따로 싣는다. 수만 다른 것은 한 번만 싣는다.
//  - 교육과정의 「함수의 그래프와 그 성질을 다룰 때 지나치게 복잡한 문제는 다루지 않는다」를 까닭으로 수집본의 꼴을 빼지 않았다(사용자가 정한 것). 그런 꼴은 실력에 실었다.
//  - 답: 함숫값·계수처럼 음수일 수 있는 수는 모두 부호 단추가 붙은 칸으로 받는다. 개수·넓이만 단추 없이 받는다.
//    일차식 답은 「[±][ ]x [±][ ]」, 이차식 답은 항마다 「[±][ ]」, 치역의 경계는 「y [부등호] [±][ ]」로 받는다. 계수가 분수인 식은 고르기로 낸다.
//    원문의 「a + b의 값」「f(2) + f⁻¹(2)의 값」「f(3) × g(3) × h(3)의 값」처럼 따로 구한 수를 더하거나 곱해 묻는 꼴은 수를 하나하나 답하게 바꾸었다.
//    「모두 구하시오」로 답이 여럿인 꼴은 「있는 대로 고른 것」 고르기나 칸 여럿으로 바꾸었다.
//  - 그림: 대응 그림(두세 집합과 화살표)은 이 파일의 mapFig, 그래프는 gfig(눈금 없는 좌표평면에 곡선·점·점선)로 그린다. 그래프를 고르는 문항은 작은 그림 넷을 늘어놓는다.
//    눈금으로 읽어야 하는 그래프는 공용 plane 을 쓴다. 그림 설명(aria-label)에는 그림에 그려진 것(화살표, 곡선의 모양, 축에 적힌 글)만 적는다.
//  - 꼴 목록에 적힌 원문 답은 따르지 않는다. 답은 모두 코드가 셈한다.
//
// 뺀 것과 까닭(10-2-6b.js, 10-2-6c.js 의 것까지 여기에 모아 적는다)
//  - 작도: 함수의 그래프 그리기(①13의 그리기 — 점 그래프 고르기로 바꾸어 실었다), 역함수의 그래프 그리기(②50 — 역함수의 그래프 고르기로 바꾸어 실었다), 조각 함수의 그래프 그리기(②23의 앞부분).
//  - 활동: 함수와 역함수로 암호 만들기(②52 — 하는 일은 ②19의 역함숫값과 같다).
//  - 뒤 단원(유리함수·무리함수)이 섞인 문항은 꼴 목록에서부터 세지 않았다. 심7은 f를 무리함수 대신 정의역을 제한한 이차함수로 바꾸어 실었다.
//  - 늘 같은 답: 치역이 공역과 같은 함수의 개수(①27의 셋째 — 원문 X={a, b}, Y={1, 2}로 답이 늘 2이다. 원소를 늘리면 함수 전체를 세어 빼는 일(중복순열)이 되어 뺐다).
//  - 겹침(하는 일이 이미 실은 유형과 같다): 심2(→ ①36), ②1의 「합성하면 x가 되는 것」(→ ②1), ②19의 변형(함숫값과 역함숫값을 함께 — ②19의 둘째 차례로 실음).
//  - 바꾼 것: ①7(생활 속 대응 — 말해 보기 활동)을 「어떤 함수인가」 고르기로, ②40의 미지수(a, b가 g의 두 곳에 함께 들어 있어 답이 늘 a = 1, b = 2)를 g의 두 계수로,
//    ②34(조각 함수의 역함수 — 공학 도구 활동)를 넷 가운데 고르기로, ②49(교점의 위치 — 수행 과제)를 식 넷 가운데 고르기로 바꾸었다.
//  - 판단이 갈릴 수 있는 것: 함수의 개수(①27, 심5)는 공통수학1의 곱의 법칙·순열로 세는 범위에서만 실었다(심5는 2019년 고2 3월 학력평가 — 고1 범위).
//    ①29(f∘f가 항등함수인 일대일대응의 개수)와 ②41(두 일대일대응의 일부 값으로 나머지 값)은 기본 문서 두 곳에 나오지만
//    ①29는 경우를 따지는 일이, ②41은 조건을 차례로 맞추는 일(4단 넘게)이 대부분이라 실력에 두었다.
//    ①15는 원문 그래프 다섯을 알 수 없어([그림 모름]) ①14와 같은 그래프 모음(SHAPES)으로 새로 그렸다 — 하는 일(정의 문장을 일대일함수로 읽기)은 원문 그림에 달려 있지 않다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」 문자는 값을 물으면 「상수 a」, 범위·최댓값·최솟값을 물으면 「실수 a」로 부른다(맨 「수 a」는 쓰지 않는다).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, lines, frac, N, M, C, inline } = B.kit;
  const { LAB, MINUS, GE, LE, GT, LT, range, Q, qadd, qsub, qmul, qdiv, qneg, qpow, isInt, fl, mag, tx, nb, tail, lastOf, tj, js, V, sup, tag, f1, nz, pm,
    ansV, asQ, mono, poly, linAns, polyAns, ineqAns, pointAns, plain, gcd, sys, plane, claimQ, rt } = B.kit.mid;
  const S1 = '10공수2-03-01', S2 = '10공수2-03-02', S3 = '10공수2-03-03';
  // ref 에 기본꼴(①②)만 있으면 기본 자료, 심화꼴(심)만 있으면 심화 자료
  const sourceOf = (ref) => '수집본 ' + (/[①②]/.test(ref) ? (/심/.test(ref) ? '기본·심화' : '기본') : '심화') + ' 자료(' + ref + ')';
  // make 가 null 을 돌려주면(맞지 않는 수) 다시 만든다.
  const retry = (make) => (d, n) => { for (let i = 0; i < 400; i += 1) { const v = make(d, n); if (v) return v; } throw new Error('문항을 만들지 못했다'); };
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: sourceOf(ref), make: retry(make) }, more || {});

  // ── 글 ──
  const X = V('x'), Y = V('y'), FN = V('f'), GN = V('g'), HN = V('h'), A = V('a'), BB = V('b'), CC = V('c'), K = V('k'), MM = V('m'), NN = V('n'), PP = V('p'), QQ = V('q');
  const X2 = X + sup(2), SX = V('X'), SY = V('Y'), SZ = V('Z');
  const KS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'];
  const num = (v) => (typeof v === 'number' ? v : fl(v));
  const iq = (n) => tx(asQ(n));                                        // 화면에 적는 수(음수는 −, 분수는 분수 꼴)
  const jn = (n) => js(asQ(n));                                        // 검사 식에 적는 수((-3), (3/4))
  const nj = (n, pair) => tj(asQ(n), pair);                            // 수 뒤에 토씨
  const sgn = (n) => { const q = asQ(n); return `${q.p < 0 ? MINUS : '+'} ${mag(q)}`; };   // 「+ 3」「− 3」
  const cx = (v) => (typeof v === 'string' ? v : iq(v));
  const is = (l, r) => nb(`${l} = ${cx(r)}`);
  const isj = (l, r, pair) => nb(`${l} = ${nj(r, pair)}`);
  const INV = sup(MINUS + '1');
  const iv = (f) => f + INV;                                           // f⁻¹
  const at = (f, x) => nb(`${f}(${cx(x)})`);                           // f(3)
  const ring = (fs) => fs.join(' ∘ ');
  const cat = (fs, x) => nb(`(${ring(fs)})(${cx(x)})`);                // (g ∘ f)(3)
  const setOf = (list) => nb('{' + list.map(cx).join(', ') + '}');
  const setT = (list) => '{' + list.map((v) => (typeof v === 'string' ? v : plain(asQ(v)))).join(', ') + '}';   // 그림 설명에 적는 집합
  // 식·좌표·낱말 뒤에 토씨를 붙인다. 끝소리로 고른다: 숫자는 읽는 소리(분수는 분자), x²은 「제곱」, 문자 l·m·n 은 받침이 있고 나머지 문자는 없다, 한글은 그 글자.
  function jw(h, pair) {
    if (!pair.includes('/')) return h + pair;
    const [withB, without] = pair.split('/');
    const flat = String(h).replace(/<sup>2<\/sup>/g, '²').replace(/<span class="mb-frac"><span>([^<]*)<\/span><span class="mb-frac-bar">\/<\/span><span>[^<]*<\/span><\/span>/g, '$1').replace(/<[^>]+>/g, '').replace(/[\s)\]}|]+$/, '');
    const last = flat.slice(-1);
    if (/\d/.test(last)) return h + tail(Number(/\d+$/.exec(flat)[0]), pair);
    let bat, rieul = false;
    if (last === '²') bat = true;
    else if (/[A-Za-z]/.test(last)) { bat = /[LMNlmn]/.test(last); rieul = /[Ll]/.test(last); }
    else { const code = last.charCodeAt(0) - 0xAC00, t = code >= 0 && code <= 11171 ? code % 28 : 0; bat = t !== 0; rieul = t === 8; }
    if (withB === '으로') return h + (bat && !rieul ? '으로' : '로');
    return h + (bat ? withB : without);
  }

  // ── 다항식(차수 2까지, 계수는 유리수) ──
  // [상수항, 일차항의 계수, 이차항의 계수]
  const P = (...cs) => cs.map(asQ);
  const pv = (p, x) => p.reduce((s, c, i) => qadd(s, qmul(c, qpow(asQ(x), i))), Q(0));
  const pAdd = (p, r) => range(0, Math.max(p.length, r.length) - 1).map((i) => qadd(p[i] || Q(0), r[i] || Q(0)));
  const pMul = (p, r) => { const out = range(0, p.length + r.length - 2).map(() => Q(0)); p.forEach((a, i) => r.forEach((b, j) => { out[i + j] = qadd(out[i + j], qmul(a, b)); })); return out; };
  const pScale = (p, k) => p.map((c) => qmul(c, asQ(k)));
  // 합성 outer(inner(x))
  const pComp = (outer, inner) => outer.reduce((s, c, i) => { let pw = [Q(1)]; for (let k = 0; k < i; k += 1) pw = pMul(pw, inner); return pAdd(s, pScale(pw, c)); }, [Q(0)]);
  const pTrim = (p) => { const out = p.slice(); while (out.length > 1 && out[out.length - 1].p === 0) out.pop(); return out; };
  const pDeg = (p) => pTrim(p).length - 1;
  // 화면에 적는 식: 차수가 높은 항부터
  const pshow = (p) => poly(pTrim(p).map((c, i) => [c, i === 0 ? '' : i === 1 ? X : X + sup(i)]).reverse());
  const fdef = (name, p) => nb(`${name}(${X}) = ${pshow(p)}`);
  // 검사 식: 계수 1, −1은 수를 적지 않는다(글에 1이 보이지 않으므로). x 는 이미 검사 식 글이다('(-2)', '(3*2+1)').
  function pjs(p, x) {
    const out = [];
    pTrim(p).forEach((c, i) => {
      if (c.p === 0) return;
      const neg = c.p < 0, m = Q(Math.abs(c.p), c.q), coef = i > 0 && m.p === 1 && m.q === 1 ? '' : js(m) + (i > 0 ? '*' : '');
      out.push({ neg, body: coef + Array.from({ length: i }, () => x).join('*') });
    });
    if (!out.length) return '0';
    return out.map((t, k) => (t.neg ? '-' : k ? '+' : '') + t.body).join('');
  }
  const lin = (a, b) => P(b, a);                                       // ax + b
  // 인수 (x − r) 또는 (x − r)², r = 0 이면 x, x²
  const fct = (r, k) => (r === 0 ? X + (k === 2 ? sup(2) : '') : `(${X} ${sgn(-r)})` + (k === 2 ? sup(2) : ''));
  const facs = (rs) => [...new Set(rs)].sort((u, v) => u - v).map((r) => fct(r, rs.filter((v) => v === r).length)).join('');
  // 조각으로 정의한 함수의 식: rows [[식, 조건]]
  const pw = (rows) => sys(rows.map(([e, c]) => `${e}<span style="padding-left:0.6em">(${c})</span>`));
  const cond = (rel, v) => nb(`${X} ${rel} ${cx(v)}`);

  // ── 답 ──
  // 문자의 값 여럿: 「a = [±][ ]  b = [±][ ]」
  const vals = (text, pairs, o) => M(text, pairs.map(([lead, answer]) => ({ lead: lead + ' =', answer, signed: true })), Object.assign({}, o, { shown: pairs.map(([lead, answer]) => is(lead, answer)).join(', ') }));
  // 부호 없는 칸 여럿(개수 따위)
  const counts = (text, pairs, o) => M(text, pairs.map(([lead, answer]) => ({ lead: lead + ' =', answer })), Object.assign({}, o, { shown: pairs.map(([lead, answer]) => is(lead, answer)).join(', ') }));
  // 고르기: rows [[글, 참인가]] 에서 참인 것이 하나뿐이어야 한다.
  function pickRows(d, text, rows, o) {
    const list = o.keep ? rows : d.shuffle(rows), at0 = list.findIndex((r) => r[1]);
    if (list.filter((r) => r[1]).length !== 1) throw new Error('옳은 보기가 하나가 아니다');
    return C(text, list.map((r) => r[0]), at0, { figure: o.figure, explain: o.explain, facts: { truth: list.map((r) => r[1]), want: true } });
  }
  // ㄱ~ㅁ 가운데 조건에 맞는 것을 모두 고른 것: rows [[글, 참인가]](참이 하나 이상, 모두는 아니게)
  function pickAll(d, text, rows, o) {
    const right = KS.slice(0, rows.length).filter((_, i) => rows[i][1]);
    if (!right.length || right.length === rows.length) throw new Error('맞는 것이 없거나 모두 맞다');
    const idx = rows.map((_, i) => i), combos = [right.join(', ')];
    const all = [];
    for (let mask = 1; mask < 1 << rows.length; mask += 1) all.push(idx.filter((i) => mask & (1 << i)).map((i) => KS[i]).join(', '));
    for (const s of d.shuffle(all)) if (combos.length < 5 && !combos.includes(s)) combos.push(s);
    const order = combos.slice().sort((x, y) => x.length - y.length || (x < y ? -1 : 1));
    return C(text, order, order.indexOf(right.join(', ')), {
      figure: (o.figure || '') + lines(rows.map((r, i) => tag(KS[i]) + r[0])), explain: o.explain,
      facts: { truth: order.map((v) => v === right.join(', ')), want: true }
    });
  }
  // 그림 넷 가운데 맞는 것 둘을 모두 고른 것(flags 는 참이 꼭 둘)
  function twoOf(d, text, figure, flags, explain) {
    const yes = [0, 1, 2, 3].filter((i) => flags[i]), no = [0, 1, 2, 3].filter((i) => !flags[i]);
    if (yes.length !== 2) throw new Error('맞는 그림이 둘이 아니다');
    const [p, q] = d.shuffle(no);
    const pairs = d.shuffle([yes, no, [yes[0], p], [yes[1], q]].map((pair) => pair.slice().sort((u, v) => u - v))), right = (pair) => pair.every((i) => flags[i]);
    return C(text, pairs.map((pair) => pair.map((i) => LAB[i]).join(', ')), pairs.findIndex(right), { figure, explain, facts: { truth: pairs.map(right), want: true } });
  }
  // 그림 넷 가운데 맞는 것 하나(㉠~㉣)
  const oneOf = (text, figure, flags, explain) => C(text, LAB.slice(0, flags.length), flags.indexOf(true), { figure, explain, facts: { truth: flags.slice(), want: true } });

  // ── 그림 ──
  const HALO = 'paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round';
  const ITALIC = "font-style:italic;font-family:'MB Math','Times New Roman',serif";
  const INK = '#1f2933', BLUE = '#1d4ed8', RED = '#b42318', GREEN = '#15803d';
  const isWord = (t) => /^[A-Za-z]$/.test(String(t));
  const svgText = (x, y, t, o) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${(o && o.anchor) || 'middle'}" style="font-size:${(o && o.size) || 12}px;fill:${(o && o.fill) || INK};${isWord(t) || (o && o.italic) ? ITALIC : 'font-weight:600'};${HALO}">${t}</text>`;
  // 화살촉(끝점 q, p 에서 오는 방향)
  const head = (p, q, size, color) => { const L = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1, ux = (q[0] - p[0]) / L, uy = (q[1] - p[1]) / L, s = size || 6; return `<path d="M${f1(q[0])} ${f1(q[1])}L${f1(q[0] - ux * s - uy * s * 0.45)} ${f1(q[1] - uy * s + ux * s * 0.45)}L${f1(q[0] - ux * s + uy * s * 0.45)} ${f1(q[1] - uy * s - ux * s * 0.45)}Z" style="fill:${color || BLUE}"/>`; };

  // mapFig(o): 대응 그림. 집합은 세로로 긴 타원, 원소는 점과 이름, 대응은 화살표.
  //  o.sets [{ name: 'X', items: [글…] }](두세 집합), o.maps [[[i, j], …], …](maps[k]: 집합 k 의 i 번째 원소 → 집합 k + 1 의 j 번째 원소), o.names ['f', 'g'](집합 사이 위에 적는 함수의 이름), o.small(보기의 작은 그림)
  function mapFig(o) {
    const small = Boolean(o.small), n = o.sets.length, rows = Math.max(...o.sets.map((s) => s.items.length));
    const gapY = small ? 19 : 23, ovW = small ? 40 : 48, step = small ? 78 : (n === 2 ? 118 : 104), top = small ? 30 : 40, FS = small ? 12.5 : 13.5;
    const padX = 10, ox = (k) => padX + ovW / 2 + k * step, W = ox(n - 1) + ovW / 2 + padX, bodyH = rows * gapY, H = top + bodyH + 12;
    const midY = top + bodyH / 2, iy = (s, i) => midY + (i - (s.items.length - 1) / 2) * gapY;
    let out = '', texts = '';
    // 원소의 점: 첫 집합은 오른쪽에, 끝 집합은 왼쪽에, 가운데 집합은 양쪽에 점을 두고 이름은 가운데
    const dotL = (k, i) => [ox(k) - ovW * 0.2, iy(o.sets[k], i)], dotR = (k, i) => [ox(k) + ovW * 0.2, iy(o.sets[k], i)];
    o.sets.forEach((s, k) => {
      out += `<ellipse cx="${f1(ox(k))}" cy="${f1(midY)}" rx="${f1(ovW / 2)}" ry="${f1(bodyH / 2 + 7)}" style="fill:#f8fafc;stroke:${INK};stroke-width:1.1"/>`;
      texts += svgText(ox(k), top - (small ? 13 : 17), s.name, { size: small ? 13 : 14.5, italic: true });
      s.items.forEach((t, i) => {
        const y = iy(s, i);
        if (k === 0) { out += `<circle cx="${f1(dotR(k, i)[0])}" cy="${f1(y)}" r="2.2" style="fill:${INK}"/>`; texts += svgText(dotR(k, i)[0] - 5, y + 4, t, { anchor: 'end', size: FS }); }
        else if (k === n - 1) { out += `<circle cx="${f1(dotL(k, i)[0])}" cy="${f1(y)}" r="2.2" style="fill:${INK}"/>`; texts += svgText(dotL(k, i)[0] + 5, y + 4, t, { anchor: 'start', size: FS }); }
        else { out += `<circle cx="${f1(dotL(k, i)[0] - 2)}" cy="${f1(y)}" r="2" style="fill:${INK}"/><circle cx="${f1(dotR(k, i)[0] + 2)}" cy="${f1(y)}" r="2" style="fill:${INK}"/>`; texts += svgText(ox(k), y + 4, t, { size: FS }); }
      });
    });
    (o.maps || []).forEach((list, k) => {
      const from = (i) => (k === 0 ? dotR(k, i) : [dotR(k, i)[0] + 2, dotR(k, i)[1]]), to = (j) => (k + 1 === n - 1 ? dotL(k + 1, j) : [dotL(k + 1, j)[0] - 2, dotL(k + 1, j)[1]]);
      for (const [i, j] of list) {
        const p = from(i), q0 = to(j), L = Math.hypot(q0[0] - p[0], q0[1] - p[1]), q = [q0[0] - (q0[0] - p[0]) / L * 3.2, q0[1] - (q0[1] - p[1]) / L * 3.2];
        out += `<line x1="${f1(p[0] + 2.4)}" y1="${f1(p[1])}" x2="${f1(q[0])}" y2="${f1(q[1])}" style="stroke:${BLUE};stroke-width:1.2"/>` + head(p, q, small ? 5.5 : 6.5);
      }
      if (o.names && o.names[k]) {
        const x1 = ox(k) + ovW / 2 - 2, x2 = ox(k + 1) - ovW / 2 + 2, y = top - (small ? 17 : 22);
        out += `<line x1="${f1(x1)}" y1="${f1(y)}" x2="${f1(x2 - 4)}" y2="${f1(y)}" style="stroke:${INK};stroke-width:1"/>` + head([x1, y], [x2, y], 5, INK);
        texts += svgText((x1 + x2) / 2, y - 5, o.names[k], { size: small ? 12 : 13.5, italic: true });
      }
    });
    const said = ['대응 그림: ' + o.sets.map((s) => `집합 ${s.name} = ${setT(s.items)}`).join(', ') + '.'];
    (o.maps || []).forEach((list, k) => {
      const from = o.sets[k], to = o.sets[k + 1], name = o.names && o.names[k] ? o.names[k] + '의 ' : '';
      said.push(`${name}화살표(${from.name}에서 ${to.name}로): ${list.length ? list.map(([i, j]) => from.items[i] + ' → ' + to.items[j]).join(', ') : '없음'}.`);
      const bare = from.items.filter((_, i) => !list.some((a) => a[0] === i));
      if (bare.length) said.push(`${from.name}의 원소 ${bare.join(', ')}에서 나가는 화살표는 없다.`);
    });
    return `<svg class="mb-geo" viewBox="0 0 ${f1(W)} ${f1(H)}" width="${Math.round(W * (small ? 1 : 1.05))}" role="img" aria-label="${said.join(' ')}">${out}${texts}</svg>`;
  }
  // 작은 그림 넷을 두 줄로 놓고 이름(㉠~㉣)을 단다.
  const picks = (figs) => '<div style="display:grid;grid-template-columns:repeat(2,max-content);gap:8px 14px">' + figs.map((h, i) => `<div style="display:grid;gap:1px;justify-items:start"><div style="font-size:0.95rem;font-weight:600">${LAB[i]}</div>${h}</div>`).join('') + '</div>';

  // gfig(o): 좌표평면에 그린 그래프(눈금은 적은 수만). 가로·세로의 한 칸 크기는 같다(원이 찌그러지지 않게).
  //  o.x, o.y [작은 끝, 큰 끝], o.curves [{ pts: [[x, y], …], dash, color, width }](점을 차례로 이은 선 — 상자 밖으로 나간 부분은 그리지 않는다),
  //  o.dots [{ x, y, open }](찍은 점, open 이면 속이 빈 점), o.dashes [[x1, y1, x2, y2], …](회색 점선), o.xnums [{ v, t, up, dx }], o.ynums [{ v, t, right, above, below, dy }](축 위의 글),
  //  o.grid(모눈), o.small(보기의 작은 그림), o.say(그림 설명), o.labels [{ x, y, t, anchor, dx, dy }](그림 속 글),
  //  o.oRight·o.oUp(원점의 이름 O 를 오른쪽에·x축 위에 — 주지 않으면 왼쪽 아래)
  function gfig(o) {
    const small = Boolean(o.small), [xlo, xhi] = o.x, [ylo, yhi] = o.y;
    const u = o.u || (small ? Math.min(104 / (xhi - xlo), 96 / (yhi - ylo)) : Math.min(24, 236 / (xhi - xlo), 230 / (yhi - ylo)));
    const padL = small ? 12 : 18, padR = small ? 18 : 24, padT = small ? 18 : 22, padB = small ? 12 : 18;
    const W = padL + padR + (xhi - xlo) * u, H = padT + padB + (yhi - ylo) * u;
    const PX = (v) => padL + (v - xlo) * u, PY = (v) => padT + (yhi - v) * u, oxp = PX(0), oyp = PY(0);
    let out = '', texts = '';
    if (o.grid) {
      for (let v = Math.ceil(xlo); v <= xhi; v += 1) out += `<line class="mb-gridline" x1="${f1(PX(v))}" y1="${f1(PY(ylo))}" x2="${f1(PX(v))}" y2="${f1(PY(yhi))}"/>`;
      for (let v = Math.ceil(ylo); v <= yhi; v += 1) out += `<line class="mb-gridline" x1="${f1(PX(xlo))}" y1="${f1(PY(v))}" x2="${f1(PX(xhi))}" y2="${f1(PY(v))}"/>`;
    }
    const ax0 = PX(xlo) - 4, ax1 = PX(xhi) + 7, ay0 = PY(ylo) + 4, ay1 = PY(yhi) - 7;
    out += `<line x1="${f1(ax0)}" y1="${f1(oyp)}" x2="${f1(ax1)}" y2="${f1(oyp)}" style="stroke:${INK};stroke-width:1"/>` + head([ax0, oyp], [ax1 + 5, oyp], 6, INK);
    out += `<line x1="${f1(oxp)}" y1="${f1(ay0)}" x2="${f1(oxp)}" y2="${f1(ay1)}" style="stroke:${INK};stroke-width:1"/>` + head([oxp, ay0], [oxp, ay1 - 5], 6, INK);
    texts += `<text x="${f1(ax1 + 6)}" y="${f1(oyp + 14)}" text-anchor="middle" style="font-size:${small ? 12.5 : 13.5}px;fill:${INK};${ITALIC};${HALO}">x</text>`
      + `<text x="${f1(oxp + 7)}" y="${f1(ay1 + 3)}" text-anchor="start" style="font-size:${small ? 12.5 : 13.5}px;fill:${INK};${ITALIC};${HALO}">y</text>`
      + svgText(oxp + (o.oRight ? 7 : -7), oyp + (o.oUp ? -4 : 13), 'O', { size: 12 });
    for (const [x1, y1, x2, y2] of o.dashes || []) out += `<line x1="${f1(PX(x1))}" y1="${f1(PY(y1))}" x2="${f1(PX(x2))}" y2="${f1(PY(y2))}" style="stroke:#5b6770;stroke-width:0.9;stroke-dasharray:3 2"/>`;
    const inBox = ([x, y]) => x >= xlo - 1e-9 && x <= xhi + 1e-9 && y >= ylo - 1e-9 && y <= yhi + 1e-9;
    for (const c of o.curves || []) {
      let run = [];
      const flush = () => { if (run.length > 1) out += `<path d="M${run.map(([x, y]) => f1(PX(x)) + ' ' + f1(PY(y))).join('L')}" style="fill:none;stroke:${c.color || BLUE};stroke-width:${c.width || 1.8};stroke-linejoin:round;stroke-linecap:round${c.dash ? ';stroke-dasharray:5 3' : ''}"/>`; run = []; };
      for (const p of c.pts) { if (inBox(p)) run.push(p); else flush(); }
      flush();
    }
    for (const p of o.dots || []) out += `<circle cx="${f1(PX(p.x))}" cy="${f1(PY(p.y))}" r="${small ? 2.6 : 3}" style="fill:${p.open ? '#fff' : (p.color || BLUE)};stroke:${p.color || BLUE};stroke-width:1.4"/>`;
    for (const m of o.xnums || []) texts += svgText(PX(m.v) + (m.dx || 0), oyp + (m.up ? -5 : 14), m.t == null ? plain(asQ(m.v)) : m.t, { anchor: m.dx > 0 ? 'start' : m.dx < 0 ? 'end' : 'middle', size: 12 });
    for (const m of o.ynums || []) texts += svgText(oxp + (m.right ? 5 : -5), PY(m.v) + (m.dy != null ? m.dy : m.above ? -4 : m.below ? 13 : 4), m.t == null ? plain(asQ(m.v)) : m.t, { anchor: m.right ? 'start' : 'end', size: 12 });
    for (const l of o.labels || []) texts += svgText(PX(l.x) + (l.dx || 0), PY(l.y) + (l.dy || 0), l.t, { anchor: l.anchor || 'middle', size: l.size || (small ? 12 : 13), fill: l.fill, italic: l.italic });
    return `<svg class="mb-geo" viewBox="0 0 ${f1(W)} ${f1(H)}" width="${Math.round(W)}" role="img" aria-label="${o.say || '그래프'}">${out}${texts}</svg>`;
  }
  // 곡선의 점: f 를 lo~hi 에서 n 등분해 잰다.
  const samp = (f, lo, hi, n) => Array.from({ length: (n || 120) + 1 }, (_, i) => { const x = lo + (hi - lo) * i / (n || 120); return [x, f(x)]; });

  // ── 작은 그래프 모음(고르기 보기) ──
  // 정의역·공역이 실수 전체인 함수와 함수가 아닌 그래프. 각 그래프의 성질: fn 함수인가, inj 일대일함수인가, onto 치역이 실수 전체인가.
  const R4 = [-3.2, 3.2];
  const SHAPES = {
    rise: { fn: true, inj: true, onto: true, say: '오른쪽 위로 올라가는 직선', curves: () => [{ pts: samp((x) => 0.8 * x + 0.6, -3.2, 3.2, 4) }] },
    fall: { fn: true, inj: true, onto: true, say: '오른쪽 아래로 내려가는 직선', curves: () => [{ pts: samp((x) => -1.3 * x - 0.4, -3.2, 3.2, 4) }] },
    cubic: { fn: true, inj: true, onto: true, say: '줄곧 올라가는 매끄러운 곡선(원점 둘레에서 잠깐 눕는다)', curves: () => [{ pts: samp((x) => 0.12 * x * x * x, -3.2, 3.2) }] },
    bent: { fn: true, inj: true, onto: true, say: '기울기가 다른 두 반직선을 이은 꺾은선(왼쪽은 완만하게, 오른쪽은 가파르게 줄곧 올라간다)', curves: () => [{ pts: [[-3.2, -1.6], [0, 0], [1.6, 3.2]] }] },
    cup: { fn: true, inj: false, onto: false, say: '아래로 볼록한 포물선', curves: () => [{ pts: samp((x) => 0.45 * x * x - 1.6, -3.2, 3.2) }] },
    cap: { fn: true, inj: false, onto: false, say: '위로 볼록한 포물선', curves: () => [{ pts: samp((x) => -0.5 * x * x + 2, -3.2, 3.2) }] },
    vee: { fn: true, inj: false, onto: false, say: '원점에서 꺾인 V자 모양의 꺾은선', curves: () => [{ pts: [[-3.2, 3.2], [0, 0], [3.2, 3.2]] }] },
    flat: { fn: true, inj: false, onto: false, say: 'x축에 평행한 직선', curves: () => [{ pts: [[-3.2, 1.4], [3.2, 1.4]] }] },
    clamp: { fn: true, inj: false, onto: false, say: '왼쪽과 오른쪽은 x축에 평행하고 가운데는 내려가는 꺾은선', curves: () => [{ pts: [[-3.2, 1.6], [-1.6, 1.6], [1.6, -1.6], [3.2, -1.6]] }] },
    wave: { fn: true, inj: false, onto: true, say: '올라갔다가 내려갔다가 다시 올라가는 매끄러운 곡선', curves: () => [{ pts: samp((x) => 0.18 * x * x * x - 1.1 * x, -3.2, 3.2) }] },
    gap: { fn: true, inj: true, onto: false, say: '원점의 위와 아래에서 끊긴 두 반직선: 오른쪽 반직선은 y축 위의 점(1)에서 시작하는 색칠한 점에서 오른쪽 위로, 왼쪽 반직선은 y축 위의 점(−1)으로 다가가는 속이 빈 점에서 왼쪽 아래로 뻗는다', curves: () => [{ pts: [[0, 1], [2.2, 3.2]] }, { pts: [[0, -1], [-2.2, -3.2]] }], dots: () => [{ x: 0, y: 1 }, { x: 0, y: -1, open: true }] },
    circle: { fn: false, say: '원점을 중심으로 하는 원', curves: () => [{ pts: Array.from({ length: 121 }, (_, i) => [2.2 * Math.cos(i * Math.PI / 60), 2.2 * Math.sin(i * Math.PI / 60)]) }] },
    upright: { fn: false, say: 'y축에 평행한 직선', curves: () => [{ pts: [[1.4, -3.2], [1.4, 3.2]] }] },
    side: { fn: false, say: '오른쪽으로 볼록한(옆으로 누운) 포물선', curves: () => [{ pts: samp((y) => -0.45 * y * y + 1.8, -3.2, 3.2).map(([y, x]) => [x, y]) }] }
  };
  const shapeFig = (key, name) => { const s = SHAPES[key]; return gfig({ x: R4, y: R4, small: true, curves: s.curves(), dots: s.dots ? s.dots() : [], say: `그래프 ${name}: ${s.say}.` }); };

  // ── 생활 속 대응 ──
  const LIFE = [
    { text: `학생 3명의 집합을 ${SX}, 동아리 3개의 집합을 ${SY}라 하자. 세 학생이 서로 다른 동아리에 한 명씩 가입하여, 각 학생을 그 학생이 가입한 동아리에 대응시켰다.`, kind: 'onto', why: `${SX}의 각 원소에 ${SY}의 원소가 하나씩 대응하고, 서로 다른 학생은 서로 다른 동아리에 대응하며, 동아리가 모두 짝 지어지므로 일대일대응이다. ${SX}와 ${SY}가 다른 집합이므로 항등함수는 아니다.` },
    { text: `학생 4명의 집합을 ${SX}, 동아리 5개의 집합을 ${SY}라 하자. 네 학생이 서로 다른 동아리에 한 명씩 가입하여, 각 학생을 그 학생이 가입한 동아리에 대응시켰다.`, kind: 'inj', why: `서로 다른 학생이 서로 다른 동아리에 대응하므로 일대일함수이지만, 학생이 없는 동아리가 하나 남아 치역과 공역이 같지 않으므로 일대일대응은 아니다.` },
    { text: `한 반 학생 전체의 집합을 ${SZ}라 하자. 반장을 뽑는 투표에서 학생마다 자기 이름을 써서, 각 학생을 그 학생이 표를 준 학생에 대응시켰다.`, kind: 'id', why: `${SZ}의 각 원소에 그 자신이 대응하므로 ${SZ}에서의 항등함수이다.` },
    { text: `한 반 학생 전체의 집합을 ${SZ}라 하자. 반장을 뽑는 투표에서 모든 학생이 같은 학생의 이름을 써서, 각 학생을 그 학생이 표를 준 학생에 대응시켰다.`, kind: 'const', why: `${SZ}의 모든 원소에 같은 학생 한 명이 대응하므로 상수함수이다.` },
    { text: `학생 3명의 집합을 ${SX}, 동아리 4개의 집합을 ${SY}라 하자. 한 학생은 동아리 두 개에, 나머지 두 학생은 한 개씩 가입하여, 각 학생을 그 학생이 가입한 동아리에 대응시켰다.`, kind: 'none', why: `동아리 두 개에 가입한 학생에게는 ${SY}의 원소가 둘 대응하므로 함수가 아니다.` }
  ];
  const LIFE_OPT = { onto: '일대일대응이지만 항등함수는 아니다.', inj: '일대일함수이지만 일대일대응은 아니다.', id: '항등함수이다.', const: '상수함수이다.', none: '함수가 아니다.' };

  // ── 대응 그림 만들기 ──
  const LETTERS = ['a', 'b', 'c', 'd', 'e'].map((t) => t);
  // 화살표 목록이 함수인가(각 원소에서 꼭 하나씩)
  const isFn = (n, arrows) => range(0, n - 1).every((i) => arrows.filter((a) => a[0] === i).length === 1);
  const imageOf = (arrows) => [...new Set(arrows.map((a) => a[1]))].sort((p, q) => p - q);

  B.addUnit({
    id: '10-2-6', grade: 10, semester: 2, no: 6, title: '함수', version: 1,
    groups: [
      // ── 함수의 뜻과 정의역·공역·치역 ──
      {
        id: 'func', title: '함수의 뜻과 정의역·공역·치역', standard: S1,
        types: [
          T('func-map-pick', '대응 그림 가운데 함수인 것 고르기', '①1', (d) => {
            const nx = d.pick([3, 4]), ny = d.pick([3, 4]), xs = range(1, nx).map(String), ys = LETTERS.slice(0, ny);
            const kinds = d.shuffle(['one', 'many', 'miss', 'two']);
            const build = (kind) => d.until(() => {
              let arrows = range(0, nx - 1).map((i) => [i, d.int(0, ny - 1)]), note = '';
              if (kind === 'miss') { const i = d.int(0, nx - 1); arrows = arrows.filter((a) => a[0] !== i); note = `${SX}의 원소 ${xs[i]}에 대응하는 ${SY}의 원소가 없으므로 함수가 아니다.`; }
              if (kind === 'two') { const i = d.int(0, nx - 1), j = d.until(() => d.int(0, ny - 1), (v) => v !== arrows[i][1]); arrows.push([i, j]); note = `${SX}의 원소 ${xs[i]}에 대응하는 ${SY}의 원소가 ${V(ys[arrows[i][1]])}, ${V(ys[j])}의 2개이므로 함수가 아니다.`; }
              return { kind, arrows, note };
            }, (v) => (v.kind === 'one' ? imageOf(v.arrows).length === Math.min(nx, ny) : v.kind === 'many' ? imageOf(v.arrows).length <= nx - 2 : imageOf(v.arrows).length >= 2));
            const cases = kinds.map(build), flags = cases.map((c) => isFn(nx, c.arrows));
            const figs = cases.map((c, k) => mapFig({ sets: [{ name: 'X', items: xs }, { name: 'Y', items: ys }], maps: [c.arrows], small: true }).replace('대응 그림:', `대응 그림 ${LAB[k]}:`));
            const good = flags.map((f, i) => (f ? LAB[i] : null)).filter(Boolean);
            return twoOf(d, `그림은 집합 ${SX}에서 집합 ${SY}로의 대응이다. 함수인 것만을 있는 대로 고른 것은?`, picks(figs), flags,
              `${SX}의 각 원소에 ${SY}의 원소가 오직 하나씩 대응하는 것은 ${good.join(', ')}이다. ` + cases.map((c, i) => (flags[i] ? '' : `${LAB[i]}${josa(1, '은/는').slice(1)} ${c.note}`)).filter(Boolean).join(' ') + ` ${SY}의 원소 여러 개가 남거나 한 원소에 여러 원소가 대응하는 것은 함수인지와 상관없다.`);
          }),
          T('func-domain-range', '대응 그림에서 정의역·공역·치역', '①2', (d, n) => {
            const c = d.until(() => {
              const ys = d.shuffle(range(1, 9)).slice(0, d.pick([4, 5])).sort((p, q) => p - q), xs = range(1, 4);
              const arrows = xs.map((_, i) => [i, d.int(0, ys.length - 1)]), img = imageOf(arrows);
              return { xs, ys, arrows, img };
            }, (v) => v.img.length >= 2 && v.img.length <= v.ys.length - 2);
            const R = c.img.map((j) => c.ys[j]), out = c.ys.filter((y) => !R.includes(y));
            const figure = mapFig({ sets: [{ name: 'X', items: c.xs.map(String) }, { name: 'Y', items: c.ys.map(String) }], maps: [c.arrows], names: ['f'] });
            const head = `그림과 같은 함수 ${nb(`${FN} : ${SX} → ${SY}`)}에 대하여`;
            if (n === 0) {
              const extra = d.pick(out), drop = d.pick(R);
              const rows = [[setOf(R), true], [setOf(c.ys), false], [setOf(c.xs), false], [setOf(R.concat([extra]).sort((p, q) => p - q)), false], [setOf(R.filter((v) => v !== drop)), false]];
              const seen = new Set(), uniq = rows.filter((r) => { const k = r[0]; if (seen.has(k)) return false; seen.add(k); return true; });
              return pickRows(d, `${head} 함수 ${FN}의 치역은?`, uniq.slice(0, 5), {
                figure, explain: `치역은 함숫값 전체의 집합이다. ${c.xs.map((x, i) => is(at(FN, x), c.ys[c.arrows[i][1]])).join(', ')}이므로 치역은 ${setOf(R)}이다. 공역 ${jw(setOf(c.ys), '은/는')} ${SY} 전체이다.`
              });
            }
            const x1 = d.pick(c.xs), y1 = c.ys[c.arrows[x1 - 1][1]], x2 = d.until(() => d.pick(c.xs), (v) => v !== x1), y2 = c.ys[c.arrows[x2 - 1][1]];
            const wrongY = d.until(() => d.pick(c.ys), (v) => v !== y2), z = d.pick(out);
            const yes = [`정의역은 ${setOf(c.xs)}이다.`, `공역은 ${setOf(c.ys)}이다.`, `${is(at(FN, x1), y1)}이다.`, `치역의 원소는 ${R.length}개이다.`, `${jw(iq(z), '은/는')} 공역의 원소이지만 치역의 원소는 아니다.`];
            const no = [
              [`치역은 ${setOf(c.ys)}이다.`, `치역은 화살표를 받은 원소의 집합 ${setOf(R)}이다.`, yes[1]],
              [`${jw(iq(z), '은/는')} 치역의 원소이다.`, `${jw(iq(z), '은/는')} 화살표를 받지 않으므로 치역의 원소가 아니다.`, yes[4]],
              [`${is(at(FN, x2), wrongY)}이다.`, `${is(at(FN, x2), y2)}이다.`, ''],
              [`치역의 원소는 ${R.length + 1}개이다.`, `치역 ${jw(setOf(R), '의')} 원소는 ${R.length}개이다.`, yes[3]]
            ];
            return Object.assign(claimQ(d, `${head} 설명으로 옳지 않은 것은?`, yes, no, false), { figure });
          }, { count: 2 }),
          T('func-domain-meet-range', '정의역과 치역의 교집합', '①3', (d) => {
            const c = d.until(() => {
              const xs = range(1, 5), extra = d.shuffle([6, 7, 8, 9]).slice(0, 2), ys = d.shuffle(range(1, 5)).slice(0, 3).concat(extra).sort((p, q) => p - q);
              const arrows = xs.map((_, i) => [i, d.int(0, ys.length - 1)]), R = imageOf(arrows).map((j) => ys[j]);
              return { xs, ys, arrows, R, meet: R.filter((v) => xs.includes(v)) };
            }, (v) => v.meet.length >= 1 && v.meet.length < v.R.length && v.R.length >= 3);
            const both = c.ys.filter((v) => c.xs.includes(v)), union = [...new Set(c.xs.concat(c.R))].sort((p, q) => p - q);
            const rows = [[setOf(c.meet), true], [setOf(c.R), false], [setOf(both), false], [setOf(union), false]];
            const seen = new Set(), uniq = rows.filter((r) => { if (seen.has(r[0])) return false; seen.add(r[0]); return true; });
            return pickRows(d, `그림과 같은 함수 ${nb(`${FN} : ${SX} → ${SY}`)}의 정의역을 ${SX}, 치역을 ${FN}(${SX})라 할 때, 집합 ${nb(`${SX} ∩ ${FN}(${SX})`)}는?`, uniq, {
              figure: mapFig({ sets: [{ name: 'X', items: c.xs.map(String) }, { name: 'Y', items: c.ys.map(String) }], maps: [c.arrows], names: ['f'] }),
              explain: `치역은 ${is(FN + '(' + SX + ')', setOf(c.R))}이고 정의역은 ${is(SX, setOf(c.xs))}이므로 ${is(SX + ' ∩ ' + FN + '(' + SX + ')', setOf(c.meet))}이다. 공역 ${SY}와의 교집합이 아니다.`
            });
          }),
          T('func-formula-is-function', '식(규칙)으로 준 대응이 X에서 Y로의 함수인가', '①4', (d, n) => {
            if (n === 0) {
              const c = d.until(() => {
                const lo = d.pick([-2, -1]), xs = range(lo, lo + 2), ylo = d.pick([-1, 0, 1]), ys = range(ylo, ylo + d.pick([3, 4]));
                const pool = d.shuffle([
                  { h: `${X} ${sgn(1)}`, f: (x) => x + 1 }, { h: `${X} ${sgn(2)}`, f: (x) => x + 2 }, { h: `${MINUS}${X} ${sgn(1)}`, f: (x) => -x + 1 },
                  { h: `|${X}| ${sgn(1)}`, f: (x) => Math.abs(x) + 1 }, { h: `|${X}|`, f: (x) => Math.abs(x) }, { h: `${X2} ${sgn(-1)}`, f: (x) => x * x - 1 },
                  { h: `${X2} ${sgn(1)}`, f: (x) => x * x + 1 }, { h: `2${X} ${sgn(1)}`, f: (x) => 2 * x + 1 }, { h: `${X}${sup(3)} ${sgn(1)}`, f: (x) => x ** 3 + 1 },
                  { h: '2', f: () => 2 }, { h: `|2${X}| ${sgn(-1)}`, f: (x) => Math.abs(2 * x) - 1 }, { h: `${X2}`, f: (x) => x * x }
                ]).slice(0, 4);
                return { xs, ys, pool, flags: pool.map((p) => xs.every((x) => ys.includes(p.f(x)))) };
              }, (v) => v.flags.some(Boolean) && !v.flags.every(Boolean));
              return pickAll(d, `두 집합 ${is(SX, setOf(c.xs))}, ${is(SY, setOf(c.ys))}에 대하여 ${SX}에서 ${SY}로의 함수인 것만을 보기에서 있는 대로 고른 것은?`, c.pool.map((p) => [nb(`${Y} = ${p.h}`), c.flags[c.pool.indexOf(p)]]), {
                explain: c.pool.map((p, i) => `${KS[i]}. ${c.xs.map((x) => iq(p.f(x))).join(', ')}` + (c.flags[i] ? '(모두 Y의 원소)' : '(Y에 없는 값이 있다)')).join(' / ') + `. ${SX}의 각 원소에 대응하는 값이 모두 ${SY}에 들어야 함수이다.`
              });
            }
            // 규칙으로 준 대응
            const c = d.until(() => {
              const top = d.pick([4, 5]), xs = range(1, top), m = d.pick([2, 3]), k = top + 1;
              const pool = d.shuffle([
                { h: `|${X} ${sgn(-k)}|`, f: (x) => Math.abs(x - k) },
                { h: `(${X2}을 ${josa(m, '으로/로')} 나눈 나머지)`, f: (x) => (x * x) % m },
                { h: `(${X}의 약수의 개수)`, f: (x) => range(1, x).filter((v) => x % v === 0).length },
                { h: `(${X}보다 작은 자연수의 개수)`, f: (x) => x - 1 },
                { h: `(${X}와 ${top}의 최대공약수)`, f: (x) => gcd(x, top) },
                { h: `(${X}를 ${josa(m, '으로/로')} 나눈 나머지)`, f: (x) => x % m }
              ]).slice(0, 3);
              return { xs, pool, flags: pool.map((p) => xs.every((x) => xs.includes(p.f(x)))) };
            }, (v) => v.flags.some(Boolean) && !v.flags.every(Boolean));
            return pickAll(d, `집합 ${is(SX, setOf(c.xs))}에 대하여 ${SX}에서 ${SX}로의 함수인 것만을 보기에서 있는 대로 고른 것은?`, c.pool.map((p, i) => [nb(`${V(['f', 'g', 'h'][i])}(${X}) = `) + p.h, c.flags[i]]), {
              explain: c.pool.map((p, i) => `${KS[i]}. ${c.xs.map((x) => p.f(x)).join(', ')}` + (c.flags[i] ? '(모두 X의 원소)' : '(X에 없는 값이 있다)')).join(' / ') + `. ${SX}의 각 원소에 대응하는 값이 모두 ${SX}에 들어야 ${SX}에서 ${SX}로의 함수이다.`
            });
          }, { count: 2 }),
          T('func-finite-range', '정의역이 유한집합인 함수의 치역', '①5', (d) => {
            const c = d.until(() => {
              const k = d.pick([1, 2, 3]), xs = [k, 2 * k, 3 * k].map((v) => v + d.int(-1, 1)), quad = d.bool();
              const p = quad ? P(nz(d, -9, 9), d.int(-2, 2), d.pick([1, -1, 2])) : P(nz(d, -9, 9), nz(d, -4, 4));
              return { xs, p, ys: xs.map((x) => fl(pv(p, x))) };
            }, (v) => new Set(v.ys).size === 3 && v.ys.every((y) => Math.abs(y) <= 60) && v.xs.every((x) => x !== 0) && new Set(v.xs).size === 3);
            const sorted = c.ys.slice().sort((p, q) => p - q);
            return M(`정의역이 ${setOf(c.xs.slice().sort((u, v) => u - v))}인 함수 ${fdef(FN, c.p)}의 치역의 원소를 작은 것부터 차례로 구하시오.`, sorted.map((v) => ({ answer: v, signed: true })), {
              shown: setOf(sorted),
              explain: `${c.xs.map((x, i) => is(at(FN, x), c.ys[i])).join(', ')}이므로 치역은 ${setOf(sorted)}이다.`,
              facts: { calc: sorted.map((v, k) => [pjs(c.p, '(' + jn(c.xs[c.ys.indexOf(v)]) + ')'), k]) }
            });
          }),
          T('func-real-range', '실수에서 정의된 함수의 정의역과 치역', '①6', (d, n) => {
            if (n === 0) {
              const a = nz(d, -3, 3), q = nz(d, -9, 9), up = a > 0;
              return ineqAns(`함수 ${nb(`${Y} = ${pshow(P(q, 0, a))}`)}의 치역을 ${nb(`{${Y} | ${Y} ○ ${K}}`)}의 꼴로 나타낼 때, ${nb(`${Y} ○ ${K}`)}에 알맞은 부등식을 구하시오.`, up ? '>=' : '<=', q, Y, {
                explain: `모든 실수 ${X}에 대하여 ${nb(`${X2} ${GE} 0`)}이고 ${X2}의 계수가 ${up ? '양수' : '음수'}이므로 ${Y}의 값은 ${is(X, 0)}일 때 가장 ${up ? '작고' : '크고'} 그 값은 ${iq(q)}이다. 따라서 치역은 ${nb(`{${Y} | ${Y} ${up ? GE : LE} ${iq(q)}}`)}이다.`,
                facts: { calc: [[jn(q), 1]] }
              });
            }
            const k = nz(d, -9, 9), rows = [
              [`정의역: ${nb(`{${X} | ${X} ≠ 0인 실수}`)}, 치역: ${nb(`{${Y} | ${Y} ≠ 0인 실수}`)}`, true],
              [`정의역: 실수 전체의 집합, 치역: 실수 전체의 집합`, false],
              [`정의역: ${nb(`{${X} | ${X} ≠ 0인 실수}`)}, 치역: 실수 전체의 집합`, false],
              [`정의역: ${nb(`{${X} | ${X} ${GT} 0}`)}, 치역: ${nb(`{${Y} | ${Y} ${k > 0 ? GT : LT} 0}`)}`, false]
            ];
            return pickRows(d, `함수 ${nb(`${Y} = ${k < 0 ? MINUS : ''}${frac(Math.abs(k), X)}`)}의 정의역과 치역을 바르게 짝 지은 것은?`, rows, {
              explain: `분모가 0이 되는 ${X} = 0에서는 정의되지 않으므로 정의역은 0이 아닌 실수 전체이다. ${Y}의 값은 0이 될 수 없고 0이 아닌 모든 실수가 될 수 있으므로 치역은 0이 아닌 실수 전체이다.`
            });
          }, { count: 2 }),
          T('func-recursive', '자연수에서 되풀이 조건으로 정한 함수', '①30', (d, n) => {
            if (n === 0) {
              // f(2n) = f(n), f(2n − 1) = n + c
              const c = d.pick([-1, 0, 1, 2]), f = (m) => (m % 2 === 0 ? f(m / 2) : (m + 1) / 2 + c), cs = c ? (c > 0 ? '+' : '-') + Math.abs(c) : '';
              const t = d.int(1, 15) * 2 + 1, e = d.until(() => d.int(1, 4), (v) => t * 2 ** v >= 40 && t * 2 ** v <= 400), m1 = t * 2 ** e;
              const m2 = d.until(() => d.int(101, 399), (v) => v % 2 === 1 && v !== t);
              const tr = range(0, e).map((k) => m1 / 2 ** k);
              return M(`자연수 전체의 집합에서 정의된 함수 ${FN}가 모든 자연수 ${NN}에 대하여 다음 조건을 만족시킬 때, ${at(FN, m1)}, ${at(FN, m2)}의 값은?`, [{ lead: at(FN, m1) + ' =', answer: f(m1) }, { lead: at(FN, m2) + ' =', answer: f(m2) }], {
                figure: lines([`(가) ${nb(`${FN}(2${NN}) = ${FN}(${NN})`)}`, `(나) ${nb(`${FN}(2${NN} ${MINUS} 1) = ${NN}${c === 0 ? '' : ' ' + sgn(c)}`)}`]),
                shown: `${is(at(FN, m1), f(m1))}, ${is(at(FN, m2), f(m2))}`,
                explain: `(가)를 거듭 쓰면 ${tr.map((v) => at(FN, v)).join(' = ')}이고, ${is(t, nb(`2 × ${(t + 1) / 2} ${MINUS} 1`))}이므로 (나)에서 ${is(at(FN, m1), f(m1))}이다. ${is(m2, nb(`2 × ${(m2 + 1) / 2} ${MINUS} 1`))}이므로 ${is(at(FN, m2), f(m2))}이다.`,
                facts: { calc: [[`(${m1}/${2 ** e}+1)/2${cs}`, 0], [`(${m2}+1)/2${cs}`, 1]], unseen: [2 ** e, 1, 2] }
              });
            }
            // f(2n − 1) = p f(n), f(2n) = q − f(n)
            const p = d.pick([2, 3]), q = d.pick([1, 2, 3, 4]), memo = { 1: 0 };
            const f = (m) => { if (memo[m] != null) return memo[m]; const v = m % 2 ? p * f((m + 1) / 2) : q - f(m / 2); memo[m] = v; return v; };
            const fe = (m) => (m === 1 ? '0' : m % 2 ? `${p}*(${fe((m + 1) / 2)})` : `(${q}-(${fe(m / 2)}))`);
            const [m1, m2] = d.until(() => [d.int(1, 6) * 2 + 1, d.int(3, 8) * 2], ([u, v]) => f(u) !== 0 && f(v) !== f(u));
            const chain = (m) => { const out = []; let t = m; while (t > 1) { out.push(t); t = t % 2 ? (t + 1) / 2 : t / 2; } return out.reverse(); };
            const steps = [...new Set(chain(m1).concat(chain(m2)))].sort((u, v) => u - v);
            return M(`자연수 전체의 집합에서 정의된 함수 ${FN}가 모든 자연수 ${NN}에 대하여 다음 조건을 만족시킬 때, ${at(FN, m1)}, ${at(FN, m2)}의 값은?`, [{ lead: at(FN, m1) + ' =', answer: f(m1), signed: true }, { lead: at(FN, m2) + ' =', answer: f(m2), signed: true }], {
              figure: lines([`(가) ${nb(`${FN}(2${NN} ${MINUS} 1) = ${p}${FN}(${NN})`)}`, `(나) ${nb(`${FN}(2${NN}) = ${q} ${MINUS} ${FN}(${NN})`)}`]),
              shown: `${is(at(FN, m1), f(m1))}, ${is(at(FN, m2), f(m2))}`,
              explain: `(가)에 ${isj(NN, 1, '을/를')} 넣으면 ${nb(`${FN}(1) = ${p}${FN}(1)`)}이므로 ${is(at(FN, 1), 0)}이다. 차례로 ${steps.map((t) => is(at(FN, t), f(t))).join(', ')}이다.`,
              facts: { calc: [[fe(m1), 0], [fe(m2), 1]], unseen: [0] }
            });
          }, { count: 2 }),
          T('func-periodic', '주기 조건 f(x) = f(x + p)로 정한 함수', '①31', (d) => {
            const v0 = d.int(-3, 4), v1 = v0 + 2 * d.pick([1, 2, 3, -1, -2]), s = d.pick([0, 1]), N0 = d.until(() => d.int(9, 40), (v) => (v - s) % 3 !== 0);
            // 구간 [s, s + 3]: s ~ s + 1 은 (s, v0)와 (s + 1, v1)을 잇는 직선, s + 1 ~ s + 3 은 (s + 1, v1)과 (s + 3, v0)을 잇는 직선
            const a1 = v1 - v0, b1 = v0 - a1 * s, a2 = (v0 - v1) / 2, b2 = v1 - a2 * (s + 1), p1 = P(b1, a1), p2 = P(b2, a2);
            const red = s + (N0 - s) % 3, first = red <= s + 1, val = first ? a1 * red + b1 : a2 * red + b2;
            return ansV(`실수 전체의 집합에서 정의된 함수 ${FN}가 ${FN}(${X}) = ${pw([[pshow(p1), nb(`${s} ${LE} ${X} ${LE} ${s + 1}`)], [pshow(p2), nb(`${s + 1} ${LT} ${X} ${LE} ${s + 3}`)]])}이고, 모든 실수 ${X}에 대하여 ${nb(`${FN}(${X}) = ${FN}(${X} + 3)`)}을 만족시킬 때, ${at(FN, N0)}의 값은?`, Q(val), 'int', {
              explain: `${nb(`${FN}(${X}) = ${FN}(${X} + 3)`)}이므로 ${FN}의 값은 3만큼마다 되풀이된다. ${nb(`${N0} = 3 × ${(N0 - red) / 3} + ${red}`)}이므로 ${is(at(FN, N0), at(FN, red))}이다. ${jw(String(red), '은/는')} ${first ? '첫째' : '둘째'} 식의 범위에 들므로 ${is(at(FN, red), val)}이다.`,
              facts: { value: pjs(first ? p1 : p2, String(red)), unseen: [red] }
            });
          }),
          T('func-rational-split', '유리수·무리수로 나누어 정한 함수', '①32', (d) => {
            const a = nz(d, -3, 3), b = nz(d, -5, 5), c = nz(d, -6, 6), r = nz(d, -4, 6), s = d.pick([2, 3, 5, 6, 7]), ratFirst = d.bool();
            const fr = (x) => a * x + b, fi = (t2) => t2 + c;   // 무리수 √s 에서는 x² + c = s + c
            const rows = ratFirst ? [[pshow(P(b, a)), `${X}는 유리수`], [pshow(P(c, 0, 1)), `${X}는 무리수`]] : [[pshow(P(c, 0, 1)), `${X}는 무리수`], [pshow(P(b, a)), `${X}는 유리수`]];
            const root = rt(s);
            return vals(`실수 전체의 집합에서 정의된 함수 ${FN}가 ${FN}(${X}) = ${pw(rows)}일 때, ${at(FN, r)}, ${FN}(${root})의 값은?`, [[at(FN, r), fr(r)], [FN + '(' + root + ')', fi(s)]], {
              explain: `${jw(iq(r), '은/는')} 유리수이므로 ${is(at(FN, r), fr(r))}이다. ${root}${josa(s, '은/는').slice(String(s).length)} 무리수이므로 ${nb(`${FN}(${root}) = (${root})${sup(2)} ${sgn(c)} = ${iq(fi(s))}`)}이다.`,
              facts: { calc: [[pjs(P(b, a), '(' + jn(r) + ')'), 0], [`${s}+${jn(c)}`, 1]] }
            });
          })
        ]
      },
      // ── 서로 같은 함수 ──
      {
        id: 'same', title: '서로 같은 함수', standard: S1,
        types: [
          T('same-pick', '두 함수가 서로 같은지 가리기', '①8', (d) => {
            const xs = [-1, 0, 1];
            const POOL = [
              [`${X}`, (x) => x, `${X}${sup(3)}`, (x) => x ** 3], [`|${X}|`, (x) => Math.abs(x), `${X2}`, (x) => x * x],
              [`${MINUS}|${X}| ${sgn(-1)}`, (x) => -Math.abs(x) - 1, `${MINUS}${X2} ${sgn(-1)}`, (x) => -x * x - 1], [`${X2} ${sgn(-3)}`, (x) => x * x - 3, `|${X}| ${sgn(-3)}`, (x) => Math.abs(x) - 3],
              [`${X} ${sgn(-2)}`, (x) => x - 2, `${X} ${sgn(2)}`, (x) => x + 2], [`2${X}`, (x) => 2 * x, `${MINUS}2${X}`, (x) => -2 * x],
              [`${X2}`, (x) => x * x, `${X}`, (x) => x], [`${X}${sup(3)}`, (x) => x ** 3, `${MINUS}${X}`, (x) => -x],
              [`${X2} ${sgn(1)}`, (x) => x * x + 1, `|${X}| ${sgn(1)}`, (x) => Math.abs(x) + 1], [`2${X2}`, (x) => 2 * x * x, `2|${X}|`, (x) => 2 * Math.abs(x)]
            ];
            const c = d.until(() => d.shuffle(POOL).slice(0, 3), (rows) => { const t = rows.map((r) => xs.every((x) => r[1](x) === r[3](x))); return t.some(Boolean) && !t.every(Boolean); });
            const flags = c.map((r) => xs.every((x) => r[1](x) === r[3](x)));
            return pickAll(d, `정의역이 ${setOf(xs)}인 두 함수 ${FN}, ${GN}가 서로 같은 것만을 보기에서 있는 대로 고른 것은?`, c.map((r, i) => [`${nb(`${FN}(${X}) = ${r[0]}`)}, ${nb(`${GN}(${X}) = ${r[2]}`)}`, flags[i]]), {
              explain: c.map((r, i) => `${KS[i]}. ${FN}: ${xs.map((x) => iq(r[1](x))).join(', ')} / ${GN}: ${xs.map((x) => iq(r[3](x))).join(', ')}` + (flags[i] ? '(같다)' : '(다르다)')).join('; ') + `. 정의역의 모든 원소에서 함숫값이 같으면 식이 달라도 서로 같은 함수이다.`
            });
          }),
          T('same-find-coef', 'f = g일 때 미지수 구하기', '①9', (d) => {
            const [p, q] = d.until(() => [nz(d, -3, 3), d.int(-2, 4)], ([u, v]) => u !== v && u + v !== 0 && v !== 0);
            if (d.bool()) {
              // f = x² + a, g = bx + k → b = p + q, a = pq + k
              const k = nz(d, -9, 9), b = p + q, a = p * q + k;
              if (a === 0) return null;
              return vals(`정의역이 ${setOf([Math.min(p, q), Math.max(p, q)])}인 두 함수 ${nb(`${FN}(${X}) = ${X2} + ${A}`)}, ${nb(`${GN}(${X}) = ${BB}${X} ${sgn(k)}`)}에 대하여 ${nb(`${FN} = ${GN}`)}일 때, 상수 ${A}, ${jw(BB, '의')} 값은?`, [[A, a], [BB, b]], {
                explain: `${is(at(FN, p), at(GN, p))}에서 ${nb(`${iq(p * p)} + ${A} = ${iq(p)}${BB} ${sgn(k)}`)}, ${is(at(FN, q), at(GN, q))}에서 ${nb(`${iq(q * q)} + ${A} = ${iq(q)}${BB} ${sgn(k)}`)}이다. 두 식을 빼면 ${is(BB, b)}, 대입하면 ${is(A, a)}이다.`,
                facts: { calc: [[`${jn(p)}*${jn(q)}+${jn(k)}`, 0], [`${jn(p)}+${jn(q)}`, 1]] }
              });
            }
            // f = ax + b, g = x² + mx + k → a = p + q + m, b = g(p) − ap
            const m = d.int(-3, 3), k = nz(d, -6, 6), a = p + q + m, g = (x) => x * x + m * x + k, b = g(p) - a * p, gP = P(k, m, 1);
            if (a === 0 || b === 0) return null;
            const aE = `(${pjs(gP, '(' + jn(p) + ')')}-(${pjs(gP, '(' + jn(q) + ')')}))/(${jn(p)}-${jn(q)})`;
            return vals(`정의역이 ${setOf([Math.min(p, q), Math.max(p, q)])}인 두 함수 ${nb(`${FN}(${X}) = ${A}${X} + ${BB}`)}, ${fdef(GN, gP)}에 대하여 ${nb(`${FN} = ${GN}`)}일 때, 상수 ${A}, ${jw(BB, '의')} 값은?`, [[A, a], [BB, b]], {
              explain: `${is(at(GN, p), g(p))}, ${is(at(GN, q), g(q))}이므로 ${nb(`${iq(p)}${A} + ${BB} = ${iq(g(p))}`)}, ${nb(`${iq(q)}${A} + ${BB} = ${iq(g(q))}`)}이다. 연립하면 ${is(A, a)}, ${is(BB, b)}이다.`,
              facts: { calc: [[aE, 0], [`${pjs(gP, '(' + jn(p) + ')')}-(${aE})*${jn(p)}`, 1]] }
            });
          }),
          T('same-count-domain', 'f = g가 되는 정의역 X의 개수', '①10', (d, n) => {
            if (n === 0) {
              const r1 = d.int(-4, 4), r2 = d.pick([r1, r1, d.int(-4, 4)]), al = nz(d, -4, 4), be = nz(d, -6, 6);
              const ga = al + r1 + r2, de = be - r1 * r2, roots = [...new Set([r1, r2])];
              if (ga === 0 || de === 0) return null;
              const fP = P(be, al, 1), gP = P(de, ga);
              return N(`정의역이 집합 ${SX}이고 공역이 실수 전체의 집합인 두 함수 ${fdef(FN, fP)}, ${fdef(GN, gP)}에 대하여 ${nb(`${FN} = ${GN}`)}를 만족시키는 집합 ${jw(SX, '의')} 개수는? (단, ${nb(`${SX} ≠ ∅`)})`, 2 ** roots.length - 1, {
                explain: `${is(at(FN, X), at(GN, X))}에서 ${nb(`${pshow(P(be - de, al - ga, 1))} = 0`)}, ${nb(`${facs([r1, r2])} = 0`)}이므로 ${roots.length === 1 ? is(X, r1) : `${is(X, r1)} 또는 ${is(X, r2)}`}이다. ${SX}는 공집합이 아닌 ${jw(setOf(roots), '의')} 부분집합이므로 ${2 ** roots.length - 1}개이다.`,
                facts: { value: `2**${roots.length}-1`, unseen: [2, roots.length, 1], rule: 'count-quad' }
              });
            }
            const rs = d.until(() => { const a = d.int(-3, 3), b = d.int(-3, 3), c2 = d.pick([a, d.int(-3, 3)]); return [a, b, c2]; }, (v) => new Set(v).size >= 2 && v.every((x) => Math.abs(x) <= 3));
            const s1 = rs[0] + rs[1] + rs[2], s2 = rs[0] * rs[1] + rs[1] * rs[2] + rs[0] * rs[2], s3 = rs[0] * rs[1] * rs[2], al = nz(d, -3, 3);
            const be = al + s1, ga = -s2, de = s3, roots = [...new Set(rs)].sort((p, q) => p - q);
            const fP = [Q(0), Q(0), Q(al), Q(1)], gP = P(de, ga, be);
            if (pTrim(gP).length < 2) return null;
            const fac = facs(rs);
            return N(`정의역이 집합 ${SX}이고 공역이 실수 전체의 집합인 두 함수 ${nb(`${FN}(${X}) = ${poly([[1, X + sup(3)], [al, X2]])}`)}, ${fdef(GN, gP)}에 대하여 ${nb(`${FN} = ${GN}`)}를 만족시키는 집합 ${jw(SX, '의')} 개수는? (단, ${nb(`${SX} ≠ ∅`)})`, 2 ** roots.length - 1, {
              explain: `${is(at(FN, X), at(GN, X))}에서 ${nb(`${poly([[1, X + sup(3)], [-s1, X2], [s2, X], [-s3, '']])} = 0`)}, ${nb(`${fac} = 0`)}이므로 ${X}의 값은 ${roots.map(iq).join(', ')}이다. ${SX}는 공집합이 아닌 ${jw(setOf(roots), '의')} 부분집합이므로 ${2 ** roots.length - 1}개이다.`,
              facts: { value: `2**${roots.length}-1`, unseen: [2, roots.length, 1], rule: 'count-cubic' }
            });
          }, { count: 2 }),
          T('same-domain-elements', 'f = g가 되는 정의역 {a, b}의 원소', '①11', (d) => {
            const [r1, r2] = d.until(() => [d.int(-6, 4), d.int(-3, 7)], ([u, v]) => u < v && u !== 0 && v !== 0);
            const be = nz(d, -6, 6), ga = nz(d, -5, 5), al = ga - r1 - r2, de = be - r1 * r2;   // x² + αx + β − (γx + δ) = (x − r1)(x − r2)
            if (de === 0) return null;
            return vals(`집합 ${is(SX, setOf([A, BB]))}에서 실수 전체의 집합으로의 두 함수 ${fdef(FN, P(be, al, 1))}, ${fdef(GN, P(de, ga))}에 대하여 ${nb(`${FN} = ${GN}`)}일 때, ${A}, ${jw(BB, '의')} 값은? (단, ${nb(`${A} ${LT} ${BB}`)})`, [[A, r1], [BB, r2]], {
              explain: `${A}, ${BB}는 모두 ${is(at(FN, X), at(GN, X))}를 만족시킨다. ${nb(`${pshow(P(be - de, al - ga, 1))} = 0`)}, ${nb(`${facs([r1, r2])} = 0`)}에서 ${is(X, r1)} 또는 ${is(X, r2)}이므로 ${is(A, r1)}, ${is(BB, r2)}이다.`,
              facts: { calc: [[jn(r1), 0], [jn(r2), 1]], unseen: [Math.abs(r1), Math.abs(r2)] }
            });
          })
        ]
      },
      // ── 함수의 그래프 ──
      {
        id: 'graph', title: '함수의 그래프', standard: S1,
        types: [
          T('graph-pick', '함수의 그래프인 것 고르기', '①12', (d) => {
            const yes = d.shuffle(['rise', 'cup', 'vee', 'cubic', 'flat', 'wave', 'cap']).slice(0, 2), no = d.shuffle(['circle', 'upright', 'side']).slice(0, 2);
            const keys = d.shuffle(yes.concat(no)), flags = keys.map((k) => SHAPES[k].fn);
            const why = { circle: '(원)은 y축에 평행한 직선과 두 점에서 만나는 곳이 있어', upright: '(y축에 평행한 직선)은 한 x의 값에 y의 값이 무수히 많이 대응하여', side: '(옆으로 누운 포물선)은 y축에 평행한 직선과 두 점에서 만나는 곳이 있어' };
            return twoOf(d, `다음 중 함수의 그래프인 것만을 있는 대로 고른 것은?`, picks(keys.map((k, i) => shapeFig(k, LAB[i]))), flags,
              `함수의 그래프는 정의역의 각 원소 ${A}에 대하여 직선 ${is(X, A)}와 오직 한 점에서 만난다. ` + keys.map((k, i) => (flags[i] ? '' : `${LAB[i]}${why[k]} 함수의 그래프가 아니다.`)).filter(Boolean).join(' '));
          }),
          T('graph-points', '정의역이 유한집합인 함수의 그래프 고르기', '①13', (d) => {
            const c = d.until(() => {
              const xs = d.shuffle([-2, -1, 1, 2, 3]).slice(0, 3).sort((p, q) => p - q), quad = d.bool();
              const p = quad ? P(d.int(-1, 1), 0, 1) : P(d.int(-1, 2), pm(d));
              const ys = xs.map((x) => fl(pv(p, x)));
              return { xs, p, ys, quad };
            }, (v) => v.ys.every((y) => y >= -2 && y <= 4) && new Set(v.xs.map((x, i) => x + ',' + v.ys[i])).size === 3);
            const box = { x: [-3, 4], y: [-3, 5] };
            const sets = [
              { pts: c.xs.map((x, i) => [x, c.ys[i]]), ok: true },
              { pts: c.xs.map((x, i) => [x, c.ys[i] + 1]) },
              { pts: c.xs.map((x, i) => [x, -c.ys[i]]) },
              { line: true }
            ];
            const valid = (pts) => pts.every(([x, y]) => y >= box.y[0] && y <= box.y[1]);
            if (!valid(sets[1].pts) || !valid(sets[2].pts) || sets[2].pts.every(([x, y], i) => y === c.ys[i])) return null;
            // O 는 원점 둘레의 네 자리(왼쪽 아래, 오른쪽 아래, 왼쪽 위, 오른쪽 위) 가운데 점·곡선에서 가장 먼 곳에 적는다(아래를 먼저).
            const near = (s) => (s.line ? samp((x) => fl(pv(c.p, x)), -1.5, 1.5, 60) : s.pts);
            const spot = (s) => [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy]) => ({ sx, sy, gap: Math.min(...near(s).map(([x, y]) => Math.hypot(x - sx * 0.6, y - sy * 0.6))) }))
              .reduce((best, o) => (o.gap > best.gap + 0.05 ? o : best));
            const order = d.shuffle(sets), figs = order.map((s, k) => gfig({
              x: box.x, y: box.y, small: true, grid: true, oRight: spot(s).sx > 0, oUp: spot(s).sy > 0,
              curves: s.line ? [{ pts: samp((x) => fl(pv(c.p, x)), -3, 4) }] : [], dots: s.line ? [] : s.pts.map(([x, y]) => ({ x, y })),
              say: `그래프 ${LAB[k]}: 모눈 한 칸은 1이다. ` + (s.line ? `점이 아닌 ${c.quad ? '곡선' : '직선'}으로 이어진 그래프.` : `점 ${s.pts.length}개: ` + s.pts.map(([x, y]) => `원점에서 ${x > 0 ? '오른쪽' : '왼쪽'}으로 ${Math.abs(x)}칸${y ? `, ${y > 0 ? '위쪽' : '아래쪽'}으로 ${Math.abs(y)}칸` : ''} 간 곳`).join(' / ') + '.')
            }));
            return oneOf(`정의역이 ${setOf(c.xs)}인 함수 ${fdef(FN, c.p)}의 그래프는? (단, 모눈 한 칸의 길이는 1이다.)`, picks(figs), order.map((s) => Boolean(s.ok)),
              `함수의 그래프는 순서쌍 ${nb(`(${X}, ${FN}(${X}))`)} 전체의 집합 ${setOf(c.xs.map((x, i) => nb(`(${iq(x)}, ${iq(c.ys[i])})`)))}이다. 정의역이 세 원소뿐이므로 그래프는 점 세 개이다.`);
          })
        ]
      },
      // ── 여러 가지 함수 ──
      {
        id: 'kinds', title: '일대일함수·일대일대응·항등함수·상수함수', standard: S1,
        types: [
          T('kinds-onto-graph', '일대일대응의 그래프 고르기', '①14', (d) => {
            const yes = d.shuffle(['rise', 'fall', 'cubic', 'bent']).slice(0, 2), no = d.shuffle(['cup', 'cap', 'vee', 'flat', 'clamp', 'gap', 'wave']).slice(0, 2);
            const keys = d.shuffle(yes.concat(no)), flags = keys.map((k) => SHAPES[k].inj && SHAPES[k].onto);
            const why = { cup: '같은 높이의 두 점이 있어 일대일함수가 아니다', cap: '같은 높이의 두 점이 있어 일대일함수가 아니다', vee: '같은 높이의 두 점이 있어 일대일함수가 아니다', flat: '모든 x에 같은 값이 대응하는 상수함수이다', clamp: '같은 높이의 점이 무수히 많아 일대일함수가 아니다', gap: '일대일함수이지만 −1 이상 1 미만의 값은 치역에 없어 치역과 공역이 같지 않다', wave: '같은 높이의 점이 셋인 곳이 있어 일대일함수가 아니다' };
            return twoOf(d, `정의역과 공역이 모두 실수 전체의 집합인 함수의 그래프가 다음과 같을 때, 일대일대응의 그래프인 것만을 있는 대로 고른 것은?`, picks(keys.map((k, i) => shapeFig(k, LAB[i]))), flags,
              `일대일대응은 일대일함수이면서 치역과 공역이 같은 함수이다. x축에 평행한 직선과 언제나 한 점에서 만나는 그래프를 찾는다. ` + keys.map((k, i) => (flags[i] ? '' : `${LAB[i]}${josa(1, '은/는').slice(1)} ${why[k]}.`)).filter(Boolean).join(' '));
          }),
          T('kinds-one-one-graph', '정의 문장으로 일대일함수의 그래프 고르기', '①15', (d) => {
            const right = d.pick(['rise', 'fall', 'cubic', 'gap', 'bent']), others = d.shuffle(['cup', 'cap', 'vee', 'flat', 'clamp', 'wave']).slice(0, 3);
            const keys = d.shuffle([right].concat(others)), flags = keys.map((k) => k === right);
            return oneOf(`정의역과 공역이 모두 실수 전체의 집합인 함수 ${nb(`${Y} = ${FN}(${X})`)}의 그래프 가운데 「정의역의 임의의 두 원소 ${X}<sub>1</sub>, ${X}<sub>2</sub>에 대하여 ${nb(`${X}<sub>1</sub> ≠ ${X}<sub>2</sub>`)}이면 ${nb(`${FN}(${X}<sub>1</sub>) ≠ ${FN}(${X}<sub>2</sub>)`)}이다.」를 만족시키는 것은?`, picks(keys.map((k, i) => shapeFig(k, LAB[i]))), flags,
              `주어진 조건을 만족시키는 함수는 일대일함수이다. x축에 평행한 어떤 직선과도 두 점 이상에서 만나지 않는 그래프는 ${LAB[keys.indexOf(right)]}뿐이다.`);
          }),
          T('kinds-id-const-graph', '항등함수·상수함수의 그래프 고르기', '①16', (d) => {
            const c = d.pick([2, -2]), v = d.pick([1, 2]);
            const G = {
              id: { pts: [[-3.2, -3.2], [3.2, 3.2]], dots: [{ x: 2, y: 2 }], dash: [[2, 0, 2, 2], [0, 2, 2, 2]], nums: { x: [{ v: 2 }], y: [{ v: 2 }] }, oRight: true, say: '원점과 점 (2, 2)를 지나는 직선' },
              const: { pts: [[-3.2, c], [3.2, c]], nums: { x: [], y: [{ v: c, above: c > 0, below: c < 0 }] }, say: `y축 위의 ${plain(Q(c))}인 점을 지나고 x축에 평행한 직선` },
              neg: { pts: [[-3.2, 3.2], [3.2, -3.2]], dots: [{ x: 2, y: -2 }], dash: [[2, 0, 2, -2], [0, -2, 2, -2]], nums: { x: [{ v: 2, up: true }], y: [{ v: -2 }] }, say: '원점과 점 (2, −2)를 지나는 직선' },
              upright: { pts: [[v, -3.2], [v, 3.2]], nums: { x: [{ v, dx: 4 }], y: [] }, say: `x축 위의 ${v}인 점을 지나고 y축에 평행한 직선` },
              steep: { pts: [[-1.6, -3.2], [1.6, 3.2]], dots: [{ x: -1, y: -2 }], dash: [[-1, 0, -1, -2], [0, -2, -1, -2]], nums: { x: [{ v: -1, up: true }], y: [{ v: -2, right: true }] }, oRight: true, say: '원점과 점 (−1, −2)를 지나는 직선' }
            };
            const keys = d.shuffle(['id', 'const', d.pick(['neg', 'steep']), 'upright']);
            const figs = keys.map((k, i) => gfig({ x: R4, y: R4, small: true, curves: [{ pts: G[k].pts }], dots: G[k].dots || [], dashes: G[k].dash || [], xnums: G[k].nums.x, ynums: G[k].nums.y, oRight: G[k].oRight, say: `그래프 ${LAB[i]}: ${G[k].say}.` }));
            const iId = keys.indexOf('id'), iC = keys.indexOf('const'), others = [0, 1, 2, 3].filter((i) => i !== iId && i !== iC);
            const rows = [[`항등함수: ${LAB[iId]}, 상수함수: ${LAB[iC]}`, true], [`항등함수: ${LAB[others[0]]}, 상수함수: ${LAB[iC]}`, false], [`항등함수: ${LAB[iId]}, 상수함수: ${LAB[others[1]]}`, false], [`항등함수: ${LAB[iC]}, 상수함수: ${LAB[iId]}`, false]];
            return pickRows(d, `다음 그래프 가운데 항등함수의 그래프와 상수함수의 그래프를 바르게 고른 것은?`, rows, {
              figure: picks(figs),
              explain: `항등함수 ${is(at(FN, X), X)}의 그래프는 원점과 점 (2, 2)를 지나는 직선이고, 상수함수의 그래프는 ${X}축에 평행한 직선이다. ${X}축에 수직인 직선은 함수의 그래프가 아니다.`
            });
          }),
          T('kinds-formula', '식으로 준 함수 가리기', '①17', (d, n) => {
            const a = nz(d, -5, 5), b = nz(d, -6, 6), k = d.pick([2, 3, 4]), c0 = nz(d, -5, 5);
            const POOL = {
              lin: { h: nb(`${Y} = ${pshow(P(b, a))}`), onto: true, kind: 'none' },
              const: { h: nb(`${Y} = ${iq(c0)}`), onto: false, kind: 'const' },
              id: { h: nb(`${Y} = ${X}`), onto: true, kind: 'id' },
              neg: { h: nb(`${Y} = ${MINUS}${X}`), onto: true, kind: 'none' },
              quad: { h: nb(`${Y} = ${pshow(P(d.int(-3, 3), 0, d.pick([1, -1, 2])))}`), onto: false, kind: 'none' },
              abs: { h: nb(`${Y} = |${X}|`), onto: false, kind: 'none' },
              pieceOk: { h: `${Y} = ${pw([[X2, `${X} ${GE} 0`], [`${k}${X}`, `${X} ${LT} 0`]])}`, onto: true, kind: 'none' },
              pieceBad: { h: `${Y} = ${pw([[X2, `${X} ${GE} 0`], [`${MINUS}${k}${X}`, `${X} ${LT} 0`]])}`, onto: false, kind: 'none' },
              vert: { h: nb(`${X} = ${iq(c0)}`), onto: false, kind: 'notfn' }
            };
            if (n === 0) {
              const keys = d.until(() => d.shuffle(Object.keys(POOL)).slice(0, 4), (ks) => ks.some((q) => POOL[q].onto) && !ks.every((q) => POOL[q].onto) && (ks.includes('pieceOk') || ks.includes('pieceBad')));
              return pickAll(d, `다음 중 실수 전체의 집합에서 실수 전체의 집합으로의 일대일대응인 것만을 보기에서 있는 대로 고른 것은?`, keys.map((q) => [POOL[q].h, POOL[q].onto]), {
                explain: keys.map((q, i) => `${KS[i]}${josa(1, '은/는').slice(1)} ` + (POOL[q].onto ? '일대일함수이고 치역이 실수 전체이므로 일대일대응이다' : q === 'vert' ? '한 x의 값에 y의 값이 무수히 많아 함수가 아니다' : q === 'const' ? '상수함수이다' : q === 'pieceBad' ? `${X} ${GE} 0인 쪽과 ${X} ${LT} 0인 쪽의 함숫값이 모두 양수인 곳에서 겹쳐 일대일함수가 아니다` : '같은 함숫값을 갖는 서로 다른 두 원소가 있어 일대일함수가 아니다')).join('. ') + '.'
              });
            }
            const keys = d.shuffle(['id', 'const', 'vert', 'neg']), iId = keys.indexOf('id'), iC = keys.indexOf('const'), iV = keys.indexOf('vert'), iN = keys.indexOf('neg');
            const ksj = (idx) => idx.slice().sort((u, v) => u - v).map((i) => KS[i]).join(', ');
            const rows = [[`항등함수: ${KS[iId]}, 상수함수: ${KS[iC]}`, true], [`항등함수: ${KS[iId]}, 상수함수: ${ksj([iC, iV])}`, false], [`항등함수: ${ksj([iId, iN])}, 상수함수: ${KS[iC]}`, false], [`항등함수: ${KS[iN]}, 상수함수: ${KS[iV]}`, false]];
            return pickRows(d, `보기의 식 가운데 실수 전체의 집합에서의 항등함수와 상수함수를 바르게 고른 것은?`, rows, {
              figure: lines(keys.map((q, i) => tag(KS[i]) + POOL[q].h)),
              explain: `${KS[iId]}${josa(1, '은/는').slice(1)} 각 원소에 그 자신이 대응하는 항등함수, ${KS[iC]}${josa(1, '은/는').slice(1)} 모든 원소에 같은 값이 대응하는 상수함수이다. ${KS[iN]}${josa(1, '은/는').slice(1)} 일대일대응이지만 항등함수가 아니고, ${KS[iV]}${josa(1, '은/는').slice(1)} 함수가 아니다.`
            });
          }, { count: 2 }),
          T('kinds-map', '대응 그림으로 준 함수 가리기', '①18', (d, n) => {
            const xs = ['1', '2', '3'];
            const MAKE = {
              onto: () => ({ ys: ['a', 'b', 'c'], arrows: d.shuffle([0, 1, 2]).map((j, i) => [i, j]) }),
              inj: () => { const js_ = d.shuffle([0, 1, 2, 3]).slice(0, 3); return { ys: ['a', 'b', 'c', 'd'], arrows: js_.map((j, i) => [i, j]) }; },
              const: () => { const j = d.int(0, 2); return { ys: ['a', 'b', 'c'], arrows: [0, 1, 2].map((i) => [i, j]) }; },
              many: () => { const [p, q] = d.shuffle([0, 1, 2]).slice(0, 2), r = d.pick([p, q]); return { ys: ['a', 'b', 'c'], arrows: [[0, p], [1, q], [2, r]] }; }
            };
            const keys = d.shuffle(['onto', 'inj', 'const', 'many']), cases = keys.map((k) => MAKE[k]());
            const figs = cases.map((c, i) => mapFig({ sets: [{ name: 'X', items: xs }, { name: 'Y', items: c.ys }], maps: [c.arrows], small: true }).replace('대응 그림:', `대응 그림 ${LAB[i]}:`));
            const note = `일대일함수는 서로 다른 원소에 서로 다른 원소가 대응하는 함수이고, 그 가운데 치역과 공역이 같은 것이 일대일대응이다. ${LAB[keys.indexOf('inj')]}${josa(1, '은/는').slice(1)} 일대일함수이지만 ${SY}의 원소 하나가 남아 일대일대응이 아니다. ${keys.map((k, i) => (k === 'const' || k === 'many' ? LAB[i] : '')).filter(Boolean).join(', ')}${josa(1, '은/는').slice(1)} ${SX}의 서로 다른 원소가 ${SY}의 같은 원소에 대응하므로 일대일함수가 아니다.`;
            if (n === 0) return oneOf(`다음 중 집합 ${SX}에서 집합 ${SY}로의 일대일대응인 것은?`, picks(figs), keys.map((k) => k === 'onto'), note);
            return twoOf(d, `다음 중 집합 ${SX}에서 집합 ${SY}로의 일대일함수인 것만을 있는 대로 고른 것은?`, picks(figs), keys.map((k) => k === 'onto' || k === 'inj'), note);
          }, { count: 2 }),
          T('kinds-life', '생활 속 대응이 어떤 함수인가', '①7', (d) => {
            const s = d.pick(LIFE), order = d.shuffle(Object.keys(LIFE_OPT));
            return pickRows(d, `${s.text} 이 대응에 대한 설명으로 옳은 것은?`, order.map((k) => [LIFE_OPT[k], k === s.kind]), { keep: true, explain: s.why });
          }),
          T('kinds-interval-linear', '정의역이 구간인 일차함수가 일대일대응이 되는 계수', '①19', (d, n) => {
            const c = d.until(() => { const p = d.int(-3, 2), len = d.pick([1, 2, 3, 4]), a = pm(d) * d.pick([1, 2, 3]), r = d.int(-6, 3); return { p, q: p + len, a, r, s: r + Math.abs(a) * len }; }, (v) => v.p !== 0 || true);
            const bA = c.a > 0 ? c.r - c.a * c.p : c.s - c.a * c.p;   // a > 0 이면 f(p) = r, a < 0 이면 f(p) = s
            const XI = nb(`{${X} | ${iq(c.p)} ${LE} ${X} ${LE} ${iq(c.q)}}`), YI = nb(`{${Y} | ${iq(c.r)} ${LE} ${Y} ${LE} ${iq(c.s)}}`);
            if (n === 0) {
              if (bA === 0) return null;
              return vals(`두 집합 ${is(SX, XI)}, ${is(SY, YI)}에 대하여 ${SX}에서 ${SY}로의 함수 ${nb(`${FN}(${X}) = ${A}${X} + ${BB}`)}가 일대일대응일 때, 상수 ${A}, ${jw(BB, '의')} 값은? (단, ${nb(`${A} ${c.a > 0 ? GT : LT} 0`)})`, [[A, c.a], [BB, bA]], {
                explain: `일대일대응이므로 치역이 ${SY}이다. ${nb(`${A} ${c.a > 0 ? GT : LT} 0`)}이면 ${c.a > 0 ? `${is(at(FN, c.p), c.r)}, ${is(at(FN, c.q), c.s)}` : `${is(at(FN, c.p), c.s)}, ${is(at(FN, c.q), c.r)}`}이므로 연립하면 ${is(A, c.a)}, ${is(BB, bA)}이다.`,
                facts: { calc: c.a > 0 ? [[`(${jn(c.s)}-${jn(c.r)})/(${jn(c.q)}-${jn(c.p)})`, 0], [`${jn(c.r)}-(${jn(c.s)}-${jn(c.r)})/(${jn(c.q)}-${jn(c.p)})*${jn(c.p)}`, 1]] : [[`(${jn(c.r)}-${jn(c.s)})/(${jn(c.q)}-${jn(c.p)})`, 0], [`${jn(c.s)}-(${jn(c.r)}-${jn(c.s)})/(${jn(c.q)}-${jn(c.p)})*${jn(c.p)}`, 1]], rule: 'interval-coef' }
              });
            }
            if (n === 1) {
              // 정의역의 한 끝 k 와 상수항 b: X = {p ≤ x ≤ k}, f = mx + b (m > 0)
              const m = Math.abs(c.a), b = c.r - m * c.p;
              if (b === 0 || c.q === 0) return null;
              return vals(`두 집합 ${is(SX, nb(`{${X} | ${iq(c.p)} ${LE} ${X} ${LE} ${K}}`))}, ${is(SY, YI)}에 대하여 ${SX}에서 ${SY}로의 함수 ${nb(`${FN}(${X}) = ${m === 1 ? '' : m}${X} + ${BB}`)}가 일대일대응일 때, 상수 ${K}, ${jw(BB, '의')} 값은?`, [[K, c.q], [BB, b]], {
                explain: `${FN}의 기울기가 양수이므로 ${is(at(FN, c.p), c.r)}, ${is(at(FN, K), c.s)}이다. 첫째 식에서 ${is(BB, b)}이고, 둘째 식 ${nb(`${mono(m, K)} ${sgn(b)} = ${iq(c.s)}`)}에서 ${is(K, c.q)}이다.`,
                facts: { calc: [[`(${jn(c.s)}-(${jn(c.r)}-${m}*${jn(c.p)}))/${m}`, 0], [`${jn(c.r)}-${m}*${jn(c.p)}`, 1]], unseen: m === 1 ? [1] : [], rule: 'interval-end' }
              });
            }
            // 기울기의 부호를 주지 않는다: (a, b)가 둘
            const up = Math.abs(c.a), b1 = c.r - up * c.p, b2 = c.s + up * c.p;
            const pair = (a, b) => nb(`(${iq(a)}, ${iq(b)})`);
            const rows = [[`${pair(up, b1)}, ${pair(-up, b2)}`, true], [`${pair(up, b1)}뿐`, false], [`${pair(-up, b2)}뿐`, false], [`${pair(up, b1)}, ${pair(-up, b1 === b2 ? b2 + 1 : b1)}`, false]];
            return pickRows(d, `두 집합 ${is(SX, XI)}, ${is(SY, YI)}에 대하여 ${SX}에서 ${SY}로의 함수 ${nb(`${FN}(${X}) = ${A}${X} + ${BB}`)}가 일대일대응일 때, 상수 ${A}, ${BB}의 순서쌍 ${nb(`(${A}, ${BB})`)}를 모두 구한 것은?`, rows, {
              explain: `기울기가 양수이면 ${is(at(FN, c.p), c.r)}, ${is(at(FN, c.q), c.s)}에서 ${pair(up, b1)}, 기울기가 음수이면 ${is(at(FN, c.p), c.s)}, ${is(at(FN, c.q), c.r)}에서 ${pair(-up, b2)}이다. 두 경우를 모두 따져야 한다.`
            });
          }, { count: 3 }),
          T('kinds-interval-quad', '이차함수가 구간에서 일대일대응이 되는 상수', '①20', (d, n) => {
            if (n === 0) {
              const h = d.int(-2, 3), p = h + d.int(0, 2), r = d.int(-4, 5), up = d.bool(), a = up ? 1 : -1;
              const k = r - a * (p * p - 2 * h * p);   // f(p) = a(p² − 2hp) + k = r
              const fP = P(k, -2 * a * h, a);
              if (k === 0 || h === 0) return null;
              return N(`두 집합 ${is(SX, nb(`{${X} | ${X} ${GE} ${iq(p)}}`))}, ${is(SY, nb(`{${Y} | ${Y} ${up ? GE : LE} ${iq(r)}}`))}에 대하여 ${SX}에서 ${SY}로의 함수 ${nb(`${FN}(${X}) = ${poly([[a, X2], [-2 * a * h, X]])} + ${K}`)}가 일대일대응일 때, 상수 ${jw(K, '의')} 값은?`, k, { signed: true,
                explain: `${nb(`${FN}(${X}) = ${a < 0 ? MINUS : ''}(${X} ${sgn(-h)})${sup(2)} ${sgn(-a * h * h)} + ${K}`)}이므로 ${nb(`${X} ${GE} ${iq(p)}`)}에서 ${X}의 값이 커지면 ${Y}의 값은 ${up ? '커진다' : '작아진다'}. 치역이 ${SY}가 되려면 ${is(at(FN, p), r)}이어야 하므로 ${nb(`${iq(a * (p * p - 2 * h * p))} + ${K} = ${iq(r)}`)}, ${is(K, k)}이다.`,
                facts: { value: `${jn(r)}-(${a < 0 ? '-' : ''}${jn(p)}*${jn(p)}+${jn(-2 * a * h)}*${jn(p)})`, rule: 'quad-end' }
              });
            }
            // X = {x ≤ k}에서 X로, f = −x² + 2hx + c, k ≤ h 이고 f(k) = k
            const c = d.until(() => { const k0 = d.int(-4, 2), k1 = k0 + 2 * d.int(1, 3) + 1; return { k0, k1, h: (k0 + k1 + 1) / 2 }; }, (v) => Number.isInteger(v.h) && v.h !== 0);
            const cc = -c.k0 * c.k1, fP = P(cc, 2 * c.h, -1);
            return N(`집합 ${is(SX, nb(`{${X} | ${X} ${LE} ${K}}`))}에 대하여 ${SX}에서 ${SX}로의 함수 ${jw(fdef(FN, fP), '이/가')} 일대일대응이 되도록 하는 상수 ${jw(K, '의')} 값은?`, c.k0, { signed: true,
              explain: `${nb(`${FN}(${X}) = ${MINUS}(${X} ${sgn(-c.h)})${sup(2)} ${sgn(c.h * c.h + cc)}`)}이므로 일대일함수가 되려면 ${nb(`${K} ${LE} ${iq(c.h)}`)}이고, 이때 치역은 ${nb(`{${Y} | ${Y} ${LE} ${FN}(${K})}`)}이다. 치역이 ${SX}와 같아야 하므로 ${is(at(FN, K), K)}, ${nb(`${MINUS}${K}${sup(2)} ${sgn(2 * c.h)}${K} ${sgn(cc)} = ${K}`)}에서 ${is(K, c.k0)} 또는 ${is(K, c.k1)}이다. ${nb(`${K} ${LE} ${iq(c.h)}`)}이므로 ${is(K, c.k0)}이다.`,
              facts: { value: jn(c.k0), unseen: [Math.abs(c.k0)], rule: 'quad-self' }
            });
          }, { count: 2 }),
          T('kinds-interval-pick', '구간 X에서 X로의 일대일대응 고르기', '①21', (d) => {
            const m = d.pick([1, 2]), lo = -m, hi = m;
            const POOL = [
              { h: `${Y} = ${MINUS}${X}`, f: (x) => -x }, { h: `${Y} = ${X}`, f: (x) => x },
              { h: nb(`${Y} = ${frac(1, 2)}${X}`), f: (x) => x / 2 },
              { h: nb(`${Y} = ${X2}`), f: (x) => x * x }, { h: nb(`${Y} = |${X}|`), f: (x) => Math.abs(x) },
              { h: nb(`${Y} = ${MINUS}${frac(1, 2 * m)}(${X} ${sgn(-m)})${sup(2)} ${sgn(m)}`), f: (x) => -((x - m) ** 2) / (2 * m) + m },
              { h: nb(`${Y} = ${frac(1, 2 * m)}(${X} ${sgn(m)})${sup(2)} ${sgn(-m)}`), f: (x) => ((x + m) ** 2) / (2 * m) - m }
            ];
            const isBij = (f) => { const xs = Array.from({ length: 81 }, (_, i) => lo + (hi - lo) * i / 80), ys = xs.map(f); const inc = ys.every((y, i) => i === 0 || y > ys[i - 1]), dec = ys.every((y, i) => i === 0 || y < ys[i - 1]); return (inc || dec) && Math.abs(Math.min(...ys) - lo) < 1e-9 && Math.abs(Math.max(...ys) - hi) < 1e-9; };
            const rows = d.until(() => d.shuffle(POOL).slice(0, 3), (rs) => { const t = rs.map((r) => isBij(r.f)); return t.some(Boolean) && !t.every(Boolean); });
            return pickAll(d, `집합 ${is(SX, nb(`{${X} | ${iq(lo)} ${LE} ${X} ${LE} ${iq(hi)}}`))}에 대하여 ${SX}에서 ${SX}로의 일대일대응인 것만을 보기에서 있는 대로 고른 것은?`, rows.map((r) => [r.h, isBij(r.f)]), {
              explain: rows.map((r, i) => { const a0 = r.f(lo), a1 = r.f(hi); return `${KS[i]}. ${X} = ${iq(lo)}일 때 ${iq(Q(Math.round(a0 * 2), 2))}, ${X} = ${iq(hi)}일 때 ${iq(Q(Math.round(a1 * 2), 2))}` + (isBij(r.f) ? '이고 줄곧 커지거나 작아지므로 일대일대응' : '이므로 일대일대응이 아니다'); }).join(' / ') + '. 치역이 X 전체이고 일대일함수여야 일대일대응이다.'
            });
          }),
          T('kinds-two-lines', '두 직선을 이은 함수가 일대일대응이 되는 범위', '①22', (d, n) => {
            const [p, q] = d.until(() => [d.int(1, 5), d.int(1, 4)], ([u, v]) => u + v >= 3), c = nz(d, -5, 5);   // 기울기 (p − a), (a + q) → −q < a < p
            const flip = d.bool(), s1 = flip ? `${MINUS}(${A} ${sgn(-p)})` : `(${p} ${MINUS} ${A})`, s2 = `(${A} ${sgn(q)})`;
            const fx = `${FN}(${X}) = ${pw([[`${s1}${X} ${sgn(c)}`, `${X} ${GE} 0`], [`${s2}${X} ${sgn(c)}`, `${X} ${LT} 0`]])}`;
            const why = `두 직선이 점 ${nb(`(0, ${iq(c)})`)}에서 이어지므로 일대일대응이려면 두 직선의 기울기의 부호가 같아야 한다. ${nb(`(${p} ${MINUS} ${A})(${A} ${sgn(q)}) ${GT} 0`)}에서 ${nb(`${iq(-q)} ${LT} ${A} ${LT} ${p}`)}이다.`;
            if (n === 0) return inline(`실수 전체의 집합에서 정의된 함수 ${fx}가 일대일대응이 되도록 하는 실수 ${A}의 값의 범위를 구하시오.`, `{0} ${LT} ${A} ${LT} {1}`, [{ answer: -q, signed: true }, { answer: p, signed: true }], {
              shown: nb(`${iq(-q)} ${LT} ${A} ${LT} ${p}`), explain: why, facts: { calc: [[`0-${q}`, 0], [`${p}`, 1]], unseen: [0], rule: 'two-lines-range' }
            });
            return N(`실수 전체의 집합에서 정의된 함수 ${fx}의 역함수가 존재하도록 하는 정수 ${jw(A, '의')} 개수는?`, p + q - 1, {
              explain: `역함수가 존재하려면 ${FN}가 일대일대응이어야 한다. ${why} 정수 ${A}는 ${iq(-q + 1)}부터 ${p - 1}까지 ${p + q - 1}개이다.`,
              facts: { value: `${p}+${q}-1`, unseen: [1], rule: 'two-lines-count' }
            });
          }, { count: 2 }),
          T('kinds-id-const-value', '항등함수·상수함수의 함숫값', '①23', (d, n) => {
            if (n === 0) {
              const xs = d.pick([[-3, -1, 1, 3], [-2, -1, 1, 2], [-4, -2, 2, 4], [1, 2, 3, 4]]), [p, q] = d.shuffle(xs).slice(0, 2), [r, s] = d.shuffle(xs).slice(0, 2);
              return vals(`집합 ${is(SX, setOf(xs))}에 대하여 함수 ${nb(`${FN} : ${SX} → ${SX}`)}는 항등함수이고 함수 ${nb(`${GN} : ${SX} → ${SX}`)}는 상수함수이다. ${is(at(FN, p), at(GN, q))}일 때, ${at(FN, r)}, ${jw(at(GN, s), '의')} 값은?`, [[at(FN, r), r], [at(GN, s), p]], {
                explain: `${FN}는 항등함수이므로 ${is(at(FN, p), p)}, ${is(at(FN, r), r)}이다. ${is(at(GN, q), p)}이고 ${GN}는 상수함수이므로 ${GN}의 함숫값은 모두 ${iq(p)}이다.`,
                facts: { calc: [[jn(r), 0], [jn(p), 1]] }
              });
            }
            const p = nz(d, -4, 5), r = nz(d, -9, 9);
            return vals(`함수 ${nb(`${FN}(${X}) = ${A}${X} + ${BB}`)}가 상수함수이고 ${is(at(FN, p), r)}일 때, 상수 ${A}, ${jw(BB, '의')} 값은?`, [[A, 0], [BB, r]], {
              explain: `상수함수는 모든 ${X}에 같은 값이 대응하므로 ${X}의 계수가 0이다. ${is(A, 0)}이므로 ${is(at(FN, X), BB)}이고, ${is(at(FN, p), r)}에서 ${is(BB, r)}이다.`,
              facts: { calc: [['0', 0], [jn(r), 1]], unseen: [0] }
            });
          }, { count: 2 }),
          T('kinds-three-functions', '일대일대응·항등·상수 세 함수의 조건 맞추기', '①24', (d) => {
            const perms = [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]];
            const g = (x) => x;
            // 조건 꼴: 식 글과 판정
            const forms = [
              (i, j, k) => ({ h: nb(`${at(FN, i)} = ${at(GN, j)} = ${at(HN, k)}`), ok: (f, c) => f[i - 1] === j && c === j }),
              (i, j, k) => ({ h: nb(`${at(FN, i)} ${MINUS} ${at(GN, j)} = ${at(HN, k)}`), ok: (f, c) => f[i - 1] - j === c }),
              (i, j, k) => ({ h: nb(`${at(FN, i)} = ${at(HN, k)} + ${at(GN, j)}`), ok: (f, c) => f[i - 1] === c + j }),
              (i, j, k, s) => ({ h: nb(`${at(FN, i)} + ${at(GN, j)} + ${at(HN, k)} = ${s}`), ok: (f, c) => f[i - 1] + j + c === s, sum: true })
            ];
            const c = d.until(() => {
              const f = d.pick(perms), cst = d.int(1, 3);
              const conds = [0, 1].map(() => { const t = d.int(0, 3), [i, j, k] = [d.int(1, 3), d.int(1, 3), d.int(1, 3)]; const made = forms[t](i, j, k, f[i - 1] + j + cst); return made.ok(f, cst) ? made : null; });
              if (conds.some((x) => !x) || conds[0].h === conds[1].h) return null;
              const sols = []; for (const pf of perms) for (let cc = 1; cc <= 3; cc += 1) if (conds.every((x) => x.ok(pf, cc))) sols.push([pf, cc]);
              return sols.length === 1 ? { f, cst, conds } : null;
            }, (v) => v);
            const [u, w] = d.shuffle([1, 2, 3]).slice(0, 2);
            return M(`집합 ${is(SX, setOf([1, 2, 3]))}에 대하여 ${SX}에서 ${SX}로의 세 함수 ${FN}, ${GN}, ${HN}가 다음 조건을 모두 만족시킬 때, ${at(FN, u)}, ${at(FN, w)}, ${jw(at(HN, 1), '의')} 값은?`, [{ lead: at(FN, u) + ' =', answer: c.f[u - 1] }, { lead: at(FN, w) + ' =', answer: c.f[w - 1] }, { lead: at(HN, 1) + ' =', answer: c.cst }], {
              figure: lines([`(가) ${FN}는 일대일대응, ${GN}는 항등함수, ${HN}는 상수함수이다.`, `(나) ${c.conds[0].h}`, `(다) ${c.conds[1].h}`]),
              shown: `${is(at(FN, u), c.f[u - 1])}, ${is(at(FN, w), c.f[w - 1])}, ${is(at(HN, 1), c.cst)}`,
              explain: `${GN}는 항등함수이므로 ${is(at(GN, X), X)}이고, ${HN}는 상수함수이므로 ${HN}의 값은 모두 같다. 함숫값이 1, 2, 3 가운데 하나라는 것을 써서 두 조건을 맞추면 ${HN}의 값은 ${c.cst}, ${FN}는 ${[1, 2, 3].map((x) => is(at(FN, x), c.f[x - 1])).join(', ')}인 일대일대응뿐이다.`,
              facts: { calc: [[String(c.f[u - 1]), 0], [String(c.f[w - 1]), 1], [String(c.cst), 2]] }
            });
          }),
          T('kinds-bij-rest', '일대일대응의 남은 함숫값', '①25', (d) => {
            const c = d.until(() => { const base = d.int(2, 7), ys = [base, base + d.int(1, 2)]; ys.push(ys[1] + d.int(1, 3)); return ys; }, (ys) => new Set([ys[0] + ys[1], ys[0] + ys[2], ys[1] + ys[2]]).size === 3);
            const [i, j] = d.shuffle([1, 2, 3]).slice(0, 2).sort(), k = 6 - i - j, [y1, y2] = d.shuffle(c).slice(0, 2), rest = c.find((y) => y !== y1 && y !== y2);
            return N(`두 집합 ${is(SX, setOf([1, 2, 3]))}, ${is(SY, setOf(c))}에 대하여 함수 ${nb(`${FN} : ${SX} → ${SY}`)}가 일대일대응이고 ${nb(`${at(FN, i)} + ${at(FN, j)} = ${y1 + y2}`)}일 때, ${jw(at(FN, k), '의')} 값은?`, rest, {
              explain: `${SY}의 두 원소의 합이 ${y1 + y2}인 것은 ${josa(Math.min(y1, y2), '과/와')} ${Math.max(y1, y2)}뿐이므로 ${at(FN, i)}, ${jw(at(FN, j), '은/는')} 이 두 수 가운데 하나씩이다. 일대일대응이므로 남은 원소가 대응하여 ${is(at(FN, k), rest)}이다.`,
              facts: { value: `${c[0]}+${c[1]}+${c[2]}-${y1 + y2}` }
            });
          }),
          T('kinds-one-one-max', '일대일함수에서 함숫값 합의 최댓값', '①26', (d) => {
            const ys = d.until(() => d.shuffle(range(2, 9)).slice(0, 4).sort((p, q) => p - q), (v) => true), v1 = d.pick(ys), rest = ys.filter((y) => y !== v1).sort((p, q) => q - p);
            return N(`두 집합 ${is(SX, setOf([1, 2, 3]))}, ${is(SY, setOf(ys))}에 대하여 ${SX}에서 ${SY}로의 함수 ${FN}가 일대일함수이고 ${is(at(FN, 1), v1)}일 때, ${nb(`${at(FN, 2)} + ${at(FN, 3)}`)}의 최댓값은?`, rest[0] + rest[1], {
              explain: `일대일함수이므로 ${at(FN, 2)}, ${jw(at(FN, 3), '은/는')} ${josa(v1, '이/가')} 아닌 ${SY}의 서로 다른 두 원소이다. 남은 ${rest.join(', ')} 가운데 가장 큰 둘을 고르면 ${rest[0]} + ${rest[1]} = ${rest[0] + rest[1]}이다.`,
              facts: { value: `${rest[0]}+${rest[1]}` }
            });
          }),
          T('kinds-count', '조건에 맞는 함수의 개수(상수함수·일대일함수)', '①27', (d) => {
            const m = d.pick([2, 3]), n = d.until(() => d.pick([3, 4, 5]), (v) => v > m), xs = ['a', 'b', 'c'].slice(0, m).map(V), ys = range(1, n);
            const perm = range(0, m - 1).reduce((s, i) => s * (n - i), 1);
            return counts(`두 집합 ${is(SX, setOf(xs))}, ${is(SY, setOf(ys))}에 대하여 ${SX}에서 ${SY}로의 함수 가운데 상수함수의 개수와 일대일함수의 개수는?`, [['상수함수', n], ['일대일함수', perm]], {
              explain: `상수함수는 모든 원소가 ${SY}의 같은 원소에 대응하므로 ${n}개이다. 일대일함수는 ${xs.map((x) => at(FN, x)).join(', ')}가 서로 달라야 하므로 ${range(0, m - 1).map((i) => n - i).join(' × ')} = ${perm}개이다.`,
              facts: { calc: [[String(n), 0], [range(0, m - 1).map((i) => n - i).join('*'), 1]] }
            });
          })
        ]
      }
    ]
  });

  // 같은 단원의 b·c 파일이 쓰는 도구
  B.kit.m1026 = {
    S1, S2, S3, sourceOf, X, Y, FN, GN, HN, A, BB, CC, K, MM, NN, PP, QQ, X2, SX, SY, SZ, KS, num, iq, jn, nj, sgn, cx, is, isj, INV, iv, at, ring, cat, setOf, setT, jw,
    P, pv, pAdd, pMul, pScale, pComp, pTrim, pDeg, pshow, fdef, pjs, lin, pw, cond, vals, counts, pickRows, pickAll, twoOf, oneOf,
    HALO, ITALIC, INK, BLUE, RED, GREEN, svgText, head, mapFig, picks, gfig, samp, SHAPES, shapeFig, R4, isFn, imageOf
  };
})(typeof window !== 'undefined' ? window : globalThis);
