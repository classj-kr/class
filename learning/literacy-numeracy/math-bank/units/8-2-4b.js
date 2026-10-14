// 중학교 2학년 2학기 4단원 평행선과 선분의 길이의 비 — 뒤쪽 묶음(삼각형의 두 변의 중점을 이은 선분, 삼각형의 중선과 무게중심, 무게중심과 넓이).
// 단원 틀과 그림 도구, 싣는 기준, 뺀 것과 까닭은 8-2-4a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 이 파일의 얼개
//  - 두 변의 중점을 이은 선분: 삼각형(길이와 동위각, 세 중점을 이은 삼각형의 둘레와 넓이), 사각형(네 중점을 이은 사각형의 둘레), 사다리꼴(두 변의 중점을 이은 선분과 대각선).
//  - 중선과 무게중심: 낱말, 중선을 2 : 1로 나누는 길이, 옳은 식 가리기, 직각삼각형(빗변의 중점은 외심), 무게중심을 두 번 쓰는 길이, 중점·평행선과 함께 쓰는 길이.
//  - 무게중심과 넓이: 중선은 넓이를 이등분한다, 세 중선이 나눈 여섯 삼각형, 조각에서 전체, 조각을 다시 반으로, 무게중심을 두 번 쓰는 넓이.
//  - 넓이 문항의 그림에는 길이를 적지 않는다(넓이만 주어진다). 묻는 부분을 색칠한다.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, C } = B.kit;
  const { SG, nb, gcd } = B.kit.mid;
  const { dirOf, meet } = B.kit.mgeo;
  const K = B.kit.m824;
  const { UNIT, T, cm, eq, par, jo, lenQ, areaQ, two, sayQ, lerp, pol, plus, sss, sas, fine, cen, Fig, trapOf, tidy } = K;
  const half = (p, q) => lerp(p, q, 0.5);
  // 밑변 BC = a 와 중선 AD = m, 중선이 밑변과 이루는 각 phi 로 정해지는 삼각형과 무게중심 G
  const medOf = (a, m, phi) => { const D = [a / 2, 0], A = plus(D, pol(m, phi)); return { A, B: [0, 0], C: [a, 0], D, G: plus(D, pol(m / 3, phi)) }; };
  // 넓이 문항에 쓰는 삼각형(길이는 적지 않는다)
  const anyTri = (d) => d.until(() => sas(d.int(9, 12), d.int(9, 12), d.int(10, 16) * 5), (t) => fine(t, 40, 88));
  const SQ = 'cm²';

  // ── 삼각형의 두 변의 중점을 이은 선분 ──
  B.addTypes(UNIT, 'mid', [
    T('mid-basic', '두 변의 중점을 이은 선분의 길이와 동위각', '①33', (d) => {
      const v = d.until(() => {
        const bv = d.int(48, 74), cv = d.int(44, 70), k = d.int(3, 12), a = 2 * k, A = meet([0, 0], pol(10, bv), [a, 0], plus([a, 0], pol(10, 180 - cv))), P0 = { A, B: [0, 0], C: [a, 0], M: half(A, [0, 0]), N: half(A, [a, 0]) };
        const fig = Fig(P0, [160, 122], { hub: 'ABC' }).poly('ABC').seg('MN').tick('AM MB').tick('AN NC', 2).name('ABCMN').angle('ABC', bv + '°').len('BC', cm(a));
        return { bv, cv, k, fig };
      }, (x) => 180 - x.bv - x.cv >= 44 && x.bv !== x.cv && !x.fig.clash());
      const { bv, k } = v;
      return two(`△ABC에서 두 변 AB, AC의 중점을 각각 M, N이라 하자. ∠B = ${bv}°, ${eq('BC', 2 * k)}일 때, ∠AMN의 크기와 ${SG('MN')}의 길이를 각각 구하시오.`, [['∠AMN', bv, '°'], [SG('MN'), k]], {
        figure: v.fig.svg(`삼각형 ABC. 점 M은 변 AB의 중점, 점 N은 변 AC의 중점이고(길이가 같다는 표시) 선분 MN이 그어져 있다. ∠B = ${bv}°, BC = ${cm(2 * k)}`),
        explain: `삼각형의 두 변의 중점을 이은 선분은 나머지 변과 평행하고 길이는 그 변의 ${frac(1, 2)}이다. ${par('MN', 'BC')}이므로 ∠AMN = ∠B = ${bv}°(동위각)이고, ${SG('MN')} = ${frac(1, 2)} × ${2 * k} = ${k}(cm)이다.`,
        facts: { calc: [[`${bv}`, 0], [`${2 * k}/2`, 1]], unseen: [2] }
      });
    }),
    T('mid-tri-peri', '세 변의 중점을 이은 삼각형의 둘레', '①34', (d) => {
      const v = d.until(() => {
        const a = 2 * d.int(3, 9), b = 2 * d.int(3, 9), c = 2 * d.int(3, 9), ok = a < b + c && b < a + c && c < a + b, t3 = ok ? sss(a, b, c) : null;
        if (!ok || !fine(t3, 42, 86)) return { fig: null };
        const P0 = Object.assign({}, t3, { D: half(t3.A, t3.B), E: half(t3.B, t3.C), F: half(t3.C, t3.A) });
        const fig = Fig(P0, [132, 112], { hub: 'ABC' }).tint('DEF').poly('ABC').seg('DE EF FD').tick('AD DB').tick('BE EC', 2).tick('CF FA', 3).name('ABCDEF').bow('AB', cm(c), 26).bow('BC', cm(a), 26).bow('CA', cm(b), 26);
        return { a, b, c, fig };
      }, (x) => x.fig && new Set([x.a, x.b, x.c]).size === 3 && !x.fig.clash());
      const { a, b, c } = v;
      return lenQ(`△ABC에서 세 변 AB, BC, CA의 중점을 각각 D, E, F라 하자. ${eq('AB', c)}, ${eq('BC', a)}, ${eq('CA', b)}일 때, △DEF의 둘레의 길이는?`, (a + b + c) / 2, {
        figure: v.fig.svg(`삼각형 ABC. 점 D, E, F는 각각 변 AB, BC, CA의 중점이고(길이가 같다는 표시) 삼각형 DEF가 색칠되어 있다. AB = ${cm(c)}, BC = ${cm(a)}, CA = ${cm(b)}`),
        explain: `${SG('DE')} = ${frac(1, 2)}${SG('CA')} = ${b / 2} cm, ${SG('EF')} = ${frac(1, 2)}${SG('AB')} = ${c / 2} cm, ${SG('FD')} = ${frac(1, 2)}${SG('BC')} = ${a / 2} cm이다. △DEF의 둘레의 길이는 ${b / 2} + ${c / 2} + ${a / 2} = ${(a + b + c) / 2}(cm)이다.`,
        facts: { calc: [[`(${c}+${a}+${b})/2`, 0]], unseen: [2] }
      });
    }),
    T('mid-tri-area', '세 변의 중점을 이은 삼각형의 넓이', '①35', (d) => {
      const S = 4 * d.int(5, 20), fig = tidy(d, () => {
        const t3 = anyTri(d), P0 = Object.assign({}, t3, { D: half(t3.A, t3.B), E: half(t3.B, t3.C), F: half(t3.C, t3.A) });
        return Fig(P0, [156, 120], { hub: 'ABC' }).tint('DEF').poly('ABC').seg('DE EF FD').tick('AD DB').tick('BE EC', 2).tick('CF FA', 3).name('ABCDEF');
      });
      return areaQ(`△ABC에서 세 변 AB, BC, CA의 중점을 각각 D, E, F라 하자. △ABC의 넓이가 ${S} ${SQ}일 때, △DEF의 넓이는?`, S / 4, {
        figure: fig.svg('삼각형 ABC. 점 D, E, F는 각각 변 AB, BC, CA의 중점이고(길이가 같다는 표시) 삼각형 DEF가 색칠되어 있다'),
        explain: `두 변의 중점을 이은 선분은 나머지 변과 평행하고 길이가 그 변의 ${frac(1, 2)}이므로 △ADF, △DBE, △FEC, △EFD는 세 변의 길이가 각각 같아 모두 합동이다. △DEF의 넓이는 ${S} × ${frac(1, 4)} = ${S / 4}(${SQ})이다.`,
        facts: { calc: [[`${S}/4`, 0]], unseen: [4] }
      });
    }),
    T('mid-quad-peri', '사각형의 네 변의 중점을 이은 사각형의 둘레', '①36 심22', (d, n) => {
      const mids = (P0) => Object.assign(P0, { E: half(P0.A, P0.B), F: half(P0.B, P0.C), G: half(P0.C, P0.D), H: half(P0.D, P0.A) });
      const draw = (P0, size) => Fig(mids(P0), size, { hub: 'ABCD' }).poly('ABCD').seg('AC BD', 'cut').poly('EFGH').tick('AE EB').tick('BF FC', 2).tick('CG GD', 3).tick('DH HA', 4).name('ABCDEFGH');
      const lead = (shape) => `${shape}에서 네 변 AB, BC, CD, DA의 중점을 각각 E, F, G, H라 하자.`;
      const why = `△ABC와 △ACD에서 ${SG('EF')} = ${SG('HG')} = ${frac(1, 2)}${SG('AC')}이고, △ABD와 △BCD에서 ${SG('EH')} = ${SG('FG')} = ${frac(1, 2)}${SG('BD')}이다. 따라서 □EFGH의 둘레의 길이는 ${SG('AC')} + ${SG('BD')}와 같다.`;
      if (n === 2) {
        const ac = 2 * d.int(5, 12), th = d.int(28, 40), w = ac * Math.cos(th * Math.PI / 180), h = ac * Math.sin(th * Math.PI / 180);
        const fig = draw({ A: [0, h], B: [0, 0], C: [w, 0], D: [w, h] }, [170, 120]).right('ABC').right('BCD').right('CDA').right('DAB');
        return lenQ(`${lead('직사각형 ABCD')} ${eq('AC', ac)}일 때, □EFGH의 둘레의 길이는?`, 2 * ac, {
          figure: fig.svg('직사각형 ABCD(네 각에 직각 표시). 점 E, F, G, H는 각각 변 AB, BC, CD, DA의 중점이고(길이가 같다는 표시) 사각형 EFGH가 그려져 있다. 두 대각선 AC, BD가 점선으로 그어져 있다'),
          explain: `직사각형의 두 대각선의 길이는 같으므로 ${SG('BD')} = ${SG('AC')} = ${ac} cm이다. ${why} ${ac} + ${ac} = ${2 * ac}(cm)이다.`,
          facts: { calc: [[`${ac}+${ac}`, 0]] }
        });
      }
      const v = d.until(() => {
        const ac = d.int(8, 20), bd = d.int(8, 20), f1 = d.pick([0.4, 0.45, 0.5, 0.55]), f2 = d.pick([0.45, 0.5, 0.55, 0.6]), t1 = d.int(24, 36), t2 = d.int(36, 50);
        const P0 = { A: pol(f1 * ac, 180 - t1), C: pol((1 - f1) * ac, -t1), B: pol(f2 * bd, 180 + t2), D: pol((1 - f2) * bd, t2) };
        return { ac, bd, fig: draw(P0, [170, 132]) };
      }, (x) => x.ac !== x.bd && Math.max(x.ac / x.bd, x.bd / x.ac) <= 1.5 && !x.fig.clash());
      const { ac, bd } = v, said = '사각형 ABCD. 점 E, F, G, H는 각각 변 AB, BC, CD, DA의 중점이고(길이가 같다는 표시) 사각형 EFGH가 그려져 있다. 두 대각선 AC, BD가 점선으로 그어져 있다';
      if (n === 0) return lenQ(`${lead('□ABCD')} ${eq('AC', ac)}, ${eq('BD', bd)}일 때, □EFGH의 둘레의 길이는?`, ac + bd, {
        figure: v.fig.svg(said), explain: `${why} ${ac} + ${bd} = ${ac + bd}(cm)이다.`, facts: { calc: [[`${ac}+${bd}`, 0]] }
      });
      return lenQ(`${lead('□ABCD')} □EFGH의 둘레의 길이가 ${ac + bd} cm이고 ${eq('AC', ac)}일 때, ${SG('BD')}의 길이는?`, bd, {
        figure: v.fig.svg(said), explain: `${why} ${ac} + ${SG('BD')} = ${ac + bd}에서 ${SG('BD')} = ${bd} cm이다.`, facts: { calc: [[`${ac + bd}-${ac}`, 0]] }
      });
    }, { count: 3 }),
    T('mid-trap-mn', '사다리꼴의 두 변의 중점을 이은 선분의 길이', '①37', (d) => {
      const v = d.until(() => {
        const ad = 2 * d.int(2, 7), bc = 2 * d.int(4, 11), P0 = trapOf(ad, bc, bc * d.pick([0.55, 0.62, 0.7]), (bc - ad) * d.pick([0.25, 0.4, 0.55]));
        Object.assign(P0, { M: half(P0.A, P0.B), N: half(P0.D, P0.C) });
        const fig = Fig(P0, [170, 124], { hub: 'ABCD' }).poly('ABCD').seg('MN').arrow('AD BC').tick('AM MB').tick('DN NC', 2).name('ABCDMN').len('AD', cm(ad)).len('BC', cm(bc));
        return { ad, bc, fig };
      }, (x) => x.bc - x.ad >= 4 && x.ad / x.bc >= 0.35 && !x.fig.clash());
      const { ad, bc } = v;
      return lenQ(`${par('AD', 'BC')}인 사다리꼴 ABCD에서 두 변 AB, DC의 중점을 각각 M, N이라 하자. ${eq('AD', ad)}, ${eq('BC', bc)}일 때, ${SG('MN')}의 길이는?`, (ad + bc) / 2, {
        figure: v.fig.svg(`사다리꼴 ABCD. 윗변 AD와 아랫변 BC에 평행하다는 표시가 있다. 점 M은 변 AB의 중점, 점 N은 변 DC의 중점이고(길이가 같다는 표시) 선분 MN이 그어져 있다. AD = ${cm(ad)}, BC = ${cm(bc)}`),
        explain: `대각선 AC를 긋고 ${SG('MN')}과 만나는 점을 P라 하자. ${par('AD', 'MN', 'BC')}이므로 △ABC에서 ${SG('MP')} = ${frac(1, 2)}${SG('BC')} = ${bc / 2} cm이고, △ACD에서 ${SG('PN')} = ${frac(1, 2)}${SG('AD')} = ${ad / 2} cm이다. ${SG('MN')} = ${bc / 2} + ${ad / 2} = ${(ad + bc) / 2}(cm)이다.`,
        facts: { calc: [[`(${ad}+${bc})/2`, 0]], unseen: [2] }
      });
    }),
    T('mid-trap-diag', '사다리꼴의 두 변의 중점을 이은 선분과 한 대각선', '①38', (d) => {
      const v = d.until(() => {
        const pn = d.int(2, 7), mp = d.int(3, 11), ad = 2 * pn, bc = 2 * mp, P0 = trapOf(ad, bc, bc * d.pick([0.55, 0.62, 0.7]), (bc - ad) * d.pick([0.25, 0.4, 0.55]));
        Object.assign(P0, { M: half(P0.A, P0.B), N: half(P0.D, P0.C) }); P0.P = half(P0.A, P0.C);
        const fig = Fig(P0, [176, 128], { hub: 'ABCD' }).poly('ABCD').seg('MN AC').arrow('AD BC').tick('AM MB').tick('DN NC', 2).name('ABCDMN').free('P', 'ACMN').len('BC', cm(bc)).len('PN', cm(pn), 'C');
        return { pn, mp, ad, bc, fig };
      }, (x) => x.bc - x.ad >= 4 && x.ad / x.bc >= 0.4 && !x.fig.clash());
      const { pn, mp, ad, bc } = v;
      return two(`${par('AD', 'BC')}인 사다리꼴 ABCD에서 두 변 AB, DC의 중점을 각각 M, N이라 하고, 대각선 AC와 ${SG('MN')}이 만나는 점을 P라 하자. ${eq('BC', bc)}, ${eq('PN', pn)}일 때, ${jo('AD', '과/와')} ${SG('MP')}의 길이를 각각 구하시오.`, [[SG('AD'), ad], [SG('MP'), mp]], {
        figure: v.fig.svg(`사다리꼴 ABCD. 윗변 AD와 아랫변 BC에 평행하다는 표시가 있다. 점 M은 변 AB의 중점, 점 N은 변 DC의 중점이고(길이가 같다는 표시) 선분 MN과 대각선 AC가 점 P에서 만난다. BC = ${cm(bc)}, PN = ${cm(pn)}`),
        explain: `${par('AD', 'MN', 'BC')}이므로 점 P는 ${SG('AC')}의 중점이다. △ACD에서 ${SG('AD')} = 2 × ${SG('PN')} = ${ad}(cm)이고, △ABC에서 ${SG('MP')} = ${frac(1, 2)} × ${SG('BC')} = ${mp}(cm)이다.`,
        facts: { calc: [[`2*${pn}`, 0], [`${bc}/2`, 1]], unseen: [2] }
      });
    }),
    T('mid-trap-pq', '사다리꼴의 두 변의 중점을 이은 선분이 두 대각선에 잘린 길이', '①39 심29 ①40', (d, n) => {
      const v = d.until(() => {
        const a = d.int(2, 7), b = d.int(4, 12), ad = 2 * a, bc = 2 * b, P0 = trapOf(ad, bc, bc * d.pick([0.6, 0.68, 0.76]), (bc - ad) * d.pick([0.3, 0.45, 0.6]));
        Object.assign(P0, { M: half(P0.A, P0.B), N: half(P0.D, P0.C) }); P0.P = half(P0.B, P0.D); P0.Q = half(P0.A, P0.C);
        const fig = Fig(P0, [184, 136], { hub: 'ABCD' }).poly('ABCD').seg('MN AC BD').arrow('AD BC').tick('AM MB').tick('DN NC', 2).name('ABCDMN').free('P', 'MNBD').free('Q', 'MNAC').len('AD', cm(ad));
        if (n === 0) fig.len('BC', cm(bc)); else fig.len('PQ', cm(b - a), 'A');
        return { a, b, ad, bc, fig };
      }, (x) => (x.b - x.a) / x.b >= 0.36 && x.b - x.a >= 2 && x.a / x.b >= 0.3 && !x.fig.clash());
      const { a, b, ad, bc } = v, pq = b - a;
      const lead = `${par('AD', 'BC')}인 사다리꼴 ABCD에서 두 변 AB, DC의 중점을 각각 M, N이라 하고, ${SG('MN')}이 두 대각선 BD, AC와 만나는 점을 각각 P, Q라 하자.`;
      const said = '사다리꼴 ABCD. 윗변 AD와 아랫변 BC에 평행하다는 표시가 있다. 점 M은 변 AB의 중점, 점 N은 변 DC의 중점이고(길이가 같다는 표시) 선분 MN이 대각선 BD와 점 P에서, 대각선 AC와 점 Q에서 만난다. 선분 MN 위에 점 M, P, Q, N이 이 차례로 놓여 있다.';
      if (n === 0) return lenQ(`${lead} ${eq('AD', ad)}, ${eq('BC', bc)}일 때, ${SG('PQ')}의 길이는?`, pq, {
        figure: v.fig.svg(`${said} AD = ${cm(ad)}, BC = ${cm(bc)}`),
        explain: `${par('AD', 'MN', 'BC')}이므로 △ABD에서 ${SG('MP')} = ${frac(1, 2)}${SG('AD')} = ${a} cm이고, △ABC에서 ${SG('MQ')} = ${frac(1, 2)}${SG('BC')} = ${b} cm이다. ${SG('PQ')} = ${SG('MQ')} − ${SG('MP')} = ${b} − ${a} = ${pq}(cm)이다.`,
        facts: { calc: [[`(${bc}-${ad})/2`, 0]], unseen: [2] }
      });
      return lenQ(`${lead} ${eq('AD', ad)}, ${eq('PQ', pq)}일 때, ${SG('BC')}의 길이는?`, bc, {
        figure: v.fig.svg(`${said} AD = ${cm(ad)}, PQ = ${cm(pq)}`),
        explain: `${par('AD', 'MN', 'BC')}이므로 △ABD에서 ${SG('MP')} = ${frac(1, 2)}${SG('AD')} = ${a} cm이다. ${SG('MQ')} = ${SG('MP')} + ${SG('PQ')} = ${a} + ${pq} = ${b}(cm)이고, △ABC에서 ${SG('BC')} = 2 × ${SG('MQ')} = ${bc}(cm)이다.`,
        facts: { calc: [[`${ad}+2*${pq}`, 0]], unseen: [2] }
      });
    }, { count: 2 })
  ]);

  B.addTypes(UNIT, 'mid', [
    T('mid-ext', '변의 연장선에서 그은 선분과 두 변의 중점을 이은 선분', '심9', (d) => {
      // △ABD, C 는 AB 의 중점, CE ∥ BD(E 는 AD 의 중점). AD 의 연장선 위의 점 G 에서 GC 가 BD 와 F 에서 만난다. GF : FC = p : (q − p) 이면 DF : EC = p : q.
      const [p, q] = d.pick([[2, 3], [3, 5], [3, 4]]), w = d.int(1, Math.floor(12 / q)), ec = q * w, df = p * w, bd = 2 * ec, t = (2 * q - p) / (2 * (q - p));
      const v = d.until(() => {
        const A = [bd * d.pick([0.7, 0.78, 0.86]), bd * d.pick([0.5, 0.56, 0.62])], P0 = { A, B: [0, 0], D: [bd, 0], C: half(A, [0, 0]), E: half(A, [bd, 0]), G: lerp(A, [bd, 0], t), F: [bd - df, 0] };
        const fig = Fig(P0, [220, 210], { hub: 'ABD' }).poly('ABD').seg('CE DG GC').arrow('CE', 1, 0.5).arrow('BD', 1, 0.18).tick('AC CB').name('ABCE').name('D', 35).name('G', 300).name('F', 250).len('DF', cm(df), 'G');
        return { fig };
      }, (x) => !x.fig.clash());
      const g = gcd(p, q - p);
      return lenQ(`△ABD에서 점 C는 변 AB의 중점이고, 점 E는 변 AD 위의 점이며 ${par('CE', 'BD')}이다. 변 AD의 연장선 위의 점 G에 대하여 ${SG('GC')}와 변 BD가 만나는 점을 F라 하자. ${nb(`${SG('GF')} : ${SG('FC')} = ${p / g} : ${(q - p) / g}`)}이고 ${eq('DF', df)}일 때, ${SG('FB')}의 길이는?`, bd - df, {
        figure: v.fig.svg(`삼각형 ABD. 점 C는 변 AB의 중점이고(길이가 같다는 표시) 점 E는 변 AD 위에 있다. 선분 CE와 변 BD에 평행하다는 표시가 있다. 변 AD를 점 D 너머로 늘인 선 위에 점 G가 있고, 선분 GC가 변 BD와 점 F에서 만난다. DF = ${cm(df)}`),
        explain: `${SG('GF')} : ${SG('GC')} = ${p / g} : (${p / g} + ${(q - p) / g}) = ${p / g} : ${q / g}이다. △GEC에서 ${par('DF', 'EC')}이므로 ${SG('DF')} : ${SG('EC')} = ${SG('GF')} : ${SG('GC')}이고 ${df} : ${SG('EC')} = ${p / g} : ${q / g}에서 ${SG('EC')} = ${ec} cm이다. △ABD에서 점 C는 ${SG('AB')}의 중점이고 ${par('CE', 'BD')}이므로 점 E는 ${SG('AD')}의 중점이고 ${SG('BD')} = 2 × ${SG('CE')} = ${bd}(cm)이다. ${SG('FB')} = ${bd} − ${df} = ${bd - df}(cm)이다.`,
        facts: { calc: [[`2*${df}*(${p / g}+${(q - p) / g})/${p / g}-${df}`, 0]], unseen: [2] }
      });
    })
  ]);

  // ── 삼각형의 중선과 무게중심 ──
  // 두 중선 AD, BE 와 무게중심 G 가 그려진 삼각형. 세 변의 길이가 모두 다르다.
  const twoMedians = (d, size) => {
    const [a, b, c] = d.pick([[9, 7, 8], [10, 8, 7], [9, 8, 6], [10, 7, 9], [8, 6, 7], [10, 9, 7], [9, 6, 8], [8, 7, 9]]), t3 = sss(a, b, c), P0 = Object.assign({}, t3, { D: half(t3.B, t3.C), E: half(t3.C, t3.A), G: cen(t3) });
    return Fig(P0, size || [160, 124], { hub: 'ABC' });
  };
  const MED_SAID = '삼각형 ABC와 두 중선 AD, BE. 점 D는 변 BC의 중점, 점 E는 변 CA의 중점이고(길이가 같다는 표시) 두 중선은 점 G에서 만난다';
  const EQ_AREA = (p, q) => `(${p}의 넓이) = (${q}의 넓이)`;
  const G_TRUE = [
    `${SG('BD')} = ${SG('DC')}`, `${SG('AG')} = 2${SG('GD')}`, `${SG('BG')} : ${SG('GE')} = 2 : 1`, `${SG('GD')} = ${frac(1, 3)}${SG('AD')}`,
    EQ_AREA('△ABD', '△ADC'), EQ_AREA('△GBD', '△GDC'), EQ_AREA('△GAB', '△GCA'), `(△GBC의 넓이) = ${frac(1, 3)} × (△ABC의 넓이)`
  ];
  const G_FALSE = [
    [`${SG('AG')} = ${SG('BG')}`, `${SG('AG')}와 ${SG('BG')}는 서로 다른 중선의 한 부분이다. 세 변의 길이가 서로 다르면 두 중선의 길이가 다르므로 ${SG('AG')} = ${SG('BG')}라고 할 수 없다.`],
    [`${SG('AG')} = ${SG('GD')}`, `무게중심은 중선을 꼭짓점으로부터 2 : 1로 나누므로 ${SG('AG')} = 2${SG('GD')}이다.`, [G_TRUE[1], G_TRUE[3]]],
    [`${SG('BG')} : ${SG('GE')} = 3 : 1`, `무게중심은 중선을 꼭짓점으로부터 2 : 1로 나누므로 ${SG('BG')} : ${SG('GE')} = 2 : 1이다.`, [G_TRUE[2]]],
    [`${SG('GD')} = ${frac(1, 2)}${SG('AD')}`, `${SG('AG')} : ${SG('GD')} = 2 : 1이므로 ${SG('GD')} = ${frac(1, 3)}${SG('AD')}이다.`, [G_TRUE[3], G_TRUE[1]]],
    [`${SG('AD')} = ${SG('BE')}`, `세 변의 길이가 서로 다른 삼각형에서는 두 중선 ${SG('AD')}, ${SG('BE')}의 길이가 같다고 할 수 없다.`],
    [`(△GBD의 넓이) = ${frac(1, 3)} × (△ABC의 넓이)`, `세 중선은 삼각형의 넓이를 6등분하므로 △GBD의 넓이는 △ABC의 넓이의 ${frac(1, 6)}이다.`, [G_TRUE[7]]]
  ];
  B.addTypes(UNIT, 'cent', [
    T('cent-words', '중선과 무게중심의 뜻', '①45', (d, n) => {
      const [text, right, wrong, told] = n === 0
        ? ['삼각형에서 한 꼭짓점과 그 대변의 중점을 이은 선분을 무엇이라 하는가?', '중선', ['수선', '각의 이등분선', '수직이등분선'], '삼각형에서 한 꼭짓점과 그 대변의 중점을 이은 선분을 중선이라 한다. 한 삼각형에는 중선이 3개 있다.']
        : ['삼각형의 세 중선이 만나는 점을 무엇이라 하는가?', '무게중심', ['외심', '내심', '대변의 중점'], '삼각형의 세 중선은 한 점에서 만나고, 이 점을 무게중심이라 한다. 외심은 세 변의 수직이등분선이, 내심은 세 내각의 이등분선이 만나는 점이다.'];
      const options = d.shuffle([right].concat(wrong));
      return C(text, options, options.indexOf(right), { explain: told, facts: { truth: options.map((s) => s === right), want: true } });
    }, { count: 2 }),
    T('cent-len', '무게중심이 중선을 나누는 길이', '①46', (d) => {
      const v = d.until(() => {
        const h = d.int(3, 9), g = d.int(2, 6), P0 = medOf(2 * h, 3 * g, d.int(13, 21) * 5);
        const fig = Fig(P0, [156, 128], { hub: 'ABC' }).poly('ABC').seg('AD').dot('G').tick('BD DC').name('ABC').name('D', 270).free('G', 'AD').len('BD', cm(h), 'A').len('GD', cm(g), 'B');
        return { h, g, P0, fig };
      }, (x) => 3 * x.g >= 1.1 * x.h && 3 * x.g <= 2.6 * x.h && fine(x.P0, 40, 92) && !x.fig.clash());
      const { h, g } = v;
      return two(`△ABC에서 점 D는 변 BC의 중점이고 점 G는 △ABC의 무게중심이다. ${eq('BD', h)}, ${eq('GD', g)}일 때, ${jo('BC', '과/와')} ${SG('AG')}의 길이를 각각 구하시오.`, [[SG('BC'), 2 * h], [SG('AG'), 2 * g]], {
        figure: v.fig.svg(`삼각형 ABC와 중선 AD. 점 D는 변 BC의 중점이고(길이가 같다는 표시) 무게중심 G는 선분 AD 위에 있다. BD = ${cm(h)}, GD = ${cm(g)}`),
        explain: `점 D는 ${SG('BC')}의 중점이므로 ${SG('BC')} = 2 × ${h} = ${2 * h}(cm)이다. 무게중심은 중선을 꼭짓점으로부터 2 : 1로 나누므로 ${SG('AG')} = 2 × ${SG('GD')} = ${2 * g}(cm)이다.`,
        facts: { calc: [[`2*${h}`, 0], [`2*${g}`, 1]], unseen: [2] }
      });
    }),
    T('cent-whole', '중선의 길이와 무게중심까지의 길이', '①46', (d, n) => {
      // 길이가 하나만 주어지므로 삼각형의 모양은 아무것이나 된다(그림의 배율만 달라진다).
      const v = d.until(() => {
        const k = d.int(2, 8), m = 3 * k, P0 = medOf(10, d.pick([8, 9, 10, 11]), d.int(14, 21) * 5);
        const fig = Fig(P0, [160, 130], { hub: 'ABC' }).poly('ABC').seg('AD').dot('G').tick('BD DC').name('ABC').name('D', 270).name('G', 180, 12);
        if (n === 0) fig.bowOut('AD', cm(m), 11, 'B', 'AC'); else fig.lead('AG', cm(2 * k), 'AC');
        return { k, m, P0, fig };
      }, (x) => fine(x.P0, 40, 92) && !x.fig.clash());
      const { k, m } = v, lead = '△ABC에서 점 D는 변 BC의 중점이고 점 G는 △ABC의 무게중심이다.', said = '삼각형 ABC와 중선 AD. 점 D는 변 BC의 중점이고(길이가 같다는 표시) 무게중심 G는 선분 AD 위에 있다.';
      if (n === 0) return lenQ(`${lead} ${eq('AD', m)}일 때, ${SG('AG')}의 길이는?`, 2 * k, {
        figure: v.fig.svg(`${said} AD = ${cm(m)}`),
        explain: `무게중심은 중선을 꼭짓점으로부터 2 : 1로 나누므로 ${SG('AG')} = ${frac(2, 3)} × ${SG('AD')} = ${frac(2, 3)} × ${m} = ${2 * k}(cm)이다.`,
        facts: { calc: [[`${m}*2/3`, 0]], unseen: [2, 3] }
      });
      return lenQ(`${lead} ${eq('AG', 2 * k)}일 때, ${SG('AD')}의 길이는?`, m, {
        figure: v.fig.svg(`${said} AG = ${cm(2 * k)}`),
        explain: `${SG('AG')} : ${SG('GD')} = 2 : 1이므로 ${SG('GD')} = ${k} cm이다. ${SG('AD')} = ${2 * k} + ${k} = ${m}(cm)이다.`,
        facts: { calc: [[`${2 * k}*3/2`, 0]], unseen: [2, 3] }
      });
    }, { count: 2 }),
    T('cent-claims', '무게중심에 대한 식 가리기', '①47', (d, n) => {
      const fig = twoMedians(d).poly('ABC').seg('AD BE').dot('G').tick('BD DC').tick('CE EA', 2).name('ABCDE').free('G', 'ADBE');
      return sayQ(d, `세 변의 길이가 서로 다른 △ABC에서 두 중선 AD, BE가 만나는 점을 G라 할 때, 다음 중 ${n === 0 ? '옳지 않은' : '옳은'} 것은?`, G_TRUE, G_FALSE, n === 1, fig.svg(MED_SAID));
    }, { count: 2 }),
    T('cent-right', '직각삼각형의 무게중심', '①48', (d, n) => {
      const v = d.until(() => {
        const k = d.int(2, 6), ab = 6 * k, th = d.int(26, 40), P0 = { A: [0, ab * Math.sin(th * Math.PI / 180)], B: [-ab * Math.cos(th * Math.PI / 180), 0], C: [0, 0] };
        P0.D = half(P0.A, P0.B); P0.G = cen(P0);
        const fig = Fig({ A: P0.A, B: P0.B, C: P0.C, D: P0.D, G: P0.G }, [170, 118], { hub: 'ABC' }).poly('ABC').seg('CD').dot('G').right('ACB').tick('AD DB').name('ABCD');
        fig.name('G', dirOf(fig.P.C, fig.P.D) + 90);
        if (n === 0) fig.bow('AB', cm(ab), 26); else fig.len('CG', cm(2 * k), 'B');
        return { k, ab, fig };
      }, (x) => !x.fig.clash());
      const { k, ab } = v, lead = '∠C = 90°인 직각삼각형 ABC에서 점 D는 빗변 AB의 중점이고 점 G는 △ABC의 무게중심이다.', said = '각 C가 직각인 직각삼각형 ABC(직각 표시)와 중선 CD. 점 D는 빗변 AB의 중점이고(길이가 같다는 표시) 무게중심 G는 선분 CD 위에 있다.';
      if (n === 0) return lenQ(`${lead} ${eq('AB', ab)}일 때, ${SG('CG')}의 길이는?`, 2 * k, {
        figure: v.fig.svg(`${said} AB = ${cm(ab)}`),
        explain: `직각삼각형의 빗변의 중점은 외심이므로 ${SG('CD')} = ${SG('AD')} = ${SG('BD')} = ${frac(1, 2)} × ${ab} = ${3 * k}(cm)이다. ${SG('CG')} = ${frac(2, 3)} × ${SG('CD')} = ${2 * k}(cm)이다.`,
        facts: { calc: [[`${ab}/2*2/3`, 0]], unseen: [2, 3] }
      });
      return lenQ(`${lead} ${eq('CG', 2 * k)}일 때, ${SG('AB')}의 길이는?`, ab, {
        figure: v.fig.svg(`${said} CG = ${cm(2 * k)}`),
        explain: `${SG('CD')} = ${frac(3, 2)} × ${SG('CG')} = ${3 * k}(cm)이다. 직각삼각형의 빗변의 중점은 외심이므로 ${SG('AD')} = ${SG('BD')} = ${SG('CD')} = ${3 * k} cm이고 ${SG('AB')} = 2 × ${3 * k} = ${ab}(cm)이다.`,
        facts: { calc: [[`${2 * k}*3/2*2`, 0]], unseen: [2, 3] }
      });
    }, { count: 2 }),
    T('cent-twice', '삼각형의 무게중심과 그 안의 삼각형의 무게중심', '①49', (d, n) => {
      const v = d.until(() => {
        const k = d.int(1, 4), ad = 9 * k, P0 = medOf(ad * d.pick([0.95, 1.05, 1.15, 1.25]), ad, d.int(14, 20) * 5);
        P0.Q = lerp(P0.D, P0.A, 1 / 9);
        const fig = Fig(P0, [160, 150], { hub: 'ABC', show: { Q: 'G′' } }).poly('ABC').seg('AD GB GC').dot('GQ').tick('BD DC').name('ABC').name('D', 270);
        fig.nameMid('G', 'A', 'B').name('Q', 180, 13);
        if (n === 0) fig.bowOut('AD', cm(ad), 11, 'B', 'AC'); else fig.lead('GQ', cm(2 * k), 'AC');
        return { k, ad, P0, fig };
      }, (x) => fine(x.P0, 40, 92) && !x.fig.clash());
      const { k, ad } = v, G2 = 'G′', lead = `△ABC에서 점 D는 변 BC의 중점이고, 점 G는 △ABC의 무게중심, 점 ${G2}은 △GBC의 무게중심이다.`;
      const said = `삼각형 ABC와 중선 AD. 점 D는 변 BC의 중점이고(길이가 같다는 표시) 선분 AD 위에 점 A에서 가까운 쪽부터 점 G, ${G2}이 있다. 선분 GB와 선분 GC가 그어져 있다.`;
      if (n === 0) return two(`${lead} ${eq('AD', ad)}일 때, ${jo('AG', '과/와')} ${SG(G2 + 'D')}의 길이를 각각 구하시오.`, [[SG('AG'), 6 * k], [SG(G2 + 'D'), k]], {
        figure: v.fig.svg(`${said} AD = ${cm(ad)}`),
        explain: `점 G는 △ABC의 무게중심이므로 ${SG('AG')} = ${frac(2, 3)} × ${ad} = ${6 * k}(cm), ${SG('GD')} = ${frac(1, 3)} × ${ad} = ${3 * k}(cm)이다. ${SG('GD')}는 △GBC의 중선이고 점 ${G2}은 △GBC의 무게중심이므로 ${SG(G2 + 'D')} = ${frac(1, 3)} × ${SG('GD')} = ${k}(cm)이다.`,
        facts: { calc: [[`${ad}*2/3`, 0], [`${ad}/3/3`, 1]], unseen: [2, 3] }
      });
      return lenQ(`${lead} ${nb(`${SG('G' + G2)} = ${2 * k} cm`)}일 때, ${SG('AD')}의 길이는?`, ad, {
        figure: v.fig.svg(`${said} G${G2} = ${cm(2 * k)}`),
        explain: `${SG('GD')}는 △GBC의 중선이고 점 ${G2}은 △GBC의 무게중심이므로 ${SG('G' + G2)} = ${frac(2, 3)} × ${SG('GD')}이다. ${SG('GD')} = ${2 * k} × ${frac(3, 2)} = ${3 * k}(cm)이다. 점 G는 △ABC의 무게중심이므로 ${SG('AD')} = 3 × ${SG('GD')} = ${ad}(cm)이다.`,
        facts: { calc: [[`${2 * k}*3/2*3`, 0]], unseen: [3, 2] }
      });
    }, { count: 2 }),
    T('cent-mid', '무게중심과 두 변의 중점을 이은 선분', '①51', (d) => {
      const v = d.until(() => {
        const k = d.int(1, 4), ad = 6 * k, P0 = medOf(ad * d.pick([1.25, 1.35, 1.45, 1.55]), ad, d.int(15, 20) * 5);
        P0.E = half(P0.A, P0.C); P0.F = half(P0.D, P0.C);
        const fig = Fig(P0, [190, 136], { hub: 'ABC' }).poly('ABC').seg('AD BE EF').dot('G').tick('DF FC').tick('AE EC', 2).name('ABCE').name('DF', 270).free('G', 'ADBE').len('EF', cm(3 * k), 'C');
        return { k, P0, fig };
      }, (x) => fine(x.P0, 40, 92) && !x.fig.clash());
      const { k } = v;
      return lenQ(`△ABC에서 점 G는 무게중심이고 두 점 D, E는 각각 변 BC, CA의 중점이다. ${SG('DC')}의 중점을 F라 하고 ${eq('EF', 3 * k)}일 때, ${SG('AG')}의 길이는?`, 4 * k, {
        figure: v.fig.svg(`삼각형 ABC와 두 중선 AD, BE. 두 중선은 점 G에서 만난다. 점 F는 선분 DC의 중점이고(길이가 같다는 표시) 선분 EF가 그어져 있다. EF = ${cm(3 * k)}`),
        explain: `△ADC에서 두 점 E, F는 각각 ${SG('AC')}, ${SG('DC')}의 중점이므로 ${SG('AD')} = 2 × ${SG('EF')} = ${6 * k}(cm)이다. ${SG('AG')} = ${frac(2, 3)} × ${SG('AD')} = ${4 * k}(cm)이다.`,
        facts: { calc: [[`2*${3 * k}*2/3`, 0]], unseen: [2, 3] }
      });
    }),
    T('cent-par', '변의 중점을 지나고 중선에 평행한 선분', '①52', (d) => {
      const v = d.until(() => {
        const j = d.int(1, 4), ad = 6 * j, P0 = medOf(ad * d.pick([1.2, 1.3, 1.4, 1.5]), ad, d.int(15, 20) * 5);
        P0.E = half(P0.A, P0.C); P0.F = half(P0.D, P0.C);
        const fig = Fig(P0, [184, 132], { hub: 'ABC' }).poly('ABC').seg('AD BE EF').dot('G').arrow('DA FE', 1, 0.78).name('ABCE').name('DF', 270).free('G', 'ADBE').len('GD', cm(2 * j), 'B');
        return { j, P0, fig };
      }, (x) => fine(x.P0, 40, 92) && !x.fig.clash());
      const { j } = v;
      return lenQ(`△ABC에서 점 G는 무게중심이고 두 점 D, E는 각각 변 BC, CA의 중점이다. 점 E를 지나고 ${SG('AD')}에 평행한 직선이 변 BC와 만나는 점을 F라 하자. ${eq('GD', 2 * j)}일 때, ${SG('EF')}의 길이는?`, 3 * j, {
        figure: v.fig.svg(`삼각형 ABC와 두 중선 AD, BE. 두 중선은 점 G에서 만난다. 점 F는 변 BC 위에 있고 선분 EF가 그어져 있다. 선분 AD와 선분 EF에 평행하다는 표시가 있다. GD = ${cm(2 * j)}`),
        explain: `${SG('AD')} = 3 × ${SG('GD')} = ${6 * j}(cm)이다. △ADC에서 점 E는 ${SG('AC')}의 중점이고 ${par('EF', 'AD')}이므로 점 F는 ${SG('DC')}의 중점이고 ${SG('EF')} = ${frac(1, 2)} × ${SG('AD')} = ${3 * j}(cm)이다.`,
        facts: { calc: [[`3*${2 * j}/2`, 0]], unseen: [3, 2] }
      });
    }),
    T('cent-through', '무게중심을 지나고 밑변에 평행한 직선', '①53', (d) => {
      const v = d.until(() => {
        const k = d.int(2, 7), j = d.int(1, 5), P0 = medOf(6 * j, 3 * k, d.int(13, 21) * 5);
        Object.assign(P0, { M: P0.D, L: lerp(P0.A, P0.B, 2 / 3), N: lerp(P0.A, P0.C, 2 / 3) }); delete P0.D;
        const fig = Fig(P0, [176, 134], { hub: 'ABC' }).poly('ABC').seg('AM LN').dot('G').arrow('LN BC', 1, 0.2).tick('BM MC').name('ABCLN').name('M', 270).free('G', 'AMLN').len('BM', cm(3 * j), 'A').len('GM', cm(k), 'B');
        return { k, j, P0, fig };
      }, (x) => 3 * x.k >= 0.6 * 6 * x.j && 3 * x.k <= 1.3 * 6 * x.j && fine(x.P0, 40, 92) && !x.fig.clash());
      const { k, j } = v;
      return two(`△ABC에서 점 M은 변 BC의 중점이고 점 G는 △ABC의 무게중심이다. 점 G를 지나고 변 BC에 평행한 직선이 두 변 AB, AC와 만나는 점을 각각 L, N이라 하자. ${eq('GM', k)}, ${eq('BM', 3 * j)}일 때, ${jo('AG', '과/와')} ${SG('GN')}의 길이를 각각 구하시오.`, [[SG('AG'), 2 * k], [SG('GN'), 2 * j]], {
        figure: v.fig.svg(`삼각형 ABC와 중선 AM. 점 M은 변 BC의 중점이고(길이가 같다는 표시) 무게중심 G는 선분 AM 위에 있다. 점 G를 지나는 선분 LN이 변 AB와 점 L에서, 변 AC와 점 N에서 만나고, 선분 LN과 변 BC에 평행하다는 표시가 있다. GM = ${cm(k)}, BM = ${cm(3 * j)}`),
        explain: `${SG('AG')} = 2 × ${SG('GM')} = ${2 * k}(cm)이다. △AMC에서 ${par('GN', 'MC')}이므로 ${SG('GN')} : ${SG('MC')} = ${SG('AG')} : ${SG('AM')} = 2 : 3이다. ${SG('MC')} = ${SG('BM')} = ${3 * j} cm이므로 ${SG('GN')} = ${3 * j} × ${frac(2, 3)} = ${2 * j}(cm)이다.`,
        facts: { calc: [[`2*${k}`, 0], [`${3 * j}*2/3`, 1]], unseen: [2, 3] }
      });
    }),
    T('cent-two', '밑변을 나눈 두 삼각형의 무게중심 사이의 거리', '①55 심33', (d) => {
      const k = d.int(2, 8), bc = 6 * k;
      const v = d.until(() => {
        const t3 = sas(d.pick([11, 12, 13]), d.pick([11, 12, 13]), d.int(12, 16) * 5), f = d.pick([0.38, 0.44, 0.5, 0.56, 0.62]), P0 = Object.assign({}, t3, { M: lerp(t3.B, t3.C, f) });
        P0.D = half(P0.B, P0.M); P0.E = half(P0.M, P0.C); P0.G = lerp(P0.A, P0.D, 2 / 3); P0.Q = lerp(P0.A, P0.E, 2 / 3);
        const fig = Fig(P0, [184, 140], { hub: 'ABC', show: { Q: 'G′' } }).poly('ABC').seg('AM AD AE GQ').dot('GQ').tick('BD DM').tick('ME EC', 2).name('ABC').name('DME', 270).name('G', 180, 12).name('Q', 0, 13).bow('BC', cm(bc), 26);
        return { t3, fig };
      }, (x) => fine(x.t3, 44, 86) && !x.fig.clash());
      const G2 = 'G′';
      return lenQ(`△ABC에서 변 BC 위의 점 M에 대하여 ${SG('BM')}, ${SG('MC')}의 중점을 각각 D, E라 하자. 점 G는 △ABM의 무게중심, 점 ${G2}은 △AMC의 무게중심이다. ${eq('BC', bc)}일 때, ${SG('G' + G2)}의 길이는?`, 2 * k, {
        figure: v.fig.svg(`삼각형 ABC. 변 BC 위에 점 B에서 가까운 쪽부터 점 D, M, E가 있고, 선분 BD와 DM, 선분 ME와 EC에 각각 길이가 같다는 표시가 있다. 선분 AM, 선분 AD, 선분 AE가 그어져 있고, 점 G는 선분 AD 위에, 점 ${G2}은 선분 AE 위에 있다. 선분 G${G2}이 그어져 있다. BC = ${cm(bc)}`),
        explain: `${SG('DE')} = ${SG('DM')} + ${SG('ME')} = ${frac(1, 2)}${SG('BM')} + ${frac(1, 2)}${SG('MC')} = ${frac(1, 2)}${SG('BC')} = ${3 * k}(cm)이다. ${SG('AD')}, ${SG('AE')}는 각각 △ABM, △AMC의 중선이므로 ${SG('AG')} : ${SG('AD')} = ${SG('A' + G2)} : ${SG('AE')} = 2 : 3이다. △ADE에서 두 비가 같으므로 ${par('G' + G2, 'DE')}이고 ${SG('G' + G2)} = ${frac(2, 3)} × ${3 * k} = ${2 * k}(cm)이다.`,
        facts: { calc: [[`${bc}/2*2/3`, 0]], unseen: [2, 3] }
      });
    })
  ]);

  // ── 무게중심과 넓이 ──
  const AREAS6 = [18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90];
  B.addTypes(UNIT, 'area', [
    T('area-median', '중선이 나눈 삼각형의 넓이', '①58', (d) => {
      const S = 4 * d.int(5, 20), fig = tidy(d, () => {
        const t3 = anyTri(d), P0 = Object.assign({}, t3, { M: half(t3.B, t3.C) }); P0.P = half(P0.A, P0.M);
        return Fig(P0, [160, 124], { hub: 'ABC' }).tint('APC').poly('ABC').seg('AM PC').tick('BM MC').tick('AP PM', 2).name('ABC').name('M', 270).nameMid('P', 'A', 'B');
      });
      return areaQ(`△ABC에서 점 M은 변 BC의 중점이고 점 P는 ${SG('AM')}의 중점이다. △ABC의 넓이가 ${S} ${SQ}일 때, △APC의 넓이는?`, S / 4, {
        figure: fig.svg('삼각형 ABC와 중선 AM. 점 M은 변 BC의 중점, 점 P는 선분 AM의 중점이다(길이가 같다는 표시). 선분 PC가 그어져 있고 삼각형 APC가 색칠되어 있다'),
        explain: `중선은 삼각형의 넓이를 이등분한다. ${SG('AM')}은 △ABC의 중선이므로 △AMC의 넓이는 ${frac(1, 2)} × ${S} = ${S / 2}(${SQ})이다. ${SG('CP')}는 △AMC의 중선이므로 △APC의 넓이는 ${frac(1, 2)} × ${S / 2} = ${S / 4}(${SQ})이다.`,
        facts: { calc: [[`${S}/2/2`, 0]], unseen: [2] }
      });
    }),
    T('area-parts', '무게중심과 세 중선이 나눈 넓이', '①59', (d, n) => {
      if (n === 3) {
        const [p, q] = d.pick([[8, 6], [6, 8], [12, 5], [9, 8], [10, 6], [12, 8], [9, 4], [12, 7], [8, 9], [6, 10], [10, 12]]), P0 = { A: [0, p], B: [0, 0], C: [q, 0] };
        P0.D = half(P0.B, P0.C); P0.G = cen(P0);
        const fig = Fig(P0, [150, 130], { hub: 'ABC' }).tint('GBD').poly('ABC').seg('AD GB').dot('G').right('ABC').tick('BD DC').name('ABC').name('D', 270).name('G', 30).len('AB', cm(p)).bow('BC', cm(q), 26);
        return areaQ(`∠B = 90°인 직각삼각형 ABC에서 점 D는 변 BC의 중점이고 점 G는 △ABC의 무게중심이다. ${eq('AB', p)}, ${eq('BC', q)}일 때, △GBD의 넓이는?`, p * q / 12, {
          figure: fig.svg(`각 B가 직각인 직각삼각형 ABC(직각 표시)와 중선 AD. 점 D는 변 BC의 중점이고(길이가 같다는 표시) 무게중심 G는 선분 AD 위에 있다. 선분 GB가 그어져 있고 삼각형 GBD가 색칠되어 있다. AB = ${cm(p)}, BC = ${cm(q)}`),
          explain: `△ABC의 넓이는 ${frac(1, 2)} × ${q} × ${p} = ${p * q / 2}(${SQ})이다. 세 중선은 삼각형의 넓이를 6등분하므로 △GBD의 넓이는 ${p * q / 2} × ${frac(1, 6)} = ${p * q / 12}(${SQ})이다.`,
          facts: { calc: [[`${p}*${q}/2/6`, 0]], unseen: [2, 6] }
        });
      }
      const S = d.pick(AREAS6);
      if (n === 0) {
        const fig = tidy(d, () => { const t3 = anyTri(d); return Fig(Object.assign({}, t3, { G: cen(t3) }), [160, 124], { hub: 'ABC' }).tint('GBC').poly('ABC').seg('GA GB GC').dot('G').name('ABC').nameMid('G', 'A', 'B'); });
        return areaQ(`점 G가 △ABC의 무게중심이고 △ABC의 넓이가 ${S} ${SQ}일 때, △GBC의 넓이는?`, S / 3, {
          figure: fig.svg('삼각형 ABC와 그 내부의 무게중심 G. 점 G와 세 꼭짓점을 이은 선분 GA, GB, GC가 그어져 있고 삼각형 GBC가 색칠되어 있다'),
          explain: `무게중심과 세 꼭짓점을 이어 생기는 세 삼각형 GAB, GBC, GCA의 넓이는 모두 같다. △GBC의 넓이는 ${S} × ${frac(1, 3)} = ${S / 3}(${SQ})이다.`,
          facts: { calc: [[`${S}/3`, 0]], unseen: [3] }
        });
      }
      const fig = twoMedians(d).tint(n === 1 ? 'GBD' : 'GDCE').poly('ABC').seg('AD BE').dot('G').tick('BD DC').tick('CE EA', 2).name('ABCDE').free('G', 'ADBE');
      if (n === 1) return areaQ(`△ABC에서 두 중선 AD, BE가 만나는 점을 G라 하자. △ABC의 넓이가 ${S} ${SQ}일 때, △GBD의 넓이는?`, S / 6, {
        figure: fig.svg(`${MED_SAID}. 삼각형 GBD가 색칠되어 있다`),
        explain: `세 중선은 삼각형의 넓이를 6등분한다. △GBD의 넓이는 ${S} × ${frac(1, 6)} = ${S / 6}(${SQ})이다.`,
        facts: { calc: [[`${S}/6`, 0]], unseen: [6] }
      });
      return areaQ(`△ABC에서 두 중선 AD, BE가 만나는 점을 G라 하자. △ABC의 넓이가 ${S} ${SQ}일 때, □GDCE의 넓이는?`, S / 3, {
        figure: fig.svg(`${MED_SAID}. 사각형 GDCE가 색칠되어 있다`),
        explain: `선분 GC를 그으면 □GDCE는 △GDC와 △GCE로 나누어진다. 세 중선은 삼각형의 넓이를 6등분하므로 두 삼각형의 넓이는 각각 ${S} × ${frac(1, 6)} = ${S / 6}(${SQ})이다. □GDCE의 넓이는 ${S / 6} × 2 = ${S / 3}(${SQ})이다.`,
        facts: { calc: [[`${S}/6*2`, 0]], unseen: [6, 2] }
      });
    }, { count: 4 }),
    T('area-back', '조각의 넓이로 전체나 다른 조각의 넓이 구하기', '①60', (d, n) => {
      const k = d.int(3, 14), fig = twoMedians(d).tint(n === 0 ? 'GBD' : 'GDCE').poly('ABC').seg('AD BE').dot('G').tick('BD DC').tick('CE EA', 2).name('ABCDE').free('G', 'ADBE');
      if (n === 0) return areaQ(`△ABC에서 두 중선 AD, BE가 만나는 점을 G라 하자. △GBD의 넓이가 ${k} ${SQ}일 때, △ABC의 넓이는?`, 6 * k, {
        figure: fig.svg(`${MED_SAID}. 삼각형 GBD가 색칠되어 있다`),
        explain: `세 중선은 삼각형의 넓이를 6등분하므로 △ABC의 넓이는 △GBD의 넓이의 6배이다. ${k} × 6 = ${6 * k}(${SQ})이다.`,
        facts: { calc: [[`${k}*6`, 0]], unseen: [6] }
      });
      return areaQ(`△ABC에서 두 중선 AD, BE가 만나는 점을 G라 하자. △AGE의 넓이가 ${k} ${SQ}일 때, □GDCE의 넓이는?`, 2 * k, {
        figure: fig.svg(`${MED_SAID}. 사각형 GDCE가 색칠되어 있다`),
        explain: `세 중선이 나눈 여섯 삼각형의 넓이는 모두 같으므로 △GDC와 △GCE의 넓이는 각각 △AGE의 넓이와 같은 ${k} ${SQ}이다. □GDCE의 넓이는 ${k} × 2 = ${2 * k}(${SQ})이다.`,
        facts: { calc: [[`${k}*2`, 0]], unseen: [2] }
      });
    }, { count: 2 }),
    T('area-mid-g', '두 변의 중점과 무게중심이 만든 삼각형의 넓이', '①61 심40', (d) => {
      const S = 12 * d.int(2, 8), fig = tidy(d, () => {
        const t3 = anyTri(d), P0 = Object.assign({}, t3, { D: half(t3.A, t3.B), E: half(t3.A, t3.C), G: cen(t3) });
        return Fig(P0, [168, 130], { hub: 'ABC' }).tint('DGE').poly('ABC').seg('BE CD DE').tick('AD DB').tick('AE EC', 2).name('ABCDE').name('G', 270, 13);
      });
      return areaQ(`△ABC에서 두 변 AB, AC의 중점을 각각 D, E라 하고, 두 중선 BE, CD가 만나는 점을 G라 하자. △ABC의 넓이가 ${S} ${SQ}일 때, △DGE의 넓이는?`, S / 12, {
        figure: fig.svg('삼각형 ABC와 두 중선 BE, CD. 점 D는 변 AB의 중점, 점 E는 변 AC의 중점이고(길이가 같다는 표시) 두 중선은 점 G에서 만난다. 선분 DE가 그어져 있고 삼각형 DGE가 색칠되어 있다'),
        explain: `점 G는 △ABC의 무게중심이므로 △GBD의 넓이는 ${S} × ${frac(1, 6)} = ${S / 6}(${SQ})이다. △GBD와 △DGE는 높이가 같고 밑변의 길이의 비가 ${SG('BG')} : ${SG('GE')} = 2 : 1이므로, △DGE의 넓이는 ${S / 6} × ${frac(1, 2)} = ${S / 12}(${SQ})이다.`,
        facts: { calc: [[`${S}/6/2`, 0]], unseen: [6, 2] }
      });
    }),
    T('area-half-again', '여섯 조각 가운데 하나를 다시 나눈 넓이', '①62', (d) => {
      const S = 12 * d.int(2, 8), fig = tidy(d, () => {
        const t3 = anyTri(d), P0 = Object.assign({}, t3, { D: half(t3.B, t3.C), G: cen(t3) }); P0.E = half(P0.G, P0.C);
        return Fig(P0, [176, 136], { hub: 'ABC' }).tint('GDE').poly('ABC').seg('AD GC DE').dot('G').tick('BD DC').tick('GE EC', 2).name('ABC').name('D', 270).nameMid('G', 'A', 'B').nameAway('E', 'D', 12);
      });
      return areaQ(`△ABC에서 점 G는 무게중심이고 점 D는 변 BC의 중점이다. ${SG('GC')}의 중점을 E라 하고 △ABC의 넓이가 ${S} ${SQ}일 때, △GDE의 넓이는?`, S / 12, {
        figure: fig.svg('삼각형 ABC와 중선 AD. 무게중심 G는 선분 AD 위에 있다. 선분 GC가 그어져 있고, 점 E는 선분 GC의 중점이다(길이가 같다는 표시). 선분 DE가 그어져 있고 삼각형 GDE가 색칠되어 있다'),
        explain: `세 중선은 삼각형의 넓이를 6등분하므로 △GDC의 넓이는 ${S} × ${frac(1, 6)} = ${S / 6}(${SQ})이다. ${SG('DE')}는 △GDC의 중선이므로 △GDE의 넓이는 ${frac(1, 2)} × ${S / 6} = ${S / 12}(${SQ})이다.`,
        facts: { calc: [[`${S}/6/2`, 0]], unseen: [6, 2] }
      });
    }),
    T('area-twice', '삼각형의 무게중심과 그 안의 삼각형의 무게중심이 나눈 넓이', '①63 심41', (d, n) => {
      const v = d.until(() => {
        const P0 = medOf(d.pick([12, 13, 14]), d.pick([11, 12, 13]), d.int(15, 20) * 5); P0.Q = lerp(P0.D, P0.A, 1 / 9);
        const fig = Fig(P0, [190, 160], { hub: 'ABC', show: { Q: 'G′' } }).tint(n === 0 ? 'QBD' : 'GBQ').poly('ABC').seg('AD GB GC QB QC').dot('GQ').tick('BD DC').name('ABC').name('D', 270);
        fig.nameMid('G', 'A', 'C').nameMid('Q', 'G', 'C', 14);
        return { P0, fig };
      }, (x) => fine(x.P0, 44, 90) && !x.fig.clash());
      const G2 = 'G′', lead = `△ABC에서 점 D는 변 BC의 중점이고, 점 G는 △ABC의 무게중심, 점 ${G2}은 △GBC의 무게중심이다.`;
      const said = `삼각형 ABC와 중선 AD. 점 D는 변 BC의 중점이고(길이가 같다는 표시) 선분 AD 위에 점 A에서 가까운 쪽부터 점 G, ${G2}이 있다. 선분 GB, GC와 선분 ${G2}B, ${G2}C가 그어져 있다.`;
      if (n === 0) {
        const k = d.int(2, 5);
        return areaQ(`${lead} △${G2}BD의 넓이가 ${k} ${SQ}일 때, △ABC의 넓이는?`, 18 * k, {
          figure: v.fig.svg(`${said} 삼각형 ${G2}BD가 색칠되어 있다`),
          explain: `점 ${G2}은 △GBC의 무게중심이므로 △GBC의 넓이는 △${G2}BD의 넓이의 6배인 ${6 * k} ${SQ}이다. 점 G는 △ABC의 무게중심이므로 △ABC의 넓이는 △GBC의 넓이의 3배인 ${6 * k} × 3 = ${18 * k}(${SQ})이다.`,
          facts: { calc: [[`${k}*6*3`, 0]], unseen: [6, 3] }
        });
      }
      const k = d.int(2, 10), S = 9 * k;
      return areaQ(`${lead} △ABC의 넓이가 ${S} ${SQ}일 때, △GB${G2}의 넓이는?`, k, {
        figure: v.fig.svg(`${said} 삼각형 GB${G2}이 색칠되어 있다`),
        explain: `점 G는 △ABC의 무게중심이므로 △GBC의 넓이는 ${S} × ${frac(1, 3)} = ${3 * k}(${SQ})이다. 점 ${G2}은 △GBC의 무게중심이므로 △${G2}GB, △${G2}BC, △${G2}CG의 넓이는 모두 같다. △GB${G2}의 넓이는 ${3 * k} × ${frac(1, 3)} = ${k}(${SQ})이다.`,
        facts: { calc: [[`${S}/3/3`, 0]], unseen: [3] }
      });
    }, { count: 2 })
  ]);

  // 실력 파일(8-2-4c.js)이 함께 쓰는 도구
  Object.assign(K, { half, medOf, anyTri, SQ, twoMedians, MED_SAID, AREAS6 });
})(typeof window !== 'undefined' ? window : globalThis);
