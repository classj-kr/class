// 6학년 2학기 4단원 비례식과 비례배분 — 기본 문항(비례배분)과 실력 문항.
// 단원 틀과 함께 쓰는 도구(B.kit.r624), 싣는 기준, 뺀 것과 까닭은 6-2-4a.js 머리에 있다.
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
//
// 실력 문항의 잣대: 기본에서 이미 하는 일(□ 하나 구하기, 간단한 자연수의 비로 한 번 고치기, 비례배분 한 번)을 고르기로 바꾸고 틀린 보기에 흔한 실수 답을 넣은 것은 실력이 아니다. 둘만 싣는다.
//   ① 문제의 상황에 장치가 있어 뜻을 정확히 대야 풀리는 문제
//      이 단원에서 아이들이 흔히 잘못 아는 것: 전항과 후항에 같은 수를 더해도 비율이 같다고 여긴다 / 전항이 두 배가 되었으면 비례식이라고 본다(후항은 보지 않는다) /
//      분수의 비를 분모끼리의 비로 읽는다(1/3 : 1/5 을 3 : 5 로) / 비례식의 두 비에 같은 종류의 양을 같은 자리에 놓지 않는다 /
//      가 : 나 = 2 : 3 이면 가는 전체의 2/3 라고 본다(분모는 두 수의 합이다) / 비례배분하는 전체가 무엇인지 따지지 않는다(차, 한쪽 몫, 둘레) /
//      「가에 대한 나의 비」와 나누는 사람의 차례를 거꾸로 읽는다 / 개수의 비를 값의 비로 그대로 쓴다
//   ② 두 번 넘게 생각해야 풀리는 문제(비를 간단히 한 뒤 한 번 더, 비례식 앞뒤로 한 번 더 셈하기, 한쪽 몫에서 전체로 거꾸로 가기)
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, box, frac, lines, pieces, route, N, M, C, F } = B.kit;
  const { EQ, SHARE, T, tidy, LAB, labelled, gcd, lcm, tail, ex, SIMPLE, truthOf, nat, dec, fr, mx, r, rj, R, P, ratioIn, simplify, val, quot, co, oneOf } = B.kit.r624;
  const U = '6-2-4';
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make: (d, n) => tidy(make(d, n)) }, more || {});
  const tagged = (list) => lines(list.map((html, i) => `<span class="mb-tag mb-tag-short">${LAB[i]}</span>${html}`));
  const BOX = '□';
  const plain = (x, y, z, w) => `${x} : ${y} = ${z} : ${w}`;
  const two = (d) => d.shuffle(NAMES).slice(0, 2);
  // 비례배분 식의 글과 검사 식
  const part = (total, a, b) => `${total} × ${frac(a, `${a} + ${b}`)}`;
  const partE = (total, a, b) => `${total}*${a}/(${a}+${b})`;

  B.addTypes(U, 'share', [
    T('share-word-def', '비례배분의 뜻', '①23 ③26', (d) => {
      const opts = d.shuffle(['비례배분', '비례식', '비율', '백분율']);
      return C('전체를 주어진 비로 배분하는 것을 무엇이라고 하는가?', opts, opts.indexOf('비례배분'), {
        explain: '전체를 주어진 비로 배분하는 것을 비례배분이라고 한다.', facts: truthOf(opts.map((o) => o === '비례배분'), true)
      });
    }),
    T('share-frac', '한쪽 몫이 전체의 몇 분의 몇인지 구하기', '①54 ②59 ③58', (d) => {
      const [a, b] = co(d, 2, 9), k = d.int(2, 8), [p, q] = two(d), [thing, u] = d.pick([['연필', '자루'], ['구슬', '개'], ['색종이', '장'], ['사탕', '개']]), second = d.bool(), mine = second ? b : a;
      return F(`${thing} ${(a + b) * k}${josa(u, '을/를')} ${name(p, '과/와')} ${name(q, '이/가')} ${rj(a, b, '으로/로')} 나누어 가지려고 한다. ${name(second ? q : p, '이/가')} 가지는 ${josa(thing, '은/는')} 전체의 몇 분의 몇인가?`, mine, a + b, {
        anyForm: true, explain: `전체를 ${a} + ${b} = ${josa(a + b, '으로/로')} 볼 때 ${name(second ? q : p, '은/는')} ${mine}만큼 가진다. 따라서 전체의 ${frac(mine, a + b)}이다.`,
        facts: { calc: [[String(mine), 0], [`${a}+${b}`, 1]] }
      });
    }),
    T('share-eq-fill', '비례배분하는 식의 빈칸 채우기', '①55 ②60 ③58 심53', (d) => {
      const [a, b] = co(d, 2, 9), k = d.int(2, 9), total = (a + b) * k, sum = `${a} + ${b}`;
      return M(`${josa(total, '을/를')} ${rj(a, b, '으로/로')} 비례배분하는 식이다. ㉠, ㉡에 알맞은 수는?`, labelled([a, b * k]), {
        figure: lines([ex(`${total} <i>×</i> ${frac(box(LAB[0]), sum)} <i>=</i> ${a * k}`), ex(`${total} <i>×</i> ${frac(b, sum)} <i>=</i> ${box(LAB[1])}`)]),
        explain: `${josa(total, '을/를')} ${rj(a, b, '으로/로')} 나누면 ${total} × ${frac(a, a + b)} = ${a * k}, ${total} × ${frac(b, a + b)} = ${b * k}이다.`,
        facts: { calc: [[String(a), 0], [partE(total, b, a), 1]] }
      });
    }),
    T('share-number', '수를 주어진 비로 비례배분하기', '①56 ②61 ③59 심53', (d) => {
      const [a, b] = co(d, 2, 9), k = d.int(3, 15), total = (a + b) * k;
      return M(`${josa(total, '을/를')} ${rj(a, b, '으로/로')} 비례배분하여 차례로 쓰시오.`, labelled([a * k, b * k]), {
        figure: ex(`${total} <i>→</i> ( ${box(LAB[0])} , ${box(LAB[1])} )`),
        explain: `${total} × ${frac(a, a + b)} = ${a * k}, ${total} × ${frac(b, a + b)} = ${b * k}이다.`,
        facts: { calc: [[partE(total, a, b), 0], [partE(total, b, a), 1]] }
      });
    }),
    T('share-eq-pick', '비례배분하는 알맞은 식 고르기', '①57 ③69 심53', (d) => {
      const [a, b] = co(d, 2, 9), k = d.int(2, 9) * 100, total = (a + b) * k, [p, q] = two(d), second = d.bool(), x = second ? b : a, y = second ? a : b;
      // 보기: 정답 / 분모에 다른 쪽 수만 적은 식(비의 합이 아니다) / 다른 사람의 몫을 구한 식 / 분모를 두 수의 곱으로 적은 식
      const rows = d.shuffle([[`${total} × ${frac(x, `${a} + ${b}`)}`, `${total}*${x}/(${a}+${b})`], [`${total} × ${frac(x, y)}`, `${total}*${x}/${y}`], [`${total} × ${frac(y, `${a} + ${b}`)}`, `${total}*${y}/(${a}+${b})`], [`${total} × ${frac(x, `${a} × ${b}`)}`, `${total}*${x}/(${a}*${b})`]]);
      return C(`${total}원을 ${name(p, '과/와')} ${name(q, '이/가')} ${rj(a, b, '으로/로')} 나누어 가지려고 한다. ${name(second ? q : p, '이/가')} 가지는 돈을 구하는 식으로 알맞은 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1] === `${total}*${x}/(${a}+${b})`), {
        explain: `전체를 ${a} + ${b} = ${josa(a + b, '으로/로')} 볼 때 ${name(second ? q : p, '은/는')} ${x}만큼 가지므로 ${total} × ${frac(x, a + b)} = ${x * k}(원)이다.`,
        facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'equals', target: x * k } }
      });
    }),
    T('share-fix', '잘못 구한 몫을 바르게 구하기', '①57 ③69 심53', (d) => {
      const v = d.until(() => { const [a, b] = co(d, 2, 9), k = d.int(1, 6); return { a, b, total: lcm(a, a + b) * k }; }, (o) => o.total <= 200 && o.total >= 24), p = d.pick(NAMES), wrong = v.total * v.b / v.a, right = v.total * v.b / (v.a + v.b);
      const [thing, u, sold, left] = d.pick([['쿠키', '개', '팔린', '남은'], ['공책', '권', '나누어 준', '남은'], ['색종이', '장', '쓴', '남은']]);
      return N(`${thing} ${v.total}${u} 가운데 ${sold} ${thing} 수와 ${left} ${thing} 수의 비가 ${v.a} : ${v.b}이다. ${name(p, '은/는')} ${left} ${thing} 수를 ${v.total} × ${frac(v.b, v.a)} = ${josa(wrong, '으로/로')} 잘못 구하였다. ${left} ${josa(thing, '은/는')} 몇 ${u}인가?`, right, {
        unit: u, explain: `전체를 ${v.a} + ${v.b} = ${josa(v.a + v.b, '으로/로')} 보아야 한다. ${left} ${thing} 수는 ${v.total} × ${frac(v.b, v.a + v.b)} = ${right}(${u})이다.`,
        facts: { calc: [[partE(v.total, v.b, v.a), 0]] }
      });
    }),
    T('share-can', '낱개를 쪼개지 않고 비례배분할 수 있는 수 찾기', '②63', (d) => {
      const v = d.until(() => { const [a, b] = co(d, 2, 7), k = d.int(2, 7), base = (a + b) * k; return { a, b, list: d.shuffle([base, base + d.int(1, a + b - 1), base - d.int(1, a + b - 1), base + (a + b) + d.int(1, a + b - 1)]) }; }, (o) => new Set(o.list).size === 4 && o.a + o.b >= 5), sum = v.a + v.b;
      const hit = v.list.findIndex((n) => n % sum === 0);
      return C(`구슬을 낱개로 쪼개지 않고 두 사람이 ${rj(v.a, v.b, '으로/로')} 남김없이 나누어 가지려고 한다. 나누어 가질 수 있는 구슬의 수는?`, v.list.map((n) => `${n}개`), hit, {
        explain: `전체를 ${v.a} + ${v.b} = ${josa(sum, '으로/로')} 보므로 구슬의 수가 ${sum}의 배수여야 한다. ${v.list[hit]} ÷ ${sum} = ${v.list[hit] / sum}이므로 ${v.list[hit]}개는 ${v.a * v.list[hit] / sum}개와 ${v.b * v.list[hit] / sum}개로 나눌 수 있다.`,
        facts: { only: { values: v.list.map((n) => n % sum), test: 'atMost', target: 0 } }
      });
    }),
    T('share-band', '나누어 색칠한 띠를 보고 비례배분하기', '①55 ②59 ③60', (d) => {
      const [a, b] = co(d, 1, 7, (x, y) => x + y >= 5 && x + y <= 10), k = d.int(3, 12), total = (a + b) * k;
      return N(`길이가 ${total} cm인 종이띠를 똑같은 칸으로 나누어 ${rj(a, b, '으로/로')} 비례배분하고, 앞쪽 부분을 색칠하였다. 색칠한 부분의 길이는 몇 cm인가?`, a * k, {
        unit: 'cm', figure: pieces('bar', a + b, { shaded: a, scale: 2 }),
        explain: `종이띠를 ${a + b}칸으로 나눈 것 가운데 ${a}칸이 색칠한 부분이다. ${total} × ${frac(a, a + b)} = ${a * k}(cm)이다.`,
        facts: { calc: [[`${total}*${a}/${a + b}`, 0]] }
      });
    }),
    T('share-word', '두 사람이 비로 나누어 가지기', '①58 ②64 ③61 심54', (d) => {
      const [a, b] = co(d, 2, 9), [p, q] = two(d), kind = d.int(0, 4), k = kind === 4 ? d.int(2, 12) * 500 : d.int(3, 12), total = (a + b) * k;
      const [thing, u] = [['구슬', '개'], ['색종이', '장'], ['사탕', '개'], ['붙임딱지', '장'], ['용돈', '원']][kind];
      return M(`${thing} ${total}${josa(u, '을/를')} ${name(p, '과/와')} ${name(q, '이/가')} ${rj(a, b, '으로/로')} 나누어 가지려고 한다. 두 사람이 가지는 ${josa(thing, '은/는')} 각각 ${kind === 4 ? '얼마' : '몇 ' + u}인가?`, [{ label: p, answer: a * k, unit: u }, { label: q, answer: b * k, unit: u }], {
        explain: `${p}: ${total} × ${frac(a, a + b)} = ${a * k}(${u}), ${q}: ${total} × ${frac(b, a + b)} = ${b * k}(${u})이다.`,
        facts: { calc: [[partE(total, a, b), 0], [`${total}*${b}/(${a}+${b})`, 1]] }
      });
    }),
    T('share-sum', '전체의 양과 두 양의 비로 한쪽 양 구하기', '②65 ③61 심54', (d) => {
      // 나누어 갖는 상황이 아니라 두 양이 모여 전체를 이루는 상황이다(관람객, 나무, 책, 섞어 만든 음료). 얼개가 같아 하나만 싣는다.
      const kind = d.int(0, 3), [a, b] = co(d, 2, 9), k = kind === 3 ? d.until(() => d.int(1, 12) * 50, (x) => (a + b) * x <= 2000) : d.int(4, 30), total = (a + b) * k, second = d.bool(), x = second ? b : a;
      const [text, p, q, u] = [
        [`어느 박물관의 관람객은 모두 ${total}명이고, 어른 수와 어린이 수의 비는 ${a} : ${b}이다.`, '어른', '어린이', '명'],
        [`과수원에 사과나무와 배나무가 모두 ${total}그루 있고, 사과나무 수와 배나무 수의 비는 ${a} : ${b}이다.`, '사과나무', '배나무', '그루'],
        [`책꽂이에 동화책과 과학책이 모두 ${total}권 있고, 동화책 수와 과학책 수의 비는 ${a} : ${b}이다.`, '동화책', '과학책', '권'],
        [`매실 원액과 물을 ${rj(a, b, '으로/로')} 섞어 매실 음료 ${total} mL를 만들었다.`, '넣은 매실 원액', '넣은 물', 'mL']
      ][kind];
      return N(`${text} ${josa(second ? q : p, '은/는')} 몇 ${u}인가?`, x * k, {
        unit: u, explain: `전체 ${total}${kind === 3 ? ' mL를' : josa(u, '을/를')} ${rj(a, b, '으로/로')} 비례배분한다. ${total} × ${frac(x, a + b)} = ${x * k}(${u})이다.`,
        facts: { calc: [[`${total}*${x}/(${a}+${b})`, 0]] }
      });
    }),
    T('share-unit', '단위를 바꾸어 비례배분하기', '③61', (d) => {
      const v = d.until(() => { const [a, b] = co(d, 2, 9), big = d.int(1, 6); return { a, b, big }; }, (o) => (o.big * 1000) % (o.a + o.b) === 0), total = v.big * 1000, x = total * v.a / (v.a + v.b), y = total - x;
      const [text, p, q, bu, su, ask] = d.pick([[`길이가 ${v.big} km인 산책로를 ${rj(v.a, v.b, '으로/로')} 나누어 앞쪽은 꽃길로, 뒤쪽은 숲길로 꾸미려고 한다.`, '꽃길', '숲길', 'km', 'm', '꽃길과 숲길의 길이는'], [`쌀 ${v.big} kg을 ${rj(v.a, v.b, '으로/로')} 나누어 큰 통과 작은 통에 담으려고 한다.`, '큰 통', '작은 통', 'kg', 'g', '큰 통과 작은 통에 담는 쌀은'], [`물 ${v.big} L를 ${rj(v.a, v.b, '으로/로')} 나누어 물통과 주전자에 담으려고 한다.`, '물통', '주전자', 'L', 'mL', '물통과 주전자에 담는 물은']]);
      return M(`${text} ${ask} 각각 몇 ${su}인가?`, [{ label: p, answer: x, unit: su }, { label: q, answer: y, unit: su }], {
        explain: `${v.big} ${bu} = ${total} ${su}이다. ${p}: ${total} × ${frac(v.a, v.a + v.b)} = ${x}(${su}), ${q}: ${total} × ${frac(v.b, v.a + v.b)} = ${y}(${su})이다.`,
        facts: { calc: [[`${v.big}*1000*${v.a}/(${v.a}+${v.b})`, 0], [`${v.big}*1000*${v.b}/(${v.a}+${v.b})`, 1]], unseen: [1000] }
      });
    }),
    T('share-diff', '비례배분한 두 몫의 차 구하기', '①56·62 ②62 ③62 심55', (d) => {
      const [a, b] = co(d, 2, 9, (x, y) => x > y), k = d.int(3, 12), total = (a + b) * k, [p, q] = two(d), [thing, u] = d.pick([['색종이', '장'], ['구슬', '개'], ['딱지', '장'], ['밤', '개']]);
      return N(`${thing} ${total}${josa(u, '을/를')} ${name(p, '과/와')} ${name(q, '이/가')} ${rj(a, b, '으로/로')} 나누어 가졌다. ${name(p, '은/는')} ${name(q, '보다/보다')} ${josa(thing, '을/를')} 몇 ${u} 더 많이 가졌는가?`, (a - b) * k, {
        unit: u, explain: `${p}: ${total} × ${frac(a, a + b)} = ${a * k}(${u}), ${q}: ${total} × ${frac(b, a + b)} = ${b * k}(${u})이다. 두 몫의 차는 ${a * k} − ${b * k} = ${(a - b) * k}(${u})이다.`,
        facts: { calc: [[`${total}*${a}/(${a}+${b})-${total}*${b}/(${a}+${b})`, 0]] }
      });
    }),
    T('share-hidden', '전체가 글에 드러나지 않은 비례배분', '①63 ②67 심58', (d, n) => {
      if (n === 0) {
        const [a, b] = d.pick([[5, 7], [7, 5], [5, 3], [3, 5], [11, 13], [13, 11], [1, 2], [2, 1], [3, 1], [1, 3], [5, 1], [1, 5]]), day = d.bool(), x = day ? a : b;
        return N(`어느 날 낮의 길이와 밤의 길이의 비가 ${a} : ${b}이다. 이날 ${day ? '낮' : '밤'}의 길이는 몇 시간인가?`, 24 * x / (a + b), {
          unit: '시간', explain: `하루는 24시간이다. 24시간을 ${rj(a, b, '으로/로')} 비례배분하면 ${day ? '낮' : '밤'}의 길이는 24 × ${frac(x, a + b)} = ${24 * x / (a + b)}(시간)이다.`,
          facts: { calc: [[`24*${x}/(${a}+${b})`, 0]], unseen: [24], rule: 'hidden-day' }
        });
      }
      const v = d.until(() => { const [a, b] = co(d, 2, 9), h = d.int(1, 3); return { a, b, h }; }, (o) => (o.h * 60) % (o.a + o.b) === 0 && o.a + o.b !== 6), p = d.pick(NAMES), [x, y] = d.pick([['책 읽기', '줄넘기'], ['피아노 연습', '그림 그리기'], ['숙제', '운동']]), want = v.h * 60 * v.a / (v.a + v.b);
      return N(`${name(p, '은/는')} ${v.h}시간 동안 ${josa(x, '과/와')} ${josa(y, '을/를')} 하였다. ${josa(x, '을/를')} 한 시간과 ${josa(y, '을/를')} 한 시간의 비가 ${v.a} : ${v.b}일 때, ${josa(x, '을/를')} 한 시간은 몇 분인가?`, want, {
        unit: '분', explain: `${v.h}시간은 ${v.h * 60}분이다. ${v.h * 60}분을 ${rj(v.a, v.b, '으로/로')} 비례배분하면 ${josa(x, '을/를')} 한 시간은 ${v.h * 60} × ${frac(v.a, v.a + v.b)} = ${want}(분)이다.`,
        facts: { calc: [[`${v.h}*60*${v.a}/(${v.a}+${v.b})`, 0]], unseen: [60], rule: 'hidden-hour' }
      });
    }, { count: 2 })
  ]);

  B.addGroup(U, {
    id: 'hard', title: '실력 문제', standard: EQ,
    types: [
      H('h-age-add', '몇 년 뒤 두 사람의 나이의 비', '6·22·65, 기본 ①1 ③2', (d) => {
        // ① 장치: 지금 나이의 비를 문제에 적어 준다. 두 나이에 같은 수를 더하면 비율이 달라지므로 나이를 다시 구해 비를 새로 세워야 한다.
        //    지금의 비를 그대로 적는 아이는 「전항과 후항에 같은 수를 더해도 비율이 같다」고 여긴 것이다.
        const v = d.until(() => ({ x: d.int(8, 14), y: d.int(30, 48), t: d.int(2, 12) }), (o) => gcd(o.x, o.y) >= 2 && gcd(o.x + o.t, o.y + o.t) >= 2 && o.y / gcd(o.x, o.y) <= 9 && (o.y + o.t) / gcd(o.x + o.t, o.y + o.t) <= 9);
        const g1 = gcd(v.x, v.y), g2 = gcd(v.x + v.t, v.y + v.t), p = d.pick(NAMES);
        return M(`올해 ${name(p, '은/는')} ${v.x}살, 선생님은 ${v.y}살이어서 두 사람의 나이의 비는 ${v.x / g1} : ${v.y / g1}이다. ${v.t}년 뒤 ${name(p, '과/와')} 선생님의 나이의 비를 ${SIMPLE}`, ratioIn((v.x + v.t) / g2, (v.y + v.t) / g2), {
          explain: `${v.t}년 뒤 ${name(p, '은/는')} ${v.x + v.t}살, 선생님은 ${v.y + v.t}살이다. ${v.x + v.t} : ${v.y + v.t}의 전항과 후항을 ${josa(g2, '으로/로')} 나누면 ${(v.x + v.t) / g2} : ${(v.y + v.t) / g2}이다. 두 나이에 같은 수를 더하였으므로 비율은 처음과 달라진다.`,
          facts: { calc: [[`(${v.x}+${v.t})/${g2}`, 0], [`(${v.y}+${v.t})/${g2}`, 1]], unseen: [g2] }
        });
      }),
      H('h-count-true', '겉보기와 다른 식 가운데 옳은 비례식의 수', '21·22, 기본 ③27', (d) => {
        // ① 장치: 겉보기와 참·거짓이 어긋나는 식을 섞었다. 몇 배인지 바로 보이지 않는 참인 식(4 : 6 = 6 : 9)과,
        //    전항은 두 배가 되고 후항에는 같은 수만큼 더해 그럴듯한 거짓 식(5 : 8 = 10 : 13)이 함께 있다. 식마다 비율(또는 두 곱)을 따져야 센다.
        const rows = d.until(() => {
          const one = (kind) => {
            const [a, b] = co(d, 2, 9), k = d.int(2, 4), [s, t] = d.pick([[2, 3], [3, 2], [2, 5], [3, 4], [4, 3], [4, 6], [6, 4]]);
            return kind === 'hidden' ? [a * s, b * s, a * t, b * t] : kind === 'add' ? [a, b, a * 2, b + a] : kind === 'plain' ? [a, b, a * k, b * k] : [a, b, b * k, a * k];
          };
          return d.shuffle([one('hidden'), one('add'), one(d.pick(['plain', 'swap'])), one(d.pick(['hidden', 'add']))]);
        }, (l) => new Set(l.map((x) => x.join())).size === 4 && l.every((x) => Math.max(...x) <= 60 && x[0] !== x[1]));
        const ok = rows.map(([x, y, z, w]) => x * w === y * z), count = ok.filter(Boolean).length;
        return N('두 비를 기호 =로 이어 식을 썼다. 옳은 비례식은 모두 몇 개인가?', count, {
          unit: '개', figure: tagged(rows.map((x) => P(...x))),
          explain: `외항의 곱과 내항의 곱을 비교한다. ${rows.map(([x, y, z, w], i) => `${LAB[i]} ${x * w}${tail(x * w, '과/와')} ${y * z}`).join(', ')}이다. 두 곱이 같은 식은 ${LAB.filter((_, i) => ok[i]).join(', ')}이다.`,
          facts: { choose: { exprs: rows.map(([x, y, z, w]) => `1+(${x}*${w}-${y}*${z})*(${x}*${w}-${y}*${z})`), rule: 'countBelow', target: 1.5 }, unseen: [1] }
        });
      }),
      H('h-frac-order', '겉보기와 다른 분수의 비 가려내기', '4·10, 기본 ①17', (d) => {
        // ① 장치: 1/a : 1/b 은 a : b 가 아니라 b : a 이다. 분모만 보고 읽으면 같은 비는 달라 보이고 다른 비는 같아 보인다.
        //    보기: 단위분수의 비(분모가 뒤바뀌어 보이지만 같은 비) / 단위분수의 비(분모는 그대로지만 다른 비) / 소수의 비 / 분모가 같은 분수의 비
        const [a, b] = co(d, 2, 9), u = d.until(() => d.int(1, 9), (x) => (a * x) % 10 !== 0 && (b * x) % 10 !== 0 && a * x < 100 && b * x < 100), den = [11, 13, 17].find((x) => x > Math.max(a, b)), same = d.bool();
        const rows = d.shuffle(same ? [[fr(1, b), fr(1, a)], [fr(1, a), fr(1, b)], [dec(b * u, 1), dec(a * u, 1)], [fr(b, den), fr(a, den)]] : [[fr(1, b), fr(1, a)], [fr(1, a), fr(1, b)], [dec(a * u, 1), dec(b * u, 1)], [fr(a, den), fr(b, den)]]);
        const hit = rows.findIndex(([x, y]) => (x.p * y.q * b === y.p * x.q * a) === same);
        return C(`비율이 ${rj(a, b, '과/와')} ${same ? '같은' : '같지 않은'} 비는?`, rows.map(([x, y]) => R(x, y)), hit, {
          explain: `가장 간단한 자연수의 비로 나타내면 ${rows.map(([x, y]) => { const s = simplify(x, y); return `${R(x, y)}${tail(y.last, '은/는')} ${s.a} : ${s.b}`; }).join(', ')}이다. 분수의 비는 분모끼리의 비가 아니다.`,
          facts: { choose: { exprs: rows.map(([x, y]) => `${x.ex}/${y.ex}`), rule: 'odd' } }
        });
      }),
      H('h-setup-wrong', '자리가 서로 다른 비례식 가운데 잘못 세운 것', '39·41·44, 기본 ①44', (d) => {
        // ① 장치: 옳은 비례식이 한 가지 꼴만은 아니다. 「분 : L = 분 : L」도 「분 : 분 = L : L」도 「L : 분 = L : 분」도 옳다.
        //    같은 종류의 양이 같은 자리에 놓였는지를 식마다 따져야 한다. 외운 꼴 하나와 다르다고 고르면 틀린다.
        const [a, b] = co(d, 2, 9), k = d.int(2, 7), c = b * k, x = a * k;
        const [text, ask] = d.pick([[`${a}분 동안 물이 ${b} L 나오는 수도꼭지가 있다. 같은 빠르기로 물 ${c} L를 받는 데 걸리는 시간을 □분이라 할 때,`, '분'], [`${a}분 동안 ${b} km를 달리는 자전거가 있다. 같은 빠르기로 ${c} km를 달리는 데 걸리는 시간을 □분이라 할 때,`, '분'], [`구슬 ${a}봉지의 무게는 ${b} kg이다. 구슬 ${c} kg이 되는 봉지 수를 □봉지라 할 때,`, '봉지']]);
        const good = [[a, b, BOX, c], [a, BOX, b, c], [b, a, c, BOX]], bad = d.pick([[a, b, c, BOX], [a, c, BOX, b], [BOX, a, b, c]]), num = (t) => (t === BOX ? x : t);
        return oneOf(d, `${text} 비례식을 잘못 세운 것은?`, good.concat([bad]).map((f) => [plain(...f), num(f[0]) * num(f[3]) === num(f[1]) * num(f[2]), [`${num(f[0])}*${num(f[3])}`, num(f[1]) * num(f[2])]]), false, {
          explain: (row) => `□ = ${x}이다. ${row[0]}에 ${x}${tail(x, '을/를')} 넣으면 외항의 곱과 내항의 곱이 달라지므로 잘못 세운 식이다. 나머지 식은 같은 종류의 양을 같은 자리에 놓았다.`
        });
      }),
      H('h-which-share', '비례배분 식으로 구할 수 있는 상황 찾기', '53·55·60, 기본 ②59', (d) => {
        // ① 장치: 비례배분은 「전체」를 나누는 것이다. 같은 수와 같은 비가 적혀 있어도 그 수가 두 몫의 차이거나 한쪽 몫이면 이 식을 쓸 수 없고, 나누는 사람의 차례가 바뀌어도 쓸 수 없다.
        //    ㉠ 전체를 나눔(정답) ㉡ 그 수가 차 ㉢ 그 수가 한쪽 몫 ㉣ 사람의 차례가 바뀜
        const v = d.until(() => { const [a, b] = co(d, 2, 7, (x, y) => x < y); return { a, b, total: lcm(lcm(a, b - a), a + b) * d.int(1, 3) }; }, (o) => o.total <= 150), [p, q] = two(d), { a, b, total } = v;
        const rows = [
          [`${name(p, '과/와')} ${name(q, '이/가')} 구슬 ${total}개를 ${rj(a, b, '으로/로')} 나누어 가졌다.`, true, [`${total}*${b}/(${a}+${b})`, total * b / (a + b)]],
          [`${name(p, '과/와')} ${name(q, '이/가')} 가진 구슬 수의 비는 ${a} : ${b}이고, ${name(q, '이/가')} ${name(p, '보다/보다')} ${total}개 더 많이 가졌다.`, false, [`${total}/(${b}-${a})*${b}`, total * b / (a + b)]],
          [`${name(p, '과/와')} ${name(q, '이/가')} 가진 구슬 수의 비는 ${a} : ${b}이고, ${name(p, '이/가')} 가진 구슬은 ${total}개이다.`, false, [`${total}/${a}*${b}`, total * b / (a + b)]],
          [`${name(q, '과/와')} ${name(p, '이/가')} 구슬 ${total}개를 ${rj(a, b, '으로/로')} 나누어 가졌다.`, false, [`${total}*${a}/(${a}+${b})`, total * b / (a + b)]]
        ];
        return oneOf(d, `${name(q, '이/가')} 가진 구슬의 수를 식 ${total} × ${frac(b, `${a} + ${b}`)}${tail(b, '으로/로')} 구할 수 있는 것은?`, rows, true, {
          tags: true,
          explain: (row, tag) => `이 식은 전체 ${total}개를 ${rj(a, b, '으로/로')} 나눌 때 뒤쪽 사람의 몫을 구하는 식이다. ${tag}만 구슬 ${total}개가 전체이고 ${name(q, '이/가')} 뒤쪽이다. ${total}개가 두 사람의 차이거나 한쪽이 가진 수이면 이 식으로 구할 수 없다.`
        });
      }, { standard: SHARE }),
      H('h-drink', '재료에 섞는 양과 만든 음료에 든 양', '53, 기본 ②65 ③10', (d) => {
        // ① 장치: 같은 600 mL 가 한 번은 재료 하나(물)의 양이고 한 번은 섞어 만든 전체의 양이다. 1 : 4 로 섞으면 원액은 물의 1/4 이지만 음료 전체의 1/5 이다.
        //    두 칸에 같은 수를 적는 아이는 부분과 전체를 가리지 않은 것이다.
        const v = d.until(() => { const [a, b] = co(d, 1, 6, (x, y) => x < y); return { a, b, amount: lcm(b, a + b) * d.int(1, 12) * 10 }; }, (o) => o.amount >= 200 && o.amount <= 900);
        const [p, s, mix] = d.pick([['매실 원액', '물', '매실 음료'], ['딸기 원액', '우유', '딸기 우유'], ['레몬즙', '물', '레몬 음료']]), x = v.amount * v.a / v.b, y = v.amount * v.a / (v.a + v.b);
        return M(`${josa(p, '과/와')} ${josa(s, '을/를')} ${rj(v.a, v.b, '으로/로')} 섞어 ${josa(mix, '을/를')} 만든다. ㉠ ${s} ${v.amount} mL에 섞는 ${p}의 양과 ㉡ ${mix} ${v.amount} mL에 들어 있는 ${p}의 양은 각각 몇 mL인가?`, [{ label: LAB[0], answer: x, unit: 'mL' }, { label: LAB[1], answer: y, unit: 'mL' }], {
          explain: `㉠ ${s}의 양이 ${v.amount} mL이므로 ${v.a} : ${v.b} = □ : ${v.amount}에서 □ = ${x}이다. ㉡ 섞어 만든 전체의 양이 ${v.amount} mL이므로 비례배분하여 ${v.amount} × ${frac(v.a, v.a + v.b)} = ${y}(mL)이다.`,
          facts: { calc: [[`${v.amount}*${v.a}/${v.b}`, 0], [partE(v.amount, v.a, v.b), 1]] }
        });
      }, { standard: SHARE }),
      H('h-share-about', '「~에 대한 ~의 비」로 나눈 몫', '57, 기본 ②22', (d) => {
        // ① 장치: 「가가 가진 수에 대한 나가 가진 수의 비」는 (나) : (가)이다. 먼저 나온 이름을 전항으로 읽으면 두 몫이 뒤바뀐다(그 값도 자연수이다).
        const [a, b] = co(d, 2, 9), k = d.int(3, 12), total = (a + b) * k, [p, q] = two(d), [thing, u] = d.pick([['딱지', '장'], ['구슬', '개'], ['색종이', '장']]);
        return N(`${name(p, '과/와')} ${name(q, '이/가')} ${thing} ${total}${josa(u, '을/를')} 나누어 가졌다. ${name(p, '이/가')} 가진 ${thing} 수에 대한 ${name(q, '이/가')} 가진 ${thing} 수의 비가 ${a} : ${b}일 때, ${name(p, '이/가')} 가진 ${josa(thing, '은/는')} 몇 ${u}인가?`, b * k, {
          unit: u, explain: `기준량이 후항이므로 (${name(q, '이/가')} 가진 수) : (${name(p, '이/가')} 가진 수) = ${a} : ${b}이다. ${name(p, '이/가')} 뒤쪽이므로 ${name(p, '의/의')} 몫은 ${total} × ${frac(b, a + b)} = ${b * k}(${u})이다.`,
          facts: { calc: [[`${total}*${b}/(${a}+${b})`, 0]] }
        });
      }, { standard: SHARE }),
      H('h-perimeter', '둘레와 가로·세로의 비로 가로 구하기', '50, 기본 ①65 ②70 ③66', (d) => {
        // ① 장치: 비례배분할 전체는 둘레가 아니라 가로와 세로의 합(둘레의 반)이다. 둘레를 그대로 나누면 두 배가 나온다.
        const [a, b] = co(d, 2, 9), k = d.int(2, 9), around = (a + b) * k * 2, wide = d.bool(), x = wide ? a : b;
        return N(`둘레가 ${around} cm인 직사각형의 가로와 세로의 비가 ${a} : ${b}이다. 이 직사각형의 ${wide ? '가로' : '세로'}는 몇 cm인가?`, x * k, {
          unit: 'cm', explain: `직사각형의 둘레는 (가로 + 세로) × 2이므로 가로와 세로의 합은 ${around} ÷ 2 = ${around / 2}(cm)이다. ${around / 2} cm를 ${rj(a, b, '으로/로')} 비례배분하면 ${wide ? '가로' : '세로'}는 ${around / 2} × ${frac(x, a + b)} = ${x * k}(cm)이다.`,
          facts: { calc: [[`${around}/2*${x}/(${a}+${b})`, 0]], unseen: [2] }
        });
      }, { standard: SHARE }),
      H('h-coin-value', '개수의 비로 값의 비 구하기', '62', (d) => {
        // ① 장치: 주어진 비는 개수의 비이다. 한 개의 값이 다르므로 값의 비는 개수의 비와 같지 않다. 개수의 비를 그대로 적으면 틀린다.
        const v = d.until(() => { const [a, b] = co(d, 2, 9), [x, y] = d.pick([[100, 500], [50, 100], [500, 100], [300, 500], [400, 600], [200, 500], [600, 900]]); return { a, b, x, y }; }, (o) => o.a * o.x !== o.b * o.y);
        const g = gcd(v.a * v.x, v.b * v.y), coin = [50, 100, 500].includes(v.x) && [50, 100, 500].includes(v.y);
        const text = coin ? `저금통에 ${v.x}원짜리 동전과 ${v.y}원짜리 동전이 들어 있고, 두 동전의 개수의 비는 ${v.a} : ${v.b}이다. ${v.x}원짜리 동전을 모두 합한 금액과 ${v.y}원짜리 동전을 모두 합한 금액의 비를 ${SIMPLE}`
          : `한 개에 ${v.x}원인 사탕과 한 개에 ${v.y}원인 초콜릿을 샀다. 산 사탕 수와 초콜릿 수의 비가 ${v.a} : ${v.b}일 때, 사탕값과 초콜릿값의 비를 ${SIMPLE}`;
        return M(text, ratioIn(v.a * v.x / g, v.b * v.y / g), {
          explain: `개수를 ${v.a}개, ${v.b}개로 보면 금액은 ${v.x} × ${v.a} = ${v.x * v.a}(원), ${v.y} × ${v.b} = ${v.y * v.b}(원)이다. ${v.x * v.a} : ${v.y * v.b}의 전항과 후항을 ${josa(g, '으로/로')} 나누면 ${v.a * v.x / g} : ${v.b * v.y / g}이다. 개수의 비와 금액의 비는 다르다.`,
          facts: { calc: [[`${v.a}*${v.x}/${g}`, 0], [`${v.b}*${v.y}/${g}`, 1]], unseen: [g] }
        });
      }),
      H('h-mix-say', '말한 차례와 전체·부분이 섞인 말에서 주어진 비로 섞은 것 찾기', '기본 ③10, 53', (d) => {
        // ① 장치: 섞은 양을 말하는 차례가 비의 차례와 다르고, 재료의 양 대신 만든 전체의 양을 말한 것이 섞여 있다. 말마다 (원액) : (물)로 고쳐 적어야 가릴 수 있다.
        //    보기: 물을 먼저 말했지만 바르게 섞음(정답) / 두 양을 바꾸어 섞음 / 원액과 「만든 음료」의 양이 a : b / 물이 전체 몫만큼
        const v = d.until(() => { const [a, b] = co(d, 1, 6, (x, y) => x < y && y - x !== x); return { a, b, k: d.shuffle([20, 30, 40, 50, 60, 100]) }; }, (o) => o.b * 100 <= 900);
        const [p, s, mix] = d.pick([['매실 원액', '물', '매실 음료'], ['딸기 원액', '우유', '딸기 우유'], ['레몬즙', '물', '레몬 음료']]), { a, b, k } = v;
        const rows = [
          [`${s} ${b * k[0]} mL에 ${p} ${a * k[0]} mL를 넣었다.`, a * k[0], b * k[0]],
          [`${p} ${b * k[1]} mL에 ${s} ${a * k[1]} mL를 넣었다.`, b * k[1], a * k[1]],
          [`${p} ${a * k[2]} mL에 ${josa(s, '을/를')} 넣어 ${mix} ${b * k[2]} mL를 만들었다.`, a * k[2], (b - a) * k[2]],
          [`${p} ${a * k[3]} mL와 ${s} ${(a + b) * k[3]} mL를 섞었다.`, a * k[3], (a + b) * k[3]]
        ];
        return oneOf(d, `${josa(p, '과/와')} ${josa(s, '을/를')} ${rj(a, b, '으로/로')} 섞어 ${josa(mix, '을/를')} 만들려고 한다. 알맞게 섞은 것은?`, rows.map(([text, x, y]) => [text, x * b === y * a, [`${x}*${b}`, y * a]]), true, {
          explain: `(${p}) : (${s})의 차례로 고쳐 적으면 ${rows.map(([, x, y]) => r(x, y)).join(', ')}이다. 이 가운데 ${rj(a, b, '과/와')} 비율이 같은 것은 ${a * k[0]} : ${b * k[0]}뿐이다.`
        });
      }),
      H('h-scale-term', '간단한 자연수의 비로 고친 뒤 한 항에 맞추기', '14, 기본 ①18 ②19 ③22', (d) => {
        // ② 두 단계: 소수·분수의 비를 가장 간단한 자연수의 비로 고친다 → 후항(전항)이 주어진 수가 되게 같은 수를 곱한다.
        const v = d.until(() => {
          const [a, b] = co(d, 1, 9, (x, y) => x < y), m = d.int(2, 39), kind = d.int(0, 1), f = kind === 0 ? fr(a, b) : mx(d.int(1, 3), a, b), e = dec(m, 1);
          return d.bool() ? [e, f] : [f, e];
        }, ([x, y]) => (x.kind === 'dec' ? x : y).p % 10 !== 0 && [2, 4, 5].includes((x.kind === 'dec' ? y : x).d) && simplify(x, y).a <= 15 && simplify(x, y).b <= 15 && simplify(x, y).a !== simplify(x, y).b && simplify(x, y).K * simplify(x, y).g !== 10);
        const [x, y] = v, s = simplify(x, y), t = d.int(2, 6), back = d.bool(), given = back ? s.b * t : s.a * t, want = back ? s.a * t : s.b * t, q = back ? quot([x, nat(given)], [y], want) : quot([y, nat(given)], [x], want);
        return N(`${R(x, y)}${tail(y.last, '을/를')} ${back ? '후항' : '전항'}이 ${given}인 자연수의 비로 나타내려고 한다. ${back ? '전항' : '후항'}은?`, want, {
          explain: `${R(x, y)}${tail(y.last, '을/를')} 가장 간단한 자연수의 비로 나타내면 ${s.a} : ${s.b}이다. ${back ? s.b : s.a} × ${t} = ${given}이므로 전항과 후항에 ${josa(t, '을/를')} 곱하면 ${s.a * t} : ${s.b * t}이다.`,
          facts: { calc: [[q.text, 0]], unseen: q.unseen }
        });
      }),
      H('h-product-two', '외항의 곱이 주어진 비례식의 두 수', '35, 기본 ①41 ②44 ③41', (d) => {
        // ② 두 단계: 주어진 곱으로 한 수를 구한다 → 「외항의 곱과 내항의 곱은 같다」로 다른 쪽 곱도 같은 수임을 알아 나머지 수를 구한다.
        const v = d.until(() => { const [a, b] = co(d, 2, 9), [s, t] = d.until(() => [d.int(1, 6), d.int(1, 6)], ([x, y]) => x !== y); return [a * s, b * s, a * t, b * t]; }, (l) => new Set(l).size === 4 && l[0] * l[3] <= 400);
        const form = d.bool(), outerGiven = d.bool(), prod = v[0] * v[3];
        // form: ㉠ : b = ㉡ : d (㉠ 외항, ㉡ 내항) 또는 a : ㉠ = c : ㉡ (㉠ 내항, ㉡ 외항)
        const shown = form ? [box(LAB[0]), v[1], box(LAB[1]), v[3]] : [v[0], box(LAB[0]), v[2], box(LAB[1])], ans = form ? [v[0], v[2]] : [v[1], v[3]], known = form ? [v[3], v[1]] : [v[2], v[0]];
        return M(`다음 비례식에서 ${outerGiven ? '외항' : '내항'}의 곱이 ${prod}이다. ㉠, ㉡에 알맞은 수는?`, labelled(ans), {
          figure: P(...shown),
          explain: `외항의 곱과 내항의 곱은 같으므로 두 곱이 모두 ${prod}이다. ㉠ × ${known[0]} = ${prod}에서 ㉠ = ${ans[0]}, ${known[1]} × ㉡ = ${prod}에서 ㉡ = ${ans[1]}이다.`,
          facts: { calc: [[`${prod}/${known[0]}`, 0], [`${prod}/${known[1]}`, 1]] }
        });
      }),
      H('h-chain-two', '한 수가 이어지는 두 비례식', '34', (d) => {
        // ② 두 단계: 첫 비례식에서 ㉠을 구한다 → 그 수를 둘째 비례식에 넣어 ㉡을 구한다.
        const v = d.until(() => {
          const [a, b] = co(d, 2, 9), [s, t] = d.until(() => [d.int(1, 6), d.int(1, 6)], ([x, y]) => x !== y), first = [a * s, b * s, a * t, b * t], x = first[1], [c, e] = co(d, 2, 9), k = d.int(2, 9);
          return { first, x, second: [c * k, e * k, c * x / gcd(x, e), x], ok: x % e === 0, c, e };
        }, (o) => o.ok && o.second[2] === o.c * o.x / o.e && new Set(o.first).size === 4 && o.second[0] !== o.second[2] && o.second[2] <= 99 && o.first.every((n) => n <= 60));
        return N('두 비례식의 ㉠에는 같은 수가 들어간다. ㉡에 알맞은 수는?', v.second[2], {
          figure: lines([P(v.first[0], box(LAB[0]), v.first[2], v.first[3]), P(v.second[0], v.second[1], box(LAB[1]), box(LAB[0]))]),
          explain: `첫째 식에서 ㉠ × ${v.first[2]} = ${v.first[0]} × ${v.first[3]} = ${v.first[0] * v.first[3]}이므로 ㉠ = ${v.x}이다. 둘째 식은 ${v.second[0]} : ${v.second[1]} = ㉡ : ${v.x}이므로 ${v.second[1]} × ㉡ = ${v.second[0]} × ${v.x} = ${v.second[0] * v.x}, ㉡ = ${v.second[2]}이다.`,
          facts: { calc: [[`${v.second[0]}*(${v.first[0]}*${v.first[3]}/${v.first[2]})/${v.second[1]}`, 0]] }
        });
      }),
      H('h-buy-rest', '거스름돈을 뺀 값으로 산 개수 구하기', '41, 기본 ③57', (d) => {
        // ② 두 단계: 비례식에 넣을 값이 글에 바로 없다. 낸 돈에서 거스름돈을 빼 물건값을 구한다 → 비례식으로 개수를 구한다.
        const v = d.until(() => ({ a: d.int(2, 5), p: d.int(12, 60) * 100, k: d.int(2, 6), pay: d.pick([5000, 10000, 20000]) }), (o) => (o.p / 100) % o.a !== 0 && o.p * o.k < o.pay && o.pay - o.p * o.k <= 4000 && o.pay - o.p * o.k >= 500);
        const [thing, u] = d.pick([['공책', '권'], ['볼펜', '자루'], ['지우개', '개']]), p = d.pick(NAMES), change = v.pay - v.p * v.k;
        return N(`${thing} ${v.a}${u}의 값은 ${v.p}원이다. ${name(p, '이/가')} ${v.pay}원을 내고 ${josa(thing, '을/를')} 사고 ${change}원을 거슬러 받았다. ${name(p, '이/가')} 산 ${josa(thing, '은/는')} 몇 ${u}인가?`, v.a * v.k, {
          unit: u, explain: `${thing}값은 ${v.pay} − ${change} = ${v.p * v.k}(원)이다. 산 수를 □라 하면 ${v.a} : ${v.p} = □ : ${v.p * v.k}이다. □ × ${v.p} = ${v.a} × ${v.p * v.k}이므로 □ = ${v.a * v.k}이다.`,
          facts: { calc: [[`${v.a}*(${v.pay}-${change})/${v.p}`, 0]] }
        });
      }),
      H('h-percent-rest', '판 양의 백분율과 남은 양으로 전체 구하기', '45', (d) => {
        // ② 두 단계: 남은 양이 전체의 몇 %인지 구한다(100 − 판 백분율) → 비례식으로 전체를 구한다. 판 백분율을 그대로 비례식에 넣으면 틀린다.
        const v = d.until(() => ({ sold: d.pick([55, 60, 65, 70, 75, 80, 85, 90]), total: d.int(3, 30) * 20 }), (o) => ((100 - o.sold) * o.total) % 100 === 0), left = (100 - v.sold) * v.total / 100;
        const [shop, thing, u] = d.pick([['과일 가게', '귤', 'kg'], ['쌀 가게', '쌀', 'kg'], ['문구점', '공책', '권'], ['꽃집', '장미', '송이']]), gap = u === 'kg' ? ' ' : '';
        return N(`${shop}에서 처음에 있던 ${thing}의 ${v.sold} %를 팔았더니 ${left}${gap}${u}${u === '송이' ? '가' : '이'} 남았다. 처음에 있던 ${josa(thing, '은/는')} 몇 ${u}인가?`, v.total, {
          unit: u, explain: `남은 ${josa(thing, '은/는')} 전체의 100 − ${v.sold} = ${100 - v.sold}(%)이다. 전체를 □라 하면 ${100 - v.sold} : ${left} = 100 : □이다. ${100 - v.sold} × □ = ${left} × 100이므로 □ = ${v.total}이다.`,
          facts: { calc: [[`${left}*100/(100-${v.sold})`, 0]], unseen: [100] }
        });
      }),
      H('h-share-frac', '분수·소수의 비로 비례배분하기', '56, 기본 ①61 ②68 ③65', (d) => {
        // ② 두 단계: 분수·소수의 비를 가장 간단한 자연수의 비로 고친다 → 그 비로 비례배분한다.
        const v = d.until(() => {
          const kind = d.int(0, 2), [a, b] = co(d, 1, 7, (x, y) => x < y), [c, e] = co(d, 1, 7, (x, y) => x < y);
          return kind === 0 ? [fr(a, b), fr(c, e)] : kind === 1 ? [dec(d.int(2, 29), 1), fr(c, e)] : [fr(a, b), dec(d.int(2, 29), 1)];
        }, ([x, y]) => [x, y].every((o) => o.kind !== 'dec' || o.p % 10 !== 0) && x.p * y.q !== y.p * x.q && simplify(x, y).a + simplify(x, y).b <= 20 && simplify(x, y).K <= 60 && [x, y].every((o) => o.kind !== 'frac' || [2, 3, 4, 5, 6, 7, 8].includes(o.d)));
        const [x, y] = v, s = simplify(x, y), k = d.int(2, 12), total = (s.a + s.b) * k, want = s.a * k, [p, q] = two(d);
        const [text, u] = d.pick([[`끈 ${total} cm를 ${name(p, '과/와')} ${name(q, '이/가')} ${R(x, y)}${tail(y.last, '으로/로')} 나누어 가졌다. ${name(p, '이/가')} 가진 끈은 몇 cm인가?`, 'cm'], [`주스 ${total * 10} mL를 ${name(p, '과/와')} ${name(q, '이/가')} ${R(x, y)}${tail(y.last, '으로/로')} 나누어 마셨다. ${name(p, '이/가')} 마신 주스는 몇 mL인가?`, 'mL']]);
        const T2 = u === 'mL' ? total * 10 : total, W = u === 'mL' ? want * 10 : want, got = T2 * val(x) / (val(x) + val(y));
        return N(text, W, {
          unit: u, explain: `${R(x, y)}${tail(y.last, '을/를')} 가장 간단한 자연수의 비로 나타내면 ${s.a} : ${s.b}이다. ${T2} × ${frac(s.a, s.a + s.b)} = ${W}(${u})이다.`,
          facts: got === W ? { calc: [[`${T2}*${x.ex}/(${x.ex}+${y.ex})`, 0]] } : { calc: [[`${T2}*${s.a}/(${s.a}+${s.b})`, 0]], unseen: [s.a, s.b] }
        });
      }, { standard: SHARE }),
      H('h-share-back', '한쪽 몫에서 처음 전체 구하기', '60, 기본 ①52·64 ②54', (d) => {
        // ② 거꾸로 한 번: 비례배분한 한쪽 몫으로 다른 쪽 몫(또는 한 묶음의 크기)을 구해 처음 전체로 돌아간다.
        //    (한쪽 양을 비례식으로 구한 뒤 더해 전체를 구하는 꼴 ①52 ②54 와 얼개가 같아 이 유형 하나로 싣는다.)
        const [a, b] = co(d, 2, 9), k = d.int(3, 15), [p, q] = two(d), [thing, u] = d.pick([['색종이', '장'], ['구슬', '개'], ['붙임딱지', '장'], ['밤', '개']]), second = d.bool(), x = second ? b : a;
        return N(`${josa(thing, '을/를')} ${name(p, '과/와')} ${name(q, '이/가')} ${rj(a, b, '으로/로')} 나누어 가졌더니 ${name(second ? q : p, '이/가')} ${x * k}${josa(u, '을/를')} 가지게 되었다. 나누기 전의 ${josa(thing, '은/는')} 모두 몇 ${u}인가?`, (a + b) * k, {
          unit: u, explain: `${name(second ? q : p, '의/의')} 몫은 전체의 ${frac(x, a + b)}이다. 전체를 □라 하면 ${x} : ${a + b} = ${x * k} : □이므로 □ = ${(a + b) * k}이다.`,
          facts: { calc: [[`${x * k}*(${a}+${b})/${x}`, 0]] }
        });
      }, { standard: SHARE }),
      H('h-invest', '낸 돈의 비로 번 돈 나누기', '54·56·61, 기본 ①59 ②66 ③63', (d) => {
        // ② 두 단계: 두 사람이 낸 돈의 비를 세워 가장 간단한 자연수의 비로 고친다 → 번 돈을 그 비로 비례배분한다.
        //    (사람 수·일한 시간의 비를 세워 나누는 꼴 ①59 ②66 ③63 과 얼개가 같아 이 유형 하나로 싣는다.)
        const v = d.until(() => { const [a, b] = co(d, 2, 9), m = d.int(2, 9) * 1000, k = d.int(2, 9) * 1000; return { a, b, m, k }; }, (o) => o.a * o.m <= 60000 && o.b * o.m <= 60000 && o.k > o.m);
        const [p, q] = two(d), total = (v.a + v.b) * v.k, second = d.bool(), x = second ? v.b : v.a;
        return N(`${name(p, '과/와')} ${name(q, '이/가')} 각각 ${v.a * v.m}원, ${v.b * v.m}원을 내어 재료를 사서 쿠키를 만들어 팔았더니 모두 ${total}원을 벌었다. 번 돈을 두 사람이 낸 돈의 비로 나누어 가질 때 ${name(second ? q : p, '이/가')} 가지는 돈은 얼마인가?`, x * v.k, {
          unit: '원', explain: `낸 돈의 비 ${v.a * v.m} : ${v.b * v.m}의 전항과 후항을 ${josa(v.m, '으로/로')} 나누면 ${v.a} : ${v.b}이다. ${total}원을 ${rj(v.a, v.b, '으로/로')} 비례배분하면 ${name(second ? q : p, '의/의')} 몫은 ${total} × ${frac(x, v.a + v.b)} = ${x * v.k}(원)이다.`,
          facts: { calc: [[`${total}*${x * v.m}/(${v.a * v.m}+${v.b * v.m})`, 0]] }
        });
      }, { standard: SHARE }),
      H('h-rest-share', '먼저 덜어 낸 나머지를 비례배분하기', '59, 기본 ③72', (d) => {
        // ② 두 단계: 먼저 준 것을 빼어 나눌 전체를 구한다 → 나머지를 비례배분한다. 처음 수를 그대로 나누면 틀린다.
        const [a, b] = co(d, 2, 9), k = d.int(4, 20), rest = (a + b) * k, first = d.int(2, 12) * 5, total = rest + first, [thing, u] = d.pick([['지우개', '개'], ['공책', '권'], ['색연필', '자루']]), second = d.bool(), x = second ? b : a;
        return N(`${thing} ${total}${u} 가운데 ${first}${josa(u, '을/를')} 1반에 먼저 주고, 나머지를 2반과 3반에 ${rj(a, b, '으로/로')} 나누어 주었다. ${second ? '3반' : '2반'}이 받은 ${josa(thing, '은/는')} 몇 ${u}인가?`, x * k, {
          unit: u, explain: `1반에 주고 남은 ${josa(thing, '은/는')} ${total} − ${first} = ${rest}(${u})이다. ${rest}${josa(u, '을/를')} ${rj(a, b, '으로/로')} 비례배분하면 ${second ? '3반' : '2반'}의 몫은 ${rest} × ${frac(x, a + b)} = ${x * k}(${u})이다.`,
          facts: { calc: [[`(${total}-${first})*${x}/(${a}+${b})`, 0]] }
        });
      }, { standard: SHARE }),
      H('h-times-share', '「몇 배」「몇 분의 몇」을 비로 바꾸어 비례배분하기', '57, 기본 ①60 ②69 ③64', (d) => {
        // ② 두 단계: 「가는 나의 2배」를 가 : 나 = 2 : 1 로, 「가는 나의 3/5」를 가 : 나 = 3 : 5 로 바꾼다(차례를 맞춘다) → 전체를 그 비로 비례배분한다.
        const byFrac = d.bool(), [p, q] = byFrac ? co(d, 2, 9, (x, y) => x < y) : [d.int(2, 5), 1], k = d.int(3, 15), total = (p + q) * k * (byFrac ? 1 : 2);
        const kk = total / (p + q), [text, u, pair] = byFrac
          ? d.pick([[`길이가 ${total} cm인 끈을 두 도막으로 잘랐다. 짧은 도막의 길이가 긴 도막의 길이의 ${frac(p, q)}일 때 짧은 도막은 몇 cm인가?`, 'cm', '(짧은 도막) : (긴 도막)'], [`우유 ${total * 10} mL를 두 컵에 나누어 담았다. 작은 컵에 담은 양이 큰 컵에 담은 양의 ${frac(p, q)}일 때 작은 컵에 담은 우유는 몇 mL인가?`, 'mL', '(작은 컵) : (큰 컵)']])
          : d.pick([[`구슬 ${total}개 가운데 빨간 구슬 수는 파란 구슬 수의 ${p}배이다. 빨간 구슬은 몇 개인가?`, '개', '(빨간 구슬 수) : (파란 구슬 수)'], [`색종이 ${total}장 가운데 노란 색종이 수는 초록 색종이 수의 ${p}배이다. 노란 색종이는 몇 장인가?`, '장', '(노란 색종이 수) : (초록 색종이 수)']]);
        const T2 = u === 'mL' ? total * 10 : total, W = (u === 'mL' ? 10 : 1) * p * kk;
        return N(text, W, {
          unit: u, explain: `${pair} = ${p} : ${q}이다. 전체를 ${rj(p, q, '으로/로')} 비례배분하면 ${T2} × ${frac(p, p + q)} = ${W}(${u})이다.`,
          facts: { calc: [[`${T2}*${p}/(${p}+${q})`, 0]], unseen: byFrac ? [] : [1] }
        });
      }, { standard: SHARE }),
      H('h-route', '한 길 위의 세 구간과 비례배분', '63', (d) => {
        // ② 세 단계이지만 길 그림을 준다: 전체 거리를 비례배분해 학교에서 도서관까지를 구한다 → 그 가운데 서점에서 도서관까지를 뺀다.
        //    비가 가리키는 구간(학교~도서관)과 묻는 구간(학교~서점)이 다르다.
        const v = d.until(() => { const [a, b] = co(d, 2, 9, (x, y) => x < y), k = d.int(1, 6) * 100; return { a, b, k, last: d.int(2, 20) * 100 }; }, (o) => (o.a + o.b) * o.k <= 4000 && o.last <= o.b * o.k - 200 && o.a / (o.a + o.b) >= 0.25 && o.last / ((o.a + o.b) * o.k) >= 0.2 && (o.b * o.k - o.last) / ((o.a + o.b) * o.k) >= 0.2);
        const total = (v.a + v.b) * v.k, far = v.b * v.k, want = far - v.last, x1 = Math.round(100 * v.a / (v.a + v.b)), x2 = Math.round(100 * (total - v.last) / total);
        return N(`집, 학교, 서점, 도서관이 한 길 위에 차례로 있다. 집에서 학교까지의 거리와 학교에서 도서관까지의 거리의 비는 ${v.a} : ${v.b}이고, 집에서 도서관까지는 ${total} m, 서점에서 도서관까지는 ${v.last} m이다. 학교에서 서점까지는 몇 m인가?`, want, {
          unit: 'm', figure: route([['집', 0, 50], ['학교', x1, 50], ['서점', x2, 50], ['도서관', 100, 50]], [[0, 1, ''], [1, 2, '□ m'], [2, 3, `${v.last} m`]], 40),
          explain: `집에서 도서관까지 ${total} m를 ${rj(v.a, v.b, '으로/로')} 비례배분하면 학교에서 도서관까지는 ${total} × ${frac(v.b, v.a + v.b)} = ${far}(m)이다. 학교에서 서점까지는 ${far} − ${v.last} = ${want}(m)이다.`,
          facts: { calc: [[`${total}*${v.b}/(${v.a}+${v.b})-${v.last}`, 0]] }
        });
      }, { standard: SHARE })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
