// 중학교 3학년 2학기 1단원 삼각비 — 뒤쪽 묶음(30°, 45°, 60°의 삼각비의 값, 특수각으로 변의 길이와 넓이, 사분원과 0°·90°의 삼각비·대소).
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 9-2-1a.js 에 있다. ref: ①n = 기본꼴_1의 n번.
// 특수각의 식의 값은 값의 꼴이 식마다 다르므로, 한 유형의 칸 모양이 같도록 값의 꼴(a√b/c, 분수, a + b√c, 정수)로 유형을 나누거나 고르기로 낸다.
// 사분원의 눈금 값(소수 둘째 자리)은 검사의 FINE_DECIMAL_UNITS 에 9-2-1 이 없어 고르기로 낸다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, table, N, C } = B.kit;
  const { MINUS, gcd, lcm, Q, qmul, fl, nb, tail, V, sup, rt, claimQ, SG, ex } = B.kit.mid;
  const { r1, at, dirOf, dist, sv, TINT, Board } = B.kit.mgeo;
  const K = B.kit.m921;
  const { UNIT, T, num, sqrtN, rad, vadd, vneg, vsub, vmul, vinv, vdiv, vfl, veq, kindOf, vh, vt, SV, fn, fd, fx, X, seg, FN3, stripH, seal, more,
    aInt, aFrac, aRad, aRadFrac, aSum, aPick, pickRows, pickAll, fig, rtFig, POSES, deg, degx, PYTH } = K;
  const DEGS = [30, 45, 60];
  const OPS = { '+': '+', '-': MINUS, '*': '×', '/': '÷' };
  const opv = (x, op, y) => (op === '+' ? vadd(x, y) : op === '-' ? vsub(x, y) : op === '*' ? vmul(x, y) : vdiv(x, y));
  // 특수각의 삼각비 항: [함수, 각]
  const term = (d, angles) => { const f = d.pick(FN3), a = d.pick((angles || DEGS).filter((g) => !(f === 'tan' && g === 90))); return [f, a]; };
  const tv = ([f, a]) => SV[f][a];
  const th = ([f, a]) => fd(f, a);
  const ITALIC = (h) => '<i>' + h + '</i>';
  // 식 그림(휴대폰 너비에 맞춘다)
  const exh = (h) => ex(h);
  // 소수 둘째 자리 글
  const d2 = (v) => String(Number(v.toFixed(2)));

  // ── 사분원 그림 ──
  // 반지름의 길이가 1인 사분원: 중심 O, 반지름 끝 A(가로), 호 위의 점 P(중심각 t°), P 에서 OA 에 내린 수선의 발 F, A 에서 그은 접선과 OP 의 연장선의 교점 Tn.
  // nm: { A, P, F, T, E(세로 반지름의 끝) } 이름. o.ticks: 눈금 글을 적는가(값 { s, c, t }), o.angleAt 'O' | 'P' 표시할 각과 글, o.r 반지름(px)
  function quarterFig(t, nm, o) {
    const R = o.r || 132, rad0 = t * Math.PI / 180, O = [0, 0], A = [R, 0], E = [0, -R], P = [R * Math.cos(rad0), -R * Math.sin(rad0)], Fp = [P[0], 0], Tp = [R, -R * Math.tan(rad0)];
    const b = Board();
    b.arc(O, R, 0, 90).seg(O, A).seg(O, E).seg(P, Fp).corner(Fp, O, P, '');
    if (o.noTangent) b.seg(O, P); else b.seg(O, Tp).seg(A, Tp).corner(A, O, Tp, '');
    if (o.angleAt === 'P') b.corner(P, O, Fp, o.angleLabel, { r: 16 }); else b.corner(O, A, P, o.angleLabel, { r: 22 });
    if (o.ticks) {
      const v = o.ticks, gx = -6;
      b.seg([gx, P[1]], P, 'cut').seg([gx, Tp[1]], Tp, 'cut');
      b.text([gx - 16, P[1]], d2(v.s), { size: 12.5 }).text([gx - 16, Tp[1]], d2(v.t), { size: 12.5 }).text([gx - 8, -R], '1', { size: 12.5 });
      b.text([Fp[0], 30], d2(v.c), { size: 12.5 }).text([R + 4, 30], '1', { size: 12.5 });
    }
    b.name(O, 'O', 225, 10);
    if (nm.A) b.name(A, nm.A, 315, 10);
    if (nm.E) b.name(E, nm.E, 160, 10);
    if (nm.P) b.name(P, nm.P, t + 45, 11);
    if (nm.F) b.name(Fp, nm.F, 270, 11);
    if (nm.T) b.name(Tp, nm.T, 0, 10);
    return b;
  }

  B.addTypes(UNIT, 'special', [
    T('special-table', '30°, 45°, 60°의 삼각비의 표에서 빈칸의 값', '①22', (d) => {
      const cells = [];
      FN3.forEach((f) => DEGS.forEach((a) => cells.push([f, a])));
      const blanks = d.shuffle(cells).slice(0, 3), mark = ['㉠', '㉡', '㉢'], ask = d.int(0, 2), [f0, a0] = blanks[ask];
      const cellOf = (f, a) => { const i = blanks.findIndex(([g, b]) => g === f && b === a); return i < 0 ? vh(SV[f][a]) : mark[i]; };
      const figure = table(['∠A', '30°', '45°', '60°'], FN3.map((f) => [fn(f, 'A')].concat(DEGS.map((a) => cellOf(f, a)))));
      const pool = [num(1, 2), rad(1, 2, 2), rad(1, 3, 2), rad(1, 3, 3), num(1), rad(1, 3)];
      const right = SV[f0][a0];
      return aPick(d, `다음은 30°, 45°, 60°의 삼각비의 값을 나타낸 표이다. ${mark[ask]}에 알맞은 값은?`, right, d.shuffle(pool.filter((v) => !veq(v, right))), {
        figure, sort: true,
        explain: `${mark[ask]}은 ${fd(f0, a0)}의 값이다. ${a0 === 45 ? '직각을 낀 두 변의 길이가 1인 직각이등변삼각형(빗변 √2)' : '한 변의 길이가 2인 정삼각형을 이등분한 직각삼각형(세 변 1, √3, 2)'}에서 ${fd(f0, a0)} = ${vh(right)}이다.`
      });
    }),
    T('special-two-rad', '특수각의 삼각비 두 개의 계산(근호가 남는 값)', '①23', (d) => {
      const w = d.until(() => { const p = term(d), q = term(d), op = d.pick(['+', '-', '*', '/']); return { p, q, op, v: opv(tv(p), op, tv(q)) }; },
        (z) => !(z.p[0] === z.q[0] && z.p[1] === z.q[1]) && kindOf(z.v) === 'radfrac' && !((z.op === '*' || z.op === '/') && (veq(tv(z.p), num(1)) || veq(tv(z.q), num(1)))));
      const { p, q, op, v } = w, h = `${th(p)} ${ITALIC(OPS[op])} ${th(q)}`;
      return aRadFrac('다음을 계산하시오.', v, { signed: true, figure: exh(h),
        explain: `${th(p)} = ${vh(tv(p))}, ${th(q)} = ${vh(tv(q))}이므로 ${th(p)} ${OPS[op]} ${th(q)} = ${vh(tv(p))} ${OPS[op]} ${vh(tv(q))} = ${vh(v)}이다.`, rule: 'two-rad' });
    }),
    T('special-two-rat', '특수각의 삼각비 두 개의 계산(근호가 없어지는 값)', '①23', (d) => {
      const w = d.until(() => { const p = term(d), q = term(d), op = d.pick(['+', '-', '*', '/']); return { p, q, op, v: opv(tv(p), op, tv(q)) }; },
        (z) => !(z.p[0] === z.q[0] && z.p[1] === z.q[1]) && kindOf(z.v) === 'frac' && (kindOf(tv(z.p)) !== 'frac' || kindOf(tv(z.q)) !== 'frac'));
      const { p, q, op, v } = w, h = `${th(p)} ${ITALIC(OPS[op])} ${th(q)}`;
      return aFrac('다음을 계산하시오.', v, { signed: true, figure: exh(h), value: v[0].q.p < 0 ? `(0-${-v[0].q.p})/${v[0].q.q}` : `${v[0].q.p}/${v[0].q.q}`,
        explain: `${th(p)} = ${vh(tv(p))}, ${th(q)} = ${vh(tv(q))}이므로 ${th(p)} ${OPS[op]} ${th(q)} = ${vh(tv(p))} ${OPS[op]} ${vh(tv(q))} = ${vh(v)}이다.`, rule: 'two-rat' });
    }),
    T('special-mix', '특수각의 삼각비 셋 이상이 섞인 식의 값', '①24', (d) => {
      // 식의 꼴 넷: p × q ÷ r, p × q − r × s, k·p − l·q + m·r, p × (q + r − s). 틀린 보기는 값 하나를 헷갈리기 쉬운 값(같은 각의 sin↔cos, 30°↔60°)으로 바꾼 것과 부호를 바꾼 것.
      const COEF = [[2, num(2)], [3, num(3)], [rt(2), sqrtN(2)], [rt(3), sqrtN(3)]];
      const w = d.until(() => {
        const form = d.int(0, 3), ts = [term(d), term(d), term(d), term(d)], cs = [d.pick(COEF), d.pick(COEF), d.pick(COEF)], sg = [d.pick(['+', '-']), d.pick(['+', '-'])];
        return { form, ts, cs, sg };
      }, (z) => { const v = valOf(z, z.ts); return new Set(z.ts.map((t) => t.join())).size === 4 && vfl(v) !== 0 && v.length <= 2 && Math.abs(vfl(v)) < 9; });
      function valOf(z, ts) {
        const [a, b, c, e] = ts.map(tv);
        if (z.form === 0) return vdiv(vmul(a, b), c);
        if (z.form === 1) return opv(vmul(a, b), z.sg[0], vmul(c, e));
        if (z.form === 2) return opv(opv(vmul(z.cs[0][1], a), z.sg[0], vmul(z.cs[1][1], b)), z.sg[1], c);
        return vmul(a, opv(opv(b, z.sg[0], c), z.sg[1], e));
      }
      const show = (z) => {
        const [a, b, c, e] = z.ts.map(th), o = (s) => ' ' + ITALIC(OPS[s]) + ' ';
        if (z.form === 0) return `${a}${o('*')}${b}${o('/')}${c}`;
        if (z.form === 1) return `${a}${o('*')}${b}${o(z.sg[0])}${c}${o('*')}${e}`;
        if (z.form === 2) return `${z.cs[0][0]} ${a}${o(z.sg[0])}${z.cs[1][0]} ${b}${o(z.sg[1])}${c}`;
        return `${a}${o('*')}(${b}${o(z.sg[0])}${c}${o(z.sg[1])}${e})`;
      };
      const right = valOf(w, w.ts), SWAP = { sin: 'cos', cos: 'sin', tan: 'tan' };
      const wrongs = [];
      w.ts.forEach((t, i) => {
        const alt1 = w.ts.map((u, j) => (j === i ? [SWAP[u[0]], u[1]] : u)), alt2 = w.ts.map((u, j) => (j === i ? [u[0], u[1] === 30 ? 60 : u[1] === 60 ? 30 : u[1]] : u));
        for (const alt of [alt1, alt2]) { try { wrongs.push(valOf(w, alt)); } catch (e) { /* 나눌 수 없는 꼴 */ } }
      });
      wrongs.push(vneg(right), vadd(right, num(1)), vmul(right, num(2)), vmul(right, num(1, 2)), vsub(right, num(1)));
      return aPick(d, '다음 식의 값은?', right, d.shuffle(wrongs).filter((v) => v.length <= 2 && vfl(v) !== 0), {
        figure: exh(show(w)),
        explain: `${w.ts.slice(0, w.form === 0 || w.form === 2 ? 3 : 4).map((t) => `${th(t)} = ${vh(tv(t))}`).join(', ')}이므로 식의 값은 ${vh(right)}이다.`
      });
    }),
    T('special-rational', '특수각의 삼각비로 된 분수식을 유리화하기', '①25', (d) => {
      // (p ± q × r)/(s ± t × u) 꼴. 분모가 a + b√m 꼴이 되어 켤레를 곱해 유리화한다. 값은 a + b√m(a, b 정수).
      const ONEV = [['tan', 45], ['sin', 90], ['cos', 0]];
      const w = d.until(() => {
        const n1 = d.pick(ONEV), n2 = term(d), n3 = term(d), s1 = d.pick(['+', '-']), d1 = d.pick(ONEV), d2_ = term(d), d3 = term(d), s2 = d.pick(['+', '-']), prodTop = d.bool(), prodBot = d.bool();
        const top = opv(tv(n1), s1, prodTop ? vmul(tv(n2), tv(n3)) : tv(n2)), bottom = opv(tv(d1), s2, prodBot ? vmul(tv(d2_), tv(d3)) : tv(d2_));
        let v = null; try { v = vdiv(top, bottom); } catch (e) { v = null; }
        return { n1, n2, n3, s1, d1, d2: d2_, d3, s2, prodTop, prodBot, top, bottom, v };
      }, (z) => z.v && kindOf(z.v) === 'sum' && z.bottom.length === 2 && z.top.length === 2 && Math.abs(z.v[0].q.p) <= 30 && Math.abs(z.v[1].q.p) <= 30);
      const o = (s) => ' ' + ITALIC(OPS[s]) + ' ';
      const topH = `${th(w.n1)}${o(w.s1)}${w.prodTop ? th(w.n2) + o('*') + th(w.n3) : th(w.n2)}`, botH = `${th(w.d1)}${o(w.s2)}${w.prodBot ? th(w.d2) + o('*') + th(w.d3) : th(w.d2)}`;
      const L = w.bottom.reduce((l, t) => lcm(l, t.q.q), 1), conj = vmul([w.bottom[0], { q: Q(-w.bottom[1].q.p, w.bottom[1].q.q), m: w.bottom[1].m }], num(L));
      return aSum('다음을 계산하시오.', w.v, { figure: exh(frac(topH, botH)),
        explain: `분자는 ${vh(w.top)}, 분모는 ${vh(w.bottom)}이다. 분모의 근호 항의 부호를 바꾼 ${K.vj(conj, '을/를')} 분자와 분모에 곱해 분모를 유리화하면 ${vh(w.v)}이다.` });
    }),
    T('special-expand', '특수각의 삼각비가 든 두 식의 곱을 전개하기', '①25', (d) => {
      // (p + q)(r − s) 꼴. 틀린 보기: 가운데 두 항을 빠뜨린 것(앞끼리·뒤끼리만 곱함), 빼는 항의 부호를 잘못 붙인 것.
      const w = d.until(() => { const ts = [term(d), term(d), term(d), term(d)], s1 = d.pick(['+', '-']), s2 = d.pick(['+', '-']); return { ts, s1, s2 }; },
        (z) => { const [a, b, c, e] = z.ts.map(tv), v = vmul(opv(a, z.s1, b), opv(c, z.s2, e)); return new Set(z.ts.map((t) => t.join())).size === 4 && v.length >= 1 && v.length <= 3 && vfl(v) !== 0 && [a, b, c, e].filter((x) => x.length && x[0].m > 1).length >= 2; });
      const [a, b, c, e] = w.ts.map(tv), right = vmul(opv(a, w.s1, b), opv(c, w.s2, e));
      const o = (s) => ' ' + ITALIC(OPS[s]) + ' ', [ha, hb, hc, he] = w.ts.map(th);
      const flip = (s) => (s === '+' ? '-' : '+');
      const wrongs = [opv(vmul(a, c), '+', vmul(opv(num(0), w.s1, b), opv(num(0), w.s2, e))), vmul(opv(a, flip(w.s1), b), opv(c, w.s2, e)), vmul(opv(a, w.s1, b), opv(c, flip(w.s2), e)), vneg(right), vmul(opv(a, flip(w.s1), b), opv(c, flip(w.s2), e))];
      return aPick(d, '다음 식의 값은?', right, wrongs, {
        figure: exh(`(${ha}${o(w.s1)}${hb})(${hc}${o(w.s2)}${he})`),
        explain: `${w.ts.map((t) => `${th(t)} = ${vh(tv(t))}`).join(', ')}이므로 (${vh(opv(a, w.s1, b))})(${vh(opv(c, w.s2, e))}) = ${vh(right)}이다.`
      });
    }),
    T('special-truth', '특수각의 삼각비가 든 등식의 참·거짓', '①26', (d, n) => {
      const ANG = [0, 30, 45, 60, 90], tm = () => term(d, ANG), V3 = [num(1, 2), num(1), rad(1, 2, 2), rad(1, 3, 2), sqrtN(3), num(2)];
      // 등식 하나: [글, 참인가]
      const make = () => {
        const kind = d.int(0, 5), p = tm(), q = tm(), r = tm();
        if (kind === 0) return [`${th(p)} = ${th(q)}`, veq(tv(p), tv(q)), p.join() !== q.join()];
        if (kind === 1) return [`${th(p)} + ${th(q)} = ${th(r)}`, veq(vadd(tv(p), tv(q)), tv(r)), p.join() !== q.join()];
        if (kind === 2) { const c = d.bool() ? vmul(tv(p), tv(q)) : d.pick(V3); return [`${th(p)} × ${th(q)} = ${vh(c)}`, veq(vmul(tv(p), tv(q)), c), tv(p).length && tv(q).length && p.join() !== q.join()]; }
        if (kind === 3) return [`${th(p)} = ${frac(1, th(q))}`, tv(q).length > 0 && veq(tv(p), vinv(tv(q))), tv(q).length > 0 && p.join() !== q.join()];
        if (kind === 4) return [`${th(p)} = ${th(q)} × ${th(r)}`, veq(tv(p), vmul(tv(q), tv(r))), tv(p).length && p.join() !== q.join() && p.join() !== r.join()];
        const f = d.pick(['sin', 'tan']), a = f === 'tan' ? 30 : d.pick([30, 45]); return [`${fd(f, 2 * a)} = 2 ${fd(f, a)}`, veq(SV[f][2 * a], vmul(num(2), SV[f][a])), true];
      };
      const pool = d.until(() => { const out = [], seen = new Set(); for (let i = 0; i < 400 && out.length < 40; i += 1) { const s = make(); if (s[2] && !seen.has(s[0])) { seen.add(s[0]); out.push(s); } } return out; },
        (list) => list.filter((s) => s[1]).length >= 4 && list.filter((s) => !s[1]).length >= 3);
      const yes = d.shuffle(pool.filter((s) => s[1])), no = d.shuffle(pool.filter((s) => !s[1]));
      const why = (s) => s[0].replace(/(sin|cos|tan) (\d+)°/g, (m, f, a) => vh(SV[f][Number(a)]));
      if (n === 0) {
        const rows = yes.slice(0, 4).map((s) => [s[0], false]).concat([[no[0][0], true]]);
        return pickRows(d, '다음 중 옳지 않은 것은?', rows, { explain: `값을 넣으면 「${why(no[0])}」로 양쪽이 같지 않다. 나머지는 모두 양쪽의 값이 같다.` });
      }
      const k = d.int(1, 3), claims = d.shuffle(yes.slice(0, k).map((s) => [s[0], true]).concat(no.slice(0, 4 - k).map((s) => [s[0], false])));
      return pickAll(d, '다음 보기 가운데 옳은 것을 모두 고른 것은?', claims, { explain: claims.map((c, i) => `${K.KS[i]}. ${why(c)} — ${c[1] ? '옳다' : '옳지 않다'}`).join(' ') });
    }, { count: 2 }),
    T('special-inverse', '삼각비의 값으로 각의 크기를 구해 다른 삼각비 구하기', '①27', (d) => {
      // f(x° ± s°) = 특수각의 값 → x → g(x°)
      const w = d.until(() => { const t = d.pick(DEGS), x = d.pick(DEGS), f = d.pick(FN3), g = d.pick(FN3); return { t, x, s: t - x, f, g }; }, (z) => z.s !== 0);
      const { t, x, s, f, g } = w, val = SV[f][t], arg = s > 0 ? `${X}° + ${s}°` : `${X}° − ${-s}°`, right = SV[g][x];
      const pool = [num(1, 2), rad(1, 2, 2), rad(1, 3, 2), rad(1, 3, 3), num(1), rad(1, 3)];
      return aPick(d, `${nb(`${f}(${arg}) = `)}${vh(val)}일 때, ${fx(g, 'x')}의 값은? (단, 0° &lt; ${arg} &lt; 90°)`, right, d.shuffle(pool.filter((v) => !veq(v, right))), {
        sort: true,
        explain: `${fd(f, t)} = ${vh(val)}이므로 ${arg} = ${t}°, ${X} = ${x}이다. ${fd(g, x)} = ${vh(right)}이다.`
      });
    }),
    T('special-angles-ratio', '세 내각의 크기의 비로 각을 구해 삼각비의 비 구하기', '①28', (d, n) => {
      // 세 내각의 비(가장 작은 각 또는 가운데 각이 30°·45°·60°)
      const w = d.until(() => { const a = d.int(1, 9), b = d.int(1, 9), c = d.int(1, 9); return [a, b, c].sort((x, y) => x - y); }, ([a, b, c]) => {
        const s = a + b + c; if (gcd(gcd(a, b), c) !== 1 || 180 % s !== 0 || a === b || b === c) return false;
        const ang = (n === 0 ? a : b) * 180 / s; return DEGS.includes(ang);
      });
      const [a, b, c] = w, s = a + b + c, A = (n === 0 ? a : b) * 180 / s;
      const ratioOf = (vals) => {
        // 정수 계수로 맞춘 뒤, 근호가 가장 적게 남는 꼴로 적는다.
        const scale = (vs) => { const L = vs.reduce((l, v) => lcm(l, v[0].q.q), 1); const out = vs.map((v) => vmul(v, num(L))); const g = out.reduce((gg, v) => gcd(gg, Math.abs(v[0].q.p)), 0); return out.map((v) => vmul(v, num(1, g))); };
        let best = scale(vals);
        for (const m of [2, 3]) { const alt = scale(vals.map((v) => vdiv(v, sqrtN(m)))); if (alt.filter((v) => v[0].m > 1).length < best.filter((v) => v[0].m > 1).length) best = alt; }
        return best;
      };
      const show = (vals) => nb(ratioOf(vals).map(vh).join(' : '));
      const sinCosTan = (g) => [SV.sin[g], SV.cos[g], SV.tan[g]], right = sinCosTan(A);
      const cands = [right, sinCosTan(A === 30 ? 60 : 30), sinCosTan(A === 45 ? 60 : 45), [SV.cos[A], SV.sin[A], SV.tan[A]], [SV.sin[A], SV.tan[A], SV.cos[A]], [SV.tan[A], SV.cos[A], SV.sin[A]]];
      const keyOf = (vals) => vals.map((v) => (vfl(v) / vfl(vals[0])).toFixed(6)).join(',');
      const pool = []; for (const v of cands) if (!pool.some((p) => keyOf(p) === keyOf(v)) && pool.length < 5) pool.push(v);
      const rows = pool.map((v, i) => [show(v), i === 0]);
      return pickRows(d, `세 내각의 크기의 비가 ${nb(`${a} : ${b} : ${c}`)}인 삼각형에서 ${n === 0 ? '가장 작은' : '두 번째로 작은'} 내각의 크기를 A라 할 때, ${nb(`${fn('sin', 'A')} : ${fn('cos', 'A')} : ${fn('tan', 'A')}`)}는?`, rows, {
        explain: `세 내각의 크기의 합은 180°이므로 A = 180° × ${frac(n === 0 ? a : b, s)} = ${A}°이다. ${fd('sin', A)} : ${fd('cos', A)} : ${fd('tan', A)} = ${right.map(vh).join(' : ')} = ${show(right)}이다.`,
        rule: n === 0 ? 'small' : 'middle'
      });
    }, { count: 2 })
  ]);

  // ── 특수각으로 변의 길이와 넓이 ──
  // 그림 속 각의 글
  const dg = (v) => v + '°';
  B.addTypes(UNIT, 'length', [
    T('length-one', '한 변의 길이와 특수각으로 직각삼각형의 다른 변 구하기', '①30', (d, n) => {
      // ∠C = 90°, ∠A = θ. n = 0: 빗변 AB 를 주고 근호가 남는 변을, n = 1: 직각을 낀 변을 주고 근호가 남는 변을 묻는다.
      const w = d.until(() => {
        const th0 = d.pick(DEGS), pose = d.pick(['right', 'left']);
        let given, ask, gv, x;
        if (n === 0) { const c = 2 * d.int(2, 7); given = 'AB'; gv = c; ask = th0 === 60 ? 'BC' : th0 === 30 ? 'AC' : d.pick(['AC', 'BC']); x = vmul(num(c), ask === 'BC' ? SV.sin[th0] : SV.cos[th0]); }
        else {
          const kind = d.int(0, 1);
          if (th0 === 45) { const a = d.int(2, 9); given = d.pick(['AC', 'BC']); gv = a; ask = 'AB'; x = vmul(num(a), sqrtN(2)); }
          else if (kind === 0) { const a = d.int(2, 9); // 짧은 변(30°의 대변)으로 긴 변
            given = th0 === 30 ? 'BC' : 'AC'; ask = th0 === 30 ? 'AC' : 'BC'; gv = a; x = vmul(num(a), sqrtN(3)); }
          else { const a = 3 * d.int(2, 4); given = th0 === 30 ? 'AC' : 'BC'; ask = th0 === 30 ? 'BC' : 'AC'; gv = a; x = vdiv(num(a), sqrtN(3)); }
        }
        const lens = { AC: Math.cos(th0 * Math.PI / 180), BC: Math.sin(th0 * Math.PI / 180) };
        const labels = {}; labels[given === 'AB' ? 'AB' : given === 'AC' ? 'AC' : 'CB'] = gv + ' cm'; labels[ask === 'AB' ? 'AB' : ask === 'AC' ? 'AC' : 'CB'] = sv('x') + ' cm';
        const f = rtFig({ R: 'C', P: 'A', Q: 'B' }, lens.AC, lens.BC, pose, labels, { ang: [['A', 'C', 'B', dg(th0), { r: 20 }]] });
        return { th0, given, ask, gv, x, f };
      }, (z) => kindOf(z.x) === 'rad' && z.x[0].q.p >= 2 && !z.f.b.clash());
      const { th0, given, ask, gv, x } = w;
      const howWord = given === 'AB' ? (ask === 'BC' ? `${fd('sin', th0)} = ${frac(seg('BC'), seg('AB'))}이므로 ${X} = ${gv} × ${fd('sin', th0)} = ${gv} × ${vh(SV.sin[th0])}` : `${fd('cos', th0)} = ${frac(seg('AC'), seg('AB'))}이므로 ${X} = ${gv} × ${fd('cos', th0)} = ${gv} × ${vh(SV.cos[th0])}`)
        : ask === 'AB' ? `${fd('cos', 45)} = ${frac(seg(given), seg('AB'))}이므로 ${X} = ${gv} ÷ ${vh(SV.cos[45])}` : given === 'AC' ? `${fd('tan', th0)} = ${frac(seg('BC'), seg('AC'))}이므로 ${X} = ${gv} × ${vh(SV.tan[th0])}` : `${fd('tan', th0)} = ${frac(seg('BC'), seg('AC'))}이므로 ${X} = ${gv} ÷ ${vh(SV.tan[th0])}`;
      return aRad(`그림과 같이 ∠C = 90°, ∠A = ${th0}°인 직각삼각형 ABC에서 ${X}의 값은?`, x, {
        figure: w.f.b.svg(`직각삼각형 ABC. ∠C에 직각 표시가 있고 ∠A에 ${th0}°가 적혀 있다. ${given} = ${gv} cm, ${ask} = x cm`),
        explain: `∠A의 대변은 ${seg('BC')}, 이웃한 변은 ${seg('AC')}, 빗변은 ${seg('AB')}이다. ${howWord} = ${vh(x)}이다.`,
        rule: n === 0 ? 'from-hyp' : 'from-leg'
      });
    }, { count: 2 }),
    T('length-shared', '한 변을 함께 가진 두 직각삼각형에서 특수각으로 길이 구하기', '①31', (d, n) => {
      if (n === 0) {
        // △ABC 에서 AD ⊥ BC, ∠B = β, ∠C = γ, AB = c → AD = c sin β → AC = AD ÷ sin γ
        const w = d.until(() => { const beta = d.pick([30, 60]), gamma = d.pick([30, 45, 60]), c = d.int(2, 12); const ad = vmul(num(c), SV.sin[beta]), ac = vdiv(ad, SV.sin[gamma]); return { beta, gamma, c, ad, ac }; },
          (z) => z.beta !== z.gamma && kindOf(z.ac) === 'rad' && z.ac[0].q.p >= 2 && z.ac[0].q.p <= 30);
        const { beta, gamma, c, ad, ac } = w, rb = beta * Math.PI / 180, rg = gamma * Math.PI / 180, h = Math.sin(rb), bd = Math.cos(rb), dc = h / Math.tan(rg);
        const f = fig({ A: [bd, h], B: [0, 0], C: [bd + dc, 0], D: [bd, 0] }, { polys: [['A', 'B', 'C']], segs: [['A', 'D']], right: [['D', 'C', 'A']], side: [['A', 'B', c + ' cm']],
          ang: [['B', 'C', 'A', dg(beta), { r: 18 }], ['C', 'A', 'B', dg(gamma), { r: 18 }]], size: [196, 110] });
        return aRad(`그림과 같이 △ABC의 꼭짓점 A에서 ${seg('BC')}에 내린 수선의 발을 D라 하자. ${seg('AB')} = ${c} cm, ∠B = ${beta}°, ∠C = ${gamma}°일 때, ${seg('AC')}의 길이는?`, ac, {
          unit: 'cm', figure: f.b.svg(`삼각형 ABC. 꼭짓점 A에서 변 BC에 내린 수선 AD가 있고 직각 표시가 있다. AB = ${c} cm, ∠B = ${beta}°, ∠C = ${gamma}°`),
          explain: `△ABD에서 ${seg('AD')} = ${c} × ${fd('sin', beta)} = ${vh(ad)}(cm)이다. △ADC에서 ${fd('sin', gamma)} = ${frac(seg('AD'), seg('AC'))}이므로 ${seg('AC')} = ${vh(ad)} ÷ ${vh(SV.sin[gamma])} = ${vh(ac)}(cm)이다.`,
          rule: 'altitude'
        });
      }
      // ∠ABC = ∠BCD = 90°, ∠BAC = α, ∠BDC = δ, AB = a → BC = a tan α → BD = BC ÷ sin δ
      const w = d.until(() => { const alpha = d.pick(DEGS), delta = d.pick(DEGS), a = d.int(1, 9); const bc = vmul(num(a), SV.tan[alpha]), bd = vdiv(bc, SV.sin[delta]); return { alpha, delta, a, bc, bd }; },
        (z) => kindOf(z.bd) === 'rad' && z.bd[0].q.p >= 2 && z.bd[0].q.p <= 30 && kindOf(z.bc) !== 'int' && vfl(z.bc) / z.a <= 2 && vfl(z.bc) / Math.tan(z.delta * Math.PI / 180) / z.a <= 2.4);
      const { alpha, delta, a, bc, bd } = w, BCf = vfl(bc), CDf = BCf / Math.tan(delta * Math.PI / 180);
      const f = fig({ A: [0, a], B: [0, 0], C: [BCf, 0], D: [BCf, CDf] }, { polys: [['A', 'B', 'C'], ['B', 'C', 'D']], right: [['B', 'A', 'C'], ['C', 'B', 'D']], side: [['A', 'B', a + ' cm']],
        ang: [['A', 'B', 'C', dg(alpha), { r: 16 }], ['D', 'C', 'B', dg(delta), { r: 16 }]], size: [170, 140] });
      return aRad(`그림에서 ∠ABC = ∠BCD = 90°, ∠BAC = ${alpha}°, ∠BDC = ${delta}°이고 ${seg('AB')} = ${a} cm일 때, ${seg('BD')}의 길이는?`, bd, {
        unit: 'cm', figure: f.b.svg(`두 직각삼각형 ABC, BCD가 변 BC를 함께 가진다. ∠ABC와 ∠BCD에 직각 표시가 있다. AB = ${a} cm, ∠BAC = ${alpha}°, ∠BDC = ${delta}°`),
        explain: `△ABC에서 ${fd('tan', alpha)} = ${frac(seg('BC'), seg('AB'))}이므로 ${seg('BC')} = ${a} × ${vh(SV.tan[alpha])} = ${vh(bc)}(cm)이다. △BCD에서 ${fd('sin', delta)} = ${frac(seg('BC'), seg('BD'))}이므로 ${seg('BD')} = ${vh(bc)} ÷ ${vh(SV.sin[delta])} = ${vh(bd)}(cm)이다.`,
        rule: 'two-rights'
      });
    }, { count: 2 }),
    T('length-diff', '한 꼭짓점에서 본 두 각으로 밑변 위의 길이 구하기', '①32', (d) => {
      // ∠C = 90°, D 는 BC 위, ∠B = β, ∠ADC = δ, AC = h → BD = h ÷ tan β − h ÷ tan δ
      const w = d.until(() => { const [beta, delta] = d.pick([[30, 45], [45, 60]]), h = delta === 60 ? 3 * d.int(1, 4) : d.int(2, 9); return { beta, delta, h }; }, () => true);
      const { beta, delta, h } = w, bc = vdiv(num(h), SV.tan[beta]), dc = vdiv(num(h), SV.tan[delta]), bd = vsub(bc, dc);
      const BC = vfl(bc), DC = vfl(dc);
      const f = fig({ A: [BC, h], B: [0, 0], C: [BC, 0], D: [BC - DC, 0] }, { polys: [['A', 'B', 'C']], segs: [['A', 'D']], right: [['C', 'B', 'A']], side: [['A', 'C', h + ' cm', 'B']],
        ang: [['B', 'C', 'A', dg(beta), { r: 20 }], ['D', 'C', 'A', dg(delta), { r: 14 }]], size: [210, 110] });
      return aSum(`그림과 같이 ∠C = 90°인 직각삼각형 ABC에서 ${seg('BC')} 위에 점 D가 있다. ∠B = ${beta}°, ∠ADC = ${delta}°, ${seg('AC')} = ${h} cm일 때, ${seg('BD')}의 길이는?`, bd, {
        unit: 'cm', figure: f.b.svg(`직각삼각형 ABC. ∠C에 직각 표시가 있고 변 BC 위의 점 D와 A를 이은 선분이 있다. ∠B = ${beta}°, ∠ADC = ${delta}°, AC = ${h} cm`),
        explain: `△ABC에서 ${fd('tan', beta)} = ${frac(seg('AC'), seg('BC'))}이므로 ${seg('BC')} = ${h} ÷ ${vh(SV.tan[beta])} = ${vh(bc)}(cm), △ADC에서 ${seg('DC')} = ${h} ÷ ${vh(SV.tan[delta])} = ${vh(dc)}(cm)이다. ${seg('BD')} = ${[vh(bc) + ' − ' + vh(dc), vh(bd)].filter((h, i, a) => i === 0 || stripH(h) !== stripH(a[0])).join(' = ')}(cm)이다.`
      });
    }),
    T('length-iso', '바깥각으로 이등변삼각형을 찾아 직각삼각형의 넓이 구하기', '①32', (d) => {
      // ∠C = 90°, ∠B = 30°, ∠ADC = 60° → ∠BAD = 30° 이므로 AD = BD
      const k = d.pick([2, 4, 6]), bd = 2 * k, ac = vmul(num(k), sqrtN(3)), area = vmul(num(3 * k * k, 2), sqrtN(3));
      const f = fig({ A: [3 * k, k * Math.sqrt(3)], B: [0, 0], C: [3 * k, 0], D: [2 * k, 0] }, { polys: [['A', 'B', 'C']], segs: [['A', 'D']], right: [['C', 'B', 'A']], fill: { 0: TINT }, side: [['B', 'D', bd + ' cm', 'A']],
        ang: [['B', 'C', 'A', dg(30), { r: 22 }], ['D', 'C', 'A', dg(60), { r: 13 }]], size: [210, 100] });
      return aRad(`그림과 같이 ∠C = 90°인 직각삼각형 ABC에서 ${seg('BC')} 위에 점 D가 있다. ∠B = 30°, ∠ADC = 60°, ${seg('BD')} = ${bd} cm일 때, △ABC의 넓이는?`, area, {
        unit: 'cm²', figure: f.b.svg(`직각삼각형 ABC가 색칠되어 있다. ∠C에 직각 표시가 있고 변 BC 위의 점 D와 A를 이은 선분이 있다. ∠B = 30°, ∠ADC = 60°, BD = ${bd} cm`),
        sq: [`${bd}**4*27`, '64'],
        explain: `∠ADC는 △ABD의 바깥각이므로 ∠BAD = 60° − 30° = 30°이고 △ABD는 ${seg('AD')} = ${seg('BD')} = ${bd} cm인 이등변삼각형이다. △ADC에서 ${seg('AC')} = ${bd} × ${vh(SV.sin[60])} = ${vh(ac)}(cm), ${seg('DC')} = ${bd} × ${vh(SV.cos[60])} = ${k}(cm)이므로 ${seg('BC')} = ${3 * k} cm이다. 넓이는 ${frac(1, 2)} × ${3 * k} × ${vh(ac)} = ${vh(area)}(cm²)이다.`
      });
    }),
    T('length-chain', '수선을 거듭 내려 길이와 넓이 구하기', '①33', (d, n) => {
      if (n === 0) {
        // ∠C = 90°, ∠B = β, AB = c, CD ⊥ AB, DE ⊥ BC → BE = c × (cos β)³
        const beta = d.pick([30, 45]), c = beta === 30 ? 8 * d.int(1, 3) : 4 * d.int(2, 5);
        const cb = SV.cos[beta], bc = vmul(num(c), cb), bdv = vmul(bc, cb), be = vmul(bdv, cb);
        const rb = beta * Math.PI / 180, BC = c * Math.cos(rb), A = [BC, BC * Math.tan(rb)], Dp = [BC * Math.cos(rb) ** 2, BC * Math.cos(rb) * Math.sin(rb)], E = [Dp[0], 0];
        const f = fig({ A, B: [0, 0], C: [BC, 0], D: Dp, E }, { polys: [['A', 'B', 'C']], segs: [['C', 'D'], ['D', 'E']], right: [['C', 'B', 'A'], ['D', 'C', 'A'], ['E', 'B', 'D']], dims: [['A', 'B', c + ' cm', 'C', 12]], nameAt: { D: beta + 315 },
          ang: [['B', 'C', 'A', dg(beta), { r: 22 }]], size: [210, 120] });
        return aRad(`그림과 같이 ∠C = 90°인 직각삼각형 ABC의 꼭짓점 C에서 ${seg('AB')}에 내린 수선의 발을 D, 점 D에서 ${seg('BC')}에 내린 수선의 발을 E라 하자. ${seg('AB')} = ${c} cm, ∠B = ${beta}°일 때, ${seg('BE')}의 길이는?`, be, {
          unit: 'cm', figure: f.b.svg(`직각삼각형 ABC. ∠C에 직각 표시가 있다. C에서 AB에 내린 수선 CD, D에서 BC에 내린 수선 DE가 있다. AB = ${c} cm, ∠B = ${beta}°`),
          explain: `△ABC에서 ${seg('BC')} = ${c} × ${fd('cos', beta)} = ${vh(bc)}(cm), △BCD에서 ${seg('BD')} = ${vh(bc)} × ${fd('cos', beta)} = ${vh(bdv)}(cm), △BDE에서 ${seg('BE')} = ${vh(bdv)} × ${fd('cos', beta)} = ${vh(be)}(cm)이다.`,
          rule: 'chain-length'
        });
      }
      // ∠B = 90°, ∠A = α, AC = 8k, BD ⊥ AC → △ABD 의 넓이 = ½ × AD × BD
      const alpha = d.pick([30, 60]), k = d.int(1, 2), ac = 8 * k, ab = vmul(num(ac), SV.cos[alpha]), bdv = vmul(ab, SV.sin[alpha]), adv = vmul(ab, SV.cos[alpha]), area = vmul(vmul(adv, bdv), num(1, 2));
      const ra = alpha * Math.PI / 180, AB = ac * Math.cos(ra), Cp = [ac, 0], Bp = [AB * Math.cos(ra), AB * Math.sin(ra)], Dp = [Bp[0], 0];
      const f = fig({ A: [0, 0], B: Bp, C: Cp, D: Dp }, { polys: [['A', 'B', 'C'], ['A', 'B', 'D']], fill: { 1: TINT }, segs: [['B', 'D']], right: [['B', 'A', 'C'], ['D', 'C', 'B']], dims: [['A', 'C', ac + ' cm', 'B', 14]], nameAt: { D: 60 },
        ang: [['A', 'C', 'B', dg(alpha), { r: 20 }]], size: [210, 110] });
      return aRad(`그림과 같이 ∠B = 90°인 직각삼각형 ABC의 꼭짓점 B에서 ${seg('AC')}에 내린 수선의 발을 D라 하자. ${seg('AC')} = ${ac} cm, ∠A = ${alpha}°일 때, △ABD의 넓이는?`, area, {
        unit: 'cm²', figure: f.b.svg(`직각삼각형 ABC. ∠B에 직각 표시가 있고 B에서 AC에 내린 수선 BD가 있다. 삼각형 ABD가 색칠되어 있다. AC = ${ac} cm, ∠A = ${alpha}°`),
        explain: `△ABC에서 ${seg('AB')} = ${ac} × ${fd('cos', alpha)} = ${vh(ab)}(cm)이다. △ABD에서 ${seg('BD')} = ${vh(ab)} × ${fd('sin', alpha)} = ${vh(bdv)}(cm), ${seg('AD')} = ${vh(ab)} × ${fd('cos', alpha)} = ${vh(adv)}(cm)이다. 넓이는 ${frac(1, 2)} × ${vh(adv)} × ${vh(bdv)} = ${vh(area)}(cm²)이다.`,
        rule: 'chain-area'
      });
    }, { count: 2 }),
    T('length-trapezoid', '특수각으로 높이를 구해 등변사다리꼴의 넓이 구하기', '①34', (d) => {
      const w = d.until(() => { const s = 2 * d.int(1, 3), t = d.int(2, 8); return { s, t }; }, (z) => (z.s * (2 * z.t + z.s)) % 4 === 0 && z.t >= z.s * 0.6 && z.t <= z.s * 2.2);
      const { s, t } = w, hgt = vmul(num(s), SV.sin[60]), bc = t + s, area = vmul(num(s * (2 * t + s), 4), sqrtN(3)), hf = s * Math.sqrt(3) / 2;
      const f = fig({ A: [s / 2, hf], B: [0, 0], C: [bc, 0], D: [s / 2 + t, hf] }, { polys: [['A', 'B', 'C', 'D']], fill: { 0: TINT }, ticks: [['A', 'B', 1], ['D', 'C', 1]], side: [['A', 'B', s + ' cm'], ['A', 'D', t + ' cm']],
        ang: [['B', 'C', 'A', dg(60), { r: 16 }]], size: [200, 100] });
      return aRad(`그림과 같이 ${seg('AD')} ∥ ${seg('BC')}이고 ${seg('AB')} = ${seg('DC')} = ${s} cm, ${seg('AD')} = ${t} cm, ∠B = 60°인 등변사다리꼴 ABCD의 넓이는?`, area, {
        unit: 'cm²', figure: f.b.svg(`등변사다리꼴 ABCD가 색칠되어 있다. 변 AB와 변 DC에 길이가 같다는 표시가 있다. AB = ${s} cm, AD = ${t} cm, ∠B = 60°`),
        sq: [`(${s}*(2*${t}+${s}))**2*3`, '16'],
        explain: `두 꼭짓점 A, D에서 ${seg('BC')}에 내린 수선의 발을 각각 H, H′이라 하면 높이 ${seg('AH')} = ${s} × ${vh(SV.sin[60])} = ${vh(hgt)}(cm), ${seg('BH')} = ${s} × ${vh(SV.cos[60])} = ${s / 2}(cm)이다. ${seg('BC')} = ${s / 2} + ${t} + ${s / 2} = ${bc}(cm)이므로 넓이는 ${frac(1, 2)} × (${t} + ${bc}) × ${vh(hgt)} = ${vh(area)}(cm²)이다.`
      });
    }),
    T('length-midpoint', '특수각과 중점으로 선분의 길이 구하기', '①35', (d) => {
      // ∠C = 90°, AB = c. 변 AC(또는 BC)의 중점 M 과 맞은편 꼭짓점을 잇는다. 각은 그 선분이 지나지 않는 꼭짓점에 준다(M 이 AC 위면 ∠A, BC 위면 ∠B).
      const onAC = d.bool(), at0 = onAC ? 'A' : 'B', g = onAC ? d.pick([30, 60]) : 30, c = 4 * d.int(2, 5);   // M 이 BC 위이고 ∠B = 60°이면 그림이 좁아 중선이 각의 글을 지난다.
      // ∠A = g 이면 AC = c cos g, BC = c sin g / ∠B = g 이면 BC = c cos g, AC = c sin g
      const ac = vmul(num(c), at0 === 'A' ? SV.cos[g] : SV.sin[g]), bcv = vmul(num(c), at0 === 'A' ? SV.sin[g] : SV.cos[g]);
      const half = vmul(onAC ? ac : bcv, num(1, 2)), other = onAC ? bcv : ac;
      const sqv = vadd(vmul(other, other), vmul(half, half)), x = K.sqrtQ(sqv[0].q);
      const BCf = vfl(bcv), ACf = vfl(ac), M = onAC ? [BCf, ACf / 2] : [BCf / 2, 0];
      const f = fig({ A: [BCf, ACf], B: [0, 0], C: [BCf, 0], M }, { polys: [['A', 'B', 'C']], segs: [onAC ? ['B', 'M'] : ['A', 'M']], right: [['C', 'B', 'A']], ticks: onAC ? [['A', 'M', 1], ['M', 'C', 1]] : [['B', 'M', 1], ['M', 'C', 1]],
        side: [['A', 'B', c + ' cm', 'C']], ang: [at0 === 'A' ? ['A', 'B', 'C', dg(g), { r: 16 }] : ['B', 'C', 'A', dg(g), { r: 20 }]], size: [196, 120] });
      const askN = onAC ? 'BM' : 'AM', fs = at0 === 'A' ? ['cos', 'sin'] : ['sin', 'cos'];
      return aRad(`그림과 같이 ∠C = 90°인 직각삼각형 ABC에서 점 M은 ${seg(onAC ? 'AC' : 'BC')}의 중점이다. ${seg('AB')} = ${c} cm, ∠${at0} = ${g}°일 때, ${seg(askN)}의 길이는?`, x, {
        unit: 'cm', figure: f.b.svg(`직각삼각형 ABC. ∠C에 직각 표시가 있고 변 ${onAC ? 'AC' : 'BC'}의 중점 M에 길이가 같다는 표시가 있다. 선분 ${askN}이 그어져 있다. AB = ${c} cm, ∠${at0} = ${g}°`),
        sq: [`(${c}**2)*${qmul(sqv[0].q, Q(16, c * c)).p}`, '16'],
        explain: `△ABC에서 ${seg('AC')} = ${c} × ${fd(fs[0], g)} = ${vh(ac)}(cm), ${seg('BC')} = ${c} × ${fd(fs[1], g)} = ${vh(bcv)}(cm)이다. ${seg(onAC ? 'MC' : 'CM')} = ${vh(half)} cm이므로 ${PYTH}${seg(askN)} = ${rt(`(${vh(other)})${sup(2)} + (${vh(half)})${sup(2)}`)} = ${vh(x)}(cm)이다.`,
        rule: onAC ? 'mid-ac' : 'mid-bc'
      });
    }),
    T('length-bisector', '각의 이등분선으로 생긴 이등변삼각형에서 길이 구하기', '①35', (d) => {
      // ∠C = 90°, ∠B = 30°, AB = c, ∠A 의 이등분선이 BC 와 만나는 점 D → ∠BAD = ∠B = 30°
      const askBD = d.bool(), c = askBD ? 3 * d.int(2, 5) : 6 * d.int(2, 3);
      const bd = vdiv(num(c, 2), SV.cos[30]), bcv = vmul(num(c), SV.cos[30]), cd = vsub(bcv, bd), x = askBD ? bd : cd;
      const BC = c * Math.cos(Math.PI / 6), AC = c / 2, BD = c / Math.sqrt(3);
      const f = fig({ A: [BC, AC], B: [0, 0], C: [BC, 0], D: [BD, 0] }, { polys: [['A', 'B', 'C']], segs: [['A', 'D']], right: [['C', 'B', 'A']], side: [['A', 'B', c + ' cm', 'C']],
        ang: [['B', 'C', 'A', dg(30), { r: 22 }], ['A', 'B', 'D', '', { r: 16 }], ['A', 'D', 'C', '', { r: 19 }]], size: [210, 104] });
      return aRad(`그림과 같이 ∠C = 90°, ∠B = 30°인 직각삼각형 ABC에서 ∠A의 이등분선이 ${seg('BC')}와 만나는 점을 D라 하자. ${seg('AB')} = ${c} cm일 때, ${seg(askBD ? 'BD' : 'CD')}의 길이는?`, x, {
        unit: 'cm', figure: f.b.svg(`직각삼각형 ABC. ∠C에 직각 표시가 있고 ∠B = 30°이다. ∠A를 이등분하는 선분 AD가 있다. AB = ${c} cm`),
        explain: `∠BAC = 60°이므로 ∠BAD = ∠DAC = 30° = ∠B이고 △DAB는 ${seg('DA')} = ${seg('DB')}인 이등변삼각형이다. 점 D에서 ${seg('AB')}에 내린 수선의 발을 H라 하면 ${seg('BH')} = ${c / 2} cm이고 ${seg('BD')} = ${c / 2} ÷ ${vh(SV.cos[30])} = ${vh(bd)}(cm)이다.${askBD ? '' : ` ${seg('BC')} = ${c} × ${vh(SV.cos[30])} = ${vh(bcv)}(cm)이므로 ${seg('CD')} = ${vh(bcv)} − ${vh(bd)} = ${vh(cd)}(cm)이다.`}`,
        rule: askBD ? 'bisect-bd' : 'bisect-cd'
      });
    })
  ]);

  // ── 사분원과 0°, 90°의 삼각비, 대소 ──
  B.addTypes(UNIT, 'quarter', [
    T('quarter-read', '사분원 그림의 눈금으로 삼각비의 값 읽기', '①37', (d, n) => {
      const w = d.until(() => { const t = d.int(20, 55); return { t, s: Math.sin(t * Math.PI / 180), c: Math.cos(t * Math.PI / 180), tn: Math.tan(t * Math.PI / 180) }; },
        (z) => ![30, 45].includes(z.t) && z.tn - z.s >= 0.12 && Math.abs(z.tn - 1) >= 0.12 && Math.abs(z.c - z.s) >= 0.06 && d2(z.s) !== d2(z.c));
      const { t, s, c, tn } = w, b = quarterFig(t, { A: 'A', P: 'B', F: 'C', T: 'D' }, { ticks: { s, c, t: tn }, angleLabel: dg(t) });
      const f0 = n === 0 ? d.pick(FN3) : d.pick(['sin', 'cos']), ang = n === 0 ? t : 90 - t;
      const val = n === 0 ? (f0 === 'sin' ? s : f0 === 'cos' ? c : tn) : (f0 === 'sin' ? c : s);
      const opts = [d2(s), d2(c), d2(tn), '1'], right = d2(val);
      const segOf = n === 0 ? (f0 === 'sin' ? 'BC' : f0 === 'cos' ? 'OC' : 'AD') : (f0 === 'sin' ? 'OC' : 'BC');
      return pickRows(d, `그림과 같이 반지름의 길이가 1인 사분원에서 ${fd(f0, ang)}의 값은?`, opts.map((o) => [o, o === right]), {
        figure: b.svg(`중심이 O이고 반지름의 길이가 1인 사분원. 호 위의 점 B에서 OA에 내린 수선의 발이 C이고, A에서 그은 접선이 OB의 연장선과 D에서 만난다. ∠BOA = ${t}°. 세로축 눈금 ${d2(s)}, ${d2(tn)}, 가로축 눈금 ${d2(c)}`),
        explain: n === 0 ? `${fd(f0, t)} = ${frac(seg(segOf), f0 === 'tan' ? seg('OA') : seg('OB'))} = ${seg(segOf)} = ${right}이다.`
          : `△OBC에서 ∠OBC = 90° − ${t}° = ${ang}°이므로 ${fd(f0, ang)} = ${frac(seg(segOf), seg('OB'))} = ${seg(segOf)} = ${right}이다.`,
        rule: n === 0 ? 'read-same' : 'read-other'
      });
    }, { count: 2 }),
    T('quarter-segment', '사분원에서 삼각비의 값을 나타내는 선분 고르기', '①38', (d, n) => {
      const t = d.int(33, 55), letters = d.shuffle(['A', 'B', 'C', 'D', 'E']), nm = { A: letters[0], P: letters[1], F: letters[2], T: letters[3], E: letters[4] };
      const b = quarterFig(t, nm, { angleAt: n === 0 ? 'O' : 'P', angleLabel: n === 0 ? degx('x') : degx('y') });
      const f0 = n === 0 ? d.pick(FN3) : d.pick(['sin', 'cos']);
      const segs = { PF: nm.P + nm.F, OF: 'O' + nm.F, AT: nm.A + nm.T, OP: 'O' + nm.P, FA: nm.F + nm.A, OT: 'O' + nm.T };
      const want = n === 0 ? (f0 === 'sin' ? 'PF' : f0 === 'cos' ? 'OF' : 'AT') : (f0 === 'sin' ? 'OF' : 'PF');
      const pool = ['PF', 'OF', 'AT', 'FA', 'OT'];
      const ang = n === 0 ? `∠${nm.P}O${nm.A} = ${X}°` : `∠O${nm.P}${nm.F} = ${V('y')}°`;
      return pickRows(d, `그림과 같이 반지름의 길이가 1인 사분원에서 ${ang}일 때, 길이가 ${fx(f0, n === 0 ? 'x' : 'y')}의 값과 같은 선분은?`, pool.map((k) => [seg(segs[k]), k === want]), {
        figure: b.svg(`중심이 O이고 반지름의 길이가 1인 사분원. 반지름 O${nm.A}, O${nm.E}와 호 위의 점 ${nm.P}가 있다. ${nm.P}에서 O${nm.A}에 내린 수선의 발이 ${nm.F}이고, ${nm.A}에서 그은 접선이 O${nm.P}의 연장선과 ${nm.T}에서 만난다. ${n === 0 ? `∠${nm.P}O${nm.A}에 x°` : `∠O${nm.P}${nm.F}에 y°`}가 적혀 있다`),
        explain: n === 0 ? `반지름 ${seg('O' + nm.P)} = ${seg('O' + nm.A)} = 1이므로 ${fx('sin', 'x')} = ${seg(segs.PF)}, ${fx('cos', 'x')} = ${seg(segs.OF)}, ${fx('tan', 'x')} = ${frac(seg(segs.AT), seg('O' + nm.A))} = ${seg(segs.AT)}이다.`
          : `△O${nm.P}${nm.F}에서 빗변 ${seg('O' + nm.P)} = 1이고 ∠O${nm.P}${nm.F}의 대변은 ${seg(segs.OF)}, 이웃한 변은 ${seg(segs.PF)}이므로 ${fx('sin', 'y')} = ${seg(segs.OF)}, ${fx('cos', 'y')} = ${seg(segs.PF)}이다.`,
        rule: n === 0 ? 'seg-center' : 'seg-arc'
      });
    }, { count: 2 }),
    T('quarter-expr', '부채꼴에서 선분의 길이를 삼각비로 나타내기', '①38', (d) => {
      // 반지름 1, 중심각 θ 인 부채꼴 OAB(B 는 가로 반지름의 끝), A 에서 OB 에 내린 수선의 발 H → HB = 1 − cos θ
      const t = d.pick([36, 38, 42, 48, 52, 54, 56, 64, 68, 72]), R = 132, r0 = t * Math.PI / 180, O = [0, 0], Bp = [R, 0], A = [R * Math.cos(r0), -R * Math.sin(r0)], H = [A[0], 0];
      const b = Board(); b.fan(O, R, 0, t).seg(A, H).corner(H, Bp, A, '').corner(O, Bp, A, dg(t), { r: 20 }).text([(H[0] + R) / 2, 0], '', {});
      b.name(O, 'O', 200, 10).name(A, 'A', 60, 10).name(Bp, 'B', 330, 10).name(H, 'H', 270, 11).beside(O, A, '1', Bp);
      const c = fd('cos', t), s = fd('sin', t), tn = fd('tan', t);
      const rows = [[`1 − ${c}`, true], [`1 + ${c}`, false], [`1 − ${s}`, false], [c, false], [`${tn} − ${c}`, false]];
      return pickRows(d, `그림과 같이 반지름의 길이가 1이고 중심각의 크기가 ${t}°인 부채꼴 OBA에서 ${seg('AH')} ⊥ ${seg('OB')}일 때, ${seg('HB')}의 길이는?`, rows, {
        figure: b.svg(`중심이 O이고 반지름의 길이가 1인 부채꼴 OBA. 중심각 ∠AOB = ${t}°. A에서 OB에 내린 수선의 발이 H이다`),
        explain: `△AOH에서 ${c} = ${frac(seg('OH'), seg('OA'))} = ${seg('OH')}이므로 ${seg('HB')} = ${seg('OB')} − ${seg('OH')} = 1 − ${c}이다.`
      });
    }),
    T('quarter-change', '각의 크기가 변할 때 삼각비의 값의 변화', '①39', (d) => {
      const s = fx('sin', 'x'), c = fx('cos', 'x'), t = fx('tan', 'x');
      const yes = [`${X}의 값이 커지면 ${s}의 값도 커진다.`, `${X}의 값이 커지면 ${c}의 값은 작아진다.`, `${X}의 값이 커지면 ${t}의 값도 커진다.`, `${s}의 값이 가장 큰 것은 ${X} = 90일 때이다.`, `${c}의 값은 0 이상 1 이하이다.`, `${fd('tan', 90)}의 값은 정할 수 없다.`];
      const no = [
        [`${X}의 값이 커지면 ${c}의 값도 커진다.`, `${c}는 ${X}의 값이 커지면 작아진다.`, yes[1]],
        [`${t}의 값은 1보다 클 수 없다.`, `${fd('tan', 60)} = ${rt(3)}처럼 1보다 클 수 있다.`],
        [`${X}의 값이 작아지면 ${s}와 ${c}의 값도 모두 작아진다.`, `${X}의 값이 작아지면 ${c}의 값은 커진다.`, yes[1]],
        [`${s}의 값이 가장 큰 것은 ${X} = 45일 때이다.`, `${s}의 값이 가장 큰 것은 ${X} = 90일 때(1)이다.`, yes[3]],
        [`${fd('cos', 0)} = 0이다.`, `${fd('cos', 0)} = 1이다.`],
        [`${fd('tan', 90)} = 1이다.`, `${fd('tan', 90)}의 값은 정할 수 없다.`, yes[5]]
      ];
      const wantTrue = d.bool();
      return seal(claimQ(d, `0° ≤ ${X}° ≤ 90°일 때, 다음 중 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, yes, no, wantTrue));
    }),
    T('quarter-given', '사분원의 선분과 주어진 삼각비의 값으로 각과 선분 구하기', '①40', (d) => {
      // 사분원 위의 점 B 에서 OA 에 내린 수선의 발 D. AD 를 주고, 그 각의 sin·cos 값을 준다 → OD = cos x → x → BD = sin x
      const w = d.until(() => { const t = d.int(25, 65); return { t, s: Number(Math.sin(t * Math.PI / 180).toFixed(2)), c: Number(Math.cos(t * Math.PI / 180).toFixed(2)) }; }, (z) => ![30, 45, 60].includes(z.t) && Math.abs(z.s - z.c) >= 0.08 && z.c < 0.95);
      const { t, s, c } = w, ad = Number((1 - c).toFixed(2));
      const b = quarterFig(t, { A: 'A', P: 'B', F: 'D' }, { angleLabel: degx('x'), noTangent: true });
      const rows = [];
      for (const [v, ok] of [[d2(s), true], [d2(c), false], [d2(ad), false], [d2(1 - s), false], [d2(s + ad), false], [d2(1 + ad), false], [d2(s / 2), false]]) if (!rows.some((r) => r[0] === v) && rows.length < 5) rows.push([v, ok]);
      return pickRows(d, `그림과 같이 반지름의 길이가 1인 사분원에서 ∠BOA = ${X}°이고 점 B에서 ${seg('OA')}에 내린 수선의 발을 D라 하자. ${seg('AD')} = ${d2(ad)}일 때, ${seg('BD')}의 길이는? (단, ${fd('sin', t)} = ${d2(s)}, ${fd('cos', t)} = ${d2(c)}${tail(Number(d2(c).slice(-1)), '으로/로')} 계산한다.)`, rows, {
        figure: b.svg('중심이 O이고 반지름의 길이가 1인 사분원. 호 위의 점 B에서 반지름 OA에 내린 수선의 발이 D이다. ∠BOA에 x°가 적혀 있다'),
        explain: `${seg('OD')} = 1 − ${d2(ad)} = ${d2(c)}이고 ${fx('cos', 'x')} = ${frac(seg('OD'), seg('OB'))} = ${seg('OD')} = ${d2(c)}이므로 ${X} = ${t}이다. ${seg('BD')} = ${fx('sin', 'x')} = ${fd('sin', t)} = ${d2(s)}이다.`
      });
    }),
    T('quarter-order', '0°에서 90°까지 삼각비의 대소로 차례 정하기', '①42', (d) => {
      const f0 = d.pick(FN3), angs = d.until(() => [d.int(5, 85), d.int(5, 85), d.int(5, 85)], (a) => new Set(a).size === 3 && Math.min(...a.map((v, i) => Math.min(...a.filter((_, j) => j !== i).map((u) => Math.abs(u - v))))) >= 8);
      const valOf = (a) => Math[f0](a * Math.PI / 180), right = angs.slice().sort((x, y) => valOf(y) - valOf(x));
      const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map((p) => p.map((i) => angs[i]));
      const rows = d.shuffle(perms).slice(0, 5);
      if (!rows.some((r) => r.join() === right.join())) rows[0] = right;
      return pickRows(d, `다음 세 값을 큰 것부터 차례로 나열한 것은?`, rows.map((r) => [r.map((a) => fd(f0, a)).join(', '), r.join() === right.join()]), {
        figure: lines([angs.map((a) => fd(f0, a)).join(',&nbsp;&nbsp;')]),
        explain: f0 === 'cos' ? `0°에서 90°까지 각의 크기가 커지면 cos의 값은 작아지므로 각이 작을수록 값이 크다. ${right.map((a) => fd(f0, a)).join(' &gt; ')}이다.` : `0°에서 90°까지 각의 크기가 커지면 ${f0}의 값도 커지므로 각이 클수록 값이 크다. ${right.map((a) => fd(f0, a)).join(' &gt; ')}이다.`
      });
    }),
    T('quarter-zero', '0°, 90°의 삼각비가 든 식의 값', '①41', (d) => {
      // 정수가 되는 식(0°, 90°의 값이 둘 이상)
      const ANG = [0, 30, 45, 60, 90];
      const w = d.until(() => { const ts = [term(d, ANG), term(d, ANG), term(d, ANG), term(d, ANG)], form = d.int(0, 2), s1 = d.pick(['+', '-']), s2 = d.pick(['+', '-']); return { ts, form, s1, s2 }; }, (z) => {
        const [a, b, c, e] = z.ts.map(tv), v = z.form === 0 ? opv(vmul(a, b), z.s1, vmul(c, e)) : z.form === 1 ? opv(opv(a, z.s1, b), z.s2, c) : opv(vmul(a, b), z.s1, c);
        const used = z.form === 1 || z.form === 2 ? z.ts.slice(0, 3) : z.ts;
        return kindOf(v) === 'int' && v.length > 0 && used.filter((t) => t[1] === 0 || t[1] === 90).length >= 2 && new Set(used.map((t) => t.join())).size === used.length;
      });
      const [a, b, c, e] = w.ts.map(tv), o = (s) => ' ' + ITALIC(OPS[s]) + ' ', [ha, hb, hc, he] = w.ts.map(th);
      const v = w.form === 0 ? opv(vmul(a, b), w.s1, vmul(c, e)) : w.form === 1 ? opv(opv(a, w.s1, b), w.s2, c) : opv(vmul(a, b), w.s1, c);
      const h = w.form === 0 ? `${ha}${o('*')}${hb}${o(w.s1)}${hc}${o('*')}${he}` : w.form === 1 ? `${ha}${o(w.s1)}${hb}${o(w.s2)}${hc}` : `${ha}${o('*')}${hb}${o(w.s1)}${hc}`;
      const used = w.form === 0 ? w.ts : w.ts.slice(0, 3);
      return aInt('다음을 계산하시오.', v, { signed: true, figure: exh(h), rule: 'zero',
        explain: `${used.map((t) => `${th(t)} = ${vh(tv(t))}`).join(', ')}이므로 식의 값은 ${vh(v)}이다.` });
    })
  ]);

  B.kit.m921b = { quarterFig, term, tv, th, opv, OPS, ITALIC, exh, d2, DEGS, dg };
})(typeof window !== 'undefined' ? window : globalThis);
