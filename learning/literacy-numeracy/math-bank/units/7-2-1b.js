// 중학교 1학년 2학기 1단원 기본 도형 — 뒤쪽 묶음(평면에서의 위치 관계, 공간에서의 위치 관계, 동위각과 엇각, 평행선의 성질).
// 단원 틀과 그림 도구, 싣는 기준, 뺀 것과 까닭은 7-2-1a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//
// 위치 관계의 답은 모두 꼭짓점의 3차원 좌표로 셈한다(relLL·relLP·relPP). 모서리는 한없이 늘인 직선, 면은 넓힌 평면으로 본다.
// 이 파일의 문항은 「늘여야 만나는」 모서리가 답에 끼지 않는 모서리만 묻는다(cleanEdge). 그것을 가려내는 일은 실력(7-2-1c.js)에 있다.
// 평행선 그림은 각에서 좌표를 셈해 그린다. 평행하지 않은 두 직선은 적힌 각만큼 실제로 기울여 그린다.
// 묻는 말: 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { box, N, M, C } = B.kit;
  const { LAB, V, range, tagged, claimQ } = B.kit.mid;
  const K = B.kit.m721;
  const { T, pt, angV, deg, LN, list, setQ, sayQ, f1, RAD, pol, dirOf, wide, CREAM, sheet, tiles, relLL, perpLL, relLP, perpLP, relPP, perpPP, share, hasEdge, cleanEdge, others, SOL, drawSolid, solidSay, para, sector, sizeAt, SPOT } = K;
  const lv = (c) => V(c);
  const REL = { meet: '한 점에서 만난다', para: '평행하다', skew: '꼬인 위치에 있다' }, RELS = { meet: '한 점에서 만나고', para: '평행하고', skew: '꼬인 위치에 있고' };
  // 모서리 e 와 나머지 모서리의 위치 관계를 갈라 적은 풀이
  const sortOut = (sol, e) => { const by = (r) => others(sol, e).filter((g) => relLL(sol, e, g) === r); return ['meet', 'para', 'skew'].filter((r) => by(r).length).map((r) => `${{ meet: '한 점에서 만나는', para: '평행한', skew: '꼬인 위치에 있는' }[r]} 모서리는 ${list(by(r))}`).join(', '); };
  const solidFig = (sol, o) => drawSolid(sol, Object.assign({ label: solidSay(sol, o && o.say) }, o || {}));
  const cleanPick = (d, sol, ok) => d.until(() => d.pick(sol.edges), (e) => cleanEdge(sol, e) && (!ok || ok(e)));

  // 한 번 꺾인 선: 직선 l 위의 점 P 에서 직선 l 과 a° 를 이루며 내려와 점 K 에서 꺾여, 직선 m 과 b° 를 이루며 직선 m 위의 점 Q 에 닿는다.
  // 꺾인 점은 두 점보다 오른쪽에 있다(o.left 이면 왼쪽). 꺾인 점에서 두 선분 사이의 각은 a + b 이다.
  // o: { p, q, k: 그 자리에 적는 글, pAt, qAt: 글의 자리, pOut: 직선 l 의 반대쪽과 이루는 각에 적는 글, kRight: 꺾인 각에 직각 표시, names: [P, K, Q 의 이름] }
  function bendFig(a, b, o) {
    const opt = o || {}, s = opt.left ? -1 : 1, H = opt.gap || 96, hk = H * (opt.split || 0.5), dx1 = hk / Math.tan(a * RAD), dx2 = (H - hk) / Math.tan(b * RAD), pad = opt.pad || 62;
    const kx = pad + Math.max(dx1, dx2), w = kx + pad, S = para({ w, gap: H }), flip = (x) => (s === 1 ? x : w - x);
    const P = [flip(kx - dx1), H], Kp = [flip(kx), H - hk], Q = [flip(kx - dx2), 0];
    S.seg(P, Kp).seg(Kp, Q);
    const sec = (r) => (s === 1 ? r : [180 - r[1], 180 - r[0]]);   // 왼쪽으로 볼록한 그림은 좌우를 뒤집는다.
    const put = (v, r, t, at) => { const [f, to] = sec(r); S.angle(v, f < 0 ? f + 360 : f, f < 0 ? to + 360 : to, t, at ? { at: [s * at[0], at[1]], r: 15 } : {}); };
    if (opt.p) put(P, [-a, 0], opt.p, opt.pAt);
    if (opt.pOut) put(P, [180, 360 - a], opt.pOut);
    if (opt.q) put(Q, [0, b], opt.q, opt.qAt);
    if (opt.kRight) S.right(Kp, s === 1 ? 180 - a : 360 - b, 8); else if (opt.k) put(Kp, [180 - a, 180 + b], opt.k);
    if (opt.names) { S.dot(P).dot(Kp, 2.4).dot(Q).name(P, opt.names[0], 90, 11).name(Kp, opt.names[1], s === 1 ? 0 : 180, 12).name(Q, opt.names[2], 270, 12); }
    S.P = P; S.K = Kp; S.Q = Q; S.s = s;
    return S;
  }
  const bendSay = (o, more) => `평행한 두 직선 l(위), m(아래) 사이에 한 번 꺾인 선이 있다. 직선 l 위의 점에서 ${o.left ? '왼쪽' : '오른쪽'} 아래로 내려온 선분이 꺾여 직선 m 위의 점에 닿고, 꺾인 점은 두 점보다 ${o.left ? '왼쪽' : '오른쪽'}에 있다. ${more}`;

  B.addTypes('7-2-1', 'plane', [
    T('plane-kinds', '평면에서 두 직선의 위치 관계', '①42', (d) => {
      const no = '꼬인 위치에 있다.', opts = d.shuffle(['한 점에서 만난다.', '평행하다.', '일치한다.', no]);
      return C('한 평면 위에 있는 두 직선의 위치 관계가 될 수 없는 것은?', opts, opts.indexOf(no), { explain: '한 평면 위에 있는 두 직선은 한 점에서 만나거나, 일치하거나, 평행하다. 꼬인 위치는 두 직선이 한 평면 위에 있지 않을 때의 위치 관계이다.', facts: { truth: opts.map((o) => o === no), want: true } });
    }),
    T('plane-point-on', '점과 직선의 위치 관계', '①43 ②39', (d) => {
      const a = d.int(12, 30), names = d.shuffle(['A', 'B', 'C', 'D', 'E']), kOn = d.pick([2, 3]), S = sheet(), O = [0, 0], spots = d.shuffle([34, 78, 122, 166, 204]);
      S.seg(pol(O, a + 180, 14), pol(O, a, 236)).text(pol(O, a, 246), '{l}');
      const on = names.map((_, i) => i < kOn);
      names.forEach((nm, i) => { const base = pol(O, a, spots[i]), side = d.pick([1, -1]), p = on[i] ? base : pol(base, a + 90 * side, d.int(24, 38)); S.dot(p, 3); S.name(p, nm, on[i] ? a - 90 : a + 90 * side, 12); });
      const want = d.bool(), labels = names.slice().sort(), flags = labels.map((nm) => on[names.indexOf(nm)] === want), inN = labels.filter((nm) => on[names.indexOf(nm)]), outN = labels.filter((nm) => !on[names.indexOf(nm)]);
      return setQ(d, `다음 그림에서 직선 ${lv('l')} 위에 있${want ? '는' : '지 않은'} 점을 모두 고른 것은?`, labels, flags, { show: (x) => '점 ' + x,
        figure: S.out(`비스듬한 직선 l과 다섯 점 A, B, C, D, E. 직선 l이 지나는 점은 ${list(inN)}이고, 직선 l이 지나지 않는 점은 ${list(outN)}이다.`),
        explain: `직선 ${lv('l')}이 지나는 점 ${list(inN)}${pt(inN[inN.length - 1], '은/는')} 직선 ${lv('l')} 위에 있고, 점 ${list(outN)}${pt(outN[outN.length - 1], '은/는')} 직선 ${lv('l')} 위에 있지 않다(직선 ${lv('l')} 밖에 있다).` });
    }),
    T('plane-three-lines', '세 직선과 세 교점에 대한 설명', '②40 ①44', (d) => {
      // 직선 n 은 가로, 직선 l 은 오른쪽 아래로, 직선 m 은 오른쪽 위로. 세 교점에 이름을 섞어 붙인다.
      const top = [d.int(58, 92), d.int(78, 96)], left = [0, 0], right = [150, 0], nm = d.shuffle(['A', 'B', 'C']), at = { lm: nm[0], mn: nm[1], ln: nm[2] }, pos = { lm: top, mn: left, ln: right }, S = sheet();
      const through = (p, q, name, end) => { const a = dirOf(p, q); S.seg(pol(p, a + 180, 28), pol(q, a, 28)); S.text(pol(end === 0 ? p : q, end === 0 ? a + 180 : a, 38), '{' + name + '}'); };
      through(left, right, 'n', 1); through(top, right, 'l', 0); through(left, top, 'm', 1);
      S.dot(top, 3).dot(left, 3).dot(right, 3).name(top, at.lm, 0, 15).name(left, at.mn, 135, 13).name(right, at.ln, 45, 13);
      const keyOf = (name) => Object.keys(at).find((k) => at[k] === name), on = (name, line) => keyOf(name).includes(line), L = ['l', 'm', 'n'], rows = [];
      const J = (c, pair) => pt(c, pair);
      for (const p of nm) for (const line of L) {
        rows.push({ g: 'on', ok: on(p, line), s: `점 ${p}${pt(p, '은/는')} 직선 ${lv(line)} 위에 있다.`, why: `점 ${p}${pt(p, '은/는')} 두 직선 ${keyOf(p).split('').map(lv).join(', ')}의 교점이므로 직선 ${lv(line)} 위에 있지 않다.` });
        rows.push({ g: 'pass', ok: on(p, line), s: `직선 ${lv(line)}${J(line, '은/는')} 점 ${p}${pt(p, '을/를')} 지난다.`, why: `직선 ${lv(line)}${J(line, '은/는')} 점 ${p}${pt(p, '을/를')} 지나지 않는다.` });
      }
      for (const k of Object.keys(at)) for (const p of nm) {
        rows.push({ g: 'x1', ok: at[k] === p, s: `점 ${p}${pt(p, '은/는')} 두 직선 ${lv(k[0])}, ${lv(k[1])}의 교점이다.`, why: `두 직선 ${lv(k[0])}, ${lv(k[1])}의 교점은 점 ${at[k]}이다.` });
        rows.push({ g: 'x2', ok: at[k] === p, s: `두 직선 ${lv(k[0])}, ${lv(k[1])}의 교점은 점 ${p}이다.`, why: `두 직선 ${lv(k[0])}, ${lv(k[1])}의 교점은 점 ${at[k]}이다.` });
      }
      for (const line of L) { const two = nm.filter((p) => on(p, line)), off = nm.find((p) => !on(p, line)); rows.push({ g: 'two', ok: true, s: `두 점 ${two[0]}, ${two[1]}${pt(two[1], '은/는')} 모두 직선 ${lv(line)} 위에 있다.` }); rows.push({ g: 'two', ok: false, s: `두 점 ${two[0]}, ${off}${pt(off, '은/는')} 모두 직선 ${lv(line)} 위에 있다.`, why: `점 ${off}${pt(off, '은/는')} 직선 ${lv(line)} 위에 있지 않다.` }); }
      rows.push({ g: 'rel', ok: true, s: `두 직선 ${lv('l')}, ${lv('m')}은 한 점에서 만난다.` }, { g: 'rel', ok: false, s: `두 직선 ${lv('l')}, ${lv('n')}은 평행하다.`, why: `두 직선 ${lv('l')}, ${lv('n')}은 점 ${at.ln}에서 만난다.` });
      return sayQ(d, '다음 그림에 대한 설명으로 옳지 않은 것은?', rows, false, { figure: S.out(`세 직선 l, m, n이 서로 다른 세 점에서 만난다. 직선 n은 가로로 놓여 있다. 두 직선 l, m의 교점은 위쪽의 점 ${at.lm}, 두 직선 m, n의 교점은 왼쪽의 점 ${at.mn}, 두 직선 l, n의 교점은 오른쪽의 점 ${at.ln}이다.`) });
    }),
    T('plane-quad-lines', '사각형의 변을 연장한 직선끼리의 위치 관계', '①45 ②41', (d, n) => {
      const S = sheet(), names = ['A', 'B', 'C', 'D'];
      const P = n === 0 ? { A: [d.int(30, 46), 78], B: [0, 0], C: [150, 0] } : { A: [d.int(26, 40), 76], B: [0, 0], C: [168, 0] };
      P.D = n === 0 ? [P.A[0] + 150, 78] : [d.int(104, 126), 76];
      const cen = [(P.A[0] + P.B[0] + P.C[0] + P.D[0]) / 4, 38];
      S.poly(names.map((k) => P[k]), 'fill:' + CREAM + ';stroke:#1f2933;stroke-width:1.6;stroke-linejoin:round');
      names.forEach((k) => S.name(P[k], k, dirOf(cen, P[k]), 12));
      const vec = (s) => [P[s[1]][0] - P[s[0]][0], P[s[1]][1] - P[s[0]][1]], rel = (s, r) => { const u = vec(s), w = vec(r); return Math.abs(u[0] * w[1] - u[1] * w[0]) < 1e-6 ? 'para' : Math.abs(u[0] * w[0] + u[1] * w[1]) < 1e-6 ? 'perp' : 'meet'; };
      if (n === 0) {
        const [x, y, z] = d.pick([['AB', 'DC', 'BC'], ['AD', 'BC', 'AB'], ['AB', 'DC', 'AD'], ['AD', 'BC', 'DC']]), opts = d.shuffle([[x, '∥', y], [x, '⊥', y], [x, '∥', z], [x, '⊥', z]]);
        const ok = ([s, mark, r]) => (mark === '∥' ? rel(s, r) === 'para' : rel(s, r) === 'perp');
        return C('다음 평행사변형 ABCD에서 각 변을 연장한 직선의 위치 관계를 기호로 바르게 나타낸 것은?', opts.map(([s, mark, r]) => `${LN(s)} ${mark} ${LN(r)}`), opts.findIndex(ok), {
          figure: S.out('평행사변형 ABCD. 점 A는 왼쪽 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래, 점 D는 오른쪽 위에 있다. 직사각형이 아니다.'),
          explain: `평행사변형은 마주 보는 두 쌍의 변이 서로 평행한 사각형이므로 직선 ${x}${pt(x, '과/와')} 직선 ${y}${pt(y, '은/는')} 평행하다. 이것을 기호로 ${LN(x)} ∥ ${LN(y)}로 나타낸다. 직선 ${x}${pt(x, '과/와')} 직선 ${z}${pt(z, '은/는')} 한 점에서 만나지만 수직은 아니다.`, facts: { truth: opts.map(ok), want: true } });
      }
      const base = d.pick(['AD', 'BC']), labels = ['AB', 'BC', 'CD', 'AD'].filter((s) => s !== base), flags = labels.map((s) => rel(s, base) !== 'para'), other = base === 'AD' ? 'BC' : 'AD';
      return setQ(d, `다음 그림과 같이 변 AD와 변 BC가 평행한 사다리꼴 ABCD에서 각 변을 연장한 직선 가운데 직선 ${base}${pt(base, '과/와')} 한 점에서 만나는 직선을 모두 고른 것은?`, labels, flags, { show: LN,
        figure: S.out('사다리꼴 ABCD. 점 A는 왼쪽 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래, 점 D는 오른쪽 위에 있다. 위쪽의 변 AD가 아래쪽의 변 BC보다 짧다.'),
        explain: `직선 AB는 점 ${base.includes('A') ? 'A' : 'B'}에서, 직선 CD는 점 ${base.includes('D') ? 'D' : 'C'}에서 직선 ${base}${pt(base, '과/와')} 만난다. 직선 ${other}${pt(other, '은/는')} 직선 ${base}${pt(base, '과/와')} 평행하여 만나지 않는다.` });
    }, { count: 2 }),
    T('plane-three-relations', '한 평면 위의 세 직선의 위치 관계', '①46 ②43 심26', (d) => {
      // 직선을 가로·세로 두 방향으로 놓아 본다: ⊥ 는 방향을 바꾸고 ∥ 는 그대로 둔다. 끝의 두 직선의 방향이 같으면 ∥, 다르면 ⊥.
      const make = (form, r1, r2) => {
        const [x, y, z] = d.shuffle(['l', 'm', 'n']), turn = (r) => (r === '⊥' ? 1 : 0), res = (turn(r1) + turn(r2)) % 2 === 0 ? '∥' : '⊥';
        const s = form === 0 ? `${lv(x)} ${r1} ${lv(y)}, ${lv(y)} ${r2} ${lv(z)}이면 ${lv(x)} ${box()} ${lv(z)}` : `${lv(x)} ${r1} ${lv(y)}, ${lv(x)} ${r2} ${lv(z)}이면 ${lv(y)} ${box()} ${lv(z)}`;
        return { s, res };
      };
      const all = []; for (const form of [0, 1]) for (const r1 of ['∥', '⊥']) for (const r2 of ['∥', '⊥']) all.push(make(form, r1, r2));
      const major = d.pick(['∥', '⊥']), opts = d.shuffle(d.shuffle(all.filter((o) => o.res === major)).slice(0, 3).concat(d.shuffle(all.filter((o) => o.res !== major)).slice(0, 1)));
      return C(`한 평면 위에 있는 서로 다른 세 직선 ${lv('l')}, ${lv('m')}, ${lv('n')}에 대하여 다음 □ 안에 ∥, ⊥ 가운데 알맞은 것을 넣을 때, 들어갈 기호가 나머지 셋과 다른 것은?`, opts.map((o) => o.s), opts.findIndex((o) => o.res !== major), {
        explain: `한 평면 위에서 한 직선에 수직인 두 직선은 서로 평행하고, 평행한 두 직선 가운데 하나에 수직인 직선은 다른 하나에도 수직이다. □ 안에 들어갈 기호는 보기의 차례로 ${opts.map((o) => o.res).join(', ')}이다.`, facts: { truth: opts.map((o) => o.res !== major), want: true } });
    })
  ]);

  B.addTypes('7-2-1', 'space', [
    T('space-kinds', '공간에서의 위치 관계의 종류', '①42', (d, n) => {
      const [text, yes, no, why] = [
        ['공간에서 서로 다른 두 직선의 위치 관계가 될 수 없는 것은?', ['한 점에서 만난다.', '평행하다.', '꼬인 위치에 있다.'], '두 점에서만 만난다.', '공간에서 서로 다른 두 직선은 한 점에서 만나거나, 평행하거나, 꼬인 위치에 있다. 두 점을 지나는 직선은 하나뿐이므로 서로 다른 두 직선이 두 점에서 만날 수는 없다.'],
        ['공간에서 직선과 평면의 위치 관계가 될 수 없는 것은?', ['직선이 평면에 포함된다.', '한 점에서 만난다.', '평행하다.'], '꼬인 위치에 있다.', '공간에서 직선과 평면은 직선이 평면에 포함되거나, 한 점에서 만나거나, 평행하다. 꼬인 위치는 두 직선 사이의 위치 관계이다.'],
        ['공간에서 서로 다른 두 평면의 위치 관계가 될 수 없는 것은?', ['한 직선에서 만난다.', '평행하다.'], d.pick(['한 점에서만 만난다.', '꼬인 위치에 있다.']), '공간에서 서로 다른 두 평면은 한 직선에서 만나거나 평행하다. 두 평면이 만나면 그 교선은 직선이다.']
      ][n], opts = d.shuffle(yes.concat([no]));
      return C(text, opts, opts.indexOf(no), { explain: why, facts: { truth: opts.map((o) => o === no), want: true } });
    }, { count: 3 }),
    T('space-points-plane', '평면과 직선 위의 점', '심3', (d) => {
      const [k1, k2] = d.pick([[1, 2], [2, 1], [1, 1], [2, 2]]), names = d.shuffle('ABCDEF'.slice(0, 2 + k1 + k2).split('')), onL = names.slice(0, 2), inP = names.slice(2, 2 + k1), outP = names.slice(2 + k1), S = sheet();
      S.poly([[0, 0], [196, 0], [246, 74], [50, 74]], 'fill:' + CREAM + ';stroke:#1f2933;stroke-width:1.4;stroke-linejoin:round').text([20, 12], '{P}');
      const L0 = [52, 22], L1 = [214, 54], a = dirOf(L0, L1);
      S.seg(L0, L1).text(pol(L1, a, 10), '{l}');
      [[0.3, 0], [0.72, 0]].forEach(([t], i) => { const p = [L0[0] + (L1[0] - L0[0]) * t, L0[1] + (L1[1] - L0[1]) * t]; S.dot(p, 3).name(p, onL[i], a + 90, 12); });
      [[96, 16], [188, 24]].slice(0, k1).forEach((p, i) => S.dot(p, 3).name(p, inP[i], 0, 12));
      [[92, 100], [184, 104]].slice(0, k2).forEach((p, i) => S.dot(p, 3).name(p, outP[i], 0, 12));
      const J = (list2, pair) => list(list2) + pt(list2[list2.length - 1], pair), P = lv('P'), l = lv('l');
      const rows = [
        { g: 'l', ok: true, s: `직선 ${l} 위에 있는 점은 2개이다.` },
        { g: 'P', ok: true, s: `평면 ${P} 위에 있는 점은 ${2 + k1}개이다.` }, { g: 'P', ok: false, s: `평면 ${P} 위에 있는 점은 ${k1}개이다.`, why: `직선 ${l}이 평면 ${P} 위에 있으므로 직선 ${l} 위의 점 ${list(onL)}도 평면 ${P} 위에 있다. 평면 ${P} 위에 있는 점은 ${2 + k1}개이다.` },
        { g: 'nl', ok: true, s: `직선 ${l} 위에 있지 않은 점은 ${k1 + k2}개이다.` }, { g: 'nl', ok: false, s: `직선 ${l} 위에 있지 않은 점은 ${k1}개이다.`, why: `평면 ${P} 위에 있지 않은 점 ${list(outP)}도 직선 ${l} 위에 있지 않다. 직선 ${l} 위에 있지 않은 점은 ${k1 + k2}개이다.` },
        { g: 'in', ok: true, s: `점 ${inP[0]}${pt(inP[0], '은/는')} 평면 ${P} 위에 있지만 직선 ${l} 위에 있지 않다.` },
        { g: 'on', ok: true, s: `점 ${onL[0]}${pt(onL[0], '은/는')} 직선 ${l} 위에 있고 평면 ${P} 위에도 있다.` }, { g: 'on', ok: false, s: `점 ${onL[1]}${pt(onL[1], '은/는')} 직선 ${l} 위에 있지만 평면 ${P} 위에 있지 않다.`, why: `직선 ${l}이 평면 ${P} 위에 있으므로 직선 ${l} 위의 점은 모두 평면 ${P} 위에 있다.` },
        { g: 'np', ok: true, s: `평면 ${P} 위에 있지 않은 점은 ${k2}개이다.` }
      ];
      return sayQ(d, `다음 그림과 같이 평면 ${P} 위에 직선 ${l}이 있다. 점 ${J(outP, '은/는')} 평면 ${P} 위에 있지 않은 점이다. 다음 설명 가운데 옳지 않은 것은?`, rows, false, {
        figure: S.out(`평행사변형 모양으로 나타낸 평면 P와 그 위의 직선 l. 점 ${list(onL)}${pt(onL[1], '은/는')} 직선 l 위에 있다. 점 ${list(inP)}${pt(inP[inP.length - 1], '은/는')} 평면 P 위에 있지만 직선 l 위에 있지 않다. 점 ${list(outP)}${pt(outP[outP.length - 1], '은/는')} 평면 P를 나타낸 평행사변형의 위쪽 바깥에 그려져 있다.`) });
    }),
    T('space-on', '각뿔에서 꼭짓점, 모서리, 면의 포함 관계', '①48 ②50', (d, n) => {
      const sol = d.pick([SOL.tetra, SOL.pyr4])(), verts = Object.keys(sol.V).sort(), figure = solidFig(sol);
      if (n === 0) {
        const e = d.pick(sol.edges);
        return setQ(d, `다음 ${sol.kind}에서 모서리 ${e} 위에 있지 않은 꼭짓점을 모두 고른 것은?`, verts, verts.map((v) => !e.includes(v)), { show: (x) => '점 ' + x, figure, explain: `모서리 ${e} 위에 있는 꼭짓점은 양 끝 점 ${e[0]}, ${e[1]}뿐이다. 나머지 꼭짓점 ${list(verts.filter((v) => !e.includes(v)))}${pt(verts.filter((v) => !e.includes(v)).pop(), '은/는')} 모서리 ${e} 위에 있지 않다.` });
      }
      if (d.bool()) {
        const v = d.until(() => d.pick(verts), (x) => sol.faces.some((f) => !f.includes(x))), flags = sol.faces.map((f) => f.includes(v));
        return N(`다음 ${sol.kind}에서 꼭짓점 ${v}${pt(v, '을/를')} 지나는 면은 모두 몇 개인가?`, flags.filter(Boolean).length, { unit: '개', figure, explain: `꼭짓점 ${v}${pt(v, '을/를')} 지나는 면은 ${sol.faces.filter((f) => f.includes(v)).map((f) => '면 ' + f).join(', ')}의 ${flags.filter(Boolean).length}개이다.`, facts: { count: flags } });
      }
      const f = d.pick(sol.faces), flags = verts.map((v) => !f.includes(v));
      return setQ(d, `다음 ${sol.kind}에서 면 ${f} 위에 있지 않은 꼭짓점을 모두 고른 것은?`, verts, flags, { show: (x) => '점 ' + x, figure, explain: `면 ${f} 위에 있는 꼭짓점은 ${list(f.split(''))}이다. 나머지 꼭짓점 ${list(verts.filter((v) => !f.includes(v)))}${pt(verts.filter((v) => !f.includes(v)).pop(), '은/는')} 면 ${f} 위에 있지 않다.` });
    }, { count: 2 }),
    T('space-edges-meet', '입체도형에서 한 모서리와 만나는 모서리, 평행한 모서리', '①49 ②44·45', (d, n) => {
      const want = n === 0 ? 'meet' : 'para', sol = d.pick([() => SOL.box(4, 2.6, 3), SOL.tri, SOL.trap])(), e = cleanPick(d, sol, (x) => others(sol, x).some((g) => relLL(sol, x, g) === want)), labels = others(sol, e);
      return setQ(d, `다음 ${sol.kind}에서 모서리 ${e}${pt(e, '과/와')} ${n === 0 ? '한 점에서 만나는' : '평행한'} 모서리를 모두 고른 것은?`, labels, labels.map((g) => relLL(sol, e, g) === want), { figure: solidFig(sol), explain: `모서리 ${e}${pt(e, '과/와')} ${sortOut(sol, e)}이다.` });
    }, { count: 2 }),
    T('space-edges-skew', '입체도형에서 꼬인 위치에 있는 모서리', '①49·56 ②44·45·53 심31', (d, n) => {
      const sol = [() => SOL.box(4, 2.6, 3), SOL.tri, () => d.pick([SOL.tetra, SOL.pyr4])(), SOL.trap, SOL.slant][n](), e = cleanPick(d, sol, (x) => others(sol, x).some((g) => relLL(sol, x, g) === 'skew')), labels = others(sol, e), flags = labels.map((g) => relLL(sol, e, g) === 'skew');
      const figure = solidFig(sol), explain = `꼬인 위치에 있는 두 모서리는 만나지도 않고 평행하지도 않다. 모서리 ${e}${pt(e, '과/와')} ${sortOut(sol, e)}이다.`;
      if (n >= 3) return N(`다음 ${sol.kind}에서 모서리 ${e}${pt(e, '과/와')} 꼬인 위치에 있는 모서리는 모두 몇 개인가?`, flags.filter(Boolean).length, { unit: '개', figure, explain, facts: { count: flags } });
      return setQ(d, `다음 ${sol.kind}에서 모서리 ${e}${pt(e, '과/와')} 꼬인 위치에 있는 모서리를 모두 고른 것은?`, labels, flags, { figure, explain });
    }, { count: 5 }),
    T('space-edge-pairs', '모서리끼리의 위치 관계 가리기', '②46 ①60', (d, n) => {
      if (n === 0) {
        const sol = d.pick([SOL.tetra, SOL.pyr4])(), pairs = [];
        sol.edges.forEach((e, i) => sol.edges.slice(i + 1).forEach((g) => pairs.push([e, g])));
        const skew = pairs.filter(([e, g]) => relLL(sol, e, g) === 'skew'), rest = pairs.filter(([e, g]) => relLL(sol, e, g) !== 'skew'), para2 = rest.filter(([e, g]) => relLL(sol, e, g) === 'para');
        const wrong = (para2.length ? [d.pick(para2)] : []).concat(d.shuffle(rest.filter(([e, g]) => relLL(sol, e, g) === 'meet'))).slice(0, 3), opts = d.shuffle([d.pick(skew)].concat(wrong)), at = opts.findIndex(([e, g]) => relLL(sol, e, g) === 'skew');
        return C(`다음 ${sol.kind}에서 서로 꼬인 위치에 있는 모서리끼리 짝 지은 것은?`, opts.map(([e, g]) => `모서리 ${e}${pt(e, '과/와')} 모서리 ${g}`), at, { figure: solidFig(sol),
          explain: opts.map(([e, g]) => `모서리 ${e}${pt(e, '과/와')} 모서리 ${g}${pt(g, '은/는')} ${REL[relLL(sol, e, g)]}.`).join(' '), facts: { truth: opts.map(([e, g]) => relLL(sol, e, g) === 'skew'), want: true } });
      }
      const sol = d.pick([SOL.pyr4, () => SOL.box(4, 2.6, 3)])(), e = cleanPick(d, sol), by = (r) => others(sol, e).filter((g) => relLL(sol, e, g) === r);
      const [major, minor] = d.until(() => d.shuffle(['meet', 'para', 'skew']).slice(0, 2), ([x, y]) => by(x).length >= 3 && by(y).length >= 1), odd = d.pick(by(minor)), opts = d.shuffle(d.shuffle(by(major)).slice(0, 3).concat([odd]));
      return C(`다음 ${sol.kind}에서 모서리 ${e}${pt(e, '과/와')}의 위치 관계가 나머지 셋과 다른 모서리는?`, opts.map((g) => '모서리 ' + g), opts.indexOf(odd), { figure: solidFig(sol),
        explain: `모서리 ${odd}${pt(odd, '은/는')} 모서리 ${e}${pt(e, '과/와')} ${RELS[minor]}, 나머지 세 모서리는 모서리 ${e}${pt(e, '과/와')} ${REL[major]}.`, facts: { truth: opts.map((g) => g === odd), want: true } });
    }, { count: 2 }),
    T('space-edge-face', '모서리와 면의 위치 관계', '①50 ②49', (d, n) => {
      if (n === 0) {
        const sol = SOL.box(4, 2.6, 3), e = d.pick(sol.edges), flags = sol.faces.map((f) => relLP(sol, e, f) === 'in');
        return setQ(d, `다음 직육면체에서 모서리 ${e}${pt(e, '을/를')} 포함하는 면을 모두 고른 것은?`, sol.faces, flags, { show: (f) => '면 ' + f, figure: solidFig(sol), explain: `모서리 ${e}의 양 끝 점을 모두 꼭짓점으로 가지는 면은 ${sol.faces.filter((_, i) => flags[i]).map((f) => '면 ' + f).join(', ')}이다.` });
      }
      if (n === 1 || n === 2) {
        const sol = SOL.lying(4.2, 2.8, 3), f = d.pick(n === 1 ? ['ABC', 'BEFC', 'ADFC'] : ['ABC', 'ABED', 'BEFC']), ok = (e) => (n === 1 ? relLP(sol, e, f) === 'para' : perpLP(sol, e, f)), flags = sol.edges.map(ok), hit = sol.edges.filter(ok);
        return setQ(d, `다음 그림은 밑면이 ∠ABC = 90°인 직각삼각형인 삼각기둥이다. 면 ${f}${pt(f, '과/와')} ${n === 1 ? '평행한' : '수직인'} 모서리를 모두 고른 것은?`, sol.edges, flags, { figure: solidFig(sol, { marks: [['B', 'A', 'C']] }),
          explain: n === 1 ? `면 ${f}${pt(f, '과/와')} 만나지 않는 모서리는 ${list(hit)}이다. 나머지 모서리는 면 ${f}에 포함되거나 면 ${f}${pt(f, '과/와')} 한 점에서 만난다.` : `면 ${f}${pt(f, '과/와')} 수직인 모서리는 ${list(hit)}이다. 이 모서리들은 면 ${f}${pt(f, '과/와')} 만나는 점을 지나는 면 ${f} 위의 모든 직선과 수직이다.` });
      }
      const sol = d.pick([SOL.slant, () => SOL.box(4, 2.6, 3)])(), e = cleanPick(d, sol), flags = sol.faces.map((f) => relLP(sol, e, f) === 'para');
      return N(`다음 ${sol.kind}에서 모서리 ${e}${pt(e, '과/와')} 평행한 면은 모두 몇 개인가?`, flags.filter(Boolean).length, { unit: '개', figure: solidFig(sol), explain: `모서리 ${e}${pt(e, '과/와')} 만나지 않는 면은 ${sol.faces.filter((_, i) => flags[i]).map((f) => '면 ' + f).join(', ')}의 ${flags.filter(Boolean).length}개이다. 나머지 면은 모서리 ${e}${pt(e, '을/를')} 포함하거나 모서리 ${e}${pt(e, '과/와')} 한 점에서 만난다.`, facts: { count: flags } });
    }, { count: 4 }),
    T('space-faces', '면끼리의 위치 관계', '①51·55', (d) => {
      const sol = SOL.lying(4.2, 2.8, 3), f = d.pick(sol.faces), labels = sol.faces.filter((g) => g !== f), flags = labels.map((g) => relPP(sol, f, g) === 'meet' && perpPP(sol, f, g));
      return setQ(d, `다음 그림은 밑면이 ∠ABC = 90°인 직각삼각형인 삼각기둥이다. 면 ${f}${pt(f, '과/와')} 수직인 면을 모두 고른 것은?`, labels, flags, { show: (g) => '면 ' + g, figure: solidFig(sol, { marks: [['B', 'A', 'C']] }),
        explain: `삼각기둥의 옆면은 두 밑면 ABC, DEF와 수직이다. 또 ∠ABC = 90°이므로 면 ABED와 면 BEFC는 서로 수직이다. 면 ${f}${pt(f, '과/와')} 수직인 면은 ${labels.filter((_, i) => flags[i]).map((g) => '면 ' + g).join(', ')}이다.` });
    }),
    T('space-two-conds', '두 조건에 모두 맞는 모서리', '①52 ②48', (d, n) => {
      const sol = SOL.box(4, 2.6, 3);
      if (n === 0) {
        const [e1, e2] = d.until(() => [d.pick(sol.edges), d.pick(sol.edges)], ([x, y]) => x !== y && relLL(sol, x, y) === 'meet'), labels = sol.edges.filter((g) => g !== e1 && g !== e2), flags = labels.map((g) => relLL(sol, e1, g) === 'para' && relLL(sol, e2, g) === 'skew');
        return setQ(d, `다음 직육면체에서 모서리 ${e1}${pt(e1, '과/와')} 평행하고 모서리 ${e2}${pt(e2, '과/와')} 꼬인 위치에 있는 모서리를 모두 고른 것은?`, labels, flags, { figure: solidFig(sol), traps: [labels.filter((g) => relLL(sol, e1, g) === 'para')],
          explain: `모서리 ${e1}${pt(e1, '과/와')} 평행한 모서리는 ${list(labels.filter((g) => relLL(sol, e1, g) === 'para'))}이다. 이 가운데 모서리 ${e2}${pt(e2, '과/와')} 만나지도 않고 평행하지도 않은 것은 ${list(labels.filter((_, i) => flags[i]))}이다.` });
      }
      const [dg, e1] = d.until(() => { const f = d.pick(['ABCD', 'BFGC', 'CGHD']); return [[d.bool() ? f[0] + f[2] : f[1] + f[3]].map((x) => x.split('').sort().join(''))[0], d.pick(sol.edges)]; }, ([x, y]) => { const par = others(sol, y).filter((g) => relLL(sol, y, g) === 'para'), hit = par.filter((g) => relLL(sol, x, g) === 'skew'); return hit.length >= 1 && hit.length < par.length; });
      const labels = others(sol, e1), flags = labels.map((g) => relLL(sol, e1, g) === 'para' && relLL(sol, dg, g) === 'skew'), par = labels.filter((g) => relLL(sol, e1, g) === 'para');
      return setQ(d, `다음 직육면체에서 모서리 ${e1}${pt(e1, '과/와')} 평행하고 선분 ${dg}${pt(dg, '과/와')} 꼬인 위치에 있는 모서리를 모두 고른 것은?`, labels, flags, { figure: solidFig(sol, { extra: [dg.split('')], say: `면 위에 선분 ${dg}${pt(dg, '이/가')} 그어져 있다.` }), traps: [par],
        explain: `모서리 ${e1}${pt(e1, '과/와')} 평행한 모서리는 ${list(par)}이다. 이 가운데 ${par.filter((g) => relLL(sol, dg, g) === 'meet').map((g) => `모서리 ${g}${pt(g, '은/는')} 점 ${g.split('').find((c) => dg.includes(c))}에서`).join(', ')} 선분 ${dg}${pt(dg, '과/와')} 만나므로, 선분 ${dg}${pt(dg, '과/와')} 꼬인 위치에 있는 것은 ${list(labels.filter((_, i) => flags[i]))}이다.` });
    }, { count: 2 }),
    T('space-diag-skew', '면의 대각선과 꼬인 위치에 있는 모서리의 개수', '①53', (d) => {
      const sol = SOL.box(4, 2.6, 3), f = d.pick(['ABCD', 'BFGC', 'CGHD']), dg = (d.bool() ? f[0] + f[2] : f[1] + f[3]).split('').sort().join(''), flags = sol.edges.map((g) => relLL(sol, dg, g) === 'skew'), meet = sol.edges.filter((g) => relLL(sol, dg, g) === 'meet');
      return N(`다음 직육면체에서 선분 ${dg}${pt(dg, '과/와')} 꼬인 위치에 있는 모서리는 모두 몇 개인가?`, flags.filter(Boolean).length, { unit: '개', figure: solidFig(sol, { extra: [dg.split('')], say: `면 ${f} 위에 대각선 ${dg}${pt(dg, '이/가')} 그어져 있다.` }),
        explain: `선분 ${dg}${pt(dg, '과/와')} 만나는 모서리는 점 ${dg[0]}${pt(dg[0], '이나/나')} 점 ${dg[1]}${pt(dg[1], '을/를')} 지나는 ${list(meet)}의 ${meet.length}개이고, 평행한 모서리는 없다. 나머지 ${sol.edges.filter((_, i) => flags[i]).join(', ')}의 ${flags.filter(Boolean).length}개가 꼬인 위치에 있다.`, facts: { count: flags } });
    }),
    T('space-claims', '각기둥에 대한 설명(모서리와 면)', '①61 ②51', (d, n) => {
      const sol = n === 0 ? SOL.box(4, 2.6, 3) : d.pick([SOL.tri, () => SOL.lying(4.2, 2.8, 3)])(), lying = Boolean(sol.rightAt), rows = [];
      const e2 = () => d.until(() => [d.pick(sol.edges), d.pick(sol.edges)], ([x, y]) => x !== y && (relLL(sol, x, y) !== 'meet' || share(x, y)));
      const seenPairs = new Set();
      for (const tag of ['a', 'b']) {
        const [e, g] = d.until(e2, (p) => !seenPairs.has(p.slice().sort().join())); seenPairs.add([e, g].sort().join());
        const r = relLL(sol, e, g), lie = d.pick(['meet', 'para', 'skew'].filter((x) => x !== r)), told = (x) => `모서리 ${e}${pt(e, '과/와')} 모서리 ${g}${pt(g, '은/는')} ${REL[x]}.`;
        rows.push({ g: tag, ok: true, s: told(r) }, { g: tag, ok: false, s: told(lie), why: told(r) });
      }
      { const e = d.pick(sol.edges), fIn = d.pick(sol.faces.filter((f) => relLP(sol, e, f) === 'in')), fNo = d.pick(sol.faces.filter((f) => relLP(sol, e, f) !== 'in'));
        rows.push({ g: 'in', ok: true, s: `면 ${fIn}${pt(fIn, '은/는')} 모서리 ${e}${pt(e, '을/를')} 포함한다.` }, { g: 'in', ok: false, s: `면 ${fNo}${pt(fNo, '은/는')} 모서리 ${e}${pt(e, '을/를')} 포함한다.`, why: `모서리 ${e}${pt(e, '을/를')} 포함하는 면은 ${sol.faces.filter((f) => relLP(sol, e, f) === 'in').map((f) => '면 ' + f).join(', ')}이다.` }); }
      { const [e, fp] = d.until(() => [d.pick(sol.edges), d.pick(sol.faces)], ([x, f]) => relLP(sol, x, f) === 'para'), fm = d.pick(sol.faces.filter((f) => relLP(sol, e, f) === 'meet' && share(e, f)));
        rows.push({ g: 'par', ok: true, s: `면 ${fp}${pt(fp, '과/와')} 모서리 ${e}${pt(e, '은/는')} 평행하다.` }, { g: 'par', ok: false, s: `면 ${fm}${pt(fm, '과/와')} 모서리 ${e}${pt(e, '은/는')} 평행하다.`, why: `면 ${fm}${pt(fm, '과/와')} 모서리 ${e}${pt(e, '은/는')} 점 ${e.split('').find((c) => fm.includes(c))}에서 만난다.` }); }
      { const e = cleanPick(d, sol), k = others(sol, e).filter((g) => relLL(sol, e, g) === 'skew').length, lie = k + (k <= 1 ? 1 : d.pick([-1, 1]));
        rows.push({ g: 'cnt', ok: true, s: `모서리 ${e}${pt(e, '과/와')} 꼬인 위치에 있는 모서리는 ${k}개이다.` }, { g: 'cnt', ok: false, s: `모서리 ${e}${pt(e, '과/와')} 꼬인 위치에 있는 모서리는 ${lie}개이다.`, why: `모서리 ${e}${pt(e, '과/와')} 꼬인 위치에 있는 모서리는 ${list(others(sol, e).filter((g) => relLL(sol, e, g) === 'skew'))}의 ${k}개이다.` }); }
      { const f = d.pick(sol.faces), perp = sol.edges.filter((e) => perpLP(sol, e, f)), not = sol.edges.filter((e) => relLP(sol, e, f) === 'meet' && !perpLP(sol, e, f) && share(e, f));
        if (perp.length) rows.push({ g: 'perp', ok: true, s: `모서리 ${perp[0]}${pt(perp[0], '은/는')} 면 ${f}${pt(f, '과/와')} 수직이다.` });
        if (not.length) rows.push({ g: 'perp', ok: false, s: `모서리 ${not[0]}${pt(not[0], '은/는')} 면 ${f}${pt(f, '과/와')} 수직이다.`, why: `모서리 ${not[0]}${pt(not[0], '은/는')} 면 ${f}${pt(f, '과/와')} 한 점에서 만나지만 수직은 아니다.` }); }
      const head = n === 0 ? '다음 직육면체' : lying ? '다음 그림은 밑면이 ∠ABC = 90°인 직각삼각형인 삼각기둥이다. 이 삼각기둥' : '다음 삼각기둥';
      return sayQ(d, `${head}에 대한 설명으로 옳지 않은 것은?`, rows, false, { figure: solidFig(sol, lying ? { marks: [['B', 'A', 'C']] } : {}) });
    }, { count: 2 }),
    T('space-face-dist', '직육면체에서 두 면 사이의 거리', '②52', (d) => {
      const [a, b, c] = d.until(() => [d.int(4, 9), d.int(4, 9), d.int(4, 9)], (v) => new Set(v).size === 3 && Math.max(...v) <= 2 * Math.min(...v)), sol = SOL.box(a, b, c);
      const [f, g, e, len] = d.pick([['ABCD', 'EFGH', 'DH', c], ['ABFE', 'CGHD', 'FG', a], ['BFGC', 'AEHD', 'GH', b]]);
      return N(`다음 직육면체에서 면 ${f}${pt(f, '과/와')} 면 ${g} 사이의 거리는 몇 cm인가?`, len, { unit: 'cm',
        figure: solidFig(sol, { lens: [['FG', a + ' cm'], ['GH', b + ' cm'], ['DH', c + ' cm']], say: `모서리 FG의 길이는 ${a} cm, 모서리 GH의 길이는 ${b} cm, 모서리 DH의 길이는 ${c} cm이다.` }),
        explain: `면 ${f}${pt(f, '과/와')} 면 ${g}${pt(g, '은/는')} 평행하고, 모서리 ${e}${pt(e, '은/는')} 두 면에 모두 수직이다. 두 면 사이의 거리는 모서리 ${e}의 길이와 같은 ${len} cm이다.`, facts: { calc: [[String(len), 0]] } });
    }),
    T('space-real', '둘레에서 찾는 위치 관계', '②56', (d, n) => {
      const POOL = n === 0 ? {
        text: '다음 가운데 두 직선이 꼬인 위치에 있는 것으로 볼 수 있는 것은?',
        yes: [['서로 다른 높이에서 엇갈려 지나가는 고가 도로와 그 아래의 도로', '만나지도 않고 평행하지도 않으므로 꼬인 위치에 있다.'], ['교실에서 천장과 앞 벽이 만나는 선과, 바닥과 옆 벽이 만나는 선', '만나지도 않고 평행하지도 않으므로 꼬인 위치에 있다.']],
        no: [['곧게 뻗은 기찻길의 두 레일', '평행하다.'], ['교실에서 천장과 앞 벽이 만나는 선과, 바닥과 앞 벽이 만나는 선', '평행하다.'], ['바둑판의 가로줄 하나와 세로줄 하나', '한 점에서 만난다.'], ['교실에서 천장과 앞 벽이 만나는 선과, 앞 벽과 옆 벽이 만나는 선', '한 점에서 만난다.'], ['펼친 부채의 이웃한 두 살', '한 점에서 만난다.']]
      } : {
        text: '다음 가운데 직선과 평면이 평행한 것으로 볼 수 있는 것은?',
        yes: [['교실 바닥과, 천장에 붙여 단 긴 형광등', '만나지 않으므로 평행하다.'], ['운동장 바닥과, 그 위로 높이가 같게 팽팽히 친 줄', '만나지 않으므로 평행하다.']],
        no: [['운동장 바닥과, 운동장에 똑바로 세운 깃대', '한 점에서 수직으로 만난다.'], ['교실 바닥과, 벽에 비스듬히 기대어 세운 긴 막대', '한 점에서 만난다.'], ['책상의 윗면과, 그 위에 눕혀 놓은 자', '직선이 평면에 포함된다.'], ['과녁판과, 과녁판에 꽂힌 화살', '한 점에서 만난다.']]
      };
      const opts = d.shuffle([d.pick(POOL.yes).concat([true])].concat(d.shuffle(POOL.no).slice(0, 3).map((r) => r.concat([false]))));
      return C(POOL.text, opts.map((r) => r[0]), opts.findIndex((r) => r[2]), { explain: opts.map((r) => `「${r[0]}」: ${r[1]}`).join(' '), facts: { truth: opts.map((r) => r[2]), want: true } });
    }, { count: 2 })
  ]);

  // 두 직선과 가로지르는 한 직선이 만드는 여덟 각의 이름. 자리 k: 0 오른쪽 위, 1 왼쪽 위, 2 왼쪽 아래, 3 오른쪽 아래. LAY[위/아래][k]
  const LAYS = [[['d', 'a', 'b', 'c'], ['h', 'e', 'f', 'g']], [['a', 'b', 'c', 'd'], ['e', 'f', 'g', 'h']]];
  // 여덟 각에 이름을 붙인 그림. tilt: 아래 직선의 기울기(평행하지 않게 그릴 때)
  function eightFig(lay, a, tilt) {
    const S = para({ w: 190, gap: 70, tilt, pivot: [95, 0] }), [P, Q] = S.cross(95 + 35 / Math.tan(a * RAD), a, 26);
    for (let k = 0; k < 4; k += 1) { const u = sector(a, k, 0), w = sector(a, k, tilt); S.angle(P, u[0], u[1], '{' + lay[0][k] + '}', { r: 11, d: 23 }).angle(Q, w[0], w[1], '{' + lay[1][k] + '}', { r: 11, d: 23 }); }
    return S.out(`두 직선 l(위), m(아래)과 가로지르는 한 직선. 직선 l과의 교점 둘레의 각은 ${[1, 0, 2, 3].map((k) => `${SPOT[k]} ∠${lay[0][k]}`).join(', ')}이고, 직선 m과의 교점 둘레의 각은 ${[1, 0, 2, 3].map((k) => `${SPOT[k]} ∠${lay[1][k]}`).join(', ')}이다.`);
  }
  // 각 [위(0)/아래(1), 자리]. 동위각은 같은 자리, 엇각은 두 직선 사이에서 엇갈린 자리(위 2 ↔ 아래 0, 위 3 ↔ 아래 1)
  const sameSpot = (x, y) => x[0] !== y[0] && x[1] === y[1];
  const alternate = (x, y) => { const [u, w] = x[0] === 0 ? [x, y] : [y, x]; return u[0] === 0 && w[0] === 1 && ((u[1] === 2 && w[1] === 0) || (u[1] === 3 && w[1] === 1)); };

  B.addTypes('7-2-1', 'trans', [
    T('trans-find', '동위각과 엇각 찾기', '②57 ①63', (d, n) => {
      const lay = d.pick(LAYS), a = d.pick([62, 68, 74, 106, 112, 118]), tilt = d.pick([-7, -5, 5, 7]), figure = eightFig(lay, a, tilt), nameOf = ([row, k]) => lay[row][k], kind = d.bool() ? '동위각' : '엇각';
      const all = []; for (const row of [0, 1]) for (let k = 0; k < 4; k += 1) all.push([row, k]);
      if (n === 0) {
        const x = d.until(() => d.pick(all), (c) => kind === '동위각' || all.some((y) => alternate(c, y))), opts = d.shuffle(all.filter((y) => y[0] !== x[0])), ok = (y) => (kind === '동위각' ? sameSpot(x, y) : alternate(x, y));
        return C(`다음 그림에서 ${angV(nameOf(x))}의 ${kind}은?`, opts.map((y) => angV(nameOf(y))), opts.findIndex(ok), { figure,
          explain: kind === '동위각' ? `동위각은 두 직선이 다른 한 직선과 만날 때 같은 쪽 자리에 있는 각이다. ${angV(nameOf(x))}는 교점의 ${SPOT[x[1]]}에 있으므로 다른 교점의 ${SPOT[x[1]]}에 있는 ${angV(nameOf(opts.find(ok)))}가 동위각이다.` : `엇각은 두 직선 사이에서 가로지르는 직선의 서로 반대쪽에 엇갈려 있는 각이다. ${angV(nameOf(x))}의 엇각은 ${angV(nameOf(opts.find(ok)))}이다.`,
          facts: { truth: opts.map(ok), want: true } });
      }
      const pairs = []; all.forEach((x, i) => all.slice(i + 1).forEach((y) => pairs.push([x, y])));
      const kindOf = ([x, y]) => (sameSpot(x, y) ? '동위각' : alternate(x, y) ? '엇각' : x[0] === y[0] && (x[1] + 2) % 4 === y[1] ? '맞꼭지각' : null);
      const inner = (c) => (c[0] === 0 ? c[1] >= 2 : c[1] <= 1), other = kind === '동위각' ? '엇각' : '동위각';
      const sameSide = pairs.filter(([x, y]) => x[0] !== y[0] && inner(x) && inner(y) && !alternate(x, y)), right = d.pick(pairs.filter((p) => kindOf(p) === kind));
      const opts = d.shuffle([right, d.pick(pairs.filter((p) => kindOf(p) === other)), d.pick(pairs.filter((p) => kindOf(p) === '맞꼭지각')), d.pick(sameSide)]);
      const told = (p) => kindOf(p) || '두 직선 사이에서 같은 쪽에 있는 각';
      return C(`다음 그림에서 ${kind}끼리 짝 지은 것은?`, opts.map(([x, y]) => `${angV(nameOf(x))}${pt(nameOf(x), '과/와')} ${angV(nameOf(y))}`), opts.indexOf(right), { figure,
        explain: opts.map((p) => `${angV(nameOf(p[0]))}${pt(nameOf(p[0]), '과/와')} ${angV(nameOf(p[1]))}${pt(nameOf(p[1]), '은/는')} ${told(p)}이다.`).join(' '), facts: { truth: opts.map((p) => kindOf(p) === kind), want: true } });
    }, { count: 2 }),
    T('trans-claims', '동위각, 엇각, 평행에 대한 설명', '①64', (d) => claimQ(d, '서로 다른 두 직선이 다른 한 직선과 만날 때, 다음 가운데 옳지 않은 것은?', [
      '두 직선이 평행하면 동위각의 크기는 서로 같다.', '두 직선이 평행하면 엇각의 크기는 서로 같다.', '동위각의 크기가 같으면 두 직선은 평행하다.', '엇각의 크기가 같으면 두 직선은 평행하다.', '맞꼭지각의 크기는 항상 같다.', '두 직선이 평행하지 않아도 동위각과 엇각이 있다.'
    ], [
      ['동위각의 크기는 항상 같다.', '동위각의 크기는 두 직선이 평행할 때에만 같다.', '두 직선이 평행하면 동위각의 크기는 서로 같다.'],
      ['엇각의 크기는 항상 같다.', '엇각의 크기는 두 직선이 평행할 때에만 같다.', '두 직선이 평행하면 엇각의 크기는 서로 같다.'],
      ['두 직선이 평행하면 엇각의 크기의 합은 항상 180°이다.', '두 직선이 평행하면 엇각의 크기는 서로 같다.', '두 직선이 평행하면 엇각의 크기는 서로 같다.'],
      ['두 직선이 평행하지 않으면 동위각은 없다.', '두 직선이 평행하지 않아도 같은 자리에 있는 각은 동위각이다. 크기만 같지 않다.', '두 직선이 평행하지 않아도 동위각과 엇각이 있다.'],
      ['동위각의 크기가 같아도 두 직선이 평행하지 않을 수 있다.', '동위각의 크기가 같으면 두 직선은 평행하다.', '동위각의 크기가 같으면 두 직선은 평행하다.']
    ], false))
  ]);

  // 평행선과 가로지르는 직선 하나: 자리마다의 크기와 관계
  const relWord = (kg, k) => (k === kg ? '과 같은 자리에 있어' : (k + 2) % 4 === kg ? '의 맞꼭지각이어서' : null);

  B.addTypes('7-2-1', 'para', [
    T('para-one', '평행선과 한 직선이 만날 때의 각', '①69 ②60·61', (d, n) => {
      const flipA = d.bool();
      if (n === 0) {
        const a = flipA ? 5 * d.int(21, 25) : 5 * d.int(11, 15), kg = d.int(0, 3), kx = d.pick(kg <= 1 ? [kg, kg + 2] : [kg]), ky = (kx + d.pick([1, 3])) % 4, g = sizeAt(a, kg), S = para({ w: 210 }), [P, Q] = S.cross(105 + 36 / Math.tan(a * RAD), a);
        const m = (v, k, t) => { const r = sector(a, k); S.angle(v, r[0], r[1], t); };
        m(Q, kg, deg(g)); m(P, kx, '{x}'); m(P, ky, '{y}');
        return M(`다음 그림에서 ${lv('l')} ∥ ${lv('m')}일 때, ${angV('x')}, ${angV('y')}의 크기를 차례로 구하시오.`, [{ label: angV('x'), answer: g, unit: '°' }, { label: angV('y'), answer: 180 - g, unit: '°' }], { shown: `${angV('x')} = ${g}°, ${angV('y')} = ${180 - g}°`,
          figure: S.out(`평행한 두 직선 l(위), m(아래)과 가로지르는 한 직선. 직선 m과의 교점의 ${SPOT[kg]} 각이 ${g}°이다. 직선 l과의 교점의 ${SPOT[kx]} 각이 ∠x, ${SPOT[ky]} 각이 ∠y이다.`),
          explain: `${lv('l')} ∥ ${lv('m')}이므로 ${kx === kg ? '동위각' : '엇각'}의 크기가 같다. ${angV('x')}는 ${g}°인 각의 ${kx === kg ? '동위각' : '엇각'}이므로 ${g}°이다. ${angV('y')}는 ${angV('x')}와 합하여 평각을 이루므로 180° − ${g}° = ${180 - g}°이다.`,
          facts: { calc: [[String(g), 0], [`180-${g}`, 1]], unseen: [180] } });
      }
      // 두 직선 사이에서 같은 쪽에 있는 두 각(합이 180°)
      const [k, x, c] = d.pick([[1, 55, 70], [1, 60, 60], [1, 65, 50], [1, 70, 40], [2, 50, 30], [2, 55, 15]]), a = flipA ? 180 - x : x, e = `(${k === 1 ? '' : k}{x} + ${c})°`, S = para({ w: 230 }), [P, Q] = S.cross(115 + 36 / Math.tan(a * RAD), a);
      // a 가 예각이면 오른쪽에서, 둔각이면 왼쪽에서: 직선 m 쪽의 x°, 직선 l 쪽의 식
      const kq = flipA ? 1 : 0, kp = flipA ? 2 : 3, rq = sector(a, kq), rp = sector(a, kp), sgn = flipA ? -1 : 1;
      S.angle(Q, rq[0], rq[1], '{x}°', { r: 15, at: [sgn * (26 + wide('{x}°', 12) / 2), 9] }).angle(P, rp[0], rp[1], e, { r: 14, at: [sgn * (26 + wide(e, 12) / 2), -9] });
      return N(`다음 그림에서 ${lv('l')} ∥ ${lv('m')}일 때, ${lv('x')}의 값은?`, x, {
        figure: S.out(`평행한 두 직선 l(위), m(아래)과 가로지르는 한 직선. 직선 l과의 교점의 ${SPOT[kp]} 각이 (${k === 1 ? '' : k}x + ${c})°, 직선 m과의 교점의 ${SPOT[kq]} 각이 x°이다. 두 각은 두 직선 사이에서 가로지르는 직선의 같은 쪽에 있다.`),
        explain: `${lv('l')} ∥ ${lv('m')}이므로 ${lv('x')}°인 각의 동위각은 직선 ${lv('l')} 쪽의 같은 자리에 있고 크기가 ${lv('x')}°이다. 이 각은 (${k === 1 ? '' : k}${lv('x')} + ${c})°인 각과 합하여 평각을 이루므로 ${lv('x')} + ${k === 1 ? '' : k}${lv('x')} + ${c} = 180이다. ${k + 1}${lv('x')} = ${180 - c}에서 ${lv('x')} = ${x}이다.`,
        facts: { calc: [[`(180-${c})/(${k}+1)`, 0]], unseen: [180, 1].concat(k === 1 ? [1] : []) } });
    }, { count: 2 }),
    T('para-two-pairs', '평행선이 두 쌍일 때의 각', '①70 심56', (d) => {
      const a = d.pick([60, 65, 70, 75, 105, 110, 115, 120]), kg = d.int(0, 3), ka = d.int(0, 3), kb = d.until(() => d.int(0, 3), (k) => sizeAt(a, k) !== sizeAt(a, ka)), g = sizeAt(a, kg), S = para({ w: 236, gap: 70 });
      const x1 = 78 + 35 / Math.tan(a * RAD), [P1] = S.cross(x1, a, 24), [P2, Q2] = S.cross(x1 + 92, a, 24);
      S.text(pol(P1, a, 34), '{p}').text(pol(P2, a, 34), '{q}');
      const m = (v, k, t) => { const r = sector(a, k); S.angle(v, r[0], r[1], t, { r: 13 }); };
      m(P1, kg, deg(g)); m(P2, ka, '{a}'); m(Q2, kb, '{b}');
      const told = (k) => (relWord(kg, k) ? `그 각${relWord(kg, k)} ${g}°` : `그 각과 합하여 평각을 이루므로 180° − ${g}° = ${180 - g}°`);
      return M(`다음 그림에서 ${lv('l')} ∥ ${lv('m')}, ${lv('p')} ∥ ${lv('q')}일 때, ${angV('a')}, ${angV('b')}의 크기를 차례로 구하시오.`, [{ label: angV('a'), answer: sizeAt(a, ka), unit: '°' }, { label: angV('b'), answer: sizeAt(a, kb), unit: '°' }], { shown: `${angV('a')} = ${sizeAt(a, ka)}°, ${angV('b')} = ${sizeAt(a, kb)}°`,
        figure: S.out(`평행한 두 직선 l(위), m(아래)을 서로 평행한 두 직선 p(왼쪽), q(오른쪽)가 가로지른다. 두 직선 l, p의 교점의 ${SPOT[kg]} 각이 ${g}°이다. 두 직선 l, q의 교점의 ${SPOT[ka]} 각이 ∠a, 두 직선 m, q의 교점의 ${SPOT[kb]} 각이 ∠b이다.`),
        explain: `${lv('p')} ∥ ${lv('q')}이므로 두 직선 ${lv('l')}, ${lv('q')}의 교점에서도 ${SPOT[kg]} 각의 크기가 ${g}°이다(동위각). ${angV('a')}는 ${told(ka)}이다. ${lv('l')} ∥ ${lv('m')}이므로 두 직선 ${lv('m')}, ${lv('q')}의 교점에서도 ${SPOT[kg]} 각의 크기가 ${g}°이다. ${angV('b')}는 ${told(kb)}이다.`,
        facts: { calc: [[sizeAt(a, ka) === g ? String(g) : `180-${g}`, 0], [sizeAt(a, kb) === g ? String(g) : `180-${g}`, 1]], unseen: [180] } });
    }),
    T('para-meet-on', '평행선 위의 한 점에서 만나는 두 직선', '①71 ②62', (d) => {
      const [al, be] = d.until(() => [5 * d.int(9, 14), 5 * d.int(9, 14)], ([p, q]) => 180 - p - q >= 50 && p !== q && 180 - p - q !== p && 180 - p - q !== q), ext = 180 - be, gap = 72, px = 30 + gap / Math.tan(al * RAD), S = para({ w: px + gap / Math.tan(be * RAD) + 34, gap }), P = [px, 0];
      const L1 = [px - gap / Math.tan(al * RAD), gap], L2 = [px + gap / Math.tan(be * RAD), gap];
      S.seg(pol(L1, 180 - al, 18), pol(P, 360 - al, 40)).seg(pol(L2, be, 18), pol(P, 180 + be, 40)).dot(P, 2.4).name(P, 'P', 180 - al / 2, 24);
      S.angle(L1, 360 - al, 360, deg(al)).angle(L2, 180 + be, 360, deg(ext)).angle(P, 360 - al, 360, '{x}', { r: 17 }).angle(P, 180 + be, 360 - al, '{y}', { r: 13 });
      const y = 180 - al - be;
      return M(`다음 그림에서 ${lv('l')} ∥ ${lv('m')}일 때, ${angV('x')}, ${angV('y')}의 크기를 차례로 구하시오.`, [{ label: angV('x'), answer: al, unit: '°' }, { label: angV('y'), answer: y, unit: '°' }], { shown: `${angV('x')} = ${al}°, ${angV('y')} = ${y}°`,
        figure: S.out(`평행한 두 직선 l(위), m(아래). 두 비스듬한 직선이 직선 m 위의 점 P에서 만나고, 직선 l과 함께 점 P를 아래쪽 꼭짓점으로 하는 삼각형을 이룬다. 왼쪽 직선과 직선 l의 교점에서 삼각형 안쪽의 각(오른쪽 아래)이 ${al}°이고, 오른쪽 직선과 직선 l의 교점의 오른쪽 아래 각(삼각형 바깥쪽)이 ${ext}°이다. 점 P의 아래쪽에서 ∠x는 직선 m의 오른쪽과 왼쪽 직선을 늘인 선 사이의 각, ∠y는 두 직선을 늘인 선 사이의 각이다.`),
        explain: `${angV('x')}는 ${al}°인 각의 동위각이므로 ${al}°이다. 오른쪽 직선과 직선 ${lv('l')}의 교점에서 ${ext}°인 각과 이웃한 왼쪽 아래 각은 180° − ${ext}° = ${be}°이고, 점 P의 왼쪽 아래 각은 이 각의 동위각이므로 ${be}°이다. 직선 ${lv('m')}의 아래쪽에서 세 각이 평각을 이루므로 ${angV('y')} = 180° − ${be}° − ${al}° = ${y}°이다.`,
        facts: { calc: [[String(al), 0], [`180-(180-${ext})-${al}`, 1]], unseen: [180] } });
    }),
    T('para-bend', '평행선 사이에서 한 번 꺾인 선', '①74 ②67·68 심47', (d, n) => {
      const left = d.bool(), aux = '꺾인 점을 지나고 두 직선에 평행한 직선을 그으면 꺾인 점의 각이 위아래 두 각으로 나뉜다. 엇각의 크기는 서로 같으므로 ';
      const head = `다음 그림에서 ${lv('l')} ∥ ${lv('m')}일 때, `;
      if (n === 0) {
        const [a, b] = d.until(() => [5 * d.int(6, 11), 5 * d.int(7, 15)], ([p, q]) => p + q <= 125 && p + q !== 90 && p !== q);
        return N(head + `${angV('x')}의 크기는?`, a + b, { unit: '°', figure: bendFig(a, b, { left, p: deg(a), q: deg(b), k: '{x}' }).out(bendSay({ left }, `직선 l과 위쪽 선분 사이의 각이 ${a}°, 직선 m과 아래쪽 선분 사이의 각이 ${b}°이고, 꺾인 점에서 두 선분 사이의 각이 ∠x이다.`)),
          explain: aux + `위쪽 각은 ${a}°, 아래쪽 각은 ${b}°이다. ${angV('x')} = ${a}° + ${b}° = ${a + b}°이다.`, facts: { calc: [[`${a}+${b}`, 0]] } });
      }
      if (n === 1) {
        const [a, c] = d.until(() => [5 * d.int(6, 10), d.pick([90, 90, 100, 105, 110, 115, 120])], ([p, q]) => q - p >= 35 && q - p <= 80), b = c - a;
        return N(head + `${angV('x')}의 크기는?`, b, { unit: '°', figure: bendFig(a, b, { left, p: deg(a), q: '{x}', k: deg(c), kRight: c === 90 }).out(bendSay({ left }, `직선 l과 위쪽 선분 사이의 각이 ${a}°이고, 꺾인 점에서 두 선분 사이의 각${c === 90 ? '에 직각 표시가 있다(90°)' : `이 ${c}°이다`}. 직선 m과 아래쪽 선분 사이의 각이 ∠x이다.`)),
          explain: aux + `위쪽 각은 ${a}°, 아래쪽 각은 ${angV('x')}와 같다. ${a}° + ${angV('x')} = ${c}°에서 ${angV('x')} = ${b}°이다.`, facts: { calc: [[`${c}-${a}`, 0]], unseen: c === 90 ? [90] : [] } });
      }
      if (n === 2) {
        const [x, du, dv] = d.until(() => [5 * d.int(6, 8), 5 * d.int(-2, 2), 5 * d.int(-3, 4)], ([xx, u, v]) => u !== 0 && v !== 0 && xx + u >= 26 && xx + u <= 50 && 2 * xx + v >= 48 && 2 * xx + v <= 82 && 3 * xx + u + v !== 90 && 3 * xx + u + v <= 128), a = x + du, b = 2 * x + dv, c = a + b;
        const sg = (v) => (v > 0 ? `+ ${v}` : `− ${-v}`), e1 = `({x} ${sg(du)})°`, e2 = `(2{x} ${sg(dv)})°`;
        return N(head + `${lv('x')}의 값은?`, x, { figure: bendFig(a, b, { left, pad: 88, p: e1, pAt: [28 + wide(e1, 12) / 2, -10], q: e2, qAt: [28 + wide(e2, 12) / 2, 10], k: deg(c) }).out(bendSay({ left }, `직선 l과 위쪽 선분 사이의 각이 (x ${sg(du)})°, 직선 m과 아래쪽 선분 사이의 각이 (2x ${sg(dv)})°이고, 꺾인 점에서 두 선분 사이의 각이 ${c}°이다.`)),
          explain: aux + `(${lv('x')} ${sg(du)}) + (2${lv('x')} ${sg(dv)}) = ${c}이다. 3${lv('x')} = ${c - du - dv}에서 ${lv('x')} = ${x}이다.`, facts: { calc: [[`(${c}-(${du})-(${dv}))/3`, 0]], unseen: [3] } });
      }
      const [a, b] = d.until(() => [5 * d.int(6, 10), 5 * d.int(8, 14)], ([p, q]) => p + q <= 120 && p + q !== 90), out = 180 - a;
      return N(head + `${angV('x')}의 크기는?`, a + b, { unit: '°', figure: bendFig(a, b, { left, pOut: deg(out), q: deg(b), k: '{x}' }).out(bendSay({ left }, `직선 l과 위쪽 선분 사이의 각 가운데 꺾인 점의 반대쪽에 있는 큰 각이 ${out}°이다. 직선 m과 아래쪽 선분 사이의 각이 ${b}°이고, 꺾인 점에서 두 선분 사이의 각이 ∠x이다.`)),
        explain: `직선 ${lv('l')}과 위쪽 선분 사이의 각 가운데 꺾인 점 쪽의 각은 180° − ${out}° = ${a}°이다. ` + aux + `위쪽 각은 ${a}°, 아래쪽 각은 ${b}°이다. ${angV('x')} = ${a}° + ${b}° = ${a + b}°이다.`, facts: { calc: [[`180-${out}+${b}`, 0]], unseen: [180] } });
    }, { count: 4 }),
    T('para-test', '두 직선이 평행한지 가리기', '①66 ②71', (d) => {
      // 그림 넷: 직선 l 쪽의 각 하나와 직선 m 쪽의 각 하나. 평행하지 않은 그림은 적힌 각만큼 아래 직선을 기울여 그린다.
      const KIND = { same: [[0, 0], [1, 1], [2, 2], [3, 3]], alt: [[2, 0], [3, 1]], inner: [[3, 0], [2, 1]] }, tags = ['가', '나', '다', '라'];
      const specs = d.until(() => tags.map(() => { const kind = d.pick(['same', 'alt', 'inner']), par = d.bool(), t1 = d.pick([55, 60, 65, 70, 110, 115, 120, 125]); return { kind, par, t1, t2: par ? t1 : t1 + d.pick([-6, -5, -4, 4, 5, 6]), ks: d.pick(KIND[kind]) }; }),
        (list4) => { const k = list4.filter((s) => s.par).length; return k >= 1 && k <= 3 && new Set(list4.map((s) => s.kind)).size >= 2; });
      const rows = specs.map((s) => {
        const tilt = s.t1 - s.t2, S = para({ w: 92, gap: 44, tilt, pivot: [46, 0] }), [P, Q] = S.cross(46 + 22 / Math.tan(s.t1 * RAD), s.t1, 15), v1 = sizeAt(s.t1, s.ks[0], 0), v2 = sizeAt(s.t1, s.ks[1], tilt), same = sizeAt(s.t1, s.ks[0], tilt);
        const r1 = sector(s.t1, s.ks[0], 0), r2 = sector(s.t1, s.ks[1], tilt);
        S.angle(P, r1[0], r1[1], deg(v1), { r: 10 }).angle(Q, r2[0], r2[1], deg(v2), { r: 10 });
        const how = s.ks[0] === s.ks[1] ? '' : (s.ks[1] + 2) % 4 === s.ks[0] ? `(${v2}°인 각의 맞꼭지각)` : `(180° − ${v2}°)`;
        return { svg: S.out(`두 직선 l(위), m(아래)과 가로지르는 한 직선. 직선 l과의 교점의 ${SPOT[s.ks[0]]} 각이 ${v1}°, 직선 m과의 교점의 ${SPOT[s.ks[1]]} 각이 ${v2}°이다.`), par: s.par, why: `${v1}°인 각의 동위각의 크기는 ${same}°${how}이므로 ${s.par ? '평행하다' : '평행하지 않다'}.` };
      });
      return setQ(d, `다음 가운데 두 직선 ${lv('l')}, ${lv('m')}이 평행한 것을 모두 고른 것은?`, tags, rows.map((r) => r.par), { figure: tiles(rows.map((r, i) => [tags[i], r.svg])),
        explain: '동위각의 크기가 같으면 두 직선은 평행하다. ' + rows.map((r, i) => `${tags[i]}: ${r.why}`).join(' ') });
    }),
    T('para-fig-claims', '여덟 각의 크기와 두 직선의 평행', '①65 심45 ②58', (d) => {
      const lay = LAYS[0], a = d.pick([64, 70, 110, 116]), nameOf = ([row, k]) => lay[row][k], up = (k) => [0, k], dn = (k) => [1, k], par = (c) => c[1] % 2, A = (c) => angV(nameOf(c)), l = lv('l'), m = lv('m');
      const k1 = d.int(0, 3), kSame = d.pick([k1, (k1 + 2) % 4]), kDiff = d.pick([(k1 + 1) % 4, (k1 + 3) % 4]), k2 = d.int(0, 3), k3 = d.int(0, 3), k4 = d.int(0, 3);
      const rows = [
        { g: 1, ok: true, s: `${A(up(k1))} = ${A(dn(kSame))}이면 ${l} ∥ ${m}이다.` },
        { g: 1, ok: false, s: `${A(up(k2))} = ${A(up((k2 + 2) % 4))}이면 ${l} ∥ ${m}이다.`, why: `${A(up(k2))}${pt(nameOf(up(k2)), '과/와')} ${A(up((k2 + 2) % 4))}${pt(nameOf(up((k2 + 2) % 4)), '은/는')} 맞꼭지각이어서 두 직선이 평행하지 않아도 크기가 같다.` },
        { g: 2, ok: true, s: `${l} ∥ ${m}이면 ${A(up(k3))} = ${A(dn(d.pick([k3, (k3 + 2) % 4])))}이다.` },
        { g: 2, ok: false, s: `${l} ∥ ${m}이면 ${A(up(k3))} = ${A(dn((k3 + 1) % 4))}이다.`, why: `${l} ∥ ${m}이면 ${A(up(k3))}의 동위각 ${A(dn(k3))}${pt(nameOf(dn(k3)), '과/와')} ${A(dn((k3 + 1) % 4))}${pt(nameOf(dn((k3 + 1) % 4)), '이/가')} 평각을 이루므로 ${A(up(k3))} + ${A(dn((k3 + 1) % 4))} = 180°이다.` },
        { g: 3, ok: true, s: `${l} ∥ ${m}이면 ${A(up(k4))} + ${A(dn(d.pick([(k4 + 1) % 4, (k4 + 3) % 4])))} = 180°이다.` },
        { g: 3, ok: false, s: `${l} ∥ ${m}이면 ${A(up(k4))} + ${A(dn((k4 + 2) % 4))} = 180°이다.`, why: `${l} ∥ ${m}이면 ${A(up(k4))}의 동위각 ${A(dn(k4))}${pt(nameOf(dn(k4)), '과/와')} ${A(dn((k4 + 2) % 4))}${pt(nameOf(dn((k4 + 2) % 4)), '이/가')} 맞꼭지각이므로 ${A(up(k4))} = ${A(dn((k4 + 2) % 4))}이다.` },
        { g: 4, ok: true, s: `${A(up(k1))} + ${A(dn(kDiff))} = 180°이면 ${l} ∥ ${m}이다.` }
      ];
      // 따로 다시 따진다: 평행할 때 자리의 짝이 같으면 크기가 같고 다르면 합이 180°이다. 거꾸로는 서로 다른 교점의 각일 때만 성립한다.
      if (par(up(k1)) !== par(dn(kSame)) || par(up(k1)) === par(dn(kDiff))) throw new Error('자리 셈이 어긋났다');
      return sayQ(d, `다음 그림과 같이 두 직선 ${l}, ${m}이 다른 한 직선과 만날 때, 다음 가운데 옳지 않은 것은?`, rows, false, { figure: eightFig(lay, a, d.pick([-6, 6])) });
    }),
    T('para-make', '두 직선이 평행하도록 하는 값', '②73', (d) => {
      const S = sheet(), sum = d.bool();
      // 가로 직선 하나를 두 직선 l(왼쪽), m(오른쪽)이 가로지른다. 답일 때 두 직선이 평행하므로 평행하게 그린다.
      const [x, A, e1, e2, k2, why, calc, unseen] = sum
        ? (() => { const [k, c, xx] = d.pick([[2, 30, 50], [2, 45, 45], [2, 60, 40], [3, 20, 40], [3, 40, 35]]); return [xx, xx, '{x}°', `(${k}{x} + ${c})°`, 1, `직선 ${lv('m')} 쪽에서 ${lv('x')}°인 각과 같은 자리에 있는 각의 크기는 180° − (${k}${lv('x')} + ${c})°이다. ${lv('x')} = 180 − (${k}${lv('x')} + ${c})에서 ${k + 1}${lv('x')} = ${180 - c}, ${lv('x')} = ${xx}이다.`, `(180-${c})/(${k}+1)`, [180, 1]]; })()
        : (() => { const [p, xx, v] = d.until(() => [d.pick([2, 3]), d.int(20, 45), 5 * d.int(2, 8)], ([pp, q, vv]) => q + vv >= 50 && q + vv <= 78 && (pp - 1) * q - vv >= 5), u = (p - 1) * xx - v; return [xx, xx + v, `(${p}{x} − ${u})°`, `({x} + ${v})°`, 0, `${p}${lv('x')} − ${u} = ${lv('x')} + ${v}에서 ${p - 1 === 1 ? '' : p - 1}${lv('x')} = ${u + v}, ${lv('x')} = ${xx}이다.`, `(${u}+${v})/(${p}-1)`, [1]]; })();
      const L = [52, 0], Mp = [sum ? 180 : 158, 0];
      S.seg([0, 0], [sum ? 240 : 256, 0]).seg(pol(L, A, 52), pol(L, A + 180, 34)).seg(pol(Mp, A, 52), pol(Mp, A + 180, 34)).text(pol(L, A, 62), '{l}').text(pol(Mp, A, 62), '{m}');
      const r1 = sector(A, 0), r2 = sector(A, k2);
      S.angle(L, r1[0], r1[1], e1, { r: 14, at: [24 + wide(e1, 12) / 2, 9] }).angle(Mp, r2[0], r2[1], e2, { r: 14, at: [(k2 === 1 ? -1 : 1) * (24 + wide(e2, 12) / 2), 9] });
      const plain = (s) => s.replace(/[{}]/g, '');
      return N(`다음 그림에서 두 직선 ${lv('l')}, ${lv('m')}이 평행하도록 하는 ${lv('x')}의 값은?`, x, {
        figure: S.out(`가로 직선 하나를 비스듬한 두 직선 l(왼쪽), m(오른쪽)이 가로지른다. 직선 l과의 교점의 오른쪽 위 각이 ${plain(e1)}, 직선 m과의 교점의 ${SPOT[k2]} 각이 ${plain(e2)}이다.`),
        explain: '동위각의 크기가 같으면 두 직선은 평행하다. ' + why, facts: { calc: [[calc, 0]], unseen } });
    })
  ]);

  Object.assign(K, { bendFig, bendSay, eightFig, LAYS, sameSpot, alternate, REL, RELS, sortOut, solidFig, cleanPick, relWord });
})(typeof window !== 'undefined' ? window : globalThis);

// ── 다시 실은 꼴(기본) ─────────────────────────────────────────
// 처음 지을 때 「그림 모름」「공간 가르기」「거울 반사」로 뺀 꼴 가운데, 풀이의 얼개로 그림이 정해지고 두 단계 안팎에서 풀리는 것을 묶음 끝에 붙였다.
//  - space-three-planes(심43): 서로 수직인 세 평면이 나누는 공간.
//  - para-check-then(①68): 두 직선이 평행하다는 말이 없다. 한 직선 쪽의 엇각(동위각)이 같음을 보고 평행함을 안 다음, 다른 직선 쪽에서 평행선의 성질을 쓴다.
//  - para-shape(①73 ②66 심55): 평행선에 걸친 정삼각형·정사각형. 꺾인 각의 크기를 도형에서 읽어 낸다(60°, 90°).
//  - para-mirror(①79): 평행한 두 거울. 반사의 규칙은 문제 글이 알려 준다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { N } = B.kit;
  const { V } = B.kit.mid;
  const K = B.kit.m721;
  const { T, angV, deg, RAD, pol, wide, para, sector, sizeAt, SPOT, bendFig } = K;
  const lv = (c) => V(c);

  B.addTypes('7-2-1', 'space', [
    T('space-three-planes', '서로 수직인 세 평면이 나누는 공간', '심43', (d) => {
      const [p, q, r] = d.pick([['P', 'Q', 'R'], ['Q', 'R', 'P'], ['R', 'P', 'Q']]);
      return N(`공간에서 서로 다른 세 평면 ${lv('P')}, ${lv('Q')}, ${lv('R')}가 ${lv(p)} ⊥ ${lv(q)}, ${lv(q)} ⊥ ${lv(r)}, ${lv(r)} ⊥ ${lv(p)}를 만족시킬 때, 공간은 이 세 평면에 의하여 몇 부분으로 나누어지는가?`, 8, { unit: '부분',
        explain: `서로 수직인 두 평면 ${lv(p)}, ${lv(q)}는 한 직선에서 만나 공간을 4부분으로 나눈다. 평면 ${lv(r)}는 두 평면에 모두 수직이므로 이 4부분을 모두 둘로 나눈다. 공간은 4 × 2 = 8(부분)으로 나누어진다. 교실의 바닥과 이웃한 두 벽을 넓힌 세 평면을 생각하면 된다.`,
        facts: { calc: [['4*2', 0]], unseen: [4, 2] } });
    })
  ]);

  B.addTypes('7-2-1', 'para', [
    T('para-check-then', '두 직선이 평행한지 가린 다음 각 구하기', '①68', (d) => {
      const c = d.until(() => {
        const ap = d.pick([55, 60, 65, 70, 110, 115, 120, 125]), aq = d.pick([80, 85, 95, 100]), kind = d.pick(['엇각', '동위각']), same = d.int(0, 3);
        const [k1, k2] = kind === '엇각' ? d.pick([[2, 0], [3, 1]]) : [same, same], kg = d.int(0, 3), kx = d.int(0, 3);
        return { ap, aq, kind, k1, k2, kg, kx, v: sizeAt(aq, k1), g: sizeAt(ap, kg), x: sizeAt(ap, kx) };
      }, (o) => o.g !== o.v && 180 - o.g !== o.v);
      const { ap, aq, kind, k1, k2, kg, kx, v, g, x } = c, gap = 76, S = para({ w: 250, gap });
      const [P1, Q1] = S.cross(72 + gap / 2 / Math.tan(ap * RAD), ap, 22), [P2, Q2] = S.cross(180 + gap / 2 / Math.tan(aq * RAD), aq, 22);
      S.text(pol(P1, ap, 33), '{p}').text(pol(P2, aq, 33), '{q}');
      const mark = (at, a, k, t) => { const r = sector(a, k); S.angle(at, r[0], r[1], t, r[1] - r[0] > 76 ? { r: 13, d: 30 } : { r: 13 }); };
      mark(P2, aq, k1, deg(v)); mark(Q2, aq, k2, deg(v)); mark(P1, ap, kg, deg(g)); mark(Q1, ap, kx, '{x}');
      const tail = kx === kg ? '이므로' : (kx + 2) % 4 === kg ? '의 맞꼭지각이므로' : `과 합하여 평각을 이루므로 180° − ${g}° =`;
      return N(`다음 그림과 같이 두 직선 ${lv('l')}, ${lv('m')}이 두 직선 ${lv('p')}, ${lv('q')}와 만날 때, ${angV('x')}의 크기는?`, x, { unit: '°',
        figure: S.out(`두 직선 l(위), m(아래)을 두 직선 p(왼쪽), q(오른쪽)가 가로지른다. 두 직선 l, q의 교점의 ${SPOT[k1]} 각이 ${v}°, 두 직선 m, q의 교점의 ${SPOT[k2]} 각이 ${v}°이다. 두 직선 l, p의 교점의 ${SPOT[kg]} 각이 ${g}°, 두 직선 m, p의 교점의 ${SPOT[kx]} 각이 ∠x이다.`),
        explain: `두 직선 ${lv('l')}, ${lv('m')}이 직선 ${lv('q')}와 만나서 생기는 ${kind}의 크기가 ${v}°로 같으므로 ${lv('l')} ∥ ${lv('m')}이다. 평행한 두 직선이 직선 ${lv('p')}와 만나서 생기는 동위각의 크기는 서로 같다. ${angV('x')}는 ${g}°인 각의 동위각${tail} ${x}°이다.`,
        facts: { calc: [[x === g ? String(g) : `180-${g}`, 0]], unseen: [180] } });
    }),
    T('para-shape', '평행선에 걸친 정삼각형과 정사각형', '①73 ②66 심55', (d, n) => {
      const left = d.bool(), side = left ? '왼쪽' : '오른쪽', head = `다음 그림에서 ${lv('l')} ∥ ${lv('m')}이고 `;
      const aux = '점 B를 지나고 두 직선에 평행한 직선을 그으면 엇각의 크기가 같으므로 ';
      const split = (a, b) => Math.sin(a * RAD) / (Math.sin(a * RAD) + Math.sin(b * RAD));   // 꺾인 점의 높이: 두 변의 길이가 같아지게
      if (n === 0) {
        const a = d.pick([20, 25, 35, 40]), b = 60 - a, top = d.bool(), given = top ? b : a, ans = 60 - given;
        const S = bendFig(a, b, { left, split: split(a, b), p: top ? '{x}' : deg(a), q: top ? deg(b) : '{x}', names: ['A', 'B', 'C'] });
        S.seg(S.P, S.Q);
        return N(head + `삼각형 ABC가 정삼각형일 때, ${angV('x')}의 크기는?`, ans, { unit: '°',
          figure: S.out(`평행한 두 직선 l(위), m(아래) 사이에 정삼각형 ABC가 걸쳐 있다. 꼭짓점 A는 직선 l 위에, 꼭짓점 C는 직선 m 위에 있고, 꼭짓점 B는 두 직선 사이에서 두 점 A, C보다 ${side}에 있다. 직선 l과 변 AB 사이의 각이 ${top ? '∠x' : a + '°'}, 직선 m과 변 BC 사이의 각이 ${top ? b + '°' : '∠x'}이다.`),
          explain: aux + `∠ABC = ${given}° + ${angV('x')}이다. 정삼각형의 한 각의 크기는 60°이므로 ${given}° + ${angV('x')} = 60°에서 ${angV('x')} = ${ans}°이다.`,
          facts: { calc: [[`60-${given}`, 0]], unseen: [60] } });
      }
      const [x, p, q, u, v] = d.until(() => { const xx = d.int(8, 24), pp = d.pick([2, 3]), qq = d.pick([1, 2]), uu = 5 * d.int(-5, 5); return [xx, pp, qq, uu, 90 - (pp + qq) * xx - uu]; },
        ([xx, pp, qq, uu, vv]) => pp !== qq && uu !== 0 && vv !== 0 && vv % 5 === 0 && Math.abs(vv) <= 30 && pp * xx + uu >= 28 && pp * xx + uu <= 62);
      const a = p * x + u, b = q * x + v, sg = (k) => (k > 0 ? `+ ${k}` : `− ${-k}`), co = (k) => (k === 1 ? '' : k), e1 = `(${p}{x} ${sg(u)})°`, e2 = `(${co(q)}{x} ${sg(v)})°`, plain = (s) => s.replace(/[{}]/g, '');
      const S = bendFig(a, b, { left, split: split(a, b), pad: 88, p: e1, pAt: [28 + wide(e1, 12) / 2, -10], q: e2, qAt: [28 + wide(e2, 12) / 2, 10], names: ['A', 'B', 'C'] });
      const Dp = [S.P[0] + S.Q[0] - S.K[0], S.P[1] + S.Q[1] - S.K[1]];
      S.seg(S.P, Dp).seg(Dp, S.Q).dot(Dp).name(Dp, 'D', left ? 0 : 180, 12);
      return N(head + `사각형 ABCD가 정사각형일 때, ${lv('x')}의 값은?`, x, {
        figure: S.out(`평행한 두 직선 l(위), m(아래) 사이에 정사각형 ABCD가 비스듬히 걸쳐 있다. 꼭짓점 A는 직선 l 위에, 꼭짓점 C는 직선 m 위에 있고, 꼭짓점 B는 두 직선 사이에서 두 점 A, C보다 ${side}에, 꼭짓점 D는 그 반대쪽에 있다. 직선 l과 변 AB 사이의 각이 ${plain(e1)}, 직선 m과 변 BC 사이의 각이 ${plain(e2)}이다.`),
        explain: aux + `∠ABC = (${p}${lv('x')} ${sg(u)})° + (${co(q)}${lv('x')} ${sg(v)})°이다. 정사각형의 한 각의 크기는 90°이므로 (${p}${lv('x')} ${sg(u)}) + (${co(q)}${lv('x')} ${sg(v)}) = 90이다. ${p + q}${lv('x')} = ${90 - u - v}에서 ${lv('x')} = ${x}이다.`,
        facts: { calc: [[`(90-(${u})-(${v}))/(${p}+${q})`, 0]], unseen: [90, 1] } });
    }, { count: 2 }),
    T('para-mirror', '평행한 두 거울 사이에서 반사되는 빛', '①79', (d) => {
      const t = d.until(() => d.int(32, 54), (k) => k !== 45), x = 180 - 2 * t, gap = 78, back = 42, on = 48;
      const px = back * Math.cos(t * RAD) + 26, qx = px + gap / Math.tan(t * RAD), w = qx + on * Math.cos(t * RAD) + 34, S = para({ w, gap, names: ['', ''] });
      const P = [px, gap], Q = [qx, 0], from = pol(P, 180 + t, back), to = pol(Q, t, on);
      const head = (tip, dir) => S.poly([tip, pol(tip, dir + 157, 8), pol(tip, dir - 157, 8)], 'fill:#1f2933;stroke:none');
      S.seg(from, P).seg(P, Q).seg(Q, to);
      head(pol(from, t, back * 0.62), t); head(pol(P, 360 - t, gap / Math.sin(t * RAD) * 0.56), 360 - t); head(to, t);
      S.angle(P, 360 - t, 360, deg(t)).angle(Q, t, 180 - t, '{x}');
      S.text([w - 18, gap + 12], '거울').text([w - 18, -12], '거울');
      return N(`빛이 거울에 반사될 때, 들어가는 빛이 거울과 이루는 각과 반사되어 나오는 빛이 거울과 이루는 각의 크기는 서로 같다. 다음 그림과 같이 서로 평행한 두 거울 사이에서 빛이 반사될 때, ${angV('x')}의 크기는?`, x, { unit: '°',
        figure: S.out(`서로 평행한 두 거울(위, 아래) 사이에서 빛이 지나간 길. 빛이 왼쪽 아래에서 올라와 위쪽 거울에서 반사되어 오른쪽 아래로 내려가고, 아래쪽 거울에서 다시 반사되어 오른쪽 위로 올라간다. 위쪽 거울에서 반사되어 나오는 빛이 위쪽 거울과 이루는 각이 ${t}°이다. 아래쪽 거울 위의 점에서, 들어오는 빛과 반사되어 나가는 빛 사이의 각이 ∠x이다.`),
        explain: `두 거울이 평행하므로 아래쪽 거울로 들어오는 빛이 아래쪽 거울과 이루는 각은 ${t}°인 각의 엇각이어서 ${t}°이다. 반사되어 나가는 빛이 아래쪽 거울과 이루는 각도 ${t}°이다. 아래쪽 거울 위의 점에서 세 각이 평각을 이루므로 ${angV('x')} = 180° − ${t}° − ${t}° = ${x}°이다.`,
        facts: { calc: [[`180-${t}-${t}`, 0]], unseen: [180] } });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
