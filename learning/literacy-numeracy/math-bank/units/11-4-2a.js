// 고등학교 기하 Ⅰ-2 타원 — 단원 틀·도구와 앞쪽 묶음(타원의 방정식, 타원의 평행이동, 타원의 정의로 구하는 길이와 생활 속 타원).
// 수집해 둔 천재 T셀파 기하(전인태, 2022 개정) 한 종의 교과서·평가 자료에서 뽑은 꼴 목록(기본꼴_1 30꼴·기본꼴_2 26꼴, 심화 없음)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-4-2/싣기_대조표.md 에 있다.
// (접선의 방정식 묶음은 11-4-2b.js 에, 실력 문항은 11-4-2c.js 에 있다.)
// ref: ①n = 이 단원 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
// 성취기준은 12기하01-02(타원의 뜻과 방정식)와 12기하01-04(이차곡선의 접선의 방정식 — 판별식을 이용하여 구한다).
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(초점·거리의 합·꼭짓점·표준형·계수 꼴·전개된 꼴·다른 타원), 묻는 것(방정식·초점·장축·단축·넓이·둘레),
//    초점이 x축 위인가 y축 위인가가 다르면 따로 싣는다. 수만 바꾼 유형은 만들지 않는다.
//  - 사용자가 정한 대로 「지나치게 복잡한 문제는 다루지 않는다」를 까닭으로 수집본의 꼴을 빼지 않고, 단계가 많거나 함정이 있는 꼴은 실력(11-4-2c.js)에 싣는다.
//  - 답: 방정식은 분모 칸(x²/□ + y²/□ = 1), 평행이동한 방정식은 (x [±□])²/□ 꼴의 네 칸, 초점은 두 점의 좌표를 칸마다(두 점의 차례는 바꾸어 적어도 맞다),
//    직선은 y = [±□]x [±□]. 칸의 모양이 답을 흘리지 않게, 한 유형(같은 차례) 안에서는 씨앗이 바뀌어도 칸의 모양이 같도록 수를 골랐다
//    (초점의 좌표를 칸으로 받는 유형은 초점이 정수인 타원만, 근호가 남는 길이는 늘 a√b 꼴이 되게).
//    좌표·상수처럼 음수가 될 수 있는 칸에는 부호 단추를 달고, 길이·넓이·분모에는 달지 않는다.
//  - 「모두 구하시오」로 답이 여럿인 꼴(밖의 점에서 그은 접선 모두)은 「있는 대로 고른 것」으로, 따로 구한 값을 더하게 한 원문(a + b, a² + b², a + b + c, a² − b²)은
//    값을 칸마다 따로 묻는다.
//  - 그림: 고2 공용 plot 으로 타원(params)·직선·점을 그린다. 답이 되는 좌표는 그림 설명에 적지 않는다(said).
//  - 검사 근거: 칸마다 문제의 수로 다시 셈하는 식(facts.calc·value), 글에 없는 수는 seal 이 facts.unseen 에 밝힌다.
//    고르기의 참·거짓은 손으로 적지 않고 코드로 셈해 가린다(접선인가는 px + qy = r 이 x²/A + y²/B = 1 에 접할 조건 r² = Ap² + Bq² 로).
//    답은 따로 지은 풀이(제 작업 폴더)로 다시 맞춰 보았다.
//
// 뺀 것과 까닭(11-4-2b.js, 11-4-2c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 교육과정의 금 「이차곡선과 직선과의 관계는 접하는 경우만 다룬다」: ②9(직선 y = x + k 와 타원의 교점의 개수 — 교과서 활동).
//  - 미적분Ⅱ의 내용: ②10 에 적은 교과서 57쪽의 음함수의 미분법으로 접선 구하기(같은 접선을 공식으로 구하는 유형 tp-point 는 실었다).
//  - 서술형: ②17(타원의 반사 성질 설명 — 원문에 빈칸·고르기 틀이 없다).
//  - 쌍곡선이 섞인 타원 문제(교60~61 09, 교대13, 대13·17·24, 교56 이차곡선 가르기의 ㉡)는 꼴 목록에서 이미 11-4-3 몫으로 넘겼다.
//  - 겹침(같은 일): ①6 의 교31 공학 도구 관찰(두 초점이 가까워지면 원에 가까워진다)은 eq-true 의 문장 하나로 실었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, C, inline } = B.kit;
  const { MINUS, Q, tx, nb, V, sup, poly, nz, rt, grp, sqParts, radText, claimQ, SG } = B.kit.mid;
  const { ms, jh, qAns, coordAns, plot, signed } = B.kit.hs;
  const S2 = '12기하01-02', S4 = '12기하01-04';

  // ── 검사 근거 마무리 ──
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수(중간에 셈한 c·근호 안의 수 따위)를 facts.unseen 에 밝힌다.
  function seal(item) {
    const f = item.facts || {}, shown = visibleNumbers(item), out = new Set(f.unseen || []);
    const exprs = (f.calc || []).map(([t]) => t).concat(f.value !== undefined ? [f.value] : [], (f.choose && f.choose.exprs) || [], f.pick ? [f.pick.expr] : []);
    for (const t of exprs) for (const n of String(t).match(/\d+(?:\.\d+)?/g) || []) if (!shown.has(n)) out.add(Number(n));
    if (out.size) f.unseen = [...out]; else delete f.unseen;
    item.facts = f;
    return item;
  }
  // 만들기가 null 을 돌려주면(조건에 맞지 않는 수) 다시 만든다.
  const retry = (make) => (d, n) => { for (let i = 0; i < 4000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const sourceOf = (ref) => '수집본 기본 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: sourceOf(ref), make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: sourceOf(ref), make: retry(make) }, more || {});

  // ── 수 ──
  const gcd = (x, y) => (y ? gcd(y, x % y) : Math.abs(x));
  const isSq = (n) => { if (n < 0) return false; const r = Math.round(Math.sqrt(n)); return r * r === n; };
  const sqrtI = (n) => Math.round(Math.sqrt(n));
  const jn = (n) => (n < 0 ? '(' + n + ')' : String(n));                       // 검사 식에 적는 수
  const sg = (n) => signed(n);                                                    // 화면에 적는 수(음수는 −)
  const rootTx = (n2) => { const [k, s] = sqParts(n2); return radText(k, s); };  // √n2 의 글(제곱수면 정수)
  const rootNeg = (n2) => { const [k, s] = sqParts(n2); return radText(-k, s); };
  // 직각삼각형의 세 변 [빗변 a, b, c](a² = b² + c²): 긴 반축 a, 짧은 반축 b, 초점까지 c 가 모두 정수인 타원
  const TRIPLES = [[5, 4, 3], [5, 3, 4], [10, 8, 6], [10, 6, 8], [13, 12, 5], [13, 5, 12], [15, 12, 9], [15, 9, 12], [17, 15, 8], [17, 8, 15]];
  // 타원 x²/aa + y²/bb = 1 위의 격자점
  function lattice(aa, bb) {
    const out = [];
    for (let x = -Math.floor(Math.sqrt(aa)); x <= Math.floor(Math.sqrt(aa)); x += 1) {
      const top = bb * (aa - x * x);
      if (top % aa !== 0) continue;
      const y2 = top / aa;
      if (!isSq(y2)) continue;
      const y = sqrtI(y2);
      out.push([x, y]); if (y !== 0) out.push([x, -y]);
    }
    return out;
  }
  // 계수 꼴 타원 p x² + q y² = r 위의 격자점
  function latticeC(p, q, r) {
    const out = [];
    for (let x = -Math.floor(Math.sqrt(r / p)); x <= Math.floor(Math.sqrt(r / p)); x += 1) {
      const top = r - p * x * x;
      if (top < 0 || top % q !== 0 || !isSq(top / q)) continue;
      const y = sqrtI(top / q);
      out.push([x, y]); if (y !== 0) out.push([x, -y]);
    }
    return out;
  }

  // ── 글 ──
  const X = V('x'), Y = V('y'), X2 = X + sup(2), Y2 = Y + sup(2);
  const pt = (x, y) => nb('(' + sg(x) + ', ' + sg(y) + ')');
  const named = (name, x, y) => nb(name + '(' + sg(x) + ', ' + sg(y) + ')');
  const term = (v2, dd) => (dd === 1 ? v2 : frac(v2, dd));
  const ellEq = (aa, bb) => nb(term(X2, aa) + ' + ' + term(Y2, bb) + ' = 1');                       // x²/aa + y²/bb = 1
  // 계수 꼴: bb x² + aa y² = aa·bb 를 공약수로 나눈다. { text, p, q, r }
  function coefOf(aa, bb) { const g = gcd(aa, bb), p = bb / g, q = aa / g, r = aa * bb / g; return { p, q, r, text: nb(poly([[p, X2], [q, Y2]]) + ' = ' + r) }; }
  const coefTx = (p, q, r) => nb(poly([[p, X2], [q, Y2]]) + ' = ' + r);
  const sq = (v, m) => (m === 0 ? v + sup(2) : '(' + poly([[1, v], [-m, '']]) + ')' + sup(2));
  const shEq = (m, k, aa, bb) => nb((aa === 1 ? sq(X, m) : frac(sq(X, m), aa)) + ' + ' + (bb === 1 ? sq(Y, k) : frac(sq(Y, k), bb)) + ' = 1');
  // 전개한 꼴: bb(x − m)² + aa(y − k)² = aa·bb 를 펼치고 공약수로 나눈다. { text, cs: [x², y², x, y, 상수] }
  function genEq(m, k, aa, bb) {
    const cs0 = [bb, aa, -2 * bb * m, -2 * aa * k, bb * m * m + aa * k * k - aa * bb], g = cs0.reduce((s, v) => gcd(s, v), 0) || 1, cs = cs0.map((v) => v / g);
    return { cs, text: nb(poly([[cs[0], X2], [cs[1], Y2], [cs[2], X], [cs[3], Y], [cs[4], '']]) + ' = 0') };
  }
  // 직선 p x + q y = r(정수, 공약수로 나누고 x의 계수(없으면 y의 계수)를 양수로)
  function normLine(p, q, r) {
    const g = gcd(gcd(p, q), r) || 1, s = (p < 0 || (p === 0 && q < 0)) ? -1 : 1;
    return { p: s * p / g, q: s * q / g, r: s * r / g };
  }
  const lineTx = (l) => nb(poly([[l.p, X], [l.q, Y]]) + ' = ' + sg(l.r));
  const sameLine = (l, m) => l.p === m.p && l.q === m.q && l.r === m.r;
  // 직선 px + qy = r 이 타원 x²/aa + y²/bb = 1 에 접하는가(r² = aa p² + bb q²)
  const touches = (l, aa, bb) => l.r * l.r === aa * l.p * l.p + bb * l.q * l.q;
  // 기울기 m(유리수)과 y절편 c(유리수)의 직선 → normLine
  function lineMC(m, c) { const L = m.q * c.q / gcd(m.q, c.q); return normLine(m.p * L / m.q, -L, -c.p * L / c.q); }

  // ── 답 칸 ──
  const ellAns = (text, aa, bb, o) => inline(text, frac(X2, '{0}') + ' + ' + frac(Y2, '{1}') + ' = 1', [{ answer: aa }, { answer: bb }], Object.assign({}, o, { shown: ellEq(aa, bb) }));
  const shAns = (text, m, k, aa, bb, o) => inline(text, frac('(' + X + ' {0})' + sup(2), '{1}') + ' + ' + frac('(' + Y + ' {2})' + sup(2), '{3}') + ' = 1',
    [{ answer: -m, signed: true }, { answer: aa }, { answer: -k, signed: true }, { answer: bb }], Object.assign({}, o, { shown: shEq(m, k, aa, bb) }));
  const PAIR = grp('({0}, {1})') + ', ' + grp('({2}, {3})');
  const pairAns = (text, p1, p2, o) => inline(text, PAIR, [p1[0], p1[1], p2[0], p2[1]].map((v) => ({ answer: v, signed: true })),
    Object.assign({}, o, { blocks: [[0, 1], [2, 3]], shown: pt(p1[0], p1[1]) + ', ' + pt(p2[0], p2[1]) }));
  const lineAns = (text, m, c, o) => inline(text, Y + ' = {0}' + X + ' {1}', [{ answer: m, signed: true }, { answer: c, signed: true }], Object.assign({}, o, { shown: nb(Y + ' = ' + poly([[m, X], [c, '']])) }));
  // 기울기가 m 인 두 접선 y = mx ± k(root 면 ± √k)
  const pmAns = (text, m, k, root, o) => inline(text, Y + ' = {0}' + X + ' ± ' + (root ? rt('{1}') : '{1}'), [{ answer: m, signed: true }, { answer: k }],
    Object.assign({}, o, { shown: nb(Y + ' = ' + poly([[m, X]]) + ' ± ' + (root ? rt(k) : k)) }));
  // 근호가 남는 길이 k√s(k ≥ 2): 길이라 부호 단추가 없다.
  const radLen = (text, k, s, unit, o) => {
    if (k < 2 || s < 2 || sqParts(s)[0] !== 1) throw new Error('radLen: k ≥ 2, s 는 제곱인 수를 인수로 갖지 않는 2 이상의 수');
    return inline(text, '{0}' + rt('{1}') + (unit ? ' ' + unit : ''), [{ answer: k }, { answer: s }], Object.assign({}, o, { shown: radText(k, s) + (unit ? ' ' + unit : '') }));
  };
  // 두 초점과 장축·단축의 길이. 중심이 원점이면 두 초점이 원점에 대하여 대칭이라(부호를 모두 바꾸면 차례만 바뀐 같은 답) 차례를 정해 받는다.
  const ORDER = ' (단, 0이 아닌 좌표가 양수인 초점을 먼저 적는다.)';
  const centered = (F1, F2) => F1[0] === -F2[0] && F1[1] === -F2[1];
  const fociLenAns = (text, F1, F2, L, S, o) => inline(text + (centered(F1, F2) ? ORDER : ''), '두 초점: ' + PAIR + '<br>장축의 길이: {4}, 단축의 길이: {5}',
    [F1[0], F1[1], F2[0], F2[1]].map((v) => ({ answer: v, signed: true })).concat([{ answer: L }, { answer: S }]),
    Object.assign({}, o, centered(F1, F2) ? {} : { blocks: [[0, 1], [2, 3]] }, { shown: `두 초점 ${pt(F1[0], F1[1])}, ${pt(F2[0], F2[1])}, 장축의 길이 ${L}, 단축의 길이 ${S}` }));
  // 「있는 대로 고른 것」의 보기: 일곱 가운데 정답과 넷을 골라 ㄱ, ㄴ, ㄷ, ㄱ·ㄴ … 차례로 세운다.
  const SUBSETS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄱ, ㄴ', 'ㄱ, ㄷ', 'ㄴ, ㄷ', 'ㄱ, ㄴ, ㄷ'];
  function subsetChoice(d, truth) {
    const key = ['ㄱ', 'ㄴ', 'ㄷ'].filter((_, i) => truth[i]).join(', ');
    const others = d.shuffle(SUBSETS.filter((s) => s !== key)).slice(0, 4), opts = SUBSETS.filter((s) => s === key || others.includes(s));
    return { opts, at: opts.indexOf(key), key };
  }

  // ── 그림 ──
  // 타원(중심 (cx, cy), 반축 √aa, √bb)과 직선·점. 상자는 원점을 품도록 잡는다.
  function ellFig(o) {
    const a = Math.sqrt(o.aa), b = Math.sqrt(o.bb), cx = o.cx || 0, cy = o.cy || 0, pad = o.pad == null ? 0.22 * Math.max(a, b) + 0.3 : o.pad;
    const x = o.x || [Math.min(0, cx - a) - pad, Math.max(0, cx + a) + pad], y = o.y || [Math.min(0, cy - b) - pad, Math.max(0, cy + b) + pad];
    return plot({ x, y, xt: o.xt || [], yt: o.yt || [], ys: o.ys, params: [{ x: (t) => cx + a * Math.cos(t), y: (t) => cy + b * Math.sin(t), said: o.said || '타원' }].concat(o.params || []),
      lines: o.lines, segs: o.segs, dots: o.dots, texts: o.texts, say: o.say });
  }

  B.kit.u42x = {
    S2, S4, T, H, seal, retry, gcd, isSq, sqrtI, jn, sg, rootTx, rootNeg, TRIPLES, lattice, latticeC, X, Y, X2, Y2, pt, named, term, ellEq, coefOf, coefTx, sq, shEq, genEq,
    normLine, lineTx, sameLine, touches, lineMC, ellAns, shAns, PAIR, pairAns, lineAns, pmAns, radLen, ORDER, fociLenAns, SUBSETS, subsetChoice, ellFig
  };

  // 초점의 축에 맞춰: 초점이 x축 위면 (±c, 0), y축 위면 (0, ±c)
  const fociPts = (onX, c) => (onX ? [[c, 0], [-c, 0]] : [[0, c], [0, -c]]);
  const axisWord = (onX) => (onX ? X : Y) + '축';

  // ═══ 가. 타원의 방정식 ═══
  const eq = [
    T('eq-sum', '두 초점과 거리의 합으로 타원의 방정식 구하기', '①1 ①2', (d, n) => {
      const c = d.int(1, 7), a = d.int(c + 1, c + 5), big = a * a, small = a * a - c * c, L = 2 * a, onX = n === 0;
      const [F1, F2] = fociPts(onX, c), aa = onX ? big : small, bb = onX ? small : big;
      return ellAns(`두 초점 ${named('F', F1[0], F1[1])}, ${named('F′', F2[0], F2[1])}에 이르는 거리의 합이 ${L}인 타원의 방정식을 구하시오.`, aa, bb, {
        explain: onX
          ? `두 초점이 ${X}축 위에 있으므로 ${nb(ms('2a = ' + L))}, ${nb(ms('c = ' + c))}이다. ${nb(ms(`b^2 = a^2 - c^2 = ${big} - ${c * c} = ${small}`))}이므로 타원의 방정식은 ${ellEq(aa, bb)}이다.`
          : `두 초점이 ${Y}축 위에 있으므로 장축이 ${Y}축 위에 있고 ${nb(ms('2b = ' + L))}, ${nb(ms('c = ' + c))}이다. ${nb(ms(`a^2 = b^2 - c^2 = ${big} - ${c * c} = ${small}`))}이므로 타원의 방정식은 ${ellEq(aa, bb)}이다.`,
        facts: { calc: onX ? [[`(${L}/2)**2`, 0], [`(${L}/2)**2-${c}*${c}`, 1]] : [[`(${L}/2)**2-${c}*${c}`, 0], [`(${L}/2)**2`, 1]], rule: onX ? 'x' : 'y' } });
    }, { count: 2 }),
    T('eq-read', '표준형에서 두 초점의 좌표와 장축·단축의 길이 구하기', '①3 ①4', (d, n) => {
      const [a, b, c] = d.pick(TRIPLES), onX = n === 0, aa = onX ? a * a : b * b, bb = onX ? b * b : a * a, [F1, F2] = fociPts(onX, c);
      const cE = onX ? `(${aa}-${bb})**0.5` : `(${bb}-${aa})**0.5`;
      return fociLenAns(`타원 ${ellEq(aa, bb)}의 두 초점의 좌표와 장축, 단축의 길이를 구하시오.`, F1, F2, 2 * a, 2 * b, {
        explain: `분모가 큰 쪽이 ${onX ? X2 : Y2}이므로 두 초점과 장축은 ${axisWord(onX)} 위에 있다. 초점까지의 거리는 ${nb(rt(`${Math.max(aa, bb)} ${MINUS} ${Math.min(aa, bb)}`) + ' = ' + c)}이므로 두 초점은 ${pt(F1[0], F1[1])}, ${pt(F2[0], F2[1])}이고, 장축의 길이는 ${nb(`2 × ${a} = ${2 * a}`)}, 단축의 길이는 ${nb(`2 × ${b} = ${2 * b}`)}이다.`,
        facts: { calc: [[onX ? cE : '0', 0], [onX ? '0' : cE, 1], [onX ? `0-${cE}` : '0', 2], [onX ? '0' : `0-${cE}`, 3], [`2*${Math.max(aa, bb)}**0.5`, 4], [`2*${Math.min(aa, bb)}**0.5`, 5]], rule: onX ? 'x' : 'y' } });
    }, { count: 2 }),
    T('eq-trap', '분모가 큰 쪽을 가려 장축의 길이·두 초점 사이의 거리 고르기', '①4 변형(중01·중02)', (d, n) => {
      if (n === 0) {
        const a = d.int(2, 6), b = d.int(a + 1, a + 4), yMajor = d.bool(), aa = yMajor ? a * a : b * b, bb = yMajor ? b * b : a * a;
        const vals = [2 * b, 2 * a, b, a, a + b];
        if (new Set(vals).size < 5) return null;
        const opts = d.shuffle(vals);
        // 2a: 분모가 작은 쪽(먼저 적힌 x²)의 반축으로 장축을 셈, b·a: 2배를 빠뜨림, a + b: 두 반축을 더함
        return C(`타원 ${ellEq(aa, bb)}의 장축의 길이는?`, opts.map(String), opts.indexOf(2 * b), {
          explain: `분모가 큰 쪽이 ${yMajor ? Y2 : X2}이므로 장축은 ${axisWord(!yMajor)} 위에 있고, 그 길이는 ${nb(`2 × ${rt(b * b)} = ${2 * b}`)}이다.`,
          facts: { truth: opts.map((v) => v === 2 * b), want: true, rule: 'major' } });
      }
      const s = d.int(2, 9), t = d.int(s + 2, s + 12), yMajor = d.bool(), aa = yMajor ? s : t, bb = yMajor ? t : s;
      // 2√(t − s): 정답, √(t − s): 2배를 빠뜨림, 2√(t + s)·√(t + s): c² = a² + b² 로 셈, 2√t: 긴 반축의 2배(장축)
      const raw = [[4 * (t - s)], [t - s], [4 * (t + s)], [t + s], [4 * t]].map(([v]) => v);
      if (new Set(raw).size < 5) return null;
      const order = d.shuffle([0, 1, 2, 3, 4]), opts = order.map((i) => rootTx(raw[i]));
      return C(`타원 ${ellEq(aa, bb)}의 두 초점 사이의 거리는?`, opts, order.indexOf(0), {
        explain: `분모가 큰 쪽이 ${yMajor ? Y2 : X2}이므로 두 초점은 ${axisWord(!yMajor)} 위에 있다. 초점까지의 거리는 ${nb(rt(`${t} ${MINUS} ${s}`) + ' = ' + rootTx(t - s))}이므로 두 초점 사이의 거리는 ${rootTx(4 * (t - s))}이다.`,
        facts: { truth: order.map((i) => i === 0), want: true, rule: 'focal' } });
    }, { count: 2 }),
    T('eq-coef', 'ax² + by² = c 꼴의 타원에서 두 초점의 좌표와 장축·단축의 길이 구하기', '①5', (d) => {
      const [a, b, c] = d.pick(TRIPLES.slice(0, 6)), onX = d.bool(), aa = onX ? a * a : b * b, bb = onX ? b * b : a * a, [F1, F2] = fociPts(onX, c), K = coefOf(aa, bb);
      const A = `${K.r}/${K.p}`, Bq = `${K.r}/${K.q}`, cE = onX ? `(${A}-${Bq})**0.5` : `(${Bq}-${A})**0.5`;
      return fociLenAns(`타원 ${K.text}의 두 초점의 좌표와 장축, 단축의 길이를 구하시오.`, F1, F2, 2 * a, 2 * b, {
        explain: `양변을 ${jh(K.r, '으로/로')} 나누면 ${ellEq(aa, bb)}이다. 분모가 큰 쪽이 ${onX ? X2 : Y2}이므로 두 초점은 ${axisWord(onX)} 위에 있고, 초점까지의 거리는 ${nb(rt(`${Math.max(aa, bb)} ${MINUS} ${Math.min(aa, bb)}`) + ' = ' + c)}이다. 따라서 두 초점은 ${pt(F1[0], F1[1])}, ${pt(F2[0], F2[1])}, 장축의 길이는 ${2 * a}, 단축의 길이는 ${2 * b}이다.`,
        facts: { calc: [[onX ? cE : '0', 0], [onX ? '0' : cE, 1], [onX ? `0-${cE}` : '0', 2], [onX ? '0' : `0-${cE}`, 3], [`2*(${onX ? A : Bq})**0.5`, 4], [`2*(${onX ? Bq : A})**0.5`, 5]] } });
    }),
    T('eq-true', '타원에 대한 설명 가운데 옳은 것 고르기', '①6', (d, n) => {
      if (n === 0) {
        const SQ = [1, 4, 9, 16, 25, 36], [s, t] = d.shuffle(SQ).slice(0, 2), aa = s, bb = t, onX = aa > bb, cc = Math.abs(aa - bb), K = coefOf(aa, bb);
        const L = 2 * sqrtI(Math.max(aa, bb)), S = 2 * sqrtI(Math.min(aa, bb)), truth = [d.bool(), d.bool(), d.bool()];
        if (!truth.some(Boolean)) return null;
        const fx = truth[0] === onX;   // 참이면 맞는 축, 거짓이면 다른 축에 적는다
        const fTx = fx ? `${nb('(' + rootTx(cc) + ', 0)')}, ${nb('(' + rootNeg(cc) + ', 0)')}` : `${nb('(0, ' + rootTx(cc) + ')')}, ${nb('(0, ' + rootNeg(cc) + ')')}`;
        const st = [`두 초점의 좌표는 ${fTx}이다.`, `장축의 길이는 ${truth[1] ? L : S}이다.`, `단축의 길이는 ${truth[2] ? S : L}이다.`];
        const { opts, at } = subsetChoice(d, truth);
        return C(`타원 ${K.text}에 대하여 옳은 것만을 보기에서 있는 대로 고른 것은?<br>ㄱ. ${st[0]}<br>ㄴ. ${st[1]}<br>ㄷ. ${st[2]}`, opts, at, {
          explain: `양변을 ${jh(K.r, '으로/로')} 나누면 ${ellEq(aa, bb)}이다. 분모가 큰 쪽이 ${onX ? X2 : Y2}이므로 두 초점과 장축은 ${axisWord(onX)} 위에 있고, 초점까지의 거리는 ${rootTx(cc)}, 장축의 길이는 ${L}, 단축의 길이는 ${S}이다. 따라서 옳은 것은 ${opts[at]}이다.`,
          facts: { truth: opts.map((o, i) => i === at), want: true, rule: 'given' } });
      }
      const yes = ['타원의 두 초점은 장축 위에 있다.', '타원은 장축, 단축, 중심에 대하여 각각 대칭이다.', '타원 위의 한 점에서 두 초점에 이르는 거리의 합은 장축의 길이와 같다.',
        '타원을 평행이동하여도 장축의 길이와 단축의 길이는 변하지 않는다.', '장축의 길이를 그대로 두고 두 초점을 서로 가깝게 하면 타원은 원에 가까워진다.', '타원의 장축과 단축의 교점이 타원의 중심이다.'];
      const no = [['타원의 두 초점은 단축 위에 있다.', '두 초점은 장축 위에 있다.', yes[0]],
        ['타원 위의 한 점에서 두 초점에 이르는 거리의 합은 단축의 길이와 같다.', '두 초점에 이르는 거리의 합은 장축의 길이와 같다.', yes[2]],
        ['타원을 평행이동하면 장축의 길이가 달라진다.', '평행이동하여도 모양과 크기가 그대로이므로 장축·단축의 길이는 변하지 않는다.', yes[3]],
        ['장축의 길이를 그대로 두고 두 초점을 서로 가깝게 하면 타원은 점점 납작해진다.', '두 초점이 가까워지면 단축이 길어져 원에 가까워지고, 멀어지면 납작해진다.', yes[4]],
        ['타원은 장축에 대하여 대칭이지만 단축에 대하여는 대칭이 아니다.', '타원은 단축에 대하여도 대칭이다.', yes[1]]];
      const want = d.bool();
      const item = claimQ(d, `타원에 대한 설명으로 ${want ? '옳은' : '옳지 않은'} 것은?`, yes, no, want);
      item.facts.rule = 'facts';
      return item;
    }, { count: 2 }),
    T('eq-vertex', '네 꼭짓점의 좌표로 타원의 방정식과 두 초점의 좌표 구하기', '①7', (d) => {
      const [a, b, c] = d.pick(TRIPLES.slice(0, 8)), onX = d.bool(), aa = onX ? a * a : b * b, bb = onX ? b * b : a * a, xs = sqrtI(aa), ys = sqrtI(bb), [F1, F2] = fociPts(onX, c);
      const vs = d.shuffle([[xs, 0], [-xs, 0], [0, ys], [0, -ys]]).map(([x, y]) => pt(x, y)).join(', ');
      // 꼭짓점의 수는 눈금 대신 점 이름으로 적는다(눈금 글은 곡선이 축과 만나는 자리에 놓여 곡선에 걸린다).
      const figure = ellFig({ aa, bb, dots: [[xs, 0, 'dr'], [-xs, 0, 'dl'], [0, ys, 'ur'], [0, -ys, 'dr']].map(([x, y, side]) => ({ x, y, name: sg(x || y), side, said: '타원의 꼭짓점' })) });
      return inline(`그림과 같이 네 꼭짓점의 좌표가 ${vs}인 타원의 방정식과 두 초점의 좌표를 구하시오.${ORDER}`, frac(X2, '{0}') + ' + ' + frac(Y2, '{1}') + ' = 1<br>두 초점: ' + grp('({2}, {3})') + ', ' + grp('({4}, {5})'),
        [{ answer: aa }, { answer: bb }].concat([F1[0], F1[1], F2[0], F2[1]].map((v) => ({ answer: v, signed: true }))), {
          figure, shown: `${ellEq(aa, bb)}, 두 초점 ${pt(F1[0], F1[1])}, ${pt(F2[0], F2[1])}`,
          explain: `${X}축 위의 꼭짓점이 ${nb('(±' + xs + ', 0)')}, ${Y}축 위의 꼭짓점이 ${nb('(0, ±' + ys + ')')}이므로 타원의 방정식은 ${ellEq(aa, bb)}이다. 장축이 ${axisWord(onX)} 위에 있고 초점까지의 거리는 ${nb(rt(`${Math.max(aa, bb)} ${MINUS} ${Math.min(aa, bb)}`) + ' = ' + c)}이므로 두 초점은 ${pt(F1[0], F1[1])}, ${pt(F2[0], F2[1])}이다.`,
          facts: { calc: [[`${xs}**2`, 0], [`${ys}**2`, 1], [onX ? `(${xs}**2-${ys}**2)**0.5` : '0', 2], [onX ? '0' : `(${ys}**2-${xs}**2)**0.5`, 3], [onX ? `0-(${xs}**2-${ys}**2)**0.5` : '0', 4], [onX ? '0' : `0-(${ys}**2-${xs}**2)**0.5`, 5]] } });
    }),
    T('eq-focus-minor', '두 초점과 단축의 길이로 타원의 방정식 구하기', '①8', (d) => {
      const c = d.int(1, 6), b = d.int(1, 6), big = b * b + c * c, onX = d.bool(), [F1, F2] = fociPts(onX, c), aa = onX ? big : b * b, bb = onX ? b * b : big;
      return ellAns(`두 초점의 좌표가 ${pt(F1[0], F1[1])}, ${pt(F2[0], F2[1])}이고 단축의 길이가 ${2 * b}인 타원의 방정식을 구하시오.`, aa, bb, {
        explain: `두 초점이 ${axisWord(onX)} 위에 있으므로 장축도 ${axisWord(onX)} 위에 있다. 짧은 반축은 ${b}, 초점까지의 거리는 ${c}이므로 긴 반축의 제곱은 ${nb(`${b * b} + ${c * c} = ${big}`)}이다. 따라서 ${ellEq(aa, bb)}이다.`,
        facts: { calc: onX ? [[`(${2 * b}/2)**2+${c}**2`, 0], [`(${2 * b}/2)**2`, 1]] : [[`(${2 * b}/2)**2`, 0], [`(${2 * b}/2)**2+${c}**2`, 1]] } });
    }),
    T('eq-samefoci-major', '다른 타원과 두 초점이 같고 장축의 길이(거리의 합)가 주어진 타원', '①9', (d, n) => {
      const s0 = d.int(2, 12), t0 = d.int(s0 + 1, s0 + 14), onX = d.bool(), aa0 = onX ? t0 : s0, bb0 = onX ? s0 : t0, cc = t0 - s0;
      const a = d.int(Math.floor(Math.sqrt(cc)) + 1, Math.floor(Math.sqrt(cc)) + 5), big = a * a, small = big - cc;
      const aa = onX ? big : small, bb = onX ? small : big, K = coefOf(aa0, bb0);
      const head = n === 0 ? `타원 ${jh(K.text, '과/와')} 두 초점이 같고 장축의 길이가 ${2 * a}인 타원의 방정식을 구하시오.`
        : `타원 ${ellEq(aa0, bb0)}의 두 초점을 F, F′이라 할 때, ${jh(nb(SG('PF') + ' + ' + SG('PF′') + ' = ' + 2 * a), '을/를')} 만족시키는 점 P가 나타내는 도형의 방정식을 구하시오.`;
      return ellAns(head, aa, bb, {
        explain: `${n === 0 ? `양변을 ${jh(K.r, '으로/로')} 나누면 ${ellEq(aa0, bb0)}이므로 ` : ''}두 초점은 ${axisWord(onX)} 위에 있고 초점까지의 거리의 제곱은 ${nb(`${t0} ${MINUS} ${s0} = ${cc}`)}이다. ${n === 0 ? '장축의 길이가' : '두 초점에 이르는 거리의 합이'} ${2 * a}이므로 긴 반축은 ${a}, 짧은 반축의 제곱은 ${nb(`${big} ${MINUS} ${cc} = ${small}`)}이다. 따라서 ${ellEq(aa, bb)}이다.`,
        facts: { calc: onX ? [[`(${2 * a}/2)**2`, 0], [`(${2 * a}/2)**2-(${t0}-${s0})`, 1]] : [[`(${2 * a}/2)**2-(${t0}-${s0})`, 0], [`(${2 * a}/2)**2`, 1]], rule: n === 0 ? 'major' : 'locus' } });
    }, { count: 2 }),
    T('eq-samefoci-point', '다른 타원과 두 초점이 같고 축 위의 한 점을 지나는 타원', '①10', (d) => {
      const s0 = d.int(2, 15), t0 = d.int(s0 + 1, s0 + 16), onX = d.bool(), aa0 = onX ? t0 : s0, bb0 = onX ? s0 : t0, cc = t0 - s0, onFocal = d.bool();
      const p2 = onFocal ? d.int(cc + 1, cc + 20) : d.int(1, 20), big = onFocal ? p2 : p2 + cc, small = onFocal ? p2 - cc : p2;
      if (p2 === aa0 || p2 === bb0 || small < 1) return null;
      const ptOnX = onFocal ? onX : !onX, P = ptOnX ? nb('(' + rootTx(p2) + ', 0)') : nb('(0, ' + rootTx(p2) + ')');
      const aa = onX ? big : small, bb = onX ? small : big;
      return ellAns(`타원 ${jh(ellEq(aa0, bb0), '과/와')} 두 초점이 같고, 점 ${jh(P, '을/를')} 지나는 타원의 방정식을 구하시오.`, aa, bb, {
        explain: `두 초점은 ${axisWord(onX)} 위에 있고 초점까지의 거리의 제곱은 ${nb(`${t0} ${MINUS} ${s0} = ${cc}`)}이다. 점 ${jh(P, '은/는')} ${onFocal ? '두 초점과 같은 축 위에 있으므로 장축의 끝' : '두 초점과 다른 축 위에 있으므로 단축의 끝'}이다. ${onFocal ? `긴 반축의 제곱은 ${p2}, 짧은 반축의 제곱은 ${nb(`${p2} ${MINUS} ${cc} = ${small}`)}` : `짧은 반축의 제곱은 ${p2}, 긴 반축의 제곱은 ${nb(`${p2} + ${cc} = ${big}`)}`}이므로 ${ellEq(aa, bb)}이다.`,
        facts: { calc: onFocal ? (onX ? [[`${p2}`, 0], [`${p2}-(${t0}-${s0})`, 1]] : [[`${p2}-(${t0}-${s0})`, 0], [`${p2}`, 1]]) : (onX ? [[`${p2}+${t0}-${s0}`, 0], [`${p2}`, 1]] : [[`${p2}`, 0], [`${p2}+${t0}-${s0}`, 1]]), unseen: [p2] } });
    }),
    T('eq-samefoci-max', '두 초점이 같은 타원 위의 점 P(p, q)에서 p² + q²의 최댓값', '①11', (d) => {
      const s0 = d.int(2, 12), t0 = d.int(s0 + 1, s0 + 16), onX = d.bool(), aa0 = onX ? t0 : s0, bb0 = onX ? s0 : t0, cc = t0 - s0, b = d.int(1, 6), big = b * b + cc;
      const P = nb('P(' + V('p') + ', ' + V('q') + ')'), want = nb(V('p') + sup(2) + ' + ' + V('q') + sup(2));
      return N(`타원 ${jh(ellEq(aa0, bb0), '과/와')} 두 초점이 같고 단축의 길이가 ${2 * b}인 타원 위에 점 ${P}가 있다. ${want}의 최댓값은?`, big, {
        explain: `두 초점은 ${axisWord(onX)} 위에 있고 초점까지의 거리의 제곱은 ${cc}이다. 새 타원의 짧은 반축은 ${b}이므로 긴 반축의 제곱은 ${nb(`${b * b} + ${cc} = ${big}`)}이다. ${jh(want, '은/는')} 원점에서 점 P까지의 거리의 제곱이고, 원점에서 가장 먼 점은 장축의 끝이므로 최댓값은 ${big}이다.`,
        facts: { value: `(${2 * b}/2)**2+${t0}-${s0}` } });
    })
  ];

  // ═══ 나. 타원의 평행이동 ═══
  const shift = [
    T('sh-move', '표준형 타원을 평행이동한 타원의 방정식과 두 초점', '①12', (d, n) => {
      const m = nz(d, -5, 5), k = nz(d, -5, 5), mv = `${X}축의 방향으로 ${sg(m)}만큼, ${Y}축의 방향으로 ${sg(k)}만큼 평행이동한 타원의`;
      if (n === 0) {
        const s = d.int(2, 20), t = d.int(2, 20);
        if (s === t) return null;
        return shAns(`타원 ${jh(ellEq(s, t), '을/를')} ${mv} 방정식을 구하시오.`, m, k, s, t, {
          explain: `${X} 대신 ${nb(poly([[1, X], [-m, '']]))}, ${Y} 대신 ${jh(nb(poly([[1, Y], [-k, '']])), '을/를')} 넣으면 ${shEq(m, k, s, t)}이다.`,
          facts: { calc: [[`0-${jn(m)}`, 0], [`${s}`, 1], [`0-${jn(k)}`, 2], [`${t}`, 3]], rule: 'eq' } });
      }
      const [a, b, c] = d.pick(TRIPLES.slice(0, 6)), onX = d.bool(), aa = onX ? a * a : b * b, bb = onX ? b * b : a * a;
      const [F1, F2] = fociPts(onX, c).map(([x, y]) => [x + m, y + k]), cE = `(${Math.max(aa, bb)}-${Math.min(aa, bb)})**0.5`;
      return pairAns(`타원 ${jh(ellEq(aa, bb), '을/를')} ${mv} 두 초점의 좌표를 구하시오.`, F1, F2, {
        explain: `타원 ${ellEq(aa, bb)}의 두 초점은 ${fociPts(onX, c).map(([x, y]) => pt(x, y)).join(', ')}이다. 초점도 같은 만큼 옮겨지므로 두 초점은 ${pt(F1[0], F1[1])}, ${pt(F2[0], F2[1])}이다.`,
        facts: { calc: onX ? [[`${cE}+${jn(m)}`, 0], [`${jn(k)}`, 1], [`0-${cE}+${jn(m)}`, 2], [`${jn(k)}`, 3]] : [[`${jn(m)}`, 0], [`${cE}+${jn(k)}`, 1], [`${jn(m)}`, 2], [`0-${cE}+${jn(k)}`, 3]], rule: 'foci' } });
    }, { count: 2 }),
    T('sh-general', '전개된 꼴의 타원에서 중심·장축·단축과 두 초점 구하기', '①13', (d, n) => {
      const [a, b, c] = d.pick(TRIPLES.slice(0, 4)), onX = d.bool(), aa = onX ? a * a : b * b, bb = onX ? b * b : a * a, m = nz(d, -4, 4), k = nz(d, -4, 4);
      const G = genEq(m, k, aa, bb), [p, q, r, s, t] = G.cs;
      const mE = `0-${jn(r)}/(2*${p})`, kE = `0-${jn(s)}/(2*${q})`, RE = `(${p}*(${jn(r)}/(2*${p}))**2+${q}*(${jn(s)}/(2*${q}))**2-${jn(t)})`;
      const how = `완전제곱 꼴로 고치면 ${shEq(m, k, aa, bb)}이다`;
      if (n === 0) {
        return inline(`타원 ${G.text}의 중심의 좌표와 장축, 단축의 길이를 구하시오.`, '중심: ' + grp('({0}, {1})') + '<br>장축의 길이: {2}, 단축의 길이: {3}',
          [{ answer: m, signed: true }, { answer: k, signed: true }, { answer: 2 * a }, { answer: 2 * b }], {
            shown: `중심 ${pt(m, k)}, 장축의 길이 ${2 * a}, 단축의 길이 ${2 * b}`,
            explain: `${how}. 따라서 중심은 ${pt(m, k)}, 장축의 길이는 ${nb(`2 × ${a} = ${2 * a}`)}, 단축의 길이는 ${nb(`2 × ${b} = ${2 * b}`)}이다(평행이동해도 길이는 그대로이다).`,
            facts: { calc: [[mE, 0], [kE, 1], [`2*(${RE}/${onX ? p : q})**0.5`, 2], [`2*(${RE}/${onX ? q : p})**0.5`, 3]], rule: 'center' } });
      }
      const pv = V('p'), qv = V('q'), F = nb(onX ? `F(${pv}, ${sg(k)})` : `F(${sg(m)}, ${pv})`), F2 = nb(onX ? `F′(${qv}, ${sg(k)})` : `F′(${sg(m)}, ${qv})`);
      const hi = onX ? m + c : k + c, lo = onX ? m - c : k - c, cE = `(${RE}/${onX ? p : q}-${RE}/${onX ? q : p})**0.5`;
      return inline(`타원 ${G.text}의 두 초점이 ${F}, ${F2}일 때, 상수 ${pv}, ${qv}의 값을 구하시오. ${nb(`(단, ${pv} &gt; ${qv})`)}`, `${pv} = {0}, ${qv} = {1}`,
        [{ answer: hi, signed: true }, { answer: lo, signed: true }], {
          shown: `${nb(pv + ' = ' + sg(hi))}, ${nb(qv + ' = ' + sg(lo))}`,
          explain: `${how}. 이 타원은 ${ellEq(aa, bb)}을 평행이동한 것이고, 초점까지의 거리는 ${c}이다. 두 초점은 ${pt(onX ? hi : m, onX ? k : hi)}, ${pt(onX ? lo : m, onX ? k : lo)}이므로 ${nb(pv + ' = ' + sg(hi))}, ${nb(qv + ' = ' + sg(lo))}이다.`,
          facts: { calc: [[`${onX ? mE : kE}+${cE}`, 0], [`${onX ? mE : kE}-${cE}`, 1]], rule: 'foci' } });
    }, { count: 2 }),
    T('sh-area', '평행이동한 타원의 두 초점과 원점이 이루는 삼각형의 넓이', '①14', (d) => {
      const [a, b, c] = d.pick(TRIPLES.slice(0, 6)), onX = d.bool(), aa = onX ? a * a : b * b, bb = onX ? b * b : a * a, m = nz(d, -6, 6), k = nz(d, -6, 6);
      const [F1, F2] = fociPts(onX, c).map(([x, y]) => [x + m, y + k]), area = c * Math.abs(onX ? k : m);
      return N(`타원 ${shEq(m, k, aa, bb)}의 두 초점을 A, B라 할 때, 삼각형 OAB의 넓이는? (단, O는 원점이다.)`, area, {
        explain: `초점까지의 거리는 ${nb(rt(`${Math.max(aa, bb)} ${MINUS} ${Math.min(aa, bb)}`) + ' = ' + c)}이고 중심이 ${pt(m, k)}이므로 두 초점은 ${pt(F1[0], F1[1])}, ${pt(F2[0], F2[1])}이다. 밑변 AB의 길이는 ${2 * c}, 높이는 원점에서 직선 AB까지의 거리 ${Math.abs(onX ? k : m)}이므로 넓이는 ${nb(`½ × ${2 * c} × ${Math.abs(onX ? k : m)} = ${area}`)}이다.`,
        facts: { value: `(${Math.max(aa, bb)}-${Math.min(aa, bb)})**0.5*${Math.abs(onX ? k : m)}` } });
    }),
    T('sh-vertex', '네 꼭짓점으로 중심이 원점이 아닌 타원의 방정식과 두 초점 구하기', '①15', (d, n) => {
      const [a, b, c] = d.pick(TRIPLES.slice(0, 6)), onX = d.bool(), aa = onX ? a * a : b * b, bb = onX ? b * b : a * a, xs = sqrtI(aa), ys = sqrtI(bb), m = nz(d, -4, 4), k = nz(d, -4, 4);
      const V4 = [[m + xs, k], [m - xs, k], [m, k + ys], [m, k - ys]], list = d.shuffle(V4).map(([x, y]) => pt(x, y)).join(', ');
      const why = `중심은 마주 보는 두 꼭짓점의 중점 ${pt(m, k)}이고, 가로 반축은 ${xs}, 세로 반축은 ${ys}이다`;
      if (n === 0) {
        // 이름은 축에서 먼 쪽으로 비켜 적는다(오른쪽·왼쪽·위·아래 꼭짓점 차례).
        const sides = [k >= 0 ? 'ur' : 'dr', k >= 0 ? 'ul' : 'dl', m >= 0 ? 'ur' : 'ul', m >= 0 ? 'dr' : 'dl'];
        const figure = ellFig({ aa, bb, cx: m, cy: k, dots: V4.map(([x, y], i) => ({ x, y, name: '(' + sg(x) + ', ' + sg(y) + ')', side: sides[i], said: `(${sg(x)}, ${sg(y)})` })) });
        return shAns(`그림과 같이 네 꼭짓점의 좌표가 ${list}인 타원의 방정식을 구하시오.`, m, k, aa, bb, {
          figure, explain: `${why}. 따라서 ${shEq(m, k, aa, bb)}이다.`,
          facts: { calc: [[`0-(${jn(V4[0][0])}+${jn(V4[1][0])})/2`, 0], [`((${jn(V4[0][0])}-${jn(V4[1][0])})/2)**2`, 1], [`0-(${jn(V4[2][1])}+${jn(V4[3][1])})/2`, 2], [`((${jn(V4[2][1])}-${jn(V4[3][1])})/2)**2`, 3]], rule: 'eq' } });
      }
      const [F1, F2] = fociPts(onX, c).map(([x, y]) => [x + m, y + k]);
      return pairAns(`네 꼭짓점의 좌표가 ${list}인 타원의 두 초점의 좌표를 구하시오.`, F1, F2, {
        explain: `${why}. 장축은 ${onX ? '가로' : '세로'} 방향이고 초점까지의 거리는 ${nb(rt(`${Math.max(aa, bb)} ${MINUS} ${Math.min(aa, bb)}`) + ' = ' + c)}이므로 두 초점은 ${pt(F1[0], F1[1])}, ${pt(F2[0], F2[1])}이다.`,
        facts: { calc: onX ? [[`${jn(m)}+(${aa}-${bb})**0.5`, 0], [`${jn(k)}`, 1], [`${jn(m)}-(${aa}-${bb})**0.5`, 2], [`${jn(k)}`, 3]]
          : [[`${jn(m)}`, 0], [`${jn(k)}+(${bb}-${aa})**0.5`, 1], [`${jn(m)}`, 2], [`${jn(k)}-(${bb}-${aa})**0.5`, 3]], rule: 'foci' } });
    }, { count: 2 }),
    T('sh-match', '전개된 꼴의 타원을 평행이동해 중심이 원점인 타원과 겹치게 하기', '①16', (d) => {
      const p = d.int(1, 5), q = d.int(1, 5);
      if (p === q) return null;
      const tt = d.int(1, 4), r = p * q * tt, m = nz(d, -4, 4), k = nz(d, -4, 4), cst = p * m * m + q * k * k - r;
      const gen = nb(poly([[p, X2], [q, Y2], [-2 * p * m, X], [-2 * q * k, Y], [cst, '']]) + ' = 0'), Av = V('a'), Bv = V('b'), Cv = V('c');
      return inline(`타원 ${jh(gen, '을/를')} ${X}축의 방향으로 ${Av}만큼, ${Y}축의 방향으로 ${Bv}만큼 평행이동하면 타원 ${jh(nb(poly([[p, X2], [q, Y2]]) + ' = ' + Cv), '과/와')} 일치한다. 상수 ${Av}, ${Bv}, ${Cv}의 값을 구하시오.`,
        `${Av} = {0}, ${Bv} = {1}, ${Cv} = {2}`, [{ answer: -m, signed: true }, { answer: -k, signed: true }, { answer: r }], {
          shown: `${nb(Av + ' = ' + sg(-m))}, ${nb(Bv + ' = ' + sg(-k))}, ${nb(Cv + ' = ' + r)}`,
          explain: `완전제곱 꼴로 고치면 ${nb(`${p === 1 ? '' : p}${sq(X, m)} + ${q === 1 ? '' : q}${sq(Y, k)} = ${r}`)}이다. 중심 ${jh(pt(m, k), '이/가')} 원점으로 옮겨지도록 ${X}축의 방향으로 ${sg(-m)}만큼, ${Y}축의 방향으로 ${sg(-k)}만큼 평행이동하면 ${coefTx(p, q, r)}이므로 ${nb(Av + ' = ' + sg(-m))}, ${nb(Bv + ' = ' + sg(-k))}, ${nb(Cv + ' = ' + r)}이다.`,
          facts: { calc: [[`${jn(-2 * p * m)}/(2*${p})`, 0], [`${jn(-2 * q * k)}/(2*${q})`, 1], [`${p}*(${jn(-2 * p * m)}/(2*${p}))**2+${q}*(${jn(-2 * q * k)}/(2*${q}))**2-${jn(cst)}`, 2]] } });
    })
  ];

  // ═══ 다. 타원의 정의로 길이·넓이 구하기(생활 속 타원 포함) ═══
  const def = [
    T('def-tri', '타원 위의 점과 두 초점이 이루는 삼각형의 둘레', '①17', (d) => {
      const [a, b, c] = d.pick(TRIPLES), onX = d.bool(), aa = onX ? a * a : b * b, bb = onX ? b * b : a * a, coef = d.bool() && a <= 13, K = coefOf(aa, bb);
      const per = 2 * a + 2 * c, A = coef ? `${K.r}/${K.p}` : `${aa}`, Bq = coef ? `${K.r}/${K.q}` : `${bb}`, big = onX ? A : Bq, small = onX ? Bq : A;
      return N(`타원 ${coef ? K.text : ellEq(aa, bb)}의 두 초점 F, F′과 타원 위의 점 P에 대하여 삼각형 PF′F의 둘레의 길이는? (단, 점 P는 장축 위에 있지 않다.)`, per, {
        explain: `${coef ? `양변을 ${jh(K.r, '으로/로')} 나누면 ${ellEq(aa, bb)}이다. ` : ''}타원의 정의에서 ${nb(SG('PF') + ' + ' + SG('PF′'))}는 장축의 길이 ${jh(2 * a, '과/와')} 같고, ${nb(SG('FF′') + ' = 2 × ' + rt(`${a * a} ${MINUS} ${b * b}`) + ' = ' + 2 * c)}이다. 따라서 둘레의 길이는 ${nb(`${2 * a} + ${2 * c} = ${per}`)}이다.`,
        facts: { value: `2*(${big})**0.5+2*(${big}-${small})**0.5` } });
    }),
    T('def-chord', '한 초점을 지나는 직선과 다른 초점이 이루는 삼각형의 둘레(4a)', '①18', (d, n) => {
      const a = d.int(3, 8), aa = a * a;
      if (n === 0) {
        const bb = d.int(2, aa - 1), onX = d.bool(), A0 = onX ? aa : bb, B0 = onX ? bb : aa;
        return N(`타원 ${ellEq(A0, B0)}의 두 초점 A, B에 대하여 점 A를 지나는 직선이 타원과 만나는 두 점을 P, Q라 할 때, 삼각형 PBQ의 둘레의 길이는? (단, 직선 PQ는 장축을 품은 직선이 아니다.)`, 4 * a, {
          explain: `타원의 정의에서 ${nb(SG('PA') + ' + ' + SG('PB') + ' = ' + 2 * a)}, ${nb(SG('QA') + ' + ' + SG('QB') + ' = ' + 2 * a)}이다. 삼각형 PBQ의 둘레는 ${nb(SG('PQ') + ' + ' + SG('PB') + ' + ' + SG('QB'))}이고 ${nb(SG('PQ') + ' = ' + SG('PA') + ' + ' + SG('QA'))}이므로 둘레의 길이는 ${nb(`${2 * a} + ${2 * a} = ${4 * a}`)}이다.`,
          facts: { value: `4*${aa}**0.5`, rule: 'origin' } });
      }
      const c = d.int(1, a - 1), bb = aa - c * c;
      return N(`원점 O를 지나는 직선이 타원 ${jh(shEq(c, 0, aa, bb), '과/와')} 만나는 두 점을 P, Q라 하자. 점 ${named('C', 2 * c, 0)}에 대하여 삼각형 PQC의 둘레의 길이는? (단, 직선 PQ는 ${X}축이 아니다.)`, 4 * a, {
        explain: `이 타원은 ${ellEq(aa, bb)}을 ${X}축의 방향으로 ${c}만큼 평행이동한 것이다. 초점까지의 거리는 ${nb(rt(`${aa} ${MINUS} ${bb}`) + ' = ' + c)}이므로 두 초점은 O(0, 0)과 ${named('C', 2 * c, 0)}이다. 타원의 정의에서 ${nb(SG('PO') + ' + ' + SG('PC') + ' = ' + 2 * a)}, ${nb(SG('QO') + ' + ' + SG('QC') + ' = ' + 2 * a)}이고 ${nb(SG('PQ') + ' = ' + SG('PO') + ' + ' + SG('QO'))}이므로 둘레의 길이는 ${4 * a}이다.`,
        facts: { value: `4*${aa}**0.5`, rule: 'shift' } });
    }, { count: 2 }),
    T('def-chord-part', '초점을 지나는 직선과 타원의 두 교점 — 길이의 합', '①19', (d) => {
      const a = d.int(2, 6), c = d.int(1, a - 1), aa = a * a, bb = aa - c * c, [k, s] = sqParts(bb), g = gcd(k, c);
      const slope = s === 1 ? tx(Q(k, c)) : (c / g === 1 ? radText(k / g, s) : frac(radText(k / g, s), c / g));
      const line = nb(`${Y} = ${slope}(${poly([[1, X], [-c, '']])})`), b = Math.sqrt(bb);
      const xA = 2 * aa * c / (aa + c * c), yA = (b / c) * (xA - c);
      const figure = ellFig({ aa, bb, lines: [{ p: [0, -b], q: [c, 0] }], dots: [{ x: xA, y: yA, name: 'A', side: 'r', said: '직선과 타원이 제1사분면에서 만나는 점' }, { x: 0, y: -b, name: 'B', side: 'dr', said: '직선과 타원이 만나는 다른 점' }, { x: -c, y: 0, name: 'C', side: 'dl', said: `C(${MINUS}${c}, 0)` }] });
      return N(`그림과 같이 직선 ${jh(line, '이/가')} 타원 ${jh(ellEq(aa, bb), '과/와')} 만나는 두 점을 각각 A, B라 할 때, 점 ${named('C', -c, 0)}에 대하여 ${nb(SG('AB') + ' + ' + SG('AC'))}의 값은? (단, 점 A는 제1사분면 위의 점이다.)`, 3 * a, {
        figure,
        explain: `타원의 두 초점은 ${nb('(±' + c + ', 0)')}이다. 직선은 ${X}축과 점 ${named('D', c, 0)}에서 만나므로 C와 D는 두 초점이고, ${nb(SG('AD') + ' + ' + SG('AC') + ' = ' + 2 * a)}이다. 직선의 ${Y}절편은 ${rootNeg(bb)}이고 점 ${nb('(0, ' + rootNeg(bb) + ')')}은 타원의 단축의 끝이므로 이 점이 B이고, ${nb(SG('DB') + ' = ' + rt(`${c * c} + ${bb}`) + ' = ' + a)}이다. 따라서 ${nb(SG('AB') + ' + ' + SG('AC') + ' = (' + SG('AD') + ' + ' + SG('AC') + ') + ' + SG('DB') + ` = ${2 * a} + ${a} = ${3 * a}`)}이다.`,
        facts: { value: `3*${aa}**0.5` } });
    }),
    T('def-product', '두 초점까지의 거리의 곱의 최댓값', '①20', (d) => {
      const a = d.int(3, 8), aa = a * a, bb = d.int(2, aa - 1), onX = d.bool(), A0 = onX ? aa : bb, B0 = onX ? bb : aa;
      return N(`타원 ${ellEq(A0, B0)}의 두 초점 F, F′과 타원 위의 점 P에 대하여 ${nb(SG('PF') + ' × ' + SG('PF′'))}의 최댓값은?`, aa, {
        explain: `타원의 정의에서 ${nb(SG('PF') + ' + ' + SG('PF′') + ' = ' + 2 * a)}이다. 두 수는 양수이므로 산술평균과 기하평균의 관계에서 ${nb(rt(SG('PF') + ' × ' + SG('PF′')) + ' ≤ ' + frac(2 * a, 2) + ' = ' + a)}, 곧 ${nb(SG('PF') + ' × ' + SG('PF′') + ' ≤ ' + aa)}이다. 등호는 ${nb(SG('PF') + ' = ' + SG('PF′'))}일 때(점 P가 단축의 끝일 때) 성립하므로 최댓값은 ${aa}이다.`,
        facts: { value: `${aa}` } });
    }),
    T('def-latus', '초점을 지나고 장축에 수직인 직선과 타원이 만드는 삼각형의 넓이', '①22', (d) => {
      const a = d.int(3, 9), c = d.int(1, a - 1), aa = a * a, bb = aa - c * c, area = Q(2 * bb * c, a);
      if (area.q === 1) return null;
      return qAns(`두 초점이 ${named('F′', -c, 0)}, ${named('F', c, 0)}이고 단축의 길이가 ${rootTx(4 * bb)}인 타원과 직선 ${nb(X + ' = ' + c)}의 두 교점을 A, B라 할 때, 삼각형 AF′B의 넓이는?`, area, {
        explain: `짧은 반축의 제곱은 ${bb}, 긴 반축의 제곱은 ${nb(`${bb} + ${c * c} = ${aa}`)}이므로 타원은 ${ellEq(aa, bb)}이다. ${jh(nb(X + ' = ' + c), '을/를')} 넣으면 ${nb(Y2 + ' = ' + bb + ' × ' + frac(bb, aa))}, ${nb(Y + ' = ±' + tx(Q(bb, a)))}이므로 ${nb(SG('AB') + ' = ' + tx(Q(2 * bb, a)))}이다. 넓이는 ${nb(`½ × ${tx(Q(2 * bb, a))} × ${2 * c} = ${tx(area)}`)}이다.`,
        facts: { value: `2*${bb}*${c}/(${bb}+${c}*${c})**0.5` } });
    }),
    T('def-parabola', '포물선의 초점과 한 초점이 같은 타원 — 삼각형의 둘레', '①24', (d) => {
      const p = d.int(1, 3), k = d.int(2, 12), A2 = k + p * p;
      if (isSq(A2)) return null;
      const [r, s] = sqParts(A2), Av = V('a');
      return inline(`타원 ${nb(frac(X2, Av + sup(2)) + ' + ' + frac(Y2, k) + ' = 1')}의 한 초점이 포물선 ${nb(Y2 + ' = ' + 4 * p + X)}의 초점과 일치한다. 이 타원과 포물선이 제1사분면에서 만나는 점을 A, 타원의 두 초점을 F, F′이라 할 때, 삼각형 AF′F의 둘레의 길이는? ${nb(`(단, ${Av} &gt; 0)`)}`,
        '{0} + {1}' + rt('{2}'), [{ answer: 2 * p }, { answer: 2 * r }, { answer: s }], {
          shown: nb(`${2 * p} + ${radText(2 * r, s)}`),
          explain: `포물선 ${nb(Y2 + ' = 4 × ' + p + ' × ' + X)}의 초점은 ${pt(p, 0)}이므로 타원의 한 초점도 ${pt(p, 0)}이고 ${nb(Av + sup(2) + ` = ${k} + ${p * p} = ${A2}`)}이다. 점 A는 타원 위에 있으므로 ${nb(SG('AF') + ' + ' + SG('AF′') + ' = 2' + Av + ' = ' + radText(2 * r, s))}, ${nb(SG('FF′') + ' = ' + 2 * p)}이다. 따라서 둘레의 길이는 ${nb(`${2 * p} + ${radText(2 * r, s)}`)}이다.`,
          facts: { calc: [[`${4 * p}/2`, 0], [`2*((${k}+(${4 * p}/4)**2)/${s})**0.5`, 1], [`${s}`, 2]] } });
    }),
    T('life-shock', '장축·단축의 길이로 두 초점 사이의 거리 구하기(생활)', '②1', (d) => {
      const A = d.int(5, 30), Bh = d.int(3, A - 2), diff = A * A - Bh * Bh, [r, s] = sqParts(diff);
      if (s === 1) return null;
      const room = d.bool(), u = room ? 'm' : 'cm';
      const text = room
        ? `바닥이 장축의 길이가 ${2 * A} m, 단축의 길이가 ${2 * Bh} m인 타원 모양인 방이 있다. 이 방의 한 초점에 선 사람이 작게 말한 소리는 벽에서 반사되어 다른 초점에 모인다. 두 초점 사이의 거리는?`
        : `어떤 의료 기기의 반사 장치는 단면이 장축의 길이가 ${2 * A} cm, 단축의 길이가 ${2 * Bh} cm인 타원의 일부이다. 타원의 한 초점에서 나온 충격파는 반사 장치에서 반사되어 다른 초점에 모인다. 두 초점 사이의 거리는?`;
      return radLen(text, 2 * r, s, u, {
        explain: `긴 반축은 ${A} ${u}, 짧은 반축은 ${Bh} ${u}이므로 초점까지의 거리는 ${nb(rt(`${A}${sup(2)} ${MINUS} ${Bh}${sup(2)}`) + ' = ' + rootTx(diff))} ${u}이다. 두 초점 사이의 거리는 그 2배인 ${radText(2 * r, s)} ${u}이다.`,
        facts: { calc: [[`2*(((${2 * A}/2)**2-(${2 * Bh}/2)**2)/${s})**0.5`, 0], [`${s}`, 1]] } });
    }),
    T('life-orbit', '가장 가까운 거리·가장 먼 거리로 장축의 길이와 두 초점 사이의 거리 구하기(생활)', '②2', (d) => {
      const near = d.int(12, 30) * 100, far = d.int(40, 69) * 100;
      return M(`어느 소행성은 태양을 한 초점으로 하는 타원 궤도를 따라 돈다. 태양과 소행성 사이의 거리는 가장 가까울 때 ${near}만 km, 가장 멀 때 ${far}만 km이다. 이 궤도의 장축의 길이와 두 초점 사이의 거리를 구하시오.`,
        [{ label: '장축의 길이', answer: near + far, unit: '만 km' }, { label: '두 초점 사이의 거리', answer: far - near, unit: '만 km' }], {
          explain: `태양과 가장 가깝고 먼 곳은 장축의 양 끝이다. 긴 반축을 ${V('a')}, 초점까지의 거리를 ${V('c')}라 하면 ${nb(ms('a - c') + ' = ' + near)}, ${nb(ms('a + c') + ' = ' + far)}이므로 장축의 길이 ${nb(ms('2a') + ` = ${near} + ${far} = ${near + far}`)}(만 km), 두 초점 사이의 거리 ${nb(ms('2c') + ` = ${far} ${MINUS} ${near} = ${far - near}`)}(만 km)이다.`,
          facts: { calc: [[`${near}+${far}`, 0], [`${far}-${near}`, 1]] } });
    }),
    T('life-leaf', '타원 모양의 중심에서 장축과 45°를 이루는 두 선분의 길이의 합(생활)', '②3', (d) => {
      const [a, b, h] = d.pick([[4, 3, 5], [8, 6, 10], [12, 5, 13], [15, 8, 17], [12, 9, 15]]), top = 2 * a * b, g = gcd(top, h);
      if (h / g < 2) return null;
      const pond = d.bool(), u = pond ? 'm' : 'cm';
      const text = pond
        ? `장축의 길이가 ${2 * a} m, 단축의 길이가 ${2 * b} m인 타원 모양의 연못이 있다. 연못의 중심 O에서 장축과 45°를 이루는 두 방향으로 연못의 가장자리까지 다리 OP, OQ를 놓았다. 두 다리의 길이의 합은? (단, 두 다리는 장축의 서로 다른 쪽에 있다.)`
        : `장축의 길이가 ${2 * a} cm, 단축의 길이가 ${2 * b} cm인 타원 모양의 나뭇잎이 있다. 나뭇잎의 중심 O에서 가운데 잎맥(장축)과 45°를 이루며 가장자리까지 뻗은 두 잎맥 OP, OQ의 길이의 합은? (단, 두 잎맥은 가운데 잎맥의 서로 다른 쪽에 있다.)`;
      return inline(text, frac('{0}' + rt('{1}'), '{2}') + ' ' + u, [{ answer: top / g }, { answer: 2 }, { answer: h / g }], {
        shown: frac(radText(top / g, 2), h / g) + ' ' + u,
        explain: `중심을 원점, 장축을 ${Y}축에 놓으면 타원은 ${ellEq(b * b, a * a)}이고, 점 P는 직선 ${nb(Y + ' = ' + X)} 위에 있다. ${nb(X2 + ' (' + frac(1, b * b) + ' + ' + frac(1, a * a) + ') = 1')}에서 ${nb(X + ' = ' + tx(Q(a * b, h)))}이므로 ${nb(SG('OP') + ' = ' + frac(radText(a * b / gcd(a * b, h), 2), h / gcd(a * b, h)))}이다. ${nb(SG('OQ') + ' = ' + SG('OP'))}이므로 합은 ${frac(radText(top / g, 2), h / g)} ${u}이다.`,
        facts: { calc: [[`2*(${2 * a}/2)*(${2 * b}/2)/${g}`, 0], ['2', 1], [`((${2 * a}/2)**2+(${2 * b}/2)**2)**0.5/${g}`, 2]] } });
    })
  ];

  B.addUnit({ id: '11-4-2', grade: 11, semester: 4, no: 2, title: '타원', version: 1, groups: [
    { id: 'eq', title: '타원의 방정식', standard: S2, types: eq },
    { id: 'shift', title: '타원의 평행이동', standard: S2, types: shift },
    { id: 'def', title: '타원의 정의로 구하는 길이·넓이', standard: S2, types: def },
    { id: 'tslope', title: '기울기가 주어진 접선', standard: S4, types: [] },
    { id: 'tpoint', title: '타원 위의 점에서의 접선', standard: S4, types: [] },
    { id: 'tout', title: '타원 밖의 점에서 그은 접선', standard: S4, types: [] }
  ] });
})(typeof window !== 'undefined' ? window : globalThis);
