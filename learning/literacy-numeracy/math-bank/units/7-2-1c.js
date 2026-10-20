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
// (처음 지을 때 뺐다가 다시 실은 꼴은 이 파일 끝의 「다시 실은 꼴(실력)」에 따로 모았다.)
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
    id: 'hard', title: '단원 종합', standard: STD1,
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
          explain: `${SG('BD')} = ${AD} × ${frac(p, 1 + p)} = ${BD}(cm)이다. 선분 BD를 다시 1 : ${q}${B.kit.mid.tail(q, '으로/로')} 나누었으므로 ${SG('CD')} = ${BD} × ${frac(q, 1 + q)} = ${CD}(cm)이다.`, facts: { calc: [[`${AD}/(1+${p})*${p}/(1+${q})*${q}`, 0]] } });
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

// ── 다시 실은 꼴(실력) ─────────────────────────────────────────
// 처음 지을 때 꼬임·경우 따지기·조건 여럿·보조선 여럿·요령이라는 까닭으로 뺀 꼴을 다시 보고 실력 묶음 끝에 붙였다(판정은 싣기_대조표.md 에 꼴마다 적었다).
// 실력 ①(뜻을 정확히 대야 풀리는 것)
//  - hard-trans-three(②59 심44): 세 직선이 세 점에서 만나면 한 각의 동위각이 둘이다. 가로지르는 직선을 하나로만 보는 아이가 걸린다.
//  - hard-mid-cut(심34): 중점 넷을 지나는 평면으로 자른 정육면체. 잘린 면의 변도 모서리이고, 같은 오각형 면 위의 떨어진 모서리는 연장하면 만난다.
//  - hard-roof-skew(①58): 직육면체에 사각뿔을 얹은 입체. 뿔의 모서리와 맞은편 세로 모서리는 떨어져 있어도 한 평면 위에 있다.
// 실력 ②(세 단계 넘게 이어 생각해야 풀리는 것)
//  - hard-mid-equation(①22), hard-angle-sum-times(①29 ②25 심15), hard-foot-area(①41), hard-height-by-area(①40),
//    hard-para-share(①76 심53), hard-bend-times(①76), hard-para-bisect(①77), hard-zigzag3(②70 심51), hard-bulge(심50),
//    hard-fold-two(②76 ①78), hard-net-cube(①59 ②54 심37·38·39), hard-clock(심58; 심59의 각이 90°가 되는 시각은 7-1-4 hard-clock 과 같은 일이라 싣지 않음)
// 답 꼴: hard-height-by-area 는 소수 첫째 자리(D). 그 밖은 자연수와 고르기.
// 새 그림 도구(이 파일 안): threeLines(세 직선과 열두 각), fan(한 점에서 뻗은 반직선), midCut·roofed(입체), foldNet·netOf·netFig(전개도와 접은 좌표).
// 그대로 뺀 것: 평면이 정해지는 조건(①47 심7), 피타고라스 정리(②11), 볼록하지 않은 입체(심35), 대칭이동(심60), 정오각형의 대각선(심30),
//   그림을 끝내 알 수 없는 것(①73의 세 평행선 ②33·64·65 심48·52), 이미 실린 유형과 하는 일이 같은 것(심19 심23), 초등 문제 그대로(심18, 심36의 겹치는 점 찾기).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, mixed, N, M, C, F, D } = B.kit;
  const { V, nb, plane } = B.kit.mid;
  const K = B.kit.m721;
  const { STD2, H, pt, angV, deg, SG, list, setQ, RAD, pol, dirOf, wide, CREAM, sheet, onLine, makeSolid, relLL, relLP, perpLP, share, others, drawSolid, solidSay, para, bendFig } = K;
  const lv = (c) => V(c);
  const EXT = ' (단, 모서리의 위치 관계는 모서리를 연장한 직선의 위치 관계로 생각한다.)';
  // 각의 크기를 적을 자리(꼭짓점에서의 거리): 글이 두 변에서 넉넉히 떨어지게 한다.
  const room = (t, size) => Math.min(64, Math.max(27, (wide(t, 12) / 2 + 6) / Math.tan(size / 2 * RAD)));
  const DIR = ['오른쪽', '오른쪽 위', '위쪽', '왼쪽 위', '왼쪽', '왼쪽 아래', '아래쪽', '오른쪽 아래'];

  // 세 직선이 서로 다른 세 점에서 만나는 그림. 직선 0 은 가로, 직선 1 은 오른쪽 위로(al°), 직선 2 는 왼쪽 위로(be°) 올라간다.
  // 교점: '01' 왼쪽, '02' 오른쪽, '12' 위쪽. 교점마다 네 각이 있고, 각은 두 반직선 { 직선: 방향(±1) } 으로 정해진다.
  function threeLines(al, be) {
    const W = 130, ta = Math.tan(al * RAD), tb = Math.tan(be * RAD), hT = W * ta * tb / (ta + tb);
    const u = [[1, 0], [Math.cos(al * RAD), Math.sin(al * RAD)], [-Math.cos(be * RAD), Math.sin(be * RAD)]], at = { '01': [0, 0], '02': [W, 0], '12': [hT / ta, hT] };
    const key = (i, j) => (i < j ? '' + i + j : '' + j + i), base = [0, al, 180 - be], ang = (i, s) => (base[i] + (s < 0 ? 180 : 0)) % 360, cr = (p, q) => p[0] * q[1] - p[1] * q[0];
    const secs = [];
    for (const [i, j] of [[1, 2], [0, 1], [0, 2]]) {
      const here = [];
      for (const si of [1, -1]) for (const sj of [1, -1]) {
        const a1 = ang(i, si), a2 = ang(j, sj), turn = ((a2 - a1) % 360 + 360) % 360, from = turn < 180 ? a1 : a2, size = Math.round(turn < 180 ? turn : 360 - turn);
        here.push({ v: key(i, j), rays: { [i]: si, [j]: sj }, from, to: from + size, size, mid: (from + size / 2) % 360 });
      }
      // 위쪽에 있는 각부터 시계 반대 방향으로 이름을 붙인다.
      here.sort((p, q) => ((p.mid - 46 + 360) % 360) - ((q.mid - 46 + 360) % 360));
      secs.push(...here);
    }
    secs.forEach((s, k) => { s.name = 'abcdefghijkl'[k]; });
    const find = (v, rays) => secs.find((s) => s.v === v && Object.keys(rays).every((k) => s.rays[k] === rays[k]));
    const lines2 = (sec) => sec.v.split('').map(Number);
    // 직선 t 를 가로지르는 직선으로 볼 때의 동위각(alt 이면 엇각). 엇각은 나머지 두 직선 사이에 있는 각에만 있다.
    function partner(sec, t, alt) {
      const [i, j] = lines2(sec), o = t === i ? j : i, k = 3 - i - j, V0 = at[sec.v], V1 = at[key(t, k)];
      const toward = Math.sign((V1[0] - V0[0]) * u[t][0] + (V1[1] - V0[1]) * u[t][1]), sideO = Math.sign(cr(u[t], u[o])) * sec.rays[o];
      if (alt && sec.rays[t] !== toward) return null;
      return find(key(t, k), { [t]: alt ? -sec.rays[t] : sec.rays[t], [k]: Math.sign(cr(u[t], u[k])) === (alt ? -sideO : sideO) ? 1 : -1 });
    }
    const corr = (sec) => lines2(sec).map((t) => partner(sec, t, false)), alts = (sec) => lines2(sec).map((t) => partner(sec, t, true)).filter(Boolean);
    const vert = (sec) => { const [i, j] = lines2(sec); return find(sec.v, { [i]: -sec.rays[i], [j]: -sec.rays[j] }); };
    const S = sheet(), ext = 32;
    S.seg([-ext, 0], [W + ext, 0]).seg(pol(at['01'], al + 180, ext), pol(at['12'], al, ext)).seg(pol(at['02'], 360 - be, ext), pol(at['12'], 180 - be, ext));
    return { S, secs, at, corr, alts, vert };
  }
  const VN = { 12: '위쪽', '01': '왼쪽', '02': '오른쪽' }, spot = (s) => DIR[Math.round(s.mid / 45) % 8], whereOf = (s) => `${VN[s.v]} 교점의 ${spot(s)} 각`;

  // 한 점 O 에서 뻗은 반직선들. 이름은 반직선의 끝 바깥에 적는다(반직선 사이가 좁아도 이름이 선과 겹치지 않는다).
  function fan(rays) {
    const S = sheet(), O = [0, 0], len = 94;
    rays.forEach((r) => S.seg(O, pol(O, r.a, len)));
    rays.forEach((r) => { S.dot(pol(O, r.a, len - 12)); S.text(pol(O, r.a, len + 9), r.name); });
    S.dot(O, 2.4).name(O, 'O', 270, 13);
    return S;
  }

  // 정육면체에서 네 모서리의 중점 M, N, P, Q 를 지나는 평면으로 윗면의 오른쪽 모서리 쪽을 잘라 낸 입체(꼭짓점 10개, 모서리 15개)
  const midCut = () => makeSolid('정육면체의 한쪽을 잘라 낸 입체도형', { A: [0, 3, 3], B: [0, 0, 3], N: [1.5, 0, 3], M: [1.5, 3, 3], P: [3, 0, 1.5], Q: [3, 3, 1.5], E: [0, 3, 0], F: [0, 0, 0], G: [3, 0, 0], H: [3, 3, 0] },
    ['ABNM', 'EFGH', 'ABFE', 'BNPGF', 'AMQHE', 'PGHQ', 'MNPQ'],
    { say: '정육면체에서 윗면의 오른쪽 모서리 쪽을, 네 모서리의 중점 M, N, P, Q를 지나는 평면으로 잘라 냈다. 윗면은 직사각형 ABNM(A 왼쪽 뒤, B 왼쪽 앞, N 오른쪽 앞, M 오른쪽 뒤), 아랫면은 정사각형 EFGH이고 꼭짓점 A, B의 아래에 차례로 꼭짓점 E, F가 있다. 잘린 면은 직사각형 MNPQ이고 점 P는 꼭짓점 G의 위에, 점 Q는 꼭짓점 H의 위에 있다. 앞면 BNPGF와 뒷면 AMQHE는 오각형이다' });
  // 직육면체 ABCD-EFGH 위에, 윗면 ABCD 를 밑면으로 하고 꼭짓점 V 가 윗면의 한가운데 위에 있는 사각뿔을 얹은 입체(꼭짓점 9개, 모서리 16개)
  const roofed = () => makeSolid('직육면체 위에 사각뿔을 얹은 입체도형', { V: [2, 1.4, 3.9], A: [0, 2.8, 2.2], B: [0, 0, 2.2], C: [4, 0, 2.2], D: [4, 2.8, 2.2], E: [0, 2.8, 0], F: [0, 0, 0], G: [4, 0, 0], H: [4, 2.8, 0] },
    ['VAB', 'VBC', 'VCD', 'VDA', 'EFGH', 'ABFE', 'BFGC', 'CGHD', 'AEHD'],
    { say: '직육면체의 윗면 ABCD(A 왼쪽 뒤, B 왼쪽 앞, C 오른쪽 앞, D 오른쪽 뒤) 위에 꼭짓점이 V인 사각뿔이 얹혀 있고, 꼭짓점 V는 윗면의 두 대각선이 만나는 점의 바로 위에 있다. 꼭짓점 A, B, C, D의 아래에 차례로 꼭짓점 E, F, G, H가 있다' });

  // 정육면체의 전개도(계단 꼴). 칸: [가로 칸, 세로 칸, 꼭짓점 이름(왼쪽 위, 왼쪽 아래, 오른쪽 아래, 오른쪽 위), 면의 이름]
  // 수집본의 쪽 그림과 같은 꼴이되 좌우를 뒤집었고, 꼭짓점 이름은 왼쪽 위의 점에서 시작하여 둘레를 시계 반대 방향으로 돌며 새로 붙였다. 접으면 A·C, D·N, E·G·M, H·J·L 이 겹친다.
  const NET = [[2, 2, 'ABKN', 'ABKN'], [3, 2, 'NKLM', 'KLMN'], [0, 1, 'DEFC', 'CDEF'], [1, 1, 'CFIB', 'BCFI'], [2, 1, 'BIJK', 'BIJK'], [1, 0, 'FGHI', 'FGHI']], CORNER = [[0, 1], [0, 0], [1, 0], [1, 1]];
  // 전개도를 접는다: 바닥에 둔 칸에서 이웃한 칸으로 번져 가며 칸마다 자리(o), 가로·세로 방향(u, v), 안쪽 방향(n)을 정한다. 꼭짓점 이름마다 접은 뒤의 좌표를 돌려준다.
  function foldNet(cells, base) {
    const add = (p, q, k) => [p[0] + k * q[0], p[1] + k * q[1], p[2] + k * q[2]], neg = (p) => [-p[0], -p[1], -p[2]], id = (i, j) => i + ',' + j, has = new Set(cells.map(([i, j]) => id(i, j))), frame = new Map();
    frame.set(id(base[0], base[1]), { o: [0, 0, 0], u: [1, 0, 0], v: [0, 1, 0], n: [0, 0, 1] });
    const queue = [base];
    while (queue.length) {
      const [i, j] = queue.shift(), f = frame.get(id(i, j));
      const next = [[1, 0, { o: add(f.o, f.u, 1), u: f.n, v: f.v, n: neg(f.u) }], [-1, 0, { o: add(f.o, f.n, 1), u: neg(f.n), v: f.v, n: f.u }], [0, 1, { o: add(f.o, f.v, 1), u: f.u, v: f.n, n: neg(f.v) }], [0, -1, { o: add(f.o, f.n, 1), u: f.u, v: neg(f.n), n: f.v }]];
      for (const [di, dj, g] of next) { const k = id(i + di, j + dj); if (has.has(k) && !frame.has(k)) { frame.set(k, g); queue.push([i + di, j + dj]); } }
    }
    const V3 = {};
    for (const [i, j, names] of cells) {
      const f = frame.get(id(i, j));
      CORNER.forEach(([dx, dy], k) => { const p = add(add(f.o, f.u, dx), f.v, dy); if (V3[names[k]] && V3[names[k]].some((c, t) => Math.abs(c - p[t]) > 1e-9)) throw new Error('전개도가 어긋났다: ' + names[k]); V3[names[k]] = p; });
    }
    return V3;
  }
  function netOf() {
    const V3 = foldNet(NET, [1, 1]), segs = [], grid = {}, spots = {};
    NET.forEach(([i, j, names]) => {
      CORNER.forEach(([dx, dy], k) => { grid[names[k]] = [i + dx, j + dy]; });
      for (let k = 0; k < 4; k += 1) { const s = [names[k], names[(k + 1) % 4]].sort().join(''); if (!segs.includes(s)) segs.push(s); }
    });
    Object.keys(V3).sort().forEach((p) => { const k = V3[p].map((c) => Math.round(c)).join(); (spots[k] = spots[k] || []).push(p); });
    const glued = Object.values(spots).filter((g) => g.length > 1).sort((p, q) => (p[0] < q[0] ? -1 : 1));
    if (segs.length !== 19 || Object.keys(spots).length !== 8 || glued.map((g) => g.join('')).join() !== 'AC,DN,EGM,HJL') throw new Error('전개도의 얼개가 어긋났다');
    return { sol: { V: V3 }, segs: segs.sort(), grid, glued, faces: NET.map((c) => c[3]) };
  }
  function netFig(net) {
    const U = 38, S = sheet(), full = new Set(NET.map(([i, j]) => i + ',' + j));
    NET.forEach(([i, j]) => S.poly([[i, j + 1], [i, j], [i + 1, j], [i + 1, j + 1]].map(([x, y]) => [x * U, y * U]), 'fill:' + CREAM + ';stroke:#1f2933;stroke-width:1.5;stroke-linejoin:round'));
    // 꼭짓점 이름은 그 점 둘레의 네 칸 가운데 비어 있는 쪽에 적는다.
    Object.keys(net.grid).forEach((name) => {
      const [gx, gy] = net.grid[name]; let vx = 0, vy = 0;
      [[1, 1, gx, gy], [-1, 1, gx - 1, gy], [-1, -1, gx - 1, gy - 1], [1, -1, gx, gy - 1]].forEach(([sx, sy, ci, cj]) => { if (!full.has(ci + ',' + cj)) { vx += sx; vy += sy; } });
      S.name([gx * U, gy * U], name, dirOf([0, 0], [vx, vy]), 11);
    });
    return S.out('정사각형 6개로 이루어진 정육면체의 전개도. 윗줄에 정사각형 ABKN, KLMN이 왼쪽부터 나란히 있다. 가운뎃줄에 정사각형 CDEF, BCFI, BIJK가 왼쪽부터 나란히 있고, 정사각형 BIJK는 정사각형 ABKN의 바로 아래에 있다. 아랫줄에 정사각형 FGHI가 정사각형 BCFI의 바로 아래에 있다. 꼭짓점의 이름은 윗줄의 왼쪽 위 꼭짓점 A에서 시작하여 전개도의 둘레를 시계 반대 방향으로 돌며 A부터 N까지 차례로 붙였다.');
  }

  B.addTypes('7-2-1', 'hard', [
    // ── ① 그림·말에 함정이 있어 배운 뜻을 정확히 대야 풀리는 문제 ──
    H('hard-trans-three', '세 직선이 세 점에서 만날 때의 동위각과 엇각', '기본 ②59 / 심44', (d, n) => {
      // 함정: 가로지르는 직선을 하나로만 보아 동위각을 하나만 찾는 아이, 다른 교점의 엇갈린 자리(맞꼭지각 자리)에 있는 각을 동위각으로 고르는 아이.
      const [al, be] = d.until(() => [5 * d.int(10, 14), 5 * d.int(10, 14)], ([p, q]) => p !== q && p + q <= 125 && p + q !== 90 && 180 - p - q !== p && 180 - p - q !== q);
      const G = threeLines(al, be), kind = d.pick(['동위각', '엇각']), head = '다음 그림과 같이 세 직선이 서로 다른 세 점에서 만날 때, ';
      const lead = '세 직선이 서로 다른 세 점에서 만난다. 한 직선은 가로로 놓여 있고 나머지 두 직선은 그 위쪽에서 만난다. ';
      if (n === 0) {
        const x = d.until(() => d.pick(G.secs), (s) => kind === '동위각' || G.alts(s).length >= 1), co = G.corr(x), al2 = G.alts(x), right = kind === '동위각' ? co : al2;
        // 보기에 올릴 각: 동위각 둘과 그 맞꼭지각 둘(엇각이 있다면 이 가운데 있다), 그리고 다른 교점의 각 하나
        const core = co.concat(co.map(G.vert)), more = d.pick(G.secs.filter((s) => s.v !== x.v && !core.includes(s)));
        const labels = core.concat([more]).map((s) => s.name).sort(), flags = labels.map((c) => right.some((s) => s.name === c));
        const traps = right.length === 2 ? right.map((s) => [s.name]) : [co.map(G.vert).map((s) => s.name).sort()];
        G.secs.forEach((s) => G.S.angle(G.at[s.v], s.from, s.to, '{' + s.name + '}', { arc: false, d: s.size < 60 ? 24 : 17 }));
        const A = (s) => angV(s.name), J = (s, pair) => A(s) + pt(s.name, pair);
        right.sort((p, q) => (p.name < q.name ? -1 : 1));
        const explain = kind === '동위각'
          ? `동위각은 두 직선이 다른 한 직선과 만날 때 같은 쪽 자리에 있는 각이다. ${J(x, '은/는')} 두 직선이 만나는 점에 있으므로 그 두 직선을 하나씩 가로지르는 직선으로 볼 수 있다. 한 직선을 따라 ${VN[co[0].v]} 교점으로 가면 같은 자리에 ${J(co[0], '이/가')} 있고, 다른 직선을 따라 ${VN[co[1].v]} 교점으로 가면 같은 자리에 ${J(co[1], '이/가')} 있다. ${A(x)}의 동위각은 ${A(co[0])}, ${A(co[1])}의 두 개이다.`
          : '엇각은 두 직선 사이에서 가로지르는 직선의 서로 반대쪽에 엇갈려 있는 각이다. ' + (al2.length === 2
            ? `${A(x)}가 있는 교점을 지나는 두 직선 가운데 어느 것을 가로지르는 직선으로 보아도 ${J(x, '은/는')} 나머지 두 직선 사이에 있다. ${A(x)}의 엇각은 ${A(al2[0])}, ${A(al2[1])}의 두 개이다.`
            : `${A(x)}가 있는 교점을 지나는 두 직선 가운데 하나를 가로지르는 직선으로 보면 ${J(x, '은/는')} 나머지 두 직선 사이에 있고, 엇갈린 자리에 ${J(al2[0], '이/가')} 있다. 다른 하나를 가로지르는 직선으로 보면 ${J(x, '은/는')} 두 직선의 바깥쪽에 있어 엇각이 없다. ${A(x)}의 엇각은 ${A(al2[0])}뿐이다.`);
        return setQ(d, head + `${A(x)}의 ${kind}을 모두 고른 것은?`, labels, flags, { show: (c) => angV(c), traps, explain,
          figure: G.S.out(lead + ['12', '01', '02'].map((v) => `${VN[v]} 교점 둘레의 네 각은 ${G.secs.filter((s) => s.v === v).map((s) => `${spot(s)} ∠${s.name}`).join(', ')}`).join('이고, ') + '이다.') });
      }
      // 크기: ∠a 와 다른 두 교점에 수가 하나씩 적혀 있다. 수는 답이 되는 각이 아닌 자리에 적는다.
      const c = d.until(() => {
        const x = d.pick(G.secs), right = kind === '동위각' ? G.corr(x) : G.alts(x);
        if (right.length !== 2) return null;
        return { x, right, given: right.map((r) => d.pick(G.secs.filter((s) => s.v === r.v && s !== r))) };
      }, (o) => o && o.right[0].size !== o.right[1].size && o.given.some((g, i) => g.size !== o.right[i].size));
      const order = c.right[0].size < c.right[1].size ? [0, 1] : [1, 0], told = (i) => { const g = c.given[i], r = c.right[i]; return `${whereOf(r)}이고, ${g.size}°인 각${r.size === g.size ? '의 맞꼭지각이므로' : `과 합하여 평각을 이루므로 180° − ${g.size}° =`} ${r.size}°이다`; };
      G.S.angle(G.at[c.x.v], c.x.from, c.x.to, '{a}', { r: 11 });
      c.given.forEach((g) => G.S.angle(G.at[g.v], g.from, g.to, deg(g.size), { r: 11, d: room(deg(g.size), g.size) }));
      return M(head + `${angV('a')}의 ${kind}을 모두 찾아 그 크기를 작은 것부터 차례로 구하시오.`, order.map((i, k) => ({ label: k === 0 ? '작은 각' : '큰 각', answer: c.right[i].size, unit: '°' })), {
        figure: G.S.out(lead + `${whereOf(c.x)}이 ∠a이다. ${whereOf(c.given[0])}이 ${c.given[0].size}°, ${whereOf(c.given[1])}이 ${c.given[1].size}°이다.`),
        explain: `${angV('a')}가 있는 교점을 지나는 두 직선을 하나씩 가로지르는 직선으로 보면 ${angV('a')}의 ${kind}은 두 개이다. 하나는 ${told(order[0])}. 다른 하나는 ${told(order[1])}. 직선들이 평행하지 않으므로 ${kind}의 크기는 ${angV('a')}의 크기와 같지 않다.`,
        facts: { calc: order.map((i, k) => [c.right[i].size === c.given[i].size ? String(c.given[i].size) : `180-${c.given[i].size}`, k]), unseen: [180] } });
    }, { count: 2, standard: STD2 }),
    H('hard-mid-cut', '네 모서리의 중점을 지나는 평면으로 자른 정육면체에서의 위치 관계', '심34', (d, n) => {
      // 함정: 잘린 면의 변을 모서리로 세지 않는 아이, 같은 오각형 면 위에서 떨어져 있는 모서리(AE·EH 와 MQ)를 꼬인 위치로 세는 아이, 떨어져 있는 모서리는 면과 만나지 않는다고 여기는 아이.
      const sol = midCut(), head = '다음 그림은 정육면체에서 네 모서리의 중점 M, N, P, Q를 지나는 평면으로 한쪽을 잘라 낸 입체도형이다. ', figure = drawSolid(sol, { size: [150, 126], label: solidSay(sol) });
      if (n === 0) {
        const e = d.pick(['MQ', 'NP']), rest = others(sol, e), flags = rest.map((g) => relLL(sol, e, g) === 'skew'), by = (r) => rest.filter((g) => relLL(sol, e, g) === r), far = by('meet').filter((g) => !share(e, g)), face = sol.faces.find((f) => f.length === 5 && f.includes(e[0]) && f.includes(e[1]));
        if (far.length !== 2 || by('skew').length !== 7) throw new Error('꼬인 위치에 있는 모서리의 수가 어긋났다');
        return N(head + `모서리 ${e}${pt(e, '과/와')} 꼬인 위치에 있는 모서리는 모두 몇 개인가?` + EXT, by('skew').length, { unit: '개', figure,
          explain: `이 입체도형의 모서리는 잘린 면의 변을 더하여 모두 ${sol.edges.length}개이다. 모서리 ${e}${pt(e, '과/와')} 평행한 모서리는 ${list(by('para'))}, 끝 점에서 만나는 모서리는 ${list(by('meet').filter((g) => share(e, g)))}이다. 모서리 ${list(far)}${pt(far[far.length - 1], '은/는')} 모서리 ${e}${pt(e, '과/와')} 떨어져 있지만 같은 면 ${face} 위에 있고 평행하지 않으므로 연장하면 만난다. 꼬인 위치에 있는 모서리는 나머지 ${list(by('skew'))}의 ${by('skew').length}개이다.`,
          facts: { count: flags } });
      }
      const f = 'MNPQ', by = (r) => sol.edges.filter((g) => relLP(sol, g, f) === r), flags = sol.edges.map((g) => relLP(sol, g, f) === 'para');
      if (by('in').length !== 4 || by('para').length !== 3 || by('meet').length !== 8) throw new Error('면과 모서리의 위치 관계가 어긋났다');
      return M(head + `㉠ 면 ${f}${pt(f, '과/와')} 평행한 모서리의 개수, ㉡ 면 ${f}${pt(f, '과/와')} 한 점에서 만나는 모서리의 개수를 차례로 구하시오. (단, 모서리와 면의 위치 관계는 모서리를 연장한 직선과 면을 넓힌 평면의 위치 관계로 생각한다.)`,
        [{ label: '㉠', answer: by('para').length, unit: '개' }, { label: '㉡', answer: by('meet').length, unit: '개' }], { figure,
          explain: `면 ${f} 위에 있는 모서리는 ${list(by('in'))}의 ${by('in').length}개이다. 모서리 ${list(by('para'))}${pt(by('para')[2], '은/는')} 모서리 MN과 평행하고 면 ${f} 위에 있지 않으므로 면 ${f}${pt(f, '과/와')} 평행하다. 나머지 모서리 ${list(by('meet'))}의 ${by('meet').length}개는 면 ${f}${pt(f, '과/와')} 평행하지 않으므로, 떨어져 있는 것도 연장하면 면 ${f}${pt(f, '을/를')} 넓힌 평면과 한 점에서 만난다.`,
          facts: { count: flags, calc: [[String(by('meet').length), 1]], unseen: [by('meet').length] } });
    }, { count: 2 }),
    H('hard-roof-skew', '사각뿔을 얹은 직육면체에서 두 모서리와 동시에 꼬인 위치에 있는 모서리', '기본 ①58', (d) => {
      // 함정: 뿔의 모서리와 맞은편 세로 모서리(AV 와 CG)는 떨어져 있어 꼬인 위치로 보이지만, 꼭짓점 V 가 윗면의 한가운데 위에 있어 두 모서리가 한 평면(A, C, V 를 지나는 평면) 위에 있다.
      // 꼭짓점 V 의 자리는 문제 글에 적는다(「옆모서리의 길이가 같다」에서 미루어 알게 하면 합동이 있어야 한다).
      const sol = roofed(), X = d.pick(['A', 'B', 'C', 'D']), at = 'ABCD'.indexOf(X), e2 = [X, 'EFGH'[at]].sort().join(''), e1 = d.pick(sol.edges.filter((g) => g.includes(X) && !g.includes('V') && g !== e2)), opp = 'ABCD'[(at + 2) % 4];
      const labels = sol.edges.filter((g) => g !== e1 && g !== e2), skew = (e) => labels.filter((g) => relLL(sol, e, g) === 'skew'), flags = labels.map((g) => relLL(sol, e1, g) === 'skew' && relLL(sol, e2, g) === 'skew'), right = labels.filter((_, i) => flags[i]);
      const far = labels.filter((g) => relLL(sol, e1, g) === 'skew' && relLL(sol, e2, g) === 'meet' && !share(e2, g));
      if (far.length !== 1 || far[0] !== opp + 'V' || right.length < 2) throw new Error('뿔의 모서리와 세로 모서리의 위치 관계가 어긋났다');
      return setQ(d, `다음 그림은 직육면체 위에, 직육면체의 윗면 ABCD를 밑면으로 하는 사각뿔을 얹은 입체도형이다. 사각뿔의 꼭짓점 V는 윗면의 두 대각선이 만나는 점의 바로 위에 있다. 두 모서리 ${e1}, ${e2}${pt(e2, '과/와')} 동시에 꼬인 위치에 있는 모서리를 모두 고른 것은?` + EXT, labels, flags, {
        figure: drawSolid(sol, { size: [150, 132], label: solidSay(sol) }), traps: [labels.filter((g) => right.includes(g) || far.includes(g))],
        explain: `모서리 ${e1}${pt(e1, '과/와')} 꼬인 위치에 있는 모서리는 ${list(skew(e1))}이고, 모서리 ${e2}${pt(e2, '과/와')} 꼬인 위치에 있는 모서리는 ${list(skew(e2))}이다. 모서리 ${far[0]}${pt(far[0], '은/는')} 모서리 ${e2}${pt(e2, '과/와')} 떨어져 있지만, 꼭짓점 V가 윗면의 두 대각선이 만나는 점의 바로 위에 있으므로 두 모서리는 세 점 ${opp}, ${X}, V를 지나는 한 평면(대각선 ${[opp, X].sort().join('')}${pt([opp, X].sort().join(''), '을/를')} 따라 직육면체를 세로로 자르는 평면) 위에 있다. 평행하지 않으므로 연장하면 만나고, 꼬인 위치가 아니다. 두 모서리와 동시에 꼬인 위치에 있는 모서리는 ${list(right)}이다.` });
    }),

    // ── ② 두 번 넘게 생각해야 풀리는 문제 ──
    H('hard-mid-equation', '두 중점 사이의 거리를 방정식으로 구하기', '기본 ①22', (d) => {
      const [p, q, e, k, x] = d.until(() => { const [pp, qq] = d.pick([[3, 7], [2, 5], [4, 9], [3, 8]]), ee = d.int(2, 6), kk = d.pick([2, 3]); return [pp, qq, ee, kk, pp * ee / (qq - 2 * pp)]; },
        ([, , , kk, xx]) => Number.isInteger(xx) && xx >= 6 && xx <= 12 && Number.isInteger(2 * xx / (kk + 1)));
      const AE = 2 * x, CE = AE / (k + 1), AC = k * CE, ask = d.pick(['BD', 'CE']), ans = ask === 'BD' ? x : CE, X = lv('x'), rest = q - 2 * p;
      return N(`다음 그림에서 점 B는 ${SG('AC')}의 중점이고 점 D는 ${SG('CE')}의 중점이다. ${nb(`${SG('AC')} = ${k}${SG('CE')},`)} ${nb(`${SG('BD')} = ${frac(p, q)}${SG('AF')},`)} ${nb(`${SG('EF')} = ${e} cm`)}일 때, ${SG(ask)}의 길이는 몇 cm인가?`, ans, { unit: 'cm',
        figure: onLine(['A', 'B', 'C', 'D', 'E', 'F'], [0, AC / 2, AC, AC + CE / 2, AE, AE + e], { ends: 'seg', spans: [[4, 5, e + ' cm']] }),
        explain: `${SG('BD')} = ${SG('BC')} + ${SG('CD')} = ${frac(1, 2)}${SG('AC')} + ${frac(1, 2)}${SG('CE')} = ${frac(1, 2)}${SG('AE')}이므로 ${SG('AE')} = 2${SG('BD')}이다. ${SG('BD')} = ${X} cm라 하면 ${SG('AF')} = ${SG('AE')} + ${SG('EF')} = 2${X} + ${e}(cm)이다. ${X} = ${frac(p, q)}(2${X} + ${e})에서 ${q}${X} = ${2 * p}${X} + ${p * e}${rest === 1 ? '' : `, ${rest}${X} = ${p * e}`}, ${X} = ${x}이다.`
          + (ask === 'BD' ? ` ${SG('BD')}의 길이는 ${x} cm이다.` : ` ${SG('AE')} = 2 × ${x} = ${AE}(cm)이고 ${SG('AC')} = ${k}${SG('CE')}이므로 ${SG('AE')} = ${k + 1}${SG('CE')}에서 ${SG('CE')} = ${AE} ÷ ${k + 1} = ${CE}(cm)이다.`),
        facts: { calc: [[ask === 'BD' ? `${p}*${e}/(${q}-2*${p})` : `${p}*${e}/(${q}-2*${p})*2/(${k}+1)`, 0]], unseen: [2, 1] } });
    }),
    H('hard-angle-sum-times', '합만 정해지는 몇 배 조건의 각', '기본 ①29 ②25 / 심15', (d, n) => {
      const a1 = angV('a'), b1 = angV('b');
      if (n === 0) {
        // 평각 위의 세 반직선. 바깥쪽 두 각이 안쪽 두 각의 (k − 1)배씩이어서 안쪽 두 각의 합이 180° ÷ k 로 정해진다(하나하나는 정해지지 않는다).
        const [k, c, e] = d.pick([[2, 35, 55], [2, 40, 50], [2, 50, 40], [2, 55, 35], [3, 25, 35], [3, 35, 25], [3, 20, 40], [3, 40, 20], [4, 20, 25], [4, 25, 20], [5, 16, 20], [5, 20, 16], [6, 14, 16], [6, 16, 14]]);
        const outer = k >= 3 && d.bool(), [L, Mid, R] = outer ? ['D', 'C', 'E'] : ['C', 'D', 'E'], ans = 180 / k;
        const S = fan([{ a: 180, name: 'A' }, { a: 180 - (k - 1) * c, name: L }, { a: 180 - k * c, name: Mid }, { a: (k - 1) * e, name: R }, { a: 0, name: 'B' }]);
        const cond = outer ? `∠AO${L} = ${k - 1}∠${L}O${Mid}, ∠BO${R} = ${k - 1}∠${Mid}O${R}` : `∠AO${Mid} = ${k}∠${L}O${Mid}, ∠${Mid}OB = ${k}∠${Mid}O${R}`;
        const how = outer ? `∠AO${L} = ${k - 1}${a1}, ∠BO${R} = ${k - 1}${b1}이다. 네 각의 크기의 합이 180°이므로 ${k - 1}${a1} + ${a1} + ${b1} + ${k - 1}${b1} = 180°, ${k}(${a1} + ${b1}) = 180°에서`
          : `∠AO${Mid} = ${k}${a1}, ∠${Mid}OB = ${k}${b1}이다. ∠AO${Mid} + ∠${Mid}OB = 180°이므로 ${k}(${a1} + ${b1}) = 180°에서`;
        return N(`다음 그림에서 ∠AOB는 평각이고 ${cond}일 때, ∠${L}O${R}의 크기는?`, ans, { unit: '°',
          figure: S.out(`직선 AB 위의 점 O에서 위쪽으로 세 반직선 O${L}, O${Mid}, O${R}${pt(R, '이/가')} 왼쪽부터 차례로 뻗어 있다. 각의 크기는 적혀 있지 않다.`),
          explain: `∠${L}O${Mid} = ${a1}, ∠${Mid}O${R} = ${b1}라 하면 ${how} ${a1} + ${b1} = ${ans}°이다. ∠${L}O${R} = ${a1} + ${b1} = ${ans}°이다. ${a1}, ${b1} 하나하나의 크기는 정해지지 않지만 합은 정해진다.`,
          facts: { calc: [[outer ? `180/(${k - 1}+1)` : `180/${k}`, 0]], unseen: [180, 1] } });
      }
      // 한 점에서 만나는 세 직선과 반직선 하나. 평각 위의 조건에서 합을 구하고 맞꼭지각으로 옮긴다.
      const [m, a, f] = d.pick([[2, 25, 35], [2, 35, 25], [2, 20, 40], [2, 40, 20], [3, 20, 25], [3, 25, 20], [4, 15, 21], [4, 21, 15], [4, 16, 20], [4, 20, 16]]), ans = 180 / (m + 1);
      const S = fan([{ a: 180, name: 'C' }, { a: 180 - a, name: 'A' }, { a: 180 - (m + 1) * a, name: 'G' }, { a: f, name: 'F' }, { a: 0, name: 'D' }, { a: 180 + f, name: 'E' }, { a: 360 - a, name: 'B' }]);
      return N(`다음 그림과 같이 세 직선 AB, CD, EF가 점 O에서 만나고 점 O에서 반직선 OG가 뻗어 있다. ∠AOG = ${m}∠AOC, ∠FOG = ${m}∠DOF일 때, ∠COE + ∠BOD의 크기는?`, ans, { unit: '°',
        figure: S.out('세 직선 AB, CD, EF가 점 O에서 만난다. 직선 CD는 가로로 놓여 있고 점 C가 왼쪽, 점 D가 오른쪽에 있다. 점 A는 왼쪽 위, 점 B는 오른쪽 아래, 점 F는 오른쪽 위, 점 E는 왼쪽 아래에 있다. 점 O에서 위쪽으로 반직선 OG가 뻗어 있고, 반직선 OG는 반직선 OA와 반직선 OF 사이에 있다. 각의 크기는 적혀 있지 않다.'),
        explain: `∠AOC = ${a1}, ∠DOF = ${b1}라 하면 ∠AOG = ${m}${a1}, ∠FOG = ${m}${b1}이다. ∠COD는 평각이므로 ${a1} + ${m}${a1} + ${m}${b1} + ${b1} = 180°, ${m + 1}(${a1} + ${b1}) = 180°에서 ${a1} + ${b1} = ${ans}°이다. 맞꼭지각의 크기는 서로 같으므로 ∠COE = ∠DOF = ${b1}, ∠BOD = ∠AOC = ${a1}이다. ∠COE + ∠BOD = ${a1} + ${b1} = ${ans}°이다.`,
        facts: { calc: [[`180/(${m}+1)`, 0]], unseen: [180, 1] } });
    }, { count: 2 }),
    H('hard-foot-area', '좌표평면에서 수선의 발을 꼭짓점으로 하는 사각형의 넓이', '기본 ①41', (d) => {
      const [p1, p2, q1, q2] = d.until(() => [d.int(1, 5), d.int(1, 5), d.int(1, 5), d.int(1, 5)], ([a, b, c, e]) => ((a + c) * (b + e)) % 2 === 0 && a + c >= 4 && b + e >= 4 && !(a === c && b === e));
      const sx = d.pick([1, -1]), sy = d.pick([1, -1]), P = [sx * p1, sy * p2], Q = [-sx * q1, -sy * q2], co = (v) => (v < 0 ? '−' + -v : String(v)), at = (p) => `(${co(p[0])}, ${co(p[1])})`, sideOf = (p) => (p[1] > 0 ? 'u' : 'd') + (p[0] > 0 ? 'r' : 'l');
      const area = (p1 + q1) * (p2 + q2) / 2, X = lv('x'), Y = lv('y'), half = frac(1, 2);
      return N(`좌표평면 위의 두 점 P${at(P)}, Q${at(Q)}에 대하여 점 P에서 ${X}축, ${Y}축에 내린 수선의 발을 각각 A, B라 하고, 점 Q에서 ${X}축, ${Y}축에 내린 수선의 발을 각각 C, D라 할 때, 사각형 ABCD의 넓이는?`, area, {
        figure: plane({ points: [{ x: P[0], y: P[1], name: 'P', side: sideOf(P) }, { x: Q[0], y: Q[1], name: 'Q', side: sideOf(Q) }] }),
        explain: `수선의 발은 A${at([P[0], 0])}, B${at([0, P[1]])}, C${at([Q[0], 0])}, D${at([0, Q[1]])}이다. 두 점 A, C는 ${X}축 위에 있고 ${SG('AC')} = ${p1} + ${q1} = ${p1 + q1}이다. 사각형 ABCD를 ${X}축으로 나눈 두 삼각형 ABC, ACD는 밑변이 ${SG('AC')}이고 높이가 각각 ${p2}, ${q2}이다. 넓이는 ${half} × ${p1 + q1} × ${p2} + ${half} × ${p1 + q1} × ${q2} = ${area}이다.`,
        facts: { calc: [[`(${p1}+${q1})*(${p2}+${q2})/2`, 0]], unseen: [2] } });
    }),
    H('hard-height-by-area', '넓이를 두 가지로 나타내어 구하는 점과 직선 사이의 거리', '기본 ①40', (d) => {
      const k = d.pick([2, 3, 4, 6, 7, 8, 9]), swap = d.bool(), ab = (swap ? 4 : 3) * k, ac = (swap ? 3 : 4) * k, bc = 5 * k, ad = Math.round(ab * ac / bc * 10) / 10, u = 208 / bc, bd = ab * ab / bc;
      const Bp = [0, 0], Cp = [bc * u, 0], A = [bd * u, ad * u], Dp = [bd * u, 0], cen = [(A[0] + Cp[0]) / 3, A[1] / 3], S = sheet();
      S.poly([A, Bp, Cp], 'fill:' + CREAM + ';stroke:#1f2933;stroke-width:1.6;stroke-linejoin:round').seg(A, Dp, 'thin').right(A, dirOf(A, Bp), 8).right(Dp, swap ? 90 : 0, 7);
      S.name(A, 'A', 90).name(Bp, 'B', 200, 12).name(Cp, 'C', 340, 12).name(Dp, 'D', 270, 12);
      S.side(A, Bp, ab + ' cm', cen).side(A, Cp, ac + ' cm', cen).span(Bp, Cp, bc + ' cm', false, 26);
      return D(`다음 그림과 같이 ∠BAC = 90°인 직각삼각형 ABC의 꼭짓점 A에서 변 BC에 내린 수선의 발을 D라고 하자. ${SG('AB')} = ${ab} cm, ${SG('AC')} = ${ac} cm, ${SG('BC')} = ${bc} cm일 때, 점 A와 직선 BC 사이의 거리는 몇 cm인가?`, ad, { unit: 'cm',
        figure: S.out(`직각삼각형 ABC. 변 BC가 아래에 가로로 놓여 있고(점 B 왼쪽, 점 C 오른쪽) 꼭짓점 A가 위에 있다. ∠BAC에 직각 표시가 있다. 점 A에서 변 BC에 내린 수선의 발이 점 D이고 점 D에 직각 표시가 있다. 변 AB의 길이는 ${ab} cm, 변 AC의 길이는 ${ac} cm, 변 BC의 길이는 ${bc} cm이다.`),
        explain: `점 A에서 직선 BC에 내린 수선의 발이 점 D이므로 구하는 거리는 ${SG('AD')}의 길이이다. ∠BAC = 90°이므로 삼각형 ABC의 넓이는 ${frac(1, 2)} × ${ab} × ${ac} = ${ab * ac / 2}(cm²)이다. 변 BC를 밑변으로 보면 높이가 ${SG('AD')}이므로 ${frac(1, 2)} × ${bc} × ${SG('AD')} = ${ab * ac / 2}에서 ${SG('AD')} = ${ad}(cm)이다.`,
        facts: { calc: [[`${ab}*${ac}/${bc}`, 0]] } });
    }),
    H('hard-para-share', '평행선 사이의 두 각을 같은 비로 나눈 선이 만나는 각', '기본 ①76 / 심53', (d) => {
      const [m, th] = d.pick([[2, 70], [2, 80], [2, 100], [2, 110], [3, 60], [3, 75], [3, 105], [3, 120], [4, 60], [4, 80], [4, 100], [4, 120], [5, 75], [5, 90], [5, 105], [6, 84], [6, 96]]);
      const Hh = m <= 3 ? 92 : m === 4 ? 84 : 74, p = th / m, q = (180 - th) / m, ans = 180 / m, shift = Hh / Math.tan(th * RAD), xa = 34 + Math.max(0, -shift), A = [xa, Hh], Cp = [xa + shift, 0];
      // 점 B: 점 A 에서 직선 l 과 p° 를 이루며 내려온 선과 점 C 에서 직선 m 과 q° 를 이루며 올라온 선의 교점
      const dA = [Math.cos(p * RAD), -Math.sin(p * RAD)], dC = [Math.cos(q * RAD), Math.sin(q * RAD)], t = ((Cp[0] - A[0]) * dC[1] - (Cp[1] - A[1]) * dC[0]) / (dA[0] * dC[1] - dA[1] * dC[0]), Bp = [A[0] + t * dA[0], A[1] + t * dA[1]];
      const w = Bp[0] + 46, S = para({ w, gap: Hh }), Dp = [w - 14, Hh], Ep = [w - 14, 0], whole = d.bool(), part = frac(1, m);
      S.seg(A, Cp).seg(A, Bp).seg(Cp, Bp).dot(A).dot(Cp).dot(Bp).dot(Dp).dot(Ep).name(A, 'A', 90, 11).name(Dp, 'D', 90, 11).name(Cp, 'C', 270, 12).name(Ep, 'E', 270, 12).name(Bp, 'B', 0, 12);
      const cond = whole ? `${nb(`∠DAB = ${part}∠DAC,`)} ${nb(`∠ECB = ${part}∠ECA`)}` : m === 2 ? '∠DAB = ∠BAC, ∠ECB = ∠BCA' : `∠BAC = ${m - 1}∠DAB, ∠BCA = ${m - 1}∠ECB`;
      return N(`다음 그림에서 ${lv('l')} ∥ ${lv('m')}이고 ${cond}일 때, ∠ABC의 크기는?`, ans, { unit: '°',
        figure: S.out('평행한 두 직선 l(위), m(아래). 직선 l 위에 두 점 A, D가 왼쪽부터 차례로 있고 직선 m 위에 두 점 C, E가 왼쪽부터 차례로 있다. 두 점 A, C가 선분으로 이어져 있다. 점 B는 두 직선 사이에서 선분 AC의 오른쪽에 있고, 두 점 A, C와 각각 선분으로 이어져 있다. 각의 크기는 적혀 있지 않다.'),
        explain: `${lv('l')} ∥ ${lv('m')}이므로 ∠DAC의 동위각과 ∠ECA가 평각을 이룬다. 따라서 ∠DAC + ∠ECA = 180°이다. ${whole ? '' : `${cond}에서 `}∠DAB = ${part}∠DAC, ∠ECB = ${part}∠ECA이므로 ∠DAB + ∠ECB = ${part} × 180° = ${ans}°이다. 점 B를 지나고 두 직선에 평행한 직선을 그으면 엇각의 크기가 같으므로 ∠ABC = ∠DAB + ∠ECB = ${ans}°이다.`,
        facts: { calc: [[whole || m === 2 ? `180/${m}` : `180/(${m - 1}+1)`, 0]], unseen: [180, 1, 2] } });
    }, { standard: STD2 }),
    H('hard-bend-times', '꺾인 각 안의 반직선과 몇 배 조건', '기본 ①76', (d) => {
      // ∠AEC = ∠BAE + ∠ECD(꺾인 선)이고 ∠AEC = 2∠BAE + ∠CEF 이므로 ∠ECD = ∠BAE + ∠CEF 이다.
      const [a, c, b, p, q] = d.pick([[20, 40, 60, 3, 2], [25, 50, 75, 3, 2], [20, 60, 80, 4, 3], [20, 30, 50, 5, 3], [30, 45, 75, 5, 3]]), sum = a + c, left = d.bool(), side = left ? '왼쪽' : '오른쪽', back = left ? '오른쪽' : '왼쪽';
      if (2 * a + c !== a + b || p * c !== q * b) throw new Error('각의 조건이 어긋났다');
      const S = bendFig(a, b, { left, names: ['A', 'E', 'C'] }), Fp = pol(S.K, left ? 360 - a : 180 + a, 56), bx = left ? 18 : S.w - 18;
      S.seg(S.K, Fp).dot(Fp).name(Fp, 'F', left ? 360 - a : 180 + a, 11).dot([bx, S.yl]).name([bx, S.yl], 'B', 90, 11).dot([bx, 0]).name([bx, 0], 'D', 270, 12);
      return N(`다음 그림에서 ${lv('l')} ∥ ${lv('m')}이고 ∠AEF = 2∠BAE, ${p}∠CEF = ${q}∠ECD이다. ∠BAE + ∠CEF = ${sum}°일 때, ∠CEF의 크기는?`, c, { unit: '°',
        figure: S.out(`평행한 두 직선 l(위), m(아래). 직선 l 위에 두 점 A, B가 있고 점 B는 점 A의 ${side}에 있다. 직선 m 위에 두 점 C, D가 있고 점 D는 점 C의 ${side}에 있다. 점 E는 두 직선 사이에서 두 점 A, C보다 ${side}에 있고, 선분 AE와 선분 CE가 점 E에서 만나 꺾인 선을 이룬다. 점 E에서 ∠AEC의 안쪽으로, ${back}을 향하여 반직선 EF가 뻗어 있다. 각의 크기는 적혀 있지 않다.`),
        explain: `점 E를 지나고 두 직선에 평행한 직선을 그으면 엇각의 크기가 같으므로 ∠AEC = ∠BAE + ∠ECD이다. 또 ∠AEC = ∠AEF + ∠CEF = 2∠BAE + ∠CEF이다. 두 식에서 ∠ECD = ∠BAE + ∠CEF = ${sum}°이다. ${p}∠CEF = ${q}∠ECD = ${q} × ${sum}° = ${q * sum}°이므로 ∠CEF = ${q * sum}° ÷ ${p} = ${c}°이다.`,
        facts: { calc: [[`${q}*${sum}/${p}`, 0]] } });
    }, { standard: STD2 }),
    H('hard-para-bisect', '삼각형 안의 평행선과 각을 똑같이 나누는 선', '기본 ①77', (d) => {
      const [be, ga] = d.until(() => [10 * d.int(4, 7), 10 * d.int(4, 7)], ([x, y]) => x !== y && x + y <= 120), tb = Math.tan(be * RAD), tg = Math.tan(ga * RAD), hb = Math.tan(be / 2 * RAD), hg = Math.tan(ga / 2 * RAD);
      // 점 P 는 두 각을 똑같이 나누는 선의 교점이고, 선분 DE 는 점 P 를 지나며 변 BC 에 평행하다.
      const W = Math.min(196, 140 * (tb + tg) / (tb * tg)), hA = W * tb * tg / (tb + tg), r = W * hb * hg / (hb + hg), Bp = [0, 0], Cp = [W, 0], A = [hA / tb, hA], Dp = [r / tb, r], Ep = [W - r / tg, r], P = [r / hb, r], S = sheet(), ans = 180 - be / 2 - ga / 2;
      S.poly([A, Bp, Cp], 'fill:' + CREAM + ';stroke:#1f2933;stroke-width:1.6;stroke-linejoin:round').seg(Dp, Ep).seg(Bp, P).seg(Cp, P).dot(P, 2.4);
      S.angle(Dp, 0, be, deg(be)).angle(Ep, 180 - ga, 180, deg(ga));
      S.name(A, 'A', 90).name(Bp, 'B', 210, 12).name(Cp, 'C', 330, 12).name(Dp, 'D', 165, 12).name(Ep, 'E', 15, 12).name(P, 'P', 270, 12);
      return N(`다음 그림의 삼각형 ABC에서 ${SG('DE')} ∥ ${SG('BC')}이고 점 P는 ${SG('DE')} 위의 점이다. ∠ABP = ∠PBC, ∠ACP = ∠PCB이고 ∠ADE = ${be}°, ∠AED = ${ga}°일 때, ∠BPC의 크기는?`, ans, { unit: '°',
        figure: S.out(`삼각형 ABC. 꼭짓점 A가 위에 있고 변 BC가 아래에 가로로 놓여 있다(점 B 왼쪽, 점 C 오른쪽). 점 D는 변 AB 위에, 점 E는 변 AC 위에 있고 선분 DE는 변 BC와 평행하다. 점 P는 선분 DE 위에 있고, 두 점 B, C와 각각 선분으로 이어져 있다. ∠ADE = ${be}°, ∠AED = ${ga}°이다.`),
        explain: `${SG('DE')} ∥ ${SG('BC')}이므로 동위각의 크기가 같아 ∠ABC = ∠ADE = ${be}°, ∠ACB = ∠AED = ${ga}°이다. ∠PBC = ${be}° ÷ 2 = ${be / 2}°, ∠PCB = ${ga}° ÷ 2 = ${ga / 2}°이다. 삼각형 PBC의 세 각의 크기의 합은 180°이므로 ∠BPC = 180° − ${be / 2}° − ${ga / 2}° = ${ans}°이다.`,
        facts: { calc: [[`180-${be}/2-${ga}/2`, 0]], unseen: [180, 2] } });
    }, { standard: STD2 }),
    H('hard-zigzag3', '평행선 사이에서 세 번 꺾인 선', '기본 ②70 / 심51', (d, n) => {
      const flip = d.bool(), head = `다음 그림에서 ${lv('l')} ∥ ${lv('m')}일 때, ${angV('x')}의 크기는?`, near = flip ? '오른쪽' : '왼쪽', away = flip ? '왼쪽' : '오른쪽';
      const turn = ([f, t]) => (flip ? [540 - t, 540 - f] : [f, t]);
      if (n === 0) {
        // 같은 쪽으로 세 번 꺾인다. 꺾인 점마다 앞 선분을 늘인 선과 다음 선분 사이의 각이 적혀 있다.
        const v = d.until(() => { const t = [5 * d.int(5, 7), 5 * d.int(6, 9), 5 * d.int(4, 7), 0, 5 * d.int(6, 9)]; t[3] = 180 - t[0] - t[1] - t[2] - t[4]; return t; }, (t) => t[3] >= 30 && t[3] <= 60 && new Set(t).size >= 4);
        const ask = d.int(1, 3), hd = [v[0], v[0] + v[1], v[0] + v[1] + v[2], 180 - v[4]], len = [52, 48, 48], step = (p, h, L) => [p[0] - L * Math.cos(h * RAD), p[1] - L * Math.sin(h * RAD)];
        // hd: 선분이 직선 l 의 왼쪽 방향과 이루는 각(아래쪽으로 잰다). 넷째 선분은 직선 m 을 지나 조금 더 나아간다.
        const Hh = len.reduce((s, L, i) => s + L * Math.sin(hd[i] * RAD), 0) + 54, raw = [[0, Hh]];
        len.forEach((L, i) => raw.push(step(raw[i], hd[i], L)));
        const Qr = step(raw[3], hd[3], 54 / Math.sin(hd[3] * RAD)), xs = raw.concat([Qr, step(Qr, hd[3], 34)]).map((p) => p[0]), lo = Math.min(...xs), w = Math.max(...xs) - lo + 104;
        const S = para({ w, gap: Hh }), fx = (p) => [flip ? w - (p[0] - lo + 52) : p[0] - lo + 52, p[1]], pts = raw.map(fx), Q = fx(Qr);
        S.seg(pts[0], pts[1]).seg(pts[1], pts[2]).seg(pts[2], pts[3]).seg(pts[3], fx(step(Qr, hd[3], 34)));
        for (let i = 1; i <= 3; i += 1) S.seg(pts[i], fx(step(raw[i], hd[i - 1], 30)), 'thin');
        const r0 = turn([180, 180 + v[0]]), rm = turn([360 - v[4], 360]);
        S.angle(pts[0], r0[0], r0[1], deg(v[0]), { r: 20, at: [(flip ? 1 : -1) * 42, -9] }).angle(Q, rm[0], rm[1], deg(v[4]));
        for (let i = 1; i <= 3; i += 1) {
          const r = turn([180 + hd[i - 1], 180 + hd[i]]), t = i === ask ? '{x}' : deg(v[i]);
          // 좁은 각의 수는 각의 바깥(늘인 선의 바깥쪽)에 적는다.
          if (i !== ask && v[i] < 40) { const out = pol(raw[i], 180 + hd[i - 1] - 22, 38), o2 = fx(out); S.angle(pts[i], r[0], r[1], t, { at: [o2[0] - pts[i][0], o2[1] - pts[i][1]] }); } else S.angle(pts[i], r[0], r[1], t, i === ask ? {} : { d: 18 / Math.tan(v[i] / 2 * RAD) });
        }
        const told = (i) => (i === ask ? angV('x') : v[i] + '°'), rest = [1, 2, 3].filter((i) => i !== ask), W = ['첫째', '둘째', '셋째'];
        return N(head, v[ask], { unit: '°',
          figure: S.out(`평행한 두 직선 l(위), m(아래) 사이에 같은 쪽으로 세 번 꺾인 선이 있다. 직선 l 위의 점에서 ${near} 아래로 내려온 선분이 세 번 꺾이면서 차츰 ${away} 아래로 방향을 바꾸어 직선 m을 지나간다. 꺾인 점마다 앞의 선분을 늘인 선이 가늘게 그어져 있다. 직선 l과 첫째 선분 사이의 각이 ${v[0]}°이다. ${[1, 2, 3].map((i) => `${W[i - 1]} 꺾인 점에서 늘인 선과 다음 선분 사이의 각이 ${i === ask ? '∠x' : v[i] + '°'}`).join(', ')}이다. 직선 m의 아래쪽에서, 직선 m의 ${away}과 넷째 선분 사이의 각이 ${v[4]}°이다.`),
          explain: `꺾인 점마다 두 직선에 평행한 직선을 긋고, 평행한 직선의 ${near}과 선분 사이의 각을 차례로 본다. 동위각의 크기가 같으므로 이 각은 처음의 ${v[0]}°에서 꺾일 때마다 늘인 선과 이루는 각만큼 커지고, 넷째 선분에서는 ${v[0]}° + ${told(1)} + ${told(2)} + ${told(3)}이다. 직선 ${lv('m')}의 아래쪽에서 이 각과 ${v[4]}°인 각이 평각을 이루므로 ${angV('x')} = 180° − ${v[0]}° − ${v[rest[0]]}° − ${v[rest[1]]}° − ${v[4]}° = ${v[ask]}°이다.`,
          facts: { calc: [[`180-${v[0]}-${v[rest[0]]}-${v[rest[1]]}-${v[4]}`, 0]], unseen: [180] } });
      }
      // 지그재그로 세 번 꺾인다. 꺾인 점의 안쪽 각은 차례로 a + u, u + w, w + b 이다.
      const [a, u, w2, b] = d.until(() => [5 * d.int(6, 10), 5 * d.int(5, 9), 5 * d.int(5, 9), 5 * d.int(7, 11)], ([p, q, r, s]) => new Set([p + q, q + r, r + s]).size === 3 && p !== s && q !== r && p + q !== 90 && q + r !== 90 && r + s !== 90);
      const c1 = a + u, c2 = u + w2, c3 = w2 + b, mid = d.bool(), hs = [36, 42, 40, 34], Hh = 152, ys = [152, 116, 74, 34, 0];
      const xr = [0, -hs[0] / Math.tan(a * RAD)]; xr.push(xr[1] + hs[1] / Math.tan(u * RAD)); xr.push(xr[2] - hs[2] / Math.tan(w2 * RAD)); xr.push(xr[3] + hs[3] / Math.tan(b * RAD));
      const lo = Math.min(...xr), w = Math.max(...xr) - lo + 108, S = para({ w, gap: Hh }), pts = xr.map((x, i) => [flip ? w - (x - lo + 54) : x - lo + 54, ys[i]]);
      for (let i = 0; i < 4; i += 1) S.seg(pts[i], pts[i + 1]);
      [[[180, 180 + a], deg(a)], [[360 - u, 360 + a], mid ? deg(c1) : '{x}'], [[180 - u, 180 + w2], mid ? '{x}' : deg(c2)], [[360 - b, 360 + w2], deg(c3)], [[180 - b, 180], deg(b)]].forEach(([r, t], i) => { const s = turn(r); S.angle(pts[i], s[0], s[1], t, t === '{x}' ? {} : { d: room(t, r[1] - r[0]) }); });
      const aux = '꺾인 점마다 두 직선에 평행한 직선을 긋는다. 엇각의 크기는 서로 같으므로 ';
      return N(head, mid ? c2 : c1, { unit: '°',
        figure: S.out(`평행한 두 직선 l(위), m(아래) 사이에 지그재그로 세 번 꺾인 선이 있다. 직선 l 위의 점에서 ${near} 아래로 내려온 선분이 첫째 꺾인 점에서 ${away} 아래로, 둘째 꺾인 점에서 ${near} 아래로, 셋째 꺾인 점에서 다시 ${away} 아래로 꺾여 직선 m 위의 점에 닿는다. 직선 l과 첫째 선분 사이의 각이 ${a}°, 첫째 꺾인 점에서 두 선분 사이의 각이 ${mid ? c1 + '°' : '∠x'}, 둘째 꺾인 점에서 두 선분 사이의 각이 ${mid ? '∠x' : c2 + '°'}, 셋째 꺾인 점에서 두 선분 사이의 각이 ${c3}°, 직선 m과 넷째 선분 사이의 각이 ${b}°이다.`),
        explain: aux + `셋째 꺾인 점의 각 ${c3}°는 아래쪽 ${b}°와 위쪽 ${c3}° − ${b}° = ${w2}°로 나뉜다. ` + (mid
          ? `첫째 꺾인 점의 각 ${c1}°는 위쪽 ${a}°와 아래쪽 ${c1}° − ${a}° = ${u}°로 나뉜다. 둘째 꺾인 점의 각은 위쪽 ${u}°와 아래쪽 ${w2}°로 나뉘므로 ${angV('x')} = ${u}° + ${w2}° = ${c2}°이다.`
          : `둘째 꺾인 점의 각 ${c2}°는 아래쪽 ${w2}°와 위쪽 ${c2}° − ${w2}° = ${u}°로 나뉜다. 첫째 꺾인 점의 각은 위쪽 ${a}°와 아래쪽 ${u}°로 나뉘므로 ${angV('x')} = ${a}° + ${u}° = ${c1}°이다.`),
        facts: { calc: [[mid ? `${c1}-${a}+${c3}-${b}` : `${a}+${c2}-(${c3}-${b})`, 0]] } });
    }, { count: 2, standard: STD2 }),
    H('hard-bulge', '평행선 사이에서 한쪽으로 불룩하게 두 번 꺾인 선', '심50 / 기본 ①75', (d) => {
      const flip = d.bool(), [a, b, s] = d.until(() => [5 * d.int(6, 11), 5 * d.int(6, 11), d.pick([80, 85, 95, 100])], ([p, q, r]) => p !== q && r - q >= 25 && 180 - p - r >= 25);
      const Hh = 132, h1 = 40, h3 = 40, xr = [0, h1 / Math.tan(a * RAD)]; xr.push(xr[1] - (Hh - h1 - h3) / Math.tan(s * RAD)); xr.push(xr[2] - h3 / Math.tan(b * RAD));
      const lo = Math.min(...xr), w = Math.max(...xr) - lo + 106, ys = [Hh, Hh - h1, h3, 0], S = para({ w, gap: Hh }), pts = xr.map((x, i) => [flip ? w - (x - lo + 44) : x - lo + 44, ys[i]]), turn = ([f, t]) => (flip ? [540 - t, 540 - f] : [f, t]);
      for (let i = 0; i < 3; i += 1) S.seg(pts[i], pts[i + 1]);
      [[[360 - a, 360], deg(a)], [[180 - a, 180 + s], '{x}'], [[s, 180 + b], '{y}'], [[0, b], deg(b)]].forEach(([r, t], i) => { const q = turn(r); S.angle(pts[i], q[0], q[1], t); });
      const out = flip ? '왼쪽' : '오른쪽', back = flip ? '오른쪽' : '왼쪽';
      return N(`다음 그림에서 ${lv('l')} ∥ ${lv('m')}일 때, ${angV('x')} + ${angV('y')}의 크기는?`, 180 + a + b, { unit: '°',
        figure: S.out(`평행한 두 직선 l(위), m(아래) 사이에 한쪽으로 불룩하게 두 번 꺾인 선이 있다. 직선 l 위의 점에서 ${out} 아래로 내려온 선분이 첫째 꺾인 점에서 꺾여 아래로 내려가고, 둘째 꺾인 점에서 ${back} 아래로 꺾여 직선 m 위의 점에 닿는다. 두 꺾인 점은 모두 두 직선 위의 점보다 ${out}에 있다. 직선 l과 첫째 선분 사이의 각이 ${a}°, 첫째 꺾인 점에서 두 선분 사이의 각이 ∠x, 둘째 꺾인 점에서 두 선분 사이의 각이 ∠y, 직선 m과 셋째 선분 사이의 각이 ${b}°이다.`),
        explain: `두 꺾인 점을 지나고 두 직선에 평행한 직선을 각각 긋는다. 엇각의 크기가 같으므로 ${angV('x')}는 위쪽 ${a}°와 아래쪽 (${angV('x')} − ${a}°)로, ${angV('y')}는 아래쪽 ${b}°와 위쪽 (${angV('y')} − ${b}°)로 나뉜다. 새로 그은 두 평행한 직선 사이에서 둘째 선분의 같은 쪽에 있는 두 각 (${angV('x')} − ${a}°), (${angV('y')} − ${b}°)의 합은 180°이다. ${angV('x')} + ${angV('y')} = 180° + ${a}° + ${b}° = ${180 + a + b}°이다.`,
        facts: { calc: [[`180+${a}+${b}`, 0]], unseen: [180] } });
    }, { standard: STD2 }),
    H('hard-fold-two', '양쪽을 접은 직사각형 종이의 각', '기본 ②76 ①78', (d) => {
      const flip = d.bool(), [al, be] = d.until(() => [d.int(30, 40), d.int(25, 35)], ([p, q]) => p !== q && 180 - 2 * p - 2 * q >= 36), big = 180 - be, x = 180 - 2 * al - 2 * be, h = 54;
      // 아랫변 위의 점 P 를 지나는 두 접는 선 PL, PR. 접는 선에 대하여 대칭이동한 자리에 접힌 부분을 그린다.
      const P = [0, 0], L = [-h / Math.tan(al * RAD), h], R = [h / Math.tan(be * RAD), h], wl = 22 - L[0], wr = R[0] + 22;
      const refl = (p, a) => { const c = Math.cos(a * RAD), s = Math.sin(a * RAD), k = p[0] * c + p[1] * s; return [2 * k * c - p[0], 2 * k * s - p[1]]; };
      const A0 = [-wl, h], B0 = [-wl, 0], C0 = [wr, 0], D0 = [wr, h], fx = (p) => [flip ? -p[0] : p[0], p[1]], turn = ([f, t]) => (flip ? [540 - t, 540 - f] : [f, t]), S = sheet(), paper = ';stroke:#1f2933;stroke-width:1.5;stroke-linejoin:round';
      [[B0, C0], [B0, A0], [A0, L], [C0, D0], [D0, R]].forEach(([p, q]) => S.seg(fx(p), fx(q), 'dash'));
      S.poly([P, L, R].map(fx), 'fill:rgba(148,163,184,0.55)' + paper).poly([P, L, refl(A0, 180 - al), refl(B0, 180 - al)].map(fx), 'fill:#eef2f7' + paper).poly([P, R, refl(D0, be), refl(C0, be)].map(fx), 'fill:#eef2f7' + paper);
      S.seg(fx(L), fx([-h / Math.tan(2 * al * RAD), h]), 'dash').seg(fx(R), fx([h / Math.tan(2 * be * RAD), h]), 'dash');
      [[L, [360 - al, 360], deg(al), {}], [R, [180 + be, 360], deg(big), {}], [P, [2 * be, 180 - 2 * al], '{x}', { r: 20 }]].forEach(([p, r, t, o]) => { const q = turn(r); S.angle(fx(p), q[0], q[1], t, o); });
      const one = flip ? '오른쪽' : '왼쪽', two = flip ? '왼쪽' : '오른쪽';
      return N(`다음 그림과 같이 직사각형 모양의 종이의 양쪽을, 아랫변 위의 한 점을 지나는 두 선을 접는 선으로 하여 각각 접어 올렸다. ${angV('x')}의 크기는?`, x, { unit: '°',
        figure: S.out(`가로로 긴 직사각형 모양의 종이의 왼쪽 부분과 오른쪽 부분을, 아랫변 위의 한 점을 지나는 두 선을 접는 선으로 하여 각각 접어 올렸다. 접기 전의 모양은 점선으로 그려져 있다. ${one} 접는 선과 윗변 사이의 각 가운데 작은 쪽이 ${al}°이고, ${two} 접는 선과 윗변 사이의 각 가운데 큰 쪽이 ${big}°이다. 아랫변 위의 그 점에서, 접혀 올라간 두 변 사이의 각이 ∠x이다.`),
        explain: `종이의 윗변과 아랫변은 평행하므로 ${one} 접는 선과 아랫변이 이루는 각은 ${al}°인 각의 엇각이어서 ${al}°이다. 접은 각의 크기는 같으므로 ${one}에서 접혀 올라간 변은 아랫변과 ${al}° + ${al}° = ${nb(2 * al + '°를')} 이룬다. ${two} 접는 선과 윗변이 이루는 각 가운데 작은 쪽은 180° − ${big}° = ${be}°이고, 같은 방법으로 ${two}에서 접혀 올라간 변은 아랫변과 ${be}° + ${be}° = ${nb(2 * be + '°를')} 이룬다. 아랫변 위의 점에서 세 각이 평각을 이루므로 ${angV('x')} = 180° − ${2 * al}° − ${2 * be}° = ${x}°이다.`,
        facts: { calc: [[`180-${al}*2-(180-${big})*2`, 0]], unseen: [180, 2] } });
    }, { standard: STD2 }),
    H('hard-net-cube', '전개도로 만든 정육면체에서의 위치 관계', '기본 ①59 ②54 / 심37·38·39', (d, n) => {
      const net = netOf(), figure = netFig(net), rel = (x, s) => relLL(net.sol, x, s), WORD = { same: '겹쳐져 같은 모서리가 된다', para: '평행하다', meet: '한 점에서 만난다', skew: '꼬인 위치에 있다' };
      const fold = `전개도를 접으면 ${net.glued.map((g) => `${g.length === 3 ? '세' : '두'} 점 ${list(g)}${pt(g[g.length - 1], '이/가')}`).join(', ')} 각각 한 점에서 만난다.`;
      const X = d.pick(net.segs), rest = net.segs.filter((s) => s !== X), by = (r) => rest.filter((s) => rel(X, s) === r), far = (s) => !share(X, s), head = '다음 전개도로 만든 정육면체에서 ';
      const say = (s) => `모서리 ${s}${pt(s, '은/는')} 모서리 ${X}${pt(X, '과/와')} ${WORD[rel(X, s)]}.`;
      if (n === 0) {
        // 틀린 보기: 접으면 겹치는 모서리, 평행한 모서리, 전개도에서는 떨어져 있지만 접으면 만나는 모서리
        const right = d.pick(by('skew')), wrong = d.shuffle(by('same')).slice(0, 1).concat(d.shuffle(by('para')).slice(0, 1), d.shuffle(by('meet').filter(far)), d.shuffle(by('para'))).filter((s, i, all) => all.indexOf(s) === i).slice(0, 3), opts = d.shuffle([right].concat(wrong));
        return C(head + `모서리 ${X}${pt(X, '과/와')} 꼬인 위치에 있는 모서리는?`, opts.map((s) => '모서리 ' + s), opts.indexOf(right), { figure, explain: fold + ' ' + opts.map(say).join(' '), facts: { truth: opts.map((s) => rel(X, s) === 'skew'), want: true } });
      }
      if (n === 1) {
        // 틀린 것 하나: 전개도에서는 나란해 보이지만 접으면 평행하지 않은 모서리를 먼저 고른다.
        const flat = (s) => net.grid[s[0]][1] === net.grid[s[1]][1], lure = rest.filter((s) => ['skew', 'meet'].includes(rel(X, s)) && far(s)), odd = d.pick(lure.some((s) => flat(s) === flat(X)) ? lure.filter((s) => flat(s) === flat(X)) : lure), opts = d.shuffle(d.shuffle(by('para')).slice(0, 3).concat([odd]));
        return C(head + `모서리 ${X}${pt(X, '과/와')} 평행한 모서리가 아닌 것은?`, opts.map((s) => '모서리 ' + s), opts.indexOf(odd), { figure, explain: fold + ' ' + opts.map(say).join(' '), facts: { truth: opts.map((s) => rel(X, s) !== 'para'), want: true } });
      }
      const kind = d.pick(['수직인', '평행한']), faceIs = (r) => net.faces.filter((f) => (r === 'perp' ? perpLP(net.sol, X, f) : relLP(net.sol, X, f) === r)), flags = net.faces.map((f) => (kind === '수직인' ? perpLP(net.sol, X, f) : relLP(net.sol, X, f) === 'para'));
      if (faceIs('in').length !== 2 || faceIs('perp').length !== 2 || faceIs('para').length !== 2) throw new Error('모서리와 면의 위치 관계가 어긋났다');
      const faces = (r) => faceIs(r).map((f) => '면 ' + f).join(', ');
      return setQ(d, head + `모서리 ${X}${pt(X, '과/와')} ${kind} 면을 모두 고른 것은?`, net.faces, flags, { show: (f) => '면 ' + f, figure,
        explain: fold + ` 모서리 ${X}${pt(X, '을/를')} 포함하는 면은 ${faces('in')}이고, 모서리 ${X}${pt(X, '과/와')} 한 점에서 만나는(수직인) 면은 ${faces('perp')}, 평행한 면은 ${faces('para')}이다.` });
    }, { count: 3 }),
    H('hard-clock', '시계의 시침과 분침이 이루는 각', '심58', (d) => {
      const [h, m] = d.until(() => [d.int(1, 12), d.pick([10, 20, 40, 50])], ([hh, mm]) => { const t = Math.abs(6 * mm - (30 * (hh % 12) + mm / 2)), s = Math.min(t, 360 - t); return s >= 25 && s <= 165; });
      const hh = h % 12, ma = 6 * m, ha = 30 * hh + m / 2, big = Math.max(ma, ha), small = Math.min(ma, ha), diff = big - small, ans = Math.min(diff, 360 - diff), hour = hh ? `30*${hh}+${m}/2` : `${m}/2`, e1 = ma > ha ? `6*${m}-(${hour})` : `${hour}-6*${m}`;
      return N(`시계가 ${h}시 ${m}분을 가리킬 때, 시침과 분침이 이루는 각 가운데 작은 쪽의 크기는?`, ans, { unit: '°',
        explain: `분침은 1분에 360° ÷ 60 = 6°씩 움직이고, 시침은 1시간에 30°, 1분에 30° ÷ 60 = 0.5°씩 움직인다. 12시 방향에서 시계 방향으로 잰 각의 크기는 분침이 6° × ${m} = ${ma}°, 시침이 ${hh ? `30° × ${hh} + ` : ''}0.5° × ${m} = ${ha}°이다. 두 바늘이 이루는 각의 크기는 ${big}° − ${small}° = ${diff}°${diff > 180 ? `이고, 작은 쪽은 360° − ${diff}° = ${ans}°이다.` : '이다.'} 시침도 ${m}분 동안 움직였음을 빠뜨리지 않는다.`,
        facts: { calc: [[diff > 180 ? `360-(${e1})` : e1, 0]], unseen: [6, 30, 2, 360] } });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
