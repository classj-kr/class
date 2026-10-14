// 중학교 1학년 1학기 6단원 정비례와 반비례 — 실력 문항.
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 7-1-6a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - x가 커질 때 y도 커지면 정비례, y가 작아지면 반비례라고 여긴다. y = x + 2, y = 2x + 1도 커지지만 정비례가 아니고, y = 10 − x도 작아지지만 반비례가 아니다.
//    정비례는 y가 x의 일정한 배(y ÷ x가 일정), 반비례는 x와 y의 곱이 일정한 것이다. 표에서 앞의 두 칸만 보고 2배·절반이 되는 것을 고른다.
//  - 「정비례는 커지고 반비례는 작아진다」고 외운다. a < 0인 정비례는 x가 커질 때 y가 작아지고, a < 0인 반비례는 x > 0에서 x가 커질 때 y도 커진다.
//  - 수가 클수록 직선이 y축에 가깝다고 여긴다. y축에 가까운 것은 절댓값이 큰 쪽이고, 음수끼리는 y축에 가까운 직선의 수가 더 작다.
//  - a의 부호를 정비례에서 반비례로 넘겨 읽지 못한다(y = ax의 그래프가 제2, 4사분면을 지나면 y = −a/x의 그래프는 제1, 3사분면에 있다).
//  - 톱니바퀴 문제는 모두 반비례라고 여긴다. 톱니 수가 정해진 두 톱니바퀴의 회전수끼리는 정비례한다.
//  - 용수철의 전체 길이가 무게에 정비례한다고 여긴다. 정비례하는 것은 늘어난 길이이다.
//  - 높이를 모르면 삼각형의 넓이를 식으로 나타낼 수 없다고 여긴다. 정비례한다는 것을 알면 한 쌍의 값으로 관계식이 정해진다.
//  - 반비례 관계의 그래프 위의 점으로 만든 직사각형의 넓이가 a라고만 외워, 그래프가 제2, 4사분면에 있어도 a를 양수로 적는다.
//
// 실력에는 ① 문제의 표·그림·상황에 함정이 있어 뜻을 정확히 대야 풀리는 문제와 ② 두 번 넘게 생각해야 풀리는 문제(그림에서 점을 읽어 관계식을 세우고 그림 밖의 점 구하기,
// 두 그래프가 만나는 점으로 다른 관계식의 수 구하기, 그것을 한 번 더 잇기, 두 값의 차로 a 구하기, 넓이에서 거꾸로 a 구하기, 두 직선과 세로 선분이 만드는 삼각형, 두 사람의 그래프 밖의 거리 차)만 실었다.
// 기본에서 하는 대입 한 번을 고르기로 바꾼 것, 수만 키운 계산은 싣지 않았다. 글로 준 한 쌍의 값에서 다른 값을 구하는 꼴(①9·24·37·52·71)은 수집본 기본 문서에 여러 번 나오므로 기본 묶음에 두었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, NAMES, name, N, C } = B.kit;
  const { LAB, MINUS, GT, LT, lcm, Q, qdiv, fl, mag, tx, nb, tail, js, V, pm, ansV, graph } = B.kit.mid;
  const { STD, keep, X, Y, A, XY, TAG6, CM2, jn, iq, signed, eqD, eqI, eqDa, eqIa, pt, ptj, quads, grid2, mini, picks, planeT, TICKS, clearGuide } = B.kit.m716;
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ①18' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make: (d, n) => keep(make(d, n)) }, more || {});
  const HALF = frac(1, 2);
  const divisors = (m, lo, hi) => { const out = []; for (let v = lo; v <= hi; v += 1) if (m % v === 0) out.push(v); return out; };
  const par = (n) => (n < 0 ? `(${iq(n)})` : String(n));   // 곱셈식에 적는 수(음수는 괄호)
  // 삼각형 ABC 와 변 BC 위의 점 P, 색칠한 삼각형 ABP. 길이는 적지 않는다(높이를 모르는 것이 문제의 장치이다).
  function triFig() {
    const word = (x, y, t, italic) => `<text x="${x}" y="${y}" text-anchor="middle" style="font-size:13px;font-weight:600;fill:#1f2933${italic ? ";font-style:italic;font-family:'MB Math','Times New Roman',serif;font-weight:400;font-size:14px" : ''}">${t}</text>`;
    return '<svg class="mb-geo" viewBox="0 0 236 140" width="236" role="img" aria-label="삼각형 ABC의 변 BC 위에 점 P가 있고, 삼각형 ABP를 색칠하였다. 선분 BP의 길이는 x cm이다. 삼각형의 높이는 적혀 있지 않다.">'
      + '<path d="M76 16L24 104H214Z" style="fill:#fff;stroke:#1f2933;stroke-width:1.6;stroke-linejoin:round"/><path d="M76 16L24 104H112Z" style="fill:rgba(37,99,235,0.14);stroke:#1d4ed8;stroke-width:1.6;stroke-linejoin:round"/>'
      + '<circle class="mb-dot" cx="112" cy="104" r="2.6"/>' + word(76, 11, 'A') + word(14, 109, 'B') + word(224, 109, 'C') + word(112, 119, 'P')
      + '<path d="M24 123v5h28M84 128h28v-5" style="fill:none;stroke:#5b6770;stroke-width:1"/>' + word(60, 132.5, 'x', true) + '<text x="66" y="132.5" style="font-size:11.5px;fill:#1f2933">cm</text></svg>';
  }

  B.addGroup('7-1-6', {
    id: 'hard', title: '실력 문제', standard: STD,
    types: [
      // ── ① 표·그림·상황에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-increase-count', '정비례·반비례 관계 가운데 x > 0에서 x의 값이 커질 때 y의 값도 커지는 것 세기', '심9·22·23 / 기본 ①43·44', (d) => {
        // 함정: 「정비례는 커지고 반비례는 작아진다」고 외운 아이는 정비례 관계의 수만 센다. a < 0인 정비례는 작아지고, a < 0인 반비례는 x > 0에서 커진다.
        const mk = (line, pos) => { const s = pos ? 1 : -1; return line ? { h: eqD(d.bool() ? Q(s * d.int(2, 6)) : signed(s, d.pick([Q(1, 2), Q(1, 3), Q(2, 3), Q(3, 2)]))), up: pos } : { h: eqI(s * d.int(2, 12)), up: !pos }; };
        const rows = d.until(() => d.shuffle([mk(true, true), mk(true, false), mk(false, true), mk(false, false), mk(d.bool(), d.bool()), mk(d.bool(), d.bool())]), (list) => new Set(list.map((r) => r.h)).size === 6);
        const flags = rows.map((r) => r.up), n = flags.filter(Boolean).length;
        return N(`다음 중 ${X} ${GT} 0일 때, ${X}의 값이 증가하면 ${Y}의 값도 증가하는 것은 모두 몇 개인가?`, n, {
          unit: '개', figure: grid2(rows.map((r) => r.h)),
          explain: `${X} ${GT} 0일 때 ${X}의 값이 증가하면, 정비례 관계 ${eqDa}에서는 ${A} ${GT} 0일 때 ${Y}의 값이 증가하고 ${A} ${LT} 0일 때 감소한다. 반비례 관계 ${eqIa}에서는 ${A} ${GT} 0일 때 ${Y}의 값이 감소하고 ${A} ${LT} 0일 때 증가한다. ${Y}의 값도 증가하는 것은 ${rows.map((r, i) => (flags[i] ? TAG6[i] : '')).filter(Boolean).join(', ')}의 ${n}개이다.`,
          facts: { count: flags }
        });
      }),
      H('hard-slopes-order', '네 직선의 그림에서 a, b, c, d의 대소 관계', '심13 / 기본 ①18', (d) => {
        // 함정: y축에 가까울수록 수가 크다고만 아는 아이는 음수끼리의 차례를 뒤집는다(음수는 y축에 가까운 쪽이 더 작다).
        //  보기: 바른 차례, 음수끼리 뒤집은 것, 양수끼리 뒤집은 것, 둘 다 뒤집은 것.
        const vals = { ps: Q(2), pf: Q(1, d.pick([2, 3])), nf: Q(-1, d.pick([2, 3])), ns: Q(-d.pick([2, 3])) };
        const keys = d.shuffle(['ps', 'pf', 'nf', 'ns']), L = ['a', 'b', 'c', 'd'], of = (key) => V(L[keys.indexOf(key)]);
        const chain = (order) => nb(order.map(of).join(` ${LT} `)), right = ['ns', 'nf', 'pf', 'ps'];
        const rows = d.shuffle([right, ['nf', 'ns', 'pf', 'ps'], ['ns', 'nf', 'ps', 'pf'], ['nf', 'ns', 'ps', 'pf']]), rel = (l) => nb(`${Y} = ${V(l)}${X}`);
        return C(`그림의 네 직선 ㉠, ㉡, ㉢, ㉣은 차례로 정비례 관계 ${L.map(rel).join(', ')}의 그래프이다. 네 수 ${L.map((l) => V(l)).join(', ')}의 대소 관계로 옳은 것은?`, rows.map(chain), rows.indexOf(right), {
          figure: planeT({ x: [-4, 4], y: [-4, 4], ticks: 'none', lines: keys.map((key, i) => ({ a: vals[key], name: LAB[i] })) }),
          explain: `제1사분면과 제3사분면을 지나는 직선의 수 ${of('pf')}, ${of('ps')}는 양수이고, 제2사분면과 제4사분면을 지나는 직선의 수 ${of('nf')}, ${of('ns')}는 음수이다. ${Y}축에 가까울수록 절댓값이 크므로 양수끼리는 ${Y}축에 가까운 쪽이 크고, 음수끼리는 ${Y}축에 가까운 쪽이 작다. 따라서 ${chain(right)}이다.`,
          facts: { truth: rows.map((r) => r === right), want: true }
        });
      }),
      H('hard-sign-carry', '정비례 관계의 그래프에서 읽은 부호로 반비례 관계의 그래프 고르기', '심24', (d) => {
        // 함정: 직선이 지나는 사분면을 그대로 곡선에 옮기는 아이(−a의 부호를 따지지 않는다), 직선과 곡선을 가리지 못하는 아이. 묻는 식은 늘 y = −a/x 이다.
        const s = pm(d), slope = signed(s, d.pick([Q(1), Q(2), Q(1, 2)])), flip = true, want = flip ? -s : s;
        const cands = [{ curve: 3 * want }, { curve: -3 * want }, { line: want }, { line: -want }], order = d.shuffle([0, 1, 2, 3]);
        const target = flip ? nb(`${Y} = ${MINUS}${frac(A, X)}`) : eqIa;
        return C(`그림은 정비례 관계 ${eqDa}의 그래프이다. 다음 ㉠~㉣ 가운데 반비례 관계 ${target}의 그래프로 알맞은 것은?`, LAB.slice(0, 4), order.indexOf(0), {
          figure: planeT({ x: [-3, 3], y: [-3, 3], grid: false, ticks: 'none', lines: [{ a: slope }] }) + picks(order.map((j, i) => mini(Object.assign({ name: LAB[i], grid: false }, cands[j])))),
          explain: `정비례 관계 ${eqDa}의 그래프가 ${quads(s > 0)}을 지나므로 ${A} ${s > 0 ? GT : LT} 0이다. ${flip ? `따라서 ${MINUS}${A} ${want > 0 ? GT : LT} 0이고, ` : ''}반비례 관계 ${target}의 그래프는 ${quads(want > 0)}에 있는 한 쌍의 매끄러운 곡선이다.`,
          facts: { truth: order.map((j) => j === 0), want: true }
        });
      }),
      H('hard-gear-turns', '톱니 수가 정해진 두 톱니바퀴의 회전수 사이의 관계식', '심49', (d) => {
        // 함정: 톱니바퀴이니 반비례라고 여기는 아이(y = 3/x, 톱니 수를 그대로 쓴 y = 24/x), 톱니가 많은 쪽이 많이 돈다고 여기는 아이(a와 1/a를 바꿈).
        const r = d.pick([2, 3, 4]), small = d.pick([12, 15, 16, 18, 24]), aBig = d.bool(), nA = aBig ? small * r : small, nB = aBig ? small : small * r, a = Q(nA, nB);
        const rows = d.shuffle([[eqD(Q(1, r)), !aBig], [eqD(r), aBig], [eqI(r), false], [eqI(nA), false]]);
        return C(`톱니가 ${nA}개인 톱니바퀴 A와 톱니가 ${nB}개인 톱니바퀴 B가 서로 맞물려 돌고 있다. A가 ${X}번 회전하는 동안 B는 ${Y}번 회전한다고 할 때, ${X}와 ${Y} 사이의 관계식은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
          explain: `두 톱니바퀴에서 맞물려 돌아간 톱니의 수는 서로 같으므로 ${nA} × ${X} = ${nB} × ${Y}이다. 따라서 ${eqD(a)}이다. 톱니의 수가 정해진 두 톱니바퀴의 회전수는 서로 정비례한다.`,
          facts: { truth: rows.map((row) => row[1]), want: true }
        });
      }),
      H('hard-spring', '늘어난 길이가 무게에 정비례하는 용수철의 전체 길이', '심53', (d) => {
        // 함정: 전체 길이를 그대로 넣는 아이. 무게에 정비례하는 것은 늘어난 길이이므로 처음 길이를 빼야 한다.
        const len = d.pick([10, 12, 15, 20]), w0 = d.pick([10, 20, 30, 40, 50]), e0 = d.int(2, 5), j = d.int(2, 6), total = len + e0 * j, v = w0 * j;
        return N(`길이가 ${len} cm인 용수철에 추를 매달 때, 용수철이 늘어난 길이는 추의 무게에 정비례한다. 무게가 ${w0} g인 추를 매달았더니 용수철이 ${e0} cm 늘어났다. 용수철의 전체 길이가 ${total} cm가 되게 하려면 무게가 몇 g인 추를 매달아야 하는가?`, v, {
          unit: 'g',
          explain: `무게가 ${X} g인 추를 매달 때 늘어난 길이를 ${Y} cm라 하면 ${eqD(Q(e0, w0))}이다. 전체 길이가 ${total} cm이면 늘어난 길이는 ${total} − ${len} = ${e0 * j}(cm)이므로 ${Y} = ${e0 * j}일 때 ${X} = ${v}이다. 무게에 정비례하는 것은 전체 길이가 아니라 늘어난 길이이다.`,
          facts: { value: `(${total}-${len})*${w0}/${e0}` }
        });
      }),
      H('hard-tri-pair', '높이를 모르는 삼각형에서 한 쌍의 값으로 넓이 구하기', '심51', (d) => {
        // 함정: 높이가 없어서 넓이를 구할 수 없다고 여기는 아이. 높이가 일정하므로 넓이는 밑변의 길이에 정비례하고, 한 쌍의 값으로 관계식이 정해진다.
        const a = d.pick([Q(3), Q(4), Q(5), Q(5, 2), Q(7, 2), Q(9, 2)]), [t0, t1] = d.shuffle([1, 2, 3, 4]), x0 = 2 * t0, x1 = 2 * t1, y0 = a.p * x0 / a.q, y1 = a.p * x1 / a.q, side = Math.max(x0, x1) + d.pick([2, 4]);
        return N(`그림과 같이 변 BC의 길이가 ${side} cm인 삼각형 ABC의 변 BC 위에 점 P가 있다. 선분 BP의 길이를 ${X} cm, 삼각형 ABP의 넓이를 ${Y} ${CM2}라 하면 ${X} = ${x0}일 때 ${Y} = ${y0}이다. ${X} = ${x1}일 때 ${Y}의 값은?`, y1, {
          figure: triFig(),
          explain: `삼각형 ABP에서 변 BP를 밑변으로 보면 높이는 점 P의 자리와 관계없이 일정하다. 넓이는 밑변의 길이의 일정한 배이므로 ${Y}는 ${X}에 정비례한다. ${eqDa}에 ${X} = ${x0}, ${Y} = ${y0}${tail(y0, '을/를')} 대입하면 ${A} = ${tx(a)}이므로 ${eqD(a)}이고, ${X} = ${x1}일 때 ${Y} = ${y1}이다.`,
          facts: { value: `${y0}*${x1}/${x0}` }
        });
      }),
      H('hard-rect-other', '직사각형의 넓이와 그림으로 a를 정해 그래프 위의 다른 점 구하기', '기본 ①63 / 심37', (d) => {
        // 함정: 넓이가 곧 a라고만 외운 아이. 점 P가 제2사분면에 있으면 a는 음수이다. 넓이에서 a, a에서 다른 점으로 두 번 이어 구한다.
        const [px, py] = d.pick([[3, 4], [4, 3], [4, 5], [5, 4], [2, 5], [5, 2], [3, 5], [5, 3]]), m = px * py, left = d.bool(), x = left ? -px : px, a = left ? -m : m;
        const x1 = pm(d) * d.pick(divisors(m, 2, m).filter((v) => v !== px)), y1 = a / x1;
        return ansV(`그림과 같이 반비례 관계 ${eqIa}의 그래프 위의 점 P에서 ${X}축, ${Y}축에 그은 수선이 ${X}축, ${Y}축과 만나는 점을 각각 A, B라 할 때, 직사각형 OAPB의 넓이가 ${m}이다. 이 그래프 위의 점 가운데 ${X}좌표가 ${iq(x1)}인 점의 ${Y}좌표는? (단, O는 원점이다.)`, Q(y1), 'int', {
          figure: planeT({ x: left ? [-6, 1] : [-1, 6], y: [-1, 6], grid: false, ticks: 'none', curves: [{ a }], poly: [[0, 0], [x, 0], [x, py], [0, py]], points: [{ x, y: py, name: 'P', side: left ? 'ul' : 'ur' }, { x, y: 0, name: 'A', side: left ? 'dl' : 'dr' }, { x: 0, y: py, name: 'B', side: left ? 'ur' : 'ul' }] }),
          explain: `직사각형 OAPB의 넓이는 점 P의 ${X}좌표와 ${Y}좌표의 곱의 절댓값이고, 그 곱이 ${A}이다. 점 P가 제${left ? 2 : 1}사분면에 있으므로 ${A} ${left ? LT : GT} 0이고 ${A} = ${iq(a)}이다. ${eqI(a)}에 ${X} = ${iq(x1)}${tail(Math.abs(x1), '을/를')} 대입하면 ${Y} = ${iq(y1)}이다.`,
          facts: { value: `${jn(a)}/${jn(x1)}` }
        });
      }),
      // ── ② 두 번 넘게 생각해야 풀리는 문제 ──
      H('hard-meet-chain', '만나는 점을 거쳐 세 번 이어 구하기', '기본 ①60 / 심32', (d, n) => {
        const b = V('b');
        if (n === 0) {
          // 만나는 점의 y좌표 → 반비례 관계식의 a → 그 그래프 위의 다른 점의 좌표
          const others = (v, k) => divisors(Math.abs(v.p * v.q * k * k), 2, 12).filter((w) => w !== Math.abs(v.q * k));
          const [s, t] = d.until(() => [signed(pm(d), d.pick([Q(2), Q(3), Q(1, 2), Q(1, 3), Q(2, 3), Q(3, 2)])), pm(d) * d.int(1, 3)], ([v, k]) => Math.abs(v.q * k) >= 2 && Math.abs(v.p * v.q * k * k) <= 48 && others(v, k).length > 0), x0 = s.q * t, y0 = s.p * t, a = x0 * y0;
          const x1 = pm(d) * d.pick(others(s, t)), v = a / x1;
          return ansV(`정비례 관계 ${eqD(s)}의 그래프와 반비례 관계 ${eqIa}의 그래프가 ${X}좌표가 ${iq(x0)}인 점에서 만난다. 반비례 관계 ${eqIa}의 그래프가 점 ${pt(x1, b)}를 지날 때, ${b}의 값은?`, Q(v), 'int', {
            explain: `${eqD(s)}에 ${X} = ${iq(x0)}${tail(Math.abs(x0), '을/를')} 대입하면 ${Y} = ${iq(y0)}이므로 두 그래프는 점 ${pt(x0, y0)}에서 만난다. 이 점이 ${eqIa}의 그래프 위에 있으므로 ${A} = ${iq(x0)} × ${par(y0)} = ${iq(a)}이다. ${eqI(a)}에 ${X} = ${iq(x1)}${tail(Math.abs(x1), '을/를')} 대입하면 ${b} = ${iq(v)}이다.`,
            facts: { value: `${js(s)}*${jn(x0)}*${jn(x0)}/${jn(x1)}`, rule: 'chain-after' }
          });
        }
        // 한 점으로 정비례 관계식의 a → 만나는 점의 x좌표(y좌표에서 거꾸로) → 반비례 관계식의 b
        const [p, q] = d.pick([[1, 2], [1, 3], [2, 3], [3, 2], [2, 1], [3, 1]]), sp = pm(d), [u, t] = d.until(() => [pm(d) * d.int(1, 3), pm(d) * d.int(1, 3)], ([k, j]) => k !== j && Math.abs(q * j) >= 2 && Math.abs(p * q * j * j) <= 48);
        const s = Q(sp * p, q), x1 = q * u, y1 = sp * p * u, x0 = q * t, y0 = sp * p * t, v = x0 * y0;
        return ansV(`정비례 관계 ${eqDa}의 그래프가 점 ${ptj(x1, y1, '을/를')} 지나고, 반비례 관계 ${nb(`${Y} = ${frac(b, X)}`)}의 그래프와 ${Y}좌표가 ${iq(y0)}인 점 P에서 만난다. 수 ${b}의 값은?`, Q(v), 'int', {
          explain: `${eqDa}에 ${X} = ${iq(x1)}, ${Y} = ${iq(y1)}${tail(Math.abs(y1), '을/를')} 대입하면 ${A} = ${tx(s)}이다. ${eqD(s)}에 ${Y} = ${iq(y0)}${tail(Math.abs(y0), '을/를')} 대입하면 ${X} = ${iq(x0)}이므로 P${pt(x0, y0)}이다. 점 P가 반비례 관계의 그래프 위에 있으므로 ${b} = ${iq(x0)} × ${par(y0)} = ${iq(v)}이다.`,
          facts: { value: `${jn(y0)}*${jn(x1)}/${jn(y1)}*${jn(y0)}`, rule: 'chain-before' }
        });
      }, { count: 2 }),
      H('hard-inverse-diff', '그래프 위의 두 점의 y좌표의 차로 a 구하기', '기본 ①38 / 심28', (d) => {
        // 두 점의 y좌표를 a로 나타내어(대입 두 번) 차가 주어진 값이 되는 a를 구한다. 어느 점의 y좌표가 큰지에서 a의 부호가 정해진다.
        const [x1, x2] = d.pick([[2, 4], [2, 3], [3, 6], [2, 6], [3, 4], [4, 6], [2, 5], [4, 8]]), L = lcm(x1, x2), m = L * d.int(1, Math.max(1, Math.floor(48 / L))), pos = d.bool(), a = pos ? m : -m, dv = m / x1 - m / x2;
        return ansV(`반비례 관계 ${eqIa}의 그래프 위의 두 점 P, Q의 ${X}좌표가 각각 ${x1}, ${x2}이고, 점 P의 ${Y}좌표가 점 Q의 ${Y}좌표보다 ${dv}만큼 ${pos ? '크다' : '작다'}. 수 ${A}의 값은?`, Q(a), 'int', {
          explain: `두 점 P, Q의 ${Y}좌표는 각각 ${frac(A, x1)}, ${frac(A, x2)}이므로 ${frac(A, x1)} − ${frac(A, x2)} = ${iq(pos ? dv : -dv)}이다. 양변에 ${L}${tail(L, '을/를')} 곱하면 ${L / x1 === 1 ? '' : L / x1}${A} − ${L / x2 === 1 ? '' : L / x2}${A} = ${iq((pos ? dv : -dv) * L)}이므로 ${A} = ${iq(a)}이다.`,
          facts: { value: `${pos ? dv : '(-' + dv + ')'}*${x1}*${x2}/(${x2}-${x1})` }
        });
      }),
      H('hard-tri-a', '삼각형의 넓이와 그래프의 성질로 a 구하기', '기본 ①66 / 심40', (d) => {
        // 넓이에서 높이를 거꾸로 구하고(높이는 a의 절댓값), 그래프의 성질에서 a의 부호를 정한다.
        const k = d.int(2, 6), size = d.until(() => d.int(2, 6), (v) => (k * v) % 2 === 0), area = k * size / 2, pos = d.bool(), a = pos ? size : -size;
        const told = d.bool() ? `정비례 관계 ${eqDa}의 그래프는 ${quads(pos)}을 지난다.` : `정비례 관계 ${eqDa}에서 ${X}의 값이 증가하면 ${Y}의 값${pos ? '도 증가' : '은 감소'}한다.`;
        return ansV(`${told} 이 관계의 그래프 위의 점 P${pt(1, A)}와 원점 O, 점 Q${ptj(k, 0, '을/를')} 꼭짓점으로 하는 삼각형 OPQ의 넓이가 ${area}일 때, 수 ${A}의 값은?`, Q(a), 'int', {
          explain: `삼각형 OPQ에서 변 OQ를 밑변으로 보면 밑변의 길이는 ${k}이고, 높이는 점 P의 ${Y}좌표 ${A}의 절댓값이다. ${HALF} × ${k} × (높이) = ${area}에서 높이는 ${size}이다. ${told.replace(/\.$/, '')}고 하였으므로 ${A} ${pos ? GT : LT} 0이고 ${A} = ${iq(a)}이다.`,
          facts: { value: `${pos ? '2' : '(-2)'}*${area}/${k}`, unseen: [2] }
        });
      }),
      H('hard-two-walkers', '두 사람의 그래프에서 관계식을 세워 그래프 밖의 시각의 거리 차 구하기', '기본 ①76', (d) => {
        // 그래프에는 처음 몇 분만 그려져 있다. 두 사람의 관계식을 각각 세워(두 번) 묻는 시각의 거리를 구하고(두 번) 뺀다.
        const [far, t1, t2] = d.pick([[600, 4, 5], [600, 5, 6], [300, 2, 3], [600, 3, 4], [900, 5, 6]]), [n1, n2] = d.shuffle(NAMES).slice(0, 2), at = d.pick([20, 30]), v1 = far / t1, v2 = far / t2, gap = (v1 - v2) * at;
        return N(`그림은 ${name(n1, '과/와')} ${name(n2, '이/가')} 학교에서 동시에 출발하여 같은 길을 따라 같은 방향으로 각각 일정한 속력으로 걸을 때, 출발한 지 ${X}분 동안 걸은 거리 ${Y} m 사이의 관계를 나타낸 그래프이다. 출발한 지 ${at}분 후 두 사람 사이의 거리는 몇 m인가?`, gap, {
          unit: 'm',
          figure: graph({ xname: 'x(분)', yname: 'y(m)', xmax: t2 + 1, ymax: far * 4 / 3, xstep: 1, ystep: far / 3, paths: [{ pts: [[0, 0], [t1, far]], name: n1 }, { pts: [[0, 0], [t2, far]], name: n2 }], marks: [[t1, far], [t2, far]] }),
          explain: `두 그래프는 원점을 지나는 직선이므로 걸은 거리는 시간에 정비례한다. ${name(n1, '은/는')} ${t1}분 동안 ${far} m를 걸었으므로 ${eqD(v1)}, ${name(n2, '은/는')} ${t2}분 동안 ${far} m를 걸었으므로 ${eqD(v2)}이다. ${X} = ${at}일 때 ${Y}의 값은 각각 ${v1 * at}, ${v2 * at}이므로 두 사람 사이의 거리는 ${v1 * at} − ${v2 * at} = ${gap}(m)이다.`,
          facts: { value: `${at}*${far}/${t1}-${at}*${far}/${t2}` }
        });
      })
    ]
  });
  // ── 기본 묶음에 덧붙이는 꼴 ──
  // 받으면서 실력에서 기본으로 내린 꼴: 기본에서 하는 일을 다시 묻거나 한 번에 풀리는 것.
  const TB = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 자료(' + ref + ')', make: (d, n) => keep(make(d, n)) }, more || {});
  B.addTypes('7-1-6', 'both', [
    TB('both-read-other', '그림에서 그래프가 지나는 점을 읽어 그림 밖의 점의 좌표 구하기', '기본 ①25·53 / 심18·27', (d, n) => {
      // 그림에서 점 A의 좌표를 읽고 → 관계식을 세우고 → 그림에 보이지 않는 점의 좌표를 구한다(정비례는 y좌표에서 x좌표를 거꾸로, 반비례는 x좌표에서 y좌표를).
      if (n === 0) {
        const [p, q] = d.pick([[3, 2], [2, 3], [3, 4], [4, 3], [1, 2], [2, 1]]), sx = pm(d), sy = pm(d), xA = sx * q, yA = sy * p, a = Q(yA, xA);
        const t = d.until(() => pm(d) * d.int(2, 7), (v) => Math.abs(p * v) >= 6 && Math.abs(p * v) <= 15 && Math.abs(q * v) <= 15), x1 = xA * t, y1 = yA * t;
        return ansV(`그림과 같이 정비례 관계 ${eqDa}의 그래프가 점 A를 지난다. 이 그래프 위의 점 가운데 ${Y}좌표가 ${iq(y1)}인 점의 ${X}좌표는?`, Q(x1), 'int', {
          figure: planeT({ x: [-5, 5], y: [-5, 5], ticks: TICKS, lines: [{ a }], points: [{ x: xA, y: yA, name: 'A', guide: clearGuide(xA, yA), side: a.p > 0 ? (yA > 0 ? 'ul' : 'dr') : (yA > 0 ? 'ur' : 'dl') }] }),
          explain: `그래프가 점 A${pt(xA, yA)}${tail(p, '을/를')} 지나므로 ${eqDa}에 ${X} = ${iq(xA)}, ${Y} = ${iq(yA)}${tail(p, '을/를')} 대입하면 ${A} = ${tx(a)}이다. ${eqD(a)}에 ${Y} = ${iq(y1)}${tail(Math.abs(y1), '을/를')} 대입하면 ${X} = ${iq(x1)}이다.`,
          facts: { value: `${jn(y1)}*${jn(xA)}/${jn(yA)}`, rule: 'read-line' }
        });
      }
      const [px, py] = d.pick([[2, 3], [3, 2], [2, 4], [4, 2], [3, 4], [4, 3]]), sx = pm(d), sy = pm(d), xA = sx * px, yA = sy * py, a = xA * yA, m = px * py;
      const x1 = pm(d) * d.pick(divisors(m, 6, m)), y1 = a / x1;
      return ansV(`그림과 같이 반비례 관계 ${eqIa}의 그래프가 점 A를 지난다. 이 그래프 위의 점 가운데 ${X}좌표가 ${iq(x1)}인 점의 ${Y}좌표는?`, Q(y1), 'int', {
        figure: planeT({ x: [-5, 5], y: [-5, 5], ticks: TICKS, curves: [{ a }], points: [{ x: xA, y: yA, name: 'A', guide: clearGuide(xA, yA), side: (sy > 0 ? 'u' : 'd') + (sx > 0 ? 'r' : 'l') }] }),
        explain: `그래프가 점 A${pt(xA, yA)}${tail(py, '을/를')} 지나므로 ${A} = ${iq(xA)} × ${par(yA)} = ${iq(a)}이다. ${eqI(a)}에 ${X} = ${iq(x1)}${tail(Math.abs(x1), '을/를')} 대입하면 ${Y} = ${iq(y1)}이다.`,
        facts: { value: `${jn(xA)}*${jn(yA)}/${jn(x1)}`, rule: 'read-curve' }
      });
    }, { count: 2 })
  ]);
  B.addTypes('7-1-6', 'both', [
    TB('both-meet-const', '두 그래프가 만나는 점으로 다른 관계식의 수 구하기', '기본 ①59 / 심31', (d, n) => {
      // 식을 아는 쪽에서 만나는 점의 y좌표를 구하고, 그 점을 식을 모르는 쪽에 넣는다. 첫째는 정비례 관계식을, 둘째는 반비례 관계식을 안다.
      const tagAt = (s, x0, y0) => (Math.abs(fl(s)) >= 1 ? (x0 > 0 ? 'e' : 'w') : (y0 > 0 ? 'n' : 's'));
      const fig = (s, c, x0, y0) => planeT({ x: [-5, 5], y: [-5, 5], grid: false, ticks: 'none', lines: [{ a: s }], curves: [{ a: c }], points: [{ x: x0, y: y0, guide: true }], tags: [{ x: x0, y: y0, text: 'P', at: tagAt(s, x0, y0) }], say: '직선과 곡선이 만나는 이 점이 P이다.' });
      if (n === 0) {
        const [s, x0] = d.pick([[Q(2), 2], [Q(2), -2], [Q(1, 2), 4], [Q(1, 2), -4], [Q(3, 2), 2], [Q(2, 3), 3], [Q(-2), 2], [Q(-2), -2], [Q(-1, 2), 4], [Q(-3, 2), 2], [Q(-2, 3), 3], [Q(4, 3), 3], [Q(3, 4), 4], [Q(-3, 4), -4], [Q(-4, 3), 3]]), y0 = s.p * x0 / s.q, c = x0 * y0;
        return ansV(`그림과 같이 정비례 관계 ${eqD(s)}의 그래프와 반비례 관계 ${eqIa}의 그래프가 점 P에서 만난다. 점 P의 ${X}좌표가 ${iq(x0)}일 때, 수 ${A}의 값은?`, Q(c), 'int', {
          figure: fig(s, c, x0, y0),
          explain: `${eqD(s)}에 ${X} = ${iq(x0)}${tail(Math.abs(x0), '을/를')} 대입하면 ${Y} = ${iq(y0)}이므로 P${pt(x0, y0)}이다. 점 P는 ${eqIa}의 그래프 위에도 있으므로 ${A} = ${iq(x0)} × ${par(y0)} = ${iq(c)}이다.`,
          facts: { value: `${js(s)}*${jn(x0)}*${jn(x0)}`, rule: 'meet-direct-known' }
        });
      }
      const [c, x0] = d.pick([[12, 3], [6, 2], [8, 4], [12, 4], [6, 3], [-6, 2], [-12, 3], [-8, 4], [-6, -3], [12, -3], [-12, -4], [6, -2]]), y0 = c / x0, s = Q(y0, x0);
      return ansV(`그림과 같이 반비례 관계 ${eqI(c)}의 그래프와 정비례 관계 ${eqDa}의 그래프가 점 P에서 만난다. 점 P의 ${X}좌표가 ${iq(x0)}일 때, 수 ${A}의 값은?`, s, 'frac', {
        figure: fig(s, c, x0, y0),
        explain: `${eqI(c)}에 ${X} = ${iq(x0)}${tail(Math.abs(x0), '을/를')} 대입하면 ${Y} = ${iq(y0)}이므로 P${pt(x0, y0)}이다. 점 P는 ${eqDa}의 그래프 위에도 있으므로 ${iq(y0)} = ${iq(x0)}${A}에서 ${A} = ${tx(s)}이다.`,
        facts: { value: `${jn(c)}/${jn(x0)}/${jn(x0)}`, rule: 'meet-inverse-known' }
      });
    }, { count: 2 })
  ]);
  B.addTypes('7-1-6', 'area', [
    TB('area-tri-two-lines', '두 정비례 관계의 그래프 위의 x좌표가 같은 두 점과 원점이 만드는 삼각형의 넓이', '심38', (d) => {
      // 두 점의 y좌표를 각각 구하고(대입 두 번), 세로 선분을 밑변으로, 원점에서 그 선분까지의 거리를 높이로 본다.
      const [s1, s2, k] = d.pick([[Q(3, 2), Q(-1, 2), 2], [Q(2), Q(-1, 2), 2], [Q(1, 2), Q(-3, 4), 4], [Q(3, 4), Q(-1, 2), 4], [Q(2), Q(1, 2), 2], [Q(3, 2), Q(1, 2), 2], [Q(1, 2), Q(-1, 2), 4], [Q(3, 2), Q(-3, 2), 2], [Q(5, 4), Q(1, 4), 4], [Q(2), Q(-2), 2], [Q(4, 3), Q(-2, 3), 3]]);
      const y1 = s1.p * k / s1.q, y2 = s2.p * k / s2.q, ab = y1 - y2, area = ab * k / 2;
      return N(`그림과 같이 두 정비례 관계 ${eqD(s1)}, ${eqD(s2)}의 그래프 위에 ${X}좌표가 ${k}인 점 A, B가 각각 있다. 삼각형 OAB의 넓이는? (단, O는 원점이다.)`, area, {
        figure: planeT({ x: [-1, k + 1], y: [Math.min(y2, 0) - 1, y1 + 1], grid: false, ticks: 'none', lines: [{ a: s1 }, { a: s2 }], poly: [[0, 0], [k, y1], [k, y2]], points: [{ x: k, y: y1, name: 'A', side: 'ul' }, { x: k, y: y2, name: 'B', side: y2 < 0 ? 'dl' : 'dr' }] }),
        explain: `${X} = ${k}${tail(k, '을/를')} 대입하면 A${pt(k, y1)}, B${pt(k, y2)}이다. 선분 AB의 길이는 ${y1} − ${par(y2)} = ${ab}이고, 원점에서 선분 AB까지의 거리는 ${k}이다. 삼각형 OAB의 넓이는 ${HALF} × ${ab} × ${k} = ${area}이다.`,
        facts: { value: `${k}*(${js(s1)}*${k}-${js(s2)}*${k})/2`, unseen: [2] }
      });
    })
  ]);

  // ── 다시 실은 꼴 ──
  // 처음 지을 때 꼬임·경우 따지기·여러 단계·복잡한 활용이라는 까닭으로 뺐던 꼴을 다시 보고 실었다(싣기_대조표.md 의 「다시 실음」 줄).
  // 원문 그림은 수집 원본(지도서 PDF, 한글 문서에 든 그림)에서 직접 보았다. 수와 상황은 새로 골랐다.
  //  - 기본에 둔 것(두 단계 안팎): 앞 단원의 방법으로 찾은 점으로 a 구하기(심17·21), 좌표가 모두 자연수·정수인 점의 개수(①55 심29·30),
  //    가로선이 두 그래프와 만나는 점과 원점의 삼각형(①67 심39 — 세로선 꼴 area-tri-two-lines 와 같은 자리), 직사각형 둘의 넓이의 합(심36의 변형), 일정한 속력으로 움직이는 점(심52).
  //  - 실력에 둔 것: 그래프 위의 점 (p, q)로 식의 값(심19 — ①), 넓이에서 좌표나 관계식의 수를 거꾸로 구하기(①65·68 심41), 길이의 비(①69), 선분과 만나는 그래프(심35),
  //    정사각형·직사각형의 꼭짓점 따라가기(심42·43·44·45), 넓이를 이등분하는 그래프(심46), 도착하는 시각의 차(심54).
  //  - 그대로 뺀 것: 원점에 대한 대칭으로만 풀리는 다른 교점(심34 — 식으로 풀면 제곱하여 9가 되는 수를 음수까지 찾아야 한다), 그래프끼리의 대칭(심10의 보기 하나),
  //    따로 구한 수의 합·곱(심20 등), 이미 실린 유형과 하는 일이 같은 것(①74 — use-triangle, 소금물의 농도 보기 — 물통 보기, ①57·76의 한 꼴).
  const { M } = B.kit;
  const { LE, range, qmul, mono, poly, nz, pointAns } = B.kit.mid;
  const { boxD, sg } = B.kit.m716;
  const K = V('k'), PV = V('p'), QV = V('q'), BV = V('b');
  // 직사각형 ABCD 와 변 BC 위의 점 P, 색칠한 삼각형 ABP. 두 변의 길이를 적는다.
  function rectFig(h, w) {
    const W = 190, Hh = Math.round(Math.max(72, Math.min(124, W * h / w))), x0 = 50, y0 = 26, x1 = x0 + W, y1 = y0 + Hh, px = x0 + Math.round(W * 0.42);
    const word = (x, y, t, anchor) => `<text x="${x}" y="${y}" text-anchor="${anchor || 'middle'}" style="font-size:13px;font-weight:600;fill:#1f2933">${t}</text>`;
    return `<svg class="mb-geo" viewBox="0 0 ${x1 + 22} ${y1 + 24}" width="${x1 + 22}" role="img" aria-label="직사각형 ABCD: 변 AB의 길이는 ${h} cm, 변 BC의 길이는 ${w} cm이다. 변 BC 위에 점 P가 있고, 삼각형 ABP를 색칠하였다.">`
      + `<path d="M${x0} ${y0}H${x1}V${y1}H${x0}Z" style="fill:#fff;stroke:#1f2933;stroke-width:1.6;stroke-linejoin:round"/><path d="M${x0} ${y0}V${y1}H${px}Z" style="fill:rgba(37,99,235,0.14);stroke:#1d4ed8;stroke-width:1.6;stroke-linejoin:round"/>`
      + `<circle class="mb-dot" cx="${px}" cy="${y1}" r="2.6"/>`
      + word(x0 - 8, y0 + 4, 'A', 'end') + word(x0 - 8, y1 + 5, 'B', 'end') + word(x1 + 8, y1 + 5, 'C', 'start') + word(x1 + 8, y0 + 4, 'D', 'start') + word(px, y1 + 17, 'P')
      + `<text x="${x0 - 8}" y="${(y0 + y1) / 2 + 4}" text-anchor="end" style="font-size:12px;fill:#1f2933">${h} cm</text><text x="${(x0 + x1) / 2}" y="${y0 - 8}" text-anchor="middle" style="font-size:12px;fill:#1f2933">${w} cm</text></svg>`;
  }

  B.addTypes('7-1-6', 'dgraph', [
    TB('dgraph-a-via-point', '앞 단원의 방법으로 찾은 점이 그래프 위에 있을 때 a 구하기', '심17·21', (d, n) => {
      if (n === 0) {
        // 대칭인 점을 먼저 구한다: x축에 대하여 대칭이면 y좌표의 부호만, y축에 대하여 대칭이면 x좌표의 부호만 바뀐다.
        const [px, py] = d.until(() => [nz(d, -6, 6), nz(d, -9, 9)], ([u, v]) => v % u !== 0 && Math.abs(u) > 1 && !(u === 2 && v === 3)), onX = d.bool(), sx = onX ? px : -px, sy = onX ? -py : py, a = Q(sy, sx);
        return ansV(`점 P${ptj(px, py, '과/와')} ${onX ? X : Y}축에 대하여 대칭인 점이 정비례 관계 ${eqDa}의 그래프 위에 있을 때, 수 ${A}의 값은?`, a, 'frac', {
          explain: `점 P${ptj(px, py, '과/와')} ${onX ? X : Y}축에 대하여 대칭인 점은 ${onX ? `${X}좌표는 같고 ${Y}좌표의 부호만 바뀐` : `${Y}좌표는 같고 ${X}좌표의 부호만 바뀐`} 점 ${pt(sx, sy)}이다. ${eqDa}에 ${X} = ${iq(sx)}, ${Y} = ${iq(sy)}${tail(Math.abs(sy), '을/를')} 대입하면 ${iq(sy)} = ${iq(sx)}${A}이므로 ${A} = ${tx(a)}이다.`,
          facts: { value: `${jn(sy)}/${jn(sx)}`, rule: 'via-sym' }
        });
      }
      // 직사각형의 넷째 꼭짓점을 먼저 찾는다.
      const [x1, x2, y1, y2] = d.until(() => [nz(d, -5, 5), nz(d, -6, 6), nz(d, -5, 5), nz(d, -7, 7)], ([u1, u2, v1, v2]) => u1 !== u2 && v1 !== v2 && Math.abs(u2) > 1 && v2 % u2 !== 0), a = Q(y2, x2);
      return ansV(`세 점 A${pt(x1, y2)}, B${pt(x1, y1)}, C${ptj(x2, y1, '과/와')} 정비례 관계 ${eqDa}의 그래프 위의 점 D가 직사각형 ABCD의 꼭짓점일 때, 수 ${A}의 값은?`, a, 'frac', {
        explain: `직사각형 ABCD에서 점 D의 ${X}좌표는 점 C의 ${X}좌표와 같고, ${Y}좌표는 점 A의 ${Y}좌표와 같으므로 D${pt(x2, y2)}이다. ${eqDa}에 ${X} = ${iq(x2)}, ${Y} = ${iq(y2)}${tail(Math.abs(y2), '을/를')} 대입하면 ${iq(y2)} = ${iq(x2)}${A}이므로 ${A} = ${tx(a)}이다.`,
        facts: { value: `${jn(y2)}/${jn(x2)}`, rule: 'via-rect' }
      });
    }, { count: 2 })
  ]);
  B.addTypes('7-1-6', 'igraph', [
    TB('igraph-lattice-count', '그래프 위의 점 가운데 좌표가 모두 자연수(정수)인 점의 개수', '기본 ①55 / 심29·30', (d, n) => {
      // x좌표와 y좌표의 곱이 a이므로 x좌표는 a의 절댓값의 약수이거나 그 약수에 −를 붙인 수이다. 첫째는 자연수인 점만, 둘째와 셋째는 음수 쪽까지 센다(셋째는 a부터 구한다).
      if (n === 0) {
        const m = d.pick([6, 8, 15, 16, 18, 20]), ds = divisors(m, 1, m);
        return N(`반비례 관계 ${eqI(m)}의 그래프 위의 점 가운데 ${X}좌표와 ${Y}좌표가 모두 자연수인 점은 모두 몇 개인가?`, ds.length, {
          unit: '개',
          explain: `${X}좌표와 ${Y}좌표의 곱이 ${m}이므로 ${X}좌표는 ${m}의 약수이어야 한다. ${m}의 약수는 ${ds.join(', ')}의 ${ds.length}개이므로 구하는 점은 ${ds.map((v) => pt(v, m / v)).join(', ')}의 ${ds.length}개이다.`,
          facts: { count: range(1, m).map((v) => m % v === 0) }
        });
      }
      const m = n === 1 ? d.pick([6, 8, 9, 10, 12, 15, 20]) : d.pick([6, 8, 10, 12, 16, 18, 20]), ds = divisors(m, 1, m), k = ds.length;
      const [x0, y0] = d.until(() => { const u = pm(d) * d.pick(divisors(m, 2, m / 2)); return [u, pm(d) * m / Math.abs(u)]; }, ([u, v]) => !((u === 4 && v === -4) || (u === -6 && v === 2) || (u === 3 && v === 4))), a = n === 1 ? pm(d) * m : x0 * y0;
      const told = `${X}좌표와 ${Y}좌표의 곱이 ${iq(a)}이므로 ${X}좌표는 ${m}의 약수이거나 ${m}의 약수에 ${MINUS}를 붙인 수이어야 한다. ${m}의 약수는 ${ds.join(', ')}의 ${k}개이므로 구하는 점은 ${X}좌표가 양수인 것 ${k}개와 음수인 것 ${k}개를 합하여 ${2 * k}개이다.`;
      const facts = { count: range(-m, m).filter((v) => v !== 0).map((v) => m % v === 0) };
      if (n === 1) return N(`반비례 관계 ${eqI(a)}의 그래프 위의 점 가운데 ${X}좌표와 ${Y}좌표가 모두 정수인 점은 모두 몇 개인가?`, 2 * k, { unit: '개', explain: told, facts });
      return N(`반비례 관계 ${eqIa}의 그래프가 점 ${ptj(x0, y0, '을/를')} 지날 때, 이 그래프 위의 점 가운데 ${X}좌표와 ${Y}좌표가 모두 정수인 점은 모두 몇 개인가?`, 2 * k, {
        unit: '개', explain: `${A} = ${iq(x0)} × ${par(y0)} = ${iq(a)}이므로 관계식은 ${eqI(a)}이다. ${told}`, facts
      });
    }, { count: 3 })
  ]);
  B.addTypes('7-1-6', 'area', [
    TB('area-tri-flat', 'x축에 평행한 직선이 두 정비례 관계의 그래프와 만나는 점과 원점이 만드는 삼각형의 넓이', '기본 ①67 / 심39', (d) => {
      // y좌표에서 x좌표를 거꾸로 두 번 구한다. 두 그래프가 y축의 양쪽에 있으면 선분의 길이는 두 x좌표의 차(절댓값의 합)이다.
      const [s1, s2, h] = d.pick([[Q(2), Q(1, 2), 2], [Q(2), Q(1, 2), 4], [Q(3), Q(3, 4), 6], [Q(2), Q(2, 3), 4], [Q(4), Q(1, 2), 4], [Q(3, 2), Q(1, 2), 3], [Q(3, 2), Q(3, 4), 3], [Q(4, 3), Q(1, 2), 4], [Q(2), Q(-1, 2), 2], [Q(3, 2), Q(-1, 2), 3], [Q(2), Q(-2, 3), 4], [Q(4), Q(-2), 4], [Q(2), Q(-2), 4]]);
      const x1 = h * s1.q / s1.p, x2 = h * s2.q / s2.p, lo = Math.min(x1, x2, 0) - 1, hi = Math.max(x1, x2) + 1, len = Math.abs(x2 - x1), area = len * h / 2;
      const back = (s) => `${h}*${s.q}/${jn(s.p)}`, big = x1 > x2 ? s1 : s2, small = x1 > x2 ? s2 : s1;
      return N(`그림과 같이 점 A${ptj(0, h, '을/를')} 지나고 ${X}축에 평행한 직선이 두 정비례 관계 ${eqD(s1)}, ${eqD(s2)}의 그래프와 만나는 점을 각각 B, C라 할 때, 삼각형 OBC의 넓이는? (단, O는 원점이다.)`, area, {
        figure: planeT({ x: [lo, hi], y: [-1, h + 1], grid: false, ticks: 'none', lines: [{ a: s1 }, { a: s2 }], poly: [[0, 0], [x1, h], [x2, h]], segs: [[lo + 0.3, h, hi - 0.3, h]], points: [{ x: 0, y: h, name: 'A', side: 'ul' }, { x: x1, y: h, name: 'B', side: 'ul' }, { x: x2, y: h, name: 'C', side: s2.p > 0 ? 'ul' : 'ur' }] }),
        explain: `두 점 B, C의 ${Y}좌표는 모두 ${h}이다. ${eqD(s1)}에 ${Y} = ${h}${tail(h, '을/를')} 대입하면 ${X} = ${iq(x1)}이므로 B${pt(x1, h)}이고, ${eqD(s2)}에 ${Y} = ${h}${tail(h, '을/를')} 대입하면 ${X} = ${iq(x2)}이므로 C${pt(x2, h)}이다. 선분 BC의 길이는 ${Math.max(x1, x2)} − ${par(Math.min(x1, x2))} = ${len}이고, 원점에서 선분 BC까지의 거리는 ${h}이다. 삼각형 OBC의 넓이는 ${HALF} × ${len} × ${h} = ${area}이다.`,
        facts: { value: `${h}*(${back(big)}-${back(small)})/2`, unseen: [1, 2] }
      });
    }),
    TB('area-rect-two', '한 점을 지나는 반비례 관계의 그래프 위의 두 점으로 만든 두 직사각형의 넓이의 합', '심36', (d) => {
      // 한 점으로 a를 구한다. 그래프 위의 점이 어느 사분면에 있든 두 축에 그은 수선으로 만든 직사각형의 넓이는 a의 절댓값이다.
      const [m, px, qx, far] = d.pick([[6, 3, 2, [1, 6]], [8, 4, 2, [1, 8]], [12, 4, 3, [2, 6]], [12, 3, 4, [6, 2]], [6, 2, 3, [6, 1]], [8, 2, 4, [8, 1]]]), s = pm(d), t = pm(d), a = s * m;
      const Px = s * px, Py = m / px, Qx = -s * qx, Qy = -m / qx, x0 = t * s * far[0], y0 = t * far[1], up = s > 0;
      return N(`그림과 같이 반비례 관계 ${eqIa}의 그래프가 점 ${ptj(x0, y0, '을/를')} 지나고, 두 점 P, Q는 이 그래프 위의 점이다. 점 P에서 ${X}축, ${Y}축에 그은 수선이 두 축과 만나는 점을 각각 A, B라 하고, 점 Q에서 ${X}축, ${Y}축에 그은 수선이 두 축과 만나는 점을 각각 C, D라 할 때, 두 직사각형 OAPB, OCQD의 넓이의 합은? (단, O는 원점이다.)`, 2 * m, {
        figure: planeT({ x: [-5, 5], y: [-5, 5], grid: false, ticks: 'none', curves: [{ a }], poly: [[0, 0], [Px, 0], [Px, Py], [0, Py], [0, 0], [Qx, 0], [Qx, Qy], [0, Qy]],
          points: [{ x: Px, y: Py, name: 'P', side: up ? 'ur' : 'ul' }, { x: Px, y: 0, name: 'A', side: up ? 'dr' : 'dl' }, { x: 0, y: Py, name: 'B', side: up ? 'ul' : 'ur' }, { x: Qx, y: Qy, name: 'Q', side: up ? 'dl' : 'dr' }, { x: Qx, y: 0, name: 'C', side: up ? 'ul' : 'ur' }, { x: 0, y: Qy, name: 'D', side: up ? 'dr' : 'dl' }] }),
        explain: `그래프가 점 ${ptj(x0, y0, '을/를')} 지나므로 ${A} = ${iq(x0)} × ${par(y0)} = ${iq(a)}이다. 이 그래프 위의 점은 어느 것이나 ${X}좌표와 ${Y}좌표의 곱이 ${iq(a)}이므로, 그 점에서 두 축에 그은 수선으로 만든 직사각형의 넓이는 ${m}이다. 두 직사각형 OAPB, OCQD의 넓이의 합은 ${m} + ${m} = ${2 * m}이다.`,
        facts: { value: `2*${Math.abs(x0)}*${Math.abs(y0)}`, unseen: [2] }
      });
    })
  ]);
  B.addTypes('7-1-6', 'use', [
    TB('use-moving-speed', '일정한 속력으로 변 위를 움직이는 점이 만드는 삼각형의 넓이', '심52', (d) => {
      // 속력에서 선분의 길이를, 선분의 길이에서 넓이를 식으로 나타낸다(한 겹이 더 있다).
      const [h, v] = d.pick([[4, 2], [8, 2], [10, 2], [4, 3], [6, 3], [8, 3], [6, 4], [4, 4]]), a = h * v / 2, [t, w] = d.until(() => { const s = d.int(2, 5); return [s, v * (s + d.int(1, 3))]; }, ([, len]) => len > h), S = a * t;
      return M(`그림과 같은 직사각형 ABCD에서 점 P는 꼭짓점 B를 출발하여 변 BC를 따라 꼭짓점 C까지 매초 ${v} cm의 속력으로 움직인다. 점 P가 출발한 지 ${X}초 후의 삼각형 ABP의 넓이를 ${Y} ${CM2}라 할 때, 관계식 ${boxD(LAB[0])}의 ㉠에 알맞은 수와 삼각형 ABP의 넓이가 ${S} ${CM2}가 되는 것은 출발한 지 몇 초 후인지 구하시오.`, [{ label: LAB[0], answer: a }, { label: '시간', answer: t, unit: '초' }], {
        figure: rectFig(h, w),
        explain: `점 P는 1초에 ${v} cm씩 움직이므로 출발한 지 ${X}초 후 선분 BP의 길이는 ${v}${X} cm이다. 삼각형 ABP의 넓이는 ${HALF} × ${v}${X} × ${h}이므로 ${eqD(a)}이다. ${Y} = ${S}일 때 ${X} = ${S} ÷ ${a} = ${t}이므로 출발한 지 ${t}초 후이다. 점 P는 출발한 지 ${w} ÷ ${v} = ${w / v}(초) 후에 꼭짓점 C에 도착하므로 ${t}초 후에는 변 BC 위에 있다.`,
        facts: { calc: [[`${v}*${h}/2`, 0], [`${S}/(${v}*${h}/2)`, 1]], unseen: [2] }
      });
    })
  ]);

  // 정사각형 ABCD(변이 좌표축에 평행, A가 왼쪽 위, C가 오른쪽 아래)의 꼭짓점 A가 y = sx 의 그래프 위에, C가 다른 정비례 관계의 그래프 위에 놓인 그림. [s, 점 A의 x좌표, 한 변의 길이]
  // 한 변이 2칸 이상이고, 두 직선이 꼭짓점의 이름을 스치지 않는 수만 골랐다. 두 유형(따라가기, 방정식 세우기)이 같은 그림을 서로 다른 방향으로 묻는다.
  const SQUARES = [[Q(2), 3, 2], [Q(2), 2, 2], [Q(3), 2, 3], [Q(3), 2, 4], [Q(3, 2), 4, 2], [Q(3, 2), 4, 4], [Q(5, 2), 2, 2], [Q(5, 2), 2, 3]];
  const squareOf = ([s, x, L]) => { const y = s.p * x / s.q; return { s, x, y, L, b: Q(y - L, x + L) }; };
  const squareFig = (g) => planeT({ x: [-1, g.x + g.L + 1], y: [-1, g.y + 1], grid: false, ticks: 'none', lines: [{ a: g.s }, { a: g.b }], poly: [[g.x, g.y], [g.x, g.y - g.L], [g.x + g.L, g.y - g.L], [g.x + g.L, g.y]],
    points: [{ x: g.x, y: g.y, name: 'A', side: 'ul' }, { x: g.x, y: g.y - g.L }, { x: g.x + g.L, y: g.y - g.L, name: 'C', side: 'dr' }, { x: g.x + g.L, y: g.y, name: 'D', side: 'ur' }],
    tags: [{ x: g.x, y: g.y - g.L, text: 'B', at: 's' }], say: '점 A의 바로 아래에 있는 꼭짓점이 B이다. 점 A는 가파른 직선 위에, 점 C는 완만한 직선 위에 있다.' });

  B.addTypes('7-1-6', 'hard', [
    // ── ① 뜻을 정확히 대야 풀리는 문제 ──
    H('hard-point-expr', '그래프 위의 점의 좌표가 문자일 때 식의 값', '심19', (d) => {
      // 함정: p, q의 값이 정해지지 않으니 식의 값도 구할 수 없다고 여기는 아이. 그래프 위의 점이면 q는 p의 일정한 배이므로 식의 값이 정해진다.
      // 직선이 눈금 수를 가리지 않게 a의 절댓값은 1/2부터 2까지로 한다. 점 A가 눈금 수 바로 옆에 놓이는 (±1, ±2)도 쓰지 않는다(이름이 눈금 수와 닿는다).
      const [x0, y0] = d.pick([[2, 3], [4, 3], [3, 4], [2, 1]]), sx = pm(d), sy = pm(d), xA = sx * x0, yA = sy * y0, a = Q(yA, xA), same = sx === sy, flip = d.bool();
      const expr = flip ? poly([[x0, QV], [same ? -y0 : y0, PV]]) : poly([[y0, PV], [same ? -x0 : x0, QV]]);
      return ansV(`그림과 같이 원점과 점 A를 지나는 정비례 관계의 그래프가 점 ${nb(`(${PV}, ${QV})`)}를 지날 때, ${expr}의 값은?`, Q(0), 'int', {
        figure: planeT({ x: [-5, 5], y: [-5, 5], ticks: TICKS, lines: [{ a }], points: [{ x: xA, y: yA, name: 'A', guide: clearGuide(xA, yA), side: a.p > 0 ? (yA > 0 ? 'ul' : 'dr') : (yA > 0 ? 'ur' : 'dl') }] }),
        explain: `그래프가 점 A${ptj(xA, yA, '을/를')} 지나므로 관계식은 ${eqD(a)}이다. 점 ${nb(`(${PV}, ${QV})`)}가 이 그래프 위에 있으므로 ${nb(`${QV} = ${sg(a)}${mono(a, PV)}`)}, 곧 ${nb(`${x0}${QV} = ${same ? '' : MINUS}${mono(y0, PV)}`)}이다. ${PV}, ${QV}의 값이 정해지지 않아도 ${expr} = 0이다.`,
        facts: { value: flip ? `${x0}*${jn(yA)}${same ? '-' : '+'}${y0}*${jn(xA)}` : `${y0}*${jn(xA)}${same ? '-' : '+'}${x0}*${jn(yA)}`, unseen: [1] }
      });
    }),
    // ── ② 두 번 넘게 생각해야 풀리는 문제 ──
    H('hard-tri-point', '삼각형의 넓이로 정비례 관계의 그래프 위의 점의 좌표 구하기', '기본 ①65', (d) => {
      // 선분의 길이를 문자로 놓아 넓이를 식으로 나타내고(같은 수를 두 번 곱한 값이 나온다), 사분면으로 좌표의 부호를 정한다.
      const [[p, q, t], neg, left] = d.until(() => [d.pick([[2, 1, 2], [2, 1, 3], [2, 1, 4], [1, 2, 4], [1, 2, 6], [4, 1, 2], [3, 2, 2], [3, 2, 4], [2, 3, 3], [2, 3, 6], [1, 2, 2]]), d.bool(), d.bool()], ([c, u, v]) => !(c[0] === 2 && c[1] === 1 && c[2] === 3 && u && !v));
      const s = Q(neg ? -p : p, q), size = Q(p, q), xA = left ? -t : t, yA = s.p * xA / q, S = p * t * t / (2 * q), quad = yA > 0 ? (xA > 0 ? 1 : 2) : (xA > 0 ? 4 : 3);
      const root = `(2*${S}*${q}/${p})**0.5`, xExpr = left ? `(-1)*${root}` : root;
      return pointAns(`그림과 같이 정비례 관계 ${eqD(s)}의 그래프 위의 점 A에서 ${X}축에 그은 수선이 ${X}축과 만나는 점을 B라 하자. 삼각형 OAB의 넓이가 ${S}일 때, 점 A의 좌표는? (단, O는 원점이고, 점 A는 제${quad}사분면 위의 점이다.)`, xA, yA, {
        figure: planeT({ x: xA > 0 ? [-1, t + 1] : [-t - 1, 1], y: yA > 0 ? [-1, yA + 1] : [yA - 1, 1], grid: false, ticks: 'none', lines: [{ a: s }], poly: [[0, 0], [xA, 0], [xA, yA]],
          points: [{ x: xA, y: yA, name: 'A', side: ['ul', 'ur', 'dr', 'dl'][quad - 1] }, { x: xA, y: 0, name: 'B', side: ['dr', 'dl', 'ul', 'ur'][quad - 1] }] }),
        explain: `선분 OB의 길이를 ${K}라 하면 점 A의 ${X}좌표는 ${left ? MINUS : ''}${K}이고, 선분 AB의 길이는 ${mono(size, K)}이다. 삼각형 OAB의 넓이는 ${HALF} × ${K} × ${mono(size, K)} = ${S}이므로 ${K} × ${K} = ${t * t}이고, ${K}는 양수이므로 ${K} = ${t}이다. 점 A는 제${quad}사분면 위의 점이므로 A${pt(xA, yA)}이다.`,
        facts: { calc: [[xExpr, 0], [`${neg ? '(-' + p + ')' : p}*(${xExpr})/${q}`, 1]], unseen: [0.5, 1, 2] }
      });
    }),
    H('hard-meet-tri', '만나는 점에서 그은 수선과 삼각형의 넓이로 두 관계식의 수 구하기', '기본 ①68', (d) => {
      // 넓이에서 높이를 거꾸로 구해 만나는 점의 좌표를 정하고, 그 점을 두 관계식에 차례로 넣는다. 점 A가 제2사분면에 있으면 두 수 모두 음수이다.
      const [k, m] = d.pick([[2, 2], [2, 3], [3, 2], [2, 4], [4, 2]]), left = d.bool(), xB = left ? -k : k, h = m * k, S = k * h / 2, a = left ? -m : m, bb = xB * h;
      return M(`그림과 같이 정비례 관계 ${eqDa}의 그래프와 반비례 관계 ${nb(`${Y} = ${frac(BV, X)}`)}의 그래프가 점 A에서 만난다. 점 A에서 ${X}축에 그은 수선이 ${X}축과 만나는 점 B의 ${X}좌표가 ${iq(xB)}이고 삼각형 AOB의 넓이가 ${S}일 때, 수 ${A}, ${BV}의 값은? (단, O는 원점이다.)`, [{ lead: `${A} =`, answer: a, signed: true }, { lead: `${BV} =`, answer: bb, signed: true }], {
        shown: `${A} = ${iq(a)}, ${BV} = ${iq(bb)}`,
        figure: planeT({ x: left ? [-k - 2, 1] : [-1, k + 2], y: [-1, h + 1], grid: false, ticks: 'none', lines: [{ a }], curves: [{ a: bb }], poly: [[0, 0], [xB, 0], [xB, h]], points: [{ x: xB, y: h }, { x: xB, y: 0, name: 'B', side: left ? 'dl' : 'dr' }], tags: [{ x: xB, y: h, text: 'A', at: left ? 'w' : 'e' }], say: '직선과 곡선이 만나는 점이 A이다.' }),
        explain: `삼각형 AOB에서 변 OB의 길이는 ${k}이므로 ${HALF} × ${k} × (선분 AB의 길이) = ${S}에서 선분 AB의 길이는 ${h}이다. 점 A는 ${X}축의 위쪽에 있으므로 A${pt(xB, h)}이다. 점 A가 ${eqDa}의 그래프 위에 있으므로 ${h} = ${iq(xB)}${A}에서 ${A} = ${iq(a)}이고, ${nb(`${Y} = ${frac(BV, X)}`)}의 그래프 위에도 있으므로 ${BV} = ${iq(xB)} × ${h} = ${iq(bb)}이다.`,
        facts: { calc: [[`2*${S}/${k}/${jn(xB)}`, 0], [`${jn(xB)}*2*${S}/${k}`, 1]], unseen: [2] }
      });
    }),
    H('hard-rect-ratio', '두 그래프와 직사각형에서 선분의 길이의 비로 꼭짓점의 좌표 구하기', '기본 ①69', (d) => {
      // 점 D의 좌표 → 선분 FE의 길이 → 점 F의 좌표 → a → 점 C의 y좌표(점 D와 같다)에서 x좌표를 거꾸로 구한다.
      const [s, k, r] = d.pick([[Q(3, 2), 2, Q(3)], [Q(3, 2), 2, Q(2)], [Q(2), 2, Q(4)], [Q(2), 2, Q(5, 2)], [Q(2), 2, Q(3, 2)], [Q(3), 2, Q(3, 2)], [Q(3), 2, Q(2)], [Q(3), 2, Q(4)], [Q(3, 2), 4, Q(2)], [Q(5, 2), 2, Q(2)], [Q(5, 2), 2, Q(3)], [Q(5, 2), 2, Q(4)]]);
      const yD = s.p * k / s.q, a = qdiv(s, r), xC = r.p * k / r.q, yF = qmul(a, Q(k));
      return pointAns(`그림에서 두 직선 ㉠, ㉡은 각각 정비례 관계 ${eqD(s)}, ${eqDa}의 그래프이고, 사각형 AOBC는 직사각형이다. 세 점 D, E, F의 ${X}좌표가 모두 ${k}이고 선분 DE의 길이가 선분 FE의 길이의 ${tx(r)}배일 때, 점 C의 좌표는? (단, O는 원점이다.)`, xC, yD, {
        figure: planeT({ x: [-1, xC + 1], y: [-1, yD + 1], grid: false, ticks: 'none', lines: [{ a: s, name: LAB[0] }, { a, name: LAB[1] }], poly: [[0, 0], [xC, 0], [xC, yD], [0, yD]], segs: [[k, 0, k, yD]],
          points: [{ x: 0, y: yD, name: 'A', side: 'ul' }, { x: xC, y: 0, name: 'B', side: 'dr' }, { x: xC, y: yD, name: 'C', side: 'dr' }, { x: k, y: yD, name: 'D', side: 'ul' }, { x: k, y: 0, name: 'E', side: 'dr' }, { x: k, y: yF, name: 'F', side: 'dr' }],
          say: '점 A는 y축 위에, 두 점 B, E는 x축 위에 있다. 점 D는 직선 ㉠과 변 AC가 만나는 점이고, 두 점 C, F는 직선 ㉡ 위에 있다.' }),
        explain: `점 D는 ${eqD(s)}의 그래프 위의 점이므로 D${pt(k, yD)}이고, 선분 DE의 길이는 ${yD}이다. 선분 FE의 길이는 ${yD} ÷ ${tx(r)} = ${tx(yF)}이므로 F${pt(k, yF)}이다. 점 F가 ${eqDa}의 그래프 위에 있으므로 ${A} = ${tx(a)}이다. 점 C의 ${Y}좌표는 점 D의 ${Y}좌표와 같은 ${yD}이므로 ${eqD(a)}에 ${Y} = ${yD}${tail(yD, '을/를')} 대입하면 ${X} = ${xC}이다. 따라서 C${pt(xC, yD)}이다.`,
        facts: { calc: [[`${js(r)}*${k}`, 0], [`${js(s)}*${k}`, 1]] }
      });
    }),
    H('hard-segment-meet', '그래프 위의 두 점을 이은 선분과 만나는 정비례 관계의 그래프', '심35', (d) => {
      // 두 점의 좌표를 구하고(대입 두 번), 그래프가 선분의 양 끝을 지날 때의 a를 구한 뒤(두 번), 그 사이의 자연수를 센다. 양 끝의 값도 든다.
      const [m, x1, y2] = d.pick([[12, 2, 2], [12, 2, 3], [8, 2, 2], [16, 2, 4], [16, 2, 2], [18, 2, 6], [24, 3, 4], [10, 2, 2], [12, 3, 2], [20, 4, 4], [24, 3, 6]]), yA = m / x1, xB = m / y2;
      const hi = Q(yA, x1), lo = Q(y2, xB), flags = range(1, Math.ceil(fl(hi)) + 2).map((v) => v * xB >= y2 && v * x1 <= yA), list = flags.map((f, i) => (f ? i + 1 : 0)).filter(Boolean);
      return N(`그림과 같이 반비례 관계 ${eqI(m)}의 그래프 위에 두 점 A${pt(x1, PV)}, B${ptj(QV, y2, '이/가')} 있다. 정비례 관계 ${eqDa}의 그래프가 선분 AB와 만나도록 하는 자연수 ${A}는 모두 몇 개인가?`, list.length, {
        unit: '개',
        figure: planeT({ x: [-1, xB + 1], y: [-1, yA + 1], grid: false, ticks: 'none', curves: [{ a: m }], segs: [[x1, yA, xB, y2]], points: [{ x: x1, y: yA, name: 'A', side: 'ur' }, { x: xB, y: y2, name: 'B', side: 'ur' }] }),
        explain: `${eqI(m)}에 ${X} = ${x1}${tail(x1, '을/를')} 대입하면 ${PV} = ${yA}이고, ${Y} = ${y2}${tail(y2, '을/를')} 대입하면 ${QV} = ${xB}이므로 A${pt(x1, yA)}, B${pt(xB, y2)}이다. ${eqDa}의 그래프가 점 A를 지날 때 ${A} = ${tx(hi)}, 점 B를 지날 때 ${A} = ${tx(lo)}이다. 그래프가 선분 AB와 만나려면 ${nb(`${tx(lo)} ${LE} ${A} ${LE} ${tx(hi)}`)}이어야 하므로 자연수 ${A}는 ${list.join(', ')}의 ${list.length}개이다.`,
        facts: { count: flags }
      });
    }),
    H('hard-tri-two-a', '두 그래프 위의 x좌표가 같은 두 점과 원점이 만드는 삼각형의 넓이로 a 구하기', '심41', (d) => {
      // 넓이에서 선분 AB의 길이를 거꾸로 구한다. 점 B가 점 A의 위쪽에 있는지 아래쪽에 있는지는 그림에서 읽는다(x축의 아래쪽으로 내려가기도 한다).
      const [s, k, S, a] = d.pick([[Q(3, 2), 4, 8, Q(1, 2)], [Q(3, 2), 4, 10, Q(1, 4)], [Q(3, 2), 4, 14, Q(-1, 4)], [Q(2), 2, 3, Q(1, 2)], [Q(2), 2, 5, Q(-1, 2)], [Q(2), 3, 6, Q(2, 3)], [Q(2), 3, 12, Q(-2, 3)], [Q(2), 3, 3, Q(4, 3)], [Q(1, 2), 4, 8, Q(3, 2)], [Q(1, 4), 4, 4, Q(3, 4)], [Q(1, 2), 4, 10, Q(-3, 4)], [Q(3), 2, 5, Q(1, 2)], [Q(3), 2, 3, Q(3, 2)], [Q(5, 2), 2, 4, Q(1, 2)]]);
      const yA = s.p * k / s.q, yB = a.p * k / a.q, len = Math.abs(yA - yB), above = yB > yA, sideOf = (y, other) => (y > other ? 'ul' : y < 0 ? 'dl' : 'dr');
      return ansV(`그림과 같이 두 정비례 관계 ${eqD(s)}, ${eqDa}의 그래프 위에 ${X}좌표가 ${k}인 점 A, B가 각각 있다. 삼각형 AOB의 넓이가 ${S}일 때, 수 ${A}의 값은? (단, O는 원점이다.)`, a, 'frac', {
        figure: planeT({ x: [-1, k + 1], y: [Math.min(yA, yB, 0) - 1, Math.max(yA, yB) + 1], grid: false, ticks: 'none', lines: [{ a: s }, { a }], poly: [[0, 0], [k, yA], [k, yB]], points: [{ x: k, y: yA, name: 'A', side: sideOf(yA, yB) }, { x: k, y: yB, name: 'B', side: sideOf(yB, yA) }] }),
        explain: `${eqD(s)}에 ${X} = ${k}${tail(k, '을/를')} 대입하면 ${Y} = ${yA}이므로 A${pt(k, yA)}이다. 삼각형 AOB에서 선분 AB를 밑변으로 보면 높이는 원점에서 선분 AB까지의 거리 ${k}이므로 ${HALF} × (선분 AB의 길이) × ${k} = ${S}에서 선분 AB의 길이는 ${len}이다. 그림에서 점 B는 점 A의 ${above ? '위쪽' : '아래쪽'}에 있으므로 점 B의 ${Y}좌표는 ${yA} ${above ? '+' : MINUS} ${len} = ${iq(yB)}이다. B${pt(k, yB)}가 ${eqDa}의 그래프 위에 있으므로 ${iq(yB)} = ${k}${A}에서 ${A} = ${tx(a)}이다.`,
        facts: { value: `(${js(s)}*${k}${above ? '+' : '-'}2*${S}/${k})/${k}`, unseen: [2] }
      });
    }),
    H('hard-square-walk', '정사각형의 꼭짓점을 따라가 다른 관계식의 a 구하기', '심42', (d) => {
      // 점 A의 x좌표(대입) → 한 변의 길이만큼 옮겨 간 점 C의 좌표 → a(대입).
      const g = squareOf(d.pick(SQUARES));
      return ansV(`그림과 같이 한 변의 길이가 ${g.L}인 정사각형 ABCD의 네 변은 각각 ${X}축 또는 ${Y}축에 평행하다. 점 A는 정비례 관계 ${eqD(g.s)}의 그래프 위의 점으로 ${Y}좌표가 ${g.y}이고, 점 C는 정비례 관계 ${eqDa}의 그래프 위의 점일 때, 수 ${A}의 값은?`, g.b, 'frac', {
        figure: squareFig(g),
        explain: `${eqD(g.s)}에 ${Y} = ${g.y}${tail(g.y, '을/를')} 대입하면 ${X} = ${g.x}이므로 A${pt(g.x, g.y)}이다. 그림에서 점 C는 점 A에서 오른쪽으로 ${g.L}만큼, 아래쪽으로 ${g.L}만큼 간 점이므로 C${pt(g.x + g.L, g.y - g.L)}이다. 점 C가 ${eqDa}의 그래프 위에 있으므로 ${g.y - g.L} = ${g.x + g.L}${A}에서 ${A} = ${tx(g.b)}이다.`,
        facts: { value: `(${g.y}-${g.L})/(${g.y}*${g.s.q}/${g.s.p}+${g.L})`, unseen: [1] }
      });
    }),
    H('hard-square-eq', '정사각형의 넓이와 두 그래프로 꼭짓점의 좌표 구하기', '심43', (d) => {
      // 점 A의 x좌표를 문자로 놓아 점 C의 좌표를 나타내고, 점 C가 둘째 그래프 위에 있다는 것으로 일차방정식을 세운다.
      const g = squareOf(d.pick(SQUARES)), root = `${g.L * g.L}**0.5`, kx = `${root}*(${g.b.q}+${g.b.p})*${g.s.q}/(${g.s.p}*${g.b.q}-${g.b.p}*${g.s.q})`, sk = mono(g.s, K);
      return pointAns(`그림과 같이 넓이가 ${g.L * g.L}인 정사각형 ABCD의 네 변은 각각 ${X}축 또는 ${Y}축에 평행하다. 두 점 A, C가 각각 정비례 관계 ${eqD(g.s)}, ${eqD(g.b)}의 그래프 위의 점일 때, 점 D의 좌표는?`, g.x + g.L, g.y, {
        figure: squareFig(g),
        explain: `정사각형 ABCD의 넓이가 ${g.L * g.L}이므로 한 변의 길이는 ${g.L}이다. 점 A의 ${X}좌표를 ${K}라 하면 A${nb(`(${K}, ${sk})`)}이고, 그림에서 점 C는 점 A에서 오른쪽으로 ${g.L}만큼, 아래쪽으로 ${g.L}만큼 간 점이므로 C${nb(`(${K} + ${g.L}, ${sk} − ${g.L})`)}이다. 점 C가 ${eqD(g.b)}의 그래프 위에 있으므로 ${nb(`${sk} − ${g.L} = ${mag(g.b)}(${K} + ${g.L})`)}이고, 이 식을 풀면 ${K} = ${g.x}이다. A${pt(g.x, g.y)}이고 점 D는 점 A에서 오른쪽으로 ${g.L}만큼 간 점이므로 D${pt(g.x + g.L, g.y)}이다.`,
        facts: { calc: [[`${kx}+${root}`, 0], [`${g.s.p}*(${kx})/${g.s.q}`, 1]], unseen: [0.5, 1] }
      });
    }),
    H('hard-rect-walk', '두 그래프 위의 꼭짓점을 차례로 따라가 직사각형의 넓이 구하기', '심44', (d) => {
      // 점 B의 y좌표(대입) → 점 C의 x좌표(거꾸로) → 점 D의 y좌표(대입) → 가로의 길이와 세로의 길이.
      const [s2, s1, k] = d.pick([[Q(1, 2), Q(3, 2), 6], [Q(2, 3), Q(4, 3), 6], [Q(3, 4), Q(3, 2), 8], [Q(3, 2), Q(3), 4], [Q(2), Q(4), 4], [Q(1, 3), Q(2, 3), 6], [Q(1, 4), Q(1, 2), 8]]);
      const yB = s2.p * k / s2.q, xC = yB * s1.q / s1.p, yD = s2.p * xC / s2.q, area = (k - xC) * (yB - yD);
      const yBe = `${s2.p}*${k}/${s2.q}`, xCe = `(${yBe})*${s1.q}/${s1.p}`, yDe = `${s2.p}*(${xCe})/${s2.q}`;
      return N(`그림과 같이 네 변이 각각 ${X}축 또는 ${Y}축에 평행한 직사각형 ABCD가 있다. 두 점 B, D는 정비례 관계 ${eqD(s2)}의 그래프 위에 있고, 점 C는 정비례 관계 ${eqD(s1)}의 그래프 위에 있다. 두 점 A, B의 ${X}좌표가 ${k}일 때, 직사각형 ABCD의 넓이는?`, area, {
        figure: planeT({ x: [-1, k + 1], y: [-1, yB + 1], grid: false, ticks: 'none', lines: [{ a: s1 }, { a: s2 }], poly: [[k, yD], [k, yB], [xC, yB], [xC, yD]],
          points: [{ x: k, y: yD, name: 'A', side: 'dr' }, { x: k, y: yB, name: 'B', side: 'ul' }, { x: xC, y: yB, name: 'C', side: 'ul' }, { x: xC, y: yD, name: 'D', side: 'dr' }], say: '두 점 B, D는 완만한 직선 위에, 점 C는 가파른 직선 위에 있다.' }),
        explain: `${eqD(s2)}에 ${X} = ${k}${tail(k, '을/를')} 대입하면 ${Y} = ${yB}이므로 B${pt(k, yB)}이다. 점 C의 ${Y}좌표는 ${yB}이므로 ${eqD(s1)}에 ${Y} = ${yB}${tail(yB, '을/를')} 대입하면 ${X} = ${xC}이고 C${pt(xC, yB)}이다. 점 D의 ${X}좌표는 ${xC}이므로 ${eqD(s2)}에 ${X} = ${xC}${tail(xC, '을/를')} 대입하면 ${Y} = ${yD}이고 D${pt(xC, yD)}이다. 직사각형 ABCD의 넓이는 (${k} − ${xC}) × (${yB} − ${yD}) = ${area}이다.`,
        facts: { value: `(${k}-${xCe})*(${yBe}-${yDe})`, unseen: [1] }
      });
    }),
    H('hard-flat-seg', '두 그래프 위의 두 꼭짓점을 이은 변의 길이로 꼭짓점의 좌표 구하기', '심45', (d) => {
      // 두 점 A, D의 y좌표를 문자로 놓아 x좌표를 각각 나타내고(거꾸로 두 번), 그 차가 변의 길이라는 것으로 일차방정식을 세운다.
      const [s1, s2, t] = d.pick([[Q(-2), Q(2, 3), 2], [Q(-2), Q(2), 4], [Q(-2, 3), Q(2), 2], [Q(-1, 2), Q(1, 2), 2], [Q(-3, 2), Q(3), 3], [Q(-3, 2), Q(3, 4), 3], [Q(-3), Q(3, 2), 3], [Q(-2), Q(4), 4], [Q(-2, 3), Q(2, 3), 2], [Q(-4), Q(4, 3), 4], [Q(-1, 2), Q(2, 3), 2], [Q(-2, 3), Q(1, 2), 2]]);
      const xA = t * s1.q / s1.p, xD = t * s2.q / s2.p, len = xD - xA, p1 = -s1.p, q1 = s1.q, p2 = s2.p, q2 = s2.q, c1 = Q(q1, p1), c2 = Q(q2, p2), sum = Q(len, t);
      const ke = `${len}*${p1}*${p2}/(${q2}*${p1}+${q1}*${p2})`;
      return pointAns(`그림과 같이 직사각형 ABCD의 두 꼭짓점 A, D는 각각 정비례 관계 ${eqD(s1)}, ${eqD(s2)}의 그래프 위에 있고, 변 BC는 ${X}축 위에 있다. 변 AD의 길이가 ${len}일 때, 점 A의 좌표는?`, xA, t, {
        figure: planeT({ x: [xA - 1, xD + 1], y: [-1, t + 1], grid: false, ticks: 'none', lines: [{ a: s1 }, { a: s2 }], poly: [[xA, 0], [xD, 0], [xD, t], [xA, t]],
          points: [{ x: xA, y: t, name: 'A', side: 'ur' }, { x: xA, y: 0, name: 'B', side: 'dl' }, { x: xD, y: 0, name: 'C', side: 'dr' }, { x: xD, y: t, name: 'D', side: 'ul' }] }),
        explain: `두 점 A, D의 ${Y}좌표를 ${K}라 하자. ${eqD(s1)}에 ${Y} = ${K}를 대입하면 ${nb(`${X} = ${MINUS}${mono(c1, K)}`)}이고, ${eqD(s2)}에 ${Y} = ${K}를 대입하면 ${nb(`${X} = ${mono(c2, K)}`)}이므로 A${nb(`(${MINUS}${mono(c1, K)}, ${K})`)}, D${nb(`(${mono(c2, K)}, ${K})`)}이다. 변 AD의 길이는 ${nb(`${mono(c2, K)} + ${mono(c1, K)} = ${mono(sum, K)}`)}이고 이것이 ${len}이므로 ${K} = ${t}이다. 따라서 A${pt(xA, t)}이다.`,
        facts: { calc: [[`(-1)*${ke}*${q1}/${p1}`, 0], [ke, 1]], unseen: [1] }
      });
    }),
    H('hard-halve-trapezoid', '사다리꼴의 넓이를 이등분하는 정비례 관계의 그래프', '심46', (d) => {
      // 사다리꼴의 넓이 → 그래프가 변 BC와 만나는 점을 a로 나타내기 → 삼각형의 넓이가 반이 되는 a.
      const [p, w, h] = d.pick([[2, 4, 4], [1, 4, 4], [2, 5, 5], [3, 6, 4], [4, 6, 3], [2, 6, 6], [2, 4, 2], [4, 6, 6], [3, 4, 4], [2, 3, 3]]), T = (2 * w - p) * h / 2, a = Q(T, w * w);
      return ansV(`그림과 같이 세 점 A${pt(p, h)}, B${pt(w, 0)}, C${ptj(w, h, '과/와')} 원점 O를 꼭짓점으로 하는 사다리꼴 AOBC가 있다. 정비례 관계 ${eqDa}의 그래프가 이 사다리꼴의 넓이를 이등분할 때, 수 ${A}의 값은?`, a, 'frac', {
        figure: planeT({ x: [-1, w + 1], y: [-1, h + 1], grid: false, ticks: 'none', lines: [{ a }], poly: [[0, 0], [w, 0], [w, h], [p, h]], points: [{ x: p, y: h, name: 'A', side: 'ul' }, { x: w, y: 0, name: 'B', side: 'dr' }, { x: w, y: h, name: 'C', side: 'ul' }] }),
        explain: `사다리꼴 AOBC의 넓이는 ${HALF} × (${w - p} + ${w}) × ${h} = ${T}이다. ${eqDa}의 그래프가 변 BC와 만나는 점을 P라 하면 P${nb(`(${w}, ${w}${A})`)}이고, 삼각형 POB의 넓이는 ${HALF} × ${w} × ${w}${A} = ${mono(Q(w * w, 2), A)}이다. 이 넓이가 사다리꼴의 넓이의 반인 ${T / 2}이므로 ${A} = ${tx(a)}이다.`,
        facts: { value: `(2*${w}-${p})*${h}/(2*${w}*${w})`, unseen: [2] }
      });
    }),
    H('hard-arrival-gap', '두 사람의 그래프에서 관계식을 세워 도착하는 시각의 차 구하기', '심54', (d) => {
      // 그래프에서 두 관계식을 세우고(두 번), 단위를 맞춘 거리에서 걸리는 시간을 거꾸로 구한 뒤(두 번) 뺀다.
      const [v1, t1, v2, t2, fars] = d.pick([[50, 4, 250, 2, [1500, 3000]], [60, 5, 200, 2, [1200, 2400, 3000]], [80, 5, 200, 2, [1200, 2000, 2400]], [75, 4, 250, 2, [1500, 3000]], [60, 5, 300, 2, [1200, 1500, 3000]], [50, 4, 200, 2, [1000, 2000]]]);
      const far = d.pick(fars), km = far / 1000, y1 = v1 * t1, y2 = v2 * t2, xmax = t1 + 1, ymax = Math.max(y1, y2) + 100, end2 = Math.min(xmax, ymax / v2), [n1, n2] = d.shuffle(NAMES).slice(0, 2), slow = far / v1, fast = far / v2;
      return N(`학교에서 ${km} km 떨어진 도서관까지 ${name(n1, '은/는')} 걸어서 가고, ${name(n2, '은/는')} 자전거를 타고 갔다. 그림은 두 사람이 학교에서 동시에 출발하여 각각 일정한 속력으로 갈 때, 출발한 지 ${X}분 동안 간 거리 ${Y} m 사이의 관계를 나타낸 그래프이다. ${name(n2, '이/가')} 도서관에 도착한 지 몇 분 후에 ${name(n1, '이/가')} 도착하는가?`, slow - fast, {
        unit: '분',
        figure: graph({ xname: 'x(분)', yname: 'y(m)', xmax, ymax, xstep: 1, ystep: 100, paths: [{ pts: [[0, 0], [end2, v2 * end2]], name: n2 }, { pts: [[0, 0], [xmax, v1 * xmax]], name: n1 }], marks: [[t2, y2], [t1, y1]], say: `${n2}의 선은 점 (${t2}, ${y2})을, ${n1}의 선은 점 (${t1}, ${y1})을 지난다.` }),
        explain: `두 그래프는 원점을 지나는 직선이므로 간 거리는 시간에 정비례한다. ${name(n1, '의/의')} 그래프는 점 ${ptj(t1, y1, '을/를')} 지나므로 ${eqD(v1)}, ${name(n2, '의/의')} 그래프는 점 ${ptj(t2, y2, '을/를')} 지나므로 ${eqD(v2)}이다. ${km} km = ${far} m이므로 ${Y} = ${far}일 때 ${X}의 값은 각각 ${slow}, ${fast}이다. ${name(n2, '이/가')} 도착한 지 ${slow} − ${fast} = ${slow - fast}(분) 후에 ${name(n1, '이/가')} 도착한다.`,
        facts: { value: `${km}*1000/(${y1}/${t1})-${km}*1000/(${y2}/${t2})`, unseen: [1000] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
