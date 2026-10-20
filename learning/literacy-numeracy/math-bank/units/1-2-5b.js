// 1학년 2학기 5단원 규칙 찾기 — 수 배열표, 규칙을 여러 가지 방법으로 나타내기의 기본 문항과 실력 문항.
// 꼴 목록(기본꼴_1 45꼴, 심화꼴 40꼴)을 꼴마다 따져서 실었다. 꼴 번호는 ①n = 기본꼴_1의 n번, 심n. 그림 도구는 1-2-5a.js가 B.kit.g125로 내보낸 것을 쓴다.
//
// 실력 문항의 잣대: 어려움은 보기가 아니라 배열·표의 장치에서 나와야 한다. 이 단원에서 아이들이 흔히 잘못 아는 것을 먼저 적는다.
//   ① 앞의 두세 개만 보고 반복되는 부분을 정한다(「귤, 귤, 참외, 귤」이 반복되는데 「귤, 귤, 참외」라고 한다. 처음과 끝이 같은 「○, △, ○」를 번갈아 놓인 것으로 본다).
//   ② 배열의 끝이 반복되는 부분의 가운데에서 끊기면, 끝에 보이는 조각이나 가운데 조각(△, ○)을 반복되는 부분으로 여긴다.
//   ③ 규칙은 모양에만 있다고 여긴다(모양이 모두 같으면 규칙이 없다고 한다).
//   ④ 다른 것으로 나타낼 때 「같은 것은 같은 것으로」를 끝까지 지키지 않는다(앞의 몇 칸만 맞춘다).
//   ⑤ 수를 적은 표는 언제나 → 방향으로 1씩, ↓ 방향으로 10씩 커진다고 여긴다(한 줄이 여섯 칸인 표에서도 아래 칸에 10 큰 수를 쓴다).
//   ⑥ 수 배열에서 커지는지 작아지는지, 끝까지 같은 수만큼인지를 살피지 않는다(같은 수들을 거꾸로 놓은 것, 한 곳만 다르게 뛴 것).
// 그다음에 두 번 넘게 생각해야 하는 문제를 실었다(비스듬한 방향, 빈칸이 두 곳인 수 배열, 규칙을 찾아 다른 수 배열에 다시 쓰기,
// 두 방향의 규칙을 이어 쓰는 떨어진 칸, 10개까지 이어 놓고 세기, 빈칸 셋을 모두 구해 비교하기).
//
// 뺀 것과 까닭(이 파일에 드는 꼴)
//  - ↘·↙ 방향(①32 심26), 한 줄의 칸 수가 10이 아닌 표(①35·36 심29·30)는 배우는 내용(→·↓ 방향)보다 한 걸음 나간 꼴이라 실력에만 실었다.
//  - 더 색칠할 수를 바르게 말한 사람(심34)은 어려움이 틀린 보기에서 나오는 꼴이라 실력에 싣지 않았다. 같은 일은 기본의 「다음에 색칠할 수」가 한다.
//  - 색칠 규칙을 이어 구한 두 수의 합(①38), 수로 나타낸 두 수의 합(①44 심7): 뜻 없는 셈. 두 자리 수끼리의 덧셈은 다음 단원(1-2-6)에서 배운다.
//  - 더 색칠할 수 가운데 홀수의 수(심35): 짝수와 홀수는 20 이하의 수에서만 다룬다.
//  - 표의 빈칸을 모두 채우기(심30), 주어진 규칙대로 색칠하기(①37 심32·36): 한 칸의 수·색칠할 수를 묻는 꼴로 바꾸어 실었다.
//  - 몸짓 그림(발 구르기·손뼉, ①42 심39)과 손가락 그림(①41)은 그리지 않고 모양·주사위·단추와 「쿵」「짝」으로 바꾸었다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { box, lines, josa, N, M, C } = B.kit;
  const { range, truthOf, nameOf, PAIRS, GLYPHS, outline, tinted, thing, bead, die, button, num, word, tile, BL, rows, row, pic, named, stack, chart, FORM, kindsOf, unitOf, run, period, sameRule, castShapes, castThings, told, noun } = B.kit.g125;
  const FIND = '2수02-01', MAKE = '2수02-02';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  // 수 배열표(한 줄에 10칸)의 칸: first 는 첫 칸의 수(일의 자리가 1)
  const hundred = (first) => (r, c) => first + r * 10 + c;
  const plus = (expr, times) => range(times).map(() => '+(' + expr + ')').join('');

  B.addTypes('1-2-5', 'table', [
    T('tb-dir', '→ 방향과 ↓ 방향의 규칙', '①30·31 심25', (d) => {
      const cell = hundred(d.int(0, 6) * 10 + 1);
      return M('수 배열표에서 규칙을 찾았다. ㉠, ㉡에 알맞은 수는?', [{ label: '㉠', answer: 1 }, { label: '㉡', answer: 10 }], {
        figure: stack([chart(cell, 4, 10), lines([`→ 방향으로 ${box('㉠')}씩 커진다.`, `↓ 방향으로 ${box('㉡')}씩 커진다.`])]),
        explain: `→ 방향으로 ${cell(0, 0)}, ${cell(0, 1)}, ${josa(cell(0, 2), '과/와')} 같이 1씩 커진다. ↓ 방향으로 ${cell(0, 0)}, ${cell(1, 0)}, ${josa(cell(2, 0), '과/와')} 같이 10씩 커진다.`,
        facts: { calc: [[`${cell(0, 1)}-${cell(0, 0)}`, 0], [`${cell(1, 0)}-${cell(0, 0)}`, 1]] }
      });
    }),
    T('tb-line', '색칠한 줄의 규칙', '①30·31 심25', (d) => {
      const cell = hundred(d.int(0, 6) * 10 + 1), down = d.bool(), k = down ? d.int(1, 8) : d.int(1, 2), marks = {};
      const spots = down ? range(4).map((r) => [r, k]) : range(10).map((c) => [k, c]);
      spots.forEach(([r, c]) => { marks[r + ',' + c] = 'on'; });
      const list = spots.map(([r, c]) => cell(r, c)), step = down ? 10 : 1;
      return M('수 배열표에서 색칠한 수의 규칙을 찾았다. ㉠, ㉡에 알맞은 수는?', [{ label: '㉠', answer: list[0] }, { label: '㉡', answer: step }], {
        figure: stack([chart(cell, 4, 10, marks), lines([`${box('㉠')}부터 시작하여 ${down ? '↓' : '→'} 방향으로 ${box('㉡')}씩 커진다.`])]),
        explain: `색칠한 수는 ${list[0]}, ${list[1]}, ${josa(list[2], '과/와')} 같이 ${list[0]}부터 시작하여 ${step}씩 커진다.`, facts: { calc: [[String(list[0]), 0], [`${list[1]}-${list[0]}`, 1]] }
      });
    }),
    T('tb-skip', '뛰어 세어 색칠한 수', '①33 심27', (d) => {
      const s = d.pick([2, 3, 4, 5]), first = d.int(0, 7) * 10 + 1, cell = hundred(first), a = first + d.int(0, 3), list = range(30).map((i) => a + i * s).filter((v) => v <= first + 29), marks = {};
      list.forEach((v) => { marks[Math.floor((v - first) / 10) + ',' + ((v - first) % 10)] = 'on'; });
      return M('수 배열표에 규칙에 따라 색칠하였다. ㉠, ㉡에 알맞은 수는?', [{ label: '㉠', answer: a }, { label: '㉡', answer: s }], {
        figure: stack([chart(cell, 3, 10, marks), lines([`색칠한 수는 ${box('㉠')}부터 시작하여 ${box('㉡')}씩 커진다.`])]),
        explain: `색칠한 수를 차례로 쓰면 ${list.slice(0, 4).join(', ')}이다. ${a}부터 시작하여 ${s}씩 커진다.`, facts: { calc: [[String(a), 0], [`${list[1]}-${list[0]}`, 1]] }
      });
    }),
    T('tb-cell', '수 배열표의 빈칸', '①34 심28', (d) => {
      // ㉠은 왼쪽 칸의 수가 보이고, ㉡은 위 칸의 수만 보인다.
      const cell = hundred(d.int(0, 6) * 10 + 1), p = d.int(2, 5), q = d.until(() => d.int(0, 9), (v) => v !== p + 1), marks = {};
      for (let r = 1; r < 4; r += 1) for (let c = 0; c < 10; c += 1) if (!(r === 1 && c <= p) && !(c === q && r < 3)) marks[r + ',' + c] = 'hide';
      marks['1,' + (p + 1)] = '㉠'; marks['3,' + q] = '㉡';
      return M('수 배열표의 일부가 가려졌다. ㉠, ㉡에 알맞은 수는?', [{ label: '㉠', answer: cell(1, p + 1) }, { label: '㉡', answer: cell(3, q) }], {
        figure: chart(cell, 4, 10, marks),
        explain: `→ 방향으로 1씩 커지므로 ㉠에 알맞은 수는 ${cell(1, p)}보다 1 큰 ${cell(1, p + 1)}이다. ↓ 방향으로 10씩 커지므로 ㉡에 알맞은 수는 ${cell(2, q)}보다 10 큰 ${cell(3, q)}이다.`,
        facts: { calc: [[`${cell(1, p)}+(${cell(0, 1)}-${cell(0, 0)})`, 0], [`${cell(2, q)}+(${cell(1, 0)}-${cell(0, 0)})`, 1]] }
      });
    }),
    T('tb-next', '다음에 색칠할 수', '①38 심32·33·34', (d) => {
      const s = d.pick([2, 3, 4, 5]), first = d.int(0, 7) * 10 + 1, cell = hundred(first), a = first + d.int(0, 4), list = range(5).map((i) => a + i * s), marks = {};
      list.slice(0, 4).forEach((v) => { marks[Math.floor((v - first) / 10) + ',' + ((v - first) % 10)] = 'on'; });
      return N('수 배열표에 규칙에 따라 색칠하고 있다. 다음에 색칠할 수는?', list[4], {
        figure: chart(cell, 3, 10, marks), explain: `색칠한 수는 ${list.slice(0, 3).join(', ')}, ${josa(list[3], '으로/로')} ${s}씩 커진다. ${list[3]}보다 ${s} 큰 수는 ${list[4]}이다.`, facts: { calc: [[`${list[3]}+${list[1]}-${list[0]}`, 0]] }
      });
    }),
    T('tb-apply', '말한 규칙대로 색칠할 수', '①37 심32', (d) => {
      // 틀린 보기: 색칠하는 수의 바로 옆 수, 그 둘레의 수
      const s = d.pick([2, 3, 4, 5]), first = d.int(0, 7) * 10 + 1, cell = hundred(first), a = first + d.int(0, 3), k = d.int(2, 4), right = a + k * s, marks = {};
      marks['0,' + (a - first)] = 'on';
      const near = d.shuffle(range(12, right - 6).filter((v) => v > a && v <= first + 29 && (v - a) % s !== 0 && Math.abs(v - right) > 1));
      const options = d.shuffle([right, right - 1, right + 1, near[0]]);
      return C(`수 배열표에서 ${a}부터 시작하여 ${s}씩 커지는 수에 색칠한다. 색칠하는 수는?`, options.map(String), options.indexOf(right), {
        figure: chart(cell, 3, 10, marks), explain: `${a}부터 ${s}씩 커지는 수를 차례로 쓰면 ${range(k + 2).map((i) => a + i * s).join(', ')}이다.`, facts: { pick: { expr: a + ('+' + s).repeat(k), options } }
      });
    }, { standard: MAKE })
  ]);

  B.addTypes('1-2-5', 'express', [
    T('ex-shape', '모양으로 나타내기', '①40 심37', (d) => {
      const form = FORM[d.pick(['AB', 'AAB', 'ABB', 'ABC'])], k = kindsOf(form), toks = castThings(d, k), syms = d.shuffle(GLYPHS).slice(0, k).map(outline), L = form.length, n = 8;
      const top = run(unitOf(form, toks), n), below = run(unitOf(form, syms), n), given = L + 1, at = d.int(given, n - 1), ans = below[at], picks = d.shuffle(syms);
      return C('규칙을 모양으로 나타내었다. ㉠에 알맞은 모양은?', picks.map((t) => pic(t)), picks.indexOf(ans), {
        figure: rows([top, below.map((t, i) => (i < given ? t : BL(i === at ? '㉠' : '')))], { w: 32, names: ['그림', '모양'], label: '규칙을 모양으로 나타내기' }),
        explain: `${toks.map((t, i) => `${josa(t.word, '은/는')} ${syms[i].word} 모양`).join(', ')}으로 나타내었다. ㉠의 위에는 ${josa(top[at].word, '이/가')} 있으므로 ㉠에 알맞은 모양은 ${noun(ans)}이다.`,
        facts: { kindPick: { kinds: picks.map(nameOf), target: ans.name } }
      });
    }),
    T('ex-number', '수로 나타내기', '①41 심38', (d) => {
      // 반복되는 부분은 셋인데 앞의 두 칸에만 수를 적어 둔다. 두 수가 번갈아 나온다고 여기지 않고 그림을 보아야 한다.
      const dice = d.bool(), form = FORM[d.pick(['AAB', 'ABB', 'ABC'])], vals = d.shuffle(dice ? range(6, 1) : [2, 3, 4]).slice(0, kindsOf(form)), unit = form.map((i) => vals[i]), n = 8, list = run(unit, n);
      const [i, j] = d.until(() => { const at = d.int(2, 4); return [at, d.int(at + 1, n - 1)]; }, ([x, y]) => list[x] !== list[y]);
      return M(`${dice ? '주사위 눈의 수' : '단추의 구멍 수'}로 규칙을 나타내었다. ㉠, ㉡에 알맞은 수는?`, [{ label: '㉠', answer: list[i] }, { label: '㉡', answer: list[j] }], {
        figure: rows([list.map(dice ? die : button), list.map((v, t) => (t < 2 ? num(v) : BL(t === i ? '㉠' : t === j ? '㉡' : '')))], { w: 32, names: [dice ? '주사위' : '단추', '수'], label: '규칙을 수로 나타내기' }),
        explain: `${dice ? '눈의 수' : '구멍의 수'}가 ${unit.join(', ')}의 차례로 반복된다. ㉠에 알맞은 수는 ${list[i]}, ㉡에 알맞은 수는 ${list[j]}이다.`, facts: { calc: [[String(list[i]), 0], [String(list[j]), 1]] }
      });
    }),
    T('ex-sound', '소리로 나타내기', '①42', (d) => {
      const form = FORM[d.pick(['AAB', 'ABB'])], toks = castShapes(d, 2), snd = d.shuffle(['쿵', '짝']), n = 8, top = run(unitOf(form, toks), n), said = run(form.map((i) => snd[i]), n);
      const i = d.int(4, 6), key = (pair) => pair.join(', '), pairs = d.shuffle([['쿵', '짝'], ['짝', '쿵'], ['쿵', '쿵'], ['짝', '짝']]);
      return C('모양의 규칙을 「쿵」, 「짝」 소리로 나타내었다. ㉠, ㉡에 알맞은 소리를 차례로 쓴 것은?', pairs.map(key), pairs.findIndex((pair) => pair[0] === said[i] && pair[1] === said[i + 1]), {
        figure: rows([top, said.map((w, t) => (t < 4 ? word(w) : BL(t === i ? '㉠' : t === i + 1 ? '㉡' : '')))], { w: 32, names: ['모양', '소리'], label: '규칙을 소리로 나타내기' }),
        explain: `${noun(toks[0])}은 ${snd[0]}, ${noun(toks[1])}은 ${josa(snd[1], '으로/로')} 나타내었다. ㉠의 위에는 ${noun(top[i])}, ㉡의 위에는 ${josa(noun(top[i + 1]), '이/가')} 있으므로 차례로 ${said[i]}, ${said[i + 1]}이다.`,
        facts: { kindPick: { kinds: pairs.map(key), target: key([said[i], said[i + 1]]) } }
      });
    }),
    T('ex-both', '모양과 수로 나타내기', '①43', (d) => {
      const form = FORM[d.pick(['AB', 'AAB', 'ABB'])], vals = d.shuffle(range(6, 1)).slice(0, 2), syms = d.shuffle(GLYPHS).slice(0, 2).map(outline), L = form.length, n = 7;
      const ids = run(form, n), [i, j] = d.until(() => [d.int(L + 1, n - 1), d.int(L + 1, n - 1)], ([a, b]) => a !== b);
      const options = d.shuffle([[0, 0], [0, 1], [1, 0], [1, 1]]), key = ([s, v]) => syms[s].word + ', ' + vals[v];
      return C('주사위의 규칙을 모양과 수로 나타내었다. ㉠에 알맞은 모양과 ㉡에 알맞은 수를 차례로 쓴 것은?', options.map(key), options.findIndex(([s, v]) => s === ids[i] && v === ids[j]), {
        figure: rows([ids.map((id) => die(vals[id])), ids.map((id, t) => (t <= L ? syms[id] : BL(t === i ? '㉠' : ''))), ids.map((id, t) => (t <= L ? num(vals[id]) : BL(t === j ? '㉡' : '')))], { w: 32, gap: 6, names: ['주사위', '모양', '수'], label: '규칙을 모양과 수로 나타내기' }),
        explain: `눈이 ${vals[0]}개인 주사위는 ${syms[0].word} 모양과 수 ${vals[0]}, 눈이 ${vals[1]}개인 주사위는 ${syms[1].word} 모양과 수 ${josa(vals[1], '으로/로')} 나타내었다. ㉠에 알맞은 모양은 ${noun(syms[ids[i]])}, ㉡에 알맞은 수는 ${vals[ids[j]]}이다.`,
        facts: { kindPick: { kinds: options.map(key), target: key([ids[i], ids[j]]) } }
      });
    }),
    T('ex-pick', '모양으로 바르게 나타낸 것', '①19·45', (d) => {
      // 틀린 줄: 같은 두 모양을 다른 차례로 반복한 것(셋째 칸 안에서 달라진다)
      const names = ['가', '나', '다'], keys = d.shuffle(['AB', 'AAB', 'ABB']), key = d.pick(keys), toks = castThings(d, 2), syms = d.shuffle(GLYPHS).slice(0, 2).map(outline), n = 8;
      const top = run(unitOf(FORM[key], toks), n), lists = keys.map((k) => run(unitOf(FORM[k], syms), n)), truth = lists.map((list) => sameRule(top.map(nameOf), list.map(nameOf))), at = truth.indexOf(true);
      return C(`규칙을 ${syms[0].word}, ${syms[1].word} 모양으로 바르게 나타낸 것은?`, names, at, {
        figure: stack([row(top, { w: 28 }), named(lists.map((list) => row(list, { w: 28, label: '모양으로 나타낸 것' })), names)]),
        explain: `${josa(toks[0].word, '을/를')} ${syms[0].word} 모양, ${josa(toks[1].word, '을/를')} ${syms[1].word} 모양으로 나타내면 ${josa(names[at], '과/와')} 같다.`, facts: { truth, want: true }
      });
    })
  ]);

  B.addGroup('1-2-5', {
    id: 'hard', title: '단원 종합', standard: FIND,
    types: [
      H('h-four', '반복되는 부분이 긴 배열의 규칙', '심3·16', (d) => {
        // 반복되는 부분이 넷이고 그 안에 같은 것이 거듭 나온다. 앞의 세 개만 보면 틀린 말이 맞아 보인다(다섯째나 여섯째에서 어긋난다).
        // 보기: 앞의 세 개를 말한 것(끝까지 보지 않은 아이), 두 가지가 번갈아 놓였다고 말한 것(가짓수만 본 아이)
        const form = d.pick([[0, 0, 1, 0], [0, 1, 0, 0], [0, 1, 1, 0]]), toks = castThings(d, 2), unit = unitOf(form, toks), list = run(unit, 10), p = period(list.map(nameOf));
        const said = d.shuffle([unit, unit.slice(0, 3), [toks[0], toks[1]]]).map((u) => [`${told(u, '이/가')} 반복된다.`, u.length === p && u.every((t, i) => t === list[i])]);
        return C('규칙에 따라 늘어놓았다. 규칙을 바르게 말한 것은?', said.map((row) => row[0]), said.findIndex((row) => row[1]), {
          figure: row(list), explain: `네 개씩 끊어 보면 ${told(unit, '이/가')} 반복된다. 세 개씩 끊으면 둘째 묶음이 첫째 묶음과 다르다.`, facts: truthOf(said, true)
        });
      }),
      H('h-cut', '끝이 끊긴 배열에서 반복되는 부분', '①1 심1·5', (d) => {
        // 배열의 끝이 반복되는 부분의 가운데에서 끊긴다.
        // 보기: 앞의 것만 묶은 것(끝까지 보지 않은 아이), 가운데 조각(한 묶음의 끝과 다음 묶음의 처음을 이은 아이), 하나를 더 묶은 것(다시 나오는 것까지 넣은 아이)
        const form = d.pick([[0, 1, 1], [0, 0, 1], [0, 1, 0], [0, 0, 1, 1]]), toks = castShapes(d, 2), unit = unitOf(form, toks), L = unit.length, list = run(unit, 2 * L + d.int(1, L - 1)), p = period(list.map(nameOf));
        const picks = d.shuffle([unit, list.slice(0, L - 1), list.slice(L - 1, L + 1), list.slice(0, L + 1)]), truth = picks.map((pick) => pick.length === p && pick.every((t, i) => t === list[i]));
        return C('규칙에 따라 놓은 모양에서 반복되는 부분은?', picks.map((pick) => pic(pick)), truth.indexOf(true), {
          figure: row(list), explain: `처음부터 ${L === 3 ? '세' : '네'} 개씩 끊어 보면 ${told(unit, '이/가')} 반복된다. 마지막 묶음은 끝까지 놓이지 않았다.`, facts: { truth, want: true }
        });
      }),
      H('h-color', '색만 바뀌는 배열의 규칙', '①3·8 심3', (d) => {
        // 모양은 모두 같고 색만 반복된다. 배열의 끝은 반복되는 부분의 가운데에서 끊긴다.
        // 보기: 두 색이 번갈아 놓였다고 말한 것, 차례를 잘못 말한 것, 모양만 보고 반복되는 것이 없다고 말한 것
        const glyph = d.pick(GLYPHS), cols = d.shuffle(d.pick(PAIRS)), toks = cols.map((c) => tinted(glyph, c)), keys = d.shuffle(['AAB', 'ABB', 'ABA']), unit = unitOf(FORM[keys[0]], toks), list = run(unit, d.pick([7, 8])), p = period(list.map(nameOf));
        const claims = [unit, unitOf(FORM[keys[1]], toks), [toks[0], toks[1]]].map((u) => [`색이 ${told(u, '으로/로')} 반복된다.`, u.length === p && u.every((t, i) => t === list[i])]);
        const said = d.shuffle(claims.concat([['모양이 모두 같아서 반복되는 것이 없다.', p > list.length / 2]]));
        return C(`색이 다른 ${glyph} 모양을 규칙에 따라 놓았다. 바르게 말한 것은?`, said.map((row) => row[0]), said.findIndex((row) => row[1]), {
          figure: row(list), explain: `모양은 모두 같지만 색이 ${told(unit, '으로/로')} 반복된다.`, facts: truthOf(said, true)
        });
      }),
      H('h-same', '같은 규칙으로 나타낸 것', '①45 심39·40', (d) => {
        // 구슬의 색 규칙을 수, 모양, 바둑돌로 나타낸 세 줄. 반복되는 부분의 길이는 모두 셋이고 한두 자리만 다르다.
        // 가·나·다는 쓰인 것이 서로 달라 겉모습으로는 가릴 수 없고, 구슬과 한 칸씩 맞대어 보아야 한다.
        const names = ['가', '나', '다'], keys = d.shuffle(['ABB', 'AAB', 'ABA']), key = d.pick(keys), cols = d.shuffle(d.pick(PAIRS)), top = run(unitOf(FORM[key], cols.map(bead)), 8), gs = d.shuffle(GLYPHS);
        const media = d.shuffle([[num(1), num(2)], [outline(gs[0]), outline(gs[1])], d.shuffle(['검은 돌', '흰 돌']).map(thing)]);
        const lists = keys.map((k, m) => run(unitOf(FORM[k], media[m]), 8)), truth = lists.map((list) => sameRule(top.map(nameOf), list.map(nameOf))), at = truth.indexOf(true);
        return C('구슬의 색 규칙과 같은 규칙으로 놓은 것은?', names, at, {
          figure: stack([row(top, { w: 28, label: '구슬' }), named(lists.map((list) => row(list, { w: 28 })), names)]),
          explain: `구슬은 ${told(top.slice(0, 3), '이/가')} 반복된다. 같은 색을 같은 것으로 바꾸어 놓은 것은 ${names[at]}이다.`, facts: { truth, want: true }
        });
      }),
      H('h-table-cols', '한 줄의 칸 수가 다른 표의 빈칸', '①35 심29·30', (d) => {
        // 한 줄이 10칸이 아니어서 아래 칸의 수가 10 큰 수가 아니다.
        const nc = d.pick([5, 6, 7, 8]), a = d.int(11, 40), cell = (r, c) => a + r * nc + c, c = d.int(1, nc - 2), marks = {};
        for (let k = 0; k < nc; k += 1) marks['3,' + k] = k === c ? '㉠' : 'hide';
        return N('수를 규칙에 따라 차례로 적은 표이다. ㉠에 알맞은 수는?', cell(3, c), {
          figure: chart(cell, 4, nc, marks, { label: '수를 차례로 적은 표' }),
          explain: `↓ 방향으로 ${cell(0, c)}, ${cell(1, c)}, ${josa(cell(2, c), '과/와')} 같이 ${nc}씩 커진다. ㉠에 알맞은 수는 ${cell(2, c)}보다 ${nc} 큰 ${cell(3, c)}이다.`, facts: { calc: [[`${cell(2, c)}+(${cell(1, 0)}-${cell(0, 0)})`, 0]] }
        });
      }),
      H('h-table-down', '아래로 차례로 적은 표의 규칙', '①35·36', (d) => {
        // 수를 ↓ 방향으로 차례로 적은 표. 보기: → 방향으로 1씩(늘 보던 수 배열표처럼 읽은 아이), ↓ 방향으로 10씩, 두 방향을 바꾸어 말한 것
        const nr = d.pick([3, 4, 5]), a = d.int(1, 30), cell = (r, c) => a + r + c * nr, across = cell(0, 1) - cell(0, 0), down = cell(1, 0) - cell(0, 0);
        const said = d.shuffle([['→', nr], ['→', 1], ['↓', nr], ['↓', 10]]).map(([way, step]) => [`${way} 방향으로 ${step}씩 커진다.`, (way === '→' ? across : down) === step]);
        return C('수를 규칙에 따라 적은 표이다. 규칙을 바르게 말한 것은?', said.map((row) => row[0]), said.findIndex((row) => row[1]), {
          figure: chart(cell, nr, 4, {}, { label: '수를 적은 표' }), explain: `→ 방향으로 ${cell(0, 0)}, ${cell(0, 1)}, ${josa(cell(0, 2), '과/와')} 같이 ${nr}씩 커진다. ↓ 방향으로는 1씩 커진다.`, facts: truthOf(said, true)
        });
      }),
      H('h-diag', '비스듬한 방향의 규칙', '①32 심26', (d) => {
        const cell = hundred(d.int(0, 6) * 10 + 1), right = d.bool(), c0 = right ? d.int(0, 6) : d.int(3, 9), spots = range(4).map((r) => [r, c0 + (right ? r : -r)]), marks = {};
        spots.forEach(([r, c]) => { marks[r + ',' + c] = 'on'; });
        const list = spots.map(([r, c]) => cell(r, c));
        return N(`수 배열표에서 색칠한 수는 ${right ? '↘' : '↙'} 방향으로 몇씩 커지는가?`, right ? 11 : 9, {
          figure: chart(cell, 4, 10, marks),
          explain: `${right ? '↘' : '↙'} 방향으로 한 칸 가면 ${right ? '→' : '←'} 방향으로 한 칸, ↓ 방향으로 한 칸 간 것이다. 1 ${right ? '커지고' : '작아지고'} 10 커지므로 ${right ? 11 : 9}씩 커진다. 색칠한 수는 ${list.join(', ')}이다.`,
          facts: { calc: [[`${list[1]}-${list[0]}`, 0]] }
        });
      }),
      H('h-two', '빈칸이 두 곳인 수 배열', '①22 심17·18', (d) => {
        // 이웃한 두 수는 끝의 두 수뿐이다. 거기서 규칙을 찾아 앞의 빈칸에 쓴다.
        const up = d.bool(), s = d.pick([2, 3, 4, 5, 10]), a = up ? d.int(1, 100 - 5 * s) : d.int(5 * s + 1, 100), list = range(6).map((i) => a + (up ? i : -i) * s), gap = up ? `(${list[5]}-${list[4]})` : `(${list[4]}-${list[5]})`, sign = up ? '+' : '-';
        return M('규칙에 따라 수를 놓았다. ㉠, ㉡에 알맞은 수는?', [{ label: '㉠', answer: list[1] }, { label: '㉡', answer: list[3] }], {
          figure: row([num(list[0]), BL('㉠'), num(list[2]), BL('㉡'), num(list[4]), num(list[5])], { label: '수 배열' }),
          explain: `이웃한 두 수 ${list[4]}, ${list[5]}에서 ${s}씩 ${up ? '커지는' : '작아지는'} 규칙을 찾는다. ㉠에 알맞은 수는 ${list[0]}보다 ${s} ${up ? '큰' : '작은'} ${list[1]}, ㉡에 알맞은 수는 ${list[2]}보다 ${s} ${up ? '큰' : '작은'} ${list[3]}이다.`,
          facts: { calc: [[`${list[0]}${sign}${gap}`, 0], [`${list[2]}${sign}${gap}`, 1]] }
        });
      }),
      H('h-which', '같은 수만큼 커지거나 작아지는 수 배열', '①24·27 심21', (d) => {
        // 네 줄 모두 비슷한 수로 되어 있다: 같은 수들을 거꾸로 놓은 것, 뛰는 수가 1 큰 것, 한 곳만 1 더 뛴 것
        const names = ['가', '나', '다', '라'], up = d.bool(), dir = up ? 1 : -1, s = d.pick([2, 3, 4, 5]), a = d.int(4 * (s + 1) + 1, 100 - 4 * (s + 1));
        const right = range(5).map((i) => a + dir * i * s), lists = d.shuffle([right, right.slice().reverse(), range(5).map((i) => a + dir * i * (s + 1)), right.map((v, i) => (i >= 3 ? v + dir : v))]);
        const truth = lists.map((list) => list.every((v, i) => i === 0 || v - list[i - 1] === dir * s)), at = truth.indexOf(true);
        return C(`${s}씩 ${up ? '커지는' : '작아지는'} 규칙으로 수를 놓은 것은?`, names, at, {
          figure: named(lists.map((list) => row(list.map(num), { w: 30, label: '수 배열' })), names),
          explain: `${josa(names[at], '은/는')} ${right.slice(0, 4).join(', ')}, ${josa(right[4], '으로/로')} 끝까지 ${s}씩 ${up ? '커진다' : '작아진다'}. 이웃한 두 수를 끝까지 비교해야 한다.`, facts: { truth, want: true }
        });
      }),
      H('h-ten', '10개를 놓을 때 한 모양의 수', '심8', (d) => {
        const form = d.pick([[0, 1, 0, 2], [0, 0, 1, 2], [0, 1, 2, 1], [0, 1, 1], [0, 0, 1]]), toks = castShapes(d, kindsOf(form)), unit = unitOf(form, toks), full = run(unit, 10), target = d.pick(toks), n = full.filter((t) => t === target).length;
        return N(`규칙에 따라 모두 10개를 놓는다. ${noun(target)}은 모두 몇 개인가?`, n, {
          unit: '개', figure: row(run(unit, unit.length === 3 ? 7 : 8)), explain: `${told(unit, '이/가')} 반복된다. 10개를 놓으면 ${full.map((t) => t.word).join(', ')}의 차례이다. ${noun(target)}은 모두 ${n}개이다.`, facts: { tallyOf: { list: full.map(nameOf), target: target.name } }
        });
      }),
      H('h-move', '같은 규칙으로 놓은 다른 수 배열', '①39 심22', (d) => {
        const up = d.bool(), dir = up ? 1 : -1, s = d.pick([2, 3, 4, 5, 10]), a = up ? d.int(1, 100 - 4 * s) : d.int(4 * s + 1, 100), top = range(5).map((i) => a + dir * i * s);
        const b = d.until(() => (up ? d.int(1, 100 - 3 * s) : d.int(3 * s + 1, 100)), (v) => Math.abs(v - a) % s !== 0 || Math.abs(v - a) > 5 * s), gap = up ? `(${top[1]}-${top[0]})` : `(${top[0]}-${top[1]})`;
        return N('위의 수 배열과 같은 규칙으로 아래에 수를 놓는다. ㉠에 알맞은 수는?', b + 2 * dir * s, {
          figure: rows([top.map(num), [num(b), BL(''), BL('㉠'), BL('')]], { w: 34, gap: 12, names: ['위', '아래'], label: '수 배열' }),
          explain: `위의 수 배열은 ${s}씩 ${up ? '커진다' : '작아진다'}. 아래에도 ${b}부터 ${s}씩 ${up ? '커지게' : '작아지게'} 놓으면 ${b}, ${b + dir * s}, ${b + 2 * dir * s}의 차례이다. ㉠에 알맞은 수는 ${b + 2 * dir * s}이다.`,
          facts: { calc: [[`${b}${up ? '+' : '-'}${gap}${up ? '+' : '-'}${gap}`, 0]] }
        });
      }),
      H('h-piece', '수 배열표 조각에서 떨어진 칸', '심31', (d) => {
        // ㉠은 수가 적힌 칸과 이웃해 있지 않다. → 방향과 ↓ 방향의 규칙을 이어 쓴다.
        const cell = hundred(d.int(0, 5) * 10 + d.int(1, 5)), tc = d.int(2, 4), marks = {}, shown = ['0,0', '0,1', '0,2', '1,0', '1,1', '2,0', '2,1'];
        for (let r = 0; r < 4; r += 1) for (let c = 0; c < 5; c += 1) if (!shown.includes(r + ',' + c)) marks[r + ',' + c] = 'empty';
        marks['3,' + tc] = '㉠';
        return N('수 배열표의 일부이다. ㉠에 알맞은 수는?', cell(3, tc), {
          figure: chart(cell, 4, 5, marks, { label: '수 배열표의 일부' }),
          explain: `→ 방향으로 1씩, ↓ 방향으로 10씩 커진다. ${cell(2, 0)}의 아래 칸은 ${cell(3, 0)}이고, 거기서 → 방향으로 ${tc}칸 가면 ${cell(3, tc)}이다.`,
          facts: { calc: [[`${cell(2, 0)}+(${cell(1, 0)}-${cell(0, 0)})` + plus(`${cell(0, 1)}-${cell(0, 0)}`, tc), 0]] }
        });
      }),
      H('h-tile-odd', '빈칸 가운데 색이 다른 하나', '심13', (d) => {
        const toks = d.shuffle(d.pick(PAIRS)).map(tile), unit = unitOf(FORM[d.pick(['AB', 'ABB', 'AAB'])], toks), L = unit.length, shift = L === 2 ? 1 : d.pick([1, 2]), nc = 7, labels = ['㉠', '㉡', '㉢'];
        const grid = range(2).map((r) => range(nc).map((c) => unit[(c + (r ? shift : 0)) % L]));
        // 빈칸 셋은 읽는 차례로 ㉠, ㉡, ㉢. 둘은 같은 색이고 하나만 다르다.
        const cells = d.until(() => d.shuffle(range(2 * nc)).slice(0, 3).sort((x, y) => x - y), (list) => list.every((k) => k % nc >= 1) && new Set(list.map((k) => grid[Math.floor(k / nc)][k % nc])).size === 2);
        const fills = cells.map((k) => grid[Math.floor(k / nc)][k % nc].word), lone = fills.findIndex((w) => fills.filter((v) => v === w).length === 1);
        return C('규칙에 따라 색칠한 무늬이다. ㉠, ㉡, ㉢ 가운데 칠할 색이 다른 하나는?', labels, lone, {
          figure: rows(grid.map((line, r) => line.map((t, c) => (cells.includes(r * nc + c) ? BL(labels[cells.indexOf(r * nc + c)]) : t))), { w: 32, gap: 0, label: '색칠한 무늬' }),
          explain: `첫째 줄은 ${told(grid[0].slice(0, L), '이/가')} 반복되고, 둘째 줄은 ${told(grid[1].slice(0, L), '이/가')} 반복된다. ㉠에는 ${fills[0]}, ㉡에는 ${fills[1]}, ㉢에는 ${josa(fills[2], '을/를')} 칠한다.`, facts: { tileOdd: fills }
        });
      }, { standard: MAKE }),
      H('h-tile-right', '규칙에 맞게 꾸민 무늬', '심12', (d) => {
        // 세 무늬는 한 칸씩만 다르다. 틀린 무늬도 앞의 세 칸은 규칙에 맞아, 줄마다 끝까지 살펴야 한다.
        // 한 줄은 아홉 칸(반복되는 부분이 세 번). 틀린 줄은 어떤 짧은 부분으로도 반복되지 않는다.
        const names = ['가', '나', '다'], toks = d.shuffle(d.pick(PAIRS)).map(tile), unit = unitOf(FORM[d.pick(['ABB', 'AAB'])], toks), shift = d.pick([1, 2]), nc = 9;
        const good = range(2).map((r) => range(nc).map((c) => unit[(c + (r ? shift : 0)) % 3])), other = (t) => (t === toks[0] ? toks[1] : toks[0]), repeats = (line) => period(line.map(nameOf)) <= 3;
        const spoil = ([r, c]) => good.map((line, i) => line.map((t, j) => (i === r && j === c ? other(t) : t)));
        const spots = d.until(() => [[d.int(0, 1), d.int(3, nc - 1)], [d.int(0, 1), d.int(3, nc - 1)]], ([p, q]) => (p[0] !== q[0] || p[1] !== q[1]) && [p, q].every((spot) => period(spoil(spot)[spot[0]].map(nameOf)) > nc / 2));
        const grids = d.shuffle([good, spoil(spots[0]), spoil(spots[1])]), truth = grids.map((grid) => grid.every(repeats)), at = truth.indexOf(true);
        return C('무늬를 꾸몄다. 두 줄 모두 색이 규칙에 따라 반복되는 것은?', names, at, {
          figure: named(grids.map((grid) => rows(grid, { w: 24, gap: 0, label: '색칠한 무늬' })), names),
          explain: `${josa(names[at], '은/는')} 첫째 줄에서 ${told(good[0].slice(0, 3), '이/가')} 반복되고, 둘째 줄에서 ${told(good[1].slice(0, 3), '이/가')} 반복된다. 나머지 둘은 규칙에 맞지 않는 칸이 하나씩 있다.`, facts: { truth, want: true }
        });
      }, { standard: MAKE })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
