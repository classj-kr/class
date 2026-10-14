// 중학교 2학년 2학기 3단원 도형의 닮음 — 뒤쪽 묶음
// (삼각형의 닮음 조건, 닮음을 이용하여 길이 구하기, 직각삼각형의 닮음, 닮음의 활용).
// 단원 틀과 그림 도구, 싣는 기준, 뺀 것과 까닭은 8-2-3a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 이 묶음의 그림은 모두 수치대로 그린다: 닮음이 되는 길이의 짝(예: BD = m²t, BA = mnt, BC = n²t)을 먼저 고르고 그 길이로 좌표를 셈한다.
// 그래서 그림에 표시한 같은 각·직각·평행은 그림에서도 실제로 성립한다. 묻는 길이는 그림에 적지 않는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, josa, N, C } = B.kit;
  const { V, SG, sup, gcd } = B.kit.mid;
  const G = B.kit.geo;
  const { RAD, dirOf, dist, mid, meet, sv, TINT, Board } = B.kit.mgeo;
  const K = B.kit.m823;
  const { UNIT, T, SIM, PAR, TAG, cm, tri, quad, lenQ, areaQ, fracQ, sayQ, pickOne, go, lerp, toward, foot, sss, sas, asa, angleAt, ren, rot, flip, scale, level, ctr, eq, figs, tidy, pgram } = K;
  const acosd = (v) => Math.acos(v) / RAD;
  const m2 = (v) => v + ' m';

  // ── 그림: 작은 칸에 넣는 삼각형(이름 없이 수치만) ──
  // kind: 'sss' [세 변], 'sas' [두 변과 끼인각], 'aa' [두 각], 'ssa' [두 변과 끼인각이 아닌 각 — 각은 첫째 변의 맞은편이 아닌 끝에 있다]
  function tileTri(kind, v, turn, mirror) {
    let t, o, said;
    if (kind === 'sss') { t = sss(v[0], v[1], v[2]); o = { sides: [['B', 'C', cm(v[0])], ['C', 'A', cm(v[1])], ['A', 'B', cm(v[2])]] }; said = `삼각형. 세 변의 길이 ${cm(v[0])}, ${cm(v[1])}, ${cm(v[2])}`; }
    else if (kind === 'sas') { t = sas(v[0], v[1], v[2]); o = { sides: [['A', 'B', cm(v[0])], ['B', 'C', cm(v[1])]], angles: [['B', 'C', 'A', v[2] + '°']] }; said = `삼각형. 두 변의 길이 ${cm(v[0])}, ${cm(v[1])}와 그 끼인각의 크기 ${v[2]}°`; }
    else if (kind === 'aa') {
      // 가장 큰 각을 위 꼭짓점에 두고(밑변이 가장 길다), 주어진 두 각을 제자리에 적는다. 세 각의 크기는 서로 다르다.
      const all = [v[0], v[1], 180 - v[0] - v[1]].sort((x, y) => y - x), where = (deg) => (deg === all[0] ? ['A', 'B', 'C'] : deg === all[1] ? ['B', 'C', 'A'] : ['C', 'A', 'B']);
      t = asa(10, all[1], all[2]); o = { angles: [where(v[0]).concat([v[0] + '°']), where(v[1]).concat([v[1] + '°'])] }; said = `삼각형. 두 각의 크기 ${v[0]}°, ${v[1]}°`;
    }
    else {
      // AB = v[0], BC = v[1], ∠A = v[2](두 변 AB, BC 의 끼인각이 아니다). BC 가 AB 보다 길어 삼각형이 하나로 정해진다.
      const len = v[0] * Math.cos(v[2] * RAD) + Math.sqrt(v[1] * v[1] - (v[0] * Math.sin(v[2] * RAD)) ** 2);
      t = { A: [0, 0], B: [v[0], 0], C: go([0, 0], len, v[2]) };
      o = { sides: [['A', 'B', cm(v[0])], ['B', 'C', cm(v[1])]], angles: [['A', 'B', 'C', v[2] + '°']] }; said = `삼각형. 두 변의 길이 ${cm(v[0])}, ${cm(v[1])}와 길이가 ${cm(v[1])}인 변의 맞은편 각의 크기 ${v[2]}°`;
    }
    const f = figs([Object.assign({ P: rot(mirror ? flip(t) : t, turn || 0), order: 'ABC', hide: 'ABC' }, o)], kind === 'aa' ? { w: 108, h: 76 } : kind === 'ssa' ? { w: 96, h: 76 } : kind === 'sas' ? { w: 88, h: 64 } : { w: 76, h: 58 });
    return { svg: f.b.svg(said), t, clash: f.b.clash() };
  }
  // 직각삼각형 ABC(∠A = 90°)와 빗변 BC 에 내린 수선 AD. BD = p, DC = q
  const altTri = (p, q) => ({ A: [p, Math.sqrt(p * q)], B: [0, 0], C: [p + q, 0], D: [p, 0] });
  const ALT = [['A', 'B', 'C']], ALT_D = [['D', 'A', 'C']];

  // ── 삼각형의 닮음 조건 ──
  B.addTypes(UNIT, 'cond', [
    T('cond-name', '수치가 적힌 두 삼각형의 닮음 조건', '①20 ②27', tidy((d, n) => {
      const [m, k] = d.pick([[2, 3], [3, 4], [3, 5], [3, 2], [4, 3]]), turn = d.pick([150, 180, 210]), opts = ['SSS 닮음', 'SAS 닮음', 'AA 닮음'];
      let first, second, said, why, t;
      if (n === 0) {
        const [p, q, r] = d.pick([[4, 5, 6], [5, 6, 7], [4, 6, 7], [5, 7, 8], [3, 4, 6]]); t = sss(p, q, r);
        first = { sides: [['B', 'C', cm(m * p)], ['C', 'A', cm(m * q)], ['A', 'B', cm(m * r)]] }; second = { sides: [['E', 'F', cm(k * p)], ['F', 'D', cm(k * q)], ['D', 'E', cm(k * r)]] };
        said = `삼각형 ABC의 세 변: BC = ${cm(m * p)}, CA = ${cm(m * q)}, AB = ${cm(m * r)}. 삼각형 DEF의 세 변: EF = ${cm(k * p)}, FD = ${cm(k * q)}, DE = ${cm(k * r)}`;
        why = `${SG('AB')} : ${SG('DE')} = ${SG('BC')} : ${SG('EF')} = ${SG('CA')} : ${SG('FD')} = ${m} : ${josa(k, '으로/로')} 세 쌍의 대응변의 길이의 비가 같으므로 ${tri('ABC')} ${SIM} ${tri('DEF')} (SSS 닮음)이다.`;
      } else if (n === 1) {
        const c0 = d.int(2, 5), a0 = d.until(() => d.int(3, 6), (x) => x !== c0 && x <= 1.7 * c0 && c0 <= 1.7 * x), bd = 5 * d.int(9, 18); t = sas(c0, a0, bd);
        first = { sides: [['A', 'B', cm(m * c0)], ['B', 'C', cm(m * a0)]], angles: [['B', 'C', 'A', bd + '°']] }; second = { sides: [['D', 'E', cm(k * c0)], ['E', 'F', cm(k * a0)]], angles: [['E', 'F', 'D', bd + '°']] };
        said = `삼각형 ABC: AB = ${cm(m * c0)}, BC = ${cm(m * a0)}, ∠B = ${bd}°. 삼각형 DEF: DE = ${cm(k * c0)}, EF = ${cm(k * a0)}, ∠E = ${bd}°`;
        why = `${SG('AB')} : ${SG('DE')} = ${SG('BC')} : ${SG('EF')} = ${m} : ${k}이고 그 끼인각의 크기가 ∠B = ∠E = ${bd}°로 같으므로 ${tri('ABC')} ${SIM} ${tri('DEF')} (SAS 닮음)이다.`;
      } else {
        const [bv, cv] = d.until(() => [5 * d.int(8, 16), 5 * d.int(7, 14)], (w) => { const a = 180 - w[0] - w[1]; return a >= 40 && new Set([w[0], w[1], a]).size === 3; }), av = 180 - bv - cv; t = asa(10, bv, cv);
        first = { angles: [['B', 'C', 'A', bv + '°'], ['C', 'A', 'B', cv + '°']] }; second = { angles: [['E', 'F', 'D', bv + '°'], ['D', 'E', 'F', av + '°']] };
        said = `삼각형 ABC: ∠B = ${bv}°, ∠C = ${cv}°. 삼각형 DEF: ∠D = ${av}°, ∠E = ${bv}°`;
        why = `${tri('ABC')}에서 ∠A = 180° − ${bv}° − ${cv}° = ${av}°이다. ∠A = ∠D = ${av}°, ∠B = ∠E = ${bv}°로 두 쌍의 대응각의 크기가 각각 같으므로 ${tri('ABC')} ${SIM} ${tri('DEF')} (AA 닮음)이다.`;
      }
      const f = figs([Object.assign({ P: scale(t, m), order: 'ABC' }, first), Object.assign({ P: rot(ren(scale(t, k), 'ABC', 'DEF'), turn), order: 'DEF' }, second)], { w: 150, h: 230, gap: 46, stack: true });
      return C('그림의 두 삼각형은 서로 닮은 도형이다. 이때 이용할 수 있는 삼각형의 닮음 조건은?', opts, n, {
        figure: f.b.svg(`서로 다른 방향으로 놓인 두 삼각형 ABC와 DEF. ${said}`), explain: why, facts: { truth: [n === 0, n === 1, n === 2], want: true, rule: ['sss', 'sas', 'aa'][n] }
      });
    }), { count: 3 }),
    T('cond-symbol', '닮은 두 삼각형을 기호로 나타내기', '②27 ①20', tidy((d) => {
      const [m, k] = d.pick([[2, 3], [3, 4], [3, 5], [3, 2], [4, 3]]), [p, q, r] = d.pick([[4, 5, 6], [5, 6, 7], [4, 6, 7], [5, 7, 8], [3, 4, 6]]), to = d.pick(['EFD', 'FDE', 'DFE', 'EDF', 'FED']), of = (s) => to['ABC'.indexOf(s)], t = sss(p, q, r);
      const len = { AB: r, BC: p, CA: q }, side = (s) => [of(s[0]), of(s[1])];
      const f = figs([{ P: scale(t, m), order: 'ABC', sides: [['A', 'B', cm(m * r)], ['B', 'C', cm(m * p)], ['C', 'A', cm(m * q)]] },
        { P: rot(ren(scale(d.bool() ? flip(t) : t, k), 'ABC', to), d.pick([140, 180, 215])), order: 'DEF', sides: ['AB', 'BC', 'CA'].map((s) => [side(s)[0], side(s)[1], cm(k * len[s])]) }], { w: 150, h: 230, gap: 46, stack: true });
      const nameOf = (s) => side(s).sort().join(''), told = ['AB', 'BC', 'CA'].map((s) => `${nameOf(s)} = ${cm(k * len[s])}`).join(', ');
      const all = ['DEF', 'DFE', 'EDF', 'EFD', 'FDE', 'FED'].filter((s) => s !== to);
      return pickOne(d, '그림의 두 삼각형은 세 쌍의 대응변의 길이의 비가 같아 서로 닮은 도형이다. 이를 기호로 바르게 나타낸 것은?', `${tri('ABC')} ${SIM} ${tri(to)}`, d.shuffle(all).slice(0, 3).map((s) => `${tri('ABC')} ${SIM} ${tri(s)}`), {
        figure: f.b.svg(`서로 다른 방향으로 놓인 두 삼각형 ABC와 DEF. 삼각형 ABC의 세 변: AB = ${cm(m * r)}, BC = ${cm(m * p)}, CA = ${cm(m * q)}. 삼각형 DEF의 세 변: ${told}`),
        explain: `길이의 비가 ${m} : ${k}인 변끼리 짝 지으면 ${SG('AB')}와 ${SG(nameOf('AB'))}, ${SG('BC')}와 ${SG(nameOf('BC'))}, ${SG('CA')}와 ${SG(nameOf('CA'))}가 각각 대응한다. 따라서 점 A, B, C의 대응점은 차례로 ${of('A')}, ${of('B')}, ${of('C')}이고 ${tri('ABC')} ${SIM} ${tri(to)}이다.`
      });
    })),
    T('cond-pairs', '여러 삼각형에서 닮은 것끼리 짝 짓기', '①21 ②27', (d) => {
      const v = d.until(() => {
        const [p, q, r] = d.pick([[3, 4, 5], [4, 5, 6], [5, 6, 7], [4, 6, 7], [3, 4, 6]]), [m1, k1] = d.pick([[1, 2], [2, 3], [1, 3]]), [m2, k2] = d.pick([[1, 2], [2, 3], [1, 3]]);
        const c0 = d.int(2, 4), a0 = d.until(() => d.int(3, 6), (x) => x !== c0), bd = 5 * d.int(10, 17), bv = 5 * d.int(9, 14), cv = 5 * d.int(7, 12), av = 180 - bv - cv;
        const turn = () => d.pick([0, 20, 160, 180, 200, 340]);
        const list = [['sss', [m1 * p, m1 * q, m1 * r]], ['sss', [k1 * q, k1 * r, k1 * p]], ['sas', [m2 * c0, m2 * a0, bd]], ['sas', [k2 * a0, k2 * c0, bd]], ['aa', [bv, cv]], ['aa', [av, bv]]].map(([kind, w]) => tileTri(kind, w, turn(), d.bool()));
        return { list, ok: av >= 40 && new Set([bv, cv, av]).size === 3 && bd !== bv && bd !== cv && bd !== av, order: d.shuffle([0, 1, 2, 3, 4, 5]) };
      }, (w) => w.ok && w.list.every((t) => !t.clash));
      // order[i]: i번째 칸에 놓인 삼각형. 짝은 (0, 1), (2, 3), (4, 5)
      const at = (j) => v.order.indexOf(j), pairs = [[at(0), at(1)], [at(2), at(3)], [at(4), at(5)]].map((p) => p.sort((x, y) => x - y));
      const show = (list) => list.slice().sort((x, y) => x[0] - y[0]).map(([x, y]) => `${TAG[x]}과 ${TAG[y]}`).join(', ');
      // 여섯을 둘씩 짝 짓는 모든 방법 가운데 바른 짝이 하나만 든 것을 틀린 보기로 쓴다.
      const all = []; (function walk(rest, acc) { if (!rest.length) { all.push(acc); return; } for (let i = 1; i < rest.length; i += 1) walk(rest.filter((_, j) => j !== 0 && j !== i), acc.concat([[rest[0], rest[i]]])); })([0, 1, 2, 3, 4, 5], []);
      const key = (p) => p.join('-'), good = new Set(pairs.map(key)), wrong = d.shuffle(all.filter((list) => list.filter((p) => good.has(key(p))).length === 1)).slice(0, 3);
      return pickOne(d, '다음 삼각형 가운데 서로 닮은 것끼리 바르게 짝 지은 것은?', show(pairs), wrong.map(show), {
        figure: G.tiles(v.order.map((j, i) => [TAG[i], v.list[j].svg])),
        explain: `${TAG[pairs[0][0]]}과 ${TAG[pairs[0][1]]}은 세 쌍의 대응변의 길이의 비가 같다(SSS 닮음). ${TAG[pairs[1][0]]}과 ${TAG[pairs[1][1]]}은 두 쌍의 대응변의 길이의 비가 같고 그 끼인각의 크기가 같다(SAS 닮음). ${TAG[pairs[2][0]]}과 ${TAG[pairs[2][1]]}은 나머지 한 각의 크기를 구하면 두 쌍의 대응각의 크기가 각각 같다(AA 닮음).`
      });
    }),
    T('cond-pick', '주어진 삼각형과 닮은 삼각형 고르기', '①22 ②28', (d) => {
      const v = d.until(() => {
        const c0 = d.int(2, 4), a0 = d.int(c0 + 1, Math.floor(1.5 * c0)), bd = 5 * d.int(11, 15), [m, k] = d.pick([[1, 2], [2, 3], [2, 1], [3, 2], [1, 3]]), turn = () => d.pick([0, 25, 155, 180, 205, 335]);
        const ssa = tileTri('ssa', [k * c0, k * a0, bd], turn(), d.bool());
        const list = [[tileTri('sas', [k * a0, k * c0, bd], turn(), d.bool()), true], [ssa, false], [tileTri('sas', [k * c0, k * (a0 + 1), bd], turn(), d.bool()), false], [tileTri('sas', [k * c0, k * a0, bd + (bd >= 65 ? -15 : 15)], turn(), d.bool()), false]];
        return { c0, a0, bd, m, k, list: d.shuffle(list), far: Math.abs(angleAt(ssa.t.B, ssa.t.A, ssa.t.C) - bd) };
      }, (w) => w.far > 8 && w.list.every((r) => !r[0].clash));
      const base = figs([{ P: sas(v.m * v.c0, v.m * v.a0, v.bd), order: 'ABC', sides: [['A', 'B', cm(v.m * v.c0)], ['B', 'C', cm(v.m * v.a0)]], angles: [['B', 'C', 'A', v.bd + '°']] }], { w: 96, h: 70 });
      const hit = v.list.findIndex((r) => r[1]);
      return C(`다음 중 그림의 ${tri('ABC')}와 닮은 삼각형은?`, TAG.slice(0, 4), hit, {
        figure: base.b.svg(`삼각형 ABC. 변 AB = ${cm(v.m * v.c0)}, 변 BC = ${cm(v.m * v.a0)}, ∠B = ${v.bd}°`) + G.tiles(v.list.map((r, i) => [TAG[i], r[0].svg])),
        explain: `${TAG[hit]}의 두 변의 길이 ${cm(v.k * v.c0)}, ${cm(v.k * v.a0)}는 ${tri('ABC')}의 두 변 AB, BC의 길이와 비가 ${v.k} : ${josa(v.m, '으로/로')} 같고, 그 끼인각의 크기가 ${v.bd}°로 같으므로 ${tri('ABC')}와 닮은 도형이다(SAS 닮음). 크기가 같은 각이 두 변의 끼인각이 아니거나, 두 변의 길이의 비가 다르거나, 끼인각의 크기가 다른 삼각형은 닮은 도형이라고 할 수 없다.`,
        facts: { truth: v.list.map((r) => r[1]), want: true }
      });
    }),
    T('cond-find', '한 그림에서 닮은 두 삼각형과 닮음 조건 찾기', '①23 ②30', tidy((d, n) => {
      const text = '그림에서 서로 닮은 두 삼각형을 찾아 기호로 나타낸 것과 그때의 닮음 조건을 바르게 짝 지은 것은?';
      if (n === 0) {
        // 맞꼭지각을 낀 두 삼각형. same: 선분 AB 와 CD 가 나란한 꼴(A ↔ D), 아니면 엇갈린 꼴(A ↔ C)
        const [m, k] = d.pick([[1, 2], [2, 3], [3, 4], [3, 5]]), p = d.int(3, 6), q = d.until(() => d.int(3, 7), (x) => x !== p), same = d.bool(), ph = d.pick([50, 60, 70]);
        const EA = p * m, EB = q * m, ED = (same ? p : q) * k, EC = (same ? q : p) * k, E0 = [0, 0];
        const P = { A: go(E0, EA, 90 + ph / 2), B: go(E0, EB, 90 - ph / 2), C: go(E0, EC, 270 - ph / 2), D: go(E0, ED, 270 + ph / 2), E: E0 };
        const f = figs([{ P, order: '', segs: [['A', 'D'], ['B', 'C'], ['A', 'B'], ['C', 'D']], sides: [['A', 'E', cm(EA), { in: 'B' }], ['B', 'E', cm(EB), { in: 'A' }], ['C', 'E', cm(EC), { in: 'D' }], ['D', 'E', cm(ED), { in: 'C' }]], at: { E: 0 }, gapOf: { E: 13 } }], { w: 150, h: 150 });
        const yes = same ? 'DCE' : 'CDE', no = same ? 'CDE' : 'DCE';
        return pickOne(d, text, `${tri('ABE')} ${SIM} ${tri(yes)} (SAS 닮음)`, [`${tri('ABE')} ${SIM} ${tri(no)} (SAS 닮음)`, `${tri('ABE')} ${SIM} ${tri(yes)} (AA 닮음)`, `${tri('ABE')} ${SIM} ${tri(no)} (SSS 닮음)`], {
          figure: f.b.svg(`두 선분 AD, BC가 점 E에서 만나고, 선분 AB와 선분 CD가 그어져 있다. 선분 AE = ${cm(EA)}, 선분 BE = ${cm(EB)}, 선분 CE = ${cm(EC)}, 선분 DE = ${cm(ED)}`),
          explain: `${SG('AE')} : ${SG(yes[0] + 'E')} = ${EA} : ${same ? ED : EC} = ${m} : ${k}, ${SG('BE')} : ${SG(yes[1] + 'E')} = ${EB} : ${same ? EC : ED} = ${m} : ${k}이고 ∠AEB = ∠${yes[0]}E${yes[1]}(맞꼭지각)이다. 두 쌍의 대응변의 길이의 비가 같고 그 끼인각의 크기가 같으므로 ${tri('ABE')} ${SIM} ${tri(yes)} (SAS 닮음)이다.`, rule: 'bow'
        });
      }
      if (n === 1) {
        // 한 각을 같이 쓰는 두 삼각형. same: ∠ADE = ∠B(D ↔ B), 아니면 ∠AED = ∠B(E ↔ B)
        const v = d.until(() => { const bv = 5 * d.int(10, 15), cv = 5 * d.int(9, 14); return { bv, cv, same: d.bool() }; }, (w) => Math.abs(w.bv - w.cv) >= 10 && 180 - w.bv - w.cv >= 40);
        const t = asa(10, v.bv, v.cv), AB = dist(t.A, t.B), AC = dist(t.A, t.C), s = v.same ? 0.55 : Math.min(0.55, 0.78 * AC * AC / (AB * AB));
        const P = { A: t.A, B: t.B, C: t.C, D: lerp(t.A, t.B, s), E: v.same ? lerp(t.A, t.C, s) : toward(t.A, t.C, s * AB * AB / AC) };
        const f = figs([{ P, order: 'ABC', segs: [['D', 'E']], angles: [['B', 'C', 'A', v.bv + '°'], v.same ? ['D', 'A', 'E', v.bv + '°'] : ['E', 'A', 'D', v.bv + '°']] }], { w: 170, h: 130 });
        const yes = v.same ? 'ADE' : 'AED', no = v.same ? 'AED' : 'ADE', mark = v.same ? '∠ADE' : '∠AED';
        return pickOne(d, text, `${tri('ABC')} ${SIM} ${tri(yes)} (AA 닮음)`, [`${tri('ABC')} ${SIM} ${tri(no)} (AA 닮음)`, `${tri('ABC')} ${SIM} ${tri(yes)} (SAS 닮음)`, `${tri('ABC')} ${SIM} ${tri(no)} (SSS 닮음)`], {
          figure: f.b.svg(`삼각형 ABC. 점 D는 변 AB 위에, 점 E는 변 AC 위에 있고 선분 DE가 그어져 있다. ∠B = ${v.bv}°, ${mark} = ${v.bv}°`),
          explain: `∠A는 공통이고 ∠B = ${mark} = ${v.bv}°이다. 두 쌍의 대응각의 크기가 각각 같으므로 점 B의 대응점은 점 ${v.same ? 'D' : 'E'}이고 ${tri('ABC')} ${SIM} ${tri(yes)} (AA 닮음)이다.`, rule: 'nest'
        });
      }
      // 대각선 BC 로 나뉜 사각형: AC ↔ CD, AB ↔ CB, BC ↔ BD
      const [p, q, r] = d.pick([[2, 3, 4], [3, 4, 5], [4, 5, 6], [3, 4, 6]]), AC = q * p, AB = q * q, BC = q * r, CD = r * p, BD = r * r, mir = d.bool();
      const pC = sss(BD, CD, BC).A, loc = sss(BC, AC, AB).A, ang = Math.atan2(pC[1], pC[0]) / RAD, pA = [loc[0] * Math.cos(ang * RAD) - loc[1] * Math.sin(ang * RAD), loc[0] * Math.sin(ang * RAD) + loc[1] * Math.cos(ang * RAD)];
      const P0 = { A: pA, B: [0, 0], C: pC, D: [BD, 0] }, P = mir ? flip(P0) : P0;
      const f = figs([{ P, order: 'ABDC', segs: [['B', 'C']], sides: [['A', 'B', cm(AB)], ['A', 'C', cm(AC)], ['C', 'D', cm(CD)], ['B', 'D', cm(BD)], ['B', 'C', cm(BC), { in: 'A' }]] }], { w: 200, h: 130 });
      return pickOne(d, text, `${tri('ABC')} ${SIM} ${tri('CBD')} (SSS 닮음)`, [`${tri('ABC')} ${SIM} ${tri('BCD')} (SSS 닮음)`, `${tri('ABC')} ${SIM} ${tri('CBD')} (SAS 닮음)`, `${tri('ABC')} ${SIM} ${tri('DBC')} (AA 닮음)`], {
        figure: f.b.svg(`사각형 ABDC와 대각선 BC. 변 AB = ${cm(AB)}, 변 AC = ${cm(AC)}, 대각선 BC = ${cm(BC)}, 변 CD = ${cm(CD)}, 변 BD = ${cm(BD)}`),
        explain: `${SG('AC')} : ${SG('CD')} = ${AC} : ${CD}, ${SG('AB')} : ${SG('CB')} = ${AB} : ${BC}, ${SG('BC')} : ${SG('BD')} = ${BC} : ${BD}의 값이 모두 ${q} : ${josa(r, '으로/로')} 같다. 세 쌍의 대응변의 길이의 비가 같고 점 A, B, C의 대응점이 차례로 C, B, D이므로 ${tri('ABC')} ${SIM} ${tri('CBD')} (SSS 닮음)이다.`, rule: 'split'
      });
    }), { count: 3 }),
    T('cond-letters', '문자로 나타낸 조건 가운데 삼각형의 닮음 조건이 아닌 것', '①24 ②26', (d) => {
      const a = V('a'), b = V('b'), c = V('c'), dd = V('d'), e = V('e'), f0 = V('f'), t = sss(6, 5, 4.5);
      const f = figs([{ P: t, order: 'ABC', sides: [['B', 'C', sv('a')], ['C', 'A', sv('b')], ['A', 'B', sv('c')]] }, { P: ren(scale(t, 1.4), 'ABC', 'DEF'), order: 'DEF', sides: [['E', 'F', sv('d')], ['F', 'D', sv('e')], ['D', 'E', sv('f')]] }], { w: 196, h: 100, gap: 46 });
      const yes = [`${a} : ${dd} = ${b} : ${e} = ${c} : ${f0}`, `${a} : ${dd} = ${c} : ${f0}, ∠B = ∠E`, `${a} : ${dd} = ${b} : ${e}, ∠C = ∠F`, `${b} : ${e} = ${c} : ${f0}, ∠A = ∠D`, '∠A = ∠D, ∠B = ∠E', '∠B = ∠E, ∠C = ∠F'];
      const no = [
        [`${a} : ${dd} = ${b} : ${e}, ∠A = ∠D`, `길이가 ${a}, ${b}인 두 변의 끼인각은 ∠C이므로 ∠C = ∠F여야 SAS 닮음이다.`, [yes[2]]],
        [`${a} : ${dd} = ${c} : ${f0}, ∠C = ∠F`, `길이가 ${a}, ${c}인 두 변의 끼인각은 ∠B이므로 ∠B = ∠E여야 SAS 닮음이다.`, [yes[1]]],
        [`${b} : ${e} = ${c} : ${f0}, ∠B = ∠E`, `길이가 ${b}, ${c}인 두 변의 끼인각은 ∠A이므로 ∠A = ∠D여야 SAS 닮음이다.`, [yes[3]]]
      ];
      return sayQ(d, `그림의 ${tri('ABC')}와 ${tri('DEF')}가 서로 닮은 도형이 되는 조건이 아닌 것은?`, yes, no, false,
        f.b.svg('두 삼각형 ABC와 DEF. 삼각형 ABC에서 변 BC의 길이 a, 변 CA의 길이 b, 변 AB의 길이 c. 삼각형 DEF에서 변 EF의 길이 d, 변 FD의 길이 e, 변 DE의 길이 f'));
    }),
    T('cond-add', '조건 하나를 더하여 두 삼각형이 닮은 도형이 되게 하기', '①25 ②29', tidy((d) => {
      const [m, k] = d.pick([[2, 3], [3, 4], [3, 5], [3, 2], [4, 3], [5, 3]]), c0 = d.int(2, 4), a0 = d.until(() => d.int(3, 6), (x) => x !== c0 && x <= 1.7 * c0 && c0 <= 1.7 * x), bd = 5 * d.int(11, 16), t = sas(c0, a0, bd), BC = a0 * m, EF = a0 * k, wantTrue = d.bool();
      const f = figs([{ P: scale(t, m), order: 'ABC', sides: [['B', 'C', cm(BC)]], angles: [['B', 'C', 'A', bd + '°']] }, { P: ren(scale(t, k), 'ABC', 'DEF'), order: 'DEF', sides: [['E', 'F', cm(EF)]], angles: [['E', 'F', 'D', bd + '°']] }], { w: 150, h: 220, gap: 46, stack: true });
      const yes = [`${SG('AB')} : ${SG('DE')} = ${m} : ${k}`, '∠A = ∠D', '∠C = ∠F', `${SG('AB')} : ${SG('BC')} = ${SG('DE')} : ${SG('EF')}`];
      const no = [
        [`${SG('AC')} : ${SG('DF')} = ${m} : ${k}`, `${SG('BC')} : ${SG('EF')} = ${SG('AC')} : ${SG('DF')}이어도 ∠B, ∠E는 그 두 변의 끼인각이 아니므로 닮은 도형이라고 할 수 없다.`],
        [`${SG('AB')} : ${SG('DE')} = ${k} : ${m}`, `${SG('BC')} : ${SG('EF')} = ${m} : ${k}이므로 ${SG('AB')} : ${SG('DE')} = ${m} : ${k}여야 SAS 닮음이다.`, [yes[0]]],
        [`${SG('AB')} = ${SG('DE')}`, `${SG('BC')} : ${SG('EF')} = ${m} : ${k}이므로 ${SG('AB')} : ${SG('DE')} = ${m} : ${k}여야 SAS 닮음이다.`, [yes[0]]],
        [`${SG('AC')} = ${SG('DF')}`, `${SG('AC')}, ${SG('DF')}의 길이가 같아도 두 쌍의 대응변의 길이의 비가 같아지지 않는다.`]
      ];
      return sayQ(d, `그림의 ${tri('ABC')}와 ${tri('DEF')}에 조건을 하나 더하여 ${tri('ABC')} ${SIM} ${tri('DEF')}가 되게 하려고 한다. 더할 조건으로 ${wantTrue ? '알맞은' : '알맞지 않은'} 것은?`, yes, no, wantTrue,
        f.b.svg(`위아래로 놓인 두 삼각형 ABC와 DEF. 삼각형 ABC에서 변 BC = ${cm(BC)}, ∠B = ${bd}°. 삼각형 DEF에서 변 EF = ${cm(EF)}, ∠E = ${bd}°`));
    }))
  ]);

  // ── 닮음을 이용하여 길이 구하기 ──
  const RATIOS = [[1, 2], [2, 3], [3, 4], [3, 5], [2, 5], [1, 3], [2, 1], [3, 2], [4, 3]];
  // 조건에 맞고 그림 속 글이 서로 겹치지 않는 수를 고른다. make(): 수 고르기, ok(w): 조건, draw(w): 그림({ b, Q })
  const fitted = (d, make, ok, draw) => { const w = d.until(make, (x) => ok(x) && !draw(x).b.clash()); return [w, draw(w)]; };
  B.addTypes(UNIT, 'length', [
    T('len-bow-aa', '맞꼭지각과 같은 각 표시가 있는 두 삼각형에서 길이 구하기', '①27', (d) => {
      const [v, f] = fitted(d, () => { const [m, k] = d.pick(RATIOS), t1 = d.int(1, 4), t2 = d.int(1, 5), ph = d.pick([50, 60, 70]); return { m, k, ph, BC: m * t1, CD: k * t1, AB: m * t2, DE: k * t2 }; },
        (w) => { const s = w.AB * w.AB - (w.BC * Math.sin(w.ph * RAD)) ** 2; if (s <= 0 || w.BC === w.AB) return false; const CA = w.BC * Math.cos(w.ph * RAD) + Math.sqrt(s); return CA > 0.6 * w.BC && CA < 1.8 * w.BC && Math.max(w.CD, w.DE) <= 24 && w.BC >= 2; },
        (w) => {
          const CA = w.BC * Math.cos(w.ph * RAD) + Math.sqrt(w.AB * w.AB - (w.BC * Math.sin(w.ph * RAD)) ** 2), C0 = [0, 0];
          const P = { A: go(C0, CA, 90 + w.ph / 2), B: go(C0, w.BC, 90 - w.ph / 2), C: C0, D: go(C0, w.CD, 270 - w.ph / 2), E: go(C0, CA * w.k / w.m, 270 + w.ph / 2) };
          return figs([{ P, order: '', segs: [['A', 'E'], ['B', 'D'], ['A', 'B'], ['D', 'E']], marks: [['A', 'B', 'C'], ['E', 'D', 'C']], sides: [['B', 'C', cm(w.BC), { in: 'A' }], ['C', 'D', cm(w.CD), { in: 'E' }], ['A', 'B', cm(w.AB), { in: 'C' }]], at: { C: 0 }, gapOf: { C: 13 } }], { w: 150, h: 150 });
        });
      return lenQ(`그림에서 두 선분 AE, BD가 점 C에서 만나고 ∠BAC = ∠DEC이다. ${SG('BC')} = ${cm(v.BC)}, ${SG('CD')} = ${cm(v.CD)}, ${SG('AB')} = ${cm(v.AB)}일 때, ${SG('DE')}의 길이는?`, v.DE, {
        figure: f.b.svg(`두 선분 AE, BD가 점 C에서 만나고, 선분 AB와 선분 DE가 그어져 있다. ∠BAC와 ∠DEC에 같은 표시가 있다. 선분 BC = ${cm(v.BC)}, 선분 CD = ${cm(v.CD)}, 선분 AB = ${cm(v.AB)}`),
        explain: `∠BAC = ∠DEC, ∠ACB = ∠ECD(맞꼭지각)이므로 ${tri('ABC')} ${SIM} ${tri('EDC')} (AA 닮음)이다. ${SG('AB')} : ${SG('ED')} = ${SG('CB')} : ${SG('CD')}에서 ${v.AB} : ${SG('DE')} = ${v.BC} : ${v.CD}이므로 ${SG('DE')} = ${cm(v.DE)}이다.`,
        facts: { calc: [[`${v.AB}*${v.CD}/${v.BC}`, 0]] }
      });
    }),
    T('len-bow-sas', '맞꼭지각을 낀 두 변의 길이의 비가 같은 두 삼각형에서 길이 구하기', '①28 ②31 심12', (d) => {
      const [v, f] = fitted(d, () => { const [m, k] = d.pick(RATIOS), [p, q, s] = d.shuffle(d.pick([[4, 5, 6], [5, 6, 7], [4, 6, 7], [3, 4, 5], [5, 7, 8], [3, 5, 6]])); return { m, k, p, q, s }; },
        (w) => w.p !== w.q && Math.max(w.p, w.q, w.s) * Math.max(w.m, w.k) <= 40 && Math.min(w.p, w.q) * Math.min(w.m, w.k) >= 3,
        (w) => {
          const ph = acosd((w.p * w.p + w.q * w.q - w.s * w.s) / (2 * w.p * w.q)), C0 = [0, 0];
          const P = { A: go(C0, w.m * w.p, 90 + ph / 2), B: go(C0, w.m * w.q, 90 - ph / 2), C: C0, D: go(C0, w.k * w.q, 270 + ph / 2), E: go(C0, w.k * w.p, 270 - ph / 2) };
          return figs([{ P, order: '', segs: [['A', 'D'], ['B', 'E'], ['A', 'B'], ['D', 'E']], sides: [['A', 'C', cm(w.m * w.p), { in: 'B' }], ['B', 'C', cm(w.m * w.q), { in: 'A' }], ['C', 'E', cm(w.k * w.p), { in: 'D' }], ['C', 'D', cm(w.k * w.q), { in: 'E' }], ['D', 'E', cm(w.k * w.s), { in: 'C' }]], at: { C: 0 }, gapOf: { C: 13 } }], { w: 150, h: 150 });
        });
      const AC = v.m * v.p, BC = v.m * v.q, CE = v.k * v.p, CD = v.k * v.q, DE = v.k * v.s, AB = v.m * v.s;
      return lenQ(`그림에서 두 선분 AD, BE가 점 C에서 만난다. ${SG('AC')} = ${cm(AC)}, ${SG('BC')} = ${cm(BC)}, ${SG('CE')} = ${cm(CE)}, ${SG('CD')} = ${cm(CD)}, ${SG('DE')} = ${cm(DE)}일 때, ${SG('AB')}의 길이는?`, AB, {
        figure: f.b.svg(`두 선분 AD, BE가 점 C에서 만나고, 선분 AB와 선분 DE가 그어져 있다. 선분 AC = ${cm(AC)}, 선분 BC = ${cm(BC)}, 선분 CE = ${cm(CE)}, 선분 CD = ${cm(CD)}, 선분 DE = ${cm(DE)}`),
        explain: `${SG('AC')} : ${SG('EC')} = ${AC} : ${CE} = ${v.m} : ${v.k}, ${SG('BC')} : ${SG('DC')} = ${BC} : ${CD} = ${v.m} : ${v.k}이고 ∠ACB = ∠ECD(맞꼭지각)이므로 ${tri('ABC')} ${SIM} ${tri('EDC')} (SAS 닮음)이다. ${SG('AB')} : ${DE} = ${v.m} : ${v.k}에서 ${SG('AB')} = ${cm(AB)}이다.`,
        facts: { calc: [[`${DE}*${AC}/${CE}`, 0]] }
      });
    }),
    T('len-right-sas', '직각을 낀 두 변의 길이의 비가 같은 두 직각삼각형에서 빗변의 길이 구하기', '①29', tidy((d) => {
      const [a, b, c] = d.pick([[4, 3, 5], [3, 4, 5], [12, 5, 13], [5, 12, 13], [8, 6, 10], [15, 8, 17]]), [m, k] = d.pick(c > 10 ? [[1, 2], [2, 1]] : [[2, 3], [3, 4], [3, 2], [4, 3], [3, 5], [5, 3]]), t = { C: [0, 0], B: [a, 0], A: [0, b] };
      const f = figs([{ P: scale(t, m), order: 'ABC', right: [['C', 'A', 'B']], sides: [['A', 'C', cm(b * m)], ['B', 'C', cm(a * m)], ['A', 'B', cm(c * m)]] }, { P: ren(scale(t, k), 'ABC', 'DEF'), order: 'DEF', right: [['F', 'D', 'E']], sides: [['D', 'F', cm(b * k)], ['E', 'F', cm(a * k)]] }], { w: 150, h: 220, gap: 48, stack: true });
      return lenQ(`그림의 ${tri('ABC')}와 ${tri('DEF')}에서 ∠C = ∠F = 90°이고 ${SG('AC')} = ${cm(b * m)}, ${SG('BC')} = ${cm(a * m)}, ${SG('AB')} = ${cm(c * m)}, ${SG('DF')} = ${cm(b * k)}, ${SG('EF')} = ${cm(a * k)}일 때, ${SG('DE')}의 길이는?`, c * k, {
        figure: f.b.svg(`위아래로 놓인 두 직각삼각형 ABC와 DEF. ∠C와 ∠F에 직각 표시가 있다. 변 AC = ${cm(b * m)}, 변 BC = ${cm(a * m)}, 변 AB = ${cm(c * m)}, 변 DF = ${cm(b * k)}, 변 EF = ${cm(a * k)}`),
        explain: `${SG('AC')} : ${SG('DF')} = ${b * m} : ${b * k} = ${m} : ${k}, ${SG('BC')} : ${SG('EF')} = ${a * m} : ${a * k} = ${m} : ${k}이고 ∠C = ∠F = 90°이므로 ${tri('ABC')} ${SIM} ${tri('DEF')} (SAS 닮음)이다. ${c * m} : ${SG('DE')} = ${m} : ${k}에서 ${SG('DE')} = ${cm(c * k)}이다.`,
        facts: { calc: [[`${c * m}*${b * k}/${b * m}`, 0]] }
      });
    })),
    T('len-flip-sas', '한 각을 같이 쓰고 대응이 뒤집힌 두 삼각형에서 길이 구하기(SAS 닮음)', '①30 ②33 심11', (d) => {
      const [v, f] = fitted(d, () => { const [m, k] = d.pick([[1, 2], [2, 3], [1, 3], [3, 4]]); return { m, k, p: d.int(3, 9), q: d.int(3, 9), s: d.int(3, 9) }; },
        (w) => { const cb = (w.p * w.p + w.q * w.q - w.s * w.s) / (2 * w.p * w.q); return w.p !== w.q && Math.abs(cb) < 0.82 && w.k * w.q - w.m * w.p >= 2 && w.k * w.p - w.m * w.q >= 2 && w.k * Math.max(w.p, w.q, w.s) <= 24; },
        (w) => {
          const bv = acosd((w.p * w.p + w.q * w.q - w.s * w.s) / (2 * w.p * w.q)), B0 = [0, 0], P = { A: go(B0, w.k * w.q, bv), B: B0, C: [w.k * w.p, 0], D: go(B0, w.m * w.p, bv), E: [w.m * w.q, 0] };
          return figs([{ P, order: 'ABC', segs: [['D', 'E']], sides: [['A', 'D', cm(w.k * w.q - w.m * w.p)], ['D', 'B', cm(w.m * w.p)], ['B', 'E', cm(w.m * w.q)], ['E', 'C', cm(w.k * w.p - w.m * w.q)], ['D', 'E', cm(w.m * w.s), { in: 'B' }]], at: { E: 270 } }], { w: 190, h: 132 });
        });
      const BD = v.m * v.p, BE = v.m * v.q, BA = v.k * v.q, BC = v.k * v.p, DE = v.m * v.s, AC = v.k * v.s, AD = BA - BD, EC = BC - BE;
      return lenQ(`그림의 ${tri('ABC')}에서 점 D는 변 AB 위에, 점 E는 변 BC 위에 있다. ${SG('AD')} = ${cm(AD)}, ${SG('DB')} = ${cm(BD)}, ${SG('BE')} = ${cm(BE)}, ${SG('EC')} = ${cm(EC)}, ${SG('DE')} = ${cm(DE)}일 때, ${SG('AC')}의 길이는?`, AC, {
        figure: f.b.svg(`삼각형 ABC. 점 D는 변 AB 위에, 점 E는 변 BC 위에 있고 선분 DE가 그어져 있다. 선분 AD = ${cm(AD)}, 선분 DB = ${cm(BD)}, 선분 BE = ${cm(BE)}, 선분 EC = ${cm(EC)}, 선분 DE = ${cm(DE)}`),
        explain: `${SG('BA')} = ${AD} + ${BD} = ${BA}(cm), ${SG('BC')} = ${BE} + ${EC} = ${BC}(cm)이다. ${SG('BA')} : ${SG('BE')} = ${BA} : ${BE} = ${v.k} : ${v.m}, ${SG('BC')} : ${SG('BD')} = ${BC} : ${BD} = ${v.k} : ${v.m}이고 ∠B는 공통이므로 ${tri('ABC')} ${SIM} ${tri('EBD')} (SAS 닮음)이다. ${SG('AC')} : ${DE} = ${v.k} : ${v.m}에서 ${SG('AC')} = ${cm(AC)}이다.`,
        facts: { calc: [[`${DE}*(${AD}+${BD})/${BE}`, 0]] }
      });
    }),
    T('len-cevian-sas', '꼭짓점과 맞은편 변 위의 점을 이은 선분의 길이 구하기(SAS 닮음)', '①31 ②32', (d) => {
      const [v, f] = fitted(d, () => { const [m, k] = d.pick([[1, 2], [2, 3], [3, 4], [1, 3]]); return { m, k, t: d.int(1, 4), s: d.int(2, 9) }; },
        (w) => { const BC = w.k * w.k * w.t, BA = w.m * w.k * w.t, CA = w.k * w.s, cb = (BC * BC + BA * BA - CA * CA) / (2 * BC * BA); return BC <= 27 && Math.abs(cb) < 0.8 && w.m * w.m * w.t >= 2 && CA !== BA; },
        (w) => {
          const BD = w.m * w.m * w.t, BA = w.m * w.k * w.t, BC = w.k * w.k * w.t, CA = w.k * w.s, t = sss(BC, CA, BA), P = { A: t.A, B: t.B, C: t.C, D: [BD, 0] };
          return figs([{ P, order: 'ABC', segs: [['A', 'D']], sides: [['A', 'B', cm(BA)], ['A', 'C', cm(CA)], ['B', 'D', cm(BD)], ['D', 'C', cm(BC - BD)]], at: { D: 270 } }], { w: 190, h: 124 });
        });
      const BD = v.m * v.m * v.t, BA = v.m * v.k * v.t, BC = v.k * v.k * v.t, CA = v.k * v.s, AD = v.m * v.s, DC = BC - BD;
      return lenQ(`그림의 ${tri('ABC')}에서 점 D는 변 BC 위에 있다. ${SG('AB')} = ${cm(BA)}, ${SG('AC')} = ${cm(CA)}, ${SG('BD')} = ${cm(BD)}, ${SG('DC')} = ${cm(DC)}일 때, ${SG('AD')}의 길이는?`, AD, {
        figure: f.b.svg(`삼각형 ABC. 점 D는 변 BC 위에 있고 선분 AD가 그어져 있다. 변 AB = ${cm(BA)}, 변 AC = ${cm(CA)}, 선분 BD = ${cm(BD)}, 선분 DC = ${cm(DC)}`),
        explain: `${SG('BC')} = ${BD} + ${DC} = ${BC}(cm)이다. ${SG('AB')} : ${SG('DB')} = ${BA} : ${BD} = ${v.k} : ${v.m}, ${SG('BC')} : ${SG('BA')} = ${BC} : ${BA} = ${v.k} : ${v.m}이고 ∠B는 공통이므로 ${tri('ABC')} ${SIM} ${tri('DBA')} (SAS 닮음)이다. ${SG('AC')} : ${SG('DA')} = ${v.k} : ${v.m}에서 ${CA} : ${SG('AD')} = ${v.k} : ${v.m}이므로 ${SG('AD')} = ${cm(AD)}이다.`,
        facts: { calc: [[`${CA}*${BA}/(${BD}+${DC})`, 0]] }
      });
    }),
    T('len-cevian-aa', '같은 각 표시가 있는 삼각형에서 꼭짓점과 맞은편 변 위의 점을 이은 선분(AA 닮음)', '①32 ②34', (d, n) => {
      const [v, f] = fitted(d, () => { const [p, q] = d.pick([[2, 3], [1, 2], [3, 4], [3, 5], [4, 5]]), k = d.int(1, 3), al = d.pick([52, 58, 64, 70]); return { p, q, k, al }; },
        (w) => w.q * w.q * w.k <= 27 && w.p * w.p * w.k >= 2,
        (w) => {
          const AB = w.p * w.q * w.k, AC = w.q * w.q * w.k, AD = w.p * w.p * w.k, A0 = [0, 0], P = level({ A: A0, B: go(A0, AB, 0), C: go(A0, AC, w.al), D: go(A0, AD, w.al) }, 'B', 'C');
          return figs([{ P, order: 'ABC', segs: [['B', 'D']], marks: [['B', 'A', 'D'], ['C', 'A', 'B']], sides: [['A', 'B', cm(AB)]].concat(n === 1 ? [['A', 'D', cm(AD)]] : []), dims: n === 0 ? [['A', 'C', cm(AC), 25, 'B']] : [] }], { w: 172, h: 124 });
        });
      const AB = v.p * v.q * v.k, AC = v.q * v.q * v.k, AD = v.p * v.p * v.k, head = `그림의 ${tri('ABC')}에서 점 D는 변 AC 위에 있고 ∠ABD = ∠C이다. `, said = '삼각형 ABC. 점 D는 변 AC 위에 있고 선분 BD가 그어져 있다. ∠ABD와 ∠C에 같은 표시가 있다. ';
      const why = `∠A는 공통이고 ∠ABD = ∠C이므로 ${tri('ABC')} ${SIM} ${tri('ADB')} (AA 닮음)이다. ${SG('AB')} : ${SG('AD')} = ${SG('AC')} : ${SG('AB')}에서 `;
      if (n === 0) return lenQ(`${head}${SG('AB')} = ${cm(AB)}, ${SG('AC')} = ${cm(AC)}일 때, ${SG('AD')}의 길이는?`, AD, {
        figure: f.b.svg(`${said}변 AB = ${cm(AB)}, 변 AC = ${cm(AC)}`), explain: `${why}${AB} : ${SG('AD')} = ${AC} : ${AB}이므로 ${SG('AD')} = ${cm(AD)}이다.`, facts: { calc: [[`${AB}*${AB}/${AC}`, 0]] }
      });
      return lenQ(`${head}${SG('AB')} = ${cm(AB)}, ${SG('AD')} = ${cm(AD)}일 때, ${SG('CD')}의 길이는?`, AC - AD, {
        figure: f.b.svg(`${said}변 AB = ${cm(AB)}, 선분 AD = ${cm(AD)}`), explain: `${why}${AB} : ${AD} = ${SG('AC')} : ${AB}이므로 ${SG('AC')} = ${cm(AC)}이다. ${SG('CD')} = ${SG('AC')} − ${SG('AD')} = ${AC} − ${AD} = ${AC - AD}(cm)이다.`,
        facts: { calc: [[`${AB}*${AB}/${AD}-${AD}`, 0]] }
      });
    }, { count: 2 }),
    T('len-flip-aa', '같은 각 표시가 있는 삼각형에서 두 변 위의 점을 이은 선분(AA 닮음)', '①33 ②35', (d) => {
      const [v, f] = fitted(d, () => { const [m, k] = d.pick([[1, 2], [2, 3], [1, 3], [3, 4]]); return { m, k, p: d.int(2, 8), q: d.int(2, 8), ga: d.pick([50, 58, 66]) }; },
        (w) => w.p !== w.q && w.k * w.q - w.m * w.p >= 2 && w.k * w.p - w.m * w.q >= 2 && w.k * Math.max(w.p, w.q) <= 24 && w.m * Math.min(w.p, w.q) >= 3,
        (w) => {
          const C0 = [0, 0], P = { A: go(C0, w.k * w.q, 180 - w.ga), B: [-w.k * w.p, 0], C: C0, D: go(C0, w.m * w.p, 180 - w.ga), E: [-w.m * w.q, 0] };
          return figs([{ P, order: 'ABC', segs: [['D', 'E']], marks: [['B', 'A', 'C'], ['D', 'E', 'C']], sides: [['A', 'D', cm(w.k * w.q - w.m * w.p)], ['D', 'C', cm(w.m * w.p)], ['E', 'C', cm(w.m * w.q)]], at: { E: 270 } }], { w: 190, h: 132 });
        });
      const CD = v.m * v.p, CE = v.m * v.q, CA = v.k * v.q, CB = v.k * v.p, AD = CA - CD, BE = CB - CE;
      return lenQ(`그림의 ${tri('ABC')}에서 점 D는 변 AC 위에, 점 E는 변 BC 위에 있고 ∠B = ∠EDC이다. ${SG('AD')} = ${cm(AD)}, ${SG('DC')} = ${cm(CD)}, ${SG('EC')} = ${cm(CE)}일 때, ${SG('BE')}의 길이는?`, BE, {
        figure: f.b.svg(`삼각형 ABC. 점 D는 변 AC 위에, 점 E는 변 BC 위에 있고 선분 DE가 그어져 있다. ∠B와 ∠EDC에 같은 표시가 있다. 선분 AD = ${cm(AD)}, 선분 DC = ${cm(CD)}, 선분 EC = ${cm(CE)}`),
        explain: `∠C는 공통이고 ∠B = ∠EDC이므로 ${tri('ABC')} ${SIM} ${tri('EDC')} (AA 닮음)이다. ${SG('BC')} : ${SG('DC')} = ${SG('AC')} : ${SG('EC')}에서 ${SG('BC')} : ${CD} = ${CA} : ${CE}이므로 ${SG('BC')} = ${cm(CB)}이다. ${SG('BE')} = ${CB} − ${CE} = ${BE}(cm)이다.`,
        facts: { calc: [[`(${AD}+${CD})*${CD}/${CE}-${CE}`, 0]] }
      });
    }),
    T('len-pgram', '평행사변형의 변의 연장선이 만드는 닮은 두 삼각형에서 길이 구하기', '①35 ②38', (d) => {
      const [v, f] = fitted(d, () => { const [m, k] = d.pick([[2, 1], [3, 1], [3, 2], [1, 1], [4, 3], [5, 2], [4, 1]]), t1 = d.int(1, 4), t2 = d.int(1, 4); return { m, k, DC: m * t1, ED: k * t1, BC: (m + k) * t2, AF: m * t2, th: d.pick([64, 70, 76]) }; },
        (w) => w.BC >= 6 && w.BC <= 24 && w.DC >= 3 && w.DC <= 16 && w.ED >= 2 && w.BC > w.DC && w.BC < 3 * w.DC,
        (w) => {
          const q = pgram(w.BC, w.DC, w.th), pE = go(q.D, w.ED, w.th), P = { A: q.A, B: q.B, C: q.C, D: q.D, E: pE, F: meet(q.B, pE, q.A, q.D) };
          return figs([{ P, order: 'ABCD', segs: [['D', 'E'], ['B', 'E']], sides: [['E', 'D', cm(w.ED), { in: 'A' }], ['D', 'C', cm(w.DC), { in: 'A' }], ['B', 'C', cm(w.BC), { in: 'A' }]], at: { D: 335, F: 112, A: 135 } }], { w: 190, h: 150 });
        });
      return lenQ(`그림의 평행사변형 ABCD에서 변 CD의 연장선 위의 점 E와 점 B를 이은 선분이 변 AD와 점 F에서 만난다. ${SG('ED')} = ${cm(v.ED)}, ${SG('DC')} = ${cm(v.DC)}, ${SG('BC')} = ${cm(v.BC)}일 때, ${SG('AF')}의 길이는?`, v.AF, {
        figure: f.b.svg(`평행사변형 ABCD. 점 E는 변 CD를 점 D 쪽으로 늘인 선 위에 있고, 선분 BE가 변 AD와 점 F에서 만난다. 선분 ED = ${cm(v.ED)}, 변 DC = ${cm(v.DC)}, 변 BC = ${cm(v.BC)}`),
        explain: `${SG('AB')} ${PAR} ${SG('CE')}이므로 ∠ABF = ∠DEF(엇각)이고 ∠AFB = ∠DFE(맞꼭지각)이다. ${tri('ABF')} ${SIM} ${tri('DEF')} (AA 닮음)이고 ${SG('AB')} = ${SG('DC')} = ${cm(v.DC)}이므로 ${SG('AF')} : ${SG('DF')} = ${v.DC} : ${v.ED} = ${v.m} : ${v.k}이다. ${SG('AD')} = ${SG('BC')} = ${cm(v.BC)}이므로 ${SG('AF')} = ${v.BC} × ${frac(v.m, v.m + v.k)} = ${v.AF}(cm)이다.`,
        facts: { calc: [[`${v.BC}*${v.DC}/(${v.DC}+${v.ED})`, 0]] }
      });
    }),
    T('len-square-area', '정사각형의 변의 연장선이 만드는 닮은 두 삼각형에서 넓이 구하기', '②39', (d) => {
      const [s, c] = d.pick([[12, 8], [12, 9], [15, 9], [18, 12], [20, 16], [6, 4], [24, 16], [24, 18]]), DE = s - c, DF = s * DE / c, area = DE * DF / 2;
      const P = { A: [0, s], B: [0, 0], C: [s, 0], D: [s, s], E: [s, c], F: [s + DF, s] };
      const f = figs([{ P, order: 'ABCD', fills: [['DEF']], segs: [['B', 'F'], ['D', 'F']], sides: [['A', 'B', cm(s)], ['E', 'C', cm(c), { in: 'B' }]], at: { E: 150, D: 90, A: 135, B: 225, C: 315 } }], { w: 170, h: 120 });
      return areaQ(`그림과 같이 한 변의 길이가 ${cm(s)}인 정사각형 ABCD에서 변 DC 위의 점 E와 점 B를 이은 선분의 연장선이 변 AD의 연장선과 점 F에서 만난다. ${SG('EC')} = ${cm(c)}일 때, ${tri('DEF')}의 넓이는?`, area, {
        figure: f.b.svg(`한 변의 길이가 ${cm(s)}인 정사각형 ABCD. 점 E는 변 DC 위에 있고, 선분 BE를 점 E 쪽으로 늘인 선과 변 AD를 점 D 쪽으로 늘인 선이 점 F에서 만난다. 선분 EC = ${cm(c)}. 삼각형 DEF가 색칠되어 있다`),
        explain: `${SG('DE')} = ${s} − ${c} = ${DE}(cm)이다. ∠EDF = ∠ECB = 90°, ∠DEF = ∠CEB(맞꼭지각)이므로 ${tri('DEF')} ${SIM} ${tri('CEB')} (AA 닮음)이다. ${SG('DF')} : ${s} = ${DE} : ${c}에서 ${SG('DF')} = ${cm(DF)}이다. ${tri('DEF')}의 넓이는 ${frac(1, 2)} × ${DF} × ${DE} = ${area}(cm²)이다.`,
        facts: { calc: [[`(${s}-${c})*(${s}*(${s}-${c})/${c})/2`, 0]], unseen: [2] }
      });
    }),
    T('len-area', '겹친 닮은 두 삼각형과 넓이', '①19 ②36', (d, n) => {
      const [v, f] = fitted(d, () => { const [m, k] = d.pick([[1, 2], [2, 3], [1, 3], [3, 4], [3, 5]]); return { m, k, p: d.int(2, 8), q: d.int(2, 8), t: d.int(2, 9), al: d.pick([52, 60, 68]) }; },
        (w) => w.p !== w.q && w.k * w.p - w.m * w.q >= 2 && w.k * w.q - w.m * w.p >= 2 && w.k * Math.max(w.p, w.q) <= 24 && w.m * Math.min(w.p, w.q) >= 3,
        (w) => {
          const A0 = [0, 0], P = level({ A: A0, B: go(A0, w.k * w.p, 270 - w.al / 2), C: go(A0, w.k * w.q, 270 + w.al / 2), D: go(A0, w.m * w.p, 270 + w.al / 2), E: go(A0, w.m * w.q, 270 - w.al / 2) }, 'B', 'C');
          return figs([{ P, order: 'ABC', fills: [[n === 0 ? 'ADE' : 'EBCD']], segs: [['D', 'E']], marks: [['B', 'A', 'C'], ['D', 'A', 'E']], sides: [['A', 'E', cm(w.m * w.q)], ['E', 'B', cm(w.k * w.p - w.m * w.q)], ['A', 'D', cm(w.m * w.p)]] }], { w: 180, h: 132 });
        });
      const AE = v.m * v.q, AD = v.m * v.p, AB = v.k * v.p, EB = AB - AE, S = v.k * v.k * v.t, small = v.m * v.m * v.t;
      const head = `그림의 ${tri('ABC')}에서 점 D는 변 AC 위에, 점 E는 변 AB 위에 있고 ∠B = ∠ADE이다. ${SG('AE')} = ${cm(AE)}, ${SG('EB')} = ${cm(EB)}, ${SG('AD')} = ${cm(AD)}이고 ${tri('ABC')}의 넓이가 ${S} cm²일 때, `;
      const said = `삼각형 ABC. 점 D는 변 AC 위에, 점 E는 변 AB 위에 있고 선분 DE가 그어져 있다. ∠B와 ∠ADE에 같은 표시가 있다. 선분 AE = ${cm(AE)}, 선분 EB = ${cm(EB)}, 선분 AD = ${cm(AD)}. `;
      const why = `∠A는 공통이고 ∠B = ∠ADE이므로 ${tri('ABC')} ${SIM} ${tri('ADE')} (AA 닮음)이다. ${SG('AB')} = ${AE} + ${EB} = ${AB}(cm)이므로 닮음비는 ${SG('AB')} : ${SG('AD')} = ${AB} : ${AD} = ${v.k} : ${v.m}이고 넓이의 비는 ${v.k * v.k} : ${v.m * v.m}이다. ${tri('ADE')}의 넓이는 ${S} × ${frac(v.m * v.m, v.k * v.k)} = ${small}(cm²)이다.`;
      const expr = `${S}*${AD}*${AD}/((${AE}+${EB})*(${AE}+${EB}))`;
      if (n === 0) return areaQ(`${head}${tri('ADE')}의 넓이는?`, small, { figure: f.b.svg(`${said}삼각형 ADE가 색칠되어 있다`), explain: why, facts: { calc: [[expr, 0]] } });
      return areaQ(`${head}${quad('EBCD')}의 넓이는?`, S - small, { figure: f.b.svg(`${said}사각형 EBCD가 색칠되어 있다`), explain: `${why} ${quad('EBCD')}의 넓이는 ${S} − ${small} = ${S - small}(cm²)이다.`, facts: { calc: [[`${S}-${expr}`, 0]] } });
    }, { count: 2 }),
    T('len-pgram-angle', '평행사변형에서 같은 각 표시가 있는 두 삼각형과 둘레의 길이', '심17', (d) => {
      const [a, e] = d.pick([[12, 8], [6, 4], [6, 3], [10, 5], [12, 9], [15, 9], [8, 4], [10, 4], [12, 6], [20, 16]]), L = a * a / e, q = pgram(L, a, d.pick([66, 72, 78])), P = { A: q.A, B: q.B, C: q.C, D: q.D, E: [L - e, 0] };
      const f = figs([{ P, order: 'ABCD', segs: [['B', 'D'], ['D', 'E']], marks: [['D', 'A', 'B'], ['D', 'C', 'E']], sides: [['D', 'C', cm(a), { in: 'A' }]], dims: [['E', 'C', cm(e), 25, 'A']], at: { E: 270 } }], { w: 220, h: 120 });
      return lenQ(`그림의 평행사변형 ABCD에서 점 E는 변 BC 위에 있고 ∠ADB = ∠CDE이다. ${SG('DC')} = ${cm(a)}, ${SG('EC')} = ${cm(e)}일 때, ${quad('ABCD')}의 둘레의 길이는?`, 2 * (a + L), {
        figure: f.b.svg(`평행사변형 ABCD와 대각선 BD. 점 E는 변 BC 위에 있고 선분 DE가 그어져 있다. ∠ADB와 ∠CDE에 같은 표시가 있다. 변 DC = ${cm(a)}, 선분 EC = ${cm(e)}`),
        explain: `평행사변형의 대각의 크기는 같으므로 ∠A = ∠C이고, ∠ADB = ∠CDE이므로 ${tri('ABD')} ${SIM} ${tri('CED')} (AA 닮음)이다. ${SG('AB')} = ${SG('DC')} = ${cm(a)}이므로 ${SG('AB')} : ${SG('CE')} = ${SG('AD')} : ${SG('CD')}에서 ${a} : ${e} = ${SG('AD')} : ${a}, ${SG('AD')} = ${cm(L)}이다. 둘레의 길이는 2 × (${a} + ${L}) = ${2 * (a + L)}(cm)이다.`,
        facts: { calc: [[`2*(${a}+${a}*${a}/${e})`, 0]], unseen: [2] }
      });
    })
  ]);

  // ── 직각삼각형의 닮음 ──
  B.addTypes(UNIT, 'right', [
    T('right-perp', '한 예각을 같이 쓰는 두 직각삼각형에서 길이 구하기', '①36 ②47', (d, n) => {
      if (n === 0) {
        // 닮은 두 직각삼각형 DEC, ABC 의 변: [EC, DE, DC, AC, AB, CB](점 B 가 선분 DC 위에, 점 E 가 선분 AC 위에 오는 수)
        const [EC, DE, DC, AC, AB, CB] = d.pick([[12, 16, 20, 15, 12, 9], [15, 20, 25, 20, 16, 12], [12, 16, 20, 25, 20, 15], [15, 20, 25, 30, 24, 18], [18, 24, 30, 25, 20, 15]]), AE = AC - EC;
        const pC = [DC, 0], pA = [DC - CB, AB], P = { A: pA, B: [DC - CB, 0], C: pC, D: [0, 0], E: toward(pC, pA, EC) };
        const f = figs([{ P, order: '', segs: [['D', 'C'], ['A', 'B'], ['A', 'C'], ['D', 'E']], right: [['B', 'A', 'C'], ['E', 'D', 'C']], sides: [['A', 'E', cm(AE), { in: 'B' }], ['E', 'C', cm(EC), { in: 'B' }], ['D', 'E', cm(DE), { in: 'C', t: 0.28 }]], dims: [['D', 'C', cm(DC), 25, 'A']], at: { B: 270, D: 180, C: 0, E: 45 } }], { w: 190, h: 132 });
        return lenQ(`그림에서 ∠ABC = ∠DEC = 90°이다. ${SG('AE')} = ${cm(AE)}, ${SG('EC')} = ${cm(EC)}, ${SG('DE')} = ${cm(DE)}, ${SG('DC')} = ${cm(DC)}일 때, ${SG('AB')}의 길이는?`, AB, {
          figure: f.b.svg(`선분 DC 위에 점 B가 있고, 점 B에서 선분 DC에 수직으로 선분 AB가 서 있다. 점 E는 선분 AC 위에 있고 선분 DE는 선분 AC에 수직이다. ∠ABC와 ∠DEC에 직각 표시가 있다. 선분 AE = ${cm(AE)}, 선분 EC = ${cm(EC)}, 선분 DE = ${cm(DE)}, 선분 DC = ${cm(DC)}`),
          explain: `∠C는 공통이고 ∠ABC = ∠DEC = 90°이므로 ${tri('ABC')} ${SIM} ${tri('DEC')} (AA 닮음)이다. ${SG('AC')} = ${AE} + ${EC} = ${AC}(cm)이므로 ${SG('AB')} : ${SG('DE')} = ${SG('AC')} : ${SG('DC')}에서 ${SG('AB')} : ${DE} = ${AC} : ${DC}, ${SG('AB')} = ${cm(AB)}이다.`,
          facts: { calc: [[`${DE}*(${AE}+${EC})/${DC}`, 0]] }
        });
      }
      const [AB, BC, BD] = d.pick([[9, 12, 8], [18, 24, 16], [25, 30, 18], [32, 40, 25], [27, 36, 24]]), h = Math.sqrt(BC * BC - AB * AB), pA = [AB * AB / BC, AB * h / BC];
      const P = { A: pA, B: [0, 0], C: [BC, 0], D: [BC / 2, BC / 2 * pA[1] / pA[0]], M: [BC / 2, 0] };
      const f = figs([{ P, order: 'ABC', segs: [['D', 'M']], right: [['A', 'B', 'C'], ['M', 'D', 'C']], ticks: [['B', 'M', 2], ['M', 'C', 2]], dims: [['B', 'A', cm(AB), 25, 'C'], ['B', 'C', cm(BC), 25, 'A']], at: { M: 270 } }], { w: 190, h: 120 });
      return lenQ(`그림과 같이 ∠A = 90°인 직각삼각형 ABC에서 변 BC의 중점 M을 지나고 변 BC에 수직인 직선이 변 AB와 점 D에서 만난다. ${SG('AB')} = ${cm(AB)}, ${SG('BC')} = ${cm(BC)}일 때, ${SG('BD')}의 길이는?`, BD, {
        figure: f.b.svg(`∠A가 직각인 삼각형 ABC. 점 M은 변 BC의 중점이고, 점 D는 변 AB 위에 있으며 선분 DM은 변 BC에 수직이다. 변 AB = ${cm(AB)}, 변 BC = ${cm(BC)}`),
        explain: `∠B는 공통이고 ∠BAC = ∠BMD = 90°이므로 ${tri('ABC')} ${SIM} ${tri('MBD')} (AA 닮음)이다. ${SG('BM')} = ${BC} ÷ 2 = ${BC / 2}(cm)이므로 ${SG('AB')} : ${SG('MB')} = ${SG('BC')} : ${SG('BD')}에서 ${AB} : ${BC / 2} = ${BC} : ${SG('BD')}, ${SG('BD')} = ${cm(BD)}이다.`,
        facts: { calc: [[`(${BC}/2)*${BC}/${AB}`, 0]], unseen: [2] }
      });
    }, { count: 2 }),
    T('right-two-alt', '두 꼭짓점에서 맞은편 변에 내린 수선이 만드는 닮은 두 직각삼각형', '①37 ②48 심16', (d, n) => {
      // 직각삼각형 ABD, ACE 의 세 변의 비가 u : w : (빗변). AB = c·i, AC = c·j
      const v = d.until(() => { const [u, w, c] = d.pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [8, 15, 17], [1, 0, 2], [2, 0, 3], [3, 0, 5], [2, 0, 5]]); return { u, w, c, i: d.int(1, 5), j: d.int(1, 5) }; },
        (x) => x.i !== x.j && x.u * x.i <= 0.78 * x.c * x.j && x.u * x.j <= 0.78 * x.c * x.i && x.c * Math.max(x.i, x.j) <= 30 && (n === 0 ? x.c * Math.min(x.i, x.j) >= 6 : x.w > 0 && (x.u * x.w * x.j * x.j) % 2 === 0 && x.w * Math.max(x.i, x.j) <= 30));
      const al = acosd(v.u / v.c), AB = v.c * v.i, AC = v.c * v.j, AD = v.u * v.i, AE = v.u * v.j, A0 = [0, 0];
      const P = level({ A: A0, B: go(A0, AB, 270 - al / 2), C: go(A0, AC, 270 + al / 2), D: go(A0, AD, 270 + al / 2), E: go(A0, AE, 270 - al / 2) }, 'B', 'C');
      const f = figs([{ P, order: 'ABC', segs: [['B', 'D'], ['C', 'E']], right: [['D', 'B', 'C'], ['E', 'C', 'B']] }], { w: 180, h: 132 });
      const head = `그림의 ${tri('ABC')}에서 ${SG('BD')} ⊥ ${SG('AC')}, ${SG('CE')} ⊥ ${SG('AB')}이다. `, said = '삼각형 ABC. 점 D는 꼭짓점 B에서 변 AC에 내린 수선의 발이고, 점 E는 꼭짓점 C에서 변 AB에 내린 수선의 발이다. 두 수선의 발에 직각 표시가 있다';
      const why = `∠A는 공통이고 ∠ADB = ∠AEC = 90°이므로 ${tri('ABD')} ${SIM} ${tri('ACE')} (AA 닮음)이다. `;
      if (n === 0) return lenQ(`${head}${SG('AB')} = ${cm(AB)}, ${SG('AC')} = ${cm(AC)}, ${SG('AD')} = ${cm(AD)}일 때, ${SG('AE')}의 길이는?`, AE, {
        figure: f.b.svg(said), explain: `${why}${SG('AB')} : ${SG('AC')} = ${SG('AD')} : ${SG('AE')}에서 ${AB} : ${AC} = ${AD} : ${SG('AE')}이므로 ${SG('AE')} = ${cm(AE)}이다.`, facts: { calc: [[`${AC}*${AD}/${AB}`, 0]] }
      });
      const BD = v.w * v.i, CE = v.w * v.j, area = AE * CE / 2;
      return areaQ(`${head}${SG('AD')} = ${cm(AD)}, ${SG('AE')} = ${cm(AE)}, ${SG('BD')} = ${cm(BD)}일 때, ${tri('AEC')}의 넓이는?`, area, {
        figure: f.b.svg(said), explain: `${why}${SG('AD')} : ${SG('AE')} = ${SG('BD')} : ${SG('CE')}에서 ${AD} : ${AE} = ${BD} : ${SG('CE')}이므로 ${SG('CE')} = ${cm(CE)}이다. ${tri('AEC')}의 넓이는 ${frac(1, 2)} × ${AE} × ${CE} = ${area}(cm²)이다.`,
        facts: { calc: [[`${AE}*(${BD}*${AE}/${AD})/2`, 0]], unseen: [2] }
      });
    }, { count: 2 }),
    T('right-alt', '직각삼각형의 빗변에 내린 수선이 만드는 선분의 길이', '①39 ②44', (d, n) => {
      const head = '그림과 같이 ∠A = 90°인 직각삼각형 ABC의 꼭짓점 A에서 변 BC에 내린 수선의 발을 D라 하자. ', said = '∠A가 직각인 삼각형 ABC. 점 D는 꼭짓점 A에서 변 BC에 내린 수선의 발이다. ';
      const fig = (p, q, more) => figs([Object.assign({ P: altTri(p, q), order: 'ABC', segs: [['A', 'D']], right: ALT.concat(ALT_D), at: { D: 270 } }, more)], { w: 190, h: 118 });
      if (n === 1) {
        const [p, q] = d.pick([[9, 7], [4, 5], [4, 12], [2, 6], [3, 9], [9, 16], [16, 9], [8, 10], [5, 15], [12, 15]]), AB = Math.sqrt(p * (p + q)), f = fig(p, q, { sides: [['A', 'B', cm(AB)]], dims: [['B', 'D', cm(p), 25, 'A']] });
        return lenQ(`${head}${SG('AB')} = ${cm(AB)}, ${SG('BD')} = ${cm(p)}일 때, ${SG('CD')}의 길이는?`, q, {
          figure: f.b.svg(`${said}변 AB = ${cm(AB)}, 선분 BD = ${cm(p)}`),
          explain: `∠B는 공통이고 ∠BAC = ∠BDA = 90°이므로 ${tri('ABC')} ${SIM} ${tri('DBA')} (AA 닮음)이다. ${SG('AB')} : ${SG('DB')} = ${SG('BC')} : ${SG('BA')}에서 ${AB} : ${p} = ${SG('BC')} : ${AB}이므로 ${SG('BC')} = ${cm(p + q)}이다. ${SG('CD')} = ${p + q} − ${p} = ${q}(cm)이다.`,
          facts: { calc: [[`${AB}*${AB}/${p}-${p}`, 0]] }
        });
      }
      const [p, q] = d.pick([[4, 9], [9, 4], [2, 8], [8, 2], [3, 12], [12, 3], [9, 16], [16, 9], [4, 16], [16, 4]]), h = Math.sqrt(p * q), side = p < q ? 'B' : 'C';
      if (n === 0) {
        const f = fig(p, q, { sides: [['A', 'D', cm(h), { in: side }]], dims: [['B', 'D', cm(p), 25, 'A']] });
        return lenQ(`${head}${SG('BD')} = ${cm(p)}, ${SG('AD')} = ${cm(h)}일 때, ${SG('CD')}의 길이는?`, q, {
          figure: f.b.svg(`${said}선분 BD = ${cm(p)}, 선분 AD = ${cm(h)}`),
          explain: `∠ABD = 90° − ∠BAD = ∠CAD이고 ∠ADB = ∠CDA = 90°이므로 ${tri('ABD')} ${SIM} ${tri('CAD')} (AA 닮음)이다. ${SG('BD')} : ${SG('AD')} = ${SG('AD')} : ${SG('CD')}에서 ${p} : ${h} = ${h} : ${SG('CD')}이므로 ${SG('CD')} = ${cm(q)}이다.`,
          facts: { calc: [[`${h}*${h}/${p}`, 0]] }
        });
      }
      const f = fig(p, q, { dims: [['B', 'D', cm(p), 25, 'A'], ['D', 'C', cm(q), 25, 'A']] });
      return lenQ(`${head}${SG('BD')} = ${cm(p)}, ${SG('CD')} = ${cm(q)}일 때, ${SG('AD')}의 길이는?`, h, {
        figure: f.b.svg(`${said}선분 BD = ${cm(p)}, 선분 CD = ${cm(q)}`),
        explain: `∠ABD = 90° − ∠BAD = ∠CAD이고 ∠ADB = ∠CDA = 90°이므로 ${tri('ABD')} ${SIM} ${tri('CAD')} (AA 닮음)이다. ${SG('BD')} : ${SG('AD')} = ${SG('AD')} : ${SG('CD')}에서 ${SG('AD')}${sup(2)} = ${p} × ${q} = ${p * q}이다. ${h}${sup(2)} = ${p * q}이므로 ${SG('AD')} = ${cm(h)}이다.`,
        facts: { calc: [[`(${p}*${q})**0.5`, 0]], unseen: [0.5] }
      });
    }, { count: 3 }),
    T('right-alt-height', '세 변의 길이가 주어진 직각삼각형에서 빗변에 내린 수선의 길이', '①40 ②46', (d) => {
      const [a, b, c] = d.pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [9, 12, 15], [12, 16, 20], [5, 12, 13], [12, 5, 13], [8, 15, 17], [10, 24, 26], [7, 24, 25]]);
      const P = { A: [0, 0], B: [c, 0], C: [b * b / c, a * b / c], H: [b * b / c, 0] };
      const f = figs([{ P, order: 'ABC', segs: [['C', 'H']], right: [['C', 'A', 'B'], ['H', 'C', 'B']], sides: [['A', 'C', cm(b)], ['B', 'C', cm(a)]], dims: [['A', 'B', cm(c), 25, 'C']], at: { H: 270 } }], { w: 190, h: 118 });
      return fracQ(`그림과 같이 ∠C = 90°인 직각삼각형 ABC의 꼭짓점 C에서 변 AB에 내린 수선의 발을 H라 하자. ${SG('AC')} = ${cm(b)}, ${SG('BC')} = ${cm(a)}, ${SG('AB')} = ${cm(c)}일 때, ${SG('CH')}의 길이는?`, a * b, c, 'cm', {
        figure: f.b.svg(`∠C가 직각인 삼각형 ABC. 점 H는 꼭짓점 C에서 변 AB에 내린 수선의 발이다. 변 AC = ${cm(b)}, 변 BC = ${cm(a)}, 변 AB = ${cm(c)}`),
        explain: `∠A는 공통이고 ∠ACB = ∠AHC = 90°이므로 ${tri('ABC')} ${SIM} ${tri('ACH')} (AA 닮음)이다. ${SG('AB')} : ${SG('AC')} = ${SG('BC')} : ${SG('CH')}에서 ${c} : ${b} = ${a} : ${SG('CH')}이므로 ${SG('CH')} = ${frac(a * b / gcd(a * b, c), c / gcd(a * b, c))}(cm)이다. (직각삼각형의 넓이를 두 가지로 나타내어 ${frac(1, 2)} × ${b} × ${a} = ${frac(1, 2)} × ${c} × ${SG('CH')}로 구해도 된다.)`,
        facts: { value: `${a}*${b}/${c}` }
      });
    }),
    T('right-alt-area', '직각삼각형의 빗변에 내린 수선으로 나뉜 삼각형의 넓이', '①41 ②45', (d) => {
      const [h, q, p] = d.pick([[12, 16, 9], [6, 4, 9], [6, 9, 4], [6, 12, 3], [8, 16, 4], [12, 9, 16], [6, 3, 12], [8, 4, 16], [10, 20, 5], [10, 5, 20], [4, 2, 8], [12, 8, 18], [12, 18, 8]]), area = p * h / 2;
      const f = figs([{ P: altTri(p, q), order: 'ABC', fills: [['ABD']], segs: [['A', 'D']], right: ALT.concat(ALT_D), sides: [['A', 'D', cm(h), { in: p > q ? 'C' : 'B' }]], dims: [['D', 'C', cm(q), 25, 'A']], at: { D: 270 } }], { w: 190, h: 118 });
      return areaQ(`그림과 같이 ∠A = 90°인 직각삼각형 ABC의 꼭짓점 A에서 변 BC에 내린 수선의 발을 D라 하자. ${SG('AD')} = ${cm(h)}, ${SG('CD')} = ${cm(q)}일 때, ${tri('ABD')}의 넓이는?`, area, {
        figure: f.b.svg(`∠A가 직각인 삼각형 ABC. 점 D는 꼭짓점 A에서 변 BC에 내린 수선의 발이다. 선분 AD = ${cm(h)}, 선분 CD = ${cm(q)}. 삼각형 ABD가 색칠되어 있다`),
        explain: `∠ABD = 90° − ∠BAD = ∠CAD이고 ∠ADB = ∠CDA = 90°이므로 ${tri('ABD')} ${SIM} ${tri('CAD')} (AA 닮음)이다. ${SG('BD')} : ${SG('AD')} = ${SG('AD')} : ${SG('CD')}에서 ${SG('BD')} : ${h} = ${h} : ${q}이므로 ${SG('BD')} = ${cm(p)}이다. ${tri('ABD')}의 넓이는 ${frac(1, 2)} × ${p} × ${h} = ${area}(cm²)이다.`,
        facts: { calc: [[`(${h}*${h}/${q})*${h}/2`, 0]], unseen: [2] }
      });
    }),
    T('right-claims', '직각삼각형의 빗변에 내린 수선에 대한 설명 가리기', '①42 ②43', (d) => {
      const [p, q] = d.pick([[4, 9], [9, 5], [5, 11], [10, 6], [7, 12]]), wantTrue = d.bool(), sq = (s) => SG(s) + sup(2), by = (s, t) => `${SG(s)} × ${SG(t)}`;
      const f = figs([{ P: altTri(p, q), order: 'ABC', segs: [['A', 'D']], right: ALT.concat(ALT_D), at: { D: 270 } }], { w: 190, h: 118 });
      const yes = [`${tri('ABC')} ${SIM} ${tri('DBA')}`, `${tri('ABC')} ${SIM} ${tri('DAC')}`, `${tri('DBA')} ${SIM} ${tri('DAC')}`, `${sq('AB')} = ${by('BD', 'BC')}`, `${sq('AC')} = ${by('CD', 'CB')}`, `${sq('AD')} = ${by('BD', 'CD')}`, `${by('AB', 'AC')} = ${by('BC', 'AD')}`];
      const no = [
        [`${sq('AB')} = ${by('BD', 'CD')}`, `${tri('ABC')} ${SIM} ${tri('DBA')}에서 ${SG('AB')} : ${SG('DB')} = ${SG('BC')} : ${SG('BA')}이므로 ${sq('AB')} = ${by('BD', 'BC')}이다.`, [yes[3], yes[5]]],
        [`${sq('AD')} = ${by('AB', 'AC')}`, `${tri('DBA')} ${SIM} ${tri('DAC')}에서 ${SG('BD')} : ${SG('AD')} = ${SG('AD')} : ${SG('CD')}이므로 ${sq('AD')} = ${by('BD', 'CD')}이다.`, [yes[5], yes[6]]],
        [`${sq('AC')} = ${by('BD', 'BC')}`, `${tri('ABC')} ${SIM} ${tri('DAC')}에서 ${SG('AC')} : ${SG('DC')} = ${SG('BC')} : ${SG('AC')}이므로 ${sq('AC')} = ${by('CD', 'CB')}이다.`, [yes[3], yes[4]]],
        [`${sq('BC')} = ${by('AB', 'AC')}`, `직각삼각형 ABC의 넓이에서 ${by('AB', 'AC')} = ${by('BC', 'AD')}이다.`, [yes[6]]],
        [`${tri('ABC')} ${SIM} ${tri('DAB')}`, `∠BAC = ∠BDA = 90°, ∠B는 공통이므로 점 A, B, C의 대응점은 차례로 D, B, A이다. ${tri('ABC')} ${SIM} ${tri('DBA')}이다.`, [yes[0]]]
      ];
      return sayQ(d, `그림과 같이 ∠A = 90°인 직각삼각형 ABC의 꼭짓점 A에서 변 BC에 내린 수선의 발을 D라 할 때, 다음 중 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, yes, no, wantTrue,
        f.b.svg('∠A가 직각인 삼각형 ABC. 점 D는 꼭짓점 A에서 변 BC에 내린 수선의 발이다. ∠A와 ∠ADC에 직각 표시가 있다'));
    })
  ]);

  // ── 닮음의 활용 ──
  B.addTypes(UNIT, 'use', [
    T('use-shadow-tip', '그림자의 끝이 일치하는 막대와 나무의 높이', '②53', (d) => {
      // 막대가 그림에서 너무 낮아지지 않는 수를 고른다.
      const [m, k, t, s] = d.until(() => { const r = d.pick([[2, 5], [1, 2], [2, 3], [1, 3], [3, 5], [1, 4], [3, 4]]); return [r[0], r[1], d.int(2, 5), d.int(1, Math.max(1, Math.floor(4 / r[0])))]; }, (w) => w[0] * w[3] * Math.min(200 / (w[1] * w[2]), 110 / (w[1] * w[3])) >= 30);
      const p = m * t, q = (k - m) * t, h = m * s, H = k * s, b = Board(), u = Math.min(200 / (p + q), 110 / H);
      const A = [0, 0], Bp = [p * u, 0], D = [(p + q) * u, 0], Cp = [p * u, -h * u], E = [(p + q) * u, -H * u];
      b.seg([-8, 0], [D[0] + 10, 0]).seg(A, E, 'thin').seg(Bp, Cp, '', 'stroke-width:3').seg(D, E, '', 'stroke-width:3').corner(Bp, Cp, D, '').corner(D, E, A, '');
      b.dim(A, Bp, m2(p), [0, -30], 12).dim(Bp, D, m2(q), [0, -30], 12).beside(Bp, Cp, m2(h), A, { gap: 6, t: 0.62 });
      b.text([Cp[0] - 18, Cp[1] - 11], '막대').text([E[0], E[1] - 11], '나무');
      return N(`그림과 같이 길이가 ${m2(h)}인 막대를 나무에서 ${m2(q)} 떨어진 곳에 땅과 수직으로 세웠더니 막대의 그림자의 끝과 나무의 그림자의 끝이 일치하였다. 막대의 그림자의 길이가 ${m2(p)}일 때, 나무의 높이는 몇 m인가?`, H, {
        unit: 'm', figure: b.svg(`땅 위에 막대와 나무가 수직으로 서 있고, 두 그림자의 끝이 한 점에서 만난다. 그림자의 끝에서 막대까지 ${m2(p)}, 막대에서 나무까지 ${m2(q)}, 막대의 길이 ${m2(h)}. 그림자의 끝과 막대의 끝, 나무의 꼭대기가 한 직선 위에 있다`),
        explain: `막대가 만드는 직각삼각형과 나무가 만드는 직각삼각형은 한 예각을 같이 쓰므로 닮은 도형이다(AA 닮음). 나무의 그림자의 길이는 ${p} + ${q} = ${p + q}(m)이므로 ${p} : ${p + q} = ${h} : (나무의 높이)에서 나무의 높이는 ${H} m이다.`,
        facts: { calc: [[`${h}*(${p}+${q})/${p}`, 0]] }
      });
    }),
    T('use-shadow', '같은 시각의 막대와 그림자로 높이 구하기', '②54', (d) => {
      const [h, s] = d.pick([[2, 3], [1, 2], [3, 2], [3, 4], [2, 5], [4, 3]]), r = d.int(2, 4), thing = d.pick(['나무', '탑', '건물']), S = s * r, H = h * r;
      const f = figs([{ P: { A: [0, 0], B: [s, 0], C: [s, h] }, order: '', hide: 'ABC', segs: [['A', 'B'], ['A', 'C', 'thin']], right: [['B', 'C', 'A']], sides: [['A', 'B', m2(s), { in: 'C' }], ['B', 'C', m2(h), { in: 'A' }]] },
        { P: { A: [0, 0], B: [S, 0], C: [S, H] }, order: '', hide: 'ABC', segs: [['A', 'B'], ['A', 'C', 'thin']], right: [['B', 'C', 'A']], sides: [['A', 'B', m2(S), { in: 'C' }]] }], { w: 190, h: 120, gap: 44 });
      [0, 1].forEach((i) => f.b.seg(f.Q[i].B, f.Q[i].C, '', 'stroke-width:3').text([f.Q[i].C[0], f.Q[i].C[1] - 10], i ? thing : '막대'));
      return N(`어느 날 같은 시각에 땅과 수직으로 서 있는 길이 ${m2(h)}의 막대와 ${thing}의 그림자의 길이를 재었더니 각각 ${m2(s)}, ${m2(S)}였다. ${thing}의 높이는 몇 m인가?`, H, {
        unit: 'm', figure: f.b.svg(`막대와 그 그림자가 이루는 직각삼각형과 ${thing}${thing === '탑' || thing === '건물' ? '과' : '와'} 그 그림자가 이루는 직각삼각형. 막대의 길이 ${m2(h)}, 막대의 그림자의 길이 ${m2(s)}, ${thing}의 그림자의 길이 ${m2(S)}`),
        explain: `같은 시각에 햇빛이 땅과 이루는 각의 크기는 같으므로 두 직각삼각형은 닮은 도형이다(AA 닮음). ${h} : (${thing}의 높이) = ${s} : ${S}에서 ${thing}의 높이는 ${H} m이다.`,
        facts: { calc: [[`${h}*${S}/${s}`, 0]] }
      });
    }),
    T('use-mirror', '거울에 비친 건물의 높이', '②55', (d) => {
      const [d1, d2, H] = d.pick([[2.5, 20, 12], [2.5, 15, 9], [2.5, 25, 15], [3, 16, 8], [3, 24, 12], [2, 12, 9], [2, 16, 12], [3, 18, 9]]), eye = 1.5;
      const P = { A: [0, eye], B: [0, 0], C: [d1, 0], D: [d1 + d2, H], E: [d1 + d2, 0] };
      const f = figs([{ P, order: '', segs: [['B', 'E'], ['A', 'B'], ['D', 'E'], ['A', 'C', 'thin'], ['C', 'D', 'thin']], right: [['B', 'A', 'C'], ['E', 'D', 'C']], marks: [['C', 'A', 'B'], ['C', 'D', 'E']], sides: [['A', 'B', m2(eye), { in: 'C' }]], dims: [['B', 'C', m2(d1), 25, 'A'], ['C', 'E', m2(d2), 25, 'A']], at: { A: 90, B: 270, C: 270, E: 270, D: 90 } }], { w: 216, h: 130 });
      return N(`눈높이가 ${m2(eye)}인 학생이 건물의 높이를 구하려고 그림과 같이 땅에 거울을 놓고, 거울에 건물의 꼭대기가 비쳐 보이는 곳에 섰다. 학생과 거울 사이의 거리는 ${m2(d1)}, 거울과 건물 사이의 거리는 ${m2(d2)}이다. ∠ACB = ∠DCE일 때, 건물의 높이는 몇 m인가? (단, 거울의 두께는 생각하지 않는다.)`, H, {
        unit: 'm', figure: f.b.svg(`땅 위의 한 직선에 학생의 발 B, 거울 C, 건물의 밑 E가 차례로 있다. 점 A는 학생의 눈, 점 D는 건물의 꼭대기이고 선분 AB와 선분 DE는 땅에 수직이다. 선분 AC와 선분 CD가 그어져 있고 ∠ACB와 ∠DCE에 같은 표시가 있다. 선분 AB = ${m2(eye)}, 선분 BC = ${m2(d1)}, 선분 CE = ${m2(d2)}`),
        explain: `∠ACB = ∠DCE, ∠ABC = ∠DEC = 90°이므로 ${tri('ABC')} ${SIM} ${tri('DEC')} (AA 닮음)이다. ${SG('AB')} : ${SG('DE')} = ${SG('BC')} : ${SG('EC')}에서 ${eye} : ${SG('DE')} = ${d1} : ${d2}이므로 ${SG('DE')} = ${H} m이다.`,
        facts: { calc: [[`${eye}*${d2}/${d1}`, 0]] }
      });
    })
  ]);

  Object.assign(K, { acosd, m2, tileTri, altTri, ALT, ALT_D, RATIOS, fitted });
})(typeof window !== 'undefined' ? window : globalThis);
