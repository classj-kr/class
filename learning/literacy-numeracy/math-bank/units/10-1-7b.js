// 고등학교 1학년 1학기 7단원 경우의 수 — 뒤쪽 묶음(순열의 활용 — 수와 문자열, 조합의 수, 조합의 활용 — 뽑기, 조합의 활용 — 도형).
// 싣는 기준과 뺀 것은 10-1-7a.js 머리 주석에 모아 적었다. 도구는 10-1-7a.js 가 내보낸 B.kit.m1017 을 쓴다.
// 도형 그림(반원 위의 점, 평행사변형의 변 위의 점, 한 점에서 만나는 두 직선, 평행선 묶음, 원 위의 같은 간격의 점)은 이 파일 안에서 B.kit.mgeo 의 판으로 그린다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, lines, box, frac, N, M, C, inline } = B.kit;
  const { MINUS, range, V, nb, tail, proc } = B.kit.mid;
  const { at, Board, sv } = B.kit.mgeo;
  const K = B.kit.m1017;
  const { UNIT, S2, S3, sum, hits, fact, nPr, nCr, perms, combos, cart, told, who, prodS, factS, combS, combX, eqDigit, T, Pn, Cn, Pj, Cj, vn, vr, eqn } = K;

  // ── □ 의 다항식: □(□−1)…(□−r+1) ──
  const polyX = (r, x) => range(0, r - 1).map((i) => (i ? `(${x || '□'}-${i})` : (x || '□'))).join('*');

  // ── 그림 ──
  // 반원: 호 위에 점 a 개(지름의 양 끝은 빼고), 지름 위에 점 b 개(양 끝 포함)
  function semicircleFig(a, b) {
    const g = Board(), c = [0, 0], R = 92;
    g.arc(c, R, 0, 180).seg([-R, 0], [R, 0]);
    for (let i = 1; i <= a; i += 1) g.dot(at(c, R, 180 * i / (a + 1)), 3.2);
    for (let j = 0; j < b; j += 1) g.dot([-R + 2 * R * j / (b - 1), 0], 3.2);
    return g.svg(`반원: 호 위에 점 ${a}개(지름의 양 끝점은 빼고), 지름 위에 점 ${b}개(지름의 양 끝점을 포함)가 있다.`);
  }
  // 평행사변형: 위·아래 변 위에 꼭짓점을 포함하여 점 p 개씩, 왼쪽·오른쪽 변 위에 꼭짓점을 포함하여 점 q 개씩
  function pgramFig(p, q) {
    const g = Board(), A = [44, 0], Bp = [224, 0], Cp = [180, 92], Dp = [0, 92], lerp = (u, w, t) => [u[0] + (w[0] - u[0]) * t, u[1] + (w[1] - u[1]) * t];
    g.poly([A, Bp, Cp, Dp]);
    const pts = [];
    for (let i = 0; i < p; i += 1) pts.push(lerp(A, Bp, i / (p - 1)), lerp(Dp, Cp, i / (p - 1)));
    for (let j = 1; j < q - 1; j += 1) pts.push(lerp(Dp, A, j / (q - 1)), lerp(Cp, Bp, j / (q - 1)));
    pts.forEach((pt) => g.dot(pt, 3.2));
    return g.svg(`평행사변형: 위쪽 변과 아래쪽 변 위에 꼭짓점을 포함하여 점이 ${p}개씩, 왼쪽 변과 오른쪽 변 위에 꼭짓점을 포함하여 점이 ${q}개씩 있다. 점은 모두 ${2 * p + 2 * q - 4}개이다.`);
  }
  // 한 점 O 에서 만나는 두 직선 l, m: l 위에 O 를 포함하여 점 a 개, m 위에 O 를 포함하여 점 b 개
  function twoLinesFig(a, b) {
    const g = Board(), O = [0, 0], step = 46, dl = 18, dm = -24;
    g.seg(at(O, -10, dl), at(O, step * (a - 1) + 26, dl)).seg(at(O, -10, dm), at(O, step * (b - 1) + 26, dm));
    for (let i = 0; i < a; i += 1) g.dot(at(O, step * i, dl), 3.2);
    for (let i = 1; i < b; i += 1) g.dot(at(O, step * i, dm), 3.2);
    g.text(at(O, 15, 90), 'O', { plain: true }).text(at(at(O, step * (a - 1) + 26, dl), 11, dl + 25), sv('l'), { plain: true }).text(at(at(O, step * (b - 1) + 26, dm), 11, dm - 25), sv('m'), { plain: true });
    return g.svg(`한 점 O에서 만나는 두 직선 l, m: 직선 l 위에 점 O를 포함하여 점 ${a}개, 직선 m 위에 점 O를 포함하여 점 ${b}개가 있다.`);
  }
  // 평행선 묶음: counts 는 묶음마다의 직선 수(둘이면 가로와 비스듬한 직선, 셋이면 가로·오른쪽 위로·왼쪽 위로 기운 직선). 다른 묶음의 직선끼리는 모두 만난다.
  function familiesFig(counts) {
    const g = Board(), dirs = counts.length === 2 ? [0, 68] : [0, 60, 120], gap = counts.length === 2 ? 34 : 30, half = counts.length === 2 ? 118 : 112;
    counts.forEach((k, f) => {
      const a = dirs[f], nrm = a + 90;
      for (let i = 0; i < k; i += 1) {
        const off = (i - (k - 1) / 2) * gap, c = at([0, 0], off, nrm);
        g.seg(at(c, -half, a), at(c, half, a), null, f === 0 ? null : f === 1 ? 'stroke:#b42318' : 'stroke:#15803d');
      }
    });
    const word = counts.length === 2 ? `가로로 놓인 서로 평행한 직선 ${counts[0]}개와 비스듬히 놓인 서로 평행한 직선 ${counts[1]}개` : `가로로 놓인 서로 평행한 직선 ${counts[0]}개, 오른쪽 위로 기운 서로 평행한 직선 ${counts[1]}개, 왼쪽 위로 기운 서로 평행한 직선 ${counts[2]}개`;
    return g.svg(`평행선: ${word}가 있다. 묶음이 다른 직선끼리는 모두 한 점에서 만난다.`);
  }
  // 원 위의 같은 간격의 점 n 개
  function circleFig(n) {
    const g = Board(), c = [0, 0], R = 70;
    g.disk(c, R);
    for (let i = 0; i < n; i += 1) g.dot(at(c, R, 90 - i * 360 / n), 3.3);
    return g.svg(`원: 원 위에 점 ${n}개가 같은 간격으로 놓여 있다.`);
  }

  // ════════════════ 순열의 활용 — 수와 문자열 ════════════════
  const numberTypes = [
    T('num-size-even', '크기 조건과 짝수·홀수 조건을 함께', '②6', (d, n) => {
      const even = d.bool(), kind = even ? '짝수' : '홀수', ok2 = (v) => v % 2 === (even ? 0 : 1);
      if (n === 0) {
        const below = d.bool(), h = below ? d.int(3, 6) : d.int(5, 8), all = perms(range(1, 9), 3).map((t) => t[0] * 100 + t[1] * 10 + t[2]);
        const inRange = (v) => (below ? v < h * 100 : v >= h * 100), flags = all.map((v) => inRange(v) && ok2(v));
        const heads = below ? range(1, h - 1) : range(h, 9), ends = range(1, 9).filter(ok2);
        const same = heads.filter(ok2), diff = heads.filter((x) => !ok2(x));
        return N(`1부터 9까지의 자연수 중에서 서로 다른 세 수를 택하여 만든 세 자리의 자연수 중에서 ${h}00 ${below ? '미만' : '이상'}인 ${kind}의 개수는?`, hits(flags), {
          unit: '개',
          explain: `백의 자리의 숫자는 ${told(heads)}이고, 일의 자리에는 ${kind}인 ${told(ends)}${tail(ends[ends.length - 1], '이/가')} 와야 한다. `
            + (same.length ? `백의 자리가 ${told(same)}일 때는 일의 자리에 ${ends.length - 1}가지, 십의 자리에 7가지가 오므로 ${same.length} × ${ends.length - 1} × 7 = ${same.length * (ends.length - 1) * 7}(개)이다. ` : '')
            + (diff.length ? `백의 자리가 ${told(diff)}일 때는 일의 자리에 ${ends.length}가지, 십의 자리에 7가지가 오므로 ${diff.length} × ${ends.length} × 7 = ${diff.length * ends.length * 7}(개)이다. ` : '')
            + `따라서 모두 ${hits(flags)}개이다.`,
          facts: { count: flags }
        });
      }
      const t = d.int(5, 8), all = perms(range(1, 9), 2).map(([a, b]) => a * 10 + b), flags = all.map((v) => v >= t * 10 && ok2(v));
      const rows = range(t, 9).map((h) => all.filter((v) => Math.floor(v / 10) === h && ok2(v)));
      return N(`1부터 9까지의 자연수 중에서 서로 다른 두 수를 택하여 만든 두 자리의 자연수 중에서 ${t}0 이상인 ${kind}의 개수는?`, hits(flags), {
        unit: '개',
        explain: rows.map((list, i) => `십의 자리가 ${t + i}인 것은 ${told(list)}의 ${list.length}개`).join(', ') + `이다. 십의 자리와 같은 숫자는 일의 자리에 쓸 수 없다. 따라서 ${rows.map((l) => l.length).join(' + ')} = ${hits(flags)}(개)이다.`,
        facts: { count: flags }
      });
    }, { count: 2, standard: S2 }),
    T('num-include', '정해진 숫자를 넣거나 빼고 뽑아 만든 수', '②8', (d, n) => {
      if (n === 0) {
        const top = d.int(6, 9), r = d.int(3, 4), form = d.pick(['inout', 'two']), [x, y] = d.shuffle(range(1, top)).slice(0, 2);
        if (form === 'inout') {
          const ans = nCr(top - 2, r - 1) * fact(r);
          return N(`1부터 ${top}까지의 자연수 중에서 서로 다른 ${r}개를 택하여 ${r === 3 ? '세' : '네'} 자리의 자연수를 만들 때, ${josa(x, '은/는')} 반드시 들어 있고 ${josa(y, '은/는')} 들어 있지 않은 수의 개수는?`, ans, {
            unit: '개',
            explain: `${josa(x, '과/와')} ${josa(y, '을/를')} 뺀 ${top - 2}개의 수 가운데 ${r - 1}개를 고르는 경우는 ${Cn(top - 2, r - 1)} = ${nCr(top - 2, r - 1)}(가지)이다. 고른 수와 ${josa(x, '을/를')} 합한 ${r}개를 일렬로 나열하는 경우는 ${r}! = ${fact(r)}(가지)이므로 ${nCr(top - 2, r - 1)} × ${fact(r)} = ${ans}(개)이다.`,
            facts: { calc: [[`${combS(top - 2, r - 1)}*${factS(r)}`, 0]], rule: 'in-out' }
          });
        }
        const ans = nCr(top - 2, r - 2) * fact(r);
        return N(`1부터 ${top}까지의 자연수가 하나씩 적힌 카드 ${top}장 중에서 ${r}장을 뽑아 ${r === 3 ? '세' : '네'} 자리의 자연수를 만들 때, ${josa(x, '과/와')} ${josa(y, '이/가')} 적힌 카드가 반드시 들어 있는 수의 개수는?`, ans, {
          unit: '개',
          explain: `${josa(x, '과/와')} ${josa(y, '을/를')} 뺀 ${top - 2}장 가운데 ${r - 2}장을 고르는 경우는 ${Cn(top - 2, r - 2)} = ${nCr(top - 2, r - 2)}(가지)이다. 고른 ${r}장을 일렬로 나열하는 경우는 ${r}! = ${fact(r)}(가지)이므로 ${nCr(top - 2, r - 2)} × ${fact(r)} = ${ans}(개)이다.`,
          facts: { calc: [[`${combS(top - 2, r - 2)}*${factS(r)}`, 0]], rule: 'two-in' }
        });
      }
      const [i, j] = d.until(() => [d.int(1, 3), d.int(1, 3)], ([a, b]) => a + b >= 3 && a + b <= 5 && nCr(4, a) * nCr(4, b) * fact(a + b) <= 9999 && !(a === 1 && b === 1));
      const ans = nCr(4, i) * nCr(4, j) * fact(i + j), word = ['', '한', '두', '세', '네', '다섯'];
      return N(`네 개의 숫자 2, 4, 6, 8 중에서 서로 다른 ${i}개를 택하고, 네 개의 숫자 1, 3, 5, 7 중에서 서로 다른 ${j}개를 택하여 만들 수 있는 ${word[i + j]} 자리의 자연수의 개수는?`, ans, {
        unit: '개',
        explain: `짝수 숫자를 고르는 경우는 ${Cn(4, i)} = ${nCr(4, i)}(가지), 홀수 숫자를 고르는 경우는 ${Cn(4, j)} = ${nCr(4, j)}(가지)이다. 고른 ${i + j}개를 일렬로 나열하는 경우는 ${i + j}! = ${fact(i + j)}(가지)이므로 ${nCr(4, i)} × ${nCr(4, j)} × ${fact(i + j)} = ${ans}(개)이다.`,
        facts: { calc: [[`${combS(4, i)}*${combS(4, j)}*${factS(i + j)}`, 0]] }
      });
    }, { count: 2, standard: S2 }),
    T('num-order-digits', '자리 숫자의 크기 차례가 정해진 수(뽑으면 차례가 정해진다)', '②9', (d, n) => {
      const PL = ['일', '십', '백', '천', '만'];
      if (n === 0) {
        const k = d.int(3, 5), names = 'abcde'.slice(0, k).split('').map((ch) => V(ch)), places = range(0, k - 1).map((i) => PL[k - 1 - i]), ans = nCr(10, k);
        return N(`${['', '', '', '세', '네', '다섯'][k]} 자리의 자연수 중에서 ${places.join(', ')}의 자리의 숫자를 차례로 ${told(names)}라 할 때, ${nb(names.join(' &gt; '))}를 만족시키는 자연수의 개수는?`, ans, {
          unit: '개',
          explain: `0부터 9까지의 숫자 10개 가운데 서로 다른 ${k}개를 고르면 큰 것부터 차례로 놓는 한 가지로 정해진다. 가장 큰 숫자가 맨 앞에 오므로 0이 맨 앞에 오는 일도 없다. 따라서 ${Cn(10, k)} = ${ans}(개)이다.`,
          facts: { calc: [[combS(10, k), 0]] }
        });
      }
      const zero = d.bool(), pool = zero ? 10 : 9, ans = nCr(pool, 2) * nCr(pool - 2, 2);
      return N(`각 자리의 숫자가 모두 다른 네 자리의 자연수 중에서 천의 자리의 숫자가 백의 자리의 숫자보다 크고, 십의 자리의 숫자가 일의 자리의 숫자보다 큰 수의 개수는?${zero ? '' : ' (단, 각 자리의 숫자는 0이 아니다.)'}`, ans, {
        unit: '개',
        explain: `${zero ? '0부터 9까지의 숫자 10개' : '1부터 9까지의 숫자 9개'} 가운데 서로 다른 2개를 골라 큰 것을 천의 자리, 작은 것을 백의 자리에 놓는 경우는 ${Cn(pool, 2)} = ${nCr(pool, 2)}(가지)이다. 남은 ${pool - 2}개 가운데 2개를 골라 큰 것을 십의 자리, 작은 것을 일의 자리에 놓는 경우는 ${Cn(pool - 2, 2)} = ${nCr(pool - 2, 2)}(가지)이므로 ${nCr(pool, 2)} × ${nCr(pool - 2, 2)} = ${ans}(개)이다.`,
        facts: { calc: [[`${combS(pool, 2)}*${combS(pool - 2, 2)}`, 0]] }
      });
    }, { count: 2, standard: S2 }),
    T('num-nine-multiple', '9의 배수인 비밀번호', '②16', (d) => {
      // 원문(1부터 9까지의 숫자, 같은 숫자를 다시 써도 됨)대로면 천·십의 자리를 어떻게 정해도 답이 늘 9라서, 쓸 수 있는 숫자를 1부터 k까지로 줄인다.
      const k = d.int(5, 8), [u, h] = d.until(() => [d.int(1, k), d.int(1, k)], ([a, b]) => { const c = cart([range(1, k), range(1, k)]).filter(([x, y]) => (x + y + a + b) % 9 === 0).length; return c >= 3 && c <= 12; });
      const all = cart([range(1, k), range(1, k)]), flags = all.map(([x, y]) => (x + y + u + h) % 9 === 0), sums = range(2, 2 * k).filter((s) => (s + u + h) % 9 === 0);
      return N(`1부터 ${k}까지의 숫자만 사용하여 만든 네 자리의 비밀번호가 있다. 비밀번호의 일의 자리의 숫자는 ${u}, 백의 자리의 숫자는 ${h}이고, 비밀번호는 9의 배수이다. 비밀번호가 될 수 있는 것은 모두 몇 가지인가? (단, 같은 숫자를 여러 번 사용할 수 있다.)`, hits(flags), {
        unit: '가지',
        explain: `9의 배수는 각 자리의 숫자의 합이 9의 배수이다. 천의 자리의 숫자를 ${V('a')}, 십의 자리의 숫자를 ${V('b')}라 하면 ${nb(`${V('a')} + ${V('b')} + ${h + u}`)}${tail(h + u, '이/가')} 9의 배수이고 ${nb(`2 ≤ ${V('a')} + ${V('b')} ≤ ${2 * k}`)}이므로 ${sums.length === 1 ? nb(`${V('a')} + ${V('b')} = ${sums[0]}`) + '이다' : `${V('a')} + ${V('b')}는 ${told(sums)} 가운데 하나이다`}. `
          + sums.map((s) => { const list = all.filter(([x, y]) => x + y === s); return `${nb(`${V('a')} + ${V('b')} = ${s}`)}인 순서쌍은 ${list.map(([x, y]) => `(${x}, ${y})`).join(', ')}의 ${list.length}개`; }).join(', ') + (sums.length > 1 ? `이므로 모두 ${hits(flags)}가지이다.` : '이다.'),
        facts: { count: flags }
      });
    }, { standard: S2 })
  ];

  // ════════════════ 조합의 수 ════════════════
  const combTypes = [
    T('comb-value', '조합의 수의 값', '②18', (d) => {
      const a = d.int(6, 10), r = d.int(2, 4), m = d.int(8, 20), form = d.pick(['near', 'zero', 'all']), k = form === 'near' ? m - d.int(1, 2) : form === 'zero' ? 0 : m;
      const second = nCr(m, k), small = Math.min(k, m - k);
      return M(`${Cj(a, r, '과/와')} ${Cn(m, k)}의 값을 차례로 구하시오.`, [{ label: Cn(a, r) + ' =', answer: nCr(a, r) }, { label: Cn(m, k) + ' =', answer: second }], {
        explain: `${Cn(a, r)} = ${frac(range(0, r - 1).map((i) => a - i).join(' × '), range(1, r).reverse().join(' × '))} = ${nCr(a, r)}이다. ${form === 'near' ? `${Cn(m, k)} = ${Cn(m, m - k)} = ${second}이다.` : form === 'zero' ? `${Cn(m, 0)} = 1로 정한다.` : `${Cn(m, m)} = ${Cn(m, 0)} = 1이다.`}`,
        facts: { calc: [[combS(a, r), 0], [combS(m, small), 1]] }
      });
    }, { standard: S3 }),
    T('comb-blank', '조합의 수와 순열의 수의 관계 — 계산 과정의 빈칸', '②19 심1', (d, n) => {
      const m = d.int(5, 11), r = d.int(2, 4);
      if (n === 0) {
        return inline('조합의 수와 순열의 수 사이의 관계를 나타낸 다음 식에서 □ 안에 알맞은 수를 구하시오.', `${Cn(m, r)} × {0}! = ${Pn(m, r)}`, [{ answer: r }], {
          shown: `${Cn(m, r)} × ${r}! = ${Pn(m, r)}`,
          explain: `서로 다른 ${m}개에서 ${r}개를 택하는 조합 하나마다 택한 ${r}개를 일렬로 나열하는 경우가 ${r}!가지씩 있으므로 ${Cn(m, r)} × ${r}! = ${Pn(m, r)}이다.`,
          facts: { calc: [[String(r), 0]] }
        });
      }
      return inline('조합의 수를 구하는 다음 과정에서 □ 안에 알맞은 수를 차례로 구하시오.', `${Cn(m, r)} = ${frac('{0}', r + '!')} = {1}`, [{ answer: nPr(m, r) }, { answer: nCr(m, r) }], {
        shown: `${Cn(m, r)} = ${frac(nPr(m, r), r + '!')} = ${nCr(m, r)}`,
        explain: `${Cn(m, r)} = ${frac(Pn(m, r), r + '!')}이고 ${Pn(m, r)} = ${range(0, r - 1).map((i) => m - i).join(' × ')} = ${nPr(m, r)}이므로 ${frac(nPr(m, r), fact(r))} = ${nCr(m, r)}이다.`,
        facts: { calc: [[prodS(m, r), 0], [combS(m, r), 1]] }
      });
    }, { count: 2, standard: S3 }),
    T('comb-solve-n', 'ₙCᵣ = k에서 n 구하기', '②20', (d) => {
      const form = d.pick(['c2', 'c3', 'shift']);
      if (form === 'c2') {
        const m = d.int(5, 15), k = nCr(m, 2);
        return N(`등식 ${Cn(vn, 2)} = ${josa(k, '을/를')} 만족시키는 자연수 ${vn}의 값은?`, m, { explain: `${Cn(vn, 2)} = ${frac(`${vn}(${vn} − 1)`, 2)} = ${k}에서 ${eqn(`${vn}(${vn} − 1) = ${2 * k} = ${m} × ${m - 1}`)}이므로 ${vn} = ${m}이다.`, facts: eqDigit(`${polyX(2)}/2`, k, 1, 40) });
      }
      if (form === 'c3') {
        const m = d.int(5, 10), k = nCr(m, 3);
        return N(`등식 ${Cn(vn, 3)} = ${josa(k, '을/를')} 만족시키는 자연수 ${vn}의 값은?`, m, { explain: `${Cn(vn, 3)} = ${frac(`${vn}(${vn} − 1)(${vn} − 2)`, 6)} = ${k}에서 ${eqn(`${vn}(${vn} − 1)(${vn} − 2) = ${6 * k} = ${m} × ${m - 1} × ${m - 2}`)}이므로 ${vn} = ${m}이다.`, facts: eqDigit(`${polyX(3)}/6`, k, 2, 30) });
      }
      const m = d.int(2, 10), k = nCr(m + 2, 2);
      return N(`등식 ${Cn(nb(vn + '+2'), 2)} = ${josa(k, '을/를')} 만족시키는 자연수 ${vn}의 값은?`, m, { explain: `${Cn(nb(vn + '+2'), 2)} = ${frac(`(${vn} + 2)(${vn} + 1)`, 2)} = ${k}에서 ${eqn(`(${vn} + 2)(${vn} + 1) = ${2 * k} = ${m + 2} × ${m + 1}`)}이므로 ${vn} + 2 = ${m + 2}, ${vn} = ${m}이다.`, facts: eqDigit('(□+2)*(□+1)/2', k, 0, 40) });
    }, { standard: S3 }),
    T('comb-symmetric', 'ₙCᵣ = ₙCₙ₋ᵣ로 n이나 r 찾기', '②21', (d, n) => {
      if (n === 0) {
        const a = d.int(2, 4), b = d.int(a + 1, 8), m = a + b;
        return N(`등식 ${Cn(vn, a)} = ${Cj(vn, b, '을/를')} 만족시키는 자연수 ${vn}의 값은?`, m, {
          explain: `${Cn(vn, a)} = ${Cn(vn, nb(`${vn}${MINUS}${a}`))}이므로 ${nb(`${vn} − ${a} = ${b}`)}에서 ${vn} = ${m}이다.`,
          facts: eqDigit(`(${polyX(a)})/(${factS(a)})-(${polyX(b)})/(${factS(b)})`, 0, b, 30)
        });
      }
      const form = d.pick(['plus', 'minus', 'triple']);
      if (form === 'plus') {
        const k = d.int(1, 4), r = d.int(2, 6), m = 2 * r + k;
        return N(`등식 ${Cn(m, vr)} = ${Cn(m, nb(`${vr}+${k}`)) + tail(k, '을/를')} 만족시키는 자연수 ${vr}의 값은?`, r, {
          explain: `${vr} = ${vr} + ${k}${tail(k, '은/는')} 될 수 없으므로 ${Cn(m, vr)} = ${Cn(m, nb(`${m}${MINUS}${vr}`))}에서 ${nb(`${vr} + ${k} = ${m} − ${vr}`)}이다. 따라서 ${nb(`2${vr} = ${m - k}`)}, ${vr} = ${r}이다.`,
          facts: eqDigit(`${combX(m, '□')}-${combX(m, `(□+${k})`)}`, 0, 0, m - k)
        });
      }
      if (form === 'minus') {
        const m = 2 * d.int(3, 6), r = m / 2 + 1;
        return N(`등식 ${Cn(m, vr)} = ${Cn(m, nb(`${vr}${MINUS}2`))}를 만족시키는 자연수 ${vr}의 값은?`, r, {
          explain: `${vr} = ${vr} − 2는 될 수 없으므로 ${nb(`${vr} + (${vr} − 2) = ${m}`)}이다. 따라서 ${nb(`2${vr} = ${m + 2}`)}, ${vr} = ${r}이다.`,
          facts: eqDigit(`${combX(m, '□')}-${combX(m, '(□-2)')}`, 0, 2, m)
        });
      }
      const r = d.int(1, 3), m = 4 * r + 2;
      return N(`등식 ${Cn(m, vr)} = ${Cn(m, nb(`3${vr}+2`))}를 만족시키는 음이 아닌 정수 ${vr}의 값은?`, r, {
        explain: `${nb(`${vr} = 3${vr} + 2`)}이면 ${vr} = −1이 되어 알맞지 않다. 따라서 ${nb(`${vr} + (3${vr} + 2) = ${m}`)}에서 ${nb(`4${vr} = ${m - 2}`)}, ${vr} = ${r}이다.`,
        facts: eqDigit(`${combX(m, '□')}-${combX(m, '(3*□+2)')}`, 0, 0, Math.floor((m - 2) / 3))
      });
    }, { count: 2, standard: S3 }),
    T('comb-equation', '순열의 수와 조합의 수가 섞인 등식', '②22 심2 심3', (d, n) => {
      if (n === 0) {
        const m = d.int(5, 9), r = d.int(2, 4), P0 = nPr(m, r), C0 = nCr(m, r), Sx = P0 + C0, Dx = P0 - C0;
        const cands = [[m + 1, r], [m - 1, r], [m, r + 1], [m, r - 1], [m + 1, r - 1], [m - 1, r + 1], [m + 2, r - 1]].filter(([a, b]) => b >= 1 && b <= a && nPr(a, b) + nCr(a, b) !== Sx);
        const opts = d.shuffle([[m, r]].concat(d.shuffle(cands).slice(0, 4)));
        return C(`자연수 ${vn}, ${vr}에 대하여 ${nb(`${Pn(vn, vr)} + ${Cn(vn, vr)} = ${Sx}`)}, ${nb(`${Pn(vn, vr)} − ${Cn(vn, vr)} = ${Dx}`)}일 때, ${vn}, ${vr}의 값은?`, opts.map(([a, b]) => `${vn} = ${a}, ${vr} = ${b}`), opts.findIndex(([a, b]) => a === m && b === r), {
          explain: `두 등식을 더하고 빼면 ${Pn(vn, vr)} = ${P0}, ${Cn(vn, vr)} = ${C0}이다. ${eqn(`${Cn(vn, vr)} × ${vr}! = ${Pn(vn, vr)}`)}이므로 ${vr}! = ${P0} ÷ ${C0} = ${P0 / C0}, ${vr} = ${r}이다. ${eqn(`${Pn(vn, r)} = ${P0} = ${range(0, r - 1).map((i) => m - i).join(' × ')}`)}이므로 ${vn} = ${m}이다.`,
          facts: { claimed: opts.map(([a, b]) => [`${prodS(a, b)}+${combS(a, b)}`, Sx]), claimedWant: true }
        });
      }
      const form = d.pick(['sum', 'ratio', 'diff']);
      if (form === 'sum') {
        const c = d.int(2, 3), m = 6 * c - 4;
        return N(`등식 ${Cn(vn, 2)} + ${Cn(nb(vn + '+1'), 3)} = ${c} × ${Pj(vn, 2, '을/를')} 만족시키는 자연수 ${vn}의 값은? (단, ${nb(`${vn} ≥ 2`)})`, m, {
          explain: `${eqn(`${frac(`${vn}(${vn} − 1)`, 2)} + ${frac(`(${vn} + 1)${vn}(${vn} − 1)`, 6)} = ${c}${vn}(${vn} − 1)`)}에서 ${eqn(`${vn}(${vn} − 1) ≠ 0`)}이므로 양변을 ${eqn(`${vn}(${vn} − 1)`)}로 나누고 6을 곱하면 ${eqn(`3 + (${vn} + 1) = ${6 * c}`)}이다. 따라서 ${vn} = ${m}이다.`,
          facts: eqDigit(`${polyX(2)}/2+(□+1)*□*(□-1)/6-${c}*${polyX(2)}`, 0, 2, 40)
        });
      }
      if (form === 'ratio') {
        const [a, b] = d.pick([[2, 3], [1, 1], [2, 1], [1, 2], [3, 2]]), m = 2 + 6 * b / a;
        return N(`등식 ${a === 1 ? '' : a + ' × '}${Cn(vn, 3)} = ${b === 1 ? '' : b + ' × '}${Pj(vn, 2, '을/를')} 만족시키는 자연수 ${vn}의 값은?`, m, {
          explain: `${eqn(`${a === 1 ? '' : a + ' × '}${frac(`${vn}(${vn} − 1)(${vn} − 2)`, 6)} = ${b === 1 ? '' : b}${vn}(${vn} − 1)`)}에서 ${vn} ≥ 3이므로 양변을 ${eqn(`${vn}(${vn} − 1)`)}로 나누면 ${eqn(`${a === 1 ? '' : a}(${vn} − 2) = ${6 * b}`)}이다. 따라서 ${vn} − 2 = ${6 * b / a}, ${vn} = ${m}이다.`,
          facts: eqDigit(`${a}*${polyX(3)}/6-${b}*${polyX(2)}`, 0, 2, 40)
        });
      }
      const [m, c] = d.until(() => [d.int(5, 12), d.int(4, 8)], ([x, y]) => x * (x - 1) - nCr(y, 2) > 0), k = m * (m - 1) - nCr(c, 2);
      return N(`등식 ${Pn(vn, 2)} − ${Cn(c, 2)} = ${josa(k, '을/를')} 만족시키는 자연수 ${vn}의 값은?`, m, {
        explain: `${Cn(c, 2)} = ${nCr(c, 2)}이므로 ${eqn(`${vn}(${vn} − 1) = ${k} + ${nCr(c, 2)} = ${m * (m - 1)}`)}이다. ${m * (m - 1)} = ${m} × ${m - 1}이므로 ${vn} = ${m}이다.`,
        facts: eqDigit(polyX(2), k + nCr(c, 2), 1, 40)
      });
    }, { count: 2, standard: S3 }),
    T('comb-proof', '조합의 수의 성질 — 증명 과정의 빈칸', '②23', (d) => {
      const nm = MINUS, fr = frac, SAMPLES = [[5, 2], [6, 3], [7, 4], [8, 3], [6, 1], [9, 5], [7, 2]];
      const P = (n0) => (n0 < 0 ? NaN : fact(n0));
      if (d.bool()) {
        // n × ₙ₋₁Cᵣ₋₁ = n × ㈎/((r−1)!(n−r)!) = ㈏/((r−1)!(n−r)!) = r × ㈏/(㈐ (n−r)!) = r × ₙCᵣ
        const X = [[`(${vn}${nm}1)!`, (a) => P(a - 1)], [`${vn}!`, (a) => P(a)], [`(${vn}${nm}${vr})!`, (a, r) => P(a - r)]];
        const Y = [[`${vn}!`, (a) => P(a)], [`(${vn}${nm}1)!`, (a) => P(a - 1)], [`(${vn}+1)!`, (a) => P(a + 1)]];
        const Z = [[`${vr}!`, (a, r) => P(r)], [`(${vr}${nm}1)!`, (a, r) => P(r - 1)], [`(${vr}+1)!`, (a, r) => P(r + 1)]];
        const ok = ([i, j, k]) => SAMPLES.every(([a, r]) => { const base = P(r - 1) * P(a - r), want = a * nCr(a - 1, r - 1); return a * X[i][1](a, r) / base === want && Y[j][1](a, r) / base === want && r * Y[j][1](a, r) / (Z[k][1](a, r) * P(a - r)) === r * nCr(a, r); });
        const pool = d.shuffle(cart([[0, 1, 2], [0, 1, 2], [0, 1, 2]])).filter((t) => !ok(t)).slice(0, 4).concat([[0, 0, 0]]), shown = d.shuffle(pool);
        return C(`다음은 ${nb(`1 ≤ ${vr} ≤ ${vn}`)}일 때, 등식 ${nb(`${vr} × ${Cn(vn, vr)} = ${vn} × ${Cn(`${vn}${nm}1`, `${vr}${nm}1`)}`)}이 성립함을 보이는 과정이다. ㈎, ㈏, ㈐에 알맞은 것을 차례로 나열한 것은?`,
          shown.map(([i, j, k]) => `㈎ ${X[i][0]}, ㈏ ${Y[j][0]}, ㈐ ${Z[k][0]}`), shown.findIndex((t) => t.join() === '0,0,0'), {
            figure: proc([{ h: `${vn} × ${Cn(`${vn}${nm}1`, `${vr}${nm}1`)}` }, { h: `${vn} × ${fr(box('㈎'), `(${vr}${nm}1)!(${vn}${nm}${vr})!`)}` }, { h: `${fr(box('㈏'), `(${vr}${nm}1)!(${vn}${nm}${vr})!`)}` }, { h: `${vr} × ${fr(box('㈏'), `${box('㈐')}(${vn}${nm}${vr})!`)} = ${vr} × ${Cn(vn, vr)}` }]),
            explain: `${Cn(`${vn}${nm}1`, `${vr}${nm}1`)} = ${fr(`(${vn}${nm}1)!`, `(${vr}${nm}1)!(${vn}${nm}${vr})!`)}이므로 ㈎는 (${vn} − 1)!이다. ${vn} × (${vn} − 1)! = ${vn}!이므로 ㈏는 ${vn}!이다. 분모의 (${vr} − 1)!에 ${vr}을 곱하면 ${vr}!이 되므로 분자와 분모에 ${vr}을 곱하여 ${vr} × ${fr(`${vn}!`, `${vr}!(${vn}${nm}${vr})!`)}로 나타낸다. ㈐는 ${vr}!이다.`,
            facts: { truth: shown.map(ok), want: true }
          });
      }
      // ₙ₋₁Cᵣ + ₙ₋₁Cᵣ₋₁ = (n−1)!/(r!(n−r−1)!) + (n−1)!/㈎ = ㈏ × (n−1)!/(r!(n−r)!) = n!/(r!(n−r)!) = ₙCᵣ
      const X = [[`(${vr}${nm}1)!(${vn}${nm}${vr})!`, (a, r) => P(r - 1) * P(a - r)], [`${vr}!(${vn}${nm}${vr})!`, (a, r) => P(r) * P(a - r)], [`(${vr}${nm}1)!(${vn}${nm}${vr}${nm}1)!`, (a, r) => P(r - 1) * P(a - r - 1)]];
      const Y = [[vn, (a) => a], [nb(`${vn}${nm}1`), (a) => a - 1], [vr, (a, r) => r]];
      const ok = ([i, j]) => SAMPLES.filter(([a, r]) => r < a).every(([a, r]) => P(a - 1) / X[i][1](a, r) === nCr(a - 1, r - 1) && Y[j][1](a, r) * P(a - 1) / (P(r) * P(a - r)) === nCr(a, r));
      const pool = d.shuffle(cart([[0, 1, 2], [0, 1, 2]])).filter((t) => !ok(t)).slice(0, 3).concat([[0, 0]]), shown = d.shuffle(pool);
      return C(`다음은 ${nb(`1 ≤ ${vr} &lt; ${vn}`)}일 때, 등식 ${nb(`${Cn(vn, vr)} = ${Cn(`${vn}${nm}1`, vr)} + ${Cn(`${vn}${nm}1`, `${vr}${nm}1`)}`)}이 성립함을 보이는 과정이다. ㈎, ㈏에 알맞은 것을 차례로 나열한 것은?`,
        shown.map(([i, j]) => `㈎ ${X[i][0]}, ㈏ ${Y[j][0]}`), shown.findIndex((t) => t.join() === '0,0'), {
          figure: proc([{ h: `${Cn(`${vn}${nm}1`, vr)} + ${Cn(`${vn}${nm}1`, `${vr}${nm}1`)}` }, { h: `${fr(`(${vn}${nm}1)!`, `${vr}!(${vn}${nm}${vr}${nm}1)!`)} + ${fr(`(${vn}${nm}1)!`, box('㈎'))}` }, { h: `${fr(`${box('㈏')} × (${vn}${nm}1)!`, `${vr}!(${vn}${nm}${vr})!`)}` }, { h: `${fr(`${vn}!`, `${vr}!(${vn}${nm}${vr})!`)} = ${Cn(vn, vr)}` }]),
          explain: `${Cn(`${vn}${nm}1`, `${vr}${nm}1`)}의 분모는 (${vr} − 1)!(${vn} − ${vr})!이므로 ㈎이다. 두 분수를 분모 ${vr}!(${vn} − ${vr})!로 통분하면 분자는 ${nb(`{(${vn} − ${vr}) + ${vr}} × (${vn} − 1)!`)}이므로 ㈏는 ${vn}이다.`,
          facts: { truth: shown.map(ok), want: true }
        });
    }, { standard: S3 }),
    T('comb-claims', '순열·조합의 등식 가운데 옳지 않은 것', '②25', (d) => {
      const nm = MINUS, P = (a, r) => nPr(a, r), Cc = (a, r) => nCr(a, r), F = fact, SAMPLES = [[5, 2], [6, 3], [7, 4], [8, 3], [6, 1], [9, 5], [7, 6]];
      const yes = [
        [`${Cn(vn, 0)} = ${Cn(vn, vn)}`, (a) => Cc(a, 0) === Cc(a, a)],
        [`${Cn(vn, vr)} × ${vr}! = ${Pn(vn, vr)}`, (a, r) => Cc(a, r) * F(r) === P(a, r)],
        [`${Cn(vn, vr)} = ${frac(`${vn}!`, `${vr}!(${vn}${nm}${vr})!`)}`, (a, r) => Cc(a, r) === F(a) / (F(r) * F(a - r))],
        [`${vr} × ${Cn(vn, vr)} = ${vn} × ${Cn(`${vn}${nm}1`, `${vr}${nm}1`)}`, (a, r) => r * Cc(a, r) === a * Cc(a - 1, r - 1)],
        [`${Cn(vn, vr)} = ${Cn(vn, `${vn}${nm}${vr}`)}`, (a, r) => Cc(a, r) === Cc(a, a - r)],
        [`${Pn(vn, vr)} = ${vn} × ${Pn(`${vn}${nm}1`, `${vr}${nm}1`)}`, (a, r) => P(a, r) === a * P(a - 1, r - 1)]
      ];
      const no = [
        [`${Pn(`${vn}+1`, vr)} = (${vn} + 1) × ${Pn(vn, vr)}`, (a, r) => P(a + 1, r) === (a + 1) * P(a, r)],
        [`${Pn(vn, vr)} = ${frac(`${vn}!`, `${vr}!`)}`, (a, r) => P(a, r) === F(a) / F(r)],
        [`${Cn(vn, vr)} = ${Pn(vn, vr)} × ${vr}!`, (a, r) => Cc(a, r) === P(a, r) * F(r)]
      ];
      const rows = d.shuffle(d.shuffle(yes).slice(0, 4).concat([d.pick(no)]));
      const truth = rows.map(([, f]) => SAMPLES.every(([a, r]) => f(a, r)));
      const at0 = truth.indexOf(false), bad = rows[at0][0];
      const fix = { [no[0][0]]: `${Pn(`${vn}+1`, vr)} = ${frac(`(${vn}+1)!`, `(${vn}+1${nm}${vr})!`)}이므로 (${vn} + 1) × ${Pn(vn, vr)} = ${frac(`(${vn}+1)!`, `(${vn}${nm}${vr})!`)}과 다르다.`, [no[1][0]]: `${Pn(vn, vr)} = ${frac(`${vn}!`, `(${vn}${nm}${vr})!`)}이다.`, [no[2][0]]: `${Cn(vn, vr)} = ${frac(Pn(vn, vr), `${vr}!`)}이다.` };
      return C(`다음 등식 중 옳지 않은 것은? (단, ${nb(`1 ≤ ${vr} &lt; ${vn}`)})`, rows.map(([s]) => s), at0, {
        explain: `${bad}은 옳지 않다. ${fix[bad]}`,
        facts: { truth, want: false }
      });
    }, { standard: S3 }),
    T('comb-classify', '덧셈과 곱셈, 순열과 조합을 상황으로 가르기', '②26', (d, n) => {
      if (n === 0) {
        const prod = d.pick([['떡 반죽', '앙금', '각각 한 가지씩 골라 송편을 만드는'], ['티셔츠', '바지', '각각 하나씩 골라 입는'], ['빵', '음료', '각각 하나씩 골라 사는']]);
        const add = d.pick([['엽서', '편지지', '가운데 하나만 골라 편지를 쓰는'], ['버스 노선', '지하철 노선', '가운데 하나를 골라 학교에 가는'], ['소설책', '시집', '가운데 한 권만 골라 읽는']]);
        const [a, b, c, e] = [d.int(2, 6), d.int(2, 6), d.int(2, 6), d.int(2, 6)], first = d.bool();
        const rows = first ? [['×', prod, a, b], ['+', add, c, e]] : [['+', add, c, e], ['×', prod, a, b]];
        const opts = ['+, +', '+, ×', '×, +', '×, ×'], want = rows.map((r) => r[0]).join(', ');
        const say = ([, [x, y, act], p, q], tagC) => `서로 다른 ${x} ${p}종류와 ${y} ${q}종류${act.startsWith('가운데') ? '' : '에서'} ${act} 경우의 수는 ${p} ${box(tagC)} ${q}이다.`;
        return C('다음 □ 안에 덧셈 기호(+)와 곱셈 기호(×) 가운데 알맞은 것을 차례로 써넣을 때, ㉠, ㉡에 알맞은 것을 차례로 나열한 것은?', opts.map((o) => `㉠ ${o.split(', ')[0]}, ㉡ ${o.split(', ')[1]}`), opts.indexOf(want), {
          figure: lines([say(rows[0], '㉠'), say(rows[1], '㉡')]),
          explain: `하나만 고르는 것은 두 사건이 동시에 일어나지 않으므로 합의 법칙(+), 하나씩 골라 함께 쓰는 것은 잇달아 일어나므로 곱의 법칙(×)이다.`,
          facts: { truth: opts.map((o) => o === want), want: true }
        });
      }
      const [a, b, p, q, m, k] = d.until(() => [d.int(2, 5), d.int(2, 4), d.int(2, 5), d.int(2, 3), d.int(6, 9), d.int(3, 4)], ([a0, b0, p0, q0, m0, k0]) => new Set([a0 + b0, p0 * q0, nPr(m0, k0), nCr(m0, k0)]).size === 4);
      const rows = d.shuffle([
        [`버스 노선 ${a}개와 지하철 노선 ${b}개 가운데 하나를 골라 이용하는 경우`, `${a}+${b}`],
        [`서로 다른 장소 ${m}곳 가운데 ${k}곳을 골라 방문하는 차례를 정하는 경우`, prodS(m, k)],
        [`셔츠 ${p}종류와 바지 ${q}종류에서 하나씩 골라 입는 경우`, `${p}*${q}`],
        [`서로 다른 할 일 ${m}가지 가운데 꼭 해야 할 ${k}가지를 고르는 경우`, combS(m, k)]
      ]);
      const askPerm = d.bool(), target = askPerm ? nPr(m, k) : nCr(m, k);
      return C(`다음 가운데 경우의 수가 ${askPerm ? Pn(m, k) : Cn(m, k)}인 것은?`, rows.map(([s]) => s), rows.findIndex(([, e]) => e === (askPerm ? prodS(m, k) : combS(m, k))), {
        explain: askPerm ? `${k}곳을 골라 방문하는 차례를 정하는 것은 서로 다른 ${m}개에서 ${k}개를 택하여 일렬로 나열하는 순열이므로 ${Pn(m, k)}이다.` : `${k}가지를 고르기만 하는 것은 차례를 생각하지 않으므로 서로 다른 ${m}개에서 ${k}개를 택하는 조합이고 ${Cn(m, k)}이다.`,
        facts: { choose: { exprs: rows.map(([, e]) => e), rule: 'equals', target } }
      });
    }, { count: 2, standard: S3 })
  ];

  // ════════════════ 조합의 활용 — 뽑기 ════════════════
  const pickTypes = [
    T('pick-basic', '서로 다른 n개에서 r개 뽑기', '②27', (d, n) => {
      if (n === 0) {
        const [thing, unitW, act] = d.pick([['소스', '가지', '골라 핫도그에 뿌리는'], ['과자', '종류', '골라 선물 상자에 담는'], ['가방', '개', '고르는'], ['탁구 선수', '명', '시합에 나갈 선수로 뽑는']]), m = d.int(6, 12), r = d.int(3, 5), ans = nCr(m, r);
        return N(`${unitW === '명' ? '' : '서로 다른 '}${thing} ${m}${unitW} 가운데 ${r}${josa(unitW, '을/를')} ${act} 경우의 수는?`, ans, {
          unit: '가지',
          explain: `차례를 생각하지 않고 서로 다른 ${m}개에서 ${r}개를 택하는 조합의 수이므로 ${Cn(m, r)} = ${frac(range(0, r - 1).map((i) => m - i).join(' × '), range(1, r).reverse().join(' × '))} = ${ans}(가지)이다.`,
          facts: { calc: [[combS(m, r), 0]], rule: 'pick-few' }
        });
      }
      const m = d.int(6, 12), k = d.int(2, 3);
      return M(`모둠원 ${m}명 가운데 보고서를 쓸 ${k}명을 뽑으려고 한다. 보고서를 쓸 ${k}명을 뽑는 경우의 수와 보고서를 쓰지 않을 ${m - k}명을 뽑는 경우의 수를 차례로 구하시오.`, [{ label: '쓸 사람', answer: nCr(m, k), unit: '가지' }, { label: '쓰지 않을 사람', answer: nCr(m, m - k), unit: '가지' }], {
        explain: `쓸 ${k}명을 뽑는 경우는 ${Cn(m, k)} = ${nCr(m, k)}(가지)이다. 쓰지 않을 ${m - k}명을 뽑으면 남은 ${k}명이 저절로 정해지므로 ${Cn(m, m - k)} = ${Cn(m, k)} = ${nCr(m, k)}(가지)로 같다.`,
        facts: { calc: [[combS(m, k), 0], [combS(m, k), 1]] }
      });
    }, { count: 2, standard: S3 }),
    T('pick-two-groups', '두 무리에서 각각 몇 개씩 뽑기', '②28 심8', (d) => {
      const [ga, gb, unitW] = d.pick([['남학생', '여학생', '명'], ['과일', '채소', '종류'], ['경량급 선수', '중량급 선수', '명'], ['1학년 학생', '2학년 학생', '명']]);
      const [a, b, x, y] = d.until(() => [d.int(4, 10), d.int(4, 10), d.int(1, 4), d.int(1, 4)], ([a0, b0, x0, y0]) => x0 < a0 && y0 < b0 && x0 + y0 >= 3 && nCr(a0, x0) * nCr(b0, y0) <= 9999);
      const ans = nCr(a, x) * nCr(b, y), kind = unitW === '종류' ? '서로 다른 ' : '';
      return N(`${kind}${ga} ${a}${unitW}과 ${kind}${gb} ${b}${unitW} 중에서 ${ga} ${x}${unitW}과 ${gb} ${y}${josa(unitW, '을/를')} 뽑는 경우의 수는?`, ans, {
        unit: '가지',
        explain: `${ga} ${a}${unitW} 중에서 ${x}${josa(unitW, '을/를')} 뽑는 경우는 ${Cn(a, x)} = ${nCr(a, x)}(가지), ${gb} ${b}${unitW} 중에서 ${y}${josa(unitW, '을/를')} 뽑는 경우는 ${Cn(b, y)} = ${nCr(b, y)}(가지)이다. 곱의 법칙에 의하여 ${nCr(a, x)} × ${nCr(b, y)} = ${ans}(가지)이다.`,
        facts: { calc: [[`${combS(a, x)}*${combS(b, y)}`, 0]] }
      });
    }, { standard: S3 }),
    T('pick-then-line', '뽑은 뒤 나열하거나 자격을 나누어 뽑기', '②29', (d, n) => {
      if (n === 0) {
        const [a, b, x, y] = d.until(() => [d.int(4, 6), d.int(3, 5), d.int(1, 3), d.int(1, 2)], ([a0, b0, x0, y0]) => x0 <= a0 && y0 <= b0 && x0 + y0 >= 3 && nCr(a0, x0) * nCr(b0, y0) * fact(x0 + y0) <= 9999);
        const ans = nCr(a, x) * nCr(b, y) * fact(x + y);
        return N(`남학생 ${a}명과 여학생 ${b}명 중에서 남학생 ${x}명, 여학생 ${y}명을 뽑아 이 ${x + y}명을 일렬로 세우는 경우의 수는?`, ans, {
          unit: '가지',
          explain: `남학생을 뽑는 경우는 ${Cn(a, x)} = ${nCr(a, x)}(가지), 여학생을 뽑는 경우는 ${Cn(b, y)} = ${nCr(b, y)}(가지)이고, 뽑은 ${x + y}명을 일렬로 세우는 경우는 ${x + y}! = ${fact(x + y)}(가지)이다. 따라서 ${nCr(a, x)} × ${nCr(b, y)} × ${fact(x + y)} = ${ans}(가지)이다.`,
          facts: { calc: [[`${combS(a, x)}*${combS(b, y)}*${factS(x + y)}`, 0]] }
        });
      }
      if (n === 1) {
        const notes = ['도', '레', '미', '파', '솔', '라', '시'].slice(0, d.int(5, 7)), k = notes.length, ans = nPr(k, 3) * 3;
        return N(`${told(notes)} 중에서 서로 다른 3개의 음을 택하여 2분음표 1개와 4분음표 2개로 이루어진 4분의 4박자 악보 한 마디를 만들려고 한다. 만들 수 있는 서로 다른 마디의 개수는? (단, 한 옥타브 안에서 생각한다.)`, ans, {
          unit: '개',
          explain: `${k}개의 음 가운데 서로 다른 3개를 택하여 차례로 놓는 경우는 ${Pn(k, 3)} = ${nPr(k, 3)}(가지)이다. 그 각각에 대하여 세 음 가운데 2분음표로 쓸 음을 정하는 경우는 ${Cn(3, 1)} = 3(가지)이므로 ${nPr(k, 3)} × 3 = ${ans}(개)이다.`,
          facts: { calc: [[`${prodS(k, 3)}*3`, 0]] }
        });
      }
      const m = d.int(6, 12), ans = m * nCr(m - 1, 2);
      return N(`${m}명으로 이루어진 학생회에서 회장 1명과 부회장 2명을 뽑는 경우의 수는?`, ans, {
        unit: '가지',
        explain: `회장 1명을 뽑는 경우는 ${m}가지이고, 그 각각에 대하여 나머지 ${m - 1}명 중에서 자격이 같은 부회장 2명을 뽑는 경우는 ${Cn(m - 1, 2)} = ${nCr(m - 1, 2)}(가지)이다. 따라서 ${m} × ${nCr(m - 1, 2)} = ${ans}(가지)이다.`,
        facts: { calc: [[`${m}*${combS(m - 1, 2)}`, 0]] }
      });
    }, { count: 3, standard: S3 }),
    T('pick-fixed', '특정한 사람을 넣거나 빼고 뽑기', '②30', (d, n) => {
      if (n === 0) {
        const m = d.int(8, 14), r = d.int(3, 5), ans = nCr(m - 2, r - 1);
        return N(`A, B를 포함한 ${m}명의 학생 중에서 ${r}명의 대표를 뽑을 때, A는 뽑히고 B는 뽑히지 않는 경우의 수는?`, ans, {
          unit: '가지',
          explain: `A를 먼저 뽑아 두고, A와 B를 뺀 ${m - 2}명 중에서 나머지 ${r - 1}명을 뽑으면 된다. 따라서 ${Cn(m - 2, r - 1)} = ${ans}(가지)이다.`,
          facts: { calc: [[combS(m - 2, r - 1), 0]] }
        });
      }
      const m = d.int(7, 11), r = d.int(3, 5), j = d.int(1, 2), ans = nCr(3, j) * nCr(m - 3, r - j);
      return N(`A, B, C를 포함한 ${m}명의 학생 중에서 ${r}명을 뽑을 때, A, B, C 중에서 ${j}명만 뽑히는 경우의 수는?`, ans, {
        unit: '가지',
        explain: `A, B, C 중에서 ${j}명을 뽑는 경우는 ${Cn(3, j)} = ${nCr(3, j)}(가지)이고, 나머지 ${m - 3}명 중에서 ${r - j}명을 뽑는 경우는 ${Cn(m - 3, r - j)} = ${nCr(m - 3, r - j)}(가지)이다. 따라서 ${nCr(3, j)} × ${nCr(m - 3, r - j)} = ${ans}(가지)이다.`,
        facts: { calc: [[`${combS(3, j)}*${combS(m - 3, r - j)}`, 0]] }
      });
    }, { count: 2, standard: S3 }),
    T('pick-at-least', '적어도 하나가 들어가게 뽑기(여사건)', '②31', (d, n) => {
      if (n === 0) {
        if (d.bool()) {
          const [a, b, r] = d.until(() => [d.int(3, 7), d.int(3, 7), d.int(2, 4)], ([a0, b0, r0]) => r0 <= b0 && nCr(a0 + b0, r0) <= 9999), ans = nCr(a + b, r) - nCr(b, r);
          return N(`여학생 ${a}명, 남학생 ${b}명 중에서 대표 ${r}명을 뽑을 때, 여학생이 적어도 1명 포함되는 경우의 수는?`, ans, {
            unit: '가지',
            explain: `전체 ${a + b}명 중에서 ${r}명을 뽑는 경우는 ${Cn(a + b, r)} = ${nCr(a + b, r)}(가지)이다. 이 가운데 남학생만 뽑는 경우는 ${Cn(b, r)} = ${nCr(b, r)}(가지)이므로 ${nCr(a + b, r)} − ${nCr(b, r)} = ${ans}(가지)이다.`,
            facts: { calc: [[`${combS(a + b, r)}-${combS(b, r)}`, 0]], rule: 'people' }
          });
        }
        const N0 = d.int(8, 12), r = d.int(2, 3), odd = d.bool(), oddN = Math.ceil(N0 / 2), evenN = Math.floor(N0 / 2), other = odd ? evenN : oddN, ans = nCr(N0, r) - nCr(other, r);
        return N(`1부터 ${N0}까지의 자연수가 하나씩 적힌 공 ${N0}개 중에서 ${r}개를 동시에 꺼낼 때, ${odd ? '홀수' : '짝수'}가 적힌 공이 적어도 1개 포함되는 경우의 수는?`, ans, {
          unit: '가지',
          explain: `${r}개를 꺼내는 모든 경우는 ${Cn(N0, r)} = ${nCr(N0, r)}(가지)이다. 이 가운데 ${odd ? '짝수' : '홀수'}가 적힌 공만 꺼내는 경우는 ${Cn(other, r)} = ${nCr(other, r)}(가지)이므로 ${nCr(N0, r)} − ${nCr(other, r)} = ${ans}(가지)이다.`,
          facts: { calc: [[`${combS(N0, r)}-${combS(other, r)}`, 0]], rule: 'balls' }
        });
      }
      const [a, b] = [d.int(4, 9), d.int(3, 8)], ans = nPr(a + b, 2) - nPr(a, 2);
      return N(`남학생 ${a}명, 여학생 ${b}명 중에서 반장 1명, 부반장 1명을 뽑을 때, 반장과 부반장 중에서 적어도 한 명은 여학생인 경우의 수는?`, ans, {
        unit: '가지',
        explain: `반장과 부반장을 뽑는 모든 경우는 ${Pn(a + b, 2)} = ${nPr(a + b, 2)}(가지)이다. 둘 다 남학생인 경우는 ${Pn(a, 2)} = ${nPr(a, 2)}(가지)이므로 ${nPr(a + b, 2)} − ${nPr(a, 2)} = ${ans}(가지)이다.`,
        facts: { calc: [[`${prodS(a + b, 2)}-${prodS(a, 2)}`, 0]] }
      });
    }, { count: 2, standard: S3 }),
    T('pick-both-groups', '두 무리 모두에서 적어도 하나씩 뽑기', '②32', (d) => {
      const [a, b, r] = d.until(() => [d.int(4, 8), d.int(4, 8), d.int(3, 4)], ([a0, b0, r0]) => nCr(a0 + b0, r0) <= 9999), ans = nCr(a + b, r) - nCr(a, r) - nCr(b, r);
      return N(`남학생 ${a}명과 여학생 ${b}명이 봉사활동에 지원하였다. 지원자 중에서 ${r}명을 뽑을 때, 남학생과 여학생이 각각 적어도 1명씩 포함되는 경우의 수는?`, ans, {
        unit: '가지',
        explain: `${a + b}명 중에서 ${r}명을 뽑는 경우는 ${Cn(a + b, r)} = ${nCr(a + b, r)}(가지)이다. 남학생만 뽑는 ${Cn(a, r)} = ${nCr(a, r)}(가지)와 여학생만 뽑는 ${Cn(b, r)} = ${nCr(b, r)}(가지)를 빼면 ${nCr(a + b, r)} − ${nCr(a, r)} − ${nCr(b, r)} = ${ans}(가지)이다.`,
        facts: { calc: [[`${combS(a + b, r)}-${combS(a, r)}-${combS(b, r)}`, 0]] }
      });
    }, { standard: S3 }),
    T('pick-at-least-each', '두 무리에서 각각 몇 명 이상 뽑기(경우 나누어 더하기)', '②33', (d) => {
      const [ga, gb] = d.pick([['1학년 학생', '2학년 학생'], ['남학생', '여학생']]);
      const [a, b, r] = d.until(() => [d.int(4, 7), d.int(4, 7), d.int(4, 6)], ([a0, b0, r0]) => { const s = range(2, r0 - 2).filter((i) => i <= a0 && r0 - i <= b0).map((i) => nCr(a0, i) * nCr(b0, r0 - i)); return s.length >= 2 && sum(s) <= 9999; });
      const cases = range(2, r - 2).filter((i) => i <= a && r - i <= b), parts = cases.map((i) => nCr(a, i) * nCr(b, r - i)), ans = sum(parts);
      return N(`${ga} ${a}명, ${gb} ${b}명 중에서 ${r}명을 뽑을 때, ${josa(ga, '과/와')} ${gb}이 각각 2명 이상씩 포함되는 경우의 수는?`, ans, {
        unit: '가지',
        explain: cases.map((i, t) => `${ga} ${i}명, ${gb} ${r - i}명을 뽑는 경우는 ${Cn(a, i)} × ${Cn(b, r - i)} = ${parts[t]}(가지)`).join(', ') + `이다. 각 경우는 동시에 일어나지 않으므로 ${parts.join(' + ')} = ${ans}(가지)이다.`,
        facts: { calc: [[cases.map((i) => `${combS(a, i)}*${combS(b, r - i)}`).join('+'), 0]] }
      });
    }, { standard: S3 }),
    T('pick-back', '경우의 수에서 사람 수를 거꾸로 구하기', '②35', (d, n) => {
      if (n === 0) {
        const mb = d.int(4, 8), w = d.int(3, 9), K = nCr(mb, 2) * nCr(w, 2);
        return N(`어느 동아리에서 남학생 중에서 2명, 여학생 중에서 2명을 뽑는 모든 경우의 수가 ${K}이다. 남학생이 ${mb}명일 때, 여학생은 몇 명인가?`, w, {
          unit: '명',
          explain: `여학생을 ${vn}명이라 하면 ${eqn(`${Cn(mb, 2)} × ${Cn(vn, 2)} = ${nCr(mb, 2)} × ${frac(`${vn}(${vn} − 1)`, 2)} = ${K}`)}이므로 ${eqn(`${vn}(${vn} − 1) = ${w * (w - 1)} = ${w} × ${w - 1}`)}이다. 따라서 여학생은 ${w}명이다.`,
          facts: eqDigit(`${nCr(mb, 2)}*${polyX(2)}/2`, K, 1, 30)
        });
      }
      if (n === 1) {
        const T0 = d.int(8, 14), w = d.int(2, T0 - 2), K = nCr(T0, 2) - nCr(T0 - w, 2);
        return N(`회원이 ${T0}명인 동호회에서 운영자 2명을 뽑으려고 한다. 적어도 한 명은 여자 회원이 뽑히는 경우의 수가 ${K}일 때, 이 동호회의 여자 회원은 몇 명인가?`, w, {
          unit: '명',
          explain: `남자 회원을 ${vn}명이라 하면 ${eqn(`${Cn(T0, 2)} − ${Cn(vn, 2)} = ${nCr(T0, 2)} − ${frac(`${vn}(${vn} − 1)`, 2)} = ${K}`)}이므로 ${eqn(`${vn}(${vn} − 1) = ${(T0 - w) * (T0 - w - 1)}`)}, ${vn} = ${T0 - w}이다. 따라서 여자 회원은 ${T0} − ${T0 - w} = ${w}(명)이다.`,
          facts: eqDigit(`${T0}*(${T0}-1)/2-(${T0}-□)*(${T0}-□-1)/2`, K, 0, T0 - 1)
        });
      }
      if (n === 2) {
        const T0 = d.int(5, 9), K = nCr(T0 - 2, 2) * 24;
        return N(`동호회 회원 중에서 특정한 2명을 포함하여 4명을 뽑아 일렬로 세우는 방법의 수가 ${K}일 때, 이 동호회의 회원은 모두 몇 명인가?`, T0, {
          unit: '명',
          explain: `회원을 ${vn}명이라 하면 특정한 2명을 뺀 ${eqn(`(${vn} − 2)`)}명 중에서 2명을 더 뽑고, 4명을 일렬로 세우므로 ${eqn(`${Cn(`${vn}${MINUS}2`, 2)} × 4! = ${K}`)}이다. ${eqn(`${Cn(`${vn}${MINUS}2`, 2)} = ${K / 24}`)}에서 ${eqn(`(${vn} − 2)(${vn} − 3) = ${(T0 - 2) * (T0 - 3)}`)}이므로 ${vn} = ${T0}이다.`,
          facts: eqDigit('(□-2)*(□-3)/2*24', K, 4, 40)
        });
      }
      const [a, b, j] = d.until(() => [d.int(3, 5), d.int(3, 5), d.int(1, 3)], ([a0, b0, j0]) => { const r = a0 + b0 - 2; return j0 < r - j0 && j0 >= 1; });
      const T0 = a + b, K = nCr(T0 - 2, j), n1 = j + 2, n2 = T0 - j;
      return M(`남학생 ${a}명, 여학생 ${b}명 중에서 특정한 2명이 포함되도록 ${vn}명을 뽑는 경우의 수가 ${K}이다. 자연수 ${vn}의 값을 모두 구하시오.`, [{ lead: `${vn} =`, answer: n1 }, { lead: `또는 ${vn} =`, answer: n2 }], {
        unordered: true,
        explain: `특정한 2명을 뽑아 두고 나머지 ${T0 - 2}명 중에서 ${eqn(`(${vn} − 2)`)}명을 뽑으므로 ${eqn(`${Cn(T0 - 2, `${vn}${MINUS}2`)} = ${K}`)}이다. ${Cn(T0 - 2, j)} = ${Cn(T0 - 2, T0 - 2 - j)} = ${K}이므로 ${eqn(`${vn} − 2 = ${j}`)} 또는 ${eqn(`${vn} − 2 = ${T0 - 2 - j}`)}, 곧 ${vn} = ${n1} 또는 ${vn} = ${n2}이다.`,
        facts: { calc: [[`${j}+2`, 0], [`${T0}-${j}`, 1]] }
      });
    }, { count: 4, standard: S3 }),
    T('pick-shoes', '신발 켤레에서 한 켤레만 짝이 맞게 뽑기', '②36', (d) => {
      const m = d.int(5, 7), shoes = range(0, 2 * m - 1), all = combos(shoes, 4), pairsIn = (s) => range(0, m - 1).filter((p) => s.includes(2 * p) && s.includes(2 * p + 1)).length;
      const flags = all.map((s) => pairsIn(s) === 1), rest = nCr(2 * m - 2, 2) - (m - 1);
      return N(`서로 다른 ${m}켤레의 신발 ${2 * m}짝 중에서 4짝을 택할 때, 1켤레만 짝이 맞는 경우의 수는?`, hits(flags), {
        unit: '가지',
        explain: `짝이 맞는 1켤레를 고르는 경우는 ${Cn(m, 1)} = ${m}(가지)이다. 나머지 ${m - 1}켤레 ${2 * m - 2}짝 중에서 2짝을 고르는 ${Cn(2 * m - 2, 2)} = ${nCr(2 * m - 2, 2)}(가지) 가운데 짝이 맞는 ${m - 1}가지를 빼면 ${rest}가지이다. 따라서 ${m} × ${rest} = ${hits(flags)}(가지)이다.`,
        facts: { count: flags }
      });
    }, { standard: S3 }),
    T('pick-parity-sum', '몇 장을 뽑은 수의 합의 홀짝', '②37 심10', (d, n) => {
      if (n === 0) {
        const top = 2 * d.int(4, 5), k = d.int(4, top === 8 ? 5 : 6), odd = d.bool(), all = combos(range(1, top), k), flags = all.map((s) => sum(s) % 2 === (odd ? 1 : 0)), h = top / 2;
        const cases = range(0, k).filter((i) => i % 2 === (odd ? 1 : 0) && i <= h && k - i <= h);
        return N(`1부터 ${top}까지의 자연수가 하나씩 적힌 카드 ${top}장 중에서 동시에 ${k}장의 카드를 선택할 때, 선택한 카드에 적힌 수의 합이 ${odd ? '홀수' : '짝수'}인 경우의 수는?`, hits(flags), {
          unit: '가지',
          explain: `홀수 카드와 짝수 카드는 ${h}장씩이다. 합이 ${odd ? '홀수' : '짝수'}이려면 홀수 카드를 ${odd ? '홀수' : '짝수'} 장 골라야 한다. ` + cases.map((i) => `홀수 ${i}장, 짝수 ${k - i}장을 고르는 경우는 ${Cn(h, i)} × ${Cn(h, k - i)} = ${nCr(h, i) * nCr(h, k - i)}(가지)`).join(', ') + `이므로 모두 ${hits(flags)}가지이다.`,
          facts: { count: flags }
        });
      }
      const top = d.int(10, 20), odd = d.bool(), all = combos(range(1, top), 3), flags = all.map((s) => sum(s) % 2 === (odd ? 1 : 0)), o = Math.ceil(top / 2), e = Math.floor(top / 2);
      const cases = odd ? [[3, 0], [1, 2]] : [[0, 3], [2, 1]];
      return N(`1부터 ${top}까지의 자연수 중에서 서로 다른 세 수를 택할 때, 세 수의 합이 ${odd ? '홀수' : '짝수'}가 되는 경우의 수는?`, hits(flags), {
        unit: '가지',
        explain: `홀수는 ${o}개, 짝수는 ${e}개이다. ` + cases.map(([i, j]) => `홀수 ${i}개, 짝수 ${j}개를 택하는 경우는 ${Cn(o, i)} × ${Cn(e, j)} = ${nCr(o, i) * nCr(e, j)}(가지)`).join(', ') + `이므로 모두 ${hits(flags)}가지이다.`,
        facts: { count: flags }
      });
    }, { count: 2, standard: S3 })
  ];

  // ════════════════ 조합의 활용 — 도형 ════════════════
  const shapeTypes = [
    T('shape-lines', '한 직선 위의 점이 섞일 때 직선의 개수', '②43', (d) => {
      const a = d.int(3, 5), b = d.int(3, 4), tot = a + b, ans = nCr(tot, 2) - nCr(b, 2) + 1;
      return N(`그림과 같이 반원의 호 위에 점 ${a}개, 지름 위에 점 ${b}개가 있다. 이 ${tot}개의 점 중에서 두 점을 지나는 서로 다른 직선의 개수는? (단, 지름 위의 점 ${b}개에는 지름의 양 끝점이 들어 있다.)`, ans, {
        unit: '개',
        figure: semicircleFig(a, b),
        explain: `${tot}개의 점 중에서 두 점을 택하는 경우는 ${Cn(tot, 2)} = ${nCr(tot, 2)}(가지)이다. 지름 위의 ${b}개의 점 중에서 두 점을 택하는 ${Cn(b, 2)} = ${nCr(b, 2)}(가지)는 모두 지름을 지나는 같은 직선이므로 ${nCr(tot, 2)} − ${nCr(b, 2)} + 1 = ${ans}(개)이다.`,
        facts: { calc: [[`${combS(tot, 2)}-${combS(b, 2)}+1`, 0]] }
      });
    }, { standard: S3 }),
    T('shape-triangles', '한 직선 위의 점이 섞일 때 삼각형의 개수', '②44', (d, n) => {
      if (n === 0) {
        const p = d.int(3, 5), q = d.int(3, 4), tot = 2 * p + 2 * q - 4, ans = nCr(tot, 3) - 2 * nCr(p, 3) - 2 * nCr(q, 3);
        return N(`그림과 같이 평행사변형의 변 위에 ${tot}개의 점이 있다. 이 중에서 3개의 점을 연결하여 만들 수 있는 삼각형의 개수는?`, ans, {
          unit: '개',
          figure: pgramFig(p, q),
          explain: `${tot}개의 점 중에서 3개를 택하는 경우는 ${Cn(tot, 3)} = ${nCr(tot, 3)}(가지)이다. 한 변 위의 세 점으로는 삼각형을 만들 수 없으므로, 점이 ${p}개인 두 변에서 ${2 * nCr(p, 3)}가지, 점이 ${q}개인 두 변에서 ${2 * nCr(q, 3)}가지를 빼면 ${nCr(tot, 3)} − ${2 * nCr(p, 3)} − ${2 * nCr(q, 3)} = ${ans}(개)이다.`,
          facts: { calc: [[`${combS(tot, 3)}-2*${combS(p, 3)}-2*${combS(q, 3)}`, 0]] }
        });
      }
      const a = d.int(4, 6), b = d.int(3, 5), tot = a + b - 1, ans = nCr(tot, 3) - nCr(a, 3) - nCr(b, 3);
      return N(`그림과 같이 한 점 O에서 만나는 두 직선 ${V('l')}, ${V('m')} 위에 점 O를 포함하여 모두 ${tot}개의 점이 있다. 이 중에서 3개의 점을 이어 만들 수 있는 삼각형의 개수는?`, ans, {
        unit: '개',
        figure: twoLinesFig(a, b),
        explain: `${tot}개의 점 중에서 3개를 택하는 경우는 ${Cn(tot, 3)} = ${nCr(tot, 3)}(가지)이다. 점 O는 두 직선에 모두 있으므로 직선 ${V('l')} 위의 점은 ${a}개, 직선 ${V('m')} 위의 점은 ${b}개이다. 한 직선 위의 세 점을 택하는 ${Cn(a, 3)} + ${Cn(b, 3)} = ${nCr(a, 3) + nCr(b, 3)}(가지)를 빼면 ${ans}개이다.`,
        facts: { calc: [[`${combS(tot, 3)}-${combS(a, 3)}-${combS(b, 3)}`, 0]] }
      });
    }, { count: 2, standard: S3 }),
    T('shape-parallelograms', '평행선으로 만든 평행사변형의 개수', '②46', (d, n) => {
      if (n === 0) {
        const a = d.int(3, 5), b = d.int(3, 5), ans = nCr(a, 2) * nCr(b, 2);
        return N(`그림과 같이 서로 평행한 직선 ${a}개와 이 직선들과 만나는 서로 평행한 직선 ${b}개가 있다. 이 직선들로 만들어지는 평행사변형의 개수는?`, ans, {
          unit: '개',
          figure: familiesFig([a, b]),
          explain: `평행사변형은 가로 직선 ${a}개 중에서 2개, 비스듬한 직선 ${b}개 중에서 2개를 택하면 하나씩 만들어진다. 따라서 ${Cn(a, 2)} × ${Cn(b, 2)} = ${nCr(a, 2)} × ${nCr(b, 2)} = ${ans}(개)이다.`,
          facts: { calc: [[`${combS(a, 2)}*${combS(b, 2)}`, 0]] }
        });
      }
      if (n === 1) {
        const [a, b, c] = [d.int(2, 3), d.int(3, 4), d.int(3, 4)], [x, y, z] = [nCr(a, 2), nCr(b, 2), nCr(c, 2)], ans = x * y + y * z + x * z;
        return N(`그림과 같이 가로로 놓인 서로 평행한 직선 ${a}개, 오른쪽 위로 기운 서로 평행한 직선 ${b}개, 왼쪽 위로 기운 서로 평행한 직선 ${c}개가 서로 만나고 있다. 이 직선들로 만들 수 있는 평행사변형의 개수는?`, ans, {
          unit: '개',
          figure: familiesFig([a, b, c]),
          explain: `평행사변형은 두 방향을 고른 다음, 그 두 방향에서 직선을 2개씩 택하면 만들어진다. 가로 직선과 오른쪽 위로 기운 직선으로 ${Cn(a, 2)} × ${Cn(b, 2)} = ${x * y}(개), 오른쪽 위로 기운 직선과 왼쪽 위로 기운 직선으로 ${Cn(b, 2)} × ${Cn(c, 2)} = ${y * z}(개), 가로 직선과 왼쪽 위로 기운 직선으로 ${Cn(a, 2)} × ${Cn(c, 2)} = ${x * z}(개)이므로 모두 ${ans}개이다.`,
          facts: { calc: [[`${combS(a, 2)}*${combS(b, 2)}+${combS(b, 2)}*${combS(c, 2)}+${combS(a, 2)}*${combS(c, 2)}`, 0]] }
        });
      }
      const m = d.int(4, 9), K = nCr(m, 2) * nCr(m - 1, 2);
      return N(`평면 위에 서로 평행한 직선 ${vn}개와 이들과 만나는 서로 평행한 직선 ${nb(`(${vn} − 1)`)}개가 있다. 이 직선들로 만들어지는 평행사변형의 개수가 ${K}일 때, 자연수 ${vn}의 값은?`, m, {
        explain: `${eqn(`${Cn(vn, 2)} × ${Cn(`${vn}${MINUS}1`, 2)} = ${frac(`${vn}(${vn} − 1)<sup>2</sup>(${vn} − 2)`, 4)} = ${K}`)}이므로 ${eqn(`${vn}(${vn} − 1)<sup>2</sup>(${vn} − 2) = ${4 * K} = ${m} × ${m - 1}<sup>2</sup> × ${m - 2}`)}이다. 따라서 ${vn} = ${m}이다.`,
        facts: eqDigit('□*(□-1)*(□-1)*(□-2)/4', K, 2, 30)
      });
    }, { count: 3, standard: S3 }),
    T('shape-right-triangles', '원 위의 같은 간격의 점으로 만드는 직각삼각형', '②47', (d) => {
      const m = d.int(3, 7), pts = 2 * m, ans = m * (pts - 2);
      return N(`그림과 같이 원 위에 ${pts}개의 점이 같은 간격으로 놓여 있다. 이 중에서 3개의 점을 꼭짓점으로 하는 삼각형이 직각삼각형인 경우의 수는?`, ans, {
        unit: '가지',
        figure: circleFig(pts),
        explain: `원 위의 세 점으로 만든 삼각형이 직각삼각형이 되려면 한 변이 원의 지름이어야 한다. 점이 같은 간격으로 ${pts}개 있으므로 지름은 ${m}개이고, 지름마다 양 끝점을 뺀 ${pts - 2}개의 점 가운데 하나를 택하면 되므로 ${m} × ${pts - 2} = ${ans}(가지)이다.`,
        facts: { calc: [[`${pts}/2*(${pts}-2)`, 0]] }
      });
    }, { standard: S3 })
  ];

  Object.assign(B.kit.m1017, { polyX, semicircleFig, pgramFig, twoLinesFig, familiesFig, circleFig });
  B.addGroup(UNIT, { id: 'number', title: '순열의 활용 — 수와 문자열', standard: S2, types: numberTypes });
  B.addGroup(UNIT, { id: 'comb', title: '조합의 수', standard: S3, types: combTypes });
  B.addGroup(UNIT, { id: 'pick', title: '조합의 활용 — 뽑기', standard: S3, types: pickTypes });
  B.addGroup(UNIT, { id: 'shape', title: '조합의 활용 — 도형', standard: S3, types: shapeTypes });
})(typeof window !== 'undefined' ? window : globalThis);
