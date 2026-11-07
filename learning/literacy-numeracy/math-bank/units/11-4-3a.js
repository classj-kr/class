// 고등학교 기하 Ⅰ-3 쌍곡선(11-4-3) — 단원 틀·단원 안의 도구와 앞쪽 묶음
// (쌍곡선의 뜻과 방정식 — 초점이 x축·y축 위, 쌍곡선의 점근선, 쌍곡선의 평행이동).
// 수집해 둔 천재 T셀파 기하(전인태, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록
// (기본꼴_1: 방정식·점근선·평행이동·정의를 쓰는 길이 36꼴, 기본꼴_2: 접선·이차곡선 22꼴 — 심화 문서는 없다)을 꼴마다 따져서 실었다.
// 꼴마다 「실음 / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-4-3/싣기_대조표.md 에 있다.
// (두 초점까지의 거리·접선·이차곡선은 11-4-3b.js 에, 실력 문항은 11-4-3c.js 에 있다. 단원 안의 도구는 B.kit.u1143 으로 내보낸다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
// 영역은 기하(이차곡선). 성취기준은 12기하01-03(쌍곡선의 뜻과 방정식), 12기하01-04(이차곡선의 접선의 방정식).
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(두 초점과 거리의 차·꼭짓점·점근선·그림·일반형 방정식), 묻는 것(방정식·초점·주축·점근선·길이·고르기),
//    계산의 얼개(표준형 그대로, 완전제곱식으로 고치기, 우변이 −1인 꼴)가 다르면 따로 싣는다. 같은 꼴에서 수만 바꾼 유형은 만들지 않았다.
//    차례(count)가 여럿인 유형은 차례마다 주는 것이나 답의 꼴이 다르다.
//  - 교육과정(2022 원문 4979~4993줄): 「이차곡선과 직선과의 관계는 접하는 경우만 다룬다」 「평행이동한 이차곡선의 접선의 방정식은 다루지 않는다」
//    「이심률을 이용한 정의는 다루지 않는다」를 지켰다. 미적분Ⅱ의 음함수의 미분법은 쓰지 않는다.
//    고1·중학교 단원과 같은 일을 끝 단계에 쓰는 꼴(점과 직선 사이의 거리, 원의 방정식)은 싣고, 타원이 섞인 꼴도 이 단원에 실었다(조율 결정).
//  - 답: 쌍곡선의 방정식은 「x²/[ ] − y²/[ ] = [±][ ]」(우변의 부호까지 칸으로 받아 초점이 놓인 축을 흘리지 않는다), 평행이동한 꼴은
//    「(x [±][ ])²/[ ] − (y [±][ ])²/[ ] = [±][ ]」, 두 점의 좌표는 차례를 따지지 않는 두 쌍, 길이가 무리수이면 「[ ]√[ ]」(한 유형 안에서 늘 같은 모양),
//    분수 계수의 직선·점근선의 짝처럼 칸으로 받으면 꼴이 답을 흘리는 것은 고르기로 낸다. 음수가 될 수 있는 답에는 부호 단추를 단다(길이·넓이에는 달지 않는다).
//  - 원문의 「a + b의 값」처럼 따로 구한 값을 뜻 없이 더하는 꼴은 값을 칸마다 묻는다. 참·거짓과 정답은 모두 코드가 셈한다.
//  - 검사 근거: 칸마다 글에 보이는 수로 다시 셈하는 식(facts.calc·value)을 단다. 글에 보이지 않는 수(제곱근의 0.5, 4로 나누기 따위)는
//    seal 이 facts.unseen 에 밝히고, 밝히기로 한 수(derived) 밖의 수가 나오면 오류를 낸다.
//
// 뺀 것과 까닭(11-4-3b.js, 11-4-3c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - ①12(점근선이 같은 쌍곡선의 그래프 그리기 — 교과서 관계 탐구): 원문의 물음이 그리기·비교뿐이다(활동, 조율 결정).
//  - ②6(쌍곡선과 직선의 교점 개수): 교육과정 「이차곡선과 직선과의 관계는 접하는 경우만 다룬다」.
//  - ②21(음함수의 미분법으로 접선): 미적분Ⅱ의 내용. 같은 접선은 접선 공식으로 구하는 ②7(tan-point)에 있다.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」 문자는 값을 물으면 「상수 a」, 범위·최댓값·최솟값이면 「실수 a」로 부른다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines, N, M, C, inline } = B.kit;
  const { MINUS, Q, qmul, qsub, qadd, qdiv, gcd, tx, V, sup, nb, tag, poly, rt, grp, sqParts, radText, SG } = B.kit.mid;
  const { jh, hx, qAns, coordAns, plot } = B.kit.hs;
  const UNIT = '11-4-3', S3 = '12기하01-03', S4 = '12기하01-04';
  const HAN = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'], CIR = ['㉠', '㉡', '㉢', '㉣', '㉤'];

  // ── 검사 근거 마무리(11-1-1a.js 와 같은 방법) ──
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 좌표처럼 짧은 괄호 묶음 「(3, −2)」「F′(−√13, 0)」은 줄이 그 가운데서 갈리지 않게 묶는다(문제 글·보기·글줄 그림만, 보이는 글자 16자까지).
  const COORD = /([A-Z]′?)?\(((?:[^()<>]|<[^>]*>)*?, (?:[^()<>]|<[^>]*>)*?)\)/g;
  const tieCoords = (h) => (typeof h !== 'string' ? h : h.replace(COORD, (all) => (stripH(all).length <= 16 && !/white-space:nowrap">[^<]*$/.test(all) ? '<span style="white-space:nowrap">' + all + '</span>' : all)));
  // 글 속에 맨글자로 적은 문자 x, y(x축, y좌표, y절편, x = 0, x₁ …)를 수식 글꼴의 기울인 글자로(태그 밖의 글만 바꾼다).
  const XY = /(^|[^A-Za-z_'])([xy])(?=축|좌표|절편|₁| = |, [xy]에 대한|에 대한)/g;
  const italXY = (h) => (typeof h !== 'string' ? h : h.replace(/(<[^>]*>)|([^<]+)/g, (all, tag, txt) => (tag || txt.replace(XY, (m, pre, v) => pre + V(v)))));
  const look = (h) => italXY(tieCoords(h));
  function seal(item) {
    item.text = look(item.text);
    if (item.choice) item.choice.options = item.choice.options.map(look);
    if (item.figure && !/<svg/.test(item.figure)) item.figure = look(item.figure);
    if (item.explain) item.explain = italXY(item.explain);
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
  const retry = (make) => (d, n) => { for (let i = 0; i < 6000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const srcOf = (ref) => '수집본 기본 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: srcOf(ref), make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: srcOf(ref), make: retry(make) }, more || {});

  // ── 수와 글 ──
  const num = (n) => (n < 0 ? MINUS + Math.abs(n) : String(n));                 // 정수(음수는 −)
  const jn = (n) => (n < 0 ? '(' + n + ')' : String(n));                         // 검사 식의 정수
  const nj = (n, pair) => num(n) + josa(Math.abs(n), pair).slice(String(Math.abs(n)).length);   // 정수 뒤 토씨(읽는 소리대로)
  const isSq = (n) => n >= 0 && Number.isInteger(Math.sqrt(n));
  const sqFree = (n) => Number.isInteger(n) && n >= 2 && sqParts(n)[0] === 1;   // 제곱인 수를 인수로 갖지 않는 2 이상의 수
  const lcm = (a, b) => a / gcd(a, b) * b;
  // √n2 의 글(완전제곱수면 정수, 아니면 a√b)
  const rad = (n2) => (isSq(n2) ? String(Math.sqrt(n2)) : radText(...sqParts(n2)));
  const nrad = (n2) => nb(MINUS + rad(n2));
  // 그림(svg) 속 글의 √n2
  const radP = (n2) => { if (isSq(n2)) return String(Math.sqrt(n2)); const [s, r] = sqParts(n2); return (s === 1 ? '' : s) + '√' + r; };
  // 검사 식: 글에 √n2 꼴로 보이는 수(n2 자체를 만든다) — k 는 k*k, s√r 은 s*s*r, √r 은 r
  const sqE = (n2) => { if (isSq(n2)) { const k = Math.sqrt(n2); return `(${k}*${k})`; } const [s, r] = sqParts(n2); return s === 1 ? String(r) : `(${s}*${s}*${r})`; };
  // √(p/q)(p, q 는 양의 정수)를 (k/m)√r 꼴로
  const surd = (p, q) => { const [s, r] = sqParts(p * q), g = gcd(s, q); return { k: s / g, m: q / g, r }; };
  const surdV = (u) => u.k / u.m * Math.sqrt(u.r);
  const surdKey = (u) => u.k + '/' + u.m + 'r' + u.r;
  // 글: (k/m)√r. 계수로 쓸 때(coef) 1은 적지 않는다(y = ±x).
  const surdH = (u, coef) => {
    if (coef && u.k === 1 && u.m === 1 && u.r === 1) return '';
    const top = (u.k === 1 && u.r !== 1 ? '' : String(u.k)) + (u.r === 1 ? '' : rt(u.r));
    return u.m === 1 ? top : frac(top, u.m);
  };
  const surdP = (u) => (u.k === 1 && u.r !== 1 ? '' : String(u.k)) + (u.r === 1 ? '' : '√' + u.r) + (u.m === 1 ? '' : '/' + u.m);

  const X = V('x'), Y = V('y'), X2 = X + sup(2), Y2 = Y + sup(2);
  const va = V('a'), vb = V('b'), vc = V('c'), vk = V('k'), vm = V('m'), vn = V('n');
  const over = (top, dn) => (dn === 1 ? top : frac(top, dn));
  // 쌍곡선 x²/A − y²/B = s, 타원 x²/A + y²/B = 1, 일반형 Px² − Qy² = R
  const hypH = (A, Bd, s) => nb(over(X2, A) + ' ' + MINUS + ' ' + over(Y2, Bd) + ' = ' + num(s));
  const ellH = (A, Bd) => nb(over(X2, A) + ' + ' + over(Y2, Bd) + ' = 1');
  const genH = (P, Qc, R) => nb(poly([[P, X2], [-Qc, Y2]]) + ' = ' + num(R));
  // 평행이동한 꼴: (x − p)²/A − (y − q)²/B = s (p = 0 이면 x²)
  const bx = (v, p) => (p === 0 ? v : '(' + v + ' ' + (p > 0 ? MINUS : '+') + ' ' + Math.abs(p) + ')');
  const shH = (p, q, A, Bd, s) => nb(over(bx(X, p) + sup(2), A) + ' ' + MINUS + ' ' + over(bx(Y, q) + sup(2), Bd) + ' = ' + num(s));
  const symH = (s) => nb(frac(X2, va + sup(2)) + ' ' + MINUS + ' ' + frac(Y2, vb + sup(2)) + ' = ' + num(s));   // x²/a² − y²/b² = ±1
  // 직선 y = mx + n(m, n 은 정수나 유리수 Q)
  const lineH = (m, n) => nb(Y + ' = ' + poly([[m, X], [n, '']]));
  // 직선 px + qy = r(정수, 공약수로 나누고 x 의 계수를 양수로)
  const normLine = (p, q, r) => { let g = gcd(gcd(Math.abs(p), Math.abs(q)), Math.abs(r)) || 1; if (p < 0 || (p === 0 && q < 0)) g = -g; return [p / g, q / g, r / g]; };
  const stdLine = (p, q, r) => nb(poly([[p, X], [q, Y]]) + ' = ' + num(r));
  // 점근선의 짝 y = ±kx(k 는 surd)
  const pmLine = (u) => nb(Y + ' = ±' + surdH(u, true) + X);
  // 점
  const cx = (v) => (typeof v === 'number' ? num(v) : v);
  const pt = (x, y) => nb('(' + cx(x) + ', ' + cx(y) + ')');
  const Pn = (name, x, y) => nb(name + '(' + cx(x) + ', ' + cx(y) + ')');
  const bar = (nm) => SG(nm);

  // ── 답 칸 ──
  // 쌍곡선의 방정식: 「x²/[ ] − y²/[ ] = [±][ ]」 — 우변의 부호도 칸으로 받는다.
  function eqAns(text, A, Bd, s, o) {
    return inline(text, grp(frac(X2, '{0}')) + ' ' + MINUS + ' ' + grp(frac(Y2, '{1}')) + ' ' + grp('= {2}'), [{ answer: A }, { answer: Bd }, { answer: s, signed: true }], Object.assign({}, o, { shown: hypH(A, Bd, s) }));
  }
  // 평행이동한 쌍곡선: 「(x [±][ ])²/[ ] − (y [±][ ])²/[ ] = [±][ ]」(중심의 두 좌표는 0이 아니다)
  function shEqAns(text, p, q, A, Bd, s, o) {
    if (!p || !q) throw new Error('평행이동한 쌍곡선 답: 중심의 두 좌표는 0이 아니어야 한다');
    return inline(text, grp(frac('(' + X + ' {0})' + sup(2), '{1}')) + ' ' + MINUS + ' ' + grp(frac('(' + Y + ' {2})' + sup(2), '{3}')) + ' ' + grp('= {4}'),
      [{ answer: -p, signed: true }, { answer: A }, { answer: -q, signed: true }, { answer: Bd }, { answer: s, signed: true }], Object.assign({}, o, { shown: shH(p, q, A, Bd, s) }));
  }
  // 두 점의 좌표: 「([±][ ], [±][ ]), ([±][ ], [±][ ])」 — 두 점의 차례는 따지지 않는다(원점에 대칭인 두 점은 쓰지 않는다 — 부호를 뒤집은 답이 맞게 된다).
  function pts2(text, a, b, o) {
    if (a[0] === -b[0] && a[1] === -b[1]) throw new Error('두 점 답: 원점에 대칭인 두 점');
    return inline(text, grp('({0}, {1})') + ', ' + grp('({2}, {3})'), [a[0], a[1], b[0], b[1]].map((v) => ({ answer: v, signed: true })),
      Object.assign({}, o, { blocks: [[0, 1], [2, 3]], shown: pt(a[0], a[1]) + ', ' + pt(b[0], b[1]) }));
  }
  // 양수 k√r(길이·넓이): k = 1 이면 「√[ ]」, 아니면 「[ ]√[ ]」. 한 유형 안에서는 늘 같은 모양이 되게 수를 고른다.
  function radPos(text, k, r, o) {
    if (!(Number.isInteger(k) && k >= 1 && sqFree(r))) throw new Error('근호 답: k 는 자연수, r 은 제곱인 수를 인수로 갖지 않는 2 이상의 수');
    const opt = Object.assign({}, o, { shown: radText(k, r) });
    return k === 1 ? inline(text, rt('{0}'), [{ answer: r }], opt) : inline(text, grp('{0}' + rt('{1}')), [{ answer: k }, { answer: r }], opt);
  }
  // 이름을 붙인 값 여럿: 「a = [ ]  b = [ ]」. pairs: [[이름 글, 값, 부호 단추?], …]
  const vals = (text, pairs, o) => M(text, pairs.map(([nm, v, sg]) => ({ answer: v, signed: Boolean(sg), lead: nm + ' =' })), Object.assign({}, o, { shown: pairs.map(([nm, v]) => nb(nm + ' = ' + num(v))).join(', ') }));
  // 보기의 글이 모두 다른가(태그를 걷고 본다)
  const distinct = (list) => new Set(list.map(stripH)).size === list.length;
  // 하나 고르기: 정답 글과 틀린 글들(서로 다른 글이어야 한다)
  function pickOne(d, text, right, wrongs, o) {
    const all = d.shuffle([right].concat(wrongs));
    if (!distinct(all)) return null;
    const opt = o || {};
    return C(text, all, all.indexOf(right), Object.assign({}, opt, { facts: Object.assign({ truth: all.map((h) => h === right), want: true }, opt.facts || {}) }));
  }
  // 이름표(ㄱ. ㄴ. …)를 붙인 여러 줄
  const rowsFig = (list, tags) => lines(list.map((h, i) => tag((tags || HAN.map((x) => x + '.'))[i]) + ' ' + h));
  // 옳은 것만을 있는 대로 고르기: rows [[글, 참?], …](참이 하나 이상, 모두는 아니다)
  function pickSets(d, text, rows, o) {
    const flags = rows.map((r) => r[1]), labels = HAN.slice(0, rows.length), right = labels.filter((_, i) => flags[i]);
    if (!right.length || right.length === rows.length) return null;
    const cand = [];
    for (let i = 0; i < rows.length; i += 1) { const s = labels.filter((_, j) => (j === i ? !flags[j] : flags[j])); if (s.length) cand.push(s); }
    for (const s of [labels.slice(), [labels[0]], [labels[1]], [labels[rows.length - 1]], [labels[0], labels[1]]]) if (!cand.some((c) => c.join() === s.join()) && s.join() !== right.join()) cand.push(s);
    const opts = d.shuffle(d.shuffle(cand).slice(0, 4).concat([right]));
    const opt = o || {};
    return C(text, opts.map((s) => s.join(', ')), opts.indexOf(right), Object.assign({}, opt, { figure: opt.figure || rowsFig(rows.map((r) => r[0])), facts: Object.assign({ sets: { labels, flags, options: opts.map((s) => s.slice()) } }, opt.facts || {}) }));
  }

  // ── 그림 ──
  // 쌍곡선 그림: s = 1 이면 좌우로 열린 x²/A − y²/B = 1, s = −1 이면 위아래로 열린 꼴(A, B 는 양수). o 는 plot 의 나머지 설정.
  function hypPlot(A, Bd, s, o) {
    const a = Math.sqrt(A), b = Math.sqrt(Bd), opt = o || {};
    const par = s === 1 ? { x: (t) => a / Math.cos(t), y: (t) => b * Math.tan(t) } : { x: (t) => a * Math.tan(t), y: (t) => b / Math.cos(t) };
    if (opt.curveName) par.name = opt.curveName;
    if (opt.curveSaid) par.said = opt.curveSaid;
    return plot(Object.assign({}, opt, { params: [par].concat(opt.params || []) }));
  }

  // ── 수의 짝 ──
  // 피타고라스 수(a, b, c): c² = a² + b²
  const TRI = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17], [9, 12, 15], [12, 9, 15]];
  // 정수 좌표의 점이 있는 쌍곡선 x²/A − y²/B = s 와 그 위의 점 [A, B, x, y](x, y 는 양수 — 부호는 문항에서 정한다)
  const PTS = { 1: [], '-1': [] };
  for (let A = 2; A <= 40; A += 1) for (let Bd = 2; Bd <= 40; Bd += 1) for (let y = 1; y <= 9; y += 1) for (let x = 1; x <= 12; x += 1) {
    const L = Bd * x * x - A * y * y;
    if (L === A * Bd) PTS[1].push([A, Bd, x, y]);
    if (L === -A * Bd) PTS[-1].push([A, Bd, x, y]);
  }

  B.kit.u1143 = {
    UNIT, S3, S4, HAN, CIR, stripH, seal, retry, T, H, num, jn, nj, isSq, sqFree, lcm, rad, nrad, radP, sqE, surd, surdV, surdKey, surdH, surdP,
    X, Y, X2, Y2, va, vb, vc, vk, vm, vn, over, hypH, ellH, genH, bx, shH, symH, lineH, normLine, stdLine, pmLine, cx, pt, Pn, bar,
    eqAns, shEqAns, pts2, radPos, vals, distinct, pickOne, rowsFig, pickSets, hypPlot, TRI, PTS
  };

  // ── 단원 틀 ──
  B.addUnit({
    id: '11-4-3', grade: 11, semester: 4, no: 3, title: '쌍곡선', version: 1,
    groups: [
      { id: 'eq', title: '쌍곡선의 뜻과 방정식', standard: S3, types: [] },
      { id: 'asym', title: '쌍곡선의 점근선', standard: S3, types: [] },
      { id: 'shift', title: '쌍곡선의 평행이동', standard: S3, types: [] },
      { id: 'focus', title: '두 초점까지의 거리', standard: S3, types: [] },
      { id: 'tan', title: '쌍곡선의 접선의 방정식', standard: S4, types: [] },
      { id: 'out', title: '곡선 밖의 점에서 그은 접선과 점근선', standard: S4, types: [] },
      { id: 'conic', title: '이차곡선', standard: S4, types: [] }
    ]
  });

  // ── 쌍곡선의 뜻과 방정식 ──
  B.addTypes(UNIT, 'eq', [
    // ①1 준비하기: 거리의 차를 식으로, 좌표로 준 점에서 두 점까지 거리의 차
    T('eq-diff', '두 점까지 거리의 차', '①1', (d, n) => {
      const a = bar('PF'), b = bar('PF′');
      if (n === 0) {
        const k = d.int(2, 9);
        return pickOne(d, `「점 P에서 두 점 F, F′에 이르는 거리의 차는 ${k}이다.」를 식으로 나타낸 것은?`, `|${a} ${MINUS} ${b}| = ${k}`,
          [`${a} + ${b} = ${k}`, `${a} × ${b} = ${k}`, `|${a} ${MINUS} ${b}| = ${2 * k}`, `${a} = ${b}`],
          { explain: `거리의 차는 큰 쪽에서 작은 쪽을 뺀 값이므로 절댓값을 써서 |${a} ${MINUS} ${b}| = ${nj(k, '으로/로')} 나타낸다.` });
      }
      // P 와 같은 높이에 있는 점까지는 가로 거리 m, 다른 점까지는 √(m² + (2f)²)
      const f = d.int(1, 4), m = d.int(1, 6), n2 = m * m + 4 * f * f;
      if (isSq(n2)) return null;
      const sx = d.pick([1, -1]), sy = d.pick([1, -1]), near = sy > 0 ? 'F' : 'F′', far = sy > 0 ? 'F′' : 'F';
      return inline(`세 점 P(${num(sx * m)}, ${num(sy * f)}), F(0, ${f}), F′(0, ${num(-f)})에 대하여 점 P에서 두 점 F, F′에 이르는 거리의 차는?`,
        grp('{0} + ' + rt('{1}')), [{ answer: -m, signed: true }, { answer: n2 }], {
          shown: nb(rt(n2) + ' ' + MINUS + ' ' + m),
          explain: `${bar('P' + near)} = ${m}, ${bar('P' + far)} = ${rt(m + sup(2) + ' + ' + 2 * f + sup(2))} = ${rt(n2)}이므로 거리의 차는 ${nb(rt(n2) + ' ' + MINUS + ' ' + m)}이다.`,
          facts: { calc: [[`0-${m}`, 0], [`${m}*${m}+4*${f}*${f}`, 1]], derived: [4] }
        });
    }, { count: 2 }),
    // ①2 두 초점(±c, 0)과 거리의 차(#0) 또는 꼭짓점(#1 — 그림)으로 방정식
    T('eq-x', '두 초점과 거리의 차로 쌍곡선의 방정식(초점이 x축 위)', '①2', (d, n) => {
      const c2 = d.int(5, n === 0 ? 40 : 30), a = d.int(2, 5), A = a * a, Bd = c2 - A;
      if (Bd < 2) return null;
      const cH = rad(c2), c = Math.sqrt(c2), explainTail = `b² = c² ${MINUS} a² = ${c2} ${MINUS} ${A} = ${Bd}이다. 따라서 구하는 방정식은 ${hypH(A, Bd, 1)}이다.`;
      if (n === 0) {
        return eqAns(`두 초점 F(${cH}, 0), F′(${nrad(c2)}, 0)에 이르는 거리의 차가 ${2 * a}인 쌍곡선의 방정식을 구하시오.`, A, Bd, 1, {
          explain: `두 초점이 x축 위에 있으므로 ${symH(1)} 꼴이다. 거리의 차가 ${2 * a}이므로 2a = ${2 * a}, a² = ${A}이고, ${explainTail}`,
          facts: { calc: [[`${2 * a}*${2 * a}/4`, 0], [`${sqE(c2)}-${2 * a}*${2 * a}/4`, 1], ['1', 2]], derived: [4] }
        });
      }
      const b = Math.sqrt(Bd), ym = Math.max(3, Math.ceil(b * 1.9));
      const figure = hypPlot(A, Bd, 1, { x: [-(c + 1.8), c + 1.8], y: [-ym, ym], xt: [{ v: a, t: String(a) }, { v: c, t: radP(c2) }],
        dots: [{ x: c, y: 0, name: 'F', side: 'ur', said: '초점' }, { x: -c, y: 0, name: 'F′', side: 'ul', said: '초점' }, { x: a, y: 0, said: '꼭짓점' }, { x: -a, y: 0, said: '꼭짓점' }] });
      return eqAns(`그림과 같이 두 초점의 좌표가 (${cH}, 0), (${nrad(c2)}, 0)이고 두 꼭짓점의 좌표가 (${a}, 0), (${num(-a)}, 0)인 쌍곡선의 방정식을 구하시오.`, A, Bd, 1, {
        figure,
        explain: `두 초점이 x축 위에 있으므로 ${symH(1)} 꼴이다. 꼭짓점이 (±${a}, 0)이므로 a² = ${A}이고, ${explainTail}`,
        facts: { calc: [[`${a}*${a}`, 0], [`${sqE(c2)}-${a}*${a}`, 1], ['1', 2]] }
      });
    }, { count: 2 }),
    // ①3 방정식에서 초점·꼭짓점·주축(초점이 x축 위): #0 표준형, #1 일반형(초점이 무리수)
    T('eq-elem-x', '방정식에서 초점·꼭짓점·주축(초점이 x축 위)', '①3', (d, n) => {
      if (n === 0) {
        const [a, b, c] = d.pick(TRI), A = a * a, Bd = b * b;
        return M(`쌍곡선 ${hypH(A, Bd, 1)}의 두 초점의 좌표를 (${vc}, 0), (${MINUS}${vc}, 0), 두 꼭짓점의 좌표를 (${vk}, 0), (${MINUS}${vk}, 0)이라 할 때, ${vc}, ${vk}의 값과 주축의 길이를 차례로 구하시오. ${nb(`(단, ${vc} &gt; 0, ${vk} &gt; 0)`)}`,
          [{ answer: c, lead: vc + ' =' }, { answer: a, lead: vk + ' =' }, { answer: 2 * a, lead: '주축의 길이:' }], {
            shown: `${vc} = ${c}, ${vk} = ${a}, 주축의 길이 ${2 * a}`,
            explain: `a² = ${A}, b² = ${Bd}이므로 c = ${rt(A + ' + ' + Bd)} = ${c}이다. 꼭짓점은 (±${a}, 0)이고 주축의 길이는 2a = ${2 * a}이다.`,
            facts: { calc: [[`(${A}+${Bd})**0.5`, 0], [`${A}**0.5`, 1], [`2*${A}**0.5`, 2]], derived: [0.5, 2] }
          });
      }
      const a = d.int(1, 4), A = a * a, Bd = d.int(2, 15), c2 = A + Bd;
      if (!sqFree(c2) || Bd === A) return null;
      const R = lcm(A, Bd), P = R / A, Qc = R / Bd;
      return inline(`쌍곡선 ${genH(P, Qc, R)}의 두 초점의 좌표를 (${vc}, 0), (${MINUS}${vc}, 0)이라 할 때, ${vc}의 값과 주축의 길이를 구하시오. ${nb(`(단, ${vc} &gt; 0)`)}`,
        grp(`${vc} = ${rt('{0}')}`) + ', ' + grp('주축의 길이: {1}'), [{ answer: c2 }, { answer: 2 * a }], {
          shown: `${vc} = ${rt(c2)}, 주축의 길이 ${2 * a}`,
          explain: `양변을 ${josa(R, '으로/로')} 나누면 ${hypH(A, Bd, 1)}이다. c² = ${A} + ${Bd} = ${c2}이므로 c = ${rt(c2)}이고, a = ${a}이므로 주축의 길이는 ${2 * a}이다.`,
          facts: { calc: [[`${R}/${P}+${R}/${Qc}`, 0], [`2*(${R}/${P})**0.5`, 1]], derived: [2, 0.5] }
        });
    }, { count: 2 }),
    // ①4 거리의 차(= 주축의 길이)로 쌍곡선 식의 상수: #0 ax² − y² = b(중01 — 문제 글에 두 초점을 밝힌다), #1 완전제곱식으로 고쳐야 하는 꼴(교대04)
    T('eq-const', '거리의 차(주축의 길이)로 쌍곡선 식의 상수', '①4', (d, n) => {
      if (n === 0) {
        const k = d.pick([1, 2]), m = d.int(2, 8), c2 = k * k * (m + 1), cH = rad(c2);
        return vals(`쌍곡선 ${va}${X2} ${MINUS} ${Y2} = ${vb} 위의 점 P와 이 쌍곡선의 두 초점 F(${cH}, 0), F′(${nrad(c2)}, 0)에 대하여 |${bar('PF′')} ${MINUS} ${bar('PF')}| = ${2 * k}일 때, 상수 ${va}, ${vb}의 값을 구하시오.`,
          [[va, m], [vb, m * k * k]], {
            explain: `거리의 차가 주축의 길이이므로 2a = ${2 * k}, a² = ${k * k}이고, b² = c² ${MINUS} a² = ${c2} ${MINUS} ${k * k} = ${c2 - k * k}이다. ${hypH(k * k, c2 - k * k, 1)}의 양변에 ${josa(c2 - k * k, '을/를')} 곱하면 ${m}${X2} ${MINUS} ${Y2} = ${m * k * k}이므로 ${va} = ${m}, ${vb} = ${m * k * k}이다.`,
            facts: { calc: [[`(${sqE(c2)}-${2 * k}*${2 * k}/4)/(${2 * k}*${2 * k}/4)`, 0], [`${sqE(c2)}-${2 * k}*${2 * k}/4`, 1]], derived: [4] }
          });
      }
      const p = d.pick([1, 1, 4, 9]), q = d.int(1, 5), dd = 2 * d.int(1, 6);
      if (p === q) return null;
      const co = (c, v) => (c === 1 ? v : c + v);
      const eq = nb(`${co(p, X2)} ${MINUS} ${co(q, Y2)} ${MINUS} ${2 * p}${vk}${X} = 0`);
      return N(`쌍곡선 ${eq} 위의 점 P에서 두 초점에 이르는 거리의 차가 ${dd}일 때, 양수 ${vk}의 값은?`, dd / 2, {
        explain: `완전제곱식으로 고치면 ${co(p, '(' + X + ' ' + MINUS + ' ' + vk + ')' + sup(2))} ${MINUS} ${co(q, Y2)} = ${co(p, vk + sup(2))}이다. 양변을 ${co(p, vk + sup(2))}으로 나누면 x에 대한 부분이 ${frac('(' + X + ' ' + MINUS + ' ' + vk + ')' + sup(2), vk + sup(2))}이 되므로 a = ${vk}, 주축의 길이는 2${vk}이다. 주축의 길이 2${vk}가 거리의 차 ${nj(dd, '과/와')} 같으므로 ${vk} = ${dd / 2}이다.`,
        facts: { value: `${dd}/2`, derived: [2] }
      });
    }, { count: 2 }),
    // ①5 두 초점과 거리의 차로 정한 쌍곡선에 대한 설명(중심·꼭짓점·주축·점근선·초점 사이 거리)의 참·거짓
    T('eq-claims', '두 초점과 거리의 차로 정한 쌍곡선의 설명 고르기', '①5', (d) => {
      const c = d.int(3, 8), a = d.int(1, c - 1), b2 = c * c - a * a, sl = surd(b2, a * a), wr = surd(a * a, b2);
      if (surdKey(sl) === surdKey(wr)) return null;
      const kinds = d.shuffle(['center', 'vertex', 'axis', 'asym', 'focal']).slice(0, 3);
      const rows = kinds.map((kind) => {
        const t = d.bool();
        if (kind === 'center') return [t ? '중심의 좌표는 (0, 0)이다.' : `중심의 좌표는 (${c}, 0)이다.`, t];
        if (kind === 'vertex') return [t ? `꼭짓점의 좌표는 (${a}, 0), (${num(-a)}, 0)이다.` : `꼭짓점의 좌표는 (${c}, 0), (${num(-c)}, 0)이다.`, t];
        if (kind === 'axis') return [`주축의 길이는 ${t ? 2 * a : 2 * c}이다.`, t];
        if (kind === 'asym') return [`점근선의 방정식은 ${pmLine(t ? sl : wr)}이다.`, t];
        return [`두 초점 사이의 거리는 ${t ? 2 * c : a}이다.`, t];
      });
      return pickSets(d, `두 점 (${c}, 0), (${num(-c)}, 0)에 이르는 거리의 차가 ${2 * a}인 쌍곡선에 대하여 보기에서 옳은 것만을 있는 대로 고른 것은?`, rows, {
        explain: `중심은 두 초점의 중점 (0, 0)이고, a = ${a}, c = ${c}이므로 b² = ${c * c} ${MINUS} ${a * a} = ${b2}이다. 꼭짓점은 (±${a}, 0), 주축의 길이는 ${2 * a}, 점근선은 ${pmLine(sl)}, 두 초점 사이의 거리는 ${2 * c}이다.`
      });
    }),
    // ①6 교과서 공학 도구(46쪽): 꼭짓점을 그대로 두고 초점을 움직일 때의 모양(원문 해설의 방향을 바로잡았다)
    T('eq-move', '꼭짓점을 그대로 두고 초점을 움직일 때 쌍곡선의 모양', '①6', (d, n) => {
      const a = d.pick([1, 2, 3]), A = a * a;
      const eq = nb(over(X2, A) + ' ' + MINUS + ' ' + frac(Y2, nb(vc + sup(2) + ' ' + MINUS + ' ' + A)) + ' = 1');
      const up = '두 꼭짓점은 그대로이고, 점근선의 기울기의 절댓값이 커져 곡선이 x축에서 점점 멀어진다.';
      const down = '두 꼭짓점은 그대로이고, 점근선의 기울기의 절댓값이 작아져 곡선이 x축에 점점 가까워진다.';
      const head = `쌍곡선 ${eq} ${nb(`(${vc} &gt; ${a})`)}의 두 초점은 (${vc}, 0), (${MINUS}${vc}, 0)이다. `;
      const explain = `b² = c² ${MINUS} ${A}이므로 c가 커지면 b가 커지고 c가 작아지면 b가 작아진다. 점근선 ${nb(Y + ' = ±' + (a === 1 ? vb : frac(vb, a)) + X)}의 기울기의 절댓값도 그렇게 바뀌며, 꼭짓점 (±${a}, 0)과 주축의 길이 ${nj(2 * a, '은/는')} 바뀌지 않는다.`;
      if (n === 0) return pickOne(d, head + `${vc}의 값을 점점 크게 하여 두 초점이 서로 멀어질 때, 쌍곡선의 모양에 대한 설명으로 옳은 것은?`, up,
        [down, '두 꼭짓점이 두 초점을 따라 원점에서 멀어진다.', '주축의 길이가 점점 길어진다.', '쌍곡선의 모양은 바뀌지 않는다.'], { explain });
      return pickOne(d, head + `${vc}의 값을 점점 작게 하여 두 초점이 두 꼭짓점에 가까워질 때, 쌍곡선의 모양에 대한 설명으로 옳은 것은?`, down,
        [up, '두 꼭짓점이 원점에 가까워진다.', '주축의 길이가 점점 짧아진다.', '쌍곡선의 모양은 바뀌지 않는다.'], { explain });
    }, { count: 2 }),
    // ①7 두 초점(0, ±c)과 거리의 차(#0) 또는 꼭짓점(#1 — 그림)으로 방정식
    T('eq-y', '두 초점과 거리의 차로 쌍곡선의 방정식(초점이 y축 위)', '①7', (d, n) => {
      const c2 = d.int(5, n === 0 ? 40 : 30), b = d.int(2, 5), Bd = b * b, A = c2 - Bd;
      if (A < 2) return null;
      const cH = rad(c2), c = Math.sqrt(c2), explainTail = `a² = c² ${MINUS} b² = ${c2} ${MINUS} ${Bd} = ${A}이다. 따라서 구하는 방정식은 ${hypH(A, Bd, -1)}이다.`;
      if (n === 0) {
        return eqAns(`두 초점 F(0, ${cH}), F′(0, ${nrad(c2)})에 이르는 거리의 차가 ${2 * b}인 쌍곡선의 방정식을 구하시오.`, A, Bd, -1, {
          explain: `두 초점이 y축 위에 있으므로 ${symH(-1)} 꼴이다. 거리의 차가 ${2 * b}이므로 2b = ${2 * b}, b² = ${Bd}이고, ${explainTail}`,
          facts: { calc: [[`${sqE(c2)}-${2 * b}*${2 * b}/4`, 0], [`${2 * b}*${2 * b}/4`, 1], ['0-1', 2]], derived: [4] }
        });
      }
      const a = Math.sqrt(A), xm = Math.max(3, Math.ceil(a * 1.9));
      const figure = hypPlot(A, Bd, -1, { x: [-xm, xm], y: [-(c + 1.6), c + 1.6], yt: [{ v: b, t: String(b) }, { v: c, t: radP(c2) }],
        dots: [{ x: 0, y: c, name: 'F', side: 'ur', said: '초점' }, { x: 0, y: -c, name: 'F′', side: 'dr', said: '초점' }, { x: 0, y: b, said: '꼭짓점' }, { x: 0, y: -b, said: '꼭짓점' }] });
      return eqAns(`그림과 같이 두 초점의 좌표가 (0, ${cH}), (0, ${nrad(c2)})이고 두 꼭짓점의 좌표가 (0, ${b}), (0, ${num(-b)})인 쌍곡선의 방정식을 구하시오.`, A, Bd, -1, {
        figure,
        explain: `두 초점이 y축 위에 있으므로 ${symH(-1)} 꼴이다. 꼭짓점이 (0, ±${b})이므로 b² = ${Bd}이고, ${explainTail}`,
        facts: { calc: [[`${sqE(c2)}-${b}*${b}`, 0], [`${b}*${b}`, 1], ['0-1', 2]] }
      });
    }, { count: 2 }),
    // ①8 방정식에서 초점·꼭짓점·주축(초점이 y축 위): #0 표준형, #1 일반형
    T('eq-elem-y', '방정식에서 초점·꼭짓점·주축(초점이 y축 위)', '①8', (d, n) => {
      if (n === 0) {
        const [a, b, c] = d.pick(TRI), A = a * a, Bd = b * b;
        return M(`쌍곡선 ${hypH(A, Bd, -1)}의 두 초점의 좌표를 (0, ${vc}), (0, ${MINUS}${vc}), 두 꼭짓점의 좌표를 (0, ${vk}), (0, ${MINUS}${vk})라 할 때, ${vc}, ${vk}의 값과 주축의 길이를 차례로 구하시오. ${nb(`(단, ${vc} &gt; 0, ${vk} &gt; 0)`)}`,
          [{ answer: c, lead: vc + ' =' }, { answer: b, lead: vk + ' =' }, { answer: 2 * b, lead: '주축의 길이:' }], {
            shown: `${vc} = ${c}, ${vk} = ${b}, 주축의 길이 ${2 * b}`,
            explain: `우변이 ${MINUS}1이므로 초점과 꼭짓점은 y축 위에 있다. a² = ${A}, b² = ${Bd}이므로 c = ${rt(A + ' + ' + Bd)} = ${c}이고, 꼭짓점은 (0, ±${b}), 주축의 길이는 2b = ${2 * b}이다.`,
            facts: { calc: [[`(${A}+${Bd})**0.5`, 0], [`${Bd}**0.5`, 1], [`2*${Bd}**0.5`, 2]], derived: [0.5, 2] }
          });
      }
      const b = d.int(1, 4), Bd = b * b, A = d.int(2, 15), c2 = A + Bd;
      if (!sqFree(c2) || A === Bd) return null;
      const R = lcm(A, Bd), P = R / A, Qc = R / Bd;
      return inline(`쌍곡선 ${genH(P, Qc, -R)}의 두 초점의 좌표를 (0, ${vc}), (0, ${MINUS}${vc})라 할 때, ${vc}의 값과 주축의 길이를 구하시오. ${nb(`(단, ${vc} &gt; 0)`)}`,
        grp(`${vc} = ${rt('{0}')}`) + ', ' + grp('주축의 길이: {1}'), [{ answer: c2 }, { answer: 2 * b }], {
          shown: `${vc} = ${rt(c2)}, 주축의 길이 ${2 * b}`,
          explain: `양변을 ${josa(R, '으로/로')} 나누면 ${hypH(A, Bd, -1)}이다. c² = ${A} + ${Bd} = ${c2}이므로 c = ${rt(c2)}이고, 우변이 ${MINUS}1이라 주축은 y축 위에 있으며 그 길이는 2b = ${2 * b}이다.`,
          facts: { calc: [[`${R}/${P}+${R}/${Qc}`, 0], [`2*(${R}/${Qc})**0.5`, 1]], derived: [2, 0.5] }
        });
    }, { count: 2 }),
    // ①9 교과서 실생활(47쪽): 도달 시간의 차 → 거리의 차 → 초점이 y축 위에 있는 쌍곡선
    T('eq-station', '도달 시간의 차로 배의 위치를 나타내는 쌍곡선', '①9', (d) => {
      const c = d.pick([50, 60, 80, 100]), v = d.pick([20, 25, 40, 50]), t = d.int(1, 3), diff = v * t, b = diff / 2;
      if (!Number.isInteger(b) || b >= c || b < 10) return null;
      const A = c * c - b * b, Bd = b * b;
      return eqAns(`해안의 두 기지국 A, B 사이의 직선거리는 ${2 * c} km이다. 바다 위의 배에서 두 기지국에 동시에 보낸 전파가 두 기지국에 도달하는 데 걸린 시간의 차가 늘 ${t}초였다. 전파의 속도가 초속 ${v} km이고, 좌표평면에서 두 기지국의 위치를 A(0, ${c}), B(0, ${num(-c)})로 놓을 때, 배의 위치를 나타내는 쌍곡선의 방정식을 구하시오.`, A, Bd, -1, {
        explain: `배에서 두 기지국까지 거리의 차는 ${v} × ${t} = ${diff} (km)이다. 두 초점이 (0, ±${c})이고 거리의 차가 2b = ${diff}이므로 b² = ${Bd}, a² = ${c * c} ${MINUS} ${Bd} = ${A}이다. 따라서 ${hypH(A, Bd, -1)}이다.`,
        facts: { calc: [[`${c}*${c}-(${v}*${t}/2)**2`, 0], [`(${v}*${t}/2)**2`, 1], ['0-1', 2]], derived: [2] }
      });
    })
  ]);

  // ── 쌍곡선의 점근선 ──
  B.addTypes(UNIT, 'asym', [
    // ①11 방정식에서 점근선: #0 표준형(기울기 m 을 분수 칸으로 — 우변이 1이든 −1이든 같다), #1 일반형(고르기)
    T('asym-of', '방정식에서 점근선 구하기', '①11', (d, n) => {
      if (n === 0) {
        const s = d.pick([1, -1]), a = d.int(2, 7), b = d.int(1, 9);
        if (b % a === 0) return null;
        return qAns(`쌍곡선 ${hypH(a * a, b * b, s)}의 점근선의 방정식이 ${nb(Y + ' = ' + vm + X)}, ${nb(Y + ' = ' + MINUS + vm + X)}일 때, 양수 ${vm}의 값은?`, [b, a], {
          explain: `쌍곡선 ${symH(s)}의 점근선은 우변이 1이든 ${MINUS}1이든 ${nb(Y + ' = ±' + frac(vb, va) + X)}이다. a = ${a}, b = ${b}이므로 ${vm} = ${frac(b / gcd(a, b), a / gcd(a, b))}이다.`,
          facts: { value: `(${b * b})**0.5/(${a * a})**0.5`, derived: [0.5] }
        });
      }
      const P = d.int(1, 9), Qc = d.int(1, 9), s = d.pick([1, -1]);
      if (P === Qc || isSq(P * Qc)) return null;
      const R = lcm(P, Qc) * d.pick([1, 2, 3]);
      if (R > 60) return null;
      const right = surd(P, Qc), cands = [surd(Qc, P), surd(P * P, Qc * Qc), surd(Qc * Qc, P * P), surd(4 * P, Qc)];
      const keys = new Set([surdKey(right)]), wrongs = [];
      for (const u of cands) if (!keys.has(surdKey(u))) { keys.add(surdKey(u)); wrongs.push(pmLine(u)); }
      if (wrongs.length < 4) return null;
      return pickOne(d, `쌍곡선 ${genH(P, Qc, s * R)}의 점근선의 방정식으로 옳은 것은?`, pmLine(right), wrongs, {
        explain: `양변을 ${josa(R, '으로/로')} 나누면 ${hypH(R / P, R / Qc, s)}이다. a² = ${R / P}, b² = ${R / Qc}이므로 점근선은 ${nb(Y + ' = ±' + frac(vb, va) + X)}, 곧 ${pmLine(right)}이다.`
      });
    }, { count: 2 }),
    // ①13 점근선과 초점·꼭짓점 사이를 오가기: #0 점근선 + 초점 → 방정식, #1 점근선 + 꼭짓점 → 초점, #2 두 초점 사이의 거리 + 한 점근선 → 방정식(중심부터), #3 거꾸로 초점·거리의 차 → 점근선
    T('asym-find', '점근선과 초점·꼭짓점으로 쌍곡선 구하기', '①13', (d, n) => {
      if (n === 0) {
        const a0 = d.int(1, 4), b0 = d.int(1, 4), g = d.int(1, 3);
        if (gcd(a0, b0) !== 1 || a0 === b0) return null;
        const a = a0 * g, b = b0 * g, A = a * a, Bd = b * b, c2 = A + Bd;
        if (A < 2 || c2 > 80) return null;
        const k = Q(b0, a0), kH = k.q === 1 ? String(k.p) : frac(k.p, k.q), cH = rad(c2);
        return eqAns(`두 직선 ${nb(Y + ' = ' + kH + X)}, ${nb(Y + ' = ' + MINUS + kH + X)}를 점근선으로 하고 두 점 (${cH}, 0), (${nrad(c2)}, 0)을 초점으로 하는 쌍곡선의 방정식을 구하시오.`, A, Bd, 1, {
          explain: `초점이 x축 위에 있으므로 ${symH(1)} 꼴이고, 점근선의 기울기에서 b/a = ${kH}, 곧 b = ${kH}a이다. a² + b² = ${c2}에 넣으면 a² = ${A}, b² = ${Bd}이다.`,
          facts: { calc: [[`${sqE(c2)}*${a0}*${a0}/(${a0}*${a0}+${b0}*${b0})`, 0], [`${sqE(c2)}*${b0}*${b0}/(${a0}*${a0}+${b0}*${b0})`, 1], ['1', 2]] }
        });
      }
      if (n === 1) {
        const k = d.int(1, 3), m = d.pick([2, 3, 5, 6, 7]), r = m * (1 + k * k);
        if (!sqFree(r)) return null;
        const line = (s) => nb(Y + ' = ' + (s < 0 ? MINUS : '') + (k === 1 ? '' : k) + X);
        return radPos(`두 직선 ${line(1)}, ${line(-1)}를 점근선으로 하고 한 꼭짓점의 좌표가 (${rt(m)}, 0)인 쌍곡선의 두 초점의 좌표를 (${vc}, 0), (${MINUS}${vc}, 0)이라 할 때, 양수 ${vc}의 값은?`, 1, r, {
          explain: `a = ${rt(m)}이고 b/a = ${k}이므로 b² = ${k * k} × ${m} = ${k * k * m}이다. c² = a² + b² = ${m} + ${k * k * m} = ${r}이므로 c = ${rt(r)}이다.`,
          facts: { value: `${m}*(1+${k}*${k})` }
        });
      }
      if (n === 2) {
        const a0 = d.int(1, 5), b0 = d.int(1, 5), g = d.int(1, 2);
        if (gcd(a0, b0) !== 1 || a0 === b0) return null;
        const a = a0 * g, b = b0 * g, A = a * a, Bd = b * b, c2 = A + Bd, d2 = 4 * c2, [s, r] = sqParts(d2);
        if (A < 2) return null;
        const k = Q(b0, a0), kH = k.q === 1 ? String(k.p) : frac(k.p, k.q), dE = r === 1 ? `${s}*${s}` : `${s}*${s}*${r}`;
        return eqAns(`두 초점이 x축 위에 있고 두 초점 사이의 거리가 ${rad(d2)}인 쌍곡선의 한 점근선의 방정식이 ${nb(Y + ' = ' + kH + X)}일 때, 이 쌍곡선의 방정식을 구하시오.`, A, Bd, 1, {
          explain: `초점이 x축 위에 있으므로 중심도 x축 위에 있고, 중심은 두 점근선의 교점이다. 점근선 ${nb(Y + ' = ' + kH + X)}가 x축과 만나는 점은 원점이므로 중심은 원점이고, ${symH(1)} 꼴이다. b/a = ${kH}, 2c = ${rad(d2)}에서 a² + b² = ${c2}이므로 a² = ${A}, b² = ${Bd}이다.`,
          facts: { calc: [[`${dE}/4*${a0}*${a0}/(${a0}*${a0}+${b0}*${b0})`, 0], [`${dE}/4*${b0}*${b0}/(${a0}*${a0}+${b0}*${b0})`, 1], ['1', 2]], derived: [4] }
        });
      }
      const c = d.int(3, 8), a = d.int(1, c - 1), b2 = c * c - a * a;
      if (isSq(b2)) return null;
      const right = surd(b2, a * a), cands = [surd(a * a, b2), surd(c * c + a * a, a * a), surd(b2, c * c), surd(b2 * b2, a ** 4)];
      const keys = new Set([surdKey(right)]), wrongs = [];
      for (const u of cands) if (!keys.has(surdKey(u))) { keys.add(surdKey(u)); wrongs.push(pmLine(u)); }
      if (wrongs.length < 4) return null;
      return pickOne(d, `두 점 F(${c}, 0), G(${num(-c)}, 0)에 대하여 |${bar('PF')} ${MINUS} ${bar('PG')}| = ${nj(2 * a, '을/를')} 만족시키는 점 P가 쌍곡선 ${symH(1)} 위에 있다. 이 쌍곡선의 점근선의 방정식은? ${nb(`(단, ${va} &gt; 0, ${vb} &gt; 0)`)}`, pmLine(right), wrongs, {
        explain: `2a = ${2 * a}에서 a = ${a}이고, 두 점 F, G가 초점이므로 b² = ${c * c} ${MINUS} ${a * a} = ${b2}이다. 점근선 ${nb(Y + ' = ±' + frac(vb, va) + X)}는 ${pmLine(right)}이다.`
      });
    }, { count: 4 }),
    // ①14 두 점근선이 서로 수직이면 a = b: 주축의 길이 = c√2
    T('asym-perp', '두 점근선이 서로 수직인 쌍곡선의 주축', '①14', (d) => {
      const c = d.int(2, 9), onX = d.bool();
      const F1 = onX ? pt(c, 0) : pt(0, c), F2 = onX ? pt(-c, 0) : pt(0, -c);
      return radPos(`두 초점의 좌표가 ${F1}, ${F2}이고 두 점근선이 서로 수직인 쌍곡선의 주축의 길이는?`, c, 2, {
        explain: `두 점근선의 기울기 b/a, ${MINUS}b/a의 곱이 ${MINUS}1이므로 a = b이다. a² + b² = ${c * c}에서 a² = ${tx(Q(c * c, 2))}, a = ${surdH(surd(c * c, 2))}이므로 주축의 길이는 ${radText(c, 2)}이다.`,
        facts: { calc: [[`${c}`, 0], ['2', 1]], derived: [2] }
      });
    }),
    // ①15 주축의 길이와 점근선으로 상수: #0 우변이 −1인 꼴(주축 = 2b), #1 점근선의 기울기가 근호
    T('asym-axis', '주축의 길이와 점근선으로 쌍곡선의 상수', '①15', (d, n) => {
      if (n === 0) {
        const b = d.int(2, 9), [p, q] = d.pick([[2, 1], [3, 1], [1, 2], [3, 2], [2, 3], [4, 3], [1, 3]]);
        if ((b * q) % p !== 0 || b * q / p === b) return null;
        const a = b * q / p, kH = q === 1 ? String(p) : frac(p, q);
        return vals(`쌍곡선 ${symH(-1)}의 주축의 길이가 ${2 * b}이고 두 점근선의 기울기가 각각 ${kH}, ${MINUS}${kH}일 때, 양수 ${va}, ${vb}의 값을 구하시오.`, [[va, a], [vb, b]], {
          explain: `우변이 ${MINUS}1이므로 주축은 y축 위에 있고 그 길이는 2b이다. 2b = ${2 * b}에서 b = ${b}이고, 점근선의 기울기 b/a = ${kH}에서 a = ${a}이다.`,
          facts: { calc: [[`${2 * b}/2*${q}/${p}`, 0], [`${2 * b}/2`, 1]], derived: [2] }
        });
      }
      const m = d.pick([2, 3, 5, 6, 7]), a = d.int(2, 5), B0 = m * a * a;
      return N(`쌍곡선 ${nb(frac(X2, va + sup(2)) + ' ' + MINUS + ' ' + frac(Y2, B0) + ' = 1')}의 한 점근선의 방정식이 ${nb(Y + ' = ' + rt(m) + X)}일 때, 이 쌍곡선의 주축의 길이는? ${nb(`(단, ${va} &gt; 0)`)}`, 2 * a, {
        explain: `점근선 ${nb(Y + ' = ' + frac(rt(B0), va) + X)}에서 ${frac(rt(B0), va)} = ${rt(m)}이므로 a² = ${B0} ÷ ${m} = ${a * a}, a = ${a}이다. 주축의 길이는 ${2 * a}이다.`,
        facts: { value: `2*(${B0}/${m})**0.5`, derived: [2, 0.5] }
      });
    }, { count: 2 }),
    // ①16 타원과 두 초점을 공유하는 쌍곡선: #0 점근선의 기울기, #1 점근선이 x축의 양의 방향과 이루는 각
    T('asym-ellipse', '타원과 초점이 같고 점근선이 주어진 쌍곡선의 주축', '①16', (d, n) => {
      const a2 = d.pick([2, 3, 5, 6, 7]);
      const [k2, slopeH, angle] = n === 0 ? d.pick([[1, '', null], [2, rt(2), null], [3, rt(3), null], [4, '2', null]]) : d.pick([[1, null, 45], [3, null, 60]]);
      const c2 = a2 * (1 + k2), E2 = d.int(2, 12), E1 = E2 + c2;
      const ell = ellH(E1, E2), kE = n === 0 ? (k2 === 4 ? '2*2' : String(k2)) : String(k2);
      const head = `두 초점이 타원 ${ell}의 두 초점과 일치하고, `;
      const tail = n === 0 ? `한 점근선의 방정식이 ${nb(Y + ' = ' + slopeH + X)}인 쌍곡선의 주축의 길이는?` : `점근선 가운데 하나가 x축의 양의 방향과 이루는 각의 크기가 ${angle}°인 쌍곡선의 주축의 길이는?`;
      return radPos(head + tail, 2, a2, {
        explain: `타원의 두 초점은 (±${rt(c2)}, 0)이므로 쌍곡선 ${symH(1)}에서 a² + b² = ${c2}이다. ` + (n === 0 ? '' : `점근선의 기울기는 tan ${angle}° = ${angle === 45 ? '1' : rt(3)}이므로 `) + `b² = ${k2 === 1 ? '' : k2}a²이고, a²(1 + ${k2}) = ${c2}에서 a² = ${a2}이다. 주축의 길이는 2a = ${radText(2, a2)}이다.`,
        facts: { calc: [['2', 0], [`(${E1}-${E2})/(1+${kE})`, 1]], derived: [2, k2] }
      });
    }, { count: 2 }),
    // ①17 초점과 점근선 사이의 거리(= b): #0 초점을 중심으로 두 점근선에 접하는 원, #1 초점과 점근선 사이의 거리, #2 원의 넓이
    T('asym-dist', '초점과 점근선 사이의 거리', '①17', (d, n) => {
      if (n === 0) {
        const c = d.int(3, 9), r = d.int(1, c - 1), A = c * c - r * r;
        return vals(`쌍곡선 ${symH(1)}의 한 초점 F(${c}, 0)을 중심으로 하고 반지름의 길이가 ${r}인 원이 쌍곡선의 두 점근선에 동시에 접할 때, ${va}${sup(2)}, ${vb}${sup(2)}의 값을 구하시오. ${nb(`(단, ${va} &gt; 0, ${vb} &gt; 0)`)}`, [[va + sup(2), A], [vb + sup(2), r * r]], {
          explain: `점근선 bx ${MINUS} ay = 0과 F(${c}, 0) 사이의 거리는 ${frac(`|${c}${vb}|`, rt(va + sup(2) + ' + ' + vb + sup(2)))} = ${frac(c + vb, c)} = ${vb}이므로 b = ${r}이다. a² = ${c * c} ${MINUS} ${r * r} = ${A}이다.`,
          facts: { calc: [[`${c}*${c}-${r}*${r}`, 0], [`${r}*${r}`, 1]] }
        });
      }
      if (n === 1) {
        const c = d.int(3, 9), a = d.int(1, c - 1), b2 = c * c - a * a;
        if (!sqFree(b2)) return null;
        return radPos(`한 초점이 F(${c}, 0)이고 주축의 길이가 ${2 * a}인 쌍곡선 ${symH(1)}의 점근선 가운데 기울기가 양수인 것을 l이라 하자. 점 F와 직선 l 사이의 거리는? ${nb(`(단, ${va} &gt; 0, ${vb} &gt; 0)`)}`, 1, b2, {
          explain: `a = ${a}, b² = ${c * c} ${MINUS} ${a * a} = ${b2}이다. 직선 l: ${rt(b2)}x ${MINUS} ${a}y = 0과 F(${c}, 0) 사이의 거리는 ${frac(`${c}${rt(b2)}`, rt(b2 + ' + ' + a * a))} = ${frac(`${c}${rt(b2)}`, c)} = ${rt(b2)}이다.`,
          facts: { value: `${c}*${c}-${2 * a}*${2 * a}/4`, derived: [4] }
        });
      }
      const A = d.int(2, 30), Bd = d.int(2, 30);
      if (A === Bd) return null;
      return N(`쌍곡선 ${hypH(A, Bd, 1)}의 한 초점을 중심으로 하고 이 쌍곡선의 점근선에 접하는 원의 넓이가 ${vk}π일 때, 상수 ${vk}의 값은?`, Bd, {
        explain: `초점 (c, 0)과 점근선 bx ${MINUS} ay = 0 사이의 거리는 ${frac(vb + vc, rt(va + sup(2) + ' + ' + vb + sup(2)))} = ${vb}이므로 원의 반지름의 길이는 b이다. 넓이는 πb² = ${Bd}π이므로 ${vk} = ${Bd}이다.`,
        facts: { value: `${Bd}*(${A}+${Bd})/(${A}+${Bd})` }
      });
    }, { count: 3 })
  ]);

  // ── 쌍곡선의 평행이동 ──
  // 점근선의 짝 y = kx + t₁, y = −kx + t₂ 의 글(k 는 유리수 Q)
  const pairH = (k, t1, t2) => lineH(k, t1) + ', ' + lineH(qmul(k, Q(-1)), t2);
  // 중심 (p, q), 기울기 ±k 인 두 점근선과 흔한 잘못(평행이동의 부호, 기울기의 역수, 옮기지 않음, y 쪽만 옮김)의 짝
  function asymPairs(k, p, q) {
    const P = Q(p), Qy = Q(q), ki = qdiv(Q(1), k);
    const right = pairH(k, qsub(Qy, qmul(k, P)), qadd(Qy, qmul(k, P)));
    const wrongs = [
      pairH(k, qadd(qmul(Qy, Q(-1)), qmul(k, P)), qsub(qmul(Qy, Q(-1)), qmul(k, P))),
      pairH(ki, qsub(Qy, qmul(ki, P)), qadd(Qy, qmul(ki, P))),
      pairH(k, Q(0), Q(0)),
      pairH(k, Qy, Qy)
    ];
    return { right, wrongs };
  }
  B.addTypes(UNIT, 'shift', [
    // ①19 평행이동한 쌍곡선: #0 방정식, #1 두 초점, #2 점근선(고르기)
    T('shift-move', '평행이동한 쌍곡선의 방정식·초점·점근선', '①19', (d, n) => {
      const m = d.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), k = d.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
      const move = `x축의 방향으로 ${num(m)}만큼, y축의 방향으로 ${num(k)}만큼 평행이동한`;
      if (n === 0) {
        const A = d.int(2, 20), Bd = d.int(2, 20), s = d.pick([1, -1]);
        if (A === Bd) return null;
        return shEqAns(`쌍곡선 ${jh(hypH(A, Bd, s), '을/를')} ${move} 쌍곡선의 방정식을 구하시오.`, m, k, A, Bd, s, {
          explain: `x 대신 ${nb(bx(X, m))}, y 대신 ${jh(nb(bx(Y, k)), '을/를')} 넣으면 ${shH(m, k, A, Bd, s)}이다.`,
          facts: { calc: [[`0-${jn(m)}`, 0], [`${A}`, 1], [`0-${jn(k)}`, 2], [`${Bd}`, 3], [s === 1 ? '1' : '0-1', 4]] }
        });
      }
      if (n === 1) {
        const [a, b, c] = d.pick(TRI), s = d.pick([1, -1]), A = a * a, Bd = b * b;
        const F1 = s === 1 ? [c + m, k] : [m, c + k], F2 = s === 1 ? [-c + m, k] : [m, -c + k];
        const cE = `(${A}+${Bd})**0.5`;
        return pts2(`쌍곡선 ${jh(hypH(A, Bd, s), '을/를')} ${move} 쌍곡선의 두 초점의 좌표를 구하시오.`, F1, F2, {
          explain: `처음 쌍곡선의 두 초점은 ${s === 1 ? `(±${c}, 0)` : `(0, ±${c})`}이다(c² = ${A} + ${Bd}). 이 두 점을 같은 만큼 옮기면 ${pt(F1[0], F1[1])}, ${pt(F2[0], F2[1])}이다.`,
          facts: s === 1 ? { calc: [[`${cE}+${jn(m)}`, 0], [`${jn(k)}`, 1], [`0-${cE}+${jn(m)}`, 2], [`${jn(k)}`, 3]], derived: [0.5] }
            : { calc: [[`${jn(m)}`, 0], [`${cE}+${jn(k)}`, 1], [`${jn(m)}`, 2], [`0-${cE}+${jn(k)}`, 3]], derived: [0.5] }
        });
      }
      const a = d.int(1, 5), b = d.int(1, 5);
      if (a === b) return null;
      const kq = Q(b, a), { right, wrongs } = asymPairs(kq, m, k);
      return pickOne(d, `쌍곡선 ${jh(hypH(a * a, b * b, 1), '을/를')} ${move} 쌍곡선의 점근선의 방정식은?`, right, wrongs, {
        explain: `처음 쌍곡선의 점근선 ${nb(Y + ' = ±' + (kq.q === 1 ? (kq.p === 1 ? '' : kq.p) : frac(kq.p, kq.q)) + X)}도 같이 옮겨지므로 ${nb(bx(Y, k) + ' = ±' + (kq.q === 1 ? (kq.p === 1 ? '' : kq.p) : frac(kq.p, kq.q)) + bx(X, m))}이다. 정리하면 ${right}이다.`
      });
    }, { count: 3 }),
    // ①20 평행이동한 꼴의 방정식에서 두 초점: #0 우변 1, #1 우변 −1
    T('shift-foci', '평행이동한 쌍곡선의 방정식에서 두 초점', '①20', (d, n) => {
      const c = d.int(2, 7), A = d.int(1, c * c - 1), Bd = c * c - A, p = d.int(-5, 5), q = d.int(-5, 5);
      if (p === 0 || q === 0 || A === Bd) return null;
      const s = n === 0 ? 1 : -1, F1 = s === 1 ? [p + c, q] : [p, q + c], F2 = s === 1 ? [p - c, q] : [p, q - c], cE = `(${A}+${Bd})**0.5`;
      return pts2(`쌍곡선 ${shH(p, q, A, Bd, s)}의 두 초점의 좌표를 구하시오.`, F1, F2, {
        explain: `이 쌍곡선은 ${hypH(A, Bd, s)}을 x축의 방향으로 ${num(p)}만큼, y축의 방향으로 ${num(q)}만큼 평행이동한 것이다. 처음 쌍곡선의 두 초점은 ${s === 1 ? `(±${c}, 0)` : `(0, ±${c})`}(c² = ${A} + ${Bd} = ${c * c})이므로 구하는 두 초점은 ${pt(F1[0], F1[1])}, ${pt(F2[0], F2[1])}이다.`,
        facts: s === 1 ? { calc: [[`${jn(p)}+${cE}`, 0], [`${jn(q)}`, 1], [`${jn(p)}-${cE}`, 2], [`${jn(q)}`, 3]], derived: [0.5] }
          : { calc: [[`${jn(p)}`, 0], [`${jn(q)}+${cE}`, 1], [`${jn(p)}`, 2], [`${jn(q)}-${cE}`, 3]], derived: [0.5] }
      });
    }, { count: 2 }),
    // ①21 전개된 이차방정식을 고쳐: #0 점근선(고르기), #1 우변이 −1로 나오는 꼴의 두 초점 사이의 거리(무리수), #2 두 초점 사이의 거리(정수)
    T('shift-general', '전개된 방정식을 고쳐 점근선·두 초점 사이의 거리', '①21', (d, n) => {
      const p = d.pick([-4, -3, -2, -1, 1, 2, 3, 4]), q = n === 2 ? d.int(-3, 3) : d.pick([-3, -2, -1, 1, 2, 3]);
      let A, Bd, s;
      if (n === 0) { const a = d.int(1, 4), b = d.int(1, 4); if (a === b) return null; A = a * a; Bd = b * b; s = 1; }
      else if (n === 1) { A = d.int(2, 9); Bd = d.int(2, 9); s = -1; if (A === Bd || !sqFree(A + Bd)) return null; }
      else { const c = d.int(2, 6); A = d.int(2, c * c - 2); Bd = c * c - A; s = 1; if (A === Bd) return null; }
      const R = lcm(A, Bd), P = R / A, Qc = R / Bd, D = -2 * P * p, E = 2 * Qc * q, F0 = P * p * p - Qc * q * q - s * R;
      if (P > 16 || Qc > 16 || Math.abs(D) > 99 || Math.abs(F0) > 199) return null;
      const terms = d.bool() ? [[P, X2], [-Qc, Y2], [D, X], [E, Y], [F0, '']] : [[P, X2], [D, X], [-Qc, Y2], [E, Y], [F0, '']];
      const eq = nb(poly(terms) + ' = 0');
      const pE = `(0-${jn(D)})/(2*${P})`, qE = `${jn(E)}/(2*${Qc})`, sR = `(${P}*(${pE})**2-${Qc}*(${qE})**2-${jn(F0)})`;
      const std = `완전제곱식으로 고치면 ${P === 1 ? '' : P}${bx(X, p)}${sup(2)} ${MINUS} ${Qc === 1 ? '' : Qc}${q === 0 ? Y2 : bx(Y, q) + sup(2)} = ${num(s * R)}이고, 양변을 ${josa(R, '으로/로')} 나누면 ${shH(p, q, A, Bd, s)}이다.`;
      if (n === 0) {
        const kq = Q(Math.sqrt(Bd), Math.sqrt(A)), { right, wrongs } = asymPairs(kq, p, q);
        return pickOne(d, '다음 쌍곡선의 점근선의 방정식은?', right, wrongs, {
          figure: hx(eq),
          explain: `${std} 중심이 (${num(p)}, ${num(q)})이고 점근선의 기울기가 ±${kq.q === 1 ? kq.p : frac(kq.p, kq.q)}이므로 점근선은 ${right}이다.`
        });
      }
      if (n === 1) {
        return radPos('다음 쌍곡선의 두 초점 사이의 거리는?', 2, A + Bd, {
          figure: hx(eq),
          explain: `${std} 우변이 ${MINUS}1이므로 두 초점은 중심을 지나고 y축에 평행한 직선 위에 있고, c² = ${A} + ${Bd} = ${A + Bd}이다. 두 초점 사이의 거리는 2c = ${radText(2, A + Bd)}이다.`,
          facts: { calc: [['2', 0], [`(0-${sR})*(${P}+${Qc})/(${P}*${Qc})`, 1]], derived: [2] }
        });
      }
      return N('다음 쌍곡선의 두 초점 사이의 거리는?', 2 * Math.sqrt(A + Bd), {
        figure: hx(eq),
        explain: `${std} c² = ${A} + ${Bd} = ${A + Bd}이므로 두 초점 사이의 거리는 2c = ${2 * Math.sqrt(A + Bd)}이다.`,
        facts: { value: `2*(${sR}*(${P}+${Qc})/(${P}*${Qc}))**0.5`, derived: [2, 0.5] }
      });
    }, { count: 3 }),
    // ①22 두 점근선의 교점(= 중심)으로 두 초점
    T('shift-center', '두 점근선의 교점으로 두 초점 구하기', '①22', (d) => {
      const c = d.int(3, 8), A = d.int(2, c * c - 2), Bd = c * c - A, p = d.pick([-4, -3, -2, -1, 1, 2, 3, 4]), q = d.int(-4, 4), s = d.pick([1, -1]);
      if (A === Bd) return null;
      const F1 = s === 1 ? [p + c, q] : [p, q + c], F2 = s === 1 ? [p - c, q] : [p, q - c], cE = `(${A}+${Bd})**0.5`;
      const eq = nb(frac('(' + X + ' ' + MINUS + ' ' + vm + ')' + sup(2), A) + ' ' + MINUS + ' ' + frac('(' + Y + ' ' + MINUS + ' ' + vn + ')' + sup(2), Bd) + ' = ' + num(s));
      return pts2(`쌍곡선 ${eq}의 두 점근선의 교점의 좌표가 (${num(p)}, ${num(q)})일 때, 이 쌍곡선의 두 초점의 좌표를 구하시오. (단, ${vm}, ${vn}은 상수이다.)`, F1, F2, {
        explain: `두 점근선은 쌍곡선의 중심에서 만나므로 중심은 (${num(p)}, ${num(q)}), 곧 ${vm} = ${num(p)}, ${vn} = ${num(q)}이다. c² = ${A} + ${Bd} = ${c * c}이고 우변이 ${num(s)}이므로 두 초점은 중심에서 ${s === 1 ? 'x축' : 'y축'} 방향으로 ${c}만큼 떨어진 ${pt(F1[0], F1[1])}, ${pt(F2[0], F2[1])}이다.`,
        facts: s === 1 ? { calc: [[`${jn(p)}+${cE}`, 0], [`${jn(q)}`, 1], [`${jn(p)}-${cE}`, 2], [`${jn(q)}`, 3]], derived: [0.5] }
          : { calc: [[`${jn(p)}`, 0], [`${jn(q)}+${cE}`, 1], [`${jn(p)}`, 2], [`${jn(q)}-${cE}`, 3]], derived: [0.5] }
      });
    }),
    // ①23 두 꼭짓점과 한 점근선으로 방정식(중심 → 주축 → 점근선의 기울기로 b)
    T('shift-vert', '두 꼭짓점과 한 점근선으로 쌍곡선의 방정식', '①23', (d) => {
      const [kp, kq] = d.pick([[1, 1], [2, 1], [1, 2], [3, 2], [2, 3], [3, 1]]), a = kq * d.int(1, 3), b = a * kp / kq, p = d.pick([-3, -2, -1, 1, 2, 3, 4]), q = d.pick([-3, -2, -1, 1, 2, 3]);
      if (a * a > 30) return null;
      const k = Q(kp, kq), t = qsub(Q(q), qmul(k, Q(p))), x1 = p - a, x2 = p + a;
      return shEqAns(`두 꼭짓점의 좌표가 (${num(x1)}, ${num(q)}), (${num(x2)}, ${num(q)})이고 한 점근선의 방정식이 ${lineH(k, t)}인 쌍곡선의 방정식을 구하시오.`, p, q, a * a, b * b, 1, {
        explain: `중심은 두 꼭짓점의 중점 (${num(p)}, ${num(q)})이고, 주축의 길이는 ${2 * a}이므로 a = ${a}이다. 점근선의 기울기 b/a = ${k.q === 1 ? k.p : frac(k.p, k.q)}에서 b = ${b}이다. 따라서 ${shH(p, q, a * a, b * b, 1)}이다.`,
        facts: { calc: [[`0-(${jn(x1)}+${jn(x2)})/2`, 0], [`((${jn(x2)}-${jn(x1)})/2)**2`, 1], [`0-${jn(q)}`, 2], [`((${jn(x2)}-${jn(x1)})/2*${kp}/${kq})**2`, 3], ['1', 4]], derived: [2] }
      });
    }),
    // ①24 한 초점과 중심(두 초점의 중점)으로 다른 초점
    T('shift-focus2', '한 초점으로 다른 초점 구하기', '①24', (d) => {
      const s = d.pick([1, -1]), p = d.int(-4, 4), q = d.int(-4, 4), c = d.int(2, 6), sign = d.pick([1, -1]);
      if (p === 0 && q === 0) return null;
      let eq, F, G, exp, facts;
      if (s === 1) {
        eq = nb(frac(bx(X, p) + sup(2), va + sup(2)) + ' ' + MINUS + ' ' + frac('(' + Y + ' ' + MINUS + ' ' + vn + ')' + sup(2), vb + sup(2)) + ' = 1');
        F = [p + sign * c, q]; G = [p - sign * c, q];
        exp = `주축이 x축에 평행하므로 두 초점의 y좌표는 같고, 중심의 x좌표 ${nj(p, '이/가')} 두 초점의 x좌표의 평균이다.`;
        facts = { calc: [[`2*${jn(p)}-${jn(F[0])}`, 0], [`${jn(F[1])}`, 1]], derived: [2] };
      } else {
        eq = nb(frac('(' + X + ' ' + MINUS + ' ' + vm + ')' + sup(2), va + sup(2)) + ' ' + MINUS + ' ' + frac(bx(Y, q) + sup(2), vb + sup(2)) + ' = ' + MINUS + '1');
        F = [p, q + sign * c]; G = [p, q - sign * c];
        exp = `우변이 ${MINUS}1이라 주축이 y축에 평행하므로 두 초점의 x좌표는 같고, 중심의 y좌표 ${nj(q, '이/가')} 두 초점의 y좌표의 평균이다.`;
        facts = { calc: [[`${jn(F[0])}`, 0], [`2*${jn(q)}-${jn(F[1])}`, 1]], derived: [2] };
      }
      if ((s === 1 && p === 0) || (s === -1 && q === 0)) return null;
      return coordAns(`쌍곡선 ${eq}의 한 초점의 좌표가 ${pt(F[0], F[1])}일 때, 다른 초점의 좌표를 구하시오. (단, ${va}, ${vb}, ${s === 1 ? vn : vm}은 상수이다.)`, G, {
        explain: `${exp} 따라서 다른 초점은 ${pt(G[0], G[1])}이다.`, facts
      });
    }),
    // ①25 두 초점을 지름의 양 끝점으로 하는 원(끝 단계는 고1 원의 방정식)
    T('shift-circle', '두 초점을 지름의 양 끝점으로 하는 원', '①25', (d) => {
      const c = d.int(2, 7), A = d.int(1, c * c - 1), Bd = c * c - A, p = d.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), q = d.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), s = d.pick([1, -1]);
      if (A === Bd) return null;
      return inline(`쌍곡선 ${shH(p, q, A, Bd, s)}의 두 초점을 지름의 양 끝점으로 하는 원의 방정식을 구하시오.`, grp('(' + X + ' {0})' + sup(2)) + ' + ' + grp('(' + Y + ' {1})' + sup(2)) + ' ' + grp('= {2}'),
        [{ answer: -p, signed: true }, { answer: -q, signed: true }, { answer: c * c }], {
          shown: nb(bx(X, p) + sup(2) + ' + ' + bx(Y, q) + sup(2) + ' = ' + c * c),
          explain: `원의 중심은 두 초점의 중점, 곧 쌍곡선의 중심 (${num(p)}, ${num(q)})이고, 반지름의 길이는 c이다. c² = ${A} + ${Bd} = ${c * c}이므로 원의 방정식은 ${nb(bx(X, p) + sup(2) + ' + ' + bx(Y, q) + sup(2) + ' = ' + c * c)}이다.`,
          facts: { calc: [[`0-${jn(p)}`, 0], [`0-${jn(q)}`, 1], [`${A}+${Bd}`, 2]] }
        });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
