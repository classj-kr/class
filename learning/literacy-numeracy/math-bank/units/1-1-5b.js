// 1학년 1학기 5단원 50까지의 수 — 50까지의 수, 수의 순서, 수의 크기 비교의 기본 문항과 실력 문항.
// 꼴 목록(기본꼴_1의 「마. 50까지의 수」「바. 수의 순서」「사. 수의 크기 비교」「아. 조건에 맞는 수」, 심화꼴 49꼴)을 꼴마다 따져서 실었다.
//
// 실력 문항의 잣대: 어려움은 이 단원에서 배운 뜻을 정확히 대야 하는 데서 나와야 한다. 이 단원에서 아이들이 흔히 잘못 아는 것을 먼저 적는다.
//   ① 10을 「9보다 1만큼 더 큰 수」로만 외워, 8보다 2만큼 더 큰 수·열 칸을 채운 그림이 10인 줄 모른다.
//   ② 수를 읽는 말이 둘(십·열)인 것은 알아도, 번호는 「십 번」, 횟수는 「열 번」으로 갈라 읽지 못한다.
//   ③ 10개씩 묶음을 물건 하나로 세어, 묶음 3개를 3이라고 하거나 물건이 많아 보이는 쪽을 더 큰 수라고 한다.
//   ④ 낱개가 10개를 넘으면 묶음 하나가 더 생기는 것을 놓치고 묶음의 수와 낱개의 수를 그대로 이어 쓴다(묶음 2개와 낱개 13개를 213).
//   ⑤ 몇십보다 1만큼 더 작은 수에서 10개씩 묶음의 수가 줄어드는 것을 놓친다(30보다 1만큼 더 작은 수를 39나 20).
//   ⑥ 「사이에 있는 수」에 양 끝 수를 넣거나, 「□부터 □까지의 수」에서 양 끝 수를 뺀다.
//   ⑦ 수를 순서대로 쓴 표는 언제나 아래 칸이 10만큼 더 큰 수라고 여긴다(한 줄의 칸 수를 보지 않는다).
// 그다음에 두 번 넘게 생각해야 하는 문제를 실었다(모으고 가르기, 설명을 수로 바꾼 뒤 비교하기·사이의 수 찾기).
// 기본에서 하는 일을 고르기로 바꾸고 틀린 보기에 흔한 실수 답을 넣은 것은 실력에 싣지 않았다.
//
// 뺀 것과 까닭(이 파일의 묶음)
//  - 조건 풀이·경우 따지기가 어려움의 대부분인 것: 몇십과 몇십 사이의 수 가운데 묶음의 수와 낱개의 수의 관계로 찾기(①75 심48),
//    숫자 카드로 만든 몇십몇을 「모두」 찾기(①76 심49), 조건 둘을 함께 만족하는 수의 개수(①62의 변형).
//  - 20을 넘는 수의 모으기: 과녁 점수 세기(심34 — 5점 둘을 10으로 모아 가며 35를 만든다).
//  - 긋기·그리기(작도): 수만큼 ○로 나타내기(①49 심24의 변형), 표에 색칠하기(①55의 변형), 자리에 ○ 하기(①58 심38 — 번호를 수로 묻는 것만 실었다).
//  - 놀이: 큰 수 쪽 글자를 모아 문장 만들기(①66의 변형).
//  - 같은 문제: 묶음을 덜어 내고 남은 수(심32)는 「10개씩 담고 남는 수」(`num-pack`)와, 수·묶음·낱개·읽기 표(심26)는 `num-word-split`과 하는 일이 같다.
//    바깥에서 안으로 도는 표(①55의 변형)는 길을 따라 이어 세는 일이 `order-path`와 같다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, NAMES, box, lines, tagged, josa, name, nick, N, M, C } = B.kit;
  const { COUNT, PLACE, ORDER, SPLIT, sino, native, mixNS, mixSN, quoted, called, reads, range, truthOf, ask, becomes, splits, row, captioned, pile, bundles, chart, snake, covered } = B.kit.g115;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const PAIRS = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
  const packs = (t, k) => `10개씩 묶음 ${t}개와 낱개 ${k}개인 수`;
  // 묶음의 수와 낱개의 수를 뒤바꾸어도 50을 넘지 않는 몇십몇(23과 32, 24와 42 …)
  const SWAPPABLE = [[2, 1], [2, 3], [2, 4], [3, 1], [3, 2], [3, 4], [4, 1], [4, 2], [4, 3]];
  // 네 보기 가운데 둘을 고른 짝: 맞는 짝 하나와 틀린 짝 셋
  const pairRows = (d, flags) => { const right = flags.map((ok, i) => (ok ? i : -1)).filter((i) => i >= 0).join(); return d.shuffle([PAIRS.find((p) => p.join() === right)].concat(d.shuffle(PAIRS.filter((p) => p.join() !== right)).slice(0, 3))).map((p) => [`${LABELS[p[0]]}, ${LABELS[p[1]]}`, p.join() === right]); };

  B.addTypes('1-1-5', 'num', [
    T('num-pic', '10개씩 묶음과 낱개를 세어 쓰기', '①40 심24', (d) => {
      const t = d.int(2, 4), k = d.int(1, 9), n = t * 10 + k;
      return N('사탕은 모두 몇 개인가?', n, { unit: '개', figure: bundles(t, k, { kind: 'bag' }), explain: `10개씩 묶음 ${t}개와 낱개 ${k}개이므로 ${n}개이다.`, facts: { rule: 'num', calc: [[`10*${t}+${k}`, 0]] } });
    }),
    T('num-make', '10개씩 묶음 몇 개와 낱개 몇 개인 수', '①40·41 심25', (d) => {
      const t = d.int(2, 4), k = d.int(1, 9), n = t * 10 + k;
      return N(`${packs(t, k)}는?`, n, { explain: `${packs(t, k)}는 ${n}이다.`, facts: { rule: 'num', calc: [[`10*${t}+${k}`, 0]] } });
    }),
    T('num-split', '몇십몇을 10개씩 묶음과 낱개로', '①41', (d) => {
      const t = d.int(2, 4), k = d.int(1, 9), n = t * 10 + k;
      return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: t }, { label: LABELS[1], answer: k }], {
        figure: lines([`${josa(n, '은/는')} 10개씩 묶음 ${box(LABELS[0])}개와 낱개 ${box(LABELS[1])}개이다.`]), explain: `${josa(n, '은/는')} 10개씩 묶음 ${t}개와 낱개 ${k}개이다.`, facts: { rule: 'num', calc: [[`(${n}-${n}%10)/10`, 0], [`${n}%10`, 1]] }
      });
    }),
    T('num-word-split', '읽은 말로 적힌 수를 10개씩 묶음과 낱개로', '①41 심26', (d) => {
      const t = d.int(2, 4), k = d.int(1, 9), n = t * 10 + k, said = d.bool() ? sino(n) : native(n);
      return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: t }, { label: LABELS[1], answer: k }], {
        figure: lines([`${josa(said, '은/는')} 10개씩 묶음 ${box(LABELS[0])}개와 낱개 ${box(LABELS[1])}개인 수이다.`]), explain: `${josa(said, '은/는')} ${n}이다. ${josa(n, '은/는')} ${packs(t, k)}이다.`, facts: { calc: [[`(${n}-${n}%10)/10`, 0], [`${n}%10`, 1]], unseen: [n] }
      });
    }),
    T('num-pic-read', '그림의 수를 두 가지로 읽기', '①42', (d) => {
      // 틀린 보기: 한쪽 읽기만 다른 수의 것, 두 읽기 모두 다른 수의 것(묶음과 낱개를 뒤바꾸거나 묶음을 하나 더 센 수)
      const t = d.int(2, 4), k = d.int(1, 9), n = t * 10 + k, alt = k <= 4 && k !== t ? k * 10 + t : n + 10 <= 49 ? n + 10 : n - 10;
      const rows = d.shuffle([[n, n], [n, alt], [alt, n], [alt, alt]]).map(([x, y]) => [`${sino(x)}, ${native(y)}`, x === n && y === n]);
      return ask('연결 모형의 수를 두 가지로 바르게 읽은 것은?', rows, true, { figure: bundles(t, k), explain: `10개씩 묶음 ${t}개와 낱개 ${k}개이므로 ${n}이다. ${reads(n)}` });
    }, { standard: COUNT }),
    T('num-read-mixed', '묶음과 낱개로 말한 수 읽기', '①43', (d) => {
      // 틀린 보기: 우리말과 한자말을 섞어 읽은 것 둘, 묶음과 낱개를 뒤바꾼 수를 읽은 것
      const [t, k] = d.pick(SWAPPABLE), n = t * 10 + k, own = d.bool(), read = own ? native : sino;
      const rows = d.shuffle([[read(n), true], [mixNS(n), false], [mixSN(n), false], [read(k * 10 + t), false]]);
      return ask(`${packs(t, k)}를 바르게 읽은 것은?`, rows, true, { explain: `${packs(t, k)}는 ${n}이다. ${reads(n)}` });
    }, { standard: COUNT }),
    T('num-word-to-digit', '읽은 말을 수로 쓰기', '①44 심27', (d) => {
      const t = d.int(2, 4), k = d.int(1, 9), n = t * 10 + k, own = d.int(0, 2) > 0, said = own ? native(n) : sino(n);
      return N('다음을 수로 쓰면?', n, { figure: lines([said]), explain: `${josa(said, '은/는')} ${packs(t, k)}이다. ${josa(n, '이라고/라고')} 쓴다.`, facts: own ? { calc: [[String(n), 0]], unseen: [n] } : { big: { written: [[said, 0]] } } });
    }, { standard: COUNT }),
    T('num-read-right', '바르게 읽은 것 고르기(몇십몇)', '①45·46', (d) => {
      const ns = d.shuffle(range(2, 4).reduce((all, t) => all.concat(range(1, 9).map((k) => t * 10 + k)), [])).slice(0, 4);
      const rows = d.shuffle(ns.map((n, i) => { const said = i === 0 ? n : d.pick([n - 10, n + 10, n - 1, n + 1].filter((v) => v >= 21 && v <= 49 && v % 10 !== 0)); return [`${n} – ${d.bool() ? sino(said) : native(said)}`, i === 0]; }));
      return ask('수를 바르게 읽은 것은?', rows, true, { explain: `${reads(ns[0])}`, facts: { rule: 'num' } });
    }, { standard: COUNT }),
    T('num-read-both', '두 가지 읽기가 모두 맞는 것', '①46', (d) => {
      const ns = d.shuffle(range(2, 4).reduce((all, t) => all.concat(range(1, 9).map((k) => t * 10 + k)), [])).slice(0, 4);
      const rows = d.shuffle(ns.map((n, i) => {
        const other = d.pick([n - 10, n + 10, n - 1, n + 1].filter((v) => v >= 21 && v <= 49 && v % 10 !== 0)), first = i === 0 || d.bool();
        return [`${n} – ${sino(first ? n : other)}, ${native(i === 0 || !first ? n : other)}`, i === 0];
      }));
      return ask('두 가지로 모두 바르게 읽은 것은?', rows, true, { explain: `${reads(ns[0])}` });
    }, { standard: COUNT }),
    T('num-odd', '나타내는 수가 다른 하나(몇십몇)', '①47 심30', (d) => {
      const t = d.int(2, 4), k = d.int(2, 8), n = t * 10 + k, other = d.pick([n - 10, n + 10, n - 1, n + 1].filter((v) => v >= 21 && v <= 49));
      const same = d.shuffle([[String(n), n], [sino(n), n], [native(n), n], [`${n - 1}보다 1만큼 더 큰 수`, n]]).slice(0, 2).concat([[packs(t, k), n]]);
      const odd = d.pick([[native(other), other], [sino(other), other], [packs(Math.floor(other / 10), other % 10), other]]), rows = d.shuffle(same.concat([odd]));
      return C('나타내는 수가 다른 하나는?', rows.map((row) => row[0]), rows.indexOf(odd), { explain: `「${odd[0]}」만 ${josa(other, '을/를')} 나타낸다. 나머지는 모두 ${josa(n, '을/를')} 나타낸다.`, facts: { rule: 'num', big: { odd: rows.map((row) => String(row[1])) } } });
    }),
    T('num-all', '묶음과 낱개로 말한 수를 나타낸 것 모두', '①48 심28', (d) => {
      const t = d.int(2, 4), k = d.int(3, 9), n = t * 10 + k, miss = n - d.pick([1, 2]);
      const items = d.shuffle(d.shuffle([String(n), sino(n), native(n)]).slice(0, 2).map((text) => [text, true]).concat([[sino(miss), false], [native(miss), false]]));
      return ask(`${packs(t, k)}를 모두 고른 것은?`, pairRows(d, items.map((item) => item[1])), true, { figure: tagged(items.map((item) => item[0])), explain: `${packs(t, k)}는 ${n}이다. ${reads(n)}` });
    }),
    T('num-word', '10개씩 몇 줄과 남은 수', '①50 심31', (d) => {
      const t = d.int(2, 4), k = d.int(1, 9), n = t * 10 + k;
      return N(`한 줄에 10명씩 ${t}줄로 서고 ${k}명이 남았다. 모두 몇 명인가?`, n, { unit: '명', explain: `10개씩 묶음 ${t}개와 낱개 ${k}개인 수와 같다. 모두 ${n}명이다.`, facts: { calc: [[`10*${t}+${k}`, 0]] } });
    }),
    T('num-pack', '10개씩 담고 남는 수', '①51 심32', (d) => {
      const t = d.int(2, 4), k = d.int(1, 9), n = t * 10 + k;
      return M(`사탕 ${native(n)} 개를 한 봉지에 10개씩 담는다. 몇 봉지가 되고, 몇 개가 남는가?`, [{ label: '담은 봉지', answer: t, unit: '봉지' }, { label: '남는 사탕', answer: k, unit: '개' }], {
        explain: `${josa(native(n), '은/는')} ${n}이다. ${josa(n, '은/는')} 10개씩 묶음 ${t}개와 낱개 ${k}개이므로 ${t}봉지가 되고 ${k}개가 남는다.`, facts: { calc: [[`(${n}-${n}%10)/10`, 0], [`${n}%10`, 1]], unseen: [n] }
      });
    }),
    T('num-say-wrong', '수를 잘못 말한 사람', '①52', (d) => {
      // 10개씩 묶음의 수와 낱개의 수를 뒤바꾸어 말한 사람을 찾는다.
      const [t, k] = d.pick(SWAPPABLE), n = t * 10 + k, who = d.shuffle(NAMES).slice(0, 3);
      const says = d.shuffle([[`${packs(k, t)}이다.`, false], [`${called(sino(n))} 읽는다.`, true], [`${called(native(n))} 읽는다.`, true]]);
      return C(`${josa(n, '을/를')} 잘못 말한 사람은?`, who, says.findIndex((say) => !say[1]), {
        figure: lines(says.map((say, i) => `${who[i]}: ${say[0]}`)), explain: `${josa(n, '은/는')} ${packs(t, k)}이다. ${packs(k, t)}는 ${k * 10 + t}이다.`, facts: truthOf(says, false)
      });
    })
  ]);

  B.addTypes('1-1-5', 'order', [
    T('order-row', '수를 순서대로 쓴 줄의 빈칸', '①54 심35', (d) => {
      const s = d.int(1, 4) * 10 + d.int(1, 5);
      return M('수를 순서대로 썼다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: s + 2 }, { label: LABELS[1], answer: s + 4 }], {
        figure: row([s, s + 1, box(LABELS[0]), s + 3, box(LABELS[1])]), explain: `${s + 1} 다음 수는 ${s + 2}, ${s + 3} 다음 수는 ${s + 4}이다.`, facts: { calc: [[`${s + 1}+1`, 0], [`${s + 3}+1`, 1]], unseen: [1] }
      });
    }),
    T('order-cross', '몇십을 넘어가는 줄의 빈칸', '①54 심35', (d) => {
      const s = d.int(1, 3) * 10 + 8;
      return M('수를 순서대로 썼다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: s + 2 }, { label: LABELS[1], answer: s + 3 }], {
        figure: row([s, s + 1, box(LABELS[0]), box(LABELS[1]), s + 4]), explain: `${s + 1} 다음 수는 ${s + 2}, ${s + 2} 다음 수는 ${s + 3}이다.`, facts: { calc: [[`${s + 1}+1`, 0], [`${s + 4}-1`, 1]], unseen: [1] }
      });
    }),
    T('order-first', '첫 칸이 빈 줄', '①54 심35', (d) => {
      const s = d.int(12, 46);
      return M('수를 순서대로 썼다. ㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: s }, { label: LABELS[1], answer: s + 2 }, { label: LABELS[2], answer: s + 4 }], {
        figure: row([box(LABELS[0]), s + 1, box(LABELS[1]), s + 3, box(LABELS[2])]), explain: `${s + 1} 바로 앞의 수는 ${s}, 바로 뒤의 수는 ${s + 2}이다. ${s + 3} 바로 뒤의 수는 ${s + 4}이다.`,
        facts: { calc: [[`${s + 1}-1`, 0], [`${s + 1}+1`, 1], [`${s + 3}+1`, 2]], unseen: [1] }
      });
    }),
    T('order-back', '거꾸로 센 줄의 빈칸', '심36', (d) => {
      const s = d.pick(range(2, 4).reduce((all, t) => all.concat(range(0, 3).map((k) => t * 10 + k)), [50]));
      return M('수를 거꾸로 세어 썼다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: s - 1 }, { label: LABELS[1], answer: s - 3 }], {
        figure: row([s, box(LABELS[0]), s - 2, box(LABELS[1]), s - 4]), explain: `${s}보다 1만큼 더 작은 수는 ${s - 1}, ${s - 2}보다 1만큼 더 작은 수는 ${s - 3}이다.`, facts: { calc: [[`${s}-1`, 0], [`${s - 2}-1`, 1]], unseen: [1] }
      });
    }),
    T('order-chart', '수 배열표의 빈칸', '①55 심38', (d) => {
      const first = d.pick([1, 11, 21]), at = [d.int(2, 8), d.int(11, 18), d.int(22, 29)], asks = {};
      at.forEach((i, j) => { asks[i] = LABELS[j]; });
      return M('수를 순서대로 쓴 표이다. ㉠, ㉡, ㉢에 알맞은 수는?', at.map((i, j) => ({ label: LABELS[j], answer: first + i })), {
        figure: chart(first, 10, 3, asks), explain: `㉠은 ${first + at[0] - 1} 다음 수인 ${first + at[0]}, ㉡은 ${first + at[1] - 1} 다음 수인 ${first + at[1]}, ㉢은 ${first + at[2] - 1} 다음 수인 ${first + at[2]}이다.`,
        facts: { calc: at.map((i, j) => [`${first}+${i + 1}-1`, j]), unseen: [1] }
      });
    }),
    T('order-path', '길을 따라 순서대로 쓴 수', '①55', (d) => {
      // 둘째 줄은 오른쪽에서 왼쪽으로 이어진다. 줄마다 왼쪽부터 읽는 아이는 ㉠을 틀린다.
      const first = d.int(12, 38), at = [d.int(5, 7), d.int(9, 11)], asks = {};
      at.forEach((i, j) => { asks[i] = LABELS[j]; });
      return M('길을 따라 수를 순서대로 썼다. ㉠, ㉡에 알맞은 수는?', at.map((i, j) => ({ label: LABELS[j], answer: first + i })), {
        figure: snake(first, 4, 3, asks), explain: `화살표를 따라 이어 세면 ㉠은 ${first + at[0] - 1} 다음 수인 ${first + at[0]}, ㉡은 ${first + at[1] - 1} 다음 수인 ${first + at[1]}이다.`,
        facts: { calc: at.map((i, j) => [`${first}+${i + 1}-1`, j]), unseen: [1] }
      });
    }),
    T('order-one', '1만큼 더 큰 수와 1만큼 더 작은 수', '①57 심40', (d) => {
      const n = d.int(1, 4) * 10 + d.int(1, 9);
      return M(`${n}보다 1만큼 더 큰 수와 1만큼 더 작은 수는?`, [{ label: '1만큼 더 큰 수', answer: n + 1 }, { label: '1만큼 더 작은 수', answer: n - 1 }], {
        explain: `${n} 바로 뒤의 수는 ${n + 1}, 바로 앞의 수는 ${n - 1}이다.`, facts: { calc: [[`${n}+1`, 0], [`${n}-1`, 1]] }
      });
    }),
    T('order-next-word', '번호로 자리 찾기', '①58 심38', (d) => {
      const [a, b] = d.shuffle(NAMES).slice(0, 2), n = d.int(1, 4) * 10 + d.int(1, 8), up = d.bool();
      return N(`${a}의 사물함은 ${n}번이다. ${b}의 번호는 ${n}보다 1만큼 더 ${up ? '큰' : '작은'} 수이다. ${b}의 사물함은 몇 번인가?`, up ? n + 1 : n - 1, {
        unit: '번', explain: `${n}보다 1만큼 더 ${up ? '큰' : '작은'} 수는 ${up ? n + 1 : n - 1}이다.`, facts: { calc: [[`${n}${up ? '+' : '-'}1`, 0]] }
      });
    }),
    T('order-right', '순서대로 쓴 것 고르기', '①59 심39', (d) => {
      // 틀린 보기: 차례가 뒤섞인 것, 몇십을 건너뛴 것, 10개씩 묶음의 수가 바뀐 것
      const s = d.shuffle(range(11, 36)).slice(0, 3), skip = d.int(1, 3) * 10 + 8;
      const rows = d.shuffle([[s[0], s[0] + 1, s[0] + 2], [s[1], s[1] + 2, s[1] + 1], [skip, skip + 1, skip + 3], [s[2], s[2] + 10, s[2] + 1]]).map((row) => [row.join(', '), row[1] === row[0] + 1 && row[2] === row[1] + 1]);
      return ask('수를 순서대로 쓴 것은?', rows, true, { explain: `${s[0]} 다음 수는 ${s[0] + 1}, ${s[0] + 1} 다음 수는 ${s[0] + 2}이다.` });
    }),
    T('order-between-all', '두 수 사이에 있는 수 모두 쓰기', '심41', (d) => {
      const lo = d.int(11, 46), hi = lo + 3;
      return M(`${josa(lo, '과/와')} ${hi} 사이에 있는 수를 모두 쓰시오.`, [{ answer: lo + 1 }, { answer: lo + 2 }], {
        unordered: true, explain: `${lo}보다 크고 ${hi}보다 작은 수는 ${lo + 1}, ${lo + 2}이다. ${josa(lo, '과/와')} ${josa(hi, '은/는')} 사이에 있는 수가 아니다.`, facts: { calc: [[`${lo}+1`, 0], [`${hi}-1`, 1]], unseen: [1] }
      });
    }),
    T('order-between-pick', '두 수 사이에 있는 수 고르기', '심41', (d) => {
      const lo = d.int(11, 44), hi = lo + d.int(3, 5), list = d.shuffle([lo, lo + d.int(1, hi - lo - 1), hi, hi + 1]);
      return C(`${josa(lo, '과/와')} ${hi} 사이에 있는 수는?`, list.map(String), list.findIndex((v) => v > lo && v < hi), {
        explain: `${josa(lo, '과/와')} ${hi} 사이에 있는 수는 ${lo}보다 크고 ${hi}보다 작은 수이다. ${josa(lo, '과/와')} ${josa(hi, '은/는')} 들어가지 않는다.`, facts: { between: { low: String(lo), high: String(hi), exprs: list.map(String) } }
      });
    }),
    T('order-not-between', '두 수 사이에 있지 않은 수', '①60', (d) => {
      const lo = d.int(12, 42), hi = lo + 6, out = d.pick([lo - 1, hi + 1]);
      const rows = d.shuffle(d.shuffle(range(lo + 1, hi - 1)).slice(0, 3).concat([out])).map((v) => [String(v), v > lo && v < hi]);
      return ask(`${josa(lo, '과/와')} ${hi} 사이에 있는 수가 아닌 것은?`, rows, false, { explain: `${josa(lo, '과/와')} ${hi} 사이에 있는 수는 ${range(lo + 1, hi - 1).join(', ')}이다. ${josa(out, '은/는')} ${out < lo ? `${lo}보다 작다` : `${hi}보다 크다`}.` });
    }),
    T('order-between-word', '두 층 사이의 층', '①61', (d) => {
      const who = d.pick(NAMES), f = d.int(11, 30);
      return N(`${nick(who)}네 집은 ${f}층과 ${f + 2}층 사이에 있다. ${nick(who)}네 집은 몇 층인가?`, f + 1, { unit: '층', explain: `${josa(f, '과/와')} ${f + 2} 사이에 있는 수는 ${f + 1}이다.`, facts: { calc: [[`${f}+1`, 0]], unseen: [1] } });
    }),
    T('order-between-count', '두 수 사이에 있는 수의 개수', '①62', (d) => {
      const lo = d.int(11, 41), gap = d.int(4, 8), hi = lo + gap;
      return N(`${lo}보다 크고 ${hi}보다 작은 수는 모두 몇 개인가?`, gap - 1, { unit: '개', explain: `${lo}보다 크고 ${hi}보다 작은 수는 ${range(lo + 1, hi - 1).join(', ')}이다. 모두 ${gap - 1}개이다.`, facts: { calc: [[`${hi}-${lo}-1`, 0]], unseen: [1] } });
    }),
    T('order-prize', '설명에 맞는 번호 가리기', '①64', (d) => {
      const x = d.int(12, 46), things = d.shuffle(['곰 인형', '동화책', '색연필', '공']).slice(0, 2);
      const rows = d.shuffle([[`${josa(x - 1, '과/와')} ${x + 1} 사이의 수`, x, `${x - 1}+1`], [`${x + 2}보다 1만큼 더 작은 수`, x + 1, `${x + 2}-1`]]), want = d.pick([x, x + 1]);
      return C(`${want}번을 뽑으면 받는 것은?`, things, rows.findIndex((row) => row[1] === want), {
        figure: lines(rows.map((row, i) => `${things[i]}: ${row[0]}`)), explain: `${josa(x - 1, '과/와')} ${x + 1} 사이의 수는 ${x}, ${x + 2}보다 1만큼 더 작은 수는 ${x + 1}이다.`,
        facts: { choose: { exprs: rows.map((row) => row[2]), rule: 'equals', target: want } }
      });
    }),
    T('order-sort', '이어진 수를 작은 수부터 쓰기', '①65', (d) => {
      const s = d.int(11, 46), sorted = range(s, s + 3), list = d.until(() => d.shuffle(sorted), (v) => v.join() !== sorted.join() && v.join() !== sorted.slice().reverse().join());
      return M('작은 수부터 차례로 쓰시오.', sorted.map((v) => ({ answer: v })), { figure: row(list), explain: `작은 수부터 차례로 쓰면 ${sorted.join(', ')}이다.`, facts: { calc: sorted.map((v, i) => [i ? `${s}+${i}` : String(s), i]), unseen: [1, 2, 3] } });
    })
  ]);

  B.addTypes('1-1-5', 'compare', [
    T('cmp-two-tens', '10개씩 묶음의 수가 다른 두 수', '①66', (d) => {
      // 낱개의 수는 작은 쪽이 더 크다(29와 31).
      const t = d.int(1, 3), a = t * 10 + d.int(6, 9), b = (t + 1) * 10 + d.int(0, 3), list = d.shuffle([a, b]);
      return C('더 큰 수는?', list.map(String), list.indexOf(b), { explain: `10개씩 묶음의 수가 ${josa(a, '은/는')} ${t}개, ${josa(b, '은/는')} ${t + 1}개이다. 10개씩 묶음의 수가 많은 ${josa(b, '이/가')} 더 크다.`, facts: { choose: { exprs: list.map(String), rule: 'max' } } });
    }),
    T('cmp-two-ones', '10개씩 묶음의 수가 같은 두 수', '①66', (d) => {
      const t = d.int(1, 4), [p, q] = d.shuffle(range(0, 9)).slice(0, 2), list = [t * 10 + p, t * 10 + q], low = Math.min(...list);
      return C('더 작은 수는?', list.map(String), list.indexOf(low), { explain: `10개씩 묶음의 수가 같으므로 낱개의 수를 비교한다. 낱개의 수가 적은 ${josa(low, '이/가')} 더 작다.`, facts: { choose: { exprs: list.map(String), rule: 'min' } } });
    }),
    T('cmp-word', '크다·작다로 말하기', '①66', (d) => {
      const t = d.int(1, 3), x = t * 10 + d.int(5, 9), y = d.bool() ? (t + 1) * 10 + d.int(0, 4) : d.until(() => t * 10 + d.int(0, 9), (v) => v !== x), [p, q] = d.shuffle([x, y]);
      return ask(`${josa(p, '은/는')} ${q}보다 □. □에 알맞은 말은?`, [['크다', p > q], ['작다', p < q]], true, { explain: `${Math.floor(p / 10) === Math.floor(q / 10) ? '10개씩 묶음의 수가 같으므로 낱개의 수를 비교한다.' : '10개씩 묶음의 수를 비교한다.'} ${josa(p, '은/는')} ${q}보다 ${p > q ? '크다' : '작다'}.` });
    }),
    T('cmp-pic', '그림을 세어 두 수 비교하기', '①67 심12·44', (d) => {
      const t = d.int(1, 3), [k1, k2] = d.shuffle(range(1, 9)).slice(0, 2), second = d.bool() ? [t, k2] : [t + 1, k2], pics = d.shuffle([[t, k1], second]), vals = pics.map(([x, y]) => x * 10 + y);
      const big = vals[0] > vals[1] ? 0 : 1, more = d.bool(), order = more ? [big, 1 - big] : [1 - big, big];
      return M('두 그림의 수를 비교하였다. ㉠, ㉡에 알맞은 수는?', order.map((i, j) => ({ label: LABELS[j], answer: vals[i] })), {
        figure: pics.map(([x, y]) => bundles(x, y)).join('') + lines([`${box(LABELS[0])}은 ${box(LABELS[1])}보다 ${more ? '크다' : '작다'}.`]), explain: `두 그림의 수는 ${vals[0]}, ${vals[1]}이다. ${josa(vals[order[0]], '은/는')} ${vals[order[1]]}보다 ${more ? '크다' : '작다'}.`,
        facts: { calc: order.map((i, j) => [`10*${pics[i][0]}+${pics[i][1]}`, j]) }
      });
    }),
    T('cmp-pairs', '오른쪽 수가 더 작은 짝', '①68 심12', (d) => {
      const lefts = d.shuffle(range(21, 39)).slice(0, 4), gaps = d.shuffle([1, 2, 10, 10]), made = lefts.map((l, i) => [l, i === 0 ? l - gaps[i] : l + gaps[i]]);
      const rows = d.shuffle(made).map(([l, r]) => [`${l}, ${r}`, r < l]);
      return ask('오른쪽 수가 왼쪽 수보다 작은 것은?', rows, true, { explain: `${josa(made[0][1], '은/는')} ${made[0][0]}보다 작다. 나머지는 오른쪽 수가 왼쪽 수보다 크다.` });
    }),
    T('cmp-max3', '세 수 가운데 가장 큰 수', '①69 심45', (d) => {
      // 10개씩 묶음의 수가 적은 수의 낱개가 가장 많다(35, 39, 28 가운데 28을 고르는 아이).
      const t = d.int(2, 4), q = d.int(2, 8), p = d.int(0, q - 1), list = d.shuffle([t * 10 + p, t * 10 + q, (t - 1) * 10 + d.int(q + 1, 9)]);
      return C('가장 큰 수는?', list.map(String), list.indexOf(t * 10 + q), { explain: `10개씩 묶음의 수가 ${t}개인 ${josa(t * 10 + p, '과/와')} ${t * 10 + q} 가운데 낱개의 수가 많은 ${josa(t * 10 + q, '이/가')} 가장 크다.`, facts: { choose: { exprs: list.map(String), rule: 'max' } } });
    }),
    T('cmp-min4', '네 수 가운데 가장 작은 수', '①69', (d) => {
      const t = d.int(1, 3), p = d.int(1, 7), q = d.int(p + 1, 9), list = d.shuffle([t * 10 + p, t * 10 + q, (t + 1) * 10 + d.int(0, p - 1), (t + 1) * 10 + d.int(p, 9)]);
      return C('가장 작은 수는?', list.map(String), list.indexOf(t * 10 + p), { explain: `10개씩 묶음의 수가 ${t}개인 ${josa(t * 10 + p, '과/와')} ${t * 10 + q} 가운데 낱개의 수가 적은 ${josa(t * 10 + p, '이/가')} 가장 작다.`, facts: { choose: { exprs: list.map(String), rule: 'min' } } });
    }),
    T('cmp-mixed-max', '숫자와 읽은 말이 섞인 수의 비교', '①70', (d) => {
      const lo = d.pick([21, 31]), vals = d.shuffle(range(lo, lo + 18).filter((v) => v % 10 !== 0)).slice(0, 4), forms = d.shuffle([String, String, sino, native]), shown = vals.map((v, i) => forms[i](v));
      return C('가장 큰 수를 나타내는 것은?', shown, vals.indexOf(Math.max(...vals)), { explain: `수로 쓰면 차례로 ${vals.join(', ')}이다. 가장 큰 수는 ${Math.max(...vals)}이다.`, facts: { choose: { exprs: vals.map(String), rule: 'max' }, unseen: vals } });
    }),
    T('cmp-word-two', '두 양의 비교', '①72', (d) => {
      const [a, b] = d.shuffle(NAMES).slice(0, 2), t = d.int(2, 4), x = t * 10 + d.int(0, 9), y = d.until(() => d.pick([t, t - 1]) * 10 + d.int(0, 9), (v) => v !== x);
      return C(`종이학을 ${name(a, '은/는')} ${x}개, ${name(b, '은/는')} ${y}개 접었다. 더 적게 접은 사람은?`, [a, b], x < y ? 0 : 1, { explain: `${josa(Math.min(x, y), '은/는')} ${Math.max(x, y)}보다 작다.`, facts: { choose: { exprs: [String(x), String(y)], rule: 'min' } } });
    }),
    T('cmp-word-mixed', '다르게 말한 두 양의 비교', '①73', (d) => {
      const t = d.int(2, 4), k = d.int(1, 9), x = t * 10 + k, y = d.until(() => t * 10 + d.int(1, 9), (v) => v !== x);
      return C(`사과는 10개씩 ${t}바구니와 낱개 ${k}개가 있다. 귤은 ${native(y)} 개가 있다. 더 많은 것은?`, ['사과', '귤'], x > y ? 0 : 1, { explain: `사과는 ${x}개, 귤은 ${y}개이다. ${josa(Math.max(x, y), '이/가')} 더 크다.`, facts: { choose: { exprs: [`10*${t}+${k}`, String(y)], rule: 'max' }, unseen: [y] } });
    }),
    T('cmp-three-mixed', '다르게 말한 세 양의 비교', '심47', (d) => {
      const who = d.shuffle(NAMES).slice(0, 3), packsOf = () => [d.int(2, 4), d.int(1, 9)], made = d.until(() => [packsOf(), packsOf(), d.int(21, 49)], ([p, q, v]) => new Set([p[0] * 10 + p[1], q[0] * 10 + q[1], v]).size === 3);
      const rows = d.shuffle([[`10개씩 묶음 ${made[0][0]}개와 낱개 ${made[0][1]}개`, made[0][0] * 10 + made[0][1], `10*${made[0][0]}+${made[0][1]}`], [`10개씩 묶음 ${made[1][0]}개와 낱개 ${made[1][1]}개`, made[1][0] * 10 + made[1][1], `10*${made[1][0]}+${made[1][1]}`], [`${made[2]}개`, made[2], String(made[2])]]);
      const vals = rows.map((row) => row[1]);
      return C('구슬이 가장 많은 사람은?', who, vals.indexOf(Math.max(...vals)), { figure: lines(rows.map((row, i) => `${who[i]}: ${row[0]}`)), explain: `구슬은 차례로 ${vals.join('개, ')}개이다. 가장 큰 수는 ${Math.max(...vals)}이다.`, facts: { choose: { exprs: rows.map((row) => row[2]), rule: 'max' } } });
    }),
    T('cmp-order3', '세 사람의 수를 많은 차례로', '①74', (d) => {
      const who = d.shuffle(NAMES).slice(0, 3), t = d.int(2, 4), [p, q] = d.shuffle(range(0, 9)).slice(0, 2), vals = d.shuffle([t * 10 + p, t * 10 + q, d.pick([t - 1, t + 1].filter((v) => v <= 4)) * 10 + d.int(1, 9)]);
      const right = [0, 1, 2].sort((x, y) => vals[y] - vals[x]), list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
      return C(`공깃돌을 ${name(who[0], '은/는')} ${vals[0]}개, ${name(who[1], '은/는')} ${vals[1]}개, ${name(who[2], '은/는')} ${vals[2]}개 가졌다. 많이 가진 사람부터 차례로 쓴 것은?`, list.map((o) => o.map((i) => who[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
        explain: `큰 수부터 차례로 쓰면 ${right.map((i) => vals[i]).join(', ')}이다.`, facts: { choose: { exprs: vals.map(String), rule: 'descending', orders: list } }
      });
    }),
    T('cmp-sort4', '네 수를 큰 수부터 쓰기', '심45', (d) => {
      const t = d.int(2, 4), [p, q] = d.shuffle(range(0, 9)).slice(0, 2), others = d.shuffle(range(1, 4).filter((v) => v !== t)).slice(0, 2).map((v) => v * 10 + d.int(1, 9)), list = d.shuffle([t * 10 + p, t * 10 + q].concat(others)), sorted = list.slice().sort((x, y) => y - x);
      return M('큰 수부터 차례로 쓰시오.', sorted.map((v) => ({ answer: v })), { figure: row(list), explain: `10개씩 묶음의 수가 많은 수가 더 크다. 10개씩 묶음의 수가 같으면 낱개의 수를 비교한다. 큰 수부터 차례로 쓰면 ${sorted.join(', ')}이다.`, facts: { calc: sorted.map((v, i) => [String(v), i]) } });
    }),
    T('cmp-tens-below', '기준보다 작은 몇십의 수', '심23', (d) => {
      // 10개씩 묶음의 수가 같은 몇십(30과 37)을 빼먹거나, 묶음의 수가 하나 많은 몇십(40)까지 세는 아이가 있다.
      const t = d.int(2, 4), n = t * 10 + d.int(1, 9), tens = [10, 20, 30, 40, 50];
      return N(`10, 20, 30, 40, 50 가운데 ${n}보다 작은 수는 모두 몇 개인가?`, t, { unit: '개', explain: `${n}보다 작은 수는 ${tens.filter((v) => v < n).join(', ')}이다. ${josa(t * 10, '과/와')} ${josa(n, '은/는')} 10개씩 묶음의 수가 같다. ${josa(t * 10, '은/는')} 낱개가 없으므로 ${n}보다 작다.`, facts: { big: { countIf: { values: tens, test: 'below', target: n, i: 0 } } } });
    })
  ]);

  B.addGroup('1-1-5', {
    id: 'hard', title: '단원 종합', standard: PLACE,
    types: [
      H('h-ten-odd', '10을 나타내는 것이 아닌 것', '3', (d) => {
        // 「9보다 1만큼 더 큰 수」로만 외운 아이는 「8보다 2만큼 더 큰 수」를 고른다. 구슬 그림은 세어 보아야 안다.
        const far = d.pick([[8, 2], [7, 3]]), withPic = d.bool();
        const same = [[`${far[0]}보다 ${far[1]}만큼 더 큰 수`, `${far[0]}+${far[1]}`], ['9보다 1만큼 더 큰 수', '9+1'], withPic ? [pile(10, { scale: 1 }), '10'] : [d.pick(['십', '열']), '10']];
        const odd = withPic ? d.pick([['8보다 1만큼 더 큰 수', '8+1', '「8보다 1만큼 더 큰 수」는 9'], ['9보다 1만큼 더 작은 수', '9-1', '「9보다 1만큼 더 작은 수」는 8']]) : [pile(9, { scale: 1 }), '9', '구슬은 9개'];
        const rows = d.shuffle(same.concat([odd]));
        return C('10을 나타내는 것이 아닌 것은?', LABELS.slice(0, 4), rows.indexOf(odd), { figure: tagged(rows.map((row) => row[0])), explain: `${odd[2]}이다. 나머지는 모두 10을 나타낸다.`, facts: { big: { odd: rows.map((row) => row[1]) } } });
      }, { standard: COUNT }),
      H('h-ten-read', '상황에 맞게 10 읽기', '4', (d) => {
        // 같은 「10번」도 횟수는 「열 번」, 번호는 「십 번」으로 읽는다. 「번」만 보고 고르는 아이가 걸린다.
        const own = d.bool();
        const rows = d.shuffle(own ? [['줄넘기를 10번 넘었다.', true], ['내 번호는 10번이다.', false], ['우리 집은 10층이다.', false], ['오늘은 5월 10일이다.', false]] : [['내 번호는 10번이다.', true], ['줄넘기를 10번 넘었다.', false], ['사탕이 10개 있다.', false], ['형은 10살이다.', false]]);
        return ask(`10을 「${own ? '열' : '십'}」이라고 읽는 것은?`, rows, true, { explain: own ? '횟수를 셀 때는 「열 번」이라고 읽는다. 번호, 층, 날짜는 「십 번」, 「십 층」, 「십 일」이라고 읽는다.' : '번호는 「십 번」이라고 읽는다. 횟수, 개수, 나이는 「열 번」, 「열 개」, 「열 살」이라고 읽는다.' });
      }, { standard: COUNT }),
      H('h-loose-over', '낱개가 10개를 넘는 그림의 수', '기본 ①53', (d) => {
        const t = d.int(1, 3), loose = d.int(11, 15), n = t * 10 + loose;
        return N('구슬은 모두 몇 개인가?', n, { unit: '개', figure: bundles(t, loose, { kind: 'bag' }), explain: `낱개 ${loose}개는 10개씩 묶음 1개와 낱개 ${loose - 10}개이다. 10개씩 묶음 ${t + 1}개와 낱개 ${loose - 10}개이므로 ${n}개이다.`, facts: { rule: 'over', calc: [[`10*${t}+${loose}`, 0]] } });
      }),
      H('h-loose-give', '낱개가 10개를 넘는 수에서 1개 덜기', '33', (d) => {
        const t = d.int(1, 3), loose = d.pick([10, 11]), n = t * 10 + loose;
        return N(`사탕이 10개씩 ${t}봉지와 낱개 ${loose}개 있다. 1개를 먹으면 몇 개가 남는가?`, n - 1, {
          unit: '개', explain: `낱개 ${loose}개는 10개씩 묶음 1개${loose === 11 ? '와 낱개 1개' : ''}이므로 사탕은 ${n}개이다. ${n}보다 1만큼 더 작은 수는 ${n - 1}이다.`, facts: { calc: [[`10*${t}+${loose}-1`, 0]] }
        });
      }),
      H('h-pic-compare', '물건이 많아 보이지만 더 작은 수', '44, 기본 ①67', (d) => {
        // 막대와 낱개의 개수를 물건 수로 세는 아이는 낱개가 많은 쪽을 고른다.
        const t = d.int(1, 3), pics = d.shuffle([[t, d.int(7, 9)], [t + 1, d.int(1, 2)]]), vals = pics.map(([x, y]) => x * 10 + y);
        return C('더 큰 수를 나타내는 것은?', LABELS.slice(0, 2), vals[0] > vals[1] ? 0 : 1, {
          figure: pics.map(([x, y], i) => captioned(LABELS[i], bundles(x, y))).join(''), explain: `㉠은 ${vals[0]}, ㉡은 ${vals[1]}이다. 10개씩 묶음의 수가 많은 쪽이 더 크다.`, facts: { choose: { exprs: pics.map(([x, y]) => `10*${x}+${y}`), rule: 'max' } }
        });
      }, { standard: ORDER }),
      H('h-one-less-pic', '몇십보다 1만큼 더 작은 수', '46', (d) => {
        const t = d.int(2, 5);
        return N('연결 모형의 수보다 1만큼 더 작은 수는?', t * 10 - 1, { figure: bundles(t, 0), explain: `연결 모형은 ${t * 10}개이다. ${t * 10}보다 1만큼 더 작은 수는 10개씩 묶음 ${t - 1}개와 낱개 9개인 ${t * 10 - 1}이다.`, facts: { calc: [[`10*${t}-1`, 0]] } });
      }, { standard: ORDER }),
      H('h-between-vs-through', '사이의 수와 부터 까지의 수', '41·42', (d) => {
        const lo = d.int(11, 43), gap = d.int(3, 6), hi = lo + gap, inner = range(lo + 1, hi - 1).join(', ');
        return M('㉠과 ㉡은 각각 몇 개인가?', [{ label: LABELS[0], answer: gap - 1, unit: '개' }, { label: LABELS[1], answer: gap + 1, unit: '개' }], {
          figure: tagged([`${josa(lo, '과/와')} ${hi} 사이에 있는 수`, `${lo}부터 ${hi}까지의 수`]), explain: `${josa(lo, '과/와')} ${hi} 사이에 있는 수는 ${inner}이고 ${gap - 1}개이다. ${lo}부터 ${hi}까지의 수는 ${lo}, ${inner}, ${hi}이고 ${gap + 1}개이다.`,
          facts: { calc: [[`${hi}-${lo}-1`, 0], [`${hi}-${lo}+1`, 1]], unseen: [1] }
        });
      }, { standard: ORDER }),
      H('h-through-above', '부터 까지의 수 가운데 설명한 수보다 큰 수', '42', (d) => {
        const t = d.int(2, 4), k = d.int(3, 6), mid = t * 10 + k, lo = mid - d.int(2, 4), hi = mid + d.int(2, 4);
        return N(`다음 수 가운데 ${packs(t, k)}보다 큰 수는 모두 몇 개인가?`, hi - mid, {
          unit: '개', figure: lines([`${lo}부터 ${hi}까지의 수`]), explain: `${packs(t, k)}는 ${mid}이다. ${lo}부터 ${hi}까지의 수 가운데 ${mid}보다 큰 수는 ${range(mid + 1, hi).join(', ')}이다.`, facts: { calc: [[`${hi}-(10*${t}+${k})`, 0]] }
        });
      }, { standard: ORDER }),
      H('h-chart-part', '일부만 적힌 수 배열표', '37, 기본 ①56', (d) => {
        // 한 줄이 10칸이 아니다. 아래 칸이 10만큼 더 큰 수라고 외운 아이는 틀린다. 줄 끝에서 다음 줄 처음으로 이어 센다.
        const cols = d.pick([6, 7, 8]), first = d.int(11, 51 - cols * 3), at = [cols + d.int(3, cols - 1), cols * 2 + d.int(1, cols - 1)];
        return M('수를 순서대로 쓴 표이다. ㉠, ㉡에 알맞은 수는?', at.map((i, j) => ({ label: LABELS[j], answer: first + i })), {
          figure: chart(first, cols, 3, { [at[0]]: LABELS[0], [at[1]]: LABELS[1] }, [0, 1, 2, cols, cols + 1]), explain: `첫 줄의 끝 수는 ${first + cols - 1}이고 둘째 줄은 ${first + cols}부터이다. 빈칸을 하나씩 이어 세면 ㉠은 ${first + at[0]}, ㉡은 ${first + at[1]}이다.`,
          facts: { calc: at.map((i, j) => [`${first}+${i + 1}-1`, j]), unseen: [1] }
        });
      }, { standard: ORDER }),
      H('h-desc-max', '설명 셋이 나타내는 수의 비교', '46, 기본 ①71', (d) => {
        const u = d.int(3, 5), c = u * 10 - 1, [a, b] = d.until(() => [d.int(c - 4, c + 4), d.int(c - 4, c + 4)], ([p, q]) => new Set([p, q, c]).size === 3 && p % 10 !== 0 && p <= 49 && q <= 49);
        const rows = d.shuffle([[packs(Math.floor(a / 10), a % 10), a, `10*${Math.floor(a / 10)}+${a % 10}`], [`${josa(b - 1, '과/와')} ${b + 1} 사이의 수`, b, `${b - 1}+1`], [`${u * 10}보다 1만큼 더 작은 수`, c, `${u * 10}-1`]]), vals = rows.map((row) => row[1]);
        return C('가장 큰 수를 나타내는 것은?', LABELS.slice(0, 3), vals.indexOf(Math.max(...vals)), {
          figure: tagged(rows.map((row) => row[0])), explain: `㉠은 ${vals[0]}, ㉡은 ${vals[1]}, ㉢은 ${vals[2]}이다. 가장 큰 수는 ${Math.max(...vals)}이다.`, facts: { choose: { exprs: rows.map((row) => row[2]), rule: 'max' } }
        });
      }, { standard: ORDER }),
      H('h-join-split', '모으고 가르는 두 단계', '기본 ①30', (d) => {
        const a = d.int(5, 9), b = d.int(Math.max(3, 11 - a), Math.min(9, 17 - a)), c = d.int(Math.max(3, a + b - 9), 9);
        return N(`고구마를 어제 ${a}개, 오늘 ${b}개 캤다. 그 가운데 ${c}개를 먹었다. 남은 고구마는 몇 개인가?`, a + b - c, {
          unit: '개', explain: `${becomes(a, b, a + b)} ${splits(a + b, c, a + b - c)} 남은 고구마는 ${a + b - c}개이다.`, facts: { calc: [[`${a}+${b}-${c}`, 0]] }
        });
      }, { standard: SPLIT }),
      H('h-ones-odd', '낱개의 수가 다른 하나', '29', (d) => {
        // 수 전체가 아니라 낱개의 수만 본다. 읽은 말은 수로 바꾸어야 한다.
        const k = d.int(1, 9), other = d.until(() => d.int(1, 9), (v) => v !== k), tens = d.shuffle([1, 2, 3, 4]), vals = d.shuffle([tens[0] * 10 + k, tens[1] * 10 + k, tens[2] * 10 + k, tens[d.int(0, 2)] * 10 + other]);
        const forms = d.shuffle([String, String, sino, native]), shown = vals.map((v, i) => forms[i](v));
        return C('낱개의 수가 다른 하나는?', shown, vals.findIndex((v) => v % 10 === other), {
          explain: `수로 쓰면 차례로 ${vals.join(', ')}이다. 낱개의 수는 차례로 ${vals.map((v) => v % 10).join(', ')}이다.`, facts: { choose: { exprs: vals.map((v) => `${v}%10`), rule: 'odd' }, unseen: vals.concat([10]) }
        });
      }),
      H('h-between-desc', '한쪽 끝을 설명으로 준 사이의 수', '43, 기본 ①63', (d) => {
        const t = d.int(2, 4), k = d.int(1, 7), lower = d.bool(), lo = lower ? t * 10 + k : t * 10 + k - 2, hi = lo + 2;
        return N(lower ? `「${packs(t, k)}」보다 크고 ${hi}보다 작은 수는?` : `${lo}보다 크고 「${packs(t, k)}」보다 작은 수는?`, lo + 1, {
          explain: `${packs(t, k)}는 ${t * 10 + k}이다. ${lo}보다 크고 ${hi}보다 작은 수는 ${lo + 1}이다.`, facts: { calc: [[lower ? `10*${t}+${k}+1` : `10*${t}+${k}-1`, 0]], unseen: [1] }
        });
      }, { standard: ORDER })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
