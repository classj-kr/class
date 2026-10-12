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
})(typeof window !== 'undefined' ? window : globalThis);
