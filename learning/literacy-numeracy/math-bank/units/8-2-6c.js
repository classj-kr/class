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
})(typeof window !== 'undefined' ? window : globalThis);
