// 중학교 2학년 2학기 6단원 경우의 수 — 실력 문항.
// 단원 틀·도구·싣는 기준·뺀 것과 까닭은 8-2-6a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 「서로 다른 경우」를 가르는 잣대를 놓친다: 서로 다른 동전 두 개의 (앞, 뒤)와 (뒤, 앞)을 한 가지로 세고, 거꾸로 동시에 뽑은 카드 두 장의 (1, 5)와 (5, 1)을 두 가지로 센다.
//    자격이 같은 두 명(경기를 하는 두 팀, 선분의 두 끝 점)을 차례까지 따져 두 배로 세고, 거꾸로 종류가 다른 것에서 하나씩 뽑을 때도 2로 나눈다.
//  - 무엇을 구별하는지 문제에서 읽지 않는다: 금액이 같으면 한 가지인데 동전의 개수마다 따로 세고, 켜진 개수만 보이는 신호를 손전등마다 따져 2를 거듭 곱한다.
//    상자가 서로 다르면 (1, 5)와 (5, 1)이 다른데 한 가지로 센다.
//  - 가위바위보에서 세 사람이 모두 다른 것을 내도 비긴다는 것을 빠뜨린다.
//  - 0이 낀 카드로 수를 만들 때 맨 앞자리에 0이 올 수 없다는 것, 그래서 일의 자리가 0인 경우와 아닌 경우의 가짓수가 다르다는 것을 놓친다.
//  - 이웃하지 않은 영역에는 같은 색을 다시 칠할 수 있다는 것을 놓쳐 4 × 3 × 2 × 1로 센다.
//
// 싣는 잣대: ① 문제의 상황에 함정이 있어 「서로 다른 경우」의 뜻을 정확히 대야 풀리는 것 ② 세 단계 넘게 이어 생각해야 풀리는 것(두세 갈래로 나누어 세고 더하기, 묶어서 세우고 묶음 안에서 바꾸기, 전체에서 빼기).
//  - ① coin-faces, rps3, pay-overlap, two-cards, league, chords, odd-sum, boxes, lamps
//  - ② zero-even, neighbors, color4, roads4, round-trip, dice-range, dice-multiple, dice-line, dice-ineq, pairs-groups, front, kth, same-kind, with-fixed, table, no-own, password
//  - 기본에 둔 것(안내문의 잣대 — 기본 문서에 여러 번 나오는 꼴, 두 단계를 잇는 것): 공배수가 겹치는 「또는」(①29, 세 문서), 0이 낀 카드로 두 자리 자연수 만들기(①54, 세 문서),
//    거쳐 가는 길과 곧바로 가는 길(①43, 세 문서), 자격이 같은 대표 2명을 그대로 묻는 것(①66·67), 「한 가지만」과 「각각 한 가지씩」을 나란히 묻는 것(심21).
//  - 답을 모두 수로 적는 문항이라 보기가 없다. 유형마다 「어떤 아이가 어떤 답을 적는가」를 주석으로 달았다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, frac, N } = B.kit;
  const { MINUS, range, tail, V, nb, poly, GE, LE } = B.kit.mid;
  const { STD, H, sum, hits, isPrime, DIE, PAIRS, perms, combos, cart, told, pairsTold, Q, QA, diamondRoads, region4Fig, REGION4, circlePoints, tbl, pickNames } = B.kit.m826;
  const UNIT = '8-2-6';
  const digitsOf = (row) => Number(row.join(''));
  const cardsTold = (digits) => `${told(digits)}의 숫자가 하나씩 적힌 카드 ${digits.length}장`;
  const numbersOf = (digits, r) => perms(digits, r).filter((row) => row[0] !== 0).map(digitsOf);
  // 처음 나온 것만 참으로 가린다(같은 금액·같은 신호는 한 번만 센다).
  const firstSeen = (list) => { const seen = new Set(); return list.map((v) => { if (seen.has(v)) return false; seen.add(v); return true; }); };
  const HANDS = ['가위', '바위', '보'];
  const beats = (x, y) => (HANDS.indexOf(x) - HANDS.indexOf(y) + 3) % 3 === 1;

  B.addGroup(UNIT, {
    id: 'hard', title: '실력 문제', standard: STD,
    types: [
      // ① 6 대신 3: (앞, 뒤)와 (뒤, 앞)을 한 가지로 센 아이. 8·12: 주사위에 없는 약수까지 센 아이.
      H('hard-rps3', '세 사람의 가위바위보', '①19 심25', (d, n) => {
        const who = pickNames(d, 3), all = cart([HANDS, HANDS, HANDS]), draw = (r) => new Set(r).size !== 2;
        if (n === 0) {
          const tie = d.bool();
          return Q(`${told(who)} 세 사람이 가위바위보를 한 번 할 때, ${tie ? '비기는' : '비기지 않는'} 경우의 수는?`, all.map((r) => draw(r) === tie),
            { explain: `세 사람이 모두 같은 것을 내는 경우는 3가지이다. 세 사람이 모두 다른 것을 내어도 비기고, 이 경우는 3 × 2 × 1 = 6(가지)이다. 따라서 비기는 경우의 수는 3 + 6 = 9이다.${tie ? '' : ' 모든 경우의 수는 3 × 3 × 3 = 27이므로 비기지 않는 경우의 수는 27 − 9 = 18이다.'}` });
        }
        const one = (r) => !draw(r) && r.filter((x) => r.some((y) => beats(x, y))).length === 1;
        return Q(`${told(who)} 세 사람이 가위바위보를 한 번 할 때, 한 사람만 이기는 경우의 수는?`, all.map(one),
          { explain: '이기는 한 사람을 정하는 경우가 3가지이다. 그 사람이 내는 것을 가위, 바위, 보 가운데 하나로 정하면 나머지 두 사람이 내는 것은 지는 것 하나로 정해진다. 따라서 3 × 3 = 9(가지)이다.' });
      }, { count: 2 }),
      // ① a × b: 동전의 개수가 다르면 다른 경우로 센 아이(100원 1개와 50원 2개가 같은 금액임을 놓친다).
      H('hard-pay-overlap', '낼 수 있는 금액의 가짓수 — 금액이 겹칠 때', '①22 심5', (d) => {
        const [a, c] = d.until(() => [d.int(3, 5), d.int(3, 5)], ([x, y]) => x !== y), all = cart([range(1, a), range(1, c)]), amounts = all.map(([i, j]) => 100 * i + 50 * j), kinds = [...new Set(amounts)].sort((x, y) => x - y);
        if (kinds.some((v, i) => i > 0 && v - kinds[i - 1] !== 50)) throw new Error('금액이 50원씩 이어지지 않는다');
        return Q(`100원짜리 동전 ${a}개와 50원짜리 동전 ${c}개가 있다. 두 종류의 동전을 각각 한 개 이상 사용하여 거스름돈 없이 지불할 수 있는 금액은 모두 몇 가지인가?`, firstSeen(amounts),
          { explain: `동전을 쓰는 방법은 ${a} × ${c} = ${a * c}(가지)이지만, 100원짜리 1개와 50원짜리 2개는 같은 금액이므로 방법이 달라도 금액이 같은 것이 있다. 지불할 수 있는 금액은 ${kinds[0]}원부터 ${kinds[kinds.length - 1]}원까지 50원씩 커지는 ${kinds.length}가지이다.` });
      }),
      // ① 두 배: 동시에 뽑은 두 장을 (1, 5), (5, 1)로 따로 센 아이. 한 가지 더: (3, 3)처럼 같은 수를 두 번 뽑은 아이.
      H('hard-two-cards', '동시에 뽑은 두 수의 합이 a 또는 b', '심19', (d) => {
        const N0 = d.pick([8, 9, 10]), all = combos(range(1, N0), 2), k = (s) => all.filter(([x, y]) => x + y === s).length;
        const [u, w] = d.until(() => d.shuffle(range(5, N0 + 3)).slice(0, 2).sort((x, y) => x - y), ([x, y]) => k(x) !== k(y) && (x % 2 === 0 || y % 2 === 0) && k(x) + k(y) <= 8), ok = ([x, y]) => x + y === u || x + y === w;
        return Q(`1부터 ${N0}까지의 자연수가 하나씩 적힌 카드 ${N0}장 가운데 동시에 2장을 뽑을 때, 카드에 적힌 두 수의 합이 ${u} 또는 ${w}인 경우의 수는?`, all.map(ok),
          { explain: `동시에 뽑으므로 뽑은 차례는 구별하지 않고, 같은 수가 적힌 카드는 없다. 합이 ${u}인 경우는 ${pairsTold(all.filter(([x, y]) => x + y === u))}의 ${k(u)}가지, 합이 ${w}인 경우는 ${pairsTold(all.filter(([x, y]) => x + y === w))}의 ${k(w)}가지이므로 ${k(u)} + ${k(w)} = ${k(u) + k(w)}(가지)이다.` });
      }),
      // ① n × (n − 1): 같은 경기를 두 번 센 아이.
      H('hard-league', '서로 한 번씩 하는 경기의 수', '심39', (d) => {
        const k = d.int(5, 8), ordered = perms(range(1, k), 2);
        return Q(`${k}개의 팀이 다른 모든 팀과 꼭 한 번씩 경기를 하려고 한다. 치러야 하는 경기는 모두 몇 번인가?`, ordered.map(([x, y]) => x < y),
          { unit: '번', explain: `한 팀은 다른 ${k - 1}개의 팀과 경기를 하므로 ${k} × ${k - 1} = ${josa(k * (k - 1), '으로/로')} 세면, 두 팀이 하는 한 경기를 두 번씩 센 것이다. 따라서 ${k * (k - 1)} ÷ 2 = ${k * (k - 1) / 2}(번)이다.`, facts: { calc: [[`${k}*(${k}-1)/2`, 0]], unseen: [1, 2] } });
      }),
      // ① n × (n − 1): 선분 AB와 선분 BA를 따로 센 아이.
      H('hard-chords', '원 위의 점을 이은 선분의 개수', '심40', (d) => {
        const k = d.int(5, 7), ordered = perms(range(1, k), 2);
        return Q(`그림과 같이 원 위에 서로 다른 점 ${k}개가 있다. 이 가운데 두 점을 이어 만들 수 있는 선분의 개수는?`, ordered.map(([x, y]) => x < y),
          { unit: '개', figure: circlePoints(k), explain: `한 점에서 다른 ${k - 1}개의 점으로 선분을 그을 수 있으므로 ${k} × ${k - 1} = ${josa(k * (k - 1), '으로/로')} 세면, 선분 AB와 선분 BA처럼 같은 선분을 두 번씩 센 것이다. 따라서 ${k * (k - 1)} ÷ 2 = ${k * (k - 1) / 2}(개)이다.` });
      }),
      // ① 절반: 홀수 카드와 짝수 카드에서 한 장씩 뽑는데도 2로 나눈 아이.
      H('hard-odd-sum', '합이 홀수가 되게 두 장 뽑기', '심41', (d) => {
        const N0 = d.pick([7, 8, 9]), all = combos(range(1, N0), 2), odds = range(1, N0).filter((v) => v % 2 === 1).length, evens = N0 - odds;
        return Q(`1부터 ${N0}까지의 자연수가 하나씩 적힌 카드 ${N0}장 가운데 동시에 2장을 뽑을 때, 카드에 적힌 두 수의 합이 홀수인 경우의 수는?`, all.map(([x, y]) => (x + y) % 2 === 1),
          { explain: `합이 홀수이려면 홀수가 적힌 카드 한 장과 짝수가 적힌 카드 한 장을 뽑아야 한다. 홀수는 ${odds}가지, 짝수는 ${evens}가지이고, 홀수 카드와 짝수 카드에서 따로 한 장씩 뽑는 것이므로 2로 나누지 않는다. 따라서 ${odds} × ${evens} = ${odds * evens}(가지)이다.` });
      }),
      // ① 절반쯤: 상자가 서로 다른데 (1, 5)와 (5, 1)을 한 가지로 센 아이. n + 1: 빈 상자가 있는 경우까지 센 아이.
      H('hard-lamps', '자리를 구별하지 못하는 신호', '①40', (d) => {
        const k = d.int(4, 7), all = cart(range(1, k).map(() => [0, 1])), on = all.map(sum);
        return Q(`손전등 ${k}개를 각각 켜거나 꺼서 신호를 보내려고 한다. 신호를 받는 사람은 켜진 손전등의 개수만 알 수 있고 어느 손전등이 켜졌는지는 알 수 없다. 받는 사람이 구별할 수 있는 신호는 모두 몇 가지인가? (단, 손전등을 모두 끈 것도 하나의 신호로 본다.)`, firstSeen(on),
          { explain: `받는 사람은 켜진 손전등의 개수만 구별하므로, 신호는 켜진 손전등이 0개, 1개, …, ${k}개인 것의 ${k + 1}가지이다. 손전등마다 켜고 끄는 것을 따져 2를 ${k}번 곱하면 구별할 수 없는 신호까지 세게 된다.` });
      }),
      // ② 일의 자리가 0인 경우와 아닌 경우로 나눈다. 틀린 답: 일의 자리 가짓수 × (전체 − 1) — 맨 앞에 0이 오는 것을 빼지 않은 아이.
      H('hard-zero-even', '0이 낀 카드로 짝수·홀수·5의 배수 만들기', '①56 ①57 심36', (d, n) => {
        if (n === 0) {
          const digits = d.pick([[0, 1, 2, 3], [0, 1, 2, 3, 4], [0, 2, 3, 5], [0, 1, 4, 5, 6]]), m = digits.length, all = numbersOf(digits, 2), ok = (v) => v % 2 === 0, ends = digits.filter((v) => v !== 0 && v % 2 === 0);
          return Q(`${cardsTold(digits)} 가운데 2장을 뽑아 두 자리 자연수를 만들 때, 만들 수 있는 짝수는 모두 몇 개인가?`, all.map(ok),
            { unit: '개', explain: `일의 자리 숫자가 0인 수는 십의 자리에 나머지 ${m - 1}가지가 올 수 있으므로 ${m - 1}개이다. 일의 자리 숫자가 ${told(ends)}인 수는 십의 자리에 0과 일의 자리의 숫자를 뺀 ${m - 2}가지가 올 수 있으므로 ${ends.length > 1 ? `${ends.length} × ${m - 2} = ${ends.length * (m - 2)}(개)` : `${m - 2}개`}이다. 따라서 ${m - 1} + ${ends.length * (m - 2)} = ${hits(all.map(ok))}(개)이다.` });
        }
        const [top, kind, test] = d.pick([[5, '5의 배수', (v) => v % 5 === 0], [6, '5의 배수', (v) => v % 5 === 0], [4, '홀수', (v) => v % 2 === 1], [4, '짝수', (v) => v % 2 === 0], [5, '짝수', (v) => v % 2 === 0]]);
        const digits = range(0, top), m = digits.length, all = numbersOf(digits, 3), ok = (v) => test(v), zero = test(0), ends = digits.filter((v) => v !== 0 && test(v)), a = (m - 1) * (m - 2), c = ends.length * (m - 2) * (m - 2);
        return Q(`0부터 ${top}까지의 숫자가 하나씩 적힌 카드 ${m}장 가운데 3장을 뽑아 세 자리 자연수를 만들 때, 만들 수 있는 ${kind}는 모두 몇 개인가?`, all.map(ok),
          { unit: '개', explain: (zero ? `일의 자리 숫자가 0인 수는 백의 자리에 ${m - 1}가지, 십의 자리에 남은 ${m - 2}가지가 올 수 있으므로 ${m - 1} × ${m - 2} = ${a}(개)이다. ` : '')
            + `일의 자리 숫자가 ${told(ends)}인 수는 백의 자리에 0과 일의 자리의 숫자를 뺀 ${m - 2}가지, 십의 자리에 남은 ${m - 2}가지가 올 수 있으므로 ${ends.length > 1 ? `${ends.length} × ` : ''}${m - 2} × ${m - 2} = ${c}(개)이다.` + (zero ? ` 따라서 ${a} + ${c} = ${a + c}(개)이다.` : '') });
      }, { count: 2 }),
      // ② 묶어서 세우고(1) 묶음 안에서 자리를 바꾼다(2). 틀린 답: 묶음 안의 자리 바꿈을 빠뜨린 절반.
      H('hard-neighbors', '정해진 두 사람이 이웃하여 서기', '①50 심32', (d) => {
        const k = d.pick([4, 5]), who = pickNames(d, k), all = perms(who, k), ok = (row) => Math.abs(row.indexOf(who[0]) - row.indexOf(who[1])) === 1, blocks = perms(range(1, k - 1), k - 1).length;
        return Q(`${told(who)}의 ${k}명을 한 줄로 세울 때, ${name(who[0], '과/와')} ${name(who[1], '이/가')} 이웃하여 서는 경우의 수는?`, all.map(ok),
          { explain: `${name(who[0], '과/와')} ${name(who[1], '을/를')} 한 묶음으로 보면 ${k - 1}개를 한 줄로 세우는 것이므로 ${range(1, k - 1).reverse().join(' × ')} = ${blocks}(가지)이다. 묶음 안에서 두 사람이 자리를 바꾸는 경우가 2가지이므로 ${blocks} × 2 = ${blocks * 2}(가지)이다.` });
      }),
      // ② 이웃이 많은 영역부터 차례로 칠한다. 틀린 답: 이웃하지 않은 A와 D에 같은 색을 쓸 수 있음을 놓쳐 모두 다른 색으로 센 것.
      H('hard-color4', '네 영역을 이웃끼리 다른 색으로 칠하기', '①74 심48', (d) => {
        const colors = ['빨강', '노랑', '파랑', '초록'].slice(0, d.pick([3, 4])), k = colors.length, all = cart(range(1, 4).map(() => range(0, k - 1))), ok = (row) => REGION4.near.every(([x, y]) => row[x] !== row[y]);
        return Q(`그림과 같이 A, B, C, D 네 영역으로 나누어진 도형을 ${told(colors)}의 ${k}가지 색으로 칠하려고 한다. 같은 색을 여러 번 사용할 수 있으나 이웃한 영역은 서로 다른 색으로 칠할 때, 칠하는 경우의 수는?`, all.map(ok),
          { figure: region4Fig(), explain: `B에 칠할 수 있는 색은 ${k}가지, C에는 B와 다른 ${k - 1}가지, A에는 B, C와 다른 ${k - 2}가지이다. D는 B, C와만 이웃하므로 B, C와 다른 ${k - 2}가지를 칠할 수 있다(A와 같은 색이어도 된다). 따라서 ${k} × ${k - 1} × ${k - 2} × ${k - 2} = ${hits(all.map(ok))}(가지)이다.` });
      }),
      // ② 두 갈래의 곱을 따로 구해 더한다. 틀린 답: 네 구간의 길의 수를 모두 곱하거나 모두 더한 것.
      H('hard-roads4', '경유지가 둘인 네 지점의 길', '①44', (d) => {
        const [ac, cb, ad, db] = d.until(() => [d.int(2, 3), d.int(2, 3), d.int(1, 3), d.int(2, 3)], (v) => v[0] * v[1] !== v[2] * v[3] && new Set(v).size >= 2);
        return QA('그림과 같이 네 도시 A, B, C, D를 잇는 도로가 있다. A 도시에서 출발하여 B 도시까지 가는 경우의 수는? (단, 한 번 지나간 도시는 다시 지나지 않는다.)', cart([range(1, ac), range(1, cb)]).length + cart([range(1, ad), range(1, db)]).length, `${ac}*${cb}+${ad}*${db}`,
          { figure: diamondRoads(ac, cb, ad, db), explain: `C 도시를 거쳐 가는 경우는 ${ac} × ${cb} = ${ac * cb}(가지)이고, D 도시를 거쳐 가는 경우는 ${ad} × ${db} = ${ad * db}(가지)이다. 두 경우는 동시에 일어나지 않으므로 ${ac * cb} + ${ad * db} = ${ac * cb + ad * db}(가지)이다.` });
      }),
      // ② 가는 길(곱)과 돌아오는 길(지난 길을 하나씩 뺀 곱)을 잇는다. 틀린 답: 돌아올 때도 같은 수로 곱한 것.
      H('hard-round-trip', '갔다가 지난 길을 피해 돌아오기', '①45', (d) => {
        const [a, c] = d.until(() => [d.int(2, 4), d.int(2, 4)], ([x, y]) => x !== y), all = cart([range(1, a), range(1, c), range(1, c), range(1, a)]).filter((r) => r[1] !== r[2] && r[0] !== r[3]);
        return QA(`A 지점에서 B 지점까지 가는 길이 ${a}가지, B 지점에서 C 지점까지 가는 길이 ${c}가지 있다. A 지점에서 출발하여 B 지점을 거쳐 C 지점까지 갔다가 다시 B 지점을 거쳐 A 지점으로 돌아올 때, 갈 때 지난 길은 다시 지나지 않고 돌아오는 경우의 수는?`, all.length, `${a}*${c}*(${c}-1)*(${a}-1)`,
          { explain: `갈 때는 ${a} × ${c} = ${a * c}(가지)이다. 돌아올 때 C 지점에서 B 지점까지는 갈 때 지난 길을 뺀 ${c - 1}가지, B 지점에서 A 지점까지는 ${a - 1}가지이다. 따라서 ${a} × ${c} × ${c - 1} × ${a - 1} = ${all.length}(가지)이다.`, facts: { unseen: [1] } });
      }),
      // ② 전체에서 양 끝 갈래를 뺀다(여러 값을 하나씩 더해도 된다).
      H('hard-dice-range', '두 주사위의 눈의 합이 어떤 범위에 드는 경우', '①34', (d) => {
        const [lo, hi] = d.pick([[4, 9], [5, 10], [4, 10], [3, 9], [5, 9], [6, 10]]), ok = ([a, c]) => a + c >= lo && a + c <= hi, low = PAIRS.filter(([a, c]) => a + c < lo).length, high = PAIRS.filter(([a, c]) => a + c > hi).length;
        return Q(`서로 다른 두 개의 주사위를 동시에 던질 때, 나오는 두 눈의 수의 합이 ${lo} 이상 ${hi} 이하인 경우의 수는?`, PAIRS.map(ok),
          { explain: `모든 경우의 수는 6 × 6 = 36이다. 합이 ${lo}보다 작은 경우는 ${low}가지, 합이 ${hi}보다 큰 경우는 ${high}가지이므로 36 − ${low} − ${high} = ${36 - low - high}(가지)이다.` });
      }),
      // ② 조건에 맞는 합을 모두 찾아 갈래마다 세어 더한다. 틀린 답: (1, 2)와 (2, 1)을 한 가지로 세거나 합이 2인 (1, 1)을 빠뜨린 것.
      H('hard-dice-multiple', '두 눈의 수의 합이 소수·배수', '심13', (d) => {
        const [word, test] = d.pick([['소수', isPrime], ['4의 배수', (v) => v % 4 === 0], ['3의 배수', (v) => v % 3 === 0], ['5의 배수', (v) => v % 5 === 0]]), vals = range(2, 12).filter(test), k = (s) => PAIRS.filter(([a, c]) => a + c === s).length, ok = ([a, c]) => test(a + c);
        return Q(`서로 다른 두 개의 주사위를 동시에 던질 때, 나오는 두 눈의 수의 합이 ${word}인 경우의 수는?`, PAIRS.map(ok),
          { explain: `두 눈의 수의 합은 2부터 12까지이고, 이 가운데 ${word}는 ${told(vals)}이다. 합이 ${told(vals)}인 경우의 수는 차례로 ${told(vals.map(k))}이므로 ${vals.map(k).join(' + ')} = ${hits(PAIRS.map(ok))}(가지)이다.` });
      }),
      // ② 조건을 a, b의 식으로 바꾸고(1) 식에 맞는 순서쌍을 찾아(2) 센다(3).
      H('hard-dice-line', '두 눈의 수로 정한 두 직선의 교점·방정식의 해', '①17 심14 심15', (d, n) => {
        const lead = `서로 다른 두 개의 주사위 A, B를 동시에 던져서 나오는 눈의 수를 각각 ${V('a')}, ${V('b')}라 할 때, `;
        if (n === 0) {
          // 두 직선 y = ax 와 y = cx ∓ b 의 교점의 x좌표가 k
          const [c, k] = d.until(() => [d.pick([-1, 4, 5]), d.int(1, 3)], ([s, r]) => { const m = PAIRS.filter(([a, e]) => (s === -1 ? e === r * (a + 1) : e === r * (s - a))).length; return m >= 2 && m <= 5; });
          const ok = ([a, e]) => (c === -1 ? e === k * (a + 1) : e === k * (c - a)), got = PAIRS.filter(ok);
          const second = c === -1 ? nb(`${V('y')} = ${MINUS}${V('x')} + ${V('b')}`) : nb(`${V('y')} = ${c}${V('x')} ${MINUS} ${V('b')}`);
          const rel = c === -1 ? nb(`${V('b')} = ${poly([[k, V('a')], [k, '']])}`) : nb(`${V('b')} = ${poly([[c * k, ''], [-k, V('a')]])}`);
          return Q(`${lead}두 일차함수 ${nb(`${V('y')} = ${V('a')}${V('x')}`)}, ${second}의 그래프의 교점의 ${V('x')}좌표가 ${k}인 경우의 수는?`, PAIRS.map(ok),
            { explain: `교점에서는 두 함수의 ${V('y')}의 값이 같다. ${nb(`${V('x')} = ${k}`)}${tail(k, '을/를')} 두 식에 넣어 같다고 놓으면 ${rel}이다. 이를 만족시키는 (${V('a')}, ${V('b')})는 ${pairsTold(got)}의 ${got.length}가지이다.` });
        }
        const ok = ([a, e]) => e % a === 0, per = DIE.map((a) => DIE.filter((e) => e % a === 0).length);
        return Q(`${lead}${V('x')}에 대한 방정식 ${nb(`${V('a')}${V('x')} ${MINUS} ${V('b')} = 0`)}의 해가 자연수인 경우의 수는?`, PAIRS.map(ok),
          { explain: `해는 ${nb(`${V('x')} = ${frac(V('b'), V('a'))}`)}이므로 ${V('b')}가 ${V('a')}의 배수이어야 한다. ${V('a')}가 1, 2, 3, 4, 5, 6일 때 ${V('b')}는 차례로 ${told(per)}가지이므로 ${per.join(' + ')} = ${sum(per)}(가지)이다.` });
      }, { count: 2 }),
      // ② b의 값마다 갈래를 나누어 a를 세고 더한다.
      H('hard-dice-ineq', '두 눈의 수가 일차부등식을 만족하는 경우', '①16', (d) => {
        const [p, q, up, c] = d.until(() => [d.int(1, 3), d.pick([-3, -2, -1, 1, 2]), d.bool(), d.int(1, 12)], ([x, y, u, v]) => {
          const got = PAIRS.filter(([a, e]) => (u ? x * a + y * e >= v : x * a + y * e <= v)), rows = new Set(got.map((r) => r[1])).size;
          return got.length >= 3 && got.length <= 8 && rows >= 2 && rows <= 3 && (y > 0) !== u && x !== Math.abs(y);
        });
        const ok = ([a, e]) => (up ? p * a + q * e >= c : p * a + q * e <= c), got = PAIRS.filter(ok), rows = DIE.filter((e) => got.some((r) => r[1] === e));
        return Q(`서로 다른 두 개의 주사위 A, B를 동시에 던져서 나오는 눈의 수를 각각 ${V('a')}, ${V('b')}라 할 때, ${nb(`${poly([[p, V('a')], [q, V('b')]])} ${up ? GE : LE} ${c}`)}${tail(c, '을/를')} 만족시키는 경우의 수는?`, PAIRS.map(ok),
          { explain: `${V('b')}의 값에 따라 나누어 센다. ${rows.map((e) => { const as = got.filter((r) => r[1] === e).map((r) => r[0]); return `${nb(`${V('b')} = ${e}`)}일 때 ${V('a')}는 ${told(as)}의 ${as.length}가지`; }).join(', ')}이고, ${V('b')}가 그 밖의 값일 때에는 없다. 따라서 ${rows.map((e) => got.filter((r) => r[1] === e).length).join(' + ')} = ${got.length}(가지)이다.` });
      }),
      // ② 요일의 짝 셋으로 나누어 곱하고 더한다. 틀린 답: 세 수를 모두 곱한 것(세 요일에서 하나씩), 전체에서 2개를 뽑은 것(같은 요일의 두 수업까지 센다).
      H('hard-pairs-groups', '묶음이 다른 것끼리 둘 고르기', '심22', (d) => {
        const [a, c, e] = d.until(() => [d.int(2, 5), d.int(2, 5), d.int(2, 5)], (v) => new Set(v).size === 3), days = ['월요일', '수요일', '금요일'], counts = [a, c, e];
        const classes = counts.reduce((all, k, i) => all.concat(range(1, k).map(() => i)), []), all = combos(range(0, classes.length - 1), 2), ok = ([x, y]) => classes[x] !== classes[y];
        return Q(`어느 학교의 방과 후 수업은 월요일에 ${a}개, 수요일에 ${c}개, 금요일에 ${e}개가 열리고, 수업은 모두 서로 다르다. 이 가운데 요일이 서로 다른 수업 2개를 골라 듣는 경우의 수는?`, all.map(ok),
          { explain: `월요일과 수요일의 수업을 하나씩 고르는 경우는 ${a} × ${c} = ${a * c}(가지), 월요일과 금요일은 ${a} × ${e} = ${a * e}(가지), 수요일과 금요일은 ${c} × ${e} = ${c * e}(가지)이다. 따라서 ${a * c} + ${a * e} + ${c * e} = ${a * c + a * e + c * e}(가지)이다.`, facts: { calc: [[`${a}*${c}+${a}*${e}+${c}*${e}`, 0]] } });
      }),
      // ② 맨 앞에 설 사람으로 두 갈래를 나누고, 갈래마다 남은 자리를 채운다.
      H('hard-front', '몇 명을 뽑아 세울 때 정해진 사람이 맨 앞', '심30', (d) => {
        const k = d.pick([4, 5]), who = pickNames(d, k), all = perms(who, 3), ok = (row) => row[0] === who[0] || row[0] === who[1], each = (k - 1) * (k - 2);
        return Q(`${told(who)}의 ${k}명 가운데 3명을 뽑아 한 줄로 세울 때, ${who[0]} 또는 ${name(who[1], '이/가')} 맨 앞에 서는 경우의 수는?`, all.map(ok),
          { explain: `${name(who[0], '이/가')} 맨 앞에 서면 나머지 두 자리에는 남은 ${k - 1}명 가운데 2명을 차례로 세우므로 ${k - 1} × ${k - 2} = ${each}(가지)이고, ${name(who[1], '이/가')} 맨 앞에 설 때도 ${each}가지이다. 두 경우는 동시에 일어나지 않으므로 ${each} + ${each} = ${2 * each}(가지)이다.` });
      }),
      // ② 백의 자리(첫 글자)마다의 개수로 건너뛴 뒤 차례로 적는다.
      H('hard-kth', '크기 순으로 k번째인 수·사전식으로 몇 번째', '심33 심38', (d, n) => {
        if (n === 0) {
          const digits = d.pick([[0, 1, 2, 3, 4], [1, 2, 3, 4], [0, 1, 2, 3], [1, 2, 3, 4, 5]]), all = numbersOf(digits, 3).sort((x, y) => x - y), block = all.filter((v) => Math.floor(v / 100) === Math.floor(all[0] / 100)).length;
          const r = d.until(() => block * d.int(1, 2) + d.int(2, 4), (v) => v <= all.length - 2), jump = Math.floor((r - 1) / block), heads = digits.filter((v) => v !== 0), next = all.slice(jump * block, r);
          // 다른 길: 100부터 999까지의 수를 하나씩 살펴 카드로 만들 수 있는 수만 센다.
          let alt = 0, left = r;
          for (let v = 100; v <= 999 && left > 0; v += 1) { const ds = String(v).split('').map(Number); if (new Set(ds).size === 3 && ds.every((x) => digits.includes(x))) { left -= 1; alt = v; } }
          return N(`${cardsTold(digits)} 가운데 3장을 뽑아 세 자리 자연수를 만들 때, 작은 수부터 차례로 ${r}번째인 수는?`, all[r - 1],
            { explain: `백의 자리 숫자가 정해지면 십의 자리와 일의 자리를 채우는 경우가 ${block}가지이므로, 백의 자리 숫자가 ${told(heads.slice(0, jump))}인 수가 ${jump * block}개이다. 이어서 백의 자리 숫자가 ${heads[jump]}인 수를 작은 것부터 적으면 ${told(next)}이므로 ${r}번째인 수는 ${all[r - 1]}이다.`, facts: { calc: [[String(alt), 0]], unseen: [alt] } });
        }
        const letters = ['a', 'b', 'c', 'd'], all = perms(letters, 4).map((row) => row.join('')), at0 = d.until(() => d.int(12, 23), (v) => v % 6 >= 1 && v % 6 <= 4), word = all[at0], jump = Math.floor(at0 / 6), next = all.slice(jump * 6, at0 + 1);
        const alt = all.filter((w) => w < word).length + 1;
        return N(`a, b, c, d의 네 문자를 모두 한 번씩 사용하여 만든 문자열을 사전에 실리는 차례대로 abcd부터 dcba까지 늘어놓을 때, ${word}는 몇 번째인가?`, at0 + 1,
          { unit: '번째', explain: `첫 문자가 정해지면 나머지 세 문자를 늘어놓는 경우가 3 × 2 × 1 = 6(가지)이므로, 첫 문자가 ${told(letters.slice(0, jump))}인 문자열이 ${jump * 6}개이다. 이어서 첫 문자가 ${letters[jump]}인 문자열을 차례로 적으면 ${told(next)}이므로 ${word}는 ${at0 + 1}번째이다.`, facts: { calc: [[String(alt), 0]], unseen: [alt] } });
      }, { count: 2 }),
      // ② 남학생끼리, 여학생끼리의 두 갈래로 나누고 갈래마다 「자격이 같은 2명」을 센다.
      H('hard-same-kind', '같은 쪽에서만 두 명 뽑기', '①68 심44', (d) => {
        const [a, c] = d.until(() => [d.int(3, 6), d.int(3, 6)], ([x, y]) => x !== y), people = range(1, a).map(() => 0).concat(range(1, c).map(() => 1)), all = combos(range(0, a + c - 1), 2), ok = ([x, y]) => people[x] === people[y];
        return Q(`남학생 ${a}명과 여학생 ${c}명 가운데 대표 2명을 뽑을 때, 뽑힌 2명의 성별이 같은 경우의 수는?`, all.map(ok),
          { explain: `남학생 ${a}명 가운데 2명을 뽑는 경우는 ${a} × ${a - 1} ÷ 2 = ${a * (a - 1) / 2}(가지), 여학생 ${c}명 가운데 2명을 뽑는 경우는 ${c} × ${c - 1} ÷ 2 = ${c * (c - 1) / 2}(가지)이다. 두 경우는 동시에 일어나지 않으므로 ${a * (a - 1) / 2} + ${c * (c - 1) / 2} = ${hits(all.map(ok))}(가지)이다.`, facts: { calc: [[`${a}*(${a}-1)/2+${c}*(${c}-1)/2`, 0]], unseen: [1, 2] } });
      }),
      // ② 꼭 넣는 것을 빼고(1) 나머지에서 2가지를 고르는 일로 바꾸어(2) 2로 나눈다(3).
      H('hard-with-fixed', '하나를 꼭 넣어 세 가지 고르기', '심43', (d) => {
        const k = d.int(6, 8), fruits = d.shuffle(['바나나', '사과', '배', '귤', '포도', '딸기', '키위', '망고']).slice(0, k), must = fruits[0], all = combos(fruits, 3), ok = (row) => row.includes(must);
        return Q(`${josa(must, '을/를')} 포함한 서로 다른 과일 ${k}가지 가운데 3가지를 골라 과일 주스를 만들려고 한다. ${josa(must, '을/를')} 반드시 넣는 경우의 수는?`, all.map(ok),
          { explain: `${josa(must, '은/는')} 이미 넣었으므로 나머지 ${k - 1}가지 가운데 2가지를 더 고르면 된다. 차례로 2가지를 고르면 ${k - 1} × ${k - 2} = ${(k - 1) * (k - 2)}(가지)이고, 고른 차례만 다른 것은 같은 경우이므로 ${(k - 1) * (k - 2)} ÷ 2 = ${(k - 1) * (k - 2) / 2}(가지)이다.` });
      }),
      // ② 표를 읽어 한 사람이 들어갈 모둠마다 갈래를 나누어 세고 더한다. 틀린 답: 도장의 개수가 같은 두 모둠까지 센 것.
      H('hard-table', '표의 수를 견주어 두 사람의 배정 세기', '심9', (d) => {
        const [A, Bn] = pickNames(d, 2), stamps = d.until(() => range(1, 5).map(() => d.int(2, 9)), (v) => new Set(v).size === 4), all = perms(range(0, 4), 2), ok = ([x, y]) => stamps[x] > stamps[y], per = stamps.map((v) => stamps.filter((w) => w < v).length);
        return Q(`다음은 어느 반의 다섯 모둠이 받은 칭찬 도장의 개수를 나타낸 표이다. 전학 온 두 학생 ${A}, ${name(Bn, '을/를')} 서로 다른 모둠에 한 명씩 넣을 때, ${name(A, '이/가')} 들어간 모둠의 도장이 ${name(Bn, '이/가')} 들어간 모둠의 도장보다 많은 경우의 수는?`, all.map(ok),
          { figure: tbl(['모둠', '도장의 개수(개)'], stamps.map((v, i) => [`${i + 1}모둠`, v])), explain: `${name(A, '이/가')} 들어가는 모둠마다 그 모둠보다 도장이 적은 모둠의 수를 세면 1모둠부터 차례로 ${told(per)}이다. 도장의 개수가 같은 두 모둠은 어느 쪽도 많지 않으므로 세지 않는다. 따라서 ${per.join(' + ')} = ${sum(per)}(가지)이다.` });
      }),
      // ② 한 사람이 가질 것으로 세 갈래를 나누고, 갈래마다 나뭇가지 모양의 그림으로 센다.
      H('hard-no-own', '아무도 제 것을 갖지 않는 경우', '심10', (d) => {
        const who = pickNames(d, 4), all = perms(range(0, 3), 4), ok = (row) => row.every((v, i) => v !== i), thing = d.pick(['선물', '우산', '공책']);
        const first = all.filter((row) => ok(row) && row[0] === 1).map((row) => `(${row.map((v) => who[v]).join(', ')})`);
        return Q(`${told(who)}의 4명이 각자 가져온 ${josa(thing, '을/를')} 한데 모아 놓고 하나씩 나누어 가질 때, 4명 모두 자기가 가져온 것이 아닌 ${josa(thing, '을/를')} 가지는 경우의 수는?`, all.map(ok),
          { explain: `${name(who[0], '이/가')} 가질 수 있는 것은 다른 세 사람의 것 3가지이다. ${name(who[0], '이/가')} ${who[1]}의 것을 가질 때, 네 사람이 가지는 ${thing}의 주인을 ${told(who)}의 차례로 적으면 ${first.join(', ')}의 ${first.length}가지이고, 다른 두 경우도 ${first.length}가지씩이다. 따라서 ${first.length} + ${first.length} + ${first.length} = ${3 * first.length}(가지)이다.` });
      }),
      // ② 쓸 수 있는 숫자를 가르고(1) 맨 앞자리(0 제외)와(2) 둘째 자리(0 포함)를(3) 따로 센다. 틀린 답: 둘째 자리에도 0을 뺀 것.
      H('hard-password', '조건이 붙은 비밀번호', '①63', (d) => {
        const [x, y] = d.until(() => [d.int(1, 9), d.int(1, 9)], ([p, q]) => p !== q), digits = range(0, 9), all = cart([digits, digits]), ok = ([p, q]) => p !== 0 && p !== q && ![x, y].includes(p) && ![x, y].includes(q);
        const heads = digits.filter((v) => v !== 0 && v !== x && v !== y).length;
        return Q(`0부터 9까지의 숫자 가운데 서로 다른 4개를 늘어놓아 네 자리 비밀번호를 만들려고 한다. 첫째 자리에는 0을 쓰지 않고, 셋째 자리에는 ${x}, 넷째 자리에는 ${josa(y, '을/를')} 쓰기로 할 때, 만들 수 있는 비밀번호는 모두 몇 가지인가?`, all.map(ok),
          { explain: `첫째 자리에는 0, ${[x, y].filter((v) => v !== 0).join(', ')}${tail([x, y].filter((v) => v !== 0).pop(), '을/를')} 뺀 ${heads}가지를 쓸 수 있다. 둘째 자리에는 0을 쓸 수 있으므로 ${josa(x, '과/와')} ${y}, 첫째 자리의 숫자를 뺀 7가지를 쓸 수 있다. 따라서 ${heads} × 7 = ${heads * 7}(가지)이다.` });
      })
    ]
  });
  // ── 기본 묶음에 덧붙이는 꼴 ──
  // 받으면서 실력에서 기본으로 내린 꼴: 기본에서 하는 일을 다시 묻거나 한 번에 풀리는 것.
  const TB = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 자료(' + ref + ')', make }, more || {});
  B.addTypes('8-2-6', 'and', [
    TB('and-coin-faces', '동전 두 개의 서로 다른 면과 주사위', '①38 심24', (d) => {
      const k = d.pick([8, 10, 12, 15, 20]), all = cart([['앞', '뒤'], ['앞', '뒤'], DIE]), ok = (r) => r[0] !== r[1] && k % r[2] === 0, got = DIE.filter((v) => k % v === 0);
      return Q(`서로 다른 동전 2개와 주사위 1개를 동시에 던질 때, 동전은 서로 다른 면이 나오고 주사위는 ${k}의 약수의 눈이 나오는 경우의 수는?`, all.map(ok),
        { explain: `서로 다른 동전 2개가 서로 다른 면이 나오는 경우는 (앞, 뒤), (뒤, 앞)의 2가지이다. ${k}의 약수의 눈은 ${told(got)}의 ${got.length}가지이다. 따라서 2 × ${got.length} = ${2 * got.length}(가지)이다.` });
    }),
    // ① 3: 모두 같은 것을 낼 때만 비긴다고 본 아이(모두 다른 것을 내는 6가지를 빠뜨린다). 한 사람만 이기는 경우 3: 이기는 사람만 정하고 내는 것을 정하지 않은 아이.
  ]);
  B.addTypes('8-2-6', 'event', [
    TB('event-boxes', '같은 물건을 서로 다른 두 곳에 나누어 담기', '심7', (d) => {
      const k = d.int(6, 10), all = range(0, k);
      return Q(`모양과 크기가 같은 구슬 ${k}개를 서로 다른 두 상자 A, B에 남김없이 나누어 담는 경우의 수는? (단, 빈 상자는 없다.)`, all.map((v) => v >= 1 && v <= k - 1),
        { explain: `구슬은 서로 구별하지 않으므로 상자마다 담는 개수만 정하면 된다. (A에 담는 개수, B에 담는 개수)는 (1, ${k - 1}), (2, ${k - 2}), …, (${k - 1}, 1)의 ${k - 1}가지이다. 두 상자가 서로 다르므로 (1, ${k - 1})${tail(k - 1, '과/와')} (${k - 1}, 1)은 다른 경우이다.` });
    }),
    // ① 2를 n번 곱한 수: 어느 손전등이 켜졌는지까지 구별한 아이.
  ]);

  // ── 다시 실은 꼴 ──
  // 처음 지을 때 「경우의 수는 두 경우의 수를 합하거나 곱하는 정도」라는 선, 꼬임·경우 따지기·여러 갈래라는 까닭으로 뺐던 꼴 가운데,
  // 하나씩 늘어놓거나 더하고 곱하여 중학교 2학년이 풀 수 있는 것을 다시 실었다(문제은행은 실력을 기르는 곳이므로 그런 문제도 싣는다).
  // 계승·순열·조합의 기호와 식, 같은 것이 있는 순열의 식은 쓰지 않는다. 세 개를 뽑는 셈은 「차례로 뽑은 뒤, 뽑은 차례만 다른 6가지를 하나로 센다」로 푼다.
  //  - ① 뜻: pay-three(쓰는 동전이 달라도 금액이 같으면 한 가지), split(주머니·더하는 차례를 구별하지 않는다), triangles(한 직선 위의 세 점으로는 삼각형이 되지 않는다)
  //  - ② 세 단계 넘게: even-triple, road-add, grid-path, alternate, own-seat, size3, three-multiple, isosceles, arc-shapes, sticks, share3, coin-walk, dice-walk, before,
  //    coprime, dice-intercepts, dice-cross, neighbors3
  //  - 기본에 둔 것(두 단계 안팎): pick-leave-one(뽑히지 않을 한 명을 정한다), shape-diameter(지름 하나마다 나머지 점 하나)
  //  - 그대로 뺀 것: 쌓기나무의 면 세기(①77 — 그림도 답도 모름), 네 자리 4의 배수(심37 — 4의 배수 판정법은 교육과정 밖), 둔각삼각형 세기(①70의 셋째 — 원주각은 3학년),
  //    이웃 관계만 알고 모양을 모르는 네 영역(심48의 은1-11 — 실린 color4와 하는 일도 같다).
  //  - 그림: 바둑판 모양의 길(①47 심27)은 쪽 그림이 없어, 풀이에 적힌 구간별 경우의 수(2, 3, 6)가 나오는 칸 수(가로 1~2칸, 세로 1~2칸)로 그렸다.
  //    반원 위의 점(①71 심45), 격자 모양의 점(심46)은 글과 풀이대로 그렸다(반원은 지름의 양 끝에 점을 두지 않는다).
  const { T, sg, pt, rowRoads } = B.kit.m826;
  const { gcd, tx } = B.kit.mid, RQ = B.kit.mid.Q;
  const { Board, at } = B.kit.mgeo;
  const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
  const mulSaid = (n) => range(1, n).reverse().join(' × ');
  const ORD = ['첫째', '둘째', '셋째', '넷째', '다섯째', '여섯째'];
  const co = (k) => (k === 1 ? '' : k);
  // 바둑판 모양의 길. w, h: 가로·세로 칸 수, via: 거쳐 갈 갈림목(A에서 오른쪽으로 몇 칸, 위쪽으로 몇 칸). A는 왼쪽 아래 모서리, C는 오른쪽 위 모서리이다.
  function gridRoads(w, h, via) {
    const b = Board(), s = 36, P = (x, y) => [x * s, (h - y) * s], pa = P(0, 0), pb = P(via[0], via[1]), pc = P(w, h);
    for (let x = 0; x <= w; x += 1) b.seg(P(x, 0), P(x, h));
    for (let y = 0; y <= h; y += 1) b.seg(P(0, y), P(w, y));
    b.dot(pa, 3.6).dot(pb, 3.6).dot(pc, 3.6);
    b.text([pa[0] - 13, pa[1] + 3], 'A', { plain: true }).text([pb[0] + 12, pb[1] + 13], 'B', { plain: true }).text([pc[0] + 13, pc[1] - 3], 'C', { plain: true });
    return b.svg(`바둑판 모양의 길 그림: 가로 길 ${h + 1}개와 세로 길 ${w + 1}개가 같은 간격으로 만나, 정사각형 칸이 가로로 ${w}칸, 세로로 ${h}칸 있다. A 지점은 왼쪽 아래 모서리, C 지점은 오른쪽 위 모서리에 있다. B 지점은 A 지점에서 오른쪽으로 ${via[0]}칸, 위쪽으로 ${via[1]}칸 간 갈림목에 있다.`);
  }
  // 반원. onArc: 호 위의 점의 수, onDia: 지름 위의 점의 수. 지름의 양 끝에는 점을 두지 않는다. 이름은 호 위의 점부터 A, B, …
  function halfCircle(onArc, onDia) {
    const b = Board(), c = [0, 0], R = 80, names = 'ABCDEFGH'.split('');
    b.arc(c, R, 0, 180).seg([-R, 0], [R, 0]);
    for (let i = 0; i < onArc; i += 1) { const a = 180 - 180 * (i + 1) / (onArc + 1); b.dot(at(c, R, a), 3.2).text(at(c, R + 12, a), names[i], { plain: true }); }
    for (let i = 0; i < onDia; i += 1) { const p = [-R + 2 * R * (i + 1) / (onDia + 1), 0]; b.dot(p, 3.2).text([p[0], 13], names[onArc + i], { plain: true }); }
    return b.svg(onDia
      ? `반원 그림: 반원의 호 위에 점 ${onArc}개(${names.slice(0, onArc).join(', ')}), 지름 위에 점 ${onDia}개(${names.slice(onArc, onArc + onDia).join(', ')})가 있다. 지름의 양 끝에는 점이 없다.`
      : `반원 그림: 반원의 호 위에 서로 다른 점 ${onArc}개(${names.slice(0, onArc).join(', ')})가 있다. 지름 위에는 점이 없다.`);
  }
  // 가로·세로로 같은 간격으로 놓인 점. rows 줄, 한 줄에 cols 개.
  function dotGrid(rows, cols) {
    const b = Board(), s = 40;
    for (let r = 0; r < rows; r += 1) for (let k = 0; k < cols; k += 1) b.dot([k * s, r * s], 3.6);
    return b.svg(`점 그림: 점 ${rows * cols}개가 가로로 ${cols}개씩 ${rows}줄로 놓여 있다. 가로와 세로의 간격은 모두 같다.`);
  }

  B.addTypes(UNIT, 'hard', [
    // ② 합과 한 수가 짝수(홀수)이므로 3의 배수 쪽의 짝·홀이 정해짐을 알아채고(1) 그런 3의 배수를 늘어놓아(2) 짝이 되는 수가 자연수인지 본다(3). 틀린 답: 3의 배수를 모두 센 것.
    H('hard-even-triple', '합이 정해진 짝수와 3의 배수', '①11', (d) => {
      const s = d.pick([25, 26, 28, 29, 31, 32, 34, 35, 37, 38, 40]), threes = range(1, Math.floor((s - 1) / 3)).map((k) => 3 * k), ok = (m) => (s - m) % 2 === 0 && s - m >= 2, got = threes.filter(ok), even = s % 2 === 0;
      return Q(`짝수인 자연수 한 개와 3의 배수인 자연수 한 개를 골라 더하였더니 ${s}${tail(s, '이/가')} 되었다. 두 수를 고르는 경우의 수는?`, threes.map(ok),
        { explain: `합 ${s}${tail(s, '이/가')} ${even ? '짝수' : '홀수'}이고 한 수가 짝수이므로 3의 배수는 ${even ? '짝수' : '홀수'}이어야 한다. ${s}보다 작은 3의 배수 가운데 ${even ? '짝수' : '홀수'}는 ${told(got)}이고, 이때 나머지 한 수는 차례로 ${told(got.map((m) => s - m))}의 짝수이다. 따라서 ${got.length}가지이다.` });
    }),
    // ①② (a + 1)(b + 1)(c + 1) − 1: 동전의 개수가 다르면 다른 금액으로 센 아이. 작은 동전으로 바꾸어 금액이 끊기지 않고 이어짐을 확인해야 한다.
    H('hard-pay-three', '낼 수 있는 금액의 가짓수 — 세 종류의 동전', '①22 ①23', (d) => {
      // 50원짜리가 2개 이상이어야 100원짜리 1개와 금액이 겹친다. 50원짜리와 100원짜리의 합이 450원 이상이어야 500원짜리를 섞어도 금액이 끊기지 않는다.
      const [a, c, e] = d.until(() => [d.int(2, 3), d.int(3, 5), d.int(2, 4)], ([x, y]) => 50 * x + 100 * y >= 450);
      const all = cart([range(0, e), range(0, c), range(0, a)]).filter((r) => sum(r) > 0), amounts = all.map(([k, j, i]) => 500 * k + 100 * j + 50 * i), small = 50 * a + 100 * c, top = small + 500 * e;
      if (new Set(amounts).size !== top / 50 || new Set(amounts).size === amounts.length) throw new Error('금액이 50원씩 이어지지 않거나 겹치는 금액이 없다');
      return Q(`50원짜리 동전 ${a}개, 100원짜리 동전 ${c}개, 500원짜리 동전 ${e}개가 있다. 이 동전을 한 개 이상 사용하여 거스름돈 없이 지불할 수 있는 금액은 모두 몇 가지인가?`, firstSeen(amounts),
        { explain: `50원짜리 2개와 100원짜리 1개처럼 쓰는 동전이 달라도 금액이 같으면 한 가지이다. 50원짜리와 100원짜리 동전만으로 50원부터 ${small}원까지 50원씩 커지는 금액을 모두 지불할 수 있다. 여기에 500원짜리 동전 1개를 더하면 500원부터 ${small + 500}원까지를 지불할 수 있어 앞의 금액과 끊기지 않고 이어지고, 500원짜리 동전을 더 쓸 때도 마찬가지이다. 지불할 수 있는 금액은 50원부터 ${top}원까지 50원씩 커지는 금액이므로 ${top} ÷ 50 = ${top / 50}(가지)이다.` });
    }),
    // ② 지금의 경우의 수를 구하고(1) 곳마다 길을 늘렸을 때의 식을 세워(2) 목표가 되는지 따져(3) 센다. 틀린 답: 바로 잇는 길만 생각한 1.
    H('hard-road-add', '길을 더 만들어 경우의 수 맞추기', '①46', (d) => {
      const [a, c, t] = d.until(() => [d.int(2, 4), d.int(2, 4), d.int(6, 20)], ([x, y, v]) => v > x * y && v - x * y <= 6 && ((v % y === 0) || (v % x === 0)));
      const made = [(k) => (a + k) * c, (k) => a * (c + k), (k) => a * c + k], cand = cart([[0, 1, 2], range(1, t)]), ok = ([s, k]) => made[s](k) === t;
      const side = (mine, other, here) => (t % other === 0
        ? `${here} 사이의 길을 ${t / other}가지로 늘리면 ${here === 'A와 B' ? `${t / other} × ${other}` : `${other} × ${t / other}`} = ${t}이므로 ${here} 사이에 ${t / other - mine}개를 만들면 된다.`
        : `${here} 사이에만 길을 만들면 경우의 수는 ${other}의 배수가 되는데, ${t}${tail(t, '은/는')} ${other}의 배수가 아니므로 ${here} 사이에 만들어서는 맞출 수 없다.`);
      return Q(`그림과 같이 A 지점에서 B 지점까지 가는 길이 ${a}가지, B 지점에서 C 지점까지 가는 길이 ${c}가지 있다. A 지점에서 C 지점까지 가는 경우의 수가 ${t}${tail(t, '이/가')} 되도록 A와 B 사이, B와 C 사이, A와 C 사이(B 지점을 거치지 않는 길) 가운데 한 곳에만 길을 더 만들려고 한다. 만들 곳과 만들 길의 수를 정하는 방법은 모두 몇 가지인가? (단, 한 번 지나간 지점은 다시 지나지 않는다.)`, cand.map(ok),
        { figure: rowRoads(['A', 'B', 'C'], a, c, 0), explain: `지금은 A 지점에서 C 지점까지 가는 경우의 수가 ${a} × ${c} = ${a * c}이다. ${side(a, c, 'A와 B')} ${side(c, a, 'B와 C')} A와 C를 바로 잇는 길은 ${t - a * c}개를 만들면 ${a * c} + ${t - a * c} = ${t}이다. 따라서 ${hits(cand.map(ok))}가지이다.` });
    }),
    // ② 거쳐 갈 지점에서 길을 둘로 끊고(1) 구간마다 갈림목까지의 경우의 수를 더해 가며 세어(2, 3) 곱한다(4). 틀린 답: B를 거치지 않는 길까지 센 것.
    H('hard-grid-path', '한 지점을 거쳐 최단 거리로 가기', '①47 심27', (d) => {
      const SIZES = [[1, 1], [2, 1], [1, 2], [2, 2]];
      const [[p, q], [r, s]] = d.until(() => [d.pick(SIZES), d.pick(SIZES)], ([x, y]) => x[0] + x[1] + y[0] + y[1] >= 5 && (x[0] !== y[0] || x[1] !== y[1]));
      const w = p + r, h = q + s, all = combos(range(0, w + h - 1), w), ok = (rights) => rights.filter((i) => i < p + q).length === p;
      const n1 = combos(range(0, p + q - 1), p).length, n2 = combos(range(0, r + s - 1), r).length;
      return Q('그림과 같이 바둑판 모양의 길이 있다. A 지점에서 출발하여 B 지점을 거쳐 C 지점까지 최단 거리로 가는 경우의 수는?', all.map(ok),
        { figure: gridRoads(w, h, [p, q]), explain: `최단 거리로 가려면 오른쪽과 위쪽으로만 가야 한다. A 지점에서 B 지점까지는 오른쪽으로 ${p}칸, 위쪽으로 ${q}칸을 가야 하고, 갈림목마다 그곳까지 가는 경우의 수(왼쪽 갈림목과 아래쪽 갈림목까지의 경우의 수의 합)를 적어 가면 ${n1}가지이다. 같은 방법으로 B 지점에서 C 지점까지는 오른쪽으로 ${r}칸, 위쪽으로 ${s}칸을 가는 ${n2}가지이다. 따라서 ${n1} × ${n2} = ${n1 * n2}(가지)이다.` });
    }),
    // ② 자리를 두 갈래로 가르고(1) 남학생끼리·여학생끼리 따로 세워 곱한 뒤(2, 3) 맨 앞에 설 수 있는 쪽을 따진다(4). 틀린 답: 수가 같을 때 2배를 빠뜨린 것, 수가 다를 때 2배를 한 것.
    H('hard-alternate', '남학생과 여학생이 번갈아 서기', '①51', (d) => {
      const [a, c] = d.pick([[3, 3], [3, 2], [2, 3]]), n = a + c, kind = (i) => (i < a ? 0 : 1), all = perms(range(0, n - 1), n), ok = (row) => row.every((v, i) => i === 0 || kind(v) !== kind(row[i - 1]));
      const odd = range(0, n - 1).filter((i) => i % 2 === 0).map((i) => ORD[i]).join(', '), each = fact(a) * fact(c);
      const more = a > c ? ['남학생', a, '여학생', c] : ['여학생', c, '남학생', a];
      return Q(`남학생 ${a}명과 여학생 ${c}명을 한 줄로 세울 때, 남학생과 여학생이 번갈아 서는 경우의 수는?`, all.map(ok),
        { explain: a === c
          ? `남학생이 맨 앞에 서면 남학생은 ${odd} 자리에 서고 여학생은 그 사이사이에 선다. 남학생 ${a}명을 세우는 경우가 ${mulSaid(a)} = ${fact(a)}(가지), 여학생 ${c}명을 세우는 경우가 ${fact(c)}가지이므로 ${fact(a)} × ${fact(c)} = ${each}(가지)이다. 여학생이 맨 앞에 설 때도 ${each}가지이므로 ${each} + ${each} = ${2 * each}(가지)이다.`
          : `${more[0]}이 ${more[2]}보다 한 명 많으므로 ${more[0]}이 ${odd} 자리에 서야 번갈아 설 수 있다. ${more[0]} ${more[1]}명을 세우는 경우가 ${mulSaid(more[1])} = ${fact(more[1])}(가지), ${more[2]} ${more[3]}명을 그 사이사이에 세우는 경우가 ${mulSaid(more[3])} = ${fact(more[3])}(가지)이므로 ${fact(more[1])} × ${fact(more[3])} = ${each}(가지)이다.` });
    }),
    // ② 제 번호에 앉을 사람을 정하고(1) 나머지가 모두 어긋나게 앉는 경우를 늘어놓아(2) 곱한다(3). 틀린 답: 나머지를 아무렇게나 앉힌 것(제 번호에 앉는 사람이 더 생긴다).
    H('hard-own-seat', '제 번호의 의자에 몇 명만 앉기', '①52 심11', (d) => {
      const [n, k] = d.pick([[5, 2], [4, 1], [4, 2], [5, 3]]), all = perms(range(1, n), n), ok = (row) => row.filter((v, i) => v === i + 1).length === k, rest = n - k;
      const chosen = k === 1 ? n : n * (n - 1) / 2, wrong = rest === 2 ? 1 : 2;
      const pickSaid = k === 1 ? `자기 번호의 의자에 앉는 1명을 정하는 경우는 ${n}가지이다.` : k === 2 ? `자기 번호의 의자에 앉는 2명을 정하는 경우는 ${n} × ${n - 1} ÷ 2 = ${chosen}(가지)이다.` : `자기 번호의 의자에 앉는 ${k}명을 정하는 것은 그렇지 않은 2명을 정하는 것과 같으므로 ${n} × ${n - 1} ÷ 2 = ${chosen}(가지)이다.`;
      const restSaid = rest === 2 ? '나머지 2명이 모두 다른 번호의 의자에 앉는 경우는 서로 의자를 바꾸어 앉는 1가지이다.' : '나머지 3명이 모두 다른 번호의 의자에 앉는 경우는 2가지이다(1번, 2번, 3번 학생이 남았다면 차례로 2번, 3번, 1번 의자 또는 3번, 1번, 2번 의자에 앉는다).';
      return Q(`1번부터 ${n}번까지의 번호가 하나씩 적힌 의자 ${n}개가 있다. 1번부터 ${n}번까지의 번호표를 하나씩 받은 학생 ${n}명이 의자에 한 명씩 앉을 때, 자기 번호표와 같은 번호의 의자에 앉는 학생이 ${k}명뿐인 경우의 수는?`, all.map(ok),
        { explain: `${pickSaid} ${restSaid} 따라서 ${chosen} × ${wrong} = ${chosen * wrong}(가지)이다.` });
    }),
    // ② 백의 자리가 같은 수를 십의 자리로 다시 가르고(1, 2) 백의 자리가 큰(작은) 수를 통째로 세어(3) 더한다(4).
    H('hard-size3', '크기 조건이 붙은 세 자리 수', '①59', (d) => {
      const digits = d.pick([[1, 2, 3, 4, 5], [1, 2, 3, 4, 6], [2, 3, 4, 5, 7], [1, 3, 4, 5, 6]]), all = numbersOf(digits, 3), up = d.bool();
      const parts = (m) => { const h0 = Math.floor(m / 100), t0 = Math.floor(m / 10) % 10, cmp = (v) => (up ? v > m : v < m); return { h0, t0, same: all.filter((v) => Math.floor(v / 10) === Math.floor(m / 10) && cmp(v)), tens: digits.filter((x) => x !== h0 && (up ? x > t0 : x < t0)), heads: digits.filter((x) => (up ? x > h0 : x < h0)) }; };
      const m = d.until(() => d.pick(all), (v) => { const g = parts(v); return g.heads.length >= 1 && g.heads.length <= 3 && g.tens.length >= 1 && g.same.length + 3 * g.tens.length <= 9; });
      const g = parts(m), ok = (v) => (up ? v > m : v < m), word = up ? '큰' : '작은', a = g.same.length, c = 3 * g.tens.length, e = 12 * g.heads.length;
      return Q(`${cardsTold(digits)} 가운데 3장을 뽑아 세 자리 자연수를 만들 때, ${m}보다 ${word} 수의 개수는?`, all.map(ok),
        { unit: '개', explain: `백의 자리 숫자가 ${g.h0}인 수부터 센다. 십의 자리 숫자가 ${g.t0}인 수 가운데 ${m}보다 ${word} 수는 ${a ? `${told(g.same)}의 ${a}개이다` : '없다'}. 십의 자리 숫자가 ${told(g.tens)}인 수는 일의 자리에 남은 3가지가 올 수 있으므로 ${g.tens.length > 1 ? `${g.tens.length} × 3 = ${c}(개)` : '3개'}이다. 백의 자리 숫자가 ${told(g.heads)}인 수는 모두 ${m}보다 ${up ? '크고' : '작고'}, 그 개수는 ${g.heads.length > 1 ? `${g.heads.length} × 4 × 3` : '4 × 3'} = ${e}(개)이다. 따라서 ${(a ? [a, c, e] : [c, e]).join(' + ')} = ${a + c + e}(개)이다.` });
    }),
    // ② 십의 자리 숫자마다 갈래를 나누어 3의 배수를 늘어놓고(여러 갈래) 더한다. 틀린 답: 33, 66처럼 같은 카드를 두 번 쓴 수까지 센 것.
    H('hard-three-multiple', '카드 두 장으로 만든 두 자리 수가 3의 배수인 경우', '①60', (d) => {
      const top = d.int(6, 9), digits = range(1, top), all = numbersOf(digits, 2), ok = (v) => v % 3 === 0, rows = digits.map((h0) => all.filter((v) => Math.floor(v / 10) === h0 && ok(v)));
      return Q(`1부터 ${top}까지의 자연수가 하나씩 적힌 카드 ${top}장 가운데 2장을 뽑아 두 자리 자연수를 만들 때, 3의 배수의 개수는?`, all.map(ok),
        { unit: '개', explain: `십의 자리 숫자마다 3의 배수를 적는다. ${rows.map((list, i) => `십의 자리 숫자가 ${i + 1}인 것은 ${told(list)}의 ${list.length}개`).join(', ')}이다. 33처럼 같은 숫자를 두 번 쓰는 수는 만들 수 없다. 따라서 ${rows.map((list) => list.length).join(' + ')} = ${hits(all.map(ok))}(개)이다.` });
    }),
    // ② 모양에 따라 갈래를 나누어(이웃한 세 점, 한 점씩 건너뛴 세 점 …) 빠짐없이, 겹치지 않게 센다. 틀린 답: 꼭짓점마다 센 것을 그대로 더해 정삼각형을 세 번 센 12.
    H('hard-isosceles', '원 위의 점으로 만드는 이등변삼각형', '①70', (d) => {
      const n = d.pick([6, 8]), all = combos(range(0, n - 1), 3), gap = (i, j) => Math.min(Math.abs(i - j), n - Math.abs(i - j)), ok = ([x, y, z]) => new Set([gap(x, y), gap(y, z), gap(x, z)]).size < 3;
      return Q(`그림과 같이 원 위에 같은 간격으로 점 ${n}개가 있다. 이 가운데 세 점을 꼭짓점으로 하는 삼각형을 만들 때, 이등변삼각형의 개수는?${n === 6 ? ' (단, 정삼각형도 이등변삼각형이다.)' : ''}`, all.map(ok),
        { unit: '개', figure: circlePoints(n), explain: n === 6
          ? '점 사이의 간격이 같으므로 건너뛴 칸 수가 같은 두 점을 이은 선분의 길이는 같다. 이웃한 세 점을 이은 삼각형 ABC, BCD, CDE, DEF, EFA, FAB의 6개는 두 변의 길이가 같다. 한 점씩 건너뛴 세 점을 이은 삼각형 ACE, BDF의 2개는 정삼각형이다. 그 밖의 삼각형은 세 변의 길이가 모두 다르다. 따라서 6 + 2 = 8(개)이다.'
          : '점 사이의 간격이 같으므로 건너뛴 칸 수가 같은 두 점을 이은 선분의 길이는 같다. 길이가 같은 두 변이 만나는 꼭짓점을 A로 하는 이등변삼각형은 A에서 같은 칸 수만큼 떨어진 두 점을 고른 삼각형 ABH, ACG, ADF의 3개이다. 점 8개마다 3개씩이고 정삼각형은 없어 겹쳐 센 것이 없으므로 8 × 3 = 24(개)이다.' });
    }),
    // ② 삼각형(세 점)과 사각형(네 점)을 따로 세어(1, 2) 더한다(3). 세 점·네 점을 고르는 셈은 「꼭짓점이 아닌 점」을 정하는 것으로 바꾸면 쉽다.
    H('hard-arc-shapes', '반원 위의 점으로 삼각형 또는 사각형 만들기', '①71', (d) => {
      const n = d.pick([5, 6]), all = cart(range(1, n).map(() => [0, 1])), ok = (row) => sum(row) === 3 || sum(row) === 4, tri = combos(range(1, n), 3).length, quad = combos(range(1, n), 4).length;
      return Q(`그림과 같이 반원의 호 위에 서로 다른 점 ${n}개가 있다. 이 가운데 세 점을 꼭짓점으로 하는 삼각형 또는 네 점을 꼭짓점으로 하는 사각형을 만드는 경우의 수는?`, all.map(ok),
        { figure: halfCircle(n, 0), explain: '호 위의 점은 어느 세 점도 한 직선 위에 있지 않으므로 세 점을 고르면 삼각형, 네 점을 고르면 사각형이 하나씩 정해진다. '
          + (n === 5 ? '삼각형은 꼭짓점이 아닌 두 점을 정하는 것과 같으므로 5 × 4 ÷ 2 = 10(가지), 사각형은 꼭짓점이 아닌 한 점을 정하는 것과 같으므로 5가지이다.' : '세 점을 차례로 뽑는 경우는 6 × 5 × 4 = 120(가지)이고 뽑은 차례만 다른 3 × 2 × 1 = 6(가지)씩은 같은 삼각형이므로 삼각형은 120 ÷ 6 = 20(가지)이다. 사각형은 꼭짓점이 아닌 두 점을 정하는 것과 같으므로 6 × 5 ÷ 2 = 15(가지)이다.')
          + ` 두 사건은 동시에 일어나지 않으므로 ${tri} + ${quad} = ${tri + quad}(가지)이다.` });
    }),
    // ① 세 점을 고르기만 하면 삼각형이라고 본 아이(한 직선 위의 세 점까지 센다). 차례 1: 반원의 지름 위의 점, 차례 2: 격자 모양으로 놓인 점(대각선 위의 세 점을 빠뜨리기 쉽다).
    H('hard-triangles', '한 직선 위의 세 점을 빼고 삼각형 세기', '심45 심46', (d, n) => {
      if (n === 0) {
        const [a, c] = d.pick([[4, 3], [5, 3], [3, 3], [4, 2], [5, 2]]), pts = range(1, c).map(() => 0).concat(range(1, a).map(() => 1)), all = combos(range(0, a + c - 1), 3), ok = (row) => row.some((i) => pts[i] === 0);
        const two = c * (c - 1) / 2, pair = a * (a - 1) / 2, list = (c >= 3 ? [1] : []).concat([two * a, c * pair]);
        return Q(`그림과 같이 반원의 호 위에 점 ${c}개, 지름 위에 점 ${a}개가 있다. 이 ${a + c}개의 점 가운데 세 점을 꼭짓점으로 하는 삼각형의 개수는?`, all.map(ok),
          { unit: '개', figure: halfCircle(c, a), explain: `한 직선 위에 있는 세 점으로는 삼각형을 만들 수 없으므로 지름 위의 점만 3개 고를 수는 없다. 호 위의 점을 몇 개 고르는가에 따라 나눈다. ${c >= 3 ? '호 위의 점 3개를 모두 고르는 경우는 1가지이다. ' : ''}호 위의 점 2개를 고르는 경우는 ${c === 3 ? '3 × 2 ÷ 2 = 3(가지)' : '1가지'}이고 그때마다 지름 위의 점 1개를 고르는 경우가 ${a}가지이므로 ${two} × ${a} = ${two * a}(가지)이다. 호 위의 점 1개를 고르는 경우는 ${c}가지이고 그때마다 지름 위의 점 2개를 고르는 경우가 ${a} × ${a - 1} ÷ 2 = ${pair}(가지)이므로 ${c} × ${pair} = ${c * pair}(가지)이다. 따라서 ${list.join(' + ')} = ${sum(list)}(개)이다.` });
      }
      const [rows, cols] = d.pick([[3, 3], [2, 3], [2, 4]]), k = rows * cols, pts = cart([range(0, rows - 1), range(0, cols - 1)]), all = combos(pts, 3), ok = ([p, q, r]) => (q[0] - p[0]) * (r[1] - p[1]) !== (q[1] - p[1]) * (r[0] - p[0]);
      const total = k * (k - 1) * (k - 2) / 6, flat = total - hits(all.map(ok));
      const lineSaid = rows === 3 ? '가로줄 3개, 세로줄 3개, 대각선 2개의 8가지' : cols === 3 ? '가로줄 2개의 2가지' : '가로줄마다 점 4개 가운데 빠질 한 점을 정하는 4가지씩, 모두 8가지';
      return Q(`그림과 같이 점 ${k}개가 가로, 세로로 같은 간격으로 놓여 있다. 이 가운데 세 점을 꼭짓점으로 하는 삼각형의 개수는?`, all.map(ok),
        { unit: '개', figure: dotGrid(rows, cols), explain: `세 점을 차례로 뽑는 경우는 ${k} × ${k - 1} × ${k - 2} = ${k * (k - 1) * (k - 2)}(가지)이고, 뽑은 차례만 다른 3 × 2 × 1 = 6(가지)씩은 같은 경우이므로 세 점을 고르는 경우는 ${k * (k - 1) * (k - 2)} ÷ 6 = ${total}(가지)이다. 이 가운데 세 점이 한 직선 위에 있는 경우는 ${lineSaid}이고, 이때는 삼각형이 만들어지지 않는다. 따라서 ${total} − ${flat} = ${total - flat}(개)이다.` });
    }, { count: 2 }),
    // ② 세 개를 고르는 10가지를 늘어놓고(1) 가장 긴 변과 나머지 두 변의 합을 견주어(2) 거른다(3). 틀린 답: 두 변의 합이 가장 긴 변과 같은 것까지 센 것.
    H('hard-sticks', '막대 세 개로 삼각형 만들기', '①72', (d) => {
      const L = d.until(() => d.shuffle(range(2, 9)).slice(0, 5).sort((x, y) => x - y), (v) => { const rows = combos(v, 3), k = rows.filter(([x, y, z]) => x + y > z).length; return k >= 5 && k <= 8 && rows.some(([x, y, z]) => x + y === z); });
      const all = combos(L, 3), ok = ([x, y, z]) => x + y > z, bad = all.filter((r) => !ok(r));
      return Q(`길이가 ${L.map((v) => v + ' cm').join(', ')}인 막대가 한 개씩 있다. 이 가운데 3개를 골라 삼각형을 만드는 경우의 수는? (단, 막대를 자르거나 구부리지 않는다.)`, all.map(ok),
        { explain: `삼각형이 만들어지려면 가장 긴 변의 길이가 나머지 두 변의 길이의 합보다 작아야 한다. 막대 3개를 고르는 경우는 모두 10가지이고, 이 가운데 세 막대의 길이가 ${pairsTold(bad)}인 ${bad.length}가지는 삼각형이 만들어지지 않는다(두 변의 길이의 합이 가장 긴 변의 길이와 같아도 만들어지지 않는다). 따라서 10 − ${bad.length} = ${10 - bad.length}(가지)이다.` });
    }),
    // ② 한 사람이 받는 개수로 갈래를 나누어(여러 갈래) 나머지 두 사람의 개수를 늘어놓고 더한다. 틀린 답: 받는 사람을 구별하지 않고 개수의 묶음만 센 것.
    H('hard-share3', '같은 물건을 세 사람에게 나누어 주기', '①75 심8', (d) => {
      const n = d.int(5, 7), who = pickNames(d, 3), [thing, u] = d.pick([['사탕', '개'], ['연필', '자루'], ['공책', '권']]), all = cart([range(1, n - 2), range(1, n - 2)]), ok = ([x, y]) => n - x - y >= 1, per = range(1, n - 2).map((x) => n - 1 - x);
      return Q(`모양과 크기가 같은 ${thing} ${n}${u}${pt(u, '을/를')} ${told(who)}의 세 명에게 남김없이 나누어 주려고 한다. 세 명 모두 한 ${u} 이상 받도록 나누어 주는 경우의 수는?`, all.map(ok),
        { explain: `${josa(thing, '은/는')} 서로 구별하지 않으므로 세 명이 받는 수만 정하면 되고, 받는 사람이 다르면 다른 경우이다. ${name(who[0], '이/가')} 받는 수가 ${told(range(1, n - 2).map((x) => x + u))}일 때 나머지 두 명이 나누어 받는 경우는 차례로 ${told(per)}가지이다. 따라서 ${per.join(' + ')} = ${sum(per)}(가지)이다.` });
    }),
    // ① 주머니(더하는 차례)를 구별하여 (1, 2, 6)과 (2, 1, 6)을 따로 센 아이. 작은 수부터 적어 빠짐없이, 겹치지 않게 늘어놓는다.
    H('hard-split', '구별하지 않는 묶음으로 나누기', '①76 심6', (d, n) => {
      if (n === 0) {
        const k = d.int(7, 10), all = cart([range(1, k), range(1, k)]), ok = ([x, y]) => x <= y && y <= k - x - y, got = all.filter(ok).map(([x, y]) => [x, y, k - x - y]);
        return Q(`모양과 크기가 같은 구슬 ${k}개를 모양과 크기가 같은 주머니 3개에 남김없이 나누어 담으려고 한다. 주머니마다 한 개 이상 담는 경우의 수는?`, all.map(ok),
          { explain: `구슬도 주머니도 서로 구별하지 않으므로 세 주머니에 담는 개수의 묶음만 정하면 된다. 담는 개수를 작은 것부터 적으면 ${pairsTold(got)}의 ${got.length}가지이다.` });
      }
      const k = d.pick([5, 6]), all = [];
      (function grow(rest, row) { if (rest === 0) { if (row.length >= 2) all.push(row); return; } for (let v = 1; v <= rest; v += 1) grow(rest - v, row.concat([v])); })(k, []);
      const ok = (row) => row.every((v, i) => i === 0 || row[i - 1] <= v), got = all.filter(ok), sizes = range(2, k).map((m) => got.filter((row) => row.length === m));
      return Q(`${k}${tail(k, '을/를')} 2개 이상의 자연수의 합으로 나타내는 방법은 모두 몇 가지인가? (단, 1 + ${k - 1}${tail(k - 1, '과/와')} ${k - 1} + 1처럼 더하는 차례만 다른 것은 같은 방법으로 본다.)`, all.map(ok),
        { explain: `더하는 수의 개수에 따라 나누고, 더하는 수를 작은 것부터 적는다. ${sizes.map((list, i) => `${i + 2}개의 합은 ${list.map((row) => row.join(' + ')).join(', ')}의 ${list.length}가지`).join(', ')}이다. 따라서 ${sizes.map((list) => list.length).join(' + ')} = ${got.length}(가지)이다.` });
    }, { count: 2 }),
    // ② 앞면이 나온 횟수를 식으로 구하고(1, 2) 그 횟수가 되는 차례를 늘어놓아(3) 센다. 틀린 답: 횟수만 구하고 1가지라고 한 것.
    H('hard-coin-walk', '동전을 던져 수직선 위를 움직이는 점', '심28', (d) => {
      const [p, q, n, x] = d.until(() => { const m = d.pick([4, 5]); return [d.int(1, 3), d.int(1, 3), m, d.int(1, m - 1)]; }, ([u, w, m, k]) => u !== w && u * k - w * (m - k) !== 0);
      const t = p * x - q * (n - x), all = cart(range(1, n).map(() => ['앞', '뒤'])), ok = (row) => sum(row.map((f) => (f === '앞' ? p : -q))) === t, got = all.filter(ok);
      return Q(`수직선 위의 원점에 점 P가 있다. 동전 한 개를 던져 앞면이 나오면 점 P를 양의 방향으로 ${p}만큼, 뒷면이 나오면 음의 방향으로 ${q}만큼 옮긴다. 동전을 ${n}번 던졌을 때, 점 P의 좌표가 ${sg(t)}인 경우의 수는?`, all.map(ok),
        { explain: `앞면이 ${V('x')}번 나오면 뒷면은 ${nb(`(${n} ${MINUS} ${V('x')})`)}번 나오므로 ${nb(`${co(p)}${V('x')} ${MINUS} ${co(q)}(${n} ${MINUS} ${V('x')}) = ${sg(t)}`)}에서 ${nb(`${V('x')} = ${x}`)}이다. 앞면이 ${x}번, 뒷면이 ${n - x}번 나오는 경우를 던진 차례대로 적으면 ${pairsTold(got)}의 ${got.length}가지이다.` });
    }),
    // ② 짝수의 눈과 홀수의 눈을 따로 따져 나올 눈의 묶음을 찾고(1, 2) 묶음마다 눈이 나오는 차례를 세어(3) 더한다(4). 던지는 횟수가 정해져 있지 않다.
    H('hard-dice-walk', '주사위의 눈만큼 좌표평면 위를 움직이는 점', '심29', (d) => {
      const [gx, gy] = d.pick([[2, 3], [4, 1], [4, 2], [2, 4]]), ends = [];
      // 눈을 하나씩 이어 붙여, 점에 꼭 맞게 닿은 것(참)과 지나친 것(거짓)을 모은다.
      (function go(x, y, seq) { for (const v of DIE) { const nx = x + (v % 2 === 0 ? v : 0), ny = y + (v % 2 === 1 ? v : 0), next = seq.concat([v]); if (nx === gx && ny === gy) ends.push([next, true]); else if (nx > gx || ny > gy) ends.push([next, false]); else go(nx, ny, next); } })(0, 0, []);
      const got = ends.filter((e) => e[1]).map((e) => e[0]), groups = new Map();
      for (const seq of got) { const key = seq.slice().sort((x, y) => x - y).join(','); groups.set(key, (groups.get(key) || 0) + 1); }
      const said = [...groups.entries()].map(([key, k]) => { const faces = key.split(',').map(Number); return [[...new Set(faces)].map((f) => `${f}의 눈이 ${faces.filter((v) => v === f).length}번`).join(', '), k]; });
      return Q(`좌표평면 위의 원점에 점 P가 있다. 주사위 한 개를 던져 짝수의 눈이 나오면 점 P를 ${V('x')}축의 양의 방향으로 그 눈의 수만큼, 홀수의 눈이 나오면 ${V('y')}축의 양의 방향으로 그 눈의 수만큼 옮긴다. 주사위를 여러 번 던져 점 P가 점 ${nb(`(${gx}, ${gy})`)}에 오는 경우의 수는? (단, 눈이 나온 차례가 다르면 서로 다른 경우이다.)`, ends.map((e) => e[1]),
        { explain: `짝수의 눈의 합이 ${gx}, 홀수의 눈의 합이 ${gy}이어야 한다. ${said.map(([w, k]) => `${w} 나오는 경우는 눈이 나오는 차례에 따라 ${k}가지`).join(', ')}이다. 따라서 ${said.map((r) => r[1]).join(' + ')} = ${got.length}(가지)이다.` });
    }),
    // ② 앞에 설 사람의 자리로 갈래를 나누어(여러 갈래) 뒤에 설 사람의 자리와 나머지 사람을 세우고 더한다. 차례 2: 두 사람이 모두 뽑혀야 한다.
    H('hard-before', '한 사람이 다른 사람보다 앞에 서기', '심31', (d, n) => {
      if (n === 0) {
        const k = d.pick([4, 5]), who = pickNames(d, k), all = perms(who, k), ok = (row) => row.indexOf(who[0]) < row.indexOf(who[1]), per = range(1, k - 1).map((i) => (k - i) * fact(k - 2));
        return Q(`${told(who)}의 ${k}명을 한 줄로 세울 때, ${name(who[0], '이/가')} ${who[1]}보다 앞에 서는 경우의 수는? (단, 두 사람이 이웃하지 않아도 된다.)`, all.map(ok),
          { explain: `${name(who[0], '이/가')} 서는 자리를 정하면 ${name(who[1], '은/는')} 그 뒤의 자리 가운데 한 곳에 서고, 나머지 ${k - 2}명이 남은 자리에 서는 경우는 ${fact(k - 2)}가지이다. ${name(who[0], '이/가')} 앞에서 ${range(1, k - 1).map((i) => ORD[i - 1]).join(', ')} 자리에 설 때 차례로 ${range(1, k - 1).map((i) => `${k - i} × ${fact(k - 2)} = ${(k - i) * fact(k - 2)}`).join(', ')}(가지)이다. 따라서 ${per.join(' + ')} = ${sum(per)}(가지)이다.` });
      }
      const k = d.pick([4, 5]), who = pickNames(d, k), all = perms(who, 3), ok = (row) => row.includes(who[0]) && row.includes(who[1]) && row.indexOf(who[0]) < row.indexOf(who[1]);
      return Q(`${told(who)}의 ${k}명 가운데 3명을 뽑아 한 줄로 세울 때, ${name(who[0], '과/와')} ${name(who[1], '이/가')} 모두 뽑히고 ${name(who[0], '이/가')} ${who[1]}보다 앞에 서는 경우의 수는?`, all.map(ok),
        { explain: `두 사람과 함께 뽑힐 나머지 한 명을 정하는 경우가 ${k - 2}가지이다. 뽑힌 3명을 세울 때 ${name(who[0], '이/가')} ${who[1]}보다 앞에 서는 경우는, 나머지 한 명이 맨 앞, 가운데, 맨 뒤에 서는 3가지이다. 따라서 ${k - 2} × 3 = ${(k - 2) * 3}(가지)이다.` });
    }, { count: 2 }),
    // ② 소인수분해하고(1) 소인수마다 그 거듭제곱을 통째로 한쪽에 넣어야 함을 알아채(2) 곱하는 차례만 다른 것을 하나로 센다(3). 틀린 답: 약수의 짝을 모두 센 것.
    H('hard-coprime', '서로소인 두 자연수의 곱으로 나타내기', '심47', (d) => {
      const n = d.pick([60, 84, 90, 120, 126, 150, 180, 360, 420, 1260]), small = range(1, n).filter((a) => n % a === 0 && a * a < n), ok = (a) => gcd(a, n / a) === 1, got = small.filter(ok);
      const primes = range(2, n).filter((p) => n % p === 0 && range(2, p - 1).every((k) => p % k !== 0)), power = (p) => { let k = 0, v = n; while (v % p === 0) { v /= p; k += 1; } return k; };
      return Q(`6을 서로소인 두 자연수의 곱으로 나타내는 방법은 1 × 6, 2 × 3의 2가지이다. 이와 같이 ${n}${tail(n, '을/를')} 서로소인 두 자연수의 곱으로 나타내는 방법은 모두 몇 가지인가? (단, 곱하는 차례만 다른 것은 같은 방법으로 본다.)`, small.map(ok),
        { explain: `${nb(`${n} = ${primes.map((p) => p + (power(p) > 1 ? `<sup>${power(p)}</sup>` : '')).join(' × ')}`)}이다. 두 수가 서로소이려면 같은 소인수가 두 수에 함께 들어가면 안 되므로, 소인수마다 그 거듭제곱 전체를 두 수 가운데 한 수에만 넣는다. 이렇게 나타낸 것은 ${got.map((a) => `${a} × ${n / a}`).join(', ')}의 ${got.length}가지이다.` });
    }),
    // ② 절편에서 두 점을 읽어(1) 기울기와 식을 구하고(2) 식에 맞는 순서쌍을 찾아(3) 센다.
    H('hard-dice-intercepts', '눈의 순서쌍이 절편으로 정한 그래프 위의 점', '심16', (d) => {
      const [xi, yi] = d.pick([[-2, 1], [-4, 2], [-6, 3], [-3, 1], [-6, 2], [-1, 2], [-3, 2], [-2, 2], [-3, 3], [8, 4], [10, 5], [4, 8], [9, 6], [3, 9], [5, 5]]), ok = ([a, e]) => xi * e + yi * a === xi * yi, got = PAIRS.filter(ok), slope = RQ(-yi, xi);
      return Q(`한 개의 주사위를 두 번 던져서 처음에 나오는 눈의 수를 ${V('a')}, 나중에 나오는 눈의 수를 ${V('b')}라 할 때, 점 ${nb(`(${V('a')}, ${V('b')})`)}가 ${V('x')}절편이 ${sg(xi)}, ${V('y')}절편이 ${yi}인 일차함수의 그래프 위에 있는 경우의 수는?`, PAIRS.map(ok),
        { explain: `이 그래프는 두 점 ${nb(`(${sg(xi)}, 0)`)}, ${nb(`(0, ${yi})`)}${tail(yi, '을/를')} 지나므로 기울기는 ${tx(slope)}이고, 일차함수의 식은 ${nb(`${V('y')} = ${poly([[slope, V('x')], [yi, '']])}`)}이다. 점 ${nb(`(${V('a')}, ${V('b')})`)}가 이 그래프 위에 있으려면 ${nb(`${V('b')} = ${poly([[slope, V('a')], [yi, '']])}`)}이어야 하고, 이를 만족시키는 (${V('a')}, ${V('b')})는 ${pairsTold(got)}의 ${got.length}가지이다.` });
    }),
    // ② 교점의 x좌표를 a, b의 식으로 나타내고(1) 그 값이 될 수 있는 수를 가려(2) 값마다 순서쌍을 세어(3) 더한다(4).
    H('hard-dice-cross', '두 직선의 교점의 x좌표가 어떤 수의 배수인 경우', '심15', (d) => {
      const [c1, c2, k] = d.pick([[1, 3, 3], [1, 3, 2], [2, 4, 3], [2, 4, 2], [1, 4, 2], [2, 5, 2]]), m = c2 - c1, ok = ([a, e]) => (a + e) % m === 0 && ((a + e) / m) % k === 0;
      const xs = range(1, Math.floor(12 / m)).filter((x) => x % k === 0), per = xs.map((x) => PAIRS.filter(([a, e]) => a + e === x * m).length);
      return Q(`서로 다른 두 개의 주사위 A, B를 동시에 던져서 나오는 눈의 수를 각각 ${V('a')}, ${V('b')}라 할 때, 두 일차함수 ${nb(`${V('y')} = ${poly([[c1, V('x')], [1, V('a')]])}`)}, ${nb(`${V('y')} = ${poly([[c2, V('x')], [-1, V('b')]])}`)}의 그래프의 교점의 ${V('x')}좌표가 ${k}의 배수인 경우의 수는?`, PAIRS.map(ok),
        { explain: `교점에서는 두 함수의 ${V('y')}의 값이 같으므로 ${nb(`${poly([[c1, V('x')], [1, V('a')]])} = ${poly([[c2, V('x')], [-1, V('b')]])}`)}, 즉 ${nb(`${V('x')} = ${frac(`${V('a')} + ${V('b')}`, m)}`)}이다. ${nb(`${V('a')} + ${V('b')}`)}의 값은 2부터 12까지이므로 ${V('x')}좌표가 될 수 있는 ${k}의 배수는 ${told(xs)}이고, 이때 ${nb(`${V('a')} + ${V('b')}`)}의 값은 ${told(xs.map((x) => x * m))}이다. 그 경우의 수는 차례로 ${told(per)}이므로 ${per.join(' + ')} = ${sum(per)}(가지)이다.` });
    }),
    // ② 이웃할 세 명을 한 묶음으로 세우고(1) 묶음 안에서 세 명을 다시 한 줄로 세워(2) 곱한다(3). 틀린 답: 묶음 안을 2가지나 3가지로 센 것.
  ]);

  B.addTypes(UNIT, 'pick', [
    T('pick-leave-one', '한 명만 빼고 모두 뽑기', '심42', (d) => {
      const n = d.int(6, 9), [team, job] = d.pick([['배구 선수', '경기에 먼저 나갈 선수'], ['합창단 학생', '무대에 설 학생'], ['모둠 학생', '발표에 나설 학생']]), all = cart(range(1, n).map(() => [0, 1]));
      return Q(`${team} ${n}명 가운데 ${job} ${n - 1}명을 뽑는 경우의 수는?`, all.map((row) => sum(row) === n - 1),
        { explain: `${n}명 가운데 ${n - 1}명을 뽑는 것은 뽑히지 않을 1명을 정하는 것과 같다. 따라서 ${n}가지이다.` });
    })
  ]);

  B.addTypes(UNIT, 'shape', [
    T('shape-diameter', '원의 지름을 한 변으로 하는 삼각형', '①70', (d) => {
      const n = d.pick([6, 8]), half = n / 2, names = 'ABCDEFGH', all = combos(range(0, n - 1), 3), ok = (row) => row.some((i) => row.includes(i + half));
      return Q(`그림과 같이 원 위에 같은 간격으로 점 ${n}개가 있다. 이 가운데 세 점을 꼭짓점으로 하는 삼각형을 만들 때, 원의 지름을 한 변으로 하는 삼각형의 개수는?`, all.map(ok),
        { unit: '개', figure: circlePoints(n), explain: `원의 지름이 되는 선분은 마주 보는 두 점을 이은 ${range(0, half - 1).map((i) => '선분 ' + names[i] + names[i + half]).join(', ')}의 ${half}개이다. 지름 하나마다 나머지 점 ${n - 2}개 가운데 하나를 골라 삼각형을 만들 수 있으므로 ${half} × ${n - 2} = ${half * (n - 2)}(개)이다.` });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
