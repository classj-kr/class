// 6학년 1학기 6단원 직육면체의 부피와 겉넓이 — 기본 문항(1 m³와 단위 바꾸기, 직육면체와 정육면체의 겉넓이, 겉넓이로 모서리 구하기).
// 단원 틀과 그림 도구(B.kit.vol616)는 6-1-6a.js 에 있다. 실력 문항은 6-1-6c.js, 대조표는 수집본의 _분석/6-1-6/싣기_대조표.md.
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
//
// 싣는 기준(이 파일의 세 묶음)
//  - 단위는 cm³와 m³뿐이다(성취기준 6수03-18). 1 m³ = 1000000 cm³를 한 번 대는 것, 길이의 단위를 m로 바꾸어 m³로 구하는 것은 기본이다.
//    소수는 단위를 바꾸는 문항에서만 쓴다. 소수가 드는 값은 정수로 셈한 뒤 글로 바꾸고, 검사가 다시 셈하는 식의 값이 답과 꼭 같은 수만 고른다.
//  - 겉넓이는 구하는 방법 셋(여섯 면의 합, 합동인 세 쌍, 두 밑면과 옆면)을 식의 빈칸과 식 고르기로 따로 묻고, 값은 겨냥도·문장·전개도로 나누어 묻는다.
//  - 정육면체의 겉넓이에서 한 모서리(÷ 6 뒤에 같은 수 두 번 곱 찾기), 겉넓이에서 한 밑면의 넓이는 한 번 거꾸로 구하는 것이라 기본에 싣는다.
//    직육면체의 겉넓이와 두 모서리에서 나머지 모서리를 구하는 것은 그 안에서 네 걸음이라 실력에 실었다.
//
// 뺀 것과 까닭(이 파일의 세 묶음)
//  - 한 모서리만 단위가 다른 직육면체의 부피(①50 ②46 ③42 심28): 그림에 함정이 있는 문제라 실력에 실었다.
//  - 단위가 다른 두 부피의 합·몇 배(심29의 변형): 차 하나만 실었다(합은 뜻 없는 셈, 몇 배는 차와 같은 얼개에 큰 수의 나눗셈만 더한다).
//  - m와 cm가 섞인 길이로 m² 겉넓이 구하기(③63), 넓이의 단위만 바꾸는 것(심32의 변형, ①39·46의 넓이 쪽): 넓이 단위 바꾸기는 5학년 「다각형의 둘레와 넓이」의 일이고 소수의 곱을 세 번 한다.
//  - 옆면의 넓이가 같은 두 직육면체(①69): 「옆면의 넓이 ÷ 밑면의 둘레」는 실력의 「전개도에서 겉넓이로 모서리 구하기」가 같은 판단으로 묻는다.
//  - 전개도에서 합동인 면의 짝 찾기(①58의 변형): 5학년 「직육면체」의 일이다.
//  - 투명한 판 6개로 만든 두 상자의 차(②68의 변형), 세 입체의 겉넓이의 차례(①66의 변형): 「두 입체도형의 겉넓이 비교」와 수만 다르다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, N, M, C, D, tagged, lines } = B.kit;
  const K = B.kit.box525;
  const { tiles, YELLOW, edgeOf, pickWord, say } = K;
  const { TAGS, MARKS, calc, len, range, prod, surf, three, said3, text3, cms, orderOptions, boxArt, cubeArt, netWith, cubeNetWith, spanNet, sheet } = B.kit.vol616;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const MILLION = 1000000;
  // 소수 한 자리 수(10배 한 값 t)와 소수 두 자리 수(100배 한 값 h)를 글로: 25 → '2.5', 5 → '0.05', 30 → '0.3'
  const tenth = (t) => (t % 10 === 0 ? String(t / 10) : Math.floor(t / 10) + '.' + (t % 10));
  const hundredth = (h) => String(h / 100);
  // 검사가 식 글을 그대로 셈하므로, 소수에 1000000을 곱한 값이 정수 셈의 값과 꼭 같은 수만 쓴다.
  const exact = (text, value) => Number(text) * MILLION === value;
  const tenths = (d, lo, hi) => d.until(() => d.int(lo, hi), (t) => t % 10 !== 0 && exact(tenth(t), t * 100000));
  const sign = (x, y) => (x > y ? '&gt;' : x === y ? '=' : '&lt;');
  const surfExpr = (v) => `(${v[0]}*${v[1]}+${v[1]}*${v[2]}+${v[0]}*${v[2]})*2`;
  const surfShown = (v) => `(${v[0]} × ${v[1]} + ${v[1]} × ${v[2]} + ${v[0]} × ${v[2]}) × 2 = ${surf(v)}(cm²)`;
  // 면에 이름을 적는 겨냥도에서는 보이지 않는 모서리(점선)를 긋지 않는다(이름과 겹친다).
  const HIDE_BACK = { [edgeOf('ㅁㅇ')]: 'none', [edgeOf('ㅁㅂ')]: 'none', [edgeOf('ㄱㅁ')]: 'none' };
  const SURF_RULE = '직육면체의 겉넓이는 한 꼭짓점에서 만나는 세 면의 넓이의 합을 2배 하여 구한다.';

  // ── 1 m³와 단위 바꾸기 ───────────────────────────────────────
  B.addTypes('6-1-6', 'm3', [
    T('m3-word', '1 m³의 뜻과 읽기', '①37 ②37 ③32 심8', (d, n) => {
      if (n === 0) return pickWord(d, '한 모서리의 길이가 1 m인 정육면체의 부피를 바르게 쓴 것은?', '1 m³', ['1 m', '1 m²', '100 cm³'], '한 모서리의 길이가 1 m인 정육면체의 부피를 1 m³라 쓰고 1 세제곱미터라고 읽는다.');
      const v = d.int(2, 48);
      return pickWord(d, `${v} m³를 바르게 읽은 것은?`, `${v} 세제곱미터`, [`${v} 제곱미터`, `${v} 미터세제곱`, `${v} 세제곱센티미터`], `1 m³는 1 세제곱미터라고 읽는다. ${v} m³는 ${v} 세제곱미터이다.`);
    }, { count: 2 }),
    T('m3-relation', '1 m³와 1 cm³의 관계', '①38·39 ②38 ③33', (d, n) => (n === 0
      ? M('한 모서리의 길이가 1 m인 정육면체 모양 상자에 부피가 1 cm³인 쌓기나무를 빈틈없이 가득 채우려고 한다. 상자의 가로 한 줄에 놓이는 쌓기나무의 수와 상자를 가득 채우는 데 필요한 쌓기나무의 수를 구하시오.', [{ label: '가로 한 줄에', answer: 100, unit: '개' }, { label: '모두', answer: MILLION, unit: '개' }], {
        explain: '1 m = 100 cm이므로 가로, 세로, 높이에 쌓기나무가 100개씩 놓인다. 100 × 100 × 100 = 1000000(개)', facts: { calc: [['100', 0], ['100*100*100', 1]], unseen: [100] }
      })
      : N('1 m = 100 cm이므로 한 모서리의 길이가 1 m인 정육면체의 부피는 100 cm × 100 cm × 100 cm로 구할 수 있다. 1 m³는 몇 cm³인가?', MILLION, { unit: 'cm³', explain: '100 × 100 × 100 = 1000000이므로 1 m³ = 1000000 cm³이다.', facts: calc('100*100*100') })), { count: 2 }),
    T('m3-say', '부피의 단위 1 m³에 대한 설명', '①46 ②37 ③7', (d) => say(d, '부피의 단위 1 m³에 대한 설명으로 옳은 것은?',
      ['1 m³는 1000000 cm³와 같다.', '한 모서리의 길이가 1 m인 정육면체의 부피이다.', '부피가 1 m³인 정육면체 모양 상자에는 부피가 1 cm³인 쌓기나무가 한 층에 10000개씩 100층 들어간다.'],
      [['1 m³는 100 cm³와 같다.', '1 m는 100 cm이지만 1 m³는 100 × 100 × 100 = 1000000(cm³)이다.'], ['1 m³는 10000 cm³와 같다.', '10000 cm²와 같은 것은 넓이의 단위 1 m²이다. 1 m³는 1000000 cm³이다.'],
        ['부피가 1 m³인 정육면체 모양 상자에는 부피가 1 cm³인 쌓기나무가 한 층에 100개씩 100층 들어간다.', '한 층에 100 × 100 = 10000(개)씩 100층 들어간다.'], ['1 제곱미터라고 읽는다.', '1 m³는 1 세제곱미터라고 읽는다.']], true,
      '1 m³는 한 모서리의 길이가 1 m인 정육면체의 부피이고 1000000 cm³와 같다.')),
    T('m3-convert', 'm³와 cm³ 바꾸기', '①40 ②39 ③34 심22', (d, n) => {
      const a = d.pick([2, 3, 4, 5, 6, 7, 8, 9, 12, 25, 40, 60, 300]);
      return n === 0
        ? N(`${a} m³는 몇 cm³인가?`, a * MILLION, { unit: 'cm³', explain: `1 m³ = 1000000 cm³이다. ${a} m³ = ${a * MILLION} cm³`, facts: calc(`${a}*1000000`, [MILLION]) })
        : N(`${a * MILLION} cm³는 몇 m³인가?`, a, { unit: 'm³', explain: `1000000 cm³ = 1 m³이다. ${a * MILLION} cm³ = ${a} m³`, facts: Object.assign(calc(`${a * MILLION}/1000000`, [MILLION]), { rule: 'to-m3-whole' }) });
    }, { count: 2 }),
    T('m3-convert-dec', '소수가 있는 m³와 cm³ 바꾸기', '①41 ②40 ③35 심22', (d, n) => {
      // n = 0·1: 1 m³보다 큰 부피, n = 2·3: 1 m³보다 작은 부피
      if (n < 2) {
        const t = tenths(d, 11, 99), x = tenth(t), big = t * 100000;
        return n === 0
          ? N(`${x} m³는 몇 cm³인가?`, big, { unit: 'cm³', explain: `1 m³ = 1000000 cm³이다. ${x} × 1000000 = ${big}이므로 ${x} m³ = ${big} cm³이다.`, facts: Object.assign(calc(`${x}*1000000`, [MILLION]), { rule: 'to-cm3-over1' }) })
          : D(`${big} cm³는 몇 m³인가?`, t / 10, { unit: 'm³', explain: `1000000 cm³ = 1 m³이다. ${big} ÷ 1000000 = ${x}이므로 ${big} cm³ = ${x} m³이다.`, facts: Object.assign(calc(`${big}/1000000`, [MILLION]), { rule: 'to-m3-over1' }) });
      }
      const h = d.until(() => d.pick([5, 8, 20, 25, 30, 40, 45, 60, 70, 75, 80]), (v) => exact(hundredth(v), v * 10000)), x = hundredth(h), small = h * 10000;
      return n === 2
        ? N(`${x} m³는 몇 cm³인가?`, small, { unit: 'cm³', explain: `1 m³ = 1000000 cm³이다. ${x} × 1000000 = ${small}이므로 ${x} m³ = ${small} cm³이다. 1 m³보다 작은 부피이므로 1000000 cm³보다 작다.`, facts: Object.assign(calc(`${x}*1000000`, [MILLION]), { rule: 'to-cm3-under1' }) })
        : D(`${small} cm³는 몇 m³인가?`, h / 100, { unit: 'm³', explain: `1000000 cm³ = 1 m³이다. ${small} ÷ 1000000 = ${x}이므로 ${small} cm³ = ${x} m³이다. 1000000 cm³보다 작은 부피이므로 1 m³보다 작다.`, facts: Object.assign(calc(`${small}/1000000`, [MILLION]), { rule: 'to-m3-under1' }) });
    }, { count: 4 }),
    T('m3-claims', '단위를 바르게 바꾸었는지 가리기', '①46 ②41 심23', (d) => {
      // 적힌 cm³ 값이 줄마다 달라야 한다(같은 값이 두 줄에 나오면 서로 어긋나는 줄이 바로 드러난다).
      const made = d.until(() => {
        const [a, b] = d.shuffle([2, 3, 4, 5, 6, 7, 8, 9, 12, 35]), t = tenths(d, 11, 99), h = d.pick([5, 20, 30, 40, 60, 80]), bad = d.int(0, 3), up = d.bool();
        const rows = [[(v) => `${a} m³ = ${v} cm³`, `${a}*1000000`, a * MILLION], [(v) => `${v} cm³ = ${b} m³`, `${b}*1000000`, b * MILLION], [(v) => `${tenth(t)} m³ = ${v} cm³`, `${tenth(t)}*1000000`, t * 100000], [(v) => `${v} cm³ = ${hundredth(h)} m³`, `${hundredth(h)}*1000000`, h * 10000]];
        return { h, bad, rows, shown: rows.map((r, i) => (i === bad ? (up ? r[2] * 10 : r[2] / 10) : r[2])) };
      }, (m) => exact(hundredth(m.h), m.h * 10000) && new Set(m.shown).size === 4 && new Set(m.rows.map((r) => r[2])).size === 4), { bad, rows, shown } = made;
      return C('부피의 단위를 바꾼 것 가운데 옳지 않은 것은?', MARKS, bad, {
        figure: tagged(rows.map((r, i) => r[0](shown[i])), MARKS), explain: `1 m³ = 1000000 cm³이다. ${MARKS[bad]}은 ${rows[bad][0](rows[bad][2])}로 고쳐야 한다.`,
        facts: { claimed: rows.map((r, i) => [r[1], shown[i]]), claimedWant: false }
      });
    }),
    T('m3-compare', '단위가 다른 두 부피의 크기 비교', '①43 ②43 ③37 심24', (d) => {
      const t = d.bool() ? tenths(d, 11, 99) : d.int(2, 60) * 10, y = tenth(t), same = t * 100000, x = (same * 10) / d.pick([1, 10, 100]), swap = d.bool();
      const sides = [[`${x} cm³`, String(x), x], [`${y} m³`, `${y}*1000000`, same]], [l, r] = swap ? [sides[1], sides[0]] : sides;
      return C('두 부피의 크기를 비교하여 ○ 안에 알맞은 것을 고르시오.', ['&gt;', '=', '&lt;'], l[2] > r[2] ? 0 : l[2] === r[2] ? 1 : 2, {
        figure: lines([`${l[0]} ○ ${r[0]}`]), explain: `1 m³ = 1000000 cm³이므로 ${y} m³ = ${same} cm³이다. ${x} cm³와 비교하면 ${l[0]} ${sign(l[2], r[2])} ${r[0]}이다.`,
        facts: { choose: { exprs: [l[1], r[1]], rule: 'compare' }, unseen: [MILLION] }
      });
    }),
    T('m3-order', '단위가 섞인 부피를 큰 것부터 늘어놓기', '①44 ②48 ③37 심24', (d) => {
      const m = d.until(() => ({ a: d.int(2, 8), b: d.int(11, 95), t: tenths(d, 11, 95) }), (x) => x.b % 10 !== 0 && x.b !== x.t && Math.abs(x.a * 10 - x.b) <= 30 && Math.abs(x.a * 10 - x.t) <= 30);
      const rows = d.shuffle([[`${m.a} m³`, `${m.a}*1000000`, m.a * MILLION], [`${m.b * 100000} cm³`, String(m.b * 100000), m.b * 100000], [`${tenth(m.t)} m³`, `${tenth(m.t)}*1000000`, m.t * 100000]]), made = orderOptions(d, rows.map((r) => r[2]), MARKS);
      return C('부피가 큰 것부터 차례대로 쓴 것은?', made.options, made.answer, {
        figure: tagged(rows.map((r) => r[0]), MARKS), explain: `단위를 cm³로 맞추면 ${rows.map((r, i) => `${MARKS[i]} ${r[2]} cm³`).join(', ')}이다. 큰 것부터 쓰면 ${made.right.map((i) => MARKS[i]).join(', ')}이다.`,
        facts: { choose: { exprs: rows.map((r) => r[1]), rule: 'descending', orders: made.orders }, unseen: [MILLION] }
      });
    }),
    T('m3-order-solid', '부피를 구해야 하는 입체도형이 낀 크기 비교', '①45 ②48 ③43 심25', (d) => {
      const s = d.pick([2, 3]), cube = s * s * s * 10, m = d.until(() => ({ t: tenths(d, Math.round(cube * 0.7), Math.round(cube * 1.3)), u: d.int(Math.round(cube * 0.7), Math.round(cube * 1.3)) }), (x) => x.u % 10 !== 0 && new Set([x.t, x.u, cube]).size === 3), side = s * 100;
      const rows = d.shuffle([[`부피가 ${tenth(m.t)} m³인 상자`, `${tenth(m.t)}*1000000`, m.t * 100000], [`부피가 ${m.u * 100000} cm³인 상자`, String(m.u * 100000), m.u * 100000], [`한 모서리의 길이가 ${side} cm인 정육면체 모양 상자`, `${side}*${side}*${side}`, cube * 100000]]);
      const values = rows.map((r) => r[2]), at = values.indexOf(Math.max(...values));
      return C('부피가 가장 큰 상자는?', MARKS.slice(0, 3), at, {
        figure: tagged(rows.map((r) => r[0]), MARKS),
        explain: `정육면체 모양 상자의 부피는 ${side} × ${side} × ${side} = ${cube * 100000}(cm³)이다. 단위를 cm³로 맞추면 ${rows.map((r, i) => `${MARKS[i]} ${r[2]} cm³`).join(', ')}이므로 가장 큰 것은 ${MARKS[at]}이다.`,
        facts: { choose: { exprs: rows.map((r) => r[1]), rule: 'max' }, unseen: [MILLION] }
      });
    }),
    T('m3-unit-choose', '알맞은 부피의 단위와 부피 어림', '①47 ②44 ③9·38 심9', (d, n) => {
      if (n === 1) {
        const [thing, right, wrongs] = d.pick([['세탁기', '0.6 m³', ['6 cm³', '60 cm³', '600 m³']], ['필통', '300 cm³', ['3 cm³', '3 m³', '300 m³']], ['교실', '200 m³', ['2 m³', '200 cm³', '2000 cm³']], ['지우개', '12 cm³', ['12 m³', '1200 cm³', '120 m³']]]);
        return pickWord(d, `${thing}의 부피로 가장 알맞은 것은?`, right, wrongs, `1 cm³는 각설탕만 한 크기이고, 1 m³는 한 모서리의 길이가 1 m인 큰 상자만 한 크기이다. ${thing}의 부피는 ${right}쯤이다.`);
      }
      const want = d.pick(['교실', '버스', '컨테이너', '수영장']);
      return pickWord(d, '부피를 m³로 나타내기에 가장 알맞은 것은?', want, d.shuffle(['필통', '주사위', '우유갑', '지우개', '휴대 전화', '각설탕']).slice(0, 3), `손에 들 수 있는 작은 물건의 부피는 cm³로, 사람이 들어갈 만큼 큰 것의 부피는 m³로 나타내기에 알맞다. ${josa(want, '은/는')} m³로 나타낸다.`);
    }, { count: 2 }),
    T('m3-box', '길이가 m로 주어진 직육면체의 부피', '①48 ②45 ③39 심26', (d, n) => {
      if (n === 1) {
        const [a, b] = d.until(() => [d.int(3, 8), d.int(2, 6)], ([x, y]) => (x * y) % 2 === 0 && x !== y), c = d.pick([25, 35]), total = (a * b * c) / 10;
        return N(`가로가 ${a} m, 세로가 ${b} m, 높이가 ${tenth(c)} m인 직육면체 모양 방의 부피는 몇 m³인가?`, total, { unit: 'm³', explain: `${a} × ${b} × ${tenth(c)} = ${a * b} × ${tenth(c)} = ${total}(m³)`, facts: calc(`${a}*${b}*${tenth(c)}`) });
      }
      const v = three(d, range(2, 9), null, 2.5);
      return N('직육면체의 부피는 몇 m³인가?', prod(v), {
        unit: 'm³', figure: boxArt(v, cms(v, 'm'), { label: `직육면체의 겨냥도. ${said3(v, 'm')}` }), explain: `길이의 단위가 m이므로 부피의 단위는 m³이다. ${v.join(' × ')} = ${prod(v)}(m³)`, facts: calc(v.join('*'))
      });
    }, { count: 2 }),
    T('m3-from-cm', '길이가 cm로 주어진 입체도형의 부피를 m³로 구하기', '①49 ②46 ③40 심27', (d, n) => {
      if (n === 1) {
        const s = d.int(2, 6);
        return N(`한 모서리의 길이가 ${s * 100} cm인 정육면체 모양 물탱크의 부피는 몇 m³인가?`, s * s * s, { unit: 'm³', explain: `${s * 100} cm = ${s} m이다. ${s} × ${s} × ${s} = ${s * s * s}(m³)`, facts: calc(`(${s * 100}/100)*(${s * 100}/100)*(${s * 100}/100)`, [100]) });
      }
      const v = three(d, range(2, 9));
      return N(`${text3(v.map((x) => x * 100))}인 직육면체 모양 창고의 부피는 몇 m³인가?`, prod(v), {
        unit: 'm³', explain: `길이를 m로 바꾸면 ${v.map((x) => `${x * 100} cm = ${x} m`).join(', ')}이다. ${v.join(' × ')} = ${prod(v)}(m³)`, facts: calc(v.map((x) => `(${x * 100}/100)`).join('*'), [100])
      });
    }, { count: 2 }),
    T('m3-both', '한 입체도형의 부피를 m³와 cm³로 나타내기', '①51 ②47 ③41 심27', (d, n) => {
      if (n === 1) {
        const v = d.until(() => [d.pick([20, 30, 40, 50]), d.pick([10, 20, 30, 40]), d.pick([10, 20, 30, 40, 50])], (w) => new Set(w).size >= 2), total = prod(v);
        return M(`${text3(v)}인 직육면체 모양 상자의 부피는 몇 cm³이고, 몇 m³인가?`, [{ answer: total, unit: 'cm³' }, { answer: total / MILLION, unit: 'm³', decimal: true }], {
          explain: `${v.join(' × ')} = ${total}(cm³)이다. 1000000 cm³ = 1 m³이므로 ${total} cm³ = ${total / MILLION} m³이다.`, facts: { calc: [[v.join('*'), 0], [`${v.join('*')}/1000000`, 1]], unseen: [MILLION] }
        });
      }
      const s = d.int(2, 5), total = s * s * s;
      return M(`한 모서리의 길이가 ${s} m인 정육면체의 부피는 몇 m³이고, 몇 cm³인가?`, [{ answer: total, unit: 'm³' }, { answer: total * MILLION, unit: 'cm³' }], {
        explain: `${s} × ${s} × ${s} = ${total}(m³)이다. 1 m³ = 1000000 cm³이므로 ${total} m³ = ${total * MILLION} cm³이다.`, facts: { calc: [[`${s}*${s}*${s}`, 0], [`${s}*${s}*${s}*1000000`, 1]], unseen: [MILLION] }
      });
    }, { count: 2 }),
    T('m3-diff', '단위가 다른 두 부피의 차', '②49 심29', (d) => {
      const [t, u] = d.until(() => [d.int(15, 48), d.int(2, 9)], ([x, y]) => (x - y) % 10 !== 0), small = u * 100000;
      return D(`부피가 ${tenth(t)} m³인 옷장과 부피가 ${small} cm³인 서랍장이 있다. 옷장의 부피는 서랍장의 부피보다 몇 m³ 더 큰가?`, (t - u) / 10, {
        unit: 'm³', explain: `1000000 cm³ = 1 m³이므로 ${small} cm³ = ${tenth(u)} m³이다. ${tenth(t)} − ${tenth(u)} = ${tenth(t - u)}(m³)`, facts: calc(`${tenth(t)}-${small}/1000000`, [MILLION])
      });
    })
  ]);

  // ── 직육면체와 정육면체의 겉넓이 ─────────────────────────────
  B.addTypes('6-1-6', 'surface', [
    T('surf-formula', '겉넓이를 구하는 식', '①54 ③51', (d, n) => (n === 0
      ? N('(직육면체의 겉넓이) = (한 밑면의 넓이) × ㉠ + (옆면의 넓이)이다. ㉠에 알맞은 수는?', 2, { explain: '직육면체에는 모양과 크기가 같은 밑면이 2개 있으므로 한 밑면의 넓이를 2배 하고 옆면 4개의 넓이를 더한다.', facts: calc('2', [2]) })
      : N('(정육면체의 겉넓이) = (한 면의 넓이) × ㉠이다. ㉠에 알맞은 수는?', 6, { explain: '정육면체는 모양과 크기가 같은 면 6개로 둘러싸여 있으므로 한 면의 넓이를 6배 한다.', facts: calc('6', [6]) })), { count: 2 }),
    T('surf-say', '겉넓이를 구하는 방법', '①60 ③50·51 심34·40', (d) => say(d, '직육면체의 겉넓이를 구하는 방법으로 옳지 않은 것은?',
      ['여섯 면의 넓이를 모두 더한다.', '한 꼭짓점에서 만나는 세 면의 넓이의 합을 2배 한다.', '두 밑면의 넓이와 옆면 4개의 넓이를 더한다.', '한 밑면의 넓이의 2배에 (한 밑면의 둘레) × (높이)를 더한다.'],
      [['겨냥도에서 보이는 세 면의 넓이만 더한다.', '보이지 않는 세 면도 겉면이므로 보이는 세 면의 넓이의 합을 2배 해야 한다.'], ['한 밑면의 넓이와 옆면 4개의 넓이를 더한다.', '밑면은 2개이므로 한 밑면의 넓이를 2배 하여 더해야 한다.'],
        ['가로, 세로, 높이를 곱한다.', '가로, 세로, 높이를 곱한 것은 부피이다.'], ['가장 넓은 면의 넓이를 6배 한다.', '여섯 면의 넓이가 모두 같은 것은 정육면체뿐이다.']], false,
      '겉넓이는 여섯 면의 넓이를 모두 더한 것이다. 마주 보는 면끼리 넓이가 같으므로 세 면의 넓이의 합을 2배 해도 되고, 두 밑면의 넓이에 옆면의 넓이를 더해도 된다.')),
    T('surf-six', '여섯 면의 넓이를 모두 더하여 겉넓이 구하기', '①55 ②53 ③47', (d) => {
      const v = three(d, range(3, 9), null, 2.4), [a, b, c] = v, [ab, bc, ac] = [a * b, b * c, a * c];
      return M('직육면체의 여섯 면의 넓이를 모두 더하여 겉넓이를 구하려고 한다. ㉠, ㉡에 알맞은 수를 구하시오.', [{ label: '㉠', answer: ac }, { label: '㉡', answer: surf(v) }], {
        figure: boxArt(v, cms(v), { label: `직육면체의 겨냥도. ${said3(v)}` }) + lines([`(겉넓이) = ${ab} + ${bc} + ㉠ + ${ab} + ${bc} + ㉠ = ㉡(cm²)`]),
        explain: `넓이가 ${ab} cm²인 면과 ${bc} cm²인 면이 2개씩 있고, 나머지 두 면은 ${a} × ${c} = ${ac}(cm²)이다. ${ab} + ${bc} + ${ac} + ${ab} + ${bc} + ${ac} = ${surf(v)}(cm²)`,
        facts: { calc: [[`${a}*${c}`, 0], [`${ab}+${bc}+${a}*${c}+${ab}+${bc}+${a}*${c}`, 1]] }
      });
    }),
    T('surf-faces', '면마다의 넓이', '①58 ③46', (d) => {
      const v = three(d, range(4, 9), null, 2), [a, b, c] = v;
      return M('직육면체에서 면 가, 나, 다의 넓이는 각각 몇 cm²인가?', [{ label: '가', answer: a * b, unit: 'cm²' }, { label: '나', answer: a * c, unit: 'cm²' }, { label: '다', answer: b * c, unit: 'cm²' }], {
        figure: boxArt(v, cms(v), { faceText: { 5: '가', 2: '나', 1: '다' }, style: HIDE_BACK, label: `직육면체의 겨냥도. ${said3(v)}. 윗면에 가, 앞면에 나, 오른쪽 옆면에 다` }),
        explain: `가는 가로와 세로로 이루어진 면이므로 ${a} × ${b} = ${a * b}(cm²), 나는 가로와 높이로 이루어진 면이므로 ${a} × ${c} = ${a * c}(cm²), 다는 세로와 높이로 이루어진 면이므로 ${b} × ${c} = ${b * c}(cm²)이다.`,
        facts: { calc: [[`${a}*${b}`, 0], [`${a}*${c}`, 1], [`${b}*${c}`, 2]] }
      });
    }),
    T('surf-pairs', '합동인 세 쌍의 면으로 겉넓이 구하기', '①56 ②54 ③48', (d) => {
      const v = three(d, range(3, 9), null, 2.4), [a, b, c] = v;
      return M('직육면체에서 합동인 면이 3쌍임을 이용하여 겉넓이를 구하려고 한다. ㉠, ㉡에 알맞은 수를 구하시오.', [{ label: '㉠', answer: c }, { label: '㉡', answer: surf(v) }], {
        figure: boxArt(v, cms(v), { label: `직육면체의 겨냥도. ${said3(v)}` }) + lines([`(겉넓이) = (${a} × ${b} + ${b} × ㉠ + ${a} × ㉠) × 2 = ㉡(cm²)`]),
        explain: `한 꼭짓점에서 만나는 세 면의 넓이는 ${a} × ${b}, ${b} × ${c}, ${a} × ${c}이므로 ㉠은 높이인 ${c}이다. ${surfShown(v)}`, facts: { calc: [[String(c), 0], [surfExpr(v), 1]], unseen: [2] }
      });
    }),
    T('surf-side', '두 밑면과 옆면으로 겉넓이 구하기', '①57 ②55 ③49 심34', (d) => {
      const v = three(d, range(3, 9), null, 2.4), [a, b, c] = v;
      return M('직육면체의 두 밑면의 넓이와 옆면의 넓이를 더하여 겉넓이를 구하려고 한다. ㉠, ㉡에 알맞은 수를 구하시오.', [{ label: '㉠', answer: a * b }, { label: '㉡', answer: surf(v) }], {
        figure: boxArt(v, cms(v), { label: `직육면체의 겨냥도. ${said3(v)}` }) + lines(['(겉넓이) = (한 밑면의 넓이) × 2 + (옆면의 넓이)', `= ㉠ × 2 + (${a} + ${b} + ${a} + ${b}) × ${c} = ㉡(cm²)`]),
        explain: `한 밑면의 넓이는 ${a} × ${b} = ${a * b}(cm²)이다. 옆면 4개를 펼치면 가로가 ${a} + ${b} + ${a} + ${b} = ${(a + b) * 2}(cm), 세로가 ${c} cm인 직사각형이 된다. ${a * b} × 2 + ${(a + b) * 2} × ${c} = ${surf(v)}(cm²)`,
        facts: { calc: [[`${a}*${b}`, 0], [`${a}*${b}*2+(${a}+${b}+${a}+${b})*${c}`, 1]], unseen: [2] }
      });
    }),
    T('surf-side-area', '전개도에서 옆면의 넓이', '①57 ②55 ③49 심37', (d) => {
      const v = three(d, range(3, 8), null, 2.4), made = netWith(d, v, (L) => len(L), { tintStrip: true, label: () => `직육면체의 전개도. 한 줄로 이어진 면 4개를 색칠했다. 테두리의 세 선분의 길이 ${v.map((x) => len(x)).join(', ')}` });
      const { sides, cross } = made.strip, long = sides.reduce((s, x) => s + x, 0);
      return N('직육면체의 전개도에서 한 줄로 이어진 옆면 4개를 색칠했다. 색칠한 부분의 넓이는 몇 cm²인가?', long * cross, {
        unit: 'cm²', figure: made.figure, explain: `색칠한 부분은 이어진 쪽의 길이가 ${sides.join(' + ')} = ${long}(cm), 다른 쪽의 길이가 ${cross} cm인 직사각형이다. ${long} × ${cross} = ${long * cross}(cm²)`,
        facts: calc(`(${sides.join('+')})*${cross}`)
      });
    }),
    T('surf-expr', '겉넓이를 구하는 식 고르기', '①59 ②56 ③50 심34', (d) => {
      const wrongOf = ([a, b, c]) => [[`${a} × ${b} × ${c}`, `${a}*${b}*${c}`], [`(${a} + ${b} + ${c}) × 6`, `(${a}+${b}+${c})*6`], [`${a} × ${b} + ${b} × ${c} + ${a} × ${c}`, `${a}*${b}+${b}*${c}+${a}*${c}`], [`${a} × ${b} × 2 + (${a} + ${b}) × ${c}`, `${a}*${b}*2+(${a}+${b})*${c}`]];
      const v = three(d, range(3, 12), (w) => surf(w) !== prod(w) && (w[0] + w[1] + w[2]) * 6 !== surf(w)), [a, b, c] = v, wrong = d.pick(wrongOf(v));
      const rows = d.shuffle([[`(${a} × ${b} + ${b} × ${c} + ${a} × ${c}) × 2`, surfExpr(v)], [`${a} × ${b} × 2 + (${a} + ${b} + ${a} + ${b}) × ${c}`, `${a}*${b}*2+(${a}+${b}+${a}+${b})*${c}`], [`${a} × ${b} × 2 + ${b} × ${c} × 2 + ${a} × ${c} × 2`, `${a}*${b}*2+${b}*${c}*2+${a}*${c}*2`], wrong]);
      return C(`${text3(v)}인 직육면체의 겉넓이를 구하는 식으로 옳지 않은 것은?`, rows.map((r) => r[0]), rows.indexOf(wrong), {
        explain: `겉넓이는 ${surfShown(v)}이다. 합동인 면 3쌍의 넓이를 2배씩 하여 더하거나, 두 밑면의 넓이에 옆면 4개의 넓이를 더해도 같은 값이 나온다. ${wrong[0]}의 값은 ${josa(surf(v), '이/가')} 아니다.`,
        facts: { claimed: rows.map((r) => [r[1], surf(v)]), claimedWant: false }
      });
    }),
    T('surf-from-faces', '면의 넓이로 겉넓이 구하기', '①56·60·63 ②61·71 ③55 심36·40', (d, n) => {
      if (n === 1) { const s = d.int(4, 12), area = s * s; return N(`한 면의 넓이가 ${area} cm²인 정육면체의 겉넓이는 몇 cm²인가?`, area * 6, { unit: 'cm²', explain: `정육면체는 넓이가 같은 면이 6개이다. ${area} × 6 = ${area * 6}(cm²)`, facts: calc(`${area}*6`, [6]) }); }
      const v = three(d, range(3, 9)), areas = [v[0] * v[1], v[1] * v[2], v[0] * v[2]], total = surf(v);
      return N(`직육면체에서 한 꼭짓점에서 만나는 세 면의 넓이가 각각 ${areas.map((x) => x + ' cm²').join(', ')}이다. 이 직육면체의 겉넓이는 몇 cm²인가?`, total, {
        unit: 'cm²', explain: `한 꼭짓점에서 만나는 세 면과 마주 보는 면이 하나씩 더 있고, 마주 보는 면끼리는 넓이가 같다. (${areas.join(' + ')}) × 2 = ${total}(cm²)`, facts: calc(`(${areas.join('+')})*2`, [2])
      });
    }, { count: 2 }),
    T('surf-box', '겨냥도로 준 직육면체의 겉넓이', '①61 ②58 ③52 심33', (d) => {
      const v = three(d, range(3, 10), null, 2.5);
      return N('직육면체의 겉넓이는 몇 cm²인가?', surf(v), { unit: 'cm²', figure: boxArt(v, cms(v), { label: `직육면체의 겨냥도. ${said3(v)}` }), explain: `${SURF_RULE} ${surfShown(v)}`, facts: calc(surfExpr(v), [2]) });
    }),
    T('surf-box-text', '글로 준 직육면체의 겉넓이', '①61 ②58·60 ③52·53 심33', (d) => {
      const v = d.until(() => [d.pick([10, 12, 15, 20]), d.int(5, 9), d.int(3, 8)], (w) => new Set(w).size === 3);
      return N(`${text3(v)}인 직육면체 모양 선물 상자의 겉면 전체에 포장지를 겹치지 않게 빈틈없이 붙이려고 한다. 필요한 포장지의 넓이는 몇 cm²인가?`, surf(v), {
        unit: 'cm²', explain: `필요한 포장지의 넓이는 상자의 겉넓이와 같다. ${surfShown(v)}`, facts: calc(surfExpr(v), [2])
      });
    }),
    T('surf-cube', '정육면체의 겉넓이', '①62 ②57·59·60·70 ③54·59 심35', (d, n) => {
      const s = d.int(3, 11), total = s * s * 6;
      if (n === 1) return M(`한 모서리의 길이가 ${s} cm인 정육면체의 겉넓이를 구하는 식이다. ㉠, ㉡에 알맞은 수를 구하시오.`, [{ label: '㉠', answer: 6 }, { label: '㉡', answer: total }], {
        figure: lines([`(정육면체의 겉넓이) = ${s} × ${s} × ㉠ = ㉡(cm²)`]), explain: `한 면의 넓이는 ${s} × ${s} = ${s * s}(cm²)이고 넓이가 같은 면이 6개이므로 ㉠은 6이다. ${s} × ${s} × 6 = ${total}이므로 ㉡은 ${total}이다.`,
        facts: { calc: [['6', 0], [`${s}*${s}*6`, 1]], unseen: [6] }
      });
      if (n === 2) return N(`한 모서리의 길이가 ${s} cm인 정육면체의 전개도를 종이에 그렸다. 이 전개도의 넓이는 몇 cm²인가?`, total, {
        unit: 'cm²', explain: `전개도는 한 변의 길이가 ${s} cm인 정사각형 6개로 이루어져 있으므로 전개도의 넓이는 정육면체의 겉넓이와 같다. ${s} × ${s} × 6 = ${total}(cm²)`, facts: calc(`${s}*${s}*6`, [6])
      });
      return N('정육면체의 겉넓이는 몇 cm²인가?', total, {
        unit: 'cm²', figure: cubeArt(s, len(s), `정육면체의 겨냥도. 한 모서리의 길이 ${s} cm`), explain: `(정육면체의 겉넓이) = (한 면의 넓이) × 6이다. ${s} × ${s} × 6 = ${total}(cm²)`, facts: calc(`${s}*${s}*6`, [6])
      });
    }, { count: 3 }),
    T('surf-net-box', '전개도를 접은 직육면체의 겉넓이', '①64 ②62 ③56 심37', (d) => {
      const v = three(d, range(3, 9), null, 2.4), made = netWith(d, v, (L) => len(L), { label: () => `직육면체의 전개도. 테두리의 세 선분의 길이 ${v.map((x) => len(x)).join(', ')}` });
      return N('전개도를 접어서 만든 직육면체의 겉넓이는 몇 cm²인가?', surf(v), {
        unit: 'cm²', figure: made.figure, explain: `전개도에 적힌 세 길이가 직육면체의 서로 다른 세 모서리의 길이이다. 전개도의 여섯 면의 넓이의 합이 겉넓이이므로 ${surfShown(v)}`, facts: calc(surfExpr(v), [2])
      });
    }),
    T('surf-net-cube', '전개도를 접은 정육면체의 겉넓이', '①65 ②63 ③57·58 심38', (d, n) => {
      const s = d.int(3, 10), total = s * s * 6;
      if (n === 1) return N(`정육면체의 전개도에서 정사각형 2개가 이어진 선분의 길이가 ${s * 2} cm이다. 이 전개도를 접어서 만든 정육면체의 겉넓이는 몇 cm²인가?`, total, {
        unit: 'cm²', figure: spanNet(d, 2, len(s * 2), `정육면체의 전개도. 맨 윗줄에 나란히 놓인 정사각형 2개의 변을 이은 선분의 길이 ${s * 2} cm`),
        explain: `정사각형 2개의 변을 이은 길이가 ${s * 2} cm이므로 한 모서리의 길이는 ${s * 2} ÷ 2 = ${s}(cm)이다. ${s} × ${s} × 6 = ${total}(cm²)`, facts: calc(`(${s * 2}/2)*(${s * 2}/2)*6`, [6])
      });
      return N('전개도를 접어서 만든 정육면체의 겉넓이는 몇 cm²인가?', total, {
        unit: 'cm²', figure: cubeNetWith(d, len(s), `정육면체의 전개도. 한 모서리의 길이 ${s} cm`), explain: `전개도는 한 변의 길이가 ${s} cm인 정사각형 6개로 이루어져 있다. ${s} × ${s} × 6 = ${total}(cm²)`, facts: calc(`${s}*${s}*6`, [6])
      });
    }, { count: 2 }),
    T('surf-compare', '두 입체도형의 겉넓이 비교', '①66 ②64 ③60·61 심39', (d, n) => {
      if (n === 1) {
        const m = d.until(() => ({ v: three(d, range(3, 10)), s: d.int(4, 9) }), (x) => surf(x.v) !== x.s * x.s * 6 && Math.abs(surf(x.v) - x.s * x.s * 6) <= 80), box = surf(m.v), cube = m.s * m.s * 6, [big, small] = box > cube ? [box, cube] : [cube, box];
        return N(`${text3(m.v)}인 직육면체와 한 모서리의 길이가 ${m.s} cm인 정육면체가 있다. 두 입체도형의 겉넓이의 차는 몇 cm²인가?`, big - small, {
          unit: 'cm²', explain: `직육면체의 겉넓이는 ${surfShown(m.v)}, 정육면체의 겉넓이는 ${m.s} × ${m.s} × 6 = ${cube}(cm²)이다. ${big} − ${small} = ${big - small}(cm²)`,
          facts: calc(box > cube ? `${surfExpr(m.v)}-${m.s}*${m.s}*6` : `${m.s}*${m.s}*6-${surfExpr(m.v)}`, [2, 6])
        });
      }
      const pair = d.until(() => [three(d, range(3, 9), null, 2.4), three(d, range(3, 9), null, 2.4)], ([v, w]) => surf(v) !== surf(w) && Math.abs(surf(v) - surf(w)) <= 40 && v.slice().sort().join() !== w.slice().sort().join()), values = pair.map(surf), at = values.indexOf(Math.max(...values));
      return C('직육면체 가와 나 가운데 겉넓이가 더 넓은 것은?', ['가', '나'], at, {
        figure: tiles(pair.map((v) => boxArt(v, cms(v), { size: [108, 84], label: `직육면체의 겨냥도. ${said3(v)}` }))),
        explain: `가의 겉넓이는 ${surfShown(pair[0])}, 나의 겉넓이는 ${surfShown(pair[1])}이다. ${TAGS[at]}의 겉넓이가 더 넓다.`, facts: { choose: { exprs: pair.map(surfExpr), rule: 'max' }, unseen: [2] }
      });
    }, { count: 2 }),
    T('surf-both', '한 직육면체의 부피와 겉넓이', '①27·61·62 ②65 ③62 심33·35', (d) => {
      const s = d.int(3, 8), h = d.until(() => d.int(4, 12), (x) => x !== s), total = s * s * 2 + s * 4 * h;
      return M(`밑면이 한 변의 길이가 ${s} cm인 정사각형이고 높이가 ${h} cm인 직육면체의 부피와 겉넓이를 구하시오.`, [{ label: '부피', answer: s * s * h, unit: 'cm³' }, { label: '겉넓이', answer: total, unit: 'cm²' }], {
        explain: `부피는 ${s} × ${s} × ${h} = ${s * s * h}(cm³)이다. 겉넓이는 두 밑면의 넓이 ${s} × ${s} × 2 = ${s * s * 2}(cm²)에 옆면 4개의 넓이 ${s} × ${h} × 4 = ${s * h * 4}(cm²)를 더한 ${total} cm²이다.`,
        facts: { calc: [[`${s}*${s}*${h}`, 0], [`${s}*${s}*2+${s}*${h}*4`, 1]], unseen: [2, 4] }
      });
    }),
    T('surf-m2', '길이가 cm로 주어진 정육면체의 겉넓이를 m²로 구하기', '②66 심32', (d) => {
      const s = d.int(2, 6);
      return N(`한 모서리의 길이가 ${s * 100} cm인 정육면체 모양 컨테이너의 겉넓이는 몇 m²인가?`, s * s * 6, {
        unit: 'm²', explain: `${s * 100} cm = ${s} m이다. 길이의 단위를 m로 바꾸어 구하면 ${s} × ${s} × 6 = ${s * s * 6}(m²)이다.`, facts: calc(`(${s * 100}/100)*(${s * 100}/100)*6`, [100, 6])
      });
    }),
    T('surf-papers', '종이 여러 장으로 만든 직육면체의 겉넓이', '②68', (d) => {
      const a = d.int(3, 8), c = a + d.int(2, 5), k = 62 / c, total = a * c * 4 + a * a * 2;
      return N('직사각형 모양 종이 가 4장과 정사각형 모양 종이 나 2장을 면으로 하여 직육면체를 만들었다. 이 직육면체의 겉넓이는 몇 cm²인가?', total, {
        unit: 'cm²', figure: tiles([sheet(a, c, k), sheet(a, a, k)]), explain: `종이 6장이 직육면체의 여섯 면이므로 종이의 넓이를 모두 더한다. 가는 ${a} × ${c} = ${a * c}(cm²)이고 나는 ${a} × ${a} = ${a * a}(cm²)이다. ${a * c} × 4 + ${a * a} × 2 = ${total}(cm²)`,
        facts: calc(`${a}*${c}*4+${a}*${a}*2`)
      });
    }),
    T('surf-left', '상자의 겉면에 붙이고 남은 색종이의 넓이', '②69', (d) => {
      const m = d.until(() => ({ side: d.pick([20, 25, 30]), v: three(d, range(3, 10)) }), (x) => surf(x.v) < x.side * x.side - 30 && surf(x.v) > x.side * x.side * 0.3), total = m.side * m.side;
      return N(`한 변의 길이가 ${m.side} cm인 정사각형 모양 색종이를 잘라 ${text3(m.v)}인 직육면체 모양 상자의 여섯 면에 겹치지 않게 빈틈없이 붙였다. 남은 색종이의 넓이는 몇 cm²인가?`, total - surf(m.v), {
        unit: 'cm²', explain: `색종이의 넓이는 ${m.side} × ${m.side} = ${total}(cm²)이고, 상자의 겉넓이는 ${surfShown(m.v)}이다. ${total} − ${surf(m.v)} = ${total - surf(m.v)}(cm²)`,
        facts: calc(`${m.side}*${m.side}-${surfExpr(m.v)}`, [2])
      });
    }),
    T('surf-biggest-cube', '직육면체를 잘라 만드는 가장 큰 정육면체의 겉넓이', '①35 ②30 심63', (d) => {
      const v = d.shuffle(three(d, range(5, 14), (w) => Math.min(...w) <= 10)), s = Math.min(...v);
      return N(`${text3(v)}인 직육면체 모양 두부를 잘라서 정육면체를 한 개 만들려고 한다. 만들 수 있는 가장 큰 정육면체의 겉넓이는 몇 cm²인가?`, s * s * 6, {
        unit: 'cm²', explain: `정육면체의 한 모서리는 두부의 가장 짧은 모서리인 ${s} cm까지 될 수 있다. ${s} × ${s} × 6 = ${s * s * 6}(cm²)`, facts: calc(`${s}*${s}*6`, [6])
      });
    }),
    T('surf-stretch', '모서리를 몇 배로 늘인 정육면체의 겉넓이', '①36 ②81', (d) => {
      const k = d.pick([2, 3]), s = d.int(2, k === 2 ? 5 : 3), t = s * k;
      return N(`한 모서리의 길이가 ${s} cm인 정육면체의 모든 모서리의 길이를 ${k}배로 늘여 새 정육면체를 만들었다. 새 정육면체의 겉넓이는 몇 cm²인가?`, t * t * 6, {
        unit: 'cm²', explain: `새 정육면체의 한 모서리의 길이는 ${s} × ${k} = ${t}(cm)이다. ${t} × ${t} × 6 = ${t * t * 6}(cm²)`, facts: calc(`(${s}*${k})*(${s}*${k})*6`, [6])
      });
    })
  ]);

  // ── 겉넓이로 모서리 구하기 ───────────────────────────────────
  B.addTypes('6-1-6', 'sback', [
    T('sback-cube-edge', '겉넓이로 정육면체의 한 모서리·한 면의 넓이 구하기', '①68 ②73 ③68 심36·42', (d, n) => {
      const s = d.int(3, 10), total = s * s * 6;
      if (n === 1) return N(`겉넓이가 ${total} cm²인 정육면체의 한 면의 넓이는 몇 cm²인가?`, s * s, { unit: 'cm²', explain: `정육면체는 넓이가 같은 면이 6개이다. ${total} ÷ 6 = ${s * s}(cm²)`, facts: calc(`${total}/6`, [6]) });
      return N(`겉넓이가 ${total} cm²인 정육면체의 한 모서리의 길이는 몇 cm인가?`, s, {
        unit: 'cm', explain: `한 면의 넓이는 ${total} ÷ 6 = ${s * s}(cm²)이다. 같은 수를 두 번 곱하여 ${josa(s * s, '이/가')} 되는 수를 찾으면 ${s} × ${s} = ${s * s}이므로 한 모서리의 길이는 ${s} cm이다.`,
        facts: { range: { ineq: `x*x*6>${total - 1}`, lo: 1, hi: 30, want: 'min' } }
      });
    }, { count: 2 }),
    T('sback-side-base', '겉넓이와 옆면의 넓이로 한 밑면의 넓이 구하기', '②77 심45', (d) => {
      const v = three(d, range(3, 9)), base = v[0] * v[1], side = (v[0] + v[1]) * 2 * v[2], total = surf(v);
      return N(`겉넓이가 ${total} cm²이고 옆면 4개의 넓이의 합이 ${side} cm²인 직육면체의 한 밑면의 넓이는 몇 cm²인가?`, base, {
        unit: 'cm²', explain: `겉넓이에서 옆면의 넓이를 빼면 두 밑면의 넓이의 합이 남는다. ${total} − ${side} = ${base * 2}(cm²)이고 밑면은 2개이므로 ${base * 2} ÷ 2 = ${base}(cm²)`, facts: calc(`(${total}-${side})/2`, [2])
      });
    }),
    T('sback-face-surface', '한 면의 넓이로 모서리를 찾아 겉넓이 구하기', '①70 ③72 심52', (d) => {
      const v = three(d, range(3, 9), null, 2.4), [a, b, c] = v, top = a * b;
      return N(`직육면체에서 색칠한 면의 넓이는 ${top} cm²이다. 이 직육면체의 겉넓이는 몇 cm²인가?`, surf(v), {
        unit: 'cm²', figure: boxArt(v, [len(a), null, len(c)], { tint: { 5: YELLOW }, label: `직육면체의 겨냥도. 윗면을 색칠했다. 가로 ${a} cm, 높이 ${c} cm` }),
        explain: `색칠한 면의 가로가 ${a} cm이므로 세로는 ${top} ÷ ${a} = ${b}(cm)이다. 겉넓이는 (${top} + ${b} × ${c} + ${a} × ${c}) × 2 = ${surf(v)}(cm²)이다.`,
        facts: calc(`(${top}+${top}/${a}*${c}+${a}*${c})*2`, [2])
      });
    }),
    T('sback-edges-surface', '모든 모서리의 길이의 합으로 정육면체의 겉넓이 구하기', '②72 ③70 심47', (d) => {
      const s = d.int(3, 10);
      return N(`모든 모서리의 길이의 합이 ${s * 12} cm인 정육면체의 겉넓이는 몇 cm²인가?`, s * s * 6, {
        unit: 'cm²', explain: `정육면체는 길이가 같은 모서리가 12개이므로 한 모서리의 길이는 ${s * 12} ÷ 12 = ${s}(cm)이다. ${s} × ${s} × 6 = ${s * s * 6}(cm²)`, facts: calc(`(${s * 12}/12)*(${s * 12}/12)*6`, [12, 6])
      });
    }),
    T('sback-dice-surface', '정육면체 여러 개를 쌓아 만든 큰 정육면체의 겉넓이', '③75', (d) => {
      const k = d.pick([2, 3]), s = d.int(2, k === 2 ? 5 : 3), count = k * k * k, t = s * k;
      return N(`한 모서리의 길이가 ${s} cm인 정육면체 모양 블록 ${count}개를 빈틈없이 쌓아 큰 정육면체를 만들었다. 큰 정육면체의 겉넓이는 몇 cm²인가?`, t * t * 6, {
        unit: 'cm²', explain: `${k} × ${k} × ${k} = ${count}이므로 큰 정육면체의 한 모서리에는 블록이 ${k}개씩 놓인다. 한 모서리의 길이는 ${s} × ${k} = ${t}(cm)이므로 ${t} × ${t} × 6 = ${t * t * 6}(cm²)`,
        facts: calc(`(${s}*${k})*(${s}*${k})*6`, [k, 6])
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
