// 3학년 1학기 3단원 나눗셈 — 단원 틀과 기본 문항.
// 수집해 둔 교과서 10종의 평가 자료(단원평가·형성평가·수학익힘·수행평가 191개 문서)에 나온 문제 꼴을 세 덩이로 나누어 모은
// 목록(기본꼴 1~3, 모두 188꼴)에서 고른 것이다. 꼴과 조건은 그 문제를 따르고 수와 문장만 바꾼다.
// (천재 박만구 교과서는 이 단원이 4단원이라 그 책의 자료는 4단원 폴더에서 가져왔다.)
//
// 고른 기준
//  - 숫자만 다르거나 말만 다른 꼴은 한 번만 싣는다. 곱셈식↔나눗셈식처럼 방향만 뒤집은 꼴도 한 번만.
//  - 식 쓰기·뜻 설명하기·문제 만들기 같은 서술형, 색칠·빙고·주사위 놀이는 싣지 않는다.
//  - 나눗셈은 모두 곱셈구구 범위(나누는 수와 몫이 2~9)이고 나머지가 없다. 나머지나 「나누어떨어진다」는 말은 3학년 2학기 것이다.
//  - 두 단계 이상이거나 거꾸로 생각해야 하는 꼴은 실력 문항으로 보냈다(3-1-3b.js).
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, expr, cards, chain, dots, numberLine, lines, tagged, numbers, N, M, C, E } = B.kit;
  const MEAN = '4수01-05', CALC = '4수01-06';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  // 곱셈구구 범위의 나눗셈: a ÷ b = q (b, q 는 2~9)
  const fact = (d, ok) => d.until(() => { const b = d.int(2, 9), q = d.int(2, 9); return [b * q, b, q]; }, ok || (() => true));
  const SIGNS = ['&gt;', '=', '&lt;'];

  B.addUnit({
    id: '3-1-3', grade: 3, semester: 1, no: 3, title: '나눗셈', version: 7,
    groups: [
      {
        id: 'share', title: '똑같이 나누기', standard: MEAN,
        types: [
          T('share-picture', '나누어 놓은 그림과 나눗셈식', '①1 ②2 ③8', (d) => {
            const [a, b, q] = fact(d, ([, y, z]) => y <= 5 && z <= 8 && y !== z);
            return N(`방울토마토 ${a}개를 그릇 ${b}개에 똑같이 나누어 담았다. □ 안에 알맞은 수는?`, q, {
              figure: dots(b, q, { loop: 'rows' }) + expr(a, '/', b, '=', box()), explain: `그릇 한 개에 ${q}개씩 담겨 있다. ` + expr(a, '/', b, '=', q), facts: { calc: [[E(a, '/', b), 0]] }
            });
          }),
          T('share-word', '문장제: 한 묶음의 수', '①3 ②3 ③11', (d) => {
            const [a, b, q] = fact(d, ([, y, z]) => y !== z);
            return N(`풍선 ${a}개를 ${b}모둠이 똑같이 나누어 가지려고 한다. 한 모둠이 몇 개씩 가질 수 있는가?`, q, { unit: '개', explain: expr(a, '/', b, '=', q), facts: { calc: [[E(a, '/', b), 0]] } });
          }),
          T('share-vary', '나누는 수를 바꾸어 나누기', '①4 ②4 ③20', (d) => {
            // 농구공 36개를 상자 4개, 9개에
            const total = d.pick([12, 16, 18, 24, 36]);
            const [x, y] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([p, q]) => p < q && total % p === 0 && total % q === 0 && total / p <= 9 && total / q >= 2 && p * q !== total);
            return M(`구슬 ${total}개를 상자에 똑같이 나누어 담으려고 한다. 상자가 ${x}개일 때와 ${y}개일 때, 한 상자에 담는 구슬은 각각 몇 개인가?`, [{ label: `상자 ${x}개`, answer: total / x, unit: '개' }, { label: `상자 ${y}개`, answer: total / y, unit: '개' }], {
              explain: `${expr(total, '/', x, '=', total / x)}, ${expr(total, '/', y, '=', total / y)}`, facts: { calc: [[E(total, '/', x), 0], [E(total, '/', y), 1]] }
            });
          }),
          T('share-say', '나눗셈식에 대한 설명', '①18~20 ②14~17 ③1~3', (d) => {
            const [a, b, q] = fact(d, ([, y, z]) => y !== z);
            const good = d.shuffle([`${a} 나누기 ${josa(b, '은/는')} ${josa(q, '과/와')} 같다고 읽는다.`, `몫은 ${q}이다.`, `나누는 수는 ${b}이다.`, `나누어지는 수는 ${a}이다.`]).slice(0, 3);
            const bad = d.pick([`나누는 수는 ${a}이다.`, `몫은 ${b}이다.`, `${b} 나누기 ${josa(a, '은/는')} ${josa(q, '과/와')} 같다고 읽는다.`]);
            const list = d.shuffle(good.concat([bad]));
            return C('나눗셈식에 대한 설명으로 옳지 않은 것은?', list, list.indexOf(bad), {
              figure: expr(a, '/', b, '=', q), explain: `${expr(a, '/', b, '=', q)}에서 ${josa(a, '은/는')} 나누어지는 수, ${josa(b, '은/는')} 나누는 수, ${josa(q, '은/는')} 몫이다.`, facts: { truth: list.map((o) => o !== bad), want: false }
            });
          }),
          T('share-read', '나눗셈식 읽기', '①18 ②14 ③1', (d) => {
            // 차례를 바꾸어 읽은 것, 다른 계산으로 읽은 것을 보기에 넣는다
            const [a, b, q] = fact(d, ([, y, z]) => y !== z);
            const rows = d.shuffle([[`${a} 나누기 ${josa(b, '은/는')} ${josa(q, '과/와')} 같다.`, true], [`${b} 나누기 ${josa(a, '은/는')} ${josa(q, '과/와')} 같다.`, false], [`${a} 빼기 ${josa(b, '은/는')} ${josa(q, '과/와')} 같다.`, false], [`${a} 곱하기 ${josa(b, '은/는')} ${josa(q, '과/와')} 같다.`, false]]);
            return C(`${a} ÷ ${b} = ${josa(q, '을/를')} 바르게 읽은 것은?`, rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
              explain: `÷는 나누기, =는 같다고 읽는다. 나누어지는 수 ${josa(a, '을/를')} 먼저 읽는다.`, facts: { truth: rows.map(([, ok]) => ok), want: true }
            });
          }),
          T('share-expr', '상황에 맞는 식', '②20 ③6', (d) => {
            const [a, b, q] = fact(d, ([, y, z]) => y !== z);
            const list = d.shuffle([['/', true], ['-', false], ['+', false], ['*', false]]);
            return C(`다람쥐 ${b}마리가 도토리 ${a}개를 똑같이 나누어 가지려고 한다. 다람쥐 한 마리가 가지는 도토리의 수를 구하는 식은?`, list.map(([op]) => expr(a, op, b)), list.findIndex(([, ok]) => ok), {
              explain: `똑같이 나누는 것은 나눗셈으로 구한다. ` + expr(a, '/', b, '=', q), facts: { truth: list.map(([, ok]) => ok), want: true }
            });
          })
        ]
      },
      {
        id: 'group', title: '똑같이 묶어 덜어 내기', standard: MEAN,
        types: [
          T('group-picture', '묶은 그림과 나눗셈식', '①7 ②7 ③12', (d) => {
            const [a, k, n] = fact(d, ([, y, z]) => y <= 5 && z <= 9 && y !== z);
            return N(`쿠키 ${a}개를 ${k}개씩 묶었다. □ 안에 알맞은 수는?`, n, {
              figure: dots(k, n, { loop: 'cols' }) + expr(a, '/', k, '=', box()), explain: `${k}개씩 묶으면 ${n}묶음이다. ` + expr(a, '/', k, '=', n), facts: { calc: [[E(a, '/', k), 0]] }
            });
          }),
          T('group-minus', '뺄셈식을 나눗셈식으로', '①9 ②11 ③16', (d) => {
            // 24-6-6-6-6=0 → 24÷6=4
            const [a, k, n] = fact(d, ([, y, z]) => z >= 3 && z <= 6 && y !== z);
            const minus = [a].concat(Array.from({ length: n }, () => k));
            return M('뺄셈식을 나눗셈식으로 나타낼 때, ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: k }, { label: LABELS[1], answer: n }], {
              figure: lines(['<span class="mb-expr">' + minus.join(' <i>−</i> ') + ' <i>=</i> 0</span>', expr(a, '/', box(LABELS[0]), '=', box(LABELS[1]))]),
              explain: `${a}에서 ${josa(k, '을/를')} ${n}번 빼면 0이 된다. ` + expr(a, '/', k, '=', n), facts: { minus: { a, k, n } }
            });
          }),
          T('group-back', '나눗셈식을 뺄셈식으로', '①10 ②12', (d) => {
            // 24÷8=3 → 24-8-8-8=0. 한 번 덜 뺀 식, 한 번만 뺀 식, 몫씩 덜어 낸 식을 보기에 넣는다
            const [a, k, n] = fact(d, ([, y, z]) => y >= 3 && y <= 6 && z >= 3 && z <= 6 && y !== z);
            const forms = d.shuffle([[k, n], [k, n - 1], [k, 1], [n, k]]);
            const write = ([sub, times]) => [a].concat(Array.from({ length: times }, () => sub)).join(' − ') + ' = ' + (a - sub * times);
            return C(`${a} ÷ ${k} = ${josa(n, '을/를')} 뺄셈식으로 바르게 나타낸 것은?`, forms.map(write), forms.findIndex(([sub, times]) => sub === k && times === n), {
              explain: `${a} ÷ ${k} = ${josa(n, '은/는')} ${a}에서 ${josa(k, '을/를')} ${n}번 빼면 0이 된다는 뜻이다.`, facts: { minusForms: { a, k, n, forms } }
            });
          }),
          T('group-word', '문장제: 묶음의 수', '①12 ②8 ③14', (d) => {
            const [a, k, n] = fact(d, ([, y, z]) => y !== z);
            return N(`전체가 ${a}쪽인 책을 하루에 ${k}쪽씩 읽으려고 한다. 책을 모두 읽는 데 며칠이 걸리는가?`, n, { unit: '일', explain: expr(a, '/', k, '=', n), facts: { calc: [[E(a, '/', k), 0]] } });
          }),
          T('group-line', '수직선으로 묶음의 수 구하기', '③18', (d) => {
            const [a, k, n] = fact(d, ([x, y, z]) => x <= 30 && y <= 6 && z <= 6 && y !== z);
            return N('수직선을 보고 나눗셈식을 완성할 때, □ 안에 알맞은 수는?', n, { figure: numberLine(a, k) + expr(a, '/', k, '=', box()), explain: `0부터 ${k}씩 ${n}번 뛰면 ${a}이다. ` + expr(a, '/', k, '=', n), facts: { calc: [[E(a, '/', k), 0]] } });
          }),
          T('group-both', '같은 수를 두 가지 뜻으로 나누기', '①14 ②9 ③19', (d) => {
            // 공깃돌 12개를 통 3개에 똑같이 → 4개, 한 통에 4개씩 → 3통
            const [a, b, q] = fact(d, ([, y, z]) => y !== z);
            return M(`공깃돌 ${a}개를 통에 담으려고 한다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: q }, { label: LABELS[1], answer: b }], {
              figure: lines([`통 ${b}개에 똑같이 나누어 담으면 한 통에 ${box(LABELS[0])}개씩 담는다.`, `한 통에 ${q}개씩 담으면 통이 ${box(LABELS[1])}개 필요하다.`]),
              explain: `${expr(a, '/', b, '=', q)}, ${expr(a, '/', q, '=', b)}`, facts: { calc: [[E(a, '/', b), 0], [E(a, '/', q), 1]] }
            });
          })
        ]
      },
      {
        id: 'relate', title: '곱셈과 나눗셈의 관계', standard: MEAN,
        types: [
          T('relate-two', '곱셈식을 나눗셈식으로', '①23 ②23 ③21', (d) => {
            // 8×7=56 → 56÷8=7, 56÷7=8
            const [a, b, q] = fact(d, ([, y, z]) => y !== z);
            return M(`곱셈식 ${b} × ${q} = ${josa(a, '을/를')} 나눗셈식 2개로 나타내었다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: a }, { label: LABELS[1], answer: q }], {
              figure: lines([expr(box(LABELS[0]), '/', b, '=', q), expr(a, '/', box(LABELS[1]), '=', b)]),
              explain: `${expr(b, '*', q, '=', a)}이므로 ${expr(a, '/', b, '=', q)}, ${expr(a, '/', q, '=', b)}이다.`, facts: { calc: [[E(b, '*', q), 0], [E(a, '/', b), 1]] }
            });
          }),
          T('relate-array', '줄지은 그림을 곱셈식과 나눗셈식으로', '①26 ②26 ③23', (d) => {
            // 8개씩 3줄 → 8×3=24, 24÷8=3
            const [a, c, r] = fact(d, ([, y, z]) => y >= 4 && y <= 9 && z <= 5 && y !== z);
            return M('그림을 보고 식을 완성할 때, ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: r }, { label: LABELS[1], answer: a }], {
              figure: dots(r, c) + lines([expr(c, '*', box(LABELS[0]), '=', box(LABELS[1])), expr(box(LABELS[1]), '/', c, '=', box(LABELS[0]))]),
              explain: `${c}개씩 ${r}줄이다. ${expr(c, '*', r, '=', a)}, ${expr(a, '/', c, '=', r)}`, facts: { calc: [[E(a, '/', c), 0], [E(c, '*', r), 1]] }
            });
          }),
          T('relate-back', '나눗셈식을 곱셈식으로', '①24 ②24 ③22', (d) => {
            // 56÷7=8 → 7×8=56, 8×7=56
            const [a, b, q] = fact(d, ([, y, z]) => y !== z);
            return M(`나눗셈식 ${a} ÷ ${b} = ${josa(q, '을/를')} 곱셈식 2개로 나타내었다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: q }, { label: LABELS[1], answer: b }], {
              figure: lines([expr(b, '*', box(LABELS[0]), '=', a), expr(q, '*', box(LABELS[1]), '=', a)]),
              explain: `${expr(a, '/', b, '=', q)}이므로 ${expr(b, '*', q, '=', a)}, ${expr(q, '*', b, '=', a)}이다.`, facts: { calc: [[E(a, '/', b), 0], [E(a, '/', q), 1]] }
            });
          }),
          T('relate-pick', '여러 수에서 세 수를 골라 나눗셈식 만들기', '②32 ③28', (d) => {
            // 다섯 수 가운데 곱셈식·나눗셈식이 되는 세 수는 한 가지뿐이다
            const works = (list) => { let n = 0; list.forEach((x, i) => list.forEach((y, j) => list.forEach((z, k) => { if (i < j && k !== i && k !== j && x * y === z) n += 1; }))); return n; };
            const [list, a] = d.until(() => { const [p, b, q] = fact(d, ([, y, z]) => y !== z); return [d.shuffle([p, b, q, p + d.pick([-3, -2, -1, 1, 2, 3]), d.int(2, 9)]), p]; }, ([five]) => new Set(five).size === 5 && works(five) === 1);
            return N('수 카드 5장 중에서 3장을 골라 나눗셈식 □ ÷ □ = □를 만들려고 한다. 나누어지는 수가 되는 수는?', a, {
              figure: cards(list), explain: `곱셈구구를 이용하여 두 수의 곱이 다른 한 수가 되는 세 수를 찾는다. 나누어지는 수는 세 수 중 가장 큰 ${a}이다.`, facts: { pickTriple: list }
            });
          }),
          T('relate-cards', '세 수로 곱셈식과 나눗셈식 만들기', '②32 ③28', (d) => {
            // 수 카드 넷 가운데 셋으로 식을 만들면 하나가 남는다.
            const [a, b, q] = fact(d, ([, y, z]) => y < z);
            // 남는 수는 나머지 세 수와 어떻게 짝 지어도 곱셈식이 되지 않는 한 자리 수로 고른다.
            const odd = d.until(() => d.int(2, 9), (v) => v !== b && v !== q && v !== a && v * b !== q && v * b !== a && v * q !== a && b * q !== v);
            const list = d.shuffle([a, b, q, odd]);
            return N('수 카드 4장 중 3장을 골라 곱셈식과 나눗셈식을 만들려고 한다. 사용하지 않는 수는?', odd, {
              figure: numbers(list), explain: `${expr(b, '*', q, '=', a)}, ${expr(a, '/', b, '=', q)}를 만들 수 있다. ${josa(odd, '은/는')} 사용하지 않는다.`, facts: { triple: list }
            });
          })
        ]
      },
      {
        id: 'quot', title: '나눗셈의 몫 구하기', standard: CALC,
        types: [
          T('quot-calc', '몫 구하기', '①40 ②45 ③38', (d) => {
            const [a, b, q] = fact(d, ([, y, z]) => y >= 6 && z >= 6 && y !== z);
            return N('다음을 계산하시오.', q, { figure: expr(a, '/', b, '=', box()), explain: `${expr(b, '*', q, '=', a)}이므로 ${expr(a, '/', b, '=', q)}이다.`, facts: { calc: [[E(a, '/', b), 0]] } });
          }),
          T('quot-times', '몫을 구하는 데 필요한 곱셈식', '①32 ②37 ③33', (d) => {
            // 18÷6 → 6×3=18 (9×2=18 은 6이 없어 쓸 수 없다)
            const [a, b, q] = fact(d, ([, y, z]) => y !== z && y >= 3 && z >= 3 && z <= 8 && y - 1 !== z);
            // 곱이 같아도 나누는 수가 들어 있지 않은 곱셈식은 쓸 수 없다. 그런 식이 있으면 보기에 넣는다.
            const twin = [2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== b && x !== q && a % x === 0 && a / x <= 9 && a / x >= 2).map((x) => [x, a / x])[0];
            const list = d.shuffle([[b, q], [b, q + 1], [b - 1, q], twin || [q, q]]);
            return C(`${a} ÷ ${b}의 몫을 구하는 데 필요한 곱셈식은?`, list.map(([x, y]) => expr(x, '*', y, '=', x * y)), list.findIndex(([x, y]) => x === b && y === q), {
              explain: `${josa(b, '과/와')} 곱하여 ${josa(a, '이/가')} 되는 수를 찾는다. ${expr(b, '*', q, '=', a)}이므로 몫은 ${q}이다.`,
              facts: { times: { a, b, options: list } }
            });
          }),
          T('quot-table', '정해진 단의 곱셈구구로 몫을 구할 수 있는 나눗셈', '②43 ③41', (d) => {
            // 7단: 56÷8 은 7×8=56 으로 구할 수 있다
            const b = d.int(3, 9), inTable = ([x]) => x % b === 0 && x / b <= 9;
            const rows = d.until(() => [fact(d), fact(d), fact(d), fact(d)], (list) => new Set(list.map(([x]) => x)).size === 4 && list.filter(inTable).length === 1 && list.find(inTable)[1] !== b);
            const hit = rows.find(inTable);
            return C(`${b}단 곱셈구구를 이용하여 몫을 구할 수 있는 나눗셈은?`, rows.map(([x, y]) => expr(x, '/', y)), rows.indexOf(hit), {
              explain: `${expr(b, '*', hit[0] / b, '=', hit[0])}이므로 ${expr(hit[0], '/', hit[1], '=', hit[2])}이다.`, facts: { tablePick: { b, rows: rows.map(([x, y]) => [x, y]) } }
            });
          }),
          T('quot-compare', '몫의 크기 비교', '①42 ②47 ③48', (d) => {
            const [a, b, q] = fact(d), [c, e, r] = fact(d, ([x, y, z]) => x !== a && y !== b && Math.abs(z - q) <= 2);
            return C('두 식의 몫을 비교할 때, ○ 안에 알맞은 것은?', SIGNS, q > r ? 0 : q === r ? 1 : 2, {
              figure: `<div class="mb-versus">${expr(a, '/', b)}<span class="mb-ring"></span>${expr(c, '/', e)}</div>`, explain: `${expr(a, '/', b, '=', q)}, ${expr(c, '/', e, '=', r)}`,
              facts: { choose: { exprs: [E(a, '/', b), E(c, '/', e)], rule: 'compare' } }
            });
          }),
          T('quot-odd', '몫이 다른 나눗셈', '①44 ②49 ③47', (d) => {
            // 12÷3, 20÷5, 24÷4, 32÷8 가운데 몫이 다른 것
            const q = d.int(3, 8), divisors = d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
            const other = d.pick([q - 1, q + 1]), at = d.int(0, 3);
            const rows = divisors.map((b, i) => [b * (i === at ? other : q), b]);
            return C('몫이 나머지 셋과 다른 것은?', LABELS, at, {
              figure: tagged(rows.map(([a, b]) => expr(a, '/', b))), explain: rows.map(([a, b], i) => `${LABELS[i]} ${expr(a, '/', b, '=', a / b)}`).join(', '),
              facts: { choose: { exprs: rows.map(([a, b]) => E(a, '/', b)), rule: 'odd' } }
            });
          }),
          T('quot-box', '나눗셈식의 □', '①46 ②35 ③50', (d) => {
            const [a, b, q] = fact(d, ([, y, z]) => y !== z);
            return N('□ 안에 알맞은 수는?', b, { figure: expr(a, '/', box(), '=', q), explain: `${expr(q, '*', b, '=', a)}이므로 □는 ${b}이다.`, facts: { calc: [[E(a, '/', q), 0]] } });
          }),
          T('quot-chain', '이어서 나누기', '③45', (d) => {
            // 72 ÷9 → 8 ÷4 → 2
            const [m, c, n] = fact(d, ([x, y, z]) => x <= 9 && y <= 4), b = d.int(2, 9), a = m * b;
            return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: m }, { label: LABELS[1], answer: n }], {
              figure: chain([a, '÷' + b, box(LABELS[0]), '÷' + c, box(LABELS[1])]), explain: `${expr(a, '/', b, '=', m)}, ${expr(m, '/', c, '=', n)}`,
              facts: { calc: [[E(a, '/', b), 0], [`${a}/${b}/${c}`, 1]] }
            });
          }),
          T('quot-ends', '가장 큰 수를 가장 작은 수로 나누기', '②46 ③46', (d) => {
            // 35, 7, 5, 10, 45 → 45÷5
            const [a, b, q] = fact(d, ([x, y, z]) => x >= 24 && y <= 6);
            const others = d.until(() => [d.int(b + 1, a - 1), d.int(b + 1, a - 1)], ([p, r]) => p !== r);
            const list = d.shuffle([a, b].concat(others));
            return N('가장 큰 수를 가장 작은 수로 나눈 몫은?', q, { figure: numbers(list), explain: `가장 큰 수는 ${a}, 가장 작은 수는 ${b}이다. ` + expr(a, '/', b, '=', q), facts: { divEnds: list } });
          }),
          T('quot-wrong', '몫을 잘못 구한 것', '①45', (d) => {
            const rows = d.until(() => [fact(d), fact(d), fact(d)], (list) => new Set(list.map(([x]) => x)).size === 3);
            const bad = d.int(0, 2), said = rows.map(([, , q], i) => q + (i === bad ? d.pick([-1, 1]) : 0));
            return C('몫을 잘못 구한 것은?', LABELS.slice(0, 3), bad, {
              figure: tagged(rows.map(([a, b], i) => expr(a, '/', b, '=', said[i]))), explain: `${LABELS[bad]}을 바르게 계산하면 ${expr(rows[bad][0], '/', rows[bad][1], '=', rows[bad][2])}이다.`,
              facts: { claimed: rows.map(([a, b], i) => [E(a, '/', b), said[i]]), claimedWant: false }
            });
          }),
          T('quot-week', '문장제: 나누는 수가 글에 숨어 있는 경우', '②60 ③53', (d) => {
            const q = d.int(3, 9), who = d.pick(NAMES);
            return N(`${name(who, '은/는')} ${q * 7}쪽인 책을 일주일 동안 매일 같은 쪽수씩 읽어 모두 읽으려고 한다. 하루에 몇 쪽씩 읽어야 하는가?`, q, { unit: '쪽', explain: `일주일은 7일이다. ` + expr(q * 7, '/', 7, '=', q), facts: { calc: [[E(q * 7, '/', 7), 0]], unseen: [7] } });
          }),
          T('quot-times-as', '문장제: 몇 배인 수에서 처음 수 구하기', '③60', (d) => {
            const [a, k, q] = fact(d, ([, y, z]) => y <= 6 && y !== z);
            return N(`형이 접은 종이학 ${a}마리는 동생이 접은 종이학의 ${k}배이다. 동생이 접은 종이학은 몇 마리인가?`, q, { unit: '마리', explain: `동생이 접은 종이학의 ${k}배가 ${a}마리이다. ` + expr(a, '/', k, '=', q), facts: { calc: [[E(a, '/', k), 0]] } });
          })
        ]
      }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
