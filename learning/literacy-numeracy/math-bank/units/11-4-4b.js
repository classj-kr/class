// 고등학교 기하 Ⅱ-1 공간도형(11-4-4) — 뒤쪽 묶음(삼수선 정리, 이면각, 정사영과 그 길이, 정사영의 넓이와 그림자).
// 단원 틀·도구·싣는 기준·뺀 것은 11-4-4a.js 머리에 있다. 꼴마다의 판정은 references/textbooks/수학/_분석/11-4-4/싣기_대조표.md 에 있다.
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
//  - 삼수선 정리 그림은 평면 α(옅은 평행사변형) 위에 직선 l 을 긋고, 점 P 와 수선의 발 O, H 를 셈한 좌표에 그린다. 직각 표시는 문제가 주는 수직(PO ⊥ α, OH ⊥ l)에만 단다.
//  - 그림 속 글에는 근호를 쓰지 않는다. 근호가 든 길이는 문제 글로만 알린다.
//  - 원문 바로잡기: 중단원 평가 15의 수선의 발 이름(D → E, 꼭짓점 D 와 겹치지 않게), 소단원 평가 2-1-3의 1(선분 CJ), 8(넓이에 π).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines, C, inline } = B.kit;
  const { Q, nb, V, rt, grp, sqParts, SG } = B.kit.mid;
  const { RAD, Board, awayFrom } = B.kit.mgeo;
  const { jh } = B.kit.hs;
  const K = B.kit.u1144;
  const { UNIT, S2, S3, num, rad, vadd, vmul, vdiv, vfl, veq, sqrtFrac, kindOf, vh, vt, stripH, seal, plainCalc, aInt, aDeg, aCount, aFrac, aRad, aRadFrac, aSum, aVal, aPick, pickRows, pickAll, KS,
    sub3, add3, mul3, dot3, cross3, len3, lerp3, avg3, cuboid, prismOf, circR, pyr4, tri3, tetra, onRing, sp, fitU, solidFig, nameOf, saidOf, sg, vg, al, be, th, vl, cosT, sinT, tanT, COS3, SIN3, TAN3,
    pick, T, cosSq, valOfSq, HIL } = K;

  // √n 을 근호로 적은 글과, 그 값의 제곱 n 을 글에 보이는 수로 적은 검사 식(5√2 → 5**2*2)
  const rv = (n) => vh(sqrtFrac(n, 1));
  const rq = (n) => { const [s, m] = sqParts(n); return s === 1 ? String(m) : m === 1 ? `${s}**2` : `${s}**2*${m}`; };
  const isSq = (n) => Number.isInteger(Math.sqrt(n));
  const ln = (s) => '직선 ' + s;

  // ── 삼수선 정리 그림 ──
  // O 를 원점, 직선 l 을 x = oh(O 앞쪽)인 y 방향 직선으로 둔다. H = (oh, 0, 0), P = (0, 0, po), A 는 l 위 H 에서 왼쪽으로 ah.
  // o: { po, oh, ah, names: { P, O, H, A }, lens: { PO: '3', … }(그림에 적을 길이 — 정수만), extra(S) 덧그리기, hideA }
  function perpFig(o, said) {
    const nm = Object.assign({ P: 'P', O: 'O', H: 'H', A: 'A' }, o.names || {});
    const po = o.po, oh = o.oh, ah = o.ah || 0;
    const pts = { [nm.O]: [0, 0, 0], [nm.H]: [oh, 0, 0], [nm.P]: [0, 0, po] };
    if (!o.hideA) pts[nm.A] = [oh, -ah, 0];
    const span = Math.max(oh, ah, po * 0.6, 2), c = [oh * 0.45, -ah * 0.4, 0];
    const corners = [[oh + span * 0.5, 0, 0], [-span * 0.55, 0, 0], [0, -ah - span * 0.55, 0], [0, span * 0.6, 0]];
    const view = { k: 0.8, ang: 242 }, u = fitU(Object.values(pts).concat([[oh + span * 0.55, -ah - span * 0.6, 0], [-span * 0.55, span * 0.6, 0], [0, 0, po]]), 210, 165, view);
    const S = sp(Object.assign({ u }, view)).put(pts);
    S.plane(c, [oh * 0.55 + span * 0.55, 0, 0], [0, ah * 0.6 + span * 0.65, 0], K.ALPHA, 1);
    const lFrom = [oh, -ah - span * 0.5, 0], lTo = [oh, span * 0.55, 0];
    S.seg(lFrom, lTo, 'thin').text(add3(lTo, [0, 0.35 * span / 2, 0]), '<tspan style="font-style:italic;font-family:\'MB Math\',serif">l</tspan>');
    S.seg(nm.P, nm.O).seg(nm.O, nm.H, 'thin').seg(nm.P, nm.H);
    if (!o.hideA) S.seg(nm.P, nm.A);
    S.right(nm.O, nm.P, nm.H).right(nm.H, nm.O, o.hideA ? lTo : nm.A);
    for (const k of Object.keys(pts)) S.dot(k);
    S.name(nm.P, nm.P, 90).name(nm.O, nm.O, 20).name(nm.H, nm.H, 300);
    if (!o.hideA) S.name(nm.A, nm.A, 250);
    const inside = [oh * 0.3, -ah * 0.3, po * 0.3];
    for (const [seg, t] of Object.entries(o.lens || {})) { const [p, q] = [seg[0], seg[1]]; S.len(p, q, t, inside); }
    if (o.extra) o.extra(S);
    return S.svg(said);
  }
  const perpSaid = (nm, given) => `평면 α 위에 있지 않은 점 ${nm.P}, ${nm.P}에서 α에 내린 수선의 발 ${nm.O}, ${nm.O}에서 α 위의 직선 l에 내린 수선의 발 ${nm.H}, 직선 l 위의 점 ${nm.A}. ${given}`;

  // 원(가로로 놓인): 중심 c, 반지름 r. 앞쪽 반은 실선, 뒤쪽 반은 점선(back: 'dash'), 모두 실선이면 back: 'solid'
  function ring(S, c, r, back) {
    const f = (t) => [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t), c[2]];
    // 보이는 쪽: 반지름 방향이 보는 쪽을 향하는 곳
    const t0 = Math.atan2(-S.view[0], S.view[1]);              // cos t·v0 + sin t·v1 = 0 인 t
    S.curve(f, t0, t0 + Math.PI, undefined, 40);
    S.curve(f, t0 - Math.PI, t0, back === 'solid' ? undefined : 'dash', 40);
    return t0;
  }

  // ── 삼수선 정리 ──
  B.addTypes(UNIT, 'three', [
    T('three-blank', '삼수선 정리 세 꼴의 빈칸', '①20', (d, n) => {
      const nm = { P: 'P', O: 'O', H: 'H', A: 'A' };
      const figure = perpFig({ po: 3, oh: 2.4, ah: 0, hideA: true }, '평면 α 위에 있지 않은 점 P, α 위의 직선 l, l 위에 있지 않은 α 위의 점 O, l 위의 점 H.');
      const lead = `평면 ${al} 위에 있지 않은 점 P, ${al} 위의 직선 ${vl}, ${vl} 위에 있지 않은 ${al} 위의 점 O, ${vl} 위의 점 H에 대하여 다음 □ 안에 알맞은 것은?`;
      const rows = [
        [`${SG('PO')} ⊥ ${al}, ${SG('OH')} ⊥ ${vl}이면 □ ⊥ ${vl}`, 'PH'],
        [`${SG('PO')} ⊥ ${al}, ${SG('PH')} ⊥ ${vl}이면 □ ⊥ ${vl}`, 'OH'],
        [`${SG('PH')} ⊥ ${vl}, ${SG('OH')} ⊥ ${vl}, ${SG('PO')} ⊥ ${SG('OH')}이면 □ ⊥ ${al}`, 'PO']
      ][n];
      const opts = ['선분 PH', '선분 OH', '선분 PO', `평면 ${al}`];
      return pickRows(d, lead, opts.map((x) => [x, x === '선분 ' + rows[1]]), {
        figure: figure + lines([rows[0]]), explain: ['PO ⊥ α이면 PO는 l과 수직이고, OH ⊥ l이므로 l은 평면 PHO에 수직이다. 따라서 PH ⊥ l이다.', 'PO ⊥ α, PH ⊥ l이면 l은 평면 PHO에 수직이므로 그 평면 위의 OH와도 수직이다.', 'PH ⊥ l, OH ⊥ l이면 l은 평면 PHO에 수직이므로 PO ⊥ l이다. PO는 α 위의 평행하지 않은 두 직선 l, OH에 수직이므로 PO ⊥ α이다.'][n]
      });
    }, { count: 3 }),
    T('three-len', '삼수선 정리로 길이 구하기', '①21', (d, n) => {
      const nm = { P: 'P', O: 'O', H: 'H', A: 'A' };
      const po = d.int(2, 9), oh = d.int(2, 9), ah = d.int(2, 9);
      const lead = `그림과 같이 평면 ${al} 위에 있지 않은 점 P에서 ${al}에 내린 수선의 발을 O, 점 O에서 ${al} 위의 직선 ${vl}에 내린 수선의 발을 H라 하자. 직선 ${vl} 위의 점 A에 대하여 `;
      if (n === 0) {
        const s2 = po * po + oh * oh + ah * ah;
        if (isSq(s2) || sqParts(s2)[1] === 1) return null;
        const x = sqrtFrac(s2, 1);
        return aRad(lead + `${sg('PO', po)}, ${sg('OH', oh)}, ${sg('AH', ah)}일 때, 선분 PA의 길이는?`, x, {
          figure: perpFig({ po, oh, ah, lens: { PO: String(po), OH: String(oh), AH: String(ah) } }, perpSaid(nm, `PO = ${po}, OH = ${oh}, AH = ${ah}.`)),
          sq: [`${po}**2+${oh}**2+${ah}**2`, '1'],
          explain: `PO ⊥ α, OH ⊥ l이므로 삼수선 정리에 의하여 PH ⊥ l이다. 직각삼각형 POH에서 PH² = ${po * po} + ${oh * oh} = ${po * po + oh * oh}, 직각삼각형 PHA에서 PA = √(${po * po + oh * oh} + ${ah * ah}) = ${vh(x)}이다.`
        });
      }
      if (n === 1) {
        // AP, AH, PO 를 주고 OH
        const ap2 = po * po + oh * oh + ah * ah;
        return aInt(lead + `${vg('AP', rv(ap2))}, ${sg('AH', ah)}, ${sg('PO', po)}일 때, 선분 OH의 길이는?`, num(oh), {
          figure: perpFig({ po, oh, ah, lens: { PO: String(po), AH: String(ah) } }, perpSaid(nm, `AP = ${vt(sqrtFrac(ap2, 1))}, AH = ${ah}, PO = ${po}.`)),
          value: `(${rq(ap2)}-${ah}**2-${po}**2)**0.5`,
          explain: `삼수선 정리에 의하여 PH ⊥ l이다. 직각삼각형 PHA에서 PH² = AP² − AH² = ${ap2} − ${ah * ah} = ${ap2 - ah * ah}, 직각삼각형 POH에서 OH² = ${ap2 - ah * ah} − ${po * po} = ${oh * oh}이므로 OH = ${oh}이다.`
        });
      }
      if (n === 2) {
        // AP, OH, PO 를 주고 AH
        const ap2 = po * po + oh * oh + ah * ah;
        return aInt(lead + `${vg('AP', rv(ap2))}, ${sg('OH', oh)}, ${sg('PO', po)}일 때, 선분 AH의 길이는?`, num(ah), {
          figure: perpFig({ po, oh, ah, lens: { PO: String(po), OH: String(oh) } }, perpSaid(nm, `AP = ${vt(sqrtFrac(ap2, 1))}, OH = ${oh}, PO = ${po}.`)),
          value: `(${rq(ap2)}-${po}**2-${oh}**2)**0.5`,
          explain: `삼수선 정리에 의하여 PH ⊥ l이다. PH² = PO² + OH² = ${po * po + oh * oh}이므로 직각삼각형 PHA에서 AH² = ${ap2} − ${po * po + oh * oh} = ${ah * ah}, AH = ${ah}이다.`
        });
      }
      // PA, PO 를 주고(A 는 O 에서 l 에 내린 수선의 발), l 위의 점 B 에 대하여 AB 를 주고 OB
      const nm2 = { P: 'P', O: 'O', H: 'A', A: 'B' }, oa = oh, ab = ah, pa2 = po * po + oa * oa, ob2 = oa * oa + ab * ab;
      if (!isSq(ob2) || isSq(pa2)) return null;
      return aInt(`그림과 같이 평면 ${al} 밖의 점 P에서 ${al}에 내린 수선의 발을 O, 점 O에서 ${al} 위의 직선 ${vl}에 내린 수선의 발을 A라 하자. 직선 ${vl} 위의 점 B에 대하여 ${vg('PA', rv(pa2))}, ${sg('PO', po)}, ${sg('AB', ab)}일 때, 선분 OB의 길이는?`, num(Math.sqrt(ob2)), {
        figure: perpFig({ po, oh: oa, ah: ab, names: nm2, lens: { PO: String(po), AB: String(ab) } }, perpSaid(nm2, `PA = ${vt(sqrtFrac(pa2, 1))}, PO = ${po}, AB = ${ab}.`)),
        value: `(${rq(pa2)}-${po}**2+${ab}**2)**0.5`,
        explain: `직각삼각형 POA에서 OA² = PA² − PO² = ${pa2} − ${po * po} = ${oa * oa}이다. OA ⊥ l이므로 직각삼각형 OAB에서 OB = √(${oa * oa} + ${ab * ab}) = ${Math.sqrt(ob2)}이다.`
      });
    }, { count: 4 }),
    T('three-height', '직각으로 만나는 세 모서리 — 점에서 맞은편 직선까지', '①22', (d, n) => {
      if (n === 0) {
        // 직육면체 AD = a, AE = c, EF = b, D 에서 EG 에 내린 수선의 발 K: HK = ab/√(a² + b²), DK² = c² + a²b²/(a² + b²)
        const a = d.int(2, 6), b = d.int(2, 6), c = d.int(1, 5);
        if (a === b) return null;
        const nn = c * c * (a * a + b * b) + a * a * b * b, dd = a * a + b * b, x = sqrtFrac(nn, dd);
        if (kindOf(x) !== 'radfrac' || x[0].q.q > 30 || x[0].m > 80) return null;
        const s = cuboid(a, b, c), v = s.v, t = dot3(sub3(v.H, v.E), sub3(v.G, v.E)) / dot3(sub3(v.G, v.E), sub3(v.G, v.E)), Kp = lerp3(v.E, v.G, t);
        const figure = solidFig(s, saidOf(s) + ` AD = ${a}, AE = ${c}, EF = ${b}. 점 D에서 선분 EG에 내린 수선의 발 K와 선분 DK, HK를 나타내었다.`, (S) => { S.put({ K: Kp }); S.seg('E', 'G', 'dash').seg('D', 'K', 'hld').seg('H', 'K', 'dash').dot('K').name('K', 'K', 280); S.right('K', 'D', 'G'); S.len('A', 'D', String(a), 'G'); S.len('A', 'E', String(c), 'G'); S.len('E', 'F', String(b), 'C'); });
        return aRadFrac(`그림과 같이 ${sg('AD', a)}, ${sg('AE', c)}, ${sg('EF', b)}인 직육면체 ABCD-EFGH에서 점 D에서 선분 EG에 내린 수선의 발을 K라 할 때, 선분 DK의 길이는?`, x, {
          figure, sq: [`${c}**2*(${a}**2+${b}**2)+${a}**2*${b}**2`, `${a}**2+${b}**2`],
          explain: `DH ⊥ 평면 EFGH, DK ⊥ EG이므로 삼수선 정리에 의하여 HK ⊥ EG이다. 직각삼각형 EHG의 넓이에서 HK × EG = ${a} × ${b}, EG = ${rv(a * a + b * b)}이므로 HK = ${vh(vdiv(num(a * b), sqrtFrac(a * a + b * b, 1)))}이다. 직각삼각형 DHK에서 DK = ${vh(x)}이다.`
        });
      }
      if (n === 1) {
        // 직육면체 EF = p, FG = q, AE = c, M 은 FG 의 중점, A 에서 직선 HM 에 내린 수선의 발 N: EN = (EH × EF)/HM … 넓이로, AN² = c² + EN²
        const p = d.int(2, 6), q = 2 * d.int(1, 3), c = d.int(1, 4);
        const hm2 = 4 * p * p + q * q, en2n = 4 * p * p * q * q, nn = c * c * hm2 + en2n, x = sqrtFrac(nn, hm2);   // EN = pq / HM, HM² = p² + (q/2)²
        if (kindOf(x) !== 'radfrac' || x[0].q.q > 30 || x[0].m > 100) return null;
        const s = cuboid(q, p, c), v = s.v, M = lerp3(v.F, v.G, 0.5), w = sub3(M, v.H), t = dot3(sub3(v.E, v.H), w) / dot3(w, w), Np = lerp3(v.H, M, t);
        const figure = solidFig(s, saidOf(s) + ` EF = ${p}, FG = ${q}, AE = ${c}. M은 모서리 FG의 중점이고, 점 A에서 직선 HM에 내린 수선의 발 N과 선분 AN, EN을 나타내었다.`, (S) => { S.put({ M, N: Np }); S.seg('H', 'M', 'dash').seg('A', 'N', 'hld').seg('E', 'N', 'dash').dot('M').dot('N').name('M', 'M', 320).name('N', 'N', 250); S.right('N', 'A', 'M'); });
        return aRadFrac(`그림과 같이 ${sg('EF', p)}, ${sg('FG', q)}, ${sg('AE', c)}인 직육면체 ABCD-EFGH에서 모서리 FG의 중점을 M, 점 A에서 직선 HM에 내린 수선의 발을 N이라 할 때, 선분 AN의 길이는?`, x, {
          figure, sq: [`${c}**2*(4*${p}**2+${q}**2)+4*${p}**2*${q}**2`, `4*${p}**2+${q}**2`],
          explain: `AE ⊥ 평면 EFGH, AN ⊥ HM이므로 삼수선 정리에 의하여 EN ⊥ HM이다. 삼각형 EMH의 넓이는 (1/2) × ${q} × ${p}이고 HM = ${vh(sqrtFrac(hm2, 4))}이므로 EN = ${vh(vdiv(num(p * q), sqrtFrac(hm2, 4)))}이다. 직각삼각형 AEN에서 AN = ${vh(x)}이다.`
        });
      }
      // 거꾸로: AD, DB, DC 가 서로 수직, AH ⊥ BC(H 는 BC 위). BD, CD, AH 를 주고 AD
      const kind = d.int(0, 1);
      let bd, cdH, cd2, dh2, dhH;
      if (kind === 0) { const k = d.pick([5, 10]); bd = 3 * k; cd2 = (4 * k) ** 2; cdH = String(4 * k); dh2 = (12 * k / 5) ** 2; dhH = String(12 * k / 5); }
      else { const k = d.pick([2, 4, 6]); bd = k; cd2 = 3 * k * k; cdH = rv(cd2); dh2 = 3 * k * k / 4; dhH = vh(rad(k, 3, 2)); }
      const ad = d.int(2, 12), ah2 = ad * ad + dh2;
      if (!Number.isInteger(ah2)) return null;
      const ahH = rv(ah2);
      // 그림: D 를 직각인 꼭짓점으로 하는 사면체(A 위, B·C 는 바닥)
      const D0 = [0, 0, 0], B0 = [3.4, -0.6, 0], C0 = [-0.6, 3.6, 0], A0 = [0, 0, 3.4], w = sub3(C0, B0), t = dot3(sub3(D0, B0), w) / dot3(w, w), H0 = lerp3(B0, C0, t);
      const S = sp({ u: fitU([D0, B0, C0, A0], 190, 150, { k: 0.6, ang: 215 }), k: 0.6, ang: 215 }).put({ A: A0, B: B0, C: C0, D: D0, H: H0 });
      S.seg('A', 'B').seg('A', 'C').seg('B', 'C').seg('A', 'D', 'dash').seg('B', 'D', 'dash').seg('C', 'D', 'dash').seg('A', 'H', 'hl').seg('D', 'H', 'dash').dot('H');
      S.name('A', 'A', 90).name('B', 'B', 250).name('C', 'C', 340).name('D', 'D', 160).name('H', 'H', 280); S.right('D', 'A', 'B').right('D', 'B', 'C').right('H', 'A', 'C');
      const figure = S.svg(`사면체 ABCD. AD ⊥ DB, AD ⊥ DC, DB ⊥ DC이고 AH ⊥ BC(H는 선분 BC 위의 점). BD = ${bd}, CD = ${kind === 0 ? cdH : vt(sqrtFrac(cd2, 1))}.`);
      return aInt(`그림과 같이 ${nb(SG('AD') + ' ⊥ ' + SG('DB'))}, ${nb(SG('AD') + ' ⊥ ' + SG('DC'))}, ${nb(SG('DB') + ' ⊥ ' + SG('DC'))}, ${nb(SG('AH') + ' ⊥ ' + SG('BC'))}인 사면체 ABCD에서 ${sg('BD', bd)}, ${vg('CD', cdH)}, ${vg('AH', ahH)}일 때, 선분 AD의 길이는?`, num(ad), {
        figure, value: `(${rq(ah2)}-(${bd}**2*${kind === 0 ? cdH + '**2' : rq(cd2)})/(${bd}**2+${kind === 0 ? cdH + '**2' : rq(cd2)}))**0.5`,
        explain: `AD ⊥ 평면 DBC, AH ⊥ BC이므로 삼수선 정리에 의하여 DH ⊥ BC이다. 직각삼각형 DBC에서 BC = ${rv(bd * bd + cd2)}, DH × BC = BD × CD이므로 DH = ${dhH}이다. 직각삼각형 ADH에서 AD² = AH² − DH² = ${ah2} − ${dh2} = ${ad * ad}, AD = ${ad}이다.`
      });
    }, { count: 3 }),
    T('three-corner', '세 모서리가 수직인 꼭짓점을 잘라 낸 삼각형의 넓이', '①23', (d) => {
      // a²b² + b²c² + c²a² 이 홀수의 제곱이 되는 세 수
      const [a, b, c] = d.shuffle(pick(d, [[1, 1, 2], [1, 2, 3], [1, 3, 4], [1, 4, 5], [1, 5, 6], [2, 3, 5], [2, 5, 7], [3, 4, 7], [3, 5, 8], [4, 5, 9], [1, 6, 7], [1, 7, 8], [2, 7, 9], [4, 7, 7]]).slice());
      const S2 = a * a * b * b + b * b * c * c + c * c * a * a, r = Math.round(Math.sqrt(S2)), e = Math.max(a, b, c);
      const s = cuboid(e, e, e), v = s.v, O = v.E, A0 = add3(O, [0, a, 0]), B0 = add3(O, [-b, 0, 0]), C0 = add3(O, [0, 0, c]);
      const figure = solidFig(s, `한 모서리의 길이가 ${e}인 정육면체. 꼭짓점 O에 모인 세 모서리 위에 OA = ${a}, OB = ${b}, OC = ${c}인 점 A, B, C를 잡고 삼각형 ABC를 나타내었다.`, (S) => {
        S.put({ O, A: A0, B: B0, C: C0 }); S.face(['A', 'B', 'C']); S.seg('A', 'B', 'dash').seg('B', 'C', 'dash').seg('C', 'A', 'hl').dot('A').dot('B').dot('C');
        S.name('O', 'O', 225).name('A', 'A', 280).name('B', 'B', 160).name('C', 'C', 200);
      }, { names: false });
      return aFrac(`그림과 같이 한 모서리의 길이가 ${e}인 정육면체의 한 꼭짓점 O에 모인 세 모서리 위에 ${sg('OA', a)}, ${sg('OB', b)}, ${sg('OC', c)}인 세 점 A, B, C를 잡을 때, 삼각형 ABC의 넓이는?`, num(r, 2), {
        figure, value: `(${a}**2*${b}**2+${b}**2*${c}**2+${c}**2*${a}**2)**0.5/2`,
        explain: `점 C에서 AB에 내린 수선의 발을 M이라 하면 OC ⊥ 평면 OAB이므로 삼수선 정리에 의하여 OM ⊥ AB이다. OM = ${vh(vdiv(num(a * b), sqrtFrac(a * a + b * b, 1)))}, CM = √(${c * c} + OM²)이고 넓이는 (1/2) × AB × CM = ${vh(num(r, 2))}이다.`
      });
    }),
    T('three-dist', '평면 밖의 점에서 평면 위의 직선까지의 거리', '①24', (d, n) => {
      if (n === 0) {
        // 삼각형 ABC(넓이 S, BC = a), AD ⊥ α, AD = h → AH = 2S/a, DH = √(AH² + h²)
        const pair = pick(d, [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]]), [AH, AD, DH] = d.bool() ? pair : [pair[1], pair[0], pair[2]];
        const a = d.pick([4, 6, 8, 10]), S0 = AH * a / 2;
        if (!Number.isInteger(S0)) return null;
        const Ap = [-1.4, 0.5, 0], Hp = [1.2, 0.5, 0], Bp = [1.2, -1.8, 0], Cp = [1.2, 2.4, 0], Dp = [-1.4, 0.5, 2.4], V0 = { k: 0.8, ang: 242 };
        const S = sp(Object.assign({ u: fitU([Ap, Bp, Cp, Dp, [2.4, -2.8, 0], [-2.6, 3.4, 0]], 200, 160, V0) }, V0)).put({ A: Ap, B: Bp, C: Cp, D: Dp, H: Hp });
        S.plane([-0.1, 0.3, 0], [2.4, 0, 0], [0, 3.1, 0], K.ALPHA, 1);
        S.face(['A', 'B', 'C']).seg('A', 'B').seg('B', 'C').seg('C', 'A').seg('A', 'D').seg('D', 'B', 'thin').seg('D', 'C', 'thin').seg('D', 'H', 'hl').seg('A', 'H', 'dash');
        S.right('A', 'D', 'H').right('H', 'D', 'C');
        for (const k of 'ABCDH') S.dot(k);
        S.name('A', 'A', 150).name('B', 'B', 250).name('C', 'C', 330).name('D', 'D', 90).name('H', 'H', 300);
        const figure = S.svg(`평면 α 위의 삼각형 ABC(넓이 ${S0}, BC = ${a})와 점 A를 지나고 α에 수직인 직선 위의 점 D(AD = ${AD}). H는 점 D에서 직선 BC에 내린 수선의 발이다.`);
        return aInt(`그림과 같이 평면 ${al} 위에 넓이가 ${S0}이고 ${sg('BC', a)}인 삼각형 ABC가 있다. 점 A를 지나고 평면 ${al}에 수직인 직선 위에 ${sg('AD', AD)}인 점 D를 잡을 때, 점 D와 직선 BC 사이의 거리는?`, num(DH), {
          figure, value: `((2*${S0}/${a})**2+${AD}**2)**0.5`,
          explain: `점 D에서 직선 BC에 내린 수선의 발을 H라 하면 AD ⊥ α, DH ⊥ BC이므로 삼수선 정리에 의하여 AH ⊥ BC이다. 삼각형 ABC의 넓이에서 (1/2) × ${a} × AH = ${S0}, AH = ${AH}이다. 직각삼각형 DAH에서 DH = √(${AH * AH} + ${AD * AD}) = ${DH}이다.`
        });
      }
      // 직각이등변 삼각자 둘: AB = AC = BD = DC = k, ABC 는 바닥에 수직, BDC 는 바닥 위 → A 와 직선 DC 사이의 거리 = k√3/2
      const k = d.pick([2, 4, 6, 8]), x = rad(k, 3, 2), h = k / Math.SQRT2;
      const Bp = [0, -h, 0], Cp = [0, h, 0], Ap = [0, 0, h], Dp = [h, 0, 0], Hp = [0, 0, 0], H2 = [h / 2, h / 2, 0];
      const S = sp({ u: fitU([Bp, Cp, Ap, Dp, [1.25 * h, -1.25 * h, 0], [-0.35 * h, 1.25 * h, 0], [1.25 * h, 1.25 * h, 0], [-0.35 * h, -1.25 * h, 0]], 230, 150, { k: 0.6, ang: 215 }), k: 0.6, ang: 215 }).put({ A: Ap, B: Bp, C: Cp, D: Dp, H: Hp, I: H2 });
      S.plane([h * 0.45, 0, 0], [h * 0.8, 0, 0], [0, h * 1.25, 0], K.ALPHA, 3);
      S.face(['A', 'B', 'C'], 'rgba(251,191,36,0.3)').face(['B', 'D', 'C'], 'rgba(37,99,235,0.12)');
      S.seg('A', 'B').seg('A', 'C').seg('B', 'C').seg('B', 'D').seg('D', 'C').seg('A', 'H', 'dash').seg('H', 'I', 'dash').seg('A', 'I', 'hl');
      S.right('A', 'B', 'C').right('D', 'B', 'C').right('I', 'A', 'C');
      S.name('A', 'A', 90).name('B', 'B', 200).name('C', 'C', 340).name('D', 'D', 250);
      const figure = S.svg(`직각이등변삼각형 모양의 두 삼각자 ABC(∠A = 90°)와 BDC(∠D = 90°). AB = AC = BD = DC = ${k}. 삼각자 ABC는 바닥 α에 수직으로 세우고, 삼각자 BDC는 변 BC에 붙여 바닥 위에 놓았다.`);
      return aRad(`그림과 같이 ${sg('AB', k)}, ${sg('AC', k)}, ${sg('BD', k)}, ${sg('DC', k)}인 직각이등변삼각형 모양의 두 삼각자 ABC, BDC가 있다. 삼각자 ABC를 바닥 ${al}에 수직이 되도록 세우고, 삼각자 BDC를 변 BC에 붙여 바닥 ${al} 위에 놓았을 때, 점 A와 직선 DC 사이의 거리는? (단, ∠BAC = ∠BDC = 90°)`, x, {
        figure, sq: [`3*${k}**2`, '4'],
        explain: `점 A에서 BC에 내린 수선의 발 H는 BC의 중점이고 AH ⊥ α, AH = ${vh(rad(k, 2, 2))}이다. H에서 DC에 내린 수선의 발을 I라 하면 삼수선 정리에 의하여 AI ⊥ DC이고, HI ∥ BD이므로 HI = ${k / 2}이다. AI = √(AH² + HI²) = ${vh(x)}이다.`
      });
    }, { count: 2 }),
    T('three-real', '삼수선 정리의 실생활 — 높이와 거리', '①25', (d, n) => {
      if (n === 0) {
        // 무인기: BQ = q, AB = p, ∠PAB = 45° → PB = p, PQ = √(p² − q²)
        const [q, pq, p] = pick(d, [[6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [9, 12, 15], [12, 16, 20], [16, 12, 20], [8, 15, 17], [15, 20, 25]]);
        const Ap = [1.2, -3.2, 0], Bp = [1.2, 0, 0], Qp = [0, 0, 0], Pp = [0, 0, 2.6];
        const S = sp({ u: fitU([Ap, Bp, Qp, Pp, [2.4, -4, 0], [-1, 1.4, 0]], 200, 140, { k: 0.6, ang: 215 }), k: 0.6, ang: 215 }).put({ A: Ap, B: Bp, Q: Qp, P: Pp });
        S.plane([0.6, -1.3, 0], [1.6, 0, 0], [0, 2.7, 0], '', 1);
        S.seg([1.2, -4.2, 0], [1.2, 1.2, 0], 'thin').seg('P', 'Q').seg('Q', 'B', 'thin').seg('P', 'B', 'dash').seg('P', 'A').seg('A', 'B', 'thin');
        S.right('Q', 'P', 'B').right('B', 'Q', 'A').angle('A', 'B', 'P', '45°');
        for (const k of 'ABQP') S.dot(k);
        S.name('A', 'A', 250).name('B', 'B', 280).name('Q', 'Q', 20).name('P', 'P', 90);
        const figure = S.svg(`직선 모양의 트랙 위의 지점 A, 무인기 P, P에서 바닥에 내린 수선의 발 Q, Q에서 트랙에 내린 수선의 발 B. BQ = ${q} m, AB = ${p} m, ∠PAB = 45°.`);
        return aInt(`그림과 같이 직선 모양의 트랙 위의 지점 A에서 무인기를 조종하고 있다. 지점 P에 있는 무인기에서 바닥에 내린 수선의 발을 Q, 점 Q에서 트랙에 내린 수선의 발을 B라 하자. 두 지점 B, Q 사이의 거리가 ${q} m, 두 지점 A, B 사이의 거리가 ${p} m이고 ∠PAB = 45°일 때, 선분 PQ의 길이는 몇 m인가?`, num(pq), {
          figure, unit: 'm', value: `(${p}**2-${q}**2)**0.5`,
          explain: `PQ ⊥ 바닥, QB ⊥ 트랙이므로 삼수선 정리에 의하여 PB ⊥ 트랙이다. 직각삼각형 PAB에서 ∠PAB = 45°이므로 PB = AB = ${p} m이고, 직각삼각형 PQB에서 PQ = √(${p * p} − ${q * q}) = ${pq} (m)이다.`
        });
      }
      // 건물: H 에서 직선 도로까지 HB = q, AB = √3 × CB, ∠CAB = 30°
      const [q, ch] = pick(d, [[10, 20], [5, 12], [8, 15], [6, 8], [12, 16], [9, 12], [10, 24], [7, 24]]);
      const cb2 = q * q + ch * ch, ab2 = 3 * cb2;
      const Hp = [0, 0, 0], Bp = [1.3, 0, 0], Ap = [1.3, -3.2, 0], Cp = [0, 0, 2.8];
      const S = sp({ u: fitU([Ap, Bp, Hp, Cp, [2.4, -4, 0], [-1, 1.4, 0]], 200, 140, { k: 0.6, ang: 215 }), k: 0.6, ang: 215 }).put({ A: Ap, B: Bp, H: Hp, C: Cp });
      S.plane([0.6, -1.3, 0], [1.6, 0, 0], [0, 2.7, 0], '', 1);
      S.seg([1.3, -4.2, 0], [1.3, 1.2, 0], 'thin').seg('C', 'H').seg('H', 'B', 'thin').seg('C', 'B', 'dash').seg('C', 'A').seg('A', 'B', 'thin');
      S.right('H', 'C', 'B').right('B', 'H', 'A').angle('A', 'B', 'C', '30°');
      for (const k of 'ABHC') S.dot(k);
      S.name('A', 'A', 250).name('B', 'B', 280).name('H', 'H', 20).name('C', 'C', 90);
      const figure = S.svg(`건물의 가장 높은 지점 C와 그 아래 지상의 지점 H, H에서 직선 도로에 내린 수선의 발 B, 도로 위의 지점 A. HB = ${q} m, ∠CAB = 30°, CH는 지면에 수직이다.`);
      return aInt(`그림과 같이 건물 지상의 한 지점 H에서 ${q} m 떨어진 곳에 직선 도로가 있고, H에서 도로에 내린 수선의 발을 B라 하자. 도로 위의 한 지점 A와 건물의 가장 높은 지점 C에 대하여 ${vg('AB', rv(ab2) + ' m')}, ∠CAB = 30°이고 직선 CH는 지면에 수직일 때, 선분 CH의 길이는 몇 m인가?`, num(ch), {
        figure, unit: 'm', value: `(${rq(ab2)}/3-${q}**2)**0.5`,
        explain: `CH ⊥ 지면, HB ⊥ AB이므로 삼수선 정리에 의하여 CB ⊥ AB이다. 직각삼각형 CAB에서 CB = AB × tan 30° = ${rv(cb2)} (m)이고, 직각삼각형 CHB에서 CH = √(${cb2} − ${q * q}) = ${ch} (m)이다.`
      });
    }, { count: 2 }),
    T('three-cos3', '직선과 평면이 이루는 각과 평면 위 직선 — 코사인 둘을 잇기', '①26', (d, n) => {
      const vals = [30, 45, 60], prod = (a, b) => vmul(COS3[a], COS3[b]);
      const all = [];
      for (const a of vals) for (const b of vals) all.push(prod(a, b));
      all.push(num(1, 2), rad(1, 3, 2), rad(1, 2, 2), vmul(SIN3[30], COS3[60]), vmul(SIN3[60], COS3[45]));
      if (n === 0) {
        const a = pick(d, vals), b = pick(d, vals), right = prod(a, b), wrongs = d.shuffle(all.filter((x) => !veq(x, right)));
        const Ap = [1.4, -2.4, 0], Qp = [-0.2, -0.4, 0], Pp = [-0.2, -0.4, 2], Bp = [1.4, 0.8, 0];
        const S = sp({ u: fitU([Ap, Qp, Pp, Bp, [2.6, -3.4, 0], [-1.4, 1.6, 0]], 200, 140, { k: 0.6, ang: 215 }), k: 0.6, ang: 215 }).put({ A: Ap, Q: Qp, P: Pp, B: Bp });
        S.plane([0.6, -0.9, 0], [1.9, 0, 0], [0, 2.6, 0], K.ALPHA, 1);
        S.seg('A', 'B').seg('P', 'Q').seg('A', 'P').seg('A', 'Q', 'dash').right('Q', 'P', 'A');
        for (const k of 'APQB') S.dot(k);
        S.name('A', 'A', 250).name('B', 'B', 290).name('Q', 'Q', 20).name('P', 'P', 90);
        const figure = S.svg(`평면 α 위의 선분 AB와 α 밖의 점 P, P에서 α에 내린 수선의 발 Q. ∠PAQ = ${a}°, ∠QAB = ${b}°.`);
        return aPick(d, `그림과 같이 평면 ${al} 위에 선분 AB가 있고, 평면 ${al} 밖의 한 점 P에서 ${al}에 내린 수선의 발을 Q라 하자. ∠PAQ = ${a}°, ∠QAB = ${b}°이고 ∠PAB = ${th}일 때, ${cosT}의 값은?`, right, wrongs, {
          figure, explain: `점 Q에서 직선 AB에 내린 수선의 발을 R라 하면 PQ ⊥ α, QR ⊥ AB이므로 삼수선 정리에 의하여 PR ⊥ AB이다. AQ = AP cos ${a}°, AR = AQ cos ${b}°이므로 ${cosT} = AR ÷ AP = cos ${a}° × cos ${b}° = ${vh(right)}이다.`
        });
      }
      const g = pick(d, vals), right = prod(60, g), wrongs = d.shuffle(all.filter((x) => !veq(x, right)));
      const Bp = [0, 0, 0], Cp = [0, 2.6, 0], Ap = [0, 1.3, 2.25], Lp = [2.2 * Math.cos(g * RAD) * 1.4, 2.2 * Math.sin(g * RAD) * 1.4, 0];
      const S = sp({ u: fitU([Bp, Cp, Ap, Lp, [3, -0.6, 0], [-0.8, 3.4, 0]], 200, 140, { k: 0.6, ang: 215 }), k: 0.6, ang: 215 }).put({ A: Ap, B: Bp, C: Cp, L: Lp });
      S.plane([1, 1.3, 0], [1.6, 0, 0], [0, 2, 0], K.ALPHA, 0);
      S.face(['A', 'B', 'C']).seg('A', 'B').seg('B', 'C').seg('C', 'A').seg('B', 'L', 'thin').right([0, 1.3, 0], 'A', 'C');
      S.name('A', 'A', 90).name('B', 'B', 160).name('C', 'C', 20).text(add3(Lp, [0.3, 0, 0]), '<tspan style="font-style:italic;font-family:\'MB Math\',serif">l</tspan>');
      const figure = S.svg(`평면 α 위의 선분 BC를 한 변으로 하는 정삼각형 ABC가 평면 α와 수직으로 놓여 있고, 점 B를 지나는 α 위의 직선 l이 직선 BC와 ${g}°의 각을 이룬다.`);
      return aPick(d, `그림과 같이 평면 ${al} 위에 있는 선분 BC를 한 변으로 하는 정삼각형 ABC가 평면 ${al}와 수직으로 놓여 있고, 점 B를 지나는 평면 ${al} 위의 직선 ${vl}이 직선 BC와 ${g}°의 각을 이룬다. 직선 AB와 직선 ${vl}이 이루는 예각의 크기를 ${th}라 할 때, ${cosT}의 값은?`, right, wrongs, {
        figure, explain: `점 A에서 α에 내린 수선의 발 M은 BC의 중점이다. M에서 l에 내린 수선의 발을 H라 하면 삼수선 정리에 의하여 AH ⊥ l이다. BM = AB cos 60°, BH = BM cos ${g}°이므로 ${cosT} = BH ÷ AB = cos 60° × cos ${g}° = ${vh(right)}이다.`
      });
    }, { count: 2 })
  ]);

  // ── 이면각 ──
  B.addTypes(UNIT, 'dihedral', [
    T('dh-def', '이면각의 크기의 뜻 — 잘못 잰 각 찾기', '②1', (d) => {
      return pickRows(d, `두 평면 ${al}, ${be}의 교선 ${vl} 위의 한 점 O에 대하여 삼각형 AOB가 정삼각형이 되도록 두 점 A, B를 각각 평면 ${al}, ${be} 위에 잡고 「두 평면 ${al}, ${be}가 이루는 각의 크기는 ∠AOB의 크기인 60°이다.」라고 설명하였다. 이 설명이 잘못된 까닭으로 알맞은 것은?`, [
        [`두 반직선 OA, OB가 교선 ${vl}에 수직이라는 조건이 없다.`, true],
        ['삼각형 AOB가 정삼각형이 아니라 이등변삼각형이어야 한다.', false],
        ['점 O가 교선 위에 있으면 이면각을 잴 수 없다.', false],
        ['이면각의 크기는 언제나 90°이다.', false],
        [`두 점 A, B가 모두 평면 ${al} 위에 있어야 한다.`, false]
      ], { explain: '이면각의 크기는 교선 위의 한 점에서 교선에 수직인 두 반직선을 각 평면 위에 그었을 때 그 두 반직선이 이루는 각의 크기이다. OA, OB가 교선에 수직이 아니면 ∠AOB는 이면각의 크기가 아니다.' });
    }),
    T('dh-box', '직육면체에서 두 평면이 이루는 각', '②2', (d, n) => {
      if (n === 0) {
        // 평면 AFGD 와 평면 EFGH: ∠AFE, tan = AE/EF
        const deg = pick(d, [30, 45, 60]), b = 3 * d.int(1, 3), a = d.int(2, 6);
        const cv = deg === 45 ? num(b) : deg === 30 ? rad(b, 3, 3) : rad(b, 3), cz = vfl(cv);
        const s = cuboid(a, b, cz), cH = vh(cv);
        const figure = solidFig(s, saidOf(s) + ` AD = ${a}, CD = ${b}, AE = ${vt(cv)}. 직사각형 AFGD를 나타내었다.`, (S) => { S.face(['A', 'F', 'G', 'D']); S.seg('A', 'F', 'hl').seg('F', 'G').seg('G', 'D', 'dash'); S.len('A', 'D', String(a), 'C'); S.len('C', 'D', String(b), 'A'); });
        return aDeg(`그림과 같이 ${sg('AD', a)}, ${vg('AE', cH)}, ${sg('CD', b)}인 직육면체 ABCD-EFGH에서 평면 AFGD와 평면 EFGH가 이루는 각의 크기는?`, deg, {
          figure, explain: `FG ⊥ 평면 ABFE이므로 AF ⊥ FG, EF ⊥ FG이다. 따라서 두 평면이 이루는 각은 ∠AFE이고 tan(∠AFE) = AE ÷ EF = ${vh(vdiv(cv, num(b)))}이므로 ${deg}°이다.`
        });
      }
      // 밑면이 한 변 a 인 정사각형, 높이 c: 평면 CHF 와 평면 FGH — FH 의 중점 M, cos = GM/CM = a/√(a² + 2c²)
      const a = d.int(1, 6), c = d.int(1, 6), x = sqrtFrac(a * a, a * a + 2 * c * c);
      if (kindOf(x) !== 'radfrac' || x[0].q.q > 30) return null;
      const s = cuboid(a, a, c), v = s.v, M = lerp3(v.F, v.H, 0.5);
      const figure = solidFig(s, saidOf(s) + ` 밑면은 한 변의 길이가 ${a}인 정사각형이고 AE = ${c}이다. 삼각형 CHF와 FH의 중점 M을 나타내었다.`, (S) => { S.put({ M }); S.face(['C', 'H', 'F']); S.seg('C', 'H', 'dash').seg('H', 'F', 'dash').seg('C', 'F').seg('C', 'M', 'hld').seg('G', 'M', 'dash').dot('M').name('M', 'M', 250); S.right('M', 'C', 'F'); });
      return aRadFrac(`그림과 같이 밑면이 한 변의 길이가 ${a}인 정사각형이고 ${sg('AE', c)}인 직육면체 ABCD-EFGH에서 평면 CHF와 평면 FGH가 이루는 각의 크기를 ${th}라 할 때, ${cosT}의 값은?`, x, {
        figure, sq: [`${a}**2`, `${a}**2+2*${c}**2`],
        explain: `FH의 중점을 M이라 하면 GM ⊥ FH이고 CG ⊥ 밑면이므로 삼수선 정리에 의하여 CM ⊥ FH이다. 두 평면이 이루는 각은 ∠CMG이고 GM = ${vh(rad(a, 2, 2))}, CM = ${vh(sqrtFrac(2 * c * c + a * a, 2))}이므로 ${cosT} = GM ÷ CM = ${vh(x)}이다.`
      });
    }, { count: 2 }),
    T('dh-pyramid', '뿔에서 두 면이 이루는 각', '②3', (d, n) => {
      if (n === 0) {
        // 정사각뿔: 밑면 한 변 a, 옆모서리 l → 옆면과 밑면: cos² = a²/(4l² − a²)
        const a = d.pick([2, 4, 6, 8]), l = d.int(a - 1, a + 5);
        if (2 * l * l <= a * a) return null;
        const x = sqrtFrac(a * a, 4 * l * l - a * a);
        if (kindOf(x) !== 'radfrac' || x[0].q.q > 40) return null;
        const s = pyr4(3.6, 3.4), v = s.v, M = lerp3(v.C, v.D, 0.5);
        const figure = solidFig(s, `정사각뿔 A-BCDE의 겨냥도. 밑면의 한 변의 길이는 ${a}, 옆모서리의 길이는 ${l}이다. 밑면의 두 대각선의 교점 H와 모서리 CD의 중점 M을 나타내었다.`, (S) => { S.put({ H: [0, 0, 0], M }); S.seg('A', 'H', 'dash').seg('H', 'M', 'dash').seg('A', 'M', 'hl').dot('H').dot('M').name('H', 'H', 160).name('M', 'M', 300); S.right('H', 'A', 'M'); });
        return aRadFrac(`그림과 같이 밑면의 한 변의 길이가 ${a}, 옆모서리의 길이가 ${l}인 정사각뿔에서 옆면과 밑면이 이루는 각의 크기를 ${th}라 할 때, ${cosT}의 값은?`, x, {
          figure, sq: [`${a}**2`, `4*${l}**2-${a}**2`],
          explain: `꼭짓점 A의 정사영은 밑면의 중심 H이고, 모서리 CD의 중점 M에 대하여 AM ⊥ CD, HM ⊥ CD이므로 θ = ∠AMH이다. HM = ${a / 2}, AM = ${vh(sqrtFrac(4 * l * l - a * a, 4))}이므로 ${cosT} = HM ÷ AM = ${vh(x)}이다.`
        });
      }
      if (n === 1) {
        // 정삼각뿔: 밑면 한 변 a, 옆모서리 l → cos² = a²/(12l² − 3a²)
        const a = d.pick([2, 3, 4, 6]), l = d.int(a, a + 5);
        if (l === a || 3 * l * l <= a * a) return null;
        const x = sqrtFrac(a * a, 12 * l * l - 3 * a * a);
        if (kindOf(x) !== 'radfrac' || x[0].q.q > 40) return null;
        const s = tri3(3.6, 3.2), v = s.v, M = lerp3(v.B, v.C, 0.5), Hh = avg3([v.B, v.C, v.D]);
        const figure = solidFig(s, `밑면이 한 변의 길이가 ${a}인 정삼각형이고 옆모서리의 길이가 모두 ${l}인 삼각뿔 A-BCD. 밑면의 무게중심 H와 모서리 BC의 중점 M을 나타내었다.`, (S) => { S.put({ H: Hh, M }); S.seg('A', 'H', 'dash').seg('H', 'M', 'dash').seg('A', 'M', 'hl').seg('D', 'M', 'dash').dot('H').dot('M').name('H', 'H', 20).name('M', 'M', 270); S.right('H', 'A', 'M'); });
        return aRadFrac(`그림과 같이 밑면이 한 변의 길이가 ${a}인 정삼각형이고 옆모서리의 길이가 모두 ${l}인 삼각뿔 A-BCD에서 옆면 ABC와 밑면 BCD가 이루는 각의 크기를 ${th}라 할 때, ${cosT}의 값은?`, x, {
          figure, sq: [`${a}**2`, `12*${l}**2-3*${a}**2`],
          explain: `옆모서리가 모두 같으므로 A의 정사영 H는 정삼각형 BCD의 무게중심이다. BC의 중점 M에 대하여 AM ⊥ BC, HM ⊥ BC이므로 θ = ∠AMH이다. HM = (1/3) × ${vh(rad(a, 3, 2))}, AM = ${vh(sqrtFrac(4 * l * l - a * a, 4))}이므로 ${cosT} = ${vh(x)}이다.`
        });
      }
      // 정사면체 ABCD, M 은 AD 의 중점: 평면 ABC 와 MBC — cos √6/3, sin √3/3, tan √2/2
      const want = pick(d, ['cos', 'sin', 'tan']), x = { cos: rad(1, 6, 3), sin: rad(1, 3, 3), tan: rad(1, 2, 2) }[want], a = d.pick([2, 4, 6]);
      const s = tetra(3.6), v = s.v, M = lerp3(v.A, v.D, 0.5), Hm = lerp3(v.B, v.C, 0.5);
      const figure = solidFig(s, `한 모서리의 길이가 ${a}인 정사면체 ABCD. M은 모서리 AD의 중점이고 삼각형 MBC와 BC의 중점 H를 나타내었다.`, (S) => { S.put({ M, H: Hm }); S.face(['M', 'B', 'C']); S.seg('M', 'B', 'dash').seg('M', 'C').seg('A', 'H').seg('M', 'H', 'hld').seg('H', 'D', 'dash').dot('M').dot('H').name('M', 'M', 20).name('H', 'H', 270); });
      return aRadFrac(`그림과 같이 모든 모서리의 길이가 ${a}인 정사면체 ABCD에서 모서리 AD의 중점을 M이라 하자. 두 평면 ABC와 MBC가 이루는 예각의 크기를 ${th}라 할 때, ${want === 'cos' ? cosT : want === 'sin' ? sinT : tanT}의 값은?`, x, {
        figure, explain: `BC의 중점 H에 대하여 AH ⊥ BC, MH ⊥ BC이므로 θ = ∠AHM이다. 삼각형 AHD는 AH = DH인 이등변삼각형이므로 HM ⊥ AD이다. AH = ${vh(rad(a, 3, 2))}, AM = ${a / 2}, HM = ${vh(rad(a, 2, 2))}이므로 ${want === 'cos' ? 'cos θ = HM ÷ AH' : want === 'sin' ? 'sin θ = AM ÷ AH' : 'tan θ = AM ÷ HM'} = ${vh(x)}이다.`
      });
    }, { count: 3 }),
    T('dh-three', '이면각과 삼수선 정리 — 길이에서 각, 각에서 길이', '②5', (d, n) => {
      if (n === 0) {
        // 평면 α 밖의 점 A, α 위의 직선 l, 평면 β(A 와 l 로 정해짐), A 에서 l·α 에 내린 수선의 발 P, Q: cos θ = PQ/AP
        const ap = d.int(3, 12), aq = d.int(1, ap - 1), x = sqrtFrac(ap * ap - aq * aq, ap * ap);
        if (kindOf(x) !== 'radfrac') return null;
        const pq = Math.sqrt(ap * ap - aq * aq), sc = 3 / ap;
        const Pp = [1.4, 0, 0], Qp = [1.4 - pq * sc, 0, 0], Ap = [1.4 - pq * sc, 0, aq * sc], V0 = { k: 0.8, ang: 242 };
        const S = sp(Object.assign({ u: fitU([Pp, Qp, Ap, [2.4, -3, 0], [-2, 2, 0]], 200, 150, V0) }, V0)).put({ P: Pp, Q: Qp, A: Ap });
        S.plane([0.2, -0.4, 0], [2.2, 0, 0], [0, 2.4, 0], K.ALPHA, 1);
        S.seg([1.4, -2.6, 0], [1.4, 1.8, 0], 'thin').text([1.4, 2.1, 0], '<tspan style="font-style:italic;font-family:\'MB Math\',serif">l</tspan>');
        S.seg('A', 'P').seg('A', 'Q').seg('Q', 'P', 'dash').right('Q', 'A', 'P').right('P', 'A', [1.4, 1, 0]);
        for (const k of 'APQ') S.dot(k);
        S.name('A', 'A', 90).name('P', 'P', 300).name('Q', 'Q', 200);
        const figure = S.svg(`평면 α 위에 있지 않은 점 A, α 위의 직선 l, A에서 l과 α에 내린 수선의 발 P, Q. AP = ${ap}, AQ = ${aq}.`);
        return aRadFrac(`그림과 같이 평면 ${al} 위에 있지 않은 한 점 A와 ${al} 위의 직선 ${vl}에 의하여 결정되는 평면을 ${be}라 하고, 점 A에서 직선 ${vl}과 평면 ${al}에 내린 수선의 발을 각각 P, Q라 하자. ${sg('AP', ap)}, ${sg('AQ', aq)}일 때, 두 평면 ${al}, ${be}가 이루는 각의 크기 ${th}에 대하여 ${cosT}의 값은?`, x, {
          figure, sq: [`${ap}**2-${aq}**2`, `${ap}**2`],
          explain: `AQ ⊥ α, AP ⊥ l이므로 삼수선 정리에 의하여 QP ⊥ l이다. 따라서 두 평면이 이루는 각은 ∠APQ이고, PQ = √(${ap * ap} − ${aq * aq}) = ${rv(ap * ap - aq * aq)}이므로 ${cosT} = PQ ÷ AP = ${vh(x)}이다.`
        });
      }
      // 사면체: BC = a, 삼각형 ABC 의 넓이 S, 이면각 30° → A 에서 면 BCD 까지 AH = (2S/a) sin 30°
      const a = d.int(2, 8), ae = 2 * d.int(2, 9), S0 = a * ae / 2;
      const Bp = [0, -2, 0], Cp = [0, 2, 0], Dp = [3, 0.7, 0], Ep = [0, 0, 0], Hp = [1.7, 0, 0], Ap = [1.7, 0, 2.3], V0 = { k: 0.8, ang: 242 };
      const S = sp(Object.assign({ u: fitU([Bp, Cp, Dp, Ap], 200, 150, V0) }, V0)).put({ A: Ap, B: Bp, C: Cp, D: Dp, E: Ep, H: Hp });
      S.seg('A', 'B').seg('A', 'C').seg('A', 'D').seg('B', 'D').seg('C', 'D').seg('B', 'C', 'dash').seg('A', 'E', 'dash').seg('E', 'H', 'dash').seg('A', 'H', 'hld').right('H', 'A', 'E').right('E', 'A', 'C');
      for (const k of 'EH') S.dot(k);
      S.name('A', 'A', 90).name('B', 'B', 200).name('C', 'C', 20).name('D', 'D', 290).name('E', 'E', 120).name('H', 'H', 300);
      const figure = S.svg(`사면체 ABCD(BC = ${a}). E는 점 A에서 모서리 BC에 내린 수선의 발, H는 점 A에서 면 BCD에 내린 수선의 발이다.`);
      return aInt(`그림과 같이 ${sg('BC', a)}인 사면체 ABCD가 있다. 점 A에서 모서리 BC에 내린 수선의 발을 E라 하자. 두 평면 ABC, BCD가 이루는 각의 크기가 30°이고 삼각형 ABC의 넓이가 ${S0}일 때, 점 A에서 면 BCD에 내린 수선의 길이는?`, num(ae / 2), {
        figure, value: `2*${S0}/${a}/2`,
        explain: `A에서 면 BCD에 내린 수선의 발을 H라 하면 AE ⊥ BC이므로 삼수선 정리에 의하여 HE ⊥ BC이고, ∠AEH가 두 평면이 이루는 각 30°이다. (1/2) × ${a} × AE = ${S0}에서 AE = ${ae}이므로 AH = AE sin 30° = ${ae / 2}이다.`
      });
    }, { count: 2 }),
    T('dh-cylinder', '원기둥에서 이면각의 탄젠트로 삼각형의 넓이', '②7', (d) => {
      const r = d.int(2, 5), t = d.pick([2, 3]), x = rad(r * r, 1 + t * t), hgt = r * t;
      // 그림: 아랫밑면 중심 O, 지름 AB(y 방향), 윗밑면 둘레 위 C(앞쪽), C 의 수선의 발 H(아랫밑면 둘레의 앞쪽 점)
      const R = 1.6, Hh = R * Math.min(t, 2.2) * 0.9;
      const O = [0, 0, 0], A0 = [0, -R, 0], B0 = [0, R, 0], C0 = [R, 0, Hh], H0 = [R, 0, 0];
      const S = sp({ u: fitU([A0, B0, C0, [-R, 0, Hh], [R, 0, 0], [0, -R, Hh]], 180, 160, { k: 0.6, ang: 215 }), k: 0.6, ang: 215 }).put({ O, A: A0, B: B0, C: C0, H: H0 });
      const t0 = ring(S, [0, 0, 0], R, 'dash');
      S.curve((u) => [R * Math.cos(u), R * Math.sin(u), Hh], 0, 2 * Math.PI, undefined, 64);
      for (const u of [t0, t0 + Math.PI]) S.seg([R * Math.cos(u), R * Math.sin(u), 0], [R * Math.cos(u), R * Math.sin(u), Hh]);
      S.face(['A', 'B', 'C']).seg('A', 'B', 'dash').seg('C', 'A').seg('C', 'B').seg('C', 'O', 'hld').seg('C', 'H', 'dash').seg('O', 'H', 'dash').right('H', 'C', 'O').right('O', 'C', 'B');
      for (const k of 'OABCH') S.dot(k);
      S.name('O', 'O', 160).name('A', 'A', 180).name('B', 'B', 0).name('C', 'C', 200).name('H', 'H', 250);
      const figure = S.svg(`밑면의 반지름의 길이가 ${r}인 원기둥. 아랫밑면의 중심 O, 지름 AB, 윗밑면의 둘레 위의 점 C(AB ⊥ CO), C에서 아랫밑면에 내린 수선의 발 H.`);
      return aRad(`그림과 같이 밑면의 반지름의 길이가 ${r}인 원기둥의 아랫밑면의 중심을 O, 지름을 AB라 하자. 윗밑면의 둘레 위의 점 C에 대하여 ${nb(SG('AB') + ' ⊥ ' + SG('CO'))}이고, 평면 ABC와 아랫밑면이 이루는 각의 크기를 ${th}라 할 때 ${nb(tanT + ' = ' + t)}이다. 삼각형 ABC의 넓이는?`, x, {
        figure, sq: [`${r}**4*(1+${t}**2)`, '1'],
        explain: `C에서 아랫밑면에 내린 수선의 발을 H라 하면 CO ⊥ AB이므로 삼수선 정리에 의하여 HO ⊥ AB이고 θ = ∠COH이다. OH = ${r}, CH = ${r} × ${t} = ${hgt}이므로 CO = ${rv(r * r + hgt * hgt)}이다. 넓이는 (1/2) × ${2 * r} × CO = ${vh(x)}이다.`
      });
    })
  ]);

  // ── 정사영과 그 길이 ──
  B.addTypes(UNIT, 'proj', [
    T('pj-what', '입체에서 점·선분·삼각형의 정사영', '②8', (d, n) => {
      if (n === 0) {
        const s = prismOf(5, circR(5, 2.6), 3.6), top = s.top, bot = s.bot, i = d.int(0, 4), j = (i + d.int(1, 2)) % 5, k2 = (i + 3) % 5;
        const objs = [
          [`점 ${top[i]}`, `점 ${bot[i]}`],
          [`선분 ${top[j]}${bot[i]}`, `선분 ${bot[j]}${bot[i]}`],
          [`선분 ${top[i]}${bot[i]}`, `점 ${bot[i]}`],
          [`삼각형 ${top[i]}${bot[j]}${top[k2]}`, `삼각형 ${bot[i]}${bot[j]}${bot[k2]}`]
        ], [obj, right] = pick(d, objs);
        const wrongPool = [`점 ${top[i]}`, `점 ${bot[j]}`, `선분 ${top[i]}${top[j]}`, `선분 ${bot[i]}${bot[k2]}`, `삼각형 ${bot[i]}${bot[j]}${top[k2]}`, `삼각형 ${top[i]}${top[j]}${top[k2]}`, `선분 ${bot[j]}${bot[k2]}`, `점 ${bot[k2]}`];
        const wrongs = d.shuffle(wrongPool.filter((w) => w !== right && w !== obj)).slice(0, 4);
        return pickRows(d, `그림과 같은 정오각기둥 ${top}-${bot}에서 ${obj}의 평면 ${bot} 위로의 정사영은?`, [[right, true]].concat(wrongs.map((w) => [w, false])), {
          figure: solidFig(s, saidOf(s)), explain: `옆모서리는 밑면에 수직이므로 위 밑면의 꼭짓점 ${top[i]}, ${top[j]}, ${top[k2]}의 정사영은 각각 ${bot[i]}, ${bot[j]}, ${bot[k2]}이다. 따라서 ${obj}의 정사영은 ${right}이다.`
        });
      }
      // 삼각기둥을 A, B, C 를 지나는 평면으로 잘라 낸 입체(옆모서리 위의 높이가 다르다): 평면 DEF 위로의 정사영
      const base = prismOf(3, circR(3, 4), 1), v = base.v, hs = d.shuffle([1.4, 2.4, 3.4]);
      const sol = K.solidOf({ A: [v.A[0], v.A[1], hs[0]], B: [v.B[0], v.B[1], hs[1]], C: [v.C[0], v.C[1], hs[2]], D: v.D, E: v.E, F: v.F }, ['ABC', 'DEF', 'ABED', 'BCFE', 'CADF']);
      const objs = [['점 B', '점 E'], ['점 A', '점 D'], ['선분 AC', '선분 DF'], ['선분 AB', '선분 DE'], ['삼각형 ABC', '삼각형 DEF'], ['선분 BC', '선분 EF']], [obj, right] = pick(d, objs);
      const wrongs = d.shuffle(['점 D', '점 E', '점 F', '선분 DE', '선분 EF', '선분 DF', '삼각형 DEF', '선분 AD', '점 A', '삼각형 ABC'].filter((w) => w !== right && w !== obj)).slice(0, 4);
      return pickRows(d, `그림은 삼각기둥을 세 점 A, B, C를 지나는 평면으로 잘라 낸 입체도형이다. ${obj}의 평면 DEF 위로의 정사영은?`, [[right, true]].concat(wrongs.map((w) => [w, false])), {
        figure: solidFig(sol, '삼각기둥을 세 점 A, B, C를 지나는 평면으로 잘라 낸 입체도형. 아랫면은 삼각형 DEF이고 옆모서리 AD, BE, CF는 아랫면에 수직이다.'),
        explain: `옆모서리 AD, BE, CF가 평면 DEF에 수직이므로 A, B, C의 정사영은 각각 D, E, F이다. 따라서 ${obj}의 정사영은 ${right}이다.`
      });
    }, { count: 2 }),
    T('pj-shape', '원기둥의 정사영이 될 수 있는 모양', '②8', (d) => {
      return pickRows(d, '원기둥 모양의 통조림통을 여러 방향으로 돌려 가며 평행한 빛을 바닥에 수직으로 비출 때, 바닥에 생기는 그림자의 모양이 될 수 없는 것은?', [
        ['삼각형', true], ['원', false], ['직사각형', false], ['정사각형', false], ['직사각형의 마주 보는 두 변에 반타원을 붙인 모양', false]
      ], { explain: '빛이 밑면에 수직이면 그림자는 원, 빛이 밑면에 평행하면 직사각형(밑면의 지름과 높이가 같으면 정사각형), 비스듬하면 직사각형의 양 끝에 반타원을 붙인 모양이 된다. 삼각형은 생기지 않는다.' });
    }),
    T('pj-len', '선분의 길이와 정사영의 길이', '②9', (d, n) => {
      const lead = '선분 AB의 평면 α 위로의 정사영을 선분 A′B′이라 하고, 직선 AB와 평면 α가 이루는 예각의 크기를 θ라 하자.'.replace(/α/g, al).replace('θ', th);
      if (n === 0) {
        const l = 2 * d.int(2, 9), x = rad(l / 2, 3);
        return aRad(`${lead} ${sg('AB', l)}이고 θ = 30°일 때, 선분 A′B′의 길이는?`.replace('θ = 30°', nb(th + ' = 30°')), x, { sq: [`3*${l}**2`, '4'], explain: `A′B′ = AB cos 30° = ${l} × ${vh(rad(1, 3, 2))} = ${vh(x)}이다.` });
      }
      if (n === 1) {
        const deg = pick(d, [30, 45, 60]), l = 2 * d.int(2, 9), lp = vmul(num(l), COS3[deg]);
        return aDeg(`${lead} ${sg('AB', l)}, ${vg('A′B′', vh(lp))}일 때, ${th}의 크기는?`, deg, { explain: `${cosT} = A′B′ ÷ AB = ${vh(COS3[deg])}이므로 ${th} = ${deg}°이다.` });
      }
      if (n === 2) {
        const lp = d.int(2, 15);
        return aInt(`${lead} ${sg('A′B′', lp)}이고 ${nb(th + ' = 60°')}일 때, 선분 AB의 길이는?`, num(2 * lp), { value: `${lp}*2`, explain: `A′B′ = AB cos 60°이므로 AB = ${lp} ÷ (1/2) = ${2 * lp}이다.` });
      }
      // tan θ: AB = l, A′B′ = l′ → tan = √(l² − l′²)/l′ (고르기)
      const l = d.int(3, 12), lp = d.int(1, l - 1), right = vdiv(sqrtFrac(l * l - lp * lp, 1), num(lp));
      const wrongs = d.shuffle([vdiv(num(lp), sqrtFrac(l * l - lp * lp, 1)), num(lp, l), vdiv(sqrtFrac(l * l - lp * lp, 1), num(l)), vdiv(num(l), num(lp)), sqrtFrac(l * l + lp * lp, lp * lp)]);
      return aPick(d, `${lead} ${sg('AB', l)}이고 선분 A′B′의 길이가 ${lp}일 때, ${tanT}의 값은?`, right, wrongs, {
        explain: `${cosT} = ${vh(num(lp, l))}이므로 직각삼각형을 생각하면 높이는 √(${l * l} − ${lp * lp}) = ${rv(l * l - lp * lp)}이다. 따라서 ${tanT} = ${vh(right)}이다.`
      });
    }, { count: 4 }),
    T('pj-in-solid', '입체 속 선분의 정사영의 길이', '②10', (d, n) => {
      if (n === 0) {
        const a = 2 * d.int(2, 5), x = rad(a / 2, 6), s = cuboid(3, 3, 3), v = s.v, M = lerp3(v.D, v.B, 0.5);
        const figure = solidFig(s, `한 모서리의 길이가 ${a}인 정육면체 ABCD-EFGH. 직사각형 DHFB와 선분 AF, DB의 중점 M을 나타내었다.`, (S) => { S.put({ M }); S.face(['D', 'H', 'F', 'B'], 'rgba(37,99,235,0.12)'); S.seg('D', 'B').seg('B', 'F').seg('F', 'H', 'dash').seg('H', 'D', 'dash').seg('A', 'F', 'hl').seg('A', 'M', 'dash').seg('M', 'F', 'hld').dot('M').name('M', 'M', 20); S.right('M', 'A', 'B'); });
        return aRad(`그림과 같이 한 모서리의 길이가 ${a}인 정육면체 ABCD-EFGH에서 선분 AF의 평면 DHFB 위로의 정사영의 길이는?`, x, {
          figure, sq: [`6*${a}**2`, '4'],
          explain: `DB의 중점을 M이라 하면 AM ⊥ DB, AM ⊥ BF이므로 AM ⊥ 평면 DHFB이고 A의 정사영은 M이다. 정사영은 선분 MF이고 BM = ${vh(rad(a, 2, 2))}, BF = ${a}이므로 MF = √(BM² + BF²) = ${vh(x)}이다.`
        });
      }
      const a = d.pick([3, 6, 12, 15]), x = rad(a, 3, 9);
      if (kindOf(x) !== 'radfrac') return null;
      const s = tetra(3.6), v = s.v, G = avg3([v.A, v.B, v.C]), Hc = avg3([v.B, v.C, v.D]), M = lerp3(v.B, v.C, 0.5), G2 = lerp3(Hc, M, 1 / 3);
      const figure = solidFig(s, `한 모서리의 길이가 ${a}인 정사면체 ABCD. G는 삼각형 ABC의 무게중심이고 선분 AG를 나타내었다.`, (S) => { S.put({ G, M }); S.seg('A', 'M', 'thin').seg('A', 'G', 'hl').dot('G').name('G', 'G', 330).dot('M').name('M', 'M', 270); });
      void G2;
      return aRadFrac(`그림과 같이 한 모서리의 길이가 ${a}인 정사면체 ABCD에서 삼각형 ABC의 무게중심을 G라 할 때, 선분 AG의 평면 BCD 위로의 정사영의 길이는?`, x, {
        figure, sq: [`${a}**2`, '27'],
        explain: `BC의 중점을 M이라 하면 AG = (2/3)AM = ${vh(rad(a, 3, 3))}이다. A의 정사영 H는 정삼각형 BCD의 무게중심이고 직선 AM과 평면 BCD가 이루는 각에서 cos = HM ÷ AM = 1/3이므로 정사영의 길이는 AG × (1/3) = ${vh(x)}이다.`
      });
    }, { count: 2 }),
    T('pj-perimeter', '정사영의 둘레는 l cos θ 가 아니다', '②12', (d) => {
      const p = d.int(2, 8), q = 2 * d.int(1, 5);
      if (p === q) return null;
      return aInt(`평면 ${al} 위에 가로의 길이가 ${p}, 세로의 길이가 ${q}인 직사각형 F가 있고, 가로는 두 평면 ${al}, ${be}의 교선과 평행하다. 두 평면 ${al}, ${be}가 이루는 각의 크기가 60°일 때, 직사각형 F의 평면 ${be} 위로의 정사영의 둘레의 길이는?`, num(2 * p + q), {
        value: `2*${p}+2*${q}/2`,
        explain: `교선과 평행한 가로는 정사영해도 길이가 ${josa(p, "으로/로")} 그대로이고, 세로는 ${q} × cos 60° = ${josa(q / 2, "으로/로")} 줄어든다. 둘레는 2 × (${p} + ${q / 2}) = ${2 * p + q}이다. 직사각형 F의 둘레 ${2 * (p + q)}에 cos 60°를 곱한 ${josa(p + q, '과/와')}는 다르다.`
      });
    }),
    T('pj-section', '정육면체를 평면으로 자른 단면의 모양', '②25', (d, n) => {
      if (n === 0) {
        const no = pick(d, ['둔각삼각형', '직각삼각형']), yes = d.shuffle(['정삼각형', '이등변삼각형', '예각삼각형', '직사각형', '오각형', '정육각형', '사다리꼴']).slice(0, 4);
        return pickRows(d, '정육면체를 한 평면으로 자를 때 생기는 단면의 모양이 될 수 없는 것은?', [[no, true]].concat(yes.map((w) => [w, false])), {
          explain: '단면이 삼각형이면 세 꼭짓점이 한 꼭짓점에 모인 세 모서리 위에 있고, 그 길이를 a, b, c라 하면 세 변은 √(a² + b²), √(b² + c²), √(c² + a²)이다. 어느 두 변의 제곱의 합도 나머지 변의 제곱보다 크므로 예각삼각형만 생긴다. 직각삼각형과 둔각삼각형은 생기지 않는다.'
        });
      }
      const s = cuboid(3, 3, 3); s.word = 'cube';
      const figure = solidFig(s, '정육면체 ABCD-EFGH의 겨냥도. 대각선 AG를 나타내었다.', (S) => { S.seg('A', 'G', 'hld'); });
      return pickRows(d, '그림과 같은 정육면체를 대각선 AG에 수직인 평면으로 자를 때, 단면의 모양이 될 수 있는 것은?', [
        ['정삼각형', true], ['직사각형', false], ['정사각형', false], ['직각삼각형', false], ['사다리꼴', false]
      ], { figure, explain: 'AG에 수직인 평면은 꼭짓점 A에 모인 세 모서리를 같은 길이에서 자르거나, 여섯 모서리를 자른다. 그래서 단면은 정삼각형이거나 육각형이다.' });
    }, { count: 2 }),
    T('pj-hexagon', '정육면체의 단면이 정육각형일 때의 넓이', '②26', (d) => {
      const a = d.pick([1, 3, 5, 7]), x = rad(3 * a * a, 3, 4);
      return aRadFrac(`한 모서리의 길이가 ${a}인 정육면체를 한 평면으로 자른 단면이 정육각형일 때, 이 정육각형의 넓이는?`, x, {
        sq: [`27*${a}**4`, '16'],
        explain: `단면이 정육각형이면 꼭짓점은 여섯 모서리의 중점이고, 한 변은 면의 대각선의 절반인 ${vh(rad(a, 2, 2))}이다. 넓이는 6 × (√3/4) × (한 변)² = ${vh(x)}이다.`
      });
    }),
    T('pj-views', '정면도·평면도로 입체 알아보기', '②27', (d) => {
      // 그림: 평면도와 정면도(가로로 나란히)
      const kinds = [
        ['두 원기둥을 위아래로 쌓은 입체', 'cyl2'], ['원기둥 위에 원뿔을 올린 입체', 'cylcone'], ['원뿔대', 'frus'], ['정사각뿔', 'pyr'], ['정사각기둥 위에 정사각뿔을 올린 입체', 'boxpyr']
      ];
      const [right, key] = pick(d, kinds);
      const b = Board(), cx = 60, cy = 52, fx = 190;
      // 평면도
      if (key === 'cyl2' || key === 'frus') { b.disk([cx, cy], 40, 'fill:#fff8e1'); b.disk([cx, cy], 20, 'fill:#fff8e1'); }
      else if (key === 'cylcone') { b.disk([cx, cy], 36, 'fill:#fff8e1'); b.dot([cx, cy]); }
      else { b.poly([[cx - 36, cy - 36], [cx + 36, cy - 36], [cx + 36, cy + 36], [cx - 36, cy + 36]], 'fill:#fff8e1'); b.seg([cx - 36, cy - 36], [cx + 36, cy + 36], 'thin'); b.seg([cx + 36, cy - 36], [cx - 36, cy + 36], 'thin'); if (key === 'boxpyr') b.dot([cx, cy]); }
      // 정면도
      if (key === 'cyl2') { b.poly([[fx - 40, 92], [fx + 40, 92], [fx + 40, 62], [fx - 40, 62]], 'fill:#fff8e1'); b.poly([[fx - 20, 62], [fx + 20, 62], [fx + 20, 22], [fx - 20, 22]], 'fill:#fff8e1'); }
      else if (key === 'frus') b.poly([[fx - 40, 92], [fx + 40, 92], [fx + 20, 22], [fx - 20, 22]], 'fill:#fff8e1');
      else if (key === 'cylcone') { b.poly([[fx - 36, 92], [fx + 36, 92], [fx + 36, 56], [fx - 36, 56]], 'fill:#fff8e1'); b.poly([[fx - 36, 56], [fx + 36, 56], [fx, 14]], 'fill:#fff8e1'); }
      else if (key === 'pyr') b.poly([[fx - 36, 92], [fx + 36, 92], [fx, 18]], 'fill:#fff8e1');
      else { b.poly([[fx - 36, 92], [fx + 36, 92], [fx + 36, 58], [fx - 36, 58]], 'fill:#fff8e1'); b.poly([[fx - 36, 58], [fx + 36, 58], [fx, 18]], 'fill:#fff8e1'); }
      b.text([cx, 108], '평면도', { plain: true }); b.text([fx, 108], '정면도', { plain: true });
      const said = { cyl2: '평면도는 중심이 같은 큰 원과 작은 원, 정면도는 넓은 직사각형 위에 좁은 직사각형을 얹은 모양', frus: '평면도는 중심이 같은 큰 원과 작은 원, 정면도는 아랫변이 윗변보다 긴 사다리꼴', cylcone: '평면도는 가운데 점이 찍힌 원, 정면도는 직사각형 위에 이등변삼각형을 얹은 모양', pyr: '평면도는 두 대각선을 그은 정사각형, 정면도는 이등변삼각형', boxpyr: '평면도는 두 대각선을 그은 정사각형, 정면도는 직사각형 위에 이등변삼각형을 얹은 모양' }[key];
      const figure = b.svg(said);
      const rows = kinds.map(([w]) => [w, w === right]);
      return pickRows(d, '어떤 입체도형을 위에서 수직으로 내려다본 정사영(평면도)과 앞에서 본 정사영(정면도)이 그림과 같다. 이 입체도형으로 알맞은 것은?', rows, {
        figure, explain: `평면도와 정면도는 입체도형을 위와 앞에서 본 정사영이다. 두 그림을 함께 보면 ${right}이다.`
      });
    })
  ]);

  // ── 정사영의 넓이와 그림자 ──
  B.addTypes(UNIT, 'area', [
    T('ar-basic', '도형의 넓이와 정사영의 넓이', '②13', (d, n) => {
      const lead = `평면 ${be} 위에 있는 도형의 넓이를 S, 이 도형의 평면 ${al} 위로의 정사영의 넓이를 S′이라 하고, 두 평면 ${al}, ${be}가 이루는 각의 크기를 ${th}라 하자.`;
      if (n === 0) {
        const deg = pick(d, [30, 45, 60]), S0 = 4 * d.int(1, 6), Sp = vmul(num(S0), COS3[deg]);
        return aDeg(`${lead} ${nb('S = ' + S0)}, ${nb("S′ = " + vh(Sp))}일 때, ${th}의 크기는?`, deg, { explain: `${cosT} = S′ ÷ S = ${vh(COS3[deg])}이므로 ${th} = ${deg}°이다.` });
      }
      if (n === 1) {
        const Sp = d.int(2, 12), x = rad(Sp, 2);
        return aRad(`${lead} ${nb("S′ = " + Sp)}, ${nb(th + ' = 45°')}일 때, S의 값은?`, x, { sq: [`2*${Sp}**2`, '1'], explain: `S′ = S cos 45°이므로 S = ${Sp} ÷ ${vh(rad(1, 2, 2))} = ${vh(x)}이다.` });
      }
      // 직각삼각형(빗변이 아닌 두 변 a, b)과 30°
      const [a, b] = pick(d, [[3, 4], [6, 8], [5, 12], [4, 6], [8, 6], [12, 4], [2, 6], [4, 10]]), x = rad(a * b, 3, 4);
      if (kindOf(x) !== 'rad') return null;
      return aRad(`평면 ${al} 위에 빗변이 아닌 두 변의 길이가 ${a}, ${b}인 직각삼각형 ABC가 있다. 두 평면 ${al}, ${be}가 이루는 각의 크기가 30°일 때, 삼각형 ABC의 평면 ${be} 위로의 정사영의 넓이는?`, x, {
        sq: [`(${a}*${b}/2)**2*3`, '4'], explain: `삼각형 ABC의 넓이는 (1/2) × ${a} × ${b} = ${a * b / 2}이므로 정사영의 넓이는 ${a * b / 2} × cos 30° = ${vh(x)}이다.`
      });
    }, { count: 3 }),
    T('ar-cyl-cut', '원기둥을 비스듬히 자른 단면의 넓이', '②14', (d, n) => {
      const r = d.int(2, 7);
      if (n === 0) return aInt(`밑면의 반지름의 길이가 ${r}인 원기둥을 밑면과 60°의 각을 이루는 평면으로 자를 때 생기는 단면의 넓이가 ${V('k')}π일 때, 상수 ${V('k')}의 값은? (단, 단면은 원기둥의 옆면과만 만난다.)`, num(2 * r * r), {
        value: `${r}**2*2`, explain: `단면의 밑면 위로의 정사영이 밑면(넓이 ${r * r}π)이므로 (단면의 넓이) × cos 60° = ${r * r}π, 단면의 넓이는 ${2 * r * r}π이다. 따라서 k = ${2 * r * r}이다.`
      });
      const x = rad(r * r, 2);
      return aRad(`밑면의 반지름의 길이가 ${r}인 원기둥을 밑면과 45°의 각을 이루는 평면으로 자를 때 생기는 단면의 넓이가 ${V('k')}π일 때, 상수 ${V('k')}의 값은? (단, 단면은 원기둥의 옆면과만 만난다.)`, x, {
        sq: [`2*${r}**4`, '1'], explain: `단면의 밑면 위로의 정사영이 밑면(넓이 ${r * r}π)이므로 (단면의 넓이) × cos 45° = ${r * r}π, 단면의 넓이는 ${vh(x)}π이다.`
      });
    }, { count: 2 }),
    T('ar-ratio', '정사영의 넓이로 두 평면이 이루는 각', '②15', (d, n) => {
      const X = d.int(2, 6), Y = d.int(2, 6), Z = 2 * d.int(1, 3), s = cuboid(X, Y, Z), v = s.v;
      if (n === 0) {
        // 점 K 는 BF 의 중점, 삼각형 CEK 와 그 정사영 GEF
        const Kp = lerp3(v.B, v.F, 0.5), cr = cross3(sub3(v.C, v.E), sub3(Kp, v.E)), area2 = Math.round(dot3(cr, cr)), x = sqrtFrac(X * X * Y * Y, area2);
        if (kindOf(x) !== 'radfrac' || x[0].q.q > 40 || x[0].m > 60) return null;
        const figure = solidFig(s, saidOf(s) + ` AD = ${X}, AB = ${Y}, AE = ${Z}. K는 모서리 BF의 중점이고 삼각형 CEK를 나타내었다.`, (S) => { S.put({ K: Kp }); S.face(['C', 'E', 'K']); S.seg('C', 'E', 'dash').seg('E', 'K').seg('K', 'C').dot('K').name('K', 'K', 0); });
        // |EC × EK|² = (Y·Z/2 − …)² … 를 성분으로: EC = (−X, Y, Z), EK = (0, Y, Z/2)
        return aRadFrac(`그림과 같이 ${sg('AD', X)}, ${sg('AB', Y)}, ${sg('AE', Z)}인 직육면체 ABCD-EFGH에서 모서리 BF의 중점을 K라 하자. 평면 CEK와 평면 EFGH가 이루는 각의 크기를 ${th}라 할 때, ${cosT}의 값은?`, x, {
          figure, sq: [`${X}**2*${Y}**2`, `(${Y}*${Z}/2)**2+(${X}*${Z}/2)**2+(${X}*${Y})**2`],
          explain: `삼각형 CEK의 평면 EFGH 위로의 정사영은 삼각형 GEF이고 넓이는 (1/2) × ${Y} × ${X}이다. 삼각형 CEK의 넓이를 구하면 (정사영의 넓이) = (삼각형 CEK의 넓이) × cos θ에서 ${cosT} = ${vh(x)}이다.`
        });
      }
      // M, N 은 AD, FG 의 중점 — 평행사변형 BNHM 과 그 정사영 FNHI(I 는 EH 의 중점)
      const M = lerp3(v.A, v.D, 0.5), Np = lerp3(v.F, v.G, 0.5), I = lerp3(v.E, v.H, 0.5);
      const cr = cross3(sub3(Np, v.B), sub3(M, v.B)), area2 = Math.round(4 * dot3(cr, cr)), x = sqrtFrac(X * X * Y * Y, area2);
      if (kindOf(x) !== 'radfrac' || x[0].q.q > 40 || x[0].m > 60) return null;
      const figure = solidFig(s, saidOf(s) + ` AD = ${X}, AB = ${Y}, AE = ${Z}. M, N은 모서리 AD, FG의 중점이고 사각형 BNHM을 나타내었다.`, (S) => { S.put({ M, N: Np, I }); S.face(['B', 'N', 'H', 'M']); S.seg('B', 'N').seg('N', 'H', 'dash').seg('H', 'M', 'dash').seg('M', 'B').dot('M').dot('N').name('M', 'M', 100).name('N', 'N', 330); });
      void I;
      return aRadFrac(`그림과 같이 ${sg('AD', X)}, ${sg('AB', Y)}, ${sg('AE', Z)}인 직육면체 ABCD-EFGH에서 두 모서리 AD, FG의 중점을 각각 M, N이라 하자. 사각형 BNHM과 밑면 EFGH가 이루는 각의 크기를 ${th}라 할 때, ${cosT}의 값은?`, x, {
        figure, sq: [`${X}**2*${Y}**2`, `4*(${Y}*${Z})**2+(${X}*${Z})**2+(${X}*${Y})**2`],
        explain: `EH의 중점을 I라 하면 사각형 BNHM의 밑면 위로의 정사영은 평행사변형 FNHI이고 넓이는 (${X}/2) × ${Y}이다. 사각형 BNHM(평행사변형)의 넓이를 구해 (정사영의 넓이) ÷ (BNHM의 넓이)를 셈하면 ${cosT} = ${vh(x)}이다.`
      });
    }, { count: 2 }),
    T('ar-tent', '이면각으로 기운 면의 넓이 — 옆넓이', '②16', (d, n) => {
      const a = d.int(2, 8);
      if (n === 0) return aInt(`밑면이 한 변의 길이가 ${a} m인 정사각형이고, 각 옆면과 밑면이 이루는 각의 크기가 60°인 정사각뿔 모양의 텐트가 있다. 이 텐트의 옆넓이는 몇 m²인가?`, num(2 * a * a), {
        unit: 'm²', value: `${a}**2*2`, explain: `네 옆면의 밑면 위로의 정사영은 밑면 전체이므로 (옆넓이) × cos 60° = ${a * a}, 옆넓이는 ${2 * a * a} m²이다.`
      });
      const x = rad(a * a, 2);
      return aRad(`밑면이 한 변의 길이가 ${a} m인 정사각형이고, 각 옆면과 밑면이 이루는 각의 크기가 45°인 정사각뿔 모양의 텐트가 있다. 이 텐트의 옆넓이는 몇 m²인가?`, x, {
        unit: 'm²', sq: [`2*${a}**4`, '1'], explain: `네 옆면의 밑면 위로의 정사영은 밑면 전체이므로 (옆넓이) × cos 45° = ${a * a}, 옆넓이는 ${vh(x)} m²이다.`
      });
    }, { count: 2 }),
    T('ar-solid', '입체 속 다각형의 정사영의 넓이', '②17', (d, n) => {
      if (n === 0) {
        // AD, BD, CD 가 서로 수직(AD = p, BD = q, CD = r): 삼각형 BCD 의 평면 ABC 위로의 정사영 = (qr/2)² ÷ (삼각형 ABC 의 넓이)
        const [p, q, r] = d.shuffle(pick(d, [[1, 1, 2], [1, 2, 3], [1, 3, 4], [2, 3, 5], [1, 4, 5], [3, 4, 7]]).slice()), S2 = p * p * q * q + q * q * r * r + r * r * p * p, rt0 = Math.round(Math.sqrt(S2));
        const x = num(q * q * r * r, 2 * rt0);
        if (kindOf(x) === 'int') return null;
        const Dp = [0, 0, 0], Bp = [2.6, -0.4, 0], Cp = [-0.4, 3, 0], Ap = [0, 0, 2.6];
        const S = sp({ u: fitU([Dp, Bp, Cp, Ap], 180, 140, { k: 0.6, ang: 215 }), k: 0.6, ang: 215 }).put({ A: Ap, B: Bp, C: Cp, D: Dp });
        S.face(['B', 'C', 'D'], 'rgba(37,99,235,0.12)').seg('A', 'B').seg('A', 'C').seg('B', 'C').seg('A', 'D', 'dash').seg('B', 'D', 'dash').seg('C', 'D', 'dash').right('D', 'A', 'B').right('D', 'B', 'C').right('D', 'C', 'A');
        S.name('A', 'A', 90).name('B', 'B', 250).name('C', 'C', 340).name('D', 'D', 160);
        const figure = S.svg(`사면체 ABCD. AD, BD, CD는 서로 수직이고 AD = ${p}, BD = ${q}, CD = ${r}이다.`);
        return aFrac(`그림과 같이 ${sg('AD', p)}, ${sg('BD', q)}, ${sg('CD', r)}이고 세 모서리 AD, BD, CD가 서로 수직인 사면체 ABCD에서 삼각형 BCD의 평면 ABC 위로의 정사영의 넓이는?`, x, {
          figure, value: `(${q}*${r}/2)**2/((${p}**2*${q}**2+${q}**2*${r}**2+${r}**2*${p}**2)**0.5/2)`,
          explain: `AD ⊥ 평면 BCD이므로 삼각형 ABC의 평면 BCD 위로의 정사영은 삼각형 DBC이다. 두 평면이 이루는 각을 θ라 하면 cos θ = (삼각형 BCD의 넓이) ÷ (삼각형 ABC의 넓이) = ${vh(num(q * r, 2))} ÷ ${vh(num(rt0, 2))}이다. 구하는 넓이는 ${vh(num(q * r, 2))} × cos θ = ${vh(x)}이다.`
        });
      }
      if (n === 1) {
        const a = d.int(1, 5), x = rad(a * a, 3, 6), s = cuboid(3, 3, 3), v = s.v, Pp = avg3([v.A, v.F, v.C]);
        const figure = solidFig(s, `한 모서리의 길이가 ${a}인 정육면체 ABCD-EFGH. 삼각형 ABC와 정삼각형 AFC를 나타내었다.`, (S) => { S.put({ P: Pp }); S.face(['A', 'B', 'C'], 'rgba(37,99,235,0.12)'); S.face(['A', 'F', 'C']); S.seg('A', 'C').seg('A', 'F').seg('F', 'C').seg('B', 'P', 'dash').dot('P').name('P', 'P', 250); });
        return aRadFrac(`그림과 같이 한 모서리의 길이가 ${a}인 정육면체 ABCD-EFGH에서 삼각형 ABC의 평면 AFC 위로의 정사영의 넓이는?`, x, {
          figure, sq: [`${a}**4`, '12'],
          explain: `B, A, C, F는 B에 모인 세 모서리가 같은 사면체의 꼭짓점이므로 B의 평면 AFC 위로의 정사영 P는 정삼각형 AFC의 무게중심이다. 정사영은 삼각형 APC이고 넓이는 정삼각형 AFC(한 변 ${vh(rad(a, 2))})의 1/3인 ${vh(x)}이다.`
        });
      }
      // 정사각뿔(모든 모서리 a), G 는 삼각형 ACD 의 무게중심: 삼각형 GCD 의 밑면 위로의 정사영 넓이 a²/12
      const a = d.pick([3, 4, 5, 7]), x = num(a * a, 12), s = pyr4(3.6, 2.6), v = s.v, G = avg3([v.A, v.C, v.D]), M = lerp3(v.C, v.D, 0.5), O = [0, 0, 0], G2 = lerp3(O, M, 2 / 3);
      const figure = solidFig(s, `모든 모서리의 길이가 ${a}인 정사각뿔 A-BCDE. G는 삼각형 ACD의 무게중심이고 삼각형 GCD와 G의 밑면 위로의 정사영 G′을 나타내었다.`, (S) => { S.put({ G, M, H: O, J: G2 }); S.face(['G', 'C', 'D']); S.seg('G', 'C').seg('G', 'D').seg('G', 'J', 'dash').seg('J', 'C', 'dash').seg('J', 'D', 'dash').dot('G').dot('J').name('G', 'G', 170).name('J', 'G′', 205); });
      return aFrac(`그림과 같이 모든 모서리의 길이가 ${a}인 정사각뿔 A-BCDE에서 삼각형 ACD의 무게중심을 G라 할 때, 삼각형 GCD의 평면 BCDE 위로의 정사영의 넓이는?`, x, {
        figure, value: `${a}*(${a}/2/3)/2`,
        explain: `CD의 중점을 M, A의 정사영(밑면의 중심)을 O라 하면 AM의 정사영은 OM이고, AG : GM = 2 : 1이므로 G의 정사영 G′은 OG′ : G′M = 2 : 1인 점이다. G′M = (1/3) × ${vh(num(a, 2))}이므로 넓이는 (1/2) × ${a} × G′M = ${vh(x)}이다.`
      });
    }, { count: 3 }),
    T('ar-shadow-rule', '비스듬한 빛의 그림자 — 원리의 빈칸', '②20', (d) => {
      const box = lines([`길이가 ${vl}인 막대가 빛의 진행 방향에 수직이고 지면과 이루는 각의 크기가 ${th}일 때 막대의 그림자의 길이를 ${vl}′이라 하면, ${cosT} = (㉠)이므로 ${vl}′ = (㉡)이다.`, `같은 원리로 넓이가 S인 도형이 빛에 수직일 때 그림자의 넓이를 S′이라 하면 S′ = (㉢)이다.`]);
      const l = vl, lp = vl + '′';
      return pickRows(d, '다음은 빛이 지면을 비스듬히 비출 때 그림자의 길이와 넓이를 구하는 원리이다. ㉠, ㉡, ㉢에 알맞은 것을 차례로 나열한 것은?', [
        [`${frac(l, lp)}, ${frac(l, cosT)}, ${frac('S', cosT)}`, true],
        [`${frac(lp, l)}, ${l} ${cosT}, S ${cosT}`, false],
        [`${frac(l, lp)}, ${l} ${cosT}, S ${cosT}`, false],
        [`${frac(lp, l)}, ${frac(l, cosT)}, ${frac('S', cosT)}`, false],
        [`${frac(l, lp)}, ${frac(l, cosT)}, S ${cosT}`, false]
      ], { figure: box, explain: '막대는 빛에 수직이므로 막대가 그림자의 정사영이다. 그래서 l = l′ cos θ, 곧 cos θ = l/l′, l′ = l/cos θ이다. 넓이도 S = S′ cos θ이므로 S′ = S/cos θ이다.' });
    }),
    T('ar-ball', '구의 그림자의 넓이', '②21', (d, n) => {
      const r = d.int(2, 12);
      if (n === 0) return aInt(`햇빛이 지면과 30°의 각을 이루면서 반지름의 길이가 ${r} cm인 공을 비추고 있다. 지면에 생기는 공의 그림자의 넓이가 ${V('k')}π cm²일 때, 상수 ${V('k')}의 값은? (단, 공은 구로 생각한다.)`, num(2 * r * r), {
        value: `${r}**2*2`, explain: `공의 중심을 지나고 햇빛에 수직인 단면(넓이 ${r * r}π)은 그림자의 햇빛 방향 정사영이고, 단면과 지면이 이루는 각은 90° − 30° = 60°이다. (그림자의 넓이) × cos 60° = ${r * r}π이므로 그림자의 넓이는 ${2 * r * r}π cm²이다.`
      });
      const x = rad(r * r, 2);
      return aRad(`햇빛이 지면과 45°의 각을 이루면서 반지름의 길이가 ${r} cm인 공을 비추고 있다. 지면에 생기는 공의 그림자의 넓이가 ${V('k')}π cm²일 때, 상수 ${V('k')}의 값은? (단, 공은 구로 생각한다.)`, x, {
        sq: [`2*${r}**4`, '1'], explain: `햇빛에 수직인 공의 단면(넓이 ${r * r}π)과 지면이 이루는 각은 45°이므로 (그림자의 넓이) × cos 45° = ${r * r}π, 그림자의 넓이는 ${vh(x)}π cm²이다.`
      });
    }, { count: 2 }),
    T('ar-plate', '기운 판의 그림자 — 빛에 수직인 평면을 거쳐', '②22', (d, n) => {
      if (n === 0) {
        // 차광막: 지면과 30°, 햇빛은 차광막 반대쪽에서 지면과 30° → 그림자 = S cos 30° / cos 60° = S√3
        const S0 = d.int(2, 15), x = rad(S0, 3);
        // 옆에서 본 그림: 차광막 PT(지면과 30°, 왼쪽 위로), 햇빛은 오른쪽 위에서 지면과 30°로 — T 를 스치는 빛이 지면의 T′ 에 닿는다.
        const L = 80, P = [220, 100], T0 = [P[0] - L * Math.cos(30 * RAD), P[1] - L * Math.sin(30 * RAD)], Tp = [P[0] - 2 * L * Math.cos(30 * RAD), P[1]];
        const ray = (q) => { const far = 64; return [q[0] + far * Math.cos(30 * RAD), q[1] - far * Math.sin(30 * RAD)]; };
        const b = Board();
        b.seg([Tp[0] - 24, P[1]], [P[0] + 40, P[1]]);
        b.seg(Tp, P, undefined, 'stroke:#6b7280;stroke-width:4');
        b.seg(ray(T0), Tp, 'thin', 'stroke:#d97706'); b.seg(ray(P), P, 'thin', 'stroke:#d97706');
        b.seg(P, T0, undefined, 'stroke:#1d4ed8;stroke-width:2.6');
        b.angle(P, 150, 180, '30°', { d: 40 }); b.angle(Tp, 0, 30, '30°', { d: 40 });
        b.text([(Tp[0] + P[0]) / 2, P[1] + 13], '그림자', { plain: true }); b.text([T0[0] + 6, T0[1] - 13], '차광막', { plain: true }); b.text([ray(P)[0] + 6, ray(P)[1] - 10], '햇빛', { plain: true });
        const figure = b.svg('옆에서 본 그림: 지면 위에 차광막이 지면과 30°를 이루며 서 있고, 햇빛은 차광막의 반대쪽에서 지면과 30°를 이루며 비춘다. 차광막의 그림자가 지면에 생긴다.');
        return aRad(`그림과 같이 해변에 세워 놓은 차광막에 햇빛이 지면과 30°의 각을 이루면서 비추고 있다. 차광막과 지면이 이루는 각의 크기가 30°이고 차광막의 넓이가 ${S0}일 때, 지면에 생기는 차광막의 그림자의 넓이는? (단, 햇빛의 방향과 차광막의 기운 방향은 그림과 같이 한 평면 위에 있다.)`, x, {
          figure, sq: [`3*${S0}**2`, '1'],
          explain: `차광막과 그림자를 햇빛에 수직인 평면 위로 정사영하면 같은 도형이 된다. 햇빛에 수직인 평면과 차광막이 이루는 각은 30°, 지면이 이루는 각은 60°이므로 ${S0} × cos 30° = (그림자의 넓이) × cos 60°, 그림자의 넓이는 ${vh(x)}이다.`
        });
      }
      // 과녁: 지면에 수직, 해를 마주 봄, 햇빛과 지면 deg → 그림자 = πr² cos deg / sin deg
      const deg = pick(d, [30, 45, 60]), r = d.int(1, 3), right = vmul(num(r * r), vdiv(COS3[deg], SIN3[deg]));
      const wrongs = d.shuffle([vmul(num(r * r), vdiv(SIN3[deg], COS3[deg])), vmul(num(r * r), COS3[deg]), vmul(num(r * r), SIN3[deg]), num(r * r), num(2 * r * r), vmul(num(r * r), rad(1, 3)), vmul(num(r * r), rad(1, 3, 3)), vmul(num(r * r), rad(1, 2))]);
      return aPick(d, `양궁장에 반지름의 길이가 ${r} m인 원 모양의 과녁이 지면에 수직으로 세워져 해를 정면으로 마주 보고 있다. 햇빛이 지면과 ${deg}°의 각을 이룰 때, 지면에 생기는 과녁의 그림자의 넓이를 ${V('k')}π m²라 하자. 상수 ${V('k')}의 값은?`, right, wrongs, {
        explain: `과녁과 그림자를 햇빛에 수직인 평면 위로 정사영하면 같은 도형이 된다. 그 평면과 과녁이 이루는 각은 ${deg}°, 지면이 이루는 각은 ${90 - deg}°이므로 ${r * r}π × cos ${deg}° = (그림자의 넓이) × cos ${90 - deg}°, k = ${vh(right)}이다.`
      });
    }, { count: 2 })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
