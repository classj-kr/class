// 고등학교 기하 Ⅰ-1 포물선 — 실력 문제.
// 단원 틀·싣는 기준·뺀 것과 까닭은 11-4-1a.js 머리에 적었다. 도구는 B.kit.u1141(a 파일)을 쓴다.
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번. 이 단원에는 심화 문서(기출 모의고사)가 없어 실력 문항도 모두 기본 문서(대단원·중단원 평가의 끝 문제,
// 교과서 중단원 확인하기의 끝 문제, 소단원 평가)에서 왔다.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 「초점까지의 거리 = 준선까지의 거리」를 준선이 아닌 y축(꼭짓점을 지나는 직선)까지의 거리로 바꾼다.
//  - 문제에 점 F(0, p)처럼 초점이 이름 없이 주어지면 초점인 줄 모르고, 꺾인 선 PF + PA를 곧은 선으로 펴는 길을 찾지 못한다.
//  - 두 포물선의 초점이 같은 점(원점)이라는 것을 알아채지 못하고 교점의 좌표를 근호로 직접 셈한다.
//  - (y − a + c)² = (a + b)x + d 꼴에서 4p가 a + b임을 놓치거나, 초점과 준선 사이의 거리를 p로 둔다(2|p|이다).
//  - 선분과 포물선의 두 교점 가운데 선분 위에 있지 않은 것을 함께 답한다.
// 실력에 둔 까닭: ① 문제의 장치에 함정이 있어 배운 뜻을 정확히 대야 풀리는 것, ② 세 단계 넘게 이어 생각해야 풀리는 것만 남겼다(유형마다 주석).
// ①18 은 사용자 결정으로 실력.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines } = B.kit;
  const { MINUS, Q, qadd, qsub, qmul, fl, nb, V, sup, nz, rt, radText, SG } = B.kit.mid;
  const { coordAns, plot, jh, sub } = B.kit.hs;
  const K = B.kit.u1141;
  const { S1, S4, H, X, Y, Av, Bv, Pv, Kv, iq, jn, pn, is, cpt, npt, parH, parV, eqx, eqy, vals, cells, posA, pickOne, BLUE, RED, hpar, vpar } = K;
  const F1 = 'F' + sub(1), F2 = 'F' + sub(2);

  const hard = [
    // ② C₁의 꼭짓점·초점 → C₂의 초점 → 맞추기 → C₁의 초점을 C₂에 넣어 p 까지 네 단계를 잇는다(중단원 평가 10).
    H('hard-c1c2', '한 포물선의 초점·꼭짓점이 다른 포물선의 점·초점일 때', '①17', (d) => {
      const k = 8 * d.pick([1, 2, 3]) * d.pick([1, -1]), m = nz(d, -5, 5), nn = nz(d, -5, 5), p = Math.abs(k) / 8;
      const C1 = `C${sub(1)}: ${parH(k, m, nn)}`, C2 = `C${sub(2)}: ${nb(`(${X} ${MINUS} ${Av})${sup(2)} = 4${Pv}(${Y} ${MINUS} ${Bv})`)}`;
      return vals(`두 포물선 C${sub(1)}, C${sub(2)}에 대하여 포물선 C${sub(1)}의 초점은 포물선 C${sub(2)} 위에 있고, 포물선 C${sub(1)}의 꼭짓점은 포물선 C${sub(2)}의 초점과 일치한다. 상수 ${Av}, ${Bv}, ${Pv}의 값을 구하시오.`, [[Av, m], [Bv, nn - p], [Pv, p, true]], {
        figure: lines([C1, C2 + ' ' + nb(`(${Pv} &gt; 0)`)]),
        explain: `C${sub(1)}의 꼭짓점은 ${cpt(m, nn)}, 초점은 ${cpt(m + k / 4, nn)}이다. C${sub(2)}의 초점 ${jh(cpt(Av, nb(`${Bv} + ${Pv}`)), '이/가')} C${sub(1)}의 꼭짓점이므로 ${is(Av, m)}, ${nb(`${Bv} + ${Pv} = ${iq(nn)}`)}이다. C${sub(1)}의 초점을 C${sub(2)}에 넣으면 ${nb(`${pn(k / 4)}${sup(2)} = 4${Pv}(${iq(nn)} ${MINUS} ${Bv}) = 4${Pv}${sup(2)}`)}이고 ${nb(`${Pv} &gt; 0`)}이므로 ${is(Pv, p)}, ${is(Bv, nn - p)}이다.`,
        facts: { calc: [[jn(m), 0], [`${jn(nn)}-${Math.abs(k)}/8`, 1], [`${Math.abs(k)}/8`, 2]], derived: [8] } });
    }),

    // 사용자 결정으로 실력: 원점을 지나는 조건(a 두 값)과 초점·준선 사이의 거리 조건(a + b 두 값)을 함께 따져 a − b 의 최댓값·최솟값을 가린다.
    H('hard-ab', '원점을 지나고 초점과 준선 사이의 거리가 주어진 포물선', '①18', (d) => {
      const c = d.int(-3, 3), q = d.int(1, 3), D = d.int(1, 3);
      const Mx = 2 * (c + q) + 2 * D, mn = 2 * (c - q) - 2 * D;
      const lhs = `(${Y} ${MINUS} ${Av}${c === 0 ? '' : c > 0 ? ' + ' + c : ' ' + MINUS + ' ' + (-c)})${sup(2)}`;
      const E = nb(`C: ${lhs} = (${Av} + ${Bv})${X} + ${q * q}`);
      const Mv2 = V('M'), mv2 = V('m');
      return vals(`실수 ${Av}, ${Bv}에 대하여 포물선 ${jh(E, '이/가')} 원점을 지나고, 포물선 C의 초점과 준선 사이의 거리가 ${D}이다. ${nb(`${Av} ${MINUS} ${Bv}`)}의 최댓값을 ${Mv2}, 최솟값을 ${mv2}이라 할 때, ${Mv2}, ${mv2}의 값을 구하시오. ${nb(`(단, ${Av} + ${Bv} ≠ 0)`)}`, [[Mv2, Mx], [mv2, mn]], {
        explain: `원점을 지나므로 ${nb(`(${iq(c)} ${MINUS} ${Av})${sup(2)} = ${q * q}`)}, 곧 ${is(Av, c + q)} 또는 ${is(Av, c - q)}이다. 우변은 ${nb(`(${Av} + ${Bv})(${X} + ${frac(q * q, `${Av} + ${Bv}`)})`)}이므로 ${nb(`4${Pv} = ${Av} + ${Bv}`)}이고, 초점과 준선 사이의 거리 ${nb(`|2${Pv}| = ${frac(`|${Av} + ${Bv}|`, 2)} = ${D}`)}에서 ${nb(`${Av} + ${Bv} = ±${2 * D}`)}이다. ${nb(`${Av} ${MINUS} ${Bv} = 2${Av} ${MINUS} (${Av} + ${Bv})`)}이므로 최댓값은 ${nb(`2 × ${pn(c + q)} + ${2 * D} = ${iq(Mx)}`)}, 최솟값은 ${nb(`2 × ${pn(c - q)} ${MINUS} ${2 * D} = ${iq(mn)}`)}이다.`,
        facts: { calc: [[`2*(${jn(c)}+${q})+2*${D}`, 0], [`2*(${jn(c)}-${q})-2*${D}`, 1]], derived: [2, q] } });
    }),

    // ② 초점 둘 → 거리 조건으로 a → 직선 F₁F₂ → 포물선과의 두 교점 가운데 선분 위의 것 고르기까지 네 단계(교과서 중단원 확인하기 13). 답의 칸 모양이 흔들려 고르기로 낸다.
    H('hard-seg', '두 초점을 잇는 선분과 포물선의 교점', '①20', (d) => {
      const q = d.pick([-1, -2, -3]), [dd, h, L] = d.pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13]]), k1 = 4 * (q + dd);
      const s = Q(2 * Math.abs(q) * (L - dd), h * h), s2 = Q(2 * q * (dd + L), h * h);
      if (fl(s) <= 0 || fl(s) >= 1 || k1 <= 0) return null;
      const at = (t) => [qadd(Q(q), qmul(Q(dd), t)), qmul(Q(h), t)];
      const P0 = at(s), P1 = at(s2), mirror = [P0[0], qmul(Q(-1), P0[1])], midp = at(Q(1, 2));
      const onB = ([x, y]) => { const l = qmul(y, y), r = qmul(Q(4 * q), x); return l.p === r.p && l.q === r.q; };
      const onSeg = ([x, y]) => { const t = qmul(qsub(x, Q(q)), Q(1, dd)), y2 = qmul(Q(h), t); return y2.p === y.p && y2.q === y.q && fl(t) >= 0 && fl(t) <= 1; };
      const rows = [P0, P1, mirror, midp].map((pt) => ({ h: cpt(pt[0], pt[1]), ok: onB(pt) && onSeg(pt) }));
      const A1 = nb(`(${Y} ${MINUS} ${Av})${sup(2)} = ${iq(k1)}${X}`);
      return pickOne(d, `양수 ${Av}에 대하여 포물선 ${A1}의 초점을 ${F1}, 포물선 ${parH(4 * q)}의 초점을 ${F2}라 하고, 선분 ${F1}${F2}가 포물선 ${jh(parH(4 * q), '과/와')} 만나는 점을 P라 하자. 선분 ${F1}${F2}의 길이가 ${L}일 때, 점 P의 좌표는?`, rows, {
        explain: `${npt(F1, q + dd, Av)}, ${npt(F2, q, 0)}이므로 ${nb(`${dd}${sup(2)} + ${Av}${sup(2)} = ${L}${sup(2)}`)}, ${is(Av, h)}이다. 선분 위의 점을 ${nb(`(${iq(q)} + ${dd}${V('t')}, ${h}${V('t')})`)} ${nb(`(0 ≤ ${V('t')} ≤ 1)`)}로 놓고 ${jh(parH(4 * q), '에/에')} 넣으면 ${is(V('t'), s)} 또는 ${is(V('t'), s2)}이다. ${nb(`0 ≤ ${V('t')} ≤ 1`)}인 것은 ${is(V('t'), s)}이므로 점 P는 ${cpt(P0[0], P0[1])}이다.` });
    }),

    // ① 함정: 수선의 발이 준선이 아니라 y축 위에 있다(초점까지의 거리는 준선과 y축 사이의 거리 |p|를 더해야 한다). 중단원 평가 9.
    H('hard-ychord', '초점을 지나는 직선과 y축에 내린 수선으로 현의 길이', '①27', (d) => {
      const [ap, u, v] = d.pick([[2, 4, 1], [3, 9, 1], [4, 8, 2], [4, 16, 1], [6, 12, 3], [6, 9, 4]]), sg = d.pick([1, -1]), p = sg * ap, k = 4 * p;
      const [uu, vv] = d.bool() ? [u, v] : [v, u];
      const xA = sg * uu, yA = 2 * Math.sqrt(ap * uu), xB = sg * vv, yB = -2 * Math.sqrt(ap * vv), ans = uu + vv + 2 * ap;
      const xs = [xA, xB, p, 0], lo = Math.min(...xs) - 1.2, hi = Math.max(...xs) + 1.2;
      const fig = plot({ x: [lo, hi], y: [yB - 1.2, yA + 1.2], u: Math.min(204 / (hi - lo), 290 / (yA - yB + 2.4)), params: [hpar(k, 0, 0, yB - 1.2, yA + 1.2)],
        segs: [{ p: [xA, yA], q: [xB, yB], color: '#1f2933' }, { p: [xA, yA], q: [0, yA], dash: true }, { p: [xB, yB], q: [0, yB], dash: true }],
        dots: [{ x: xA, y: yA, name: 'A' }, { x: xB, y: yB, name: 'B' }, { x: 0, y: yA, name: 'H', side: sg > 0 ? 'ul' : 'ur' }, { x: 0, y: yB, name: 'I', side: sg > 0 ? 'dl' : 'dr' }, { x: p, y: 0, name: 'F' }],
        say: '직선 AB는 포물선의 초점 F를 지나고, 두 점 H, I는 점 A, B에서 y축에 내린 수선의 발이다.' });
      return posA(`그림과 같이 포물선 ${parH(k)}의 초점 F를 지나는 직선이 포물선과 만나는 두 점을 각각 A, B라 하고, 두 점 A, B에서 y축에 내린 수선의 발을 각각 H, I라 하자. ${nb(`${SG('AH')} = ${uu}`)}, ${nb(`${SG('BI')} = ${vv}`)}일 때, 선분 AB의 길이는?`, ans, {
        figure: fig, explain: `준선은 y축이 아니라 ${eqx(-p)}이다. ${SG('AF')}는 점 A에서 준선까지의 거리이므로 ${nb(`${SG('AH')} + ${ap} = ${uu + ap}`)}, 같은 방법으로 ${nb(`${SG('BF')} = ${vv + ap}`)}이다. 점 F가 선분 AB 위에 있으므로 ${nb(`${SG('AB')} = ${uu + ap} + ${vv + ap} = ${ans}`)}이다.`,
        facts: { value: `${uu}+${vv}+2*${Math.abs(k)}/4`, derived: [2, 4] } });
    }),

    // ① 함정: 점 F가 초점이라는 말 없이 주어진다. PF를 준선까지의 거리로 바꿔야 꺾인 선이 곧은 선이 된다(교과서 중단원 확인하기 14 — 창의적 문제해결).
    //   차례 1: 최소가 되는 점 P(x² = 4py), 차례 2: 최솟값(y² = 4px).
    H('hard-min', 'PF + PA가 최소가 되는 경우', '①30', (d, n) => {
      const p = d.int(1, 3), k = 4 * p;
      if (n === 0) {
        const ax = nz(d, -6, 6), py = ax * ax / (4 * p), ay = d.int(Math.floor(py) + 1, Math.floor(py) + 4);
        if (!Number.isInteger(py) || ay > 9 || ay === p) return null;
        const lo = Math.min(-1.5, ax - 1.5), hi = Math.max(1.5, ax + 1.5);
        const fig = plot({ x: [lo, hi], y: [-0.8, ay + 1.2], w: 250, curves: [vpar(k, 0, 0, lo, hi)],
          dots: [{ x: ax, y: ay, name: 'A', side: ax > 0 ? 'ur' : 'ul' }, { x: 0, y: p, name: 'F', side: ax > 0 ? 'ul' : 'ur' }] });
        return coordAns(`그림과 같이 포물선 ${parV(k)}와 두 점 ${npt('A', ax, ay)}, ${jh(npt('F', 0, p), '이/가')} 있다. 점 P가 이 포물선 위를 움직일 때, ${nb(`${SG('PF')} + ${SG('PA')}`)}가 최소가 되는 점 P의 좌표를 구하시오.`, [ax, py], {
          figure: fig, explain: `점 F는 포물선 ${parV(k)}의 초점이고 준선은 ${eqy(-p)}이다. 점 P에서 준선에 내린 수선의 발을 H라 하면 ${nb(`${SG('PF')} = ${SG('PH')}`)}이므로 ${nb(`${SG('PF')} + ${SG('PA')} = ${SG('PH')} + ${SG('PA')}`)}는 점 A에서 준선까지의 거리 ${ay + p}보다 작을 수 없다. 같아지는 것은 점 P가 점 A에서 준선에 내린 수선 위에 있을 때이므로 점 P는 ${cpt(ax, py)}이다.`,
          facts: { calc: [[jn(ax), 0], [`${jn(ax)}*${jn(ax)}/${k}`, 1]] } });
      }
      const ay = nz(d, -5, 5), ax = d.until(() => d.int(1, 8), (t) => ay * ay < 4 * p * t && t !== p);
      return posA(`포물선 ${parH(k)}와 두 점 ${npt('A', ax, ay)}, ${jh(npt('F', p, 0), '이/가')} 있다. 점 P가 이 포물선 위를 움직일 때, ${nb(`${SG('PF')} + ${SG('PA')}`)}의 최솟값은?`, ax + p, {
        explain: `점 F는 포물선 ${parH(k)}의 초점이고 준선은 ${eqx(-p)}이다. 점 P에서 준선에 내린 수선의 발을 H라 하면 ${nb(`${SG('PF')} + ${SG('PA')} = ${SG('PH')} + ${SG('PA')}`)}이고, 이 값은 점 A에서 준선까지의 거리 ${nb(`${ax} + ${p} = ${ax + p}`)}보다 작을 수 없다(점 P가 점 A를 지나고 x축에 평행한 직선 위에 있을 때 같아진다). 최솟값은 ${ax + p}이다.`,
        facts: { value: `${ax}+${k}/4`, derived: [4] } });
    }, { count: 2 }),

    // ① 함정: 두 포물선의 초점이 모두 원점이라는 것을 알아채야 CO, DO를 준선까지의 거리로 바꿔 한 번에 모은다(소단원 평가 1-1-1의 8).
    H('hard-twin', '초점이 같은 두 포물선과 수평선이 만든 삼각형의 둘레', '①31', (d) => {
      const a = d.int(1, 5), b = d.int(1, 5), h2 = d.pick([2, 3, 5, 6, 7, 10]), h = Math.sqrt(h2);
      const xC = -a + h2 / (4 * a), xD = b - h2 / (4 * b);
      if (!(xC < xD - 0.4) || Math.abs(xC) < 0.3 || Math.abs(xD) < 0.3) return null;
      const lo = Math.min(-a, xC) - 1, hi = Math.max(b, xD) + 1, top = h + 1.6;
      const fig = plot({ x: [lo, hi], y: [-top, top], w: 270, params: [hpar(4 * a, -a, 0, -top, top), hpar(-4 * b, b, 0, -top, top, { color: RED })],
        lines: [{ y: h, dash: true, said: `y축 위의 √${h2}인 점을 지나고 x축에 평행한 직선` }],
        segs: [{ p: [xC, h], q: [0, 0], color: '#1f2933' }, { p: [xD, h], q: [0, 0], color: '#1f2933' }],
        dots: [{ x: xC, y: h, name: 'C', side: 'ul' }, { x: xD, y: h, name: 'D', side: 'ur' }],
        say: `파란 포물선은 꼭짓점이 (${MINUS}${a}, 0)이고 오른쪽으로 열려 있고, 빨간 포물선은 꼭짓점이 (${b}, 0)이고 왼쪽으로 열려 있다.` });
      return posA(`그림과 같이 두 포물선 ${parH(4 * a, -a, 0)}, ${jh(parH(-4 * b, b, 0), '이/가')} 직선 ${jh(nb(`${Y} = ${rt(h2)}`), '과/와')} 만나는 점을 각각 C, D라 할 때, 삼각형 COD의 둘레의 길이는? ${nb('(단, O는 원점이다.)')}`, 2 * (a + b), {
        figure: fig, explain: `두 포물선의 초점은 ${nb(`(${MINUS}${a} + ${a}, 0)`)}, ${nb(`(${b} ${MINUS} ${b}, 0)`)}으로 모두 원점이고, 준선은 ${eqx(-2 * a)}, ${eqx(2 * b)}이다. 점 C, D에서 두 준선에 내린 수선의 발을 각각 H${sub(1)}, H${sub(2)}라 하면 ${nb(`${SG('CO')} = ${SG('CH')}${sub(1)}`)}, ${nb(`${SG('DO')} = ${SG('DH')}${sub(2)}`)}이므로 둘레는 ${nb(`${SG('CH')}${sub(1)} + ${SG('CD')} + ${SG('DH')}${sub(2)}`)}, 곧 두 준선 사이의 거리 ${nb(`${2 * b} + ${2 * a} = ${2 * (a + b)}`)}이다.`,
        facts: { value: `2*(${a}+${b})`, derived: [2] } });
    }),

    // ② 교점 P, Q 를 k 로 나타내기 → 두 관계에서 a = −2b → 기울기 조건으로 k → 준선까지의 거리, 다섯 단계(중단원 평가 14).
    H('hard-k', '두 포물선의 초점과 x² = ky 와의 교점 사이의 거리', '①33', (d) => {
      const q = d.pick([1, 2, 3, 5, 6, 7]), mm = d.pick([8, 18]), mc = mm === 8 ? 2 : 3;      // 기울기 mc√2, mm = 기울기의 제곱
      const L1 = Q(2 * q * (1 + mm), mm), L2 = Q(q * mm + 4 * q, 4 * mm);
      return cells(`양수 ${Kv}에 대하여 두 포물선 ${parH(8 * q)}, ${parH(-q)}의 초점을 각각 ${F1}, ${F2}라 하고, 두 포물선이 포물선 ${nb(`${X}${sup(2)} = ${Kv}${Y}`)}와 만나는 점 가운데 원점이 아닌 점을 각각 P, Q라 하자. 직선 PQ의 기울기가 ${radText(mc, 2)}일 때, 두 선분 ${F1}P, ${F2}Q의 길이를 구하시오.`,
        [[`${F1}P`, L1, 'f', true], [`${F2}Q`, L2, 'f', true]], {
          explain: `${nb(`P(${Av}, ${frac(Av + sup(2), Kv)})`)}, ${jh(nb(`Q(${Bv}, ${frac(Bv + sup(2), Kv)})`), '으로/로')} 놓으면 ${nb(`${Av}${sup(3)} = ${8 * q}${Kv}${sup(2)}`)}, ${nb(`${Bv}${sup(3)} = ${MINUS}${q === 1 ? '' : q}${Kv}${sup(2)}`)}에서 ${nb(`${Av} = ${MINUS}2${Bv}`)}이다. 기울기 ${nb(`${frac(`${Av} + ${Bv}`, Kv)} = ${radText(mc, 2)}`)}에서 ${nb(`${Bv} = ${MINUS}${radText(mc, 2)}${Kv}`)}이고, 이것을 다시 넣으면 ${nb(`${Av} = ${iq(Q(2 * q, mm))}`)}, ${nb(`${Bv} = ${iq(Q(-q, mm))}`)}이다. 준선 ${eqx(-2 * q)}, ${eqx(Q(q, 4))}까지의 거리로 ${nb(`${F1}P = ${iq(Q(2 * q, mm))} + ${2 * q} = ${iq(L1)}`)}, ${nb(`${F2}Q = ${iq(Q(q, 4))} + ${iq(Q(q, mm))} = ${iq(L2)}`)}이다.`,
          facts: { calc: [[String(L1.p), 0], [String(L1.q), 1], [String(L2.p), 2], [String(L2.q), 3]], derived: [L1.p, L1.q, L2.p, L2.q] } });
    }),

    // ② 직선의 기울기를 직각삼각형의 세 변의 비로 읽기 → 원의 중심 → 점 P 까지 → PF = PP′(정의) → 닮음으로 2p, 다섯 단계(중단원 평가 16).
    H('hard-circle', '초점을 지나는 직선 위에 중심이 있고 준선에 접하는 원', '①34', (d) => {
      const [a, b, c] = d.pick([[3, 4, 5], [4, 3, 5]]), r = d.int(1, 4), p = r * (c + a) ** 2 / (2 * c * c), pq = Q(r * (c + a) ** 2, 2 * c * c);
      const yBv = (b / a) * 2 * p, xA = -p + r, yA = yBv - (b / a) * r, xP = xA + r * a / c, yP = yA - r * b / c;
      if (Math.abs(yP * yP - 4 * p * xP) > 1e-6 || yP <= 0 || xP <= 0) return null;
      const lo = -p - 0.9, hi = Math.max(xP, p) + 1.6, ylo = -1, yhi = Math.max(yBv, yA + r) + 0.7;
      const fig = plot({ x: [lo, hi], y: [ylo, yhi], w: 260, params: [hpar(4 * p, 0, 0, ylo, yhi), { x: (t) => xA + r * Math.cos(t), y: (t) => yA + r * Math.sin(t), color: '#15803d', name: 'C', at: 2.4 }],
        lines: [{ p: [p, 0], q: [-p, yBv], name: 'l', color: '#1f2933' }, { x: -p, dash: true }],
        dots: [{ x: p, y: 0, name: 'F', side: 'ur' }, { x: xP, y: yP, name: 'P', side: 'r' }],
        say: '원 C는 점 P를 지나고 중심이 직선 l 위에 있으며 포물선의 준선(점선)에 접한다.' });
      return posA(`그림과 같이 꼭짓점이 원점 O이고 초점이 ${npt('F', Pv, 0)} ${nb(`(${Pv} &gt; 0)`)}인 포물선이 있다. 점 F를 지나고 기울기가 ${nb(MINUS + frac(b, a))}인 직선 l이 포물선과 만나는 점 가운데 제1사분면 위의 점을 P라 할 때, 점 P를 지나고 중심이 직선 l 위에 있는 원 C는 포물선의 준선에 접한다. 원 C의 반지름의 길이가 ${r}일 때, ${Pv}의 값은? (단, 원 C의 중심의 x좌표는 점 P의 x좌표보다 작다.)`, pq, {
        figure: fig, explain: `직선 l과 준선의 교점을 B, 원의 중심을 A라 하자. 기울기가 ${MINUS}${frac(b, a)}이므로 직선 l 위에서 가로로 ${a}만큼 갈 때 선분의 길이는 ${c}만큼이다. 점 A에서 준선까지의 거리가 ${r}이므로 ${nb(`${SG('BA')} = ${iq(Q(r * c, a))}`)}, ${nb(`${SG('BP')} = ${iq(Q(r * c, a))} + ${r} = ${iq(Q(r * (c + a), a))}`)}이다. 점 P에서 준선까지의 거리는 ${nb(`${iq(Q(r * (c + a), a))} × ${frac(a, c)} = ${iq(Q(r * (c + a), c))}`)}이고 이것이 ${jh(SG('PF'), '과/와')} 같으므로 ${nb(`${SG('BF')} = ${iq(Q(r * (c + a) ** 2, a * c))}`)}이다. 준선에서 F까지의 거리 ${nb(`2${Pv} = ${iq(Q(r * (c + a) ** 2, a * c))} × ${frac(a, c)}`)}에서 ${is(Pv, pq)}이다.`,
        facts: { value: `${r}*(${c}+${a})*(${c}+${a})/(2*${c}*${c})`, derived: [c, 2] } });
    }),

    // ② 접점 연립 → 두 접점 → 변의 길이·점과 직선 사이의 거리 → 넓이, 네 단계(소단원 평가 1-1-2의 7).
    H('hard-touch', '밖의 점에서 그은 두 접선의 접점과 그 점이 만든 삼각형의 넓이', '②24', (d) => {
      const p = d.pick([1, 3]), t1 = d.int(-3, 3), t2 = d.until(() => d.int(-3, 3), (t) => t !== t1 && Math.abs(t - t1) % 2 === 1 && Math.abs(t - t1) <= 5), k = 4 * p;
      // 접점이 꼭짓점이면 그 접선은 y축(기울기가 없다)이라 공식 y = mx + p/m 으로 찾을 수 없다 — 두 접점 모두 꼭짓점이 아니게 한다.
      if (t1 === 0 || t2 === 0) return null;
      const x0 = p * t1 * t2, y0 = p * (t1 + t2), gap = Math.abs(t1 - t2), area = Q(p * p * gap ** 3, 2);
      if (area.q === 1 || area.p / area.q > 400) return null;
      const A0 = [p * t1 * t1, 2 * p * t1], B0 = [p * t2 * t2, 2 * p * t2];
      return posA(`점 ${npt('P', x0, y0)}에서 포물선 ${parH(k)}에 그은 두 접선의 접점을 각각 A, B라 할 때, 삼각형 APB의 넓이는?`, area, {
        explain: `접점을 ${nb(`(${V('x')}${sub(1)}, ${V('y')}${sub(1)})`)}이라 하면 접선 ${nb(`${V('y')}${sub(1)}${Y} = ${2 * p}(${X} + ${V('x')}${sub(1)})`)}이 점 P를 지나고 ${nb(`${V('y')}${sub(1)}${sup(2)} = ${k}${V('x')}${sub(1)}`)}이므로, 연립하면 두 접점은 ${npt('A', A0[0], A0[1])}, ${npt('B', B0[0], B0[1])}이다. 세 꼭짓점의 좌표로 넓이를 구하면 ${iq(area)}이다.`,
        facts: { value: `(${k}/4)*(${k}/4)*${gap}*${gap}*${gap}/2`, derived: [4, 2, gap] } });
    }, { standard: S4 })
  ];

  B.addGroup('11-4-1', { id: 'hard', title: '실력 문제', standard: S1, types: hard });
})(typeof window !== 'undefined' ? window : globalThis);
