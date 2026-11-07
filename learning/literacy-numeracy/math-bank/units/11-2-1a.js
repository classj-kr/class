// 고등학교 미적분Ⅰ Ⅰ-1 함수의 극한 — 단원 틀·도구와 앞쪽 묶음(함수의 수렴과 발산, 우극한과 좌극한, 함수의 극한에 대한 성질).
// 수집해 둔 천재 T셀파 미적분Ⅰ(홍진곤, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 29꼴, 기본꼴_2: 24꼴, 심화 문서 없음)을
// 꼴마다 따져서 실었다. 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-2-1/싣기_대조표.md 에 있다.
// (극한값의 계산·미정계수·다항함수 정하기·대소 관계·도형과 극한은 11-2-1b.js 에, 실력 문항은 11-2-1c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
// 성취기준은 12미적Ⅰ-01-01(함수의 극한의 뜻을 알고, 이를 설명할 수 있다)과 12미적Ⅰ-01-02(함수의 극한에 대한 성질을 이해하고, 함수의 극한값을 구할 수 있다).
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(그래프·식·표·극한 조건), 묻는 것(극한값·한쪽 극한·수렴과 발산·미정계수·함숫값), 식의 꼴(0/0, ∞/∞, ∞ − ∞,
//    근호가 분자에 있는가 분모에 있는가, x → −∞)이 다르면 따로 싣는다. 수만 바꾼 유형은 만들지 않는다.
//  - 교육과정: 「복잡한 합성함수나 절댓값이 여러 개 포함된 함수와 같이 지나치게 복잡한 함수를 포함하는 문제는 다루지 않는다」는 정도의 말이라
//    빼는 까닭으로 쓰지 않았다(합성함수·절댓값은 하나씩만 든 꼴뿐이다). 사용자가 정한 대로 꼬여 있거나 경우를 따져야 하는 꼴은 실력에 싣는다.
//  - 답: 극한값·계수·함숫값은 부호 단추가 붙은 수 칸(분수 답은 분자·분모 칸)으로 받는다. 한 유형 안에서는 차례·씨앗이 바뀌어도 답이 늘 정수이거나
//    늘 정수가 아닌 분수가 되게 수를 골라 칸의 모양이 답을 흘리지 않게 했다. 수렴·발산을 가리는 것은 고르기로, 개수와 요금·점수만 단추 없이 받는다.
//    원문의 「a + b의 값」「f(1) + f(3)의 값」「두 극한의 합」처럼 따로 구한 값을 뜻 없이 더한 꼴은 값을 칸마다 따로 받는다.
//  - 그림: 고2 공용 plot 으로 그린다. 끊긴 곳의 끝점은 속이 빈 점(○)과 찬 점(●)으로 가르고, 그림 설명(aria-label)에 선분의 두 끝과 점의 좌표를 적는다.
//    원문 그림을 알 수 없는 평가지 문항(①5의 셋, ①6, ①7, ①13)은 풀이에 남은 단서에 맞게 그래프를 새로 지었다(대조표에 「그림 새로 지음」).
//  - 답은 모두 코드가 셈한다. 고르기의 참·거짓도 손으로 적지 않고 함수의 값으로 가린다(극한의 성질에 대한 참·거짓 문장만 교과서의 성질로 적었다).
//  - 검사 근거: 수 칸은 문제에 적힌 수로 다시 셈하는 식(facts.value·calc)이고, 글에 없는 수는 seal 이 facts.unseen 에 밝힌다.
//
// 뺀 것과 까닭(11-2-1b.js, 11-2-1c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 극한이 하는 일이 없는 것(사용자 결정): ②22(수직이등분선과 y축의 교점 — 몸통이 고1 직선의 방정식이고 극한은 대입뿐),
//    ②23(삼각형의 내접원 — r/a 가 a 에 상관없는 상수라 극한이 하는 일이 없다).
//  - 다음 단원(Ⅰ-2 함수의 연속)과 한 문제인 꼴은 극한을 묻는 차례만 실었다(①7의 불연속인 점의 개수, ①13 대12의 ㄱ·ㄷ은 11-2-2 몫).
//  - 바꾼 것: ①1은 식을 주지 않고 구멍 뚫린 그래프만 보여 극한값을 읽게 했다(식을 주면 ①23과 같은 일 — 사용자 결정).
//    ②9 원문 √(x + 1)은 답이 늘 같아 근호 안을 √(cx + 1)(c = 4, 8, 12)로, ②24는 점 Q의 자리를, ②21은 곡선을 y = kx²로 바꿨다.
//  - 답이 늘 같은 차례(꼴의 성질이라 수로 바꿀 수 없다): inf-ratio#2(분모의 차수가 크면 0), side-abs#2(같은 인수가 더 있으면 0), shape-circle(2).
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, inline, josa, table } = B.kit;
  const { LAB, MINUS, gcd, Q, qadd, qsub, qmul, qdiv, fl, tx, nb, tail, js, V, sup, tag, nz, poly, sys } = B.kit.mid;
  const { ms, lim, hx, qAns, plot, signed, jh } = B.kit.hs;
  const S1 = '12미적Ⅰ-01-01', S2 = '12미적Ⅰ-01-02';

  // ── 검사 근거 마무리 ──
  // 문항에서 보이는 수(검사와 같은 방법으로 읽는다): 글·그림(그림 설명 포함)·보기
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 0과 1과 o.derived 로 밝히기로 한 수만 된다.
  function seal(item) {
    // 셈이 0으로 끝나는 식은 −0이 될 수 있다. 검사는 −0과 0을 가르므로 +0 을 붙여 0으로 맞춘다(붙인 0은 아래에서 unseen 에 들어간다).
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
  const X = V('x'), Av = V('a'), Bv = V('b'), Cv = V('c'), Kv = V('k'), Nv = V('n'), Tv = V('t');
  const asQ = (v) => (typeof v === 'number' ? Q(v) : v);
  const iq = (v) => tx(asQ(v));                                        // 화면에 적는 수(음수는 −, 분수는 분수 꼴)
  const jn = (v) => js(asQ(v));                                        // 검사 식에 적는 수((-3), (3/4))
  const sT = (v) => signed(v);                                         // 그림 설명에 적는 정수
  const fx = (name, arg) => `${V(name || 'f')}(${arg == null ? X : typeof arg === 'number' ? iq(arg) : arg})`;
  const pn = (v) => { const q = asQ(v); return q.p < 0 ? `(${iq(q)})` : iq(q); };   // 음수만 괄호에
  const yfx = (name) => nb(`${V('y')} = ${fx(name)}`);
  const is = (l, r) => nb(`${l} = ${typeof r === 'string' ? r : iq(r)}`);
  // 수 뒤 토씨: josa 는 음수를 받지 않으므로 크기로 고른다(분수는 분자).
  const jq = (v, pair) => { const q = asQ(v); return nb(iq(q) + tail(Math.abs(q.p), pair)); };
  // 문자 뒤 토씨(a는, n은)
  const lj = (letter, pair) => pair.split('/')[/[mnl]/.test(letter) ? 0 : 1];
  // 다항식(오름차순 계수의 배열 [상수항, x의 계수, x²의 계수, …])
  const pz = (a) => { const out = a.slice(); while (out.length > 1 && out[out.length - 1] === 0) out.pop(); return out; };
  const padd = (a, b) => pz(Array.from({ length: Math.max(a.length, b.length) }, (_, i) => (a[i] || 0) + (b[i] || 0)));
  const pscale = (a, k) => pz(a.map((c) => c * k));
  const pmul = (a, b) => { const out = Array(a.length + b.length - 1).fill(0); a.forEach((x, i) => b.forEach((y, j) => { out[i + j] += x * y; })); return pz(out); };
  const pval = (a, x) => a.reduce((s, c, i) => s + c * x ** i, 0);
  const fromRoots = (rs, lead) => rs.reduce((acc, r) => pmul(acc, [-r, 1]), [lead == null ? 1 : lead]);
  const ptext = (a, v) => poly(a.map((c, i) => [c, i === 0 ? '' : (v || X) + (i > 1 ? sup(i) : '')]).reverse());
  const L = (a, b, v) => poly([[a, v || X], [b, '']]);                // ax + b
  const den = (p) => L(1, -p);                                         // x − p
  const par = (h) => `(${h})`;
  // 극한 기호: at 은 수·'∞'·'-∞', side 는 '+'·'-'(한쪽 극한). body 는 HTML 이나 글.
  const atText = (at) => (typeof at === 'number' ? String(at) : at === '∞' ? '∞' : at === '-∞' ? '-∞' : String(at));
  const LIM = (at, body, side) => lim('x→' + atText(at) + (side || ''), body == null ? undefined : body);
  // 한 조각씩 정의된 함수
  const cases = (rows) => sys(rows.map(([e, c]) => `${e}<span style="padding-left:0.6em">(${c})</span>`));
  const LE = '≤', GE = '≥', NE = '≠';
  const nv = (v) => (typeof v === 'number' ? iq(v) : v);
  const lt = (a, b) => nb(`${nv(a)} &lt; ${nv(b)}`), le = (a, b) => nb(`${nv(a)} ${LE} ${nv(b)}`), ge = (a, b) => nb(`${nv(a)} ${GE} ${nv(b)}`), gt = (a, b) => nb(`${nv(a)} &gt; ${nv(b)}`);
  // 수렴·발산을 말로
  const convTo = (v) => `${iq(v)}에 수렴한다.`;
  const PINF = '양의 무한대로 발산한다.', NINF = '음의 무한대로 발산한다.';

  // ── 답 ──
  // 수 하나(부호 단추가 늘 붙는다 — 단추가 「답이 음수다」를 알려 주지 않게). 정수 답의 유형과 분수 답의 유형을 섞지 않는다.
  const numA = (text, v, o) => qAns(text, v, Object.assign({ signed: true }, o));
  // 문자의 값 여럿: 「a = [±][ ]  b = [±][ ]」(셋째 원소가 참이면 부호 단추 없이)
  const vals = (text, pairs, o) => M(text, pairs.map(([lead, answer, bare]) => ({ lead: lead + ' =', answer, signed: !bare })), Object.assign({}, o, { shown: pairs.map(([lead, answer]) => is(lead, answer)).join(', ') }));
  // 극한 기호 옆에 칸을 둔다: [[기호 HTML, 답], …]
  const limCells = (text, rows, o) => inline(text, rows.map(([h], i) => nb(`${h} = {${i}}`)).join(', '), rows.map(([, answer]) => ({ answer, signed: true })), Object.assign({}, o, { shown: rows.map(([h, answer]) => nb(`${h} = ${iq(answer)}`)).join(', ') }));

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
  const ints = (lo, hi) => { const out = []; for (let v = Math.ceil(lo); v <= Math.floor(hi); v += 1) if (v !== 0) out.push(v); return out; };
  const BLUE = '#1d4ed8', RED = '#b42318';
  // 선분으로 이은 그래프: segs [[x1, y1, x2, y2]], dots [{ x, y, open }]. 그림 설명에 선분의 두 끝을 적는다.
  function segGraph(o) {
    const segs = o.segs || [], x = o.x, y = o.y;
    const said = '선분: ' + segs.map(([a, b, c, e]) => `(${sT(a)}, ${sT(b)})과 (${sT(c)}, ${sT(e)})을 잇는 선분`).join(', ') + '.';
    return plot({ x, y, w: o.w, grid: o.grid === false ? false : true, xt: o.xt || ints(x[0], x[1]), yt: o.yt || ints(y[0], y[1]),
      curves: o.curves, segs: segs.map(([a, b, c, e]) => ({ p: [a, b], q: [c, e], color: o.color || BLUE })), dots: o.dots, say: (o.say ? o.say + ' ' : '') + (segs.length ? said : '') });
  }
  // 작은 그래프 여럿을 두 줄로(이름표 ㉠, ㉡, …)
  const grid2 = (figs, names) => '<div style="display:flex;flex-wrap:wrap;gap:8px 14px;justify-content:center">' + figs.map((f, i) => `<div style="text-align:center"><div style="font-weight:700">${names ? names[i] : LAB[i]}</div>${f}</div>`).join('') + '</div>';

  // ══ 가. 함수의 수렴과 발산 ══
  const conv = [
    // ①1 구멍 뚫린 그래프에서 극한값 읽기. 차례 2는 구멍 위아래에 함숫값(찬 점)을 따로 찍어 함숫값과 극한값을 가르게 한다.
    T('conv-hole', '구멍 뚫린 그래프에서 극한값 읽기', '①1', (d, n) => {
      const a = d.pick([-2, -1, 1, 2]);
      if (n === 0) {
        const m = d.pick([1, -1, 2, -2]), c = d.int(-1, 3), Lv = m * a + c;
        if (Lv < 0 || Lv > 4 || Lv === 0) return null;
        const figure = segGraph({ x: [-3, 3], y: [-2, 5], curves: [{ f: (x) => m * x + c, from: -3, to: 3, color: BLUE }], dots: [{ x: a, y: Lv, open: true }], say: `그래프: 직선의 일부이고 x = ${sT(a)}인 곳이 비어 있다.` });
        return numA(`함수 ${yfx()}의 그래프가 그림과 같을 때, ${LIM(a, fx())}의 값은?`, Lv, {
          figure, explain: `${X}의 값이 ${jq(a, '이/가')} 아니면서 ${iq(a)}에 한없이 가까워질 때 ${fx()}의 값은 구멍의 ${V('y')}좌표 ${iq(Lv)}에 한없이 가까워진다. ${jh(fx(null, a), '이/가')} 정의되지 않아도 극한값은 ${iq(Lv)}이다.`,
          facts: { value: jn(Lv) } });
      }
      // 포물선의 일부: y = s(x − h)² + k, x = a 에 구멍, 함숫값은 다른 높이의 찬 점
      const s = d.pick([1, -1]), h = d.int(-1, 1), k = s > 0 ? d.int(-1, 1) : d.int(2, 4), Lv = s * (a - h) ** 2 + k, Kv0 = d.int(-1, 4);
      if (Lv < -1 || Lv > 4 || Kv0 === Lv || Lv === 0 || h === a) return null;
      const f = (x) => s * (x - h) ** 2 + k;
      const figure = segGraph({ x: [-3, 3], y: [-2, 5], curves: [{ f, from: -3, to: 3, color: BLUE }], dots: [{ x: a, y: Lv, open: true }, { x: a, y: Kv0 }], say: `그래프: 포물선의 일부이고 x = ${sT(a)}인 곳은 곡선 위가 비어 있고 함숫값은 찬 점으로 따로 찍혀 있다.` });
      return limCells(`함수 ${yfx()}의 그래프가 그림과 같다. ${fx(null, a)}의 값과 ${LIM(a, fx())}의 값을 차례로 구하시오.`, [[fx(null, a), Kv0], [LIM(a, fx()), Lv]], {
        figure, explain: `${jh(fx(null, a), '은/는')} 찬 점의 ${V('y')}좌표이므로 ${iq(Kv0)}이다. 극한값은 ${X}가 ${iq(a)}에 가까워질 때 곡선이 다가가는 구멍의 ${V('y')}좌표이므로 ${iq(Lv)}이다. 함숫값과 극한값은 다를 수 있다.`,
        facts: { calc: [[jn(Kv0), 0], [jn(Lv), 1]] } });
    }, { count: 2 }),

    // ①2 x → ∞, x → −∞ 일 때의 극한(수렴하면 그 값, 아니면 양·음의 무한대)
    T('conv-inf', 'x가 한없이 커지거나 작아질 때의 극한', '①2', (d, n) => {
      const toPos = n === 0;
      const c = d.int(-3, 4), k = d.int(1, 6), p = d.int(1, 4), b = d.int(2, 4);
      const POS = [
        { h: c === 0 ? frac(k, den(p)) : par(`${iq(c)} + ${frac(k, den(p))}`), kind: 'v', v: c },
        { h: c === 0 ? MINUS + frac(k, `|${den(p)}|`) : par(`${iq(c)} ${MINUS} ${frac(k, `|${den(p)}|`)}`), kind: 'v', v: c },
        { h: par(L(-b, c + 5)), kind: '-' },
        { h: rt2(L(b, -p)), kind: '+' },
        { h: par(poly([[-1, X + sup(2)], [c + 3, '']])), kind: '-' },
        { h: frac(k, `|${L(1, p)}|`), kind: 'v', v: 0 }
      ];
      const NEG = [
        { h: rt2(L(-1, p)), kind: '+' },
        { h: frac(k, `|${L(1, p)}|`), kind: 'v', v: 0 },
        { h: par(L(-b, c + 5)), kind: '+' },
        { h: par(L(1, c + 4)), kind: '-' },
        { h: c === 0 ? frac(k, L(1, p)) : par(`${iq(c)} + ${frac(k, L(1, p))}`), kind: 'v', v: c },
        { h: par(`${rt2(L(-b, p))} ${MINUS} ${p}`), kind: '+' }
      ];
      const e = d.pick(toPos ? POS : NEG);
      const v = e.kind === 'v' ? e.v : d.pick([c, 0, 1].filter((t) => t !== 0 || c !== 0)), w = d.until(() => d.int(-3, 4), (t) => t !== v);
      const at = toPos ? '∞' : '-∞';
      return pickOne(d, '다음 극한을 조사한 결과로 옳은 것은?', [
        { h: convTo(v), ok: e.kind === 'v' }, { h: convTo(w), ok: false }, { h: PINF, ok: e.kind === '+' }, { h: NINF, ok: e.kind === '-' }
      ], { figure: hx(LIM(at, e.h)),
        explain: e.kind === 'v' ? `${X}의 값이 ${toPos ? '한없이 커질' : '음수이면서 그 절댓값이 한없이 커질'} 때 분수 부분은 0에 한없이 가까워지므로 ${iq(e.v)}에 수렴한다.`
          : `${X}의 값이 ${toPos ? '한없이 커질' : '음수이면서 그 절댓값이 한없이 커질'} 때 식의 값은 ${e.kind === '+' ? '한없이 커지므로 양의 무한대로' : '음수이면서 그 절댓값이 한없이 커지므로 음의 무한대로'} 발산한다.` });
    }, { count: 2 }),

    // ①3 x → a 에서 양·음의 무한대로 발산(분모가 제곱·절댓값이면 양쪽이 같은 쪽으로, 1/(x − a)는 양쪽이 갈린다)
    T('conv-inf-at', 'x → a일 때 양의 무한대·음의 무한대로 발산하는가', '①3', (d) => {
      const a = d.int(-3, 3), k = d.int(1, 5), s = d.pick([1, -1]), c = d.int(-2, 3), kind = d.int(0, 3);
      const sq = `(${den(a)})${sup(2)}`, ab = `|${den(a)}|`, neg = s < 0 ? MINUS : '';
      const E = [
        { h: neg + frac(k, a === 0 ? X + sup(2) : sq), kind: s > 0 ? '+' : '-' },
        { h: neg + frac(k, a === 0 ? `|${X}|` : ab), kind: s > 0 ? '+' : '-' },
        { h: neg + frac(k, a === 0 ? X : den(a)), kind: 'x' },
        { h: par(`${iq(c)} ${s < 0 ? MINUS : '+'} ${frac(k, a === 0 ? X + sup(2) : sq)}`), kind: s > 0 ? '+' : '-' }
      ][kind];
      if (kind === 3 && c === 0) return null;
      return pickOne(d, '다음 극한을 조사한 결과로 옳은 것은?', [
        { h: PINF, ok: E.kind === '+' }, { h: NINF, ok: E.kind === '-' }, { h: convTo(kind === 3 ? c : 0), ok: false },
        { h: '양의 무한대로도 음의 무한대로도 발산하지 않고, 수렴하지도 않는다.', ok: E.kind === 'x' }
      ], { figure: hx(LIM(a, E.h)),
        explain: E.kind === 'x' ? `${X}가 ${iq(a)}보다 크면서 가까워지면 분모가 양수이면서 0에 가까워지고, 작으면서 가까워지면 음수이면서 0에 가까워진다. 한쪽은 양의 무한대로, 다른 쪽은 음의 무한대로 가므로 어느 쪽으로도 발산한다고 할 수 없다.`
          : `분모가 늘 양수이면서 0에 한없이 가까워지므로 ${jh(frac(k, '분모'), '은/는')} 한없이 커진다. 따라서 ${E.kind === '+' ? '양의 무한대로' : '음의 무한대로'} 발산한다.` });
    }),

    // ①4 극한값이 존재하는 것 고르기(차례 2는 보기 ㄱ, ㄴ, ㄷ에서 있는 대로)
    T('conv-exists', '극한값이 존재하는 것 고르기', '①4', (d, n) => {
      const a = nz(d, -3, 3), k = d.int(1, 5), c = d.int(-3, 5), p = d.int(1, 4), b = d.int(2, 5);
      const YES = [
        () => ({ h: LIM('∞', `(${iq(c)} ${MINUS} ${frac(k, `|${X}|`)})`), why: `${iq(c)}에 수렴한다` }),
        () => ({ h: LIM('-∞', frac(k, `|${L(1, p)}|`)), why: '0에 수렴한다' }),
        () => ({ h: LIM(a, `(${poly([[-1, X + sup(2)], [-p, '']])})`), why: `${iq(-a * a - p)}에 수렴한다` }),
        () => ({ h: LIM(a, frac(poly([[1, X + sup(2)], [-a * a, '']]), den(a))), why: `${iq(2 * a)}에 수렴한다` }),
        () => ({ h: LIM('-∞', `(${iq(c)} + ${frac(k, X)})`), why: `${iq(c)}에 수렴한다` })
      ];
      const NO = [
        () => ({ h: LIM(a, frac(k, den(a))), why: '좌우에서 갈리는 쪽이 달라 발산한다' }),
        () => ({ h: LIM(a, frac(k, `|${den(a)}|`)), why: '양의 무한대로 발산한다' }),
        () => ({ h: LIM(a, frac(`|${den(a)}|`, den(a))), why: '우극한 1, 좌극한 −1로 달라 극한값이 없다' }),
        () => ({ h: LIM('∞', `(${rt2(L(b, p))} ${MINUS} ${b + 1})`), why: '양의 무한대로 발산한다' }),
        () => ({ h: LIM('-∞', `(${L(1, c + 4)})`), why: '음의 무한대로 발산한다' }),
        () => ({ h: LIM('∞', `(${poly([[-1, X + sup(2)], [c + 6, '']])})`), why: '음의 무한대로 발산한다' })
      ];
      if (n === 0) {
        const yes = d.pick(YES)(), nos = d.shuffle(NO).slice(0, 4).map((g) => g());
        const rows = [{ h: yes.h, ok: true, why: yes.why }].concat(nos.map((r) => ({ h: r.h, ok: false, why: r.why })));
        const list = d.shuffle(rows);
        return pickOne(d, '다음 중 극한값이 존재하는 것은?', list, { explain: list.map((r) => `${stripText(r.h)}: ${r.why}`).join('. ') + '.' });
      }
      const m = d.int(1, 2), rows = d.shuffle(d.shuffle(YES).slice(0, m).map((g) => Object.assign(g(), { ok: true })).concat(d.shuffle(NO).slice(0, 3 - m).map((g) => Object.assign(g(), { ok: false }))));
      return comboPick(d, '보기에서 극한값이 존재하는 것만을 있는 대로 고른 것은?', rows.map((r) => r.h), rows.map((r) => r.ok),
        rows.map((r, i) => `${GA[i]}. ${r.why}`).join('. ') + '.');
    }, { count: 2 })
  ];
  // 근호 안 일차식 √(…)
  function rt2(inner) { return B.kit.mid.rt(inner); }
  // 풀이 글에 극한 식을 한 줄 글로(숨은 글만 남긴다)
  function stripText(h) { return nb(h); }

  // ══ 나. 우극한과 좌극한 ══
  // 조각 그래프의 값: pieces [{ x1, y1, x2, y2 }](x1 < x2), at 의 좌극한·우극한
  const sideOf = (pieces, at) => ({ L: (pieces.find((p) => p.x2 === at) || {}).y2, R: (pieces.find((p) => p.x1 === at) || {}).y1 });
  // 끊긴 곳의 점: 함숫값 K 는 찬 점, 좌·우 끝 가운데 K 와 다른 것은 속이 빈 점
  const breakDots = (at, Lv, Rv, Kv0) => { const out = [{ x: at, y: Kv0 }]; if (Lv !== Kv0) out.push({ x: at, y: Lv, open: true }); if (Rv !== Kv0 && Rv !== Lv) out.push({ x: at, y: Rv, open: true }); return out; };
  const segsOf = (pieces) => pieces.map((p) => [p.x1, p.y1, p.x2, p.y2]);

  const side = [
    // ①5 그래프에서 좌극한·우극한·극한값 읽기. 차례 1: 두 끊긴 곳의 우극한과 좌극한. 차례 2: 구멍 위에 함숫값이 따로 있는 곳의 극한값과 다른 곳의 한쪽 극한.
    T('side-read', '그래프에서 좌극한·우극한 읽기', '①5', (d, n) => {
      const p1 = d.pick([-3, -1, 1]), p2 = p1 + 2, xlo = Math.min(p1 - 2, -1), xhi = Math.max(p2 + 2, 1);
      const y = () => d.int(1, 4);
      const yA = y(), L1 = y(), R1 = y(), L2 = y(), R2 = y(), yB = y();
      const pieces = [{ x1: xlo, y1: yA, x2: p1, y2: L1 }, { x1: p1, y1: R1, x2: p2, y2: L2 }, { x1: p2, y1: R2, x2: xhi, y2: yB }];
      if (L2 === R2 || Math.abs(yA - L1) > 3 || Math.abs(R1 - L2) > 3 || Math.abs(R2 - yB) > 3) return null;
      const askR2 = d.bool(), K2 = askR2 ? L2 : R2;
      if (n === 0) {
        if (L1 === R1) return null;
        const K1 = d.pick([L1, R1]);
        const figure = segGraph({ x: [xlo, xhi], y: [-1, 5], segs: segsOf(pieces), dots: breakDots(p1, L1, R1, K1).concat(breakDots(p2, L2, R2, K2)) });
        return limCells(`함수 ${yfx()}의 그래프가 그림과 같을 때, 다음 우극한과 좌극한을 구하시오.`, [[LIM(p1, fx(), '+'), R1], [LIM(p2, fx(), '-'), L2]], {
          figure, explain: `${X}가 ${iq(p1)}보다 크면서 ${iq(p1)}에 가까워질 때 그래프는 ${V('y')}좌표 ${iq(R1)}에 다가가고, ${X}가 ${iq(p2)}보다 작으면서 ${iq(p2)}에 가까워질 때는 ${V('y')}좌표 ${iq(L2)}에 다가간다. 찬 점(함숫값)은 한쪽 극한과 상관없다.`,
          facts: { calc: [[jn(R1), 0], [jn(L2), 1]] } });
      }
      if (L1 !== R1) return null;
      const K1 = d.until(() => d.int(1, 4), (t) => t !== L1);
      const figure = segGraph({ x: [xlo, xhi], y: [-1, 5], segs: segsOf(pieces), dots: breakDots(p1, L1, R1, K1).concat(breakDots(p2, L2, R2, K2)) });
      const want2 = askR2 ? R2 : L2;
      return limCells(`함수 ${yfx()}의 그래프가 그림과 같을 때, 다음 극한값을 구하시오.`, [[LIM(p1, fx()), L1], [LIM(p2, fx(), askR2 ? '+' : '-'), want2]], {
        figure, explain: `${X} = ${iq(p1)}의 왼쪽과 오른쪽에서 그래프가 모두 ${V('y')}좌표 ${iq(L1)}에 다가가므로 ${LIM(p1, fx())} = ${iq(L1)}이다(함숫값 ${fx(null, p1)} = ${jq(K1, '과/와')} 다르다). ${X}가 ${iq(p2)}보다 ${askR2 ? '크면서' : '작으면서'} ${iq(p2)}에 가까워질 때는 ${V('y')}좌표 ${iq(want2)}에 다가간다.`,
        facts: { calc: [[jn(L1), 0], [jn(want2), 1]] } });
    }, { count: 2 }),

    // ①6 그래프 넷 가운데 lim x→0 f(x)가 존재하는 것(그림 새로 지음 — 원문 다섯 그래프는 알 수 없다)
    T('side-pick', '그래프에서 극한값이 존재하는 것 고르기', '①6', (d) => {
      const y = () => d.int(1, 3);
      const kinds = d.shuffle(['ok', 'kl', 'kr', 'kx']);
      const cases0 = kinds.map((kind) => {
        const Lv = y(), Rv = kind === 'ok' ? Lv : d.until(y, (t) => t !== Lv), Kv0 = kind === 'kl' ? Lv : kind === 'kr' ? Rv : d.until(y, (t) => t !== Lv && t !== Rv);
        const yl = d.until(() => d.int(0, 4), (t) => Math.abs(t - Lv) <= 2), yr = d.until(() => d.int(0, 4), (t) => Math.abs(t - Rv) <= 2);
        return { kind, Lv, Rv, Kv0, segs: [[-1, yl, 1, Lv], [1, Rv, 3, yr]] };
      });
      if (cases0.some((c) => c.kind === 'kx' && c.Kv0 == null)) return null;
      const figs = cases0.map((c) => segGraph({ x: [-1, 3], y: [-1, 4], w: 132, xt: [1, 2], yt: [1, 2, 3], segs: c.segs, dots: breakDots(1, c.Lv, c.Rv, c.Kv0) }));
      const names = LAB.slice(0, 4);
      return pickOne(d, `다음은 네 함수 ${yfx()}의 그래프이다. ${LIM(1, fx())}의 값이 존재하는 것은?`, names.map((nm, i) => ({ h: nm, ok: cases0[i].kind === 'ok' })), {
        keep: true, figure: grid2(figs.map((f, i) => f.replace('aria-label="', `aria-label="${names[i]}: `)), names),
        explain: cases0.map((c, i) => `${names[i]}${josa(1, '은/는').slice(1)} 좌극한 ${iq(c.Lv)}, 우극한 ${jq(c.Rv, '으로/로')}` + (c.Lv === c.Rv ? ' 같으므로 극한값이 존재한다(함숫값과는 상관없다)' : ' 달라 극한값이 없다')).join('. ') + '.' });
    }),

    // ①7 열린구간 (0, 4)에서 그래프의 극한값이 존재하지 않는 곳(그림 새로 지음). 차례 1: 개수. 차례 2: 극한에 대한 문장 가운데 옳지 않은 것.
    T('side-count', '그래프에서 극한값이 존재하지 않는 곳', '①7', (d, n) => {
      const kinds = [1, 2, 3].map(() => d.pick(['jumpL', 'jumpR', 'hole', 'corner', 'jumpX']));
      const nd = kinds.filter((k) => k.startsWith('jump')).length;
      if (nd < 1 || nd > 2) return null;
      const y = () => d.int(1, 4);
      const pts = [1, 2, 3].map((p, i) => {
        const kind = kinds[i], Lv = y(), Rv = kind.startsWith('jump') ? d.until(y, (t) => t !== Lv) : Lv;
        const Kv0 = kind === 'jumpL' ? Lv : kind === 'jumpR' ? Rv : kind === 'corner' ? Lv : d.until(y, (t) => t !== Lv && t !== Rv);
        return { p, kind, Lv, Rv, Kv0 };
      });
      const y0 = y(), y4 = y();
      const pieces = [{ x1: 0, y1: y0, x2: 1, y2: pts[0].Lv }, { x1: 1, y1: pts[0].Rv, x2: 2, y2: pts[1].Lv }, { x1: 2, y1: pts[1].Rv, x2: 3, y2: pts[2].Lv }, { x1: 3, y1: pts[2].Rv, x2: 4, y2: y4 }];
      // 꺾인 곳(corner)은 기울기가 바뀌어야 한다
      if (pts.some((t, i) => t.kind === 'corner' && pieces[i].y2 - pieces[i].y1 === pieces[i + 1].y2 - pieces[i + 1].y1)) return null;
      if (pieces.some((q) => Math.abs(q.y2 - q.y1) > 3)) return null;
      const dots = [{ x: 0, y: y0, open: true }, { x: 4, y: y4, open: true }].concat(...pts.map((t) => (t.kind === 'corner' ? [{ x: t.p, y: t.Lv }] : breakDots(t.p, t.Lv, t.Rv, t.Kv0))));
      const figure = segGraph({ x: [0, 4], y: [-1, 5], segs: segsOf(pieces), dots, say: '그래프: 열린구간 (0, 4)에서 정의되어 있고 두 끝은 속이 빈 점이다.' });
      const why = pts.map((t) => `${X} = ${t.p}에서 좌극한 ${t.Lv}, 우극한 ${t.Rv}` + (t.Lv === t.Rv ? '(극한값 있음)' : '(극한값 없음)')).join(', ');
      if (n === 0) {
        return N(`열린구간 (0, 4)에서 정의된 함수 ${yfx()}의 그래프가 그림과 같다. ${nb(`0 &lt; ${Av} &lt; 4`)}인 실수 ${Av} 가운데 ${LIM('a', fx())}의 값이 존재하지 않는 ${Av}의 개수는?`, nd, {
          figure, explain: `${why}이다. 좌극한과 우극한이 다른 곳만 세면 ${nd}개이다. 함숫값(찬 점)이 따로 있어도 좌극한과 우극한이 같으면 극한값은 있다.`,
          facts: { value: String(nd), derived: [nd] } });
      }
      const goods = [], bads = [];
      for (const t of pts) {
        const ex = t.Lv === t.Rv;
        (ex ? goods : bads).push(`${LIM(t.p, fx())}의 값이 존재한다.`);
        (ex ? bads : goods).push(`${LIM(t.p, fx())}의 값이 존재하지 않는다.`);
        goods.push(`${is(LIM(t.p, fx(), '+'), t.Rv)}`, `${is(LIM(t.p, fx(), '-'), t.Lv)}`);
        if (t.Kv0 !== t.Rv) bads.push(`${is(LIM(t.p, fx(), '+'), t.Kv0)}`);
        if (t.Lv !== t.Rv) bads.push(`${is(LIM(t.p, fx(), '-'), t.Rv)}`);
      }
      const bad = d.pick(bads), good4 = d.shuffle(goods).slice(0, 4);
      return pickOne(d, `열린구간 (0, 4)에서 정의된 함수 ${yfx()}의 그래프가 그림과 같을 때, 다음 중 옳지 않은 것은?`, good4.map((h) => ({ h, ok: false })).concat([{ h: bad, ok: true }]), {
        figure, explain: `${why}. 함숫값(찬 점)은 극한과 상관없다.` });
    }, { count: 2 }),

    // ①8 식으로 준 조각 함수의 좌극한·우극한. 차례 1: 두 조각. 차례 2: 세 조각의 서로 다른 경계.
    T('side-piece', '식으로 준 함수의 좌극한과 우극한', '①8', (d, n) => {
      const lin = () => [d.int(-4, 5), nz(d, -3, 3)];
      const quad = () => [d.int(-3, 4), d.int(-3, 3), d.pick([1, -1, 2])];
      if (n === 0) {
        const a = nz(d, -2, 3), right = d.bool() ? lin() : quad(), left = d.bool() ? lin() : quad();
        const Rv = pval(right, a), Lv = pval(left, a);
        if (Rv === Lv || Math.abs(Rv) > 12 || Math.abs(Lv) > 12) return null;
        const f = cases([[ptext(right), ge(X, a)], [ptext(left), lt(X, a)]]);
        return limCells(`함수 ${nb(`${fx()} = ${f}`)}에 대하여 다음을 구하시오.`, [[LIM(a, fx(), '+'), Rv], [LIM(a, fx(), '-'), Lv]], {
          explain: `${X} &gt; ${iq(a)}이면 ${is(fx(), ptext(right))}이므로 우극한은 ${iq(Rv)}, ${X} &lt; ${iq(a)}이면 ${is(fx(), ptext(left))}이므로 좌극한은 ${iq(Lv)}이다.`,
          facts: { calc: [[polyJs(right, a), 0], [polyJs(left, a), 1]] } });
      }
      const a1 = d.int(-1, 0), a2 = a1 + d.int(2, 3), P = [lin(), quad(), [d.int(-3, 5)]];
      const vL = pval(P[0], a1), vR = pval(P[2], a2), mL = pval(P[1], a1), mR = pval(P[1], a2);
      if (vL === mL || vR === mR || Math.abs(vL) > 12 || Math.abs(vR) > 12) return null;
      const f = cases([[ptext(P[0]), lt(X, a1)], [ptext(P[1]), nb(`${iq(a1)} ${LE} ${X} &lt; ${iq(a2)}`)], [ptext(P[2]), ge(X, a2)]]);
      return limCells(`함수 ${nb(`${fx()} = ${f}`)}에 대하여 다음을 구하시오.`, [[LIM(a1, fx(), '-'), vL], [LIM(a2, fx(), '+'), vR]], {
        explain: `${X}가 ${iq(a1)}보다 작으면서 가까워질 때는 ${is(fx(), ptext(P[0]))}이므로 ${iq(vL)}, ${X}가 ${iq(a2)}보다 크면서 가까워질 때는 ${is(fx(), ptext(P[2]))}이므로 ${iq(vR)}이다.`,
        facts: { calc: [[polyJs(P[0], a1), 0], [polyJs(P[2], a2), 1]] } });
    }, { count: 2 }),

    // ①9 절댓값이 든 식의 x → a 극한. 차례 1: 좌우가 달라 존재하지 않는 것. 차례 2: 같은 인수가 더 있어 존재하는 것.
    T('side-abs', '절댓값이 든 식의 극한', '①9', (d, n) => {
      let h, Rv, Lv, a;
      if (n === 0) {
        const kind = d.int(0, 2);
        if (kind === 0) { a = d.int(-3, 3); const k = d.int(1, 4); h = frac(`${k === 1 ? '' : k}|${a === 0 ? X : den(a)}|`, a === 0 ? X : den(a)); Rv = k; Lv = -k; }
        else if (kind === 1) { a = nz(d, -3, 3); const b = d.until(() => d.int(-4, 4), (t) => t !== a); h = frac(ptext(fromRoots([a, b])), `|${den(a)}|`); Rv = a - b; Lv = b - a; }
        else { a = 0; const p = d.int(1, 3), q = nz(d, -4, 4); h = frac(ptext([0, q, p]), `|${X}|`); Rv = q; Lv = -q; }
      } else {
        const kind = d.int(0, 1);
        if (kind === 0) { a = nz(d, -3, 3); h = frac(ptext(fromRoots([a, a])), `|${den(a)}|`); }
        else { a = 0; const p = nz(d, -3, 3), q = nz(d, -4, 4); h = frac(ptext([0, 0, q, p]), `|${X}|`); Rv = q; }
        Rv = Rv == null ? 2 * Math.abs(a) : Rv; Lv = Rv;
      }
      const ex = n === 1, d1 = ex ? Math.abs(Rv) : Math.abs(Rv), opts = ex ? [0, d1, -d1] : [Rv, Lv, 0];
      if (new Set(opts).size !== 3) return null;
      return pickOne(d, '다음 극한을 조사한 결과로 옳은 것은?', opts.map((v) => ({ h: convTo(v), ok: ex && v === 0 })).concat([{ h: '극한값이 존재하지 않는다.', ok: !ex }]), {
        figure: hx(LIM(a, h)),
        explain: ex ? `${X} &gt; ${iq(a)}일 때와 ${X} &lt; ${iq(a)}일 때 절댓값을 풀어 약분하면 두 경우 모두 0에 한없이 가까워진다. 좌극한과 우극한이 모두 0이므로 0에 수렴한다.`
          : `${X} &gt; ${iq(a)}이면 절댓값 기호를 그대로 벗겨 우극한은 ${iq(Rv)}, ${X} &lt; ${iq(a)}이면 −를 붙여 벗겨 좌극한은 ${iq(Lv)}이다. 좌극한과 우극한이 다르므로 극한값이 존재하지 않는다.` });
    }, { count: 2 }),

    // ①10 조각 함수의 극한이 존재하도록 하는 상수(차례 2: 상수가 두 조각에 모두 든 것)
    T('side-k', '극한값이 존재하도록 하는 상수', '①10', (d, n) => {
      const a = nz(d, -2, 3), k = nz(d, -6, 6);
      if (n === 0) {
        const q = [d.int(-4, 4), d.int(-3, 3), d.pick([1, 2, -1])], p = nz(d, -3, 3);
        // 오른쪽 이차식, 왼쪽 px + k: q(a) = pa + k
        const c0 = pval(q, a) - p * a - k; q[0] -= c0;
        if (Math.abs(q[0]) > 9) return null;
        const f = cases([[ptext(q), gt(X, a)], [`${L(p, 0)} + ${Kv}`, le(X, a)]]);
        return numA(`함수 ${nb(`${fx()} = ${f}`)}에 대하여 ${LIM(a, fx())}의 값이 존재하도록 하는 상수 ${Kv}의 값은?`, k, {
          explain: `우극한 ${jq(pval(q, a), '과/와')} 좌극한 ${nb(`${iq(p * a)} + ${Kv}`)}가 같아야 하므로 ${is(Kv, k)}이다.`,
          facts: { value: `${polyJs(q, a)}-(${jn(p)})*(${jn(a)})` } });
      }
      // 오른쪽 px − k, 왼쪽 x² + kx + s: pa − k = a² + ka + s → k(1 + a) = pa − a² − s
      if (a === -1) return null;
      const p = nz(d, -3, 3), s = p * a - k - a * a - k * a;
      if (Math.abs(s) > 12) return null;
      const f = cases([[`${L(p, 0)} ${MINUS} ${Kv}`, ge(X, a)], [`${X}${sup(2)} + ${Kv}${X} ${s < 0 ? MINUS : '+'} ${Math.abs(s)}`, lt(X, a)]]);
      if (s === 0) return null;
      return numA(`함수 ${nb(`${fx()} = ${f}`)}에 대하여 ${LIM(a, fx())}의 값이 존재하도록 하는 상수 ${Kv}의 값은?`, k, {
        explain: `우극한 ${nb(`${iq(p * a)} ${MINUS} ${Kv}`)}와 좌극한 ${nb(`${iq(a * a + s)} ${a < 0 ? MINUS : '+'} ${Math.abs(a) === 1 ? '' : Math.abs(a)}${Kv}`)}가 같아야 하므로 이 일차방정식을 풀면 ${is(Kv, k)}이다.`,
        facts: { value: `((${jn(p)})*(${jn(a)})-(${jn(a)})*(${jn(a)})-(${jn(s)}))/(1+(${jn(a)}))` } });
    }, { count: 2 }),

    // ①11 좌·우극한(또는 극한값)이 주어진 조각 함수의 상수. 차례 2는 극한값 하나로 두 상수를 정한 뒤 함숫값까지.
    T('side-given', '극한값이 주어진 조각 함수의 상수', '①11', (d, n) => {
      const c = nz(d, -2, 3), p = nz(d, -3, 3), a = nz(d, -6, 6), b = nz(d, -6, 6);
      if (n === 0) {
        // 오른쪽 px + a, 왼쪽 −x² − b
        const Rv = p * c + a, Lv = -c * c - b;
        if (Rv === Lv) return null;
        const f = cases([[`${L(p, 0)} + ${Av}`, ge(X, c)], [`${MINUS}${X}${sup(2)} ${MINUS} ${Bv}`, lt(X, c)]]);
        return vals(`함수 ${nb(`${fx()} = ${f}`)}에 대하여 ${is(LIM(c, fx(), '+'), Rv)}, ${is(LIM(c, fx(), '-'), Lv)}일 때, 상수 ${Av}, ${Bv}의 값을 구하시오.`, [[Av, a], [Bv, b]], {
          explain: `우극한은 ${nb(`${iq(p * c)} + ${Av}`)}이므로 ${is(Av, a)}, 좌극한은 ${nb(`${iq(-c * c)} ${MINUS} ${Bv}`)}이므로 ${is(Bv, b)}이다.`,
          facts: { calc: [[`(${jn(Rv)})-(${jn(p)})*(${jn(c)})`, 0], [`0-(${jn(Lv)})-(${jn(c)})*(${jn(c)})`, 1]] } });
      }
      // 오른쪽 px − a, 왼쪽 x² + b, lim x→c f = V
      const V0 = p * c - a;
      const b2 = V0 - c * c;
      if (b2 === 0 || Math.abs(V0) > 15) return null;
      const f = cases([[`${L(p, 0)} ${MINUS} ${Av}`, ge(X, c)], [`${X}${sup(2)} + ${Bv}`, lt(X, c)]]);
      const u = c - 1, w = c + 1, fu = u * u + b2, fw = p * w - a;
      return limCells(`함수 ${nb(`${fx()} = ${f}`)}에 대하여 ${is(LIM(c, fx()), V0)}일 때, 다음 함숫값을 구하시오. (단, ${Av}, ${Bv}는 상수)`, [[fx(null, u), fu], [fx(null, w), fw]], {
        explain: `극한값이 ${iq(V0)}이므로 우극한과 좌극한이 모두 ${iq(V0)}이다. ${is(nb(`${iq(p * c)} ${MINUS} ${Av}`), V0)}에서 ${is(Av, a)}, ${is(nb(`${iq(c * c)} + ${Bv}`), V0)}에서 ${is(Bv, b2)}이다. 따라서 ${is(fx(null, u), fu)}, ${is(fx(null, w), fw)}이다.`,
        facts: { calc: [[`(${jn(u)})*(${jn(u)})+(${jn(V0)})-(${jn(c)})*(${jn(c)})`, 0], [`(${jn(p)})*(${jn(w)})-((${jn(p)})*(${jn(c)})-(${jn(V0)}))`, 1]], derived: [Math.abs(u), Math.abs(w)] } });
    }, { count: 2 }),

    // ①12 |x| 로 나눈 조각 함수에서 극한값이 존재하지 않는 점
    T('side-absx', '|x|로 나눈 조각 함수의 극한이 없는 점', '①12', (d) => {
      const m = d.pick([1, 2]), p = nz(d, -2, 2), c = d.int(-4, 5), sgn = d.pick([1, -1]), ans = d.pick([m, -m]);
      // 정답이 아닌 쪽(−ans)에서 이어지게 상수 e 를 정한다: p·(−ans) + c = e + sgn·m²
      const e = p * -ans + c - sgn * m * m;
      if (e === 0 || Math.abs(e) > 12) return null;
      const quad = ptext([e, 0, sgn]);
      const f = cases([[L(p, c), nb(`|${X}| ${GE} ${m}`)], [quad, nb(`|${X}| &lt; ${m}`)]]);
      const at = (x) => [p * x + c, sgn * m * m + e];
      const [o1, i1] = at(ans);
      if (o1 === i1) return null;
      return numA(`함수 ${nb(`${fx()} = ${f}`)}에 대하여 ${LIM('a', fx())}의 값이 존재하지 않을 때, 상수 ${Av}의 값은?`, ans, {
        explain: `${X} = ${jq(m, '과/와')} ${X} = ${MINUS}${m}에서 바깥쪽 식의 값과 안쪽 식의 값을 견준다. ${X} = ${iq(-ans)}에서는 둘 다 ${jq(p * -ans + c, '으로/로')} 같아 극한값이 있고, ${X} = ${iq(ans)}에서는 ${jq(o1, '과/와')} ${jq(i1, '으로/로')} 달라 극한값이 없다. 다른 곳에서는 식 하나로 이어져 있으므로 ${is(Av, ans)}이다.`,
        facts: { value: jn(ans), derived: [m] } });
    }),

    // ①13 합성함수의 극한. 차례 1: 두 그래프(속 함숫값이 한쪽에서 다가간다 — 그림 새로 지음). 차례 2: 식으로 준 두 함수의 합성.
    T('side-compose', '합성함수의 극한', '①13', (d, n) => {
      if (n === 0) {
        const a = d.pick([1, 2]), c = d.pick([1, 2]), up = d.bool();
        const gl = d.int(1, 4), gr = d.until(() => d.int(1, 4), (t) => t !== gl), gc = d.until(() => d.int(1, 4), (t) => t !== gl && t !== gr);
        // f: x = a 에서 꼭짓점 (a, c) 인 V(up) 또는 Λ 모양
        const s = up ? 1 : -1, fy = (x) => c + s * Math.abs(x - a);
        const fx0 = Math.min(-1, a - 2), fx1 = a + 2;
        const fFig = segGraph({ x: [fx0, fx1], y: [-1, 4], w: 230, segs: [[fx0, fy(fx0), a, c], [a, c, fx1, fy(fx1)]].map((q) => clipSeg(q, -1, 4)), dots: [{ x: a, y: c }] });
        const gFig = segGraph({ x: [-1, c + 2], y: [-1, 5], w: 230, segs: [[c - 2, gl + (gl > 2 ? -1 : 1), c, gl], [c, gr, c + 2, gr + (gr > 2 ? -1 : 1)]], dots: breakDots(c, gl, gr, gc) });
        const ans = up ? gr : gl;
        return numA(`두 함수 ${yfx()}, ${yfx('g')}의 그래프가 그림과 같을 때, ${LIM(a, `${V('g')}(${fx()})`)}의 값은?`, ans, {
          figure: grid2([fFig.replace('aria-label="', 'aria-label="y = f(x)의 그래프: '), gFig.replace('aria-label="', 'aria-label="y = g(x)의 그래프: ')], [yfx(), yfx('g')]),
          explain: `${fx()} = ${Tv}로 두면 ${X} → ${iq(a)}일 때 ${Tv}는 ${iq(c)}보다 ${up ? '큰' : '작은'} 값을 가지면서 ${iq(c)}에 가까워진다. 따라서 ${is(LIM(a, `${V('g')}(${fx()})`), nb(LIM(c, `${V('g')}(${Tv})`, up ? '+' : '-')))} = ${iq(ans)}이다. ${V('g')}(${iq(c)})의 값(${iq(gc)})이 아니다.`,
          facts: { value: jn(ans) } });
      }
      const bpt = d.pick([0, 1, -1]), vals3 = d.shuffle([-2, -1, 1, 2, 3, 4]).slice(0, 3), [pv, qv, rv] = vals3;
      // f(t) = p (t > b), q (t = b), r (t < b); g(x) = x/|x| (x ≠ 0), 0 (x = 0)
      const fAt = (t) => (t > bpt ? pv : t === bpt ? qv : rv);
      const right = fAt(1), left = fAt(-1);
      const f = cases([[iq(pv), gt(X, bpt)], [iq(qv), nb(`${X} = ${iq(bpt)}`)], [iq(rv), lt(X, bpt)]]);
      const g = cases([[frac(X, `|${X}|`), nb(`${X} ${NE} 0`)], ['0', nb(`${X} = 0`)]]);
      return limCells(`두 함수 ${nb(`${fx()} = ${f}`)}, ${nb(`${fx('g')} = ${g}`)}에 대하여 다음 극한값을 구하시오.`, [[LIM(0, `${V('f')}(${fx('g')})`, '+'), right], [LIM(0, `${V('f')}(${fx('g')})`, '-'), left]], {
        explain: `${X} &gt; 0이면 ${is(fx('g'), 1)}이므로 ${V('f')}(${fx('g')}) = ${V('f')}(1) = ${iq(right)}, ${X} &lt; 0이면 ${is(fx('g'), -1)}이므로 ${V('f')}(${fx('g')}) = ${V('f')}(${MINUS}1) = ${iq(left)}이다. ${V('g')}(${X})의 값이 1, −1 그 자체이므로 ${V('f')}의 극한이 아니라 함숫값을 쓴다.`,
        facts: { calc: [[jn(right), 0], [jn(left), 1]] } });
    }, { count: 2 }),

    // ①14 생활 속 계단 함수의 좌극한·우극한(차례 1: 이하·초과로 나눈 요금표, 차례 2: 이상·미만으로 나눈 점수표)
    T('side-life', '요금표·점수표로 정한 함수의 좌극한과 우극한', '①14', (d, n) => {
      if (n === 0) {
        const w1 = d.pick([1, 2, 3]), w2 = w1 + d.pick([2, 3]), w3 = w2 + d.pick([3, 5]), f1 = d.pick([3000, 3500, 4000]), f2 = f1 + d.pick([500, 1000]), f3 = f2 + d.pick([1000, 1500]);
        const at = d.pick([w1, w2]), R = at === w1 ? f2 : f3, Lw = at === w1 ? f1 : f2;
        const fig = table(['물건의 무게', '배송 요금'], [[`${w1} kg 이하`, `${f1}원`], [`${w1} kg 초과 ${w2} kg 이하`, `${f2}원`], [`${w2} kg 초과 ${w3} kg 이하`, `${f3}원`]]);
        return inline(`어느 택배 회사의 배송 요금표이다. 무게가 ${X} kg인 물건의 배송 요금을 ${fx()}원이라 할 때, 다음 극한값을 구하시오. ${nb(`(단, 0 &lt; ${X} ${LE} ${w3})`)}`,
          `${nb(`${LIM(at, fx(), '+')} = {0}`)}, ${nb(`${LIM(at, fx(), '-')} = {1}`)}`, [{ answer: R }, { answer: Lw }], {
            figure: fig, shown: `${is(LIM(at, fx(), '+'), R)}, ${is(LIM(at, fx(), '-'), Lw)}`,
            explain: `무게가 ${at} kg보다 조금 무거우면 「${at} kg 초과」 칸의 ${R}원, 조금 가벼우면 ${at} kg 이하 칸의 ${Lw}원이다. 우극한은 ${R}, 좌극한은 ${Lw}이다.`,
            facts: { calc: [[String(R), 0], [String(Lw), 1]] } });
      }
      const t1 = d.pick([100, 110, 120]), t2 = t1 + d.pick([30, 40]), t3 = t2 + d.pick([20, 30]), s1 = d.pick([5, 6]);
      const at = d.pick([t2, t3]), R = at === t2 ? s1 + 2 : s1 + 3, Lw = R - 1;
      const fig = table(['기록', '점수'], [[`${t3} cm 이상`, `${s1 + 3}점`], [`${t2} cm 이상 ${t3} cm 미만`, `${s1 + 2}점`], [`${t1} cm 이상 ${t2} cm 미만`, `${s1 + 1}점`], [`${t1} cm 미만`, `${s1}점`]]);
      return inline(`어느 학교의 제자리멀리뛰기 점수표이다. 기록이 ${X} cm일 때의 점수를 ${fx()}점이라 할 때, 다음 극한값을 구하시오.`,
        `${nb(`${LIM(at, fx(), '+')} = {0}`)}, ${nb(`${LIM(at, fx(), '-')} = {1}`)}`, [{ answer: R }, { answer: Lw }], {
          figure: fig, shown: `${is(LIM(at, fx(), '+'), R)}, ${is(LIM(at, fx(), '-'), Lw)}`,
          explain: `기록이 ${at} cm보다 조금 길면 「${at} cm 이상」인 칸의 ${R}점, 조금 짧으면 그 아래 칸의 ${Lw}점이다. 우극한은 ${R}, 좌극한은 ${Lw}이다.`,
          facts: { calc: [[String(R), 0], [String(Lw), 1]] } });
    }, { count: 2 })
  ];
  // 선분을 y 범위 [ylo, yhi] 안으로 자른다(그림 상자 밖으로 나가지 않게)
  function clipSeg([x1, y1, x2, y2], ylo, yhi) {
    const at = (yy) => x1 + (x2 - x1) * (yy - y1) / (y2 - y1);
    let a = [x1, y1], b = [x2, y2];
    if (y1 > yhi) a = [at(yhi), yhi]; if (y1 < ylo) a = [at(ylo), ylo];
    if (y2 > yhi) b = [at(yhi), yhi]; if (y2 < ylo) b = [at(ylo), ylo];
    return [Number(a[0].toFixed(3)), a[1], Number(b[0].toFixed(3)), b[1]];
  }
  // 검사 식: 다항식의 값(계수 배열과 x)
  function polyJs(a, x) { return a.map((c, i) => (c === 0 ? null : i === 0 ? jn(c) : `(${jn(c)})*${Array(i).fill(`(${jn(x)})`).join('*')}`)).filter(Boolean).join('+') || '0'; }

  // ══ 다. 함수의 극한에 대한 성질 ══
  const F0 = fx(), G0 = fx('g');
  const prop = [
    // ①15 극한의 성질을 차례로 쓰는 과정의 빈칸(차례 1: 곱, 차례 2: 몫)
    T('prop-steps', '극한의 성질로 계산하는 과정의 빈칸', '①15', (d, n) => {
      const a = nz(d, -3, 3), p = d.int(2, 4), q = d.int(1, 5), r = d.int(2, 5), s = d.int(1, 6);
      if (r === p) return null;
      const LX = LIM(a, X), Lc = (v) => LIM(a, String(v));
      if (n === 0) {
        const val = (p * a + q) * (r * a - s);
        if (val === 0) return null;
        const tpl = `= (${p}${LX} + ${Lc(q)})({0}${LX} ${MINUS} ${Lc(s)})<br>= (${iq(p * a)} + ${q})({1} ${MINUS} ${s}) = {2}`;
        return inline(`다음은 함수의 극한에 대한 성질을 이용하여 ${LIM(a, `(${L(p, q)})(${L(r, -s)})`)}의 값을 구하는 과정이다. 빈칸에 알맞은 수를 차례로 구하시오.`, tpl,
          [{ answer: r }, { answer: r * a, signed: true }, { answer: val, signed: true }], {
            shown: `${r}, ${iq(r * a)}, ${iq(val)}`, explain: `곱의 극한은 극한의 곱이고, 상수배의 극한은 극한의 상수배이다. ${LX} = ${iq(a)}이므로 ${nb(`(${iq(p * a)} + ${q})(${iq(r * a)} ${MINUS} ${s})`)} = ${iq(val)}이다.`,
            facts: { calc: [[String(r), 0], [`${r}*(${jn(a)})`, 1], [`(${p}*(${jn(a)})+${q})*(${r}*(${jn(a)})-${s})`, 2]] } });
      }
      const top = p * a + q, bot = r * a + s;
      if (bot === 0 || top % bot !== 0 || top === 0) return null;
      const val = top / bot;
      const tpl = `= ${frac(`${p}${LX} + ${Lc(q)}`, `{0}${LX} + ${Lc(s)}`)} = ${frac(`${iq(p * a)} + ${q}`, `{1} + ${s}`)} = {2}`;
      return inline('다음은 함수의 극한에 대한 성질을 이용하여 극한값을 구하는 과정이다. 빈칸에 알맞은 수를 차례로 구하시오.', tpl,
        [{ answer: r }, { answer: r * a, signed: true }, { answer: val, signed: true }], {
          figure: hx(LIM(a, frac(L(p, q), L(r, s)))),
          shown: `${r}, ${iq(r * a)}, ${iq(val)}`, explain: `분모의 극한값이 0이 아니므로 몫의 극한은 극한의 몫이다. ${LX} = ${iq(a)}이므로 ${frac(`${iq(top)}`, `${iq(bot)}`)} = ${iq(val)}이다.`,
          facts: { calc: [[String(r), 0], [`${r}*(${jn(a)})`, 1], [`(${p}*(${jn(a)})+${q})/(${r}*(${jn(a)})+${s})`, 2]] } });
    }, { count: 2 }),

    // ①16 다항식·유리식의 극한값(차례 1: 다항식, 차례 2: 일차식의 곱·몫, 차례 3: x → ∞ 에서 1/xⁿ → 0)
    T('prop-sub', '대입으로 구하는 극한값', '①16', (d, n) => {
      if (n === 0) {
        const a = nz(d, -3, 3), P = [d.int(-6, 6), nz(d, -5, 5), nz(d, -3, 3)], v = pval(P, a);
        return numA('다음 극한값은?', v, { figure: hx(LIM(a, par(ptext(P)))), explain: `다항함수의 극한값은 ${X} = ${jq(a, '을/를')} 넣은 값이므로 ${iq(v)}이다.`, facts: { value: polyJs(P, a) } });
      }
      if (n === 1) {
        const a = nz(d, -3, 3), p = nz(d, -4, 4), q = nz(d, -5, 5), r = nz(d, -4, 4), s = nz(d, -5, 5), quot = d.bool();
        const A0 = p * a + q, B0 = r * a + s;
        if (A0 === 0 || B0 === 0 || (quot && A0 % B0 !== 0)) return null;
        const v = quot ? A0 / B0 : A0 * B0, h = quot ? frac(L(p, q), L(r, s)) : `(${L(p, q)})(${L(r, s)})`;
        return numA('다음 극한값은?', v, { figure: hx(LIM(a, h)), explain: `${quot ? '분모의 극한값이 0이 아니므로 ' : ''}각 식의 극한값 ${iq(A0)}, ${jq(B0, '을/를')} ${quot ? '나누면' : '곱하면'} ${iq(v)}이다.`,
          facts: { value: `((${jn(p)})*(${jn(a)})+(${jn(q)}))${quot ? '/' : '*'}((${jn(r)})*(${jn(a)})+(${jn(s)}))` } });
      }
      const c = nz(d, -5, 5), p = d.int(1, 6), q = d.int(1, 6);
      return numA('다음 극한값은?', c, { figure: hx(LIM('∞', `(${iq(c)} + ${frac(p, X)} ${MINUS} ${frac(q, X + sup(2))})`)), explain: `${X} → ∞일 때 ${frac(p, X)} → 0, ${frac(q, X + sup(2))} → 0이므로 극한값은 ${iq(c)}이다.`, facts: { value: jn(c) } });
    }, { count: 3 }),

    // ①17 수렴하는 두 함수로 만든 식의 극한(차례 1: 상수배의 합·차, 차례 2: 분수 꼴)
    T('prop-known', '극한값을 아는 두 함수로 만든 식의 극한', '①17', (d, n) => {
      const a = nz(d, -2, 3), al = nz(d, -4, 5), be = nz(d, -4, 5);
      if (al === be) return null;
      const given = `${is(LIM(a, F0), al)}, ${is(LIM(a, G0), be)}`;
      if (n === 0) {
        const p = d.int(2, 5), q = nz(d, -4, 4), v = p * al + q * be;
        const h = `{${p}${F0} ${q < 0 ? MINUS : '+'} ${Math.abs(q) === 1 ? '' : Math.abs(q)}${G0}}`;
        return numA(`두 함수 ${F0}, ${G0}에 대하여 ${given}일 때, ${LIM(a, h)}의 값은?`, v, {
          explain: `${nb(`${p} × ${pn(al)} ${q < 0 ? MINUS : '+'} ${Math.abs(q)} × ${pn(be)}`)} = ${iq(v)}이다.`,
          facts: { value: `${p}*(${jn(al)})+(${jn(q)})*(${jn(be)})` } });
      }
      const kind = d.int(0, 1);
      if (kind === 0) {
        const m = d.int(1, 12), k = d.int(1, 5), top = be * be - m, bot = al + k;
        if (bot === 0 || top % bot !== 0 || top === 0) return null;
        const v = top / bot;
        return numA(`두 함수 ${F0}, ${G0}에 대하여 ${given}일 때, 다음 극한값은?`, v, { figure: hx(LIM(a, frac(`{${G0}}${sup(2)} ${MINUS} ${m}`, `${F0} + ${k}`))),
          explain: `분모의 극한값 ${jq(bot, '이/가')} 0이 아니므로 ${frac(`${pn(be)}${sup(2)} ${MINUS} ${m}`, `${iq(al)} + ${k}`)} = ${iq(v)}이다.`,
          facts: { value: `((${jn(be)})*(${jn(be)})-${m})/((${jn(al)})+${k})`, derived: [2] } });
      }
      const p = d.int(1, 5), q = nz(d, -3, 3), top = p * al + q * be, bot = al * al;
      if (top % bot !== 0 || top === 0) return null;
      const v = top / bot;
      return numA(`두 함수 ${F0}, ${G0}에 대하여 ${given}일 때, 다음 극한값은?`, v, { figure: hx(LIM(a, frac(`${p === 1 ? '' : p}${F0} ${q < 0 ? MINUS : '+'} ${Math.abs(q) === 1 ? '' : Math.abs(q)}${G0}`, `{${F0}}${sup(2)}`))),
        explain: `분모의 극한값 ${jq(bot, '이/가')} 0이 아니므로 ${frac(`${p} × ${pn(al)} ${q < 0 ? MINUS : '+'} ${Math.abs(q)} × ${pn(be)}`, `${par(iq(al))}${sup(2)}`)} = ${iq(v)}이다.`,
        facts: { value: `(${p}*(${jn(al)})+(${jn(q)})*(${jn(be)}))/((${jn(al)})*(${jn(al)}))`, derived: [2] } });
    }, { count: 2 }),

    // ①18 합과 곱의 극한값에서 두 극한값을 찾아 쓰기
    T('prop-sumprod', '합과 곱의 극한값으로 두 극한값 구하기', '①18', (d) => {
      const al = nz(d, -5, 6), be = nz(d, -5, 6), big = d.bool();
      if (al === be || (big ? al < be : al > be)) return null;
      const m = d.int(2, 3), k = d.int(1, 6), top = m * al - be, bot = be + k;
      if (bot === 0 || top % bot !== 0 || top === 0) return null;
      const v = top / bot, sm = al + be, pr0 = al * be;
      return numA(`두 함수 ${F0}, ${G0}에 대하여 ${is(LIM(0, F0), Av)}, ${is(LIM(0, G0), Bv)}라 하자. ${is(LIM(0, `{${F0} + ${G0}}`), sm)}, ${is(LIM(0, F0 + G0), pr0)}일 때, 다음 극한값은? ${nb(`(단, ${Av} ${big ? '&gt;' : '&lt;'} ${Bv})`)}`, v, {
        figure: hx(LIM(0, frac(`${m}${F0} ${MINUS} ${G0}`, `${G0} + ${k}`))),
        explain: `${nb(`${Av} + ${Bv} = ${iq(sm)}`)}, ${nb(`${Av}${Bv} = ${iq(pr0)}`)}이므로 ${Av}, ${Bv}는 합이 ${iq(sm)}, 곱이 ${iq(pr0)}인 두 수이다. ${nb(`${Av} ${big ? '&gt;' : '&lt;'} ${Bv}`)}이므로 ${is(Av, al)}, ${is(Bv, be)}이고, 극한값은 ${frac(`${m} × ${pn(al)} ${MINUS} ${pn(be)}`, `${iq(be)} + ${k}`)} = ${iq(v)}이다.`,
        facts: { value: `(${m}*(${jn(al)})-(${jn(be)}))/((${jn(be)})+${k})`, derived: [Math.abs(al), Math.abs(be)] } });
    }),

    // ①19 lim f(x)/x 를 써서 구하는 극한(분모·분자를 x로 나눈다)
    T('prop-fx-x', 'lim f(x)/x를 써서 구하는 극한', '①19', (d) => {
      const k = nz(d, -4, 5), p = d.int(1, 5), q = d.int(1, 4), r = d.int(1, 5), s = d.int(1, 4);
      const top = p + q * k, bot = -s * k;
      if (top === 0 || bot === 0 || top % bot === 0) return null;
      const v = Q(top, bot);
      return numA(`함수 ${F0}에 대하여 ${is(LIM(0, frac(F0, X)), k)}일 때, 다음 극한값은?`, v, {
        figure: hx(LIM(0, frac(`${p === 1 ? '' : p}${X} + ${q === 1 ? '' : q}${F0}`, `${r === 1 ? '' : r}${X}${sup(2)} ${MINUS} ${s === 1 ? '' : s}${F0}`))),
        explain: `분모와 분자를 ${X}로 나누면 ${frac(`${p} + ${q} × ${frac(F0, X)}`, `${r}${X} ${MINUS} ${s} × ${frac(F0, X)}`)}이고, ${X} → 0일 때 ${frac(`${p} + ${q} × ${pn(k)}`, `0 ${MINUS} ${s} × ${pn(k)}`)} = ${iq(v)}이다.`,
        facts: { value: `(${p}+${q}*(${jn(k)}))/(0-${s}*(${jn(k)}))` } });
    }),

    // ①20 무한대로 발산하는 f(x)와 g(x)가 섞인 식의 극한(g/f 의 극한을 먼저 구한다)
    T('prop-inf-mix', '무한대로 발산하는 함수가 섞인 식의 극한', '①20', (d) => {
      const p = d.int(1, 4), q = d.int(1, 4), c = nz(d, -5, 5), u = d.int(1, 5), v = nz(d, -4, 4), w = d.int(1, 5), z = nz(d, -4, 4);
      if (gcd(p, q) !== 1) return null;
      const top = u * q - v * p, bot = w * q + z * p;
      if (bot === 0 || top === 0 || top % bot !== 0) return null;
      const val = top / bot;
      const comb = (a1, b1, op) => `${a1 === 1 ? '' : a1}${F0} ${op} ${Math.abs(b1) === 1 ? '' : Math.abs(b1)}${G0}`;
      return numA(`두 함수 ${F0}, ${G0}에 대하여 ${is(LIM('∞', F0), '∞')}, ${is(LIM('∞', `{${comb(p, q, MINUS)}}`), c)}일 때, 다음 극한값은?`, val, {
        figure: hx(LIM('∞', frac(comb(u, v, v < 0 ? '+' : MINUS), comb(w, z, z < 0 ? MINUS : '+')))),
        explain: `${nb(`${V('h')}(${X}) = ${comb(p, q, MINUS)}`)}로 두면 ${nb(`${frac(G0, F0)} = ${q === 1 ? iq(p) : frac(p, q)} ${MINUS} ${frac(`${V('h')}(${X})`, `${q === 1 ? '' : q}${F0}`)}`)}이고 ${frac(`${V('h')}(${X})`, F0)} → 0이므로 ${frac(G0, F0)} → ${iq(Q(p, q))}이다. 분모와 분자를 ${F0}로 나누어 넣으면 ${iq(val)}이다.`,
        facts: { value: `(${u}*${q}-(${jn(v)})*${p})/(${w}*${q}+(${jn(z)})*${p})` } });
    }),

    // ①21 극한의 성질에 대한 참·거짓(교과서가 가르치는 성질과 원문 보기)
    T('prop-truth', '극한의 성질에 대한 참·거짓', '①21', (d) => {
      const a = 'a';
      const Lf = LIM(a, F0), Lg = LIM(a, G0);
      const POOL = [
        { h: `${Lf}, ${LIM(a, `{${F0} + ${G0}}`)}의 값이 모두 존재하면 ${Lg}의 값도 존재한다.`, ok: true, why: `${G0} = {${F0} + ${G0}} ${MINUS} ${F0}이므로 차의 극한으로 존재한다` },
        { h: `${Lf}, ${LIM(a, frac(G0, F0))}의 값이 모두 존재하면 ${Lg}의 값도 존재한다.`, ok: true, why: `${G0} = ${F0} × ${frac(G0, F0)}이므로 곱의 극한으로 존재한다` },
        { h: `${Lf}, ${LIM(a, frac(F0, G0))}의 값이 모두 존재하면 ${Lg}의 값도 존재한다. ${nb(`(단, ${G0} ${NE} 0)`)}`, ok: false, why: `${nb(`${F0} = ${X} ${MINUS} ${Av}`)}, ${nb(`${G0} = ${frac(1, `${X} ${MINUS} ${Av}`)}`)}이면 두 극한값은 0으로 존재하지만 ${Lg}는 존재하지 않는다` },
        { h: `${is(LIM(a, frac(F0, G0)), V('α'))}(${V('α')}는 실수)이고 ${is(Lg, 0)}이면 ${is(Lf, 0)}이다.`, ok: true, why: `${F0} = ${frac(F0, G0)} × ${G0}이므로 ${Lf} = ${V('α')} × 0 = 0이다` },
        { h: `${LIM(a, `{${F0} + ${G0}}`)}의 값이 존재하면 ${Lf}, ${Lg}의 값도 모두 존재한다.`, ok: false, why: `${nb(`${F0} = ${frac(1, `${X} ${MINUS} ${Av}`)}`)}, ${nb(`${G0} = ${MINUS}${frac(1, `${X} ${MINUS} ${Av}`)}`)}이면 합은 0이지만 각각은 존재하지 않는다` },
        { h: `${Lf}, ${LIM(a, F0 + G0)}의 값이 모두 존재하면 ${Lg}의 값도 존재한다.`, ok: false, why: `${nb(`${F0} = ${X} ${MINUS} ${Av}`)}, ${nb(`${G0} = ${frac(1, `${X} ${MINUS} ${Av}`)}`)}이면 두 극한값은 0, 1로 존재하지만 ${Lg}는 존재하지 않는다` }
      ];
      const pick3 = d.shuffle(POOL).slice(0, 3);
      if (!pick3.some((s) => s.ok)) return null;
      return comboPick(d, `두 함수 ${F0}, ${G0}에 대하여 보기에서 옳은 것만을 있는 대로 고른 것은? (단, ${Av}는 실수)`, pick3.map((s) => s.h), pick3.map((s) => s.ok),
        pick3.map((s, i) => `${GA[i]}. ${s.ok ? '참' : '거짓'} — ${s.why}`).join('. ') + '.');
    }),

    // ①22 아는 극한으로 모르는 극한 구하기(분모를 인수분해하고 x − a = t 로 바꾼다)
    T('prop-subst', '아는 극한으로 모르는 극한 구하기', '①22', (d) => {
      const a = nz(d, -3, 3), m = nz(d, -12, 12), kq = Q(m, 2 * a);
      if (Math.abs(kq.p) > 12 || kq.q > 6) return null;
      const inner = a > 0 ? `${X} ${MINUS} ${a}` : `${X} + ${-a}`;
      return numA(`함수 ${F0}에 대하여 ${is(LIM(a, frac(`${V('f')}(${inner})`, poly([[1, X + sup(2)], [-a * a, '']]))), kq)}일 때, ${LIM(0, frac(F0, X))}의 값은?`, m, {
        explain: `${nb(`${frac(`${V('f')}(${inner})`, inner)} = ${frac(`${V('f')}(${inner})`, `${X}${sup(2)} ${MINUS} ${a * a}`)} × (${L(1, a)})`)}이므로 ${LIM(a, frac(`${V('f')}(${inner})`, inner))} = ${iq(kq)} × ${pn(2 * a)} = ${iq(m)}이다. ${is(nb(inner), Tv)}로 두면 ${X} → ${iq(a)}일 때 ${Tv} → 0이므로 ${is(LIM(0, frac(fx(null, Tv), Tv)), m)}이다.`,
        facts: { value: `${jn(kq)}*2*(${jn(a)})`, derived: [2] } });
    })
  ];

  // b·c 파일이 함께 쓰는 도구
  B.kit.u1121 = {
    S1, S2, T, H, seal, stripH, X, Av, Bv, Cv, Kv, Nv, Tv, asQ, iq, jn, sT, fx, yfx, is, jq, lj, pz, padd, pscale, pmul, pval, fromRoots, ptext, L, den, par, LIM, cases,
    LE, GE, NE, lt, le, ge, gt, convTo, PINF, NINF, numA, vals, limCells, pickOne, comboPick, GA, ints, segGraph, grid2, polyJs, clipSeg, rt2, F0, G0, pn, nv, BLUE, RED
  };

  B.addUnit({ id: '11-2-1', grade: 11, semester: 2, no: 1, title: '함수의 극한', version: 1, groups: [
    { id: 'conv', title: '함수의 수렴과 발산', standard: S1, types: conv },
    { id: 'side', title: '우극한과 좌극한', standard: S1, types: side },
    { id: 'prop', title: '함수의 극한에 대한 성질', standard: S2, types: prop },
    { id: 'zero', title: '0/0 꼴의 극한', standard: S2, types: [] },
    { id: 'inf', title: '∞/∞ 꼴과 ∞ − ∞ 꼴의 극한', standard: S2, types: [] },
    { id: 'coef', title: '극한값을 이용한 미정계수', standard: S2, types: [] },
    { id: 'polyf', title: '극한 조건으로 다항함수 정하기', standard: S2, types: [] },
    { id: 'squeeze', title: '함수의 극한의 대소 관계', standard: S2, types: [] },
    { id: 'shape', title: '도형과 극한', standard: S2, types: [] }
  ] });
})(typeof window !== 'undefined' ? window : globalThis);
