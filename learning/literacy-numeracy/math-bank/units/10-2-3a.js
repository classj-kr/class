// 고등학교 1학년 2학기(공통수학2) Ⅰ-3 도형의 이동 — 단원 틀·이 단원의 도구와 앞쪽 묶음(점의 평행이동, 도형의 평행이동, 평행이동과 위치 관계).
// 수집해 둔 천재 T셀파 공통수학2 두 종(홍진곤, 전인태 — 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록
// (기본꼴_1: 32꼴 — 평행이동, 기본꼴_2: 45꼴 — 대칭이동·이동 잇기·최단 거리, 심화꼴: 3꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/10-2-3/싣기_대조표.md 에 있다.
// (점의 대칭이동, 도형의 대칭이동, 이동 잇기, 최단 거리는 10-2-3b.js 에, 실력 문항은 10-2-3c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 성취기준은 10공수2-01-06(평행이동)과 10공수2-01-07(원점, x축, y축, 직선 y = x에 대한 대칭이동)이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(점·직선·원·일반형 원·두 점으로 정한 이동·두 원으로 정한 이동), 묻는 것(옮긴 점·식·이동의 양·미지수·거리·
//    처음 도형), 이어지는 단계(접할 조건, 넓이 이등분, 무게중심, 교점)가 다르면 따로 싣는다. 수와 상황만 다른 꼴은 한 번만 싣는다.
//  - 교육과정: 「좌표축의 평행이동은 다루지 않는다」 — 수집본에도 없다. 대칭이동은 원점, x축, y축, 직선 y = x 넷만 다룬다(다른 직선에 대한 대칭은 싣지 않는다).
//    두 원의 위치 관계(내접·외접)는 교육과정과 두 교과서에 없어 그것으로 푸는 꼴은 싣지 않았다. 이차함수 그래프의 평행이동 그 자체는 중3 단원의 일이다.
//  - 답: 점은 「([±][ ], [±][ ])」, 직선은 「y = [±][ ]x [±][ ]」(기울기의 절댓값이 2 이상인 정수, y절편이 0이 아닌 정수가 되게 수를 고른다 —
//    일반형 ax + by + c = 0은 상수배가 모두 같은 직선이라 칸으로 받지 않는다), 원은 「(x [±][ ])² + (y [±][ ])² = [ ]」(중심의 두 좌표가 0이 아니게),
//    미지수·이동의 양은 부호 단추가 붙은 칸, 거리·넓이·반지름은 단추 없는 칸, 근호가 든 값은 「[±][ ]√[ ]」로 받는다. 한 유형 안에서는 칸의 모양이 같다.
//    「모두 구하시오」로 답이 둘인 꼴은 「a = [ ] 또는 a = [ ]」(차례 없음)로, 원문의 「a + b」「ab」「m + n」처럼 따로 구한 값을 더하거나 곱한 꼴은 값을 칸마다 따로 묻는다.
//  - 답은 모두 코드가 셈한다. 원문 답은 따르지 않는다(원문이 어긋난 곳은 꼴 목록 머리에 적었다).
//
// 뺀 것과 까닭(10-2-3b.js, 10-2-3c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 그림을 끝내 알 수 없는 것: ①9(장기 상(象)이 갈 수 있는 점 — 장기판의 다른 기물 자리를 그림에서 다 읽을 수 없고, 어려움이 놀이 규칙에서 온다).
//  - 범위 밖: ①27(평행이동한 원이 다른 원과 한 점에서 만남 — 두 원의 내접·외접은 2022 교육과정과 두 교과서에 없다),
//    ②25(직선 2x + y − 10 = 0에 대한 대칭 — 원점·x축·y축·y = x 넷 밖), ①32(이차함수 그래프의 평행이동 그대로 — 중3 9-1-6).
//  - 놀이·활동·작도·서술: ②44(점 옮기기 게임, 쪽매 맞춤, 행동 카드 — 답이 하나로 정해지지 않는다), ②45(대칭인 도형 그리기),
//    ②21의 전교 마09⑵(선분 PQ가 가장 짧아지는 경우를 말로 쓰기 — ⑴·⑶은 실었다), ①25의 변형(중심 (a, b)인 원이 두 축에 접하는 (a, b) — 원의 방정식 단원의 일).
//  - 겹침(하는 일이 이미 실은 유형과 같다): 심1(→ pfig-line#2), ①1의 아바타 방향 키(→ pmove-point), ②3의 사각형·차례로 대칭한 삼각형(→ smove-area),
//    ②17의 점과의 거리(→ sfig-tangent), ②35·②36·②38의 실생활 판(산책로·공장·아파트·전시실·당구대 → 좌표로 준 판), ②39의 꺾이는 점의 좌표(→ hard-bounce),
//    ①14의 원점을 지나는 판·①18의 홍중5(→ 같은 유형), ①24의 「양수 a」「음수 k」로 하나를 고르는 판(→ 두 값을 모두 묻는 판), ②26의 전중05(→ mix-twice#1).
// 바꾼 것(원문 그대로는 답 칸이 정해지지 않거나 답이 늘 같은 것)
//  - ①17 관계식·(a, b) 셋 찾기 → 될 수 있는 (a, b) 고르기. ①26 a = −1/2 같은 분수 답 → 주어진 직선의 기울기를 ±1/k로 골라 정수.
//    ①18의 홍대10 「2x + ay = 3 → 2x + y + b = 0」(a는 늘 1) → 상수항만 묻는 첫째 차례. ①19 a + b 값·보기 → 옮긴 직선의 방정식.
//    ①20 p + q → 거리 k√S 를 칸으로. ①31 C, D의 좌표 → D의 x좌표. ②12 표 채우기 → 구체적인 직선에 대한 문장 고르기.
//    ②18 교점의 개수(답 0이 나온다) → 위치 관계 셋 가운데 고르기. ②22 한 직선의 두 대칭이 수직(답이 늘 a = 1) → 두 직선을 각각 대칭이동.
//    ②28 분수 답(−9/2, 2/3) → 정수가 되게 수를 고름. ②33 답이 y = −1(기울기 0) → 기울기가 정수인 판. ②34 그림 모름인 전중17의 f(y + 1, x) → 홍교 점9의 꺾인 선 그림으로.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, inline } = B.kit;
  const { LAB, MINUS, gcd, Q, tx, nb, tail, V, sup, poly, pointAns, plane, rt, grp, sqParts, radText, radAns, ansV } = B.kit.mid;
  const UNIT = '10-2-3', S06 = '10공수2-01-06', S07 = '10공수2-01-07';

  // ── 검사 근거 마무리 ──
  // 문항에서 보이는 수(검사와 같은 방법으로 읽는다): 글·그림(그림 설명 포함)·보기
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 0과 1(적지 않는 계수)과 facts.derived 로 밝히기로 한 수만 된다.
  // (그 밖의 수가 나오면 문항을 잘못 지은 것이므로 오류를 낸다.)
  function seal(item) {
    const f = item.facts || {}, derived = new Set((f.derived || []).map(Number).concat([0, 1])), shown = visibleNumbers(item), out = new Set(f.unseen || []);
    const exprs = (f.calc || []).map(([t]) => t).concat(f.value !== undefined ? [f.value] : [], (f.choose && f.choose.exprs) || [], f.pick ? [f.pick.expr] : []);
    for (const t of exprs) for (const n of String(t).match(/\d+(?:\.\d+)?/g) || []) {
      if (shown.has(n)) continue;
      if (!derived.has(Number(n))) throw new Error('검사 식의 수 ' + n + ' 이 글에도 밝힌 수에도 없다: ' + t);
      out.add(Number(n));
    }
    delete f.derived;
    if (out.size) f.unseen = [...out]; else delete f.unseen;
    item.facts = f;
    return item;
  }
  // 만들기가 null 을 돌려주면 다시 만든다. 그림을 휴대폰 너비에 맞게 그릴 수 없을 때(그림이 null)도 다시 만든다.
  const retry = (make) => (d, n) => { for (let i = 0; i < 4000; i += 1) { const item = make(d, n); if (item && item.figure !== null) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const srcOf = (ref) => (/^심/.test(ref) ? '수집본 심화 자료(' : '수집본 기본 자료(') + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: srcOf(ref), make: retry(make) }, more || {});

  // ── 글 ──
  const X = V('x'), Y = V('y'), XA = X + '축', YA = Y + '축', X2 = X + sup(2), Y2 = Y + sup(2);
  const VA = V('a'), VB = V('b'), VC = V('c'), VK = V('k'), VM = V('m'), VN = V('n'), VR = V('r'), VL = V('l');
  const sn = (v) => (v < 0 ? MINUS + Math.abs(v) : String(v));            // 화면의 정수: −3, 3
  const par = (v) => (v < 0 ? '(' + sn(v) + ')' : sn(v));                  // 식 속의 정수: (−3)
  const J = (v) => (v < 0 ? '(' + v + ')' : String(v));                    // 검사 식의 정수: (-3)
  const pt = (x, y) => nb(`(${sn(x)}, ${sn(y)})`);
  // 식·좌표·낱말 뒤에 토씨를 붙인다. 끝소리로 고른다: 숫자는 읽는 소리(분수는 분자, 근호는 근호 안의 수), 위첨자 2는 「제곱」,
  // 문자 m·n·l 은 받침이 있고 나머지 문자는 없다, 한글은 그 글자.
  function jw(h, pair) {
    const [withB, without] = pair.split('/');
    const flat = String(h).replace(/<sup>[^<]*<\/sup>/g, '²').replace(/<span class="mb-frac"><span>([^<]*)<\/span><span class="mb-frac-bar">\/<\/span><span>[^<]*<\/span><\/span>/g, '$1')
      .replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, '').replace(/[\s)\]]+$/, '');
    const last = flat.slice(-1);
    if (/\d/.test(last)) return h + tail(Number(/\d+$/.exec(flat)[0]), pair);
    let bat, rieul = false;
    if (last === '²') bat = true;
    else if (/[A-Za-z]/.test(last)) { bat = /[LMNlmn]/.test(last); rieul = /[Ll]/.test(last); }
    else { const code = last.charCodeAt(0) - 0xAC00, t = code >= 0 && code <= 11171 ? code % 28 : 0; bat = t !== 0; rieul = t === 8; }
    if (withB === '으로') return h + (bat && !rieul ? '으로' : '로');
    return h + (bat ? withB : without);
  }
  // 문자 v 에서 수 k 를 뺀 식: x − 3, x + 2(k 가 음수), k = 0 이면 x
  const minus = (v, k) => (k === 0 ? v : `${v} ${k > 0 ? MINUS : '+'} ${Math.abs(k)}`);
  // 원 (x − p)² + (y − q)² = r²
  const sq = (v, p) => (p === 0 ? v + sup(2) : `(${minus(v, p)})${sup(2)}`);
  const circ = (p, q, r2) => nb(`${sq(X, p)} + ${sq(Y, q)} = ${r2}`);
  const gcirc = (A, Bc, Cc) => nb(poly([[1, X2], [1, Y2], [A, X], [Bc, Y], [Cc, '']]) + ' = 0');
  // 직선: 일반형 ax + by + c = 0, 기울기 꼴 y = mx + n(m 은 정수나 유리수)
  const gline = ([a, b, c]) => nb(poly([[a, X], [b, Y], [c, '']]) + ' = 0');
  const sline = (m, n) => nb(`${Y} = ${poly([[m, X], [n, '']])}`);
  // 평행이동의 말: x축의 방향으로 a만큼, y축의 방향으로 b만큼(0인 쪽은 적지 않는다)
  const mv = (a, b) => [a !== 0 ? `${XA}의 방향으로 ${sn(a)}만큼` : '', b !== 0 ? `${YA}의 방향으로 ${sn(b)}만큼` : ''].filter(Boolean).join(', ');
  // 평행이동에서 대입하는 말: x 대신 x − a를, y 대신 y − b를 대입하면
  const subMove = (a, b) => [a !== 0 ? `${X} 대신 ${jw(minus(X, a), '을/를')}` : '', b !== 0 ? `${Y} 대신 ${jw(minus(Y, b), '을/를')}` : ''].filter(Boolean).join(', ') + ' 대입하면';
  // 대칭이동: x 축(x), y 축(y), 원점(o), 직선 y = x(d)
  const MNAME = { x: XA, y: YA, o: '원점', d: '직선 ' + nb(`${Y} = ${X}`) };
  const MIRROR = { x: ([u, v]) => [u, -v], y: ([u, v]) => [-u, v], o: ([u, v]) => [-u, -v], d: ([u, v]) => [v, u] };
  const subMirror = { x: `${Y} 대신 ${MINUS}${Y}를 대입하면`, y: `${X} 대신 ${MINUS}${X}를 대입하면`, o: `${X} 대신 ${MINUS}${X}, ${Y} 대신 ${MINUS}${Y}를 대입하면`, d: `${X} 대신 ${Y}, ${Y} 대신 ${X}를 대입하면` };
  const ptRule = { x: '(x, −y)', y: '(−x, y)', o: '(−x, −y)', d: '(y, x)' };
  // 검사 식으로 적은 좌표의 대칭이동(글에 적힌 수로 셈하게)
  const MIRROR_E = { x: ([u, v]) => [u, `(0-${v})`], y: ([u, v]) => [`(0-${u})`, v], o: ([u, v]) => [`(0-${u})`, `(0-${v})`], d: ([u, v]) => [v, u] };
  // 직선 [a, b, c](ax + by + c = 0)의 이동
  const lineMove = ([a, b, c], p, q) => [a, b, c - a * p - b * q];
  const LINE_MIRROR = { x: ([a, b, c]) => [a, -b, c], y: ([a, b, c]) => [-a, b, c], o: ([a, b, c]) => [-a, -b, c], d: ([a, b, c]) => [b, a, c] };
  // 일반형을 기울기 꼴로: [m, n](정수가 아니면 null)
  const toSlope = ([a, b, c]) => { if (b === 0) return null; const m = -a / b, n = -c / b; return Number.isInteger(m) && Number.isInteger(n) ? [m + 0, n + 0] : null; };
  const nz = (d, lo, hi) => d.until(() => d.int(lo, hi), (v) => v !== 0);
  const pm = (d) => (d.bool() ? 1 : -1);
  const isSq = (n) => Number.isInteger(Math.sqrt(n));

  // ── 답 ──
  // 직선 y = mx + n: 「y = [±][ ]x [±][ ]」. m 은 절댓값 2 이상인 정수(1을 적을지 헷갈리지 않게), n 은 0이 아닌 정수.
  function lineAns(text, m, n, o) {
    if (!Number.isInteger(m) || !Number.isInteger(n) || Math.abs(m) < 2 || n === 0) throw new Error('직선 답: 기울기는 절댓값이 2 이상인 정수, y절편은 0이 아닌 정수');
    return inline(text, grp(`${Y} = {0}${X}`) + ' ' + grp('{1}'), [{ answer: m, signed: true }, { answer: n, signed: true }], Object.assign({}, o, { shown: sline(m, n) }));
  }
  // 원 (x − p)² + (y − q)² = r²: 「(x [±][ ])² + (y [±][ ])² = [ ]」. p, q 는 0이 아닌 정수.
  function circAns(text, p, q, r2, o) {
    if (!Number.isInteger(p) || !Number.isInteger(q) || p === 0 || q === 0 || !Number.isInteger(r2) || r2 < 1) throw new Error('원 답: 중심의 두 좌표는 0이 아닌 정수');
    return inline(text, grp(`(${X} {0})${sup(2)}`) + ' + ' + grp(`(${Y} {1})${sup(2)}`) + ' ' + grp('= {2}'), [{ answer: -p, signed: true }, { answer: -q, signed: true }, { answer: r2 }], Object.assign({}, o, { shown: circ(p, q, r2) }));
  }
  // 문자의 값 여럿: 「a = [±][ ]  b = [±][ ]」. pairs: [[문자 글, 값, 부호 단추를 뺄까]]
  const vals = (text, pairs, o) => M(text, pairs.map(([name, answer, bare]) => ({ lead: name + ' =', answer, signed: !bare })), Object.assign({}, o, { shown: pairs.map(([name, v]) => nb(`${name} = ${sn(v)}`)).join(', ') }));
  // 답이 둘인 꼴: 「a = [±][ ] 또는 a = [±][ ]」(차례는 따지지 않는다)
  // (두 값의 부호를 함께 바꾼 답이 같은 짝이 되면 부호를 가리지 못하므로 다시 만든다 — null)
  const two = (text, name, v1, v2, o) => (v1 === v2 || v1 === -v2 ? null : inline(text, grp(`${name} = {0}`) + ' 또는 ' + grp(`${name} = {1}`), [{ answer: v1, signed: true }, { answer: v2, signed: true }],
    Object.assign({}, o, { unordered: true, shown: `${nb(name + ' = ' + sn(v1))} 또는 ${nb(name + ' = ' + sn(v2))}` })));
  // 근호 a√b 의 글(a = 1 이면 √b, b = 1 이면 수)
  const rad = (n) => { const [a, b] = sqParts(n); return radText(a, b); };
  // 넷 가운데 둘을 「모두 고른 것」으로 묻는다(flags 의 참이 꼭 둘)
  const GANA = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'];
  function pairPick(d, text, rows, flags, o) {
    const yes = [0, 1, 2, 3].filter((i) => flags[i]), no = [0, 1, 2, 3].filter((i) => !flags[i]);
    if (yes.length !== 2) return null;
    const [p, q] = d.shuffle(no);
    const pairs = d.shuffle([yes, no, [yes[0], p], [yes[1], q]].map((pair) => pair.slice().sort((u, v) => u - v))), right = (pair) => pair.every((i) => flags[i]);
    return C(text, pairs.map((pair) => pair.map((i) => GANA[i]).join(', ')), pairs.findIndex(right), {
      figure: lines(rows.map((r, i) => `${GANA[i]}. ${r}`)), explain: o.explain, facts: { truth: pairs.map(right), want: true }
    });
  }

  // 그림: 점(이름, [x, y])들과 직선 y = x(diag), 직선 y = c(hline)가 있는 좌표평면. 범위는 점이 들어가게 잡는다.
  function ptsFig(P, o) {
    const opt = o || {}, xs = P.map((p) => p[1][0]).concat([0]), ys = P.map((p) => p[1][1]).concat([0].concat(opt.hline != null ? [opt.hline] : []));
    const x = [Math.min(...xs) - 1, Math.max(...xs) + 1], y = [Math.min(...ys) - 1, Math.max(...ys) + 1];
    if (opt.square) { const lo = Math.min(x[0], y[0]), hi = Math.max(x[1], y[1]); x[0] = y[0] = lo; x[1] = y[1] = hi; }
    const span = Math.max(x[1] - x[0], y[1] - y[0]);
    // 모눈이 열 칸을 넘으면 그림이 휴대폰 문항 칸(290px)보다 넓어진다 — 수를 다시 고르게 null
    if (span > 10) return null;
    const lns = (opt.diag ? [{ a: 1, b: 0 }] : []).concat(opt.hline != null ? [{ a: 0, b: opt.hline }] : []);
    const ticks = opt.hline != null ? Array.from({ length: Math.max(x[1], y[1]) - Math.min(x[0], y[0]) + 1 }, (_, i) => Math.min(x[0], y[0]) + i).filter((v) => v !== opt.hline) : 'all';
    return plane({ x, y, ticks, points: P.map(([name, [px, py], side]) => ({ x: px, y: py, name, side: side || 'ur' })), lines: lns });
  }

  // ── 가. 점의 평행이동 ──
  const pmoveTypes = [
    T('pmove-point', '점을 평행이동한 점의 좌표', '①1', (d) => {
      const x = nz(d, -6, 6), y = nz(d, -6, 6), a = nz(d, -6, 6), b = nz(d, -6, 6), u = x + a, v = y + b;
      return pointAns(`점 ${jw(pt(x, y), '을/를')} ${mv(a, b)} 평행이동한 점의 좌표는?`, u, v, {
        explain: `점 (${X}, ${Y})를 ${mv(a, b)} 평행이동한 점은 ${nb(`(${minus(X, -a)}, ${minus(Y, -b)})`)}이므로 ${nb(`(${sn(x)} + ${par(a)}, ${sn(y)} + ${par(b)})`)}, 곧 ${pt(u, v)}이다.`,
        facts: { calc: [[`${J(x)}+${J(a)}`, 0], [`${J(y)}+${J(b)}`, 1]] }
      });
    }),
    T('pmove-amount', '옮겨진 점으로 평행이동의 양 구하기', '①2', (d) => {
      // 한 방향은 이동의 양이, 다른 방향은 옮겨진 점의 좌표가 문자다.
      const x = nz(d, -6, 6), y = nz(d, -6, 6), a = nz(d, -7, 7), k = nz(d, -7, 7), xFirst = d.bool();
      const u = xFirst ? x + a : x + k, v = xFirst ? y + k : y + a;
      if (u === 0 || v === 0) return null;
      const say = xFirst ? `${XA}의 방향으로 ${VA}만큼, ${YA}의 방향으로 ${sn(k)}만큼` : `${XA}의 방향으로 ${sn(k)}만큼, ${YA}의 방향으로 ${VA}만큼`;
      const to = xFirst ? nb(`(${sn(u)}, ${VB})`) : nb(`(${VB}, ${sn(v)})`), b = xFirst ? v : u;
      return vals(`점 ${jw(pt(x, y), '을/를')} ${say} 평행이동하였더니 점 ${jw(to, '으로/로')} 옮겨졌다. 상수 ${VA}, ${VB}의 값은?`, [[VA, a], [VB, b]], {
        explain: xFirst ? `옮긴 점은 ${nb(`(${sn(x)} + ${VA}, ${sn(y)} + ${par(k)})`)}이므로 ${nb(`${sn(x)} + ${VA} = ${sn(u)}`)}, ${nb(`${sn(y)} + ${par(k)} = ${VB}`)}에서 ${nb(`${VA} = ${sn(a)}`)}, ${nb(`${VB} = ${sn(b)}`)}이다.`
          : `옮긴 점은 ${nb(`(${sn(x)} + ${par(k)}, ${sn(y)} + ${VA})`)}이므로 ${nb(`${sn(x)} + ${par(k)} = ${VB}`)}, ${nb(`${sn(y)} + ${VA} = ${sn(v)}`)}에서 ${nb(`${VA} = ${sn(a)}`)}, ${nb(`${VB} = ${sn(b)}`)}이다.`,
        facts: { calc: xFirst ? [[`${J(u)}-${J(x)}`, 0], [`${J(y)}+${J(k)}`, 1]] : [[`${J(v)}-${J(y)}`, 0], [`${J(x)}+${J(k)}`, 1]] }
      });
    }),
    T('pmove-carry', '한 점을 다른 점으로 옮기는 평행이동으로 다른 점 옮기기', '①3', (d) => {
      const x1 = nz(d, -6, 6), y1 = nz(d, -6, 6), x2 = nz(d, -6, 6), y2 = nz(d, -6, 6), x3 = nz(d, -6, 6), y3 = nz(d, -6, 6);
      const a = x2 - x1, b = y2 - y1;
      if (a === 0 || b === 0 || (x3 === x1 && y3 === y1) || (x3 === x2 && y3 === y2)) return null;
      return pointAns(`점 ${jw(pt(x1, y1), '을/를')} 점 ${jw(pt(x2, y2), '으로/로')} 옮기는 평행이동에 의하여 점 ${jw(pt(x3, y3), '이/가')} 옮겨지는 점의 좌표는?`, x3 + a, y3 + b, {
        explain: `점 ${jw(pt(x1, y1), '을/를')} 점 ${jw(pt(x2, y2), '으로/로')} 옮기는 평행이동은 ${mv(a, b)} 옮기는 것이다. 따라서 점 ${jw(pt(x3, y3), '은/는')} ${jw(pt(x3 + a, y3 + b), '으로/로')} 옮겨진다.`,
        facts: { calc: [[`${J(x3)}+${J(x2)}-${J(x1)}`, 0], [`${J(y3)}+${J(y2)}-${J(y1)}`, 1]] }
      });
    }),
    T('pmove-back', '같은 평행이동으로 옮겨진 점에서 처음 점 구하기', '①4', (d) => {
      const x1 = nz(d, -6, 6), y1 = nz(d, -6, 6), x2 = nz(d, -6, 6), y2 = nz(d, -6, 6), u = nz(d, -6, 6), v = nz(d, -6, 6);
      const a = x2 - x1, b = y2 - y1, px = u - a, py = v - b;
      if (a === 0 || b === 0 || px === 0 || py === 0 || (u === x2 && v === y2) || (u === x1 && v === y1)) return null;
      return pointAns(`점 ${jw(pt(x1, y1), '을/를')} 점 ${jw(pt(x2, y2), '으로/로')} 옮기는 평행이동에 의하여 점 P가 점 ${jw(pt(u, v), '으로/로')} 옮겨졌다. 점 P의 좌표는?`, px, py, {
        explain: `이 평행이동은 ${mv(a, b)} 옮기는 것이다. 점 P는 ${jw(pt(u, v), '을/를')} 거꾸로 ${mv(-a, -b)} 옮긴 점이므로 ${pt(px, py)}이다.`,
        facts: { calc: [[`${J(u)}-(${J(x2)}-${J(x1)})`, 0], [`${J(v)}-(${J(y2)}-${J(y1)})`, 1]] }
      });
    }),
    T('pmove-online', '평행이동한 점이 직선 위에 있도록 하는 미지수', '①5', (d, n) => {
      if (n === 0) {
        // 점 (x, y)를 (a, ka)만큼 옮긴 점이 직선 px + qy + r = 0 위에 있다.
        const x = d.int(-5, 5), y = d.int(-5, 5), k = d.pick([2, 3, -1, -2]), p = nz(d, -3, 3), q = nz(d, -3, 3), a = nz(d, -5, 5);
        const r = -(p * (x + a) + q * (y + k * a));
        if (p + q * k === 0 || r === 0 || Math.abs(r) > 30 || (x === 0 && y === 0)) return null;
        const ka = (k === 1 ? '' : k === -1 ? MINUS : sn(k)) + VA;
        if (p * x + q * y + r === 0) return null;
        return N(`점 ${jw(pt(x, y), '을/를')} ${XA}의 방향으로 ${VA}만큼, ${YA}의 방향으로 ${ka}만큼 평행이동한 점이 직선 ${gline([p, q, r])} 위에 있을 때, 상수 ${VA}의 값은?`, a, {
          signed: true,
          explain: `옮긴 점 ${nb(`(${minus(VA, -x)}, ${sn(y)} ${k < 0 ? MINUS : '+'} ${Math.abs(k) === 1 ? '' : Math.abs(k)}${VA})`)}를 직선의 방정식에 대입하여 정리하면 ${nb(poly([[p + q * k, VA], [p * x + q * y + r, '']]) + ' = 0')}이므로 ${nb(`${VA} = ${sn(a)}`)}이다.`,
          facts: { calc: [[`(0-(${J(p)}*${J(x)}+${J(q)}*${J(y)}+${J(r)}))/(${J(p)}+${J(q)}*${J(k)})`, 0]] }
        });
      }
      // 옮긴 점이 직선 y = mx + c 위에 있을 때 m
      const x = nz(d, -5, 5), y = nz(d, -5, 5), a = nz(d, -5, 5), b = nz(d, -5, 5), m = nz(d, -4, 4), u = x + a, v = y + b, c = v - m * u;
      if (u === 0 || c === 0 || Math.abs(c) > 25) return null;
      return N(`점 ${jw(pt(x, y), '을/를')} ${mv(a, b)} 평행이동한 점이 직선 ${nb(`${Y} = ${VM}${X} ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`)} 위에 있을 때, 상수 ${VM}의 값은?`, m, {
        signed: true,
        explain: `옮긴 점은 ${pt(u, v)}이므로 ${nb(`${sn(v)} = ${poly([[u, VM], [c, '']])}`)}에서 ${nb(`${VM} = ${sn(m)}`)}이다.`,
        facts: { calc: [[`(${J(y)}+${J(b)}-${J(c)})/(${J(x)}+${J(a)})`, 0]] }
      });
    }, { count: 2 }),
    T('pmove-system', '옮긴 점이 문자로 준 점과 같을 때 a, b 구하기', '①6', (d) => {
      const a = nz(d, -5, 5), b = nz(d, -5, 5), al = d.pick([-3, -2, 2, 3]), be = d.pick([-2, -1, 1, 2]), s = al * b - a, t = be * a - b;
      if (s === 0 || t === 0 || 1 - al * be === 0 || Math.abs(s) > 14 || Math.abs(t) > 14) return null;
      const co = (k, v) => (k === 1 ? v : k === -1 ? MINUS + v : sn(k) + v);
      const to = nb(`(${co(al, VB)}, ${co(be, VA)})`);
      return vals(`점 ${nb(`(${VA}, ${VB})`)}를 ${mv(s, t)} 평행이동하였더니 점 ${jw(to, '으로/로')} 옮겨졌다. 상수 ${VA}, ${VB}의 값은?`, [[VA, a], [VB, b]], {
        explain: `옮긴 점은 ${nb(`(${minus(VA, -s)}, ${minus(VB, -t)})`)}이므로 ${nb(`${minus(VA, -s)} = ${co(al, VB)}`)}, ${nb(`${minus(VB, -t)} = ${co(be, VA)}`)}이다. 두 식을 연립하여 풀면 ${nb(`${VA} = ${sn(a)}`)}, ${nb(`${VB} = ${sn(b)}`)}이다.`,
        facts: { calc: [[`${J(al)}*(0-${J(be)}*${J(s)}-${J(t)})/(1-${J(al)}*${J(be)})-${J(s)}`, 0], [`(0-${J(be)}*${J(s)}-${J(t)})/(1-${J(al)}*${J(be)})`, 1]] }
      });
    }),
    T('pmove-centroid', '평행이동한 삼각형의 무게중심', '①7', (d) => {
      const P = [0, 1, 2].map(() => [d.int(-5, 5), d.int(-5, 5)]), sx = P[0][0] + P[1][0] + P[2][0], sy = P[0][1] + P[1][1] + P[2][1];
      const s = nz(d, -5, 5), t = nz(d, -5, 5);
      const area2 = (P[1][0] - P[0][0]) * (P[2][1] - P[0][1]) - (P[2][0] - P[0][0]) * (P[1][1] - P[0][1]);
      if (sx % 3 !== 0 || sy % 3 !== 0 || area2 === 0 || sx / 3 + s === 0 || sy / 3 + t === 0) return null;
      const [A, Bp, Cp] = P;
      return pointAns(`세 점 A${pt(A[0], A[1])}, B${pt(Bp[0], Bp[1])}, C${jw(pt(Cp[0], Cp[1]), '을/를')} 꼭짓점으로 하는 삼각형 ABC를 ${mv(s, t)} 평행이동하였다. 평행이동한 삼각형의 무게중심의 좌표는?`, sx / 3 + s, sy / 3 + t, {
        explain: `삼각형 ABC의 무게중심은 ${pt(sx / 3, sy / 3)}이다. 평행이동한 삼각형의 무게중심은 이 점을 같은 만큼 옮긴 점이므로 ${pt(sx / 3 + s, sy / 3 + t)}이다.`,
        facts: { calc: [[`(${J(A[0])}+${J(Bp[0])}+${J(Cp[0])})/3+${J(s)}`, 0], [`(${J(A[1])}+${J(Bp[1])}+${J(Cp[1])})/3+${J(t)}`, 1]], derived: [3] }
      });
    }),
    T('pmove-frame', '실생활: 액자를 벽의 정중앙으로 옮기는 평행이동', '①8', (d) => {
      const W = d.pick([300, 360, 400, 480]), H = d.pick([240, 280, 300]), w = d.pick([60, 80, 100, 120]), h = d.pick([40, 60, 80, 100]);
      if (w >= W / 2 || h >= H / 2) return null;
      const a = (W - w) / 2, b = (h - H) / 2;
      return vals(`가로의 길이가 ${W} cm, 세로의 길이가 ${H} cm인 직사각형 모양의 벽면을 왼쪽 아래 꼭짓점이 원점, 아래쪽 변이 ${XA}, 왼쪽 변이 ${YA} 위에 오도록 좌표평면 위에 나타냈다(좌표의 단위는 cm). 가로의 길이가 ${w} cm, 세로의 길이가 ${h} cm인 직사각형 모양의 액자가 벽면의 왼쪽 위 구석에 두 변이 벽면의 두 변에 꼭 맞게 걸려 있다. 이 액자를 ${XA}의 방향으로 ${VA}만큼, ${YA}의 방향으로 ${VB}만큼 평행이동하였더니 액자의 두 대각선의 교점이 벽면의 두 대각선의 교점과 겹쳤다. 상수 ${VA}, ${VB}의 값은?`, [[VA, a], [VB, b]], {
        explain: `액자의 두 대각선의 교점은 처음에 ${pt(w / 2, H - h / 2)}, 벽면의 두 대각선의 교점은 ${pt(W / 2, H / 2)}이다. 따라서 ${nb(`${VA} = ${W / 2} ${MINUS} ${w / 2} = ${a}`)}, ${nb(`${VB} = ${H / 2} ${MINUS} ${H - h / 2} = ${sn(b)}`)}이다.`,
        facts: { calc: [[`(${W}-${w})/2`, 0], [`(${h}-${H})/2`, 1]], derived: [2] }
      });
    })
  ];

  // ── 나. 도형의 평행이동 ──
  const pfigTypes = [
    T('pfig-line', '직선을 평행이동한 직선의 방정식', '①10 심1', (d, n) => {
      if (n === 0) {
        const m = pm(d) * d.int(2, 4), c = nz(d, -6, 6), a = nz(d, -5, 5), b = nz(d, -5, 5), c2 = c - m * a + b;
        if (c2 === 0 || Math.abs(c2) > 30) return null;
        return lineAns(`직선 ${jw(sline(m, c), '을/를')} ${mv(a, b)} 평행이동한 직선의 방정식을 구하시오.`, m, c2, {
          explain: `${subMove(a, b)} ${nb(`${minus(Y, b)} = ${sn(m)}(${minus(X, a)}) ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`)}, 곧 ${sline(m, c2)}이다.`,
          facts: { calc: [[`${J(m)}`, 0], [`${J(c)}-${J(m)}*${J(a)}+${J(b)}`, 1]] }
        });
      }
      // 일반형: 옮긴 직선의 상수항만 묻는다(x, y 의 계수는 그대로).
      const p = d.int(1, 5), q = nz(d, -5, 5), r = nz(d, -9, 9), a = nz(d, -5, 5), b = nz(d, -5, 5), c = r - p * a - q * b;
      if (c === 0 || c === r || gcd(gcd(p, Math.abs(q)), Math.abs(r)) !== 1 || Math.abs(c) > 40) return null;
      return N(`직선 ${jw(gline([p, q, r]), '을/를')} ${mv(a, b)} 평행이동한 직선의 방정식이 ${nb(poly([[p, X], [q, Y]]) + ` + ${VC} = 0`)}일 때, 상수 ${VC}의 값은?`, c, {
        signed: true,
        explain: `${subMove(a, b)} ${nb(`${p === 1 ? '' : p}(${minus(X, a)}) ${q < 0 ? MINUS : '+'} ${Math.abs(q) === 1 ? '' : Math.abs(q)}(${minus(Y, b)}) ${r < 0 ? MINUS : '+'} ${Math.abs(r)} = 0`)}, 곧 ${gline([p, q, c])}이므로 ${nb(`${VC} = ${sn(c)}`)}이다.`,
        facts: { calc: [[`${J(r)}-${J(p)}*${J(a)}-${J(q)}*${J(b)}`, 0]] }
      });
    }, { count: 2 }),
    T('pfig-circle', '원을 평행이동한 원의 방정식', '①11', (d) => {
      const atO = d.bool(), p = atO ? 0 : nz(d, -5, 5), q = atO ? 0 : nz(d, -5, 5), r2 = d.int(1, 20), a = nz(d, -5, 5), b = nz(d, -5, 5);
      if (p + a === 0 || q + b === 0) return null;
      return circAns(`원 ${jw(circ(p, q, r2), '을/를')} ${mv(a, b)} 평행이동한 원의 방정식을 구하시오.`, p + a, q + b, r2, {
        explain: `${subMove(a, b)} ${circ(p + a, q + b, r2)}이다. 중심 ${jw(pt(p, q), '이/가')} ${jw(pt(p + a, q + b), '으로/로')} 옮겨지고 반지름의 길이는 그대로이다.`,
        facts: { calc: [[`0-(${J(p)}+${J(a)})`, 0], [`0-(${J(q)}+${J(b)})`, 1], [`${r2}`, 2]] }
      });
    }),
    T('pfig-feature', '평행이동한 직선의 절편, 원의 중심과 반지름', '①12', (d, n) => {
      const a = nz(d, -5, 5), b = nz(d, -5, 5);
      if (n === 0) {
        // 옮긴 직선 px + qy + c' = 0 의 두 절편이 정수가 되게 c' 을 먼저 정한다.
        const p = d.int(1, 4), q = pm(d) * d.int(1, 4), L = p * Math.abs(q) / gcd(p, Math.abs(q)), c2 = nz(d, -3, 3) * L, r = c2 + p * a + q * b;
        if (r === 0 || gcd(gcd(p, Math.abs(q)), Math.abs(r)) !== 1 || Math.abs(c2) > 24 || Math.abs(r) > 30) return null;
        const xi = -c2 / p + 0, yi = -c2 / q + 0;
        return vals(`직선 ${jw(gline([p, q, r]), '을/를')} ${mv(a, b)} 평행이동한 직선의 ${X}절편과 ${Y}절편은?`, [[X + '절편', xi], [Y + '절편', yi]], {
          explain: `${subMove(a, b)} ${gline([p, q, c2])}이다. ${nb(`${Y} = 0`)}을 대입하면 ${nb(`${X} = ${sn(xi)}`)}, ${nb(`${X} = 0`)}을 대입하면 ${nb(`${Y} = ${sn(yi)}`)}이다.`,
          facts: { calc: [[`(0-(${J(r)}-${J(p)}*${J(a)}-${J(q)}*${J(b)}))/${J(p)}`, 0], [`(0-(${J(r)}-${J(p)}*${J(a)}-${J(q)}*${J(b)}))/${J(q)}`, 1]] }
        });
      }
      const h = nz(d, -5, 5), k = nz(d, -5, 5), R = d.int(2, 6);
      if (h + a === 0 || k + b === 0) return null;
      return inline(`원 ${jw(circ(h, k, R * R), '을/를')} ${mv(a, b)} 평행이동한 원의 중심의 좌표와 반지름의 길이는?`, `중심: ({0}, {1}), 반지름의 길이: {2}`,
        [{ answer: h + a, signed: true }, { answer: k + b, signed: true }, { answer: R }], {
          shown: `중심 ${pt(h + a, k + b)}, 반지름의 길이 ${R}`,
          explain: `처음 원의 중심은 ${pt(h, k)}, 반지름의 길이는 ${String(R)}이다. 평행이동하면 중심은 ${jw(pt(h + a, k + b), '으로/로')} 옮겨지고 반지름의 길이는 그대로 ${String(R)}이다.`,
          facts: { calc: [[`${J(h)}+${J(a)}`, 0], [`${J(k)}+${J(b)}`, 1], [`${R}`, 2]], derived: [R] }
        });
    }, { count: 2 }),
    T('pfig-back', '평행이동한 결과로 처음 도형 구하기', '①13', (d, n) => {
      const a = nz(d, -5, 5), b = nz(d, -5, 5);
      if (n === 0) {
        const m = pm(d) * d.int(2, 4), c2 = nz(d, -8, 8), c = c2 + m * a - b;
        if (c === 0 || Math.abs(c) > 30) return null;
        return lineAns(`직선 ${VL}을 ${mv(a, b)} 평행이동하였더니 직선 ${jw(sline(m, c2), '이/가')} 되었다. 직선 ${VL}의 방정식을 구하시오.`, m, c, {
          explain: `직선 ${VL}은 직선 ${jw(sline(m, c2), '을/를')} 거꾸로 ${mv(-a, -b)} 평행이동한 직선이다. ${subMove(-a, -b)} ${nb(`${minus(Y, -b)} = ${sn(m)}(${minus(X, -a)}) ${c2 < 0 ? MINUS : '+'} ${Math.abs(c2)}`)}, 곧 ${sline(m, c)}이다.`,
          facts: { calc: [[`${J(m)}`, 0], [`${J(c2)}+${J(m)}*${J(a)}-${J(b)}`, 1]] }
        });
      }
      const h2 = nz(d, -5, 5), k2 = nz(d, -5, 5), r2 = d.int(2, 20), h = h2 - a, k = k2 - b;
      if (h === 0 || k === 0) return null;
      return circAns(`원 C를 ${mv(a, b)} 평행이동하였더니 원 ${jw(circ(h2, k2, r2), '이/가')} 되었다. 원 C의 방정식을 구하시오.`, h, k, r2, {
        explain: `원 C는 원 ${jw(circ(h2, k2, r2), '을/를')} 거꾸로 ${mv(-a, -b)} 평행이동한 원이다. 중심 ${jw(pt(h2, k2), '을/를')} 옮기면 ${jw(pt(h, k), '이/가')} 되므로 ${circ(h, k, r2)}이다.`,
        facts: { calc: [[`0-(${J(h2)}-${J(a)})`, 0], [`0-(${J(k2)}-${J(b)})`, 1], [`${r2}`, 2]] }
      });
    }, { count: 2 }),
    T('pfig-through', '평행이동한 직선이 주어진 점을 지날 때의 미지수', '①14', (d) => {
      const p = d.int(1, 5), q = pm(d) * d.int(1, 3), r = nz(d, -9, 9), a = nz(d, -5, 5), b = nz(d, -5, 5), s = d.int(-5, 5);
      const top = p * (s - a) + r;
      if (top % q !== 0 || gcd(gcd(Math.abs(p), Math.abs(q)), Math.abs(r)) !== 1) return null;
      const k = b - top / q + 0;
      if (k === 0) return null;
      return N(`직선 ${jw(gline([p, q, r]), '을/를')} ${mv(a, b)} 평행이동한 직선이 점 ${jw(nb(`(${sn(s)}, ${VK})`), '을/를')} 지날 때, 상수 ${VK}의 값은?`, k, {
        signed: true,
        explain: `옮긴 직선은 ${gline(lineMove([p, q, r], a, b))}이다. 점 ${nb(`(${sn(s)}, ${VK})`)}를 대입하면 ${nb(`${VK} = ${sn(k)}`)}이다.`,
        facts: { calc: [[`${J(b)}-(${J(p)}*(${J(s)}-${J(a)})+${J(r)})/${J(q)}`, 0]] }
      });
    }),
    T('pfig-onpoints', '평행이동한 직선 위에 있는 점 고르기', '①15', (d) => {
      const m = nz(d, -3, 3), c = nz(d, -5, 5), a = nz(d, -4, 4), b = nz(d, -4, 4), c2 = c - m * a + b, wrong = c + m * a - b;
      if (c2 === c || wrong === c2 || wrong === c) return null;
      // 옮긴 직선 위의 점 둘, 처음 직선 위의 점 하나, 거꾸로 옮긴 직선 위의 점 하나
      const xs = d.shuffle([-3, -2, -1, 0, 1, 2, 3]).slice(0, 4), consts = d.shuffle([c2, c2, c, wrong]);
      const rows = xs.map((x, i) => [x, m * x + consts[i]]), flags = consts.map((v) => v === c2);
      if (rows.some(([x, y]) => Math.abs(y) > 15)) return null;
      return pairPick(d, `직선 ${jw(sline(m, c), '을/를')} ${mv(a, b)} 평행이동한 직선을 ${VL}이라 할 때, 다음 중 직선 ${VL} 위에 있는 점만을 있는 대로 고른 것은?`, rows.map(([x, y]) => pt(x, y)), flags, {
        explain: `직선 ${VL}은 ${sline(m, c2)}이다. 각 점을 대입해 보면 ${xs.map((x, i) => GANA[i]).filter((_, i) => flags[i]).join(', ')}만 이 식을 만족시킨다.`
      });
    }),
    T('pfig-match', '원을 평행이동하여 다른 원과 일치시키는 이동의 양', '①16', (d, n) => {
      const h = nz(d, -5, 5), k = nz(d, -5, 5), R = d.int(1, 6);
      if (n === 0) {
        const A = -2 * h, Bc = -2 * k, Cc = h * h + k * k - R * R;
        if (Cc === 0) return null;
        return vals(`원 ${jw(gcirc(A, Bc, Cc), '을/를')} ${XA}의 방향으로 ${VA}만큼, ${YA}의 방향으로 ${VB}만큼 평행이동하였더니 원 ${nb(`${X2} + ${Y2} = ${VR}${sup(2)}`)}과 일치하였다. 상수 ${VA}, ${VB}, ${VR}의 값은? (단, ${nb(`${VR} &gt; 0`)})`, [[VA, -h], [VB, -k], [VR, R, true]], {
          explain: `주어진 원은 ${circ(h, k, R * R)}이므로 중심이 ${pt(h, k)}, 반지름의 길이가 ${String(R)}이다. 중심을 원점으로 옮겨야 하므로 ${nb(`${VA} = ${sn(-h)}`)}, ${nb(`${VB} = ${sn(-k)}`)}이고 ${nb(`${VR} = ${R}`)}이다.`,
          facts: { calc: [[`${J(A)}/2`, 0], [`${J(Bc)}/2`, 1], [`${R}`, 2]], derived: [2, R] }
        });
      }
      const h2 = nz(d, -5, 5), k2 = nz(d, -5, 5), A = -2 * h2, Bc = -2 * k2, Cc = h2 * h2 + k2 * k2 - R * R, m = h2 - h, nn = k2 - k;
      if (Cc === 0 || m === 0 || nn === 0) return null;
      return vals(`원 ${jw(circ(h, k, R * R), '을/를')} ${XA}의 방향으로 ${VM}만큼, ${YA}의 방향으로 ${VN}만큼 평행이동하였더니 원 ${jw(gcirc(A, Bc, Cc), '과/와')} 일치하였다. 상수 ${VM}, ${VN}의 값은?`, [[VM, m], [VN, nn]], {
        explain: `${jw(gcirc(A, Bc, Cc), '은/는')} ${circ(h2, k2, R * R)}이므로 중심 ${jw(pt(h, k), '을/를')} ${jw(pt(h2, k2), '으로/로')} 옮기는 평행이동이다. 따라서 ${nb(`${VM} = ${sn(m)}`)}, ${nb(`${VN} = ${sn(nn)}`)}이다.`,
        facts: { calc: [[`(0-${J(A)})/2-${J(h)}`, 0], [`(0-${J(Bc)})/2-${J(k)}`, 1]], derived: [2] }
      });
    }, { count: 2 }),
    T('pfig-linerel', '직선을 평행이동하여 다른 직선과 일치시키는 (a, b)', '①17', (d) => {
      const p = d.int(1, 3), q = nz(d, -3, 3), c = nz(d, -8, 8);
      if (gcd(p, Math.abs(q)) !== 1) return null;
      const ok = ([a, b]) => p * a + q * b === -c;
      // 바른 (a, b) 하나와, 부호를 거꾸로 한 관계(pa + qb = c)·한쪽만 맞춘 관계를 만족시키는 (a, b)
      const pool = [];
      for (let a = -6; a <= 6; a += 1) for (let b = -6; b <= 6; b += 1) pool.push([a, b]);
      const good = d.shuffle(pool.filter((v) => ok(v) && v[0] !== 0 && v[1] !== 0));
      const bad1 = d.shuffle(pool.filter((v) => p * v[0] + q * v[1] === c && !ok(v)));
      const bad2 = d.shuffle(pool.filter((v) => (p * v[0] - q * v[1] === -c || -p * v[0] + q * v[1] === -c) && !ok(v) && p * v[0] + q * v[1] !== c));
      if (!good.length || !bad1.length || bad2.length < 2) return null;
      const opts = [good[0], bad1[0], bad2[0], bad2[1]];
      if (new Set(opts.map((v) => v.join())).size !== 4) return null;
      const order = d.shuffle([0, 1, 2, 3]);
      return C(`직선 ${jw(nb(poly([[p, X], [q, Y]]) + ' = 0'), '을/를')} ${XA}의 방향으로 ${VA}만큼, ${YA}의 방향으로 ${VB}만큼 평행이동한 직선이 직선 ${jw(gline([p, q, c]), '과/와')} 일치할 때, 다음 중 ${nb(`(${VA}, ${VB})`)}가 될 수 있는 것은?`, order.map((i) => pt(opts[i][0], opts[i][1])), order.indexOf(0), {
        explain: `옮긴 직선은 ${nb(poly([[p, X], [q, Y], [-p, VA], [-q, VB]]) + ' = 0')}이므로 ${nb(`${poly([[-p, VA], [-q, VB]])} = ${sn(c)}`)}, 곧 ${nb(`${poly([[p, VA], [q, VB]])} = ${sn(-c)}`)}인 ${nb(`(${VA}, ${VB})`)}는 모두 된다(직선은 제 방향으로 옮기면 그대로이다). 보기 가운데 이 식을 만족시키는 것은 ${pt(good[0][0], good[0][1])}이다.`,
        facts: { truth: order.map((i) => i === 0), want: true }
      });
    }),
    T('pfig-pp', '점을 점으로 옮기는 평행이동으로 직선 옮기기', '①18', (d, n) => {
      const x1 = nz(d, -5, 5), y1 = nz(d, -5, 5), x2 = nz(d, -5, 5), y2 = nz(d, -5, 5), a = x2 - x1, b = y2 - y1;
      if (a === 0 || b === 0) return null;
      const head = `점 ${jw(pt(x1, y1), '을/를')} 점 ${jw(pt(x2, y2), '으로/로')} 옮기는 평행이동에 의하여`;
      if (n === 0) {
        const p = d.int(1, 4), q = nz(d, -4, 4), c = nz(d, -9, 9), c2 = c - p * a - q * b;
        if (c2 === 0 || p * a + q * b === 0 || gcd(gcd(p, Math.abs(q)), Math.abs(c)) !== 1 || Math.abs(c2) > 40) return null;
        return N(`${head} 직선 ${nb(poly([[p, X], [q, Y]]) + ` + ${VC} = 0`)}이 직선 ${jw(gline([p, q, c2]), '으로/로')} 옮겨질 때, 상수 ${VC}의 값은?`, c, {
          signed: true,
          explain: `이 평행이동은 ${mv(a, b)} 옮기는 것이다. ${subMove(a, b)} ${nb(`${poly([[p, X], [q, Y]])} + ${VC} ${p * a + q * b < 0 ? '+' : MINUS} ${Math.abs(p * a + q * b)} = 0`)}이고, 이것이 ${jw(gline([p, q, c2]), '과/와')} 같으므로 ${nb(`${VC} = ${sn(c)}`)}이다.`,
          facts: { calc: [[`${J(c2)}+${J(p)}*(${J(x2)}-${J(x1)})+${J(q)}*(${J(y2)}-${J(y1)})`, 0]] }
        });
      }
      const M2 = pm(d) * d.int(2, 4), n2 = nz(d, -8, 8), n0 = n2 + M2 * a - b;
      if (n0 === 0 || Math.abs(n0) > 30) return null;
      return vals(`${head} 직선 ${nb(`${Y} = ${VM}${X} + ${VN}`)}이 직선 ${jw(sline(M2, n2), '으로/로')} 옮겨질 때, 상수 ${VM}, ${VN}의 값은?`, [[VM, M2], [VN, n0]], {
        explain: `이 평행이동은 ${mv(a, b)} 옮기는 것이다. 옮긴 직선은 ${nb(`${minus(Y, b)} = ${VM}(${minus(X, a)}) + ${VN}`)}이고 평행이동해도 기울기는 그대로이므로 ${nb(`${VM} = ${sn(M2)}`)}, y절편을 견주면 ${nb(`${VN} = ${sn(n0)}`)}이다.`,
        facts: { calc: [[`${J(M2)}`, 0], [`${J(n2)}+${J(M2)}*(${J(x2)}-${J(x1)})-(${J(y2)}-${J(y1)})`, 1]] }
      });
    }, { count: 2 }),
    T('pfig-cc', '원을 원으로 옮기는 평행이동으로 직선 옮기기', '①19', (d) => {
      const h1 = nz(d, -5, 5), k1 = nz(d, -5, 5), h2 = d.int(-4, 4), k2 = d.int(-4, 4), R = d.int(1, 4), a = h2 - h1, b = k2 - k1;
      const m = pm(d) * d.int(2, 4), c = nz(d, -6, 6), c2 = c - m * a + b, C1 = h1 * h1 + k1 * k1 - R * R;
      if (a === 0 || b === 0 || c2 === 0 || C1 === 0 || Math.abs(c2) > 30) return null;
      return lineAns(`원 ${jw(gcirc(-2 * h1, -2 * k1, C1), '을/를')} 원 ${jw(circ(h2, k2, R * R), '으로/로')} 옮기는 평행이동에 의하여 직선 ${jw(sline(m, c), '이/가')} 옮겨지는 직선의 방정식을 구하시오.`, m, c2, {
        explain: `첫째 원은 ${circ(h1, k1, R * R)}이므로 중심 ${jw(pt(h1, k1), '을/를')} ${jw(pt(h2, k2), '으로/로')} 옮기는 평행이동, 곧 ${mv(a, b)} 옮기는 것이다. 직선에 ${subMove(a, b)} ${sline(m, c2)}이다.`,
        facts: { calc: [[`${J(m)}`, 0], [`${J(c)}-${J(m)}*(${J(h2)}+${J(-2 * h1)}/2)+(${J(k2)}+${J(-2 * k1)}/2)`, 1]], derived: [2] }
      });
    }),
    T('pfig-dist', '평행이동한 직선과 한 점 사이의 거리', '①21', (d) => {
      const x1 = nz(d, -5, 5), y1 = nz(d, -5, 5), x2 = nz(d, -5, 5), y2 = nz(d, -5, 5), a = x2 - x1, b = y2 - y1;
      const [p, q] = d.pick([[3, 4], [4, 3], [3, -4], [4, -3]]), s = d.int(-4, 4), t = d.int(-4, 4), D = d.int(1, 5), c2 = pm(d) * 5 * D - p * s - q * t, c = c2 + p * a + q * b;
      if (a === 0 || b === 0 || c === 0 || Math.abs(c) > 45) return null;
      const val = p * s + q * t + c2, sign = val > 0 ? '' : '0-';
      return N(`점 ${jw(pt(x1, y1), '을/를')} 점 ${jw(pt(x2, y2), '으로/로')} 옮기는 평행이동에 의하여 직선 ${jw(gline([p, q, c]), '이/가')} 옮겨진 직선을 ${VL}이라 할 때, 점 ${jw(pt(s, t), '과/와')} 직선 ${VL} 사이의 거리는?`, D, {
        explain: `이 평행이동은 ${mv(a, b)} 옮기는 것이므로 직선 ${VL}은 ${gline([p, q, c2])}이다. 점 ${jw(pt(s, t), '과/와')} 직선 ${VL} 사이의 거리는 ${nb(`|${sn(p)} × ${par(s)} + ${par(q)} × ${par(t)} + ${par(c2)}|`)} ÷ ${nb(`${rt(`${p * p} + ${q * q}`)} = ${Math.abs(val)} ÷ 5 = ${D}`)}이다.`,
        facts: { calc: [[`${sign}(${J(p)}*${J(s)}+${J(q)}*${J(t)}+${J(c)}-${J(p)}*(${J(x2)}-${J(x1)})-${J(q)}*(${J(y2)}-${J(y1)}))/5`, 0]], derived: [5] }
      });
    })
  ];

  // ── 다. 평행이동과 위치 관계·조건 ──
  const pcondTypes = [
    T('pcond-tangent-line', '평행이동한 직선이 원에 접할 조건', '①22', (d, n) => {
      if (n === 0) {
        // 직선 px + qy + c = 0 을 x축 방향으로 a 만큼: 중심까지의 거리 |ph + qk + c − pa| / 5 = r
        const [p, q] = d.pick([[3, 4], [3, -4], [4, 3], [4, -3]]), r = p === 3 ? 3 : d.pick([2, 4]), h = d.int(-4, 4), k = d.int(-4, 4), c = nz(d, -9, 9);
        const S = p * h + q * k + c;
        if ((S - 5 * r) % p !== 0 || (S + 5 * r) % p !== 0) return null;
        const a1 = (S - 5 * r) / p + 0, a2 = (S + 5 * r) / p + 0;
        if (a1 === 0 || a2 === 0 || h === 0 || k === 0) return null;
        return two(`직선 ${jw(gline([p, q, c]), '을/를')} ${XA}의 방향으로 ${VA}만큼 평행이동한 직선이 원 ${circ(h, k, r * r)}에 접할 때, 상수 ${VA}의 값을 모두 구하시오.`, VA, a1, a2, {
          explain: `${X} 대신 ${jw(nb(`${X} ${MINUS} ${VA}`), '을/를')} 대입하면 ${nb(`${p}${X} ${q < 0 ? MINUS : '+'} ${Math.abs(q)}${Y} ${MINUS} ${p}${VA} ${c < 0 ? MINUS : '+'} ${Math.abs(c)} = 0`)}이다. 원의 중심 ${jw(pt(h, k), '과/와')} 이 직선 사이의 거리가 반지름의 길이 ${jw(String(r), '과/와')} 같아야 하므로 ${nb(`|${sn(S)} ${MINUS} ${p}${VA}| ÷ 5 = ${r}`)}, 곧 ${nb(`${VA} = ${sn(a1)}`)} 또는 ${nb(`${VA} = ${sn(a2)}`)}이다.`,
          facts: { calc: [[`(${J(p)}*${J(h)}+${J(q)}*${J(k)}+${J(c)}-5*${r})/${J(p)}`, 0], [`(${J(p)}*${J(h)}+${J(q)}*${J(k)}+${J(c)}+5*${r})/${J(p)}`, 1]], derived: [5, r] }
        });
      }
      // 직선 px + qy + k = 0 을 (a, b) 옮긴 직선이 원 x² + y² = R 과 한 점에서 만난다: |k − pa − qb| = (p² + q²)t, R = (p² + q²)t²
      const [p, q] = d.pick([[1, 1], [1, -1], [2, 1], [2, -1], [1, 2], [1, -2], [3, 1], [1, 3]]), t = d.int(1, 2), S = p * p + q * q, R = S * t * t, a = nz(d, -4, 4), b = nz(d, -4, 4);
      const k1 = p * a + q * b - S * t, k2 = p * a + q * b + S * t;
      if (k1 === 0 || k2 === 0 || p * a + q * b === 0) return null;
      return two(`직선 ${nb(poly([[p, X], [q, Y]]) + ` + ${VK} = 0`)}을 ${mv(a, b)} 평행이동한 직선이 원 ${jw(nb(`${X2} + ${Y2} = ${R}`), '과/와')} 한 점에서 만날 때, 상수 ${VK}의 값을 모두 구하시오.`, VK, k1, k2, {
        explain: `${subMove(a, b)} ${nb(`${poly([[p, X], [q, Y]])} + ${VK} ${p * a + q * b < 0 ? '+' : MINUS} ${Math.abs(p * a + q * b)} = 0`)}이다. 원의 중심인 원점과 이 직선 사이의 거리가 반지름의 길이 ${jw(rad(R), '과/와')} 같아야 하므로 ${nb(`|${VK} ${p * a + q * b < 0 ? '+' : MINUS} ${Math.abs(p * a + q * b)}|`)} ÷ ${rt(S)} = ${rad(R)}, 곧 ${nb(`|${VK} ${p * a + q * b < 0 ? '+' : MINUS} ${Math.abs(p * a + q * b)}| = ${S * t}`)}이므로 ${nb(`${VK} = ${sn(k1)}`)} 또는 ${nb(`${VK} = ${sn(k2)}`)}이다.`,
        facts: { calc: [[`${J(p)}*${J(a)}+${J(q)}*${J(b)}-${S * t}`, 0], [`${J(p)}*${J(a)}+${J(q)}*${J(b)}+${S * t}`, 1]], derived: [S * t] }
      });
    }, { count: 2 }),
    T('pcond-tangent-circle', '원을 평행이동하여 직선에 접하게 하는 이동의 양', '①24', (d) => {
      // 옮기는 쪽 문자의 계수가 1인 직선: x + qy + c = 0(x축 방향) 또는 px + y + c = 0(y축 방향). 거리 × √(1 + q²) 이 정수가 되게 반지름을 고른다.
      const alongX = d.bool(), q = alongX ? d.pick([1, -1, 2, -2]) : d.pick([1, 2]), S = 1 + q * q, t = d.int(1, 2), r2 = S * t * t, rL = S * t, h = nz(d, -4, 4), k = nz(d, -4, 4), c = nz(d, -8, 8);
      const line = alongX ? [1, q, c] : [q, 1, c], base = alongX ? h + q * k + c : q * h + k + c, a1 = -base - rL, a2 = -base + rL;
      if (a1 === 0 || a2 === 0 || base === 0) return null;
      const dir = alongX ? XA : YA, cen = alongX ? nb(`(${sn(h)} + ${VA}, ${sn(k)})`) : nb(`(${sn(h)}, ${sn(k)} + ${VA})`);
      return two(`원 ${jw(circ(h, k, r2), '을/를')} ${dir}의 방향으로 ${VA}만큼 평행이동한 원이 직선 ${gline(line)}에 접할 때, 상수 ${VA}의 값을 모두 구하시오.`, VA, a1, a2, {
        explain: `옮긴 원의 중심은 ${cen}이고 반지름의 길이는 ${rad(r2)}이다. 중심과 직선 사이의 거리가 반지름의 길이와 같아야 하므로 ${nb(`|${VA} ${base < 0 ? MINUS : '+'} ${Math.abs(base)}|`)} ÷ ${rt(S)} = ${rad(r2)}, 곧 ${nb(`|${VA} ${base < 0 ? MINUS : '+'} ${Math.abs(base)}| = ${rL}`)}이므로 ${nb(`${VA} = ${sn(a1)}`)} 또는 ${nb(`${VA} = ${sn(a2)}`)}이다.`,
        facts: { calc: alongX ? [[`0-(${J(h)}+${J(q)}*${J(k)}+${J(c)})-${rL}`, 0], [`0-(${J(h)}+${J(q)}*${J(k)}+${J(c)})+${rL}`, 1]] : [[`0-(${J(q)}*${J(h)}+${J(k)}+${J(c)})-${rL}`, 0], [`0-(${J(q)}*${J(h)}+${J(k)}+${J(c)})+${rL}`, 1]], derived: [rL] }
      });
    }),
    T('pcond-axes', '평행이동한 원이 두 좌표축에 접할 조건', '①25', (d) => {
      const h = nz(d, -6, 6), k = nz(d, -6, 6), R = d.int(2, 6), sx = pm(d), sy = pm(d), a = sx * R - h, b = sy * R - k, Cc = h * h + k * k - R * R;
      if (a === 0 || b === 0 || Cc === 0) return null;
      const quad = sx > 0 ? (sy > 0 ? '제1사분면' : '제4사분면') : (sy > 0 ? '제2사분면' : '제3사분면');
      return vals(`원 ${jw(gcirc(-2 * h, -2 * k, Cc), '을/를')} ${XA}의 방향으로 ${VA}만큼, ${YA}의 방향으로 ${VB}만큼 평행이동한 원이 ${XA}과 ${YA}에 동시에 접할 때, 상수 ${VA}, ${VB}의 값은? (단, 평행이동한 원의 중심은 ${quad} 위에 있다.)`, [[VA, a], [VB, b]], {
        explain: `주어진 원은 ${circ(h, k, R * R)}이므로 반지름의 길이는 ${String(R)}이다. 두 축에 동시에 접하고 중심이 ${quad} 위에 있는 원의 중심은 ${pt(sx * R, sy * R)}이다. 중심 ${jw(pt(h, k), '이/가')} 여기로 옮겨지므로 ${nb(`${VA} = ${sn(a)}`)}, ${nb(`${VB} = ${sn(b)}`)}이다.`,
        facts: { calc: [[`${J(sx * R)}+${J(-2 * h)}/2`, 0], [`${J(sy * R)}+${J(-2 * k)}/2`, 1]], derived: [2, R] }
      });
    }),
    T('pcond-perp', '평행이동한 직선이 다른 직선과 y축 위에서 수직으로 만날 조건', '①26', (d) => {
      const sg = pm(d), kk = d.int(2, 4), n0 = nz(d, -6, 6), s = nz(d, -4, 4), t = nz(d, -4, 4), a = -sg * kk, b = n0 + a * s - t;
      if (Math.abs(b) > 30) return null;
      return vals(`직선 ${nb(`${Y} = ${VA}${X} + ${VB}`)}를 ${mv(s, t)} 평행이동하였더니 직선 ${jw(sline(Q(sg, kk), n0), '과/와')} ${YA} 위에서 수직으로 만났다. 상수 ${VA}, ${VB}의 값은?`, [[VA, a], [VB, b]], {
        explain: `옮긴 직선은 ${nb(`${minus(Y, t)} = ${VA}(${minus(X, s)}) + ${VB}`)}이다. 두 직선이 수직이므로 ${nb(`${VA} × ${sg < 0 ? '(' + tx(Q(sg, kk)) + ')' : tx(Q(sg, kk))} = ${MINUS}1`)}에서 ${nb(`${VA} = ${sn(a)}`)}이다. ${YA} 위에서 만나므로 두 직선의 y절편이 같다: ${nb(`${sn(-a * s)} + ${VB} + ${par(t)} = ${sn(n0)}`)}, 곧 ${nb(`${VB} = ${sn(b)}`)}이다.`,
        facts: { calc: [[`${J(-sg)}*${kk}`, 0], [`${J(n0)}+${J(a)}*${J(s)}-${J(t)}`, 1]] }
      });
    }),
    T('pcond-chord', '이차함수의 그래프를 평행이동하여 직선과 만나는 두 점 사이의 거리', '①28', (d) => {
      const m = d.pick([1, -1, 2, -2, 3, -3]), x1 = d.int(-4, 3), gap = d.int(2, 4), x2 = x1 + gap;
      if ((x1 + x2 - m) % 2 !== 0) return null;
      const p = (x1 + x2 - m) / 2, q = nz(d, -5, 5), c = p * p + q - x1 * x2;
      if (p === 0 || c === 0 || Math.abs(c) > 30) return null;
      const S = 1 + m * m;
      return radAns(`이차함수 ${nb(`${Y} = ${X2}`)}의 그래프를 ${mv(p, q)} 평행이동한 그래프가 직선 ${jw(sline(m, c), '과/와')} 만나는 두 점을 A, B라 할 때, 선분 AB의 길이는?`, gap, S, {
        explain: `옮긴 그래프는 ${nb(`${Y} = ${sq(X, p)} ${q < 0 ? MINUS : '+'} ${Math.abs(q)}`)}이다. ${jw(nb(`${sq(X, p)} ${q < 0 ? MINUS : '+'} ${Math.abs(q)} = ${poly([[m, X], [c, '']])}`), '을/를')} 풀면 ${nb(`${X} = ${sn(x1)}`)} 또는 ${nb(`${X} = ${sn(x2)}`)}이므로 A${jw(pt(x1, m * x1 + c), '과/와')} B${pt(x2, m * x2 + c)}이다. ${nb(`AB = ${rt(`${gap}${sup(2)} + ${Math.abs(m * gap)}${sup(2)}`)} = ${radText(gap, S)}`)}이다.`,
        facts: { calc: [[`${gap}`, 0], [`1+${J(m)}*${J(m)}`, 1]], derived: [gap] }
      });
    })
  ];

  // 다른 파일(10-2-3b.js, 10-2-3c.js)이 쓰는 도구
  B.kit.m1023 = {
    UNIT, S06, S07, seal, retry, srcOf, X, Y, XA, YA, X2, Y2, VA, VB, VC, VK, VM, VN, VR, VL, sn, par, J, pt, jw, minus, sq, circ, gcirc, gline, sline, mv, subMove,
    MNAME, MIRROR, subMirror, ptRule, MIRROR_E, lineMove, LINE_MIRROR, toSlope, nz, pm, isSq, lineAns, circAns, vals, two, rad, GANA, pairPick, ptsFig
  };

  B.addUnit({
    id: '10-2-3', grade: 10, semester: 2, no: 3, title: '도형의 이동', version: 1,
    groups: [
      { id: 'pmove', title: '점의 평행이동', standard: S06, types: pmoveTypes },
      { id: 'pfig', title: '도형의 평행이동', standard: S06, types: pfigTypes },
      { id: 'pcond', title: '평행이동과 위치 관계', standard: S06, types: pcondTypes }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
