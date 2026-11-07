// 고등학교 기하 Ⅰ-1 포물선 — 단원 틀·도구와 앞쪽 묶음(포물선의 방정식, 포물선의 평행이동, 포물선의 정의).
// 수집해 둔 천재 T셀파 기하(전인태, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 34꼴, 기본꼴_2: 27꼴, 심화 문서 없음)을
// 꼴마다 따져서 실었다. 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-4-1/싣기_대조표.md 에 있다.
// (접선 묶음 넷은 11-4-1b.js 에, 실력 문항은 11-4-1c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
// 성취기준은 12기하01-01(포물선의 뜻을 알고, 포물선을 방정식으로 표현할 수 있다)과 12기하01-04(이차곡선의 접선의 방정식을 구할 수 있다).
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(초점·준선·꼭짓점·그림·전개된 식·평행이동), 묻는 것(방정식·초점·준선·거리·점의 좌표·넓이), 포물선의 꼴
//    (y² = 4px, x² = 4py, y = ax², 평행이동한 꼴)이 다르면 따로 싣는다. 수만 바꾼 유형은 만들지 않는다.
//  - 교육과정 원문의 금 가운데 내용을 못 박은 것만 빼는 까닭으로 썼다: 「이차곡선과 직선과의 관계는 접하는 경우만 다룬다」,
//    「평행이동한 이차곡선의 접선의 방정식은 다루지 않는다」, 미적분Ⅱ의 음함수의 미분법. 정도·복잡함을 말하는 줄은 빼는 까닭으로 쓰지 않았다.
//  - 답: 좌표·계수·상수는 부호 단추가 붙은 칸으로 받는다(단추가 「답이 음수다」를 알려 주지 않게). 길이·넓이·거리만 단추 없이 받는다.
//    한 유형 안에서는 차례·씨앗이 바뀌어도 칸의 모양이 같게 수를 골랐다(정수 칸 유형과 분수 칸 유형을 섞지 않는다). 방정식이 답이면
//    「(y [±][ ])² = [±][ ](x [±][ ])」처럼 식 속 칸으로 받는다 — 축의 방향이 문제 글로 이미 정해지는 차례만 그렇게 받고, 그림에서 방향을 읽어야 하는
//    차례는 고르기로 낸다. 원문의 「a + b + c의 값」「b/a의 값」「M − m의 값」처럼 따로 구한 값을 뜻 없이 묶은 꼴은 값을 칸마다 따로 받는다.
//  - 그림: 고2 공용 plot 으로 그린다. 축이 x축에 평행한 포물선은 매개변수 곡선(x = m + (t − n)²/k, y = t)으로, 축이 y축에 평행한 포물선은 curves 로 그린다.
//    포물선 곡선에는 답이 든 식을 이름으로 달지 않는다. 평가지(쪽 그림 없음)의 그림 문항은 풀이에 남은 값에 맞게 새로 그렸다(대조표에 「그림 새로 지음」).
//  - 답은 모두 코드가 셈한다. 고르기의 참·거짓도 손으로 적지 않고 점의 좌표·대칭이동으로 가린다.
//  - 검사 근거: 수 칸은 문제에 적힌 수로 다시 셈하는 식(facts.value·calc)이고, 글에 없는 수는 seal 이 facts.unseen 에 밝힌다.
//
// 뺀 것과 까닭(11-4-1b.js, 11-4-1c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 서술 전용(사용자 결정): ①9(종이접기로 만든 곡선이 포물선인 까닭 설명), ②18(축에 평행한 빛이 초점을 지남을 설명).
//    ①7·②17·②22는 값을 묻는 부분만 실었다(대칭인 직선·대칭이동한 포물선의 초점과 준선 / 접선의 x절편과 FT / 수직인 두 접선이 지나는 점).
//  - 교육과정 「이차곡선과 직선과의 관계는 접하는 경우만 다룬다」: ②1(k에 따른 교점의 개수), ②8(a = 0, 곧 만나지만 접하지 않는 직선이 답에 드는 꼴).
//  - 교육과정 「평행이동한 이차곡선의 접선의 방정식은 다루지 않는다」: ②10(평행이동한 두 포물선의 공통접선).
//  - 미적분Ⅱ 음함수의 미분법: ②19(같은 접선은 공식 꼴 ②11에 있다).
//  - 겹침: ②6(y = x + k가 접할 때 k)은 ②2와 하는 일이 같아(기울기를 주고 접선의 y절편을 구한다) 한 유형(slope-given)의 둘째 차례로 실었다 —
//    둘째 차례는 계수가 4의 배수가 아닌 포물선이라 답이 분수다.
//  - 바꾼 것: ②21은 원문의 점이 준선 위라 답이 늘 −1이어서 준선 밖의 점으로 바꿨다(사용자 결정). ①20의 답은 칸 모양이 흔들려 고르기로 냈다.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, M, C, inline } = B.kit;
  const { MINUS, gcd, Q, qadd, qsub, qmul, qneg, fl, tx, nb, js, V, sup, nz, poly, rt, sqParts, radText, SG } = B.kit.mid;
  const { qAns, coordAns, plot, signed, jh, sub, fn } = B.kit.hs;
  const S1 = '12기하01-01', S4 = '12기하01-04';

  // ── 검사 근거 마무리 ──
  // 문항에서 보이는 수(검사와 같은 방법으로 읽는다): 글·그림(그림 설명 포함)·보기
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 0과 1과 o.derived 로 밝히기로 한 수만 된다.
  function seal(item) {
    if (item.facts && item.facts.calc) item.facts.calc = item.facts.calc.map(([t, i]) => [`(${t})+0`, i]);
    const f = item.facts || {}, derived = new Set((f.derived || []).map(Number).concat([0, 1])), shown = visibleNumbers(item), out = new Set(f.unseen || []);
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
  // 만들기가 null 을 돌려주면(조건에 맞지 않는 수) 다시 만든다. 다 만든 문항은 seal 로 검사 근거를 마무리한다.
  const retry = (make) => (d, n) => { for (let i = 0; i < 4000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 기본 자료(' + ref + ')', make: retry(make) }, more || {});

  // ── 글 ──
  const X = V('x'), Y = V('y'), Av = V('a'), Bv = V('b'), Cv = V('c'), Kv = V('k'), Pv = V('p'), Mv = V('m'), Nv = V('n');
  const asQ = (v) => (typeof v === 'number' ? Q(v) : v);
  const iq = (v) => tx(asQ(v));                                        // 화면에 적는 수(음수는 −, 분수는 분수 꼴)
  const jn = (v) => js(asQ(v));                                        // 검사 식에 적는 수((-3), (3/4))
  const cv = (v) => (typeof v === 'string' ? v : iq(v));               // 좌표 칸에 적는 것(수 또는 이미 그린 글)
  const pn = (v) => { const q = asQ(v); return q.p < 0 ? `(${iq(q)})` : iq(q); };   // 음수만 괄호에
  const is = (l, r) => nb(`${l} = ${typeof r === 'string' ? r : iq(r)}`);
  const cpt = (x, y) => nb(`(${cv(x)}, ${cv(y)})`);                    // 점의 좌표 (x, y)
  const npt = (name, x, y) => nb(`${name}(${cv(x)}, ${cv(y)})`);       // 이름을 붙인 점 F(2, 0)
  const sq = (v, c) => (asQ(c).p === 0 ? v + sup(2) : `(${poly([[1, v], [qneg(asQ(c)), '']])})${sup(2)}`);   // (v − c)², c = 0 이면 v²
  // k(v − c): c = 0 이면 kv, k = 1 이면 (v − c), k = −1 이면 −(v − c)
  const kv = (k, v, c) => { const K = asQ(k); if (asQ(c).p === 0) return poly([[K, v]]); const inner = `(${poly([[1, v], [qneg(asQ(c)), '']])})`; return K.p === K.q ? inner : K.p === -K.q ? MINUS + inner : iq(K) + inner; };
  const parH = (k, m, n) => nb(`${sq(Y, n || 0)} = ${kv(k, X, m || 0)}`);   // (y − n)² = k(x − m)
  const parV = (k, m, n) => nb(`${sq(X, m || 0)} = ${kv(k, Y, n || 0)}`);   // (x − m)² = k(y − n)
  const eqx = (c) => nb(`${X} = ${iq(c)}`), eqy = (c) => nb(`${Y} = ${iq(c)}`);
  const yline = (m, b) => nb(`${Y} = ${poly([[asQ(m), X], [asQ(b), '']])}`);        // y = mx + b
  const NOTEF = ' <span style="white-space:nowrap">(단, 분수는 기약분수로 적는다.)</span>';
  // 수 뒤 토씨(음수·분수는 크기·분자로 고른다 — jh 가 읽는다)
  const jq = (v, pair) => jh(iq(v), pair);

  // ── 답 ──
  // 수 하나(부호 단추가 늘 붙는다 — 단추가 「답이 음수다」를 알려 주지 않게). 길이·넓이·거리는 posA(단추 없이).
  const numA = (text, v, o) => qAns(text, v, Object.assign({ signed: true }, o));
  const posA = (text, v, o) => qAns(text, v, Object.assign({}, o, { signed: false }));
  // 문자의 값 여럿: 「a = [±][ ]  b = [±][ ]」(셋째 원소가 참이면 부호 단추 없이)
  const vals = (text, pairs, o) => M(text, pairs.map(([lead, answer, bare]) => ({ lead: lead + ' =', answer, signed: !bare })), Object.assign({}, o, { shown: pairs.map(([lead, answer]) => is(lead, answer)).join(', ') }));
  // 분수가 섞일 수 있는 값 여럿: rows = [[앞 글, 값(정수·유리수), 'i' | 'f', 단추 없음]]. 'f' 칸은 분자·분모 두 칸(분자에 부호 단추).
  //  유형마다 칸의 꼴('i'·'f')을 정해 두고, 값이 그 꼴이 아니면 null(수를 다시 고른다).
  function cells(text, rows, o) {
    let k = 0; const parts = [], inputs = [];
    for (const [lead, v, kind, bare] of rows) {
      const q = asQ(v);
      if ((kind === 'f') === (q.q === 1)) return null;
      if (kind === 'f') { parts.push(nb(`${lead} = ${frac('{' + k + '}', '{' + (k + 1) + '}')}`)); inputs.push({ answer: q.p, signed: !bare }, { answer: q.q }); k += 2; }
      else { parts.push(nb(`${lead} = {${k}}`)); inputs.push({ answer: q.p, signed: !bare }); k += 1; }
    }
    const anyF = rows.some((r) => r[2] === 'f');
    return inline(text + (anyF ? NOTEF : ''), parts.join(', '), inputs, Object.assign({}, o, { shown: rows.map(([lead, v]) => is(lead, v)).join(', ') }));
  }
  // 포물선의 방정식이 답: 축이 x축에 평행 「(y [±][ ])² = [±][ ](x [±][ ])」, y축에 평행 「(x [±][ ])² = [±][ ](y [±][ ])」. 세 칸은 −n, k, −m.
  const eqHAns = (text, k, m, n, o) => inline(text, `(${Y} {0})${sup(2)} = {1}(${X} {2})`, [{ answer: -n, signed: true }, { answer: k, signed: true }, { answer: -m, signed: true }], Object.assign({}, o, { shown: parH(k, m, n) }));
  const eqVAns = (text, k, m, n, o) => inline(text, `(${X} {0})${sup(2)} = {1}(${Y} {2})`, [{ answer: -m, signed: true }, { answer: k, signed: true }, { answer: -n, signed: true }], Object.assign({}, o, { shown: parV(k, m, n) }));

  // ── 고르기 ──
  // rows = [{ h, ok }]: ok 가 참인 것이 꼭 하나. 보기를 섞어 고르기 문항으로.
  function pickOne(d, text, rows, o) {
    if (rows.filter((r) => r.ok).length !== 1 || new Set(rows.map((r) => stripH(r.h))).size !== rows.length) return null;
    const list = o && o.keep ? rows : d.shuffle(rows);
    return C(text, list.map((r) => r.h), list.findIndex((r) => r.ok), Object.assign({}, o, { facts: Object.assign({ truth: list.map((r) => r.ok), want: true }, (o && o.facts) || {}) }));
  }
  // ㄱ, ㄴ, ㄷ 가운데 옳은 것을 「있는 대로 고른 것」: 보기 다섯(정답 포함). flags 는 하나 이상 참.
  const GA = ['ㄱ', 'ㄴ', 'ㄷ'];
  const COMBOS = [[0], [1], [2], [0, 1], [0, 2], [1, 2], [0, 1, 2]];
  function comboPick(d, text, list, flags, explain, more) {
    const right = [0, 1, 2].filter((i) => flags[i]);
    if (!right.length) return null;
    const key = (c) => c.join(','), others = d.shuffle(COMBOS.filter((c) => key(c) !== key(right))).slice(0, 4);
    const rows = others.concat([right]).sort((u, v) => u.length - v.length || key(u).localeCompare(key(v)));
    return C(text, rows.map((c) => c.map((i) => GA[i]).join(', ')), rows.findIndex((c) => key(c) === key(right)), Object.assign({ figure: lines(list.map((h, i) => `<b>${GA[i]}.</b> ${h}`)), explain, facts: { truth: rows.map((c) => key(c) === key(right)), want: true } }, more || {}));
  }

  // ── 그림 ──
  const BLUE = '#1d4ed8', RED = '#b42318', GREEN = '#15803d';
  // 그림의 눈금 글: 정수는 −3, 분수는 '−3/4'(세로 분수로 적힌다)
  const tk = (v) => { const q = asQ(v); return { v: fl(q), t: (q.p < 0 ? MINUS : '') + (q.q === 1 ? Math.abs(q.p) : Math.abs(q.p) + '/' + q.q) }; };
  // 축이 x축에 평행한 포물선 (y − n)² = k(x − m) 의 매개변수 곡선(t 는 y): plot 의 params 에 넣는다.
  const hpar = (k, m, n, lo, hi, more) => Object.assign({ x: (t) => m + (t - n) ** 2 / k, y: (t) => t, from: lo, to: hi, color: BLUE }, more || {});
  // 축이 y축에 평행한 포물선 (x − m)² = k(y − n) 의 곡선: plot 의 curves 에 넣는다.
  const vpar = (k, m, n, lo, hi, more) => Object.assign({ f: (x) => n + (x - m) ** 2 / k, from: lo, to: hi, color: BLUE }, more || {});

  // ══ 가. 포물선의 방정식(꼭짓점이 원점) ══
  const eq = [
    // ①1 초점과 준선으로 방정식(차례 1: 초점이 x축 위, 차례 2: y축 위)
    T('eq-fd', '초점과 준선으로 포물선의 방정식 구하기', '①1', (d, n) => {
      const p = nz(d, -6, 6), k = 4 * p, horiz = n === 0;
      const F0 = horiz ? npt('F', p, 0) : npt('F', 0, p), dir = horiz ? eqx(-p) : eqy(-p);
      return inline(`초점이 ${F0}이고 준선이 ${dir}인 포물선의 방정식을 구하시오.`, horiz ? `${Y}${sup(2)} = {0}${X}` : `${X}${sup(2)} = {0}${Y}`, [{ answer: k, signed: true }], {
        shown: horiz ? parH(k, 0, 0) : parV(k, 0, 0),
        explain: `초점이 ${horiz ? 'x' : 'y'}축 위의 점 ${F0}이고 준선이 ${dir}이므로 ${is(Pv, p)}이다. 방정식은 ${horiz ? `${Y}${sup(2)} = 4 × ${pn(p)} × ${X}` : `${X}${sup(2)} = 4 × ${pn(p)} × ${Y}`}, 곧 ${horiz ? parH(k) : parV(k)}이다.`,
        facts: { calc: [[`4*${jn(p)}`, 0]], derived: [4] } });
    }, { count: 2 }),

    // ①2 그림으로 방정식(차례 1: 초점과 준선이 그려진 그림, 차례 2: 꼭짓점이 원점이고 준선만 그려진 그림). 축의 방향을 그림에서 읽어야 하므로 고르기.
    T('eq-figure', '그림으로 포물선의 방정식 구하기', '①2', (d, n) => {
      const horiz = d.bool();
      const p = n === 0 ? Q(d.pick([1, 3, 5, 2, 6, 10]) * d.pick([1, -1]), d.pick([4, 4, 2])) : Q(nz(d, -4, 4));
      const k = qmul(p, Q(4));
      if (k.q !== 1 || (n === 0 && p.q === 1)) return null;
      const s = Math.abs(fl(p));
      const eqOf = (h, c) => (h ? nb(`${Y}${sup(2)} = ${poly([[c, X]])}`) : nb(`${X}${sup(2)} = ${poly([[c, Y]])}`));
      const rows = [{ h: eqOf(horiz, k), ok: true }, { h: eqOf(horiz, qneg(k)), ok: false }, { h: eqOf(!horiz, k), ok: false }, { h: eqOf(!horiz, qneg(k)), ok: false }, { h: eqOf(horiz, qmul(p, Q(2))), ok: false }];
      // 그림: 포물선(곡선 이름 없음), 초점 F(차례 1), 준선
      const far = 2.4 * s, near = 1.7 * s + 0.4, sg = fl(p) > 0 ? 1 : -1;
      const fig = horiz
        ? plot({ x: sg > 0 ? [-near, 1.55 * s + 0.3] : [-1.55 * s - 0.3, near], y: [-far, far], u: 190 / (near + 1.55 * s + 0.3),
          xt: n === 0 ? [tk(p), tk(qneg(p))] : [tk(qneg(p))], params: [hpar(fl(k), 0, 0, -far, far)],
          lines: [{ x: -fl(p), name: n === 0 ? 'l' : 'x=' + iqS(qneg(p)), color: '#1f2933' }], dots: n === 0 ? [{ x: fl(p), y: 0, name: 'F', side: sg > 0 ? 'ur' : 'ul' }] : [] })
        : plot({ x: [-far, far], y: sg > 0 ? [-near, 1.55 * s + 0.3] : [-1.55 * s - 0.3, near], u: 224 / (2 * far),
          yt: n === 0 ? [tk(p), tk(qneg(p))] : [tk(qneg(p))], curves: [vpar(fl(k), 0, 0, -far, far)],
          lines: [{ y: -fl(p), name: n === 0 ? 'l' : 'y=' + iqS(qneg(p)), color: '#1f2933' }], dots: n === 0 ? [{ x: 0, y: fl(p), name: 'F', side: 'ur' }] : [] });
      const text = n === 0 ? '그림과 같이 초점이 F이고 준선이 직선 l인 포물선의 방정식은?' : '그림과 같이 꼭짓점이 원점이고 준선이 그림의 직선인 포물선의 방정식은?';
      return pickOne(d, text, rows, { figure: fig,
        explain: n === 0
          ? `초점이 ${horiz ? 'x' : 'y'}축 위의 점 ${horiz ? npt('F', p, 0) : npt('F', 0, p)}이고 준선이 ${horiz ? eqx(qneg(p)) : eqy(qneg(p))}이므로 ${is(Pv, p)}이다. 방정식은 ${eqOf(horiz, k)}이다.`
          : `꼭짓점이 원점이고 준선이 ${horiz ? eqx(qneg(p)) : eqy(qneg(p))}이므로 초점은 준선의 반대쪽으로 같은 거리에 있는 점 ${horiz ? npt('F', p, 0) : npt('F', 0, p)}이다. ${is(Pv, p)}이므로 방정식은 ${eqOf(horiz, k)}이다.` });
    }, { count: 2 }),

    // ①3 방정식에서 초점의 좌표와 준선의 방정식(차례 1: y² = kx·x² = ky 꼴, 차례 2: y = ax² 꼴 — 답이 분수)
    T('eq-read', '포물선의 방정식에서 초점과 준선 구하기', '①3', (d, n) => {
      if (n === 0) {
        const p = nz(d, -5, 5), k = 4 * p, horiz = d.bool();
        const E = horiz ? parH(k) : parV(k);
        return vals(`포물선 ${E}의 초점의 좌표를 ${cpt(Av, Bv)}, 준선의 방정식을 ${horiz ? `${X} = ${Cv}` : `${Y} = ${Cv}`}라 할 때, 상수 ${Av}, ${Bv}, ${Cv}의 값을 구하시오.`, [[Av, horiz ? p : 0], [Bv, horiz ? 0 : p], [Cv, -p]], {
          explain: `${horiz ? `${Y}${sup(2)} = 4 × ${pn(p)} × ${X}` : `${X}${sup(2)} = 4 × ${pn(p)} × ${Y}`}에서 ${is(Pv, p)}이므로 초점은 ${horiz ? cpt(p, 0) : cpt(0, p)}, 준선은 ${horiz ? eqx(-p) : eqy(-p)}이다.`,
          facts: { calc: horiz ? [[`${jn(k)}/4`, 0], ['0', 1], [`-${jn(k)}/4`, 2]] : [['0', 0], [`${jn(k)}/4`, 1], [`-${jn(k)}/4`, 2]], derived: [4] } });
      }
      const a = nz(d, -5, 5), b = Q(1, 4 * a);
      return cells(`포물선 ${nb(`${Y} = ${poly([[a, X + sup(2)]])}`)}의 초점의 좌표를 ${cpt(0, Bv)}, 준선의 방정식을 ${nb(`${Y} = ${Cv}`)}라 할 때, 상수 ${Bv}, ${Cv}의 값을 구하시오.`, [[Bv, b, 'f'], [Cv, qneg(b), 'f']], {
        explain: `${nb(`${Y} = ${poly([[a, X + sup(2)]])}`)}을 고치면 ${nb(`${X}${sup(2)} = ${poly([[Q(1, a), Y]])}`)} = 4 × ${pn(b)} × ${Y}이다. ${is(Pv, b)}이므로 초점은 ${cpt(0, b)}, 준선은 ${eqy(qneg(b))}이다.`,
        facts: { calc: [[a > 0 ? '1' : '(-1)', 0], [`4*${Math.abs(a)}`, 1], [a > 0 ? '(-1)' : '1', 2], [`4*${Math.abs(a)}`, 3]], derived: [4] } });
    }, { count: 2 }),

    // ①4 초점과 준선 사이의 거리
    T('eq-dist', '초점과 준선 사이의 거리', '①4', (d) => {
      const k = 2 * nz(d, -10, 10), horiz = d.bool(), E = horiz ? parH(k) : parV(k), p = Q(k, 4);
      return posA(`포물선 ${E}의 초점과 준선 사이의 거리는?`, Math.abs(k) / 2, {
        explain: `${is(Pv, p)}이므로 초점은 ${horiz ? cpt(p, 0) : cpt(0, p)}, 준선은 ${horiz ? eqx(qneg(p)) : eqy(qneg(p))}이다. 두 사이의 거리는 2 × ${iq(Q(Math.abs(k), 4))} = ${Math.abs(k) / 2}이다.`,
        facts: { value: `${Math.abs(k)}/2`, derived: [2] } });
    }),

    // ①5 꼭짓점이 원점인 포물선이 지나는 점의 미지수(차례 1: 값이 하나인 좌표, 차례 2: 제곱한 쪽의 좌표 — 부호 조건)
    T('eq-through', '포물선이 지나는 점의 미지수', '①5', (d, n) => {
      const p = nz(d, -4, 4), t = d.int(1, 3) * d.pick([1, -1]), horiz = d.bool();
      const big = p * t * t, small = 2 * p * t;              // 축 방향 좌표, 축에 수직인 좌표
      const F0 = horiz ? npt('F', p, 0) : npt('F', 0, p), k = 4 * p, E = horiz ? parH(k) : parV(k);
      if (n === 0) {
        const P0 = horiz ? cpt(Av, small) : cpt(small, Av);
        return numA(`꼭짓점이 원점이고 초점이 ${F0}인 포물선이 점 ${jh(P0, '을/를')} 지날 때, 상수 ${Av}의 값은?`, big, {
          explain: `포물선의 방정식은 ${E}이다. 점 ${jh(P0, '을/를')} 대입하면 ${nb(`${pn(small)}${sup(2)} = ${iq(k)}${Av}`)}이므로 ${is(Av, big)}이다.`,
          facts: { value: `${jn(small)}*${jn(small)}/(4*${jn(p)})`, derived: [4] } });
      }
      const sign = small > 0 ? 1 : -1, P0 = horiz ? cpt(big, Bv) : cpt(Bv, big);
      return numA(`꼭짓점이 원점이고 초점이 ${F0}인 포물선이 점 ${jh(P0, '을/를')} 지날 때, 상수 ${Bv}의 값은? ${nb(`(단, ${Bv} ${sign > 0 ? '&gt;' : '&lt;'} 0)`)}`, small, {
        explain: `포물선의 방정식은 ${E}이다. 점 ${jh(P0, '을/를')} 대입하면 ${nb(`${Bv}${sup(2)} = ${iq(k)} × ${pn(big)} = ${small * small}`)}이므로 ${nb(`${Bv} = ±${Math.abs(small)}`)}이고, ${nb(`${Bv} ${sign > 0 ? '&gt;' : '&lt;'} 0`)}이므로 ${is(Bv, small)}이다.`,
        facts: { value: `${sign > 0 ? '' : '-'}${2 * Math.abs(p) * Math.abs(t)}`, derived: [2 * Math.abs(p) * Math.abs(t)] } });
    }, { count: 2 }),

    // ①6 지나는 한 점으로 초점(차례 1: 반사경 단면 그림, 차례 2: 안테나의 지름과 깊이)
    T('eq-reflect', '단면이 포물선인 반사경의 초점', '①6', (d, n) => {
      if (n === 0) {
        const [p, s] = d.pick([[1, 2], [2, 2], [1, 3], [1, 4], [3, 2], [2, 3]]), dd = p * s * s, h = 2 * p * s;
        const fig = plot({ x: [-1, dd + 1.5], y: [-h - 1.2, h + 1.2], u: Math.min(204 / (dd + 2.5), 250 / (2 * h + 2.4)), xt: [dd], yt: [h, -h], params: [hpar(4 * p, 0, 0, -h, h)],
          dots: [{ x: dd, y: h, guide: true }, { x: dd, y: -h, guide: true }], segs: [{ p: [dd, -h], q: [dd, h], dash: true }],
          say: `포물선의 꼭짓점은 원점이고 두 점 (${dd}, ${h}), (${dd}, ${MINUS}${h})을 지난다.` });
        return coordAns('그림은 단면이 포물선 모양인 전등 반사경을 꼭짓점이 원점, 축이 x축이 되게 좌표평면 위에 나타낸 것이다. 전구가 이 포물선의 초점에 있을 때, 전구의 위치를 좌표로 나타내시오.', [p, 0], {
          figure: fig, explain: `포물선을 ${nb(`${Y}${sup(2)} = 4${Pv}${X}`)}라 하면 점 ${jh(cpt(dd, h), '을/를')} 지나므로 ${nb(`${h * h} = 4${Pv} × ${dd}`)}, ${is(Pv, p)}이다. 초점은 ${cpt(p, 0)}이다.`,
          facts: { calc: [[`${h}*${h}/(4*${dd})`, 0], ['0', 1]], derived: [4] } });
      }
      const pair = d.until(() => [d.int(4, 16), d.int(10, 30) * 2], ([h, w]) => (w / 2) ** 2 % (4 * h) === 0 && (w / 2) ** 2 / (4 * h) >= 10 && (w / 2) ** 2 / (4 * h) <= 150);
      const [h, w] = pair, r = w / 2, ans = r * r / (4 * h);
      return posA(`단면이 포물선 모양인 접시 안테나의 입구의 지름이 ${w} cm, 깊이가 ${h} cm이다. 수신기를 이 포물선의 초점에 둘 때, 포물선의 꼭짓점에서 수신기까지의 거리는 몇 cm인가?`, ans, {
        unit: 'cm', explain: `꼭짓점을 원점, 축을 x축으로 두면 단면은 ${nb(`${Y}${sup(2)} = 4${Pv}${X}`)} 꼴이고 점 ${jh(cpt(h, r), '을/를')} 지난다. ${nb(`${r * r} = 4${Pv} × ${h}`)}에서 ${is(Pv, ans)}이므로 거리는 ${ans} cm이다.`,
        facts: { value: `${w}*${w}/(16*${h})`, derived: [16] } });
    }, { count: 2 }),

    // ①7 두 포물선이 직선 y = x에 대하여 대칭(차례 1: 대칭이동한 포물선의 초점과 준선, 차례 2: 대칭인 직선 고르기)
    T('eq-sym', '직선 y = x에 대하여 대칭인 두 포물선', '①7', (d, n) => {
      if (n === 0) {
        const p = nz(d, -5, 5), k = 4 * p, fromV = d.bool();     // fromV: x² = ky 를 옮긴다(→ y² = kx)
        const E = fromV ? parV(k) : parH(k);
        return vals(`포물선 ${E}를 직선 ${nb(`${Y} = ${X}`)}에 대하여 대칭이동한 포물선의 초점의 좌표를 ${cpt(Av, Bv)}, 준선의 방정식을 ${fromV ? `${X} = ${Cv}` : `${Y} = ${Cv}`}라 할 때, 상수 ${Av}, ${Bv}, ${Cv}의 값을 구하시오.`, [[Av, fromV ? p : 0], [Bv, fromV ? 0 : p], [Cv, -p]], {
          explain: `${X} 대신 ${Y}, ${Y} 대신 ${jh(X, '을/를')} 넣으면 ${fromV ? parH(k) : parV(k)}이다. ${is(Pv, p)}이므로 초점은 ${fromV ? cpt(p, 0) : cpt(0, p)}, 준선은 ${fromV ? eqx(-p) : eqy(-p)}이다. 처음 포물선의 초점 ${jh(fromV ? cpt(0, p) : cpt(p, 0), '과/와')} 준선이 같은 대칭이동으로 옮겨진 것이다.`,
          facts: { calc: fromV ? [[`${jn(k)}/4`, 0], ['0', 1], [`-${jn(k)}/4`, 2]] : [['0', 0], [`${jn(k)}/4`, 1], [`-${jn(k)}/4`, 2]], derived: [4] } });
      }
      const c = d.int(1, 12), a = c * d.pick([1, -1]), b = c * d.pick([1, -1]);
      // 점 (x, y) 를 옮기는 규칙마다 x² = ay 가 y² = bx 로 가는가
      const maps = [['직선 ' + nb(`${Y} = ${X}`), (x, y) => [y, x]], ['직선 ' + nb(`${Y} = ${MINUS}${X}`), (x, y) => [-y, -x]], ['x축', (x, y) => [x, -y]], ['y축', (x, y) => [-x, y]]];
      // y² = bx 위의 점 (bt², 2bt)/4 꼴 몇 개를 옮겨 x² = ay 위에 있는지 본다(대칭이동은 제 역이다)
      const okOf = (f) => [1, 2, -3].every((t) => { const [x, y] = f(b * t * t / 4, b * t / 2); return Math.abs(x * x - a * y) < 1e-9; });
      const rows = maps.map(([h, f]) => ({ h, ok: okOf(f) }));
      return pickOne(d, `두 포물선 ${parV(a)}, ${jh(parH(b), '은/는')} 어느 직선에 대하여 대칭인가?`, rows, {
        explain: a === b ? `${parV(a)}에서 ${X}와 ${jh(Y, '을/를')} 바꾸면 ${parH(b)}이므로 직선 ${nb(`${Y} = ${X}`)}에 대하여 대칭이다.`
          : `${parV(a)}에서 ${X} 대신 ${MINUS}${Y}, ${Y} 대신 ${MINUS}${jh(X, '을/를')} 넣으면 ${parH(b)}이므로 직선 ${nb(`${Y} = ${MINUS}${X}`)}에 대하여 대칭이다.` });
    }, { count: 2 }),

    // ①8 두 포물선의 초점과 원점이 이루는 삼각형의 넓이
    T('eq-tri', '두 포물선의 초점과 원점이 이루는 삼각형의 넓이', '①8', (d) => {
      const p1 = nz(d, -5, 5), p2 = nz(d, -5, 5);
      if ((p1 * p2) % 2 !== 0) return null;
      const k1 = 4 * p1, k2 = 4 * p2;
      return posA(`두 포물선 ${parH(k1)}, ${parV(k2)}의 초점을 각각 A, B라 할 때, 삼각형 OAB의 넓이는? ${nb('(단, O는 원점이다.)')}`, Math.abs(p1 * p2) / 2, {
        explain: `초점은 ${npt('A', p1, 0)}, ${npt('B', 0, p2)}이다. 삼각형 OAB는 두 변이 좌표축 위에 있는 직각삼각형이므로 넓이는 ${nb(`${frac(1, 2)} × ${Math.abs(p1)} × ${Math.abs(p2)} = ${Math.abs(p1 * p2) / 2}`)}이다.`,
        facts: { value: `${Math.abs(k1)}/4*${Math.abs(k2)}/4/2`, derived: [4, 2] } });
    })
  ];
  // (y − u) 꼴의 인수(u = 0 이면 y)
  function fac(u) { return u === 0 ? Y : `(${poly([[1, Y], [-u, '']])})`; }
  // 그림 속 글(svgm)에 적는 수: −3, 3/4
  function iqS(v) { const q = asQ(v); return (q.p < 0 ? '-' : '') + (q.q === 1 ? Math.abs(q.p) : Math.abs(q.p) + '/' + q.q); }

  // ══ 나. 포물선의 평행이동 ══
  const shift = [
    // ①10 평행이동한 포물선의 초점과 준선(차례 1: y² = kx, 차례 2: x² = ky). 방정식만 묻는 것은 10-2-3과 같은 일이라 초점·준선을 묻는다.
    T('shift-move', '평행이동한 포물선의 초점과 준선', '①10', (d, n) => {
      const p = nz(d, -4, 4), k = 4 * p, m = nz(d, -5, 5), nn = nz(d, -5, 5), horiz = n === 0;
      const E = horiz ? parH(k) : parV(k), dirLead = horiz ? X : Y;
      const ans = horiz ? [p + m, nn, -p + m] : [m, p + nn, -p + nn];
      return inline(`포물선 ${E}를 x축의 방향으로 ${iq(m)}만큼, y축의 방향으로 ${iq(nn)}만큼 평행이동한 포물선의 초점의 좌표와 준선의 방정식을 구하시오.`,
        `초점 ({0}, {1}), 준선 ${dirLead} = {2}`, ans.map((v) => ({ answer: v, signed: true })), {
          shown: `초점 ${cpt(ans[0], ans[1])}, 준선 ${horiz ? eqx(ans[2]) : eqy(ans[2])}`,
          explain: `${E}의 초점은 ${horiz ? cpt(p, 0) : cpt(0, p)}, 준선은 ${horiz ? eqx(-p) : eqy(-p)}이다. 초점과 준선도 같이 옮겨지므로 평행이동한 포물선 ${horiz ? parH(k, m, nn) : parV(k, m, nn)}의 초점은 ${cpt(ans[0], ans[1])}, 준선은 ${horiz ? eqx(ans[2]) : eqy(ans[2])}이다.`,
          facts: { calc: horiz ? [[`${jn(k)}/4+${jn(m)}`, 0], [jn(nn), 1], [`-${jn(k)}/4+${jn(m)}`, 2]] : [[jn(m), 0], [`${jn(k)}/4+${jn(nn)}`, 1], [`-${jn(k)}/4+${jn(nn)}`, 2]], derived: [4] } });
    }, { count: 2 }),

    // ①11 (y − n)² = k(x − m) 꼴에서 초점·준선(차례 1: 정수 답, 차례 2: (x − m)² = k(y − n)에서 k가 4의 배수가 아니라 답이 분수)
    T('shift-std', '평행이동한 꼴의 방정식에서 초점과 준선', '①11', (d, n) => {
      const m = nz(d, -5, 5), nn = nz(d, -5, 5);
      if (n === 0) {
        const p = nz(d, -4, 4), k = 4 * p, E = parH(k, m, nn);
        return vals(`포물선 ${E}의 초점의 좌표를 ${cpt(Av, Bv)}, 준선의 방정식을 ${nb(`${X} = ${Cv}`)}라 할 때, 상수 ${Av}, ${Bv}, ${Cv}의 값을 구하시오.`, [[Av, p + m], [Bv, nn], [Cv, -p + m]], {
          explain: `${jh(E, '은/는')} ${parH(k)}를 x축의 방향으로 ${iq(m)}만큼, y축의 방향으로 ${iq(nn)}만큼 평행이동한 것이다. ${parH(k)}의 초점 ${cpt(p, 0)}, 준선 ${jh(eqx(-p), '을/를')} 옮기면 초점은 ${cpt(p + m, nn)}, 준선은 ${eqx(-p + m)}이다.`,
          facts: { calc: [[`${jn(k)}/4+${jn(m)}`, 0], [jn(nn), 1], [`-${jn(k)}/4+${jn(m)}`, 2]], derived: [4] } });
      }
      const k = d.pick([1, 2, 3, 5, 6, 7]) * d.pick([1, -1]), E = parV(k, m, nn), b = qadd(Q(nn), Q(k, 4)), c = qsub(Q(nn), Q(k, 4));
      const gb = gcd(Math.abs(4 * nn + k), 4), gc = gcd(Math.abs(4 * nn - k), 4);
      return cells(`포물선 ${E}의 초점의 좌표를 ${cpt(Av, Bv)}, 준선의 방정식을 ${nb(`${Y} = ${Cv}`)}라 할 때, 상수 ${Av}, ${Bv}, ${Cv}의 값을 구하시오.`, [[Av, m, 'i'], [Bv, b, 'f'], [Cv, c, 'f']], {
        explain: `${jh(E, '은/는')} ${parV(k)}를 x축의 방향으로 ${iq(m)}만큼, y축의 방향으로 ${iq(nn)}만큼 평행이동한 것이다. ${parV(k)}에서 ${is(Pv, Q(k, 4))}이므로 초점 ${cpt(0, Q(k, 4))}, 준선 ${jh(eqy(Q(-k, 4)), '을/를')} 옮기면 초점은 ${cpt(m, b)}, 준선은 ${eqy(c)}이다.`,
        facts: { calc: [[jn(m), 0], [`(4*${jn(nn)}+${jn(k)})/${gb}`, 1], [`4/${gb}`, 2], [`(4*${jn(nn)}-${jn(k)})/${gc}`, 3], [`4/${gc}`, 4]], derived: [4, gb, gc] } });
    }, { count: 2 }),

    // ①12 전개된 방정식을 고쳐 꼭짓점·초점·준선(차례 1: y² 꼴의 초점·준선, 차례 2: x² 꼴의 꼭짓점·초점·준선, 차례 3: 어떤 평행이동인가 — p, m, n)
    T('shift-expand', '전개된 방정식에서 꼭짓점·초점·준선', '①12', (d, n) => {
      const p = nz(d, -3, 3), k = 4 * p, m = nz(d, -4, 4), nn = nz(d, -4, 4);
      const horiz = n !== 1;
      // (y − n)² = k(x − m) → y² − kx − 2ny + n² + km = 0, (x − m)² = k(y − n) → x² − 2mx − ky + m² + kn = 0
      const E = horiz ? nb(poly([[1, Y + sup(2)], [-k, X], [-2 * nn, Y], [nn * nn + k * m, '']]) + ' = 0') : nb(poly([[1, X + sup(2)], [-2 * m, X], [-k, Y], [m * m + k * nn, '']]) + ' = 0');
      const std = horiz ? parH(k, m, nn) : parV(k, m, nn), base = horiz ? parH(k) : parV(k);
      const why = `주어진 방정식을 고치면 ${std}이고, 이것은 ${base}를 x축의 방향으로 ${iq(m)}만큼, y축의 방향으로 ${iq(nn)}만큼 평행이동한 것이다.`;
      // 검사 식은 글에 적힌 계수로만: k 는 일차항의 계수(−k)에서, 완전제곱의 중심은 일차항의 계수 ÷ (−2)에서, 나머지는 상수항에서 거꾸로 셈한다.
      const kE = `(-${jn(-k)})`;
      if (horiz) {
        const nE = `(${jn(-2 * nn)}/(-2))`, mE = `((${jn(nn * nn + k * m)}-${nE}*${nE})/${kE})`;
        if (n === 0) {
          return vals(`포물선 ${E}의 초점의 좌표를 ${cpt(Av, Bv)}, 준선의 방정식을 ${nb(`${X} = ${Cv}`)}라 할 때, 상수 ${Av}, ${Bv}, ${Cv}의 값을 구하시오.`, [[Av, p + m], [Bv, nn], [Cv, -p + m]], {
            explain: `${why} 초점은 ${cpt(p + m, nn)}, 준선은 ${eqx(-p + m)}이다.`,
            facts: { calc: [[`${kE}/4+${mE}`, 0], [nE, 1], [`-${kE}/4+${mE}`, 2]], derived: [4, 2] } });
        }
        return vals(`포물선 ${jh(E, '은/는')} 포물선 ${nb(`${Y}${sup(2)} = 4${Pv}${X}`)}를 x축의 방향으로 ${Mv}만큼, y축의 방향으로 ${Nv}만큼 평행이동한 것이다. 상수 ${Pv}, ${Mv}, ${Nv}의 값을 구하시오.`, [[Pv, p], [Mv, m], [Nv, nn]], {
          explain: `${why} ${is(Pv, p)}, ${is(Mv, m)}, ${is(Nv, nn)}이다.`,
          facts: { calc: [[`${kE}/4`, 0], [mE, 1], [nE, 2]], derived: [4, 2] } });
      }
      const mE = `(${jn(-2 * m)}/(-2))`, nE = `((${jn(m * m + k * nn)}-${mE}*${mE})/${kE})`;
      const ans = [m, nn, m, p + nn, -p + nn];
      return inline(`포물선 ${E}의 꼭짓점의 좌표, 초점의 좌표, 준선의 방정식을 구하시오.`, `꼭짓점 ({0}, {1}), 초점 ({2}, {3}), 준선 ${Y} = {4}`, ans.map((v) => ({ answer: v, signed: true })), {
        shown: `꼭짓점 ${cpt(m, nn)}, 초점 ${cpt(m, p + nn)}, 준선 ${eqy(-p + nn)}`,
        explain: `${why} 꼭짓점은 ${cpt(m, nn)}, 초점은 ${cpt(m, p + nn)}, 준선은 ${eqy(-p + nn)}이다.`,
        facts: { calc: [[mE, 0], [nE, 1], [mE, 2], [`${kE}/4+${nE}`, 3], [`-${kE}/4+${nE}`, 4]], derived: [4, 2] } });
    }, { count: 3 }),

    // ①13 꼭짓점·초점·준선 가운데 둘로 방정식(차례 1: 꼭짓점과 초점, 차례 2: 초점과 준선(축이 y축에 평행), 차례 3: 꼭짓점과 준선)
    T('shift-two', '꼭짓점·초점·준선 가운데 둘로 포물선의 방정식', '①13', (d, n) => {
      const p = nz(d, -3, 3), m = nz(d, -5, 5), nn = nz(d, -5, 5), k = 4 * p;
      if (n === 0) return eqHAns(`꼭짓점의 좌표가 ${cpt(m, nn)}이고 초점이 ${npt('F', m + p, nn)}인 포물선의 방정식을 구하시오.`, k, m, nn, {
        explain: `꼭짓점과 초점의 ${Y}좌표가 같으므로 축이 x축에 평행하고, 꼭짓점에서 초점까지 ${is(Pv, p)}이다. 방정식은 ${nb(`${sq(Y, nn)} = 4 × ${pn(p)}(${poly([[1, X], [-m, '']])})`)}, 곧 ${parH(k, m, nn)}이다.`,
        facts: { calc: [[`-(${jn(nn)})`, 0], [`4*(${jn(m + p)}-${jn(m)})`, 1], [`-(${jn(m)})`, 2]], derived: [4] } });
      if (n === 1) {
        const F0 = npt('F', m, nn + p), dir = eqy(nn - p);
        return eqVAns(`초점이 ${F0}이고 준선이 ${dir}인 포물선의 방정식을 구하시오.`, k, m, nn, {
          explain: `꼭짓점은 초점과 준선의 한가운데인 ${cpt(m, nn)}이고, 꼭짓점에서 초점까지 ${is(Pv, p)}이다. 방정식은 ${parV(k, m, nn)}이다.`,
          facts: { calc: [[`-(${jn(m)})`, 0], [`2*(${jn(nn + p)}-${jn(nn - p)})`, 1], [`-(${jn(nn + p)}+${jn(nn - p)})/2`, 2]], derived: [2] } });
      }
      const c = m - p, dirText = c === 0 ? 'y축을 준선으로 하는' : `준선이 ${eqx(c)}인`;
      return eqHAns(`꼭짓점의 좌표가 ${cpt(m, nn)}이고 ${dirText} 포물선의 방정식을 구하시오.`, k, m, nn, {
        explain: `준선이 ${eqx(c)}이고 꼭짓점이 ${cpt(m, nn)}이므로 축이 x축에 평행하고, 꼭짓점에서 초점까지 ${is(Pv, p)}이다(초점은 준선의 반대쪽). 방정식은 ${parH(k, m, nn)}이다.`,
        facts: { calc: [[`-(${jn(nn)})`, 0], [`4*(${jn(m)}-${jn(c)})`, 1], [`-(${jn(m)})`, 2]], derived: [4] } });
    }, { count: 3 }),

    // ①14 초점과 준선을 주고 포물선 위의 점 고르기(있는 대로)
    T('shift-points', '초점과 준선이 주어진 포물선 위의 점 고르기', '①14', (d) => {
      const w = nz(d, -3, 3), c = d.int(-3, 3), fy = d.int(-3, 3), fx = c + w;      // 준선 x = c, 초점 (fx, fy), p = w/2
      const vx = Q(fx + c, 2);
      const onPt = (j) => [qadd(vx, Q(w * j * j, 2)), Q(fy + j * w)];
      const isOn = ([x, y]) => { const lhs = qmul(qsub(x, vx), Q(2 * w)), dy = qsub(y, Q(fy)), rhs = qmul(dy, dy); return lhs.p === rhs.p && lhs.q === rhs.q; };
      const pts = [];
      for (const j of d.shuffle([0, 1, -1, 2, -2]).slice(0, 3)) {
        let P0 = onPt(j);
        if (d.bool()) P0 = d.bool() ? [qadd(P0[0], Q(d.pick([1, -1]))), P0[1]] : [P0[0], qadd(P0[1], Q(d.pick([1, -1])))];
        pts.push(P0);
      }
      const flags = pts.map(isOn);
      if (!flags.some(Boolean) || new Set(pts.map(([x, y]) => fl(x) + ',' + fl(y))).size < 3 || pts.some(([x, y]) => Math.abs(fl(x)) > 12 || Math.abs(fl(y)) > 9)) return null;
      const F0 = npt('F', fx, fy), p = Q(w, 2);
      return comboPick(d, `초점이 ${F0}이고 준선이 ${eqx(c)}인 포물선 위의 점만을 보기에서 있는 대로 고른 것은?`, pts.map(([x, y]) => cpt(x, y)), flags,
        `꼭짓점은 초점과 준선의 한가운데인 ${cpt(vx, fy)}이고 ${is(Pv, p)}이므로 포물선은 ${parH(qmul(p, Q(4)), vx, fy)}이다. ` + pts.map(([x, y], i) => `${GA[i]}. ${jh(cpt(x, y), '은/는')} ${flags[i] ? '이 식을 만족시킨다' : '이 식을 만족시키지 않는다'}`).join('. ') + '.');
    }),

    // ①15 준선이 지나는 점으로 p
    T('shift-dirpt', '준선이 지나는 점으로 p 구하기', '①15', (d) => {
      const m = d.int(-4, 4), nn = d.int(-4, 4), p = nz(d, -4, 4), horiz = d.bool(), o = d.int(-5, 5);
      const E = horiz ? nb(`${sq(Y, nn)} = 4${Pv}${m === 0 ? X : `(${poly([[1, X], [-m, '']])})`}`) : nb(`${sq(X, m)} = 4${Pv}${nn === 0 ? Y : `(${poly([[1, Y], [-nn, '']])})`}`);
      const P0 = horiz ? cpt(m - p, o) : cpt(o, nn - p);
      return numA(`포물선 ${E}의 준선이 점 ${jh(P0, '을/를')} 지날 때, 상수 ${Pv}의 값은? ${nb(`(단, ${Pv} ≠ 0)`)}`, p, {
        explain: `이 포물선은 ${nb(`${horiz ? Y : X}${sup(2)} = 4${Pv}${horiz ? X : Y}`)}를 평행이동한 것이므로 준선은 ${horiz ? nb(`${X} = ${MINUS}${Pv} ${m < 0 ? MINUS : '+'} ${Math.abs(m)}`) : nb(`${Y} = ${MINUS}${Pv} ${nn < 0 ? MINUS : '+'} ${Math.abs(nn)}`)}이다. 준선이 점 ${jh(P0, '을/를')} 지나므로 ${horiz ? `${nb(`${iq(m - p)} = ${MINUS}${Pv} ${m < 0 ? MINUS : '+'} ${Math.abs(m)}`)}` : `${nb(`${iq(nn - p)} = ${MINUS}${Pv} ${nn < 0 ? MINUS : '+'} ${Math.abs(nn)}`)}`}, ${is(Pv, p)}이다. ${horiz ? 'y' : 'x'}좌표 ${jq(o, '은/는')} 쓰이지 않는다.`,
        facts: { value: horiz ? `${jn(m)}-${jn(m - p)}` : `${jn(nn)}-${jn(nn - p)}` } });
    }),

    // ①16 두 포물선의 초점이 일치할 때 상수
    T('shift-samefocus', '두 포물선의 초점이 일치할 때 상수', '①16', (d) => {
      const k1 = 4 * nz(d, -4, 4), k2 = 4 * nz(d, -4, 4);
      const E1 = nb(`${Y}${sup(2)} = ${poly([[k1, X], [-k1, Av]])}`), E2 = nb(`${X}${sup(2)} = ${poly([[k2, Y], [-k2, Bv]])}`);
      const a = -k1 / 4, b = -k2 / 4;
      return vals(`두 포물선 ${E1}, ${E2}의 초점이 일치할 때, 상수 ${Av}, ${Bv}의 값을 구하시오.`, [[Av, a], [Bv, b]], {
        explain: `${E1} = ${iq(k1)}(${X} ${MINUS} ${Av})의 초점은 ${cpt(nb(`${Av} ${k1 > 0 ? '+' : MINUS} ${Math.abs(k1 / 4)}`), 0)}, ${E2} = ${iq(k2)}(${Y} ${MINUS} ${Bv})의 초점은 ${cpt(0, nb(`${Bv} ${k2 > 0 ? '+' : MINUS} ${Math.abs(k2 / 4)}`))}이다. 두 점이 같으므로 ${nb(`${Av} ${k1 > 0 ? '+' : MINUS} ${Math.abs(k1 / 4)} = 0`)}, ${nb(`${Bv} ${k2 > 0 ? '+' : MINUS} ${Math.abs(k2 / 4)} = 0`)}에서 ${is(Av, a)}, ${is(Bv, b)}이다.`,
        facts: { calc: [[`-${jn(k1)}/4`, 0], [`-${jn(k2)}/4`, 1]], derived: [4] } });
    }),

    // ①19 세 점을 지나고 축이 x축에 평행한 포물선(두 점은 y축 위)
    T('shift-3pts', '세 점을 지나고 축이 x축에 평행한 포물선', '①19', (d) => {
      const nn = nz(d, -3, 3), g = d.int(1, 3), k = nz(d, -6, 6);
      if ((g * g) % k !== 0) return null;
      const m = -(g * g) / k, u = nn - g, v = nn + g;
      const y3 = d.int(-6, 6);
      const x3 = ((y3 - nn) ** 2 - g * g) / k;
      if (y3 === u || y3 === v || !Number.isInteger(x3) || x3 === 0 || Math.abs(x3) > 9) return null;
      return eqHAns(`축이 x축에 평행한 포물선이 세 점 ${cpt(0, u)}, ${cpt(0, v)}, ${jh(cpt(x3, y3), '을/를')} 지날 때, 이 포물선의 방정식을 구하시오.`, k, m, nn, {
        explain: `축이 x축에 평행하므로 ${X}는 ${Y}의 이차식이고, ${X} = 0일 때 ${is(Y, u)}, ${iq(v)}이므로 ${nb(`${fac(u)}${fac(v)} = ${Kv}${X}`)}로 놓는다. 점 ${jh(cpt(x3, y3), '을/를')} 넣으면 ${is(Kv, k)}이고, 정리하면 ${parH(k, m, nn)}이다.`,
        facts: { calc: [[`-(${jn(u)}+${jn(v)})/2`, 0], [`(${jn(y3)}-${jn(u)})*(${jn(y3)}-${jn(v)})/${jn(x3)}`, 1], [`(${jn(v)}-${jn(u)})*(${jn(v)}-${jn(u)})/4/((${jn(y3)}-${jn(u)})*(${jn(y3)}-${jn(v)})/${jn(x3)})`, 2]], derived: [2, 4] } });
    })
  ];

  // ══ 다. 포물선의 정의 — 초점까지의 거리와 준선까지의 거리 ══
  const def = [
    // ①21 포물선 위의 점에서 초점까지의 거리
    T('def-dist', '포물선 위의 점에서 초점까지의 거리', '①21', (d) => {
      const p = nz(d, -4, 4), t = nz(d, -3, 3), horiz = d.bool(), k = 4 * p, big = p * t * t, small = 2 * p * t;
      const E = horiz ? parH(k) : parV(k), P0 = horiz ? cpt(big, small) : cpt(small, big);
      return posA(`포물선 ${E} 위의 점 ${P0}에서 초점까지의 거리는?`, Math.abs(big) + Math.abs(p), {
        explain: `초점까지의 거리는 준선 ${horiz ? eqx(-p) : eqy(-p)}까지의 거리와 같으므로 ${nb(`|${iq(big)} ${p > 0 ? '+' : MINUS} ${Math.abs(p)}| = ${Math.abs(big) + Math.abs(p)}`)}이다.`,
        facts: { value: `${Math.abs(big)}+${Math.abs(k)}/4`, derived: [4] } });
    }),

    // ①22 초점까지의 거리로 포물선 위의 점의 좌표(차례 1: 한 좌표, 차례 2: 제1사분면의 점의 좌표 — y좌표가 근호)
    T('def-coord', '초점까지의 거리로 포물선 위의 점의 좌표', '①22', (d, n) => {
      if (n === 0) {
        const p = nz(d, -4, 4), L = Math.abs(p) + d.int(1, 9), horiz = d.bool(), k = 4 * p, c = (p > 0 ? 1 : -1) * (L - Math.abs(p));
        const E = horiz ? parH(k) : parV(k);
        return numA(`포물선 ${E} 위의 점 P와 초점 F에 대하여 ${nb(`${SG('PF')} = ${L}`)}일 때, 점 P의 ${horiz ? 'x' : 'y'}좌표는?`, c, {
          explain: `${SG('PF')}는 점 P에서 준선 ${horiz ? eqx(-p) : eqy(-p)}까지의 거리와 같다. 점 P의 ${horiz ? 'x' : 'y'}좌표를 ${Av}라 하면 ${nb(`|${Av} ${p > 0 ? '+' : MINUS} ${Math.abs(p)}| = ${L}`)}이고, 포물선 위의 점은 ${p > 0 ? `${Av} ≥ 0` : `${Av} ≤ 0`}이므로 ${is(Av, c)}이다.`,
          facts: { value: p > 0 ? `${L}-${Math.abs(k)}/4` : `-(${L}-${Math.abs(k)}/4)`, derived: [4] } });
      }
      const p = d.int(1, 4), L = p + d.int(1, 9), x = L - p, [s, r] = sqParts(p * x);
      if (r === 1) return null;
      const k = 4 * p;
      return inline(`포물선 ${parH(k)} 위의 점 A가 제1사분면 위에 있다. 점 A와 포물선의 초점 F에 대하여 ${nb(`${SG('AF')} = ${L}`)}일 때, 점 A의 좌표를 구하시오.`, `A({0}, {1}${rt('{2}')})`, [{ answer: x, signed: true }, { answer: 2 * s, signed: true }, { answer: r }], {
        shown: npt('A', x, radText(2 * s, r)),
        explain: `${SG('AF')}는 점 A에서 준선 ${eqx(-p)}까지의 거리와 같으므로 점 A의 x좌표는 ${nb(`${L} ${MINUS} ${p} = ${x}`)}이다. ${nb(`${Y}${sup(2)} = ${k} × ${x} = ${k * x}`)}이고 ${nb(`${Y} &gt; 0`)}이므로 ${is(Y, radText(2 * s, r))}이다.`,
        facts: { calc: [[`${L}-${k}/4`, 0], [String(2 * s), 1], [String(r), 2]], derived: [4, 2 * s, r] } });
    }, { count: 2 }),

    // ①23 초점까지의 거리와 축에 내린 수선 — 삼각형의 넓이
    T('def-area', '초점까지의 거리와 수선으로 삼각형의 넓이', '①23', (d) => {
      const p = d.int(1, 3), t = d.pick([2, 3]), horiz = d.bool(), k = 4 * p;
      const x = p * t * t, AH = 2 * p * t, FH = p * (t * t - 1), L = p * (t * t + 1), area = FH * AH / 2;
      const E = horiz ? parH(k) : parV(k);
      return posA(`포물선 ${E} 위의 점 A에서 ${horiz ? 'x' : 'y'}축에 내린 수선의 발을 H, 포물선의 초점을 F라 하자. ${nb(`${SG('AF')} = ${L}`)}일 때, 삼각형 AFH의 넓이는? (단, 점 A는 제1사분면 위의 점이다.)`, area, {
        explain: `${SG('AF')}는 점 A에서 준선 ${horiz ? eqx(-p) : eqy(-p)}까지의 거리와 같으므로 점 A의 ${horiz ? 'x' : 'y'}좌표는 ${nb(`${L} ${MINUS} ${p} = ${x}`)}이다. ${nb(`${SG('FH')} = ${x} ${MINUS} ${p} = ${FH}`)}이고, 점 A의 ${horiz ? 'y' : 'x'}좌표의 제곱이 ${nb(`${k} × ${x} = ${AH * AH}`)}이므로 ${nb(`${SG('AH')} = ${AH}`)}이다. 넓이는 ${nb(`${frac(1, 2)} × ${FH} × ${AH} = ${area}`)}이다.`,
        facts: { value: `${FH}*${AH}/2`, derived: [FH, AH, 2] } });
    }),

    // ①24 삼각형 PHF가 정삼각형일 때 점 P
    T('def-equi', '삼각형 PHF가 정삼각형일 때 점 P', '①24', (d) => {
      const p = nz(d, -4, 4), k = 4 * p, x = 3 * p;
      return inline(`포물선 ${parH(k)}의 초점을 F, 포물선 위의 점 P에서 준선에 내린 수선의 발을 H라 하자. 삼각형 PHF가 정삼각형일 때, 점 P의 좌표를 구하시오. (단, 점 P의 y좌표는 양수이다.)`,
        `P({0}, {1}${rt('{2}')})`, [{ answer: x, signed: true }, { answer: 2 * Math.abs(p), signed: true }, { answer: 3 }], {
          shown: npt('P', x, radText(2 * Math.abs(p), 3)),
          explain: `${nb(`${SG('PF')} = ${SG('PH')}`)}는 늘 성립하므로 ${nb(`${SG('PH')} = ${SG('HF')}`)}이면 된다. ${nb(`P(${V('x')}${sub(1)}, ${V('y')}${sub(1)})`)}이라 하면 H(${iq(-p)}, ${V('y')}${sub(1)})이고 ${nb(`(${V('x')}${sub(1)} ${p > 0 ? '+' : MINUS} ${Math.abs(p)})${sup(2)} = ${V('y')}${sub(1)}${sup(2)} + ${4 * p * p}`)}, ${nb(`${V('y')}${sub(1)}${sup(2)} = ${k}${V('x')}${sub(1)}`)}에서 ${nb(`${V('x')}${sub(1)} = ${iq(x)}`)}이다(다른 근 ${jq(-p, '은/는')} 이 포물선 위의 점의 x좌표가 될 수 없다). ${nb(`${V('y')}${sub(1)}${sup(2)} = ${12 * p * p}`)}이므로 점 P는 ${npt('P', x, radText(2 * Math.abs(p), 3))}이다.`,
          facts: { calc: [[`3*${jn(k)}/4`, 0], [`2*${Math.abs(k)}/4`, 1], ['3', 2]], derived: [3, 4, 2] } });
    }),

    // ①25 준선(y축) 위의 수선의 발과 PF : FQ — sin(∠FPH)
    T('def-sin', '수선의 발과 직선 PF가 만든 각의 sin 값', '①25', (d) => {
      const r = d.pick([1, 2, 3]);
      const val = (rr) => { const [s, t] = sqParts(rr * rr + 2 * rr); return { h: frac(radText(s, t), rr + 1), v: s * Math.sqrt(t) / (rr + 1) }; };
      const right = val(r), others = [1, 2, 3].filter((t) => t !== r).map(val);
      const [ts, tt] = sqParts(r * r + 2 * r);
      const rows = [{ h: right.h, ok: true }, { h: frac(1, r + 1), ok: false }, { h: radText(ts, tt), ok: false }].concat(others.map((o) => ({ h: o.h, ok: false })));
      // 그림: 초점 F(2, 0), 준선 y축, 꼭짓점 (1, 0)인 포물선 y² = 4(x − 1). P 는 x = 2 + 2/r 인 위쪽 점, Q = (0, −r·yP), H = (0, yP)
      const xP = 2 + 2 / r, yP = Math.sqrt(4 * (xP - 1)), yQ = -r * yP;
      const fig = plot({ x: [-0.6, xP + 0.9], y: [yQ - 0.6, yP + 1.1], u: Math.min(30, 236 / (yP - yQ + 1.7)), params: [hpar(4, 1, 0, yQ - 0.6, yP)],
        segs: [{ p: [xP, yP], q: [0, yQ], color: '#1f2933' }, { p: [xP, yP], q: [0, yP], dash: true }],
        dots: [{ x: 2, y: 0, name: 'F', side: 'dr' }, { x: xP, y: yP, name: 'P', side: 'ur' }, { x: 0, y: yP, name: 'H', side: 'ul' }, { x: 0, y: yQ, name: 'Q', side: 'ul' }],
        say: '포물선의 초점 F는 x축 위에 있고 준선은 y축이다. 점 P는 포물선 위, 점 H는 P에서 y축에 내린 수선의 발, 점 Q는 직선 PF와 y축의 교점이다.' });
      const cond = r === 1 ? nb(`${SG('PF')} = ${SG('FQ')}`) : nb(`${SG('PF')} : ${SG('FQ')} = 1 : ${r}`);
      return pickOne(d, `그림과 같이 x축 위의 점 F를 초점으로 하고 y축을 준선으로 하는 포물선이 있다. 포물선 위의 점 P에서 준선에 내린 수선의 발을 H, 직선 PF가 y축과 만나는 점을 Q라 하자. ${cond}일 때, ${nb(`${fn('sin')}(∠FPH)`)}의 값은?`, rows, {
        figure: fig,
        explain: `포물선의 정의에서 ${nb(`${SG('PH')} = ${SG('PF')}`)}이다. ${nb(`${SG('PF')} = ${Av}`)}라 하면 ${nb(`${SG('PQ')} = ${r + 1}${Av}`)}이고 삼각형 PHQ는 ∠PHQ = 90°인 직각삼각형이므로 ${nb(`${SG('HQ')} = ${radText(ts, tt)}${Av}`)}이다. ${nb(`${fn('sin')}(∠FPH) = ${frac(SG('HQ'), SG('PQ'))} = ${right.h}`)}이다.` });
    }),

    // ①26 초점을 지나는 직선과 준선에 내린 수선 — 사각형의 둘레
    T('def-quad', '초점을 지나는 직선과 준선에 내린 수선으로 사각형의 둘레', '①26', (d) => {
      const s = d.int(8, 16), t = d.int(5, s - 1);
      const p = t * t / (4 * s), sig = t * Math.sqrt(1 - (t * t) / (s * s)), y1 = (sig + t) / 2, y2 = (sig - t) / 2, x1 = y1 * y1 / (4 * p), x2 = y2 * y2 / (4 * p);
      if (x1 > 3.4 * p + 6 || x1 / p > 9) return null;
      const xr = [-p - 1, x1 + 1.2], yr = [y2 - 1.2, y1 + 1.2];
      const fig = plot({ x: xr, y: yr, w: 250, params: [hpar(4 * p, 0, 0, yr[0], yr[1])], lines: [{ x: -p, name: 'l', color: '#1f2933' }],
        segs: [{ p: [x1, y1], q: [x2, y2], color: '#1f2933' }, { p: [x1, y1], q: [-p, y1], dash: true }, { p: [x2, y2], q: [-p, y2], dash: true }],
        dots: [{ x: x1, y: y1, name: 'A' }, { x: x2, y: y2, name: 'B' }, { x: -p, y: y1, name: 'C', side: 'ul' }, { x: -p, y: y2, name: 'D', side: 'dl' }, { x: p, y: 0, name: 'F' }],
        say: '직선 AB는 포물선의 초점 F를 지나고, 두 점 C, D는 점 A, B에서 준선 l에 내린 수선의 발이다.' });
      return posA(`그림과 같이 포물선 ${nb(`${Y}${sup(2)} = 4${Pv}${X}`)}의 초점 F를 지나는 직선이 포물선과 만나는 점을 각각 A, B라 하고, 두 점 A, B에서 준선 l에 내린 수선의 발을 각각 C, D라 하자. ${nb(`${SG('AB')} = ${s}`)}, ${nb(`${SG('CD')} = ${t}`)}일 때, 사각형 ACDB의 둘레의 길이는?`, 2 * s + t, {
        figure: fig, explain: `포물선의 정의에서 ${nb(`${SG('AC')} = ${SG('AF')}`)}, ${nb(`${SG('BD')} = ${SG('BF')}`)}이므로 ${nb(`${SG('AC')} + ${SG('BD')} = ${SG('AB')} = ${s}`)}이다. 둘레는 ${nb(`${s} + ${s} + ${t} = ${2 * s + t}`)}이다.`,
        facts: { value: `2*${s}+${t}`, derived: [2] } });
    }),

    // ①28 세 점에서 초점까지의 거리의 합 — y좌표 제곱의 합
    T('def-sum3', '세 점에서 초점까지의 거리의 합으로 y좌표 제곱의 합', '①28', (d) => {
      const p = d.int(1, 4), k = 4 * p, S = 3 * p + d.int(2, 12), ans = k * (S - 3 * p);
      const P3 = ['A', 'B', 'C'].map((nm, i) => nb(`${nm}(${V('x')}${sub(i + 1)}, ${V('y')}${sub(i + 1)})`));
      const sumY = nb([1, 2, 3].map((i) => V('y') + sub(i) + sup(2)).join(' + '));
      return posA(`포물선 ${parH(k)} 위의 세 점 ${P3.join(', ')}에서 초점까지의 거리의 합이 ${S}일 때, ${sumY}의 값은?`, ans, {
        explain: `점 ${nb(`(${V('x')}${sub(1)}, ${V('y')}${sub(1)})`)}에서 초점까지의 거리는 준선 ${eqx(-p)}까지의 거리 ${nb(`${V('x')}${sub(1)} + ${p}`)}이다. 세 거리의 합에서 ${nb(`${V('x')}${sub(1)} + ${V('x')}${sub(2)} + ${V('x')}${sub(3)} = ${S} ${MINUS} ${3 * p} = ${S - 3 * p}`)}이고 ${nb(`${V('y')}${sub(1)}${sup(2)} = ${k}${V('x')}${sub(1)}`)}이므로 구하는 값은 ${nb(`${k} × ${S - 3 * p} = ${ans}`)}이다.`,
        facts: { value: `${k}*(${S}-3*${k}/4)`, derived: [3, 4] } });
    }),

    // ①29 무게중심이 초점인 세 점 — 초점까지의 거리의 합
    T('def-centroid', '무게중심이 초점인 세 점에서 초점까지의 거리의 합', '①29', (d) => {
      const p = nz(d, -6, 6), k = 4 * p, ans = 6 * Math.abs(p);
      return posA(`포물선 ${parH(k)} 위의 서로 다른 세 점 A, B, C에 대하여 삼각형 ABC의 무게중심이 이 포물선의 초점 F일 때, ${nb(`${SG('AF')} + ${SG('BF')} + ${SG('CF')}`)}의 값은?`, ans, {
        explain: `세 점의 x좌표를 ${Av}, ${Bv}, ${Cv}라 하면 무게중심의 x좌표가 초점의 x좌표 ${iq(p)}이므로 ${nb(`${Av} + ${Bv} + ${Cv} = ${iq(3 * p)}`)}이다. 각 점에서 초점까지의 거리는 준선 ${eqx(-p)}까지의 거리 ${p > 0 ? nb(`${Av} + ${p}`) : nb(`${Math.abs(p)} ${MINUS} ${Av}`)} 꼴이므로 합은 ${nb(`${3 * Math.abs(p)} + ${3 * Math.abs(p)} = ${ans}`)}이다.`,
        facts: { value: `6*${Math.abs(k)}/4`, derived: [6, 4] } });
    }),

    // ①32 축에 평행한 빛이 초점을 지나 반사되는 경로의 길이
    T('def-light', '축에 평행한 빛이 초점을 지나 반사되는 경로의 길이', '①32', (d) => {
      const p = d.int(1, 3), x0 = d.int(2, 6) * d.pick([1, -1]), yA = x0 * x0 / (4 * p), xB = -4 * p * p / x0, yB = xB * xB / (4 * p);
      const c = Math.ceil(Math.max(yA, yB)) + d.int(1, 4);
      if (c > 10 || Math.abs(xB) < 0.6) return null;
      const xs = [x0, xB, 0], lo = Math.min(...xs) - 1, hi = Math.max(...xs) + 1;
      const fig = plot({ x: [lo, hi], y: [-0.6, c + 1.2], w: 260, curves: [vpar(4 * p, 0, 0, lo, hi)], lines: [{ y: c, name: 'y=' + c, color: '#1f2933' }],
        segs: [{ p: [x0, c], q: [x0, yA], color: RED }, { p: [x0, yA], q: [xB, yB], color: RED }, { p: [xB, yB], q: [xB, c], color: RED }],
        dots: [{ x: x0, y: c, name: 'P', side: x0 > 0 ? 'ur' : 'ul' }, { x: xB, y: c, name: 'Q', side: xB > 0 ? 'ur' : 'ul' }, { x: 0, y: p, name: 'F', side: x0 > 0 ? 'ul' : 'ur' }],
        say: `빛은 점 P에서 y축에 평행하게 내려가 포물선에서 반사되어 초점 F를 지나고, 포물선의 다른 점에서 반사되어 y축에 평행하게 올라가 점 Q에 닿는다.` });
      return posA(`그림과 같이 직선 ${eqy(c)} 위의 점 ${npt('P', x0, c)}에서 y축에 평행하게 나아간 빛이 포물선 ${parV(4 * p)}에서 반사되어 초점 F를 지나고, 포물선의 다른 점에서 다시 반사되어 y축에 평행하게 나아가 직선 ${eqy(c)} 위의 점 Q에 도달하였다. 빛이 점 P에서 점 Q까지 나아간 거리는?`, 2 * c + 2 * p, {
        figure: fig, explain: `빛이 포물선과 만난 두 점을 A, B라 하면 ${nb(`${SG('AF')}`)}, ${jh(SG('BF'), '은/는')} 준선 ${eqy(-p)}까지의 거리와 같다. 점 A의 y좌표를 ${V('s')}, 점 B의 y좌표를 ${jh(V('t'), '이라/라')} 하면 거리는 ${nb(`(${c} ${MINUS} ${V('s')}) + (${V('s')} + ${p}) + (${V('t')} + ${p}) + (${c} ${MINUS} ${V('t')}) = ${2 * c + 2 * p}`)}이다.`,
        facts: { value: `2*${c}+2*${4 * p}/4`, derived: [2, 4] } });
    })
  ];

  // b·c 파일이 함께 쓰는 도구
  B.kit.u1141 = {
    S1, S4, T, H, seal, stripH, X, Y, Av, Bv, Cv, Kv, Pv, Mv, Nv, asQ, iq, jn, cv, pn, is, cpt, npt, sq, kv, parH, parV, eqx, eqy, yline, NOTEF, jq,
    numA, posA, vals, cells, eqHAns, eqVAns, pickOne, comboPick, GA, BLUE, RED, GREEN, tk, hpar, vpar, iqS
  };

  B.addUnit({ id: '11-4-1', grade: 11, semester: 4, no: 1, title: '포물선', version: 1, groups: [
    { id: 'eq', title: '포물선의 방정식', standard: S1, types: eq },
    { id: 'shift', title: '포물선의 평행이동', standard: S1, types: shift },
    { id: 'def', title: '포물선의 정의와 거리', standard: S1, types: def },
    { id: 'slope', title: '기울기가 주어진 접선', standard: S4, types: [] },
    { id: 'point', title: '포물선 위의 점에서의 접선', standard: S4, types: [] },
    { id: 'outer', title: '포물선 밖의 점에서 그은 접선', standard: S4, types: [] },
    { id: 'figure', title: '접선과 도형', standard: S4, types: [] }
  ] });
})(typeof window !== 'undefined' ? window : globalThis);
