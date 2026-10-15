// 중학교 3학년 1학기 2단원 근호를 포함한 식의 계산 — 뒤쪽 묶음(제곱근의 덧셈과 뺄셈, 근호를 포함한 식의 혼합 계산, 계수 맞추기와 식의 값, 대소 관계와 정수 부분·소수 부분, 도형과 수직선).
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 9-1-2a.js 에 있다. ref: ①n = 기본꼴_1의 n번.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines, N, M, C, inline } = B.kit;
  const { MINUS, range, gcd, Q, qmul, qadd, qsub, qneg, isInt, fl, mag, nb, tail, V, sup, rt, grp, sqParts, radText, claimQ, SG } = B.kit.mid;
  const { Board } = B.kit.mgeo;
  const K = B.kit.m912;
  const { STD_CMP, UNIT, T, CALC, ONE, SQF_SMALL, isSq, pickSqf, xv, fv, sameV, ordV, termOf, mk, vh, vj, htmlX, xh, xex, named, told, simpLine, calcOf, stripH, seal, more,
    isR, rA, isN, nA, isOneRad, isFr, fA, isQ, qA, isS, sA, isTw, tA, pickV, pickRows, near, pn, co, lsum, wrap } = K;
  const eqex = (left, right) => '<span class="mb-expr"' + B.kit.mid.fit(K.emX(left) + K.emX(right) + 1.62) + '>' + htmlX(left, true) + ' <i>=</i> ' + htmlX(right, true) + '</span>';
  const sn = (v) => B.kit.mid.tx(typeof v === 'number' ? B.kit.mid.Q(v) : v);   // 풀이 글의 음수는 붙임표 대신 빼기표(−)로
  const sgn = (c, first) => (c < 0 ? (first ? '-' : '-') : first ? '' : '+');
  // 계수와 근호 안으로 항 하나의 식 글: term(3, 12, true) → 3r12, term(-1, 5) → -r5, term(2, 1) → +2
  const term = (c, m, first) => sgn(c, first) + (m === 1 ? Math.abs(c) : (Math.abs(c) === 1 ? '' : Math.abs(c)) + 'r' + m);
  const joinT = (list) => list.map(([c, m], i) => term(c, m, i === 0)).join('');
  const LIKE = '근호 안의 수가 같은 것끼리 모아서 계산한다.';

  // ── 제곱근의 덧셈과 뺄셈 ──
  B.addTypes(UNIT, 'addsub', [
    T('add-like', '근호 안의 수가 같은 제곱근의 덧셈과 뺄셈', '①33', (d) => {
      const m = pickSqf(d, [2, 3, 5, 6, 7, 10, 11, 13]);
      const list = d.until(() => range(1, d.int(2, 3)).map(() => [d.int(1, 12) * (d.int(0, 2) === 0 ? -1 : 1), m]), (l) => { const s = l.reduce((a, [c]) => a + c, 0); return Math.abs(s) >= 2 && l[0][0] > 0 && l.every(([c]) => c !== 0); });
      const src = joinT(list), S = xv(src);
      return rA(CALC, S, { figure: xex(src), explain: `${LIKE} ${xh(src)} = (${list.map(([c]) => c).join(' + ').replace(/\+ -/g, `${MINUS} `)})${rt(m)} = ${vh(S)}이다.`, rule: 'add-like' });
    }),
    T('add-like-frac', '계수가 분수인 같은 제곱근의 덧셈과 뺄셈', '①33', (d) => {
      const m = pickSqf(d, [2, 3, 5, 6, 7]);
      const src = d.until(() => {
        const [u, v] = d.until(() => [d.int(1, 5), d.pick([2, 3, 4])], ([x, y]) => gcd(x, y) === 1);
        const parts = d.shuffle([`r${m}`, `[${u}|${v}]r${m}`, `[r${m}|${d.pick([2, 3, 4, 6])}]`, `${d.int(2, 4)}r${m}`]).slice(0, 3);
        return parts.map((p, i) => (i === 0 ? (d.bool() ? '-' : '') : d.bool() ? '+' : '-') + p).join('');
      }, (s) => isQ(xv(s)));
      const S = xv(src);
      return qA(CALC, S, { figure: xex(src), explain: `${LIKE} 계수끼리 통분하여 계산하면 ${xh(src)} = ${vh(S)}이다.`, rule: 'add-like-frac' });
    }),
    T('add-two', '근호 안의 수가 다른 두 종류를 모아 계산하기', '①34', (d) => {
      const [p, q] = d.until(() => [d.pick([2, 3, 5, 6, 7, 10, 11, 13]), d.pick([2, 3, 5, 6, 7, 10, 11, 13])], ([x, y]) => x < y);
      const list = d.until(() => d.shuffle([[d.int(1, 9) * (d.bool() ? 1 : -1), p], [d.int(1, 9) * (d.bool() ? 1 : -1), p], [d.int(1, 9) * (d.bool() ? 1 : -1), q], [d.int(1, 9) * (d.bool() ? 1 : -1), q]]),
        (l) => l[0][0] > 0 && isTw(xv(joinT(l))));
      const src = joinT(list), S = xv(src);
      return tA(CALC, S, { figure: xex(src), explain: `${LIKE} ${xh(src)} = ${vh(S)}이다.`, rule: 'add-two' });
    }),
    T('add-rational', '유리수와 제곱근이 섞인 덧셈과 뺄셈', '①34', (d) => {
      const m = pickSqf(d, [2, 3, 5, 6, 7]);
      const [s, t, a, b] = d.until(() => [d.int(2, 9), d.int(2, 9), d.int(1, 9), d.int(1, 9)], ([x, y, z, w]) => x !== y && z !== w);
      const src = d.shuffle([[`r${s * s}`, 0], [co(a, m), 1], [`r${t * t}`, 2], [co(b, m), 3]]).map(([h, k], i) => ((k === 2 || k === 3) ? '-' : i ? '+' : '') + h).join('');
      const S = xv(src);
      return sA(CALC, S, { figure: xex(src), explain: `${rt(s * s)} = ${s}, ${rt(t * t)} = ${t}이므로 유리수끼리, ${rt(m)}끼리 모은다. ${xh(src)} = ${vh(S)}이다.`, rule: 'add-rational' });
    }),
    T('add-simp', '근호 안을 간단히 하여 한 종류로 모으기', '①35', (d) => {
      const m = pickSqf(d, [2, 3, 5, 6, 7]);
      const list = d.until(() => range(1, d.int(2, 4)).map(() => [d.pick([1, 1, 1, 2, 3]) * (d.bool() ? 1 : -1), d.int(1, 6) ** 2 * m]),
        (l) => { const S = xv(joinT(l)); return l[0][0] > 0 && isR(S) && l.filter(([, r]) => r !== m).length >= 2 && new Set(l.map(([, r]) => r)).size === l.length && l.every(([, r]) => r <= 200); });
      const src = joinT(list), S = xv(src);
      return rA(CALC, S, { figure: xex(src), explain: `근호 안의 제곱인 인수를 꺼낸 다음 ${LIKE} ${told(src, [], S)}이다.`, rule: 'add-simp' });
    }),
    T('add-simp-two', '근호 안을 간단히 한 뒤 두 종류가 남는 계산', '①36', (d) => {
      const [p, q] = d.until(() => [d.pick([2, 3, 5, 7]), d.pick([2, 3, 5, 6, 7])], ([x, y]) => x < y && gcd(x, y) === 1);
      const list = d.until(() => d.shuffle([[1, d.int(1, 6) ** 2 * p], [1, d.int(1, 6) ** 2 * p], [1, d.int(1, 6) ** 2 * q], [1, d.int(1, 6) ** 2 * q]]).map(([c, r]) => [c * (d.bool() ? 1 : -1) * d.pick([1, 1, 2]), r]),
        (l) => l[0][0] > 0 && isTw(xv(joinT(l))) && new Set(l.map(([, r]) => r)).size === 4 && l.filter(([, r]) => r !== p && r !== q).length >= 3 && l.every(([, r]) => r <= 200));
      const src = joinT(list), S = xv(src);
      return tA(CALC, S, { figure: xex(src), explain: `근호 안의 제곱인 인수를 꺼낸 다음 ${LIKE} ${told(src, [], S)}이다.`, rule: 'add-simp-two' });
    }),
    T('add-rat', '분모의 유리화가 낀 덧셈과 뺄셈', '①37', (d) => {
      const m = pickSqf(d, [2, 3, 5, 6]);
      const make = () => {
        const s = () => d.int(1, 3), k = () => d.int(1, 9);
        const kinds = [() => { const c = s(); return `${c > 1 ? c : ''}r${s() ** 2 * m}`; }, () => `[${k()}|r${s() ** 2 * m}]`, () => `[${k()}|${d.int(2, 3)}r${m}]`, () => { const [x, y] = m === 6 ? d.pick([[2, 3], [3, 2]]) : [m * d.pick([2, 3]), 0]; return y ? `[${co(d.int(1, 3), x)}|r${y}]` : `r${m}`; }];
        return range(1, 3).map(() => d.pick(kinds)()).map((t, i) => (i === 0 ? '' : d.bool() ? '+' : '-') + t).join('');
      };
      const src = d.until(make, (s) => { const S = xv(s); return isQ(S) && Math.abs(S[0].q.p) <= 60 && S[0].q.q <= 30 && /\|/.test(s); });
      const S = xv(src);
      return qA(CALC, S, { figure: xex(src), explain: `분모를 유리화하고 근호 안을 간단히 한 다음 ${LIKE} ${xh(src)} = ${vh(S)}이다.`, rule: 'add-rat' });
    }),
    T('add-rat-k', '계산 결과를 k√m으로 놓고 k 구하기', '①37', (d) => {
      const m = pickSqf(d, [2, 3, 5, 6, 7]);
      const kinds = [() => `r${d.int(2, 5) ** 2 * m}`, () => { const t = d.int(1, 4); return `[${t * m}|r${m}]`; }, () => { const [x, y] = d.pick([[2 * m, 2], [3 * m, 3], [5 * m, 5]].filter(([u, v]) => !isSq(u) && u !== v)); return `r${x}*r${y}`; }];
      const src = d.until(() => range(1, 3).map(() => d.pick(kinds)()).map((t, i) => (i === 0 ? '' : d.bool() ? '+' : '-') + t).join(''),
        (s) => { const S = xv(s); return isOneRad(S) && S[0].q.q === 1 && S[0].m === m && S[0].q.p !== 0 && /\|/.test(s) && /\*/.test(s); });
      const S = xv(src), k = S[0].q.p;
      return seal(N(`다음 등식을 만족시키는 유리수 ${V('k')}의 값은?`, k, {
        signed: true, figure: eqex(src, `kr${m}`), explain: `${xh(src)} = ${vh(S)}이므로 ${V('k')} = ${sn(k)}이다.`,
        facts: { calc: [[calcOf(S[0]), 0]], rule: 'add-rat-k' }
      }));
    }),
    T('add-back', '덧셈·뺄셈 등식에서 모르는 수 구하기', '①38', (d, n) => {
      const m = pickSqf(d, [2, 3, 5, 6, 7]), a = V('a');
      if (n === 0) {
        // c√A ± √B ± √a = w√m 에서 √a 를 구한다.
        const [known, w, sg] = d.until(() => [joinT(d.shuffle([[d.int(1, 3), d.int(2, 7) ** 2 * m], [-d.int(1, 2), d.int(2, 7) ** 2 * m]])), d.int(-4, 5), d.bool() ? 1 : -1],
          ([kn, w0, s0]) => { if (w0 === 0) return false; const L = xv(kn), u = L.length ? L[0].q.p : 0; const diff = s0 * (w0 - u); return diff >= 2 && (diff * diff * m) <= 400; });
        const L = xv(known), u = L.length ? L[0].q.p : 0, rootA = sg * (w - u), aVal = rootA * rootA * m;
        const left = known + (sg > 0 ? '+ra' : '-ra'), right = co(w, m);
        const diffV = xv(`(${right})-(${known})`), t = diffV[0];
        return seal(N(`다음 등식을 만족시키는 유리수 ${a}의 값은?`, aVal, {
          signed: true, figure: eqex(left, right), explain: `${xh(known)} = ${vh(L)}이므로 ${sg > 0 ? '' : MINUS}${rt(a)} = ${vh(xv(right))} ${MINUS} (${vh(L)}) = ${vh(diffV)}이다. ${rt(a)} = ${radText(rootA, m)} = ${rt(aVal)}이므로 ${a} = ${sn(aVal)}이다.`,
          facts: { calc: [[`(${calcOf(t)})**2*${t.m}`, 0]], rule: 'add-back-0' }
        }));
      }
      // √A + k/√m − a√C = w√m 에서 계수 a 를 구한다.
      const s3 = d.int(2, 5), C0 = s3 * s3 * m;
      const [known, w, aVal] = d.until(() => { const kn = joinT([[1, d.int(2, 8) ** 2 * m]]) + `+[${d.int(1, 4) * m}|r${m}]`; const L = xv(kn), u = L[0].q.p, av = d.int(2, 4); return [kn, u - av * s3, av]; }, ([, w0]) => w0 !== 0 && Math.abs(w0) <= 20);
      const left = `${known}-ar${C0}`, right = co(w, m), L = xv(known);
      const diffV = xv(`(${known})-(${right})`), t = diffV[0];
      return seal(N(`다음 등식을 만족시키는 유리수 ${a}의 값은?`, aVal, {
        signed: true, figure: eqex(left, right), explain: `${xh(known)} = ${vh(L)}, ${rt(C0)} = ${radText(s3, m)}이므로 ${vh(L)} ${MINUS} ${s3}${a}${rt(m)} = ${vh(xv(right))}이다. ${s3}${a} = ${sn(L[0].q.p - w)}, ${a} = ${sn(aVal)}이다.`,
        facts: { calc: [[`(${calcOf(t)})/(${C0}/${t.m})**0.5`, 0]], rule: 'add-back-1' }
      }));
    }, { count: 2 }),
    T('add-claims', '제곱근의 덧셈·뺄셈 등식 가리기', '①39', (d) => {
      const m = pickSqf(d, [2, 3, 5]), s = d.int(2, 4), a = d.int(2, 5), b = d.int(1, 4), p = d.pick([2, 3]), q = d.pick([5, 7]);
      const yes = [
        `${rt(s * s * m)} + ${rt(m)} = ${radText(s + 1, m)}`,
        `${radText(a + b, m)} ${MINUS} ${radText(b, m)} = ${radText(a, m)}`,
        `${rt(m)}(${rt(m * p)} ${MINUS} ${rt(m * q)}) = ${radText(m, p)} ${MINUS} ${radText(m, q)}`,
        `${rt(9 * m)} ${MINUS} ${rt(4 * m)} ${MINUS} ${rt(m)} = 0`,
        `${rt(m)} ${MINUS} ${rt(frac(1, m))} = ${frac(radText(m - 1, m), m)}`
      ];
      const no = [
        [`${rt(s * s * m)} + ${rt(m)} = ${rt(s * s * m + m)}`, `근호 안의 수끼리 더할 수 없다. ${rt(s * s * m)} + ${rt(m)} = ${radText(s, m)} + ${rt(m)} = ${radText(s + 1, m)}이다.`, yes[0]],
        [`${rt((s + 3) ** 2)} ${MINUS} ${rt(s * s)} = ${rt((s + 3) ** 2 - s * s)}`, `${rt((s + 3) ** 2)} ${MINUS} ${rt(s * s)} = ${s + 3} ${MINUS} ${s} = 3이다.`],
        [`${a}${rt(p)} × ${rt(q)} = ${rt(a * p * q)}`, `${a}${rt(p)} × ${rt(q)} = ${a}${rt(p * q)} = ${rt(a * a * p * q)}이다.`],
        [`${radText(a, m)} ${MINUS} ${rt(m)} = ${a}`, `${radText(a, m)} ${MINUS} ${rt(m)} = (${a} ${MINUS} 1)${rt(m)} = ${radText(a - 1, m)}이다.`, yes[1]],
        [`${a + 3} + ${rt(m)} ${MINUS} ${a} ${MINUS} ${rt(m)} = ${rt(m)}`, `${a + 3} + ${rt(m)} ${MINUS} ${a} ${MINUS} ${rt(m)} = 3이다.`],
        [`2 × ${rt(3)} ${MINUS} 3 ÷ ${rt(3)} = ${MINUS}${rt(3)}`, `3 ÷ ${rt(3)} = ${rt(3)}이므로 2${rt(3)} ${MINUS} ${rt(3)} = ${rt(3)}이다.`]
      ];
      const wantTrue = d.bool();
      return seal(claimQ(d, `다음 가운데 계산이 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, yes, no, wantTrue));
    })
  ]);

  // ── 근호를 포함한 식의 혼합 계산 ──
  const DIST = '분배법칙으로 괄호를 풀고, 근호 안을 간단히 한 다음 근호 안의 수가 같은 것끼리 모은다.';
  B.addTypes(UNIT, 'mixed', [
    T('mix-dist', '분배법칙으로 괄호 풀기', '①41', (d) => {
      const R = [2, 3, 5, 6, 7, 10, 11, 15];
      const src = d.until(() => { const a = d.pick(R), b = d.pick(R), c = d.pick(R), k = d.pick([1, 1, 2, 3]) * (d.int(0, 3) === 0 ? -1 : 1), j = d.pick([1, 1, 2, 3]); return `${co(k, a)}(${co(1, b)}${d.bool() ? '+' : '-'}${co(j, c)})`; },
        (s) => isTw(xv(s)) && !/r(\d+)\(r\1[+-]/.test(s));
      const S = xv(src);
      return tA(CALC, S, { figure: xex(src), explain: `${DIST} ${xh(src)} = ${vh(S)}이다.`, rule: 'mix-dist' });
    }),
    T('mix-dist-factor', '분배한 결과를 수 × A 꼴로 보기', '①41', (d) => {
      // √a(√b + √c) = k(√x + √y) 의 A 고르기. 틀린 보기: k로 나누지 않은 것, 한 항만 나눈 것, 근호를 간단히 하지 않은 것, 부호를 바꾼 것
      const [a, b, c, k] = d.until(() => { const x = d.pick([2, 3, 5, 6, 10]), y = d.pick([3, 5, 6, 10, 15]), z = d.pick([2, 3, 5, 15]); return [x, y, z, 0]; },
        ([x, y, z]) => { const S = xv(`r${x}(r${y}+r${z})`); if (!isTw(S)) return false; const [u, v] = S.map((t) => t.q.p); return u === v && u >= 2 && y !== z; });
      const S = xv(`r${a}(r${b}+r${c})`), kk = S[0].q.p, [u, v] = ordV(S).map((t) => t.m);
      const right = mk([[1, u], [1, v]]);
      const wrongs = [mk([[kk, u], [kk, v]]), mk([[1, u], [kk, v]]), mk([[kk, u], [1, v]]), mk([[1, a * b / (kk * kk) === u ? a * b : u], [1, v]]), mk([[1, u], [-1, v]]), mk([[1, a * b], [1, a * c]])];
      return pickV(d, `${xh(`r${a}(r${b}+r${c})`)} = ${kk}${V('A')}일 때, ${V('A')}의 값은?`, right, wrongs, {
        explain: `${xh(`r${a}(r${b}+r${c})`)} = ${rt(a * b)} + ${rt(a * c)} = ${vh(S)} = ${kk}(${vh(right)})이므로 ${V('A')} = ${vh(right)}이다.`
      });
    }),
    T('mix-divide', '두 항을 한 제곱근으로 나누기', '①42', (d) => {
      const c = d.pick([2, 3, 5, 6]);
      const src = d.until(() => { const s = d.int(2, 5), x = d.pick([2, 3, 5, 7]), t = d.int(1, 3); return `(r${c * s * s}${d.bool() ? '+' : '-'}${d.pick(['', '2', '3'])}r${c * x * t * t}):r${c}`; },
        (s) => isS(xv(s)) && Number(s.match(/r(\d+)/)[1]) <= 150);
      const S = xv(src);
      return sA(CALC, S, { figure: xex(src), explain: `괄호 안의 항을 각각 ${rt(c)}로 나눈다. ${xh(src)} = ${vh(S)}이다.`.replace(`${rt(c)}로`, `${rt(c)}${tail(c, '으로/로')}`), rule: 'mix-divide' });
    }),
    T('mix-order', '곱셈·나눗셈을 먼저 하는 혼합 계산', '①43', (d) => {
      const r = () => d.pick([2, 3, 5, 6, 7, 8, 10, 12, 14, 15, 18, 20, 21, 28, 40, 50]);
      const src = d.until(() => d.pick([
        () => `r${r()}*r${r()}-r${r()}:r${r()}`,
        () => `r${r()}-${d.int(2, 4)}r${r()}:r${r()}`,
        () => `${d.int(2, 8)}*r${r()}-${d.int(1, 5)}:r${r()}`,
        () => `-[r${r()}|r${r()}]+r${r()}`,
        () => `${d.int(2, 5)}r${r()}+${co(d.int(1, 4), r())}:r${r()}`
      ])(), (s) => { const S = xv(s); return isQ(S) && Math.abs(S[0].q.p) <= 40 && S[0].q.q <= 12 && new Set(s.match(/r\d+/g)).size === s.match(/r\d+/g).length; });
      const S = xv(src);
      return qA(CALC, S, { figure: xex(src), explain: `곱셈과 나눗셈을 먼저 계산하고 분모를 유리화한 다음 ${LIKE} ${xh(src)} = ${vh(S)}이다.`, rule: 'mix-order' });
    }),
    T('mix-combo', '분배법칙과 덧셈·뺄셈이 섞인 계산', '①44', (d) => {
      const R = [2, 3, 5, 6, 7, 10, 12, 15, 18, 24];
      const src = d.until(() => { const [a, b, c, e] = d.shuffle(R).slice(0, 4), k = d.int(1, 5), j = d.int(1, 4); return d.pick([
        `r${a}(r${b}+${k})-r${c}(r${e}-${co(j, b)})`,
        `r${a}-r${b}(${co(j, b)}-r${e})`,
        `(${co(j, a)}+r${b})r${b}-${co(k, c)}`,
        `r${a}(r${b}-${k})+r${c}`,
        `r${c}+r${a}(${co(j, a)}-${co(k, b)})`
      ]); }, (s) => { const S = xv(s); return isS(S) && Math.abs(S.find((t) => t.m === 1).q.p) <= 40 && Math.abs(S.find((t) => t.m > 1).q.p) <= 20; });
      const S = xv(src);
      return sA(CALC, S, { figure: xex(src), explain: `${DIST} ${xh(src)} = ${vh(S)}이다.`, rule: 'mix-combo' });
    }),
    T('mix-rat', '분모의 유리화가 낀 분배·혼합 계산', '①45', (d) => {
      const m = pickSqf(d, [2, 3, 5]);
      const src = d.until(() => { const k = d.int(1, 4) * m, c = d.int(1, 5), s = d.int(2, 4), t = d.until(() => d.int(1, 3), (v) => c % v !== 0 || v === 1); return d.pick([
        `[${k}|r${m}]+r${m}(${c}-r${m})-r${s * s * m}`,
        `[${k}|r${m}]-r${m}(${c}-r${m})`,
        `r${s * s * m}-r${m}([${c}|${co(t, m)}]+${t * 2})`,
        `r${m}([r${2 * m}|${t + 1}]-[${co(c, m)}|r${2}])+[${k}|r${m}]`
      ]); }, (s) => { const S = xv(s); return isS(S) && S.every((tt) => Math.abs(tt.q.p) <= 30); });
      const S = xv(src);
      return sA(CALC, S, { figure: xex(src), explain: `분모를 유리화하고 분배법칙으로 괄호를 푼 다음 ${LIKE} ${xh(src)} = ${vh(S)}이다.`, rule: 'mix-rat' });
    }),
    T('mix-binom', '분자가 두 항인 분수가 낀 혼합 계산', '①46', (d) => {
      const m = pickSqf(d, [2, 3, 5]);
      const src = d.until(() => { const s = d.int(2, 4), c = d.int(1, 4) * m, t = d.int(2, 5), x = d.pick([2, 3, 6, 8]); return d.pick([
        `r${s * s * m}-[${c}-r${t * t * m}|r${m}]`,
        `r${x}(r${2 * x}+r${m * x})-[${c}-r${m}|r${m}]`,
        `[r${s * s * x}-r${x}|r${x}]+r${m}(${t}r${x}-${s}r${m})`,
        `${t}r${m}-[r${s * s * m}+${c}|r${m}]`
      ]); }, (s) => { const S = xv(s); return isS(S) && S.every((tt) => Math.abs(tt.q.p) <= 30); });
      const S = xv(src);
      return sA(CALC, S, { figure: xex(src), explain: `분자가 두 항인 분수는 분모와 분자에 같은 수를 곱해 유리화하고, 분자의 항을 각각 나눈다. ${xh(src)} = ${vh(S)}이다.`, rule: 'mix-binom' });
    })
  ]);

  // ── 계수 맞추기와 식의 값 ──
  const twoSlots = (text, pairs, o) => seal(inline(text, pairs.map(([name], i) => grp(`${name} = {${i}}`)).join(', '), pairs.map(([, v]) => ({ answer: v, signed: true })), Object.assign({ shown: pairs.map(([name, v]) => `${name} = ${v < 0 ? MINUS + -v : v}`).join(', ') }, o)));
  B.addTypes(UNIT, 'apply', [
    T('apply-coef', '계산 결과의 꼴에 맞추어 유리수 a, b 구하기', '①47', (d, n) => {
      const a = V('a'), b = V('b');
      if (n === 0) {
        // (A√x + B√y)/√r = a√s + b√t
        const src = d.until(() => { const r = d.pick([2, 3, 5]), x = d.pick([3, 5, 6, 10, 15]) * d.pick([1, 4]), y = d.pick([2, 3, 6, 10]) * d.pick([1, 4]); return `[${co(d.int(1, 4), x)}${d.bool() ? '+' : '-'}${d.int(1, 6) * 2}r${y}|r${r}]`; },
          (s) => isTw(xv(s)) && xv(s).every((t) => Math.abs(t.q.p) <= 30));
        const S = xv(src), [t, u] = ordV(S), rr = Number(src.match(/\|r(\d+)\]$/)[1]);
        return twoSlots(`다음 등식을 만족시키는 유리수 ${a}, ${b}의 값을 차례로 적으시오.`, [[a, t.q.p], [b, u.q.p]], {
          figure: eqex(src, `ar${t.m}+br${u.m}`), explain: `분모와 분자에 ${rt(rr)}${tail(rr, '을/를')} 곱하여 유리화하면 ${xh(src)} = ${vh(S)}이므로 ${a} = ${sn(t.q.p)}, ${b} = ${sn(u.q.p)}이다.`,
          facts: { calc: [[calcOf(t), 0], [calcOf(u), 1]], rule: 'apply-coef-0' }
        });
      }
      const m = pickSqf(d, [2, 3, 5]);
      const src = d.until(() => { const s = d.int(2, 4), c = d.int(1, 4) * m, t = d.int(2, 5), x = d.pick([2, 6, 8]); return d.pick([
        `${t}r${x}(r${x}-r${3 * x})-[${c}-${co(d.int(1, 3), m)}|r${m}]`,
        `[${c}|r${m}]-r${m}(r${s * s * 2}+${t})+[${t}|r${2}]`,
        `[r${s * s * m}+${c}|r${m}]-r${m}(${t}-r${m})`
      ]); }, (s) => { const S = xv(s); return isS(S) && S.every((tt) => Math.abs(tt.q.p) <= 40); });
      const S = xv(src), [r0, t] = ordV(S);
      return twoSlots(`다음 등식을 만족시키는 유리수 ${a}, ${b}의 값을 차례로 적으시오.`, [[a, r0.q.p], [b, t.q.p]], {
        figure: eqex(src, `a+br${t.m}`), explain: `${xh(src)} = ${vh(S)}이므로 ${a} = ${sn(r0.q.p)}, ${b} = ${sn(t.q.p)}이다.`,
        facts: { calc: [[calcOf(r0), 0], [calcOf(t), 1]], rule: 'apply-coef-1' }
      });
    }, { count: 2 }),
    T('apply-rational', '계산 결과가 유리수가 되게 하는 a', '①48', (d, n) => {
      const a = V('a'), m = pickSqf(d, [2, 3, 5, 6, 7]);
      // E(a) = E0 + a × E1 로 보고, 근호 √m 의 계수(e0 + a × g)가 0이 되는 a 를 구한다.
      const parts = (s) => { const E0 = xv(s, { a: [] }), E1 = K.addV(xv(s, { a: K.numV('1') }), K.negV(E0)); return { E0, E1, e0: termOf(E0, m), g: termOf(E1, m), r0: termOf(E0, 1), r1: termOf(E1, 1) }; };
      const src = d.until(() => {
        if (n === 0) { const s = d.int(2, 5), c = d.int(1, 9); return d.pick([`a+r${s * s * m}-ar${m}+${c}`, `${c}-ar${m}+r${s * s * m}+${d.int(2, 3)}a`, `ar${m}+${c === 1 ? '' : c}a-r${s * s * m}+${d.int(1, 9)}`]); }
        const k = d.int(1, 4) * m * d.pick([1, 4]), c = d.int(1, 4), s = d.int(1, 3), t = d.pick([1, 2]), p = d.int(1, 3), q = d.int(1, 4);
        return d.pick([`[${k}-${co(c, s * s * m)}|r${m}]-${co(t, m)}(${t === 1 ? '' : t}a+r${m})`, `${co(p, m)}(${q}-r${m})-[a|r${m}](r${s * s * m}-${c})`]);
      }, (s) => { const x = parts(s); if (!x.g || !x.e0 || x.E0.concat(x.E1).some((t) => t.m !== 1 && t.m !== m)) return false; const av = qneg(B.kit.mid.qdiv(x.e0.q, x.g.q)); return isInt(av) && av.p !== 0 && Math.abs(av.p) <= 20; });
      const x = parts(src), av = qneg(B.kit.mid.qdiv(x.e0.q, x.g.q)).p;
      const lin = (c1, c0) => { const t1 = c1 ? c1.q : Q(0), t0 = c0 ? c0.q : Q(0), h1 = t1.p === 0 ? '' : (t1.p < 0 ? MINUS : '') + (t1.p === -t1.q || t1.p === t1.q ? '' : mag(B.kit.mid.qabs(t1))) + a, h0 = t0.p === 0 ? '' : mag(B.kit.mid.qabs(t0)); return h1 && h0 ? `${h1} ${t0.p < 0 ? MINUS : '+'} ${h0}` : h1 || (t0.p < 0 ? MINUS : '') + h0 || '0'; };
      return seal(N(`다음 식을 계산한 결과가 유리수가 되도록 하는 유리수 ${a}의 값은?`, av, {
        signed: true, figure: xex(src),
        explain: `식을 정리하면 (${lin(x.r1, x.r0)}) + (${lin(x.g, x.e0)})${rt(m)}이다. 유리수가 되려면 ${rt(m)}의 계수가 0이어야 하므로 ${lin(x.g, x.e0)} = 0, ${a} = ${sn(av)}이다.`,
        facts: { calc: [[`-(${K.calcOf(x.e0)})/(${K.calcOf(x.g)})`, 0]], rule: 'apply-rational-' + n }
      }));
    }, { count: 2 }),
    T('apply-eq', '√a를 한 덩이로 보는 방정식', '①49', (d) => {
      const [p, q, r, s, t] = d.until(() => [d.int(1, 5), d.int(1, 9), d.int(1, 12), d.int(1, 4), d.int(2, 5)], ([x, y, z, w, v]) => (x + w) * v === z + y && x !== w);
      const left = `${p === 1 ? '' : p}ra-${q}`, right = `${r}-${s === 1 ? '' : s}ra`;
      return seal(N(`다음 등식을 만족시키는 유리수 ${V('a')}의 값은?`, t * t, {
        signed: true, figure: eqex(left, right), explain: `${rt(V('a'))}를 한 덩이로 보면 ${p + s}${rt(V('a'))} = ${r + q}, ${rt(V('a'))} = ${t}이므로 ${V('a')} = ${t * t}이다.`.replace(`${p + s}${rt(V('a'))}`, `${p + s === 1 ? '' : p + s}${rt(V('a'))}`),
        facts: { calc: [[`((${r}+${q})/(${p}+${s}))**2`, 0]] }
      }));
    }),
    T('apply-sub', '근호가 든 수를 일차식에 대입하기', '①50', (d, n) => {
      const m = pickSqf(d, [2, 3, 5, 6, 7]);
      if (n === 0) {
        const [A, Bs, expr] = d.until(() => [`${co(d.int(1, 5), m)}${d.bool() ? '+' : '-'}${d.int(1, 6)}`, `${co(d.int(1, 5), m)}${d.bool() ? '+' : '-'}${d.int(1, 6)}`, d.pick(['2A-B', 'A-2B', '3A+B', 'A+3B', '2A+B'])],
          ([x, y, e]) => isS(xv(e, { A: xv(x), B: xv(y) })) && x !== y);
        const S = xv(expr, { A: xv(A), B: xv(Bs) });
        const put = expr.replace(/A/g, `(${A})`).replace(/B/g, `(${Bs})`);
        return sA(`${V('A')} = ${xh(A)}, ${V('B')} = ${xh(Bs)}일 때, ${xh(expr)}의 값은?`, S, { explain: `대입하면 ${xh(put)} = ${vh(S)}이다. 근호가 든 항끼리, 유리수끼리 모은다.`, rule: 'apply-sub-0' });
      }
      const [x0, expr] = d.until(() => [`r${m}${d.bool() ? '+' : '-'}${d.int(1, 6)}`, d.pick([`${d.int(2, 9)}-${d.int(2, 4)}x`, `${d.int(2, 4)}x+${d.int(1, 9)}`, `${d.int(1, 9)}-x`])], ([x, e]) => isS(xv(e, { x: xv(x) })));
      const S = xv(expr, { x: xv(x0) });
      const put = expr.replace(/x/g, `(${x0})`);
      return sA(`${V('x')} = ${xh(x0)}일 때, ${xh(expr)}의 값은?`, S, { explain: `대입하면 ${xh(put)} = ${vh(S)}이다.`, rule: 'apply-sub-1' });
    }, { count: 2 }),
    T('apply-sub-mul', '근호를 곱하여 대입하는 식의 값', '①51', (d) => {
      const [p, q] = d.until(() => [d.pick([2, 3, 5]), d.pick([2, 3, 5, 7])], ([x, y]) => x < y);
      const [A, Bs, sg] = d.until(() => [joinT([[d.int(1, 3) * (d.bool() ? 1 : -1), p], [d.int(1, 3) * (d.bool() ? 1 : -1), q]]), joinT([[d.int(1, 3) * (d.bool() ? 1 : -1), p], [d.int(1, 3) * (d.bool() ? 1 : -1), q]]), d.bool() ? '+' : '-'],
        ([x, y, s]) => isS(xv(`r${q}a${s}r${p}b`, { a: xv(x), b: xv(y) })) && x !== y);
      const expr = `r${q}a${sg}r${p}b`, S = xv(expr, { a: xv(A), b: xv(Bs) });
      return sA(`${V('a')} = ${xh(A)}, ${V('b')} = ${xh(Bs)}일 때, ${xh(expr)}의 값은?`, S, { explain: `${rt(q)}${V('a')} = ${rt(q)}(${xh(A)}) = ${vh(xv(`r${q}(${A})`))}, ${rt(p)}${V('b')} = ${vh(xv(`r${p}(${Bs})`))}이므로 구하는 값은 ${vh(S)}이다.` });
    }),
    T('apply-sym', 'x + y, x − y를 먼저 구해 식의 값 구하기', '①52', (d) => {
      const [p, q] = d.until(() => [d.int(2, 6), d.pick([2, 3, 5, 6, 7])], ([x, y]) => x * x !== y);
      const S = xv(`[2r${q}|${2 * p}]`);
      return qA(`${nb(`${V('x')} = ${p} + ${rt(q)}`)}, ${nb(`${V('y')} = ${p} ${MINUS} ${rt(q)}`)}일 때, ${frac(`${V('x')} ${MINUS} ${V('y')}`, `${V('x')} + ${V('y')}`)}의 값은?`, S, { explain: `${V('x')} + ${V('y')} = ${2 * p}, ${V('x')} ${MINUS} ${V('y')} = 2${rt(q)}이므로 ${frac(`2${rt(q)}`, 2 * p)} = ${vh(S)}이다.` });
    }),
    T('apply-sym-prod', 'x + y, x − y를 먼저 구해 곱하기', '①52', (d) => {
      const [p, q] = d.until(() => [d.pick([2, 3, 5, 7]), d.pick([2, 3, 5, 7, 11])], ([x, y]) => x > y);
      const S = xv(`r${p}r${q}`);
      return rA(`${V('x')} = ${frac(`${rt(p)} + ${rt(q)}`, 2)}, ${V('y')} = ${frac(`${rt(p)} ${MINUS} ${rt(q)}`, 2)}일 때, (${V('x')} + ${V('y')})(${V('x')} ${MINUS} ${V('y')})의 값은?`, S, { explain: `${V('x')} + ${V('y')} = ${rt(p)}, ${V('x')} ${MINUS} ${V('y')} = ${rt(q)}이므로 ${rt(p)} × ${rt(q)} = ${vh(S)}이다.` });
    }),
    T('apply-ratio', 'a + 1/a는 a의 몇 배인가', '①53', (d) => {
      const n0 = pickSqf(d, [2, 3, 5, 6, 7, 10]), a = V('a');
      return fA(`${a} = ${rt(n0)}일 때, ${a} + ${frac(1, a)}는 ${a}의 몇 배인가?`, [{ q: Q(n0 + 1, n0), m: 1, n: `(${n0}+1)`, d: String(n0), nv: n0 + 1, dv: n0 }], {
        unit: '배', explain: `${a} + ${frac(1, a)} = ${rt(n0)} + ${frac(rt(n0), n0)} = ${frac(`${n0 + 1}${rt(n0)}`, n0)} = ${frac(n0 + 1, n0)}${a}이므로 ${frac(n0 + 1, n0)}배이다.`
      });
    }),
    T('apply-ratio-sq', 'kx는 1/x의 몇 배인가', '①53', (d) => {
      const n0 = pickSqf(d, [2, 3, 5, 6, 7, 10, 11, 13, 14, 15]), k = d.int(2, 5), x = V('x');
      return seal(N(`${x} = ${rt(n0)}일 때, ${k}${x}는 ${frac(1, x)}의 몇 배인가?`, k * n0, {
        unit: '배', explain: `${k}${x} ÷ ${frac(1, x)} = ${k}${x}<sup>2</sup> = ${k} × ${n0} = ${k * n0}이므로 ${k * n0}배이다.`, facts: { calc: [[`${k}*${n0}`, 0]] }
      }));
    }),
    T('apply-solve', '등식에서 근호가 든 문자의 값 구하기', '①54', (d, n) => {
      const a = V('a'), b = V('b'), c = V('c');
      if (n === 0) {
        const [p, t] = d.until(() => [d.pick([2, 3, 5, 6, 7]), d.int(2, 5)], ([x, y]) => x * y <= 40);
        const S = xv(`[r${p * t}r${p * t}|r${p}]`);
        return rA(`${frac(a, b)} = ${frac(b, c)}이고 ${a} = ${rt(p)}, ${b} = ${rt(p * t)}일 때, ${c}의 값은?`, S, { explain: `${b}<sup>2</sup> = ${a}${c}이므로 ${c} = ${frac(b + sup(2), a)} = ${frac(p * t, rt(p))} = ${vh(S)}이다.` });
      }
      const [p, x, r, s] = d.until(() => [d.pick([2, 3, 5]), d.pick([2, 3, 5, 7]), d.pick([2, 3, 5]), d.pick([5, 6, 10, 14, 15])], ([pp, xx, rr, ss]) => isR(xv(`r${xx}*r${rr * ss}`)) && pp !== xx && rr !== ss);
      const S = xv(`r${x}*r${r * s}`);
      return rA(`${a}${rt(p)} = ${rt(p * x)}, ${frac(b, rt(r))} = ${rt(s)}일 때, ${a}${b}의 값은?`, S, { explain: `${a} = ${frac(rt(p * x), rt(p))} = ${rt(x)}, ${b} = ${rt(r)} × ${rt(s)} = ${vh(xv(`r${r * s}`))}이므로 ${a}${b} = ${vh(S)}이다.` });
    }, { count: 2 }),
    T('apply-inside', '근호 밖의 문자를 근호 안으로 넣어 식의 값 구하기', '①55', (d) => {
      const [s, u, v, m] = d.until(() => [d.int(2, 9), d.int(1, 3), d.int(1, 3), d.pick([2, 3, 5])], ([x, y, z]) => y !== z);
      const k = u * u * m, l = v * v * m, N0 = s * s, a = V('a'), b = V('b');
      const S = xv(`${s * (u + v)}r${m}`);
      return rA(`${a} &gt; 0, ${b} &gt; 0이고 ${a}${b} = ${N0}일 때, ${nb(`${a}${rt(frac(k + b, a))} + ${b}${rt(frac(l + a, b))}`)}의 값은?`, S, {
        explain: `${a} &gt; 0이므로 ${a}${rt(frac(k + b, a))} = ${rt(`${a}<sup>2</sup> × ${frac(k + b, a)}`)} = ${rt(k + a + b)}이고, 같은 방법으로 ${b}${rt(frac(l + a, b))} = ${rt(l + a + b)}이다. ${rt(k * N0)} + ${rt(l * N0)} = ${vh(S)}이다.`,
        facts: { calc: [[`(${k}*${N0}/${m})**0.5+(${l}*${N0}/${m})**0.5`, 0], [String(m), 1]] }
      });
    })
  ]);

  // ── 대소 관계와 정수 부분·소수 부분 ──
  B.addTypes(UNIT, 'compare', [
    T('cmp-steps', '두 수의 차로 대소를 가르는 과정의 빈칸', '①56', (d) => {
      const [p, c, q] = d.until(() => [d.int(3, 9), d.int(1, 8), d.int(2, 60)], ([x, y, z]) => x > y && !isSq(z) && Math.abs((x - y) ** 2 - z) <= 12);
      const r = p - c, rel1 = r * r > q ? '>' : '<', rel3 = rel1;
      const L = (s) => (s === '>' ? '&gt;' : '&lt;');
      return seal(inline(`다음은 두 수 ${p} ${MINUS} ${rt(q)}와 ${c}의 대소를 비교하는 과정이다. 빈칸에 알맞은 부등호를 차례로 고르시오.`.replace(`${rt(q)}와`, `${rt(q)}${tail(q, '과/와')}`),
        `${grp(`${r} {0} ${rt(q)}`)}이므로<br>${grp(`${r} ${MINUS} ${rt(q)} {1} 0`)}<br>따라서 ${grp(`${p} ${MINUS} ${rt(q)} {2} ${c}`)}`, [{ rel: true, answer: rel1 }, { rel: true, answer: rel1 }, { rel: true, answer: rel3 }], {
          figure: lines([`(${p} ${MINUS} ${rt(q)}) ${MINUS} ${c} = ${r} ${MINUS} ${rt(q)}`]),
          shown: `${r} ${L(rel1)} ${rt(q)}, ${r} ${MINUS} ${rt(q)} ${L(rel1)} 0, ${p} ${MINUS} ${rt(q)} ${L(rel3)} ${c}`,
          explain: `${r} = ${rt(r * r)}이고 ${r * r} ${L(rel1)} ${q}이므로 ${r} ${L(rel1)} ${rt(q)}이다. 두 수의 차 ${r} ${MINUS} ${rt(q)}${tail(q, '이/가')} ${rel1 === '>' ? '양수' : '음수'}이므로 ${p} ${MINUS} ${rt(q)} ${L(rel3)} ${c}이다.`,
          facts: { cmp: { r, q } }
        }));
    }, { standard: STD_CMP }),
    T('cmp-three', '세 수의 대소 관계', '①57', (d) => {
      const m = pickSqf(d, [2, 3, 5, 6, 7]);
      const made = d.until(() => [[1, d.int(1, 6)], [d.int(2, 3), d.int(-4, 4)], [d.int(2, 4), -d.int(1, 6)]].map(([k, c]) => ({ k, c, v: k * Math.sqrt(m) + c })),
        (list) => list.every((x) => x.v > 0.5) && new Set(list.map((x) => x.v.toFixed(6))).size === 3 && Math.max(...list.map((x) => x.v)) - Math.min(...list.map((x) => x.v)) < 6 && [0, 1, 2].sort((x, y) => list[x].v - list[y].v).join() !== '0,1,2');
      const names = ['a', 'b', 'c'], up = [0, 1, 2].sort((x, y) => made[x].v - made[y].v);
      const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]], orders = d.shuffle([up].concat(d.shuffle(perms.filter((p) => p.join() !== up.join())).slice(0, 4)));
      const srcOf = (x) => joinT([[x.k, m], [x.c, 1]].filter(([c]) => c !== 0));
      return seal(C('다음 세 수의 대소 관계를 바르게 나타낸 것은?', orders.map((o) => nb(o.map((i) => V(names[i])).join(' &lt; '))), orders.findIndex((o) => o.join() === up.join()), {
        figure: named(made.map((x, i) => [V(names[i]), srcOf(x)])),
        explain: `두 수씩 빼어 부호를 본다. ${[[0, 1], [1, 2], [0, 2]].map(([i, j]) => { const D0 = xv(`(${srcOf(made[i])})-(${srcOf(made[j])})`); return `${V(names[i])} ${MINUS} ${V(names[j])} = ${vh(D0)} ${fv(D0) > 0 ? '&gt;' : '&lt;'} 0`; }).join(', ')}이므로 ${up.map((i) => V(names[i])).join(' &lt; ')}이다.`,
        facts: { choose: { exprs: made.map((x) => `${x.k}*${m}**0.5+(${x.c})`), rule: 'ascending', orders } }
      }));
    }, { standard: STD_CMP }),
    T('cmp-frac-part', '무리수의 소수 부분', '①58', (d, n) => {
      const [k, m, c] = d.until(() => [d.int(1, 3), d.pick([2, 3, 5, 6, 7, 10, 11]), n === 0 ? d.int(0, 3) : d.int(4, 9)], ([kk, mm, cc]) => { const v = kk * Math.sqrt(mm); return n === 0 ? true : cc - v > 0.2; });
      const src = n === 0 ? joinT([[k, m]].concat(c ? [[c, 1]] : [])) : joinT([[c, 1], [-k, m]]), x = fv(xv(src)), f = Math.floor(x);
      const S = xv(`(${src})-${f}`), root = k * k * m, lo = Math.floor(Math.sqrt(root));
      return sA(`${xh(src)}의 소수 부분은?`, S, {
        explain: `${k > 1 ? `${radText(k, m)} = ${rt(root)}이고 ` : ''}${lo} &lt; ${rt(root)} &lt; ${lo + 1}이므로 ${f} &lt; ${xh(src)} &lt; ${f + 1}이다. 정수 부분은 ${f}이고, 소수 부분은 (${xh(src)}) ${MINUS} ${f} = ${vh(S)}이다.`,
        rule: 'cmp-frac-part-' + n
      });
    }, { count: 2 })
  ]);

  // ── 도형과 수직선 ──
  // 수직선 위 정사각형(B(b), C(b + s))과 두 호: 점 C를 중심으로 반지름 CA → P, 점 B를 중심으로 반지름 BD → Q
  function squareLine(b, s) {
    const r2 = Math.SQRT2, lo = b + s - s * r2 - 0.35, hi = b + s * r2 + 0.35, u = Math.min(64, 250 / (hi - lo)), X = (v) => 16 + (v - lo) * u, Y0 = 28 + s * u, R = (v) => Math.round(v * 10) / 10;
    const P = b + s - s * r2, Qv = b + s * r2, xb = X(b), xc = X(b + s), top = Y0 - s * u;
    let out = `<line class="mb-axis" x1="${R(X(lo) - 6)}" y1="${R(Y0)}" x2="${R(X(hi) + 6)}" y2="${R(Y0)}"/><path d="M${R(X(hi) + 12)} ${R(Y0)}l-7 -3.4v6.8z" style="fill:#1f2933"/><path d="M${R(X(lo) - 12)} ${R(Y0)}l7 -3.4v6.8z" style="fill:#1f2933"/>`;
    for (let v = Math.ceil(lo); v <= hi; v += 1) out += `<line class="mb-axis" x1="${R(X(v))}" y1="${R(Y0 - 4)}" x2="${R(X(v))}" y2="${R(Y0 + 4)}"/>`;
    out += `<rect x="${R(xb)}" y="${R(top)}" width="${R(s * u)}" height="${R(s * u)}" style="fill:rgba(250,204,21,0.25);stroke:#1f2933;stroke-width:1.4"/>`;
    out += `<line x1="${R(xb)}" y1="${R(Y0)}" x2="${R(xc)}" y2="${R(top)}" style="stroke:#1f2933;stroke-width:1"/><line x1="${R(xb)}" y1="${R(top)}" x2="${R(xc)}" y2="${R(Y0)}" style="stroke:#1f2933;stroke-width:1"/>`;
    const rad = s * r2 * u;
    out += `<path d="M${R(xb)} ${R(top)}A${R(rad)} ${R(rad)} 0 0 0 ${R(X(P))} ${R(Y0)}" style="fill:none;stroke:#b42318;stroke-width:1.3;stroke-dasharray:4 3"/>`;
    out += `<path d="M${R(xc)} ${R(top)}A${R(rad)} ${R(rad)} 0 0 1 ${R(X(Qv))} ${R(Y0)}" style="fill:none;stroke:#b42318;stroke-width:1.3;stroke-dasharray:4 3"/>`;
    out += `<circle class="mb-dot" cx="${R(X(P))}" cy="${R(Y0)}" r="3"/><circle class="mb-dot" cx="${R(X(Qv))}" cy="${R(Y0)}" r="3"/>`;
    const T0 = (x, y, t, anchor, extra) => `<text class="mb-km-label" style="font-size:13px${extra || ''}" x="${R(x)}" y="${R(y)}" text-anchor="${anchor || 'middle'}">${t}</text>`;
    out += T0(xb - 5, top - 5, 'A', 'end') + T0(xc + 5, top - 5, 'D', 'start') + T0(xb - 5, Y0 - 6, 'B', 'end') + T0(xc + 5, Y0 - 6, 'C', 'start');
    out += T0(xb, Y0 + 18, b < 0 ? MINUS + -b : String(b)) + T0(xc, Y0 + 18, b + s < 0 ? MINUS + -(b + s) : String(b + s)) + T0(X(P), Y0 + 18, 'P') + T0(X(Qv), Y0 + 18, 'Q');
    const W = X(hi) + 22, H = Y0 + 26;
    const said = `수직선 위에 점 B(${b})와 점 C(${b + s})를 한 변으로 하는 정사각형 ABCD가 있다. 점 A는 B 위, 점 D는 C 위에 있고 대각선 AC, BD를 그었다. 점 C를 중심으로 하고 C에서 A까지를 반지름으로 하는 원이 B의 왼쪽에서 수직선과 만나는 점이 P이고, 점 B를 중심으로 하고 B에서 D까지를 반지름으로 하는 원이 C의 오른쪽에서 수직선과 만나는 점이 Q이다.`;
    return `<svg class="mb-geo" viewBox="0 0 ${R(W)} ${R(H)}" width="${Math.round(W)}" role="img" aria-label="${said}">${out}</svg>`;
  }
  // 이어 붙인 정사각형 셋(밑변을 맞추어 왼쪽부터). sides: 변의 길이의 비, names: 안에 적을 이름, marks: 밑변 위에 적을 점 이름(경계마다)
  function squaresRow(sides, names, marks) {
    const big = Math.max(...sides), u = Math.min(150 / big, 250 / sides.reduce((s, v) => s + v, 0)), base = 12 + big * u, R = (v) => Math.round(v * 10) / 10;
    let x = 14, out = '';
    const xs = [x];
    sides.forEach((s, i) => {
      out += `<rect x="${R(x)}" y="${R(base - s * u)}" width="${R(s * u)}" height="${R(s * u)}" style="fill:${['rgba(147,197,253,0.45)', 'rgba(253,186,116,0.45)', 'rgba(134,239,172,0.45)'][i]};stroke:#1f2933;stroke-width:1.3"/>`;
      out += `<text class="mb-km-label" style="font-size:13px" x="${R(x + s * u / 2)}" y="${R(base - s * u / 2 + 4.5)}" text-anchor="middle">${names[i]}</text>`;
      x += s * u; xs.push(x);
    });
    if (marks) marks.forEach((name, i) => { out += `<circle class="mb-dot" cx="${R(xs[i])}" cy="${R(base)}" r="2.6"/><text class="mb-km-label" style="font-size:13px" x="${R(xs[i])}" y="${R(base + 17)}" text-anchor="middle">${name}</text>`; });
    const W = x + 14, H = base + (marks ? 24 : 8);
    const said = `정사각형 ${names.join(', ')}을 왼쪽부터 밑변을 한 직선 위에 맞추어 이어 붙였다.${marks ? ` 밑변 위의 점은 왼쪽부터 ${marks.join(', ')}이고, 점과 점 사이가 차례로 ${names.join(', ')}의 한 변이다.` : ` 왼쪽의 정사각형일수록 크다.`}`;
    return `<svg class="mb-geo" viewBox="0 0 ${R(W)} ${R(H)}" width="${Math.round(W)}" role="img" aria-label="${said}">${out}</svg>`;
  }
  // 좌표평면 위의 직각이등변삼각형 셋: OAB(∠A = 90°), ACD(∠C = 90°), CEF(∠E = 90°). legs: 세 삼각형의 직각을 낀 변의 길이(어림값)
  function triangles3(legs) {
    const total = legs.reduce((s, v) => s + v, 0), u = 224 / total, H = Math.max(...legs) * u, R = (v) => Math.round(v * 10) / 10, ox = 22, oy = 30 + H;
    let x = ox, out = `<line class="mb-axis" x1="${ox - 12}" y1="${R(oy)}" x2="${R(ox + total * u + 22)}" y2="${R(oy)}"/><path d="M${R(ox + total * u + 28)} ${R(oy)}l-7 -3.4v6.8z" style="fill:#1f2933"/>`
      + `<line class="mb-axis" x1="${ox}" y1="${R(oy + 10)}" x2="${ox}" y2="14"/><path d="M${ox} 9l-3.4 7h6.8z" style="fill:#1f2933"/>`
      + `<text x="${R(ox + total * u + 26)}" y="${R(oy + 15)}" style="font-size:13px;font-style:italic;fill:#1f2933">x</text><text x="${ox + 7}" y="18" style="font-size:13px;font-style:italic;fill:#1f2933">y</text>`
      + `<text class="mb-km-label" style="font-size:12px" x="${ox - 9}" y="${R(oy + 15)}" text-anchor="middle">O</text>`;
    const tops = ['B', 'D', 'F'], feet = ['A', 'C', 'E'], areas = ['P', 'Q', 'R'];
    legs.forEach((L, i) => {
      const x1 = x + L * u, y1 = oy - L * u;
      out += `<path d="M${R(x)} ${R(oy)}L${R(x1)} ${R(oy)}L${R(x1)} ${R(y1)}Z" style="fill:rgba(147,197,253,0.4);stroke:#1f2933;stroke-width:1.3;stroke-linejoin:round"/>`;
      out += `<path d="M${R(x1 - 7)} ${R(oy)}V${R(oy - 7)}H${R(x1)}" style="fill:none;stroke:#1f2933;stroke-width:1"/>`;
      out += `<text class="mb-km-label" style="font-size:13px" x="${R(x1)}" y="${R(oy + 16)}" text-anchor="middle">${feet[i]}</text><text class="mb-km-label" style="font-size:13px" x="${R(x1 + 2)}" y="${R(y1 - 5)}" text-anchor="middle">${tops[i]}</text>`;
      out += `<text style="font-size:12px;font-style:italic;fill:#1f2933" x="${R(x1 - L * u * 0.32)}" y="${R(oy - L * u * 0.22)}" text-anchor="middle">${areas[i]}</text>`;
      x = x1;
    });
    const W = ox + total * u + 42, Hh = oy + 24;
    return `<svg class="mb-geo" viewBox="0 0 ${R(W)} ${R(Hh)}" width="${Math.round(W)}" role="img" aria-label="좌표평면의 x축 위에 직각이등변삼각형 OAB, ACD, CEF가 차례로 이어져 있다. 점 O는 원점이고 점 A, C, E는 x축 위에 있으며, 각 삼각형의 직각인 꼭짓점은 A, C, E이다. 넓이는 각각 P, Q, R이다.">${out}</svg>`;
  }
  // 화면 분할 무늬: 위의 직선에 A, F, E, 아래 직선에 B, C, D. AC와 FD는 두 직선에 수직이다.
  function hambidge(bc, cd, fe, h) {
    const u = 200 / (bc + cd + Math.max(fe, 0.3)), R = (v) => Math.round(v * 10) / 10, y0 = 24, y1 = 24 + h * u, x0 = 18;
    const Bp = [x0, y1], Cp = [x0 + bc * u, y1], Dp = [x0 + (bc + cd) * u, y1], Ap = [Cp[0], y0], Fp = [Dp[0], y0], Ep = [Dp[0] + fe * u, y0];
    const L = (p, q, dash) => `<line x1="${R(p[0])}" y1="${R(p[1])}" x2="${R(q[0])}" y2="${R(q[1])}" style="stroke:#1f2933;stroke-width:1.3${dash ? ';stroke-dasharray:4 3' : ''}"/>`;
    let out = `<path d="M${R(Bp[0])} ${R(Bp[1])}L${R(Ap[0])} ${R(Ap[1])}L${R(Ep[0])} ${R(Ep[1])}L${R(Dp[0])} ${R(Dp[1])}Z" style="fill:rgba(250,204,21,0.18);stroke:none"/>`;
    out += L(Bp, Dp) + L(Ap, Ep) + L(Bp, Ap) + L(Ep, Dp) + L(Ap, Cp) + L(Fp, Dp);
    out += `<path d="M${R(Cp[0] + 7)} ${R(y1)}V${R(y1 - 7)}H${R(Cp[0])}" style="fill:none;stroke:#1f2933;stroke-width:1"/><path d="M${R(Dp[0] - 7)} ${R(y1)}V${R(y1 - 7)}H${R(Dp[0])}" style="fill:none;stroke:#1f2933;stroke-width:1"/>`;
    const T0 = (p, t, dx, dy) => `<text class="mb-km-label" style="font-size:13px" x="${R(p[0] + dx)}" y="${R(p[1] + dy)}" text-anchor="middle">${t}</text>`;
    out += T0(Ap, 'A', 0, -4) + T0(Fp, 'F', 0, -4) + T0(Ep, 'E', 0, -4) + T0(Bp, 'B', -6, 15) + T0(Cp, 'C', 0, 15) + T0(Dp, 'D', 0, 15);
    const W = Ep[0] + 18, H = y1 + 24;
    return `<svg class="mb-geo" viewBox="0 0 ${R(W)} ${R(H)}" width="${Math.round(W)}" role="img" aria-label="위의 직선 위에 왼쪽부터 점 A, F, E가 있고, 아래 직선 위에 왼쪽부터 점 B, C, D가 있다. 두 직선은 평행하고, 선분 AC와 FD는 두 직선에 수직이다. 선분 BA, AE, ED, DB로 둘러싸인 사각형 ABDE를 그렸다.">${out}</svg>`;
  }

  B.addTypes(UNIT, 'figure', [
    T('fig-numline', '수직선 위 정사각형의 대각선으로 잡은 두 점 사이의 거리', '①59', (d) => {
      const s = d.pick([1, 1, 2]), b = d.int(-3, 5), num = (v) => (v < 0 ? MINUS + -v : String(v));
      const S = xv(`(${b}+${s}r2)-(${b + s}-${s}r2)`.replace(/\+-/g, '-'));
      return sA(`다음 그림과 같이 수직선 위의 두 점 B(${b < 0 ? MINUS + -b : b}), C(${b + s < 0 ? MINUS + -(b + s) : b + s})에 대하여 ${SG('BC')}를 한 변으로 하는 정사각형 ABCD가 있다. 수직선 위에 ${SG('CA')} = ${SG('CP')}, ${SG('BD')} = ${SG('BQ')}인 두 점 P, Q를 잡을 때, ${SG('PQ')}의 길이는?`, S, {
        figure: squareLine(b, s),
        explain: `대각선의 길이는 ${s === 1 ? rt(2) : `${rt(`${s}<sup>2</sup> + ${s}<sup>2</sup>`)} = ${radText(s, 2)}`}이다. 점 P의 좌표는 ${num(b + s)} ${MINUS} ${radText(s, 2)}, 점 Q의 좌표는 ${num(b)} + ${radText(s, 2)}이므로 ${SG('PQ')} = (${num(b)} + ${radText(s, 2)}) ${MINUS} (${num(b + s)} ${MINUS} ${radText(s, 2)}) = ${vh(S)}이다.`
      });
    }),
    T('fig-squares', '이어 붙인 정사각형의 넓이로 길이 구하기', '①60', (d, n) => {
      const m = pickSqf(d, [2, 3, 5]), unit = 'cm';
      const sides = d.until(() => (n === 0 ? range(1, 3).map(() => d.int(1, 5)) : d.shuffle([d.int(2, 7), d.int(2, 7), d.int(2, 7)]).sort((x, y) => y - x)), (l) => new Set(l).size === 3 && Math.max(...l) / Math.min(...l) <= 4);
      const areas = sides.map((s) => s * s * m), names = ['㉠', '㉡', '㉢'];
      if (n === 0) {
        const [from, to] = d.pick([[0, 2], [1, 3], [0, 3]]), marks = ['A', 'B', 'C', 'D'], k = sides.slice(from, to).reduce((s, v) => s + v, 0);
        const S = xv(sides.slice(from, to).map((s) => `r${s * s * m}`).join('+'));
        return rA(`다음 그림과 같이 넓이가 각각 ${areas.join(', ')}인 세 정사각형 ${names.join(', ')}을 한 직선 위에 이어 붙였다. ${SG(marks[from] + marks[to])}의 길이는?`, S, {
          figure: squaresRow(sides, names, marks), explain: `세 정사각형의 한 변의 길이는 각각 ${sides.map((s, i) => `${rt(areas[i])} = ${radText(s, m)}`).join(', ')}이다. ${SG(marks[from] + marks[to])} = ${sides.slice(from, to).map((s) => radText(s, m)).join(' + ')} = ${radText(k, m)}이다.`
        });
      }
      const width = sides.reduce((s, v) => s + v, 0), k = 2 * width + 2 * sides[0];
      const S = xv(`2(${sides.map((s) => `r${s * s * m}`).join('+')})+2r${areas[0]}`);
      return rA(`다음 그림과 같이 넓이가 각각 ${areas.map((a) => a + ' cm²').join(', ')}인 세 정사각형 ${names.join(', ')}을 밑변을 맞추어 이어 붙여 새로운 도형을 만들었다. 이 도형의 둘레의 길이는?`, S, {
        unit, figure: squaresRow(sides, names), explain: `세 정사각형의 한 변의 길이는 각각 ${sides.map((s, i) => `${radText(s, m)} cm`).join(', ')}이다. 둘레는 가로의 길이의 2배와 가장 큰 정사각형의 높이의 2배를 더한 것과 같으므로 2 × (${sides.map((s) => radText(s, m)).join(' + ')}) + 2 × ${radText(sides[0], m)} = ${radText(k, m)} (cm)이다.`
      });
    }, { count: 2 }),
    T('fig-tri-coord', '이어 놓은 직각이등변삼각형의 꼭짓점의 좌표', '①60', (d) => {
      const s = d.int(2, 5), P = Q(s * s, 2);
      const x0 = xv(`${s}+${s}r2+${2 * s}`), [r0, t] = ordV(x0);
      return seal(inline(`다음 그림과 같이 좌표평면 위에 있는 세 직각이등변삼각형 OAB, ACD, CEF의 넓이를 각각 ${V('P')}, ${V('Q')}, ${V('R')}라 하자. ${V('P')} = ${mag(P)}, ${V('Q')} = 2${V('P')}, ${V('R')} = 2${V('Q')}일 때, 점 F의 좌표는? (단, 점 O는 원점이고, 세 점 A, C, E는 ${V('x')}축 위에 있다.) ${ONE}`,
        grp('(' + '{0} {1}' + rt('{2}') + ',') + ' ' + grp('{3})'), [{ answer: r0.q.p, signed: true }, { answer: t.q.p, signed: true }, { answer: t.m }, { answer: 2 * s, signed: true }], {
          figure: triangles3([s, s * Math.SQRT2, 2 * s]), shown: `(${vh(x0)}, ${2 * s})`,
          explain: `직각이등변삼각형의 넓이가 ${frac(1, 2)} × (직각을 낀 변)<sup>2</sup>이므로 ${SG('OA')} = ${s}, ${SG('AC')} = ${rt(2 * s * s)} = ${radText(s, 2)}, ${SG('CE')} = ${rt(4 * s * s)} = ${2 * s}이다. 점 F의 ${V('x')}좌표는 ${s} + ${radText(s, 2)} + ${2 * s} = ${vh(x0)}, ${V('y')}좌표는 ${SG('EF')} = ${2 * s}이다.`,
          facts: { calc: [[calcOf(r0), 0], [calcOf(t), 1], [String(t.m), 2], [`(4*${s * s}/2*2)**0.5`, 3]] }
        }));
    }),
    T('fig-trap', '근호가 든 길이로 사다리꼴의 넓이', '①61', (d) => {
      const [p, q] = d.until(() => [d.pick([2, 3, 5, 6, 7, 10, 11]), d.pick([2, 6, 10, 14])], ([x, y]) => x !== y && !isSq(x * y) && x * y <= 70);
      const S = xv(`[(r${p}+(r${p}+r${q}))*r${q}|2]`);
      return sA(`윗변의 길이가 ${rt(p)} cm, 아랫변의 길이가 (${rt(p)} + ${rt(q)}) cm, 높이가 ${rt(q)} cm인 사다리꼴의 넓이는?`, S, {
        unit: 'cm²', explain: `${frac(1, 2)} × {${rt(p)} + (${rt(p)} + ${rt(q)})} × ${rt(q)} = ${frac(1, 2)} × (2${rt(p)} + ${rt(q)}) × ${rt(q)} = ${frac(`2${rt(p * q)} + ${q}`, 2)} = ${vh(S)} (cm²)이다.`
      });
    }),
    T('fig-tri-perim', '근호가 든 세 변으로 삼각형의 둘레', '①62', (d) => {
      const [m, n0] = d.shuffle([2, 3, 5]).slice(0, 2);
      const sides = d.until(() => [`${d.int(3, 5)}r${m}-${co(d.int(1, 2), n0)}`, `${d.int(1, 3)}+[${d.int(1, 5)}|r${n0}]`, `r${d.int(2, 3) ** 2 * m}`],
        (l) => { const v = l.map((s) => fv(xv(s))); return v.every((x) => x > 0.3) && v[0] < v[1] + v[2] && v[1] < v[0] + v[2] && v[2] < v[0] + v[1] && xv(l[1]).some((t) => t.m > 1 && t.q.q > 1); });
      const S = xv(sides.map((s) => `(${s})`).join('+'));
      if (!(S.length === 3 || S.length === 2) || S.every((t) => t.q.q === 1)) throw new Error('보기 꼴이 아니다');
      const tw = (f) => S.map((t) => Object.assign({}, t, { q: f(t) }));
      const wrongs = [tw((t) => (t.m === n0 ? qneg(t.q) : t.q)), tw((t) => (t.m === n0 && t.q.q > 1 ? qmul(t.q, Q(n0)) : t.q)), tw((t) => (t.m === m ? qadd(t.q, Q(-1)) : t.q)), tw((t) => (t.m === 1 ? qadd(t.q, Q(1)) : t.q)), tw((t) => (t.m === m ? qadd(t.q, Q(1)) : t.q))];
      return pickV(d, `세 변의 길이가 각각 (${xh(sides[0])}) cm, (${xh(sides[1])}) cm, ${xh(sides[2])} cm인 삼각형의 둘레의 길이는?`, S, wrongs, {
        show: (v) => vh(v) + ' (cm)', explain: `세 변의 길이를 모두 더한다. 분모를 유리화하고 근호 안을 간단히 하면 ${sides.map((s) => vh(xv(s))).join(', ')}이므로 둘레의 길이는 ${vh(S)} (cm)이다.`
      });
    }),
    T('fig-box-vol', '근호가 든 모서리로 직육면체의 부피', '①63', (d) => {
      const [a, b] = d.until(() => [d.pick([2, 3, 5, 6, 8, 10, 12]), d.pick([2, 3, 5, 6, 8, 10, 12])], ([x, y]) => x < y && isTw(xv(`r${x}r${y}(r${x}+r${y})`)) && !isSq(x * y));
      const S = xv(`r${a}r${b}(r${a}+r${b})`);
      return tA(`세 모서리의 길이가 각각 (${rt(a)} + ${rt(b)}) cm, ${rt(a)} cm, ${rt(b)} cm인 직육면체의 부피는?`, S, {
        unit: 'cm³', explain: `${rt(a)} × ${rt(b)} × (${rt(a)} + ${rt(b)}) = ${vh(xv(`r${a * b}`))}(${rt(a)} + ${rt(b)}) = ${vh(S)} (cm³)이다.`
      });
    }),
    T('fig-box-area', '근호가 든 모서리로 직육면체의 겉넓이', '①63', (d) => {
      const [a, b] = d.until(() => [d.pick([2, 3, 5, 6, 8, 10, 12]), d.pick([2, 3, 5, 6, 8, 10, 12])], ([x, y]) => x < y && !isSq(x * y));
      const S = xv(`2(r${a}r${b}+r${a}(r${a}+r${b})+r${b}(r${a}+r${b}))`);
      return sA(`세 모서리의 길이가 각각 ${rt(a)} cm, ${rt(b)} cm, (${rt(a)} + ${rt(b)}) cm인 직육면체의 겉넓이는?`, S, {
        unit: 'cm²', explain: `겉넓이는 2{${rt(a)} × ${rt(b)} + ${rt(a)}(${rt(a)} + ${rt(b)}) + ${rt(b)}(${rt(a)} + ${rt(b)})} = 2(${a + b} + 3${rt(a * b)}) = ${vh(S)} (cm²)이다.`
      });
    }),
    T('fig-rect-perim', '가로와 넓이로 직사각형의 둘레 구하기', '①25', (d) => {
      const [p, x, k, t] = d.until(() => [d.pick([2, 3, 5, 6, 7, 10]), d.pick([2, 3, 5, 7, 11]), d.int(2, 9) * d.pick([1, 10]), d.int(2, 9)], ([pp, xx]) => pp !== xx && gcd(pp, xx) === 1);
      const width = xv(`${k}r${p}`), area = xv(`${k * t}r${p * x}`), S = xv(`2(${k}r${p}+${t}r${x})`);
      return tA(`가로의 길이가 ${vh(width)} m이고 넓이가 ${vh(area)} m²인 직사각형 모양의 수영장이 있다. 이 수영장의 둘레의 길이는?`, S, {
        unit: 'm', explain: `세로의 길이는 ${vh(area)} ÷ ${vh(width)} = ${radText(t, x)} (m)이다. 둘레의 길이는 2 × (${vh(width)} + ${radText(t, x)}) = ${vh(S)} (m)이다.`
      });
    }),
    T('fig-ratio', '화면 분할 무늬에서 넓이의 비', '①64', (d) => {
      const [p, q, r] = d.until(() => [d.pick([2, 3, 5]), d.pick([2, 3, 5, 6, 7]), d.pick([2, 3, 5])], ([x, y]) => x !== y && !isSq(x * y));
      const which = d.bool();
      const right = which ? mk([[1, 1], [Q(1, 2 * p), p * q]]) : mk([[Q(3, 2), 1], [Q(1, 2 * p), p * q]]);
      const wrongs = [mk([[1, 1], [Q(1, p), p * q]]), mk([[Q(3, 2), 1], [Q(1, p), p * q]]), which ? mk([[Q(3, 2), 1], [Q(1, 2 * p), p * q]]) : mk([[1, 1], [Q(1, 2 * p), p * q]]), mk([[2, 1], [Q(1, 2 * p), p * q]]), mk([[1, 1], [Q(1, 2), p * q]]), mk([[Q(1, 2), 1], [Q(1, 2 * p), p * q]])];
      const shape = which ? '사다리꼴 ACDE' : '사각형 ABDE';
      return pickV(d, `다음 그림에서 사각형 ACDF는 직사각형이고 ${SG('BC')} = ${SG('CD')} = ${SG('AF')} = ${rt(p)}, ${SG('FE')} = ${rt(q)}, ${SG('AC')} = ${rt(r)}이다. ${shape}의 넓이는 직사각형 ACDF의 넓이의 몇 배인가?`, right, wrongs, {
        figure: hambidge(Math.sqrt(p), Math.sqrt(p), Math.sqrt(q), Math.sqrt(r)), show: (v) => vh(v) + '배',
        explain: `직사각형 ACDF의 넓이는 ${rt(p)} × ${rt(r)} = ${rt(p * r)}이다. ${shape}의 넓이는 ${frac(1, 2)} × (${which ? `${SG('AE')} + ${SG('CD')}` : `${SG('AE')} + ${SG('BD')}`}) × ${rt(r)} = ${frac(1, 2)} × (${which ? `2${rt(p)} + ${rt(q)}` : `3${rt(p)} + ${rt(q)}`}) × ${rt(r)}이다. 넓이를 나누면 ${frac(which ? `2${rt(p)} + ${rt(q)}` : `3${rt(p)} + ${rt(q)}`, `2${rt(p)}`)} = ${vh(right)}이므로 ${vh(right)}배이다.`
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
