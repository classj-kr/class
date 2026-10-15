// 중학교 3학년 1학기 3단원 다항식의 곱셈과 인수분해 — 뒤쪽 묶음(인수와 공통인수, 인수분해 공식, 완전제곱식, 여러 가지 인수분해,
// 계수와 인수의 관계, 인수분해를 이용한 수의 계산, 인수분해를 이용한 식의 값).
// 단원 틀과 도구(식 글·다항식·근호가 든 수·인수분해한 식의 답 칸), 싣는 기준, 뺀 것과 까닭은 9-1-3a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 인수분해한 식은 괄호째 끼워 넣는 칸으로 받는다: (x + p)(x + q) 는 두 칸(차례 무관), (ax + b)(cx + d) 는 네 칸(x 의 계수는 자연수, 괄호째 차례 무관),
// 공통인수가 앞에 붙는 꼴은 앞의 수 칸 하나와 괄호 칸. 답이 하나로 정해지지 않거나 칸의 모양이 답을 흘리는 꼴(공통인수의 문자, 덩어리째 묶인 식)은 고르기로 낸다.
// 「인수」를 가리는 고르기는 코드가 나눗셈(한 문자는 몫과 나머지, 두 문자는 일차식의 값이 0이 되게 문자를 넣어 보기)으로 참·거짓을 셈한다.
// 고르기의 틀린 보기는 아이들이 하는 잘못(공통인수를 덜 묶음, 부호를 바꿈, 다시 인수분해할 수 있는 것을 남김, 가운데 항의 부호)으로 만든다.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, box, frac, lines, N, M, C, F, D, inline } = B.kit;
  const { LAB, MINUS, gcd, Q, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, isInt, fl, mag, tx, nb, tail, V, sup, tag, ex, proc, nz, asQ, poly, polyAns, linAns, radAns, rt, grp, sqParts, radText } = B.kit.mid;
  const K = B.kit.m913;
  const { STD, UNIT, T, NOTE1, jn, jq, X, keyOf, term, pAdd, pNeg, pSub, pMul, valX, xv, mk, same, coefOf, termOf, letters, ordered, varH, ph, pt, htmlX, xh, xe, xex, eqx, xtagged, ej, xj, pj,
    pn, lin, lin2, quad, sg, kp, pairOf, told, EXPAND, CALC, FACTOR, polyOK, polyQ, slots, eqLabel, numQ1, facH, facX, NOTE_AC, facAC, sOf, sDiv, sMul, sH, SQF, isSqf, fr1,
    INK, TINT, SVG_ITALIC, svgX, plainX, svg, label, word, shapeD, thin } = K;

  // ── 인수인가 ──
  // 한 문자(v)의 다항식: 계수 배열로 바꾸어 나눗셈을 하고 나머지가 0인지 본다.
  function uArr(P, v) {
    const deg = Math.max(0, ...P.map((t) => t.e[v] || 0)), out = Array.from({ length: deg + 1 }, () => Q(0));
    for (const t of P) { if (letters(t).some((k) => k !== v)) throw new Error('한 문자의 다항식이 아니다'); const k = t.e[v] || 0; out[k] = qadd(out[k], t.q); }
    return out;
  }
  function uDivides(P, Fx, v) {
    const a = uArr(P, v || 'x'), b = uArr(Fx, v || 'x');
    while (b.length && b[b.length - 1].p === 0) b.pop();
    while (a.length >= b.length && a.length) {
      const top = a[a.length - 1];
      if (top.p !== 0) { const f = qdiv(top, b[b.length - 1]), shift = a.length - b.length; b.forEach((c, i) => { a[i + shift] = qsub(a[i + shift], qmul(f, c)); }); }
      a.pop();
    }
    return a.every((c) => c.p === 0);
  }
  // 두 문자의 다항식 P 가 일차식 Fx(문자 v 의 계수가 0이 아니다)를 인수로 갖는가: Fx = 0 이 되게 v 에 식을 넣어 P 가 0이 되는지 본다.
  function linDivides(P, Fx, v) {
    const t = termOf(Fx, { [v]: 1 }); if (!t) return false;
    const rest = Fx.filter((u) => u !== t), sub = rest.map((u) => term(qdiv(qneg(u.q), t.q), u.e, ''));
    return xv(srcOfP(P), { [v]: sub }).length === 0;
  }
  const srcOfP = (P) => pn(ordered(P).map((t) => [t.q, letters(t).sort().map((k) => k + (t.e[k] > 1 ? '^' + t.e[k] : '')).join('')]));
  // 일차식 ax + by 를 (수) × (x 의 계수가 양수이고 계수의 최대공약수가 1인 일차식)으로
  function normLin(a, b) { const g = gcd(Math.abs(a), Math.abs(b)) || 1, s = a < 0 || (a === 0 && b < 0) ? -1 : 1; return [s * g, (s * a) / g, (s * b) / g]; }
  const lead = (k) => (k === 1 ? '' : k === -1 ? '-' : String(k));
  // 인수분해한 식을 고르는 문항: right 는 바른 꼴의 식 글, wrongs 는 틀린 꼴의 식 글(전개하면 다르거나, 덜 묶은 것은 [식 글, 'incomplete']).
  function facPick(d, text, target, right, wrongs, o) {
    const opt = o || {}, P = xv(target), kept = [];
    if (!same(xv(right), P)) throw new Error('바른 보기가 처음 식과 다르다: ' + right);
    for (const w of d.shuffle(wrongs)) {
      if (kept.length === (opt.count || 4)) break;
      const [src, kind] = Array.isArray(w) ? w : [w, ''];
      if (src === right || kept.some((k) => k.src === src)) continue;
      const eq = same(xv(src), P);
      if (eq && kind !== 'incomplete') continue;   // 전개하면 같은데 덜 묶은 것도 아닌 것은 버린다(바른 답이 둘이 된다)
      kept.push({ src, ok: false });
    }
    if (kept.length < (opt.count || 4)) throw new Error('틀린 보기가 모자라다');
    const rows = d.shuffle([{ src: right, ok: true }].concat(kept)), at = rows.findIndex((r) => r.ok);
    return C(text, rows.map((r) => xh(r.src)), at, { figure: opt.figure === undefined ? xex(target) : opt.figure, explain: opt.explain, facts: Object.assign({ truth: rows.map((r) => r.ok), want: true }, opt.rule ? { rule: opt.rule } : {}) });
  }
  // 답이 다항식인데 계수를 셈하는 검사 식을 따로 적는 문항: rows [계수, 문자 글(V·sup), 검사 식]
  function polyRaw(text, rows, o) {
    return polyAns(text + (o.note === undefined ? NOTE1 : o.note), rows.map(([k, v]) => [k, v]), { figure: o.figure, explain: o.explain, facts: Object.assign({ calc: rows.map(([, , e], i) => [e, i]), unseen: o.unseen || [] }, o.rule ? { rule: o.rule } : {}) });
  }
  const HANGUL = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'];
  // 두 문자 일차식을 괄호째 받는 칸의 단서: 앞 문자의 계수는 자연수, 계수 1도 적는다.
  const noteUW = (u) => ` <span style="white-space:nowrap">(단, ${V(u)}의 계수는 자연수이고,</span> <span style="white-space:nowrap">계수가 1이면 1을 적는다.)</span>`;
  // 수 뒤 토씨(끝 숫자로): tj0(−3, '과/와') → −3과
  const tj0 = (n, pair) => tx(Q(n)) + tail(Math.abs(n), pair);
  const combo = (idx) => idx.slice().sort((a, b) => a - b).map((i) => HANGUL[i]).join(', ');

  // ── 그림 ──
  // 십자 그림: 왼쪽 위 a, 오른쪽 위 b, 왼쪽 아래 c, 오른쪽 아래 d. 대각선으로 곱한 bc(위 줄)와 ad(아래 줄), 그 합. hide 에 든 자리는 이름표 네모로 가린다.
  function crossFig(a, b, c, d, hide) {
    const cell = (x, y, v, key) => (hide[key] ? `<rect x="${x - 13}" y="${y - 15}" width="26" height="21" rx="3" style="fill:#fff;stroke:${INK};stroke-width:1.5"/>` + word(x, y, hide[key], 'middle', 13) : word(x, y, tx(Q(v)), 'middle', 14));
    const arrow = (x1, y, x2) => `<path d="M${x1} ${y}H${x2 - 6}" style="stroke:${INK};stroke-width:1.2"/><path d="M${x2} ${y}l-7 -3.5v7z" style="fill:${INK}"/>`;
    const body = cell(30, 30, a, 'a') + cell(110, 30, b, 'b') + cell(30, 82, c, 'c') + cell(110, 82, d, 'd')
      + `<path d="M48 26L92 72M48 72L92 26" style="stroke:${INK};stroke-width:1.2"/>` + arrow(130, 25, 176) + arrow(130, 77, 176)
      + word(206, 30, tx(Q(b * c)), 'middle', 14) + word(206, 82, tx(Q(a * d)), 'middle', 14) + `<path d="M182 94H232" style="stroke:${INK};stroke-width:1.2"/>` + word(206, 114, tx(Q(a * d + b * c)), 'middle', 14);
    const said = (v, key) => (hide[key] ? hide[key] : String(v).replace('-', MINUS));
    return svg(246, 124, `십자 그림: 왼쪽 위 ${said(a, 'a')}, 오른쪽 위 ${said(b, 'b')}, 왼쪽 아래 ${said(c, 'c')}, 오른쪽 아래 ${said(d, 'd')}. 대각선으로 곱한 값은 위 줄 ${String(b * c).replace('-', MINUS)}, 아래 줄 ${String(a * d).replace('-', MINUS)}이고 그 합은 ${String(a * d + b * c).replace('-', MINUS)}이다.`, body);
  }
  // 넓이가 x²(한 변 x 인 정사각형), x(가로 1, 세로 x 인 직사각형), 1(한 변 1 인 정사각형)인 조각과 그 개수
  function tilesFig(n2, n1, n0) {
    const X0 = 18, T0 = 24, sq = 52, u = 14, gap = 46, x1 = X0 + sq + gap, x2 = x1 + u + gap;
    const body = `<rect x="${X0}" y="${T0}" width="${sq}" height="${sq}" style="fill:rgba(37,99,235,0.18);stroke:${INK};stroke-width:1.3"/>`
      + `<rect x="${x1}" y="${T0}" width="${u}" height="${sq}" style="fill:rgba(234,88,12,0.2);stroke:${INK};stroke-width:1.3"/>`
      + `<rect x="${x2}" y="${T0 + sq - u}" width="${u}" height="${u}" style="fill:rgba(22,163,74,0.22);stroke:${INK};stroke-width:1.3"/>`
      + label(X0 + sq / 2, T0 - 6, 'x') + label(X0 + sq + 7, T0 + sq / 2 + 5, 'x', 'start')
      + label(x1 + u / 2, T0 - 6, '1') + label(x1 + u + 7, T0 + sq / 2 + 5, 'x', 'start')
      + label(x2 + u / 2, T0 + sq - u - 6, '1') + label(x2 + u + 6, T0 + sq - 2, '1', 'start')
      + word(X0 + sq / 2, T0 + sq + 22, n2 + '개') + word(x1 + u / 2, T0 + sq + 22, n1 + '개') + word(x2 + u / 2, T0 + sq + 22, n0 + '개');
    return svg(250, T0 + sq + 32, `직사각형 조각: 한 변의 길이가 x인 정사각형(넓이 x^2) ${n2}개, 가로의 길이가 1이고 세로의 길이가 x인 직사각형(넓이 x) ${n1}개, 한 변의 길이가 1인 정사각형(넓이 1) ${n0}개`, body);
  }

  // ════════════════════════════════════════════════════════════════
  // ── 인수와 공통인수 ──
  const factorTypes = [
    T('fac-not-factor', '인수가 아닌 것 고르기', '①39', (d, n) => {
      if (n === 0) {
        // x(x + p)(x + q) 의 인수가 아닌 것: x³, 부호를 바꾼 일차식, 더한 일차식 가운데 하나
        const [p, q] = d.until(() => [nz(d, -6, 6), nz(d, -6, 6)], ([x, y]) => x !== y && x !== -y);
        const P = `x(x${sg(p)})(x${sg(q)})`, PV = xv(P);
        const goods = d.shuffle([`x${sg(p)}`, `x${sg(q)}`, 'x', `x(x${sg(p)})`, `x(x${sg(q)})`, `(x${sg(p)})(x${sg(q)})`]).slice(0, 4);
        const bad = d.pick(['x^3', `x${sg(-p)}`, `x${sg(p + q)}`, `x^2(x${sg(p)})`].filter((s) => !uDivides(PV, xv(s))));
        const rows = d.shuffle(goods.concat([bad])), truth = rows.map((s) => !uDivides(PV, xv(s))), at = truth.indexOf(true);
        return C(`다음 중 ${xh(P)}의 인수가 아닌 것은?`, rows.map(xh), at, {
          explain: `${xh(P)}의 인수는 1, ${xh('x')}, ${xh(`x${sg(p)}`)}, ${xh(`x${sg(q)}`)}${tail(Math.abs(q), '과/와')} 이들끼리의 곱이다. ${xj(rows[at], '은/는')} 인수가 아니다.`,
          facts: { truth, want: true, rule: 'not-factor-given' }
        });
      }
      // kx³ − km²x = kx(x + m)(x − m) 의 인수가 아닌 것: x² + m²
      const [k, m] = [d.int(2, 6), d.int(1, 5)], P = `${k}x^3-${k * m * m}x`, PV = xv(P);
      const goods = d.shuffle([`${k}x`, `x${sg(m)}`, `x${sg(-m)}`, `x^2-${m * m}`, `x(x${sg(m)})`]).slice(0, 4), bad = `x^2+${m * m}`;
      const rows = d.shuffle(goods.concat([bad])), truth = rows.map((s) => !uDivides(PV, xv(s))), at = truth.indexOf(true);
      return C(`다음 중 ${xh(P)}의 인수가 아닌 것은?`, rows.map(xh), at, {
        explain: `${xh(P)} = ${xh(`${k}x(x^2-${m * m})`)} = ${xh(`${k}x(x+${m})(x-${m})`)}이므로 ${xj(bad, '은/는')} 인수가 아니다.`,
        facts: { truth, want: true, rule: 'not-factor-expanded' }
      });
    }, { count: 2 }),
    T('fac-common-mono', '공통인수로 묶어 인수분해하기', '①40', (d, n) => {
      const [u, w] = pairOf(d);
      if (n === 0) {
        // c·uw(a u + b w) = ca u²w + cb u w²
        const [c, a, b] = d.until(() => [d.int(2, 6), d.int(2, 6), nz(d, -6, 6)], ([, x, y]) => gcd(x, Math.abs(y)) === 1);
        const target = pn([[c * a, u + '^2' + w], [c * b, u + w + '^2']]), right = `${c}${u}${w}(${lin2(a, b, u, w)})`;
        return facPick(d, '다음 식을 인수분해한 것으로 옳은 것은?', target, right, [
          [`${c}${u}(${pn([[a, u + w], [b, w + '^2']])})`, 'incomplete'], [`${c}${w}(${pn([[a, u + '^2'], [b, u + w]])})`, 'incomplete'], [`${u}${w}(${lin2(c * a, c * b, u, w)})`, 'incomplete'],
          `${c}${u}${w}(${lin2(a, -b, u, w)})`, `${c}${u}${w}(${lin2(a, b, u, '')})`, `${c * a}${u}${w}(${lin2(1, b, u, w)})`
        ], { count: 3, rule: 'mono-two', explain: `두 항에 공통으로 들어 있는 인수 ${xh(`${c}${u}${w}`)}를 남김없이 묶어 낸다. ${xh(target)} = ${xh(right)}이다.` });
      }
      // −c·u(a u − b w + e) : 맨 앞 항이 음수인 세 항
      const [c, a, b, e] = d.until(() => [d.int(2, 5), d.int(1, 3), nz(d, -5, 5), nz(d, -6, 6)], ([, x, y, z]) => gcd(gcd(x, Math.abs(y)), Math.abs(z)) === 1 && y !== z);
      const target = pn([[-c * a, u + '^2'], [-c * b, u + w], [-c * e, u]]), right = `-${c}${u}(${pn([[a, u], [b, w], [e, '']])})`;
      return facPick(d, '다음 식을 인수분해한 것으로 옳은 것은?', target, right, [
        [`-${c}(${pn([[a, u + '^2'], [b, u + w], [e, u]])})`, 'incomplete'], [`-${u}(${pn([[c * a, u], [c * b, w], [c * e, '']])})`, 'incomplete'],
        `-${c}${u}(${pn([[a, u], [-b, w], [-e, '']])})`, `-${c}${u}(${pn([[a, u], [b, w], [-e, '']])})`, `${c}${u}(${pn([[-a, u], [b, w], [e, '']])})`
      ], { count: 3, rule: 'mono-three', explain: `세 항의 공통인수는 ${xh(`-${c}${u}`)}이다. −를 묶어 내면 괄호 안 모든 항의 부호가 바뀐다. ${xh(target)} = ${xh(right)}이다.` });
    }, { count: 2 }),
    T('fac-common-poly', '공통인수가 다항식인 인수분해', '①41', (d, n) => {
      if (n === 0) {
        // u(A) ± k(A) = (A)(u ± k), A 는 두 문자의 일차식
        const [p, k, s] = [d.int(1, 4), d.int(1, 5), d.pick([1, -1])], A = lin2(1, -p, 'a', 'b'), v = d.pick(['x', 'y']);
        const target = `${v}(${A})${s < 0 ? '-' : '+'}${k === 1 ? '' : k}(${A})`, right = `(${A})(${v}${sg(s * k)})`;
        return facPick(d, '다음 식을 인수분해한 것으로 옳은 것은?', target, right, [`${v}(${A})`, `(${A})(${v}${sg(-s * k)})`, `(${lin2(1, p, 'a', 'b')})(${v}${sg(s * k)})`, `${v}(${A})${sg(s * k)}`, `(${lin2(-1, p, 'a', 'b')})(${v}${sg(s * k)})`], {
          rule: 'poly-common', explain: `공통인수 ${xh(A)}를 한 덩어리로 보고 묶어 낸다. ${xh(target)} = ${xh(right)}이다.`
        });
      }
      // a(x − y) + kb(y − x) = (x − y)(a − ㈎), ab(a − b) − kab² = ab(a − ㈎)
      const k = d.int(1, 4), first = d.bool();
      const left = first ? `a(x-y)+${k === 1 ? '' : k}b(y-x)` : `ab(a-b)-${k === 1 ? '' : k}ab^2`, shown = first ? `(x-y)(a-㈎)` : `ab(a-㈎)`;
      const fill = (s) => (first ? `(x-y)(a-(${s}))` : `ab(a-(${s}))`), right = first ? `${k === 1 ? '' : k}b` : `${k + 1}b`;
      const pool = d.shuffle([first ? `${k + 1}b` : `${k}b`, first ? `-${k === 1 ? '' : k}b` : `-${k + 1}b`, `${k === 1 ? '' : k}a`, 'b-a', first ? `${k + 2}b` : `${k + 2}b`].filter((s) => s !== right && !same(xv(fill(s)), xv(left)))).slice(0, 4);
      const rows = d.shuffle([right].concat(pool)), truth = rows.map((s) => same(xv(fill(s)), xv(left))), at = truth.indexOf(true);
      const shownH = first ? `(${V('x')} <i>${MINUS}</i> ${V('y')})(${V('a')} <i>${MINUS}</i> ${box('㈎')})` : `${V('a')}${V('b')}(${V('a')} <i>${MINUS}</i> ${box('㈎')})`;
      void shown;
      return C(`다음 등식에서 ㈎에 알맞은 식은?`, rows.map(xh), at, {
        figure: ex(xe(left) + ' <i>=</i> ' + shownH),
        explain: first ? `${xh('y-x')} = ${xh('-(x-y)')}이므로 ${xh(left)} = ${xh(`(x-y)(a-${right})`)}이다.` : `공통인수 ${xh('ab')}를 묶어 내면 ${xh(left)} = ${xh(`ab(a-b-${k === 1 ? '' : k}b)`)} = ${xh(`ab(a-${right})`)}이다.`,
        facts: { truth, want: true, rule: 'poly-fill' }
      });
    }, { count: 2 }),
    T('fac-common-two', '두 다항식의 공통인수(공통인수로 묶은 뒤)', '①42', (d) => {
      if (d.bool()) {
        // a(a + kb), b(a + kb) 꼴: 단항식 인수가 다르고 일차식 인수가 같다.
        const k = nz(d, -6, 6), m = d.int(1, 3), Fv = lin2(1, k, 'a', 'b');
        const P1 = `${m === 1 ? '' : m}a(${Fv})`, P2 = `${d.int(1, 4)}b(${Fv})`.replace(/^1b/, 'b');
        const ok = (s) => { const Fx = xv(s); return Fx.length === 1 ? xv(P1).every((t) => (t.e.a || 0) >= (Fx[0].e.a || 0) && (t.e.b || 0) >= (Fx[0].e.b || 0)) && xv(P2).every((t) => (t.e.a || 0) >= (Fx[0].e.a || 0) && (t.e.b || 0) >= (Fx[0].e.b || 0)) : linDivides(xv(P1), Fx, 'a') && linDivides(xv(P2), Fx, 'a'); };
        // 바른 인수의 −1 배처럼 함께 인수가 되는 것은 보기에서 뺀다.
        const others = d.shuffle(['a', 'b', lin2(1, -k, 'a', 'b'), lin2(k, 1, 'a', 'b'), 'ab', lin2(2, k, 'a', 'b')].filter((s, i, all) => all.indexOf(s) === i && s !== Fv && !ok(s))).slice(0, 4);
        const rows = d.shuffle([Fv].concat(others)), truth = rows.map(ok), at = truth.indexOf(true);
        return C(`두 다항식 ${pt(xv(P1))}, ${pt(xv(P2))}에 공통으로 들어 있는 인수는?`, rows.map(xh), at, {
          explain: `${pt(xv(P1))} = ${xh(P1)}, ${pt(xv(P2))} = ${xh(P2)}이므로 공통으로 들어 있는 인수는 ${xh(Fv)}이다.`, facts: { truth, want: true, rule: 'common-two-mono' }
        });
      }
      // a² − k², a²b + kab: 한쪽은 제곱의 차
      const k = d.int(1, 6), P1 = `a^2-${k * k}`, P2 = `a^2b+${k}ab`, Fv = `a+${k}`;
      const rows = d.shuffle([Fv, `a-${k}`, 'a', 'b', 'ab']), truth = rows.map((s) => { const Fx = xv(s); return Fx.length === 1 ? xv(P1).every((t) => (t.e.a || 0) >= (Fx[0].e.a || 0) && (t.e.b || 0) >= (Fx[0].e.b || 0)) && xv(P2).every((t) => (t.e.a || 0) >= (Fx[0].e.a || 0) && (t.e.b || 0) >= (Fx[0].e.b || 0)) : linDivides(xv(P1), Fx, 'a') && linDivides(xv(P2), Fx, 'a'); }), at = truth.indexOf(true);
      return C(`두 다항식 ${xh(P1)}, ${xh(P2)}에 공통으로 들어 있는 인수는?`, rows.map(xh), at, {
        explain: `${xh(P1)} = ${xh(`(a+${k})(a-${k})`)}, ${xh(P2)} = ${xh(`ab(a+${k})`)}이므로 공통으로 들어 있는 인수는 ${xh(Fv)}이다.`, facts: { truth, want: true, rule: 'common-two-square' }
      });
    }),
    T('fac-common-formula', '두 다항식의 공통인수(인수분해 공식으로)', '①43', (d) => {
      // P1 = (mx + n)(x + q), P2 = (mx + n)(rx + s)
      const [m, n2, q, r, s] = d.until(() => [d.pick([1, 1, 2, 3]), nz(d, -6, 6), nz(d, -7, 7), d.int(1, 4), nz(d, -7, 7)], ([mm, nn, qq, rr, ss]) => gcd(mm, Math.abs(nn)) === 1 && gcd(rr, Math.abs(ss)) === 1 && qq * mm !== nn && ss * mm !== nn * rr && !(rr === 1 && ss === qq) && nn !== -qq * mm && ss * mm !== -nn * rr && ss !== -qq * rr);
      const Fv = lin(m, n2), P1 = xv(`(${Fv})(${lin(1, q)})`), P2 = xv(`(${Fv})(${lin(r, s)})`);
      const opts = [Fv, lin(1, q), lin(r, s), lin(m, -n2), lin(1, -q)].filter((v, i, all) => all.indexOf(v) === i);
      const rows = d.until(() => d.shuffle(opts).slice(0, 5), (list) => list.includes(Fv) && list.length >= 4), truth = rows.map((v) => uDivides(P1, xv(v)) && uDivides(P2, xv(v))), at = truth.indexOf(true);
      return C(`두 다항식 ${pt(P1)}, ${pj(P2, '을/를')} 각각 인수분해할 때, 공통으로 들어 있는 인수는?`, rows.map(xh), at, {
        explain: `${pt(P1)} = ${facH([[m, n2], [1, q]])}, ${pt(P2)} = ${facH([[m, n2], [r, s]])}이므로 공통인 인수는 ${xh(Fv)}이다.`, facts: { truth, want: true }
      });
    }),
    T('fac-has-factor', '주어진 일차식을 인수로 갖는 것 고르기', '①44', (d, n) => {
      if (n === 0) {
        const r = nz(d, -5, 5), Fv = lin(1, -r), mkQ = () => { const [a, b] = [d.int(1, 3), nz(d, -7, 7)]; return gcd(a, Math.abs(b)) === 1 ? `(${lin(a, b)})(${lin(1, nz(d, -6, 6))})` : null; };
        const good = `(${Fv})(${lin(d.int(1, 3), nz(d, -7, 7))})`;
        const rows = d.until(() => [good, mkQ(), mkQ(), mkQ(), mkQ()], (list) => list.every(Boolean) && list.slice(1).every((s) => !uDivides(xv(s), xv(Fv))) && new Set(list.map((s) => srcOfP(xv(s)))).size === 5);
        const shown = d.shuffle(rows), truth = shown.map((s) => uDivides(xv(s), xv(Fv))), at = truth.indexOf(true);
        return C(`다음 중 ${xj(Fv, '을/를')} 인수로 갖는 것은?`, shown.map((s) => pt(xv(s))), at, {
          explain: shown.map((s) => `${pt(xv(s))} = ${xh(s)}`).join(', ') + `이므로 ${xj(Fv, '을/를')} 인수로 갖는 것은 ${pt(xv(shown[at]))}이다.`, facts: { truth, want: true, rule: 'has-factor' }
        });
      }
      // x + y 를 인수로 갖지 않는 것
      const goodForms = [() => '(x+y)^2', () => '(x+y)(x-y)', () => `(x+y)(x${sg(d.pick([2, 3, 4, 5, -2, -3, -4]), 'y')})`, () => `(x+y)(${d.int(2, 3)}x${sg(nz(d, -5, 5), 'y')})`];
      const bad = `(x${sg(d.pick([2, 3, -2, -3]), 'y')})(x${sg(d.pick([-1, 2, -2, 3]), 'y')})`;
      const rows = d.until(() => d.shuffle(goodForms).map((f) => f()).concat([bad]), (list) => list.slice(0, 4).every((s) => linDivides(xv(s), xv('x+y'), 'x')) && !linDivides(xv(list[4]), xv('x+y'), 'x') && new Set(list.map((s) => srcOfP(xv(s)))).size === 5);
      const shown = d.shuffle(rows), truth = shown.map((s) => !linDivides(xv(s), xv('x+y'), 'x')), at = truth.indexOf(true);
      return C(`다음 중 ${xj('x+y', '을/를')} 인수로 갖지 않는 것은?`, shown.map((s) => pt(xv(s))), at, {
        explain: shown.map((s) => `${pt(xv(s))} = ${xh(s)}`).join(', ') + `이므로 ${xj('x+y', '을/를')} 인수로 갖지 않는 것은 ${pt(xv(shown[at]))}이다.`, facts: { truth, want: true, rule: 'not-has-factor' }
      });
    }, { count: 2 }),
    T('fac-two-factors', '한 다항식의 인수 둘 고르기', '①45', (d) => {
      const [a, b, c, e] = d.until(() => [d.int(2, 3), nz(d, -5, 5), d.int(2, 4), nz(d, -6, 6)], ([p, q, r, s]) => gcd(p, Math.abs(q)) === 1 && gcd(r, Math.abs(s)) === 1 && p * s + q * r !== 0 && !(p === r && q === s) && p * s !== -q * r);
      const P = xv(`(${lin(a, b)})(${lin(c, e)})`), list = d.shuffle([lin(a, b), lin(c, e), lin(a, -b), lin(c, -e)]);
      const good = list.map((s, i) => (uDivides(P, xv(s)) ? i : -1)).filter((i) => i >= 0);
      const pairs = [];
      for (let i = 0; i < 4; i += 1) for (let j = i + 1; j < 4; j += 1) pairs.push([i, j]);
      const right = combo(good), opts = d.shuffle(pairs.map(combo).filter((s) => s !== right)).slice(0, 4).concat([right]), rows = d.shuffle(opts), at = rows.indexOf(right);
      return C(`다음 &lt;보기&gt; 중 ${pt(P)}의 인수를 모두 고른 것은?`, rows, at, {
        figure: xtagged(list, HANGUL), explain: `${pt(P)} = ${facH([[a, b], [c, e]])}이므로 인수는 ${list.filter((s, i) => good.includes(i)).map(xh).join(', ')}이다.`,
        facts: { truth: rows.map((s) => s === right), want: true }
      });
    })
  ];

  // ── 인수분해 공식 ──
  const fformulaTypes = [
    T('ff-square', 'a² ± 2ab + b²의 인수분해', '①46', (d) => {
      const [u, w] = pairOf(d), [a, b] = d.until(() => [d.int(2, 6), nz(d, -7, 7)], ([p, q]) => gcd(p, Math.abs(q)) === 1);
      const P = xv(`(${lin2(a, b, u, w)})^2`);
      return inline(FACTOR + noteUW(u), grp(`({0}${V(u)} {1}${V(w)})${sup(2)}`), [{ answer: a }, { answer: b, signed: true }], {
        shown: nb(`(${ph(xv(lin2(a, b, u, w)))})${sup(2)}`), figure: ex(ph(P, true)),
        explain: `${pt(P)} = ${nb(`(${a}${V(u)})${sup(2)} ${b < 0 ? MINUS : '+'} 2 × ${a}${V(u)} × ${Math.abs(b) === 1 ? '' : Math.abs(b)}${V(w)} + (${Math.abs(b) === 1 ? '' : Math.abs(b)}${V(w)})${sup(2)}`)} = ${nb(`(${ph(xv(lin2(a, b, u, w)))})${sup(2)}`)}이다.`,
        facts: { factor: { poly: srcOfP(P), form: '(au+bw)^2', answer: [a, b] } }
      });
    }),
    T('ff-diff', 'a² − b²의 인수분해', '①47', (d) => {
      const [u, w] = pairOf(d), [a, b] = d.until(() => [d.int(1, 7), d.int(1, 9)], ([p, q]) => gcd(p, q) === 1 && p * q > 1);
      const P = xv(`${a * a}${u}^2-${b * b}${w}^2`);
      // 두 괄호의 부호를 함께 바꾼 답도 같은 식이 되므로, 앞 괄호의 + 는 적어 두고 뒤 괄호의 부호만 받는다.
      return inline(FACTOR + noteUW(u), grp(`({0}${V(u)} + {1}${V(w)})`) + grp(`({2}${V(u)} {3}${V(w)})`), [{ answer: a }, { answer: b }, { answer: a }, { answer: -b, signed: true }], {
        shown: nb(`(${ph(xv(lin2(a, b, u, w)))})(${ph(xv(lin2(a, -b, u, w)))})`), figure: ex(ph(P, true)),
        explain: `${pt(P)} = ${nb(`(${a === 1 ? '' : a}${V(u)})${sup(2)} − (${b === 1 ? '' : b}${V(w)})${sup(2)}`)} = ${nb(`(${ph(xv(lin2(a, b, u, w)))})(${ph(xv(lin2(a, -b, u, w)))})`)}이다.`,
        facts: { factor: { poly: srcOfP(P), form: '(au+bw)(au-bw)', answer: [a, b, a, -b] } }
      });
    }),
    T('ff-sumprod', '곱과 합이 주어진 두 정수', '①48', (d) => {
      const [p, q] = d.until(() => [nz(d, -9, 9), nz(d, -9, 9)], ([x, y]) => x !== y && x + y !== 0);
      return slots(`곱이 ${tx(Q(p * q))}이고 합이 ${tx(Q(p + q))}인 두 정수는?`, [['', p, null], ['', q, null]], {
        unordered: true, check: { kind: 'sum-product', product: p * q, sum: p + q },
        explain: `곱이 ${tx(Q(p * q))}인 두 정수 가운데 합이 ${tx(Q(p + q))}인 것은 ${tj0(p, '과/와')} ${tx(Q(q))}이다.`
      });
    }),
    T('ff-xab', 'x² + (a + b)x + ab의 인수분해', '①49', (d) => {
      const [p, q] = d.until(() => [nz(d, -9, 9), nz(d, -9, 9)], ([x, y]) => x !== y && x + y !== 0);
      const P = xv(`(x${sg(p)})(x${sg(q)})`);
      return facX(FACTOR, p, q, { poly: srcOfP(P), figure: ex(ph(P, true)), explain: `곱이 ${tx(Q(p * q))}, 합이 ${tx(Q(p + q))}인 두 정수는 ${tx(Q(p))}, ${tx(Q(q))}이므로 ${pt(P)} = ${facH([[1, p], [1, q]])}이다.` });
    }),
    T('ff-acx', 'acx² + (ad + bc)x + bd의 인수분해', '①50', (d) => {
      const [a, b, c, e] = d.until(() => [d.int(1, 4), nz(d, -7, 7), d.int(2, 6), nz(d, -7, 7)], ([p, q, r, s]) => gcd(p, Math.abs(q)) === 1 && gcd(r, Math.abs(s)) === 1 && p * s + q * r !== 0 && !(p === r && q === s));
      const P = xv(`(${lin(a, b)})(${lin(c, e)})`);
      return facAC(FACTOR, a, b, c, e, { poly: srcOfP(P), figure: ex(ph(P, true)), explain: `${V('x')}${sup(2)}의 계수 ${a * c}, 상수항 ${tj0(b * e, '이/가')} 되는 두 일차식을 찾아 대각선으로 곱한 합이 ${tx(Q(a * e + b * c))}인 것을 고른다. ${pt(P)} = ${facH([[a, b], [c, e]])}이다.` });
    }),
    T('ff-cross', '십자 그림의 빈칸 채우기', '①51', (d) => {
      const [a, b, c, e] = d.until(() => [d.int(1, 3), nz(d, -5, 5), d.int(2, 5), nz(d, -5, 5)], ([p, q, r, s]) => gcd(p, Math.abs(q)) === 1 && gcd(r, Math.abs(s)) === 1 && p * s + q * r !== 0 && p !== r && p * s !== q * r);
      const P = xv(`(${lin(a, b)})(${lin(c, e)})`), AC = a * c, BD = b * e;
      return slots(`다음은 ${xj(srcOfP(P), '을/를')} 인수분해하는 과정을 나타낸 십자 그림이다. ㉠, ㉡에 알맞은 수는?`, [['㉠', c, `${AC}/${a}`], ['㉡', e, `${jn(BD)}/${jn(b)}`]], {
        figure: crossFig(a, b, c, e, { c: '㉠', d: '㉡' }),
        explain: `${a} × ㉠ = ${AC}에서 ㉠ = ${c}, (${tx(Q(b))}) × ㉡ = ${tx(Q(BD))}에서 ㉡ = ${tx(Q(e))}이다. 대각선으로 곱한 합 ${tx(Q(b * c))} + (${tx(Q(a * e))}) = ${tj0(a * e + b * c, '이/가')} 일차항의 계수와 같으므로 ${pt(P)} = ${facH([[a, b], [c, e]])}이다.`
      });
    }),
    T('ff-common-then', '공통인수로 묶은 뒤 공식으로 인수분해하기', '①52', (d, n) => {
      const k = d.pick([2, 3, 4, 5, -2, -3, -4]);
      const [p, q] = n === 0 ? (() => { const m = d.int(1, 9); return [m, -m]; })() : d.until(() => [nz(d, -7, 7), nz(d, -7, 7)], ([x, y]) => x !== y && x + y !== 0);
      const P = xv(`${k}(x${sg(p)})(x${sg(q)})`);
      return inline(FACTOR, '{0}' + grp('(x {1})') + grp('(x {2})'), [{ answer: k, signed: true }, { answer: p, signed: true }, { answer: q, signed: true }], {
        blocks: [[1], [2]], shown: facH([[1, p], [1, q]], k), figure: ex(ph(P, true)),
        explain: `먼저 공통인수 ${tj0(k, '을/를')} 묶어 내면 ${pt(P)} = ${nb(`${tx(Q(k))}(${ph(xv(`(x${sg(p)})(x${sg(q)})`))})`)}이고, 괄호 안을 다시 인수분해하면 ${facH([[1, p], [1, q]], k)}이다.`,
        facts: Object.assign({ factor: { poly: srcOfP(P), form: 'k(x+p)(x+q)', answer: [k, p, q] } }, { rule: n === 0 ? 'common-diff' : 'common-xab' })
      });
    }, { count: 2 }),
    T('ff-claims', '인수분해가 옳은 것 고르기', '①53', (d, n) => {
      const [a, b, c, e, h] = [d.int(2, 6), d.int(2, 5), d.int(2, 9), d.int(2, 5), d.int(1, 4)], [f, g] = d.until(() => [d.int(2, 4), d.int(2, 7)], ([x, y]) => gcd(x, y) === 1);
      // [처음 식, 바른 인수분해, 틀린 인수분해, 틀린 까닭] — 틀린 것은 전개하면 다르거나 덜 묶은 것
      const pool = [
        [`x^2+${a + b}x+${a * b}`, `(x+${a})(x+${b})`, `(x-${a})(x-${b})`, '곱이 양수이고 합이 양수인 두 수는 모두 양수이다.'],
        [`x^2-${c * c}y^2z^2`, `(x+${c}yz)(x-${c}yz)`, `(x-${c}yz)^2`, '제곱의 차는 합과 차의 곱으로 인수분해한다.'],
        [`x^2-${c * c}x`, `x(x-${c * c})`, `(x+${c})(x-${c})`, `두 항의 공통인수는 ${V('x')}이다.`],
        [`x^4+x^3+${e}x^2`, `x^2(x^2+x+${e})`, `x(x^3+x^2+${e}x)`, `공통인수 ${V('x')}${sup(2)}을 남김없이 묶어야 한다.`],
        [`${f * f}x^2-${2 * f * g}xy+${g * g}y^2`, `(${f}x-${g}y)^2`, `(${f}x+${g}y)^2`, '가운데 항이 음수이므로 괄호 안의 부호는 −이다.'],
        [`x^2y-${h === 1 ? '' : h}xy^2`, `xy(x-${h === 1 ? '' : h}y)`, `xy(x+${h === 1 ? '' : h}y)`, `공통인수 ${V('x')}${V('y')}를 묶어 내면 괄호 안은 ${xh(`x-${h === 1 ? '' : h}y`)}이다.`]
      ];
      const picked = d.shuffle(pool).slice(0, 5), at = d.int(0, 4), wantTrue = n === 0;
      const rows = picked.map((r, i) => { const wrong = (i === at) !== wantTrue; return { l: r[0], shown: wrong ? r[2] : r[1], good: r[1], why: r[3], ok: !wrong }; });
      // 참·거짓은 전개해 보고(같은가) 덜 묶은 것인가(넷째 줄)를 따로 셈한다.
      const truth = rows.map((r) => same(xv(r.l), xv(r.shown)) && !/^x\(x\^3/.test(r.shown));
      if (truth.filter((t) => t === wantTrue).length !== 1 || truth[at] !== wantTrue) throw new Error('참·거짓이 어긋난다');
      const line = (r, s) => xh(r.l) + ' = ' + xh(s);
      return C(wantTrue ? '다음 중 인수분해가 옳은 것은?' : '다음 중 인수분해가 옳지 않은 것은?', rows.map((r) => line(r, r.shown)), at, {
        explain: wantTrue ? '나머지를 바르게 고치면 ' + rows.filter((r, i) => i !== at).map((r) => line(r, r.good)).join(', ') + '이다.' : `${rows[at].why} 바르게 고치면 ${line(rows[at], rows[at].good)}이다.`,
        facts: { truth, want: wantTrue, rule: wantTrue ? 'ff-claims-true' : 'ff-claims-false' }
      });
    }, { count: 2 }),
    T('ff-repeat', '제곱의 차를 거듭 써서 인수분해하기', '①54', (d) => {
      if (d.bool()) {
        const target = 'x^8-y^8', right = '(x^4+y^4)(x^2+y^2)(x+y)(x-y)';
        return facPick(d, '다음 식을 인수분해한 것은?', target, right, [['(x^4+y^4)(x^4-y^4)', 'incomplete'], '(x^4-y^4)(x^2+y^2)(x+y)(x-y)', '(x^4+y^4)(x^2-y^2)(x+y)(x-y)', '(x^2+y^2)(x+y)^2(x-y)^2', '(x^4+y^4)(x^2+y^2)(x+y)^2'], {
          explain: `${xh(target)} = ${xh('(x^4+y^4)(x^4-y^4)')} = ${xh('(x^4+y^4)(x^2+y^2)(x^2-y^2)')} = ${xh(right)}이다.`
        });
      }
      const a = d.int(1, 3), a2 = a * a, a4 = a2 * a2, target = `x^4-${a4}`, right = `(x^2+${a2})(x+${a})(x-${a})`;
      return facPick(d, '다음 식을 인수분해한 것은?', target, right, [[`(x^2+${a2})(x^2-${a2})`, 'incomplete'], `(x^2-${a2})(x+${a})(x-${a})`, `(x+${a})^2(x-${a})^2`, `(x^2+${a2})(x+${a})^2`, `(x^2+${a2})(x-${a})^2`], {
        explain: `${xh(target)} = ${xh(`(x^2+${a2})(x^2-${a2})`)}이고 ${xj(`x^2-${a2}`, '은/는')} 다시 인수분해되므로 ${xh(right)}이다.`
      });
    })
  ];

  // ── 완전제곱식 ──
  const squareTypes = [
    T('sq-const', '완전제곱식이 되는 상수항', '①56', (d) => {
      const b = 2 * nz(d, -9, 9), two = d.bool(), src = two ? `x^2${sg(b, 'xy')}+?y^2` : `x^2${sg(b, 'x')}+?`;
      return numQ1('다음 식이 완전제곱식이 되도록 □ 안에 알맞은 수는?', (b / 2) * (b / 2), {
        figure: xex(src), calc: `(${jn(b)}/2)*(${jn(b)}/2)`, unseen: [2],
        explain: `${two ? V('x') + V('y') : V('x')}의 계수의 ${frac(1, 2)}을 제곱한 수이므로 □ = (${tx(Q(b, 2))})${sup(2)} = ${(b / 2) * (b / 2)}이다.`
      });
    }),
    T('sq-mid', '완전제곱식이 되는 가운데 항의 계수', '①57', (d) => {
      const [a, b] = d.until(() => [d.int(1, 5), d.int(1, 7)], ([p, q]) => p * q > 1 && gcd(p, q) === 1), two = d.bool(), m = 2 * a * b;
      const src = two ? `${a * a === 1 ? '' : a * a}x^2+?xy+${b * b}y^2` : `${a * a === 1 ? '' : a * a}x^2+?x+${b * b}`;
      const opts = d.shuffle([`±${m}`, String(m), `${MINUS}${m}`, `±${a * b}`, `±${2 * a * a * b * b}`].filter((s, i, all) => all.indexOf(s) === i));
      const rows = opts.slice(0, 5), at = rows.indexOf(`±${m}`);
      return C('다음 식이 완전제곱식이 되도록 □ 안에 알맞은 수를 모두 구한 것은?', rows, at, {
        figure: xex(src), explain: `${nb(`(${a === 1 ? '' : a}${V('x')} ± ${b}${two ? V('y') : ''})${sup(2)}`)}이 되어야 하므로 □ = ±2 × ${a} × ${b} = ±${m}이다.`,
        facts: { truth: rows.map((s, i) => i === at), want: true }
      });
    }),
    T('sq-param', '일차항의 계수에 문자가 든 완전제곱식', '①58', (d) => {
      const [A, Cc, m] = d.until(() => [d.pick([1, 1, 2, 3]), d.int(2, 7), nz(d, -6, 6)], ([a, c]) => gcd(a, c) === 1), two = d.bool(), mid = 2 * A * Cc;
      const src = `${A * A === 1 ? '' : A * A}x^2+(p${sg(m)})x${two ? 'y' : ''}+${Cc * Cc}${two ? 'y^2' : ''}`, p1 = mid - m, p2 = -mid - m;
      return inline(`${xj(src, '이/가')} 완전제곱식이 될 때, 수 ${V('p')}의 값을 모두 구하시오.`, `${V('p')} = {0} 또는 ${V('p')} = {1}`, [{ answer: p1, signed: true }, { answer: p2, signed: true }], {
        unordered: true, shown: `${V('p')} = ${tx(Q(p1))} 또는 ${V('p')} = ${tx(Q(p2))}`,
        explain: `${nb(`(${A === 1 ? '' : A}${V('x')} ± ${Cc}${two ? V('y') : ''})${sup(2)}`)}이 되어야 하므로 ${V('p')} ${m < 0 ? MINUS : '+'} ${Math.abs(m)} = ±${mid}, ${V('p')} = ${tx(Q(p1))} 또는 ${V('p')} = ${tx(Q(p2))}이다.`,
        facts: { check: { kind: 'square-param', A, C: Cc, m } }
      });
    }),
    T('sq-two', '두 식이 모두 완전제곱식이 되는 수', '①59', (d) => {
      const k = 2 * nz(d, -8, 8), [r, t] = d.until(() => [d.int(1, 6), d.int(1, 4)], ([x, y]) => gcd(x, y) === 1), q = 2 * r * t, r2 = r * r;
      return slots(`다음 두 식이 모두 완전제곱식이 될 때, 두 수 ${V('A')}, ${V('B')}의 값은?`, [[eqLabel('A'), (k / 2) * (k / 2), `(${jn(k)}/2)*(${jn(k)}/2)`], [eqLabel('B'), t * t, `${q}*${q}/(4*${r2})`]], {
        figure: ex(xe(`x^2${sg(k, 'x')}+A`) + ', &nbsp;' + xe(`Bx^2-${q}x+${r2}`)), unseen: [2, 4],
        explain: `${V('A')} = (${tx(Q(k, 2))})${sup(2)} = ${(k / 2) * (k / 2)}이다. ${nb(`${V('B')}${V('x')}${sup(2)} − ${q}${V('x')} + ${r2} = (${V('m')}${V('x')} − ${r})${sup(2)}`)}이라 하면 2 × ${V('m')} × ${r} = ${q}에서 ${V('m')} = ${t}이므로 ${V('B')} = ${t * t}이다.`
      });
    }),
    T('sq-max', '□ 안의 수가 가장 큰 것 고르기', '①60', (d) => {
      const rows = d.until(() => {
        const [b1, a2, b2, a3, b4, b5] = [d.int(2, 9), d.int(2, 4), d.int(2, 7), d.int(2, 5), d.int(2, 9), d.int(3, 10)];
        return d.shuffle([
          [`x^2-${2 * b1}x+?`, b1 * b1], [`${a2 * a2}x^2-?x+${b2 * b2}`, 2 * a2 * b2], [`${a3 * a3}x^2+?x+1`, 2 * a3], [`x^2+${2 * b4}x+?`, b4 * b4], [`x^2-?x+${b5 * b5}`, 2 * b5]
        ]);
      }, (list) => { const vs = list.map((r) => r[1]), hi = Math.max(...vs); return vs.filter((v) => v === hi).length === 1; });
      const vs = rows.map((r) => r[1]), at = vs.indexOf(Math.max(...vs));
      return C('다음 식이 완전제곱식이 되도록 □ 안에 알맞은 양수를 넣을 때, □ 안의 수가 가장 큰 것은?', rows.map((r) => xh(r[0])), at, {
        explain: rows.map((r) => `${xh(r[0])}에서 □ = ${r[1]}`).join(', ') + '이다.', facts: { truth: vs.map((v, i) => i === at), want: true }
      });
    }),
    T('sq-lead', '이차항의 계수가 1이 아닌 완전제곱식', '①61', (d, n) => {
      if (n === 0) {
        // k(ax + b)² = L x² + M x + □
        const [k, a, b] = d.until(() => [d.int(2, 3), d.int(1, 3), d.int(1, 5)], ([kk, aa, bb]) => gcd(aa, bb) === 1 && kk * bb * bb <= 99);
        const L = k * a * a, Mm = 2 * k * a * b;
        return numQ1(`${xj(`${L}x^2+${Mm}x+?`, '이/가')} 완전제곱식이 될 때, □ 안에 알맞은 수는?`.replace('□가', '□가'), k * b * b, {
          calc: `${Mm}*${Mm}/(4*${L})`, unseen: [4], rule: 'lead-const',
          explain: `${nb(`${L}${V('x')}${sup(2)} + ${Mm}${V('x')} + □ = ${k}(${a * a === 1 ? '' : a * a}${V('x')}${sup(2)} + ${2 * a * b}${V('x')} + □ ÷ ${k})`)}이고 괄호 안이 ${nb(`(${a === 1 ? '' : a}${V('x')} + ${b})${sup(2)}`)}이어야 하므로 □ = ${k} × ${b * b} = ${k * b * b}이다.`
        });
      }
      // (ax + b)(ax + c) + k
      const [a, b, c] = d.until(() => [d.int(1, 3), nz(d, -6, 6), nz(d, -6, 6)], ([, bb, cc]) => bb !== cc && (bb - cc) % 2 === 0);
      const k = ((b - c) / 2) ** 2, src = `(${lin(a, b)})(${lin(a, c)})+k`;
      return numQ1(`${xj(src, '이/가')} 완전제곱식이 될 때, 수 ${V('k')}의 값은?`, k, {
        calc: `(${jn(b)}-${jn(c)})*(${jn(b)}-${jn(c)})/4`, unseen: [4], rule: 'lead-plus',
        explain: `전개하면 ${pt(xv(`(${lin(a, b)})(${lin(a, c)})`))} + ${V('k')}이다. ${nb(`(${a === 1 ? '' : a}${V('x')} ${b + c < 0 ? MINUS : '+'} ${Math.abs(b + c) / 2})${sup(2)}`)}의 상수항이 ${((b + c) / 2) ** 2}이므로 ${tx(Q(b * c))} + ${V('k')} = ${((b + c) / 2) ** 2}, ${V('k')} = ${k}이다.`
      });
    }, { count: 2 })
  ];

  // ── 여러 가지 인수분해 ──
  const complexTypes = [
    T('cx-expand', '전개한 뒤 인수분해하기', '①62', (d) => {
      const [p, q, a] = d.until(() => [nz(d, -8, 8), nz(d, -8, 8), nz(d, -8, 8)], ([x, y, z]) => x !== y && x + y !== 0 && z !== x && z !== y && x + y - z !== 0 && x * y - z * (x + y - z) !== 0 && Math.abs(x + y - z) <= 9);
      const b = p + q - a, k = p * q - a * b, src = `(x${sg(a)})(x${sg(b)})${sg(k)}`;
      return facX(FACTOR, p, q, { poly: srcOfP(xv(src)), figure: xex(src), explain: `전개하여 정리하면 ${xh(src)} = ${pt(xv(src))} = ${facH([[1, p], [1, q]])}이다.` });
    }),
    T('cx-sub-shift', '공통부분을 한 문자로 놓고 인수분해하기', '①63', (d) => {
      const [c, r1, r2] = d.until(() => [nz(d, -5, 5), nz(d, -6, 6), nz(d, -6, 6)], ([cc, a, b]) => a !== b && a + b !== 0 && cc - a !== 0 && cc - b !== 0 && cc - a !== cc - b && 2 * cc - a - b !== 0);
      const m = -(r1 + r2), n2 = r1 * r2, A = `(x${sg(c)})`, src = `${A}^2${m === 0 ? '' : (m < 0 ? '-' : '+') + (Math.abs(m) === 1 ? '' : Math.abs(m)) + A}${sg(n2)}`;
      const p = c - r1, q = c - r2;
      return facX(FACTOR, p, q, { poly: srcOfP(xv(src)), figure: xex(src), explain: `${xh(`x${sg(c)}`)} = ${V('A')}라 하면 ${nb(`${V('A')}${sup(2)} ${m < 0 ? MINUS : '+'} ${Math.abs(m) === 1 ? '' : Math.abs(m)}${V('A')} ${n2 < 0 ? MINUS : '+'} ${Math.abs(n2)}`)} = ${nb(`(${V('A')} ${r1 > 0 ? MINUS : '+'} ${Math.abs(r1)})(${V('A')} ${r2 > 0 ? MINUS : '+'} ${Math.abs(r2)})`)}이고, ${V('A')}를 되돌리면 ${facH([[1, p], [1, q]])}이다.` });
    }),
    T('cx-sub-xy', '두 문자의 공통부분으로 인수분해한 인수 고르기', '①63의 변형', (d) => {
      const [k, r1, r2] = d.until(() => [nz(d, -3, 3), nz(d, -7, 7), nz(d, -7, 7)], ([, a, b]) => a !== b && a + b !== 0 && a !== -b);
      // A(A + m) + n = (A + r1)(A + r2), A = x + ky
      const A = lin2(1, k, 'x', 'y'), m = r1 + r2, n2 = r1 * r2;
      const src2 = `(${A})(${A}${sg(m)})${sg(n2)}`, right = `${A}${sg(r1)}`;
      const opts = d.shuffle([`${A}${sg(-r1)}`, `${A}${sg(-r2)}`, `${lin2(1, -k, 'x', 'y')}${sg(r1)}`, `${A}${sg(m)}`, `${A}${sg(n2)}`].filter((s, i, all) => all.indexOf(s) === i && s !== right && !linDivides(xv(src2), xv(s), 'x'))).slice(0, 4);
      const rows = d.shuffle([right].concat(opts)), truth = rows.map((s) => linDivides(xv(src2), xv(s), 'x')), at = truth.indexOf(true);
      if (truth.filter(Boolean).length !== 1) throw new Error('인수가 둘');
      return C(`다음 중 ${xh(src2)}의 인수인 것은?`, rows.map(xh), at, {
        explain: `${xh(A)} = ${V('A')}라 하면 ${nb(`${V('A')}(${V('A')} ${m < 0 ? MINUS : '+'} ${Math.abs(m)}) ${n2 < 0 ? MINUS : '+'} ${Math.abs(n2)}`)} = ${nb(`(${V('A')} ${r1 < 0 ? MINUS : '+'} ${Math.abs(r1)})(${V('A')} ${r2 < 0 ? MINUS : '+'} ${Math.abs(r2)})`)}이므로 인수는 ${xh(right)}, ${xh(`${A}${sg(r2)}`)}이다.`,
        facts: { truth, want: true }
      });
    }),
    T('cx-sub-box', '치환하여 인수분해하는 과정의 빈칸', '①64', (d) => {
      const [c, u, v] = d.until(() => [d.int(1, 6), d.int(1, 7), d.int(1, 7)], ([cc, a, b]) => a !== b && a - cc !== 0 && cc + b > 0);
      const m = u - v, n2 = -u * v, A = `(x-${c})`, src = `${A}^2${m === 0 ? '' : (m < 0 ? '-' : '+') + (Math.abs(m) === 1 ? '' : Math.abs(m)) + A}${sg(n2)}`;
      const rows = [
        { h: xe(src) },
        { h: `${V('A')}${sup(2)} <i>${m < 0 ? MINUS : '+'}</i> ${Math.abs(m) === 1 ? '' : Math.abs(m)}${V('A')} <i>${n2 < 0 ? MINUS : '+'}</i> ${Math.abs(n2)}` },
        { h: `(${V('A')} <i>+</i> ${box('㉠')})(${V('A')} <i>${MINUS}</i> ${box('㉡')})` },
        { h: `(${V('x')} <i>+</i> ${box('㉢')})(${V('x')} <i>${MINUS}</i> ${box('㉣')})` }
      ];
      return slots(`다음은 ${xj(src, '을/를')} ${xh(`x-${c}`)} = ${V('A')}로 놓고 인수분해하는 과정이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?`, [['㉠', u, null], ['㉡', v, null], ['㉢', u - c, null], ['㉣', c + v, null]], {
        figure: proc(rows), check: { kind: 'sub-box', c, m, n: n2 },
        explain: `곱이 ${tx(Q(n2))}, 합이 ${tx(Q(m))}인 두 수는 ${u}, ${tx(Q(-v))}이므로 ㉠ = ${u}, ㉡ = ${v}이다. ${V('A')}를 되돌리면 ${nb(`(${V('x')} − ${c} + ${u})(${V('x')} − ${c} − ${v})`)} = ${facH([[1, u - c], [1, -(c + v)]])}이므로 ㉢ = ${tx(Q(u - c))}, ㉣ = ${c + v}이다.`
      });
    }),
    T('cx-two-blocks', '두 덩어리로 놓고 인수분해하기', '①65 심15', (d, n) => {
      if (n === 0) {
        // (x + py)² − (x + qy)² = (p − q)y(2x + (p + q)y)
        const [p, q] = d.until(() => [nz(d, -4, 4), nz(d, -4, 4)], ([a, b]) => a !== b && a + b !== 0);
        const target = `(${lin2(1, p, 'x', 'y')})^2-(${lin2(1, q, 'x', 'y')})^2`, [c1, a1, b1] = normLin(2, p + q);
        const right = `${lead(c1 * (p - q))}y(${lin2(a1, b1, 'x', 'y')})`;
        return facPick(d, '다음 식을 인수분해한 것은?', target, right, [`${lead(c1 * (q - p))}y(${lin2(a1, b1, 'x', 'y')})`, `${lead(c1 * (p - q))}y(${lin2(a1, -b1, 'x', 'y')})`, `${lead(c1 * (p - q))}x(${lin2(a1, b1, 'x', 'y')})`, `(${lin2(2, p + q, 'x', 'y')})(${lin2(0, p + q, 'x', 'y')})`, `${lead(p + q)}y(${lin2(2, p - q, 'x', 'y')})`], {
          rule: 'blocks-diff', explain: `${xh(lin2(1, p, 'x', 'y'))} = ${V('A')}, ${xh(lin2(1, q, 'x', 'y'))} = ${V('B')}라 하면 ${nb(`${V('A')}${sup(2)} − ${V('B')}${sup(2)} = (${V('A')} + ${V('B')})(${V('A')} − ${V('B')})`)}이고, 되돌려 정리하면 ${xh(right)}이다.`
        });
      }
      // (a1 A + b1 B)(a2 A + b2 B), A = x + sy, B = x + ty 로 놓은 이차식
      const [s, t, a1, b1, a2, b2] = d.until(() => [nz(d, -3, 3), nz(d, -3, 3), d.int(1, 2), nz(d, -3, 3), 1, nz(d, -4, 4)], ([ss, tt, p1, q1, p2, q2]) => ss !== tt && p1 + q1 !== 0 && p2 + q2 !== 0 && p1 * ss + q1 * tt !== 0 && p2 * ss + q2 * tt !== 0 && !(p1 === p2 && q1 === q2));
      const A = lin2(1, s, 'x', 'y'), Bb = lin2(1, t, 'x', 'y'), cA = a1 * a2, cAB = a1 * b2 + b1 * a2, cB = b1 * b2;
      const target = `${lead(cA)}(${A})^2${cAB === 0 ? '' : (cAB < 0 ? '-' : '+') + (Math.abs(cAB) === 1 ? '' : Math.abs(cAB)) + `(${A})(${Bb})`}${cB < 0 ? '-' : '+'}${Math.abs(cB) === 1 ? '' : Math.abs(cB)}(${Bb})^2`;
      const f1 = normLin(a1 + b1, a1 * s + b1 * t), f2 = normLin(a2 + b2, a2 * s + b2 * t), k = f1[0] * f2[0];
      const right = `${lead(k)}(${lin2(f1[1], f1[2], 'x', 'y')})(${lin2(f2[1], f2[2], 'x', 'y')})`;
      return facPick(d, '다음 식을 인수분해한 것은?', target, right, [`${lead(-k)}(${lin2(f1[1], f1[2], 'x', 'y')})(${lin2(f2[1], f2[2], 'x', 'y')})`, `${lead(k)}(${lin2(f1[1], -f1[2], 'x', 'y')})(${lin2(f2[1], f2[2], 'x', 'y')})`, `${lead(k)}(${lin2(f1[1], f1[2], 'x', 'y')})(${lin2(f2[1], -f2[2], 'x', 'y')})`, `${lead(k)}(${lin2(f1[1], -f1[2], 'x', 'y')})(${lin2(f2[1], -f2[2], 'x', 'y')})`, `(${lin2(f1[1], f1[2], 'x', 'y')})(${lin2(f2[1], f2[2], 'x', 'y')})`], {
        count: 4, rule: 'blocks-ab', explain: `${xh(A)} = ${V('A')}, ${xh(Bb)} = ${V('B')}라 하면 주어진 식은 ${nb(`(${ph(xv(lin2(a1, b1, 'A', 'B')))})(${ph(xv(lin2(a2, b2, 'A', 'B')))})`)}이다. 되돌려 정리하면 ${xh(right)}이다.`
      });
    }, { count: 2 }),
    T('cx-diff-ab', '두 제곱의 차를 정해진 꼴로 인수분해하기', '①65의 변형', (d) => {
      const [q, a, b] = d.until(() => [d.int(1, 4), nz(d, -6, 6), nz(d, -6, 6)], ([qq, x, y]) => x + y !== 0 && x - y !== 0 && x !== y && gcd(2 * qq + 1, Math.abs(x + y)) === 1);   // 앞 괄호에 공통인수가 있으면 (7x − 21)(x − 1) 처럼 다른 정수 답이 생긴다
      const p = q + 1;
      return slots(`다음 등식을 만족시키는 정수 ${V('A')}, ${V('B')}의 값은?`, [[eqLabel('A'), a + b, `${jn(a)}+${jn(b)}`], [eqLabel('B'), a - b, `${jn(a)}-${jn(b)}`]], {
        figure: eqx(`(${lin(p, a)})^2-(${lin(q, b)})^2`, `(${p + q}x+A)(x+B)`),
        explain: `${nb(`${V('A')}${sup(2)} − ${V('B')}${sup(2)} = (${V('A')} + ${V('B')})(${V('A')} − ${V('B')})`)}이므로 좌변은 ${nb(`{(${ph(xv(lin(p, a)))}) + (${ph(xv(lin(q, b)))})}{(${ph(xv(lin(p, a)))}) − (${ph(xv(lin(q, b)))})}`)} = ${facH([[p + q, a + b], [1, a - b]])}이다. ${V('A')} = ${tx(Q(a + b))}, ${V('B')} = ${tx(Q(a - b))}이다.`
      });
    }),
    T('cx-group', '항을 둘씩 묶어 인수분해하기', '①66', (d) => {
      const [a, b] = [nz(d, -7, 7), nz(d, -7, 7)], terms = d.shuffle([[1, 'xy'], [b, 'x'], [a, 'y'], [a * b, '']]);
      if (terms[0][0] !== 1) { const i = terms.findIndex((t) => t[1] === 'xy'); [terms[0], terms[i]] = [terms[i], terms[0]]; }
      const src = pn(terms);
      return inline(FACTOR, grp(`(${V('x')} {0})`) + grp(`(${V('y')} {1})`), [{ answer: a, signed: true }, { answer: b, signed: true }], {
        shown: nb(`(${ph(xv(`x${sg(a)}`))})(${ph(xv(`y${sg(b)}`))})`), figure: xex(src),
        explain: `${V('y')}가 있는 두 항과 없는 두 항을 묶으면 ${nb(`${V('y')}(${ph(xv(`x${sg(a)}`))}) ${b < 0 ? MINUS : '+'} ${Math.abs(b)}(${ph(xv(`x${sg(a)}`))})`)} = ${nb(`(${ph(xv(`x${sg(a)}`))})(${ph(xv(`y${sg(b)}`))})`)}이다.`,
        facts: { factor: { poly: srcOfP(xv(src)), form: '(x+a)(y+b)', answer: [a, b] } }
      });
    }),
    T('cx-group-sq', '세 항을 완전제곱식으로 묶어 제곱의 차로', '①66', (d, n) => {
      if (n === 0) {
        // x² + 2ax + a² − y²: 순서를 섞어 적는다.
        const a = nz(d, -6, 6), terms = d.shuffle([[1, 'x^2'], [-1, 'y^2'], [2 * a, 'x'], [a * a, '']]);
        if (terms[0][0] !== 1) { const i = terms.findIndex((t) => t[1] === 'x^2'); [terms[0], terms[i]] = [terms[i], terms[0]]; }
        const target = pn(terms), right = `(x+y${sg(a)})(x-y${sg(a)})`;
        return facPick(d, '다음 식을 인수분해한 것은?', target, right, [`(x+y${sg(-a)})(x-y${sg(-a)})`, `(x+y${sg(a)})^2`, `(x${sg(a)})(x-y${sg(a)})`, `(x+y${sg(a)})(x+y${sg(-a)})`, `(x-y${sg(a)})^2`], {
          rule: 'group-sq-x', explain: `${xh(`x^2${sg(2 * a, 'x')}+${a * a}`)} = ${xh(`(x${sg(a)})^2`)}이므로 ${xh(target)} = ${xh(`(x${sg(a)})^2-y^2`)} = ${xh(right)}이다.`
        });
      }
      // k² − x² + 2bxy − b²y² = (k + x − by)(k − x + by)
      const [k, b] = [d.int(2, 9), d.int(1, 4)], B = b === 1 ? '' : b, target = `${k * k}-x^2+${2 * b}xy-${b * b === 1 ? '' : b * b}y^2`, right = `(${k}+x-${B}y)(${k}-x+${B}y)`;
      return facPick(d, '다음 식을 인수분해한 것은?', target, right, [`(${k}+x+${B}y)(${k}-x-${B}y)`, `(x+${B}y+${k})(x+${B}y-${k})`, `(${k}-x-${B}y)^2`, `(${k}+x-${B}y)^2`, `(x-${B}y+${k})(x-${B}y-${k})`], {
        rule: 'group-sq-const', explain: `${xh(`x^2-${2 * b}xy+${b * b === 1 ? '' : b * b}y^2`)} = ${xh(`(x-${B}y)^2`)}이므로 ${xh(target)} = ${xh(`${k * k}-(x-${B}y)^2`)} = ${xh(right)}이다.`
      });
    }, { count: 2 })
  ];

  // ── 계수와 인수의 관계 ──
  const relationTypes = [
    T('rel-given', '인수가 주어졌을 때 계수 구하기', '①67 심18', (d, n) => {
      if (n === 0) {
        const [r, s] = d.until(() => [nz(d, -6, 6), nz(d, -7, 7)], ([x, y]) => x + y !== 0 && x !== y), c = r * s, A = r + s, src = `x^2-Ax${sg(c)}`;
        return numQ1(`${xj(src, '이/가')} ${xj(`x${sg(-r)}`, '을/를')} 인수로 가질 때, 수 ${V('A')}의 값은?`, A, {
          calc: `${jn(r)}+${jn(c)}/${jn(r)}`, rule: 'given-factor',
          explain: `다른 인수를 ${xh('x+k')}라 하면 ${nb(`(${ph(xv(`x${sg(-r)}`))})(${V('x')} + ${V('k')})`)}의 상수항에서 ${nb(`${tx(Q(-r))} × ${V('k')} = ${tx(Q(c))}`)}, ${V('k')} = ${tx(Q(-s))}이다. ${V('x')}의 계수에서 ${nb(`−${V('A')} = ${tx(Q(-r))} + (${tx(Q(-s))})`)}이므로 ${V('A')} = ${tx(Q(A))}이다.`
        });
      }
      // 넓이 ax² + bx + k, 가로 x + r → k
      const [a, r, p] = d.until(() => [d.int(2, 6), d.int(1, 4), nz(d, -9, 9)], ([aa, rr, pp]) => pp + aa * rr !== 0), b = p + a * r, k = r * p;
      return numQ1(`넓이가 ${xh(`${a}x^2${sg(b, 'x')}+k`)}인 직사각형의 가로의 길이가 ${xh(`x+${r}`)}일 때, 수 ${V('k')}의 값은?`, k, {
        calc: `${r}*(${jn(b)}-${a}*${r})`, unseen: [1], rule: 'given-area',
        explain: `세로의 길이를 ${xh(`${a}x+m`)}이라 하면 ${nb(`(${V('x')} + ${r})(${a}${V('x')} + ${V('m')}) = ${a}${V('x')}${sup(2)} + (${V('m')} + ${a * r})${V('x')} + ${r === 1 ? '' : r}${V('m')}`)}이다. ${nb(`${V('m')} + ${a * r} = ${tx(Q(b))}`)}에서 ${V('m')} = ${tx(Q(p))}이므로 ${V('k')} = ${r} × (${tx(Q(p))}) = ${tx(Q(k))}이다.`
      });
    }, { count: 2 }),
    T('rel-form', '인수분해한 꼴과 같을 때 두 수 구하기', '①68', (d) => {
      const [m, q, b] = d.until(() => [d.int(2, 4), nz(d, -7, 7), nz(d, -7, 7)], ([mm, qq, bb]) => gcd(mm, Math.abs(qq)) === 1 && (qq + mm * bb - 1) % 2 === 0 && qq + mm * bb - 1 !== 0);
      const c = b * q, a = (q + m * b - 1) / 2;
      return slots(`${xj(`${m}x^2+(2a+1)x${sg(c)}`, '이/가')} ${xj(`(x+b)(${m}x${sg(q)})`, '으로/로')} 인수분해될 때, 두 수 ${V('a')}, ${V('b')}의 값은?`, [[eqLabel('a'), a, `(${jn(q)}+${m}*${jn(c)}/${jn(q)}-1)/2`], [eqLabel('b'), b, `${jn(c)}/${jn(q)}`]], {
        explain: `${nb(`(${V('x')} + ${V('b')})(${m}${V('x')} ${q < 0 ? MINUS : '+'} ${Math.abs(q)}) = ${m}${V('x')}${sup(2)} + (${tx(Q(q))} + ${m}${V('b')})${V('x')} ${q < 0 ? MINUS : '+'} ${Math.abs(q)}${V('b')}`)}이다. 상수항에서 ${V('b')} = ${tx(Q(b))}, ${V('x')}의 계수에서 ${nb(`2${V('a')} + 1 = ${tx(Q(q + m * b))}`)}이므로 ${V('a')} = ${tx(Q(a))}이다.`
      });
    }),
    T('rel-common', '공통인수가 주어진 두 이차식의 계수', '①69 심14', (d) => {
      const [r, a, s, q, t] = d.until(() => [d.pick([1, 2, -1, -2, 3]), nz(d, -4, 4), nz(d, -6, 6), d.int(2, 4), nz(d, -6, 6)], ([rr, aa, ss, qq, tt]) => ss - aa * rr !== 0 && tt - qq * rr !== 0 && rr * aa !== -ss && aa !== qq);
      const p = s - a * r, c = -r * s, e = -r * t, b = t - q * r, P1 = `ax^2${sg(p, 'x')}${sg(c)}`, P2 = `${q}x^2+bx${sg(e)}`;
      return slots(`두 이차식 ${xh(P1)}, ${xh(P2)}의 공통인수가 ${xh(`x${sg(-r)}`)}일 때, 두 수 ${V('a')}, ${V('b')}의 값은?`, [[eqLabel('a'), a, `(-${jn(c)}/${jn(r)}-${jn(p)})/${jn(r)}`], [eqLabel('b'), b, `-${jn(e)}/${jn(r)}-${q}*${jn(r)}`]], {
        unseen: [1], explain: `${nb(`${ph(xv(`x${sg(-r)}`))}`)}${tail(Math.abs(r), '이/가')} 인수이므로 ${nb(`${V('a')}${V('x')}${sup(2)} ${p < 0 ? MINUS : '+'} ${Math.abs(p) === 1 ? '' : Math.abs(p)}${V('x')} ${c < 0 ? MINUS : '+'} ${Math.abs(c)} = (${ph(xv(`x${sg(-r)}`))})(${V('a')}${V('x')} ${s < 0 ? MINUS : '+'} ${Math.abs(s)})`)}에서 ${V('a')} = ${tx(Q(a))}, ${nb(`${q}${V('x')}${sup(2)} + ${V('b')}${V('x')} ${e < 0 ? MINUS : '+'} ${Math.abs(e)} = (${ph(xv(`x${sg(-r)}`))})(${q}${V('x')} ${t < 0 ? MINUS : '+'} ${Math.abs(t)})`)}에서 ${V('b')} = ${tx(Q(b))}이다.`
      });
    }),
    T('rel-wrong', '잘못 보고 인수분해한 두 결과로 바르게 인수분해하기', '①70 심16', (d) => {
      const [p, q, p1, q1, p2, q2] = d.until(() => {
        const [pp, qq] = [nz(d, -8, 8), nz(d, -8, 8)], C0 = pp * qq, B0 = pp + qq;
        const p1v = d.pick([1, -1, 2, -2, 3, -3, 4, -4, 6, -6]), q1v = C0 / p1v, p2v = nz(d, -8, 8), q2v = B0 - p2v;
        return [pp, qq, p1v, q1v, p2v, q2v];
      }, ([pp, qq, a1, b1, a2, b2]) => pp !== qq && pp + qq !== 0 && Number.isInteger(b1) && Math.abs(b1) <= 12 && b1 !== 0 && a1 + b1 !== pp + qq && b2 !== 0 && Math.abs(b2) <= 9 && a2 * b2 !== pp * qq && a1 !== b1 && a2 !== b2);
      const [n1, n2] = d.shuffle(NAMES).slice(0, 2);
      return facX(`${V('x')}${sup(2)}의 계수가 1인 어떤 이차식을 ${name(n1, '은/는')} ${V('x')}의 계수를 잘못 보고 ${ej(facH([[1, p1], [1, q1]]), '으로/로')}, ${name(n2, '은/는')} 상수항을 잘못 보고 ${ej(facH([[1, p2], [1, q2]]), '으로/로')} 인수분해하였다. 처음 이차식을 바르게 인수분해하시오.`, p, q, {
        poly: srcOfP(xv(`(x${sg(p)})(x${sg(q)})`)),
        explain: `${name(n1, '은/는')} 상수항을 바르게 보았으므로 상수항은 ${tx(Q(p1))} × (${tx(Q(q1))}) = ${tx(Q(p * q))}, ${name(n2, '은/는')} ${V('x')}의 계수를 바르게 보았으므로 ${V('x')}의 계수는 ${tx(Q(p2))} + (${tx(Q(q2))}) = ${tx(Q(p + q))}이다. 처음 이차식은 ${pt(xv(`(x${sg(p)})(x${sg(q)})`))} = ${facH([[1, p], [1, q]])}이다.`
      });
    }),
    T('rel-swap', 'x의 계수와 상수항을 바꾸어 인수분해한 결과로 처음 식 인수분해하기', '①71', (d) => {
      // 처음 식 A x² + Bx + C = (ax + b)(cx + e), 바꾼 식 A x² + Cx + B = (fx + g)(hx + i)
      const factorAC = (A, Bc, Cc) => { for (let f = 1; f <= A; f += 1) { if (A % f) continue; const h = A / f; for (let g = -30; g <= 30; g += 1) { if (!g || Cc % g) continue; const i = Cc / g; if (f * i + g * h === Bc && gcd(f, Math.abs(g)) === 1 && gcd(h, Math.abs(i)) === 1) return [f, g, h, i]; } } return null; };
      const [a, b, c, e, sw] = d.until(() => { const v = [d.int(1, 3), nz(d, -6, 6), d.int(1, 4), nz(d, -6, 6)]; const A = v[0] * v[2], Bc = v[0] * v[3] + v[1] * v[2], Cc = v[1] * v[3]; return v.concat([Bc !== Cc && Bc !== 0 && gcd(v[0], Math.abs(v[1])) === 1 && gcd(v[2], Math.abs(v[3])) === 1 && A > 1 ? factorAC(A, Cc, Bc) : null]); }, (v) => v[4] !== null);
      const nm = d.pick(NAMES);
      return facAC(`${name(nm, '이/가')} 어떤 이차식의 ${V('x')}의 계수와 상수항을 바꾸어 인수분해하였더니 ${ej(facH([[sw[0], sw[1]], [sw[2], sw[3]]]), '이/가')} 되었다. 처음 이차식을 바르게 인수분해하시오.`, a, b, c, e, {
        poly: srcOfP(xv(`(${lin(a, b)})(${lin(c, e)})`)),
        explain: `${facH([[sw[0], sw[1]], [sw[2], sw[3]]])} = ${pt(xv(`(${lin(sw[0], sw[1])})(${lin(sw[2], sw[3])})`))}이므로 처음 이차식은 ${pt(xv(`(${lin(a, b)})(${lin(c, e)})`))}이고, 이를 인수분해하면 ${facH([[a, b], [c, e]])}이다.`
      });
    }),
    T('rel-password', '전개와 인수분해로 네 숫자 구하기', '①72', (d) => {
      const [A, Bv, c, Dv, f] = d.until(() => [d.int(1, 9), d.int(1, 9), nz(d, -5, 5), d.int(2, 9), d.int(1, 8)], ([a, b, cc, dd, ff]) => a * cc - b !== 0 && dd > ff && dd - ff <= 9 && a > 1);
      const X1 = A * c - Bv, K1 = -Bv * c, Cv = Dv - f, E2 = -Dv * f;
      return slots(`네 자리 비밀번호의 숫자 ${V('A')}, ${V('B')}, ${V('C')}, ${V('D')}는 다음을 만족시킨다. ${V('A')}, ${V('B')}, ${V('C')}, ${V('D')}의 값은?`, [[eqLabel('A'), A, `${A}`, false], [eqLabel('B'), Bv, `-${jn(K1)}/${jn(c)}`, false], [eqLabel('C'), Cv, `-${jn(E2)}/${f}-${f}`, false], [eqLabel('D'), Dv, `-${jn(E2)}/${f}`, false]], {
        figure: lines([`${xj(`(Ax-B)(x${sg(c)})`, '을/를')} 전개하면 ${xh(`${A}x^2${sg(X1, 'x')}${sg(K1)}`)}이다.`, `${xj(`x^2+Cx${sg(E2)}`, '을/를')} 인수분해하면 ${xh(`(x+D)(x-${f})`)}이다.`]),
        explain: `${V('x')}${sup(2)}의 계수에서 ${V('A')} = ${A}, 상수항에서 ${nb(`−${V('B')} × ${c < 0 ? '(' + tx(Q(c)) + ')' : c} = ${tx(Q(K1))}`)}이므로 ${V('B')} = ${Bv}이다. ${nb(`−${f}${V('D')} = ${tx(Q(E2))}`)}에서 ${V('D')} = ${Dv}, ${V('C')} = ${Dv} − ${f} = ${Cv}이다.`
      });
    }),
    T('rel-int-m', '정수 조건에서 x의 계수의 최댓값과 최솟값', '①73', (d) => {
      const c = d.pick([6, 8, 10, 12, 14, 15, 18, 20, 21, 24, 28, 30]);
      return slots(`${V('a')}, ${V('b')}가 정수일 때, 등식 ${xh(`x^2+mx+${c}`)} = ${xh('(x+a)(x+b)')}를 만족시키는 수 ${V('m')}의 최댓값과 최솟값은?`, [['최댓값', c + 1, `${c}+1`], ['최솟값', -(c + 1), `-(${c}+1)`]], {
        unseen: [1], explain: `${V('a')}${V('b')} = ${c}, ${V('m')} = ${V('a')} + ${V('b')}이다. 곱이 ${c}인 두 정수의 합이 가장 큰 것은 1 + ${c} = ${c + 1}, 가장 작은 것은 (−1) + (−${c}) = −${c + 1}이다.`
      });
    }),
    T('rel-area', '넓이와 한 변의 길이로 둘레 구하기', '①74', (d) => {
      const [p, r, q] = d.until(() => [d.int(2, 4), d.int(1, 5), nz(d, -6, 6)], ([pp, rr, qq]) => rr + qq !== 0 && qq + pp * rr !== 0);
      const area = xv(`(a+${r})(${p}a${sg(q)})`), Cc = r * q, Bc = q + p * r;
      return polyRaw(`넓이가 ${pt(area)}인 직사각형의 가로의 길이가 ${xh(`a+${r}`)}일 때, 이 직사각형의 둘레의 길이를 구하시오.`, [[2 * (1 + p), V('a'), `2*(1+${p})`], [2 * (r + q), '', `2*(${r}+${jn(Cc)}/${r})`]], {
        unseen: [1, 2], explain: `${pt(area)} = ${xh(`(a+${r})(${p}a${sg(q)})`)}이므로 세로의 길이는 ${xh(`${p}a${sg(q)}`)}이다. 둘레의 길이는 ${nb(`2{(${V('a')} + ${r}) + (${ph(xv(`${p}a${sg(q)}`))})}`)} = ${pt(xv(`2(a+${r}+${p}a${sg(q)})`))}이다.`
      });
    }),
    T('rel-trapezoid', '사다리꼴의 넓이와 두 밑변으로 높이 구하기', '①74의 변형', (d) => {
      // 윗변 t1 a − t2 b, 아랫변 u1 a + u2 b, 높이 h1 a + h2 b
      const [t1, t2, u1, u2, h1, h2] = d.until(() => [d.int(1, 3), d.int(1, 3), d.int(1, 5), d.int(2, 12), d.int(1, 4), d.int(1, 4)], ([a1, b1, a2, b2]) => (a1 + a2) % 2 === 0 && (b2 - b1) % 2 === 0 && b2 - b1 > 0);
      const m1 = (t1 + u1) / 2, m2 = (u2 - t2) / 2, A2 = m1 * h1, B2 = m2 * h2, AB = m1 * h2 + m2 * h1, top = lin2(t1, -t2, 'a', 'b'), bottom = lin2(u1, u2, 'a', 'b');
      return polyRaw(`윗변의 길이가 ${xh(top)}, 아랫변의 길이가 ${xh(bottom)}인 사다리꼴의 넓이가 ${xh(pn([[A2, 'a^2'], [AB, 'ab'], [B2, 'b^2']]))}일 때, 이 사다리꼴의 높이를 구하시오. <span style="white-space:nowrap">(단, ${xh(`${t1 === 1 ? '' : t1}a`)} &gt; ${xh(`${t2 === 1 ? '' : t2}b`)}이고,</span> <span style="white-space:nowrap">계수가 1이면 1을 적는다.)</span>`, [[h1, V('a'), `${A2}/((${t1}+${u1})/2)`], [h2, V('b'), `${B2}/((${u2}-${t2})/2)`]], {
        note: '', unseen: [1, 2], explain: `${nb(`${frac(1, 2)} × {(${ph(xv(top))}) + (${ph(xv(bottom))})} × (높이) = (${ph(xv(lin2(m1, m2, 'a', 'b')))}) × (높이)`)}이다. ${xh(pn([[A2, 'a^2'], [AB, 'ab'], [B2, 'b^2']]))} = ${nb(`(${ph(xv(lin2(m1, m2, 'a', 'b')))})(${ph(xv(lin2(h1, h2, 'a', 'b')))})`)}이므로 높이는 ${pt(xv(lin2(h1, h2, 'a', 'b')))}이다.`
      });
    }),
    T('rel-tiles', '직사각형 조각을 이어 붙인 큰 직사각형의 두 변', '①75', (d) => {
      const [a, b, c, e] = d.until(() => [d.int(1, 2), d.int(1, 4), d.int(1, 2), d.int(1, 4)], ([p, q, r, s]) => !(p === r && q === s) && p * s + q * r <= 8 && q * s <= 8 && !(p === 1 && r === 1 && q === s));
      const n2 = a * c, n1 = a * e + b * c, n0 = b * e, P = xv(`(${lin(a, b)})(${lin(c, e)})`);
      const right = `${xh(lin(a, b))}, ${xh(lin(c, e))}`;
      const cands = [[a, e, c, b], [a + c, b, 1, e], [n2, n1, 1, n0], [a, b + 1, c, e - 1], [a, b, c, e + 1], [c, b, a, e], [a + 1, b, c, e], [a, b, c + 1, e], [1, n0, n2, 1], [a, e + 1, c, b]].filter(([p, q, r, s]) => q > 0 && s > 0 && !same(xv(`(${lin(p, q)})(${lin(r, s)})`), P));
      const opts = [];
      for (const [p, q, r, s] of d.shuffle(cands)) { const h = `${xh(lin(p, q))}, ${xh(lin(r, s))}`, h2 = `${xh(lin(r, s))}, ${xh(lin(p, q))}`; if (opts.length < 4 && !opts.includes(h) && !opts.includes(h2) && h !== right) opts.push(h); }
      if (opts.length < 3) throw new Error('보기가 모자라다');
      const rows = d.shuffle(opts.concat([right])), at = rows.indexOf(right);
      return C(`다음 그림의 직사각형 조각을 모두 겹치지 않게 이어 붙여 하나의 새로운 직사각형을 만들 때, 이 직사각형의 두 변의 길이는?`, rows, at, {
        figure: tilesFig(n2, n1, n0), explain: `조각의 넓이의 합은 ${pt(P)}이고, ${pt(P)} = ${facH([[a, b], [c, e]])}이므로 두 변의 길이는 ${right}이다.`,
        facts: { truth: rows.map((s) => s === right), want: true }
      });
    })
  ];

  // ── 인수분해를 이용한 수의 계산 ──
  const fnumTypes = [
    T('fn-diff', '제곱의 차로 수 계산하기', '①76', (d, n) => {
      if (n === 0) {
        const [s, t] = d.until(() => [d.pick([50, 100, 100, 200]), d.int(2, 48)], ([ss, tt]) => (ss + tt) % 2 === 0 && ss * tt <= 9999), a = (s + t) / 2, b = (s - t) / 2;
        return numQ1(`인수분해 공식을 이용하여 ${a}${sup(2)} − ${b}${sup(2)}을 계산하면?`, s * t, {
          calc: `(${a}+${b})*(${a}-${b})`, rule: 'diff-int', explain: `${a}${sup(2)} − ${b}${sup(2)} = (${a} + ${b})(${a} − ${b}) = ${s} × ${t} = ${s * t}이다.`
        });
      }
      const t = d.pick([1, 3, 5, 7, 9]), a = (10 + t) / 20, b = (10 - t) / 20;
      return D(`인수분해 공식을 이용하여 ${a}${sup(2)} − ${b}${sup(2)}을 계산하면?`, t / 10, {
        signed: true, explain: `${a}${sup(2)} − ${b}${sup(2)} = (${a} + ${b})(${a} − ${b}) = 1 × ${t / 10} = ${t / 10}이다.`, facts: { calc: [[`(${a}+${b})*(${a}-${b})`, 0]], rule: 'diff-dec' }
      });
    }, { count: 2 }),
    T('fn-common', '공통인수를 묶어 수 계산하기', '①77', (d, n) => {
      if (n === 0) {
        const m = d.int(12, 99), a = d.int(51, 89), b = 100 - a;
        return numQ1(`인수분해 공식을 이용하여 ${m} × ${a} + ${m} × ${josa(b, '을/를')} 계산하면?`, m * 100, {
          calc: `${m}*(${a}+${b})`, rule: 'common-sum', explain: `${m} × ${a} + ${m} × ${b} = ${m} × (${a} + ${b}) = ${m} × 100 = ${m * 100}이다.`
        });
      }
      const m = d.int(2, 9), e = d.pick([0.5, 1.5, 2.5, 3.5, 4.5]), a = 5 + e, b = 5 - e;
      return numQ1(`인수분해 공식을 이용하여 ${a}${sup(2)} × ${m} − ${b}${sup(2)} × ${josa(m, '을/를')} 계산하면?`, m * 10 * 2 * e, {
        calc: `${m}*(${a}+${b})*(${a}-${b})`, rule: 'common-diff',
        explain: `${a}${sup(2)} × ${m} − ${b}${sup(2)} × ${m} = ${m}(${a}${sup(2)} − ${b}${sup(2)}) = ${m} × (${a} + ${b})(${a} − ${b}) = ${m} × 10 × ${2 * e} = ${m * 10 * 2 * e}이다.`
      });
    }, { count: 2 }),
    T('fn-fraction', '분자와 분모를 각각 인수분해하여 계산하기', '①77의 변형', (d) => {
      const [a, b, k, mm] = d.until(() => [d.int(41, 99), d.int(41, 99), d.int(3, 9), d.pick([10, 100])], ([x, y, kk, m]) => { const s = x + y; return x !== y && m * kk > s && (s + m * kk) % 2 === 0 && (m * kk - s) / 2 > 0; });
      const s = a + b, c = (s + mm * k) / 2, e = (mm * k - s) / 2;
      return F(`인수분해 공식을 이용하여 다음을 계산하면?`, 1, mm, {
        signed: true, anyForm: true, figure: ex(frac(`${a} × ${k} + ${b} × ${k}`, `${c}${sup(2)} − ${e}${sup(2)}`)),
        explain: `분자는 ${k} × (${a} + ${b}) = ${k} × ${s}, 분모는 (${c} + ${e})(${c} − ${e}) = ${c + e} × ${s}이므로 ${frac(`${k} × ${s}`, `${c + e} × ${s}`)} = ${frac(1, mm)}이다.`,
        facts: { value: `(${a}*${k}+${b}*${k})/(${c}*${c}-${e}*${e})` }
      });
    }),
    T('fn-square', '완전제곱식으로 수 계산하기', '①78', (d) => {
      const base = d.pick([30, 40, 50, 60, 70, 80, 90]), b = d.int(1, 4), plus = d.bool(), a = plus ? base - b : base + b, Mm = 2 * a * b;
      return numQ1(`인수분해 공식을 이용하여 ${a}${sup(2)} ${plus ? '+' : MINUS} ${Mm} + ${josa(b * b, '을/를')} 계산하면?`, base * base, {
        calc: `(${a}${plus ? '+' : '-'}${Mm}/(2*${a}))*(${a}${plus ? '+' : '-'}${Mm}/(2*${a}))`, unseen: [2],
        explain: `${Mm} = 2 × ${a} × ${b}, ${b * b} = ${b}${sup(2)}이므로 ${a}${sup(2)} ${plus ? '+' : MINUS} ${Mm} + ${b * b} = (${a} ${plus ? '+' : MINUS} ${b})${sup(2)} = ${base}${sup(2)} = ${base * base}이다.`
      });
    }),
    T('fn-root', '근호 안을 제곱의 차로 계산하기', '①79', (d) => {
      const t = d.pick([2, 6, 10, 14, 22, 26, 30, 34]), a = (100 + t) / 2, b = (100 - t) / 2;
      return radAns(`인수분해 공식을 이용하여 ${nb(rt(`${a}${sup(2)} − ${b}${sup(2)}`))}을 계산하면?`, 10, t, {
        explain: `${nb(rt(`${a}${sup(2)} − ${b}${sup(2)}`))} = ${nb(rt(`(${a} + ${b})(${a} − ${b})`))} = ${nb(rt(`100 × ${t}`))} = 10${rt(t)}이다.`,
        facts: { calc: [[`(${a}+${b})/10`, 0], [`${a}-${b}`, 1]], unseen: [10] }
      });
    }),
    T('fn-circle', '원 모양 땅의 넓이를 인수분해로 구하기', '①81', (d) => {
      const [R, r] = d.until(() => [d.int(10, 30) + 0.5, d.int(2, 9) + 0.5], ([x, y]) => (x + y) * (x - y) <= 9999);
      return numQ1(`반지름의 길이가 ${R} m인 원 모양의 잔디 광장 안에 반지름의 길이가 ${r} m인 원 모양의 분수대가 있다. 인수분해 공식을 이용하여 분수대를 제외한 잔디 광장의 넓이를 구하시오.`, (R + r) * (R - r), {
        unit: 'π m²', calc: `(${R}+${r})*(${R}-${r})`,
        explain: `넓이는 ${nb(`π × ${R}${sup(2)} − π × ${r}${sup(2)} = π(${R} + ${r})(${R} − ${r}) = π × ${R + r} × ${R - r}`)} = ${(R + r) * (R - r)}π (m²)이다.`
      });
    }),
    T('fn-pick-formula', '수의 계산에 쓸 수 있는 인수분해 공식 고르기', '①81의 변형', (d) => {
      const NAMES2 = [`${V('m')}${V('a')} + ${V('m')}${V('b')} = ${V('m')}(${V('a')} + ${V('b')})`, `${V('a')}${sup(2)} + 2${V('a')}${V('b')} + ${V('b')}${sup(2)} = (${V('a')} + ${V('b')})${sup(2)}`, `${V('a')}${sup(2)} − ${V('b')}${sup(2)} = (${V('a')} + ${V('b')})(${V('a')} − ${V('b')})`, `${V('x')}${sup(2)} + (${V('a')} + ${V('b')})${V('x')} + ${V('a')}${V('b')} = (${V('x')} + ${V('a')})(${V('x')} + ${V('b')})`];
      const m = d.int(2, 9), e = d.pick([0.5, 1.5, 2.5]), a = 5 + e, b = 5 - e, k = d.int(31, 69), j = d.int(1, 3);
      const kind = d.pick([[`${m} × ${a}${sup(2)} − ${m} × ${b}${sup(2)}`, [0, 2]], [`${k}${sup(2)} + ${2 * k * j} + ${j * j}`, [1]], [`${a}${sup(2)} − ${b}${sup(2)}`, [2]]]);
      const right = combo(kind[1]), all = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄱ, ㄴ', 'ㄱ, ㄷ', 'ㄴ, ㄷ', 'ㄴ, ㄹ'];
      const rows = d.shuffle(d.shuffle(all.filter((s) => s !== right)).slice(0, 4).concat([right])), at = rows.indexOf(right);
      return C(`인수분해를 이용하여 ${kind[0]}의 값을 구하려고 한다. 다음 &lt;보기&gt; 중 사용할 수 있는 인수분해 공식을 모두 고른 것은?`, rows, at, {
        figure: lines(NAMES2.map((h, i) => tag(HANGUL[i]) + nb(h))), explain: kind[1].length === 2 ? `${tj0(m, '을/를')} 묶어 내고(ㄱ) 남은 ${a}${sup(2)} − ${b}${sup(2)}을 제곱의 차(ㄷ)로 인수분해한다.` : kind[1][0] === 1 ? `${2 * k * j} = 2 × ${k} × ${j}이므로 (${k} + ${j})${sup(2)}으로 계산한다(ㄴ).` : '두 수의 제곱의 차이므로 ㄷ을 쓴다.',
        facts: { truth: rows.map((s) => s === right), want: true }
      });
    })
  ];

  // ── 인수분해를 이용한 식의 값 ──
  const fvalueTypes = [
    T('fv-plug', '수를 넣기 전에 인수분해하기', '①82', (d, n) => {
      if (n === 0) {
        const base = d.pick([20, 30, 40, 50, 60, 70, 80, 90]), a = d.int(1, 5), plus = d.bool(), x = plus ? base - a : base + a, Mm = 2 * a;
        const src = `x^2${plus ? '+' : '-'}${Mm}x+${a * a}`;
        return numQ1(`${V('x')} = ${x}일 때, ${xh(src)}의 값은?`, base * base, {
          calc: `(${x}${plus ? '+' : '-'}${Mm}/2)*(${x}${plus ? '+' : '-'}${Mm}/2)`, unseen: [2], rule: 'plug-square',
          explain: `${xh(src)} = ${xh(`(x${plus ? '+' : '-'}${a})^2`)}이므로 ${V('x')} = ${tj0(x, '을/를')} 넣으면 ${base}${sup(2)} = ${base * base}이다.`
        });
      }
      // xy + px + y + p = (x + 1)(y + p), p 와 y 는 0.5 단위
      const [x, yInt, pInt] = d.until(() => [nz(d, -15, 15), d.int(1, 9), d.int(1, 9)], ([xx, yy, pp]) => xx !== -1 && yy !== pp);
      const y = yInt + 0.5, p = pInt + 0.5, v = (x + 1) * (y + p);
      return numQ1(`${V('x')} = ${tx(Q(x))}, ${V('y')} = ${y}일 때, ${xh(`xy+${p}x+y+${p}`)}의 값은?`, v, {
        calc: `(${jn(x)}+1)*(${y}+${p})`, unseen: [1], rule: 'plug-group',
        explain: `${xh(`xy+${p}x+y+${p}`)} = ${xh(`x(y+${p})+(y+${p})`)} = ${xh(`(x+1)(y+${p})`)}이므로 (${tx(Q(x))} + 1) × (${y} + ${p}) = ${tx(Q(v))}이다.`
      });
    }, { count: 2 }),
    T('fv-rad-x', '근호가 든 x를 넣어 식의 값 구하기', '①83', (d, n) => {
      if (n === 0) {
        const [a, b, c] = d.until(() => [d.int(1, 5), d.pick([2, 3, 5, 6, 7]), nz(d, -9, 9)], ([aa, bb, cc]) => bb - aa * aa + cc !== 0);
        const src = `x^2-${2 * a}x${sg(c)}`, v = b - a * a + c;
        return numQ1(`${V('x')} = ${a} + ${rt(b)}일 때, ${xh(src)}의 값은?`, v, {
          calc: `${b}-${a}*${a}+${jn(c)}`, rule: 'radx-square',
          explain: `${xh(src)} = ${nb(`(${V('x')} − ${a})${sup(2)} ${c - a * a < 0 ? MINUS : '+'} ${Math.abs(c - a * a)}`)}이고 ${nb(`${V('x')} − ${a} = ${rt(b)}`)}이므로 ${b} ${c - a * a < 0 ? MINUS : '+'} ${Math.abs(c - a * a)} = ${tx(Q(v))}이다.`
        });
      }
      // x = √b − c, (x + e)² − 2k(x + e) + K, e − k = c
      const [b, c, k, K] = d.until(() => [d.pick([2, 3, 5, 6, 7]), d.int(1, 5), d.int(1, 4), d.int(1, 20)], ([bb, cc, kk, KK]) => bb + KK - kk * kk !== 0 && KK !== kk * kk && cc + kk > 0);
      const e = c + k, v = b + K - k * k, src = `(x+${e})^2-${2 * k}(x+${e})+${K}`;
      return numQ1(`${V('x')} = ${rt(b)} − ${c}일 때, ${xh(src)}의 값은?`, v, {
        calc: `${b}+${K}-(${2 * k}/2)*(${2 * k}/2)`, unseen: [2], rule: 'radx-block',
        explain: `${xh(`x+${e}`)} = ${V('A')}라 하면 ${nb(`${V('A')}${sup(2)} − ${2 * k}${V('A')} + ${K} = (${V('A')} − ${k})${sup(2)} ${K - k * k < 0 ? MINUS : '+'} ${Math.abs(K - k * k)}`)}이다. ${nb(`${V('A')} − ${k} = ${V('x')} + ${c} = ${rt(b)}`)}이므로 ${b} ${K - k * k < 0 ? MINUS : '+'} ${Math.abs(K - k * k)} = ${tx(Q(v))}이다.`
      });
    }, { count: 2 }),
    T('fv-rad-xy', '근호가 든 두 수로 x² − y² 구하기', '①84', (d) => {
      const [a, b] = d.until(() => [d.pick([2, 3, 5, 6, 7, 10, 11]), d.pick([2, 3, 5, 6, 7, 10, 11])], ([x, y]) => x !== y && isSqf(x * y));
      return radAns(`${V('x')} = ${rt(a)} + ${rt(b)}, ${V('y')} = ${rt(a)} − ${rt(b)}일 때, ${nb(`${V('x')}${sup(2)} − ${V('y')}${sup(2)}`)}의 값은?`, 4, a * b, {
        explain: `${nb(`${V('x')}${sup(2)} − ${V('y')}${sup(2)} = (${V('x')} + ${V('y')})(${V('x')} − ${V('y')})`)}이고 ${nb(`${V('x')} + ${V('y')} = 2${rt(a)}`)}, ${nb(`${V('x')} − ${V('y')} = 2${rt(b)}`)}이므로 4${rt(a * b)}이다.`,
        facts: { calc: [['2*2', 0], [`${a}*${b}`, 1]], unseen: [2] }
      });
    }),
    T('fv-rat-then', '유리화한 뒤 인수분해로 식의 값 구하기', '①85', (d, n) => {
      const [a, b] = d.pick([[3, 2], [6, 5], [7, 6], [11, 10], [14, 13], [15, 14]]);
      const head = `${V('x')} = ${nb(fr1(1, `${rt(a)} + ${rt(b)}`))}, ${V('y')} = ${nb(fr1(1, `${rt(a)} − ${rt(b)}`))}일 때, `;
      if (n === 0) {
        return radAns(head + `인수분해를 이용하여 ${nb(`${V('x')}${sup(2)}${V('y')} + ${V('x')}${V('y')}${sup(2)}`)}의 값을 구하시오.`, 2, a, {
          explain: `분모를 유리화하면 ${V('x')} = ${rt(a)} − ${rt(b)}, ${V('y')} = ${rt(a)} + ${rt(b)}이므로 ${nb(`${V('x')}${V('y')} = ${a} − ${b} = 1`)}, ${nb(`${V('x')} + ${V('y')} = 2${rt(a)}`)}이다. ${nb(`${V('x')}${sup(2)}${V('y')} + ${V('x')}${V('y')}${sup(2)} = ${V('x')}${V('y')}(${V('x')} + ${V('y')})`)} = 2${rt(a)}이다.`,
          facts: { calc: [['2', 0], [`${a}`, 1]], unseen: [2], rule: 'rat-then-sum' }
        });
      }
      return radAns(head + `인수분해를 이용하여 ${nb(`${V('x')}${sup(3)}${V('y')} − ${V('x')}${V('y')}${sup(3)}`)}의 값을 구하시오.`, -4, a * b, {
        explain: `분모를 유리화하면 ${V('x')} = ${rt(a)} − ${rt(b)}, ${V('y')} = ${rt(a)} + ${rt(b)}이다. ${nb(`${V('x')}${sup(3)}${V('y')} − ${V('x')}${V('y')}${sup(3)} = ${V('x')}${V('y')}(${V('x')} + ${V('y')})(${V('x')} − ${V('y')})`)} = 1 × 2${rt(a)} × (−2${rt(b)}) = −4${rt(a * b)}이다.`,
        facts: { calc: [['-4', 0], [`${a}*${b}`, 1]], unseen: [4], rule: 'rat-then-diff' }
      });
    }, { count: 2 }),
    T('fv-sumdiff', '합·차가 주어진 식의 값', '①86', (d, n) => {
      if (n === 0) {
        const [k, a, b] = d.until(() => [d.int(2, 4), nz(d, -9, 9), nz(d, -5, 5)], ([kk, aa, bb]) => aa - kk * bb !== 0 && aa + kk * bb !== 0);
        const Qv = a - k * b, P = a * a - k * k * b * b;
        return numQ1(`${xh(`a^2-${k * k}b^2`)} = ${tx(Q(P))}, ${xh(`a-${k}b`)} = ${tx(Q(Qv))}일 때, ${xh(`a+${k}b`)}의 값은?`, a + k * b, {
          calc: `${jn(P)}/${jn(Qv)}`, rule: 'sumdiff-square', explain: `${xh(`a^2-${k * k}b^2`)} = ${xh(`(a+${k}b)(a-${k}b)`)}이므로 ${nb(`${tx(Q(P))} = (${V('a')} + ${k}${V('b')}) × (${tx(Q(Qv))})`)}, ${xh(`a+${k}b`)} = ${tx(Q(a + k * b))}이다.`
        });
      }
      if (n === 1) {
        const [s, t, k] = d.until(() => [nz(d, -9, 9), nz(d, -9, 9), d.int(2, 6)], ([ss, , kk]) => ss + kk !== 0);
        return numQ1(`${nb(`${V('x')} + ${V('y')} = ${tx(Q(s))}`)}, ${nb(`${V('x')} − ${V('y')} = ${tx(Q(t))}`)}일 때, ${xh(`x^2-y^2+${k}x-${k}y`)}의 값은?`, t * (s + k), {
          calc: `${jn(t)}*(${jn(s)}+${k})`, rule: 'sumdiff-group', explain: `${xh(`x^2-y^2+${k}x-${k}y`)} = ${xh(`(x+y)(x-y)+${k}(x-y)`)} = ${xh(`(x-y)(x+y+${k})`)}이므로 ${tx(Q(t))} × (${tx(Q(s))} + ${k}) = ${tx(Q(t * (s + k)))}이다.`
        });
      }
      const [k, s, p, q] = d.until(() => [d.int(2, 4), nz(d, -6, 6), d.int(1, 5), nz(d, -9, 9)], ([, ss, pp, qq]) => ss * ss + pp * ss + qq !== 0);
      const src = `x^2+${2 * k}xy+${k * k}y^2+${p === 1 ? '' : p}x+${p * k}y${sg(q)}`;
      return numQ1(`${xh(`x+${k}y`)} = ${tx(Q(s))}일 때, ${xh(src)}의 값은?`, s * s + p * s + q, {
        calc: `${jn(s)}*${jn(s)}+${p}*${jn(s)}+${jn(q)}`, unseen: [1], rule: 'sumdiff-block',
        explain: `${xh(src)} = ${nb(`(${V('x')} + ${k}${V('y')})${sup(2)} + ${p === 1 ? '' : p}(${V('x')} + ${k}${V('y')}) ${q < 0 ? MINUS : '+'} ${Math.abs(q)}`)}이므로 ${nb(`(${tx(Q(s))})${sup(2)} + ${p} × (${tx(Q(s))}) ${q < 0 ? MINUS : '+'} ${Math.abs(q)}`)} = ${tx(Q(s * s + p * s + q))}이다.`
      });
    }, { count: 3 }),
    T('fv-squares', '두 정사각형의 둘레의 합과 넓이의 차', '①86의 변형', (d) => {
      const [a, b] = d.until(() => [d.int(4, 20), d.int(2, 15)], ([x, y]) => x > y);
      const P = 4 * (a + b), Dv = a * a - b * b;
      return numQ1(`한 변의 길이가 각각 ${V('a')}, ${V('b')}인 두 정사각형이 있다. 두 정사각형의 둘레의 길이의 합이 ${P}이고 넓이의 차가 ${Dv}일 때, ${xh('a-b')}의 값은? (단, ${V('a')} &gt; ${V('b')})`, a - b, {
        calc: `${Dv}/(${P}/4)`, unseen: [4],
        explain: `${nb(`4${V('a')} + 4${V('b')} = ${P}`)}에서 ${nb(`${V('a')} + ${V('b')} = ${a + b}`)}이다. ${nb(`${V('a')}${sup(2)} − ${V('b')}${sup(2)} = (${V('a')} + ${V('b')})(${V('a')} − ${V('b')}) = ${Dv}`)}이므로 ${xh('a-b')} = ${Dv} ÷ ${a + b} = ${a - b}이다.`
      });
    }),
    T('fv-root-abs', '범위가 주어진 근호 속 완전제곱식', '①87 심30', (d) => {
      // √((x − p)²) ± √((qx − r)²), 범위는 두 근 사이
      const [p, q, r, op] = d.until(() => [nz(d, -4, 4), d.int(2, 4), nz(d, -7, 7), d.pick([1, -1])], ([pp, qq, rr, o]) => {
        if (gcd(qq, Math.abs(rr)) !== 1 || pp * qq === rr) return false;
        const lo = Math.min(pp, rr / qq), hi = Math.max(pp, rr / qq), mid = (lo + hi) / 2, s1 = mid - pp > 0 ? 1 : -1, s2 = (qq * mid - rr > 0 ? 1 : -1) * o;
        return s1 + s2 * qq !== 0 && -s1 * pp - s2 * rr !== 0;
      });
      const lo = Math.min(p, r / q), hi = Math.max(p, r / q), mid = (lo + hi) / 2, s1 = mid - p > 0 ? 1 : -1, s2 = (q * mid - r > 0 ? 1 : -1) * op;
      const a = s1 + s2 * q, b = -s1 * p - s2 * r, ends = [Q(p), Q(r, q)].sort((x, y) => qcmp(x, y));
      const in1 = `x^2${sg(-2 * p, 'x')}+${p * p}`, in2 = `${q * q}x^2${sg(-2 * q * r, 'x')}+${r * r}`;
      return linAns(`${tx(ends[0])} &lt; ${V('x')} &lt; ${tx(ends[1])}일 때, ${rt(htmlX(in1))} ${op < 0 ? MINUS : '+'} ${ej(rt(htmlX(in2)), '을/를')} 간단히 하시오.`, a, b, V('x'), {
        explain: `${nb(rt(htmlX(in1)) + ' = ' + rt(`(${ph(xv(`x${sg(-p)}`))})${sup(2)}`))}, ${nb(rt(htmlX(in2)) + ' = ' + rt(`(${ph(xv(`${q}x${sg(-r)}`))})${sup(2)}`))}이다. 주어진 범위에서 ${xj(`x${sg(-p)}`, '은/는')} ${s1 > 0 ? '양수' : '음수'}, ${xj(`${q}x${sg(-r)}`, '은/는')} ${(q * mid - r > 0) ? '양수' : '음수'}이므로 주어진 식은 ${pt(xv(lin(a, b)))}이다.`,
        facts: { calc: [[`${s1}+(${s2})*${q}`, 0], [`-(${s1})*${jn(p)}-(${s2})*${jn(r)}`, 1]], unseen: [1] }
      });
    })
  ];

  B.addGroup(UNIT, { id: 'factor', title: '인수와 공통인수', standard: STD, types: factorTypes });
  B.addGroup(UNIT, { id: 'fformula', title: '인수분해 공식', standard: STD, types: fformulaTypes });
  B.addGroup(UNIT, { id: 'square', title: '완전제곱식', standard: STD, types: squareTypes });
  B.addGroup(UNIT, { id: 'complex', title: '여러 가지 인수분해', standard: STD, types: complexTypes });
  B.addGroup(UNIT, { id: 'relation', title: '계수와 인수의 관계', standard: STD, types: relationTypes });
  B.addGroup(UNIT, { id: 'fnum', title: '인수분해를 이용한 수의 계산', standard: STD, types: fnumTypes });
  B.addGroup(UNIT, { id: 'fvalue', title: '인수분해를 이용한 식의 값', standard: STD, types: fvalueTypes });
  Object.assign(B.kit.m913, { uArr, uDivides, linDivides, srcOfP, normLin, lead, facPick, polyRaw, HANGUL, combo, crossFig, tilesFig });
})(typeof window !== 'undefined' ? window : globalThis);
