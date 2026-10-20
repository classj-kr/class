// 중학교 3학년 2학기 6단원 산점도와 상관관계 — 실력 문항.
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 9-2-6a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 「~보다 높은(~에 비해 높은)」에 두 값이 같은 사람(대각선 위의 점)까지 넣는다. 거꾸로 「낮거나 같은」에서는 대각선 위의 점을 빼먹는다.
//  - 「두 점수의 평균이 c 이상」을 「두 점수가 모두 c 이상」으로 읽는다. 합이 2c 인 직선 위의 점(경계)을 빼먹는다.
//  - 「x + y > c」처럼 >로 준 조건에서 경계(합이 c 인 점)를 넣는다.
//  - 「두 점수의 차가 c 이상」에서 대각선의 한쪽만 센다. 「차가 c 이하」에서 띠의 한쪽 경계만 넣는다.
//  - 「60점 미만이던 성적이 60점 이상이 된」을 한 조건(나중 점수가 60점 이상)으로만 본다.
//  - 「차가 가장 큰」 점을 그림 틀의 모서리를 잇는 선에서 가장 먼 점으로 고른다(가로·세로 눈금이 다른 수에서 시작하면 그 선은 두 값이 같은 점을 이은 선이 아니다).
//  - 기록이 작을수록 잘하는 변량(달리기 기록)을 「위쪽에 있으면 잘한다」로 읽는다. 「~에 비하여 많다」를 「가장 많다」로 읽는다.
//
// 실력에는 ① 문제의 그림·상황에 함정이 있어 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제만 실었다.
//  ①: hard-above-mean(대각선 위의 점), hard-not-higher, hard-max-diff, hard-crossed, hard-mean-atleast, hard-sum-strict, hard-diff-within, hard-diff-beyond, hard-ae-claims, hard-small-better
//  ②: hard-gain-mean, hard-gain-c-mean, hard-top-percent, hard-cond-var
// 심화 자료에서 기본에 둔 것: 두 변량의 합이 c 이상인 점의 수(심7 — 두 단계, compare 묶음의 cmp-sum-atleast).
// 기본 자료에서 실력으로 올린 것: 기록이 작을수록 좋은 변량(①35 — 그림의 함정), 조건에 맞는 사람들의 분산(①22 — 네 단계, 앞 중단원 9-2-5의 분산을 쓴다).
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, N, C, D } = B.kit;
  const { range, tail, V, nb } = B.kit.mid;
  const K = B.kit.m926;
  const { STD, sourceOf, sum, cnt, ones, gcd, corr, subj, topic, obj, wa, amt, ptx, ptj, list, howMany, SAME, scaleOf, cells, idx, sameOf, intro, gridSet, data, scatter,
    HAN, bogi, comboChoice, inner, cond, sumEnds, RELS, relSet, relFig, relIntro, nameList, SITU } = K;
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : sourceOf(ref), make }, more || {});
  const X_ = V('x'), Y_ = V('y');
  const low = (c) => (c.high === '높은' ? '낮' : '적');   // 「낮거나 같은」「적거나 같은」
  const step1 = SAME.filter((s) => s.sc.some((v) => v[2] === 1));
  const ys = (pts) => pts.map((p) => p[1]);
  // 앞뒤가 있는 두 점수: 「1학기에 60점 미만이던 성적이 2학기에 60점 이상이 된」의 말
  const WHEN = { '1학기 성적': ['1학기에', '2학기에', '성적'], '중간고사 점수': ['중간고사에서', '기말고사에서', '점수'], '1차 점수': ['1차에', '2차에', '점수'] };

  B.addGroup('9-2-6', {
    id: 'hard', title: '단원 종합', standard: STD,
    types: [
      // ── ① 그림·상황에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-above-mean', '한 변량이 다른 변량보다 높은 사람들의 평균', '심1', (d) => {
        // 함정: 두 값이 같은 점(대각선 위)을 「높은」에 넣는 아이. 넣으면 평균이 달라지게 수를 고른다.
        const { c, X, Y } = sameOf(d, step1), n = d.int(11, 16);
        const pts = data(d, X, Y, n, 1, (p) => {
          const up = p.filter(([x, y]) => y > x), ge = p.filter(([x, y]) => y >= x);
          return up.length >= 3 && up.length <= 6 && ge.length - up.length >= 2 && sum(ys(up)) % up.length === 0 && sum(ys(ge)) * up.length !== sum(ys(up)) * ge.length;
        }, 1.7);
        const up = pts.filter(([x, y]) => y > x), m = sum(ys(up)) / up.length;
        return N(`${intro(c, n)} ${subj(c.b)} ${c.a}에 비해 ${c.high} ${c.who}들의 ${c.b}의 평균은?`, m, { unit: c.u, figure: scatter({ X, Y, pts, square: true }),
          explain: `${subj(c.b)} ${c.a}에 비해 ${c.high} 점은 두 값이 같은 점을 이은 대각선보다 위쪽에 있는 점이다(대각선 위의 점은 넣지 않는다). ${list(up)}의 ${up.length}개이므로 평균은 (${ys(up).join(' + ')}) ÷ ${up.length} = ${m}이다.`,
          facts: { calc: [[`(${ys(up).join('+')})/(${ones(up.length)})`, 0]], unseen: [1] } });
      }),
      H('hard-not-higher', '「낮거나 같은」 점의 수', '심2', (d) => {
        // 함정: 대각선 위의 점(같은 사람)을 빼먹거나, 대각선의 반대쪽을 세는 아이.
        const { c, X, Y } = sameOf(d), n = d.int(20, 28);
        const pts = data(d, X, Y, n, 1, (p) => { const on = cnt(p, (x, y) => x === y), lo = cnt(p, (x, y) => y < x), hi = cnt(p, (x, y) => y > x); return on >= 4 && lo >= 4 && hi >= 4 && lo + on !== hi; }, 1.7);
        const hit = pts.filter(([x, y]) => y <= x), on = cnt(pts, (x, y) => x === y);
        return N(`${intro(c, n)} ${subj(c.b)} ${c.a}보다 ${low(c)}거나 같은 ${howMany(c)}`, hit.length, { unit: c.cnt, figure: scatter({ X, Y, pts, square: true }),
          explain: `두 값이 같은 점을 이은 대각선 위의 점(${on}개)과 그보다 아래쪽에 있는 점(${hit.length - on}개)을 모두 센다. ${hit.length - on} + ${on} = ${hit.length}이다.`,
          facts: { calc: [[`(${ones(hit.length - on)})+(${ones(on)})`, 0]], unseen: [1] } });
      }),
      H('hard-max-diff', '두 변량의 차가 가장 큰 사람의 차', '심3', (d) => {
        // 원문(발전 04)대로 두 축의 눈금은 같다: 두 값이 같은 점을 이은 대각선에서 가장 먼 점이 답이다(대각선에 나란한 선으로 견준다).
        // (받는 쪽에서 고침: 짓는 쪽이 덧붙였던 「세로축을 한 눈금 어긋나게 시작하는 함정」은 원문에 없어 뺐다.)
        const { c } = sameOf(d, SAME.filter((s) => s.sc.some((v) => v[2] === 10))), sc = d.pick(c.sc.filter((v) => v[2] === 10)), st = sc[2];
        const dy = 0;
        const X = scaleOf(sc, `${c.a}(${c.u})`), Y = scaleOf([sc[0] + dy, sc[1], st], `${c.b}(${c.u})`), n = d.int(14, 20);
        // 그림 틀의 모서리 (X.lo, Y.lo)·(X.hi, Y.hi) 를 잇는 선에서 칸 단위로 잰 거리
        const nx = cells(X), ny = cells(Y), boxDist = ([x, y]) => Math.abs(idx(X, x) * ny - idx(Y, y) * nx) / Math.hypot(nx, ny);
        const diff = ([x, y]) => Math.abs(x - y);
        const pts = data(d, X, Y, n, 1, (p) => {
          const ds = p.map(diff), top = Math.max(...ds), far = p.reduce((s, q) => (boxDist(q) > boxDist(s) ? q : s));
          return ds.filter((v) => v === top).length === 1 && ds.filter((v) => v >= top - st).length >= 2 && diff(far) === top;
        }, 1.8);
        const P = pts.find((q) => diff(q) === Math.max(...pts.map(diff))), lo = Math.min(...P), hi = Math.max(...P);
        return N(`${intro(c, n)} ${wa(c.a)} ${c.b}의 차가 가장 큰 ${c.who}의 두 점수의 차는?`, hi - lo, { unit: c.u, figure: scatter({ X, Y, pts, square: true }),
          explain: `가로축은 ${X.lo}부터, 세로축은 ${Y.lo}부터 시작하므로 그림 틀의 모서리를 잇는 선은 두 값이 같은 점을 이은 선이 아니다. 두 값이 같은 점을 이은 직선은 ${ptj([Math.max(X.lo, Y.lo), Math.max(X.lo, Y.lo)], '과/와')} ${ptj([X.hi, X.hi], '을/를')} 지난다. 이 직선에서 가장 멀리 떨어진 점은 ${ptx(P)}이고 두 점수의 차는 ${hi} − ${lo} = ${hi - lo}이다.`,
          facts: { calc: [[`${hi}-${lo}`, 0]] } });
      }),
      H('hard-crossed', '「미만이던 것이 이상이 된」 점의 수', '심5', (d) => {
        // 함정: 나중 점수만 보는 아이(가로 < t 를 빠뜨림), 경계(가로 = t, 세로 = t)를 거꾸로 넣고 빼는 아이.
        const { c, X, Y } = sameOf(d, SAME.filter((s) => WHEN[s.a])), [pre, post, noun] = WHEN[c.a], n = d.int(16, 24);
        let t;
        const pts = data(d, X, Y, n, 1, (p) => {
          t = inner(d, X); const hit = cnt(p, (x, y) => x < t && y >= t);
          return hit >= 2 && hit <= 6 && cnt(p, (x, y) => x === t && y >= t) >= 1 && cnt(p, (x, y) => x < t && y === t) >= 1 && cnt(p, (x, y) => y >= t) >= hit + 3;
        }, 1.9);
        const hit = pts.filter(([x, y]) => x < t && y >= t);
        return N(`${intro(c, n)} ${pre} ${amt(t, c.u)} 미만이던 ${subj(noun)} ${post} ${amt(t, c.u)} 이상이 된 ${howMany(c)}`, hit.length, { unit: c.cnt, figure: scatter({ X, Y, pts, square: true }),
          explain: `가로의 값이 ${t} 미만(${t}인 눈금선 위의 점은 빼고)이고 세로의 값이 ${t} 이상(${t}인 눈금선 위의 점은 넣고)인 점을 센다. ${list(hit)}의 ${hit.length}개이다.`,
          facts: { calc: [[ones(hit.length), 0]], unseen: [1] } });
      }),
      H('hard-mean-atleast', '두 변량의 평균이 c 이상인 점의 수와 백분율', '심6', (d, k) => {
        // 함정: 「두 점수가 모두 c 이상」으로 읽는 아이, 합이 2c 인 직선 위의 점을 빼먹는 아이. 차례 0: 점의 수. 차례 1: 전체의 몇 %.
        const { c, X, Y } = sameOf(d), n = k === 0 ? d.int(16, 24) : d.pick([20, 25]);
        let m;
        const pts = data(d, X, Y, n, 1, (p) => {
          m = inner(d, X); const hit = cnt(p, (x, y) => x + y >= 2 * m);
          return hit >= 4 && hit <= n - 4 && cnt(p, (x, y) => x + y === 2 * m) >= 2 && cnt(p, (x, y) => x >= m && y >= m) !== hit && (k === 0 || (hit * 100) % n === 0);
        }, 1.8);
        const hit = pts.filter(([x, y]) => x + y >= 2 * m), on = cnt(pts, (x, y) => x + y === 2 * m), e = sumEnds(X, 2 * m);
        const why = `두 점수의 평균이 ${m} 이상이면 두 점수의 합이 ${2 * m} 이상이다. 합이 ${2 * m}인 점은 ${ptj(e[0], '과/와')} ${ptj(e[1], '을/를')} 잇는 직선 위에 있으므로, 그 직선 위의 점(${on}개)과 그보다 오른쪽 위에 있는 점을 센다. ${list(hit)}의 ${hit.length}개이다.`;
        if (k === 0) return N(`${intro(c, n)} ${wa(c.a)} ${c.b}의 평균이 ${amt(m, c.u)} 이상인 ${howMany(c)}`, hit.length, { unit: c.cnt, figure: scatter({ X, Y, pts, square: true }), explain: why, facts: { calc: [[ones(hit.length), 0]], unseen: [1] } });
        return N(`${intro(c, n)} ${wa(c.a)} ${c.b}의 평균이 ${amt(m, c.u)} 이상인 ${topic(c.who)} 전체의 몇 %인가?`, hit.length * 100 / n, { unit: ' %', figure: scatter({ X, Y, pts, square: true }),
          explain: why + ` ${hit.length} ÷ ${n} × 100 = ${hit.length * 100 / n}(%)이다.`, facts: { calc: [[`(${ones(hit.length)})*100/${n}`, 0]], unseen: [1, 100] } });
      }, { count: 2 }),
      H('hard-sum-strict', '부등식으로 준 합의 조건(경계 제외)', '심8', (d) => {
        // 함정: >를 ≥로 읽어 합이 s 인 점(경계)까지 넣는 아이.
        const { c, X, Y } = sameOf(d, step1), n = d.int(18, 26);
        let s;
        const pts = data(d, X, Y, n, 1, (p) => { s = d.int(Math.round(X.hi * 0.8), Math.round(X.hi * 1.3)); const hit = cnt(p, (x, y) => x + y > s); return hit >= 3 && hit <= n - 4 && cnt(p, (x, y) => x + y === s) >= 3; }, 1.7);
        const hit = pts.filter(([x, y]) => x + y > s), e = sumEnds(X, s);
        const say = (v) => `${v}${c.u}${c.u === '점' ? '이라고' : '라고'}`;
        return N(`${intro(c, n)} ${obj(c.a)} ${X_}${c.u}, ${obj(c.b)} ${say(Y_)} 할 때, ${nb(`${X_} + ${Y_} &gt; ${s}${tail(s, '을/를')}`)} 만족시키는 ${howMany(c)}`, hit.length, { unit: c.cnt, figure: scatter({ X, Y, pts, square: true }),
          explain: `합이 ${s}인 점은 ${ptj(e[0], '과/와')} ${ptj(e[1], '을/를')} 잇는 직선 위에 있다. 합이 ${s}보다 커야 하므로 그 직선 위의 점은 빼고, 그보다 오른쪽 위에 있는 점만 센다. ${list(hit)}의 ${hit.length}개이다.`,
          facts: { calc: [[ones(hit.length), 0]], unseen: [1] } });
      }),
      H('hard-diff-within', '두 변량의 차가 c 이하인 점의 수', '심9', (d) => {
        // 함정: 띠의 한쪽 경계만 넣는 아이, 대각선의 한쪽만 보는 아이.
        const { c, X, Y } = sameOf(d), n = d.int(16, 24), w = X.step * d.int(1, 2);
        const pts = data(d, X, Y, n, 1, (p) => {
          const hit = cnt(p, (x, y) => Math.abs(x - y) <= w);
          return hit >= 5 && hit <= n - 3 && cnt(p, (x, y) => y - x === w) >= 1 && cnt(p, (x, y) => x - y === w) >= 1 && cnt(p, (x, y) => Math.abs(x - y) > w) >= 3;
        }, 1.9);
        const hit = pts.filter(([x, y]) => Math.abs(x - y) <= w);
        return N(`${intro(c, n)} ${wa(c.a)} ${c.b}의 차가 ${amt(w, c.u)} 이하인 ${howMany(c)}`, hit.length, { unit: c.cnt, figure: scatter({ X, Y, pts, square: true }),
          explain: `두 값의 차가 ${w} 이하인 점은 대각선을 위로 ${w}만큼, 아래로 ${w}만큼 옮긴 두 직선 사이(두 직선 위의 점까지)에 있다. ${list(hit)}의 ${hit.length}개이다.`,
          facts: { calc: [[ones(hit.length), 0]], unseen: [1] } });
      }),
      H('hard-diff-beyond', '두 변량의 차가 c 이상인 점의 수', '심10', (d) => {
        // 함정: 대각선의 위쪽(또는 아래쪽)만 세는 아이.
        const { c, X, Y } = sameOf(d), n = d.int(16, 24), w = X.step * d.int(2, 3);
        const pts = data(d, X, Y, n, 1, (p) => {
          const a = cnt(p, (x, y) => y - x >= w), b = cnt(p, (x, y) => x - y >= w);
          return a >= 2 && b >= 2 && a + b <= n - 5 && cnt(p, (x, y) => Math.abs(x - y) === w) >= 1;
        }, 2.2);
        const up = pts.filter(([x, y]) => y - x >= w), dn = pts.filter(([x, y]) => x - y >= w);
        return N(`${intro(c, n)} ${wa(c.a)} ${c.b}의 차가 ${amt(w, c.u)} 이상인 ${howMany(c)}`, up.length + dn.length, { unit: c.cnt, figure: scatter({ X, Y, pts, square: true }),
          explain: `${subj(c.b)} ${w} 이상 큰 점(대각선을 위로 ${w}만큼 옮긴 직선과 그 위쪽)은 ${up.length}개, ${subj(c.a)} ${w} 이상 큰 점(아래로 옮긴 직선과 그 아래쪽)은 ${dn.length}개이다. 두 쪽을 모두 세어 ${up.length} + ${dn.length} = ${up.length + dn.length}이다.`,
          facts: { calc: [[`(${ones(up.length)})+(${ones(dn.length)})`, 0]], unseen: [1] } });
      }),
      H('hard-ae-claims', 'A~E가 표시된 산점도에 대한 보기 옳은 것 모두', '심13', (d) => {
        // 경향(양·음), 다른 상황과 같은 상관관계인가, 「~에 비하여」(경향선의 위·아래), 「가장 많은」(가장 위)을 한 그림에서 가린다.
        const c = d.pick(RELS), n = d.int(16, 22), set = relSet(d, ['up', 'down', 'top', 'on', 'on'], n - 2), { marks, figure } = relFig(d, c, set);
        const role = (r) => marks.find((m) => m.role === r);
        const rows = d.until(() => {
          const s = d.pick(SITU.filter((q) => q.k !== 0)), t1 = d.bool(), t3 = d.bool(), t5 = d.bool();
          return [
            t1 ? [`${subj(c.a)} ${c.aw} 대체로 ${c.b}도 ${c.bw}.`, true] : [`${wa(c.a)} ${c.b} 사이에는 음의 상관관계가 있다.`, false],
            [`${s.say} 사이의 상관관계와 같은 상관관계가 있다.`, s.k > 0, s],
            [`${(t3 ? role('down') : role('up')).name}는 ${c.a}에 비하여 ${subj(c.b)} ${c.less} 편이다.`, t3],
            [`${(t3 ? role('up') : role('down')).name}는 ${c.a}에 비하여 ${subj(c.b)} ${c.more} 편이다.`, t3],
            [`${nameList(marks)} 가운데 ${(t5 ? role('top') : role('up')).name}의 ${c.topSay}.`, t5]
          ];
        }, (r) => r.some((q) => q[1]) && r.some((q) => !q[1]) && r.filter((q) => q[1]).length <= 4);
        const s = rows[1][2];
        return comboChoice(d, `${relIntro(c, n)} ${nameList(marks)}에 대한 보기의 설명 가운데 옳은 것을 모두 고른 것은?`, rows.map((q) => q[1]), {
          figure: figure + bogi(rows.map((q) => q[0])),
          explain: `점들이 오른쪽 위로 향하는 직선 주위에 있으므로 양의 상관관계이다. ${s.say} 사이에는 ${s.k > 0 ? '양' : '음'}의 상관관계가 있다. `
            + `${role('up').name}는 그 직선보다 크게 위에, ${role('down').name}는 크게 아래에 있다. 세로축의 값이 가장 큰 점은 ${role('top').name}이다. 옳은 것은 ${rows.map((q, i) => (q[1] ? HAN[i] : '')).filter(Boolean).join(', ')}이다.` });
      }),
      H('hard-small-better', '기록이 작을수록 좋은 변량이 낀 해석', '기본 ①35', (d) => {
        // 함정: 100 m 달리기 기록(초)은 작을수록 잘 달린 것이다. 「위쪽에 있으면 잘한다」로 읽는 아이가 ㄴ·ㄷ에서 틀리게 고른다.
        const RX = scaleOf([0, 12, 1], '멀리뛰기 기록(cm)'), RY = scaleOf([0, 12, 1], '100 m 달리기 기록(초)'), n = d.int(16, 22);
        const set = d.until(() => {
          const base = gridSet(d, RX, RY, n - 2, -1, 1.1), used = new Set(base.map((p) => p.join(',')));
          const tr = [d.int(8, 11), d.int(8, 11)], bl = [d.int(1, 4), d.int(1, 4)];
          if (used.has(tr.join(',')) || used.has(bl.join(','))) return null;
          const br = base.filter(([x, y]) => x >= 8 && y <= 4), tl = base.filter(([x, y]) => x <= 4 && y >= 8);
          if (!br.length || !tl.length) return null;
          return { pts: base.concat([tr, bl]), tr, bl, br: d.pick(br), tl: d.pick(tl) };
        }, (s) => Boolean(s) && corr(s.pts) <= -0.6);
        const names = ['A', 'B', 'C', 'D'], order = d.shuffle(['tr', 'bl', 'br', 'tl']), marks = order.map((r, i) => ({ x: set[r][0], y: set[r][1], name: names[i], role: r }));
        const nm = (r) => marks.find((m) => m.role === r).name;
        const t1 = d.bool(), t2 = d.bool(), [p, q] = d.until(() => d.shuffle(['tr', 'bl', 'br', 'tl']).slice(0, 2), ([a, b]) => Math.abs(set[a][1] - set[b][1]) >= 2), yp = set[p][1], yq = set[q][1];
        const rows = [
          [`멀리뛰기 기록과 100 m 달리기 기록 사이에는 ${t1 ? '음' : '양'}의 상관관계가 있다.`, t1],
          [`${nm(t2 ? 'br' : 'tr')}는 멀리뛰기와 100 m 달리기를 모두 잘한다.`, t2],
          [`${nm(p)}는 ${nm(q)}보다 100 m 달리기를 잘한다.`, yp < yq]
        ];
        const figure = scatter({ X: RX, Y: RY, pts: set.pts, marks, nums: false, square: true });
        return comboChoice(d, `다음 산점도는 어느 학교 학생 ${n}명의 멀리뛰기 기록과 100 m 달리기 기록을 조사하여 나타낸 것이다. 학생 A, B, C, D에 대한 보기의 설명 가운데 옳은 것을 모두 고른 것은?`, rows.map((r) => r[1]), {
          figure: figure + bogi(rows.map((r) => r[0])),
          explain: `멀리뛰기 기록이 클수록 100 m 달리기 기록(걸린 시간)은 대체로 작아지므로 음의 상관관계이다. 100 m 달리기는 기록이 작을수록(아래쪽일수록) 잘한 것이다. `
            + `두 가지를 모두 잘하는 학생은 오른쪽 아래에 있는 ${nm('br')}이고, 오른쪽 위의 ${nm('tr')}는 멀리뛰기는 잘하지만 달리기는 느리다. ${nm(p)}의 달리기 기록은 ${nm(q)}보다 ${yp < yq ? '작으므로 더 잘한다' : '크므로 더 못한다'}.` });
      }),
      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-gain-mean', '향상된 사람들이 오른 점수의 평균', '심4', (d) => {
        const { c, X, Y } = sameOf(d, SAME.filter((s) => s.up && s.u === '점')), n = d.int(15, 24);
        const pts = data(d, X, Y, n, 1, (p) => {
          const up = p.filter(([x, y]) => y > x), g = up.map(([x, y]) => y - x);
          return up.length >= 4 && up.length <= 8 && cnt(p, (x, y) => x === y) >= 2 && sum(g) % up.length === 0 && new Set(g).size >= 2;
        }, 1.8);
        const up = pts.filter(([x, y]) => y > x), g = up.map(([x, y]) => y - x), m = sum(g) / up.length;
        return N(`${intro(c, n)} ${c.up} ${c.who}들이 오른 점수의 평균은?`, m, { unit: '점', figure: scatter({ X, Y, pts, square: true }),
          explain: `향상된 학생은 대각선보다 위쪽에 있는 점이다(대각선 위의 점은 오르지 않았다). ${up.map(([x, y]) => `${ptx([x, y])}: ${y} − ${x} = ${y - x}`).join(', ')}이므로 평균은 (${g.join(' + ')}) ÷ ${up.length} = ${m}이다.`,
          facts: { calc: [[`(${up.map(([x, y]) => `(${y}-${x})`).join('+')})/(${ones(up.length)})`, 0]], unseen: [1] } });
      }),
      H('hard-gain-c-mean', '기준만큼 향상된 사람들의 나중 값의 평균', '심11', (d) => {
        // 대각선을 위로 c만큼 옮긴 직선(경계 포함)과 그 위쪽의 점을 고른 뒤 세로 값의 평균을 구한다.
        const { c, X, Y } = sameOf(d, step1.filter((s) => s.up && s.u === '점')), n = d.int(16, 22), w = d.int(2, 3);
        const pts = data(d, X, Y, n, 1, (p) => {
          const U = p.filter(([x, y]) => y - x >= w), V2 = p.filter(([x, y]) => y > x);
          return U.length >= 3 && U.length <= 6 && cnt(p, (x, y) => y - x === w) >= 1 && V2.length > U.length && sum(ys(U)) % U.length === 0 && sum(ys(V2)) * U.length !== sum(ys(U)) * V2.length;
        }, 2.2);
        const U = pts.filter(([x, y]) => y - x >= w), m = sum(ys(U)) / U.length;
        return N(`${intro(c, n)} ${subj(c.b)} ${c.a}보다 ${amt(w, c.u)} 이상 높은 ${c.who}들의 ${c.b}의 평균은?`, m, { unit: c.u, figure: scatter({ X, Y, pts, square: true }),
          explain: `${subj(c.b)} ${c.a}보다 ${w} 이상 높은 점은 대각선을 위로 ${w}만큼 옮긴 직선 위의 점과 그보다 위쪽에 있는 점이다. ${list(U)}의 ${U.length}개이므로 평균은 (${ys(U).join(' + ')}) ÷ ${U.length} = ${m}이다.`,
          facts: { calc: [[`(${ys(U).join('+')})/(${ones(U.length)})`, 0]], unseen: [1] } });
      }),
      H('hard-top-percent', '합으로 매긴 순위에서 상위 25 %인 사람들의 평균', '심12', (d) => {
        // 25 %를 사람 수로 바꾸고, 평균의 차례는 합의 차례와 같음을 써서 위에서부터 고른 뒤, 평균 점수들의 평균을 구한다.
        const { c, X, Y } = sameOf(d, SAME.filter((s) => s.u === '점' && s.sc.some((v) => v[2] === 10))), n = d.pick([16, 20, 24]), k = n / 4;
        const ranked = (p) => p.slice().sort((P, Q) => Q[0] + Q[1] - (P[0] + P[1]));
        const pts = data(d, X, Y, n, 1, (p) => { const r = ranked(p), s = (i) => r[i][0] + r[i][1]; return s(k - 1) > s(k) && sum(r.slice(0, k).map((q) => q[0] + q[1])) % (2 * k) === 0; }, 1.6);
        const top = ranked(pts).slice(0, k), means = top.map(([x, y]) => (x + y) / 2), m = sum(means) / k;
        return N(`${intro(c, n)} 두 점수의 평균을 평균 점수라고 할 때, 평균 점수가 상위 25 % 이내에 드는 ${c.who}들의 평균 점수의 평균은?`, m, { unit: '점', figure: scatter({ X, Y, pts, square: true }),
          explain: `${n}명의 25 %는 ${k}명이다. 평균 점수의 차례는 두 점수의 합의 차례와 같으므로, 합이 큰 순서로 ${k}명은 ${list(top)}이고 평균 점수는 ${means.join(', ')}이다. 그 평균은 (${means.join(' + ')}) ÷ ${k} = ${m}이다.`,
          facts: { calc: [[`(${top.map(([x, y]) => `${x}+${y}`).join('+')})/(2*(${ones(k)}))`, 0]], unseen: [1, 2] } });
      }),
      H('hard-cond-var', '조건에 맞는 사람들의 한 변량의 분산', '기본 ①22', (d) => {
        // 조건에 맞는 점 고르기 → 세로 값 → 평균 → 편차의 제곱의 평균(분산, 앞 중단원 9-2-5).
        const RATE = { who: '승객', cnt: '명', group: '어느 버스에 탄 승객', a: '청결도 평점', b: '안전성 평점', u: '점', au: '점', bu: '점', about: '청결도와 안전성에 대한 평점' };
        const useRate = d.bool(), pick = useRate ? { c: RATE, X: scaleOf([0, 5, 1], '청결도 평점(점)'), Y: scaleOf([0, 5, 1], '안전성 평점(점)') } : sameOf(d, step1);
        const { c, X, Y } = pick, n = useRate ? d.int(10, 13) : d.int(14, 18);
        let t;
        const pts = data(d, X, Y, n, 1, (p) => {
          t = inner(d, X); const U = ys(p.filter(([x]) => x >= t)), k = U.length;
          if (k < 4 || k > 6 || sum(U) % k !== 0) return false;
          const mu = sum(U) / k, ss = sum(U.map((v) => (v - mu) ** 2));
          return ss % k !== 0 && (ss * 10) % k === 0 && cnt(p, (x) => x === t) >= 1;
        }, useRate ? 2.4 : 2.0);
        const U = ys(pts.filter(([x]) => x >= t)), k = U.length, mu = sum(U) / k, dev = U.map((v) => v - mu), v2 = sum(dev.map((e) => e * e)) / k;
        return D(`${intro(c, n)} ${cond(c, 0, 'ge', t)}인 ${c.who}들의 ${c.b}의 분산은?`, v2, { figure: scatter({ X, Y, pts, square: true }),
          explain: `${cond(c, 0, 'ge', t)}인 점은 ${k}개이고 ${topic(c.b)} ${U.join(', ')}이다. 평균은 ${mu}, 편차는 ${dev.map((e) => (e < 0 ? '−' + -e : e)).join(', ')}이므로 분산은 (${dev.map((e) => `${e < 0 ? '(−' + -e + ')' : e}²`).join(' + ')}) ÷ ${k} = ${v2}이다.`,
          facts: { calc: [[`(${U.map((v) => `${v}*${v}`).join('+')})/(${ones(k)})-(${U.join('+')})*(${U.join('+')})/((${ones(k)})*(${ones(k)}))`, 0]], unseen: [1] } });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
