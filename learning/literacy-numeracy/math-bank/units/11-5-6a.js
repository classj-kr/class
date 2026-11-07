// 고등학교 미적분Ⅱ Ⅲ-1 여러 가지 적분법 — 단원 틀·도구와 앞쪽 묶음(xⁿ·지수함수·삼각함수의 적분, 여러 가지 함수의 정적분, 도함수에서 함수 구하기).
// 수집해 둔 천재 T셀파 미적분Ⅱ(홍진곤, 2022 개정) 한 종의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 33꼴, 기본꼴_2: 32꼴, 심화 문서 없음)을
// 꼴마다 따져서 실었다. 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는
// references/textbooks/수학/_분석/11-5-6/싣기_대조표.md 에 있다.
// (치환적분법·부분적분법과 함수 결정 묶음은 11-5-6b.js 에, 실력 문항은 11-5-6c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
// 성취기준: 12미적Ⅱ-03-01(xⁿ(n은 실수)·지수함수·삼각함수의 부정적분과 정적분), 12미적Ⅱ-03-02(치환적분법), 12미적Ⅱ-03-03(부분적분법).
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 적분하기 전에 식을 바꾸는 길(나누기·펼치기·인수분해·삼각함수 사이의 관계), 무엇을 t 로 놓는가(일차식, 속 함수, 분모),
//    부분적분에서 무엇을 미분하는가(다항식, 로그), 조건으로 적분상수를 정하는 길(함숫값, 접선, 극값, 정적분을 상수로 놓기)이 다르면 따로 싣는다.
//  - 교육과정 원문에 내용을 못 박은 「다루지 않는다」는 없다(「지나치게 복잡한 문제는 다루지 않는다」는 정도의 말이라 빼는 까닭이 아니다).
//    어려운 꼴은 실력(11-5-6c.js)에 싣는다. 삼각치환(교과서 생각 넓히기)도 실력에 싣는다.
//  - 1단계 보고에 대해 정한 것: 다항식 치환(①21·①22·②1의 ∫(x − 1)⁵ dx 따위)은 싣는다(과목이 달라 미적분Ⅰ과 겹쳐도 싣는다).
//    ①20(적분으로 정의된 함수의 최댓값)·②7(sec x = t)·②22·②31을 싣는다. 절댓값이 있는 정적분 ∫|f(x)|dx 는 이 단원에 싣는다(넓이로 묻는 것은 11-5-7).
//  - 답: 부정적분은 상수만큼 다른 꼴이 여럿이라 식 칸으로 받지 않는다 — 고르기로 내거나, 조건으로 적분상수를 정하고 함숫값을 묻는다.
//    e·π·근호·ln 이 섞인 값은 고르기, 정수·유리수는 수 칸(분수는 분자·분모 칸 — 크기가 같은 분수도 맞게 친다, 음수가 나올 수 있으면 부호 단추).
//    원문의 「p + q의 값」「a + b의 값」처럼 따로 구한 값을 뜻 없이 더한 꼴은 값을 칸마다 따로 받거나 값 하나로 묻는다.
//  - 고르기의 참·거짓은 손으로 적지 않는다. 부정적분의 보기는 두 끝값의 차가 피적분함수의 수치 적분(심프슨 공식)과 같은지로, 정적분의 보기는 보기의 값이
//    수치 적분과 같은지로 코드가 가린다(보기 식을 거꾸로 미분해 맞추는 것이 아니라 따로 셈한 값과 견준다). 수 답의 검사 근거는 문제에 적힌 수로 다시 셈하는 식이다.
//  - 그림: 이 단원은 식 문항뿐이라 그림이 없다(원문의 그림은 풀이 보조 그래프 하나 — 교 145쪽 y = |√x − 1| — 없어도 풀린다).
//
// 뺀 것과 까닭(11-5-6b.js, 11-5-6c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 서술형만으로 묻는 것(조정 결정): ①14의 생각 넓히기 2·3(|∫f| ≤ ∫|f| 증명과 등호 조건), ①24(∫f(ax + b)dx = 1/a·F(ax + b) + C 보이기).
//  - 겹침: ②8 안의 최소 성취 4(∫xeˣdx 과정 빈칸 — part-exp #1 과 같은 일), ②11 안의 교점10(기울기 2x ln x 와 한 점 — part-exp #2 와 같은 일),
//    ①17 안의 E 카드(def-combine #1 과 같은 일), ②14의 ∫sin x cos x dx 부분(sub-inner #1 과 같은 일 — 되돌아오는 부분적분 쪽만 실음).
//  - 놀이 판: ①17 창의·코딩의 말판 길 찾기(카드의 정적분만 실음).
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C } = B.kit;
  const { MINUS, Q, fl, tx, nb, js, V, sup, gcd, rt } = B.kit.mid;
  const MQ = B.kit.mid;
  const { ms, intg, jh, qAns, pw, rtn, ln, trig } = B.kit.hs;
  const S1 = '12미적Ⅱ-03-01', S2 = '12미적Ⅱ-03-02', S3 = '12미적Ⅱ-03-03';

  // ── 검사 근거 마무리(11-2-6a.js 와 같은 방법) ──
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 10 이하의 수(지수, 적분할 때 나누는 수)와 o.derived 로 밝힌 수만 된다.
  function seal(item) {
    if (item.facts && item.facts.calc) item.facts.calc = item.facts.calc.map(([t, i]) => [`(${t})+0`, i]);
    if (item.facts && item.facts.value !== undefined) item.facts.value = `(${item.facts.value})+0`;
    const f = item.facts || {}, derived = new Set((f.derived || []).map(Number)), shown = visibleNumbers(item), out = new Set(f.unseen || []);
    const exprs = (f.calc || []).map(([t]) => t).concat(f.value !== undefined ? [f.value] : []);
    for (const t of exprs) for (const n of String(t).match(/\d+(?:\.\d+)?/g) || []) {
      if (shown.has(n)) continue;
      if (!(Number(n) <= 10) && !derived.has(Number(n))) throw new Error('검사 식의 수 ' + n + ' 이 글에도 밝힌 수에도 없다: ' + t);
      out.add(Number(n));
    }
    delete f.derived;
    if (out.size) f.unseen = [...out]; else delete f.unseen;
    item.facts = f;
    return item;
  }
  const retry = (make) => (d, n) => { for (let i = 0; i < 3000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const sourceOf = (ref) => '수집본 기본 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: sourceOf(ref), make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: sourceOf(ref), make: retry(make) }, more || {});

  // ── 유리수 ──
  const q = (x) => (typeof x === 'number' ? Q(x) : x);
  const qadd = (a, b) => MQ.qadd(q(a), q(b)), qsub = (a, b) => MQ.qsub(q(a), q(b)), qmul = (a, b) => MQ.qmul(q(a), q(b)), qdiv = (a, b) => MQ.qdiv(q(a), q(b));
  const qn = (x) => fl(q(x));
  const J = (x) => js(q(x));                                                   // 검사 식에 적는 수
  const iq = (x) => tx(q(x));                                                  // 화면에 적는 수
  const nzi = (d, lo, hi) => d.until(() => d.int(lo, hi), (v) => v !== 0);

  // ── 수치 셈(보기의 참·거짓을 가리는 데 쓴다) ──
  const LN = Math.log, EE = Math.E, PI = Math.PI, SQ = Math.sqrt;
  const sec = (x) => 1 / Math.cos(x), csc = (x) => 1 / Math.sin(x), cot = (x) => Math.cos(x) / Math.sin(x);
  // 심프슨 공식(구간을 2000 조각) — 매끄러운 함수에서 오차가 1e-12 아래다.
  function simpson(f, a, b, n) {
    if (a === b) return 0;
    const m = n || 2000, h = (b - a) / m;
    let s = f(a) + f(b);
    for (let i = 1; i < m; i += 1) s += f(a + i * h) * (i % 2 ? 4 : 2);
    return s * h / 3;
  }
  const close = (a, b) => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 1e-7 * Math.max(1, Math.abs(a), Math.abs(b));

  // ── 화면 글 ──
  const X = V('x'), Tt = V('t'), Cc = V('C'), EV = V('e');
  const plusC = (h) => h + ' + ' + Cc;
  const CN = `(단, ${jh(Cc, '은/는')} 적분상수이다.)`;
  const ind = (body) => intg(null, null, body, 'x');                                   // ∫ … dx
  const dfi = (lo, hi, body, v) => intg(lo, hi, body, v || 'x');                       // ∫(lo~hi) … dx
  const fx = (name, arg) => V(name || 'f') + '(' + (arg == null ? X : typeof arg === 'number' ? iq(arg) : arg) + ')';
  const fp = (name, arg) => V(name || 'f') + '′(' + (arg == null ? X : typeof arg === 'number' ? iq(arg) : arg) + ')';
  const FX = fx('f'), FCX = fx('F');
  const is = (l, r) => { const h = `${l} = ${typeof r === 'string' ? r : iq(r)}`; return stripH(h).length > 22 ? h : nb(h); };
  const sn = (arg, p) => trig('sin', arg == null ? 'x' : arg, p), cs = (arg, p) => trig('cos', arg == null ? 'x' : arg, p), tn = (arg, p) => trig('tan', arg == null ? 'x' : arg, p);
  const sc = (arg, p) => trig('sec', arg == null ? 'x' : arg, p), cc = (arg, p) => trig('csc', arg == null ? 'x' : arg, p), ct = (arg, p) => trig('cot', arg == null ? 'x' : arg, p);
  const lnAbs = (h) => ln('|' + (h || X) + '|');
  const ePow = (h) => EV + sup(typeof h === 'string' && !/[<&]/.test(h) ? ms(h) : h);     // e 의 거듭제곱
  const pi = (p, qq) => { const c = Q(p, qq || 1); return c.p === 0 ? '0' : (c.p < 0 ? MINUS : '') + (c.q === 1 ? (Math.abs(c.p) === 1 ? '' : Math.abs(c.p)) + 'π' : frac((Math.abs(c.p) === 1 ? '' : Math.abs(c.p)) + 'π', c.q)); };
  // 항의 합: [계수, 몸, 분모?]의 배열. 계수는 수나 유리수, 몸은 HTML(''이면 상수항). 셋째가 참이면 「계수/몸」 꼴(−4/x 따위).
  function sumH(terms) {
    const live = terms.map(([c, v, den]) => [q(c), v || '', den]).filter(([c]) => c.p !== 0);
    if (!live.length) return '0';
    return live.map(([c, v, den], i) => {
      const s = i === 0 ? (c.p < 0 ? MINUS : '') : c.p < 0 ? ' ' + MINUS + ' ' : ' + ';
      const a = Q(Math.abs(c.p), c.q);
      let m;
      if (den) m = frac(String(a.p), (a.q === 1 ? '' : a.q) + v);
      else if (!v) m = MQ.mag(a);
      else m = (a.p === 1 && a.q === 1 ? '' : MQ.mag(a)) + v;
      return s + m;
    }).join('');
  }
  const pf = (c) => (c < 0 ? '(' + iq(c) + ')' : iq(c));                                // 식 속의 수(음수는 괄호)
  const sg = (v) => (v < 0 ? MINUS : '+');

  // ── 답 ──
  const num = (text, v, o) => qAns(text, q(v), Object.assign({ signed: true }, o));    // 수 하나(부호 단추)
  const pos = (text, v, o) => qAns(text, q(v), o);                                      // 늘 양수인 수
  // 값 고르기: right = [보기 글, 값], wrongs = [[보기 글, 값], …], check = 따로 셈한 값(수치 적분 따위). 정답의 값이 check 와 다르면 오류(코드의 실수)다.
  //  check 와 같은 값의 틀린 보기, 서로 같은 값·같은 글의 보기는 버리고 넷을 고른다(모자라면 null — 수를 다시 고른다).
  function chooseV(d, text, right, wrongs, check, o) {
    if (!close(right[1], check)) throw new Error('정답 보기의 값 ' + right[1] + ' 이 따로 셈한 값 ' + check + ' 과 다르다: ' + stripH(text));
    const pool = [];
    for (const w of d.shuffle(wrongs.slice())) {
      if (!Number.isFinite(w[1]) || close(w[1], check) || stripH(w[0]) === stripH(right[0])) continue;
      if (pool.some((p) => close(p[1], w[1]) || stripH(p[0]) === stripH(w[0]))) continue;
      pool.push(w);
    }
    if (pool.length < 3) return null;
    const opts = d.shuffle(pool.slice(0, Math.min(4, pool.length)).concat([right])), truth = opts.map((r) => close(r[1], check));
    return C(text, opts.map((r) => r[0]), truth.indexOf(true), Object.assign({}, o, { facts: Object.assign({ truth, want: true }, (o && o.facts) || {}) }));
  }
  // 부정적분 고르기: f 는 피적분함수, right = [보기 글, 원시함수], wrongs = [[보기 글, 함수], …], spans = 두 끝값의 차를 견줄 구간들.
  //  보기의 함수 G 가 모든 구간에서 G(b) − G(a) = ∫ₐᵇ f(x)dx(수치 적분)이면 부정적분이다. extra(G) 를 주면 그 조건(함숫값 따위)도 맞아야 한다.
  function chooseF(d, text, f, right, wrongs, spans, o) {
    const extra = (o && o.extra) || (() => true);
    const ok = (G) => spans.every(([a, b]) => close(G(b) - G(a), simpson(f, a, b))) && extra(G);
    if (!ok(right[1])) throw new Error('정답 보기가 부정적분이 아니다: ' + stripH(text));
    const pool = [];
    for (const w of d.shuffle(wrongs.slice())) {
      if (ok(w[1]) || stripH(w[0]) === stripH(right[0]) || pool.some((p) => stripH(p[0]) === stripH(w[0]))) continue;
      pool.push(w);
    }
    if (pool.length < 3) return null;
    const opts = d.shuffle(pool.slice(0, Math.min(4, pool.length)).concat([right])), truth = opts.map((r) => ok(r[1]));
    if (truth.filter(Boolean).length !== 1) return null;
    const more = Object.assign({}, o); delete more.extra;
    return C(text, opts.map((r) => r[0]), truth.indexOf(true), Object.assign(more, { facts: { truth, want: true } }));
  }

  B.kit.u56x = {
    S1, S2, S3, stripH, seal, retry, T, H, q, qadd, qsub, qmul, qdiv, qn, J, iq, nzi, LN, EE, PI, SQ, sec, csc, cot, simpson, close,
    X, Tt, Cc, EV, plusC, CN, ind, dfi, fx, fp, FX, FCX, is, sn, cs, tn, sc, cc, ct, lnAbs, ePow, pi, sumH, pf, sg, num, pos, chooseV, chooseF
  };

  // ════════════════════════════════════════════════════════════════
  // xⁿ(n은 실수)의 적분
  // ════════════════════════════════════════════════════════════════
  const power = [
    T('pow-real', 'xⁿ(n은 음의 정수·분수·무리수)의 부정적분', '①1', (d, n) => {
      if (n === 0) {
        const k = d.int(2, 5), m = d.pick([1, 2, 3, 4, 6]), c = Q(-m, k - 1);
        const F = (x) => qn(c) / x ** (k - 1), f = (x) => m / x ** k;
        const den = (cc, e) => sumH([[cc, e === 1 ? X : X + sup(e), true]]);
        return chooseF(d, `${jh(ind(frac(m, X + sup(k))), '은/는')}? ${CN}`, f, [plusC(den(c, k - 1)), F], [
          [plusC(den(qmul(c, -1), k - 1)), (x) => -F(x)],                                                    // 부호
          [plusC(den(Q(-m, k + 1), k + 1)), (x) => -m / (k + 1) / x ** (k + 1)],                              // 지수를 1 줄임
          [plusC(den(-k * m, k + 1)), (x) => -k * m / x ** (k + 1)],                                          // 미분함
          [plusC(den(Q(-m, k), k)), (x) => -m / k / x ** k]                                                    // 지수를 그대로 둠
        ], [[1, 2], [2, 3]], {
          explain: `${frac(m, X + sup(k))} = ${m === 1 ? '' : m}${X}${sup(MINUS + k)}이므로 지수에 1을 더한 ${jh(MINUS + (k - 1), '으로/로')} 나누면 ${plusC(den(c, k - 1))}이다.` });
      }
      if (n === 1) {
        // x 의 s/r 제곱(근호로 적음), 음수 지수면 분모에
        const r = d.pick([2, 3, 4, 5]), s = r === 2 ? 1 : d.until(() => d.int(1, r - 1), (v) => gcd(v, r) === 1), neg = d.bool();
        const e = neg ? -s / r : s / r, top = neg ? r - s : r + s, ex1 = Q(top, r);
        const root = r === 2 ? rt(X) : rtn(r, s === 1 ? X : ms('x^' + s)), body = neg ? frac(1, root) : root;
        const F = (x) => x ** (e + 1) / (e + 1), f = (x) => x ** e;
        const pwx = (p, qq) => (Q(p, qq).q === 1 ? X + sup(Q(p, qq).p) : pw('x', [Q(p, qq).p, Q(p, qq).q]));
        return chooseF(d, `${jh(ind(body), '은/는')}? ${CN}`, f, [plusC(sumH([[Q(r, top), pwx(top, r)]])), F], [
          [plusC(sumH([[ex1, pwx(top, r)]])), (x) => (top / r) * x ** (e + 1)],
          [plusC(sumH([[Q(neg ? -s : s, r), pwx(neg ? -s - r : s - r, r)]])), (x) => e * x ** (e - 1)],
          [plusC(pwx(top, r)), (x) => x ** (e + 1)],
          [plusC(sumH([[Q(r, top), pwx(neg ? -s : s, r)]])), (x) => (r / top) * x ** e]
        ], [[1, 2], [1, 4]], {
          explain: `${body} = ${pwx(neg ? -s : s, r)}이므로 지수에 1을 더한 ${jh(iq(ex1), '으로/로')} 나누어 ${plusC(sumH([[Q(r, top), pwx(top, r)]]))}이다.` });
      }
      // 지수가 무리수(π 또는 e)
      const al = d.pick([['π', PI], ['e', EE]]), k = d.int(1, 4), a = al[1], A = al[0];
      const xa = (t) => X + sup(ms(t));
      const F = (x) => k * x ** (a + 1) / (a + 1), f = (x) => k * x ** a, K = k === 1 ? '' : k;
      return chooseF(d, `${jh(ind(K + xa(A)), '은/는')}? ${CN}`, f, [plusC(K + frac(xa(A + '+1'), ms(A + ' + 1'))), F], [
        [plusC(K + frac(xa(A + '+1'), ms(A))), (x) => k * x ** (a + 1) / a],
        [plusC(K + ms(A) + xa(A + '-1')), (x) => k * a * x ** (a - 1)],
        [plusC(K + xa(A + '+1')), (x) => k * x ** (a + 1)],
        [plusC(K + frac(xa(A), ms(A + ' + 1'))), (x) => k * x ** a / (a + 1)]
      ], [[1, 2], [1, 3]], {
        explain: `${A === 'π' ? 'π는' : jh(EV, '은/는')} 실수이므로 ${ind(X + sup(V('n')))} = ${frac(1, ms('n + 1'))}${X}${sup(ms('n+1'))} + ${jh(Cc, '을/를')} 그대로 쓴다.` });
    }, { count: 3, standard: S1 }),
    T('pow-recip', '1/x의 부정적분 — ln|x|', '①2', (d) => {
      const k = d.int(2, 9), body = d.bool() ? frac(k, X) : k + X + sup(MINUS + '1');
      return chooseF(d, `${jh(ind(body), '은/는')}? ${CN}`, (x) => k / x, [plusC(k + lnAbs()), (x) => k * LN(Math.abs(x))], [
        [plusC(k + ln('x')), (x) => k * LN(x)],                                       // 절댓값을 뺌(x < 0 에서 정의되지 않음)
        [plusC(sumH([[-k, X + sup(2), true]])), (x) => -k / x ** 2],                 // 미분함
        [plusC(lnAbs(k + X)), (x) => LN(Math.abs(k * x))],                            // ln|kx|
        [plusC(sumH([[Q(-k, 2), X + sup(2), true]])), (x) => -k / 2 / x ** 2]        // xⁿ⁺¹/(n+1)을 지수 −2로
      ], [[1, 3], [-4, -2]], {
        explain: `지수가 ${MINUS}1이면 ${frac(1, ms('n+1'))}${X}${jh(sup(ms('n+1')), '을/를')} 쓸 수 없고 ${is(ind(frac(1, X)), plusC(lnAbs()))}이다. ${X} &lt; 0에서도 정의되도록 절댓값을 붙인다.` });
    }, { standard: S1 }),
    T('pow-split', '나누거나 펼쳐 xⁿ 항의 합으로 만든 뒤 부정적분', '①3', (d, n) => {
      if (n === 0) {
        const a = d.pick([2, 4, 6, -2, 3]), b = nzi(d, -6, 6), c = nzi(d, -7, 7);
        const num3 = MQ.poly([[a, X + sup(3)], [b, X], [c, '']]), body = frac(num3, X + sup(2));
        const F = (x) => a / 2 * x * x + b * LN(Math.abs(x)) - c / x;
        const t = (ca, cb, bh, cc2) => plusC(sumH([[ca, X + sup(2)], [cb, bh]]) + (cc2 ? ' ' + (cc2 > 0 ? '+' : MINUS) + ' ' + frac(Math.abs(cc2), X) : ''));
        return chooseF(d, `${jh(ind(body), '은/는')}? ${CN}`, (x) => (a * x ** 3 + b * x + c) / x ** 2, [t(Q(a, 2), b, lnAbs(), -c), F], [
          [t(Q(a, 2), b, lnAbs(), c), (x) => a / 2 * x * x + b * LN(Math.abs(x)) + c / x],
          [t(Q(a, 2), b, ln('x'), -c), (x) => a / 2 * x * x + b * LN(x) - c / x],
          [t(a, b, lnAbs(), -c), (x) => a * x * x + b * LN(Math.abs(x)) - c / x],
          [plusC(sumH([[Q(a, 2), X + sup(2)], [-b, X + sup(2), true], [-c, X, true]])), (x) => a / 2 * x * x - b / x ** 2 - c / x]
        ], [[1, 2], [-3, -1]], {
          explain: `${body} = ${MQ.poly([[a, X], [b, frac(1, X)]])} ${sg(c)} ${frac(Math.abs(c), X + sup(2))}이므로 항마다 적분하면 ${t(Q(a, 2), b, lnAbs(), -c)}이다.` });
      }
      if (n === 1) {
        // (√x + p)²/x = 1 + 2p/√x + p²/x  (x > 0)
        const p = nzi(d, -4, 4), body = frac(`(${rt(X)} ${sg(p)} ${Math.abs(p)})${sup(2)}`, X);
        const F = (x) => x + 4 * p * SQ(x) + p * p * LN(x);
        const t = (cs1, cl) => plusC(sumH([[1, X], [cs1, rt(X)], [cl, ln('x')]]));
        return chooseF(d, `${ms('x > 0')}일 때, ${jh(ind(body), '은/는')}? ${CN}`, (x) => (SQ(x) + p) ** 2 / x, [t(4 * p, p * p), F], [
          [t(2 * p, p * p), (x) => x + 2 * p * SQ(x) + p * p * LN(x)],
          [plusC(sumH([[1, X], [4 * p, rt(X)], [-p * p, X, true]])), (x) => x + 4 * p * SQ(x) - p * p / x],
          [t(p, p * p), (x) => x + p * SQ(x) + p * p * LN(x)],
          [plusC(sumH([[1, X], [4 * p, rt(X)], [p * p, X]])), (x) => x + 4 * p * SQ(x) + p * p * x]
        ], [[1, 2], [1, 4]], {
          explain: `${body} = 1 ${sg(p)} ${frac(Math.abs(2 * p), rt(X))} + ${frac(p * p, X)}이고 ${is(ind(frac(1, rt(X))), plusC('2' + rt(X)))}이므로 ${t(4 * p, p * p)}이다.` });
      }
      // (x² + px)/√x = x√x + p√x
      const p = nzi(d, -6, 6), body = frac(MQ.poly([[1, X + sup(2)], [p, X]]), rt(X));
      const x2r = X + sup(2) + rt(X), x1r = X + rt(X);
      const F = (x) => 0.4 * x ** 2.5 + 2 * p / 3 * x ** 1.5;
      return chooseF(d, `${jh(ind(body), '은/는')}? ${CN}`, (x) => (x * x + p * x) / SQ(x), [plusC(sumH([[Q(2, 5), x2r], [Q(2 * p, 3), x1r]])), F], [
        [plusC(sumH([[Q(5, 2), x2r], [Q(3 * p, 2), x1r]])), (x) => 2.5 * x ** 2.5 + 1.5 * p * x ** 1.5],
        [plusC(sumH([[Q(2, 3), x2r], [2 * p, x1r]])), (x) => 2 / 3 * x ** 2.5 + 2 * p * x ** 1.5],
        [plusC(sumH([[Q(2, 5), x2r], [2 * p, rt(X)]])), (x) => 0.4 * x ** 2.5 + 2 * p * SQ(x)],
        [plusC(sumH([[Q(3, 2), x1r], [Q(p, 2), frac(1, rt(X))]])), (x) => 1.5 * x ** 1.5 + p / 2 / SQ(x)]
      ], [[1, 2], [1, 4]], {
        explain: `${body} = ${MQ.poly([[1, pw('x', [3, 2])], [p, pw('x', [1, 2])]])}이므로 ${plusC(sumH([[Q(2, 5), pw('x', [5, 2])], [Q(2 * p, 3), pw('x', [3, 2])]]))}이고, 근호로 나타내면 이와 같다.` });
    }, { count: 3, standard: S1 }),
    T('pow-def', 'xⁿ 꼴 함수의 정적분', '①4', (d, n) => {
      if (n === 0) {
        // ∫(1~s²) (x³ + b√x)/x² dx = (s⁴ − 1)/2 + 2b(1 − 1/s)
        const s = d.pick([2, 3]), s2 = s * s, b = nzi(d, -5, 5), v = qadd(Q(s2 * s2 - 1, 2), qmul(2 * b, Q(s - 1, s)));
        const body = frac(`${X}${sup(3)} ${sg(b)} ${Math.abs(b) === 1 ? '' : Math.abs(b)}${rt(X)}`, X + sup(2));
        if (!close(qn(v), simpson((x) => (x ** 3 + b * SQ(x)) / x ** 2, 1, s2))) throw new Error('pow-def 셈');
        return num(`${jh(dfi(1, s2, body), '의/의')} 값은?`, v, {
          explain: `${body} = ${X} ${sg(b)} ${Math.abs(b) === 1 ? '' : Math.abs(b)}${pw('x', [-3, 2])}이므로 [${frac(1, 2)}${X}${sup(2)} ${sg(-b)} ${frac(Math.abs(2 * b), rt(X))}]를 1부터 ${s2}까지 셈하면 ${iq(v)}이다.`,
          facts: { value: `(${s2}**2-1)/2+2*${J(b)}*(1-1/${s})` } });
      }
      if (n === 1) {
        const k = d.int(2, 4), m = d.int(2, 9);
        return num(`${jh(dfi(ms('e'), ms('e^' + k), frac(m, X)), '의/의')} 값은?`, m * (k - 1), {
          explain: `${evlS(m + ' ' + ln('x'), ms('e'), ms('e^' + k))} = ${m} × ${k} ${MINUS} ${m} × 1 = ${m * (k - 1)}이다.`,
          facts: { value: `${m}*(${k}-1)` } });
      }
      // ∫(1~b)(√x + p)²/x dx = (b − 1) + 4p(√b − 1) + p² ln b
      const b = d.pick([2, 3]), p = nzi(d, -3, 3), v = b - 1 + 4 * p * (SQ(b) - 1) + p * p * LN(b);
      const body = frac(`(${rt(X)} ${sg(p)} ${Math.abs(p)})${sup(2)}`, X), opt = (cr, cl, c0) => sumH([[cr, rt(String(b))], [cl, ln(b)], [c0, '']]);
      return chooseV(d, `${jh(dfi(1, b, body), '의/의')} 값은?`, [opt(4 * p, p * p, b - 1 - 4 * p), v], [
        [opt(2 * p, p * p, b - 1 - 2 * p), b - 1 + 2 * p * (SQ(b) - 1) + p * p * LN(b)],
        [opt(4 * p, -p * p, b - 1 - 4 * p), b - 1 + 4 * p * (SQ(b) - 1) - p * p * LN(b)],
        [opt(4 * p, p * p, b), b + 4 * p * SQ(b) + p * p * LN(b)],
        [opt(4 * p, p * p, b - 4 * p), b - 4 * p + 4 * p * SQ(b) + p * p * LN(b)]
      ], simpson((x) => (SQ(x) + p) ** 2 / x, 1, b), {
        explain: `피적분함수는 1 ${sg(p)} ${frac(Math.abs(2 * p), rt(X))} + ${frac(p * p, X)}이므로 [${X} ${sg(p)} ${Math.abs(4 * p)}${rt(X)} + ${p * p === 1 ? '' : p * p}${ln('x')}]를 1부터 ${b}까지 셈한다.` });
    }, { count: 3, standard: S1 })
  ];
  // [F(x)]ₐᵇ (공용 evl 에 HTML 을 그대로 넘긴다)
  function evlS(h, a, b) { return B.kit.hs.evl(h, a, b); }

  // ════════════════════════════════════════════════════════════════
  // 지수함수의 적분
  // ════════════════════════════════════════════════════════════════
  const lnT = (a) => ln(a);
  const expo = [
    T('exp-basic', 'eˣ·aˣ의 부정적분 — 밑과 지수 고쳐 쓰기', '①5', (d, n) => {
      if (n === 0) {
        const a = d.pick([2, 3, 5]), m = d.pick([2, 3]), A = a ** m, L = LN(a);
        const pa = pw(a, m + 'x'), F = (x) => a ** (m * x) / (m * L);
        return chooseF(d, `${jh(ind(pa), '은/는')}? ${CN}`, (x) => a ** (m * x), [plusC(frac(pa, `${m} ${lnT(a)}`)), F], [
          [plusC(frac(pa, lnT(a))), (x) => a ** (m * x) / L],
          [plusC(`${m} × ${pa} ${lnT(a)}`), (x) => m * a ** (m * x) * L],
          [plusC(frac(pw(a, m + 'x + 1'), ms(m + 'x + 1'))), (x) => a ** (m * x + 1) / (m * x + 1)],
          [plusC(frac(pa, m)), (x) => a ** (m * x) / m]
        ], [[0, 1], [-1, 1]], {
          explain: `${is(pa, pw(A, 'x'))}이므로 ${is(ind(pw(A, 'x')), plusC(frac(pw(A, 'x'), lnT(A))))}이고, ${is(lnT(A), m + ' ' + lnT(a))}이므로 ${plusC(frac(pa, `${m} ${lnT(a)}`))}이다.` });
      }
      const p = nzi(d, -3, 3), b = d.pick([2, 3, 5]), L = LN(b), ep = ePow('x' + (p < 0 ? '-' : '+') + Math.abs(p));
      const body = `(${ep} + ${pw(b, '-x')})`, F = (x) => EE ** (x + p) - b ** (-x) / L;
      return chooseF(d, `${jh(ind(body), '은/는')}? ${CN}`, (x) => EE ** (x + p) + b ** (-x), [plusC(`${ep} ${MINUS} ${frac(1, `${pw(b, 'x')} ${lnT(b)}`)}`), F], [
        [plusC(`${ep} + ${frac(1, `${pw(b, 'x')} ${lnT(b)}`)}`), (x) => EE ** (x + p) + b ** (-x) / L],
        [plusC(`${ep} ${MINUS} ${frac(lnT(b), pw(b, 'x'))}`), (x) => EE ** (x + p) - L * b ** (-x)],
        [plusC(`${frac(ePow('x' + (p + 1 < 0 ? '-' : '+') + Math.abs(p + 1)), ms('x' + (p + 1 < 0 ? ' - ' : ' + ') + Math.abs(p + 1)))} ${MINUS} ${frac(1, `${pw(b, 'x')} ${lnT(b)}`)}`), (x) => EE ** (x + p + 1) / (x + p + 1) - b ** (-x) / L],
        [plusC(`${ep} ${MINUS} ${pw(b, '-x')}`), (x) => EE ** (x + p) - b ** (-x)]
      ], [[0, 1], [1, 2]], {
        explain: `${is(pw(b, '-x'), `(${frac(1, b)})${sup('x')}`)}이고 ${is(lnT(frac(1, b)), MINUS + lnT(b))}이므로 ${is(ind(pw(b, '-x')), plusC(MINUS + frac(1, `${pw(b, 'x')} ${lnT(b)}`)))}이다.` });
    }, { count: 2, standard: S1 }),
    T('exp-expand', '제곱을 펼치거나 인수분해로 약분한 뒤 지수함수 부정적분', '①6', (d, n) => {
      if (n === 0) {
        const a = d.pick([2, 3, 5, 7]), c = d.int(1, 3), L = LN(a), pa = pw(a, 'x'), p2 = pw(a, '2x');
        const F = (x) => a ** (2 * x) / (2 * L) + 2 * c * a ** x / L + c * c * x;
        const opt = (k1, k2, last) => plusC(`${frac(p2, (k1 === 1 ? '' : k1 + ' ') + lnT(a))} + ${frac((k2 === '' ? '' : k2 + ' × ') + pa, lnT(a))}${last}`);
        return chooseF(d, `${jh(ind(`(${pa} + ${c})${sup(2)}`), '은/는')}? ${CN}`, (x) => (a ** x + c) ** 2, [opt(2, 2 * c, ` + ${c * c === 1 ? '' : c * c}${X}`), F], [
          [opt(1, 2 * c, ` + ${c * c === 1 ? '' : c * c}${X}`), (x) => a ** (2 * x) / L + 2 * c * a ** x / L + c * c * x],
          [opt(2, c === 1 ? '' : c, ` + ${c * c === 1 ? '' : c * c}${X}`), (x) => a ** (2 * x) / (2 * L) + c * a ** x / L + c * c * x],
          [opt(2, 2 * c, ` + ${c * c}`), (x) => a ** (2 * x) / (2 * L) + 2 * c * a ** x / L + c * c],
          [plusC(frac(`(${pa} + ${c})${sup(3)}`, 3)), (x) => (a ** x + c) ** 3 / 3]
        ], [[0, 1], [-1, 1]], {
          explain: `(${pa} + ${c})${sup(2)} = ${pw(a, '2x')} + ${2 * c} × ${pa} + ${c * c}이고 ${is(pw(a, '2x'), pw(a * a, 'x'))}이므로 항마다 적분하면 ${opt(2, 2 * c, ` + ${c * c === 1 ? '' : c * c}${X}`)}이다.` });
      }
      if (n === 1) {
        const c = d.int(1, 4), ex = ePow('x'), body = frac(`${ePow('2x')} ${MINUS} ${c * c}`, `${ex} + ${c}`), F = (x) => EE ** x - c * x;
        return chooseF(d, `${jh(ind(body), '은/는')}? ${CN}`, (x) => (EE ** (2 * x) - c * c) / (EE ** x + c), [plusC(`${ex} ${MINUS} ${c === 1 ? '' : c}${X}`), F], [
          [plusC(`${ex} + ${c === 1 ? '' : c}${X}`), (x) => EE ** x + c * x],
          [plusC(`${frac(1, 2)}${ePow('2x')} ${MINUS} ${c === 1 ? '' : c}${X}`), (x) => EE ** (2 * x) / 2 - c * x],
          [plusC(`${ex} ${MINUS} ${c}`), (x) => EE ** x - c],
          [plusC(`${ex} ${MINUS} ${c * c}${X}`), (x) => EE ** x - c * c * x]
        ], [[0, 1], [-1, 2]], {
          explain: `${ePow('2x')} ${MINUS} ${c * c} = (${ex} + ${c})(${ex} ${MINUS} ${c})이므로 약분하면 ${ex} ${MINUS} ${c}이고 ${plusC(`${ex} ${MINUS} ${c === 1 ? '' : c}${X}`)}이다.` });
      }
      const a = d.pick([2, 3]), L = LN(a), pa = pw(a, 'x'), body = frac(`${pw(a, '3x')} ${MINUS} 1`, `${pa} ${MINUS} 1`);
      const F = (x) => a ** (2 * x) / (2 * L) + a ** x / L + x;
      const opt = (k1, s2, last) => plusC(`${frac(pw(a, '2x'), (k1 === 1 ? '' : k1 + ' ') + lnT(a))} ${s2} ${frac(pa, lnT(a))}${last}`);
      return chooseF(d, `${jh(ind(body), '은/는')}? ${CN}`, (x) => (a ** (3 * x) - 1) / (a ** x - 1), [opt(2, '+', ` + ${X}`), F], [
        [opt(1, '+', ` + ${X}`), (x) => a ** (2 * x) / L + a ** x / L + x],
        [opt(2, '+', ''), (x) => a ** (2 * x) / (2 * L) + a ** x / L],
        [opt(2, MINUS, ` + ${X}`), (x) => a ** (2 * x) / (2 * L) - a ** x / L + x],
        [opt(2, '+', ` ${MINUS} ${X}`), (x) => a ** (2 * x) / (2 * L) + a ** x / L - x]
      ], [[0.5, 1.5], [1, 2]], {
        explain: `${pw(a, '3x')} ${MINUS} 1 = (${pa} ${MINUS} 1)(${pw(a, '2x')} + ${pa} + 1)이므로 약분하면 ${pw(a, '2x')} + ${pa} + 1이고 항마다 적분하면 ${opt(2, '+', ` + ${X}`)}이다.` });
    }, { count: 3, standard: S1 }),
    T('exp-def', '지수함수의 정적분', '①7', (d, n) => {
      if (n === 0) {
        const k = d.pick([2, 3, 5]), a = d.int(0, 1), b = a + d.int(1, 2), w = k ** b - k ** a, L = LN(k);
        return chooseV(d, `${jh(dfi(a, b, pw(k, 'x')), '의/의')} 값은?`, [frac(w, lnT(k)), w / L], [
          [`${w} ${lnT(k)}`, w * L], [w % 2 ? frac(w, 2 + ' ' + lnT(k)) : frac(w / 2, lnT(k)), w / (2 * L)], [frac(k ** b + k ** a, lnT(k)), (k ** b + k ** a) / L], [iq(Q(w, k)), w / k]
        ], simpson((x) => k ** x, a, b), {
          explain: `${evlS(frac(pw(k, 'x'), lnT(k)), a, b)} = ${frac(`${k ** b} ${MINUS} ${k ** a}`, lnT(k))} = ${frac(w, lnT(k))}이다.` });
      }
      const m = d.int(2, 6), c = d.int(1, 4), ex = ePow('x'), body = frac(`${ePow('2x')} ${MINUS} ${c * c}`, `${ex} + ${c}`);
      const v = m - 1 - c * LN(m), opt = (k0, kl) => sumH([[k0, ''], [kl, ln(m)]]);
      return chooseV(d, `${jh(dfi(0, ln(m), body), '의/의')} 값은?`, [opt(m - 1, -c), v], [
        [opt(m - 1, c), m - 1 + c * LN(m)], [opt(m, -c), m - c * LN(m)], [iq(m - 1 - c), m - 1 - c],
        [opt(Q(m * m - 1, 2), -c), (m * m - 1) / 2 - c * LN(m)]
      ], simpson((x) => (EE ** (2 * x) - c * c) / (EE ** x + c), 0, LN(m)), {
        explain: `약분하면 ${ex} ${MINUS} ${c}이므로 ${evlS(`${ex} ${MINUS} ${c === 1 ? '' : c}${X}`, 0, ln(m))} = (${m} ${MINUS} ${c === 1 ? '' : c}${ln(m)}) ${MINUS} 1이다.` });
    }, { count: 2, standard: S1 })
  ];

  // ════════════════════════════════════════════════════════════════
  // 삼각함수의 적분
  // ════════════════════════════════════════════════════════════════
  const trigo = [
    T('trig-basic', '삼각함수 공식으로 부정적분 구하기', '①8', (d, n) => {
      if (n === 0) {
        const a = nzi(d, -5, 5), b = nzi(d, -5, 5);
        const opt = (p, s1, r, s2) => plusC(sumH([[p, s1], [r, s2]]));
        return chooseF(d, `${jh(ind(`(${sumH([[a, sn()], [b, cs()]])})`), '은/는')}? ${CN}`, (x) => a * Math.sin(x) + b * Math.cos(x), [opt(-a, cs(), b, sn()), (x) => -a * Math.cos(x) + b * Math.sin(x)], [
          [opt(a, cs(), b, sn()), (x) => a * Math.cos(x) + b * Math.sin(x)], [opt(-a, cs(), -b, sn()), (x) => -a * Math.cos(x) - b * Math.sin(x)], [opt(a, cs(), -b, sn()), (x) => a * Math.cos(x) - b * Math.sin(x)]
        ], [[0, 1], [1, 2]], { explain: `${is(ind(sn()), plusC(MINUS + cs()))}, ${is(ind(cs()), plusC(sn()))}이므로 ${opt(-a, cs(), b, sn())}이다.` });
      }
      const a = nzi(d, -5, 5), b = nzi(d, -6, 6), useSec = d.bool();
      const sq = useSec ? sc(null, 2) : cc(null, 2), g = useSec ? (x) => sec(x) ** 2 : (x) => csc(x) ** 2;
      const right = useSec ? [plusC(sumH([[a, sn()], [b, tn()]])), (x) => a * Math.sin(x) + b * Math.tan(x)] : [plusC(sumH([[a, sn()], [-b, ct()]])), (x) => a * Math.sin(x) - b * cot(x)];
      const wr = useSec ? [
        [plusC(sumH([[a, sn()], [-b, tn()]])), (x) => a * Math.sin(x) - b * Math.tan(x)], [plusC(sumH([[-a, sn()], [b, tn()]])), (x) => -a * Math.sin(x) + b * Math.tan(x)],
        [plusC(sumH([[a, sn()], [-b, ct()]])), (x) => a * Math.sin(x) - b * cot(x)], [plusC(sumH([[a, sn()], [b, sc()]])), (x) => a * Math.sin(x) + b * sec(x)]
      ] : [
        [plusC(sumH([[a, sn()], [b, ct()]])), (x) => a * Math.sin(x) + b * cot(x)], [plusC(sumH([[-a, sn()], [-b, ct()]])), (x) => -a * Math.sin(x) - b * cot(x)],
        [plusC(sumH([[a, sn()], [b, tn()]])), (x) => a * Math.sin(x) + b * Math.tan(x)], [plusC(sumH([[a, sn()], [-b, cc()]])), (x) => a * Math.sin(x) - b * csc(x)]
      ];
      return chooseF(d, `${jh(ind(`(${sumH([[a, cs()], [b, sq]])})`), '은/는')}? ${CN}`, (x) => a * Math.cos(x) + b * g(x), right, wr, useSec ? [[0, 1], [-1, 0.5]] : [[0.5, 1], [1, 2.5]], {
        explain: useSec ? `${is(ind(sc(null, 2)), plusC(tn()))}이므로 ${right[0]}이다.` : `${is(ind(cc(null, 2)), plusC(MINUS + ct()))}이므로 ${right[0]}이다.` });
    }, { count: 2, standard: S1 }),
    T('trig-divide', '나누어 sec²·csc²·sec tan·csc cot 꼴로 만든 뒤 부정적분', '①9', (d, n) => {
      const span = [[0.3, 1], [0.5, 1.3]];
      if (n === 0) {
        const a = d.int(2, 5), b = d.int(1, 7), body = frac(`${a}${cs(null, 3)} ${MINUS} ${b}`, cs(null, 2));
        return chooseF(d, `${jh(ind(body), '은/는')}? ${CN}`, (x) => (a * Math.cos(x) ** 3 - b) / Math.cos(x) ** 2, [plusC(sumH([[a, sn()], [-b, tn()]])), (x) => a * Math.sin(x) - b * Math.tan(x)], [
          [plusC(sumH([[a, sn()], [b, tn()]])), (x) => a * Math.sin(x) + b * Math.tan(x)], [plusC(sumH([[a, cs()], [-b, tn()]])), (x) => a * Math.cos(x) - b * Math.tan(x)],
          [plusC(sumH([[a, sn()], [-b, ct()]])), (x) => a * Math.sin(x) - b * cot(x)], [plusC(sumH([[-a, sn()], [-b, tn()]])), (x) => -a * Math.sin(x) - b * Math.tan(x)]
        ], span, { explain: `${body} = ${a}${cs()} ${MINUS} ${b}${sc(null, 2)}이므로 ${plusC(sumH([[a, sn()], [-b, tn()]]))}이다.` });
      }
      const kind = d.int(0, 2);
      if (kind === 0) {
        return chooseF(d, `${jh(ind(`${cc()}(${ct()} + ${cc()})`), '은/는')}? ${CN}`, (x) => csc(x) * (cot(x) + csc(x)), [plusC(`${MINUS}${cc()} ${MINUS} ${ct()}`), (x) => -csc(x) - cot(x)], [
          [plusC(`${cc()} + ${ct()}`), (x) => csc(x) + cot(x)], [plusC(`${MINUS}${cc()} + ${ct()}`), (x) => -csc(x) + cot(x)], [plusC(`${cc()} ${MINUS} ${ct()}`), (x) => csc(x) - cot(x)], [plusC(`${MINUS}${sc()} ${MINUS} ${tn()}`), (x) => -sec(x) - Math.tan(x)]
        ], span, { explain: `${cc()}${ct()} + ${cc(null, 2)}이고 ${is(ind(cc() + ct()), plusC(MINUS + cc()))}, ${is(ind(cc(null, 2)), plusC(MINUS + ct()))}이다.` });
      }
      if (kind === 1) {
        return chooseF(d, `${jh(ind(frac(`${tn()} + ${sc()}`, cs())), '은/는')}? ${CN}`, (x) => (Math.tan(x) + sec(x)) / Math.cos(x), [plusC(`${sc()} + ${tn()}`), (x) => sec(x) + Math.tan(x)], [
          [plusC(`${MINUS}${sc()} ${MINUS} ${tn()}`), (x) => -sec(x) - Math.tan(x)], [plusC(`${sc()} ${MINUS} ${tn()}`), (x) => sec(x) - Math.tan(x)], [plusC(`${tn()} ${MINUS} ${sc()}`), (x) => Math.tan(x) - sec(x)], [plusC(`${MINUS}${cc()} ${MINUS} ${ct()}`), (x) => -csc(x) - cot(x)]
        ], span, { explain: `${sc()}${tn()} + ${sc(null, 2)}이고 ${is(ind(sc() + tn()), plusC(sc()))}, ${is(ind(sc(null, 2)), plusC(tn()))}이다.` });
      }
      const k = d.int(1, 4), K = k === 1 ? '' : k;
      return chooseF(d, `${jh(ind(frac(K + cs(), sn(null, 2))), '은/는')}? ${CN}`, (x) => k * Math.cos(x) / Math.sin(x) ** 2, [plusC(MINUS + K + cc()), (x) => -k * csc(x)], [
        [plusC(K + cc()), (x) => k * csc(x)], [plusC(MINUS + K + ct()), (x) => -k * cot(x)], [plusC(MINUS + K + sc()), (x) => -k * sec(x)], [plusC(K + ct()), (x) => k * cot(x)]
      ], span, { explain: `${frac(cs(), sn(null, 2))} = ${cc()}${ct()}이고 ${is(ind(cc() + ct()), plusC(MINUS + cc()))}이므로 ${plusC(MINUS + K + cc())}이다.` });
    }, { count: 2, standard: S1 }),
    T('trig-identity', '삼각함수 사이의 관계로 바꾼 뒤 부정적분', '①10', (d, n) => {
      const span = [[0.3, 1], [0.5, 1.3]];
      if (n === 0) {
        const kind = d.int(0, 2);
        if (kind === 0) return chooseF(d, `${jh(ind(frac(sn(null, 2), `1 + ${cs()}`)), '은/는')}? ${CN}`, (x) => Math.sin(x) ** 2 / (1 + Math.cos(x)), [plusC(`${X} ${MINUS} ${sn()}`), (x) => x - Math.sin(x)], [
          [plusC(`${X} + ${sn()}`), (x) => x + Math.sin(x)], [plusC(MINUS + sn()), (x) => -Math.sin(x)], [plusC(`${X} + ${cs()}`), (x) => x + Math.cos(x)], [plusC(`${X} ${MINUS} ${cs()}`), (x) => x - Math.cos(x)]
        ], span, { explain: `${is(sn(null, 2), `1 ${MINUS} ${cs(null, 2)}`)} = (1 + ${cs()})(1 ${MINUS} ${cs()})이므로 약분하면 1 ${MINUS} ${cs()}이고 ${plusC(`${X} ${MINUS} ${sn()}`)}이다.` });
        if (kind === 1) return chooseF(d, `${jh(ind(tn(null, 2)), '은/는')}? ${CN}`, (x) => Math.tan(x) ** 2, [plusC(`${tn()} ${MINUS} ${X}`), (x) => Math.tan(x) - x], [
          [plusC(`${tn()} + ${X}`), (x) => Math.tan(x) + x], [plusC(tn()), (x) => Math.tan(x)], [plusC(frac(1, 3) + tn(null, 3)), (x) => Math.tan(x) ** 3 / 3], [plusC(`${sc(null, 2)} ${MINUS} ${X}`), (x) => sec(x) ** 2 - x]
        ], span, { explain: `${is(tn(null, 2), `${sc(null, 2)} ${MINUS} 1`)}이므로 ${plusC(`${tn()} ${MINUS} ${X}`)}이다.` });
        return chooseF(d, `${jh(ind(ct(null, 2)), '은/는')}? ${CN}`, (x) => cot(x) ** 2, [plusC(`${MINUS}${ct()} ${MINUS} ${X}`), (x) => -cot(x) - x], [
          [plusC(`${ct()} ${MINUS} ${X}`), (x) => cot(x) - x], [plusC(`${MINUS}${ct()} + ${X}`), (x) => -cot(x) + x], [plusC(MINUS + ct()), (x) => -cot(x)], [plusC(frac(1, 3) + ct(null, 3)), (x) => cot(x) ** 3 / 3]
        ], span, { explain: `${is(ct(null, 2), `${cc(null, 2)} ${MINUS} 1`)}이고 ${is(ind(cc(null, 2)), plusC(MINUS + ct()))}이므로 ${plusC(`${MINUS}${ct()} ${MINUS} ${X}`)}이다.` });
      }
      if (n === 1) {
        const a = d.int(2, 6), b = d.int(2, 6), body = frac(`${a}${sn(null, 2)} ${MINUS} ${b}${cs(null, 2)}`, `${cs(null, 2)} ${MINUS} ${cs(null, 4)}`);
        const f = (x) => (a * Math.sin(x) ** 2 - b * Math.cos(x) ** 2) / (Math.cos(x) ** 2 - Math.cos(x) ** 4);
        return chooseF(d, `${jh(ind(body), '은/는')}? ${CN}`, f, [plusC(sumH([[a, tn()], [b, ct()]])), (x) => a * Math.tan(x) + b * cot(x)], [
          [plusC(sumH([[a, tn()], [-b, ct()]])), (x) => a * Math.tan(x) - b * cot(x)], [plusC(sumH([[a, ct()], [b, tn()]])), (x) => a * cot(x) + b * Math.tan(x)],
          [plusC(sumH([[-a, tn()], [b, ct()]])), (x) => -a * Math.tan(x) + b * cot(x)], [plusC(sumH([[a, sc()], [b, cc()]])), (x) => a * sec(x) + b * csc(x)]
        ], span, { explain: `분모는 ${cs(null, 2)}(1 ${MINUS} ${cs(null, 2)}) = ${sn(null, 2)}${cs(null, 2)}이므로 ${body} = ${frac(a, cs(null, 2))} ${MINUS} ${frac(b, sn(null, 2))} = ${a}${sc(null, 2)} ${MINUS} ${b}${cc(null, 2)}이고 ${plusC(sumH([[a, tn()], [b, ct()]]))}이다.` });
      }
      // f(x) = ∫cos²x/(1 + sin x)dx = x + cos x + C, f(π/3) = π/3 + (2c + 1)/2 → f(0) = 1 + c
      const c = nzi(d, -4, 5), given = Q(2 * c + 1, 2);
      return num(`함수 ${is(FX, ind(frac(cs(null, 2), `1 + ${sn()}`)))}에 대하여 ${is(fx('f', pi(1, 3)), `${pi(1, 3)} ${given.p < 0 ? MINUS : '+'} ${frac(Math.abs(given.p), 2)}`)}일 때, ${jh(fx('f', 0), '의/의')} 값은?`, 1 + c, {
        explain: `${is(cs(null, 2), `1 ${MINUS} ${sn(null, 2)}`)}이므로 약분하면 1 ${MINUS} ${sn()}이고 ${is(FX, plusC(`${X} + ${cs()}`))}이다. ${fx('f', pi(1, 3))} = ${pi(1, 3)} + ${frac(1, 2)} + ${Cc}에서 ${is(Cc, c)}이므로 ${is(fx('f', 0), 1 + c)}이다.`,
        facts: { value: `${J(given)}-1/2+1` } });
    }, { count: 3, standard: S1 }),
    T('trig-def', '삼각함수의 정적분', '①11', (d, n) => {
      if (n === 0) {
        const a = nzi(d, -6, 6), b = nzi(d, -6, 6);
        if (!close(2 * a, simpson((x) => a * Math.sin(x) - b * Math.cos(x), 0, PI))) throw new Error('trig-def 셈');
        return num(`${jh(dfi(0, 'π', `(${sumH([[a, sn()], [-b, cs()]])})`), '의/의')} 값은?`, 2 * a, {
          explain: `${evlS(sumH([[-a, cs()], [-b, sn()]]), 0, 'π')}이고 ${is(cs('π'), MINUS + '1')}, ${is(sn('π'), 0)}이므로 ${iq(a)} + ${pf(a)} = ${iq(2 * a)}이다.`,
          facts: { value: `2*${J(a)}` } });
      }
      if (n === 1) {
        // ∫(π/6~π/3)(sin x + k csc²x)dx = (√3 − 1)/2 + (2k/3)√3
        const k = d.int(1, 4), r3 = rt('3'), opt = (c3, c0) => sumH([[c3, r3], [c0, '']]);
        const v = (SQ(3) - 1) / 2 + 2 * k * SQ(3) / 3;
        return chooseV(d, `${jh(dfi(pi(1, 6), pi(1, 3), `(${sn()} + ${k === 1 ? '' : k}${cc(null, 2)})`), '의/의')} 값은?`, [opt(Q(3 + 4 * k, 6), Q(-1, 2)), v], [
          [opt(Q(-3 + 4 * k, 6), Q(1, 2)), (1 - SQ(3)) / 2 + 2 * k * SQ(3) / 3],
          [opt(Q(3 - 4 * k, 6), Q(-1, 2)), (SQ(3) - 1) / 2 - 2 * k * SQ(3) / 3],
          [opt(Q(3 + 2 * k, 6), Q(-1, 2)), (SQ(3) - 1) / 2 + k * SQ(3) / 3],
          [opt(Q(3 + 4 * k, 6), Q(1, 2)), (SQ(3) + 1) / 2 + 2 * k * SQ(3) / 3]
        ], simpson((x) => Math.sin(x) + k * csc(x) ** 2, PI / 6, PI / 3), {
          explain: `${jh(evlS(`${MINUS}${cs()} ${MINUS} ${k === 1 ? '' : k}${ct()}`, pi(1, 6), pi(1, 3)), '을/를')} 셈한다. ${is(cs(pi(1, 3)), frac(1, 2))}, ${is(cs(pi(1, 6)), frac(r3, 2))}, ${is(ct(pi(1, 3)), frac(r3, 3))}, ${is(ct(pi(1, 6)), r3)}이다.` });
      }
      // 거꾸로: ∫(0~a) k/(1 − sin²x)dx = v → a
      const k = d.int(1, 4), K = k === 1 ? '' : k, at = d.pick([[1, 6], [1, 4], [1, 3]]), tv = at[1] === 4 ? 1 : at[1] === 3 ? SQ(3) : SQ(3) / 3, v = k * tv;
      const vh = at[1] === 4 ? String(k) : at[1] === 3 ? K + rt('3') : frac(K + rt('3'), 3);
      const cand = [[1, 6], [1, 4], [1, 3], [5, 12], [1, 8]];
      const rows = cand.map(([p, qq]) => [pi(p, qq), PI * p / qq]);
      const right = rows.find((r, i) => cand[i][0] === at[0] && cand[i][1] === at[1]);
      return chooseV(d, `${jh(dfi(0, V('a'), frac(K || '1', `1 ${MINUS} ${sn(null, 2)}`)), '이/가')} ${jh(vh, '일/일')} 때, 상수 ${jh(V('a'), '의/의')} 값은? (단, ${ms('0 < a < ')}${frac('π', 2)})`, right,
        rows.filter((r) => r !== right), (() => { for (const r of rows) if (close(simpson((x) => k / Math.cos(x) ** 2, 0, r[1]), v)) return r[1]; return NaN; })(), {
          explain: `${is(frac(1, `1 ${MINUS} ${sn(null, 2)}`), sc(null, 2))}이므로 ${is(dfi(0, V('a'), K + sc(null, 2)), K + tn('a'))}이다. ${is(tn('a'), at[1] === 4 ? 1 : at[1] === 3 ? rt('3') : frac(rt('3'), 3))}이므로 ${is(V('a'), pi(at[0], at[1]))}이다.` });
    }, { count: 3, standard: S1 })
  ];

  // ════════════════════════════════════════════════════════════════
  // 여러 가지 함수의 정적분(합치기·절댓값·부호)
  // ════════════════════════════════════════════════════════════════
  const defint = [
    T('def-combine', '구간이 같은 두 정적분을 하나로 합쳐 계산', '①12', (d, n) => {
      if (n === 0) {
        const a = d.pick([2, 3, 5]), c = d.int(1, 4), w = 4 * c * (a - 1), L = LN(a), pa = pw(a, 'x');
        return chooseV(d, `${dfi(0, 1, `(${pa} + ${c})${sup(2)}`)} ${MINUS} ${jh(dfi(0, 1, `(${pa} ${MINUS} ${c})${sup(2)}`), '의/의')} 값은?`, [frac(w, lnT(a)), w / L], [
          [`${w} ${lnT(a)}`, w * L], [frac(w / 2, lnT(a)), w / 2 / L], [frac(4 * c * a, lnT(a)), 4 * c * a / L], [iq(Q(w, a)), w / a]
        ], simpson((x) => (a ** x + c) ** 2 - (a ** x - c) ** 2, 0, 1), {
          explain: `두 정적분을 합치면 ${dfi(0, 1, `{(${pa} + ${c})${sup(2)} ${MINUS} (${pa} ${MINUS} ${c})${sup(2)}}`)} = ${dfi(0, 1, `${4 * c} × ${pa}`)} = ${evlS(frac(`${4 * c} × ${pa}`, lnT(a)), 0, 1)} = ${frac(w, lnT(a))}이다.` });
      }
      if (n === 1) {
        const s = d.pick([2, 3]), p = d.int(1, 2), s2 = s * s, v = qadd(qmul(Q(4, 5), s ** 5 - 1), 4 * p * p * (s ** 3 - 1));
        if (!close(qn(v), simpson((x) => (SQ(x) + p) ** 3 + (SQ(x) - p) ** 3, 1, s2))) throw new Error('def-combine 셈');
        return pos(`${dfi(1, s2, `(${rt(X)} + ${p})${sup(3)}`)} + ${jh(dfi(1, s2, `(${rt(X)} ${MINUS} ${p})${sup(3)}`), '의/의')} 값은?`, v, {
          explain: `두 정적분을 합치면 피적분함수는 2(${X}${rt(X)} + ${3 * p * p}${rt(X)})이므로 ${evlS(sumH([[Q(4, 5), X + sup(2) + rt(X)], [4 * p * p, X + rt(X)]]), 1, s2)} = ${iq(v)}이다.`,
          facts: { value: `4/5*(${s}**5-1)+4*${p}**2*(${s}**3-1)` } });
      }
      if (n === 2) {
        const a = d.int(1, 3), v = (2 * a * a + 1) * PI - 4 * a, opt = (cp, c0) => sumH([[cp, 'π'], [c0, '']]);
        return chooseV(d, `${dfi(0, 'π', `(${a} ${MINUS} ${sn()})${sup(2)}`)} + ${jh(dfi(0, 'π', `(${a} ${MINUS} ${cs()})${sup(2)}`), '의/의')} 값은?`, [opt(2 * a * a + 1, -4 * a), v], [
          [opt(2 * a * a + 1, 4 * a), (2 * a * a + 1) * PI + 4 * a], [opt(2 * a * a, -4 * a), 2 * a * a * PI - 4 * a], [opt(2 * a * a + 1, 0), (2 * a * a + 1) * PI], [opt(2 * a * a + 2, -4 * a), (2 * a * a + 2) * PI - 4 * a]
        ], simpson((x) => (a - Math.sin(x)) ** 2 + (a - Math.cos(x)) ** 2, 0, PI), {
          explain: `합치면 피적분함수는 ${2 * a * a} + (${sn(null, 2)} + ${cs(null, 2)}) ${MINUS} ${2 * a}(${sn()} + ${cs()}) = ${2 * a * a + 1} ${MINUS} ${2 * a}${sn()} ${MINUS} ${2 * a}${cs()}이므로 ${opt(2 * a * a + 1, -4 * a)}이다.` });
      }
      const m = d.int(2, 5), v = qadd(m - 2, Q(1, m)), den = `${ePow('x')} + ${ePow('-x')}`;
      if (!close(qn(v), simpson((x) => EE ** (2 * x) / (EE ** x + EE ** -x), 0, LN(m)) + simpson((x) => EE ** (-2 * x) / (EE ** x + EE ** -x), LN(m), 0))) throw new Error('def-combine 셈 4');
      return pos(`${dfi(0, ln(m), frac(ePow('2x'), den))} + ${jh(dfi(ln(m), 0, frac(ePow('-2x'), den)), '의/의')} 값은?`, v, {
        explain: `둘째 정적분의 위끝과 아래끝을 바꾸면 ${MINUS}${dfi(0, ln(m), frac(ePow('-2x'), den))}이므로 합치면 ${dfi(0, ln(m), frac(`${ePow('2x')} ${MINUS} ${ePow('-2x')}`, den))} = ${dfi(0, ln(m), `(${ePow('x')} ${MINUS} ${ePow('-x')})`)} = ${evlS(den, 0, ln(m))} = ${iq(v)}이다.`,
        facts: { value: `${m}+1/${m}-2` } });
    }, { count: 4, standard: S1 }),
    T('def-abs', '절댓값이 든 여러 가지 함수의 정적분', '①13', (d, n) => {
      if (n === 0) {
        const m = d.int(2, 5), v = qadd(m - 2, Q(1, m));
        if (!close(qn(v), simpson((x) => Math.abs(1 / x - 1), 1 / m, 1) + simpson((x) => Math.abs(1 / x - 1), 1, m))) throw new Error('def-abs 셈');
        return pos(`${jh(dfi(frac(1, m), m, `|${frac(1, X)} ${MINUS} 1|`), '의/의')} 값은?`, v, {
          explain: `${frac(1, X)} ${MINUS} 1은 ${is(X, 1)}에서 부호가 바뀐다. ${dfi(frac(1, m), 1, `(${frac(1, X)} ${MINUS} 1)`)} + ${dfi(1, m, `(1 ${MINUS} ${frac(1, X)})`)} = (${ln(m)} ${MINUS} 1 + ${frac(1, m)}) + (${m} ${MINUS} 1 ${MINUS} ${ln(m)}) = ${iq(v)}이다.`,
          facts: { value: `${m}+1/${m}-2` } });
      }
      if (n === 1) {
        const a = d.int(1, 2), b = d.int(1, 2), v = a - 1 + EE ** -a + EE ** b - 1 - b;
        const opt = (eb, ea, c0) => sumH([[eb, b === 1 ? EV : ePow(String(b))], [ea, a === 1 ? frac(1, EV) : frac(1, ePow(String(a)))], [c0, '']]);
        return chooseV(d, `${jh(dfi(-a, b, `|${ePow('x')} ${MINUS} 1|`), '의/의')} 값은?`, [opt(1, 1, a - 2 - b), v], [
          [opt(1, -1, a - 2 - b), EE ** b - EE ** -a + a - 2 - b], [opt(1, 1, a - b), EE ** b + EE ** -a + a - b], [opt(1, 1, -a - b), EE ** b + EE ** -a - a - b], [opt(1, -1, -b + a), EE ** b - EE ** -a + a - b]
        ], simpson((x) => Math.abs(EE ** x - 1), -a, 0) + simpson((x) => Math.abs(EE ** x - 1), 0, b), {
          explain: `${ePow('x')} ${MINUS} 1은 ${is(X, 0)}에서 부호가 바뀐다. ${dfi(-a, 0, `(1 ${MINUS} ${ePow('x')})`)} + ${jh(dfi(0, b, `(${ePow('x')} ${MINUS} 1)`), '을/를')} 셈하면 ${opt(1, 1, a - 2 - b)}이다.` });
      }
      if (n === 2) {
        const k = d.int(2, 4), P = 2 ** k, v = (k - 1) * P + 1 / LN(2);
        return chooseV(d, `${jh(dfi(0, k + 1, `|${pw(2, 'x')} ${MINUS} ${P}|`), '의/의')} 값은?`, [`${(k - 1) * P} + ${frac(1, lnT(2))}`, v], [
          [`${(k - 1) * P} ${MINUS} ${frac(1, lnT(2))}`, (k - 1) * P - 1 / LN(2)], [`${k * P} + ${frac(1, lnT(2))}`, k * P + 1 / LN(2)], [`${(k - 1) * P} + ${lnT(2)}`, (k - 1) * P + LN(2)], [`${(k - 1) * P} + ${frac(2 * P - 1, lnT(2))}`, (k - 1) * P + (2 * P - 1) / LN(2)]
        ], simpson((x) => Math.abs(2 ** x - P), 0, k) + simpson((x) => Math.abs(2 ** x - P), k, k + 1), {
          explain: `${jh(`${pw(2, 'x')} ${MINUS} ${P}`, '은/는')} ${is(X, k)}에서 부호가 바뀐다. ${dfi(0, k, `(${P} ${MINUS} ${pw(2, 'x')})`)} + ${dfi(k, k + 1, `(${pw(2, 'x')} ${MINUS} ${P})`)} = (${k * P} ${MINUS} ${frac(P - 1, lnT(2))}) + (${frac(P, lnT(2))} ${MINUS} ${P})이다.` });
      }
      if (n === 4) {
        // ∫(0~s²)|√x − a|dx = a³/3 + (2/3)(s³ − a³) − a(s² − a²)  (교 145쪽 예제5)
        const a = d.int(1, 2), s = a + d.int(1, 2), top = s * s, v = qadd(qadd(Q(a ** 3, 3), Q(2 * (s ** 3 - a ** 3), 3)), -a * (top - a * a));
        if (!close(qn(v), simpson((u) => Math.abs(u - a) * 2 * u, 0, s))) throw new Error('def-abs 셈 5');            // x = u² 로 매끄럽게 바꾸어 수치 적분
        return pos(`${jh(dfi(0, top, `|${rt(X)} ${MINUS} ${a}|`), '의/의')} 값은?`, v, {
          explain: `${rt(X)} ${MINUS} ${jh(a, '은/는')} ${is(X, a * a)}에서 부호가 바뀐다. ${dfi(0, a * a, `(${a} ${MINUS} ${rt(X)})`)} + ${dfi(a * a, top, `(${rt(X)} ${MINUS} ${a})`)} = ${iq(Q(a ** 3, 3))} + ${iq(qsub(Q(2 * (s ** 3 - a ** 3), 3), a * (top - a * a)))} = ${iq(v)}이다.`,
          facts: { value: `${a}**3/3+2*(${s}**3-${a}**3)/3-${a}*(${top}-${a}**2)` } });
      }
      const k = d.int(1, 3), K = k === 1 ? '' : k, flip = d.bool();
      const body = flip ? `|${K}${sn()} ${MINUS} ${K}${rt('3')}${cs()}|` : `|${K}${rt('3')}${sn()} + ${K}${cs()}|`;
      const f = flip ? (x) => Math.abs(k * Math.sin(x) - k * SQ(3) * Math.cos(x)) : (x) => Math.abs(k * SQ(3) * Math.sin(x) + k * Math.cos(x)), z = flip ? PI / 3 : 5 * PI / 6;
      if (!close(4 * k, simpson(f, 0, z) + simpson(f, z, PI))) throw new Error('def-abs 셈 4');
      return pos(`${jh(dfi(0, 'π', body), '의/의')} 값은?`, 4 * k, {
        explain: `절댓값 안의 식은 ${flip ? `${is(tn(), rt('3'))}, 곧 ${is(X, pi(1, 3))}` : `${is(tn(), MINUS + frac(rt('3'), 3))}, 곧 ${is(X, pi(5, 6))}`}에서 0이 되어 부호가 바뀐다. 두 구간으로 나누어 셈하면 ${2 * k} + ${2 * k} = ${4 * k}이다.`,
        facts: { value: `4*${k}` } });
    }, { count: 5, standard: S1 }),
    T('def-absq', '∫|f(x)|dx와 |∫f(x)dx|의 값', '①14', (d) => {
      const [nm, m] = d.pick([['sin', 2], ['sin', 3], ['cos', 3], ['sin', 5], ['cos', 5]]);
      const f = nm === 'sin' ? Math.sin : Math.cos, top = m * PI / 2, A = m, Bv = Math.round(Math.abs(simpson(f, 0, top)));
      if (!close(A, simpson((x) => Math.abs(f(x)), 0, top, 4000)) || !close(Bv, Math.abs(simpson(f, 0, top)))) throw new Error('def-absq 셈');
      const up = m === 2 ? 'π' : pi(m, 2), g = nm === 'sin' ? sn() : cs();
      return M(`다음 두 값을 각각 구하시오.`, [
        { lead: dfi(0, up, `|${g}|`) + ' =', answer: A },
        { lead: '|' + dfi(0, up, g) + '| =', answer: Bv }
      ], { shown: `${A}, ${Bv}`,
        explain: `${g}의 그래프는 ${frac('π', 2)}마다 ${X}축과 넓이가 1인 부분을 만든다. 절댓값을 붙이면 모두 더해져 ${A}이고, 붙이지 않으면 ${X}축 아래 부분이 빠져 ${dfi(0, up, g)} = ${iq(nm === 'sin' ? 1 - Math.round(Math.cos(top)) : Math.round(Math.sin(top)))}이므로 그 절댓값은 ${Bv}이다.`,
        facts: { calc: [[String(m), 0], [String(Bv), 1]] } });
    }, { standard: S1 }),
    T('def-sign', '정적분 값의 부호 가리기', '①17', (d, n) => {
      const useCos = d.bool(), g = useCos ? Math.cos : Math.sin, gh = useCos ? cs() : sn();
      const card = (k) => [dfi(pi(k, 2), pi(k + 2, 2), gh), simpson(g, k * PI / 2, (k + 2) * PI / 2)];
      const cards = [1, 2, 3, 4].map(card);
      const lnCard = [dfi(1, ms('e'), ln('x')), simpson(LN, 1, EE)];
      const oddCard = [dfi(MINUS + 'π', 'π', `${cs(null, 2)}${sn()}`), simpson((x) => Math.cos(x) ** 2 * Math.sin(x), -PI, PI)];
      const expCard = [dfi(0, 1, `{(${ePow('x')} + 1)${sup(2)} ${MINUS} (${ePow('x')} ${MINUS} 1)${sup(2)}}`), simpson((x) => (EE ** x + 1) ** 2 - (EE ** x - 1) ** 2, 0, 1)];
      const zero = (v) => Math.abs(v) < 1e-9;
      let rows, text, want;
      if (n === 0) {
        const neg = cards.find((c) => c[1] < -1e-9), posc = cards.find((c) => c[1] > 1e-9), zc = d.pick(cards.filter((c) => zero(c[1])));
        rows = [neg, posc, zc, lnCard, d.pick([oddCard, expCard])]; text = '다음 정적분 가운데 그 값이 음수인 것은?'; want = (v) => v < -1e-9;
      } else {
        const z = d.pick([oddCard, d.pick(cards.filter((c) => zero(c[1])))]);
        rows = [z, cards.find((c) => c[1] < -1e-9), cards.find((c) => c[1] > 1e-9), lnCard, expCard]; text = '다음 정적분 가운데 그 값이 0인 것은?'; want = zero;
      }
      const list = d.shuffle(rows), truth = list.map((r) => want(r[1]));
      if (truth.filter(Boolean).length !== 1) return null;
      return C(text, list.map((r) => r[0]), truth.indexOf(true), {
        explain: n === 0 ? `${jh(gh, '은/는')} 길이가 π인 구간에서 ${X}축 아래에 있는 쪽이 더 많으면 음수가 된다. ${list[truth.indexOf(true)][0]}의 값은 ${MINUS}2이다. ${jh(dfi(1, ms('e'), ln('x')), '은/는')} 1, 나머지도 0 이상이다.`
          : `${cs(null, 2)}${jh(sn(), '은/는')} ${X} 대신 ${MINUS}${jh(X, '을/를')} 넣으면 부호만 바뀌는 함수라 ${MINUS}π부터 π까지의 정적분이 0이고, ${jh(gh, '은/는')} 0이 되는 구간을 두 쪽이 같은 넓이로 나눌 때 0이다. 고른 것의 값만 0이다.`,
        facts: { truth, want: true } });
    }, { count: 2, standard: S1 })
  ];

  // ════════════════════════════════════════════════════════════════
  // f′(x)와 조건에서 f(x) 구하기
  // ════════════════════════════════════════════════════════════════
  const find = [
    T('find-value', 'f′과 한 점의 함숫값에서 다른 함숫값·함수 구하기', '①18', (d, n) => {
      if (n === 0) {
        // f′(x) = (√x − a)²/x, f(1) = c → f(b²) = b² − 4ab + 2a² ln b + c − 1 + 4a
        const a = d.int(1, 3), c = nzi(d, -5, 5), b = d.pick([2, 3]), b2 = b * b, base = b2 - 4 * a * b + c - 1 + 4 * a;
        const opt = (kl, k0) => sumH([[k0, ''], [kl, ln(b)]]);
        const fpv = (x) => (SQ(x) - a) ** 2 / x;
        return chooseV(d, `${ms('x > 0')}에서 미분가능한 함수 ${jh(FX, '에/에')} 대하여 ${is(fp('f'), frac(`(${rt(X)} ${MINUS} ${a})${sup(2)}`, X))}이고 ${is(fx('f', 1), c)}일 때, ${jh(fx('f', b2), '의/의')} 값은?`, [opt(2 * a * a, base), base + 2 * a * a * LN(b)], [
          [opt(a * a, base), base + a * a * LN(b)], [opt(2 * a * a, base + 2 * a * b - 2 * a), base + 2 * a * b - 2 * a + 2 * a * a * LN(b)], [opt(2 * a * a, base - c), base - c + 2 * a * a * LN(b)], [opt(-2 * a * a, base), base - 2 * a * a * LN(b)]
        ], c + simpson(fpv, 1, b2), {
          explain: `${is(fp('f'), `1 ${MINUS} ${frac(2 * a, rt(X))} + ${frac(a * a, X)}`)}이므로 ${is(FX, plusC(`${X} ${MINUS} ${4 * a}${rt(X)} + ${a * a === 1 ? '' : a * a}${ln('x')}`))}이고 ${is(fx('f', 1), c)}에서 ${is(Cc, c - 1 + 4 * a)}이다. ${is(ln(b2), '2' + ln(b))}이다.` });
      }
      if (n === 1) {
        const p = d.pick([2, 3, 5]), L = LN(p), pp = pw(p, 'x'), ex = ePow('x');
        const G0 = (x) => p ** x / L + EE ** x;
        return chooseF(d, `함수 ${is(FX, `${pp} + ${ex}`)}의 한 부정적분 ${jh(FCX, '이/가')} ${jh(is(fx('F', 0), frac(1, lnT(p))), '을/를')} 만족시킬 때, ${jh(FCX, '은/는')}?`, (x) => p ** x + EE ** x,
          [`${frac(pp, lnT(p))} + ${ex} ${MINUS} 1`, (x) => G0(x) - 1], [
            [`${frac(pp, lnT(p))} + ${ex}`, G0], [`${pp} ${lnT(p)} + ${ex} ${MINUS} 1`, (x) => p ** x * L + EE ** x - 1], [`${frac(pp, lnT(p))} + ${ex} + 1`, (x) => G0(x) + 1], [`${frac(pp, lnT(p))} + ${ex} ${MINUS} ${frac(1, lnT(p))}`, (x) => G0(x) - 1 / L]
          ], [[0, 1], [-1, 1]], {
            extra: (G) => close(G(0), 1 / L),
            explain: `${is(FCX, plusC(`${frac(pp, lnT(p))} + ${ex}`))}이고 ${is(fx('F', 0), `${frac(1, lnT(p))} + 1 + ${Cc}`)}이므로 ${is(Cc, MINUS + '1')}이다.` });
      }
      if (n === 2) {
        const A = d.pick([40, 60, 80, 100, 120]), k = A / 4, ans = A / 20;
        if (!close(ans, A + simpson((t) => -k * EE ** (-t / 4), 0, 12) + A * (0.05 - EE ** -3))) throw new Error('find-value 셈');
        return pos(`어떤 종을 친 순간 종소리의 크기는 ${A} dB이었다. 종을 치고 ${Tt}초 후의 소리의 크기를 ${fx('f', Tt)} dB이라 하면 ${is(fp('f', Tt), `${MINUS}${k}${ePow(MINUS + frac(Tt, 4))}`)}이다. 종을 치고 12초 후의 소리의 크기는 몇 dB인가? (단, ${jh(is(ePow('-3'), '0.05'), '으로/로')} 계산한다.)`, ans, {
          unit: 'dB',
          explain: `${is(fx('f', Tt), plusC(`${A}${ePow(MINUS + frac(Tt, 4))}`))}이고 ${is(fx('f', 0), A)}에서 ${is(Cc, 0)}이다. ${is(fx('f', 12), `${A}${ePow('-3')}`)} = ${A} × 0.05 = ${ans}이다.`,
          facts: { value: `${A}*0.05` } });
      }
      const k = d.pick([100, 120, 160, 220]), h = k / 2, r2 = rt('2');
      return chooseV(d, `시각 ${Tt}에서의 교류 전압을 ${fx('f', Tt)} V라 할 때, 전압의 변화율이 ${is(fp('f', Tt), `${MINUS}${k}${r2}${sn('t')}`)}이다. ${is(fx('f', frac('π', 2)), 0)}일 때, ${is(Tt, frac('π', 3))}에서의 전압은?`, [`${h}${r2} V`, h * SQ(2)], [
        [`${k}${r2} V`, k * SQ(2)], [`${h}${rt('6')} V`, h * SQ(6)], [`${MINUS}${h}${r2} V`, -h * SQ(2)], [`${h} V`, h]
      ], simpson((t) => -k * SQ(2) * Math.sin(t), PI / 2, PI / 3), {
        explain: `${is(fx('f', Tt), plusC(`${k}${r2}${cs('t')}`))}이고 ${is(cs(frac('π', 2)), 0)}이므로 ${is(Cc, 0)}이다. ${fx('f', frac('π', 3))} = ${k}${r2} × ${frac(1, 2)} = ${h}${r2}이다.` });
    }, { count: 4, standard: S1 }),
    T('find-tangent', '곡선이 직선에 접할 조건으로 적분상수 정하기', '①19', (d, n) => {
      if (n === 0) {
        // f′(x) = k/(cos2x − 1) = −(k/2)csc²x, 직선 y = mx + n 에 x = x0 에서 접하고 f(x0) = y0 → f(π/4)
        const [k, x0] = d.pick([[2, 6], [4, 6], [6, 3], [6, 6], [3, 3]]), y0 = d.int(-2, 2), cs2 = x0 === 6 ? 4 : Q(4, 3), m = qmul(Q(-k, 2), cs2);
        const r3 = rt('3'), ctv = x0 === 6 ? SQ(3) : SQ(3) / 3, v = y0 + k / 2 - (k / 2) * ctv;
        const line = is(V('y'), `${iq(m)}${X} + ${pi(-m.p, x0)}${y0 === 0 ? '' : ' ' + sg(y0) + ' ' + Math.abs(y0)}`);
        const c3 = x0 === 6 ? Q(-k, 2) : Q(-k, 6), opt = (cr, c0) => sumH([[c0, ''], [cr, r3]]);
        const fpv = (x) => k / (Math.cos(2 * x) - 1);
        return chooseV(d, `열린구간 (0, ${frac('π', 2)})에서 정의된 함수 ${jh(FX, '에/에')} 대하여 ${is(fp('f'), frac(k, `${cs('2x')} ${MINUS} 1`))}이고, 곡선 ${jh(is(V('y'), FX), '이/가')} 직선 ${line}에 접할 때, ${jh(fx('f', frac('π', 4)), '의/의')} 값은?`, [opt(c3, Q(2 * y0 + k, 2)), v], [
          [opt(qmul(c3, -1), Q(2 * y0 + k, 2)), y0 + k / 2 + (k / 2) * ctv], [opt(c3, y0), y0 - (k / 2) * ctv], [opt(c3, Q(2 * y0 - k, 2)), y0 - k / 2 - (k / 2) * ctv], [opt(qmul(c3, -1), Q(2 * y0 - k, 2)), y0 - k / 2 + (k / 2) * ctv]
        ], y0 + simpson(fpv, PI / x0, PI / 4), {
          explain: `${cs('2x')} ${MINUS} 1 = ${MINUS}2${sn(null, 2)}이므로 ${is(fp('f'), `${MINUS}${frac(k, 2)}${cc(null, 2)}`)}, ${is(FX, plusC(`${frac(k, 2)}${ct()}`))}이다. 기울기가 ${iq(m)}인 접점은 ${is(cc(null, 2), iq(cs2))}에서 ${is(X, frac('π', x0))}이고 접점의 ${V('y')}좌표는 ${y0}이므로 ${jh(Cc, '을/를')} 정하면 ${jh(fx('f', frac('π', 4)), '은/는')} ${opt(c3, Q(2 * y0 + k, 2))}이다.` });
      }
      // f′(x) = a − b/x, x = 1 에서의 접선의 y절편 c → f(e) = ae − 2b + c
      const a = d.int(2, 6), b = d.until(() => d.int(1, 5), (v) => v !== a), c = nzi(d, -6, 6), v = a * EE - 2 * b + c;
      const opt = (ke, k0) => sumH([[ke, EV], [k0, '']]);
      return chooseV(d, `곡선 ${is(V('y'), FX)} 위의 점 (${X}, ${FX})에서의 접선의 기울기가 ${a} ${MINUS} ${frac(b, X)}이다. 이 곡선의 ${is(X, 1)}인 점에서의 접선의 ${V('y')}절편이 ${jh(iq(c), '일/일')} 때, ${jh(fx('f', EV), '의/의')} 값은? (단, ${ms('x > 0')})`, [opt(a, c - 2 * b), v], [
        [opt(a, c - b), a * EE + c - b], [opt(a, c), a * EE + c], [opt(a, c - 2 * b + a), a * EE + c - 2 * b + a], [opt(a - b, c), (a - b) * EE + c]
      ], c + (a - b) + simpson((x) => a - b / x, 1, EE), {
        explain: `${is(FX, plusC(`${a}${X} ${MINUS} ${b === 1 ? '' : b}${ln('x')}`))}이고 ${X} = 1에서의 접선은 ${is(V('y'), `${a - b === 1 ? '' : a - b === -1 ? MINUS : iq(a - b)}(${X} ${MINUS} 1) + ${a} + ${Cc}`)}이므로 ${V('y')}절편은 ${b} + ${Cc} = ${iq(c)}에서 ${is(Cc, c - b)}이다. 따라서 ${is(fx('f', EV), opt(a, c - 2 * b))}이다.` });
    }, { count: 2, standard: S1 }),
    T('find-max', '적분으로 정의된 함수의 최댓값', '①20', (d, n) => {
      const k = d.int(1, 3), K = k === 1 ? '' : k, plus = n === 1;
      const g = (t) => k * (1 + (plus ? 2 : -2) * Math.cos(t));
      // 수치로 f 의 최댓값(촘촘한 점에서 누적 심프슨)
      let best = -Infinity, acc = 0; const steps = 4000, h = 2 * PI / steps;
      for (let i = 0; i <= steps; i += 1) { if (i > 0) acc += simpson(g, (i - 1) * h, i * h, 2); best = Math.max(best, acc); }
      const opt = (cp, cr) => sumH([[cp, 'π'], [cr, rt('3')]]);
      const right = plus ? [opt(2 * k, 0), 2 * k * PI] : [opt(Q(5 * k, 3), k), k * (5 * PI / 3 + SQ(3))];
      const wr = [[opt(Q(5 * k, 3), k), k * (5 * PI / 3 + SQ(3))], [opt(2 * k, 0), 2 * k * PI], [opt(Q(2 * k, 3), k), k * (2 * PI / 3 + SQ(3))], [opt(Q(k, 3), -k), k * (PI / 3 - SQ(3))], [opt(Q(4 * k, 3), -k), k * (4 * PI / 3 - SQ(3))], [opt(Q(5 * k, 3), -k), k * (5 * PI / 3 - SQ(3))]];
      return chooseV(d, `${ms('0 <= x <= 2')}π에서 정의된 함수 ${is(FX, dfi(0, 'x', `(${k === 1 ? '1' : k} ${plus ? '+' : MINUS} ${2 * k}${cs('t')})`, 't'))}의 최댓값은?`, right, wr, best, {
        explain: plus ? `${is(FX, `${K}${X} + ${2 * k}${sn()}`)}이고 ${is(fp('f'), 0)}인 ${is(X, pi(2, 3))}에서 극댓값 ${jh(opt(Q(2 * k, 3), k), '을/를')} 가지지만, 끝값 ${jh(is(fx('f', '2π'), pi(2 * k, 1)), '이/가')} 더 크므로 최댓값은 ${pi(2 * k, 1)}이다.`
          : `${is(FX, `${K}${X} ${MINUS} ${2 * k}${sn()}`)}이고 ${is(fp('f'), 0)}에서 ${is(cs(), frac(1, 2))}, 곧 ${is(X, pi(1, 3))}(극소), ${is(X, pi(5, 3))}(극대)이다. 극댓값 ${jh(opt(Q(5 * k, 3), k), '이/가')} 끝값 ${is(fx('f', '2π'), pi(2 * k, 1))}보다 크므로 최댓값이다.` });
    }, { count: 2, standard: S1 })
  ];

  B.addUnit({ id: '11-5-6', grade: 11, semester: 5, no: 6, title: '여러 가지 적분법', version: 1, groups: [
    { id: 'power', title: 'xⁿ(n은 실수)의 적분', standard: S1, types: power },
    { id: 'expo', title: '지수함수의 적분', standard: S1, types: expo },
    { id: 'trigo', title: '삼각함수의 적분', standard: S1, types: trigo },
    { id: 'defint', title: '여러 가지 함수의 정적분', standard: S1, types: defint },
    { id: 'find', title: '도함수에서 함수 구하기', standard: S1, types: find },
    { id: 'subst', title: '치환적분법', standard: S2, types: [] },
    { id: 'ratfn', title: 'f′(x)/f(x) 꼴과 유리함수의 적분', standard: S2, types: [] },
    { id: 'subdef', title: '치환적분법을 이용한 정적분', standard: S2, types: [] },
    { id: 'parts', title: '부분적분법', standard: S3, types: [] },
    { id: 'partdef', title: '부분적분법을 이용한 정적분', standard: S3, types: [] },
    { id: 'apply', title: '여러 적분법으로 함수 구하기', standard: S3, types: [] }
  ] });
})(typeof window !== 'undefined' ? window : globalThis);
