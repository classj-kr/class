// 중학교 1학년 1학기 5단원 좌표평면과 그래프 — 뒤쪽 묶음(상황에 맞는 그래프, 그래프에서 값과 변화 읽기, 두 그래프 견주기와 되풀이되는 변화).
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 7-1-5a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번, 교n = 미래엔 2015 교과서 n쪽, 수n·대n = 미래엔 2022 소단원 수준별 문제·대단원 평가 문제의 n번(그림을 본 곳).
// 그래프의 생김새는 쪽 그림에서 본 것만 쓴다: 계단처럼 오르는 꺾은선(수 기초 03), 줄어드는 곧은 선(수 기초 02), 산 모양·사다리꼴 모양의 곡선과 꺾은선(수 실력 02),
// 늦게 떠나 따라잡는 두 꺾은선(수 실력 03, 교125), 물결 꼴(수 실력 04), 점으로 된 그래프(대 04), 그릇 넷과 그래프 넷(교120), 속력의 사다리꼴(교121), 절반씩 줄어드는 꺾은선(교125), 구간마다 장면이 다른 꺾은선(교122).
// 고르는 그래프의 틀린 보기는 저마다 아이들이 하는 잘못 하나로 만들었다(유형마다 주석에 적었다). 읽는 값은 모두 눈금 선 위에 놓인다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, box, lines, table, N, M, C } = B.kit;
  const { LAB, range, nb, tail, graph } = B.kit.mid;
  const { UNIT, T, vx, vy, XC, YC, figChoice, mini, curve, vessels, fillPts, fillMini, flat, cone, dotPlot } = B.kit.m715;
  const REL = `${vx}와 ${vy} 사이의 관계를 나타낸 그래프이다.`;
  // 눈금이 있는 그래프. paths 의 원소는 점의 배열이거나 { pts, name, smooth }.
  const G = (xname, yname, xmax, ymax, xstep, ystep, paths, more) => graph(Object.assign({ xname, yname, xmax, ymax, xstep, ystep, paths: paths.map((p) => (Array.isArray(p) ? { pts: p } : p)) }, more || {}));
  const pair = (d) => d.shuffle(NAMES).slice(0, 2);
  // 그림이 딸린 참·거짓 문항. 틀린 문장은 [글, 바로잡은 말, 함께 싣지 않을 옳은 문장].
  function claimFig(d, text, figure, yes, no, wantTrue) {
    const bad = d.shuffle(no).slice(0, wantTrue ? 3 : 1), clash = bad.map((s) => s[2]).filter(Boolean);
    const good = d.shuffle(yes.filter((s) => !clash.includes(s))).slice(0, wantTrue ? 1 : 3);
    const rows = d.shuffle(good.map((s) => [s, true, '']).concat(bad.map((s) => [s[0], false, s[1]]))), at = rows.findIndex((r) => r[1] === wantTrue);
    return C(text, rows.map((r) => r[0]), at, { figure, explain: wantTrue ? rows.filter((r) => !r[1]).map((r) => r[2]).join(' ') : rows[at][2], facts: { truth: rows.map((r) => r[1]), want: wantTrue } });
  }
  const WATER = '매초 일정한 양의 물을 넣는다. 시간에 따른 물의 높이를 나타낸 그래프로 알맞은 것은?';

  B.addTypes(UNIT, 'match', [
    T('graph-terms', '변수와 그래프의 뜻', '①38', (d) => {
      const rows = [['변수', `${vx}, ${vy}와 같이 여러 가지로 변하는 값을 나타내는 문자`], ['그래프', '두 변수 사이의 관계를 좌표평면 위에 점, 직선, 곡선 등으로 나타낸 그림']];
      const at = d.int(0, 1), options = d.shuffle(['변수', '그래프', '순서쌍', '좌표축']);
      return C('다음 설명에 알맞은 용어는?', options, options.indexOf(rows[at][0]), {
        figure: lines([rows[at][1]]),
        explain: `${rows[at][1]}${at === 0 ? '를' : '을'} ${rows[at][0]}라 한다. 순서쌍은 두 수의 순서를 정하여 짝 지어 나타낸 것이고, 좌표축은 ${vx}축과 ${vy}축을 통틀어 이르는 말이다.`,
        facts: { truth: options.map((o) => o === rows[at][0]), want: true }
      });
    }),
    T('table-dots', '표의 순서쌍을 좌표평면 위에 나타낸 그래프 고르기', '①39 교118·124', (d) => {
      // 표를 보고 점을 찍는 꼴(작도)을 고르기로 바꾸었다.
      // 틀린 그래프: x, y 의 자리를 바꾸어 찍은 것, 왼쪽으로 한 칸 밀린 것(x 를 0부터 센 것), 점 하나의 y 를 한 칸 틀리게 찍은 것.
      const key = (pts) => pts.map(String).sort().join(' ');
      const four = (v, i, s) => [v.map((y, k) => [k + 1, y]), v.map((y, k) => [y, k + 1]), v.map((y, k) => [k, y]), v.map((y, k) => [k + 1, k === i ? y + s : y])];
      const [ys, at, by] = d.until(() => [range(1, 5).map(() => d.int(1, 5)), d.int(0, 4), d.pick([-1, 1])], ([v, i, s]) => new Set(v).size >= 3 && v[i] + s >= 1 && v[i] + s <= 5 && new Set(four(v, i, s).map(key)).size === 4);
      const ok = ys.map((y, k) => [k + 1, y]), plot = (pts) => dotPlot(pts, { xmax: 5, ymax: 5, u: 18 }), [, swapped, shifted, slipped] = four(ys, at, by);
      return figChoice(d, `다음은 두 변수 ${vx}, ${vy} 사이의 관계를 나타낸 표이다. 순서쌍 ${nb('(' + vx + ', ' + vy + ')')}를 좌표로 하는 점을 좌표평면 위에 나타낸 그래프는?`, [
        { fig: plot(ok), ok: true }, { fig: plot(swapped) }, { fig: plot(shifted) }, { fig: plot(slipped) }
      ], {
        figure: table([vx, 1, 2, 3, 4, 5], [[vy].concat(ys)]),
        explain: (tag) => `표에서 순서쌍 ${nb('(' + vx + ', ' + vy + ')')}는 ${ok.map(([x, y]) => `(${x}, ${y})`).join(', ')}이다. ${XC}를 먼저, ${YC}를 나중에 적은 이 순서쌍들을 좌표로 하는 점을 찍은 그래프는 ${tag}이다.`
      });
    }),
    T('table-fill', '관계를 말로 주고 표의 빈칸 채우기', '①40 교125', (d) => {
      // 정비례가 아닌 관계(올림)로 실었다. 꼭 찬 수(4명, 8명)에서 하나를 더 세는 아이, 한 명이 넘쳐도 식탁이 하나 더 필요함을 놓치는 아이가 걸린다.
      const cap = d.pick([4, 6]), need = (x) => Math.ceil(x / cap);
      const xs = d.until(() => d.shuffle(range(1, 3 * cap)).slice(0, 5).sort((p, q) => p - q), (v) => [cap, 2 * cap].some((m) => v.includes(m) && v.includes(m + 1)) && new Set(v.slice(2).map(need)).size >= 2 && need(v[0]) === 1);
      return M(`한 식탁에 ${cap}명까지 앉을 수 있는 식당에 ${vx}명이 함께 예약하였을 때, 준비해야 하는 식탁의 수를 가장 적게 하여 ${vy}개라 하자. 다음 표의 ㉠, ㉡, ㉢에 알맞은 수는?`, [2, 3, 4].map((i, k) => ({ label: LAB[k], answer: need(xs[i]), unit: '개' })), {
        figure: table([`${vx}(명)`].concat(xs), [[`${vy}(개)`, need(xs[0]), need(xs[1]), box(LAB[0]), box(LAB[1]), box(LAB[2])]]),
        explain: `${cap}명까지는 식탁 1개, ${cap + 1}명부터 ${2 * cap}명까지는 식탁 2개, ${2 * cap + 1}명부터 ${3 * cap}명까지는 식탁 3개가 필요하다. ${[2, 3, 4].map((i, k) => `${xs[i]}명일 때 ${need(xs[i])}개이므로 ${LAB[k]}에 알맞은 수는 ${need(xs[i])}`).join(', ')}이다.`,
        facts: { calc: [2, 3, 4].map((i, k) => [`(${xs[i]}+${cap}-1-(${xs[i]}+${cap}-1)%${cap})/${cap}`, k]), unseen: [1] }
      });
    }),
    T('match-drain', '일정하게 줄어드는 양을 나타낸 그래프 고르기', '①42 수기초02', (d) => {
      // 틀린 그래프: 오르는 선(시간이 가면 그래프는 올라간다고 여김), 굽은 선(일정하게 줄어드는 것이 곧은 선임을 놓침), 수평선(「일정한 양」을 높이가 일정하다고 읽음)
      const g = (p) => mini('시간', '물의 높이', 9, 7, [p]);
      return figChoice(d, '물이 가득 찬 원기둥 모양의 물통에서 매분 일정한 양의 물을 빼내어 물통을 비웠다. 시간에 따른 물의 높이를 나타낸 그래프로 알맞은 것은?', [
        { fig: g([[0, 6], [8, 0]]), ok: true }, { fig: g([[0, 0], [8, 6]]) }, { fig: g(curve([[0, 6], [1, 3.7], [2.5, 1.9], [4.5, 0.8], [8, 0]])) }, { fig: g([[0, 4], [8, 4]]) }
      ], { explain: (tag) => `물의 높이는 처음에 가장 높고, 매분 같은 높이만큼 낮아져 0이 된다. 일정하게 줄어드는 양의 그래프는 오른쪽 아래로 내려가는 곧은 선이므로 ${tag}이다.` });
    }),
    T('match-moved', '걷다가 멈추고 다시 걸을 때 이동한 거리의 그래프 고르기', '①49 ①42 심36 교119', (d, n) => {
      // 첫째는 다시 걸을 때 더 빠르게, 둘째는 처음과 같은 속력으로 걷는다.
      // 틀린 그래프: 멈춘 동안을 내려가는 선으로 그린 것, 빠르기를 가파르기로 옮기지 못한 것(더 완만하거나 더 가파른 것), 멈춘 동안이 없는 것, 이동한 거리가 줄어드는 것.
      const who = d.pick(NAMES), g = (p) => mini('시간', '이동한 거리', 10.5, 7.5, [p]);
      if (n === 0) return figChoice(d, `${name(who, '은/는')} 집에서 출발하여 일정한 속력으로 걷다가 친구를 만나 잠시 멈추어 이야기한 뒤, 처음보다 빠른 일정한 속력으로 다시 걸었다. 시간에 따른 ${name(who, '이/가')} 이동한 거리를 나타낸 그래프로 알맞은 것은?`, [
        { fig: g([[0, 0], [4, 2], [6, 2], [9, 6.5]]), ok: true }, { fig: g([[0, 0], [4, 3], [6, 1.5], [9, 6]]) }, { fig: g([[0, 0], [4, 2], [6, 2], [9, 3]]) }, { fig: g([[0, 0], [4, 2], [9, 6.5]]) }
      ], { explain: (tag) => `걷는 동안에는 이동한 거리가 늘어나므로 그래프가 오른쪽 위로 올라가고, 멈추어 있는 동안에는 이동한 거리가 변하지 않으므로 수평이다. 더 빠르게 걸으면 같은 시간에 거리가 더 많이 늘어나므로 그래프가 더 가파르다. 알맞은 그래프는 ${tag}이다.` });
      return figChoice(d, `${name(who, '은/는')} 집에서 출발하여 일정한 속력으로 걸어 도서관에 가서 책을 읽은 뒤, 도서관에 갈 때와 같은 속력으로 걸어 공원에 갔다. 시간에 따른 ${name(who, '이/가')} 이동한 거리를 나타낸 그래프로 알맞은 것은?`, [
        { fig: g([[0, 0], [3, 2.4], [6, 2.4], [9, 4.8]]), ok: true }, { fig: g([[0, 0], [3, 2.4], [6, 2.4], [7.5, 6.6]]) }, { fig: g([[0, 0], [3, 2.4], [6, 2.4], [9.5, 3.3]]) }, { fig: g([[0, 0], [3, 2.4], [6, 2.4], [9, 0]]) }
      ], { explain: (tag) => `책을 읽는 동안에는 이동한 거리가 변하지 않으므로 그래프가 수평이다. 같은 속력으로 걸으면 같은 시간에 같은 거리만큼 늘어나므로 그래프의 가파르기가 처음과 같다. 이동한 거리는 줄어들지 않는다. 알맞은 그래프는 ${tag}이다.` });
    }, { count: 2 }),
    T('match-home', '집으로부터의 거리를 나타낸 그래프 고르기', '①48 교119', (d, n) => {
      // 첫째는 가다가 머문 뒤 뛰어서 돌아오고, 둘째는 가다가 집으로 되돌아갔다가 다시 간다.
      // 틀린 그래프: 돌아오는데도 계속 올라가는 것(이동한 거리와 헷갈림), 뛰었는데 더 완만한 것, 머문 동안이 없는 것 / 되돌아간 동안을 수평으로 그린 것, 집까지 내려가지 않는 것, 계속 올라가는 것.
      const who = d.pick(NAMES), g = (p) => mini('시간', '집으로부터의 거리', 12.5, 7, [p]);
      if (n === 0) return figChoice(d, `${name(who, '은/는')} 집에서 출발하여 일정한 속력으로 걸어 편의점에 가서 잠시 머문 뒤, 뛰어서 집으로 돌아왔다. 시간에 따른 집으로부터의 거리를 나타낸 그래프로 알맞은 것은?`, [
        { fig: g([[0, 0], [4, 3], [7, 3], [9, 0]]), ok: true }, { fig: g([[0, 0], [4, 3], [7, 3], [9, 6]]) }, { fig: g([[0, 0], [4, 3], [7, 3], [12, 0]]) }, { fig: g([[0, 0], [4, 3], [6, 0]]) }
      ], { explain: (tag) => `편의점으로 가는 동안에는 집에서 멀어지므로 그래프가 올라가고, 머무는 동안에는 수평이고, 집으로 돌아오는 동안에는 거리가 0이 될 때까지 내려간다. 뛰어서 돌아왔으므로 내려가는 선이 올라가는 선보다 가파르다. 알맞은 그래프는 ${tag}이다.` });
      return figChoice(d, `${name(who, '은/는')} 집에서 학교를 향해 걷다가 준비물을 두고 온 것을 알고 집으로 되돌아갔다. 집에서 준비물을 챙기자마자 다시 학교로 갔다. 시간에 따른 집으로부터의 거리를 나타낸 그래프로 알맞은 것은?`, [
        { fig: g([[0, 0], [3, 2], [6, 0], [11, 5]]), ok: true }, { fig: g([[0, 0], [3, 2], [6, 2], [11, 5]]) }, { fig: g([[0, 0], [3, 2], [6, 1], [11, 5]]) }, { fig: g([[0, 0], [3, 2], [6, 3.4], [11, 5]]) }
      ], { explain: (tag) => `집으로 되돌아가는 동안에는 집으로부터의 거리가 줄어들어 0이 되므로 그래프가 가로축까지 내려간다. 그 뒤 다시 학교로 가는 동안에는 올라간다. 알맞은 그래프는 ${tag}이다.` });
    }, { count: 2 }),
    T('match-speed-const', '일정한 속력으로 움직일 때 시간과 속력의 그래프 고르기', '①50', (d) => {
      // 틀린 그래프: 원점을 지나 올라가는 선(이동한 거리의 그래프와 헷갈림), 내려가는 선, 올라가다가 수평이 되는 선(처음부터 일정한 속력임을 놓침)
      const g = (p) => mini('시간', '속력', 9, 7, [p]);
      return figChoice(d, '자동차가 일정한 속력으로 달리고 있다. 시간에 따른 자동차의 속력을 나타낸 그래프로 알맞은 것은?', [
        { fig: g([[0, 3.5], [8, 3.5]]), ok: true }, { fig: g([[0, 0], [8, 6]]) }, { fig: g([[0, 6], [8, 0]]) }, { fig: g([[0, 0], [3, 3.5], [8, 3.5]]) }
      ], { explain: (tag) => `세로축이 속력이므로 속력이 일정하면 시간이 지나도 세로축의 값이 변하지 않는다. 가로축에 평행한 선인 ${tag}이다. 원점을 지나 올라가는 곧은 선은 일정한 속력으로 달릴 때의 이동한 거리의 그래프이다.` });
    }),
    T('match-level-off', '변하다가 일정해지는 양을 나타낸 그래프 고르기', '①51', (d) => {
      // 틀린 그래프: 방향을 거꾸로 읽은 것, 일정해지는 때가 없는 것(곧은 선), 일정하다가 변하는 것(차례를 거꾸로 읽음)
      const cool = d.bool(), g = (p) => mini(cool ? '시간' : '빛의 세기', cool ? '온도' : '광합성량', 9, 7, [p]);
      const down = curve([[0, 6], [1, 4.6], [2, 3.7], [3.2, 3.2], [4.5, 3], [8, 3]]), up = curve([[0, 0.6], [1, 2.4], [2, 3.5], [3.2, 4.1], [4.5, 4.3], [8, 4.3]]);
      const rows = cool ? [{ fig: g(down), ok: true }, { fig: g(up) }, { fig: g([[0, 6], [8, 0.6]]) }, { fig: g([[0, 6], [3.5, 6], [8, 1.5]]) }] : [{ fig: g(up), ok: true }, { fig: g(down) }, { fig: g([[0, 0.6], [8, 6]]) }, { fig: g([[0, 1.2], [3.5, 1.2], [8, 5.6]]) }];
      return figChoice(d, cool ? '끓인 물을 식탁 위에 두었더니 물의 온도가 점점 낮아지다가, 방 안의 온도와 같아진 뒤로는 변하지 않았다. 시간에 따른 물의 온도를 나타낸 그래프로 알맞은 것은?'
        : '어떤 식물은 빛의 세기가 커질수록 광합성량이 늘어나다가, 빛이 어느 세기에 이른 뒤로는 광합성량이 변하지 않는다. 빛의 세기에 따른 광합성량을 나타낸 그래프로 알맞은 것은?', rows, {
        explain: (tag) => (cool ? `온도가 낮아지는 동안에는 그래프가 오른쪽 아래로 내려가고, 온도가 변하지 않는 동안에는 수평이다. 내려가다가 수평이 되는 ${tag}이다.` : `광합성량이 늘어나는 동안에는 그래프가 오른쪽 위로 올라가고, 변하지 않는 동안에는 수평이다. 올라가다가 수평이 되는 ${tag}이다.`)
      });
    }),
    T('match-dots', '낱개로 변하는 양을 점으로 나타낸 그래프 고르기', '①52 대04', (d) => {
      // 틀린 그래프: 먹은 개수만큼 늘어나게 찍은 것, 처음 점을 (0, n − 1)로 찍은 것(하나를 먹은 뒤부터 센 것), 처음 점을 (1, n)으로 찍은 것(먹기 전을 x = 1로 센 것)
      const n = d.pick([4, 5]), plot = (pts) => dotPlot(pts, { xmax: 6, ymax: 6, u: 15 });
      return figChoice(d, `초콜릿 ${n}개 가운데 ${vx}개를 먹었을 때 남은 초콜릿을 ${vy}개라 하자. ${vx}와 ${vy} 사이의 관계를 나타낸 그래프로 알맞은 것은?`, [
        { fig: plot(range(0, n).map((x) => [x, n - x])), ok: true }, { fig: plot(range(0, n).map((x) => [x, x])) }, { fig: plot(range(0, n - 1).map((x) => [x, n - 1 - x])) }, { fig: plot(range(1, n + 1).map((x) => [x, n + 1 - x])) }
      ], { explain: (tag) => `먹은 개수와 남은 개수의 합은 ${n}이다. ${vx}의 값이 0, 1, 2, …, ${n}일 때 ${vy}의 값은 ${n}, ${n - 1}, ${n - 2}, …, 0이므로 점 (0, ${n})에서 시작하여 점 (${n}, 0)에서 끝나는 ${tag}이다. 초콜릿은 낱개로 세므로 그래프는 점으로 나타난다.` });
    }),
    T('match-hike', '이야기에 알맞은 높이의 그래프 고르기', '①53 수실력02', (d) => {
      // 틀린 그래프: 평평한 길을 걸은 동안이 없는 것·있는 것, 빠르기를 거꾸로 읽은 것(빨리 올라가 천천히 내려옴), 내려오지 않은 것
      const who = d.pick(NAMES), flatWalk = d.bool(), g = (p) => mini('시간', '높이', 10.5, 6.5, [p]);
      const told = flatWalk ? '산 중턱까지 올라가서 오르내림이 없는 산책길을 걷다가 내려왔다.' : '천천히 정상까지 올라갔다가 올라갈 때보다 빨리 내려왔다.';
      return figChoice(d, `다음은 등산을 다녀온 ${who}의 이야기이다. 시간에 따른 ${name(who, '이/가')} 있는 곳의 높이를 나타낸 그래프로 알맞은 것은?`, [
        { fig: g([[0, 0], [3, 4], [6.5, 4], [9.5, 0]]), ok: flatWalk }, { fig: g([[0, 0], [7, 5], [9.5, 0]]), ok: !flatWalk }, { fig: g([[0, 0], [2.5, 5], [9.5, 0]]) }, { fig: g([[0, 0], [3, 4], [9.5, 4]]) }
      ], {
        figure: lines([`「${told}」`]),
        explain: (tag) => (flatWalk ? `올라가는 동안에는 높이가 높아지고, 오르내림이 없는 길을 걷는 동안에는 높이가 변하지 않고, 내려오는 동안에는 높이가 낮아진다. 올라가다가 수평이 되었다가 내려가는 ${tag}이다.` : `천천히 올라가면 그래프가 완만하게 올라가고, 빨리 내려오면 가파르게 내려간다. 완만하게 올라갔다가 가파르게 내려가는 ${tag}이다.`)
      });
    }),
    T('match-kinds', '늘어나는 양, 줄어드는 양, 되풀이하여 변하는 양의 그래프 고르기', '①53', (d) => {
      const g = (p) => mini('시간', '양', 9, 7, [p]);
      const SIT = [
        ['병에 든 주사액이 일정하게 줄어들 때, 시간에 따른 병에 남은 주사액의 양', 1, '시간이 지날수록 일정하게 줄어들므로 오른쪽 아래로 내려가는 곧은 선'],
        ['빈 물통에 수도꼭지로 물을 일정하게 받을 때, 시간에 따른 물통에 담긴 물의 양', 0, '시간이 지날수록 일정하게 늘어나므로 오른쪽 위로 올라가는 곧은 선'],
        ['그네를 타고 앞뒤로 흔들릴 때, 시간에 따른 그네의 높이', 2, '높아졌다가 낮아지는 변화가 되풀이되므로 같은 모양이 되풀이되는 선']
      ], at = d.int(0, 2);
      return figChoice(d, '다음 상황을 나타낸 그래프로 알맞은 것은?', [
        { fig: g([[0, 0.5], [8, 6]]), ok: SIT[at][1] === 0 }, { fig: g([[0, 6], [8, 0.5]]), ok: SIT[at][1] === 1 }, { fig: g(curve([[0, 1], [1, 5], [2, 1], [3, 5], [4, 1], [5, 5], [6, 1], [7, 5], [8, 1]])), ok: SIT[at][1] === 2 }, { fig: g([[0, 3.5], [8, 3.5]]) }
      ], { figure: lines([SIT[at][0]]), explain: (tag) => `${SIT[at][2]}인 ${tag}이다.` });
    }),
    T('match-drink', '마신 뒤 남은 양을 나타낸 그래프 고르기', '①53 교125', (d) => {
      // 틀린 그래프: 쉬지 않고 다 마신 것(곧은 선), 마신 양을 그린 것(세로축이 남은 양임을 놓침), 굽은 선
      const who = d.pick(NAMES), g = (p) => mini('시간', '남은 주스의 양', 9, 7, [p]);
      return figChoice(d, `${name(who, '은/는')} 주스 한 병을 사서 절반을 쉬지 않고 마시고, 한참 지난 뒤에 나머지 절반을 마저 마셨다. 시간에 따른 병에 남은 주스의 양을 나타낸 그래프로 알맞은 것은?`, [
        { fig: g([[0, 6], [2, 3], [6, 3], [8, 0]]), ok: true }, { fig: g([[0, 6], [8, 0]]) }, { fig: g([[0, 0], [2, 3], [6, 3], [8, 6]]) }, { fig: g(curve([[0, 6], [1, 3.7], [2.5, 1.9], [4.5, 0.8], [8, 0]])) }
      ], { explain: (tag) => `남은 주스의 양은 처음에 가장 많고, 마시는 동안에는 줄어들고, 마시지 않는 동안에는 변하지 않는다. 내려가다가 수평이 되었다가 다시 내려가 0이 되는 ${tag}이다.` });
    }),
    T('match-situation', '그래프에 알맞은 상황 고르기', '①54·56', (d) => {
      // 틀린 상황: 돌아올 때의 빠르기를 거꾸로 말한 것(가파르기를 읽지 못함), 머문 동안을 빠뜨린 것, 그래프의 모양을 길의 모양으로 읽은 것(언덕)
      const who = d.pick(NAMES), slow = d.bool(), go = 10, stay = d.pick([10, 15]), back = slow ? 20 : 5, D = 600, end = go + stay + back;
      const rows = d.shuffle([
        ['집에서 서점까지 걸어가 책을 고른 뒤, 갈 때보다 천천히 걸어서 집으로 돌아왔다.', slow], ['집에서 서점까지 걸어가 책을 고른 뒤, 갈 때보다 빠르게 뛰어서 집으로 돌아왔다.', !slow],
        ['집에서 서점까지 걸어갔다가 서점에 머물지 않고 곧바로 집으로 돌아왔다.', false], ['언덕길을 올라가 평평한 길을 걷다가 언덕길을 내려갔다.', false]
      ]);
      return C(`다음은 ${name(who, '이/가')} 집에서 출발한 뒤 시간에 따른 집으로부터의 거리를 나타낸 그래프이다. 이 그래프에 알맞은 상황은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        figure: G('시간(분)', '거리(m)', end, 700, 5, 100, [[[0, 0], [go, D], [go + stay, D], [end, 0]]]),
        explain: `그래프는 ${go}분 동안 집에서 ${D} m 떨어진 곳까지 멀어지고, ${stay}분 동안 거리가 변하지 않다가, ${back}분 동안 집으로 돌아온 것을 나타낸다. 돌아오는 데 걸린 시간이 갈 때보다 ${slow ? '길므로 갈 때보다 천천히' : '짧으므로 갈 때보다 빠르게'} 돌아왔다. 그래프의 모양은 길의 모양을 나타내지 않는다.`,
        facts: { truth: rows.map((r) => r[1]), want: true }
      });
    }),
    T('match-segment', '그래프의 한 구간이 나타내는 장면 찾기', '①55 교122', (d) => {
      // 걸을 때보다 버스가 빠르게(더 가파르게) 정한다: 걸어서 1 km를 10~15분에, 버스로 3~4 km를 10~15분에 간다.
      const who = d.pick(NAMES), walk = d.pick([10, 15]), wait = d.pick([5, 10]), ride = d.pick([10, 15]), far = d.pick([4, 5]), ends = [0, walk, walk + wait, walk + wait + ride, walk + wait + ride + 10];
      const at = d.int(1, 3), ask = ['', '버스를 기다린', '버스를 타고 간', '학교에 머문'][at], why = ['', '버스를 기다리는 동안에는 집으로부터의 거리가 변하지 않으므로 그래프가 수평이다. 걸어서 정류장에 간 바로 뒤의 수평인 구간이다.', '버스를 타고 가는 동안에는 걸을 때보다 거리가 빨리 늘어나므로 그래프가 더 가파르게 올라간다.', '학교에 머무는 동안에는 집으로부터의 거리가 변하지 않으므로 그래프가 수평이다. 버스에서 내린 뒤의 수평인 구간이다.'][at];
      const options = range(0, 3).map((i) => `${ends[i]}분~${ends[i + 1]}분`);
      return C(`${name(who, '은/는')} 집에서 버스 정류장까지 걸어가 버스를 기다렸다가, 버스를 타고 학교에 가서 수업을 들었다. 다음은 집에서 출발한 뒤 시간에 따른 집으로부터의 거리를 나타낸 그래프이다. ${name(who, '이/가')} ${ask} 때는 출발한 지 몇 분 후부터 몇 분 후까지인가?`, options, at, {
        figure: G('시간(분)', '거리(km)', ends[4], far + 0.5, 5, 1, [[[0, 0], [ends[1], 1], [ends[2], 1], [ends[3], far], [ends[4], far]]]),
        explain: `${why} 출발한 지 ${ends[at]}분 후부터 ${ends[at + 1]}분 후까지이다.`,
        facts: { truth: options.map((o, i) => i === at), want: true }
      });
    }),
    T('vessel-width', '굵기가 다른 원기둥 모양의 물통과 그래프 짝 짓기', '①43', (d) => {
      const ws = d.shuffle([2, 3, 4.5]), names = ['A', 'B', 'C'], tags = d.shuffle([0, 1, 2]), ask = d.int(0, 2), byWidth = [0, 1, 2].sort((p, q) => ws[p] - ws[q]);
      const paths = [0, 1, 2].map((t) => { const i = tags.indexOf(t); return { pts: [[0, 0], [ws[i] * ws[i], 6]], name: LAB[t] }; });
      return C(`밑면의 넓이가 서로 다른 원기둥 모양의 세 물통 A, B, C에 매초 같은 양의 물을 넣는다. 다음 그래프의 ㉠, ㉡, ㉢은 세 물통의 시간에 따른 물의 높이를 나타낸 것이다. 물통 ${names[ask]}의 그래프는?`, LAB.slice(0, 3), tags[ask], {
        figure: vessels(ws.map((w, i) => ({ parts: [flat(6, w)], name: names[i] }))) + graph({ plain: true, w: 220, xname: '시간', yname: '물의 높이', xmax: 23, ymax: 7, paths }),
        explain: `매초 넣는 물의 양이 같으면 폭이 좁은 물통일수록 물의 높이가 빨리 올라가므로 그래프가 가파르다. 물통의 폭은 ${byWidth.map((i) => names[i]).join(', ')}의 차례로 좁으므로 가파른 그래프부터 차례로 ${byWidth.map((i) => `${names[i]}는 ${LAB[tags[i]]}`).join(', ')}이다.`,
        facts: { truth: [0, 1, 2].map((t) => t === tags[ask]), want: true }
      });
    }),
    T('vessel-step', '폭이 다른 두 원기둥을 이은 그릇과 꺾이는 그래프', '①44 교120', (d) => {
      // 틀린 그래프: 가파르기를 거꾸로 댄 것(폭이 좁은 곳에서 느리게 오른다고 여김), 곧은 선(폭과 상관없이 일정하게 오른다고 여김), 넓은 곳에서는 높이가 오르지 않는다고 여긴 것
      const narrowFirst = d.bool(), parts = narrowFirst ? [flat(1, 2), flat(1, 4.5)] : [flat(1, 4.5), flat(1, 2)], pts = fillPts(parts, 10), g = (p) => mini('시간', '물의 높이', 11.5, 2.28, [p]);
      return figChoice(d, `그림과 같이 폭이 다른 두 원기둥을 이어 붙인 모양의 그릇에 ${WATER}`, [
        { fig: fillMini(parts), ok: true }, { fig: fillMini(parts.slice().reverse()) }, { fig: fillMini([flat(2, 3)]) }, { fig: g(narrowFirst ? [[0, 0], pts[1], [10, 1]] : [[0, 0], [pts[1][0], 0], [10, 2]]) }
      ], {
        figure: vessels([{ parts }]),
        explain: (tag) => `폭이 좁은 곳에서는 물의 높이가 빨리 올라가고, 폭이 넓은 곳에서는 천천히 올라간다. 아래쪽이 ${narrowFirst ? '좁고 위쪽이 넓으므로 가파르게 올라가다가 완만하게' : '넓고 위쪽이 좁으므로 완만하게 올라가다가 가파르게'} 올라가는 ${tag}이다. 폭이 일정한 부분에서는 그래프가 곧은 선이다.`,
        facts: { rule: 'vessel-step' }
      });
    }),
    T('vessel-curve', '폭이 점점 변하는 그릇과 굽은 그래프', '①45·46 심31 교120', (d, n) => {
      // 첫째는 폭이 점점 넓어지거나 좁아지는 그릇, 둘째는 폭이 일정하다가 좁아지는 병, 셋째는 넓어지다가 좁아지는 항아리.
      // 틀린 그래프는 모두 다른 그릇의 그래프이다: 거꾸로 세운 그릇, 폭이 일정한 그릇, 폭이 변하는 차례가 다른 그릇.
      const ask = `그림과 같은 그릇에 ${WATER}`;
      if (n === 0) {
        const wider = d.bool(), parts = [wider ? cone(2, 1.6, 5) : cone(2, 5, 1.6)];
        return figChoice(d, ask, [{ fig: fillMini(parts), ok: true }, { fig: fillMini([wider ? cone(2, 5, 1.6) : cone(2, 1.6, 5)]) }, { fig: fillMini([flat(2, 3)]) }, { fig: fillMini(wider ? [cone(1, 5, 1.6), cone(1, 1.6, 5)] : [cone(1, 1.6, 5), cone(1, 5, 1.6)]) }], {
          figure: vessels([{ parts }]),
          explain: (tag) => `위로 갈수록 폭이 ${wider ? '넓어지므로 물의 높이가 점점 느리게 올라간다. 처음에는 가파르다가 점점 완만해지는' : '좁아지므로 물의 높이가 점점 빠르게 올라간다. 처음에는 완만하다가 점점 가팔라지는'} 굽은 선 ${tag}이다.`,
          facts: { rule: 'vessel-cone' }
        });
      }
      if (n === 1) {
        const parts = [flat(1.4, 4.2), cone(1, 4.2, 1.4)];
        return figChoice(d, ask, [{ fig: fillMini(parts), ok: true }, { fig: fillMini([cone(1, 1.4, 4.2), flat(1.4, 4.2)]) }, { fig: fillMini([flat(1.4, 2.2), cone(1, 2.2, 5)]) }, { fig: fillMini([flat(2.4, 3)]) }], {
          figure: vessels([{ parts }]),
          explain: (tag) => `아래쪽은 폭이 일정하므로 물의 높이가 일정하게 올라가 그래프가 곧은 선이다. 위쪽은 위로 갈수록 폭이 좁아지므로 물의 높이가 점점 빠르게 올라가 그래프가 점점 가팔라지는 굽은 선이다. 곧은 선 뒤에 점점 가팔라지는 굽은 선이 이어지는 ${tag}이다.`,
          facts: { rule: 'vessel-bottle' }
        });
      }
      const parts = [cone(1.2, 2, 5), cone(1.2, 5, 2)];
      return figChoice(d, ask, [{ fig: fillMini(parts), ok: true }, { fig: fillMini([cone(1.2, 5, 2), cone(1.2, 2, 5)]) }, { fig: fillMini([cone(2.4, 2, 5)]) }, { fig: fillMini([cone(2.4, 5, 2)]) }], {
        figure: vessels([{ parts }]),
        explain: (tag) => `아래쪽은 위로 갈수록 폭이 넓어지므로 물의 높이가 점점 느리게 올라가고, 위쪽은 위로 갈수록 폭이 좁아지므로 점점 빠르게 올라간다. 점점 완만해지다가 다시 점점 가팔라지는 ${tag}이다.`,
        facts: { rule: 'vessel-jar' }
      });
    }, { count: 3 }),
    T('vessel-from-graph', '물의 높이의 그래프를 보고 그릇 고르기', '①47 심32 교120', (d, n) => {
      // 첫째는 꺾이는 곧은 선(폭이 한 번 바뀌는 그릇), 둘째는 곧은 선 뒤에 굽은 선이 이어지는 그래프(폭이 일정하다가 점점 변하는 그릇).
      // 틀린 그릇: 거꾸로 세운 그릇, 폭이 점점 변하기만 하는 그릇(굽은 선이 된다), 폭이 일정한 그릇(곧은 선 하나가 된다), 변하는 차례가 다른 그릇.
      const ask = '어떤 그릇에 매초 일정한 양의 물을 넣었더니 시간에 따른 물의 높이의 그래프가 다음과 같았다. 이 그릇의 옆모습으로 알맞은 것은?', v = (parts) => vessels([{ parts }]);
      const big = (parts) => { const s = parts.some((p) => p.w0 !== p.w1), H = parts.reduce((sum, p) => sum + p.h, 0), pts = fillPts(parts, 10, s); return graph({ plain: true, w: 200, xname: '시간', yname: '물의 높이', xmax: 11.5, ymax: H * 1.14, paths: [{ pts, smooth: s }] }); };
      if (n === 0) {
        const wideFirst = d.bool(), parts = wideFirst ? [flat(1, 4.5), flat(1, 2)] : [flat(1, 2), flat(1, 4.5)];
        return figChoice(d, ask, [{ fig: v(parts), ok: true }, { fig: v(parts.slice().reverse()) }, { fig: v([wideFirst ? cone(2, 4.5, 2) : cone(2, 2, 4.5)]) }, { fig: v([flat(2, 3)]) }], {
          figure: big(parts),
          explain: (tag) => `그래프가 곧은 선 두 개로 이루어져 있으므로 폭이 일정한 부분 둘이 이어진 그릇이다. ${wideFirst ? '처음에는 완만하게 올라가다가 뒤에는 가파르게 올라가므로 아래쪽의 폭이 넓고 위쪽의 폭이 좁은' : '처음에는 가파르게 올라가다가 뒤에는 완만하게 올라가므로 아래쪽의 폭이 좁고 위쪽의 폭이 넓은'} ${tag}이다. 폭이 점점 변하는 그릇의 그래프는 굽은 선이다.`,
          facts: { rule: 'from-kink' }
        });
      }
      const wider = d.bool(), parts = wider ? [flat(1.2, 2.2), cone(1.2, 2.2, 5)] : [flat(1.2, 4.4), cone(1.2, 4.4, 1.6)];
      return figChoice(d, ask, [{ fig: v(parts), ok: true }, { fig: v(wider ? [flat(1.2, 4.4), cone(1.2, 4.4, 1.6)] : [flat(1.2, 2.2), cone(1.2, 2.2, 5)]) }, { fig: v(wider ? [cone(1.2, 5, 2.2), flat(1.2, 2.2)] : [cone(1.2, 1.6, 4.4), flat(1.2, 4.4)]) }, { fig: v([wider ? cone(2.4, 2.2, 5) : cone(2.4, 4.4, 1.6)]) }], {
        figure: big(parts),
        explain: (tag) => `그래프가 처음에는 곧은 선이므로 그릇의 아래쪽은 폭이 일정하다. 그 뒤에는 ${wider ? '점점 완만해지므로 위쪽은 위로 갈수록 폭이 넓어진다' : '점점 가팔라지므로 위쪽은 위로 갈수록 폭이 좁아진다'}. 알맞은 그릇은 ${tag}이다.`,
        facts: { rule: 'from-curve' }
      });
    }, { count: 2 })
  ]);

  B.addTypes(UNIT, 'read', [
    T('read-point', '그래프에서 가로의 값에 맞는 세로의 값, 세로의 값에 맞는 가로의 값 읽기', '①57 수기초03', (d) => {
      const who = d.pick(NAMES), s = d.pick([2, 3, 4]), pts = range(0, 7).map((i) => [10 * i, s * Math.ceil(i / 2)]);
      const [i1, h] = d.until(() => [d.int(2, 6), s * d.int(2, 3)], ([i, v]) => pts[i][1] !== v), t = pts[i1][0], y = pts[i1][1], t2 = pts.find((p) => p[1] === h)[0];
      return M(`다음은 ${name(who, '이/가')} 에스컬레이터와 평평한 통로를 번갈아 지나며 위층으로 올라갈 때, 출발한 지 ${vx}초 후의 높이를 ${vy} m라 하고 ${REL} 출발한 지 ${t}초 후의 높이는 몇 m이고, 높이가 처음으로 ${h} m가 되는 것은 출발한 지 몇 초 후인가?`,
        [{ label: '높이', answer: y, unit: 'm' }, { label: '시간', answer: t2, unit: '초 후' }], {
          figure: G('시간(초)', '높이(m)', 70, 4 * s, 10, s, [pts]),
          explain: `가로축에서 ${t}${tail(t, '을/를')} 찾아 그래프와 만나는 점의 세로축의 값을 읽으면 ${y}이므로 ${t}초 후의 높이는 ${y} m이다. 세로축에서 ${h}${tail(h, '을/를')} 찾아 그래프와 처음 만나는 점의 가로축의 값을 읽으면 ${t2}이므로 ${t2}초 후이다.`,
          facts: { calc: [[String(y), 0], [String(t2), 1]] }
        });
    }),
    T('read-max', '굽은 그래프에서 가장 큰 값과 그때 읽기', '①57 교117', (d) => {
      const base = d.pick([5, 10, 20]), k = d.pick([1, 2]), pts = [0, 3, 5, 6, 5, 3, 0].map((v, i) => [k * i, v * base]);
      return M(`다음은 공을 위로 던졌을 때, 던진 지 ${vx}초 후의 공의 높이를 ${vy} m라 하고 ${REL} 공이 가장 높이 올라갔을 때의 높이는 몇 m이고, 그때는 공을 던진 지 몇 초 후인가?`,
        [{ label: '높이', answer: 6 * base, unit: 'm' }, { label: '시간', answer: 3 * k, unit: '초 후' }], {
          figure: G('시간(초)', '높이(m)', 6 * k, 7 * base, k, base, [curve(pts)]),
          explain: `그래프에서 가장 높은 점의 좌표는 (${3 * k}, ${6 * base})이다. 공은 던진 지 ${3 * k}초 후에 가장 높이 올라가고, 그때의 높이는 ${6 * base} m이다.`,
          facts: { calc: [[String(6 * base), 0], [String(3 * k), 1]] }
        });
    }),
    T('read-rest', '거리의 그래프에서 머문 시간과 머문 곳 읽기', '①58 심37', (d) => {
      // 머문 시간은 수평인 구간의 끝의 시각이 아니라 두 끝의 시각의 차이다.
      const who = d.pick(NAMES), t1 = d.pick([10, 15, 20]), rest = d.pick([5, 10, 15]), d1 = d.pick([1, 2]), t3 = t1 + rest + d.pick([10, 15]), d2 = d1 + d.pick([1, 2]);
      return M(`${name(who, '은/는')} 집에서 출발하여 도서관에 가는 길에 공원에 들러 쉬었다. 다음은 집에서 출발한 지 ${vx}분 후 집으로부터 떨어진 거리를 ${vy} km라 하고 ${REL} 공원에서 쉰 시간은 몇 분이고, 공원은 집에서 몇 km 떨어져 있는가?`,
        [{ label: '쉰 시간', answer: rest, unit: '분' }, { label: '거리', answer: d1, unit: 'km' }], {
          figure: G('시간(분)', '거리(km)', t3, d2 + 0.5, 5, 1, [[[0, 0], [t1, d1], [t1 + rest, d1], [t3, d2]]]),
          explain: `쉬는 동안에는 집으로부터 떨어진 거리가 변하지 않으므로 그래프가 수평이다. 수평인 구간은 ${t1}분부터 ${t1 + rest}분까지이므로 쉰 시간은 ${t1 + rest} − ${t1} = ${rest}(분)이고, 그때의 거리가 ${d1} km이므로 공원은 집에서 ${d1} km 떨어져 있다.`,
          facts: { calc: [[`${t1 + rest}-${t1}`, 0], [String(d1), 1]] }
        });
    }),
    T('read-candle', '줄어드는 양의 그래프에서 변하지 않은 동안 읽기', '심46', (d) => {
      const who = d.pick(NAMES), [a, t1, r, b, dt] = d.until(() => { const x = d.pick([4, 8]), t = d.pick([10, 15]), y = d.pick([4, 8]); return [x, t, d.pick([5, 10, 15]), y, y * t / x]; }, (v) => v[4] % 5 === 0 && v[1] + v[2] + v[4] <= 45), end = t1 + r + dt;
      return M(`${name(who, '은/는')} 양초에 불을 붙였다가 끄고, 얼마 뒤에 다시 불을 붙였다. 다음은 처음 불을 붙인 지 ${vx}분 후의 양초의 길이를 ${vy} cm라 하고 ${REL} 불이 꺼져 있던 시간은 몇 분이고, 그동안 양초의 길이는 몇 cm인가?`,
        [{ label: '시간', answer: r, unit: '분' }, { label: '길이', answer: 20 - a, unit: 'cm' }], {
          figure: G('시간(분)', '길이(cm)', end, 24, 5, 4, [[[0, 20], [t1, 20 - a], [t1 + r, 20 - a], [end, 20 - a - b]]]),
          explain: `불이 켜져 있는 동안에는 양초의 길이가 줄어들고, 불이 꺼져 있는 동안에는 길이가 변하지 않으므로 그래프가 수평이다. 수평인 구간은 ${t1}분부터 ${t1 + r}분까지이므로 불이 꺼져 있던 시간은 ${t1 + r} − ${t1} = ${r}(분)이고, 그동안 양초의 길이는 ${20 - a} cm이다.`,
          facts: { calc: [[`${t1 + r}-${t1}`, 0], [String(20 - a), 1]] }
        });
    }),
    T('read-walk-claims', '거리의 그래프에서 알 수 있는 사실 가리기', '①60 심37', (d) => {
      // 틀린 문장: 머문 시간을 수평인 구간의 끝의 시각으로 읽은 것, 빠르기를 거꾸로 견준 것, 그래프의 모양을 길의 모양으로 읽은 것, 남은 거리를 전체 거리로 읽은 것, 문구점에 닿은 때를 학교에 닿은 때로 읽은 것
      const who = d.pick(NAMES), [t1, d1, stay, dt, D] = d.until(() => [d.pick([5, 10]), d.pick([400, 600]), d.pick([5, 10]), d.pick([5, 10, 15]), d.pick([1000, 1200])], (v) => v[1] / v[0] !== (v[4] - v[1]) / v[3]), end = t1 + stay + dt, faster = (D - d1) / dt > d1 / t1;
      const speed = (yes) => `문구점에서 나온 뒤에는 문구점에 갈 때보다 ${yes === faster ? '빠르게' : '느리게'} 걸었다.`;
      const yes = [`문구점은 집에서 ${d1} m 떨어져 있다.`, `문구점에 머문 시간은 ${stay}분이다.`, `집에서 학교까지 가는 데 걸린 시간은 모두 ${end}분이다.`, speed(true)];
      const no = [
        [`문구점에 머문 시간은 ${t1 + stay}분이다.`, `수평인 구간은 ${t1}분부터 ${t1 + stay}분까지이므로 문구점에 머문 시간은 ${stay}분이다.`, yes[1]],
        [speed(false), `문구점에 갈 때는 ${t1}분 동안 ${d1} m를, 문구점에서 나온 뒤에는 ${dt}분 동안 ${D - d1} m를 걸었다. 그래프가 가파를수록 빠르게 걸은 것이다.`, yes[3]],
        ['학교에 가는 길은 두 번 꺾여 있다.', '그래프의 모양은 길의 모양을 나타내지 않는다. 그래프가 꺾이는 곳은 걷다가 멈춘 때와 다시 걷기 시작한 때이다.'],
        [`집에서 학교까지의 거리는 ${D - d1} m이다.`, `집에서 학교까지의 거리는 ${D} m이다.`],
        [`출발한 지 ${t1}분 후에 학교에 도착하였다.`, `출발한 지 ${t1}분 후에 도착한 곳은 문구점이고, 학교에는 ${end}분 후에 도착하였다.`, yes[2]]
      ];
      return claimFig(d, `${name(who, '은/는')} 집에서 출발하여 문구점에 들렀다가 학교에 갔다. 다음은 집에서 출발한 지 ${vx}분 후 집으로부터 떨어진 거리를 ${vy} m라 하고 ${REL} 이 그래프에서 알 수 있는 사실로 옳은 것은?`,
        G('시간(분)', '거리(m)', end, D, 5, 200, [[[0, 0], [t1, d1], [t1 + stay, d1], [end, D]]]), yes, no, true);
    }),
    T('read-remaining', '남은 거리가 줄어드는 그래프 읽기', '①60 수기초02', (d) => {
      // 틀린 문장: 수평인 구간이 없는데 멈췄다고 한 것, 1분 뒤의 값을 전체 거리로 읽은 것, 내려가는 선을 멀어지는 것으로 읽은 것, 남은 거리를 걸은 거리로 읽은 것
      const who = d.pick(NAMES), v = d.pick([100, 200]), end = d.pick([5, 6]), D = v * end, t = d.until(() => d.int(1, end - 1), (x) => D - v * x !== v * x), pts = range(0, end).map((x) => [x, D - v * x]);
      const yes = [`집에서 학교까지의 거리는 ${D} m이다.`, `집에서 학교까지 가는 데 ${end}분이 걸렸다.`, `1분마다 ${v} m씩 걸었다.`, `출발한 지 ${t}분 후 학교까지 남은 거리는 ${D - v * t} m이다.`];
      const no = [
        ['학교에 가는 도중에 잠시 멈춘 적이 있다.', '그래프에 수평인 구간이 없으므로 멈춘 적이 없다.'],
        [`집에서 학교까지의 거리는 ${D - v} m이다.`, `출발할 때(${vx} = 0) 학교까지의 거리가 ${D} m이므로 집에서 학교까지의 거리는 ${D} m이다.`, yes[0]],
        ['시간이 지날수록 학교에서 점점 멀어진다.', '세로축은 학교까지 남은 거리이다. 그래프가 내려가므로 시간이 지날수록 학교에 가까워진다.'],
        [`출발한 지 ${t}분 후까지 걸은 거리는 ${D - v * t} m이다.`, `${D - v * t} m는 학교까지 남은 거리이다. 걸은 거리는 ${D} − ${D - v * t} = ${v * t}(m)이다.`, yes[3]]
      ];
      return claimFig(d, `다음은 ${name(who, '이/가')} 집에서 출발하여 학교까지 걸어갈 때, 출발한 지 ${vx}분 후 ${name(who, '이/가')} 있는 곳에서 학교까지의 거리를 ${vy} m라 하고 ${REL} 이 그래프에 대한 설명으로 옳지 않은 것은?`,
        G('시간(분)', '거리(m)', end, D, 1, v, [pts]), yes, no, false);
    }),
    T('read-speed', '거리의 그래프에서 한 구간의 속력 구하기', '①61', (d) => {
      const who = d.pick(NAMES), [t1, d1, t2, d2] = d.pick([[5, 400, 15, 800], [5, 300, 15, 800], [10, 400, 15, 800], [5, 500, 10, 800], [10, 600, 15, 800], [5, 200, 10, 700]]), first = d.bool();
      const span = first ? `처음 ${t1}분 동안` : `출발한 지 ${t1}분 후부터 ${t2}분 후까지`, dist = first ? d1 : d2 - d1, time = first ? t1 : t2 - t1;
      return N(`다음은 ${name(who, '이/가')} 집에서 출발하여 걸을 때, 출발한 지 ${vx}분 후 집으로부터 떨어진 거리를 ${vy} m라 하고 ${REL} ${span} ${name(who, '은/는')} 분속 몇 m로 걸었는가?`, dist / time, {
        lead: '분속', unit: 'm', figure: G('시간(분)', '거리(m)', t2, 800, 5, 100, [[[0, 0], [t1, d1], [t2, d2]]]),
        explain: `${span} ${first ? `${d1} m를` : `${time}분 동안 ${d2} − ${d1} = ${dist}(m)를`} 걸었다. 속력은 걸은 거리를 걸린 시간으로 나눈 값이므로 분속 ${dist} ÷ ${time} = ${dist / time}(m)이다.`,
        facts: { value: first ? `${d1}/${t1}` : `(${d2}-${d1})/(${t2}-${t1})` }
      });
    }),
    T('read-fastest', '거리의 그래프에서 가장 빠르게 움직인 구간 찾기', '①61', (d) => {
      // 가장 높이 올라간 구간이나 가장 긴 구간이 아니라 가장 가파른 구간이다.
      const who = d.pick(NAMES), segs = d.pick([[[10, 300], [5, 0], [5, 300], [15, 300]], [[5, 200], [10, 200], [5, 0], [10, 500]], [[5, 400], [5, 0], [15, 300], [10, 200]], [[10, 200], [5, 300], [5, 0], [15, 300]]]);
      const pts = [[0, 0]]; for (const [dt, dy] of segs) pts.push([pts[pts.length - 1][0] + dt, pts[pts.length - 1][1] + dy]);
      const speeds = segs.map(([dt, dy]) => dy / dt), at = speeds.indexOf(Math.max(...speeds)), options = segs.map((s, i) => `${pts[i][0]}분~${pts[i + 1][0]}분`);
      return C(`다음은 ${name(who, '이/가')} 집에서 출발하여 공원까지 갈 때, 출발한 지 ${vx}분 후 집으로부터 떨어진 거리를 ${vy} m라 하고 ${REL} ${name(who, '이/가')} 가장 빠르게 움직인 때는?`, options, at, {
        figure: G('시간(분)', '거리(m)', pts[4][0], pts[4][1], 5, 100, [pts]),
        explain: `같은 시간 동안 거리가 많이 늘어날수록, 곧 그래프가 가파를수록 빠르게 움직인 것이다. ${nb(options[at])}에는 ${segs[at][0]}분 동안 ${segs[at][1]} m를 가서 분속 ${speeds[at]} m로 가장 빠르다.`,
        facts: { truth: speeds.map((s) => s === speeds[at]), want: true }
      });
    }),
    T('read-xy', '두 변수의 그래프에서 구간마다의 변화 읽기', '①62', (d) => {
      const p = d.int(2, 4), q = p + d.int(2, 4), r = q + d.int(2, 4), top = d.pick([4, 6, 8, 10]);
      const yes = [`${vx}의 값이 0에서 ${p}까지 증가할 때, ${vy}의 값은 0에서 ${top}까지 증가한다.`, `${vx}의 값이 ${p}에서 ${q}까지 증가할 때, ${vy}의 값은 변하지 않는다.`, `${vx}의 값이 ${q}에서 ${r}까지 증가할 때, ${vy}의 값은 감소한다.`, `${nb(vx + ' = ' + q)}일 때 ${nb(vy + ' = ' + top)}이다.`];
      const no = [
        [`${vx}의 값이 ${q}에서 ${r}까지 증가할 때, ${vy}의 값도 증가한다.`, `${vx}의 값이 ${q}에서 ${r}까지 증가할 때 그래프가 오른쪽 아래로 내려가므로 ${vy}의 값은 감소한다.`, yes[2]],
        [`${vx}의 값이 ${p}에서 ${q}까지 증가할 때, ${vy}의 값은 감소한다.`, `${vx}의 값이 ${p}에서 ${q}까지 증가할 때 그래프가 수평이므로 ${vy}의 값은 변하지 않는다.`, yes[1]],
        [`${vy}의 값이 가장 클 때의 ${vx}의 값은 ${r}이다.`, `${vy}의 값은 ${vx}의 값이 ${p}부터 ${q}까지일 때 ${top}${tail(Math.abs(top), '으로/로')} 가장 크다.`],
        [`${nb(vx + ' = ' + r)}일 때 ${nb(vy + ' = ' + top)}이다.`, `${nb(vx + ' = ' + r)}일 때 ${nb(vy + ' = 0')}이다.`]
      ];
      return claimFig(d, `다음은 두 변수 ${vx}, ${vy} 사이의 관계를 나타낸 그래프이다. 이 그래프에 대한 설명으로 옳은 것은?`, G('x', 'y', r, top + 2, 1, 2, [[[0, 0], [p, top], [q, top], [r, 0]]]), yes, no, true);
    }),
    T('read-speed-graph', '시간과 속력의 그래프에서 속력이 일정한 동안 읽기', '①63 교121', (d) => {
      const who = d.pick(NAMES), a = d.pick([5, 10]), keep = d.pick([10, 15, 20]), c = d.pick([5, 10]), v = d.pick([200, 300, 400]), end = a + keep + c;
      return M(`다음은 ${name(who, '이/가')} 자전거를 탈 때, 출발한 지 ${vx}분 후의 속력을 분속 ${vy} m라 하고 ${REL} 속력이 변하지 않은 시간은 몇 분 동안이고, 그때의 속력은 분속 몇 m인가?`,
        [{ label: '시간', answer: keep, unit: '분' }, { label: '속력', lead: '분속', answer: v, unit: 'm' }], {
          figure: G('시간(분)', '속력(m/분)', end, v + 100, 5, 100, [[[0, 0], [a, v], [a + keep, v], [end, 0]]]),
          explain: `세로축이 속력이므로 그래프가 수평인 동안 속력이 변하지 않는다. 수평인 구간은 ${a}분부터 ${a + keep}분까지이므로 ${a + keep} − ${a} = ${keep}(분) 동안이고, 그때의 속력은 분속 ${v} m이다.`,
          facts: { calc: [[`${a + keep}-${a}`, 0], [String(v), 1]] }
        });
    }),
    T('read-temp', '오르내리는 그래프에 대한 설명 가리기', '①64 심43 교117', (d) => {
      // 틀린 문장: 가장 낮은 때를 그래프의 오른쪽 끝으로 읽은 것, 가장 높은 값을 차로 읽은 것, 가장 높은 때 뒤에도 올라간다고 한 것, 한 눈금 틀리게 읽은 것
      const ys = d.pick([[6, 4, 6, 10, 14, 16, 12, 10, 8], [8, 6, 4, 8, 12, 14, 12, 8, 6], [10, 8, 6, 10, 16, 14, 12, 10, 8]]), hi = Math.max(...ys), lo = Math.min(...ys), hAt = 3 * ys.indexOf(hi), lAt = 3 * ys.indexOf(lo), k = d.pick([4, 6]), pts = ys.map((y, i) => [3 * i, y]);
      const yes = [`기온이 가장 높은 때는 ${hAt}시이다.`, '9시와 21시의 기온은 같다.', `기온이 가장 높을 때와 가장 낮을 때의 기온의 차는 ${hi - lo} °C이다.`, `${3 * k}시의 기온은 ${ys[k]} °C이다.`, `${lAt}시부터 ${hAt}시까지 기온은 계속 올라간다.`];
      const no = [
        ['기온이 가장 낮은 때는 24시이다.', `기온이 가장 낮은 때는 ${lAt}시이고, 그때의 기온은 ${lo} °C이다. 24시의 기온은 ${ys[8]} °C이다.`],
        [`기온이 가장 높을 때와 가장 낮을 때의 기온의 차는 ${hi} °C이다.`, `가장 높은 기온은 ${hi} °C, 가장 낮은 기온은 ${lo} °C이므로 차는 ${hi} − ${lo} = ${hi - lo}(°C)이다.`, yes[2]],
        [`${hAt}시부터 24시까지 기온은 계속 올라간다.`, `${hAt}시 뒤로는 그래프가 내려가므로 기온이 낮아진다.`],
        [`${3 * k}시의 기온은 ${ys[k] + 2} °C이다.`, `${3 * k}시의 기온은 ${ys[k]} °C이다.`, yes[3]]
      ];
      return claimFig(d, `다음은 어느 날 ${vx}시의 기온을 ${vy} °C라 하고 ${REL} 이 그래프에 대한 설명으로 옳지 않은 것은?`, G('시각(시)', '기온(°C)', 24, hi + 2, 3, 2, [pts]), yes, no, false);
    }),
    T('read-crossings', '되풀이하여 오르내리는 그래프에서 값이 같은 순간의 횟수 세기', '①64', (d) => {
      const half = d.pick([4, 6, 8]), k = d.pick([3, 4, 5]), n = 24 / half, ups = Math.ceil(n / 2), downs = Math.floor(n / 2), pts = range(0, n).map((i) => [i * half, i % 2 ? 6 : 2]);
      return N(`다음은 어느 항구에서 하루 동안 ${vx}시의 해수면의 높이를 ${vy} m라 하고 ${REL} 하루 동안 해수면의 높이가 ${k} m인 순간은 모두 몇 번인가?`, n, {
        unit: '번', figure: G('시각(시)', '높이(m)', 24, 7, half / 2, 1, [curve(pts)]),
        explain: `세로축에서 ${k}${tail(k, '을/를')} 찾아 가로축에 평행한 선을 그으면 그래프와 만나는 점의 수가 높이가 ${k} m인 순간의 횟수이다. 해수면이 높아지는 동안 한 번, 낮아지는 동안 한 번씩 만난다. 하루 동안 ${ups}번 높아지고 ${downs}번 낮아지므로 모두 ${n}번이다.`,
        facts: { value: `24/${half}` }
      });
    }),
    T('read-kink', '변화의 빠르기가 달라지는 때 찾기', '①65 ①57', (d) => {
      // 그래프가 가장 높은 때가 아니라 더 가팔라지기 시작하는 꺾인 점의 가로의 값이다.
      const who = d.pick(NAMES), segs = d.pick([[[20, 100], [20, 200]], [[10, 50], [20, 200], [10, 50]], [[20, 100], [10, 150], [10, 50]], [[10, 50], [10, 50], [20, 200]]]);
      const pts = [[0, 0]]; for (const [dt, dy] of segs) pts.push([pts[pts.length - 1][0] + dt, pts[pts.length - 1][1] + dy]);
      const rates = segs.map(([dt, dy]) => dy / dt), at = rates.indexOf(Math.max(...rates)), t = pts[at][0];
      return N(`다음은 ${name(who, '이/가')} 달리기를 할 때, 달리기 시작한 지 ${vx}분 후까지 소모한 열량을 ${vy} kcal라 하고 ${REL} 1분 동안 소모하는 열량이 많아지기 시작한 것은 달리기 시작한 지 몇 분 후부터인가?`, t, {
        unit: '분 후', figure: G('시간(분)', '열량(kcal)', 40, 300, 10, 50, [pts]),
        explain: `1분 동안 소모하는 열량이 많을수록 그래프가 가파르다. 그래프는 ${t}분에서 꺾여 더 가팔라지므로 ${t}분 후부터 1분 동안 소모하는 열량이 많아졌다. ${t}분 전에는 1분에 ${rates[at - 1]} kcal씩, ${t}분 뒤에는 1분에 ${rates[at]} kcal씩 소모하였다.`,
        facts: { calc: [[String(t), 0]] }
      });
    }),
    T('read-nontime', '가로축이 시간이 아닌 그래프 읽기', '①66 심47', (d) => {
      // 틀린 문장: 그래프의 오른쪽 끝을 가장 큰 때로 읽은 것, 올라가기만 한다고 한 것, 가로축을 시간으로 읽은 것, 내려가는 것을 0이 되는 것으로 읽은 것
      const peak = d.pick([25, 30, 35]), top = peak / 5, end = peak + 10, pts = [[0, 0], [peak, top], [peak + 5, top - 2], [end, top - 4]];
      const yes = [`온도가 ${peak} °C가 될 때까지는 온도가 높을수록 만들어 내는 산소의 양이 많아진다.`, `온도가 ${peak} °C보다 높아지면 온도가 높을수록 만들어 내는 산소의 양이 적어진다.`, `만들어 내는 산소의 양이 가장 많을 때의 온도는 ${peak} °C이다.`];
      const no = [
        [`온도가 ${end} °C일 때 만들어 내는 산소의 양이 가장 많다.`, `산소의 양이 가장 많은 때는 그래프의 오른쪽 끝이 아니라 그래프가 가장 높은 ${peak} °C일 때이다.`, yes[2]],
        ['온도가 높을수록 만들어 내는 산소의 양은 항상 많아진다.', `온도가 ${peak} °C보다 높아지면 그래프가 내려가므로 산소의 양은 적어진다.`, yes[1]],
        ['시간이 지날수록 만들어 내는 산소의 양이 많아지다가 적어진다.', '가로축은 시간이 아니라 온도이다. 이 그래프는 온도에 따른 산소의 양을 나타낸다.'],
        [`온도가 ${peak} °C보다 높아지면 산소를 전혀 만들어 내지 못한다.`, `${end} °C일 때에도 산소를 ${top - 4} mL 만들어 낸다.`]
      ];
      return claimFig(d, '다음은 어떤 식물이 1시간 동안 만들어 내는 산소의 양을 온도에 따라 나타낸 그래프이다. 이 그래프에 대한 설명으로 옳은 것은?', G('온도(°C)', '산소의 양(mL)', end, 8, 5, 1, [pts]), yes, no, true);
    })
  ]);

  B.addTypes(UNIT, 'two', [
    T('two-gap', '두 그래프에서 같은 때의 두 값의 차 구하기', '①70 심50 대15', (d, n) => {
      // 첫째는 원점에서 함께 출발한 두 사람의 거리의 차, 둘째는 처음 값이 0이 아닌 두 그래프의 처음 값과 같은 때의 차.
      if (n === 0) {
        const [who, other] = pair(d), s = d.pick([{ a: 80, b: 60, end: 10, ys: 100 }, { a: 80, b: 40, end: 15, ys: 200 }, { a: 120, b: 80, end: 10, ys: 200 }, { a: 60, b: 40, end: 10, ys: 100 }]), t = 5 * d.int(1, s.end / 5), xs = range(0, s.end / 5).map((i) => 5 * i);
        return N(`${josa(who, '과/와')} ${name(other, '은/는')} 같은 곳에서 동시에 출발하여 같은 길을 걸었다. 다음은 출발한 지 ${vx}분 후 두 사람이 각각 걸은 거리를 ${vy} m라 하고 ${REL} 출발한 지 ${t}분 후 두 사람 사이의 거리는 몇 m인가?`, (s.a - s.b) * t, {
          unit: 'm', figure: G('시간(분)', '거리(m)', s.end, s.a * s.end + s.ys, 5, s.ys, [{ pts: xs.map((x) => [x, s.a * x]), name: who }, { pts: xs.map((x) => [x, s.b * x]), name: other }]),
          explain: `가로축의 값이 ${t}일 때 두 그래프의 세로축의 값을 읽으면 ${who}의 그래프는 ${s.a * t}, ${other}의 그래프는 ${s.b * t}이다. 두 사람 사이의 거리는 ${s.a * t} − ${s.b * t} = ${(s.a - s.b) * t}(m)이다.`,
          facts: { value: `${s.a * t}-${s.b * t}` }
        });
      }
      const start = d.pick([10, 20]), t = d.pick([4, 6]), xs = [0, 2, 4, 6], A = xs.map((x) => [x, start + 10 * x]), Bp = xs.map((x) => [x, start + 5 * x]);
      return M(`물 100 g이 담긴 비커 A와 물 200 g이 담긴 비커 B에 같은 세기의 열을 가하였다. 다음은 열을 가한 지 ${vx}분 후의 물의 온도를 ${vy} °C라 하고 ${REL} 열을 가하기 전의 물의 온도는 몇 °C이고, 열을 가한 지 ${t}분 후 두 비커의 물의 온도의 차는 몇 °C인가?`,
        [{ label: '처음 온도', answer: start, unit: '°C' }, { label: '온도의 차', answer: 5 * t, unit: '°C' }], {
          figure: G('시간(분)', '온도(°C)', 6, start + 70, 2, 10, [{ pts: A, name: 'A' }, { pts: Bp, name: 'B' }]),
          explain: `열을 가하기 전의 온도는 ${nb(vx + ' = 0')}일 때의 ${vy}의 값이므로 ${start} °C이다. ${t}분 후 비커 A의 물은 ${start + 10 * t} °C, 비커 B의 물은 ${start + 5 * t} °C이므로 온도의 차는 ${start + 10 * t} − ${start + 5 * t} = ${5 * t}(°C)이다.`,
          facts: { calc: [[String(start), 0], [`${start + 10 * t}-${start + 5 * t}`, 1]] }
        });
    }, { count: 2 }),
    T('two-steepness', '가파르기로 빠르기를 견주어 그래프의 주인 찾기', '①70', (d) => {
      const tags = d.shuffle([0, 1, 2]), ask = d.int(0, 2), how = ['걸어서 간 사람', '자전거를 타고 간 사람', '버스를 타고 간 사람'], ends = [[20, 2.2], [14, 4.4], [7, 6]];
      const paths = [0, 1, 2].map((t) => ({ pts: [[0, 0], ends[tags.indexOf(t)]], name: LAB[t] }));
      return C(`세 사람이 같은 곳에서 동시에 출발하여 한 사람은 걸어서, 한 사람은 자전거를 타고, 한 사람은 버스를 타고 같은 길을 갔다. 버스가 가장 빠르고 걸어서 간 사람이 가장 느렸다. 다음 그래프의 ㉠, ㉡, ㉢은 시간에 따른 세 사람의 이동한 거리를 나타낸 것이다. ${how[ask]}의 그래프는?`, LAB.slice(0, 3), tags[ask], {
        figure: graph({ plain: true, w: 220, xname: '시간', yname: '이동한 거리', xmax: 23, ymax: 7, paths }),
        explain: `빠를수록 같은 시간에 이동한 거리가 많이 늘어나므로 그래프가 가파르다. 가장 가파른 ${LAB[tags[2]]}이 버스, 그다음으로 가파른 ${LAB[tags[1]]}이 자전거, 가장 완만한 ${LAB[tags[0]]}이 걸어서 간 사람의 그래프이다.`,
        facts: { truth: [0, 1, 2].map((t) => t === tags[ask]), want: true }
      });
    }),
    T('two-meet', '두 그래프가 만나는 때 읽기', '①71 심49', (d) => {
      const [who, other] = pair(d), s = d.pick([{ A: [[0, 0], [10, 4], [25, 4], [30, 6], [35, 8]], end: 40, top: 8, meets: [20, 30] }, { A: [[0, 0], [5, 3], [20, 3], [25, 5], [30, 7]], end: 35, top: 7, meets: [15, 25] }]), first = d.bool(), t = s.meets[first ? 0 : 1];
      return N(`${josa(who, '과/와')} ${name(other, '은/는')} 같은 곳에서 동시에 출발하여 같은 길을 따라 자전거를 탔다. 다음은 출발한 지 ${vx}분 후 출발한 곳으로부터 떨어진 거리를 ${vy} km라 하고 ${REL} 출발한 뒤 두 사람이 ${first ? '처음으로' : '두 번째로'} 다시 만나는 것은 출발한 지 몇 분 후인가?`, t, {
        unit: '분 후', figure: G('시간(분)', '거리(km)', s.end, s.top + 1, 5, 1, [{ pts: s.A, name: who }, { pts: range(0, s.end / 5).map((i) => [5 * i, i]), name: other }]),
        explain: `두 사람이 만나는 때에는 같은 시각에 같은 곳에 있으므로 두 그래프가 만난다. 두 그래프는 출발한 뒤 가로축의 값이 ${s.meets[0]}일 때와 ${s.meets[1]}일 때 만나므로 ${first ? '처음으로' : '두 번째로'} 다시 만나는 것은 ${t}분 후이다.`,
        facts: { calc: [[String(t), 0]] }
      });
    }),
    T('two-arrive', '두 그래프에서 같은 곳에 도착한 때의 차 구하기', '①72', (d) => {
      const [who, other] = pair(d), tA = d.pick([8, 12]), tB = d.pick([16, 20, 24]);
      return N(`${josa(who, '과/와')} ${name(other, '은/는')} 집에서 동시에 출발하여 4 km 떨어진 공원까지 같은 길을 따라갔다. 다음은 출발한 지 ${vx}분 후 집으로부터 떨어진 거리를 ${vy} km라 하고 ${REL} ${name(who, '이/가')} 공원에 도착한 지 몇 분 후에 ${name(other, '이/가')} 공원에 도착하였는가?`, tB - tA, {
        unit: '분 후', figure: G('시간(분)', '거리(km)', 24, 5, 4, 1, [{ pts: [[0, 0], [tA, 4]], name: who }, { pts: [[0, 0], [tB, 4]], name: other }]),
        explain: `공원은 집에서 4 km 떨어져 있으므로 세로축의 값이 4가 되는 때가 도착한 때이다. ${name(who, '은/는')} ${tA}분 후에, ${name(other, '은/는')} ${tB}분 후에 도착하였으므로 ${tB} − ${tA} = ${tB - tA}(분) 후이다.`,
        facts: { value: `${tB}-${tA}` }
      });
    }),
    T('two-chase', '늦게 떠나 따라잡는 두 그래프 읽기', '①73 수실력03 교125', (d) => {
      const [who, other] = pair(d), s = d.pick([{ A: [[0, 0], [20, 2], [30, 2], [50, 4], [60, 5]], B: [[30, 0], [50, 4], [60, 6]] }, { A: [[0, 0], [10, 1], [20, 1], [40, 3], [60, 5]], B: [[20, 0], [40, 3], [60, 6]] }, { A: [[0, 0], [10, 2], [30, 2], [50, 4], [60, 5]], B: [[30, 0], [50, 4], [60, 6]] }]);
      const t1 = s.A[1][0], t2 = s.A[2][0], [tm, dm] = s.B[1];
      return M(`${name(who, '은/는')} 집에서 출발하여 공원 쪽으로 걸어갔고, ${name(other, '은/는')} 얼마 뒤에 집에서 출발하여 자전거를 타고 같은 길을 따라갔다. 다음은 ${name(who, '이/가')} 출발한 지 ${vx}분 후 두 사람이 집으로부터 떨어진 거리를 ${vy} km라 하고 ${REL} ${name(who, '이/가')} 도중에 쉰 시간, 두 사람이 만난 곳과 집 사이의 거리, 두 사람이 만난 때를 차례로 구하시오.`,
        [{ label: '쉰 시간', answer: t2 - t1, unit: '분' }, { label: '거리', answer: dm, unit: 'km' }, { label: '만난 때', answer: tm, unit: '분 후' }], {
          figure: G('시간(분)', '거리(km)', 60, 6.5, 10, 1, [{ pts: s.A, name: who }, { pts: s.B, name: other }]),
          explain: `${who}의 그래프가 수평인 구간은 ${t1}분부터 ${t2}분까지이므로 쉰 시간은 ${t2} − ${t1} = ${t2 - t1}(분)이다. 두 그래프가 만나는 점의 좌표가 (${tm}, ${dm})이므로 두 사람은 ${name(who, '이/가')} 출발한 지 ${tm}분 후에 집에서 ${dm} km 떨어진 곳에서 만났다.`,
          facts: { calc: [[`${t2}-${t1}`, 0], [String(dm), 1], [String(tm), 2]] }
        });
    }),
    T('two-three', '세 그래프에 대한 설명 가리기', '①74', (d) => {
      // 틀린 문장: 처음에 가장 앞선 사람을 1등으로 읽은 것, 그래프가 가장 낮은 사람을 앞선 사람으로 읽은 것, 끝까지 가지 못한 그래프를 놓친 것, 도착한 때를 한 눈금 앞으로 읽은 것
      const [late, steady, fade] = d.shuffle(['A', 'B', 'C']), shape = { [late]: [[0, 0], [10, 1], [20, 4], [30, 5]], [steady]: [[0, 0], [10, 2], [20, 3], [30, 4], [40, 5]], [fade]: [[0, 0], [10, 3], [40, 4]] };
      const yes = [`출발한 지 10분 후에 가장 앞서 있는 학생은 ${fade}이다.`, `결승점에 가장 먼저 도착한 학생은 ${late}이다.`, `${fade}는 40분 동안 5 km를 다 달리지 못하였다.`, `${steady}는 출발한 지 40분 후에 결승점에 도착하였다.`];
      const no = [
        [`결승점에 가장 먼저 도착한 학생은 ${fade}이다.`, `처음에 가장 앞선 ${fade}는 40분 후에도 4 km 지점에 있고, ${late}가 30분 후에 가장 먼저 도착하였다.`, yes[1]],
        [`출발한 지 10분 후에 가장 앞서 있는 학생은 ${late}이다.`, `출발한 지 10분 후에 ${late}는 1 km를 달려 가장 뒤에 있고, ${fade}가 3 km를 달려 가장 앞서 있다.`, yes[0]],
        ['세 학생 모두 40분 안에 결승점에 도착하였다.', `${fade}는 40분 후에 4 km 지점에 있으므로 결승점에 도착하지 못하였다.`, yes[2]],
        [`${late}는 출발한 지 20분 후에 결승점에 도착하였다.`, `${late}는 출발한 지 20분 후에 4 km 지점에 있고, 30분 후에 결승점에 도착하였다.`]
      ];
      return claimFig(d, `세 학생 A, B, C가 동시에 출발하여 5 km를 달리는 대회에 참가하였다. 다음은 출발한 지 ${vx}분 후 출발한 곳으로부터의 거리를 ${vy} km라 하고 ${REL} 이 그래프에 대한 설명으로 옳은 것은?`,
        G('시간(분)', '거리(km)', 40, 5.6, 10, 1, ['A', 'B', 'C'].map((who) => ({ pts: shape[who], name: who }))), yes, no, true);
    }),
    T('rep-wave', '되풀이되는 그래프에서 가장 큰 값과 작은 값의 차, 되풀이되는 시간 읽기', '①75 수실력04', (d) => {
      const lo = d.pick([20, 40]), hi = lo + d.pick([60, 80]), P = d.pick([2, 4]), pts = range(0, 8).map((i) => [i * P / 2, i % 2 ? hi : lo]);
      return M(`다음은 소방차가 사이렌을 울릴 때, 사이렌을 울리기 시작한 지 ${vx}초 후의 소리의 크기를 ${vy} dB이라 하고 ${REL} 소리가 가장 클 때와 가장 작을 때의 크기의 차는 몇 dB이고, 소리는 몇 초마다 가장 커지는가?`,
        [{ label: '차', answer: hi - lo, unit: 'dB' }, { label: '간격', answer: P, unit: '초' }], {
          figure: G('시간(초)', '크기(dB)', 4 * P, hi + 20, P / 2, 20, [curve(pts)]),
          explain: `소리가 가장 클 때의 크기는 ${hi} dB, 가장 작을 때의 크기는 ${lo} dB이므로 차는 ${hi} − ${lo} = ${hi - lo}(dB)이다. 소리가 가장 큰 때는 ${P / 2}초, ${3 * P / 2}초, ${5 * P / 2}초, …이므로 ${P}초마다 같은 모양이 되풀이된다.`,
          facts: { calc: [[`${hi}-${lo}`, 0], [`${3 * P / 2}-${P / 2}`, 1]] }
        });
    }),
    T('rep-extend', '한 번 되풀이되는 시간으로 여러 번 되풀이하는 시간·횟수 구하기', '①76 심40·41', (d, n) => {
      // 첫째는 한 바퀴를 도는 동안의 그래프(산 모양의 꼭대기는 반 바퀴를 돈 때이다), 둘째는 되풀이되는 그래프의 일부를 보고 그림 밖까지 이어 센다.
      if (n === 0) {
        const who = d.pick(NAMES), end = d.pick([8, 12, 20]), D = d.pick([200, 300, 400]), k = d.int(3, 5), pts = [[0, 0], [end / 4, 0.7 * D], [end / 2, D], [3 * end / 4, 0.7 * D], [end, 0]];
        return N(`${name(who, '은/는')} 원 모양의 호수 둘레를 일정한 빠르기로 걸어 한 바퀴 돌았다. 다음은 출발한 지 ${vx}분 후 ${name(who, '이/가')} 있는 곳과 출발한 곳 사이의 거리를 ${vy} m라 하고 ${REL} 같은 빠르기로 호수 둘레를 ${k}바퀴 도는 데 걸리는 시간은 몇 분인가?`, k * end, {
          unit: '분', figure: G('시간(분)', '거리(m)', end, D + 100, end / 4, 100, [curve(pts)]),
          explain: `출발한 곳으로 돌아오면 출발한 곳과의 거리가 다시 0이 된다. 그래프에서 세로축의 값이 다시 0이 되는 때가 ${end}분이므로 한 바퀴 도는 데 ${end}분이 걸린다. 그래프가 가장 높은 ${end / 2}분은 출발한 곳에서 가장 멀리 있는 때, 곧 반 바퀴를 돈 때이다. ${k}바퀴 도는 데 걸리는 시간은 ${k} × ${end} = ${k * end}(분)이다.`,
          facts: { value: `${k}*${end}`, rule: 'one-lap' }
        });
      }
      const P = d.pick([8, 12, 20]), hi = d.pick([40, 60]), k = d.int(3, 5), pts = range(0, 4).map((i) => [i * P / 2, i % 2 ? hi : 0]);
      return N(`다음은 대관람차의 한 칸이 가장 낮은 곳에서 출발한 지 ${vx}분 후의 높이를 ${vy} m라 하고 ${vx}와 ${vy} 사이의 관계를 나타낸 그래프의 일부이다. 대관람차가 같은 빠르기로 계속 돌 때, 이 칸은 ${k * P}분 동안 모두 몇 바퀴 도는가?`, k, {
        unit: '바퀴', figure: G('시간(분)', '높이(m)', 2 * P, hi + 20, P / 4, 20, [curve(pts)]),
        explain: `한 바퀴 돌면 가장 낮은 곳으로 돌아오므로 높이가 다시 0이 된다. 그래프에서 같은 모양이 ${P}분마다 되풀이되므로 한 바퀴 도는 데 ${P}분이 걸린다. ${k * P}분 동안 ${k * P} ÷ ${P} = ${k}(바퀴) 돈다.`,
        facts: { value: `${k * P}/${P}`, rule: 'many-laps' }
      });
    }, { count: 2 }),
    T('rep-nth', '되풀이되는 그래프를 이어 몇 번째 때 구하기', '①75·76', (d) => {
      const [h, hi] = d.pick([[10, 100], [4, 60], [5, 80]]), k = d.int(3, 5), pts = range(0, 4).map((i) => [i * h, i % 2 ? hi : 0]), t = h + (k - 1) * 2 * h;
      return N(`다음은 드론이 땅에서 떠오른 지 ${vx}초 후의 높이를 ${vy} m라 하고 ${vx}와 ${vy} 사이의 관계를 나타낸 그래프의 일부이다. 드론이 같은 움직임을 되풀이할 때, 드론이 ${k}번째로 가장 높은 곳에 이르는 것은 땅에서 떠오른 지 몇 초 후인가?`, t, {
        unit: '초 후', figure: G('시간(초)', '높이(m)', 4 * h, hi + 20, h, 20, [pts]),
        explain: `드론은 ${h}초 후에 처음으로 가장 높은 곳에 이르고, 그 뒤로 ${2 * h}초마다 같은 모양이 되풀이된다. ${k}번째로 가장 높은 곳에 이르는 것은 ${h} + ${2 * h} × ${k - 1} = ${t}(초) 후이다.`,
        facts: { value: `${h}+(${k}-1)*${2 * h}`, unseen: [1] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
