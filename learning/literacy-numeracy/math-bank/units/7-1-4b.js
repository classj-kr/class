// 중학교 1학년 1학기 4단원 일차방정식 — 뒤쪽 묶음(일차방정식의 풀이, 해와 상수, 활용).
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 7-1-4a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 풀이 문항은 방정식의 구조가 다른 것만 따로 싣고(차례마다 facts.rule 의 이름이 다르다) 답의 꼴(정수 / 분수)은 차례마다 정해져 있다.
// 풀이 글은 줄마다 한 단계(분모·소수 없애기 → 괄호 풀기 → 동류항 정리 → 이항 → 양변을 나누기)를 보인다(7-1-4a.js 의 solve).
// 활용은 상황마다 한 유형이다. 답을 다시 셈하는 식(facts.value)은 방정식을 거치지 않고 문제의 수로 바로 셈한 식이다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, box, frac, N, M, C } = B.kit;
  const { LAB, gcd, lcm, Q, dc, dc2, qneg, tx, nb, tail, lastOf, js, sup, nz, pm, co, ansV } = B.kit.mid;
  const { x, va, iq, xu, tm, tg, tf, tb, ts, sideH, eqH, exq, eqB, eqF, tagEq, eqProc, evS, solJ, solQ, flatS, subS, solve, mix, nice, solveQ, pickEq } = B.kit.m714;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const UNIT = '7-1-4';
  // 10의 배수가 아닌 수(소수 한 자리·두 자리로 적을 수)
  const off10 = (d, lo, hi) => d.until(() => d.int(lo, hi), (v) => v % 10 !== 0);
  // 방정식을 세운 뒤의 풀이 글
  const told = (L, R) => `방정식을 세우면 ${eqB(L, R)}이다. ${solve(L, R, 'x').text}`;
  // 걸린 시간을 적는 글과 시간 단위의 유리수
  const span = (minutes) => { const h = Math.floor(minutes / 60), m = minutes % 60; return { h, m, text: (h ? h + '시간' : '') + (h && m ? ' ' : '') + (m ? m + '분' : ''), q: Q(minutes, 60), js: h && m ? `(${h}+${m}/60)` : h ? String(h) : `(${m}/60)` }; };

  // 달력. first: 1일의 요일(0 일요일 ~ 6 토요일), days: 그 달의 날수
  function calendar(first, days) {
    const W = 34, H = 24, rows = Math.ceil((first + days) / 7), width = 7 * W + 8, height = (rows + 1) * H + 8, DAYS = ['일', '월', '화', '수', '목', '금', '토'];
    let out = `<rect x="4" y="4" width="${7 * W}" height="${H}" style="fill:#e8eef7"/>`;
    for (let r = 0; r <= rows + 1; r += 1) out += `<line x1="4" y1="${4 + r * H}" x2="${4 + 7 * W}" y2="${4 + r * H}" style="stroke:#8a96a3;stroke-width:1"/>`;
    for (let c = 0; c <= 7; c += 1) out += `<line x1="${4 + c * W}" y1="4" x2="${4 + c * W}" y2="${4 + (rows + 1) * H}" style="stroke:#8a96a3;stroke-width:1"/>`;
    DAYS.forEach((day, c) => { out += `<text x="${4 + c * W + W / 2}" y="${4 + H * 0.7}" text-anchor="middle" style="font-size:12.5px;font-weight:700;fill:#1f2933">${day}</text>`; });
    for (let day = 1; day <= days; day += 1) { const i = first + day - 1; out += `<text x="${4 + (i % 7) * W + W / 2}" y="${4 + (Math.floor(i / 7) + 1) * H + H * 0.7}" text-anchor="middle" style="font-size:13px;font-weight:600;fill:#1f2933">${day}</text>`; }
    return `<svg class="mb-geo" viewBox="0 0 ${width} ${height}" width="${width}" role="img" aria-label="달력: 1일은 ${DAYS[first]}요일이고 ${days}일까지 있다. 한 줄에 7일씩 요일 차례로 적혀 있다.">${out}</svg>`;
  }
  // 직사각형과, 가로·세로를 늘인 직사각형(점선). 길이는 이름표로만 적는다(비율대로 그리지 않는다).
  function grownRect(a, b, p) {
    const X0 = 46, Y0 = 44, W = 118, H = 72, DX = 52, DY = 34, word = 'style="font-size:13px;font-weight:600;fill:#1f2933"', it = 'style="font-style:italic;font-family:\'MB Math\',\'Times New Roman\',serif;font-size:14.5px"';
    return `<svg class="mb-geo" viewBox="0 0 250 150" width="250" role="img" aria-label="직사각형: 가로의 길이 ${a} cm, 세로의 길이 ${b} cm. 점선은 가로의 길이를 ${p} cm, 세로의 길이를 x cm만큼 늘인 직사각형이다.">`
      + `<rect x="${X0}" y="${Y0 - DY}" width="${W + DX}" height="${H + DY}" style="fill:#fff;stroke:#475569;stroke-width:1.3;stroke-dasharray:5 3"/>`
      + `<rect x="${X0}" y="${Y0}" width="${W}" height="${H}" style="fill:rgba(37,99,235,0.14);stroke:#1d4ed8;stroke-width:1.6"/>`
      + `<text x="${X0 + W / 2}" y="${Y0 + H + 17}" text-anchor="middle" ${word}>${a} cm</text><text x="${X0 + W + DX / 2}" y="${Y0 + H + 17}" text-anchor="middle" ${word}>${p} cm</text>`
      + `<text x="${X0 - 6}" y="${Y0 + H / 2 + 4}" text-anchor="end" ${word}>${b} cm</text><text x="${X0 - 6}" y="${Y0 - DY / 2 + 4}" text-anchor="end" ${word}><tspan ${it}>x</tspan> cm</text></svg>`;
  }

  // ── 일차방정식의 풀이 ──
  B.addTypes(UNIT, 'solve', [
    T('solve-ax', 'ax = b 꼴의 방정식', '①29 ①21', (d, n) => {
      // 차례마다 구조가 다르다: 계수가 정수이고 해가 분수, 계수가 분수이고 해가 정수.
      if (n === 0) {
        const [L, R] = pickEq(d, () => { const a = pm(d) * d.int(2, 9), b = nz(d, -15, 15); return d.bool() ? [ts([a, 'x']), ts([b, ''])] : [ts([b, '']), ts([a, 'x'])]; }, 'frac');
        return solveQ(L, R, 'frac', 'ax-0');
      }
      const [L, R] = pickEq(d, () => { const q = d.int(2, 7), p = co(d, q, 1, 5), k = nz(d, -5, 5); return [ts([Q(pm(d) * p, q), 'x']), ts([p * k, ''])]; }, 'int');
      return solveQ(L, R, 'int', 'ax-1');
    }, { count: 2 }),
    T('solve-one-side', '미지수가 한쪽에만 있는 방정식', '①30 ①21', (d) => {
      const [L, R] = pickEq(d, () => { const a = pm(d) * d.int(2, 9), v = nz(d, -9, 9), b = nz(d, -12, 12); return [d.bool() ? ts([a, 'x'], [b, '']) : ts([b, ''], [a, 'x']), ts([a * v + b, ''])]; }, 'int', (l, r) => evS(r, {}).p !== 0);
      return solveQ(L, R, 'int', 'one-side');
    }),
    T('solve-both', '양변에 미지수가 있는 방정식', '①31', (d, n) => {
      // 첫째는 해가 정수, 둘째는 해가 분수이다.
      const kind = n === 0 ? 'int' : 'frac', [L, R] = pickEq(d, () => [ts([nz(d, -9, 9), 'x'], [nz(d, -15, 15), '']), ts([nz(d, -9, 9), 'x'], [nz(d, -15, 15), ''])], kind);
      return solveQ(L, R, kind, 'both-' + n);
    }, { count: 2 }),
    T('solve-paren', '괄호가 있는 방정식', '①32', (d, n) => {
      // 차례마다 구조가 다르다: 괄호 하나(앞의 수가 음수), 괄호 둘, 괄호 둘이고 해가 분수, 괄호 안에 분수.
      const u = () => d.int(1, 9), kind = n === 2 ? 'frac' : 'int';
      const make = [
        () => d.pick([
          () => [ts([u(), ''], [-d.int(2, 9), 'x']), [tg(-1, ts([u(), ''], [d.int(1, 5), 'x']))]],
          () => [[tg(-d.int(2, 5), ts([d.int(1, 5), 'x'], [u(), '']))], ts([u(), ''], [-d.int(1, 9), 'x'])],
          () => [ts([d.int(2, 9), 'x'], [-u(), '']), [tg(-d.int(2, 5), ts([1, 'x'], [pm(d) * u(), '']))]]
        ])(),
        () => [[tg(d.int(2, 5), ts([1, 'x'], [pm(d) * u(), '']))], [tm(pm(d) * u(), ''), tg(-d.int(2, 5), ts([1, 'x'], [pm(d) * u(), '']))]],
        () => [ts([d.int(2, 9), 'x'], [-u(), '']), [tg(-d.int(2, 5), ts([u(), ''], [-d.int(2, 5), 'x'])), tm(u(), '')]],
        () => { const q = d.pick([2, 3, 4]), m = q * d.int(1, 3), c = d.until(() => d.int(1, 7), (v) => v !== m); return [[tg(m, ts([1, 'x'], [Q(pm(d) * co(d, q, 1, q - 1), q), '']))], ts([c, 'x'], [pm(d) * u(), ''])]; }
      ][n], [L, R] = pickEq(d, make, kind);
      return solveQ(L, R, kind, 'paren-' + n);
    }, { count: 4 }),
    T('solve-brace', '중괄호가 있는 방정식', '①33', (d) => {
      const [L, R] = pickEq(d, () => { const k = d.pick([2, 3, 4]), s = k * d.int(1, 3), t = k * d.int(1, 3); return [ts([d.int(1, 9), ''], [-1, 'x']), [tm(d.int(2, 7), 'x'), tg(-1, [tm(d.int(1, 9), ''), tf(ts([s, 'x'], [-t, '']), k, 1)], '{')]]; }, 'frac');
      // 중괄호 안의 분수를 먼저 정리한 식으로 풀이를 적는다.
      const inside = R[1].list, part = flatS([inside[1]]), R2 = [R[0], tg(-1, [inside[0]].concat(part), '{')];
      return solveQ(L, R, 'frac', 'brace', { explain: `${nb(`${sideH([inside[1]], true)} = ${sideH(part, true)}`)}이므로 ${eqB(L, R2)}이다. ${solve(L, R2, 'x').text}` });
    }),
    T('solve-decimal', '계수가 소수인 방정식', '①34 심16', (d, n) => {
      // 차례마다 구조가 다르다: 소수 한 자리, 괄호 앞에 소수, 소수 두 자리(양변에 100), 정수인 항이 섞이고 해가 분수.
      const kind = n === 3 ? 'frac' : 'int';
      const make = [
        () => [ts([dc(off10(d, 1, 19)), 'x'], [dc(-off10(d, 1, 29)), '']), ts([dc(off10(d, 1, 19)), 'x'], [dc(pm(d) * off10(d, 1, 29)), ''])],
        () => (d.bool() ? [[tg(dc(off10(d, 1, 9)), ts([d.int(1, 5), ''], [-d.int(1, 5), 'x']))], [tg(dc(off10(d, 11, 19)), ts([1, 'x'], [-d.int(1, 5), '']))]]
          : [[tg(dc(off10(d, 1, 9)), ts([1, 'x'], [d.int(1, 9), '']))], ts([dc(off10(d, 1, 9)), 'x'], [dc(-off10(d, 1, 19)), ''])]),
        () => [ts([dc2(d.int(2, 9)), 'x'], [dc2(-off10(d, 11, 39)), '']), ts([dc(off10(d, 1, 9)), ''], [dc2(d.int(1, 9)), 'x'])],
        () => [ts([dc(off10(d, 1, 9)), 'x'], [-d.int(1, 3), '']), ts([dc(off10(d, 1, 9)), 'x'], [dc(-off10(d, 1, 9)), ''])]
      ][n], [L, R] = pickEq(d, make, kind);
      return solveQ(L, R, kind, 'decimal-' + n);
    }, { count: 4 }),
    T('solve-frac-coef', '계수가 분수인 방정식', '①35 ①30 ①21', (d, n) => {
      // 차례마다 구조가 다르다: 상수항만 분수, 미지수가 한쪽에만, 양변에 미지수(해가 정수), 양변에 미지수(해가 분수).
      const kind = n === 0 || n === 3 ? 'frac' : 'int';
      const make = [
        () => { const q = d.pick([2, 3, 4, 5]), s = d.until(() => d.pick([2, 3, 4, 5, 6]), (v) => v !== q); return [ts([1, 'x'], [Q(pm(d) * co(d, q, 1, q - 1), q), '']), ts([Q(pm(d) * co(d, s, 1, s - 1), s), ''])]; },
        () => [ts([Q(pm(d), d.int(2, 6)), 'x'], [nz(d, -9, 9), '']), ts([nz(d, -9, 9), ''])],
        () => { const q = d.pick([2, 3, 4, 5]), s = d.until(() => d.pick([2, 3, 4, 6]), (v) => v !== q); return [ts([Q(co(d, q, 1, 5), q), 'x'], [-d.int(1, 12), '']), ts([d.int(1, 12), ''], [Q(-co(d, s, 1, 5), s), 'x'])]; },
        () => { const q = d.pick([2, 3, 4]), s = d.until(() => d.pick([2, 3, 4, 5]), (v) => v !== q); return [ts([Q(1, q), 'x']), ts([Q(-co(d, s, 1, 3), s), 'x'], [Q(1, d.pick([2, 3, 4, 6])), ''])]; }
      ][n], [L, R] = pickEq(d, make, kind);
      return solveQ(L, R, kind, 'frac-coef-' + n);
    }, { count: 4 }),
    T('solve-frac-num', '분자가 일차식인 분수가 있는 방정식', '①36', (d, n) => {
      // 차례마다 구조가 다르다: 분수끼리의 뺄셈(분자 전체에 −가 걸린다), 양변이 분수 하나씩, 분수와 정수인 항.
      const kind = n === 0 ? 'int' : 'frac';
      const make = [
        () => { const m = d.pick([2, 3, 4]), k = d.until(() => d.pick([2, 3, 4, 5, 6]), (v) => v !== m), all = lcm(m, k); return [[tf(ts([1, 'x'], [d.int(1, 6), '']), m, 1), tf(ts([1, 'x'], [-d.int(1, 6), '']), k, -1)], ts([d.bool() ? d.int(1, 3) : Q(co(d, all, 1, all - 1), all), ''])]; },
        () => { const m = d.pick([2, 3, 4, 5]), k = d.until(() => d.pick([2, 3, 4, 6]), (v) => v !== m); return [[tf(ts([d.int(2, 5), 'x'], [-d.int(1, 5), '']), m, 1)], [tf(ts([d.int(1, 5), 'x'], [d.int(1, 5), '']), k, 1)]]; },
        () => { const m = d.pick([3, 4, 5]), k = d.until(() => d.pick([2, 3, 4]), (v) => v !== m); return [[tf(ts([d.int(1, 5), ''], [-d.int(2, 5), 'x']), m, 1)], ts([Q(1, k), 'x'], [-d.int(1, 3), ''])]; }
      ][n], [L, R] = pickEq(d, make, kind);
      return solveQ(L, R, kind, 'frac-num-' + n);
    }, { count: 3 }),
    T('solve-mixed', '분수와 소수가 섞인 방정식', '①37 심17', (d, n) => {
      // 차례마다 구조가 다르다: 분수 계수와 소수 계수, 분자가 일차식인 분수와 소수가 곱해진 괄호, 해가 분수.
      const kind = n === 2 ? 'frac' : 'int', DEC = [dc(5), dc(2), dc(4), dc(6), dc(15), dc(25)];
      const make = [
        () => { const q = d.pick([3, 4, 6]); return [ts([Q(co(d, q, 1, q - 1), q), 'x'], [d.int(1, 5), '']), ts([d.pick(DEC), 'x'], [Q(co(d, q, 1, 2 * q), q), ''])]; },
        () => [[tf(ts([d.int(1, 4), 'x'], [d.int(1, 5), '']), d.pick([2, 4, 5]), 1), tg(qneg(d.pick([dc(1), dc(2), dc(3), dc(5)])), ts([1, 'x'], [-d.int(1, 9), '']))], ts([d.int(1, 5), ''])],
        () => { const q = d.pick([3, 6]); return [ts([Q(co(d, q, 1, 2 * q), q), ''], [d.pick([dc(5), dc(15)]), 'x']), [tf(ts([d.int(2, 5), 'x'], [-d.int(1, 6), '']), d.pick([2, 4]), 1)]]; }
      ][n], [L, R] = pickEq(d, make, kind);
      return solveQ(L, R, kind, 'mixed-' + n);
    }, { count: 3 }),
    T('solve-ratio', '비례식으로 주어진 방정식', '①38 심18', (d) => {
      const m = d.until(() => {
        const p = d.int(2, 5), q = d.until(() => d.int(2, 7), (v) => v !== p && gcd(v, p) === 1), A = ts([1, 'x'], [pm(d) * d.int(1, 6), '']), Bs = d.bool() ? ts([d.int(2, 3), 'x'], [-d.int(1, 9), '']) : ts([d.int(2, 9), ''], [-d.int(1, 3), 'x']);
        return { p, q, A, Bs, L: [tg(q, A)], R: [tg(p, Bs)] };
      }, (r) => { const v = solQ(r.L, r.R); return nice(v, 'int') && evS(r.A, { x: v }).p > 0 && evS(r.Bs, { x: v }).p > 0; });
      const colon = ' <i>:</i> ', first = d.bool();
      const figure = exq(first ? `${m.p}${colon}${m.q} <i>=</i> (${sideH(m.A)})${colon}(${sideH(m.Bs)})` : `(${sideH(m.A)})${colon}${m.p} <i>=</i> (${sideH(m.Bs)})${colon}${m.q}`);
      return solveQ(m.L, m.R, 'int', 'ratio', { text: `다음 비례식을 만족시키는 ${x}의 값을 구하시오.`, figure, lead: `비례식에서 외항의 곱과 내항의 곱은 같으므로 ${eqB(m.L, m.R)}이다. ` });
    }),
    T('solve-blanks', '분수가 있는 방정식을 푸는 과정의 빈칸', '①39', (d) => {
      // (ax + b)/m + c = x/k 의 양변에 mk 를 곱한다. 정수인 항 c 에도 곱한다.
      const [m, k, a, b, c] = d.until(() => { const m0 = d.pick([2, 3, 4, 5]), k0 = d.until(() => d.pick([2, 3, 4, 5]), (w) => gcd(w, m0) === 1); return [m0, k0, d.int(2, 4), nz(d, -6, 6), d.int(2, 4)]; },
        ([m0, k0, a0, b0, c0]) => { const p = k0 * a0 - m0, q = -(k0 * b0 + c0 * m0 * k0); return p !== 0 && q !== 0 && q % p === 0 && Math.abs(q / p) <= 30 && Math.abs(p) > 1; });
      const all = m * k, mid = k * b + c * all, v = -mid / (k * a - m), L = [tf(ts([a, 'x'], [b, '']), m, 1), tm(c, '')], R = ts([Q(1, k), 'x']);
      return M('다음은 일차방정식을 푸는 과정이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', [all, c * all, mid, v].map((w, i) => ({ label: LAB[i], answer: w, signed: true })), {
        figure: eqProc([{ h: eqH(L, R) }, { note: '양변에 ㉠을 곱한다.' }, { h: `${sideH([tg(k, ts([a, 'x'], [b, ''])), tb(LAB[1], 1)])} <i>=</i> ${sideH(ts([m, 'x']))}` }, { note: '괄호를 풀어 정리한다.' },
          { h: `${sideH([tm(k * a, 'x'), tb(LAB[2], 1)])} <i>=</i> ${sideH(ts([m, 'x']))}` }, { note: '이항하여 정리한 다음 양변을 나눈다.' }, { h: `${x} <i>=</i> ${box(LAB[3])}` }]),
        explain: `분모 ${m}${tail(m, '과/와')} ${k}의 최소공배수 ${all}${tail(all, '을/를')} 양변에 곱한다. 정수인 항 ${c}에도 ${all}${tail(all, '을/를')} 곱하므로 ㉡은 ${c * all}이다. 괄호를 풀면 ${eqB(ts([k * a, 'x'], [k * b, ''], [c * all, '']), ts([m, 'x']))}이므로 ㉢은 ${iq(mid)}이다. ${solve(ts([k * a, 'x'], [mid, '']), ts([m, 'x']), 'x').text}`,
        facts: { calc: [[`${m}*${k}`, 0], [`${c}*${m}*${k}`, 1], [`${k}*(${b})+${c}*${m}*${k}`, 2], [`-(${k}*(${b})+${c}*${m}*${k})/(${k}*${a}-${m})`, 3]] }
      });
    }),
    T('solve-compare', '여러 방정식의 해 비교하기', '①41 심15', (d, n) => {
      // t 를 해로 갖는 방정식(구조가 서로 다르다)
      const plainMakers = [
        (t) => { const a = d.int(2, 6), b = nz(d, -9, 9); return [ts([a, 'x'], [b, '']), ts([a * t + b, ''])]; },
        (t) => { const a = d.int(2, 6), b = d.int(1, 9); return [ts([b, ''], [-a, 'x']), ts([b - a * t, ''])]; },
        (t) => { const [a, c] = d.until(() => [d.int(2, 7), d.int(1, 7)], ([p, q]) => p !== q), b = nz(d, -9, 9); return [ts([a, 'x'], [b, '']), ts([c, 'x'], [(a - c) * t + b, ''])]; },
        (t) => { const m = d.int(2, 4), b = nz(d, -5, 5), c = d.until(() => d.int(1, 6), (w) => w !== m); return [[tg(m, ts([1, 'x'], [b, '']))], ts([c, 'x'], [m * (t + b) - c * t, ''])]; },
        (t) => { const m = d.int(2, 5), b = nz(d, -5, 5), c = d.until(() => d.int(2, 9), (w) => w !== -m); return [[tg(m, ts([b, ''], [-1, 'x']))], ts([c, 'x'], [m * (b - t) - c * t, ''])]; }
      ];
      if (n === 0) {
        // 해가 가장 큰 것: 분수 계수와 소수 계수가 든 방정식도 섞는다.
        const divs = (t) => [2, 3, 4, 6].filter((q) => t % q === 0);
        const fracMaker = (t) => { const q = d.pick(divs(t)), p = co(d, q, 1, 5), b = d.int(1, 12); return [ts([Q(p, q), 'x'], [-b, '']), ts([p * t / q - b, ''])]; };
        const decMaker = (t) => { const [a, c, b] = d.until(() => [off10(d, 1, 9), off10(d, 1, 9), off10(d, 1, 29)], ([p, q, r]) => p !== q && ((p - q) * t - r) % 10 !== 0); return [ts([dc(a), 'x'], [dc(-b), '']), ts([dc(c), 'x'], [dc((a - c) * t - b), ''])]; };
        const rows = d.until(() => {
          const sols = d.shuffle([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]).slice(0, 4), last = sols[3], extra = divs(last).length && d.bool() ? fracMaker(last) : decMaker(last);
          return d.shuffle(d.shuffle(plainMakers).slice(0, 3).map((make, i) => ({ eq: make(sols[i]), v: sols[i] })).concat([{ eq: extra, v: last }]));
        }, (list) => list.every((r) => { const sol = solQ(r.eq[0], r.eq[1]); return sol && sol.q === 1 && sol.p === r.v; }));
        const best = Math.max(...rows.map((r) => r.v)), at = rows.findIndex((r) => r.v === best);
        return C('다음 일차방정식 가운데 해가 가장 큰 것은?', LAB.slice(0, 4), at, {
          figure: tagEq(rows.map((r) => eqH(r.eq[0], r.eq[1]))),
          explain: `방정식의 해는 차례로 ${rows.map((r) => nb(`${x} = ${iq(r.v)}`)).join(', ')}이다. 해가 가장 큰 것은 ${LAB[at]}이다.`,
          facts: { choose: { exprs: rows.map((r) => `(${solJ(r.eq[0], r.eq[1], 'x', {})})+100`), rule: 'max' }, unseen: [0, 1, 100], rule: 'compare-0' }
        });
      }
      // 해가 나머지 셋과 다른 것: 부호만 다른 해
      const v = d.pick([2, 3, 4, 5, 6]) * pm(d), makers = d.shuffle(plainMakers).slice(0, 4), oddAt = d.int(0, 3), rows = makers.map((make, i) => make(i === oddAt ? -v : v));
      return C('다음 일차방정식 가운데 해가 나머지 셋과 다른 것은?', LAB.slice(0, 4), oddAt, {
        figure: tagEq(rows.map(([L, R]) => eqH(L, R))),
        explain: `방정식의 해는 차례로 ${rows.map(([L, R]) => nb(`${x} = ${tx(solQ(L, R))}`)).join(', ')}이다. ${LAB[oddAt]}만 해가 ${nb(`${x} = ${iq(-v)}`)}이고 나머지는 ${nb(`${x} = ${iq(v)}`)}이다.`,
        facts: { claimed: rows.map(([L, R]) => [solJ(L, R, 'x', {}), v]), claimedWant: false, rule: 'compare-1' }
      });
    }, { count: 2 })
  ]);

  // ── 해와 상수 ──
  // 해를 넣어 상수 a 에 대한 방정식을 푼다.
  function paramQ(d, makeEq, kind, rule, vs) {
    const m = d.until(() => ({ v: d.pick(vs || [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7]), eq: makeEq() }), (r) => { const a = solQ(subS(r.eq[0], 'x', Q(r.v)), subS(r.eq[1], 'x', Q(r.v)), 'a'); return nice(a, kind) && Boolean(solQ(r.eq[0], r.eq[1], 'x', { a })); });
    const Ls = subS(m.eq[0], 'x', Q(m.v)), Rs = subS(m.eq[1], 'x', Q(m.v)), s = solve(Ls, Rs, 'a');
    return ansV(`다음 ${x}에 대한 방정식의 해가 ${nb(`${x} = ${iq(m.v)}`)}일 때, 상수 ${va}의 값은?`, s.v, kind, {
      figure: eqF(m.eq[0], m.eq[1]),
      explain: `방정식의 해를 방정식에 대입하면 등식이 참이 된다. ${nb(`${x} = ${iq(m.v)}`)}${tail(Math.abs(m.v), '을/를')} 대입하면 ${eqB(Ls, Rs)}이다. ${s.text}`,
      facts: { value: solJ(m.eq[0], m.eq[1], 'a', { x: js(Q(m.v)) }), unseen: [0, 1], rule }
    });
  }
  B.addTypes(UNIT, 'param', [
    T('param-given', '해가 주어질 때 상수 구하기', '①46 심19', (d, n) => {
      // 차례마다 상수의 자리가 다르다: 상수항, 괄호 안, 미지수의 계수.
      const u = () => d.int(1, 9);
      return paramQ(d, [
        () => (d.bool() ? [ts([d.int(2, 5), 'x'], [-u(), '']), ts([d.int(2, 4), 'a'])] : [ts([d.int(2, 5), 'x'], [1, 'a']), ts([d.int(1, 4), 'x'], [-u(), ''])]),
        () => [ts([u() + 2, ''], [-d.int(2, 4), 'x']), [tg(d.int(2, 4), ts([1, 'a'], [-1, 'x']))]],
        () => [ts([1, 'ax'], [-1, 'a']), ts([u(), ''], [1, 'x'])]
      ][n], 'int', 'param-' + n, n === 2 ? [-5, -4, -3, -2, -1, 2, 3, 4, 5, 6, 7] : null);
    }, { count: 3 }),
    T('param-frac', '분수가 있는 방정식에서 해가 주어질 때 상수 구하기', '①47 심19', (d, n) => {
      // 첫째는 상수가 정수, 둘째는 상수가 분수이다.
      return paramQ(d, [
        () => { const p = d.pick([2, 3, 4]), q = d.until(() => d.pick([2, 3, 5]), (v) => v !== p); return [[tm(d.int(1, 4), ''), tf(ts([1, 'x'], [-1, 'a']), p, -1)], [tf(ts([1, 'a'], [-1, 'x']), q, 1)]]; },
        () => { const p = d.pick([2, 3]), q = d.until(() => d.pick([2, 4, 5]), (v) => v !== p); return [[tf(ts([d.int(2, 3), 'x'], [1, 'a']), p, 1)], [tf(ts([2, 'a'], [-1, 'x']), q, 1)]]; }
      ][n], n === 0 ? 'int' : 'frac', 'param-frac-' + n);
    }, { count: 2 })
  ]);

  // ── 활용: 수, 나이, 금액, 과부족, 도형 ──
  B.addTypes(UNIT, 'word', [
    T('word-number', '어떤 수 구하기', '①55', (d) => {
      const k = d.int(2, 5);
      if (d.bool()) {
        const [v, q, more] = d.until(() => [nz(d, -9, 9), d.int(1, 9), d.bool()], ([w, e, up]) => { const p = (k - 1) * w + (up ? e : -e); return p >= 1 && p <= 30 && p !== e; }), p = (k - 1) * v + (more ? q : -q);
        const L = ts([1, 'x'], [p, '']), R = ts([k, 'x'], [more ? q : -q, '']);
        return ansV(`어떤 수에 ${p}${tail(p, '을/를')} 더한 수는 어떤 수의 ${k}배보다 ${q}만큼 ${more ? '크다' : '작다'}. 어떤 수는?`, Q(v), 'int', {
          explain: `어떤 수를 ${x}라 하자. ${told(L, R)}`, facts: { value: `(${p}${more ? '-' : '+'}${q})/(${k}-1)`, unseen: [1] }
        });
      }
      const m = d.int(1, 6), p = (k - 1) * m, L = ts([1, 'x'], [-p, '']), R = ts([k, 'x']);
      return ansV(`어떤 수에서 ${p}${tail(p, '을/를')} 뺀 수는 어떤 수의 ${k}배와 같다. 어떤 수는?`, Q(-m), 'int', {
        explain: `어떤 수를 ${x}라 하자. ${told(L, R)}`, facts: { value: `(-${p})/(${k}-1)`, unseen: [1] }
      });
    }),
    T('word-consecutive', '연속하는 세 수의 합', '①56', (d) => {
      const kind = d.pick([{ word: '홀수', gap: 2, odd: 1 }, { word: '짝수', gap: 2, odd: 0 }, { word: '자연수', gap: 1, odd: 0 }]), g = kind.gap;
      const mid = g === 1 ? d.int(8, 40) : 2 * d.int(5, 25) + kind.odd, sum = 3 * mid, L = [tg(1, ts([1, 'x'], [-g, ''])), tm(1, 'x'), tg(1, ts([1, 'x'], [g, '']))], R = ts([sum, '']);
      return N(`연속하는 세 ${kind.word}의 합이 ${sum}일 때, 세 수 가운데 가장 작은 수는?`, mid - g, {
        explain: `연속하는 ${kind.word}는 ${g}씩 커진다. 가운데 수를 ${x}라 하면 세 수는 ${nb(`${x} − ${g}`)}, ${x}, ${nb(`${x} + ${g}`)}이다. ${told(L, R)} 가장 작은 수는 ${nb(`${mid} − ${g} = ${mid - g}`)}이다.`,
        facts: { value: `${sum}/3-${g}`, unseen: [3, 1, 2] }
      });
    }),
    T('word-calendar', '달력에서 네모로 묶은 네 날짜', '심33', (d) => {
      const first = d.int(0, 6), days = d.pick([30, 31]), v = d.until(() => d.int(2, days - 8), (w) => (first + w - 1) % 7 <= 5), sum = 4 * v + 16;
      const L = [tm(1, 'x'), tg(1, ts([1, 'x'], [1, ''])), tg(1, ts([1, 'x'], [7, ''])), tg(1, ts([1, 'x'], [8, '']))], R = ts([sum, '']);
      return N(`어느 달의 달력에서 가로로 이웃한 두 날짜와 그 바로 아래에 있는 두 날짜를 묶었더니 네 수의 합이 ${sum}이었다. 묶은 네 수 가운데 가장 작은 수는?`, v, {
        figure: calendar(first, days),
        explain: `달력에서 오른쪽 칸의 수는 1만큼 크고 바로 아래 칸의 수는 7만큼 크다. 가장 작은 수를 ${x}라 하면 네 수는 ${x}, ${nb(`${x} + 1`)}, ${nb(`${x} + 7`)}, ${nb(`${x} + 8`)}이다. ${told(L, R)}`,
        facts: { value: `(${sum}-1-7-8)/4`, unseen: [1, 7, 8, 4] }
      });
    }),
    T('word-digits', '자리를 바꾼 두 자리 수', '①57 심31', (d) => {
      const m = d.until(() => { const t = d.int(1, 8), u = d.int(1, 9), twice = d.bool(), first = 10 * t + u, swapped = 10 * u + t; return { t, u, twice, first, swapped, k: twice ? swapped - 2 * first : swapped - first }; }, (r) => r.t !== r.u && r.k !== 0 && Math.abs(r.k) <= 60);
      const { t, u, twice, first, k } = m, L = ts([10, 'x'], [t, '']), R = [tg(twice ? 2 : 1, ts([10 * t, ''], [1, 'x'])), tm(k, '')];
      return N(`십의 자리 숫자가 ${t}인 두 자리 자연수가 있다. 이 수의 십의 자리 숫자와 일의 자리 숫자를 바꾼 수는 처음 수${twice ? '의 2배' : ''}보다 ${Math.abs(k)}만큼 ${k > 0 ? '크다' : '작다'}. 처음 수는?`, first, {
        explain: `일의 자리 숫자를 ${x}라 하면 처음 수는 ${nb(`${10 * t} + ${x}`)}, 바꾼 수는 ${nb(`10${x} + ${t}`)}이다. ${told(L, R)} 처음 수는 ${first}이다.`,
        facts: { value: `10*${t}+(${twice ? 2 : 1}*10*${t}${k < 0 ? '-' : '+'}${Math.abs(k)}-${t})/(10-${twice ? 2 : 1})`, unseen: [10, 1, 2] }
      });
    }),
    T('word-age', '몇 년 후에 나이가 몇 배가 되는가', '①58', (d) => {
      const m = d.until(() => { const k = d.int(2, 3), child = d.int(8, 16), after = d.int(3, 15); return { k, child, after, parent: k * (child + after) - after }; }, (r) => r.parent >= 36 && r.parent <= 55 && r.parent - r.child >= 24);
      const [who, kid] = d.pick([['아버지', '아들'], ['어머니', '딸'], ['아버지', '딸'], ['어머니', '아들'], ['이모', '조카'], ['삼촌', '조카']]), { k, child, after, parent } = m;
      const L = ts([parent, ''], [1, 'x']), R = [tg(k, ts([child, ''], [1, 'x']))];
      return N(`올해 ${who}의 나이는 ${parent}살이고 ${kid}의 나이는 ${child}살이다. ${who}의 나이가 ${kid}의 나이의 ${k}배가 되는 것은 몇 년 후인가?`, after, {
        unit: '년 후',
        explain: `${x}년 후에 ${who}의 나이는 ${nb(`(${parent} + ${x})`)}살, ${kid}의 나이는 ${nb(`(${child} + ${x})`)}살이다. ${told(L, R)}`,
        facts: { value: `(${parent}-${k}*${child})/(${k}-1)`, unseen: [1] }
      });
    }),
    T('word-count-price', '합한 개수와 값의 합으로 개수 구하기', '①60 심36', (d) => {
      const kind = d.int(0, 2), count = d.int(8, 15), v = d.int(2, count - 2);
      let p, q, text, unit, asked, other;
      if (kind === 0) {
        [p, q] = d.until(() => [100 * d.int(5, 9), 100 * d.int(5, 9)], ([a, b]) => a !== b); unit = '송이'; asked = '장미'; other = '백합';
        text = `한 송이에 ${p}원인 장미와 한 송이에 ${q}원인 백합을 합하여 ${count}송이 사고 ${p * v + q * (count - v)}원을 내었다. 장미는 몇 송이 샀는가?`;
      } else if (kind === 1) {
        p = 3; q = 2; unit = '개'; asked = '3점 슛'; other = '2점 슛';
        text = `어느 농구 선수가 한 경기에서 2점 슛과 3점 슛을 합하여 ${count}개 넣어 ${p * v + q * (count - v)}점을 얻었다. 이 선수가 넣은 3점 슛은 몇 개인가?`;
      } else {
        [p, q] = [100 * d.int(20, 35), 100 * d.int(8, 15)]; unit = '명'; asked = '어른'; other = '어린이';
        text = `어느 수영장의 입장료는 어른이 ${p}원, 어린이가 ${q}원이다. 어른과 어린이를 합하여 ${count}명이 입장하고 입장료로 모두 ${p * v + q * (count - v)}원을 내었다. 입장한 어른은 몇 명인가?`;
      }
      const total = p * v + q * (count - v), L = [tm(p, 'x'), tg(q, ts([count, ''], [-1, 'x']))], R = ts([total, '']);
      return N(text, v, {
        unit, explain: `${asked}의 수를 ${x}라 하면 ${other}의 수는 ${nb(`${count} − ${x}`)}이다. ${told(L, R)}`,
        facts: { value: `(${total}-${q}*${count})/(${p}-${q})` }
      });
    }),
    T('word-give', '주고받은 뒤 몇 배가 되는가', '①61', (d) => {
      const [thing, unit] = d.pick([['연필', '자루'], ['구슬', '개'], ['색종이', '장']]), m = d.until(() => { const k = d.int(2, 3), small = d.int(3, 12), v = d.int(2, 9); return { k, small, v, big: k * (small + v) + v }; }, (r) => r.big <= 60);
      const { k, small, v, big } = m, L = ts([big, ''], [-1, 'x']), R = [tg(k, ts([small, ''], [1, 'x']))];
      return N(`형은 ${josa(thing, '을/를')} ${big}${unit}, 동생은 ${small}${unit} 가지고 있다. 형이 동생에게 ${josa(thing, '을/를')} 몇 ${unit} 주면 형이 가진 ${thing}의 수가 동생이 가진 ${thing}의 수의 ${k}배가 되는가?`, v, {
        unit, explain: `형이 동생에게 ${x}${josa(unit, '을/를')} 주면 형은 ${nb(`(${big} − ${x})`)}${unit}, 동생은 ${nb(`(${small} + ${x})`)}${josa(unit, '을/를')} 가진다. ${told(L, R)}`,
        facts: { value: `(${big}-${k}*${small})/(${k}+1)`, unseen: [1] }
      });
    }),
    T('word-sum-diff', '합과 차를 아는 두 양', '①62', (d) => {
      const small = d.int(12, 45), diff = d.int(2, 9), sum = 2 * small + diff, askBig = d.bool(), kind = d.int(0, 2);
      const text = [
        `형과 동생의 몸무게의 합은 ${sum} kg이고, 형이 동생보다 ${diff} kg 더 무겁다. ${askBig ? '형' : '동생'}의 몸무게는 몇 kg인가?`,
        `어느 반의 학생은 모두 ${sum}명이고, 남학생이 여학생보다 ${diff}명 더 많다. 이 반의 ${askBig ? '남학생' : '여학생'}은 몇 명인가?`,
        `길이가 ${sum} cm인 끈을 두 도막으로 잘랐더니 긴 도막이 짧은 도막보다 ${diff} cm 더 길었다. ${askBig ? '긴' : '짧은'} 도막의 길이는 몇 cm인가?`
      ][kind], unit = ['kg', '명', 'cm'][kind], lower = ['동생의 몸무게', '여학생의 수', '짧은 도막의 길이'][kind], upper = ['형의 몸무게', '남학생의 수', '긴 도막의 길이'][kind], sp = unit === '명' ? '' : ' ', called = ['kg이라', '명이라', 'cm라'][kind];
      const L = [tg(1, ts([1, 'x'], [diff, ''])), tm(1, 'x')], R = ts([sum, '']);
      return N(text, askBig ? small + diff : small, {
        unit, explain: `${lower}를 ${x}${sp}${called} 하면 ${upper}는 ${nb(`(${x} + ${diff})`)}${sp}${unit}이다. ${told(L, R)}${askBig ? ` ${upper}는 ${nb(`${small} + ${diff} = ${small + diff}`)}(${unit})이다.` : ''}`,
        facts: { value: `(${sum}${askBig ? '+' : '-'}${diff})/2`, unseen: [2] }
      });
    }),
    T('word-sum-spend', '합이 정해진 두 사람의 돈', '심35', (d) => {
      const [p1, p2] = d.shuffle(NAMES).slice(0, 2), k = d.int(2, 3), other = 100 * d.int(5, 12), spent = 100 * d.int(2, 9), mine = k * other + spent, sum = mine + other;
      const L = ts([1, 'x'], [-spent, '']), R = [tg(k, ts([sum, ''], [-1, 'x']))];
      return N(`${name(p1, '과/와')} ${name(p2, '이/가')} 가진 돈의 합은 ${sum}원이다. ${name(p1, '이/가')} ${spent}원을 쓰면 ${name(p1, '의/의')} 남은 돈은 ${name(p2, '이/가')} 가진 돈의 ${k}배가 된다. ${name(p1, '이/가')} 처음에 가진 돈은 얼마인가?`, mine, {
        unit: '원', explain: `${name(p1, '이/가')} 처음에 가진 돈을 ${x}원이라 하면 ${name(p2, '이/가')} 가진 돈은 ${nb(`(${sum} − ${x})`)}원이다. ${told(L, R)}`,
        facts: { value: `(${k}*${sum}+${spent})/(${k}+1)`, unseen: [1] }
      });
    }),
    T('word-save', '날마다 같은 수씩 모으기', '①63', (d) => {
      const who = d.pick(NAMES), per = d.int(2, 6), v = d.int(4, 12), now = d.int(3, 15), goal = now + per * v, money = d.bool();
      const L = ts([money ? now * 1000 : now, ''], [money ? per * 1000 : per, 'x']), R = ts([money ? goal * 1000 : goal, '']);
      return N(money ? `${name(who, '의/의')} 저금통에는 지금 ${now * 1000}원이 들어 있다. 이 저금통에 매주 ${per * 1000}원씩 넣으면 저금통에 든 돈이 ${goal * 1000}원이 되는 것은 몇 주 후인가?`
        : `${name(who, '은/는')} 우유 팩 ${goal}개를 모으려고 한다. 지금 ${now}개가 있고 날마다 ${per}개씩 모으면, 우유 팩이 ${goal}개가 되는 것은 며칠 후인가?`, v, {
        unit: money ? '주 후' : '일 후', explain: `${x}${money ? '주' : '일'} 후에 ${money ? '저금통에 든 돈은' : '모은 우유 팩은'} ${nb(`(${sideH(L, true)})`)}${money ? '원' : '개'}이다. ${told(L, R)}`,
        facts: { value: money ? `(${goal * 1000}-${now * 1000})/${per * 1000}` : `(${goal}-${now})/${per}` }
      });
    }),
    T('word-part-whole', '전체의 몇 분의 몇보다 많고 적은 두 부분', '①64', (d) => {
      const [[n1, q1], [n2, q2]] = d.pick([[[1, 2], [2, 5]], [[1, 2], [1, 3]], [[1, 3], [3, 5]], [[2, 3], [1, 4]], [[1, 2], [3, 8]], [[1, 4], [2, 3]], [[3, 5], [1, 3]]]), all = lcm(q1, q2), rest = all - n1 * all / q1 - n2 * all / q2;
      const total = all * d.int(Math.ceil(60 / all), Math.floor(400 / all)), less = d.int(2, 9), more = less + total * rest / all;
      const L = [tm(Q(n1, q1), 'x'), tm(more, ''), tm(Q(n2, q2), 'x'), tm(-less, '')], R = ts([1, 'x']);
      return N(`어느 중학교의 1학년 학생 가운데 남학생은 전체의 ${frac(n1, q1)}보다 ${more}명 많고, 여학생은 전체의 ${frac(n2, q2)}보다 ${less}명 적다. 이 중학교의 1학년 학생은 모두 몇 명인가?`, total, {
        unit: '명', explain: `1학년 학생의 수를 ${x}라 하면 남학생의 수와 여학생의 수의 합이 ${x}이다. ${told(L, R)}`,
        facts: { value: `(${more}-${less})/(1-${n1}/${q1}-${n2}/${q2})`, unseen: [1] }
      });
    }),
    T('word-undo', '차례로 늘고 준 수에서 처음 수 구하기', '①65', (d) => {
      const m = d.until(() => { const v = d.int(2, 9), p = d.int(1, 5), k = d.int(2, 5), q = d.int(2, 15); return { v, p, k, q, left: (k + 1) * (v + p) - q }; }, (r) => r.left >= 5 && r.left !== r.q);
      const { v, p, k, q, left } = m, L = [tg(1, ts([1, 'x'], [p, ''])), tg(k, ts([1, 'x'], [p, ''])), tm(-q, '')], R = ts([left, '']);
      return N(`나무에 참새가 몇 마리 앉아 있었다. ${p}마리가 더 날아와 앉았고, 이어서 그때 나무에 있던 참새의 수의 ${k}배가 더 날아와 앉았다. 그 뒤 ${q}마리가 날아가서 ${left}마리가 남았다. 처음에 앉아 있던 참새는 몇 마리인가?`, v, {
        unit: '마리', explain: `처음에 앉아 있던 참새의 수를 ${x}라 하면 ${p}마리가 온 뒤에는 ${nb(`(${x} + ${p})`)}마리이고, 이어서 ${nb(`${k}(${x} + ${p})`)}마리가 더 왔다. ${told(L, R)}`,
        facts: { value: `(${left}+${q})/(${k}+1)-${p}`, unseen: [1] }
      });
    }),
    T('word-surplus', '나누어 주면 남고 모자라는 수', '①66 심37', (d) => {
      const [thing, unit] = d.pick([['공책', '권'], ['연필', '자루'], ['사탕', '개']]), a = d.int(2, 5), b = a + d.int(1, 3), v = d.int(5, 15), gap = (b - a) * v, r = d.int(1, gap - 1), s = gap - r, things = a * v + r;
      const L = ts([a, 'x'], [r, '']), R = ts([b, 'x'], [-s, '']);
      return M(`학생들에게 ${josa(thing, '을/를')} 나누어 주려고 한다. 한 명에게 ${a}${unit}씩 주면 ${r}${josa(unit, '이/가')} 남고, 한 명에게 ${b}${unit}씩 주면 ${s}${josa(unit, '이/가')} 모자란다. 학생은 몇 명이고 ${josa(thing, '은/는')} 몇 ${unit}인가?`, [{ label: '학생', answer: v, unit: '명' }, { label: thing, answer: things, unit }], {
        explain: `학생의 수를 ${x}라 하면 ${thing}의 수는 ${nb(sideH(L, true))}이기도 하고 ${nb(sideH(R, true))}이기도 하다. ${told(L, R)} ${thing}의 수는 ${nb(`${a} × ${v} + ${r} = ${things}`)}이다.`,
        facts: { calc: [[`(${r}+${s})/(${b}-${a})`, 0], [`${a}*(${r}+${s})/(${b}-${a})+${r}`, 1]] }
      });
    }),
    T('word-rect-perimeter', '직사각형의 둘레의 길이로 변의 길이 구하기', '①68', (d) => {
      const v = d.int(3, 12), diff = d.int(2, 9), per = 2 * (2 * v + diff), L = [tg(2, [tm(1, 'x'), tg(1, ts([1, 'x'], [diff, '']))], '{')], R = ts([per, '']);
      return N(`둘레의 길이가 ${per} cm이고, 가로의 길이가 세로의 길이보다 ${diff} cm 더 긴 직사각형이 있다. 이 직사각형의 세로의 길이는 몇 cm인가?`, v, {
        unit: 'cm', explain: `세로의 길이를 ${xu('cm')}라 하면 가로의 길이는 ${nb(`(${x} + ${diff})`)} cm이다. 직사각형의 둘레의 길이는 가로의 길이와 세로의 길이의 합의 2배이므로 ${told(L, R)}`,
        facts: { value: `(${per}/2-${diff})/2`, unseen: [2] }
      });
    }),
    T('word-rect-area', '변의 길이를 늘인 직사각형의 넓이', '①69 심40', (d) => {
      const m = d.until(() => ({ a: d.int(2, 8), b: d.int(2, 9), p: d.int(1, 6), k: d.int(2, 3) }), (r) => (r.k * r.a * r.b) % (r.a + r.p) === 0 && r.k * r.a * r.b / (r.a + r.p) - r.b >= 1 && r.k * r.a * r.b / (r.a + r.p) - r.b <= 12);
      const { a, b, p, k } = m, v = k * a * b / (a + p) - b, L = [tg(a + p, ts([b, ''], [1, 'x']))], R = ts([k * a * b, '']);
      return N(`가로의 길이가 ${a} cm, 세로의 길이가 ${b} cm인 직사각형이 있다. 이 직사각형의 가로의 길이를 ${p} cm, 세로의 길이를 ${xu('cm')}만큼 늘였더니 넓이가 처음 넓이의 ${k}배가 되었다. ${x}의 값은?`, v, {
        figure: grownRect(a, b, p),
        explain: `늘인 직사각형의 가로의 길이는 ${nb(`${a} + ${p} = ${a + p}`)}(cm), 세로의 길이는 ${nb(`(${b} + ${x})`)} cm이다. 처음 넓이는 ${nb(`${a} × ${b} = ${a * b}`)}(cm${sup(2)})이고 그 ${k}배는 ${k * a * b} cm${sup(2)}이다. ${told(L, R)}`,
        facts: { value: `${k}*${a}*${b}/(${a}+${p})-${b}` }
      });
    })
  ]);

  // ── 활용: 거리, 속력, 시간 ──
  B.addTypes(UNIT, 'speed', [
    T('speed-round-trip', '같은 길을 다른 속력으로 오갈 때의 거리', '①70', (d, n) => {
      if (n === 0) {
        // 올라갈 때와 내려올 때 같은 길
        const m = d.until(() => { const [u, w] = d.pick([[2, 3], [3, 4], [2, 4], [3, 6], [4, 6], [3, 5], [2, 6]]), v = d.int(2, 12); return { u, w, v, min: 60 * v / u + 60 * v / w }; }, (r) => Number.isInteger(r.min) && r.min % 10 === 0 && r.min <= 360 && r.min % 60 !== 0);
        const { u, w, v } = m, t = span(m.min), L = ts([Q(1, u), 'x'], [Q(1, w), 'x']), R = ts([t.q, '']);
        return N(`등산을 하는데 올라갈 때는 시속 ${u} km로 걷고, 내려올 때는 같은 길을 시속 ${w} km로 걸어서 모두 ${t.text}이 걸렸다. 올라간 거리는 몇 km인가?`, v, {
          unit: 'km', explain: `올라간 거리를 ${xu('km')}라 하면 올라갈 때 걸린 시간은 ${frac(x, u)}시간, 내려올 때 걸린 시간은 ${frac(x, w)}시간이다. ${t.text}은 ${tx(t.q)}시간이므로 ${told(L, R)}`,
          facts: { value: `${t.js}/(1/${u}+1/${w})`, unseen: [60, 1], rule: 'round-trip-0' }
        });
      }
      // 내려오는 길이 더 멀다.
      const m = d.until(() => { const [u, w] = d.pick([[2, 3], [3, 4], [2, 4], [3, 6], [4, 6], [3, 5], [2, 5]]), v = d.int(2, 12), e = d.int(1, 4); return { u, w, v, e, min: 60 * v / u + 60 * (v + e) / w }; }, (r) => Number.isInteger(r.min) && r.min % 30 === 0 && r.min <= 420);
      const { u, w, v, e } = m, t = span(m.min), L = [tm(Q(1, u), 'x'), tf(ts([1, 'x'], [e, '']), w, 1)], R = ts([t.q, '']);
      return N(`등산을 하는데 올라갈 때는 시속 ${u} km로 걷고, 내려올 때는 올라갈 때보다 ${e} km 더 먼 길을 시속 ${w} km로 걸어서 모두 ${t.text}이 걸렸다. 올라간 거리는 몇 km인가?`, v, {
        unit: 'km', explain: `올라간 거리를 ${xu('km')}라 하면 내려온 거리는 ${nb(`(${x} + ${e})`)} km이다. 올라갈 때 걸린 시간은 ${frac(x, u)}시간, 내려올 때 걸린 시간은 ${frac(`${x} + ${e}`, w)}시간이다. ${t.m ? `${t.text}은 ${tx(t.q)}시간이므로 ` : ''}${told(L, R)}`,
        facts: { value: `(${t.js}-${e}/${w})/(1/${u}+1/${w})`, unseen: [60, 1], rule: 'round-trip-1' }
      });
    }, { count: 2 }),
    T('speed-time-gap', '같은 거리를 두 속력으로 갈 때 걸리는 시간의 차', '①71', (d) => {
      const m = d.until(() => { const [fast, slow] = d.pick([[4, 3], [6, 4], [5, 4], [12, 4], [10, 5], [12, 3], [15, 5], [6, 3]]), min = d.pick([10, 15, 20, 30, 40, 45]); return { fast, slow, min, v: min * fast * slow / (60 * (fast - slow)) }; }, (r) => Number.isInteger(r.v) && r.v >= 1 && r.v <= 12);
      const { fast, slow, min, v } = m, L = ts([Q(1, slow), 'x'], [Q(-1, fast), 'x']), R = ts([Q(min, 60), '']);
      return N(`집에서 도서관까지 가는데 시속 ${fast} km로 자전거를 타고 가면 시속 ${slow} km로 걸어갈 때보다 ${min}분 빨리 도착한다. 집에서 도서관까지의 거리는 몇 km인가?`, v, {
        unit: 'km', explain: `집에서 도서관까지의 거리를 ${xu('km')}라 하면 걸어갈 때 걸리는 시간은 ${frac(x, slow)}시간, 자전거를 타고 갈 때 걸리는 시간은 ${frac(x, fast)}시간이다. ${min}분은 ${tx(Q(min, 60))}시간이므로 ${told(L, R)}`,
        facts: { value: `(${min}/60)/(1/${slow}-1/${fast})`, unseen: [60, 1] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
