// 1학년 2학기 3단원 모양과 시각 — 실력 문항.
// 단원 틀과 그림 도구는 1-2-3a.js, 꾸민 그림과 시계는 1-2-3b.js.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 모양을 생김새로 외운다: 반듯하게 놓인 것만 □ 모양, 위가 뾰족한 것만 △ 모양이라고 여긴다.
//    → 기울어지거나 길쭉하거나 거꾸로 놓여도 뾰족한 부분이 4군데이면 □ 모양, 3군데이면 △ 모양이다.
//  - 한 물건에서는 한 모양만 나온다고 여긴다(둥근 통은 언제나 ○ 모양). → 본뜬 모양은 종이에 대는 쪽에 따라 달라진다.
//  - 크기가 다르거나 다른 조각에 일부가 가려진 조각을 빠뜨리고 센다.
//  - 「몇 시」는 긴바늘이 12, 「몇 시 30분」은 긴바늘이 6이라는 것과, 시는 짧은바늘로 읽는다는 것을 섞는다
//    (6시의 긴바늘이 6이라고 여기거나, 12시 30분과 6시를 바꾸어 읽는다).
//  - 「몇 시 30분」의 짧은바늘을 숫자 위에 똑바로 그리거나, 다가가는 수를 시로 읽는다(2와 3 사이를 3시 30분으로).
//
// 싣는 기준
//  - ① 그림·상황의 장치 때문에 배운 뜻을 정확히 대야 풀리는 것, ② 두 번 넘게 생각해야 풀리는 것만 싣는다.
//    기본에서 하는 일을 고르기로 바꾼 것은 싣지 않는다. 그림에서 고르는 문항은 겉으로 보아서는 가릴 수 없게 그린다.
//  - 풀이에는 볼 것(뾰족한 부분이 몇 군데인가, 긴바늘이 12인가 6인가)만 적는다.
//  - 크고 작은 모양 세기, 선을 그어 나누기, 조건 여럿을 맞추는 것, 몇 분 뒤의 시각·긴바늘이 도는 바퀴 수(2-2-4)는 싣지 않는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, LABELS, tagged, N, C } = B.kit;
  const G = B.kit.geo;
  const K = B.kit.g123;
  const { SHAPE, TIME, TAGS, KINDS, say, POINTS, FEATURE, setOptions, st, polygon, word, frame, paint, tally, told, FILLS, FLAT, FLAT_HARD, PLAIN, Bx, Tr, Ci, clock, face, at, value } = K;
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const tagsOf = (flags) => TAGS.filter((_, i) => flags[i]).join(', ');

  // ── 겹쳐 놓인 조각이 있는 그림 ────────────────────────────────
  // 가려진 조각도 보이는 쪽에 뾰족한 부분 둘(또는 둥근 테두리)이 남아 어떤 모양인지 알 수 있다.
  function bear(d) {
    const P = [Ci(62, 44, 18, '#d6a676', '귀'), Ci(138, 44, 18, '#d6a676', '귀'), Bx(68, 150, 64, 44, '#93c5fd', '몸'), Ci(100, 100, 54, '#e7c9a0', '얼굴'), Ci(82, 88, 6, '#334155', '눈'), Ci(118, 88, 6, '#334155', '눈'), Tr([91, 104], [109, 104], [100, 116], '#9a3412', '코')];
    if (d.bool()) P.push(Tr([80, 50], [120, 50], [100, 14], '#fca5a5', '모자'));
    P.push(Tr([100, 166], [80, 155], [80, 177], '#fca5a5', '나비 리본'), Tr([100, 166], [120, 155], [120, 177], '#fca5a5', '나비 리본'));
    if (d.bool()) P.push(Ci(100, 185, 4.5, '#fde68a', '단추'));
    return { name: '곰', W: 200, H: 200, pieces: P };
  }
  function woods(d) {
    const P = [Bx(30, 132, 14, 38, '#d6a676', '나무 기둥'), Tr([8, 136], [66, 136], [37, 92], '#86efac', '나뭇잎'), Tr([14, 108], [60, 108], [37, 66], '#bbf7d0', '나뭇잎'), Tr([20, 80], [54, 80], [37, 42], '#dcfce7', '나뭇잎')];
    P.push(Bx(100, 100, 112, 70, '#fde68a', '벽'), Tr([88, 100], [224, 100], [156, 44], '#fca5a5', '지붕'));
    if (d.bool()) P.push(Tr([146, 90], [166, 90], [156, 72], '#fff', '지붕 창'));
    if (d.bool()) P.push(Bx(188, 54, 16, 30, '#cbd5e1', '굴뚝'));
    P.push(Bx(146, 130, 24, 40, '#d6a676', '문'));
    [112, 182].slice(0, d.int(1, 2)).forEach((x) => P.push(Bx(x, 114, 20, 20, '#bfdbfe', '창문')));
    if (d.bool()) P.push(Ci(228, 22, 14, '#fdba74', '해'));
    return { name: '나무와 집', W: 250, H: 176, pieces: P };
  }
  function fish(d) {
    const P = [Tr([150, 78], [206, 46], [206, 110], '#fdba74', '꼬리'), Ci(108, 78, 46, '#fde68a', '몸'), Tr([92, 36], [128, 36], [106, 10], '#fdba74', '지느러미'), Ci(82, 66, 7, '#fff', '눈')];
    for (let i = 0, k = d.int(0, 2); i < k; i += 1) P.push(Tr([100 + i * 24, 76], [118 + i * 24, 76], [109 + i * 24, 92], '#fbbf24', '비늘'));
    [[40, 40, 7], [26, 22, 9], [50, 14, 5]].slice(0, d.int(1, 3)).forEach(([x, y, r]) => P.push(Ci(x, y, r, '#e0f2fe', '물방울')));
    return { name: '물고기', W: 240, H: 150, pieces: P };
  }
  const partsTold = (scene, k) => { const names = scene.pieces.filter((piece) => piece.k === k).map((piece) => piece.part); return [...new Set(names)].map((part) => `${part} ${names.filter((x) => x === part).length}개`).join(', '); };

  B.addGroup('1-2-3', {
    id: 'hard', title: '실력 문제', standard: SHAPE,
    types: [
      H('h-turned', '놓인 방향과 길이가 다른 모양 세기', '심12 ①16', (d) => {
        // ① 길쭉하거나 기울어지거나 거꾸로 놓인 □·△ 모양을 섞는다. 생김새가 아니라 뾰족한 부분의 수로 가려야 한다.
        const target = d.pick(['sq', 'tri']), other = target === 'sq' ? 'tri' : 'sq', n = d.int(3, 4), c = d.int(1, 2), m = 8 - n - c;
        // 모양마다 길쭉하거나 기울어진 것을 둘은 넣는다.
        const some = (k, count) => { const hard = d.shuffle(FLAT_HARD[k]); return hard.slice(0, 2).concat(d.shuffle(hard.slice(2).concat(FLAT[k]))).slice(0, count).map((makeOne) => makeOne()); };
        const list = d.shuffle(some(target, n).concat(some(other, m), d.shuffle(FLAT_HARD.cir).slice(0, c).map((makeOne) => makeOne()))), flags = list.map((piece) => piece.k === target), fills = d.shuffle(FILLS);
        return N(`${say(target)}은 모두 몇 개인가?`, n, {
          unit: '개', figure: K.shapesFig(list, list.map((_, i) => fills[i % fills.length]), { per: 4, tags: TAGS }),
          explain: `모양마다 뾰족한 부분이 ${POINTS[target]}군데인지만 본다. ${say(target)}은 ${tagsOf(flags)}로 모두 ${n}개이다.`, facts: { tallyOf: { list: list.map((piece) => piece.k), target } }
        });
      }),
      H('h-faces', '한 물건의 여러 쪽을 본뜬 모양', '심10 ①12', (d) => {
        // ① 세모 기둥 모양 상자: 마주 보는 두 쪽은 △ 모양, 나머지 세 쪽은 □ 모양이다. 모든 쪽을 따져야 한다.
        //   「△」: 앞에 보이는 세모 쪽만 본 아이 / 「□」: 바닥에 닿은 쪽이나 옆쪽만 본 아이 / 「□, △, ○」: 쪽마다 따지지 않고 세 모양을 다 고른 아이
        const sets = d.shuffle([['△'], ['□'], ['□', '△'], ['□', '△', '○']]), flip = d.bool();
        return C('상자의 여러 쪽을 종이에 대고 본뜨려고 한다. 나올 수 있는 모양을 모두 고른 것은?', sets.map((set) => set.join(', ')), sets.findIndex((set) => set.length === 2), {
          figure: frame(150, 104, '<g transform="translate(' + (flip ? 82 : 70) + ' 56) scale(' + (flip ? -1.5 : 1.5) + ' 1.5)">' + polygon([[-7, -18], [9, -30], [31, 10], [15, 22]], '#fef3c7') + polygon([[-29, 22], [15, 22], [-7, -18]], '#fde68a') + '</g>', '세모 기둥 모양 상자'),
          explain: '마주 보는 두 쪽은 뾰족한 부분이 3군데인 △ 모양이고, 나머지 세 쪽은 뾰족한 부분이 4군데인 □ 모양이다. 둥근 부분이 없으므로 ○ 모양은 나오지 않는다.',
          facts: { sets: { labels: ['□', '△', '○'], flags: [true, true, false], options: sets } }
        });
      }),
      H('h-can', '둥근 통을 세워서 본뜰 때와 눕혀서 본뜰 때', '①12 심9', (d) => {
        // ① 둥근 통은 언제나 ○ 모양이 나온다고 여기기 쉽다. 눕혀 놓고 둘레를 따라 그리면 □ 모양이 나온다.
        //   「○, ○」: 통이면 ○ 모양이라고 외운 아이 / 「□, □」: 옆에서 본 모양만 떠올린 아이 / 차례를 바꾼 것: 가와 나를 바꾸어 본 아이
        const lyingFirst = d.bool(), ellipse = (cx, cy, rx, ry, fill) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${st(fill)}/>`;
        const paper = (x) => polygon([[x + 4, 108], [x + 112, 108], [x + 126, 78], [x + 18, 78]], '#fff', 1.2, '#94a3b8');
        const standing = (x) => paper(x) + `<path d="M${x + 45} 36V94A20 7 0 0 0 ${x + 85} 94V36" ${st(PLAIN)}/>` + ellipse(x + 65, 36, 20, 7, '#fecaca');
        const lying = (x) => paper(x) + `<path d="M${x + 38} 68H${x + 98}A7 17 0 0 1 ${x + 98} 102H${x + 38}" ${st(PLAIN)}/>` + ellipse(x + 38, 85, 7, 17, '#fecaca');
        const drawn = lyingFirst ? [lying, standing] : [standing, lying], right = lyingFirst ? '□, ○' : '○, □', options = d.shuffle(['○, ○', '○, □', '□, ○', '□, □']);
        return C('둥근 통을 종이 위에 가, 나처럼 놓고 둘레를 따라 본떴다. 가와 나에서 본뜬 모양을 차례로 쓴 것은?', options, options.indexOf(right), {
          figure: frame(270, 116, word(12, 14, '가') + drawn[0](6) + word(146, 14, '나') + drawn[1](140), `종이 위에 놓은 둥근 통: 가는 ${lyingFirst ? '눕혀' : '세워'} 놓았고 나는 ${lyingFirst ? '세워' : '눕혀'} 놓았다`),
          explain: '세워 놓으면 종이에 닿는 쪽의 둘레가 둥글어서 ○ 모양이 나온다. 눕혀 놓고 둘레를 따라 그리면 곧은 선만 있고 뾰족한 부분이 4군데인 □ 모양이 나온다.',
          facts: { truth: options.map((option) => option === right), want: true }
        });
      }),
      H('h-hidden', '한쪽이 가려진 모양을 미루어 세기', '심14 ①17', (d) => {
        // ② 가려진 쪽을 미루어 모양을 알아낸 다음 센다.
        const target = d.pick(['sq', 'tri']), [p, q] = d.shuffle(KINDS.filter((k) => k !== target)), n = d.int(2, 3);
        const kinds = d.shuffle([].concat(Array(n).fill(target), Array(2).fill(p), Array(4 - n).fill(q))), turns = kinds.map(() => d.pick([0, 90, 180, 270])), fills = d.shuffle(FILLS), flags = kinds.map((k) => k === target);
        return N(`한쪽이 종이에 가려진 모양들이다. ${say(target)}은 모두 몇 개인가?`, n, {
          unit: '개', figure: K.cells(kinds, (k, i) => '<g transform="scale(0.82)">' + K.hiddenShape(k, turns[i], fills[i]) + '</g>', '한쪽이 종이에 가려진 모양 6개: ' + TAGS.slice(0, 6).join(', '), { per: 3, tags: TAGS, names: false }),
          explain: `보이는 쪽에 뾰족한 부분이 2군데 있고 두 곧은 선이 ${target === 'tri' ? '종이 밑으로 갈수록 가까워지면 △ 모양' : '나란히 종이 밑으로 들어가면 □ 모양'}이다. ${say(target)}은 ${tagsOf(flags)}로 모두 ${n}개이다.`,
          facts: { tallyOf: { list: kinds, target } }
        });
      }),
      H('h-scene', '겹쳐 놓인 조각까지 특징으로 세기', '심24 ①20', (d) => {
        // ① 큰 조각 안의 작은 조각, 다른 조각에 일부가 가려진 조각, 옆으로 눕거나 거꾸로 놓인 조각까지 세어야 한다. 모양 이름 대신 특징으로 묻는다.
        const scene = d.until(() => d.pick([bear, woods, fish])(d), (s) => KINDS.some((k) => tally(s.pieces)[k] >= 4)), n = tally(scene.pieces), k = d.pick(KINDS.filter((x) => n[x] >= 4));
        return N(`그림에서 ${FEATURE[k]} 모양은 모두 몇 개인가?`, n[k], {
          unit: '개', figure: frame(scene.W, scene.H, scene.pieces.map((piece) => paint(piece)).join(''), `조각을 겹쳐 놓아 꾸민 ${scene.name}: ${told(n)}`),
          explain: `${FEATURE[k]} 모양은 ${say(k)}이다. 크기가 다르거나 일부가 가려진 것까지 세면 ${partsTold(scene, k)}로 모두 ${n[k]}개이다.`, facts: { calc: [[String(n[k]), 0]], tallyOf: { list: scene.pieces.map((piece) => piece.k), target: k } }
        });
      }),
      H('h-most-least', '가장 많이 쓴 모양과 가장 적게 쓴 모양의 차', '①26 심21', (d) => {
        // ② 세 모양을 세고, 가장 많은 것과 가장 적은 것을 고른 다음, 뺀다.
        const scene = K.sceneOf(d, (n) => KINDS.every((k) => n[k] >= 1) && new Set(KINDS.map((k) => n[k])).size === 3), n = tally(scene.pieces), counts = KINDS.map((k) => n[k]), top = Math.max(...counts), low = Math.min(...counts);
        return N(`${K.used(scene.name)} 가장 많이 쓴 모양은 가장 적게 쓴 모양보다 몇 개 더 많은가?`, top - low, {
          unit: '개', figure: K.sceneFig(scene), explain: `${told(n)}를 썼다. 가장 많이 쓴 모양은 ${top}개, 가장 적게 쓴 모양은 ${low}개이다. ${top} − ${low} = ${top - low}(개)`,
          facts: { calc: [[`${top}-${low}`, 0]], tableRank: { values: counts, a: 0, b: 2 } }
        });
      }),
      H('h-long-hand', '긴바늘이 가리키는 수로 시각 가리기', '심28', (d) => {
        // ① 6시와 12시 30분을 꼭 넣는다: 「6시」의 긴바늘은 12를, 「12시 30분」의 긴바늘은 6을 가리킨다.
        //   6시를 긴바늘이 6인 시각으로 고르면 시의 수를 긴바늘의 자리로 읽은 것이다.
        const target = d.pick([6, 12]), times = d.shuffle([[6, false], [12, true], [d.pick([1, 2, 3, 4, 5, 7, 8, 9, 10, 11]), false], [d.pick([1, 2, 3, 4, 5, 7, 8, 9, 10, 11]), true]]);
        const flags = times.map((t) => t[1] === (target === 6)), made = setOptions(d, LABELS.slice(0, 4), flags);
        return C(`시계의 긴바늘이 ${josa(target, '을/를')} 가리키는 시각을 모두 고른 것은?`, made.options, made.answer, {
          figure: tagged(times.map(at)), explain: '「몇 시」에는 긴바늘이 12를 가리키고, 「몇 시 30분」에는 긴바늘이 6을 가리킨다. 6시의 긴바늘은 12를, 12시 30분의 긴바늘은 6을 가리킨다.',
          facts: { sets: { labels: LABELS.slice(0, 4), flags, options: made.sets } }
        });
      }, { standard: TIME }),
      H('h-half-draw', '몇 시 30분을 바르게 나타낸 시계', '①46 ①45', (d) => {
        // ① 보기: 바른 시계 / 짧은바늘이 그 수로 다가가는 쪽에 있는 시계(한 시간 앞의 30분) / 짧은바늘이 숫자를 똑바로 가리키는 시계 / 두 바늘의 길이를 바꾸어 그린 시계
        const h = d.pick([2, 3, 4, 8, 9, 10]), list = d.shuffle([[h + 0.5, 6, true], [h - 0.5, 6], [h, 6], [6, h + 0.5]]);
        return C(`${h}시 30분을 시계에 바르게 나타낸 것은?`, TAGS.slice(0, 4), list.findIndex((row) => row[2]), {
          figure: G.tiles(list.map(([hp, mp], i) => [TAGS[i], clock(hp, mp)])), explain: `${h}시 30분에는 긴바늘이 6을 가리키고, 짧은바늘은 ${josa(h, '을/를')} 지나 ${josa(h, '과/와')} ${h + 1}의 가운데에 있다.`,
          facts: { truth: list.map((row) => Boolean(row[2])), want: true }
        });
      }, { standard: TIME }),
      H('h-clock-wrong', '바늘을 잘못 그린 시계 찾기', '①45 심34', (d) => {
        // ① 긴바늘이 12이면 짧은바늘은 숫자를 똑바로, 긴바늘이 6이면 짧은바늘은 두 숫자의 가운데. 넷 모두 비슷해 보여 두 바늘을 맞추어 보아야 한다.
        const hours = d.shuffle([1, 2, 3, 4, 7, 8, 9, 10]).slice(0, 4), onTwelve = d.bool(), halves = d.shuffle([true, true, false]);
        const list = d.shuffle([{ hp: hours[0] + (onTwelve ? 0.5 : 0), mp: onTwelve ? 12 : 6, bad: true }].concat(halves.map((half, i) => ({ hp: hours[i + 1] + (half ? 0.5 : 0), mp: half ? 6 : 12 })))), bad = list.findIndex((row) => row.bad);
        return C('시계 넷 가운데 하나는 바늘을 잘못 그렸다. 잘못 그린 시계는?', TAGS.slice(0, 4), bad, {
          figure: G.tiles(list.map((row, i) => [TAGS[i], clock(row.hp, row.mp)])),
          explain: `긴바늘이 12를 가리키면 짧은바늘은 숫자를 똑바로 가리키고, 긴바늘이 6을 가리키면 짧은바늘은 두 숫자의 가운데에 있다. ${TAGS[bad]}는 긴바늘이 ${onTwelve ? '12를 가리키는데 짧은바늘이 두 숫자의 가운데에 있다.' : '6을 가리키는데 짧은바늘이 숫자를 똑바로 가리킨다.'}`,
          facts: { truth: list.map((row) => Boolean(row.bad)), want: true }
        });
      }, { standard: TIME }),
      H('h-swap', '두 바늘을 바꾸어 읽기 쉬운 시각', '심26·28', (d) => {
        // ① 12시 30분과 6시는 두 바늘이 위아래로 놓여 비슷해 보인다. 어느 바늘이 긴바늘인지 보아야 한다.
        //   6시(12시 30분): 두 바늘을 바꾸어 읽은 아이 / 11시 30분: 짧은바늘이 다가가는 수를 읽은 아이 / 6시 30분·12시: 한 바늘만 본 아이
        const want = d.pick([[12, true], [6, false]]), list = d.shuffle(want[1] ? [[12, true], [6, false], [11, true], [6, true]] : [[6, false], [12, true], [6, true], [12, false]]);
        return C(`시계 넷 가운데 ${at(want)}인 것은?`, TAGS.slice(0, 4), list.findIndex((t) => value(t) === value(want)), {
          figure: G.tiles(list.map((t, i) => [TAGS[i], face(t)])),
          explain: want[1] ? '12시 30분에는 긴바늘이 6을 가리키고, 짧은바늘이 12와 1 사이에 있다. 짧은바늘이 6을, 긴바늘이 12를 가리키는 시계는 6시이다.' : '6시에는 짧은바늘이 6을, 긴바늘이 12를 가리킨다. 긴바늘이 6을 가리키고 짧은바늘이 12와 1 사이에 있는 시계는 12시 30분이다.',
          facts: { kindPick: { kinds: list.map(value), target: value(want) } }
        });
      }, { standard: TIME })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
