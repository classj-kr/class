// 중학교 2학년 2학기 6단원 경우의 수 — 뒤쪽 묶음(길, 한 줄로 세우기, 자연수 만들기, 대표 뽑기, 도형과 색칠).
// 단원 틀·도구·싣는 기준·뺀 것과 까닭은 8-2-6a.js 에, 실력 문항은 8-2-6c.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//  - 길: 쪽 그림(미래엔 2022 소단원 수준별 「기초 탄탄」 03, 「실력 쑥쑥」 06)을 보고 지었다. 세 지점이 가로 한 줄이고 지점 사이를 휜 선 여러 개로 잇는다.
//    거쳐 가는 길과 곧바로 가는 길을 함께 세는 꼴(①43)은 기본 문서 세 곳에 나오므로 기본에 두었다.
//  - 한 줄로 세우기: 모두 세우기와 자리가 정해진 사람이 있는 줄만 기본에 둔다. 이웃하게 세우기는 실력에 한 유형만 있다.
//    「일부만 뽑아 세우기」만 따로 묻는 꼴은 꼴 목록에 없어 싣지 않았다(회장·부회장·총무 뽑기와 두 자리·세 자리 자연수 만들기가 같은 셈이다).
//  - 자연수 만들기: 0이 낀 카드로 두 자리 자연수를 만드는 꼴(①54)은 기본 문서 세 곳에 나오므로 기본에 두었다. 일의 자리가 0인 경우와 아닌 경우로 나누는 짝수·5의 배수는 실력에 있다.
//  - 대표 뽑기: 자격이 다른 대표(회장·부회장)와 자격이 같은 대표 2명을 기본에 둔다. 경기 수·선분의 개수처럼 상황에서 「자격이 같은 2명」을 읽어 내야 하는 꼴은 실력에 있다.
//  - 도형과 색칠: 평행한 두 직선 위의 점(①69)은 쪽 그림이 없어 글(직선 l 위의 점 3개, m 위의 점 4개)대로 그렸다. 세 영역 그림은 미래엔 2022 소단원 수준별 「실력 쑥쑥」 03을 보고 지었다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, M } = B.kit;
  const { range, V } = B.kit.mid;
  const { STD, T, hits, perms, combos, cart, told, pt, Q, QA, rowRoads, region3Fig, parallelPoints, pickNames } = B.kit.m826;
  const UNIT = '8-2-6';
  const digitsOf = (row) => Number(row.join(''));
  // 카드 글: 「0, 1, 2, 3의 숫자가 하나씩 적힌 카드 4장」
  const cardsTold = (digits) => `${told(digits)}의 숫자가 하나씩 적힌 카드 ${digits.length}장`;
  // 카드에서 r 장을 뽑아 만든 수 전부(맨 앞이 0인 것은 수가 아니다)
  const numbersOf = (digits, r) => perms(digits, r).filter((row) => row[0] !== 0).map(digitsOf);
  const PLACE = { 2: '두', 3: '세' };

  B.addTypes(UNIT, 'road', [
    T('road-two', '두 구간을 차례로 지나는 길', '①42', (d) => {
      const names = d.pick([['집', '마트', '학교'], ['집', '서점', '도서관'], ['학교', '공원', '집'], ['집', '약국', '병원']]), [a, c] = d.until(() => [d.int(2, 4), d.int(2, 4)], ([x, y]) => x !== y);
      return QA(`그림과 같이 ${names[0]}, ${names[1]}, ${josa(names[2], '을/를')} 잇는 길이 있다. ${names[0]}에서 출발하여 ${josa(names[1], '을/를')} 한 번만 거쳐 ${names[2]}까지 가는 경우의 수는?`, cart([range(1, a), range(1, c)]).length, `${a}*${c}`,
        { figure: rowRoads(names, a, c, 0), explain: `${names[0]}에서 ${names[1]}까지 가는 길이 ${a}가지이고, 그 길 하나마다 ${names[1]}에서 ${names[2]}까지 가는 길이 ${c}가지이다. 따라서 ${a} × ${c} = ${a * c}(가지)이다.` });
    }),
    T('road-direct', '거쳐 가는 길과 곧바로 가는 길', '①43 심26', (d) => {
      const [a, c, e] = d.until(() => [d.int(2, 3), d.int(2, 3), d.int(1, 2)], ([x, y]) => x !== y), names = ['A', 'B', 'C'];
      return QA('그림과 같이 세 지점 A, B, C를 잇는 길이 있다. A 지점에서 출발하여 C 지점까지 가는 경우의 수는? (단, 한 번 지나간 지점은 다시 지나지 않는다.)', cart([range(1, a), range(1, c)]).length + e, `${a}*${c}+${e}`,
        { figure: rowRoads(names, a, c, e), explain: `B 지점을 거쳐 가는 경우는 ${a} × ${c} = ${a * c}(가지)이고, B 지점을 거치지 않고 바로 가는 경우는 ${e}가지이다. 두 경우는 동시에 일어나지 않으므로 ${a * c} + ${e} = ${a * c + e}(가지)이다.` });
    }),
    T('road-return', '갔다가 다른 길로 돌아오기', '①45', (d) => {
      const k = d.int(3, 6), [P, R] = d.pick([['집', '학교'], ['집', '도서관'], ['학교', '공원']]), all = perms(range(1, k), 2);
      return QA(`${P}에서 ${R}까지 가는 길이 ${k}가지 있다. ${P}에서 ${R}까지 갔다가 ${josa(P, '으로/로')} 돌아올 때, 갈 때 지난 길과 다른 길로 돌아오는 경우의 수는?`, all.length, `${k}*(${k}-1)`,
        { explain: `갈 때 고를 수 있는 길은 ${k}가지이고, 돌아올 때는 갈 때 지난 길을 뺀 ${k - 1}가지이다. 따라서 ${k} × ${k - 1} = ${all.length}(가지)이다.`, facts: { unseen: [1] } });
    })
  ]);

  B.addTypes(UNIT, 'line', [
    T('line-all', '모두 한 줄로 세우기', '①48', (d) => {
      const k = d.pick([4, 5]), ctx = d.pick([`${k}명의 학생이 이어달리기를 할 때, 달리는 차례를 정하는 경우의 수는?`, `서로 다른 책 ${k}권을 책꽂이에 한 줄로 꽂는 경우의 수는?`, `${k}명의 학생이 한 명씩 차례로 발표할 때, 발표하는 차례를 정하는 경우의 수는?`]);
      const all = perms(range(1, k), k), expr = range(1, k).reverse();
      return QA(ctx, all.length, expr.join('*'), { explain: `첫 번째 자리에는 ${k}가지, 두 번째 자리에는 남은 ${k - 1}가지가 올 수 있고, 이와 같이 한 자리씩 정해 가면 ${expr.join(' × ')} = ${all.length}(가지)이다.`, facts: { unseen: range(1, k) } });
    }),
    T('line-fixed', '자리가 정해진 사람이 있는 줄', '①49', (d, n) => {
      if (n === 0) {
        const k = d.pick([4, 5]), who = pickNames(d, k), all = perms(who, k), ok = (row) => row[0] === who[0] || row[k - 1] === who[0], rest = perms(range(1, k - 1), k - 1).length;
        return Q(`${told(who)}의 ${k}명을 한 줄로 세울 때, ${name(who[0], '이/가')} 맨 앞 또는 맨 뒤에 서는 경우의 수는?`, all.map(ok),
          { explain: `${name(who[0], '이/가')} 맨 앞에 서면 나머지 ${k - 1}명을 한 줄로 세우는 경우의 수는 ${range(1, k - 1).reverse().join(' × ')} = ${rest}이고, 맨 뒤에 설 때도 ${rest}가지이다. 따라서 ${rest} + ${rest} = ${2 * rest}(가지)이다.` });
      }
      const k = d.pick([4, 5]), who = ['아버지', '어머니'].concat(['형', '누나', '나', '동생'].slice(4 - (k - 2))), all = perms(who, k), ok = (row) => [row[0], row[k - 1]].sort().join() === ['아버지', '어머니'].sort().join(), rest = perms(range(1, k - 2), k - 2).length;
      return Q(`부모님을 포함한 가족 ${k}명이 한 줄로 서서 사진을 찍을 때, 부모님이 양 끝에 서는 경우의 수는?`, all.map(ok),
        { explain: `부모님이 양 끝에 서는 경우는 아버지가 왼쪽 끝인 것과 오른쪽 끝인 것의 2가지이고, 가운데에 나머지 ${k - 2}명을 세우는 경우는 ${range(1, k - 2).reverse().join(' × ')} = ${rest}(가지)이다. 따라서 2 × ${rest} = ${2 * rest}(가지)이다.` });
    }, { count: 2 })
  ]);

  B.addTypes(UNIT, 'number', [
    T('number-make', '0이 없는 카드로 자연수 만들기', '①53', (d) => {
      const k = d.pick([4, 5]), r = d.pick([2, 3]), digits = range(1, k), all = numbersOf(digits, r), expr = range(k - r + 1, k).reverse();
      return QA(`1부터 ${k}까지의 자연수가 하나씩 적힌 카드 ${k}장 가운데 ${r}장을 뽑아 한 줄로 늘어놓아 만들 수 있는 ${PLACE[r]} 자리 자연수의 개수는?`, all.length, expr.join('*'),
        { unit: '개', explain: `${r === 2 ? `십의 자리에 올 수 있는 숫자는 ${k}가지, 일의 자리에는 십의 자리의 숫자를 뺀 ${k - 1}가지` : `백의 자리에 올 수 있는 숫자는 ${k}가지, 십의 자리에는 ${k - 1}가지, 일의 자리에는 ${k - 2}가지`}이다. 따라서 ${expr.join(' × ')} = ${all.length}(개)이다.`, facts: { unseen: expr } });
    }),
    T('number-zero', '0이 있는 카드로 자연수 만들기', '①54 심34', (d, n) => {
      const r = n === 0 ? 2 : 3, k = d.pick([4, 5]), digits = [0].concat(d.shuffle(range(1, 9)).slice(0, k - 1).sort((x, y) => x - y)), all = perms(digits, r), ok = (row) => row[0] !== 0, expr = [k - 1, k - 1].concat(r === 3 ? [k - 2] : []);
      return Q(`${cardsTold(digits)} 가운데 ${r}장을 뽑아 한 줄로 늘어놓아 ${PLACE[r]} 자리 자연수를 만들 때, 만들 수 있는 수의 개수는?`, all.map(ok),
        { unit: '개', explain: `${r === 2 ? '십' : '백'}의 자리에는 0이 올 수 없으므로 ${k - 1}가지이다. ${r === 2 ? `일의 자리에는 십의 자리의 숫자를 뺀 ${k - 1}가지가 올 수 있다(0도 된다).` : `십의 자리에는 백의 자리의 숫자를 뺀 ${k - 1}가지(0도 된다), 일의 자리에는 남은 ${k - 2}가지가 올 수 있다.`} 따라서 ${expr.join(' × ')} = ${hits(all.map(ok))}(개)이다.`,
          facts: { calc: [[expr.join('*'), 0]], unseen: expr, rule: 'zero' + r } });
    }, { count: 2 }),
    T('number-odd', '0이 없는 카드로 홀수·짝수 만들기', '①55 심35', (d) => {
      const digits = d.pick([[1, 2, 3, 4, 5], [2, 3, 4, 5], [1, 2, 3, 4], [1, 3, 4, 6, 7]]), odd = d.bool(), all = perms(digits, 2), ok = (row) => row[1] % 2 === (odd ? 1 : 0), ends = digits.filter((v) => v % 2 === (odd ? 1 : 0));
      return Q(`${cardsTold(digits)} 가운데 2장을 뽑아 두 자리 자연수를 만들 때, ${odd ? '홀수' : '짝수'}의 개수는?`, all.map(ok),
        { unit: '개', explain: `${odd ? '홀수' : '짝수'}이려면 일의 자리 숫자가 ${told(ends)} 가운데 하나이어야 하므로 ${ends.length}가지이고, 십의 자리에는 일의 자리의 숫자를 뺀 ${digits.length - 1}가지가 올 수 있다. 따라서 ${ends.length} × ${digits.length - 1} = ${ends.length * (digits.length - 1)}(개)이다.` });
    }),
    T('number-size', '크기 조건이 붙은 두 자리 수', '①58', (d, n) => {
      if (n === 0) {
        // 십의 자리 숫자만 보면 되는 조건(몇십 이상, 몇십보다 작은 수)
        const digits = d.pick([[1, 2, 3, 4], [1, 2, 3, 4, 5], [0, 1, 3, 5, 7], [2, 3, 5, 7], [0, 2, 4, 6, 8]]), heads = digits.filter((v) => v !== 0), all = numbersOf(digits, 2);
        // 십의 자리에 올 수 있는 숫자가 둘 이상이고, 모두는 아니게 고른다.
        const [up, t] = d.until(() => [d.bool(), d.pick(heads)], ([u, v]) => { const k = heads.filter((x) => (u ? x >= v : x < v)).length; return k >= 2 && k < heads.length; });
        const ok = (v) => (up ? v >= t * 10 : v < t * 10), tens = heads.filter((v) => (up ? v >= t : v < t));
        return Q(`${cardsTold(digits)} 가운데 2장을 뽑아 두 자리 자연수를 만들 때, ${t * 10}${up ? ' 이상인' : '보다 작은'} 수의 개수는?`, all.map(ok),
          { unit: '개', explain: `십의 자리 숫자가 ${told(tens)} 가운데 하나이면 되므로 ${tens.length}가지이고, 일의 자리에는 십의 자리의 숫자를 뺀 ${digits.length - 1}가지가 올 수 있다. 따라서 ${tens.length} × ${digits.length - 1} = ${tens.length * (digits.length - 1)}(개)이다.`, facts: { rule: 'tens' } });
      }
      // 십의 자리 숫자가 같은 수 가운데 일부만 드는 조건(24 이상, 25보다 큰 수)
      const digits = d.pick([[0, 1, 2, 3, 4], [0, 2, 4, 5], [0, 1, 3, 5, 7], [1, 2, 3, 4, 5]]), all = numbersOf(digits, 2), strict = d.bool();
      const m = d.until(() => d.pick(all), (v) => { const same = all.filter((x) => Math.floor(x / 10) === Math.floor(v / 10)), inSame = same.filter((x) => (strict ? x > v : x >= v)).length, k = all.filter((x) => (strict ? x > v : x >= v)).length; return inSame >= 1 && inSame < same.length && k >= 4 && k <= all.length - 4 && digits.some((x) => x > Math.floor(v / 10)); });
      const ok = (v) => (strict ? v > m : v >= m), same = all.filter((v) => Math.floor(v / 10) === Math.floor(m / 10) && ok(v)), bigger = digits.filter((v) => v > Math.floor(m / 10));
      return Q(`${cardsTold(digits)} 가운데 2장을 뽑아 두 자리 자연수를 만들 때, ${m}${strict ? '보다 큰' : ' 이상인'} 수의 개수는?`, all.map(ok),
        { unit: '개', explain: `십의 자리 숫자가 ${Math.floor(m / 10)}인 수 가운데 ${m}${strict ? '보다 큰' : ' 이상인'} 수는 ${told(same)}의 ${same.length}개이다. 십의 자리 숫자가 ${told(bigger)}인 수는 모두 ${m}보다 크고, 그 개수는 ${bigger.length} × ${digits.length - 1} = ${bigger.length * (digits.length - 1)}(개)이다. 따라서 ${same.length} + ${bigger.length * (digits.length - 1)} = ${hits(all.map(ok))}(개)이다.`, facts: { rule: 'partly' } });
    }, { count: 2 }),
    T('number-repeat', '같은 숫자를 다시 써도 되는 수의 개수', '①61 ①62', (d, n) => {
      if (n === 0) {
        const k = d.pick([4, 5]), digits = range(0, k - 1), all = cart([digits, digits]), ok = (row) => row[0] !== 0;
        return Q(`${told(digits)}의 숫자를 사용하여 두 자리 자연수를 만들 때, 만들 수 있는 수의 개수는? (단, 같은 숫자를 여러 번 사용할 수 있다.)`, all.map(ok),
          { unit: '개', explain: `십의 자리에는 0이 올 수 없으므로 ${k - 1}가지이고, 같은 숫자를 다시 쓸 수 있으므로 일의 자리에는 ${k}가지가 올 수 있다. 따라서 ${k - 1} × ${k} = ${(k - 1) * k}(개)이다.`, facts: { calc: [[`${k - 1}*${k}`, 0]], unseen: [k - 1, k] } });
      }
      const zero = d.bool(), digits = zero ? [0, 1, 2, 3] : d.pick([[1, 2, 3], [1, 2, 3, 4]]), odd = zero ? false : d.bool(), all = cart([digits, digits, digits]).filter((row) => row[0] !== 0), ok = (row) => row[2] % 2 === (odd ? 1 : 0);
      const ends = digits.filter((v) => v % 2 === (odd ? 1 : 0)), heads = digits.filter((v) => v !== 0).length;
      return Q(`${told(digits)}의 숫자를 사용하여 세 자리 자연수를 만들 때, ${odd ? '홀수' : '짝수'}의 개수는? (단, 같은 숫자를 여러 번 사용할 수 있다.)`, all.map(ok),
        { unit: '개', explain: `백의 자리에는 ${zero ? '0을 뺀 ' : ''}${heads}가지, 십의 자리에는 ${digits.length}가지가 올 수 있고, ${odd ? '홀수' : '짝수'}이려면 일의 자리 숫자는 ${told(ends)}의 ${ends.length}가지이다. 따라서 ${heads} × ${digits.length} × ${ends.length} = ${heads * digits.length * ends.length}(개)이다.` });
    }, { count: 2 })
  ]);

  B.addTypes(UNIT, 'pick', [
    T('pick-roles', '자격이 다른 대표 뽑기', '①64 ①65', (d, n) => {
      const k = n === 0 ? d.int(4, 7) : d.int(4, 6), r = n === 0 ? 2 : 3, all = perms(range(1, k), r), expr = range(k - r + 1, k).reverse();
      return QA(`${k}명의 후보 가운데 ${n === 0 ? '회장 1명과 부회장 1명' : '회장 1명, 부회장 1명, 총무 1명'}을 뽑는 경우의 수는?`, all.length, expr.join('*'),
        { explain: `회장을 뽑는 경우가 ${k}가지, 남은 사람 가운데 부회장을 뽑는 경우가 ${k - 1}가지${r === 3 ? `, 또 남은 사람 가운데 총무를 뽑는 경우가 ${k - 2}가지` : ''}이다. 따라서 ${expr.join(' × ')} = ${all.length}(가지)이다.`, facts: { unseen: expr } });
    }, { count: 2 }),
    T('pick-same', '자격이 같은 대표 2명', '①66', (d) => {
      const k = d.int(4, 6), who = pickNames(d, k), ordered = perms(who, 2), ok = ([x, y]) => who.indexOf(x) < who.indexOf(y);
      return Q(`${told(who)}의 ${k}명 가운데 청소 당번 2명을 뽑는 경우의 수는?`, ordered.map(ok),
        { explain: `한 명씩 차례로 2명을 뽑으면 ${k} × ${k - 1} = ${k * (k - 1)}(가지)이다. 이 가운데 (${who[0]}, ${who[1]})${pt(who[1], '과/와')} (${who[1]}, ${who[0]})처럼 뽑은 차례만 다른 것은 같은 경우이므로 ${k * (k - 1)} ÷ 2 = ${k * (k - 1) / 2}(가지)이다.`, facts: { calc: [[`${k}*(${k}-1)/2`, 0]], unseen: [1, 2] } });
    }),
    T('pick-compare', '자격이 다른 뽑기와 같은 뽑기를 함께', '①67', (d) => {
      const k = d.int(5, 8), a = perms(range(1, k), 2).length, c = combos(range(1, k), 2).length;
      return M(`${k}명의 학생 가운데 회장 1명과 부회장 1명을 뽑는 경우의 수를 ${V('a')}, 자격이 같은 대표 2명을 뽑는 경우의 수를 ${V('b')}라 할 때, ${V('a')}, ${V('b')}의 값은?`, [{ label: V('a'), answer: a, unit: '가지' }, { label: V('b'), answer: c, unit: '가지' }],
        { explain: `회장과 부회장은 자격이 다르므로 ${V('a')} = ${k} × ${k - 1} = ${a}이다. 대표 2명은 자격이 같아 뽑은 차례만 다른 것이 같은 경우이므로 ${V('b')} = ${a} ÷ 2 = ${c}이다.`, facts: { calc: [[`${k}*(${k}-1)`, 0], [`${k}*(${k}-1)/2`, 1]], unseen: [1, 2] } });
    }),
    T('pick-one-each', '남녀에서 한 명씩 뽑기', '①68 심20', (d) => {
      const [a, c] = d.until(() => [d.int(3, 9), d.int(3, 9)], ([x, y]) => x !== y);
      return QA(`남학생 ${a}명과 여학생 ${c}명 가운데 남학생 1명과 여학생 1명을 대표로 뽑는 경우의 수는?`, cart([range(1, a), range(1, c)]).length, `${a}*${c}`,
        { explain: `남학생 1명을 뽑는 경우가 ${a}가지이고, 그 한 명마다 여학생 1명을 뽑는 경우가 ${c}가지이다. 남학생과 여학생에서 따로 뽑으므로 2로 나누지 않는다. 따라서 ${a} × ${c} = ${a * c}(가지)이다.` });
    })
  ]);

  B.addTypes(UNIT, 'shape', [
    T('shape-parallel', '평행한 두 직선 위의 점을 잇는 선분', '①69', (d) => {
      const [a, c] = d.until(() => [d.int(2, 5), d.int(2, 5)], ([x, y]) => x !== y);
      return QA(`그림과 같이 평행한 두 직선 ${V('l')}, ${V('m')} 위에 점이 각각 ${a}개, ${c}개 있다. 직선 ${V('l')} 위의 한 점과 직선 ${V('m')} 위의 한 점을 이어 만들 수 있는 선분의 개수는?`, cart([range(1, a), range(1, c)]).length, `${a}*${c}`,
        { unit: '개', figure: parallelPoints(a, c), explain: `직선 ${V('l')} 위의 점 하나마다 직선 ${V('m')} 위의 점 ${c}개와 이을 수 있으므로 ${a} × ${c} = ${a * c}(개)이다.` });
    }),
    T('shape-color3', '영역마다 모두 다른 색', '①73', (d) => {
      const colors = ['빨강', '노랑', '파랑', '초록', '보라'].slice(0, d.pick([3, 4, 5])), k = colors.length, all = perms(colors, 3), expr = [k, k - 1, k - 2];
      return QA(`그림과 같이 A, B, C 세 영역으로 나누어진 도형을 ${told(colors)}의 ${k}가지 색 가운데 ${k === 3 ? '세 가지를 모두' : '세 가지를'} 사용하여 칠하려고 한다. 세 영역에 서로 다른 색을 칠하는 경우의 수는?`, all.length, expr.join('*'),
        { figure: region3Fig(), explain: `A에 칠할 수 있는 색은 ${k}가지, B에는 A에 칠한 색을 뺀 ${k - 1}가지, C에는 남은 ${k - 2}가지이다. 따라서 ${expr.join(' × ')} = ${all.length}(가지)이다.`, facts: { unseen: expr } });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
