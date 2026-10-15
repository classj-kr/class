// 중학교 3학년 1학기 5단원 이차함수와 그 그래프 — 뒤쪽 묶음(그래프의 성질, 그래프 위의 점과 이차함수의 식, 그래프 위의 점과 길이).
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 9-1-5a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, box, N, M, C, F } = B.kit;
  const { LAB, MINUS, Q, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, isInt, fl, tx, nb, tail, lastOf, js, V, sup, nz, pm, ansV, asQ, claimQ, plain, rt, radText, radAns, sqParts, SG } = B.kit.mid;
  const K9 = B.kit.m915;
  const { S22, T, X, Y, A, BB, K, MM, PP, QQ, X2, XA, YA, TAG6, num, iq, jn, par, nj, is, quad, eqY, eqA, pt, ptj, sgnTerm, grid2, rows1, tagsOf, setPick, xyTable, sqOf, times, MAGS, sgnQ, absJ, convex, coefs, fxs, geo, geoOk, geoWhy, mini, picks } = K9;
  const key = (q) => q.p + '/' + q.q;
  const same = (p, q) => qcmp(asQ(p), asQ(q)) === 0;
  const absQ = (q) => qabs(asQ(q));
  const up = (a) => num(a) > 0;
  // 부호가 같고 크기가 다른 계수 n개(크기 차례로)
  const sameSign = (d, n, s, pool) => d.shuffle(pool || MAGS).slice(0, n).sort((p, q) => fl(p) - fl(q)).map((m) => sgnQ(s, m));
  // 범위의 글: lo < a < hi
  const rangeText = (lo, hi, v) => nb(`${iq(lo)} &lt; ${v || A} &lt; ${iq(hi)}`);
  // 수 하나를 넣어 보는 검사 식(그 수가 범위 안인가)은 solver 가 따로 본다.

  // ── 모양만 보이는 그림의 포물선(눈금 없는 그림) ──
  // 실제 계수와 상관없이 보기 좋은 크기로 그린다. disp(차례): 폭의 차례대로 좁은 것부터의 크기.
  const DISP = [3, 1.6, 0.85, 0.45, 0.24];
  const shapeBox = (dirs) => ({ x: [-3, 3], y: dirs.includes(-1) && dirs.includes(1) ? [-4, 4] : dirs.includes(1) ? [-0.6, 4.6] : [-4.6, 0.6], grid: false, ticks: 'none' });
  const widthWords = (names) => names.length === 2 ? `${names[0]}이 ${names[1]}보다 폭이 좁다` : `폭은 ${names[0]}이 가장 좁고 ${names.slice(1).join(', ')}의 차례로 넓어진다`;

  B.addTypes('9-1-5', 'nature', [
    T('nature-claims-one', '한 그래프에 대한 설명의 참·거짓', '①23', (d, n) => {
      const a = sgnQ(pm(d), d.pick(MAGS.slice(1, 9))), u = up(a), right = d.bool();
      const p = d.until(() => nz(d, -3, 3), (v) => isInt(qmul(a, Q(v * v))) || d.bool()), yp = qmul(a, Q(p * p));
      const narrower = MAGS.filter((m) => fl(m) < Math.abs(fl(a))), wider = MAGS.filter((m) => fl(m) > Math.abs(fl(a)));
      const cmpYes = narrower.length && (d.bool() || !wider.length) ? [sgnQ(pm(d), d.pick(narrower)), '좁다'] : [sgnQ(pm(d), d.pick(wider)), '넓다'];
      const cmpNo = cmpYes[1] === '좁다' ? [cmpYes[0], '넓다'] : [cmpYes[0], '좁다'];
      const trend = u === right ? '증가' : '감소', other = trend === '증가' ? '감소' : '증가', side = `${X} ${right ? '&gt;' : '&lt;'} 0`;
      const yes = [
        `꼭짓점의 좌표는 ${pt(0, 0)}이다.`,
        `${YA}을 축으로 하는 포물선이다.`,
        `${convex(a)} 볼록하다.`,
        `점 ${ptj(p, yp, '을/를')} 지난다.`,
        `제${u ? '1, 2' : '3, 4'}사분면을 지난다.`,
        `${nb(side)}일 때, ${X}의 값이 증가하면 ${Y}의 값은 ${trend}한다.`,
        `이차함수 ${eqA(qneg(a))}의 그래프와 ${XA}에 서로 대칭이다.`,
        `이차함수 ${eqA(cmpYes[0])}의 그래프보다 폭이 ${cmpYes[1]}.`
      ];
      const no = [
        [`${XA}을 축으로 하는 포물선이다.`, `${YA}을 축으로 하는 포물선이다.`, yes[1]],
        [`${u ? '위로' : '아래로'} 볼록하다.`, `${X}${sup(2)}의 계수가 ${u ? '양수' : '음수'}이므로 ${convex(a)} 볼록하다.`, yes[2]],
        [`점 ${ptj(p, qneg(yp), '을/를')} 지난다.`, `${is(X, p)}일 때 ${is(Y, yp)}이다.`, yes[3]],
        [`제${u ? '3, 4' : '1, 2'}사분면을 지난다.`, `제${u ? '1, 2' : '3, 4'}사분면을 지난다.`, yes[4]],
        [`${nb(side)}일 때, ${X}의 값이 증가하면 ${Y}의 값은 ${other}한다.`, `${nb(side)}일 때, ${X}의 값이 증가하면 ${Y}의 값은 ${trend}한다.`, yes[5]],
        [`이차함수 ${eqA(qneg(a))}의 그래프와 ${YA}에 서로 대칭이다.`, `이차함수 ${eqA(qneg(a))}의 그래프와는 ${XA}에 서로 대칭이다.`, yes[6]],
        [`이차함수 ${eqA(cmpNo[0])}의 그래프보다 폭이 ${cmpNo[1]}.`, `${X}${sup(2)}의 계수의 절댓값을 비교하면 폭이 ${cmpYes[1]}.`, yes[7]],
        [`꼭짓점의 좌표는 ${pt(0, a)}이다.`, `꼭짓점의 좌표는 ${pt(0, 0)}이다.`, yes[0]],
        [`축의 방정식은 ${is(Y, 0)}이다.`, `축의 방정식은 ${is(X, 0)}이다.`, yes[1]]
      ];
      const want = n === 0;
      const item = claimQ(d, `이차함수 ${eqA(a)}의 그래프에 대한 설명으로 ${want ? '옳은' : '옳지 않은'} 것은?`, yes, no, want);
      return Object.assign(item, { facts: Object.assign(item.facts, { rule: want ? 'claim-yes' : 'claim-no' }) });
    }, { count: 2 }),
    T('nature-claims-many', '여러 그래프에 걸친 설명의 참·거짓', '①24', (d, n) => {
      if (n === 0) {
        const POOL = [
          (d0) => { const m = d0.pick(MAGS.slice(1)), s = pm(d0), t = d0.bool(); const b = t ? sgnQ(-s, m) : sgnQ(-s, Q(m.q, m.p)); return { h: `두 이차함수 ${eqA(sgnQ(s, m))}과 ${eqA(b)}의 그래프는 ${XA}에 서로 대칭이다.`, ok: t }; },
          (d0) => { const a = sgnQ(pm(d0), d0.pick(MAGS)), t = d0.bool(); return { h: t ? `이차함수 ${eqA(a)}의 그래프는 원점을 꼭짓점으로 한다.` : `이차함수 ${eqA(a)}의 그래프는 점 ${ptj(0, a, '을/를')} 꼭짓점으로 한다.`, ok: t }; },
          (d0) => { const [p, q] = d0.shuffle(MAGS).slice(0, 2).map((m) => sgnQ(pm(d0), m)); return { h: `이차함수 ${eqA(p)}의 그래프는 이차함수 ${eqA(q)}의 그래프보다 폭이 좁다.`, ok: Math.abs(fl(p)) > Math.abs(fl(q)) }; },
          (d0) => { const t = d0.bool(); return { h: `이차함수 ${eqY(A + X2)}의 그래프는 ${t ? YA : XA}에 대칭인 포물선이다.`, ok: t }; },
          (d0) => { const t = d0.bool(); return { h: `이차함수 ${eqY(A + X2)}의 그래프는 ${A}의 ${t ? '절댓값이' : '값이'} 클수록 폭이 좁아진다.`, ok: t }; },
          (d0) => { const neg = d0.bool(), t = d0.bool(); return { h: `이차함수 ${eqY(A + X2)}에서 ${nb(`${A} ${neg ? '&lt;' : '&gt;'} 0`)}이면 ${nb(`${X} &gt; 0`)}일 때 ${X}의 값이 증가하면 ${Y}의 값은 ${(neg !== t) ? '증가' : '감소'}한다.`, ok: t }; },
          (d0) => { const neg = d0.bool(), t = d0.bool(); return { h: `이차함수 ${eqY(A + X2)}의 그래프는 ${nb(`${A} ${neg ? '&lt;' : '&gt;'} 0`)}이면 제${(neg !== t) ? '1, 2' : '3, 4'}사분면을 지난다.`, ok: t }; }
        ];
        const rows = d.until(() => d.shuffle(POOL).slice(0, 3).map((f) => f(d)), (rs) => rs.some((r) => r.ok));
        const pick = setPick(d, rows.map((r) => r.ok), TAG6, 4);
        return C(`이차함수의 그래프에 대한 다음 설명 중 옳은 것을 모두 고른 것은?`, pick.options, pick.at, {
          figure: rows1(rows.map((r) => r.h)),
          explain: rows.map((r, i) => `${TAG6[i]}: ${r.ok ? '옳다' : '옳지 않다'}.`).join(' ') + ` ${XA}에 서로 대칭인 두 그래프는 ${X}${sup(2)}의 계수의 부호만 다르고, ${eqY(A + X2)}의 그래프는 원점을 꼭짓점으로 하는 ${YA} 대칭인 포물선이며 ${A}의 절댓값이 클수록 폭이 좁다.`,
          facts: { truth: pick.truth, want: true, rule: 'many-claims' }
        });
      }
      // 두 그래프(하나는 아래로, 하나는 위로 볼록)의 공통점
      const [m1, m2] = d.shuffle(MAGS.slice(1)).slice(0, 2), p = m1, q = qneg(m2), small = MAGS.filter((m) => fl(m) < Math.min(fl(m1), fl(m2))), mid = MAGS.filter((m) => fl(m) > Math.min(fl(m1), fl(m2)) && fl(m) < Math.max(fl(m1), fl(m2)));
      const ref = small.length && (d.bool() || !mid.length) ? [d.pick(small), true] : mid.length ? [d.pick(mid), false] : [Q(1, 5), true];
      const POOL = [
        { h: '원점을 지난다.', ok: true }, { h: `축의 방정식은 ${is(Y, 0)}이다.`, ok: false }, { h: `${YA}에 대칭이다.`, ok: true },
        { h: `이차함수 ${eqA(sgnQ(pm(d), ref[0]))}의 그래프보다 폭이 좁다.`, ok: ref[1] && fl(ref[0]) < Math.min(fl(m1), fl(m2)) },
        { h: `모든 ${X}의 값에 대하여 ${Y}의 값은 0보다 크거나 같다.`, ok: false }, { h: `${nb(`${X} &gt; 0`)}일 때, ${X}의 값이 증가하면 ${Y}의 값도 증가한다.`, ok: false },
        { h: '아래로 볼록하다.', ok: false }, { h: `꼭짓점의 좌표는 ${pt(0, 0)}이다.`, ok: true }
      ];
      const rows = d.until(() => d.shuffle(POOL).slice(0, 4), (rs) => { const k = rs.filter((r) => r.ok).length; return k >= 1 && k <= 3; });
      const pick = setPick(d, rows.map((r) => r.ok), TAG6, 4);
      return C(`다음 보기에서 두 이차함수 ${eqA(p)}, ${eqA(q)}의 그래프의 공통점을 모두 고른 것은?`, pick.options, pick.at, {
        figure: rows1(rows.map((r) => r.h)),
        explain: `${eqA(p)}의 그래프는 아래로, ${eqA(q)}의 그래프는 위로 볼록하다. 두 그래프 모두 원점을 꼭짓점으로 하고 ${YA}을 축으로 한다(축의 방정식 ${is(X, 0)}). 공통점은 ${tagsOf(rows.map((r) => r.ok))}이다.`,
        facts: { truth: pick.truth, want: true, rule: 'common' }
      });
    }, { count: 2 }),
    T('nature-between', '두 그래프 사이에 있는 그래프', '①25', (d, n) => {
      // n = 0: x축과 y = kx² 사이, n = 1: 볼록한 쪽과 두 그래프 사이, n = 2: 조건 셋(원점이 꼭짓점·볼록한 쪽·폭)
      const s = pm(d);
      if (n === 0) {
        const k = sgnQ(s, d.pick(MAGS.filter((m) => fl(m) <= 3 && fl(m) >= 0.4))), good = sgnQ(s, d.pick(MAGS.filter((m) => fl(m) < fl(absQ(k)))));
        const bad = d.shuffle([].concat(MAGS.filter((m) => fl(m) > fl(absQ(k))).map((m) => sgnQ(s, m)), MAGS.filter((m) => fl(m) < fl(absQ(k))).map((m) => sgnQ(-s, m)), MAGS.filter((m) => fl(m) > fl(absQ(k))).map((m) => sgnQ(-s, m)))).filter((c, i, all) => !same(c, good) && all.findIndex((e) => same(e, c)) === i);
        const opts = d.shuffle([good].concat([bad.find((c) => up(c) !== up(k) && fl(absQ(c)) < fl(absQ(k)))].concat(bad).filter((c, i, all) => c && all.findIndex((e) => e && same(e, c)) === i).slice(0, 4)));
        return C(`다음 이차함수 중 그 그래프가 ${XA}과 이차함수 ${eqA(k)}의 그래프 사이에 있는 것은?`, fxs(opts), opts.findIndex((c) => same(c, good)), {
          explain: `${XA}과 ${eqA(k)}의 그래프 사이에 있으려면 ${convex(k)} 볼록하고 ${eqA(k)}의 그래프보다 폭이 넓어야 한다. 곧 ${s > 0 ? rangeText(0, k) : rangeText(k, 0)}이므로 ${eqA(good)}이다.`,
          facts: { truth: opts.map((c) => same(c, good)), want: true, rule: 'between-axis' }
        });
      }
      if (n === 1) {
        const [p, q] = d.until(() => sameSign(d, 2, s, MAGS.filter((m) => fl(m) <= 4)), ([u, v]) => MAGS.some((m) => fl(m) > Math.abs(fl(u)) && fl(m) < Math.abs(fl(v))));
        const lo = Math.abs(fl(p)), hi = Math.abs(fl(q)), good = sgnQ(s, d.pick(MAGS.filter((m) => fl(m) > lo && fl(m) < hi)));
        const traps = MAGS.filter((m) => fl(m) > lo && fl(m) < hi).map((m) => sgnQ(-s, m)), outs = MAGS.filter((m) => fl(m) < lo || fl(m) > hi).map((m) => sgnQ(d.bool() ? s : -s, m));
        const others = [d.pick(traps)].concat(d.shuffle(outs)).filter((c, i, all) => !same(c, good) && all.findIndex((e) => same(e, c)) === i).slice(0, 4), opts = d.shuffle([good].concat(others));
        return C(`다음 이차함수 중 그 그래프가 ${convex(p)} 볼록하고 두 이차함수 ${eqA(p)}, ${eqA(q)}의 그래프 사이에 있는 것은?`, fxs(opts), opts.findIndex((c) => same(c, good)), {
          explain: `${convex(p)} 볼록하므로 ${X}${sup(2)}의 계수는 ${s > 0 ? '양수' : '음수'}이고, 두 그래프 사이에 있으려면 계수의 절댓값이 ${iq(absQ(p))}보다 크고 ${iq(absQ(q))}보다 작아야 한다. 따라서 ${eqA(good)}이다.`,
          facts: { truth: opts.map((c) => same(c, good)), want: true, rule: 'between-two' }
        });
      }
      const k = d.pick(MAGS.filter((m) => fl(m) >= 0.5 && fl(m) <= 3)), wider = d.bool(), inside = MAGS.filter((m) => (wider ? fl(m) < fl(k) : fl(m) > fl(k))), outside = MAGS.filter((m) => (wider ? fl(m) > fl(k) : fl(m) < fl(k)));
      const good = sgnQ(s, d.pick(inside)), others = d.shuffle([sgnQ(-s, d.pick(inside))].concat(outside.map((m) => sgnQ(s, m)).slice(0, 3), outside.map((m) => sgnQ(-s, m)).slice(0, 2))).filter((c, i, all) => !same(c, good) && all.findIndex((e) => same(e, c)) === i).slice(0, 4);
      const opts = d.shuffle([good].concat(others));
      return C(`다음 조건을 모두 만족시키는 이차함수의 식은?`, fxs(opts), opts.findIndex((c) => same(c, good)), {
        figure: lines(['㈎ 원점을 꼭짓점으로 하고, ' + YA + '을 축으로 한다.', `㈏ ${s > 0 ? '아래로' : '위로'} 볼록한 포물선이다.`, `㈐ 이차함수 ${eqA(sgnQ(pm(d), k))}의 그래프보다 폭이 ${wider ? '넓다' : '좁다'}.`]),
        explain: `㈎에서 ${eqY(A + X2)} 꼴이고, ㈏에서 ${A}는 ${s > 0 ? '양수' : '음수'}이며, ㈐에서 ${A}의 절댓값은 ${iq(k)}보다 ${wider ? '작다' : '크다'}. 따라서 ${eqA(good)}이다.`,
        facts: { truth: opts.map((c) => same(c, good)), want: true, rule: 'between-conds' }
      });
    }, { count: 3 }),
    T('nature-range', '폭을 비교한 조건으로 a의 범위 정하기', '①26', (d, n) => {
      if (n === 0) {
        // y = ax²의 그래프가 y = px²보다 폭이 좁고 y = qx²보다 폭이 넓다(|p| < |a| < |q|). 양수(음수) a의 범위
        const [m1, m2] = d.shuffle(MAGS.filter((m) => fl(m) <= 4)).slice(0, 2).sort((u, v) => fl(u) - fl(v)), pos = d.bool(), s1 = pm(d), s2 = s1 > 0 ? -1 : pm(d);
        const lo = pos ? m1 : qneg(m2), hi = pos ? m2 : qneg(m1), right = rangeText(lo, hi);
        const lit = [sgnQ(s1, m1), sgnQ(s2, m2)].sort((u, v) => fl(u) - fl(v)), wrong = [rangeText(lit[0], lit[1]), pos ? rangeText(Q(m2.q, m2.p), Q(m1.q, m1.p)) : rangeText(qneg(Q(m1.q, m1.p)), qneg(Q(m2.q, m2.p))), pos ? rangeText(0, m1) : rangeText(qneg(m1), 0), pos ? rangeText(qneg(m2), qneg(m1)) : rangeText(m1, m2)];
        const opts = [right];
        for (const w of wrong) if (!opts.includes(w)) opts.push(w);
        const shown = d.shuffle(opts.slice(0, 4));
        return C(`이차함수 ${eqY(A + X2)}의 그래프가 이차함수 ${eqA(sgnQ(s1, m1))}의 그래프보다 폭이 좁고, 이차함수 ${eqA(sgnQ(s2, m2))}의 그래프보다 폭이 넓을 때, ${pos ? '양수' : '음수'} ${A}의 값의 범위는?`, shown, shown.indexOf(right), {
          explain: `폭은 ${X}${sup(2)}의 계수의 절댓값으로 비교한다. ${nb(`${iq(m1)} &lt; |${A}| &lt; ${iq(m2)}`)}이고 ${A}는 ${pos ? '양수' : '음수'}이므로 ${right}이다.`,
          facts: { truth: shown.map((o) => o === right), want: true, rule: 'range-text' }
        });
      }
      // y = kx²의 그래프보다 폭이 좁을(넓을) 때 a가 될 수 있는 수 모두
      const k = d.pick([Q(1), Q(2), Q(3, 2), Q(2, 3), Q(1, 2), Q(3)]), narrow = d.bool();
      const vals = d.until(() => d.shuffle(MAGS.filter((m) => !same(m, k))).slice(0, 5).map((m) => sgnQ(pm(d), m)), (vs) => { const c = vs.filter((v) => (narrow ? fl(absQ(v)) > fl(k) : fl(absQ(v)) < fl(k))).length; return c >= 2 && c <= 3 && vs.some((v) => !up(v) && (narrow ? fl(absQ(v)) > fl(k) : fl(absQ(v)) < fl(k))); });
      const flags = vals.map((v) => (narrow ? fl(absQ(v)) > fl(k) : fl(absQ(v)) < fl(k))), pick = setPick(d, flags, TAG6, 4), sk = sgnQ(pm(d), k);
      return C(`이차함수 ${eqY(A + X2)}의 그래프가 이차함수 ${eqA(sk)}의 그래프보다 폭이 ${narrow ? '좁을' : '넓을'} 때, 다음 중 수 ${A}의 값이 될 수 있는 것을 모두 고른 것은?`, pick.options, pick.at, {
        figure: grid2(vals.map((v) => iq(v))),
        explain: `폭이 ${narrow ? '좁으려면' : '넓으려면'} ${A}의 절댓값이 ${iq(k)}보다 ${narrow ? '커야' : '작아야'} 한다(부호는 상관없다). 그런 수는 ${tagsOf(flags)}이다.`,
        facts: { truth: pick.truth, want: true, rule: 'range-pick' }
      });
    }, { count: 2 }),
    T('nature-fig-range', '그림 속 세 그래프로 a의 값 정하기', '①27', (d, n) => {
      // ㉠·㉡·㉢ 은 같은 쪽으로 볼록한 세 포물선이고 ㉡ 이 y = ax²이다. 폭의 차례는 그림에서 읽는다.
      const s = pm(d), [m1, m2] = d.until(() => d.shuffle(MAGS.filter((m) => fl(m) <= 4)).slice(0, 2).sort((u, v) => fl(u) - fl(v)), ([u, v]) => MAGS.filter((m) => fl(m) > fl(u) && fl(m) < fl(v)).length >= 1 && fl(v) / fl(u) >= 2);
      const narrowP = sgnQ(s, m2), wideP = sgnQ(s, m1), order = d.shuffle(['㉠', '㉡', '㉢']), [tn, ta, tw] = order;  // 좁은 것, 가운데(y = ax²), 넓은 것의 이름
      const fig = { x: [-3, 3], y: s > 0 ? [-0.6, 4.6] : [-4.6, 0.6], grid: false, ticks: 'none',
        parabolas: [{ a: s * 2.4, name: tn }, { a: s * 0.9, name: ta }, { a: s * 0.38, name: tw }].sort((p, q) => p.name.localeCompare(q.name)),
        aria: `세 포물선 ㉠, ㉡, ㉢은 모두 원점을 꼭짓점으로 하고 ${s > 0 ? '아래로' : '위로'} 볼록하다. 폭은 ${tn}이 가장 좁고 ${ta}, ${tw}의 차례로 넓어진다.` };
      const intro = `그림에서 ${['㉠', '㉡', '㉢'].map((t) => `${t}은 ${t === ta ? eqY(A + X2) : eqA(t === tn ? narrowP : wideP)}`).join(', ')}의 그래프이다.`;
      const lo = s > 0 ? m1 : qneg(m2), hi = s > 0 ? m2 : qneg(m1);
      if (n === 0) {
        const good = sgnQ(s, d.pick(MAGS.filter((m) => fl(m) > fl(m1) && fl(m) < fl(m2))));
        const others = d.shuffle([].concat(MAGS.filter((m) => fl(m) > fl(m1) && fl(m) < fl(m2)).map((m) => sgnQ(-s, m)), MAGS.filter((m) => fl(m) < fl(m1) || fl(m) > fl(m2)).map((m) => sgnQ(s, m)))).slice(0, 4);
        const opts = d.shuffle([good].concat(others));
        return C(`${intro} 수 ${A}의 값이 될 수 있는 것은?`, opts.map(iq), opts.findIndex((c) => same(c, good)), {
          figure: geo(fig),
          explain: `${ta}은 ${s > 0 ? '아래로' : '위로'} 볼록하므로 ${A}는 ${s > 0 ? '양수' : '음수'}이고, ${tn}보다 폭이 넓고 ${tw}보다 폭이 좁으므로 ${rangeText(lo, hi)}이다. 따라서 ${A}의 값이 될 수 있는 것은 ${iq(good)}이다.`,
          facts: { between: { low: js(lo), high: js(hi), exprs: opts.map(js) } }
        });
      }
      const right = rangeText(lo, hi), wrong = [s > 0 ? rangeText(qneg(m2), qneg(m1)) : rangeText(m1, m2), rangeText(s > 0 ? m1 : qneg(m1), s > 0 ? m2 : qneg(m2)), s > 0 ? rangeText(0, m1) : rangeText(qneg(m1), 0), s > 0 ? nb(`${A} &gt; ${iq(m2)}`) : nb(`${A} &lt; ${iq(qneg(m2))}`)];
      const opts = [right]; for (const w of wrong) if (!opts.includes(w)) opts.push(w);
      const shown = d.shuffle(opts.slice(0, 4));
      return C(`${intro} 수 ${A}의 값의 범위는?`, shown, shown.indexOf(right), {
        figure: geo(fig),
        explain: `${ta}은 ${s > 0 ? '아래로' : '위로'} 볼록하므로 ${A}는 ${s > 0 ? '양수' : '음수'}이다. ${tn}보다 폭이 넓고 ${tw}보다 폭이 좁으므로 ${nb(`${iq(m1)} &lt; |${A}| &lt; ${iq(m2)}`)}, 곧 ${right}이다.`,
        facts: { truth: shown.map((o) => o === right), want: true, rule: 'fig-range-text' }
      });
    }, { count: 2 }),
    T('nature-fig-match', '그림에서 식에 맞는 그래프 찾기', '①28', (d) => {
      // 아래로 볼록한 둘(좁은 것, 넓은 것), 위로 볼록한 둘. 네 식을 알려 주고 하나를 묻는다.
      const [u1, u2] = d.shuffle(MAGS).slice(0, 2).sort((p, q) => fl(q) - fl(p)), [w1, w2] = d.shuffle(MAGS).slice(0, 2).sort((p, q) => fl(q) - fl(p));
      const coefsAll = [u1, u2, qneg(w1), qneg(w2)], names = d.shuffle(LAB.slice(0, 4)), ask = d.int(0, 3);
      const disp = [2.2, 0.45, -2.2, -0.45];
      const fig = { x: [-3, 3], y: [-4, 4], grid: false, ticks: 'none', parabolas: [0, 1, 2, 3].map((i) => ({ a: disp[i], name: names[i] })).sort((p, q) => p.name.localeCompare(q.name)),
        aria: `네 포물선은 모두 원점을 꼭짓점으로 한다. ${names[0]}, ${names[1]}은 아래로 볼록하고 ${names[0]}이 ${names[1]}보다 폭이 좁다. ${names[2]}, ${names[3]}은 위로 볼록하고 ${names[2]}이 ${names[3]}보다 폭이 좁다.` };
      const listed = d.shuffle(coefsAll.slice());
      return C(`그림은 네 이차함수 ${listed.map(eqA).join(', ')}의 그래프이다. 이 가운데 ${eqA(coefsAll[ask])}의 그래프는?`, LAB.slice(0, 4), LAB.indexOf(names[ask]), {
        figure: geo(fig),
        explain: `${eqA(coefsAll[ask])}의 그래프는 ${convex(coefsAll[ask])} 볼록하고, 같은 쪽으로 볼록한 ${eqA(coefsAll[ask < 2 ? 1 - ask : 5 - ask])}의 그래프보다 폭이 ${ask % 2 === 0 ? '좁다' : '넓다'}. 따라서 ${names[ask]}이다.`,
        facts: { truth: LAB.slice(0, 4).map((t) => t === names[ask]), want: true }
      });
    }),
    T('nature-fig-max', '그림에서 a의 값이 가장 큰(작은) 그래프', '①28', (d) => {
      const nUp = d.pick([2, 3]), big = d.bool(), names = d.shuffle(LAB.slice(0, 5));
      const disp = nUp === 3 ? [2.6, 1, 0.38, -2, -0.6] : [2, 0.6, -2.6, -1, -0.38];
      const order = disp.map((a, i) => i).sort((p, q) => disp[q] - disp[p]), answer = names[big ? order[0] : order[4]];
      const ups = disp.map((a, i) => i).filter((i) => disp[i] > 0).sort((p, q) => disp[q] - disp[p]), downs = disp.map((a, i) => i).filter((i) => disp[i] < 0).sort((p, q) => disp[p] - disp[q]);
      const fig = { x: [-3, 3], y: [-4, 4], grid: false, ticks: 'none', parabolas: disp.map((a, i) => ({ a, name: names[i] })).sort((p, q) => p.name.localeCompare(q.name)),
        aria: `다섯 포물선은 모두 원점을 꼭짓점으로 한다. ${ups.map((i) => names[i]).join(', ')}은 아래로 볼록하고 폭은 ${ups.map((i) => names[i]).join(', ')}의 차례로 넓어진다. ${downs.map((i) => names[i]).join(', ')}은 위로 볼록하고 폭은 ${downs.map((i) => names[i]).join(', ')}의 차례로 넓어진다.` };
      return C(`그림은 꼭짓점이 원점인 이차함수 ${eqY(A + X2)}의 그래프 다섯 개이다. 이 가운데 ${A}의 값이 가장 ${big ? '큰' : '작은'} 그래프는? (단, ${A}는 수이다.)`, LAB.slice(0, 5), LAB.indexOf(answer), {
        figure: geo(fig),
        explain: big ? `${A}의 값이 가장 크려면 ${A} &gt; 0이고 절댓값이 가장 커야 하므로, 아래로 볼록한 것 가운데 폭이 가장 좁은 ${answer}이다.` : `${A}의 값이 가장 작으려면 ${A} &lt; 0이고 절댓값이 가장 커야 하므로, 위로 볼록한 것 가운데 폭이 가장 좁은 ${answer}이다.`,
        facts: { truth: LAB.slice(0, 5).map((t) => t === answer), want: true }
      });
    }),
    T('nature-fig-ref', '두 기준 그래프와 a의 범위로 그래프 찾기', '①28', (d) => {
      // A: y = px², B: y = −px². ㉠~㉣ 은 A보다 좁은 것·넓은 것, B보다 좁은 것·넓은 것이다.
      const p = d.pick([Q(1), Q(2), Q(3), Q(1, 2)]), names = d.shuffle(LAB.slice(0, 4)), kind = d.int(0, 3);   // 0: 위쪽 좁은, 1: 위쪽 넓은, 2: 아래쪽 좁은, 3: 아래쪽 넓은
      const disp = [2.6, 0.38, -2.6, -0.38];
      const [lo, hi] = kind % 2 === 0 ? d.shuffle(MAGS.filter((m) => fl(m) > fl(p))).slice(0, 2).sort((u, v) => fl(u) - fl(v)) : (() => { const l = d.pick(MAGS.filter((m) => fl(m) < fl(p))); return [l, d.pick(MAGS.filter((m) => fl(m) > fl(l) && fl(m) < fl(p)).concat([p]))]; })();
      const [r1, r2] = kind < 2 ? [lo, hi] : [qneg(hi), qneg(lo)];
      const fig = { x: [-3, 3], y: [-4, 4], grid: false, ticks: 'none', parabolas: [{ a: 1, name: 'A' }, { a: -1, name: 'B' }].concat([0, 1, 2, 3].map((i) => ({ a: disp[i], name: names[i], dash: true }))),
        aria: `실선 포물선 A는 아래로, B는 위로 볼록하고 폭이 같다. 점선 포물선 가운데 ${names[0]}은 아래로 볼록하고 A보다 폭이 좁다. ${names[1]}은 아래로 볼록하고 A보다 폭이 넓다. ${names[2]}은 위로 볼록하고 B보다 폭이 좁다. ${names[3]}은 위로 볼록하고 B보다 폭이 넓다.` };
      const ans = names[kind];
      return C(`그림에서 A는 이차함수 ${eqA(p)}, B는 이차함수 ${eqA(qneg(p))}의 그래프이다. ${rangeText(r1, r2)}일 때, 이차함수 ${eqY(A + X2)}의 그래프로 알맞은 것은?`, LAB.slice(0, 4), LAB.indexOf(ans), {
        figure: geo(fig),
        explain: `${rangeText(r1, r2)}이면 ${A}는 ${kind < 2 ? '양수' : '음수'}이므로 ${kind < 2 ? '아래로' : '위로'} 볼록하고, ${A}의 절댓값이 ${iq(p)}보다 ${kind % 2 === 0 ? '크므로' : '작으므로'} ${kind < 2 ? 'A' : 'B'}보다 폭이 ${kind % 2 === 0 ? '좁다' : '넓다'}. 따라서 ${ans}이다.`,
        facts: { truth: LAB.slice(0, 4).map((t) => t === ans), want: true }
      });
    })
  ]);

  // ── 그래프 위의 점 ──
  // 정수 계수 y = ax² 가 지나는 점 (p, ap²)
  const FRACA = [Q(1, 2), Q(3, 2), Q(1, 3), Q(2, 3), Q(4, 3), Q(1, 4), Q(3, 4), Q(5, 2), Q(2, 9), Q(4, 9), Q(5, 4)];
  // 계수 a 와, a·x² 가 정수가 되는 0이 아닌 x 들
  const goodXs = (a, lim) => [-4, -3, -2, -1, 1, 2, 3, 4].filter((x) => Math.abs(x) <= (lim || 4) && isInt(qmul(asQ(a), Q(x * x))));
  // 점이 표시된 포물선(눈금 없이, 점에서 두 축으로 점선을 내리고 축 위에 수를 적는다)
  function pointFig(a, p, q, more) {
    const top = Math.max(Math.abs(q), 2) + 1.2, fig = Object.assign({ x: [-Math.max(Math.abs(p) + 1.5, 3.5), Math.max(Math.abs(p) + 1.5, 3.5)], y: q > 0 ? [-1, top] : [-top, 1], grid: false, ticks: 'none',
      parabolas: [{ a }], points: [{ x: p, y: q, guide: true }], xnums: [{ v: p }], ynums: [{ v: q }],
      aria: `꼭짓점이 원점이고 ${up(a) ? '아래로' : '위로'} 볼록한 포물선이 한 점을 지난다. 그 점에서 두 축에 내린 점선이 x축의 ${plain(Q(p))}인 곳, y축의 ${plain(Q(q))}인 곳과 만난다.` }, more || {});
    return fig;
  }

  B.addTypes('9-1-5', 'point', [
    T('point-a', '지나는 점으로 a의 값 구하기', '①29', (d) => {
      const a = nz(d, -5, 5), p = nz(d, -3, 3), q = a * p * p;
      return N(`이차함수 ${eqY(A + X2)}의 그래프가 점 ${ptj(p, q, '을/를')} 지날 때, 수 ${A}의 값은?`, a, { signed: true,
        explain: `${eqY(A + X2)}에 ${is(X, p)}, ${is(Y, q)}${tail(Math.abs(q), '을/를')} 대입하면 ${nb(`${iq(q)} = ${A} × ${sqOf(p)}`)}이므로 ${is(A, a)}이다.`,
        facts: { value: `${jn(q)}/${jn(p)}**2` }
      });
    }),
    T('point-a-fig', '그림에서 지나는 점을 읽어 a의 값 구하기', '①29', (d) => {
      const [p, q] = d.until(() => [pm(d) * d.int(2, 3), nz(d, -6, 6)], ([u, v]) => !isInt(Q(v, u * u))), a = Q(q, p * p);
      return ansV(`그림은 이차함수 ${eqY(A + X2)}의 그래프이다. 수 ${A}의 값은?`, a, 'frac', {
        figure: geo(pointFig(fl(a), p, q)),
        explain: `그래프가 점 ${ptj(p, q, '을/를')} 지나므로 ${nb(`${iq(q)} = ${A} × ${sqOf(p)}`)}, ${is(A, a)}이다.`,
        facts: { value: `${jn(q)}/${jn(p)}**2` }
      });
    }),
    T('point-eq', '원점이 꼭짓점이고 한 점을 지나는 이차함수의 식', '①30', (d) => {
      const [p, q] = d.until(() => [nz(d, -6, 6), nz(d, -14, 14)], ([u, v]) => { const a = Q(v, u * u); return Math.abs(u) >= 2 && !same(a, Q(1)) && !same(a, Q(-1)) && Math.abs(fl(a)) >= 0.1 && a.q <= 9 && Math.abs(a.p) <= 9; });
      const a = Q(q, p * p), cands = [a, qneg(a), Q(p * p, q), Q(q, p)].concat([qmul(a, Q(2)), Q(Math.abs(p), q)]);
      const opts = d.shuffle(cands.filter((c, i, all) => all.findIndex((e) => same(e, c)) === i).slice(0, 5));
      const phrase = d.pick([`원점을 꼭짓점으로 하고 점 ${ptj(p, q, '을/를')} 지나는 포물선을 그래프로 하는 이차함수의 식은?`, `그래프가 원점을 꼭짓점, ${YA}을 축으로 하고 점 ${ptj(p, q, '을/를')} 지나는 이차함수의 식은?`]);
      return C(phrase, fxs(opts), opts.findIndex((c) => same(c, a)), {
        explain: `원점이 꼭짓점이므로 ${eqY(A + X2)}으로 놓는다. 점 ${ptj(p, q, '을/를')} 지나므로 ${nb(`${iq(q)} = ${A} × ${sqOf(p)}`)}, ${is(A, a)}이다. 따라서 ${eqA(a)}이다.`,
        facts: { claimed: opts.map((c) => [`${jn(c.p)}*${jn(p)}**2/${c.q}`, q]), claimedWant: true }
      });
    }),
    T('point-coord', '그래프 위의 점의 x좌표', '①31', (d) => {
      const a = sgnQ(pm(d), d.pick([Q(1), Q(2), Q(3), Q(4), Q(5), Q(1, 2), Q(3, 2)])), k = d.until(() => d.int(1, 6), (v) => isInt(qmul(a, Q(v * v))) && v >= 2), v = qmul(a, Q(k * k));
      return N(`이차함수 ${eqA(a)}의 그래프가 점 ${ptj(K, v, '을/를')} 지날 때, 양수 ${K}의 값은?`, k, { signed: true,
        explain: `${nb(`${iq(v)} = ${times(a, K + sup(2))}`)}에서 ${is(K + sup(2), k * k)}이다. ${K}는 양수이므로 ${is(K, k)}이다.`,
        facts: { value: `(${jn(v)}/${jn(a)})**(1/2)`, unseen: [1, 2] }
      });
    }),
    T('point-coord-root', '그래프 위의 점의 x좌표(근호)', '①31', (d) => {
      const [a, m, n0] = d.until(() => [sgnQ(pm(d), d.pick([Q(1), Q(2), Q(3), Q(1, 2), Q(3, 2), Q(1, 3), Q(2, 3)])), d.pick([2, 3]), d.pick([2, 3, 5, 6, 7])], ([u, mm, nn]) => isInt(qmul(u, Q(mm * mm * nn))) && Math.abs(fl(qmul(u, Q(mm * mm * nn)))) <= 80);
      const v = qmul(a, Q(m * m * n0));
      return radAns(`이차함수 ${eqA(a)}의 그래프가 점 ${ptj(K, v, '을/를')} 지날 때, 양수 ${K}의 값은?`, m, n0, {
        explain: `${nb(`${iq(v)} = ${times(a, K + sup(2))}`)}에서 ${is(K + sup(2), m * m * n0)}이다. ${K}는 양수이므로 ${K} = ${rt(m * m * n0)} = ${radText(m, n0)}이다.`,
        facts: { calc: [[`((${jn(v)})*${a.q}/(${jn(Q(a.p))})/${n0})**(1/2)`, 0], [String(n0), 1]], unseen: [1, 2, n0] }
      });
    }),
    T('point-coord-table', '표로 나타낸 이차함수의 그래프가 지나는 점', '①31', (d) => {
      const c = pm(d) * d.int(2, 5), w = d.pick([2, 3, 5, 6, 7, 8]), v = c * w, [m, n0] = sqParts(w), r = radText(m, n0);
      const right = `${MINUS}${r}, ${r}`, sv = sqParts(Math.abs(v)), rv = radText(sv[0], sv[1]);
      const opts = [right, r, `${MINUS}${w}, ${w}`, `${MINUS}${rv}, ${rv}`].filter((o, i, all) => all.indexOf(o) === i), shown = d.shuffle(opts);
      return C(`다음 표는 이차함수 ${eqY(A + X2)}에서 ${X}의 값에 대한 ${Y}의 값을 나타낸 것이다. 이 이차함수의 그래프가 점 ${ptj(MM, v, '을/를')} 지날 때, ${MM}의 값을 모두 고른 것은?`, shown, shown.indexOf(right), {
        figure: xyTable([[X, '0', '1', '2', '3', '4'], [Y].concat([0, 1, 2, 3, 4].map((x) => iq(c * x * x)))]),
        explain: `${is(X, 1)}일 때 ${is(Y, c)}이므로 ${is(A, c)}, 곧 ${eqA(c)}이다. ${nb(`${iq(v)} = ${iq(c)}${MM}${sup(2)}`)}에서 ${is(MM + sup(2), w)}이므로 ${MM} = ${MINUS}${r} 또는 ${MM} = ${r}이다.`,
        facts: { truth: shown.map((o) => o === right), want: true }
      });
    }),
    T('point-then', '한 점으로 a를 구한 뒤 다른 점의 좌표', '①32 심9', (d, n) => {
      if (n === 0) {
        const a = d.pick([Q(1), Q(2), Q(3), Q(1, 2), Q(3, 2), Q(5, 2), Q(1, 4), Q(3, 4)].map((m) => sgnQ(pm(d), m)));
        const xs = goodXs(a), [p, r] = d.until(() => [d.pick(xs), d.pick(xs)], ([u, v]) => Math.abs(u) !== Math.abs(v)), q = qmul(a, Q(p * p)), b = qmul(a, Q(r * r));
        return N(`이차함수 ${eqY(A + X2)}의 그래프가 두 점 ${pt(p, q)}, ${ptj(r, BB, '을/를')} 지날 때, ${BB}의 값은? (단, ${A}는 수이다.)`, b.p, { signed: true,
          explain: `점 ${ptj(p, q, '을/를')} 지나므로 ${nb(`${iq(q)} = ${A} × ${sqOf(p)}`)}, ${is(A, a)}이다. ${eqA(a)}에 ${is(X, r)}${tail(Math.abs(r), '을/를')} 대입하면 ${is(BB, b)}이다.`,
          facts: { value: `${jn(q)}*${jn(r)}**2/${jn(p)}**2`, rule: 'then-y' }
        });
      }
      // ㈎ 원점이 꼭짓점 ㈏ 볼록한 쪽, 한 점 → 다른 점의 x좌표(양수)
      const a = sgnQ(pm(d), d.pick([Q(1), Q(2), Q(3), Q(1, 2), Q(3, 2), Q(1, 3), Q(4, 3)])), xs = goodXs(a), p = d.pick(xs), q = qmul(a, Q(p * p)), m = d.until(() => d.pick(xs.filter((x) => x > 0)), (x) => x !== Math.abs(p) || xs.length < 4), v = qmul(a, Q(m * m));
      return N(`다음 조건을 만족시키는 이차함수의 그래프가 두 점 ${pt(p, q)}, ${ptj(MM, v, '을/를')} 지날 때, 양수 ${MM}의 값은?`, m, { signed: true,
        figure: lines(['㈎ 원점을 꼭짓점으로 한다.', `㈏ ${convex(a)} 볼록하다.`]),
        explain: `㈎에서 ${eqY(A + X2)}으로 놓으면 점 ${ptj(p, q, '을/를')} 지나므로 ${is(A, a)}이다. ${nb(`${iq(v)} = ${times(a, MM + sup(2))}`)}에서 ${is(MM + sup(2), m * m)}이고 ${MM}은 양수이므로 ${is(MM, m)}이다.`,
        facts: { value: `(${jn(v)}*${jn(p)}**2/${jn(q)})**(1/2)`, unseen: [1, 2], rule: 'then-x' }
      });
    }, { count: 2 }),
    T('point-then-fig', '그림에서 a를 읽고 다른 점의 x좌표 구하기(근호)', '①32', (d) => {
      const [p, q, m, n0] = d.until(() => [pm(d) * d.int(2, 3), nz(d, -6, 6), d.pick([2, 3]), d.pick([2, 3, 5, 6])], ([u, v, mm, nn]) => { const a = Q(v, u * u), w = qmul(a, Q(mm * mm * nn)); return !isInt(a) && isInt(w) && Math.abs(w.p) <= 60 && Math.abs(w.p) !== Math.abs(v); });
      const a = Q(q, p * p), v = qmul(a, Q(m * m * n0));
      return radAns(`그림은 이차함수 ${eqY(A + X2)}의 그래프이다. 이 그래프가 점 ${ptj(K, v, '을/를')} 지날 때, 양수 ${K}의 값은? (단, ${A}는 수이다.)`, m, n0, {
        figure: geo(pointFig(fl(a), p, q)),
        explain: `그래프가 점 ${ptj(p, q, '을/를')} 지나므로 ${is(A, a)}이다. ${nb(`${iq(v)} = ${times(a, K + sup(2))}`)}에서 ${is(K + sup(2), m * m * n0)}이고, ${K}는 양수이므로 ${K} = ${radText(m, n0)}이다.`,
        facts: { calc: [[`((${jn(v)})*${jn(p)}**2/(${jn(q)})/${n0})**(1/2)`, 0], [String(n0), 1]], unseen: [1, 2, n0] }
      });
    }),
    T('point-sym', 'x축에 대칭인 그래프 위의 점', '①33', (d, n) => {
      const a = sgnQ(pm(d), d.pick([Q(1), Q(2), Q(3), Q(4), Q(1, 2), Q(3, 2), Q(1, 3), Q(2, 3), Q(3, 4), Q(2, 9)])), xs = goodXs(a);
      if (n === 0) {
        const p = d.pick(xs), k = qmul(qneg(a), Q(p * p));
        return N(`이차함수 ${eqA(a)}의 그래프와 ${XA}에 대칭인 그래프가 점 ${ptj(p, K, '을/를')} 지날 때, ${K}의 값은?`, k.p, { signed: true,
          explain: `${XA}에 대칭인 그래프의 식은 ${eqA(qneg(a))}이다. ${is(X, p)}${tail(Math.abs(p), '을/를')} 대입하면 ${K} = ${times(qneg(a), sqOf(p))} = ${iq(k)}이다.`,
          facts: { value: `0-${jn(a)}*${jn(p)}**2`, unseen: [0, 1], rule: 'sym-y' }
        });
      }
      const k = d.pick(xs.filter((x) => x > 0)), v = qmul(qneg(a), Q(k * k));
      return N(`이차함수 ${eqA(a)}의 그래프와 ${XA}에 대칭인 그래프가 점 ${ptj(K, v, '을/를')} 지날 때, 양수 ${K}의 값은?`, k, { signed: true,
        explain: `${XA}에 대칭인 그래프의 식은 ${eqA(qneg(a))}이다. ${nb(`${iq(v)} = ${times(qneg(a), K + sup(2))}`)}에서 ${is(K + sup(2), k * k)}이고 ${K}는 양수이므로 ${is(K, k)}이다.`,
        facts: { value: `(0-${jn(v)}/${jn(a)})**(1/2)`, unseen: [0, 1, 2], rule: 'sym-x' }
      });
    }, { count: 2 }),
    T('point-sym-a', 'x축에 대칭인 그래프가 지나는 점으로 a 구하기', '①34', (d) => {
      const a = nz(d, -5, 5), p = nz(d, -3, 3), q = -a * p * p;
      return N(`이차함수 ${eqY(A + X2)}의 그래프와 ${XA}에 대칭인 그래프가 점 ${ptj(p, q, '을/를')} 지날 때, 수 ${A}의 값은?`, a, { signed: true,
        explain: `${XA}에 대칭인 그래프의 식은 ${eqY(MINUS + A + X2)}이다. ${nb(`${iq(q)} = ${MINUS}${A} × ${sqOf(p)}`)}이므로 ${is(A, a)}이다.`,
        facts: { value: `0-${jn(q)}/${jn(p)}**2`, unseen: [0] }
      });
    }),
    T('point-sym-two', '한 점과 x축 대칭으로 두 계수 구하기', '①35', (d, n) => {
      if (n === 0) {
        const a = nz(d, -5, 5), p = nz(d, -3, 3), q = a * p * p;
        return M(`이차함수 ${eqY(A + X2)}의 그래프가 점 ${ptj(p, q, '을/를')} 지나고, 이차함수 ${eqY(BB + X2)}의 그래프와 ${XA}에 서로 대칭일 때, 수 ${A}, ${BB}의 값은?`, [{ lead: A + ' =', answer: a, signed: true }, { lead: BB + ' =', answer: -a, signed: true }], {
          shown: `${is(A, a)}, ${is(BB, -a)}`,
          explain: `${nb(`${iq(q)} = ${A} × ${sqOf(p)}`)}에서 ${is(A, a)}이다. ${XA}에 서로 대칭이면 ${X}${sup(2)}의 계수의 부호만 반대이므로 ${is(BB, -a)}이다.`,
          facts: { calc: [[`${jn(q)}/${jn(p)}**2`, 0], [`0-${jn(q)}/${jn(p)}**2`, 1]], unseen: [0], rule: 'two-point' }
        });
      }
      const k = nz(d, -6, 6), p = d.pick([Q(nz(d, -3, 3)), Q(pm(d), 2), Q(pm(d) * 3, 2)].filter((x) => isInt(qmul(Q(k), qmul(x, x))))), av = qmul(Q(k), qmul(p, p));
      return M(`이차함수 ${eqA(k)}의 그래프는 점 ${ptj(p, A, '을/를')} 지나고, 이차함수 ${eqY(BB + X2)}의 그래프와 ${XA}에 서로 대칭일 때, 수 ${A}, ${BB}의 값은?`, [{ lead: A + ' =', answer: av.p, signed: true }, { lead: BB + ' =', answer: -k, signed: true }], {
        shown: `${is(A, av)}, ${is(BB, -k)}`,
        explain: `${is(X, p)}${tail(lastOf(p), '을/를')} 대입하면 ${A} = ${times(k, sqOf(p))} = ${iq(av)}이다. ${XA}에 서로 대칭이므로 ${is(BB, -k)}이다.`,
        facts: { calc: [[`${jn(k)}*${js(p)}**2`, 0], [`0-${jn(k)}`, 1]], unseen: [0, 1], rule: 'two-known' }
      });
    }, { count: 2 }),
    T('point-sym-prod', 'x축에 서로 대칭이고 곱이 주어진 두 계수', '심4', (d) => {
      const m = d.int(2, 9), pos = d.bool();
      return M(`두 이차함수 ${eqY(A + X2)}, ${eqY(BB + X2)}의 그래프가 ${XA}에 서로 대칭이고 ${is(A + BB, -m * m)}일 때, 수 ${A}, ${BB}의 값은? (단, ${nb(`${A} ${pos ? '&gt;' : '&lt;'} 0`)})`, [{ lead: A + ' =', answer: pos ? m : -m, signed: true }, { lead: BB + ' =', answer: pos ? -m : m, signed: true }], {
        shown: `${is(A, pos ? m : -m)}, ${is(BB, pos ? -m : m)}`,
        explain: `${XA}에 서로 대칭이므로 ${is(BB, MINUS + A)}이다. ${nb(`${A}${BB} = ${MINUS}${A}${sup(2)} = ${iq(-m * m)}`)}에서 ${is(A + sup(2), m * m)}이고 ${A} ${pos ? '&gt;' : '&lt;'} 0이므로 ${is(A, pos ? m : -m)}, ${is(BB, pos ? -m : m)}이다.`,
        facts: { calc: [[`${pos ? '' : '0-'}(${m * m})**(1/2)`, 0], [`${pos ? '0-' : ''}(${m * m})**(1/2)`, 1]], unseen: [0, 1, 2] }
      });
    }),
    T('point-sym-letter', 'x축에 대칭인 그래프가 문자 좌표의 점을 지날 때', '①36 심8', (d) => {
      // 원래 그래프 y = kx², 대칭인 그래프 y = −kx². 점 (a + s, ta + u)를 지난다: k(a + s)² + t a + u = 0 의 두 근
      const KS = [Q(1), Q(2), Q(3), Q(4), Q(6), Q(1, 2), Q(3, 2), Q(3, 4), Q(2, 3)], RS = [-4, -3, -2, -1, 1, 2, 3, 4].map((v) => Q(v)).concat([Q(1, 2), Q(-1, 2), Q(3, 2), Q(-3, 2), Q(5, 2), Q(-5, 2), Q(1, 3), Q(-1, 3), Q(2, 3), Q(-2, 3), Q(4, 3), Q(-4, 3), Q(5, 3), Q(-5, 3)]);
      const c = d.until(() => {
        const k = sgnQ(pm(d), d.pick(KS)), [b1, b2] = d.shuffle(RS).slice(0, 2), s = d.int(-3, 3);
        // −k b² = t(b − s) + u 를 b 로 풀면 k b² + t b + (u − t s) = 0: t = −k(b1 + b2), u − ts = k b1 b2
        const t = qneg(qmul(k, qadd(b1, b2))), u = qadd(qmul(k, qmul(b1, b2)), qmul(t, Q(s)));
        return { k, b1, b2, s, t, u };
      }, (o) => { const a1 = qsub(o.b1, Q(o.s)), a2 = qsub(o.b2, Q(o.s)); return isInt(o.t) && isInt(o.u) && o.t.p !== 0 && Math.abs(o.t.p) <= 3 && Math.abs(o.u.p) <= 30 && o.u.p !== 0 && a1.p !== 0 && a2.p !== 0 && qadd(a1, a2).p !== 0 && (isInt(a1) || isInt(a2)); });
      const { k, b1, b2, s, t, u } = c, a1 = qsub(b1, Q(s)), a2 = qsub(b2, Q(s));
      const setOf = (x, y) => [x, y].sort((p, q) => fl(p) - fl(q)).map(iq).join(', ');
      const right = setOf(a1, a2), opts = [right];
      // 틀린 보기: 부호를 바꾼 두 근, 대칭시키지 않은 식의 근(유리수일 때), 정수인 근 하나
      opts.push(setOf(qneg(a1), qneg(a2)));
      { // k(a + s)² = t a + u 의 근: k b² − t b + (−u + t s) = 0 → b = (t ± √(t² − 4k(ts − u)))/(2k)
        const D = qsub(qmul(t, t), qmul(Q(4), qmul(k, qsub(qmul(t, Q(s)), u))));
        if (D.p > 0) { const sq = (x) => { const r = Math.round(Math.sqrt(x)); return r * r === x ? r : null; }, top = sq(D.p), bot = sq(D.q); if (top != null && bot != null) { const rD = Q(top, bot), x1 = qdiv(qadd(t, rD), qmul(Q(2), k)), x2 = qdiv(qsub(t, rD), qmul(Q(2), k)); opts.push(setOf(qsub(x1, Q(s)), qsub(x2, Q(s)))); } }
      }
      opts.push(iq(isInt(a1) ? a1 : a2), setOf(a1, qneg(a2)), setOf(qneg(a1), a2));
      const shown = d.shuffle(opts.filter((o, i, all) => all.indexOf(o) === i).slice(0, 4));
      const P = nb(`(${A}${s === 0 ? '' : ' ' + sgnTerm(s)}, ${t.p === 1 ? '' : t.p === -1 ? MINUS : iq(t)}${A} ${sgnTerm(u)})`);
      return C(`이차함수 ${eqA(k)}의 그래프와 ${XA}에 대칭인 그래프가 점 ${P}${tail(Math.abs(u.p), '을/를')} 지날 때, ${A}의 값을 모두 고른 것은?`, shown, shown.indexOf(right), {
        explain: `${XA}에 대칭인 그래프의 식은 ${eqA(qneg(k))}이다. 점의 좌표를 대입하면 ${nb(`${t.p === 1 ? '' : t.p === -1 ? MINUS : iq(t)}${A} ${sgnTerm(u)} = ${times(qneg(k), s === 0 ? A + sup(2) : `(${A} ${sgnTerm(s)})${sup(2)}`)}`)}이고, 이 이차방정식을 풀면 ${A} = ${right.replace(', ', ' 또는 ' + A + ' = ')}이다.`,
        facts: { truth: shown.map((o) => o === right), want: true }
      });
    }),
    T('point-sym-notpass', 'x축에 대칭인 포물선이 지나지 않는 점', '심10', (d) => {
      const [p, q] = d.until(() => [nz(d, -4, 4), nz(d, -16, 16)], ([u, v]) => { const a = Q(v, u * u); return Math.abs(u) >= 2 && !isInt(a) && a.q <= 4; });
      const a = Q(q, p * p), b = qneg(a), xs = d.shuffle([-6, -4, -3, -2, -1, 1, 2, 3, 4, 6].map((x) => Q(x)).concat([Q(1, 2), Q(-1, 2), Q(3, 2), Q(-3, 2)])).filter((x) => qmul(b, qmul(x, x)).q <= 9 && Math.abs(fl(qmul(b, qmul(x, x)))) <= 60).slice(0, 5);
      const bad = d.int(0, 4), pts = xs.map((x, i) => [x, i === bad ? qmul(a, qmul(x, x)) : qmul(b, qmul(x, x))]);
      return C(`원점을 꼭짓점으로 하고 점 ${ptj(p, q, '을/를')} 지나는 포물선과 ${XA}에 서로 대칭인 포물선이 지나는 점이 아닌 것은?`, pts.map(([x, y]) => pt(x, y)), bad, {
        explain: `원점이 꼭짓점이고 점 ${ptj(p, q, '을/를')} 지나는 포물선은 ${eqA(a)}이고, ${XA}에 대칭인 포물선은 ${eqA(b)}이다. ${is(X, xs[bad])}일 때 ${is(Y, qmul(b, qmul(xs[bad], xs[bad])))}이므로 점 ${pt(...pts[bad])}은 지나지 않는다.`,
        facts: { claimed: pts.map(([x, y]) => [`${jn(b.p)}*${jn(x.p)}*${jn(x.p)}/(${b.q}*${x.q}*${x.q})`, y.p / y.q]), claimedWant: false }
      });
    })
  ]);

  // ── 그래프 위의 점과 길이(모양만 보이는 그림) ──
  B.addTypes('9-1-5', 'length', [
    T('length-hline', 'x축에 평행한 직선과 만나는 두 점 사이의 거리', '심17', (d) => {
      const [k, w] = d.until(() => [sgnQ(pm(d), d.pick([Q(1), Q(2), Q(3), Q(1, 2), Q(1, 3), Q(3, 2)])), d.pick([3, 5, 7, 9])], ([u, v]) => { const c = qmul(absQ(u), Q(v * v, 4)); return !isInt(c) && c.p <= 250; });
      const c = qmul(absQ(k), Q(w * w, 4)), s = up(k) ? 1 : -1, disp = 0.55 * s, cy = s * 3.4, half = Math.sqrt(3.4 / 0.55);
      const fig = { x: [-3.5, 3.5], y: s > 0 ? [-0.6, 4.4] : [-4.4, 0.6], grid: false, ticks: 'none', parabolas: [{ a: disp }], hlines: [{ y: cy }],
        points: [{ x: -half, y: cy, name: 'P' }, { x: half, y: cy, name: 'Q' }, { x: 0, y: cy, name: 'R' }],
        aria: `꼭짓점이 원점이고 ${s > 0 ? '아래로' : '위로'} 볼록한 포물선과 x축에 평행한 직선이 두 점 P, Q에서 만나고, 직선이 y축과 만나는 점이 R이다. 점 R은 원점의 ${s > 0 ? '위쪽' : '아래쪽'}에 있다.` };
      return F(`그림과 같이 ${XA}에 평행한 직선이 이차함수 ${eqA(k)}의 그래프와 만나는 두 점을 P, Q, ${YA}과 만나는 점을 R이라 하자. ${is(SG('PQ'), w)}일 때, ${SG('OR')}의 길이는? (단, O는 원점이다.)`, c.p, c.q, { improper: c.p > c.q, anyForm: true,
        figure: geo(fig),
        explain: `그래프는 ${YA}에 대칭이므로 ${is(SG('RQ'), Q(w, 2))}이고 점 Q의 ${X}좌표는 ${iq(Q(w, 2))}이다. ${is(X, Q(w, 2))}일 때 ${Y} = ${times(k, sqOf(Q(w, 2)))} = ${iq(qmul(k, Q(w * w, 4)))}이므로 ${SG('OR')}의 길이는 ${iq(c)}이다.`,
        facts: { value: `${js(absQ(k))}*(${w}/2)**2`, unseen: [1, 2] }
      });
    }),
    T('length-vdist', '같은 x좌표의 두 점 사이의 거리로 a 구하기', '심11', (d) => {
      // A 는 y = px² 위, B 는 y = ax² 위(같은 x좌표 t). B 의 자리: x축 아래(a < 0), A 위(a > p), x축과 A 사이(0 < a < p)
      const c = d.until(() => { const p = d.pick([Q(1), Q(2), Q(1, 2), Q(3, 2), Q(3)]), t = d.int(1, 3), yA = qmul(p, Q(t * t)), where = d.int(0, 2), a = where === 0 ? -d.int(1, 4) : where === 1 ? d.int(Math.ceil(fl(p)) + 1, 6) : d.int(1, Math.max(1, Math.floor(fl(p) - 0.01))), yB = Q(a * t * t); return { p, t, yA, where, a, yB, L: qabs(qsub(yA, yB)) }; },
        (o) => isInt(o.yA) && o.L.p > 0 && isInt(o.L) && (o.where !== 2 || (o.a > 0 && o.a < fl(o.p))));
      const { p, t, yA, where, a, L } = c, dispP = 0.5, dispA = where === 0 ? -0.35 : where === 1 ? 1.4 : 0.22, X0 = where === 1 ? 1.7 : 2.2;
      const fig = { x: [-3.2, 3.2], y: [-2.6, 4.4], grid: false, ticks: 'none', parabolas: [{ a: dispP }, { a: dispA }], marks: [[X0, Math.min(0, dispA * X0 * X0), X0, Math.max(dispP * X0 * X0, dispA * X0 * X0)]],
        points: [{ x: X0, y: dispP * X0 * X0, name: 'A', side: where === 1 ? 'r' : 'ur' }, { x: X0, y: dispA * X0 * X0, name: 'B', side: 'r' }], xnums: [{ v: X0, text: String(t) }],
        aria: `꼭짓점이 원점인 두 포물선이 있다. x축 위의 ${t}인 곳을 지나는 세로 점선 위에 점 A와 점 B가 있다. 점 B는 ${where === 0 ? 'x축보다 아래쪽' : where === 1 ? '점 A보다 위쪽' : 'x축과 점 A 사이'}에 있다.` };
      return N(`그림과 같이 두 이차함수 ${eqA(p)}, ${eqY(A + X2)}의 그래프 위의 ${X}좌표가 ${t}인 점을 각각 A, B라 하자. ${is(SG('AB'), L)}일 때, 수 ${A}의 값은?`, a, { signed: true,
        figure: geo(fig),
        explain: `점 A의 ${Y}좌표는 ${times(p, sqOf(t))} = ${iq(yA)}이다. 그림에서 점 B는 ${where === 0 ? 'x축보다 아래쪽' : where === 1 ? '점 A보다 위쪽' : '점 A보다 아래쪽'}에 있으므로 점 B의 ${Y}좌표는 ${iq(yA)} ${where === 1 ? '+' : MINUS} ${iq(L)} = ${iq(a * t * t)}이다. ${nb(`${iq(a * t * t)} = ${A} × ${sqOf(t)}`)}에서 ${is(A, a)}이다.`,
        facts: { value: `(${js(p)}*${t}**2${where === 1 ? '+' : '-'}${js(L)})/${t}**2`, unseen: [1], rule: 'vdist' }
      });
    }),
    T('length-hspace', 'x축에 평행한 직선 위의 같은 간격', '심15', (d) => {
      const [k, b] = d.until(() => [sgnQ(pm(d), d.pick([Q(1), Q(2), Q(3), Q(1, 2), Q(3, 2), Q(5, 2)])), d.int(1, 3)], ([u, v]) => isInt(qmul(u, Q(v * v))) && !isInt(qdiv(u, Q(4))));
      const c = qmul(k, Q(b * b)), a = qdiv(k, Q(4)), s = up(k) ? 1 : -1, cy = s * 3.4, bx = Math.sqrt(3.4 / 1.4);
      const fig = { x: [-3.6, 3.6], y: s > 0 ? [-0.6, 4.4] : [-4.4, 0.6], grid: false, ticks: 'none', parabolas: [{ a: s * 1.4 }, { a: s * 0.35 }], hlines: [{ y: cy }],
        points: [{ x: -2 * bx, y: cy, name: 'A', side: s > 0 ? 'ul' : 'dl' }, { x: -bx, y: cy, name: 'B', side: s > 0 ? 'ul' : 'dl' }, { x: 0, y: cy, name: 'C', side: s > 0 ? 'ur' : 'dr' }, { x: bx, y: cy, name: 'D', side: s > 0 ? 'ur' : 'dr' }, { x: 2 * bx, y: cy, name: 'E', side: s > 0 ? 'ur' : 'dr' }],
        aria: `꼭짓점이 원점인 두 포물선과 x축에 평행한 직선이 있다. 직선 위에 왼쪽부터 점 A, B, C, D, E가 있고, 점 B, D는 폭이 좁은 포물선 위에, 점 A, E는 폭이 넓은 포물선 위에, 점 C는 y축 위에 있다.` };
      return ansV(`그림과 같이 직선 ${is(Y, c)}${tail(lastOf(c), '이/가')} 이차함수 ${eqA(k)}의 그래프와 만나는 두 점을 B, D, 이차함수 ${eqY(A + X2)}의 그래프와 만나는 두 점을 A, E, ${YA}과 만나는 점을 C라 하자. ${nb(`${SG('AB')} = ${SG('BC')} = ${SG('CD')} = ${SG('DE')}`)}일 때, 수 ${A}의 값은?`, a, 'frac', {
        figure: geo(fig),
        explain: `${nb(`${times(k, X2)} = ${iq(c)}`)}에서 점 D의 ${X}좌표는 ${b}이므로 ${is(SG('CD'), b)}이다. ${is(SG('DE'), b)}이므로 점 E의 좌표는 ${pt(2 * b, c)}이다. ${nb(`${iq(c)} = ${A} × ${sqOf(2 * b)}`)}에서 ${is(A, a)}이다.`,
        facts: { value: `${js(c)}/(4*${js(c)}/${js(k)})`, unseen: [1, 4] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
