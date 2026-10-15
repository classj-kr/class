// 중학교 1학년 1학기 3단원 문자의 사용과 식 — 뒤쪽 묶음(다항식의 용어와 일차식, 일차식과 수의 곱셈·나눗셈, 동류항과 일차식의 덧셈·뺄셈, 어떤 식 구하기와 식의 대입).
// 단원 틀과 도구(식 글), 싣는 기준, 뺀 것과 까닭은 7-1-3a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 계산 문항은 식의 구조가 다른 것만 따로 싣고(차례마다 facts.rule 의 이름이 다르다), 답은 그림 자리에 적은 식 글을 코드가 셈한 것이다.
// 검사가 다시 셈하는 식(facts.calc)은 답을 얻은 길과 따로, 문제에 적힌 수로 계수와 상수항을 셈하는 식을 손으로 적었다.
// 답이 일차식(정수 계수)이면 두 칸, 단항식이면 계수 한 칸으로 받고, 계수가 분수이면 고르기로 바꾸었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, box, frac, lines, numbers, table, tagged, N, M, C } = B.kit;
  const { LAB, MINUS, gcd, lcm, Q, qadd, qsub, qmul, qdiv, qneg, qcmp, isInt, fl, mag, tx, nb, tail, lastOf, tj, js, V, sup, ex, tag, proc, nz, pm, co, distinct, ansV, claimQ, asQ, lin, linAns } = B.kit.mid;
  const K = B.kit.m713;
  const { STD1, STD2, T, X, htmlX, sameX, xh, xe, xex, xv, xjs, xsame, xtagged, chips, withUnit, vj, magS, pn, ln, nl, kp, linOf, chain, lj, pickX, eqQ, monoAns, linQ, INK, EDGE, TINT, ITALIC, svgX, plainX, said, label, svg, shape, rectFig } = K;
  const UNIT = '7-1-3', CALC = '다음 식을 계산하시오.', PICK = '다음 식을 계산한 것은?';
  const X2 = V('x') + sup(2);

  // ── 식 글을 짓는 도구 ──
  // 곱셈·나눗셈 기호 옆에 적는 수: 음수는 괄호에 넣는다 — (-3), [2|5], (-[2|5])
  const sn = (k) => { const q = asQ(k); return q.p < 0 ? '(-' + magS(q) + ')' : magS(q); };
  // 곱셈·나눗셈 기호 옆에 적는 단항식: 음수이면 괄호에 넣는다 — (-8x)
  const sm = (c, v) => { const src = pn([[c, v]]); return src.startsWith('-') ? '(' + src + ')' : src; };
  // 풀이 글에 적는 수와 항(음수는 괄호에)
  const qs = (k) => { const q = asQ(k); return q.p < 0 ? '(' + tx(q) + ')' : tx(q); };
  const ts = (c, v) => { const src = pn([[c, v]]); return src.startsWith('-') ? '(' + xh(src) + ')' : xh(src); };
  // 분배법칙으로 푼 줄: K × ax + K × b
  const distTold = (k, a, b, v) => nb(`${qs(k)} × ${ts(a, v)} + ${qs(k)} × ${qs(b)}`);
  const signedJs = (k) => js(asQ(k));
  // 0이 아닌 정수 둘(일차식의 계수와 상수항)
  const coef = (d, lo, hi) => nz(d, lo, hi);
  // 크기가 서로 다른 0이 아닌 정수 둘(일차식의 계수와 상수항)
  const pair = (d, la, lb) => d.until(() => [nz(d, -la, la), nz(d, -lb, lb)], ([x, y]) => Math.abs(x) !== Math.abs(y));
  // 일차식 ax + b 를 고르는 보기로: 정답 [a, b] 와 틀린 [a, b] 들(유리수)
  const lnQ = (pair, v) => ln(pair[0], pair[1], v);

  // ── 그림 ──
  // 위 칸의 식이 바로 아래 두 칸의 식의 합인 그림(세 층). 칸에는 식 글·이름표(㉠)·빈칸('')을 적는다.
  function pyrFig(bottom, mid, top) {
    const W = 88, H = 30, isTag = (s) => /^[㉠-㉯]$/.test(s), told = (s) => (s === '' ? '빈칸' : isTag(s) ? s : plainX(X(s)));
    const cell = (x, y, s) => `<rect x="${x}" y="${y}" width="${W}" height="${H}" style="fill:#fff;stroke:${INK};stroke-width:1.2"/>` + (s === '' ? '' : `<text x="${x + W / 2}" y="${y + 20}" text-anchor="middle" style="font-size:13.5px;font-weight:600;fill:${isTag(s) ? EDGE : INK}">${isTag(s) ? s : svgX(X(s))}</text>`);
    return svg(3 * W + 6, 3 * H + 6, `칸을 세 층으로 쌓은 그림: 맨 아래 층은 왼쪽부터 ${bottom.map(told).join(', ')}, 가운데 층은 왼쪽부터 ${mid.map(told).join(', ')}, 맨 위 층은 ${told(top)}`,
      cell(3 + W, 3, top) + cell(3 + W / 2, 3 + H, mid[0]) + cell(3 + W * 1.5, 3 + H, mid[1]) + cell(3, 3 + 2 * H, bottom[0]) + cell(3 + W, 3 + 2 * H, bottom[1]) + cell(3 + 2 * W, 3 + 2 * H, bottom[2]));
  }
  // 큰 직사각형의 왼쪽 아래 모퉁이에서 작은 직사각형을 뺀 색칠한 부분. big·small: [가로 식 글, 세로 식 글], ratio: 작은 직사각형의 세로가 큰 직사각형의 세로의 몇 배인가(그림의 비율)
  function cornerFig(big, small, unit, ratio) {
    const x0 = 62, y0 = 26, w = 150, h = 96, sw = 82, sh = Math.round(h * Math.min(0.78, Math.max(0.3, ratio || 0.54)));
    return svg(292, 152, `큰 직사각형의 왼쪽 아래 모퉁이에서 작은 직사각형을 뺀 나머지를 색칠한 그림: 큰 직사각형은 가로 ${said(big[0], unit)}, 세로 ${said(big[1], unit)}이고, 작은 직사각형은 가로 ${said(small[0], unit)}, 세로 ${said(small[1], unit)}`,
      shape(`M${x0} ${y0}h${w}v${h}h${-(w - sw)}v${-sh}h${-sw}z`, TINT) + `<path d="M${x0} ${y0 + h - sh}v${sh}h${sw}" style="fill:none;stroke:${INK};stroke-width:1.1;stroke-dasharray:4 3"/>`
      + label(x0 + w / 2, y0 - 8, big[0], unit) + label(x0 + w + 7, y0 + h / 2 + 5, big[1], unit, 'start') + label(x0 + sw / 2, y0 + h + 17, small[0], unit) + label(x0 - 6, y0 + h - sh / 2 + 5, small[1], unit, 'end'));
  }
  // 직사각형 모양의 땅 둘레에 폭이 일정한 길이 있는 그림. inner: [가로 식 글, 세로 식 글], w: 길의 폭(수)
  function frameFig(inner, w, unit, what) {
    const x0 = 14, y0 = 12, W = 196, H = 124, t = 22;
    return svg(294, 150, `직사각형 모양의 ${what} 둘레에 폭이 ${w} ${unit}로 일정한 길을 만들고 길을 색칠한 그림: ${what}의 가로는 ${said(inner[0], unit)}, 세로는 ${said(inner[1], unit)}`,
      shape(`M${x0} ${y0}h${W}v${H}h${-W}z`, TINT) + shape(`M${x0 + t} ${y0 + t}h${W - 2 * t}v${H - 2 * t}h${-(W - 2 * t)}z`, '#fff')
      + `<text x="${x0 + W / 2}" y="${y0 + H / 2 - 4}" text-anchor="middle" style="font-size:13px;font-weight:600;fill:${INK}">${what}</text>` + label(x0 + W / 2, y0 + H - t - 7, inner[0], unit) + label(x0 + W - t - 6, y0 + H / 2 + 14, inner[1], unit, 'end')
      + `<path d="M${x0 + W - t} ${y0 + 30}h${t}" style="fill:none;stroke:${INK};stroke-width:1"/><path d="M${x0 + W - t} ${y0 + 26}v8M${x0 + W} ${y0 + 26}v8" style="fill:none;stroke:${INK};stroke-width:1"/>` + label(x0 + W + 7, y0 + 34, String(w), unit, 'start'));
  }

  // ── 다항식의 용어와 일차식 ──
  // 항 [계수, 문자 부분]의 차수
  const degOf = (v) => (v === '' ? 0 : v.split(/(?=[a-z])/).reduce((s, part) => s + (part.includes('^') ? Number(part.split('^')[1]) : 1), 0));
  const listed = (srcs) => srcs.map(xh).join(', ');

  B.addTypes(UNIT, 'terms', [
    T('terms-read', '다항식에서 계수·상수항·차수·항의 개수 읽기', '①45·47 심34', (d, n) => {
      // 차례마다 식이 다르다: 계수 1·−1이 낀 이차식, 문자가 둘인 일차식, 상수항이 없는 식.
      const ask = (src, rows, why) => M(`다항식 ${xh(src)}에 대하여 ㉠, ㉡, ㉢에 알맞은 수는?`, rows.map(([, v], i) => ({ label: LAB[i], answer: v, signed: true })), {
        figure: tagged(rows.map(([name]) => name)), explain: why, facts: { calc: rows.map(([, v], i) => [signedJs(v), i]), unseen: [0, 1, 2, 3], rule: 'terms-read-' + n }
      });
      if (n === 0) {
        const [a, b, c] = d.until(() => [nz(d, -5, 5), nz(d, -6, 6), nz(d, -9, 9)], (v) => (Math.abs(v[0]) === 1 || Math.abs(v[1]) === 1) && (v[1] < 0 || v[2] < 0)), src = pn([[a, 'x^2'], [b, 'x'], [c, '']]);
        return ask(src, [[`${X2}의 계수`, a], [`${V('x')}의 계수`, b], ['상수항', c]], `항은 ${listed([pn([[a, 'x^2']]), pn([[b, 'x']]), pn([[c, '']])])}이다. 계수와 상수항은 앞의 부호까지 포함하고, 계수 1은 생략되어 있다. ${X2}의 계수는 ${tx(Q(a))}, ${V('x')}의 계수는 ${tx(Q(b))}, 상수항은 ${tx(Q(c))}이다.`);
      }
      if (n === 1) {
        const [a, b, c] = d.until(() => [nz(d, -5, 5), nz(d, -6, 6), nz(d, -9, 9)], (v) => (Math.abs(v[0]) === 1 || Math.abs(v[1]) === 1) && v[1] < 0), src = pn([[a, 'x'], [b, 'y'], [c, '']]);
        return ask(src, [[`${V('x')}의 계수`, a], [`${V('y')}의 계수`, b], ['상수항', c]], `항은 ${listed([pn([[a, 'x']]), pn([[b, 'y']]), pn([[c, '']])])}이다. 계수와 상수항은 앞의 부호까지 포함하고, 계수 1은 생략되어 있다. ${V('x')}의 계수는 ${tx(Q(a))}, ${V('y')}의 계수는 ${tx(Q(b))}, 상수항은 ${tx(Q(c))}이다.`);
      }
      const cubic = d.bool(), terms = cubic ? [[pm(d), 'x^3'], [nz(d, -5, 5), 'x^2'], [pm(d) * d.int(1, 6), 'x']] : [[nz(d, -6, 6), 'x^2'], [-1, 'x']], src = pn(terms), deg = cubic ? 3 : 2;
      return ask(src, [['항의 개수', terms.length], ['다항식의 차수', deg], ['상수항', 0]], `항은 ${listed(terms.map((t) => pn([t])))}의 ${terms.length}개이다. 차수가 가장 큰 항의 차수가 ${deg}이므로 다항식의 차수는 ${deg}이다. 수만으로 이루어진 항이 없으므로 상수항은 0이다.`);
    }, { count: 3 }),
    T('terms-coef-frac', '분수 꼴로 적힌 항의 계수', '①45', (d) => {
      const k = d.int(2, 9), p = co(d, k, 2, 9), c = d.int(1, 9), form = d.int(0, 2);
      const src = [`[x|${k}]-y+${c}`, `${p}x^2-[x|${k}]`, `[${p}x|${k}]-${c}`][form], v = [Q(1, k), Q(-1, k), Q(p, k)][form], term = ['[x|' + k + ']', '-[x|' + k + ']', `[${p}x|${k}]`][form];
      return ansV(`다항식 ${xh(src)}에서 ${V('x')}의 계수는?`, v, 'frac', {
        explain: `${xh(term)} = ${xh(pn([[v, 'x']]))}이므로 ${V('x')}의 계수는 ${tx(v)}이다. 계수는 문자에 곱해진 수이다.`,
        facts: { value: js(v), unseen: [1] }
      });
    }),
    T('terms-list', '다항식의 항을 모두 찾기', '①45 심33', (d) => {
      // 틀린 보기: 항의 부호를 뗀 것, 상수항을 빠뜨린 것, 계수만 적은 것
      const [a, b, c] = d.until(() => [nz(d, -5, 5), nz(d, -6, 6), nz(d, -9, 9)], (v) => v[1] < 0 || v[2] < 0), two = d.bool();
      const terms = two ? [[a, 'x'], [b, 'y'], [c, '']] : [[a, 'x^2'], [b, 'x'], [c, '']], src = pn(terms);
      const right = terms.map((t) => pn([t])), noSign = terms.map(([k, v]) => pn([[Math.abs(k), v]])), noConst = right.slice(0, 2), coefs = terms.map(([k]) => pn([[k, '']]));
      const rows = d.shuffle([right, noSign, noConst, coefs]);
      return C(`다항식 ${xh(src)}의 항을 모두 나타낸 것은?`, rows.map(listed), rows.indexOf(right), {
        explain: `다항식 ${xh(src)}의 항은 ${listed(right)}이다. 항은 앞의 부호까지 포함하고, 수만으로 이루어진 상수항도 항이다.`,
        facts: { truth: rows.map((r) => r.join() === right.join()), want: true }
      });
    }),
    T('terms-table', '표에서 상수항과 계수 찾기', '①46', (d) => {
      const p = d.int(2, 6), c = d.int(1, 9), q = d.int(2, 9), s = pm(d), r = d.int(2, 5), e = d.int(1, 9);
      const P1 = ln(p, -c), P2 = pn([[q, 'x']]), P3 = pn([[s, 'x'], [r, 'y'], [-e, '']]);
      return M('다음 표의 ㉠, ㉡, ㉢에 알맞은 수는?', [-c, 0, s].map((v, i) => ({ label: LAB[i], answer: v, signed: true })), {
        figure: table(['다항식', '상수항', `${V('x')}의 계수`], [[xh(P1), box(LAB[0]), String(p)], [xh(P2), box(LAB[1]), String(q)], [xh(P3), tx(Q(-e)), box(LAB[2])]]),
        explain: `${xh(P1)}의 상수항은 ${tx(Q(-c))}이다. ${xh(P2)}에는 수만으로 이루어진 항이 없으므로 상수항은 0이다. ${xh(P3)}에서 ${xh(pn([[s, 'x']]))} = ${qs(s)} × ${V('x')}이므로 ${V('x')}의 계수는 ${tx(Q(s))}이다.`,
        facts: { calc: [[signedJs(-c), 0], ['0', 1], [signedJs(s), 2]], unseen: [0, 1] }
      });
    }),
    T('terms-claims', '한 다항식에 대한 설명의 옳고 그름', '①48 심33', (d, n) => {
      if (n === 0) {
        // 이차식: 옳지 않은 설명 하나(부호를 뗀 계수, 부호를 뗀 항, 항의 개수와 헷갈린 차수, 단항식)
        const a = nz(d, -5, 5), b = -d.int(1, 6), c = nz(d, -9, 9), src = pn([[a, 'x^2'], [b, 'x'], [c, '']]), ts3 = [pn([[a, 'x^2']]), pn([[b, 'x']]), pn([[c, '']])];
        const yes = ['항은 모두 3개이다.', '다항식의 차수는 2이다.', `${X2}의 계수는 ${tx(Q(a))}이다.`, `${V('x')}의 계수는 ${tx(Q(b))}이다.`, `상수항은 ${tx(Q(c))}이다.`];
        const no = [
          [`${V('x')}의 계수는 ${-b}이다.`, `${V('x')}의 계수는 부호까지 포함하여 ${tx(Q(b))}이다.`, yes[3]],
          [`항은 ${listed([pn([[Math.abs(a), 'x^2']]), pn([[-b, 'x']]), pn([[Math.abs(c), '']])])}이다.`, `항은 부호까지 포함하여 ${listed(ts3)}이다.`],
          ['다항식의 차수는 3이다.', `차수가 가장 큰 항 ${xh(ts3[0])}의 차수가 2이므로 다항식의 차수는 2이다. 항의 개수와 차수는 다르다.`, yes[1]],
          ['단항식이다.', '항이 3개이므로 단항식이 아니다.', yes[0]]
        ];
        return claimQ(d, `다항식 ${xh(src)}에 대한 설명으로 옳지 않은 것은?`, yes, no, false);
      }
      // 문자가 둘인 일차식: 옳은 설명 하나
      const a = nz(d, -5, 5), b = -d.int(2, 7), c = nz(d, -9, 9), src = pn([[a, 'x'], [b, 'y'], [c, '']]), ts3 = [pn([[a, 'x']]), pn([[b, 'y']]), pn([[c, '']])];
      const yes = [`${V('y')}의 계수는 ${tx(Q(b))}이다.`, `상수항은 ${tx(Q(c))}이다.`, '항은 모두 3개이다.', `${V('x')}의 계수는 ${tx(Q(a))}이다.`, '다항식의 차수는 1이다.'];
      const no = [
        [`${V('y')}의 계수는 ${-b}이다.`, `${V('y')}의 계수는 부호까지 포함하여 ${tx(Q(b))}이다.`, yes[0]],
        [`항은 ${listed([pn([[Math.abs(a), 'x']]), pn([[-b, 'y']]), pn([[Math.abs(c), '']])])}이다.`, `항은 부호까지 포함하여 ${listed(ts3)}이다.`],
        ['다항식의 차수는 2이다.', '문자가 2개이어도 차수가 가장 큰 항의 차수가 1이므로 다항식의 차수는 1이다.', yes[4]],
        ['단항식이다.', '항이 3개이므로 단항식이 아니다.', yes[2]]
      ];
      return claimQ(d, `다항식 ${xh(src)}에 대한 설명으로 옳은 것은?`, yes, no, true);
    }, { count: 2 }),
    T('terms-word-claims', '다항식·단항식·차수·계수의 뜻에 대한 설명의 옳고 그름', '①49', (d) => {
      const k = d.int(4, 9), m = d.int(2, 6), p = d.int(2, 5), wantTrue = d.bool();
      const yes = [`${xh(`${p}x-y`)}는 다항식이다.`, `${xh(`-${k}x`)}는 단항식이다.`, `${xh(`-${k}x`)}의 차수는 1이다.`, `${xh(`[a|${m}]`)}의 계수는 ${frac(1, m)}이다.`, '단항식은 모두 다항식이다.', `${k}${tail(k, '과/와')} 같이 수만으로 이루어진 식도 단항식이다.`, `${xh(`x^2-${p}x+1`)}의 차수는 2이다.`];
      const no = [
        [`${xh(`${p}x^2-${p}x+1`)}의 차수는 3이다.`, `차수가 가장 큰 항 ${xh(`${p}x^2`)}의 차수가 2이므로 다항식의 차수는 2이다.`, yes[6]],
        [`${xh(`${p}x-${m}y`)}는 단항식이다.`, `${xh(`${p}x-${m}y`)}는 항이 2개이므로 단항식이 아니다.`],
        [`${xh(`-${k}x`)}의 차수는 ${tx(Q(-k))}이다.`, `${xh(`-${k}x`)}에서 ${tx(Q(-k))}${tail(k, '은/는')} 계수이고, 문자 ${V('x')}가 한 번 곱해져 있으므로 차수는 1이다.`, yes[2]],
        [`${xh(`[a|${m}]`)}의 계수는 ${m}이다.`, `${xh(`[a|${m}]`)} = ${xh(`[1|${m}]a`)}이므로 계수는 ${frac(1, m)}이다.`, yes[3]],
        ['단항식은 다항식이 아니다.', '항이 하나뿐인 다항식을 단항식이라고 한다.', yes[4]],
        [`${xh(`${p}x`)}의 상수항은 ${p}이다.`, `${xh(`${p}x`)}에서 ${p}${tail(p, '은/는')} ${V('x')}의 계수이고, 상수항은 0이다.`]
      ];
      return claimQ(d, `다음 설명 중 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, yes, no, wantTrue);
    }),
    T('terms-monomial-count', '단항식의 개수 세기', '①50', (d) => {
      const k = d.int(2, 9), p = d.int(2, 5), q = d.int(2, 7);
      const MONO = [`-${p}x^2`, `-[${co(d, 5, 1, 4)}|5]x`, String(k), `${p}x^2y`, `[a|${q}]`, '-y'], POLY = ['a-b', `[2|3]-x`, `${p}a+${k}`, 'x^2+1', `[x+1|${q}]`];
      const many = d.int(2, 3), rows = d.shuffle(d.shuffle(MONO).slice(0, many).concat(d.shuffle(POLY).slice(0, 5 - many))), flags = rows.map((r) => MONO.includes(r));
      return N('다음 중 단항식은 모두 몇 개인가?', many, {
        unit: '개', figure: chips(rows),
        explain: `단항식은 항이 하나뿐인 다항식이다. 수만으로 이루어진 식도 단항식이고, ${xh('[x+1|2]')}처럼 분자에 항이 2개 있으면 단항식이 아니다. 단항식은 ${listed(rows.filter((r, i) => flags[i]))}의 ${many}개이다.`,
        facts: { count: flags }
      });
    }),
    T('terms-linear-pick', '일차식인 것과 일차식이 아닌 것 가리기', '①51', (d) => {
      const k = d.int(2, 9), p = d.int(2, 5), wantLinear = d.bool();
      const LIN = [`[1|2]x-[1|${p + 1}]`, '0.7x', `-[2|3]x+[1|5]`, `x+${k}`, '-x', `${k}-${p}y`, `[a|${p}]+1`], NOT = [[`x^2-x+${k}`, '차수 2'], [String(k), '상수항뿐이므로 차수 0'], [`-${p}y^2+y`, '차수 2'], ['x^3', '차수 3'], [`${p}x^2`, '차수 2']];
      const rows = d.shuffle(wantLinear ? d.shuffle(LIN).slice(0, 1).concat(d.shuffle(NOT).slice(0, 3).map((r) => r[0])) : d.shuffle(LIN).slice(0, 3).concat([d.pick(NOT)[0]])), truth = rows.map((r) => LIN.includes(r));
      const why = rows.filter((r) => !LIN.includes(r)).map((r) => `${xh(r)}(${NOT.find((x) => x[0] === r)[1]})`).join(', ');
      return C(`다음 중 일차식${wantLinear ? '인' : '이 아닌'} 것은?`, rows.map(xh), truth.indexOf(wantLinear), {
        explain: `일차식은 차수가 1인 다항식이다. 일차식이 아닌 것은 ${why}이다.`,
        facts: { truth, want: wantLinear }
      });
    }),
    T('terms-degree', '다항식의 차수 구하기', '①53', (d) => {
      const p = d.int(2, 6), k = d.int(1, 9);
      const POOL = [[`[5|2]x`, 1], [`${k}-[1|6]y^2`, 2], [`0.4a+${k}`, 1], [`${p}b^2-b+${k}`, 2], [`x^3-${p}x`, 3], [`-y^3+y^2-${k}`, 3], [`${k}-x`, 1], [`-${p}a^2`, 2]];
      const rows = d.until(() => d.shuffle(POOL).slice(0, 3), (list) => new Set(list.map((r) => r[1])).size >= 2);
      return M('다항식 ㉠, ㉡, ㉢의 차수를 차례대로 구하시오.', rows.map(([, deg], i) => ({ label: LAB[i], answer: deg, signed: true })), {
        figure: xtagged(rows.map((r) => r[0])),
        explain: `다항식의 차수는 차수가 가장 큰 항의 차수이다. 문자가 한 번 곱해진 항의 차수는 1이다. 차수는 차례로 ${rows.map((r) => r[1]).join(', ')}이다.`,
        facts: { calc: rows.map(([, deg], i) => [String(deg), i]), unseen: [1, 2, 3] }
      });
    }),
    T('terms-pick-cond', '조건에 맞는 다항식 고르기', '①54', (d, n) => {
      if (n === 0) {
        // x의 계수가 가장 큰(작은) 것: 절댓값이 큰 음수, 생략된 계수 1, 분수 계수, x²의 계수와 헷갈리는 식이 섞인다.
        const big = d.bool(), k = d.int(1, 9), p = d.int(2, 6), q = d.int(3, 9);
        const rows = d.until(() => d.shuffle([[ln(-q, k), Q(-q)], [ln(1, -k), Q(1)], [`[1|2]x+${k}`, Q(1, 2)], [nl(k, -p), Q(-p)], [`${q}x^2+${p}x`, Q(p)], [`-x+${k}`, Q(-1)], [`${p + 1}x-${k}`, Q(p + 1)]]).slice(0, 4), (list) => distinct(list.map((r) => r[1])));
        const values = rows.map((r) => fl(r[1])), at = values.indexOf(big ? Math.max(...values) : Math.min(...values));
        return C(`다음 중 ${V('x')}의 계수가 가장 ${big ? '큰' : '작은'} 것은?`, rows.map((r) => xh(r[0])), at, {
          explain: `${V('x')}의 계수는 차례로 ${rows.map((r) => tx(r[1])).join(', ')}이다. 계수는 부호까지 포함하므로 가장 ${big ? '큰' : '작은'} 것은 ${xh(rows[at][0])}이다.`,
          facts: { rank: { values, nth: big ? 1 : 4 } }
        });
      }
      // 일차식이고 상수항이 음수인 것: 조건 하나씩만 맞는 식이 섞인다.
      const p = d.int(2, 6), k = d.int(1, 9), e = d.int(1, 9);
      const right = d.pick([ln(p, -k), ln(-1, -k), `-${k}+${p}x`]), rows = d.shuffle([right, `x^2-${k}`, ln(-p, e), pn([[-(p + 1), 'x']])]);
      return C('다음 중 일차식이고 상수항이 음수인 것은?', rows.map(xh), rows.indexOf(right), {
        explain: `${xh(`x^2-${k}`)}${tail(k, '은/는')} 차수가 2이므로 일차식이 아니다. ${xh(ln(-p, e))}의 상수항은 ${e}, ${xh(pn([[-(p + 1), 'x']]))}의 상수항은 0이다. 일차식이고 상수항이 음수인 것은 ${xh(right)}이다.`,
        facts: { truth: rows.map((r) => r === right), want: true }
      });
    }, { count: 2 }),
    T('terms-make-linear', '일차식이 되게 하는 수', '①55 심36', (d, n) => {
      const p = d.int(2, 7), q = d.int(2, 9), c = d.int(1, 9);
      if (n === 0) {
        const src = `${p}x^2-${q}x+ax^2+${c}`;
        return ansV(`다항식 ${xh(src)}${tail(c, '이/가')} ${V('x')}에 대한 일차식일 때, 수 ${V('a')}의 값은?`, Q(-p), 'int', {
          explain: `${X2}의 항 ${xh(`${p}x^2`)}과 ${xh('ax^2')}을 모으면 ${xh(`(${p}+a)x^2`)}이다. 일차식이 되려면 ${X2}의 계수가 0이어야 하므로 ${nb(`${p} + ${V('a')} = 0`)}이고 ${nb(`${V('a')} = ${tx(Q(-p))}`)}이다.`,
          facts: { value: `(-${p})` }
        });
      }
      const r = nz(d, -6, 6), src = `(a-${p})x^2+${q}x+b-${c}`;
      return M(`다항식 ${xh(src)}${tail(c, '이/가')} ${V('x')}에 대한 일차식이고 상수항이 ${tx(Q(r))}일 때, 수 ${V('a')}, ${V('b')}의 값은?`, [{ label: 'a', answer: p, signed: true }, { label: 'b', answer: r + c, signed: true }], {
        explain: `일차식이 되려면 ${X2}의 계수가 0이어야 하므로 ${nb(`${V('a')} − ${p} = 0`)}에서 ${nb(`${V('a')} = ${p}`)}이다. 상수항은 ${xh(`b-${c}`)}이므로 ${nb(`${V('b')} − ${c} = ${tx(Q(r))}`)}에서 ${nb(`${V('b')} = ${tx(Q(r + c))}`)}이다.`,
        facts: { calc: [[String(p), 0], [`${signedJs(r)}+${c}`, 1]] }
      });
    }, { count: 2 }),
    T('terms-linear-situ', '상황을 나타낸 식이 일차식인지 가리기', '①56', (d) => {
      const k = d.int(3, 9), wantLinear = d.bool(), x = V('x');
      const LIN = [[`한 변의 길이가 ${x} cm인 정사각형의 둘레의 길이`, '4x'], [`한 개에 ${x}원인 사과 ${k}개의 값`, `${k}x`], [`가로의 길이가 ${x} cm, 세로의 길이가 ${k} cm인 직사각형의 넓이`, `${k}x`], [`시속 ${x} km로 ${k}시간 동안 간 거리`, `${k}x`], [`한 모서리의 길이가 ${x} cm인 정육면체의 모든 모서리의 길이의 합`, '12x'], [`${x}살인 형보다 ${k}살 어린 동생의 나이`, `x-${k}`]];
      const NOT = [[`한 변의 길이가 ${x} cm인 정사각형의 넓이`, 'x^2'], [`한 모서리의 길이가 ${x} cm인 정육면체의 부피`, 'x^3'], [`한 모서리의 길이가 ${x} cm인 정육면체의 겉넓이`, '6x^2'], [`밑변의 길이와 높이가 모두 ${x} cm인 삼각형의 넓이`, '[x^2|2]']];
      const rows = d.shuffle(wantLinear ? d.shuffle(LIN).slice(0, 1).concat(d.shuffle(NOT).slice(0, 3)) : d.shuffle(LIN).slice(0, 3).concat([d.pick(NOT)])), truth = rows.map((r) => LIN.includes(r));
      return C(`다음을 ${x}를 사용한 식으로 나타낼 때, 일차식${wantLinear ? '인' : '이 아닌'} 것은?`, rows.map((r) => r[0]), truth.indexOf(wantLinear), {
        explain: `식으로 나타내면 차례로 ${listed(rows.map((r) => r[1]))}이다. 일차식은 차수가 1인 다항식이다.`,
        facts: { truth, want: wantLinear }
      });
    })
  ]);

  // ── 일차식과 수의 곱셈·나눗셈 ──
  const DIST = '분배법칙을 이용하여 괄호 안의 모든 항에 곱한다. ', RECIP = '나눗셈은 나누는 수의 역수를 곱하는 곱셈으로 고친다. ';
  B.addTypes(UNIT, 'scale', [
    T('scale-mono-mul', '단항식과 수의 곱셈', '①57·58', (d, n) => {
      const v = d.pick(['x', 'a', 'y']);
      if (n === 0) {
        const [p, k] = d.until(() => [nz(d, -9, 9), nz(d, -9, 9)], ([x, y]) => (x < 0 || y < 0) && Math.abs(y) > 1), src = d.bool() ? `${sm(p, v)}*${sn(k)}` : `${sn(k)}*${sm(p, v)}`;
        return monoAns(CALC, p * k, v, { figure: xex(src), explain: `수끼리 곱하여 문자 앞에 쓴다. ${xh(src)} = ${nb(`{${qs(p)} × ${qs(k)}} × ${V(v)}`)} = ${xh(pn([[p * k, v]]))}이다.`, facts: { calc: [[`${signedJs(p)}*${signedJs(k)}`, 0]], unseen: [1], rule: 'mono-mul-int' } });
      }
      if (n === 1) {
        const q = d.pick([2, 3, 4, 5]), m = co(d, q, 1, q + 2), f = Q(pm(d) * m, q), p = pm(d) * q * d.int(1, 5), src = `${sm(p, v)}*${sn(f)}`, r = qmul(Q(p), f);
        return monoAns(CALC, r.p, v, { figure: xex(src), explain: `수끼리 곱하여 문자 앞에 쓴다. ${xh(src)} = ${nb(`{${qs(p)} × ${qs(f)}} × ${V(v)}`)} = ${xh(pn([[r.p, v]]))}이다.`, facts: { calc: [[`${signedJs(p)}*${signedJs(f.p)}/${q}`, 0]], unseen: [1], rule: 'mono-mul-frac' } });
      }
      const [f, g] = d.until(() => [Q(d.int(1, 9), d.int(2, 6)), Q(-d.int(1, 9), d.int(2, 6))], ([x, y]) => x.q > 1 && y.q > 1 && qmul(x, y).q > 1 && gcd(x.p, y.q) + gcd(y.p, x.q) > 2), src = `${sn(f)}*${sm(g, v)}`, r = qmul(f, g);
      return ansV(CALC, r, 'frac', { figure: xex(src), unit: V(v), explain: `수끼리 곱하여 문자 앞에 쓴다. ${xh(src)} = ${nb(`{${qs(f)} × ${qs(g)}} × ${V(v)}`)} = ${xh(pn([[r, v]]))}이다.`, facts: { value: `${js(f)}*${js(g)}`, rule: 'mono-mul-fracs' } });
    }, { count: 3 }),
    T('scale-mono-div', '단항식과 수의 나눗셈', '①59·60', (d, n) => {
      const v = d.pick(['x', 'a', 'y']);
      if (n === 0) {
        const [k, r] = d.until(() => [nz(d, -9, 9), nz(d, -9, 9)], ([x, y]) => Math.abs(x) > 1 && (x < 0 || y < 0)), p = k * r, src = `${sm(p, v)}:${sn(k)}`;
        return monoAns(CALC, r, v, { figure: xex(src), explain: `${RECIP}${xh(src)} = ${nb(`${ts(p, v)} × ${qs(Q(1, k))}`)} = ${xh(pn([[r, v]]))}이다.`, facts: { calc: [[`${signedJs(p)}/${signedJs(k)}`, 0]], unseen: [1], rule: 'mono-div-int' } });
      }
      if (n === 1) {
        const q = d.int(2, 6), m = co(d, q, 1, 5), f = Q(pm(d) * m, q), p = pm(d) * m * d.int(1, 6), src = `${sm(p, v)}:${sn(f)}`, r = qdiv(Q(p), f);
        return monoAns(CALC, r.p, v, { figure: xex(src), explain: `${RECIP}${xh(src)} = ${nb(`${ts(p, v)} × ${qs(qdiv(Q(1), f))}`)} = ${xh(pn([[r.p, v]]))}이다.`, facts: { calc: [[`${signedJs(p)}*${q}/${signedJs(f.p)}`, 0]], unseen: [1], rule: 'mono-div-frac' } });
      }
      const [p, k] = d.until(() => [nz(d, -9, 9), d.int(2, 9)], ([x, y]) => gcd(x, y) === 1 && Math.abs(x) > 1), s = pm(d), src = `${sm(p, v)}:${sn(s * k)}`, r = Q(p, s * k);
      return ansV(CALC, r, 'frac', { figure: xex(src), unit: V(v), explain: `${RECIP}${xh(src)} = ${nb(`${ts(p, v)} × ${qs(Q(1, s * k))}`)} = ${xh(pn([[r, v]]))}이다.`, facts: { value: `${signedJs(p)}/${signedJs(s * k)}`, rule: 'mono-div-rest' } });
    }, { count: 3 }),
    T('scale-lin-mul', '일차식과 정수의 곱셈', '①61', (d, n) => {
      const v = d.pick(['x', 'y', 'a']), [a, b] = pair(d, 6, 9), k = n === 2 ? -1 : -d.int(2, 7), src = [kp(k, ln(a, b, v)), `(${ln(a, b, v)})*${sn(k)}`, kp(-1, ln(a, b, v))][n];
      return linQ(CALC, src, v, {
        figure: xex(src), explain: `${n === 2 ? '괄호 앞의 −는 −1을 곱한 것이므로 괄호 안의 모든 항의 부호가 바뀐다. ' : DIST}${xh(src)} = ${distTold(k, a, b, v)} = ${xh(ln(k * a, k * b, v))}이다.`,
        facts: { calc: [[n === 2 ? `-${signedJs(a)}` : `${signedJs(k)}*${signedJs(a)}`, 0], [n === 2 ? `-${signedJs(b)}` : `${signedJs(k)}*${signedJs(b)}`, 1]], unseen: [1], rule: 'lin-mul-' + n }
      });
    }, { count: 3 }),
    T('scale-lin-frac', '일차식과 분수의 곱셈', '①62·63', (d, n) => {
      const v = d.pick(['x', 'y']);
      if (n === 0) {
        // 약분되어 계수와 상수항이 정수가 된다.
        const q = d.pick([2, 3, 4, 5]), m = co(d, q, 1, q + 2), f = Q(pm(d) * m, q), [a, b] = pair(d, 4, 5).map((x) => q * x), src = d.bool() ? kp(f, ln(a, b, v)) : `(${ln(a, b, v)})*${sn(f)}`;
        return linQ(CALC, src, v, {
          figure: xex(src), explain: `${DIST}${xh(src)} = ${distTold(f, a, b, v)} = ${xh(ln(qmul(f, Q(a)), qmul(f, Q(b)), v))}이다.`,
          facts: { calc: [[`${signedJs(a)}*${signedJs(f.p)}/${q}`, 0], [`${signedJs(b)}*${signedJs(f.p)}/${q}`, 1]], unseen: [1], rule: 'lin-frac-int' }
        });
      }
      // 답의 계수가 분수: 고르기. 틀린 보기는 한 항에만 곱한 것, 역수를 곱한 것, 분모에 곱한 것
      if (d.bool()) {
        const q = d.pick([3, 4, 5, 7]), m = co(d, q, 2, q - 1), f = Q(m, q), a = pm(d), b = d.until(() => nz(d, -9, 9), (x) => x % q !== 0), src = `(${ln(a, b, v)})*${sn(f)}`, right = [qmul(f, Q(a)), qmul(f, Q(b))];
        return pickX(d, PICK, lnQ(right, v), [lnQ([right[0], Q(b)], v), lnQ([Q(a), right[1]], v), lnQ([qdiv(Q(a), f), qdiv(Q(b), f)], v), lnQ([qneg(right[0]), right[1]], v)], {
          target: src, figure: xex(src), rule: 'lin-frac-out', explain: `${DIST}${xh(src)} = ${distTold(f, a, b, v)} = ${xh(lnQ(right, v))}이다.`
        });
      }
      const k = d.int(2, 5), q = d.until(() => d.int(2, 9), (x) => gcd(x, k) < x), src = kp(k, `${v}+[1|${q}]`), right = [Q(k), Q(k, q)];
      return pickX(d, PICK, lnQ(right, v), [lnQ([Q(k), Q(1, q)], v), lnQ([Q(1), Q(k, q)], v), lnQ([Q(k), Q(1, k * q)], v)], {
        target: src, figure: xex(src), rule: 'lin-frac-out', explain: `${DIST}${xh(src)} = ${distTold(k, 1, Q(1, q), v)} = ${xh(lnQ(right, v))}이다.`
      });
    }, { count: 2 }),
    T('scale-fracform-mul', '분수 꼴 일차식과 수의 곱셈', '①64', (d) => {
      const v = d.pick(['x', 'a']), q = d.int(2, 6), r = d.until(() => nz(d, -4, 4), (x) => x !== 1), k = q * r, [a, b] = d.until(() => [d.int(1, 5), nz(d, -7, 7)], ([x, y]) => x !== Math.abs(y)), src = `[${ln(a, b, v)}|${q}]*${sn(k)}`;
      return linQ(CALC, src, v, {
        figure: xex(src), explain: `분모 ${q}${tail(q, '과/와')} 곱하는 수 ${tx(Q(k))}${tail(Math.abs(k), '을/를')} 먼저 약분한다. ${xh(src)} = ${xh(`(${ln(a, b, v)})*${sn(r)}`)} = ${xh(ln(a * r, b * r, v))}이다. 분자의 모든 항에 곱한다.`,
        facts: { calc: [[`${signedJs(a)}*${signedJs(k)}/${q}`, 0], [`${signedJs(b)}*${signedJs(k)}/${q}`, 1]], unseen: [1], rule: 'fracform-mul' }
      });
    }),
    T('scale-lin-div', '일차식과 수의 나눗셈', '①65·66', (d, n) => {
      const v = d.pick(['x', 'a', 'y']);
      if (n === 0) {
        const k = d.until(() => nz(d, -7, 7), (x) => Math.abs(x) > 1), [a, b] = pair(d, 5, 6).map((x) => k * x), src = `(${ln(a, b, v)}):${sn(k)}`;
        return linQ(CALC, src, v, {
          figure: xex(src), explain: `${RECIP}${xh(src)} = ${xh(`(${ln(a, b, v)})*${sn(Q(1, k))}`)} = ${xh(ln(a / k, b / k, v))}이다. 괄호 안의 모든 항을 나눈다.`,
          facts: { calc: [[`${signedJs(a)}/${signedJs(k)}`, 0], [`${signedJs(b)}/${signedJs(k)}`, 1]], unseen: [1], rule: 'lin-div-int' }
        });
      }
      const q = d.int(2, 5), m = co(d, q, 1, 5), f = Q(pm(d) * m, q), [a, b] = pair(d, 4, 5).map((x) => m * x), src = `(${ln(a, b, v)}):${sn(f)}`, inv = qdiv(Q(1), f);
      return linQ(CALC, src, v, {
        figure: xex(src), explain: `${RECIP}${xh(src)} = ${xh(`(${ln(a, b, v)})*${sn(inv)}`)} = ${distTold(inv, a, b, v)} = ${xh(ln(qmul(inv, Q(a)), qmul(inv, Q(b)), v))}이다.`,
        facts: { calc: [[`${signedJs(a)}*${q}/${signedJs(f.p)}`, 0], [`${signedJs(b)}*${q}/${signedJs(f.p)}`, 1]], unseen: [1], rule: 'lin-div-frac' }
      });
    }, { count: 2 }),
    T('scale-fraclin-div', '분수가 있는 일차식과 분수의 나눗셈', '①67', (d) => {
      const v = d.pick(['x', 'b']), q1 = d.pick([1, 2, 3]), q2 = d.pick([2, 3, 4]), m1 = co(d, q1, 1, 3), m2 = co(d, q2, 1, 3), s2 = pm(d), L = lcm(q1, q2) * d.int(1, 2), s = pm(d);
      const a = Q(m1, q1), b = Q(s2 * m2, q2), f = Q(s, L), src = `(${ln(a, b, v)}):${sn(f)}`, inv = Q(s * L);
      return linQ(CALC, src, v, {
        figure: xex(src), explain: `${RECIP}${xh(src)} = ${xh(`(${ln(a, b, v)})*${sn(inv)}`)} = ${distTold(inv, a, b, v)} = ${xh(ln(qmul(inv, a), qmul(inv, b), v))}이다.`,
        facts: { calc: [[`${s < 0 ? '-' : ''}${m1}*${L}/${q1}`, 0], [`${s * s2 < 0 ? '-' : ''}${m2}*${L}/${q2}`, 1]], unseen: [1], rule: 'fraclin-div' }
      });
    }),
    T('scale-dist-blanks', '분배법칙으로 계산하는 과정의 빈칸', '①68', (d) => {
      const v = d.pick(['a', 'x']), k = d.until(() => nz(d, -6, 6), (x) => Math.abs(x) > 1), a = d.int(2, 5), b = d.int(1, 9), src = kp(k, ln(a, -b, v));
      const row2 = `${box(LAB[0])} <i>×</i> ${xe(pn([[a, v]]))} <i>+</i> ${box(LAB[0])} <i>×</i> (${MINUS}${b})`, row3 = `${box(LAB[1])}${V(v)} <i>${-k * b < 0 ? MINUS : '+'}</i> ${Math.abs(k * b)}`;
      return M('다음은 분배법칙을 이용하여 계산하는 과정이다. ㉠, ㉡에 알맞은 수는?', [{ label: LAB[0], answer: k, signed: true }, { label: LAB[1], answer: k * a, signed: true }], {
        figure: proc([{ h: xe(src) }, { h: row2 }, { h: row3 }]),
        explain: `괄호 밖의 수 ${tx(Q(k))}${tail(Math.abs(k), '을/를')} 괄호 안의 모든 항에 곱하므로 ㉠은 ${tx(Q(k))}이다. ${qs(k)} × ${xh(pn([[a, v]]))} = ${xh(pn([[k * a, v]]))}이므로 ㉡은 ${tx(Q(k * a))}이다.`,
        facts: { calc: [[signedJs(k), 0], [`${signedJs(k)}*${a}`, 1]] }
      });
    }),
    T('scale-claims', '일차식과 수의 곱셈·나눗셈이 옳은 것과 옳지 않은 것', '①70', (d, n) => {
      const a = d.int(2, 5), b = d.int(1, 6), q = d.int(2, 5), k = d.int(2, 6), c = d.int(1, 7), p = 6 * d.int(1, 3);
      const pool = [
        [kp(Q(1, q), ln(q * a, -q * b)), ln(a, -b), ln(a, -q * b)],
        [`[${ln(k * a, k * b)}|${k}]`, ln(a, b), ln(k * a, b)],
        [kp(-k, ln(1, -c)), ln(-k, k * c), ln(-k, -k * c)],
        [`(${ln(a * k, -b * k)}):${sn(-k)}`, ln(-a, b), ln(-a, -b)],
        [`${p}x:${sn(Q(-2, 3))}`, pn([[-p * 3 / 2, 'x']]), pn([[-p * 2 / 3, 'x']])],
        [`(${ln(1, c)})*${k}`, ln(k, k * c), ln(k, c)],
        [kp(Q(2, 3), ln(3 * a, -3 * b)), ln(2 * a, -2 * b), ln(2 * a, -3 * b)],
        [`(${ln(q * a, q * b)}):${sn(Q(1, q))}`, ln(q * q * a, q * q * b), ln(a, b)]
      ];
      return eqQ(d, `다음 중 계산이 ${n === 0 ? '옳은' : '옳지 않은'} 것은?`, pool, n === 0, { lead: '수를 곱하거나 나눌 때는 괄호 안의 모든 항에 곱하거나 나누고, 분수로 나눌 때는 그 역수를 곱한다. ', rule: 'scale-claims-' + n });
    }, { count: 2 }),
    T('scale-coef-max', '계산한 식에서 문자의 계수가 가장 큰 것 고르기', '①71', (d) => {
      // 줄마다 [식 글, 식에 적힌 x의 계수의 크기]. 적힌 계수가 가장 큰 식이 답이 되지 않게 한다(계산해 보아야 알 수 있게).
      const big = d.bool();
      const rows = d.until(() => {
        const a = d.int(2, 5), b = d.int(1, 6), k = d.int(2, 5), q = d.pick([2, 3, 4]), c = d.int(2, 4);
        return d.shuffle([[kp(Q(1, q), ln(q * a, -q * b)), q * a], [`(${ln(c, -b)}):${sn(Q(1, q))}`, c], [kp(k, ln(-a, b)), a], [`(${ln(1, -b)})*${sn(-k)}`, 1], [`(${ln(3 * a, -3 * b)}):${sn(Q(-3, q))}`, 3 * a], [kp(Q(-1, 2), ln(-2 * (a + 1), 2 * b)), 2 * (a + 1)]]).slice(0, 4);
      }, (list) => { const cs = list.map((r) => fl(linOf(r[0]).a)), at = cs.indexOf(big ? Math.max(...cs) : Math.min(...cs)), seen = list.map((r) => r[1]); return distinct(list.map((r) => linOf(r[0]).a)) && seen[at] !== Math.max(...seen); });
      const coefs = rows.map((r) => linOf(r[0])), values = coefs.map((c0) => fl(c0.a)), at = values.indexOf(big ? Math.max(...values) : Math.min(...values));
      return C(`다음 식을 계산하였을 때, ${V('x')}의 계수가 가장 ${big ? '큰' : '작은'} 것은?`, rows.map((r) => xh(r[0])), at, {
        explain: `계산하면 차례로 ${rows.map((r, i) => xh(ln(coefs[i].a, coefs[i].b))).join(', ')}이다. ${V('x')}의 계수는 차례로 ${coefs.map((c0) => tx(c0.a)).join(', ')}이다.`,
        facts: { rank: { values, nth: big ? 1 : 4 } }
      });
    }),
    T('scale-same', '계산 결과가 같은 식 고르기', '①72 심38', (d) => {
      const q = d.pick([2, 3]), [k, a, b] = d.until(() => [d.int(2, 5), q * d.int(1, 3), q * d.int(1, 4)], (t) => new Set(t).size === 3), s = pm(d), inner = ln(a, s * b), src = kp(-k, inner), A = -k * a, Bc = -k * s * b;
      // 정답: 분수로 나누는 식. 틀린 보기: 부호만 다른 식, 괄호 안의 부호가 다른 식, −1로 나눈 식, 나눗셈으로 바꾼 식
      const right = d.bool() ? `(${ln(A * 3 / q, Bc * 3 / q)}):${sn(Q(3, q))}` : `(${inner}):${sn(Q(-1, k))}`;
      return pickX(d, `다음 중 ${xh(src)}${tail(b, '과/와')} 계산 결과가 같은 것은?`, right, [kp(k, inner), kp(-k, ln(a, -s * b)), `(${ln(A, Bc)}):(-1)`, `(${inner}):${sn(-k)}`, `(${ln(-a, -s * b)})*(-${k})`], {
        target: src, explain: `${xh(src)} = ${xh(ln(A, Bc))}이다. ${RECIP}${xh(right)} = ${xh(ln(A, Bc))}이다.`
      });
    }),
    T('scale-rect-side', '넓이와 가로의 길이로 세로의 길이 구하기', '①73', (d) => {
      const k = d.int(2, 6), [a, b] = d.until(() => [d.int(2, 6), d.int(1, 7)], ([x, y]) => x !== y), s = pm(d), area = ln(k * a, s * k * b), src = `(${area}):${k}`;
      return linQ(`그림과 같이 가로의 길이가 ${k} cm이고 넓이가 ${withUnit(area, `cm${sup(2)}`)}인 직사각형의 세로의 길이를 ${V('x')}를 사용한 식으로 나타내시오.`, src, 'x', {
        unit: 'cm', figure: rectFig([String(k), 'cm'], null, { inside: [`넓이 ${withUnit(area, `cm${sup(2)}`)}`, `넓이 ${said(area, 'cm²')}`] }),
        explain: `(세로의 길이) = (넓이) ÷ (가로의 길이)이므로 ${xh(src)} = ${xh(ln(a, s * b))}이다.`,
        facts: { calc: [[`${k * a}/${k}`, 0], [`${signedJs(s * k * b)}/${k}`, 1]] }
      });
    })
  ]);

  // ── 동류항과 일차식의 덧셈·뺄셈 ──
  const LIKE = '동류항끼리 모아서 계산한다. ';
  B.addTypes(UNIT, 'like', [
    T('like-pair', '동류항끼리 짝 지은 것 고르기', '①74 심40', (d) => {
      const p = d.int(2, 9), q = d.int(2, 9), wantLike = d.bool();
      const LIKES = [[`${p}a`, '-a'], ['-x', '[1|10]x'], [String(p), '-[3|2]'], [`${p}x^2`, `-${q}x^2`], ['[1|2]y', `${q}y`], ['ab', `-${p}ab`]];
      const NOT = [['a', 'a^2', '문자는 같지만 차수가 다르다'], ['x^2', 'y^2', '차수는 같지만 문자가 다르다'], [`${p}a`, `${p}b`, '계수는 같지만 문자가 다르다'], ['x^2y', 'xy^2', '문자마다의 차수가 다르다'], [`[${p}|x]`, `[x|${p}]`, `${xh(`[${p}|x]`)}${tail(p, '은/는')} 분모에 문자가 있어 다항식의 항이 아니다`], [`${p}x`, String(p), '문자가 있는 항과 상수항이다'], ['x^2', '2x', '문자는 같지만 차수가 다르다']];
      const rows = d.shuffle(wantLike ? d.shuffle(LIKES).slice(0, 1).concat(d.shuffle(NOT).slice(0, 3)) : d.shuffle(LIKES).slice(0, 3).concat([d.pick(NOT)])), truth = rows.map((r) => LIKES.includes(r));
      const odd = rows.filter((r) => !LIKES.includes(r));
      return C(`다음 중 동류항끼리 짝 지은 것${wantLike ? '은' : '이 아닌 것은'}?`, rows.map((r) => `${xh(r[0])}, ${xh(r[1])}`), truth.indexOf(wantLike), {
        explain: `동류항은 문자와 차수가 각각 같은 항이다. 상수항끼리도 동류항이다. ${odd.map((r) => `${xh(r[0])}, ${xh(r[1])}: ${r[2]}.`).join(' ')}`,
        facts: { truth, want: wantLike }
      });
    }),
    T('like-count', '어떤 항과 동류항인 것의 개수', '①75 심41', (d) => {
      const v = d.pick(['a', 'b', 'x']), w = v === 'a' ? 'b' : 'a', k = d.int(2, 9), p = d.int(2, 7);
      const YES = [v, `-[1|4]${v}`, `0.${p}${v}`, `-${p + 1}${v}`], NO = [`-${p}${w}`, String(k), `${v}^2`, `[${k}|${v}]`, `${k}${v}^2`, `${k}${[v, w].sort().join('')}`];
      const many = d.int(2, 3), rows = d.shuffle(d.shuffle(YES).slice(0, many).concat(d.shuffle(NO).slice(0, 6 - many))), flags = rows.map((r) => YES.includes(r));
      return N(`다음 중 ${xh(`${k}${v}`)}와 동류항인 것은 모두 몇 개인가?`, many, {
        unit: '개', figure: chips(rows),
        explain: `${xh(`${k}${v}`)}와 동류항인 것은 문자가 ${V(v)}이고 차수가 1인 항이다. 계수는 달라도 된다. 동류항은 ${listed(rows.filter((r, i) => flags[i]))}의 ${many}개이다.`,
        facts: { count: flags }
      });
    }),
    T('like-find', '다항식에서 동류항 찾기', '①76', (d) => {
      const [a, b, c, e, f] = d.until(() => [nz(d, -5, 5), nz(d, -9, 9), nz(d, -9, 9), nz(d, -9, 9), nz(d, -9, 9)], (v) => new Set(v.map(Math.abs)).size === 5), src = pn([[a, 'x^2'], [b, 'x'], [c, ''], [e, 'x'], [f, '']]);
      const term = pn([[b, 'x']]), right = pn([[e, 'x']]), rows = d.shuffle([right, pn([[a, 'x^2']]), pn([[c, '']]), pn([[f, '']])]);
      return C(`다항식 ${xh(src)}에서 ${xh(term)}와 동류항인 것은?`, rows.map(xh), rows.indexOf(right), {
        explain: `${xh(term)}는 문자가 ${V('x')}이고 차수가 1인 항이다. 문자와 차수가 같은 항은 ${xh(right)}이다. ${xh(pn([[a, 'x^2']]))}은 차수가 2이고, ${xh(pn([[c, '']]))}, ${xh(pn([[f, '']]))}${tail(Math.abs(f), '은/는')} 상수항이다.`,
        facts: { truth: rows.map((r) => r === right), want: true }
      });
    }),
    T('like-mono', '동류항만 있는 식의 계산', '①77', (d, n) => {
      const v = d.pick(['x', 'a', 'y']);
      if (n === 0) {
        const [p, q] = d.until(() => [nz(d, -9, 9), nz(d, -9, 9)], ([x, y]) => (x < 0 || y < 0) && x + y !== 0 && Math.abs(x) > 1 && Math.abs(y) > 1), src = pn([[p, v], [q, v]]);
        return monoAns(CALC, p + q, v, { figure: xex(src), explain: `동류항은 계수끼리 계산한 다음 문자를 곱한다. ${xh(src)} = ${nb(`(${tx(Q(p))} ${q < 0 ? MINUS : '+'} ${Math.abs(q)})${V(v)}`)} = ${xh(pn([[p + q, v]]))}이다.`, facts: { calc: [[`${signedJs(p)}+${signedJs(q)}`, 0]], rule: 'like-mono-two' } });
      }
      const [p, q, r] = d.until(() => [d.int(2, 9), -d.int(2, 9), pm(d)], (t) => t[0] + t[1] + t[2] !== 0), order = d.bool() ? [p, q, r] : [r, p, q], src = pn(order.map((k) => [k, v]));
      const sum = order.map((k, i) => (i === 0 ? tx(Q(k)) : (k < 0 ? ` ${MINUS} ` : ' + ') + Math.abs(k))).join('');
      return monoAns(CALC, p + q + r, v, { figure: xex(src), explain: `${xh(pn([[r, v]]))}의 계수는 ${tx(Q(r))}이다. 계수끼리 계산하면 ${nb(sum)} = ${tx(Q(p + q + r))}이므로 ${xh(src)} = ${xh(pn([[p + q + r, v]]))}이다.`, facts: { calc: [[`${p}+${signedJs(q)}+${signedJs(r)}`, 0]], unseen: [1], rule: 'like-mono-three' } });
    }, { count: 2 }),
    T('like-mixed', '일차항과 상수항이 섞인 식의 정리', '①78', (d) => {
      const v = d.pick(['x', 'a', 'y']), [p, c, q, e] = d.until(() => [nz(d, -9, 9), nz(d, -9, 9), nz(d, -9, 9), nz(d, -9, 9)], (t) => t[0] + t[2] !== 0 && t[1] + t[3] !== 0 && (t[2] < 0 || t[3] < 0) && Math.abs(t[0]) > 1 && Math.abs(t[2]) > 1);
      const src = d.bool() ? pn([[p, v], [c, ''], [q, v], [e, '']]) : pn([[c, ''], [p, v], [e, ''], [q, v]]);
      return linQ(CALC, src, v, {
        figure: xex(src), explain: `${LIKE}${xh(src)} = ${xh(pn([[p, v], [q, v], [c, ''], [e, '']]))} = ${xh(ln(p + q, c + e, v))}이다.`,
        facts: { calc: [[`${signedJs(p)}+${signedJs(q)}`, 0], [`${signedJs(c)}+${signedJs(e)}`, 1]], rule: 'like-mixed' }
      });
    }),
    T('like-mixed-frac', '계수나 상수항이 분수인 식의 정리', '①79', (d) => {
      const v = d.pick(['a', 'y', 'x']);
      const [p, c, q, e] = d.until(() => {
        if (d.bool()) return [Q(nz(d, -9, 9)), Q(nz(d, -9, 9)), Q(nz(d, -9, 9)), Q(pm(d) * d.pick([1, 3, 5, 7]), 2)];
        const m = d.pick([3, 4, 5]), n2 = d.pick([3, 5, 7]);
        return [Q(d.int(1, m - 1), m), Q(-d.int(1, n2 - 1), n2), Q(-d.int(1, m - 1), m), Q(-d.int(1, n2 - 1), n2)];
      }, (t) => qadd(t[0], t[2]).p !== 0 && qadd(t[1], t[3]).p !== 0 && (t[2].p < 0 || t[3].p < 0) && qcmp(t[0], t[2]) !== 0 && qcmp(t[1], t[3]) !== 0);
      const src = isInt(p) ? pn([[c, ''], [p, v], [e, ''], [q, v]]) : pn([[p, v], [c, ''], [q, v], [e, '']]), right = [qadd(p, q), qadd(c, e)];
      return pickX(d, PICK, lnQ(right, v), [lnQ([qsub(p, q), right[1]], v), lnQ([right[0], qsub(c, e)], v), lnQ([qsub(p, q), qsub(c, e)], v), lnQ([right[0], qneg(right[1])], v)], {
        target: src, figure: xex(src), explain: `${LIKE}${xh(src)} = ${xh(pn([[p, v], [q, v], [c, ''], [e, '']]))} = ${xh(lnQ(right, v))}이다.`
      });
    }),
    T('like-paren', '괄호가 있는 일차식의 덧셈과 뺄셈', '①80', (d, n) => {
      const v = d.pick(['x', 'y', 'a']), [a, b, c, e] = d.until(() => [coef(d, -7, 7), coef(d, -9, 9), coef(d, -7, 7), coef(d, -9, 9)], (t) => new Set(t.map(Math.abs)).size >= 3 && Math.abs(t[1]) !== Math.abs(t[3]) && (n === 0 ? t[0] + t[2] !== 0 && t[1] + t[3] !== 0 : t[0] - t[2] !== 0 && t[1] - t[3] !== 0 && t[3] < 0 === (t[1] > 0)));
      if (n === 0) {
        const src = `(${ln(a, b, v)})+(${ln(c, e, v)})`;
        return linQ(CALC, src, v, {
          figure: xex(src), explain: `괄호를 풀고 ${LIKE}${xh(src)} = ${xh(pn([[a, v], [b, ''], [c, v], [e, '']]))} = ${xh(ln(a + c, b + e, v))}이다.`,
          facts: { calc: [[`${signedJs(a)}+${signedJs(c)}`, 0], [`${signedJs(b)}+${signedJs(e)}`, 1]], unseen: [1], rule: 'like-paren-add' }
        });
      }
      const src = `(${ln(a, b, v)})-(${ln(c, e, v)})`;
      return linQ(CALC, src, v, {
        figure: xex(src), explain: `괄호 앞에 −가 있으면 괄호 안의 모든 항의 부호를 바꾸어 괄호를 푼다. ${xh(src)} = ${xh(pn([[a, v], [b, ''], [-c, v], [-e, '']]))} = ${xh(ln(a - c, b - e, v))}이다.`,
        facts: { calc: [[`${signedJs(a)}-${signedJs(c)}`, 0], [`${signedJs(b)}-${signedJs(e)}`, 1]], unseen: [1], rule: 'like-paren-sub' }
      });
    }, { count: 2 }),
    T('like-scaled', '수를 곱한 일차식의 덧셈과 뺄셈', '①81', (d, n) => {
      const v = d.pick(['x', 'a', 'b']);
      const [k1, a, b, k2, c, e] = d.until(() => {
        const t = [d.int(2, 5), coef(d, -5, 5), coef(d, -7, 7), d.int(2, 5), coef(d, -5, 5), coef(d, -7, 7)];
        if (n === 1 && d.bool()) t[0] = 1;                       // −(6a − 5) − 2(a − 4) 꼴: 앞 괄호에 −만 붙는다.
        if (n === 2) { t[3] = 1; t[5] = t[0] * t[2]; }           // 상수항이 없어지는 꼴: k(ax + b) − (cx + kb)
        return t;
      }, (t) => { const s = n === 0 ? 1 : -1, A = (n === 1 && t[0] === 1 ? -1 : t[0]) * t[1] + s * t[3] * t[4], Bc = (n === 1 && t[0] === 1 ? -1 : t[0]) * t[2] + s * t[3] * t[5]; return A !== 0 && (n === 2 ? Bc === 0 && Math.abs(t[5]) <= 12 : Bc !== 0) && t[1] !== t[4] && Math.abs(t[1]) !== Math.abs(t[2]); });
      const K1 = n === 1 && k1 === 1 ? -1 : k1, K2 = n === 0 ? k2 : -k2, src = `${kp(K1, ln(a, b, v))}${n === 0 ? '+' : '-'}${kp(k2, ln(c, e, v))}`, open = pn([[K1 * a, v], [K1 * b, ''], [K2 * c, v], [K2 * e, '']]);
      const told = `${n === 0 ? DIST : '분배법칙을 이용하여 괄호를 푼다. 괄호 앞에 −가 있으면 괄호 안의 모든 항의 부호가 바뀐다. '}${xh(src)} = ${xh(open)} = `;
      const calc = [[`${signedJs(K1)}*${signedJs(a)}+${signedJs(K2)}*${signedJs(c)}`, 0], [`${signedJs(K1)}*${signedJs(b)}+${signedJs(K2)}*${signedJs(e)}`, 1]];
      if (n === 2) return monoAns(CALC, K1 * a + K2 * c, v, { figure: xex(src), explain: `${told}${xh(pn([[K1 * a + K2 * c, v]]))}이다.`, facts: { calc: [calc[0]], unseen: [1], rule: 'like-scaled-mono' } });
      return linQ(CALC, src, v, { figure: xex(src), explain: `${told}${xh(ln(K1 * a + K2 * c, K1 * b + K2 * e, v))}이다.`, facts: { calc, unseen: [1], rule: 'like-scaled-' + n } });
    }, { count: 3 }),
    T('like-frac-scaled', '분수를 곱한 일차식의 덧셈과 뺄셈', '①82·83', (d, n) => {
      const v = 'x';
      if (n === 0) {
        // 약분되어 정수 계수가 된다.
        const [f, a, b, g, c, e, minus] = d.until(() => {
          const q1 = d.pick([2, 3, 4]), q2 = d.pick([2, 3, 5, 6]), m1 = co(d, q1, 1, q1 + 1), m2 = co(d, q2, 1, q2 + 1);
          const ab = pair(d, 4, 4), ce = pair(d, 3, 3);
          return [Q(m1, q1), q1 * ab[0], q1 * ab[1], Q(m2, q2), q2 * ce[0], q2 * ce[1], d.bool()];
        }, (t) => { const s = t[6] ? -1 : 1, A = qadd(qmul(t[0], Q(t[1])), qmul(Q(s), qmul(t[3], Q(t[4])))), Bc = qadd(qmul(t[0], Q(t[2])), qmul(Q(s), qmul(t[3], Q(t[5])))); return A.p !== 0 && Bc.p !== 0 && t[0].q !== t[3].q; });
        const s = minus ? -1 : 1, src = `${kp(f, ln(a, b, v))}${minus ? '-' : '+'}${kp(g, ln(c, e, v))}`, t1 = [qmul(f, Q(a)), qmul(f, Q(b))], t2 = [qmul(Q(s), qmul(g, Q(c))), qmul(Q(s), qmul(g, Q(e)))];
        return linQ(CALC, src, v, {
          figure: xex(src), explain: `${DIST}${xh(src)} = ${xh(pn([[t1[0], v], [t1[1], ''], [t2[0], v], [t2[1], '']]))} = ${xh(ln(qadd(t1[0], t2[0]), qadd(t1[1], t2[1]), v))}이다.`,
          facts: { calc: [[`${f.p}*${signedJs(a)}/${f.q}${minus ? '-' : '+'}${g.p}*${signedJs(c)}/${g.q}`, 0], [`${f.p}*${signedJs(b)}/${f.q}${minus ? '-' : '+'}${g.p}*${signedJs(e)}/${g.q}`, 1]], unseen: [1], rule: 'like-frac-scaled-int' }
        });
      }
      // 답의 상수항이 분수: 고르기. 틀린 보기는 뒤 괄호의 부호를 첫 항에만 바꾼 것, 상수항에 곱하지 않은 것, 상수항의 부호를 거꾸로 한 것
      const [f, a, b, g, c, e] = d.until(() => { const q1 = d.pick([2, 4]), q2 = d.pick([3, 5]); return [Q(d.pick([1, 3]), q1), q1 * d.int(1, 3), -d.int(1, 3), Q(1, q2), q2 * d.int(1, 2), -d.int(1, 4)]; }, (t) => qsub(qmul(t[0], Q(t[1])), qmul(t[3], Q(t[4]))).p !== 0 && gcd(t[0].p * Math.abs(t[2]), t[0].q) === 1 && gcd(Math.abs(t[5]), t[3].q) === 1);
      const src = `${kp(f, ln(a, b, v))}-${kp(g, ln(c, e, v))}`, t1 = [qmul(f, Q(a)), qmul(f, Q(b))], t2 = [qmul(g, Q(c)), qmul(g, Q(e))], right = [qsub(t1[0], t2[0]), qsub(t1[1], t2[1])];
      return pickX(d, PICK, lnQ(right, v), [lnQ([right[0], qadd(t1[1], t2[1])], v), lnQ([right[0], qsub(Q(b), Q(e))], v), lnQ([right[0], qneg(right[1])], v), lnQ([qadd(t1[0], t2[0]), right[1]], v)], {
        target: src, figure: xex(src), rule: 'like-frac-scaled-out',
        explain: `분배법칙을 이용하여 괄호를 푼다. 뒤 괄호에는 ${tx(qneg(g))}${tail(lastOf(g), '을/를')} 곱하는 것이므로 두 항의 부호가 모두 바뀐다. ${xh(src)} = ${xh(pn([[t1[0], v], [t1[1], ''], [qneg(t2[0]), v], [qneg(t2[1]), '']]))} = ${xh(lnQ(right, v))}이다.`
      });
    }, { count: 2 }),
    T('like-fracform', '분수 꼴 일차식의 덧셈과 뺄셈', '①84', (d, n) => {
      // 통분하여 계산한다. 틀린 보기: 뒤 분자의 상수항 부호를 바꾸지 않은 것(뺄셈), 분자에 수를 곱하지 않고 더한 것, 분모를 없애 버린 것, 분모끼리 더한 것(덧셈)
      const v = d.pick(['x', 'a']), minus = n === 1, s = minus ? -1 : 1;
      const [q1, a, b, q2, c, e] = d.until(() => [d.pick([2, 3, 4, 6]), d.int(1, 5), coef(d, -5, 5), d.pick([2, 3, 4, 5]), d.int(1, 5), coef(d, -5, 5)], (t) => t[0] !== t[3] && lcm(t[0], t[3]) <= 12 && gcd(gcd(t[1], Math.abs(t[2])), t[0]) === 1 && gcd(gcd(t[4], Math.abs(t[5])), t[3]) === 1 && Q(t[1], t[0]).p * Q(t[3]).q + s * Q(t[4], t[3]).p !== 0
        && qadd(Q(t[1], t[0]), qmul(Q(s), Q(t[4], t[3]))).p !== 0 && qadd(Q(t[2], t[0]), qmul(Q(s), Q(t[5], t[3]))).p !== 0 && !isInt(qadd(Q(t[1], t[0]), qmul(Q(s), Q(t[4], t[3])))));
      const L = lcm(q1, q2), m1 = L / q1, m2 = L / q2, src = `[${ln(a, b, v)}|${q1}]${minus ? '-' : '+'}[${ln(c, e, v)}|${q2}]`;
      const right = [qadd(Q(a, q1), Q(s * c, q2)), qadd(Q(b, q1), Q(s * e, q2))];
      const wrongs = [lnQ([Q(a + s * c, L), Q(b + s * e, L)], v), ln(m1 * a + s * m2 * c, m1 * b + s * m2 * e, v), minus ? lnQ([right[0], qadd(Q(b, q1), Q(e, q2))], v) : lnQ([Q(a + c, q1 + q2), Q(b + e, q1 + q2)], v), lnQ([right[0], qneg(right[1])], v)];
      const num = `${kp(m1, ln(a, b, v))}${minus ? '-' : '+'}${kp(m2, ln(c, e, v))}`, top = ln(m1 * a + s * m2 * c, m1 * b + s * m2 * e, v);
      return pickX(d, PICK, lnQ(right, v), wrongs, {
        target: src, figure: xex(src), rule: 'like-fracform-' + n,
        explain: `분모의 최소공배수 ${L}${tail(L, '으로/로')} 통분한다. ${minus ? '분수 앞의 −는 분자 전체에 걸린다. ' : ''}${xh(src)} = ${xh(`[${num}|${L}]`)} = ${xh(`[${top}|${L}]`)} = ${xh(lnQ(right, v))}이다.`
      });
    }, { count: 2 }),
    T('like-fracform-more', '분수 꼴 일차식이 셋이거나 괄호와 섞인 계산', '①85', (d, n) => {
      const v = 'x';
      if (n === 0) {
        // 분모 2, 3, 6: 셋째 분자를 거꾸로 정하여 답이 정수 계수가 되게 한다.
        const [A, Bc, a1, b1, a2, b2, a3, b3] = d.until(() => { const t = [coef(d, -3, 3), coef(d, -4, 4), d.int(1, 7), coef(d, -7, 7), d.int(1, 7), coef(d, -7, 7)]; return t.concat([6 * t[0] - 3 * t[2] + 2 * t[4], 6 * t[1] - 3 * t[3] + 2 * t[5]]); }, (t) => t[6] !== 0 && t[7] !== 0 && Math.abs(t[6]) <= 9 && Math.abs(t[7]) <= 9 && Math.abs(t[6]) !== 6);
        const src = `[${ln(a1, b1, v)}|2]-[${ln(a2, b2, v)}|3]+[${ln(a3, b3, v)}|6]`, num = `${kp(3, ln(a1, b1, v))}-${kp(2, ln(a2, b2, v))}+(${ln(a3, b3, v)})`;
        return linQ(CALC, src, v, {
          figure: xex(src), explain: `분모의 최소공배수 6으로 통분한다. 분수 앞의 −는 분자 전체에 걸린다. ${xh(src)} = ${xh(`[${num}|6]`)} = ${xh(`[${ln(6 * A, 6 * Bc, v)}|6]`)} = ${xh(ln(A, Bc, v))}이다.`,
          facts: { calc: [[`(${a1}*6/2-${a2}*6/3+${signedJs(a3)}*6/6)/6`, 0], [`(${signedJs(b1)}*6/2-${signedJs(b2)}*6/3+${signedJs(b3)}*6/6)/6`, 1]], unseen: [1], rule: 'fracform-three' }
        });
      }
      const q = d.pick([2, 3, 4]), k = d.int(2, 5), [a, b, c, e] = d.until(() => [d.int(1, 4), coef(d, -5, 5), q * d.int(1, 4), q * coef(d, -4, 4)], (t) => k * t[0] - t[2] / q !== 0 && k * t[1] - t[3] / q !== 0), src = `${kp(k, ln(a, b, v))}-[${ln(c, e, v)}|${q}]`;
      return linQ(CALC, src, v, {
        figure: xex(src), explain: `분수 앞의 −는 분자 전체에 걸린다. ${xh(`[${ln(c, e, v)}|${q}]`)} = ${xh(ln(c / q, e / q, v))}이므로 ${xh(src)} = ${xh(pn([[k * a, v], [k * b, ''], [-c / q, v], [-e / q, '']]))} = ${xh(ln(k * a - c / q, k * b - e / q, v))}이다.`,
        facts: { calc: [[`${k}*${a}-${c}/${q}`, 0], [`${k}*${signedJs(b)}-${signedJs(e)}/${q}`, 1]], unseen: [1], rule: 'fracform-mixed' }
      });
    }, { count: 2 }),
    T('like-nested', '괄호가 여러 겹인 식의 계산', '①86 심44', (d, n) => {
      const v = 'x', [p, q, r, c, e] = d.until(() => [d.int(2, 9), d.int(2, 7), d.int(1, 5), d.int(1, 9), d.int(1, 9)], (t) => t[0] - t[1] + t[2] !== 0 && t[3] !== t[4] && t[0] !== t[1]);
      if (n === 0) {
        // Px − {Qx + C − (Rx + E)} = (P − Q + R)x + (E − C)
        const src = `${p}x-{${q}x+${c}-(${ln(r, e, v)})}`, inner = pn([[q, v], [c, ''], [-r, v], [-e, '']]), mid = ln(q - r, c - e, v);
        return linQ(CALC, src, v, {
          figure: xex(src), explain: `안쪽 괄호부터 차례로 푼다. 괄호 앞에 −가 있으면 괄호 안의 모든 항의 부호를 바꾼다. ${xh(src)} = ${xh(`${p}x-(${inner})`)} = ${xh(`${p}x-(${mid})`)} = ${xh(ln(p - q + r, e - c, v))}이다.`,
          facts: { calc: [[`${p}-${q}+${r}`, 0], [`${e}-${c}`, 1]], unseen: [1], rule: 'nested-brace' }
        });
      }
      // Px − [Qx − {C − (E − Rx)}] = (P − Q + R)x + (C − E)
      const src = `${p}x-<${q}x-{${c}-(${nl(e, -r, v)})}>`, s1 = `${p}x-<${q}x-(${pn([[c, ''], [-e, ''], [r, v]])})>`, s2 = `${p}x-(${pn([[q, v], [-(c - e), ''], [-r, v]])})`;
      return linQ(CALC, src, v, {
        figure: xex(src), explain: `( ), { }, [ ]의 차례로 안쪽 괄호부터 푼다. 괄호 앞에 −가 있으면 괄호 안의 모든 항의 부호를 바꾼다. ${xh(src)} = ${xh(s1)} = ${xh(s2)} = ${xh(ln(p - q + r, c - e, v))}이다.`,
        facts: { calc: [[`${p}-${q}+${r}`, 0], [`${c}-${e}`, 1]], unseen: [1], rule: 'nested-bracket' }
      });
    }, { count: 2 }),
    T('like-muldiv', '곱셈·나눗셈과 덧셈·뺄셈이 섞인 일차식의 계산', '①87 심46', (d) => {
      // (A1x + B1) ÷ (−m/q) − (1/s)(A2x + B2)
      const v = 'x', [q, m, s, A1, B1, A2, B2] = d.until(() => { const q0 = d.pick([3, 5]), m0 = d.pick([2, 4]), s0 = d.pick([2, 3, 4]); return [q0, m0, s0, m0 * d.int(1, 3), m0 * coef(d, -3, 3), s0 * d.int(1, 4), s0 * coef(d, -4, 4)]; }, (t) => -t[3] * t[0] / t[1] - t[5] / t[2] !== 0 && -t[4] * t[0] / t[1] - t[6] / t[2] !== 0 && gcd(t[0], t[1]) === 1);
      const f = Q(-m, q), src = `(${ln(A1, B1, v)}):${sn(f)}-${kp(Q(1, s), ln(A2, B2, v))}`, inv = Q(-q, m), first = [qmul(inv, Q(A1)), qmul(inv, Q(B1))];
      return linQ(CALC, src, v, {
        figure: xex(src), explain: `나눗셈은 역수의 곱셈으로 고치고, 분배법칙으로 괄호를 푼다. ${xh(src)} = ${xh(`(${ln(A1, B1, v)})*${sn(inv)}-${kp(Q(1, s), ln(A2, B2, v))}`)} = ${xh(pn([[first[0], v], [first[1], ''], [-A2 / s, v], [-B2 / s, '']]))} = ${xh(ln(first[0].p - A2 / s, first[1].p - B2 / s, v))}이다.`,
        facts: { calc: [[`${A1}*${q}/(-${m})-${A2}/${s}`, 0], [`${signedJs(B1)}*${q}/(-${m})-${signedJs(B2)}/${s}`, 1]], unseen: [1], rule: 'like-muldiv' }
      });
    }),
    T('like-claims', '일차식의 덧셈·뺄셈이 옳은 것과 옳지 않은 것', '①77·89', (d, n) => {
      const p = d.int(2, 6), q = d.int(2, 5), c = d.int(1, 6), e = d.int(1, 7), k = d.int(2, 4);
      const pool = [
        [`${p}x+${q}x`, `${p + q}x`, `${p + q}x^2`],
        [`${p}a*2-a`, `${2 * p - 1}a`, `${p}a`],
        [`-(${ln(p, -c, 'a')})+(${ln(1, e, 'a')})`, ln(-p + 1, c + e, 'a'), ln(-p + 1, e - c, 'a')],
        [`${kp(k, ln(1, c))}-(${ln(1, -e)})`, ln(k - 1, k * c + e), ln(k - 1, k * c - e)],
        [`(${ln(p + q, -c, 'a')})-(${ln(q, e, 'a')})`, ln(p, -c - e, 'a'), ln(p, e - c, 'a')],
        [`${kp(-k, ln(p, c))}+${kp(2, ln(q, -e))}`, ln(-k * p + 2 * q, -k * c - 2 * e), ln(-k * p + 2 * q, -c - 2 * e)],
        [`${p}x-${c}-${q}x+${e}`, ln(p - q, e - c), ln(p + q, e - c)],
        [`${kp(Q(1, 2), ln(2 * p, -4 * c, 'y'))}+${kp(k, ln(-1, e, 'y'))}`, ln(p - k, -2 * c + k * e, 'y'), ln(p - k, -4 * c + k * e, 'y')]
      ].filter((row) => /[a-z]/.test(row[1]) && /[a-z]/.test(row[2]) && !xsame(row[1], row[2]));     // 일차항이 없어지는 줄은 쓰지 않는다.
      return eqQ(d, `다음 중 계산이 ${n === 0 ? '옳은' : '옳지 않은'} 것은?`, pool, n === 0, { lead: '동류항끼리만 모아서 계산하고, 괄호 앞에 −가 있으면 괄호 안의 모든 항의 부호를 바꾼다. ', rule: 'like-claims-' + n });
    }, { count: 2 })
  ]);

  // ── 어떤 식 구하기와 식의 대입 ──
  B.addTypes(UNIT, 'find', [
    T('find-box', '□에 알맞은 식 구하기', '①91 심48', (d, n) => {
      const v = 'x', [a, b, c, e] = d.until(() => [coef(d, -6, 6), coef(d, -9, 9), coef(d, -6, 6), coef(d, -9, 9)], (t) => t[0] + t[2] !== 0 && t[1] + t[3] !== 0 && t[0] - t[2] !== 0 && t[1] - t[3] !== 0);
      if (n === 0) {
        const plus = d.bool(), src = plus ? `(${ln(c, e, v)})-(${ln(a, b, v)})` : `(${ln(c, e, v)})+(${ln(a, b, v)})`;
        return linQ('□ 안에 알맞은 식을 구하시오.', src, v, {
          figure: ex(`${box()} <i>${plus ? '+' : MINUS}</i> (${xe(ln(a, b, v))}) <i>=</i> ${xe(ln(c, e, v))}`, 1),
          explain: `□에${plus ? '' : '서'} ${lj(a, b, v, '을/를')} ${plus ? '더하여' : '빼어'} ${lj(c, e, v, '이/가')} 되었으므로 □ = ${xh(src)} = ${xh(ln(plus ? c - a : c + a, plus ? e - b : e + b, v))}이다.`,
          facts: { calc: [[`${signedJs(c)}${plus ? '-' : '+'}${signedJs(a)}`, 0], [`${signedJs(e)}${plus ? '-' : '+'}${signedJs(b)}`, 1]], unseen: [1], rule: 'find-box-first' }
        });
      }
      // (식) − □ = (식): 빼는 식을 구한다.
      const src = `(${ln(a, b, v)})-(${ln(c, e, v)})`;
      return linQ('□ 안에 알맞은 식을 구하시오.', src, v, {
        figure: ex(`${xe(ln(a, b, v))} <i>${MINUS}</i> (${box()}) <i>=</i> ${xe(ln(c, e, v))}`, 1),
        explain: `${xh(ln(a, b, v))}에서 □를 빼어 ${lj(c, e, v, '이/가')} 되었으므로 □는 ${xh(ln(a, b, v))}에서 ${lj(c, e, v, '을/를')} 뺀 식이다. □ = ${xh(src)} = ${xh(pn([[a, v], [b, ''], [-c, v], [-e, '']]))} = ${xh(ln(a - c, b - e, v))}이다.`,
        facts: { calc: [[`${signedJs(a)}-${signedJs(c)}`, 0], [`${signedJs(b)}-${signedJs(e)}`, 1]], unseen: [1], rule: 'find-box-taken' }
      });
    }, { count: 2 }),
    T('find-subst', '문자에 일차식을 대입하여 계산하기', '①97 심42·47', (d, n) => {
      const v = 'x', A = V('A'), Bv = V('B'), [a, b, c, e] = d.until(() => [coef(d, -5, 5), coef(d, -7, 7), coef(d, -5, 5), coef(d, -7, 7)], (t) => t[0] !== t[2] && t[1] !== t[3]);
      const defs = `${nb(`${A} = ${htmlX(X(ln(a, b, v)))}`)}, ${nb(`${Bv} = ${htmlX(X(ln(c, e, v)))}`)}`, PUT = '식을 대입할 때는 괄호를 사용한다. ';
      if (n === 0) {
        // A + B − C: 세 식을 더하고 뺀다.
        const [f, g] = d.until(() => [coef(d, -4, 4), coef(d, -7, 7)], (t) => a + c - t[0] !== 0 && b + e - t[1] !== 0), Cv = V('C'), src = `(${nl(b, a, v)})+(${ln(c, e, v)})-(${ln(f, g, v)})`;
        return linQ(`${nb(`${A} = ${htmlX(X(nl(b, a, v)))}`)}, ${nb(`${Bv} = ${htmlX(X(ln(c, e, v)))}`)}, ${nb(`${Cv} = ${htmlX(X(ln(f, g, v)))}`)}일 때, ${nb(`${A} + ${Bv} − ${Cv}`)}를 계산하시오.`, src, v, {
          explain: `${PUT}${nb(`${A} + ${Bv} − ${Cv}`)} = ${xh(src)} = ${xh(pn([[b, ''], [a, v], [c, v], [e, ''], [-f, v], [-g, '']]))} = ${xh(ln(a + c - f, b + e - g, v))}이다.`,
          facts: { calc: [[`${signedJs(a)}+${signedJs(c)}-${signedJs(f)}`, 0], [`${signedJs(b)}+${signedJs(e)}-${signedJs(g)}`, 1]], unseen: [1], rule: 'find-subst-three' }
        });
      }
      if (n === 1) {
        const [m, k] = d.until(() => [d.int(2, 4), d.int(2, 4)], ([x, y]) => x !== y && x * a - y * c !== 0 && x * b - y * e !== 0), src = `${kp(m, ln(a, b, v))}-${kp(k, ln(c, e, v))}`;
        return linQ(`${defs}일 때, ${nb(`${m}${A} − ${k}${Bv}`)}를 계산하시오.`, src, v, {
          explain: `${PUT}${nb(`${m}${A} − ${k}${Bv}`)} = ${xh(src)} = ${xh(pn([[m * a, v], [m * b, ''], [-k * c, v], [-k * e, '']]))} = ${xh(ln(m * a - k * c, m * b - k * e, v))}이다.`,
          facts: { calc: [[`${m}*${signedJs(a)}-${k}*${signedJs(c)}`, 0], [`${m}*${signedJs(b)}-${k}*${signedJs(e)}`, 1]], unseen: [1], rule: 'find-subst-scaled' }
        });
      }
      // A/3 + B/2: 분수 꼴로 더한다(답의 계수가 분수이므로 고르기).
      const [q1, q2] = d.pick([[3, 2], [2, 3], [2, 5], [4, 3]]), L = q1 * q2, [a2, b2, c2, e2] = d.until(() => [d.int(1, 4), coef(d, -5, 5), d.int(1, 4), coef(d, -5, 5)], (t) => !isInt(qadd(Q(t[0], q1), Q(t[2], q2))) && qadd(Q(t[1], q1), Q(t[3], q2)).p !== 0);
      const src = `[${ln(a2, b2, v)}|${q1}]+[${ln(c2, e2, v)}|${q2}]`, right = [qadd(Q(a2, q1), Q(c2, q2)), qadd(Q(b2, q1), Q(e2, q2))], num = `${kp(q2, ln(a2, b2, v))}+${kp(q1, ln(c2, e2, v))}`;
      return pickX(d, `${nb(`${A} = ${htmlX(X(ln(a2, b2, v)))}`)}, ${nb(`${Bv} = ${htmlX(X(ln(c2, e2, v)))}`)}일 때, ${nb(`${frac(A, q1)} + ${frac(Bv, q2)}`)}를 계산한 것은?`, lnQ(right, v), [lnQ([Q(a2 + c2, L), Q(b2 + e2, L)], v), lnQ([Q(a2 + c2, q1 + q2), Q(b2 + e2, q1 + q2)], v), ln(q2 * a2 + q1 * c2, q2 * b2 + q1 * e2, v), lnQ([right[0], qneg(right[1])], v)], {
        target: src, rule: 'find-subst-frac',
        explain: `${PUT}${nb(`${frac(A, q1)} + ${frac(Bv, q2)}`)} = ${xh(src)} = ${xh(`[${num}|${L}]`)} = ${xh(`[${ln(q2 * a2 + q1 * c2, q2 * b2 + q1 * e2, v)}|${L}]`)} = ${xh(lnQ(right, v))}이다.`
      });
    }, { count: 3 }),
    T('find-pyramid', '위 칸이 아래 두 칸의 합인 그림에서 맨 위 칸의 식', '①99', (d) => {
      const v = 'x', cells = d.until(() => [[coef(d, -4, 4), coef(d, -5, 5)], [coef(d, -4, 4), coef(d, -5, 5)], [coef(d, -4, 4), coef(d, -5, 5)]], (t) => t[0][0] + 2 * t[1][0] + t[2][0] !== 0 && t[0][1] + 2 * t[1][1] + t[2][1] !== 0 && t.some((c0) => c0[0] < 0));
      const bottom = cells.map(([a, b]) => ln(a, b, v)), m1 = [cells[0][0] + cells[1][0], cells[0][1] + cells[1][1]], m2 = [cells[1][0] + cells[2][0], cells[1][1] + cells[2][1]], src = `(${bottom[0]})+(${bottom[1]})+(${bottom[1]})+(${bottom[2]})`;
      return linQ('위 칸의 식은 바로 아래 두 칸에 적힌 식의 합이다. ㉠에 알맞은 식을 구하시오.', src, v, {
        figure: pyrFig(bottom, ['', ''], LAB[0]),
        explain: `가운데 층의 두 칸은 왼쪽부터 ${xh(`(${bottom[0]})+(${bottom[1]})`)} = ${xh(pn([[m1[0], v], [m1[1], '']]))}, ${xh(`(${bottom[1]})+(${bottom[2]})`)} = ${xh(pn([[m2[0], v], [m2[1], '']]))}이다. ㉠은 이 두 식의 합이므로 ${xh(ln(m1[0] + m2[0], m1[1] + m2[1], v))}이다.`,
        facts: { calc: [[`${signedJs(cells[0][0])}+${signedJs(cells[1][0])}+${signedJs(cells[1][0])}+${signedJs(cells[2][0])}`, 0], [`${signedJs(cells[0][1])}+${signedJs(cells[1][1])}+${signedJs(cells[1][1])}+${signedJs(cells[2][1])}`, 1]], unseen: [1] }
      });
    }),
    T('find-shaded', '큰 도형에서 작은 도형을 뺀 부분의 넓이', '①101·102 심58', (d, n) => {
      const sq = `cm${sup(2)}`;
      if (n === 0) {
        // 큰 직사각형 (x + c) × H 에서 작은 직사각형 x × h 를 뺀다.
        const c = d.int(2, 6), H = d.int(6, 12), h = d.int(2, H - 2), src = `${kp(H, `x+${c}`)}-${h}x`;
        return linQ(`그림에서 색칠한 부분의 넓이를 ${V('x')}를 사용한 식으로 간단히 나타내시오.`, src, 'x', {
          unit: sq, figure: cornerFig([`x+${c}`, String(H)], ['x', String(h)], 'cm', h / H),
          explain: `큰 직사각형의 넓이 ${xh(kp(H, `x+${c}`))}에서 작은 직사각형의 넓이 ${xh(`${h}x`)}를 뺀다. ${xh(src)} = ${xh(pn([[H, 'x'], [H * c, ''], [-h, 'x']]))} = ${xh(ln(H - h, H * c))}이다.`,
          facts: { calc: [[`${H}-${h}`, 0], [`${H}*${c}`, 1]], rule: 'find-shaded-corner' }
        });
      }
      // 꽃밭 둘레의 폭이 일정한 길: 바깥 직사각형 (x + 2w) × (H + 2w) 에서 꽃밭 x × H 를 뺀다.
      const w = d.int(1, 3), H = d.int(4, 9), src = `${kp(H + 2 * w, `x+${2 * w}`)}-${H}x`;
      return linQ(`그림과 같이 가로의 길이가 ${V('x')} m, 세로의 길이가 ${H} m인 직사각형 모양의 꽃밭 둘레에 폭이 ${w} m로 일정한 길을 만들었다. 길의 넓이를 ${V('x')}를 사용한 식으로 간단히 나타내시오.`, src, 'x', {
        unit: `m${sup(2)}`, figure: frameFig(['x', String(H)], w, 'm', '꽃밭'),
        explain: `길의 바깥쪽 직사각형은 가로가 ${withUnit(`x+${2 * w}`, 'm')}, 세로가 ${H + 2 * w} m이다. 바깥쪽 직사각형의 넓이에서 꽃밭의 넓이를 빼면 ${xh(src)} = ${xh(pn([[H + 2 * w, 'x'], [(H + 2 * w) * 2 * w, ''], [-H, 'x']]))} = ${xh(ln(2 * w, (H + 2 * w) * 2 * w))}이다.`,
        facts: { calc: [[`2*${w}`, 0], [`2*${w}*(${H}+2*${w})`, 1]], unseen: [2], rule: 'find-shaded-frame' }
      });
    }, { count: 2 }),
    T('find-perimeter', '변의 길이가 일차식인 직사각형의 둘레의 길이', '①103', (d) => {
      const p = d.int(2, 4), q = coef(d, -3, 6), side = ln(p, q), src = `2{x+(${side})}`;
      return linQ(`그림과 같이 가로의 길이가 ${V('x')} cm, 세로의 길이가 ${withUnit(side, 'cm')}인 직사각형의 둘레의 길이를 ${V('x')}를 사용한 식으로 간단히 나타내시오.`, src, 'x', {
        unit: 'cm', figure: rectFig(['x', 'cm'], [side, 'cm'], { w: 96, h: 96 }),
        explain: `(직사각형의 둘레의 길이) = 2 × {(가로의 길이) + (세로의 길이)}이므로 ${xh(src)} = ${xh(kp(2, ln(p + 1, q)))} = ${xh(ln(2 * (p + 1), 2 * q))}이다.`,
        facts: { calc: [[`2*(1+${p})`, 0], [`2*${signedJs(q)}`, 1]], unseen: [1, 2] }
      });
    })
  ]);

  // 실력 문항 파일(7-1-3c.js)이 함께 쓰는 도구
  Object.assign(K, { sn, sm, qs, ts, distTold, signedJs, coef, lnQ, pyrFig, cornerFig, frameFig, degOf, listed, CALC, PICK, DIST, RECIP, LIKE, X2 });
})(typeof window !== 'undefined' ? window : globalThis);
