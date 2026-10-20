// 2학년 2학기 6단원 규칙 찾기 — 실력 문항.
// 꼴 번호는 ①n = 기본꼴_1의 n번, 심n. 그림 도구는 2-2-6a.js가 B.kit.g226으로 내보낸 것을 쓴다.
//
// 실력 문항의 잣대: 어려움은 보기가 아니라 배열·표·그림의 장치에서 나와야 한다. 이 단원에서 아이들이 흔히 잘못 아는 것을 먼저 적는다.
//   ① 앞의 두세 개만 보고 반복되는 부분을 정한다(○ △ △ ○ △ △ ○ △ 에서 「○, △」가 반복된다고 한다. 줄이 가운데에서 끊기면 끝에 보이는 조각을 묶는다).
//   ② 「반복되는가, 늘어나는가」를 끝까지 살피지 않는다(1개, 2개, 3개로 늘어나는 것을 2개씩 반복된다고 보거나, 1개·3개·5개가 반복되는 것을 2개씩 늘어난다고 본다. 3시, 6시, 9시 다음은 12시라고 한다).
//   ③ 수로 바꾸어 나타낼 때 「같은 것은 같은 수, 다른 것은 다른 수」를 지키지 않는다(모양이 셋인데 수를 둘만 쓰거나, 칸마다 1, 2, 3, 4를 붙인다).
//   ④ 「시계 방향」과 「시계 반대 방향」을 가려 말하지 못하고, 앞의 두 그림만 보고 돌아간다고 여긴다.
//   ⑤ 위·아래와 늘어남·줄어듦을 함께 맞추지 못한다(「위층으로 갈수록 늘어난다」).
//   ⑥ 외운 규칙을 그대로 댄다: 덧셈표는 언제나 오른쪽·아래로 1씩 커지고 ↙ 방향은 같은 수라고 한다. 4단 곱셈구구의 줄은 언제나 4씩 커진다고 한다.
//      수는 언제나 왼쪽에서 오른쪽으로, 위에서 아래로 커진다고 한다(승강기 단추, 오른쪽부터 번호를 붙인 사물함).
//   ⑦ 「넷째 금요일」을 달력의 넷째 줄에서 찾는다.
// 그다음에 두 번 넘게 생각해야 하는 문제를 실었다(한 층씩 늘어나는 모양, 그다음 모양, 가려진 수를 찾아 다른 칸 채우기, 가로와 세로의 규칙을 이어 쓰기,
// 보이지 않는 날짜를 7씩 거슬러 요일 찾기, 번호로 자리 찾기).
// 한 층씩 늘어나는 모양(①29)은 층마다 놓는 수가 일정하게(1개씩·2개씩) 많아지지만 모양 전체가 늘어나는 수는 달라진다. 그래서 실력에만 두고 그림 바로 다음(넷째) 모양까지만 묻는다.
//
// 실력에 두지 않은 것
//  - 돌아가는 방향을 말한 것 고르기(심8), 달력의 규칙으로 옳지 않은 것(심38): 한 가지 규칙을 바로 대는 일이라 기본 묶음에 실었다.
//  - 한 방향으로 돌지 않고 네 자리를 정해진 차례로 옮겨 가는 색칠(심10): 「시계 반대 방향으로 옮겨 가는 것」(h-turn-which)의 틀린 줄로 넣었다.
//  - 늘어나는 무늬의 빈칸을 다 채운 뒤 한 모양 세기(심13): 열네 칸을 넘겨 놓아야 규칙이 답을 가르는데 한 줄(휴대폰 너비)에 그릴 수 없어 미루었다. 이어 놓는 일은 gr-next와 h-grow-blank가 한다.
//  - 아파트 호수(심43): 아래에서 위로 커지는 번호라는 장치가 승강기 단추(h-way)와 같다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { box, lines, josa, N, M, C } = B.kit;
  const { ORD, range, sum, truthOf, nameOf, distinct, STONES, thing, quad, clock, num, BL, row, pic, named, stack, walls, layersOf, heightsOf, FORM, unitOf, run, period, isUnit, sameRule, castShapes, told, noun, keyOf, GROW, grown, stepsSaid,
    sheet, piece, WEEK, weeksOf, calendar, board, stepAlong, claim, headsOf } = B.kit.g226;
  const FIND = '2수02-01';
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});

  B.addGroup('2-2-6', {
    id: 'hard', title: '단원 종합', standard: FIND,
    types: [
      H('h-unit', '가운데에서 끊긴 무늬의 반복되는 부분', '심1 ①1', (d) => {
        // 줄의 끝이 반복되는 부분의 가운데에서 끊긴다.
        // 보기: 앞의 것만 묶은 것(끝까지 보지 않은 아이), 가운데 조각(한 묶음의 끝과 다음 묶음의 처음을 이은 아이), 하나를 더 묶은 것(다시 나오는 것까지 넣은 아이)
        const form = FORM[d.pick(['ABB', 'AAB', 'AABC', 'ABBC', 'ABCB'])], toks = castShapes(d, Math.max.apply(null, form) + 1), unit = unitOf(form, toks), L = unit.length, list = run(unit, 2 * L + d.int(1, 2));
        const picks = d.shuffle(distinct([unit, list.slice(0, L - 1), list.slice(L - 1, L + 1), list.slice(0, L + 1)], keyOf)), truth = picks.map((pick) => isUnit(pick, list));
        return C('모양을 규칙에 따라 놓다가 멈추었다. 반복되는 부분은?', picks.map((pick) => pic(pick)), truth.indexOf(true), {
          figure: row(list, { label: '무늬' }), explain: `처음부터 ${L === 3 ? '세' : '네'} 개씩 끊어 보면 ${told(unit, '이/가')} 반복된다. 마지막 묶음은 끝까지 놓이지 않았다.`, facts: { truth, want: true }
        });
      }),
      H('h-num-pick', '무늬를 수로 바르게 나타낸 것', '①10·11', (d) => {
        // 모양은 셋이고 반복되는 부분은 넷이다. 세 줄 모두 1, 2로 시작한다(또는 1, 1).
        // 가·나·다: 바르게 나타낸 것, 수를 둘만 쓴 것(두 모양을 같은 수로 — 가짓수를 세지 않은 아이), 칸마다 1, 2, 3, 4를 붙인 것(같은 모양에 다른 수 — 반복되는 칸 수만 본 아이)
        const names = ['가', '나', '다'], form = FORM[d.pick(['ABCB', 'ABAC', 'AABC', 'ABBC', 'ABCC', 'ABCA'])], toks = castShapes(d, 3), top = run(unitOf(form, toks), 8);
        const merged = d.pick([1, 2]), lists = d.shuffle([run(form.map((i) => i + 1), 8), run(form.map((i) => (i === 2 ? merged : i + 1)), 8), run([1, 2, 3, 4], 8)]), truth = lists.map((list) => sameRule(top.map(nameOf), list)), at = truth.indexOf(true);
        return C('무늬를 수로 바꾸어 나타내었다. 같은 모양은 같은 수로, 다른 모양은 다른 수로 나타낸 것은?', names, at, {
          figure: named([row(top, { w: 28, label: '무늬' })].concat(lists.map((list) => row(list.map(num), { w: 28, label: '수로 나타낸 것' }))), [''].concat(names)),
          explain: `무늬는 ${told(top.slice(0, 4), '이/가')} 반복된다. 모양이 세 가지이므로 수도 세 가지를 쓰고, 같은 모양에는 같은 수를 쓴다. 바르게 나타낸 것은 ${names[at]}이다.`, facts: { truth, want: true }
        });
      }),
      H('h-grow-blank', '늘어나는 무늬의 빈칸', '심11', (d) => {
        // 한 가지는 1개씩 놓이고 다른 것은 1개, 2개, 3개로 늘어난다. 빈칸은 셋째 묶음의 끝이다.
        // 빈칸 앞의 여섯 칸만 보면 「가, 나, 나」가 반복되는 것처럼 보여 빈칸에 「가」를 놓게 된다.
        const [x, y] = d.bool() ? castShapes(d, 2) : d.shuffle(STONES).map(thing), picks = d.shuffle([x, y]);
        const grows = (list) => { const runs = []; let ok = true; list.forEach((t, i) => { if (t === y) { if (i > 0 && list[i - 1] === y) runs[runs.length - 1] += 1; else runs.push(1); } else if (i > 0 && list[i - 1] === x) ok = false; }); return ok && runs.slice(0, 3).join() === '1,2,3'; };
        const truth = picks.map((t) => grows([x, y, x, y, y, x, y, y, t, x]));
        return C(`${josa(noun(x), '과/와')} ${josa(noun(y), '을/를')} 규칙에 따라 놓았다. 빈칸에 알맞은 것은?`, picks.map((t) => pic(t)), truth.indexOf(true), {
          figure: row([x, y, x, y, y, x, y, y, BL(), x], { label: '무늬' }),
          explain: `${noun(x)} 사이에 놓은 ${josa(noun(y), '이/가')} 1개, 2개, 3개로 1개씩 늘어난다. 빈칸은 3개를 놓는 곳의 셋째 자리이므로 ${noun(y)}이다. 빈칸에 ${josa(noun(x), '을/를')} 놓으면 ${josa(noun(x), '이/가')} 2개 이어져 규칙에 맞지 않는다.`, facts: { truth, want: true }
        });
      }),
      H('h-turn-which', '말한 방향으로 옮겨 가는 것', '심8·9·10', (d) => {
        // 세 줄 모두 같은 칸에서 시작한다. 가·나·다: 시계 방향으로 도는 것, 시계 반대 방향으로 도는 것, 앞의 두 그림은 맞는 줄과 같지만 셋째 그림에서 건너편 칸으로 건너뛰는 것
        const names = ['가', '나', '다'], s = d.int(0, 3), cw = d.bool(), dir = cw ? 1 : 3, at = (step) => range(5).map((i) => (s + step(i)) % 4);
        const seqs = d.shuffle([at((i) => i * dir), at((i) => i * (4 - dir)), at((i) => [0, dir, 4 - dir, 2 * (4 - dir), 0][i])]);
        const truth = seqs.map((seq) => seq.every((p, i) => i === 0 || (p - seq[i - 1] + 4) % 4 === dir)), right = truth.indexOf(true);
        return C(`●의 자리가 ${cw ? '시계 방향' : '시계 반대 방향'}으로 한 칸씩 옮겨 가는 것은?`, names, right, {
          figure: named(seqs.map((seq) => row(seq.map(quad), { w: 40, label: '●의 자리' })), names),
          explain: `${josa(names[right], '은/는')} ●이 ${seqs[right].slice(0, 4).map((p) => quad(p).word).join(', ')}의 차례로 ${cw ? '시계 방향' : '시계 반대 방향'}으로 한 칸씩 옮겨 간다. 나머지 둘은 반대 방향으로 돌거나 한 칸씩 옮겨 가지 않는 곳이 있다.`, facts: { truth, want: true }
        });
      }),
      H('h-stack-unit', '끝까지 쌓지 않은 줄의 규칙', '①21 심14', (d) => {
        // 줄이 반복되는 부분의 처음 수로 끝난다. 「3개, 1개, 3개」가 한 묶음처럼 보인다.
        const [a, b] = d.until(() => [d.int(1, 3), d.int(1, 3)], ([p, q]) => p !== q), unit = d.pick([[a, b], [a, b, b], [a, a, b]]), hs = run(unit, unit.length * 2 + 1);
        const say = (u) => [`${u.map((v) => v + '개').join(', ')}씩 반복된다.`, u.length === period(hs) && u.every((v, i) => v === hs[i])];
        const said = d.shuffle(distinct([say(unit), say(hs.slice(0, unit.length + 1)), say(hs.slice(1, unit.length + 1)), say(unit.length === 2 ? [a, b, b] : [a, b])], (s) => s[0]));
        return C('쌓기나무를 규칙에 따라 쌓다가 멈추었다. 왼쪽부터 쌓은 규칙을 바르게 말한 것은?', said.map((s) => s[0]), said.findIndex((s) => s[1]), {
          figure: walls([hs], undefined, '쌓기나무를 쌓은 모양: 왼쪽부터 ' + hs.map((v) => v + '개').join(', ')),
          explain: `왼쪽부터 ${hs.map((v) => v + '개').join(', ')}이다. ${unit.map((v) => v + '개').join(', ')}씩 반복되고, 마지막 ${hs[hs.length - 1]}개는 다음 묶음의 처음이다.`, facts: truthOf(said, true)
        });
      }),
      H('h-stack-nth', '반복되는 모양의 몇째', '심15', (d) => {
        // 쌓기나무의 수가 커지는 세 모양이 반복된다. 앞의 셋만 보면 같은 수만큼 늘어나는 것처럼 보인다.
        const SHAPES = { 1: [1], 2: [2], 3: [2, 1], 4: [2, 2], 5: [3, 2], 6: [3, 3] }, unit = d.pick([[1, 2, 3], [2, 4, 6], [1, 3, 5], [2, 3, 4], [1, 2, 4]]), shown = d.pick([4, 5]), k = shown + 2, counts = run(unit, shown), p = period(counts);
        return N(`쌓기나무로 만든 모양을 규칙에 따라 놓았다. ${ORD[k - 1]}에 놓을 모양의 쌓기나무는 몇 개인가?`, unit[(k - 1) % 3], {
          unit: '개', figure: walls(counts.map((v) => SHAPES[v]), ORD, stepsSaid(counts.map((v) => SHAPES[v])), { u: 15, gap: 8 }),
          explain: `쌓기나무가 ${unit.map((v) => v + '개').join(', ')}인 모양이 반복된다. 이어서 놓으면 ${range(k - shown, shown).map((i) => ORD[i] + ' ' + unit[i % 3] + '개').join(', ')}이다. 넷째 모양이 다시 ${unit[0]}개이므로 계속 늘어나는 규칙이 아니다.`,
          facts: { calc: [[String(counts[(k - 1) % p]), 0]] }
        });
      }),
      H('h-layer-say', '층마다 쌓은 수의 규칙', '①25 심16', (d) => {
        // 위층이 아래층의 가운데쯤에 놓여 층마다 세어 보아야 한다. 틀린 말: 위·아래를 거꾸로 말한 것, 늘어남·줄어듦을 거꾸로 말한 것, 수를 잘못 센 것
        const s = d.pick([1, 2]), t = d.int(1, 2), tops = [t, t + s, t + 2 * s], hs = heightsOf(tops, [d.int(0, s), d.int(0, s), 0]), layers = layersOf(hs), down = layers[0] - layers[1], other = s === 1 ? 2 : 1;
        const flat = layers.every((v, i) => i === 0 || layers[i - 1] - v === down), say = (lower, grows, n) => [`${lower ? '아래층으로 내려갈수록' : '위층으로 올라갈수록'} 쌓기나무가 ${n}개씩 ${grows ? '늘어난다' : '줄어든다'}.`, flat && n === down && lower === grows];
        const trues = [say(true, true, s), say(false, false, s)], falses = [say(false, true, s), say(true, false, s), say(true, true, other), say(false, false, other)], said = d.shuffle([d.pick(trues)].concat(d.shuffle(falses).slice(0, 3)));
        return C('쌓기나무를 규칙에 따라 쌓았다. 층마다 쌓은 쌓기나무의 수를 바르게 말한 것은?', said.map((row) => row[0]), said.findIndex((row) => row[1]), {
          figure: walls([hs], undefined, '쌓기나무를 쌓은 모양: ' + layers.map((v, i) => (i + 1) + '층 ' + v + '개').join(', ')),
          explain: `쌓기나무는 3층에 ${layers[2]}개, 2층에 ${layers[1]}개, 1층에 ${layers[0]}개이다. 아래층으로 내려갈수록 ${s}개씩 늘어나고, 위층으로 올라갈수록 ${s}개씩 줄어든다.`, facts: truthOf(said, true)
        });
      }),
      H('h-stairs-next', '한 층씩 늘어나는 모양의 다음', '①29', (d) => {
        // 모양이 한 층씩 늘어나고 새 층은 앞의 층보다 일정하게 많다. 새 층에 놓을 수를 찾아 셋째 모양에 더한다.
        const kind = d.pick(['stairs', 'pyramid', 'wide']), tops = (n) => range(n).map((i) => (kind === 'stairs' ? i + 1 : kind === 'pyramid' ? 2 * i + 1 : i + 2));
        const shapeOf = (n) => heightsOf(tops(n), range(n).map((i) => (kind === 'pyramid' && i < n - 1 ? 1 : 0))), list = range(3, 1).map(shapeOf), counts = list.map(sum), floors = list.map((hs) => layersOf(hs)[0]), next = sum(shapeOf(4));
        return N('쌓기나무를 한 층씩 늘려 가며 쌓았다. 넷째 모양에 쌓을 쌓기나무는 모두 몇 개인가?', next, {
          unit: '개', figure: walls(list, ORD, '쌓기나무로 쌓은 모양: ' + list.map((hs, i) => ORD[i] + ' ' + counts[i] + '개(맨 아래층 ' + floors[i] + '개)').join(', ')),
          explain: `모양이 한 층씩 늘어나고, 맨 아래층은 ${floors[0]}개, ${floors[1]}개, ${floors[2]}개로 ${floors[2] - floors[1]}개씩 많아진다. 넷째 모양의 맨 아래층은 ${floors[2] + floors[2] - floors[1]}개이므로 ${counts[2]} + ${floors[2] + floors[2] - floors[1]} = ${next}(개)이다.`,
          facts: { calc: [[`${counts[2]}+${floors[2]}+(${floors[2]}-${floors[1]})`, 0]] }
        });
      }),
      H('h-stack-far', '그다음에 쌓을 모양의 쌓기나무 수', '심19 ①28', (d) => {
        // 위와 옆으로 함께 늘어난다(늘어나는 수는 일정). 그림에 없는 넷째 모양을 거쳐 다섯째 모양까지 간다.
        const key = d.pick(['ell', 'tee']), b = key === 'ell' ? d.int(1, 2) : 1, list = grown(key, b, 3), counts = list.map(sum), step = counts[2] - counts[1], next = sum(GROW[key].make(5, b));
        return N('쌓기나무를 규칙에 따라 쌓았다. 다섯째 모양을 쌓는 데 필요한 쌓기나무는 몇 개인가?', next, {
          unit: '개', figure: walls(list, ORD, stepsSaid(list)),
          explain: `쌓기나무가 ${GROW[key].said} 늘어난다. 넷째 모양은 ${counts[2]} + ${step} = ${counts[2] + step}(개), 다섯째 모양은 ${counts[2] + step} + ${step} = ${next}(개)이다.`,
          facts: { calc: [[`${counts[2]}+(${counts[2]}-${counts[1]})+(${counts[2]}-${counts[1]})`, 0]] }
        });
      }),
      H('h-add-uneven', '가로와 세로가 다르게 커지는 덧셈표', '심27·29', (d) => {
        // 가장 윗줄의 수와 왼쪽 줄의 수가 서로 다른 수만큼 커진다. 「↙ 방향은 같은 수」「아래로도 오른쪽과 같은 수만큼」으로 외운 것이 통하지 않는다.
        const [p, q] = d.pick([[1, 2], [2, 3], [1, 3]]), top = headsOf(d.int(1, 3), p, 5), side = headsOf(d.int(1, 2), q, 4), cell = (r, c) => side[r] + top[c], say = (way, amount) => claim(cell, 4, 5, way, amount, true);
        const mode = d.bool(), said = d.shuffle(mode
          ? [say('right', p), say('down', q), say('se', p + q), ['↙ 방향의 수는 모두 같다.', stepAlong(cell, 4, 5, 'sw') === 0]]
          : [say('right', p), say('down', p), say('se', p + q), say('sw', q - p)]);
        return C('덧셈표에서 찾은 규칙으로 옳지 않은 것은?', said.map((s) => s[0]), said.findIndex((s) => !s[1]), {
          figure: sheet('+', top, side, cell), explain: `오른쪽으로 갈수록 ${p}씩, 아래로 내려갈수록 ${q}씩 커진다. ↘ 방향으로는 ${p} + ${q} = ${p + q}씩 커지고, ↙ 방향으로는 ${cell(0, 1)}, ${josa(cell(1, 0), '과/와')} 같이 ${q - p}씩 커진다.`, facts: truthOf(said, false)
        });
      }),
      H('h-add-head', '수가 지워진 덧셈표', '①43 심23', (d) => {
        // 가장 왼쪽 줄의 수 하나가 지워졌다. 그 줄의 다른 칸에서 지워진 수를 찾아 ㉠을 채운다.
        const top = headsOf(d.pick([1, 2]), 2, 4), side = headsOf(d.int(1, 4), d.pick([1, 2]), 3), cell = (r, c) => side[r] + top[c], hid = d.int(1, 2), [c1, c2] = d.shuffle(range(4)).slice(0, 2), marks = {};
        range(4).forEach((c) => { marks[hid + ',' + c] = c === c2 ? '㉠' : c === c1 ? '' : 'none'; });
        return N('덧셈표의 일부가 지워졌다. ㉠에 알맞은 수는?', cell(hid, c2), {
          figure: sheet('+', top, side.map((v, r) => (r === hid ? '' : v)), cell, marks),
          explain: `지워진 수와 ${top[c1]}의 합이 ${cell(hid, c1)}이므로 지워진 수는 ${side[hid]}이다. ㉠에 알맞은 수는 ${side[hid]} + ${top[c2]} = ${cell(hid, c2)}이다.`,
          facts: { calc: [[`${cell(hid, c1)}-${top[c1]}+${top[c2]}`, 0]] }
        });
      }),
      H('h-piece', '계단 모양으로 떼어 낸 조각', '심25', (d) => {
        // 가로의 규칙과 세로의 규칙을 수가 적힌 세 칸에서 찾아 이어 쓴다. ㉠은 수가 적힌 칸과 이웃해 있지 않다.
        const [p, q] = d.pick([[1, 1], [2, 2], [1, 2], [2, 1], [3, 3]]), base = d.int(3, 10), v = (r, c) => base + c * p + r * q;
        return N('덧셈표에서 떼어 낸 조각이다. ㉠에 알맞은 수는?', v(2, 2), {
          figure: piece([[v(0, 0), v(0, 1), undefined], [undefined, v(1, 1), ''], [undefined, undefined, '㉠']], '덧셈표에서 떼어 낸 조각'),
          explain: `${v(0, 0)}, ${v(0, 1)}에서 오른쪽으로 갈수록 ${p}씩, ${v(0, 1)}, ${v(1, 1)}에서 아래로 내려갈수록 ${q}씩 커진다. ${v(1, 1)}의 오른쪽 칸은 ${v(1, 2)}이고, 그 아래 칸 ㉠은 ${v(1, 2)} + ${q} = ${v(2, 2)}이다.`,
          facts: { calc: [[`${v(1, 1)}+(${v(0, 1)}-${v(0, 0)})+(${v(1, 1)}-${v(0, 1)})`, 0]] }
        });
      }),
      H('h-mul-skip', '수가 2씩 커지는 곱셈표의 한 줄', '①48 심34', (d) => {
        // 가장 윗줄과 왼쪽 줄의 수가 2씩 커진다. 4단 곱셈구구의 줄이 4씩이 아니라 8씩 커진다.
        const top = d.pick([[1, 3, 5, 7, 9], [2, 4, 6, 8]]), n = top.length, cell = (r, c) => top[r] * top[c], k = d.int(1, n - 1), across = d.bool(), marks = {}, vals = range(n).map((i) => (across ? cell(k, i) : cell(i, k)));
        range(n).forEach((i) => { marks[across ? k + ',' + i : i + ',' + k] = 'on'; });
        return N(`곱셈표에서 색칠한 수는 ${top[k]}단 곱셈구구의 수이다. 색칠한 수는 ${across ? '오른쪽으로 갈수록' : '아래로 내려갈수록'} 몇씩 커지는가?`, 2 * top[k], {
          figure: sheet('×', top, top, cell, marks),
          explain: `색칠한 수는 ${vals.join(', ')}이다. ${vals[1]} − ${vals[0]} = ${2 * top[k]}이므로 ${2 * top[k]}씩 커진다. 곱하는 수가 ${top[0]}, ${top[1]}, ${josa(top[2], '과/와')} 같이 2씩 커지므로 ${top[k]}씩 커지지 않는다.`,
          facts: { calc: [[`${vals[1]}-${vals[0]}`, 0]] }
        });
      }),
      H('h-cal-torn', '찢어진 달력에서 몇째 요일의 날짜', '①55 심39', (d) => {
        // 첫째 줄에 그 요일이 없는 달이 섞여 있다(넷째 금요일이 달력의 넷째 줄에 있지 않다).
        const first = d.int(1, 6), w = d.bool() ? d.int(0, first - 1) : d.int(0, 6), k = d.pick([3, 4]), weeks = weeksOf(first, 30), list = weeks.map((line) => line[w]).filter((day) => day > 0), day = list[k - 1];
        return N(`어느 달의 달력이 찢어져 아래쪽이 보이지 않는다. 이 달의 ${ORD[k - 1]} ${WEEK[w]}요일은 며칠인가?`, day, {
          unit: '일', figure: calendar(first, 30, { rows: 2 }),
          explain: `첫째 ${WEEK[w]}요일은 ${list[0]}일이다. 같은 요일은 7일마다 반복되므로 ${WEEK[w]}요일은 ${list.slice(0, k).map((v) => v + '일').join(', ')}이다. ${ORD[k - 1]} ${WEEK[w]}요일은 ${day}일이다.`,
          facts: { calc: [[String(((w - first + 7) % 7) + 1) + '+(8-1)'.repeat(k - 1), 0]] }
        });
      }),
      H('h-cal-day', '찢어진 달력에서 날짜의 요일', '심40', (d) => {
        // 보이지 않는 날짜에서 7씩 거슬러 보이는 날짜를 찾는다.
        const first = d.int(0, 6), weeks = weeksOf(first, 30), shown = 3, last = weeks[shown - 1][6], day = d.int(last + 3, Math.min(29, last + 9)), back = range(4).map((i) => day - 7 * i).filter((v) => v >= 1), seen = back.find((v) => v <= last);
        const w = weeks.find((line) => line.includes(seen)).indexOf(seen), options = d.shuffle([w, (w + 1) % 7, (w + 6) % 7, (w + 2) % 7]).map((i) => WEEK[i] + '요일');
        return C(`어느 달의 달력이 찢어져 아래쪽이 보이지 않는다. 이 달의 ${day}일은 무슨 요일인가?`, options, options.indexOf(WEEK[w] + '요일'), {
          figure: calendar(first, 30, { rows: shown }),
          explain: `같은 요일은 7일마다 반복된다. ${back.slice(0, back.indexOf(seen) + 1).map((v) => v + '일').join(', ')}은 모두 같은 요일이다. ${seen}일이 ${WEEK[w]}요일이므로 ${day}일도 ${WEEK[w]}요일이다.`,
          facts: { kindPick: { kinds: options, target: WEEK[(first + day - 1) % 7] + '요일' } }
        });
      }),
      H('h-seat-where', '번호로 자리 찾기', '심41', (d) => {
        // 셋째 줄과 넷째 줄에는 번호를 적지 않았다. 줄의 첫 번호를 구해 이어 센다.
        const n = d.int(6, 8), cell = (r, c) => r * n + c + 1, r = d.pick([2, 2, 3]), k = d.int(1, n - 2), seat = cell(r, k), marks = {};
        range(2 * n).forEach((i) => { marks[(2 + Math.floor(i / n)) + ',' + (i % n)] = 'empty'; });
        const found = range(4 * n).map((i) => [Math.floor(i / n), i % n]).find(([i, j]) => cell(i, j) === seat);
        return M('공연장의 자리에 번호를 규칙에 따라 붙였다. ㉠, ㉡에 알맞은 수는?', [{ label: '㉠', answer: r + 1 }, { label: '㉡', answer: k + 1 }], {
          figure: stack([board(cell, 4, n, marks, { label: '자리 번호' }), lines([`${seat}번 자리는 위에서 ${box('㉠')}번째 줄, 왼쪽에서 ${box('㉡')}번째 자리이다.`])]),
          explain: `아래로 한 줄 내려갈 때마다 번호가 ${n}씩 커진다. 줄마다 첫 번호는 ${range(r + 1).map((i) => cell(i, 0)).join(', ')}이다. ${seat}번은 ${r + 1}번째 줄의 ${k + 1}번째 자리이다.`,
          facts: { parts: [[String(found[0] + 1), 0]], calc: [[r === 2 ? `${seat}-${cell(1, n - 1)}` : `${seat}-${cell(1, n - 1)}-(${cell(1, 0)}-${cell(0, 0)})`, 1]] }
        });
      }),
      H('h-way', '번호를 붙인 방향이 다른 배열', '심42·43 ①58', (d, turn) => {
        if (turn === 0) {
          // 승강기 단추: 수가 아래에서 위로 커진다. 아래 두 줄만 수가 보인다.
          const n = d.int(2, 4), nRows = 4, cell = (r, c) => (nRows - 1 - r) * n + c + 1, k = d.int(0, n - 1), marks = {};
          range(2 * n).forEach((i) => { marks[Math.floor(i / n) + ',' + (i % n)] = 'empty'; });
          marks['1,' + k] = '㉠';
          return N('승강기 단추의 수가 규칙에 따라 놓여 있다. 수가 지워진 단추 ㉠의 수는?', cell(1, k), {
            figure: board(cell, nRows, n, marks, { round: true, cw: 36, label: '승강기 단추' }),
            explain: `단추의 수는 위로 한 칸 올라갈 때마다 ${n}씩 커진다. ㉠은 ${cell(2, k)}의 바로 위이므로 ${cell(2, k)} + ${n} = ${cell(1, k)}이다. 아래로 갈수록 커진다고 보면 틀린다.`,
            facts: { calc: [[`${cell(2, k)}+(${cell(2, 0)}-${cell(3, 0)})`, 0]] }
          });
        }
        // 사물함: 번호가 오른쪽에서 왼쪽으로 커진다. 둘째 줄은 오른쪽 끝 번호만 보인다.
        const n = d.int(5, 6), cell = (r, c) => r * n + (n - c), k = d.int(1, n - 3), marks = {};
        range(n - 1).forEach((c) => { marks['1,' + c] = c === k ? '㉠' : 'empty'; });
        return N('사물함에 번호를 규칙에 따라 붙였다. 번호가 지워진 사물함 ㉠의 번호는?', cell(1, k), {
          unit: '번', figure: board(cell, 2, n, marks, { label: '사물함의 번호' }),
          explain: `번호는 오른쪽에서 왼쪽으로 갈수록 1씩 커지고, 둘째 줄은 오른쪽 끝의 ${cell(1, n - 1)}번부터 시작한다. ㉠은 ${cell(1, n - 1)}번에서 왼쪽으로 ${n - 1 - k}칸 간 자리이므로 ${cell(1, n - 1)} + ${n - 1 - k} = ${cell(1, k)}(번)이다.`,
          facts: { calc: [[`${cell(1, n - 1)}+${cell(0, k + 1)}`, 0]] }
        });
      }, { count: 2 }),
      H('h-clock-cycle', '반복되는 시계', '심45', (d) => {
        // 3시간씩 차이 나는 세 시각이 반복된다. 빈칸은 반복되는 부분이 다시 시작하는 자리이고, 빈칸 뒤의 시계가 「3시간씩 늦어진다」는 생각과 맞지 않는다.
        const from = d.pick([3, 6, 9, 12]), unit = range(3).map((i) => ((from + 3 * i - 1) % 12) + 1), shown = [unit[0], unit[1], unit[2], 0, unit[1]];
        const fits = [3, 6, 9, 12].filter((h) => period(shown.map((v) => v || h)) === 3);
        return N('시계가 규칙에 따라 놓여 있다. 빈칸에 알맞은 시계는 몇 시를 나타내는가?', unit[0], {
          unit: '시', figure: row(shown.map((h) => (h ? clock(h * 60) : BL())), { w: 56, label: '시계' }),
          explain: `빈칸 뒤에 ${unit[1]}시가 다시 나오므로 ${unit[0]}시, ${unit[1]}시, ${unit[2]}시가 반복된다. 빈칸에 알맞은 시각은 ${unit[0]}시이다. 3시간씩 지난다고 보면 빈칸 뒤의 시계와 맞지 않는다.`,
          facts: { parts: [[String(fits.length === 1 ? fits[0] : 0), 0]] }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
