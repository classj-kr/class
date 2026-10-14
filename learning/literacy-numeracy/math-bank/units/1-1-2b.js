// 1학년 1학기 2단원 여러 가지 모양 — 기본 문항(여러 가지 모양 만들기)과 실력 문항.
// 단원 틀과 그림 도구(B.kit.g112)는 1-1-2a.js 에 있다. 대조표는 수집본의 _분석/1-1-2/싣기_대조표.md.
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번(실력 문항의 ref 는 심화꼴 번호를 앞에, 기본꼴 번호를 「기본」 뒤에 적는다).
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 크기·색·놓인 방향이 다르면 다른 모양이라고 본다(눕힌 둥근기둥, 납작한 상자, 아주 작은 공). 거꾸로 겉보기(납작하다, 길쭉하다)가 닮으면 같은 모양으로 묶는다.
//  - 둥근 부분이 보이면 공 모양이라고 본다. 둥근기둥 모양의 평평한 부분을 놓친다.
//  - 굴러가는 모양은 쌓을 수 없다고 본다. 둥근기둥 모양이 눕히면 굴러가고 세우면 쌓을 수 있는 모양이라는 것을 놓쳐,
//    세워 둔 둥근기둥은 굴러가지 않는 것으로, 눕혀 둔 둥근기둥은 쌓을 수 없는 것으로 친다.
//  - 만든 모양에서 뒤에 놓여 일부만 보이는 조각을 빼고 센다. 조각을 모양별로 가르지 않고 덩치로만 견준다(조각이 많은 쪽이 그 모양도 많다고 본다).
//
// 싣는 기준: 실력에는 두 가지만 둔다. 1·2학년 단원이라 수는 적다.
//  ① 그림·상황에 함정이 있어 배운 뜻을 정확히 대야 풀리는 문제(위의 잘못된 생각이 드러나는 그림을 준다)
//  ② 두 번 넘게 생각해야 풀리는 문제(일부만 보고 모양을 안 뒤 가려 세기, 모양별 수를 하나씩 대어 보기)
//  기본에서 하는 일을 고르기로 바꾼 것은 싣지 않는다. 그림에서 고르는 문항은 겉보기가 닮은 다른 모양을 섞고, 조각의 수(덩치)로는 가릴 수 없게 맞춘다.
//  일부만 보이는 그림은 뾰족한 부분(상자 모양)이나 평평한 부분(둥근기둥 모양)이 보이는 것만 답이 되게 한다. 둥근 부분만 보이는 그림은 둥근기둥 모양일 수도 공 모양일 수도 있어 답으로 삼지 않는다.
//
// 뺀 것과 까닭(심화꼴)
//  - 평평한 부분의 수(심20), 위에서 본 모양(심16), 몇 개 더 썼는가(심30): 1-1-2a.js 머리의 「뺀 것」.
//  - 가진 모양으로 만들 때 더 필요한 수(심34의 「몇 개」): 모자란 모양만 묻는다. 수를 물으면 뺄셈이 된다.
//  - 굴러가는 모양·쌓을 수 있는 모양의 수 세기(심21의 「잘 쌓을 수 있는 모양은 몇 개」): 두 모양의 수를 더하게 된다(덧셈은 다음 단원) → 한 모양만 남는 설명으로 바꾼 것이 기본의 「설명에 알맞은 물건의 수」다.
//  - 조각 여섯 가운데 쓴 조각 찾기(심36) → 미룸, 두 작품에서 다른 곳 찾기·만들기(심37·38): 작도
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, N, M, C, NAMES } = B.kit;
  const G = B.kit.geo;
  const { STD, KINDS, KIND, MARKS, TAGS, conditions, ROLLS, STACKS, SAY, WHY, setOptions, listed, PALETTE, kindOf, tall, span, fit, icon, nm, kindOptions, tally, countOf, THINGS, thing, take, things, SEEN, peek, loose } = B.kit.g112;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});

  // ── 그림: 만든 모양 ──────────────────────────────────────────
  // 세 모양을 쌓아 만든 모양. 받침(상자 모양, 세운 둥근기둥 모양)을 기둥 여럿으로 쌓고, 공 모양은 기둥 맨 위나 바닥에만 놓는다(공 모양 위에는 쌓지 않는다).
  // 위에 놓는 조각은 아래 조각보다 넓지 않다. 기둥 사이를 띄워 조각끼리 가리지 않는다. counts: { box, cyl, ball }, o: { lie(둥근기둥 하나를 눕혀 바닥에 놓는다) }
  const BOX_W = [40, 30, 22, 16], BOX_H = [24, 20, 16, 14], BOX_D = [24, 20, 16, 12], CYL_R = [12, 10, 8, 6], CYL_H = [28, 22, 18, 14];
  function build(d, counts, o) {
    const opt = o || {}, parts = [], tint = () => d.pick(PALETTE), gap = 8;
    const sup = d.shuffle(Array(counts.box || 0).fill('box').concat(Array(counts.cyl || 0).fill('cyl')));
    let balls = counts.ball || 0, x = 0, used = 0;
    if (opt.lie && (counts.cyl || 0) >= 2 && sup.length >= 3) { sup.splice(sup.indexOf('cyl'), 1); const spec = ['lie', 10, 30], s = span(spec); parts.push({ spec, bx: x + s.l, by: 0, tint: tint() }); x += s.l + s.r + gap; }
    const n = sup.length, k = n <= 2 ? n : n <= 4 ? 2 : n <= 6 ? 3 : 4, heights = d.shuffle(Array.from({ length: k }, (_, i) => Math.floor(n / k) + (i < n % k ? 1 : 0)));
    heights.forEach((h) => {
      const pieces = []; let below = null;
      sup.slice(used, used + h).forEach((kind, level) => {
        const L = Math.min(level, 3), wide = below ? (below[0] === 'box' ? below[1] - 6 : below[1] * 2 - 2) : 99, deep = below ? (below[0] === 'box' ? below[3] : below[1] * 2) : 99;
        const spec = kind === 'box' ? ['box', Math.min(BOX_W[L] + d.int(0, 2) * 2, wide), BOX_H[L] + d.int(0, 3) * 2, Math.min(BOX_D[L], deep)] : ['cyl', Math.min(CYL_R[L], wide / 2, deep / 2), CYL_H[L] + d.int(0, 3) * 2];
        pieces.push(spec); below = spec;
      });
      used += h;
      if (balls > 0) { pieces.push(['ball', Math.max(6, Math.min(9, below[0] === 'box' ? below[1] / 2 : below[1]))]); balls -= 1; }
      const half = Math.max.apply(null, pieces.map((spec) => span(spec).l)); let y = 0;
      pieces.forEach((spec) => { parts.push({ spec, bx: x + half, by: y, tint: tint() }); y -= tall(spec); });
      x += half * 2 + gap;
    });
    while (balls > 0) { const r = d.pick([8, 9, 10]); parts.push({ spec: ['ball', r], bx: x + r, by: 0, tint: tint() }); x += r * 2 + gap; balls -= 1; }
    return parts;
  }
  const used = (parts) => countOf(parts.map((p) => kindOf(p.spec)));
  // 만든 모양 그림. o: { scale, head(그림 설명의 머리말), note(그림 설명에 덧붙이는 말) }
  const work = (parts, o) => fit(parts, ((o && o.head) || '만든 모양') + ': ' + tally(used(parts)) + ((o && o.note) || ''), { scale: o && o.scale });
  // 그림 칸에 나란히 놓는 작은 모양
  const small = (d, counts, head) => work(build(d, counts), { scale: 0.78, head });
  const total = (counts) => KINDS.reduce((s, k) => s + (counts[k] || 0), 0);
  const sameCounts = (a, b) => KINDS.every((k) => (a[k] || 0) === (b[k] || 0));
  // 뒤에 놓여 일부만 보이는 조각이 있는 모양. 앞줄에 낮은 받침 넷을 놓고 그 가운데 둘의 뒤에 키 큰 조각을 하나씩 세운다.
  // 뒤의 조각은 위쪽(상자 모양의 뾰족한 부분, 둥근기둥 모양의 평평한 부분)이 앞의 조각 위로 보인다. 뒤의 조각 가운데 하나는 꼭 묻는 모양(kind)이다.
  function hidden(d, kind) {
    const other = kind === 'box' ? 'cyl' : 'box', tint = () => d.pick(PALETTE), gap = 9, backs = [], fronts = [];
    const front = d.until(() => [0, 1, 2, 3].map(() => d.pick(['box', 'cyl'])), (list) => new Set(list).size === 2);
    const at = d.shuffle([0, 1, 2, 3]).slice(0, 2), backKinds = d.shuffle([kind, d.pick([kind, other])]);
    let x = 0, balls = d.int(1, 2);
    front.forEach((k, i) => {
      const spec = k === 'box' ? ['box', 40, 24, 24] : ['cyl', 12, 26], s = span(spec), bx = x + s.l, j = at.indexOf(i); let right = s.r;
      fronts.push({ spec, bx, by: 0, tint: tint() });
      if (j >= 0) { const back = backKinds[j] === 'box' ? ['box', 26, 52, 22] : ['cyl', 11, 56]; backs.push({ spec: back, bx: bx + 13, by: -9.4, tint: tint() }); right = Math.max(right, 13 + span(back).r); }
      else if (balls > 0) { fronts.push({ spec: ['ball', 9], bx, by: -tall(spec), tint: tint() }); balls -= 1; }
      x = bx + right + gap;
    });
    const parts = backs.concat(fronts);
    return { parts, counts: used(parts), behind: used(backs), svg: work(parts, { note: '. 이 가운데 뒤에 놓여 일부만 보이는 것: ' + tally(used(backs)) }) };
  }
  // 겉보기가 닮은 다른 모양을 섞은 물건들. 묻는 모양(kind)은 눕힌 것·납작한 것·가늘거나 작은 것을 섞고, 다른 모양은 그것과 닮은 것(길쭉한 상자와 눕힌 둥근기둥, 납작한 상자와 납작한 둥근기둥)을 넣는다.
  const TRAP = {
    cyl: { own: [['통나무', '김밥', '건전지'], ['케이크', '작은북'], ['양초', '분필', '딱풀'], ['통조림', '음료수 캔']], like: [['필통'], ['휴지 상자', '벽돌', '동화책'], ['지우개', '주사위']] },
    box: { own: [['필통'], ['동화책', '휴지 상자'], ['지우개', '주사위'], ['냉장고', '서랍장']], like: [['김밥', '통나무', '건전지'], ['케이크', '작은북'], ['양초', '딱풀']] }
  };
  function trapped(d, kind, size) {
    const a = d.int(size - 5, size - 4), own = TRAP[kind].own.slice(0, 2).concat(d.shuffle(TRAP[kind].own.slice(2))).slice(0, a).map((g) => thing(d.pick(g)));
    const like = d.shuffle(TRAP[kind].like).slice(0, d.int(2, 3)).map((g) => thing(d.pick(g)));
    const balls = d.shuffle(['구슬', '탁구공', '테니스공', '수박', '농구공']).slice(0, size - own.length - like.length).map(thing);
    return d.shuffle(own.concat(like, balls));
  }
  const LOOKS = { box: '뾰족한 부분과 평평한 부분이 있는지만 본다.', cyl: '평평한 부분과 둥근 부분이 모두 있는지만 본다.' };

  // ── 여러 가지 모양 만들기 ────────────────────────────────────
  B.addTypes('1-1-2', 'make', [
    T('make-used', '쓴 모양 모두 고르기', '①30', (d) => {
      const kinds = d.shuffle(KINDS).slice(0, d.pick([2, 2, 2, 1])), counts = {}; kinds.forEach((k) => { counts[k] = d.int(2, 4); });
      const flags = KINDS.map((k) => Boolean(counts[k])), made = setOptions(d, KINDS, flags, nm);
      return C('쓴 모양을 모두 고르면?', made.options, made.answer, { figure: work(build(d, counts, { lie: d.bool() })), explain: tally(counts) + '를 썼다.', facts: { sets: { labels: KINDS, flags, options: made.sets } } });
    }),
    T('make-unused', '쓰지 않은 모양', '①31 심25', (d) => {
      const out = d.pick(KINDS), counts = {}; KINDS.filter((k) => k !== out).forEach((k) => { counts[k] = d.int(2, 4); });
      return C('쓰지 않은 모양은?', kindOptions(), KINDS.indexOf(out), {
        figure: work(build(d, counts, { lie: d.bool() })), explain: tally(counts) + '를 썼다.', facts: { kindPick: { kinds: KINDS.map((k) => (counts[k] ? 'used' : 'unused')), target: 'unused' } }
      });
    }),
    T('make-count', '한 모양을 몇 개 썼는지 세기', '①32 심22', (d) => {
      const kind = d.pick(KINDS), counts = { box: d.int(1, 2), cyl: d.int(1, 2), ball: d.int(1, 2) }; counts[kind] = d.int(3, 5);
      const parts = build(d, counts, { lie: d.bool() });
      return N(`${nm(kind)}은 몇 개 썼는가?`, counts[kind], { unit: '개', figure: work(parts), explain: tally(counts) + '를 썼다.', facts: { tallyOf: { list: parts.map((p) => kindOf(p.spec)), target: kind } } });
    }),
    T('make-count3', '세 모양을 각각 몇 개 썼는지 세기', '①33 심23', (d) => {
      const c = d.shuffle(d.pick([[2, 2, 4], [1, 4, 2], [3, 2, 2], [4, 2, 1], [3, 4, 2], [2, 3, 1], [3, 3, 2]])), counts = { box: c[0], cyl: c[1], ball: c[2] }, parts = build(d, counts, { lie: d.bool() });
      return M('쓴 모양의 수를 세어 쓰시오.', KINDS.map((k) => ({ label: KIND[k], answer: counts[k], unit: '개' })), {
        figure: work(parts), explain: tally(counts) + '를 썼다.', facts: { calc: KINDS.map((k, i) => [String(counts[k]), i]), tallyOf: { list: parts.map((p) => kindOf(p.spec)), target: 'box' } }
      });
    }),
    T('make-most', '가장 많이 쓴 모양, 가장 적게 쓴 모양', '①34 심24', (d, n) => {
      const c = d.shuffle(d.pick([[4, 2, 1], [3, 2, 1], [4, 3, 1], [5, 2, 1], [4, 3, 2]])), counts = { box: c[0], cyl: c[1], ball: c[2] }, best = n === 0 ? Math.max(...c) : Math.min(...c);
      return C(n === 0 ? '가장 많이 쓴 모양은?' : '가장 적게 쓴 모양은?', kindOptions(), c.indexOf(best), {
        figure: work(build(d, counts, { lie: d.bool() })), explain: tally(counts) + '를 썼다.', facts: { choose: { exprs: c.map(String), rule: n === 0 ? 'max' : 'min' } }
      });
    }, { count: 2 }),
    T('make-differ', '쓴 수가 나머지와 다른 모양', '①35', (d) => {
      const c = d.shuffle(d.pick([[2, 2, 4], [3, 3, 1], [2, 2, 3], [1, 1, 3], [3, 3, 2], [2, 2, 5], [4, 4, 2]])), counts = { box: c[0], cyl: c[1], ball: c[2] }, lone = c.findIndex((v) => c.filter((w) => w === v).length === 1);
      return C('쓴 수가 나머지와 다른 모양은?', kindOptions(), lone, { figure: work(build(d, counts, { lie: d.bool() })), explain: tally(counts) + '를 썼다.', facts: { tileOdd: c } });
    }),
    T('make-more', '두 모양 가운데 그 모양을 더 많이 쓴 것', '①37 심28', (d) => {
      // 조각의 수는 두 모양이 같다. 묻는 모양만 골라 세어야 한다.
      const kind = d.pick(KINDS), rest = d.shuffle(KINDS.filter((k) => k !== kind)), m = kind === 'ball' ? 1 : d.int(1, 2), ks = d.shuffle([m, m + 1]);
      const sets = ks.map((v) => { const others = v === m ? 3 : 2, a = d.int(1, others - 1); return { [kind]: v, [rest[0]]: a, [rest[1]]: others - a }; });
      return C(`${nm(kind)}이 더 많은 것은?`, TAGS.slice(0, 2), ks.indexOf(m + 1), {
        figure: G.tiles(sets.map((s, i) => [TAGS[i], small(d, s)])), explain: `${KIND[kind]}을 가는 ${ks[0]}개, 나는 ${ks[1]}개 썼다.`, facts: { choose: { exprs: ks.map(String), rule: 'max' } }
      });
    }),
    T('make-top', '여러 모양 가운데 그 모양을 가장 많이 쓴 것', '①38 심29', (d) => {
      const kind = d.pick(KINDS), rest = KINDS.filter((k) => k !== kind), ks = d.shuffle(d.pick([[3, 2, 2, 1], [3, 2, 1, 1], [3, 1, 2, 2]]));
      // 그림 칸이 좁아 받침은 넷까지만 쓴다.
      const sets = ks.map((v) => d.until(() => { const others = 4 - v + d.int(0, 1), a = d.int(0, others); return { [kind]: v, [rest[0]]: a, [rest[1]]: others - a }; }, (s) => { const sup = (s.box || 0) + (s.cyl || 0); return sup >= 1 && sup <= 4 && (s.ball || 0) <= 3; }));
      return C(`${nm(kind)}이 가장 많은 것은?`, TAGS, ks.indexOf(3), {
        figure: G.tiles(sets.map((s, i) => [TAGS[i], small(d, s)])), explain: `${KIND[kind]}을 ${ks.map((v, i) => TAGS[i] + '는 ' + v + '개').join(', ')} 썼다.`, facts: { choose: { exprs: ks.map(String), rule: 'max' } }
      });
    }),
    T('make-exact', '그 모양을 정해진 수만큼 쓴 것', '①39', (d) => {
      // 두 모양의 수를 서로 바꾸어 놓았다(가는 2개·3개, 나는 3개·2개).
      const [x, y, z] = d.shuffle(KINDS), [n, m] = d.shuffle(d.pick([[2, 3], [1, 2], [1, 3]])), extra = d.int(0, 1);
      const sets = d.shuffle([{ [x]: n, [y]: m, [z]: extra }, { [x]: m, [y]: n, [z]: extra }]), at = sets.findIndex((s) => s[x] === n);
      return C(`${nm(x)}을 ${n}개 쓴 것은?`, TAGS.slice(0, 2), at, {
        figure: G.tiles(sets.map((s, i) => [TAGS[i], small(d, s)])), explain: `${KIND[x]}을 가는 ${sets[0][x]}개, 나는 ${sets[1][x]}개 썼다.`, facts: { choose: { exprs: sets.map((s) => String(s[x])), rule: 'equals', target: n } }
      });
    }),
    T('make-set', '주어진 모양을 모두 써서 만든 것', '①40 심33', (d) => {
      const c = d.shuffle(d.pick([[2, 3, 1], [3, 1, 2], [2, 2, 1], [1, 3, 2], [2, 1, 2]])), given = { box: c[0], cyl: c[1], ball: c[2] };
      // 다른 하나는 조각 하나만 다른 모양으로 바꾸었다(조각의 수는 같다).
      const from = d.pick(KINDS.filter((k) => given[k] >= 2)), to = d.pick(KINDS.filter((k) => k !== from)), other = Object.assign({}, given, { [from]: given[from] - 1, [to]: given[to] + 1 });
      const sets = d.shuffle([given, other]), at = sets.indexOf(given);
      return C('주어진 모양을 모두 써서 만든 것은?', TAGS.slice(0, 2), at, {
        figure: G.tiles([['주어진 모양', loose(given, { head: '주어진 모양' })]].concat(sets.map((s, i) => [TAGS[i], small(d, s)]))),
        explain: `주어진 모양은 ${tally(given)}이다. ${TAGS[1 - at]}는 ${tally(other)}를 썼다.`, facts: { truth: sets.map((s) => sameCounts(s, given)), want: true }
      });
    }),
    T('make-kinds', '세 모양을 모두 쓴 것, 한 가지 모양만 쓴 것', '①41·42 심32', (d, n) => {
      const order = d.shuffle(KINDS), pair = d.shuffle(KINDS).slice(0, 2);
      const sets = d.shuffle([{ [order[0]]: d.int(3, 4) }, { [pair[0]]: 2, [pair[1]]: d.int(1, 2) }, { box: d.int(1, 2), cyl: d.int(1, 2), ball: 1 }]), kinds = sets.map((s) => KINDS.filter((k) => s[k]).length), want = n === 0 ? 3 : 1;
      return C(n === 0 ? '세 모양을 모두 쓴 것은?' : '한 가지 모양만 쓴 것은?', TAGS.slice(0, 3), kinds.indexOf(want), {
        figure: G.tiles(sets.map((s, i) => [TAGS[i], small(d, s)])), explain: sets.map((s, i) => `${TAGS[i]}: ${KINDS.filter((k) => s[k]).map((k) => KIND[k]).join(', ')}`).join(' / '), facts: { truth: kinds.map((v) => v === want), want: true }
      });
    }, { count: 2 }),
    T('make-without', '그 모양을 쓰지 않은 것', '심26', (d) => {
      const kind = d.pick(KINDS), rest = d.shuffle(KINDS.filter((k) => k !== kind));
      const sets = d.shuffle([{ [rest[0]]: d.int(1, 2), [rest[1]]: d.int(1, 2) }, { [kind]: d.int(1, 2), [rest[0]]: d.int(1, 2), [rest[1]]: 1 }, { [kind]: d.int(1, 2), [rest[1]]: d.int(1, 2) }]), at = sets.findIndex((s) => !s[kind]);
      return C(`${nm(kind)}이 없는 것은?`, TAGS.slice(0, 3), at, {
        figure: G.tiles(sets.map((s, i) => [TAGS[i], small(d, s)])), explain: `${TAGS[at]}는 ${tally(sets[at])}로만 만들었다.`, facts: { truth: sets.map((s) => !s[kind]), want: true }
      });
    }),
    T('make-common', '두 모양에 모두 쓴 모양', '심27', (d) => {
      const [a, b, c] = d.shuffle(KINDS), sets = [{ [a]: d.int(1, 2), [c]: d.int(1, 2) }, { [b]: d.int(1, 2), [c]: d.int(1, 2) }];
      return C('가와 나에 모두 쓴 모양은?', kindOptions(), KINDS.indexOf(c), {
        figure: G.tiles(sets.map((s, i) => [TAGS[i], small(d, s)])), explain: sets.map((s, i) => `${TAGS[i]}: ${KINDS.filter((k) => s[k]).map((k) => KIND[k]).join(', ')}`).join(' / '),
        facts: { kindPick: { kinds: KINDS.map((k) => (sets[0][k] && sets[1][k] ? 'both' : 'one')), target: 'both' } }
      });
    })
  ]);

  // ── 실력 문제 ────────────────────────────────────────────────
  // 두 가지를 한 문장으로 말한 것: [굴러간다고 했는가, 쌓을 수 있다고 했는가]. 둘 다 맞아야 맞는 말이다.
  const claim = (kind, rolls, stacks) => ({
    box: `${stacks ? '잘 쌓을 수 있고' : '쌓을 수 없고'} ${rolls ? '잘 굴러간다.' : '잘 굴러가지 않는다.'}`,
    cyl: `${rolls ? '눕히면 잘 굴러가고' : '눕혀도 굴러가지 않고'} ${stacks ? '세우면 쌓을 수 있다.' : '세워도 쌓을 수 없다.'}`,
    ball: `${rolls ? '잘 굴러가고' : '잘 굴러가지 않고'} ${stacks ? '쌓을 수 있다.' : '쌓을 수 없다.'}`
  }[kind]);
  B.addGroup('1-1-2', {
    id: 'hard', title: '실력 문제', standard: STD, types: [
      // ── ① 그림·상황의 함정 ──
      // 함정: 눕힌 둥근기둥·납작한 둥근기둥·가는 둥근기둥을 빼고 세거나, 겉보기가 닮은 길쭉한 상자·납작한 상자를 함께 센다.
      H('hard-count', '크기와 놓인 방향이 다른 물건 세기', '5·6, 기본 ①11', (d) => {
        const kind = d.pick(['box', 'cyl']), list = trapped(d, kind, 8), own = list.filter((t) => t.kind === kind);
        return N(`${nm(kind)}은 모두 몇 개인가?`, own.length, {
          unit: '개', figure: things(list), explain: `${LOOKS[kind]} 크기나 놓인 방향은 달라도 된다. ${listed(own.map((t) => t.name), '이/가')} ${KIND[kind]}이다.`, facts: { count: list.map((t) => t.kind === kind) }
        });
      }),
      // 함정: 보기와 덩치·빛깔이 닮은 다른 모양(납작한 통과 납작한 상자, 길쭉한 상자와 눕힌 둥근기둥)을 고른다. 답은 보기와 크기·놓인 방향이 다르다.
      // 보기: 「공 모양」(굴러가는 것은 공뿐이라고 보는 아이), 「둥근기둥 모양」(공을 빠뜨린 아이), 「상자 모양, 둥근기둥 모양」(쌓을 수 있는 모양과 헷갈린 아이)
      H('hard-roll-all', '잘 굴러가는 모양을 모두 고르기', '14, 기본 ①19', (d) => {
        const sets = d.shuffle([['cyl', 'ball'], ['ball'], ['cyl'], ['box', 'cyl']]), flags = KINDS.map((k) => ROLLS[k]), right = KINDS.filter((k) => ROLLS[k]).join();
        return C('잘 굴러가는 모양을 모두 고르면?', sets.map((s) => s.map(nm).join(', ')), sets.findIndex((s) => s.join() === right), {
          explain: '둥근기둥 모양은 눕히면 잘 굴러가고, 공 모양은 어느 쪽으로도 잘 굴러간다. 상자 모양은 잘 굴러가지 않는다.', facts: { sets: { labels: KINDS, flags, options: sets } }
        });
      }),
      // 함정: 눕혀 놓은 둥근기둥 모양. 보기: 상자 모양만(둥근기둥은 굴러가니 못 쌓는다고 보는 아이), 눕힌 것만 뺀 것(놓인 대로만 보는 아이), 모두(공도 쌓을 수 있다고 보는 아이)
      H('hard-stack-all', '쌓을 수 있는 물건을 모두 고르기', '14, 기본 ①19', (d) => {
        const lying = thing(d.pick(['건전지', '통나무', '김밥'])), standing = d.pick(THINGS.filter((t) => t.spec[0] === 'cyl' && !t.odd)), boxes = take(d, 'box', 2, true), ball = take(d, 'ball', 1, true)[0];
        const list = d.shuffle(boxes.concat([lying, standing, ball])), labels = MARKS.slice(0, 5), flags = list.map((t) => STACKS[t.kind]), pickOf = (test) => labels.filter((_, i) => test(list[i]));
        const sets = d.shuffle([pickOf((t) => STACKS[t.kind]), pickOf((t) => t.kind === 'box'), pickOf((t) => t.kind === 'box' || t === standing), labels]), right = pickOf((t) => STACKS[t.kind]).join();
        return C('쌓을 수 있는 물건을 모두 고르면?', sets.map((s) => s.join(', ')), sets.findIndex((s) => s.join() === right), {
          figure: things(list, { tags: MARKS }), explain: `상자 모양은 잘 쌓을 수 있고, 둥근기둥 모양은 세우면 쌓을 수 있다. 눕혀 놓은 ${lying.name}도 세우면 쌓을 수 있다. 공 모양은 쌓을 수 없다.`, facts: { sets: { labels, flags, options: sets } }
        });
      }),
      // 함정: 둥근기둥 모양은 굴러가기도 하고 쌓을 수도 있다. 「굴러가면 못 쌓는다」고 보는 아이는 바르게 말한 둥근기둥 모양의 문장을 고른다.
      H('hard-each', '모양마다 두 가지를 말한 것 가운데 틀린 것', '18, 기본 ①23', (d) => {
        const names = d.shuffle(NAMES).slice(0, 3), order = d.shuffle(KINDS), bad = d.pick(['cyl', 'cyl', 'box', 'ball']), flip = d.bool();
        const says = order.map((k) => (k !== bad ? [ROLLS[k], STACKS[k]] : flip ? [!ROLLS[k], STACKS[k]] : [ROLLS[k], !STACKS[k]]));
        const truth = order.map((k, i) => says[i][0] === ROLLS[k] && says[i][1] === STACKS[k]);
        return C('잘못 말한 사람은?', names, truth.indexOf(false), {
          figure: B.kit.lines(order.map((k, i) => '<span class="mb-tag mb-tag-short" style="min-width:2.7em;font-weight:700">' + names[i] + '</span>' + nm(k) + '은 ' + claim(k, says[i][0], says[i][1]))),
          explain: `${KIND[bad]}은 ${claim(bad, ROLLS[bad], STACKS[bad])}`, facts: { truth, want: false }
        });
      }),
      // 함정: 답인 둥근기둥 모양은 눕혀 놓았다. 「뾰족한 부분이 없다」만 보면 공 모양이, 놓인 대로만 보면 상자 모양이 남는다.
      H('hard-both', '눕혀 놓은 물건과 두 설명', '15, 기본 ①20', (d) => {
        const keys = ['sharpNo', 'stackStand'], lying = thing(d.pick(['건전지', '통나무', '김밥'])), list = d.shuffle([lying, take(d, 'ball', 1, true)[0], take(d, 'box', 1, true)[0], d.pick(take(d, d.pick(['ball', 'box']), 3, true).slice(1))]);
        const truth = list.map((t) => keys.every((key) => SAY[key].ok(t.kind) === true));
        return C('두 설명에 모두 맞는 물건은?', MARKS.slice(0, 4), truth.indexOf(true), {
          figure: conditions(keys.map((key) => SAY[key].text)) + things(list, { tags: MARKS }),
          explain: `뾰족한 부분이 없는 모양은 둥근기둥 모양과 공 모양이다. 이 가운데 세우면 쌓을 수 있는 모양은 둥근기둥 모양이다. 눕혀 놓은 ${josa(lying.name, '이/가')} 둥근기둥 모양이다.`, facts: { truth, want: true }
        });
      }),
      // 함정: 뒤에 놓여 위쪽만 보이는 조각을 빼고 센다. 보이는 부분(뾰족한 부분, 평평한 부분)으로 모양을 가려야 한다.
      H('hard-make-hidden', '뒤에 놓여 일부만 보이는 모양까지 세기', '35, 기본 ①32', (d) => {
        const kind = d.pick(['box', 'cyl']), made = hidden(d, kind);
        return N(`${nm(kind)}을 몇 개 썼는가?`, made.counts[kind], {
          unit: '개', figure: made.svg, explain: `뒤에 놓여 일부만 보이는 모양도 센다. ${kind === 'box' ? '뾰족한 부분이 보이면 상자 모양' : '평평한 부분과 둥근 부분이 보이면 둥근기둥 모양'}이다. 뒤에 ${made.behind[kind]}개가 더 있다.`,
          facts: { tallyOf: { list: made.parts.map((p) => kindOf(p.spec)), target: kind } }
        });
      }),
      // ── ② 두 번 넘게 생각하기 ──
      H('hard-part-count', '일부만 보이는 모양과 같은 모양의 물건 세기', '10·11, 기본 ①14', (d) => {
        const kind = d.pick(['cyl', 'cyl', 'box']), list = trapped(d, kind, 7), own = list.filter((t) => t.kind === kind);
        return N('가려진 모양과 같은 것은 몇 개인가?', own.length, {
          unit: '개', figure: peek(kind, d.pick(['top', 'side'])) + things(list),
          explain: `${SEEN[kind]}. 가려진 모양은 ${KIND[kind]}이다. ${listed(own.map((t) => t.name), '이/가')} ${KIND[kind]}이다.`, facts: { count: list.map((t) => t.kind === kind) }
        });
      }),
      H('hard-part-work', '일부만 보이는 모양을 만든 모양에서 세기', '35', (d) => {
        const kind = d.pick(['box', 'cyl']), c = d.shuffle(d.pick([[3, 2], [4, 2], [3, 3], [2, 4]])), counts = { box: c[0], cyl: c[1], ball: d.int(1, 2) }, parts = build(d, counts, { lie: kind === 'cyl' });
        return N('가려진 모양을 몇 개 썼는가?', counts[kind], {
          unit: '개', figure: peek(kind, d.pick(['top', 'side'])) + work(parts), explain: `${SEEN[kind]}. 가려진 모양은 ${KIND[kind]}이다. 만든 모양에는 ${tally(counts)}를 썼다.`,
          facts: { tallyOf: { list: parts.map((p) => kindOf(p.spec)), target: kind } }
        });
      }),
      // 세 모양 모두 조각의 수가 같아 덩치로는 가릴 수 없다. 모양별 수를 하나씩 대어 보아야 한다.
      H('hard-make-spec', '모양별 수가 정해진 대로 만든 것', '31', (d) => {
        const c = d.shuffle(d.pick([[2, 3, 2], [3, 2, 2], [2, 2, 3], [3, 3, 2]])), want = { box: c[0], cyl: c[1], ball: c[2] };
        const moved = () => { const from = d.pick(KINDS), to = d.pick(KINDS.filter((k) => k !== from)); return Object.assign({}, want, { [from]: want[from] - 1, [to]: want[to] + 1 }); };
        const others = d.until(() => [moved(), moved()], ([p, q]) => !sameCounts(p, q)), sets = d.shuffle([want].concat(others)), at = sets.indexOf(want);
        return C('아래 수만큼 써서 만든 것은?', TAGS.slice(0, 3), at, {
          figure: conditions(KINDS.map((k) => `${nm(k)} ${want[k]}개`)) + G.tiles(sets.map((s, i) => [TAGS[i], small(d, s)])),
          explain: sets.map((s, i) => `${TAGS[i]}: ${KINDS.map((k) => s[k] + '개').join(', ')}`).join(' / ') + '(상자 모양, 둥근기둥 모양, 공 모양 차례)', facts: { truth: sets.map((s) => sameCounts(s, want)), want: true }
        });
      }),
      // 가진 모양과 만들 모양은 조각의 수가 같다. 한 모양은 1개 모자라고 다른 한 모양은 1개 남는다.
      H('hard-make-need', '가진 모양으로 만들 때 모자란 모양', '34', (d) => {
        const c = d.shuffle(d.pick([[3, 2, 2], [2, 3, 1], [3, 1, 2], [2, 2, 2], [3, 2, 1]])), need = { box: c[0], cyl: c[1], ball: c[2] }, short = d.pick(KINDS), spare = d.pick(KINDS.filter((k) => k !== short));
        const have = Object.assign({}, need, { [short]: need[short] - 1, [spare]: need[spare] + 1 });
        return C('만들 때 모자란 모양은?', kindOptions(), KINDS.indexOf(short), {
          figure: G.tiles([['가진 모양', loose(have, { head: '가진 모양' })], ['만들 모양', work(build(d, need), { scale: 0.85, head: '만들 모양' })]]),
          explain: `만들 모양에는 ${tally(need)}를 쓴다. 가진 모양은 ${tally(have)}이다. ${KIND[short]}이 1개 모자란다.`,
          facts: { kindPick: { kinds: KINDS.map((k) => ((have[k] || 0) < need[k] ? 'short' : 'enough')), target: 'short' } }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
