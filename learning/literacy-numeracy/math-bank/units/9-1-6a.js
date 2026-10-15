// 중학교 3학년 1학기 6단원 이차함수 y = ax² + bx + c의 그래프 — 단원 틀·도구와 앞쪽 묶음
// (y = ax² + q의 그래프, y = a(x − p)²의 그래프, y = a(x − p)² + q의 그래프, 평행이동과 그래프의 모양·성질).
// 수집해 둔 미래엔(황선욱) 2015 교과서·지도서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1: 85꼴, 심화꼴: 28꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭) / 겹침」을 가른 대조표는 references/textbooks/수학/_분석/9-1-6/싣기_대조표.md 에 있다.
// (y = ax² + bx + c의 그래프, 계수에 문자가 든 이차함수, 축과 만나는 점과 넓이, 식 구하기, 계수의 부호는 9-1-6b.js 에, 실력 문항은 9-1-6c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 영역은 변화와 관계. 성취기준은 9수02-22(이차함수의 그래프를 그릴 수 있고, 그 성질을 설명할 수 있다)이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(식·평행이동의 말·그림·점), 묻는 것(옮긴 양·축·꼭짓점·식·지나는 점·고르기)이 다르면 따로 싣는다. 수만 다른 것은 한 번만 싣는다.
//    교과서가 y = ax² + q, y = a(x − p)², y = a(x − p)² + q 를 차례로 배우므로 세 꼴은 묶음을 나누어 싣는다(x축 방향으로 옮기면 괄호 안의 부호가 바뀌는 것이 따로 배우는 일이다).
//  - 9-1-5(이차함수와 그 그래프)에 실릴 일은 다시 싣지 않는다: 이차함수 가리기, y = ax²의 그래프의 폭·볼록한 쪽·x축 대칭, 함숫값 표.
//    평행이동한 꼴이 섞인 폭 견주기(①42)·공통점(①43)은 「옮겨도 폭은 그대로」를 묻는 일이라 실었다.
//  - 답: 축과 꼭짓점은 「x = [±][ ]」「([±][ ], [±][ ])」, 식 y = a(x − p)² + q 는 「y = [±][ ](x [±][ ])² [±][ ]」(a, p, q 는 0이 아닌 정수),
//    식 y = ax² + bx + c 는 「y = [±][ ]x² [±][ ]x [±][ ]」(a, b, c 는 0이 아닌 정수)로 받는다. 계수가 분수인 식은 고르기로 내거나 수를 따로 묻는다.
//    좌표·계수·옮긴 양처럼 음수일 수 있는 수는 모두 부호 단추가 붙은 칸으로 받는다. 넓이·거리·개수만 단추 없이 받는다.
//    원문의 「a + p + q의 값」「apq의 값」「p + q + m의 값」처럼 따로 구한 수를 더하거나 곱해 묻는 꼴은 수를 하나하나 답하게 바꾸었다.
//    「모두 구하시오」로 답이 둘인 꼴은 「k = [ ] 또는 k = [ ]」 두 칸(차례는 따지지 않는다)이나 「모두 고른 것」 고르기로 바꾸었다.
//  - 그림: 좌표평면은 이 파일의 fig 로 그린다(눈금 없는 좌표평면에 포물선, 꼭짓점이나 읽을 점에서 두 축으로 내린 점선, 축 위에 적은 수 — 교과서 그림의 꼴).
//    그림 설명(aria-label)은 그림에서 읽을 수 있는 것(포물선의 볼록한 쪽, 점선, 축 위에 적힌 수)만 적는다(꼭짓점의 좌표를 숫자로 말하면 답을 흘린다).
//    그래프를 고르는 문항은 같은 fig 를 작게(small) 그려 넷을 늘어놓는다.
//  - 꼴 목록에 적힌 원문 답은 따르지 않는다. 답은 모두 코드가 셈한다.
//
// 뺀 것과 까닭(9-1-6b.js, 9-1-6c.js 의 것까지 여기에 모아 적는다)
//  - 놀이·활동: 함숫값 표로 두 그래프 견주기(①1 — 표 채우기는 9-1-5의 함숫값, 결론은 ①2·12에 실었다), 주사위 규칙으로 옮긴 식 잇기(①26 — 옮긴 양을 이어 더하는 일은 ①28에 실었다).
//  - 고등학교 내용: x축과 만나지 않을(두 점에서 만날) 조건(①64 심28 — 「이차함수의 그래프와 직선(x축)의 위치 관계」, 판별식), 판별식으로 적는 사분면 조건(심27).
//    옮긴 그래프의 x축 대칭(표14의 보기 하나 — 대칭이동)도 싣지 않았다.
//  - 작도: 「그래프를 그리고」(①3·13·23·49의 앞부분) — 축과 꼭짓점만 묻는다.
//  - 겹침(하는 일이 이미 실은 유형과 같다): ①27(꼭짓점으로 준 평행이동 → ①24), ①73(꼭짓점과 y절편 → ①72와 한 유형), ①79(상수항을 아는 식이 두 점을 지남 → ①78),
//    심2(→ ①21의 둘째 차례), 심4(→ ①59의 둘째 차례), 심10(→ ①76), 심11(→ ①9), 심14(→ ①67), 심16(→ ①71), 심18(→ ①69), 심24·25(→ ①82·83). 자세한 것은 대조표에 적었다.
//  - 바꾼 말: 심9의 「점 (x, y)가 그리는 그래프」(자취)를 「x와 y 사이의 관계를 나타낸 이차함수의 그래프」로, 심20에 원문이 그림에만 둔 「점 C를 지나는」을 글로 밝혔다.
//  - 판단이 갈릴 수 있는 것: 심19(꼭짓점과 직선 y = k의 두 교점)는 x축에 평행한 직선이라 f(x) = k를 한 번 푸는 일로 보고 실력에 실었다.
//    최댓값·최솟값은 이 단원의 수집본에 한 문제도 없어 짓지 않았다. 미지수 셋을 연립하는 식 구하기도 없다(세 점 문제는 모두 y축 위의 점이 낀다).
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { lines, N, M, C, inline } = B.kit;
  const { LAB, MINUS, GT, LT, Q, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, isInt, fl, mag, tx, nb, tail, lastOf, tj, js, V, sup, tag, f1, nz, pm, ansV, claimQ, asQ, poly, pointAns, plain } = B.kit.mid;
  const S22 = '9수02-22';
  // ref 에 기본꼴(①)만 있으면 기본 자료, 심화꼴(심)만 있으면 심화 자료
  const sourceOf = (ref) => '수집본 ' + (/①/.test(ref) ? (/심/.test(ref) ? '기본·심화' : '기본') : '심화') + ' 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: sourceOf(ref), make }, more || {});

  // ── 글 ──
  const X = V('x'), Y = V('y'), A = V('a'), BB = V('b'), CC = V('c'), P = V('p'), QV = V('q'), K = V('k'), MM = V('m'), NN = V('n');
  const X2 = X + sup(2), XA = X + '축', YA = Y + '축', XI = X + '절편', YI = Y + '절편';
  const TAG6 = ['㉠', '㉡', '㉢', '㉣', '㉤', '㉥'];
  const num = (v) => (typeof v === 'number' ? v : fl(v));
  const iq = (n) => tx(asQ(n));                                        // 화면에 적는 수(음수는 −, 분수는 분수 꼴)
  const jn = (n) => js(asQ(n));                                        // 검사 식에 적는 수((-3), (3/4))
  const sgn = (n) => { const q = asQ(n); return `${q.p < 0 ? MINUS : '+'} ${mag(q)}`; };   // 「+ 3」「− 3」
  const nj = (n, pair) => tj(asQ(n), pair);                            // 수 뒤에 토씨
  const is = (l, r) => nb(`${l} = ${typeof r === 'string' ? r : iq(r)}`);
  const isj = (l, r, pair) => nb(`${l} = ${nj(r, pair)}`);              // x = 3을
  const cx = (v) => (typeof v === 'string' ? v : iq(v));
  const pt = (x, y) => nb(`(${cx(x)}, ${cx(y)})`);
  const ptj = (x, y, pair) => nb(`(${cx(x)}, ${cx(y)})${tail(lastOf(asQ(y)), pair)}`);
  const cmp = (l, rel) => nb(`${l} ${rel} 0`);
  const par = (n) => (num(n) < 0 ? `(${iq(n)})` : iq(n));             // 식 속의 수(음수는 괄호)
  // 수 k 와 문자 글 v 의 곱(계수 1, −1 은 수를 적지 않는다): 4a, a, −a
  const ka = (k, v) => (num(k) === 1 ? '' : num(k) === -1 ? MINUS : iq(k)) + v;
  // 식·좌표·낱말 뒤에 토씨를 붙인다. 끝소리로 고른다: 숫자는 읽는 소리(분수는 분자), x²은 「제곱」, 문자 m·n·l 은 받침이 있고 나머지 문자는 없다, 한글은 그 글자.
  function jw(h, pair) {
    const [withB, without] = pair.split('/');
    const flat = String(h).replace(/<sup>2<\/sup>/g, '²').replace(/<span class="mb-frac"><span>([^<]*)<\/span><span class="mb-frac-bar">\/<\/span><span>[^<]*<\/span><\/span>/g, '$1').replace(/<[^>]+>/g, '').replace(/[\s)\]]+$/, '');
    const last = flat.slice(-1);
    if (/\d/.test(last)) return h + tail(Number(/\d+$/.exec(flat)[0]), pair);
    let bat, rieul = false;
    if (last === '²') bat = true;
    else if (/[A-Za-z]/.test(last)) { bat = /[LMNlmn]/.test(last); rieul = /[Ll]/.test(last); }
    else { const code = last.charCodeAt(0) - 0xAC00, t = code >= 0 && code <= 11171 ? code % 28 : 0; bat = t !== 0; rieul = t === 8; }
    if (withB === '으로') return h + (bat && !rieul ? '으로' : '로');
    return h + (bat ? withB : without);
  }
  // x = x0, y = y0 을 대입하면
  // 문자 뒤 토씨: m, n 은 받침이 있게 읽는다(엠, 엔).
  const lj = (h, pair) => pair.split('/')[/[mnl]<\/i>$/.test(h) ? 0 : 1];
  const put = (x0, y0) => `${is(X, x0)}, ${typeof y0 === 'string' ? is(Y, y0) + lj(y0, '을/를') : isj(Y, y0, '을/를')} 대입하면`;
  // 이차함수의 식. 계수 1, −1 은 수를 적지 않는다.
  const coefText = (a) => { const q = asQ(a); return q.p === q.q ? '' : q.p === -q.q ? MINUS : tx(q); };
  // y = a(x − p)² + q 의 오른쪽(p = 0 이면 ax² + q, q = 0 이면 적지 않는다)
  const rhs = (a, p, q) => { const pq = asQ(p), qq = asQ(q); return coefText(a) + (pq.p === 0 ? X2 : `(${X} ${sgn(qneg(pq))})${sup(2)}`) + (qq.p === 0 ? '' : ' ' + sgn(qq)); };
  const std = (a, p, q) => nb(`${Y} = ${rhs(a, p, q)}`);
  const genR = (a, b, c) => poly([[a, X2], [b, X], [c, '']]);
  const gen = (a, b, c) => nb(`${Y} = ${genR(a, b, c)}`);
  const stdL = nb(`${Y} = ${A}(${X} ${MINUS} ${P})${sup(2)} + ${QV}`);
  const genL = nb(`${Y} = ${A}${X2} + ${BB}${X} + ${CC}`);
  // y = ax² + bx + c 의 꼭짓점 (p, q)(유리수)
  const vtxOf = (a, b, c) => { const aq = asQ(a), bq = asQ(b), cq = asQ(c), p = qdiv(qneg(bq), qmul(Q(2), aq)); return { p, q: qsub(cq, qdiv(qmul(bq, bq), qmul(Q(4), aq))) }; };
  // y = a(x − p)² + q 를 펼친 계수 [a, b, c](유리수)
  const expand = (a, p, q) => { const aq = asQ(a), pq = asQ(p); return [aq, qmul(Q(-2), qmul(aq, pq)), qadd(qmul(aq, qmul(pq, pq)), asQ(q))]; };
  // 수 고르기: 이차항의 계수. kind 'int' ±2~±4, 'frac' 정수가 아닌 분수, 주지 않으면 둘 가운데 하나.
  const FRACS = [[1, 2], [1, 3], [2, 3], [3, 2], [1, 4], [3, 4], [4, 3], [2, 5]];
  const aOf = (d, kind) => { const k = kind || (d.bool() ? 'int' : 'frac'); if (k === 'int') return Q(pm(d) * d.int(2, 4)); const [p, q] = d.pick(FRACS); return Q(pm(d) * p, q); };
  // 사분면
  const QN = ['제1사분면', '제2사분면', '제3사분면', '제4사분면'];
  // y = a(x − p)² + q 의 그래프가 지나는 사분면(0~3). 축 위의 점은 세지 않는다.
  // 볼록한 쪽으로 한없이 뻗는 쪽은 늘 지나고, 반대쪽은 그 범위(x > 0 또는 x < 0)에서의 가장 큰(작은) 값으로 따진다(꼭짓점이 그 범위 밖이면 y절편).
  function quadsOf(a, p, q) {
    const A_ = num(a), P_ = num(p), Q_ = num(q), yi = A_ * P_ * P_ + Q_;
    const right = P_ > 0 ? Q_ : yi, left = P_ < 0 ? Q_ : yi;   // x > 0, x < 0 에서 꼭짓점 쪽 끝 값
    return A_ > 0 ? [true, true, left < 0, right < 0] : [right > 0, left > 0, true, true];
  }
  const quadText = (list) => (list.length === 1 ? QN[list[0]] : '제' + list.map((i) => i + 1).join(', ') + '사분면');

  // ── 답 ──
  // 식 y = a(x − p)² + q: 「y = [±][ ](x [±][ ])² [±][ ]」. a, p, q 는 0이 아닌 정수.
  function stdAns(text, a, p, q, o) {
    if (![a, p, q].every((v) => Number.isInteger(v) && v !== 0)) throw new Error('표준형 답: a, p, q 는 0이 아닌 정수');
    return inline(text, `${Y} = {0}(${X} {1})${sup(2)} {2}`, [{ answer: a, signed: true }, { answer: -p, signed: true }, { answer: q, signed: true }], Object.assign({}, o, { shown: std(a, p, q) }));
  }
  // 식 y = ax² + bx + c: 「y = [±][ ]x² [±][ ]x [±][ ]」. a, b, c 는 0이 아닌 정수.
  function genAns(text, a, b, c, o) {
    if (![a, b, c].every((v) => Number.isInteger(v) && v !== 0)) throw new Error('일반형 답: a, b, c 는 0이 아닌 정수');
    return inline(text, `${Y} = {0}${X2} {1}${X} {2}`, [{ answer: a, signed: true }, { answer: b, signed: true }, { answer: c, signed: true }], Object.assign({}, o, { shown: gen(a, b, c) }));
  }
  // 축의 방정식과 꼭짓점의 좌표(정수)
  const axisVtx = (text, p, q, o) => inline(text, `축의 방정식: ${X} = {0}<br>꼭짓점의 좌표: ({1}, {2})`, [{ answer: p, signed: true }, { answer: p, signed: true }, { answer: q, signed: true }], Object.assign({}, o, { shown: `${is(X, p)}, ${pt(p, q)}` }));
  // 문자의 값 여럿: 「a = [±][ ]  p = [±][ ]」
  const vals = (text, pairs, o) => M(text, pairs.map(([lead, answer]) => ({ lead: lead + ' =', answer, signed: true })), Object.assign({}, o, { shown: pairs.map(([lead, answer]) => is(lead, answer)).join(', ') }));
  // 넷 가운데 조건에 맞는 둘을 「모두 고른 것」으로 묻는다. flags 는 참이 꼭 둘이어야 한다.
  const rows1 = (list, tags) => lines(list.map((h, i) => tag((tags || TAG6)[i]) + h));
  function pairPick(d, text, list, flags, explain) {
    const yes = [0, 1, 2, 3].filter((i) => flags[i]), no = [0, 1, 2, 3].filter((i) => !flags[i]), [p, q] = d.shuffle(no);
    const pairs = d.shuffle([yes, no, [yes[0], p], [yes[1], q]].map((pair) => pair.slice().sort((u, v) => u - v))), right = (pair) => pair.every((i) => flags[i]);
    return C(text, pairs.map((pair) => pair.map((i) => LAB[i]).join(', ')), pairs.findIndex(right), { figure: rows1(list, LAB), explain, facts: { truth: pairs.map(right), want: true } });
  }

  // ── 그림 ──
  // fig(o): 눈금 없는 좌표평면에 그린 포물선(교과서 그림의 꼴). 가로·세로의 한 칸 크기는 따로 줄어들 수 있다(세로로 긴 그림을 줄인다).
  //  o.x, o.y [작은 끝, 큰 끝], o.parabolas [{ a, p, q, dash, name }], o.lines [{ a, b } | { x }](직선, dash), o.segs [[x1, y1, x2, y2], …](선분), o.dashes(점선 선분),
  //  o.points [{ x, y, name, guide: true | 'x' | 'y' }](guide: 두 축(또는 한 축)으로 점선), o.shade [[x, y], …](옅게 칠할 곳, 테두리 없음),
  //  o.xnums [{ v, text }], o.ynums [{ v, text }](축 위에 적는 수), o.small(고르기 보기의 작은 그림), o.name(작은 그림의 이름), o.say(그림 설명 앞머리).
  // 글(축 위의 수, 점·포물선의 이름, O)은 선·점·다른 글과 떨어진 자리를 차례로 찾아 적는다. figOk(o): 모든 글이 2.5px 넘게 떨어졌는가(수를 다시 고르는 데 쓴다).
  const HALO = 'paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round';
  const ITALIC = "font-style:italic;font-family:'MB Math','Times New Roman',serif";
  const COLORS = ['#1d4ed8', '#b42318', '#15803d'];
  const bare = (t) => String(t).replace(/<[^>]+>/g, '');
  const wide = (t, size) => { let w = 0; for (const ch of bare(t)) w += /[A-Z]/.test(ch) ? 0.72 : /[가-힣]/.test(ch) ? 1 : ch === '/' ? 0.36 : 0.58; return w * (size || 12); };
  const toSeg = (x, y, [x1, y1, x2, y2]) => { const dx = x2 - x1, dy = y2 - y1, t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy || 1))); return Math.hypot(x - x1 - t * dx, y - y1 - t * dy); };
  function build(o) {
    const small = Boolean(o.small), [xlo, xhi] = o.x, [ylo, yhi] = o.y;
    const ux = small ? 104 / (xhi - xlo) : Math.min(24, 242 / (xhi - xlo)), uy = small ? Math.min(ux, 92 / (yhi - ylo)) : Math.min(ux, 230 / (yhi - ylo));
    const padL = small ? 8 : 16, padR = small ? 18 : 26, padT = small ? 22 : 30, padB = small ? 12 : 18, FS = 12;
    const W = padL + padR + (xhi - xlo) * ux, H = padT + padB + (yhi - ylo) * uy;
    const PX = (v) => padL + (num(v) - xlo) * ux, PY = (v) => padT + (yhi - num(v)) * uy, ox = PX(0), oy = PY(0);
    const segs = [], dots = [], boxes = [], why = [];
    let under = '', out = '', texts = '';
    const line = (x1, y1, x2, y2, style) => { segs.push([x1, y1, x2, y2]); return `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" style="${style}"/>`; };
    const DASH = 'stroke:#5b6770;stroke-width:0.9;stroke-dasharray:3 2';
    for (const sh of o.shade ? [o.shade] : []) under += `<path d="M${sh.map(([x, y]) => f1(PX(x)) + ' ' + f1(PY(y))).join('L')}Z" style="fill:rgba(251,191,36,0.42);stroke:none"/>`;
    // 축
    const ax0 = PX(xlo) - (small ? 3 : 8), ax1 = PX(xhi) + (small ? 5 : 9), ay0 = PY(ylo) + (small ? 3 : 8), ay1 = PY(yhi) - (small ? 5 : 9);
    out += line(ax0, oy, ax1, oy, 'stroke:#1f2933;stroke-width:1') + `<path d="M${f1(ax1 + 6)} ${f1(oy)}l-7 -3.4v6.8z" style="fill:#1f2933"/>`;
    out += line(ox, ay0, ox, ay1, 'stroke:#1f2933;stroke-width:1') + `<path d="M${f1(ox)} ${f1(ay1 - 6)}l-3.4 7h6.8z" style="fill:#1f2933"/>`;
    // 포물선
    const ends = [];
    (o.parabolas || []).forEach((c, k) => {
      const a = num(c.a), p = num(c.p || 0), q = num(c.q || 0), f = (x) => a * (x - p) * (x - p) + q, color = COLORS[k % COLORS.length];
      const cuts = [xlo, xhi];
      for (const v of [ylo, yhi]) { const r = (v - q) / a; if (r >= 0) cuts.push(p - Math.sqrt(r), p + Math.sqrt(r)); }
      const xs = cuts.filter((x) => x >= xlo && x <= xhi).sort((s, t) => s - t);
      for (let i = 0; i + 1 < xs.length; i += 1) {
        const s = xs[i], t = xs[i + 1], mid = f((s + t) / 2);
        if (t - s < 1e-9 || mid < ylo || mid > yhi) continue;
        const pts = [];
        for (let j = 0; j <= 48; j += 1) { const x = s + (t - s) * j / 48; pts.push([PX(x), PY(Math.min(yhi, Math.max(ylo, f(x))))]); }
        for (let j = 0; j + 1 < pts.length; j += 1) segs.push([pts[j][0], pts[j][1], pts[j + 1][0], pts[j + 1][1]]);
        out += `<path d="M${pts.map(([x, y]) => f1(x) + ' ' + f1(y)).join('L')}" style="fill:none;stroke:${color};stroke-width:1.8${c.dash ? ';stroke-dasharray:5 3' : ''}"/>`;
        ends.push({ k, at: pts[0], other: pts[pts.length - 1], left: true }, { k, at: pts[pts.length - 1], other: pts[0], left: false });
      }
    });
    // 직선
    (o.lines || []).forEach((l) => {
      const style = l.dash ? DASH : 'stroke:#15803d;stroke-width:1.6';
      if (l.x != null) { out += line(PX(l.x), PY(ylo), PX(l.x), PY(yhi), style); return; }
      const a = num(l.a), b = num(l.b || 0); let lo = xlo, hi = xhi;
      if (a !== 0) { const s = (ylo - b) / a, t = (yhi - b) / a; lo = Math.max(lo, Math.min(s, t)); hi = Math.min(hi, Math.max(s, t)); }
      out += line(PX(lo), PY(a * lo + b), PX(hi), PY(a * hi + b), style);
    });
    for (const [x1, y1, x2, y2] of o.segs || []) out += line(PX(x1), PY(y1), PX(x2), PY(y2), 'stroke:#1f2933;stroke-width:1.5');
    for (const [x1, y1, x2, y2] of o.dashes || []) out += line(PX(x1), PY(y1), PX(x2), PY(y2), DASH);
    for (const p of o.points || []) {
      if (p.guide === true || p.guide === 'x') if (num(p.y) !== 0) out += line(PX(p.x), PY(p.y), PX(p.x), oy, DASH);
      if (p.guide === true || p.guide === 'y') if (num(p.x) !== 0) out += line(PX(p.x), PY(p.y), ox, PY(p.y), DASH);
    }
    for (const p of o.points || []) { dots.push([PX(p.x), PY(p.y)]); out += `<circle class="mb-dot" cx="${f1(PX(p.x))}" cy="${f1(PY(p.y))}" r="${small ? 2.6 : 3}"/>`; }
    // 글 놓기: 글 상자(가운데 cx, cy, 반 너비 w, 반 높이 h)의 둘레 여덟 곳과 가운데에서 선·점까지의 틈, 다른 글과의 틈
    // 선분마다 둘러싼 네모를 먼저 재어, 글 상자와의 거리가 이미 찾은 틈보다 먼 선분은 건너뛴다.
    const room = (cx0, cy, w, h) => {
      let m = 99;
      for (const sg of segs) {
        const dx = Math.max(Math.min(sg[0], sg[2]) - (cx0 + w), (cx0 - w) - Math.max(sg[0], sg[2]), 0), dy = Math.max(Math.min(sg[1], sg[3]) - (cy + h), (cy - h) - Math.max(sg[1], sg[3]), 0);
        if (dx >= m || dy >= m) continue;
        for (const sx of [-1, 0, 1]) for (const sy of [-1, 0, 1]) m = Math.min(m, toSeg(cx0 + sx * w, cy + sy * h, sg));
      }
      for (const [px, py] of dots) for (const sx of [-1, 0, 1]) for (const sy of [-1, 0, 1]) m = Math.min(m, Math.hypot(cx0 + sx * w - px, cy + sy * h - py) - 3);
      return m;
    };
    // 다른 글과의 틈. 같은 줄에 나란한 글은 4px 더 띄운다(「−1 O」가 「−10」처럼 읽히지 않게).
    const apart = (cx0, cy, w, h) => boxes.reduce((m, [bx, by, bw, bh]) => Math.min(m, Math.max(Math.abs(bx - cx0) - bw - w - 4, Math.abs(by - cy) - bh - h)), 99);
    const inside = (cx0, cy, w, h) => cx0 - w >= 1 && cx0 + w <= W - 1 && cy - h >= 1 && cy + h <= H - 1;
    // cands: [x, y(글자 밑선), anchor]. 앞의 것일수록 좋은 자리. 틈이 3px 넘는 첫 자리, 없으면 가장 넓은 자리.
    function place(cands, t, size, style) {
      const fs = size || FS, w = wide(t, fs) / 2, h = fs * 0.42; let best = null;
      for (const [x, y, anchor] of cands) {
        const cx0 = anchor === 'middle' ? x : anchor === 'end' ? x - w : x + w, cy = y - fs * 0.34;
        const s = inside(cx0, cy, w, h) ? Math.min(room(cx0, cy, w, h), apart(cx0, cy, w, h) + 1.5) : -9;
        if (!best || s > best.s + 0.01) best = { s, x, y, anchor, cx0, cy };
        if (s >= 3) break;
      }
      if (best.s < 2.5) why.push(bare(t) + ' 틈 ' + best.s.toFixed(1));
      boxes.push([best.cx0, best.cy, w, h]);
      texts += `<text x="${f1(best.x)}" y="${f1(best.y)}" text-anchor="${best.anchor}" style="font-size:${fs}px;font-weight:600;fill:#1f2933;${HALO}${style ? ';' + style : ''}">${t}</text>`;
    }
    // 축의 이름 x, y
    // 축의 이름: x 는 화살표 끝 아래, y 는 화살표 끝 오른쪽
    boxes.push([ax1 + (small ? 5 : 10), oy + 9, 4, 5], [ox + 10, ay1 - 6, 4, 5]);
    texts += `<text x="${f1(ax1 + (small ? 5 : 10))}" y="${f1(oy + 14)}" text-anchor="middle" style="font-size:${small ? 12 : 13.5}px;fill:#1f2933;${ITALIC};${HALO}">x</text>`
      + `<text x="${f1(ox + 10)}" y="${f1(ay1 - 2)}" text-anchor="middle" style="font-size:${small ? 12 : 13.5}px;fill:#1f2933;${ITALIC};${HALO}">y</text>`;
    // 원점의 이름 O
    place([[ox - 8, oy + 14, 'middle'], [ox + 8, oy + 14, 'middle'], [ox - 8, oy - 4, 'middle'], [ox + 8, oy - 4, 'middle'], [ox - 11, oy + 15, 'middle'], [ox + 11, oy + 15, 'middle']], 'O', 12);
    // 점의 이름
    for (const p of o.points || []) if (p.name) {
      const x = PX(p.x), y = PY(p.y), first = p.side ? [{ ur: [7, -5, 'start'], ul: [-7, -5, 'end'], dr: [7, 14, 'start'], dl: [-7, 14, 'end'], u: [0, -7, 'middle'], d: [0, 16, 'middle'] }[p.side]] : [];
      place(first.concat([[7, -5, 'start'], [-7, -5, 'end'], [7, 14, 'start'], [-7, 14, 'end'], [0, -8, 'middle'], [0, 17, 'middle'], [10, 5, 'start'], [-10, 5, 'end']]).map(([dx, dy, an]) => [x + dx, y + dy, an]), p.name, 13);
    }
    // 축 위의 수
    for (const m of o.xnums || []) {
      const t = m.text == null ? plain(asQ(m.v)) : m.text, x = PX(m.v), w = wide(t, FS) / 2;
      place([[x, oy + 13, 'middle'], [x, oy - 5, 'middle'], [x + w + 3, oy + 13, 'middle'], [x - w - 3, oy + 13, 'middle'], [x + w + 3, oy - 5, 'middle'], [x - w - 3, oy - 5, 'middle'], [x, oy + 18, 'middle'], [x, oy - 10, 'middle'], [x + w + 5, oy + 18, 'middle'], [x - w - 5, oy + 18, 'middle'], [x + w + 5, oy - 10, 'middle'], [x - w - 5, oy - 10, 'middle']], t);
    }
    for (const m of o.ynums || []) {
      const t = m.text == null ? plain(asQ(m.v)) : m.text, y = PY(m.v) + 4;
      place([[ox - 5, y, 'end'], [ox + 5, y, 'start'], [ox - 5, y - 6, 'end'], [ox - 5, y + 6, 'end'], [ox + 5, y - 6, 'start'], [ox + 5, y + 6, 'start'], [ox - 5, y - 11, 'end'], [ox - 5, y + 11, 'end'], [ox + 5, y - 11, 'start'], [ox + 5, y + 11, 'start'], [ox - 9, y, 'end'], [ox + 9, y, 'start']], t);
    }
    // 포물선의 이름: 곡선의 끝 가까이
    (o.parabolas || []).forEach((c, k) => {
      if (!c.name) return;
      const cands = [];
      for (const e of ends.filter((v) => v.k === k)) { const [x, y] = e.at, top = y < (e.other[1] + y) / 2 || y < padT + 4; cands.push([x + (e.left ? 7 : -7), y + (top ? 11 : -4), e.left ? 'start' : 'end'], [x + (e.left ? -6 : 6), y + (top ? 11 : -4), e.left ? 'end' : 'start'], [x + (e.left ? 8 : -8), y + (top ? 24 : -16), e.left ? 'start' : 'end']); }
      place(cands, c.name, 12, `fill:${COLORS[k % COLORS.length]}`);
    });
    // 따로 적는 글 o.labels [{ x, y, t }](그 자리 둘레에 적는다)
    for (const l of o.labels || []) { const x = PX(l.x), y = PY(l.y); place([[x, y + 4, 'middle'], [x + 8, y + 4, 'start'], [x - 8, y + 4, 'end'], [x, y - 6, 'middle'], [x, y + 15, 'middle']], l.t, 12); }
    const said = [`좌표평면${o.name ? ' ' + o.name : ''}: ${o.say || ''}`.trim()];
    if ((o.xnums || []).length) said.push(`x축에 적힌 수: ${o.xnums.map((m) => bare(m.text == null ? plain(asQ(m.v)) : m.text)).join(', ')}.`);
    if ((o.ynums || []).length) said.push(`y축에 적힌 수: ${o.ynums.map((m) => bare(m.text == null ? plain(asQ(m.v)) : m.text)).join(', ')}.`);
    const svg = `<svg class="mb-geo" viewBox="0 0 ${f1(W)} ${f1(H)}" width="${Math.round(W)}" role="img" aria-label="${said.join(' ')}">${under}${out}${texts}</svg>`;
    return { svg, ok: why.length === 0, why };
  }
  const fig = (o) => build(o).svg, figOk = (o) => build(o).ok, figWhy = (o) => build(o).why;
  // 작은 그림 넷을 두 줄로 놓고 이름(㉠~㉣)을 단다.
  const picks = (figs) => '<div style="display:grid;grid-template-columns:repeat(2,max-content);gap:8px 14px">' + figs.map((h, i) => `<div style="display:grid;gap:1px;justify-items:start"><div style="font-size:0.95rem;font-weight:600">${LAB[i]}</div>${h}</div>`).join('') + '</div>';
  // 그림의 범위: 들어가야 할 x, y 의 값(0을 넣는다)에 여유를 두어 정수로 잡는다.
  const span = (vs, pad) => { const list = vs.map(num).concat([0]), m = pad == null ? 1.6 : pad; return [Math.floor(Math.min(...list) - m), Math.ceil(Math.max(...list) + m)]; };
  // 볼록한 쪽의 말
  const bowl = (a) => (num(a) > 0 ? '아래로 볼록한' : '위로 볼록한');

  // ── 평행이동한 그래프에 대한 문장(옳은 것과 틀린 것) ──
  // y = a(x − p)² + q (a 는 정수, p·q 는 정수)의 그래프: 꼭짓점, 축, 볼록한 쪽, y절편, 평행이동, 지나는 점, 증가·감소, 사분면.
  function stdClaims(d, a, p, q) {
    const yi = a * p * p + q, x1 = p + pm(d) * d.int(1, 2), y1 = a * (x1 - p) ** 2 + q, up = a > 0, hit = quadsOf(a, p, q), miss = [0, 1, 2, 3].filter((i) => !hit[i]);
    const yes = [
      `꼭짓점의 좌표는 ${pt(p, q)}이다.`,
      `축의 방정식은 ${is(X, p)}이다.`,
      `${bowl(a)} 포물선이다.`,
      `${YA}과 점 ${pt(0, yi)}에서 만난다.`,
      `이차함수 ${std(a, 0, 0)}의 그래프를 ${XA}의 방향으로 ${iq(p)}만큼, ${YA}의 방향으로 ${iq(q)}만큼 평행이동한 것이다.`,
      `점 ${ptj(x1, y1, '을/를')} 지난다.`,
      `${nb(`${X} ${GT} ${iq(p)}`)}일 때, ${X}의 값이 증가하면 ${Y}의 값은 ${up ? '증가' : '감소'}한다.`
    ];
    const no = [
      [`꼭짓점의 좌표는 ${pt(-p, q)}이다.`, `꼭짓점의 좌표는 ${pt(p, q)}이다.`, yes[0]],
      [`축의 방정식은 ${is(X, -p)}이다.`, `축의 방정식은 ${is(X, p)}이다.`, yes[1]],
      [`${bowl(-a)} 포물선이다.`, `${X2}의 계수가 ${up ? '양수' : '음수'}이므로 ${bowl(a)} 포물선이다.`, yes[2]],
      [`${YA}과 점 ${pt(0, q)}에서 만난다.`, `${isj(X, 0, '을/를')} 대입하면 ${is(Y, yi)}이므로 ${YA}과 점 ${pt(0, yi)}에서 만난다.`, yes[3]],
      [`이차함수 ${std(a, 0, 0)}의 그래프를 ${XA}의 방향으로 ${iq(-p)}만큼, ${YA}의 방향으로 ${iq(q)}만큼 평행이동한 것이다.`, `${XA}의 방향으로 ${iq(p)}만큼, ${YA}의 방향으로 ${iq(q)}만큼 평행이동한 것이다.`, yes[4]],
      [`점 ${ptj(x1, y1 + (d.bool() ? 2 : -2), '을/를')} 지난다.`, `${isj(X, x1, '을/를')} 대입하면 ${is(Y, y1)}이므로 점 ${ptj(x1, y1, '을/를')} 지난다.`, yes[5]],
      [`${nb(`${X} ${GT} ${iq(p)}`)}일 때, ${X}의 값이 증가하면 ${Y}의 값은 ${up ? '감소' : '증가'}한다.`, `${bowl(a)} 포물선이고 축이 ${is(X, p)}이므로 ${nb(`${X} ${GT} ${iq(p)}`)}일 때 ${X}의 값이 증가하면 ${Y}의 값은 ${up ? '증가' : '감소'}한다.`, yes[6]]
    ];
    if (miss.length) {
      const pass = [0, 1, 2, 3].filter((i) => hit[i]), wrong = d.pick(pass);
      yes.push(`${jw(quadText(miss), '을/를')} 지나지 않는다.`);
      no.push([`${QN[wrong]}을 지나지 않는다.`, `꼭짓점이 ${pt(p, q)}이고 ${YI}이 ${iq(yi)}인 ${bowl(a)} 포물선이므로 ${jw(quadText(pass), '을/를')} 지난다.`, yes[yes.length - 1]]);
    }
    return { yes, no };
  }

  B.addUnit({
    id: '9-1-6', grade: 9, semester: 1, no: 6, title: '이차함수 y = ax² + bx + c의 그래프', version: 1,
    groups: [
      // ── y = ax² + q의 그래프 ──
      {
        id: 'shiftq', title: 'y = ax² + q의 그래프', standard: S22,
        types: [
          T('shiftq-amount', 'y = ax² + q의 그래프는 y = ax²의 그래프를 얼마만큼 옮긴 것인가', '①2', (d) => {
            const a = aOf(d), q = nz(d, -9, 9);
            return N(`이차함수 ${std(a, 0, q)}의 그래프는 이차함수 ${std(a, 0, 0)}의 그래프를 ${YA}의 방향으로 얼마만큼 평행이동한 것인가?`, q, { signed: true,
              explain: `이차함수 ${std(a, 0, q)}의 그래프는 ${std(a, 0, 0)}의 그래프를 ${YA}의 방향으로 ${iq(q)}만큼 평행이동한 것이다.`,
              facts: { value: jn(q) }
            });
          }),
          T('shiftq-axis-vertex', 'y = ax² + q의 그래프의 축과 꼭짓점', '①3·5', (d, n) => {
            const a = aOf(d), q = nz(d, -9, 9);
            const head = n === 0 ? `이차함수 ${std(a, 0, q)}의 그래프` : `이차함수 ${std(a, 0, 0)}의 그래프를 ${YA}의 방향으로 ${iq(q)}만큼 평행이동한 그래프`;
            return axisVtx(`${head}의 축의 방정식과 꼭짓점의 좌표를 구하시오.`, 0, q, {
              explain: (n === 0 ? `이차함수 ${std(a, 0, q)}의 그래프는 ${std(a, 0, 0)}의 그래프를 ${YA}의 방향으로 ${iq(q)}만큼 평행이동한 것이다. ` : `평행이동한 그래프는 이차함수 ${std(a, 0, q)}의 그래프이다. `)
                + `${YA}, 곧 직선 ${isj(X, 0, '을/를')} 축으로 하고, 꼭짓점의 좌표는 ${pt(0, q)}이다.`,
              facts: { calc: [['0', 0], ['0', 1], [jn(q), 2]], unseen: [0], rule: 'sq-axis-' + n }
            });
          }, { count: 2 }),
          T('shiftq-pick-eq', 'y축의 방향으로 옮긴 그래프의 식 고르기', '①4', (d) => {
            // 틀린 식: x축의 방향으로 옮긴 꼴 둘, 옮긴 양의 부호를 놓친 것, 이차항의 계수의 부호를 바꾼 것
            const a = aOf(d, 'int'), q = nz(d, -6, 6);
            const rows = d.shuffle([{ a, p: 0, q, ok: true }, { a, p: q, q: 0 }, { a, p: -q, q: 0 }, { a, p: 0, q: -q }, { a: qneg(a), p: 0, q }]);
            return C(`이차함수 ${std(a, 0, 0)}의 그래프를 ${YA}의 방향으로 ${iq(q)}만큼 평행이동한 그래프를 나타내는 이차함수의 식은?`, rows.map((r) => std(r.a, r.p, r.q)), rows.findIndex((r) => r.ok), {
              explain: `${YA}의 방향으로 ${iq(q)}만큼 평행이동하면 ${Y}의 값이 모두 ${iq(q)}만큼 바뀌므로 식은 ${std(a, 0, q)}이다. ${XA}의 방향으로 옮길 때만 괄호 안의 수가 바뀐다.`,
              facts: { truth: rows.map((r) => Boolean(r.ok)), want: true }
            });
          }),
          T('shiftq-back', 'y축의 방향으로 옮긴 양이나 a를 거꾸로 구하기', '①5·7', (d, n) => {
            if (n === 0) {
              // 꼭짓점의 좌표가 주어질 때 옮긴 양
              const a = aOf(d), q = nz(d, -9, 9);
              return N(`이차함수 ${std(a, 0, 0)}의 그래프를 ${YA}의 방향으로 ${QV}만큼 평행이동한 그래프의 꼭짓점의 좌표가 ${pt(0, q)}일 때, ${QV}의 값은?`, q, { signed: true,
                explain: `평행이동한 그래프는 ${nb(`${Y} = ${rhs(a, 0, 0)} + ${QV}`)}의 그래프이고 꼭짓점의 좌표는 ${pt(0, QV)}이다. 따라서 ${is(QV, q)}이다.`,
                facts: { value: jn(q), rule: 'sq-back-0' }
              });
            }
            if (n === 1) {
              // 지나는 점이 주어질 때 옮긴 양
              const a = Q(pm(d) * d.int(2, 4)), x0 = pm(d) * d.int(1, 3), q = nz(d, -9, 9), y0 = num(a) * x0 * x0 + q;
              return N(`이차함수 ${std(a, 0, 0)}의 그래프를 ${YA}의 방향으로 ${QV}만큼 평행이동하면 점 ${ptj(x0, y0, '을/를')} 지난다. ${QV}의 값은?`, q, { signed: true,
                explain: `평행이동한 그래프는 ${nb(`${Y} = ${rhs(a, 0, 0)} + ${QV}`)}의 그래프이다. ${put(x0, y0)} ${nb(`${iq(y0)} = ${iq(num(a) * x0 * x0)} + ${QV}`)}, ${is(QV, q)}이다.`,
                facts: { value: `${jn(y0)}-${jn(a)}*${jn(x0)}*${jn(x0)}`, rule: 'sq-back-1' }
              });
            }
            // 지나는 점이 주어질 때 a(답은 정수가 아닌 분수)
            const c = d.until(() => { const q = nz(d, -6, 6), x0 = pm(d) * d.int(2, 4), y0 = nz(d, -9, 9); return { q, x0, y0, a: Q(y0 - q, x0 * x0) }; }, (v) => !isInt(v.a) && v.a.p !== 0 && v.y0 !== v.q);
            return ansV(`이차함수 ${Y} = ${A}${X2}의 그래프를 ${YA}의 방향으로 ${iq(c.q)}만큼 평행이동하면 점 ${ptj(c.x0, c.y0, '을/를')} 지날 때, 수 ${A}의 값은?`, c.a, 'frac', {
              explain: `평행이동한 그래프는 ${nb(`${Y} = ${A}${X2} ${sgn(c.q)}`)}의 그래프이다. ${put(c.x0, c.y0)} ${nb(`${iq(c.y0)} = ${ka(c.x0 * c.x0, A)} ${sgn(c.q)}`)}, ${is(A, c.a)}이다.`,
              facts: { value: `(${jn(c.y0)}-${jn(c.q)})/(${jn(c.x0)}*${jn(c.x0)})`, rule: 'sq-back-2' }
            });
          }, { count: 3 }),
          T('shiftq-through', 'y축의 방향으로 옮긴 그래프가 지나는 점', '①6', (d) => {
            const a = aOf(d), x0 = pm(d) * a.q * d.int(1, a.q === 1 ? 3 : a.q >= 4 ? 1 : 2), q = nz(d, -9, 9), m = qadd(qmul(a, Q(x0 * x0)), Q(q));
            return ansV(`이차함수 ${std(a, 0, 0)}의 그래프를 ${YA}의 방향으로 ${iq(q)}만큼 평행이동한 그래프가 점 ${jw(pt(x0, MM), '을/를')} 지날 때, ${MM}의 값은?`, m, 'int', {
              explain: `평행이동한 그래프는 ${std(a, 0, q)}의 그래프이다. ${put(x0, MM)} ${nb(`${MM} = ${iq(qmul(a, Q(x0 * x0)))} ${sgn(q)} = ${iq(m)}`)}이다.`,
              facts: { value: `${jn(a)}*${jn(x0)}*${jn(x0)}+${jn(q)}` }
            });
          }),
          T('shiftq-graph', '그래프에서 y = ax² + q의 a, q 구하기', '①8', (d, n) => {
            if (n === 0) {
              const c = d.until(() => {
                const a = nz(d, -3, 3), q = nz(d, -5, 5), x0 = pm(d) * d.int(1, 3), y0 = a * x0 * x0 + q, o = { x: span([x0], 1.6), y: span([q, y0], 1.6), parabolas: [{ a, q }], points: [{ x: 0, y: q }, { x: x0, y: y0, guide: true }], xnums: [{ v: x0 }], ynums: [{ v: q }, { v: y0 }], say: `${bowl(a)} 포물선. 꼭짓점은 y축 위에 있다. 그래프 위의 한 점에서 두 축으로 점선을 그었다.` };
                return { a, q, x0, y0, o };
              }, (v) => v.y0 !== 0 && Math.abs(v.y0) <= 14 && figOk(v.o));
              return vals(`이차함수 ${nb(`${Y} = ${A}${X2} + ${QV}`)}의 그래프가 그림과 같을 때, 수 ${A}, ${QV}의 값은?`, [[A, c.a], [QV, c.q]], {
                figure: fig(c.o),
                explain: `꼭짓점의 좌표가 ${pt(0, c.q)}이므로 ${is(QV, c.q)}이다. ${nb(`${Y} = ${A}${X2} ${sgn(c.q)}`)}에 ${put(c.x0, c.y0)} ${nb(`${iq(c.y0)} = ${ka(c.x0 * c.x0, A)} ${sgn(c.q)}`)}, ${is(A, c.a)}이다.`,
                facts: { calc: [[`(${jn(c.y0)}-${jn(c.q)})/(${jn(c.x0)}*${jn(c.x0)})`, 0], [jn(c.q), 1]] }
              });
            }
            // 그림의 그래프는 y = kx²을 y축의 방향으로 옮긴 것이다. 식을 정해 함숫값 구하기
            const c = d.until(() => {
              const a = aOf(d), q = nz(d, -5, 5), k = pm(d) * a.q * d.int(1, 2), o = { x: [-3, 3], y: num(a) > 0 ? [Math.min(q, 0) - 2, Math.max(q, 0) + 4] : [Math.min(q, 0) - 4, Math.max(q, 0) + 2], parabolas: [{ a, q }], points: [{ x: 0, y: q }], ynums: [{ v: q }], say: `${bowl(a)} 포물선. 꼭짓점은 y축 위에 있다.` };
              return { a, q, k, o, v: qadd(qmul(a, Q(k * k)), Q(q)) };
            }, (v) => isInt(v.v) && figOk(v.o));
            return ansV(`그림은 이차함수 ${std(c.a, 0, 0)}의 그래프를 ${YA}의 방향으로 평행이동한 것이다. 이 그래프를 나타내는 이차함수를 ${nb(`${Y} = ${V('f')}(${X})`)}라 할 때, ${nb(`${V('f')}(${iq(c.k)})`)}의 값은?`, c.v, 'int', {
              figure: fig(c.o),
              explain: `꼭짓점의 좌표가 ${pt(0, c.q)}이므로 ${nb(`${V('f')}(${X}) = ${rhs(c.a, 0, c.q)}`)}이다. ${nb(`${V('f')}(${iq(c.k)}) = ${iq(qmul(c.a, Q(c.k * c.k)))} ${sgn(c.q)} = ${iq(c.v)}`)}이다.`,
              facts: { value: `${jn(c.a)}*${jn(c.k)}*${jn(c.k)}+${jn(c.q)}` }
            });
          }, { count: 2 }),
          T('shiftq-two-points', '두 점을 지나는 y = ax² + q의 그래프의 꼭짓점', '①9', (d) => {
            const a = nz(d, -3, 3), q = nz(d, -6, 6), [x1, x2] = d.until(() => [pm(d) * d.int(1, 2), pm(d) * d.int(2, 3)], ([u, v]) => Math.abs(u) !== Math.abs(v)), y1 = a * x1 * x1 + q, y2 = a * x2 * x2 + q;
            return pointAns(`이차함수 ${nb(`${Y} = ${A}${X2} + ${QV}`)}의 그래프가 두 점 ${pt(x1, y1)}, ${ptj(x2, y2, '을/를')} 지날 때, 이 그래프의 꼭짓점의 좌표는? (단, ${A}, ${QV}는 수이다.)`, 0, q, {
              explain: `두 점의 좌표를 대입하면 ${nb(`${iq(y1)} = ${ka(x1 * x1, A)} + ${QV}`)}, ${nb(`${iq(y2)} = ${ka(x2 * x2, A)} + ${QV}`)}이다. 두 식을 연립하면 ${is(A, a)}, ${is(QV, q)}이므로 꼭짓점의 좌표는 ${pt(0, q)}이다.`,
              facts: { calc: [['0', 0], [`${jn(y1)}-(${jn(y2)}-${jn(y1)})/(${jn(x2)}*${jn(x2)}-${jn(x1)}*${jn(x1)})*${jn(x1)}*${jn(x1)}`, 1]], unseen: [0] }
            });
          }),
          T('shiftq-not-on', '꼭짓점과 한 점으로 식을 구해 그래프 위의 점이 아닌 것 고르기', '①10', (d) => {
            const c = d.until(() => {
              const a = d.pick([Q(1, 2), Q(-1, 2), Q(1, 4), Q(-1, 4), Q(2), Q(-2), Q(3), Q(-1, 3)]), q = nz(d, -8, 8), x1 = pm(d) * d.int(1, 3) * a.q;
              const y1 = qadd(qmul(a, Q(x1 * x1)), Q(q)), xs = d.shuffle([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].filter((x) => Math.abs(x) !== Math.abs(x1))).slice(0, 5);
              return { a, q, x1, y1, xs, off: d.int(0, 4) };
            }, (v) => isInt(v.y1) && v.y1.p !== 0);
            const rows = c.xs.map((x, i) => { const y = qadd(qmul(c.a, Q(x * x)), Q(c.q)); return { x, y: i === c.off ? qadd(y, Q(d.pick([1, -1]) * (c.a.q === 1 ? 1 : 1), c.a.q === 1 ? 1 : 2)) : y, on: i !== c.off }; });
            return C(`꼭짓점의 좌표가 ${pt(0, c.q)}이고 점 ${ptj(c.x1, c.y1, '을/를')} 지나는 이차함수의 그래프 위의 점이 아닌 것은?`, rows.map((r) => pt(r.x, r.y)), c.off, {
              explain: `꼭짓점이 ${pt(0, c.q)}이므로 식을 ${jw(nb(`${Y} = ${A}${X2} ${sgn(c.q)}`), '으로/로')} 놓고 ${put(c.x1, c.y1)} ${is(A, c.a)}이다. ${std(c.a, 0, c.q)}에 ${isj(X, rows[c.off].x, '을/를')} 대입하면 ${is(Y, qadd(qmul(c.a, Q(rows[c.off].x ** 2)), Q(c.q)))}이므로 점 ${ptj(rows[c.off].x, rows[c.off].y, '은/는')} 그래프 위의 점이 아니다.`,
              facts: { truth: rows.map((r) => !r.on), want: true }
            });
          }),
          T('shiftq-claims', 'y = ax² + q의 그래프에 대한 설명', '①11', (d) => {
            const a = pm(d) * d.int(1, 3), q = nz(d, -6, 6), want = d.bool(), s = stdClaims(d, a, 0, q);
            // y축 방향으로만 옮긴 것: 축은 y축, 「x축의 방향으로」 옮겼다는 말은 틀리다.
            s.yes[1] = `${YA}을 축으로 한다.`;
            s.no[1] = [`직선 ${isj(X, q, '을/를')} 축으로 한다.`, `${YA}, 곧 직선 ${isj(X, 0, '을/를')} 축으로 한다.`, s.yes[1]];
            s.yes[4] = `이차함수 ${std(a, 0, 0)}의 그래프를 ${YA}의 방향으로 ${iq(q)}만큼 평행이동한 것이다.`;
            s.no[4] = [`이차함수 ${std(a, 0, 0)}의 그래프를 ${XA}의 방향으로 ${iq(q)}만큼 평행이동한 것이다.`, `${YA}의 방향으로 ${iq(q)}만큼 평행이동한 것이다.`, s.yes[4]];
            s.no[0] = [`꼭짓점의 좌표는 ${pt(q, 0)}이다.`, `꼭짓점의 좌표는 ${pt(0, q)}이다.`, s.yes[0]];
            s.no[3] = [`${YA}과 점 ${pt(0, -q)}에서 만난다.`, `꼭짓점 ${ptj(0, q, '이/가')} ${YA} 위에 있다.`, s.yes[3]];
            return claimQ(d, `이차함수 ${std(a, 0, q)}의 그래프에 대한 설명으로 ${want ? '옳은' : '옳지 않은'} 것은?`, s.yes, s.no, want);
          })
        ]
      },
      // ── y = a(x − p)²의 그래프 ──
      {
        id: 'shiftp', title: 'y = a(x − p)²의 그래프', standard: S22,
        types: [
          T('shiftp-amount', 'y = a(x − p)²의 그래프는 y = ax²의 그래프를 얼마만큼 옮긴 것인가', '①12', (d) => {
            const a = aOf(d), p = nz(d, -8, 8);
            return N(`이차함수 ${std(a, p, 0)}의 그래프는 이차함수 ${std(a, 0, 0)}의 그래프를 ${XA}의 방향으로 얼마만큼 평행이동한 것인가?`, p, { signed: true,
              explain: `이차함수 ${nb(`${Y} = ${A}(${X} ${MINUS} ${P})${sup(2)}`)}의 그래프는 ${nb(`${Y} = ${A}${X2}`)}의 그래프를 ${XA}의 방향으로 ${P}만큼 평행이동한 것이다. ${std(a, p, 0)}에서 ${is(P, p)}이다.`,
              facts: { value: jn(p) }
            });
          }),
          T('shiftp-axis-vertex', 'y = a(x − p)²의 그래프의 축과 꼭짓점', '①13·15', (d, n) => {
            const a = aOf(d), p = nz(d, -8, 8);
            const head = n === 0 ? `이차함수 ${std(a, p, 0)}의 그래프` : `이차함수 ${std(a, 0, 0)}의 그래프를 ${XA}의 방향으로 ${iq(p)}만큼 평행이동한 그래프`;
            return axisVtx(`${head}의 축의 방정식과 꼭짓점의 좌표를 구하시오.`, p, 0, {
              explain: (n === 0 ? `이차함수 ${std(a, p, 0)}의 그래프는 ${std(a, 0, 0)}의 그래프를 ${XA}의 방향으로 ${iq(p)}만큼 평행이동한 것이다. ` : `평행이동한 그래프는 이차함수 ${std(a, p, 0)}의 그래프이다. `)
                + `직선 ${isj(X, p, '을/를')} 축으로 하고, 꼭짓점의 좌표는 ${pt(p, 0)}이다.`,
              facts: { calc: [[jn(p), 0], [jn(p), 1], ['0', 2]], unseen: [0], rule: 'sp-axis-' + n }
            });
          }, { count: 2 }),
          T('shiftp-pick-eq', 'x축의 방향으로 옮긴 그래프의 식 고르기', '①14', (d) => {
            const a = aOf(d, 'int'), p = nz(d, -6, 6);
            const rows = d.shuffle([{ a, p, q: 0, ok: true }, { a, p: -p, q: 0 }, { a, p: 0, q: p }, { a, p: 0, q: -p }, { a: qneg(a), p, q: 0 }]);
            return C(`이차함수 ${std(a, 0, 0)}의 그래프를 ${XA}의 방향으로 ${iq(p)}만큼 평행이동한 그래프를 나타내는 이차함수의 식은?`, rows.map((r) => std(r.a, r.p, r.q)), rows.findIndex((r) => r.ok), {
              explain: `${XA}의 방향으로 ${iq(p)}만큼 평행이동하면 ${X} 대신 ${nb(`${X} ${sgn(-p)}`)}${tail(Math.abs(p), '을/를')} 넣은 식이 되므로 ${std(a, p, 0)}이다.`,
              facts: { truth: rows.map((r) => Boolean(r.ok)), want: true }
            });
          }),
          T('shiftp-through', 'x축의 방향으로 옮긴 그래프가 지나는 점', '①16', (d) => {
            const a = pm(d) * d.int(2, 4), p = nz(d, -5, 5), x0 = d.until(() => p + pm(d) * d.int(1, 3), (x) => x !== 0), v = a * (x0 - p) ** 2;
            return N(`이차함수 ${std(a, 0, 0)}의 그래프를 ${XA}의 방향으로 ${iq(p)}만큼 평행이동한 그래프가 점 ${jw(pt(x0, K), '을/를')} 지날 때, ${K}의 값은?`, v, { signed: true,
              explain: `평행이동한 그래프는 ${std(a, p, 0)}의 그래프이다. ${put(x0, K)} ${nb(`${K} = ${iq(a)} × (${iq(x0)} ${sgn(-p)})${sup(2)} = ${iq(v)}`)}이다.`,
              facts: { value: `${jn(a)}*(${jn(x0)}-${jn(p)})*(${jn(x0)}-${jn(p)})` }
            });
          }),
          T('shiftp-back-a', 'x축의 방향으로 옮긴 그래프가 점을 지날 때 a 구하기', '①17', (d) => {
            const a = nz(d, -3, 3), p = nz(d, -5, 5), x0 = d.until(() => p + pm(d) * d.int(2, 3), (x) => x !== 0), y0 = a * (x0 - p) ** 2;
            return N(`이차함수 ${Y} = ${A}${X2}의 그래프를 ${XA}의 방향으로 ${iq(p)}만큼 평행이동하면 점 ${ptj(x0, y0, '을/를')} 지날 때, 수 ${A}의 값은?`, a, { signed: true,
              explain: `평행이동한 그래프는 ${nb(`${Y} = ${A}(${X} ${sgn(-p)})${sup(2)}`)}의 그래프이다. ${put(x0, y0)} ${nb(`${iq(y0)} = ${ka((x0 - p) ** 2, A)}`)}, ${is(A, a)}이다.`,
              facts: { value: `${jn(y0)}/((${jn(x0)}-${jn(p)})*(${jn(x0)}-${jn(p)}))` }
            });
          }),
          T('shiftp-to-origin', '꼭짓점을 원점으로 옮기는 평행이동 고르기', '①18', (d) => {
            const a = aOf(d), p = nz(d, -6, 6);
            const rows = d.shuffle([[XA, -p, true], [XA, p, false], [YA, -p, false], [YA, p, false]]);
            return C(`이차함수 ${std(a, p, 0)}의 그래프를 평행이동하여 꼭짓점이 원점에 오게 하려고 한다. 어떻게 평행이동해야 하는가?`, rows.map(([ax, v]) => `${ax}의 방향으로 ${iq(v)}만큼`), rows.findIndex((r) => r[2]), {
              explain: `꼭짓점의 좌표는 ${pt(p, 0)}이다. 이 점이 원점에 오려면 ${XA}의 방향으로 ${iq(-p)}만큼 평행이동해야 한다.`,
              facts: { truth: rows.map((r) => r[2]), want: true }
            });
          }),
          T('shiftp-ap', '축과 한 점(그림)으로 y = a(x − p)²의 a, p 구하기', '①19', (d, n) => {
            if (n === 0) {
              const a = nz(d, -4, 4), p = nz(d, -4, 4), x0 = d.until(() => p + pm(d) * d.int(1, 2), (x) => x !== 0), y0 = a * (x0 - p) ** 2;
              return vals(`이차함수 ${nb(`${Y} = ${A}(${X} ${MINUS} ${P})${sup(2)}`)}의 그래프는 직선 ${isj(X, p, '을/를')} 축으로 하고 점 ${ptj(x0, y0, '을/를')} 지난다. 수 ${A}, ${P}의 값은?`, [[A, a], [P, p]], {
                explain: `축의 방정식이 ${is(X, P)}이므로 ${is(P, p)}이다. ${nb(`${Y} = ${A}(${X} ${sgn(-p)})${sup(2)}`)}에 ${put(x0, y0)} ${nb(`${iq(y0)} = ${ka((x0 - p) ** 2, A)}`)}, ${is(A, a)}이다.`,
                facts: { calc: [[`${jn(y0)}/((${jn(x0)}-${jn(p)})*(${jn(x0)}-${jn(p)}))`, 0], [jn(p), 1]], rule: 'sp-ap-0' }
              });
            }
            // 그림: 꼭짓점이 x축 위에 있고 y축과 만나는 점이 적혀 있다.
            const c = d.until(() => {
              const p = nz(d, -3, 3), a = nz(d, -3, 3), yi = a * p * p, o = { x: span([p], 1.6), y: span([yi], 1.6), parabolas: [{ a, p }], points: [{ x: p, y: 0 }, { x: 0, y: yi }], xnums: [{ v: p }], ynums: [{ v: yi }], say: `${bowl(a)} 포물선. 꼭짓점은 x축 위에 있다.` };
              return { a, p, yi, o };
            }, (v) => Math.abs(v.yi) <= 12 && figOk(v.o));
            return vals(`이차함수 ${nb(`${Y} = ${A}(${X} ${MINUS} ${P})${sup(2)}`)}의 그래프가 그림과 같을 때, 수 ${A}, ${P}의 값은?`, [[A, c.a], [P, c.p]], {
              figure: fig(c.o),
              explain: `꼭짓점의 좌표가 ${pt(c.p, 0)}이므로 ${is(P, c.p)}이다. 그래프가 점 ${ptj(0, c.yi, '을/를')} 지나므로 ${nb(`${iq(c.yi)} = ${A} × (${iq(-c.p)})${sup(2)}`)}, ${is(A, c.a)}이다.`,
              facts: { calc: [[`${jn(c.yi)}/(${jn(c.p)}*${jn(c.p)})`, 0], [jn(c.p), 1]], rule: 'sp-ap-1' }
            });
          }, { count: 2 }),
          T('shiftp-same-vertex', '꼭짓점이 같은 그래프의 y절편', '①20', (d) => {
            const p = nz(d, -4, 4), a = nz(d, -3, 3), b0 = pm(d) * d.int(1, 2), x0 = d.until(() => p + pm(d) * d.int(1, 2), (x) => x !== 0), y0 = a * (x0 - p) ** 2, yi = a * p * p;
            return N(`이차함수 ${std(b0, p, 0)}의 그래프와 꼭짓점이 같고 점 ${ptj(x0, y0, '을/를')} 지나는 이차함수의 그래프의 ${YI}은?`, yi, { signed: true,
              explain: `꼭짓점이 ${pt(p, 0)}이므로 식을 ${jw(nb(`${Y} = ${A}(${X} ${sgn(-p)})${sup(2)}`), '으로/로')} 놓는다. ${put(x0, y0)} ${is(A, a)}이다. ${isj(X, 0, '을/를')} 대입하면 ${YI}은 ${nb(`${iq(a)} × ${p * p} = ${iq(yi)}`)}이다.`,
              facts: { value: `${jn(y0)}/((${jn(x0)}-${jn(p)})*(${jn(x0)}-${jn(p)}))*${jn(p)}*${jn(p)}` }
            });
          })
        ]
      },
      // ── y = a(x − p)² + q의 그래프 ──
      {
        id: 'vertex', title: 'y = a(x − p)² + q의 그래프', standard: S22,
        types: [
          T('vertex-amount', 'y = a(x − p)² + q의 그래프는 y = ax²의 그래프를 얼마만큼 옮긴 것인가', '①22', (d) => {
            const a = aOf(d), p = nz(d, -7, 7), q = nz(d, -7, 7);
            return inline(`이차함수 ${std(a, p, q)}의 그래프는 이차함수 ${std(a, 0, 0)}의 그래프를 어떻게 평행이동한 것인가?`, `${XA}의 방향으로 {0}만큼,<br>${YA}의 방향으로 {1}만큼`, [{ answer: p, signed: true }, { answer: q, signed: true }], {
              shown: `${XA}의 방향으로 ${iq(p)}만큼, ${YA}의 방향으로 ${iq(q)}만큼`,
              explain: `${stdL}의 그래프는 ${nb(`${Y} = ${A}${X2}`)}의 그래프를 ${XA}의 방향으로 ${P}만큼, ${YA}의 방향으로 ${QV}만큼 평행이동한 것이다. ${std(a, p, q)}에서 ${is(P, p)}, ${is(QV, q)}이다.`,
              facts: { calc: [[jn(p), 0], [jn(q), 1]] }
            });
          }),
          T('vertex-axis-vertex', 'y = a(x − p)² + q의 그래프의 축과 꼭짓점', '①23', (d, n) => {
            const a = aOf(d), p = nz(d, -7, 7), q = nz(d, -7, 7);
            const head = n === 0 ? `이차함수 ${std(a, p, q)}의 그래프` : `이차함수 ${std(a, 0, 0)}의 그래프를 ${XA}의 방향으로 ${iq(p)}만큼, ${YA}의 방향으로 ${iq(q)}만큼 평행이동한 그래프`;
            return axisVtx(`${head}의 축의 방정식과 꼭짓점의 좌표를 구하시오.`, p, q, {
              explain: (n === 0 ? `이차함수 ${std(a, p, q)}의 그래프는 ${std(a, 0, 0)}의 그래프를 ${XA}의 방향으로 ${iq(p)}만큼, ${YA}의 방향으로 ${iq(q)}만큼 평행이동한 것이다. ` : `평행이동한 그래프는 이차함수 ${std(a, p, q)}의 그래프이다. `)
                + `직선 ${isj(X, p, '을/를')} 축으로 하고, 꼭짓점의 좌표는 ${pt(p, q)}이다.`,
              facts: { calc: [[jn(p), 0], [jn(p), 1], [jn(q), 2]], rule: 'v-axis-' + n }
            });
          }, { count: 2 }),
          T('vertex-moved-eq', '주어진 만큼 옮긴 그래프의 식', '①24·27', (d) => {
            const a = Q(pm(d) * d.int(2, 5)), p = nz(d, -7, 7), q = nz(d, -7, 7);
            return stdAns(`이차함수 ${std(a, 0, 0)}의 그래프를 ${XA}의 방향으로 ${iq(p)}만큼, ${YA}의 방향으로 ${iq(q)}만큼 평행이동한 그래프를 나타내는 이차함수의 식을 ${stdL}의 꼴로 나타내시오.`, a.p, p, q, {
              explain: `${XA}의 방향으로 ${iq(p)}만큼 옮기면 ${X} 대신 ${nb(`${X} ${sgn(-p)}`)}${tail(Math.abs(p), '을/를')} 넣고, ${YA}의 방향으로 ${iq(q)}만큼 옮기면 ${iq(q)}${tail(Math.abs(q), '을/를')} 더한다. 식은 ${std(a, p, q)}이다.`,
              facts: { calc: [[jn(a), 0], [`0-${jn(p)}`, 1], [jn(q), 2]], unseen: [0] }
            });
          }),
          T('vertex-through', '옮긴 그래프가 지나는 점', '①25', (d) => {
            const a = pm(d) * d.int(2, 3), p = nz(d, -5, 5), q = nz(d, -6, 6), x0 = d.until(() => p + pm(d) * d.int(1, 3), (x) => x !== 0), v = a * (x0 - p) ** 2 + q;
            return N(`이차함수 ${std(a, 0, 0)}의 그래프를 ${XA}의 방향으로 ${iq(p)}만큼, ${YA}의 방향으로 ${iq(q)}만큼 평행이동한 그래프가 점 ${jw(pt(x0, K), '을/를')} 지날 때, ${K}의 값은?`, v, { signed: true,
              explain: `평행이동한 그래프는 ${std(a, p, q)}의 그래프이다. ${put(x0, K)} ${nb(`${K} = ${iq(a)} × (${iq(x0)} ${sgn(-p)})${sup(2)} ${sgn(q)} = ${iq(v)}`)}이다.`,
              facts: { value: `${jn(a)}*(${jn(x0)}-${jn(p)})*(${jn(x0)}-${jn(p)})+${jn(q)}` }
            });
          }),
          T('vertex-through-both', '옮긴 그래프가 한 점을 지날 때의 값 모두', '①21 심2', (d, n) => {
            if (n === 0) {
              // 점 (k, c)를 지날 때 k 둘
              const a = d.pick([1, 2, 3, -1, -2]), p = nz(d, -4, 4), q = nz(d, -6, 6), r = d.int(1, 3), c = a * r * r + q, k1 = p - r, k2 = p + r;
              return inline(`이차함수 ${std(a, 0, 0)}의 그래프를 ${XA}의 방향으로 ${iq(p)}만큼, ${YA}의 방향으로 ${iq(q)}만큼 평행이동한 그래프가 점 ${ptj(K, c, '을/를')} 지날 때, ${K}의 값을 모두 구하시오.`, `${K} = {0} 또는 ${K} = {1}`, [{ answer: k1, signed: true }, { answer: k2, signed: true }], {
                unordered: true, shown: `${is(K, k1)} 또는 ${is(K, k2)}`,
                explain: `평행이동한 그래프는 ${std(a, p, q)}의 그래프이다. ${put(K, c)} ${nb(`(${K} ${sgn(-p)})${sup(2)} = ${r * r}`)}이므로 ${nb(`${K} ${sgn(-p)} = ±${r}`)}, ${is(K, k1)} 또는 ${is(K, k2)}이다.`,
                facts: { calc: [[`${jn(p)}-${r}`, 0], [`${jn(p)}+${r}`, 1]], unseen: [r], rule: 'v-both-0' }
              });
            }
            // x축의 방향으로 p만큼 옮긴 그래프가 점을 지날 때 p 둘
            const a = d.pick([Q(1), Q(2), Q(1, 2), Q(1, 3), Q(-1), Q(-2), Q(-1, 2), Q(-1, 3)]), q = d.pick([0, 0, nz(d, -4, 4)]), r = d.int(1, a.q === 1 ? 4 : 2) * a.q, x0 = nz(d, -4, 6), y0 = num(a) * r * r + q, p1 = x0 - r, p2 = x0 + r;
            return inline(`이차함수 ${std(a, 0, q)}의 그래프를 ${XA}의 방향으로 ${P}만큼 평행이동한 그래프가 점 ${ptj(x0, y0, '을/를')} 지날 때, ${P}의 값을 모두 구하시오.`, `${P} = {0} 또는 ${P} = {1}`, [{ answer: p1, signed: true }, { answer: p2, signed: true }], {
              unordered: true, shown: `${is(P, p1)} 또는 ${is(P, p2)}`,
              explain: `평행이동한 그래프는 ${nb(`${Y} = ${coefText(a)}(${X} ${MINUS} ${P})${sup(2)}${q ? ' ' + sgn(q) : ''}`)}의 그래프이다. ${put(x0, y0)} ${nb(`(${iq(x0)} ${MINUS} ${P})${sup(2)} = ${r * r}`)}이므로 ${nb(`${iq(x0)} ${MINUS} ${P} = ±${r}`)}, ${is(P, p1)} 또는 ${is(P, p2)}이다.`,
              facts: { calc: [[`${jn(x0)}-${r}`, 0], [`${jn(x0)}+${r}`, 1]], unseen: [r], rule: 'v-both-1' }
            });
          }, { count: 2 }),
          T('vertex-again', '옮긴 그래프를 다시 옮기기', '①28', (d, n) => {
            const a = aOf(d), p = nz(d, -5, 5), q = nz(d, -5, 5);
            if (n === 0) {
              const m = nz(d, -4, 4), k = nz(d, -5, 5);
              return axisVtx(`이차함수 ${std(a, p, q)}의 그래프를 ${XA}의 방향으로 ${iq(m)}만큼, ${YA}의 방향으로 ${iq(k)}만큼 평행이동한 그래프의 축의 방정식과 꼭짓점의 좌표를 구하시오.`, p + m, q + k, {
                explain: `꼭짓점 ${pt(p, q)}${tail(Math.abs(q), '이/가')} ${XA}의 방향으로 ${iq(m)}만큼, ${YA}의 방향으로 ${iq(k)}만큼 옮겨 가므로 새 꼭짓점의 좌표는 ${pt(p + m, q + k)}, 축의 방정식은 ${is(X, p + m)}이다.`,
                facts: { calc: [[`${jn(p)}+${jn(m)}`, 0], [`${jn(p)}+${jn(m)}`, 1], [`${jn(q)}+${jn(k)}`, 2]], rule: 'v-again-0' }
              });
            }
            const h = d.until(() => nz(d, -5, 5), (v) => v !== p);
            return N(`이차함수 ${std(a, p, q)}의 그래프를 ${XA}의 방향으로 ${MM}만큼 평행이동한 그래프의 축의 방정식이 ${is(X, h)}일 때, ${MM}의 값은?`, h - p, { signed: true,
              explain: `처음 그래프의 축은 직선 ${is(X, p)}이다. ${XA}의 방향으로 ${MM}만큼 옮기면 축은 ${nb(`${X} = ${iq(p)} + ${MM}`)}이므로 ${nb(`${iq(p)} + ${MM} = ${iq(h)}`)}, ${is(MM, h - p)}이다.`,
              facts: { value: `${jn(h)}-${jn(p)}`, rule: 'v-again-1' }
            });
          }, { count: 2 }),
          T('vertex-match-shift', '옮긴 그래프와 일치할 때 옮긴 양 구하기', '①29', (d, n) => {
            const a = Q(pm(d) * d.int(2, 4)), p = nz(d, -5, 5), q = nz(d, -6, 6);
            if (n === 0) {
              return vals(`이차함수 ${Y} = ${A}${X2}의 그래프를 ${XA}의 방향으로 ${MM}만큼, ${YA}의 방향으로 ${NN}만큼 평행이동하였더니 이차함수 ${std(a, p, q)}의 그래프와 일치하였다. 수 ${A}, ${MM}, ${NN}의 값은?`, [[A, a.p], [MM, p], [NN, q]], {
                explain: `${nb(`${Y} = ${A}${X2}`)}의 그래프를 옮긴 그래프는 ${nb(`${Y} = ${A}(${X} ${MINUS} ${MM})${sup(2)} + ${NN}`)}의 그래프이다. ${jw(std(a, p, q), '과/와')} 견주면 ${is(A, a)}, ${is(MM, p)}, ${is(NN, q)}이다. 평행이동하여도 ${X2}의 계수는 그대로이다.`,
                facts: { calc: [[jn(a), 0], [jn(p), 1], [jn(q), 2]], rule: 'v-match-0' }
              });
            }
            const p2 = d.until(() => nz(d, -5, 5), (v) => v !== p), q2 = d.until(() => nz(d, -6, 6), (v) => v !== q);
            return vals(`이차함수 ${std(a, p, q)}의 그래프를 ${XA}의 방향으로 ${MM}만큼, ${YA}의 방향으로 ${NN}만큼 평행이동하였더니 이차함수 ${std(a, p2, q2)}의 그래프와 일치하였다. ${MM}, ${NN}의 값은?`, [[MM, p2 - p], [NN, q2 - q]], {
              explain: `꼭짓점이 ${pt(p, q)}에서 ${jw(pt(p2, q2), '으로/로')} 옮겨 갔으므로 ${nb(`${MM} = ${iq(p2)} − ${par(p)} = ${iq(p2 - p)}`)}, ${nb(`${NN} = ${iq(q2)} − ${par(q)} = ${iq(q2 - q)}`)}이다.`,
              facts: { calc: [[`${jn(p2)}-${jn(p)}`, 0], [`${jn(q2)}-${jn(q)}`, 1]], rule: 'v-match-1' }
            });
          }, { count: 2 }),
          T('vertex-before', '거꾸로 — 옮기기 전의 그래프의 식', '①30', (d) => {
            const { a, m, n, p, q, h, k } = d.until(() => { const a = pm(d) * d.int(2, 6), m = nz(d, -4, 4), n = nz(d, -4, 4), p = nz(d, -4, 4), q = nz(d, -6, 6); return { a, m, n, p, q, h: p + m, k: q + n }; }, (v) => v.h !== 0 && v.k !== 0);
            return vals(`이차함수 ${nb(`${Y} = ${iq(a)}(${X} ${MINUS} ${P})${sup(2)} + ${QV}`)}의 그래프를 ${XA}의 방향으로 ${iq(m)}만큼, ${YA}의 방향으로 ${iq(n)}만큼 평행이동하였더니 이차함수 ${nb(`${Y} = ${A}${h === 0 ? X2 : `(${X} ${sgn(-h)})${sup(2)}`} ${sgn(k)}`)}의 그래프가 되었다. 수 ${A}, ${P}, ${QV}의 값은?`, [[A, a], [P, p], [QV, q]], {
              explain: `평행이동하여도 ${X2}의 계수는 그대로이므로 ${is(A, a)}이다. 꼭짓점 ${jw(pt(P, QV), '이/가')} 옮겨 가서 ${ptj(h, k, '이/가')} 되었으므로 ${nb(`${P} + ${par(m)} = ${iq(h)}`)}, ${nb(`${QV} + ${par(n)} = ${iq(k)}`)}에서 ${is(P, p)}, ${is(QV, q)}이다.`,
              facts: { calc: [[jn(a), 0], [`${jn(h)}-${jn(m)}`, 1], [`${jn(k)}-${jn(n)}`, 2]] }
            });
          }),
          T('vertex-on-line', '옮긴 그래프의 꼭짓점이 직선 위에 있을 때', '①31', (d) => {
            // y = ax² + q0 을 x축 방향으로 p, y축 방향으로 p + t 만큼 → 꼭짓점 (p, q0 + p + t) 가 y = sx + c 위
            const c = d.until(() => { const a = pm(d) * d.int(2, 4), q0 = nz(d, -4, 4), t = d.int(1, 3), s = d.pick([-3, -2, 2, 3]), p = nz(d, -3, 3); return { a, q0, t, s, p, c: q0 + p + t - s * p }; }, (v) => v.c !== 0 && Math.abs(v.c) <= 12);
            return N(`이차함수 ${std(c.a, 0, c.q0)}의 그래프를 ${XA}의 방향으로 ${P}만큼, ${YA}의 방향으로 ${nb(`${P} + ${c.t}`)}만큼 평행이동한 그래프의 꼭짓점이 직선 ${nb(`${Y} = ${iq(c.s)}${X} ${sgn(c.c)}`)} 위에 있을 때, ${P}의 값은?`, c.p, { signed: true,
              explain: `옮긴 그래프는 ${nb(`${Y} = ${rhs(c.a, 0, 0).replace(X2, `(${X} ${MINUS} ${P})${sup(2)}`)} ${sgn(c.q0)} + ${P} + ${c.t}`)}의 그래프이므로 꼭짓점의 좌표는 ${pt(P, nb(`${P} ${sgn(c.q0 + c.t)}`))}이다. 이 점이 직선 위에 있으므로 ${nb(`${P} ${sgn(c.q0 + c.t)} = ${iq(c.s)}${P} ${sgn(c.c)}`)}, ${is(P, c.p)}이다.`,
              facts: { value: `(${jn(c.c)}-${jn(c.q0)}-${c.t})/(1-${jn(c.s)})`, unseen: [1] }
            });
          }),
          T('vertex-claims', 'y = a(x − p)² + q의 그래프에 대한 설명', '①32·40', (d) => {
            const a = pm(d) * d.int(1, 3), p = nz(d, -5, 5), q = nz(d, -6, 6), want = d.bool(), s = stdClaims(d, a, p, q);
            return claimQ(d, `이차함수 ${std(a, p, q)}의 그래프에 대한 설명으로 ${want ? '옳은' : '옳지 않은'} 것은?`, s.yes, s.no, want);
          }),
          T('vertex-match-pick', '식과 꼭짓점의 짝, 꼭짓점이 y축 위에 있는 것', '①33', (d, n) => {
            if (n === 0) {
              // 다섯 꼴: ax², ax² + q, a(x − p)², a(x − p)² + q, ax² + bx + c. 하나만 꼭짓점의 부호를 잘못 적었다.
              const k = () => pm(d) * d.int(1, 3), p1 = nz(d, -4, 4), q1 = nz(d, -5, 5), p2 = nz(d, -4, 4), q2 = nz(d, -5, 5), q3 = nz(d, -5, 5), p4 = nz(d, -3, 3), q4 = nz(d, -4, 4), a4 = pm(d) * d.int(1, 2), [a4q, b4, c4] = expand(a4, p4, q4);
              const rows = [
                { h: std(aOf(d), 0, 0), v: [0, 0] },
                { h: std(k(), 0, q3), v: [0, q3] },
                { h: std(k(), p1, 0), v: [p1, 0] },
                { h: std(k(), p2, q2), v: [p2, q2] },
                { h: gen(a4q, b4, c4), v: [p4, q4] }
              ];
              const bad = d.int(1, 4), list = d.shuffle(rows.map((r, i) => ({ h: r.h, v: i === bad ? (i === 1 ? [0, -r.v[1]] : [-r.v[0], r.v[1]]) : r.v, ok: i !== bad })));
              return C(`다음 중 이차함수와 그 그래프의 꼭짓점의 좌표가 바르게 짝 지어지지 않은 것은?`, list.map((r) => `${r.h} ⇨ ${pt(r.v[0], r.v[1])}`), list.findIndex((r) => !r.ok), {
                explain: `${rows.map((r) => `${r.h}의 꼭짓점은 ${pt(r.v[0], r.v[1])}`).join(', ')}이다.`,
                facts: { truth: list.map((r) => !r.ok), want: true, rule: 'v-pair-0' }
              });
            }
            // 꼭짓점이 y축 위에 있는 것 둘(정리해야 보이는 것 하나를 낀다)
            const r = () => pm(d) * d.int(1, 3), c1 = nz(d, -5, 5), h = d.int(1, 3), p3 = nz(d, -4, 4), p4 = nz(d, -4, 4), q4 = nz(d, -4, 4);
            const list = [
              { h: std(r(), 0, c1), ok: true },
              { h: nb(`${Y} = (${h} + ${X})(${h} ${MINUS} ${X})`), ok: true },
              { h: std(r(), p3, 0), ok: false },
              { h: std(r(), p4, q4), ok: false }
            ];
            const order = d.shuffle([0, 1, 2, 3]), shown = order.map((i) => list[i]);
            return pairPick(d, `다음 이차함수 중 그 그래프의 꼭짓점이 ${YA} 위에 있는 것을 모두 고른 것은?`, shown.map((s) => s.h), shown.map((s) => s.ok),
              `꼭짓점이 ${YA} 위에 있으려면 꼭짓점의 ${X}좌표가 0이어야 한다. ${nb(`(${h} + ${X})(${h} ${MINUS} ${X}) = ${MINUS}${X2} + ${h * h}`)}이므로 꼭짓점은 ${pt(0, h * h)}이다. ` + `꼭짓점이 ${YA} 위에 있는 것은 ${shown.map((s, i) => (s.ok ? LAB[i] : '')).filter(Boolean).join(', ')}이다.`);
          }, { count: 2 }),
          T('vertex-from-point', '꼭짓점과 한 점으로 y = a(x − p)² + q의 식 구하기', '①34', (d, n) => {
            if (n === 0) {
              const a = pm(d) * d.int(2, 5), p = nz(d, -4, 4), q = nz(d, -6, 6), x0 = d.until(() => p + pm(d) * d.int(1, 2), (x) => x !== p), y0 = a * (x0 - p) ** 2 + q;
              return stdAns(`꼭짓점의 좌표가 ${pt(p, q)}이고 점 ${ptj(x0, y0, '을/를')} 지나는 이차함수의 식을 ${stdL}의 꼴로 나타내시오.`, a, p, q, {
                explain: `꼭짓점이 ${pt(p, q)}이므로 식을 ${jw(nb(`${Y} = ${A}(${X} ${sgn(-p)})${sup(2)} ${sgn(q)}`), '으로/로')} 놓는다. ${put(x0, y0)} ${nb(`${iq(y0)} = ${ka((x0 - p) ** 2, A)} ${sgn(q)}`)}, ${is(A, a)}이다. 식은 ${std(a, p, q)}이다.`,
                facts: { calc: [[`(${jn(y0)}-${jn(q)})/((${jn(x0)}-${jn(p)})*(${jn(x0)}-${jn(p)}))`, 0], [`0-${jn(p)}`, 1], [jn(q), 2]], unseen: [0], rule: 'v-point-0' }
              });
            }
            // 축과 한 점: y = a(x − p)² + q0 (q0 는 주어짐)
            const a = nz(d, -4, 4), p = nz(d, -4, 4), q0 = nz(d, -6, 6), x0 = d.until(() => p + pm(d) * d.int(1, 2), (x) => x !== 0), y0 = a * (x0 - p) ** 2 + q0;
            return vals(`이차함수 ${nb(`${Y} = ${A}(${X} ${MINUS} ${P})${sup(2)} ${sgn(q0)}`)}의 그래프가 직선 ${isj(X, p, '을/를')} 축으로 하고 점 ${ptj(x0, y0, '을/를')} 지날 때, 수 ${A}, ${P}의 값은?`, [[A, a], [P, p]], {
              explain: `축의 방정식이 ${is(X, P)}이므로 ${is(P, p)}이다. ${put(x0, y0)} ${nb(`${iq(y0)} = ${ka((x0 - p) ** 2, A)} ${sgn(q0)}`)}, ${is(A, a)}이다.`,
              facts: { calc: [[`(${jn(y0)}-${jn(q0)})/((${jn(x0)}-${jn(p)})*(${jn(x0)}-${jn(p)}))`, 0], [jn(p), 1]], rule: 'v-point-1' }
            });
          }, { count: 2 }),
          T('vertex-from-graph', '그래프(그림)에서 y = a(x − p)² + q의 식 구하기', '①35', (d, n) => {
            if (n === 0) {
              // 꼭짓점에서 두 축으로 점선, 다른 한 점(y축 위의 점이거나 그래프 위의 점)
              const c = d.until(() => {
                const a = pm(d) * d.int(1, 3), p = nz(d, -3, 3), q = nz(d, -4, 4), onY = d.bool(), x0 = onY ? 0 : d.until(() => p + pm(d) * d.int(1, 2), (x) => x !== 0 && x !== p), y0 = a * (x0 - p) ** 2 + q;
                const o = { x: span([p, x0], 1.6), y: span([q, y0], 1.6), parabolas: [{ a, p, q }], points: [{ x: p, y: q, guide: true }, { x: x0, y: y0, guide: onY ? false : true }], xnums: [{ v: p }].concat(onY ? [] : [{ v: x0 }]), ynums: [{ v: q }, { v: y0 }], say: `${bowl(a)} 포물선. 꼭짓점과 ${onY ? 'y축과 만나는 점' : '그래프 위의 한 점'}에 점을 찍고, ${onY ? '꼭짓점에서' : '두 점에서'} 두 축으로 점선을 그었다.` };
                return { a, p, q, x0, y0, onY, o };
              }, (v) => Math.abs(v.a) >= 2 && v.y0 !== 0 && v.y0 !== v.q && Math.abs(v.y0) <= 12 && figOk(v.o));
              return stdAns(`그림과 같은 포물선을 그래프로 하는 이차함수의 식을 ${stdL}의 꼴로 나타내시오.`, c.a, c.p, c.q, {
                figure: fig(c.o),
                explain: `꼭짓점이 ${pt(c.p, c.q)}이므로 식을 ${jw(nb(`${Y} = ${A}(${X} ${sgn(-c.p)})${sup(2)} ${sgn(c.q)}`), '으로/로')} 놓는다. 점 ${ptj(c.x0, c.y0, '을/를')} 지나므로 ${nb(`${iq(c.y0)} = ${ka((c.x0 - c.p) ** 2, A)} ${sgn(c.q)}`)}, ${is(A, c.a)}이다. 식은 ${std(c.a, c.p, c.q)}이다.`,
                facts: { calc: [[`(${jn(c.y0)}-${jn(c.q)})/((${jn(c.x0)}-${jn(c.p)})*(${jn(c.x0)}-${jn(c.p)}))`, 0], [`0-${jn(c.p)}`, 1], [jn(c.q), 2]], unseen: [0], rule: 'v-graph-0' }
              });
            }
            // 축(점선)과 두 점(x축 위의 점, y축 위의 점): 미지수 a, q 둘
            const c = d.until(() => {
              const a = pm(d) * d.int(1, 2), p = nz(d, -2, 2), r = d.int(2, 3), q = -a * r * r, x1 = p + pm(d) * r, yi = a * p * p + q;
              const o = { x: span([p - r, p + r], 1.6), y: span([q, yi], 1.6), parabolas: [{ a, p, q }], lines: [{ x: p, dash: true }], points: [{ x: x1, y: 0 }, { x: 0, y: yi }], xnums: [{ v: p }, { v: x1 }], ynums: [{ v: yi }], say: `${bowl(a)} 포물선과 축(점선). 그래프가 x축과 만나는 한 점과 y축과 만나는 점에 점을 찍었다.` };
              return { a, p, q, x1, yi, o };
            }, (v) => v.x1 !== 0 && v.yi !== 0 && Math.abs(v.a) >= 2 && figOk(v.o));
            return stdAns(`그림과 같이 직선 ${isj(X, c.p, '을/를')} 축으로 하는 포물선을 그래프로 하는 이차함수의 식을 ${stdL}의 꼴로 나타내시오.`, c.a, c.p, c.q, {
              figure: fig(c.o),
              explain: `축이 ${is(X, c.p)}이므로 식을 ${jw(nb(`${Y} = ${A}(${X} ${sgn(-c.p)})${sup(2)} + ${QV}`), '으로/로')} 놓는다. 점 ${jw(pt(c.x1, 0), '과/와')} ${ptj(0, c.yi, '을/를')} 지나므로 ${nb(`0 = ${ka((c.x1 - c.p) ** 2, A)} + ${QV}`)}, ${nb(`${iq(c.yi)} = ${ka(c.p * c.p, A)} + ${QV}`)}이다. 연립하면 ${is(A, c.a)}, ${is(QV, c.q)}이다.`,
              facts: { calc: [[`${jn(c.yi)}/(${jn(c.p)}*${jn(c.p)}-(${jn(c.x1)}-${jn(c.p)})*(${jn(c.x1)}-${jn(c.p)}))`, 0], [`0-${jn(c.p)}`, 1], [`0-${jn(c.yi)}/(${jn(c.p)}*${jn(c.p)}-(${jn(c.x1)}-${jn(c.p)})*(${jn(c.x1)}-${jn(c.p)}))*(${jn(c.x1)}-${jn(c.p)})*(${jn(c.x1)}-${jn(c.p)})`, 2]], unseen: [0], rule: 'v-graph-1' }
            });
          }, { count: 2 }),
          T('vertex-plus-form', 'y = a(x + p)² + q 꼴의 문자 값', '①36', (d) => {
            // 식이 x + p 꼴이므로 꼭짓점의 x좌표는 −p 이다.
            const c = d.until(() => {
              const a = pm(d) * d.int(1, 3), h = nz(d, -3, 3), q = nz(d, -4, 4), yi = a * h * h + q;
              const o = { x: span([h], 1.6), y: span([q, yi], 1.6), parabolas: [{ a, p: h, q }], points: [{ x: h, y: q, guide: true }, { x: 0, y: yi }], xnums: [{ v: h }], ynums: [{ v: q }, { v: yi }], say: `${bowl(a)} 포물선. 꼭짓점에서 두 축으로 점선을 긋고, y축과 만나는 점에 점을 찍었다.` };
              return { a, h, q, yi, o };
            }, (v) => v.yi !== 0 && v.yi !== v.q && Math.abs(v.yi) <= 12 && figOk(v.o));
            return vals(`이차함수 ${nb(`${Y} = ${A}(${X} + ${P})${sup(2)} + ${QV}`)}의 그래프가 그림과 같을 때, 수 ${A}, ${P}, ${QV}의 값은?`, [[A, c.a], [P, -c.h], [QV, c.q]], {
              figure: fig(c.o),
              explain: `꼭짓점이 ${pt(c.h, c.q)}이므로 ${nb(`${Y} = ${A}(${X} ${sgn(-c.h)})${sup(2)} ${sgn(c.q)}`)}이다. ${jw(nb(`${Y} = ${A}(${X} + ${P})${sup(2)} + ${QV}`), '과/와')} 견주면 ${is(P, -c.h)}(꼭짓점의 ${X}좌표 ${iq(c.h)}의 부호를 바꾼 수), ${is(QV, c.q)}이다. ${YA}과 만나는 점 ${ptj(0, c.yi, '을/를')} 지나므로 ${nb(`${iq(c.yi)} = ${ka(c.h * c.h, A)} ${sgn(c.q)}`)}, ${is(A, c.a)}이다.`,
              facts: { calc: [[`(${jn(c.yi)}-${jn(c.q)})/(${jn(c.h)}*${jn(c.h)})`, 0], [`0-${jn(c.h)}`, 1], [jn(c.q), 2]], unseen: [0] }
            });
          }),
          T('vertex-increase-point', '증가하는 범위와 한 점으로 p, q 구하기', '①38', (d) => {
            const a = pm(d), p = nz(d, -4, 4), q = nz(d, -6, 6), x0 = d.until(() => p + pm(d) * d.int(1, 2), (x) => x !== p), y0 = a * (x0 - p) ** 2 + q, inc = d.bool(), rel = (a > 0) === inc ? GT : LT;
            return vals(`이차함수 ${nb(`${Y} = ${a < 0 ? MINUS : ''}(${X} ${MINUS} ${P})${sup(2)} + ${QV}`)}의 그래프가 다음 두 조건을 모두 만족시킬 때, ${P}, ${QV}의 값은?`, [[P, p], [QV, q]], {
              figure: lines([`(가) ${X}의 값이 증가할 때 ${Y}의 값${inc ? '도 증가' : '은 감소'}하는 ${X}의 값의 범위는 ${nb(`${X} ${rel} ${iq(p)}`)}이다.`, `(나) 점 ${ptj(x0, y0, '을/를')} 지난다.`]),
              explain: `${a > 0 ? '아래로' : '위로'} 볼록한 포물선은 축을 경계로 증가와 감소가 바뀐다. 조건 (가)에서 축은 ${is(X, p)}이므로 ${is(P, p)}이다. 조건 (나)에서 ${put(x0, y0)} ${nb(`${iq(y0)} = ${a < 0 ? MINUS : ''}${(x0 - p) ** 2} + ${QV}`)}, ${is(QV, q)}이다.`,
              facts: { calc: [[jn(p), 0], [`${jn(y0)}-(${a < 0 ? '0-' : ''}(${jn(x0)}-${jn(p)})*(${jn(x0)}-${jn(p)}))`, 1]], unseen: [0] }
            });
          }),
          T('vertex-segment', 'x축의 방향으로 옮긴 두 그래프와 x축에 평행한 선분', '①39', (d) => {
            const a = d.pick([Q(1, 2), Q(1), Q(2), Q(1, 3)]), m = pm(d) * d.int(2, 4), xa = m / 2, ya = num(a) * xa * xa, xb = 3 * m / 2;
            const top = num(a) * Math.max(xb * xb, (xb - m) ** 2, m * m) + 1, o = { x: m > 0 ? [-2, Math.ceil(xb + 2)] : [Math.floor(xb - 2), 2], y: [-1, Math.min(Math.ceil(top), Math.ceil(ya * 3 + 2))], parabolas: [{ a }, { a, p: m }], segs: [[xa, ya, xb, ya]], points: [{ x: xa, y: ya, name: 'A' }, { x: xb, y: ya, name: 'B' }], say: '아래로 볼록한 두 포물선. 두 포물선의 교점 A와, A를 지나고 x축에 평행한 직선이 뒤 포물선과 다시 만나는 점 B를 이은 선분이 있다.' };
            return N(`그림은 두 이차함수 ${std(a, 0, 0)}, ${std(a, m, 0)}의 그래프이다. 점 A는 두 그래프의 교점이고, 점 B는 ${std(a, m, 0)}의 그래프 위의 점이다. 선분 AB가 ${XA}에 평행할 때, 선분 AB의 길이는?`, Math.abs(m), {
              figure: fig(o),
              explain: `${std(a, m, 0)}의 그래프는 ${std(a, 0, 0)}의 그래프를 ${XA}의 방향으로 ${iq(m)}만큼 평행이동한 것이다. ${XA}에 평행한 선분 AB의 두 끝은 옮기기 전의 점과 옮긴 뒤의 점의 짝이므로 길이는 ${Math.abs(m)}이다.`,
              facts: { value: String(Math.abs(m)) }
            });
          }),
          T('vertex-yint', 'y = a(x − p)² + q의 그래프가 y축과 만나는 점', '①40', (d) => {
            const a = nz(d, -3, 3), p = nz(d, -4, 4), q = nz(d, -6, 6), yi = a * p * p + q;
            return N(`이차함수 ${std(a, p, q)}의 그래프가 ${YA}과 만나는 점의 ${Y}좌표는?`, yi, { signed: true,
              explain: `${YA}과 만나는 점은 ${is(X, 0)}일 때이다. ${isj(X, 0, '을/를')} 대입하면 ${nb(`${Y} = ${iq(a)} × (0 ${sgn(-p)})${sup(2)} ${sgn(q)} = ${iq(yi)}`)}이다. 꼭짓점의 ${Y}좌표 ${iq(q)}${tail(Math.abs(q), '과/와')}는 다르다.`,
              facts: { value: `${jn(a)}*${jn(p)}*${jn(p)}+${jn(q)}`, unseen: [1] }
            });
          }),
          T('vertex-mutual', '서로의 꼭짓점을 지나는 두 그래프', '심1', (d) => {
            const k = pm(d) * d.int(1, 3), p = nz(d, -3, 3), q = -k * p * p, a = -k;
            return vals(`두 이차함수 ${nb(`${Y} = ${A}(${X} ${sgn(-p)})${sup(2)}`)}, ${nb(`${Y} = ${coefText(k)}${X2} + ${QV}`)}의 그래프가 서로의 꼭짓점을 지날 때, 수 ${A}, ${QV}의 값은?`, [[A, a], [QV, q]], {
              explain: `앞 그래프의 꼭짓점 ${pt(p, 0)}${tail(0, '을/를')} 뒤 식에 대입하면 ${nb(`0 = ${iq(k * p * p)} + ${QV}`)}, ${is(QV, q)}이다. 뒤 그래프의 꼭짓점 ${pt(0, q)}${tail(Math.abs(q), '을/를')} 앞 식에 대입하면 ${nb(`${iq(q)} = ${ka(p * p, A)}`)}, ${is(A, a)}이다.`,
              facts: { calc: [[`0-${jn(k)}`, 0], [`0-${jn(k)}*${jn(p)}*${jn(p)}`, 1]], unseen: [0, 1] }
            });
          })
        ]
      },
      // ── 평행이동과 그래프의 모양·성질 ──
      {
        id: 'shape', title: '평행이동과 그래프의 모양·성질', standard: S22,
        types: [
          T('shape-overlap', '평행이동하여 포갤 수 있는 그래프', '①41', (d, n) => {
            const a = Q(pm(d) * d.int(1, 3)), c1 = d.int(1, 3), k1 = d.int(1, 3), k2 = d.int(1, 3);
            // 같은 계수 a 의 여러 꼴(정리해야 보이는 것 포함)과 계수가 다른 꼴. (c + x)(c − x) = −x² + c² 은 a = −1 일 때만 같은 계수이다.
            const twin = { h: nb(`${Y} = (${c1} + ${X})(${c1} ${MINUS} ${X})`), why: nb(`(${c1} + ${X})(${c1} ${MINUS} ${X}) = ${MINUS}${X2} + ${c1 * c1}`) };
            const same = [
              () => ({ h: std(a, nz(d, -5, 5), 0) }),
              () => ({ h: std(a, 0, nz(d, -6, 6)) }),
              () => ({ h: std(a, nz(d, -4, 4), nz(d, -5, 5)) }),
              () => ({ h: nb(`${Y} = ${coefText(a)}(${k1} ${MINUS} ${X})${sup(2)} ${sgn(nz(d, -5, 5))}`), why: nb(`(${k1} ${MINUS} ${X})${sup(2)} = (${X} ${MINUS} ${k1})${sup(2)}`) }),
              () => { const [, b, c] = expand(a, nz(d, -3, 3), nz(d, -4, 4)); return { h: gen(a, b, c) }; }
            ].concat(a.p === -1 ? [() => twin] : []);
            const other = [
              () => ({ h: std(qneg(a), nz(d, -4, 4), nz(d, -5, 5)) }),
              () => ({ h: nb(`${Y} = ${coefText(qneg(a))}(${k2} ${MINUS} ${X})${sup(2)} ${sgn(nz(d, -5, 5))}`), why: nb(`(${k2} ${MINUS} ${X})${sup(2)} = (${X} ${MINUS} ${k2})${sup(2)}`) }),
              () => ({ h: std(Q(a.p * 2), nz(d, -4, 4), 0) }),
              () => { const [, b, c] = expand(Q(-a.p), nz(d, -3, 3), nz(d, -4, 4)); return { h: gen(Q(-a.p), b, c) }; }
            ].concat(a.p === 1 ? [() => twin] : []);
            const whys = (rows) => [...new Set(rows.map((r) => r.why).filter(Boolean))].map((w) => w + '이다. ').join('');
            if (n === 0) {
              const rows = d.shuffle(d.shuffle(same).slice(0, 4).map((f) => ({ ...f(), ok: true })).concat([{ ...d.pick(other)(), ok: false }]));
              return C(`다음 이차함수의 그래프 중 이차함수 ${std(a, 0, 0)}의 그래프를 평행이동하여 완전히 포갤 수 없는 것은?`, rows.map((r) => r.h), rows.findIndex((r) => !r.ok), {
                explain: `평행이동하여 포갤 수 있으려면 식을 정리했을 때 ${X2}의 계수가 ${jw(iq(a), '으로/로')} 같아야 한다. ${whys(rows)}${X2}의 계수가 다른 것은 ${rows.find((r) => !r.ok).h}이다.`,
                facts: { truth: rows.map((r) => !r.ok), want: true, rule: 'overlap-0' }
              });
            }
            const rows = d.shuffle(d.shuffle(same).slice(0, d.int(2, 3)).map((f) => ({ ...f(), ok: true })).concat(d.shuffle(other).slice(0, 2).map((f) => ({ ...f(), ok: false }))));
            const flags = rows.map((r) => r.ok), cnt = flags.filter(Boolean).length, base = expand(a, nz(d, -3, 3), nz(d, -5, 5));
            return N(`다음 이차함수 중 그 그래프를 평행이동하여 이차함수 ${gen(base[0], base[1], base[2])}의 그래프와 포갤 수 있는 것은 모두 몇 개인가?`, cnt, { unit: '개',
              figure: rows1(rows.map((r) => r.h)),
              explain: `평행이동하여 포갤 수 있으려면 ${X2}의 계수가 ${jw(iq(a), '으로/로')} 같아야 한다. ${whys(rows)}${X2}의 계수가 ${iq(a)}인 것은 ${flags.map((f, i) => (f ? TAG6[i] : '')).filter(Boolean).join(', ')}의 ${cnt}개이다.`,
              facts: { count: flags, rule: 'overlap-1' }
            });
          }, { count: 2 }),
          T('shape-width', '평행이동한 꼴 가운데 폭이 가장 좁은(넓은) 그래프', '①42', (d) => {
            const wantNarrow = d.bool(), mags = d.shuffle([Q(1, 4), Q(1, 3), Q(1, 2), Q(2, 3), Q(3, 2), Q(2), Q(3), Q(4), Q(5, 2)]).slice(0, 5);
            const rows = mags.map((m) => { const a = d.bool() ? m : qneg(m), kind = d.int(0, 2); return { a, h: kind === 0 ? std(a, 0, nz(d, -6, 6)) : kind === 1 ? std(a, nz(d, -4, 4), 0) : std(a, nz(d, -4, 4), nz(d, -5, 5)) }; });
            const vals_ = rows.map((r) => fl(qabs(r.a))), best = wantNarrow ? Math.max(...vals_) : Math.min(...vals_), at = vals_.indexOf(best);
            return C(`다음 이차함수 중 그 그래프의 폭이 가장 ${wantNarrow ? '좁은' : '넓은'} 것은?`, rows.map((r) => r.h), at, {
              explain: `평행이동하여도 폭은 변하지 않는다. ${X2}의 계수의 절댓값이 ${wantNarrow ? '클수록 폭이 좁고' : '작을수록 폭이 넓고'}, 그것은 ${rows[at].h}이다.`,
              facts: { choose: { exprs: rows.map((r) => { const m = qabs(r.a); return m.q === 1 ? String(m.p) : `${m.p}/${m.q}`; }), rule: wantNarrow ? 'max' : 'min' } }
            });
          }),
          T('shape-common', '두 그래프의 공통점', '①43', (d) => {
            // 이차항의 계수가 같은 두 그래프(꼭짓점·축·y절편은 다르다): 공통점은 폭과 볼록한 쪽뿐
            const c = d.until(() => { const a = pm(d) * d.int(1, 4), q1 = nz(d, -6, 6), p2 = nz(d, -3, 3), q2 = d.pick([0, nz(d, -5, 5)]); return { a, q1, p2, q2, yi2: a * p2 * p2 + q2 }; }, (v) => v.yi2 !== v.q1 && v.q2 !== v.q1);
            const up = c.a > 0, rows = d.shuffle([
              ['꼭짓점이 같다.', false], ['축이 같다.', false], [`${YI}이 같다.`, false], [`${up ? '위로' : '아래로'} 볼록하다.`, false], ['폭이 같다.', true]
            ]);
            return C(`다음 중 두 이차함수 ${std(c.a, 0, c.q1)}, ${std(c.a, c.p2, c.q2)}의 그래프의 공통점은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              explain: `두 그래프의 꼭짓점은 ${pt(0, c.q1)}, ${pt(c.p2, c.q2)}이고 축은 ${is(X, 0)}, ${is(X, c.p2)}, ${YI}은 ${iq(c.q1)}, ${iq(c.yi2)}이다. ${X2}의 계수가 ${jw(iq(c.a), '으로/로')} 같으므로 폭이 같고 둘 다 ${up ? '아래로' : '위로'} 볼록하다.`,
              facts: { truth: rows.map((r) => r[1]), want: true }
            });
          }),
          T('shape-axis-y', 'y축을 축으로 하지 않는 그래프', '①44', (d) => {
            const k = d.int(2, 4), c = d.int(1, 3), t = nz(d, -5, 5), r = d.int(2, 4);
            const rows = d.shuffle([
              { h: std(aOf(d), 0, 0), ok: true },
              { h: std(pm(d) * d.int(1, 3), 0, nz(d, -6, 6)), ok: true },
              { h: nb(`${Y} = ${k}(${MINUS}${X2} + ${d.int(1, 5)})`), ok: true },
              { h: nb(`${Y} = ${r}(${X} + ${c})${sup(2)} ${MINUS} ${2 * r * c}${X}`), ok: true, as: nb(`${Y} = ${r}${X2} + ${r * c * c}`) },
              { h: std(aOf(d), nz(d, -5, 5), d.pick([0, t])), ok: false }
            ]);
            return C(`다음 이차함수 중 그 그래프가 ${YA}을 축으로 하지 않는 것은?`, rows.map((r_) => r_.h), rows.findIndex((r_) => !r_.ok), {
              explain: `${YA}을 축으로 하려면 정리한 식에 ${X}의 항이 없어야 한다. ${jw(nb(`${r}(${X} + ${c})${sup(2)} ${MINUS} ${2 * r * c}${X}`), '을/를')} 정리하면 ${nb(`${r}${X2} + ${r * c * c}`)}이므로 ${YA}을 축으로 한다. ${rows.find((r_) => !r_.ok).h}의 축은 ${YA}이 아니다.`,
              facts: { truth: rows.map((r_) => !r_.ok), want: true }
            });
          }),
          T('shape-increase', 'x의 값이 증가할 때 y의 값이 증가(감소)하는 범위', '①45', (d, n) => {
            const a = pm(d) * d.int(1, 3), p = nz(d, -5, 5), q = nz(d, -6, 6), inc = d.bool(), rel = (a > 0) === inc ? '>' : '<';
            const [aa, b, c] = expand(a, p, q), h = n === 0 ? std(a, p, q) : gen(aa, b, c);
            return inline(`이차함수 ${h}의 그래프에서 ${X}의 값이 증가할 때 ${Y}의 값${inc ? '도 증가' : '은 감소'}하는 ${X}의 값의 범위를 구하시오.`, `${X} {0} {1}`, [{ rel: true, answer: rel }, { answer: p, signed: true }], {
              shown: nb(`${X} ${rel === '>' ? GT : LT} ${iq(p)}`),
              explain: (n === 1 ? `${jw(h, '을/를')} 고치면 ${std(a, p, q)}이다. ` : '') + `${bowl(a)} 포물선이고 축이 ${is(X, p)}이다. ${a > 0 ? '아래로' : '위로'} 볼록하므로 축의 ${(a > 0) === inc ? '오른쪽' : '왼쪽'}, 곧 ${nb(`${X} ${rel === '>' ? GT : LT} ${iq(p)}`)}에서 ${X}의 값이 증가할 때 ${Y}의 값${inc ? '도 증가' : '은 감소'}한다.`,
              facts: { calc: [[n === 0 ? jn(p) : `0-${jn(b)}/(2*${jn(aa)})`, 1]], unseen: [0, 1], rule: 'inc-' + n }
            });
          }, { count: 2 }),
          T('shape-quadrant', '그래프가 지나지 않는 사분면', '①46', (d, n) => {
            const c = d.until(() => { const a = pm(d) * d.int(1, 3), p = nz(d, -4, 4), q = nz(d, -6, 6), hit = quadsOf(a, p, q), miss = [0, 1, 2, 3].filter((i) => !hit[i]); return { a, p, q, miss }; }, (v) => v.miss.length === 1 || v.miss.length === 2);
            const [aa, b, cc] = expand(c.a, c.p, c.q), h = n === 0 ? std(c.a, c.p, c.q) : gen(aa, b, cc), yi = c.a * c.p * c.p + c.q;
            const pairText = c.a > 0 ? '제3, 4사분면' : '제1, 2사분면', opts = QN.concat([pairText]), want = quadText(c.miss), at = opts.indexOf(want);
            return C(`이차함수 ${h}의 그래프가 지나지 않는 사분면은?`, opts, at, {
              explain: (n === 1 ? `${jw(h, '을/를')} 고치면 ${std(c.a, c.p, c.q)}이다. ` : '') + `꼭짓점이 ${pt(c.p, c.q)}이고 ${YI}이 ${iq(yi)}인 ${bowl(c.a)} 포물선이므로 ${want}을 지나지 않는다.`,
              facts: { truth: opts.map((s) => s === want), want: true, rule: 'quad-' + n }
            });
          }, { count: 2 })
        ]
      }
    ]
  });

  // b·c 파일이 쓰는 도구
  B.kit.m916 = {
    S22, sourceOf, T, X, Y, A, BB, CC, P, QV, K, MM, NN, X2, XA, YA, XI, YI, TAG6, num, iq, jn, sgn, nj, is, isj, cx, pt, ptj, cmp, par, ka, lj, jw, put, coefText, rhs, std, genR, gen, stdL, genL,
    vtxOf, expand, FRACS, aOf, QN, quadsOf, quadText, stdAns, genAns, axisVtx, vals, rows1, pairPick, fig, figOk, figWhy, picks, span, bowl, stdClaims, wide, bare
  };
})(typeof window !== 'undefined' ? window : globalThis);
