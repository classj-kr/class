// 중학교 1학년 1학기 5단원 좌표평면과 그래프 — 실력 문항.
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 7-1-5a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번, 교n = 미래엔 2015 교과서 n쪽.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - x축 위의 점은 x좌표가 0이라고 거꾸로 댄다(y좌표가 0이다). 「원점이 아니다」를 「양수이다」로 옮긴다.
//  - 「어느 사분면에도 속하지 않는다」를 한 좌표축 위에 있는 것으로만 여긴다(x축 위에 있거나 y축 위에 있다).
//  - 대칭인 점을 구할 때 x축에 대하여 대칭이면 x좌표의 부호를 바꾼다(y좌표의 부호만 바뀐다).
//  - 삼각형의 높이를 꼭짓점의 좌표 가운데 아무것이나, 또는 비스듬한 변의 길이로 잡는다(높이는 밑변을 늘인 직선까지의 거리이다).
//  - 그래프가 올라가면 「빠르다」고 읽는다(올라가는 것은 늘어나는 것이고, 빠르기는 가파르기이다). 가장 높은 곳을 가장 많이 변한 곳으로 읽는다.
//  - 수평인 구간은 언제나 멈춘 것이라고 읽는다(세로축이 속력이면 수평은 같은 속력으로 움직이는 것이고, 멈춘 때는 속력이 0인 때이다).
//  - 그래프의 모양을 길의 모양으로 읽는다. 「집에서 떨어진 거리」의 끝 값을 이동한 거리로 읽는다(되돌아간 만큼도 이동한 거리이다).
//  - 세로축이 「남은 거리」「달린 거리」인데도 「집에서 떨어진 거리」로 읽는다(축이 나타내는 양부터 읽어야 한다).
//  - 늦게 출발한 사람의 그래프도 원점에서 시작한다고 여긴다(가로축 위의 점에서 시작한다). 만난 때를 늦게 출발한 사람이 걸린 시간으로 읽는다.
//  - 물을 빼낼 때에도 넣을 때의 그래프를 고른다. 그래프가 꺾이는 점의 가로의 값(시간)을 그릇의 폭이 바뀌는 높이로 읽는다.
//
// 실력에는 ① 문제의 상황·그림에 함정이 있어 뜻을 정확히 대야 풀리는 문제와 ② 두 번 넘게 생각해야 풀리는 문제(부호 조건 둘로 부호 정하기, 사분면에서 부호를 한 번 거꾸로 구하기,
// 좌표를 읽어 식에 넣은 새 점 찾기, 좌표의 차로 밑변과 높이를 구하는 넓이, 둘러싼 직사각형에서 빼는 넓이, 문자를 정한 뒤의 넓이, 대칭인 점으로 만든 도형의 넓이,
// 늦게 떠난 그래프에서 같은 때의 차와 걸린 시간, 그래프가 꺾이는 곳과 그릇의 폭이 바뀌는 곳 맞추기)만 실었다.
// 기본에서 하는 일(값 하나 읽기, 사분면 하나 말하기, 설명 가리기)을 고르기로 바꾼 것은 싣지 않았다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, frac, lines, N, M, C } = B.kit;
  const { LAB, MINUS, GT, LT, range, nb, tail, nz, pm, lin, poly, pointAns, plane, graph } = B.kit.mid;
  const { UNIT, STD5, STD6, sourceOf, va, vb, vx, vy, XA, YA, XC, YC, iq, jx, pt, P, ptj, Pj, minus, span, QN, quadOf, QS, cmp0, quadQ, EX, exPoint, exQuad, exTold, exPairs, dot, allFar, NAMES4, figChoice, mini, curve, vessels, fillPts, drainPts, flat } = B.kit.m715;
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: sourceOf(ref), make }, more || {});
  const REL = `${vx}와 ${vy} 사이의 관계를 나타낸 그래프이다.`;
  const G = (xname, yname, xmax, ymax, xstep, ystep, paths) => graph({ xname, yname, xmax, ymax, xstep, ystep, paths: paths.map((p) => (Array.isArray(p) ? { pts: p } : p)) });
  const ab = va + vb, half = (n2) => (n2 % 2 ? frac(n2, 2) : String(n2 / 2));

  B.addGroup(UNIT, {
    id: 'hard', title: '단원 종합', standard: STD6,
    types: [
      // ── ① 문제의 상황·그림에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-axis-cond', '원점이 아닌 좌표축 위의 점의 조건 고르기', '심7', (d) => {
        // 함정: y축 위의 점은 y좌표가 0이라고 거꾸로 대는 아이(자리를 바꾼 보기), 「원점이 아니다」를 「양수이다」로 옮기는 아이(> 0인 보기), 「원점이 아니다」를 두 좌표 모두 0이 아닌 것으로 읽는 아이.
        const onY = d.bool(), eq = (h) => nb(`${h} = 0`), ne = (h) => nb(`${h} ≠ 0`), both = (x, y) => `${x}, ${y}`;
        const rows = d.shuffle(onY ? [[both(eq(va), ne(vb)), true], [both(ne(va), eq(vb)), false], [both(eq(va), cmp0(vb, 1)), false], [both(ne(va), ne(vb)), false]] : [[both(ne(va), eq(vb)), true], [both(eq(va), ne(vb)), false], [both(cmp0(va, 1), eq(vb)), false], [both(ne(va), ne(vb)), false]]);
        return C(`원점이 아닌 점 ${nb('P(' + va + ', ' + vb + ')')}가 ${onY ? YA : XA} 위의 점일 때, 다음 중 옳은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
          explain: onY ? `${YA} 위의 점은 ${XC}가 0이므로 ${eq(va)}이다. 원점이 아니므로 ${YC}는 0이 아니다. 곧 ${ne(vb)}이다. ${vb}는 음수일 수도 있으므로 ${cmp0(vb, 1)}이라고 할 수는 없다.` : `${XA} 위의 점은 ${YC}가 0이므로 ${eq(vb)}이다. 원점이 아니므로 ${XC}는 0이 아니다. 곧 ${ne(va)}이다. ${va}는 음수일 수도 있으므로 ${cmp0(va, 1)}이라고 할 수는 없다.`,
          facts: { truth: rows.map((r) => r[1]), want: true }
        });
      }, { standard: STD5 }),
      H('hard-no-quadrant', '어느 사분면에도 속하지 않게 하는 문자의 값 모두 구하기', '심9', (d) => {
        // 함정: 한 좌표축만 생각하는 아이. 어느 사분면에도 속하지 않는 점은 x축 위에 있거나 y축 위에 있다(y좌표가 0이거나 x좌표가 0).
        const m = d.int(2, 3), [p, q] = d.until(() => [nz(d, -5, 5), nz(d, -5, 5)], ([x, y]) => x !== y), xh = lin(m, -m * p, va), yh = lin(1, -q, va), lo = Math.min(p, q), hi = Math.max(p, q);
        const from = (v) => (v === p ? `${jx(m * p)}/${m}` : jx(q));
        return M(`점 ${nb('P(' + xh + ', ' + yh + ')')}${tail(Math.abs(q), '이/가')} 어느 사분면에도 속하지 않을 때, ${va}의 값이 될 수 있는 수를 모두 구하시오.`, [{ label: '작은 수', answer: lo, signed: true }, { label: '큰 수', answer: hi, signed: true }], {
          explain: `어느 사분면에도 속하지 않는 점은 좌표축 위의 점이다. ${XA} 위에 있으면 ${YC}가 0이므로 ${yh} = 0, ${va} = ${iq(q)}이다. ${YA} 위에 있으면 ${XC}가 0이므로 ${xh} = 0, ${va} = ${iq(p)}이다. ${va}의 값이 될 수 있는 수는 ${iq(lo)}${tail(Math.abs(lo), '과/와')} ${iq(hi)}이다.`,
          facts: { calc: [[from(lo), 0], [from(hi), 1]] }
        });
      }, { standard: STD5 }),
      H('hard-sym-point', '좌표축이나 원점에 대하여 대칭인 점', '①29·30', (d, n) => {
        // 함정: x축에 대하여 대칭인 점을 구하며 x좌표의 부호를 바꾸는 아이, 원점에 대하여 대칭인 점에서 한 좌표의 부호만 바꾸는 아이. 첫째는 좌표를, 둘째는 사분면을 묻는다.
        const [x, y] = d.until(() => [nz(d, -7, 7), nz(d, -7, 7)], ([p, q]) => Math.abs(p) !== Math.abs(q)), k = d.int(0, 2), about = [XA, YA, '원점'][k], [sx, sy] = [[x, -y], [-x, y], [-x, -y]][k];
        const why = [`${XA}에 대하여 대칭인 점은 ${XC}는 같고 ${YC}의 부호만 바뀐다.`, `${YA}에 대하여 대칭인 점은 ${YC}는 같고 ${XC}의 부호만 바뀐다.`, `원점에 대하여 대칭인 점은 ${XC}와 ${YC}의 부호가 모두 바뀐다.`][k];
        if (n === 0) return pointAns(`점 ${Pj('P', x, y, '과/와')} ${about}에 대하여 대칭인 점의 좌표는?`, sx, sy, {
          explain: `${why} 구하는 점의 좌표는 ${pt(sx, sy)}이다.`,
          facts: { calc: [[sx === x ? jx(x) : `0-${jx(x)}`, 0], [sy === y ? jx(y) : `0-${jx(y)}`, 1]], unseen: [0] }
        });
        return quadQ(`점 ${Pj('A', x, y, '과/와')} ${about}에 대하여 대칭인 점은 제몇 사분면 위의 점인가?`, quadOf(sx, sy), `${why} 대칭인 점의 좌표는 ${pt(sx, sy)}이므로 ${QN[quadOf(sx, sy)]} 위의 점이다.`);
      }, { count: 2, standard: STD5 }),
      H('hard-speedup', '빠르기가 변하는 움직임의 이동한 거리의 그래프 고르기', '심34', (d) => {
        // 함정: 「빨라진다」를 거리가 늘어나는 것으로만 읽어 곧은 선을 고르는 아이, 굽는 방향을 거꾸로 고르는 아이, 「빠르다」를 높다로(수평선), 「느려진다」를 줄어든다로(내려가는 선) 읽는 아이.
        const fast = d.bool(), g = (p) => mini('시간', '이동한 거리', 9, 7.2, [p]);
        return figChoice(d, fast ? '기차가 역에서 출발하여 점점 빨라지며 달린다. 시간에 따른 기차의 이동한 거리를 나타낸 그래프로 알맞은 것은?' : '달리던 기차가 역에 가까워지자 점점 느려지며 달린다. 시간에 따른 기차의 이동한 거리를 나타낸 그래프로 알맞은 것은?', [
          { fig: g(curve([[0, 0], [2, 0.4], [4, 1.6], [6, 3.6], [8, 6.4]])), ok: fast }, { fig: g(curve([[0, 0], [2, 2.8], [4, 4.8], [6, 6], [8, 6.4]])), ok: !fast }, { fig: g([[0, 0], [8, 6.4]]) }, { fig: g(fast ? [[0, 5], [8, 5]] : [[0, 6.4], [8, 0]]) }
        ], { explain: (tag) => (fast ? `점점 빨라지면 같은 시간 동안 이동하는 거리가 점점 많아지므로 그래프가 점점 가팔라진다. 알맞은 그래프는 ${tag}이다. 곧은 선은 빠르기가 변하지 않을 때의 그래프이다.` : `점점 느려져도 달리는 동안에는 이동한 거리가 계속 늘어나므로 그래프는 올라간다. 같은 시간 동안 이동하는 거리가 점점 적어지므로 그래프가 점점 완만해진다. 알맞은 그래프는 ${tag}이다.`) });
      }),
      H('hard-speed-stop', '시간과 속력의 그래프에서 멈추어 있던 시간 구하기', '심45 ①63', (d) => {
        // 함정: 수평인 구간을 멈춘 것으로 읽는 아이(거리의 그래프에서 하던 대로). 세로축이 속력이므로 멈춘 때는 그래프가 가로축 위에 놓인 때이다. 수평인 구간의 길이는 멈춘 시간과 다르게 정했다.
        const [fa, s, fb] = d.until(() => [d.pick([4, 6]), d.pick([2, 4, 6]), d.pick([2, 4, 6])], ([a, b, c]) => b !== a && b !== c && b !== a + c && a + b + c <= 14), v1 = d.pick([300, 400]), v2 = d.pick([200, 300]);
        const xs = [0, 2, 2 + fa, 4 + fa, 4 + fa + s, 6 + fa + s, 6 + fa + s + fb, 8 + fa + s + fb], pts = xs.map((x, i) => [x, [0, v1, v1, 0, 0, v2, v2, 0][i]]);
        return N(`다음은 어떤 버스가 한 정류장을 출발하여 두 정류장 뒤에 도착할 때까지, 출발한 지 ${vx}분 후의 속력을 분속 ${vy} m라 하고 ${REL} 이 버스가 가는 도중에 멈추어 서 있던 시간은 몇 분인가?`, s, {
          unit: '분', figure: G('시간(분)', '속력(m/분)', xs[7], Math.max(v1, v2) + 100, 2, 100, [pts]),
          explain: `세로축이 속력이므로 버스가 멈추어 서 있는 동안에는 속력이 0이다. 그래프가 가로축 위에 놓인 ${xs[3]}분부터 ${xs[4]}분까지의 ${xs[4]} − ${xs[3]} = ${s}(분) 동안 멈추어 서 있었다. 그래프가 수평인 ${xs[1]}분부터 ${xs[2]}분까지는 분속 ${v1} m의 일정한 속력으로 달린 것이다.`,
          facts: { value: `${xs[4]}-${xs[3]}` }
        });
      }),
      H('hard-path-total', '되돌아간 구간이 있는 거리의 그래프에서 이동한 거리 구하기', '심38 ①59', (d) => {
        // 함정: 그래프의 끝 값(도서관까지의 거리)을 이동한 거리로 답하는 아이, 되돌아간 거리를 빼는 아이. 되돌아간 만큼도 이동한 거리이다.
        const who = d.pick(NAMES), a = 100 * d.int(2, 4), c = a - 100 * d.int(1, a / 100 - 1), D = a + 100 * d.int(1, 2), t1 = d.int(2, 3), t2 = t1 + d.int(1, 2), rest = d.int(0, 1), t3 = t2 + rest, end = t3 + d.int(2, 3);
        const pts = [[0, 0], [t1, a], [t2, c]].concat(rest ? [[t3, c]] : [], [[end, D]]), total = a + (a - c) + (D - c);
        return N(`${name(who, '은/는')} 집에서 출발하여 도서관에 가다가, 떨어뜨린 물건을 찾으러 오던 길을 되돌아간 뒤 다시 도서관으로 갔다. 다음은 집에서 출발한 지 ${vx}분 후 집으로부터 떨어진 거리를 ${vy} m라 하고 ${REL} 집에서 출발하여 도서관에 도착할 때까지 ${name(who, '이/가')} 이동한 거리는 모두 몇 m인가?`, total, {
          unit: 'm', figure: G('시간(분)', '거리(m)', end, D + 100, 1, 100, [pts]),
          explain: `세로축은 집으로부터 떨어진 거리이다. 처음에 ${a} m를 갔다가, ${a} − ${c} = ${a - c}(m)를 되돌아간 뒤, 다시 ${D} − ${c} = ${D - c}(m)를 갔다. 이동한 거리는 ${a} + ${a - c} + ${D - c} = ${total}(m)이다. 그래프의 끝 값 ${D} m는 집에서 도서관까지의 거리이다.`,
          facts: { value: `${a}+(${a}-${c})+(${D}-${c})` }
        });
      }),
      H('hard-turns', '왕복하는 움직임의 그래프에서 방향을 바꾼 횟수 세기', '심39', (d) => {
        // 함정: 그래프가 꺾인 곳을 모두 세는 아이(멈춘 때와 빠르기만 달라진 때는 방향을 바꾼 것이 아니다), 꼭대기만 세는 아이(내려가다 올라가는 곳도 방향을 바꾼 때이다).
        // 꼭짓점마다 방향을 바꾼 때인가: 멈추었다가(0) 움직일 때는 멈추기 전의 방향과 견준다.
        const turnsOf = (m) => { let last = 1; return m.slice(1).map((v) => { if (v === 0) return false; const turn = Math.sign(v) !== last; last = Math.sign(v); return turn; }); };
        const moves = d.until(() => range(0, 5).map(() => d.int(-3, 3)), (m) => {
          let y = 0; const ys = m.map((v) => (y += v)), k = turnsOf(m).filter(Boolean).length;
          return m[0] > 0 && m.filter((v) => v === 0).length === 1 && m[5] !== 0 && m.every((v, i) => i === 0 || v !== m[i - 1]) && ys.every((v) => v >= 0 && v <= 6) && k >= 2 && k <= 3;
        });
        const pts = [[0, 0]]; for (const v of moves) pts.push([pts[pts.length - 1][0] + 5, pts[pts.length - 1][1] + v]);
        const flags = turnsOf(moves), times = flags.map((f, i) => (f ? 5 * (i + 1) : 0)).filter(Boolean), n = times.length;
        return N(`장난감 기차가 곧은 선로 위를 앞뒤로 움직인다. 다음은 출발한 지 ${vx}초 후 기차와 출발한 곳 사이의 거리를 ${vy} m라 하고 ${REL} 30초 동안 기차가 움직이는 방향을 바꾼 것은 모두 몇 번인가?`, n, {
          unit: '번', figure: G('시간(초)', '거리(m)', 30, Math.max(...pts.map((p) => p[1])) + 1, 5, 1, [pts]),
          explain: `기차가 출발한 곳에서 멀어지는 동안에는 그래프가 올라가고, 가까워지는 동안에는 내려간다. 올라가던 그래프가 내려가기 시작하는 곳과 내려가던 그래프가 올라가기 시작하는 곳에서 방향을 바꾼 것이다. 멈춘 때와 빠르기만 달라진 때에는 방향이 바뀌지 않는다. 방향을 바꾼 때는 ${times.map((t) => t + '초').join(', ')}의 ${n}번이다.`,
          facts: { count: flags }
        });
      }),
      H('hard-most-change', '가장 많이 변한 구간 찾기', '심42', (d) => {
        // 함정: 그래프가 가장 높은 구간(마지막 구간)을 고르는 아이. 가장 많이 자란 때는 가장 가파른 구간이다.
        const u = d.pick([2, 5, 10]), incs = d.pick([[1, 1, 4, 2, 1], [2, 4, 1, 1, 1], [1, 2, 1, 4, 1], [1, 1, 2, 4, 1], [1, 3, 1, 2, 1]]), pts = [[0, 0]];
        for (const v of incs) pts.push([pts[pts.length - 1][0] + 2, pts[pts.length - 1][1] + v * u]);
        const top = Math.max(...incs), at = incs.indexOf(top), options = incs.map((v, i) => `${2 * i}주~${2 * i + 2}주`);
        return C(`다음은 어떤 식물의 싹이 튼 지 ${vx}주 후의 키를 ${vy} cm라 하고 ${REL} 이 식물의 키가 가장 많이 자란 때는?`, options, at, {
          figure: G('시간(주)', '키(cm)', 10, pts[5][1] + u, 2, u, [pts]),
          explain: `같은 시간 동안 키가 많이 자랄수록 그래프가 가파르게 올라간다. 2주마다 자란 키는 차례로 ${incs.map((v) => v * u).join(', ')}(cm)이므로 가장 많이 자란 때는 ${nb(options[at])}이다. 키가 가장 큰 때와 키가 가장 많이 자란 때는 다르다.`,
          facts: { truth: incs.map((v) => v === top), want: true }
        });
      }),
      H('hard-late-start', '늦게 출발한 사람의 그래프가 지나는 두 끝 점 고르기', '심35', (d) => {
        // 두 사람의 그래프를 그리는 꼴(작도)을 고르기로 바꾸었다.
        // 함정: 늦게 출발한 사람의 그래프도 원점에서 시작한다고 여기는 아이, 걸린 시간을 도착한 때로 적는 아이, 늦게 출발한 것을 세로축 위의 점으로 나타내는 아이.
        const D = d.pick([2, 3]), [late, dur] = d.pick([[5, 10], [5, 15], [10, 15]]), t1 = late + dur + d.pick([5, 10]), seg = (p, q) => `${pt(p[0], p[1])}, ${pt(q[0], q[1])}`;
        const rows = d.shuffle([[seg([late, 0], [late + dur, D]), true], [seg([0, 0], [dur, D]), false], [seg([late, 0], [dur, D]), false], [seg([0, late], [late + dur, D]), false]]);
        return C(`집에서 ${D} km 떨어진 공원까지 형은 일정한 속력으로 걸어 ${t1}분 만에 도착하였다. 동생은 형보다 ${late}분 늦게 집에서 출발하여 일정한 속력으로 달려 출발한 지 ${dur}분 만에 공원에 도착하였다. 형이 출발한 지 ${vx}분 후 집으로부터 떨어진 거리를 ${vy} km라 할 때, 동생의 움직임을 나타낸 그래프는 선분이 된다. 이 선분의 양 끝 점의 좌표는?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
          explain: `${vx}는 형이 출발한 지 지난 시간이다. 동생은 형이 출발한 지 ${late}분 후에 집에서 출발하므로 그래프는 가로축 위의 점 ${pt(late, 0)}에서 시작한다. 출발한 지 ${dur}분 만에 도착하므로 형이 출발한 지 ${late} + ${dur} = ${late + dur}(분) 후에 집에서 ${D} km 떨어진 공원에 있다. 끝 점은 ${pt(late + dur, D)}이다.`,
          facts: { truth: rows.map((r) => r[1]), want: true }
        });
      }),
      H('hard-remaining', '남은 거리의 그래프에서 걸은 거리 구하기', '①60', (d) => {
        // 함정: 세로축의 값을 그대로 걸은 거리로 답하는 아이. 세로축은 학교까지 남은 거리이므로 걸은 거리는 전체 거리에서 남은 거리를 뺀 값이다.
        const who = d.pick(NAMES), D = d.pick([800, 1000, 1200]), t1 = d.int(2, 3), rest = d.int(1, 2), end = D / 200 + rest, y = (x) => D - 200 * (x <= t1 ? x : x <= t1 + rest ? t1 : x - rest);
        const t = d.until(() => d.int(t1, end - 1), (x) => y(x) !== D - y(x)), pts = range(0, end).map((x) => [x, y(x)]);
        return N(`다음은 ${name(who, '이/가')} 집에서 출발하여 학교까지 걸어갈 때, 출발한 지 ${vx}분 후 ${name(who, '이/가')} 있는 곳에서 학교까지의 거리를 ${vy} m라 하고 ${REL} 출발한 지 ${t}분 후까지 ${name(who, '이/가')} 걸은 거리는 몇 m인가?`, D - y(t), {
          unit: 'm', figure: G('시간(분)', '거리(m)', end, D, 1, 200, [pts]),
          explain: `세로축은 학교까지 남은 거리이다. 출발할 때 남은 거리가 ${D} m이므로 집에서 학교까지의 거리는 ${D} m이다. 출발한 지 ${t}분 후 남은 거리가 ${y(t)} m이므로 그때까지 걸은 거리는 ${D} − ${y(t)} = ${D - y(t)}(m)이다.`,
          facts: { value: `${D}-${y(t)}` }
        });
      }),
      H('hard-vessel-drain', '그릇에서 물을 빼낼 때의 물의 높이의 그래프 고르기', '심33', (d) => {
        // 그래프를 그리는 꼴(작도)을 고르기로 바꾸었다.
        // 함정: 물을 넣을 때의 그래프를 고르는 아이(올라가는 선), 아래쪽부터 비워진다고 여겨 가파르기의 차례를 거꾸로 대는 아이, 폭을 따지지 않는 아이(곧은 선).
        const wideTop = d.bool(), parts = wideTop ? [flat(1, 2), flat(1, 4.5)] : [flat(1, 4.5), flat(1, 2)], g = (p) => mini('시간', '물의 높이', 11.5, 2.28, [p]);
        return figChoice(d, '그림과 같이 폭이 다른 두 원기둥을 이어 붙인 모양의 그릇에 물이 가득 차 있다. 그릇의 바닥에 있는 마개를 열어 매초 일정한 양의 물을 빼낼 때, 시간에 따른 그릇에 남은 물의 높이를 나타낸 그래프로 알맞은 것은?', [
          { fig: g(drainPts(parts, 10)), ok: true }, { fig: g(drainPts(parts.slice().reverse(), 10)) }, { fig: g(fillPts(parts, 10)) }, { fig: g([[0, 2], [10, 0]]) }
        ], {
          figure: vessels([{ parts }]),
          explain: (tag) => `물을 빼내면 물의 높이가 낮아지므로 그래프는 내려간다. 물의 높이는 위쪽부터 낮아진다. 위쪽은 폭이 ${wideTop ? '넓어 물의 높이가 천천히 낮아지고, 아래쪽은 폭이 좁아 빨리 낮아진다. 완만하게 내려가다가 가파르게' : '좁아 물의 높이가 빨리 낮아지고, 아래쪽은 폭이 넓어 천천히 낮아진다. 가파르게 내려가다가 완만하게'} 내려가는 ${tag}이다.`,
          facts: { rule: 'vessel-drain' }
        });
      }),
      H('hard-three-return', '달린 거리의 그래프에서 반환점과 출발한 곳에 먼저 닿은 사람 찾기', '심48', (d) => {
        // 함정: 세로축을 「출발한 곳으로부터의 거리」로 읽어 그래프가 내려오는 곳을 찾는 아이, 끝 점만 보고 두 답을 같은 사람으로 적는 아이. 세로축이 달린 거리이므로 반환점은 4 km, 돌아온 때는 8 km가 되는 때이다.
        const who = d.shuffle(['A', 'B', 'C']), turn = [20, 30, 40], back = d.pick([[80, 60, 70], [70, 80, 60]]), first = who[0], home = who[back.indexOf(60)];
        const paths = ['A', 'B', 'C'].map((w) => { const i = who.indexOf(w); return { pts: [[0, 0], [turn[i], 4], [back[i], 8]], name: w }; });
        const rows = d.shuffle([[`${first}, ${home}`, true], [`${home}, ${first}`, false], [`${first}, ${first}`, false], [`${home}, ${home}`, false]]);
        return C(`세 학생 A, B, C가 동시에 출발하여 4 km 떨어진 반환점을 돌아 출발한 곳으로 돌아오는 달리기를 하였다. 다음은 출발한 지 ${vx}분 후까지 세 학생이 각각 달린 거리를 ${vy} km라 하고 ${REL} 반환점에 가장 먼저 도착한 학생과 출발한 곳에 가장 먼저 돌아온 학생을 차례로 적은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
          figure: G('시간(분)', '달린 거리(km)', 80, 9, 10, 1, paths),
          explain: `세로축은 달린 거리이다. 반환점에 도착한 때는 달린 거리가 4 km가 되는 때이고, 출발한 곳에 돌아온 때는 달린 거리가 8 km가 되는 때이다. 4 km를 달린 때는 ${who.map((w, i) => `${w} ${turn[i]}분`).join(', ')}이고, 8 km를 달린 때는 ${who.map((w, i) => `${w} ${back[i]}분`).join(', ')}이다. 반환점에는 ${first}가, 출발한 곳에는 ${home}가 가장 먼저 닿았다.`,
          facts: { truth: rows.map((r) => r[1]), want: true }
        });
      }),

      // ── ② 두 번 넘게 생각해야 풀리는 문제 ──
      H('hard-sign-sum', '곱과 합의 부호로 두 문자의 부호를 정해 점의 사분면 가리기', '①27 심18', (d) => {
        const s = pm(d), [k1, k2] = d.pick(exPairs(s, s).filter(([x, y]) => [x, y].every((k) => /^(a|b|na|nb|nab)$/.test(k)) && [x, y].some((k) => k !== 'a' && k !== 'b')));
        return quadQ(`${cmp0(ab, 1)}, ${cmp0(`${va} + ${vb}`, s)}일 때, 점 ${exPoint(k1, k2)}는 제몇 사분면 위의 점인가?`, exQuad(k1, k2, s, s),
          `${cmp0(ab, 1)}이므로 ${va}, ${vb}의 부호는 서로 같다. ${cmp0(`${va} + ${vb}`, s)}이므로 ${va}, ${vb}는 모두 ${s > 0 ? '양수' : '음수'}이다. ${exTold(k1, k2, s, s)}`);
      }, { standard: STD5 }),
      H('hard-sign-order', '곱의 부호와 크기로 두 문자의 부호를 정해 점의 사분면 가리기', '심14·15', (d, n) => {
        // 첫째는 한 점의 사분면을, 둘째는 점과 사분면의 짝이 옳은 것을 묻는다. 틀린 짝은 a, b 의 부호를 거꾸로 정했을 때의 사분면이다.
        const less = d.bool(), sa = less ? -1 : 1, sb = -sa, order = nb(`${va} ${less ? LT : GT} ${vb}`);
        const head = `${cmp0(ab, -1)}이므로 ${va}, ${vb}의 부호는 서로 다르다. ${order}이므로 ${cmp0(va, sa)}, ${cmp0(vb, sb)}이다. `;
        if (n === 0) {
          const [k1, k2] = d.pick(exPairs(sa, sb).filter(([x, y]) => [x, y].some((k) => k === 'amb' || k === 'bma') && [x, y].some((k) => k === 'ab' || k === 'nab')));
          return quadQ(`${cmp0(ab, -1)}, ${order}일 때, 점 ${exPoint(k1, k2)}는 제몇 사분면 위의 점인가?`, exQuad(k1, k2, sa, sb), head + exTold(k1, k2, sa, sb));
        }
        const pool = d.shuffle(exPairs(sa, sb).filter(([x, y]) => exQuad(x, y, sa, sb) !== exQuad(x, y, sb, sa) && exQuad(x, y, sb, sa) >= 0 && !(x === 'b' && y === 'a'))).slice(0, 4), at = d.int(0, 3);
        const said = pool.map(([x, y], i) => (i === at ? exQuad(x, y, sa, sb) : exQuad(x, y, sb, sa)));
        return C(`${cmp0(ab, -1)}, ${order}일 때, 다음 중 점과 그 점이 속하는 사분면을 바르게 짝 지은 것은?`, pool.map(([x, y], i) => `점 ${exPoint(x, y)}: ${QN[said[i]]}`), at, {
          explain: `${head}${pool.map(([x, y]) => `점 ${exPoint(x, y)}는 ${QN[exQuad(x, y, sa, sb)]}`).join(', ')} 위의 점이다.`,
          facts: { truth: pool.map(([x, y], i) => said[i] === exQuad(x, y, sa, sb)), want: true }
        });
      }, { count: 2, standard: STD5 }),
      H('hard-quad-back', '식으로 된 점의 사분면에서 부호를 거꾸로 구해 다른 점의 사분면 가리기', '①26', (d) => {
        const sa = pm(d), sb = pm(d), g1 = d.pick(['a', 'na', 'b', 'nb']), g2 = d.pick(['ab', 'nab']), given = d.bool() ? [g1, g2] : [g2, g1], known = /a/.test(g1) ? va : vb, other = known === va ? vb : va;
        const [k1, k2] = d.pick(exPairs(sa, sb).filter(([x, y]) => [x, y].some((k) => /amb|bma|apb/.test(k)) && !(x === given[0] && y === given[1])));
        return quadQ(`점 ${exPoint(given[0], given[1])}가 ${QN[exQuad(given[0], given[1], sa, sb)]} 위의 점일 때, 점 ${exPoint(k1, k2)}는 제몇 사분면 위의 점인가?`, exQuad(k1, k2, sa, sb),
          `점 ${exPoint(given[0], given[1])}가 ${QN[exQuad(given[0], given[1], sa, sb)]} 위의 점이므로 ${cmp0(EX[given[0]].h, EX[given[0]].s(sa, sb))}, ${cmp0(EX[given[1]].h, EX[given[1]].s(sa, sb))}이다. ${cmp0(known, known === va ? sa : sb)}이고 ${cmp0(ab, sa * sb)}이므로 ${cmp0(other, other === va ? sa : sb)}이다. ${exTold(k1, k2, sa, sb)}`);
      }, { standard: STD5 }),
      H('hard-new-point', '좌표를 읽어 식에 넣은 새 점 찾기', '심5', (d) => {
        // 틀린 점: 계수를 곱하지 않은 곳, 새 점의 x좌표와 y좌표의 자리를 바꾼 곳, a 와 b 를 바꾸어 넣은 곳.
        const m = d.pick([2, 3]), ok4 = (v) => Math.abs(v) <= 4;
        const [px, py, k, j] = d.until(() => [nz(d, -3, 3), nz(d, -4, 4), nz(d, -9, 9), nz(d, -8, 8)], ([x, y, p, q]) => { const list = [[x, y], [m * x + p, y + q], [x + p, y + q], [y + q, m * x + p], [m * y + p, x + q]]; return list.every(([u, v]) => ok4(u) && ok4(v) && u !== 0 && v !== 0) && allFar(list) && Math.abs(x) !== Math.abs(y); });
        const right = [m * px + k, py + j], rows = d.shuffle([right, [px + k, py + j], [py + j, m * px + k], [m * py + k, px + j]]), at = rows.indexOf(right), xh = lin(m, k, va), yh = lin(1, j, vb);
        return C(`좌표평면 위의 점 P의 좌표가 ${nb('(' + va + ', ' + vb + ')')}일 때, 네 점 A, B, C, D 가운데 좌표가 ${nb('(' + xh + ', ' + yh + ')')}인 점은?`, NAMES4, at, {
          figure: plane({ points: [dot('P', px, py)].concat(rows.map(([x, y], i) => dot(NAMES4[i], x, y))) }),
          explain: `점 P의 좌표는 ${pt(px, py)}이므로 ${va} = ${iq(px)}, ${vb} = ${iq(py)}이다. ${xh} = ${iq(right[0])}, ${yh} = ${iq(right[1])}이므로 좌표가 ${pt(right[0], right[1])}인 점 ${NAMES4[at]}이다.`,
          facts: { truth: rows.map((r, i) => i === at), want: true }
        });
      }, { standard: STD5 }),
      H('hard-area-outside', '높이가 밑변 밖에 떨어지는 삼각형의 넓이', '심25', (d) => {
        // 함정: 점 B의 다른 좌표(밑변과 나란한 쪽)를 높이나 밑변으로 쓰는 아이. 밑변은 좌표축 위의 변 OA, 높이는 점 B에서 그 좌표축까지의 거리이다.
        const onX = d.bool(), a = pm(d) * d.int(2, 5);
        const [along, away] = d.until(() => [nz(d, -7, 7), nz(d, -6, 6)], ([u, v]) => (a > 0 ? u < 0 || u > a : u > 0 || u < a) && (Math.abs(a) * Math.abs(v)) % 2 === 0 && Math.abs(v) >= 2 && Math.abs(u) !== Math.abs(v) && Math.abs(u) !== Math.abs(a));
        const bx = onX ? along : away, by = onX ? away : along, area = Math.abs(a) * Math.abs(away) / 2, on = onX ? vx : vy, off = onX ? vy : vx;
        return N('다음 조건을 모두 만족시키는 세 점 O, A, B를 꼭짓점으로 하는 삼각형 OAB의 넓이는?', area, {
          figure: lines(['㈎ 점 O는 원점이다.', `㈏ 점 A는 ${on}축 위에 있고, ${on}좌표는 ${iq(a)}이다.`, `㈐ 점 B의 좌표는 ${pt(bx, by)}이다.`]),
          explain: `점 A의 좌표는 ${onX ? pt(a, 0) : pt(0, a)}이다. 변 OA는 ${on}축 위에 있고 길이는 ${Math.abs(a)}이다. 변 OA를 밑변으로 하면 높이는 점 B에서 ${on}축까지의 거리이고, 이것은 점 B의 ${off}좌표의 절댓값인 ${Math.abs(away)}이다. 넓이는 ${frac(1, 2)} × ${Math.abs(a)} × ${Math.abs(away)} = ${area}이다. 점 B의 ${on}좌표는 넓이와 상관이 없다.`,
          facts: { value: `${Math.abs(a)}*${Math.abs(away)}/2`, unseen: [2] }
        });
      }, { standard: STD5 }),
      H('hard-area-tilted', '좌표축에 평행한 변이 없는 삼각형의 넓이', '①36 심28', (d) => {
        // 삼각형을 둘러싸는 직사각형에서 직각삼각형 셋을 뺀다. 꼭짓점 하나는 직사각형의 꼭짓점에, 나머지 둘은 그 점과 닿지 않는 두 변 위에 놓았다. 좌표가 ±1인 꼭짓점은 두지 않는다(이름이 눈금 수와 겹친다).
        const [x1, x2, y1, y2, xb, ya] = d.until(() => [d.int(-4, -2), d.int(2, 4), d.int(-4, -2), d.int(2, 4), nz(d, -3, 3), nz(d, -3, 3)], ([a1, a2, b1, b2, mx, my]) => { if (!(mx > a1 && mx < a2 && my > b1 && my < b2) || Math.abs(mx) === 1 || Math.abs(my) === 1) return false; const cut = (a2 - a1) * (b2 - my) + (mx - a1) * (my - b1) + (a2 - mx) * (b2 - b1); return cut % 2 === 0 && (a2 - a1) * (b2 - b1) - cut / 2 >= 4; });
        const W = span(x1, x2), Hh = span(y1, y2), t1 = [W, span(ya, y2)], t2 = [span(x1, xb), span(y1, ya)], t3 = [span(xb, x2), Hh], cut2 = [t1, t2, t3].map(([p, q]) => p.len * q.len), area = W.len * Hh.len - cut2.reduce((s, v) => s + v, 0) / 2;
        const fx = pm(d), fy = pm(d), pts = [[x1, ya], [xb, y1], [x2, y2]].map(([x, y]) => [fx * x, fy * y]), cen = [pts.reduce((s, p) => s + p[0], 0) / 3, pts.reduce((s, p) => s + p[1], 0) / 3], side = ([x, y]) => (y >= cen[1] ? 'u' : 'd') + (x >= cen[0] ? 'r' : 'l');
        return N('그림과 같이 좌표평면 위의 세 점 A, B, C를 꼭짓점으로 하는 삼각형 ABC의 넓이는?', area, {
          figure: plane({ poly: pts, points: pts.map((p, i) => ({ x: p[0], y: p[1], name: 'ABC'[i], side: side(p) })) }),
          explain: `세 점의 좌표는 ${pts.map((p, i) => P('ABC'[i], p[0], p[1])).join(', ')}이다. 세 변이 모두 좌표축에 평행하지 않으므로, 삼각형을 둘러싸는 가로 ${W.len}, 세로 ${Hh.len}인 직사각형의 넓이에서 직각삼각형 세 개의 넓이를 뺀다. 직사각형의 넓이는 ${W.len} × ${Hh.len} = ${W.len * Hh.len}이고, 세 직각삼각형의 넓이는 ${[t1, t2, t3].map(([p, q]) => `${frac(1, 2)} × ${p.len} × ${q.len} = ${half(p.len * q.len)}`).join(', ')}이다. 삼각형 ABC의 넓이는 ${W.len * Hh.len} − ${half(cut2.reduce((s, v) => s + v, 0))} = ${area}이다.`,
          facts: { value: `${W.ex}*${Hh.ex}-(${[t1, t2, t3].map(([p, q]) => `${p.ex}*${q.ex}`).join('+')})/2`, unseen: [0, 2], rule: 'tri-tilted' }
        });
      }, { standard: STD5 }),
      H('hard-axis-area', '좌표축 위의 점 조건으로 문자의 값을 정한 뒤 삼각형의 넓이 구하기', '심10', (d) => {
        const m = d.pick([2, 3]);
        const [s1, s2, s3, cx, cy] = d.until(() => [nz(d, -4, 4), d.int(1, 3), nz(d, -4, 4), nz(d, -5, 5), nz(d, -6, 6)], (v) => { const ax = v[0] - v[2], bx = m * v[1]; return Math.abs(bx - ax) >= 2 && Math.abs(ax) <= 7 && ax !== 0 && (Math.abs(bx - ax) * Math.abs(v[4])) % 2 === 0 && Math.abs(v[4]) >= 2; });
        const ax = s1 - s3, bx = m * s2, base = Math.abs(bx - ax), area = base * Math.abs(cy) / 2, lo = Math.min(ax, bx), hi = Math.max(ax, bx);
        const ah = [lin(1, s1, va), lin(1, -s2, vb)], bh = [poly([[m, vb]]), lin(1, s3, va)];
        return N(`두 점 ${nb('A(' + ah[0] + ', ' + ah[1] + ')')}, ${nb('B(' + bh[0] + ', ' + bh[1] + ')')}${tail(Math.abs(s3), '이/가')} 모두 ${XA} 위의 점일 때, 세 점 A, B, ${Pj('C', cx, cy, '을/를')} 꼭짓점으로 하는 삼각형 ABC의 넓이는?`, area, {
          explain: `${XA} 위의 점은 ${YC}가 0이다. 점 A에서 ${ah[1]} = 0이므로 ${vb} = ${s2}이고, 점 B에서 ${bh[1]} = 0이므로 ${va} = ${iq(-s3)}이다. 두 점의 좌표는 ${P('A', ax, 0)}, ${P('B', bx, 0)}이므로 변 AB의 길이는 ${minus(hi, lo)} = ${base}이고, 점 C에서 ${XA}까지의 거리는 ${Math.abs(cy)}이다. 넓이는 ${frac(1, 2)} × ${base} × ${Math.abs(cy)} = ${area}이다.`,
          facts: { value: `${bx > ax ? `(${m}*${s2}-(${jx(s1)}-${jx(s3)}))` : `((${jx(s1)}-${jx(s3)})-${m}*${s2})`}*${Math.abs(cy)}/2`, unseen: [0, 1, 2] }
        });
      }, { standard: STD5 }),
      H('hard-sym-area', '대칭인 점으로 만든 도형의 넓이', '심22·23', (d, n) => {
        // 첫째는 원점과 좌표축에 대하여 대칭인 두 점으로 만든 삼각형, 둘째는 대칭인 세 점으로 만든 사각형. 변의 길이는 좌표의 차(좌표의 절댓값의 2배)이다.
        const [x, y] = d.until(() => [nz(d, -6, 6), nz(d, -6, 6)], ([p, q]) => Math.abs(p) !== Math.abs(q)), w = 2 * Math.abs(x), h = 2 * Math.abs(y);
        if (n === 0) {
          const onX = d.bool(), c = onX ? [x, -y] : [-x, y];
          return N(`점 ${Pj('A', x, y, '과/와')} 원점에 대하여 대칭인 점을 B, ${onX ? XA : YA}에 대하여 대칭인 점을 C라 할 때, 삼각형 ABC의 넓이는?`, w * h / 2, {
            explain: `${P('B', -x, -y)}, ${P('C', c[0], c[1])}이다. ${onX ? `두 점 A, C는 ${XC}가 같으므로 변 AC는 ${YA}에 평행하고 길이는 ${h}, 두 점 B, C는 ${YC}가 같으므로 변 BC는 ${XA}에 평행하고 길이는 ${w}이다` : `두 점 A, C는 ${YC}가 같으므로 변 AC는 ${XA}에 평행하고 길이는 ${w}, 두 점 B, C는 ${XC}가 같으므로 변 BC는 ${YA}에 평행하고 길이는 ${h}이다`}. 삼각형 ABC는 직각삼각형이므로 넓이는 ${frac(1, 2)} × ${w} × ${h} = ${w * h / 2}이다.`,
            facts: { value: `2*${Math.abs(x)}*2*${Math.abs(y)}/2`, unseen: [2], rule: 'sym-triangle' }
          });
        }
        return N(`점 ${Pj('P', x, y, '과/와')} ${XA}, ${YA}, 원점에 대하여 대칭인 점을 차례로 A, B, C라 할 때, 네 점 P, A, C, B를 꼭짓점으로 하는 사각형 PACB의 넓이는?`, w * h, {
          explain: `${P('A', x, -y)}, ${P('B', -x, y)}, ${P('C', -x, -y)}이다. 사각형 PACB는 네 변이 좌표축에 평행한 직사각형이고, 변 PA의 길이는 ${h}, 변 PB의 길이는 ${w}이다. 넓이는 ${w} × ${h} = ${w * h}이다.`,
          facts: { value: `2*${Math.abs(x)}*2*${Math.abs(y)}`, unseen: [2], rule: 'sym-rectangle' }
        });
      }, { count: 2, standard: STD5 }),
      H('hard-two-late', '늦게 떠난 사람의 그래프에서 떠나는 순간의 거리의 차와 만날 때까지 걸린 시간', '①73 교125', (d) => {
        // 떠나는 순간 두 사람이 같은 곳에 있다고 여기는 아이, 만난 때(가로축의 값)를 늦게 떠난 사람이 걸린 시간으로 답하는 아이가 걸린다.
        const [who, other] = d.shuffle(NAMES).slice(0, 2), s = d.pick([{ late: 20, B: [[20, 0], [40, 2000], [50, 3000]] }, { late: 10, B: [[10, 0], [30, 1500], [50, 3000]] }]), A = range(0, 5).map((i) => [10 * i, 500 * i]), tm = s.B[1][0], gap = 50 * s.late;
        return M(`${name(who, '은/는')} 집에서 출발하여 도서관을 향해 걸어갔고, ${name(other, '은/는')} 얼마 뒤에 집에서 출발하여 같은 길을 따라 자전거를 타고 갔다. 다음은 ${name(who, '이/가')} 출발한 지 ${vx}분 후 두 사람이 집으로부터 떨어진 거리를 ${vy} m라 하고 ${REL} ㉠ ${name(other, '이/가')} 출발하는 순간 두 사람 사이의 거리와 ㉡ ${name(other, '이/가')} 출발한 뒤 ${josa(who, '을/를')} 만날 때까지 걸린 시간을 구하시오.`,
          [{ label: '㉠', answer: gap, unit: 'm' }, { label: '㉡', answer: tm - s.late, unit: '분' }], {
            figure: G('시간(분)', '거리(m)', 50, 3200, 10, 500, [{ pts: A, name: who }, { pts: s.B, name: other }]),
            explain: `${other}의 그래프는 가로축 위의 점 (${s.late}, 0)에서 시작하므로 ${name(other, '은/는')} ${name(who, '이/가')} 출발한 지 ${s.late}분 후에 집에서 출발하였다. 이때 ${name(who, '은/는')} 집에서 ${gap} m 떨어진 곳에 있으므로 두 사람 사이의 거리는 ${gap} m이다. 두 그래프는 가로축의 값이 ${tm}일 때 만나므로 ${name(other, '이/가')} 출발한 뒤 만날 때까지 걸린 시간은 ${tm} − ${s.late} = ${tm - s.late}(분)이다.`,
            facts: { calc: [[String(gap), 0], [`${tm}-${s.late}`, 1]] }
          });
      }),
      H('hard-vessel-kink', '그래프가 꺾이는 곳과 그릇의 폭이 바뀌는 곳 맞추기', '심32 ①47', (d) => {
        // 그릇의 폭이 바뀌는 높이는 그래프가 꺾이는 점의 세로의 값이고, 폭의 넓고 좁음은 꺾이기 전과 뒤의 가파르기로 정한다.
        // 틀린 그릇: 폭의 넓고 좁음을 거꾸로 댄 것, 폭이 바뀌는 높이를 위에서부터 잰 것, 둘 다 틀린 것.
        const wideFirst = d.bool(), hj = d.pick([10, 20]), tA = (wideFirst ? 4 : 1) * hj, end = tA + (wideFirst ? 1 : 4) * (30 - hj), v = (wide, h) => vessels([{ parts: wide ? [flat(h, 4), flat(30 - h, 2)] : [flat(h, 2), flat(30 - h, 4)] }], { ruler: { step: 10, unit: 'cm' } });
        return figChoice(d, `어떤 그릇에 매초 일정한 양의 물을 넣었다. 다음은 물을 넣기 시작한 지 ${vx}초 후의 물의 높이를 ${vy} cm라 하고 ${REL} 이 그릇의 옆모습으로 알맞은 것은?`, [
          { fig: v(wideFirst, hj), ok: true }, { fig: v(!wideFirst, hj) }, { fig: v(wideFirst, 30 - hj) }, { fig: v(!wideFirst, 30 - hj) }
        ], {
          figure: G('시간(초)', '물의 높이(cm)', end, 35, 10, 10, [[[0, 0], [tA, hj], [end, 30]]]),
          explain: (tag) => `그래프는 물의 높이가 ${hj} cm일 때 꺾이므로 그릇의 폭은 높이 ${hj} cm인 곳에서 바뀐다. 꺾이기 전에는 ${tA}초 동안 ${hj} cm, 꺾인 뒤에는 ${end - tA}초 동안 ${30 - hj} cm 올라가므로 아래쪽에서 물의 높이가 ${wideFirst ? '더 천천히 올라간다. 아래쪽의 폭이 넓고 위쪽의 폭이 좁은' : '더 빨리 올라간다. 아래쪽의 폭이 좁고 위쪽의 폭이 넓은'} ${tag}이다.`,
          facts: { rule: 'vessel-kink' }
        });
      })
    ]
  });

  // ══ 처음 지을 때 뺀 꼴을 다시 보고 덧붙인 실력 문항(2026-10-13) ══
  // 사용자: 「수학실력에 필요해보이는문제는 다 넣어」. 꼬임·조건 여럿·여러 번 잇기라는 까닭으로 뺐던 꼴을 다시 실었다.
  //  - 부호 조건을 거듭 푸는 사분면: 한 문자의 부호와 합·차(①28), 두 좌표가 모두 식인 점에서 거꾸로(심16 ①28), 거꾸로 푼 뒤 대칭(심17·18 ①28), 수직선의 세 수(심19)
  //  - 대칭인 점: 문자의 값(①31 심20), 두 번 옮기기(심21), 문자를 정한 뒤의 넓이(①37)
  //  - 넓이: 둘러싼 직사각형에서 빼는 사각형(심29), 넓이에서 꼭짓점의 좌표를 거꾸로 구하기(심30)
  //  - 그래프: 두 구간의 빠르기를 구해 빼고 나누기(①68)
  // 그대로 뺀 것: 중2(①41), 다음 단원(①69), 그림을 끝내 알 수 없는 것(①56·67 심44), 실린 유형과 같은 일(①46), 낱낱이 짝 지어 세는 개수(심2).
  // 이 단원에서 아이들이 흔히 잘못 아는 것(덧붙인 문항의 장치)
  //  - 차 a − b 의 부호를 두 수의 부호로만 정하려 한다(차의 부호는 크기를 견주어 정한다: 작은 수에서 큰 수를 빼면 음수이다).
  //  - 합이 음수이면 두 수가 모두 음수라고 여긴다(한 수가 양수이면 다른 수가 음수라는 것만 알 수 있다).
  //  - 대칭인 두 점의 좌표를 그대로 같다고 놓는다(부호가 바뀌는 좌표는 식 전체의 부호를 바꾸어 놓아야 한다).
  //  - 넓이에서 변의 길이를 구한 뒤 한쪽 방향만 생각한다(같은 길이만큼 떨어진 점은 양쪽에 있고, 조건으로 하나를 고른다).
  const { f1, V } = B.kit.mid, { signWord } = B.kit.m715;
  const ABOUT = [XA, YA, '원점'], SX = [1, -1, -1], SY = [-1, 1, -1];
  const SYM_WHY = [`${XA}에 대하여 대칭인 점은 ${XC}는 같고 ${YC}의 부호만 바뀐다.`, `${YA}에 대하여 대칭인 점은 ${YC}는 같고 ${XC}의 부호만 바뀐다.`, `원점에 대하여 대칭인 점은 ${XC}와 ${YC}의 부호가 모두 바뀐다.`];
  const quadAt = (sx, sy) => QS.findIndex(([x, y]) => x === sx && y === sy);
  // 등식 하나를 줄이 갈리지 않는 한 덩이로 적는다.
  const eq = (left, right) => nb(left + ' = ' + right);
  // 두 문자 p, q 의 부호가 정해지면 부호가 정해지는 식. 7-1-5a.js 의 EX 와 같되 문자를 바꿔 쓸 수 있고 몫이 더 있다(EX 는 올라가 있는 문항이 쓰므로 건드리지 않는다).
  const signsOf = (p, q) => ({
    a: { h: p, s: (sa) => sa }, b: { h: q, s: (sa, sb) => sb }, na: { h: MINUS + p, s: (sa) => -sa }, nb: { h: MINUS + q, s: (sa, sb) => -sb },
    ab: { h: p + q, s: (sa, sb) => sa * sb }, nab: { h: MINUS + p + q, s: (sa, sb) => -sa * sb }, bda: { h: frac(q, p), s: (sa, sb) => sa * sb }, adb: { h: frac(p, q), s: (sa, sb) => sa * sb },
    amb: { h: `${p} ${MINUS} ${q}`, s: (sa, sb) => (sa !== sb ? sa : 0) }, bma: { h: `${q} ${MINUS} ${p}`, s: (sa, sb) => (sa !== sb ? sb : 0) }, apb: { h: `${p} + ${q}`, s: (sa, sb) => (sa === sb ? sa : 0) }
  });
  const EA = signsOf(va, vb), EXY = signsOf(vx, vy);
  // 식의 갈래: 문자 하나(a / b), 곱·몫, 합·차. 한 점의 두 좌표는 서로 다른 갈래에서 고른다.
  const FAMILY = { a: 'a', na: 'a', b: 'b', nb: 'b', ab: 'm', nab: 'm', bda: 'm', adb: 'm', amb: 'd', bma: 'd', apb: 'd' };
  const SIMPLE = [['na', 'b'], ['a', 'nb'], ['b', 'a'], ['nb', 'a'], ['b', 'na'], ['na', 'nb'], ['nb', 'na']];
  // 점을 적은 글. 바로 뒤의 토씨(josa)를 함께 묶어, 토씨만 다음 줄 머리로 떨어지지 않게 한다.
  const pOf = (E, k1, k2, name, josa) => nb((name || '') + '(' + E[k1].h + ', ' + E[k2].h + ')' + (josa || ''));
  const qOf = (E, k1, k2, sa, sb) => { const s1 = E[k1].s(sa, sb), s2 = E[k2].s(sa, sb); return s1 && s2 ? quadAt(s1, s2) : -1; };
  const pairsOf = (E, sa, sb, ok) => { const keys = Object.keys(E).filter((k) => E[k].s(sa, sb) !== 0), out = []; for (const k1 of keys) for (const k2 of keys) if (FAMILY[k1] !== FAMILY[k2] && !(k1 === 'a' && k2 === 'b') && (!ok || ok(k1, k2))) out.push([k1, k2]); return out; };
  // 식의 부호를 적은 글(문자 하나 그대로인 식은 적지 않는다)과, 식으로 된 점이 놓이는 사분면을 풀어 적은 글
  const whyOf = (E, keys, sa, sb) => keys.filter((k, i) => k !== 'a' && k !== 'b' && keys.indexOf(k) === i).map((k) => cmp0(E[k].h, E[k].s(sa, sb))).join(', ');
  const toldOf = (E, k1, k2, sa, sb, name) => { const why = whyOf(E, [k1, k2], sa, sb); return `${why ? why + '이므로 ' : ''}점 ${pOf(E, k1, k2, name, '는')} ${XC}가 ${signWord(E[k1].s(sa, sb))}, ${YC}가 ${signWord(E[k2].s(sa, sb))}이다. 따라서 ${QN[qOf(E, k1, k2, sa, sb)]} 위의 점이다.`; };
  const ITALIC = "font-style:italic;font-family:'MB Math','Times New Roman',serif";
  // 수의 자리만 나타낸 수직선: 눈금에 적힌 수는 0뿐이고, 문자로 나타낸 수는 왼쪽부터 크기의 차례로 놓인다. marks: [{ name, at }] (0은 name 이 '0').
  function signLine(marks) {
    const W = 264, y = 20, x = (v) => f1(W / 2 + v * 27);
    let out = `<line class="mb-axis" x1="14" y1="${y}" x2="${W - 14}" y2="${y}"/><path d="M8 ${y}l7 -3.6v7.2z" style="fill:#1f2933"/><path d="M${W - 8} ${y}l-7 -3.6v7.2z" style="fill:#1f2933"/>`;
    for (const m of marks) {
      out += `<line class="mb-axis" x1="${x(m.at)}" y1="${y - 5.5}" x2="${x(m.at)}" y2="${y + 5.5}"/>` + (m.name === '0' ? '' : `<circle class="mb-dot" cx="${x(m.at)}" cy="${y}" r="3.3"/>`)
        + `<text x="${x(m.at)}" y="${y + 22}" text-anchor="middle" style="font-size:${m.name === '0' ? 13 : 15}px;fill:#1f2933;${m.name === '0' ? 'font-weight:600' : ITALIC}">${m.name}</text>`;
    }
    return `<svg class="mb-numberline" viewBox="0 0 ${W} 50" width="${W}" role="img" aria-label="수직선: 왼쪽부터 ${marks.map((m) => m.name).join(', ')}의 차례로 놓여 있다. 눈금에 적힌 수는 0뿐이다.">${out}</svg>`;
  }

  B.addTypes(UNIT, 'hard', [
    // ── ② 두 번 넘게 생각해야 풀리는 문제: 부호 조건을 거듭 푸는 사분면 ──
    H('hard-sign-chain', '한 문자의 부호와 합·차의 부호를 이어 두 문자의 부호를 정해 점의 사분면 가리기', '①28', (d, n) => {
      if (n === 0) {
        // 부등식 둘: 한 문자의 부호와 차의 부호. a < 0, a − b > 0 이면 b < a < 0 이다(부호가 같아지는 경우만 정해진다).
        // 걸리는 아이: 차의 부호에서 크기를 읽지 못하는 아이, a − b > 0 을 「b 는 양수」로 읽는 아이.
        const s = pm(d), viaA = d.bool(), known = viaA ? va : vb, other = viaA ? vb : va, ds = viaA ? -s : s, flip = d.bool();
        const diffH = flip ? `${vb} ${MINUS} ${va}` : `${va} ${MINUS} ${vb}`, diffS = flip ? -ds : ds;
        const [k1, k2] = d.pick(pairsOf(EA, s, s, (x, y) => [x, y].includes('apb') && ![x, y].some((k) => k === 'bda' || k === 'adb')));
        return quadQ(`${cmp0(known, s)}, ${cmp0(diffH, diffS)}일 때, 점 ${pOf(EA, k1, k2, 'A', '는')} 제몇 사분면 위의 점인가?`, qOf(EA, k1, k2, s, s),
          `${cmp0(diffH, diffS)}이므로 ${nb(`${va} ${ds > 0 ? GT : LT} ${vb}`)}이다. ${cmp0(known, s)}이고 ${other}는 ${known}보다 ${s < 0 ? '작으므로' : '크므로'} ${cmp0(other, s)}이다. ${toldOf(EA, k1, k2, s, s, 'A')}`);
      }
      // 점의 사분면에서: 한 좌표는 문자 하나, 다른 좌표는 합이다. 합의 부호가 알려진 문자의 부호와 반대이면 다른 문자의 부호가 정해진다(b > 0, a + b < 0 이면 a < 0).
      const sk = pm(d), viaA = d.bool(), single = viaA ? d.pick(['a', 'na']) : d.pick(['b', 'nb']), sa = viaA ? sk : -sk, sb = -sa, known = viaA ? va : vb, other = viaA ? vb : va;
      const given = d.bool() ? ['apb', single] : [single, 'apb'], gs = given.map((k) => (k === 'apb' ? -sk : EA[k].s(sa, sb))), gq = quadAt(gs[0], gs[1]);
      const [k1, k2] = d.pick(pairsOf(EA, sa, sb, (x, y) => [x, y].some((k) => (FAMILY[k] === 'a' || FAMILY[k] === 'b') && k !== single) && [x, y].some((k) => k === 'ab' || k === 'nab' || k === 'bda')));
      return quadQ(`점 ${pOf(EA, given[0], given[1], 'P', '가')} ${QN[gq]} 위의 점일 때, 점 ${pOf(EA, k1, k2, 'Q', '는')} 제몇 사분면 위의 점인가?`, qOf(EA, k1, k2, sa, sb),
        `점 P가 ${QN[gq]} 위의 점이므로 ${given.map((k, i) => cmp0(EA[k].h, gs[i])).join(', ')}이다. ${single.length > 1 ? `${cmp0(EA[single].h, EA[single].s(sa, sb))}에서 ${cmp0(known, sk)}이다. ` : ''}합 ${nb(EA.apb.h)}가 ${signWord(-sk)}인데 ${known}가 ${signWord(sk)}이므로 ${other}는 ${signWord(-sk)}이다. ${toldOf(EA, k1, k2, sa, sb, 'Q')}`);
    }, { count: 2, standard: STD5 }),
    H('hard-quad-two', '두 좌표가 모두 두 문자의 식인 점의 사분면에서 두 문자의 부호 정하기', '심16 ①28', (d, n) => {
      if (n === 0) {
        // 곱과 차: 곱이 음수이면 부호가 다르고, 차의 부호로 어느 쪽이 큰지(양수인지) 정한다.
        const sa = pm(d), sb = -sa, prod = d.pick(['ab', 'nab']), diff = d.pick(['amb', 'bma']), given = d.bool() ? [prod, diff] : [diff, prod], gq = qOf(EA, given[0], given[1], sa, sb), [k1, k2] = d.pick(SIMPLE);
        return quadQ(`점 ${pOf(EA, given[0], given[1], 'A', '가')} ${QN[gq]} 위의 점일 때, 점 ${pOf(EA, k1, k2, 'B', '는')} 제몇 사분면 위의 점인가?`, qOf(EA, k1, k2, sa, sb),
          `점 A가 ${QN[gq]} 위의 점이므로 ${given.map((k) => cmp0(EA[k].h, EA[k].s(sa, sb))).join(', ')}이다. ${cmp0(ab, -1)}이므로 ${va}, ${vb}의 부호는 서로 다르다. ${cmp0(EA[diff].h, EA[diff].s(sa, sb))}이므로 ${nb(`${va} ${sa > 0 ? GT : LT} ${vb}`)}이고, 큰 수가 양수, 작은 수가 음수이므로 ${cmp0(va, sa)}, ${cmp0(vb, sb)}이다. ${toldOf(EA, k1, k2, sa, sb, 'B')}`);
      }
      // 합과 곱: 곱이 양수이면 부호가 같고, 합의 부호가 두 수의 부호이다. 보기의 틀린 점은 모두 다른 사분면 위의 점이다.
      const s = pm(d), given = d.bool() ? ['apb', 'ab'] : ['ab', 'apb'], gq = qOf(EA, given[0], given[1], s, s);
      const all = pairsOf(EA, s, s, (x, y) => ![x, y].some((k) => k === 'bda' || k === 'adb') && [x, y].some((k) => FAMILY[k] === 'a' || FAMILY[k] === 'b'));
      const want = d.pick([0, 1, 2, 3].filter((v) => v !== gq)), right = d.pick(all.filter(([x, y]) => qOf(EA, x, y, s, s) === want)), rows = d.shuffle([right].concat(d.shuffle(all.filter(([x, y]) => qOf(EA, x, y, s, s) !== want)).slice(0, 3)));
      return C(`점 ${pOf(EA, given[0], given[1], '', '가')} ${QN[gq]} 위의 점일 때, 다음 중 ${QN[want]} 위의 점은?`, rows.map(([x, y]) => pOf(EA, x, y)), rows.indexOf(right), {
        explain: `${given.map((k) => cmp0(EA[k].h, EA[k].s(s, s))).join(', ')}이다. ${cmp0(ab, 1)}이므로 ${va}, ${vb}의 부호는 서로 같고, ${cmp0(EA.apb.h, s)}이므로 ${va}, ${vb}는 모두 ${signWord(s)}이다. ${rows.map(([x, y]) => `${pOf(EA, x, y, '', '는')} ${QN[qOf(EA, x, y, s, s)]}`).join(', ')} 위의 점이다.`,
        facts: { truth: rows.map(([x, y]) => qOf(EA, x, y, s, s) === want), want: true }
      });
    }, { count: 2, standard: STD5 }),
    H('hard-back-sym', '식으로 된 점의 사분면에서 부호를 구한 뒤 대칭인 점의 사분면 가리기', '심17·18 ①28', (d, n) => {
      const k = d.int(0, 2), flipOf = ([u, v]) => [u * SX[k], v * SY[k]];
      if (n === 0) {
        // 곱과 차로 부호를 정한 뒤, 문자 하나씩으로 된 점을 대칭으로 옮긴다.
        const sx = pm(d), sy = -sx, prod = d.pick(['ab', 'nab']), diff = d.pick(['amb', 'bma']), given = d.bool() ? [prod, diff] : [diff, prod], gq = qOf(EXY, given[0], given[1], sx, sy), [k1, k2] = d.pick(SIMPLE);
        const mid = [EXY[k1].s(sx, sy), EXY[k2].s(sx, sy)], end = flipOf(mid);
        return quadQ(`점 ${pOf(EXY, given[0], given[1], '', '가')} ${QN[gq]} 위의 점일 때, 점 ${pOf(EXY, k1, k2, '', '와')} ${ABOUT[k]}에 대하여 대칭인 점은 제몇 사분면 위의 점인가?`, quadAt(end[0], end[1]),
          `${given.map((g) => cmp0(EXY[g].h, EXY[g].s(sx, sy))).join(', ')}이다. ${cmp0(vx + vy, -1)}이므로 ${vx}, ${vy}의 부호는 서로 다르고, ${cmp0(EXY[diff].h, EXY[diff].s(sx, sy))}이므로 ${nb(`${vx} ${sx > 0 ? GT : LT} ${vy}`)}이다. 따라서 ${cmp0(vx, sx)}, ${cmp0(vy, sy)}이다. ${toldOf(EXY, k1, k2, sx, sy)} ${SYM_WHY[k]} 대칭인 점은 ${XC}가 ${signWord(end[0])}, ${YC}가 ${signWord(end[1])}이므로 ${QN[quadAt(end[0], end[1])]} 위의 점이다.`);
      }
      // 합과 곱으로 부호를 정한 뒤, 몫이 든 점을 대칭으로 옮긴다.
      const s = pm(d), given = d.bool() ? ['apb', 'ab'] : ['ab', 'apb'], gq = qOf(EA, given[0], given[1], s, s);
      const [k1, k2] = d.pick(pairsOf(EA, s, s, (x, y) => [x, y].some((g) => g === 'bda') && [x, y].some((g) => FAMILY[g] === 'a' || FAMILY[g] === 'b')));
      const mid = [EA[k1].s(s, s), EA[k2].s(s, s)], end = flipOf(mid);
      return quadQ(`점 ${pOf(EA, given[0], given[1], 'P', '가')} ${QN[gq]} 위의 점일 때, 점 ${pOf(EA, k1, k2, 'Q', '와')} ${ABOUT[k]}에 대하여 대칭인 점은 제몇 사분면 위의 점인가?`, quadAt(end[0], end[1]),
        `${given.map((g) => cmp0(EA[g].h, EA[g].s(s, s))).join(', ')}이다. ${cmp0(ab, 1)}이므로 ${va}, ${vb}의 부호는 서로 같고, ${cmp0(EA.apb.h, s)}이므로 ${va}, ${vb}는 모두 ${signWord(s)}이다. ${toldOf(EA, k1, k2, s, s, 'Q')} ${SYM_WHY[k]} 대칭인 점은 ${XC}가 ${signWord(end[0])}, ${YC}가 ${signWord(end[1])}이므로 ${QN[quadAt(end[0], end[1])]} 위의 점이다.`);
    }, { count: 2, standard: STD5 }),
    H('hard-line-signs', '수직선 위의 세 수의 크기와 부호로 식으로 된 점의 사분면 가리기', '심19', (d) => {
      // 세 수의 부호는 0의 어느 쪽에 있는지로, 차의 부호는 수직선에서의 왼쪽·오른쪽(크기)으로 정한다. 보기마다 식 둘의 부호를 가린다.
      // 걸리는 아이: 음수끼리의 차 a − b 를 「음수에서 음수를 빼면 양수」처럼 부호만으로 정하는 아이, 몫의 부호를 놓치는 아이.
      const vc = V('c'), two = d.bool(), g = two ? [-1, -1, 1] : [-1, 1, 1];
      const dif = (p, q, s) => ({ h: `${p} ${MINUS} ${q}`, s, kind: 'd' }), mul = (h, s) => ({ h, s, kind: 'm' });
      const pool = [dif(va, vb, -1), dif(vb, va, 1), dif(va, vc, -1), dif(vc, va, 1), dif(vb, vc, -1), dif(vc, vb, 1), mul(va + vb, g[0] * g[1]), mul(vb + vc, g[1] * g[2]), mul(va + vc, g[0] * g[2]), mul(frac(va + vb, vc), g[0] * g[1] * g[2]), mul(frac(vc, vb), g[1] * g[2])];
      const all = []; for (const p of pool) for (const q of pool) if (p.kind !== q.kind) all.push([p, q]);
      const qd = ([p, q]) => quadAt(p.s, q.s), show = ([p, q], josa) => nb('(' + p.h + ', ' + q.h + ')' + (josa || '')), want = d.int(0, 3);
      const right = d.pick(all.filter((r) => qd(r) === want)), rows = d.shuffle([right].concat(d.shuffle(all.filter((r) => qd(r) !== want)).slice(0, 3)));
      const order = two ? nb(`${va} ${LT} ${vb} ${LT} 0 ${LT} ${vc}`) : nb(`${va} ${LT} 0 ${LT} ${vb} ${LT} ${vc}`);
      return C(`수직선 위에 세 수 ${va}, ${vb}, ${vc}를 나타내면 그림과 같다. 다음 중 ${QN[want]} 위의 점은?`, rows.map((r) => show(r)), rows.indexOf(right), {
        figure: signLine(two ? [{ name: 'a', at: -3.4 }, { name: 'b', at: -1.5 }, { name: '0', at: 0 }, { name: 'c', at: 2.3 }] : [{ name: 'a', at: -2.4 }, { name: '0', at: 0 }, { name: 'b', at: 1.5 }, { name: 'c', at: 3.4 }]),
        explain: `수직선에서 ${order}이므로 ${two ? `${va}, ${vb}는 음수, ${vc}는 양수` : `${va}는 음수, ${vb}, ${vc}는 양수`}이다. 작은 수에서 큰 수를 빼면 음수이고, 큰 수에서 작은 수를 빼면 양수이다. ${rows.map((r) => `${cmp0(r[0].h, r[0].s)}, ${cmp0(r[1].h, r[1].s)}이므로 점 ${show(r, '는')} ${QN[qd(r)]}`).join(', ')} 위의 점이다.`,
        facts: { truth: rows.map((r) => qd(r) === want), want: true }
      });
    }, { standard: STD5 }),

    // ── 대칭인 점 ──
    H('hard-sym-letter', '대칭인 두 점의 좌표에 든 문자의 값 구하기', '①31 심20', (d, n) => {
      const ask = `${va}, ${vb}의 값은?`, inputs = (a, b) => [{ label: 'a', answer: a, signed: true }, { label: 'b', answer: b, signed: true }], zero = (on, v) => (on > 0 ? jx(v) : '0-' + jx(v));
      if (n === 0) {
        // 좌표마다 문자가 하나씩 있다. 걸리는 아이: 두 점의 좌표를 그대로 같다고 놓는 아이, 어느 좌표의 부호가 바뀌는지 거꾸로 대는 아이.
        const k = d.int(0, 2), c = d.pick([1, 1, 2, -1, -2]);
        const [a, p, b, s] = d.until(() => [nz(d, -4, 4), nz(d, -6, 6), nz(d, -5, 5), nz(d, -6, 6)], ([x, y, z, w]) => c * x + y !== 0 && Math.abs(c * x + y) <= 9 && z + w !== 0 && Math.abs(z + w) <= 9);
        const X = c * a + p, Y = b + s, r = SX[k] * X, q = SY[k] * Y, h1 = c < 0 ? poly([[p, ''], [c, va]]) : poly([[c, va], [p, '']]), h2 = lin(1, s, vb);
        return M(`점 ${nb('(' + h1 + ', ' + iq(q) + ')' + tail(Math.abs(q), '과/와'))} ${ABOUT[k]}에 대하여 대칭인 점의 좌표가 ${nb('(' + iq(r) + ', ' + h2 + ')일')} 때, ${ask}`, inputs(a, b), {
          explain: `${SYM_WHY[k]} ${XC}는 ${SX[k] > 0 ? '서로 같으므로' : '부호만 다르므로'} ${eq(h1, iq(X))}, ${eq(va, iq(a))}이다. ${YC}는 ${SY[k] > 0 ? '서로 같으므로' : '부호만 다르므로'} ${eq(h2, iq(Y))}, ${eq(vb, iq(b))}이다.`,
          facts: { calc: [[`(${zero(SX[k], r)}-${jx(p)})/${jx(c)}`, 0], [`${zero(SY[k], q)}-${jx(s)}`, 1]], unseen: [0, 1], rule: 'sym-each' }
        });
      }
      if (n === 1) {
        // 한 좌표에 두 문자가 함께 있다: 문자가 하나뿐인 좌표에서 a 의 값을 먼저 구해 넣는다. x좌표의 부호가 바뀌는 대칭(y축, 원점)만 쓴다.
        const k = d.pick([1, 2]), m = d.pick([2, 3]);
        const [a, p, q] = d.until(() => [nz(d, -4, 4), nz(d, -6, 6), nz(d, -6, 6)], ([x, y, z]) => { const b0 = (1 - m) * x - y, px = m * x + y; return b0 !== 0 && Math.abs(b0) <= 9 && z !== x && px !== 0 && Math.abs(px) <= 12; });
        const b = (1 - m) * a - p, r = SY[k] * (q - a), ya = poly([[-1, va], [q, '']]), xb = poly([[1, vb], [-a, '']]), aEx = `${jx(q)}${SY[k] > 0 ? '-' : '+'}${jx(r)}`;
        return M(`두 점 ${nb('P(' + lin(m, p, va) + ', ' + ya + ')')}, ${nb('Q(' + poly([[-1, va], [1, vb]]) + ', ' + iq(r) + ')' + tail(Math.abs(r), '이/가'))} ${ABOUT[k]}에 대하여 대칭일 때, ${ask}`, inputs(a, b), {
          explain: `${SYM_WHY[k]} ${YC}는 ${SY[k] > 0 ? '서로 같으므로' : '부호만 다르므로'} ${eq(ya, iq(SY[k] * r))}, ${eq(va, iq(a))}이다. 이때 점 P의 ${XC}는 ${iq(m * a + p)}, 점 Q의 ${XC}는 ${xb}이다. ${XC}는 부호만 다르므로 ${eq(xb, iq(-(m * a + p)))}, ${eq(vb, iq(b))}이다.`,
          facts: { calc: [[aEx, 0], [`(1-${m})*(${aEx})-${jx(p)}`, 1]], unseen: [1], rule: 'sym-shared' }
        });
      }
      // 한 점을 옮긴 점과 다른 점을 옮긴 점이 같다: 두 점을 저마다 대칭으로 옮긴 뒤 자리끼리 견준다.
      const [k1, k2] = d.shuffle([0, 1, 2]).slice(0, 2), sx = SX[k1] * SX[k2], sy = SY[k1] * SY[k2];
      const [p, r, q, s] = d.until(() => [nz(d, -6, 6), nz(d, -7, 7), nz(d, -7, 7), nz(d, -6, 6)], ([p0, r0, q0, s0]) => { const a0 = sx * r0 - p0, b0 = s0 - sy * q0; return a0 !== 0 && Math.abs(a0) <= 9 && b0 !== 0 && Math.abs(b0) <= 9; });
      const a = sx * r - p, b = s - sy * q, h1 = lin(1, p, va), h2 = poly([[s, ''], [-1, vb]]), m1 = SX[k1] > 0 ? h1 : poly([[-1, va], [-p, '']]), m2 = SY[k2] > 0 ? h2 : poly([[1, vb], [-s, '']]);
      return M(`점 ${nb('(' + h1 + ', ' + iq(q) + ')' + tail(Math.abs(q), '과/와'))} ${ABOUT[k1]}에 대하여 대칭인 점이 점 ${nb('(' + iq(r) + ', ' + h2 + ')와')} ${ABOUT[k2]}에 대하여 대칭인 점과 같을 때, ${ask}`, inputs(a, b), {
        explain: `점 ${nb('(' + h1 + ', ' + iq(q) + ')' + tail(Math.abs(q), '과/와'))} ${ABOUT[k1]}에 대하여 대칭인 점의 좌표는 ${nb('(' + m1 + ', ' + iq(SY[k1] * q) + ')이고')}, 점 ${nb('(' + iq(r) + ', ' + h2 + ')와')} ${ABOUT[k2]}에 대하여 대칭인 점의 좌표는 ${nb('(' + iq(SX[k2] * r) + ', ' + m2 + ')이다')}. 두 점이 같으므로 ${eq(m1, iq(SX[k2] * r))}에서 ${eq(va, iq(a))}이고, ${eq(m2, iq(SY[k1] * q))}에서 ${eq(vb, iq(b))}이다.`,
        facts: { calc: [[`${zero(sx, r)}-${jx(p)}`, 0], [`${jx(s)}${sy > 0 ? '-' : '+'}${jx(q)}`, 1]], unseen: [0], rule: 'sym-both-moved' }
      });
    }, { count: 3, standard: STD5 }),
    H('hard-sym-twice', '자리를 바꾼 점을 두 번 대칭으로 옮긴 점의 사분면 가리기', '심21', (d) => {
      const q = d.int(0, 3), [sa, sb] = QS[q], [k1, k2] = d.pick(SIMPLE.filter(([x]) => FAMILY[x] === 'b')), [m1, m2] = d.shuffle([0, 1, 2]).slice(0, 2);
      const s0 = [EA[k1].s(sa, sb), EA[k2].s(sa, sb)], s1 = [s0[0] * SX[m1], s0[1] * SY[m1]], s2 = [s1[0] * SX[m2], s1[1] * SY[m2]];
      return quadQ(`점 ${nb('P(' + va + ', ' + vb + ')가')} ${QN[q]} 위의 점이다. 점 ${pOf(EA, k1, k2, 'Q', '와')} ${ABOUT[m1]}에 대하여 대칭인 점을 S라 할 때, 점 S와 ${ABOUT[m2]}에 대하여 대칭인 점은 제몇 사분면 위의 점인가?`, quadAt(s2[0], s2[1]),
        `점 P가 ${QN[q]} 위의 점이므로 ${cmp0(va, sa)}, ${cmp0(vb, sb)}이다. ${toldOf(EA, k1, k2, sa, sb, 'Q')} ${SYM_WHY[m1]} 점 S는 ${XC}가 ${signWord(s1[0])}, ${YC}가 ${signWord(s1[1])}이므로 ${QN[quadAt(s1[0], s1[1])]} 위의 점이다. ${SYM_WHY[m2]} 구하는 점은 ${XC}가 ${signWord(s2[0])}, ${YC}가 ${signWord(s2[1])}이므로 ${QN[quadAt(s2[0], s2[1])]} 위의 점이다.`);
    }, { standard: STD5 }),
    H('hard-sym-letter-area', '대칭 조건으로 문자의 값을 정한 뒤 삼각형의 넓이 구하기', '①37', (d) => {
      // 같은 좌표끼리는 같다고, 부호가 바뀌는 좌표끼리는 한쪽의 부호를 바꾸어 같다고 놓는다. 두 점을 이은 변은 좌표축에 평행하고, 원점에서 그 변까지의 거리가 높이이다.
      const onX = d.bool(), m1 = d.pick([3, 4]), m2 = d.pick([1, 2]), t = d.pick([2, 3]);
      const [a, X, b, Y] = d.until(() => [nz(d, -3, 3), pm(d) * d.int(2, 6), nz(d, -5, 5), pm(d) * d.int(2, 8)], ([a0, X0, b0, Y0]) => [X0 - m1 * a0, X0 - m2 * a0, Y0 + b0, -Y0 - t * b0].every((v) => v !== 0 && Math.abs(v) <= 12) && Math.abs(X0) !== Math.abs(Y0));
      const p1 = X - m1 * a, p2 = X - m2 * a, c = Y + b, u = -Y - t * b, e1 = lin(m1, p1, va), e2 = lin(m2, p2, va), g1 = poly([[c, ''], [-1, vb]]), g2 = lin(t, u, vb), area = Math.abs(X) * Math.abs(Y);
      const A = onX ? [X, Y] : [Y, X], Bp = onX ? [X, -Y] : [-Y, X], same = onX ? XC : YC, opp = onX ? YC : XC;
      return N(`두 점 ${nb('A(' + (onX ? e1 + ', ' + g1 : g1 + ', ' + e1) + ')')}, ${nb('B(' + (onX ? e2 + ', ' + g2 : g2 + ', ' + e2) + ')' + tail(Math.abs(onX ? u : p2), '이/가'))} ${onX ? XA : YA}에 대하여 대칭일 때, 삼각형 OAB의 넓이는? (단, O는 원점이다.)`, area, {
        explain: `${onX ? XA : YA}에 대하여 대칭인 두 점은 ${same}가 같고 ${opp}는 부호만 다르다. ${eq(e1, e2)}에서 ${eq(va, iq(a))}이고, ${eq(g1, MINUS + '(' + g2 + ')')}에서 ${eq(vb, iq(b))}이다. 두 점의 좌표는 ${P('A', A[0], A[1])}, ${P('B', Bp[0], Bp[1])}이다. 변 AB는 ${onX ? YA : XA}에 평행하고 길이는 ${2 * Math.abs(Y)}이며, 원점 O에서 변 AB까지의 거리는 ${Math.abs(X)}이다. 넓이는 ${nb(`${frac(1, 2)} × ${2 * Math.abs(Y)} × ${Math.abs(X)} = ${area}`)}이다.`,
        facts: { value: `${X * Y < 0 ? '0-' : ''}(${m1}*(${jx(p2)}-${jx(p1)})/(${m1}-${m2})+${jx(p1)})*(${jx(c)}+(${jx(u)}+${jx(c)})/(${t}-1))`, unseen: [0, 1] }
      });
    }, { standard: STD5 }),

    // ── 넓이 ──
    H('hard-area-quad', '좌표축에 평행한 변이 하나뿐인 사각형의 넓이', '심29', (d) => {
      // 사각형을 둘러싸는 직사각형에서 모서리의 직각삼각형 셋을 뺀다. A 는 직사각형의 꼭짓점에, B·C 는 그 맞은편 변 위에, D 는 남은 변 위에 놓았다(뒤집거나 가로·세로를 바꾸어 놓기도 한다).
      // 좌표가 ±1인 꼭짓점은 두지 않는다(이름이 눈금 수와 겹친다). 삼각형(hard-area-tilted)과 달리 빼는 조각이 어느 모서리에 생기는지부터 가려야 한다.
      const [x1, x2, y1, y2, xb, xc, yd] = d.until(() => [d.int(-4, -2), d.int(2, 4), d.int(-4, -2), d.int(2, 4), nz(d, -3, 3), nz(d, -3, 3), nz(d, -3, 3)],
        ([a1, a2, b1, b2, p, q, r]) => p > a1 && q - p >= 2 && q < a2 && r > b1 && r < b2 && [p, q, r].every((v) => Math.abs(v) !== 1) && ((p - a1) * (b2 - b1) + (a2 - q) * (r - b1) + (a2 - a1) * (b2 - r)) % 2 === 0);
      const fx = pm(d), fy = pm(d), turn = d.bool(), pts = [[x1, y2], [xb, y1], [xc, y1], [x2, yd]].map(([x, y]) => (turn ? [fy * y, fx * x] : [fx * x, fy * y]));
      const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), W = span(Math.min(...xs), Math.max(...xs)), Hh = span(Math.min(...ys), Math.max(...ys));
      const legs = [[0, 1], [2, 3], [3, 0]].map(([i, j]) => [span(pts[i][0], pts[j][0]), span(pts[i][1], pts[j][1])]), cut2 = legs.map(([p, q]) => p.len * q.len), area = W.len * Hh.len - cut2.reduce((s, v) => s + v, 0) / 2;
      const cen = [xs.reduce((s, v) => s + v, 0) / 4, ys.reduce((s, v) => s + v, 0) / 4], side = ([x, y]) => (y >= cen[1] ? 'u' : 'd') + (x >= cen[0] ? 'r' : 'l');
      return N('그림과 같이 좌표평면 위에 네 점 A, B, C, D를 꼭짓점으로 하는 사각형이 있다. 사각형 ABCD의 넓이는?', area, {
        figure: plane({ poly: pts, points: pts.map((p, i) => ({ x: p[0], y: p[1], name: NAMES4[i], side: side(p) })) }),
        explain: `네 점의 좌표는 ${pts.map((p, i) => P(NAMES4[i], p[0], p[1])).join(', ')}이다. 변 BC만 좌표축에 평행하므로, 사각형을 둘러싸는 가로 ${W.len}, 세로 ${Hh.len}인 직사각형의 넓이에서 모서리에 생기는 직각삼각형 세 개의 넓이를 뺀다. 직사각형의 넓이는 ${nb(`${W.len} × ${Hh.len} = ${W.len * Hh.len}`)}이고, 세 직각삼각형의 넓이는 ${legs.map(([p, q]) => nb(`${frac(1, 2)} × ${p.len} × ${q.len} = ${half(p.len * q.len)}`)).join(', ')}이다. 사각형 ABCD의 넓이는 ${nb(`${W.len * Hh.len} − ${half(cut2.reduce((s, v) => s + v, 0))} = ${area}`)}이다.`,
        facts: { value: `${W.ex}*${Hh.ex}-(${legs.map(([p, q]) => `${p.ex}*${q.ex}`).join('+')})/2`, unseen: [0, 2], rule: 'quad-tilted' }
      });
    }, { standard: STD5 }),
    H('hard-area-back', '넓이가 주어진 삼각형의 꼭짓점의 좌표 구하기', '심30', (d) => {
      // 높이(좌표의 차) → 넓이에서 밑변의 길이 → 밑변의 한 끝에서 그 길이만큼 떨어진 두 곳 가운데 조건에 맞는 곳.
      // 걸리는 아이: 밑변의 길이를 그대로 좌표로 답하는 아이, 한쪽 방향만 생각하여 조건(양수·음수)에 맞지 않는 값을 답하는 아이.
      const flatBase = d.bool();
      const [q0, y0, p0, t0, L, sg] = d.until(() => [nz(d, -5, 5), nz(d, -4, 4), d.int(-4, 4), nz(d, -6, 6), d.int(4, 12), pm(d)], ([q, y, p, t, len, s]) => { const h = Math.abs(t - y); return h >= 3 && h <= 9 && (h * len) % 2 === 0 && len > Math.abs(q) && Math.abs(q + s * len) <= 12 && p !== q; });
      const h = Math.abs(t0 - y0), S = L * h / 2, a = q0 + sg * L, hi = Math.max(t0, y0), lo = Math.min(t0, y0), sw = (x, y) => (flatBase ? [x, y] : [y, x]), A = sw(p0, t0), Bq = sw(q0, y0), on = flatBase ? XA : YA, same = flatBase ? YC : XC;
      return N(`세 점 ${P('A', A[0], A[1])}, ${P('B', Bq[0], Bq[1])}, ${flatBase ? nb('C(' + va + ', ' + iq(y0) + ')' + tail(Math.abs(y0), '을/를')) : nb('C(' + iq(y0) + ', ' + va + ')를')} 꼭짓점으로 하는 삼각형 ABC의 넓이가 ${S}일 때, ${va}의 값은? (단, ${cmp0(va, sg)})`, a, {
        signed: true,
        explain: `두 점 B, C는 ${same}가 같으므로 변 BC는 ${on}에 평행하다. 변 BC를 밑변으로 하면 높이는 점 A에서 변 BC까지의 거리인 ${minus(hi, lo)} = ${h}이다. ${nb(`${frac(1, 2)} × (변 BC의 길이) × ${h} = ${S}`)}이므로 변 BC의 길이는 ${L}이다. 점 C는 점 B에서 ${L}만큼 떨어져 있으므로 ${nb(`${va} = ${iq(q0)} + ${L} = ${iq(q0 + L)}`)} 또는 ${nb(`${va} = ${iq(q0)} ${MINUS} ${L} = ${iq(q0 - L)}`)}이다. ${cmp0(va, sg)}이므로 ${eq(va, iq(a))}이다.`,
        facts: { value: `${jx(q0)}${sg > 0 ? '+' : '-'}2*${S}/(${jx(hi)}-${jx(lo)})`, unseen: [2] }
      });
    }, { standard: STD5 }),

    // ── 그래프 ──
    H('hard-two-taps', '두 구간의 빠르기를 구해 한 수도꼭지로만 채우는 시간 구하기', '①68', (d) => {
      // 꺾이기 전의 가파르기는 두 수도꼭지를 합한 빠르기, 꺾인 뒤의 가파르기는 수도꼭지 A의 빠르기이다. 두 빠르기의 차가 수도꼭지 B의 빠르기이다.
      // 걸리는 아이: 꺾이기 전의 빠르기를 수도꼭지 B의 빠르기로 쓰는 아이, 그래프의 끝 값(다 찬 때)을 그대로 답하는 아이.
      const s = d.pick([{ V: 60, t1: 6, y1: 30, t2: 21, xs: 3, ys: 10 }, { V: 60, t1: 5, y1: 40, t2: 15, xs: 5, ys: 10 }, { V: 60, t1: 6, y1: 30, t2: 16, xs: 2, ys: 10 }, { V: 120, t1: 6, y1: 60, t2: 21, xs: 3, ys: 20 }, { V: 120, t1: 4, y1: 80, t2: 12, xs: 2, ys: 20 }]);
      const both = s.y1 / s.t1, rA = (s.V - s.y1) / (s.t2 - s.t1), rB = both - rA, ans = s.V / rB;
      return N(`들이가 ${s.V} L인 빈 물통에 두 수도꼭지 A, B를 함께 틀어 물을 받다가, 도중에 B를 잠그고 A로만 받아 물통을 가득 채웠다. 다음은 물을 받기 시작한 지 ${vx}분 후 물통에 담긴 물의 양을 ${vy} L라 하고 ${REL} 처음부터 수도꼭지 B만 틀어 이 물통을 가득 채우는 데 걸리는 시간은 몇 분인가? (단, 두 수도꼭지에서는 각각 매분 일정한 양의 물이 나온다.)`, ans, {
        unit: '분', figure: G('시간(분)', '물의 양(L)', s.t2 + s.xs, s.V + s.ys, s.xs, s.ys, [[[0, 0], [s.t1, s.y1], [s.t2, s.V]]]),
        explain: `그래프가 ${s.t1}분에서 꺾이므로 수도꼭지 B를 잠근 것은 ${s.t1}분 후이다. 처음 ${s.t1}분 동안 두 수도꼭지로 ${s.y1} L를 받았으므로 두 수도꼭지에서는 1분에 모두 ${nb(`${s.y1} ÷ ${s.t1} = ${both}(L)`)}의 물이 나온다. 그 뒤 ${nb(`${s.t2} − ${s.t1} = ${s.t2 - s.t1}(분)`)} 동안 수도꼭지 A로만 ${nb(`${s.V} − ${s.y1} = ${s.V - s.y1}(L)`)}를 받았으므로 수도꼭지 A에서는 1분에 ${nb(`${s.V - s.y1} ÷ ${s.t2 - s.t1} = ${rA}(L)`)}의 물이 나온다. 수도꼭지 B에서는 1분에 ${nb(`${both} − ${rA} = ${rB}(L)`)}의 물이 나오므로 걸리는 시간은 ${nb(`${s.V} ÷ ${rB} = ${ans}(분)`)}이다.`,
        facts: { value: `${s.V}/(${s.y1}/${s.t1}-(${s.V}-${s.y1})/(${s.t2}-${s.t1}))` }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
