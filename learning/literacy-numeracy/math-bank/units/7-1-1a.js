// 중학교 1학년 1학기 1단원 소인수분해 — 단원 틀·도구와 앞쪽 묶음(소수와 합성수, 거듭제곱, 소인수분해와 소인수, 약수와 약수의 개수).
// 수집해 둔 교과서 3종(미래엔 황선욱, 천재 김동재·김화경)의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 107꼴, 심화꼴 62꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/7-1-1/싣기_대조표.md 에 있다.
// (제곱인 수 만들기·최대공약수·최소공배수·거꾸로 찾기는 7-1-1b.js 에, 실력 문항은 7-1-1c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 영역은 수와 연산. 성취기준은 9수01-01(소인수분해의 뜻을 알고, 자연수를 소인수분해 할 수 있다), 9수01-02(소인수분해를 이용하여 최대공약수와 최소공배수를 구할 수 있다)이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(수 / 소인수분해 한 식 / 나눗셈 꼴·가지 그림·표), 묻는 것(값·개수·지수·고르기), 수의 개수(둘 / 셋)가 다르면 따로 싣는다.
//    수만 다른 것은 한 번만 싣는다. 같은 글에 구조만 다른 문항은 facts.rule 에 이름을 달았다.
//  - 초등 5학년 「약수와 배수」(5-1-2)와 겹치지 않게, 소인수분해를 이용해야 하는 꼴만 싣는다: 수를 소인수분해 한 식으로 주거나, 약수를 늘어놓기 어려운 큰 수를 준다.
//    약수를 늘어놓아 공약수·최대공약수를 찾는 문제, 공약수로 나누어 내려가는 셈은 싣지 않는다. 풀이는 모두 소인수분해로 적는다.
//  - 답은 모두 자연수이다(부호 단추 없음). 소인수분해 한 식이 답인 꼴은 틀을 식으로 보이고 지수(㉠, ㉡)나 소인수를 칸으로 받는다.
//    틀이 소인수를 알려 주므로 소인수를 묻는 유형(모두 고른 것, 소인수의 합, 소인수가 같은 수)을 따로 두었다.
//    최대공약수·최소공배수는 자연수로 받는 유형과 지수를 칸으로 받는 유형을 둘 다 두었다. 답은 9999를 넘지 않는다.
//    「모두 구하시오」는 옳게 모두 구한 것 고르기나 개수로 바꾸었다. 소인수의 합·지수의 합은 원문이 그렇게 묻는 꼴에만 썼다.
//  - 교육과정의 금: 「최대공약수와 최소공배수는 자연수의 소인수분해를 이용하는 범위에서 다루고, 최대공약수와 최소공배수의 활용 문제는 다루지 않는다.」
//    상황이 있는 활용 문제(나누어 주기, 타일, 톱니바퀴, 동시에 출발, 나머지 조건, 분수에 곱하여 자연수가 되게 하는 분수)는 하나도 싣지 않았다.
//    분수 꼴로 공약수·공배수의 뜻을 묻는 수 문제(①64·83의 앞쪽)만 실력에 실었다.
//  - 용어는 교육과정의 것(소수, 합성수, 거듭제곱, 지수, 밑, 소인수, 소인수분해, 서로소)만 쓴다. 「제곱수」는 「어떤 자연수의 제곱」으로 적는다.
//  - 꼴 목록에 적힌 원문 답지의 잘못은 따르지 않는다. 답은 모두 코드가 셈한다.
//  - 검사 근거: 지수·최대공약수·최소공배수는 「0**(a%b)」(a가 b로 나누어떨어지면 1, 아니면 0)를 더하고 곱한 식으로 다시 셈한다(나누어떨어지는 횟수를 센다).
//    개수는 수를 하나씩 나누어 본 참·거짓 목록(facts.count)으로, 제곱이 되게 하는 수는 1부터 넣어 보는 틀(facts.digit)로, 등식의 참·거짓은 양쪽 값(facts.claimed)으로 맞춰 본다.
//    문장의 참·거짓을 고르는 문항과 보기가 식인 고르기 문항은 검사가 답을 다시 셈하지 못한다(참·거짓만 적는다). 이 유형들은 문제 글만 읽어 다시 푸는 풀이를 따로 써서 맞춰 보았다.
//  - 꼴 목록의 [꼬임 의심] 가운데 실은 것: ①12(보기 다섯만 살피면 된다), ①44(약수 가운데 지수가 모두 짝수인 것만 센다). 「경계」로 적힌 심13(후보가 넷뿐이고 소인수를 세는 뜻을 묻는다)과 심4(새 낱말 없이 차가 2인 두 소수로 적었다)도 실었다.
//
// 뺀 것과 까닭(7-1-1b.js, 7-1-1c.js 의 것까지 여기에 모아 적는다)
//  - 최대공약수·최소공배수의 활용(교육과정의 금): ①96~107, 심51~62 전부. ①83의 뒤쪽(두 분수 어느 것에 곱해도 자연수가 되는 수)도 뺐다.
//  - 뒤 학년·다음 단원: 문자의 거듭제곱(①15의 변형, 심6의 ②), 약수의 총합 공식(심28), 세 모임의 겹침을 빼고 더하는 셈(심49),
//    거듭제곱끼리 나누어야 하는 두 수의 곱과 최소공배수(심41의 뒤쪽).
//  - 초등 내용 그대로(5-1-2에 실려 있다): 공약수·최대공약수의 뜻 낱말 넣기(①51), 약수를 늘어놓아 공약수가 최대공약수의 약수임을 보기(①52),
//    두 자리 수의 약수 가운데 범위에 드는 수의 합(①43), 최대공약수의 크기 견주기(①61), 두 수를 모두 나누어떨어지게 하는 가장 큰 수(①62),
//    공배수가 최소공배수의 배수임을 빈칸으로(①77), 두 수 어느 것으로 나누어도 나누어떨어지는 가장 작은 수(①82), 어떤 수에 가장 가까운 배수(심50).
//  - 조건 여럿을 풀거나 경우를 다 따지는 것: 자리 숫자의 합이 정해진 두 자리 소수(①13), 약수의 개수가 정해진 수를 차례로 찾기(①45 심26),
//    세 수 가운데 하나를 모를 때(①90 심39), 조건 둘에 맞는 가장 작은 수(①92), 서로소인 두 수로 가르기(①93), 자리를 바꾼 두 수(①94),
//    최대공약수·최소공배수와 합·크기 조건으로 두 수 찾기(심42), 이웃한 두 수의 곱(심48), 가지 그림의 문자(심15), 약수가 36개가 되는 두 지수(심24의 변형).
//  - 요령을 알아야 하는 것: 큰 거듭제곱의 일의 자리 숫자(①21 심45), 끝에 붙는 0의 개수(심44), a00a 꼴의 수(심14), 두 곱이 같은 제곱이 되는 수(심20).
//  - 새로 약속한 기호: 심46·47.
//  - 그림을 알 수 없는 것: 규칙을 찾아 식 쓰기(①95). 색칠하여 글자 만들기(①8)는 작도이다.
//  - 뜻 없는 셈·기본 둘을 붙인 것: 소인수의 합과 약수의 개수를 더하기(심23), 소인수분해 → 약수 → 개수를 차례로(①36). 하나하나는 실었다.
//  - 같은 일이어서 한 번만 실은 것: 한 자리 소수의 합(①5의 변형), 말로 준 거듭제곱(①15의 변형), 소인수의 합이 가장 큰 것(①30의 변형), 서로소의 뜻 되묻기(①68),
//    소인수의 개수가 가장 많은 것(심11 — 소인수가 1개뿐인 수 세기와 같다), 두 번째로 작은 공배수(①79의 앞쪽), 세 수의 공약수 모두 쓰기(①59 — 개수로).
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, box, frac, lines, numbers, table, N, M, C } = B.kit;
  const { LAB, range, gcd, lcm, nb, tail, V, sup, ex, proc, taggedEx, claimQ } = B.kit.mid;
  const U = '7-1-1', STD1 = '9수01-01', STD2 = '9수01-02';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});

  // ── 수의 성질 ──
  const isPrime = (n) => { if (n < 2) return false; for (let k = 2; k * k <= n; k += 1) if (n % k === 0) return false; return true; };
  const PRIMES = range(2, 199).filter(isPrime);
  const P2 = PRIMES.filter((p) => p > 10 && p < 100);   // 두 자리 소수
  const LOOK = [21, 27, 33, 39, 49, 51, 57, 63, 69, 77, 81, 87, 91, 93, 99];   // 소수로 보이기 쉬운 합성수(홀수이고 5로 끝나지 않는다)
  const divs = (n) => range(1, n).filter((k) => n % k === 0);
  const isSquare = (n) => Number.isInteger(Math.sqrt(n));
  const asc = (list) => list.slice().sort((x, y) => x - y);
  // 소인수분해: fz(360) → [[2, 3], [3, 2], [5, 1]] (소수와 지수). num 은 그 값, nd 는 약수의 개수, flat 은 소수를 지수만큼 늘어놓은 것.
  const fz = (n) => { const out = []; let m = n; for (let p = 2; m > 1; p += 1) { let e = 0; while (m % p === 0) { e += 1; m /= p; } if (e) out.push([p, e]); } return out; };
  const num = (f) => f.reduce((s, [p, e]) => s * p ** e, 1);
  const nd = (f) => f.reduce((s, [, e]) => s * (e + 1), 1);
  const flat = (f) => f.reduce((all, [p, e]) => all.concat(Array(e).fill(p)), []);
  const sortF = (f) => f.slice().sort((x, y) => x[0] - y[0]);
  const gcdF = (fs) => fz(fs.map(num).reduce((x, y) => gcd(x, y)));
  const lcmF = (fs) => fz(fs.map(num).reduce((x, y) => lcm(x, y)));
  const expIn = (f, p) => { const hit = f.find(([q]) => q === p); return hit ? hit[1] : 0; };

  // ── 식을 적는 글 ──
  // pw 거듭제곱(지수 1은 적지 않는다), fx 풀이·보기에 적는 식, fh 식 글꼴(mb-expr)에 적는 식, fjs 검사가 다시 셈하는 식
  const pw = (p, e) => (e === 1 ? String(p) : p + sup(e));
  const fx = (f) => (f.length ? f.map(([p, e]) => pw(p, e)).join(' × ') : '1');
  const fh = (f) => f.map(([p, e]) => pw(p, e)).join(' <i>×</i> ');
  const fjs = (f) => (f.length ? f.map(([p, e]) => (e === 1 ? String(p) : p + '**' + e)).join('*') : '1');
  // 식 뒤의 토씨는 마지막 인수를 읽는 소리에 맞춘다: 지수가 2 이상이면 「…제곱」(받침 있음), 아니면 그 소수.
  const endJ = (f, pair) => { const [p, e] = f[f.length - 1]; return e > 1 ? josa('제곱', pair).slice(2) : tail(p, pair); };
  const fm = (f) => nb(fx(f));
  const fmj = (f, pair) => nb(fx(f) + endJ(f, pair));
  const eqn = (n) => `${n} = ${fx(fz(n))}`;
  // 소수가 아님을 보이는 곱: 51 = 3 × 17
  const split = (n) => { const p = fz(n)[0][0]; return `${n} = ${p} × ${n / p}`; };
  // 약수의 개수를 구하는 식: (3 + 1) × (2 + 1) = 12
  const ndTold = (f) => (f.length > 1 ? f.map(([, e]) => `(${e} + 1)`).join(' × ') : `${f[0][1]} + 1`) + ` = ${nd(f)}`;

  // ── 검사가 답을 다시 셈하는 식 ──
  // 0**(a%b) 는 a가 b로 나누어떨어지면 1, 아니면 0이다. 이것을 더하면 「몇 번 나누어떨어지는가」(지수)가 된다.
  const UNSEEN = range(0, 30);
  const cap = (p, top) => { let k = 1; while (p ** k <= top) k += 1; return k; };
  // a 를 p 로 나눌 수 있는 횟수(a 는 식 글, top 은 그 값보다 크거나 같은 수)
  const expJs = (a, p, top) => range(1, cap(p, top)).map((k) => `0**((${a})%${p}**${k})`).join('+');
  // 여러 수가 모두 p**k 로 나누어떨어지는 k 의 개수(최대공약수의 지수), 하나라도 나누어떨어지는 k 의 개수(최소공배수의 지수)
  const gExp = (as, p, top) => range(1, cap(p, top)).map((k) => as.map((a) => `0**((${a})%${p}**${k})`).join('*')).join('+');
  const lExp = (as, p, top) => range(1, cap(p, top)).map((k) => `0**(${as.map((a) => `((${a})%${p}**${k})`).join('*')})`).join('+');
  const gcdJs = (as, ps, top) => ps.map((p) => `${p}**(${gExp(as, p, top)})`).join('*');
  const lcmJs = (as, ps, top) => ps.map((p) => `${p}**(${lExp(as, p, top)})`).join('*');
  const SMALL = [2, 3, 5, 7, 11, 13, 17, 19, 23];
  // 어떤 자연수의 제곱인지 보는 틀(□에 1부터 넣어 본다): 제곱근의 소수 부분이 0이다.
  const SQ = '0.0000001';

  // ── 수 고르기 ──
  // 소인수분해 한 식 하나: o.ps 에서 소인수 o.k 개를 골라 지수를 주고, 값이 o.lo~o.hi 에 들며 o.ok 를 만족할 때까지 다시 고른다.
  const form = (d, o) => d.until(() => sortF(d.shuffle(o.ps).slice(0, o.k).map((p) => [p, d.int(1, p <= 3 ? (o.emax || 4) : 2)])), (f) => num(f) >= (o.lo || 2) && num(f) <= o.hi && (!o.ok || o.ok(f)));
  // 소인수분해 한 식 여러 개: 두 소인수는 모든 수에 있고, 셋째 소인수는 몇몇 수에만 있다. 어느 수도 최대공약수·최소공배수와 같지 않다.
  function someForms(d, k, o) {
    const m = Object.assign({ hi: 2000, gmin: 6, lmax: 1e9, ps: [2, 3, 5, 7] }, o || {});
    return d.until(() => {
      const [p, q, r] = d.shuffle(m.ps);
      return range(1, k).map(() => sortF([[p, d.int(1, p <= 3 ? 4 : 2)], [q, d.int(1, q <= 3 ? 3 : 2)]].concat(d.int(0, 2) === 0 ? [[r, m.side1 ? 1 : d.int(1, 2)]] : [])));
    }, (fs) => {
      const vs = fs.map(num), g = vs.reduce((x, y) => gcd(x, y)), l = vs.reduce((x, y) => lcm(x, y));
      return new Set(vs).size === k && vs.every((v) => v <= m.hi && v > g && v < l && v >= (m.lo || 2)) && g >= m.gmin && l <= m.lmax && (!m.ok || m.ok(fs, fz(g), fz(l)));
    });
  }
  const primesOf = (fs) => asc([...new Set(fs.reduce((all, f) => all.concat(f.map(([p]) => p)), []))]);

  // ── 그림 ──
  // 수 배열표(lo부터 hi까지, 한 줄에 cols 칸)
  function numGrid(lo, hi, cols) {
    const cells = range(lo, hi), rows = [];
    for (let i = 0; i < cells.length; i += cols) rows.push(cells.slice(i, i + cols));
    return '<div class="mb-table-wrap"><table class="mb-table"><tbody>' + rows.map((row) => '<tr>' + row.map((v) => `<td style="padding:5px 0;width:2.3em;font-weight:400;background:#fff">${v}</td>`).join('') + '</tr>').join('') + '</tbody></table></div>';
  }
  // 소인수분해 하는 나눗셈 꼴. rows: [[나누는 소수, 나누어지는 수], …], last: 맨 아래에 남은 수. 칸에 이름표(㉠)를 넣으면 빈칸이다.
  function ladder(rows, last) {
    const cell = 'padding:4px 16px;text-align:center;min-width:3.2em', ink = '2px solid var(--ink, #1f2933)';
    const body = rows.map(([p, v]) => `<tr><td style="padding:4px 8px 4px 4px;text-align:right;min-width:1.8em">${p}</td><td style="${cell};border-left:${ink};border-bottom:${ink}">${v}</td></tr>`).join('');
    return `<table role="img" aria-label="소수로 차례로 나누는 셈" style="border-collapse:collapse;font-size:1.2rem;font-variant-numeric:tabular-nums;line-height:1.4"><tbody>${body}<tr><td></td><td style="${cell}">${last}</td></tr></tbody></table>`;
  }
  // 소인수분해 가지 그림: 수가 왼쪽 아래의 소수(동그라미)와 오른쪽 아래의 몫으로 갈라져 내려간다. 마지막 몫도 소수이다.
  // top: 맨 위 칸의 글, splits: [[소수, 몫], …](칸의 글). 이름표(㉠)를 넣으면 빈칸이다.
  function factorTree(top, splits) {
    const dx = 38, dy = 44, x0 = 52, y0 = 20, n = splits.length, W = x0 + dx * n + 34, H = y0 + dy * n + 22;
    const blank = (label) => LAB.includes(String(label));
    const word = (x, y, label) => `<text x="${x}" y="${y + 5.4}" text-anchor="middle" style="font-size:15.5px;font-weight:600;fill:#1f2933">${label}</text>`;
    const plainNode = (x, y, label) => (blank(label) ? `<rect x="${x - 14}" y="${y - 13}" width="28" height="26" rx="4" style="fill:#fff;stroke:#1f2933;stroke-width:1.6"/>` : '') + word(x, y, label);
    const roundNode = (x, y, label) => `<circle cx="${x}" cy="${y}" r="14" style="fill:${blank(label) ? '#fff' : '#eef4ff'};stroke:#1f2933;stroke-width:${blank(label) ? 1.6 : 1.2}"/>` + word(x, y, label);
    let wires = '', nodes = plainNode(x0, y0, top), x = x0, y = y0;
    const said = [];
    splits.forEach(([p, q], i) => {
      const lx = x - dx + 8, rx = x + dx, cy = y + dy, last = i === n - 1;
      wires += `<line x1="${x - 5}" y1="${y + 13}" x2="${lx + 6}" y2="${cy - 13}" style="stroke:#5b6770;stroke-width:1.2"/><line x1="${x + 5}" y1="${y + 13}" x2="${rx - 6}" y2="${cy - 13}" style="stroke:#5b6770;stroke-width:1.2"/>`;
      nodes += roundNode(lx, cy, p) + (last ? roundNode(rx, cy, q) : plainNode(rx, cy, q));
      said.push(`${i === 0 ? top : splits[i - 1][1]} → ${p}, ${q}`);
      x = rx; y = cy;
    });
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="소인수분해 가지 그림(위의 수가 아래의 두 수의 곱으로 갈라진다): ${said.join(' / ')}">${wires}${nodes}</svg>`;
  }
  // 소인수분해 한 식을 소인수끼리 세로로 맞추어 적은 표. ps: 소인수(열), rows: [{ head, cells: { 소수: 글 }, rule }] — rule 이면 그 줄 위에 금을 긋는다.
  function aligned(ps, rows) {
    const body = rows.map((row) => {
      let seen = false;
      const tds = ps.map((p) => {
        const h = row.cells[p];
        if (h === undefined) return '<td></td>';
        const out = `<td style="padding:3px 3px;text-align:left;white-space:nowrap"><span${seen ? '' : ' style="visibility:hidden"'}>× </span>${h}</td>`;
        seen = true; return out;
      }).join('');
      return `<tr${row.rule ? ' style="border-top:2px solid var(--ink, #1f2933)"' : ''}><td style="padding:3px 4px 3px 2px;text-align:right;white-space:nowrap">${row.head}</td>${tds}</tr>`;
    }).join('');
    return `<table role="img" aria-label="소인수분해 한 식을 소인수끼리 세로로 맞추어 적은 표" style="border-collapse:collapse;font-size:1.08rem;font-variant-numeric:tabular-nums;line-height:1.5"><tbody>${body}</tbody></table>`;
  }
  // 소식이 퍼지는 그림: 처음 한 사람이 k명에게, 그 k명이 저마다 새로운 k명에게 전한다(두 단계까지).
  function spreadFig(k) {
    const left = 52, W = 292, span = W - left - 8, y0 = 16, y1 = 60, y2 = 108, cx = left + span / 2;
    const dot = (x, y, r) => `<circle cx="${x.toFixed(1)}" cy="${y}" r="${r}" style="fill:#93c5fd;stroke:#1e3a8a;stroke-width:1.1"/>`;
    const wire = (x1, y1b, x2, y2b) => `<line x1="${x1.toFixed(1)}" y1="${y1b}" x2="${x2.toFixed(1)}" y2="${y2b}" style="stroke:#5b6770;stroke-width:1.1"/>`;
    const word = (y, label) => `<text x="4" y="${y + 4.5}" style="font-size:12.5px;font-weight:600;fill:#1f2933">${label}</text>`;
    let wires = '', dots = dot(cx, y0, 6.5);
    range(0, k - 1).forEach((i) => {
      const x1 = left + span * (2 * i + 1) / (2 * k);
      wires += wire(cx, y0, x1, y1);
      range(0, k - 1).forEach((j) => { const x2 = x1 + (j - (k - 1) / 2) * span / (k * k + 1); wires += wire(x1, y1, x2, y2); dots += dot(x2, y2, 5); });
      dots += dot(x1, y1, 6);
    });
    return `<svg class="mb-geo" viewBox="0 0 ${W} 132" width="${W}" role="img" aria-label="소식이 퍼지는 그림: 처음 한 사람이 ${k}명에게 전하고(1단계), 그 ${k}명이 저마다 새로운 ${k}명에게 전한다(2단계). 이와 같이 이어진다">`
      + wires + dots + word(y0, '처음') + word(y1, '1단계') + word(y2, '2단계') + `<text x="${cx}" y="128" text-anchor="middle" style="font-size:14px;font-weight:700;fill:#1f2933">⋮</text></svg>`;
  }
  // 긴 곱과 그것을 고쳐 쓴 식: 곱은 휴대폰 너비에서 줄이 바뀌어도 되게 적고, 고쳐 쓴 식은 다음 줄에 = 와 함께 적는다.
  const longEq = (left, right) => lines([`<span class="mb-expr" style="font-size:1.14rem;white-space:normal">${left}</span>`, `<span class="mb-expr" style="font-size:1.2rem"><i>=</i> ${right}</span>`]);
  // 수와 식을 띠로 묶어 보인다(식은 줄이 바뀌지 않게, 식과 식 사이에는 쉼표를 찍는다).
  const shelf = (list) => numbers(list.map((h, i) => nb(h + (i < list.length - 1 ? ',' : ''))));
  const ruled = (item, rule) => { item.facts.rule = rule; return item; };

  // 풀이 글: 최대공약수는 공통인 소인수의 작은 지수, 최소공배수는 모든 소인수의 큰 지수
  const lone = (fs) => { const g = gcdF(fs); return primesOf(fs).filter((p) => !expIn(g, p)); };
  const gTold = (fs) => { const only = lone(fs); return `공통인 소인수의 거듭제곱에서 지수가 같거나 작은 것을 골라 곱한다.${only.length ? ` ${only.join(', ')}${tail(only[only.length - 1], '은/는')} 공통인 소인수가 아니다.` : ''}`; };
  const lTold = (fs) => { const only = lone(fs); return `모든 소인수의 거듭제곱에서 지수가 같거나 큰 것을 골라 곱한다.${only.length ? ` 공통이 아닌 소인수 ${only.join(', ')}도 곱한다.` : ''}`; };
  const cellsOf = (f) => f.reduce((o, [p, e]) => Object.assign(o, { [p]: pw(p, e) }), {});
  const composite = (f) => f.length >= 2 || f[0][1] >= 2;

  // ── 참·거짓을 가리는 문장 ──
  const PRIME_TRUE = ['소수는 1보다 큰 자연수 가운데 1과 자기 자신만을 약수로 가지는 수이다.', '소수의 약수는 2개이다.', '합성수의 약수는 3개 이상이다.', '1은 소수도 합성수도 아니다.', '가장 작은 소수는 2이다.', '가장 작은 합성수는 4이다.', '1의 약수는 1개이다.'];
  const PRIME_FALSE = [
    ['가장 작은 소수는 1이다.', '1은 소수가 아니다. 가장 작은 소수는 2이다.', '가장 작은 소수는 2이다.'], ['1은 합성수이다.', '1은 약수가 1개뿐이므로 소수도 합성수도 아니다.', '1은 소수도 합성수도 아니다.'],
    ['소수의 약수는 1개이다.', '소수는 1과 자기 자신을 약수로 가지므로 약수가 2개이다.', '소수의 약수는 2개이다.'], ['합성수의 약수는 2개이다.', '약수가 2개인 수는 소수이다. 합성수의 약수는 3개 이상이다.', '합성수의 약수는 3개 이상이다.'],
    ['합성수의 약수는 모두 3개이다.', '합성수 6의 약수는 1, 2, 3, 6의 4개이다.', '합성수의 약수는 3개 이상이다.'], ['1은 소수이다.', '1은 약수가 1개뿐이므로 소수가 아니다.', '1은 소수도 합성수도 아니다.'],
    ['가장 작은 합성수는 2이다.', '2는 약수가 1, 2뿐인 소수이다. 가장 작은 합성수는 4이다.', '가장 작은 합성수는 4이다.'], ['1의 약수는 2개이다.', '1의 약수는 1 하나뿐이다.', '1의 약수는 1개이다.']
  ];

  B.addUnit({
    id: '7-1-1', grade: 7, semester: 1, no: 1, title: '소인수분해', version: 1,
    groups: [
      {
        id: 'prime', title: '소수와 합성수', standard: STD1,
        types: [
          T('prime-kind', '소수인지 합성수인지 가리기', '①1', (d) => {
            const n = d.bool() ? d.pick(P2.filter((p) => p > 20)) : d.pick(LOOK), list = divs(n), prime = isPrime(n);
            return C(`${josa(n, '은/는')} 소수인가, 합성수인가?`, ['소수', '합성수', '소수도 합성수도 아닌 수'], prime ? 0 : 1, {
              explain: prime ? `${n}의 약수는 1, ${n}의 2개뿐이므로 ${josa(n, '은/는')} 소수이다.` : `${split(n)}이므로 ${n}의 약수는 ${list.join(', ')}의 ${list.length}개이다. 약수가 3개 이상이므로 ${josa(n, '은/는')} 합성수이다.`,
              facts: { truth: [list.length === 2, list.length > 2, list.length < 2], want: true }
            });
          }),
          T('prime-not', '소수가 아닌 것 고르기', '①2', (d) => {
            const odd = d.pick(LOOK), rows = d.shuffle([d.pick([2, 3, 5, 7])].concat(d.shuffle(P2).slice(0, 3), [odd])), ask = d.bool();
            return C(`다음 중 ${ask ? '소수가 아닌' : '합성수인'} 것은?`, rows.map(String), rows.indexOf(odd), {
              explain: `${split(odd)}이므로 ${josa(odd, '은/는')} 합성수이다. 나머지 수는 약수가 1과 자기 자신뿐인 소수이다.`,
              facts: { truth: rows.map((v) => divs(v).length === 2), want: false }
            });
          }),
          T('prime-count', '수 목록에서 소수의 개수 세기', '①4', (d) => {
            const k = d.int(2, 4), odd = d.shuffle(LOOK).slice(0, 2), list = d.shuffle(d.shuffle(P2).slice(0, k).concat(odd, d.shuffle(range(3, 49)).slice(0, 5 - k).map((v) => 2 * v)));
            const ps = asc(list.filter(isPrime));
            return N('다음 수 가운데 소수는 모두 몇 개인가?', ps.length, {
              unit: '개', figure: numbers(list),
              explain: `소수는 ${ps.join(', ')}의 ${ps.length}개이다. ${asc(odd).map(split).join(', ')}이므로 이 두 수는 합성수이고, 2보다 큰 짝수도 합성수이다.`,
              facts: { count: list.map((v) => divs(v).length === 2) }
            });
          }),
          T('prime-sum', '수 목록에서 소수를 찾아 더하기', '①5', (d) => {
            const ps = asc([2].concat(d.shuffle([3, 5, 7, 11, 13, 17, 19, 23]).slice(0, 2)));
            const list = d.shuffle(ps.concat([1], d.shuffle([4, 6, 8, 9, 10, 12, 14, 15, 16, 18]).slice(0, 2), [d.pick([21, 25, 27, 33, 35, 39])])), total = ps.reduce((s, v) => s + v, 0);
            return N('다음 수 가운데 소수를 모두 찾아 더한 값은?', total, {
              figure: numbers(list), explain: `1은 소수가 아니고, 2는 소수이다. 소수는 ${ps.join(', ')}이므로 합은 ${ps.join(' + ')} = ${total}이다.`,
              facts: { calc: [[ps.join('+'), 0]] }
            });
          }),
          T('prime-sieve', '수 배열표에서 소수의 개수 세기', '①6', (d) => {
            const hi = d.pick([30, 36, 42, 48]), ps = PRIMES.filter((p) => p <= hi), keep = PRIMES.filter((p) => p * p <= hi);
            return N(`1부터 ${hi}까지의 자연수 가운데 소수는 모두 몇 개인가?`, ps.length, {
              unit: '개', figure: numGrid(1, hi, 6),
              explain: `1은 소수가 아니므로 지운다. ${keep.join(', ')}${tail(keep[keep.length - 1], '을/를')} 차례로 남기고 그 수의 배수를 모두 지우면 ${ps.join(', ')}${tail(ps[ps.length - 1], '이/가')} 남는다. 소수는 모두 ${ps.length}개이다.`,
              facts: { count: range(1, hi).map((v) => divs(v).length === 2) }
            });
          }),
          T('prime-two-divisors', '범위 안에서 약수가 2개인 수의 개수', '①7', (d) => {
            const a = d.pick([20, 30, 40, 50, 60, 70]), b = a + 20, ps = PRIMES.filter((p) => p >= a && p <= b);
            return N(`${a}부터 ${b}까지의 자연수 가운데 약수가 2개인 수는 모두 몇 개인가?`, ps.length, {
              unit: '개', explain: `약수가 2개인 수는 1과 자기 자신만을 약수로 가지는 소수이다. ${a}부터 ${b}까지의 소수는 ${ps.join(', ')}의 ${ps.length}개이다.`,
              facts: { count: range(a, b).map((v) => divs(v).length === 2) }
            });
          }),
          T('prime-facts', '소수와 합성수에 대한 설명의 참·거짓', '①9·10', (d, n) => {
            // 첫째는 뜻(약수의 개수, 1, 가장 작은 소수와 합성수), 둘째는 수 하나하나(이 수는 소수인가, 몇 이하의 소수는 몇 개인가)를 묻는다.
            const wantTrue = d.bool();
            if (n === 0) return ruled(claimQ(d, `소수와 합성수의 뜻에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, PRIME_TRUE, PRIME_FALSE, wantTrue), 'prime-facts-meaning');
            const upTo = d.pick([10, 20, 30]), under = PRIMES.filter((p) => p <= upTo), p = d.pick([13, 17, 19, 23]), q = d.pick([29, 31, 37, 41, 43]), sq = d.pick([9, 25, 49]), [c, c2] = d.shuffle([51, 57, 87, 91]);
            const yes = [`${p}의 약수는 2개이다.`, `${upTo} 이하의 소수는 ${under.length}개이다.`, `${josa(c, '은/는')} 합성수이다.`, '2는 소수이다.', `${sq}의 약수는 3개이다.`];
            const no = [
              [`${josa(c2, '은/는')} 소수이다.`, `${split(c2)}이므로 ${josa(c2, '은/는')} 합성수이다.`],
              [`${upTo} 이하의 소수는 ${under.length + 1}개이다.`, `${upTo} 이하의 소수는 ${under.join(', ')}의 ${under.length}개이다.`, `${upTo} 이하의 소수는 ${under.length}개이다.`],
              [`${josa(q, '은/는')} 합성수이다.`, `${q}의 약수는 1, ${q}뿐이므로 ${josa(q, '은/는')} 소수이다.`],
              ['2는 합성수이다.', '2의 약수는 1, 2뿐이므로 2는 소수이다.', '2는 소수이다.'],
              [`${sq}의 약수는 2개이다.`, `${sq}의 약수는 ${divs(sq).join(', ')}의 3개이다.`, `${sq}의 약수는 3개이다.`]
            ];
            return ruled(claimQ(d, `다음 설명 가운데 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, yes, no, wantTrue), 'prime-facts-numbers');
          }, { count: 2 }),
          T('prime-neighbors', '1만큼 작은 수와 1만큼 큰 수가 모두 소수인 수', '①12', (d) => {
            // 틀린 수는 이웃한 두 수 가운데 하나만 소수인 짝수이다(16: 15와 17).
            const even = range(2, 45).map((v) => 2 * v), good = even.filter((v) => isPrime(v - 1) && isPrime(v + 1)), bad = even.filter((v) => isPrime(v - 1) !== isPrime(v + 1));
            const odd = d.pick(bad), rows = d.shuffle(d.shuffle(good).slice(0, 4).concat([odd])), c = isPrime(odd - 1) ? odd + 1 : odd - 1;
            return C('다음 중 1만큼 작은 수와 1만큼 큰 수가 모두 소수인 수가 아닌 것은?', rows.map(String), rows.indexOf(odd), {
              explain: `${odd}보다 1만큼 작은 수는 ${odd - 1}, 1만큼 큰 수는 ${odd + 1}이다. ${split(c)}이므로 ${josa(c, '은/는')} 소수가 아니다.`,
              facts: { truth: rows.map((v) => divs(v - 1).length === 2 && divs(v + 1).length === 2), want: false }
            });
          }),
          T('prime-sieve-why', '소수를 찾을 때 배수를 지우는 까닭', '심5', (d) => {
            // 틀린 보기: 그 소수 자신도 배수라는 것을 잊은 말(「배수는 모두 합성수」), 약수의 개수를 거꾸로 댄 말, 배수가 아닌 수까지 넓힌 말.
            const p = d.pick([2, 3, 5]), right = `${p}보다 큰 ${p}의 배수는 1, ${p}, 자기 자신을 약수로 가지므로 합성수이다.`;
            const rows = d.shuffle([right, `${p}의 배수는 모두 합성수이다.`, `${p}보다 큰 ${p}의 배수는 약수가 2개뿐이다.`, `${p}보다 큰 자연수는 모두 합성수이다.`]);
            return C(`1부터 50까지의 자연수 가운데 소수를 찾으려고 한다. ${josa(p, '은/는')} 남기고 ${p}보다 큰 ${p}의 배수를 모두 지우는 까닭으로 옳은 것은?`, rows, rows.indexOf(right), {
              explain: `${p}보다 큰 ${p}의 배수는 1과 자기 자신 말고도 ${josa(p, '을/를')} 약수로 가진다. 약수가 3개 이상이므로 합성수이다. ${josa(p, '은/는')} ${p}의 배수이지만 약수가 1, ${p}뿐인 소수이다.`,
              facts: { truth: rows.map((r) => r === right), want: true }
            });
          })
        ]
      },
      {
        id: 'power', title: '거듭제곱', standard: STD1,
        types: [
          T('power-base-exp', '거듭제곱의 밑과 지수', '①14', (d) => {
            const [a, e] = d.until(() => [d.int(2, 12), d.int(2, 9)], ([x, y]) => x !== y);
            return M(`${nb(a + sup(e))}의 밑과 지수는?`, [{ label: '밑', answer: a }, { label: '지수', answer: e }], {
              explain: `${a}${sup(e)}은 ${josa(a, '을/를')} ${e}번 곱한 수이다. 곱하는 수 ${josa(a, '이/가')} 밑이고, 곱한 횟수 ${josa(e, '이/가')} 지수이다.`,
              facts: { calc: [[String(a), 0], [String(e), 1]] }
            });
          }),
          T('power-write', '같은 수를 여러 번 곱한 것을 거듭제곱으로 나타내기', '①15', (d) => {
            // 틀린 보기: 밑과 지수를 뒤바꾼 것, 곱한 횟수를 곱한 것, 곱한 횟수를 하나 덜 센 것
            const [a, n] = d.until(() => [d.pick([2, 3, 5, 7, 10, 11]), d.int(4, 7)], ([x, y]) => x !== y && x ** y !== y ** x);
            const rows = d.shuffle([[a + sup(n), `${a}**${n}`], [n + sup(a), `${n}**${a}`], [`${a} × ${n}`, `${a}*${n}`], [a + sup(n - 1), `${a}**${n - 1}`]]);
            return C(`${Array(n).fill(a).join(' × ')}${tail(a, '을/를')} 거듭제곱으로 나타낸 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1] === `${a}**${n}`), {
              explain: `${josa(a, '을/를')} ${n}번 곱한 수이므로 밑은 ${a}, 지수는 ${n}이다. ${a}${sup(n)}으로 나타낸다.`,
              facts: { choose: { exprs: rows.map((r) => r[1]), rule: 'equals', target: a ** n } }
            });
          }),
          T('power-collect', '여러 수의 곱을 거듭제곱으로 나타낸 식의 지수', '①15·18 심7', (d, n) => {
            // 첫째는 같은 수끼리 모여 있는 곱(지수 둘), 둘째는 같은 수가 흩어져 있는 곱(지수 셋)이다.
            const ps = asc(d.shuffle(n === 0 ? [2, 3, 5, 7, 11, 13] : [2, 3, 5, 7]).slice(0, 3));
            const es = n === 0 ? d.until(() => [d.int(2, 4), d.int(2, 4), 1], (v) => v[0] !== v[1] && v[0] + v[1] <= 6) : d.until(() => [d.int(2, 4), d.int(2, 3), d.int(2, 4)], (v) => new Set(v).size >= 2 && v[0] + v[1] + v[2] <= 8);
            const sorted = ps.reduce((all, p, i) => all.concat(Array(es[i]).fill(p)), []);
            const scattered = (list) => ps.some((p) => { const at = list.map((v, i) => (v === p ? i : -1)).filter((i) => i >= 0); return at[at.length - 1] - at[0] + 1 > at.length; });
            const terms = n === 0 ? sorted : d.until(() => d.shuffle(sorted), (list) => ps.filter((p) => { const at = list.map((v, i) => (v === p ? i : -1)).filter((i) => i >= 0); return at[at.length - 1] - at[0] + 1 > at.length; }).length >= 2);
            const k = n === 0 ? 2 : 3, frame = ps.map((p, i) => (i < k ? p + sup(LAB[i]) : String(p))).join(' <i>×</i> '), value = sorted.reduce((s, v) => s * v, 1);
            return M(`다음 식에서 ${LAB.slice(0, k).join(', ')}에 알맞은 수는?`, range(0, k - 1).map((i) => ({ label: LAB[i], answer: es[i] })), {
              figure: longEq(terms.join(' <i>×</i> '), frame),
              explain: `${ps.slice(0, k).map((p, i) => `${josa(p, '은/는')} ${es[i]}번`).join(', ')} 곱해져 있다. ${scattered(terms) ? '떨어져 있는 같은 수를 모아서 센다. ' : ''}${terms.join(' × ')} = ${fx(ps.map((p, i) => [p, es[i]]))}이다.`,
              facts: { calc: range(0, k - 1).map((i) => [expJs(terms.join('*'), ps[i], value), i]), unseen: UNSEEN, rule: 'power-collect-' + n }
            });
          }, { count: 2 }),
          T('power-frac', '분수를 여러 번 곱한 것을 거듭제곱으로 나타내기', '①16', (d) => {
            // 틀린 보기: 분자에 곱한 횟수를 곱한 것, 분자만 거듭제곱 한 것, 분모만 거듭제곱 한 것
            const [a, q] = d.pick([[2, 3], [2, 5], [3, 5], [2, 7], [3, 7], [3, 4]]), n = d.int(3, 5), f = frac(a, q), right = `(${f})${sup(n)}`;
            const rows = d.shuffle([right, frac(a * n, q + sup(n)), frac(a + sup(n), q), frac(a, q + sup(n))]);
            return C(`${nb(Array(n).fill(f).join(' × '))}${tail(a, '을/를')} 거듭제곱으로 나타낸 것은?`, rows, rows.indexOf(right), {
              explain: `${f}${tail(a, '을/를')} ${n}번 곱한 수이므로 밑은 ${f}, 지수는 ${n}이다. 분수 전체를 괄호로 묶어 (${f})${sup(n)}으로 나타낸다. 분자와 분모를 모두 ${n}번씩 곱한 수이다.`,
              facts: { truth: rows.map((r) => r === right), want: true }
            });
          }),
          T('power-claims', '거듭제곱으로 나타낸 식의 참·거짓', '①17 심6', (d) => {
            // 틀린 식: 지수를 곱한 것(2⁴ = 8), 곱한 횟수를 곱한 것(4 × 4 × 4 = 4 × 3), 밑과 지수를 뒤바꾼 것, 다른 수의 곱을 지수로 이은 것, 두 지수를 바꾸어 적은 것
            // 식마다 [글, 왼쪽을 셈하는 식, 오른쪽의 값, 바로잡은 말]을 적어 두어 검사가 양쪽 값을 따로 셈하게 한다.
            const wantTrue = d.bool(), times = (a, k) => Array(k).fill(a).join(' × '), mul = (a, k) => Array(k).fill(a).join('*'), two = () => asc(d.shuffle([2, 3, 5, 7]).slice(0, 2));
            const yes = d.shuffle([
              () => { const a = d.pick([3, 5, 7, 11]); return [`${a}${sup(2)} = ${a} × ${a}`, `${a}**2`, a * a]; },
              () => { const [a, k] = d.pick([[2, 5], [2, 6], [3, 4], [5, 2], [7, 2]]); return [`${a}${sup(k)} = ${a ** k}`, `${a}**${k}`, a ** k]; },
              () => { const [p, q] = two(), a = d.int(2, 3), b = d.int(2, 3); return [`${times(p, a)} × ${times(q, b)} = ${p}${sup(a)} × ${q}${sup(b)}`, `${mul(p, a)}*${mul(q, b)}`, p ** a * q ** b]; },
              () => { const k = d.int(3, 5); return [`${times(10, k)} = 10${sup(k)}`, mul(10, k), 10 ** k]; }
            ]).slice(0, wantTrue ? 1 : 3).map((make) => make().concat(['']));
            const no = d.shuffle([
              () => { const [a, k] = d.pick([[2, 3], [2, 4], [3, 3], [5, 3]]); return [`${a}${sup(k)} = ${a * k}`, `${a}**${k}`, a * k, `${a}${sup(k)} = ${times(a, k)} = ${a ** k}이다.`]; },
              () => { const a = d.pick([4, 5, 6, 7]); return [`${times(a, 3)} = ${a} × 3`, mul(a, 3), a * 3, `${times(a, 3)} = ${a}${sup(3)}이다.`]; },
              () => { const [a, k] = d.pick([[3, 4], [3, 5], [5, 4], [6, 5], [7, 4]]); return [`${times(a, k)} = ${k}${sup(a)}`, mul(a, k), k ** a, `${josa(a, '을/를')} ${k}번 곱하였으므로 ${times(a, k)} = ${a}${sup(k)}이다.`]; },
              () => { const [p, q] = two(); return [`${times(p, 3)} × ${q} = ${p}${sup(q)}`, `${mul(p, 3)}*${q}`, p ** q, `${times(p, 3)} × ${q} = ${p}${sup(3)} × ${q}이다.`]; },
              () => { const [p, q] = two(); return [`${times(p, 2)} × ${times(q, 3)} = ${p}${sup(3)} × ${q}${sup(2)}`, `${mul(p, 2)}*${mul(q, 3)}`, p ** 3 * q ** 2, `${times(p, 2)} × ${times(q, 3)} = ${p}${sup(2)} × ${q}${sup(3)}이다.`]; }
            ]).slice(0, wantTrue ? 3 : 1).map((make) => make());
            const rows = d.shuffle(yes.concat(no)), at = rows.findIndex((r) => (r[3] === '') === wantTrue);
            return C(`거듭제곱으로 나타낸 것으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, rows.map((r) => r[0]), at, {
              explain: (wantTrue ? '' : '같은 수를 곱한 횟수가 지수이다. ') + rows.filter((r) => r[3]).map((r) => r[3]).join(' '),
              facts: { claimed: rows.map((r) => [r[1], r[2]]), claimedWant: wantTrue }
            });
          }),
          T('power-find-exp', '거듭제곱의 값을 보고 지수 구하기', '①19', (d) => {
            const [b, e] = d.pick([[2, 5], [2, 6], [2, 7], [2, 8], [3, 4], [3, 5], [5, 3], [5, 4], [7, 3]]), v = b ** e, x = V('x');
            return N(`${nb(`${b}${sup(x)} = ${v}`)}일 때, 자연수 ${x}의 값은?`, e, {
              explain: `${v} = ${Array(e).fill(b).join(' × ')}이므로 ${v} = ${b}${sup(e)}이다. ${x} = ${e}이다.`,
              facts: { digit: { template: `${v}-1<${b}**□<${v}+1`, lo: 1, hi: 12, ask: 'max' } }
            });
          }),
          T('power-story', '되풀이하여 늘어나는 수를 거듭제곱으로 나타내기', '①20', (d) => {
            // 틀린 보기: 밑과 지수를 뒤바꾼 것, 단계 수를 곱한 것, 1단계를 한 사람으로 세어 한 단계 덜 곱한 것
            const k = d.pick([2, 3]), n = d.until(() => d.int(6, 9), (v) => v ** k !== k ** v);
            const rows = d.shuffle([[k + sup(n), `${k}**${n}`], [n + sup(k), `${n}**${k}`], [`${k} × ${n}`, `${k}*${n}`], [k + sup(n - 1), `${k}**${n - 1}`]]);
            return C(`한 사람이 ${k}명에게 소식을 전하고(1단계), 소식을 받은 사람은 저마다 새로운 ${k}명에게 소식을 전한다(2단계). 이와 같이 이어 갈 때, ${n}단계에서 소식을 받는 사람의 수를 거듭제곱으로 나타낸 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1] === `${k}**${n}`), {
              figure: spreadFig(k),
              explain: `소식을 받는 사람은 1단계에서 ${k}명, 2단계에서 ${k} × ${k} = ${k * k}명이다. 한 단계마다 ${k}배가 되므로 ${n}단계에서는 ${josa(k, '을/를')} ${n}번 곱한 ${k}${sup(n)}명이다.`,
              facts: { choose: { exprs: rows.map((r) => r[1]), rule: 'equals', target: k ** n } }
            });
          })
        ]
      },
      {
        id: 'factor', title: '소인수분해와 소인수', standard: STD1,
        types: [
          T('factor-ladder', '소인수분해 하는 과정의 빈칸', '①24', (d, n) => {
            // 첫째는 소수로 차례로 나누는 셈(몫을 구한다), 둘째는 가지 그림(맨 위의 수는 곱하여, 맨 끝의 수는 나누어 구한다)이다.
            const ps = d.until(() => asc([d.pick([2, 3]), d.pick([2, 3]), d.pick([2, 3, 5]), d.pick([3, 5, 7, 11])]), (list) => new Set(list).size >= 2 && list.reduce((s, v) => s * v, 1) <= 400 && list.reduce((s, v) => s * v, 1) >= 36);
            const v = ps.reduce((s, p) => s * p, 1), q1 = v / ps[0], q2 = q1 / ps[1];
            if (n === 0) return M(`${josa(v, '을/를')} 소인수분해 하려고 소수로 차례로 나누었다. ㉠, ㉡에 알맞은 수는?`, [{ label: LAB[0], answer: q1 }, { label: LAB[1], answer: ps[3] }], {
              figure: ladder([[ps[0], v], [ps[1], LAB[0]], [ps[2], q2]], LAB[1]),
              explain: `${v} ÷ ${ps[0]} = ${q1}이므로 ㉠은 ${q1}이고, ${q2} ÷ ${ps[2]} = ${ps[3]}이므로 ㉡은 ${ps[3]}이다. 나눈 소수와 마지막 몫을 모두 곱하면 ${eqn(v)}이다.`,
              facts: { calc: [[`${v}/${ps[0]}`, 0], [`${q2}/${ps[2]}`, 1]], rule: 'factor-ladder' }
            });
            return M('어떤 자연수를 소인수분해 하는 과정을 그림으로 나타낸 것이다. ㉠, ㉡에 알맞은 수는?', [{ label: LAB[0], answer: v }, { label: LAB[1], answer: ps[3] }], {
              figure: factorTree(LAB[0], [[ps[0], q1], [ps[1], q2], [ps[2], LAB[1]]]),
              explain: `㉠은 ${ps[0]} × ${q1} = ${v}이고, ㉡은 ${q2} ÷ ${ps[2]} = ${ps[3]}이다. 가지 끝의 소수를 모두 곱하면 ${eqn(v)}이다.`,
              facts: { calc: [[`${ps[0]}*${q1}`, 0], [`${q2}/${ps[2]}`, 1]], rule: 'factor-tree' }
            });
          }, { count: 2 }),
          T('factor-exp', '자연수를 소인수분해 한 식의 지수', '①22·23·25·26 심8', (d) => {
            const f = form(d, { ps: [2, 3, 5, 7, 11, 13], k: 3, lo: 60, hi: 900, ok: (g) => g[0][0] <= 3 && g[2][1] === 1 && g[0][1] + g[1][1] >= 3 }), v = num(f);
            return M(`${josa(v, '을/를')} 소인수분해 하면 다음과 같다. ㉠, ㉡에 알맞은 수는?`, [{ label: LAB[0], answer: f[0][1] }, { label: LAB[1], answer: f[1][1] }], {
              figure: ex(`${v} <i>=</i> ${f[0][0]}${sup(LAB[0])} <i>×</i> ${f[1][0]}${sup(LAB[1])} <i>×</i> ${f[2][0]}`),
              explain: `${josa(v, '을/를')} 작은 소수부터 차례로 나누면 ${v} = ${flat(f).join(' × ')} = ${fx(f)}이다.`,
              facts: { calc: [[expJs(v, f[0][0], v), 0], [expJs(v, f[1][0], v), 1]], unseen: UNSEEN }
            });
          }),
          T('factor-base', '자연수를 소인수분해 한 식의 지수와 소인수', '①25 심8', (d) => {
            const [p, a, q] = d.until(() => [d.pick([2, 3]), d.int(2, 5), d.pick([5, 7, 11, 13, 17, 19, 23])], ([x, e, y]) => x ** e * y >= 40 && x ** e * y <= 500), v = p ** a * q;
            return M(`${josa(v, '을/를')} 소인수분해 하면 다음과 같다. ㉠, ㉡에 알맞은 수는?`, [{ label: LAB[0], answer: a }, { label: LAB[1], answer: q }], {
              figure: ex(`${v} <i>=</i> ${p}${sup(LAB[0])} <i>×</i> ${box(LAB[1])}`),
              explain: `${josa(v, '을/를')} ${josa(p, '으로/로')} 나눌 수 없을 때까지 나누면 ${v} = ${Array(a).fill(p).join(' × ')} × ${q}이다. ${josa(q, '은/는')} 소수이므로 ${v} = ${p}${sup(a)} × ${q}이다.`,
              facts: { calc: [[expJs(v, p, v), 0], [`${v}/${p}**${a}`, 1]], unseen: UNSEEN }
            });
          }),
          T('factor-exp-sum', '소인수분해 했을 때 지수의 합', '①26', (d) => {
            // 지수가 적혀 있지 않은 소인수(지수 1)를 빠뜨리기 쉽다.
            const f = form(d, { ps: [2, 3, 5, 7, 11], k: d.pick([2, 3]), lo: 90, hi: 990, ok: (g) => g.some(([, e]) => e === 1) && g.some(([, e]) => e >= 2) }), v = num(f), total = f.reduce((s, [, e]) => s + e, 0);
            return N(`${josa(v, '을/를')} 소인수분해 했을 때, 각 소인수의 지수의 합은?`, total, {
              explain: `${eqn(v)}이다. 지수가 적혀 있지 않은 소인수의 지수는 1이므로 지수의 합은 ${f.map(([, e]) => e).join(' + ')} = ${total}이다.`,
              facts: { calc: [[[2, 3, 5, 7, 11].map((p) => expJs(v, p, v)).join('+'), 0]], unseen: UNSEEN }
            });
          }),
          T('factor-right', '소인수분해를 바르게 한 것 고르기', '①27', (d) => {
            // 틀린 식: 소수가 아닌 수가 남은 것(24 = 3 × 8, 120 = 2² × 5 × 6, 100 = 10²), 지수가 틀린 것
            const wantTrue = d.bool(), POOL = [24, 36, 40, 45, 48, 54, 56, 60, 63, 72, 75, 84, 90, 96, 98, 108, 120, 126, 132, 150, 180];
            const bad = [
              (v) => { const f = fz(v), i = f.findIndex(([, e]) => e >= 2); if (i < 0) return null; const c = f[i][0] ** f[i][1]; return [`${v} = ${f.filter((_, j) => j !== i).map(([q, k]) => pw(q, k)).concat([String(c)]).join(' × ')}`, `${josa(c, '은/는')} 소수가 아니다.`]; },
              (v) => { const f = fz(v), c = f[0][0] * f[1][0], rest = f.map(([q, k], j) => [q, j < 2 ? k - 1 : k]).filter(([, k]) => k > 0); if (!rest.length) return null; return [`${v} = ${rest.map(([q, k]) => pw(q, k)).concat([String(c)]).join(' × ')}`, `${josa(c, '은/는')} 소수가 아니다.`]; },
              (v) => { const f = fz(v), i = d.int(0, f.length - 1), g = f.map(([q, k], j) => [q, j === i ? k + 1 : k]); return [`${v} = ${fx(g)}`, `${fx(g)} = ${num(g)}이다.`]; },
              (v) => { const c = d.pick([8, 9, 10, 12, 14, 15]); return [`${c * c} = ${c}${sup(2)}`, `${josa(c, '은/는')} 소수가 아니다.`, c * c]; }
            ];
            const rows = d.until(() => {
              const ns = d.shuffle(POOL).slice(0, 5), makers = d.shuffle(bad).slice(0, wantTrue ? 4 : 1);
              const wrong = makers.map((make, i) => { const made = make(ns[i]); return made && { text: made[0], ok: false, why: made[1], v: made[2] || ns[i] }; });
              return wrong.concat(ns.slice(makers.length).map((v) => ({ text: eqn(v), ok: true, v })));
            }, (list) => list.every(Boolean) && new Set(list.map((r) => r.v)).size === 5);
            const shown = d.shuffle(rows), wrongs = shown.filter((r) => !r.ok);
            return C(`다음 중 소인수분해를 바르게 ${wantTrue ? '한' : '하지 않은'} 것은?`, shown.map((r) => r.text), shown.findIndex((r) => r.ok === wantTrue), {
              explain: `소인수분해는 자연수를 소수들만의 곱으로 나타내는 것이다. ${wantTrue ? '' : wrongs[0].why + ' '}바르게 소인수분해 하면 ${wrongs.map((r) => eqn(r.v)).join(', ')}이다.`,
              facts: { truth: shown.map((r) => r.ok), want: wantTrue }
            });
          }),
          T('factor-product', '여러 수의 곱을 소인수분해 한 식의 지수', '①28 심43', (d) => {
            const whole = d.bool(), [lo, hi] = whole ? [1, d.pick([8, 9, 10])] : d.until(() => { const top = d.int(8, 12); return [top - d.int(3, 5), top]; }, ([a, b]) => range(a, b).some((v) => v % 5 === 0));
            const terms = range(lo, hi), value = terms.reduce((s, v) => s * v, 1), f = fz(value);
            const shown = whole ? `1부터 ${hi}까지의 자연수를 모두 곱한 수 ${nb(`1 × 2 × 3 × ⋯ × ${hi}`)}` : nb(terms.join(' × '));
            const parts = terms.filter((v) => v > 1 && !isPrime(v)).map(eqn).join(', ');
            return M(`${shown}${tail(hi, '을/를')} 소인수분해 하면 다음과 같다. ㉠, ㉡, ㉢에 알맞은 수는?`, [0, 1, 2].map((i) => ({ label: LAB[i], answer: f[i][1] })), {
              figure: ex(f.map(([p, e], i) => (i < 3 ? p + sup(LAB[i]) : pw(p, e))).join(' <i>×</i> '), 3),
              explain: `곱한 수를 하나씩 소인수분해 하면 ${parts}이다. 소인수 ${f.slice(0, 3).map(([p, e]) => `${josa(p, '은/는')} ${e}번`).join(', ')} 곱해져 있으므로 ${fx(f)}이다.`,
              facts: { calc: [0, 1, 2].map((i) => [expJs(terms.join('*'), f[i][0], value), i]), unseen: UNSEEN }
            });
          }),
          T('factor-primes', '소인수를 모두 구한 것 고르기', '①23·29 심9', (d) => {
            // 틀린 보기: 1을 넣은 것, 소인수의 거듭제곱을 적은 것, 소인수분해 한 식을 적은 것, 소수가 아닌 약수를 넣은 것
            const f = form(d, { ps: [2, 3, 5, 7, 11], k: d.pick([2, 3]), lo: 40, hi: 600, ok: (g) => g.some(([, e]) => e >= 2) }), v = num(f), ps = f.map(([p]) => p), [p, e] = f.find(([, k]) => k >= 2);
            const right = ps.join(', '), rows = d.shuffle([right, '1, ' + right, f.map(([q, k]) => pw(q, k)).join(', '), fx(f), asc(ps.concat([p * p])).join(', ')]);
            return C(`${v}의 소인수를 모두 구한 것은?`, rows, rows.indexOf(right), {
              explain: `${eqn(v)}이므로 소인수는 ${right}이다. 1은 소수가 아니므로 소인수가 아니고, ${p}${sup(e)}은 소인수 ${p}의 거듭제곱이다.`,
              facts: { truth: rows.map((r) => r === right), want: true }
            });
          }),
          T('factor-prime-sum', '모든 소인수의 합', '①30', (d) => {
            // 지수만큼 여러 번 더하면 틀린다(360 = 2³ × 3² × 5의 소인수는 2, 3, 5).
            const f = form(d, { ps: [2, 3, 5, 7, 11, 13], k: 3, lo: 120, hi: 900, ok: (g) => g.some(([, e]) => e >= 2) }), v = num(f), ps = f.map(([p]) => p), total = ps.reduce((s, p) => s + p, 0);
            return N(`${v}의 모든 소인수의 합은?`, total, {
              explain: `${eqn(v)}이므로 소인수는 ${ps.join(', ')}이다. 소인수의 합은 ${ps.join(' + ')} = ${total}이다.`,
              facts: { calc: [[SMALL.map((p) => `${p}*0**(${v}%${p})`).join('+'), 0]], unseen: UNSEEN }
            });
          }),
          T('factor-same-primes', '소인수가 나머지와 다른 수 찾기', '①31 심10', (d) => {
            const [p, q] = d.pick([[2, 3], [2, 5], [3, 5], [2, 7], [5, 7]]), own = (v) => fz(v).map(([r]) => r).join();
            const same = range(6, 400).filter((v) => own(v) === [p, q].join()), others = range(6, 400).filter((v) => { const f = fz(v); return f.some(([r]) => r === p || r === q) && own(v) !== [p, q].join() && !isPrime(v) && f.length <= 2 && f.every(([r]) => r <= 11); });
            const odd = d.pick(others), rows = d.shuffle(d.shuffle(same).slice(0, 4).concat([odd]));
            return C('다음 중 소인수가 나머지 넷과 다른 것은?', rows.map(String), rows.indexOf(odd), {
              explain: `${rows.map(eqn).join(', ')}이다. ${odd}의 소인수는 ${fz(odd).map(([r]) => r).join(', ')}이고, 나머지 수의 소인수는 ${p}, ${q}이다. 지수가 달라도 소인수는 같다.`,
              facts: { truth: rows.map((v) => SMALL.concat([29, 31, 37, 41, 43, 47]).filter((r) => v % r === 0).join() === [p, q].join()), want: false }
            });
          }),
          T('factor-single-count', '소인수가 1개뿐인 수의 개수', '①32 심11', (d) => {
            // 소수와 소수의 거듭제곱은 소인수가 1개뿐이다. 지수가 커도 소인수의 개수는 늘지 않는다.
            const a = d.int(1, 2), b = d.int(1, 2);
            const list = d.shuffle(d.shuffle([11, 13, 17, 19, 23, 29]).slice(0, a).concat(d.shuffle([8, 9, 16, 25, 27, 32, 49, 64, 81]).slice(0, b), d.shuffle([12, 18, 20, 24, 28, 45, 50, 63, 75]).slice(0, 6 - a - b)));
            const flags = list.map((v) => PRIMES.filter((p) => v % p === 0).length === 1), hit = list.filter((v, i) => flags[i]);
            return N('다음 수 가운데 소인수가 1개뿐인 수는 모두 몇 개인가?', a + b, {
              unit: '개', figure: numbers(list),
              explain: `${list.map((v) => (isPrime(v) ? `${v}(소수)` : eqn(v))).join(', ')}이다. 소인수가 1개뿐인 수는 ${hit.join(', ')}의 ${hit.length}개이다.`,
              facts: { count: flags }
            });
          })
        ]
      },
      {
        id: 'divisor', title: '약수와 약수의 개수', standard: STD1,
        types: [
          T('divisor-table', '약수를 구하는 표의 빈칸', '①33', (d) => {
            const [p, q, a, b] = d.until(() => d.pick([[2, 3], [2, 5], [3, 5], [2, 7], [3, 7]]).concat(d.pick([[1, 3], [2, 2], [3, 1], [2, 3], [3, 2]])), ([x, y, i, j]) => x ** i * y ** j <= 700 && x ** i * y ** j >= 12);
            const f = [[p, a], [q, b]], v = num(f), cells = d.shuffle(range(1, a).reduce((all, i) => all.concat(range(1, b).map((j) => [i, j])), []).filter(([i, j]) => i < a || j < b)).slice(0, 2);
            const mark = (i, j) => { const at = cells.findIndex(([x, y]) => x === i && y === j); return at < 0 ? p ** i * q ** j : LAB[at]; };
            const head = ['×', '1'].concat(range(1, b).map((j) => pw(q, j))), rows = range(0, a).map((i) => [i === 0 ? '1' : pw(p, i)].concat(range(0, b).map((j) => mark(i, j))));
            return M(`${nb(`${v} = ${fx(f)}`)}의 약수를 모두 구하려고 표를 만들었다. ㉠, ㉡에 알맞은 수는?`, cells.map(([i, j], k) => ({ label: LAB[k], answer: p ** i * q ** j })), {
              figure: table(head, rows),
              explain: `${pw(p, a)}의 약수와 ${pw(q, b)}의 약수를 하나씩 곱한 수가 ${v}의 약수이다. ${cells.map(([i, j], k) => `${LAB[k]}은 ${pw(p, i)} × ${pw(q, j)} = ${p ** i * q ** j}`).join(', ')}이다.`,
              facts: { calc: cells.map(([i, j], k) => [fjs([[p, i], [q, j]]), k]) }
            });
          }),
          T('divisor-all', '소인수분해 한 식을 보고 약수를 모두 구한 것 고르기', '①34', (d) => {
            // 틀린 보기: 지수를 빼고 생각한 것(3² × 7을 3 × 7로), 소인수의 거듭제곱만 적고 서로 곱한 수를 빠뜨린 것, 1을 빠뜨린 것
            const f = d.until(() => { const [p, q] = asc(d.shuffle([2, 3, 5, 7]).slice(0, 2)), sq = d.bool(); return [[p, sq ? 2 : 1], [q, sq ? 1 : 2]]; }, (g) => num(g) <= 250), v = num(f), all = divs(v);
            const [[p, a], [q, b]] = f, powers = asc(range(0, a).map((i) => p ** i).concat(range(1, b).map((j) => q ** j)));
            const right = all.join(', '), rows = d.shuffle([right, divs(p * q).join(', '), powers.join(', '), all.slice(1).join(', ')]);
            return C(`${fm(f)}의 약수를 모두 구한 것은?`, rows, rows.indexOf(right), {
              explain: `${pw(p, a)}의 약수는 ${range(0, a).map((i) => p ** i).join(', ')}이고, ${pw(q, b)}의 약수는 ${range(0, b).map((j) => q ** j).join(', ')}이다. 이들을 하나씩 곱한 ${right}${tail(v, '이/가')} ${fx(f)}의 약수이다.`,
              facts: { truth: rows.map((r) => r === right), want: true }
            });
          }),
          T('divisor-pick', '약수가 아닌 것 고르기(보기가 소인수분해 한 식)', '①37 심21', (d, n) => {
            // 첫째는 수를 소인수분해 한 식으로, 둘째는 자연수로 준다(소인수분해부터 한다). 틀린 보기는 한 소인수의 지수만 1 큰 수이다.
            const f = form(d, { ps: [2, 3, 5, 7], k: d.pick([2, 3]), lo: n === 0 ? 60 : 80, hi: n === 0 ? 2000 : 400, ok: (g) => nd(g) >= 9 && nd(g) <= 24 }), v = num(f);
            const [bad, good] = d.until(() => {
              const i = d.int(0, f.length - 1), over = f.map(([p, e], j) => [p, j === i ? e + 1 : d.int(0, e)]).filter(([, e]) => e > 0);
              const under = d.shuffle(divs(v).filter((k) => k > 1 && k < v)).slice(0, 4).map(fz);
              return [over, under];
            }, ([over, under]) => num(over) < v && under.length === 4 && under.filter((g) => g.length >= 2).length >= 2);
            const rows = d.shuffle(good.concat([bad])), [p, e] = bad.find(([q, k]) => k > expIn(f, q));
            return C(`다음 중 ${n === 0 ? fm(f) : v}의 약수가 아닌 것은?`, rows.map(fx), rows.indexOf(bad), {
              explain: `${n === 0 ? '' : eqn(v) + '이다. '}약수는 소인수의 지수가 같거나 작은 수이다. ${fmj(bad, '은/는')} 소인수 ${p}의 지수가 ${e}이고, 이것은 ${fx(f)}에서 ${p}의 지수 ${e - 1}보다 크므로 약수가 아니다.`,
              facts: { truth: rows.map((g) => v % num(g) === 0), want: false, rule: 'divisor-pick-' + n }
            });
          }, { count: 2 }),
          T('divisor-count', '약수의 개수 구하기', '①35·36·38', (d, n) => {
            // 첫째는 소인수분해 한 식으로, 둘째는 세 자리 수로 준다(소인수분해부터 한다).
            if (n === 0) {
              const f = form(d, { ps: [2, 3, 5, 7], k: d.pick([2, 3, 3]), lo: 50, hi: 3000, ok: (g) => nd(g) >= 6 && nd(g) <= 24 && g.some(([, e]) => e === 1) }), v = num(f);
              return N(`${fm(f)}의 약수는 모두 몇 개인가?`, nd(f), {
                unit: '개', explain: `약수의 개수는 각 소인수의 지수에 1을 더한 수를 모두 곱한 것과 같다. 지수가 적혀 있지 않은 소인수의 지수는 1이다. ${ndTold(f)}이므로 ${nd(f)}개이다.`,
                facts: { count: range(1, v).map((k) => v % k === 0), rule: 'divisor-count-form' }
              });
            }
            const v = d.pick([108, 144, 196, 200, 216, 225, 252, 297, 360, 392, 432, 500, 675]), f = fz(v);
            return N(`소인수분해를 이용하여 ${v}의 약수의 개수를 구하시오.`, nd(f), {
              unit: '개', explain: `${eqn(v)}이다. 약수의 개수는 각 소인수의 지수에 1을 더한 수를 모두 곱한 것과 같으므로 ${ndTold(f)}이다.`,
              facts: { count: range(1, v).map((k) => v % k === 0), rule: 'divisor-count-number' }
            });
          }, { count: 2 }),
          T('divisor-most', '약수의 개수가 가장 많은 것 고르기', '①39 심22', (d) => {
            const rows = d.until(() => d.shuffle(d.shuffle([12, 18, 20, 24, 30, 36, 48, 60, 72, 75, 98, 100, 128]).slice(0, 2).map((v) => ({ text: String(v), v })).concat([0, 1, 2].map(() => { const f = form(d, { ps: [2, 3, 5, 7], k: d.pick([2, 3]), lo: 12, hi: 2000 }); return { text: fx(f), v: num(f) }; }))),
              (list) => new Set(list.map((r) => nd(fz(r.v)))).size === 5 && new Set(list.map((r) => r.v)).size === 5);
            const counts = rows.map((r) => nd(fz(r.v))), nums = rows.filter((r) => /^\d+$/.test(r.text));
            return C('다음 중 약수의 개수가 가장 많은 것은?', rows.map((r) => r.text), counts.indexOf(Math.max(...counts)), {
              explain: `${nums.map((r) => eqn(r.v)).join(', ')}이다. 약수의 개수는 각 소인수의 지수에 1을 더한 수를 모두 곱한 것과 같으므로 차례로 ${counts.join(', ')}개이다.`,
              facts: { rank: { values: rows.map((r) => divs(r.v).length), nth: 1 } }
            });
          }),
          T('divisor-frac-count', '분수가 자연수가 되게 하는 분모의 개수', '①41', (d) => {
            const v = d.pick([75, 98, 99, 117, 135, 147, 153, 171, 175, 189, 225, 242, 245, 250, 275, 325, 375, 441]), f = fz(v), x = V('n'), fr = frac(v, x);
            return N(`${fr}${tail(v, '이/가')} 자연수가 되게 하는 자연수 ${x}은 모두 몇 개인가?`, nd(f), {
              unit: '개', explain: `${fr}${tail(v, '이/가')} 자연수가 되려면 ${x}은 ${v}의 약수이어야 한다. ${eqn(v)}이므로 약수의 개수는 ${ndTold(f)}이다.`,
              facts: { count: range(1, v).map((k) => v % k === 0) }
            });
          })
        ]
      },
      { id: 'square', title: '어떤 자연수의 제곱인 수 만들기', standard: STD1, types: [] },
      { id: 'gcd', title: '공약수, 최대공약수, 서로소', standard: STD2, types: [] },
      { id: 'lcm', title: '공배수, 최소공배수', standard: STD2, types: [] },
      { id: 'back', title: '최대공약수와 최소공배수를 알 때 수 구하기', standard: STD2, types: [] }
    ]
  });

  // 같은 단원의 다른 파일(7-1-1b.js, 7-1-1c.js)이 함께 쓰는 도구
  B.kit.m711 = {
    U, STD1, STD2, LAB, range, gcd, lcm, nb, tail, V, sup, ex, proc, taggedEx, claimQ, isPrime, PRIMES, P2, LOOK, divs, isSquare, asc, fz, num, nd, flat, sortF, gcdF, lcmF, expIn,
    pw, fx, fh, fjs, endJ, fm, fmj, eqn, split, ndTold, UNSEEN, cap, expJs, gExp, lExp, gcdJs, lcmJs, SMALL, SQ, form, someForms, primesOf, numGrid, ladder, factorTree, aligned, shelf, ruled, lone, gTold, lTold, cellsOf, composite
  };
})(typeof window !== 'undefined' ? window : globalThis);
