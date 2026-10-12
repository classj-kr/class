// 중학교 1학년 2학기 1단원 기본 도형 — 실력 문항.
// 단원 틀과 그림 도구, 싣는 기준, 뺀 것과 까닭은 7-2-1a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 교점·교선을 「처음 도형의 꼭짓점·모서리」로만 센다. 잘라 낸 자리에 새로 생긴 면의 변과 꼭짓점을 빠뜨린다.
//  - 두 점을 고르면 언제나 새 직선·새 반직선이 생긴다고 여긴다. 한 직선 위의 점들은 어느 둘을 골라도 같은 직선이고, 시작점과 방향이 같으면 같은 반직선이다.
//  - 그림에서 같아 보이면 같다고 한다. 중점이라는 조건이 없는 두 선분의 길이를 같다고 놓는다(AM = BN).
//  - 맞꼭지각을 「한 칸짜리 마주 보는 각」으로만 안다. 세 직선이 한 점에서 만나면 두 칸을 합친 각끼리도 맞꼭지각이다.
//  - 점과 직선 사이의 거리를 그 점에서 나온 아무 변의 길이로 읽는다. 거리는 수선의 발까지의 길이이고, 비스듬한 변의 길이는 거리가 아니다.
//  - 변이 떨어져 있으면 직선도 만나지 않는다고 여긴다. 평행하지 않은 두 직선은 한 평면 위에서 반드시 만난다.
//  - 「만난다」와 「수직이다」를 같은 말로 쓴다. 면의 대각선은 그 면의 변과 만나지만 수직은 아니다.
//  - 떨어져 있는 모서리는 모두 꼬인 위치라고 한다. 같은 면 위에 있으면 늘여서 만나거나 평행하므로 꼬인 위치가 아니다.
//  - 평면에서 참인 것(한 직선에 수직인 두 직선은 평행하다)을 공간에서도 참이라고 한다.
//  - 동위각·엇각은 크기가 같은 각이라고 외운다. 자리로 정해지는 이름이고, 크기가 같은 것은 두 직선이 평행할 때뿐이다.
//  - 적힌 수가 같아 보이는 두 직선을 평행하다고 한다. 같은 자리(동위각)나 엇갈린 자리(엇각)로 옮겨서 견주어야 한다.
//
// 실력에는 ① 그림·말에 함정이 있어 배운 뜻을 정확히 대야 풀리는 문제와 ② 두 번 넘게 생각해야 풀리는 문제(중점을 거듭 쓰는 길이, 비로 두 번 나눈 선분,
// 직각과 몇 배 조건으로 차례로 정해지는 각, 평각으로 x를 구한 다음 합친 각의 맞꼭지각, 평행선에 얹힌 삼각형, 두 번 꺾인 선, 꺾인 각을 나눈 각, 한 번 접은 종이)만 실었다.
// 기본에서 하는 일을 고르기로 바꾼 것, 그림에서 답이 한눈에 보이는 것은 싣지 않았다(평행한 직선 찾기는 2~3°만 기울여 그려 눈으로 가리기 어렵다).
// 묻는 말: 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, C } = B.kit;
  const { LAB, V, range } = B.kit.mid;
  const K = B.kit.m721;
  const { STD1, STD2, H, pt, angV, deg, SG, LN, list, setQ, tagQ, mixRows, RAD, pol, dirOf, wide, CREAM, sheet, onLine, star, relLL, perpLL, relLP, perpLP, relPP, perpPP, share, others, SOL, drawSolid, solidSay, para, sector, sizeAt, SPOT, bendFig, bendSay, solidFig, sortOut } = K;
  const lv = (c) => V(c);
  const EXT = ' (단, 모서리의 위치 관계는 모서리를 연장한 직선의 위치 관계로 생각한다.)', EXTP = ' (단, 면의 위치 관계는 면을 넓힌 평면의 위치 관계로 생각한다.)';

  // 두 번 꺾인 선: 직선 l 위의 점에서 왼쪽 아래로(직선 l 과 a°) → 첫째 꺾인 점(왼쪽으로 볼록, 안쪽 각 a + u) → 오른쪽 아래로 → 둘째 꺾인 점(오른쪽으로 볼록, 안쪽 각 u + b) → 왼쪽 아래로 직선 m 위의 점(직선 m 과 b°).
  // o: { p, k1, k2, q: 그 자리에 적는 글, k2Right: 둘째 꺾인 각에 직각 표시, flip: 좌우를 뒤집는다 }
  function zigFig(a, u, b, o) {
    const Hh = 124, h1 = Hh * 0.3, h2 = Hh * 0.38, h3 = Hh - h1 - h2, x0 = 0, x1 = x0 - h1 / Math.tan(a * RAD), x2 = x1 + h2 / Math.tan(u * RAD), x3 = x2 - h3 / Math.tan(b * RAD);
    const lo = Math.min(x0, x1, x2, x3), hi = Math.max(x0, x1, x2, x3), w = hi - lo + 112, sh = 56 - lo, S = para({ w, gap: Hh }), fx = (x) => (o.flip ? w - (x + sh) : x + sh);
    const P = [fx(x0), Hh], K1 = [fx(x1), Hh - h1], K2 = [fx(x2), Hh - h1 - h2], Q = [fx(x3), 0];
    S.seg(P, K1).seg(K1, K2).seg(K2, Q);
    const put = (v, r, t) => { if (!t) return; let [f, to] = o.flip ? [180 - r[1], 180 - r[0]] : r; while (f < 0) { f += 360; to += 360; } S.angle(v, f, to, t); };
    put(P, [180, 180 + a], o.p); put(K1, [-u, a], o.k1); put(Q, [0, b], o.q);
    if (o.k2Right) S.right(K2, o.flip ? 360 - b : 180 - u, 8); else put(K2, [180 - u, 180 + b], o.k2);
    return S;
  }
  const zigSay = (flip, more) => `평행한 두 직선 l(위), m(아래) 사이에 두 번 꺾인 선이 있다. 직선 l 위의 점에서 ${flip ? '오른쪽' : '왼쪽'} 아래로 내려온 선분이 첫째 꺾인 점에서 ${flip ? '왼쪽' : '오른쪽'} 아래로 꺾이고, 둘째 꺾인 점에서 다시 ${flip ? '오른쪽' : '왼쪽'} 아래로 꺾여 직선 m 위의 점에 닿는다. ${more}`;

  // 한 번 접은 직사각형 종이: 아랫변 위의 점 E 와 윗변 위의 점 F 를 잇는 선으로 오른쪽을 접어 올린다. t 는 접는 선과 변이 이루는 각.
  // 접혀 올라간 아랫변이 윗변과 만나는 점이 G 이다. 겹친 삼각형 GEF 의 두 밑각은 t, 꼭지각은 180 − 2t 이다.
  function foldFig(t, o) {
    const h = 54, e = 96, W = e + 104, E = [e, 0], Fp = [e + h / Math.tan(t * RAD), h], G = [e + h / Math.tan(2 * t * RAD), h], dv = [Math.cos(t * RAD), Math.sin(t * RAD)], S = sheet();
    const refl = (p) => { const v = [p[0] - e, p[1]], along = v[0] * dv[0] + v[1] * dv[1]; return [e + 2 * along * dv[0] - v[0], 2 * along * dv[1] - v[1]]; };
    const A = [0, h], Bp = [0, 0], Cp = [W, 0], Dp = [W, h], C2 = refl(Cp), D2 = refl(Dp);
    S.poly([A, Bp, E, Fp], 'fill:#eef2f7;stroke:#1f2933;stroke-width:1.5;stroke-linejoin:round').poly([E, C2, D2, Fp], 'fill:rgba(148,163,184,0.45);stroke:#1f2933;stroke-width:1.5;stroke-linejoin:round');
    S.seg(E, Cp, 'dash').seg(Cp, Dp, 'dash').seg(Dp, Fp, 'dash');
    if (o.names) { S.name(A, 'A', 135).name(Bp, 'B', 225).name(Cp, 'C', 315).name(Dp, 'D', 45).name(E, 'E', 270, 12).name(Fp, 'F', 35, 13).name(G, 'G', 120, 12); }
    if (o.fold) S.angle(Fp, 180, 180 + t, o.fold);
    if (o.rise) S.angle(G, 180, 180 + 2 * t, o.rise, { r: 13 });
    if (o.apex) S.angle(G, 180 + 2 * t, 360, o.apex, { r: 13 });
    return S;
  }

  B.addGroup('7-2-1', {
    id: 'hard', title: '실력 문제', standard: STD1,
    types: [
      // ── ① 그림·말에 함정이 있어 배운 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-cut-count', '한 귀퉁이를 잘라 낸 직육면체의 교점과 교선', '심2', (d) => {
        // 함정: 직육면체의 꼭짓점 8개·모서리 12개를 그대로 답하는 아이, 잘린 면의 변 3개는 세고 없어진 꼭짓점을 빼지 않아 11개라 하는 아이.
        const sol = SOL.chip(4, 2.6, 3, d.pick([1, 1.2, 1.4])), v = Object.keys(sol.V).length, e = sol.edges.length;
        if (v !== 10 || e !== 15) throw new Error('잘라 낸 입체의 꼭짓점·모서리 수가 어긋났다');
        return M('다음 그림은 직육면체의 한 귀퉁이를 평면으로 잘라 낸 입체도형이다. 이 입체도형에서 교점의 개수와 교선의 개수를 차례로 구하시오.', [{ label: '교점', answer: v, unit: '개' }, { label: '교선', answer: e, unit: '개' }], {
          figure: drawSolid(sol, { names: false, size: [158, 116], label: '직육면체에서 앞쪽 오른쪽 위의 귀퉁이를 평면으로 잘라 낸 입체도형의 겨냥도. 잘린 자리에 삼각형 모양의 면이 생겼고, 그 면의 세 꼭짓점은 잘린 귀퉁이에 모이던 세 모서리 위에 하나씩 있다.' }),
          explain: '교점은 모서리가 만나는 꼭짓점이고 교선은 면과 면이 만나는 모서리이다. 직육면체의 꼭짓점은 8개, 모서리는 12개이다. 귀퉁이를 잘라 내면 꼭짓점 1개가 없어지고 잘린 면의 꼭짓점 3개가 생기므로 교점은 8 − 1 + 3 = 10(개)이다. 잘린 면의 변 3개가 새로 생기므로 교선은 12 + 3 = 15(개)이다.',
          facts: { calc: [['8-1+3', 0], ['12+3', 1]], unseen: [8, 1, 3, 12] } });
      }),
      H('hard-count-lines', '몇 개만 한 직선 위에 있는 점으로 만드는 직선과 반직선의 개수', '기본 ①13 / 심5·6', (d) => {
        // 함정: 두 점을 고르는 방법의 수만큼 직선이 있다고 세는 아이(네 점 6개, 다섯 점 10개), 반직선을 그 2배로 세는 아이.
        const k = d.pick([3, 4]), on = 'ABCD'.slice(0, k).split(''), off = k === 3 ? 'D' : 'P', tiltA = d.pick([0, 8, -8]), S = sheet(), O = [0, 0], step = k === 3 ? 74 : 58;
        const pts = {}; on.forEach((nm, i) => { pts[nm] = pol(O, tiltA, i * step); }); pts[off] = pol(pol(O, tiltA, step * (k - 1) * d.pick([0.3, 0.5, 0.7])), tiltA + 90, 62);
        S.seg(pol(O, tiltA + 180, 20), pol(O, tiltA, step * (k - 1) + 20), 'thin');
        Object.keys(pts).forEach((nm) => { S.dot(pts[nm], 3); S.name(pts[nm], nm, nm === off ? 90 : tiltA - 90, 12); });
        // 따로 센다: 직선은 지나는 점의 묶음으로, 반직선은 시작점과 방향으로 가린다.
        const names = Object.keys(pts), linesSeen = new Set(), raysSeen = new Set(), col = (p, q, r) => Math.abs((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])) < 1e-6;
        names.forEach((p) => names.forEach((q) => { if (p === q) return; linesSeen.add(names.filter((r) => col(pts[p], pts[q], pts[r])).sort().join('')); raysSeen.add(p + ':' + Math.round(dirOf(pts[p], pts[q]))); }));
        const nl = linesSeen.size, nr = raysSeen.size;
        if (nl !== 1 + k || nr !== 2 * (k - 1) + 2 * k) throw new Error('직선·반직선의 수가 어긋났다');
        return M(`다음 그림과 같이 ${k === 3 ? '네' : '다섯'} 점 ${list(on)}, ${off}${pt(off, '이/가')} 있고, 이 가운데 ${k === 3 ? '세' : '네'} 점 ${list(on)}${pt(on[k - 1], '은/는')} 한 직선 위에 있다. 두 점을 지나는 서로 다른 직선의 개수와 반직선의 개수를 차례로 구하시오.`, [{ label: '직선', answer: nl, unit: '개' }, { label: '반직선', answer: nr, unit: '개' }], {
          figure: S.out(`한 직선 위에 점 ${list(on)}${pt(on[k - 1], '이/가')} 차례로 있고, 그 직선 밖에 점 ${off}${pt(off, '이/가')} 있다.`),
          explain: `점 ${list(on)} 가운데 어느 두 점을 지나도 같은 직선이므로 이 직선 1개와, 점 ${off}${pt(off, '과/와')} 나머지 점을 각각 지나는 직선 ${k}개를 합하여 직선은 ${nl}개이다. 한 직선 위의 ${k}개의 점으로 만드는 반직선은 양 끝 점에서 1개씩, 사이의 점에서 2개씩 ${2 * (k - 1)}개이고, 점 ${off}${pt(off, '을/를')} 지나는 직선 ${k}개마다 반직선이 2개씩 ${2 * k}개이므로 반직선은 ${2 * (k - 1)} + ${2 * k} = ${nr}(개)이다.`,
          facts: { calc: [[`1+${k}`, 0], [`2*(${k}-1)+2*${k}`, 1]], unseen: [1, 2, k] } });
      }),
      H('hard-two-mids-claims', '두 선분의 중점이 주어졌을 때 항상 옳은 길이 사이의 관계', '심13', (d) => {
        // 함정: 그림에서 AM 과 BN 이 비슷해 보인다(두 선분의 길이는 11 : 12). 주어지지 않은 AB = BC 를 쓰는 아이가 ㉠ 꼴을 고른다.
        const names = ['A', 'M', 'B', 'N', 'C'], flip = d.bool(), drawn = flip ? [6, 5.5] : [5.5, 6];
        const posOf = ([p, q]) => [0, p, 2 * p, 2 * p + q, 2 * p + 2 * q], len = (s, pq) => { const pos = posOf(pq); return Math.abs(pos[names.indexOf(s[0])] - pos[names.indexOf(s[1])]); };
        // 두 선분의 길이를 서로 다르게 두 가지로 놓아 보아도 성립하면 항상 옳다.
        const always = (x, p, q, y) => [[5, 8], [9, 4]].every((pq) => Math.abs(len(x, pq) * q - len(y, pq) * p) < 1e-9), told = (x, p, q, y) => `${SG(x)} = ${q === 1 ? (p === 1 ? '' : p) : frac(p, q)}${SG(y)}`;
        const no = `${SG('AB')}${pt('B', '과/와')} ${SG('BC')}의 길이가 같다는 조건이 없으므로`;
        const TRAP = [['AM', 1, 1, 'BN', `${no} ${SG('AM')} = ${SG('BN')}이라고 할 수 없다.`], ['AB', 1, 1, 'BC', `${no} 옳다고 할 수 없다.`], ['MN', 2, 1, 'MB', `${SG('MN')} = ${SG('MB')} + ${SG('BN')}이고, ${no} ${SG('BN')} = ${SG('MB')}라고 할 수 없다.`], ['AN', 1, 1, 'MC', `${no} 옳다고 할 수 없다.`], ['MN', 1, 1, 'AB', `${SG('MN')} = ${frac(1, 2)}${SG('AC')}이고, ${no} ${SG('AC')} = 2${SG('AB')}라고 할 수 없다.`]];
        const SURE = [['MN', 1, 2, 'AC'], ['AC', 2, 1, 'MN'], ['AB', 2, 1, 'MB'], ['BN', 1, 1, 'NC'], ['BC', 2, 1, 'BN'], ['AM', 1, 2, 'AB']];
        const rows = d.shuffle(d.shuffle(TRAP).slice(0, 2).concat(d.shuffle(SURE).slice(0, 2))).map(([x, p, q, y, why]) => ({ s: told(x, p, q, y), ok: always(x, p, q, y), why: why || '' }));
        if (rows.filter((r) => r.ok).length !== 2) throw new Error('항상 옳은 식의 수가 어긋났다');
        return tagQ(d, `다음 그림에서 점 M은 ${SG('AB')}의 중점이고 점 N은 ${SG('BC')}의 중점이다. 다음 가운데 항상 옳은 것을 모두 고른 것은?`, rows, { figure: onLine(names, posOf(drawn), { ends: 'seg' }),
          lead: `${SG('AM')} = ${SG('MB')}, ${SG('BN')} = ${SG('NC')}이므로 ${SG('MN')} = ${SG('MB')} + ${SG('BN')} = ${frac(1, 2)}${SG('AB')} + ${frac(1, 2)}${SG('BC')} = ${frac(1, 2)}${SG('AC')}이다.` });
      }),
      H('hard-vert-pairs', '세 직선이 한 점에서 만날 때 맞꼭지각의 쌍', '기본 ②32', (d) => {
        // 함정: 한 칸짜리 각끼리만 세어 3쌍이라고 하는 아이. 맞꼭지각은 「두 직선」이 만나 생기는 각이므로 두 직선씩 짝 지어 본다.
        const a0 = d.int(0, 20), a1 = a0 + d.int(50, 68), a2 = a1 + d.int(50, 68), cuts = [a0, a1, a2, a0 + 180, a1 + 180, a2 + 180, a0 + 360], L = 'abcdef';
        const S = star([a0, a1, a2].reduce((all, a) => all.concat([{ a, len: 78 }, { a: a + 180, len: 78 }]), []), range(0, 5).map((i) => ({ from: cuts[i], to: cuts[i + 1], t: '{' + L[i] + '}', r: 15, d: 32 })));
        // 따로 센다: 이웃한 반직선 한 칸이나 두 칸으로 이루어진 각 12개가 마주 보는 것끼리 짝을 이룬다.
        const angles = []; for (let i = 0; i < 6; i += 1) for (const span of [1, 2]) angles.push([i, span]);
        const pairs = angles.filter(([i]) => i < 3).length;
        if (pairs !== 6) throw new Error('맞꼭지각의 쌍이 어긋났다');
        return N('다음 그림과 같이 세 직선이 한 점에서 만날 때 생기는 맞꼭지각은 모두 몇 쌍인가?', pairs, { unit: '쌍',
          figure: S.out('한 점에서 만나는 세 직선이 만드는 여섯 각. 오른쪽에서 시작하여 시계 반대 방향으로 차례로 ∠a, ∠b, ∠c, ∠d, ∠e, ∠f이다.'),
          explain: `맞꼭지각은 두 직선이 만나서 생기는 마주 보는 각이다. 세 직선 가운데 두 직선을 고르는 방법은 3가지이고, 두 직선이 만나면 맞꼭지각이 2쌍 생기므로 3 × 2 = 6(쌍)이다. ${angV('a')}${pt('a', '과/와')} ${angV('d')}, ${angV('b')}${pt('b', '과/와')} ${angV('e')}, ${angV('c')}${pt('c', '과/와')} ${angV('f')}의 3쌍과, 이웃한 두 각을 합친 ${angV('a')} + ${angV('b')}${pt('b', '과/와')} ${angV('d')} + ${angV('e')}, ${angV('b')} + ${angV('c')}${pt('c', '과/와')} ${angV('e')} + ${angV('f')}, ${angV('c')} + ${angV('d')}${pt('d', '과/와')} ${angV('f')} + ${angV('a')}의 3쌍이다.`,
          facts: { calc: [['3*2', 0]], unseen: [3, 2] } });
      }),
      H('hard-perp-distance', '비스듬한 변의 길이가 함께 적힌 그림에서 점과 직선 사이의 거리', '심24·25 / 기본 ②36', (d, n) => {
        if (n === 0) {
          // 사다리꼴(직각 둘): 비스듬한 변의 길이까지 모두 적는다(직각삼각형의 세 변이 되게). 함정: 비스듬한 변의 길이를 거리로 답하는 아이.
          const [dx, h, hyp] = d.pick([[3, 4, 5], [6, 8, 10], [8, 6, 10], [4, 3, 5], [5, 12, 13]]), top = d.until(() => d.int(3, 8), (t) => t !== h && t + dx !== h && t !== hyp && t + dx !== hyp && t * Math.min(15, 172 / (t + dx), 130 / h) >= 58), bot = top + dx, mirror = d.bool(), u = Math.min(15, 172 / bot, 130 / h);
          const Pt = mirror ? { A: [dx * u, h * u], B: [0, 0], C: [bot * u, 0], D: [bot * u, h * u] } : { A: [0, h * u], B: [0, 0], C: [bot * u, 0], D: [top * u, h * u] }, cen = [bot * u / 2, h * u / 2], S = sheet();
          S.poly(['A', 'B', 'C', 'D'].map((k) => Pt[k]), 'fill:' + CREAM + ';stroke:#1f2933;stroke-width:1.6;stroke-linejoin:round');
          if (mirror) S.right(Pt.C, 90, 8).right(Pt.D, 180, 8); else S.right(Pt.A, 270, 8).right(Pt.B, 0, 8);
          'ABCD'.split('').forEach((k) => S.name(Pt[k], k, dirOf(cen, Pt[k]), 12));
          const up = mirror ? 'CD' : 'AB', slant = mirror ? 'AB' : 'CD', [p, line] = d.pick(mirror ? [['A', 'BC'], ['B', 'AD']] : [['D', 'BC'], ['C', 'AD']]);
          S.side(Pt.A, Pt.D, top + ' cm', cen).side(Pt.B, Pt.C, bot + ' cm', cen).side(Pt[up[0]], Pt[up[1]], h + ' cm', cen).side(Pt[slant[0]], Pt[slant[1]], hyp + ' cm', cen);
          return N(`다음 사다리꼴 ABCD에서 점 ${p}${pt(p, '과/와')} 직선 ${line} 사이의 거리는 몇 cm인가?`, h, { unit: 'cm',
            figure: S.out(`사다리꼴 ABCD. 점 A는 왼쪽 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래, 점 D는 오른쪽 위에 있다. ${mirror ? '∠C와 ∠D' : '∠A와 ∠B'}에 직각 표시가 있다. 변 AD의 길이는 ${top} cm, 변 BC의 길이는 ${bot} cm, 변 ${up}의 길이는 ${h} cm, 비스듬한 변 ${slant}의 길이는 ${hyp} cm이다.`),
            explain: `변 AD와 변 BC는 모두 변 ${up}에 수직이므로 서로 평행하고, 두 변 사이의 거리는 변 ${up}의 길이와 같다. 점 ${p}에서 직선 ${line}에 내린 수선의 길이도 ${h} cm이다. 변 ${slant}${pt(slant, '은/는')} 직선 ${line}에 수직이 아니므로 그 길이 ${hyp} cm는 거리가 아니다.`, facts: { calc: [[String(h), 0]] } });
        }
        // 직각삼각형과 빗변에 내린 수선: 세 변과 수선의 길이를 모두 적는다(15 : 20 : 25, 높이 12). 함정: 빗변이나 옆의 변의 길이를 거리로 답하는 아이.
        const k = d.pick([1, 2]), swap = d.bool(), ab = (swap ? 20 : 15) * k, bc = (swap ? 15 : 20) * k, ac = 25 * k, bd = 12 * k, ad = ab * ab / ac, u = 216 / ac;
        const A = [0, 0], Cp = [ac * u, 0], Dp = [ad * u, 0], Bp = [ad * u, bd * u], cen = [(A[0] + Cp[0] + Bp[0]) / 3, bd * u / 3], S = sheet();
        S.poly([A, Bp, Cp], 'fill:' + CREAM + ';stroke:#1f2933;stroke-width:1.6;stroke-linejoin:round').seg(Bp, Dp, 'thin').right(Dp, swap ? 90 : 0, 7).right(Bp, dirOf(Bp, A), 7);
        S.name(A, 'A', 200, 12).name(Bp, 'B', 90).name(Cp, 'C', 340, 12).name(Dp, 'D', 270, 12);
        S.side(A, Bp, ab + ' cm', cen).side(Bp, Cp, bc + ' cm', cen).text([Dp[0] + (swap ? -1 : 1) * (5 + wide(bd + ' cm', 12) / 2), bd * u * 0.42], bd + ' cm', { small: true }).span(A, Cp, ac + ' cm', false, 26);
        const second = d.pick([['C', 'AB', bc, 'BC'], ['A', 'BC', ab, 'AB']]);
        return M(`다음 그림과 같이 ∠ABC = 90°인 직각삼각형 ABC의 꼭짓점 B에서 변 AC에 내린 수선의 발을 D라고 할 때, ㉠ 점 B와 직선 AC 사이의 거리, ㉡ 점 ${second[0]}${pt(second[0], '과/와')} 직선 ${second[1]} 사이의 거리를 차례로 구하시오.`, [{ label: '㉠', answer: bd, unit: 'cm' }, { label: '㉡', answer: second[2], unit: 'cm' }], {
          figure: S.out(`직각삼각형 ABC. 변 AC가 아래에 가로로 놓여 있고(점 A 왼쪽, 점 C 오른쪽) 꼭짓점 B가 위에 있다. ∠ABC에 직각 표시가 있다. 점 B에서 변 AC에 내린 수선의 발이 점 D이고 점 D에 직각 표시가 있다. 변 AB의 길이는 ${ab} cm, 변 BC의 길이는 ${bc} cm, 변 AC의 길이는 ${ac} cm, 선분 BD의 길이는 ${bd} cm이다.`),
          explain: `점 B에서 직선 AC에 내린 수선의 발이 점 D이므로 점 B와 직선 AC 사이의 거리는 ${SG('BD')}의 길이인 ${bd} cm이다. ∠ABC = 90°이므로 점 ${second[0]}에서 직선 ${second[1]}에 내린 수선의 발은 점 B이고, 점 ${second[0]}${pt(second[0], '과/와')} 직선 ${second[1]} 사이의 거리는 ${SG(second[3])}의 길이인 ${second[2]} cm이다. 변 AC의 길이 ${ac} cm는 거리가 아니다.`,
          facts: { calc: [[String(bd), 0], [String(second[2]), 1]] } });
      }, { count: 2 }),
      H('hard-quad-lines', '떨어져 있는 변을 연장한 직선의 위치 관계', '심27 / 기본 ②42', (d) => {
        // 함정: 변 AB 와 변 CD 가 떨어져 있어 직선도 만나지 않는다고 여기는 아이, 만나면 수직이라고 여기는 아이(∠B = 60°).
        const tB = d.pick([55, 60, 65, 70]), h = 78, w = d.int(150, 172), Pt = { B: [0, 0], C: [w, 0], D: [w, h], A: [h / Math.tan(tB * RAD), h] }, cen = [w / 2 + 10, h / 2], S = sheet();
        S.poly(['A', 'B', 'C', 'D'].map((k) => Pt[k]), 'fill:' + CREAM + ';stroke:#1f2933;stroke-width:1.6;stroke-linejoin:round').right(Pt.C, 90, 8).right(Pt.D, 180, 8).angle(Pt.B, 0, tB, deg(tB));
        'ABCD'.split('').forEach((k) => S.name(Pt[k], k, dirOf(cen, Pt[k]), 12));
        const vec = (s) => [Pt[s[1]][0] - Pt[s[0]][0], Pt[s[1]][1] - Pt[s[0]][1]], cr = (u, v) => u[0] * v[1] - u[1] * v[0], dt = (u, v) => u[0] * v[0] + u[1] * v[1];
        const par = (s, r) => Math.abs(cr(vec(s), vec(r))) < 1e-6, perp = (s, r) => Math.abs(dt(vec(s), vec(r))) < 1e-6, on = (p, s) => Math.abs(cr(vec(s), [Pt[p][0] - Pt[s[0]][0], Pt[p][1] - Pt[s[0]][1]])) < 1e-6;
        const ext = d.pick([{ g: 'ext', ok: !par('AB', 'CD'), s: '직선 AB와 직선 CD는 한 점에서 만난다.' }, { g: 'ext', ok: par('AB', 'CD'), s: '직선 AB와 직선 CD는 만나지 않는다.', why: '직선 AB와 직선 CD는 평행하지 않으므로 연장하면 한 점에서 만난다.' }]);
        const POOL = [
          { g: 'par', ok: par('AD', 'BC'), s: '직선 AD와 직선 BC는 평행하다.' }, { g: 'p1', ok: perp('AD', 'CD'), s: '직선 AD와 직선 CD는 수직으로 만난다.' },
          { g: 'p2', ok: perp('AB', 'BC'), s: '직선 AB와 직선 BC는 수직으로 만난다.', why: `직선 AB와 직선 BC는 점 B에서 만나지만 ∠ABC = ${tB}°이므로 수직이 아니다.` },
          { g: 'on', ok: on('A', 'BC'), s: '점 A는 직선 BC 위에 있다.', why: '점 A는 직선 BC 위에 있지 않다.' }, { g: 'on', ok: on('D', 'AD'), s: '점 D는 직선 AD 위에 있다.' },
          { g: 'x', ok: on('B', 'AB') && on('B', 'CD'), s: '점 B는 두 직선 AB, CD의 교점이다.', why: '점 B는 직선 CD 위에 있지 않으므로 두 직선 AB, CD의 교점이 아니다.' }, { g: 'x', ok: on('C', 'BC') && on('C', 'CD'), s: '점 C는 두 직선 BC, CD의 교점이다.' }
        ];
        const rows = d.until(() => d.shuffle([ext].concat(mixRows(d, POOL, 3))), (r) => r.some((x) => x.ok) && r.some((x) => !x.ok));
        return tagQ(d, '다음 사다리꼴 ABCD의 각 변을 연장한 직선에 대한 설명 가운데 옳은 것을 모두 고른 것은?', rows, {
          figure: S.out(`사다리꼴 ABCD. 점 A는 왼쪽 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래, 점 D는 오른쪽 위에 있다. ∠C와 ∠D에 직각 표시가 있고 ∠ABC = ${tB}°이다. 위쪽의 변 AD가 아래쪽의 변 BC보다 짧다.`) });
      }),
      H('hard-diag-perp', '면의 대각선과 수직으로 만나는 모서리', '심28', (d) => {
        // 함정: 만나는 모서리 6개를 모두 세는 아이(만난다 ≠ 수직이다), 같은 면의 네 변을 세는 아이.
        const sol = SOL.box(4, 2.6, 3), f = d.pick(['ABCD', 'BFGC', 'CGHD']), dg = (d.bool() ? f[0] + f[2] : f[1] + f[3]).split('').sort().join(''), flags = sol.edges.map((g) => perpLL(sol, dg, g)), hit = sol.edges.filter((_, i) => flags[i]), meet = sol.edges.filter((g) => relLL(sol, dg, g) === 'meet');
        if (hit.length !== 2 || !hit.every((g) => perpLP(sol, g, f))) throw new Error('수직인 모서리가 어긋났다');
        return N(`다음 직육면체에서 선분 ${dg}${pt(dg, '과/와')} 수직으로 만나는 모서리는 모두 몇 개인가?`, hit.length, { unit: '개', figure: solidFig(sol, { extra: [dg.split('')], say: `면 ${f} 위에 대각선 ${dg}${pt(dg, '이/가')} 그어져 있다. 직육면체의 세 모서리의 길이는 서로 다르다.` }),
          explain: `선분 ${dg}${pt(dg, '과/와')} 만나는 모서리는 ${list(meet)}의 ${meet.length}개이다. 이 가운데 모서리 ${list(hit)}${pt(hit[1], '은/는')} 면 ${f}에 수직이므로 그 면 위에 있는 선분 ${dg}${pt(dg, '과/와')} 수직이다. 나머지 네 모서리는 면 ${f}의 변이어서 대각선 ${dg}${pt(dg, '과/와')} 만나지만 직각을 이루지 않는다.`, facts: { count: flags } });
      }),
      H('hard-prism-skew', '정다각기둥에서 꼬인 위치에 있는 모서리', '기본 ①54 ②47 / 심29', (d, n) => {
        // 함정: 같은 밑면에서 떨어져 있는 모서리를 꼬인 위치로 세는 아이. 같은 평면 위의 두 직선은 평행하지 않으면 늘여서 만난다.
        const k = n === 0 ? 6 : 5, sol = SOL.prism(k, 3), base = sol.faces.slice(0, 2), e = d.pick(sol.edges.filter((x) => base.some((f) => f.includes(x[0]) && f.includes(x[1])))), rest = others(sol, e), flags = rest.map((g) => relLL(sol, e, g) === 'skew');
        const by = (r) => rest.filter((g) => relLL(sol, e, g) === r), far = by('meet').filter((g) => !share(e, g)), skew = by('skew');
        if (!far.length) throw new Error('늘여서 만나는 모서리가 없다');
        return N(`다음 ${sol.kind}에서 모서리 ${e}${pt(e, '과/와')} 꼬인 위치에 있는 모서리는 모두 몇 개인가?` + (k === 6 ? ' (단, 정육각형에서 마주 보는 변은 서로 평행하고, 모서리의 위치 관계는 모서리를 연장한 직선의 위치 관계로 생각한다.)' : EXT), skew.length, { unit: '개',
          figure: drawSolid(sol, { size: [210, 150], label: solidSay(sol) }),
          explain: `모서리 ${e}${pt(e, '과/와')} 평행한 모서리는 ${list(by('para'))}, 끝 점에서 만나는 모서리는 ${list(by('meet').filter((g) => share(e, g)))}이다. 모서리 ${list(far)}${pt(far[far.length - 1], '은/는')} 모서리 ${e}${pt(e, '과/와')} 떨어져 있지만 같은 밑면 위에 있고 평행하지 않으므로 연장하면 만난다. 꼬인 위치에 있는 모서리는 나머지 ${list(skew)}의 ${skew.length}개이다.`, facts: { count: flags } });
      }, { count: 2 }),
      H('hard-corner-cut', '꼭짓점을 잘라 낸 직육면체에서의 위치 관계', '심32·33 / 기본 ①57 ②53', (d, n) => {
        // 함정: 잘린 면의 변(AG, AC, CG)을 모서리로 보지 않는 아이, 꼭짓점에서만 닿는 두 면은 만나지 않는다고 여기는 아이.
        const sol = SOL.corner(4, 2.8, 3), head = '다음 그림은 직육면체에서 한 꼭짓점을, 그 꼭짓점과 이웃한 세 꼭짓점 A, C, G를 지나는 평면으로 잘라 낸 입체도형이다. ', figure = solidFig(sol, { size: [158, 116] });
        if (n === 0) {
          const e = d.pick(['AG', 'AC', 'CG']), rest = others(sol, e), flags = rest.map((g) => relLL(sol, e, g) === 'skew'), skew = rest.filter((_, i) => flags[i]);
          if (rest.some((g) => relLL(sol, e, g) === 'meet' && !share(e, g))) throw new Error('늘여서 만나는 모서리가 있다');
          return N(head + `모서리 ${e}${pt(e, '과/와')} 꼬인 위치에 있는 모서리는 모두 몇 개인가?`, skew.length, { unit: '개', figure,
            explain: `이 입체도형의 모서리는 잘린 면의 세 변 AC, AG, CG를 더하여 모두 ${sol.edges.length}개이다. 모서리 ${e}${pt(e, '과/와')} ${sortOut(sol, e)}이다. 꼬인 위치에 있는 모서리는 ${skew.length}개이다.`, facts: { count: flags } });
        }
        const f = d.pick(['ADG', 'ABC', 'GCF']), rest = sol.faces.filter((g) => g !== f), flags = rest.map((g) => relPP(sol, f, g) === 'meet' && perpPP(sol, f, g)), hit = rest.filter((_, i) => flags[i]), par = rest.filter((g) => relPP(sol, f, g) === 'para');
        return N(head + `면 ${f}${pt(f, '과/와')} 수직인 면은 모두 몇 개인가?` + EXTP, hit.length, { unit: '개', figure,
          explain: `면 ${f}${pt(f, '은/는')} 처음 직육면체의 한 면의 일부이다. 직육면체에서 이 면과 이웃하던 네 면 위에 있는 ${hit.map((g) => '면 ' + g).join(', ')}${pt(hit[hit.length - 1], '은/는')} 면 ${f}${pt(f, '과/와')} 수직이다. 꼭짓점 하나에서만 닿는 면도 넓히면 수직으로 만난다. 면 ${par[0]}${pt(par[0], '은/는')} 면 ${f}${pt(f, '과/와')} 평행하고, 잘린 면 AGC는 면 ${f}${pt(f, '과/와')} 만나지만 수직이 아니다.`, facts: { count: flags } });
      }, { count: 2 }),
      H('hard-space-claims', '공간에서 직선과 평면의 위치 관계에 대한 설명', '심40·41·42 / 기본 ①62 ②55', (d, n) => {
        if (n === 0) {
          // 함정: 「만나지 않으면 평행」은 한 평면 위에서만 참이다. 공간에서는 꼬인 위치가 있다.
          const POOL = [
            { g: 'a', ok: true, s: '꼬인 위치에 있는 두 직선은 만나지 않는다.' }, { g: 'b', ok: true, s: '한 평면 위에 있고 서로 만나지 않는 두 직선은 평행하다.' }, { g: 'c', ok: true, s: '꼬인 위치에 있는 두 직선은 한 평면 위에 있지 않다.' },
            { g: 'd', ok: true, s: '평행한 두 직선은 한 평면 위에 있다.' }, { g: 'e', ok: true, s: '한 점에서 만나는 두 직선은 한 평면 위에 있다.' },
            { g: 'b', ok: false, s: '공간에서 서로 만나지 않는 두 직선은 평행하다.', why: '공간에서 만나지 않는 두 직선은 평행하거나 꼬인 위치에 있다.' },
            { g: 'f', ok: false, s: '공간에서 평행하지 않은 두 직선은 한 점에서 만난다.', why: '공간에서 평행하지 않은 두 직선은 한 점에서 만나거나 꼬인 위치에 있다.' },
            { g: 'c', ok: false, s: '꼬인 위치에 있는 두 직선은 한 평면 위에 있다.', why: '꼬인 위치에 있는 두 직선은 만나지도 않고 평행하지도 않으므로 한 평면 위에 있지 않다.' },
            { g: 'd', ok: false, s: '평행한 두 직선은 한 평면 위에 있지 않을 수도 있다.', why: '평행한 두 직선은 한 평면 위에 있다.' }
          ];
          return tagQ(d, '공간에 있는 서로 다른 두 직선에 대한 설명 가운데 옳은 것을 모두 고른 것은?', mixRows(d, POOL, 4));
        }
        // 정육면체의 모서리(직선)와 면(평면)을 모두 넣어 보아 어긋나는 경우가 있으면 거짓이다. 직선끼리 수직이라 함은 만나서 직각을 이루는 것이다.
        const cube = SOL.box(2, 2, 2), REL2 = {
          'l∥l': (x, y) => relLL(cube, x, y) === 'para', 'l⊥l': (x, y) => perpLL(cube, x, y), 'l∥P': (x, f) => relLP(cube, x, f) === 'para', 'l⊥P': (x, f) => perpLP(cube, x, f),
          'P∥P': (f, g) => relPP(cube, f, g) === 'para', 'P⊥P': (f, g) => relPP(cube, f, g) === 'meet' && perpPP(cube, f, g)
        };
        const isP = (c) => 'PQR'.includes(c), holds = ([a, r, b], env) => { const swap = isP(a) && !isP(b), x = swap ? b : a, y = swap ? a : b; return REL2[(isP(x) ? 'P' : 'l') + r + (isP(y) ? 'P' : 'l')](env[x], env[y]); };
        function truth(pre, con) {
          const vars = [...new Set(pre.concat([con]).reduce((all, c) => all.concat([c[0], c[2]]), []))];
          const walk = (i, env) => {
            if (i === vars.length) return !pre.every((c) => holds(c, env)) || holds(con, env);
            for (const cand of isP(vars[i]) ? cube.faces : cube.edges) { if (Object.values(env).includes(cand)) continue; if (!walk(i + 1, Object.assign({}, env, { [vars[i]]: cand }))) return false; }
            return true;
          };
          return walk(0, {});
        }
        const told = ([a, r, b]) => `${lv(a)} ${r} ${lv(b)}`;
        const LIST = [
          [[['l', '⊥', 'm'], ['l', '⊥', 'n']], ['m', '∥', 'n'], false, '한 직선에 수직인 두 직선은 한 점에서 만나거나 꼬인 위치에 있을 수도 있다.'],
          [[['l', '∥', 'm'], ['l', '∥', 'n']], ['m', '∥', 'n'], true],
          [[['l', '∥', 'm'], ['l', '⊥', 'n']], ['m', '⊥', 'n'], false, `${lv('m')}${pt('m', '과/와')} ${lv('n')}${pt('n', '은/는')} 꼬인 위치에 있을 수도 있다.`],
          [[['l', '∥', 'P'], ['m', '∥', 'P']], ['l', '∥', 'm'], false, '한 평면에 평행한 두 직선은 한 점에서 만나거나 꼬인 위치에 있을 수도 있다.'],
          [[['l', '⊥', 'P'], ['m', '⊥', 'P']], ['l', '∥', 'm'], true],
          [[['l', '∥', 'm'], ['l', '⊥', 'P']], ['m', '⊥', 'P'], true],
          [[['P', '⊥', 'Q'], ['P', '⊥', 'R']], ['Q', '∥', 'R'], false, '한 평면에 수직인 두 평면은 한 직선에서 만날 수도 있다.'],
          [[['P', '∥', 'Q'], ['P', '⊥', 'R']], ['Q', '⊥', 'R'], true],
          [[['l', '⊥', 'P'], ['l', '⊥', 'Q']], ['P', '∥', 'Q'], true],
          [[['l', '∥', 'P'], ['l', '∥', 'Q']], ['P', '∥', 'Q'], false, '한 직선에 평행한 두 평면은 한 직선에서 만날 수도 있다.'],
          [[['l', '⊥', 'P'], ['m', '∥', 'P']], ['l', '⊥', 'm'], false, `${lv('l')}${pt('l', '과/와')} ${lv('m')}${pt('m', '은/는')} 꼬인 위치에 있을 수도 있다.`]
        ];
        const POOL = LIST.map(([pre, con, want, why], i) => { const ok = truth(pre, con); if (ok !== want) throw new Error('참·거짓이 어긋났다: ' + i); return { s: `${pre.map(told).join(', ')}이면 ${told(con)}이다.`, ok, why: why || '', trap: [0, 2, 3].includes(i) }; });
        const rows = d.until(() => mixRows(d, POOL, 4), (r) => r.some((x) => x.trap));
        return tagQ(d, `공간에 있는 서로 다른 세 직선 ${lv('l')}, ${lv('m')}, ${lv('n')}과 서로 다른 세 평면 ${lv('P')}, ${lv('Q')}, ${lv('R')}에 대하여 다음 가운데 옳은 것을 모두 고른 것은?`, rows, { lead: '직육면체의 모서리와 면에서 찾아본다.' });
      }, { count: 2 }),
      H('hard-trans-size', '평행하지 않은 두 직선에서 동위각과 엇각의 크기', '기본 ①63 ②58', (d) => {
        // 함정: 동위각·엇각은 크기가 같다고 외워 ∠a 자신의 크기(같은 교점에 적힌 수에서 구한 값)를 답하는 아이. 두 직선이 평행하지 않으므로 다른 교점에 적힌 수로 구해야 한다.
        const [a, tilt] = d.until(() => [d.pick([60, 65, 70, 75, 105, 110, 115, 120]), d.pick([-25, -20, -15, 15, 20, 25])], ([x, t]) => x - t !== 90 && 2 * x - t !== 180), S = para({ w: 216, gap: 78, tilt, pivot: [108, 0] }), [P, Q] = S.cross(108 + 39 / Math.tan(a * RAD), a, 26);
        const up = (k) => sizeAt(a, k, 0), dn = (k) => sizeAt(a, k, tilt);
        // 위 교점: 수 하나(kn1)와 ∠a(ka). 아래 교점: 수 하나(kn2)와 ∠b(kb). ∠a 는 동위각이나 엇각(안쪽 각일 때)을, ∠b 도 마찬가지로 묻는다.
        const [ka, kn1, kb, kn2, kindA, kindB] = d.until(() => [d.int(0, 3), d.int(0, 3), d.int(0, 3), d.int(0, 3), d.pick(['동위각', '엇각']), d.pick(['동위각', '엇각'])],
          ([x, n1, y, n2, kx, ky]) => x !== n1 && y !== n2 && (kx === '동위각' || x >= 2) && (ky === '동위각' || y <= 1) && kx !== ky && a + (a - tilt) !== 180 && a - tilt !== 90 && (kx === '동위각' ? x : x - 2) !== n2 && (ky === '동위각' ? y : y + 2) !== n1);
        const posA = kindA === '동위각' ? ka : ka - 2, posB = kindB === '동위각' ? kb : kb + 2, ans1 = dn(posA), ans2 = up(posB), n1 = up(kn1), n2 = dn(kn2);
        const m = (v, k, tl, t) => { const r = sector(a, k, tl); S.angle(v, r[0], r[1], t, { r: 12 }); };
        m(P, kn1, 0, deg(n1)); m(P, ka, 0, '{a}'); m(Q, kn2, tilt, deg(n2)); m(Q, kb, tilt, '{b}');
        const from = (given, kGiven, k) => (k === kGiven ? ['그 자리에 적힌', String(given)] : (k + 2) % 4 === kGiven ? [`${given}°인 각의 맞꼭지각이므로`, String(given)] : [`${given}°인 각과 합하여 평각을 이루므로 180° − ${given}° =`, `180-${given}`]);
        const [w1, e1] = from(n2, kn2, posA), [w2, e2] = from(n1, kn1, posB);
        return M(`다음 그림에서 ㉠ ${angV('a')}의 ${kindA}의 크기, ㉡ ${angV('b')}의 ${kindB}의 크기를 차례로 구하시오.`, [{ label: '㉠', answer: ans1, unit: '°' }, { label: '㉡', answer: ans2, unit: '°' }], {
          figure: S.out(`평행하지 않은 두 직선 l(위), m(아래)과 가로지르는 한 직선. 직선 l과의 교점의 ${SPOT[kn1]} 각이 ${n1}°이고 ${SPOT[ka]} 각이 ∠a이다. 직선 m과의 교점의 ${SPOT[kn2]} 각이 ${n2}°이고 ${SPOT[kb]} 각이 ∠b이다.`),
          explain: `동위각과 엇각은 자리로 정해지고, 두 직선이 평행하지 않으면 크기가 같지 않다. ${angV('a')}의 ${kindA}은 직선 ${lv('m')} 쪽 교점의 ${SPOT[posA]} 각이고, ${w1} ${ans1}°이다. ${angV('b')}의 ${kindB}은 직선 ${lv('l')} 쪽 교점의 ${SPOT[posB]} 각이고, ${w2} ${ans2}°이다.`,
          facts: { calc: [[e1, 0], [e2, 1]], unseen: [180] } });
      }, { standard: STD2 }),
      H('hard-para-find', '세 직선 가운데 평행한 두 직선 찾기', '기본 ①67 ②72', (d) => {
        // 함정: 각이 서로 다른 자리에 적혀 있어 적힌 수끼리 견주면 틀린다. 평행하지 않은 직선은 2~3°만 기울어 눈으로는 가리기 어렵다.
        const a = d.pick([62, 66, 70, 74, 106, 110, 114, 118]), dl = d.pick([-3, -2, 2, 3]), odd = d.int(0, 2), tilts = [0, 1, 2].map((i) => (odd === 0 ? (i === 0 ? 0 : dl) : i === odd ? dl : 0)), G = 54, S = sheet(), names = ['l', 'm', 'n'], w = 176;
        // 가로지르는 직선은 맨 위 직선 위의 점 (cx, 2G) 를 방향 a 로 지난다. 각 직선은 가운데 (w/2, 높이) 를 중심으로 기울인다.
        const cx = w / 2 + G / Math.tan(a * RAD), X0 = [cx, 2 * G], ca = Math.cos(a * RAD), sa = Math.sin(a * RAD);
        // 평행한 두 직선의 각은 짝이 다른 자리에 적는다(적힌 수가 서로 다르게).
        const pair = [0, 1, 2].filter((i) => i !== odd), ks = d.until(() => [d.int(0, 3), d.int(0, 3), d.int(0, 3)], (k) => new Set(k).size === 3 && k[pair[0]] % 2 !== k[pair[1]] % 2), cross = [];
        [0, 1, 2].forEach((i) => {
          const y0 = (2 - i) * G, tt = Math.tan(tilts[i] * RAD), at = (x) => [x, y0 + (x - w / 2) * tt], t = (y0 + (cx - w / 2) * tt - 2 * G) / (sa - ca * tt), Xp = [cx + t * ca, 2 * G + t * sa];
          S.seg(at(0), at(w)).text([w + 9, at(w)[1]], '{' + names[i] + '}'); cross.push(Xp);
        });
        S.seg(pol(X0, a, 22), pol(cross[2], a + 180, 22));
        const vals = [0, 1, 2].map((i) => sizeAt(a, ks[i], tilts[i])), same = [0, 1, 2].map((i) => sizeAt(a, 0, tilts[i]));
        [0, 1, 2].forEach((i) => { const r = sector(a, ks[i], tilts[i]); S.angle(cross[i], r[0], r[1], deg(vals[i]), { r: 12 }); });
        const pairs = [[0, 1], [0, 2], [1, 2]], isPar = ([i, j]) => tilts[i] === tilts[j], opts = d.shuffle(pairs.map((p) => ({ s: `${lv(names[p[0]])} ∥ ${lv(names[p[1]])}`, ok: isPar(p) })).concat([{ s: '평행한 두 직선은 없다.', ok: false }]));
        if (opts.filter((o) => o.ok).length !== 1) throw new Error('평행한 짝이 하나가 아니다');
        const right = pairs.find(isPar);
        return C(`다음 그림과 같이 세 직선 ${lv('l')}, ${lv('m')}, ${lv('n')}이 다른 한 직선과 만날 때, 평행한 두 직선을 기호로 나타낸 것은?`, opts.map((o) => o.s), opts.findIndex((o) => o.ok), {
          figure: S.out(`위에서부터 차례로 놓인 세 직선 l, m, n과 가로지르는 한 직선. ${[0, 1, 2].map((i) => `직선 ${names[i]}${pt(names[i], '과/와')}의 교점의 ${SPOT[ks[i]]} 각이 ${vals[i]}°`).join(', ')}이다.`),
          explain: `세 교점에서 같은 자리(${SPOT[0]})에 있는 각의 크기를 구하면 직선 ${lv('l')} 쪽은 ${same[0]}°, 직선 ${lv('m')} 쪽은 ${same[1]}°, 직선 ${lv('n')} 쪽은 ${same[2]}°이다(맞꼭지각의 크기는 같고, 이웃한 각과는 합이 180°이다). 동위각의 크기가 같은 두 직선이 평행하므로 ${lv(names[right[0]])} ∥ ${lv(names[right[1]])}이다.`,
          facts: { truth: opts.map((o) => o.ok), want: true } });
      }, { standard: STD2 }),

      // ── ② 두 번 넘게 생각해야 풀리는 문제 ──
      H('hard-mid-rev', '중점과 그 절반의 중점에서 거꾸로 구하는 길이', '심8', (d) => {
        const q = d.int(3, 9);
        return N(`다음 그림에서 점 M은 ${SG('AB')}의 중점이고 점 N은 ${SG('MB')}의 중점이다. ${SG('AN')} = ${3 * q} cm일 때, ${SG('AB')}의 길이는 몇 cm인가?`, 4 * q, { unit: 'cm', figure: onLine(['A', 'M', 'N', 'B'], [0, 2, 3, 4], { ends: 'seg', spans: [[0, 2, 3 * q + ' cm']] }),
          explain: `${SG('MN')} = ${SG('NB')}이고 ${SG('AM')} = ${SG('MB')} = 2${SG('MN')}이므로 ${SG('AN')} = ${SG('AM')} + ${SG('MN')} = 3${SG('MN')}이다. ${SG('MN')} = ${3 * q} ÷ 3 = ${q}(cm)이고 ${SG('AB')} = 4${SG('MN')} = ${4 * q}(cm)이다.`, facts: { calc: [[`${3 * q}/3*4`, 0]], unseen: [3, 4] } });
      }),
      H('hard-mids-ratio', '두 중점 사이의 거리와 몇 배 조건으로 구하는 길이', '심9 / 기본 ②15', (d) => {
        const r = d.pick([2, 3]), q = d.int(2, 5), mn = (r + 1) * q, ask = d.pick(['AB', 'BC']), ans = ask === 'AB' ? 2 * r * q : 2 * q;
        return N(`다음 그림에서 점 M은 ${SG('AB')}의 중점이고 점 N은 ${SG('BC')}의 중점이다. ${SG('AB')} = ${r}${SG('BC')}이고 ${SG('MN')} = ${mn} cm일 때, ${SG(ask)}의 길이는 몇 cm인가?`, ans, { unit: 'cm',
          figure: onLine(['A', 'M', 'B', 'N', 'C'], [0, r * q, 2 * r * q, 2 * r * q + q, 2 * r * q + 2 * q], { ends: 'seg', spans: [[1, 3, mn + ' cm']] }),
          explain: `${SG('MN')} = ${SG('MB')} + ${SG('BN')} = ${frac(1, 2)}${SG('AC')}이므로 ${SG('AC')} = 2 × ${mn} = ${2 * mn}(cm)이다. ${SG('AB')} = ${r}${SG('BC')}이므로 ${SG('AC')} = ${r + 1}${SG('BC')}에서 ${SG('BC')} = ${2 * mn} ÷ ${r + 1} = ${2 * q}(cm)${ask === 'AB' ? `이고 ${SG('AB')} = ${r} × ${2 * q} = ${ans}(cm)이다.` : '이다.'}`,
          facts: { calc: [[ask === 'AB' ? `${mn}*2/(${r}+1)*${r}` : `${mn}*2/(${r}+1)`, 0]], unseen: [2, 1] } });
      }),
      H('hard-ratio-mid', '비로 나눈 선분과 중점', '심10·11 / 기본 ①21 ②18', (d, n) => {
        if (n === 0) {
          const [k, u] = d.pick([[2, 3], [2, 4], [2, 5], [2, 6], [3, 2], [3, 4], [3, 6], [4, 2], [4, 3], [4, 4]]), AB = (1 + k) * u, ans = u + k * u / 2;
          return N(`다음 그림에서 ${SG('AC')} : ${SG('CB')} = 1 : ${k}이고 점 M은 ${SG('CB')}의 중점이다. ${SG('AB')} = ${AB} cm일 때, ${SG('AM')}의 길이는 몇 cm인가?`, ans, { unit: 'cm',
            figure: onLine(['A', 'C', 'M', 'B'], [0, u, u + k * u / 2, AB], { ends: 'seg', spans: [[0, 3, AB + ' cm']] }),
            explain: `${SG('AC')} = ${AB} × ${frac(1, 1 + k)} = ${u}(cm), ${SG('CB')} = ${AB} − ${u} = ${k * u}(cm)이다. ${SG('CM')} = ${k * u} ÷ 2 = ${k * u / 2}(cm)이므로 ${SG('AM')} = ${u} + ${k * u / 2} = ${ans}(cm)이다.`, facts: { calc: [[`${AB}/(1+${k})+${AB}/(1+${k})*${k}/2`, 0]], unseen: [2] } });
        }
        const [p, q, u] = d.until(() => [d.pick([2, 3]), d.pick([2, 3]), d.int(1, 3)], ([x, y]) => x !== y || x === 2), AD = (1 + p) * (1 + q) * u, AB = (1 + q) * u, BD = p * (1 + q) * u, BC = p * u, CD = p * q * u;
        return N(`다음 그림에서 ${SG('AB')} : ${SG('BD')} = 1 : ${p}이고 ${SG('BC')} : ${SG('CD')} = 1 : ${q}이다. ${SG('AD')} = ${AD} cm일 때, ${SG('CD')}의 길이는 몇 cm인가?`, CD, { unit: 'cm',
          figure: onLine(['A', 'B', 'C', 'D'], [0, AB, AB + BC, AD], { ends: 'seg', spans: [[0, 3, AD + ' cm']] }),
          explain: `${SG('BD')} = ${AD} × ${frac(p, 1 + p)} = ${BD}(cm)이다. 선분 BD를 다시 1 : ${q}로 나누었으므로 ${SG('CD')} = ${BD} × ${frac(q, 1 + q)} = ${CD}(cm)이다.`, facts: { calc: [[`${AD}/(1+${p})*${p}/(1+${q})*${q}`, 0]] } });
      }, { count: 2 }),
      H('hard-angle-times', '직각·등분과 몇 배 조건으로 차례로 정해지는 각', '심16·17 / 기본 ①28', (d, n) => {
        if (n === 0) {
          const [k, j] = d.pick([[3, 3], [4, 2], [4, 3], [4, 4], [4, 5], [6, 2], [6, 3], [6, 4]]), t1 = 90 / (k - 1), rest = 90 - t1, t2 = rest / j, ask = d.pick(['DOE', 'COE']), ans = ask === 'DOE' ? t2 : t1 + t2;
          const S = star([{ a: 180, name: 'A', ns: -90, len: 96 }, { a: 90, name: 'C', ns: 90, len: 96 }, { a: 90 - t1, name: 'D', ns: -90, len: 96 }, { a: 90 - t1 - t2, name: 'E', ns: -90, len: 96 }, { a: 0, name: 'B', ns: 90, len: 96 }], [{ right: 90 }], { oname: 'O' });
          return N(`다음 그림에서 ∠AOB는 평각이고 ∠AOC = 90°이다. ∠AOD = ${k}∠COD, ∠DOB = ${j}∠DOE일 때, ∠${ask}의 크기는?`, ans, { unit: '°',
            figure: S.out('직선 AB 위의 점 O에서 위쪽으로 세 반직선 OC, OD, OE가 왼쪽부터 차례로 뻗어 있다. ∠AOC에 직각 표시가 있고, 반직선 OD와 OE는 반직선 OC와 OB 사이에 있다.'),
            explain: `∠AOD = 90° + ∠COD이므로 90° + ∠COD = ${k}∠COD에서 ∠COD = 90° ÷ ${k - 1} = ${t1}°이다. ∠DOB = 90° − ${t1}° = ${rest}°이고 ∠DOE = ${rest}° ÷ ${j} = ${t2}°이다.${ask === 'COE' ? ` ∠COE = ${t1}° + ${t2}° = ${ans}°이다.` : ''}`,
            facts: { calc: [[ask === 'DOE' ? `(90-90/(${k}-1))/${j}` : `90/(${k}-1)+(90-90/(${k}-1))/${j}`, 0]], unseen: [1] } });
        }
        const [form, coe] = d.pick([['∠COE = 2∠EOD', 40], ['∠COE = 3∠EOD', 45], ['∠EOD = 2∠COE', 20], ['∠EOD = 3∠COE', 15]]), eod = 60 - coe, ask = d.pick(['EOB', 'AOE']), ans = ask === 'EOB' ? eod + 60 : 60 + coe, big = Math.max(coe, eod) / Math.min(coe, eod);
        const S = star([{ a: 180, name: 'A', ns: -90, len: 96 }, { a: 120, name: 'C', ns: 90, len: 96 }, { a: 120 - coe, name: 'E', ns: 90, len: 96 }, { a: 60, name: 'D', ns: -90, len: 96 }, { a: 0, name: 'B', ns: 90, len: 96 }], [], { oname: 'O' });
        return N(`다음 그림에서 ∠AOB는 평각이고 ∠AOC = ∠COD = ∠DOB이다. ${form}일 때, ∠${ask}의 크기는?`, ans, { unit: '°',
          figure: S.out('직선 AB 위의 점 O에서 위쪽으로 세 반직선 OC, OE, OD가 왼쪽부터 차례로 뻗어 있다. 반직선 OE는 반직선 OC와 OD 사이에 있다.'),
          explain: `∠AOC = ∠COD = ∠DOB = 180° ÷ 3 = 60°이다. ${form}이므로 ∠COD를 ${big + 1}등분한 각 ${60 / (big + 1)}°를 써서 ∠COE = ${coe}°, ∠EOD = ${eod}°이다. ∠${ask} = ${ask === 'EOB' ? `${eod}° + 60°` : `60° + ${coe}°`} = ${ans}°이다.`,
          facts: { calc: [[ask === 'EOB' ? `180/3/(${big}+1)*${eod / (60 / (big + 1))}+180/3` : `180/3+180/3/(${big}+1)*${coe / (60 / (big + 1))}`, 0]], unseen: [180, 3, 1] } });
      }, { count: 2 }),
      H('hard-flat-then-vert', '평각으로 문자의 값을 구한 다음 합친 각의 맞꼭지각 구하기', '기본 ①35 / 심21·22', (d) => {
        const [x, p, cm, q] = d.until(() => { const xx = d.pick([30, 35, 40]), pp = d.pick([1, 2]), c = 5 * d.int(8, 14); return [xx, pp, c, 180 - c - (pp + 1) * xx]; }, ([xx, pp, c, qq]) => qq >= 5 && qq <= 40 && pp * xx + qq >= 50 && pp * xx + qq <= 100);
        const L = p * x + q, e1 = `(${p === 1 ? '' : p}{x} + ${q})°`, y = 180 - x;
        const S = star([{ a: 180, name: 'A', ns: -90, len: 108 }, { a: 0, name: 'B', ns: 90, len: 108 }, { a: x, name: 'C', ns: 90, len: 84 }, { a: x + 180, name: 'D', ns: 90, len: 84 }, { a: 180 - L, name: 'E', ns: -90, len: 84 }],
          [{ from: 180 - L, to: 180, t: e1, r: 15, at: [-(26 + wide(e1, 12) / 2), 9] }, { from: x, to: 180 - L, t: deg(cm), r: 15 }, { from: 0, to: x, t: '{x}°', r: 20, at: [34 + wide('{x}°', 12) / 2, 8] }, { from: 180 + x, to: 360, t: '{y}°', r: 13, at: [32, -15] }], { oname: 'O', oat: 258, od: 23 });
        return M(`다음 그림과 같이 두 직선 AB, CD가 점 O에서 만날 때, ${lv('x')}, ${lv('y')}의 값을 차례로 구하시오.`, [{ label: lv('x'), answer: x }, { label: lv('y'), answer: y }], { shown: `${lv('x')} = ${x}, ${lv('y')} = ${y}`,
          figure: S.out(`가로 직선 AB와 비스듬한 직선 CD가 점 O에서 만나고(점 C는 오른쪽 위, 점 D는 왼쪽 아래), 점 O에서 왼쪽 위로 반직선 OE가 뻗어 있다. ∠AOE = (${p === 1 ? '' : p}x + ${q})°, ∠EOC = ${cm}°, ∠COB = x°이고, 직선 AB의 아래쪽에서 ∠DOB = y°이다.`),
          explain: `∠AOB는 평각이므로 (${p === 1 ? '' : p}${lv('x')} + ${q}) + ${cm} + ${lv('x')} = 180에서 ${p + 1}${lv('x')} = ${180 - cm - q}, ${lv('x')} = ${x}이다. ∠DOB는 ∠AOE와 ∠EOC를 합친 ∠AOC의 맞꼭지각이다. ∠AOC = ${L}° + ${cm}° = ${y}°이므로 ${lv('y')} = ${y}이다.`,
          facts: { calc: [[`(180-${cm}-${q})/(${p}+1)`, 0], [`(180-${cm}-${q})/(${p}+1)*${p}+${q}+${cm}`, 1]], unseen: [180, 1].concat(p === 1 ? [1] : []) } });
      }),
      H('hard-para-triangle', '평행선과 두 직선이 만드는 삼각형', '심46 / 기본 ②63', (d) => {
        const [al, be] = d.until(() => [5 * d.int(7, 11), 5 * d.int(9, 14)], ([p, q]) => p + q <= 120 && p !== q && p + q !== 90), ga = al + be, gap = 86, hx = gap * 0.52;
        const x1 = 44, Xp = [x1 + (gap - hx) / Math.tan(al * RAD), hx], x2 = Xp[0] - hx / Math.tan(be * RAD), S = para({ w: Math.max(Xp[0] + hx / Math.tan(al * RAD), x2 + gap / Math.tan(be * RAD)) + 40, gap }), P1 = [x1, gap], Q2 = [x2, 0];
        S.seg(pol(P1, 180 - al, 18), pol([x1 + gap / Math.tan(al * RAD), 0], 360 - al, 20)).seg(pol(Q2, 180 + be, 20), pol([x2 + gap / Math.tan(be * RAD), gap], be, 18));
        const upA = d.bool(), lowX = d.bool();
        S.angle(P1, upA ? 180 - al : 360 - al, upA ? 180 : 360, deg(al)).angle(Xp, 360 - al, 360 + be, deg(ga), { r: 13 }).angle(Q2, lowX ? 180 : 0, lowX ? 180 + be : be, '{x}');
        return N(`다음 그림에서 ${lv('l')} ∥ ${lv('m')}일 때, ${angV('x')}의 크기는?`, be, { unit: '°',
          figure: S.out(`평행한 두 직선 l(위), m(아래)을 오른쪽 아래로 내려가는 직선과 오른쪽 위로 올라가는 직선이 가로지르고, 두 비스듬한 직선은 두 직선 l, m 사이에서 만난다. 오른쪽 아래로 내려가는 직선과 직선 l의 교점의 ${upA ? '왼쪽 위' : '오른쪽 아래'} 각이 ${al}°이다. 두 비스듬한 직선의 교점에서 오른쪽 각이 ${ga}°이다. 오른쪽 위로 올라가는 직선과 직선 m의 교점의 ${lowX ? '왼쪽 아래' : '오른쪽 위'} 각이 ∠x이다.`),
          explain: `두 비스듬한 직선과 직선 ${lv('m')}으로 둘러싸인 삼각형을 생각한다. 위쪽 꼭짓점의 각은 180° − ${ga}° = ${180 - ga}°이다. 오른쪽 아래 꼭짓점의 각은 ${al}°인 각의 ${upA ? '동위각' : '엇각'}이므로 ${al}°이다. 삼각형의 세 각의 크기의 합은 180°이므로 왼쪽 아래 꼭짓점의 각은 180° − ${180 - ga}° − ${al}° = ${be}°이다. ${angV('x')}는 이 각${lowX ? '의 맞꼭지각이므로' : '이므로'} ${be}°이다.`,
          facts: { calc: [[`180-(180-${ga})-${al}`, 0]], unseen: [180] } });
      }, { standard: STD2 }),
      H('hard-zigzag', '평행선 사이에서 두 번 꺾인 선', '심49 / 기본 ①75 ②69', (d, n) => {
        const flip = d.bool(), aux = '꺾인 점마다 두 직선에 평행한 직선을 긋는다. 엇각의 크기는 서로 같으므로 ';
        const [a, u, b] = d.until(() => [5 * d.int(6, 10), 5 * d.int(5, 9), 5 * d.int(7, 12)], ([p, q, r]) => p !== r && q + r <= 100 && p + q !== 90 && (n === 1 || q + r !== 90) && p + q !== q + r);
        const c1 = a + u, c2 = u + b, head = `다음 그림에서 ${lv('l')} ∥ ${lv('m')}일 때, ${angV('x')}의 크기는?`;
        if (n === 0) return N(head, c1, { unit: '°', figure: zigFig(a, u, b, { flip, p: deg(a), k1: '{x}', k2: deg(c2), q: deg(b) }).out(zigSay(flip, `직선 l과 첫째 선분 사이의 각이 ${a}°, 첫째 꺾인 점에서 두 선분 사이의 각이 ∠x, 둘째 꺾인 점에서 두 선분 사이의 각이 ${c2}°, 직선 m과 셋째 선분 사이의 각이 ${b}°이다.`)),
          explain: aux + `둘째 꺾인 점의 각 ${c2}°는 아래쪽 ${b}°와 위쪽 ${c2}° − ${b}° = ${u}°로 나뉜다. 첫째 꺾인 점의 각은 위쪽 ${a}°와 아래쪽 ${u}°로 나뉘므로 ${angV('x')} = ${a}° + ${u}° = ${c1}°이다.`, facts: { calc: [[`${a}+${c2}-${b}`, 0]] } });
        return N(head, a, { unit: '°', figure: zigFig(a, u, b, { flip, p: '{x}', k1: deg(c1), k2: deg(c2), k2Right: c2 === 90, q: deg(b) }).out(zigSay(flip, `직선 l과 첫째 선분 사이의 각이 ∠x, 첫째 꺾인 점에서 두 선분 사이의 각이 ${c1}°, 둘째 꺾인 점에서 두 선분 사이의 각${c2 === 90 ? '에 직각 표시가 있고(90°)' : `이 ${c2}°이고`}, 직선 m과 셋째 선분 사이의 각이 ${b}°이다.`)),
          explain: aux + `둘째 꺾인 점의 각 ${c2}°는 아래쪽 ${b}°와 위쪽 ${c2}° − ${b}° = ${u}°로 나뉜다. 첫째 꺾인 점의 각 ${c1}°는 아래쪽 ${u}°와 위쪽 ${c1}° − ${u}° = ${a}°로 나뉘고, 위쪽 각은 ${angV('x')}와 엇각이므로 ${angV('x')} = ${a}°이다.`, facts: { calc: [[`${c1}-(${c2}-${b})`, 0]], unseen: c2 === 90 ? [90] : [] } });
      }, { count: 2, standard: STD2 }),
      H('hard-bend-split', '꺾인 각을 몇 배 조건으로 나눈 각', '심54', (d) => {
        const r = d.pick([2, 3]), left = d.bool(), [a, b] = d.until(() => [5 * d.int(6, 10), 5 * d.int(7, 14)], ([p, q]) => (p + q) % (5 * (r + 1)) === 0 && p + q >= 75 && p + q <= 120 && p !== q), total = a + b, part = total / (r + 1);
        const S = bendFig(a, b, { left, p: deg(a), q: deg(b), names: ['A', 'C', 'B'] }), toB = left ? 360 - b : 180 + b, dirS = left ? toB + part : toB - part, E = pol(S.K, dirS, 50);
        S.seg(S.K, E).dot(E).name(E, 'D', dirS, 12);
        return N(`다음 그림에서 ${lv('l')} ∥ ${lv('m')}이고 ∠ACD = ${r}∠DCB일 때, ∠DCB의 크기는?`, part, { unit: '°',
          figure: S.out(bendSay({ left }, `직선 l 위의 점이 A, 꺾인 점이 C, 직선 m 위의 점이 B이다. 직선 l과 선분 AC 사이의 각이 ${a}°, 직선 m과 선분 BC 사이의 각이 ${b}°이다. 점 C에서 ∠ACB의 안쪽으로 반직선 CD가 뻗어 있다.`)),
          explain: `점 C를 지나고 두 직선에 평행한 직선을 그으면 엇각의 크기가 같으므로 ∠ACB = ${a}° + ${b}° = ${total}°이다. ∠ACD = ${r}∠DCB이므로 ∠ACB = ${r + 1}∠DCB이고 ∠DCB = ${total}° ÷ ${r + 1} = ${part}°이다.`, facts: { calc: [[`(${a}+${b})/(${r}+1)`, 0]], unseen: [1] } });
      }, { standard: STD2 }),
      H('hard-fold', '한 번 접은 직사각형 종이의 각', '심57 / 기본 ①78 ②74·75', (d, n) => {
        if (n === 0) {
          const t = d.int(28, 40);
          return N(`다음 그림과 같이 직사각형 모양의 종이를 접었을 때, ${angV('x')}의 크기는?`, 2 * t, { unit: '°',
            figure: foldFig(t, { fold: deg(t), rise: '{x}' }).out(`가로로 긴 직사각형 모양의 종이의 오른쪽 부분을, 아랫변 위의 한 점과 윗변 위의 한 점을 잇는 선으로 접어 올렸다. 접기 전의 오른쪽 부분은 점선으로 그려져 있다. 접는 선과 윗변 사이의 각이 ${t}°이다. 접혀 올라간 아랫변이 윗변과 만나는 점에서, 접혀 올라간 변과 윗변 사이의 각이 ∠x이다.`),
            explain: `종이의 윗변과 아랫변은 평행하므로 접는 선과 아랫변이 이루는 각은 ${t}°인 각의 엇각이어서 ${t}°이다. 접은 각의 크기는 같으므로 접혀 올라간 변과 접는 선이 이루는 각도 ${t}°이다. 접혀 올라간 변과 아랫변이 이루는 각은 ${t}° + ${t}° = ${2 * t}°이고, ${angV('x')}는 이 각의 엇각이므로 ${2 * t}°이다.`, facts: { calc: [[`${t}+${t}`, 0]] } });
        }
        const t = d.until(() => d.int(36, 48), (v) => v !== 45), apex = 180 - 2 * t;
        return N(`다음 그림은 직사각형 모양의 종이 ABCD를 ${SG('EF')}를 접는 선으로 하여 접은 것이다. ∠EGF = ${apex}°일 때, ∠GFE의 크기는?`, t, { unit: '°',
          figure: foldFig(t, { names: true, apex: deg(apex) }).out(`직사각형 ABCD(점 A 왼쪽 위, 점 B 왼쪽 아래, 점 C 오른쪽 아래, 점 D 오른쪽 위)에서 점 E는 변 BC 위에, 점 F는 변 AD 위에 있다. 선분 EF로 오른쪽 부분을 접어 올렸고, 접기 전의 오른쪽 부분은 점선으로 그려져 있다. 접혀 올라간 변 EC가 변 AD와 만나는 점이 G이고 점 G는 점 F의 왼쪽에 있다. ∠EGF = ${apex}°이다.`),
          explain: `${SG('AD')} ∥ ${SG('BC')}이므로 ∠GFE = ∠FEC(엇각)이다. 접은 각의 크기는 같으므로 ∠FEC = ∠GEF이다. 삼각형 GEF에서 ∠GFE = ∠GEF이고 세 각의 크기의 합은 180°이므로 ∠GFE = (180° − ${apex}°) ÷ 2 = ${t}°이다.`, facts: { calc: [[`(180-${apex})/2`, 0]], unseen: [180, 2] } });
      }, { count: 2, standard: STD2 })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
