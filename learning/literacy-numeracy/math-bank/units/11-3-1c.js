// 고등학교 확률과 통계 1단원 「여러 가지 순열과 중복조합」(11-3-1) — 실력 문항.
// 이 단원에서 아이들이 흔히 잘못 아는 것:
//  - 서로 다른 물건을 나누어 줄 때 「모두 적어도 하나씩」을 세려고 두 명 이하에게 준 경우를 빼고 나서, 한 명에게만 준 경우가 두 번 빠진 것을 되돌리지 않는다.
//  - 6의 배수 = 짝수이면서 자리 숫자의 합이 3의 배수. 3으로 나눈 나머지가 다른 숫자를 섞으면 합이 3의 배수가 되지 않는 것을 쓰지 못하고 늘어놓다 빠뜨린다.
//  - 같은 것이 섞인 재료에서 몇 개만 골라 나열할 때, 같은 것을 몇 개 골랐는지로 나누지 않는다. 가진 장수보다 많이 고른 경우를 섞는다.
//  - 색깔이 바뀌는 횟수가 홀수 ⇔ 양 끝의 색이 다르다는 것을 쓰지 못한다.
//  - 중복조합으로 셀 때 가진 개수(상한)를 넘는 경우가 섞이는 것을 놓친다. 「0의 개수는 2」에서 나머지가 양의 정수라는 것을 놓친다.
//  - 치역의 원소 개수가 정해진 증가 함수에서 치역의 원소마다 적어도 하나가 대응해야 하므로 양의 정수해로 세야 하는 것을 놓친다.
//  - 같은 속력으로 마주 보고 가는 두 사람은 똑같은 칸 수를 간 대각선 위에서만 만난다는 것, 두 곳을 오가는 점은 짝수 초마다 출발점에 있다는 것을 쓰지 못한다.
// 실력에 둔 것은 ① 상황·조건의 장치 때문에 배운 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제뿐이다(11-3-1a.js 머리 주석의 기준).
// 기본 문서에만 나온 꼴도 위 잣대에 들면 여기에 실었다(ref 의 ①·②). 심화 문서(대단원 기출 모의고사)의 꼴은 심2·심6·심9 를 실었고,
// 심1·심3·심5·심7·심8 은 하는 일이 같은 기본 유형에 합쳤으며, 심4 는 도로망 그림을 되살릴 수 없어 뺐다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, lines, N } = B.kit;
  const { range, V, nb, tail } = B.kit.mid;
  const { nC, nPi, nH, pw, jh } = B.kit.hs;
  const K = B.kit.u31x;
  const { UNIT, sum, hits, fact, nCr, nHr, same, seqs, multis, tally, told, listJ, KN, combS, hS, powS, sameS, H, lj, vf, fx, upto, setOf, sameT, net, ways, routes, walks, passes, spot, netFig, gridSay } = K;

  const hardTypes = [
    H('hard-rep-kth', '크기 순으로 나열한 수의 차례(중복 허용)', '①9', (d) => {
      const [digs, L, d0] = d.until(() => {
        const s = [0].concat(d.shuffle(range(1, 9)).slice(0, d.int(3, 4))).sort((x, y) => x - y), nz = s.filter((v) => v > 0);
        return [s, d.int(3, 5), d.pick(nz.slice(1))];
      }, ([s, len, top]) => { const m = s.length, below = s.filter((v) => v > 0 && v < top).length; return sum(range(1, len - 1).map((j) => (m - 1) * m ** (j - 1))) + below * m ** (len - 1) + 1 <= 9999; });
      const m = digs.length, nz = digs.filter((v) => v > 0), below = nz.filter((v) => v < d0), X = d0 * 10 ** (L - 1);
      const parts = range(1, L - 1).map((j) => (m - 1) * m ** (j - 1)), last = below.length * m ** (L - 1), ans = sum(parts) + last + 1;
      return N(`${KN[m]} 개의 숫자 ${told(digs)} 중에서 중복을 허용하여 만들 수 있는 자연수를 작은 것부터 차례로 나열할 때, ${josa(X, '은/는')} 몇 번째 수인가?`, ans, {
        unit: '번째',
        explain: `${X}보다 작은 수를 센다. 맨 앞자리에는 0이 올 수 없다. ` + parts.map((v, j) => `${['한', '두', '세', '네', '다섯'][j]} 자리의 수는 ${j === 0 ? `${m - 1}개` : `${m - 1} × ${pw(m, j)} = ${v}(개)`}`).join(', ') + `이다. ${KN[L]} 자리의 수 가운데 맨 앞자리가 ${told(below)}인 것은 ${below.length} × ${pw(m, L - 1)} = ${last}(개)이다. ${X}보다 작은 수가 ${parts.concat([last]).join(' + ')} = ${ans - 1}(개)이므로 ${josa(X, '은/는')} ${ans}번째 수이다.`,
        facts: { calc: [[parts.map((v, j) => (j === 0 ? `(${m}-1)` : `(${m}-1)*${m}**${j}`)).join('+') + `+${below.length}*${m}**${L - 1}+1`, 0]] }
      });
    }),
    H('hard-rep-six', '6의 배수인 세 자리 수(중복 허용) — 3으로 나눈 나머지로 가르기', '①10', (d) => {
      const [r0, other] = d.until(() => {
        const a = [0].concat(d.shuffle([3, 6, 9]).slice(0, d.int(1, 3))), one = d.bool(), b = d.shuffle(one ? [1, 4, 7] : [2, 5, 8]).slice(0, d.int(2, 3));
        return [a.sort((x, y) => x - y), b.sort((x, y) => x - y)];
      }, ([a, b]) => b.some((v) => v % 2 === 0) && a.length + b.length >= 5 && a.length + b.length <= 7);
      const digs = r0.concat(other).sort((x, y) => x - y), cands = [];
      for (const a of digs.filter((v) => v > 0)) for (const b of digs) for (const c of digs) cands.push(100 * a + 10 * b + c);
      const flags = cands.map((v) => v % 6 === 0), even = (l) => l.filter((v) => v % 2 === 0);
      const p0 = r0.filter((v) => v > 0).length * r0.length * even(r0).length, p1 = other.length * other.length * even(other).length, res = other[0] % 3;
      return N(`숫자 ${told(digs)} 중에서 중복을 허용하여 세 개를 택해 세 자리의 자연수를 만들 때, 6의 배수의 개수는?`, hits(flags), {
        unit: '개',
        explain: `6의 배수는 짝수이면서 각 자리의 숫자의 합이 3의 배수인 수이다. 주어진 숫자를 3으로 나눈 나머지로 가르면 나머지가 0인 ${setOf(r0)}, 나머지가 ${res}인 ${setOf(other)}이다. 두 무리를 섞어 고르면 나머지의 합이 ${res} 또는 ${josa(2 * res, '이/가')} 되어 3의 배수가 아니므로 한 무리에서만 골라야 한다. ${setOf(r0)}에서만 고를 때 백의 자리 ${r0.length - 1}가지(0 빼기), 십의 자리 ${r0.length}가지, 일의 자리는 짝수 ${told(even(r0))}의 ${even(r0).length}가지이므로 ${p0}개, ${setOf(other)}에서만 고를 때 ${other.length} × ${other.length} × ${even(other).length} = ${p1}(개)이다. 따라서 ${p0} + ${p1} = ${hits(flags)}(개)이다.`,
        facts: { count: flags }
      });
    }),
    H('hard-onto', '서로 다른 물건을 모두가 적어도 하나씩 받게 나누기', '①16', (d) => {
      const [k, n] = d.pick([[3, 4], [3, 5], [3, 6], [3, 7], [3, 8], [4, 5], [4, 6]]), ppl = d.shuffle(NAMES).slice(0, k), flags = seqs(range(1, k), n).map((t) => new Set(t).size === k);
      const ex3 = `${nPi(3, n)} − ${nC(3, 2)} × ${nPi(2, n)} + 3 = ${3 ** n} − ${3 * 2 ** n} + 3`;
      const ex4 = `${nPi(4, n)} − ${nC(4, 3)} × ${nPi(3, n)} + ${nC(4, 2)} × ${nPi(2, n)} − 4 = ${4 ** n} − ${4 * 3 ** n} + ${6 * 2 ** n} − 4`;
      return N(`서로 다른 책 ${n}권을 ${told(ppl)}의 ${k}명에게 남김없이 나누어 줄 때, ${k}명이 각각 적어도 1권씩 받는 경우의 수는?`, hits(flags), {
        unit: '가지',
        explain: `책마다 받을 사람을 정하는 모든 경우 ${nPi(k, n)}에서 받지 못하는 사람이 있는 경우를 뺀다. ${k - 1}명 이하에게만 주는 경우를 ${k}명 가운데 ${k - 1}명을 골라 ${nC(k, k - 1)} × ${jh(nPi(k - 1, n), '으로/로')} 빼면 그보다 적은 사람에게만 준 경우가 여러 번 빠지므로 되돌려 더한다. ${k === 3 ? '한 명에게만 준 경우 3가지가 두 번 빠졌으므로 한 번 더한다: ' + ex3 : '두 명에게만 준 경우를 더하고 한 명에게만 준 경우를 다시 뺀다: ' + ex4} = ${hits(flags)}(가지)이다.`,
        facts: { count: flags }
      });
    }),
    H('hard-same-pick', '같은 것이 섞인 재료에서 몇 개만 골라 나열하기', '①22', (d) => {
      const [kd, rep, r] = d.until(() => [d.int(4, 6), d.int(2, 3), d.int(3, 4)], ([a, b, c]) => { let s = 0; for (let j = 0; j <= Math.min(b, c); j += 1) s += nCr(a, c - j) * fact(c) / fact(j); return s <= 9999; });
      const D = kd + 1, list = range(1, kd).concat(range(1, rep).map(() => D)), syms = range(1, D), cands = seqs(syms, r);
      const flags = cands.map((t) => { const m = tally(t); return [...m].every(([v, c]) => (v === D ? c <= rep : c <= 1)); });
      const js = range(0, Math.min(rep, r)).filter((j) => r - j <= kd), parts = js.map((j) => nCr(kd, r - j) * fact(r) / fact(j));
      return N(`${list.length}개의 숫자 ${told(list)} 중에서 ${r}개를 택하여 일렬로 나열하는 경우의 수는?`, hits(flags), {
        unit: '가지',
        explain: `${josa(D, '을/를')} 몇 개 택하는지로 나눈다. ` + js.map((j, i) => (j === 0 ? `${josa(D, '을/를')} 택하지 않으면 나머지 ${kd}개에서 ${r}개를 택해 나열하여 ${nC(kd, r)} × ${r}! = ${parts[i]}` : `${josa(D, '을/를')} ${j}개 택하면 나머지 ${kd}개에서 ${r - j}개를 택한 뒤 ${D} ${j}개와 함께 나열하여 ${nC(kd, r - j)} × ${r}!${j > 1 ? '/' + j + '!' : ''} = ${parts[i]}`)).join(', ') + `(가지)이다. 따라서 ${parts.join(' + ')} = ${hits(flags)}(가지)이다.`,
        facts: { count: flags }
      });
    }),
    H('hard-same-posters', '장수가 정해진 종류로 자리 채우기 — 장수 조합으로 나누기', '①25', (d) => {
      const [stock, n] = d.until(() => [[d.int(2, 3), d.int(3, 4), d.int(2, 3)], d.int(5, 6)], ([s, m]) => {
        const comps = multis([0, 1, 2], m).map((t) => [0, 1, 2].map((k) => t.filter((x) => x === k).length)).filter((c) => c.every((v, i) => v >= 1 && v <= s[i]) && c[1] >= 2);
        return comps.length >= 3 && comps.length <= 5;
      });
      const all = seqs([0, 1, 2], n), flags = all.map((t) => { const c = [0, 1, 2].map((k) => t.filter((x) => x === k).length); return c.every((v, i) => v >= 1 && v <= stock[i]) && c[1] >= 2; });
      const comps = multis([0, 1, 2], n).map((t) => [0, 1, 2].map((k) => t.filter((x) => x === k).length)).filter((c) => c.every((v, i) => v >= 1 && v <= stock[i]) && c[1] >= 2);
      return N(`어느 학교에는 포스터를 1장씩 게시할 수 있는 게시판 ${n}곳이 있다. A, B, C 세 종류의 행사 포스터를 A는 ${stock[0]}장, B는 ${stock[1]}장, C는 ${stock[2]}장 만들었다. 다음 조건을 모두 만족시키도록 포스터 ${n}장을 골라 게시판 ${n}곳에 게시하는 경우의 수는? (단, 같은 종류의 포스터끼리는 구별하지 않는다.)`, hits(flags), {
        unit: '가지',
        figure: lines(['㈎ A, B, C 세 종류의 포스터를 각각 1장 이상 게시한다.', '㈏ B는 게시판 2곳 이상에 게시한다.']),
        explain: `만든 장수 안에서 (A, B, C)의 장수가 될 수 있는 것은 ${comps.map((c) => `(${told(c)})`).join(', ')}이다. 각각을 게시판 ${n}곳에 나열하는 경우는 ` + comps.map((c) => `${sameT(c.filter((v) => v > 0))} = ${same(c)}`).join(', ') + `(가지)이므로 ${comps.map(same).join(' + ')} = ${hits(flags)}(가지)이다.`,
        facts: { count: flags }
      });
    }),
    H('hard-color-change', '색이 바뀌는 횟수 — 양 끝의 색', '①31', (d) => {
      const [w, b] = d.until(() => [d.int(2, 4), d.int(3, 7)], ([x, y]) => y > x && x + y <= 11), odd = d.bool(), L = w + b;
      const all = multis(range(0, L - 1), w).filter((t) => new Set(t).size === w), rows = all.map((pos) => range(0, L - 1).map((i) => (pos.includes(i) ? 'W' : 'K')));
      const turns = (row) => row.filter((c, i) => i > 0 && c !== row[i - 1]).length, flags = rows.map((row) => turns(row) % 2 === (odd ? 1 : 0));
      const sample = d.pick(rows.filter((row) => turns(row) >= 3)), shown = sample.map((c) => (c === 'W' ? '○' : '●')).join('');
      const both = same([w - 1, b - 1]), ww = same([w - 2, b]), kk = same([w, b - 2]);
      return N(`흰 바둑돌 ${w}개, 검은 바둑돌 ${b}개를 모두 일렬로 나열하려고 한다. 예를 들어 다음과 같이 나열하면 색깔의 변화가 ${turns(sample)}번 일어난 경우이다. 색깔의 변화가 ${odd ? '홀수' : '짝수'} 번 일어나도록 바둑돌 ${L}개를 나열하는 경우의 수는? (단, ○는 흰 바둑돌, ●는 검은 바둑돌이다.)`, hits(flags), {
        unit: '가지',
        figure: `<div class="mb-lines"><div style="font-size:1.35rem;letter-spacing:3px">${shown}</div></div>`,
        explain: `왼쪽 끝에서 오른쪽 끝까지 가며 색이 바뀔 때마다 색이 뒤집히므로, 변화가 홀수 번이면 양 끝의 색이 다르고 짝수 번이면 양 끝의 색이 같다. ` + (odd
          ? `양 끝에 흰 돌과 검은 돌을 하나씩 놓는 경우 2가지마다 나머지 흰 돌 ${w - 1}개, 검은 돌 ${b - 1}개를 나열하는 ${sameT([w - 1, b - 1].filter((v) => v > 0))} = ${both}(가지)이므로 2 × ${both} = ${hits(flags)}(가지)이다.`
          : `양 끝이 모두 흰 돌이면 나머지를 나열하는 ${ww}가지, 양 끝이 모두 검은 돌이면 ${kk}가지이므로 ${ww} + ${kk} = ${hits(flags)}(가지)이다.`),
        facts: { count: flags }
      });
    }),
    H('hard-road-meet', '마주 보고 가는 두 사람이 만나는 경우', '①37', (d) => {
      const [w, h] = d.pick([[3, 3], [4, 4], [4, 2], [5, 3], [6, 2]]), g = net(w, h), half = (w + h) / 2;
      const meets = range(0, w).map((x) => [x, half - x]).filter(([x, y]) => y >= 0 && y <= h), sq = meets.map((p) => (ways(g, [0, 0], p) * ways(g, p, [w, h])) ** 2), ans = sum(sq);
      const [p1, p2] = d.shuffle(NAMES).slice(0, 2);
      return N(`그림과 같이 ${w === h ? '정사각형' : '직사각형'} 모양으로 연결된 도로망이 있다. 이 도로망을 따라 ${name(p1, '은/는')} A 지점에서 출발하여 B 지점까지, ${name(p2, '은/는')} B 지점에서 출발하여 A 지점까지 최단 거리로 간다. 두 사람이 동시에 출발하여 같은 속력으로 갈 때, 두 사람이 서로 만나는 경우의 수는?`, ans, {
        unit: '가지',
        figure: netFig(g, { say: `도로망 그림: 가로 ${w}칸, 세로 ${h}칸인 바둑판 모양으로 길이 연결되어 있다. 왼쪽 아래 끝이 A, 오른쪽 위 끝이 B이다.` }),
        explain: `A에서 B까지는 ${w + h}칸이므로 같은 속력으로 가는 두 사람은 저마다 ${half}칸씩 간 곳, 곧 A에서 오른쪽과 위쪽으로 모두 합해 ${half}칸 간 점 ${meets.length}개 가운데 한 곳에서만 만난다. 그런 점 P마다 (A → P → B의 수)²가지이다: ` + meets.map((p, i) => `${spot(p)}에서 ${sq[i]}가지`).join(', ') + `. 따라서 ${sq.join(' + ')} = ${ans}(가지)이다.`,
        facts: { calc: [[meets.map((p) => `(${ways(g, [0, 0], p)}*${ways(g, p, [w, h])})**2`).join('+'), 0]] }
      });
    }),
    H('hard-road-moving', '두 곳을 오가는 점을 피해 가는 최단 경로', '①38', (d) => {
      const [w, h, Cp, one, two] = d.until(() => {
        const [a, b] = d.pick([[5, 3], [6, 3], [5, 4], [4, 4]]), cs = range(1, a - 1).map((x) => [x, 4 - x]).filter(([x, y]) => y >= 1 && y <= b - 1), c = d.pick(cs);
        const o = d.bool() ? [c[0] - 1, c[1]] : [c[0], c[1] - 1], t = d.bool() ? [c[0] + 1, c[1]] : [c[0], c[1] + 1];
        return [a, b, c, o, t];
      }, ([a, b, c, o, t]) => {
        const all = routes(a, b), at = (k) => [c, o, c, t][k % 4];
        const meet = (rt) => rt.some((p, k) => (p[0] === at(k)[0] && p[1] === at(k)[1]) || (k + 1 < rt.length && p[0] === at(k + 1)[0] && p[1] === at(k + 1)[1] && rt[k + 1][0] === at(k)[0] && rt[k + 1][1] === at(k)[1]));
        return all.every((rt) => meet(rt) === passes(rt, c));
      });
      const g = net(w, h), all = routes(w, h), at = (k) => [Cp, one, Cp, two][k % 4];
      const meet = (rt) => rt.some((p, k) => (p[0] === at(k)[0] && p[1] === at(k)[1]) || (k + 1 < rt.length && p[0] === at(k + 1)[0] && p[1] === at(k + 1)[1] && rt[k + 1][0] === at(k)[0] && rt[k + 1][1] === at(k)[1]));
      const flags = all.map((rt) => !meet(rt)), tot = all.length, ac = ways(g, [0, 0], Cp), cb = ways(g, Cp, [w, h]);
      const side = (p) => (p[0] !== Cp[0] ? (p[0] < Cp[0] ? '왼쪽' : '오른쪽') : (p[1] < Cp[1] ? '아래쪽' : '위쪽'));
      return N(`그림과 같이 한 변의 길이가 1인 정사각형 ${w * h}개로 이루어진 바둑판 모양의 도로망이 있다. 점 P는 이 도로망을 따라 A 지점에서 출발하여 B 지점까지 최단 거리로 매초 1의 일정한 속력으로 움직이고, 점 Q는 C 지점에서 출발하여 매초 1의 일정한 속력으로 C → ① → C → ② → C → ① → C → ⋯ 와 같이 두 지점 ①, ②를 오간다. 두 점 P, Q가 동시에 출발할 때, 점 P가 점 Q와 만나지 않고 B 지점까지 가는 경우의 수는?`, hits(flags), {
        unit: '가지',
        figure: netFig(g, { pts: [{ p: Cp, t: 'C', a: 225 }, { p: one, t: '①', a: side(one) === '왼쪽' ? 135 : 315, g: 15 }, { p: two, t: '②', a: 45, g: 15 }], say: gridSay(w, h) + ` 점 C는 ${spot(Cp)}이다. 지점 ①은 C의 바로 ${side(one)} 점, 지점 ②는 C의 바로 ${side(two)} 점이다.` }),
        explain: `Q는 0초, 2초, 4초, …에 C에 있고, 1초, 5초, 9초, …에 ①, 3초, 7초, 11초, …에 ②에 있다. P는 ${V('t')}초 동안 ${V('t')}칸을 간다. C는 A에서 4칸이므로 P가 C를 지나면 4초에 Q와 C에서 만난다. ①은 A에서 3칸이라 P는 3초에 지나는데 그때 Q는 ②에 있고, ②는 A에서 5칸이라 P는 5초에 지나는데 그때 Q는 ①에 있으므로 다른 곳에서는 만나지 않는다. 따라서 모든 경우 ${sameT([w, h])} = ${tot}(가지)에서 C를 지나는 ${ac} × ${cb} = ${ac * cb}(가지)를 빼서 ${hits(flags)}가지이다.`,
        facts: { count: flags }
      });
    }),
    H('hard-h-cap', '개수 상한이 걸린 중복조합 — 넘치는 경우를 뺌', '②8', (d) => {
      const [st, r] = d.until(() => [[d.int(2, 4), d.int(3, 7), d.int(5, 9)], d.int(5, 8)], ([s, rr]) => {
        const capped = s.filter((v) => v < rr);
        return capped.length >= 1 && capped.length <= 2 && (capped.length < 2 || capped[0] + capped[1] + 2 > rr) && s[0] < s[1] && s[1] < s[2];
      });
      const kinds = ['원', '삼각형', '사각형'], all = seqs(range(0, r), 3), flags = all.map((t) => sum(t) === r && t.every((v, i) => v <= st[i]));
      const capped = st.map((s, i) => [s, i]).filter(([s]) => s < r), cuts = capped.map(([s]) => nHr(3, r - s - 1)), tot = nHr(3, r);
      return N(`${kinds.map((k, i) => `${k} ${st[i]}개`).join(', ')} 중에서 ${r}개의 도형을 택하는 경우의 수는? (단, 같은 종류의 도형끼리는 서로 구별하지 않는다.)`, hits(flags), {
        unit: '가지',
        explain: `택하는 원, 삼각형, 사각형의 개수를 ${V('x')}, ${V('y')}, ${V('z')}라 하면 ${nb(`${V('x')} + ${V('y')} + ${V('z')} = ${r}`)}의 음이 아닌 정수해 ${nH(3, r)} = ${tot}(개)에서 가진 개수보다 많이 택한 것을 빼야 한다. ` + capped.map(([s, i], j) => `${kinds[i]}을 ${s + 1}개 이상 택하는 경우는 ${s + 1}개를 먼저 택하고 나머지 ${r - s - 1}개를 택하는 ${nH(3, r - s - 1)} = ${cuts[j]}(가지)`).join(', ') + `이다${capped.length > 1 ? '(두 경우가 함께 일어나지는 않는다)' : ''}. 따라서 ${tot} − ${cuts.length > 1 ? '(' + cuts.join(' + ') + ')' : cuts[0]} = ${hits(flags)}(가지)이다.`,
        facts: { count: flags }
      });
    }),
    H('hard-hfun-range', '치역의 원소 개수가 정해진 증가 함수', '②27', (d, n) => {
      const [m, k] = d.until(() => [d.int(5, 7), d.int(2, 4)], ([a, b]) => b < a && nCr(a, b) * nCr(a - 1, b - 1) <= 9999);
      const all = multis(range(1, m), m), rangeSz = (t) => new Set(t).size, comp = nCr(m - 1, k - 1);
      const cond = [`㈎ 함수 ${vf}의 치역의 원소의 개수는 ${k}이다.`, `㈏ X의 임의의 두 원소 ${V('a')}, ${V('b')}에 대하여 ${nb(`${V('a')} &lt; ${V('b')}`)}이면 ${nb(`${fx(V('a'))} ≤ ${fx(V('b'))}`)}`];
      if (n === 0) {
        const flags = all.map((t) => rangeSz(t) === k), pick = nCr(m, k);
        return N(`집합 X = ${upto(m)}에 대하여 다음 조건을 모두 만족시키는 함수 ${vf}: X → X의 개수는?`, hits(flags), {
          unit: '개',
          figure: lines(cond),
          explain: `치역이 될 원소 ${k}개를 고르는 경우는 ${nC(m, k)} = ${pick}(가지)이다. ㈏에서 함숫값은 작은 것부터 차례로 놓이고, 치역의 원소마다 X의 원소가 적어도 하나 대응해야 하므로 대응하는 원소의 개수 ${V('x')}<sub>1</sub>, …, ${jh(V('x') + '<sub>' + k + '</sub>', '은/는')} 합이 ${m}인 자연수이다. 그 경우는 ${nH(k, m - k)} = ${comp}(가지)이므로 ${pick} × ${comp} = ${hits(flags)}(개)이다.`,
          facts: { count: flags }
        });
      }
      const t = 2, flags = all.map((s) => rangeSz(s) === k && s[0] <= t), picks = range(1, t).map((v) => nCr(m - v, k - 1));
      return N(`집합 X = ${upto(m)}에 대하여 다음 조건을 모두 만족시키는 함수 ${vf}: X → X의 개수는?`, hits(flags), {
        unit: '개',
        figure: lines(cond.concat([`㈐ ${fx(1)} ≤ ${t}`])),
        explain: `${fx(1)}은 치역의 가장 작은 원소이다. ${fx(1)} = 1이면 나머지 치역의 원소 ${k - 1}개를 2부터 ${m}까지에서 고르는 ${nC(m - 1, k - 1)} = ${picks[0]}(가지), ${fx(1)} = 2이면 3부터 ${m}까지에서 고르는 ${nC(m - 2, k - 1)} = ${picks[1]}(가지)이다. 치역의 원소마다 X의 원소가 적어도 하나 대응하는 경우는 ${nH(k, m - k)} = ${comp}(가지)이므로 (${picks.join(' + ')}) × ${comp} = ${hits(flags)}(개)이다.`,
        facts: { count: flags }
      });
    }, { count: 2 }),
    H('hard-chain-func', '두 부등식 사슬이 한 원소에서 만나는 함수', '심2', (d) => {
      const c = d.int(1, 3), mm = d.int(5, 7), Y = range(1, mm).map((i) => i * c), roles = d.shuffle([1, 2, 3, 4, 5]);
      const [e, l1, u1, u2, l2] = roles;
      const terms = range(2, mm - 1).map((i) => [Y[i - 1], (i - 1) ** 2 * (mm - i) ** 2, i - 1, mm - i]), ans = sum(terms.map((t) => t[1]));
      return N(`두 집합 X = ${upto(5)}, Y = ${setOf(Y)}에 대하여 X에서 Y로의 함수 ${vf} 중에서 다음 조건을 만족시키는 함수의 개수는?`, ans, {
        unit: '개',
        figure: lines([`㈎ ${nb(`${fx(l1)} &lt; ${fx(e)} &lt; ${fx(u1)}`)}`, `㈏ ${nb(`${fx(u2)} &gt; ${fx(e)} &gt; ${fx(l2)}`)}`]),
        explain: `두 조건을 합치면 ${fx(l1)}, ${jh(fx(l2), '은/는')} ${fx(e)}보다 작고, ${fx(u1)}, ${jh(fx(u2), '은/는')} ${fx(e)}보다 크다. ${jh(fx(l1), '과/와')} ${fx(l2)}, ${jh(fx(u1), '과/와')} ${fx(u2)} 사이에는 크기 조건이 없다. 그래서 ${fx(e)}의 값을 정하면 작은 쪽 둘은 그보다 작은 값에서, 큰 쪽 둘은 그보다 큰 값에서 각각 중복을 허용하여 고른다. ` + terms.map(([v, cnt, lo, hi]) => `${fx(e)} = ${v}이면 ${nPi(lo, 2)} × ${nPi(hi, 2)} = ${cnt}`).join(', ') + `이므로 ${terms.map((t) => t[1]).join(' + ')} = ${ans}(개)이다.`,
        facts: { calc: [[terms.map(([, , lo, hi]) => `${lo}**2*${hi}**2`).join('+'), 0]] }
      });
    }),
    H('hard-heq-zeros', '0의 개수가 정해진 음이 아닌 정수해', '심6', (d) => {
      const [k, z, s] = d.until(() => [d.int(4, 6), d.int(1, 3), d.int(5, 14)], ([a, b, c]) => a - b >= 2 && c >= a - b + 1 && nCr(a, b) * nCr(c - 1, a - b - 1) <= 9999 && nCr(a, b) * nCr(c - 1, a - b - 1) >= 20);
      const vs = 'abcdef'.slice(0, k).split('').map((ch) => V(ch)), pos = k - z, pick = nCr(k, z), sol = nHr(pos, s - pos);
      return N(`다음 조건을 모두 만족시키는 음이 아닌 정수 ${told(vs)}의 순서쌍 (${told(vs)})의 개수는?`, pick * sol, {
        unit: '개',
        figure: lines([`㈎ ${told(vs)} 중에서 0의 개수는 ${z}이다.`, `㈏ ${nb(vs.join(' + ') + ' = ' + s)}`]),
        explain: `0이 될 ${z}개를 고르는 경우는 ${nC(k, z)} = ${pick}(가지)이다. 나머지 ${pos}개는 0이 아니므로 양의 정수이고 합이 ${s}이다. 그 해는 각각에서 1씩 뺀 음이 아닌 정수 ${pos}개의 합이 ${s - pos}인 해와 같으므로 ${nH(pos, s - pos)} = ${sol}(개)이다. 따라서 ${pick} × ${sol} = ${pick * sol}(개)이다.`,
        facts: { calc: [[`${combS(k, z)}*${hS(pos, s - pos)}`, 0]] }
      });
    }),
    H('hard-pens', '개수 한계가 있는 세 종류에서 골라 두 사람에게 나누기', '심9', (d) => {
      const [st, r] = d.until(() => [[d.int(1, 2), d.int(3, 4), d.int(3, 4)], d.int(4, 6)], ([s, rr]) => { const cs = multis([0, 1, 2], rr).map((t) => [0, 1, 2].map((k) => t.filter((x) => x === k).length)).filter((c) => c.every((v, i) => v <= s[i])); return cs.length >= 4 && cs.length <= 9 && rr <= sum(s) - 1; });
      const comps = multis([0, 1, 2], r).map((t) => [0, 1, 2].map((k) => t.filter((x) => x === k).length)).filter((c) => c.every((v, i) => v <= st[i])).sort((x, y) => x[0] - y[0] || x[1] - y[1]);
      const val = (c) => c.reduce((p, v) => p * (v + 1), 1), parts = comps.map(val), ans = sum(parts), [p1, p2] = d.shuffle(NAMES).slice(0, 2);
      return N(`검은색 볼펜 ${st[0]}자루, 파란색 볼펜 ${st[1]}자루, 빨간색 볼펜 ${st[2]}자루가 있다. 이 ${sum(st)}자루의 볼펜 중에서 ${r}자루를 골라 ${told([p1, p2])} 두 학생에게 남김없이 나누어 주는 경우의 수는? (단, 같은 색 볼펜끼리는 서로 구별하지 않고, 볼펜을 1자루도 받지 못하는 학생이 있을 수 있다.)`, ans, {
        unit: '가지',
        explain: `고른 (검은색, 파란색, 빨간색)의 자루 수는 ${comps.map((c) => `(${told(c)})`).join(', ')}이다. 색마다 두 학생에게 나누어 주는 경우는 ${nH(2, V('k'))} = ${V('k')} + 1이므로 고른 자루 수가 (${V('p')}, ${V('q')}, ${V('r')})이면 ${nb(`(${V('p')} + 1)(${V('q')} + 1)(${V('r')} + 1)`)}가지이다. 차례로 ${parts.join(', ')}가지이므로 모두 ${parts.join(' + ')} = ${ans}(가지)이다.`,
        facts: { calc: [[comps.map((c) => c.map((v) => `(${v}+1)`).join('*')).join('+'), 0]] }
      });
    })
  ];

  B.addGroup(UNIT, { id: 'hard', title: '실력 문제', standard: K.S1, types: hardTypes.map((t) => (/h-cap|hfun|heq|pens/.test(t.id) ? Object.assign(t, { standard: K.S2 }) : t)) });
})(typeof window !== 'undefined' ? window : globalThis);
