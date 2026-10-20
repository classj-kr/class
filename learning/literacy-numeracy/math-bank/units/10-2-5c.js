// 고등학교 1학년 2학기 5단원 명제 — 실력 문제.
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 「제곱의 합이 0」의 부정을 「모두 다르다」로 읽는다(바르게는 「모두 같지는 않다」). 「적어도 하나」와 「모두」의 부정을 뒤바꾼다.
//  - 범위 안의 「어떤 x 에 대하여 f(x) ≥ 0」을 「최솟값 ≥ 0」으로 푼다(바르게는 최댓값 ≥ 0).
//  - 「자음이면 짝수」를 확인하려고 짝수 카드를 뒤집고 홀수 카드는 그냥 둔다(대우 「홀수이면 모음」을 잊는다).
//  - 충분조건·필요조건의 방향을 거꾸로 잡는다. ∼p 의 진리집합에서 경계의 등호를 빠뜨린다.
//  - 산술평균과 기하평균의 관계를 두 번 써서 곱하고, 두 등호가 함께 성립하는지 보지 않는다.
//  - 역이 참인 조건(Q ⊂ P)에서 진리집합이 공집합이 되는 경우를 따지지 않는다.
// 실력에 둔 것: ① 뜻을 정확히 대야 풀리는 함정 — 제곱의 합의 부정, 범위 안의 「어떤」, 카드 뒤집기, 절댓값·복소수 조건 셋, 산술·기하 두 번 쓴 풀이,
//   ∼p 가 q 이기 위한 필요조건(심1·심4), 판별식이 완전제곱인 「모든」(심2) / ② 세 단계 넘게 잇는 것 — 순서쌍 세기, 진술 퍼즐, 상수에 따라 바뀌는 진리집합,
//   역의 참·거짓으로 정하는 상수, 모든 실수 x, y 에 대한 부등식, 직육면체 대각선(심5).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines, N, M, C, F, inline } = B.kit;
  const { MINUS, Q, nb, V, sup, poly, gcd, range, rt, radText, sqParts } = B.kit.mid;
  const K = B.kit.m1025, KB = B.kit.m1025b;
  const { STD, H, sq, X, Yv, Av, Bv, Kv, Nv, pV, qV, rV, PS, QS, US, NOT, TO, IMP, num, numH, par, jn, quo, cond, roster, polyH, linH, absH, ej, slots, numQ,
    GA, bogi, setsQ, oneQ, OPH, at, iv, pr, OR, AND, xr, xpoly, cH, cF, cN, RX, R2, holdsAll, nice, implies, sameSet, relOf, showE, IFF, INK, BLUE, svg, word, tv } = K;
  const { proofBox, REL_SHORT } = KB;
  const Zv = V('z');

  // 카드 그림: 앞면에 적힌 글
  function cardsFig(faces) {
    const w = 52, h = 70, gap = 14, W = faces.length * (w + gap) - gap + 12;
    const body = faces.map((f, i) => { const x = 6 + i * (w + gap); return `<rect x="${x}" y="6" width="${w}" height="${h}" rx="7" style="fill:#fff;stroke:${INK};stroke-width:1.6"/>` + word(x + w / 2, 6 + h / 2 + 10, f, { size: 28, weight: 700, color: /\d/.test(f) ? '#b42318' : BLUE }); }).join('');
    return svg(W, h + 12, `카드 ${faces.length}장: ${faces.join(', ')}`, body);
  }
  const VOWEL = ['A', 'E', 'I', 'O', 'U'], CONS = ['B', 'D', 'G', 'K', 'M', 'R', 'S', 'T'];

  const hardTypes = [
    H('hard-negsquares', '식으로 된 조건의 부정을 말로 풀기', '①9', (d) => {
      const T3 = (() => { const out = [], vs = range(-2, 2); for (const x of vs) for (const y of vs) for (const z of vs) out.push({ x, y, z }); return out; })();
      const FORMS = [
        [`(${X} − ${Yv})${sup(2)} + (${Yv} − ${Zv})${sup(2)} + (${Zv} − ${X})${sup(2)} = 0`, (e) => (e.x - e.y) ** 2 + (e.y - e.z) ** 2 + (e.z - e.x) ** 2 === 0],
        [`|${X} − ${Yv}| + |${Yv} − ${Zv}| = 0`, (e) => Math.abs(e.x - e.y) + Math.abs(e.y - e.z) === 0],
        [`${sq(X)} + ${sq(Yv)} + ${sq(Zv)} = 0`, (e) => e.x * e.x + e.y * e.y + e.z * e.z === 0],
        [`(${X} − ${Yv})(${Yv} − ${Zv})(${Zv} − ${X}) = 0`, (e) => (e.x - e.y) * (e.y - e.z) * (e.z - e.x) === 0],
        [`${X}${Yv}${Zv} = 0`, (e) => e.x * e.y * e.z === 0]
      ];
      const OPTS = [
        [`${X}, ${Yv}, ${Zv}는 모두 0이 아니다.`, (e) => e.x !== 0 && e.y !== 0 && e.z !== 0], [`${X}, ${Yv}, ${Zv}는 모두 서로 다른 수이다.`, (e) => e.x !== e.y && e.y !== e.z && e.z !== e.x],
        [`${X}, ${Yv}, ${Zv} 중 적어도 하나는 0이다.`, (e) => e.x * e.y * e.z === 0], [`${X}, ${Yv}, ${Zv} 중 적어도 하나는 0이 아니다.`, (e) => !(e.x === 0 && e.y === 0 && e.z === 0)],
        [`${X}, ${Yv}, ${Zv}가 모두 같지는 않다.`, (e) => !(e.x === e.y && e.y === e.z)], [`${X}, ${Yv}, ${Zv}는 모두 같은 수이다.`, (e) => e.x === e.y && e.y === e.z]
      ];
      const [h, f] = d.pick(FORMS), notF = (e) => !f(e);
      const right = OPTS.filter(([, g]) => T3.every((e) => g(e) === notF(e)));
      if (right.length !== 1) throw new Error('바른 설명이 하나가 아니다');
      const rows = [{ h: right[0][0], ok: true }].concat(d.shuffle(OPTS.filter((o) => o !== right[0])).slice(0, 4).map(([oh]) => ({ h: oh, ok: false })));
      return oneQ(d, `세 실수 ${X}, ${Yv}, ${Zv}에 대한 조건 ${cond('p', h)}의 부정이 참이 되도록 하는 ${X}, ${Yv}, ${Zv}에 대한 설명으로 옳은 것은?`, rows, true, {
        explain: `${ej(quo(h), '은/는')} ${right[0][0] === OPTS[4][0] ? `${X} = ${Yv} = ${Zv}일 때` : right[0][0] === OPTS[3][0] ? `${X} = ${Yv} = ${Zv} = 0일 때` : right[0][0] === OPTS[1][0] ? `${X}, ${Yv}, ${Zv} 가운데 같은 두 수가 있을 때` : `${X}, ${Yv}, ${Zv} 가운데 0이 있을 때`}만 성립한다. 따라서 그 부정은 「${right[0][0].replace(/\.$/, '')}」이다.`,
        rule: 'neg-squares'
      });
    }, { standard: STD.prop }),
    H('hard-somemax', '범위 안의 「어떤 x」에 대한 명제가 참이 되는 상수', '①15', (d) => {
      const { h, d1, d2 } = d.until(() => ({ h: d.int(2, 5), d1: d.int(1, 4), d2: d.int(1, 4) }), (t) => t.d1 !== t.d2);
      const s = h - d1, t = h + d2, far = d2 > d1 ? t : s, ans = 2 * h * far - far * far;
      return numQ(`명제 ${quo(`${num(s)} ≤ ${X} ≤ ${t}인 어떤 실수 ${X}에 대하여 ${sq(X)} − ${2 * h}${X} + ${Nv} ≥ 0이다.`)}가 참이 되도록 하는 정수 ${Nv}의 최솟값은?`, ans, {
        calc: `${2 * h}*${jn(far)}-${jn(far)}*${jn(far)}`, rule: 'some-max',
        explain: `${V('f')}(${X}) = ${sq(X)} − ${2 * h}${X} + ${Nv} = (${linH(1, -h)})${sup(2)} + ${Nv} − ${h * h}라고 하자. 「어떤 ${X}」에 대하여 성립하려면 ${num(s)} ≤ ${X} ≤ ${t}에서 ${V('f')}(${X})의 최댓값이 0 이상이어야 한다. 꼭짓점 ${X} = ${h}에서 더 먼 끝 ${X} = ${num(far)}에서 최댓값 ${ej(`${V('f')}(${num(far)}) = ${Nv}${ans < 0 ? ` + ${-ans}` : ` − ${ans}`}`, '을/를')} 가지므로 ${Nv} ≥ ${num(ans)}이다. (최솟값으로 따지면 답이 달라진다.)`
      });
    }, { standard: STD.prop }),
    H('hard-pairs', '「모든」·「어떤」이 걸린 두 집합의 순서쌍 세기', '①17', (d) => {
      const FORMS = [[3, [1, -3, 0]], [4, [1, -5, 4]], [4, [1, -4, 0]], [3, [1, -4, 3]], [4, [1, -6, 5]]];
      const [Nn, [a2, a1, a0]] = d.pick(FORMS), U = range(1, Nn), good = U.filter((x) => a2 * x * x + a1 * x + a0 < 0);
      const subsets = []; for (let m = 1; m < (1 << Nn); m += 1) subsets.push(U.filter((_, i) => (m >> i) & 1));
      let count = 0;
      for (const A of subsets) for (const Bs of subsets) if (A.every((x) => good.includes(x)) && Bs.some((x) => A.includes(x))) count += 1;
      const per = subsets.filter((A) => A.every((x) => good.includes(x))).map((A) => [A, subsets.filter((Bs) => Bs.some((x) => A.includes(x))).length]);
      const A0 = V('A'), B0 = V('B');
      return numQ(`전체집합 ${US} = ${roster(U)}의 공집합이 아닌 두 부분집합 ${A0}, ${B0}에 대하여 두 명제 ${quo(`집합 ${A0}의 모든 원소 ${X}에 대하여 ${polyH(a2, a1, a0)} &lt; 0이다.`)}, ${quo(`집합 ${B0}의 어떤 원소 ${X}에 대하여 ${X} ∈ ${A0}이다.`)}가 모두 참이 되도록 하는 두 집합 ${A0}, ${B0}의 순서쌍 (${A0}, ${B0})의 개수는?`, count, {
        signed: false, check: ['pairs', Nn, a2, a1, a0], rule: 'pairs',
        explain: `${polyH(a2, a1, a0)} &lt; 0을 만족시키는 원소는 ${roster(good)}이므로 ${A0}는 이 집합의 공집합이 아닌 부분집합이다. ${per.map(([A, k]) => `${A0} = ${roster(A)}일 때 ${A0}와 만나는 ${B0}는 ${k}개`).join(', ')}이므로 모두 ${count}개이다.`
      });
    }, { standard: STD.prop }),
    H('hard-cards', '명제를 확인하려고 반드시 뒤집을 카드', '①37', (d) => {
      const RULES = [
        { say: '한 면에 알파벳 자음이 적혀 있으면 다른 면에는 짝수가 적혀 있다', front: 'letter', P: (c) => CONS.includes(c), Qf: (n) => n % 2 === 0 },
        { say: '한 면에 알파벳 모음이 적혀 있으면 다른 면에는 홀수가 적혀 있다', front: 'letter', P: (c) => VOWEL.includes(c), Qf: (n) => n % 2 === 1 },
        { say: '한 면에 짝수가 적혀 있으면 다른 면에는 알파벳 자음이 적혀 있다', front: 'number', P: (n) => n % 2 === 0, Qf: (c) => CONS.includes(c) },
        { say: '한 면에 홀수가 적혀 있으면 다른 면에는 알파벳 모음이 적혀 있다', front: 'number', P: (n) => n % 2 === 1, Qf: (c) => VOWEL.includes(c) }
      ];
      const rule = d.pick(RULES), faces = d.shuffle([d.pick(CONS), d.pick(VOWEL), String(2 * d.int(1, 4)), String(2 * d.int(0, 4) + 1)]);
      // 뒤집어야 하는 카드: 보이는 면이 가정을 만족시키거나(뒷면이 결론을 어길 수 있다), 결론을 어기는 면(뒷면이 가정을 만족시킬 수 있다)
      const must = faces.filter((f) => { const isNum = /\d/.test(f), v = isNum ? Number(f) : f; return rule.front === (isNum ? 'number' : 'letter') ? rule.P(v) : !rule.Qf(v); });
      const key = (s) => s.slice().sort().join(', ');
      const combos = []; for (let i = 0; i < 4; i += 1) for (let j = i + 1; j < 4; j += 1) combos.push([faces[i], faces[j]]);
      const opts = [must].concat(d.shuffle(combos.filter((c) => key(c) !== key(must)).concat(faces.map((f) => [f]))).slice(0, 4));
      const order = (s) => faces.filter((f) => s.includes(f));
      return oneQ(d, `다음 그림과 같이 한 면에는 알파벳이, 다른 면에는 자연수가 적혀 있는 카드 4장이 놓여 있다. 명제 ${quo(`카드의 ${rule.say}.`)}가 참인지 확인하기 위하여 반드시 뒤집어 보아야 하는 카드만을 모두 고른 것은?`, opts.map((s) => ({ h: order(s).join(', '), ok: key(s) === key(must) })), true, {
        figure: cardsFig(faces), rule: 'cards',
        explain: `가정을 만족시키는 면이 보이는 카드는 뒷면이 결론을 만족시키는지 보아야 하고, 대우에 따라 결론을 만족시키지 않는 면이 보이는 카드도 뒷면을 보아야 한다. 따라서 ${order(must).join(', ')}이다. 나머지 카드는 어떤 면이 나와도 명제에 어긋나지 않는다.`
      });
    }, { standard: STD.conv }),
    H('hard-liar', '진술 가운데 하나만 참(거짓)일 때 — 누가 범인인가', '①38', (d, n) => {
      const names = ['A', 'B', 'C', 'D'], role = d.pick(['범인', '회장', '반장']), wantTrue = n === 0;
      const g = d.until(() => {
        // 진술의 꼴: self(나는 아니다), is(누가 ~이다), not(누가 ~가 아니다), liar(누구의 말은 거짓이다)
        const st = names.map((who, i) => {
          const kind = d.pick(['self', 'is', 'is', 'not', 'liar']), other = d.pick(names.filter((x) => x !== who));
          return { who, kind, other };
        });
        if (st.filter((s) => s.kind === 'liar').length > 1 || st.some((s) => s.kind === 'liar' && st[names.indexOf(s.other)].kind === 'liar')) return null;
        const truthAll = (cul) => { const base = st.map((s) => (s.kind === 'self' ? s.who !== cul : s.kind === 'is' ? s.other === cul : s.kind === 'not' ? s.other !== cul : null)); return base.map((t, i) => (t === null ? !base[names.indexOf(st[i].other)] : t)); };
        const sols = names.filter((cul) => truthAll(cul).filter(Boolean).length === (wantTrue ? 1 : 3));
        return { st, sols, truthAll };
      }, (t) => t && t.sols.length === 1);
      const say = (s) => (s.kind === 'self' ? `나는 ${role}${josa(role, '이/가').slice(role.length)} 아니다.` : s.kind === 'is' ? `${s.other}가 ${role}이다.` : s.kind === 'not' ? `${s.other}는 ${role}${josa(role, '이/가').slice(role.length)} 아니다.` : `${s.other}의 말은 거짓이다.`);
      const fig = lines(g.st.map((s) => `<b>${s.who}</b>: ${say(s)}`));
      const cul = g.sols[0], tt = g.truthAll(cul);
      return oneQ(d, `네 학생 A, B, C, D가 다음과 같이 말하였다. ${role}${josa(role, '은/는').slice(role.length)} 한 명뿐이고 네 학생 가운데 ${wantTrue ? '한 학생의 말만 참' : '한 학생의 말만 거짓'}일 때, ${role}${josa(role, '은/는').slice(role.length)} 누구인가?`, names.map((x) => ({ h: x, ok: x === cul })), true, {
        keep: true, figure: fig, rule: wantTrue ? 'liar-one-true' : 'liar-one-false',
        explain: `A, B, C, D가 각각 ${role}이라고 가정하고 네 말의 참, 거짓을 따져 보면 조건에 맞는 것은 ${cul}가 ${role}일 때뿐이다. 이때 참인 말은 ${names.filter((_, i) => tt[i]).join(', ')}의 말이다.`
      });
    }, { count: 2, standard: STD.conv }),
    H('hard-threeconds', '절댓값·복소수가 든 조건의 판단(빈칸 셋)', '②5', (d) => {
      const P = (h, f) => pr(h, '', f), ab = R2.ab, i = '<i class="mb-var">i</i>';
      const POOL = [
        [P(`${Av} ≥ 1 또는 ${Bv} ≥ 1`, (e) => e.a >= 1 || e.b >= 1), P(`${Av} + ${Bv} ≥ 2`, (e) => e.a + e.b >= 2)],
        [P(`${Av}${Bv} &gt; 0`, (e) => e.a * e.b > 0), P(`|${Av} + ${Bv}| = |${Av}| + |${Bv}|`, (e) => Math.abs(e.a + e.b) === Math.abs(e.a) + Math.abs(e.b))],
        [P(`${Av}${sup(2)} + ${Bv}${sup(2)} = 0`, (e) => e.a * e.a + e.b * e.b === 0), P(`${Av} + ${Bv}${i} = 0`, (e) => e.a === 0 && e.b === 0)],
        [P(`${Av} &gt; 1이고 ${Bv} &gt; 1`, (e) => e.a > 1 && e.b > 1), P(`${Av} + ${Bv} &gt; 2`, (e) => e.a + e.b > 2)],
        [P(`${Av}${Bv} ≥ 0`, (e) => e.a * e.b >= 0), P(`|${Av} + ${Bv}| = |${Av}| + |${Bv}|`, (e) => Math.abs(e.a + e.b) === Math.abs(e.a) + Math.abs(e.b))],
        [P(`${Av} = 0`, (e) => e.a === 0), P(`${Av}${Bv} = 0`, (e) => e.a * e.b === 0)],
        [P(`${Av}${sup(2)} = ${Bv}${sup(2)}`, (e) => e.a * e.a === e.b * e.b), P(`${Av} = ${Bv}`, (e) => e.a === e.b)],
        [P(`${Av} + ${Bv}${i} = 1 + ${i}`, (e) => e.a === 1 && e.b === 1), P(`${Av}${Bv} = 1`, (e) => e.a * e.b === 1)]
      ];
      const picked = d.until(() => d.shuffle(POOL).slice(0, 3).map(([p, q]) => ({ p, q, rel: relOf(p, q, ab) })), (list) => new Set(list.map((t) => t.rel)).size === 3 && list.every((t) => t.rel !== 'none'));
      const WORD = { suff: '충분', nec: '필요', iff: '필요충분' }, right = picked.map((t) => WORD[t.rel]);
      const perms = [['필요', '충분', '필요충분'], ['충분', '필요', '필요충분'], ['필요충분', '충분', '필요'], ['필요', '필요충분', '충분'], ['충분', '필요충분', '필요'], ['필요충분', '필요', '충분']];
      const rows = [{ h: right.join(', '), ok: true }].concat(d.shuffle(perms.filter((p) => p.join() !== right.join())).slice(0, 4).map((p) => ({ h: p.join(', '), ok: false })));
      const fig = lines(picked.map((t, k) => `(${['ⅰ', 'ⅱ', 'ⅲ'][k]}) ${ej(quo(t.p.h), '은/는')} ${quo(t.q.h)}이기 위한 <span class="mb-box">${['㈎', '㈏', '㈐'][k]}</span>조건이다.`));
      const useI = picked.some((t) => t.p.h.includes(i) || t.q.h.includes(i));
      // 성립하지 않는 쪽은 반례를 하나 든다
      const why = (t) => {
        if (t.rel === 'iff') return `${quo(t.p.h)} ${IFF} ${quo(t.q.h)}이므로 필요충분조건이다.`;
        const [u, w] = t.rel === 'suff' ? [t.p, t.q] : [t.q, t.p], e = nice(ab).find((v) => cF(w, v) && !cF(u, v));
        return `${quo(u.h)} ${IMP} ${quo(w.h)}이지만 ${showE(e)}이면 ${quo(w.h)}이고 ${ej(quo(u.h), "이/가")} 아니므로 ${t.rel === 'suff' ? '충분' : '필요'}조건이다.`;
      };
      return oneQ(d, `실수 ${Av}, ${Bv}에 대하여 ㈎, ㈏, ㈐에 들어갈 말을 충분, 필요, 필요충분 가운데 가장 알맞은 것으로 차례대로 나열한 것은?${useI ? ` (단, ${i} = ${rt(MINUS + '1')})` : ''}`, rows, true, {
        figure: fig, rule: 'three-conds',
        explain: picked.map((t, k) => `${['㈎', '㈏', '㈐'][k]}: ${why(t)}`).join(' ')
      });
    }, { standard: STD.cond }),
    H('hard-cases', '상수에 따라 모양이 바뀌는 진리집합', '②18', (d, n) => {
      if (n === 0) {
        const k = d.pick([2, 3]), s = -d.int(5, 9), t = d.int(6, 13), sq0 = `${sq(X)} − ${k + 1}${Av}${X} + ${k}${sq(Av)}`;
        let count = 0; const ok = [];
        for (let a = -30; a <= 30; a += 1) { const lo = Math.min(a, k * a), hi = Math.max(a, k * a); if (lo > s && hi <= t) { count += 1; ok.push(a); } }
        // 넣어 보아 다시 확인
        const q = iv('x', s, t, false, true);
        const again = range(-30, 30).filter((a) => implies(at('', '<=', 0, (e) => (e.x - a) * (e.x - k * a)), q, RX)).length;
        if (again !== count) throw new Error('개수 셈이 어긋났다');
        return numQ(`두 조건 ${cond('p', `${sq0} ≤ 0`)}, ${cond('q', `${num(s)} &lt; ${X} ≤ ${t}`)}에 대하여 ${ej(pV, '이/가')} ${qV}이기 위한 충분조건이 되도록 하는 정수 ${Av}의 개수는? (단, ${X}는 실수이다.)`, count, {
          signed: false, check: ['cases', k, s, t], rule: 'cases-sign',
          explain: `${sq0} = (${X} − ${Av})(${X} − ${k}${Av})이다. ${Av} &gt; 0이면 ${Av} ≤ ${X} ≤ ${k}${Av}이므로 ${k}${Av} ≤ ${t}, ${Av} = 0이면 진리집합이 {0}, ${Av} &lt; 0이면 ${k}${Av} ≤ ${X} ≤ ${Av}이므로 ${k}${Av} &gt; ${num(s)}이어야 한다. 따라서 정수 ${Av}는 ${num(ok[0])}부터 ${num(ok[ok.length - 1])}까지 ${count}개이다.`
        });
      }
      const g = d.until(() => {
        const c = d.int(1, 4), e0 = c + d.int(1, 3), m = d.int(2, 3), w = d.int(8, 16);
        const ok = range(-20, 20).filter((a) => implies(iv('x', c, a * a + e0, false, false), iv('x', m * a, m * a + w, false, false), RX));
        return { c, e0, m, w, ok };
      }, (t) => t.ok.length >= 2 && t.ok.length <= 7 && t.ok.every((a, i) => i === 0 || a === t.ok[i - 1] + 1));
      return numQ(`두 조건 ${cond('p', `${g.c} &lt; ${X} &lt; ${sq(Av)} + ${g.e0}`)}, ${cond('q', `${g.m}${Av} &lt; ${X} &lt; ${g.m}${Av} + ${g.w}`)}에 대하여 명제 ${pV} ${TO} ${ej(qV, '이/가')} 참이 되도록 하는 정수 ${Av}의 개수는?`, g.ok.length, {
        signed: false, check: ['cases2', g.c, g.e0, g.m, g.w], rule: 'cases-quad',
        explain: `${PS} ⊂ ${QS}이어야 하므로 ${g.m}${Av} ≤ ${g.c}이고 ${sq(Av)} + ${g.e0} ≤ ${g.m}${Av} + ${g.w}이다. 두 부등식을 함께 만족시키는 정수 ${Av}는 ${num(g.ok[0])}부터 ${num(g.ok[g.ok.length - 1])}까지 ${g.ok.length}개이다.`
      });
    }, { count: 2, standard: STD.cond }),
    H('hard-converse', '역·대우의 참·거짓이 정해질 때의 상수', '②19', (d, n) => {
      if (n === 0) {
        const g = d.until(() => {
          const c = d.int(1, 4), dd = -d.int(1, 3), e0 = -d.int(1, 3);
          // 역: dd < x < −a + e0 이면 a < x < c. 결론 쪽 진리집합이 공집합이 아니어야 한다(−a + e0 > dd).
          const ok = range(-20, 20).filter((a) => -a + e0 > dd && implies(iv('x', dd, -a + e0, false, false), iv('x', a, c, false, false), RX));
          return { c, dd, e0, ok };
        }, (t) => t.ok.length >= 2 && t.ok.length <= 6);
        const rhs = `${MINUS}${Av} ${g.e0 < 0 ? MINUS : '+'} ${Math.abs(g.e0)}`;
        return numQ(`명제 ${quo(`${Av} &lt; ${X} &lt; ${g.c}이면 ${num(g.dd)} &lt; ${X} &lt; ${rhs}이다.`)}의 역이 참이 되도록 하는 정수 ${Av}의 개수는? (단, ${num(g.dd)} &lt; ${rhs})`, g.ok.length, {
          signed: false, check: ['conv-count', g.c, g.dd, g.e0], rule: 'conv-count',
          explain: `역 ${quo(`${num(g.dd)} &lt; ${X} &lt; ${rhs}이면 ${Av} &lt; ${X} &lt; ${g.c}이다.`)}가 참이려면 ${Av} ≤ ${num(g.dd)}이고 ${rhs} ≤ ${g.c}이어야 한다. 단서까지 만족시키는 정수 ${Av}는 ${g.ok.map(num).join(', ')}의 ${g.ok.length}개이다.`
        });
      }
      if (n === 1) {
        const b = d.int(2, 4), u = d.int(1, 3), a = b + u, w = a * (b - 1);
        return slots(`두 조건 ${cond('p', `${Av} &lt; ${X} &lt; ${Av} + ${w}`)}, ${cond('q', `${Bv} + ${u} &lt; ${X} &lt; ${Av}${Bv}`)}에 대하여 명제 ${pV} ${TO} ${qV}의 역과 대우가 모두 참이 되도록 하는 상수 ${Av}, ${Bv}의 값을 각각 구하시오. (단, ${Av} &gt; 0, ${Bv} &gt; 0)`, [[`${Av} =`, a, `${b}+${u}`, false], [`${Bv} =`, b, `${b}`, false]], {
          unseen: [b], rule: 'conv-equal',
          explain: `대우가 참이면 ${PS} ⊂ ${QS}, 역이 참이면 ${QS} ⊂ ${PS}이므로 ${PS} = ${QS}이다. ${Av} = ${Bv} + ${u}, ${Av} + ${w} = ${Av}${Bv}를 연립하면 ${Av} = ${a}, ${Bv} = ${b}이다(양수인 해).`
        });
      }
      const g = d.until(() => {
        const c1 = -d.int(2, 5), c2 = -d.int(1, 3), c3 = -d.int(0, 2), c4 = d.int(1, 3);
        const P = (a) => OR(xr('<', 2 * a + c1), xr('>', a * a + a + c2)), Qq = (a) => iv('x', a + c3, a + c4, false, false);
        const ok = range(1, 40).filter((a) => !implies(Qq(a), P(a), RX));
        return { c1, c2, c3, c4, ok };
      }, (t) => t.ok.length >= 2 && t.ok.length <= 8 && !t.ok.includes(40));
      const pc = (c) => (c === 0 ? '' : ` ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`);
      return numQ(`두 조건 ${cond('p', `${X} &lt; 2${Av}${pc(g.c1)} 또는 ${X} &gt; ${sq(Av)} + ${Av}${pc(g.c2)}`)}, ${cond('q', `${Av}${pc(g.c3)} &lt; ${X} &lt; ${Av}${pc(g.c4)}`)}에 대하여 명제 ${pV} ${TO} ${qV}의 역이 거짓이 되도록 하는 자연수 ${Av}의 개수는?`, g.ok.length, {
        signed: false, check: ['conv-false', g.c1, g.c2, g.c3, g.c4], rule: 'conv-false',
        explain: `역 ${qV} ${TO} ${pV}가 거짓이려면 ${QS} ⊄ ${PS}, 즉 ${QS}가 ${pV}의 진리집합 밖의 수(2${Av}${pc(g.c1)} 이상 ${sq(Av)} + ${Av}${pc(g.c2)} 이하)를 포함해야 한다. 이를 만족시키는 자연수 ${Av}는 ${g.ok.join(', ')}의 ${g.ok.length}개이다.`
      });
    }, { count: 3, standard: STD.conv }),
    H('hard-amgm-error', '산술·기하를 두 번 쓴 풀이의 잘못', '②36', (d) => {
      const [u, w] = d.pick([[1, 3], [1, 2], [2, 3], [1, 4], [3, 1], [2, 1]]), m = u * u, k = w * w, wrong = 4 * u * w, right = (u + w) ** 2;
      // 식이 줄 끝에서 끊기지 않게 부등식마다 한 덩어리로 둔다
      const fig = proofBox([`${nb(`${Av} + ${Bv} ≥ 2${rt(Av + Bv)}`)}, ${nb(`${frac(m, Av)} + ${frac(k, Bv)} ≥ 2${rt(frac(m * k, Av + Bv))}`)}이므로`, nb(`(${Av} + ${Bv})(${frac(m, Av)} + ${frac(k, Bv)})`), nb(`≥ 2${rt(Av + Bv)} × 2${rt(frac(m * k, Av + Bv))} = ${wrong}`), `따라서 최솟값은 ${wrong}이다.`]);
      const rows = [
        { h: `두 부등식의 등호가 성립하는 조건 ${Av} = ${Bv}와 ${ej(`${frac(m, Av)} = ${frac(k, Bv)}`, '을/를')} 함께 만족시키는 양수 ${Av}, ${Bv}가 없다.`, ok: true },
        { h: `${Av}, ${Bv}가 양수가 아닐 수 있다.`, ok: false },
        { h: `산술평균과 기하평균의 관계는 곱의 최댓값을 구할 때에만 쓸 수 있다.`, ok: false },
        { h: `${ej(`2${rt(Av + Bv)} × 2${rt(frac(m * k, Av + Bv))}`, '을/를')} 잘못 계산하였다.`, ok: false },
        { h: `두 부등식을 변끼리 곱하면 부등호의 방향이 바뀐다.`, ok: false }
      ];
      return oneQ(d, `${Av} &gt; 0, ${Bv} &gt; 0일 때, (${Av} + ${Bv})(${frac(m, Av)} + ${frac(k, Bv)})의 최솟값을 다음과 같이 구하였다. 이 풀이가 잘못된 까닭으로 옳은 것은?`, rows, true, {
        figure: fig, rule: 'amgm-error',
        explain: `${Av} = ${Bv}이면 ${frac(m, Av)} ≠ ${frac(k, Bv)}이므로 두 등호가 함께 성립하지 않아 ${josa(wrong, '이/가')} 될 수 없다. 바르게 풀면 전개하여 ${m + k} + ${frac((k === 1 ? '' : k) + Av, Bv)} + ${frac((m === 1 ? '' : m) + Bv, Av)} ≥ ${m + k} + ${2 * u * w} = ${right}이다.`
      });
    }, { standard: STD.ineq }),
    H('hard-absolute-k', '모든 실수 x, y에서 성립하도록 하는 상수', '②38', (d) => {
      const [p, q] = d.pick([[1, 4], [2, 4], [1, 6], [2, 8], [3, 6], [1, 2], [2, 12], [3, 12]]), c = d.int(1, 5), M = q * q / (4 * p), ans = M + 1, sgnq = d.pick([1, -1]);
      return numQ(`모든 실수 ${X}, ${Yv}에 대하여 부등식 ${p === 1 ? '' : p}${sq(X)} + |${Yv} − ${c}| ${sgnq < 0 ? MINUS : '+'} ${q}${X} + ${Kv} &gt; 0이 성립하도록 하는 자연수 ${Kv}의 최솟값은?`, ans, {
        signed: false, calc: `${q}*${q}/(4*${p})+1`, unseen: [4, 1], rule: 'abs-k',
        explain: `${p === 1 ? '' : p}${sq(X)} ${sgnq < 0 ? MINUS : '+'} ${q}${X} = ${p === 1 ? '' : p}(${X} ${sgnq < 0 ? MINUS : '+'} ${q / (2 * p)})${sup(2)} − ${M}이고 |${Yv} − ${c}| ≥ 0이므로 좌변의 가장 작은 값은 ${Kv} − ${M}이다. ${Kv} − ${M} &gt; 0이어야 하므로 ${Kv} &gt; ${M}이고, 자연수 ${Kv}의 최솟값은 ${ans}이다.`
      });
    }, { standard: STD.ineq }),
    H('hard-negnecessary', '∼p 가 q 이기 위한 필요조건 — 이차부등식', '심1', (d) => {
      const r1 = d.int(-4, 1), r2 = r1 + d.int(2, 4), u = r2 + d.int(2, 4);
      return numQ(`실수 ${X}에 대한 두 조건 ${cond('p', `${Av} &lt; ${X} &lt; ${u}`)}, ${cond('q', `${polyH(1, -(r1 + r2), r1 * r2)} &lt; 0`)}에 대하여 ${NOT}${ej(pV, '이/가')} ${qV}이기 위한 필요조건이 되도록 하는 정수 ${Av}의 최솟값은? (단, ${Av} &lt; ${u})`, r2, {
        calc: jn(r2), unseen: [Math.abs(r2)], rule: 'neg-nec',
        explain: `${QS} = {${X} | ${num(r1)} &lt; ${X} &lt; ${num(r2)}}, ${NOT}${pV}의 진리집합은 {${X} | ${X} ≤ ${Av} 또는 ${X} ≥ ${u}}이다. ${qV} ${IMP} ${NOT}${pV}이어야 하므로 ${QS} ⊂ ${PS}${sup('C')}, 즉 ${num(r2)} ≤ ${Av}이다. 따라서 정수 ${Av}의 최솟값은 ${num(r2)}이다.`
      });
    }, { standard: STD.cond }),
    H('hard-uniquea', '「모든 실수 x」가 참이 되는 상수 — 판별식이 완전제곱', '심2', (d) => {
      const m = d.pick([-4, -3, -2, -1, 1, 2, 3, 4, 5]), lin = 2 * m, cst = -m * m;
      const expr = `${sq(X)} − 2${Av}${X} ${lin < 0 ? MINUS : '+'} ${Math.abs(lin)}${Av} − ${m * m}`;
      return numQ(`명제 ${quo(`모든 실수 ${X}에 대하여 ${expr} ≥ 0이다.`)}가 참이 되도록 하는 상수 ${Av}의 값은?`, m, {
        calc: `${jn(lin)}/2`, unseen: [2], rule: 'unique-a',
        explain: `이차방정식 ${expr} = 0의 판별식 D에 대하여 D/4 = ${sq(Av)} ${lin < 0 ? '+' : MINUS} ${Math.abs(lin)}${Av} + ${m * m} = (${Av} ${m < 0 ? '+' : MINUS} ${Math.abs(m)})${sup(2)} ≤ 0이어야 한다. 제곱이 0 이하인 것은 0일 때뿐이므로 ${Av} = ${num(m)}이다.`
      });
    }, { standard: STD.prop }),
    H('hard-negnecessary2', '∼p 가 q 이기 위한 필요조건 — 닫힌 구간과 「또는」', '심4', (d) => {
      const w = d.int(1, 3), s = d.int(2, 6), t = s + w + d.int(1, 3), lo = s, hi = t - w;
      return slots(`실수 ${X}에 대한 두 조건 ${cond('p', `${Av} ≤ ${X} ≤ ${Av} + ${w}`)}, ${cond('q', `${X} &lt; ${s} 또는 ${X} &gt; ${t}`)}에 대하여 ${NOT}${ej(pV, '이/가')} ${qV}이기 위한 필요조건이 되도록 하는 정수 ${Av} 가운데 가장 작은 것과 가장 큰 것을 차례대로 구하시오.`, [['가장 작은 것', lo, `${s}`], ['가장 큰 것', hi, `${t}-${w}`]], {
        rule: 'neg-nec2',
        explain: `${qV} ${IMP} ${NOT}${pV}이므로 ${QS} ⊂ ${PS}${sup('C')}, 즉 ${PS} ⊂ ${QS}${sup('C')} = {${X} | ${s} ≤ ${X} ≤ ${t}}이다. ${s} ≤ ${Av}이고 ${Av} + ${w} ≤ ${t}이므로 ${lo} ≤ ${Av} ≤ ${hi}이다.`
      });
    }, { standard: STD.cond }),
    H('hard-cuboid', '직육면체의 대각선의 길이의 최솟값', '심5', (d) => {
      const g = d.until(() => { const e = d.int(2, 8), P = d.int(2, 40), v = 2 * P + e * e, [a, b] = sqParts(v); return { e, P, v, a, b }; }, (t) => t.b > 1 && t.a > 1 && t.P * t.e <= 400);
      // 길이라 부호 단추를 달지 않는다(radAns 는 계수 칸에 부호 단추를 단다)
      return inline(`한 모서리의 길이가 ${g.e}이고 부피가 ${g.e * g.P}인 직육면체를 만들려고 한다. 이 직육면체의 대각선의 길이의 최솟값은?`, '{0}' + rt('{1}'), [{ answer: g.a }, { answer: g.b }], {
        shown: radText(g.a, g.b),
        explain: `나머지 두 모서리의 길이를 ${X}, ${Yv}라고 하면 ${g.e}${X}${Yv} = ${g.e * g.P}에서 ${X}${Yv} = ${g.P}이다. 대각선의 길이는 ${rt(`${sq(X)} + ${sq(Yv)} + ${g.e * g.e}`)}이고 ${sq(X)} + ${sq(Yv)} ≥ 2${X}${Yv} = ${2 * g.P}(등호는 ${X} = ${Yv}일 때)이므로 최솟값은 ${rt(g.v)} = ${g.a}${rt(g.b)}이다.`,
        facts: { check: ['cuboid', g.e, g.P], rule: 'cuboid' }
      });
    }, { standard: STD.ineq })
  ];
  B.addGroup('10-2-5', { id: 'hard', title: '단원 종합', standard: STD.prop, types: hardTypes });
})(typeof window !== 'undefined' ? window : globalThis);
