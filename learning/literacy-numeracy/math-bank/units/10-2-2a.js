// 고등학교 1학년 2학기 2단원 원의 방정식(공통수학2) — 단원 틀·도구와 앞쪽 묶음
// (원의 방정식, x² + y² + Ax + By + C = 0이 나타내는 원, 조건을 만족시키는 원).
// 수집해 둔 천재 T셀파 공통수학2 두 종(전인태, 홍진곤 — 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1·2: 70꼴, 심화꼴: 4꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭) / 겹침」을 가른 대조표는 references/textbooks/수학/_분석/10-2-2/싣기_대조표.md 에 있다.
// (원과 직선의 위치 관계, 원의 접선의 방정식은 10-2-2b.js 에, 실력 문항은 10-2-2c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 영역은 기하(도형의 방정식). 성취기준은 10공수2-01-04(원의 방정식을 구하고, 그래프를 그릴 수 있다),
// 10공수2-01-05(좌표평면에서 원과 직선의 위치 관계를 판단하고, 이를 활용하여 문제를 해결할 수 있다)이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(중심·반지름, 한 점, 지름의 양 끝점, 일반형, 그림, 조건), 묻는 것(원의 방정식·중심·반지름·미지수·범위·고르기)이
//    다르면 따로 싣는다. 수만 다른 것은 한 번만 싣는다.
//  - 사용자가 정한 것(과제 글): 수학 실력에 필요해 보이는 꼴은 다 싣는다. 교육과정의 「계산이 지나치게 복잡한 문제는 다루지 않는다」나 꼬여 있다는 것을 까닭으로
//    빼지 않는다. 그런 꼴은 실력에 싣는다.
//  - 답: 원의 방정식은 「(x [±][ ])² + (y [±][ ])² = [ ]」, 중심이 원점이면 「x² + y² = [ ]」, 일반형은 「x² + y² [±][ ]x [±][ ]y = 0」.
//    중심과 반지름은 「중심의 좌표: ([±][ ], [±][ ]) 반지름의 길이: [ ]」(반지름이 √q, k√q 이면 근호 칸 — 한 유형 안에서는 칸의 모양이 늘 같다).
//    좌표·계수·미지수처럼 음수일 수 있는 수는 모두 부호 단추가 붙은 칸으로 받는다. 반지름·거리·넓이·개수만 단추 없이 받는다.
//    중심이나 반지름이 분수인 답은 고르기로 낸다. 원문의 「a + b + r의 값」「abc의 값」처럼 따로 구한 수를 더하거나 곱해 묻는 꼴은 수를 하나하나 답하게 바꾸었다.
//    범위는 「k [부등호] [±][ ]」(부등호를 고르는 칸)이나 「[±][ ] < k < [±][ ]」로 받는다.
//  - 그림: 원이 든 좌표평면은 이 파일의 cfig 로 그린다(모눈·눈금·원·반원·직선·점). 그림 설명(aria-label)은 원을 「중심은 원점에서 오른쪽으로 2칸 … 간 곳,
//    반지름은 3칸」으로 적는다(좌표를 숫자 짝으로 말하지 않는다).
//  - 답은 모두 코드가 셈한다. 꼴 목록에 적힌 원문 답은 따르지 않는다. 검사 식(facts.calc·value)의 수 가운데 글에 보이지 않는 수는
//    seal 이 facts.unseen 에 밝힌다(0, 1, 2, 4, 0.5 와 유형마다 밝힌 수 밖의 수가 나오면 오류를 낸다).
//  - 근호를 거쳐야 나오는 칸(반지름 k√q 의 k, q)은 엔진 검사가 셈할 수 없으므로, 제 작업 폴더의 따로 지은 풀이로 문제 글만 읽어 다시 풀어 맞춰 보았다.
//
// 뺀 것과 까닭(10-2-2b.js, 10-2-2c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 범위 밖: 두 원의 공통현을 포함하는 직선(②70 — 두 원의 교점을 지나는 직선의 방정식은 2022 교과서 두 종에 없다).
//  - 다음 단원(도형의 이동)이 섞인 것: 대칭이동으로 꺾인 길을 펴는 원 위의 점까지의 최단 거리(심4), 평행·대칭이동한 원(꼴 목록에 넣지 않은 섞인 문항).
//  - 작도: 원의 그래프 그리기(①7)는 그래프를 고르는 문항으로 바꾸었다.
//  - 서술형: 접선을 빠뜨린 풀이 고치기(②59)는 접선을 모두 고르는 실력 문항으로 바꾸었다.
//  - 겹침(하는 일이 이미 실은 유형과 같다): 직선이 원에 접할 때 반지름(심1 → ②38), 두 조건으로 고른 뒤 현의 길이(심3 → ②42).
//  - 그림을 알 수 없는 것: 전소1 상3(그림의 원 위의 점까지 거리의 최댓값과 최솟값의 차) — 같은 일은 ①24에 실었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, F, inline } = B.kit;
  const { LAB, MINUS, gcd, Q, qneg, mag, tx, nb, tail, js, V, sup, nz, pm, asQ, poly, pointAns, ineqAns, rt, grp, sqParts, radText, whereOnPlane, f1 } = B.kit.mid;
  const S04 = '10공수2-01-04', S05 = '10공수2-01-05';
  // ref 에 기본꼴(①②)만 있으면 기본 자료, 심화꼴(심)만 있으면 심화 자료
  const sourceOf = (ref) => '수집본 ' + (/[①②]/.test(ref) ? (/심/.test(ref) ? '기본·심화' : '기본') : '심화') + ' 자료(' + ref + ')';

  // ── 검사 근거 마무리 ──
  // 문항에서 보이는 수(검사와 같은 방법으로 읽는다): 글·그림(그림 설명 포함)·보기
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visible(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 검사 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 늘 밝힐 수 있는 수(공식의 2, 4, 제곱근의 0.5 …)와 유형이 밝힌 수(derived) 밖의 수가 나오면 오류를 낸다.
  const ALWAYS = [0, 1, 2, 4, 0.5];
  function seal(item) {
    const f = item.facts || {}, ok = new Set((f.derived || []).map(Number).concat(ALWAYS)), shown = visible(item), out = new Set(f.unseen || []);
    // 검사는 0과 −0을 다르게 본다(Object.is). 식의 값이 −0이면 끝에 +0을 붙여 0으로 만든다.
    const zero = (t) => (Object.is(Function('"use strict"; return (' + t + ');')(), -0) ? t + '+0' : t);
    if (f.calc) f.calc = f.calc.map(([t, i]) => [zero(t), i]);
    if (f.value !== undefined) f.value = zero(f.value);
    const exprs = (f.calc || []).map(([t]) => t).concat(f.value !== undefined ? [f.value] : [], (f.choose && f.choose.exprs) || [], f.pick ? [f.pick.expr] : []);
    for (const t of exprs) for (const n of String(t).match(/\d+(?:\.\d+)?/g) || []) {
      if (shown.has(n)) continue;
      if (!ok.has(Number(n)) && !out.has(Number(n))) throw new Error('검사 식의 수 ' + n + ' 이 글에도 밝힌 수에도 없다: ' + t);
      out.add(Number(n));
    }
    delete f.derived;
    if (out.size) f.unseen = [...out]; else delete f.unseen;
    item.facts = f;
    return item;
  }
  // 만들기가 null 을 돌려주면(조건에 맞지 않는 수) 다시 만든다. 다 만든 문항은 seal 로 검사 근거를 마무리한다.
  const retry = (make) => (d, n) => { for (let i = 0; i < 4000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: sourceOf(ref), make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: sourceOf(ref), make: retry(make) }, more || {});

  // ── 글 ──
  const X = V('x'), Y = V('y'), X2 = X + sup(2), Y2 = Y + sup(2);
  const VA = V('a'), VB = V('b'), VC = V('c'), VK = V('k'), VM = V('m'), VN = V('n'), VR = V('r'), VP = V('p'), VQ = V('q'), VS = V('s'), VT = V('t');
  const iq = (v) => tx(asQ(v));                                         // 화면에 적는 수(음수는 −, 분수는 분수 꼴)
  const jn = (v) => js(asQ(v));                                         // 검사 식에 적는 수((-3), (3/4))
  const sgn = (v) => { const q = asQ(v); return (q.p < 0 ? MINUS : '+') + ' ' + mag(q); };   // 「+ 3」「− 3」
  const cx = (v) => (typeof v === 'string' ? v : iq(v));
  const pt = (x, y) => nb(`(${cx(x)}, ${cx(y)})`);
  const P2 = (name, x, y) => nb(`${name}(${cx(x)}, ${cx(y)})`);
  // (x − a)² (a = 0 이면 x²)
  const sqT = (v, a) => { const q = asQ(a); return q.p === 0 ? v + sup(2) : `(${v} ${sgn(qneg(q))})${sup(2)}`; };
  const stdL = (a, b) => `${sqT(X, a)} + ${sqT(Y, b)}`;
  // 문자 a 의 배수 ka 의 글(1a → a, −1a → −a)과 (x − ka)²
  const kA = (k) => (k === 1 ? VA : k === -1 ? MINUS + VA : iq(k) + VA);
  const sqA = (v, k) => `(${v} ${k > 0 ? MINUS : '+'} ${Math.abs(k) === 1 ? '' : Math.abs(k)}${VA})${sup(2)}`;

  const stdE = (a, b, R) => nb(`${stdL(a, b)} = ${cx(R)}`);
  const genL = (A, Bc, Cc) => poly([[1, X2], [1, Y2], [A, X], [Bc, Y], [Cc, '']]);
  const genE = (A, Bc, Cc) => nb(`${genL(A, Bc, Cc)} = 0`);
  // (x − a)² + (y − b)² = R 을 펼친 일반형의 계수
  const toGen = (a, b, R) => [-2 * a, -2 * b, a * a + b * b - R];
  const lineY = (m, n) => nb(`${Y} = ${poly([[m, X], [n, '']])}`);
  const lineG = (a, b, c) => nb(`${poly([[a, X], [b, Y], [c, '']])} = 0`);
  const STD = nb(`(${X} ${MINUS} ${VA})${sup(2)} + (${Y} ${MINUS} ${VB})${sup(2)} = ${VR}${sup(2)}`);
  const GEN = nb(`${X2} + ${Y2} + ${V('A')}${X} + ${V('B')}${Y} + ${V('C')} = 0`);
  // 식·좌표·낱말 뒤에 토씨를 붙인다. 끝소리로 고른다: 숫자는 읽는 소리(분수는 분자, 근호는 근호 안의 수), 위첨자는 「제곱」,
  // 문자 m·n 은 받침이 있고 l·r 은 ㄹ 받침, 나머지 문자는 받침이 없다, 한글은 그 글자.
  function endJ(h, pair) {
    const [withB, without] = pair.split('/'), s = String(h).replace(/(<\/span>|<\/i>|\s|&nbsp;)+$/g, '');
    if (/<\/sup>$/.test(s)) return withB;
    const fr = String(h).match(/<span class="mb-frac"><span>([^<]*?)<\/span><span class="mb-frac-bar">\/<\/span><span>[^<]*?<\/span><\/span>(?:<\/span>|\s)*$/);
    const t = fr ? stripH(fr[1]) : stripH(h).replace(/[\s)\]]+$/g, ''), ch = t[t.length - 1];
    if (/\d/.test(ch)) return tail(Number(/\d+$/.exec(t)[0]), pair);
    let bat = false, rieul = false;
    if (/[A-Za-z]/.test(ch)) { bat = /[mnlrMNLR]/.test(ch); rieul = /[lrLR]/.test(ch); }
    else { const code = ch.charCodeAt(0) - 0xAC00, k = code >= 0 && code <= 11171 ? code % 28 : 0; bat = k !== 0; rieul = k === 8; }
    if (withB === '으로') return bat && !rieul ? '으로' : '로';
    return bat ? withB : without;
  }
  const ej = (h, pair) => h + endJ(h, pair);
  const NOTE1 = ' <span style="white-space:nowrap">(단, 계수가 1이면 1을 적는다.)</span>';

  // ── 수 ──
  const isSq = (n) => n >= 0 && Number.isInteger(Math.sqrt(n));
  const sqf = (n) => n >= 2 && sqParts(n)[0] === 1;                // 제곱인 수를 인수로 갖지 않는 2 이상의 수
  // x² + y² = R 위의 모눈 점
  const LAT = new Map();
  function lattice(R) {
    if (LAT.has(R)) return LAT.get(R);
    const out = [], m = Math.floor(Math.sqrt(R));
    for (let x = -m; x <= m; x += 1) { const y2 = R - x * x; if (isSq(y2)) { const y = Math.sqrt(y2); out.push([x, y]); if (y !== 0) out.push([x, -y]); } }
    LAT.set(R, out);
    return out;
  }
  // 모눈 점이 넷 넘게 있는 반지름의 제곱
  const RICH = [5, 10, 13, 17, 25, 26, 29, 34, 37, 41, 50, 53, 58, 61, 65, 85];
  const PYTH = [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10], [8, 6, 10]];

  // ── 답 ──
  // 원의 방정식 (x − a)² + (y − b)² = R: 「(x [±][ ])² + (y [±][ ])² = [ ]」. a, b 는 0이 아닌 정수, R 은 자연수.
  function circAns(text, a, b, R, o) {
    if (![a, b].every((v) => Number.isInteger(v) && v !== 0) || !Number.isInteger(R) || R <= 0) throw new Error('원의 방정식 답: a, b 는 0이 아닌 정수, R 은 자연수');
    return inline(text, grp(`(${X} {0})${sup(2)}`) + ' + ' + grp(`(${Y} {1})${sup(2)} = {2}`), [{ answer: -a, signed: true }, { answer: -b, signed: true }, { answer: R }], Object.assign({}, o, { shown: stdE(a, b, R) }));
  }
  // 중심이 원점인 원: 「x² + y² = [ ]」
  const circ0Ans = (text, R, o) => inline(text, `${X2} + ${Y2} = {0}`, [{ answer: R }], Object.assign({}, o, { shown: stdE(0, 0, R) }));
  // 중심이 x축 위: 「(x [±][ ])² + y² = [ ]」
  const circXAns = (text, a, R, o) => inline(text, grp(`(${X} {0})${sup(2)}`) + ' + ' + grp(`${Y2} = {1}`), [{ answer: -a, signed: true }, { answer: R }], Object.assign({}, o, { shown: stdE(a, 0, R) }));
  // 일반형(상수항이 0): 「x² + y² [±][ ]x [±][ ]y = 0」
  const gen0Ans = (text, A, Bc, o) => inline(text + NOTE1, `${X2} + ${Y2} {0}${X} {1}${Y} = 0`, [{ answer: A, signed: true }, { answer: Bc, signed: true }], Object.assign({}, o, { shown: genE(A, Bc, 0) }));
  // 중심과 반지름. rad: { k } 정수 / { q } √q / { k, q } k√q (k ≥ 2)
  function centerRadAns(text, a, b, rad, o) {
    const head = '중심의 좌표: ' + grp('({0}, {1})') + '<br>반지름의 길이: ';
    let tpl, cells, said;
    if (rad.q == null) { tpl = head + '{2}'; cells = [{ answer: rad.k }]; said = String(rad.k); }
    else if (rad.k == null || rad.k === 1) { tpl = head + rt('{2}'); cells = [{ answer: rad.q }]; said = radText(1, rad.q); }
    else { tpl = head + grp('{2}' + rt('{3}')); cells = [{ answer: rad.k }, { answer: rad.q }]; said = radText(rad.k, rad.q); }
    return inline(text, tpl, [{ answer: a, signed: true }, { answer: b, signed: true }].concat(cells), Object.assign({}, o, { shown: `중심의 좌표: ${pt(a, b)}, 반지름의 길이: ${said}` }));
  }
  // 문자의 값 여럿: [[문자, 값, 부호 단추를 다는가]]
  const valsQ = (text, pairs, o) => M(text, pairs.map(([n, v, sign]) => ({ answer: v, signed: sign !== false, lead: V(n) + ' =' })), Object.assign({}, o, { shown: pairs.map(([n, v]) => nb(`${V(n)} = ${iq(v)}`)).join(', ') }));
  // 문자의 값 두 개(차례는 따지지 않는다): 「k = [±][ ] 또는 k = [±][ ]」. 두 값은 서로 다르고 부호만 다른 짝이 아니다.
  function twoValsAns(text, name, v1, v2, o) {
    if (v1 === v2 || v1 === -v2) throw new Error('두 값 칸: 서로 다르고 부호만 다르지 않아야 한다');
    return inline(text, grp(`${name} = {0}`) + ' 또는 ' + grp(`${name} = {1}`), [{ answer: v1, signed: true }, { answer: v2, signed: true }], Object.assign({}, o, { unordered: true, shown: `${nb(name + ' = ' + iq(v1))} 또는 ${nb(name + ' = ' + iq(v2))}` }));
  }
  // 직선 y = mx + n: 「y = [±][ ]x [±][ ]」(m, n 은 0이 아닌 정수)
  function lineAns(text, m, n, o) {
    if (![m, n].every((v) => Number.isInteger(v) && v !== 0)) throw new Error('직선 답: m, n 은 0이 아닌 정수');
    return inline(text + (Math.abs(m) === 1 || o.note ? NOTE1 : ''), `${Y} = {0}${X} {1}`, [{ answer: m, signed: true }, { answer: n, signed: true }], Object.assign({}, o, { shown: lineY(m, n) }));
  }
  // a√b 의 값: 「[ ]√[ ]」(a ≥ 2) 또는 「√[ ]」(a = 1) — 유형마다 하나로 정해 쓴다.
  const radNum = (text, k, q, o) => {
    if (!Number.isInteger(k) || k < 1 || !sqf(q)) throw new Error('근호 답: k 는 자연수, q 는 제곱인 수를 인수로 갖지 않는 2 이상의 수');
    return k === 1 ? inline(text, rt('{0}'), [{ answer: q }], Object.assign({}, o, { shown: radText(1, q) })) : inline(text, grp('{0}' + rt('{1}')), [{ answer: k }, { answer: q }], Object.assign({}, o, { shown: radText(k, q) }));
  };
  // 근호가 든 수의 글: n → k√q 또는 정수
  const rootText = (n) => { const [k, q] = sqParts(n); return q === 1 ? String(k) : radText(k, q); };

  // ── 그림 ──
  // cfig(o): 좌표평면에 원·반원·직선·점을 그린다.
  //  o.x, o.y [작은 끝, 큰 끝](정수), o.grid(모눈, 기본 true), o.ticks: 'all' | [수] | 'none'(축 위에 적을 수), o.small(고르기 보기의 작은 그림),
  //  o.circles [{ cx, cy, r, part: 'up' | 'down' | null, center: true(중심에 점) }], o.lines [{ a, b } | { x }], o.segs [[x1, y1, x2, y2]], o.points [{ x, y, name, side }],
  //  o.say(그림 설명 앞머리). 글(축 위의 수, 점의 이름, O)은 선·점·다른 글과 떨어진 자리를 차례로 찾아 적는다.
  const HALO = 'paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round';
  const ITALIC = "font-style:italic;font-family:'MB Math','Times New Roman',serif";
  const bare = (t) => String(t).replace(/<[^>]+>/g, '');
  const wide = (t, size) => { let w = 0; for (const ch of bare(t)) w += /[A-Z]/.test(ch) ? 0.72 : /[가-힣]/.test(ch) ? 1 : ch === '−' ? 0.62 : 0.58; return w * size; };
  const toSeg = (x, y, [x1, y1, x2, y2]) => { const dx = x2 - x1, dy = y2 - y1, t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy || 1))); return Math.hypot(x - x1 - t * dx, y - y1 - t * dy); };
  const signedText = (v) => (v < 0 ? MINUS + Math.abs(v) : String(v));
  const COLORS = ['#b42318', '#1d4ed8', '#15803d'];
  function cfig(o) {
    const small = Boolean(o.small), [xlo, xhi] = o.x, [ylo, yhi] = o.y, FS = 12;
    const u = Math.min(small ? 13 : 26, (small ? 108 : 236) / (xhi - xlo), (small ? 108 : 236) / (yhi - ylo));
    const padL = small ? 6 : 14, padR = small ? 16 : 22, padT = small ? 16 : 22, padB = small ? 8 : 14;
    const W = padL + padR + (xhi - xlo) * u, Hh = padT + padB + (yhi - ylo) * u;
    const PX = (v) => padL + (v - xlo) * u, PY = (v) => padT + (yhi - v) * u, ox = PX(0), oy = PY(0);
    const segs = [], dots = [], boxes = [], why = [];
    let grid = '', out = '', texts = '';
    const line = (x1, y1, x2, y2, style) => { segs.push([x1, y1, x2, y2]); return `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" style="${style}"/>`; };
    if (o.grid !== false) {
      for (let v = xlo; v <= xhi; v += 1) grid += `<line class="mb-gridline" x1="${f1(PX(v))}" y1="${f1(PY(ylo))}" x2="${f1(PX(v))}" y2="${f1(PY(yhi))}"/>`;
      for (let v = ylo; v <= yhi; v += 1) grid += `<line class="mb-gridline" x1="${f1(PX(xlo))}" y1="${f1(PY(v))}" x2="${f1(PX(xhi))}" y2="${f1(PY(v))}"/>`;
    }
    // 축
    const ax1 = PX(xhi) + (small ? 5 : 9), ay1 = PY(yhi) - (small ? 5 : 9);
    out += line(PX(xlo) - (small ? 3 : 6), oy, ax1, oy, 'stroke:#1f2933;stroke-width:1') + `<path d="M${f1(ax1 + 6)} ${f1(oy)}l-7 -3.4v6.8z" style="fill:#1f2933"/>`;
    out += line(ox, PY(ylo) + (small ? 3 : 6), ox, ay1, 'stroke:#1f2933;stroke-width:1') + `<path d="M${f1(ox)} ${f1(ay1 - 6)}l-3.4 7h6.8z" style="fill:#1f2933"/>`;
    // 원과 반원
    const said = [];
    (o.circles || []).forEach((c, k) => {
      const color = c.color || COLORS[k % COLORS.length], a0 = c.part === 'up' ? 0 : c.part === 'down' ? 180 : 0, a1 = c.part ? a0 + 180 : 360, pts = [];
      for (let a = a0; a <= a1 + 1e-9; a += 3) pts.push([PX(c.cx + c.r * Math.cos(a * Math.PI / 180)), PY(c.cy + c.r * Math.sin(a * Math.PI / 180))]);
      for (let j = 0; j + 1 < pts.length; j += 1) segs.push([pts[j][0], pts[j][1], pts[j + 1][0], pts[j + 1][1]]);
      out += c.part ? `<path d="M${pts.map(([x, y]) => f1(x) + ' ' + f1(y)).join('L')}" style="fill:none;stroke:${color};stroke-width:1.8"/>`
        : `<circle cx="${f1(PX(c.cx))}" cy="${f1(PY(c.cy))}" r="${f1(c.r * u)}" style="fill:none;stroke:${color};stroke-width:1.8"/>`;
      if (c.center) { dots.push([PX(c.cx), PY(c.cy)]); out += `<circle class="mb-dot" cx="${f1(PX(c.cx))}" cy="${f1(PY(c.cy))}" r="${small ? 2.4 : 2.8}"/>`; }
      const where = whereOnPlane(c.cx, c.cy);
      said.push(c.part ? `중심이 ${where}이고 반지름이 ${c.r}칸인 원의 ${c.part === 'up' ? 'x축 위쪽' : 'x축 아래쪽'} 반(반원).` : `원: 중심은 ${where}이고 반지름은 ${c.r}칸이다${c.center ? '(중심에 점을 찍었다)' : ''}.`);
    });
    // 직선
    (o.lines || []).forEach((l) => {
      const style = (l.dash ? 'stroke:#5b6770;stroke-width:1;stroke-dasharray:4 3' : 'stroke:#1d4ed8;stroke-width:1.6');
      if (l.x != null) { out += line(PX(l.x), PY(ylo), PX(l.x), PY(yhi), style); return; }
      const a = l.a, b = l.b || 0; let lo = xlo, hi = xhi;
      if (a !== 0) { const s = (ylo - b) / a, t = (yhi - b) / a; lo = Math.max(lo, Math.min(s, t)); hi = Math.min(hi, Math.max(s, t)); }
      out += line(PX(lo), PY(a * lo + b), PX(hi), PY(a * hi + b), style);
    });
    for (const [x1, y1, x2, y2] of o.segs || []) out += line(PX(x1), PY(y1), PX(x2), PY(y2), 'stroke:#1f2933;stroke-width:1.4');
    for (const p of o.points || []) { dots.push([PX(p.x), PY(p.y)]); out += `<circle class="mb-dot" cx="${f1(PX(p.x))}" cy="${f1(PY(p.y))}" r="${small ? 2.4 : 3}"/>`; }
    // 글 놓기: 글 상자(가운데 cx, cy, 반 너비 w, 반 높이 h)에서 선·점까지의 틈과 다른 글과의 틈을 재어 가장 앞의 넉넉한 자리에 적는다.
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
    const apart = (cx0, cy, w, h) => boxes.reduce((m, [bx, by, bw, bh]) => Math.min(m, Math.max(Math.abs(bx - cx0) - bw - w - 4, Math.abs(by - cy) - bh - h)), 99);
    const inside = (cx0, cy, w, h) => cx0 - w >= 1 && cx0 + w <= W - 1 && cy - h >= 1 && cy + h <= Hh - 1;
    function place(cands, t, style, need) {
      const w = wide(t, FS) / 2, h = FS * 0.42; let best = null;
      for (const [x, y, anchor] of cands) {
        const cx0 = anchor === 'middle' ? x : anchor === 'end' ? x - w : x + w, cy = y - FS * 0.34;
        const s = inside(cx0, cy, w, h) ? Math.min(room(cx0, cy, w, h), apart(cx0, cy, w, h) + 1.5) : -9;
        if (!best || s > best.s + 0.01) best = { s, x, y, anchor, cx0, cy };
        if (s >= 3) break;
      }
      if (best.s < 2.5) { if (need === false) return; why.push(bare(t) + ' 틈 ' + best.s.toFixed(1)); }
      boxes.push([best.cx0, best.cy, w, h]);
      texts += `<text x="${f1(best.x)}" y="${f1(best.y)}" text-anchor="${best.anchor}" style="font-size:${FS}px;font-weight:600;fill:#1f2933;${HALO}${style ? ';' + style : ''}">${t}</text>`;
    }
    boxes.push([ax1 + 4, oy + 9, 4, 5], [ox + 10, ay1 - 6, 4, 5]);
    texts += `<text x="${f1(ax1 + 4)}" y="${f1(oy + 14)}" text-anchor="middle" style="font-size:13px;fill:#1f2933;${ITALIC};${HALO}">x</text>`
      + `<text x="${f1(ox + 10)}" y="${f1(ay1 + 2)}" text-anchor="middle" style="font-size:13px;fill:#1f2933;${ITALIC};${HALO}">y</text>`;
    // 축 위의 수: 늘 x축 아래, y축 왼쪽에 적는다(흰 테두리로 밑의 선을 가린다). 작은 그림에는 적지 않는다.
    const ticks = o.ticks || 'none', xt = o.xticks || ticks, yt = o.yticks || ticks, showX = (v) => v !== 0 && (xt === 'all' || (Array.isArray(xt) && xt.includes(v))), showY = (v) => v !== 0 && (yt === 'all' || (Array.isArray(yt) && yt.includes(v)));
    const tick = (x, y, t, anchor) => { const w = wide(t, FS) / 2; boxes.push([anchor === 'end' ? x - w : x, y - FS * 0.34, w, FS * 0.42]); texts += `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor}" style="font-size:${FS}px;font-weight:600;fill:#1f2933;${HALO}">${t}</text>`; };
    for (let v = xlo; v <= xhi; v += 1) if (showX(v)) tick(PX(v), oy + 13, signedText(v), 'middle');
    for (let v = ylo; v <= yhi; v += 1) if (showY(v)) tick(ox - 5, PY(v) + 4, signedText(v), 'end');
    if (!small) place([[ox - 7, oy + 13, 'middle'], [ox - 8, oy - 4, 'middle'], [ox + 7, oy + 13, 'middle'], [ox + 7, oy - 4, 'middle']], 'O');
    for (const p of o.points || []) if (p.name) {
      const x = PX(p.x), y = PY(p.y), first = p.side ? [{ ur: [6, -5, 'start'], ul: [-6, -5, 'end'], dr: [6, 14, 'start'], dl: [-6, 14, 'end'] }[p.side]] : [];
      place(first.concat([[6, -5, 'start'], [-6, -5, 'end'], [6, 14, 'start'], [-6, 14, 'end'], [0, -8, 'middle'], [0, 17, 'middle'], [9, 5, 'start'], [-9, 5, 'end']]).map(([dx, dy, an]) => [x + dx, y + dy, an]), p.name);
    }
    const head = `좌표평면: ${o.say || ''}`.trim() + (o.grid !== false ? ' 모눈 한 칸의 길이는 1이다.' : '');
    const tickSaid = xt === 'all' && yt === 'all' ? ' 눈금마다 수를 적었다.' : (Array.isArray(xt) && xt.length ? ` x축 위에 적힌 수: ${xt.map(signedText).join(', ')}.` : '') + (Array.isArray(yt) && yt.length ? ` y축 위에 적힌 수: ${yt.map(signedText).join(', ')}.` : '');
    const ptSaid = (o.points || []).filter((p) => p.name).map((p) => ` 점 ${bare(p.name)}: ${whereOnPlane(p.x, p.y)}.`).join('');
    const svg = `<svg class="mb-geo" viewBox="0 0 ${f1(W)} ${f1(Hh)}" width="${Math.round(W)}" role="img" aria-label="${head}${tickSaid} ${said.join(' ')}${ptSaid}">${grid}${out}${texts}</svg>`;
    return { svg, ok: why.length === 0, why };
  }
  const fig = (o) => cfig(o).svg, figOk = (o) => cfig(o).ok;
  // 작은 그림 넷을 두 줄로 놓고 이름(㉠~㉣)을 단다.
  const picks = (figs) => '<div style="display:grid;grid-template-columns:repeat(2,max-content);gap:8px 14px">' + figs.map((h, i) => `<div style="display:grid;gap:1px;justify-items:start"><div style="font-size:0.95rem;font-weight:600">${LAB[i]}</div>${h}</div>`).join('') + '</div>';
  // 그림의 범위: 들어가야 할 값(0을 넣는다)에 여유를 두어 정수로 잡는다.
  const span = (vs, pad) => { const list = vs.concat([0]), m = pad == null ? 1 : pad; return [Math.floor(Math.min(...list) - m), Math.ceil(Math.max(...list) + m)]; };

  // 문장 조각
  const CIRC = (h) => `원 ${h}`;
  const AXIS = { x: X + '축', y: Y + '축' };

  // ── 단원 ──
  B.addUnit({
    id: '10-2-2', grade: 10, semester: 2, no: 2, title: '원의 방정식', version: 1,
    groups: [
      // ── 원의 방정식 ──
      {
        id: 'circle', title: '원의 방정식', standard: S04,
        types: [
          T('circle-center', '중심과 반지름의 길이로 원의 방정식 구하기', '①1', (d, n) => {
            if (n === 0) {
              const a = nz(d, -6, 6), b = nz(d, -6, 6), r = d.int(2, 7);
              return circAns(`중심의 좌표가 ${pt(a, b)}이고 반지름의 길이가 ${r}인 원의 방정식을 구하시오.`, a, b, r * r, {
                explain: `중심의 좌표가 ${pt(VA, VB)}이고 반지름의 길이가 ${VR}인 원의 방정식은 ${STD}이다. 따라서 ${stdE(a, b, r * r)}이다.`,
                facts: { calc: [[`0-${jn(a)}`, 0], [`0-${jn(b)}`, 1], [`${r}*${r}`, 2]] }
              });
            }
            const k = d.pick([1, 1, 2, 3]), q = d.pick([2, 3, 5, 6, 7]), R = k * k * q;
            return circ0Ans(`중심이 원점이고 반지름의 길이가 ${radText(k, q)}인 원의 방정식을 구하시오.`, R, {
              explain: `중심이 원점이고 반지름의 길이가 ${VR}인 원의 방정식은 ${nb(`${X2} + ${Y2} = ${VR}${sup(2)}`)}이다. (${radText(k, q)})${sup(2)} = ${R}이므로 ${stdE(0, 0, R)}이다.`,
              facts: { calc: [[`${k}*${k}*${q}`, 0]] }
            });
          }, { count: 2 }),
          T('circle-read', '원의 방정식에서 중심과 반지름의 길이 읽기', '①2', (d, n) => {
            if (n === 0) {
              const a = nz(d, -7, 7), b = nz(d, -7, 7), r = d.int(1, 8);
              return centerRadAns(`원 ${stdE(a, b, r * r)}의 중심의 좌표와 반지름의 길이를 구하시오.`, a, b, { k: r }, {
                explain: `${STD}의 중심의 좌표는 ${pt(VA, VB)}, 반지름의 길이는 ${VR}이다. ${stdE(a, b, r * r)}에서 ${nb(`(${X} ${sgn(-a)})`)}이므로 중심의 ${X}좌표는 ${iq(a)}, ${nb(`(${Y} ${sgn(-b)})`)}이므로 ${Y}좌표는 ${iq(b)}이고, ${r * r} = ${r}${sup(2)}이므로 반지름의 길이는 ${r}이다.`,
                facts: { calc: [[jn(a), 0], [jn(b), 1], [`${r * r}**0.5`, 2]] }
              });
            }
            // 중심이 좌표축 위에 있고 반지름이 √q 인 원
            const q = d.pick([2, 3, 5, 6, 7, 10, 11, 13]), onX = d.bool(), c = nz(d, -6, 6), a = onX ? c : 0, b = onX ? 0 : c;
            return centerRadAns(`원 ${stdE(a, b, q)}의 중심의 좌표와 반지름의 길이를 구하시오.`, a, b, { q }, {
              explain: `${onX ? `${Y2} = (${Y} ${MINUS} 0)${sup(2)}` : `${X2} = (${X} ${MINUS} 0)${sup(2)}`}으로 볼 수 있으므로 중심의 좌표는 ${pt(a, b)}이다. 반지름의 길이는 ${radText(1, q)}이다.`,
              facts: { calc: [[jn(a), 0], [jn(b), 1], [String(q), 2]] }
            });
          }, { count: 2 }),
          T('circle-point', '중심과 원 위의 한 점으로 원의 방정식 구하기', '①3', (d, n) => {
            if (n === 0) {
              const a = nz(d, -5, 5), b = nz(d, -5, 5), p = d.int(-6, 6), q = d.int(-6, 6), R = (p - a) ** 2 + (q - b) ** 2;
              if (R === 0 || R > 90 || (p === 0 && q === 0)) return null;
              return circAns(`중심의 좌표가 ${pt(a, b)}이고 점 ${ej(pt(p, q), '을/를')} 지나는 원의 방정식을 구하시오.`, a, b, R, {
                explain: `반지름의 길이는 중심 ${ej(pt(a, b), '과/와')} 점 ${pt(p, q)} 사이의 거리이므로 그 제곱은 ${nb(`(${iq(p)} ${MINUS} ${iq(a).replace(MINUS, '(' + MINUS) + (a < 0 ? ')' : '')})${sup(2)}`)} + ${nb(`(${iq(q)} ${MINUS} ${iq(b).replace(MINUS, '(' + MINUS) + (b < 0 ? ')' : '')})${sup(2)}`)} = ${R}이다. 따라서 ${stdE(a, b, R)}이다.`,
                facts: { calc: [[`0-${jn(a)}`, 0], [`0-${jn(b)}`, 1], [`(${jn(p)}-${jn(a)})*(${jn(p)}-${jn(a)})+(${jn(q)}-${jn(b)})*(${jn(q)}-${jn(b)})`, 2]] }
              });
            }
            const p = nz(d, -8, 8), q = nz(d, -8, 8);
            return circ0Ans(`중심이 원점이고 점 ${ej(pt(p, q), '을/를')} 지나는 원의 방정식을 구하시오.`, p * p + q * q, {
              explain: `반지름의 길이의 제곱은 원점과 점 ${pt(p, q)} 사이의 거리의 제곱이므로 ${nb(`${iq(p).replace(MINUS, '(' + MINUS) + (p < 0 ? ')' : '')}${sup(2)} + ${iq(q).replace(MINUS, '(' + MINUS) + (q < 0 ? ')' : '')}${sup(2)} = ${p * p + q * q}`)}이다. 따라서 ${stdE(0, 0, p * p + q * q)}이다.`,
              facts: { calc: [[`${jn(p)}*${jn(p)}+${jn(q)}*${jn(q)}`, 0]] }
            });
          }, { count: 2 }),
          T('circle-diameter', '지름의 양 끝점으로 원의 방정식 구하기', '①4', (d) => {
            const c1 = nz(d, -5, 5), c2 = nz(d, -5, 5), h1 = d.int(-4, 4), h2 = d.int(-4, 4);
            if (h1 === 0 && h2 === 0) return null;
            const A = [c1 - h1, c2 - h2], Bp = [c1 + h1, c2 + h2], R = h1 * h1 + h2 * h2;
            return circAns(`두 점 ${P2('A', A[0], A[1])}, ${ej(P2('B', Bp[0], Bp[1]), '을/를')} 지름의 양 끝점으로 하는 원의 방정식을 구하시오.`, c1, c2, R, {
              explain: `원의 중심은 선분 AB의 중점이므로 ${pt(c1, c2)}이고, 반지름의 길이의 제곱은 중심과 점 A 사이의 거리의 제곱인 ${h1 * h1} + ${h2 * h2} = ${R}이다. 따라서 ${stdE(c1, c2, R)}이다.`,
              facts: { calc: [[`0-(${jn(A[0])}+${jn(Bp[0])})/2`, 0], [`0-(${jn(A[1])}+${jn(Bp[1])})/2`, 1], [`(${jn(Bp[0])}-${jn(A[0])})*(${jn(Bp[0])}-${jn(A[0])})/4+(${jn(Bp[1])}-${jn(A[1])})*(${jn(Bp[1])}-${jn(A[1])})/4`, 2]] }
            });
          }),
          T('circle-diameter-back', '지름의 양 끝점이 문자일 때 거꾸로 구하기', '①5', (d) => {
            const p = nz(d, -6, 6), q = nz(d, -6, 6);
            if (Math.abs(p) === Math.abs(q)) return null;
            return valsQ(`두 점 ${P2('A', p, VA)}, ${ej(P2('B', VB, q), '을/를')} 지름의 양 끝점으로 하는 원의 방정식이 ${nb(`${X2} + ${Y2} = ${VC}`)}일 때, 상수 ${VA}, ${VB}, ${VC}의 값은?`, [['a', -q], ['b', -p], ['c', p * p + q * q]], {
              explain: `원 ${nb(`${X2} + ${Y2} = ${VC}`)}의 중심은 원점이고, 이것이 선분 AB의 중점이다. ${nb(`${iq(p)} + ${VB} = 0`)}에서 ${nb(`${VB} = ${iq(-p)}`)}, ${nb(`${VA} + ${iq(q)} = 0`)}에서 ${nb(`${VA} = ${iq(-q)}`)}이다. ${VC}는 반지름의 길이의 제곱이므로 원점과 점 A 사이의 거리의 제곱 ${p * p} + ${q * q} = ${p * p + q * q}이다.`,
              facts: { calc: [[`0-${jn(q)}`, 0], [`0-${jn(p)}`, 1], [`${jn(p)}*${jn(p)}+${jn(q)}*${jn(q)}`, 2]] }
            });
          }),
          T('circle-figure', '그림의 원의 방정식 구하기', '①6', (d) => {
            const a = nz(d, -3, 3), b = nz(d, -3, 3), r = d.int(1, 3), o = { x: span([a - r, a + r], 1), y: span([b - r, b + r], 1), ticks: 'all', circles: [{ cx: a, cy: b, r, center: true }], say: '원 하나가 있고 그 중심에 점을 찍었다.' };
            if (o.x[1] - o.x[0] > 9 || o.y[1] - o.y[0] > 9 || !figOk(o)) return null;
            return circAns('그림과 같은 원의 방정식을 구하시오.', a, b, r * r, {
              figure: fig(o),
              explain: `그림에서 원의 중심의 좌표는 ${pt(a, b)}, 반지름의 길이는 ${r}이다. 따라서 ${stdE(a, b, r * r)}이다.`,
              facts: { calc: [[`0-${jn(a)}`, 0], [`0-${jn(b)}`, 1], [`${r}*${r}`, 2]] }
            });
          }),
          T('circle-graph-pick', '방정식이 나타내는 원의 그래프 고르기', '①7', (d) => {
            const a = nz(d, -2, 2), b = nz(d, -2, 2), r = d.int(2, 3);
            if (Math.abs(a) === Math.abs(b) && d.bool()) return null;
            const R = r * r, [A, Bc, Cc] = toGen(a, b, R);
            const want = [a, b, r], wrong = [[-a, -b, r], [a, b, r === 2 ? 3 : 2], [b, a, r], [a, -b, r], [-a, b, r]];
            const rows = [want].concat(d.shuffle(wrong).filter((w, i, all) => w.join() !== want.join() && all.findIndex((z) => z.join() === w.join()) === i).slice(0, 3));
            if (rows.length < 4 || new Set(rows.map((w) => w.join())).size < 4) return null;
            const order = d.shuffle([0, 1, 2, 3]), shown = order.map((i) => rows[i]);
            const figs = shown.map(([x, y, rr], i) => fig({ small: true, x: [-5, 5], y: [-5, 5], circles: [{ cx: x, cy: y, r: rr, center: true }], say: `${LAB[i]}.` }));
            return C(`방정식 ${ej(genE(A, Bc, Cc), '이/가')} 나타내는 원을 좌표평면 위에 바르게 그린 것은? (단, 모눈 한 칸의 길이는 1이다.)`, LAB.slice(0, 4), order.indexOf(0), {
              figure: picks(figs),
              explain: `주어진 방정식을 변형하면 ${stdE(a, b, R)}이므로 중심의 좌표가 ${pt(a, b)}이고 반지름의 길이가 ${r}인 원이다. 이 원을 그린 것은 ${LAB[order.indexOf(0)]}이다.`,
              facts: { truth: shown.map((w) => w.join() === want.join()), want: true }
            });
          }),
          T('circle-axis-tangent', '좌표축에 접하는 원의 방정식', '①8', (d, n) => {
            if (n === 0) {
              const a = nz(d, -7, 7), b = nz(d, -7, 7), onX = d.bool(), r = onX ? Math.abs(b) : Math.abs(a);
              if (Math.abs(a) === Math.abs(b)) return null;
              return circAns(`중심의 좌표가 ${pt(a, b)}이고 ${onX ? AXIS.x : AXIS.y}에 접하는 원의 방정식을 구하시오.`, a, b, r * r, {
                explain: `${onX ? AXIS.x : AXIS.y}에 접하는 원의 반지름의 길이는 중심의 ${onX ? Y : X}좌표의 절댓값이므로 ${nb(`|${iq(onX ? b : a)}| = ${r}`)}이다. 따라서 ${stdE(a, b, r * r)}이다.`,
                facts: { calc: [[`0-${jn(a)}`, 0], [`0-${jn(b)}`, 1], [`${jn(onX ? b : a)}*${jn(onX ? b : a)}`, 2]], rule: 'axis-one' }
              });
            }
            const r = d.int(2, 7), a = pm(d) * r, b = pm(d) * r;
            return circAns(`중심의 좌표가 ${pt(a, b)}이고 ${AXIS.x}과 ${AXIS.y}에 동시에 접하는 원의 방정식을 구하시오.`, a, b, r * r, {
              explain: `두 축에 동시에 접하므로 반지름의 길이는 중심의 ${X}좌표, ${Y}좌표의 절댓값인 ${r}이다. 따라서 ${stdE(a, b, r * r)}이다.`,
              facts: { calc: [[`0-${jn(a)}`, 0], [`0-${jn(b)}`, 1], [`${jn(a)}*${jn(a)}`, 2]], rule: 'axis-both' }
            });
          }, { count: 2 }),
          T('circle-through-origin', '원이 원점을 지날 조건으로 미지수 구하기', '①9', (d) => {
            const a0 = d.int(1, 4), k = d.pick([2, 3, -2, -3]), R = a0 * a0 * (1 + k * k);
            const ka = `${Math.abs(k)}${VA}`;
            return N(`원 ${ej(nb(`(${X} ${MINUS} ${VA})${sup(2)} + (${Y} ${k > 0 ? MINUS : '+'} ${ka})${sup(2)} = ${R}`), '이/가')} 원점을 지날 때, 양수 ${VA}의 값은?`, a0, {
              explain: `${nb(`${X} = 0`)}, ${nb(`${Y} = 0`)}을 대입하면 ${nb(`${VA}${sup(2)} + ${k * k}${VA}${sup(2)} = ${R}`)}, ${nb(`${VA}${sup(2)} = ${a0 * a0}`)}이다. ${VA}는 양수이므로 ${nb(`${VA} = ${a0}`)}이다.`,
              facts: { value: `(${R}/(1+${Math.abs(k)}*${Math.abs(k)}))**0.5` }
            });
          }),
          T('circle-bisect', '원의 넓이를 이등분하는 직선', '①10', (d, n) => {
            if (n === 0) {
              const p = nz(d, -4, 4), s = nz(d, -3, 3), q = s * p, r = d.int(1, 5), [A, Bc, Cc] = toGen(p, q, r * r);
              if (Math.abs(q) > 9) return null;
              return N(`직선 ${nb(`${Y} = ${VA}${X}`)}가 원 ${genE(A, Bc, Cc)}의 넓이를 이등분할 때, 상수 ${VA}의 값은?`, s, { signed: true,
                explain: `원의 넓이를 이등분하는 직선은 원의 중심을 지난다. 주어진 원을 변형하면 ${stdE(p, q, r * r)}이므로 중심은 ${pt(p, q)}이다. ${nb(`${iq(q)} = ${VA} × ${iq(p).replace(MINUS, '(' + MINUS) + (p < 0 ? ')' : '')}`)}에서 ${nb(`${VA} = ${iq(s)}`)}이다.`,
                facts: { value: `${jn(Bc)}/${jn(A)}` }
              });
            }
            const m = nz(d, -3, 3), nn = nz(d, -6, 6), a0 = nz(d, -5, 5), q = m * a0 + nn, R = d.pick([3, 5, 7, 10, 12, 15, 20]);
            if (q === 0 || Math.abs(q) > 9) return null;
            return N(`직선 ${ej(lineY(m, nn), '이/가')} 원 ${nb(`(${X} ${MINUS} ${VA})${sup(2)} + ${sqT(Y, q)} = ${R}`)}의 넓이를 이등분할 때, 상수 ${VA}의 값은?`, a0, { signed: true,
              explain: `원의 넓이를 이등분하는 직선은 원의 중심 ${ej(pt(VA, q), '을/를')} 지난다. ${nb(`${iq(q)} = ${iq(m)}${VA} ${sgn(nn)}`)}에서 ${nb(`${VA} = ${iq(a0)}`)}이다.`,
              facts: { value: `(${jn(q)}-${jn(nn)})/${jn(m)}` }
            });
          }, { count: 2 })
        ]
      },
      // ── x² + y² + Ax + By + C = 0 이 나타내는 원 ──
      {
        id: 'general', title: 'x² + y² + Ax + By + C = 0이 나타내는 원', standard: S04,
        types: [
          T('gen-read', '일반형을 변형하여 중심과 반지름의 길이 구하기', '①11', (d, n) => {
            if (n === 0) {
              const p = nz(d, -6, 6), q = nz(d, -6, 6), r = d.int(1, 8), [A, Bc, Cc] = toGen(p, q, r * r);
              return centerRadAns(`방정식 ${ej(genE(A, Bc, Cc), '이/가')} 나타내는 원의 중심의 좌표와 반지름의 길이를 구하시오.`, p, q, { k: r }, {
                explain: `${X}에 대한 항과 ${Y}에 대한 항을 각각 완전제곱식으로 고치면 ${stdE(p, q, r * r)}이다. 따라서 중심의 좌표는 ${pt(p, q)}, 반지름의 길이는 ${r}이다.`,
                facts: { calc: [[`0-${jn(A)}/2`, 0], [`0-${jn(Bc)}/2`, 1], [`(${jn(A)}*${jn(A)}/4+${jn(Bc)}*${jn(Bc)}/4-${jn(Cc)})**0.5`, 2]], rule: 'gen-int' }
              });
            }
            if (n === 1) {
              const p = nz(d, -6, 6), q = nz(d, -6, 6), k = d.int(2, 4), s = d.pick([2, 3, 5, 6, 7]), R = k * k * s, [A, Bc, Cc] = toGen(p, q, R);
              if (R > 100) return null;
              return centerRadAns(`방정식 ${ej(genE(A, Bc, Cc), '이/가')} 나타내는 원의 중심의 좌표와 반지름의 길이를 구하시오.`, p, q, { k, q: s }, {
                explain: `완전제곱식으로 고치면 ${stdE(p, q, R)}이다. 따라서 중심의 좌표는 ${pt(p, q)}, 반지름의 길이는 ${nb(`${rt(R)} = ${radText(k, s)}`)}이다.`,
                facts: { calc: [[`0-${jn(A)}/2`, 0], [`0-${jn(Bc)}/2`, 1]], rr: [R, k, s], rule: 'gen-rad' }
              });
            }
            // 일차항의 계수가 홀수라 중심이나 반지름이 분수인 원 — 고르기
            const c = d.until(() => {
              const u = d.pick([1, 3, 5, -1, -3, -5]), v = d.pick([0, 2, 4, -2, -4]), w = d.pick([1, 3, 5, 7, 9]), flip = d.bool();
              return flip ? { u: v, v: u, w } : { u, v, w };
            }, (z) => (z.u * z.u + z.v * z.v - z.w * z.w) % 4 === 0 && z.w * z.w > 0 && (z.u * z.u + z.v * z.v - z.w * z.w) !== 0);
            const A = -c.u, Bc = -c.v, Cc = (c.u * c.u + c.v * c.v - c.w * c.w) / 4;
            const half = (k) => (k % 2 === 0 ? iq(k / 2) : iq(Q(k, 2)));
            const opt = (u, v, wq) => `중심 ${pt(u % 2 === 0 ? u / 2 : Q(u, 2), v % 2 === 0 ? v / 2 : Q(v, 2))}, 반지름의 길이 ${iq(wq)}`;
            const rows = [[opt(c.u, c.v, Q(c.w, 2)), true], [opt(-c.u, -c.v, Q(c.w, 2)), false], [opt(c.u, c.v, Q(c.w * c.w, 4)), false], [opt(2 * c.u, 2 * c.v, Q(c.w, 1)), false]];
            if (new Set(rows.map((r) => stripH(r[0]))).size !== 4) return null;
            const list = d.shuffle(rows);
            return C(`방정식 ${ej(genE(A, Bc, Cc), '이/가')} 나타내는 원의 중심의 좌표와 반지름의 길이는?`, list.map((r) => r[0]), list.findIndex((r) => r[1]), {
              explain: `${X2}${c.u ? ` ${sgn(-c.u)}${X}` : ''} = ${nb(`(${X} ${sgn(Q(-c.u, 2))})${sup(2)}`)} ${MINUS} ${iq(Q(c.u * c.u, 4))}처럼 일차항의 계수의 절반을 써서 완전제곱식으로 고치면 ${nb(`${sqT(X, Q(c.u, 2))} + ${sqT(Y, Q(c.v, 2))} = ${iq(Q(c.w * c.w, 4))}`)}이다. 따라서 중심은 ${pt(c.u % 2 === 0 ? c.u / 2 : Q(c.u, 2), c.v % 2 === 0 ? c.v / 2 : Q(c.v, 2))}, 반지름의 길이는 ${half(c.w)}이다.`,
              facts: { truth: list.map((r) => r[1]), want: true, rule: 'gen-frac' }
            });
          }, { count: 3 }),
          T('gen-back', '중심과 반지름의 길이로 일반형의 계수 거꾸로 구하기', '①12', (d, n) => {
            const p = nz(d, -5, 5), q = nz(d, -5, 5), r = d.int(1, 7), C0 = p * p + q * q - r * r;
            if (C0 === 0) return null;
            if (n === 0) {
              const left = poly([[1, X2], [1, Y2], [2, VA + X], [-2 * q, Y], [C0, '']]);
              return valsQ(`원 ${nb(`${left} = 0`)}의 중심의 좌표가 ${pt(p, VB)}이고 반지름의 길이가 ${VR}일 때, 상수 ${VA}, ${VB}, ${VR}의 값은?`, [['a', -p], ['b', q], ['r', r, false]], {
                explain: `완전제곱식으로 고치면 ${nb(`(${X} + ${VA})${sup(2)} + ${sqT(Y, q)} = ${VA}${sup(2)} ${sgn(q * q - C0)}`)}이므로 중심은 ${pt(MINUS + VA, q)}이다. ${nb(`${MINUS}${VA} = ${iq(p)}`)}에서 ${nb(`${VA} = ${iq(-p)}`)}, ${nb(`${VB} = ${iq(q)}`)}이고 ${nb(`${VR}${sup(2)} = ${p * p} ${sgn(q * q - C0)} = ${r * r}`)}이므로 ${nb(`${VR} = ${r}`)}이다.`,
                facts: { calc: [[`0-${jn(p)}`, 0], [`${jn(2 * q)}/2`, 1], [`(${jn(p)}*${jn(p)}+${jn(2 * q)}*${jn(2 * q)}/4-${jn(C0)})**0.5`, 2]], rule: 'back-0' }
              });
            }
            return valsQ(`방정식 ${nb(`${X2} + ${Y2} + ${VA}${X} + ${VB}${Y} + ${VC} = 0`)}이 나타내는 원의 중심의 좌표가 ${pt(p, q)}이고 반지름의 길이가 ${r}일 때, 상수 ${VA}, ${VB}, ${VC}의 값은?`, [['a', -2 * p], ['b', -2 * q], ['c', C0]], {
              explain: `중심이 ${pt(p, q)}이고 반지름의 길이가 ${r}인 원은 ${stdE(p, q, r * r)}이다. 전개하여 정리하면 ${genE(-2 * p, -2 * q, C0)}이므로 ${nb(`${VA} = ${iq(-2 * p)}`)}, ${nb(`${VB} = ${iq(-2 * q)}`)}, ${nb(`${VC} = ${iq(C0)}`)}이다.`,
              facts: { calc: [[`0-2*${jn(p)}`, 0], [`0-2*${jn(q)}`, 1], [`${jn(p)}*${jn(p)}+${jn(q)}*${jn(q)}-${r}*${r}`, 2]], rule: 'back-1' }
            });
          }, { count: 2 }),
          T('gen-same-center', '일반형의 원과 중심이 같고 한 점을 지나는 원', '①13', (d) => {
            const p = nz(d, -5, 5), q = nz(d, -5, 5), r0 = d.int(2, 6), [A, Bc, Cc] = toGen(p, q, r0 * r0), s = d.int(-6, 6), t = d.int(-6, 6), R = (s - p) ** 2 + (t - q) ** 2;
            if (R === 0 || R === r0 * r0 || R > 80) return null;
            return circAns(`원 ${ej(genE(A, Bc, Cc), '과/와')} 중심이 같고 점 ${ej(pt(s, t), '을/를')} 지나는 원의 방정식을 구하시오.`, p, q, R, {
              explain: `주어진 원을 변형하면 ${stdE(p, q, r0 * r0)}이므로 중심은 ${pt(p, q)}이다. 반지름의 길이의 제곱은 중심과 점 ${pt(s, t)} 사이의 거리의 제곱 ${(s - p) ** 2} + ${(t - q) ** 2} = ${R}이다. 따라서 ${stdE(p, q, R)}이다.`,
              facts: { calc: [[`${jn(A)}/2`, 0], [`${jn(Bc)}/2`, 1], [`(${jn(s)}+${jn(A)}/2)*(${jn(s)}+${jn(A)}/2)+(${jn(t)}+${jn(Bc)}/2)*(${jn(t)}+${jn(Bc)}/2)`, 2]] }
            });
          }),
          T('gen-condition', '방정식이 원을 나타낼 조건', '①14', (d, n) => {
            const p = nz(d, -5, 5), q = nz(d, -5, 5), S = p * p + q * q, A = -2 * p, Bc = -2 * q;
            if (n === 0) {
              return ineqAns(`방정식 ${nb(`${poly([[1, X2], [1, Y2], [A, X], [Bc, Y]])} + ${VK} = 0`)}이 원을 나타내도록 하는 실수 ${VK}의 값의 범위를 구하시오.`, '<', S, VK, {
                explain: `완전제곱식으로 고치면 ${nb(`${stdL(p, q)} = ${S} ${MINUS} ${VK}`)}이다. 원을 나타내려면 우변(반지름의 길이의 제곱)이 양수여야 하므로 ${nb(`${S} ${MINUS} ${VK} &gt; 0`)}, ${nb(`${VK} &lt; ${S}`)}이다. (우변이 0이면 한 점을 나타내고, 음수이면 나타내는 도형이 없다.)`,
                facts: { calc: [[`(${jn(A)}*${jn(A)}+${jn(Bc)}*${jn(Bc)})/4`, 1]], rule: 'cond-0' }
              });
            }
            const m = n === 1 ? d.pick([2, 3, 5, -2, -3, -5]) : d.pick([2, 3, 4, 5]), t = n === 1 ? nz(d, -6, 6) : d.int(3, 9), c0 = S - m * t;
            if (c0 === 0 || Math.abs(c0) > 60) return null;
            const left = poly([[1, X2], [1, Y2], [A, X], [Bc, Y], [m, VK], [c0, '']]);
            if (n === 1) {
              return ineqAns(`방정식 ${nb(`${left} = 0`)}이 원을 나타내도록 하는 실수 ${VK}의 값의 범위를 구하시오.`, m > 0 ? '<' : '>', t, VK, {
                explain: `완전제곱식으로 고치면 ${nb(`${stdL(p, q)} = ${poly([[-m, VK], [S - c0, '']])}`)}이다. 우변이 양수여야 하므로 ${nb(`${poly([[-m, VK], [S - c0, '']])} &gt; 0`)}, ${nb(`${VK} ${m > 0 ? '&lt;' : '&gt;'} ${iq(t)}`)}이다.${m < 0 ? ` ${VK}의 계수가 음수인 쪽을 넘기면 부등호의 방향이 바뀌지 않으나, 양변을 음수로 나누면 바뀐다.` : ''}`,
                facts: { calc: [[`((${jn(A)}*${jn(A)}+${jn(Bc)}*${jn(Bc)})/4-${jn(c0)})/${jn(m)}`, 1]], rule: 'cond-1' }
              });
            }
            return N(`방정식 ${nb(`${left} = 0`)}이 원을 나타내도록 하는 자연수 ${VK}의 개수는?`, t - 1, {
              explain: `완전제곱식으로 고치면 ${nb(`${stdL(p, q)} = ${poly([[-m, VK], [S - c0, '']])}`)}이다. 우변이 양수여야 하므로 ${nb(`${VK} &lt; ${t}`)}이고, 이를 만족시키는 자연수 ${VK}는 1부터 ${t - 1}까지 ${t - 1}개이다.`,
              facts: { value: `((${jn(A)}*${jn(A)}+${jn(Bc)}*${jn(Bc)})/4-${jn(c0)})/${jn(m)}-1`, rule: 'cond-2' }
            });
          }, { count: 3 }),
          T('gen-min-area', '반지름이 문자에 따라 달라지는 원 — 넓이가 가장 작을 때의 중심', '①15', (d) => {
            const u = nz(d, -2, 2), v = nz(d, -3, 3), e = d.int(0, 3), al = u * u + v * v - e, a0 = nz(d, -2, 2), m = d.int(1, 9);
            if (al <= 0 || (u === v)) return null;
            const f = 2 * al * a0, g = -al * a0 * a0 - m, VA2 = VA + sup(2);
            const left = poly([[1, X2], [1, Y2], [-2 * u, VA + X], [-2 * v, VA + Y], [e, VA2], [f, VA], [g, '']]);
            return pointAns(`원 ${nb(`${left} = 0`)}의 넓이가 가장 작을 때, 이 원의 중심의 좌표를 구하시오. (단, ${VA}는 실수이다.)`, u * a0, v * a0, {
              explain: `완전제곱식으로 고치면 ${nb(`${sqA(X, u)} + ${sqA(Y, v)} = ${poly([[al, VA2], [-f, VA], [-g, '']])}`)}이므로 중심은 ${pt(kA(u), kA(v))}이고 반지름의 길이의 제곱은 ${poly([[al, VA2], [-f, VA], [-g, '']])}이다. 이 식은 ${nb(`${al}(${VA} ${sgn(-a0)})${sup(2)} + ${m}`)}이므로 ${nb(`${VA} = ${iq(a0)}`)}일 때 반지름이 가장 짧아 넓이가 가장 작다. 이때 중심의 좌표는 ${pt(u * a0, v * a0)}이다.`,
              facts: { calc: [[`(0-${jn(-2 * u)}/2)*${jn(f)}/(2*(${jn(-2 * u)}*${jn(-2 * u)}/4+${jn(-2 * v)}*${jn(-2 * v)}/4-${e}))`, 0], [`(0-${jn(-2 * v)}/2)*${jn(f)}/(2*(${jn(-2 * u)}*${jn(-2 * u)}/4+${jn(-2 * v)}*${jn(-2 * v)}/4-${e}))`, 1]] }
            });
          })
        ]
      },
      // ── 조건을 만족시키는 원 ──
      {
        id: 'cond', title: '조건을 만족시키는 원', standard: S04,
        types: [
          T('cond-three-points', '원점과 두 점을 지나는 원의 방정식', '①16', (d) => {
            const p = nz(d, -4, 4), q = nz(d, -4, 4), R = p * p + q * q, on = lattice(R).map(([x, y]) => [x + p, y + q]).filter(([x, y]) => !(x === 0 && y === 0));
            if (on.length < 3) return null;
            const [P1, P2_] = d.shuffle(on).slice(0, 2);
            if (P1.some((v) => Math.abs(v) > 9) || P2_.some((v) => Math.abs(v) > 9) || (P1[0] === 0 && P2_[0] === 0)) return null;
            const [x1, y1] = P1, [x2, y2] = P2_, det = `(${jn(x1)}*${jn(y2)}-${jn(x2)}*${jn(y1)})`, s1 = `(${jn(x1)}*${jn(x1)}+${jn(y1)}*${jn(y1)})`, s2 = `(${jn(x2)}*${jn(x2)}+${jn(y2)}*${jn(y2)})`;
            return gen0Ans(`세 점 O(0, 0), ${P2('P', x1, y1)}, ${ej(P2('Q', x2, y2), '을/를')} 지나는 원의 방정식을 구하시오.`, -2 * p, -2 * q, {
              explain: `구하는 원을 ${GEN}이라 하면 원점을 지나므로 ${nb(`${V('C')} = 0`)}이다. 점 P, Q의 좌표를 대입하여 얻은 두 식 ${nb(`${x1 * x1 + y1 * y1} ${sgn(x1)}${V('A')} ${sgn(y1)}${V('B')} = 0`)}, ${nb(`${x2 * x2 + y2 * y2} ${sgn(x2)}${V('A')} ${sgn(y2)}${V('B')} = 0`)}을 연립하면 ${nb(`${V('A')} = ${iq(-2 * p)}`)}, ${nb(`${V('B')} = ${iq(-2 * q)}`)}이다. 따라서 ${genE(-2 * p, -2 * q, 0)}이다.`.replace(/\+ 1<i/g, '+ <i').replace(/− 1<i/g, '− <i'),
              facts: { calc: [[`(0-(${s1}*${jn(y2)}-${s2}*${jn(y1)}))/${det}`, 0], [`(0-(${jn(x1)}*${s2}-${jn(x2)}*${s1}))/${det}`, 1]] }
            });
          }),
          T('cond-center-axis', '중심이 좌표축 위에 있고 두 점을 지나는 원', '①17', (d, n) => {
            const c = nz(d, -5, 5), R = n === 0 ? d.pick(RICH.slice(0, 10)) : d.pick([8, 18, 20, 32, 40, 45, 50, 52, 68, 80]), on = lattice(R).map(([x, y]) => (n === 0 ? [x + c, y] : [x, y + c])).filter(([x, y]) => x !== 0 && y !== 0 && Math.abs(x) <= 9 && Math.abs(y) <= 9);
            if (on.length < 2) return null;
            const [P1, P2_] = d.shuffle(on).slice(0, 2), [x1, y1] = P1, [x2, y2] = P2_;
            if (n === 0) {
              if (x1 === x2) return null;
              const cExpr = `(${jn(x2)}*${jn(x2)}+${jn(y2)}*${jn(y2)}-${jn(x1)}*${jn(x1)}-${jn(y1)}*${jn(y1)})/(2*(${jn(x2)}-${jn(x1)}))`;
              return circXAns(`두 점 ${P2('A', x1, y1)}, ${ej(P2('B', x2, y2), '을/를')} 지나고 중심이 ${AXIS.x} 위에 있는 원의 방정식을 구하시오.`, c, R, {
                explain: `중심을 ${ej(P2('C', VA, 0), '이라/라')} 하면 ${nb('CA = CB')}이므로 ${nb(`(${iq(x1)} ${MINUS} ${VA})${sup(2)} + ${iq(y1 * y1)} = (${iq(x2)} ${MINUS} ${VA})${sup(2)} + ${iq(y2 * y2)}`)}에서 ${nb(`${VA} = ${iq(c)}`)}이다. 반지름의 길이의 제곱은 ${(x1 - c) ** 2} + ${y1 * y1} = ${R}이므로 ${stdE(c, 0, R)}이다.`,
                facts: { calc: [[`0-${cExpr}`, 0], [`(${jn(x1)}-${cExpr})*(${jn(x1)}-${cExpr})+${jn(y1)}*${jn(y1)}`, 1]] }
              });
            }
            if (y1 === y2) return null;
            const [k, s] = sqParts(R);
            if (k < 2 || s < 2) return null;
            const cExpr = `(${jn(x2)}*${jn(x2)}+${jn(y2)}*${jn(y2)}-${jn(x1)}*${jn(x1)}-${jn(y1)}*${jn(y1)})/(2*(${jn(y2)}-${jn(y1)}))`;
            return radNum(`두 점 ${P2('A', x1, y1)}, ${ej(P2('B', x2, y2), '을/를')} 지나고 중심이 ${AXIS.y} 위에 있는 원의 반지름의 길이는?`, k, s, {
              explain: `중심을 ${P2('C', 0, VB)}라 하면 ${nb('CA = CB')}이므로 ${nb(`${iq(x1 * x1)} + (${iq(y1)} ${MINUS} ${VB})${sup(2)} = ${iq(x2 * x2)} + (${iq(y2)} ${MINUS} ${VB})${sup(2)}`)}에서 ${nb(`${VB} = ${iq(c)}`)}이다. 반지름의 길이는 ${nb(`${rt(`${x1 * x1} + ${(y1 - c) ** 2}`)} = ${rt(R)} = ${radText(k, s)}`)}이다.`,
              facts: { calc: [[`((${jn(x1)}*${jn(x1)}+(${jn(y1)}-${cExpr})*(${jn(y1)}-${cExpr}))/${s})**0.5`, 0]], derived: [s], rr: [R, k, s] }
            });
          }, { count: 2 }),
          T('cond-center-line', '중심이 직선 위에 있고 두 점을 지나는 원', '①18', (d, n) => {
            const kk = n === 0 ? d.pick([2, 3, -2, -3, -1]) : 1, mm = n === 0 ? 0 : nz(d, -3, 3), c = nz(d, -3, 3), cy = kk * c + mm, R = d.pick(RICH.slice(0, 9));
            const on = lattice(R).map(([x, y]) => [x + c, y + cy]).filter(([x, y]) => x !== 0 && y !== 0 && Math.abs(x) <= 9 && Math.abs(y) <= 9);
            if (on.length < 2 || cy === 0 || Math.abs(cy) > 7) return null;
            const [[x1, y1], [x2, y2]] = d.shuffle(on).slice(0, 2), den = 2 * (x1 - x2) + 2 * kk * (y1 - y2);
            if (den === 0) return null;
            const lineText = n === 0 ? lineY(kk, 0) : lineY(1, mm);
            const cExpr = `(${jn(x1)}*${jn(x1)}+${jn(y1)}*${jn(y1)}-${jn(x2)}*${jn(x2)}-${jn(y2)}*${jn(y2)}-2*${jn(mm)}*(${jn(y1)}-${jn(y2)}))/(2*(${jn(x1)}-${jn(x2)})+2*${jn(kk)}*(${jn(y1)}-${jn(y2)}))`;
            const cent = n === 0 ? pt(VA, (kk === -1 ? MINUS : iq(kk)) + VA) : pt(VA, nb(`${VA} ${sgn(mm)}`));
            const head = `중심이 직선 ${lineText} 위에 있고 두 점 ${P2('A', x1, y1)}, ${ej(P2('B', x2, y2), '을/를')} 지나는 원`;
            const why = `중심을 ${ej(cent, '이라/라')} 하면 중심에서 두 점까지의 거리가 같으므로 ${VA}에 대한 일차방정식을 풀어 ${nb(`${VA} = ${iq(c)}`)}, 곧 중심은 ${pt(c, cy)}이다. 반지름의 길이의 제곱은 ${(x1 - c) ** 2} + ${(y1 - cy) ** 2} = ${R}이다.`;
            if (n === 0) {
              return circAns(`${head}의 방정식을 구하시오.`, c, cy, R, {
                explain: `${why} 따라서 ${stdE(c, cy, R)}이다.`,
                facts: { calc: [[`0-${cExpr}`, 0], [`0-${jn(kk)}*${cExpr}`, 1], [`(${jn(x1)}-${cExpr})*(${jn(x1)}-${cExpr})+(${jn(y1)}-${jn(kk)}*${cExpr})*(${jn(y1)}-${jn(kk)}*${cExpr})`, 2]] }
              });
            }
            const [k, s] = sqParts(R);
            if (s < 2) return null;
            return radNum(`${head}의 지름의 길이는?`, 2 * k, s, {
              explain: `${why} 반지름의 길이는 ${radText(k, s)}이므로 지름의 길이는 ${radText(2 * k, s)}이다.`,
              facts: { calc: [[`2*((${jn(x1)}-${cExpr})*(${jn(x1)}-${cExpr})+(${jn(y1)}-${cExpr}-${jn(mm)})*(${jn(y1)}-${cExpr}-${jn(mm)}))**0.5/${s}**0.5`, 0]], derived: [s], rr: [R, 2 * k, s] }
            });
          }, { count: 2 }),
          T('cond-both-axes-point', '두 좌표축에 동시에 접하고 한 점을 지나는 원', '①19', (d, n) => {
            const [p, q] = d.pick([[1, 2], [2, 1], [1, 8], [8, 1], [2, 4], [4, 2], [2, 9], [9, 2], [3, 6], [6, 3], [4, 8], [8, 4], [8, 9], [9, 8]]), sx = pm(d), sy = pm(d);
            const s = Math.sqrt(2 * p * q), r1 = p + q - s, r2 = p + q + s;
            if (r2 > 30) return null;
            const P0 = pt(sx * p, sy * q), quad = sx > 0 ? (sy > 0 ? '제1사분면' : '제4사분면') : (sy > 0 ? '제2사분면' : '제3사분면');
            const why = `점 ${ej(P0, '이/가')} ${quad} 위에 있으므로 원의 중심도 ${quad} 위에 있고, 반지름의 길이를 ${VR}라 하면 중심은 ${pt((sx < 0 ? MINUS : '') + VR, (sy < 0 ? MINUS : '') + VR)}이다. 점 ${ej(P0, '을/를')} 대입하면 ${nb(`(${p} ${MINUS} ${VR})${sup(2)} + (${q} ${MINUS} ${VR})${sup(2)} = ${VR}${sup(2)}`)}, ${nb(`${VR}${sup(2)} ${MINUS} ${2 * (p + q)}${VR} + ${p * p + q * q} = 0`)}이므로 ${nb(`${VR} = ${r1}`)} 또는 ${nb(`${VR} = ${r2}`)}이다.`;
            if (n === 0) {
              return M(`점 ${ej(P0, '을/를')} 지나고 ${AXIS.x}과 ${AXIS.y}에 동시에 접하는 원은 2개이다. 이 두 원의 반지름의 길이를 각각 구하시오.`, [{ answer: r1 }, { answer: r2 }], {
                unordered: true, shown: `${r1}, ${r2}`, explain: why,
                facts: { calc: [[`${p}+${q}-(2*${p}*${q})**0.5`, 0], [`${p}+${q}+(2*${p}*${q})**0.5`, 1]] }
              });
            }
            return radNum(`점 ${ej(P0, '을/를')} 지나고 ${AXIS.x}과 ${AXIS.y}에 동시에 접하는 두 원의 중심 사이의 거리는?`, r2 - r1, 2, {
              explain: `${why} 두 원의 중심 사이의 거리는 ${nb(`${rt(2)} × |${r2} ${MINUS} ${r1}|`)} = ${radText(r2 - r1, 2)}이다.`,
              facts: { calc: [[`2*(2*${p}*${q})**0.5`, 0], ['2', 1]] }
            });
          }, { count: 2 }),
          T('cond-xaxis-tangent-point', 'x축 위의 접점과 한 점이 주어진 원', '①20', (d) => {
            const p = nz(d, -5, 5), k = pm(d) * d.int(2, 7), R = k * k;
            const on = lattice(R).filter(([dx, dy]) => dx !== 0 && k + dy !== 0).map(([dx, dy]) => [p + dx, k + dy]).filter(([x, y]) => Math.abs(x) <= 9 && Math.abs(y) <= 13);
            if (!on.length) return null;
            const [s, t] = d.pick(on);
            return N(`점 ${pt(p, 0)}에서 ${AXIS.x}에 접하고 점 ${ej(pt(s, t), '을/를')} 지나는 원의 넓이는?`, R, {
              unit: 'π',
              explain: `점 ${pt(p, 0)}에서 ${AXIS.x}에 접하므로 중심을 ${ej(pt(p, VK), '이라/라')} 하면 반지름의 길이는 ${nb(`|${VK}|`)}이다. ${nb(`${sqT(X, p)} + (${Y} ${MINUS} ${VK})${sup(2)} = ${VK}${sup(2)}`)}에 점 ${ej(pt(s, t), '을/를')} 대입하면 ${nb(`${VK} = ${iq(k)}`)}이다. 따라서 넓이는 ${R}π이다.`,
              facts: { value: `((${jn(s)}-${jn(p)})*(${jn(s)}-${jn(p)})+${jn(t)}*${jn(t)})*((${jn(s)}-${jn(p)})*(${jn(s)}-${jn(p)})+${jn(t)}*${jn(t)})/(4*${jn(t)}*${jn(t)})` }
            });
          }),
          T('cond-line-xtangent', '중심이 직선 위에 있고 x축 위의 점에서 접하는 원', '①21', (d) => {
            const m = nz(d, -3, 3), nn = nz(d, -6, 6), p = nz(d, -5, 5), r = m * p + nn;
            if (r === 0 || Math.abs(r) > 9) return null;
            return N(`중심이 직선 ${lineY(m, nn)} 위에 있는 원이 ${AXIS.x}에 접하고 점 ${ej(pt(p, 0), '을/를')} 지날 때, 이 원의 반지름의 길이는?`, Math.abs(r), {
              explain: `${AXIS.x}에 접하는 원은 ${AXIS.x}과 한 점에서만 만나므로, 원이 지나는 ${AXIS.x} 위의 점 ${ej(pt(p, 0), '이/가')} 곧 접점이다. 따라서 중심의 ${X}좌표는 ${iq(p)}이고, 중심은 직선 위에 있으므로 ${Y}좌표는 ${nb(`${iq(m)} × ${iq(p).replace(MINUS, '(' + MINUS) + (p < 0 ? ')' : '')} ${sgn(nn)} = ${iq(r)}`)}이다. 반지름의 길이는 중심의 ${Y}좌표의 절댓값인 ${Math.abs(r)}이다.`,
              facts: { value: r > 0 ? `${jn(m)}*${jn(p)}+${jn(nn)}` : `0-(${jn(m)}*${jn(p)}+${jn(nn)})` }
            });
          }),
          T('cond-far-near', '원 밖의 한 점과 원 위의 점 사이의 거리의 최댓값과 최솟값', '①24', (d) => {
            const [u, v, dd] = d.pick(PYTH), su = pm(d), sv = pm(d), atO = d.bool(), x0 = atO ? 0 : nz(d, -3, 3), y0 = atO ? 0 : nz(d, -3, 3);
            const p = x0 + su * u, q = y0 + sv * v, r = d.int(1, dd - 1), [A, Bc, Cc] = toGen(p, q, r * r);
            if (Math.abs(p) > 9 || Math.abs(q) > 9) return null;
            const head = atO ? `원점 O와 원 ${genE(A, Bc, Cc)} 위의 점 P에 대하여 선분 OP` : `점 ${ej(P2('A', x0, y0), '과/와')} 원 ${genE(A, Bc, Cc)} 위의 점 P에 대하여 선분 AP`;
            const who = atO ? '원점' : '점 A', whoJ = (pair) => (atO ? ej('원점', pair) : ej('점 A', pair));
            return M(`${head}의 길이의 최댓값과 최솟값을 구하시오.`, [{ lead: '최댓값:', answer: dd + r }, { lead: '최솟값:', answer: dd - r }], {
              shown: `최댓값 ${dd + r}, 최솟값 ${dd - r}`,
              explain: `원을 변형하면 ${stdE(p, q, r * r)}이므로 중심은 ${pt(p, q)}, 반지름의 길이는 ${r}이다. ${whoJ('과/와')} 중심 사이의 거리는 ${nb(`${rt(`${u * u} + ${v * v}`)} = ${dd}`)}이고 ${whoJ('이/가')} 원 밖에 있으므로, 최댓값은 ${dd} + ${r} = ${dd + r}, 최솟값은 ${dd} ${MINUS} ${r} = ${dd - r}이다.`,
              facts: { calc: [[`((${jn(x0)}+${jn(A)}/2)*(${jn(x0)}+${jn(A)}/2)+(${jn(y0)}+${jn(Bc)}/2)*(${jn(y0)}+${jn(Bc)}/2))**0.5+(${jn(A)}*${jn(A)}/4+${jn(Bc)}*${jn(Bc)}/4-${jn(Cc)})**0.5`, 0], [`((${jn(x0)}+${jn(A)}/2)*(${jn(x0)}+${jn(A)}/2)+(${jn(y0)}+${jn(Bc)}/2)*(${jn(y0)}+${jn(Bc)}/2))**0.5-(${jn(A)}*${jn(A)}/4+${jn(Bc)}*${jn(Bc)}/4-${jn(Cc)})**0.5`, 1]] }
            });
          }),
          T('cond-ratio-locus', '두 점에서의 거리의 비가 일정한 점이 그리는 도형', '①26', (d, n) => {
            if (n === 0) {
              // PA : PB = 2 : 1 (또는 1 : 2)
              const ax = d.int(-5, 5), ay = d.int(-5, 5), bx = ax + 3 * nz(d, -2, 2), by = ay + 3 * d.int(-2, 2), flip = d.bool();
              const [Ax, Ay, Bx, By] = flip ? [bx, by, ax, ay] : [ax, ay, bx, by];
              // PA = 2PB 인 쪽: far = A, near = B
              const [fx, fy, nx, ny] = flip ? [Bx, By, Ax, Ay] : [Ax, Ay, Bx, By];
              const cxv = (4 * nx - fx) / 3, cyv = (4 * ny - fy) / 3, R = cxv * cxv + cyv * cyv - (4 * (nx * nx + ny * ny) - (fx * fx + fy * fy)) / 3;
              if (cxv === 0 || cyv === 0 || Math.abs(cxv) > 12 || Math.abs(cyv) > 12 || R <= 0 || R > 200) return null;
              const ratio = flip ? '1 : 2' : '2 : 1';
              return circAns(`두 점 ${P2('A', Ax, Ay)}, ${P2('B', Bx, By)}에서의 거리의 비가 ${ratio}인 점 P가 나타내는 도형의 방정식을 구하시오.`, cxv, cyv, R, {
                explain: `${nb(`PA : PB = ${ratio}`)}이므로 ${flip ? nb('2PA = PB') : nb('PA = 2PB')}이다. 점 P의 좌표를 ${pt(X, Y)}라 하고 양변을 제곱하여 정리하면 ${nb(`${X2} + ${Y2} ${sgn(-2 * cxv)}${X} ${sgn(-2 * cyv)}${Y} ${sgn(cxv * cxv + cyv * cyv - R)} = 0`)}, 곧 ${stdE(cxv, cyv, R)}이다.`,
                facts: { calc: [[`0-(4*${jn(nx)}-${jn(fx)})/3`, 0], [`0-(4*${jn(ny)}-${jn(fy)})/3`, 1], [`((4*${jn(nx)}-${jn(fx)})*(4*${jn(nx)}-${jn(fx)})+(4*${jn(ny)}-${jn(fy)})*(4*${jn(ny)}-${jn(fy)}))/9-(4*(${jn(nx)}*${jn(nx)}+${jn(ny)}*${jn(ny)})-(${jn(fx)}*${jn(fx)}+${jn(fy)}*${jn(fy)}))/3`, 2]], derived: [3, 9] }
              });
            }
            // 두 가게의 1 km당 배송료가 k배일 때 배송료가 같은 지점
            const k = d.pick([2, 3]), dd = k === 2 ? 3 * d.int(1, 4) : 4 * d.int(1, 3), price = d.pick([500, 1000, 1500]);
            const cxv = dd * (k * k + 1) / (k * k - 1), R = (2 * k * dd / (k * k - 1)) ** 2;
            return circXAns(`좌표평면 위의 두 지점 ${P2('A', -dd, 0)}, ${P2('B', dd, 0)}에 물류 회사가 있다. 회사 A는 1 km당 ${price}원, 회사 B는 1 km당 ${price * k}원의 배송료를 받는다. 두 회사로부터 받는 배송료가 같은 지점 P가 나타내는 도형의 방정식을 구하시오. (단, 좌표의 단위는 km이고, 건물의 크기는 생각하지 않는다.)`, cxv, R, {
              explain: `배송료가 같으므로 ${nb(`${price} × PA = ${price * k} × PB`)}, 곧 ${nb(`PA = ${k}PB`)}이다. 점 P를 ${pt(X, Y)}라 하고 양변을 제곱하면 ${nb(`(${X} + ${dd})${sup(2)} + ${Y2} = ${k * k}{(${X} ${MINUS} ${dd})${sup(2)} + ${Y2}}`)}이고, 정리하면 ${stdE(cxv, 0, R)}이다.`,
              facts: { calc: [[`0-${dd}*(${price * k}/${price}*${price * k}/${price}+1)/(${price * k}/${price}*${price * k}/${price}-1)`, 0], [`(2*${price * k}/${price}*${dd}/(${price * k}/${price}*${price * k}/${price}-1))*(2*${price * k}/${price}*${dd}/(${price * k}/${price}*${price * k}/${price}-1))`, 1]] }
            });
          }, { count: 2 }),
          T('cond-two-circles-line', '두 원의 넓이를 동시에 이등분하는 직선', '①27', (d) => {
            const p1 = d.int(-5, 5), q1 = d.int(-5, 5), dx = nz(d, -4, 4), m = nz(d, -3, 3), p2 = p1 + dx, q2 = q1 + m * dx, nn = q1 - m * p1;
            if (nn === 0 || Math.abs(p2) > 6 || Math.abs(q2) > 8 || (p1 === 0 && q1 === 0) || (p2 === 0 && q2 === 0)) return null;
            const r1 = d.int(1, 4), r2 = d.int(1, 4), [A1, B1, C1] = toGen(p1, q1, r1 * r1), [A2, B2, C2] = toGen(p2, q2, r2 * r2);
            return lineAns(`두 원 ${genE(A1, B1, C1)}, ${genE(A2, B2, C2)}의 넓이를 동시에 이등분하는 직선의 방정식을 구하시오.`, m, nn, {
              explain: `원의 넓이를 이등분하는 직선은 원의 중심을 지나므로, 구하는 직선은 두 원의 중심 ${pt(p1, q1)}, ${ej(pt(p2, q2), '을/를')} 지나는 직선이다. 기울기는 ${nb(`(${iq(q2)} ${MINUS} ${iq(q1).replace(MINUS, '(' + MINUS) + (q1 < 0 ? ')' : '')}) ÷ (${iq(p2)} ${MINUS} ${iq(p1).replace(MINUS, '(' + MINUS) + (p1 < 0 ? ')' : '')}) = ${iq(m)}`)}이므로 ${lineY(m, nn)}이다.`,
              facts: { calc: [[`(${jn(B2)}-${jn(B1)})/(${jn(A2)}-${jn(A1)})`, 0], [`0-${jn(B1)}/2+(${jn(B2)}-${jn(B1)})/(${jn(A2)}-${jn(A1)})*${jn(A1)}/2`, 1]] }
            });
          }),
          T('cond-centers-line-back', '두 원의 중심을 지나는 직선이 주어질 때 미지수', '①28', (d) => {
            const p = d.int(-4, 4), q = d.int(-4, 4), t = d.pick([1, 2, 3, -1, -2, -3]), k0 = nz(d, -3, 3), r1 = d.int(2, 4), s = d.int(1, 9);
            const ux = k0 - p, uy = t * k0 - q;
            if (ux === 0 && uy === 0) return null;
            const g = gcd(Math.abs(uy), Math.abs(ux)) || 1;
            let a = uy / g, b = -ux / g; if (a < 0 || (a === 0 && b < 0)) { a = -a; b = -b; }
            const c = -(a * p + b * q);
            if (a + b * t === 0 || c === 0 || a === 0 || b === 0 || (p === 0 && q === 0)) return null;
            const [A1, B1, C1] = toGen(p, q, r1 * r1), VK2 = VK + sup(2);
            const second = nb(`${poly([[1, X2], [1, Y2], [-2, VK + X], [-2 * t, VK + Y], [1 + t * t, VK2], [-s, '']])} = 0`);
            return N(`두 원 ${genE(A1, B1, C1)}, ${second}의 중심을 지나는 직선의 방정식이 ${lineG(a, b, c)}일 때, 상수 ${VK}의 값은?`, k0, { signed: true,
              explain: `첫째 원은 ${stdE(p, q, r1 * r1)}이므로 중심은 ${pt(p, q)}이고 직선 위에 있다. 둘째 원은 ${nb(`(${X} ${MINUS} ${VK})${sup(2)} + (${Y} ${MINUS} ${t === 1 ? '' : t === -1 ? MINUS : iq(t)}${VK})${sup(2)} = ${s}`)}이므로 중심 ${ej(pt(VK, (t === 1 ? '' : t === -1 ? MINUS : iq(t)) + VK), '이/가')} 직선 위에 있다. 대입하면 ${nb(`${iq(a + b * t)}${VK} ${sgn(c)} = 0`)}, ${nb(`${VK} = ${iq(k0)}`)}이다.`,
              facts: { value: `(0-${jn(c)})/(${jn(a)}+${jn(b)}*(0-${jn(-2 * t)})/2)` }
            });
          })
        ]
      }
    ]
  });

  B.kit.m1022 = {
    S04, S05, sourceOf, stripH, visible, seal, retry, T, H, X, Y, X2, Y2, VA, VB, VC, VK, VM, VN, VR, VP, VQ, VS, VT, iq, jn, sgn, cx, pt, P2, sqT, stdL, stdE, genL, genE, toGen,
    lineY, lineG, STD, GEN, endJ, ej, NOTE1, isSq, sqf, lattice, RICH, PYTH, circAns, circ0Ans, circXAns, gen0Ans, centerRadAns, valsQ, twoValsAns, lineAns, radNum, rootText,
    cfig, fig, figOk, picks, span, signedText, AXIS, CIRC, kA, sqA
  };
})(typeof window !== 'undefined' ? window : globalThis);
