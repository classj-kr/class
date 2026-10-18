// 중학교 3학년 2학기 6단원 산점도와 상관관계 — 뒤쪽 묶음(조건에 맞는 자료의 평균과 대푯값, 상관관계의 종류, 상황과 상관관계, 상관관계로 산점도 해석하기).
// 단원 틀과 그림 도구, 싣는 기준, 뺀 것과 까닭은 9-2-6a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 이 파일에서 따로 정한 것
//  - 산점도에서 읽은 자료의 대푯값(최빈값·중앙값)은 중학교 1학년 내용(2022 [9수04-01])이지만, 산점도에서 한 변량의 값만 모아 읽는 일이 이 단원의 일이라 실었다.
//  - 상황의 상관관계는 수집본(교과서·평가 자료)이 답으로 준 짝만 쓴다(여름철 기온과 냉방비, 산의 높이와 기온, 지능지수와 몸무게 …). 생활 지식으로 판단이 갈릴 짝은 쓰지 않는다.
//  - 「~에 비하여」는 점들의 경향을 나타내는 직선(최소제곱으로 구한 직선)의 위쪽·아래쪽으로 가린다. 이름 붙은 점은 그 직선에서 크게 벗어난 점과 직선 가까이 있는 점으로만 고르고,
//    세로 값이 가장 큰 점(또는 가로 값이 가장 큰 점)을 직선 가까이에 두어 「가장 많은」과 「~에 비하여 가장 많은」을 갈라 읽게 한다.
//    직선은 세로 값을 가로 값으로 어림한 것과 가로 값을 세로 값으로 어림한 것 둘로 구해, 두 직선이 같은 점을 가리킬 때만 낸다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, N, C } = B.kit;
  const { LAB, range, tail, V, nb, claimQ } = B.kit.mid;
  const K = B.kit.m926;
  const { T, sum, cnt, ones, corr, fit, subj, topic, obj, wa, amt, REL, test, ptx, ptj, list, howMany, PAIR, SAME, scaleOf, cells, idx, pairOf, sameOf, intro,
    gridSet, data, scatter, shapePts, shapeFig, figOpt, figRow, pairTable, HAN, bogi, comboChoice, inner, cond, same, sumEnds } = K;
  const X_ = V('x'), Y_ = V('y');

  // ── 「~에 비하여」 그림 ──
  // 눈금의 수가 없는 산점도(가로·세로 0~12칸). 이름 붙은 점의 몫(role): 'up' 경향선보다 크게 위, 'down' 크게 아래, 'top' 경향선 가까이에서 세로 값이 가장 큰 점,
  //  'right' 경향선 가까이에서 가로 값이 가장 큰 점, 'on' 경향선 가까이. 돌려주는 것: { pts, marks: [{ x, y, name, role }] }
  const RELS = [
    { who: '학생', a: '용돈', au: '원', b: '저축액', bu: '원', about: '한 달 용돈과 저축액', aw: '많을수록', bw: '많다', more: '많은', less: '적은', most: '가장 많은', least: '가장 적은', top: '저축액이 가장 많은', topSay: '저축액이 가장 많다' },
    { who: '직장인', group: '어느 회사의 직장인', a: '월급', au: '원', b: '저축액', bu: '원', about: '한 달 월급과 저축액', aw: '많을수록', bw: '많다', more: '많은', less: '적은', most: '가장 많은', least: '가장 적은', top: '저축액이 가장 많은', topSay: '저축액이 가장 많다' },
    { who: '학생', a: '학습 시간', au: '시간', b: '시험 점수', bu: '점', about: '일주일 동안의 학습 시간과 시험 점수', aw: '길수록', bw: '높다', more: '높은', less: '낮은', most: '가장 높은', least: '가장 낮은', top: '시험 점수가 가장 높은', topSay: '시험 점수가 가장 높다' },
    { who: '사람', group: '여행을 다녀온 사람', a: '여행 거리', au: 'km', b: '여행 경비', bu: '원', about: '여행 거리와 여행 경비', aw: '길수록', bw: '많다', more: '많은', less: '적은', most: '가장 많은', least: '가장 적은', top: '여행 경비가 가장 많은', topSay: '여행 경비가 가장 많다' },
    { who: '학생', a: '키', au: 'cm', b: '몸무게', bu: 'kg', about: '키와 몸무게', aw: '클수록', bw: '많이 나간다', more: '많이 나가는', less: '적게 나가는', most: '가장 많이 나가는', least: '가장 적게 나가는', top: '몸무게가 가장 많이 나가는', topSay: '몸무게가 가장 많이 나간다' }
  ].map((c) => Object.assign({ group: '어느 반 학생', cnt: '명' }, c));
  const RX = scaleOf([0, 12, 1], ''), RY = scaleOf([0, 12, 1], '');
  // 가로 값을 세로 값으로 어림한 직선 x = a' + b' y
  const fitX = (pts) => { const f = fit(pts.map(([x, y]) => [y, x])); return f; };
  function relSet(d, roles, n) {
    return d.until(() => {
      const base = gridSet(d, RX, RY, n, 1, 1.1), used = new Set(base.map((p) => p.join(','))), extra = [];
      for (const r of roles) {
        if (r !== 'up' && r !== 'down') continue;
        const x = d.int(3, 9), y = x + (r === 'up' ? 1 : -1) * d.int(4, 5);
        if (y < 0 || y > 12 || used.has(x + ',' + y)) return null;
        used.add(x + ',' + y); extra.push({ p: [x, y], role: r });
      }
      const pts = base.concat(extra.map((e) => e.p)), f = fit(pts), g = fitX(pts), res = ([x, y]) => y - (f.a + f.b * x), resX = ([x, y]) => x - (g.a + g.b * y);
      const near = base.filter((p) => Math.abs(res(p)) <= 0.8 && Math.abs(resX(p)) <= 0.8);
      const marks = extra.slice();
      for (const r of roles) {
        if (r === 'up' || r === 'down') continue;
        const left = near.filter((p) => !marks.some((m) => m.p === p));
        if (!left.length) return null;
        const p = r === 'top' ? left.reduce((s, q) => (q[1] > s[1] ? q : s)) : r === 'right' ? left.reduce((s, q) => (q[0] > s[0] ? q : s)) : d.pick(left);
        marks.push({ p, role: r });
      }
      return { pts, marks, res, resX };
    }, (s) => {
      if (!s) return false;
      const r = s.marks.map((m) => s.res(m.p)), rx = s.marks.map((m) => s.resX(m.p)), at = (role) => s.marks.findIndex((m) => m.role === role);
      const up = at('up'), down = at('down'), top = at('top'), right = at('right');
      const ok = (i, v, sign) => i < 0 || v.every((w, j) => j === i || sign * (v[i] - w) >= 1.2);
      if (!ok(up, r, 1) || !ok(down, r, -1) || !ok(up, rx, -1) || !ok(down, rx, 1)) return false;
      if (top >= 0 && !s.marks.every((m, j) => j === top || s.marks[top].p[1] - m.p[1] >= 1)) return false;
      if (right >= 0 && !s.marks.every((m, j) => j === right || s.marks[right].p[0] - m.p[0] >= 1)) return false;
      return s.marks.every((m) => m.p[1] >= 1) && corr(s.pts) >= 0.6;
    });
  }
  // 이름(A~E)을 섞어 붙이고 그림을 그린다.
  function relFig(d, c, set, axes) {
    const names = d.shuffle(['A', 'B', 'C', 'D', 'E']).slice(0, set.marks.length).sort();
    const order = d.shuffle(set.marks.map((_, i) => i));
    const marks = order.map((i, k) => ({ x: set.marks[i].p[0], y: set.marks[i].p[1], name: names[k], role: set.marks[i].role }));
    const [xa, xu, ya, yu] = axes || [c.a, c.au, c.b, c.bu];
    return { marks, figure: scatter({ X: scaleOf([0, 12, 1], `${xa}(${xu})`), Y: scaleOf([0, 12, 1], `${ya}(${yu})`), pts: set.pts, marks, nums: false, square: true }) };
  }
  const relIntro = (c, n) => `다음 산점도는 ${c.group} ${n}${c.cnt}의 ${obj(c.about)} 조사하여 나타낸 것이다.`;
  const nameList = (marks) => marks.map((m) => m.name).join(', ');

  // ═══ 조건에 맞는 자료의 평균과 대푯값 ═══
  const MEAN = [
    T('mean-cond', '한 변량이 조건에 맞는 사람들의 다른 변량의 평균', '①19', (d, k) => {
      // 차례 0: 가로의 값이 기준 이상인 사람들의 세로 값의 평균(기준선 위의 점도 넣는다). 차례 1: 점 A와 가로의 값이 같은 사람들(A 포함)의 세로 값의 평균.
      const { c, X, Y } = d.bool() && k === 0 ? sameOf(d) : pairOf(d, PAIR.filter((p) => p.k !== 0)), n = d.int(13, 20);
      if (k === 0) {
        let p0;
        const pts = data(d, X, Y, n, c.k == null ? 1 : c.k, (p) => {
          p0 = inner(d, X); const sub = p.filter(([x]) => x >= p0), strict = p.filter(([x]) => x > p0);
          return sub.length >= 4 && sub.length <= 8 && strict.length < sub.length && sum(sub.map((q) => q[1])) % sub.length === 0 && sum(strict.map((q) => q[1])) * sub.length !== sum(sub.map((q) => q[1])) * strict.length;
        });
        const sub = pts.filter(([x]) => x >= p0), ys = sub.map((q) => q[1]), m = sum(ys) / sub.length;
        return N(`${intro(c, n)} ${cond(c, 0, 'ge', p0)}인 ${c.who}들의 ${c.b}의 평균은?`, m, { unit: c.bu, figure: scatter({ X, Y, pts, square: Boolean(c.u) }),
          explain: `${cond(c, 0, 'ge', p0)}인 점은 ${list(sub)}의 ${sub.length}개이다(기준선 위의 점도 넣는다). ${c.b}의 평균은 (${ys.join(' + ')}) ÷ ${sub.length} = ${m}이다.`,
          facts: { calc: [[`(${ys.join('+')})/(${ones(sub.length)})`, 0]], unseen: [1] } });
      }
      let A;
      const pts = data(d, X, Y, n, c.k, (p) => {
        const cols = p.filter(([x]) => { const s = p.filter((q) => q[0] === x); return s.length >= 3 && s.length <= 5 && sum(s.map((q) => q[1])) % s.length === 0; });
        if (!cols.length) return false; A = d.pick(cols); return true;
      });
      const sub = pts.filter(([x]) => x === A[0]), ys = sub.map((q) => q[1]), m = sum(ys) / sub.length;
      return N(`${intro(c, n)} 점 A가 나타내는 ${wa(c.who)} ${subj(c.a)} 같은 ${c.who}들(A 포함)의 ${c.b}의 평균은?`, m, { unit: c.bu,
        figure: scatter({ X, Y, pts, marks: [{ x: A[0], y: A[1], name: 'A' }] }),
        explain: `점 A를 지나고 세로축에 평행한 직선 위의 점은 ${list(sub)}의 ${sub.length}개이다. ${c.b}의 평균은 (${ys.join(' + ')}) ÷ ${sub.length} = ${m}이다.`,
        facts: { calc: [[`(${ys.join('+')})/(${ones(sub.length)})`, 0]], unseen: [1] } });
    }, { count: 2 }),
    T('mean-rank', '두 변량의 합으로 매긴 등수의 평균', '①20', (d) => {
      // 합이 같은 점은 오른쪽 아래로 향하는 한 직선 위에 있다. 위에서 k+1번째까지 합이 모두 다르게 하여 등수가 하나로 정해지게 한다.
      const { c, X, Y } = sameOf(d, SAME.filter((s) => s.u === '점' && s.sc.some((v) => v[2] >= 5))), n = d.int(14, 20), k = d.int(3, 5);
      const ranked = (p) => p.slice().sort((P, Q) => Q[0] + Q[1] - (P[0] + P[1]));
      const pts = data(d, X, Y, n, 1, (p) => { const r = ranked(p); return range(0, k - 1).every((i) => r[i][0] + r[i][1] > r[i + 1][0] + r[i + 1][1]) && (r[k - 1][0] + r[k - 1][1]) % 2 === 0; }, 1.5);
      const r = ranked(pts), P = r[k - 1], m = (P[0] + P[1]) / 2;
      return N(`${intro(c, n)} ${wa(c.a)} ${c.b}의 합이 큰 순서로 등수를 매길 때, ${k}등인 ${c.who}의 두 점수의 평균은?`, m, { unit: '점', figure: scatter({ X, Y, pts, square: true }),
        explain: `합이 같은 점은 오른쪽 아래로 향하는 한 직선 위에 있으므로 그런 직선을 오른쪽 위에서부터 옮겨 가며 만나는 차례가 등수이다. 합이 큰 순서로 ${r.slice(0, k + 1).map((q) => `${ptx(q)}(합 ${q[0] + q[1]})`).join(', ')}이므로 ${k}등은 ${ptx(P)}이다. 평균은 (${P[0]} + ${P[1]}) ÷ 2 = ${m}이다.`,
        facts: { calc: [[`(${P[0]}+${P[1]})/2`, 0]], unseen: [2] } });
    }),
    T('mean-mode', '산점도에서 읽은 한 변량의 대푯값', '①21', (d, k) => {
      // 차례 0: 세로 값의 최빈값(하나뿐이다). 차례 1: 가로 값의 중앙값(점의 수가 홀수).
      const { c, X, Y } = sameOf(d, SAME.filter((s) => s.sc.some((v) => v[2] === 1))), n = k === 0 ? d.int(13, 18) : d.pick([11, 13, 15]);
      const tally = (vs) => { const m = new Map(); vs.forEach((v) => m.set(v, (m.get(v) || 0) + 1)); return m; };
      if (k === 0) {
        const pts = data(d, X, Y, n, 1, (p) => { const t = [...tally(p.map((q) => q[1])).values()].sort((a, b) => b - a); return t[0] >= 3 && t[0] - t[1] >= 1; }, 1.6);
        const t = tally(pts.map((q) => q[1])), top = Math.max(...t.values()), mo = [...t.keys()].find((v) => t.get(v) === top);
        return N(`${intro(c, n)} ${c.b}의 최빈값은?`, mo, { unit: c.u, figure: scatter({ X, Y, pts, square: true }),
          explain: `세로축의 값마다 점의 수를 세면 ${mo}인 눈금선 위의 점이 ${top}개로 가장 많다. 따라서 ${c.b}의 최빈값은 ${amt(mo, c.u)}이다.`,
          facts: { calc: [[String(mo), 0]], rule: 'mode' } });
      }
      const pts = data(d, X, Y, n, 1, null, 1.6), xs = pts.map((q) => q[0]).sort((a, b) => a - b), me = xs[(n - 1) / 2];
      return N(`${intro(c, n)} ${c.a}의 중앙값은?`, me, { unit: c.u, figure: scatter({ X, Y, pts, square: true }),
        explain: `가로축의 값을 작은 것부터 늘어놓으면 ${xs.join(', ')}이다. 점이 ${n}개이므로 중앙값은 ${(n + 1) / 2}번째 값인 ${amt(me, c.u)}이다.`,
        facts: { calc: [[String(me), 0]], rule: 'median' } });
    }, { count: 2 })
  ];

  // ═══ 상관관계의 종류 ═══
  const KINDS = ['양의 상관관계가 있다.', '음의 상관관계가 있다.', '상관관계가 없다.'];
  const kindAt = (k) => (k > 0 ? 0 : k < 0 ? 1 : 2);
  const kindWhy = (k) => (k > 0 ? '가로의 값이 커질 때 세로의 값도 대체로 커지므로(점들이 오른쪽 위로 향하는 직선 주위에 있다) 양의 상관관계가 있다.'
    : k < 0 ? '가로의 값이 커질 때 세로의 값은 대체로 작아지므로(점들이 오른쪽 아래로 향하는 직선 주위에 있다) 음의 상관관계가 있다.'
      : '가로의 값이 커질 때 세로의 값이 커지는지 작아지는지 분명하지 않으므로 상관관계가 없다.');
  const SHAPE_KIND = { pos: 1, neg: -1, round: 0, flat: 0, tall: 0 };
  const SHAPE_SAID = { pos: '오른쪽 위로 향하는 직선 주위에 몰려 있다(양의 상관관계)', neg: '오른쪽 아래로 향하는 직선 주위에 몰려 있다(음의 상관관계)', round: '둥글게 흩어져 있다(상관관계가 없다)', flat: 'x축에 평행한 직선 주위에 몰려 있다(상관관계가 없다)', tall: 'y축에 평행한 직선 주위에 몰려 있다(상관관계가 없다)' };
  const KIND = [
    T('kind-plot', '산점도를 보고 상관관계 말하기', '①23', (d) => {
      const k = d.pick([1, -1, 0]), { c, X, Y } = pairOf(d, PAIR.filter((p) => p.k === k)), n = d.int(15, 22);
      const pts = data(d, X, Y, n, k, (p) => (k ? Math.abs(corr(p)) >= 0.65 : true));
      return C(`${intro(c, n)} ${wa(c.a)} ${c.b} 사이에는 어떤 상관관계가 있는가?`, KINDS, kindAt(k), { figure: scatter({ X, Y, pts }), explain: kindWhy(k), facts: { truth: KINDS.map((_, i) => i === kindAt(k)), want: true } });
    }),
    T('kind-table', '표를 보고 상관관계 말하기', '①24', (d) => {
      // 표만 보고 가린다: 가로의 값이 큰 사람일수록 세로의 값이 대체로 큰지(작은지) 따진다. 점이 한 직선 가까이 있는 뚜렷한 자료만 낸다.
      const k = d.pick([1, -1]), { c, X, Y } = pairOf(d, PAIR.filter((p) => p.k === k)), n = d.pick([8, 10]);
      const pts = data(d, X, Y, n, k, (p) => Math.abs(corr(p)) >= 0.85 && new Set(p.map((q) => q[0])).size >= Math.min(n - 2, cells(X) - 1), 0.9);
      const sorted = pts.slice().sort((P, Q) => P[0] - Q[0]);
      return C(`다음 표는 ${c.group} ${n}${c.cnt}의 ${obj(c.about)} 조사하여 나타낸 것이다. ${wa(c.a)} ${c.b} 사이에는 어떤 상관관계가 있는가?`, KINDS, kindAt(k), {
        figure: pairTable(c, pts),
        explain: `${obj(c.a)} 작은 것부터 늘어놓으면 ${c.b}${k > 0 ? '도 대체로 커진다' : '는 대체로 작아진다'}(${sorted.map((q) => `${q[0]} → ${q[1]}`).join(', ')}). 산점도를 그리면 점들이 오른쪽 ${k > 0 ? '위' : '아래'}로 향하는 직선 주위에 놓이므로 ${k > 0 ? '양' : '음'}의 상관관계가 있다.`,
        facts: { truth: KINDS.map((_, i) => i === kindAt(k)), want: true } });
    }),
    T('kind-pick', '산점도 여럿에서 양·음·없음인 것 고르기', '①25', (d) => {
      const want = d.pick(['pos', 'neg', 'none']), noneKind = () => d.pick(['round', 'flat', 'tall']);
      const kinds = d.shuffle(want === 'none' ? [noneKind(), 'pos', 'neg', d.pick(['pos', 'neg'])] : [want, want === 'pos' ? 'neg' : 'pos', 'round', d.pick(['flat', 'tall'])]);
      const good = (s) => (want === 'none' ? SHAPE_KIND[s] === 0 : s === want), at = kinds.findIndex(good);
      const ask = want === 'pos' ? '양의 상관관계가 있는' : want === 'neg' ? '음의 상관관계가 있는' : '상관관계가 없는';
      return C(`다음 산점도 가운데 두 변량 ${X_}와 ${Y_} 사이에 ${ask} 것은?`, kinds.map((s, i) => figOpt(LAB[i], shapeFig(shapePts(d, s, 34), { w: 118 }))), at, {
        explain: kinds.map((s, i) => `${LAB[i]}: 점들이 ${SHAPE_SAID[s]}.`).join(' '),
        facts: { truth: kinds.map(good), want: true } });
    }),
    T('kind-axis', '점들이 축에 평행한 직선 주위에 몰린 산점도', '①26', (d) => {
      // 세 그림 모두 점들이 한 직선(점선) 주위에 몰려 있다. 그 직선이 축에 평행하면 상관관계가 없다.
      const kinds = d.shuffle([d.pick(['pos', 'neg']), d.pick(['pos', 'neg']), d.pick(['flat', 'tall'])]), names = ['㈎', '㈏', '㈐'];
      const has = kinds.map((s) => SHAPE_KIND[s] !== 0), right = names.filter((_, i) => has[i]).join(', ');
      const pool = ['㈎', '㈏', '㈐', '㈎, ㈏', '㈎, ㈐', '㈏, ㈐', '㈎, ㈏, ㈐'];
      const opts = [right, '㈎, ㈏, ㈐'].concat(d.shuffle(pool.filter((s) => s !== right && s !== '㈎, ㈏, ㈐')).slice(0, 3)).sort((p, q) => p.length - q.length || (p < q ? -1 : 1));
      return C(`다음 세 산점도에서 점들은 모두 한 직선(점선) 주위에 몰려 있다. 두 변량 ${X_}와 ${Y_} 사이에 상관관계가 있는 것을 모두 고른 것은?`, opts, opts.indexOf(right), {
        figure: figRow(kinds.map((s) => shapeFig(shapePts(d, s, 30), { w: 88, trend: s })), names),
        explain: kinds.map((s, i) => `${names[i]}: 점들이 ${SHAPE_SAID[s]}.`).join(' ') + ' 점들이 한 직선 주위에 몰려 있어도 그 직선이 x축이나 y축에 평행하면 상관관계가 없다.',
        facts: { truth: opts.map((s) => s === right), want: true } });
    }),
    T('kind-claims', '산점도와 상관관계의 뜻에 대한 설명', '①27', (d, k) => {
      // 차례 0: 옳은 것 고르기. 차례 1: 옳지 않은 것 고르기. 강한·약한 상관관계를 말하는 문장은 넣지 않는다(교육과정 밖).
      const Y1 = `산점도는 두 변량 ${X_}, ${Y_}의 순서쌍 ${nb(`(${X_}, ${Y_})를`)} 좌표평면 위에 점으로 나타낸 그래프이다.`;
      const Y2 = `${X_}의 값이 커짐에 따라 ${Y_}의 값도 대체로 커지는 관계가 있으면 두 변량 사이에 양의 상관관계가 있다.`;
      const Y3 = '음의 상관관계가 있는 자료의 산점도에서 점들은 대체로 오른쪽 아래로 향하는 한 직선 주위에 분포되어 있다.';
      const Y4 = '점들이 x축에 평행한 직선 주위에 몰려 있는 산점도는 상관관계가 없는 자료의 산점도이다.';
      const Y5 = '양의 상관관계가 있는 자료의 산점도에서 점들은 대체로 오른쪽 위로 향하는 한 직선 주위에 분포되어 있다.';
      const Y6 = '산점도를 그리면 두 변량 사이의 관계를 알아보기 편리하다.';
      const no = [
        ['산점도는 산포도를 그래프로 나타낸 것이다.', '산점도는 두 변량의 순서쌍을 점으로 나타낸 그래프이고, 산포도는 자료가 흩어진 정도를 나타내는 값이다.', Y1],
        ['점들이 한 직선 주위에 몰려 있는 산점도는 언제나 양의 상관관계를 나타낸다.', '오른쪽 아래로 향하는 직선 주위에 몰려 있으면 음의 상관관계이고, 축에 평행한 직선 주위에 몰려 있으면 상관관계가 없다.', ''],
        ['점들이 한 직선 주위에 몰려 있으면 두 변량 사이에 반드시 상관관계가 있다.', 'x축이나 y축에 평행한 직선 주위에 몰려 있으면 상관관계가 없다.', Y4],
        [`양의 상관관계가 있으면 ${Y_}의 값은 ${X_}의 값에 정비례한다.`, `양의 상관관계는 ${X_}의 값이 커질 때 ${Y_}의 값이 대체로 커지는 관계일 뿐 정비례 관계가 아니다.`, ''],
        [`음의 상관관계가 있으면 ${X_}의 값이 커질 때 ${Y_}의 값은 언제나 작아진다.`, `음의 상관관계는 ${Y_}의 값이 대체로 작아지는 관계이다. 언제나 작아지는 것은 아니다.`, ''],
        ['두 변량의 평균이 어떤 관계를 가지는지 산점도로 알 수 있다.', '산점도는 두 변량 사이의 관계를 나타낸 그림이다. 평균 사이의 관계를 나타내지 않는다.', ''],
        ['상관관계가 없는 자료의 산점도에서 점들은 언제나 둥글게 흩어져 있다.', 'x축이나 y축에 평행한 직선 주위에 몰려 있어도 상관관계가 없다.', Y4]
      ];
      return claimQ(d, `다음 중 산점도와 상관관계에 대한 설명으로 ${k === 0 ? '옳은' : '옳지 않은'} 것은?`, [Y1, Y2, Y3, Y4, Y5, Y6], no, k === 0);
    }, { count: 2 })
  ];

  // ═══ 상황과 상관관계 ═══
  // 수집본이 답으로 준 짝(과 같은 뜻의 짝)만 쓴다. k: 1 양, −1 음, 0 없음.
  const SITU = [
    ['여름철 기온', '아이스크림 판매량', 1], ['여름철 기온', '냉방비', 1], ['키', '몸무게', 1], ['통학 거리', '통학 시간', 1], ['저축액', '이자', 1], ['사람의 키', '앉은키', 1],
    ['보낸 문자 메시지의 수', '쓴 데이터의 양', 1], ['달걀의 무게', '노른자의 무게', 1], ['강수량', '우산 판매량', 1], ['운동 시간', '소모 열량', 1],
    ['산의 높이', '기온', -1], ['지면으로부터의 높이', '산소의 양', -1], ['겨울철 기온', '난방비', -1], ['물건의 가격', '판매량', -1], ['자동차가 달린 거리', '남은 기름의 양', -1],
    ['북반구 도시의 위도', '평균 기온', -1], ['석유 생산량', '석유 가격', -1],
    ['키', '수학 점수', 0], ['사람의 지능지수', '몸무게', 0], ['신발 크기', '신발 가격', 0], ['영화 상영 시간', '영화 요금', 0], ['머리카락의 길이', '수학 점수', 0]
  ].map(([x, y, k]) => ({ x, y, k, say: `${wa(x)} ${y}` }));
  const KNAME = (k) => (k > 0 ? '양의 상관관계' : k < 0 ? '음의 상관관계' : '상관관계가 없음');
  const sayKinds = (list) => list.map((s, i) => `${HAN[i]}. ${s.say}: ${KNAME(s.k)}`).join(', ');
  // 같은 낱말이 두 번 나오지 않게 고른다(키·키, 높이·높이 …).
  const pickSitu = (d, wants) => d.until(() => wants.map((k) => d.pick(SITU.filter((s) => s.k === k))), (l) => new Set(l.flatMap((s) => [s.x, s.y])).size === l.length * 2);
  const SITUS = [
    T('situ-kind', '두 변량 사이의 상관관계 가리기', '①29', (d, k) => {
      // 차례 0: 상관관계가 없는 것 하나 고르기. 차례 1: 양(음)의 상관관계가 있는 것을 모두 고른 것.
      if (k === 0) {
        const l = d.shuffle(pickSitu(d, [0].concat(d.shuffle([1, 1, -1, -1, d.pick([1, -1])]).slice(0, 4)))), at = l.findIndex((s) => s.k === 0);
        return C('다음 중 두 변량 사이에 상관관계가 없는 것은?', l.map((s) => s.say), at, { explain: l.map((s) => `${s.say}: ${KNAME(s.k)}`).join(', ') + '.', facts: { truth: l.map((s) => s.k === 0), want: true } });
      }
      const w = d.pick([1, -1]), l = d.shuffle(pickSitu(d, [w, w, -w, d.pick([-w, 0])]));
      return comboChoice(d, `다음 보기 가운데 두 변량 사이에 ${w > 0 ? '양' : '음'}의 상관관계가 있는 것을 모두 고른 것은?`, l.map((s) => s.k === w), { figure: bogi(l.map((s) => s.say)), explain: sayKinds(l) + '.' });
    }, { count: 2 }),
    T('situ-shape', '산점도 모양이 되는 상황 모두 고르기', '①30', (d) => {
      const w = d.pick([1, -1]), m = d.int(2, 3), l = d.shuffle(pickSitu(d, Array.from({ length: m }, () => w).concat(d.shuffle([-w, 0, -w]).slice(0, 4 - m))));
      return comboChoice(d, '다음 보기 가운데 두 변량 사이의 산점도가 대체로 그림과 같은 모양이 되는 것을 모두 고른 것은?', l.map((s) => s.k === w), {
        figure: shapeFig(shapePts(d, w > 0 ? 'pos' : 'neg', 40), { w: 132 }) + bogi(l.map((s) => s.say)),
        explain: `그림은 점들이 오른쪽 ${w > 0 ? '위' : '아래'}로 향하는 직선 주위에 있으므로 ${w > 0 ? '양' : '음'}의 상관관계를 나타낸다. ` + sayKinds(l) + '.' });
    }),
    T('situ-plot', '상황에 알맞은 산점도 고르기', '①31', (d) => {
      const s = d.pick(SITU.filter((q) => q.k !== 0)), kinds = d.shuffle(['pos', 'neg', 'round', d.pick(['flat', 'tall'])]), at = kinds.indexOf(s.k > 0 ? 'pos' : 'neg');
      return C(`${obj(s.x)} ${X_}, ${obj(s.y)} ${Y_}라고 할 때, 두 변량 ${X_}와 ${Y_} 사이의 상관관계를 나타낸 산점도로 알맞은 것은?`, kinds.map((q, i) => figOpt(LAB[i], shapeFig(shapePts(d, q, 34), { w: 118 }))), at, {
        explain: `${subj(s.x)} 커질수록 ${subj(s.y)} 대체로 ${s.k > 0 ? '커지므로 양' : '작아지므로 음'}의 상관관계가 있다. 점들이 오른쪽 ${s.k > 0 ? '위' : '아래'}로 향하는 직선 주위에 있는 ${LAB[at]}이다.`,
        facts: { truth: kinds.map((_, i) => i === at), want: true } });
    }),
    T('situ-same', '상관관계가 같은 두 상황 짝짓기', '①32', (d) => {
      // 넷 가운데 상관관계가 같은 짝은 하나뿐이다(같은 것 둘, 나머지 두 종류가 하나씩).
      const w = d.pick([1, -1, 0]), others = [1, -1, 0].filter((v) => v !== w), l = d.shuffle(pickSitu(d, [w, w].concat(others)));
      const pairs = []; for (let i = 0; i < 4; i += 1) for (let j = i + 1; j < 4; j += 1) pairs.push([i, j]);
      const right = pairs.find(([i, j]) => l[i].k === l[j].k), shown = [right].concat(d.shuffle(pairs.filter((p) => p !== right)).slice(0, 4)).sort((p, q) => p[0] - q[0] || p[1] - q[1]);
      return C('다음 보기 가운데 두 변량 사이의 상관관계가 서로 같은 것끼리 짝 지은 것은?', shown.map(([i, j]) => `${HAN[i]}과 ${HAN[j]}`), shown.indexOf(right), {
        figure: bogi(l.map((s) => s.say)), explain: sayKinds(l) + `. 상관관계가 같은 것은 ${HAN[right[0]]}과 ${HAN[right[1]]}이다.`,
        facts: { truth: shown.map((p) => p === right), want: true } });
    })
  ];

  // ═══ 상관관계로 산점도 해석하기 ═══
  const READ = [
    T('read-top', 'A~E 가운데 한 변량이 가장 큰 사람', '①18', (d) => {
      const c = d.pick(RELS), n = d.int(16, 22), set = relSet(d, ['top', 'up', 'down', 'on', 'on'], n - 2), { marks, figure } = relFig(d, c, set);
      const at = marks.findIndex((m) => m.role === 'top'), up = marks.find((m) => m.role === 'up');
      return C(`${relIntro(c, n)} ${c.who} ${nameList(marks)} 가운데 ${c.top} ${topic(c.who)}?`, marks.map((m) => m.name), at, { figure,
        explain: `세로축의 값이 가장 큰 점은 ${marks[at].name}이다. ${up.name}는 점들의 경향을 나타내는 직선보다 크게 위에 있어 ${c.a}에 비하여 ${subj(c.b)} ${c.more} ${c.who}이지만, 세로축의 값은 ${marks[at].name}보다 작다.`,
        facts: { choose: { exprs: marks.map((m) => String(m.y)), rule: 'max' } } });
    }),
    T('read-relative', 'A~E 가운데 x에 비하여 y가 크거나 작은 사람', '①33', (d, k) => {
      // 차례 0: 가로 변량에 비하여 세로 변량이 가장 큰(작은) 사람 — 경향선의 위쪽(아래쪽)으로 가장 먼 점. 세로 값이 가장 큰 점은 경향선 가까이에 둔다.
      // 차례 1: 키·몸무게에서 가로 변량을 세로 변량에 비하여 묻는다 — 「몸무게에 비하여 키가 가장 큰」(가로가 키)은 경향선의 아래쪽(오른쪽)으로 가장 먼 점이다.
      const n = d.int(16, 22);
      if (k === 0) {
        const c = d.pick(RELS), hi = d.bool(), set = relSet(d, ['up', 'down', 'top', 'on', 'on'], n - 2), { marks, figure } = relFig(d, c, set), at = marks.findIndex((m) => m.role === (hi ? 'up' : 'down'));
        const top = marks.find((m) => m.role === 'top');
        return C(`${relIntro(c, n)} ${c.who} ${nameList(marks)} 가운데 ${c.a}에 비하여 ${subj(c.b)} ${hi ? c.most : c.least} ${topic(c.who)}?`, marks.map((m) => m.name), at, { figure,
          explain: `점들은 대체로 오른쪽 위로 향하는 한 직선 주위에 있다. 그 직선보다 ${hi ? '위쪽' : '아래쪽'}에 있는 점일수록 ${c.a}에 비하여 ${subj(c.b)} ${hi ? c.more : c.less} ${c.who}이고, 가장 멀리 떨어진 점은 ${marks[at].name}이다.${hi ? ` ${top.name}는 세로축의 값이 가장 크지만 그 직선 가까이에 있다.` : ''}`,
          facts: { truth: marks.map((_, i) => i === at), want: true } });
      }
      const flip = d.bool(), hi = d.bool(), set = relSet(d, ['up', 'down', 'right', 'on', 'on'], n - 2);
      const xa = flip ? '몸무게' : '키', ya = flip ? '키' : '몸무게';
      const c = Object.assign({}, RELS[4], flip ? { about: '몸무게와 키' } : {});
      const { marks, figure } = relFig(d, c, set, flip ? ['몸무게', 'kg', '키', 'cm'] : ['키', 'cm', '몸무게', 'kg']);
      // 가로 변량이 세로 변량에 비하여 크다 = 경향선의 오른쪽(아래쪽)
      const role = hi ? 'down' : 'up', at = marks.findIndex((m) => m.role === role);
      const xWord = flip ? (hi ? '가장 많이 나가는' : '가장 적게 나가는') : (hi ? '가장 큰' : '가장 작은');
      return C(`${relIntro(c, n)} 학생 ${nameList(marks)} 가운데 ${ya}에 비하여 ${subj(xa)} ${xWord} ${topic('학생')}?`, marks.map((m) => m.name), at, { figure,
        explain: `가로축이 ${xa}, 세로축이 ${ya}이다. 점들은 대체로 오른쪽 위로 향하는 한 직선 주위에 있고, ${ya}에 비하여 ${subj(xa)} ${hi ? (flip ? '많이 나가는' : '큰') : (flip ? '적게 나가는' : '작은')} 학생은 그 직선보다 ${hi ? '오른쪽(아래쪽)' : '왼쪽(위쪽)'}에 있다. 가장 멀리 떨어진 점은 ${marks[at].name}이다.`,
        facts: { truth: marks.map((_, i) => i === at), want: true } });
    }, { count: 2 }),
    T('read-corner', 'A~D 가운데 대각선의 한쪽이거나 두 변량이 모두 크거나 작은 사람', '①34', (d, k) => {
      // 차례 0: 세로 값이 가로 값보다 큰 사람(넷 가운데 하나만 대각선 위쪽, 하나는 대각선 위). 차례 1: 두 값이 모두 큰(작은) 편인 사람(넷이 네 모퉁이에 있다).
      const { c, X, Y } = same(d), n = d.int(14, 18), names = ['A', 'B', 'C', 'D'], nx = cells(X);
      let marks;
      if (k === 0) {
        const pts = data(d, X, Y, n, 1, (p) => {
          const up = p.filter(([x, y]) => y > x), on = p.filter(([x, y]) => x === y), dn = p.filter(([x, y]) => y < x);
          if (!up.length || !on.length || dn.length < 2) return false;
          marks = d.shuffle([d.pick(up), d.pick(on)].concat(d.shuffle(dn).slice(0, 2))); return true;
        }, 1.7);
        const at = marks.findIndex(([x, y]) => y > x);
        return C(`${intro(c, n)} ${c.who} A, B, C, D 가운데 ${subj(c.b)} ${c.a}보다 ${c.high} ${topic(c.who)}?`, names, at, {
          figure: scatter({ X, Y, pts, square: true, marks: marks.map(([x, y], i) => ({ x, y, name: names[i] })) }),
          explain: `${subj(c.b)} ${c.a}보다 큰 점은 두 값이 같은 점을 이은 대각선보다 위쪽에 있다. ${marks.map(([x, y], i) => `${names[i]}${ptx([x, y])}`).join(', ')} 가운데 그런 점은 ${names[at]}이다.`,
          facts: { truth: marks.map(([x, y]) => y > x), want: true } });
      }
      const hi = d.bool(), lo = Math.floor(nx * 0.25), up = Math.ceil(nx * 0.75);
      // 경향을 따르는 점들 가운데 오른쪽 위·왼쪽 아래 끝의 점을 고르고, 왼쪽 위·오른쪽 아래 모퉁이에는 경향에서 벗어난 점을 하나씩 더 놓는다.
      const z = X.lo === 0 ? 1 : 0, at0 = (i, j) => [X.lo + i * X.step, Y.lo + j * Y.step];
      const pts = d.until(() => {
        const base = gridSet(d, X, Y, n - 2, 1, 1.5), I = (v, S) => idx(S, v), used = new Set(base.map((q) => q.join(',')));
        const tr = base.filter(([x, y]) => I(x, X) >= up && I(y, Y) >= up), bl = base.filter(([x, y]) => I(x, X) <= lo && I(y, Y) <= lo);
        const tl = at0(d.int(z, lo), d.int(up, nx)), br = at0(d.int(up, nx), d.int(z, lo));
        if (base.length < n - 2 || !tr.length || !bl.length || used.has(tl.join(',')) || used.has(br.join(','))) return null;
        marks = d.shuffle([['tr', d.pick(tr)], ['bl', d.pick(bl)], ['tl', tl], ['br', br]]);
        return base.concat([tl, br]);
      }, (p) => Boolean(p) && corr(p) >= 0.4);
      const want = hi ? 'tr' : 'bl', at = marks.findIndex((m) => m[0] === want), SIDE = { tr: '오른쪽 위', bl: '왼쪽 아래', tl: '왼쪽 위', br: '오른쪽 아래' };
      return C(`${intro(c, n)} ${c.who} A, B, C, D 가운데 ${wa(c.a)} ${subj(c.b)} 모두 ${hi ? c.high : (c.high === '많은' ? '적은' : '낮은')} 편인 ${topic(c.who)}?`, names, at, {
        figure: scatter({ X, Y, pts, square: true, marks: marks.map(([, [x, y]], i) => ({ x, y, name: names[i] })) }),
        explain: `두 값이 모두 ${hi ? '큰' : '작은'} 편인 점은 산점도의 ${SIDE[want]}에 있다. ${marks.map(([s], i) => `${names[i]}는 ${SIDE[s]}`).join(', ')}에 있으므로 답은 ${names[at]}이다.`,
        facts: { truth: marks.map((m) => m[0] === want), want: true } });
    }, { count: 2 }),
    T('read-claims', '산점도에 대한 설명 가운데 옳은 것', '①36', (d) => {
      // 다섯 문장 가운데 옳은 것은 하나: 경향(「대체로」), 「~ 이상인 사람은 모두 ~ 이상이다」, 「~ 미만인 사람은 모두 ~ 이하이다」 가운데 하나만 옳게 쓰고 나머지는 틀리게 쓴다.
      const { c, X, Y } = pairOf(d, PAIR.filter((p) => p.k === 1)), n = d.int(13, 18), which = d.int(0, 2);
      let q0, p0, s0;
      const pts = data(d, X, Y, n, 1, (p) => {
        q0 = inner(d, Y); s0 = inner(d, X);
        const hiY = p.filter(([, y]) => y >= q0), loX = p.filter(([x]) => x < s0);
        if (hiY.length < 3 || loX.length < 3) return false;
        p0 = Math.min(...hiY.map((q) => q[0]));
        return p0 > X.lo && p0 < X.hi && cnt(hiY, (x) => x === p0) === 1 && Math.max(...loX.map((q) => q[1])) < Y.hi;
      });
      const loX = pts.filter(([x]) => x < s0), m = Math.max(...loX.map((q) => q[1]));
      const S = [
        which === 0 ? [`${subj(c.a)} ${c.aw} 대체로 ${c.b}도 ${c.bw}.`, true, ''] : [`${subj(c.a)} ${c.aw} ${c.b}도 반드시 ${c.bw}.`, false, `${subj(c.a)} 더 큰데 ${subj(c.b)} 더 작은 점도 있다. 「대체로」 그렇다.`],
        [`${topic(c.b)} ${c.a}에 정비례한다.`, false, '점들이 한 직선 위에 놓여 있지 않다. 정비례 관계가 아니다.'],
        [`${wa(c.a)} ${c.b} 사이에는 음의 상관관계가 있다.`, false, '점들이 오른쪽 위로 향하는 직선 주위에 있으므로 양의 상관관계가 있다.'],
        which === 1 ? [`${cond(c, 1, 'ge', q0)}인 ${topic(c.who)} 모두 ${cond(c, 0, 'ge', p0)}이다.`, true, '']
          : [`${cond(c, 1, 'ge', q0)}인 ${topic(c.who)} 모두 ${cond(c, 0, 'ge', p0 + X.step)}이다.`, false, `${cond(c, 1, 'ge', q0)}인 점 가운데 ${subj(c.a)} ${amt(p0, c.au)}인 점이 있다.`],
        which === 2 ? [`${cond(c, 0, 'lt', s0)}인 ${c.who}의 ${topic(c.b)} 모두 ${amt(m, c.bu)} 이하이다.`, true, '']
          : [`${cond(c, 0, 'lt', s0)}인 ${c.who}의 ${topic(c.b)} 모두 ${amt(m, c.bu)} 미만이다.`, false, `${cond(c, 0, 'lt', s0)}인 점 가운데 ${subj(c.b)} ${amt(m, c.bu)}인 점이 있다.`]
      ];
      const rows = d.shuffle(S), at = rows.findIndex((r) => r[1]);
      return C(`${intro(c, n)} 이 산점도에 대한 설명으로 옳은 것은?`, rows.map((r) => r[0]), at, { figure: scatter({ X, Y, pts }),
        explain: rows.filter((r) => !r[1]).map((r) => r[2]).join(' '), facts: { truth: rows.map((r) => r[1]), want: true } });
    }),
    T('read-count-claims', '산점도를 읽은 문장의 참·거짓', '①37', (d) => {
      // 다섯 문장 가운데 하나만 수를 틀리게 적는다(옳지 않은 것 고르기).
      const { c, X, Y } = sameOf(d, SAME.filter((s) => s.sc.some((v) => v[2] === 1))), n = d.pick([15, 16, 18, 20]);
      let v, w, t, s;
      const pts = data(d, X, Y, n, 1, (p) => {
        v = inner(d, X); w = inner(d, Y); t = inner(d, X); s = inner(d, X);
        const both = cnt(p, (x, y) => x <= s && y <= s);
        return cnt(p, (x) => x === v) >= 2 && cnt(p, (x, y) => y === w) >= 2 && cnt(p, (x, y) => x === y) >= 2 && cnt(p, (x, y) => x >= t && y >= t) >= 2 && both >= 2 && both < n && t > s;
      }, 1.7);
      const k1 = cnt(pts, (x) => x === v), k2 = cnt(pts, (x, y) => y === w), k3 = cnt(pts, (x, y) => x === y), k4 = cnt(pts, (x, y) => x >= t && y >= t), k5 = cnt(pts, (x, y) => x <= s && y <= s);
      const g = (a, b) => (b ? g(b, a % b) : a), rf = (a, b) => frac(a / g(a, b), b / g(a, b));
      const bad = d.int(0, 4), off = d.pick([-1, 1]), shift = (kk, i) => (i === bad ? (kk + off >= 1 ? kk + off : kk + 1) : kk);
      const unit = c.u, who = c.who;
      const fiveFrac = bad === 4 ? (() => { let a = k5 + off; if (a < 1 || a >= n || g(a, n) === g(k5, n) && a / g(a, n) === k5 / g(k5, n)) a = k5 + 1; return [a, n]; })() : [k5, n];
      const rows = [
        [`${subj(c.a)} ${amt(v, unit)}인 ${topic(who)} ${shift(k1, 0)}${c.cnt}이다.`, bad !== 0, `${subj(c.a)} ${amt(v, unit)}인 ${topic(who)} ${k1}${c.cnt}이다.`],
        [`${subj(c.b)} ${amt(w, unit)}인 ${topic(who)} ${shift(k2, 1)}${c.cnt}이다.`, bad !== 1, `${subj(c.b)} ${amt(w, unit)}인 ${topic(who)} ${k2}${c.cnt}이다.`],
        [`${wa(c.a)} ${subj(c.b)} 같은 ${topic(who)} ${shift(k3, 2)}${c.cnt}이다.`, bad !== 2, `두 값이 같은 ${topic(who)} ${k3}${c.cnt}이다.`],
        [`${wa(c.a)} ${subj(c.b)} 모두 ${amt(t, unit)} 이상인 ${topic(who)} ${shift(k4, 3)}${c.cnt}이다.`, bad !== 3, `두 값이 모두 ${amt(t, unit)} 이상인 ${topic(who)} ${k4}${c.cnt}이다.`],
        [`${wa(c.a)} ${subj(c.b)} 모두 ${amt(s, unit)} 이하인 ${who}의 비율은 ${rf(fiveFrac[0], fiveFrac[1])}이다.`, bad !== 4, `두 값이 모두 ${amt(s, unit)} 이하인 ${topic(who)} ${k5}${c.cnt}이므로 비율은 ${rf(k5, n)}이다.`]
      ];
      return C(`${intro(c, n)} 다음 중 옳지 않은 것은?`, rows.map((r) => r[0]), bad, { figure: scatter({ X, Y, pts, square: true }),
        explain: rows[bad][2], facts: { truth: rows.map((r) => r[1]), want: false } });
    })
  ];

  B.addTypes('9-2-6', 'mean', MEAN);
  B.addTypes('9-2-6', 'kind', KIND);
  B.addTypes('9-2-6', 'situ', SITUS);
  B.addTypes('9-2-6', 'read', READ);
  Object.assign(B.kit.m926, { RELS, relSet, relFig, relIntro, nameList, KINDS, kindAt, kindWhy, SITU, KNAME, pickSitu, fitX });
})(typeof window !== 'undefined' ? window : globalThis);
