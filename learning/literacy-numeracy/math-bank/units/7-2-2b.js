// 중학교 1학년 2학기 2단원 작도와 합동 — 뒤쪽 묶음(삼각형이 하나로 정해지는 조건, 도형의 합동과 합동인 도형의 성질, 삼각형의 합동 조건, 그림에서 합동인 삼각형 찾기와 합동의 활용).
// 단원 틀과 그림 도구, 싣는 기준, 뺀 것과 까닭은 7-2-2a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//
// 이 파일의 얼개
//  - 삼각형의 요소 여섯(세 변, 세 각)을 's0'·'s1'·'s2'·'a0'·'a1'·'a2' 로 적고, 요소 셋이 주어졌을 때 어느 경우인지(SSS·SAS·ASA·AAS·SSA·AAA)를 kindOf 가 가린다.
//    「하나로 정해지는가」와 「합동이 되는가」는 모두 이 판정으로 답을 낸다(SSS·SAS·ASA·AAS 는 되고 SSA·AAA 는 안 된다).
//  - 합동인 두 삼각형 그림은 한 삼각형을 돌리거나 뒤집어 그린다. 둘째 삼각형의 꼭짓점 i 는 첫 삼각형의 꼭짓점 i 에 대응하므로, 이름만 바꿔 붙여도 대응이 어긋나지 않는다.
//  - 수치가 적힌 보기 삼각형은 모두 같은 배율로 그린다(크기를 견줄 수 있게). 합동이 아닌 보기는 수치 하나가 다르다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { N, M, C, lines, box } = B.kit;
  const { V, tagged, claimQ } = B.kit.mid;
  const K = B.kit.m722;
  const { UNIT, T, SYM, sg, cm, jo, pickOne, allQ, RAD, lerp, polar, dirDeg, boxOf, triSAS, triASA, triSSS, sideOf, putAt, scaled, anyLaid, Pic, gridFig, drawTri, shape, sideName, validTri, evenTri, overTri } = K;
  const N1 = ['A', 'B', 'C'], N2 = ['D', 'E', 'F'];

  // ── 삼각형의 요소와 조건의 갈래 ──
  // 변 i 는 꼭짓점 i 의 대변이다. 두 변 i, j 의 끼인각은 나머지 꼭짓점의 각이고, 변 i 의 양 끝 각은 꼭짓점 i 가 아닌 두 각이다.
  const ELEMS = ['s0', 's1', 's2', 'a0', 'a1', 'a2'];
  const isSide = (e) => e[0] === 's', at = (e) => Number(e[1]);
  function kindOf(set) {
    const s = set.filter(isSide).map(at), a = set.filter((e) => !isSide(e)).map(at);
    if (s.length === 3) return 'SSS';
    if (a.length === 3) return 'AAA';
    if (s.length === 2) return a[0] !== s[0] && a[0] !== s[1] ? 'SAS' : 'SSA';
    return a.includes(s[0]) ? 'AAS' : 'ASA';
  }
  const WORKS = { SSS: true, SAS: true, ASA: true, AAS: true, SSA: false, AAA: false };
  const works = (set) => WORKS[kindOf(set)];
  const elem = (e, names) => (isSide(e) ? sg(sideName(names, at(e))) : '∠' + names[at(e)]);
  const told = (e, names) => elem(e, names) + (isSide(e) ? '의 길이' : '의 크기');
  const eq = (e) => `${elem(e, N1)} = ${elem(e, N2)}`;
  // 대응하는 차례로 적은 변의 이름(둘째 삼각형의 이름을 바꿔 붙였을 때)
  const pairName = (names, i) => (i === 0 ? names[1] + names[2] : i === 1 ? names[0] + names[2] : names[0] + names[1]);
  const COND = { SSS: '대응하는 세 변의 길이가 각각 같다. (SSS 합동)', SAS: '대응하는 두 변의 길이가 각각 같고, 그 끼인각의 크기가 같다. (SAS 합동)', ASA: '대응하는 한 변의 길이가 같고, 그 양 끝 각의 크기가 각각 같다. (ASA 합동)' };
  // 합동 조건 고르기
  const condQ = (d, text, key, o) => pickOne(d, text, COND[key], Object.keys(COND).filter((k) => k !== key).map((k) => COND[k]), o);
  // 요소 셋이 조건이 되지 못하는 까닭
  function whyNot(set, names) {
    if (kindOf(set) === 'AAA') return '세 각의 크기가 각각 같아도 변의 길이는 다를 수 있다.';
    const sides = set.filter(isSide), angle = set.find((e) => !isSide(e));
    return `${jo(elem(angle, names), '은/는')} ${elem(sides[0], names)}, ${elem(sides[1], names)}의 끼인각이 아니다.`;
  }
  const ang5 = (d, lo, hi) => d.int(lo / 5, hi / 5) * 5;
  // 두 변과 그 끼인각이 아닌 각: 삼각형이 두 가지 그려지는 수치만 쓴다(주어진 각의 대변 a 가 다른 변 c 보다 짧고 c × sin θ 보다는 길다).
  const ssaNums = (d) => d.until(() => ({ th: d.pick([30, 35, 40, 45, 50]), c: d.int(6, 12), a: d.int(4, 11) }), (x) => x.a <= x.c - 1 && x.c * Math.sin(x.th * RAD) <= x.a - 0.5);
  // 수치로 준 조건 하나: { kind, html, why }
  // 조건 하나하나(「∠C = 40°」)가 줄 끝에서 갈리지 않게 묶는다.
  const numCond = (d, kind) => { const c = numCond0(d, kind); c.html = c.html.split(', ').map((part) => B.kit.mid.nb(part)).join(', '); return c; };
  function numCond0(d, kind) {
    const [u, v, w] = d.shuffle([0, 1, 2]), S = (i, j) => sg([N1[i], N1[j]].sort().join('')), A = (i) => '∠' + N1[i];
    if (kind === 'SSS' || kind === 'SSSx' || kind === 'SSSe') {
      // SSSx: 삼각형이 되지 않는 세 변, SSSe: 그 가운데 두 변의 길이의 합이 가장 긴 변의 길이와 같은 것
      const t = d.shuffle(kind === 'SSS' ? validTri(d) : kind === 'SSSe' || d.bool() ? evenTri(d) : overTri(d)), [a, b, c] = t.slice().sort((x, y) => x - y);
      return { kind, html: `${sg('AB')} = ${cm(t[0])}, ${sg('BC')} = ${cm(t[1])}, ${sg('CA')} = ${cm(t[2])}`,
        why: kind === 'SSS' ? `세 변의 길이가 주어졌고 ${c} &lt; ${a} + ${b}이므로 하나로 정해진다.` : `${a} + ${b} ${a + b === c ? '=' : '&lt;'} ${c}이므로 가장 긴 변의 길이가 나머지 두 변의 길이의 합보다 작지 않다. 삼각형이 그려지지 않는다.` };
    }
    if (kind === 'SAS') {
      const [b, c] = d.until(() => [d.int(4, 10), d.int(4, 10)], ([x, y]) => x !== y), th = ang5(d, 35, 110);
      return { kind, html: `${S(u, v)} = ${cm(c)}, ${S(u, w)} = ${cm(b)}, ${A(u)} = ${th}°`, why: `${A(u)}는 ${S(u, v)}, ${S(u, w)}의 끼인각이다. 두 변의 길이와 그 끼인각의 크기가 주어졌으므로 하나로 정해진다.` };
    }
    if (kind === 'SSA') {
      const x = ssaNums(d);
      return { kind, html: `${S(u, v)} = ${cm(x.c)}, ${S(v, w)} = ${cm(x.a)}, ${A(u)} = ${x.th}°`, why: `${A(u)}는 ${S(u, v)}, ${S(v, w)}의 끼인각이 아니므로 하나로 정해지지 않는다.`, nums: x, roles: [u, v, w] };
    }
    if (kind === 'AAA') {
      const [a, b] = d.until(() => [ang5(d, 30, 90), ang5(d, 30, 90)], ([x, y]) => x !== y && x + y <= 140 && 180 - x - y !== x && 180 - x - y !== y);
      return { kind, html: `∠A = ${a}°, ∠B = ${b}°, ∠C = ${180 - a - b}°`, why: '세 각의 크기만 주어지면 모양은 같고 크기가 다른 삼각형을 얼마든지 그릴 수 있다.' };
    }
    const c = d.int(4, 10);
    if (kind === 'A180') {
      const a = d.pick([100, 110, 120, 130]);
      return { kind, html: `${S(u, v)} = ${cm(c)}, ${A(u)} = ${a}°, ${A(v)} = ${180 - a}°`, why: `${A(u)} + ${A(v)} = 180°이므로 삼각형이 그려지지 않는다.` };
    }
    const [a, b] = d.until(() => [ang5(d, 30, 95), ang5(d, 30, 95)], ([x, y]) => x !== y && x + y <= 145 && 180 - x - y !== x && 180 - x - y !== y);
    if (kind === 'ASA') return { kind, html: `${S(u, v)} = ${cm(c)}, ${A(u)} = ${a}°, ${A(v)} = ${b}°`, why: `${A(u)}, ${A(v)}는 ${S(u, v)}의 양 끝 각이다. 한 변의 길이와 그 양 끝 각의 크기가 주어졌으므로 하나로 정해진다.` };
    // AAS: 한 변과, 한 끝 각과 대각
    return { kind, html: `${A(u)} = ${a}°, ${S(u, v)} = ${cm(c)}, ${A(w)} = ${b}°`, why: `${A(v)} = 180° − (${a}° + ${b}°) = ${180 - a - b}°이므로 ${S(u, v)}의 양 끝 각의 크기를 모두 알 수 있다. 하나로 정해진다.` };
  }

  // ── 라. 삼각형이 하나로 정해지는 조건 ──
  const FIX_TRUE = ['세 변의 길이가 주어진 경우(가장 긴 변의 길이가 나머지 두 변의 길이의 합보다 작다.)', '두 변의 길이와 그 끼인각의 크기가 주어진 경우', '한 변의 길이와 그 양 끝 각의 크기가 주어진 경우'];
  const FIX_FALSE = [['세 각의 크기가 주어진 경우', '세 각의 크기만 주어지면 모양은 같고 크기가 다른 삼각형을 얼마든지 그릴 수 있다.'], ['두 변의 길이와 그 끼인각이 아닌 한 각의 크기가 주어진 경우', '주어진 각이 두 변의 끼인각이 아니면 삼각형이 두 가지로 그려질 수 있다.'],
    ['한 변의 길이와 한 각의 크기가 주어진 경우', '변 하나와 각 하나만으로는 삼각형이 여러 가지로 그려진다.'], ['두 변의 길이가 주어진 경우', '두 변이 벌어진 정도에 따라 삼각형이 여러 가지로 그려진다.'], ['두 각의 크기가 주어진 경우', '두 각의 크기만으로는 변의 길이를 알 수 없어 크기가 다른 삼각형이 그려진다.']];
  const REASON = { SSA: '주어진 각이 두 변의 끼인각이 아니다.', AAA: '세 각의 크기만 주어져 변의 길이를 알 수 없다.', A180: '한 변의 양 끝 각의 크기의 합이 180°이다.', SSSx: '가장 긴 변의 길이가 나머지 두 변의 길이의 합보다 작지 않다.' };
  // 두 변 BC, CA 와 끼인각이 아닌 ∠B: 점 C 를 중심으로 하는 원이 ∠B 의 다른 변과 두 점에서 만난다.
  function ssaFig(p, q, th) {
    const pic = new Pic(), k = 4.5 / p, Bp = [0, 0], Cp = [p * k, 0], half = Math.sqrt(q * q - (p * Math.sin(th * RAD)) ** 2), t1 = (p * Math.cos(th * RAD) - half) * k, t2 = (p * Math.cos(th * RAD) + half) * k;
    const A1 = polar(Bp, t1, th), A2 = polar(Bp, t2, th);
    pic.seg(Bp, Cp).seg(Bp, polar(Bp, t2 + 0.85, th)).seg(Cp, A1, 'dash').seg(Cp, A2, 'dash').arc(Cp, q * k, dirDeg(Cp, A2) - 13, dirDeg(Cp, A1) + 13).dot(A1).dot(A2);
    pic.angle(Bp, Cp, A2, { text: th + '°' }).side(Bp, Cp, cm(p), { away: A2, only: true }).side(Cp, A2, cm(q), { away: Bp, only: true }).name(Bp, 'B', [-0.7, -1]).name(Cp, 'C', [0.7, -1]);
    return pic.svg(`길이가 ${cm(p)}인 선분 BC가 가로로 놓여 있고, 점 B에서 선분 BC와 ${th}°를 이루는 반직선이 비스듬히 올라간다. 점 C를 중심으로 하고 반지름의 길이가 ${cm(q)}인 호가 이 반직선과 두 점에서 만난다. 점 C와 두 점을 각각 이은 점선이 있다.`, { k: 36 });
  }
  B.addTypes(UNIT, 'fixed', [
    T('fixed-words', '삼각형이 하나로 정해지는 경우', '①28', (d) => {
      const want = d.bool();
      return claimQ(d, want ? '다음 중 삼각형이 하나로 정해지는 경우는?' : '다음 중 삼각형이 하나로 정해지는 경우가 아닌 것은?', FIX_TRUE, FIX_FALSE, want);
    }),
    T('fixed-nums', '수치로 준 조건에서 삼각형이 하나로 정해지는 것', '①29 ②25', (d, n) => {
      const good = ['SSS', 'SAS', 'ASA'], bad = ['AAA', 'SSSx', 'SSA'], kinds = n === 0 ? [d.pick(good)].concat(bad) : good.concat([d.pick(bad)]);
      const rows = d.shuffle(kinds.map((k) => numCond(d, k))), want = n === 0;
      const truth = rows.map((r) => r.kind === 'SSS' || r.kind === 'SAS' || r.kind === 'ASA'), at0 = truth.indexOf(want);
      return C(want ? '다음 중 △ABC가 하나로 정해지는 것은?' : '다음 중 △ABC가 하나로 정해지지 않는 것은?', rows.map((r) => r.html), at0, {
        explain: rows[at0].why + (want ? ' 세 각의 크기만 주어진 경우, 가장 긴 변의 길이가 나머지 두 변의 길이의 합보다 작지 않은 경우, 주어진 각이 두 변의 끼인각이 아닌 경우에는 하나로 정해지지 않는다.' : ''),
        facts: { truth, want }
      });
    }, { count: 2 }),
    T('fixed-why', '삼각형이 하나로 정해지지 않는 까닭', '①30', (d, n) => {
      const kind = d.pick(n === 0 ? ['SSA', 'AAA'] : ['A180', 'SSSx']), cond = numCond(d, kind);
      return pickOne(d, '다음 조건이 주어질 때 △ABC는 하나로 정해지지 않는다. 그 까닭으로 알맞은 것은?', REASON[kind], Object.keys(REASON).filter((k) => k !== kind).map((k) => REASON[k]), { figure: lines([cond.html]), explain: cond.why });
    }, { count: 2 }),
    T('fixed-add2', '한 변의 길이가 주어졌을 때 더 필요한 두 조건이 아닌 것', '①31 ②27', (d) => {
      const g = d.pick(['s0', 's1', 's2']), rest = ELEMS.filter((e) => e !== g), pairs = [];
      rest.forEach((x, i) => rest.slice(i + 1).forEach((y) => pairs.push({ set: [x, y], kind: kindOf([g, x, y]) })));
      const kinds = d.shuffle(['SSS', 'SAS', 'ASA', 'AAS']).slice(0, 3), good = kinds.map((k) => d.pick(pairs.filter((p) => p.kind === k))), bad = d.pick(pairs.filter((p) => p.kind === 'SSA'));
      const show = (p) => p.set.map((e) => told(e, N1)).join(', ');
      return pickOne(d, `△ABC에서 ${elem(g, N1)}의 길이가 주어졌을 때, △ABC가 하나로 정해지기 위해 더 필요한 조건이 아닌 것은?`, show(bad), good.map(show), {
        explain: `${show(bad)}가 더 주어지면 두 변의 길이와 한 각의 크기를 알게 되지만, ${whyNot([g].concat(bad.set), N1)} 따라서 △ABC가 하나로 정해지지 않는다.`
          + (kinds.includes('AAS') ? ' 한 변의 길이와 두 각의 크기를 알면 나머지 한 각의 크기도 알 수 있으므로 △ABC가 하나로 정해진다.' : '')
      });
    }),
    T('fixed-add1', '두 변의 길이가 주어졌을 때 더 필요한 조건 하나', '①32 ②26', (d) => {
      const k = d.int(0, 2), given = ['s0', 's1', 's2'].filter((e) => e !== 's' + k), rows = d.shuffle(ELEMS.filter((e) => !given.includes(e))), flags = rows.map((e) => works(given.concat([e])));
      return allQ(d, `△ABC에서 ${elem(given[0], N1)}, ${elem(given[1], N1)}의 길이가 주어졌을 때, 조건 하나를 더하여 △ABC가 하나로 정해지게 하려고 한다. 더할 수 있는 조건을 모두 고른 것은?`, SYM, flags, {
        figure: tagged(rows.map((e) => told(e, N1)), SYM),
        explain: `${elem('s' + k, N1)}의 길이를 더하면 세 변의 길이가, ${elem('a' + k, N1)}의 크기를 더하면 두 변의 길이와 그 끼인각의 크기가 주어진 것이 된다. 나머지 두 각은 두 변의 끼인각이 아니다.`
      });
    }),
    T('fixed-common', '두 경우에 공통으로 넣을 수 있는 조건', '①33', (d) => {
      // ⑴ 한 변과 그 한 끝 각 ⑵ 그 변과 이웃한 다른 변. 공통으로 넣을 수 있는 것은 두 변의 끼인각과 나머지 변이다.
      const [u, v, w] = d.shuffle([0, 1, 2]), one = ['s' + w, 'a' + u], two = ['s' + w, 's' + u], rows = d.shuffle(ELEMS.filter((e) => !one.includes(e) && !two.includes(e))), flags = rows.map((e) => works(one.concat([e])) && works(two.concat([e])));
      const row = (set) => set.map((e) => told(e, N1)).join(', ') + ', ' + box('');
      return allQ(d, '다음 두 경우에 모두 △ABC가 하나로 정해지도록 □ 안에 공통으로 넣을 수 있는 것을 모두 고른 것은?', SYM, flags, {
        figure: tagged([row(one), row(two)], ['⑴', '⑵']) + tagged(rows.map((e) => told(e, N1)), SYM),
        explain: `⑴에는 ${told('s' + v, N1)}(두 변과 그 끼인각), ${told('a' + v, N1)}(한 변과 그 양 끝 각), ${told('a' + w, N1)}(나머지 각을 구할 수 있다)를 넣을 수 있다. ⑵에는 ${told('s' + v, N1)}(세 변), ${told('a' + v, N1)}(두 변과 그 끼인각)를 넣을 수 있다. 두 경우에 모두 넣을 수 있는 것은 ${told('s' + v, N1)}와 ${told('a' + v, N1)}이다.`
      });
    }),
    T('fixed-ssa-add', '하나로 정해지지 않는 조건에 더할 수 있는 조건', '①34', (d) => {
      const cond = numCond(d, 'SSA'), [u, v, w] = cond.roles, rows = d.shuffle(['s' + v, 'a' + v, 'a' + w]);
      return allQ(d, `${cond.html}인 △ABC는 하나로 정해지지 않는다. 조건 하나를 더하여 △ABC가 하나로 정해지게 하려고 할 때, 더할 수 있는 조건을 모두 고른 것은?`, SYM, rows.map(() => true), {
        figure: tagged(rows.map((e) => told(e, N1)), SYM),
        explain: `${told('s' + v, N1)}를 더하면 세 변의 길이가, ${told('a' + v, N1)}를 더하면 두 변의 길이와 그 끼인각의 크기가 주어진 것이 된다. ${told('a' + w, N1)}를 더하면 나머지 한 각인 ∠${N1[v]}의 크기를 구할 수 있으므로 두 변의 길이와 그 끼인각의 크기를 아는 것과 같다. 세 조건 모두 더할 수 있다.`
      });
    }),
    T('fixed-ssa-fig', '두 변의 길이와 그 끼인각이 아닌 각의 크기가 주어졌을 때 그려지는 삼각형의 수', '①35', (d) => {
      const x = ssaNums(d);
      return N(`${sg('BC')} = ${cm(x.c)}, ${sg('CA')} = ${cm(x.a)}, ∠B = ${x.th}°인 △ABC를 작도하려고 한다. 그림과 같이 길이가 ${cm(x.c)}인 선분 BC와 크기가 ${x.th}°인 ∠B를 작도한 다음, 점 C를 중심으로 하고 반지름의 길이가 ${cm(x.a)}인 원을 그렸다. 조건을 만족시키는 △ABC는 모두 몇 개 그릴 수 있는가?`, 2, {
        unit: '개', figure: ssaFig(x.c, x.a, x.th),
        explain: '원이 ∠B의 다른 한 변과 두 점에서 만나므로 점 A가 될 수 있는 점이 2개이다. 두 변의 길이와 그 끼인각이 아닌 한 각의 크기가 주어지면 삼각형이 하나로 정해지지 않는다.',
        facts: { calc: [['2', 0]], unseen: [2] }
      });
    })
  ]);

  // ── 마. 도형의 합동과 합동인 도형의 성질 ──
  const SAME_TRUE = ['합동인 두 도형의 대응변의 길이는 서로 같다.', '합동인 두 도형의 대응각의 크기는 서로 같다.', '합동인 두 도형의 넓이는 서로 같다.', '합동인 두 도형은 모양과 크기가 모두 같다.', '합동인 두 도형의 둘레의 길이는 서로 같다.'];
  const SAME_FALSE = [['넓이가 같은 두 도형은 합동이다.', '넓이가 같아도 모양이 다르면 합동이 아니다.', SAME_TRUE[2]], ['모양이 같은 두 도형은 합동이다.', '모양이 같아도 크기가 다르면 합동이 아니다.', SAME_TRUE[3]],
    ['합동인 두 도형은 모양은 같으나 크기는 다를 수 있다.', '합동인 두 도형은 모양과 크기가 모두 같다.', SAME_TRUE[3]], ['둘레의 길이가 같은 두 삼각형은 합동이다.', '둘레의 길이가 같아도 모양이 다르면 합동이 아니다.', SAME_TRUE[4]],
    ['합동인 두 도형의 대응변의 길이는 같지만 대응각의 크기는 다를 수 있다.', '합동인 두 도형은 대응각의 크기도 서로 같다.', SAME_TRUE[1]]];
  const ALWAYS_TRUE = ['넓이가 같은 두 원', '넓이가 같은 두 정사각형', '둘레의 길이가 같은 두 정삼각형', '한 변의 길이가 같은 두 정삼각형', '반지름의 길이가 같은 두 원', '둘레의 길이가 같은 두 정사각형'];
  const ALWAYS_FALSE = [['넓이가 같은 두 직사각형', '가로 6 cm, 세로 2 cm인 직사각형과 가로 4 cm, 세로 3 cm인 직사각형은 넓이가 같지만 합동이 아니다.'], ['넓이가 같은 두 삼각형', '밑변의 길이와 높이가 각각 같아도 모양이 다른 삼각형이 있다.'],
    ['한 변의 길이가 같은 두 마름모', '변의 길이가 같아도 각의 크기가 다르면 합동이 아니다.'], ['세 각의 크기가 각각 같은 두 삼각형', '세 각의 크기가 각각 같아도 변의 길이가 다르면 합동이 아니다.'],
    ['둘레의 길이가 같은 두 직사각형', '가로 5 cm, 세로 1 cm인 직사각형과 가로 4 cm, 세로 2 cm인 직사각형은 둘레의 길이가 같지만 합동이 아니다.'], ['넓이가 같은 두 직각삼각형', '밑변의 길이와 높이가 서로 다르면 넓이가 같아도 합동이 아니다.'],
    ['한 변의 길이가 같은 두 이등변삼각형', '나머지 변의 길이가 다르면 합동이 아니다.']];
  const TRI_SIDES = [[4, 5, 6], [5, 6, 8], [4, 6, 7], [5, 7, 9], [6, 7, 10], [5, 8, 10]];
  const scrambled = (d) => d.pick([[1, 2, 0], [2, 0, 1], [0, 2, 1], [2, 1, 0], [1, 0, 2]]).map((k) => N2[k]);
  // 합동인 두 삼각형을 나란히 그린다. 둘째 삼각형은 첫 삼각형을 돌리거나 뒤집은 것이고 꼭짓점 i 끼리 대응한다. o.same 이면 같은 방향으로 놓는다.
  // o.first, o.second: drawTri 에 넘길 것(이름·변의 글·각의 글·표시)
  function pairPic(d, t, o) {
    const big = Math.max(sideOf(t, 0), sideOf(t, 1), sideOf(t, 2)), base = scaled(t, (o.size || 3.2) / big);
    const one = anyLaid(d, base), two = o.same ? one : d.until(() => anyLaid(d, base), (x) => x.i !== one.i || x.down !== one.down || x.mirror !== one.mirror);
    const p1 = putAt(one.q, [0, 0]), b1 = boxOf(p1), raw = putAt(two.q, [0, 0]), b2 = boxOf(raw), h = Math.max(b1[3], b2[3]);
    const pic = new Pic();
    drawTri(pic, p1.map((p) => [p[0], p[1] + (h - b1[3]) / 2]), o.first);
    // 변에 길이를 적는 그림은 두 삼각형 사이를 더 띄운다(마주 보는 변의 글이 서로 닿지 않게).
    const gap = o.gap || (Object.keys((o.first || {}).sides || {}).length + Object.keys((o.second || {}).sides || {}).length ? 2.3 : 1.6);
    drawTri(pic, raw.map((p) => [p[0] + b1[2] + gap, p[1] + (h - b2[3]) / 2]), o.second);
    return pic;
  }
  const corr = (names) => `꼭짓점 A와 ${names[0]}, B와 ${names[1]}, C와 ${jo(names[2], '이/가')} 각각 대응한다.`;
  B.addTypes(UNIT, 'cong', [
    T('cong-claims', '합동인 도형에 대한 설명 가리기', '①36 ②28', (d) => {
      const want = d.bool();
      return claimQ(d, want ? '합동인 두 도형에 대한 설명으로 옳은 것은?' : '합동인 두 도형에 대한 설명으로 옳지 않은 것은?', SAME_TRUE, SAME_FALSE, want);
    }),
    T('cong-always', '항상 합동인 두 도형', '①37 심20', (d, n) => claimQ(d, n === 0 ? '다음 중 두 도형이 항상 합동인 것은?' : '다음 중 두 도형이 항상 합동이라고 할 수 없는 것은?', ALWAYS_TRUE, ALWAYS_FALSE, n === 0), { count: 2 }),
    T('match-name', '합동인 두 삼각형에서 대응각과 대응변', '①38 ②29', (d, n) => {
      const [a, b, c] = d.pick(TRI_SIDES), names = scrambled(d), i = d.int(0, 2), others = [0, 1, 2].filter((k) => k !== i);
      const figure = pairPic(d, triSSS(a, b, c), { first: { names: N1 }, second: { names } }).svg('삼각형 ABC와 삼각형 DEF. 삼각형 DEF는 삼각형 ABC를 돌리거나 뒤집어 놓은 것이다.');
      const head = `그림에서 △ABC ≡ △${names.join('')}일 때, `, why = `합동을 기호로 나타낼 때는 대응하는 꼭짓점의 차례로 쓴다. △ABC ≡ △${names.join('')}이므로 ${corr(names)}`;
      if (n === 0) return pickOne(d, `${head}∠${N1[i]}의 대응각은?`, '∠' + names[i], others.map((k) => '∠' + names[k]), { figure, explain: `${why} ∠${N1[i]}의 대응각은 ∠${names[i]}이다.` });
      return pickOne(d, `${head}${sg(pairName(N1, i))}의 대응변은?`, sg(pairName(names, i)), others.map((k) => sg(pairName(names, k))), { figure, explain: `${why} ${sg(pairName(N1, i))}의 대응변은 ${sg(pairName(names, i))}이다.` });
    }, { count: 2 }),
    T('match-symbol', '합동인 두 삼각형을 기호로 나타내기', '②33 ①44', (d) => {
      // 세 변의 길이가 모두 다른 삼각형이므로 대응은 하나뿐이다. 틀린 보기: 글자 차례대로 쓴 것, 기호 = 를 쓴 것, 대응이 어긋난 것
      const sidesOf = d.pick(TRI_SIDES), names = scrambled(d), label = (i) => cm(sidesOf[i]), other = d.until(() => scrambled(d), (x) => x.join('') !== names.join(''));
      const all = { 0: label(0), 1: label(1), 2: label(2) }, said = (nm) => [0, 1, 2].map((i) => `변 ${sideName(nm, i)}의 길이는 ${label(i)}`).join(', ');
      return pickOne(d, '그림의 두 삼각형은 서로 합동이다. 이것을 기호로 바르게 나타낸 것은?', `△ABC ≡ △${names.join('')}`, ['△ABC ≡ △DEF', `△ABC = △${names.join('')}`, `△ABC ≡ △${other.join('')}`], {
        figure: pairPic(d, triSSS(sidesOf[0], sidesOf[1], sidesOf[2]), { first: { names: N1, sides: all }, second: { names, sides: all } }).svg(`삼각형 ABC: ${said(N1)}. 삼각형 DEF: ${said(names)}.`),
        explain: `길이가 같은 변끼리 대응하므로 ${corr(names)} 합동은 기호 ≡를 사용하여 대응하는 꼭짓점의 차례로 쓰므로 △ABC ≡ △${names.join('')}이다. 기호 =는 두 삼각형의 넓이가 같음을 나타낼 때 쓴다.`
      });
    }),
    T('match-size', '합동인 두 삼각형에서 변의 길이와 각의 크기', '①39 ②30 ②31', (d, n) => {
      if (n === 0) {
        // 두 변과 그 끼인각으로 지은 삼각형: 첫 삼각형에 AB 와 ∠A, 둘째 삼각형에 DF 를 적는다.
        const [b, c] = d.until(() => [d.int(4, 9), d.int(5, 11)], ([x, y]) => Math.abs(x - y) >= 2), th = ang5(d, 45, 105);
        return M(`그림에서 △ABC ≡ △DEF일 때, ${sg('AC')}의 길이와 ∠D의 크기를 구하시오.`, [{ label: '선분 AC', answer: b, unit: 'cm' }, { label: '∠D', answer: th, unit: '°' }], {
          figure: pairPic(d, triSAS(b, c, th), { first: { names: N1, sides: { 2: cm(c) }, angles: { 0: th + '°' } }, second: { names: N2, sides: { 1: cm(b) } } }).svg(`삼각형 ABC: 변 AB의 길이는 ${cm(c)}, ∠A의 크기는 ${th}°. 삼각형 DEF: 변 DF의 길이는 ${cm(b)}.`),
          explain: `${sg('AC')}의 대응변은 ${sg('DF')}이므로 ${sg('AC')} = ${cm(b)}이다. ∠D의 대응각은 ∠A이므로 ∠D = ${th}°이다.`,
          facts: { calc: [[String(b), 0], [String(th), 1]] }
        });
      }
      // 한 변과 그 양 끝 각으로 지은 삼각형: 첫 삼각형에 두 각, 둘째 삼각형에 대응변을 적는다. 묻는 각은 나머지 한 각의 대응각이다.
      const c = d.int(5, 11), [a, b] = d.until(() => [ang5(d, 35, 85), ang5(d, 35, 85)], ([x, y]) => x !== y && x + y >= 100 && x + y <= 135 && 180 - x - y !== x && 180 - x - y !== y), names = N2, g = 180 - a - b;
      return M(`그림에서 △ABC ≡ △${names.join('')}일 때, ${sg('AB')}의 길이와 ∠${names[2]}의 크기를 구하시오.`, [{ label: '선분 AB', answer: c, unit: 'cm' }, { label: '∠' + names[2], answer: g, unit: '°' }], {
        figure: pairPic(d, triASA(c, a, b), { first: { names: N1, angles: { 0: a + '°', 1: b + '°' } }, second: { names, sides: { 2: cm(c) } } }).svg(`삼각형 ABC: ∠A의 크기는 ${a}°, ∠B의 크기는 ${b}°. 삼각형 DEF: 변 ${sideName(names, 2)}의 길이는 ${cm(c)}.`),
        explain: `△ABC ≡ △${names.join('')}이므로 ${corr(names)} ${sg('AB')}의 대응변은 ${sg(pairName(names, 2))}이므로 ${sg('AB')} = ${cm(c)}이다. ∠${names[2]}의 대응각은 ∠C이고 ∠C = 180° − (${a}° + ${b}°) = ${g}°이므로 ∠${names[2]} = ${g}°이다.`,
        facts: { calc: [[String(c), 0], [`180-(${a}+${b})`, 1]], unseen: [180] }
      });
    }, { count: 2 }),
    T('match-area', '합동인 두 직각삼각형과 넓이', '①41', (d) => {
      const [p, q, h] = d.pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10], [8, 6, 10], [8, 15, 17], [15, 8, 17]]), area = p * q / 2;
      // ∠C 가 직각, BC = p, AC = q, AB = h
      const t = [[0, q], [p, 0], [0, 0]];
      return N(`그림에서 △ABC ≡ △DEF이고 △DEF의 넓이가 ${area} cm²일 때, ${sg('AC')}의 길이는 몇 cm인가?`, q, {
        unit: 'cm', figure: pairPic(d, t, { first: { names: N1, sides: { 2: cm(h) }, marks: { 2: 'right' } }, second: { names: N2, sides: { 0: cm(p) }, marks: { 2: 'right' } } }).svg(`삼각형 ABC: ∠C에 직각 표시가 있고 변 AB의 길이는 ${cm(h)}. 삼각형 DEF: ∠F에 직각 표시가 있고 변 EF의 길이는 ${cm(p)}.`),
        explain: `△DEF는 ∠F가 직각인 삼각형이므로 넓이는 ${sg('EF')} × ${sg('DF')} ÷ 2이다. ${p} × ${sg('DF')} ÷ 2 = ${area}에서 ${sg('DF')} = ${cm(q)}이다. ${sg('AC')}의 대응변은 ${sg('DF')}이므로 ${sg('AC')} = ${cm(q)}이다.`,
        facts: { calc: [[`${area}*2/${p}`, 0]], unseen: [2] }
      });
    })
  ]);

  // ── 바. 삼각형의 합동 조건 ──
  // 요소 셋의 묶음 스무 가지
  const SETS = [];
  for (let i = 0; i < 6; i += 1) for (let j = i + 1; j < 6; j += 1) for (let k = j + 1; k < 6; k += 1) { const set = [ELEMS[i], ELEMS[j], ELEMS[k]]; SETS.push({ set, kind: kindOf(set) }); }
  const setText = (set) => set.map(eq).join(', ');
  // 수치가 적힌 삼각형(보기 칸). t: 꼭짓점(cm), sides·angles: 적을 수, said: 그림 설명
  const sasSpec = (b, c, th) => ({ t: triSAS(b, c, th), sides: { 1: b, 2: c }, angles: { 0: th }, said: `두 변의 길이가 ${cm(b)}, ${cm(c)}이고 그 끼인각의 크기가 ${th}°인 삼각형` });
  const asaSpec = (c, a, b) => ({ t: triASA(c, a, b), sides: { 2: c }, angles: { 0: a, 1: b }, said: `한 변의 길이가 ${cm(c)}이고 그 양 끝 각의 크기가 ${a}°, ${b}°인 삼각형` });
  const sssSpec = (a, b, c) => ({ t: triSSS(a, b, c), sides: { 0: a, 1: b, 2: c }, angles: {}, said: `세 변의 길이가 ${cm(a)}, ${cm(b)}, ${cm(c)}인 삼각형` });
  // 한 변과, 그 한 끝 각(a)과 대각(g)
  const aasSpec = (c, a, g) => ({ t: triASA(c, a, 180 - a - g), sides: { 2: c }, angles: { 0: a, 2: g }, said: `한 변의 길이가 ${cm(c)}이고 그 한 끝 각의 크기가 ${a}°, 그 변의 대각의 크기가 ${g}°인 삼각형` });
  // 두 변 c, a 와 변 a 의 대각 th(끼인각이 아닌 각). far 이면 두 가지 가운데 큰 삼각형
  function ssaSpec(c, a, th, far) {
    const half = Math.sqrt(a * a - (c * Math.sin(th * RAD)) ** 2), len = c * Math.cos(th * RAD) + (far ? half : -half);
    return { t: [[0, 0], [c, 0], polar([0, 0], len, th)], sides: { 2: c, 0: a }, angles: { 0: th }, said: `두 변의 길이가 ${cm(c)}, ${cm(a)}이고 길이가 ${cm(a)}인 변의 대각의 크기가 ${th}°인 삼각형` };
  }
  const aaaSpec = (a, b, size) => ({ t: triASA(size, a, b), sides: {}, angles: { 0: a, 1: b, 2: 180 - a - b }, said: `세 각의 크기가 ${a}°, ${b}°, ${180 - a - b}°인 삼각형` });
  // 보기 삼각형들을 같은 배율로 놓는다. 돌려주는 것: 놓은 삼각형들과 한 칸(1 cm)의 화소 수
  function laidOut(d, specs, o) {
    const opt = o || {}, placed = specs.map((s) => Object.assign({}, s, { q: anyLaid(d, s.t).q }));
    const k = Math.min(...placed.map((s) => { const b = boxOf(s.q); return Math.min((opt.w || 104) / (b[2] - b[0]), (opt.h || 78) / (b[3] - b[1])); }));
    return { placed, k };
  }
  const specPic = (s, o) => { const opt = o || {}, put = (map, tail) => Object.keys(map).reduce((out, i) => { out[i] = (opt.letters && opt.letters[map[i]] ? opt.letters[map[i]] : map[i]) + tail; return out; }, {}); return drawTri(new Pic(), s.q, { sides: put(s.sides, ' cm'), angles: put(s.angles, '°'), names: s.names }); };
  B.addTypes(UNIT, 'cond', [
    T('cond-name', '수치가 적힌 두 삼각형의 합동 조건', '①48 ②34', (d, n) => {
      if (n === 0) {
        const kind = d.pick(['SSS', 'SAS']);
        if (kind === 'SSS') {
          const s = d.pick(TRI_SIDES), all = { 0: cm(s[0]), 1: cm(s[1]), 2: cm(s[2]) }, said = (nm) => [0, 1, 2].map((i) => `변 ${sideName(nm, i)}의 길이는 ${cm(s[i])}`).join(', ');
          return condQ(d, '그림의 △ABC와 △DEF가 합동임을 설명할 때 이용하는 삼각형의 합동 조건은?', 'SSS', {
            figure: pairPic(d, triSSS(s[0], s[1], s[2]), { first: { names: N1, sides: all }, second: { names: N2, sides: all } }).svg(`삼각형 ABC: ${said(N1)}. 삼각형 DEF: ${said(N2)}.`),
            explain: `${eq('s2')}, ${eq('s0')}, ${eq('s1')}이므로 대응하는 세 변의 길이가 각각 같다. 따라서 △ABC ≡ △DEF (SSS 합동)이다.`
          });
        }
        const [b, c] = d.until(() => [d.int(4, 9), d.int(5, 11)], ([x, y]) => Math.abs(x - y) >= 2), th = ang5(d, 45, 105), part = { sides: { 1: cm(b), 2: cm(c) }, angles: { 0: th + '°' } };
        return condQ(d, '그림의 △ABC와 △DEF가 합동임을 설명할 때 이용하는 삼각형의 합동 조건은?', 'SAS', {
          figure: pairPic(d, triSAS(b, c, th), { first: Object.assign({ names: N1 }, part), second: Object.assign({ names: N2 }, part) }).svg(`삼각형 ABC: 변 AB의 길이는 ${cm(c)}, 변 AC의 길이는 ${cm(b)}, ∠A의 크기는 ${th}°. 삼각형 DEF: 변 DE의 길이는 ${cm(c)}, 변 DF의 길이는 ${cm(b)}, ∠D의 크기는 ${th}°.`),
          explain: `${eq('s2')}, ${eq('s1')}이고 그 끼인각의 크기가 ∠A = ∠D로 같다. 따라서 △ABC ≡ △DEF (SAS 합동)이다.`
        });
      }
      // 둘째 삼각형에는 한 끝 각과 대각이 적혀 있어, 나머지 각을 구해야 양 끝 각이 된다.
      const c = d.int(5, 11), [a, b] = d.until(() => [ang5(d, 35, 85), ang5(d, 35, 85)], ([x, y]) => x !== y && x + y >= 100 && x + y <= 135 && 180 - x - y !== x && 180 - x - y !== y), g = 180 - a - b;
      return N('그림의 △ABC와 △DEF가 합동임을 설명하려고 한다. 이때 먼저 구해야 하는 ∠E의 크기는 몇 도인가?', b, {
        unit: '°', figure: pairPic(d, triASA(c, a, b), { first: { names: N1, sides: { 2: cm(c) }, angles: { 0: a + '°', 1: b + '°' } }, second: { names: N2, sides: { 2: cm(c) }, angles: { 0: a + '°', 2: g + '°' } } })
          .svg(`삼각형 ABC: 변 AB의 길이는 ${cm(c)}, ∠A의 크기는 ${a}°, ∠B의 크기는 ${b}°. 삼각형 DEF: 변 DE의 길이는 ${cm(c)}, ∠D의 크기는 ${a}°, ∠F의 크기는 ${g}°.`),
        explain: `△DEF에서 ∠E = 180° − (${a}° + ${g}°) = ${b}°이다. ${eq('s2')}, ∠A = ∠D, ∠B = ∠E이므로 대응하는 한 변의 길이가 같고, 그 양 끝 각의 크기가 각각 같다. 따라서 △ABC ≡ △DEF (ASA 합동)이다.`,
        facts: { calc: [[`180-(${a}+${g})`, 0]], unseen: [180] }
      });
    }, { count: 2 }),
    T('cond-blank', '두 삼각형이 합동임을 설명하는 과정의 빈칸', '②41', (d) => {
      const [b, c] = d.until(() => [d.int(4, 9), d.int(5, 11)], ([x, y]) => Math.abs(x - y) >= 2), th = ang5(d, 45, 105), names = scrambled(d), part = { sides: { 1: cm(b), 2: cm(c) }, angles: { 0: th + '°' } };
      const other = d.until(() => scrambled(d), (x) => x.join('') !== names.join('')), ask = (side, angle, tri) => `${sg(side)}, ∠${angle}, △${tri}`;
      const rows = ['△ABC와 △DEF에서', `${sg('AB')} = ㈎, ${sg('AC')} = ${sg(pairName(names, 1))}, ∠A = ㈏`, '이므로 대응하는 두 변의 길이가 각각 같고, 그 끼인각의 크기가 같다.', '따라서 △ABC ≡ ㈐ (SAS 합동)'];
      return pickOne(d, '다음은 그림의 두 삼각형이 합동임을 설명하는 과정이다. ㈎, ㈏, ㈐에 알맞은 것을 차례로 나열한 것은?', ask(pairName(names, 2), names[0], names.join('')),
        [ask(pairName(names, 0), names[0], names.join('')), ask(pairName(names, 2), names[1], names.join('')), ask(pairName(names, 2), names[0], other.join(''))], {
          figure: pairPic(d, triSAS(b, c, th), { first: Object.assign({ names: N1 }, part), second: Object.assign({ names }, part) })
            .svg(`삼각형 ABC: 변 AB의 길이는 ${cm(c)}, 변 AC의 길이는 ${cm(b)}, ∠A의 크기는 ${th}°. 삼각형 DEF: 변 ${sideName(names, 2)}의 길이는 ${cm(c)}, 변 ${sideName(names, 1)}의 길이는 ${cm(b)}, ∠${names[0]}의 크기는 ${th}°.`) + lines(rows),
          explain: `길이가 ${cm(c)}인 변끼리, 길이가 ${cm(b)}인 변끼리 대응하고 그 끼인각의 크기가 ${th}°로 같다. ${sg('AB')} = ${sg(pairName(names, 2))}, ${sg('AC')} = ${sg(pairName(names, 1))}, ∠A = ∠${names[0]}이므로 △ABC ≡ △${names.join('')} (SAS 합동)이다.`
        });
    }),
    T('cond-sets', '기호로 쓴 조건에서 두 삼각형이 합동이 되는 것', '①42 ②38', (d, n) => {
      const of = (kind) => d.pick(SETS.filter((s) => s.kind === kind));
      if (n === 0) {
        const bad = of(d.pick(['SSA', 'SSA', 'AAA'])), good = d.shuffle(['SSS', 'SAS', 'ASA', 'AAS']).slice(0, 3).map(of);
        return pickOne(d, '다음 중 △ABC와 △DEF가 합동이 되는 조건이 아닌 것은?', setText(bad.set), good.map((s) => setText(s.set)), {
          explain: whyNot(bad.set, N1) + ' 따라서 두 삼각형이 합동이라고 할 수 없다.' + (good.some((s) => s.kind === 'AAS') ? ' 한 변의 길이가 같고 두 각의 크기가 각각 같으면 나머지 한 각의 크기도 같으므로 ASA 합동이다.' : '')
        });
      }
      const good = of(d.pick(['SAS', 'ASA', 'AAS'])), bad = d.until(() => [of('SSA'), of('SSA'), of('AAA')], ([x, y]) => x !== y);
      return pickOne(d, '다음 중 △ABC ≡ △DEF가 되는 조건은?', setText(good.set), bad.map((s) => setText(s.set)), {
        explain: (good.kind === 'SAS' ? '대응하는 두 변의 길이가 각각 같고 그 끼인각의 크기가 같으므로 SAS 합동이다.' : good.kind === 'ASA' ? '대응하는 한 변의 길이가 같고 그 양 끝 각의 크기가 각각 같으므로 ASA 합동이다.' : '두 각의 크기가 각각 같으면 나머지 한 각의 크기도 같다. 대응하는 한 변의 길이가 같고 그 양 끝 각의 크기가 각각 같으므로 ASA 합동이다.')
          + ' 같은 각이 두 변의 끼인각이 아닌 경우와 세 각의 크기만 각각 같은 경우에는 합동이라고 할 수 없다.'
      });
    }, { count: 2 }),
    T('cond-pick', '주어진 삼각형과 합동인 삼각형 고르기', '①43 ②36', (d, n) => {
      // 합동이 아닌 보기는 수치 하나가 다르다(끼인각, 한 변, 한 끝 각).
      let specs, why;
      if (n === 0) {
        const [b, c] = d.until(() => [d.int(4, 7), d.int(5, 8)], ([x, y]) => y - x >= 1), th = ang5(d, 40, 70), turnBy = d.pick([10, 15]);
        specs = [sasSpec(b, c, th), sasSpec(b, c, th), sasSpec(b, c, th + turnBy), sasSpec(b + 1, c, th), sasSpec(b, c - 1, th)];
        why = `두 변의 길이가 각각 ${cm(b)}, ${cm(c)}이고 그 끼인각의 크기가 ${th}°인 삼각형이 주어진 삼각형과 합동이다(SAS 합동).`;
      } else {
        const c = d.int(5, 8), [a, b] = d.until(() => [ang5(d, 40, 70), ang5(d, 40, 70)], ([x, y]) => x < y && x + y >= 100 && x + y <= 125);
        specs = [asaSpec(c, a, b), asaSpec(c, a, b), asaSpec(c, a, b + 10), asaSpec(c + 1, a, b), asaSpec(c, a - 10, b)];
        why = `한 변의 길이가 ${cm(c)}이고 그 양 끝 각의 크기가 각각 ${a}°, ${b}°인 삼각형이 주어진 삼각형과 합동이다(ASA 합동).`;
      }
      const order = d.shuffle([1, 2, 3, 4]), out = laidOut(d, specs), cells = order.map((i, k) => ({ tag: SYM[k], pic: specPic(out.placed[i]) })), hit = order.indexOf(1);
      return C('다음 ㉠~㉣ 가운데 맨 위의 삼각형과 합동인 것은?', SYM.slice(0, 4), hit, {
        figure: gridFig(cells, '맨 위에 주어진 삼각형: ' + specs[0].said + '. ' + order.map((i, k) => `${SYM[k]}: ${specs[i].said}`).join('. ') + '.', { k: out.k, head: specPic(out.placed[0]) }),
        explain: `${why} ${SYM[hit]}만 세 수치가 모두 같고 놓인 자리도 같다.`,
        facts: { truth: order.map((i) => i === 1), want: true, rule: n === 0 ? 'pick-sas' : 'pick-asa' }
      });
    }, { count: 2 }),
    T('cond-pairs', '여러 삼각형에서 합동인 것끼리 짝 짓기', '①44 ②35', (d) => {
      // 세 쌍: 세 변(SSS), 두 변과 끼인각(SAS), 한 변과 양 끝 각(ASA — 한쪽은 나머지 각을 구해야 한다). 두 변과 끼인각의 수치(변 하나와 각)를 셋째 쌍과 같게 두어 헷갈리게 한다.
      const sss = d.pick([[3, 4, 5], [4, 5, 6], [3, 5, 6]]), [b, c] = d.pick([[4, 6], [5, 7], [4, 7]]), a = d.pick([40, 45, 50]), b2 = d.pick([60, 65, 70]), g = 180 - a - b2;
      const specs = [sssSpec(sss[0], sss[1], sss[2]), sssSpec(sss[1], sss[2], sss[0]), sasSpec(b, c, a), sasSpec(c, b, a), asaSpec(c, a, b2), aasSpec(c, a, g)];
      const order = d.shuffle([0, 1, 2, 3, 4, 5]), tagOf = (i) => SYM[order.indexOf(i)], out = laidOut(d, specs, { w: 100, h: 70 }), pair = (i, j, key) => { const [x, y] = [tagOf(i), tagOf(j)].sort(); return `${jo(x, '과/와')} ${y}, ${key} 합동`; };
      const truths = [[0, 1, 'SSS'], [2, 3, 'SAS'], [4, 5, 'ASA']], pickAt = d.int(0, 2), right = truths[pickAt], other = truths[(pickAt + 1) % 3], wrongKey = d.pick(['SSS', 'SAS', 'ASA'].filter((k) => k !== other[2]));
      return pickOne(d, '다음 삼각형 가운데 서로 합동인 두 삼각형과 그 합동 조건을 바르게 짝 지은 것은?', pair(right[0], right[1], right[2]), [pair(other[0], other[1], wrongKey), pair(2, 4, 'SAS'), pair(d.pick([0, 1]), d.pick([3, 5]), d.pick(['SSS', 'ASA']))], {
        figure: gridFig(order.map((i, k) => ({ tag: SYM[k], pic: specPic(out.placed[i]) })), order.map((i, k) => `${SYM[k]}: ${specs[i].said}`).join('. ') + '.', { k: out.k }),
        explain: `${jo(tagOf(0), '과/와')} ${jo(tagOf(1), '은/는')} 세 변의 길이가 각각 같으므로 SSS 합동, ${jo(tagOf(2), '과/와')} ${jo(tagOf(3), '은/는')} 두 변의 길이가 각각 같고 그 끼인각의 크기가 같으므로 SAS 합동이다. ${tagOf(5)}의 나머지 한 각의 크기는 180° − (${a}° + ${g}°) = ${b2}°이므로 ${jo(tagOf(4), '과/와')} ${jo(tagOf(5), '은/는')} 한 변의 길이가 같고 그 양 끝 각의 크기가 각각 같아 ASA 합동이다.`
      });
    }),
    T('cond-add1', '합동이 되기 위해 더 필요한 조건 하나', '①45 ①46 ②39 심23 심24', (d, n) => {
      const i = d.int(0, 2), j = d.pick([0, 1, 2].filter((k) => k !== i)), given = n === 0 ? ['s' + i, 's' + j] : ['s' + i, 'a' + j], rows = d.shuffle(ELEMS.filter((e) => !given.includes(e))), flags = rows.map((e) => works(given.concat([e])));
      const part = n === 0 ? { ticks: { [i]: 1, [j]: 2 } } : { ticks: { [i]: 1 }, marks: { [j]: 'arc' } }, t = triSSS(5, 6.2, 7.3);
      const said = n === 0 ? `변 ${sideName(N1, i)}와 변 ${sideName(N2, i)}에 같은 표시(한 줄), 변 ${sideName(N1, j)}와 변 ${sideName(N2, j)}에 같은 표시(두 줄)가 있다.` : `변 ${sideName(N1, i)}와 변 ${sideName(N2, i)}에 같은 표시(한 줄), ∠${N1[j]}와 ∠${N2[j]}에 같은 표시(호)가 있다.`;
      const why = rows.map((e, k) => { const kind = kindOf(given.concat([e])); return `${jo(SYM[k], '을/를')} 더하면 ${kind === 'SSA' ? '같은 각이 두 변의 끼인각이 아니므로 합동이라고 할 수 없다.' : kind === 'AAS' ? '나머지 한 각의 크기도 같아지므로 ASA 합동이다.' : kind + ' 합동이다.'}`; }).join(' ');
      return allQ(d, `그림의 △ABC와 △DEF에서 ${eq(given[0])}, ${eq(given[1])}일 때, 조건 하나를 더하여 △ABC ≡ △DEF가 되게 하려고 한다. 더할 수 있는 조건을 모두 고른 것은?`, SYM, flags, {
        figure: pairPic(d, t, { same: true, first: Object.assign({ names: N1 }, part), second: Object.assign({ names: N2 }, part) }).svg(`삼각형 ABC와 삼각형 DEF가 같은 방향으로 놓여 있다. ${said}`) + tagged(rows.map(eq), SYM), explain: why
      });
    }, { count: 2 }),
    T('cond-add2', '합동이 되기 위해 더 필요한 두 조건이 아닌 것', '①47 ②40', (d, n) => {
      const g = n === 0 ? d.pick(['s0', 's1', 's2']) : d.pick(['a0', 'a1', 'a2']), rest = ELEMS.filter((e) => e !== g), pairs = [];
      rest.forEach((x, i) => rest.slice(i + 1).forEach((y) => pairs.push({ set: [x, y], kind: kindOf([g, x, y]) })));
      const kinds = d.shuffle(n === 0 ? ['SSS', 'SAS', 'ASA', 'AAS'] : ['SAS', 'ASA', 'AAS']).slice(0, 3), good = kinds.map((k) => d.pick(pairs.filter((p) => p.kind === k))), bad = d.pick(pairs.filter((p) => !WORKS[p.kind]));
      const show = (p) => p.set.map(eq).join(', ');
      return pickOne(d, `△ABC와 △DEF에서 ${eq(g)}일 때, △ABC ≡ △DEF가 되기 위해 더 필요한 두 조건이 아닌 것은?`, show(bad), good.map(show), {
        explain: `${eq(g)}, ${show(bad)}이면 ${bad.kind === 'AAA' ? '세 각의 크기가 각각 같을 뿐이다. ' : ''}${whyNot([g].concat(bad.set), N1)} 따라서 두 삼각형이 합동이라고 할 수 없다.`
      });
    }, { count: 2 })
  ]);

  // ── 사. 그림에서 합동인 삼각형 찾기와 합동의 활용 ──
  const eqs = (x, y) => `${sg(x)} = ${sg(y)}`;
  const kitePts = { A: [0, 2.5], B: [-2.1, 1.5], D: [2.1, 1.5], C: [0, -2.1] };
  const kiteFig = () => shape({ pts: kitePts, segs: ['AB', 'AD', 'BC', 'DC', 'AC'], ticks: { AB: 1, AD: 1, BC: 2, DC: 2 } }).svg('사각형 ABCD와 대각선 AC. 점 A는 위, 점 B는 왼쪽, 점 D는 오른쪽, 점 C는 아래에 있다. 변 AB와 변 AD에 같은 표시(한 줄), 변 BC와 변 DC에 같은 표시(두 줄)가 있다.');
  const paraPts = { A: [1.1, 2.5], D: [5.4, 2.5], B: [0, 0], C: [4.3, 0] };
  const paraFig = (ticks, said) => shape({ pts: paraPts, segs: ['AB', 'BC', 'DC', 'AD', 'AC'], ticks }).svg('사각형 ABCD와 대각선 AC. 점 A는 왼쪽 위, 점 D는 오른쪽 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래에 있다.' + said);
  // 두 선분이 점 O 에서 만나는 그림: 선분 pq 와 선분 rs. 삼각형 pOr 와 삼각형 qOs 가 생긴다.
  function bowFig(p, q, r, s, said) {
    const O = [0, 0], pts = { O, [p]: polar(O, 2.7, 150), [q]: polar(O, 2.7, -30), [r]: polar(O, 1.8, 215), [s]: polar(O, 1.8, 35) };
    return shape({ pts, segs: [p + q, r + s, p + r, q + s], ticks: { [p + 'O']: 1, ['O' + q]: 1, [r + 'O']: 2, ['O' + s]: 2 } })
      .svg(`선분 ${p}${q}와 선분 ${r}${s}가 점 O에서 만난다. 선분 ${p}${r}와 선분 ${q}${s}가 그어져 삼각형 ${p}O${r}와 삼각형 ${q}O${s}가 있다. 선분 ${p}O와 선분 ${q}O에 같은 표시(한 줄), 선분 ${r}O와 선분 ${s}O에 같은 표시(두 줄)가 있다.${said || ''}`);
  }
  // 한 꼭짓점 v 에서 나간 두 변 위에 가까운 점과 먼 점이 하나씩 있고, 엇갈린 두 선분이 그어진 그림. n1·f1: 아래쪽 변의 가까운 점·먼 점, n2·f2: 위쪽 변의 가까운 점·먼 점. 선분 n1–f2, n2–f1
  function fanFig(v, n1, f1, n2, f2, o) {
    const O = [0, 0], pts = { [v]: O, [n1]: polar(O, 2.3, 6), [f1]: polar(O, 4.4, 6), [n2]: polar(O, 2.3, 50), [f2]: polar(O, 4.4, 50) };
    return shape(Object.assign({ pts, segs: [v + f1, v + f2, n1 + f2, n2 + f1], dots: n1 + n2 }, o)).svg(`점 ${v}에서 나간 두 반직선이 있다. 아래쪽 반직선 위에 점 ${n1}, ${f1}가, 위쪽 반직선 위에 점 ${n2}, ${f2}가 점 ${v}에서 가까운 차례로 있다. 선분 ${n1}${f2}와 선분 ${n2}${f1}가 서로 엇갈린다. ` + o.said);
  }
  const equiPts = (s) => ({ A: [s / 2, s * Math.sqrt(3) / 2], B: [0, 0], C: [s, 0] });
  // 정삼각형 ABC 의 변 BC 위의 점 D, 변 CA 위의 점 E (BD = CE = x × 한 변)
  function equiTwo(x) { const s = 4.2, P = equiPts(s); P.D = [x * s, 0]; P.E = lerp(P.C, P.A, x); return P; }
  B.addTypes(UNIT, 'find', [
    T('find-kite', '공통인 변이 있는 두 삼각형: 세 변의 길이가 각각 같다', '①50 ②42 ②43', (d, n) => {
      if (n === 0) {
        return pickOne(d, `그림의 사각형 ABCD에서 ${eqs('AB', 'AD')}, ${eqs('BC', 'DC')}일 때, 서로 합동인 두 삼각형을 기호 ≡를 사용하여 바르게 나타낸 것은?`, '△ABC ≡ △ADC', ['△ABC ≡ △ACD', '△ABC ≡ △CDA', '△ABC ≡ △DAC'], {
          figure: kiteFig(), explain: `△ABC와 △ADC에서 ${eqs('AB', 'AD')}, ${eqs('BC', 'DC')}, ${sg('AC')}는 공통이므로 대응하는 세 변의 길이가 각각 같다. 꼭짓점 A와 A, B와 D, C와 C가 대응하므로 △ABC ≡ △ADC (SSS 합동)이다.`
        });
      }
      const rows = ['△ABC와 △CDA에서', `${sg('AB')} = ㈎, ${sg('BC')} = ㈏, ${sg('AC')}는 공통`, '이므로 대응하는 세 변의 길이가 각각 같다.', '따라서 △ABC ≡ △CDA (㈐ 합동)'], ask = (x, y, k) => `${sg(x)}, ${sg(y)}, ${k}`;
      return pickOne(d, `다음은 그림의 사각형 ABCD에서 ${eqs('AB', 'DC')}, ${eqs('AD', 'BC')}일 때, △ABC ≡ △CDA임을 설명하는 과정이다. ㈎, ㈏, ㈐에 알맞은 것을 차례로 나열한 것은?`, ask('CD', 'DA', 'SSS'), [ask('CD', 'DA', 'SAS'), ask('DA', 'CD', 'SSS'), ask('CD', 'DA', 'ASA')], {
        figure: paraFig({ AB: 1, DC: 1, AD: 2, BC: 2 }, ' 변 AB와 변 DC에 같은 표시(한 줄), 변 AD와 변 BC에 같은 표시(두 줄)가 있다.') + lines(rows),
        explain: `△ABC와 △CDA에서 꼭짓점 A와 C, B와 D, C와 A가 대응한다. ${eqs('AB', 'CD')}, ${eqs('BC', 'DA')}, ${sg('AC')}는 공통이므로 대응하는 세 변의 길이가 각각 같다. 따라서 SSS 합동이다.`
      });
    }, { count: 2 }),
    T('find-bowtie', '서로를 이등분하는 두 선분이 만드는 두 삼각형', '①49 ②42', (d, n) => {
      const fig = bowFig('A', 'B', 'C', 'D'), why = `${eqs('AO', 'BO')}, ${eqs('CO', 'DO')}이고 ∠AOC = ∠BOD(맞꼭지각)이므로 대응하는 두 변의 길이가 각각 같고, 그 끼인각의 크기가 같다. 따라서 △AOC ≡ △BOD (SAS 합동)이다.`;
      if (n === 0) return condQ(d, '그림에서 점 O는 선분 AB와 선분 CD의 중점이다. △AOC ≡ △BOD임을 설명할 때 이용하는 삼각형의 합동 조건은?', 'SAS', { figure: fig, explain: why });
      const yes = d.shuffle([eqs('AO', 'BO'), eqs('AC', 'BD'), '∠OAC = ∠OBD', '∠AOC = ∠BOD', '△AOC ≡ △BOD', '∠OCA = ∠ODB']).slice(0, 3), bad = d.pick([[eqs('AO', 'CO'), `${sg('AO')}와 ${sg('CO')}의 길이는 같다고 할 수 없다.`], ['∠OAC = ∠ODB', '∠OAC의 대응각은 ∠OBD이다.'], [eqs('AC', 'CO'), `${sg('AC')}와 ${sg('CO')}의 길이는 같다고 할 수 없다.`]]);
      return pickOne(d, '그림에서 점 O는 선분 AB와 선분 CD의 중점이다. 다음 중 옳지 않은 것은?', bad[0], yes, { figure: fig, explain: `${why} 합동인 두 삼각형에서 대응변의 길이와 대응각의 크기는 각각 같다. ${bad[1]}` });
    }, { count: 2 }),
    T('find-parallel', '평행선의 엇각과 공통인 변', '①51 ②42', (d, n) => {
      if (n === 0) {
        return condQ(d, `그림의 사각형 ABCD에서 ${sg('AD')} ∥ ${sg('BC')}, ${eqs('AD', 'BC')}이다. 평행선에서 엇각의 크기가 같음을 이용하여 △ABC ≡ △CDA임을 설명할 때, 이용하는 삼각형의 합동 조건은?`, 'SAS', {
          figure: paraFig({ AD: 2, BC: 2 }, ' 변 AD와 변 BC에 같은 표시(두 줄)가 있다.'),
          explain: `${eqs('BC', 'DA')}, ${sg('AC')}는 공통이고, ${sg('AD')} ∥ ${sg('BC')}이므로 ∠ACB = ∠CAD(엇각)이다. 대응하는 두 변의 길이가 각각 같고 그 끼인각의 크기가 같으므로 △ABC ≡ △CDA (SAS 합동)이다.`
        });
      }
      // 평행사변형의 「마주 보는 변의 길이가 같다」(초등)를 쓰면 SSS 로도 설명되므로, 엇각을 이용한 설명임을 문제에 밝힌다.
      return condQ(d, `그림의 사각형 ABCD에서 ${sg('AB')} ∥ ${sg('DC')}, ${sg('AD')} ∥ ${sg('BC')}이다. 평행선에서 엇각의 크기가 같음을 이용하여 △ABC ≡ △CDA임을 설명할 때, 이용하는 삼각형의 합동 조건은?`, 'ASA', {
        figure: paraFig({}, ''),
        explain: `${sg('AC')}는 공통이고, ${sg('AB')} ∥ ${sg('DC')}이므로 ∠BAC = ∠DCA(엇각), ${sg('AD')} ∥ ${sg('BC')}이므로 ∠ACB = ∠CAD(엇각)이다. 대응하는 한 변의 길이가 같고 그 양 끝 각의 크기가 각각 같으므로 △ABC ≡ △CDA (ASA 합동)이다.`
      });
    }, { count: 2 }),
    T('find-extend', '평행사변형과 연장선이 만드는 두 삼각형', '①52', (d) => {
      const pts = { F: [2.4, 4.6], A: [1.2, 2.3], E: [3.1, 2.3], D: [5.0, 2.3], B: [0, 0], C: [3.8, 0] };
      return condQ(d, '그림의 평행사변형 ABCD에서 점 E는 변 AD의 중점이고, 점 F는 변 BA의 연장선과 선분 CE의 연장선의 교점이다. △AEF ≡ △DEC임을 설명할 때 이용하는 삼각형의 합동 조건은?', 'ASA', {
        figure: shape({ pts, segs: ['BF', 'BC', 'CD', 'AD', 'CF'], ticks: { AE: 1, ED: 1 }, dirs: { A: [-1, 0.2], E: [0.9, 0.55] } }).svg('평행사변형 ABCD. 점 A는 왼쪽 위, 점 D는 오른쪽 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래에 있다. 변 AD 위의 점 E에서 선분 AE와 선분 ED에 같은 표시가 있다. 변 BA를 점 A 너머로 늘인 선과 선분 CE를 점 E 너머로 늘인 선이 점 F에서 만난다.'),
        explain: `${eqs('AE', 'DE')}, ∠AEF = ∠DEC(맞꼭지각)이고, ${sg('BF')} ∥ ${sg('DC')}이므로 ∠EAF = ∠EDC(엇각)이다. 대응하는 한 변의 길이가 같고 그 양 끝 각의 크기가 각각 같으므로 △AEF ≡ △DEC (ASA 합동)이다.`
      });
    }),
    T('find-common-asa', '공통인 각이 있는 두 삼각형: 설명의 빈칸', '①53 ②44', (d) => {
      const rows = ['△ABC와 △ADE에서', `${eqs('AB', 'AD')}, ∠ABC = ∠ADE, ㈎는 공통`, '이므로 대응하는 한 변의 길이가 같고, 그 양 끝 각의 크기가 각각 같다.', '따라서 △ABC ≡ △ADE (㈏ 합동)'];
      return pickOne(d, `다음은 그림에서 ${eqs('AB', 'AD')}, ∠ABC = ∠ADE일 때, △ABC ≡ △ADE임을 설명하는 과정이다. ㈎, ㈏에 알맞은 것을 차례로 나열한 것은?`, '∠A, ASA', ['∠A, SAS', '∠C, ASA', '∠A, SSS'], {
        figure: fanFig('A', 'B', 'E', 'D', 'C', { ticks: { AB: 1, AD: 1 }, angs: [['ABC', '', 'arc'], ['ADE', '', 'arc']], said: '선분 AB와 선분 AD에 같은 표시(한 줄), ∠ABC와 ∠ADE에 같은 표시(호)가 있다.' }) + lines(rows),
        explain: `∠A는 두 삼각형에 공통인 각이다. ${sg('AB')}의 양 끝 각은 ∠A와 ∠ABC이고 ${sg('AD')}의 양 끝 각은 ∠A와 ∠ADE이므로, 대응하는 한 변의 길이가 같고 그 양 끝 각의 크기가 각각 같다. 따라서 ASA 합동이다.`
      });
    }),
    T('find-common-sas', '공통인 각이 있는 두 삼각형: 두 변과 끼인각', '①54 ②45 심27 심29', (d, n) => {
      if (n === 0) {
        return pickOne(d, `그림에서 ${eqs('AB', 'AC')}, ${eqs('AD', 'AE')}일 때, △ABD와 합동인 삼각형을 기호 ≡를 사용하여 바르게 나타낸 것은?`, '△ABD ≡ △ACE', ['△ABD ≡ △AEC', '△ABD ≡ △CAE', '△ABD ≡ △ECA'], {
          figure: fanFig('A', 'E', 'B', 'D', 'C', { ticks: { AE: 1, AD: 1 }, said: '선분 AE와 선분 AD에 같은 표시(한 줄)가 있다.' }),
          explain: `△ABD와 △ACE에서 ${eqs('AB', 'AC')}, ${eqs('AD', 'AE')}이고 ∠A는 공통이므로 대응하는 두 변의 길이가 각각 같고, 그 끼인각의 크기가 같다. 꼭짓점 A와 A, B와 C, D와 E가 대응하므로 △ABD ≡ △ACE (SAS 합동)이다.`
        });
      }
      const yes = d.shuffle([eqs('OB', 'OD'), eqs('AD', 'CB'), '∠OAD = ∠OCB', '∠ODA = ∠OBC', '△OAD ≡ △OCB']).slice(0, 3), bad = d.pick([[eqs('OA', 'AB'), `${sg('OA')}와 ${sg('AB')}의 길이는 같다고 할 수 없다.`], [eqs('AD', 'OD'), `${sg('AD')}와 ${sg('OD')}의 길이는 같다고 할 수 없다.`], ['∠OAD = ∠OBC', '∠OAD의 대응각은 ∠OCB이다.']]);
      return pickOne(d, `그림에서 ${eqs('OA', 'OC')}, ${eqs('AB', 'CD')}일 때, 다음 중 옳지 않은 것은?`, bad[0], yes, {
        figure: fanFig('O', 'A', 'B', 'C', 'D', { ticks: { OA: 1, OC: 1, AB: 2, CD: 2 }, said: '선분 OA와 선분 OC에 같은 표시(한 줄), 선분 AB와 선분 CD에 같은 표시(두 줄)가 있다.' }),
        explain: `${sg('OB')} = ${sg('OA')} + ${sg('AB')}, ${sg('OD')} = ${sg('OC')} + ${sg('CD')}이므로 ${eqs('OB', 'OD')}이다. △OAD와 △OCB에서 ${eqs('OA', 'OC')}, ${eqs('OD', 'OB')}, ∠O는 공통이므로 △OAD ≡ △OCB (SAS 합동)이다. ${bad[1]}`
      });
    }, { count: 2 }),
    T('find-bisector', '선분의 수직이등분선 위의 점: 설명의 빈칸', '①56', (d) => {
      const pic = shape({ pts: { P: [0, 3.0], A: [-2.1, 0], M: [0, 0], B: [2.1, 0] }, segs: ['AB', 'PA', 'PB'], ticks: { AM: 1, MB: 1 }, angs: [['PMB', '', 'right']], dirs: { M: [-0.75, -1], P: [-1, 0.5] } });
      pic.seg([0, -0.75], [0, 3.85]).name([0, 3.85], 'l', [0.9, 0.3], { italic: true });
      const rows = ['△PAM과 △PBM에서', `${eqs('AM', 'BM')}, ∠PMA = ㈎ = 90°, ${sg('PM')}은 공통`, '이므로 대응하는 두 변의 길이가 각각 같고, 그 끼인각의 크기가 같다.', `따라서 △PAM ≡ ㈏이므로 ${eqs('PA', 'PB')}이다.`];
      return pickOne(d, `다음은 점 P가 선분 AB의 수직이등분선 ${V('l')} 위의 한 점일 때, ${eqs('PA', 'PB')}임을 설명하는 과정이다. ㈎, ㈏에 알맞은 것을 차례로 나열한 것은?`, '∠PMB, △PBM', ['∠PBM, △PBM', '∠PMB, △PMB', '∠MPB, △BPM'], {
        figure: pic.svg('가로로 놓인 선분 AB와 그 중점 M. 점 M을 지나고 선분 AB에 수직인 직선 l 위에 점 P가 있다. 선분 AM과 선분 BM에 같은 표시가 있고, 점 M에 직각 표시가 있다. 선분 PA와 선분 PB가 그어져 있다.') + lines(rows),
        explain: `직선 ${V('l')}이 선분 AB에 수직이므로 ∠PMA = ∠PMB = 90°이다. ${eqs('AM', 'BM')}, ${sg('PM')}은 공통이므로 △PAM ≡ △PBM (SAS 합동)이다. 꼭짓점 P와 P, A와 B, M과 M이 대응한다.`
      });
    }),
    T('find-rect-mid', '직사각형의 한 변의 중점이 만드는 두 삼각형', '①57', (d) => {
      const pts = { A: [0, 2.6], E: [2.2, 2.6], D: [4.4, 2.6], B: [0, 0], C: [4.4, 0] };
      return pickOne(d, '그림의 직사각형 ABCD에서 점 E는 변 AD의 중점이다. △ABE와 합동인 삼각형을 기호 ≡를 사용하여 바르게 나타낸 것은?', '△ABE ≡ △DCE', ['△ABE ≡ △DEC', '△ABE ≡ △CDE', '△ABE ≡ △ECD'], {
        figure: shape({ pts, segs: ['AB', 'BC', 'CD', 'AD', 'BE', 'CE'], ticks: { AE: 1, ED: 1 } }).svg('직사각형 ABCD. 점 A는 왼쪽 위, 점 D는 오른쪽 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래에 있다. 변 AD 위의 점 E에서 선분 AE와 선분 ED에 같은 표시가 있다. 선분 BE와 선분 CE가 그어져 있다.'),
        explain: `△ABE와 △DCE에서 ${eqs('AB', 'DC')}, ${eqs('AE', 'DE')}, ∠A = ∠D = 90°이므로 대응하는 두 변의 길이가 각각 같고, 그 끼인각의 크기가 같다. 꼭짓점 A와 D, B와 C, E와 E가 대응하므로 △ABE ≡ △DCE (SAS 합동)이다.`
      });
    }),
    T('find-square-angles', '정사각형에서 크기가 같은 두 각이 만드는 합동', '①58', (d) => {
      const s = d.int(7, 12), e = d.int(2, Math.floor(s / 2) - 1), u = 3.5, cut = u * e / s;
      const pts = { A: [0, u], D: [u, u], B: [0, 0], C: [u, 0], E: [0, u - cut], F: [u - cut, 0] };
      return N(`그림의 정사각형 ABCD에서 ∠ADE = ∠CDF이다. ${sg('AD')} = ${cm(s)}, ${sg('AE')} = ${cm(e)}일 때, ${sg('BF')}의 길이는 몇 cm인가?`, s - e, {
        unit: 'cm', figure: shape({ pts, segs: ['AB', 'BC', 'CD', 'AD', 'DE', 'DF'], angs: [['ADE', '', 'arc', 27], ['CDF', '', 'arc', 27], ['DAB', '', 'right'], ['DCB', '', 'right']], lens: { AE: cm(e), AD: cm(s) }, dirs: { E: [-1, 0], F: [0, -1] } })
          .svg(`정사각형 ABCD. 점 A는 왼쪽 위, 점 D는 오른쪽 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래에 있다. 변 AB 위에 점 E, 변 BC 위에 점 F가 있고 선분 DE와 선분 DF가 그어져 있다. ∠ADE와 ∠CDF에 같은 표시(호)가 있고, ∠A와 ∠C에 직각 표시가 있다. 변 AD의 길이는 ${cm(s)}, 선분 AE의 길이는 ${cm(e)}.`),
        explain: `△AED와 △CFD에서 ${eqs('AD', 'CD')}, ∠A = ∠C = 90°, ∠ADE = ∠CDF이므로 △AED ≡ △CFD (ASA 합동)이다. 따라서 ${sg('CF')} = ${sg('AE')} = ${cm(e)}이고, ${sg('BF')} = ${sg('BC')} − ${sg('CF')} = ${s} − ${e} = ${s - e} (cm)이다.`,
        facts: { calc: [[`${s}-${e}`, 0]] }
      });
    }),
    T('find-shared-asa', '공통인 변이 있는 두 삼각형: 나머지 각을 구하여 합동 조건 대기', '①59', (d) => {
      const al = d.pick([30, 35, 40]), be = d.pick([80, 85, 95, 100]), ga = 180 - al - be, len = 3.3 * Math.sin(ga * RAD) / Math.sin(be * RAD), A = [0, 0];
      const pts = { A, B: polar(A, len, 270 - al), D: [0, -3.3], C: polar(A, len, 270 + al) };
      return pickOne(d, '그림에서 ∠BAD = ∠CAD, ∠B = ∠C이다. △ABD ≡ △ACD임을 바르게 설명한 것은?', `∠ADB = ∠ADC = ${ga}°이므로 ASA 합동이다.`, [`∠ADB = ∠ADC = ${ga}°이므로 SAS 합동이다.`, `∠ADB = ∠ADC = ${180 - be}°이므로 ASA 합동이다.`, `${eqs('AB', 'AC')}이므로 SAS 합동이다.`], {
        figure: shape({ pts, segs: ['AB', 'BD', 'DC', 'AC', 'AD'], angs: [['BAD', al + '°'], ['DAC', al + '°'], ['ABD', be + '°'], ['ACD', be + '°']] })
          .svg(`사각형 ABDC와 대각선 AD. 점 A는 위, 점 D는 아래, 점 B는 왼쪽, 점 C는 오른쪽에 있다. ∠BAD의 크기는 ${al}°, ∠CAD의 크기는 ${al}°, ∠B의 크기는 ${be}°, ∠C의 크기는 ${be}°.`, { k: 40 }),
        explain: `삼각형의 세 각의 크기의 합은 180°이므로 ∠ADB = 180° − (${al}° + ${be}°) = ${ga}°, ∠ADC = ${ga}°이다. ${sg('AD')}는 공통이고 그 양 끝 각의 크기가 ∠BAD = ∠CAD, ∠ADB = ∠ADC로 각각 같으므로 △ABD ≡ △ACD (ASA 합동)이다. ${eqs('AB', 'AC')}는 합동임을 알고 난 뒤에 얻는 것이다.`
      });
    }),
    T('find-equi-two', '정삼각형의 두 변 위에 같은 길이로 잡은 두 점', '①61 심31', (d) => {
      const P = equiTwo(d.pick([0.3, 0.36, 0.42]));
      return pickOne(d, `그림의 정삼각형 ABC에서 ${eqs('BD', 'CE')}일 때, △ABD와 합동인 삼각형을 기호 ≡를 사용하여 바르게 나타낸 것은?`, '△ABD ≡ △BCE', d.shuffle(['△ABD ≡ △BEC', '△ABD ≡ △CBE', '△ABD ≡ △CEB', '△ABD ≡ △EBC']).slice(0, 3), {
        figure: shape({ pts: P, segs: ['AB', 'BC', 'AC', 'AD', 'BE'], ticks: { BD: 1, CE: 1 } }).svg('정삼각형 ABC. 점 A는 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래에 있다. 변 BC 위에 점 D, 변 CA 위에 점 E가 있고 선분 BD와 선분 CE에 같은 표시가 있다. 선분 AD와 선분 BE가 그어져 있다.'),
        explain: `△ABD와 △BCE에서 ${eqs('AB', 'BC')}, ${eqs('BD', 'CE')}, ∠ABD = ∠BCE = 60°이므로 대응하는 두 변의 길이가 각각 같고, 그 끼인각의 크기가 같다. 꼭짓점 A와 B, B와 C, D와 E가 대응하므로 △ABD ≡ △BCE (SAS 합동)이다.`
      });
    }),
    T('find-pentagon', '정오각형의 두 대각선이 만드는 두 삼각형: 설명의 빈칸', '②48', (d) => {
      const O = [0, 0], pts = { A: polar(O, 2.3, 90), B: polar(O, 2.3, 162), C: polar(O, 2.3, 234), D: polar(O, 2.3, 306), E: polar(O, 2.3, 18) };
      const rows = ['△ABC와 △AED에서', `${sg('AB')} = ㈎, ${eqs('BC', 'ED')}, ∠ABC = ㈏`, '이므로 대응하는 두 변의 길이가 각각 같고, 그 끼인각의 크기가 같다.', `따라서 △ABC ≡ △AED (SAS 합동)이고 ${eqs('AC', 'AD')}이다.`];
      return pickOne(d, `다음은 그림의 정오각형 ABCDE에서 ${eqs('AC', 'AD')}임을 설명하는 과정이다. ㈎, ㈏에 알맞은 것을 차례로 나열한 것은?`, `${sg('AE')}, ∠AED`, [`${sg('AD')}, ∠AED`, `${sg('AE')}, ∠ADE`, `${sg('AE')}, ∠EAD`], {
        figure: shape({ pts, segs: ['AB', 'BC', 'CD', 'DE', 'AE', 'AC', 'AD'] }).svg('정오각형 ABCDE. 점 A는 위, 점 B는 왼쪽, 점 E는 오른쪽, 점 C는 왼쪽 아래, 점 D는 오른쪽 아래에 있다. 대각선 AC와 대각선 AD가 그어져 있다.') + lines(rows),
        explain: `정오각형은 다섯 변의 길이가 모두 같고 다섯 각의 크기가 모두 같다. △ABC와 △AED에서 ${eqs('AB', 'AE')}, ${eqs('BC', 'ED')}, ∠ABC = ∠AED이므로 △ABC ≡ △AED (SAS 합동)이다.`
      });
    })
  ]);

  Object.assign(K, { N1, N2, ELEMS, isSide, at, kindOf, WORKS, works, elem, told, eq, pairName, COND, condQ, whyNot, ang5, ssaNums, numCond, TRI_SIDES, scrambled, pairPic, corr, SETS, setText, sasSpec, asaSpec, sssSpec, aasSpec, ssaSpec, aaaSpec, laidOut, specPic, eqs, bowFig, fanFig, equiPts, equiTwo });
})(typeof window !== 'undefined' ? window : globalThis);
