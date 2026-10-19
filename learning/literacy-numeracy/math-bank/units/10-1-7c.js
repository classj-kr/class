// 고등학교 1학년 1학기 7단원 경우의 수 — 실력 문항.
// 이 단원에서 아이들이 흔히 잘못 아는 것:
//  - 「적어도」를 바로 세려다 같은 경우를 두 번 센다(분야마다 하나씩 먼저 고르고 나머지를 고르는 풀이). 전체에서 반대 경우를 빼는 것을 떠올리지 못한다.
//  - 「a와 b가 이웃 또는 b와 c가 이웃」처럼 두 사건이 겹칠 때 겹친 부분(abc, cba)을 빼지 않는다. 묶음 안의 차례가 둘인 것을 놓친다.
//  - 곱이 짝수 ⇔ 적어도 하나가 짝수, 곱이 10의 배수 ⇔ 5와 짝수가 함께, 9의 배수 ⇔ 9 또는 3과 6처럼 조건을 수의 성질로 바꾸지 못한다.
//  - 두 자리 수 A와 자리를 바꾼 B의 합이 11의 배수라는 것을 쓰지 못하고 늘어놓다 빠뜨린다.
//  - 음수와 0을 빠뜨리고 양수 해만 센다(a² + b² + c² = k). 최소공배수에서 a = b 인 경우를 빼지 않는다.
//  - 「서로 이웃한 두 지역」을 셀 때 경계가 조금 닿은 것을 빠뜨린다. 한붓그리기에서 고리마다 그리는 방향이 둘인 것을 놓친다.
//  - 「키가 중간인 사람이 나머지 두 사람보다 앞이나 뒤에 오지 않게」가 두 사람 사이에 선다는 뜻임을 읽지 못한다.
// 실력에 둔 것은 ① 상황·조건의 장치 때문에 배운 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제뿐이다(10-1-7a.js 머리 주석의 기준).
// 기본 문서에만 나온 꼴도 위 잣대에 들면 여기에 실었다(ref 의 ①·②). 심화 문서(대단원 기출 모의고사)의 꼴은 심7·심9·심11 을 실었고, 심12(중복조합)·심6(중2 hard-kth)은 뺐으며 나머지는 기본 유형과 겹친다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, lines, box, frac, N, M, C } = B.kit;
  const { MINUS, range, gcd, lcm, V, nb, tail } = B.kit.mid;
  const { at, Board, sv, CLEAR } = B.kit.mgeo;
  const K = B.kit.m1017;
  const { UNIT, S1, S2, S3, sum, hits, fact, nPr, nCr, perms, combos, cart, told, who, prodS, factS, combS, eqDigit, H, Pn, Cn, Pj, Cj, vn, eqn } = K;
  const va = V('a'), vb = V('b'), vc = V('c'), vk = V('k');

  // ── 그림 ──
  // 직사각형을 다섯 영역으로 나눈 그림: A(왼쪽 위)·B(가운데 위)·C(오른쪽 맨 위)·D(오른쪽 가운데)·E(아래 띠)
  const FIVE = { names: ['A', 'B', 'C', 'D', 'E'], near: [[0, 1], [0, 4], [1, 2], [1, 3], [1, 4], [2, 3], [3, 4]] };
  function fiveFig() {
    const g = Board(), W = 240, Hh = 160, x1 = 72, x2 = 152, y1 = 52, y2 = 104;
    g.poly([[0, 0], [W, 0], [W, Hh], [0, Hh]]).seg([x1, 0], [x1, y2]).seg([x2, 0], [x2, y2]).seg([x2, y1], [W, y1]).seg([0, y2], [W, y2]);
    g.text([x1 / 2, y2 / 2], 'A', { plain: true }).text([(x1 + x2) / 2, y2 / 2], 'B', { plain: true }).text([(x2 + W) / 2, y1 / 2], 'C', { plain: true }).text([(x2 + W) / 2, (y1 + y2) / 2], 'D', { plain: true }).text([W / 2, (y2 + Hh) / 2], 'E', { plain: true });
    return g.svg('직사각형을 다섯 영역 A, B, C, D, E로 나눈 그림: A는 B, E와 이웃하고, B는 A, C, D, E와 이웃하고, C는 B, D와 이웃하고, D는 B, C, E와 이웃하고, E는 A, B, D와 이웃한다. A와 C, A와 D, C와 E는 이웃하지 않는다.');
  }
  // 한붓그리기: 점 A에 고리 k개, 점 B에 고리 m개, A와 B를 잇는 선분 하나
  function strokeFig(k, m) {
    const g = Board(), A0 = [0, 0], B0 = [150, 0], R = 54;
    const loop = (p, th) => { const q1 = at(p, R, th - 24), q2 = at(p, R, th + 24); g.shape(`M${p[0]} ${p[1]}C${q1[0].toFixed(1)} ${q1[1].toFixed(1)} ${q2[0].toFixed(1)} ${q2[1].toFixed(1)} ${p[0]} ${p[1]}`, [p, at(p, R * 0.78, th), at(p, R * 0.6, th - 16), at(p, R * 0.6, th + 16)], CLEAR); };
    const SPREAD = { 1: [180], 2: [135, 225], 3: [100, 180, 260] };
    SPREAD[k].forEach((th) => loop(A0, th));
    SPREAD[m].forEach((th) => loop(B0, th + 180));
    g.seg(A0, B0).dot(A0, 3).dot(B0, 3).text(at(A0, 16, 40), 'A', { plain: true }).text(at(B0, 16, 140), 'B', { plain: true });
    return g.svg(`한붓그리기 그림: 점 A에 고리 모양의 선이 ${k}개 붙어 있고, 점 B에 고리 모양의 선이 ${m}개 붙어 있다. 점 A와 점 B는 선분 하나로 이어져 있다.`);
  }
  // 가운데 지역 하나를 k 개의 지역이 둘러싼 지도. 가운데 지역의 이름은 C, 둘러싼 지역은 나머지 글자를 차례로 붙인다.
  function wheelFig(k) {
    const g = Board(), c = [0, 0], r = 34, R = 92, letters = 'ABCDEFGH'.slice(0, k + 1).split(''), mid0 = letters[2], ring = letters.filter((x) => x !== mid0);
    g.disk(c, R).disk(c, r);
    for (let i = 0; i < k; i += 1) { const a = 90 - i * 360 / k; g.seg(at(c, r, a), at(c, R, a)); }
    ring.forEach((nm, i) => g.text(at(c, (r + R) / 2, 90 - (i + 0.5) * 360 / k), nm, { plain: true }));
    g.text(c, mid0, { plain: true });
    return g.svg(`지도: 가운데 지역 ${mid0}를 지역 ${told(ring)}가 차례로 빙 둘러싸고 있다. 둘러싼 지역은 양옆의 두 지역과 경계가 닿고, 모든 지역은 가운데 지역 ${mid0}와 경계가 닿는다.`);
  }
  // 삼각형 ABC: A와 변 BC 위의 점 p − 2개를 잇는 선분, 변 AB 위의 점과 변 AC 위의 점을 잇는 선분 q − 1개
  function fanFig(p, q) {
    const g = Board(), A0 = [0, 0], B0 = [-112, 156], C0 = [112, 156], lerp = (u, w, t) => [u[0] + (w[0] - u[0]) * t, u[1] + (w[1] - u[1]) * t];
    g.poly([A0, B0, C0]);
    for (let i = 1; i <= p - 2; i += 1) g.seg(A0, lerp(B0, C0, i / (p - 1)));
    for (let j = 1; j <= q - 1; j += 1) { const t = 0.32 + 0.5 * (j - 1) / Math.max(1, q - 2); g.seg(lerp(A0, B0, q === 2 ? 0.55 : t), lerp(A0, C0, q === 2 ? 0.55 : t)); }
    g.text([0, -12], 'A', { plain: true }).text([B0[0] - 10, B0[1] + 8], 'B', { plain: true }).text([C0[0] + 10, C0[1] + 8], 'C', { plain: true });
    return g.svg(`삼각형 ABC: 꼭짓점 A와 변 BC 위의 점 ${p - 2}개를 잇는 선분이 ${p - 2}개 있고, 변 AB 위의 점과 변 AC 위의 점을 잇는 선분이 ${q - 1}개 있다.`);
  }

  const hardTypes = [
    // ── ① 뜻을 정확히 대야 풀리는 문제 ──
    H('hard-dice-odd', 'a + b + c + abc가 홀수가 되는 경우', '①17', (d) => {
      const k = d.int(5, 9), o = Math.ceil(k / 2), e = Math.floor(k / 2), all = cart([range(1, k), range(1, k), range(1, k)]), flags = all.map(([x, y, z]) => (x + y + z + x * y * z) % 2 === 1);
      const lead = k === 6 ? `서로 다른 주사위 3개를 동시에 던져 나오는 눈의 수를 각각 ${va}, ${vb}, ${vc}라 할 때` : `서로 다른 세 주머니에 1부터 ${k}까지의 자연수가 하나씩 적힌 공이 ${k}개씩 들어 있다. 각 주머니에서 공을 1개씩 꺼내 공에 적힌 수를 차례로 ${va}, ${vb}, ${vc}라 할 때`;
      // 걸리는 곳: a + b + c 가 홀수이기만 하면 된다고 보고 (홀, 홀, 홀)까지 센다 — abc 도 홀수라 합은 짝수이다.
      return N(`${lead}, ${nb(`${va} + ${vb} + ${vc} + ${va}${vb}${vc}`)}가 홀수인 경우의 수는?`, hits(flags), {
        unit: '가지',
        explain: `${nb(`${va} + ${vb} + ${vc}`)}가 짝수이면 ${va}, ${vb}, ${vc} 가운데 짝수가 있어 ${va}${vb}${vc}도 짝수이므로 합은 짝수이다. ${nb(`${va} + ${vb} + ${vc}`)}가 홀수인 경우 가운데 셋 다 홀수이면 ${va}${vb}${vc}도 홀수라 합이 짝수가 된다. 따라서 홀수가 1개, 짝수가 2개인 경우만 된다. 홀수가 올 자리를 정하는 3가지마다 ${o} × ${e} × ${e} = ${o * e * e}(가지)이므로 3 × ${o * e * e} = ${hits(flags)}(가지)이다.`,
        facts: { count: flags }
      });
    }, { standard: S1 }),
    H('hard-lcm-pairs', '최소공배수가 정해진 서로 다른 두 수의 순서쌍', '①22', (d) => {
      const [L, p, al, q, be] = d.pick([[12, 2, 2, 3, 1], [18, 2, 1, 3, 2], [20, 2, 2, 5, 1], [28, 2, 2, 7, 1], [45, 3, 2, 5, 1], [50, 2, 1, 5, 2], [36, 2, 2, 3, 2], [24, 2, 3, 3, 1], [75, 3, 1, 5, 2]]);
      const divs = range(1, L).filter((v) => L % v === 0), pairs = cart([divs, divs]), flags = pairs.map(([x, y]) => x !== y && lcm(x, y) === L);
      // 걸리는 곳: 두 수가 같은 (L, L)을 빼지 않는다. 또는 큰 지수를 한쪽에만 주어 반만 센다.
      return N(`서로 다른 두 자연수 ${va}, ${vb}의 최소공배수가 ${L}일 때, ${va}, ${vb}의 순서쌍 (${va}, ${vb})의 개수는?`, hits(flags), {
        unit: '개',
        explain: `${L} = ${p}${al > 1 ? `<sup>${al}</sup>` : ''} × ${q}${be > 1 ? `<sup>${be}</sup>` : ''}이므로 ${va}, ${vb}는 ${L}의 약수이다. ${va}, ${vb}의 ${p}의 지수 가운데 큰 것이 ${al}이어야 하므로 지수의 짝은 ${2 * al + 1}가지, ${q}의 지수 가운데 큰 것이 ${be}이어야 하므로 ${2 * be + 1}가지이다. 곱의 법칙에 의하여 ${(2 * al + 1) * (2 * be + 1)}가지이고, 이 가운데 ${va} = ${vb} = ${L}인 1가지를 빼면 ${hits(flags)}개이다.`,
        facts: { count: flags }
      });
    }, { standard: S1 }),
    H('hard-one-stroke', '한붓그리기의 방법의 수', '①29', (d) => {
      const [k, m] = d.until(() => [d.int(2, 3), d.int(1, 3)], ([a, b]) => !(a === 2 && b === 1)), ans = fact(k) * 2 ** k * fact(m) * 2 ** m;
      // 걸리는 곳: 선분은 한 번만 지나므로 A의 고리를 모두 그린 뒤에 B로 건너가야 한다. 고리마다 그리는 방향이 2가지씩이다.
      return N(`다음 그림과 같은 도형을 점 A에서 시작하여 연필을 떼지 않고 한 번에 그리려고 한다. 이 도형을 그리는 방법의 수는? (단, 한 번 그린 선은 다시 그리지 않는다.)`, ans, {
        unit: '가지',
        figure: strokeFig(k, m),
        explain: `선분 AB는 한 번만 지날 수 있으므로 점 A의 고리 ${k}개를 모두 그린 다음 선분을 따라 B로 가서 B의 고리 ${m}개를 그린다. A의 고리를 그리는 차례는 ${k}! = ${fact(k)}(가지)이고 고리마다 방향이 2가지이므로 ${fact(k)} × ${range(1, k).map(() => 2).join(' × ')} = ${fact(k) * 2 ** k}(가지), B의 고리도 같은 방법으로 ${m === 1 ? '2가지' : `${fact(m)} × ${range(1, m).map(() => 2).join(' × ')} = ${fact(m) * 2 ** m}(가지)`}이다. 따라서 ${fact(k) * 2 ** k} × ${fact(m) * 2 ** m} = ${ans}(가지)이다.`,
        facts: { calc: [[`${factS(k)}*${range(1, k).map(() => 2).join('*')}*${factS(m)}*${range(1, m).map(() => 2).join('*')}`, 0]] }
      });
    }, { standard: S1 }),
    H('hard-two-pairs', '「a와 b가 이웃 또는 b와 c가 이웃」(겹친 경우 빼기)', '①58', (d) => {
      const L = d.int(5, 7), letters = 'abcdefg'.slice(0, L).split(''), ans = 2 * 2 * fact(L - 1) - 2 * fact(L - 2);
      // 걸리는 곳: 겹친 경우(a, b, c 가 abc·cba 로 붙은 것)를 빼지 않으면 2 × 2 × (L − 1)! 이 된다. 셋을 묶은 안의 차례를 3! 로 세면 틀린다.
      return N(`${L}개의 문자 ${told(letters)}를 일렬로 나열할 때, a와 b가 서로 이웃하거나 b와 c가 서로 이웃하도록 나열하는 경우의 수는?`, ans, {
        unit: '가지',
        explain: `a와 b가 이웃하는 경우는 ${L - 1}! × 2 = ${2 * fact(L - 1)}(가지)이고, b와 c가 이웃하는 경우도 ${2 * fact(L - 1)}가지이다. 두 경우가 동시에 일어나는 것은 a, b, c가 abc 또는 cba로 이웃할 때이므로 ${L - 2}! × 2 = ${2 * fact(L - 2)}(가지)이다. 따라서 ${2 * fact(L - 1)} + ${2 * fact(L - 1)} − ${2 * fact(L - 2)} = ${ans}(가지)이다.`,
        facts: { calc: [[`2*2*${factS(L - 1)}-2*${factS(L - 2)}`, 0]] }
      });
    }, { standard: S2 }),
    H('hard-some-adjacent', '적어도 두 명이 이웃하게 세우기(여사건)', '①59', (d) => {
      const [m, w] = d.until(() => [d.int(3, 4), d.int(3, 4)], ([a, b]) => a <= b + 1 && fact(a + b) <= 9999), ans = fact(m + w) - fact(w) * nPr(w + 1, m);
      // 걸리는 곳: 「적어도 2명이 이웃」의 반대를 「모두 이웃」으로 잡는다. 반대는 남학생이 모두 이웃하지 않는 것이다.
      return N(`남학생 ${m}명과 여학생 ${w}명을 일렬로 세울 때, 남학생 중 적어도 2명은 서로 이웃하도록 세우는 경우의 수는?`, ans, {
        unit: '가지',
        explain: `반대는 남학생이 어느 두 명도 이웃하지 않는 경우이다. 여학생 ${w}명을 세우는 ${w}! = ${fact(w)}(가지)마다 사이사이와 양 끝 ${w + 1}곳 가운데 ${m}곳에 남학생을 세우는 ${Pn(w + 1, m)} = ${nPr(w + 1, m)}(가지)가 있으므로 ${fact(w) * nPr(w + 1, m)}가지이다. 따라서 ${m + w}! − ${fact(w) * nPr(w + 1, m)} = ${fact(m + w)} − ${fact(w) * nPr(w + 1, m)} = ${ans}(가지)이다.`,
        facts: { calc: [[`${factS(m + w)}-${factS(w)}*${prodS(w + 1, m)}`, 0]] }
      });
    }, { standard: S2 }),
    H('hard-middle-height', '키가 중간인 사람이 나머지 두 사람 사이에 서기', '①60', (d) => {
      const w = d.int(2, 4), tot = 3 + w, ans = fact(tot) / 3;
      // 걸리는 곳: 「앞이나 뒤에 오지 않게」를 「바로 옆에 서게」로 읽어 이웃으로 센다. 남자 세 자리의 가운데에 서기만 하면 된다.
      return N(`남자 3명과 여자 ${w}명을 일렬로 세울 때, 남자 중에서 키가 중간인 사람이 나머지 2명의 남자보다 앞이나 뒤에 오지 않게 세우는 경우의 수는? (단, 남자 3명의 키는 서로 다르다.)`, ans, {
        unit: '가지',
        explain: `키가 중간인 남자는 나머지 두 남자 사이(이웃하지 않아도 된다)에 서야 한다. 여자 ${w}명이 설 자리를 정하여 세우는 경우는 ${Pn(tot, w)} = ${nPr(tot, w)}(가지)이다. 남은 세 자리 가운데 가운데 자리에는 키가 중간인 남자가 서고, 양쪽 두 자리에 나머지 두 남자가 서는 경우는 2! = 2(가지)이다. 따라서 ${nPr(tot, w)} × 2 = ${ans}(가지)이다.`,
        facts: { calc: [[`${prodS(tot, w)}*2`, 0]] }
      });
    }, { standard: S2 }),
    H('hard-even-blocks', '이웃한 남학생 무리가 늘 짝수인 줄', '①61', (d) => {
      const [p, g] = d.until(() => [d.int(3, 8), d.int(2, 4)], ([a, b]) => b <= a + 1 && nPr(a + 1, b) <= 9999), boys = 2 * p, ans = nPr(p + 1, g);
      // 걸리는 곳: 무리의 크기가 짝수이려면 남학생을 둘씩 묶은 사이와 양 끝에만 여학생이 설 수 있다. 남학생 자리 전체의 사이 (2p + 1)곳을 쓰면 틀린다.
      return N(`남학생 ${boys}명과 여학생 ${g}명이 일렬로 설 때, 여학생끼리는 서로 이웃하지 않고, 서로 이웃하여 서 있는 남학생 무리마다 학생 수가 항상 짝수가 되도록 서는 경우의 수는 ${vk} × ${boys}!이다. 자연수 ${vk}의 값은?`, ans, {
        explain: `남학생 ${boys}명을 일렬로 세우는 경우는 ${boys}!가지이다. 무리마다 학생 수가 짝수이려면 남학생을 앞에서부터 둘씩 묶은 ${p}묶음의 사이사이와 양 끝 ${p + 1}곳에만 여학생이 설 수 있고, 여학생끼리 이웃하지 않으므로 한 곳에 한 명씩 선다. 따라서 ${vk} = ${Pn(p + 1, g)} = ${ans}이다.`,
        facts: { calc: [[prodS(p + 1, g), 0]] }
      });
    }, { standard: S2 }),
    H('hard-repeat-digit', '적어도 두 자리의 숫자가 같은 수의 개수(여사건)', '②10', (d) => {
      const k = d.int(3, 4), word = k === 3 ? '세' : '네', all9 = d.bool();
      if (all9) {
        const tot = 9 * 10 ** (k - 1), diff = 9 * nPr(9, k - 1), ans = tot - diff;
        // 걸리는 곳: 네 자리 수의 개수를 10⁴ 으로 세거나, 모두 다른 수에서 맨 앞에 0을 넣는다.
        return N(`${word} 자리의 자연수 중에서 적어도 두 자리의 숫자가 같은 수의 개수는?`, ans, {
          unit: '개',
          explain: `${word} 자리의 자연수는 ${tot}개이다. 각 자리의 숫자가 모두 다른 수는 맨 앞에 0을 뺀 9가지, 나머지 ${k - 1}자리에 남은 9개의 숫자 가운데 ${k - 1}개를 나열하는 ${Pn(9, k - 1)}가지이므로 9 × ${nPr(9, k - 1)} = ${diff}(개)이다. 따라서 ${tot} − ${diff} = ${ans}(개)이다.`,
          facts: { calc: [[`9*${10 ** (k - 1)}-9*${prodS(9, k - 1)}`, 0], ], rule: 'all-digits' }
        });
      }
      const top = d.int(5, 8), tot = top ** k, diff = nPr(top, k), ans = tot - diff;
      return N(`1부터 ${top}까지의 숫자를 사용하여 만든 ${word} 자리의 자연수 중에서 적어도 두 자리의 숫자가 같은 수의 개수는? (단, 같은 숫자를 여러 번 사용할 수 있다.)`, ans, {
        unit: '개',
        explain: `만들 수 있는 ${word} 자리의 자연수는 ${range(1, k).map(() => top).join(' × ')} = ${tot}(개)이다. 각 자리의 숫자가 모두 다른 수는 ${Pn(top, k)} = ${diff}(개)이므로 ${tot} − ${diff} = ${ans}(개)이다.`,
        facts: { calc: [[`${range(1, k).map(() => top).join('*')}-${prodS(top, k)}`, 0]], rule: 'few-digits' }
      });
    }, { standard: S2 }),
    H('hard-product-ten', '각 자리의 숫자의 곱이 10의 배수인 수', '②11', (d) => {
      const top = d.int(6, 9), all = perms(range(1, top), 3), flags = all.map(([x, y, z]) => (x * y * z) % 10 === 0), ev = range(1, top).filter((v) => v % 2 === 0).length, rest = top - 1;
      // 걸리는 곳: 10의 배수 = 5와 짝수가 함께 있는 것임을 쓰지 못한다. 5를 넣고 나머지 둘 가운데 짝수가 「적어도 하나」인 것을 여사건으로 세지 않고 하나만 짝수로 센다.
      return N(`1부터 ${top}까지의 자연수 중에서 서로 다른 3개를 택하여 세 자리의 자연수를 만들 때, 각 자리의 숫자의 곱이 10의 배수인 수의 개수는?`, hits(flags), {
        unit: '개',
        explain: `곱이 10의 배수이려면 5와 짝수가 함께 있어야 한다. 5를 넣고, 5를 뺀 ${rest}개의 수 가운데 2개를 고를 때 짝수가 적어도 하나인 경우는 ${Cn(rest, 2)} − ${Cn(rest - ev, 2)} = ${nCr(rest, 2) - nCr(rest - ev, 2)}(가지)이다. 고른 세 수를 일렬로 나열하는 3! = 6(가지)를 곱하면 ${(nCr(rest, 2) - nCr(rest - ev, 2))} × 6 = ${hits(flags)}(개)이다.`,
        facts: { count: flags }
      });
    }, { standard: S2 }),
    H('hard-swap-sum', '십의 자리와 일의 자리를 바꾼 두 수의 합이 짝수', '②15', (d) => {
      const top = d.int(6, 9), all = combos(range(1, top), 2), flags = all.map(([x, y]) => ((10 * y + x) + (10 * x + y)) % 2 === 0), o = Math.ceil(top / 2), e = Math.floor(top / 2);
      // 걸리는 곳: A + B = 11(a + b)라는 것을 쓰지 못하고 A + B 의 일의 자리만 보다가 a + b 의 홀짝을 잘못 잡는다.
      return N(`1부터 ${top}까지의 자연수가 하나씩 적힌 카드 ${top}장 중에서 두 장을 뽑아 큰 수는 십의 자리, 작은 수는 일의 자리에 놓아 만든 두 자리의 자연수를 ${V('A')}, ${V('A')}의 십의 자리의 숫자와 일의 자리의 숫자를 바꾸어 만든 두 자리의 자연수를 ${V('B')}라 하자. ${nb(`${V('A')} + ${V('B')}`)}가 짝수인 경우의 수는?`, hits(flags), {
        unit: '가지',
        explain: `뽑은 두 수를 ${va}, ${vb}라 하면 ${eqn(`${V('A')} + ${V('B')} = (10${va} + ${vb}) + (10${vb} + ${va}) = 11(${va} + ${vb})`)}이므로 ${eqn(`${va} + ${vb}`)}가 짝수이면 된다. 두 수가 모두 홀수이거나 모두 짝수이어야 하므로 ${Cn(o, 2)} + ${Cn(e, 2)} = ${nCr(o, 2)} + ${nCr(e, 2)} = ${hits(flags)}(가지)이다.`,
        facts: { count: flags }
      });
    }, { standard: S2 }),
    H('hard-product-even', '곱이 짝수가 되게 뽑기', '②38', (d) => {
      const top = d.int(8, 12), r = d.int(2, 4), o = Math.ceil(top / 2), ans = nCr(top, r) - nCr(o, r);
      // 걸리는 곳: 곱이 짝수 ⇔ 적어도 하나가 짝수. 짝수 카드를 하나만 넣어 세면 둘 이상 들어간 경우가 빠진다.
      return N(`상자 안에 1부터 ${top}까지의 자연수가 하나씩 적힌 카드 ${top}장이 있다. 상자에서 ${r}장의 카드를 동시에 꺼낼 때, 카드에 적힌 수의 곱이 짝수가 되는 경우의 수는?`, ans, {
        unit: '가지',
        explain: `곱이 짝수이려면 짝수가 적어도 하나 있어야 한다. 반대로 곱이 홀수인 것은 홀수 카드만 꺼낸 경우이다. 모든 경우 ${Cn(top, r)} = ${nCr(top, r)}(가지)에서 홀수 카드 ${o}장 중에서만 꺼내는 ${Cn(o, r)} = ${nCr(o, r)}(가지)를 빼면 ${ans}(가지)이다.`,
        facts: { calc: [[`${combS(top, r)}-${combS(o, r)}`, 0]] }
      });
    }, { standard: S3 }),
    H('hard-overcount', '분야별로 적어도 하나씩 — 겹쳐 센 풀이 바로잡기', '②39', (d) => {
      const [a, b] = d.until(() => [d.int(2, 4), d.int(3, 5)], ([x, y]) => x !== y), wrong = a * b * (a + b - 2), ans = nCr(a + b, 3) - nCr(a, 3) - nCr(b, 3);
      // 걸리는 곳: 분야마다 하나씩 먼저 고르고 남은 데서 하나를 고르면, 같은 세 동아리를 고른 차례만 달리하여 두 번 센다.
      return N(`학술 동아리 ${a}개, 운동 동아리 ${b}개 중에서 분야별로 적어도 하나의 동아리를 포함하여 모두 3개의 동아리에 지원서를 내려고 한다. 다음은 이 경우의 수를 구한 어느 학생의 풀이인데 잘못되었다. 바른 경우의 수는?`, ans, {
        unit: '가지',
        figure: lines([`두 분야에서 하나씩 고르는 경우의 수는 ${Cn(a, 1)} × ${Cn(b, 1)} = ${a * b}`, `남은 ${a + b - 2}개 중에서 하나를 더 고르는 경우의 수는 ${Cn(a + b - 2, 1)} = ${a + b - 2}`, `따라서 구하는 경우의 수는 ${a * b} × ${a + b - 2} = ${wrong}`]),
        explain: `이 풀이는 학술 동아리 둘과 운동 동아리 하나를 고른 경우를 어느 학술 동아리를 먼저 골랐는지에 따라 두 번 센다. 바르게는 모든 경우 ${Cn(a + b, 3)} = ${nCr(a + b, 3)}(가지)에서 한 분야에서만 고른 ${Cn(a, 3)} + ${Cn(b, 3)} = ${nCr(a, 3) + nCr(b, 3)}(가지)를 빼어 ${ans}가지이다.`,
        facts: { calc: [[`${combS(a + b, 3)}-${combS(a, 3)}-${combS(b, 3)}`, 0]] }
      });
    }, { standard: S3 }),
    H('hard-surveyors', '이웃한 두 지역을 맡는 조사원 정하기', '심7', (d) => {
      const k = d.int(4, 6), ans = 2 * k * fact(k);
      // 걸리는 곳: 이웃한 두 지역의 쌍을 빠짐없이 세지 못한다(가운데 지역과의 쌍 k 개, 둘레의 이웃 쌍 k 개). 맡길 조사원을 정하는 k! 을 빠뜨린다.
      return N(`그림과 같이 경계가 구분된 ${k + 1}개 지역의 인구 조사를 조사원 ${k}명이 맡으려고 한다. ${k}명 중에서 1명은 서로 이웃한 2개 지역을, 나머지 ${k - 1}명은 남은 ${k - 1}개 지역을 1개씩 맡는다. ${k}명이 맡을 지역을 정하는 경우의 수는? (단, 경계가 일부라도 닿은 두 지역은 서로 이웃한 지역으로 본다.)`, ans, {
        unit: '가지',
        figure: wheelFig(k),
        explain: `서로 이웃한 두 지역의 쌍은 가운데 지역과 둘레의 지역 하나로 된 ${k}쌍, 둘레에서 양옆으로 닿은 ${k}쌍으로 ${2 * k}쌍이다. 쌍 하나를 고르면 맡을 몫이 ${k}개(그 쌍과 나머지 ${k - 1}개 지역)로 나뉘고, 조사원 ${k}명에게 나누어 맡기는 경우는 ${k}! = ${fact(k)}(가지)이다. 따라서 ${2 * k} × ${fact(k)} = ${ans}(가지)이다.`,
        facts: { calc: [[`2*${k}*${factS(k)}`, 0]] }
      });
    }, { standard: S2 }),
    H('hard-clubs', '두 사람이 공통으로 가입하는 동아리가 1개 이하', '심9', (d) => {
      const m = d.int(4, 6), c2 = nCr(m, 2), ans = c2 * c2 - c2, [p1, p2] = who(d, 2);
      // 걸리는 곳: 「1개 이하」의 반대가 「두 동아리가 모두 같음」임을 잡지 못하고 공통 0개·1개를 따로 세다 빠뜨린다.
      return N(`${josa(p1, '과/와')} ${p2} 두 사람이 서로 다른 ${m}개의 동아리 중에서 2개씩 가입하려고 한다. 두 사람이 공통으로 가입하는 동아리가 1개 이하가 되도록 가입하는 경우의 수는? (단, 가입 순서는 생각하지 않는다.)`, ans, {
        unit: '가지',
        explain: `두 사람이 2개씩 고르는 모든 경우는 ${Cn(m, 2)} × ${Cn(m, 2)} = ${c2 * c2}(가지)이다. 공통으로 가입하는 동아리가 2개인 경우, 곧 두 사람이 같은 두 동아리를 고르는 경우는 ${Cn(m, 2)} = ${c2}(가지)이므로 ${c2 * c2} − ${c2} = ${ans}(가지)이다.`,
        facts: { calc: [[`${combS(m, 2)}*${combS(m, 2)}-${combS(m, 2)}`, 0]] }
      });
    }, { standard: S3 }),
    H('hard-fan-triangles', '삼각형 안에 그은 선분으로 만든 삼각형', '심11', (d) => {
      const p = d.int(4, 6), q = d.int(3, 5), ans = nCr(p, 2) * q;
      // 걸리는 곳: 삼각형이 되려면 A를 지나는 선 둘과 A를 지나지 않는 선 하나를 골라야 한다. 작은 삼각형만 세거나 변 AB, AC, BC를 셈에서 뺀다.
      return N(`삼각형 ABC에서 꼭짓점 A와 변 BC 위의 ${p - 2}개의 점을 잇는 선분 ${p - 2}개를 긋고, 변 AB 위의 점과 변 AC 위의 점을 잇는 선분 ${q - 1}개를 그어 그림과 같은 도형을 만들었다. 이 도형의 선들로 만들 수 있는 삼각형의 개수는?`, ans, {
        unit: '개',
        figure: fanFig(p, q),
        explain: `꼭짓점 A를 지나는 선은 변 AB, AC와 그은 선분 ${p - 2}개로 ${p}개, A를 지나지 않는 선은 그은 선분 ${q - 1}개와 변 BC로 ${q}개이다. A를 지나는 선 2개와 A를 지나지 않는 선 1개를 고르면 삼각형이 하나 생기므로 ${Cn(p, 2)} × ${q} = ${nCr(p, 2)} × ${q} = ${ans}(개)이다.`,
        facts: { calc: [[`${combS(p, 2)}*${q}`, 0]] }
      });
    }, { standard: S3 }),

    // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
    H('hard-int-squares', 'a² + b² + c² = k를 만족시키는 정수의 순서쌍', '①7', (d) => {
      const k = d.pick([9, 14, 17, 18, 20, 21, 26, 29]), r = Math.floor(Math.sqrt(k)), all = cart([range(-r, r), range(-r, r), range(-r, r)]), flags = all.map(([x, y, z]) => x * x + y * y + z * z === k);
      const kinds = new Map();
      all.forEach((t, i) => { if (flags[i]) { const key = t.map(Math.abs).sort((x, y) => x - y).join(', '); kinds.set(key, (kinds.get(key) || 0) + 1); } });
      // 걸리는 곳: 음수와 0을 빠뜨리거나, (0, 2, 4)처럼 0이 낀 것은 부호를 바꿔도 같다는 것을 놓쳐 8을 곱한다.
      return N(`세 정수 ${va}, ${vb}, ${vc}에 대하여 ${nb(`${va}<sup>2</sup> + ${vb}<sup>2</sup> + ${vc}<sup>2</sup> = ${k}`)}${tail(k, '을/를')} 만족시키는 순서쌍 (${va}, ${vb}, ${vc})의 개수는?`, hits(flags), {
        unit: '개',
        explain: `세 수의 절댓값의 묶음은 ${[...kinds.keys()].map((key) => '(' + key + ')').join(', ')}이다. ` + [...kinds].map(([key, c]) => { const v = key.split(', ').map(Number), order = new Set(perms(v, 3).map((t) => t.join())).size, sign = 2 ** v.filter((x) => x).length; return `(${key})${tail(v[2], '은/는')} 차례를 정하는 ${order}가지마다 0이 아닌 수의 부호를 정하는 ${sign}가지가 있어 ${order} × ${sign} = ${c}(개)`; }).join(', ') + (kinds.size > 1 ? `이므로 모두 ${hits(flags)}개이다.` : '이다.'),
        facts: { count: flags }
      });
    }, { standard: S1 }),
    H('hard-matches', '성냥개비로 만드는 삼각형', '①10', (d) => {
      const n = d.int(15, 24), cand = []; for (let x = 1; x <= n; x += 1) for (let y = 1; y <= x; y += 1) { const z = n - x - y; if (z >= 1 && z <= y) cand.push([x, y, z]); }
      const flags = cand.map(([x, y, z]) => x < y + z), xs = [...new Set(cand.filter((_, i) => flags[i]).map((t) => t[0]))];
      return N(`길이가 1이고 모양이 같은 성냥개비 ${n}개를 모두 사용하여 삼각형 하나를 만들려고 한다. 삼각형의 세 변을 이루는 성냥개비의 개수를 각각 ${V('x')}, ${V('y')}, ${V('z')} (${nb(`${V('x')} ≥ ${V('y')} ≥ ${V('z')}`)})라 할 때, 만들 수 있는 서로 다른 모양의 삼각형의 개수는?`, hits(flags), {
        unit: '개',
        explain: `${nb(`${V('x')} + ${V('y')} + ${V('z')} = ${n}`)}이고 ${V('x')}가 가장 크므로 ${nb(`3${V('x')} ≥ ${n}`)}, 삼각형이 되려면 ${nb(`${V('x')} &lt; ${V('y')} + ${V('z')} = ${n} − ${V('x')}`)}이다. 따라서 ${V('x')}는 ${told(xs)}이고, ` + xs.map((x) => { const list = cand.filter((t, i) => flags[i] && t[0] === x); return `${V('x')} = ${x}일 때 (${V('y')}, ${V('z')})는 ${list.map((t) => `(${t[1]}, ${t[2]})`).join(', ')}의 ${list.length}가지`; }).join(', ') + `이다. 모두 ${hits(flags)}개이다.`,
        facts: { count: flags }
      });
    }, { standard: S1 }),
    H('hard-color5', '다섯 영역을 이웃끼리 다른 색으로 칠하기', '①27', (d) => {
      const k = d.int(4, 6), ans = k * (k - 1) * (k - 2) ** 3;
      // 걸리는 곳: 이웃하지 않은 A와 D에 같은 색을 쓸 수 있음을 놓치면 모두 다른 경우만 센다.
      return N(`다음 그림의 다섯 영역 A, B, C, D, E를 서로 다른 ${k}가지 색을 사용하여 칠하려고 한다. 같은 색을 여러 번 사용해도 되지만 이웃한 영역은 서로 다른 색으로 칠하는 경우의 수는? (단, 각 영역에는 한 가지 색만 칠한다.)`, ans, {
        unit: '가지',
        figure: fiveFig(),
        explain: `가장 많은 영역과 이웃한 B부터 칠한다. B는 ${k}가지, A는 B와 다른 ${k - 1}가지, E는 A, B와 다른 ${k - 2}가지이다. D는 B, E와 다른 색이어야 하므로 ${k - 2}가지이다(이웃하지 않은 A와는 같은 색이어도 된다). C는 B, D와 다른 ${k - 2}가지이다. 따라서 ${k} × ${k - 1} × ${k - 2} × ${k - 2} × ${k - 2} = ${ans}(가지)이다.`,
        facts: { calc: [[`${k}*(${k}-1)*(${k}-2)*(${k}-2)*(${k}-2)`, 0]] }
      });
    }, { standard: S1 }),
    H('hard-adjacent-or-gap', '이웃하거나 사이에 하나만 있게 나열하기', '①57', (d) => {
      const L = d.int(5, 7), letters = 'abcdefg'.slice(0, L).split(''), near = 2 * fact(L - 1), gap = (L - 2) * 2 * fact(L - 2), ans = near + gap;
      return N(`${L}개의 문자 ${told(letters)}를 일렬로 나열할 때, a와 b가 서로 이웃하거나 a와 b 사이에 1개의 문자만 있도록 나열하는 경우의 수는?`, ans, {
        unit: '가지',
        explain: `a와 b가 이웃하는 경우는 ${L - 1}! × 2 = ${near}(가지)이다. a와 b 사이에 1개의 문자만 있는 경우는 사이에 놓을 문자를 고르는 ${L - 2}가지, 세 문자를 한 묶음으로 보고 나열하는 ${L - 2}! = ${fact(L - 2)}(가지), a와 b의 자리를 바꾸는 2가지를 곱하여 ${gap}가지이다. 두 경우는 동시에 일어나지 않으므로 ${near} + ${gap} = ${ans}(가지)이다.`,
        facts: { calc: [[`${factS(L - 1)}*2+(${L}-2)*${factS(L - 2)}*2`, 0]] }
      });
    }, { standard: S2 }),
    H('hard-no-ten-pair', '어느 두 수의 합도 10이 되지 않게 뽑아 만든 수', '②12', (d) => {
      const r = d.int(3, 4), word = r === 3 ? '세' : '네', all = perms(range(1, 9), r), flags = all.map((t) => !t.some((x, i) => t.some((y, j) => j > i && x + y === 10)));
      const with5 = nCr(4, r - 1) * 2 ** (r - 1), no5 = nCr(4, r) * 2 ** r;
      return N(`9개의 자연수 1, 2, 3, 4, 5, 6, 7, 8, 9에서 어느 두 수의 합도 10이 되지 않도록 서로 다른 ${r}개의 수를 뽑아 만들 수 있는 ${word} 자리의 자연수의 개수는?`, hits(flags), {
        unit: '개',
        explain: `합이 10인 두 수는 (1, 9), (2, 8), (3, 7), (4, 6)이고 5는 짝이 없다. 짝마다 한 수까지만 뽑을 수 있다. 5를 넣으면 네 짝 가운데 ${r - 1}짝을 골라 짝마다 두 수 가운데 하나씩 뽑는 ${Cn(4, r - 1)} × ${range(1, r - 1).map(() => 2).join(' × ')} = ${with5}(가지), 5를 넣지 않으면 ${Cn(4, r)} × ${range(1, r).map(() => 2).join(' × ')} = ${no5}(가지)이다. 뽑은 ${r}개를 나열하는 ${r}! = ${fact(r)}(가지)를 곱하면 (${with5} + ${no5}) × ${fact(r)} = ${hits(flags)}(개)이다.`,
        facts: { count: flags }
      });
    }, { standard: S2 }),
    H('hard-digit-sum-one', '한 숫자가 나머지 두 숫자의 합인 세 자리 수', '②13', (d) => {
      // 원문은 세 자리 수 전부를 세어 답이 늘 같으므로(126), 각 자리에 쓸 수 있는 숫자를 0(또는 1)부터 m까지로 줄여 답을 바꾼다. m = 9 이면 원문과 같다.
      const form = d.pick(['any', 'nozero', 'head']), m = d.int(5, 9), lo = form === 'nozero' ? 1 : 0;
      const dg = (v) => [Math.floor(v / 100), Math.floor(v / 10) % 10, v % 10];
      const all = range(100, 999).filter((v) => dg(v).every((x) => x >= lo && x <= m));
      const test = { any: ([a, b, c]) => a === b + c || b === a + c || c === a + b, nozero: ([a, b, c]) => a === b + c || b === a + c || c === a + b, head: ([a, b, c]) => a === b + c }[form];
      const flags = all.map((v) => test(dg(v)));
      const seq = (from, to, gap) => (to - from <= 3 ? range(from, to).join(gap || ', ') : [from, from + 1, '…', to].join(gap || ', '));
      const where = m === 9 ? '세 자리의 자연수 중에서' : `각 자리의 숫자가 ${lo}부터 ${m}까지의 수인 세 자리의 자연수 중에서`;
      const b0 = d.int(1, m - 1), shows = [m * 100 + b0 * 10 + (m - b0), 121, 100 + (m - 1) * 10 + m].concat(form === 'any' ? [101] : []).sort((x, y) => x - y);
      const one = (m * (m - 1)) / 2;
      const text = form === 'head' ? `${where} 백의 자리의 숫자가 십의 자리의 숫자와 일의 자리의 숫자의 합과 같은 수의 개수는?`
        : `${where} ${told(shows)}${tail(shows[shows.length - 1], '과/와')} 같이 일의 자리, 십의 자리, 백의 자리의 숫자 가운데 어느 한 숫자가 나머지 두 숫자의 합인 수의 개수는?${form === 'nozero' && m === 9 ? ' (단, 각 자리의 숫자는 0이 아니다.)' : ''}`;
      const noZero = `백의 자리가 나머지 둘의 합인 수는 백의 자리가 ${seq(2, m)}일 때 ${seq(1, m - 1)}가지로 ${one}개이다. 십의 자리가 나머지 둘의 합인 수, 일의 자리가 나머지 둘의 합인 수도 같은 방법으로 ${one}개씩이고, 0이 없으면 두 경우가 겹치지 않으므로 ${one} × 3 = ${3 * one}(개)이다.`;
      const explain = form === 'head' ? `백의 자리의 숫자를 ${va}라 하면 십의 자리와 일의 자리의 숫자의 합이 ${va}인 순서쌍은 ${nb(`(${va} + 1)`)}가지(0 포함)이다. ${va} = 1부터 ${m}까지 더하면 ${seq(2, m + 1, ' + ')} = ${hits(flags)}(개)이다.`
        : form === 'nozero' ? `각 자리의 숫자가 0이 아니므로 ${noZero}`
          : `0이 없는 경우, ${noZero} 0이 있는 경우는 십의 자리나 일의 자리가 0이고 나머지 두 숫자가 같은 수(101, 110 꼴)로 ${m} × 2 = ${2 * m}(개)이다. 따라서 ${3 * one} + ${2 * m} = ${hits(flags)}(개)이다.`;
      return N(text, hits(flags), { unit: '개', explain, facts: { count: flags, rule: form } });
    }, { standard: S2 }),
    H('hard-password4', '조건이 넷인 비밀번호', '②14', (d) => {
      const build = ([x0, y0, sh]) => { const mem = Number(sh.replace(/x/g, x0).replace(/y/g, y0)), use = range(1, 9).filter((v) => v !== x0 && v !== y0), list = perms(use, 4); return { mem, use, list, flags: list.map((t) => Number(t.join('')) > mem && t.slice(1).some((v) => (t[0] + v) % 5 === 0)) }; };
      const [x, y, shape] = d.until(() => [d.int(2, 7), d.int(1, 9), d.pick(['xyyx', 'xxyy', 'xyxy'])], (t) => t[0] !== t[1] && hits(build(t).flags) >= 20);
      const { mem: member, use: usable, flags } = build([x, y, shape]);
      const heads = usable.filter((h) => h > x), rows = heads.map((h) => { const mates = usable.filter((v) => v !== h && (h + v) % 5 === 0), rest = usable.length - 1; return [h, mates, nPr(rest, 3) - nPr(rest - mates.length, 3)]; });
      return N(`어느 체육관의 회원인 정운이는 자신의 회원 번호를 이용하여 다음 조건을 모두 만족시키는 네 자리 자연수인 비밀번호를 만들려고 한다. 정운이의 회원 번호가 ${member}일 때, 만들 수 있는 서로 다른 비밀번호의 개수는?`, hits(flags), {
        unit: '개',
        figure: lines(['㈎ 각 자리의 숫자는 모두 다르다.', '㈏ 회원 번호의 각 자리에 쓰인 숫자와 0은 사용할 수 없다.', '㈐ 회원 번호가 나타내는 수보다 큰 수이다.', '㈑ 백의 자리, 십의 자리, 일의 자리의 숫자 중에서 적어도 하나는 천의 자리의 숫자와의 합이 5의 배수이다.']),
        explain: `쓸 수 있는 숫자는 ${told(usable)}이다. ${josa(x, '은/는')} 쓸 수 없으므로 ㈐에서 천의 자리는 ${x}보다 큰 ${told(heads)}이다. ` + rows.map(([h, mates, c]) => (mates.length ? `천의 자리가 ${h}일 때 ${josa(h, '과/와')} 더해 5의 배수가 되는 숫자는 ${told(mates)}이고, 나머지 세 자리에 남은 ${usable.length - 1}개의 숫자를 나열하는 ${Pn(usable.length - 1, 3)}가지에서 이 숫자를 하나도 쓰지 않는 ${Pn(usable.length - 1 - mates.length, 3)}가지를 빼면 ${c}가지` : `천의 자리가 ${h}일 때 ${josa(h, '과/와')} 더해 5의 배수가 되는 숫자가 없으므로 0가지`)).join(', ') + `이다. 따라서 모두 ${hits(flags)}개이다.`,
        facts: { count: flags }
      });
    }, { standard: S2 }),
    H('hard-odd-sum-nine', '꺼내 나열한 세 수의 합의 홀짝과 곱이 9의 배수', '②17', (d) => {
      const top = d.int(9, 11), odd = d.bool(), all = perms(range(1, top), 3), flags = all.map(([x, y, z]) => (x + y + z) % 2 === (odd ? 1 : 0) && (x * y * z) % 9 === 0);
      const nums = range(1, top), withNine = combos(nums.filter((v) => v !== 9), 2).filter(([x, y]) => (9 + x + y) % 2 === (odd ? 1 : 0)).length, noNine = nums.filter((v) => ![3, 6, 9].includes(v) && (3 + 6 + v) % 2 === (odd ? 1 : 0)).length;
      const oddN = nums.filter((v) => v !== 9 && v % 2 === 1).length, evenN = nums.filter((v) => v % 2 === 0).length;
      const nineWay = odd ? `홀수끼리 ${Cn(oddN, 2)} = ${nCr(oddN, 2)}(가지), 짝수끼리 ${Cn(evenN, 2)} = ${nCr(evenN, 2)}(가지)로 ${withNine}가지` : `홀수와 짝수를 하나씩 ${oddN} × ${evenN} = ${withNine}(가지)`;
      return N(`1부터 ${top}까지의 자연수가 하나씩 적힌 공 ${top}개가 주머니에 들어 있다. 이 주머니에서 공 3개를 동시에 꺼내어 일렬로 나열하고, 나열된 차례대로 공에 적힌 수를 ${va}, ${vb}, ${vc}라 할 때, 다음 조건을 모두 만족시키는 경우의 수는?`, hits(flags), {
        unit: '가지',
        figure: lines([`㈎ ${nb(`${va} + ${vb} + ${vc}`)}는 ${odd ? '홀수' : '짝수'}이다.`, `㈏ ${nb(`${va} × ${vb} × ${vc}`)}는 9의 배수이다.`]),
        explain: `세 수의 곱이 9의 배수이려면 9가 있거나, 9가 없으면 3과 6이 모두 있어야 한다. 9가 있을 때 나머지 두 수의 합이 ${odd ? '짝수' : '홀수'}가 되게 고르는 경우는 ${nineWay}이고, 9가 없을 때 3, 6과 함께 고를 수 하나는 합이 ${odd ? '홀수' : '짝수'}가 되게 ${noNine}가지이다. 고른 세 수를 나열하는 3! = 6(가지)를 곱하면 (${withNine} + ${noNine}) × 6 = ${hits(flags)}(가지)이다.`,
        facts: { count: flags }
      });
    }, { standard: S2 }),
    H('hard-consecutive', '연속하는 수가 낀 세 수 고르기', '②40', (d) => {
      const n = d.int(10, 20), two = (n - 3) * (n - 2), none = nCr(n, 3) - (n - 2) - two;
      return M(`1부터 ${n}까지의 자연수가 하나씩 적혀 있는 공 ${n}개가 들어 있는 주머니에서 공 3개를 꺼낼 때, 꺼낸 공에 적힌 세 수 중 두 수만 연속하는 경우의 수와 어느 두 수도 연속하지 않는 경우의 수를 차례로 구하시오.`, [{ label: '두 수만 연속', answer: two, unit: '가지' }, { label: '어느 두 수도 연속하지 않음', answer: none, unit: '가지' }], {
        explain: `세 수가 모두 연속하는 경우는 (1, 2, 3)부터 (${n - 2}, ${n - 1}, ${n})까지 ${n - 2}가지이다. 두 수만 연속하는 경우는, 연속하는 두 수가 1, 2 또는 ${n - 1}, ${n}이면 나머지 한 수가 ${n - 3}가지씩, 그 밖의 ${n - 3}쌍이면 그 쌍과 양옆의 수를 뺀 ${n - 4}가지씩이므로 2 × ${n - 3} + ${n - 3} × ${n - 4} = ${two}(가지)이다. 따라서 어느 두 수도 연속하지 않는 경우는 ${Cn(n, 3)} − ${n - 2} − ${two} = ${nCr(n, 3)} − ${n - 2} − ${two} = ${none}(가지)이다.`,
        facts: { calc: [[`2*(${n}-3)+(${n}-3)*(${n}-4)`, 0], [`${combS(n, 3)}-(${n}-2)-(2*(${n}-3)+(${n}-3)*(${n}-4))`, 1]] }
      });
    }, { standard: S3 }),
    H('hard-bracelet', '모두 한 번씩 짝을 지어 만든 팔찌와 수익금', '②41', (d) => {
      const [T0, x, a, b, c] = d.until(() => { const t = d.int(14, 30), pr = d.pick([[200, 300, 400], [100, 200, 400], [200, 400, 500], [300, 400, 600]]); return [t, d.int(3, t - 3)].concat(pr); }, ([t, x0, a0, b0, c0]) => {
        const R = (v) => a0 * nCr(v, 2) + b0 * v * (t - v) + c0 * nCr(t - v, 2), want = R(x0);
        return range(0, t).filter((v) => R(v) === want).length === 1 && nCr(t, 2) <= 9999;
      });
      const R = (v) => a * nCr(v, 2) + b * v * (T0 - v) + c * nCr(T0 - v, 2), money = R(x);
      // 수익금 식을 정리한 x 의 이차식(또는 일차식): A x² + B x + C = 0. 공약수로 나누고 맨 앞 계수를 양수로 맞춘다.
      let A = (a + c - 2 * b) / 2, Bq = (c - a) / 2 + (b - c) * T0, C0 = c * T0 * (T0 - 1) / 2 - money;
      const g0 = gcd(gcd(Math.abs(A), Math.abs(Bq)), Math.abs(C0)) || 1, flip = (A || Bq) < 0 ? -1 : 1;
      [A, Bq, C0] = [A, Bq, C0].map((v) => (v / g0) * flip);
      const vx = V('x'), sgn = (v, first) => (v < 0 ? (first ? MINUS : ` ${MINUS} `) : (first ? '' : ' + '));
      const term = (v, body, first) => (v === 0 ? '' : sgn(v, first) + (Math.abs(v) === 1 && body ? '' : Math.abs(v)) + body);
      const polyS = (list) => { let out = '', first = true; for (const [v, body] of list) { if (!v) continue; out += term(v, body, first); first = false; } return out; };
      const Dq = Bq + A * x, g1 = gcd(Math.abs(Dq), Math.abs(A)) || 1, rp = -Dq / g1 * Math.sign(A), rq = Math.abs(A) / g1;
      const rootS = (rp < 0 ? MINUS : '') + (rq === 1 ? Math.abs(rp) : frac(Math.abs(rp), rq));
      const solveS = A === 0
        ? `${vx}<sup>2</sup>의 항이 없어지고, 정리하면 ${nb(`${polyS([[Bq, vx], [C0, '']])} = 0`)}이므로 ${vx} = ${x}이다`
        : `정리하면 ${nb(`${polyS([[A, `${vx}<sup>2</sup>`], [Bq, vx], [C0, '']])} = 0`)}, 곧 ${nb(`(${vx} ${MINUS} ${x})(${polyS([[A, vx], [Dq, '']])}) = 0`)}이다. ${nb(`${vx} = ${rootS}`)}${tail(Math.abs(rp), '은/는')} 0 이상 ${T0} 이하의 정수가 아니므로 ${vx} = ${x}이다`;
      return M(`어느 고등학교에 1, 2학년 학생 ${T0}명으로 이루어진 공예 동아리가 있다. 회원끼리 모두 한 번씩 짝을 지어 짝마다 팔찌를 하나씩 만들어 판매하려고 한다. 1학년끼리 만든 팔찌는 ${a}원, 1학년과 2학년이 함께 만든 팔찌는 ${b}원, 2학년끼리 만든 팔찌는 ${c}원에 판다. 팔찌가 모두 판매되어 수익금이 ${money}원일 때, 1학년 학생 수와 만든 팔찌의 개수를 차례로 구하시오.`, [{ label: '1학년', answer: x, unit: '명' }, { label: '팔찌', answer: nCr(T0, 2), unit: '개' }], {
        explain: `팔찌는 ${T0}명 가운데 2명을 고르는 경우마다 하나이므로 ${Cn(T0, 2)} = ${nCr(T0, 2)}(개)이다. 1학년을 ${V('x')}명이라 하면 2학년은 ${eqn(`(${T0} − ${V('x')})`)}명이고 ${eqn(`${a} × ${Cn(V('x'), 2)} + ${b} × ${V('x')}(${T0} − ${V('x')}) + ${c} × ${Cn(`${T0}${MINUS}${V('x')}`, 2)} = ${money}`)}이다. ${solveS}(1학년끼리 ${nCr(x, 2)}개, 함께 ${x * (T0 - x)}개, 2학년끼리 ${nCr(T0 - x, 2)}개).`,
        facts: Object.assign(eqDigit(`${a}*□*(□-1)/2+${b}*□*(${T0}-□)+${c}*(${T0}-□)*(${T0}-□-1)/2`, money, 0, T0), { calc: [[combS(T0, 2), 1]] })
      });
    }, { standard: S3 })
  ];

  B.addGroup(UNIT, { id: 'hard', title: '실력 문제', standard: S1, types: hardTypes });
})(typeof window !== 'undefined' ? window : globalThis);
