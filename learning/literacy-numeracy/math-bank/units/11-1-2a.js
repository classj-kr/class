// 고등학교 대수 Ⅰ-2 지수함수와 로그함수 — 단원 틀·도구와 앞쪽 묶음(지수함수의 뜻과 그래프, 그래프의 이동, 대소 관계와 최대·최소, 지수방정식과 지수부등식).
// 수집해 둔 천재 T셀파 대수(전인태 — 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 29꼴, 기본꼴_2: 40꼴, 심화꼴: 7꼴)을
// 꼴마다 따져서 실었다. 꼴마다 「실음(유형 이름) / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-1-2/싣기_대조표.md 에 있다.
// (로그함수와 두 함수를 함께 쓰는 그래프·실생활 활용은 11-1-2b.js 에, 실력 문항은 11-1-2c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 성취기준: 12대수01-06(지수함수와 로그함수의 뜻), 12대수01-07(그래프와 그 성질), 12대수01-08(지수함수·로그함수의 활용).
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(식·그래프·점·점근선·상황), 묻는 것(밑·이동량·점근선·치역·최댓값과 최솟값·해·고르기),
//    식의 꼴(밑이 1보다 큰가 작은가, 지수에 이차식이 있는가, aˣ = t 로 치환하는가)이 다르면 따로 싣는다. 수만 바꾼 유형은 만들지 않는다.
//  - 교육과정(3373줄)의 「지나치게 복잡한 계산을 포함하는 문제는 다루지 않는다」는 정도를 말하는 줄이라 빼는 까닭으로 쓰지 않았다(사용자 결정).
//    꼬여 있거나 세 단계 넘게 이어 생각해야 하는 꼴은 실력(11-1-2c.js)에 싣는다.
//  - 답: 수는 부호 단추가 붙은 칸(분수는 분자·분모 칸), 부등식의 해는 「x [부등호] [±][ ]」·「[±][ ] [부등호] x [부등호] [±][ ]」 칸, 근호가 든 값은 radAns,
//    로그가 든 값·그래프·관계식·대소는 고르기로 받는다. 한 유형 안에서는 차례·씨앗이 바뀌어도 칸의 모양(정수인가 분수인가)이 같게 수를 고른다.
//    원문의 「2a + b의 값」「p + q의 값」「Mm의 값」처럼 따로 구한 값을 더하거나 곱한 꼴은 값을 칸마다 따로 받는다.
//  - 그림: 고2 공용 도구 plot(B.kit.hs)으로 그린다. 곡선 이름에는 묻는 값을 적지 않는다(y = aˣ 처럼 문제 글의 꼴로 적는다).
//    원문 그림을 쪽 그림으로 볼 수 없는 학습 자료집의 그래프(밑의 대소를 견주는 그래프, 보기 그래프)는 풀이에 남은 밑의 대소·증감에 맞게 새로 그렸다.
//  - 답은 모두 코드가 셈한다. 검사 근거는 문제에 적힌 수로 다시 셈하는 식(facts.calc·value)이고, 글에 없는 수는 seal 이 facts.unseen 에 밝힌다
//    (밑의 거듭제곱으로 바꾸어 나온 지수처럼 글에 보이지 않는 수는 o.derived 로 밝힌 것만 된다). 고르기의 참·거짓은 손으로 적지 않고 함수의 값으로 가린다.
//
// 뺀 것과 까닭(11-1-2b.js, 11-1-2c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 11-1-1(지수와 로그)에 두는 일(코디네이터 결정): ①2(지수함수의 함숫값 셈), ②2(로그함수의 함숫값 셈), ②40(공식에 넣어 두 경우의 비 — 지진·필름·pH).
//  - 겹침(같은 일): 심4(밑을 같게 하는 지수방정식 — ①22 의 한 차례로 실음), 심1(계수가 붙은 지수함수의 이동량 — ①13 의 한 차례로 실음),
//    심2(지수함수의 역함수의 그래프가 지나는 점 — ②27 과 한 유형으로 실음).
//  - 그리기만 묻는 것(작도): 「그래프를 그리시오」만 있는 부분 — 함께 묻는 점근선·치역·정의역, 그래프 고르기로 실었다.
//  - 말로 설명하는 부분: 교과서 공학 도구 활동의 「모양이 어떻게 변하는지 말해 보자」(그래프로 밑의 대소를 견주는 고르기로 실었다).
//  - 9999를 넘는 답: ②35 ¹⁴C 연대(28650년)와 ②39 자동차 수(48384)는 상황을 그대로 두고 반감기·처음 양의 수만 줄여 9999 아래로 실었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, inline } = B.kit;
  const { LAB, MINUS, Q, asQ, tx, js, nb, V, sup, tag, nz, pm, poly, rt, radAns, ineqAns, gcd } = B.kit.mid;
  const { pw, lg, sfrac, rtn, jh, qAns, coordAns, plot } = B.kit.hs;
  const S6 = '12대수01-06', S7 = '12대수01-07', S8 = '12대수01-08';

  // ── 검사 근거 마무리 ──
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 0과 1과 o.derived 로 밝히기로 한 수만 된다.
  function seal(item) {
    if (item.facts && item.facts.calc) item.facts.calc = item.facts.calc.map(([t, i]) => [`(${t})+0`, i]);
    const f = item.facts || {}, derived = new Set((f.derived || []).map(Number).concat([0, 1])), shown = visibleNumbers(item), out = new Set(f.unseen || []);
    const exprs = (f.calc || []).map(([t]) => t).concat(f.value !== undefined ? [f.value] : []);
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
  const retry = (make) => (d, n) => { for (let i = 0; i < 3000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const sourceOf = (ref) => '수집본 ' + (/[①②]/.test(ref) ? (/심/.test(ref) ? '기본·심화' : '기본') : '심화') + ' 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: sourceOf(ref), make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: sourceOf(ref), make: retry(make) }, more || {});

  // ── 글 ──
  const X = V('x'), Y = V('y'), Av = V('a'), Bv = V('b'), Cv = V('c'), Kv = V('k'), Mv = V('m'), Nv = V('n'), Pv = V('p'), Qv = V('q'), Rv = V('r'), Tv = V('t');
  const al = V('α'), be = V('β');
  const REL = { '<': '&lt;', '<=': '≤', '>': '&gt;', '>=': '≥' };
  const FLIP = { '<': '>', '<=': '>=', '>': '<', '>=': '<=' };
  const iq = (v) => tx(asQ(v));                                   // 화면에 적는 수(음수는 −, 분수는 분수 꼴)
  const jn = (v) => js(asQ(v));                                   // 검사 식에 적는 수((-3), (3/4))
  const sTxt = (v) => (v < 0 ? MINUS + Math.abs(v) : String(v));  // 그림 속 글
  const is = (l, r) => nb(`${l} = ${typeof r === 'string' ? r : iq(r)}`);
  const yIs = (r) => is(Y, r);
  const fx = (name) => nb(`${V(name || 'f')}(${X})`);
  const fAt = (a, name) => nb(`${V(name || 'f')}(${typeof a === 'string' ? a : iq(a)})`);
  const pt = (x, y) => nb(`(${typeof x === 'string' ? x : iq(x)}, ${typeof y === 'string' ? y : iq(y)})`);
  const jj = (h, pair) => jh(h, pair);
  const L = (a, b, v) => poly([[a, v || X], [b, '']]);                         // ax + b
  const sgnT = (n) => `${n < 0 ? MINUS : '+'} ${Math.abs(n)}`;                  // 「+ 3」「− 3」
  const plusC = (h, c) => (c === 0 ? h : `${h} ${sgnT(c)}`);                   // h + c
  // 밑의 글: 2, (1/3), (√2)
  const bh = (b) => { if (typeof b === 'string') return b; const q = asQ(b); if (q.q !== 1) return `(${frac(q.p, q.q)})`; return q.p < 0 ? `(${iq(q)})` : String(q.p); };
  const E = (b, e) => pw(bh(b), e);                                             // bᵉ
  const lb = (b) => { const q = asQ(b); return q.q === 1 ? q.p : sfrac(q.p, q.q); };
  const LG = (b, arg) => lg(lb(b), arg);                                         // log_b arg
  const shiftWords = (p, q) => [p ? `${X}축의 방향으로 ${iq(p)}만큼` : '', q ? `${Y}축의 방향으로 ${iq(q)}만큼` : ''].filter(Boolean).join(', ');
  const setY = (cond) => nb(`{${Y} | ${cond}}`), setX = (cond) => nb(`{${X} | ${cond}}`);
  const QN = ['제1사분면', '제2사분면', '제3사분면', '제4사분면'];
  const frx = (q) => { const r = asQ(q); return r.q === 1 ? iq(r) : (r.p < 0 ? MINUS : '') + frac(Math.abs(r.p), r.q); };

  // ── 답 ──
  // 문자의 값 여럿: 「a = [±][ ]  b = [±][ ]」(셋째 원소가 참이면 부호 단추 없이 — 개수·넓이)
  const vals = (text, pairs, o) => M(text, pairs.map(([lead, answer, bare]) => ({ lead: lead + ' =', answer, signed: !bare })), Object.assign({}, o, { shown: pairs.map(([lead, answer]) => is(lead, answer)).join(', ') }));
  // 수 하나(정수는 부호 단추가 붙은 칸, 분수는 분자·분모 칸). 한 유형에서는 늘 같은 꼴이 되게 수를 고른다.
  const num = (text, v, o) => qAns(text, v, Object.assign({ signed: true }, o));
  // 해가 한쪽: 「x [부등호] [±][ ]」 — 근거는 경계 칸(1번)
  const ray = (text, rel, v, o) => ineqAns(text, rel, v, (o && o.name) || X, o);
  // 해가 두 수 사이: 「[±][ ] [부등호] x [부등호] [±][ ]」 — 근거는 0번·3번 칸
  const betw = (text, lo, r1, r2, hi, o) => inline(text, `{0} {1} ${(o && o.name) || X} {2} {3}`,
    [{ answer: lo, signed: true }, { rel: true, answer: r1 }, { rel: true, answer: r2 }, { answer: hi, signed: true }],
    Object.assign({}, o, { shown: nb(`${iq(lo)} ${REL[r1]} ${(o && o.name) || X} ${REL[r2]} ${iq(hi)}`) }));
  // 고르기: 옳은 보기 right 와 틀린 보기들 가운데 글이 다른 것만 남겨 size 개(모자라면 null — 다시 만든다)
  function choose(d, text, right, wrongs, o) {
    const opt = o || {}, want = opt.size || 5, keep = [right];
    for (const w of d.shuffle(wrongs)) if (keep.length < want && keep.every((k) => stripH(k) !== stripH(w))) keep.push(w);
    if (keep.length < want) return null;
    const rows = d.shuffle(keep);
    return C(text, rows, rows.indexOf(right), { figure: opt.figure, explain: opt.explain, facts: Object.assign({ truth: rows.map((r) => r === right), want: true }, opt.facts || {}) });
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
  // 그래프 보기: rows [{ fig, ok }] — 보기마다 ㉠㉡㉢ 이름을 붙인다.
  const figOpt = (t, fig) => `<span style="display:inline-flex;align-items:flex-start;gap:6px"><span style="font-weight:700">${t}</span>${fig}</span>`;
  function figChoice(d, text, rows, o) {
    const list = d.shuffle(rows), at = list.findIndex((r) => r.ok);
    return C(text, list.map((r, i) => figOpt(LAB[i], r.fig)), at, { figure: o.figure, explain: typeof o.explain === 'function' ? o.explain(LAB[at]) : o.explain, facts: Object.assign({ truth: list.map((r) => Boolean(r.ok)), want: true }, o.facts || {}) });
  }
  // 세 수의 대소를 「A &lt; B &lt; C」 꼴 보기 다섯으로(값은 서로 다르다)
  const PERMS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  function orderPick(d, text, names, values, o) {
    if (new Set(values.map((v) => v.toFixed(9))).size !== values.length) return null;
    const right = [0, 1, 2].sort((i, j) => values[i] - values[j]), say = (p) => p.map((i) => names[i]).join(' &lt; ');
    return choose(d, text, say(right), PERMS.map(say), o);
  }

  // ── 그림 ──
  // 세로 배율: 그림의 높이가 hpx 쯤 되게(가로 한 칸은 plot 과 같이 셈한다)
  const fitY = (x, y, hpx, w) => { const ux = Math.min(44, ((w || 270) - 46) / (x[1] - x[0])); return Math.min(1.5, Math.max(0.12, hpx / ((y[1] - y[0]) * ux))); };
  const gfig = (o) => plot(Object.assign({ w: 236 }, o, { ys: fitY(o.x, o.y, o.h || 210, o.w || 236) }));
  // 보기 속 작은 그래프
  const mini = (curves, o) => plot(Object.assign({ x: [-2.2, 2.2], y: [-1.7, 3.3], w: 130, xt: [1], yt: [1], curves }, o || {}));

  // ── 수 ──
  const pick2 = (d, list) => { const a = d.shuffle(list); return [a[0], a[1]]; };
  const BASES = [2, 3, 4, 5, Q(1, 2), Q(1, 3), Q(1, 4), Q(1, 5)];
  const fv = (b) => { const q = asQ(b); return q.p / q.q; };              // 밑의 실수 값

  B.kit.u112 = {
    S6, S7, S8, stripH, seal, retry, T, H, X, Y, Av, Bv, Cv, Kv, Mv, Nv, Pv, Qv, Rv, Tv, al, be, REL, FLIP, iq, jn, sTxt, is, yIs, fx, fAt, pt, jj, L, sgnT, plusC,
    bh, E, lb, LG, shiftWords, setX, setY, QN, frx, vals, num, ray, betw, choose, GA, comboPick, figOpt, figChoice, orderPick, fitY, gfig, mini, pick2, BASES, fv
  };

  // ════════════════════════════════════════════════════════════════
  // 지수함수의 뜻과 그래프
  // ════════════════════════════════════════════════════════════════
  const expg = [
    T('expg-pick', '지수함수인 것 고르기', '①1', (d, n) => {
      if (n === 1) {
        // 교과서 생각 열기: 하루마다 k배가 되는 넓이를 식으로
        const k = d.pick([2, 3, 4]);
        const right = yIs(E(k, X)), wrongs = [yIs(L(1, k)), yIs(X + sup(k)), yIs(E(k, L(1, -1))), yIs(E(k, L(1, 1))), yIs(E(k + 1, X))];
        return choose(d, `어느 연못에서 물풀이 덮은 수면의 넓이를 관찰하였더니 처음에는 1 m²이었고, 하루가 지날 때마다 그 넓이가 ${k}배가 되었다. 관찰을 시작한 지 ${X}일 후 물풀이 덮은 수면의 넓이를 ${Y} m²라 할 때, ${jj(Y, '을/를')} ${X}에 대한 식으로 나타낸 것은?`, right, wrongs.filter((w) => stripH(w) !== stripH(right)), {
          explain: `처음 넓이 1 m²에 하루마다 ${jj(String(k), '을/를')} 곱하므로 ${X}일 후의 넓이는 1 × ${k} × ${k} × … × ${k} = ${E(k, X)}이다. 따라서 ${right}이고, ${jj(Y, '은/는')} ${X}에 대한 지수함수이다.`,
          facts: { rule: 'expg-model' } });
      }
      const yes = [() => yIs(E(`(${rt(2)})`, X)), () => yIs(E(Q(1, 3), X)), () => yIs(E(3, X)), () => yIs(E('(0.5)', X)), () => yIs(E(Q(2, 5), X)), () => yIs(E(`(${rt(3)})`, X))];
      const no = [[() => yIs(X + sup(2)), '이차함수'], [() => yIs(X + sup(3)), '삼차함수'], [() => yIs(E(1, X)), '상수함수 y = 1'], [() => yIs(E(`(${MINUS}2)`, X)), '밑이 음수라 지수함수가 아닌 것'], [() => yIs(`2${X}`), '일차함수']];
      const flags = [0, 1, 2].map(() => d.bool()), list = [], why = [];
      if (!flags.some(Boolean)) flags[d.int(0, 2)] = true;
      const ys = d.shuffle(yes), ns = d.shuffle(no);
      flags.forEach((f, i) => { if (f) { const h = ys.pop()(); list.push(h); why.push(`${GA[i]}은 밑이 1이 아닌 양수인 지수함수이다`); } else { const [mk, w] = ns.pop(); list.push(mk()); why.push(`${GA[i]}은 ${w.replace('y = 1', yIs(1))}이다`); } });
      return comboPick(d, '다음 중 지수함수인 것만을 있는 대로 고른 것은?', list, flags, `지수함수는 ${yIs(E(Av, X))}(${Av} &gt; 0, ${Av} ≠ 1) 꼴이다. ${why.join('. ')}.`, { standard: S6 });
    }, { count: 2, standard: S6 }),
    T('expg-claims', '지수함수의 성질 참·거짓', '①3', (d) => {
      const b = d.pick(BASES), v = fv(b), up = v > 1;
      const pool = [
        ['정의역은 실수 전체의 집합이다.', true],
        [`치역은 ${setY(`${Y} &gt; 0`)}이다.`, true],
        ['치역은 실수 전체의 집합이다.', false],
        [`그래프는 점 ${jj(pt(0, 1), '을/를')} 지난다.`, true],
        [`그래프는 점 ${jj(pt(1, 0), '을/를')} 지난다.`, false],
        [`그래프는 점 ${jj(pt(1, b), '을/를')} 지난다.`, true],
        [`그래프는 점 ${jj(pt(-1, b), '을/를')} 지난다.`, false],
        [`그래프의 점근선은 ${X}축이다.`, true],
        [`그래프의 점근선은 ${Y}축이다.`, false],
        [`${X}의 값이 증가하면 ${Y}의 값도 증가한다.`, up],
        [`${X}의 값이 증가하면 ${Y}의 값은 감소한다.`, !up]
      ];
      const three = d.shuffle(pool).slice(0, 3), flags = three.map((r) => r[1]);
      if (!flags.some(Boolean)) return null;
      return comboPick(d, `지수함수 ${yIs(E(b, X))}에 대한 설명으로 옳은 것만을 있는 대로 고른 것은?`, three.map((r) => r[0]), flags,
        `${yIs(E(b, X))}의 정의역은 실수 전체, 치역은 양의 실수 전체이고, 그래프는 점 ${jj(pt(0, 1), '을/를')} 지나며 ${X}축을 점근선으로 갖는다. 밑이 1보다 ${up ? '크므로 증가' : '작으므로 감소'}한다.`, { standard: S7 });
    }),
    T('expg-quadrant', '지수함수의 그래프가 지나지 않는 사분면', '①4', (d) => {
      const b = d.pick(BASES), right = '제3사분면, 제4사분면';
      return choose(d, `지수함수 ${yIs(E(b, X))}의 그래프가 지나지 않는 사분면을 모두 고른 것은?`, right, ['제1사분면, 제2사분면', '제2사분면, 제3사분면', '제1사분면, 제4사분면', '제2사분면, 제4사분면', '제1사분면, 제3사분면'], {
        explain: `${E(b, X)}의 값은 늘 양수이므로 그래프는 ${X}축의 위쪽에만 있다. ${X} &gt; 0인 부분은 제1사분면, ${X} &lt; 0인 부분은 제2사분면을 지나므로 지나지 않는 사분면은 ${right}이다.`,
        facts: { rule: 'expg-quadrant' } });
    }),
    T('expg-base', '그래프 위의 점으로 밑·좌표 구하기', '①5', (d, n) => {
      if (n === 0) {
        const b = d.pick(BASES), v = fv(b), m = v > 1 ? d.pick([2, 3]) : d.pick([-1, -2]), y0 = v ** m;
        if (y0 > 30 || !Number.isInteger(Math.round(y0 * 1e9) / 1e9)) return null;
        const yv = Math.round(y0), xr = [-3, 3.5], yr = [-0.6, yv + 1.6];
        const figure = gfig({ x: xr, y: yr, h: 200, curves: [{ f: (x) => v ** x, name: 'y=a^x' }], dots: [{ x: m, y: yv, guide: true, xl: sTxt(m), yl: String(yv) }], yt: [1] });
        const q = asQ(b), right = iq(q), wrongs = [iq(Q(q.q, q.p)), String(yv), iq(Q(q.p * q.p, q.q * q.q)), iq(Q(2 * q.p, q.q)), iq(Q(q.p, 2 * q.q))].filter((w) => w !== right);
        return choose(d, `그림은 지수함수 ${yIs(E(Av, X))}(${Av} &gt; 0, ${Av} ≠ 1)의 그래프이다. 실수 ${Av}의 값은?`, right, wrongs, {
          figure, explain: `그래프가 점 ${jj(pt(m, yv), '을/를')} 지나므로 ${is(E(Av, m), yv)}이다. ${Av} &gt; 0이므로 ${is(Av, q)}이다.`, facts: { rule: 'expg-base-fig' } });
      }
      if (n === 1) {
        const k = d.pick([2, 3, 4, 5]), m = d.pick([2, 3]);
        if (k ** m > 125) return null;
        return num(`함수 ${is(fx(), E(Av, X))}(${Av} &gt; 0, ${Av} ≠ 1)에 대하여 ${is(fAt(-1), k)}일 때, ${fAt(m)}의 값은?`, Q(1, k ** m), {
          explain: `${is(fAt(-1), E(Av, -1))} = ${frac(1, Av)} = ${k}이므로 ${is(Av, Q(1, k))}이다. 따라서 ${is(fAt(m), E(Q(1, k), m))} = ${frac(1, k ** m)}이다.`,
          facts: { value: `1/(${k}**${m})` } });
      }
      // 최소 성취수준: 그래프 위 두 점의 빈 좌표
      const b = d.pick([2, 3]), p = b === 2 ? d.pick([4, 5]) : d.pick([3, 4]), r = d.pick([1, 2]), yp = b ** p;
      const xr = [-r - 1, p + 0.8], yr = [-0.4 * yp / 8, yp * 1.08];
      const figure = gfig({ x: xr, y: yr, h: 220, curves: [{ f: (x) => b ** x, name: 'y=' + b + '^x' }], dots: [{ x: p, y: yp, guide: true, xl: 'p', yl: String(yp) }, { x: -r, y: b ** -r, guide: true, xl: sTxt(-r), yl: 'q' }] });
      return inline(`그림과 같이 함수 ${yIs(E(b, X))}의 그래프가 두 점 ${pt(Pv, yp)}, ${jj(pt(-r, Qv), '을/를')} 지날 때, 실수 ${Pv}, ${Qv}의 값을 구하시오.`, `${Pv} = {0}, ${Qv} = ${frac('{1}', '{2}')}`,
        [{ answer: p, signed: true }, { answer: 1 }, { answer: b ** r }], {
          figure, shown: `${is(Pv, p)}, ${is(Qv, Q(1, b ** r))}`,
          explain: `${is(E(b, Pv), yp)} = ${E(b, p)}에서 ${is(Pv, p)}이고, ${is(Qv, E(b, -r))} = ${frac(1, b ** r)}이다.`,
          facts: { calc: [[`${p}`, 0], ['1', 1], [`${b}**${r}`, 2]], derived: [p] } });
    }, { count: 3 }),
    T('expg-product', '그래프 위 점들의 함숫값으로 x좌표 사이의 관계', '①6', (d, n) => {
      if (n === 0) {
        const kind = d.pick(['mul', 'div', 'sq']), [u, v] = pick2(d, [2, 3, 5]);
        const ys = kind === 'mul' ? [u, v, u * v] : kind === 'div' ? [u * v, v, u] : [u, v, u * u * v];
        const rtxt = { mul: `${Pv} + ${Qv}`, div: `${Pv} ${MINUS} ${Qv}`, sq: `2${Pv} + ${Qv}` }[kind];
        const all = [`${Pv} + ${Qv}`, `${Pv} ${MINUS} ${Qv}`, `2${Pv} + ${Qv}`, `${Pv}${Qv}`, `${Qv} ${MINUS} ${Pv}`, `${Pv} + 2${Qv}`].map((t) => is(Rv, t));
        const why = { mul: `${ys[0]} × ${ys[1]} = ${ys[2]}이므로 ${E(Av, Pv)} × ${E(Av, Qv)} = ${E(Av, Rv)}, ${is(E(Av, `${Pv} + ${Qv}`), E(Av, Rv))}`, div: `${ys[0]} ÷ ${ys[1]} = ${ys[2]}이므로 ${E(Av, Pv)} ÷ ${E(Av, Qv)} = ${E(Av, Rv)}, ${is(E(Av, `${Pv} − ${Qv}`), E(Av, Rv))}`, sq: `${ys[0]}² × ${ys[1]} = ${ys[2]}이므로 (${E(Av, Pv)})² × ${E(Av, Qv)} = ${E(Av, Rv)}, ${is(E(Av, `2${Pv} + ${Qv}`), E(Av, Rv))}` }[kind];
        return choose(d, `함수 ${yIs(E(Av, X))}(${Av} &gt; 1)의 그래프가 세 점 ${pt(Pv, ys[0])}, ${pt(Qv, ys[1])}, ${jj(pt(Rv, ys[2]), '을/를')} 지날 때, ${jj(Rv, '을/를')} ${Pv}, ${jj(Qv, '으로/로')} 나타낸 것은?`, is(Rv, rtxt), all, {
          explain: `${is(E(Av, Pv), ys[0])}, ${is(E(Av, Qv), ys[1])}, ${is(E(Av, Rv), ys[2])}이다. ${why}이다. 따라서 ${is(Rv, rtxt)}이다.`, facts: { rule: 'expg-product-' + kind } });
      }
      if (n === 1) {
        const [s, t] = d.pick([[2, 3], [3, 5], [2, 5], [2, 7], [3, 7], [5, 7], [5, 6], [2, 11]]);
        return radAns(`지수함수 ${is(fx(), E(Av, X))}(${Av} &gt; 1)에 대하여 ${is(fAt(Bv), s)}, ${is(fAt(Cv), t)}일 때, ${fAt(frac(`${Bv} + ${Cv}`, 2))}의 값은?`, 1, s * t, {
          explain: `${is(E(Av, Bv), s)}, ${is(E(Av, Cv), t)}이므로 ${is(fAt(frac(`${Bv} + ${Cv}`, 2)), pw(`(${E(Av, Bv)}${E(Av, Cv)})`, [1, 2]))} = ${rt(s * t)}이다.`,
          facts: { calc: [[`${s}*${t}`, 0]] } });
      }
      const m1 = d.int(1, 3), m2 = d.int(m1 + 1, 6), i = d.int(1, 3), j = d.int(1, 3), k = i * m2 - j * m1;
      if (k === 0 || Math.abs(k) > 14 || (i === j)) return null;
      const top = Qv + (i > 1 ? sup(i) : ''), bot = Pv + (j > 1 ? sup(j) : '');
      return num(`지수함수 ${is(fx(), E(Av, X))}(${Av} &gt; 1)에 대하여 ${is(fAt(m1), Pv)}, ${is(fAt(m2), Qv)}일 때, ${jj(is(fAt(Kv), frac(top, bot)), '을/를')} 만족시키는 실수 ${Kv}의 값은?`, k, {
        explain: `${is(Pv, E(Av, m1))}, ${is(Qv, E(Av, m2))}이므로 ${frac(top, bot)} = ${frac(E(Av, i * m2), E(Av, j * m1))} = ${E(Av, k)}이다. 따라서 ${is(Kv, k)}이다.`,
        facts: { calc: [[`${i}*${m2}-${j}*${m1}`, 0]], derived: [i, j] } });
    }, { count: 3 }),
    T('expg-order', '밑의 크기와 그래프의 모양', '①7', (d) => {
      const bases = d.shuffle([Q(1, 4), Q(1, 2), Q(1, 3), 2, 3, 4]).slice(0, 3), vs = bases.map(fv);
      if (!vs.some((v) => v < 1) && d.bool()) return null;
      const nm = ['a', 'b', 'c'], curves = vs.map((v, i) => ({ f: (x) => v ** x, name: `y=${nm[i]}^x`, at: v > 1 ? Math.log(3.6) / Math.log(v) : Math.log(3.6) / Math.log(v) }));
      const figure = gfig({ x: [-2.4, 2.4], y: [-0.5, 4.2], h: 200, curves, xt: [-1, 1], yt: [1] });
      return orderPick(d, `그림은 세 지수함수 ${yIs(E(Av, X))}, ${yIs(E(Bv, X))}, ${yIs(E(Cv, X))}의 그래프이다. 세 수 ${Av}, ${Bv}, ${Cv}의 대소 관계로 옳은 것은?`, [Av, Bv, Cv], vs, {
        figure, explain: `직선 ${is(X, 1)}과 만나는 점의 ${Y}좌표가 밑이다. 증가하는 그래프는 밑이 1보다 크고, 감소하는 그래프는 밑이 1보다 작다. ${X} &gt; 0에서 더 가파르게 올라가는 그래프일수록 밑이 크다.`, facts: { rule: 'expg-order' } });
    }),
    T('expg-graph-pick', '지수함수의 그래프 고르기', '①8', (d) => {
      const b = d.pick([2, 3, 4, Q(1, 2), Q(1, 3), Q(1, 4)]), v = fv(b), up = v > 1;
      const rows = [
        { fig: mini([{ f: (x) => v ** x }]), ok: true },
        { fig: mini([{ f: (x) => (1 / v) ** x }]) },
        { fig: mini([{ f: (x) => v ** x - 1 }]) },
        { fig: mini([{ f: (x) => Math.log(x) / Math.log(v), from: 0.01 }]) },
        { fig: mini([{ f: (x) => v ** x + 1 }]) }
      ];
      return figChoice(d, `함수 ${yIs(E(b, X))}의 그래프로 알맞은 것은?`, rows, {
        explain: (t) => `${yIs(E(b, X))}의 그래프는 점 ${jj(pt(0, 1), '을/를')} 지나고 ${X}축을 점근선으로 가지며, 밑이 1보다 ${up ? '크므로 오른쪽 위로 올라간다' : '작으므로 오른쪽 아래로 내려간다'}. 따라서 알맞은 것은 ${t}이다.`,
        facts: { rule: 'expg-graph-pick' } });
    }),
    T('expg-line-comp', '일차함수 그래프로 정한 지수함수의 개형', '①9', (d) => {
      const s = pm(d), t = d.int(-2, 2), k = t + d.pick([-1, 1]);            // f(x) = sx + t, y = 2^(k − f(x)) = 2^(−s x + (k − t))
      const c = k - t, xint = -t / s, line = gfig({ x: [-3.4, 3.4], y: [-3.4, 3.4], h: 180, w: 200, grid: true, xt: [-2, 2], yt: [-2, 2], lines: [{ a: s, b: t, name: 'y=f(x)' }], say: t === 0 ? `직선 y = f(x)는 점 (0, 0)과 점 (1, ${sTxt(s)})을 지난다.` : `직선 y = f(x)는 점 (0, ${sTxt(t)})${B.kit.josa(Math.abs(t), '과/와').slice(String(Math.abs(t)).length)} 점 (${sTxt(xint)}, 0)을 지난다.` });
      const g = (a, e) => (x) => 2 ** (a * x + e);
      const opts = [[-s, c], [s, c], [-s, -c], [s, -c], [-s, 0]];
      const rows = opts.map(([a, e], i) => ({ fig: mini([{ f: g(a, e) }], { yt: [1, 2] }), ok: i === 0 }));
      return figChoice(d, `그림은 일차함수 ${is(Y, fx())}의 그래프이다. 함수 ${yIs(E(2, `${k === 0 ? MINUS : sTxt(k) + ' ' + MINUS} ${fx()}`))}의 그래프의 개형으로 알맞은 것은?`, rows, {
        figure: line,
        explain: (tg) => `그래프에서 ${is(fx(), L(s, t))}이므로 ${k === 0 ? MINUS : sTxt(k) + ' ' + MINUS} ${fx()} = ${L(-s, c)}이고, ${yIs(E(2, L(-s, c)))}이다. 이 그래프는 점 ${jj(pt(0, Q(2 ** c * 2, 2)), '을/를')} 지나고 ${-s > 0 ? '증가' : '감소'}하므로 알맞은 것은 ${tg}이다.`,
        facts: { rule: 'expg-line-comp' } });
    })
  ];

  // ════════════════════════════════════════════════════════════════
  // 지수함수의 그래프의 평행이동과 대칭이동
  // ════════════════════════════════════════════════════════════════
  const exps = [
    T('exps-blank', '지수함수 그래프의 이동량·대칭축', '①10', (d, n) => {
      if (n === 0) {
        const b = d.pick([2, 3, 5, Q(1, 2), Q(1, 3)]), p = nz(d, -4, 4), q = nz(d, -5, 5);
        return vals(`함수 ${yIs(plusC(E(b, L(1, -p)), q))}의 그래프는 함수 ${yIs(E(b, X))}의 그래프를 ${X}축의 방향으로 ${Mv}만큼, ${Y}축의 방향으로 ${Nv}만큼 평행이동한 것이다. 상수 ${Mv}, ${Nv}의 값을 구하시오.`, [[Mv, p], [Nv, q]], {
          explain: `${jj(X, '을/를')} ${jj(`${X} ${MINUS} ${Mv}`, '으로/로')}, ${jj(Y, '을/를')} ${jj(`${Y} ${MINUS} ${Nv}`, '으로/로')} 바꾸면 ${yIs(plusC(E(b, `${X} − ${Mv}`), 0))} + ${Nv}이다. 비교하면 ${is(Mv, p)}, ${is(Nv, q)}이다.`,
          facts: { calc: [[jn(p), 0], [jn(q), 1]], rule: 'exps-blank-shift' } });
      }
      const b = d.pick([2, 3, 4, 5]), kind = d.pick(['y', 'x', 'o', 'l']);
      const target = { y: yIs(E(Q(1, b), X)), x: yIs(MINUS + E(b, X)), o: yIs(MINUS + E(Q(1, b), X)), l: yIs(LG(b, X)) }[kind];
      const name = { y: `${Y}축`, x: `${X}축`, o: '원점', l: `직선 ${yIs(X)}` };
      const why = { y: `${E(Q(1, b), X)} = ${E(b, MINUS + X)}이므로 ${jj(X, '을/를')} ${MINUS}${jj(X, '으로/로')} 바꾼 것이다`, x: `${jj(Y, '을/를')} ${MINUS}${jj(Y, '으로/로')} 바꾼 것이다`, o: `${MINUS}${E(Q(1, b), X)} = ${MINUS}${E(b, MINUS + X)}이므로 ${X}, ${Y}의 부호를 모두 바꾼 것이다`, l: `로그함수 ${yIs(LG(b, X))}는 ${yIs(E(b, X))}의 역함수이다` }[kind];
      return choose(d, `함수 ${target}의 그래프는 함수 ${yIs(E(b, X))}의 그래프를 어떻게 대칭이동한 것인가?`, `${name[kind]}에 대하여 대칭이동`, ['y', 'x', 'o', 'l'].map((k) => `${name[k]}에 대하여 대칭이동`), {
        size: 4, explain: `${why}. 따라서 ${name[kind]}에 대하여 대칭이동한 것이다.`, facts: { rule: 'exps-blank-sym' } });
    }, { count: 2 }),
    T('exps-asym', '평행이동한 지수함수의 점근선·치역', '①11', (d, n) => {
      const b = d.pick([2, 3, Q(1, 2), Q(1, 3), Q(2, 3)]), p = d.int(-4, 4), q = nz(d, -5, 5), f = yIs(plusC(E(b, L(1, -p)), q));
      const why = `${f}의 그래프는 ${yIs(E(b, X))}의 그래프를 ${shiftWords(p, q)} 평행이동한 것이다.`;
      if (n === 0) return inline(`함수 ${f}의 그래프의 점근선의 방정식을 구하시오.`, `${Y} = {0}`, [{ answer: q, signed: true }], {
        shown: yIs(q), explain: `${why} ${yIs(E(b, X))}의 점근선이 ${X}축(${yIs(0)})이므로 점근선은 직선 ${yIs(q)}이다.`, facts: { calc: [[jn(q), 0]], rule: 'exps-asym' } });
      return inline(`함수 ${f}의 치역을 구하시오.`, `{${Y} | ${Y} &gt; {0}}`, [{ answer: q, signed: true }], {
        shown: setY(`${Y} &gt; ${iq(q)}`), explain: `${why} ${E(b, L(1, -p))}의 값은 늘 양수이므로 ${Y} &gt; ${iq(q)}이다.`, facts: { calc: [[jn(q), 0]], rule: 'exps-range' } });
    }, { count: 2 }),
    T('exps-const', '지나는 점·점근선으로 지수함수의 상수', '①12', (d, n) => {
      if (n === 0) {
        const b = d.pick([2, 3, 4]), a = nz(d, -3, 4), y0 = 1 + a;
        if (y0 === 0) return null;
        const figure = gfig({ x: [-2.6, 2.6], y: [Math.min(-1.2, a - 1), Math.max(3, y0 + 1.5)], h: 200, curves: [{ f: (x) => b ** -x + a, name: `y=(1/${b})^x+a` }], dots: [{ x: 0, y: y0, yl: sTxt(y0), name: '' }] });
        return inline(`그림은 함수 ${yIs(E(Q(1, b), X))}의 그래프를 ${Y}축의 방향으로 ${Av}만큼 평행이동한 그래프이다. 이 그래프가 점 ${jj(pt(0, y0), '을/를')} 지날 때, 그래프의 점근선의 방정식을 구하시오.`, `${Y} = {0}`, [{ answer: a, signed: true }], {
          figure, shown: yIs(a), explain: `평행이동한 그래프의 식은 ${yIs(plusC(E(Q(1, b), X), 0) + ` + ${Av}`)}이다. 점 ${jj(pt(0, y0), '을/를')} 넣으면 ${is(`1 + ${Av}`, y0)}, ${is(Av, a)}이므로 점근선은 직선 ${yIs(a)}이다.`,
          facts: { calc: [[`${jn(y0)}-1`, 0]] } });
      }
      if (n === 1) {
        const b = d.pick([2, 3]), e = d.int(0, 2), c = -(b ** e), x0 = d.int(-2, 3), a = x0 - e;
        if (a === 0 || x0 === 0) return null;
        const figure = gfig({ x: [Math.min(-3, x0 - 2), Math.max(3, x0 + 1.5)], y: [c - 1.2, 4], h: 200, curves: [{ f: (x) => b ** (x - a) + c, name: `y=${b}^{x-a}+b` }], lines: [{ y: c, dash: true }], dots: [{ x: x0, y: 0, xl: sTxt(x0) }], yt: [c] });
        return vals(`그림과 같이 함수 ${yIs(`${E(b, `${X} ${MINUS} ${Av}`)} + ${Bv}`)}의 그래프가 점 ${jj(pt(x0, 0), '을/를')} 지나고, 점근선이 직선 ${yIs(c)}이다. 상수 ${Av}, ${Bv}의 값을 구하시오.`, [[Av, a], [Bv, c]], {
          figure, explain: `점근선이 ${yIs(c)}이므로 ${is(Bv, c)}이다. 점 ${jj(pt(x0, 0), '을/를')} 넣으면 ${is(E(b, `${iq(x0)} − ${Av}`), -c)} = ${E(b, e)}이므로 ${is(`${iq(x0)} ${MINUS} ${Av}`, e)}, ${is(Av, a)}이다.`,
          facts: { calc: [[`${jn(x0)}-${e}`, 0], [`0-${-c}`, 1]], derived: [e, -c] } });
      }
      if (n === 2) {
        const b = d.pick([2, 3]), e = d.int(1, 3), c = -(b ** e);
        if (b ** e > 27) return null;
        return num(`함수 ${yIs(`${E(b, `${X} ${MINUS} ${Av}`)} ${sgnT(c)}`)}의 그래프가 원점을 지날 때, 실수 ${Av}의 값은?`, -e, {
          explain: `원점을 지나므로 ${is(`0`, `${E(b, `${MINUS}${Av}`)} ${sgnT(c)}`)}, ${is(E(b, `${MINUS}${Av}`), -c)} = ${E(b, e)}이다. ${is(`${MINUS}${Av}`, e)}에서 ${is(Av, -e)}이다.`,
          facts: { calc: [[`0-${e}`, 0]], derived: [e] } });
      }
      const b = d.pick([2, 3]), k = d.int(2, b === 2 ? 4 : 3), m = d.int(1, k - 1);
      return num(`함수 ${is(fx(), E(Q(1, b), `${X} ${MINUS} ${Kv}`))}에 대하여 ${is(fAt(0), b ** k)}일 때, ${fAt(m)}의 값은? (단, ${jj(Kv, '은/는')} 상수이다.)`, b ** (k - m), {
        explain: `${is(fAt(0), E(Q(1, b), `${MINUS}${Kv}`))} = ${E(b, Kv)} = ${b ** k} = ${E(b, k)}이므로 ${is(Kv, k)}이다. 따라서 ${is(fAt(m), E(Q(1, b), m - k))} = ${b ** (k - m)}이다.`,
        facts: { calc: [[`${b}**(${k}-${m})`, 0]], derived: [k] } });
    }, { count: 4 }),
    T('exps-coef', '계수가 붙은 지수함수를 평행이동 꼴로 — 이동량', '①13 심1', (d, n) => {
      if (n === 0) {
        const e = d.pick([3, 5, 7]), r = d.pick([1, 3, 5, 7, 9]) * pm(d);           // 2^(2(x−p)) + q = 2^e · 2^(2x) + r/2 → p = −e/2
        return inline(`함수 ${yIs(E(2, `2${X}`))}의 그래프를 ${X}축의 방향으로 ${Pv}만큼, ${Y}축의 방향으로 ${Qv}만큼 평행이동하였더니 함수 ${yIs(`${2 ** e} × ${E(2, `2${X}`)} ${r < 0 ? MINUS : '+'} ${frac(Math.abs(r), 2)}`)}의 그래프가 되었다. 상수 ${Pv}, ${Qv}의 값을 구하시오.`,
          `${Pv} = ${frac('{0}', '{1}')}, ${Qv} = ${frac('{2}', '{3}')}`, [{ answer: -e, signed: true }, { answer: 2 }, { answer: r, signed: true }, { answer: 2 }], {
            shown: `${is(Pv, Q(-e, 2))}, ${is(Qv, Q(r, 2))}`,
            explain: `옮긴 식은 ${yIs(`${E(2, `2(${X} − ${Pv})`)} + ${Qv}`)} = ${E(2, `${MINUS}2${Pv}`)} × ${E(2, `2${X}`)} + ${Qv}이다. ${is(E(2, `${MINUS}2${Pv}`), 2 ** e)} = ${E(2, e)}에서 ${is(`${MINUS}2${Pv}`, e)}, ${is(Pv, Q(-e, 2))}이고, ${is(Qv, Q(r, 2))}이다.`,
            facts: { calc: [[`0-${e}`, 0], ['2', 1], [jn(r), 2], ['2', 3]], derived: [e] } });
      }
      if (n === 1) {
        const b = d.pick([2, 3, 5]), m = d.pick([3, 7, 9, 11].filter((v) => v % b !== 0)), c = nz(d, -4, 4);
        return vals(`지수함수 ${yIs(E(b, X))}의 그래프를 ${X}축의 방향으로 ${Av}만큼, ${Y}축의 방향으로 ${Bv}만큼 평행이동하면 함수 ${yIs(`${frac(1, m)} × ${E(b, L(1, -1))} ${sgnT(c)}`)}의 그래프와 일치한다. ${E(b, Av)}의 값과 ${Bv}의 값을 구하시오. (단, ${Av}, ${jj(Bv, '은/는')} 상수이다.)`, [[E(b, Av), m * b], [Bv, c]], {
          explain: `옮긴 식은 ${yIs(`${E(b, `${X} − ${Av}`)} + ${Bv}`)} = ${frac(1, E(b, Av))} × ${E(b, X)} + ${Bv}이고, ${frac(1, m)} × ${E(b, L(1, -1))} = ${frac(1, m * b)} × ${E(b, X)}이다. 따라서 ${is(E(b, Av), m * b)}, ${is(Bv, c)}이다.`,
          facts: { calc: [[`${m}*${b}`, 0], [jn(c), 1]] } });
      }
      if (n === 2) {
        const b = d.pick([2, 3]), j = d.int(1, b === 2 ? 3 : 2), k = b ** j;
        return num(`함수 ${yIs(`${k} × ${E(b, X)}`)}의 그래프는 함수 ${yIs(E(b, X))}의 그래프를 ${X}축의 방향으로 ${Mv}만큼 평행이동한 것이다. 상수 ${Mv}의 값은?`, -j, {
          explain: `${k} × ${E(b, X)} = ${E(b, j)} × ${E(b, X)} = ${E(b, L(1, j))}이므로 ${jj(X, '을/를')} ${X} ${MINUS} ${jj(Mv, '으로/로')} 바꾼 꼴 ${E(b, `${X} − ${Mv}`)}과 비교하면 ${is(Mv, -j)}이다.`,
          facts: { calc: [[`0-${j}`, 0]], derived: [j], rule: 'exps-coef-int' } });
      }
      const b = d.pick([2, 3]), k = d.pick([3, 5, 7].filter((v) => v !== b));
      const right = MINUS + LG(b, k), wrongs = [LG(b, k), MINUS + LG(k, b), LG(k, b), String(-k).replace('-', MINUS), frac(MINUS + k, b), MINUS + frac(1, k)];
      return choose(d, `함수 ${yIs(`${k} × ${E(b, X)}`)}의 그래프는 함수 ${yIs(E(b, X))}의 그래프를 ${X}축의 방향으로 ${Mv}만큼 평행이동한 것이다. 상수 ${Mv}의 값은?`, right, wrongs, {
        explain: `${is(k, E(b, LG(b, k)))}이므로 ${k} × ${E(b, X)} = ${E(b, `${X} + ${LG(b, k)}`)}이다. 따라서 ${X}축의 방향으로 ${right}만큼 평행이동한 것이다.`, facts: { rule: 'exps-coef-log' } });
    }, { count: 4 }),
    T('exps-seq', '평행이동·대칭이동을 차례로 한 식', '①14', (d) => {
      const b = d.pick([2, 3]), m = d.int(1, b === 2 ? 3 : 2), c = nz(d, -5, 5);
      return inline(`지수함수 ${yIs(E(b, X))}의 그래프를 ${X}축의 방향으로 ${m}만큼, ${Y}축의 방향으로 ${iq(c)}만큼 평행이동한 후 ${Y}축에 대하여 대칭이동하였더니 함수 ${yIs(`${Av}${E(Q(1, b), X)} + ${Cv}`)}의 그래프와 일치하였다. 상수 ${Av}, ${Cv}의 값을 구하시오.`,
        `${Av} = ${frac('{0}', '{1}')}, ${Cv} = {2}`, [{ answer: 1 }, { answer: b ** m }, { answer: c, signed: true }], {
          shown: `${is(Av, Q(1, b ** m))}, ${is(Cv, c)}`,
          explain: `평행이동하면 ${yIs(plusC(E(b, L(1, -m)), c))}, ${Y}축에 대하여 대칭이동하면 ${yIs(plusC(E(b, L(-1, -m)), c))} = ${frac(1, b ** m)} × ${E(Q(1, b), X)} ${sgnT(c)}이다.`,
          facts: { calc: [['1', 0], [`${b}**${m}`, 1], [jn(c), 2]] } });
    }),
    T('exps-congruent', '평행·대칭이동으로 겹쳐질 수 있는 그래프 고르기', '①15', (d) => {
      const b = d.pick([2, 3, 5]), p = nz(d, -3, 3), k = d.pick([2, 3, 4, 5].filter((v) => v !== b));
      const pool = [
        [yIs(`${MINUS}${E(b, L(-1, p))}`), true, `${Y}축, ${X}축에 대하여 대칭이동한 뒤 평행이동한 것이다`],
        [yIs(plusC(E(Q(1, b), X), nz(d, -3, 3))), true, `${Y}축에 대하여 대칭이동한 뒤 평행이동한 것이다`],
        [yIs(`${k} × ${E(b, X)}`), true, `${k} = ${E(b, LG(b, k))}이므로 ${X}축의 방향으로 평행이동한 것이다`],
        [yIs(E(`(${rt(b)})`, X)), false, `${E(b, frac(X, 2))}이라 밑이 달라 겹칠 수 없다`],
        [yIs(E(b * b, X)), false, `${E(b, `2${X}`)}이라 밑이 달라 겹칠 수 없다`],
        [yIs(plusC(E(b, `2${X}`), 1)), false, `${X}의 계수가 2라 겹칠 수 없다`]
      ];
      const three = d.shuffle(pool).slice(0, 3);
      return comboPick(d, `다음 함수의 그래프 중 함수 ${yIs(E(b, X))}의 그래프를 평행이동하거나 대칭이동하여 겹쳐질 수 있는 것만을 있는 대로 고른 것은?`, three.map((r) => r[0]), three.map((r) => r[1]),
        three.map((r, i) => `${GA[i]}은 ${r[2]}`).join('. ') + '.');
    }),
    T('exps-quadrant', '지수함수의 그래프가 어떤 사분면을 지나지 않을 조건', '①16', (d) => {
      const b = d.pick([2, 3]), p = d.int(2, 3), top = b ** p;
      return N(`함수 ${yIs(`${MINUS}${E(Q(1, b), L(1, -p))} + ${Kv}`)}의 그래프가 제2사분면을 지나지 않도록 하는 자연수 ${Kv}의 개수는?`, top, {
        explain: `이 함수는 ${X}의 값이 증가하면 ${Y}의 값도 증가하고, ${X} &lt; 0일 때 ${Y}의 값은 ${Y}절편보다 작다. ${Y}절편은 ${MINUS}${E(Q(1, b), -p)} + ${Kv} = ${Kv} ${MINUS} ${top}이므로 ${Kv} ${MINUS} ${top} ≤ 0, ${Kv} ≤ ${top}이다. 자연수 ${jj(Kv, '은/는')} ${top}개이다.`,
        facts: { calc: [[`${b}**${p}`, 0]] } });
    })
  ];

  // ════════════════════════════════════════════════════════════════
  // 지수함수의 대소 관계와 최대·최소
  // ════════════════════════════════════════════════════════════════
  // 밑 b 의 거듭제곱 b^r(r 은 유리수)를 여러 꼴로 적는다: 거듭제곱근, 역수 밑의 음의 지수, 제곱한 밑, 그대로(정수 지수만)
  function powForm(d, b, r) {
    const q = asQ(r), forms = [];
    if (q.q > 1 && q.p > 0) forms.push(() => (q.q === 2 ? rt(b ** q.p) : rtn(q.q, b ** q.p)));
    if (q.p !== 0) forms.push(() => E(Q(1, b), q.q === 1 ? -q.p : [-q.p, q.q].map(String).join('/') === '' ? '' : null));
    if ((q.p % 2 === 0 || q.q === 1) && q.p !== 0) forms.push(() => E(b * b, q.q === 1 && q.p % 2 === 0 ? q.p / 2 : null));
    const okForms = forms.map((f) => f()).filter((h) => h && !/null/.test(h));
    return okForms.length ? d.pick(okForms) : null;
  }
  const expm = [
    T('expm-compare', '거듭제곱근·지수 꼴 수의 대소', '①17', (d, n) => {
      const b = d.pick([2, 3]);
      // 수와 그 지수: 거듭제곱근(ⁿ√b^m), (1/b)^(−k), (b²)^k, (√b)^m
      const mk = () => {
        const kind = d.int(0, 3);
        if (kind === 0) { const nn = d.int(2, 5), m = d.int(2, 9); if (gcd(m, nn) !== 1 || b ** m > 256) return null; return { h: nn === 2 ? rt(b ** m) : rtn(nn, b ** m), v: m / nn, why: `${E(b, [m, nn])}` }; }
        if (kind === 1) { const k = d.pick([-3, -2, -1, 2, 3]); return { h: E(Q(1, b), k), v: -k, why: E(b, -k) }; }
        if (kind === 2) { const k = d.pick([-2, -1, 2]); return { h: E(b * b, k), v: 2 * k, why: E(b, 2 * k) }; }
        const m = d.pick([1, 3, 5, 7]); return { h: E(`(${rt(b)})`, m), v: m / 2, why: E(b, [m, 2]) };
      };
      if (n === 0) {
        const A = mk(), Bq = mk();
        if (!A || !Bq || Math.abs(A.v - Bq.v) < 1e-9 || stripH(A.h) === stripH(Bq.h)) return null;
        const right = A.v > Bq.v ? 'A &gt; B' : 'A &lt; B';
        return choose(d, `두 수 ${is('A', A.h)}, ${is('B', Bq.h)}의 대소 관계로 옳은 것은?`, right, ['A &gt; B', 'A = B', 'A &lt; B'], {
          size: 3, explain: `A = ${A.why}, B = ${Bq.why}이다. 밑 ${jj(String(b), '이/가')} 1보다 크므로 지수가 큰 쪽이 크다. 따라서 ${right}이다.`, facts: { rule: 'expm-compare2' } });
      }
      const list = [mk(), mk(), mk()];
      if (list.some((x) => !x) || new Set(list.map((x) => stripH(x.h))).size < 3) return null;
      return orderPick(d, `세 수 ${is('A', list[0].h)}, ${is('B', list[1].h)}, ${is('C', list[2].h)}의 대소 관계로 옳은 것은?`, ['A', 'B', 'C'], list.map((x) => x.v), {
        explain: `A = ${list[0].why}, B = ${list[1].why}, C = ${list[2].why}이다. 밑 ${jj(String(b), '이/가')} 1보다 크므로 지수가 클수록 크다.`, facts: { rule: 'expm-compare3' } });
    }, { count: 2 }),
    T('expm-minmax', '정의역이 주어진 지수함수의 최댓값·최솟값', '①18', (d, n) => {
      const b = d.pick([2, 3]), p = d.int(-2, 2), c = d.int(-3, 3), w = d.int(2, 3);
      // n = 0: 밑 b(증가) — 최소는 왼쪽 끝(분수), 최대는 오른쪽 끝(정수). n = 1: 밑 1/b(감소) — 최대는 왼쪽 끝(정수), 최소는 오른쪽 끝(분수)
      const up = n === 0, lo = up ? p - d.int(1, 2) : p - d.int(0, 1), hi = lo + w;
      const ef = (x) => (up ? x - p : p - x);                     // b 의 지수
      const big = up ? hi : lo, small = up ? lo : hi, eb = ef(big), es = ef(small);
      if (eb < 0 || es >= 0 || b ** eb > 81 || b ** -es > 27) return null;
      const Mx = b ** eb + c, mn = Q(1 + c * b ** -es, b ** -es);
      if (mn.q === 1) return null;
      const base = up ? b : Q(1, b), f = yIs(plusC(E(base, L(1, -p)), c));
      return inline(`정의역이 ${setX(`${iq(lo)} ≤ ${X} ≤ ${iq(hi)}`)}인 함수 ${f}의 최댓값과 최솟값을 구하시오.`, `최댓값: {0}, 최솟값: ${frac('{1}', '{2}')}`,
        [{ answer: Mx, signed: true }, { answer: mn.p, signed: true }, { answer: mn.q }], {
          shown: `최댓값: ${iq(Mx)}, 최솟값: ${iq(mn)}`,
          explain: `밑 ${jj(frx(base), '이/가')} 1보다 ${up ? '크므로 증가' : '작으므로 감소'}한다. ${is(X, big)}일 때 최댓값 ${plusC(E(base, big - p), c)} = ${iq(Mx)}, ${is(X, small)}일 때 최솟값 ${plusC(E(base, small - p), c)} = ${iq(mn)}이다.`,
          facts: { calc: [[`${b}**${eb}+(${jn(c)})`, 0], [`1+(${jn(c)})*${b}**${-es}`, 1], [`${b}**${-es}`, 2]], derived: [eb, -es] } });
    }, { count: 2 }),
    T('expm-cond', '최댓값과 최솟값의 조건으로 상수', '①19', (d) => {
      const w = d.int(1, 2), a = d.int(w, 4), c = d.int(1, 5), D = 2 ** a - 2 ** (a - w);
      return num(`정의역이 ${setX(`0 ≤ ${X} ≤ ${w}`)}인 함수 ${yIs(`${E(2, `${Av} ${MINUS} ${X}`)} + ${c}`)}의 최댓값을 ${V('M')}, 최솟값을 ${V('m')}이라 할 때, ${is(`${V('M')} ${MINUS} ${V('m')}`, D)}이다. 상수 ${Av}의 값은?`, a, {
        explain: `${E(2, `${Av} − ${X}`)} = ${E(2, Av)} × ${E(Q(1, 2), X)}이므로 감소한다. ${V('M')} = ${E(2, Av)} + ${c}, ${V('m')} = ${E(2, `${Av} − ${w}`)} + ${c}이고 ${V('M')} − ${V('m')} = ${frac(2 ** w - 1, 2 ** w)} × ${E(2, Av)} = ${D}에서 ${is(E(2, Av), 2 ** a)}, ${is(Av, a)}이다.`,
        facts: { calc: [[`${a}`, 0]], derived: [a] } });
    }),
    T('expm-quad', '지수에 이차식이 있는 함수의 최댓값·최솟값', '①20', (d, n) => {
      if (n === 0) {
        const b = d.pick([2, 3]), h = d.int(1, 3), k = d.int(2, b === 2 ? 5 : 4), c = k - h * h;
        const ex = poly([[-1, X + sup(2)], [2 * h, X], [c, '']]), exE = poly([[-1, X + '²'], [2 * h, X], [c, '']]);   // 지수 자리에는 위첨자를 겹치지 않게 ² 글자로
        return N(`함수 ${yIs(E(b, exE))}의 최댓값은?`, b ** k, {
          explain: `${ex} = ${MINUS}(${L(1, -h)})${sup(2)} + ${k} ≤ ${k}이고 밑 ${jj(String(b), '이/가')} 1보다 크므로 지수가 ${k}일 때 최대이다. 최댓값은 ${E(b, k)} = ${b ** k}이다.`,
          facts: { calc: [[`${b}**(${c}+${h}*${h})`, 0]], derived: [h] } });
      }
      const h = d.int(-1, 3), e0 = d.int(0, 2), l = h - d.int(1, 3), r = h + d.int(1, 3), e1 = Math.max((l - h) ** 2, (r - h) ** 2) + e0;
      if (e1 > 10 || (l - h) ** 2 === (r - h) ** 2) return null;
      const c = h * h + e0, ex = poly([[1, X + sup(2)], [-2 * h, X], [c, '']]), exE = poly([[1, X + '²'], [-2 * h, X], [c, '']]), far = (l - h) ** 2 > (r - h) ** 2 ? l : r;
      return vals(`정의역이 ${setX(`${iq(l)} ≤ ${X} ≤ ${iq(r)}`)}인 함수 ${yIs(E(2, exE))}의 최댓값을 ${V('M')}, 최솟값을 ${V('m')}이라 할 때, ${V('M')}, ${V('m')}의 값을 구하시오.`, [[V('M'), 2 ** e1, true], [V('m'), 2 ** e0, true]], {
        explain: `${ex} = ${plusC(`(${L(1, -h)})${sup(2)}`, e0)}이므로 ${iq(l)} ≤ ${X} ≤ ${iq(r)}에서 ${is(X, h)}일 때 ${e0}, ${is(X, far)}일 때 ${e1}이므로 ${e0} ≤ ${ex} ≤ ${e1}이다. 밑 2가 1보다 크므로 ${V('M')} = ${E(2, e1)} = ${2 ** e1}, ${V('m')} = ${E(2, e0)} = ${2 ** e0}이다.`,
        facts: { calc: [[`2**${e1}`, 0], [`2**${e0}`, 1]], derived: [e0, e1] } });
    }, { count: 2 })
  ];

  // ════════════════════════════════════════════════════════════════
  // 지수방정식과 지수부등식
  // ════════════════════════════════════════════════════════════════
  const expe = [
    T('expe-eq', '밑을 같게 하는 지수방정식', '①22 심4', (d, n) => {
      if (n === 0) {
        const b = d.pick([2, 3, 5, 7]), k = d.int(2, b === 2 ? 7 : 4), c = nz(d, -4, 4), x = k - c;
        if (b ** k > 999) return null;
        return num(`방정식 ${is(E(b, L(1, c)), b ** k)}의 해는?`, x, {
          explain: `${b ** k} = ${E(b, k)}이므로 ${is(L(1, c), k)}, ${is(X, x)}이다.`, facts: { calc: [[`${k}-(${jn(c)})`, 0]], derived: [k] } });
      }
      if (n === 1) {
        const b = d.pick([2, 3]), k = d.int(2, b === 2 ? 6 : 4), c = nz(d, -5, 5), x = c + k;        // b^(c − x) = 1/b^k → c − x = −k
        return num(`방정식 ${is(E(b, L(-1, c)), frac(1, b ** k))}의 해는?`, x, {
          explain: `${frac(1, b ** k)} = ${E(b, -k)}이므로 ${is(L(-1, c), -k)}, ${is(X, x)}이다.`, facts: { calc: [[`${jn(c)}+${k}`, 0]], derived: [k] } });
      }
      // b^(αx + β) = (b^r)^(x + γ) 또는 (1/b^r)^(x + γ)
      const b = d.pick([2, 3]), r = d.pick([2, 3]), s = pm(d), x0 = nz(d, -4, 5), al0 = nz(d, -3, 3), ga = d.int(-4, 4);
      if (al0 === s * r) return null;
      const be0 = s * r * (x0 + ga) - al0 * x0;
      if (Math.abs(be0) > 20 || b ** r > 27) return null;
      const rhsBase = s > 0 ? b ** r : Q(1, b ** r);
      return num(`방정식 ${is(E(b, L(al0, be0)), E(rhsBase, L(1, ga)))}의 해는?`, x0, {
        explain: `우변은 ${E(b, `${s < 0 ? MINUS : ''}${r}(${L(1, ga)})`)}이므로 ${is(L(al0, be0), `${s < 0 ? MINUS : ''}${r}(${L(1, ga)})`)}이다. 풀면 ${is(X, x0)}이다.`,
        facts: { calc: [[`(${s * r}*(${ga})-(${be0}))/((${al0})-(${s * r}))`, 0]], derived: [r * s < 0 ? r : r, Math.abs(s * r)] } });
    }, { count: 3 }),
    T('expe-eq-quad', '지수에 이차식이 있는 지수방정식', '①23', (d) => {
      const [p, q] = d.pick([[3, 4], [2, 3], [2, 5], [3, 5]]), [r1, r2] = pick2(d, [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
      const c = -(r1 + r2), e = r1 * r2;                       // x² = −(cx + e) → x² + cx + e = 0
      if (c === 0) return null;
      return inline(`방정식 ${is(E(Q(p, q), X + '²'), E(Q(q, p), L(c, e)))}의 해를 구하시오.`, `${X} = {0} 또는 ${X} = {1}`, [{ answer: Math.min(r1, r2), signed: true }, { answer: Math.max(r1, r2), signed: true }], {
        unordered: true, shown: `${is(X, Math.min(r1, r2))} 또는 ${is(X, Math.max(r1, r2))}`,
        explain: `${E(Q(q, p), L(c, e))} = ${E(Q(p, q), L(-c, -e))}이므로 ${is(X + sup(2), L(-c, -e))}, ${poly([[1, X + sup(2)], [c, X], [e, '']])} = 0이다. 풀면 ${is(X, Math.min(r1, r2))} 또는 ${is(X, Math.max(r1, r2))}이다.`,
        facts: { calc: [[`(0-(${c})-((${c})**2-4*(${e}))**0.5)/2`, 0], [`(0-(${c})+((${c})**2-4*(${e}))**0.5)/2`, 1]], derived: [4, 2, 0.5] } });
    }),
    T('expe-ineq', '밑을 같게 하는 지수부등식', '①24', (d, n) => {
      if (n === 2) {
        // 해 가운데 자연수의 개수: b^(αx − β) ≤ (1/b)^(x − γ) → (α + 1)x ≤ β + γ
        const b = d.pick([2, 3, 5]), al0 = d.int(2, 3), K = d.int(2, 6), ga = d.int(1, 4), be0 = (al0 + 1) * K - ga, rel = d.pick(['<=', '<']);
        const cnt = rel === '<=' ? K : K - 1;
        if (be0 <= 0 || cnt < 1) return null;
        return N(`부등식 ${E(b, L(al0, -be0))} ${REL[rel]} ${E(Q(1, b), L(1, -ga))}을 만족시키는 자연수 ${X}의 개수는?`, cnt, {
          explain: `우변은 ${E(b, L(-1, ga))}이고 밑 ${jj(String(b), '이/가')} 1보다 크므로 ${L(al0, -be0)} ${REL[rel]} ${L(-1, ga)}, ${al0 + 1}${X} ${REL[rel]} ${be0 + ga}, ${X} ${REL[rel]} ${K}이다. 자연수 ${jj(X, '은/는')} ${cnt}개이다.`,
          facts: { calc: [[`(${be0}+${ga})/(${al0}+1)${rel === '<' ? '-1' : ''}`, 0]] } });
      }
      // n = 0: 밑 b(1보다 큼), n = 1: 밑 1/b(1보다 작음). b^(αx + β) rel (b^r)^(x + γ)
      const b = d.pick([2, 3]), r = d.pick([2, 3]), x0 = nz(d, -6, 10), al0 = d.pick([1, 2, 3, -1].filter((v) => v !== r)), ga = d.int(-4, 4), be0 = r * (x0 + ga) - al0 * x0, rel = d.pick(['<', '<=', '>', '>=']);
      if (Math.abs(be0) > 20 || b ** r > 27) return null;
      const up = n === 0, base = up ? b : Q(1, b), big = up ? b ** r : Q(1, b ** r);
      let fr = up ? rel : FLIP[rel];                                   // αx + β fr r(x + γ)
      const coef = al0 - r;                                              // (α − r)x fr r·γ − β
      if (coef < 0) fr = FLIP[fr];
      return ray(`부등식 ${E(base, L(al0, be0))} ${REL[rel]} ${E(big, L(1, ga))}을 푸시오.`, fr, x0, {
        explain: `우변은 ${E(base, `${r}${ga === 0 ? X : `(${L(1, ga)})`}`)}이다. 밑 ${jj(frx(base), '이/가')} 1보다 ${up ? '크므로 부등호 방향은 그대로' : '작으므로 부등호 방향이 바뀌어'} ${L(al0, be0)} ${REL[up ? rel : FLIP[rel]]} ${L(r, r * ga)}이다. 정리하면 ${L(coef, 0)} ${REL[up ? rel : FLIP[rel]]} ${iq(r * ga - be0)}${coef === 1 ? '이다.' : `이고, ${coef > 0 ? `양변을 ${jj(String(coef), '으로/로')} 나누면` : `양변을 음수 ${jj(iq(coef), '으로/로')} 나누면 부등호 방향이 바뀌어`} ${X} ${REL[fr]} ${iq(x0)}이다.`}`,
        facts: { calc: [[`(${r}*(${ga})-(${be0}))/((${al0})-${r})`, 1]], derived: [r] } });
    }, { count: 3 }),
    T('expe-ineq-quad', '지수에 이차식이 있는 지수부등식', '①25', (d) => {
      const b = d.pick([2, 3]), [r1, r2] = pick2(d, [-4, -3, -2, -1, 0, 1, 2, 3, 4]).sort((u, v) => u - v), c = -(r1 + r2), e = r1 * r2, rel = d.pick(['<', '<=']);
      if (c === 0) return null;
      // b^(x²) rel (1/b)^(cx + e) → x² + cx + e rel 0
      return betw(`부등식 ${E(b, X + '²')} ${REL[rel]} ${E(Q(1, b), L(c, e))}을 푸시오.`, r1, rel, rel, r2, {
        explain: `우변은 ${E(b, L(-c, -e))}이고 밑 ${jj(String(b), '이/가')} 1보다 크므로 ${X}${sup(2)} ${REL[rel]} ${L(-c, -e)}, ${poly([[1, X + sup(2)], [c, X], [e, '']])} ${REL[rel]} 0이다. 따라서 ${iq(r1)} ${REL[rel]} ${X} ${REL[rel]} ${iq(r2)}이다.`,
        facts: { calc: [[`(0-(${c})-((${c})**2-4*(${e}))**0.5)/2`, 0], [`(0-(${c})+((${c})**2-4*(${e}))**0.5)/2`, 3]], derived: [4, 2, 0.5] } });
    }),
    T('expe-sub-eq', 'aˣ = t로 치환해 푸는 지수방정식', '①26', (d, n) => {
      if (n === 0) {
        const B0 = d.pick([2, 3, 5, 8]), c = d.pick([3, 5, 6, 7, 10].filter((v) => v !== B0 && v !== B0 * B0));
        const right = LG(B0, c), wrongs = [LG(c, B0), LG(B0, c + 1), String(c), LG(B0, c + 2 === B0 ? c + 3 : c + 2), frac(c, B0), MINUS + LG(B0, c)];
        return choose(d, `방정식 ${E(B0, `2${X}`)} ${MINUS} ${c + 1} × ${E(B0, X)} + ${c} = 0의 두 근을 ${al}, ${be}(${al} &lt; ${be})라 할 때, ${be}의 값은?`, right, wrongs, {
          explain: `${is(E(B0, X), Tv)}(${Tv} &gt; 0)로 놓으면 ${Tv}${sup(2)} ${MINUS} ${c + 1}${Tv} + ${c} = 0, (${Tv} ${MINUS} 1)(${Tv} ${MINUS} ${c}) = 0이다. ${is(E(B0, X), 1)}에서 ${is(X, 0)}, ${is(E(B0, X), c)}에서 ${is(X, right)}이므로 ${is(al, 0)}, ${is(be, right)}이다.`,
          facts: { rule: 'expe-sub-eq-log' } });
      }
      const k = d.int(1, 2), a0 = d.int(k - 1, k), c = 4 ** a0 - 4 ** (k - a0), b0 = -2 * a0 + 2 * k;
      if (c === 0) return null;
      return vals(`좌표평면에서 두 점 ${pt(-1, 2 * k + 2)}, ${jj(pt(0, 2 * k), '을/를')} 지나는 직선 위의 점 ${nb(`P(${Av}, ${Bv})`)}가 ${jj(is(`${E(4, Av)} ${MINUS} ${E(2, Bv)}`, c), '을/를')} 만족시킬 때, ${Av}, ${Bv}의 값을 구하시오.`, [[Av, a0], [Bv, b0]], {
        explain: `직선의 방정식은 ${yIs(L(-2, 2 * k))}이므로 ${is(Bv, L(-2, 2 * k, Av))}, ${is(E(2, Bv), frac(E(4, k), E(4, Av)))}이다. ${is(E(4, Av), Tv)}(${Tv} &gt; 0)로 놓으면 ${Tv} ${MINUS} ${frac(4 ** k, Tv)} = ${iq(c)}, ${poly([[1, Tv + sup(2)], [-c, Tv], [-(4 ** k), '']])} = 0이고 양수인 근은 ${is(Tv, 4 ** a0)}이다. 따라서 ${is(Av, a0)}, ${is(Bv, b0)}이다.`,
        facts: { calc: [[`${a0}`, 0], [`${b0}`, 1]], derived: [a0, Math.abs(b0)] } });
    }, { count: 2 }),
    T('expe-sub-ineq', 'aˣ = t로 치환해 푸는 지수부등식', '①28', (d) => {
      const b = d.pick([2, 3]), m = d.int(1, b === 2 ? 3 : 2), t0 = b ** m, K = t0 * (t0 + b), rel = d.pick(['>=', '>']);
      if (K > 400) return null;
      // (1/b)^(2x) + (1/b)^(x − 1) − K rel 0 → t² + bt − K rel 0 → t rel t0 → (1/b)^x rel b^m → x FLIP −m
      return ray(`부등식 ${E(Q(1, b), `2${X}`)} + ${E(Q(1, b), L(1, -1))} ${MINUS} ${K} ${REL[rel]} 0을 푸시오.`, FLIP[rel], -m, {
        explain: `${is(E(Q(1, b), X), Tv)}(${Tv} &gt; 0)로 놓으면 ${E(Q(1, b), L(1, -1))} = ${b}${Tv}이므로 ${Tv}${sup(2)} + ${b}${Tv} ${MINUS} ${K} ${REL[rel]} 0, (${Tv} + ${t0 + b})(${Tv} ${MINUS} ${t0}) ${REL[rel]} 0이다. ${Tv} &gt; 0이므로 ${Tv} ${REL[rel]} ${t0}, ${E(Q(1, b), X)} ${REL[rel]} ${E(Q(1, b), -m)}이다. 밑이 1보다 작으므로 ${X} ${REL[FLIP[rel]]} ${MINUS}${m}이다.`,
        facts: { calc: [[`0-${m}`, 1]], derived: [m] } });
    })
  ];

  B.addUnit({
    id: '11-1-2', grade: 11, semester: 1, no: 2, title: '지수함수와 로그함수', version: 1,
    groups: [
      { id: 'expg', title: '지수함수의 뜻과 그래프', standard: S7, types: expg },
      { id: 'exps', title: '지수함수의 그래프의 이동', standard: S7, types: exps },
      { id: 'expm', title: '지수함수의 대소 관계와 최대·최소', standard: S7, types: expm },
      { id: 'expe', title: '지수방정식과 지수부등식', standard: S8, types: expe }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
