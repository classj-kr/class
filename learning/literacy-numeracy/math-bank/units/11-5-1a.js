// 고등학교 미적분Ⅱ Ⅰ-1 수열의 극한 — 단원 틀·도구와 앞쪽 묶음(수열의 수렴과 발산, 수열의 극한에 대한 성질).
// 수집해 둔 천재 T셀파 미적분Ⅱ(홍진곤, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 29꼴, 기본꼴_2: 22꼴, 심화 문서 없음)을
// 꼴마다 따져서 실었다. 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-5-1/싣기_대조표.md 에 있다.
// (극한값의 계산·대소 관계·도형·등비수열의 극한은 11-5-1b.js 에, 실력 문항은 11-5-1c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
// 성취기준은 12미적Ⅱ-01-01(수열의 수렴, 발산의 뜻), 12미적Ⅱ-01-02(수열의 극한에 대한 성질), 12미적Ⅱ-01-03(등비수열의 수렴, 발산).
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(일반항·나열·극한 조건·부등식·도형), 묻는 것(극한값·수렴과 발산·상수·범위·참과 거짓),
//    식의 꼴(∞/∞, ∞ − ∞, 근호가 분자에 있는가 분모에 있는가, 합의 공식, 지수 꼴, rⁿ과 r²ⁿ)이 다르면 따로 싣는다. 수만 바꾼 유형은 만들지 않는다.
//  - 미적분Ⅰ 「함수의 극한」(11-2-1)과 같은 일(∞/∞, ∞ − ∞, 미정계수, 대소 관계)은 과목이 달라 수열의 꼴로 싣는다(사용자 결정).
//    등비수열이 수렴하는 범위(−1 &lt; r ≤ 1)는 급수 단원(11-5-2)의 등비급수 수렴 범위(−1 &lt; r &lt; 1)와 뜻이 달라 이 단원 몫으로 싣는다(사용자 결정).
//  - 교육과정: 이 영역의 「다루지 않는다」는 급수의 계산 하나뿐이라 빼는 까닭으로 쓴 것이 없다. 꼬여 있거나 경우를 따져야 하는 꼴은 실력에 싣는다.
//  - 답: 극한값·상수는 부호 단추가 붙은 수 칸(분수 답은 분자·분모 칸)으로 받는다. 한 유형 안에서는 차례·씨앗이 바뀌어도 답이 늘 정수이거나
//    늘 정수가 아닌 분수가 되게 수를 골라 칸의 모양이 답을 흘리지 않게 했다. 수렴·발산을 가리는 것과 근호가 든 값은 고르기로, 개수만 단추 없이 받는다.
//    원문의 「a + b의 값」「f(1/3) + f(1) + f(2)의 값」「모든 r의 값의 합」처럼 따로 구한 값을 더한 꼴은 값을 칸마다 따로 받거나 개수·가장 큰 값을 묻는다.
//  - 늘 같은 답이 나오는 원문은 수를 바꿨다: ①19(곱이 이어진 식 — 늘 1)는 앞에 곱하는 식을 (pn + q)ᵐ으로, ①25(sin nθ/n — 늘 0)는 (pn + k sin nθ)/(n + c)로.
//  - 그림: 고2 공용 plot 으로 그린다. 원문 그림을 알 수 없는 평가지 문항은 없다(도형 문항은 글로 모두 정해진다).
//  - 답은 모두 코드가 셈한다. 고르기의 참·거짓도 손으로 적지 않고 식의 극한으로 가린다(극한의 성질에 대한 참·거짓 문장만 교과서의 성질과 반례로 적었다).
//  - 검사 근거: 수 칸은 문제에 적힌 수로 다시 셈하는 식(facts.value·calc)이고, 글에 없는 수는 seal 이 facts.unseen 에 밝힌다.
//
// 뺀 것과 까닭(11-5-1b.js, 11-5-1c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 놀이·활동: ①1(생활 속 상황을 수열로 나타내고 극한을 짐작하는 생각 열기 — 하는 일은 ①2에 있다).
//  - 공학 도구: ②16(알지오매스 표로 n⁴/3ⁿ 꼴의 극한을 짐작 — 교과서가 성질로 가르치지 않고 답이 늘 0, 사용자 결정).
//  - 바꾼 것: ①6(명제와 역 — 참·거짓 고르기와 반례 고르기로), ②20의 그래프 그리기(그래프 고르기로), 소3-5(문제 글의 6 − 2rⁿ 을 풀이의 6 − 2r²ⁿ 으로).
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」 문자는 값을 물으면 「상수 a」로 부른다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, inline } = B.kit;
  const { LAB, MINUS, gcd, Q, qadd, qsub, qmul, qdiv, qcmp, isInt, tx, nb, tail, js, V, sup, nz, poly, asQ, rt } = B.kit.mid;
  const { ms, lim, sum, pw, trig, hx, qAns, plot, signed, jh } = B.kit.hs;
  const S1 = '12미적Ⅱ-01-01', S2 = '12미적Ⅱ-01-02', S3 = '12미적Ⅱ-01-03';

  // ── 검사 근거 마무리 ──
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 0과 1과 o.derived 로 밝히기로 한 수만 된다(아니면 식을 잘못 적은 것).
  function seal(item) {
    const f = item.facts || {};
    // 셈이 0으로 끝나는 식은 −0이 될 수 있다. 검사는 −0과 0을 가르므로 +0 을 붙여 0으로 맞춘다.
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
  // 만들기가 null 을 돌려주면(조건에 맞지 않는 수) 다시 만든다. 칸으로 받는 수는 9999를 넘지 않는다.
  const tooBig = (item) => Array.isArray(item.inputs) && item.inputs.some((input) => !input.rel && Math.abs(input.answer) > 9999);
  const retry = (make) => (d, n) => { for (let i = 0; i < 4000; i += 1) { const item = make(d, n); if (item && !tooBig(item)) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 기본 자료(' + ref + ')', make: retry(make) }, more || {});

  // ── 글 ──
  const NV = V('n'), RV = V('r'), XV = V('x'), Av = V('a'), Bv = V('b'), Kv = V('k'), Pv = V('p'), Qv = V('q'), AL = V('α');
  const AN = ms('a_n'), BN = ms('b_n'), CN = ms('c_n'), SN = ms('S_n');
  const iq = (v) => tx(asQ(v));                                        // 화면에 적는 수(음수는 −, 분수는 분수 꼴)
  const jn = (v) => js(asQ(v));                                        // 검사 식에 적는 수((-3), (3/4))
  const jq = (v, pair) => { const q = asQ(v); return nb(iq(q) + tail(Math.abs(q.p), pair)); };   // 수 뒤 토씨(분수는 분자)
  const pn = (v) => { const q = asQ(v); return q.p < 0 ? `(${iq(q)})` : iq(q); };              // 음수만 괄호에
  const is = (l, r) => nb(`${l} = ${typeof r === 'string' ? r : iq(r)}`);
  const par = (h) => `(${h})`;
  const seq = (h) => nb(`{${h}}`);                                     // 수열 {…}
  const LN = (body) => lim('n→∞', body);                               // lim(n→∞)
  const LE = '≤', GE = '≥', NE = '≠';
  // 다항식(오름차순 계수 [상수항, n의 계수, n²의 계수, …])
  const pz = (a) => { const out = a.slice(); while (out.length > 1 && out[out.length - 1] === 0) out.pop(); return out; };
  const pval = (a, x) => a.reduce((s, c, i) => s + c * x ** i, 0);
  const ptext = (a, v) => poly(pz(a).map((c, i) => [c, i === 0 ? '' : (v || NV) + (i > 1 ? sup(i) : '')]).reverse());
  const lead = (c, h) => (c === 1 ? h : c === -1 ? MINUS + h : iq(c) + h);   // 곱해진 계수(1은 적지 않고 −1은 −만)
  const plusTerm = (c, h) => (c < 0 ? ` ${MINUS} ` : ' + ') + (Math.abs(c) === 1 && h ? '' : Math.abs(c)) + (h || '');   // 앞 항 뒤에 이어 붙이는 항
  const MO = `(${MINUS}1)${sup(NV)}`;                                 // (−1)ⁿ
  // 첫 세 항과 일반항을 늘어놓은 글: 3, 5/2, 7/3, …, (2n + 1)/n, …
  const listOf = (f, gen) => `${[1, 2, 3].map((k) => iq(f(k))).join(', ')}, …, ${gen}, …`;
  // 수렴·발산을 말로
  const convTo = (v) => `${iq(v)}에 수렴한다.`;
  const PINF = '양의 무한대로 발산한다.', NINF = '음의 무한대로 발산한다.', OSC = '진동한다.';

  // ── 답 ──
  // 수 하나(부호 단추가 늘 붙는다 — 단추가 「답이 음수다」를 알려 주지 않게). 정수 답의 유형과 분수 답의 유형을 섞지 않는다.
  const numA = (text, v, o) => qAns(text, v, Object.assign({ signed: true }, o));
  // 문자의 값 여럿: 「a = [±][ ]  b = [±][ ]」(셋째 원소가 참이면 부호 단추 없이)
  const vals = (text, pairs, o) => M(text, pairs.map(([leadH, answer, bare]) => ({ lead: leadH + ' =', answer, signed: !bare })), Object.assign({}, o, { shown: pairs.map(([leadH, answer]) => is(leadH, answer)).join(', ') }));
  // 식 옆에 칸을 둔다: [[식 HTML, 답], …]
  const cells = (text, rows, o) => inline(text, rows.map(([h], i) => nb(`${h} = {${i}}`)).join(', '), rows.map(([, answer]) => ({ answer, signed: true })), Object.assign({}, o, { shown: rows.map(([h, answer]) => nb(`${h} = ${iq(answer)}`)).join(', ') }));

  // ── 고르기 ──
  // rows = [{ h, ok }]: ok 가 참인 것이 꼭 하나. 보기를 섞어 고르기 문항으로.
  function pickOne(d, text, rows, o) {
    if (rows.filter((r) => r.ok).length !== 1 || new Set(rows.map((r) => stripH(r.h))).size !== rows.length) return null;
    const list = o && o.keep ? rows : d.shuffle(rows);
    return C(text, list.map((r) => r.h), list.findIndex((r) => r.ok), Object.assign({}, o, { facts: Object.assign({ truth: list.map((r) => r.ok), want: true }, (o && o.facts) || {}) }));
  }
  // ㄱ, ㄴ, ㄷ 가운데 옳은 것을 「있는 대로 고른 것」: 보기 다섯(정답 포함). flags 는 하나 이상 참.
  const GA = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'];
  const COMBOS = [[0], [1], [2], [0, 1], [0, 2], [1, 2], [0, 1, 2]];
  function comboPick(d, text, list, flags, explain, more) {
    const right = [0, 1, 2].filter((i) => flags[i]);
    if (!right.length) return null;
    const key = (c) => c.join(','), others = d.shuffle(COMBOS.filter((c) => key(c) !== key(right))).slice(0, 4);
    const rows = others.concat([right]).sort((u, v) => u.length - v.length || key(u).localeCompare(key(v)));
    return C(text, rows.map((c) => c.map((i) => GA[i]).join(', ')), rows.findIndex((c) => key(c) === key(right)), Object.assign({ figure: lines(list.map((h, i) => `<b>${GA[i]}.</b> ${h}`)), explain, facts: { truth: rows.map((c) => key(c) === key(right)), want: true } }, more || {}));
  }
  // 수렴·발산을 조사한 결과 고르기: res = { k: 'v' | '+' | '-' | 'o', v }(v 는 수렴할 때의 극한값), others = 틀린 보기에 쓸 극한값 후보.
  function judge(d, text, figure, res, others, explain) {
    const v1 = res.k === 'v' ? asQ(res.v) : asQ(others[0]);
    const rest = (res.k === 'v' ? others : others.slice(1)).map(asQ).filter((q) => qcmp(q, v1) !== 0);
    if (!rest.length) return null;
    return pickOne(d, text, [
      { h: convTo(v1), ok: res.k === 'v' }, { h: convTo(rest[0]), ok: false },
      { h: PINF, ok: res.k === '+' }, { h: NINF, ok: res.k === '-' }, { h: OSC, ok: res.k === 'o' }
    ], { figure, explain });
  }
  const JUDGE = '다음 수열의 수렴, 발산을 조사한 결과로 옳은 것은?';

  // ══ 가. 수열의 수렴과 발산 ══
  const conv = [
    // ①2 일반항·나열로 준 수열. 차례 1: 수렴하는 수열의 극한값. 차례 2: 수렴(극한값)·양의 무한대·음의 무한대 가르기.
    T('conv-gen', '일반항으로 준 수열의 수렴과 발산', '①2', (d, n) => {
      if (n === 0) {
        const kind = d.int(0, 2), c = nz(d, -4, 5), q = nz(d, -6, 6);
        let gen, f, why;
        if (kind === 0) { gen = frac(ptext([q, c]), NV); f = (k) => Q(c * k + q, k); why = `${is(gen, nb(`${iq(c)} ${q < 0 ? MINUS : '+'} ${frac(Math.abs(q), NV)}`))}이고 ${frac(Math.abs(q), NV)}의 값은 0에 한없이 가까워진다`; }
        else if (kind === 1) { gen = iq(c); f = () => Q(c); why = '모든 항이 같은 수열이다'; }
        else { gen = frac(ptext([q, 0, c]), NV + sup(2)); f = (k) => Q(c * k * k + q, k * k); why = `${is(gen, nb(`${iq(c)} ${q < 0 ? MINUS : '+'} ${frac(Math.abs(q), NV + sup(2))}`))}이고 ${frac(Math.abs(q), NV + sup(2))}의 값은 0에 한없이 가까워진다`; }
        return numA('다음 수열의 극한값은?', c, { figure: hx(listOf(f, gen)),
          explain: `${why}. 따라서 ${NV}의 값이 한없이 커질 때 일반항의 값은 ${iq(c)}에 한없이 가까워지므로 극한값은 ${iq(c)}이다.`, facts: { value: jn(c) } });
      }
      const kind = d.int(0, 3), a = nz(d, -4, 4), b = nz(d, -6, 6), p = d.int(1, 3), c = nz(d, -5, 5);
      let gen, f, res, others, why;
      if (kind === 0) { gen = ptext([b, a]); f = (k) => Q(a * k + b); res = { k: a > 0 ? '+' : '-' }; others = [b, a]; why = `항이 ${iq(Math.abs(a))}씩 ${a > 0 ? '커지므로 양의 무한대로' : '작아지므로 음의 무한대로'} 발산한다`; }
      else if (kind === 1) { const s = d.pick([1, -1]); gen = ptext([c, 0, 0, s * p]); f = (k) => Q(s * p * k ** 3 + c); res = { k: s > 0 ? '+' : '-' }; others = [c, s * p]; why = `${NV}${sup(3)}의 값이 한없이 커지므로 ${s > 0 ? '양의 무한대로' : '음의 무한대로'} 발산한다`; }
      else if (kind === 2) { const s = d.pick([1, -1]); gen = ptext([c, 0, s * p]); f = (k) => Q(s * p * k * k + c); res = { k: s > 0 ? '+' : '-' }; others = [c, 0]; why = `${NV}${sup(2)}의 값이 한없이 커지므로 ${s > 0 ? '양의 무한대로' : '음의 무한대로'} 발산한다`; }
      else { const k0 = nz(d, -6, 6); gen = `${iq(c)} ${k0 < 0 ? MINUS : '+'} ${frac(Math.abs(k0), NV)}`; f = (k) => Q(c * k + k0, k); res = { k: 'v', v: c }; others = [c + k0, 0, c + 1]; why = `${frac(Math.abs(k0), NV)}의 값이 0에 한없이 가까워지므로 ${iq(c)}에 수렴한다`; }
      return judge(d, JUDGE, hx(listOf(f, gen)), res, others, `일반항이 ${gen}이므로 ${NV}의 값이 한없이 커질 때 ${why}.`);
    }, { count: 2 }),

    // ①3 (−1)ⁿ이 든 수열: 두 값을 오가면 진동, n으로 나뉘면 수렴, 절댓값이 커지며 부호가 바뀌면 진동
    T('conv-alt', '(−1)ⁿ이 든 수열의 수렴과 발산', '①3', (d) => {
      const c = nz(d, -3, 4), p = d.int(2, 4), sg = (k) => (k % 2 === 0 ? 1 : -1);
      const pool = [
        () => ({ gen: `${iq(c)} + ${MO}`, f: (k) => Q(c + sg(k)), res: { k: 'o' }, others: [c, c + 1], why: `항이 ${iq(c - 1)}, ${jq(c + 1, '을/를')} 번갈아 가지므로 진동한다` }),
        () => ({ gen: frac(`${p} ${MINUS} ${MO}`, 2), f: (k) => Q(p - sg(k), 2), res: { k: 'o' }, others: [Q(p, 2), 0], why: `항이 ${iq(Q(p + 1, 2))}, ${jq(Q(p - 1, 2), '을/를')} 번갈아 가지므로 진동한다` }),
        () => ({ gen: `${iq(c)} + ${frac(MO, NV)}`, f: (k) => Q(c * k + sg(k), k), res: { k: 'v', v: c }, others: [c + 1, 0], why: `${frac(MO, NV)}의 절댓값은 ${frac(1, NV)}이라 0에 한없이 가까워지므로 ${iq(c)}에 수렴한다` }),
        () => ({ gen: frac(`${p}${NV} + ${MO}`, NV), f: (k) => Q(p * k + sg(k), k), res: { k: 'v', v: p }, others: [p + 1, 0], why: `${is(frac(`${p}${NV} + ${MO}`, NV), nb(`${p} + ${frac(MO, NV)}`))}이고 ${frac(MO, NV)} → 0이므로 ${iq(p)}에 수렴한다` }),
        () => ({ gen: `${MO} × ${frac(NV, p)}`, f: (k) => Q(sg(k) * k, p), res: { k: 'o' }, others: [0, Q(1, p)], why: '항의 절댓값은 한없이 커지지만 부호가 번갈아 바뀌므로 양의 무한대로도 음의 무한대로도 발산하지 않고 진동한다' }),
        () => ({ gen: frac(`${p} + ${MO}`, NV), f: (k) => Q(p + sg(k), k), res: { k: 'v', v: 0 }, others: [1, p], why: `분자는 ${jq(p - 1, '과/와')} ${p + 1} 가운데 하나이고 분모는 한없이 커지므로 0에 수렴한다` })
      ];
      const e = d.pick(pool)();
      return judge(d, JUDGE, hx(listOf(e.f, e.gen)), e.res, e.others, `일반항이 ${e.gen}이므로 ${e.why}.`);
    }),

    // ①4 삼각함수 값이 되풀이되는 수열(sin nπ/2 는 진동, tan nπ 는 모든 항이 0)
    T('conv-trig', '삼각함수 값으로 된 수열의 수렴과 발산', '①4', (d) => {
      const k = d.int(1, 4), c = nz(d, -3, 4), np = `${NV}π`, half = frac(np, 2);
      const kx = (h) => (k === 1 ? h : `${k}${h}`);
      const pool = [
        () => ({ gen: trig('sin', half), f: (m) => [1, 0, -1, 0][(m - 1) % 4], res: { k: 'o' }, others: [0, 1], why: '항이 1, 0, −1, 0을 차례로 되풀이하므로 진동한다' }),
        () => ({ gen: trig('cos', half), f: (m) => [0, -1, 0, 1][(m - 1) % 4], res: { k: 'o' }, others: [0, 1], why: '항이 0, −1, 0, 1을 차례로 되풀이하므로 진동한다' }),
        () => ({ gen: kx(trig('cos', np)), f: (m) => (m % 2 === 0 ? k : -k), res: { k: 'o' }, others: [k, 0], why: `항이 ${MINUS}${k}, ${jq(k, '을/를')} 번갈아 가지므로 진동한다` }),
        () => ({ gen: `${trig('tan', np)} ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`, f: () => c, res: { k: 'v', v: c }, others: [c + 1, 0], why: `${trig('tan', np)} = 0이므로 모든 항이 ${iq(c)}인 수열이고 ${iq(c)}에 수렴한다` }),
        () => ({ gen: `${kx(trig('sin', np))} ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`, f: () => c, res: { k: 'v', v: c }, others: [c + k, 0], why: `${trig('sin', np)} = 0이므로 모든 항이 ${iq(c)}인 수열이고 ${iq(c)}에 수렴한다` }),
        () => ({ gen: kx(trig('cos', `2${NV}π`)), f: () => k, res: { k: 'v', v: k }, others: [0, -k], why: `${trig('cos', `2${NV}π`)} = 1이므로 모든 항이 ${iq(k)}인 수열이고 ${iq(k)}에 수렴한다` })
      ];
      const e = d.pick(pool)();
      return judge(d, JUDGE, hx(listOf((m) => Q(e.f(m)), e.gen)), e.res, e.others, `${e.why}.`);
    }),

    // ①5 여러 꼴이 섞인 보기에서 수렴하는 것 고르기. 차례 1: 보기 ㄱ, ㄴ, ㄷ에서 있는 대로. 차례 2: 다섯 가운데 하나. 차례 3: 극한값이 같은 두 수열.
    T('conv-pick', '여러 수열 가운데 수렴하는 것 고르기', '①5', (d, n) => {
      const pool = convPool();
      if (n === 0) {
        const three = d.shuffle(pool).slice(0, 3).map((g) => g(d));
        if (!three.some((s) => s.conv)) return null;
        return comboPick(d, '보기에서 수렴하는 수열만을 있는 대로 고른 것은?', three.map((s) => seq(s.h)), three.map((s) => s.conv),
          three.map((s, i) => `${GA[i]}. ${s.why}`).join(' ') );
      }
      if (n === 1) {
        const wantConv = d.bool(), mk = d.shuffle(pool).map((g) => g(d));
        const one = mk.find((s) => s.conv === wantConv), rest = mk.filter((s) => s.conv !== wantConv).slice(0, 4);
        if (!one || rest.length < 4) return null;
        const rows = [{ h: seq(one.h), ok: true, why: one.why }].concat(rest.map((s) => ({ h: seq(s.h), ok: false, why: s.why })));
        const list = d.shuffle(rows);
        return pickOne(d, wantConv ? '다음 중 수렴하는 수열은?' : '다음 중 수렴하지 않는 수열은?', list, { keep: true, explain: list.map((r) => `${r.h}: ${r.why}`).join(' ') });
      }
      // 극한값이 같은 두 수열(넷 가운데 꼭 한 쌍)
      const t = d.int(-2, 3), u = d.until(() => d.int(-2, 3), (x) => x !== t), w = d.until(() => d.int(-2, 4), (x) => x !== t && x !== u);
      const makers = d.shuffle(sameMakers());
      const want = [t, t, u, w], used = [], items = [];
      for (const v of want) {
        const g = makers.find((m) => !used.includes(m) && m.ok(v));
        if (!g) return null;
        used.push(g); items.push(Object.assign(g.make(d, v), { v }));
      }
      const order = d.shuffle([0, 1, 2, 3]), shown4 = order.map((i) => items[i]);
      const pairs = [];
      for (let i = 0; i < 4; i += 1) for (let j = i + 1; j < 4; j += 1) pairs.push([i, j]);
      const isRight = (pr) => shown4[pr[0]].v === shown4[pr[1]].v;
      const right = pairs.find(isRight), others = d.shuffle(pairs.filter((pr) => !isRight(pr))).slice(0, 4);
      const rows = others.concat([right]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      return C('보기의 수열 가운데 극한값이 서로 같은 두 수열을 고른 것은?', rows.map((pr) => `${GA[pr[0]]}, ${GA[pr[1]]}`), rows.findIndex(isRight), {
        figure: lines(shown4.map((s, i) => `<b>${GA[i]}.</b> ${s.h}`)),
        explain: shown4.map((s, i) => `${GA[i]}의 극한값은 ${iq(s.v)}`).join(', ') + `이다. 같은 것은 ${GA[right[0]]}, ${GA[right[1]]}이다.`,
        facts: { truth: rows.map(isRight), want: true } });
    }, { count: 3 }),

    // ①6 수열과 짝수 번째 항의 수열 — 명제와 역(차례 1: 참·거짓, 차례 2: 반례 고르기)
    T('conv-sub', '수열과 짝수(홀수) 번째 항의 수열', '①6', (d, n) => {
      const A2 = ms('a_{2n}'), A21 = ms('a_{2n-1}');
      if (n === 0) {
        const POOL = [
          { h: `수열 ${jh(seq(AN), '이/가')} ${AL}에 수렴하면 수열 ${seq(A2)}도 ${AL}에 수렴한다.`, ok: true, why: `${jh(A2, '은/는')} ${AN}의 짝수 번째 항만 차례로 늘어놓은 것이라 ${AL}에 한없이 가까워진다` },
          { h: `수열 ${jh(seq(AN), '이/가')} ${AL}에 수렴하면 수열 ${seq(A21)}도 ${AL}에 수렴한다.`, ok: true, why: `${jh(A21, '은/는')} ${AN}의 홀수 번째 항만 늘어놓은 것이라 ${AL}에 한없이 가까워진다` },
          { h: `수열 ${jh(seq(A2), '이/가')} 수렴하면 수열 ${seq(AN)}도 수렴한다.`, ok: false, why: '1, 3, 1, 3, …은 짝수 번째 항이 모두 3이라 수렴하지만 진동한다' },
          { h: `수열 ${jh(seq(A21), '이/가')} 수렴하면 수열 ${seq(AN)}도 수렴한다.`, ok: false, why: '1, 3, 1, 3, …은 홀수 번째 항이 모두 1이라 수렴하지만 진동한다' }
        ];
        const three = d.shuffle(POOL).slice(0, 3);
        return comboPick(d, `수열 ${seq(AN)}에 대하여 보기에서 옳은 것만을 있는 대로 고른 것은? ${nb(`(단, ${AL}는 실수)`)}`, three.map((s) => s.h), three.map((s) => s.ok),
          three.map((s, i) => `${GA[i]}. ${s.ok ? '참' : '거짓'} — ${s.why}.`).join(' '));
      }
      const c = d.int(1, 4), q = d.int(1, 3), p = d.int(2, 4);
      const rights = [
        { h: is(AN, `${iq(c)} + ${q === 1 ? '' : q}${MO}`), why: `짝수 번째 항은 모두 ${jq(c + q, '이라/라')} 수렴하지만 ${NV}번째 항은 ${iq(c - q)}, ${jq(c + q, '을/를')} 번갈아 가지므로 진동한다` },
        { h: is(AN, trig('sin', frac(`${NV}π`, 2))), why: `짝수 번째 항은 ${trig('sin', `${NV}π`)} = 0이라 수렴하지만 수열은 1, 0, −1, 0을 되풀이하므로 진동한다` }
      ];
      const wrongs = [
        { h: is(AN, frac(`${NV} + ${MO}`, NV)), why: '짝수 번째 항의 수열과 수열 모두 1에 수렴한다' },
        { h: is(AN, `${MO} × ${p}${NV}`), why: '짝수 번째 항이 양의 무한대로 발산한다' },
        { h: is(AN, frac(`${p}${NV} + 1`, NV)), why: `두 수열 모두 ${iq(p)}에 수렴한다` },
        { h: is(AN, `${p}${NV}`), why: '두 수열 모두 양의 무한대로 발산한다' },
        { h: is(AN, frac(MO, `${p}${NV}`)), why: '두 수열 모두 0에 수렴한다' }
      ];
      const r = d.pick(rights), ws = d.shuffle(wrongs).slice(0, 4);
      const rows = d.shuffle([{ h: r.h, ok: true, why: r.why }].concat(ws.map((w) => ({ h: w.h, ok: false, why: w.why }))));
      return pickOne(d, `다음 중 수열 ${jh(seq(A2), '은/는')} 수렴하지만 수열 ${jh(seq(AN), '은/는')} 발산하는 것은?`, rows, { keep: true,
        explain: rows.map((w) => `${w.h}: ${w.why}.`).join(' ') });
    }, { count: 2 })
  ];

  // ①5 보기에 쓸 수열: { h 일반항 HTML, conv, why }
  function convPool() {
    const r = (d, lo, hi) => d.int(lo, hi);
    return [
      (d) => { const a = r(d, 2, 5), b = r(d, 1, 6), c = r(d, 1, 4); return { h: frac(`${a}${NV} + ${b}`, `${NV} + ${c}`), conv: true, why: `${frac(`${a}${NV} + ${b}`, `${NV} + ${c}`)} → ${iq(a)}(수렴).` }; },
      (d) => { const a = r(d, 2, 5), b = r(d, 3, 12); return { h: `${a}${NV} ${MINUS} ${b}`, conv: false, why: `${a}${NV} ${MINUS} ${b} → ∞(발산).` }; },
      (d) => { const p = r(d, 2, 5); return { h: `1 ${MINUS} (${frac(1, p)})${sup(NV)}`, conv: true, why: `(${frac(1, p)})${sup(NV)} → 0이므로 1에 수렴.` }; },
      (d) => { const p = r(d, 2, 5); return { h: `1 ${MINUS} ${p}${sup(NV)}`, conv: false, why: `${p}${sup(NV)} → ∞이므로 음의 무한대로 발산.` }; },
      (d) => { const p = r(d, 2, 4); return { h: frac(`${p} + ${MO}`, NV), conv: true, why: `분자는 ${p - 1}부터 ${p + 1}까지의 값이고 분모 → ∞이므로 0에 수렴.` }; },
      (d) => { const p = r(d, 2, 3); return { h: `(${frac(1, p)})${sup(`3${NV}`)}`, conv: true, why: `공비가 ${frac(1, p ** 3)}인 등비수열이므로 0에 수렴.` }; },
      (d) => { const e = r(d, 2, 3); return { h: frac(MO, NV + sup(e)), conv: true, why: '절댓값이 0에 가까워지므로 0에 수렴.' }; },
      (d) => { const p = r(d, 2, 6); return { h: frac(`1 ${MINUS} ${p}${sup(NV)}`, `1 + ${p}${sup(NV)}`), conv: true, why: `분모·분자를 ${jh(`${p}${sup(NV)}`, '으로/로')} 나누면 −1에 수렴.` }; },
      (d) => { const k = r(d, 2, 6); return { h: frac(1, `${rt(`${NV} + ${k}`)} ${MINUS} ${rt(NV)}`), conv: false, why: `분모를 유리화하면 ${frac(`${rt(`${NV} + ${k}`)} + ${rt(NV)}`, k)} → ∞(발산).` }; },
      (d) => { const a = r(d, 2, 6); return { h: `${a}${NV} ${MINUS} ${NV}${sup(2)}`, conv: false, why: `${NV}${sup(2)}으로 묶으면 음의 무한대로 발산.` }; },
      (d) => { const k = d.pick([2, 3, 5]); return { h: `(${MINUS}${frac(1, rt(k))})${sup(NV)}`, conv: true, why: `공비의 절댓값 ${frac(1, rt(k))}이 1보다 작으므로 0에 수렴.` }; },
      (d) => { const k = r(d, 2, 6); return { h: frac(`${rt(`${NV}${sup(2)} + ${k}${NV}`)} ${MINUS} ${NV}`, NV), conv: true, why: `분모·분자를 ${NV}으로 나누면 ${rt(`1 + ${frac(k, NV)}`)} ${MINUS} 1 → 0(수렴).` }; },
      (d) => { const p = r(d, 5, 7), q = r(d, 2, p - 1), s = r(d, 2, p - 1); return { h: frac(`${p}${sup(`${NV} + 1`)} ${MINUS} ${q}${sup(NV)}`, `${p}${sup(NV)} + ${s}${sup(NV)}`), conv: true, why: `분모·분자를 ${jh(`${p}${sup(NV)}`, '으로/로')} 나누면 ${iq(p)}에 수렴.` }; },
      (d) => { const c = r(d, 1, 4); return { h: `${iq(c)} + ${MO}`, conv: false, why: `${iq(c - 1)}, ${jq(c + 1, '을/를')} 번갈아 가지므로 진동(발산).` }; },
      (d) => { const p = r(d, 2, 4); return { h: `${MO} × ${p}${NV}`, conv: false, why: '부호가 번갈아 바뀌며 절댓값이 커지므로 진동(발산).' }; }
    ];
  }
  // ①5 차례 3: 극한값이 v 인 수열을 만드는 것들
  function sameMakers() {
    return [
      { ok: () => true, make: (d, v) => ({ h: `${iq(v)}, ${iq(v)}, ${iq(v)}, …, ${iq(v)}, …` }) },
      { ok: () => true, make: (d, v) => { const k = d.int(1, 5); return { h: seq(v === 0 ? `${MINUS}${frac(k, NV)}` : `${iq(v)} ${MINUS} ${frac(k, NV)}`) }; } },
      { ok: (v) => v !== 0, make: (d, v) => { const q = d.int(1, 4); return { h: seq(frac(lead(v, NV), `${NV} + ${q}`)) }; } },
      { ok: (v) => v !== 0, make: (d, v) => { const k = nz(d, -5, 5); return { h: seq(frac(ptext([k, 0, v]), ptext([1, 0, 1]))) }; } },
      { ok: (v) => v === 0, make: (d) => { const k = d.int(1, 4); return { h: seq(frac(k, rt(NV))) }; } }
    ];
  }

  // ══ 나. 수열의 극한에 대한 성질 ══
  const prop = [
    // ①7 극한의 성질을 차례로 쓰는 과정의 빈칸(차례 1: 곱의 극한, 차례 2: 분모의 최고차항으로 나누기)
    T('prop-steps', '극한의 성질로 계산하는 과정의 빈칸', '①7', (d, n) => {
      if (n === 0) {
        const p = nz(d, -5, 6), r = nz(d, -5, 6), q = d.int(1, 6), s = d.int(1, 6);
        const A0 = `${iq(p)} + ${frac(q, NV)}`, B0 = `${iq(r)} ${MINUS} ${frac(s, NV)}`;
        return inline(`다음은 수열의 극한에 대한 성질을 이용하여 극한값을 구하는 과정이다. 빈칸에 알맞은 수를 차례로 구하시오.`,
          `= ${LN(`(${A0})`)} × ${LN(`(${B0})`)}<br>= {0} × {1} = {2}`,
          [{ answer: p, signed: true }, { answer: r, signed: true }, { answer: p * r, signed: true }], {
            figure: hx(LN(`(${A0})(${B0})`)), shown: `${iq(p)}, ${iq(r)}, ${iq(p * r)}`, explain: `두 수열이 수렴하므로 곱의 극한은 극한의 곱이다. ${frac(q, NV)} → 0, ${frac(s, NV)} → 0이므로 ${iq(p)} × ${pn(r)} = ${iq(p * r)}이다.`,
            facts: { calc: [[jn(p), 0], [jn(r), 1], [`(${jn(p)})*(${jn(r)})`, 2]] } });
      }
      const c = d.int(2, 5), t = nz(d, -4, 4), a = c * t, b = nz(d, -6, 6), e = nz(d, -5, 5);
      return inline('다음은 분모의 최고차항으로 분모와 분자를 나누어 극한값을 구하는 과정이다. 빈칸에 알맞은 수를 차례로 구하시오.',
        `= ${LN(frac(`{0} ${b < 0 ? MINUS : '+'} ${frac(Math.abs(b), NV + sup(2))}`, `{1} ${e < 0 ? MINUS : '+'} ${frac(Math.abs(e), NV)}`))} = {2}`,
        [{ answer: a, signed: true }, { answer: c, signed: true }, { answer: t, signed: true }], {
          figure: hx(LN(frac(ptext([b, 0, a]), ptext([0, e, c])))), shown: `${iq(a)}, ${iq(c)}, ${iq(t)}`, explain: `분모와 분자를 ${NV}${sup(2)}으로 나누면 분자는 ${iq(a)}에, 분모는 ${iq(c)}에 한없이 가까워지므로 극한값은 ${frac(iq(a), c)} = ${iq(t)}이다.`,
          facts: { calc: [[jn(a), 0], [String(c), 1], [`(${jn(a)})/${c}`, 2]] } });
    }, { count: 2 }),

    // ①8 1/n 꼴로 이루어진 식의 극한값(차례 1: 합·차, 차례 2: 곱, 차례 3: 몫)
    T('prop-onen', '1/n이 든 식의 극한값', '①8', (d, n) => {
      const p = d.int(1, 6), q = d.int(1, 6);
      if (n === 0) {
        const c = nz(d, -6, 7);
        return numA('다음 극한값은?', c, { figure: hx(LN(`(${iq(c)} + ${frac(p, NV)} ${MINUS} ${frac(q, NV + sup(2))})`)),
          explain: `${frac(p, NV)} → 0, ${frac(q, NV + sup(2))} → 0이므로 극한값은 ${iq(c)}이다.`, facts: { value: jn(c) } });
      }
      if (n === 1) {
        const a = nz(d, -5, 6), b = nz(d, -5, 6);
        return numA('다음 극한값은?', a * b, { figure: hx(LN(`(${iq(a)} + ${frac(p, NV)})(${iq(b)} ${MINUS} ${frac(q, NV)})`)),
          explain: `두 수열이 각각 ${iq(a)}, ${iq(b)}에 수렴하므로 곱의 극한은 ${iq(a)} × ${pn(b)} = ${iq(a * b)}이다.`, facts: { value: `(${jn(a)})*(${jn(b)})` } });
      }
      const r = d.int(2, 5), t = nz(d, -4, 4), a = r * t;
      return numA('다음 극한값은?', -t, { figure: hx(LN(frac(`${frac(p, NV + sup(2))} ${MINUS} ${a < 0 ? `(${iq(a)})` : a}`, `${r} + ${frac(q, NV)}`))),
        explain: `분모의 극한값 ${jq(r, '이/가')} 0이 아니므로 몫의 극한은 ${frac(`0 ${MINUS} ${pn(a)}`, r)} = ${iq(-t)}이다.`, facts: { value: `(0-(${jn(a)}))/${r}` } });
    }, { count: 3 }),

    // ①9 극한값을 아는 두 수열로 만든 식의 극한(차례 1: 상수배의 합·차, 차례 2: 곱에 수를 더한 것 또는 몫)
    T('prop-known', '극한값을 아는 두 수열로 만든 식의 극한', '①9', (d, n) => {
      const al = nz(d, -4, 5), be = nz(d, -4, 5);
      if (al === be) return null;
      const given = `${is(LN(AN), al)}, ${is(LN(BN), be)}`;
      if (n === 0) {
        const p = d.int(2, 5), q = d.int(1, 4), v = p * al - q * be;
        return numA(`두 수열 ${seq(AN)}, ${seq(BN)}에 대하여 ${given}일 때, ${LN(`(${p}${AN} ${MINUS} ${q === 1 ? '' : q}${BN})`)}의 값은?`, v, {
          explain: `${p} × ${pn(al)} ${MINUS} ${q} × ${pn(be)} = ${iq(v)}이다.`, facts: { value: `${p}*(${jn(al)})-${q}*(${jn(be)})` } });
      }
      if (d.bool()) {
        const c = nz(d, -5, 5), v = al * be + c;
        return numA(`두 수열 ${seq(AN)}, ${seq(BN)}에 대하여 ${given}일 때, ${LN(`(${AN}${BN} ${c < 0 ? MINUS : '+'} ${Math.abs(c)})`)}의 값은?`, v, {
          explain: `${pn(al)} × ${pn(be)} ${c < 0 ? MINUS : '+'} ${Math.abs(c)} = ${iq(v)}이다.`, facts: { value: `(${jn(al)})*(${jn(be)})+(${jn(c)})` } });
      }
      const k = d.int(2, 6);
      if ((k * al) % be !== 0) return null;
      const v = (k * al) / be;
      return numA(`두 수열 ${seq(AN)}, ${seq(BN)}에 대하여 ${given}일 때, ${LN(frac(`${k}${AN}`, BN))}의 값은? ${nb(`(단, ${BN} ${NE} 0)`)}`, v, {
        explain: `분모의 극한값이 0이 아니므로 ${frac(`${k} × ${pn(al)}`, iq(be))} = ${iq(v)}이다.`, facts: { value: `${k}*(${jn(al)})/(${jn(be)})` } });
    }, { count: 2 }),

    // ①10 변형된 식의 극한값에서 lim aₙ, lim bₙ을 먼저 구하기
    T('prop-shift', '변형된 식의 극한값으로 두 극한값 구하기', '①10', (d) => {
      const p = d.int(1, 6), u = nz(d, -5, 5), q = d.int(1, 6), v = nz(d, -5, 5), al = p - u, be = v - q;
      if (al === 0 || be === 0) return null;
      const sq = d.bool(), val = sq ? al * al + be * be : al * be;
      const target = sq ? `(${AN}${sup(2)} + ${BN}${sup(2)})` : AN + BN;
      return numA(`수렴하는 두 수열 ${seq(AN)}, ${seq(BN)}에 대하여 ${is(LN(`(${p} ${MINUS} ${AN})`), u)}, ${is(LN(`(${q} + ${BN})`), v)}일 때, ${LN(target)}의 값은?`, val, {
        explain: `${is(nb(`${p} ${MINUS} ${LN(AN)}`), u)}에서 ${is(LN(AN), al)}, ${is(nb(`${q} + ${LN(BN)}`), v)}에서 ${is(LN(BN), be)}이다. 따라서 ${sq ? `${pn(al)}${sup(2)} + ${pn(be)}${sup(2)}` : `${pn(al)} × ${pn(be)}`} = ${iq(val)}이다.`,
        facts: { value: sq ? `(${p}-(${jn(u)}))*(${p}-(${jn(u)}))+((${jn(v)})-${q})*((${jn(v)})-${q})` : `(${p}-(${jn(u)}))*((${jn(v)})-${q})` } });
    }),

    // ①11 수렴하는 수열의 분수식 극한값이 주어질 때 lim aₙ(α로 놓고 방정식)
    T('prop-solve', '분수식의 극한값으로 수렴하는 수열의 극한값 구하기', '①11', (d) => {
      const al = nz(d, -9, 9), p = nz(d, -7, 7), q = nz(d, -6, 6), r = d.int(1, 4), s = nz(d, -6, 6);
      const top = p * al + q, bot = r * al + s;
      if (bot === 0 || top === 0) return null;
      const Lv = Q(top, bot);
      if (Lv.q > 9 || Math.abs(Lv.p) > 20 || qcmp(Lv, Q(p, r)) === 0) return null;
      const body = frac(ptext([q, p], AN), ptext([s, r], AN));
      return numA(`수렴하는 수열 ${seq(AN)}에 대하여 ${is(LN(body), Lv)}일 때, ${LN(AN)}의 값은?`, al, {
        explain: `${is(LN(AN), AL)}라 하면 ${is(LN(body), frac(ptext([q, p], AL), ptext([s, r], AL)))}이므로 ${is(frac(ptext([q, p], AL), ptext([s, r], AL)), Lv)}이다. 이 방정식을 풀면 ${is(AL, al)}이다.`,
        facts: { value: `((${jn(q)})-(${jn(s)})*(${jn(Lv)}))/((${jn(Lv)})*${r}-(${jn(p)}))` } });
    }),

    // ①12 lim naₙ(또는 lim aₙ/n)을 써서 다른 극한값(차례 1: lim naₙ, 차례 2: lim aₙ/n과 근호)
    T('prop-nan', 'lim naₙ을 써서 구하는 극한', '①12', (d, n) => {
      const k = d.bool() ? Q(1, d.int(2, 5)) : Q(d.pick([1, 2, 3])), p = d.int(1, 9), q = d.int(1, 6);
      if (n === 0) {
        const v = qdiv(Q(p), k);
        if (!isInt(v)) return null;
        return numA(`모든 항이 양수인 수열 ${seq(AN)}에 대하여 ${is(LN(NV + AN), k)}일 때, ${LN(frac(`${lead(p, NV)} + ${q}`, NV + sup(2) + AN))}의 값은?`, v.p, {
          explain: `${is(frac(`${lead(p, NV)} + ${q}`, NV + sup(2) + AN), nb(`${frac(`${lead(p, NV)} + ${q}`, NV)} × ${frac(1, NV + AN)}`))}이고 ${frac(`${lead(p, NV)} + ${q}`, NV)} → ${p}, ${NV}${AN} → ${iq(k)}이므로 극한값은 ${frac(p, iq(k))} = ${iq(v)}이다.`,
          facts: { value: `${p}/(${jn(k)})` } });
      }
      const m = d.int(2, 5), v = qdiv(Q(m - 1), k);
      if (!isInt(v)) return null;
      return numA(`수열 ${seq(AN)}에 대하여 ${is(LN(frac(AN, NV)), k)}일 때, ${LN(frac(`${rt(`${m * m}${NV}${sup(2)} + ${NV}`)} ${MINUS} ${NV}`, AN))}의 값은?`, v.p, {
        explain: `분모와 분자를 ${NV}으로 나누면 ${frac(`${rt(`${m * m} + ${frac(1, NV)}`)} ${MINUS} 1`, frac(AN, NV))}이고 분자 → ${m} ${MINUS} 1 = ${m - 1}, 분모 → ${iq(k)}이므로 극한값은 ${frac(m - 1, iq(k))} = ${iq(v)}이다.`,
        facts: { value: `(${m}-1)/(${jn(k)})`, derived: [m] } });
    }, { count: 2 }),

    // ①15 극한의 성질에 대한 참·거짓(교과서가 가르치는 성질과 원문 보기 — 거짓에는 반례)
    T('prop-truth', '수열의 극한의 성질에 대한 참·거짓', '①15', (d) => {
      const p = d.int(2, 4), q = d.int(1, 5), r = d.int(2, 9) * p;
      const L2 = LN(par(`${p}${NV} + ${q}`) + AN);
      const POOL = [
        { h: `수열 ${jh(seq(AN), '이/가')} 수렴하면 수열 ${seq(AN + sup(2))}도 수렴한다.`, ok: true, why: `${is(LN(AN + sup(2)), nb(`${LN(AN)} × ${LN(AN)}`))}이다` },
        { h: `두 수열 ${seq(AN)}, ${jh(seq(AN + BN), '이/가')} 모두 수렴하면 수열 ${seq(BN)}도 수렴한다.`, ok: false, why: `${is(AN, frac(1, NV + sup(2)))}, ${is(BN, NV)}이면 ${AN} → 0, ${AN}${BN} → 0이지만 ${BN} → ∞이다` },
        { h: `두 수열 ${seq(AN)}, ${jh(seq(BN), '이/가')} 모두 발산하면 수열 ${seq(AN + BN)}도 발산한다.`, ok: false, why: `${is(AN, MO)}, ${is(BN, MO)}이면 둘 다 진동하지만 ${is(AN + BN, 1)}이라 수렴한다` },
        { h: `두 수열 ${seq(AN)}, ${jh(seq(`${AN} ${MINUS} ${BN}`), '이/가')} 모두 수렴하면 수열 ${seq(AN + BN)}도 수렴한다.`, ok: true, why: `${is(BN, nb(`${AN} ${MINUS} (${AN} ${MINUS} ${BN})`))}이라 ${BN}도 수렴하고, 수렴하는 두 수열의 곱도 수렴한다` },
        { h: `모든 자연수 ${NV}에 대하여 ${nb(`${AN} &lt; ${BN} &lt; ${CN}`)}이고 ${is(LN(`(${CN} ${MINUS} ${AN})`), 0)}이면 수열 ${jh(seq(BN), '은/는')} 수렴한다.`, ok: false, why: `${is(AN, NV)}, ${is(BN, nb(`${NV} + ${frac(1, `2${NV}`)}`))}, ${is(CN, nb(`${NV} + ${frac(1, NV)}`))}이면 조건을 만족시키지만 ${BN} → ∞이다` },
        { h: `수열 ${jh(seq(AN), '이/가')} 수렴하고 ${is(LN(`(${AN} ${MINUS} 2${BN})`), 0)}이면 수열 ${seq(BN)}도 수렴한다.`, ok: true, why: `${is(BN, frac(`${AN} ${MINUS} (${AN} ${MINUS} 2${BN})`, 2))}이므로 수렴하는 두 수열의 차를 2로 나눈 것이다` },
        { h: `수열 ${jh(seq(AN), '이/가')} 수렴하고 ${is(LN(frac(`2${BN}`, AN)), 1)}이면 수열 ${seq(BN)}도 수렴한다. ${nb(`(단, ${AN} ${NE} 0)`)}`, ok: true, why: `${is(BN, nb(`${frac(1, 2)} × ${AN} × ${frac(`2${BN}`, AN)}`))}이므로 수렴하는 두 수열의 곱이다(${AN} → 0이어도 된다)` },
        { h: `수열 ${jh(seq(AN), '이/가')} 수렴하고 ${is(LN(AN + BN), 2)}이면 수열 ${seq(BN)}도 수렴한다.`, ok: false, why: `${is(AN, frac(1, `${NV} + 1`))}, ${is(BN, `2${NV}`)}이면 ${AN}${BN} → 2이지만 ${BN} → ∞이다` },
        { h: `${is(LN(`|${BN}|`), 0)}이면 ${is(LN(BN), 0)}이다.`, ok: true, why: `${nb(`${MINUS}|${BN}| ${LE} ${BN} ${LE} |${BN}|`)}이고 양쪽 끝이 0에 수렴하므로 대소 관계에 의하여 ${BN} → 0이다` },
        { h: `${is(L2, r)}이면 ${is(LN(NV + AN), r / p)}이다.`, ok: true, why: `${is(NV + AN, nb(`${frac(NV, `${p}${NV} + ${q}`)} × (${p}${NV} + ${q})${AN}`))}이므로 극한값은 ${frac(1, p)} × ${r} = ${r / p}이다` },
        { h: `${is(L2, r)}이면 ${is(LN(NV + AN), r)}이다.`, ok: false, why: `${is(NV + AN, nb(`${frac(NV, `${p}${NV} + ${q}`)} × (${p}${NV} + ${q})${AN}`))}이므로 극한값은 ${frac(1, p)} × ${r} = ${r / p}이다` },
        { h: `수열 ${jh(seq(AN + BN), '이/가')} 수렴하면 두 수열 ${seq(AN)}, ${seq(BN)}도 각각 수렴한다.`, ok: false, why: `${is(AN, MO)}, ${is(BN, `2 × ${MO}`)}이면 ${is(AN + BN, 2)}이지만 둘 다 진동한다` }
      ];
      const pick3 = d.shuffle(POOL).slice(0, 3);
      if (pick3.includes(POOL[9]) && pick3.includes(POOL[10])) return null;
      return comboPick(d, `두 수열 ${seq(AN)}, ${seq(BN)}에 대하여 보기에서 옳은 것만을 있는 대로 고른 것은?`, pick3.map((s) => s.h), pick3.map((s) => s.ok),
        pick3.map((s, i) => `${GA[i]}. ${s.ok ? '참' : '거짓'} — ${s.why}.`).join(' '));
    })
  ];

  // b·c 파일이 함께 쓰는 도구
  B.kit.u1151 = {
    S1, S2, S3, T, H, seal, stripH, NV, RV, XV, Av, Bv, Kv, Pv, Qv, AL, AN, BN, CN, SN, iq, jn, jq, pn, is, par, seq, LN, LE, GE, NE,
    pz, pval, ptext, lead, plusTerm, MO, listOf, convTo, PINF, NINF, OSC, numA, vals, cells, pickOne, comboPick, GA, judge, JUDGE
  };

  B.addUnit({ id: '11-5-1', grade: 11, semester: 5, no: 1, title: '수열의 극한', version: 1, groups: [
    { id: 'conv', title: '수열의 수렴과 발산', standard: S1, types: conv },
    { id: 'prop', title: '수열의 극한에 대한 성질', standard: S2, types: prop },
    { id: 'calc', title: '∞/∞ 꼴과 ∞ − ∞ 꼴의 극한', standard: S2, types: [] },
    { id: 'squeeze', title: '수열의 극한의 대소 관계', standard: S2, types: [] },
    { id: 'shape', title: '도형과 수열의 극한', standard: S2, types: [] },
    { id: 'geo', title: '등비수열의 수렴과 발산', standard: S3, types: [] },
    { id: 'geocalc', title: '등비수열이 든 극한값', standard: S3, types: [] }
  ] });
})(typeof window !== 'undefined' ? window : globalThis);
