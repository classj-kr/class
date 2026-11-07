// 고등학교 기하 Ⅰ-3 쌍곡선(11-4-3) — 뒤쪽 묶음
// (두 초점까지의 거리, 쌍곡선의 접선의 방정식, 곡선 밖의 점에서 그은 접선과 점근선, 이차곡선).
// 싣는 기준과 뺀 것은 11-4-3a.js 머리 주석에, 꼴마다의 판정은 references/textbooks/수학/_분석/11-4-3/싣기_대조표.md 에 있다.
// 접선은 교과서대로 공식(y = mx ± √(a²m² − b²), x₁x/a² − y₁y/b² = ±1)과 판별식으로 구한다. 음함수의 미분법(미적분Ⅱ)은 쓰지 않는다.
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, N, C, inline } = B.kit;
  const { MINUS, Q, qmul, qsub, qadd, qdiv, gcd, tx, V, sup, nb, poly, rt, grp, sqParts, radText } = B.kit.mid;
  const { jh, qAns } = B.kit.hs;
  const K = B.kit.u1143;
  const { UNIT, CIR, T, num, jn, nj, isSq, sqFree, lcm, rad, surd, surdKey, surdH, X, Y, X2, Y2, va, vb, vc, vk, vm, over, hypH, ellH, genH, symH, lineH,
    normLine, stdLine, pmLine, pt, bar, radPos, vals, pickOne, rowsFig, pickSets, hypPlot, TRI, PTS } = K;
  const tl = (n, pair) => josa(Math.abs(n), pair).slice(String(Math.abs(n)).length);   // 정수 뒤 토씨만
  const sgn = (n) => (n < 0 ? ' ' + MINUS + ' ' : ' + ');                              // 덧붙이는 항의 부호
  // 기울기 m(정수)인 직선과 y절편 ±(글): y = mx ± h
  const pmTan = (m, h) => nb(Y + ' = ' + poly([[m, X]]) + ' ± ' + h);
  const isInt = (q) => q.q === 1;

  // ── 두 초점까지의 거리 ──
  B.addTypes(UNIT, 'focus', [
    // ①26 PF′ − PF = 2a 에 비를 넣어 두 길이 → 삼각형 PF′F 의 둘레
    T('focus-ratio', '두 초점까지 거리의 비로 삼각형의 둘레', '①26', (d) => {
      const [a, b, c] = d.pick(TRI.filter(([x, y]) => x <= 12 && y <= 12)), [m, k] = d.pick([[2, 1], [3, 1], [3, 2], [4, 3], [5, 3], [5, 2], [4, 1], [5, 4]]);
      const PF = 2 * a * k / (m - k), PFp = 2 * a * m / (m - k);
      if (!Number.isInteger(PF) || PF < c - a) return null;
      return N(`쌍곡선 ${hypH(a * a, b * b, 1)}의 두 초점 F, F′과 이 쌍곡선 위의 점 P에 대하여 ${nb(bar('PF′') + ' : ' + bar('PF') + ' = ' + m + ' : ' + k)}일 때, 삼각형 PF′F의 둘레의 길이는?`, PF + PFp + 2 * c, {
        explain: `주축의 길이가 ${2 * a}이고 ${bar('PF′')}이 더 길므로 ${nb(bar('PF′') + ' ' + MINUS + ' ' + bar('PF') + ' = ' + 2 * a)}이다. ${nb(bar('PF′') + ' = ' + m + V('t'))}, ${nb(bar('PF') + ' = ' + (k === 1 ? '' : k) + V('t'))}로 놓으면 ${m - k === 1 ? '' : m - k}${V('t')} = ${2 * a}이므로 ${bar('PF′')} = ${PFp}, ${bar('PF')} = ${PF}이다. c = ${rt(a * a + ' + ' + b * b)} = ${c}이므로 ${bar('F′F')} = ${2 * c}이고, 둘레의 길이는 ${PFp} + ${PF} + ${2 * c} = ${PF + PFp + 2 * c}이다.`,
        facts: { value: `2*${a * a}**0.5*${k}/(${m}-${k})+2*${a * a}**0.5*${m}/(${m}-${k})+2*(${a * a}+${b * b})**0.5`, derived: [2, 0.5] }
      });
    }),
    // ①27 초점 F 를 지나는 직선이 한 가지와 만나는 두 점 A, B(그림 — 실제 길이로 그린다): #0 AB → F′A + F′B, #1 AF′ + BF′ → AB
    T('focus-chord', '초점을 지나는 직선과 한 가지의 두 교점', '①27', (d, n) => {
      const a = d.int(1, 4), b = d.int(1, 4), A = a * a, Bd = b * b, c = Math.sqrt(A + Bd), lr = 2 * Bd / a;
      const L = Math.floor(lr) + d.int(1, 8);
      if (L <= lr + 0.5) return null;
      const m = Math.sqrt(Bd * (L + 2 * a) / (a * (L * a - 2 * Bd)));
      // y = m(x − c) 와 b²x² − a²y² = a²b² 의 교점
      const qa = Bd - A * m * m, qb = 2 * A * m * m * c, qc = -A * m * m * c * c - A * Bd, disc = qb * qb - 4 * qa * qc;
      const xs = [(-qb + Math.sqrt(disc)) / (2 * qa), (-qb - Math.sqrt(disc)) / (2 * qa)], P2 = xs.map((x) => [x, m * (x - c)]).sort((u, w) => w[1] - u[1]);
      const [PA, PB] = P2;
      if (P2.some(([x]) => !(x > 0)) || Math.abs(Math.hypot(PA[0] - PB[0], PA[1] - PB[1]) - L) > 1e-6) return null;
      // 두 점이 F 에서 너무 치우치지 않게(그림에서 B 와 F 의 이름이 겹치지 않게)
      if (Math.min(Math.hypot(PA[0] - c, PA[1]), Math.hypot(PB[0] - c, PB[1])) < 0.3 * L) return null;
      const ytop = Math.max(PA[1], 2) + 1.2, ybot = Math.min(PB[1], -2) - 1.2, xr = Math.max(PA[0], PB[0], c) + 1.4;
      if (ytop - ybot > 1.25 * (xr + c + 1.6) || xr > 12) return null;
      const figure = hypPlot(A, Bd, 1, {
        x: [-(c + 1.6), xr], y: [ybot, ytop],
        lines: [{ p: [c, 0], q: PA, color: '#b42318', said: '점 F를 지나는 직선' }],
        segs: [{ p: [-c, 0], q: PA, dash: true }, { p: [-c, 0], q: PB, dash: true }],
        dots: [{ x: PA[0], y: PA[1], name: 'A', said: '쌍곡선과 직선의 교점' }, { x: PB[0], y: PB[1], name: 'B', said: '쌍곡선과 직선의 교점' }, { x: c, y: 0, name: 'F', side: 'dr', said: '초점' }, { x: -c, y: 0, name: 'F′', side: 'ul', said: '초점' }]
      });
      if (n === 0) {
        return N(`그림과 같이 두 초점이 F, F′인 쌍곡선 ${jh(hypH(A, Bd, 1), '과/와')} 초점 F를 지나는 직선이 두 점 A, B에서 만난다. ${nb(bar('AB') + ' = ' + L)}일 때, ${nb(bar('F′A') + ' + ' + bar('F′B'))}의 값은?`, L + 4 * a, {
          figure,
          explain: `두 점 A, B는 초점 F 쪽의 같은 가지 위에 있으므로 ${nb(bar('F′A') + ' ' + MINUS + ' ' + bar('FA') + ' = ' + 2 * a)}, ${nb(bar('F′B') + ' ' + MINUS + ' ' + bar('FB') + ' = ' + 2 * a)}이다. 더하면 ${nb(bar('F′A') + ' + ' + bar('F′B') + ' = (' + bar('FA') + ' + ' + bar('FB') + ') + ' + 4 * a)}이고, ${nb(bar('FA') + ' + ' + bar('FB') + ' = ' + bar('AB') + ' = ' + L)}이므로 값은 ${L + 4 * a}이다.`,
          facts: { value: `${L}+4*${A}**0.5`, derived: [4, 0.5] }
        });
      }
      const S = L + 4 * a;
      return N(`두 점 F, F′을 초점으로 하고 주축의 길이가 ${2 * a}인 쌍곡선이 있다. 그림과 같이 점 F를 지나는 직선이 쌍곡선과 두 점 A, B에서 만나고 ${nb(bar('AF′') + ' + ' + bar('BF′') + ' = ' + S)}일 때, 선분 AB의 길이는?`, L, {
        figure,
        explain: `두 점 A, B는 같은 가지 위에 있으므로 ${nb(bar('AF′') + ' = ' + bar('AF') + ' + ' + 2 * a)}, ${nb(bar('BF′') + ' = ' + bar('BF') + ' + ' + 2 * a)}이다. 더하면 ${nb(bar('AF') + ' + ' + bar('BF') + ' = ' + S + ' ' + MINUS + ' ' + 4 * a + ' = ' + L)}이고, 점 F가 선분 AB 위에 있으므로 ${nb(bar('AB') + ' = ' + L)}이다.`,
        facts: { value: `${S}-2*${2 * a}`, derived: [2] }
      });
    }, { count: 2 }),
    // ①29 두 초점을 공유하는 타원과 쌍곡선의 교점 P: #0 |PF′² − PF²|, #1 PF × PF′, #2 식에 미지수가 있어도 장축·주축으로(교확09)
    T('focus-ellipse', '두 초점을 공유하는 타원과 쌍곡선의 교점', '①29', (d, n) => {
      const PF2 = bar('PF') + sup(2), PFp2 = bar('PF′') + sup(2);
      if (n === 0) {
        const E = d.int(3, 8), a = d.int(1, E - 2), c2 = d.int(a * a + 1, E * E - 1);
        return N(`두 점 F, F′을 초점으로 하는 타원 ${jh(ellH(E * E, E * E - c2), '과/와')} 쌍곡선 ${hypH(a * a, c2 - a * a, 1)}의 한 교점을 P라 할 때, ${nb('|' + PFp2 + ' ' + MINUS + ' ' + PF2 + '|')}의 값은?`, 4 * E * a, {
          explain: `타원의 장축의 길이가 ${2 * E}이므로 ${nb(bar('PF′') + ' + ' + bar('PF') + ' = ' + 2 * E)}, 쌍곡선의 주축의 길이가 ${2 * a}이므로 ${nb('|' + bar('PF′') + ' ' + MINUS + ' ' + bar('PF') + '| = ' + 2 * a)}이다. ${nb('|' + PFp2 + ' ' + MINUS + ' ' + PF2 + '|')} = (${bar('PF′')} + ${bar('PF')}) × |${bar('PF′')} ${MINUS} ${bar('PF')}| = ${2 * E} × ${2 * a} = ${4 * E * a}이다.`,
          facts: { value: `4*${E * E}**0.5*${a * a}**0.5`, derived: [4, 0.5] }
        });
      }
      if (n === 1) {
        const E2 = d.int(6, 30), A = d.int(1, E2 - 4), c2 = d.int(A + 1, E2 - 1);
        if (isSq(E2) && isSq(A)) return null;
        return N(`두 점 F, F′을 초점으로 하는 타원 ${jh(ellH(E2, E2 - c2), '과/와')} 쌍곡선 ${hypH(A, c2 - A, 1)}의 한 교점을 P라 할 때, ${nb(bar('PF') + ' × ' + bar('PF′'))}의 값은?`, E2 - A, {
          explain: `${nb(bar('PF') + ' + ' + bar('PF′') + ' = ' + rad(4 * E2))}(장축의 길이), ${nb('|' + bar('PF') + ' ' + MINUS + ' ' + bar('PF′') + '| = ' + rad(4 * A))}(주축의 길이)이다. 두 식을 제곱하여 빼면 ${nb('4' + bar('PF') + ' × ' + bar('PF′') + ' = ' + 4 * E2 + ' ' + MINUS + ' ' + 4 * A)}이므로 ${nb(bar('PF') + ' × ' + bar('PF′') + ' = ' + (E2 - A))}이다.`,
          facts: { value: `${E2}-${A}` }
        });
      }
      const E = d.int(3, 6), a0 = d.int(1, E - 2), E2 = E * E, A = a0 * a0;
      return N(`타원 ${nb(va + X2 + ' + ' + E2 + Y2 + ' = ' + E2 + va)}와 쌍곡선 ${nb(vb + X2 + ' ' + MINUS + ' ' + (A === 1 ? '' : A) + Y2 + ' = ' + (A === 1 ? '' : A) + vb)}는 두 초점이 모두 일치하고, 제1사분면 위의 점 P에서 만난다. 두 초점을 F(${vc}, 0), F′(${MINUS}${vc}, 0)이라 할 때, ${nb(PFp2 + ' ' + MINUS + ' ' + PF2)}의 값은? ${nb(`(단, ${va} &gt; 0, ${vb} &gt; 0, ${vc} &gt; 0)`)}`, 4 * E * a0, {
        explain: `타원은 ${ellH(E2, va)}이므로 장축의 길이는 ${2 * E}이고, 쌍곡선은 ${nb(over(X2, A) + ' ' + MINUS + ' ' + frac(Y2, vb) + ' = 1')}이므로 주축의 길이는 ${2 * a0}이다(${va}, ${vb}의 값은 몰라도 된다). 점 P는 F에 더 가까우므로 ${nb(bar('PF′') + ' + ' + bar('PF') + ' = ' + 2 * E)}, ${nb(bar('PF′') + ' ' + MINUS + ' ' + bar('PF') + ' = ' + 2 * a0)}이고, ${nb(PFp2 + ' ' + MINUS + ' ' + PF2)} = ${2 * E} × ${2 * a0} = ${4 * E * a0}이다.`,
        facts: { value: `4*${E2}**0.5*${A}**0.5`, derived: [4, 0.5] }
      });
    }, { count: 3 }),
    // ①30 쌍곡선의 두 꼭짓점이 타원의 두 초점: a² + b² 는 정해진다
    T('focus-vertex', '쌍곡선의 꼭짓점이 타원의 초점일 때', '①30', (d) => {
      const B0 = d.int(2, 20), E = d.int(5, 40);
      if (E === B0) return null;
      return N(`쌍곡선 ${nb(frac(X2, va + sup(2)) + ' ' + MINUS + ' ' + frac(Y2, B0) + ' = 1')}의 두 꼭짓점이 타원 ${nb(frac(X2, E) + ' + ' + frac(Y2, vb + sup(2)) + ' = 1')}의 두 초점일 때, ${nb(va + sup(2) + ' + ' + vb + sup(2))}의 값은? (단, ${va}, ${vb}는 상수이다.)`, E, {
        explain: `쌍곡선의 두 꼭짓점 (±${va}, 0)이 x축 위에 있으므로 타원의 두 초점도 x축 위에 있고, 그 좌표는 (±${rt(E + ' ' + MINUS + ' ' + vb + sup(2))}, 0)이다. 따라서 ${nb(va + sup(2) + ' = ' + E + ' ' + MINUS + ' ' + vb + sup(2))}, 곧 ${nb(va + sup(2) + ' + ' + vb + sup(2) + ' = ' + E)}이다.`,
        facts: { value: `${E}` }
      });
    })
  ]);

  // ── 쌍곡선의 접선의 방정식 ──
  // 기울기 m 인 접선의 y절편의 제곱: 일반형 Px² − Qy² = R(A = R/P, B = R/Q)에서 Am² − B = R(m²Q − P)/(PQ). m² 을 유리수 [p, q]로 받는다.
  const tanSq = (P, Qc, R, m2) => Q(R * (m2.p * Qc - P * m2.q), P * Qc * m2.q);
  // 유리수 n² 의 √ 를 surd 로
  const sqrtQ = (x) => surd(x.p, x.q);
  B.addTypes(UNIT, 'tan', [
    // ②1 기울기가 주어진 접선: #0 기울기가 정수, #1 근호 기울기를 가진 직선에 평행
    T('tan-slope', '기울기가 주어진 접선의 방정식', '②1', (d, n) => {
      const P = d.int(1, 6), Qc = d.int(1, 6), R = lcm(P, Qc) * d.int(1, 3);
      if (P === Qc || R > 36) return null;
      const r = n === 0 ? null : d.pick([2, 3, 5, 6, 7]), m = n === 0 ? d.pick([-3, -2, -1, 1, 2, 3]) : null, m2 = n === 0 ? Q(m * m) : Q(r);
      const sq = tanSq(P, Qc, R, m2);
      if (sq.p <= 0) return null;
      const slopeH = n === 0 ? poly([[m, X]]) : rt(r) + X;
      const tanH = (u) => nb(Y + ' = ' + slopeH + ' ± ' + surdH(u));
      const right = sqrtQ(sq), A = Q(R, P), Bq = Q(R, Qc);
      const cands = [sqrtQ(qadd(qmul(A, m2), Bq)), surd(sq.p * sq.p, sq.q * sq.q), qsub(qmul(Bq, m2), A).p > 0 ? sqrtQ(qsub(qmul(Bq, m2), A)) : null, sqrtQ(qadd(A, Bq))].filter(Boolean);
      const keys = new Set([surdKey(right)]), wrongs = [];
      for (const u of cands) if (!keys.has(surdKey(u)) && wrongs.length < 3) { keys.add(surdKey(u)); wrongs.push(tanH(u)); }
      if (wrongs.length < 3) return null;
      wrongs.push(nb(Y + ' = ' + (n === 0 ? poly([[-m, X]]) : MINUS + rt(r) + X) + ' ± ' + surdH(right)));
      const lineGiven = n === 0 ? '' : nb(rt(r) + X + ' ' + MINUS + ' ' + Y + ' + ' + d.int(1, 5) + ' = 0');
      const text = n === 0 ? `쌍곡선 ${genH(P, Qc, R)}에 접하고 기울기가 ${num(m)}인 접선의 방정식은?` : `쌍곡선 ${genH(P, Qc, R)}에 접하고 직선 ${lineGiven}에 평행한 직선의 방정식은?`;
      return pickOne(d, text, tanH(right), wrongs, {
        explain: `양변을 ${josa(R, '으로/로')} 나누면 ${hypH(R / P, R / Qc, 1)}이다. 기울기가 ${n === 0 ? num(m) : rt(r)}인 접선은 ${nb(Y + ' = ' + (n === 0 ? vm : rt(r)) + X + ' ± ' + rt(va + sup(2) + vm + sup(2) + ' ' + MINUS + ' ' + vb + sup(2)))} 꼴이고, a²m² ${MINUS} b² = ${tx(A)} × ${tx(m2)} ${MINUS} ${tx(Bq)} = ${tx(sq)}이므로 ${tanH(right)}이다.`
      });
    }, { count: 2 }),
    // ②2 직선이 접할 때의 y절편: #0 실수 k 를 모두(고르기), #1 직선 y = mx 를 y축의 방향으로 k 만큼 옮긴 직선(양수 k)
    T('tan-k', '직선이 쌍곡선에 접할 때의 상수', '②2', (d, n) => {
      if (n === 0) {
        const A = d.int(2, 16), Bd = d.int(2, 16), m = d.pick([-3, -2, -1, 1, 2, 3]), s = A * m * m - Bd;
        if (A === Bd || s <= 0 || isSq(s)) return null;
        const right = '±' + rad(s), cands = ['±' + rad(A * m * m + Bd), rad(s), '±' + s, nb(MINUS + rad(s)), '±' + rad(Math.abs(A * Math.abs(m) - Bd) || 2)];
        const wrongs = [...new Set(cands)].filter((h) => h !== right).slice(0, 4);
        if (wrongs.length < 4) return null;
        return pickOne(d, `직선 ${nb(Y + ' = ' + poly([[m, X]]) + ' + ' + vk)}가 쌍곡선 ${hypH(A, Bd, 1)}에 접할 때, 실수 ${vk}의 값을 모두 구한 것은?`, right, wrongs, {
          explain: `기울기가 ${num(m)}인 접선은 ${nb(Y + ' = ' + poly([[m, X]]) + ' ± ' + rt(A + ' × ' + (m < 0 ? '(' + num(m) + ')' : m) + sup(2) + ' ' + MINUS + ' ' + Bd))}, 곧 ${pmTan(m, rad(s))}이므로 ${vk} = ${right}이다.`
        });
      }
      const P = d.int(1, 6), Qc = d.int(1, 6), R = lcm(P, Qc) * d.int(1, 2), m = d.pick([1, 2, 3]);
      if (P === Qc || R > 36) return null;
      const sq = tanSq(P, Qc, R, Q(m * m));
      if (sq.p <= 0 || !isInt(sq) || !isSq(sq.p)) return null;
      const k = Math.sqrt(sq.p);
      return N(`직선 ${jh(nb(Y + ' = ' + poly([[m, X]])), '을/를')} y축의 방향으로 ${vk}만큼 평행이동한 직선이 쌍곡선 ${genH(P, Qc, R)}에 접할 때, 양수 ${vk}의 값은?`, k, {
        explain: `옮긴 직선은 ${nb(Y + ' = ' + poly([[m, X]]) + ' + ' + vk)}이다. 쌍곡선은 ${hypH(R / P, R / Qc, 1)}이므로 ${nb(vk + sup(2) + ' = ' + (R / P) + ' × ' + m + sup(2) + ' ' + MINUS + ' ' + (R / Qc) + ' = ' + sq.p)}이고, ${vk} &gt; 0이므로 ${vk} = ${k}이다.`,
        facts: { value: `((${R}/${P})*${m}*${m}-${R}/${Qc})**0.5`, derived: [0.5] }
      });
    }, { count: 2 }),
    // ②3 접할 때 쌍곡선의 상수: #0 → 두 초점 사이의 거리, #1 Bx² − ky² = Bk 꼴의 상수 k
    T('tan-param', '직선이 접할 때 쌍곡선의 상수', '②3', (d, n) => {
      const r = d.pick([1, 2, 3, 4]), Bd = d.int(2, 12), c0 = d.int(1, 6), Kc = (c0 * c0 + Bd) / r;
      if (!Number.isInteger(Kc) || Kc < 2 || Kc === Bd) return null;
      if (n === 0 && !sqFree(Kc + Bd)) return null;
      const slopeH = r === 1 ? '' : r === 4 ? '2' : rt(r), rE = r === 4 ? '2*2' : String(r);
      const line = nb(Y + ' = ' + slopeH + X + ' ' + MINUS + ' ' + c0) + tl(c0, '이/가');
      if (n === 0) {
        return radPos(`직선 ${line} 쌍곡선 ${nb(frac(X2, vk) + ' ' + MINUS + ' ' + frac(Y2, Bd) + ' = 1')}에 접할 때, 이 쌍곡선의 두 초점 사이의 거리는? (단, ${vk}는 상수이다.)`, 2, Kc + Bd, {
          explain: `기울기가 ${slopeH || 1}인 접선은 ${nb(Y + ' = ' + slopeH + X + ' ± ' + rt((r === 1 ? '' : r) + vk + ' ' + MINUS + ' ' + Bd))}이므로 ${nb((r === 1 ? '' : r) + vk + ' ' + MINUS + ' ' + Bd + ' = ' + c0 * c0)}, ${vk} = ${Kc}이다. c² = ${Kc} + ${Bd} = ${Kc + Bd}이므로 두 초점 사이의 거리는 ${radText(2, Kc + Bd)}이다.`,
          facts: { calc: [['2', 0], [`(${c0}*${c0}+${Bd})/(${rE})+${Bd}`, 1]], derived: [2] }
        });
      }
      return N(`직선 ${line} 쌍곡선 ${nb(Bd + X2 + ' ' + MINUS + ' ' + vk + Y2 + ' = ' + Bd + vk)}에 접할 때, 상수 ${vk}의 값은?`, Kc, {
        explain: `양변을 ${Bd}${vk}로 나누면 ${nb(frac(X2, vk) + ' ' + MINUS + ' ' + frac(Y2, Bd) + ' = 1')}이다. 기울기가 ${slopeH || 1}인 접선은 ${nb(Y + ' = ' + slopeH + X + ' ± ' + rt((r === 1 ? '' : r) + vk + ' ' + MINUS + ' ' + Bd))}이므로 ${nb((r === 1 ? '' : r) + vk + ' ' + MINUS + ' ' + Bd + ' = ' + c0 * c0)}, ${vk} = ${Kc}이다.`,
        facts: { value: `(${c0}*${c0}+${Bd})/(${rE})` }
      });
    }, { count: 2 }),
    // ②4 기울기가 m 인 접선이 있을 조건: a²m² > b²(점근선의 기울기 ±b/a 이면 접하지 않는다) — 교과서 관계 탐구(55쪽)·곁글(52쪽)
    T('tan-exist', '접선이 있을 수 있는 기울기', '②4', (d) => {
      const a = d.int(2, 6), b = d.int(1, 6);
      if (a === b || gcd(a, b) !== 1) return null;
      const fr = [];
      for (let q = 1; q <= 6; q += 1) for (let p = 1; p <= 12; p += 1) if (gcd(p, q) === 1 && p / q < 3) fr.push([p, q]);
      const big = fr.filter(([p, q]) => a * p > b * q), small = fr.filter(([p, q]) => a * p < b * q);
      if (!big.length || small.length < 3) return null;
      const pick = [d.pick(big), [b, a]].concat(d.shuffle(small).slice(0, 3));
      const opts = pick.map(([p, q]) => tx(Q(d.pick([1, -1]) * p, q)));
      const ok = pick.map(([p, q]) => a * a * p * p > b * b * q * q);
      if (ok.filter(Boolean).length !== 1 || !ok[0]) return null;
      return pickOne(d, `쌍곡선 ${hypH(a * a, b * b, 1)}에 접하고 기울기가 ${vm}인 직선이 있을 때, 다음 중 ${vm}의 값이 될 수 있는 것은?`, opts[0], opts.slice(1), {
        explain: `기울기가 ${vm}인 접선은 ${nb(Y + ' = ' + vm + X + ' ± ' + rt(a * a + vm + sup(2) + ' ' + MINUS + ' ' + b * b))} 꼴이므로 ${nb(a * a + vm + sup(2) + ' &gt; ' + b * b)}, 곧 |${vm}| &gt; ${frac(b, a)}일 때만 접선이 있다. ${vm} = ±${jh(frac(b, a), '은/는')} 점근선의 기울기로, 이 기울기의 직선은 점근선과 같거나 쌍곡선과 한 점에서 만날 뿐 접하지 않는다. 보기 가운데 |${vm}| &gt; ${frac(b, a)}인 것은 ${opts[0]}뿐이다.`
      });
    }),
    // ②5 기울기가 같은 두 접선 사이의 거리(끝 단계는 고1 평행한 두 직선 사이의 거리)
    T('tan-gap', '기울기가 같은 두 접선 사이의 거리', '②5', (d) => {
      const m = d.int(1, 3), t = d.int(1, 3), A = d.int(2, 30), Bd = A * m * m - (1 + m * m) * t * t;
      if (Bd < 2 || Bd === A || Bd > 40) return null;
      const s = (1 + m * m) * t * t;
      return N(`쌍곡선 ${hypH(A, Bd, 1)}에 접하고 기울기가 ${m}인 두 직선 사이의 거리는?`, 2 * t, {
        explain: `두 접선은 ${pmTan(m, rt(A + ' × ' + m + sup(2) + ' ' + MINUS + ' ' + Bd))}, 곧 ${pmTan(m, rad(s))}이다. 직선 ${nb(Y + ' = ' + poly([[m, X]]) + ' + ' + rad(s))} 위의 점 (0, ${rad(s)})과 직선 ${nb(poly([[m, X], [-1, Y]]) + ' ' + MINUS + ' ' + rad(s) + ' = 0')} 사이의 거리는 ${frac(rad(4 * s), rt(m * m + 1))} = ${2 * t}이다.`,
        facts: { value: `2*((${A}*${m}*${m}-${Bd})/(1+${m}*${m}))**0.5`, derived: [2, 0.5] }
      });
    }),
    // ②7 쌍곡선(우변 1) 위의 점에서의 접선: #0 접선의 방정식(고르기), #1 접선의 y절편
    T('tan-point', '쌍곡선 위의 점에서의 접선', '②7', (d, n) => {
      const [A, Bd, x0, y0] = d.pick(PTS[1].filter(([a2, b2, , y]) => a2 !== b2 && a2 <= 30 && b2 <= 30 && (n === 0 || b2 % y === 0)));
      const x1 = d.pick([1, -1]) * x0, y1 = d.pick([1, -1]) * y0, L = lcm(A, Bd);
      if (n === 0) {
        const line = (p, q, r) => stdLine(...normLine(p, q, r));
        const right = line(x1 * L / A, -y1 * L / Bd, L);
        const wrongs = [line(x1 * L / A, y1 * L / Bd, L), line(x1 * L / A, -y1 * L / Bd, -L), line(x1 * L / Bd, -y1 * L / A, L), line(y1 * L / A, -x1 * L / Bd, L)];
        return pickOne(d, `쌍곡선 ${hypH(A, Bd, 1)} 위의 점 ${pt(x1, y1)}에서의 접선의 방정식은?`, right, wrongs, {
          explain: `쌍곡선 ${symH(1)} 위의 점 (x₁, y₁)에서의 접선은 ${nb(frac('x₁' + X, va + sup(2)) + ' ' + MINUS + ' ' + frac('y₁' + Y, vb + sup(2)) + ' = 1')}이다. ${nb(frac((x1 < 0 ? MINUS : '') + Math.abs(x1) + X, A) + sgn(-y1) + frac(Math.abs(y1) + Y, Bd) + ' = 1')}의 양변에 ${josa(L, '을/를')} 곱하여 정리하면 ${right}이다.`
        });
      }
      const yi = -Bd / y1;
      return N(`쌍곡선 ${hypH(A, Bd, 1)} 위의 점 ${pt(x1, y1)}에서의 접선의 y절편은?`, yi, {
        signed: true,
        explain: `접선은 ${nb(frac((x1 < 0 ? MINUS : '') + Math.abs(x1) + X, A) + sgn(-y1) + frac(Math.abs(y1) + Y, Bd) + ' = 1')}이다. x = 0을 넣으면 ${nb(Y + ' = ' + MINUS + Bd + ' ÷ ' + (y1 < 0 ? '(' + num(y1) + ')' : y1) + ' = ' + num(yi))}이므로 y절편은 ${num(yi)}이다.`,
        facts: { value: `0-${Bd}/${jn(y1)}` }
      });
    }, { count: 2 }),
    // ②8 우변이 −1인 쌍곡선 위의 점에서의 접선: #0 접선의 방정식, #1 접선에 수직이고 한 점을 지나는 직선(끝 단계는 고1)
    T('tan-point-neg', '우변이 −1인 쌍곡선 위의 점에서의 접선', '②8', (d, n) => {
      const [A, Bd, x0, y0] = d.pick(PTS[-1].filter(([a2, b2]) => a2 !== b2 && a2 <= 30 && b2 <= 30));
      const x1 = d.pick([1, -1]) * x0, y1 = d.pick([1, -1]) * y0, L = lcm(A, Bd);
      const line = (p, q, r) => stdLine(...normLine(p, q, r));
      const tanT = line(x1 * L / A, -y1 * L / Bd, -L);
      if (n === 0) {
        const wrongs = [line(x1 * L / A, -y1 * L / Bd, L), line(x1 * L / A, y1 * L / Bd, -L), line(x1 * L / Bd, -y1 * L / A, -L), line(y1 * L / A, -x1 * L / Bd, -L)];
        return pickOne(d, `쌍곡선 ${hypH(A, Bd, -1)} 위의 점 ${pt(x1, y1)}에서의 접선의 방정식은?`, tanT, wrongs, {
          explain: `쌍곡선 ${symH(-1)} 위의 점 (x₁, y₁)에서의 접선은 ${nb(frac('x₁' + X, va + sup(2)) + ' ' + MINUS + ' ' + frac('y₁' + Y, vb + sup(2)) + ' = ' + MINUS + '1')}이다(우변의 ${MINUS}1을 그대로 둔다). 점의 좌표를 넣고 양변에 ${josa(L, '을/를')} 곱하여 정리하면 ${tanT}이다.`
        });
      }
      const sT = Q(Bd * x1, A * y1), sP = Q(-A * y1, Bd * x1), p0 = d.int(-4, 4), q0 = d.int(-4, 4);
      if ((p0 === x1 && q0 === y1)) return null;
      const lineThrough = (s, px, py) => lineH(s, qsub(Q(py), qmul(s, Q(px))));
      const right = lineThrough(sP, p0, q0);
      const wrongs = [lineThrough(sT, p0, q0), lineThrough(qmul(sP, Q(-1)), p0, q0), lineThrough(sP, x1, y1), lineThrough(qdiv(Q(1), sP), p0, q0)];
      return pickOne(d, `쌍곡선 ${hypH(A, Bd, -1)} 위의 점 ${pt(x1, y1)}에서의 접선에 수직이고 점 ${jh(pt(p0, q0), '을/를')} 지나는 직선의 방정식은?`, right, wrongs, {
        explain: `접선은 ${tanT}이고 그 기울기는 ${tx(sT)}이다. 이에 수직인 직선의 기울기는 ${tx(sP)}이므로 점 ${jh(pt(p0, q0), '을/를')} 지나는 직선은 ${right}이다.`
      });
    }, { count: 2 }),
    // ②9 접선이 지나는 점으로 접점의 x좌표(쌍곡선의 식만으로는 부호가 정해지지 않는다)
    T('tan-through', '접선이 지나는 점으로 접점의 좌표 구하기', '②9', (d) => {
      const [A, Bd, x0, y0] = d.pick(PTS[1].filter(([a2, b2]) => a2 !== b2 && a2 <= 30 && b2 <= 30));
      const x1 = d.pick([1, -1]) * x0, y1 = d.pick([1, -1]) * y0, cands = [];
      for (let q = -8; q <= 8; q += 1) { const top = A * (Bd + y1 * q), bot = Bd * x1; if (top % bot === 0) { const p = top / bot; if (p !== 0 && Math.abs(p) <= 12 && !(p === x1 && q === y1)) cands.push([p, q]); } }
      if (!cands.length) return null;
      const [p0, q0] = d.pick(cands);
      return N(`쌍곡선 ${hypH(A, Bd, 1)} 위의 점 (${va}, ${num(y1)})에서의 접선이 점 ${jh(pt(p0, q0), '을/를')} 지날 때, 상수 ${va}의 값은?`, x1, {
        signed: true,
        explain: `점 (${va}, ${num(y1)})에서의 접선은 ${nb(frac(va + X, A) + sgn(-y1) + frac(Math.abs(y1) + Y, Bd) + ' = 1')}이다. 점 ${jh(pt(p0, q0), '을/를')} 넣으면 ${nb(frac(num(p0) + va, A) + sgn(-y1 * q0) + frac(Math.abs(y1 * q0), Bd) + ' = 1')}이므로 ${va} = ${num(x1)}이다. (쌍곡선의 식만으로는 ${va} = ±${x0}이고, 접선의 조건이 부호를 정한다.)`,
        facts: { value: `${A}*(1+${jn(y1)}*${jn(q0)}/${Bd})/${jn(p0)}` }
      });
    }),
    // ②10 접선의 기울기로 쌍곡선을 정해 두 초점 사이의 거리
    T('tan-slope-find', '접선의 기울기로 쌍곡선을 정해 두 초점 사이의 거리', '②10', (d) => {
      const x1 = d.pick([-4, -3, -2, -1, 1, 2, 3, 4]), y1 = d.pick([-4, -3, -2, -1, 1, 2, 3, 4]), m = d.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
      const k = Q(m * y1, x1);
      if (k.p <= 0) return null;
      const a2 = qsub(Q(x1 * x1), qdiv(Q(y1 * y1), k)), nq = qmul(Q(4), qmul(a2, qadd(Q(1), k)));
      if (a2.p <= 0 || nq.q !== 1 || !sqFree(nq.p) || nq.p > 120) return null;
      const b2 = qmul(k, a2);
      return radPos(`쌍곡선 ${symH(1)} 위의 점 ${pt(x1, y1)}에서의 접선의 기울기가 ${num(m)}일 때, 이 쌍곡선의 두 초점 사이의 거리는? (단, ${va}, ${vb}는 상수이다.)`, 1, nq.p, {
        explain: `점 (x₁, y₁)에서의 접선 ${nb(frac('x₁' + X, va + sup(2)) + ' ' + MINUS + ' ' + frac('y₁' + Y, vb + sup(2)) + ' = 1')}의 기울기는 ${nb(frac(vb + sup(2) + 'x₁', va + sup(2) + 'y₁'))}이므로 ${nb(frac(vb + sup(2), va + sup(2)) + ' = ' + num(m) + ' × ' + tx(Q(y1, x1)) + ' = ' + tx(k))}이다. 점 ${pt(x1, y1)}의 좌표를 쌍곡선의 식에 넣으면 a² = ${tx(a2)}, b² = ${tx(b2)}이고, 두 초점 사이의 거리는 ${nb('2' + rt(tx(qadd(a2, b2))))} = ${rt(nq.p)}이다.`,
        facts: { value: `4*(${jn(x1)}**2-${jn(y1)}**2/(${jn(m)}*${jn(y1)}/${jn(x1)}))*(1+${jn(m)}*${jn(y1)}/${jn(x1)})`, derived: [4, 2] }
      });
    }),
    // ②11 접선이 x축과 만나는 점과 초점으로 삼각형의 넓이
    T('tan-area', '접선의 x절편과 초점으로 삼각형의 넓이', '②11', (d) => {
      const [A, Bd, x0, y0] = d.pick(PTS[1].filter(([a2, b2]) => a2 !== b2 && a2 <= 30 && b2 <= 30 && isSq(a2 + b2)));
      const x1 = x0, y1 = d.pick([1, -1]) * y0, c = Math.sqrt(A + Bd), xi = Q(A, x1), area = qmul(Q(Math.abs(y1), 2), qsub(Q(c), xi));
      if (area.q !== 1 || area.p <= 0) return null;
      return N(`쌍곡선 ${hypH(A, Bd, 1)} 위의 점 A${pt(x1, y1)}에서의 접선이 x축과 만나는 점을 B라 하자. 이 쌍곡선의 두 초점 가운데 x좌표가 양수인 점을 F라 할 때, 삼각형 FAB의 넓이는?`, area.p, {
        explain: `접선 ${nb(frac(x1 + X, A) + ' ' + MINUS + ' ' + frac(num(y1) + Y, Bd) + ' = 1')}에 y = 0을 넣으면 B의 x좌표는 ${tx(xi)}이다. c = ${rt(A + ' + ' + Bd)} = ${c}이므로 F(${c}, 0)이고, ${bar('BF')} = ${tx(qsub(Q(c), xi))}이다. 넓이는 ${frac(1, 2)} × ${tx(qsub(Q(c), xi))} × ${Math.abs(y1)} = ${area.p}이다.`,
        facts: { value: `(${A}+${Bd})**0.5/2*${Math.abs(y1)}-${A}/${x1}/2*${Math.abs(y1)}`, derived: [2, 0.5] }
      });
    }),
    // ②13 교과서 실생활(59쪽 망원경): 두 초점까지의 거리, 접선의 x절편, F′Q : QF(= PF′ : PF — 접선이 ∠F′PF 를 이등분한다)
    T('tan-reflect', '접선의 x절편과 두 초점(빛의 반사)', '②13', (d, n) => {
      const [a, b, c] = d.pick(TRI.filter(([x, y]) => x <= 9 && y <= 12)), A = a * a, Bd = b * b, cands = [];
      for (let x = a + 1; x <= a + 10; x += 1) { const y2 = Bd * (x * x - A) / A; if ((c * x) % a === 0 && Number.isInteger(y2) && (n !== 1 || A % x !== 0)) cands.push([x, y2]); }
      if (!cands.length) return null;
      const [x1, y2] = d.pick(cands), yH = rad(y2), PF = c * x1 / a - a, PFp = c * x1 / a + a;
      const head = `쌍곡선 ${hypH(A, Bd, 1)}의 두 초점 F(${c}, 0), F′(${num(-c)}, 0)과 쌍곡선 위의 점 P(${x1}, ${yH})에 대하여 `;
      const tanE = nb(frac(x1 + X, A) + ' ' + MINUS + ' ' + frac(yH + Y, Bd) + ' = 1');
      if (n === 0) {
        return vals(head + '두 선분 PF, PF′의 길이를 구하시오.', [[bar('PF'), PF], [bar('PF′'), PFp]], {
          explain: `${bar('PF')} = ${rt('(' + x1 + ' ' + MINUS + ' ' + c + ')' + sup(2) + ' + ' + y2)} = ${PF}이다. 점 P가 F 쪽 가지 위에 있으므로 ${nb(bar('PF′') + ' = ' + bar('PF') + ' + ' + 2 * a)} = ${PFp}이다.`,
          facts: { calc: [[`((${x1}-${c})**2+${y2})**0.5`, 0], [`((${x1}+${c})**2+${y2})**0.5`, 1]], derived: [0.5, 2, y2] }
        });
      }
      if (n === 1) {
        return qAns(head + '점 P에서의 접선이 x축과 만나는 점을 Q라 할 때, 점 Q의 x좌표는?', [A, x1], {
          explain: `점 P에서의 접선은 ${tanE}이다. y = 0을 넣으면 x = ${frac(A, x1)}이므로 점 Q의 x좌표는 ${tx(Q(A, x1))}이다.`,
          facts: { value: `${A}/${x1}` }
        });
      }
      const g = gcd(c * x1 + A, c * x1 - A), r1 = (c * x1 + A) / g, r2 = (c * x1 - A) / g;
      return inline(head + `점 P에서의 접선이 x축과 만나는 점을 Q라 할 때, ${nb(jh(bar('F′Q') + ' : ' + bar('QF'), '을/를'))} 가장 간단한 자연수의 비로 나타내시오.`, grp('{0} : {1}'), [{ answer: r1 }, { answer: r2 }], {
        shown: nb(r1 + ' : ' + r2),
        explain: `접선 ${tanE}에서 Q(${tx(Q(A, x1))}, 0)이므로 ${bar('F′Q')} = ${tx(qadd(Q(c), Q(A, x1)))}, ${bar('QF')} = ${tx(qsub(Q(c), Q(A, x1)))}이다. 따라서 ${nb(bar('F′Q') + ' : ' + bar('QF') + ' = ' + r1 + ' : ' + r2)}이고, 이것은 ${jh(nb(bar('PF′') + ' : ' + bar('PF') + ' = ' + PFp + ' : ' + PF), '과/와')} 같다(접선이 ∠F′PF를 이등분한다).`,
        facts: { calc: [[`(${c}*${x1}+${A})/${g}`, 0], [`(${c}*${x1}-${A})/${g}`, 1]], derived: [g] }
      });
    }, { count: 3 })
  ]);

  // ── 곡선 밖의 점에서 그은 접선과 점근선 ──
  B.addTypes(UNIT, 'out', [
    // ②16 곡선 밖의 점에서 그은 접선: #0 y축 위의 점(대칭인 두 접선), #1 한 접선이 y축에 평행한 경우(꼭짓점에서의 접선을 놓치기 쉽다)
    T('out-tangent', '곡선 밖의 점에서 그은 접선의 방정식', '②16', (d, n) => {
      if (n === 0) {
        const P = d.int(1, 6), Qc = d.int(1, 6), R = lcm(P, Qc) * d.int(1, 3), t = d.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        if (P === Qc || R > 36) return null;
        const m2 = Q(P * (Qc * t * t + R), Qc * R), u = sqrtQ(m2);
        const pair = (w, tt) => nb(Y + ' = ±' + surdH(w, true) + X + sgn(tt) + Math.abs(tt));
        const right = pair(u, t), cands = [pair(u, -t), pair(sqrtQ(qdiv(Q(1), m2)), t), Qc * t * t !== R ? pair(sqrtQ(Q(P * Math.abs(Qc * t * t - R), Qc * R)), t) : null, pair(surd(m2.p * m2.p, m2.q * m2.q), t)].filter(Boolean);
        const wrongs = [...new Set(cands)].filter((h) => h !== right).slice(0, 4);
        if (wrongs.length < 3) return null;
        return pickOne(d, `점 ${pt(0, t)}에서 쌍곡선 ${genH(P, Qc, R)}에 그은 접선의 방정식을 모두 구한 것은?`, right, wrongs, {
          explain: `쌍곡선은 ${hypH(R / P, R / Qc, 1)}이다. 접선을 ${nb(Y + ' = ' + vm + X + sgn(t) + Math.abs(t))}라 하면 기울기가 ${vm}인 접선의 y절편은 ±${rt(va + sup(2) + vm + sup(2) + ' ' + MINUS + ' ' + vb + sup(2))}이므로 ${nb(t * t + ' = ' + tx(Q(R, P)) + vm + sup(2) + ' ' + MINUS + ' ' + tx(Q(R, Qc)))}, ${nb(vm + sup(2) + ' = ' + tx(m2))}이다. 따라서 ${right}이다.`
        });
      }
      const a = d.int(1, 4), Bd = d.int(2, 12), q = d.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), A = a * a;
      if (q * q === Bd || A === Bd) return null;
      const R = lcm(A, Bd), P = R / A, Qc = R / Bd, m = Q(q * q + Bd, 2 * q * a), nn = qsub(Q(q), qmul(m, Q(a)));
      if (R > 60) return null;
      const vline = (x) => nb(X + ' = ' + num(x)), other = lineH(m, nn), flip = lineH(qmul(m, Q(-1)), qadd(Q(q), qmul(m, Q(a))));
      const right = vline(a) + ', ' + other;
      const wrongs = [other, vline(a) + ', ' + flip, vline(-a) + ', ' + other, other + ', ' + flip];
      return pickOne(d, `점 ${pt(a, q)}에서 쌍곡선 ${genH(P, Qc, R)}에 그은 접선의 방정식을 모두 구한 것은?`, right, wrongs, {
        explain: `쌍곡선은 ${hypH(A, Bd, 1)}이다. 접점을 (x₁, y₁)이라 하면 접선 ${nb(frac('x₁' + X, A) + ' ' + MINUS + ' ' + frac('y₁' + Y, Bd) + ' = 1')}이 점 ${jh(pt(a, q), '을/를')} 지나고 (x₁, y₁)이 쌍곡선 위에 있다. 연립하면 접점은 꼭짓점 (${a}, 0)이거나 다른 한 점이다. 꼭짓점에서의 접선은 y축에 평행한 ${vline(a)}이고, 다른 접점에서의 접선은 ${other}이다.`
      });
    }, { count: 2 }),
    // ②17 y축 위의 점에서 그은 두 접선과 x축으로 만든 삼각형의 넓이
    T('out-area', '밖의 점에서 그은 두 접선과 x축으로 만든 삼각형의 넓이', '②17', (d) => {
      const [t, r] = d.pick([[2, 2], [4, 2], [6, 2], [3, 3], [6, 3], [5, 5], [6, 6]]), A = d.int(1, 9), Bd = r * A - t * t;
      if (Bd < 2 || Bd === A) return null;
      const R = lcm(A, Bd), P = R / A, Qc = R / Bd;
      if (R > 60) return null;
      return radPos(`점 A(0, ${t})에서 쌍곡선 ${genH(P, Qc, R)}에 그은 두 접선이 x축과 만나는 점을 각각 B, C라 할 때, 삼각형 ABC의 넓이는?`, t * t / r, r, {
        explain: `쌍곡선 ${hypH(A, Bd, 1)}에 접하는 직선 ${nb(Y + ' = ' + vm + X + ' + ' + t)}에서 ${nb(t * t + ' = ' + A + vm + sup(2) + ' ' + MINUS + ' ' + Bd)}이므로 ${nb(vm + sup(2) + ' = ' + r)}, ${vm} = ±${rt(r)}이다. 두 접선의 x절편은 ∓${frac(t, rt(r))}이므로 ${bar('BC')} = ${frac(2 * t, rt(r))}이고, 넓이는 ${frac(1, 2)} × ${frac(2 * t, rt(r))} × ${t} = ${radText(t * t / r, r)}이다.`,
        facts: { calc: [[`${t}*${t}/((${t}*${t}+${R}/${Qc})/(${R}/${P}))`, 0], [`(${t}*${t}+${R}/${Qc})/(${R}/${P})`, 1]] }
      });
    }),
    // ②19 접선과 두 점근선으로 둘러싸인 삼각형의 넓이(늘 ab): #0 x² − y² = k 위의 점, #1 임의의 점(교과서 디지털 공학 58쪽)
    T('out-asym-area', '접선과 두 점근선으로 둘러싸인 삼각형의 넓이', '②19', (d, n) => {
      if (n === 0) {
        const x0 = d.int(2, 6), y0 = d.int(1, x0 - 1), k = x0 * x0 - y0 * y0;
        if (k > 30) return null;
        const x1 = d.pick([1, -1]) * x0, y1 = d.pick([1, -1]) * y0;
        const ip = Q(k, x1 - y1), iq = Q(k, x1 + y1);
        return N(`쌍곡선 ${nb(X2 + ' ' + MINUS + ' ' + Y2 + ' = ' + k)} 위의 점 ${pt(x1, y1)}에서의 접선과 이 쌍곡선의 두 점근선으로 둘러싸인 삼각형의 넓이는?`, k, {
          explain: `점근선은 y = x, y = ${MINUS}x이고 접선은 ${nb(poly([[x1, X], [-y1, Y]]) + ' = ' + k)}이다. 접선과 y = x의 교점은 (${tx(ip)}, ${tx(ip)}), y = ${MINUS}x의 교점은 (${tx(iq)}, ${tx(qmul(iq, Q(-1)))})이다. 두 점근선이 수직이므로 넓이는 ${frac(1, 2)} × ${rt(2)}|${tx(ip)}| × ${rt(2)}|${tx(iq)}| = ${k}이다.`,
          facts: { value: `${k}*${k}/(${x0}*${x0}-${y0}*${y0})` }
        });
      }
      const A = d.int(2, 20), Bd = d.int(2, 20), [s, r] = sqParts(A * Bd);
      if (A === Bd || s < 2 || r < 2) return null;
      return radPos(`쌍곡선 ${hypH(A, Bd, 1)} 위의 점 P에서의 접선이 두 점근선과 만나는 점을 각각 Q, R이라 하자. 점 P가 쌍곡선 위를 움직여도 삼각형 ORQ의 넓이는 일정하다. 이 넓이는? (단, O는 원점이다.)`, s, r, {
        explain: `P(x₁, y₁)에서의 접선이 두 점근선 ${nb(Y + ' = ±' + frac(vb, va) + X)}와 만나는 두 점을 구해 넓이를 셈하면 x₁, y₁이 지워지고 ab만 남는다. a = ${rt(A)}, b = ${rt(Bd)}이므로 넓이는 ${rt(A * Bd)} = ${radText(s, r)}이다.`,
        facts: { calc: [[`(${A}*${Bd}/${r})**0.5`, 0], [`${A}*${Bd}/${s}/${s}`, 1]], derived: [s, r, 0.5] }
      });
    }, { count: 2 })
  ]);

  // ── 이차곡선 ──
  // 원·포물선·타원·쌍곡선을 전개한 이차방정식의 계수 [x², y², x, y, 상수]
  function conicOf(d, kind) {
    const p = d.int(-4, 4), q = d.int(-4, 4);
    if (kind === '원') { const r = d.int(1, 4); return [1, 1, -2 * p, -2 * q, p * p + q * q - r * r]; }
    if (kind === '포물선') { const k = d.pick([-2, -1, 1, 2]); return d.bool() ? [0, 1, -4 * k, -2 * q, q * q + 4 * k * p] : [1, 0, -2 * p, -4 * k, p * p + 4 * k * q]; }
    if (kind === '타원') { const [P, Qc] = d.pick([[1, 4], [4, 1], [1, 2], [2, 1], [4, 9], [9, 4], [1, 9], [9, 1]]), R = P * Qc * d.int(1, 2); return [P, Qc, -2 * P * p, -2 * Qc * q, P * p * p + Qc * q * q - R]; }
    const [P, Qc] = d.pick([[1, 1], [1, 4], [4, 1], [9, 16], [16, 9], [1, 2], [2, 1], [9, 4], [4, 9]]), R = P * Qc * d.pick([1, -1]);
    return [P, -Qc, -2 * P * p, 2 * Qc * q, P * p * p - Qc * q * q - R];
  }
  const conicH = (co) => nb(poly([[co[0], X2], [co[1], Y2], [co[2], X], [co[3], Y], [co[4], '']]) + ' = 0');
  B.addTypes(UNIT, 'conic', [
    // ②20 이차방정식이 나타내는 도형: #0 원·포물선·타원·쌍곡선 가리기, #1 이차곡선이 아닌 경우(한 점·없음·두 직선 — 교과서 56쪽 참고)
    T('conic-kind', '이차방정식이 나타내는 도형 가리기', '②20', (d, n) => {
      if (n === 0) {
        const kinds = d.shuffle(['원', '포물선', '타원', '쌍곡선']), cos = kinds.map((k) => conicOf(d, k));
        if (cos.some((co) => co.some((v) => Math.abs(v) > 40)) || cos.some((co) => co[4] === 0)) return null;
        const right = kinds.join(', '), perms = [];
        while (perms.length < 4) { const s = d.shuffle(kinds.slice()).join(', '); if (s !== right && !perms.includes(s)) perms.push(s); }
        return pickOne(d, `다음 방정식이 나타내는 도형을 ${CIR.slice(0, 4).join(', ')}의 차례로 나열한 것은?`, right, perms, {
          figure: rowsFig(cos.map(conicH), CIR),
          explain: cos.map((co, i) => `${CIR[i]}은 ` + (co[0] === 0 || co[1] === 0 ? 'x², y² 가운데 하나만 있으므로 포물선' : co[0] === co[1] ? 'x², y²의 계수가 같으므로 원' : co[0] * co[1] > 0 ? 'x², y²의 계수의 부호가 같고 크기가 다르므로 타원' : 'x², y²의 계수의 부호가 다르므로 쌍곡선')).join(', ') + `이다(어느 것이나 완전제곱식으로 고치면 그 곡선의 표준형이 된다).`
        });
      }
      const k = d.int(1, 3), c = d.int(1, 9), P = d.int(1, 5), Qc = d.int(1, 5), R = d.int(1, 12);
      const fam = {
        point: [`${nb(X2 + ' + ' + (k * k === 1 ? '' : k * k) + Y2 + ' = 0')}의 그래프는 한 점이다.`, `${nb(X2 + ' + ' + (k * k === 1 ? '' : k * k) + Y2 + ' = 0')}의 그래프는 원이다.`],
        lines: [`${nb(X2 + ' ' + MINUS + ' ' + (k * k === 1 ? '' : k * k) + Y2 + ' = 0')}의 그래프는 두 직선이다.`, `${nb(X2 + ' ' + MINUS + ' ' + (k * k === 1 ? '' : k * k) + Y2 + ' = 0')}의 그래프는 쌍곡선이다.`],
        none: [`${nb(X2 + ' + ' + Y2 + ' + ' + c + ' = 0')}을 만족시키는 점 ${pt(X, Y)}는 없다.`, `${nb(X2 + ' + ' + Y2 + ' + ' + c + ' = 0')}의 그래프는 원이다.`],
        hyp: [`${genH(P, Qc, R)}의 그래프는 쌍곡선이다.`, `${nb(poly([[P, X2], [Qc, Y2]]) + ' = ' + R)}의 그래프는 쌍곡선이다.`]
      };
      const picks = d.shuffle(Object.keys(fam)).slice(0, 3), rows = picks.map((f) => { const t = d.bool(); return [fam[f][t ? 0 : 1], t]; });
      return pickSets(d, 'x, y에 대한 이차방정식에 대하여 보기에서 옳은 것만을 있는 대로 고른 것은?', rows, {
        explain: `x² + ky² = 0(k &gt; 0)을 만족시키는 점은 (0, 0) 하나뿐이고, x² ${MINUS} k²y² = 0은 (x ${MINUS} ky)(x + ky) = 0으로 인수분해되어 두 직선이며, x² + y² + c = 0(c &gt; 0)은 만족시키는 점이 없다. Px² ${MINUS} Qy² = R(P, Q, R &gt; 0)은 쌍곡선이고 Px² + Qy² = R은 원 또는 타원이다.`
      });
    }, { count: 2 }),
    // ②22 교과서 창의·연계 프로젝트(62~63쪽): 원 밖의 점으로 종이를 접어 만드는 곡선
    T('conic-fold', '종이접기로 만드는 곡선', '②22', (d) => {
      const right = '두 점 O, F를 초점으로 하는 쌍곡선';
      return pickOne(d, '종이에 중심이 O인 원을 그리고 원의 외부에 점 F를 찍는다. 원 위의 점 A를 점 F에 겹치도록 종이를 접었다 펼 때, 직선 OA와 접은 자국이 만나는 점을 P라 하자. 원 위의 점 A를 바꾸어 가며 같은 일을 할 때, 점 P들이 놓이는 곡선은?', right,
        ['두 점 O, F를 초점으로 하는 타원', '점 F를 초점으로 하는 포물선', '점 O를 중심으로 하는 원', '선분 OF를 지름으로 하는 원'], {
          explain: '접은 자국은 선분 AF의 수직이등분선이므로 PF = PA이다. 따라서 |PO − PF| = |PO − PA| = OA(원의 반지름의 길이)로 일정하므로, 점 P는 두 점 O, F에 이르는 거리의 차가 일정한 곡선, 곧 O, F를 초점으로 하는 쌍곡선 위에 있다.'
        });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
